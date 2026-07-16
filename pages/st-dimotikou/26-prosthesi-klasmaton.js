import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// ΕΞΩΤΕΡΙΚΕΣ ΜΕΤΑΒΛΗΤΕΣ ΡΥΘΜΙΣΗΣ
const MAX_DENOMINATOR = 100;
const MAX_NUMERATOR_MULTIPLIER = 3; // Ο αριθμητής μπορεί να γίνει έως 3 φορές ο παρονομαστής

// Βοηθητική συνάρτηση για εύρεση Μέγιστου Κοινού Διαιρέτη (ΜΚΔ) για την απλοποίηση
const findGCD = (a, b) => {
  return b === 0 ? a : findGCD(b, a % b);
};

// Βοηθητική συνάρτηση για εύρεση Ελάχιστου Κοινού Πολλαπλάσιου (ΕΚΠ)
const findLCM = (a, b) => {
  return (a * b) / findGCD(a, b);
};

export default function ProsthesiKlasmatonPage() {
  // Κλάσμα Α (Αριστερά)
  const [numA, setNumA] = useState(1);
  const [denA, setDenA] = useState(3);

  // Κλάσμα Β (Δεξιά)
  const [numB, setNumB] = useState(1);
  const [denB, setDenB] = useState(2);

  // Μέγιστος επιτρεπτός αριθμητής βάσει του παρονομαστή
  const getMaxNumerator = (denominator) => {
    const activeDen = Number(denominator) || 1;
    return Math.min(activeDen * MAX_NUMERATOR_MULTIPLIER, MAX_DENOMINATOR * MAX_NUMERATOR_MULTIPLIER);
  };

  // Ασφαλής έλεγχος εισαγωγής κειμένου
  const handleInputChange = (setter, val, currentDen, isDenominator = false) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setter('');
      return;
    }
    const n = Number(clean);
    
    if (isDenominator) {
      if (n === 0 || n > MAX_DENOMINATOR) return;
      setter(n);
      const maxNumForNewDen = n * MAX_NUMERATOR_MULTIPLIER;
      if (setter === setDenA && numA > maxNumForNewDen) setNumA(maxNumForNewDen);
      if (setter === setDenB && numB > maxNumForNewDen) setNumB(maxNumForNewDen);
    } else {
      const maxAllowedNum = getMaxNumerator(currentDen);
      if (n > maxAllowedNum) return;
      setter(n);
    }
  };

  // Αυξομείωση με κουμπιά για το Κλάσμα Α
  const adjustValueA = (type, amount) => {
    if (type === 'num') {
      const maxNum = getMaxNumerator(denA);
      setNumA(prev => Math.max(0, Math.min(maxNum, (Number(prev) || 0) + amount)));
    } else {
      setDenA(prev => {
        const nextDen = Math.max(1, Math.min(MAX_DENOMINATOR, (Number(prev) || 1) + amount));
        const maxNum = getMaxNumerator(nextDen);
        if (numA > maxNum) setNumA(maxNum);
        return nextDen;
      });
    }
  };

  // Αυξομείωση με κουμπιά για το Κλάσμα Β
  const adjustValueB = (type, amount) => {
    if (type === 'num') {
      const maxNum = getMaxNumerator(denB);
      setNumB(prev => Math.max(0, Math.min(maxNum, (Number(prev) || 0) + amount)));
    } else {
      setDenB(prev => {
        const nextDen = Math.max(1, Math.min(MAX_DENOMINATOR, (Number(prev) || 1) + amount));
        const maxNum = getMaxNumerator(nextDen);
        if (numB > maxNum) setNumB(maxNum);
        return nextDen;
      });
    }
  };

  // Ενεργές τιμές για υπολογισμούς
  const activeNumA = numA === '' ? 0 : Number(numA);
  const activeDenA = denA === '' || denA === 0 ? 1 : Number(denA);
  const activeNumB = numB === '' ? 0 : Number(numB);
  const activeDenB = denB === '' || denB === 0 ? 1 : Number(denB);

  // Υπολογισμός Αθροίσματος
  // α/β + γ/δ = (α·δ + γ·β) / (β·δ)
  const rawResultNum = activeNumA * activeDenB + activeNumB * activeDenA;
  const rawResultDen = activeDenA * activeDenB;

  // Απλοποίηση Αποτελέσματος
  const gcdResult = findGCD(rawResultNum, rawResultDen);
  const simplifiedNum = rawResultNum / gcdResult;
  const simplifiedDen = rawResultDen / gcdResult;

  // Επεξηγηματικό παιδαγωγικό μήνυμα βήμα-βήμα
  const getStepByStepExplanation = () => {
    if (activeDenA === activeDenB) {
      return (
        <div className="space-y-2">
          <p className="text-blue-800 font-bold">🔵 Τα κλάσματα είναι ομώνυμα (ίδιος παρονομαστής: {activeDenA})</p>
          <p className="text-slate-600">
            Προσθέτουμε μόνο τους αριθμητές και αφήνουμε τον ίδιο παρονομαστή:
          </p>
          <div className="bg-white p-3 rounded-xl border border-blue-100 font-mono text-xs md:text-sm">
            <span className="text-blue-600">{activeNumA}</span>/{activeDenA} + <span className="text-orange-600">{activeNumB}</span>/{activeDenB} = ({activeNumA} + {activeNumB})/{activeDenA} = <strong>{rawResultNum}/{activeDenA}</strong>
          </div>
          {gcdResult > 1 && (
            <p className="text-emerald-700 text-xs font-bold">
              ✨ Απλοποιώντας με το {gcdResult}, το τελικό κλάσμα γίνεται: {simplifiedNum}/{simplifiedDen}
            </p>
          )}
        </div>
      );
    }

    // Ετερώνυμα
    const lcm = findLCM(activeDenA, activeDenB);
    const multiplierA = lcm / activeDenA;
    const multiplierB = lcm / activeDenB;
    const equivalentNumA = activeNumA * multiplierA;
    const equivalentNumB = activeNumB * multiplierB;

    return (
      <div className="space-y-3">
        <p className="text-indigo-800 font-bold">🟣 Τα κλάσματα είναι ετερώνυμα (διαφορετικοί παρονομαστές: {activeDenA} ≠ {activeDenB})</p>
        <div className="text-slate-600 space-y-1.5 text-xs md:text-sm">
          <p>
            1. Βρίσκουμε το <strong>Ε.Κ.Π.</strong> των παρονομαστών {activeDenA} και {activeDenB}, το οποίο είναι το <strong>{lcm}</strong>.
          </p>
          <p>
            2. Βάζουμε «καπελάκια» και κάνουμε τα κλάσματα ομώνυμα:
            <br />
            • Πολλαπλασιάζουμε το 1ο κλάσμα με το <strong>({multiplierA})</strong>: ({activeNumA} × {multiplierA}) / ({activeDenA} × {multiplierA}) = <strong>{equivalentNumA}/{lcm}</strong>
            <br />
            • Πολλαπλασιάζουμε το 2ο κλάσμα με το <strong>({multiplierB})</strong>: ({activeNumB} × {multiplierB}) / ({activeDenB} × {multiplierB}) = <strong>{equivalentNumB}/{lcm}</strong>
          </p>
          <p>
            3. Τώρα που έγιναν ομώνυμα, τα προσθέτουμε:
          </p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-indigo-100 font-mono text-xs md:text-sm">
          {equivalentNumA}/{lcm} + {equivalentNumB}/{lcm} = ({equivalentNumA} + {equivalentNumB})/{lcm} = <strong>{rawResultNum}/{lcm}</strong>
        </div>
        {gcdResult > 1 && (
          <p className="text-emerald-700 text-xs font-bold">
            ✨ Απλοποιώντας με το {gcdResult}, το τελικό κλάσμα γίνεται: {simplifiedNum}/{simplifiedDen}
          </p>
        )}
      </div>
    );
  };

  // Έξυπνη σχεδίαση πολλαπλών κυκλικών διαγραμμάτων
  const renderFractionVisual = (num, den, fillColor = 'fill-blue-500', strokeColor = 'stroke-blue-700') => {
    const totalPizzasNeeded = Math.max(1, Math.ceil(num / den));
    const pizzas = [];

    const radius = 45;
    const cx = 55;
    const cy = 55;

    for (let p = 0; p < totalPizzasNeeded; p++) {
      const slices = [];
      const remainingNumForThisPizza = Math.max(0, Math.min(den, num - p * den));

      for (let i = 0; i < den; i++) {
        const angleStep = 360 / den;
        const startAngle = i * angleStep - 90;
        const endAngle = (i + 1) * angleStep - 90;

        const rad1 = (startAngle * Math.PI) / 180;
        const rad2 = (endAngle * Math.PI) / 180;

        const x1 = cx + radius * Math.cos(rad1);
        const y1 = cy + radius * Math.sin(rad1);
        const x2 = cx + radius * Math.cos(rad2);
        const y2 = cy + radius * Math.sin(rad2);

        const largeArcFlag = angleStep > 180 ? 1 : 0;

        const d = den === 1
          ? `M ${cx} ${cy} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
          : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

        const isFilled = i < remainingNumForThisPizza;

        slices.push(
          <path
            key={i}
            d={d}
            className={`${
              isFilled ? `${fillColor} ${strokeColor}` : 'fill-slate-100 stroke-slate-300'
            } transition-colors duration-200 stroke-[0.7]`}
          />
        );
      }

      pizzas.push(
        <div key={p} className="relative">
          <svg width="110" height="110" className="drop-shadow-sm overflow-visible">
            {slices}
            <circle cx={cx} cy={cy} r="2" className="fill-slate-800" />
          </svg>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-2 max-w-[240px] p-2 bg-white rounded-xl border border-slate-100 shadow-inner">
        {pizzas}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>➕ Πρόσθεση Κλασμάτων - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/st-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-8`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ ΠΡΟΣΘΕΣΗΣ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span>📖</span> Πώς προσθέτουμε Κλάσματα;
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch text-xs md:text-sm">
              {/* Περίπτωση 1 */}
              <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-100 space-y-3">
                <span className="font-black text-blue-800 block text-sm">1. Ομώνυμα Κλάσματα (Ίδιοι Παρονομαστές)</span>
                <p className="text-slate-600 leading-relaxed">
                  Όταν οι παρονομαστές είναι ίδιοι, <strong>προσθέτουμε μόνο τους αριθμητές</strong> μεταξύ τους και αφήνουμε τον <strong>ίδιο παρονομαστή</strong> στο αποτέλεσμα.
                </p>
                <span className="font-mono text-xs font-bold text-blue-700 bg-white px-3 py-1 rounded border inline-block">2/7 + 3/7 = (2+3)/7 = 5/7</span>
              </div>

              {/* Περίπτωση 2 */}
              <div className="bg-indigo-50/60 p-5 rounded-xl border border-indigo-100 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="font-black text-indigo-800 block text-sm">2. Ετερώνυμα Κλάσματα (Διαφορετικοί Παρονομαστές)</span>
                  <p className="text-slate-600 leading-relaxed">
                    Δεν μπορούμε να τα προσθέσουμε απευθείας! Πρέπει πρώτα να τα κάνουμε <strong>ομώνυμα</strong> βρίσκοντας το <strong>Ε.Κ.Π.</strong> των παρονομαστών τους και χρησιμοποιώντας τα «καπελάκια».
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-indigo-700 bg-white px-3 py-1 rounded border inline-block mt-2">Ε.Κ.Π.(2, 3) = 6</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ ΕΙΣΑΓΩΓΗΣ (ΚΛΑΣΜΑ Α & ΚΛΑΣΜΑ Β) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Διάλεξε Κλάσματα</h3>
                  <p className="text-gray-500 text-xs">Όριο παρονομαστή: {MAX_DENOMINATOR}.</p>
                  <p className="text-gray-400 text-[10px]">Ο αριθμητής μπορεί να φτάσει έως και {MAX_NUMERATOR_MULTIPLIER} φορές τον παρονομαστή.</p>
                </div>

                {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Α (ΜΠΛΕ) */}
                <div className="bg-blue-50/40 p-4 rounded-2xl border border-blue-100 space-y-3">
                  <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">🔵 Κλάσμα Α (Αριστερό)</span>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητής</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => adjustValueA('num', -1)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">-</button>
                        <input
                          type="text"
                          value={numA}
                          onChange={(e) => handleInputChange(setNumA, e.target.value, denA, false)}
                          className="w-full text-center font-mono font-black text-sm outline-none text-blue-600"
                        />
                        <button onClick={() => adjustValueA('num', 1)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">+</button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστής</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => adjustValueA('den', -1)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">-</button>
                        <input
                          type="text"
                          value={denA}
                          onChange={(e) => handleInputChange(setDenA, e.target.value, denA, true)}
                          className="w-full text-center font-mono font-black text-sm outline-none text-blue-600"
                        />
                        <button onClick={() => adjustValueA('den', 1)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Β (ΠΟΡΤΟΚΑΛΙ) */}
                <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-100 space-y-3">
                  <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">🟠 Κλάσμα Β (Δεξί)</span>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητής</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => adjustValueB('num', -1)} className="px-1.5 font-bold text-orange-600 hover:bg-slate-50 rounded">-</button>
                        <input
                          type="text"
                          value={numB}
                          onChange={(e) => handleInputChange(setNumB, e.target.value, denB, false)}
                          className="w-full text-center font-mono font-black text-sm outline-none text-orange-600"
                        />
                        <button onClick={() => adjustValueB('num', 1)} className="px-1.5 font-bold text-orange-600 hover:bg-slate-50 rounded">+</button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστής</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => adjustValueB('den', -1)} className="px-1.5 font-bold text-orange-600 hover:bg-slate-50 rounded">-</button>
                        <input
                          type="text"
                          value={denB}
                          onChange={(e) => handleInputChange(setDenB, e.target.value, denB, true)}
                          className="w-full text-center font-mono font-black text-sm outline-none text-orange-600"
                        />
                        <button onClick={() => adjustValueB('den', 1)} className="px-1.5 font-bold text-orange-600 hover:bg-slate-50 rounded">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Βήμα-Βήμα Επεξήγηση */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                {getStepByStepExplanation()}
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ & ΠΙΤΣΕΣ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[550px] space-y-8">
              
              {/* ΜΕΓΑΛΗ ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ */}
              <div className="flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4 sm:gap-6 font-mono font-black text-2xl md:text-4xl select-none">
                  {/* Κλάσμα Α */}
                  <div className="flex flex-col items-center">
                    <span className="text-blue-600">{activeNumA}</span>
                    <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                    <span className="text-blue-600">{activeDenA}</span>
                  </div>

                  {/* Σύμβολο + */}
                  <div className="text-2xl md:text-3xl text-indigo-500">+</div>

                  {/* Κλάσμα Β */}
                  <div className="flex flex-col items-center">
                    <span className="text-orange-600">{activeNumB}</span>
                    <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                    <span className="text-orange-600">{activeDenB}</span>
                  </div>

                  {/* Σύμβολο = */}
                  <div className="text-2xl md:text-3xl text-indigo-500">=</div>

                  {/* Αποτέλεσμα (Αρχικό/Απλοποιημένο) */}
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                      <span className="text-emerald-600">{rawResultNum}</span>
                      <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-emerald-600">{activeDenA * activeDenB}</span>
                    </div>

                    {gcdResult > 1 && (
                      <>
                        <div className="text-xs text-slate-400 font-bold">ή</div>
                        <div className="flex flex-col items-center bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <span className="text-emerald-700">{simplifiedNum}</span>
                          <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                          <span className="text-emerald-700">{simplifiedDen}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ (ΚΥΚΛΙΚΑ ΣΧΗΜΑΤΑ) */}
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center sm:text-left">🍕 Οπτική Πρόσθεση (Μοντέλο Πίτσας)</span>
                
                <div className="flex flex-col lg:flex-row items-center justify-around gap-6 py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 min-h-[180px]">
                  {/* Πίτσα Α */}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Πίτσα Α ({activeNumA}/{activeDenA})</span>
                    {renderFractionVisual(activeNumA, activeDenA, 'fill-blue-500', 'stroke-blue-700')}
                  </div>

                  {/* Σύμβολο Συν στο γραφικό */}
                  <div className="text-2xl text-slate-400 font-black">+</div>

                  {/* Πίτσα Β */}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">Πίτσα Β ({activeNumB}/{activeDenB})</span>
                    {renderFractionVisual(activeNumB, activeDenB, 'fill-orange-500', 'stroke-orange-700')}
                  </div>

                  {/* Σύμβολο Ίσον στο γραφικό */}
                  <div className="text-2xl text-slate-400 font-black">=</div>

                  {/* Πίτσα Αποτέλεσμα */}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Αποτέλεσμα ({rawResultNum}/{activeDenA * activeDenB})</span>
                    {renderFractionVisual(rawResultNum, activeDenA * activeDenB, 'fill-emerald-500', 'stroke-emerald-700')}
                  </div>
                </div>
              </div>

              {/* Τελικό Συμπέρασμα */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-4 rounded-xl text-center font-mono font-black text-xs md:text-sm shadow-md">
                💡 Αν το αποτέλεσμα είναι μεγαλύτερο από 1 (καταχρηστικό κλάσμα), χρειαζόμαστε περισσότερες από μία πίτσες!
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Πρόσθεση Κλασμάτων - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

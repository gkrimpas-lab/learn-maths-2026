import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Όρια ρυθμίσεων
const MAX_VAL = 12; 

// Βοηθητική συνάρτηση για εύρεση Μέγιστου Κοινού Διαιρέτη (ΜΚΔ)
const findGCD = (a, b) => {
  return b === 0 ? a : findGCD(b, a % b);
};

export default function PollaplasiasmosKlasmatonPage() {
  // Mode: 'fraction-fraction' (κλάσμα με κλάσμα) ή 'number-fraction' (αριθμός με κλάσμα)
  const [mode, setMode] = useState('fraction-fraction');

  // Κατάσταση για Κλάσμα Α (ή Ακέραιο Α)
  const [numA, setNumA] = useState(2); 
  const [denA, setDenA] = useState(3);

  // Κατάσταση για Κλάσμα Β
  const [numB, setNumB] = useState(3);
  const [denB, setDenB] = useState(4);

  // Έλεγχος εισαγωγής κειμένου
  const handleInputChange = (setter, val, isDenominator = false) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setter('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_VAL) return;
    if (isDenominator && n === 0) return;
    setter(n);
  };

  // Αυξομείωση με κουμπιά
  const adjustValue = (setter, currentVal, amount, isDenominator = false) => {
    const next = (Number(currentVal) || 0) + amount;
    const min = isDenominator ? 1 : 0;
    if (next >= min && next <= MAX_VAL) {
      setter(next);
    }
  };

  // Ενεργές τιμές
  const activeNumA = numA === '' ? 0 : Number(numA);
  const activeDenA = denA === '' || denA === 0 ? 1 : Number(denA);
  const activeNumB = numB === '' ? 0 : Number(numB);
  const activeDenB = denB === '' || denB === 0 ? 1 : Number(denB);

  // Υπολογισμοί Γινομένου
  let resultNum = 0;
  let resultDen = 1;

  if (mode === 'fraction-fraction') {
    resultNum = activeNumA * activeNumB;
    resultDen = activeDenA * activeDenB;
  } else {
    resultNum = activeNumA * activeNumB;
    resultDen = activeDenB;
  }

  const gcd = findGCD(resultNum, resultDen);
  const simplifiedNum = resultNum / gcd;
  const simplifiedDen = resultDen / gcd;
  const isSimplified = gcd > 1 && resultNum !== 0;

  // ΔΙΟΡΘΩΘΗΚΕ: Σχεδίαση Πλέγματος με απόλυτα ισομεγεθή τετραγωνάκια
  const renderGridVisual = () => {
    const rows = activeDenA;
    const cols = activeDenB;
    
    const filledRows = Math.min(activeNumA, rows);
    const filledCols = Math.min(activeNumB, cols);

    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isSelectedA = r < filledRows; 
        const isSelectedB = c < filledCols; 
        const isOverlap = isSelectedA && isSelectedB; 

        let cellBg = 'bg-white border-slate-200';

        if (isOverlap) {
          cellBg = 'bg-violet-500 border-violet-600 shadow-sm';
        } else if (isSelectedA) {
          cellBg = 'bg-blue-300 border-blue-400';
        } else if (isSelectedB) {
          cellBg = 'bg-orange-300 border-orange-400';
        }

        cells.push(
          <div
            key={`${r}-${c}`}
            className={`border w-full h-full transition-colors duration-300 ${cellBg}`}
            style={{ aspectRatio: '1/1' }}
          />
        );
      }
    }

    return (
      <div className="flex flex-col items-center space-y-4 w-full max-w-sm mx-auto p-2">
        {/* Χρήση inline στυλ για δυναμικό grid-template-columns ώστε να κλειδώνει η γεωμετρία */}
        <div 
          className="grid gap-0.5 border-2 border-slate-300 p-1.5 rounded-xl bg-slate-100 shadow-inner w-full"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {cells}
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-xs font-bold pt-2">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-300 rounded border border-blue-400" /> Κλάσμα 1 ({activeNumA}/{activeDenA})</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-300 rounded border border-orange-400" /> Κλάσμα 2 ({activeNumB}/{activeDenB})</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-violet-500 rounded border border-violet-600" /> Κοινή Περιοχή ({resultNum}/{resultDen})</span>
        </div>
      </div>
    );
  };

  // Σχεδίαση Κυκλικών Διαγραμμάτων (Πίτσες) για Ακέραιος x Κλάσμα
  const renderPizzasVisual = (num, den, fillColor = 'fill-blue-500', strokeColor = 'stroke-blue-700') => {
    const totalPizzasNeeded = Math.max(1, Math.ceil(num / den));
    const pizzas = [];

    const radius = 40;
    const cx = 50;
    const cy = 50;

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
        <div key={p} className="relative flex flex-col items-center">
          <svg width="100" height="100" className="drop-shadow-sm overflow-visible">
            {slices}
            <circle cx={cx} cy={cy} r="2" className="fill-slate-800" />
          </svg>
          <span className="text-[10px] font-bold text-slate-400 mt-1">Κομμάτια: {remainingNumForThisPizza}/{den}</span>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-inner max-w-full">
        {pizzas}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>✖️ Πολλαπλασιασμός Κλασμάτων - LearnMaths.gr</title>
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
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span>📖</span> Πώς πολλαπλασιάζουμε Κλάσματα;
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch text-xs md:text-sm">
              <div className="bg-blue-50/60 p-5 rounded-xl border border-blue-100 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="font-black text-blue-800 block text-sm">1. Κλάσμα επί Κλάσμα</span>
                  <p className="text-slate-600 leading-relaxed">
                    Για να πολλαπλασιάσουμε δύο κλάσματα, κάνουμε έναν νέο αριθμητή πολλαπλασιάζοντας τους <strong>αριθμητές μεταξύ τους</strong>, και έναν νέο παρονομαστή πολλαπλασιάζοντας τους <strong>παρονομαστές μεταξύ τους</strong>.
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-blue-700 bg-white px-3 py-1.5 rounded border inline-block mt-3 self-start">
                  (α/β) × (γ/δ) = (α × γ) / (β × δ)
                </span>
              </div>

              <div className="bg-indigo-50/60 p-5 rounded-xl border border-indigo-100 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="font-black text-indigo-800 block text-sm">2. Ακέραιος επί Κλάσμα</span>
                  <p className="text-slate-600 leading-relaxed">
                    Για να πολλαπλασιάσουμε έναν ακέραιο με κλάσμα, πολλαπλασιάζουμε τον <strong>ακέραιο μόνο με τον αριθμητή</strong> του κλάσματος. Ο παρονομαστής μένει ίδιος (αφού ο ακέραιος θεωρείται κλάσμα με παρονομαστή 1).
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-indigo-700 bg-white px-3 py-1.5 rounded border inline-block mt-3 self-start">
                  α × (β/γ) = (α × β) / γ
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΕΠΙΛΟΓΗ ΛΕΙΤΟΥΡΓΙΑΣ */}
          <div className="flex justify-center">
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex gap-1">
              <button
                onClick={() => { setMode('fraction-fraction'); setNumA(2); setDenA(3); }}
                className={`px-6 py-3 rounded-xl text-xs md:text-sm font-bold transition ${
                  mode === 'fraction-fraction' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                ✖️ Κλάσμα επί Κλάσμα
              </button>
              <button
                onClick={() => { setMode('number-fraction'); setNumA(3); }}
                className={`px-6 py-3 rounded-xl text-xs md:text-sm font-bold transition ${
                  mode === 'number-fraction' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                🔢 Ακέραιος επί Κλάσμα
              </button>
            </div>
          </div>

          {/* SECTION 3: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Όρισε τις τιμές</h3>
                  <p className="text-gray-500 text-xs">Μέγιστη τιμή ορίων: {MAX_VAL}.</p>
                </div>

                {/* ΧΕΙΡΙΣΤΗΡΙΟ Α (ΑΚΕΡΑΙΟΣ Η ΚΛΑΣΜΑ Α) */}
                {mode === 'fraction-fraction' ? (
                  <div className="bg-blue-50/40 p-4 rounded-2xl border border-blue-100 space-y-3">
                    <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">🔵 Κλασμα 1</span>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητης</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                          <button onClick={() => adjustValue(setNumA, numA, -1)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">-</button>
                          <input
                            type="text"
                            value={numA}
                            onChange={(e) => handleInputChange(setNumA, e.target.value, false)}
                            className="w-full text-center font-mono font-black text-sm outline-none text-blue-600"
                          />
                          <button onClick={() => adjustValue(setNumA, numA, 1)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">+</button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστης</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                          <button onClick={() => adjustValue(setDenA, denA, -1, true)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">-</button>
                          <input
                            type="text"
                            value={denA}
                            onChange={(e) => handleInputChange(setDenA, e.target.value, true)}
                            className="w-full text-center font-mono font-black text-sm outline-none text-blue-600"
                          />
                          <button onClick={() => adjustValue(setDenA, denA, 1, true)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100 space-y-3">
                    <span className="text-xs font-black text-indigo-800 uppercase block tracking-wider">🔢 Φυσικός Αριθμός (Ακέραιος)</span>
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Τιμή</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 max-w-[160px] mx-auto">
                        <button onClick={() => adjustValue(setNumA, numA, -1)} className="px-2 py-1 font-bold text-indigo-600 hover:bg-slate-50 rounded">-</button>
                        <input
                          type="text"
                          value={numA}
                          onChange={(e) => handleInputChange(setNumA, e.target.value, false)}
                          className="w-full text-center font-mono font-black text-sm outline-none text-indigo-600"
                        />
                        <button onClick={() => adjustValue(setNumA, numA, 1)} className="px-2 py-1 font-bold text-indigo-600 hover:bg-slate-50 rounded">+</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ΧΕΙΡΙΣΤΗΡΙΟ Β (ΚΛΑΣΜΑ Β) */}
                <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-100 space-y-3">
                  <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">🟠 Κλασμα 2</span>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητης</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => adjustValue(setNumB, numB, -1)} className="px-1.5 font-bold text-orange-600 hover:bg-slate-50 rounded">-</button>
                        <input
                          type="text"
                          value={numB}
                          onChange={(e) => handleInputChange(setNumB, e.target.value, false)}
                          className="w-full text-center font-mono font-black text-sm outline-none text-orange-600"
                        />
                        <button onClick={() => adjustValue(setNumB, numB, 1)} className="px-1.5 font-bold text-orange-600 hover:bg-slate-50 rounded">+</button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστης</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => adjustValue(setDenB, denB, -1, true)} className="px-1.5 font-bold text-orange-600 hover:bg-slate-50 rounded">-</button>
                        <input
                          type="text"
                          value={denB}
                          onChange={(e) => handleInputChange(setDenB, e.target.value, true)}
                          className="w-full text-center font-mono font-black text-sm outline-none text-orange-600"
                        />
                        <button onClick={() => adjustValue(setDenB, denB, 1, true)} className="px-1.5 font-bold text-orange-600 hover:bg-slate-50 rounded">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Βήμα-Βήμα Παιδαγωγική Επεξήγηση */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed font-medium space-y-3">
                <p className="font-bold text-slate-800">📝 Βήματα Υπολογισμού:</p>
                {mode === 'fraction-fraction' ? (
                  <div className="space-y-1.5">
                    <p>1. Πολλαπλασιάζουμε τους αριθμητές:</p>
                    <p className="font-mono text-blue-700 pl-2">➡️ {activeNumA} × {activeNumB} = <strong>{resultNum}</strong></p>
                    <p>2. Πολλαπλασιάζουμε τους παρονομαστές:</p>
                    <p className="font-mono text-orange-700 pl-2">➡️ {activeDenA} × {activeDenB} = <strong>{resultDen}</strong></p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p>1. Φανταζόμαστε τον ακέραιο {activeNumA} ως κλάσμα: <span className="font-mono font-bold">{activeNumA}/1</span></p>
                    <p>2. Πολλαπλασιάζουμε τον ακέραιο με τον αριθμητή:</p>
                    <p className="font-mono text-indigo-700 pl-2">➡️ {activeNumA} × {activeNumB} = <strong>{resultNum}</strong></p>
                    <p>3. Ο παρονομαστής παραμένει ο ίδιος: <strong>{resultDen}</strong></p>
                  </div>
                )}
                
                {isSimplified && (
                  <p className="text-emerald-700 text-[11px] font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                    ✨ Απλοποιώντας το {resultNum}/{resultDen} με το {gcd}, έχουμε το ανάγωγο κλάσμα: <strong>{simplifiedNum}/{simplifiedDen}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ & ΠΑΡΟΥΣΙΑΣΗ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[550px] space-y-8">
              
              {/* ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΠΡΑΞΗΣ */}
              <div className="flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4 font-mono font-black text-xl md:text-3xl select-none flex-wrap justify-center">
                  
                  {/* 1. Αριστερός Όρος */}
                  {mode === 'fraction-fraction' ? (
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600">{activeNumA}</span>
                      <div className="w-8 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-blue-600">{activeDenA}</span>
                    </div>
                  ) : (
                    <span className="text-indigo-600 text-4xl">{activeNumA}</span>
                  )}

                  {/* Σύμβολο x */}
                  <div className="text-slate-400 font-light">×</div>

                  {/* 2. Δεξιός Όρος (Κλάσμα Β) */}
                  <div className="flex flex-col items-center">
                    <span className="text-orange-600">{activeNumB}</span>
                    <div className="w-8 h-1 bg-slate-800 my-1 rounded-full" />
                    <span className="text-orange-600">{activeDenB}</span>
                  </div>

                  <div className="text-slate-500 font-bold">=</div>

                  {/* Αναλυτικό Βήμα Πράξης */}
                  <div className="flex flex-col items-center px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200">
                    {mode === 'fraction-fraction' ? (
                      <>
                        <span className="text-slate-700 text-lg md:text-xl">{activeNumA} × {activeNumB}</span>
                        <div className="w-16 h-0.5 bg-slate-500 my-1 rounded-full" />
                        <span className="text-slate-700 text-lg md:text-xl">{activeDenA} × {activeDenB}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-700 text-lg md:text-xl">{activeNumA} × {activeNumB}</span>
                        <div className="w-12 h-0.5 bg-slate-500 my-1 rounded-full" />
                        <span className="text-slate-700 text-lg md:text-xl">{activeDenB}</span>
                      </>
                    )}
                  </div>

                  <div className="text-slate-500 font-bold">=</div>

                  {/* 3. Αποτέλεσμα */}
                  <div className="flex flex-col items-center bg-emerald-50 border-emerald-100 px-2.5 py-1.5 rounded-xl border">
                    <span className="text-emerald-600">{resultNum}</span>
                    <div className="w-8 h-1 bg-slate-800 my-1 rounded-full" />
                    <span className="text-emerald-600">{resultDen}</span>
                  </div>

                  {/* 4. Απλοποιημένο */}
                  {isSimplified && (
                    <>
                      <div className="text-emerald-600 font-bold">=</div>
                      <div className="flex flex-col items-center bg-emerald-100 border-emerald-200 px-2.5 py-1.5 rounded-xl border">
                        <span className="text-emerald-800">{simplifiedNum}</span>
                        <div className="w-8 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-emerald-800">{simplifiedDen}</span>
                      </div>
                    </>
                  )}

                </div>
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                
                {mode === 'fraction-fraction' ? (
                  // Πλέγμα για Κλάσμα x Κλάσμα
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center">🔲 Οπτικοποιηση με Πλεγμα (Εμβαδον Ορθογωνιου)</span>
                    <p className="text-slate-500 text-center text-xs px-4">
                      Η επιφάνεια χωρίζεται σε <strong>{activeDenA} γραμμές</strong> (οριζόντια) και <strong>{activeDenB} στήλες</strong> (κάθετα). Το αποτέλεσμα είναι η περιοχή όπου τα δύο κλάσματα συναντιούνται!
                    </p>
                    {renderGridVisual()}
                  </div>
                ) : (
                  // Κύκλοι για Ακέραιο x Κλάσμα
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center">🍕 Οπτικοποιηση με Επαναλαμβανομενα Κομματια</span>
                    <p className="text-slate-500 text-center text-xs px-4">
                      Παίρνουμε το κομμάτι <span className="font-bold text-orange-600">{activeNumB}/{activeDenB}</span> και το επαναλαμβάνουμε <span className="font-bold text-indigo-600">{activeNumA} φορές</span>.
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center gap-4 py-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-4">
                      
                      {/* Σχεδίαση των επαναλαμβανόμενων κλασμάτων */}
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        {Array.from({ length: activeNumA }).map((_, i) => (
                          <div key={i} className="flex flex-col items-center p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <span className="text-[9px] font-bold text-slate-400 mb-1">Φορά {i+1}</span>
                            {renderPizzasVisual(activeNumB, activeDenB, 'fill-orange-400', 'stroke-orange-600')}
                          </div>
                        ))}
                      </div>

                      <div className="text-2xl text-slate-400 font-bold px-1">＝</div>

                      {/* Τελικό άθροισμα / γινόμενο */}
                      <div className="flex flex-col items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Συνολικο Γινομενο</span>
                        {renderPizzasVisual(resultNum, resultDen, 'fill-emerald-500', 'stroke-emerald-700')}
                      </div>

                    </div>
                  </div>
                )}

              </div>

              {/* ΠΑΙΔΑΓΩΓΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-700 text-white p-4 rounded-xl text-center font-mono font-black text-xs md:text-sm shadow-md">
                {mode === 'fraction-fraction' ? (
                  '💡 Όταν πολλαπλασιάζουμε δύο γνήσια κλάσματα, το αποτέλεσμα είναι ΠΑΝΤΑ μικρότερο και από τα δύο αρχικά κλάσματα!'
                ) : (
                  '💡 Ο πολλαπλασιάσμος ενός κλάσματος με ακέραιο αριθμό είναι σαν να κάνουμε επαναλαμβανόμενη πρόσθεση του ίδιου κλάσματος!'
                )}
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Πολλαπλασιασμός Κλασμάτων - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

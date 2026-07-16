import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// ΜΕΓΙΣΤΗ ΤΙΜΗ (Όλα κλειδωμένα στο 10 για καθαρή σύγκριση και οπτικοποίηση)
const MAX_VALUE = 10;

export default function SigkrisiKlasmatonPage() {
  // Κλάσμα Α (Αριστερά)
  const [numA, setNumA] = useState(2);
  const [denA, setDenA] = useState(3);

  // Κλάσμα Β (Δεξιά)
  const [numB, setNumB] = useState(3);
  const [denB, setDenB] = useState(4);

  // Ασφαλής έλεγχος εισαγωγής κειμένου
  const handleInputChange = (setter, val, currentDen, isDenominator = false) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setter('');
      return;
    }
    const n = Number(clean);
    
    if (isDenominator) {
      if (n === 0 || n > MAX_VALUE) return;
      setter(n);
    } else {
      if (n > currentDen || n > MAX_VALUE) return;
      setter(n);
    }
  };

  // Αυξομείωση με κουμπιά για το Κλάσμα Α
  const adjustValueA = (type, amount) => {
    if (type === 'num') {
      setNumA(prev => Math.max(0, Math.min(Number(denA) || MAX_VALUE, (Number(prev) || 0) + amount)));
    } else {
      setDenA(prev => {
        const nextDen = Math.max(1, Math.min(MAX_VALUE, (Number(prev) || 1) + amount));
        if (numA > nextDen) setNumA(nextDen);
        return nextDen;
      });
    }
  };

  // Αυξομείωση με κουμπιά για το Κλάσμα Β
  const adjustValueB = (type, amount) => {
    if (type === 'num') {
      setNumB(prev => Math.max(0, Math.min(Number(denB) || MAX_VALUE, (Number(prev) || 0) + amount)));
    } else {
      setDenB(prev => {
        const nextDen = Math.max(1, Math.min(MAX_VALUE, (Number(prev) || 1) + amount));
        if (numB > nextDen) setNumB(nextDen);
        return nextDen;
      });
    }
  };

  // Ενεργές τιμές για υπολογισμούς
  const activeNumA = numA === '' ? 0 : Number(numA);
  const activeDenA = denA === '' || denA === 0 ? 1 : Number(denA);
  const activeNumB = numB === '' ? 0 : Number(numB);
  const activeDenB = denB === '' || denB === 0 ? 1 : Number(denB);

  const valA = activeNumA / activeDenA;
  const valB = activeNumB / activeDenB;

  // Εύρεση του σωστού συμβόλου σύγκρισης
  const getComparisonSymbol = () => {
    if (valA > valB) return '>';
    if (valA < valB) return '<';
    return '=';
  };

  // Επεξηγηματικό παιδαγωγικό μήνυμα βάσει της περίπτωσης
  const getExplanationMessage = () => {
    if (activeDenA === activeDenB) {
      return `💡 Συγκρίνουμε τα κλάσματα ${activeNumA}/${activeDenA} και ${activeNumB}/${activeDenB}. Είναι ομώνυμα (έχουν ίδιο παρονομαστή). Μεγαλύτερο είναι εκείνο που έχει τον μεγαλύτερο αριθμητή!`;
    }
    if (activeNumA === activeNumB && activeNumA !== 0) {
      return `💡 Συγκρίνουμε τα κλάσματα ${activeNumA}/${activeDenA} και ${activeNumB}/${activeDenB}. Έχουν ίδιο αριθμητή. Μεγαλύτερο είναι εκείνο που έχει τον μικρότερο παρονομαστή, γιατί η πίτσα χωρίστηκε σε λιγότερα (και άρα μεγαλύτερα) κομμάτια!`;
    }
    
    // Ετερώνυμα - Μέθοδος Χιαστί με βάση τις νέες οδηγίες
    const crossA = activeNumA * activeDenB;
    const crossB = activeNumB * activeDenA;
    
    let resultText = "";
    if (crossA < crossB) {
      resultText = `Επειδή το αριστερό γινόμενο (${crossA}) είναι μικρότερο από το δεξί (${crossB}), τότε μικρότερο είναι το πρώτο κλάσμα (${activeNumA}/${activeDenA} < ${activeNumB}/${activeDenB}).`;
    } else if (crossA > crossB) {
      resultText = `Επειδή το αριστερό γινόμενο (${crossA}) είναι μεγαλύτερο από το δεξί (${crossB}), τότε μεγαλύτερο είναι το πρώτο κλάσμα (${activeNumA}/${activeDenA} > ${activeNumB}/${activeDenB}).`;
    } else {
      resultText = `Επειδή τα γινόμενα είναι ίσα (${crossA} = ${crossB}), τότε τα κλάσματα είναι ισοδύναμα (${activeNumA}/${activeDenA} = ${activeNumB}/${activeDenB}).`;
    }

    return (
      <div className="space-y-2">
        <p>
          💡 Συγκρίνουμε τα αρχικά κλάσματα <strong>{activeNumA}/{activeDenA}</strong> και <strong>{activeNumB}/{activeDenB}</strong>.
        </p>
        <p>
          Κάνουμε <strong>χιαστί πολλαπλασιασμό</strong>: 
          <br />
          • Αριστερό μέλος: {activeNumA} × {activeDenB} = <strong>{crossA}</strong>
          <br />
          • Δεξί μέλος: {activeNumB} × {activeDenA} = <strong>{crossB}</strong>
        </p>
        <p className="border-t border-slate-200 pt-2 font-bold text-slate-800">
          {resultText}
        </p>
      </div>
    );
  };

  // Σχεδίαση Κυκλικού Διαγράμματος (Πίτσα SVG)
  const renderPizzaDiagram = (num, den, fillColor = 'fill-blue-500', strokeColor = 'stroke-blue-700') => {
    const slices = [];
    const radius = 65;
    const cx = 80;
    const cy = 80;

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

      const isFilled = i < num;

      slices.push(
        <path
          key={i}
          d={d}
          className={`${
            isFilled ? `${fillColor} ${strokeColor}` : 'fill-slate-100 stroke-slate-300'
          } transition-colors duration-200 stroke-[1.2]`}
        />
      );
    }

    return (
      <svg width="160" height="160" className="drop-shadow-md overflow-visible">
        {slices}
        <circle cx={cx} cy={cy} r="2.5" className="fill-slate-800" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚖️ Σύγκριση Κλασμάτων - LearnMaths.gr</title>
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
          
          {/* SECTION 1: ΘΕΩΡΙΑ ΣΥΓΚΡΙΣΗΣ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span>📖</span> Πώς συγκρίνουμε Κλάσματα;
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch text-xs md:text-sm">
              {/* Περίπτωση 1 */}
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-2">
                <span className="font-black text-blue-800 block">1. Ίδιοι Παρονομαστές (Ομώνυμα)</span>
                <p className="text-slate-600 leading-relaxed">
                  Όταν οι παρονομαστές είναι ίδιοι, κοιτάμε τους αριθμητές. <strong>Μεγαλύτερο</strong> είναι το κλάσμα με τον <strong>μεγαλύτερο αριθμητή</strong>.
                </p>
                <span className="font-mono text-xs font-bold text-blue-700 bg-white px-2 py-0.5 rounded border inline-block">5/8 &gt; 3/8</span>
              </div>

              {/* Περίπτωση 2 */}
              <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-100 space-y-2">
                <span className="font-black text-purple-800 block">2. Ίδιοι Αριθμητές</span>
                <p className="text-slate-600 leading-relaxed">
                  Όταν οι αριθμητές είναι ίδιοι, κοιτάμε τους παρονομαστές. <strong>Μεγαλύτερο</strong> είναι το κλάσμα με τον <strong>μικρότερο παρονομαστή</strong>.
                </p>
                <span className="font-mono text-xs font-bold text-purple-700 bg-white px-2 py-0.5 rounded border inline-block">2/3 &gt; 2/5</span>
              </div>

              {/* Περίπτωση 3 */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100 space-y-2">
                <span className="font-black text-amber-800 block">3. Ετερώνυμα (Μέθοδος Χιαστί)</span>
                <p className="text-slate-600 leading-relaxed">
                  Πολλαπλασιάζουμε τον αριθμητή του πρώτου με τον παρονομαστή του δεύτερου, και τον αριθμητή του δεύτερου με τον παρονομαστή του πρώτου!
                </p>
                <span className="font-mono text-xs font-bold text-amber-700 bg-white px-2 py-0.5 rounded border inline-block">Χιαστί: α·δ vs β·γ</span>
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
                  <p className="text-gray-500 text-xs">Όριο όρων: {MAX_VALUE} (Αριθμητής &le; Παρονομαστής).</p>
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

              {/* Δυναμικό Μήνυμα Κανόνα */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed font-medium">
                {getExplanationMessage()}
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ ΣΥΓΚΡΙΣΗΣ & ΠΙΤΣΕΣ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[550px] space-y-8">
              
              {/* ΜΕΓΑΛΗ ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΜΕ ΤΟ ΣΥΜΒΟΛΟ */}
              <div className="flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-8 font-mono font-black text-3xl md:text-5xl select-none">
                  {/* Κλάσμα Α */}
                  <div className="flex flex-col items-center">
                    <span className="text-blue-600">{activeNumA}</span>
                    <div className="w-12 h-1.5 bg-slate-800 my-1 rounded-full" />
                    <span className="text-blue-600">{activeDenA}</span>
                  </div>

                  {/* Σύμβολο Σύγκρισης */}
                  <div className="text-4xl md:text-6xl text-amber-500 bg-white px-5 py-3 rounded-2xl shadow-md border border-slate-200/60 animate-pulse">
                    {getComparisonSymbol()}
                  </div>

                  {/* Κλάσμα Β */}
                  <div className="flex flex-col items-center">
                    <span className="text-orange-600">{activeNumB}</span>
                    <div className="w-12 h-1.5 bg-slate-800 my-1 rounded-full" />
                    <span className="text-orange-600">{activeDenB}</span>
                  </div>
                </div>
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ (ΚΥΚΛΙΚΑ ΣΧΗΜΑΤΑ ΔΙΠΛΑ-ΔΙΠΛΑ) */}
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block text-center sm:text-left">🍕 Οπτική Σύγκριση Επιφάνειας (Μοντέλο Πίτσας)</span>
                
                <div className="flex flex-col sm:flex-row items-center justify-around gap-8 py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  {/* Πίτσα Α */}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Πίτσα Α ({activeNumA}/{activeDenA})</span>
                    {renderPizzaDiagram(activeNumA, activeDenA, 'fill-blue-500', 'stroke-blue-700')}
                    <span className="font-mono text-xs text-slate-400 font-bold">({valA.toFixed(2)})</span>
                  </div>

                  {/* Πίτσα Β */}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">Πίτσα Β ({activeNumB}/{activeDenB})</span>
                    {renderPizzaDiagram(activeNumB, activeDenB, 'fill-orange-500', 'stroke-orange-700')}
                    <span className="font-mono text-xs text-slate-400 font-bold">({valB.toFixed(2)})</span>
                  </div>
                </div>
              </div>

              {/* Τελικό Συμπέρασμα */}
              <div className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white p-4 rounded-xl text-center font-mono font-black text-xs md:text-sm shadow-md">
                ⚖️ Συμπέρασμα: Το κλάσμα με τη μεγαλύτερη χρωματισμένη επιφάνεια είναι το μεγαλύτερο!
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Σύγκριση Κλασμάτων - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

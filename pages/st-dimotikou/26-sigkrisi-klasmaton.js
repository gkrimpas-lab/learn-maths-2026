import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// ΕΞΩΤΕΡΙΚΕΣ ΜΕΤΑΒΛΗΤΕΣ ΡΥΘΜΙΣΗΣ
const MAX_DENOMINATOR = 100;
const MAX_NUMERATOR_MULTIPLIER = 3; // Ο αριθμητής μπορεί να γίνει έως 3 φορές ο παρονομαστής

const PRESETS = [
  { nA: 3, dA: 8, nB: 5, dB: 8, label: "3/8 vs 5/8 (Ομώνυμα)" },
  { nA: 2, dA: 3, nB: 2, dB: 5, label: "2/3 vs 2/5 (Ίδιος Αριθμητής)" },
  { nA: 2, dA: 3, nB: 3, dB: 4, label: "2/3 vs 3/4 (Ετερώνυμα - Χιαστί)" },
  { nA: 3, dA: 6, nB: 4, dB: 8, label: "3/6 vs 4/8 (Ισοδύναμα = 1/2)" }
];

export default function SigkrisiKlasmatonPage() {
  // Κλάσμα Α (Αριστερά)
  const [numA, setNumA] = useState(2);
  const [denA, setDenA] = useState(3);

  // Κλάσμα Β (Δεξιά)
  const [numB, setNumB] = useState(3);
  const [denB, setDenB] = useState(4);

  // Μέγιστος επιτρεπτός αριθμητής βάσει του τρέχοντος παρονομαστή
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

  const valA = activeNumA / activeDenA;
  const valB = activeNumB / activeDenB;

  // Εύρεση του σωστού συμβόλου σύγκρισης
  const getComparisonSymbol = () => {
    if (valA > valB) return '>';
    if (valA < valB) return '<';
    return '=';
  };

  // Επεξηγηματικό παιδαγωγικό μήνυμα
  const getExplanationMessage = () => {
    if (activeDenA === activeDenB) {
      return (
        <div className="space-y-1">
          <span className="font-bold text-blue-800 uppercase block text-[11px]">1. Ίδιοι Παρονομαστές (Ομώνυμα):</span>
          <p>
            Τα κλάσματα έχουν τον ίδιο παρονομαστή ({activeDenA}). Μεγαλύτερο είναι εκείνο που έχει τον μεγαλύτερο αριθμητή: 
            <strong> {activeNumA} {valA > valB ? '>' : valA < valB ? '<' : '＝'} {activeNumB}</strong>.
          </p>
        </div>
      );
    }
    if (activeNumA === activeNumB && activeNumA !== 0) {
      return (
        <div className="space-y-1">
          <span className="font-bold text-purple-800 uppercase block text-[11px]">2. Ίδιοι Αριθμητές:</span>
          <p>
            Τα κλάσματα έχουν τον ίδιο αριθμητή ({activeNumA}). Μεγαλύτερο είναι εκείνο που έχει τον <strong>μικρότερο παρονομαστή</strong>, γιατί η μονάδα χωρίστηκε σε λιγότερα και άρα μεγαλύτερα κομμάτια!
          </p>
        </div>
      );
    }
    
    // Ετερώνυμα - Μέθοδος Χιαστί
    const crossA = activeNumA * activeDenB;
    const crossB = activeNumB * activeDenA;
    
    let resultText = "";
    if (crossA < crossB) {
      resultText = `Επειδή το αριστερό γινόμενο (${crossA}) είναι μικρότερο από το δεξί (${crossB}), τότε: ${activeNumA}/${activeDenA} < ${activeNumB}/${activeDenB}.`;
    } else if (crossA > crossB) {
      resultText = `Επειδή το αριστερό γινόμενο (${crossA}) είναι μεγαλύτερο από το δεξί (${crossB}), τότε: ${activeNumA}/${activeDenA} > ${activeNumB}/${activeDenB}.`;
    } else {
      resultText = `Επειδή τα γινόμενα είναι ίσα (${crossA} ＝ ${crossB}), τότε τα κλάσματα είναι ισοδύναμα (${activeNumA}/${activeDenA} ＝ ${activeNumB}/${activeDenB}).`;
    }

    return (
      <div className="space-y-2">
        <span className="font-bold text-amber-800 uppercase block text-[11px]">3. Ετερώνυμα (Μέθοδος Χιαστί):</span>
        <p className="text-slate-600">
          • Αριστερό γινόμενο: {activeNumA} × {activeDenB} ＝ <strong className="text-blue-700 font-bold">{crossA}</strong>
          <br />
          • Δεξί γινόμενο: {activeNumB} × {activeDenA} ＝ <strong className="text-orange-700 font-bold">{crossB}</strong>
        </p>
        <p className="border-t border-slate-200 pt-1.5 font-bold text-slate-800">
          {resultText}
        </p>
      </div>
    );
  };

  // Σχεδίαση κυκλικών διαγραμμάτων (πίτσες SVG)
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
            } transition-colors duration-200 stroke-[0.8]`}
          />
        );
      }

      pizzas.push(
        <div key={p} className="relative">
          <svg width="110" height="110" className="drop-shadow-sm overflow-visible">
            {slices}
            <circle cx={cx} cy={cy} r="2.5" className="fill-slate-800" />
          </svg>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-2 max-w-[260px] p-2 bg-white rounded-2xl border border-slate-200 shadow-inner">
        {pizzas}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚖️ Σύγκριση Κλασμάτων - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 w-full">
          <div className={`${LAYOUT.CONTAINER} py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight flex items-center">
              <span>LearnMaths</span><span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/st-dimotikou/26-sigkrisi-klasmaton-ask"
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs md:text-sm font-black transition shadow-sm flex items-center gap-1.5"
              >
                <span>🎯</span> Ασκήσεις
              </Link>
              <Link
                href="/st-dimotikou"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition"
              >
                🔙 ΣΤ' Δημοτικού
              </Link>
            </div>
          </div>
        </nav>

        {/* 2. MAIN LESSON CONTAINER */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-8 md:py-12 space-y-10`}>

          {/* HERO BANNER WITH PROMO CALLOUT CARD */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    🎓 ΣΤ' Δημοτικού
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενότητα 26
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  26. Σύγκριση Κλασμάτων (Ομώνυμα, Ετερώνυμα & Χιαστί)
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε τους 3 εύκολους κανόνες για να συγκρίνεις οποιαδήποτε κλάσματα: με <strong>ίδιους παρονομαστές</strong>, με <strong>ίδιους αριθμητές</strong> ή με τον ταχύτατο <strong>πολλαπλασιασμό χιαστί</strong>!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις σύγκρισης κλασμάτων!</p>
                <Link
                  href="/st-dimotikou/26-sigkrisi-klasmaton-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-black text-slate-900">1. Ομώνυμα Κλάσματα</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Όταν οι παρονομαστές είναι ίδιοι, <strong>μεγαλύτερο</strong> είναι το κλάσμα με τον <strong>μεγαλύτερο αριθμητή</strong>.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-blue-900">
                  5/8 &gt; 3/8
                </span>
              </div>
            </div>

            <div className="bg-purple-50/80 border border-purple-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black text-slate-900">2. Ίδιοι Αριθμητές</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Όταν οι αριθμητές είναι ίδιοι, <strong>μεγαλύτερο</strong> είναι το κλάσμα με τον <strong>μικρότερο παρονομαστή</strong> (μεγαλύτερα κομμάτια).
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-purple-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-xl text-purple-900">
                  2/3 &gt; 2/5
                </span>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-slate-900">3. Μέθοδος Χιαστί</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Στα ετερώνυμα, πολλαπλασιάζουμε χιαστί: (α × δ) και (γ × β). Συγκρίνουμε τα γινόμενα για να βρούμε το μεγαλύτερο κλάσμα!
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-amber-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl text-amber-900">
                  2/3 &lt; 3/4 (2×4=8 &lt; 3×3=9)
                </span>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Σύγκρισης Κλασμάτων
                </h2>
                <p className="text-gray-500 text-sm">
                  Ρύθμισε τα δύο κλάσματα και παρατήρησε τη μαθηματική και οπτική σύγκριση σε πραγματικό χρόνο!
                </p>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Α (ΜΠΛΕ) */}
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-3">
                    <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                      🔵 Κλάσμα Α (Αριστερό)
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητής</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => adjustValueA('num', -1)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">-</button>
                          <input
                            type="text"
                            value={numA}
                            onChange={(e) => handleInputChange(setNumA, e.target.value, denA, false)}
                            className="w-full text-center font-mono font-black text-base outline-none text-blue-600"
                          />
                          <button type="button" onClick={() => adjustValueA('num', 1)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">+</button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστής</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => adjustValueA('den', -1)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">-</button>
                          <input
                            type="text"
                            value={denA}
                            onChange={(e) => handleInputChange(setDenA, e.target.value, denA, true)}
                            className="w-full text-center font-mono font-black text-base outline-none text-blue-600"
                          />
                          <button type="button" onClick={() => adjustValueA('den', 1)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Β (ΠΟΡΤΟΚΑΛΙ) */}
                  <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200 space-y-3">
                    <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                      🟠 Κλάσμα Β (Δεξί)
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητής</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => adjustValueB('num', -1)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">-</button>
                          <input
                            type="text"
                            value={numB}
                            onChange={(e) => handleInputChange(setNumB, e.target.value, denB, false)}
                            className="w-full text-center font-mono font-black text-base outline-none text-orange-600"
                          />
                          <button type="button" onClick={() => adjustValueB('num', 1)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">+</button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστής</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => adjustValueB('den', -1)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">-</button>
                          <input
                            type="text"
                            value={denB}
                            onChange={(e) => handleInputChange(setDenB, e.target.value, denB, true)}
                            className="w-full text-center font-mono font-black text-base outline-none text-orange-600"
                          />
                          <button type="button" onClick={() => adjustValueB('den', 1)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PRESET BUTTONS */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Έτοιμα Παραδείγματα:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNumA(p.nA);
                            setDenA(p.dA);
                            setNumB(p.nB);
                            setDenB(p.dB);
                          }}
                          className="py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ΕΠΕΞΗΓΗΣΗ ΚΑΝΟΝΑ */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs">
                    {getExplanationMessage()}
                  </div>

                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Συμβουλή:</strong> Μετατρέποντας τα κλάσματα σε δεκαδικούς, η σύγκριση γίνεται άμεσα προφανής!
                </div>
              </div>

              {/* RIGHT: VISUALIZATION & PIZZAS (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
                
                {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΜΕ ΤΟ ΣΥΜΒΟΛΟ */}
                <div className="flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-6 sm:gap-10 font-mono font-black text-3xl md:text-5xl select-none">
                    {/* Κλάσμα Α */}
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600">{activeNumA}</span>
                      <div className="w-12 sm:w-16 h-1.5 bg-slate-800 my-1 rounded-full" />
                      <span className="text-blue-600">{activeDenA}</span>
                    </div>

                    {/* Σύμβολο Σύγκρισης */}
                    <div className="text-4xl md:text-6xl text-amber-500 bg-white px-5 py-2.5 rounded-2xl shadow-md border border-slate-200">
                      {getComparisonSymbol()}
                    </div>

                    {/* Κλάσμα Β */}
                    <div className="flex flex-col items-center">
                      <span className="text-orange-600">{activeNumB}</span>
                      <div className="w-12 sm:w-16 h-1.5 bg-slate-800 my-1 rounded-full" />
                      <span className="text-orange-600">{activeDenB}</span>
                    </div>
                  </div>
                </div>

                {/* 2. ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΠΙΤΣΑΣ */}
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block text-center">
                    🍕 Οπτική Σύγκριση Επιφάνειας (Κυκλικό Μοντέλο):
                  </span>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-6 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner">
                    {/* Πίτσα Α */}
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
                        Κλάσμα Α ({activeNumA}/{activeDenA})
                      </span>
                      {renderFractionVisual(activeNumA, activeDenA, 'fill-blue-500', 'stroke-blue-700')}
                      <span className="font-mono text-xs text-slate-600 font-bold bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                        Δεκαδική τιμή: {valA.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    {/* Πίτσα Β */}
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-orange-600 uppercase tracking-wider">
                        Κλάσμα Β ({activeNumB}/{activeDenB})
                      </span>
                      {renderFractionVisual(activeNumB, activeDenB, 'fill-orange-500', 'stroke-orange-700')}
                      <span className="font-mono text-xs text-slate-600 font-bold bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                        Δεκαδική τιμή: {valB.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
                <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 text-white p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                  ⚖️ Συμπέρασμα: {activeNumA}/{activeDenA} {getComparisonSymbol()} {activeNumB}/{activeDenB} (Το κλάσμα με τη μεγαλύτερη χρωματισμένη επιφάνεια είναι το μεγαλύτερο!)
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες να συγκρίνεις ομώνυμα, ετερώνυμα και ισοδύναμα κλάσματα; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/26-sigkrisi-klasmaton-ask"
              className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
            >
              Ξεκίνα τις Ασκήσεις ➔
            </Link>
          </div>

        </main>
      </div>

      {/* 6. GLOBAL FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

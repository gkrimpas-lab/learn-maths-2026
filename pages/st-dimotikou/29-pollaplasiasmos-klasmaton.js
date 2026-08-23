import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// ΚΕΝΤΡΙΚΗ ΜΕΤΑΒΛΗΤΗ ΡΥΘΜΙΣΗΣ ΜΕΓΙΣΤΩΝ ΤΙΜΩΝ
const MAX_LIMIT = 100;

const PRESETS_FF = [
  { nA: 2, dA: 3, nB: 3, dB: 4, label: "2/3 × 3/4 ➔ 1/2" },
  { nA: 1, dA: 2, nB: 2, dB: 5, label: "1/2 × 2/5 ➔ 1/5" },
  { nA: 3, dA: 5, nB: 2, dB: 3, label: "3/5 × 2/3 ➔ 2/5" },
  { nA: 3, dA: 4, nB: 4, dB: 3, label: "3/4 × 4/3 ➔ 1" }
];

const PRESETS_NF = [
  { nA: 3, nB: 1, dB: 4, label: "3 × 1/4 ➔ 3/4" },
  { nA: 2, nB: 2, dB: 5, label: "2 × 2/5 ➔ 4/5" },
  { nA: 4, nB: 1, dB: 2, label: "4 × 1/2 ➔ 2" },
  { nA: 3, nB: 2, dB: 3, label: "3 × 2/3 ➔ 2" }
];

// Βοηθητική συνάρτηση για εύρεση Μέγιστου Κοινού Διαιρέτη (ΜΚΔ)
const findGCD = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
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
    if (n > MAX_LIMIT) return;
    if (isDenominator && n === 0) return;
    setter(n);
  };

  // Αυξομείωση με κουμπιά
  const adjustValue = (setter, currentVal, amount, isDenominator = false) => {
    const next = (Number(currentVal) || 0) + amount;
    const min = isDenominator ? 1 : 0;
    if (next >= min && next <= MAX_LIMIT) {
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

  // Προσαρμοστική Σχεδίαση Πλέγματος / Εμβαδού (Grid / Area Model)
  const renderGridVisual = () => {
    const rows = activeDenA;
    const cols = activeDenB;
    const filledRows = Math.min(activeNumA, rows);
    const filledCols = Math.min(activeNumB, cols);

    // Αν οι παρονομαστές είναι έως 20x20 σχεδιάζουμε ακριβές πλέγμα κελιών
    if (rows <= 20 && cols <= 20) {
      const cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isSelectedA = r < filledRows;
          const isSelectedB = c < filledCols;
          const isOverlap = isSelectedA && isSelectedB;

          let cellBg = 'bg-white border-slate-200';
          if (isOverlap) {
            cellBg = 'bg-indigo-600 border-indigo-700 shadow-xs';
          } else if (isSelectedA) {
            cellBg = 'bg-blue-300 border-blue-400';
          } else if (isSelectedB) {
            cellBg = 'bg-orange-300 border-orange-400';
          }

          cells.push(
            <div
              key={`${r}-${c}`}
              className={`border w-full h-full transition-colors duration-200 ${cellBg}`}
              style={{ aspectRatio: '1/1' }}
            />
          );
        }
      }

      return (
        <div className="flex flex-col items-center space-y-4 w-full max-w-sm mx-auto p-2">
          <div 
            className="grid gap-0.5 border-2 border-slate-300 p-2 rounded-2xl bg-slate-100 shadow-inner w-full"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {cells}
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-bold pt-1">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-300 rounded border border-blue-400" /> 1ο Κλάσμα ({activeNumA}/{activeDenA})</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-300 rounded border border-orange-400" /> 2ο Κλάσμα ({activeNumB}/{activeDenB})</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-indigo-600 rounded border border-indigo-700" /> Κοινή Περιοχή ({resultNum}/{resultDen})</span>
          </div>
        </div>
      );
    }

    // Για μεγαλύτερους παρονομαστές (21 έως 100), χρησιμοποιούμε συνεχή SVG αναπαράσταση εμβαδού
    const pctW = Math.min(100, (activeNumB / activeDenB) * 100);
    const pctH = Math.min(100, (activeNumA / activeDenA) * 100);

    return (
      <div className="flex flex-col items-center space-y-4 w-full max-w-sm mx-auto p-2">
        <div className="relative w-full aspect-square border-2 border-slate-400 rounded-2xl bg-white overflow-hidden shadow-inner">
          {/* Περιοχή Κλάσματος Α (Οριζόντια) */}
          <div 
            className="absolute top-0 left-0 w-full bg-blue-200/80 border-b border-blue-400 transition-all duration-300"
            style={{ height: `${pctH}%` }}
          />
          {/* Περιοχή Κλάσματος Β (Κάθετα) */}
          <div 
            className="absolute top-0 left-0 h-full bg-orange-200/80 border-r border-orange-400 transition-all duration-300"
            style={{ width: `${pctW}%` }}
          />
          {/* Κοινή Περιοχή (Overlap) */}
          <div 
            className="absolute top-0 left-0 bg-indigo-600 border border-indigo-700 transition-all duration-300 shadow-md"
            style={{ width: `${pctW}%`, height: `${pctH}%` }}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-xs font-bold pt-1">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-300 rounded border border-blue-400" /> 1ο Κλάσμα ({activeNumA}/{activeDenA})</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-300 rounded border border-orange-400" /> 2ο Κλάσμα ({activeNumB}/{activeDenB})</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-indigo-600 rounded border border-indigo-700" /> Κοινή Περιοχή ({resultNum}/{resultDen})</span>
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
          <svg width="95" height="95" className="drop-shadow-sm overflow-visible">
            {slices}
            <circle cx={cx} cy={cy} r="2" className="fill-slate-800" />
          </svg>
          <span className="text-[9px] font-bold text-slate-400 mt-1">Κομμάτια: {remainingNumForThisPizza}/{den}</span>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-2.5 p-2.5 bg-white rounded-2xl border border-slate-200 shadow-inner max-w-full max-h-[380px] overflow-y-auto">
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
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 w-full">
          <div className={`${LAYOUT.CONTAINER} py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight flex items-center">
              <span>LearnMaths</span><span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/st-dimotikou/29-pollaplasiasmos-klasmaton-ask"
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
                    Ενότητα 29
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  29. Πολλαπλασιασμός Κλασμάτων & Ακεραίου με Κλάσμα
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                  Μάθε πώς πολλαπλασιάζουμε <strong>κλάσμα με κλάσμα</strong> (αριθμητή με αριθμητή και παρονομαστή με παρονομαστή) και <strong>ακέραιο με κλάσμα</strong>, καθώς και πώς απλοποιούμε το γινόμενο!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl">🚀</span>
                <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις πολλαπλασιασμού κλασμάτων!</p>
                <Link
                  href="/st-dimotikou/29-pollaplasiasmos-klasmaton-ask"
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
                <h3 className="text-lg font-black text-slate-900">1. Κλάσμα επί Κλάσμα</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Πολλαπλασιάζουμε <strong>αριθμητή με αριθμητή</strong> και <strong>παρονομαστή με παρονομαστή</strong>. Δεν χρειάζεται να γίνουν ομώνυμα!
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl text-blue-900">
                  (2/3) × (4/5) ＝ (2×4)/(3×5) ＝ <strong className="text-blue-700 font-black">8/15</strong>
                </span>
              </div>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black text-slate-900">2. Ακέραιος επί Κλάσμα</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Πολλαπλασιάζουμε τον <strong>ακέραιο μόνο με τον αριθμητή</strong> του κλάσματος. Ο παρονομαστής παραμένει ίδιος.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                  3 × (2/7) ＝ (3×2)/7 ＝ <strong className="text-indigo-700 font-black">6/7</strong>
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-slate-900">3. Αντίστροφοι Αριθμοί</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Δύο αριθμοί λέγονται <strong>αντίστροφοι</strong> όταν το γινόμενό τους ισούται με τη <strong>μονάδα (1)</strong>.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center font-bold">
                <span className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-900">
                  (3/4) × (4/3) ＝ 12/12 ＝ <strong className="text-emerald-700 font-black">1</strong>
                </span>
              </div>
            </div>
          </div>

          {/* MODE SELECTOR TABS */}
          <div className="flex justify-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner max-w-md mx-auto gap-1">
            <button
              type="button"
              onClick={() => { setMode('fraction-fraction'); setNumA(2); setDenA(3); setNumB(3); setDenB(4); }}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all ${
                mode === 'fraction-fraction' ? 'bg-blue-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✖️ Κλάσμα επί Κλάσμα
            </button>
            <button
              type="button"
              onClick={() => { setMode('number-fraction'); setNumA(3); setNumB(1); setDenB(4); }}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all ${
                mode === 'number-fraction' ? 'bg-indigo-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔢 Ακέραιος επί Κλάσμα
            </button>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Πολλαπλασιασμού Κλασμάτων
                </h2>
                <p className="text-gray-500 text-sm">
                  {mode === 'fraction-fraction'
                    ? "Όρισε τους όρους των δύο κλασμάτων (έως 100) και δες το γινόμενο και την οπτικοποίηση με το πλέγμα εμβαδού!"
                    : "Όρισε τον ακέραιο και το κλάσμα (έως 100) και δες την αναπαράσταση ως επαναλαμβανόμενες μονάδες!"}
                </p>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* ΧΕΙΡΙΣΤΗΡΙΟ Α (ΚΛΑΣΜΑ 1 Η ΑΚΕΡΑΙΟΣ) */}
                  {mode === 'fraction-fraction' ? (
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-3">
                      <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                        🔵 1ο Κλάσμα
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητής</span>
                          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                            <button type="button" onClick={() => adjustValue(setNumA, numA, -1)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">-</button>
                            <input
                              type="text"
                              value={numA}
                              onChange={(e) => handleInputChange(setNumA, e.target.value, false)}
                              className="w-full text-center font-mono font-black text-base outline-none text-blue-600"
                            />
                            <button type="button" onClick={() => adjustValue(setNumA, numA, 1)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">+</button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστής</span>
                          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                            <button type="button" onClick={() => adjustValue(setDenA, denA, -1, true)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">-</button>
                            <input
                              type="text"
                              value={denA}
                              onChange={(e) => handleInputChange(setDenA, e.target.value, true)}
                              className="w-full text-center font-mono font-black text-base outline-none text-blue-600"
                            />
                            <button type="button" onClick={() => adjustValue(setDenA, denA, 1, true)} className="px-2 py-1 font-black text-blue-600 hover:bg-slate-50 rounded-lg">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-200 space-y-3">
                      <span className="text-xs font-black text-indigo-800 uppercase block tracking-wider">
                        🔢 Φυσικός Αριθμός (Ακέραιος)
                      </span>
                      <div className="space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Τιμή</span>
                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 max-w-[160px] mx-auto">
                          <button type="button" onClick={() => adjustValue(setNumA, numA, -1)} className="px-2.5 py-1 font-black text-indigo-600 hover:bg-slate-50 rounded-lg">-</button>
                          <input
                            type="text"
                            value={numA}
                            onChange={(e) => handleInputChange(setNumA, e.target.value, false)}
                            className="w-full text-center font-mono font-black text-lg outline-none text-indigo-600"
                          />
                          <button type="button" onClick={() => adjustValue(setNumA, numA, 1)} className="px-2.5 py-1 font-black text-indigo-600 hover:bg-slate-50 rounded-lg">+</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ΧΕΙΡΙΣΤΗΡΙΟ Β (ΚΛΑΣΜΑ 2) */}
                  <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200 space-y-3">
                    <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                      🟠 2ο Κλάσμα
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητής</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => adjustValue(setNumB, numB, -1)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">-</button>
                          <input
                            type="text"
                            value={numB}
                            onChange={(e) => handleInputChange(setNumB, e.target.value, false)}
                            className="w-full text-center font-mono font-black text-base outline-none text-orange-600"
                          />
                          <button type="button" onClick={() => adjustValue(setNumB, numB, 1)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">+</button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστής</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button type="button" onClick={() => adjustValue(setDenB, denB, -1, true)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">-</button>
                          <input
                            type="text"
                            value={denB}
                            onChange={(e) => handleInputChange(setDenB, e.target.value, true)}
                            className="w-full text-center font-mono font-black text-base outline-none text-orange-600"
                          />
                          <button type="button" onClick={() => adjustValue(setDenB, denB, 1, true)} className="px-2 py-1 font-black text-orange-600 hover:bg-slate-50 rounded-lg">+</button>
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
                      {(mode === 'fraction-fraction' ? PRESETS_FF : PRESETS_NF).map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (mode === 'fraction-fraction') {
                              setNumA(p.nA);
                              setDenA(p.dA);
                              setNumB(p.nB);
                              setDenB(p.dB);
                            } else {
                              setNumA(p.nA);
                              setNumB(p.nB);
                              setDenB(p.dB);
                            }
                          }}
                          className="py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ΒΗΜΑ-ΒΗΜΑ ΕΠΕΞΗΓΗΣΗ */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs space-y-2">
                    <span className="font-black text-slate-900 uppercase block text-[11px]">
                      📝 Βήματα Υπολογισμού:
                    </span>
                    {mode === 'fraction-fraction' ? (
                      <div className="space-y-1 text-xs">
                        <p>1. Αριθμητές: {activeNumA} × {activeNumB} ＝ <strong className="text-blue-700">{resultNum}</strong></p>
                        <p>2. Παρονομαστές: {activeDenA} × {activeDenB} ＝ <strong className="text-orange-700">{resultDen}</strong></p>
                      </div>
                    ) : (
                      <div className="space-y-1 text-xs">
                        <p>1. Φανταζόμαστε τον ακέραιο ως κλάσμα: <span className="font-mono font-bold">{activeNumA}/1</span></p>
                        <p>2. Αριθμητής: {activeNumA} × {activeNumB} ＝ <strong className="text-indigo-700">{resultNum}</strong></p>
                        <p>3. Παρονομαστής: 1 × {activeDenB} ＝ <strong className="text-orange-700">{resultDen}</strong></p>
                      </div>
                    )}
                    {isSimplified && (
                      <p className="text-emerald-700 text-[11px] font-bold pt-1 border-t border-slate-100">
                        ✨ Απλοποίηση με το {gcd}: <strong>{simplifiedNum}/{simplifiedDen}</strong>
                      </p>
                    )}
                  </div>

                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Συμβουλή:</strong> Στον πολλαπλασιασμό κλασμάτων <strong>δεν</strong> χρειάζεται να κάνουμε τα κλάσματα ομώνυμα!
                </div>
              </div>

              {/* RIGHT: VISUALIZATION & AREA GRID / PIZZAS (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
                
                {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΠΡΑΞΗΣ */}
                <div className="flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-3 sm:gap-4 font-mono font-black text-xl md:text-3xl select-none flex-wrap justify-center">
                    
                    {/* 1ος Όρος */}
                    {mode === 'fraction-fraction' ? (
                      <div className="flex flex-col items-center">
                        <span className="text-blue-600">{activeNumA}</span>
                        <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-blue-600">{activeDenA}</span>
                      </div>
                    ) : (
                      <span className="text-indigo-600 text-3xl md:text-4xl">{activeNumA}</span>
                    )}

                    <div className="text-slate-400 font-light">×</div>

                    {/* 2ος Όρος */}
                    <div className="flex flex-col items-center">
                      <span className="text-orange-600">{activeNumB}</span>
                      <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-orange-600">{activeDenB}</span>
                    </div>

                    <div className="text-slate-400 font-light">＝</div>

                    {/* Αναλυτικό Ενδιάμεσο Βήμα */}
                    <div className="flex flex-col items-center px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200">
                      {mode === 'fraction-fraction' ? (
                        <>
                          <span className="text-slate-700 text-base md:text-lg">{activeNumA} × {activeNumB}</span>
                          <div className="w-16 h-0.5 bg-slate-500 my-1 rounded-full" />
                          <span className="text-slate-700 text-base md:text-lg">{activeDenA} × {activeDenB}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-slate-700 text-base md:text-lg">{activeNumA} × {activeNumB}</span>
                          <div className="w-12 h-0.5 bg-slate-500 my-1 rounded-full" />
                          <span className="text-slate-700 text-base md:text-lg">{activeDenB}</span>
                        </>
                      )}
                    </div>

                    <div className="text-slate-500 font-bold">＝</div>

                    {/* Αποτέλεσμα */}
                    <div className="flex flex-col items-center bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <span className="text-emerald-700">{resultNum}</span>
                      <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-emerald-700">{resultDen}</span>
                    </div>

                    {/* Ανάγωγο Αποτέλεσμα */}
                    {isSimplified && (
                      <>
                        <div className="text-emerald-600 font-bold">＝</div>
                        <div className="flex flex-col items-center bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                          <span className="text-emerald-800">{simplifiedNum}</span>
                          <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                          <span className="text-emerald-800">{simplifiedDen}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 2. ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ (ΠΛΕΓΜΑ Ή ΠΙΤΣΕΣ) */}
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  {mode === 'fraction-fraction' ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                          🔲 Οπτικοποίηση με Πλέγμα Εμβαδού (Area Model):
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {activeDenA} γραμμές × {activeDenB} στήλες
                        </span>
                      </div>
                      <div className="p-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner">
                        {renderGridVisual()}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                          🍕 Οπτικοποίηση ως Επαναλαμβανόμενες Μονάδες:
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {activeNumA} φορές το {activeNumB}/{activeDenB}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-4 py-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner p-4 max-h-[360px] overflow-y-auto">
                        <div className="flex flex-wrap items-center justify-center gap-2.5">
                          {Array.from({ length: activeNumA }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center p-2 bg-white rounded-2xl border border-slate-200 shadow-xs">
                              <span className="text-[9px] font-bold text-slate-400 mb-1">Φορά {i + 1}η</span>
                              {renderPizzasVisual(activeNumB, activeDenB, 'fill-orange-400', 'stroke-orange-600')}
                            </div>
                          ))}
                        </div>

                        <div className="text-2xl text-slate-400 font-bold px-1">＝</div>

                        <div className="flex flex-col items-center p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-1">
                            Συνολικό Γινόμενο ({resultNum}/{resultDen})
                          </span>
                          {renderPizzasVisual(resultNum, resultDen, 'fill-emerald-500', 'stroke-emerald-700')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
                <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                  {mode === 'fraction-fraction'
                    ? `💡 Τελικό Αποτέλεσμα: (${activeNumA}/${activeDenA}) × (${activeNumB}/${activeDenB}) ＝ ${isSimplified ? `${simplifiedNum}/${simplifiedDen}` : `${resultNum}/${resultDen}`} (Το γινόμενο δύο γνήσιων κλασμάτων είναι πάντα μικρότερο και από τα δύο αρχικά!)`
                    : `💡 Τελικό Αποτέλεσμα: ${activeNumA} × (${activeNumB}/${activeDenB}) ＝ ${isSimplified ? `${simplifiedNum}/${simplifiedDen}` : `${resultNum}/${resultDen}`}`}
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες να πολλαπλασιάζεις κλάσματα και ακεραίους; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/29-pollaplasiasmos-klasmaton-ask"
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

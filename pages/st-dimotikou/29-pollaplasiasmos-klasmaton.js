import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// ΚΕΝΤΡΙΚΗ ΜΕΤΑΒΛΗΤΗ ΡΥΘΜΙΣΗΣ ΜΕΓΙΣΤΩΝ ΤΙΜΩΝ
const MAX_LIMIT = 100;

const PRESETS_FF = [
  { nA: 2, dA: 3, nB: 3, dB: 4, label: "2/3 × 3/4 ➔ 1/2" },
  { nA: 4, dA: 3, nB: 3, dB: 2, label: "4/3 × 3/2 ➔ 2 (Καταχρηστικά)" },
  { nA: 5, dA: 4, nB: 2, dB: 3, label: "5/4 × 2/3 ➔ 5/6" },
  { nA: 3, dA: 2, nB: 5, dB: 3, label: "3/2 × 5/3 ➔ 5/2" }
];

const PRESETS_NF = [
  { nA: 3, nB: 1, dB: 4, label: "3 × 1/4 ➔ 3/4" },
  { nA: 2, nB: 2, dB: 5, label: "2 × 2/5 ➔ 4/5" },
  { nA: 4, nB: 1, dB: 2, label: "4 × 1/2 ➔ 2" },
  { nA: 3, nB: 4, dB: 3, label: "3 × 4/3 ➔ 4" }
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
  const handleNumAChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setNumA(''); return; }
    const n = Number(clean);
    if (n <= MAX_LIMIT) setNumA(n);
  };

  const handleDenAChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setDenA(''); return; }
    const n = Number(clean);
    if (n > 0 && n <= MAX_LIMIT) setDenA(n);
  };

  const handleNumBChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setNumB(''); return; }
    const n = Number(clean);
    if (n <= MAX_LIMIT) setNumB(n);
  };

  const handleDenBChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setDenB(''); return; }
    const n = Number(clean);
    if (n > 0 && n <= MAX_LIMIT) setDenB(n);
  };

  // Αυξομείωση με κουμπιά για Κλάσμα Α / Ακέραιο Α
  const adjustNumA = (amount) => {
    setNumA(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
  };
  const adjustDenA = (amount) => {
    setDenA(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
  };

  // Αυξομείωση με κουμπιά για Κλάσμα Β
  const adjustNumB = (amount) => {
    setNumB(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
  };
  const adjustDenB = (amount) => {
    setDenB(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
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

  // Προσαρμοστική Σχεδίαση Πλέγματος / Εμβαδού (Υποστηρίζει και Καταχρηστικά Κλάσματα)
  const renderGridVisual = () => {
    const unitsY = Math.max(1, Math.ceil(activeNumA / activeDenA));
    const unitsX = Math.max(1, Math.ceil(activeNumB / activeDenB));

    const totalRows = unitsY * activeDenA;
    const totalCols = unitsX * activeDenB;

    const filledRows = activeNumA;
    const filledCols = activeNumB;

    if (totalRows <= 25 && totalCols <= 25) {
      const cells = [];
      for (let r = 0; r < totalRows; r++) {
        for (let c = 0; c < totalCols; c++) {
          const isSelectedA = r < filledRows;
          const isSelectedB = c < filledCols;
          const isOverlap = isSelectedA && isSelectedB;

          const isBottomUnitBorder = (r + 1) % activeDenA === 0 && r + 1 < totalRows;
          const isRightUnitBorder = (c + 1) % activeDenB === 0 && c + 1 < totalCols;

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
              className={`border transition-colors duration-200 ${cellBg} ${
                isBottomUnitBorder ? 'border-b-2 border-b-slate-700' : ''
              } ${isRightUnitBorder ? 'border-r-2 border-r-slate-700' : ''}`}
              style={{ aspectRatio: '1/1' }}
            />
          );
        }
      }

      return (
        <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto p-2">
          <div 
            className="grid gap-0.5 border-2 border-slate-800 p-2 rounded-2xl bg-slate-100 shadow-inner w-full overflow-hidden"
            style={{ gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))` }}
          >
            {cells}
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-bold pt-1">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-300 rounded border border-blue-400" /> 1ο Κλάσμα ({activeNumA}/{activeDenA})</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-300 rounded border border-orange-400" /> 2ο Κλάσμα ({activeNumB}/{activeDenB})</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-indigo-600 rounded border border-indigo-700" /> Κοινή Περιοχή ({resultNum}/{resultDen})</span>
          </div>
          {(unitsX > 1 || unitsY > 1) && (
            <span className="text-[11px] text-slate-500 font-medium italic text-center">
              ℹ️ Εμφανίζονται {unitsY} × {unitsX} ＝ {unitsY * unitsX} ακέραιες μονάδες (χωρισμένες με έντονη γραμμή) λόγω καταχρηστικών κλασμάτων.
            </span>
          )}
        </div>
      );
    }

    const pctW = Math.min(100, (activeNumB / totalCols) * 100);
    const pctH = Math.min(100, (activeNumA / totalRows) * 100);

    return (
      <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto p-2">
        <div className="relative w-full aspect-square border-2 border-slate-800 rounded-2xl bg-white overflow-hidden shadow-inner">
          {Array.from({ length: unitsX - 1 }).map((_, i) => (
            <div 
              key={`vx-${i}`} 
              className="absolute top-0 bottom-0 border-r-2 border-slate-700 z-10" 
              style={{ left: `${((i + 1) / unitsX) * 100}%` }} 
            />
          ))}
          {Array.from({ length: unitsY - 1 }).map((_, i) => (
            <div 
              key={`hy-${i}`} 
              className="absolute left-0 right-0 border-b-2 border-slate-700 z-10" 
              style={{ top: `${((i + 1) / unitsY) * 100}%` }} 
            />
          ))}

          <div 
            className="absolute top-0 left-0 w-full bg-blue-200/80 border-b border-blue-400 transition-all duration-300"
            style={{ height: `${pctH}%` }}
          />
          <div 
            className="absolute top-0 left-0 h-full bg-orange-200/80 border-r border-orange-400 transition-all duration-300"
            style={{ width: `${pctW}%` }}
          />
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

  const actionButton = (
    <Link
      href="/st-dimotikou/29-pollaplasiasmos-klasmaton-ask"
      className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-sm flex items-center gap-1.5 shrink-0"
    >
      <span>🎯</span>
      <span>Ασκήσεις</span>
    </Link>
  );

  return (
    <Layout
      title="✖️ 29. Πολλαπλασιασμός Κλασμάτων και Ακεραίου με Κλάσμα - LearnMaths.gr"
      description="Μάθε πώς πολλαπλασιάζουμε κλάσμα με κλάσμα και ακέραιο με κλάσμα, καθώς και πώς απλοποιούμε το γινόμενο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      actionButton={actionButton}
      showAds={true}
    >
      <div className="py-6 md:py-10 space-y-8 md:space-y-10">

        {/* HERO BANNER WITH PROMO CALLOUT CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  🎓 ΣΤ' Δημοτικου
                </span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Ενοτητα 29
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                29. Πολλαπλασιασμός Κλασμάτων και Ακεραίου με Κλάσμα
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε πώς πολλαπλασιάζουμε <strong>κλάσμα με κλάσμα</strong> (αριθμητή με αριθμητή και παρονομαστή με παρονομαστή) και <strong>ακέραιο με κλάσμα</strong>, καθώς και πώς απλοποιούμε το γινόμενο!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 sm:p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
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

        {/* THEORY CARDS (3 COLS) */}
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
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Πολλαπλασιασμού Κλασμάτων
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
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
                  <div className="bg-blue-50/50 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-3">
                    <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                      🔵 Κλασμα 1
                    </span>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Αριθμητης</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(-1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                          >
                            -
                          </button>
                          <input
                            id="mult-num-a"
                            name="multNumA"
                            autoComplete="off"
                            type="text"
                            inputMode="numeric"
                            value={numA}
                            onChange={(e) => handleNumAChange(e.target.value)}
                            className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-blue-600 px-0.5"
                          />
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Παρονομαστης</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(-1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                          >
                            -
                          </button>
                          <input
                            id="mult-den-a"
                            name="multDenA"
                            autoComplete="off"
                            type="text"
                            inputMode="numeric"
                            value={denA}
                            onChange={(e) => handleDenAChange(e.target.value)}
                            className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-blue-600 px-0.5"
                          />
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-50/50 p-3.5 sm:p-4 rounded-2xl border border-indigo-200 space-y-3">
                    <span className="text-xs font-black text-indigo-800 uppercase block tracking-wider">
                      🔢 Φυσικος Αριθμος (Ακεραιος)
                    </span>
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Τιμη</span>
                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 max-w-[160px] mx-auto">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(-1); }} 
                          className="w-8 h-8 font-black text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          -
                        </button>
                        <input
                          id="mult-whole-a"
                          name="multWholeA"
                          autoComplete="off"
                          type="text"
                          inputMode="numeric"
                          value={numA}
                          onChange={(e) => handleNumAChange(e.target.value)}
                          className="w-full min-w-0 text-center font-mono font-black text-lg outline-none text-indigo-600"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(1); }} 
                          className="w-8 h-8 font-black text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ΧΕΙΡΙΣΤΗΡΙΟ Β (ΚΛΑΣΜΑ 2) */}
                <div className="bg-orange-50/50 p-3.5 sm:p-4 rounded-2xl border border-orange-200 space-y-3">
                  <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                    🟠 Κλασμα 2
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Αριθμητης</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          -
                        </button>
                        <input
                          id="mult-num-b"
                          name="multNumB"
                          autoComplete="off"
                          type="text"
                          inputMode="numeric"
                          value={numB}
                          onChange={(e) => handleNumBChange(e.target.value)}
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-orange-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Παρονομαστης</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          -
                        </button>
                        <input
                          id="mult-den-b"
                          name="multDenB"
                          autoComplete="off"
                          type="text"
                          inputMode="numeric"
                          value={denB}
                          onChange={(e) => handleDenBChange(e.target.value)}
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-orange-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Ετοιμα Παραδειγματα:
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
                    📝 Βηματα Υπολογισμου:
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

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                💡 <strong>Συμβουλή:</strong> Στον πολλαπλασιασμό κλασμάτων <strong>δεν</strong> χρειάζεται να κάνουμε τα κλάσματα ομώνυμα!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION & AREA GRID / PIZZAS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΠΡΑΞΗΣ */}
              <div className="flex items-center justify-center p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
                <div className="flex items-center gap-2.5 sm:gap-4 font-mono font-black text-lg sm:text-xl md:text-3xl select-none flex-wrap justify-center">
                  
                  {/* 1ος Όρος */}
                  {mode === 'fraction-fraction' ? (
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600">{activeNumA}</span>
                      <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-blue-600">{activeDenA}</span>
                    </div>
                  ) : (
                    <span className="text-indigo-600 text-2xl sm:text-3xl md:text-4xl">{activeNumA}</span>
                  )}

                  <div className="text-slate-400 font-light">×</div>

                  {/* 2ος Όρος */}
                  <div className="flex flex-col items-center">
                    <span className="text-orange-600">{activeNumB}</span>
                    <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                    <span className="text-orange-600">{activeDenB}</span>
                  </div>

                  <div className="text-slate-400 font-light">＝</div>

                  {/* Αναλυτικό Ενδιάμεσο Βήμα */}
                  <div className="flex flex-col items-center px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-100 rounded-xl border border-slate-200">
                    {mode === 'fraction-fraction' ? (
                      <>
                        <span className="text-slate-700 text-sm sm:text-base md:text-lg">{activeNumA} × {activeNumB}</span>
                        <div className="w-12 sm:w-16 h-0.5 bg-slate-500 my-1 rounded-full" />
                        <span className="text-slate-700 text-sm sm:text-base md:text-lg">{activeDenA} × {activeDenB}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-700 text-sm sm:text-base md:text-lg">{activeNumA} × {activeNumB}</span>
                        <div className="w-10 sm:w-12 h-0.5 bg-slate-500 my-1 rounded-full" />
                        <span className="text-slate-700 text-sm sm:text-base md:text-lg">{activeDenB}</span>
                      </>
                    )}
                  </div>

                  <div className="text-slate-500 font-bold">＝</div>

                  {/* Αποτέλεσμα */}
                  <div className="flex flex-col items-center bg-emerald-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-200">
                    <span className="text-emerald-700">{resultNum}</span>
                    <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                    <span className="text-emerald-700">{resultDen}</span>
                  </div>

                  {/* Ανάγωγο Αποτέλεσμα */}
                  {isSimplified && (
                    <>
                      <div className="text-emerald-600 font-bold">＝</div>
                      <div className="flex flex-col items-center bg-emerald-100 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-300">
                        <span className="text-emerald-800">{simplifiedNum}</span>
                        <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                        🔲 Οπτικοποιηση με Πλεγμα Εμβαδου:
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {activeNumA}/{activeDenA} × {activeNumB}/{activeDenB}
                      </span>
                    </div>
                    <div className="p-3 sm:p-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner">
                      {renderGridVisual()}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                        🍕 Οπτικοποιηση ως Επαναλαμβανομενες Μοναδες:
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {activeNumA} φορές το {activeNumB}/{activeDenB}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner p-3 sm:p-4 max-h-[360px] overflow-y-auto">
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
                          Συνολικο Γινομενο ({resultNum}/{resultDen})
                        </span>
                        {renderPizzasVisual(resultNum, resultDen, 'fill-emerald-500', 'stroke-emerald-700')}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-3.5 sm:p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                {mode === 'fraction-fraction'
                  ? `💡 Τελικό Αποτέλεσμα: (${activeNumA}/${activeDenA}) × (${activeNumB}/${activeDenB}) ＝ ${isSimplified ? `${simplifiedNum}/${simplifiedDen}` : `${resultNum}/${resultDen}`}`
                  : `💡 Τελικό Αποτέλεσμα: ${activeNumA} × (${activeNumB}/${activeDenB}) ＝ ${isSimplified ? `${simplifiedNum}/${simplifiedDen}` : `${resultNum}/${resultDen}`}`}
              </div>

            </div>

          </div>
        </div>

        {/* 5. BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
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

      </div>
    </Layout>
  );
}

// pages/st-dimotikou/29-pollaplasiasmos-klasmaton.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Κεντρικη μεταβλητη ρυθμισης μεγιστων τιμων
const MAX_LIMIT = 100;

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποιηση αριθμων με ελληνικο locale και defensive checks
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

const PRESETS_FF = [
  { nA: 2, dA: 3, nB: 3, dB: 4, label: '2/3 · 3/4 ➔ 1/2' },
  { nA: 4, dA: 3, nB: 3, dB: 2, label: '4/3 · 3/2 ➔ 2 (Καταχρηστικά)' },
  { nA: 5, dA: 4, nB: 2, dB: 3, label: '5/4 · 2/3 ➔ 5/6' },
  { nA: 3, dA: 2, nB: 5, dB: 3, label: '3/2 · 5/3 ➔ 5/2' }
];

const PRESETS_NF = [
  { nA: 3, nB: 1, dB: 4, label: '3 · 1/4 ➔ 3/4' },
  { nA: 2, nB: 2, dB: 5, label: '2 · 2/5 ➔ 4/5' },
  { nA: 4, nB: 1, dB: 2, label: '4 · 1/2 ➔ 2' },
  { nA: 3, nB: 4, dB: 3, label: '3 · 4/3 ➔ 4' }
];

// Βοηθητικη συναρτηση για ευρεση Μεγιστου Κοινου Διαιρετη (ΜΚΔ)
function findGCD(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export default function PollaplasiasmosKlasmatonPage() {
  // Mode: 'fraction-fraction' (κλασμα με κλασμα) η 'number-fraction' (αριθμος με κλασμα)
  const [mode, setMode] = useState('fraction-fraction');

  // Κατασταση για Κλασμα Α (η Ακεραιο Α)
  const [numA, setNumA] = useState(2);
  const [denA, setDenA] = useState(3);

  // Κατασταση για Κλασμα Β
  const [numB, setNumB] = useState(3);
  const [denB, setDenB] = useState(4);

  // Ελεγχος εισαγωγης κειμενου
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

  // Αυξομειωση με κουμπια για Κλασμα Α / Ακεραιο Α
  const adjustNumA = (amount) => {
    setNumA(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
  };
  const adjustDenA = (amount) => {
    setDenA(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
  };

  // Αυξομειωση με κουμπια για Κλασμα Β
  const adjustNumB = (amount) => {
    setNumB(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
  };
  const adjustDenB = (amount) => {
    setDenB(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
  };

  // Ενεργες τιμες
  const activeNumA = numA === '' ? 0 : Number(numA);
  const activeDenA = denA === '' || Number(denA) === 0 ? 1 : Number(denA);
  const activeNumB = numB === '' ? 0 : Number(numB);
  const activeDenB = denB === '' || Number(denB) === 0 ? 1 : Number(denB);

  // Υπολογισμοι Γινομενου
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

  // Προσαρμοστικη Σχεδιαση Πλεγματος / Εμβαδου
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
              ℹ️ Εμφανίζονται {unitsY} · {unitsX} ＝ {unitsY * unitsX} ακέραιες μονάδες (χωρισμένες με έντονη γραμμή) λόγω καταχρηστικών κλασμάτων.
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

  // Σχεδιαση Κυκλικων Διαγραμματων (Πιτσες) για Ακεραιος · Κλασμα
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
          <svg width="95" height="95" viewBox="0 0 100 100" className="drop-shadow-xs overflow-visible">
            {slices}
            <circle cx={cx} cy={cy} r="2" className="fill-slate-800" />
          </svg>
          <span className="text-[9px] font-bold text-slate-400 mt-1">Κομμάτια: {remainingNumForThisPizza}/{den}</span>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-2.5 p-2.5 bg-white rounded-2xl border border-slate-200 shadow-inner max-w-full">
        {pizzas}
      </div>
    );
  };

  return (
    <Layout
      title="Πολλαπλασιασμός Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς πολλαπλασιάζουμε κλάσμα με κλάσμα και ακέραιο με κλάσμα, καθώς και πώς απλοποιούμε το γινόμενο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/29-pollaplasiasmos-klasmaton-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 29 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Πολλαπλασιασμός Κλασμάτων και Ακεραίου με Κλάσμα
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς πολλαπλασιάζουμε <strong>κλάσμα με κλάσμα</strong> (αριθμητή με αριθμητή και παρονομαστή με παρονομαστή) και <strong>ακέραιο με κλάσμα</strong>, καθώς και πώς απλοποιούμε το γινόμενο!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Οπτικοποίηση με Πλέγμα Εμβαδού &amp; Επαναλαμβανόμενες Μονάδες</span>
            </div>
            <Link
              href="/st-dimotikou/29-pollaplasiasmos-klasmaton-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (3 COLS) */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Βασικές Έννοιες &amp; Κανόνες Πολλαπλασιασμού Κλασμάτων
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Όλα όσα πρέπει να γνωρίζεις για το γινόμενο κλασμάτων, τον πολλαπλασιασμό με ακέραιο και τους αντίστροφους αριθμούς.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    1. ΚΛΑΣΜΑ ΕΠΙ ΚΛΑΣΜΑ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Απευθείας Γινόμενο</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κλάσμα επί Κλάσμα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Πολλαπλασιάζουμε <strong>αριθμητή με αριθμητή</strong> και <strong>παρονομαστή με παρονομαστή</strong>. Δεν χρειάζεται ποτέ να γίνουν ομώνυμα!
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>(2/3) · (4/5) ＝ (2 · 4) / (3 · 5) ＝ <strong className="text-sky-700">8/15</strong></p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 <strong>Χρυσός Κανόνας:</strong> Δεν ψάχνουμε ποτέ Ε.Κ.Π. στον πολλαπλασιασμό! Πολλαπλασιάζουμε ευθεία οριζόντια.
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    2. ΑΚΕΡΑΙΟΣ ΕΠΙ ΚΛΑΣΜΑ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">Μόνο στον Αριθμητή</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ακέραιος επί Κλάσμα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Πολλαπλασιάζουμε τον <strong>ακέραιο μόνο με τον αριθμητή</strong> του κλάσματος. Ο παρονομαστής παραμένει ακριβώς ο ίδιος.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>3 · (2/7) ＝ (3 · 2) / 7 ＝ <strong className="text-indigo-700">6/7</strong></p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Κάθε ακέραιος α μπορεί να γραφτεί ως κλάσμα α/1 (π.χ. 3 ＝ 3/1, άρα (3/1) · (2/7) ＝ 6/7).
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    3. ΑΝΤΙΣΤΡΟΦΟΙ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-600">Γινόμενο ＝ 1</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Αντίστροφοι Αριθμοί
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Δύο αριθμοί λέγονται <strong>αντίστροφοι</strong> όταν το γινόμενό τους ισούται ακριβώς με τη <strong>μονάδα (1)</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>(3/4) · (4/3) ＝ 12/12 ＝ <strong className="text-emerald-700">1</strong></p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🎯 Για να βρεις τον αντίστροφο ενός κλάσματος, απλώς ανταλλάσσεις τη θέση του αριθμητή και του παρονομαστή!
              </div>
            </article>

          </div>
        </section>

        {/* 3. MODE SELECTOR TABS */}
        <div className="flex justify-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner max-w-md mx-auto gap-1">
          <button
            type="button"
            onClick={() => { setMode('fraction-fraction'); setNumA(2); setDenA(3); setNumB(3); setDenB(4); }}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
              mode === 'fraction-fraction' ? 'bg-blue-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✖️ {toCleanUppercase('Κλάσμα επί Κλάσμα')}
          </button>
          <button
            type="button"
            onClick={() => { setMode('number-fraction'); setNumA(3); setNumB(1); setDenB(4); }}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
              mode === 'number-fraction' ? 'bg-indigo-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔢 {toCleanUppercase('Ακέραιος επί Κλάσμα')}
          </button>
        </div>

        {/* 4. INTERACTIVE PLAYGROUND */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Διαδραστικό Εργαστήριο Πολλαπλασιασμού Κλασμάτων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-1">
              {mode === 'fraction-fraction'
                ? 'Όρισε τους όρους των δύο κλασμάτων και δες το γινόμενο και την οπτικοποίηση με το πλέγμα εμβαδού!'
                : 'Όρισε τον ακέραιο και το κλάσμα και δες την αναπαράσταση ως επαναλαμβανόμενες μονάδες!'}
            </p>
          </div>

          {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* ΧΕΙΡΙΣΤΗΡΙΟ Α (ΚΛΑΣΜΑ 1 Η ΑΚΕΡΑΙΟΣ) */}
                {mode === 'fraction-fraction' ? (
                  <div className="bg-blue-50/60 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-3">
                    <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                      🔵 ΚΛΑΣΜΑ 1
                    </span>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">ΑΡΙΘΜΗΤΗΣ</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(-1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            －
                          </button>
                          <input
                            key={`mult-num-a-${numA}`}
                            autoComplete="off"
                            spellCheck="false"
                            type="text"
                            inputMode="numeric"
                            value={numA === '' ? '' : String(numA)}
                            onChange={(e) => handleNumAChange(e.target.value)}
                            placeholder="2"
                            className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-blue-600 px-0.5"
                          />
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            ＋
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">ΠΑΡΟΝΟΜΑΣΤΗΣ</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(-1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            －
                          </button>
                          <input
                            key={`mult-den-a-${denA}`}
                            autoComplete="off"
                            spellCheck="false"
                            type="text"
                            inputMode="numeric"
                            value={denA === '' ? '' : String(denA)}
                            onChange={(e) => handleDenAChange(e.target.value)}
                            placeholder="3"
                            className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-blue-600 px-0.5"
                          />
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            ＋
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-50/60 p-3.5 sm:p-4 rounded-2xl border border-indigo-200 space-y-3">
                    <span className="text-xs font-black text-indigo-800 uppercase block tracking-wider">
                      🔢 ΦΥΣΙΚΟΣ ΑΡΙΘΜΟΣ (ΑΚΕΡΑΙΟΣ)
                    </span>
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">ΤΙΜΗ</span>
                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 max-w-[160px] mx-auto">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(-1); }} 
                          className="w-8 h-8 font-black text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`mult-whole-a-${numA}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={numA === '' ? '' : String(numA)}
                          onChange={(e) => handleNumAChange(e.target.value)}
                          placeholder="3"
                          className="w-full min-w-0 text-center font-mono font-black text-lg outline-none text-indigo-600"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(1); }} 
                          className="w-8 h-8 font-black text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ΧΕΙΡΙΣΤΗΡΙΟ Β (ΚΛΑΣΜΑ 2) */}
                <div className="bg-orange-50/60 p-3.5 sm:p-4 rounded-2xl border border-orange-200 space-y-3">
                  <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                    🟠 ΚΛΑΣΜΑ 2
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">ΑΡΙΘΜΗΤΗΣ</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`mult-num-b-${numB}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={numB === '' ? '' : String(numB)}
                          onChange={(e) => handleNumBChange(e.target.value)}
                          placeholder="3"
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-orange-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">ΠΑΡΟΝΟΜΑΣΤΗΣ</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`mult-den-b-${denB}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={denB === '' ? '' : String(denB)}
                          onChange={(e) => handleDenBChange(e.target.value)}
                          placeholder="4"
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-orange-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:
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
                        className="py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs touch-manipulation active:scale-95"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ΒΗΜΑ-ΒΗΜΑ ΕΠΕΞΗΓΗΣΗ */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs space-y-2">
                  <span className="font-black text-slate-900 uppercase block text-[11px]">
                    📝 ΒΗΜΑΤΑ ΥΠΟΛΟΓΙΣΜΟΥ:
                  </span>
                  {mode === 'fraction-fraction' ? (
                    <div className="space-y-1 text-xs">
                      <p>1. Αριθμητές: {activeNumA} · {activeNumB} ＝ <strong className="text-blue-700">{resultNum}</strong></p>
                      <p>2. Παρονομαστές: {activeDenA} · {activeDenB} ＝ <strong className="text-orange-700">{resultDen}</strong></p>
                    </div>
                  ) : (
                    <div className="space-y-1 text-xs">
                      <p>1. Φανταζόμαστε τον ακέραιο ως κλάσμα: <span className="font-mono font-bold">{activeNumA}/1</span></p>
                      <p>2. Αριθμητής: {activeNumA} · {activeNumB} ＝ <strong className="text-indigo-700">{resultNum}</strong></p>
                      <p>3. Παρονομαστής: 1 · {activeDenB} ＝ <strong className="text-orange-700">{resultDen}</strong></p>
                    </div>
                  )}
                  {isSimplified && (
                    <p className="text-emerald-700 text-[11px] font-bold pt-1 border-t border-slate-100">
                      ✨ Απλοποίηση με το {gcd}: <strong>{simplifiedNum}/{simplifiedDen}</strong>
                    </p>
                  )}
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                💡 <strong>Συμβουλή:</strong> Στον πολλαπλασιασμό κλασμάτων <strong>δεν</strong> χρειάζεται να κάνουμε τα κλάσματα ομώνυμα!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION & AREA GRID / PIZZAS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΠΡΑΞΗΣ */}
              <div className="flex items-center justify-center p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
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

                  <div className="text-slate-400 font-light">·</div>

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
                        <span className="text-slate-700 text-sm sm:text-base md:text-lg">{activeNumA} · {activeNumB}</span>
                        <div className="w-12 sm:w-16 h-0.5 bg-slate-500 my-1 rounded-full" />
                        <span className="text-slate-700 text-sm sm:text-base md:text-lg">{activeDenA} · {activeDenB}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-700 text-sm sm:text-base md:text-lg">{activeNumA} · {activeNumB}</span>
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
                      <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                        🔲 ΟΠΤΙΚΟΠΟΙΗΣΗ ΜΕ ΠΛΕΓΜΑ ΕΜΒΑΔΟΥ:
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {activeNumA}/{activeDenA} · {activeNumB}/{activeDenB}
                      </span>
                    </div>
                    <div className="p-3 sm:p-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner">
                      {renderGridVisual()}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                      <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                        🍕 ΟΠΤΙΚΟΠΟΙΗΣΗ ΩΣ ΕΠΑΝΑΛΑΜΒΑΝΟΜΕΝΕΣ ΜΟΝΑΔΕΣ:
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {activeNumA} φορές το {activeNumB}/{activeDenB}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner p-3 sm:p-4">
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
                          ΣΥΝΟΛΙΚΟ ΓΙΝΟΜΕΝΟ ({resultNum}/{resultDen})
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
                  ? `💡 ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ: (${activeNumA}/{activeDenA}) · (${activeNumB}/{activeDenB}) ＝ ${isSimplified ? `${simplifiedNum}/${simplifiedDen}` : `${resultNum}/${resultDen}`}`
                  : `💡 ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ: ${activeNumA} · (${activeNumB}/{activeDenB}) ＝ ${isSimplified ? `${simplifiedNum}/${simplifiedDen}` : `${resultNum}/${resultDen}`}`}
              </div>

            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στον Πολλαπλασιασμό Κλασμάτων!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έμαθες να πολλαπλασιάζεις κλάσματα και ακεραίους; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/29-pollaplasiasmos-klasmaton-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase('Έναρξη Ασκήσεων')}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

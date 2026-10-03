// pages/st-dimotikou/24-klasma-se-dekadiko.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μεγιστες επιτρεπομενες τιμες (Οριο στο 40)
const MAX_NUMERATOR = 40;
const MAX_DENOMINATOR = 40;

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

const PRESETS = [
  { num: 1, den: 2, label: '1/2 ＝ 0,5 (Μισό)' },
  { num: 1, den: 4, label: '1/4 ＝ 0,25 (Τέταρτο)' },
  { num: 3, den: 4, label: '3/4 ＝ 0,75' },
  { num: 2, den: 5, label: '2/5 ＝ 0,4' },
  { num: 1, den: 3, label: '1/3 ＝ 0,333... (Περιοδικός)' },
  { num: 5, den: 2, label: '5/2 ＝ 2,5' }
];

export default function KlasmaSeDekadikoPage() {
  // Αρχικοποιηση αυστηρα στο 1/4 (0,25)
  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(4);

  // Διαχειριση πληκτρολογησης για τον Αριθμητη
  const handleNumeratorInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setNumerator('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_NUMERATOR) return;
    setNumerator(n);
  };

  // Διαχειριση πληκτρολογησης για τον Παρονομαστη
  const handleDenominatorInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setDenominator('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_DENOMINATOR) return;
    setDenominator(n);
  };

  // Αλλαγη με κουμπια (+1 / -1)
  const handleNumeratorChange = (amount) => {
    setNumerator(prev => Math.max(0, Math.min(MAX_NUMERATOR, (Number(prev) || 0) + amount)));
  };

  const handleDenominatorChange = (amount) => {
    setDenominator(prev => Math.max(1, Math.min(MAX_DENOMINATOR, (Number(prev) || 1) + amount)));
  };

  // Γρηγορη μετατροπη σε Κλασματικη Μοναδα (Αριθμητης = 1)
  const makeFractionalUnit = () => {
    setNumerator(1);
  };

  // Ασφαλεις τιμες για υπολογισμους
  const activeNumerator = numerator === '' ? 0 : Number(numerator);
  const activeDenominator = denominator === '' || Number(denominator) === 0 ? 1 : Number(denominator);
  const decimalValue = activeNumerator / activeDenominator;

  // Ελεγχος αν ο δεκαδικος ειναι περιοδικος
  const isPeriodic = () => {
    const str = decimalValue.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      return decimals.length > 5;
    }
    return false;
  };

  // Σχεδιασμος Πιτσας (SVG)
  const renderPizza = (pizzaIndex = 0) => {
    const slices = [];
    const radius = 55;
    const cx = 65;
    const cy = 65;

    const startingNumeratorForPizza = pizzaIndex * activeDenominator;
    const activeSlicesForThisPizza = Math.max(
      0,
      Math.min(activeDenominator, activeNumerator - startingNumeratorForPizza)
    );

    for (let i = 0; i < activeDenominator; i++) {
      const angleStep = 360 / activeDenominator;
      const startAngle = i * angleStep - 90;
      const endAngle = (i + 1) * angleStep - 90;

      const rad1 = (startAngle * Math.PI) / 180;
      const rad2 = (endAngle * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(rad1);
      const y1 = cy + radius * Math.sin(rad1);
      const x2 = cx + radius * Math.cos(rad2);
      const y2 = cy + radius * Math.sin(rad2);

      const largeArcFlag = angleStep > 180 ? 1 : 0;

      const d = activeDenominator === 1
        ? `M ${cx} ${cy} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const isFilled = i < activeSlicesForThisPizza;

      slices.push(
        <path
          key={i}
          d={d}
          onClick={() => {
            const clickedNumber = pizzaIndex * activeDenominator + i + 1;
            setNumerator(clickedNumber);
          }}
          className={`${
            isFilled 
              ? 'fill-indigo-500 stroke-indigo-700 hover:fill-indigo-400' 
              : 'fill-slate-100 stroke-slate-300 hover:fill-slate-200'
          } transition-colors duration-200 stroke-[1.5] cursor-pointer`}
          title={`Κομμάτι ${i + 1} από ${activeDenominator}`}
        />
      );
    }

    return (
      <svg width="130" height="130" viewBox="0 0 130 130" className="drop-shadow-xs shrink-0">
        {slices}
        <circle cx={cx} cy={cy} r="3" className="fill-slate-800" />
      </svg>
    );
  };

  const neededVisuals = Math.max(1, Math.ceil(activeNumerator / activeDenominator));

  return (
    <Layout
      title="Κλασματική Μονάδα & Δεκαδικός - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε τι είναι η Κλασματική Μονάδα (1/ν) και πώς κάθε κλάσμα μετατρέπεται σε δεκαδικό αριθμό εκτελώντας τη διαίρεση: Αριθμητής : Παρονομαστής για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/24-klasma-se-dekadiko-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 24 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Κλασματική Μονάδα και Μετατροπή Κλάσματος σε Δεκαδικό
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε τι είναι η <strong>Κλασματική Μονάδα (1/ν)</strong> και πώς κάθε κλάσμα μετατρέπεται σε <strong>δεκαδικό αριθμό</strong> εκτελώντας τη διαίρεση: <strong>Αριθμητής : Παρονομαστής</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Διαδραστική Αριθμογραμμή &amp; Αυτόματη Μετατροπή σε Δεκαδικό</span>
            </div>
            <Link
              href="/st-dimotikou/24-klasma-se-dekadiko-ask"
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
              Βασικές Έννοιες &amp; Μέθοδος Μετατροπής σε Δεκαδικό
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Η σχέση της κλασματικής μονάδας, της διαίρεσης και των δεκαδικών αριθμών.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΟΡΙΣΜΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">1/ν</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι η Κλασματική Μονάδα;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Είναι κάθε κλάσμα που έχει ως <strong>αριθμητή το 1</strong> (1/ν). Μας δείχνει το <strong>ένα μόνο μέρος</strong> από τα ίσα μέρη στα οποία χωρίσαμε τη μονάδα.
                </p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center flex flex-wrap justify-center gap-1.5 font-bold">
                  <span className="bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-slate-800">1/2 (μισό)</span>
                  <span className="bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-slate-800">1/4 (τέταρτο)</span>
                  <span className="bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-sky-700">1/10 (δέκατο)</span>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Κάθε κλάσμα σχηματίζεται από πολλές κλασματικές μονάδες μαζί (π.χ. τα 3/4 είναι 3 φορές το 1/4).
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΠΡΑΞΗ ΔΙΑΙΡΕΣΗΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-amber-600">Αριθμητής : Παρονομαστής</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κλάσμα ➔ Δεκαδικός
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Κάθε κλάσμα ισούται με μια <strong>διαίρεση</strong>! Διαιρούμε τον αριθμητή με τον παρονομαστή: <strong>Αριθμητής : Παρονομαστής</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>2/5 ＝ 2 : 5 ＝ <strong className="text-amber-700">0,4</strong></p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Αν το κλάσμα είναι γνήσιο, το ακέραιο μέρος του δεκαδικού είναι πάντα 0 (π.χ. 0,4 ή 0,75).
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΕΙΔΙΚΗ ΠΕΡΙΠΤΩΣΗ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-600">Άπειρα Ψηφία</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Περιοδικοί Αριθμοί
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Όταν η διαίρεση δεν τελειώνει και ένα ψηφίο (ή ομάδα ψηφίων) επαναλαμβάνεται επ' άπειρον, ο δεκαδικός ονομάζεται <strong>περιοδικός</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>1/3 ＝ 1 : 3 ＝ <strong className="text-emerald-700">0,333...</strong></p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🎯 Στην καθημερινότητα συχνά στρογγυλοποιούμε τους περιοδικούς αριθμούς στα δύο δεκαδικά ψηφία (π.χ. 0,33).
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Μετατροπής σε Δεκαδικό
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Όρισε τον αριθμητή και τον παρονομαστή και παρατήρησε τη θέση του δεκαδικού πάνω στην αριθμογραμμή και στο κυκλικό μοντέλο!
              </p>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* ΚΟΥΜΠΙ ΚΛΑΣΜΑΤΙΚΗΣ ΜΟΝΑΔΑΣ */}
                <button
                  type="button"
                  onClick={makeFractionalUnit}
                  className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs sm:text-sm font-black transition uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs touch-manipulation active:scale-95"
                >
                  ⚡ Κλασματικη Μοναδα (1/{activeDenominator})
                </button>

                <div className="space-y-3">
                  {/* ΕΛΕΓΧΟΣ ΑΡΙΘΜΗΤΗ */}
                  <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-indigo-200 shadow-xs space-y-2">
                    <span className="text-xs font-black text-indigo-800 uppercase block">
                      Αριθμητης (Διαιρετεος):
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleNumeratorChange(-1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-slate-100 hover:bg-slate-200 text-indigo-700 border border-slate-200 rounded-xl font-black transition shadow-xs text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        －
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={numerator !== '' ? numerator : ''}
                        onChange={(e) => handleNumeratorInputChange(e.target.value)}
                        placeholder="1"
                        className="w-full min-w-0 flex-1 text-center font-mono font-black text-xl sm:text-2xl text-indigo-600 bg-indigo-50/50 border-2 border-indigo-200 rounded-xl p-1.5 focus:border-indigo-500 outline-none shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => handleNumeratorChange(1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black transition shadow-md text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  {/* ΕΛΕΓΧΟΣ ΠΑΡΟΝΟΜΑΣΤΗ */}
                  <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-amber-200 shadow-xs space-y-2">
                    <span className="text-xs font-black text-amber-800 uppercase block">
                      Παρονομαστης (Διαιρετης):
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleDenominatorChange(-1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-slate-100 hover:bg-slate-200 text-amber-700 border border-slate-200 rounded-xl font-black transition shadow-xs text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        －
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={denominator !== '' ? denominator : ''}
                        onChange={(e) => handleDenominatorInputChange(e.target.value)}
                        placeholder="4"
                        className="w-full min-w-0 flex-1 text-center font-mono font-black text-xl sm:text-2xl text-amber-600 bg-amber-50/50 border-2 border-amber-200 rounded-xl p-1.5 focus:border-amber-500 outline-none shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => handleDenominatorChange(1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black transition shadow-md text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* PRESET EXAMPLES */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNumerator(p.num);
                          setDenominator(p.den);
                        }}
                        className={`py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center touch-manipulation active:scale-95 ${
                          activeNumerator === p.num && activeDenominator === p.den
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ΚΑΤΑΣΤΑΣΗ ΚΛΑΣΜΑΤΙΚΗΣ ΜΟΝΑΔΑΣ */}
                <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                  activeNumerator === 1 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  <span className="font-bold uppercase tracking-wider block text-[10px]">
                    {activeNumerator === 1 ? '✨ Κλασματικη Μοναδα' : 'ℹ Κατασταση'}
                  </span>
                  <p>
                    {activeNumerator === 1 
                      ? `Το κλάσμα 1/${activeDenominator} εκφράζει το 1 από τα ${activeDenominator} ίσα μέρη.` 
                      : `Για να γίνει κλασματική μονάδα, ο αριθμητής πρέπει να είναι 1.`}
                  </p>
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Κάνε τη διαίρεση: <strong>{activeNumerator} : {activeDenominator}</strong> για να βρεις τον δεκαδικό!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION & NUMBER LINE (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 sm:space-y-7 pb-4 sm:pb-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΜΕΤΑΤΡΟΠΗ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                {/* Κλάσμα */}
                <div className="flex flex-col items-center font-mono select-none">
                  <span className="text-3xl sm:text-4xl font-black text-indigo-600">{activeNumerator}</span>
                  <div className="w-12 h-1 bg-slate-800 rounded-full my-1" />
                  <span className="text-3xl sm:text-4xl font-black text-amber-600">{activeDenominator}</span>
                </div>

                {/* Πράξη */}
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    ΠΡΑΞΗ ΔΙΑΙΡΕΣΗΣ:
                  </span>
                  <div className="font-mono text-lg sm:text-xl font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 inline-block shadow-xs">
                    {activeNumerator} : {activeDenominator}
                  </div>
                </div>

                {/* Δεκαδικός */}
                <div className="text-center space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    ΔΕΚΑΔΙΚΟΣ ΑΡΙΘΜΟΣ:
                  </span>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-emerald-600">
                    {isPeriodic() ? `${decimalValue.toFixed(4).replace('.', ',')}...` : decimalValue.toString().replace('.', ',')}
                  </div>
                  {isPeriodic() && (
                    <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">
                      ⚠️ ΠΕΡΙΟΔΙΚΟΣ ΑΡΙΘΜΟΣ
                    </span>
                  )}
                </div>
              </div>

              {/* 2. ΑΡΙΘΜΗΤΙΚΗ ΓΡΑΜΜΗ (NUMBER LINE) - ΧΩΡΙΣ SCROLLBARS */}
              <div className="space-y-3 bg-slate-50/80 p-4 sm:p-6 rounded-2xl border border-slate-200 overflow-hidden">
                <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block text-center">
                  📍 ΘΕΣΗ ΤΟΥ ΔΕΚΑΔΙΚΟΥ ΣΤΗΝ ΑΡΙΘΜΟΓΡΑΜΜΗ:
                </span>
                
                <div className="relative w-full pt-12 pb-6 px-4 sm:px-6 select-none">
                  {/* Η Αριθμητική Γραμμή */}
                  <div className="relative w-full h-1.5 bg-slate-300 rounded-full">
                    
                    {/* Υποδιαιρέσεις & Ακέραιοι (0, 1, 2, 3, 4) */}
                    {[0, 1, 2, 3, 4].map((num) => {
                      const percentage = (num / 4) * 100;
                      return (
                        <div key={num} className="absolute flex flex-col items-center" style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}>
                          <div className="w-0.5 h-4 bg-slate-800 -top-2 relative" />
                          <span className="text-xs font-mono font-black text-slate-700 top-1 relative">{num}</span>
                        </div>
                      );
                    })}

                    {/* Ο Δείκτης (Marker) του Δεκαδικού */}
                    {decimalValue <= 4 && (
                      <div 
                        className="absolute flex flex-col items-center -top-9 transition-all duration-500 ease-out z-10"
                        style={{ left: `${(decimalValue / 4) * 100}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className="bg-emerald-600 text-white font-mono text-[11px] sm:text-xs font-black px-2 py-0.5 rounded-lg shadow-md mb-0.5 whitespace-nowrap">
                          {isPeriodic() ? decimalValue.toFixed(3).replace('.', ',') : decimalValue.toString().replace('.', ',')}
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-md animate-bounce" />
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-400 italic text-center pt-1">
                  {decimalValue > 4 
                    ? 'Ο αριθμός είναι μεγαλύτερος από το 4 και βρίσκεται εκτός των ορίων της γραμμής!' 
                    : `Η καρφίτσα δείχνει ακριβώς πού τοποθετείται ο δεκαδικός ${isPeriodic() ? decimalValue.toFixed(3).replace('.', ',') : decimalValue.toString().replace('.', ',')} ανάμεσα στους ακεραίους.`}
                </p>
              </div>

              {/* 3. ΚΥΚΛΙΚΟ ΜΟΝΤΕΛΟ (ΠΙΤΣΑ) - AUTO-EXPANDING ΧΩΡΙΣ SCROLL */}
              <div className="space-y-2">
                <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block text-center">
                  🍕 ΟΠΤΙΚΟΠΟΙΗΣΗ ΜΟΝΑΔΩΝ (ΚΥΚΛΙΚΟ ΜΟΝΤΕΛΟ):
                </span>
                <div className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-5 p-4 sm:p-5 bg-slate-50/70 rounded-2xl border border-slate-200 shadow-inner">
                  {Array.from({ length: neededVisuals }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-1">
                      {renderPizza(i)}
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Μοναδα {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. FINAL RESULT SUMMARY BANNER */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-4 sm:p-5 rounded-2xl text-center shadow-lg font-mono space-y-1">
                <span className="text-xs font-sans uppercase tracking-wider block text-blue-200 font-bold">
                  ΣΥΜΠΕΡΑΣΜΑ:
                </span>
                <div className="text-base sm:text-lg md:text-xl font-black tracking-wide flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
                  <span>{activeNumerator}/{activeDenominator} ＝ {activeNumerator} : {activeDenominator} ＝</span>
                  <span className="text-amber-300">
                    {isPeriodic() ? `${decimalValue.toFixed(4).replace('.', ',')}...` : decimalValue.toString().replace('.', ',')}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Κλάσματα και στους Δεκαδικούς!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έμαθες να μετατρέπεις κλάσματα σε δεκαδικούς αριθμούς; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/24-klasma-se-dekadiko-ask"
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

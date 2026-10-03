// pages/st-dimotikou/23-klasma.js
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
  { num: 3, den: 4, label: '3/4 (Γνήσιο)' },
  { num: 4, den: 4, label: '4/4 (Μονάδα)' },
  { num: 5, den: 4, label: '5/4 (Καταχρηστικό)' },
  { num: 6, den: 2, label: '6/2 (Ακέραιος ＝ 3)' },
  { num: 2, den: 3, label: '2/3 (Γνήσιο)' },
  { num: 7, den: 5, label: '7/5 (Καταχρηστικό)' }
];

export default function KlasmaPage() {
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);
  const [activeModel, setActiveModel] = useState('pizza'); // 'pizza' η 'chocolate'

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

  // Αλλαγη αριθμητη με κουμπια (+1 / -1)
  const handleNumeratorChange = (amount) => {
    setNumerator(prev => Math.max(0, Math.min(MAX_NUMERATOR, (Number(prev) || 0) + amount)));
  };

  // Αλλαγη παρονομαστη με κουμπια (+1 / -1)
  const handleDenominatorChange = (amount) => {
    setDenominator(prev => Math.max(1, Math.min(MAX_DENOMINATOR, (Number(prev) || 1) + amount)));
  };

  // Ασφαλεις τιμες για υπολογισμους
  const activeNumerator = numerator === '' ? 0 : numerator;
  const activeDenominator = denominator === '' || denominator === 0 ? 1 : denominator;
  const fractionValue = activeNumerator / activeDenominator;

  // Δημιουργια των κομματιων της πιτσας (κυκλος SVG)
  const renderPizza = (pizzaIndex = 0) => {
    const slices = [];
    const radius = 70;
    const cx = 90;
    const cy = 90;

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
              ? 'fill-amber-400 stroke-amber-600 hover:fill-amber-300' 
              : 'fill-slate-100 stroke-slate-300 hover:fill-slate-200'
          } transition-colors duration-200 stroke-[1.5] cursor-pointer`}
          title={`Κομμάτι ${i + 1} από ${activeDenominator}`}
        />
      );
    }

    return (
      <svg width="180" height="180" className="drop-shadow-md shrink-0">
        {slices}
        <circle cx={cx} cy={cy} r="3.5" className="fill-slate-700" />
      </svg>
    );
  };

  // Δημιουργια των κομματιων της σοκολατας (ορθογωνιο)
  const renderChocolate = (chocoIndex = 0) => {
    const blocks = [];
    const startingNumeratorForChoco = chocoIndex * activeDenominator;
    const activeBlocksForThisChoco = Math.max(
      0,
      Math.min(activeDenominator, activeNumerator - startingNumeratorForChoco)
    );

    for (let i = 0; i < activeDenominator; i++) {
      const isFilled = i < activeBlocksForThisChoco;
      blocks.push(
        <div
          key={i}
          onClick={() => {
            const clickedNumber = chocoIndex * activeDenominator + i + 1;
            setNumerator(clickedNumber);
          }}
          className={`flex-1 h-12 border border-amber-800/20 first:rounded-l-lg last:rounded-r-lg cursor-pointer transition-all duration-300 ${
            isFilled
              ? 'bg-amber-700 shadow-inner scale-[0.98]'
              : 'bg-amber-100/50 hover:bg-amber-200/50'
          }`}
          title={`Κομμάτι ${i + 1} από ${activeDenominator}`}
        />
      );
    }

    return (
      <div className="w-full bg-amber-900/10 p-2 rounded-2xl border border-amber-900/20 flex gap-0.5 shadow-sm overflow-hidden">
        {blocks}
      </div>
    );
  };

  const neededVisuals = Math.max(1, Math.ceil(activeNumerator / activeDenominator));

  const getFractionTypeMessage = () => {
    if (activeNumerator === 0) {
      return {
        title: 'Μηδενικό Κλάσμα',
        desc: 'Όταν ο αριθμητής είναι 0, το κλάσμα ισούται με 0 (δεν πήραμε κανένα μέρος).',
        color: 'text-slate-700 bg-slate-100 border-slate-300'
      };
    }
    if (activeNumerator === activeDenominator) {
      return {
        title: 'Ίσο με τη Μονάδα (1 ολόκληρο)',
        desc: 'Ο αριθμητής είναι ίσος με τον παρονομαστή. Έχουμε πάρει όλα τα κομμάτια!',
        color: 'text-emerald-800 bg-emerald-50 border-emerald-300'
      };
    }
    if (activeNumerator < activeDenominator) {
      return {
        title: 'Γνήσιο Κλάσμα (＜ 1)',
        desc: 'Ο αριθμητής είναι μικρότερος από τον παρονομαστή. Αντιπροσωπεύει ποσότητα μικρότερη από 1 ολόκληρη μονάδα.',
        color: 'text-blue-800 bg-blue-50 border-blue-300'
      };
    }
    if (activeNumerator > activeDenominator) {
      const isInteger = activeNumerator % activeDenominator === 0;
      return {
        title: isInteger ? `Ακέραιος Αριθμός (＝ ${activeNumerator / activeDenominator})` : 'Καταχρηστικό Κλάσμα (＞ 1)',
        desc: isInteger 
          ? `Ο αριθμητής διαιρείται ακριβώς με τον παρονομαστή και μας δίνει ακριβώς ${activeNumerator / activeDenominator} ολόκληρες μονάδες!`
          : 'Ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή. Χρειαζόμαστε πάνω από 1 ολόκληρη μονάδα!',
        color: 'text-purple-800 bg-purple-50 border-purple-300'
      };
    }
  };

  const typeInfo = getFractionTypeMessage();

  return (
    <Layout
      title="Η Έννοια του Κλάσματος - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς χωρίζουμε μια μονάδα σε ίσα μέρη, τι σημαίνουν ο Αριθμητής και ο Παρονομαστής και πώς διακρίνουμε τα Γνήσια, Καταχρηστικά και Ίσα με τη Μονάδα κλάσματα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/23-klasma-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 23 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Η Έννοια του Κλάσματος (Αριθμητής και Παρονομαστής)
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς χωρίζουμε μια μονάδα σε <strong>ίσα μέρη</strong>, τι σημαίνουν ο <strong>Αριθμητής</strong> και ο <strong>Παρονομαστής</strong> και πώς διακρίνουμε τα <strong>Γνήσια</strong>, <strong>Καταχρηστικά</strong> και <strong>Ίσα με τη Μονάδα</strong> κλάσματα!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Διαδραστικά Μοντέλα Πίτσας &amp; Σοκολάτας με Αυτόματο Υπολογισμό</span>
            </div>
            <Link
              href="/st-dimotikou/23-klasma-ask"
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
              Βασικές Έννοιες &amp; Ρόλος των Όρων του Κλάσματος
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Όλα όσα πρέπει να γνωρίζεις για τον αριθμητή, τον παρονομαστή και τη γραμμή του κλάσματος.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΠΑΝΩ ΜΕΡΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Πόσα πήραμε</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Αριθμητής (Πάνω)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Δείχνει <strong>πόσα από τα ίσα μέρη</strong> πήραμε, χρωματίσαμε ή εξετάζουμε.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>Στο <strong className="text-sky-700">3/4</strong> ➔ πήραμε τα <strong>3</strong> κομμάτια</p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ο αριθμητής μπορεί να είναι 0 (0/4 ＝ 0) ή και μεγαλύτερος από τον παρονομαστή (καταχρηστικό).
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΚΑΤΩ ΜΕΡΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-600">Σε πόσα χωρίσαμε</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Παρονομαστής (Κάτω)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Δείχνει <strong>σε πόσα ίσα μέρη</strong> χωρίσαμε την αρχική ακέραια μονάδα (δεν μπορεί ποτέ να είναι 0).
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>Στο <strong className="text-emerald-700">3/4</strong> ➔ χωρίσαμε σε <strong>4</strong> ίσα μέρη</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚡ <strong>Κανόνας SOS:</strong> Ο παρονομαστής ονομάζει τα μέρη (τέταρτα, πέμπτα, δέκατα) και δεν μπορεί ποτέ να είναι μηδέν!
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΠΡΑΞΗ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-purple-700">Διαίρεση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Γραμμή Κλάσματος
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Συμβολίζει πάντα την πράξη της <strong>διαίρεσης</strong>: Αριθμητής : Παρονομαστής ＝ Δεκαδική Αξία.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>3/4 ＝ 3 : 4 ＝ <strong className="text-purple-700">0,75</strong></p>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🎯 Κάθε κλάσμα είναι ένας ακριβής τρόπος γραφής μιας διαίρεσης χωρίς να χρειάζεται να υπολογίσουμε δεκαδικό!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Κλασμάτων
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Άλλαξε τον αριθμητή και τον παρονομαστή ή κάνε κλικ στα κομμάτια για να δεις την άμεση οπτική αναπαράσταση!
              </p>
            </div>

            {/* MODEL TOGGLE */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveModel('pizza')}
                className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center whitespace-nowrap touch-manipulation active:scale-95 ${
                  activeModel === 'pizza'
                    ? 'bg-amber-500 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🍕 Πίτσα (Κυκλικό)
              </button>
              <button
                type="button"
                onClick={() => setActiveModel('chocolate')}
                className={`flex-1 sm:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center whitespace-nowrap touch-manipulation active:scale-95 ${
                  activeModel === 'chocolate'
                    ? 'bg-amber-800 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🍫 Σοκολάτα (Γραμμικό)
              </button>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                <div className="space-y-3">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    ΡΥΘΜΙΣΗ ΚΛΑΣΜΑΤΟΣ (ΟΡΙΟ: {MAX_NUMERATOR}):
                  </span>

                  {/* ΕΛΕΓΧΟΣ ΑΡΙΘΜΗΤΗ */}
                  <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-blue-200 shadow-xs space-y-2">
                    <span className="text-xs font-black text-blue-800 uppercase block">
                      Αριθμητης (Πανω):
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleNumeratorChange(-1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-slate-100 hover:bg-slate-200 text-blue-700 border border-slate-200 rounded-xl font-black transition shadow-xs text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        －
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={numerator}
                        onChange={(e) => handleNumeratorInputChange(e.target.value)}
                        className="w-full min-w-0 flex-1 text-center font-mono font-black text-xl sm:text-2xl text-blue-600 bg-blue-50/50 border-2 border-blue-200 rounded-xl p-1.5 focus:border-blue-500 outline-none shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => handleNumeratorChange(1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black transition shadow-md text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  {/* ΕΛΕΓΧΟΣ ΠΑΡΟΝΟΜΑΣΤΗ */}
                  <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
                    <span className="text-xs font-black text-emerald-800 uppercase block">
                      Παρονομαστης (Κατω):
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleDenominatorChange(-1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-slate-100 hover:bg-slate-200 text-emerald-700 border border-slate-200 rounded-xl font-black transition shadow-xs text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        －
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={denominator}
                        onChange={(e) => handleDenominatorInputChange(e.target.value)}
                        className="w-full min-w-0 flex-1 text-center font-mono font-black text-xl sm:text-2xl text-emerald-600 bg-emerald-50/50 border-2 border-emerald-200 rounded-xl p-1.5 focus:border-emerald-500 outline-none shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => handleDenominatorChange(1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition shadow-md text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* PRESET BUTTONS */}
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

                {/* BOX ΚΑΤΗΓΟΡΙΑΣ ΚΛΑΣΜΑΤΟΣ */}
                <div className={`p-4 rounded-2xl border ${typeInfo.color} space-y-1 transition-all`}>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                    ΕΙΔΟΣ ΚΛΑΣΜΑΤΟΣ:
                  </span>
                  <h4 className="text-sm font-black">{typeInfo.title}</h4>
                  <p className="text-xs leading-relaxed opacity-90">{typeInfo.desc}</p>
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 <strong>Tip:</strong> Κάνε κλικ πάνω στα κομμάτια για να ορίσεις απευθείας τον αριθμητή!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              {/* 1. HEADER STATUS */}
              <div className="w-full flex flex-col sm:flex-row justify-around items-center bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 gap-4 shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center font-mono select-none">
                    <span className="text-4xl sm:text-5xl font-black text-blue-600">{activeNumerator}</span>
                    <div className="w-14 sm:w-16 h-1.5 bg-slate-800 rounded-full my-1" />
                    <span className="text-4xl sm:text-5xl font-black text-emerald-600">{activeDenominator}</span>
                  </div>
                </div>

                <span className="text-2xl sm:text-3xl font-light text-slate-300">＝</span>

                <div className="text-center font-mono bg-white px-5 sm:px-6 py-3 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-sans text-slate-400 block font-bold uppercase tracking-wider">
                    ΔΕΚΑΔΙΚΗ ΑΞΙΑ:
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-800">
                    {Number(fractionValue.toFixed(3)).toLocaleString('el-GR')}
                  </span>
                </div>
              </div>

              {/* 2. ΟΠΤΙΚΟ ΜΟΝΤΕΛΟ */}
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider">
                    {activeModel === 'pizza' ? '🍕 ΚΥΚΛΙΚΟ ΜΟΝΤΕΛΟ (ΠΙΤΣΑ)' : '🍫 ΓΡΑΜΜΙΚΟ ΜΟΝΤΕΛΟ (ΣΟΚΟΛΑΤΑ)'}:
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {neededVisuals} {neededVisuals === 1 ? 'μονάδα' : 'μονάδες'}
                  </span>
                </div>

                {activeModel === 'pizza' ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-4 sm:p-6 bg-slate-50/70 rounded-3xl border border-slate-200 max-h-[300px] sm:max-h-[340px] overflow-y-auto shadow-inner">
                    {Array.from({ length: neededVisuals }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center space-y-2">
                        {renderPizza(i)}
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Μοναδα {i + 1}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 p-4 sm:p-6 bg-slate-50/70 rounded-3xl border border-slate-200 max-h-[300px] sm:max-h-[340px] overflow-y-auto shadow-inner">
                    {Array.from({ length: neededVisuals }).map((_, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                          <span>Σοκολατα {i + 1}</span>
                          <span>{Math.max(0, Math.min(activeDenominator, activeNumerator - i * activeDenominator))} / {activeDenominator}</span>
                        </div>
                        {renderChocolate(i)}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. FINAL SUMMARY BANNER */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-4 sm:p-5 rounded-2xl text-center shadow-lg font-mono space-y-1">
                <span className="text-xs font-sans uppercase tracking-wider block text-blue-200 font-bold">
                  ΣΥΜΠΕΡΑΣΜΑ:
                </span>
                <div className="text-base sm:text-lg md:text-xl font-black tracking-wide">
                  Το κλάσμα <span className="text-amber-300">{activeNumerator}/{activeDenominator}</span> αντιπροσωπεύει <strong>{activeNumerator}</strong> από τα <strong>{activeDenominator}</strong> ίσα μέρη.
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Κλάσματα!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατάλαβες πώς λειτουργούν ο αριθμητής και ο παρονομαστής; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/23-klasma-ask"
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

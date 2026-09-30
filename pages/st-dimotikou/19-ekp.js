// pages/st-dimotikou/19-ekp.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PRESETS = [
  [4, 6],
  [6, 8, 12],
  [4, 6, 8],
  [3, 5, 6, 10],
  [8, 12, 16],
  [5, 10, 15, 20]
];

const MAX_LIMIT = 500;

// Μεγιστος Κοινος Διαιρετης
function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

// Ελαχιστο Κοινο Πολλαπλασιο δυο αριθμων
function lcmTwo(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

// ΕΚΠ πινακα αριθμων
function calculateLcmArray(arr) {
  const valid = arr.filter((n) => typeof n === 'number' && n > 0);
  if (valid.length === 0) return 0;
  return valid.reduce((acc, curr) => lcmTwo(acc, curr), valid[0]);
}

// Δημιουργια πολλαπλασιων μεχρι να φτασουν και τα 3 κοινα πολλαπλασια (1×, 2×, 3× ΕΚΠ)
function generateMultiplesList(num, targetLcm) {
  if (!num || num < 1) return [];
  const list = [];
  const targetLimit = targetLcm > 0 ? targetLcm * 3 : num * 20;
  
  for (let i = 1; num * i <= targetLimit && i <= 500; i++) {
    list.push(num * i);
  }
  return list;
}

// Υπολογισμος κατακορυφης κλιμακας ταυτοχρονης παραγοντοποιησης
function getSimultaneousDivisionSteps(nums) {
  const valid = nums.filter((n) => typeof n === 'number' && n > 1);
  if (valid.length === 0) return [];

  let current = [...valid];
  const steps = [];

  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

  while (current.some((n) => n > 1)) {
    let chosenDivisor = null;
    for (const p of primes) {
      if (current.some((n) => n % p === 0)) {
        chosenDivisor = p;
        break;
      }
    }

    if (!chosenDivisor) {
      let candidate = 2;
      while (!current.some((n) => n % candidate === 0)) {
        candidate++;
      }
      chosenDivisor = candidate;
    }

    steps.push({
      nums: [...current],
      divisor: chosenDivisor
    });

    current = current.map((n) => (n % chosenDivisor === 0 ? n / chosenDivisor : n));
  }

  steps.push({
    nums: [...current],
    divisor: null
  });

  return steps;
}

// Υπολογισμος μορφης δυναμεων απο τους διαιρετες
function getPowerRepresentation(factors) {
  if (!factors || factors.length === 0) return '';
  const counts = {};
  factors.forEach((f) => {
    counts[f] = (counts[f] || 0) + 1;
  });

  const exponentsUnicode = { 1: '', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', 10: '¹⁰' };

  return Object.keys(counts)
    .map((factor) => {
      const count = counts[factor];
      const exponent = count > 1 ? (exponentsUnicode[count] || `^${count}`) : '';
      return `${factor}${exponent}`;
    })
    .join(' · ');
}

export default function EkpPage() {
  const [numCount, setNumCount] = useState(2); // 2, 3 η 4 αριθμοι
  const [numbers, setNumbers] = useState([4, 6, 8, 12]);
  const [activeTab, setActiveTab] = useState('sets'); // 'sets' η 'ladder'

  const handleNumberChange = (index, val) => {
    const clean = val.replace(/[^0-9]/g, '');
    const newNums = [...numbers];
    if (clean === '') {
      newNums[index] = '';
    } else {
      const parsed = parseInt(clean, 10);
      if (parsed <= MAX_LIMIT) {
        newNums[index] = parsed;
      }
    }
    setNumbers(newNums);
  };

  const activeNumbers = numbers.slice(0, numCount).map((n) => (typeof n === 'number' ? n : 0));
  const validActiveNumbers = activeNumbers.filter((n) => n > 0);
  const currentLcm = calculateLcmArray(validActiveNumbers);

  const divisionSteps = getSimultaneousDivisionSteps(validActiveNumbers);

  // Συλλογη ολων των πρωτων διαιρετων απο τα βηματα
  const ladderDivisors = divisionSteps
    .filter((s) => s.divisor !== null)
    .map((s) => s.divisor);

  const powerRep = getPowerRepresentation(ladderDivisors);

  return (
    <Layout
      title="Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε να βρίσκεις το Ε.Κ.Π. δύο, τριών ή τεσσάρων αριθμών με τις μεθόδους της Λίστας Πολλαπλασίων και της Ταυτόχρονης Διαίρεσης για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/19-ekp-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 19 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.)
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε να βρίσκεις το <strong>Ε.Κ.Π.</strong> δύο, τριών ή τεσσάρων αριθμών με τις μεθόδους της <strong>Λίστας Πολλαπλασίων</strong> και της <strong>Ταυτόχρονης Διαίρεσης</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Λίστες Πολλαπλασίων &amp; Πίνακας Ταυτόχρονης Διαίρεσης</span>
            </div>
            <Link
              href="/st-dimotikou/19-ekp-ask"
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
              Βασικές Έννοιες &amp; Μέθοδοι Εύρεσης
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Όλα όσα πρέπει να γνωρίζεις για το Ελάχιστο Κοινό Πολλαπλάσιο.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΟΡΙΣΜΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μικρότερο Θετικό</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι το Ε.Κ.Π.;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Είναι το <strong>μικρότερο θετικό κοινό πολλαπλάσιο</strong> δύο ή περισσότερων φυσικών αριθμών (δηλαδή το μικρότερο κοινό πολλαπλάσιο εκτός από το 0).
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>Ε.Κ.Π.(4, 6) ＝ <strong className="text-blue-700">12</strong></p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Το Ε.Κ.Π. είναι πάντοτε μεγαλύτερο ή ίσο με τον μεγαλύτερο από τους αριθμούς.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΜΕΘΟΔΟΣ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">Λίστες</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Λίστα Πολλαπλασίων
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Γράφουμε τα θετικά πολλαπλάσια κάθε αριθμού. Το πρώτο κοινό που συναντάμε είναι το <strong>Ε.Κ.Π.</strong>, ενώ τα επόμενα κοινά είναι πολλαπλάσια του Ε.Κ.Π. (2·, 3·...).
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>Κοινά Πολλαπλάσια: <strong className="text-amber-600">12</strong>, <strong className="text-emerald-600">24</strong>, <strong className="text-emerald-600">36</strong>...</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Όλα τα κοινά πολλαπλάσια είναι και πολλαπλάσια του Ε.Κ.Π.!
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΜΕΘΟΔΟΣ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-600">Ταυτόχρονη</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ταυτόχρονη Διαίρεση
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Τοποθετούμε τους αριθμούς δίπλα-δίπλα και διαιρούμε με τον μικρότερο πρώτο που διαιρεί τουλάχιστον έναν. Το Ε.Κ.Π. είναι το <strong>γινόμενο όλων των πρώτων διαιρετών</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>Ε.Κ.Π. ＝ 2 · 2 · 3 ＝ 12</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🎯 Κατάλληλη μέθοδος για μεγαλύτερους αριθμούς ή για 3 και 4 αριθμούς ταυτόχρονα.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ Ε.Κ.Π. */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Ε.Κ.Π.
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Επίλεξε το πλήθος των αριθμών (2, 3 ή 4), πληκτρολόγησε τις τιμές και δες τα 3 πρώτα κοινά πολλαπλάσια!
              </p>
            </div>

            {/* METHOD TOGGLE */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('sets')}
                className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center touch-manipulation active:scale-95 ${
                  activeTab === 'sets'
                    ? 'bg-blue-600 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📝 Λίστες Πολλαπλασίων
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ladder')}
                className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center touch-manipulation active:scale-95 ${
                  activeTab === 'ladder'
                    ? 'bg-indigo-600 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📐 Ταυτόχρονη Διαίρεση
              </button>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID (3 COLS LEFT / 9 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUTS & PRESETS (3 COLS) */}
            <div className="lg:col-span-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* COUNT SELECTOR (2, 3, 4) */}
                <div className="space-y-1.5">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    Πληθος Αριθμων:
                  </span>
                  <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs gap-1">
                    {[2, 3, 4].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNumCount(c)}
                        className={`flex-1 py-1.5 rounded-lg text-xs sm:text-sm font-black transition touch-manipulation active:scale-95 ${
                          numCount === c
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {c} ΑΡΙΘΜΟΙ
                      </button>
                    ))}
                  </div>
                </div>

                {/* INPUT FIELDS */}
                <div className="space-y-2">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    Τιμες Αριθμων (1 - 500):
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: numCount }).map((_, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
                          Αριθμσς {idx + 1}:
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={numbers[idx]}
                          onChange={(e) => handleNumberChange(idx, e.target.value)}
                          className="w-full text-base sm:text-lg font-mono font-black text-center p-2 bg-white border-2 border-blue-200 rounded-xl shadow-xs text-blue-600 outline-none focus:border-blue-500 tracking-wider"
                          placeholder="π.χ. 6"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* PRESET EXAMPLES (2 COLS x 3 ROWS) */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    Η διαλεξε ετοιμο παραδειγμα:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNumCount(p.length);
                          const updated = [4, 6, 8, 12];
                          p.forEach((val, i) => {
                            updated[i] = val;
                          });
                          setNumbers(updated);
                        }}
                        className="py-2 px-1 rounded-xl border font-mono font-black text-xs sm:text-sm transition-all text-center bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs touch-manipulation active:scale-95"
                      >
                        ({p.join(', ')})
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Τα επόμενα κοινά πολλαπλάσια είναι πάντα πολλαπλάσια του <strong>Ε.Κ.Π.</strong> (2·, 3·, 4·...).
              </div>
            </div>

            {/* RIGHT: VISUALIZATION (9 COLS) */}
            <div className="lg:col-span-9 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              {/* HEADER STATUS */}
              <div className="w-full text-center">
                <span className="text-xs 2xl:text-sm font-bold text-slate-400 uppercase tracking-wider block">
                  ΥΠΟΛΟΓΙΣΜΟΣ Ε.Κ.Π. ΓΙΑ ΤΟΥΣ ΑΡΙΘΜΟΥΣ:
                </span>
                <div className="text-lg sm:text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 sm:px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-wider shadow-xs">
                  Ε.Κ.Π.({validActiveNumbers.join(', ') || '—'}) ＝{' '}
                  <span className="text-amber-500">{currentLcm > 0 ? currentLcm.toLocaleString('el-GR') : '—'}</span>
                </div>
              </div>

              {/* VISUAL METHOD DISPLAY */}
              <div className="w-full my-auto py-2 flex justify-center items-center">
                {validActiveNumbers.length >= 2 && currentLcm > 0 ? (
                  activeTab === 'sets' ? (
                    /* EXPANDED LIST OF MULTIPLES */
                    <div className="space-y-4 w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                        <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider">
                          📋 ΛΙΣΤΕΣ ΠΟΛΛΑΠΛΑΣΙΩΝ ΜΕ ΤΑ 3 ΠΡΩΤΑ ΚΟΙΝΑ:
                        </span>
                        <div className="flex items-center gap-3 text-xs font-bold flex-wrap">
                          <span className="flex items-center gap-1.5 text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span> 1ο Κοινό (Ε.Κ.Π.)
                          </span>
                          <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 2ο &amp; 3ο Κοινό
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4 bg-slate-50 p-3.5 sm:p-6 rounded-3xl border border-slate-200 shadow-inner max-h-[420px] sm:max-h-[460px] overflow-y-auto w-full">
                        {validActiveNumbers.map((num, i) => {
                          const mults = generateMultiplesList(num, currentLcm);
                          return (
                            <div key={i} className="flex flex-col md:flex-row md:items-start gap-2.5 border-b border-slate-200/80 pb-4 last:border-0 last:pb-0">
                              <span className="font-mono font-black text-slate-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm min-w-[85px] text-center shadow-xs shrink-0 mt-0.5">
                                Π({num})
                              </span>
                              <div className="flex flex-wrap gap-1.5 items-center flex-1">
                                {mults.map((m, idx) => {
                                  const isFirstLcm = m === currentLcm;
                                  const isSubsequentLcm = m === currentLcm * 2 || m === currentLcm * 3;

                                  if (isFirstLcm) {
                                    return (
                                      <span
                                        key={idx}
                                        className="font-mono text-xs sm:text-sm px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black shadow-md scale-105 ring-2 ring-amber-300"
                                        title="1ο Κοινό Πολλαπλάσιο (Ε.Κ.Π.)"
                                      >
                                        {m.toLocaleString('el-GR')}
                                      </span>
                                    );
                                  }

                                  if (isSubsequentLcm) {
                                    return (
                                      <span
                                        key={idx}
                                        className="font-mono text-xs sm:text-sm px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-black shadow-sm ring-2 ring-emerald-300"
                                        title={m === currentLcm * 2 ? '2ο Κοινό Πολλαπλάσιο' : '3ο Κοινό Πολλαπλάσιο'}
                                      >
                                        {m.toLocaleString('el-GR')}
                                      </span>
                                    );
                                  }

                                  return (
                                    <span
                                      key={idx}
                                      className="font-mono text-xs sm:text-sm px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200/80"
                                    >
                                      {m.toLocaleString('el-GR')}
                                    </span>
                                  );
                                })}
                                <span className="text-slate-400 font-bold text-xs">...</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* SIMULTANEOUS DIVISION DISPLAY WITH CALCULATION FORMULA */
                    <div className="flex flex-col items-center justify-center space-y-4 w-full">
                      <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider mb-1">
                        📐 ΠΙΝΑΚΑΣ ΤΑΥΤΟΧΡΟΝΗΣ ΔΙΑΙΡΕΣΗΣ ΣΕ ΠΡΩΤΟΥΣ ΠΑΡΑΓΟΝΤΕΣ:
                      </span>

                      {/* ΚΑΤΑΚΟΡΥΦΟΣ ΠΙΝΑΚΑΣ */}
                      <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm md:text-base min-w-[240px] sm:min-w-[280px] shadow-md overflow-x-auto">
                        {divisionSteps.map((step, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-slate-800 py-1.5 last:border-0">
                            <div className="flex gap-2 sm:gap-4 font-black text-blue-300 text-right pr-3 sm:pr-4 border-r-2 border-amber-400 flex-1 justify-end">
                              {step.nums.map((n, ni) => (
                                <span key={ni} className="w-6 sm:w-8 text-center">
                                  {n}
                                </span>
                              ))}
                            </div>
                            <span className="font-black text-emerald-400 text-left w-12 sm:w-16 pl-3 sm:pl-4">
                              {step.divisor || '—'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* ΥΠΟΛΟΓΙΣΜΟΣ ΓΙΝΟΜΕΝΟΥ ΔΙΑΙΡΕΤΩΝ */}
                      {ladderDivisors.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 px-4 sm:px-6 py-3 rounded-2xl text-center shadow-xs space-y-1 w-full max-w-lg">
                          <span className="text-[11px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider block">
                            ΥΠΟΛΟΓΙΣΜΟΣ ΓΙΝΟΜΕΝΟΥ ΠΡΩΤΩΝ ΔΙΑΙΡΕΤΩΝ:
                          </span>
                          <div className="text-sm sm:text-base md:text-lg font-mono font-black text-slate-800 tracking-wide flex flex-wrap justify-center items-center gap-1.5">
                            <span className="text-emerald-700">{ladderDivisors.join(' · ')}</span>
                            {powerRep && powerRep !== ladderDivisors.join(' · ') && (
                              <span className="text-slate-500 text-xs sm:text-base"> ＝ {powerRep}</span>
                            )}
                            <span> ＝ </span>
                            <span className="text-blue-700 font-black">{currentLcm.toLocaleString('el-GR')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 text-xs sm:text-sm text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 w-full p-4">
                    Συμπλήρωσε τουλάχιστον 2 έγκυρους φυσικούς αριθμούς.
                  </div>
                )}
              </div>

              {/* FINAL RESULT CARD */}
              {validActiveNumbers.length >= 2 && currentLcm > 0 && (
                <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3.5 sm:p-4 rounded-2xl text-center shadow-lg font-mono font-black space-y-1">
                  <span className="text-xs md:text-sm font-sans uppercase tracking-wider block text-blue-200 font-bold">
                    ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ:
                  </span>
                  <div className="text-base sm:text-lg md:text-xl tracking-wide pt-1">
                    Ε.Κ.Π.({validActiveNumbers.join(', ')}) ＝{' '}
                    <span className="text-amber-300 font-black">{currentLcm.toLocaleString('el-GR')}</span>
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στο Ε.Κ.Π.!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έμαθες να βρίσκεις το Ελάχιστο Κοινό Πολλαπλάσιο; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να τελειοποιήσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/19-ekp-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

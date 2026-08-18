import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const PRESETS = [
  [4, 6],
  [6, 8, 12],
  [4, 6, 8],
  [3, 5, 6, 10],
  [8, 12, 16],
  [5, 10, 15, 20]
];

const MAX_LIMIT = 500;

// Μέγιστος Κοινός Διαιρέτης
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

// Ελάχιστο Κοινό Πολλαπλάσιο δύο αριθμών
function lcmTwo(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

// ΕΚΠ πίνακα αριθμών
function calculateLcmArray(arr) {
  const valid = arr.filter(n => typeof n === 'number' && n > 0);
  if (valid.length === 0) return 0;
  return valid.reduce((acc, curr) => lcmTwo(acc, curr), valid[0]);
}

// Δημιουργία των πρώτων πολλαπλασίων για κάθε αριθμό
function generateMultiplesList(num, targetLcm, maxCount = 8) {
  if (!num || num < 1) return [];
  const list = [];
  const limit = targetLcm > 0 ? Math.min(targetLcm * 1.5, num * maxCount) : num * maxCount;
  for (let i = 1; num * i <= limit && i <= 15; i++) {
    list.push(num * i);
  }
  return list;
}

// Υπολογισμός κατακόρυφης κλίμακας ταυτόχρονης παραγοντοποίησης
function getSimultaneousDivisionSteps(nums) {
  const valid = nums.filter(n => typeof n === 'number' && n > 1);
  if (valid.length === 0) return [];

  let current = [...valid];
  const steps = [];

  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

  while (current.some(n => n > 1)) {
    // Βρίσκουμε τον μικρότερο πρώτο που διαιρεί τουλάχιστον έναν από τους αριθμούς
    let chosenDivisor = null;
    for (const p of primes) {
      if (current.some(n => n % p === 0)) {
        chosenDivisor = p;
        break;
      }
    }

    if (!chosenDivisor) {
      let candidate = 2;
      while (!current.some(n => n % candidate === 0)) {
        candidate++;
      }
      chosenDivisor = candidate;
    }

    steps.push({
      nums: [...current],
      divisor: chosenDivisor
    });

    current = current.map(n => (n % chosenDivisor === 0 ? n / chosenDivisor : n));
  }

  steps.push({
    nums: [...current],
    divisor: null
  });

  return steps;
}

export default function EkpPage() {
  const [numCount, setNumCount] = useState(2); // 2, 3 ή 4 αριθμοί
  const [numbers, setNumbers] = useState([4, 6, 8, 12]);
  const [activeTab, setActiveTab] = useState('sets'); // 'sets' (λίστα πολλαπλασίων) ή 'ladder' (ταυτόχρονη διαίρεση)

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

  const activeNumbers = numbers.slice(0, numCount).map(n => (typeof n === 'number' ? n : 0));
  const validActiveNumbers = activeNumbers.filter(n => n > 0);
  const currentLcm = calculateLcmArray(validActiveNumbers);

  const divisionSteps = getSimultaneousDivisionSteps(validActiveNumbers);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🎯 Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.) - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 w-full">
          <div className={`${LAYOUT.CONTAINER} 2xl:max-w-7xl py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl 2xl:text-3xl font-black text-blue-600 tracking-tight flex items-center">
              <span>LearnMaths</span><span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/st-dimotikou/19-ekp-ask"
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs md:text-sm 2xl:text-base font-black transition shadow-sm flex items-center gap-1.5"
              >
                <span>🎯</span> Ασκήσεις
              </Link>
              <Link
                href="/st-dimotikou"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs md:text-sm 2xl:text-base font-bold transition"
              >
                🔙 ΣΤ' Δημοτικού
              </Link>
            </div>
          </div>
        </nav>

        {/* 2. MAIN LESSON CONTAINER */}
        <main className={`${LAYOUT.LESSON_CONTAINER} 2xl:max-w-7xl py-8 md:py-12 space-y-10 2xl:space-y-14`}>

          {/* HERO BANNER WITH PROMO CALLOUT CARD */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 2xl:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/20 text-white font-black text-xs 2xl:text-sm px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    🎓 ΣΤ' Δημοτικού
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs 2xl:text-sm px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενότητα 19
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                  19. Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.)
                </h1>
                <p className="text-blue-100 text-sm md:text-base 2xl:text-lg leading-relaxed max-w-3xl">
                  Μάθε να βρίσκεις το <strong>Ε.Κ.Π.</strong> δύο, τριών ή τεσσάρων αριθμών με τις μεθόδους των <strong>Συνόλων Πολλαπλασίων</strong>, των <strong>Διαδοχικών Διαιρέσεων</strong> και της <strong>Γονιμοποίησης σε Πρώτους Παράγοντες</strong>!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl 2xl:text-4xl">🚀</span>
                <h3 className="font-black text-lg 2xl:text-xl text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs 2xl:text-sm text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις εύρεσης Ε.Κ.Π. με αυτόματη βαθμολόγηση!</p>
                <Link
                  href="/st-dimotikou/19-ekp-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm 2xl:text-base"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-8">
            <div className="bg-blue-50/80 border border-blue-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  1
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Τι είναι το Ε.Κ.Π.;</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Είναι το <strong>μικρότερο θετικό κοινό πολλαπλάσιο</strong> δύο ή περισσότερων φυσικών αριθμών (δηλαδή το μικρότερο κοινό πολλαπλάσιο εκτός από το 0).
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs 2xl:text-sm text-slate-700 font-mono text-center">
                <p>Ε.Κ.Π.(4, 6) ＝ <strong className="text-blue-700 font-bold">12</strong></p>
              </div>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  2
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Μέθοδος 1: Λίστα Πολλαπλασίων</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Γράφουμε με τη σειρά τα πολλαπλάσια κάθε αριθμού μέχρι να εντοπίσουμε τον <strong>πρώτο κοινό αριθμό</strong> που εμφανίζεται σε όλες τις γραμμές.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 text-xs 2xl:text-sm text-slate-700 font-mono text-center">
                <p>Π(4): 4, 8, <strong className="text-indigo-600">12</strong>... | Π(6): 6, <strong className="text-indigo-600">12</strong>...</p>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  3
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Μέθοδος 2: Ταυτόχρονη Διαίρεση</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Τοποθετούμε τους αριθμούς σε γραμμή και διαιρούμε με τον μικρότερο πρώτο που διαιρεί τουλάχιστον έναν. Το ΕΚΠ είναι το <strong>γινόμενο όλων των διαιρετών</strong>.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 text-xs 2xl:text-sm text-slate-700 font-mono text-center font-bold">
                <p>Ε.Κ.Π. ＝ 2 × 2 × 3 ＝ 12</p>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 2xl:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl 2xl:text-3xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Ε.Κ.Π.
                </h2>
                <p className="text-gray-500 text-sm 2xl:text-base">
                  Επίλεξε το πλήθος των αριθμών (2, 3 ή 4), πληκτρολόγησε τις τιμές και δες άμεσα το Ε.Κ.Π. με 2 διαφορετικές μεθόδους!
                </p>
              </div>

              {/* METHOD TOGGLE */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('sets')}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
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
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all ${
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: INPUTS & PRESETS (3 COLS) */}
              <div className="lg:col-span-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* COUNT SELECTOR (2, 3, 4) */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                      Πλήθος Αριθμών:
                    </span>
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs gap-1">
                      {[2, 3, 4].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setNumCount(c)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-black transition ${
                            numCount === c
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {c} Αριθμοί
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* INPUT FIELDS */}
                  <div className="space-y-2">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                      Τιμές Αριθμών (1 - 500):
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: numCount }).map((_, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">
                            Αριθμός {idx + 1}:
                          </label>
                          <input
                            type="text"
                            value={numbers[idx]}
                            onChange={(e) => handleNumberChange(idx, e.target.value)}
                            className="w-full text-lg font-mono font-black text-center p-2 bg-white border-2 border-blue-200 rounded-xl shadow-xs text-blue-600 outline-none focus:border-blue-500 tracking-wider"
                            placeholder="π.χ. 6"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PRESET EXAMPLES (2 COLS x 3 ROWS) */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Ή διάλεξε έτοιμο παράδειγμα:
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
                          className="py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs"
                        >
                          ({p.join(', ')})
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 Το Ε.Κ.Π. είναι πάντα <strong>μεγαλύτερο ή ίσο</strong> από τον μεγαλύτερο αριθμό της ομάδας!
                </div>
              </div>

              {/* RIGHT: VISUALIZATION (9 COLS) */}
              <div className="lg:col-span-9 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[500px] space-y-6">
                
                {/* HEADER STATUS */}
                <div className="w-full text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Υπολογισμός Ε.Κ.Π. για τους Αριθμούς:
                  </span>
                  <div className="text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-wider shadow-sm">
                    Ε.Κ.Π.({validActiveNumbers.join(', ') || '—'}) ＝{' '}
                    <span className="text-amber-500">{currentLcm > 0 ? currentLcm.toLocaleString('el-GR') : '—'}</span>
                  </div>
                </div>

                {/* VISUAL METHOD DISPLAY */}
                <div className="w-full my-auto py-2 flex justify-center items-center">
                  {validActiveNumbers.length >= 2 && currentLcm > 0 ? (
                    activeTab === 'sets' ? (
                      /* LIST OF MULTIPLES DISPLAY */
                      <div className="space-y-4 w-full max-w-2xl">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider block text-center">
                          📋 Εύρεση του Πρώτου Κοινού Πολλαπλασίου:
                        </span>

                        <div className="space-y-3 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-inner">
                          {validActiveNumbers.map((num, i) => {
                            const mults = generateMultiplesList(num, currentLcm);
                            return (
                              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 border-b border-slate-200/80 pb-2.5 last:border-0 last:pb-0">
                                <span className="font-mono font-black text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200 text-xs sm:text-sm min-w-[75px] text-center shadow-xs">
                                  Π({num})
                                </span>
                                <div className="flex flex-wrap gap-1.5 items-center flex-1">
                                  {mults.map((m, idx) => {
                                    const isMatch = m === currentLcm;
                                    return (
                                      <span
                                        key={idx}
                                        className={`font-mono text-xs sm:text-sm px-2.5 py-1 rounded-lg transition-all ${
                                          isMatch
                                            ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-110 ring-2 ring-amber-300'
                                            : 'bg-white text-slate-600 border border-slate-200'
                                        }`}
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
                      /* SIMULTANEOUS DIVISION DISPLAY */
                      <div className="flex flex-col items-center justify-center space-y-3 w-full">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                          📐 Πίνακας Ταυτόχρονης Διαίρεσης σε Πρώτους Παράγοντες:
                        </span>

                        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 font-mono text-sm sm:text-base min-w-[280px] shadow-md">
                          {divisionSteps.map((step, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-slate-800 py-1.5 last:border-0">
                              <div className="flex gap-4 font-black text-blue-300 text-right pr-4 border-r-2 border-amber-400 flex-1 justify-end">
                                {step.nums.map((n, ni) => (
                                  <span key={ni} className="w-8 text-center">
                                    {n}
                                  </span>
                                ))}
                              </div>
                              <span className="font-black text-emerald-400 text-left w-16 pl-4">
                                {step.divisor || '—'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-12 text-sm text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 w-full">
                      Συμπλήρωσε τουλάχιστον 2 έγκυρους φυσικούς αριθμούς.
                    </div>
                  )}
                </div>

                {/* FINAL RESULT CARD */}
                {validActiveNumbers.length >= 2 && currentLcm > 0 && (
                  <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-2xl text-center shadow-lg font-mono font-black space-y-1">
                    <span className="text-xs font-sans uppercase tracking-wider block text-blue-200">
                      Τελικό Συμπέρασμα:
                    </span>
                    <div className="text-lg md:text-xl tracking-wide pt-1">
                      Ε.Κ.Π.({validActiveNumbers.join(', ')}) ＝{' '}
                      <span className="text-amber-300 font-black">{currentLcm.toLocaleString('el-GR')}</span>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER (INSIDE MAIN) */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 2xl:p-10 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl 2xl:text-3xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base 2xl:text-lg">
                Έμαθες να βρίσκεις το Ελάχιστο Κοινό Πολλαπλάσιο; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/19-ekp-ask"
              className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base 2xl:text-lg whitespace-nowrap"
            >
              Ξεκίνα τις Ασκήσεις ➔
            </Link>
          </div>

        </main>
      </div>

      {/* 6. GLOBAL FOOTER (OUTSIDE MAIN) */}
      <footer className="bg-gray-800 text-gray-400 py-6 2xl:py-8 text-center text-sm 2xl:text-base w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Μέγιστος επιτρεπόμενος αριθμός για έλεγχο (έως 10 ψηφία)
const MAX_ALLOWED_NUMBER = 9999999999; 

const PRESETS = [2, 7, 12, 15, 23, 97];

export default function ProtoiPage() {
  const [numberStr, setNumberStr] = useState("7");

  const handleInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    
    if (clean === '') {
      setNumberStr('');
    } else {
      const sliced = clean.slice(0, 10);
      
      if (BigInt(sliced) > BigInt(MAX_ALLOWED_NUMBER)) {
        setNumberStr(MAX_ALLOWED_NUMBER.toString());
      } else {
        setNumberStr(sliced);
      }
    }
  };

  const currentBigInt = numberStr ? BigInt(numberStr) : 0n;
  const isUnderOneHundred = currentBigInt <= 100n && currentBigInt > 0n;
  const numForGrid = isUnderOneHundred ? Number(currentBigInt) : 0;

  // Έλεγχος αν ο αριθμός είναι πρώτος
  const checkIsPrime = (nStr) => {
    if (!nStr) return false;
    const n = BigInt(nStr);
    if (n <= 1n) return false;
    if (n === 2n || n === 3n) return true;
    if (n % 2n === 0n || n % 3n === 0n) return false;
    
    for (let i = 5n; i * i <= n; i += 6n) {
      if (n % i === 0n || n % (i + 2n) === 0n) return false;
    }
    return true;
  };

  // Βρίσκει όλους τους διαιρέτες
  const getDivisors = (nStr) => {
    if (!nStr) return [];
    const n = BigInt(nStr);
    if (n < 1n) return [];
    
    const divsSet = new Set();
    for (let i = 1n; i * i <= n; i++) {
      if (n % i === 0n) {
        divsSet.add(Number(i));
        divsSet.add(Number(n / i));
      }
    }
    return Array.from(divsSet).sort((a, b) => a - b);
  };

  const isPrime = checkIsPrime(numberStr);
  const isOneOrZero = numberStr === "0" || numberStr === "1" || numberStr === "";
  const divisors = (!isOneOrZero && numberStr) ? getDivisors(numberStr) : [];

  // Εύρεση όλων των ζευγαριών για τη γραφική αναπαράσταση (έως 100)
  const getRectangles = (n) => {
    if (n < 1 || n > 100) return [];
    const rects = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) {
        rects.push({ rows: i, cols: n / i });
      }
    }
    return rects;
  };

  const rectangles = getRectangles(numForGrid);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Πρώτοι & Σύνθετοι Αριθμοί - LearnMaths.gr</title>
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
                href="/st-dimotikou/16-protoi-ask"
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
                    Ενότητα 16
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                  16. Πρώτοι και Σύνθετοι Αριθμοί
                </h1>
                <p className="text-blue-100 text-sm md:text-base 2xl:text-lg leading-relaxed max-w-3xl">
                  Ανακάλυψε τους δομικούς λίθους των Μαθηματικών! Μάθε να ξεχωρίζεις τους <strong>Πρώτους αριθμούς</strong> (που έχουν μόνο 2 διαιρέτες) από τους <strong>Σύνθετους αριθμούς</strong>!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl 2xl:text-4xl">🚀</span>
                <h3 className="font-black text-lg 2xl:text-xl text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs 2xl:text-sm text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση!</p>
                <Link
                  href="/st-dimotikou/16-protoi-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm 2xl:text-base"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-8">
            <div className="bg-emerald-50/80 border border-emerald-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  1
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Πρώτοι Αριθμοί</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Είναι οι φυσικοί αριθμοί μεγαλύτεροι από το 1 που έχουν <strong>ακριβώς 2 διαιρέτες</strong>: το 1 και τον εαυτό τους.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 text-xs 2xl:text-sm text-slate-700 font-mono text-center font-bold">
                <p>2, 3, 5, 7, 11, 13, 17, 19, 23...</p>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  2
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Σύνθετοι Αριθμοί</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Είναι οι φυσικοί αριθμοί που έχουν <strong>περισσότερους από 2 διαιρέτες</strong> (μπορούν να αναλυθούν σε γινόμενο μικρότερων αριθμών).
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-amber-100 text-xs 2xl:text-sm text-slate-700 font-mono text-center font-bold">
                <p>4, 6, 8, 9, 10, 12, 14, 15, 16...</p>
              </div>
            </div>

            <div className="bg-purple-50/80 border border-purple-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  3
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Ειδικές Περιπτώσεις SOS</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  • Το <strong>0</strong> και το <strong>1</strong> δεν είναι ούτε πρώτοι ούτε σύνθετοι!<br/>
                  • Το <strong>2</strong> είναι ο <strong>μοναδικός ζυγός</strong> πρώτος αριθμός!
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-purple-100 text-xs 2xl:text-sm text-slate-700 font-mono text-center font-bold">
                <p>Όλοι οι άλλοι πρώτοι είναι μόνοι!</p>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 2xl:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl 2xl:text-3xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικός Έλεγχος Πρώτων Αριθμών
                </h2>
                <p className="text-gray-500 text-sm 2xl:text-base">
                  Πληκτρολόγησε οποιονδήποτε αριθμό (έως 10 ψηφία) για να ελέγξεις αν είναι πρώτος ή σύνθετος και να δεις τη γραφική του διάταξη!
                </p>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* LEFT: INPUT & PRESETS (4 COLS) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-5 2xl:p-6 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                      Πληκτρολόγησε Αριθμό:
                    </span>
                    <input
                      type="text"
                      value={numberStr}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="w-full text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-widest break-all"
                      placeholder="π.χ. 7"
                    />
                  </div>

                  {/* PRESETS BUTTONS */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Ή διάλεξε έτοιμο παράδειγμα:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setNumberStr(preset.toString())}
                          className={`py-2 rounded-xl border font-mono font-black text-sm transition-all ${
                            numberStr === preset.toString()
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 Οι πρώτοι αριθμοί αποτελούν τα «δομικά υλικά» όλων των άλλων αριθμών!
                </div>
              </div>

              {/* RIGHT: LIVE ANALYSIS & VISUALIZATION (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
                
                {/* NUMBER STATUS HEADER */}
                <div className="w-full text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Ανάλυση για τον Αριθμό:
                  </span>
                  <div className="text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-widest max-w-full break-all shadow-sm">
                    {numberStr || "—"}
                  </div>

                  {numberStr && (
                    <div className="mt-3">
                      {isOneOrZero ? (
                        <span className="text-xs md:text-sm font-black px-4 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 inline-block shadow-xs">
                          ⚠️ Ειδική Περίπτωση: Δεν είναι ούτε Πρώτος ούτε Σύνθετος!
                        </span>
                      ) : isPrime ? (
                        <span className="text-xs md:text-sm font-black px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block shadow-xs">
                          ⭐ ΠΡΩΤΟΣ ΑΡΙΘΜΟΣ!
                        </span>
                      ) : (
                        <span className="text-xs md:text-sm font-black px-4 py-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 inline-block shadow-xs">
                          🧱 ΣΥΝΘΕΤΟΣ ΑΡΙΘΜΟΣ!
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* DIVISORS SUMMARY */}
                {numberStr && !isOneOrZero && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 w-full">
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      🔍 Διαιρέτες ({divisors.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pr-1">
                      {divisors.map(d => (
                        <span key={d} className="font-mono font-black px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs md:text-sm rounded-xl shadow-xs">
                          {d}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 pt-1 font-medium">
                      {isPrime 
                        ? `Ο αριθμός ${numberStr} έχει ακριβώς 2 διαιρέτες (το 1 και το ${numberStr}), άρα είναι Πρώτος!` 
                        : `Ο αριθμός ${numberStr} έχει ${divisors.length} διαιρέτες, άρα είναι Σύνθετος!`}
                    </p>
                  </div>
                )}

                {/* VISUAL GRID FOR NUMBERS <= 100 */}
                <div className="w-full bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4 shadow-md flex-1 flex flex-col justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block text-center">
                    💻 Γραφική Αναπαράσταση: Ορθογώνιοι Σχηματισμοί
                  </span>

                  <div className="space-y-4 my-auto overflow-y-auto max-h-[260px] pr-1 py-2 w-full">
                    {isOneOrZero ? (
                      <div className="text-center py-6 text-xs text-slate-400">
                        Οι αριθμοί 0 και 1 δεν μπορούν να σχηματίσουν ορθογώνια πλέγματα.
                      </div>
                    ) : currentBigInt > 100n ? (
                      <div className="text-center py-6 px-4 max-w-md mx-auto space-y-2">
                        <div className="text-2xl">📐</div>
                        <h4 className="text-xs font-black text-amber-400 uppercase tracking-wide">
                          Ο αριθμός είναι πολύ μεγάλος για οπτικά κουτάκια!
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Η γραφική αναπαράσταση λειτουργεί για αριθμούς έως το 100.
                        </p>
                      </div>
                    ) : numForGrid > 0 && rectangles.length > 0 ? (
                      rectangles.map((rect, idx) => (
                        <div key={idx} className="space-y-2 border-b border-slate-800 pb-4 last:border-0 last:pb-0 flex flex-col items-center w-full">
                          <div className="text-xs font-mono text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                            Διάταξη: <span className="text-amber-400 font-bold">{rect.rows} γραμμές</span> × <span className="text-cyan-400 font-bold">{rect.cols} στήλες</span> ＝ {numForGrid}
                          </div>
                          
                          <div 
                            className="grid gap-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800 justify-center shadow-inner"
                            style={{ 
                              gridTemplateColumns: `repeat(${rect.cols}, minmax(0, 1fr))`,
                              width: '100%',
                              maxWidth: `${Math.min(rect.cols * 18 + (rect.cols - 1) * 4 + 20, 420)}px`
                            }}
                          >
                            {Array.from({ length: numForGrid }).map((_, i) => (
                              <div 
                                key={i} 
                                className={`h-3 rounded-xs transition-all ${
                                  isPrime ? 'bg-emerald-500 shadow-xs' : 'bg-amber-500 shadow-xs'
                                }`}
                                style={{ minWidth: '6px' }}
                              />
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-slate-400">
                        Πληκτρολόγησε έναν αριθμό για να ξεκινήσει η οπτικοποίηση.
                      </div>
                    )}
                  </div>

                  {numForGrid > 1 && numForGrid <= 100 && (
                    <div className="text-center text-xs font-medium text-slate-400 border-t border-slate-800 pt-3">
                      {isPrime ? (
                        <span>💡 Στους <strong>Πρώτους</strong> αριθμούς μπορείς να φτιάξεις μόνο <strong>2 σχήματα</strong> (μια μεγάλη γραμμή ή μια μεγάλη στήλη)!</span>
                      ) : (
                        <span>💡 Στους <strong>Σύνθετους</strong> αριθμούς μπορείς να φτιάξεις <strong>περισσότερα από 2 σχήματα</strong>!</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-slate-100 text-center">
                  <span>🔍 Το 2 είναι ο μοναδικός ζυγός πρώτος αριθμός. Όλοι οι άλλοι ζυγοί αριθμοί διαιρούνται και με το 2, άρα είναι σύνθετοι!</span>
                </div>
              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER (INSIDE MAIN) */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 2xl:p-10 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl 2xl:text-3xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base 2xl:text-lg">
                Έμαθες να ξεχωρίζεις τους πρώτους από τους σύνθετους αριθμούς; Δοκίμασε τις διαδραστικές ασκήσεις για να τελειοποιήσεις τις γνώσεις σου!
              </p>
            </div>
            <Link
              href="/st-dimotikou/16-protoi-ask"
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

// pages/st-dimotikou/16-protoi.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μεγιστος επιτρεπομενος αριθμος για ελεγχο (εως 10 ψηφια)
const MAX_ALLOWED_NUMBER = 9999999999; 

const PRESETS = [2, 7, 12, 15, 23, 97];

// Ολοι οι 168 πρωτοι αριθμοι μεχρι το 1000
const PRIMES_UP_TO_1000 = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
  101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199,
  211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293,
  307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397,
  401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499,
  503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599,
  601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691,
  701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797,
  809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887,
  907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997
];

export default function ProtoiPage() {
  const [numberStr, setNumberStr] = useState('7');
  const [primeRangeFilter, setPrimeRangeFilter] = useState('all'); // 'all' ή '1-100', '101-200', κ.λπ.
  const [searchTerm, setSearchTerm] = useState('');

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

  // Ελεγχος αν ο αριθμος ειναι πρωτος
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

  // Βρισκει ολους τους διαιρετες
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
  const isOneOrZero = numberStr === '0' || numberStr === '1' || numberStr === '';
  const divisors = (!isOneOrZero && numberStr) ? getDivisors(numberStr) : [];

  // Ευρεση ολων των ζευγαριων για τη γραφικη αναπαρασταση (εως 100)
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

  // Φιλτραρισμα πινακα πρωτων μεχρι το 1000
  const filteredPrimes = useMemo(() => {
    return PRIMES_UP_TO_1000.filter((p) => {
      // Ελεγχος range
      if (primeRangeFilter !== 'all') {
        const [min, max] = primeRangeFilter.split('-').map(Number);
        if (p < min || p > max) return false;
      }
      // Ελεγχος search term
      if (searchTerm.trim() !== '') {
        return p.toString().includes(searchTerm.trim());
      }
      return true;
    });
  }, [primeRangeFilter, searchTerm]);

  return (
    <Layout
      title="Πρώτοι και Σύνθετοι Αριθμοί - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Ανακάλυψε τους δομικούς λίθους των Μαθηματικών! Μάθε να ξεχωρίζεις τους Πρώτους αριθμούς από τους Σύνθετους και δες τον πίνακα όλων των πρώτων έως το 1.000."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/16-protoi-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 16 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Πρώτοι &amp; Σύνθετοι Αριθμοί
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακάλυψε τους δομικούς λίθους των Μαθηματικών! Μάθε να ξεχωρίζεις τους <strong>Πρώτους αριθμούς</strong> (που έχουν μόνο 2 διαιρέτες) από τους <strong>Σύνθετους αριθμούς</strong> και εξερεύνησε τον πλήρη πίνακα όλων των πρώτων μέχρι το 1.000!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>168 Πρώτοι Αριθμοί έως το 1.000 &amp; Ορθογώνιοι Σχηματισμοί</span>
            </div>
            <Link
              href="/st-dimotikou/16-protoi-ask"
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
              Διάκριση Πρώτων και Σύνθετων Αριθμών
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Η βασική κατάταξη των φυσικών αριθμών με βάση το πλήθος των διαιρετών τους.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΚΑΤΗΓΟΡΙΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-600">Ακριβώς 2 Διαιρέτες</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πρώτοι Αριθμοί
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Είναι οι φυσικοί αριθμοί μεγαλύτεροι από το 1 που έχουν <strong>ακριβώς 2 διαιρέτες</strong>: τον αριθμό 1 και τον εαυτό τους.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>2, 3, 5, 7, 11, 13, 17, 19, 23...</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                💡 Δεν μπορούν να χωριστούν σε άλλα μικρότερα ισόποσα κομμάτια!
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΚΑΤΗΓΟΡΙΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-amber-600">&gt; 2 Διαιρέτες</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σύνθετοι Αριθμοί
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Είναι οι φυσικοί αριθμοί που έχουν <strong>περισσότερους από 2 διαιρέτες</strong> (μπορούν να αναλυθούν σε γινόμενο μικρότερων παραγόντων).
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>4, 6, 8, 9, 10, 12, 14, 15, 16...</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🧱 Σχηματίζονται συνθέτοντας (πολλαπλασιάζοντας) πρώτους αριθμούς.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΕΞΑΙΡΕΣΕΙΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-purple-600">Ειδικοί Κανόνες</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ειδικές Περιπτώσεις SOS
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  • Το <strong>0</strong> και το <strong>1</strong> δεν είναι ούτε πρώτοι ούτε σύνθετοι αριθμοί!<br />
                  • Το <strong>2</strong> είναι ο <strong>μοναδικός άρτιος (ζυγός)</strong> πρώτος αριθμός!
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>Όλοι οι υπόλοιποι πρώτοι είναι περιττοί (μονοί)!</p>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🎯 Το 1 έχει μόνο 1 διαιρέτη (τον εαυτό του), γι&apos; αυτό δεν θεωρείται πρώτος.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΕΛΕΓΧΟΥ ΠΡΩΤΩΝ ΑΡΙΘΜΩΝ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικός Έλεγχος Πρώτων Αριθμών
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Πληκτρολόγησε οποιονδήποτε αριθμό (έως 10 ψηφία) για να ελέγξεις αν είναι πρώτος ή σύνθετος και να δεις τη γραφική του διάταξη!
              </p>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID - 100% FLUID ΧΩΡΙΣ SCROLL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUT & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    Πληκτρολόγησε Αριθμό:
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={numberStr}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-widest break-all"
                    placeholder="π.χ. 7"
                  />
                </div>

                {/* PRESETS BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    Ή διάλεξε έτοιμο παράδειγμα:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNumberStr(preset.toString())}
                        className={`py-2 rounded-xl border font-mono font-black text-xs sm:text-sm transition-all touch-manipulation active:scale-95 ${
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

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Οι πρώτοι αριθμοί αποτελούν τα «δομικά υλικά» όλων των άλλων αριθμών!
              </div>
            </div>

            {/* RIGHT: LIVE ANALYSIS & VISUALIZATION (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              {/* NUMBER STATUS HEADER */}
              <div className="w-full text-center">
                <span className="text-xs 2xl:text-sm font-bold text-slate-400 uppercase tracking-wider block">
                  ΑΝΑΛΥΣΗ ΓΙΑ ΤΟΝ ΑΡΙΘΜΟ:
                </span>
                <div className="text-lg sm:text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 sm:px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-widest max-w-full break-all shadow-sm">
                  {numberStr || '—'}
                </div>

                {numberStr && (
                  <div className="mt-3">
                    {isOneOrZero ? (
                      <span className="text-xs md:text-sm font-black px-4 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 inline-block shadow-sm">
                        ⚠️ Ειδική Περίπτωση: Δεν είναι ούτε Πρώτος ούτε Σύνθετος!
                      </span>
                    ) : isPrime ? (
                      <span className="text-xs md:text-sm font-black px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block shadow-sm">
                        ⭐ ΠΡΩΤΟΣ ΑΡΙΘΜΟΣ!
                      </span>
                    ) : (
                      <span className="text-xs md:text-sm font-black px-4 py-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 inline-block shadow-sm">
                        🧱 ΣΥΝΘΕΤΟΣ ΑΡΙΘΜΟΣ!
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* DIVISORS SUMMARY */}
              {numberStr && !isOneOrZero && (
                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2 w-full">
                  <div className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">
                    🔍 ΔΙΑΙΡΕΤΕΣ ({divisors.length}):
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pr-1">
                    {divisors.map((d) => (
                      <span key={d} className="font-mono font-black px-2.5 sm:px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-xl shadow-xs">
                        {d}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 pt-1 font-medium">
                    {isPrime 
                      ? `Ο αριθμός ${numberStr} έχει ακριβώς 2 διαιρέτες (το 1 και το ${numberStr}), άρα είναι Πρώτος!` 
                      : `Ο αριθμός ${numberStr} έχει ${divisors.length} διαιρέτες, άρα είναι Σύνθετος!`}
                  </p>
                </div>
              )}

              {/* VISUAL GRID FOR NUMBERS <= 100 */}
              <div className="w-full bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 shadow-md flex-1 flex flex-col justify-between">
                <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider block text-center">
                  💻 ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ: ΟΡΘΟΓΩΝΙΟΙ ΣΧΗΜΑΤΙΣΜΟΙ
                </span>

                <div className="space-y-4 my-auto overflow-y-auto max-h-[260px] pr-1 py-2 w-full">
                  {isOneOrZero ? (
                    <div className="text-center py-6 text-xs sm:text-sm text-slate-400">
                      Οι αριθμοί 0 και 1 δεν μπορούν να σχηματίσουν ορθογώνια πλέγματα.
                    </div>
                  ) : currentBigInt > 100n ? (
                    <div className="text-center py-6 px-4 max-w-md mx-auto space-y-2">
                      <div className="text-2xl">📐</div>
                      <h4 className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-wide">
                        Ο αριθμός είναι πολύ μεγάλος για οπτικά κουτάκια!
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        Η γραφική αναπαράσταση λειτουργεί για αριθμούς έως το 100.
                      </p>
                    </div>
                  ) : numForGrid > 0 && rectangles.length > 0 ? (
                    rectangles.map((rect, idx) => (
                      <div key={idx} className="space-y-2 border-b border-slate-800 pb-4 last:border-0 last:pb-0 flex flex-col items-center w-full">
                        <div className="text-xs sm:text-sm font-mono text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                          Διάταξη: <span className="text-amber-400 font-bold">{rect.rows} γραμμές</span> · <span className="text-cyan-400 font-bold">{rect.cols} στήλες</span> ＝ {numForGrid}
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
                    <div className="text-center py-6 text-xs sm:text-sm text-slate-400">
                      Πληκτρολόγησε έναν αριθμό για να ξεκινήσει η οπτικοποίηση.
                    </div>
                  )}
                </div>

                {numForGrid > 1 && numForGrid <= 100 && (
                  <div className="text-center text-xs sm:text-sm font-medium text-slate-400 border-t border-slate-800 pt-3">
                    {isPrime ? (
                      <span>💡 Στους <strong>Πρώτους</strong> αριθμούς μπορείς να φτιάξεις μόνο <strong>2 σχήματα</strong> (μια μεγάλη γραμμή ή μια μεγάλη στήλη)!</span>
                    ) : (
                      <span>💡 Στους <strong>Σύνθετους</strong> αριθμούς μπορείς να φτιάξεις <strong>περισσότερα από 2 σχήματα</strong>!</span>
                    )}
                  </div>
                )}
              </div>

              <div className="w-full flex justify-center text-[11px] sm:text-xs font-bold text-slate-400 pt-4 border-t border-slate-100 text-center">
                <span>🔍 Το 2 είναι ο μοναδικός ζυγός πρώτος αριθμός. Όλοι οι άλλοι ζυγοί αριθμοί διαιρούνται και με το 2, άρα είναι σύνθετοι!</span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΠΛΗΡΗΣ ΠΙΝΑΚΑΣ ΠΡΩΤΩΝ ΑΡΙΘΜΩΝ ΜΕΧΡΙ ΤΟ 1.000 */}
        <section className="bg-white p-5 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>📋 ΠΛΗΡΗΣ ΚΑΤΑΛΟΓΟΣ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Όλοι οι Πρώτοι Αριθμοί μέχρι το 1.000
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Συνολικά υπάρχουν ακριβώς <strong>168 πρώτοι αριθμοί</strong> ανάμεσα στο 1 και το 1.000. Αναζήτησε ή φιλτράρισε ανά εκατοντάδα:
              </p>
            </div>

            {/* ΣΤΑΤΙΣΤΙΚΟ BADGE */}
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-center self-stretch sm:self-auto shrink-0">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Πληθος Πρωτων</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-800">
                {filteredPrimes.length} <span className="text-xs text-slate-400 font-normal">/ 168</span>
              </span>
            </div>
          </div>

          {/* ΦΙΛΤΡΑ & ΑΝΑΖΗΤΗΣΗ */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200">
            {/* Range Select */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="prime-range" className="text-xs sm:text-sm font-bold text-slate-700 shrink-0">
                Εύρος:
              </label>
              <select
                id="prime-range"
                value={primeRangeFilter}
                onChange={(e) => setPrimeRangeFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-blue-500 w-full sm:w-auto"
              >
                <option value="all">Όλοι (1 - 1.000)</option>
                <option value="1-100">1 - 100 (25 πρώτοι)</option>
                <option value="101-200">101 - 200 (21 πρώτοι)</option>
                <option value="201-300">201 - 300 (16 πρώτοι)</option>
                <option value="301-400">301 - 400 (16 πρώτοι)</option>
                <option value="401-500">401 - 500 (17 πρώτοι)</option>
                <option value="501-600">501 - 600 (14 πρώτοι)</option>
                <option value="601-700">601 - 700 (16 πρώτοι)</option>
                <option value="701-800">701 - 800 (14 πρώτοι)</option>
                <option value="801-900">801 - 900 (15 πρώτοι)</option>
                <option value="901-1000">901 - 1.000 (14 πρώτοι)</option>
              </select>
            </div>

            {/* Live Search Input */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm font-bold text-slate-700 shrink-0">Αναζήτηση:</span>
              <input
                type="text"
                inputMode="numeric"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="π.χ. 97"
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-mono font-bold text-slate-800 outline-none focus:border-blue-500 w-full sm:w-36 text-center"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* GRID ΟΛΩΝ ΤΩΝ ΠΡΩΤΩΝ ΑΡΙΘΜΩΝ */}
          <div className="bg-slate-50 border border-slate-200 p-4 sm:p-6 rounded-3xl max-h-[380px] sm:max-h-[460px] overflow-y-auto">
            {filteredPrimes.length > 0 ? (
              <div className="flex flex-wrap gap-2 justify-center">
                {filteredPrimes.map((p) => {
                  const isCurrent = numberStr === p.toString();
                  const isEvenTwo = p === 2;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNumberStr(p.toString())}
                      title={`Πρώτος αριθμός: ${p}`}
                      className={`font-mono font-bold text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all touch-manipulation active:scale-95 ${
                        isCurrent
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-110 z-10'
                          : isEvenTwo
                          ? 'bg-amber-100 text-amber-950 border-amber-300 font-black'
                          : 'bg-white text-slate-800 border-slate-200 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 shadow-xs'
                      }`}
                    >
                      {p} {isEvenTwo && '⭐'}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-xs sm:text-sm text-slate-400 font-medium">
                Δεν βρέθηκε κανένας πρώτος αριθμός με αυτό το κριτήριο αναζήτησης.
              </div>
            )}
          </div>

          {/* ΥΠΟΜΝΗΜΑ ΠΙΝΑΚΑ */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-200 border border-amber-400 inline-block"></span>
              <span>Το <strong>2</strong> είναι ο μόνος άρτιος πρώτος</span>
            </span>
            <span>💡 Κάνε κλικ σε οποιονδήποτε αριθμό για να φορτωθεί απευθείας στο διαδραστικό εργαστήριο!</span>
          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στους Πρώτους Αριθμούς!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έμαθες να ξεχωρίζεις τους πρώτους από τους σύνθετους αριθμούς; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να τελειοποιήσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/16-protoi-ask"
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

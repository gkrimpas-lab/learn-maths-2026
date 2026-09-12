// pages/e-dimotikou/09-krit-diaret.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const LIMITS = {
  NUM_MIN: 1,
  NUM_MAX: 9999
};

export default function KritiriaDiairetisisTheoryPage() {
  const [num, setNum] = useState(124);

  // Ανάλυση ψηφίων
  const numStr = Math.max(1, Math.abs(num || 1)).toString();
  const lastDigit = parseInt(numStr[numStr.length - 1], 10);
  const lastTwoDigits = numStr.length > 1 ? parseInt(numStr.slice(-2), 10) : parseInt(numStr, 10);

  const digitsArray = numStr.split('').map(Number);
  const digitsSum = digitsArray.reduce((acc, curr) => acc + curr, 0);

  // Έλεγχοι κριτηρίων διαιρετότητας
  const divBy2 = num % 2 === 0;
  const divBy3 = num % 3 === 0;
  const divBy4 = num % 4 === 0;
  const divBy5 = num % 5 === 0;
  const divBy9 = num % 9 === 0;
  const divBy10 = num % 10 === 0;
  const divBy6 = divBy2 && divBy3;
  const divBy25 = num % 25 === 0;

  return (
    <Layout
      title="Κριτήρια Διαιρετότητας - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε τα κριτήρια διαιρετότητας για το 2, 3, 4, 5, 9, 10, 25, πώς ελέγχουμε μεγάλους αριθμούς χωρίς διαίρεση και δοκιμάστε το διαδραστικό εργαστήριο."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/09-krit-diaret-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K & 4K και responsive για κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-10 2xl:space-y-14 pb-24">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 9 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Κριτήρια Διαιρετότητας
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τους κανόνες με τους οποίους ελέγχουμε ακαριαία αν ένας αριθμός διαιρείται ακριβώς με το 2, 3, 4, 5, 9, 10, 25 χωρίς να χρειάζεται να εκτελέσουμε την κάθετη διαίρεση!
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Ζωντανός Αναλυτής Αριθμών</span>
            </div>
            <Link
              href="/e-dimotikou/09-krit-diaret-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Βασικοί Κανόνες σε 4 Ομάδες
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Κατηγοριοποίηση των κριτηρίων ανάλογα με τη μέθοδο εξέτασης των ψηφίων.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΟΜΑΔΑ 1
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Τελευταίο Ψηφίο</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κριτήρια για 2, 5 και 10
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Σε αυτούς τους αριθμούς κοιτάμε <strong>μόνο το τελευταίο ψηφίο</strong> (τις μονάδες):
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base">
                  <div>
                    <strong className="text-blue-700 font-mono font-black">Με το 2:</strong> Αν λήγει σε <strong>0, 2, 4, 6, 8</strong> (άρτιος αριθμός).
                  </div>
                  <div>
                    <strong className="text-emerald-700 font-mono font-black">Με το 5:</strong> Αν λήγει σε <strong>0 ή 5</strong>.
                  </div>
                  <div>
                    <strong className="text-amber-700 font-mono font-black">Με το 10:</strong> Αν λήγει σε <strong>0</strong>.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Αν ένας αριθμός λήγει σε 0, διαιρείται ταυτόχρονα με το 2, το 5 και το 10!
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΟΜΑΔΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Άθροισμα Ψηφίων</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κριτήρια για 3 και 9
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Εδώ προσθέτουμε όλα τα ψηφία του αριθμού και ελέγχουμε το άθροισμα:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div>
                    <strong className="text-blue-700 font-sans">Με το 3:</strong> Αν το άθροισμα των ψηφίων του διαιρείται με το 3.
                  </div>
                  <div className="text-slate-500 text-xs font-sans">
                    π.χ. Για το 423: 4 ＋ 2 ＋ 3 ＝ 9 (διαιρείται με το 3).
                  </div>
                  <div className="pt-1">
                    <strong className="text-indigo-700 font-sans">Με το 9:</strong> Αν το άθροισμα των ψηφίων του διαιρείται με το 9.
                  </div>
                  <div className="text-slate-500 text-xs font-sans">
                    π.χ. Για το 738: 7 ＋ 3 ＋ 8 ＝ 18 (διαιρείται με το 9).
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Κάθε αριθμός που διαιρείται με το 9 διαιρείται <strong>πάντα</strong> και με το 3 (το αντίστροφο δεν ισχύει πάντα).
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΟΜΑΔΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Δύο Τελευταία Ψηφία</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κριτήρια για 4 και 25
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Κοιτάμε μόνο τον διψήφιο αριθμό που σχηματίζουν οι δεκάδες και οι μονάδες:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base">
                  <div>
                    <strong className="text-purple-700 font-mono font-black">Με το 4:</strong> Αν τα 2 τελευταία ψηφία είναι <strong>00</strong> ή σχηματίζουν αριθμό που διαιρείται με το 4 (π.χ. 316, 524, 1.200).
                  </div>
                  <div>
                    <strong className="text-emerald-700 font-mono font-black">Με το 25:</strong> Αν λήγει σε <strong>00, 25, 50, 75</strong> (π.χ. 375, 1.450, 2.000).
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🎯 Αγνοούμε όλα τα προηγούμενα ψηφία (εκατοντάδες, χιλιάδες) γιατί το 100 διαιρείται ακριβώς και με το 4 και με το 25!
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΟΜΑΔΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Συνδυαστικοί Κανόνες</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σύνθετα Κριτήρια (π.χ. 6)
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όταν ένας αριθμός είναι γινόμενο δύο πρώτων μεταξύ τους παραγόντων, ελέγχουμε τα δύο κριτήρια ταυτόχρονα:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">Κριτήριο του 6 ( 2 · 3 ＝ 6 ):</p>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Ένας αριθμός διαιρείται με το 6 αν είναι <strong>άρτιος</strong> (διαιρείται με το 2) <strong>ΚΑΙ</strong> το άθροισμα των ψηφίων του διαιρείται με το 3.
                  </p>
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-mono text-xs text-center font-bold text-slate-800">
                    π.χ. 354 ➔ Άρτιος (λήγει σε 4) ΚΑΙ 3 ＋ 5 ＋ 4 ＝ 12 ➔ Διαιρείται με το 6!
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Με τον ίδιο τρόπο, ένας αριθμός διαιρείται με το 15 αν διαιρείται ταυτόχρονα με το 3 και το 5!
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΚΡΙΤΗΡΙΩΝ ΔΙΑΙΡΕΤΟΤΗΤΑΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Ζωντανός Αναλυτής Κριτηρίων Διαιρετότητας
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε ή πληκτρολόγησε έναν αριθμό και παρακολούθησε σε πραγματικό χρόνο την αυτόματη εφαρμογή όλων των κριτηρίων.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Αριστερή Στήλη: Χειριστήριο Εισαγωγής & Ανατομία Αριθμού */}
            <div className="xl:col-span-5 2xl:col-span-4 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΕΠΙΛΟΓΗ ΑΡΙΘΜΟΥ
              </h4>

              {/* Stepper Αριθμού */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Αριθμός για Έλεγχο:</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                    {num}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση αριθμού κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.max(LIMITS.NUM_MIN, prev - 1));
                    }}
                    disabled={num <= LIMITS.NUM_MIN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={LIMITS.NUM_MIN}
                    max={LIMITS.NUM_MAX}
                    step={1}
                    value={num}
                    onChange={(e) => setNum(Number(e.target.value))}
                    aria-label="Αριθμός προς έλεγχο"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση αριθμού κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.min(LIMITS.NUM_MAX, prev + 1));
                    }}
                    disabled={num >= LIMITS.NUM_MAX}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά άλματος */}
                <div className="flex flex-wrap items-center justify-end gap-1.5 pt-1">
                  {[24, 75, 120, 248, 540, 789, 900, 1025].map((val) => (
                    <button
                      key={`quick-btn-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setNum(val);
                      }}
                      className={`text-xs 2xl:text-sm px-2.5 py-1 rounded-lg font-semibold transition ${
                        num === val
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτα Ανατομίας Ψηφίων */}
              <div className="p-4 2xl:p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <span className="text-xs font-black tracking-wider text-slate-400">
                  ΑΝΑΤΟΜΙΑ ΨΗΦΙΩΝ ΤΟΥ {num}
                </span>

                <div className="space-y-2 text-xs sm:text-sm font-mono">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-sans font-medium">Τελευταίο Ψηφίο:</span>
                    <strong className="text-blue-700 text-base">{lastDigit}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-sans font-medium">Δύο Τελευταία Ψηφία:</span>
                    <strong className="text-purple-700 text-base">{lastTwoDigits}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-sans font-medium">Άθροισμα Ψηφίων:</span>
                    <strong className="text-emerald-700 text-base">
                      {digitsArray.join(' ＋ ')} ＝ {digitsSum}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: Πλέγμα Ελέγχων Κριτηρίων */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between text-xs sm:text-sm 2xl:text-base font-bold text-slate-500 px-1">
                <span>ΑΠΟΤΕΛΕΣΜΑΤΑ ΚΡΙΤΗΡΙΩΝ ΔΙΑΙΡΕΤΟΤΗΤΑΣ</span>
                <span className="font-mono text-slate-700">Αριθμός: {num}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
                {/* Κριτήριο του 2 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy2 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">Διαίρεση με το 2</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy2 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy2 ? '✔ Ναι' : '✖ Όχι'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    Λήγει σε <strong className="text-slate-900">{lastDigit}</strong> ({divBy2 ? 'άρτιος' : 'περιττός'}).
                  </div>
                </div>

                {/* Κριτήριο του 3 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy3 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">Διαίρεση με το 3</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy3 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy3 ? '✔ Ναι' : '✖ Όχι'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    Άθροισμα: <strong className="text-slate-900">{digitsSum}</strong> {divBy3 ? '(διαιρείται με 3)' : '(δεν διαιρείται)'}.
                  </div>
                </div>

                {/* Κριτήριο του 4 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy4 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">Διαίρεση με το 4</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy4 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy4 ? '✔ Ναι' : '✖ Όχι'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    Τελευταία δύο: <strong className="text-slate-900">{lastTwoDigits}</strong> {divBy4 ? '＝ 4 · ' + (lastTwoDigits / 4) : '(δεν διαιρείται)'}.
                  </div>
                </div>

                {/* Κριτήριο του 5 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy5 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">Διαίρεση με το 5</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy5 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy5 ? '✔ Ναι' : '✖ Όχι'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    Λήγει σε <strong className="text-slate-900">{lastDigit}</strong> {divBy5 ? '(είναι 0 ή 5)' : '(ούτε 0 ούτε 5)'}.
                  </div>
                </div>

                {/* Κριτήριο του 6 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy6 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">Διαίρεση με το 6</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy6 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy6 ? '✔ Ναι' : '✖ Όχι'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    Διαιρείται ταυτόχρονα με 2 {divBy2 ? '(✔)' : '(✖)'} και 3 {divBy3 ? '(✔)' : '(✖)'}.
                  </div>
                </div>

                {/* Κριτήριο του 9 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy9 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">Διαίρεση με το 9</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy9 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy9 ? '✔ Ναι' : '✖ Όχι'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    Άθροισμα: <strong className="text-slate-900">{digitsSum}</strong> {divBy9 ? '(διαιρείται με 9)' : '(δεν διαιρείται)'}.
                  </div>
                </div>

                {/* Κριτήριο του 10 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy10 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">Διαίρεση με το 10</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy10 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy10 ? '✔ Ναι' : '✖ Όχι'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    Λήγει σε <strong className="text-slate-900">{lastDigit}</strong> {divBy10 ? '(είναι 0)' : '(διάφορο του 0)'}.
                  </div>
                </div>

                {/* Κριτήριο του 25 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy25 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">Διαίρεση με το 25</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy25 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy25 ? '✔ Ναι' : '✖ Όχι'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    Τελευταία δύο: <strong className="text-slate-900">{lastTwoDigits}</strong> {divBy25 ? '(λήγει σε 00, 25, 50, 75)' : '(δεν διαιρείται)'}.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Κριτήρια Διαιρετότητας!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έλεγξε τις γνώσεις σου σε απαιτητικές ασκήσεις εύρεσης άγνωστων ψηφίων, συνδυαστικών κριτηρίων και αναγνώρισης διαιρετότητας.
            </p>
          </div>

          <Link
            href="/e-dimotikou/09-krit-diaret-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

// pages/e-dimotikou/19-aksonas-simmetrias.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function AksonasSimmetriasTheoryPage() {
  // Ποσοστό διπλώματος του σχήματος (από 0% έως 100%)
  const [foldProgress, setFoldProgress] = useState(0);

  // Ο άξονας συμμετρίας βρίσκεται ακριβώς στο μέσο του X (300 στο viewBox 600x320)
  const cx = 300;

  // Υπολογισμός scaleX για το αριστερό κομμάτι:
  // Στο 0% είναι 1 (πλήρως ανοιχτό), στο 100% γίνεται -1 (διπλωμένο απόλυτα πάνω στο δεξί)
  const scaleX = 1 - (foldProgress / 100) * 2;

  const isFolded = foldProgress === 100;

  return (
    <Layout
      title="Άξονας Συμμετρίας - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε τι είναι ο άξονας συμμετρίας, πώς διπλώνουμε ένα σχήμα, πόσους άξονες έχουν τα γεωμετρικά σχήματα και δοκιμάστε το διαδραστικό εργαστήριο διπλώματος."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/19-aksonas-simmetrias-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 19 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ο Άξονας Συμμετρίας
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Εξερευνούμε την έννοια της αξονικής συμμετρίας, πώς μια ευθεία χωρίζει ένα σχήμα σε δύο ακριβώς ίσα μισά που ταυτίζονται με το δίπλωμα, πόσους άξονες συμμετρίας έχουν τα βασικά γεωμετρικά σχήματα και πού τη συναντάμε στη φύση.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Ζωντανό Εργαστήριο Διπλώματος Σχήματος</span>
            </div>
            <Link
              href="/e-dimotikou/19-aksonas-simmetrias-ask"
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
              Βασικές Έννοιες σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Η μαθηματική έννοια της συμμετρίας, οι ιδιότητες των συμμετρικών σημείων και τα σχήματα.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι ο Άξονας Συμμετρίας;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Άξονας συμμετρίας</strong> είναι μια νοητή ευθεία γραμμή που χωρίζει ένα γεωμετρικό σχήμα σε δύο μισά μέρη με τέτοιο τρόπο ώστε:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>
                    • Αν <strong>διπλώσουμε</strong> το σχήμα κατά μήκος αυτής της γραμμής, τα δύο μέρη <strong>συμπίπτουν απόλυτα</strong> (εφαρμόζουν ακριβώς το ένα πάνω στο άλλο).
                  </div>
                  <div>
                    • Το ένα μέρος αποτελεί την <strong>κατοπτρική αντανάκλαση</strong> (το «καθρέφτισμα») του άλλου.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ένα σχήμα που έχει τουλάχιστον έναν άξονα συμμετρίας ονομάζεται <strong>συμμετρικό σχήμα</strong>.
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ιδιότητα Σημείων</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Συμμετρικά Σημεία
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για κάθε σημείο Α του ενός μέρους, υπάρχει ένα αντίστοιχο συμμετρικό σημείο Α' στο άλλο μέρος, τέτοιο ώστε:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>
                    1. Το ευθύγραμμο τμήμα ΑΑ' είναι <strong>κάθετο στον άξονα συμμετρίας</strong> (ΑΑ' ⊥ άξονας).
                  </div>
                  <div>
                    2. Τα σημεία Α και Α' <strong>απέχουν ακριβώς την ίδια απόσταση</strong> από τον άξονα συμμετρίας.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚡ Ο άξονας συμμετρίας είναι στην πραγματικότητα η <strong>μεσοκάθετος</strong> του τμήματος που ενώνει τα συμμετρικά σημεία!
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Γεωμετρικά Σχήματα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πλήθος Αξόνων ανά Σχήμα
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Κάθε γεωμετρικό σχήμα έχει διαφορετικό πλήθος αξόνων συμμετρίας:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">• Τετράγωνο:</span>
                    <strong className="text-blue-700 font-mono">4 άξονες</strong>
                  </div>
                  <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">• Ορθογώνιο:</span>
                    <strong className="text-emerald-700 font-mono">2 άξονες</strong>
                  </div>
                  <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">• Ισόπλευρο Τρίγωνο:</span>
                    <strong className="text-amber-700 font-mono">3 άξονες</strong>
                  </div>
                  <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">• Ισοσκελές Τρίγωνο:</span>
                    <strong className="text-purple-700 font-mono">1 άξονας</strong>
                  </div>
                  <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">• Κύκλος:</span>
                    <strong className="text-rose-700 font-mono">Άπειροι άξονες</strong>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 <strong>Προσοχή:</strong> Το σκαληνό τρίγωνο και το πλάγιο παραλληλόγραμμο <strong>δεν έχουν κανέναν άξονα συμμετρίας</strong> (0)!
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Καθημερινή Ζωή</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Συμμετρία γύρω μας
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Η αξονική συμμετρία κυριαρχεί στη φύση, την αρχιτεκτονική και τα σύμβολα:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>Έμβια όντα:</strong> Το σώμα του ανθρώπου, τα φτερά της πεταλούδας και τα φύλλα των δέντρων παρουσιάζουν αξονική συμμετρία.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    • <strong>Γράμματα &amp; Σχήματα:</strong> Τα κεφαλαία γράμματα Α, Μ, Δ έχουν κατακόρυφο άξονα, ενώ τα Β, Ε, Κ έχουν οριζόντιο!
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 Ορισμένα γράμματα όπως το <strong>Η</strong> και το <strong>Χ</strong> έχουν <strong>2 άξονες συμμετρίας</strong> (κατακόρυφο και οριζόντιο)!
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΔΙΠΛΩΜΑΤΟΣ ΣΧΗΜΑΤΟΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Προσομοίωση Διπλώματος κατά μήκος του Άξονα
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε τον δρομέα προς τα δεξιά για να διπλώσεις το αριστερό μισό του σχήματος πάνω στον άξονα. Δες πώς στο 100% τα δύο μέρη συμπίπτουν απόλυτα!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Κατάσταση Διπλώματος */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΠΡΟΟΔΟΣ ΔΙΠΛΩΜΑΤΟΣ
              </h4>

              {/* Stepper Ποσοστού Διπλώματος */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Δίπλωμα (%):</span>
                  <span
                    className={`min-w-[80px] text-center font-mono font-black text-2xl bg-white px-2.5 py-0.5 rounded-xl border shadow-sm transition ${
                      isFolded
                        ? 'text-emerald-600 border-emerald-300 ring-2 ring-emerald-100'
                        : 'text-blue-600 border-blue-200'
                    }`}
                  >
                    {foldProgress}%
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση διπλώματος κατά 5%"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFoldProgress((prev) => Math.max(0, prev - 5));
                    }}
                    disabled={foldProgress <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={foldProgress}
                    onChange={(e) => setFoldProgress(Number(e.target.value))}
                    aria-label="Ποσοστό διπλώματος σχήματος"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση διπλώματος κατά 5%"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFoldProgress((prev) => Math.min(100, prev + 5));
                    }}
                    disabled={foldProgress >= 100}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά κατάστασης */}
                <div className="flex justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setFoldProgress(0)}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-xs active:scale-95"
                  >
                    🔄 Άνοιγμα (0%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFoldProgress(100)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-xs active:scale-95 ${
                      isFolded
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    🎯 Τέλειο Δίπλωμα (100%)
                  </button>
                </div>
              </div>

              {/* Κάρτα Ελέγχου Συμμετρίας */}
              <div
                className={`p-5 rounded-2xl border space-y-2 shadow-sm text-center transition duration-200 ${
                  isFolded
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  ΕΛΕΓΧΟΣ ΣΥΜΜΕΤΡΙΑΣ
                </span>
                <div
                  className={`text-xl sm:text-2xl font-black ${
                    isFolded ? 'text-emerald-700 animate-pulse' : 'text-slate-800'
                  }`}
                >
                  {isFolded ? '🏆 ΤΑ ΔΥΟ ΜΕΡΗ ΣΥΜΠΙΠΤΟΥΝ ΑΠΟΛΥΤΑ!' : '👀 ΔΙΠΛΩΣΕ ΤΟ ΣΧΗΜΑ'}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {isFolded
                    ? 'Η κόκκινη διακεκομμένη γραμμή είναι ένας απολύτως έγκυρος Άξονας Συμμετρίας!'
                    : 'Καθώς σύρεις το ρυθμιστικό, το αριστερό μισό αναδιπλώνεται προς το δεξί.'}
                </p>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικός Καμβάς Folding */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ</span>
                <span className="font-mono text-blue-600 font-bold">
                  {isFolded ? 'Τέλεια Ταύτιση (100%)' : `Άνοιγμα: ${100 - foldProgress}%`}
                </span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[540px] aspect-[560/320] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 560 300"
                  className="w-full h-full drop-shadow-sm"
                  style={{ willChange: 'transform' }}
                >
                  {/* 1. Σταθερό Δεξί Μισό Σχήματος (Γεωμετρική καρδιά/πέταλο) */}
                  <path
                    d="M 280 60 C 340 10 410 40 410 110 C 410 180 340 220 280 260"
                    className="fill-rose-500/10 stroke-rose-400 stroke-[3.5]"
                  />

                  {/* 2. Κινούμενο Αριστερό Μισό που διπλώνει με SVG Matrix scaleX */}
                  <g transform={`translate(280, 0) scale(${scaleX}, 1) translate(-280, 0)`}>
                    <path
                      d="M 280 60 C 220 10 150 40 150 110 C 150 180 220 220 280 260"
                      className={`stroke-[3.5] transition-colors duration-150 ${
                        isFolded
                          ? 'fill-emerald-500/25 stroke-emerald-600'
                          : 'fill-rose-500/20 stroke-rose-500'
                      }`}
                    />
                  </g>

                  {/* 3. Άξονας Συμμετρίας (Κόκκινη κατακόρυφη διακεκομμένη ευθεία) */}
                  <line
                    x1="280"
                    y1="25"
                    x2="280"
                    y2="285"
                    className="stroke-rose-600 stroke-[2.5]"
                    strokeDasharray="6 4"
                  />

                  {/* Ετικέτα Άξονα Συμμετρίας */}
                  <rect
                    x="215"
                    y="12"
                    width="130"
                    height="20"
                    rx="5"
                    className="fill-rose-600"
                  />
                  <text
                    x="280"
                    y="26"
                    textAnchor="middle"
                    className="font-mono font-black text-[10px] fill-white uppercase tracking-wider"
                  >
                    ΑΞΟΝΑΣ ΣΥΜΜΕΤΡΙΑΣ
                  </text>
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                {isFolded ? (
                  <span>
                    🟢 <strong>Πλήρης συμμετρία:</strong> Το σχήμα ταυτίζεται τέλεια με το δίπλωμα πάνω στον άξονα.
                  </span>
                ) : (
                  <span>
                    📖 Δίπλωσε το σχήμα μέχρι το <strong>100%</strong> για να ελέγξεις αν συμπίπτουν οι πλευρές του.
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στον Άξονα Συμμετρίας!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις γνώσεις σου σε απαιτητικές ασκήσεις υπολογισμού αξόνων συμμετρίας γεωμετρικών σχημάτων, συμμετρικών σημείων και γραμμάτων.
            </p>
          </div>

          <Link
            href="/e-dimotikou/19-aksonas-simmetrias-ask"
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

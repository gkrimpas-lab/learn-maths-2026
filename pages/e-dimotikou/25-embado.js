// pages/e-dimotikou/25-embado.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function EmbadoTheoryPage() {
  // Αριθμός γεμισμένων τετραγώνων (0 έως 24)
  const [squaresFilled, setSquaresFilled] = useState(0);

  // Διαστάσεις ορθογωνίου σε cm
  const widthCm = 6;
  const heightCm = 4;
  const totalEmbado = widthCm * heightCm; // 24 cm²

  // Διαστάσεις SVG
  const squareSize = 35;
  const startX = 115;
  const startY = 60;

  // Δημιουργία των 24 τετραγώνων πλέγματος
  const gridSquares = [];
  let currentIdx = 0;
  for (let r = 0; r < heightCm; r++) {
    for (let c = 0; c < widthCm; c++) {
      gridSquares.push({
        index: currentIdx,
        row: r,
        col: c,
        x: startX + c * squareSize,
        y: startY + r * squareSize,
        isFilled: currentIdx < squaresFilled
      });
      currentIdx++;
    }
  }

  return (
    <Layout
      title="Η Έννοια του Εμβαδού - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε τι είναι το εμβαδόν, πώς μετράμε την εσωτερική επιφάνεια με τετραγωνικά εκατοστά (cm²), τον τύπο Μήκος επί Πλάτος και δοκιμάστε το διαδραστικό εργαστήριο γεμίσματος."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/25-embado-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 25 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Η Έννοια του Εμβαδού
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τι είναι η εσωτερική επιφάνεια ενός σχήματος, πώς τη μετράμε καλύπτοντάς την με μοναδιαία τετράγωνα (cm²), γιατί πολλαπλασιάζουμε το μήκος με το πλάτος και σε τι διαφέρει το εμβαδόν από την περίμετρο.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Ζωντανό Εργαστήριο Πλακόστρωσης Επιφάνειας</span>
            </div>
            <Link
              href="/e-dimotikou/25-embado-ask"
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
              Η μετάβαση από το μήκος της περιμέτρου στην καλυπτόμενη επιφάνεια.
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
                  Τι είναι το Εμβαδόν;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Εμβαδόν (Ε)</strong> ονομάζουμε το μέγεθος της επίπεδης επιφάνειας που περικλείεται μέσα στα όρια ενός κλειστού σχήματος:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>• Η περίμετρος είναι το <strong>«γύρω-γύρω»</strong> (το μήκος του φράχτη).</div>
                  <div>• Το εμβαδόν είναι το <strong>«μέσα»</strong> (το γρασίδι που στρώνουμε στο χωράφι).</div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Το εμβαδόν εκφράζει πόσες φορές χωράει μια επιλεγμένη μονάδα μέτρησης πάνω στην επιφάνεια.
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Μονάδα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Τετραγωνικό Εκατοστό
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για να μετρήσουμε επιφάνειες, χρησιμοποιούμε μικρά τετράγωνα:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-emerald-950 shadow-inner">
                    1 cm² ＝ Τετράγωνο με πλευρά 1 cm
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    Αν μια επιφάνεια χωράει ακριβώς 24 τέτοια τετραγωνάκια, λέμε ότι το εμβαδόν της είναι <strong>24 cm²</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚡ Για μεγαλύτερες επιφάνειες (π.χ. ένα δωμάτιο) χρησιμοποιούμε το <strong>τετραγωνικό μέτρο (m²)</strong>.
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Υπολογισμός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ο Μαθηματικός Τύπος
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Δεν χρειάζεται να μετράμε ένα-ένα τα κουτάκια! Παρατηρούμε τις σειρές και τις στήλες:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-amber-950 shadow-inner">
                    Εμβαδόν Ορθογωνίου ＝ Μήκος · Πλάτος
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    π.χ. Αν έχουμε 4 σειρές και κάθε σειρά έχει 6 τετραγωνάκια: 6 · 4 ＝ <strong>24 cm²</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 Στο τετράγωνο με πλευρά α: <strong>Ε ＝ α · α</strong>.
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Σύγκριση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Περίμετρος vs Εμβαδόν
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Είναι εντελώς διαφορετικά γεωμετρικά μεγέθη:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                    • <strong>Περίμετρος:</strong> 1 διάσταση (μήκος γραμμής) ➔ cm, m
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>Εμβαδόν:</strong> 2 διαστάσεις (επιφάνεια) ➔ cm², m²
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 Δύο σχήματα μπορεί να έχουν την ίδια περίμετρο αλλά διαφορετικό εμβαδόν!
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΕΜΒΑΔΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Προσομοιωτής Κάλυψης Επιφάνειας με Τετραγωνάκια (1 cm²)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε τον δρομέα για να δεις πώς ένα-ένα τα τετραγωνικά εκατοστά καλύπτουν το εσωτερικό του ορθογωνίου (6 cm × 4 cm).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Μετρήσεις */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΤΟΠΟΘΕΤΗΣΗ ΤΕΤΡΑΓΩΝΙΚΩΝ ΕΚΑΤΟΣΤΩΝ
              </h4>

              {/* Stepper Τετραγώνων */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Καλυμμένη Επιφάνεια:</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-2xl text-emerald-600 bg-white px-2.5 py-0.5 rounded-xl border border-emerald-200 shadow-sm">
                    {squaresFilled} / {totalEmbado}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση τετραγώνων κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSquaresFilled((prev) => Math.max(0, prev - 1));
                    }}
                    disabled={squaresFilled <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="0"
                    max={totalEmbado}
                    step="1"
                    value={squaresFilled}
                    onChange={(e) => setSquaresFilled(Number(e.target.value))}
                    aria-label="Αριθμός τετραγώνων εμβαδού"
                    className="w-full min-w-0 max-w-full accent-emerald-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση τετραγώνων κατά 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSquaresFilled((prev) => Math.min(totalEmbado, prev + 1));
                    }}
                    disabled={squaresFilled >= totalEmbado}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά κατάστασης */}
                <div className="flex justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setSquaresFilled(0)}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-xs active:scale-95"
                  >
                    🔄 Καθαρισμός (0 cm²)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSquaresFilled(totalEmbado)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-xs active:scale-95 ${
                      squaresFilled === totalEmbado
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    🎯 Γέμισμα Όλων (24 cm²)
                  </button>
                </div>
              </div>

              {/* Κάρτα Καταμέτρησης Εμβαδού */}
              <div
                className={`p-5 rounded-2xl border space-y-2 shadow-sm text-center transition duration-200 ${
                  squaresFilled === totalEmbado
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ
                </span>
                <div
                  className={`text-xl sm:text-2xl font-black font-mono ${
                    squaresFilled === totalEmbado ? 'text-emerald-700' : 'text-slate-800'
                  }`}
                >
                  {squaresFilled === totalEmbado
                    ? `Εμβαδόν ＝ 6 · 4 ＝ ${totalEmbado} cm²`
                    : `Έχεις τοποθετήσει: ${squaresFilled} cm²`}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {squaresFilled === totalEmbado
                    ? 'Ολόκληρη η επιφάνεια καλύφθηκε με 4 σειρές των 6 τετραγωνικών εκατοστών.'
                    : `Απομένουν ακόμη ${totalEmbado - squaresFilled} cm² για να καλυφθεί ολόκληρο το ορθογώνιο.`}
                </p>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικό Πλέγμα */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-between space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ (ΟΡΘΟΓΩΝΙΟ)</span>
                <span className="font-mono text-emerald-700 font-bold">
                  {squaresFilled === totalEmbado ? `Πλήρες: ${totalEmbado} cm²` : `Κάλυψη: ${squaresFilled} / ${totalEmbado}`}
                </span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[500px] aspect-[440/260] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 440 260"
                  className="w-full h-full drop-shadow-sm"
                  shapeRendering="geometricPrecision"
                >
                  {/* Ενδείξεις Μήκους και Πλάτους */}
                  <g className="text-xs font-black fill-slate-700 font-mono">
                    <text
                      x={startX + (widthCm * squareSize) / 2}
                      y={startY - 12}
                      textAnchor="middle"
                      className="fill-emerald-700 text-sm font-black"
                    >
                      Μήκος ＝ 6 cm
                    </text>
                    <text
                      x={startX - 18}
                      y={startY + (heightCm * squareSize) / 2 + 4}
                      textAnchor="end"
                      className="fill-blue-700 text-sm font-black"
                    >
                      Πλάτος ＝ 4 cm
                    </text>
                  </g>

                  {/* Σχεδίαση των 24 τετραγώνων */}
                  {gridSquares.map((sq) => (
                    <rect
                      key={sq.index}
                      x={sq.x}
                      y={sq.y}
                      width={squareSize}
                      height={squareSize}
                      className={`transition-all duration-150 stroke-slate-200 stroke-[1.5] ${
                        sq.isFilled
                          ? 'fill-emerald-500/30 stroke-emerald-500/60'
                          : 'fill-transparent'
                      }`}
                    />
                  ))}

                  {/* Υπόμνημα 1 cm² */}
                  <g transform="translate(330, 215)">
                    <rect
                      x="0"
                      y="0"
                      width="16"
                      height="16"
                      className="fill-emerald-500/30 stroke-emerald-600 stroke-[1.5]"
                    />
                    <text x="24" y="13" className="text-xs font-black fill-slate-500 font-mono">
                      ＝ 1 cm²
                    </text>
                  </g>

                  {/* Εξωτερικό παχύ περίγραμμα ορθογωνίου */}
                  <rect
                    x={startX}
                    y={startY}
                    width={widthCm * squareSize}
                    height={heightCm * squareSize}
                    className="fill-none stroke-slate-800 stroke-[3.5] stroke-linejoin-round"
                  />

                  {/* Δυναμική εσωτερική ετικέτα εμβαδού */}
                  {squaresFilled > 0 && (
                    <text
                      x={startX + (widthCm * squareSize) / 2}
                      y={startY + (heightCm * squareSize) / 2 + 6}
                      textAnchor="middle"
                      className="fill-emerald-900 font-mono font-black text-lg pointer-events-none tracking-wide drop-shadow-sm"
                    >
                      {squaresFilled} cm²
                    </text>
                  )}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                {squaresFilled === totalEmbado ? (
                  <span>
                    🟢 <strong>Πλήρης κάλυψη:</strong> Το ορθογώνιο περιέχει ακριβώς <strong className="text-emerald-700">24 τετραγωνάκια του 1 cm²</strong>.
                  </span>
                ) : (
                  <span>
                    🟩 Σύρε το ρυθμιστικό για να πλακοστρώσεις ολόκληρη την επιφάνεια.
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
              Ώρα για Εξάσκηση στο Εμβαδόν!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού εμβαδού με τετραγωνικά εκατοστά (cm²), τύπους ορθογωνίου και τετραγώνου, και σύγκριση με την περίμετρο.
            </p>
          </div>

          <Link
            href="/e-dimotikou/25-embado-ask"
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

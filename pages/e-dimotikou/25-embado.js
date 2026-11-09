// pages/e-dimotikou/25-embado.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Ε')/g);
  return parts
    .map((part) => {
      if (part === "Ε'") return "Ε'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

const dictionary = {
  el: {
    pageTitle: "Η Έννοια του Εμβαδού - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθετε τι είναι το εμβαδόν, πώς μετράμε την εσωτερική επιφάνεια με τετραγωνικά εκατοστά (cm²), τον τύπο Μήκος επί Πλάτος και δοκιμάστε το διαδραστικό εργαστήριο γεμίσματος.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    badge: "ΚΕΦΑΛΑΙΟ 25 • Ε' ΔΗΜΟΤΙΚΟΥ",
    mainTitle: "Η Έννοια του Εμβαδού",
    mainDesc: "Ανακαλύπτουμε τι είναι η εσωτερική επιφάνεια ενός σχήματος, πώς τη μετράμε καλύπτοντάς την με μοναδιαία τετράγωνα (cm²), γιατί πολλαπλασιάζουμε το μήκος με το πλάτος και σε τι διαφέρει το εμβαδόν από την περίμετρο.",
    statusTheory: "Θεωρία & Ζωντανό Εργαστήριο Πλακόστρωσης Επιφάνειας",
    tryExercisesBtn: "Δοκίμασε τις Ασκήσεις",
    stepsSectionTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsSectionSubtitle: "Η μετάβαση από το μήκος της περιμέτρου στην καλυπτόμενη επιφάνεια.",
    step1Tag: "ΒΗΜΑ 1",
    step1Category: "Ορισμός",
    step1Title: "Τι είναι το Εμβαδόν;",
    step1Desc: "Εμβαδόν (Ε) ονομάζουμε το μέγεθος της επίπεδης επιφάνειας που περικλείεται μέσα στα όρια ενός κλειστού σχήματος:",
    step1PerimeterAnalogy: "Η περίμετρος είναι το «γύρω-γύρω» (το μήκος του φράχτη).",
    step1AreaAnalogy: "Το εμβαδόν είναι το «μέσα» (το γρασίδι που στρώνουμε στο χωράφι).",
    step1Tip: "Το εμβαδόν εκφράζει πόσες φορές χωράει μια επιλεγμένη μονάδα μέτρησης πάνω στην επιφάνεια.",
    step2Tag: "ΒΗΜΑ 2",
    step2Category: "Μονάδα",
    step2Title: "Το Τετραγωνικό Εκατοστό",
    step2Desc: "Για να μετρήσουμε επιφάνειες, χρησιμοποιούμε μικρά τετράγωνα:",
    step2UnitFormula: "1 cm² ＝ Τετράγωνο με πλευρά 1 cm",
    step2UnitDesc: "Αν μια επιφάνεια χωράει ακριβώς 24 τέτοια τετραγωνάκια, λέμε ότι το εμβαδόν της είναι 24 cm².",
    step2Warning: "Για μεγαλύτερες επιφάνειες (π.χ. ένα δωμάτιο) χρησιμοποιούμε το τετραγωνικό μέτρο (m²).",
    step3Tag: "ΒΗΜΑ 3",
    step3Category: "Υπολογισμός",
    step3Title: "Ο Μαθηματικός Τύπος",
    step3Desc: "Δεν χρειάζεται να μετράμε ένα-ένα τα κουτάκια! Παρατηρούμε τις σειρές και τις στήλες:",
    step3Formula: "Εμβαδόν Ορθογωνίου ＝ Μήκος · Πλάτος",
    step3Example: "π.χ. Αν έχουμε 4 σειρές και κάθε σειρά έχει 6 τετραγωνάκια: 6 · 4 ＝ 24 cm².",
    step3ReverseIntro: "Αντίστροφα, γνωρίζοντας το Εμβαδόν (Ε) και το Πλάτος:",
    step3SquareTip: "Στο τετράγωνο με πλευρά α: Ε ＝ α · α.",
    step4Tag: "ΒΗΜΑ 4",
    step4Category: "Σύγκριση",
    step4Title: "Περίμετρος vs Εμβαδόν",
    step4Desc: "Είναι εντελώς διαφορετικά γεωμετρικά μεγέθη:",
    step4PerimeterDim: "Περίμετρος: 1 διάσταση (μήκος γραμμής) ➔ cm, m",
    step4AreaDim: "Εμβαδόν: 2 διαστάσεις (επιφάνεια) ➔ cm², m²",
    step4Tip: "Δύο σχήματα μπορεί να έχουν την ίδια περίμετρο αλλά διαφορετικό εμβαδόν!",
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Προσομοιωτής Κάλυψης Επιφάνειας με Τετραγωνάκια (1 cm²)",
    labDesc: "Σύρε τον δρομέα για να δεις πώς ένα-ένα τα τετραγωνικά εκατοστά καλύπτουν το εσωτερικό του ορθογωνίου (6 cm × 4 cm).",
    controlsHeader: "ΤΟΠΟΘΕΤΗΣΗ ΤΕΤΡΑΓΩΝΙΚΩΝ ΕΚΑΤΟΣΤΩΝ",
    coveredSurfaceLabel: "Καλυμμένη Επιφάνεια:",
    decreaseAria: "Μείωση τετραγώνων κατά 1",
    increaseAria: "Αύξηση τετραγώνων κατά 1",
    sliderAria: "Αριθμός τετραγώνων εμβαδού",
    clearBtn: "Καθαρισμός (0 cm²)",
    fillAllBtn: "Γέμισμα Όλων (24 cm²)",
    calcCardHeader: "ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ",
    calcFullText: "Εμβαδόν ＝ 6 · 4 ＝ 24 cm²",
    calcPlacedPrefix: "Έχεις τοποθετήσει:",
    calcFullDesc: "Ολόκληρη η επιφάνεια καλύφθηκε με 4 σειρές των 6 τετραγωνικών εκατοστών.",
    calcRemainingPart1: "Απομένουν ακόμη",
    calcRemainingPart2: "cm² για να καλυφθεί ολόκληρο το ορθογώνιο.",
    canvasHeader: "ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ (ΟΡΘΟΓΩΝΙΟ)",
    canvasComplete: "Πλήρες:",
    canvasCoverage: "Κάλυψη:",
    lengthLabel: "Μήκος ＝ 6 cm",
    widthLabel: "Πλάτος ＝ 4 cm",
    legendUnit: "＝ 1 cm²",
    fullCoverageCallout: "Πλήρης κάλυψη: Το ορθογώνιο περιέχει ακριβώς 24 τετραγωνάκια του 1 cm².",
    partialCoverageCallout: "Σύρε το ρυθμιστικό για να πλακοστρώσεις ολόκληρη την επιφάνεια.",
    bottomBannerTitle: "Ώρα για Εξάσκηση στο Εμβαδόν!",
    bottomBannerDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού εμβαδού με τετραγωνικά εκατοστά (cm²), τύπους ορθογωνίου και τετραγώνου, και σύγκριση με την περίμετρο.",
    startExercisesBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Concept of Area - Grade 5 | LearnMaths.gr",
    pageDesc: "Learn what area is, how we measure interior surface with square centimeters (cm²), the Length times Width formula, and try the interactive tiling lab.",
    backText: "Grade 5",
    exercisesBtn: "Exercises",
    badge: "CHAPTER 25 • GRADE 5",
    mainTitle: "The Concept of Area",
    mainDesc: "We discover what the interior surface of a shape is, how to measure it using unit square tiles (cm²), why we multiply length by width, and how area differs from perimeter.",
    statusTheory: "Theory & Live Surface Tiling Laboratory",
    tryExercisesBtn: "Try the Exercises",
    stepsSectionTitle: "Core Concepts in 4 Steps",
    stepsSectionSubtitle: "The transition from boundary perimeter length to enclosed surface area.",
    step1Tag: "STEP 1",
    step1Category: "Definition",
    step1Title: "What is Area?",
    step1Desc: "Area (A) is the measure of the flat two-dimensional region enclosed within the boundary of a closed figure:",
    step1PerimeterAnalogy: "Perimeter is the \"outer boundary\" (the length of the fence).",
    step1AreaAnalogy: "Area is the \"interior region\" (the grass lawn covering the yard).",
    step1Tip: "Area expresses how many times a selected unit tile fits completely across a flat surface.",
    step2Tag: "STEP 2",
    step2Category: "Unit",
    step2Title: "The Square Centimeter",
    step2Desc: "To measure surface area, we tile the figure with unit squares:",
    step2UnitFormula: "1 cm² ＝ Square with a side length of 1 cm",
    step2UnitDesc: "If a surface fits exactly 24 such unit squares, we say that its area is 24 cm².",
    step2Warning: "For larger surfaces (e.g. a room floor), we use the square meter (m²).",
    step3Tag: "STEP 3",
    step3Category: "Calculation",
    step3Title: "The Mathematical Formula",
    step3Desc: "No need to count unit squares one by one! Observe the rows and columns:",
    step3Formula: "Area of Rectangle ＝ Length · Width",
    step3Example: "e.g. With 4 rows of 6 square tiles each: 6 · 4 ＝ 24 cm².",
    step3ReverseIntro: "Conversely, given the Area (A) and the Width:",
    step3SquareTip: "For a square with side a: A ＝ a · a.",
    step4Tag: "STEP 4",
    step4Category: "Comparison",
    step4Title: "Perimeter vs Area",
    step4Desc: "These are two completely different geometric quantities:",
    step4PerimeterDim: "Perimeter: 1 dimension (boundary line length) ➔ cm, m",
    step4AreaDim: "Area: 2 dimensions (surface region) ➔ cm², m²",
    step4Tip: "Two figures can have the exact same perimeter yet enclose completely different areas!",
    labBadge: "INTERACTIVE LABORATORY",
    labTitle: "Surface Tiling Simulator with Unit Squares (1 cm²)",
    labDesc: "Drag the slider to see how square centimeters tile the interior of the rectangle (6 cm × 4 cm) step by step.",
    controlsHeader: "TILE PLACEMENT (SQUARE CENTIMETERS)",
    coveredSurfaceLabel: "Covered Area:",
    decreaseAria: "Decrease squares by 1",
    increaseAria: "Increase squares by 1",
    sliderAria: "Number of area squares",
    clearBtn: "Clear (0 cm²)",
    fillAllBtn: "Fill All (24 cm²)",
    calcCardHeader: "MATHEMATICAL COMPUTATION",
    calcFullText: "Area ＝ 6 · 4 ＝ 24 cm²",
    calcPlacedPrefix: "Tiles placed:",
    calcFullDesc: "The entire surface is covered with 4 rows of 6 square centimeters.",
    calcRemainingPart1: "Remaining:",
    calcRemainingPart2: "cm² to fully cover the rectangle.",
    canvasHeader: "GEOMETRIC VISUALIZATION (RECTANGLE)",
    canvasComplete: "Complete:",
    canvasCoverage: "Coverage:",
    lengthLabel: "Length ＝ 6 cm",
    widthLabel: "Width ＝ 4 cm",
    legendUnit: "＝ 1 cm²",
    fullCoverageCallout: "Full coverage: The rectangle contains exactly 24 unit squares of 1 cm².",
    partialCoverageCallout: "Drag the slider to tile the entire surface.",
    bottomBannerTitle: "Time to Practice Area!",
    bottomBannerDesc: "Test your skills with challenging exercises on area measurement in square centimeters (cm²), formulas for rectangles and squares, and comparing with perimeter.",
    startExercisesBtn: "Start Exercises"
  }
};

export default function EmbadoTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = dictionary[locale];
  const numLoc = locale === 'el' ? 'el-GR' : 'en-US';

  const [squaresFilled, setSquaresFilled] = useState(0);

  const widthCm = 6;
  const heightCm = 4;
  const totalEmbado = widthCm * heightCm; // 24 cm²

  const squareSize = 35;
  const startX = 115;
  const startY = 60;

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
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/25-embado-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.exercisesBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.mainTitle}
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.mainDesc}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.statusTheory}</span>
            </div>
            <Link
              href="/e-dimotikou/25-embado-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>{t.tryExercisesBtn}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.stepsSectionTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              {t.stepsSectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step1Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>• {t.step1PerimeterAnalogy}</div>
                  <div>• {t.step1AreaAnalogy}</div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 {t.step1Tip}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-emerald-950 shadow-inner">
                    {t.step2UnitFormula}
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    {t.step2UnitDesc}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚡ {t.step2Warning}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step3Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-amber-950 shadow-inner">
                    {t.step3Formula}
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    {t.step3Example}
                  </p>

                  {/* Κανονική μορφή κλάσματος για την αντίστροφη εύρεση διάστασης */}
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-center gap-1.5 text-xs font-mono font-bold text-slate-800">
                    <span>{t.step3ReverseIntro}</span>
                    <span className="inline-flex items-center gap-1 font-mono">
                      <span>{locale === 'el' ? 'Μήκος' : 'Length'} ＝</span>
                      <span className="inline-flex flex-col items-center justify-center align-middle text-[11px] leading-tight px-1 font-mono">
                        <span className="border-b border-slate-700 w-full text-center pb-0.5">{locale === 'el' ? 'Ε' : 'A'}</span>
                        <span className="pt-0.5">{locale === 'el' ? 'Πλάτος' : 'Width'}</span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 {t.step3SquareTip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step4Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Desc}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                    • {t.step4PerimeterDim}
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • {t.step4AreaDim}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΕΜΒΑΔΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {t.labBadge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.labDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Μετρήσεις */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                {toCleanUppercase(t.controlsHeader)}
              </h4>

              {/* Stepper Τετραγώνων */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.coveredSurfaceLabel}</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-2xl text-emerald-600 bg-white px-2.5 py-0.5 rounded-xl border border-emerald-200 shadow-sm">
                    {squaresFilled} / {totalEmbado}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.decreaseAria}
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
                    aria-label={t.sliderAria}
                    className="w-full min-w-0 max-w-full accent-emerald-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.increaseAria}
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
                    🔄 {t.clearBtn}
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
                    🎯 {t.fillAllBtn}
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
                  {t.calcCardHeader}
                </span>
                <div
                  className={`text-xl sm:text-2xl font-black font-mono ${
                    squaresFilled === totalEmbado ? 'text-emerald-700' : 'text-slate-800'
                  }`}
                >
                  {squaresFilled === totalEmbado
                    ? t.calcFullText
                    : `${t.calcPlacedPrefix} ${squaresFilled.toLocaleString(numLoc)} cm²`}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {squaresFilled === totalEmbado
                    ? t.calcFullDesc
                    : `${t.calcRemainingPart1} ${(totalEmbado - squaresFilled).toLocaleString(numLoc)} ${t.calcRemainingPart2}`}
                </p>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικό Πλέγμα */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-between space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{t.canvasHeader}</span>
                <span className="font-mono text-emerald-700 font-bold">
                  {squaresFilled === totalEmbado ? `${t.canvasComplete} ${totalEmbado} cm²` : `${t.canvasCoverage} ${squaresFilled} / ${totalEmbado}`}
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
                      {t.lengthLabel}
                    </text>
                    <text
                      x={startX - 18}
                      y={startY + (heightCm * squareSize) / 2 + 4}
                      textAnchor="end"
                      className="fill-blue-700 text-sm font-black"
                    >
                      {t.widthLabel}
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
                  <g transform="translate(320, 215)">
                    <rect
                      x="0"
                      y="0"
                      width="16"
                      height="16"
                      className="fill-emerald-500/30 stroke-emerald-600 stroke-[1.5]"
                    />
                    <text x="24" y="13" className="text-xs font-black fill-slate-500 font-mono">
                      {t.legendUnit}
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
                      {squaresFilled.toLocaleString(numLoc)} cm²
                    </text>
                  )}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                {squaresFilled === totalEmbado ? (
                  <span>
                    🟢 <strong>{t.fullCoverageCallout}</strong>
                  </span>
                ) : (
                  <span>
                    🟩 {t.partialCoverageCallout}
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
              {t.bottomBannerTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.bottomBannerDesc}
            </p>
          </div>

          <Link
            href="/e-dimotikou/25-embado-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {t.startExercisesBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
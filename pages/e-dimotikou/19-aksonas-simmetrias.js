// pages/e-dimotikou/19-aksonas-simmetrias.js
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

const translations = {
  el: {
    pageTitle: "Άξονας Συμμετρίας - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθετε τι είναι ο άξονας συμμετρίας, πώς διπλώνουμε ένα σχήμα, πόσους άξονες έχουν τα γεωμετρικά σχήματα και δοκιμάστε το διαδραστικό εργαστήριο διπλώματος.",
    backText: "Ε' Δημοτικού",
    exercisesBadge: "🎯 Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 19 • Ε' ΔΗΜΟΤΙΚΟΥ",
    mainTitle: "Ο Άξονας Συμμετρίας",
    mainDesc: "Εξερευνούμε την έννοια της αξονικής συμμετρίας, πώς μια ευθεία χωρίζει ένα σχήμα σε δύο ακριβώς ίσα μισά που ταυτίζονται με το δίπλωμα, πόσους άξονες συμμετρίας έχουν τα βασικά γεωμετρικά σχήματα και πού τη συναντάμε στη φύση.",
    bannerStatus: "Θεωρία & Ζωντανό Εργαστήριο Διπλώματος Σχήματος",
    tryExercises: "Δοκίμασε τις Ασκήσεις",
    stepsTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsDesc: "Η μαθηματική έννοια της συμμετρίας, οι ιδιότητες των συμμετρικών σημείων και τα σχήματα.",
    step1Tag: "ΒΗΜΑ 1",
    step1Badge: "Ορισμός",
    step1Title: "Τι είναι ο Άξονας Συμμετρίας;",
    step1Desc: "Άξονας συμμετρίας είναι μια νοητή ευθεία γραμμή που χωρίζει ένα γεωμετρικό σχήμα σε δύο μισά μέρη με τέτοιο τρόπο ώστε:",
    step1Pt1: "Αν διπλώσουμε το σχήμα κατά μήκος αυτής της γραμμής, τα δύο μέρη συμπίπτουν απόλυτα (εφαρμόζουν ακριβώς το ένα πάνω στο άλλο).",
    step1Pt2: "Το ένα μέρος αποτελεί την κατοπτρική αντανάκλαση (το «καθρέφτισμα») του άλλου.",
    step1Tip: "💡 Ένα σχήμα που έχει τουλάχιστον έναν άξονα συμμετρίας ονομάζεται συμμετρικό σχήμα.",
    step2Tag: "ΒΗΜΑ 2",
    step2Badge: "Ιδιότητα Σημείων",
    step2Title: "Συμμετρικά Σημεία",
    step2Desc: "Για κάθε σημείο Α του ενός μέρους, υπάρχει ένα αντίστοιχο συμμετρικό σημείο Α' στο άλλο μέρος, τέτοιο ώστε:",
    step2Pt1: "1. Το ευθύγραμμο τμήμα ΑΑ' είναι κάθετο στον άξονα συμμετρίας (ΑΑ' ⊥ άξονας).",
    step2Pt2: "2. Τα σημεία Α και Α' απέχουν ακριβώς την ίδια απόσταση από τον άξονα συμμετρίας.",
    step2Tip: "⚡ Ο άξονας συμμετρίας είναι στην πραγματικότητα η μεσοκάθετος του τμήματος που ενώνει τα συμμετρικά σημεία!",
    step3Tag: "ΒΗΜΑ 3",
    step3Badge: "Γεωμετρικά Σχήματα",
    step3Title: "Πλήθος Αξόνων ανά Σχήμα",
    step3Desc: "Κάθε γεωμετρικό σχήμα έχει διαφορετικό πλήθος αξόνων συμμετρίας:",
    squareLabel: "Τετράγωνο:",
    squareAxes: "4 άξονες",
    rectLabel: "Ορθογώνιο:",
    rectAxes: "2 άξονες",
    equiLabel: "Ισόπλευρο Τρίγωνο:",
    equiAxes: "3 άξονες",
    isoLabel: "Ισοσκελές Τρίγωνο:",
    isoAxes: "1 άξονας",
    circleLabel: "Κύκλος:",
    circleAxes: "Άπειροι άξονες",
    step3Tip: "🎯 Προσοχή: Το σκαληνό τρίγωνο και το πλάγιο παραλληλόγραμμο δεν έχουν κανέναν άξονα συμμετρίας (0)!",
    step4Tag: "ΒΗΜΑ 4",
    step4Badge: "Καθημερινή Ζωή",
    step4Title: "Συμμετρία γύρω μας",
    step4Desc: "Η αξονική συμμετρία κυριαρχεί στη φύση, την αρχιτεκτονική και τα σύμβολα:",
    step4Pt1Title: "Έμβια όντα:",
    step4Pt1Desc: "Το σώμα του ανθρώπου, τα φτερά της πεταλούδας και τα φύλλα των δέντρων παρουσιάζουν αξονική συμμετρία.",
    step4Pt2Title: "Γράμματα & Σχήματα:",
    step4Pt2Desc: "Τα κεφαλαία γράμματα Α, Μ, Δ έχουν κατακόρυφο άξονα, ενώ τα Β, Ε, Κ έχουν οριζόντιο!",
    step4Tip: "🔍 Ορισμένα γράμματα όπως το Η και το Χ έχουν 2 άξονες συμμετρίας (κατακόρυφο και οριζόντιο)!",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Προσομοίωση Διπλώματος κατά μήκος του Άξονα",
    labDesc: "Σύρε τον δρομέα προς τα δεξιά για να διπλώσεις το αριστερό μισό του σχήματος πάνω στον άξονα. Δες πώς στο 100% τα δύο μέρη συμπίπτουν απόλυτα!",
    labControlHeading: "ΠΡΟΟΔΟΣ ΔΙΠΛΩΜΑΤΟΣ",
    foldPctLabel: "Δίπλωμα (%):",
    decreaseAria: "Μείωση διπλώματος κατά 5%",
    increaseAria: "Αύξηση διπλώματος κατά 5%",
    rangeAria: "Ποσοστό διπλώματος σχήματος",
    btnOpen: "🔄 Άνοιγμα (0%)",
    btnFoldFull: "🎯 Τέλειο Δίπλωμα (100%)",
    cardCheckBadge: "ΕΛΕΓΧΟΣ ΣΥΜΜΕΤΡΙΑΣ",
    cardCheckMatch: "🏆 ΤΑ ΔΥΟ ΜΕΡΗ ΣΥΜΠΙΠΤΟΥΝ ΑΠΟΛΥΤΑ!",
    cardCheckPrompt: "👀 ΔΙΠΛΩΣΕ ΤΟ ΣΧΗΜΑ",
    cardDescMatch: "Η κόκκινη διακεκομμένη γραμμή είναι ένας απολύτως έγκυρος Άξονας Συμμετρίας!",
    cardDescPrompt: "Καθώς σύρεις το ρυθμιστικό, το αριστερό μισό αναδιπλώνεται προς το δεξί.",
    canvasHeading: "ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ",
    canvasMatchText: "Τέλεια Ταύτιση (100%)",
    canvasOpeningText: (open) => `Άνοιγμα: ${open}%`,
    axisSvgLabel: "ΑΞΟΝΑΣ ΣΥΜΜΕΤΡΙΑΣ",
    calloutFolded: "🟢 Πλήρης συμμετρία: Το σχήμα ταυτίζεται τέλεια με το δίπλωμα πάνω στον άξονα.",
    calloutUnfolded: "📖 Δίπλωσε το σχήμα μέχρι το 100% για να ελέγξεις αν συμπίπτουν οι πλευρές του.",
    ctaTitle: "Ώρα για Εξάσκηση στον Άξονα Συμμετρίας!",
    ctaDesc: "Δοκίμασε τις γνώσεις σου σε απαιτητικές ασκήσεις υπολογισμού αξόνων συμμετρίας γεωμετρικών σχημάτων, συμμετρικών σημείων και γραμμάτων.",
    startExercisesBtn: "🎯 Έναρξη Ασκήσεων",
    footerTopic: "Ο Άξονας Συμμετρίας",
    footerNavBtn: "Μετάβαση στις Ασκήσεις",
  },
  en: {
    pageTitle: "Axis of Symmetry - 5th Grade | LearnMaths.gr",
    pageDesc: "Learn what an axis of symmetry is, how folding tests symmetry, how many lines of symmetry shapes have, and try the interactive folding lab.",
    backText: "5th Grade",
    exercisesBadge: "🎯 Exercises",
    chapterBadge: "CHAPTER 19 • 5TH GRADE",
    mainTitle: "The Axis of Symmetry",
    mainDesc: "Explore axial symmetry: how a straight line divides a shape into two identical halves that coincide when folded, how many lines of symmetry common geometric shapes have, and where we find it in nature.",
    bannerStatus: "Theory & Live Shape Folding Laboratory",
    tryExercises: "Try Exercises",
    stepsTitle: "Core Concepts in 4 Steps",
    stepsDesc: "The mathematical concept of symmetry, properties of symmetric points, and geometric figures.",
    step1Tag: "STEP 1",
    step1Badge: "Definition",
    step1Title: "What is an Axis of Symmetry?",
    step1Desc: "An axis of symmetry is an imaginary straight line that divides a geometric shape into two halves such that:",
    step1Pt1: "When folded along this line, the two halves coincide perfectly (match up point-for-point).",
    step1Pt2: "One half is the mirror reflection of the other.",
    step1Tip: "💡 Any shape possessing at least one axis of symmetry is called a symmetric shape.",
    step2Tag: "STEP 2",
    step2Badge: "Point Property",
    step2Title: "Symmetric Points",
    step2Desc: "For every point A on one side, there exists a corresponding symmetric point A' on the other side such that:",
    step2Pt1: "1. The line segment AA' is perpendicular to the axis of symmetry (AA' ⊥ axis).",
    step2Pt2: "2. Points A and A' are at the exact same distance from the axis of symmetry.",
    step2Tip: "⚡ The axis of symmetry is actually the perpendicular bisector of the segment connecting symmetric points!",
    step3Tag: "STEP 3",
    step3Badge: "Geometric Shapes",
    step3Title: "Lines of Symmetry per Shape",
    step3Desc: "Each geometric shape has a distinct number of symmetry lines:",
    squareLabel: "Square:",
    squareAxes: "4 axes",
    rectLabel: "Rectangle:",
    rectAxes: "2 axes",
    equiLabel: "Equilateral Triangle:",
    equiAxes: "3 axes",
    isoLabel: "Isosceles Triangle:",
    isoAxes: "1 axis",
    circleLabel: "Circle:",
    circleAxes: "Infinite axes",
    step3Tip: "🎯 Notice: Scalene triangles and general parallelograms have no line of symmetry (0)!",
    step4Tag: "STEP 4",
    step4Badge: "Daily Life",
    step4Title: "Symmetry Around Us",
    step4Desc: "Axial symmetry is prominent throughout nature, architecture, and symbols:",
    step4Pt1Title: "Living organisms:",
    step4Pt1Desc: "The human body, butterfly wings, and tree leaves exhibit bilateral axial symmetry.",
    step4Pt2Title: "Letters & Symbols:",
    step4Pt2Desc: "Uppercase letters A, M, W have a vertical axis, whereas B, E, K have a horizontal one!",
    step4Tip: "🔍 Letters like H and X feature 2 axes of symmetry (both vertical and horizontal)!",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Folding Simulation Along the Axis",
    labDesc: "Drag the slider to fold the left half of the shape across the axis. Watch how both halves coincide perfectly at 100%!",
    labControlHeading: "FOLDING PROGRESS",
    foldPctLabel: "Folding (%):",
    decreaseAria: "Decrease folding by 5%",
    increaseAria: "Increase folding by 5%",
    rangeAria: "Shape folding percentage",
    btnOpen: "🔄 Unfold (0%)",
    btnFoldFull: "🎯 Full Fold (100%)",
    cardCheckBadge: "SYMMETRY CHECK",
    cardCheckMatch: "🏆 BOTH HALVES COINCIDE PERFECTLY!",
    cardCheckPrompt: "👀 FOLD THE SHAPE",
    cardDescMatch: "The red dashed line is a fully verified Axis of Symmetry!",
    cardDescPrompt: "As you drag the slider, the left half folds over toward the right half.",
    canvasHeading: "GEOMETRIC VISUALIZATION",
    canvasMatchText: "Perfect Match (100%)",
    canvasOpeningText: (open) => `Opening: ${open}%`,
    axisSvgLabel: "AXIS OF SYMMETRY",
    calloutFolded: "🟢 Full symmetry: The shape matches perfectly when folded along the axis.",
    calloutUnfolded: "📖 Fold the shape to 100% to check whether its sides coincide.",
    ctaTitle: "Time to Practice the Axis of Symmetry!",
    ctaDesc: "Test your skills with challenging exercises calculating symmetry axes for geometric shapes, symmetric points, and letters.",
    startExercisesBtn: "🎯 Start Exercises",
    footerTopic: "The Axis of Symmetry",
    footerNavBtn: "Go to Exercises",
  },
};

export default function AksonasSimmetriasTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  // Ποσοστό διπλώματος του σχήματος (από 0% έως 100%)
  const [foldProgress, setFoldProgress] = useState(0);

  // Ο άξονας συμμετρίας βρίσκεται στο 280 (viewBox 560x300)
  const scaleX = 1 - (foldProgress / 100) * 2;
  const isFolded = foldProgress === 100;

  const numLocale = locale === 'en' ? 'en-US' : 'el-GR';
  const foldFormatted = foldProgress.toLocaleString(numLocale);
  const openFormatted = (100 - foldProgress).toLocaleString(numLocale);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/19-aksonas-simmetrias-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.exercisesBadge}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.chapterBadge)}</span>
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
              <span>{t.bannerStatus}</span>
            </div>
            <Link
              href="/e-dimotikou/19-aksonas-simmetrias-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>{t.tryExercises}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.stepsTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              {t.stepsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step1Tag)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Badge}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>• {t.step1Pt1}</div>
                  <div>• {t.step1Pt2}</div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.step1Tip}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step2Tag)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Badge}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>• {t.step2Pt1}</div>
                  <div>• {t.step2Pt2}</div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step2Tip}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Tag)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Badge}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Desc}
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">{t.squareLabel}</span>
                    <strong className="text-blue-700 font-mono">{t.squareAxes}</strong>
                  </div>
                  <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">{t.rectLabel}</span>
                    <strong className="text-emerald-700 font-mono">{t.rectAxes}</strong>
                  </div>
                  <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">{t.equiLabel}</span>
                    <strong className="text-amber-700 font-mono">{t.equiAxes}</strong>
                  </div>
                  <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">{t.isoLabel}</span>
                    <strong className="text-purple-700 font-mono">{t.isoAxes}</strong>
                  </div>
                  <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-800">{t.circleLabel}</span>
                    <strong className="text-rose-700 font-mono">{t.circleAxes}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Tag)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Badge}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Desc}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>{t.step4Pt1Title}</strong> {t.step4Pt1Desc}
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    • <strong>{t.step4Pt2Title}</strong> {t.step4Pt2Desc}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΔΙΠΛΩΜΑΤΟΣ ΣΧΗΜΑΤΟΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>{t.labBadge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.labDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Κατάσταση Διπλώματος */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                {toCleanUppercase(t.labControlHeading)}
              </h4>

              {/* Stepper Ποσοστού Διπλώματος */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.foldPctLabel}</span>
                  <span
                    className={`min-w-[80px] text-center font-mono font-black text-2xl bg-white px-2.5 py-0.5 rounded-xl border shadow-sm transition ${
                      isFolded
                        ? 'text-emerald-600 border-emerald-300 ring-2 ring-emerald-100'
                        : 'text-blue-600 border-blue-200'
                    }`}
                  >
                    {foldFormatted}%
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.decreaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFoldProgress((prev) => Math.max(0, prev - 5));
                    }}
                    disabled={foldProgress <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base cursor-pointer"
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
                    aria-label={t.rangeAria}
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.increaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFoldProgress((prev) => Math.min(100, prev + 5));
                    }}
                    disabled={foldProgress >= 100}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base cursor-pointer"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά κατάστασης */}
                <div className="flex justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setFoldProgress(0)}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-xs active:scale-95 cursor-pointer"
                  >
                    {t.btnOpen}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFoldProgress(100)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-xs active:scale-95 cursor-pointer ${
                      isFolded
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {t.btnFoldFull}
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
                  {toCleanUppercase(t.cardCheckBadge)}
                </span>
                <div
                  className={`text-xl sm:text-2xl font-black ${
                    isFolded ? 'text-emerald-700 animate-pulse' : 'text-slate-800'
                  }`}
                >
                  {isFolded ? t.cardCheckMatch : t.cardCheckPrompt}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {isFolded ? t.cardDescMatch : t.cardDescPrompt}
                </p>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικός Καμβάς Folding */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.canvasHeading)}</span>
                <span className="font-mono text-blue-600 font-bold">
                  {isFolded ? t.canvasMatchText : t.canvasOpeningText(openFormatted)}
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
                    x="200"
                    y="12"
                    width="160"
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
                    {t.axisSvgLabel}
                  </text>
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                {isFolded ? (
                  <span>{t.calloutFolded}</span>
                ) : (
                  <span>{t.calloutUnfolded}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.ctaTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaDesc}
            </p>
          </div>

          <Link
            href="/e-dimotikou/19-aksonas-simmetrias-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>{t.startExercisesBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>

      {/* 5. ΣΤΑΘΕΡΟ BOTTOM FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs sm:text-sm border border-emerald-500/30">
              {locale === 'el' ? "Ε' ΔΗΜΟΤΙΚΟΥ" : "GRADE 5"}
            </span>
            <span className="font-semibold text-xs sm:text-sm truncate text-slate-300">
              {t.footerTopic}
            </span>
          </div>

          <Link
            href="/e-dimotikou/19-aksonas-simmetrias-ask"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm transition active:scale-95 shrink-0 shadow cursor-pointer"
          >
            <span>{t.footerNavBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </footer>
    </Layout>
  );
}
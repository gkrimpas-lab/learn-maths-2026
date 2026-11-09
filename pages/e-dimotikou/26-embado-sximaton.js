// pages/e-dimotikou/26-embado-sximaton.js
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

function Fraction({ numerator, denominator, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-mono leading-none ${className}`}>
      <span className="px-1 text-[0.9em] border-b-2 border-current pb-0.5 w-full block">
        {numerator}
      </span>
      <span className="px-1 text-[0.9em] pt-0.5 w-full block">
        {denominator}
      </span>
    </span>
  );
}

const translations = {
  el: {
    pageTitle: "Εμβαδόν Σχημάτων - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθετε πώς υπολογίζουμε το εμβαδόν τετραγώνου, ορθογωνίου και ορθογώνιου τριγώνου, δείτε γιατί το τρίγωνο είναι το μισό του ορθογωνίου και πειραματιστείτε με τον διαδραστικό καμβά.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 26 • Ε' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Εμβαδόν Βασικών Σχημάτων",
    heroSubtitle: "Συγκρίνουμε το εμβαδόν του τετραγώνου, του ορθογωνίου και του ορθογώνιου τριγώνου. Ανακαλύπτουμε οπτικά γιατί το τρίγωνο είναι ακριβώς το μισό του αντίστοιχου ορθογωνίου και μαθαίνουμε τους τύπους υπολογισμού.",
    theoryLiveStatus: "Θεωρία & Δυναμικό Πλέγμα Σχημάτων",
    tryExercises: "Δοκίμασε τις Ασκήσεις",
    keyConceptsTitle: "Βασικές Έννοιες σε 4 Βήματα",
    keyConceptsSubtitle: "Οι μαθηματικοί τύποι υπολογισμού επιφάνειας και η σύνδεση μεταξύ των σχημάτων.",
    step1Badge: "ΒΗΜΑ 1",
    step1Category: "Τετράγωνο",
    step1Title: "Εμβαδόν Τετραγώνου",
    step1Desc: "Στο τετράγωνο όλες οι πλευρές είναι ίσες (α). Πολλαπλασιάζουμε την πλευρά με τον εαυτό της:",
    step1FormulaText: "Εμβαδόν ＝ Πλευρά · Πλευρά",
    step1FormulaSym: "( Ε ＝ α · α )",
    step1Example: "π.χ. Για πλευρά α ＝ 5 cm: Ε ＝ 5 · 5 ＝ ",
    step1Tip: "💡 Το τετράγωνο είναι ένα ειδικό ορθογώνιο όπου το μήκος ισούται με το πλάτος!",
    step2Badge: "ΒΗΜΑ 2",
    step2Category: "Ορθογώνιο",
    step2Title: "Εμβαδόν Ορθογωνίου",
    step2Desc: "Το ορθογώνιο έχει μήκος (α) και πλάτος (β). Πολλαπλασιάζουμε τις δύο διαστάσεις:",
    step2FormulaText: "Εμβαδόν ＝ Μήκος · Πλάτος",
    step2FormulaSym: "( Ε ＝ α · β )",
    step2Example: "π.χ. Για μήκος 7 cm και πλάτος 4 cm: Ε ＝ 7 · 4 ＝ ",
    step2Tip: "⚡ Αν γνωρίζουμε το εμβαδόν και το μήκος, βρίσκουμε το πλάτος με διαίρεση:",
    step3Badge: "ΒΗΜΑ 3",
    step3Category: "Ορθογώνιο Τρίγωνο",
    step3Title: "Το Τρίγωνο είναι το Μισό!",
    step3Desc: "Αν φέρουμε τη διαγώνιο σε ένα ορθογώνιο, το χωρίζουμε σε δύο ίσα ορθογώνια τρίγωνα:",
    step3FormulaPrefix: "Εμβαδόν Τριγώνου ＝",
    step3FormulaNum: "Βάση · Ύψος",
    step3FormulaDen: "2",
    step3FormulaSymPrefix: "( Ε ＝",
    step3FormulaSymNum: "α · β",
    step3FormulaSymDen: "2",
    step3FormulaSymSuffix: ")",
    step3Explanation: "Γι' αυτό ακριβώς τον λόγο στον τύπο του τριγώνου διαιρούμε πάντοτε με το 2!",
    step3Tip: "🎯 Στο ορθογώνιο τρίγωνο, οι δύο κάθετες πλευρές παίζουν τον ρόλο της βάσης και του ύψους.",
    step4Badge: "ΒΗΜΑ 4",
    step4Category: "Σύνθετα Σχήματα",
    step4Title: "Μέθοδος Τεμαχισμού",
    step4Desc: "Όταν έχουμε ένα σύνθετο πολύγωνο (π.χ. σχήμα L, σπιτάκι):",
    step4Item1: "1. Το χωρίζουμε σε απλά σχήματα (ορθογώνια, τετράγωνα, τρίγωνα).",
    step4Item2: "2. Βρίσκουμε το εμβαδόν κάθε επιμέρους σχήματος.",
    step4Item3: "3. Προσθέτουμε τα επιμέρους εμβαδά για το συνολικό αποτέλεσμα.",
    step4Tip: "🔍 Πάντα ελέγχουμε οι μονάδες μέτρησης (cm² ή m²) να είναι ίδιες!",
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Δυναμικός Καμβάς & Πλέγμα Σχημάτων",
    labDesc: "Επίλεξε γεωμετρικό σχήμα και άλλαξε τις διαστάσεις του. Παρατήρησε πώς το εμβαδόν ξεκινάει από την κόκκινη τελεία και κουμπώνει τέλεια πάνω στα τετραγωνάκια του πλέγματος.",
    selectShapeTitle: "1. ΕΠΙΛΟΓΗ ΓΕΩΜΕΤΡΙΚΟΥ ΣΧΗΜΑΤΟΣ",
    shapeSquare: "🟩 Τετράγωνο",
    shapeRectangle: "🟧 Ορθογώνιο",
    shapeTriangle: "📐 Ορθ. Τρίγωνο",
    dimensionsTitle: "2. ΔΙΑΣΤΑΣΕΙΣ ( ΣΕ cm )",
    sideLabel: "Πλευρά ( α ):",
    lengthLabel: "Μήκος / Βάση ( α ):",
    widthLabel: "Πλάτος / Ύψος ( β ):",
    decreaseWidthAria: "Μείωση μήκους κατά 1 cm",
    increaseWidthAria: "Αύξηση μήκους κατά 1 cm",
    decreaseHeightAria: "Μείωση πλάτους κατά 1 cm",
    increaseHeightAria: "Αύξηση πλάτους κατά 1 cm",
    sliderLengthAria: "Μήκος σχήματος",
    sliderHeightAria: "Πλάτος σχήματος",
    areaSquareBadge: "ΕΜΒΑΔΟΝ ΤΕΤΡΑΓΩΝΟΥ",
    areaRectangleBadge: "ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ",
    areaTriangleBadge: "ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ",
    areaSquareExplain: "Πολλαπλασιάζουμε την πλευρά επί τον εαυτό της: Ε ＝ α · α.",
    areaRectangleExplain: "Πολλαπλασιάζουμε το μήκος με το πλάτος: Ε ＝ α · β.",
    areaTriangleExplain: "Το τρίγωνο είναι ακριβώς το μισό του ορθογωνίου: Ε ＝ ( α · β ) : 2.",
    visualGridTitle: "ΟΠΤΙΚΟ ΠΛΕΓΜΑ",
    gridUnitText: "1 κουτάκι ＝ 1 cm²",
    originDotAria: "Αφετηρία μέτρησης τετραγώνων (1ο κουτάκι)",
    gridCallout: "🔴 Η κόκκινη τελεία δείχνει το πρώτο κουτάκι (1 cm²) από όπου ξεκινά η καταμέτρηση των τετραγώνων!",
    ctaTitle: "Ώρα για Εξάσκηση στο Εμβαδόν Σχημάτων!",
    ctaSubtitle: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού εμβαδού τετραγώνου, ορθογωνίου, τριγώνων και σύνθετων πολυγώνων.",
    ctaButton: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Area of Plane Figures - 5th Grade | LearnMaths.gr",
    pageDescription: "Learn how to calculate the area of squares, rectangles, and right triangles, understand visually why a triangle is half a rectangle, and experiment on the interactive grid canvas.",
    backText: "5th Grade",
    exercisesBtn: "Exercises",
    chapterBadge: "CHAPTER 26 • 5TH GRADE",
    heroTitle: "Area of Basic Geometric Shapes",
    heroSubtitle: "Compare the area of a square, rectangle, and right triangle. Visually discover why a right triangle is exactly half of the rectangle and master the core formulas.",
    theoryLiveStatus: "Theory & Dynamic Geometric Grid",
    tryExercises: "Try the Exercises",
    keyConceptsTitle: "Core Concepts in 4 Steps",
    keyConceptsSubtitle: "Formulas for surface area and the geometric relationships between shapes.",
    step1Badge: "STEP 1",
    step1Category: "Square",
    step1Title: "Area of a Square",
    step1Desc: "In a square, all sides are equal (a). We multiply the side length by itself:",
    step1FormulaText: "Area ＝ Side · Side",
    step1FormulaSym: "( A ＝ a · a )",
    step1Example: "e.g. For side a ＝ 5 cm: A ＝ 5 · 5 ＝ ",
    step1Tip: "💡 A square is a special rectangle where length and width are equal!",
    step2Badge: "STEP 2",
    step2Category: "Rectangle",
    step2Title: "Area of a Rectangle",
    step2Desc: "A rectangle has length (a) and width (b). We multiply both dimensions:",
    step2FormulaText: "Area ＝ Length · Width",
    step2FormulaSym: "( A ＝ a · b )",
    step2Example: "e.g. For length 7 cm and width 4 cm: A ＝ 7 · 4 ＝ ",
    step2Tip: "⚡ If the area and length are known, find the width using division:",
    step3Badge: "STEP 3",
    step3Category: "Right Triangle",
    step3Title: "The Triangle is Half!",
    step3Desc: "Drawing a diagonal across a rectangle divides it into two congruent right triangles:",
    step3FormulaPrefix: "Triangle Area ＝",
    step3FormulaNum: "Base · Height",
    step3FormulaDen: "2",
    step3FormulaSymPrefix: "( A ＝",
    step3FormulaSymNum: "a · b",
    step3FormulaSymDen: "2",
    step3FormulaSymSuffix: ")",
    step3Explanation: "That is precisely why we always divide by 2 in the triangle area formula!",
    step3Tip: "🎯 In a right triangle, the two perpendicular legs serve directly as the base and height.",
    step4Badge: "STEP 4",
    step4Category: "Composite Shapes",
    step4Title: "Decomposition Method",
    step4Desc: "When calculating the area of a composite polygon (e.g., L-shape, house polygon):",
    step4Item1: "1. Decompose the shape into simpler figures (rectangles, squares, triangles).",
    step4Item2: "2. Calculate the area of each individual component figure.",
    step4Item3: "3. Add all individual areas together to obtain the total area.",
    step4Tip: "🔍 Always verify that all measurement units (cm² or m²) are uniform!",
    labBadge: "INTERACTIVE LAB",
    labTitle: "Dynamic Canvas & Grid Exploration",
    labDesc: "Select a geometric shape and adjust its dimensions. Observe how the shape expands from the red anchor point and aligns onto the grid units.",
    selectShapeTitle: "1. SELECT GEOMETRIC SHAPE",
    shapeSquare: "🟩 Square",
    shapeRectangle: "🟧 Rectangle",
    shapeTriangle: "📐 Right Triangle",
    dimensionsTitle: "2. DIMENSIONS ( IN cm )",
    sideLabel: "Side ( a ):",
    lengthLabel: "Length / Base ( a ):",
    widthLabel: "Width / Height ( b ):",
    decreaseWidthAria: "Decrease length by 1 cm",
    increaseWidthAria: "Increase length by 1 cm",
    decreaseHeightAria: "Decrease width by 1 cm",
    increaseHeightAria: "Increase width by 1 cm",
    sliderLengthAria: "Shape length",
    sliderHeightAria: "Shape width",
    areaSquareBadge: "AREA OF SQUARE",
    areaRectangleBadge: "AREA OF RECTANGLE",
    areaTriangleBadge: "AREA OF RIGHT TRIANGLE",
    areaSquareExplain: "Multiply the side by itself: A ＝ a · a.",
    areaRectangleExplain: "Multiply length by width: A ＝ a · b.",
    areaTriangleExplain: "A triangle is exactly half of the corresponding rectangle: A ＝ ( a · b ) : 2.",
    visualGridTitle: "VISUAL GRID",
    gridUnitText: "1 grid cell ＝ 1 cm²",
    originDotAria: "Origin point of square counting (1st cell)",
    gridCallout: "🔴 The red marker highlights the first grid square (1 cm²) where area counting begins!",
    ctaTitle: "Time to Practice Area of Shapes!",
    ctaSubtitle: "Test your skills on interactive problems involving squares, rectangles, triangles, and composite polygons.",
    ctaButton: "Start Exercises"
  }
};

export default function EmbadoSximatonTheoryPage() {
  const router = useRouter();
  const currentLocale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = currentLocale === 'en';
  const t = translations[currentLocale];

  const [shape, setShape] = useState('square');
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);

  const unitSize = 32;
  const maxUnits = 10;

  const w = parseInt(width, 10);
  const h = shape === 'square' ? w : parseInt(height, 10);

  // SVG viewBox συντεταγμένες: συνολικό μέγεθος = (maxUnits + 2) * unitSize = 384
  const canvasGridSize = (maxUnits + 2) * unitSize;

  const formatNumber = (num, minDec = 0, maxDec = 1) => {
    return num.toLocaleString(isEn ? 'en-US' : 'el-GR', {
      minimumFractionDigits: minDec,
      maximumFractionDigits: maxDec
    });
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/26-embado-sximaton-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.exercisesBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 2xl:space-y-14">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.chapterBadge)}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.heroSubtitle}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.theoryLiveStatus}</span>
            </div>
            <Link
              href="/e-dimotikou/26-embado-sximaton-ask"
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
              {t.keyConceptsTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              {t.keyConceptsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-w-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step1Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-indigo-950 shadow-inner break-words">
                    {t.step1FormulaText} &nbsp; {t.step1FormulaSym}
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    {t.step1Example}<strong>25 cm²</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium leading-relaxed">
                {t.step1Tip}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-w-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step2Badge)}
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
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-amber-950 shadow-inner break-words">
                    {t.step2FormulaText} &nbsp; {t.step2FormulaSym}
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    {t.step2Example}<strong>28 cm²</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium leading-relaxed">
                {t.step2Tip}{' '}
                <span className="whitespace-nowrap inline-flex items-center font-bold">
                  β ＝ <Fraction numerator="Ε" denominator="α" className="text-sm font-bold" />
                </span>
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-w-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Badge)}
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
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-sky-950 shadow-inner inline-flex items-center justify-center flex-wrap gap-1 leading-normal">
                    <span>{t.step3FormulaPrefix}</span>
                    <Fraction numerator={t.step3FormulaNum} denominator={t.step3FormulaDen} className="text-xs sm:text-sm font-bold" />
                    <span className="ml-1">{t.step3FormulaSymPrefix}</span>
                    <Fraction numerator={t.step3FormulaSymNum} denominator={t.step3FormulaSymDen} className="text-xs sm:text-sm font-bold" />
                    <span>{t.step3FormulaSymSuffix}</span>
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1 leading-relaxed">
                    {t.step3Explanation}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium leading-relaxed">
                {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-w-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Desc}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 leading-relaxed">
                    {t.step4Item1}
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                    {t.step4Item2}
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                    {t.step4Item3}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium leading-relaxed">
                {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΕΜΒΑΔΟΥ ΣΧΗΜΑΤΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8 min-w-0">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {toCleanUppercase(t.labBadge)}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5 leading-relaxed">
              {t.labDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-w-0">
            {/* Αριστερή Στήλη: Χειριστήρια & Υπολογισμοί */}
            <div className="lg:col-span-6 2xl:col-span-6 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200 flex flex-col justify-between min-w-0">
              <div className="space-y-6">
                {/* Επιλογή Σχήματος */}
                <div>
                  <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500 uppercase mb-3">
                    {toCleanUppercase(t.selectShapeTitle)}
                  </h4>
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShape('square')}
                      className={`p-2.5 sm:p-3 rounded-2xl font-bold text-xs sm:text-sm transition active:scale-95 shadow-xs text-center break-words ${
                        shape === 'square'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {t.shapeSquare}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShape('rectangle')}
                      className={`p-2.5 sm:p-3 rounded-2xl font-bold text-xs sm:text-sm transition active:scale-95 shadow-xs text-center break-words ${
                        shape === 'rectangle'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {t.shapeRectangle}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShape('triangle')}
                      className={`p-2.5 sm:p-3 rounded-2xl font-bold text-xs sm:text-sm transition active:scale-95 shadow-xs text-center break-words ${
                        shape === 'triangle'
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {t.shapeTriangle}
                    </button>
                  </div>
                </div>

                {/* Steppers Διαστάσεων */}
                <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase">
                    {toCleanUppercase(t.dimensionsTitle)}
                  </h4>

                  {/* Μήκος / Βάση / Πλευρά */}
                  <div className="space-y-1.5">
                    <div className="h-7 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
                      <span>{shape === 'square' ? t.sideLabel : t.lengthLabel}</span>
                      <span className="font-mono font-black text-base text-blue-600">{w} cm</span>
                    </div>

                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                      <button
                        type="button"
                        aria-label={t.decreaseWidthAria}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setWidth((prev) => Math.max(2, prev - 1));
                        }}
                        disabled={width <= 2}
                        className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                      >
                        －
                      </button>

                      <input
                        type="range"
                        min="2"
                        max={maxUnits}
                        step="1"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        aria-label={t.sliderLengthAria}
                        className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                      />

                      <button
                        type="button"
                        aria-label={t.increaseWidthAria}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setWidth((prev) => Math.min(maxUnits, prev + 1));
                        }}
                        disabled={width >= maxUnits}
                        className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  {/* Πλάτος / Ύψος (μόνο για ορθογώνιο και τρίγωνο) */}
                  {shape !== 'square' && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="h-7 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
                        <span>{t.widthLabel}</span>
                        <span className="font-mono font-black text-base text-blue-600">{h} cm</span>
                      </div>

                      <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                        <button
                          type="button"
                          aria-label={t.decreaseHeightAria}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setHeight((prev) => Math.max(2, prev - 1));
                          }}
                          disabled={height <= 2}
                          className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                        >
                          －
                        </button>

                        <input
                          type="range"
                          min="2"
                          max={maxUnits}
                          step="1"
                          value={height}
                          onChange={(e) => setHeight(Number(e.target.value))}
                          aria-label={t.sliderHeightAria}
                          className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                        />

                        <button
                          type="button"
                          aria-label={t.increaseHeightAria}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setHeight((prev) => Math.min(maxUnits, prev + 1));
                          }}
                          disabled={height >= maxUnits}
                          className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Κάρτα Υπολογισμού Εμβαδού */}
              <div className="bg-emerald-50 text-slate-900 p-4 sm:p-5 rounded-2xl border border-emerald-200 space-y-2.5 shadow-xs text-center">
                {shape === 'square' && (
                  <>
                    <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">
                      {toCleanUppercase(t.areaSquareBadge)}
                    </span>
                    <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700 break-words">
                      Ε ＝ {w} · {w} ＝ {formatNumber(w * w, 0, 0)} cm²
                    </div>
                    <p className="text-xs text-slate-600">
                      {t.areaSquareExplain}
                    </p>
                  </>
                )}

                {shape === 'rectangle' && (
                  <>
                    <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider block">
                      {toCleanUppercase(t.areaRectangleBadge)}
                    </span>
                    <div className="text-xl sm:text-2xl font-black font-mono text-amber-700 break-words">
                      Ε ＝ {w} · {h} ＝ {formatNumber(w * h, 0, 0)} cm²
                    </div>
                    <p className="text-xs text-slate-600">
                      {t.areaRectangleExplain}
                    </p>
                  </>
                )}

                {shape === 'triangle' && (
                  <>
                    <span className="text-[11px] font-black text-sky-800 uppercase tracking-wider block">
                      {toCleanUppercase(t.areaTriangleBadge)}
                    </span>
                    <div className="text-lg sm:text-2xl font-black font-mono text-sky-700 flex items-center justify-center gap-1.5 flex-wrap">
                      <span>Ε ＝</span>
                      <Fraction numerator={`${w} · ${h}`} denominator="2" className="text-base sm:text-lg font-black" />
                      <span>＝ {formatNumber((w * h) / 2, 0, 1)} cm²</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {t.areaTriangleExplain}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Δεξιά Στήλη: Οπτικοποίηση Πλέγματος (100% Responsive SVG Canvas - Zero Scroll) */}
            <div className="lg:col-span-6 2xl:col-span-6 bg-slate-50 p-5 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-between space-y-6 min-w-0">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.visualGridTitle)}</span>
                <span className="font-mono text-blue-600 font-bold">{t.gridUnitText}</span>
              </div>

              {/* Πλήρως Responsive SVG Πλέγμα - Προσαρμόζεται τέλεια σε viewports 320px+ χωρίς overflow */}
              <div className="w-full max-w-[384px] aspect-square bg-white rounded-2xl border-2 border-slate-300 shadow-inner flex items-center justify-center p-2">
                <svg
                  viewBox={`0 0 ${canvasGridSize} ${canvasGridSize}`}
                  className="w-full h-full select-none"
                  aria-label="Interactive geometric area grid"
                >
                  <defs>
                    {/* Pattern πλέγματος (1 κουτάκι = unitSize = 32px) */}
                    <pattern id="gridPattern" width={unitSize} height={unitSize} patternUnits="userSpaceOnUse">
                      <rect width={unitSize} height={unitSize} fill="none" stroke="#e2e8f0" strokeWidth="1.2" />
                    </pattern>
                  </defs>

                  {/* Υπόβαθρο πλέγματος */}
                  <rect width="100%" height="100%" fill="url(#gridPattern)" />

                  {/* Ghost ορθογώνιο περίγραμμα όταν είναι επιλεγμένο το τρίγωνο */}
                  {shape === 'triangle' && (
                    <rect
                      x={unitSize}
                      y={unitSize}
                      width={w * unitSize}
                      height={h * unitSize}
                      fill="rgba(148, 163, 184, 0.08)"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Σχεδίαση επιλεγμένου σχήματος */}
                  {shape === 'square' && (
                    <rect
                      x={unitSize}
                      y={unitSize}
                      width={w * unitSize}
                      height={w * unitSize}
                      fill="rgba(79, 70, 229, 0.22)"
                      stroke="rgb(79, 70, 229)"
                      strokeWidth="3"
                      className="transition-all duration-200"
                    />
                  )}

                  {shape === 'rectangle' && (
                    <rect
                      x={unitSize}
                      y={unitSize}
                      width={w * unitSize}
                      height={h * unitSize}
                      fill="rgba(249, 115, 22, 0.22)"
                      stroke="rgb(249, 115, 22)"
                      strokeWidth="3"
                      className="transition-all duration-200"
                    />
                  )}

                  {shape === 'triangle' && (
                    <polygon
                      points={`${unitSize},${unitSize + h * unitSize} ${unitSize + w * unitSize},${unitSize + h * unitSize} ${unitSize},${unitSize}`}
                      fill="rgba(14, 165, 233, 0.32)"
                      stroke="rgb(14, 165, 233)"
                      strokeWidth="3"
                      strokeLinejoin="round"
                      className="transition-all duration-200"
                    />
                  )}

                  {/* 🔴 Κόκκινη Τελεία Αφετηρίας Μέτρησης */}
                  <circle
                    cx={unitSize + 16}
                    cy={unitSize + 16}
                    r={5}
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  >
                    <title>{t.originDotAria}</title>
                  </circle>
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.gridCallout}
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left min-w-0">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight break-words [overflow-wrap:anywhere]">
              {t.ctaTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaSubtitle}
            </p>
          </div>

          <Link
            href="/e-dimotikou/26-embado-sximaton-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto whitespace-nowrap"
          >
            <span>🎯 {t.ctaButton}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
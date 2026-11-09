// pages/e-dimotikou/28-ennoia-ogkou.js
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
    pageTitle: "Η Έννοια του Όγκου - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθετε τι είναι ο όγκος, πώς μετράμε τον τρισδιάστατο χώρο με κυβικά εκατοστά (cm³), τον τύπο Μήκος επί Πλάτος επί Ύψος και δοκιμάστε το διαδραστικό 3D εργαστήριο.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 28 • Ε' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Η Έννοια του Όγκου",
    heroSubtitle: "Ανακαλύπτουμε την τρίτη διάσταση στη γεωμετρία. Μαθαίνουμε τι είναι ο όγκος ενός στερεού σώματος, πώς γεμίζουμε ένα κουτί με μοναδιαίους κύβους (cm³), γιατί πολλαπλασιάζουμε τις τρεις διαστάσεις και πώς συνδέεται ο όγκος με τη χωρητικότητα σε λίτρα.",
    theoryLiveStatus: "Θεωρία & Τρισδιάστατο Εργαστήριο Γεμίσματος Κύβων",
    tryExercises: "Δοκίμασε τις Ασκήσεις",
    keyConceptsTitle: "Βασικές Έννοιες σε 4 Βήματα",
    keyConceptsSubtitle: "Από την επίπεδη επιφάνεια (2 διαστάσεις) στον τρισδιάστατο χώρο και τον όγκο.",
    step1Badge: "ΒΗΜΑ 1",
    step1Category: "Ορισμός",
    step1Title: "Τι είναι ο Όγκος;",
    step1Desc: "Όγκος (V) ονομάζεται ο τρισδιάστατος χώρος που καταλαμβάνει ένα στερεό σώμα (π.χ. ένα κουτί, μια πέτρα, ένα κτήριο):",
    step1PerimeterLabel: "Περίμετρος:",
    step1PerimeterDesc: "1 διάσταση (μήκος γραμμής ➔ cm, m)",
    step1AreaLabel: "Εμβαδόν:",
    step1AreaDesc: "2 διαστάσεις (επιφάνεια ➔ cm², m²)",
    step1VolumeLabel: "Όγκος:",
    step1VolumeDesc: "3 διαστάσεις (χώρος ➔ cm³, m³)",
    step1Tip: "💡 Οτιδήποτε μπορούμε να κρατήσουμε στα χέρια μας ή να γεμίσουμε έχει όγκο!",
    step2Badge: "ΒΗΜΑ 2",
    step2Category: "Μονάδα",
    step2Title: "Το Κυβικό Εκατοστό (cm³)",
    step2Desc: "Για να μετρήσουμε τον όγκο, χρησιμοποιούμε μικρούς κύβους:",
    step2Formula: "1 cm³ ＝ Κύβος με ακμή 1 cm",
    step2Explanation: "Αν ένα κουτί χωράει ακριβώς 60 τέτοιους μικρούς κύβους, λέμε ότι ο όγκος του είναι ",
    step2Tip: "⚡ Γράφεται cm³ (με εκθέτη 3, επειδή πολλαπλασιάζουμε 3 διαστάσεις: μήκος, πλάτος και ύψος).",
    step3Badge: "ΒΗΜΑ 3",
    step3Category: "Υπολογισμός",
    step3Title: "Ο Μαθηματικός Τύπος",
    step3Desc: "Αντί να μετράμε έναν-έναν τους κύβους, υπολογίζουμε σε στρώσεις:",
    step3Formula: "Όγκος ＝ Μήκος · Πλάτος · Ύψος",
    step3FormulaSym: "( V ＝ α · β · γ )",
    step3Layer1: "• 1 στρώση (βάση): 5 · 4 ＝ 20 κύβοι",
    step3LayerAll: "• 3 στρώσεις σε ύψος: 20 · 3 ＝ ",
    step3Tip: "🎯 Στον κύβο όπου όλες οι ακμές είναι ίσες (α): V ＝ α · α · α.",
    step4Badge: "ΒΗΜΑ 4",
    step4Category: "Χωρητικότητα",
    step4Title: "Όγκος & Λίτρα ( l )",
    step4Desc: "Όταν ο όγκος αφορά υγρά (νερό, γάλα, λάδι), χρησιμοποιούμε τη χωρητικότητα:",
    step4Formula: "1 dm³ ＝ 1 Λίτρο ( l ) ＝ 1.000 cm³",
    step4Explanation: "Ένας κύβος με πλευρά 10 cm χωράει ακριβώς 1 λίτρο νερό (10 · 10 · 10 ＝ 1.000 cm³ ＝ 1 dm³)! Έτσι:",
    step4FractionPrefix: "1 dm³ ＝",
    step4FractionSuffix: "m³",
    step4Tip: "🔍 1 κυβικό μέτρο (m³) ισοδυναμεί με 1.000 dm³, δηλαδή ακριβώς 1.000 λίτρα νερό!",
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Προσομοίωση Γεμίσματος Κουτιού με Κύβους ( 5 × 4 × 3 )",
    labDesc: "Σύρε τον δρομέα για να γεμίσεις σταδιακά το κουτί με κυβάκια (1 cm³). Παρατήρησε πώς σχηματίζονται οι 3 στρώσεις των 20 κύβων μέχρι να φτάσουμε στους 60 κύβους.",
    cubesInBoxLabel: "Κυβάκια μέσα στο κουτί:",
    decreaseCubesAria: "Μείωση κατά 5 κύβους",
    increaseCubesAria: "Αύξηση κατά 5 κύβους",
    sliderCubesAria: "Αριθμός κύβων μέσα στο κουτί",
    emptyBtn: "🔄 Άδειασμα (0)",
    fillAllBtn: "🎯 Γέμισμα Όλων (",
    mathCalcTitle: "ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΟΓΚΟΥ",
    calcFormulaCompletePrefix: "Όγκος ＝",
    calcFormulaInProgressPrefix: "Έχεις τοποθετήσει:",
    calcFormulaInProgressSuffix: "κύβους",
    calcExplanation: "Αντί να μετράμε έναν-έναν τους κύβους, πολλαπλασιάζουμε τις 3 διαστάσεις:",
    layerBreakdownTitle: "💡 Πώς χτίζεται ο όγκος σε στρώσεις:",
    layerBreakdown1: "1η στρώση (πάτος κουτιού): 5 · 4 ＝ 20 κύβοι",
    layerBreakdown2: "2η στρώση: άλλοι 20 κύβοι (σύνολο 40 κύβοι)",
    layerBreakdown3: "3η στρώση (κορυφή): άλλοι 20 κύβοι (σύνολο 60 κύβοι)",
    visualTitle: "ΤΡΙΣΔΙΑΣΤΑΤΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΣΤΕΡΕΟΥ",
    boxDimensionsBadge: "5 × 4 × 3 κουτί",
    lengthLabel: "↔️ Μήκος:",
    widthLabel: "↗️ Πλάτος:",
    heightLabel: "⬆️ Ύψος:",
    ctaTitle: "Ώρα για Εξάσκηση στον Όγκο!",
    ctaSubtitle: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού όγκου ορθογωνίου παραλληλεπιπέδου, κύβου, χωρητικότητας σε λίτρα και προβλημάτων καθημερινής ζωής.",
    ctaButton: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Concept of Volume - 5th Grade | LearnMaths.gr",
    pageDescription: "Learn what volume is, how to measure 3D space with cubic centimeters (cm³), the formula Length times Width times Height, and explore the interactive 3D lab.",
    backText: "5th Grade",
    exercisesBtn: "Exercises",
    chapterBadge: "CHAPTER 28 • 5TH GRADE",
    heroTitle: "The Concept of Volume",
    heroSubtitle: "Discover the third dimension in geometry. Learn what the volume of a solid body represents, how to pack a box with unit cubes (cm³), why we multiply the three dimensions, and how volume relates to liquid capacity in liters.",
    theoryLiveStatus: "Theory & 3D Interactive Cube Packing Lab",
    tryExercises: "Try the Exercises",
    keyConceptsTitle: "Core Concepts in 4 Steps",
    keyConceptsSubtitle: "From 2D flat surfaces to 3D spatial solids and volume.",
    step1Badge: "STEP 1",
    step1Category: "Definition",
    step1Title: "What is Volume?",
    step1Desc: "Volume (V) is the amount of 3-dimensional space occupied by a solid object (e.g., a box, a stone, a building):",
    step1PerimeterLabel: "Perimeter:",
    step1PerimeterDesc: "1 dimension (linear boundary ➔ cm, m)",
    step1AreaLabel: "Area:",
    step1AreaDesc: "2 dimensions (flat surface ➔ cm², m²)",
    step1VolumeLabel: "Volume:",
    step1VolumeDesc: "3 dimensions (solid space ➔ cm³, m³)",
    step1Tip: "💡 Anything that can be held or filled with matter possesses volume!",
    step2Badge: "STEP 2",
    step2Category: "Unit",
    step2Title: "The Cubic Centimeter (cm³)",
    step2Desc: "To quantify volume, we count standard unit cubes:",
    step2Formula: "1 cm³ ＝ Cube with 1 cm edge",
    step2Explanation: "If a box holds exactly 60 such unit cubes, its volume is ",
    step2Tip: "⚡ Written as cm³ (with an exponent of 3, because we multiply 3 dimensions: length, width, and height).",
    step3Badge: "STEP 3",
    step3Category: "Calculation",
    step3Title: "The Mathematical Formula",
    step3Desc: "Instead of counting cubes one by one, we calculate in layers:",
    step3Formula: "Volume ＝ Length · Width · Height",
    step3FormulaSym: "( V ＝ a · b · c )",
    step3Layer1: "• 1 layer (base): 5 · 4 ＝ 20 cubes",
    step3LayerAll: "• 3 layers in height: 20 · 3 ＝ ",
    step3Tip: "🎯 For a cube where all edges are equal (a): V ＝ a · a · a.",
    step4Badge: "STEP 4",
    step4Category: "Capacity",
    step4Title: "Volume & Liters ( l )",
    step4Desc: "When volume involves liquids (water, milk, oil), we use liquid capacity:",
    step4Formula: "1 dm³ ＝ 1 Liter ( l ) ＝ 1,000 cm³",
    step4Explanation: "A cube with a 10 cm edge holds exactly 1 liter of water (10 · 10 · 10 ＝ 1,000 cm³ ＝ 1 dm³)! Thus:",
    step4FractionPrefix: "1 dm³ ＝",
    step4FractionSuffix: "m³",
    step4Tip: "🔍 1 cubic meter (m³) equals 1,000 dm³, which is exactly 1,000 liters of water!",
    labBadge: "INTERACTIVE LAB",
    labTitle: "Box Packing Simulation with Cubes ( 5 × 4 × 3 )",
    labDesc: "Drag the slider to progressively fill the box with unit cubes (1 cm³). Observe how the 3 distinct layers of 20 cubes each stack up to form the 60 cm³ total volume.",
    cubesInBoxLabel: "Cubes packed inside the box:",
    decreaseCubesAria: "Decrease by 5 cubes",
    increaseCubesAria: "Increase by 5 cubes",
    sliderCubesAria: "Number of cubes inside the box",
    emptyBtn: "🔄 Empty (0)",
    fillAllBtn: "🎯 Fill All (",
    mathCalcTitle: "MATHEMATICAL VOLUME CALCULATION",
    calcFormulaCompletePrefix: "Volume ＝",
    calcFormulaInProgressPrefix: "Currently placed:",
    calcFormulaInProgressSuffix: "cubes",
    calcExplanation: "Rather than counting every single cube, multiply all 3 dimensions:",
    layerBreakdownTitle: "💡 How volume stacks up in layers:",
    layerBreakdown1: "1st layer (box base): 5 · 4 ＝ 20 cubes",
    layerBreakdown2: "2nd layer: another 20 cubes (total 40 cubes)",
    layerBreakdown3: "3rd layer (top): another 20 cubes (total 60 cubes)",
    visualTitle: "3D SOLID VISUALIZATION",
    boxDimensionsBadge: "5 × 4 × 3 box",
    lengthLabel: "↔️ Length:",
    widthLabel: "↗️ Width:",
    heightLabel: "⬆️ Height:",
    ctaTitle: "Time to Practice Volume!",
    ctaSubtitle: "Challenge yourself with interactive problems on rectangular prisms, cubes, capacity in liters, and real-world spatial reasoning.",
    ctaButton: "Start Exercises"
  }
};

export default function EnnoiaOgkouTheoryPage() {
  const router = useRouter();
  const currentLocale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = currentLocale === 'en';
  const t = translations[currentLocale];

  const length = 5;
  const width = 4;
  const height = 3;

  const totalCubes = length * width * height; // 60 cm³

  const [cubesCount, setCubesCount] = useState(20);
  const isComplete = cubesCount === totalCubes;

  const size = 24;
  const startX = 145;
  const startY = 175;

  const getIsoCoords = (x, y, z) => {
    const isoX = startX + (x * size * 0.866) - (y * size * 0.866);
    const isoY = startY + (x * size * 0.5) + (y * size * 0.5) - (z * size);
    return { x: isoX, y: isoY };
  };

  const formatNumber = (num, minDec = 0, maxDec = 0) => {
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
          href="/e-dimotikou/28-ennoia-ogkou-ask"
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
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
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
              href="/e-dimotikou/28-ennoia-ogkou-ask"
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
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div><strong>{t.step1PerimeterLabel}</strong> {t.step1PerimeterDesc}</div>
                  <div><strong>{t.step1AreaLabel}</strong> {t.step1AreaDesc}</div>
                  <div><strong>{t.step1VolumeLabel}</strong> {t.step1VolumeDesc}</div>
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
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-emerald-950 shadow-inner">
                    {t.step2Formula}
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    {t.step2Explanation}<strong>60 cm³</strong>.
                  </p>
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
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-amber-950 shadow-inner">
                    {t.step3Formula} &nbsp; {t.step3FormulaSym}
                  </div>
                  <div className="text-slate-600 text-xs font-sans text-left pt-1 space-y-0.5">
                    <p>{t.step3Layer1}</p>
                    <p>{t.step3LayerAll}<strong>60 cm³</strong></p>
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

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 font-bold">
                    {t.step4Formula}
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    {t.step4Explanation}
                  </p>
                  <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 inline-flex items-center justify-center">
                    <span>{t.step4FractionPrefix}</span>
                    <Fraction numerator="1" denominator="1.000" className="text-xs font-bold" />
                    <span>{t.step4FractionSuffix}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΟΓΚΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {toCleanUppercase(t.labBadge)}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.labDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Αριστερή Στήλη: Χειριστήρια & Μαθηματικός Τύπος */}
            <div className="lg:col-span-6 2xl:col-span-6 space-y-6 bg-slate-50 p-4 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Stepper Κύβων */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-800">
                      {t.cubesInBoxLabel}
                    </span>
                    <span
                      className={`shrink-0 whitespace-nowrap font-mono font-black text-base sm:text-xl px-2.5 py-1 rounded-xl border shadow-xs bg-white ${
                        isComplete
                          ? 'text-emerald-600 border-emerald-300'
                          : 'text-blue-600 border-blue-200'
                      }`}
                    >
                      {formatNumber(cubesCount)} / {formatNumber(totalCubes)}
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      aria-label={t.decreaseCubesAria}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCubesCount((prev) => Math.max(0, prev - 5));
                      }}
                      disabled={cubesCount <= 0}
                      className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="0"
                      max={totalCubes}
                      step="1"
                      value={cubesCount}
                      onChange={(e) => setCubesCount(Number(e.target.value))}
                      aria-label={t.sliderCubesAria}
                      className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                    />

                    <button
                      type="button"
                      aria-label={t.increaseCubesAria}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCubesCount((prev) => Math.min(totalCubes, prev + 5));
                      }}
                      disabled={cubesCount >= totalCubes}
                      className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                    >
                      ＋
                    </button>
                  </div>

                  {/* Γρήγορα κουμπιά κατάστασης */}
                  <div className="flex justify-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setCubesCount(0)}
                      className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-xs active:scale-95"
                    >
                      {t.emptyBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCubesCount(totalCubes)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-xs active:scale-95 ${
                        isComplete
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {t.fillAllBtn}{totalCubes})
                    </button>
                  </div>
                </div>

                {/* Κάρτα Μαθηματικού Τύπου */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 shadow-xs text-center transition duration-200 ${
                    isComplete
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                    {toCleanUppercase(t.mathCalcTitle)}
                  </span>
                  <div
                    className={`text-lg sm:text-xl font-black font-mono ${
                      isComplete ? 'text-emerald-700' : 'text-slate-800'
                    }`}
                  >
                    {isComplete
                      ? `${t.calcFormulaCompletePrefix} ${length} · ${width} · ${height} ＝ ${formatNumber(totalCubes)} cm³`
                      : `${t.calcFormulaInProgressPrefix} ${formatNumber(cubesCount)} ${t.calcFormulaInProgressSuffix} (${formatNumber(cubesCount)} cm³)`}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t.calcExplanation}<br />
                    <strong>{t.lengthLabel.replace('↔️ ', '')} ({length} cm) · {t.widthLabel.replace('↗️ ', '')} ({width} cm) · {t.heightLabel.replace('⬆️ ', '')} ({height} cm)</strong>
                  </p>
                </div>
              </div>

              {/* Επεξηγηματικό Callout Στρώσεων */}
              <div className="bg-blue-50 text-slate-900 p-4 rounded-2xl border border-blue-200 space-y-1.5 text-xs text-slate-700">
                <div className="font-black text-blue-900 flex items-center gap-1.5">
                  <span>💡</span> {t.layerBreakdownTitle}
                </div>
                <div>{t.layerBreakdown1}</div>
                <div>{t.layerBreakdown2}</div>
                <div>{t.layerBreakdown3}</div>
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG Τρισδιάστατος Καμβάς */}
            <div className="lg:col-span-6 2xl:col-span-6 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-between space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.visualTitle)}</span>
                <span className="font-mono text-blue-600 font-bold">{t.boxDimensionsBadge}</span>
              </div>

              {/* SVG 3D Canvas */}
              <div className="relative bg-white p-4 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center w-full max-w-[380px] h-[340px] overflow-hidden my-auto">
                <svg
                  width="360"
                  height="320"
                  viewBox="-40 -20 380 300"
                  className="overflow-visible"
                  shapeRendering="geometricPrecision"
                >
                  {/* Σχεδίαση των 60 κύβων */}
                  {[...Array(totalCubes)].map((_, i) => {
                    const z = Math.floor(i / (length * width));
                    const rem = i % (length * width);
                    const y = Math.floor(rem / length);
                    const x = rem % length;

                    const pt = getIsoCoords(x, y, z);
                    const isActive = i < cubesCount;

                    return (
                      <g
                        key={i}
                        className="transition-all duration-200"
                        opacity={isActive ? 1 : 0.04}
                      >
                        {/* Πάνω Έδρα (Top) */}
                        <path
                          d={`M ${pt.x} ${pt.y} L ${pt.x + size * 0.866} ${pt.y + size * 0.5} L ${pt.x} ${pt.y + size} L ${pt.x - size * 0.866} ${pt.y + size * 0.5} Z`}
                          fill="#60a5fa"
                          stroke="#2563eb"
                          strokeWidth="0.75"
                        />
                        {/* Αριστερή Έδρα (Left) */}
                        <path
                          d={`M ${pt.x - size * 0.866} ${pt.y + size * 0.5} L ${pt.x} ${pt.y + size} L ${pt.x} ${pt.y + size + size} L ${pt.x - size * 0.866} ${pt.y + size * 0.5 + size} Z`}
                          fill="#1d4ed8"
                          stroke="#1e40af"
                          strokeWidth="0.75"
                        />
                        {/* Δεξιά Έδρα (Right) */}
                        <path
                          d={`M ${pt.x} ${pt.y + size} L ${pt.x + size * 0.866} ${pt.y + size * 0.5} L ${pt.x + size * 0.866} ${pt.y + size * 0.5 + size} L ${pt.x} ${pt.y + size + size} Z`}
                          fill="#3b82f6"
                          stroke="#1d4ed8"
                          strokeWidth="0.75"
                        />

                        {/* Ένδειξη 1 cm³ στον 1ο κύβο */}
                        {i === 0 && isActive && (
                          <text
                            x={pt.x - 10}
                            y={pt.y + 20}
                            fill="#ffffff"
                            fontSize="7"
                            fontWeight="bold"
                            className="font-sans pointer-events-none"
                          >
                            1 cm³
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Διαφανές εξωτερικό περίγραμμα κουτιού */}
                  {(() => {
                    const p000 = getIsoCoords(0, 0, 0);
                    const pMax00 = getIsoCoords(length, 0, 0);
                    const p0Max0 = getIsoCoords(0, width, 0);
                    const pMaxMax0 = getIsoCoords(length, width, 0);
                    const p00Max = getIsoCoords(0, 0, height);
                    const pMax0Max = getIsoCoords(length, 0, height);
                    const p0MaxMax = getIsoCoords(0, width, height);
                    const pMaxMaxMax = getIsoCoords(length, width, height);

                    return (
                      <g
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        opacity="0.65"
                        className="pointer-events-none"
                      >
                        {/* Βάση */}
                        <path
                          d={`M ${p000.x} ${p000.y + size} L ${pMax00.x} ${pMax00.y + size} L ${pMaxMax0.x} ${pMaxMax0.y + size} L ${p0Max0.x} ${p0Max0.y + size} Z`}
                        />
                        {/* Οροφή */}
                        <path
                          d={`M ${p00Max.x} ${p00Max.y + size} L ${pMax0Max.x} ${pMax0Max.y + size} L ${pMaxMaxMax.x} ${pMaxMaxMax.y + size} L ${p0MaxMax.x} ${p0MaxMax.y + size} Z`}
                          fill="rgba(148,163,184,0.02)"
                        />
                        {/* Κατακόρυφες ακμές */}
                        <line x1={p000.x} y1={p000.y + size} x2={p00Max.x} y2={p00Max.y + size} />
                        <line x1={pMax00.x} y1={pMax00.y + size} x2={pMax0Max.x} y2={pMax0Max.y + size} />
                        <line x1={p0Max0.x} y1={p0Max0.y + size} x2={p0MaxMax.x} y2={p0MaxMax.y + size} />
                        <line x1={pMaxMax0.x} y1={pMaxMax0.y + size} x2={pMaxMaxMax.x} y2={pMaxMaxMax.y + size} />
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Ετικέτες Διαστάσεων */}
              <div className="w-full flex flex-wrap justify-center gap-3 sm:gap-5 text-xs font-black text-slate-500 pt-3 border-t border-slate-200 text-center">
                <span className="text-blue-700 whitespace-nowrap">{t.lengthLabel} {length} cm</span>
                <span className="text-indigo-700 whitespace-nowrap">{t.widthLabel} {width} cm</span>
                <span className="text-sky-600 whitespace-nowrap">{t.heightLabel} {height} cm</span>
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
              {t.ctaSubtitle}
            </p>
          </div>

          <Link
            href="/e-dimotikou/28-ennoia-ogkou-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {t.ctaButton}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
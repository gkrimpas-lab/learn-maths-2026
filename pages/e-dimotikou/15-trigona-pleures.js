// pages/e-dimotikou/15-trigona-pleures.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Συνάρτηση για άτονα κεφαλαία με εξαίρεση το Ε'
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

// Οπτική απόδοση κλάσματος (αριθμητής πάνω, κλασματική γραμμή, παρονομαστής κάτω)
function MathFraction({ numerator, denominator, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none ${className}`}>
      <span className="px-1 text-center border-b-[1.5px] border-current w-full pb-0.5">
        {numerator}
      </span>
      <span className="px-1 text-center pt-0.5 w-full">
        {denominator}
      </span>
    </span>
  );
}

const I18N = {
  el: {
    pageTitle: "Τρίγωνα ως προς τις Πλευρές - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθετε τα είδη τριγώνων ως προς τις πλευρές (ισόπλευρο, ισοσκελές, σκαληνό), την τριγωνική ανισότητα, τον υπολογισμό περιμέτρου και δοκιμάστε το διαδραστικό εργαστήριο.",
    backText: "Ε' Δημοτικού",
    actionButton: "Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 15 • Ε' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Τρίγωνα ως προς τις Πλευρές",
    heroSubtitle: "Εξερευνούμε την κατάταξη των τριγώνων ανάλογα με τα μήκη των πλευρών τους, την τριγωνική ανισότητα που καθορίζει πότε μπορεί να κατασκευαστεί ένα τρίγωνο, και πώς υπολογίζουμε την περίμετρό του.",
    heroStatus: "Θεωρία & Δυναμικός Γεωμετρικός Καμβάς Πλευρών",
    heroAction: "Δοκίμασε τις Ασκήσεις",

    stepsSectionTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsSectionSubtitle: "Η κατηγοριοποίηση των τριγώνων με βάση τα μήκη των πλευρών και η περίμετρος.",

    step1Badge: "ΒΗΜΑ 1",
    step1Type: "Κατάταξη",
    step1Title: "Τα 3 Είδη ως προς τις Πλευρές",
    step1P1: "Με κριτήριο τη σχέση ανάμεσα στα μήκη των πλευρών τους, τα τρίγωνα διακρίνονται σε:",
    step1EquilateralTitle: "1. Ισόπλευρο:",
    step1EquilateralDesc: "Και οι 3 πλευρές ίσες μεταξύ τους.",
    step1IsoscelesTitle: "2. Ισοσκελές:",
    step1IsoscelesDesc: "Ακριβώς 2 πλευρές ίσες (και 1 διαφορετική).",
    step1ScaleneTitle: "3. Σκαληνό:",
    step1ScaleneDesc: "Και οι 3 πλευρές άνισες (διαφορετικές).",
    step1Tip: "Στο ισόπλευρο τρίγωνο, εκτός από τις 3 πλευρές, είναι απολύτως ίσες και οι 3 γωνίες (καθεμία είναι 60°).",

    step2Badge: "ΒΗΜΑ 2",
    step2Type: "Κανόνας Ύπαρξης",
    step2Title: "Η Τριγωνική Ανισότητα",
    step2Intro: "Δεν μπορούν τρία οποιαδήποτε ευθύγραμμα τμήματα να φτιάξουν τρίγωνο! Πρέπει να ισχύει:",
    step2Formula: "Κάθε πλευρά ＜ Άθροισμα των άλλων δύο",
    step2Example: "Αν έχουμε πλευρές 3 cm, 4 cm και 8 cm, τρίγωνο δεν σχηματίζεται, γιατί 3 ＋ 4 ＝ 7 cm ＜ 8 cm (οι πλευρές δεν συναντιούνται ποτέ).",
    step2Tip: "Για γρήγορο έλεγχο: Το άθροισμα των δύο μικρότερων πλευρών πρέπει να είναι αυστηρά μεγαλύτερο από τη μεγαλύτερη πλευρά.",

    step3Badge: "ΒΗΜΑ 3",
    step3Type: "Μέτρηση",
    step3Title: "Περίμετρος Τριγώνου",
    step3Intro: "Περίμετρος (Π) είναι το συνολικό μήκος του περιγράμματος του τριγώνου (το άθροισμα και των 3 πλευρών του):",
    step3Formula: "Περίμετρος ＝ α ＋ β ＋ γ",
    step3FormulaEquilateral: "Ισόπλευρο: Π ＝ 3 · πλευρά",
    step3FormulaIsosceles: "Ισοσκελές: Π ＝ (2 · ίση πλευρά) ＋ βάση",
    step3Tip: "Αν γνωρίζουμε την περίμετρο ενός ισόπλευρου τριγώνου (π.χ. 27 cm), η πλευρά του είναι:",

    step4Badge: "ΒΗΜΑ 4",
    step4Type: "Διπλή Ταυτότητα",
    step4Title: "Συνδυαστική Ονοματολογία",
    step4Intro: "Κάθε τρίγωνο χαρακτηρίζεται ταυτόχρονα από δύο ονόματα: ένα ως προς τις πλευρές και ένα ως προς τις γωνίες του!",
    step4Example1Title: "Ορθογώνιο και Ισοσκελές:",
    step4Example1Desc: "Έχει 1 ορθή γωνία (90°) και 2 ίσες κάθετες πλευρές (γωνίες: 90°, 45°, 45°).",
    step4Example2Title: "Αμβλυγώνιο και Σκαληνό:",
    step4Example2Desc: "Έχει 1 αμβλεία γωνία ( ＞ 90° ) και όλες τις πλευρές του διαφορετικές.",
    step4Tip: "Ένα ισόπλευρο τρίγωνο είναι ΠΑΝΤΑ οξυγώνιο, αφού και οι τρεις γωνίες του είναι υποχρεωτικά 60°.",

    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Δυναμικός Γεωμετρικός Καμβάς Πλευρών",
    labSubtitle: "Άλλαξε τα μήκη των πλευρών ΑΒ και ΑΓ. Παρατήρησε πώς μεταβάλλεται το σχήμα, η περίμετρος και η κατηγορία του τριγώνου.",
    ctrlSectionTitle: "ΡΥΘΜΙΣΗ ΜΗΚΟΥΣ ΠΛΕΥΡΩΝ",
    sideCLabel: "Πλευρά ΑΒ (αριστερή):",
    sideBLabel: "Πλευρά ΑΓ (δεξιά):",
    btnDecr5SideC: "Μείωση πλευράς ΑΒ κατά 5 cm",
    btnIncr5SideC: "Αύξηση πλευράς ΑΒ κατά 5 cm",
    btnDecr5SideB: "Μείωση πλευράς ΑΓ κατά 5 cm",
    btnIncr5SideB: "Αύξηση πλευράς ΑΓ κατά 5 cm",
    fixedBaseNote: "Σταθερή βάση ΒΓ ＝",
    charTitle: "ΚΑΤΗΓΟΡΙΑ ΩΣ ΠΡΟΣ ΤΙΣ ΠΛΕΥΡΕΣ",
    perimeterLabel: "Περίμετρος:",
    chartTitle: "ΓΕΩΜΕΤΡΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΠΛΕΥΡΩΝ",
    perimeterSymbol: "Π",
    lengthsLabel: "Μήκη:",

    triEquilateralTitle: "Ισόπλευρο Τρίγωνο",
    triEquilateralDesc: "Έχει και τις 3 πλευρές του απόλυτα ίσες (ΑΒ ＝ ΒΓ ＝ ΑΓ). Όλες οι γωνίες του είναι ίσες με 60°.",
    triIsoscelesTitle: "Ισοσκελές Τρίγωνο",
    triIsoscelesDesc: "Έχει ακριβώς 2 πλευρές ίσες μεταξύ τους. Οι δύο προσκείμενες στη βάση γωνίες είναι επίσης ίσες.",
    triScaleneTitle: "Σκαληνό Τρίγωνο",
    triScaleneDesc: "Και οι 3 πλευρές του έχουν διαφορετικά μήκη. Όλες οι γωνίες του είναι επίσης άνισες.",

    vertexA: "Α",
    vertexB: "Β",
    vertexΓ: "Γ",
    sideAB: "ΑΒ",
    sideBC: "ΒΓ",
    sideAC: "ΑΓ",

    ctaTitle: "Ώρα για Εξάσκηση στα Τρίγωνα ως προς τις Πλευρές!",
    ctaDesc: "Δοκίμασε τις γνώσεις σου σε απαιτητικές ασκήσεις κατάταξης τριγώνων, τριγωνικής ανισότητας και υπολογισμού περιμέτρου.",
    ctaButton: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Triangles by Sides - 5th Grade | LearnMaths.gr",
    pageDescription: "Learn the types of triangles by sides (equilateral, isosceles, scalene), triangle inequality, perimeter calculations, and explore the interactive lab.",
    backText: "5th Grade",
    actionButton: "Practice",
    badgeChapter: "CHAPTER 15 • 5TH GRADE",
    heroTitle: "Triangles by Sides",
    heroSubtitle: "Explore triangle classification based on side lengths, the triangle inequality theorem determining when a triangle can be formed, and calculating perimeter.",
    heroStatus: "Theory & Dynamic Geometry Side Canvas",
    heroAction: "Try the Practice Problems",

    stepsSectionTitle: "Core Concepts in 4 Steps",
    stepsSectionSubtitle: "Classification of triangles based on side lengths and perimeter calculations.",

    step1Badge: "STEP 1",
    step1Type: "Classification",
    step1Title: "The 3 Types by Sides",
    step1P1: "Based on the relationship between their side lengths, triangles are categorized into:",
    step1EquilateralTitle: "1. Equilateral:",
    step1EquilateralDesc: "All 3 sides are equal in length.",
    step1IsoscelesTitle: "2. Isosceles:",
    step1IsoscelesDesc: "Exactly 2 sides are equal (and 1 different).",
    step1ScaleneTitle: "3. Scalene:",
    step1ScaleneDesc: "All 3 sides have different lengths.",
    step1Tip: "In an equilateral triangle, in addition to all 3 sides, all 3 angles are also equal (each is 60°).",

    step2Badge: "STEP 2",
    step2Type: "Existence Rule",
    step2Title: "The Triangle Inequality",
    step2Intro: "Not just any three line segments can form a triangle! The following rule must hold:",
    step2Formula: "Each side ＜ Sum of the other two sides",
    step2Example: "Given sides of 3 cm, 4 cm, and 8 cm, a triangle cannot be formed because 3 ＋ 4 ＝ 7 cm ＜ 8 cm (the sides never meet).",
    step2Tip: "Quick test: The sum of the two shorter sides must be strictly greater than the longest side.",

    step3Badge: "STEP 3",
    step3Type: "Measurement",
    step3Title: "Perimeter of a Triangle",
    step3Intro: "Perimeter (P) is the total boundary length of the triangle (the sum of all 3 of its sides):",
    step3Formula: "Perimeter ＝ a ＋ b ＋ c",
    step3FormulaEquilateral: "Equilateral: P ＝ 3 · side",
    step3FormulaIsosceles: "Isosceles: P ＝ (2 · equal side) ＋ base",
    step3Tip: "If we know the perimeter of an equilateral triangle (e.g. 27 cm), its side length is:",

    step4Badge: "STEP 4",
    step4Type: "Double Identity",
    step4Title: "Combined Classification",
    step4Intro: "Every triangle is defined simultaneously by two names: one by its sides and one by its angles!",
    step4Example1Title: "Right & Isosceles:",
    step4Example1Desc: "Has 1 right angle (90°) and 2 equal perpendicular legs (angles: 90°, 45°, 45°).",
    step4Example2Title: "Obtuse & Scalene:",
    step4Example2Desc: "Has 1 obtuse angle ( ＞ 90° ) and all sides unequal.",
    step4Tip: "An equilateral triangle is ALWAYS acute, because all three of its angles are strictly 60°.",

    labBadge: "INTERACTIVE LAB",
    labTitle: "Dynamic Geometry Side Canvas",
    labSubtitle: "Adjust the lengths of sides AB and AC. Observe how the shape, perimeter, and classification of the triangle change in real time.",
    ctrlSectionTitle: "ADJUST SIDE LENGTHS",
    sideCLabel: "Side AB (left):",
    sideBLabel: "Side AC (right):",
    btnDecr5SideC: "Decrease side AB by 5 cm",
    btnIncr5SideC: "Increase side AB by 5 cm",
    btnDecr5SideB: "Decrease side AC by 5 cm",
    btnIncr5SideB: "Increase side AC by 5 cm",
    fixedBaseNote: "Fixed base BC ＝",
    charTitle: "CLASSIFICATION BY SIDES",
    perimeterLabel: "Perimeter:",
    chartTitle: "GEOMETRIC SIDE DIAGRAM",
    perimeterSymbol: "P",
    lengthsLabel: "Lengths:",

    triEquilateralTitle: "Equilateral Triangle",
    triEquilateralDesc: "All 3 sides are equal (AB ＝ BC ＝ AC). All angles equal 60°.",
    triIsoscelesTitle: "Isosceles Triangle",
    triIsoscelesDesc: "Exactly 2 sides are equal. The two angles adjacent to the base are also equal.",
    triScaleneTitle: "Scalene Triangle",
    triScaleneDesc: "All 3 sides have different lengths. All angles are also unequal.",

    vertexA: "A",
    vertexB: "B",
    vertexΓ: "C",
    sideAB: "AB",
    sideBC: "BC",
    sideAC: "AC",

    ctaTitle: "Time to Practice Triangles by Sides!",
    ctaDesc: "Test your skills with triangle classification exercises, triangle inequality checks, and perimeter calculations.",
    ctaButton: "Start Exercises"
  }
};

export default function TrigonaPleuresTheoryPage() {
  const router = useRouter();
  const { locale } = router;
  const isEn = locale === 'en';
  const t = isEn ? I18N.en : I18N.el;
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  // Σταθερό μήκος βάσης ΒΓ
  const baseSide = 200;

  // Μήκη πλευρών ΑΒ (c) και ΑΓ (b) - Αρχικά 200 για ισόπλευρο
  const [sidec, setSidec] = useState(200);
  const [sideb, setSideb] = useState(200);

  // Διασφάλιση ελάχιστων ορίων ώστε να ικανοποιείται η τριγωνική ανισότητα
  const c = Math.max(110, Math.min(280, sidec));
  const b = Math.max(110, Math.min(280, sideb));

  // Συντεταγμένες βάσης ΒΓ (κεντραρισμένες στο viewBox 600x320)
  const bx = 300 - baseSide / 2; // 200
  const by = 250;
  const gx = 300 + baseSide / 2; // 400
  const gy = 250;

  // Νόμος Συνημιτόνων για τη γωνία Β: b² = c² + a² - 2·c·a·cos(B)
  const cosB = (c * c + baseSide * baseSide - b * b) / (2 * c * baseSide);
  const safeCosB = Math.max(-0.99, Math.min(0.99, cosB));
  const radB = Math.acos(safeCosB);

  // Συντεταγμένες κορυφής Α
  const ax = Math.round(bx + c * Math.cos(radB));
  const ay = Math.round(by - c * Math.sin(radB));

  // Περίμετρος
  const perimeter = c + baseSide + b;

  // Κατηγοριοποίηση ως προς τις πλευρές
  const getTriangleType = () => {
    if (c === baseSide && baseSide === b) {
      return {
        title: t.triEquilateralTitle,
        desc: t.triEquilateralDesc,
        color: 'text-blue-600',
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200'
      };
    }
    if (c === b || c === baseSide || b === baseSide) {
      return {
        title: t.triIsoscelesTitle,
        desc: t.triIsoscelesDesc,
        color: 'text-emerald-600',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300'
      };
    }
    return {
      title: t.triScaleneTitle,
      desc: t.triScaleneDesc,
      color: 'text-purple-600',
      badgeBg: 'bg-purple-50 text-purple-800 border-purple-200'
    };
  };

  const triType = getTriangleType();

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/15-trigona-pleures-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.actionButton}</span>
        </Link>
      }
    >
      {/* Container πλήρους εύρους σύμφωνα με τις προδιαγραφές */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 2xl:space-y-14">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.badgeChapter)}</span>
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
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.heroStatus}</span>
            </div>
            <Link
              href="/e-dimotikou/15-trigona-pleures-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>{t.heroAction}</span>
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
                    {toCleanUppercase(t.step1Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step1Type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1P1}
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-blue-700">{t.step1EquilateralTitle}</strong> {t.step1EquilateralDesc}
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-emerald-700">{t.step1IsoscelesTitle}</strong> {t.step1IsoscelesDesc}
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-purple-700">{t.step1ScaleneTitle}</strong> {t.step1ScaleneDesc}
                  </div>
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
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step2Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step2Type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Intro}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-amber-900 shadow-inner">
                    {t.step2Formula}
                  </div>
                  <p className="text-slate-600 text-xs text-left pt-1">
                    {t.step2Example}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ {t.step2Tip}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step3Type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Intro}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 text-center shadow-inner">
                    {t.step3Formula}
                  </div>
                  <div className="space-y-1 text-xs text-slate-700 font-sans pt-1">
                    <div><strong>•</strong> {t.step3FormulaEquilateral}</div>
                    <div><strong>•</strong> {t.step3FormulaIsosceles}</div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                <span className="flex flex-wrap items-center gap-1">
                  <span>🎯 {t.step3Tip}</span>
                  <MathFraction numerator="27" denominator="3" />
                  <span>＝ {(9).toLocaleString(numberLocale)} cm.</span>
                </span>
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step4Type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Intro}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>{t.step4Example1Title}</strong> {t.step4Example1Desc}
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>{t.step4Example2Title}</strong> {t.step4Example2Desc}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΛΕΥΡΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {toCleanUppercase(t.labBadge)}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.labSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια Πλευρών & Ταυτότητα */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                {toCleanUppercase(t.ctrlSectionTitle)}
              </h4>

              {/* Stepper Πλευράς ΑΒ (c) */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.sideCLabel}</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-xl text-sky-600 bg-white px-2 py-0.5 rounded-xl border border-sky-200 shadow-sm">
                    {c.toLocaleString(numberLocale)} cm
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.btnDecr5SideC}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSidec((prev) => Math.max(110, prev - 5));
                    }}
                    disabled={c <= 110}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    －5
                  </button>

                  <input
                    type="range"
                    min="110"
                    max="280"
                    step="5"
                    value={c}
                    onChange={(e) => setSidec(Number(e.target.value))}
                    aria-label={t.sideCLabel}
                    className="w-full min-w-0 max-w-full accent-sky-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.btnIncr5SideC}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSidec((prev) => Math.min(280, prev + 5));
                    }}
                    disabled={c >= 280}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    ＋5
                  </button>
                </div>
              </div>

              {/* Stepper Πλευράς ΑΓ (b) */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.sideBLabel}</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-xl text-indigo-600 bg-white px-2 py-0.5 rounded-lg border border-indigo-200 shadow-sm">
                    {b.toLocaleString(numberLocale)} cm
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.btnDecr5SideB}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSideb((prev) => Math.max(110, prev - 5));
                    }}
                    disabled={b <= 110}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    －5
                  </button>

                  <input
                    type="range"
                    min="110"
                    max="280"
                    step="5"
                    value={b}
                    onChange={(e) => setSideb(Number(e.target.value))}
                    aria-label={t.sideBLabel}
                    className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.btnIncr5SideB}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSideb((prev) => Math.min(280, prev + 5));
                    }}
                    disabled={b >= 280}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    ＋5
                  </button>
                </div>
              </div>

              {/* Ένδειξη σταθερής βάσης */}
              <div className="text-center text-xs font-bold text-slate-500 py-1 bg-white rounded-xl border border-slate-200">
                📍 {t.fixedBaseNote} <span className="text-slate-900 font-black font-mono">{baseSide.toLocaleString(numberLocale)} cm</span>
              </div>

              {/* Κάρτα Ταυτότητας Τριγώνου */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm text-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  {toCleanUppercase(t.charTitle)}
                </span>
                <div className={`text-2xl sm:text-3xl font-black ${triType.color}`}>
                  {triType.title}
                </div>
                <div className={`p-2.5 rounded-xl border text-xs font-medium ${triType.badgeBg}`}>
                  {triType.desc}
                </div>

                {/* Περίμετρος */}
                <div className="pt-2 border-t border-slate-100 font-mono text-xs sm:text-sm font-bold text-slate-800">
                  {t.perimeterLabel} {c.toLocaleString(numberLocale)} ＋ {baseSide.toLocaleString(numberLocale)} ＋ {b.toLocaleString(numberLocale)} ＝{' '}
                  <span className="text-blue-700 font-black">{perimeter.toLocaleString(numberLocale)} cm</span>
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG Γεωμετρικό Σχήμα */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.chartTitle)}</span>
                <span className="font-mono text-blue-600 font-bold">{t.perimeterSymbol} ＝ {perimeter.toLocaleString(numberLocale)} cm</span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[540px] aspect-[600/320] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 600 320" className="w-full h-full drop-shadow-sm">
                  {/* Τρίγωνο ΑΒΓ (γέμισμα) */}
                  <polygon
                    points={`${ax},${ay} ${bx},${by} ${gx},${gy}`}
                    className="fill-sky-500/10 stroke-slate-700 stroke-[3] stroke-linejoin-round"
                  />

                  {/* Πλευρά ΑΒ (Cyan) */}
                  <line x1={bx} y1={by} x2={ax} y2={ay} className="stroke-sky-500 stroke-[4] stroke-linecap-round" />

                  {/* Πλευρά ΑΓ (Indigo) */}
                  <line x1={gx} y1={gy} x2={ax} y2={ay} className="stroke-indigo-500 stroke-[4] stroke-linecap-round" />

                  {/* Βάση ΒΓ (Slate) */}
                  <line x1={bx} y1={by} x2={gx} y2={gy} className="stroke-slate-800 stroke-[4] stroke-linecap-round" />

                  {/* Ετικέτες μηκών πλευρών */}
                  <text
                    x={(bx + ax) / 2 - 25}
                    y={(by + ay) / 2 - 10}
                    className="font-mono text-xs font-black fill-sky-700"
                  >
                    {c.toLocaleString(numberLocale)} cm
                  </text>
                  <text
                    x={(gx + ax) / 2 + 10}
                    y={(by + ay) / 2 - 10}
                    className="font-mono text-xs font-black fill-indigo-700"
                  >
                    {b.toLocaleString(numberLocale)} cm
                  </text>
                  <text
                    x="300"
                    y={by + 22}
                    textAnchor="middle"
                    className="font-mono text-xs font-black fill-slate-800"
                  >
                    {baseSide.toLocaleString(numberLocale)} cm
                  </text>

                  {/* Κορυφές */}
                  <circle cx={ax} cy={ay} r="6" className="fill-slate-900" />
                  <text x={ax} y={ay - 12} textAnchor="middle" className="font-sans text-sm font-black fill-slate-900">
                    {t.vertexA}
                  </text>

                  <circle cx={bx} cy={by} r="6" className="fill-slate-900" />
                  <text x={bx - 16} y={by + 6} textAnchor="end" className="font-sans text-sm font-black fill-slate-900">
                    {t.vertexB}
                  </text>

                  <circle cx={gx} cy={gy} r="6" className="fill-slate-900" />
                  <text x={gx + 16} y={gy + 6} textAnchor="start" className="font-sans text-sm font-black fill-slate-900">
                    {t.vertexΓ}
                  </text>
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-lg p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700 flex flex-wrap items-center justify-center gap-2">
                <span>{t.lengthsLabel}</span>
                <span>
                  {t.sideAB} ＝ <strong className="text-slate-900">{c.toLocaleString(numberLocale)} cm</strong>
                </span>
                <span>•</span>
                <span>
                  {t.sideBC} ＝ <strong className="text-slate-900">{baseSide.toLocaleString(numberLocale)} cm</strong>
                </span>
                <span>•</span>
                <span>
                  {t.sideAC} ＝ <strong className="text-slate-900">{b.toLocaleString(numberLocale)} cm</strong>
                </span>
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
            href="/e-dimotikou/15-trigona-pleures-ask"
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
// pages/e-dimotikou/18-ipsos-trigonou.js
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

// Component για εμφάνιση κλασμάτων σε κανονική κατακόρυφη μορφή
function Fraction({ num, den }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle mx-1 font-mono text-sm sm:text-base leading-none">
      <span className="border-b-2 border-current px-1 pb-0.5 text-center font-bold">
        {num}
      </span>
      <span className="px-1 pt-0.5 text-center font-bold">
        {den}
      </span>
    </span>
  );
}

const translations = {
  el: {
    pageTitle: "Ύψος Τριγώνου - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθετε τι είναι το ύψος του τριγώνου, πού πέφτει σε οξυγώνια, ορθογώνια και αμβλυγώνια τρίγωνα, πώς σχεδιάζεται και δοκιμάστε το διαδραστικό εργαστήριο.",
    backText: "Ε' Δημοτικού",
    exercisesBadge: "🎯 Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 18 • Ε' ΔΗΜΟΤΙΚΟΥ",
    mainTitle: "Το Ύψος του Τριγώνου",
    mainDesc: "Ανακαλύπτουμε τι ονομάζουμε ύψος τριγώνου, γιατί κάθε τρίγωνο έχει τρία διαφορετικά ύψη, πότε το ύψος πέφτει μέσα, πότε συμπίπτει με πλευρά και πότε χρειάζεται να προεκτείνουμε τη βάση.",
    bannerStatus: "Θεωρία & Δυναμικός Καμβάς Ύψους Τριγώνου",
    tryExercises: "Δοκίμασε τις Ασκήσεις",
    stepsTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsDesc: "Η γεωμετρική φύση του ύψους και οι θέσεις που καταλαμβάνει σε κάθε είδος τριγώνου.",
    step1Tag: "ΒΗΜΑ 1",
    step1Badge: "Ορισμός",
    step1Title: "Τι είναι το Ύψος;",
    step1Desc: "Ύψος τριγώνου ονομάζουμε το κάθετο ευθύγραμμο τμήμα που ξεκινά από μία κορυφή και καταλήγει στην ευθεία της απέναντι πλευράς (τη βάση).",
    step1Pt1: "Σχηματίζει πάντα ορθή γωνία (90°) με τη βάση.",
    step1Pt2: "Η πλευρά στην οποία καταλήγει το ύψος ονομάζεται αντίστοιχη βάση.",
    step1Tip: "💡 Το ύψος είναι στην πραγματικότητα η απόσταση της κορυφής από την απέναντι πλευρά!",
    step2Tag: "ΒΗΜΑ 2",
    step2Badge: "Πλήθος",
    step2Title: "Τα 3 Ύψη του Τριγώνου",
    step2Desc: "Επειδή κάθε τρίγωνο έχει 3 κορυφές, διαθέτει ακριβώς 3 ύψη (ένα για κάθε κορυφή και αντίστοιχη πλευρά):",
    step2Altitudes: "υα (από το Α) • υβ (από το Β) • υγ (από το Γ)",
    step2Explain: "Τα τρία αυτά ύψη (ή οι προεκτάσεις τους) συναντιούνται πάντα στο ίδιο κοινό σημείο, το οποίο ονομάζεται ορθόκεντρο.",
    step2Tip: "⚡ Στο ισόπλευρο τρίγωνο και τα 3 ύψη είναι απολύτως ίσα σε μήκος!",
    step3Tag: "ΒΗΜΑ 3",
    step3Badge: "Θέση Ύψους",
    step3Title: "Πού Πέφτει το Ύψος;",
    step3Desc: "Η θέση του ύψους εξαρτάται απόλυτα από το είδος του τριγώνου:",
    step3Acute: "Οξυγώνιο:",
    step3AcuteDesc: "Πέφτει μέσα στο τρίγωνο (εσωτερικό).",
    step3Right: "Ορθογώνιο:",
    step3RightDesc: "Συμπίπτει με μία από τις δύο κάθετες πλευρές!",
    step3Obtuse: "Αμβλυγώνιο:",
    step3ObtuseDesc: "Πέφτει έξω από το τρίγωνο (στην προέκταση της βάσης).",
    step3Tip: "🎯 Στο αμβλυγώνιο, σχεδιάζουμε πρώτα τη βάση με διακεκομμένη γραμμή για να μπορέσει να προσγειωθεί το ύψος κάθετα.",
    step4Tag: "ΒΗΜΑ 4",
    step4Badge: "Εφαρμογή",
    step4Title: "Σύνδεση με το Εμβαδόν",
    step4Desc: "Το ύψος είναι το κλειδί για τον υπολογισμό της επιφάνειας (εμβαδού) κάθε τριγώνου:",
    step4FormulaText: "Εμβαδόν ＝",
    step4Num: "Βάση · Ύψος",
    step4Den: "2",
    step4Explain: "Όποια πλευρά κι αν διαλέξουμε ως βάση, πολλαπλασιάζουμε με το αντίστοιχο ύψος της και διαιρούμε διά 2.",
    step4RightFormulaLabel: "Στο ορθογώνιο τρίγωνο: Εμβαδόν ＝",
    step4RightNum: "Κάθετη Πλευρά 1 · Κάθετη Πλευρά 2",
    step4RightDen: "2",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Δυναμικός Καμβάς Ύψους Τριγώνου",
    labDesc: "Σύρε την κορυφή Α οριζόντια. Παρατήρησε πώς το ύψος παραμένει σταθερό σε μήκος, αλλά μετακινείται από το εσωτερικό του τριγώνου στην πλευρά (ορθογώνιο) ή στην εξωτερική προέκταση (αμβλυγώνιο).",
    labControlHeading: "ΟΡΙΖΟΝΤΙΑ ΜΕΤΑΤΟΠΙΣΗ ΚΟΡΥΦΗΣ Α",
    cardHeightLen: "ΜΗΚΟΣ ΥΨΟΥΣ ( υ )",
    cardTriType: "ΕΙΔΟΣ ΤΡΙΓΩΝΟΥ",
    xAxisLabel: "Θέση Άξονα X:",
    decreaseAria: "Μετακίνηση κορυφής Α αριστερά",
    increaseAria: "Μετακίνηση κορυφής Α δεξιά",
    rangeAria: "Οριζόντια θέση κορυφής Α",
    btnObtuse: "◀ Αμβλυγώνιο (Έξω)",
    btnRight: "📐 Ορθογώνιο στο Β",
    btnAcute: "▲ Οξυγώνιο (Μέσα)",
    statusHeading: "ΠΟΥ ΠΕΦΤΕΙ ΤΟ ΥΨΟΣ;",
    canvasHeading: "ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ (ΒΑΣΗ ΒΓ)",
    canvasHeightLabel: (h) => `Ύψος υ ＝ ${h} cm (Κάθετο)`,
    vertexA: "Α",
    vertexB: "Β",
    vertexC: "Γ",
    heightTag: (h) => `υ ＝ ${h} cm`,
    calloutText: (h) => `Το ύψος παραμένει σταθερό: ${h} cm (σχηματίζει πάντοτε 90° με τη βάση ή την προέκτασή της).`,
    ctaTitle: "Ώρα για Εξάσκηση στο Ύψος του Τριγώνου!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις εντοπισμού ύψους, γεωμετρικών υπολογισμών εμβαδού και αναγνώρισης θέσης σε οξυγώνια, ορθογώνια και αμβλυγώνια τρίγωνα.",
    startExercisesBtn: "🎯 Έναρξη Ασκήσεων",
    footerTopic: "Το Ύψος του Τριγώνου",
    footerNavBtn: "Μετάβαση στις Ασκήσεις",
  },
  en: {
    pageTitle: "Triangle Altitude - 5th Grade | LearnMaths.gr",
    pageDesc: "Learn what the altitude of a triangle is, where it falls in acute, right-angled, and obtuse triangles, how to draw it, and try the interactive lab.",
    backText: "5th Grade",
    exercisesBadge: "🎯 Exercises",
    chapterBadge: "CHAPTER 18 • 5TH GRADE",
    mainTitle: "The Altitude of a Triangle",
    mainDesc: "Discover what is defined as the altitude of a triangle, why every triangle has three distinct altitudes, when the altitude lies inside, coincides with a side, or requires extending the base.",
    bannerStatus: "Theory & Dynamic Triangle Altitude Canvas",
    tryExercises: "Try Exercises",
    stepsTitle: "Core Concepts in 4 Steps",
    stepsDesc: "The geometric nature of triangle altitudes and their positions in each triangle type.",
    step1Tag: "STEP 1",
    step1Badge: "Definition",
    step1Title: "What is an Altitude?",
    step1Desc: "The altitude of a triangle is the perpendicular line segment extending from a vertex to the line containing the opposite side (the base).",
    step1Pt1: "It always forms a right angle (90°) with the base.",
    step1Pt2: "The side on which the altitude lands is called the corresponding base.",
    step1Tip: "💡 The altitude is actually the perpendicular distance from the vertex to the opposite side!",
    step2Tag: "STEP 2",
    step2Badge: "Quantity",
    step2Title: "The 3 Altitudes of a Triangle",
    step2Desc: "Because every triangle has 3 vertices, it possesses exactly 3 altitudes (one for each vertex and opposite base):",
    step2Altitudes: "ha (from A) • hb (from B) • hc (from C)",
    step2Explain: "These three altitudes (or their extensions) always meet at a single common point called the orthocenter.",
    step2Tip: "⚡ In an equilateral triangle, all 3 altitudes are strictly equal in length!",
    step3Tag: "STEP 3",
    step3Badge: "Altitude Position",
    step3Title: "Where Does the Altitude Land?",
    step3Desc: "The position of the altitude depends directly on the type of triangle:",
    step3Acute: "Acute Triangle:",
    step3AcuteDesc: "Falls inside the triangle (interior segment).",
    step3Right: "Right-Angled:",
    step3RightDesc: "Coincides with one of the two perpendicular legs!",
    step3Obtuse: "Obtuse Triangle:",
    step3ObtuseDesc: "Falls outside the triangle (on the extension of the base).",
    step3Tip: "🎯 In an obtuse triangle, we first extend the base with a dashed line so the altitude can land perpendicularly.",
    step4Tag: "STEP 4",
    step4Badge: "Application",
    step4Title: "Connection with Area",
    step4Desc: "The altitude is the essential parameter for calculating the area of any triangle:",
    step4FormulaText: "Area ＝",
    step4Num: "Base · Height",
    step4Den: "2",
    step4Explain: "Whichever side we choose as base, we multiply by its corresponding altitude and divide by 2.",
    step4RightFormulaLabel: "In a right-angled triangle: Area ＝",
    step4RightNum: "Leg 1 · Leg 2",
    step4RightDen: "2",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Dynamic Triangle Altitude Canvas",
    labDesc: "Drag vertex A horizontally. Observe how the altitude remains constant in length while moving from inside the triangle to a side (right-angled) or the exterior extension (obtuse).",
    labControlHeading: "HORIZONTAL SHIFT OF VERTEX A",
    cardHeightLen: "ALTITUDE LENGTH ( h )",
    cardTriType: "TRIANGLE TYPE",
    xAxisLabel: "X Axis Position:",
    decreaseAria: "Move vertex A left",
    increaseAria: "Move vertex A right",
    rangeAria: "Horizontal position of vertex A",
    btnObtuse: "◀ Obtuse (Outside)",
    btnRight: "📐 Right at B",
    btnAcute: "▲ Acute (Inside)",
    statusHeading: "WHERE DOES THE ALTITUDE LAND?",
    canvasHeading: "GEOMETRIC VISUALIZATION (BASE BC)",
    canvasHeightLabel: (h) => `Altitude h ＝ ${h} cm (Perpendicular)`,
    vertexA: "A",
    vertexB: "B",
    vertexC: "C",
    heightTag: (h) => `h ＝ ${h} cm`,
    calloutText: (h) => `The altitude remains constant: ${h} cm (always forms 90° with the base or its extension).`,
    ctaTitle: "Time to Practice Triangle Altitude!",
    ctaDesc: "Put your knowledge to the test with challenging problems on finding altitudes, area calculations, and identifying altitude locations across triangle types.",
    startExercisesBtn: "🎯 Start Exercises",
    footerTopic: "Triangle Altitude",
    footerNavBtn: "Go to Exercises",
  },
};

export default function IpsosTrigonouTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  // Οριζόντια θέση της κορυφής Α (100 έως 500 px στον άξονα X)
  const [posX, setPosX] = useState(300);

  // Σταθερές συντεταγμένες βάσης ΒΓ (viewBox 560x300)
  const bx = 220; // Σημείο Β
  const by = 240;
  const gx = 380; // Σημείο Γ
  const gy = 240;

  // Σταθερό ύψος (140 px -> 7.0 cm)
  const ay = 100;
  const ipsosHeightPx = by - ay;
  const numLocale = locale === 'en' ? 'en-US' : 'el-GR';

  const ipsosHeightCm = (ipsosHeightPx / 20).toLocaleString(numLocale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const ax = posX;

  // Θέση του ύψους σε σχέση με τη βάση ΒΓ
  const getIpsosPosition = () => {
    if (locale === 'en') {
      if (ax < bx) return 'Exterior (Lands on the extension of the base, left of B)';
      if (ax === bx) return 'Coincides with leg AB (Right angle at vertex B)';
      if (ax > bx && ax < gx) return 'Interior (Lands between points B and C)';
      if (ax === gx) return 'Coincides with leg AC (Right angle at vertex C)';
      return 'Exterior (Lands on the extension of the base, right of C)';
    }
    if (ax < bx) return 'Εξωτερικό (Πέφτει στην προέκταση της βάσης, αριστερά από το Β)';
    if (ax === bx) return 'Συμπίπτει με την κάθετη πλευρά ΑΒ (Ορθή γωνία στην κορυφή Β)';
    if (ax > bx && ax < gx) return 'Εσωτερικό (Πέφτει ανάμεσα στα σημεία Β και Γ)';
    if (ax === gx) return 'Συμπίπτει με την κάθετη πλευρά ΑΓ (Ορθή γωνία στην κορυφή Γ)';
    return 'Εξωτερικό (Πέφτει στην προέκταση της βάσης, δεξιά από το Γ)';
  };

  // Κατηγοριοποίηση τριγώνου
  const getTriangleCategory = () => {
    if (ax === bx || ax === gx) {
      return {
        title: locale === 'en' ? 'Right-Angled Triangle' : 'Ορθογώνιο Τρίγωνο',
        desc: locale === 'en'
          ? 'The altitude coincides with one of the two perpendicular legs of the triangle.'
          : 'Το ύψος συμπίπτει με μία από τις δύο κάθετες πλευρές του τριγώνου.',
        color: 'text-emerald-600',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      };
    }
    if (ax < bx || ax > gx) {
      return {
        title: locale === 'en' ? 'Obtuse Triangle' : 'Αμβλυγώνιο Τρίγωνο',
        desc: locale === 'en'
          ? 'The altitude lands outside the triangle, onto the extension of the base.'
          : 'Το ύψος πέφτει έξω από το τρίγωνο, πάνω στην προέκταση της βάσης.',
        color: 'text-purple-600',
        badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
      };
    }
    return {
      title: locale === 'en' ? 'Acute Triangle' : 'Οξυγώνιο Τρίγωνο',
      desc: locale === 'en'
        ? 'The altitude lands inside the triangle (interior segment).'
        : 'Το ύψος πέφτει μέσα στο τρίγωνο (εσωτερικό ευθύγραμμο τμήμα).',
      color: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    };
  };

  const triCategory = getTriangleCategory();

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/18-ipsos-trigonou-ask"
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
              href="/e-dimotikou/18-ipsos-trigonou-ask"
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
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 shadow-inner">
                    {t.step2Altitudes}
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    {t.step2Explain}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step2Tip}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
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

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-blue-700">{t.step3Acute}</strong> {t.step3AcuteDesc}
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-emerald-700">{t.step3Right}</strong> {t.step3RightDesc}
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-purple-700">{t.step3Obtuse}</strong> {t.step3ObtuseDesc}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-emerald-950 shadow-inner flex items-center justify-center flex-wrap gap-1">
                    <span>{t.step4FormulaText}</span>
                    <Fraction num={t.step4Num} den={t.step4Den} />
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    {t.step4Explain}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                <span className="inline-flex items-center flex-wrap gap-1">
                  🔍 {t.step4RightFormulaLabel}
                  <Fraction num={t.step4RightNum} den={t.step4RightDen} />.
                </span>
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΥΨΟΥΣ ΤΡΙΓΩΝΟΥ */}
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
            {/* Αριστερή Στήλη: Χειριστήρια & Μετρήσεις */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                {toCleanUppercase(t.labControlHeading)}
              </h4>

              {/* Πίνακας Μετρήσεων */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                    {toCleanUppercase(t.cardHeightLen)}
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-rose-600">
                    {ipsosHeightCm} cm
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                    {toCleanUppercase(t.cardTriType)}
                  </span>
                  <span className={`text-xs sm:text-sm font-black block mt-1 ${triCategory.color}`}>
                    {triCategory.title}
                  </span>
                </div>
              </div>

              {/* Stepper Θέσης Κορυφής Α */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.xAxisLabel}</span>
                  <span className="min-w-[80px] text-center font-mono font-bold text-xs bg-white px-2 py-1 rounded-xl border border-slate-200">
                    X ＝ {posX.toLocaleString(numLocale)} px
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.decreaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPosX((prev) => Math.max(100, prev - 10));
                    }}
                    disabled={posX <= 100}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base cursor-pointer"
                  >
                    ←
                  </button>

                  <input
                    type="range"
                    min="100"
                    max="500"
                    step="5"
                    value={posX}
                    onChange={(e) => setPosX(Number(e.target.value))}
                    aria-label={t.rangeAria}
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.increaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPosX((prev) => Math.min(500, prev + 10));
                    }}
                    disabled={posX >= 500}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base cursor-pointer"
                  >
                    →
                  </button>
                </div>

                {/* Γρήγορα κουμπιά θέσεων */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setPosX(150)}
                    className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition cursor-pointer"
                  >
                    {t.btnObtuse}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosX(bx)}
                    className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer"
                  >
                    {t.btnRight}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosX(300)}
                    className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition cursor-pointer"
                  >
                    {t.btnAcute}
                  </button>
                </div>
              </div>

              {/* Κάρτα Περιγραφής Θέσης Ύψους */}
              <div
                className={`p-5 rounded-2xl border space-y-2 shadow-sm text-center transition duration-200 ${triCategory.badgeBg}`}
              >
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  {toCleanUppercase(t.statusHeading)}
                </span>
                <div className={`text-base sm:text-lg font-black ${triCategory.color}`}>
                  {getIpsosPosition()}
                </div>
                <p className="text-xs font-medium text-slate-600">
                  {triCategory.desc}
                </p>
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG Γεωμετρικός Καμβάς */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.canvasHeading)}</span>
                <span className="font-mono text-rose-600 font-bold">
                  {t.canvasHeightLabel(ipsosHeightCm)}
                </span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[540px] aspect-[560/320] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 560 300" className="w-full h-full drop-shadow-sm">
                  {/* Προεκτάσεις βάσης αν το Α βγει έξω */}
                  {ax < bx && (
                    <line
                      x1={ax - 20}
                      y1={by}
                      x2={bx}
                      y2={by}
                      className="stroke-slate-300 stroke-[2]"
                      strokeDasharray="4 4"
                    />
                  )}
                  {ax > gx && (
                    <line
                      x1={gx}
                      y1={by}
                      x2={ax + 20}
                      y2={by}
                      className="stroke-slate-300 stroke-[2]"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Τετραγωνάκι ορθής γωνίας στη βάση του ύψους */}
                  <g className="stroke-rose-500 stroke-[1.5] fill-rose-500/15">
                    {ax >= bx ? (
                      <rect x={ax - 16} y={by - 16} width="16" height="16" />
                    ) : (
                      <rect x={ax} y={by - 16} width="16" height="16" />
                    )}
                  </g>

                  {/* Τρίγωνο ΑΒΓ */}
                  <polygon
                    points={`${ax},${ay} ${bx},${by} ${gx},${gy}`}
                    className="fill-sky-500/10 stroke-sky-600 stroke-[3.5] stroke-linejoin-round"
                  />

                  {/* Βάση ΒΓ */}
                  <line x1={bx} y1={by} x2={gx} y2={gy} className="stroke-slate-800 stroke-[4] stroke-linecap-round" />

                  {/* Ύψος (Κάθετο ευθύγραμμο τμήμα) */}
                  <line
                    x1={ax}
                    y1={ay}
                    x2={ax}
                    y2={by}
                    className="stroke-rose-500 stroke-[3.5] stroke-linecap-round"
                  />

                  {/* Κορυφή Α */}
                  <circle cx={ax} cy={ay} r="6" className="fill-slate-900" />
                  <text x={ax} y={ay - 12} textAnchor="middle" className="font-sans text-sm font-black fill-slate-900">
                    {t.vertexA}
                  </text>

                  {/* Κορυφή Β */}
                  <circle cx={bx} cy={by} r="6" className="fill-slate-900" />
                  <text x={bx - 16} y={by + 6} textAnchor="end" className="font-sans text-sm font-black fill-slate-900">
                    {t.vertexB}
                  </text>

                  {/* Κορυφή Γ */}
                  <circle cx={gx} cy={gy} r="6" className="fill-slate-900" />
                  <text x={gx + 16} y={gy + 6} textAnchor="start" className="font-sans text-sm font-black fill-slate-900">
                    {t.vertexC}
                  </text>

                  {/* Ετικέτα ύψους */}
                  <text
                    x={ax >= 300 ? ax - 12 : ax + 14}
                    y={(ay + by) / 2}
                    textAnchor={ax >= 300 ? 'end' : 'start'}
                    className="font-mono text-xs font-black fill-rose-600"
                  >
                    {t.heightTag(ipsosHeightCm)}
                  </text>
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                {t.calloutText(ipsosHeightCm)}
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
            href="/e-dimotikou/18-ipsos-trigonou-ask"
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
            href="/e-dimotikou/18-ipsos-trigonou-ask"
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
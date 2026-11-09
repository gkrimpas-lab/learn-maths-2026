// pages/e-dimotikou/20-mikos-kiklou.js
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
    pageTitle: "Μήκος Κύκλου - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθετε πώς υπολογίζουμε το μήκος του κύκλου (περιφέρεια), τη σημασία του αριθμού π = 3,14, τη σχέση με τη διάμετρο και δοκιμάστε το διαδραστικό εργαστήριο κύλισης τροχού.",
    backText: "Ε' Δημοτικού",
    exercisesBadge: "🎯 Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 20 • Ε' ΔΗΜΟΤΙΚΟΥ",
    mainTitle: "Το Μήκος του Κύκλου",
    mainDesc: "Εξερευνούμε την περιφέρεια του κύκλου, ανακαλύπτουμε γιατί η διάμετρος χωράει ακριβώς π (3,14) φορές στο μήκος του, πώς ξετυλίγεται ένας τροχός σε μία πλήρη περιστροφή και πώς επιλύουμε προβλήματα με στροφές τροχών.",
    bannerStatus: "Θεωρία & Ζωντανός Προσομοιωτής Κύλισης Τροχού",
    tryExercises: "Δοκίμασε τις Ασκήσεις",
    stepsTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsDesc: "Η γεωμετρία της περιφέρειας, ο αριθμός π και οι τύποι υπολογισμού.",
    step1Tag: "ΒΗΜΑ 1",
    step1Badge: "Ανατομία",
    step1Title: "Ακτίνα και Διάμετρος",
    step1Desc: "Κάθε κύκλος καθορίζεται πλήρως από το κέντρο του Ο και τη διάστασή του:",
    step1Pt1: "Ακτίνα (ρ): Το ευθύγραμμο τμήμα από το κέντρο μέχρι οποιοδήποτε σημείο της περιφέρειας.",
    step1Pt2: "Διάμετρος (δ): Το τμήμα που ενώνει δύο σημεία του κύκλου περνώντας από το κέντρο.",
    step1Formula: "Διάμετρος ＝ 2 · Ακτίνα   ( δ ＝ 2 · ρ )",
    step1Tip: "💡 Η διάμετρος είναι η μεγαλύτερη δυνατή χορδή που μπορεί να σχεδιαστεί μέσα σε έναν κύκλο!",
    step2Tag: "ΒΗΜΑ 2",
    step2Badge: "Η Σταθερά π",
    step2Title: "Ο Μαγικός Αριθμός π (3,14)",
    step2Desc: "Αν πάρουμε οποιονδήποτε κύκλο (από ένα καπάκι μέχρι ολόκληρη τη Γη) και διαιρέσουμε το μήκος του με τη διάμετρό του:",
    step2FormulaText: "＝ π ≈ 3,14",
    step2Num: "Μήκος Κύκλου",
    step2Den: "Διάμετρος",
    step2Explain: "Αυτό σημαίνει ότι η διάμετρος χωράει στο μήκος της περιφέρειας πάντα περίπου 3,14 φορές (τρεις ολόκληρες φορές και ένα μικρό κομματάκι)!",
    step2Tip: "⚡ Στα μαθηματικά του Δημοτικού χρησιμοποιούμε πάντα την τιμή π ＝ 3,14.",
    step3Tag: "ΒΗΜΑ 3",
    step3Badge: "Ο Μαθηματικός Τύπος",
    step3Title: "Πώς Υπολογίζουμε το Μήκος",
    step3Desc: "Ανάλογα με το αν γνωρίζουμε τη διάμετρο ή την ακτίνα, χρησιμοποιούμε τον αντίστοιχο τύπο:",
    step3FormulaDiameter: "Μ ＝ π · δ   ( 3,14 · Διάμετρος )",
    step3FormulaRadius: "Μ ＝ 2 · π · ρ   ( 2 · 3,14 · Ακτίνα )",
    step3Example: "π.χ. Για ακτίνα ρ ＝ 10 cm: Μ ＝ 2 · 3,14 · 10 ＝ 62,8 cm.",
    step3Tip: "🎯 Το μήκος του κύκλου είναι η «περίμετρος» του κυκλικού σχήματος.",
    step4Tag: "ΒΗΜΑ 4",
    step4Badge: "Εφαρμογές",
    step4Title: "Στροφές Τροχού & Αντίστροφοι Τύποι",
    step4Desc: "Όταν ένας τροχός κάνει μία πλήρη περιστροφή (360°), διανύει απόσταση ακριβώς ίση με το μήκος του:",
    step4Pt1: "Συνολική Απόσταση ＝ Στροφές · Μήκος Κύκλου",
    step4InverseText: "Αντίστροφος Τύπος: Διάμετρος ＝",
    step4InverseNum: "Μήκος",
    step4InverseDen: "3,14",
    step4Tip: "🔍 Αν ένας τροχός με μήκος 2 m κάνει 50 πλήρεις στροφές, διανύει: 50 · 2 ＝ 100 μέτρα.",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Προσομοιωτής Κύλισης & Ξετυλίγματος Κύκλου",
    labDesc: "Σύρε τον δρομέα για να κυλήσεις τον κύκλο κατά 1 πλήρη στροφή. Δες πώς η περιφέρειά του απλώνεται στο έδαφος και πώς συγκρίνεται με το μήκος της διαμέτρου.",
    labControlHeading: "ΚΥΛΙΣΗ ΤΡΟΧΟΥ",
    cardDiametros: "ΔΙΑΜΕΤΡΟΣ ( δ )",
    cardUnrolled: "ΞΕΤΥΛΙΓΜΕΝΟ ΜΗΚΟΣ",
    rollProgressLabel: "Πρόοδος Κύλισης:",
    decreaseAria: "Μείωση κύλισης κατά 5%",
    increaseAria: "Αύξηση κύλισης κατά 5%",
    rangeAria: "Πρόοδος κύλισης κύκλου",
    btnReset: "🔄 Επαναφορά (0%)",
    btnUnrollFull: "🎯 Πλήρες Ξετύλιγμα (100%)",
    cardCalcBadge: "ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ",
    cardCalcComplete: (m) => `Μήκος Κύκλου ＝ ${m} cm`,
    cardCalcRolling: "Ο τροχός κυλάει...",
    cardCalcDescComplete: (d, m) => `Μ ＝ π · δ ＝ 3,14 · ${d} ＝ ${m} cm (σε 1 περιστροφή).`,
    cardCalcDescRolling: "Σε κάθε κλάσμα της στροφής, ο τροχός διανύει το αντίστοιχο μέρος της περιφέρειάς του.",
    canvasHeading: "ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ (ΕΔΑΦΟΣ)",
    canvasTotal: (m) => `Συνολικό: ${m} cm`,
    canvasCurrent: (c) => `Τρέχον: ${c} cm`,
    finishMarker: "Μ (3,14 · δ)",
    diameterTag: (d) => `δ ＝ ${d} cm`,
    oneDiameterTag: "1 Διάμετρος (δ)",
    ratioComparisonTag: "χωράει ~3,14 φορές στο συνολικό μήκος",
    calloutComplete: (m) => `🟢 Πλήρης στροφή: Το μήκος της γραμμής ισούται ακριβώς με 3,14 · δ ＝ ${m} cm!`,
    calloutIncomplete: "🚴 Κύλισε τον τροχό μέχρι το 100% για να ολοκληρωθεί το πλήρες ξετύλιγμα της περιφέρειας.",
    ctaTitle: "Ώρα για Εξάσκηση στο Μήκος Κύκλου!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού μήκους κύκλου, ανάστροφης εύρεσης ακτίνας και διαμέτρου, και προβλήματα στροφών τροχών.",
    startExercisesBtn: "🎯 Έναρξη Ασκήσεων",
    footerTopic: "Το Μήκος του Κύκλου",
    footerNavBtn: "Μετάβαση στις Ασκήσεις",
  },
  en: {
    pageTitle: "Circumference of a Circle - 5th Grade | LearnMaths.gr",
    pageDesc: "Learn how to calculate the circumference of a circle, the importance of the number pi = 3.14, its relation to diameter, and try the interactive wheel unrolling lab.",
    backText: "5th Grade",
    exercisesBadge: "🎯 Exercises",
    chapterBadge: "CHAPTER 20 • 5TH GRADE",
    mainTitle: "Circumference of the Circle",
    mainDesc: "Explore the circumference of a circle, discover why the diameter fits exactly pi (3.14) times into its length, how a wheel unrolls in one full turn, and how to solve wheel rotation problems.",
    bannerStatus: "Theory & Live Wheel Rolling Simulator",
    tryExercises: "Try Exercises",
    stepsTitle: "Core Concepts in 4 Steps",
    stepsDesc: "The geometry of circumference, the constant pi, and calculation formulas.",
    step1Tag: "STEP 1",
    step1Badge: "Anatomy",
    step1Title: "Radius and Diameter",
    step1Desc: "Every circle is completely determined by its center O and its dimension:",
    step1Pt1: "Radius (r): The line segment from the center to any point on the circumference.",
    step1Pt2: "Diameter (d): The segment connecting two points on the circle passing through the center.",
    step1Formula: "Diameter ＝ 2 · Radius   ( d ＝ 2 · r )",
    step1Tip: "💡 The diameter is the longest possible chord that can be drawn inside a circle!",
    step2Tag: "STEP 2",
    step2Badge: "The Constant pi",
    step2Title: "The Magical Number pi (3.14)",
    step2Desc: "If we take any circle (from a bottle cap to the entire Earth) and divide its circumference by its diameter:",
    step2FormulaText: "＝ π ≈ 3.14",
    step2Num: "Circumference",
    step2Den: "Diameter",
    step2Explain: "This means that the diameter fits into the length of the circumference always about 3.14 times (three whole times and a small fraction)!",
    step2Tip: "⚡ In elementary school mathematics, we always use the value π ＝ 3.14.",
    step3Tag: "STEP 3",
    step3Badge: "Mathematical Formula",
    step3Title: "How We Calculate Circumference",
    step3Desc: "Depending on whether the diameter or the radius is known, we apply the matching formula:",
    step3FormulaDiameter: "C ＝ π · d   ( 3.14 · Diameter )",
    step3FormulaRadius: "C ＝ 2 · π · r   ( 2 · 3.14 · Radius )",
    step3Example: "e.g., For radius r ＝ 10 cm: C ＝ 2 · 3.14 · 10 ＝ 62.8 cm.",
    step3Tip: "🎯 The circumference of a circle is simply the \"perimeter\" of the circular shape.",
    step4Tag: "STEP 4",
    step4Badge: "Applications",
    step4Title: "Wheel Rotations & Inverse Formulas",
    step4Desc: "When a wheel completes one full rotation (360°), it travels a distance exactly equal to its circumference:",
    step4Pt1: "Total Distance ＝ Rotations · Circumference",
    step4InverseText: "Inverse Formula: Diameter ＝",
    step4InverseNum: "Circumference",
    step4InverseDen: "3.14",
    step4Tip: "🔍 If a wheel of circumference 2 m makes 50 full rotations, it travels: 50 · 2 ＝ 100 meters.",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Wheel Rolling & Unrolling Simulator",
    labDesc: "Drag the slider to roll the circle through 1 complete turn. Watch how its circumference unrolls along the ground and compares to the length of the diameter.",
    labControlHeading: "WHEEL ROLLING",
    cardDiametros: "DIAMETER ( d )",
    cardUnrolled: "UNROLLED LENGTH",
    rollProgressLabel: "Rolling Progress:",
    decreaseAria: "Decrease rolling by 5%",
    increaseAria: "Increase rolling by 5%",
    rangeAria: "Circle rolling progress",
    btnReset: "🔄 Reset (0%)",
    btnUnrollFull: "🎯 Full Unroll (100%)",
    cardCalcBadge: "MATHEMATICAL CALCULATION",
    cardCalcComplete: (m) => `Circumference ＝ ${m} cm`,
    cardCalcRolling: "The wheel is rolling...",
    cardCalcDescComplete: (d, m) => `C ＝ π · d ＝ 3.14 · ${d} ＝ ${m} cm (in 1 rotation).`,
    cardCalcDescRolling: "In each fraction of a turn, the wheel covers the corresponding part of its circumference.",
    canvasHeading: "GEOMETRIC VISUALIZATION (GROUND)",
    canvasTotal: (m) => `Total: ${m} cm`,
    canvasCurrent: (c) => `Current: ${c} cm`,
    finishMarker: "C (3.14 · d)",
    diameterTag: (d) => `d ＝ ${d} cm`,
    oneDiameterTag: "1 Diameter (d)",
    ratioComparisonTag: "fits ~3.14 times into the total length",
    calloutComplete: (m) => `🟢 Full rotation: The line length is exactly 3.14 · d ＝ ${m} cm!`,
    calloutIncomplete: "🚴 Roll the wheel to 100% to complete the full unrolling of the circumference.",
    ctaTitle: "Time to Practice Circle Circumference!",
    ctaDesc: "Challenge yourself with interactive problems calculating circumference, finding radius and diameter, and solving wheel rotation problems.",
    startExercisesBtn: "🎯 Start Exercises",
    footerTopic: "Circumference of the Circle",
    footerNavBtn: "Go to Exercises",
  },
};

export default function MikosKiklouTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [rollProgress, setRollProgress] = useState(0);

  // Γεωμετρικές σταθερές (προσαρμοσμένες σε viewBox 460x220)
  const radius = 35;
  const diametros = radius * 2; // 70 px
  const pi = 3.14159;
  const totalLength = Math.round(2 * pi * radius); // ~220 px

  const startCx = 65;
  const startCy = 110;
  const groundY = startCy + radius; // 145 px

  const currentCx = Math.round(startCx + (rollProgress / 100) * totalLength);
  const rotationDeg = (rollProgress / 100) * 360;
  const unfoldedLength = Math.round((rollProgress / 100) * totalLength);

  const numLocale = locale === 'en' ? 'en-US' : 'el-GR';

  const displayDiametrosCm = (diametros / 10).toLocaleString(numLocale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const displayMikosCm = (totalLength / 10).toLocaleString(numLocale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const displayCurrentCm = (unfoldedLength / 10).toLocaleString(numLocale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const isComplete = rollProgress === 100;
  const rollFormatted = rollProgress.toLocaleString(numLocale);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/20-mikos-kiklou-ask"
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
              href="/e-dimotikou/20-mikos-kiklou-ask"
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
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-mono font-bold text-center text-slate-900 shadow-inner">
                    {t.step1Formula}
                  </div>
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-black text-indigo-950 shadow-inner flex items-center justify-center flex-wrap gap-1">
                    <Fraction num={t.step2Num} den={t.step2Den} />
                    <span>{t.step2FormulaText}</span>
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-bold text-center text-blue-950 shadow-inner">
                    {t.step3FormulaDiameter}
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-bold text-center text-indigo-950 shadow-inner">
                    {t.step3FormulaRadius}
                  </div>
                  <p className="text-slate-500 text-xs font-sans text-center">
                    {t.step3Example}
                  </p>
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

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-mono">
                    <strong>{t.step4Pt1}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono flex items-center flex-wrap gap-1">
                    <strong>{t.step4InverseText}</strong>
                    <Fraction num={t.step4InverseNum} den={t.step4InverseDen} />
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΚΥΛΙΣΗΣ ΤΡΟΧΟΥ */}
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
                    {toCleanUppercase(t.cardDiametros)}
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-slate-900">
                    {displayDiametrosCm} cm
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                    {toCleanUppercase(t.cardUnrolled)}
                  </span>
                  <span
                    className={`font-mono text-xl sm:text-2xl font-black ${
                      isComplete ? 'text-emerald-600' : 'text-blue-600'
                    }`}
                  >
                    {displayCurrentCm} cm
                  </span>
                </div>
              </div>

              {/* Stepper Προόδου Κύλισης */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.rollProgressLabel}</span>
                  <span
                    className={`min-w-[80px] text-center font-mono font-black text-2xl bg-white px-2.5 py-0.5 rounded-xl border shadow-sm transition ${
                      isComplete
                        ? 'text-emerald-600 border-emerald-300 ring-2 ring-emerald-100'
                        : 'text-blue-600 border-blue-200'
                    }`}
                  >
                    {rollFormatted}%
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.decreaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setRollProgress((prev) => Math.max(0, prev - 5));
                    }}
                    disabled={rollProgress <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base cursor-pointer"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={rollProgress}
                    onChange={(e) => setRollProgress(Number(e.target.value))}
                    aria-label={t.rangeAria}
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.increaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setRollProgress((prev) => Math.min(100, prev + 5));
                    }}
                    disabled={rollProgress >= 100}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base cursor-pointer"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά κατάστασης */}
                <div className="flex justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setRollProgress(0)}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-xs active:scale-95 cursor-pointer"
                  >
                    {t.btnReset}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRollProgress(100)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-xs active:scale-95 cursor-pointer ${
                      isComplete
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {t.btnUnrollFull}
                  </button>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος */}
              <div
                className={`p-5 rounded-2xl border space-y-2 shadow-sm text-center transition duration-200 ${
                  isComplete
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  {toCleanUppercase(t.cardCalcBadge)}
                </span>
                <div
                  className={`text-xl sm:text-2xl font-black ${
                    isComplete ? 'text-emerald-700 animate-pulse' : 'text-slate-800'
                  }`}
                >
                  {isComplete ? t.cardCalcComplete(displayMikosCm) : t.cardCalcRolling}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {isComplete
                    ? t.cardCalcDescComplete(displayDiametrosCm, displayMikosCm)
                    : t.cardCalcDescRolling}
                </p>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικός Καμβάς Unrolling */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.canvasHeading)}</span>
                <span className="font-mono text-blue-600 font-bold">
                  {isComplete ? t.canvasTotal(displayMikosCm) : t.canvasCurrent(displayCurrentCm)}
                </span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[540px] aspect-[560/280] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 460 220"
                  className="w-full h-full drop-shadow-sm"
                  shapeRendering="geometricPrecision"
                >
                  {/* Οριζόντια γραμμή εδάφους */}
                  <line x1="20" y1={groundY} x2="440" y2={groundY} className="stroke-slate-300 stroke-[3]" />

                  {/* Σημάδι Αφετηρίας (0) */}
                  <line x1={startCx} y1={groundY - 5} x2={startCx} y2={groundY + 8} className="stroke-slate-500 stroke-2" />
                  <text x={startCx} y={groundY + 22} className="fill-slate-500 font-mono text-xs font-black" textAnchor="middle">
                    0
                  </text>

                  {/* Σημαδούρα Τερματισμού (Μήκος Κύκλου) */}
                  <line
                    x1={startCx + totalLength}
                    y1={groundY - 8}
                    x2={startCx + totalLength}
                    y2={groundY + 8}
                    className="stroke-rose-500 stroke-[2.5]"
                  />
                  <text
                    x={startCx + totalLength}
                    y={groundY + 22}
                    className="fill-rose-600 font-mono text-[11px] font-black"
                    textAnchor="middle"
                  >
                    {t.finishMarker}
                  </text>

                  {/* Γραμμή Ξετυλίγματος πάνω στο έδαφος */}
                  {rollProgress > 0 && (
                    <line
                      x1={startCx}
                      y1={groundY}
                      x2={startCx + unfoldedLength}
                      y2={groundY}
                      className={`stroke-[5] stroke-linecap-round ${
                        isComplete ? 'stroke-emerald-500' : 'stroke-blue-600'
                      }`}
                    />
                  )}

                  {/* Ο Κυλιόμενος Κύκλος */}
                  <g transform={`translate(${currentCx - startCx}, 0)`}>
                    <circle
                      cx={startCx}
                      cy={startCy}
                      r={radius}
                      className={`stroke-[3.5] transition-colors duration-150 ${
                        isComplete ? 'stroke-emerald-600 fill-emerald-50/20' : 'stroke-slate-800 fill-white'
                      }`}
                    />

                    {/* Περιστρεφόμενη ακτίνα */}
                    <g transform={`rotate(${rotationDeg}, ${startCx}, ${startCy})`}>
                      <line
                        x1={startCx}
                        y1={startCy}
                        x2={startCx}
                        y2={startCy + radius}
                        className="stroke-indigo-600 stroke-[3] stroke-linecap-round"
                      />
                      <circle cx={startCx} cy={startCy + radius} r={4.5} className="fill-indigo-600" />
                    </g>

                    {/* Κέντρο Κύκλου */}
                    <circle cx={startCx} cy={startCy} r={4} className="fill-slate-900" />

                    {/* Ένδειξη διαμέτρου μέσα στον κύκλο */}
                    <line
                      x1={startCx - radius + 4}
                      y1={startCy}
                      x2={startCx + radius - 4}
                      y2={startCy}
                      className="stroke-slate-400 stroke-[1]"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={startCx}
                      y={startCy - 6}
                      className="text-[10px] font-mono font-black fill-slate-800"
                      textAnchor="middle"
                    >
                      {t.diameterTag(displayDiametrosCm)}
                    </text>
                  </g>

                  {/* Οπτικός οδηγός σύγκρισης διαμέτρου κάτω από το έδαφος */}
                  {isComplete && (
                    <g transform="translate(0, 30)">
                      <line
                        x1={startCx}
                        y1={groundY + 16}
                        x2={startCx + diametros}
                        y2={groundY + 16}
                        className="stroke-amber-500 stroke-[3.5] stroke-linecap-round"
                      />
                      <text
                        x={startCx + diametros / 2}
                        y={groundY + 30}
                        className="fill-amber-700 font-mono text-[10px] font-black"
                        textAnchor="middle"
                      >
                        {t.oneDiameterTag}
                      </text>
                      <text
                        x={startCx + totalLength}
                        y={groundY + 30}
                        textAnchor="end"
                        className="fill-slate-500 font-sans text-[10px] font-bold"
                      >
                        {t.ratioComparisonTag}
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                {isComplete ? (
                  <span>{t.calloutComplete(displayMikosCm)}</span>
                ) : (
                  <span>{t.calloutIncomplete}</span>
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
            href="/e-dimotikou/20-mikos-kiklou-ask"
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
            href="/e-dimotikou/20-mikos-kiklou-ask"
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
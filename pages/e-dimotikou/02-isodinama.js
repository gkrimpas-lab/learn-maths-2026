// pages/e-dimotikou/02-isodinama.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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

// Επαναχρησιμοποιήσιμο component για κανονική κατακόρυφη μορφή κλάσματος
function Fraction({ num, den, className = '', size = 'md' }) {
  const sizeClasses = {
    xs: 'text-[11px] 2xl:text-xs',
    sm: 'text-xs 2xl:text-sm',
    md: 'text-sm sm:text-base 2xl:text-lg',
    lg: 'text-base sm:text-xl 2xl:text-2xl',
    xl: 'text-xl sm:text-2xl 2xl:text-3xl'
  };

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <span className="px-1 text-center leading-tight">{num}</span>
      <span className="w-full min-w-[0.9em] h-[1.5px] bg-current my-[1px] rounded-full"></span>
      <span className="px-1 text-center leading-tight">{den}</span>
    </span>
  );
}

const translations = {
  el: {
    pageTitle: "Ισοδύναμα Κλάσματα - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Πλήρης θεωρία με παραδείγματα για τα ισοδύναμα κλάσματα, διαπλάτυνση, απλοποίηση, ανάγωγα κλάσματα και διαδραστικό εργαστήριο για την Ε' Δημοτικού.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    headerBadge: "ΚΕΦΑΛΑΙΟ 2 • Ε' ΔΗΜΟΤΙΚΟΥ",
    headerTitle: "Ισοδύναμα Κλάσματα",
    headerDesc: "Ανακαλύπτουμε πώς διαφορετικά κλάσματα μπορούν να εκφράζουν ακριβώς την ίδια ποσότητα! Μαθαίνουμε τη διαπλάτυνση, την απλοποίηση, το ανάγωγο κλάσμα και τον έλεγχο ισοδυναμίας με χιαστί γινόμενα.",
    interactiveTag: "Θεωρία & Διαδραστική Σύγκριση",
    tryExercises: "Δοκίμασε τις Ασκήσεις",

    stepsTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsDesc: "Οι δύο θεμελιώδεις μέθοδοι και οι κανόνες ελέγχου των ισοδύναμων κλασμάτων.",

    // Βήμα 1
    step1Badge: "ΒΗΜΑ 1",
    step1Sub: "Έννοια & Ορισμός",
    step1Title: "Τι είναι τα Ισοδύναμα Κλάσματα;",
    step1Text: "Ισοδύναμα (ή ίσα) λέγονται τα κλάσματα που έχουν διαφορετικούς όρους, αλλά εκφράζουν ακριβώς το ίδιο μέρος της ίδιας ποσότητας.",
    step1ExampleText: "Αν φάμε τα μέρη μιας σοκολάτας:",
    step1ExampleEnd: "έχουμε καταναλώσει την ίδια ακριβώς ποσότητα!",
    step1Note: "Παρόλο που κόβουμε τη μονάδα σε περισσότερα κομμάτια, παίρνουμε αναλογικά περισσότερα, οπότε η ποσότητα δεν αλλάζει.",

    // Βήμα 2
    step2Badge: "ΒΗΜΑ 2",
    step2Sub: "Πολλαπλασιασμός",
    step2Title: "Διαπλάτυνση Κλάσματος",
    step2Text: "Διαπλάτυνση είναι η διαδικασία κατά την οποία πολλαπλασιάζουμε και τον αριθμητή και τον παρονομαστή με τον ίδιο φυσικό αριθμό (διάφορο του 0 και του 1).",
    step2ExamplePrefix: "Παράδειγμα: Διαπλάτυνση του",
    step2ExampleSuffix: "με το 4",
    step2Therefore: "Επομένως:",
    step2Warning: "Προσοχή: Πολλαπλασιάζουμε ΠΑΝΤΑ και τους δύο όρους με τον ίδιο ακριβώς αριθμό!",

    // Βήμα 3
    step3Badge: "ΒΗΜΑ 3",
    step3Sub: "Διαίρεση & Απλοποίηση",
    step3Title: "Απλοποίηση & Ανάγωγο Κλάσμα",
    step3Text: "Απλοποίηση είναι η αντίστροφη διαδικασία: διαιρούμε και τους δύο όρους με έναν κοινό διαιρέτη τους.",
    step3ExamplePrefix: "Παράδειγμα: Απλοποίηση του",
    step3ExampleSuffix: "με το 6",
    step3Irreducible1: "Το κλάσμα",
    step3Irreducible2: "δεν απλοποιείται άλλο. Ονομάζεται ανάγωγο (Μ.Κ.Δ. αριθμητή και παρονομαστή είναι το 1).",
    step3Goal: "Στόχος: Σε κάθε άσκηση προσπαθούμε να φτάσουμε το κλάσμα στην ανάγωγη μορφή του.",

    // Βήμα 4
    step4Badge: "ΒΗΜΑ 4",
    step4Sub: "Κριτήριο Ισοδυναμίας",
    step4Title: "Έλεγχος με Χιαστί Γινόμενα",
    step4Text: "Δύο κλάσματα είναι ισοδύναμα αν και μόνο αν τα χιαστί γινόμενά τους είναι ίσα:",
    step4FormulaText: "α · δ ＝ β · γ",
    step4CheckQuestion: "Έλεγχος: Είναι τα παρακάτω κλάσματα ισοδύναμα;",
    step4CheckSuccess: "36 ＝ 36 ➔ Τα κλάσματα είναι ισοδύναμα!",
    step4Useful: "Χρήσιμο: Τα χιαστί γινόμενα μάς επιτρέπουν να βρίσκουμε αμέσως έναν άγνωστο όρο σε δύο ίσα κλάσματα.",

    // Εργαστήριο
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Εξερεύνηση Ισοδυναμίας σε Πραγματικό Χρόνο",
    labDesc: "Άλλαξε το αρχικό κλάσμα και επίλεξε τον πολλαπλασιαστή διαπλάτυνσης για να δεις πώς μετασχηματίζεται το σχήμα διατηρώντας την ίδια επιφάνεια.",
    viewPies: "🍕 Κυκλικοί Δίσκοι",
    viewBars: "🍫 Ορθογώνιες Ράβδοι",
    settingsTitle: "ΡΥΘΜΙΣΕΙΣ ΚΛΑΣΜΑΤΟΣ",
    numSetting: "Αρχικός Αριθμητής:",
    denSetting: "Αρχικός Παρονομαστής:",
    multSetting: "Πολλαπλασιαστής ( · k ):",
    mathActionTitle: "ΜΑΘΗΜΑΤΙΚΗ ΠΡΑΞΗ",
    decimalValueLabel: "Δεκαδική τιμή:",
    comparisonTitle: "ΠΑΡΑΛΛΗΛΗ ΟΠΤΙΚΗ ΣΥΓΚΡΙΣΗ",
    sameAreaBadge: "Ίδια επιφάνεια",
    initialFractionBadge: "ΑΡΧΙΚΟ ΚΛΑΣΜΑ",
    equivalentFractionBadge: "ΙΣΟΔΥΝΑΜΟ ΚΛΑΣΜΑ",
    partsOfTotal: "από τα",
    equalPartsSuffix: "ίσα μέρη",
    calloutInsight: "📢 Παρατήρησε τα δύο σχήματα: Αν και το δεύτερο είναι κομμένο σε περισσότερα κομμάτια, η χρωματισμένη επιφάνεια παραμένει ακριβώς η ίδια!",

    // Callout & Footer
    calloutTitle: "Ώρα για Εξάσκηση στα Ισοδύναμα!",
    calloutDesc: "Έλεγξε τις γνώσεις σου με απαιτητικές ασκήσεις διαπλάτυνσης, εύρεσης αγνώστου με χιαστί γινόμενα και απλοποίησης σε ανάγωγα κλάσματα.",
    calloutBtn: "Έναρξη Ασκήσεων",
    bottomFooterText: "Κεφάλαιο 2 • Ισοδύναμα Κλάσματα",
    bottomFooterBtn: "Μετάβαση στις Ασκήσεις"
  },
  en: {
    pageTitle: "Equivalent Fractions - Grade 5 | LearnMaths.gr",
    pageDesc: "Complete theory with examples on equivalent fractions, expansion, simplification, irreducible fractions, and an interactive lab for Grade 5.",
    backText: "Grade 5",
    exercisesBtn: "Exercises",
    headerBadge: "CHAPTER 2 • GRADE 5",
    headerTitle: "Equivalent Fractions",
    headerDesc: "Discover how different fractions can represent the exact same quantity! Master fraction expansion, simplification, irreducible forms, and cross-multiplication checks.",
    interactiveTag: "Theory & Interactive Comparison",
    tryExercises: "Try the Exercises",

    stepsTitle: "Core Concepts in 4 Steps",
    stepsDesc: "The two fundamental operations and the verification rules of equivalent fractions.",

    // Step 1
    step1Badge: "STEP 1",
    step1Sub: "Concept & Definition",
    step1Title: "What are Equivalent Fractions?",
    step1Text: "Fractions with different terms that represent the exact same portion of a whole are called equivalent (or equal) fractions.",
    step1ExampleText: "If we eat these portions of a chocolate bar:",
    step1ExampleEnd: "we have consumed the exact same amount of chocolate!",
    step1Note: "Even though we partition the unit into more pieces, we take proportionally more, so the total amount stays identical.",

    // Step 2
    step2Badge: "STEP 2",
    step2Sub: "Multiplication",
    step2Title: "Fraction Expansion",
    step2Text: "Expansion is the process where we multiply both the numerator and the denominator by the same non-zero whole number (different from 1).",
    step2ExamplePrefix: "Example: Expanding",
    step2ExampleSuffix: "by 4",
    step2Therefore: "Therefore:",
    step2Warning: "Warning: ALWAYS multiply BOTH terms by the exact same number!",

    // Step 3
    step3Badge: "STEP 3",
    step3Sub: "Division & Simplification",
    step3Title: "Simplification & Irreducible Fractions",
    step3Text: "Simplification is the reverse process: we divide both terms by their common divisor.",
    step3ExamplePrefix: "Example: Simplifying",
    step3ExampleSuffix: "by 6",
    step3Irreducible1: "The fraction",
    step3Irreducible2: "cannot be simplified further. It is called irreducible (GCD of numerator and denominator is 1).",
    step3Goal: "Goal: In every exercise, we strive to express the fraction in its irreducible form.",

    // Step 4
    step4Badge: "STEP 4",
    step4Sub: "Equivalence Criterion",
    step4Title: "Cross-Multiplication Check",
    step4Text: "Two fractions are equivalent if and only if their cross products are equal:",
    step4FormulaText: "a · d ＝ b · c",
    step4CheckQuestion: "Check: Are the following fractions equivalent?",
    step4CheckSuccess: "36 ＝ 36 ➔ The fractions are equivalent!",
    step4Useful: "Helpful: Cross multiplication enables us to instantly calculate an unknown term in two equal fractions.",

    // Lab
    labBadge: "INTERACTIVE LAB",
    labTitle: "Real-Time Equivalence Exploration",
    labDesc: "Adjust the original fraction and select the expansion multiplier to observe how the visual partitions transform while preserving the exact same shaded area.",
    viewPies: "🍕 Circular Discs",
    viewBars: "🍫 Rectangular Bars",
    settingsTitle: "FRACTION CONTROLS",
    numSetting: "Initial Numerator:",
    denSetting: "Initial Denominator:",
    multSetting: "Multiplier ( · k ):",
    mathActionTitle: "MATHEMATICAL OPERATION",
    decimalValueLabel: "Decimal value:",
    comparisonTitle: "SIDE-BY-SIDE VISUAL COMPARISON",
    sameAreaBadge: "Equal Area",
    initialFractionBadge: "INITIAL FRACTION",
    equivalentFractionBadge: "EQUIVALENT FRACTION",
    partsOfTotal: "out of",
    equalPartsSuffix: "equal parts",
    calloutInsight: "📢 Notice both diagrams: Although the second shape is sliced into more pieces, the total colored area remains identical!",

    // Callout & Footer
    calloutTitle: "Time to Practice Equivalence!",
    calloutDesc: "Test your skills with challenging exercises covering expansion, solving for unknown terms via cross products, and simplifying to irreducible fractions.",
    calloutBtn: "Start Exercises",
    bottomFooterText: "Chapter 2 • Equivalent Fractions",
    bottomFooterBtn: "Go to Exercises"
  }
};

export default function IsodinamaTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  // Αρχικό Κλάσμα
  const [num, setNum] = useState(2);
  const [den, setDen] = useState(3);

  // Πολλαπλασιαστής Διαπλάτυνσης (2 έως 6)
  const [multiplier, setMultiplier] = useState(2);

  // Τύπος οπτικοποίησης (Κυκλικοί Δίσκοι ή Ορθογώνιες Ράβδοι)
  const [viewType, setViewType] = useState('pie'); // 'pie' | 'bar'

  const MIN_NUM = 1;
  const MIN_DEN = 2;
  const MAX_DEN = 8;
  const MIN_MULT = 2;
  const MAX_MULT = 6;

  // Ισοδύναμο Κλάσμα (Υπολογιζόμενο)
  const isoNum = num * multiplier;
  const isoDen = den * multiplier;

  // Σχεδίαση τομέων κυκλικού δίσκου (Responsive SVG)
  const renderPieSlices = (currentNum, currentDen, fillColor = 'fill-amber-500') => {
    const slices = [];
    const radius = 88;
    const cx = 100;
    const cy = 100;

    for (let i = 0; i < currentDen; i++) {
      const isFilled = i < currentNum;

      if (currentDen === 1) {
        return (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            className={`${
              isFilled ? fillColor : 'fill-slate-100'
            } stroke-slate-800 stroke-[2.5] transition-colors duration-150`}
          />
        );
      }

      const startAngle = (i * 360) / currentDen - 90;
      const endAngle = ((i + 1) * 360) / currentDen - 90;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);

      const largeArc = 360 / currentDen > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      slices.push(
        <path
          key={`pie-${currentDen}-${i}`}
          d={pathData}
          className={`${
            isFilled ? fillColor : 'fill-slate-100'
          } stroke-slate-800 stroke-[2] transition-colors duration-150`}
        />
      );
    }
    return slices;
  };

  // Σχεδίαση ορθογώνιας ράβδου (Responsive SVG)
  const renderBarParts = (currentNum, currentDen, fillColor = 'fill-amber-500') => {
    const rects = [];
    const totalWidth = 260;
    const barHeight = 64;
    const startX = 20;
    const startY = 28;
    const partWidth = totalWidth / currentDen;

    for (let i = 0; i < currentDen; i++) {
      const isFilled = i < currentNum;
      const x = startX + i * partWidth;

      rects.push(
        <rect
          key={`bar-${currentDen}-${i}`}
          x={x}
          y={startY}
          width={partWidth}
          height={barHeight}
          className={`${
            isFilled ? fillColor : 'fill-slate-100'
          } stroke-slate-800 stroke-[2] transition-colors duration-150`}
        />
      );
    }
    return rects;
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/02-isodinama-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.exercisesBtn}</span>
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K & 4K */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 space-y-10 2xl:space-y-14 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.headerBadge)}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.headerTitle}
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.headerDesc}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.interactiveTag}</span>
            </div>
            <Link
              href="/e-dimotikou/02-isodinama-ask"
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
                    {toCleanUppercase(t.step1Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Sub}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    {t.step1ExampleText}
                  </p>
                  <div className="py-2 flex items-center justify-center">
                    <div className="inline-flex flex-wrap items-center justify-center gap-2 font-mono font-black text-slate-900 text-sm sm:text-base 2xl:text-xl bg-white px-4 py-2.5 rounded-xl border border-slate-300 shadow-inner">
                      <Fraction num={1} den={2} size="md" className="text-blue-600" />
                      <span>＝</span>
                      <Fraction num={2} den={4} size="md" className="text-emerald-600" />
                      <span>＝</span>
                      <Fraction num={4} den={8} size="md" className="text-indigo-600" />
                      <span>＝</span>
                      <span>{locale === 'el' ? '0,5' : '0.5'}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs 2xl:text-sm text-center">
                    {t.step1ExampleEnd}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-xs 2xl:text-sm text-blue-950 font-medium">
                💡 {t.step1Note}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step2Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Sub}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold flex items-center flex-wrap gap-1">
                    <span>{t.step2ExamplePrefix}</span>
                    <Fraction num={2} den={3} size="sm" className="text-blue-600" />
                    <span>{t.step2ExampleSuffix}</span>
                  </p>
                  <div className="py-2 flex items-center justify-center font-mono">
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-300 shadow-inner text-sm sm:text-base 2xl:text-lg">
                      <Fraction num="2 · 4" den="3 · 4" size="md" className="text-blue-600" />
                      <span className="font-sans">＝</span>
                      <Fraction num={8} den={12} size="md" className="text-emerald-600" />
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs 2xl:text-sm flex items-center justify-center gap-1">
                    <span>{t.step2Therefore}</span>
                    <Fraction num={2} den={3} size="sm" />
                    <span>＝</span>
                    <Fraction num={8} den={12} size="sm" />.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step2Warning}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Sub}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold flex items-center flex-wrap gap-1">
                    <span>{t.step3ExamplePrefix}</span>
                    <Fraction num={12} den={18} size="sm" className="text-rose-600" />
                    <span>{t.step3ExampleSuffix}</span>
                  </p>
                  <div className="py-2 flex items-center justify-center font-mono">
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-300 shadow-inner text-sm sm:text-base 2xl:text-lg">
                      <Fraction num="12 : 6" den="18 : 6" size="md" className="text-rose-600" />
                      <span className="font-sans">＝</span>
                      <Fraction num={2} den={3} size="md" className="text-indigo-600" />
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs 2xl:text-sm flex items-center flex-wrap gap-1">
                    <span>{t.step3Irreducible1}</span>
                    <Fraction num={2} den={3} size="sm" className="text-indigo-700" />
                    <span>{t.step3Irreducible2}</span>
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🎯 {t.step3Goal}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Sub}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed flex items-center flex-wrap gap-1">
                  <span>{t.step4Text}</span>
                  <Fraction num="α" den="β" size="sm" />
                  <span>και</span>
                  <Fraction num="γ" den="δ" size="sm" />:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base text-center">
                  <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono font-black text-base 2xl:text-lg text-slate-900 shadow-inner">
                    {t.step4FormulaText}
                  </div>
                  <p className="text-slate-700 text-left flex items-center flex-wrap gap-1">
                    <span>{t.step4CheckQuestion}</span>
                    <Fraction num={3} den={4} size="sm" className="text-blue-600" />
                    <span>και</span>
                    <Fraction num={9} den={12} size="sm" className="text-emerald-600" />
                  </p>
                  <div className="font-mono text-xs sm:text-sm text-left space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                    <div>3 · 12 ＝ <strong className="text-slate-900">36</strong></div>
                    <div>4 · 9 ＝ <strong className="text-slate-900">36</strong></div>
                    <div className="text-emerald-700 font-bold pt-1">{t.step4CheckSuccess}</div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                ⚡ {t.step4Useful}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΙΣΟΔΥΝΑΜΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
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

            {/* Toggle τύπου απεικόνισης */}
            <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setViewType('pie')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-bold transition ${
                  viewType === 'pie'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.viewPies}
              </button>
              <button
                type="button"
                onClick={() => setViewType('bar')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-bold transition ${
                  viewType === 'bar'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.viewBars}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Αριστερή Στήλη: Χειριστήρια & Μαθηματική Εξίσωση */}
            <div className="xl:col-span-5 2xl:col-span-4 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500 uppercase">
                {toCleanUppercase(t.settingsTitle)}
              </h4>

              {/* Stepper Αριθμητή */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.numSetting}</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                    {num}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease numerator by 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.max(MIN_NUM, prev - 1));
                    }}
                    disabled={num <= MIN_NUM}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={MIN_NUM}
                    max={den - 1}
                    step={1}
                    value={num}
                    onChange={(e) => setNum(Number(e.target.value))}
                    aria-label="Numerator"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Increase numerator by 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.min(den - 1, prev + 1));
                    }}
                    disabled={num >= den - 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Stepper Παρονομαστή */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.denSetting}</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                    {den}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease denominator by 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const nextDen = Math.max(MIN_DEN, den - 1);
                      setDen(nextDen);
                      if (num >= nextDen) setNum(nextDen - 1);
                    }}
                    disabled={den <= MIN_DEN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={MIN_DEN}
                    max={MAX_DEN}
                    step={1}
                    value={den}
                    onChange={(e) => {
                      const nextDen = Number(e.target.value);
                      setDen(nextDen);
                      if (num >= nextDen) setNum(nextDen - 1);
                    }}
                    aria-label="Denominator"
                    className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Increase denominator by 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDen((prev) => Math.min(MAX_DEN, prev + 1));
                    }}
                    disabled={den >= MAX_DEN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Επιλογή Πολλαπλασιαστή Διαπλάτυνσης */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">
                    {t.multSetting}
                  </span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    · {multiplier}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease multiplier by 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMultiplier((prev) => Math.max(MIN_MULT, prev - 1));
                    }}
                    disabled={multiplier <= MIN_MULT}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={MIN_MULT}
                    max={MAX_MULT}
                    step={1}
                    value={multiplier}
                    onChange={(e) => setMultiplier(Number(e.target.value))}
                    aria-label="Multiplier"
                    className="w-full min-w-0 max-w-full accent-amber-500 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Increase multiplier by 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMultiplier((prev) => Math.min(MAX_MULT, prev + 1));
                    }}
                    disabled={multiplier >= MAX_MULT}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Μαθηματική Εξίσωση Διαπλάτυνσης */}
              <div className="p-4 2xl:p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <div className="text-xs 2xl:text-sm font-bold text-slate-500 tracking-wider uppercase">
                  {toCleanUppercase(t.mathActionTitle)}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-mono">
                  <Fraction num={num} den={den} size="xl" className="text-blue-600" />
                  <span className="font-sans text-slate-400 text-lg">＝</span>
                  <Fraction num={`${num} · ${multiplier}`} den={`${den} · ${multiplier}`} size="md" className="text-amber-600" />
                  <span className="font-sans text-slate-400 text-lg">＝</span>
                  <Fraction num={isoNum} den={isoDen} size="xl" className="text-emerald-600" />
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs 2xl:text-sm text-slate-600 text-center font-mono">
                  {t.decimalValueLabel} {(num / den).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { maximumFractionDigits: 3 })}
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: Παράλληλη Οπτική Σύγκριση (Αρχικό vs Ισοδύναμο) */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center min-h-[380px] 2xl:min-h-[500px] space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm 2xl:text-base font-bold text-slate-500 px-2">
                <span>{toCleanUppercase(t.comparisonTitle)}</span>
                <span className="font-mono text-emerald-600 font-bold">{t.sameAreaBadge}</span>
              </div>

              {/* Πλέγμα 2 στηλών για τα δύο κλάσματα */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
                {/* Κάρτα Αρχικού Κλάσματος */}
                <div className="w-full max-w-[280px] 2xl:max-w-[340px] bg-white p-5 2xl:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs 2xl:text-sm font-black tracking-wider">
                    {toCleanUppercase(t.initialFractionBadge)}
                  </div>

                  <Fraction num={num} den={den} size="xl" className="text-blue-600" />

                  {viewType === 'pie' ? (
                    <div className="w-full aspect-square max-w-[190px] 2xl:max-w-[240px]">
                      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm" aria-label="Initial pie visual">
                        {renderPieSlices(num, den, 'fill-blue-500')}
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full aspect-[300/120] max-w-[240px] 2xl:max-w-[280px]">
                      <svg viewBox="0 0 300 120" className="w-full h-full drop-shadow-sm" aria-label="Initial bar visual">
                        {renderBarParts(num, den, 'fill-blue-500')}
                      </svg>
                    </div>
                  )}

                  <span className="text-xs 2xl:text-sm text-slate-500 font-medium">
                    {num} {t.partsOfTotal} {den} {t.equalPartsSuffix}
                  </span>
                </div>

                {/* Κάρτα Ισοδύναμου Κλάσματος */}
                <div className="w-full max-w-[280px] 2xl:max-w-[340px] bg-white p-5 2xl:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs 2xl:text-sm font-black tracking-wider">
                    {toCleanUppercase(t.equivalentFractionBadge)}
                  </div>

                  <Fraction num={isoNum} den={isoDen} size="xl" className="text-emerald-600" />

                  {viewType === 'pie' ? (
                    <div className="w-full aspect-square max-w-[190px] 2xl:max-w-[240px]">
                      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm" aria-label="Equivalent pie visual">
                        {renderPieSlices(isoNum, isoDen, 'fill-emerald-500')}
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full aspect-[300/120] max-w-[240px] 2xl:max-w-[280px]">
                      <svg viewBox="0 0 300 120" className="w-full h-full drop-shadow-sm" aria-label="Equivalent bar visual">
                        {renderBarParts(isoNum, isoDen, 'fill-emerald-500')}
                      </svg>
                    </div>
                  )}

                  <span className="text-xs 2xl:text-sm text-slate-500 font-medium">
                    {isoNum} {t.partsOfTotal} {isoDen} {t.equalPartsSuffix}
                  </span>
                </div>
              </div>

              {/* Επεξηγηματικό Callout Συμπεράσματος */}
              <div className="p-4 bg-emerald-600 text-white rounded-2xl text-center font-bold text-xs sm:text-sm 2xl:text-base shadow-sm max-w-xl">
                {t.calloutInsight}
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.calloutTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.calloutDesc}
            </p>
          </div>

          <Link
            href="/e-dimotikou/02-isodinama-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {t.calloutBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>

      {/* Σταθερό κάτω Footer */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm 2xl:text-base text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold">{t.bottomFooterText}</span>
          </div>
          <Link
            href="/e-dimotikou/02-isodinama-ask"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base transition active:scale-95 shadow-md"
          >
            <span>🎯 {t.bottomFooterBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </footer>
    </Layout>
  );
}
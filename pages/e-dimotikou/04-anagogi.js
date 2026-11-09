// pages/e-dimotikou/04-anagogi.js
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
    pageTitle: "Αναγωγή στην Κλασματική Μονάδα - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Πλήρης θεωρία με παραδείγματα για την αναγωγή στην κλασματική μονάδα, εύρεση του όλου από γνωστό μέρος και διαδραστικό εργαστήριο για την Ε' Δημοτικού.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    headerBadge: "ΚΕΦΑΛΑΙΟ 4 • Ε' ΔΗΜΟΤΙΚΟΥ",
    headerTitle: "Αναγωγή στην Κλασματική Μονάδα",
    headerDesc: "Όταν γνωρίζουμε την αξία για ένα μέρος ενός ποσού και ψάχνουμε το συνολικό ποσό (ή ένα άλλο μέρος του), η πιο δυνατή στρατηγική είναι να περάσουμε πρώτα από το 1 μέρος (κλασματική μονάδα)!",
    interactiveTag: "Θεωρία & Δυναμική Επίλυση Προβλήματος",
    tryExercises: "Δοκίμασε τις Ασκήσεις",

    stepsTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsDesc: "Η μέθοδος των δύο βημάτων και πώς λύνουμε προβλήματα με κλάσματα χωρίς να μπερδευόμαστε.",

    // Βήμα 1
    step1Badge: "ΒΗΜΑ 1",
    step1Sub: "Ορισμός",
    step1Title: "Τι είναι Κλασματική Μονάδα;",
    step1Text: "Κλασματική μονάδα ονομάζεται κάθε κλάσμα που έχει αριθμητή το 1 (π.χ.",
    step1Desc: "Εκφράζει ένα μόνο από τα ίσα μέρη στα οποία χωρίσαμε την αρχική ποσότητα.",
    step1SubDesc: "Αν γνωρίζουμε την αξία αυτού του ενός μέρους, μπορούμε πανεύκολα να υπολογίσουμε οποιοδήποτε άλλο ποσό με έναν απλό πολλαπλασιασμό!",
    step1Key: "Το Κλειδί: Η κλασματική μονάδα αποτελεί το «σκαλοπάτι» για τη λύση κάθε σύνθετου προβλήματος.",

    // Βήμα 2
    step2Badge: "ΒΗΜΑ 2",
    step2Sub: "Πρώτο Στάδιο",
    step2Title: "Διαίρεση με τον Αριθμητή",
    step2Text: "Όταν γνωρίζουμε πόσο αξίζουν τα μέρη ενός ποσού, διαιρούμε τη γνωστή τιμή με τον αριθμητή για να βρούμε το 1 μέρος:",
    step2ExamplePrefix: "Αν τα",
    step2ExampleMid: "ενός οικοπέδου κοστίζουν",
    step2ExampleRes: "Άρα το",
    step2ExampleResSuffix: "του οικοπέδου κοστίζει 7.000 €.",
    step2Warning: "Διαιρούμε με τον αριθμητή γιατί η τιμή αντιστοιχεί σε τόσα ίσα κομμάτια όσα δηλώνει ο αριθμητής.",

    // Βήμα 3
    step3Badge: "ΒΗΜΑ 3",
    step3Sub: "Δεύτερο Στάδιο",
    step3Title: "Πολλαπλασιασμός με τον Παρονομαστή",
    step3Text: "Αφού βρούμε την αξία του 1 μέρους, πολλαπλασιάζουμε με τον παρονομαστή για να βρούμε ολόκληρο το ποσό:",
    step3ExamplePrefix: "Συνέχεια παραδείγματος: Αν το",
    step3ExampleMid: "κοστίζει 7.000 €:",
    step3ExampleRes: "Ολόκληρο το οικόπεδο (τα",
    step3ExampleResSuffix: ") κοστίζει 49.000 €.",
    step3Target: "Πολλαπλασιάζουμε με τον παρονομαστή γιατί η ακέραιη μονάδα αποτελείται από τόσα ίσα μέρη.",

    // Βήμα 4
    step4Badge: "ΒΗΜΑ 4",
    step4Sub: "Παραλλαγή",
    step4Title: "Από το Μέρος στο... Άλλο Μέρος!",
    step4Text: "Πολλές φορές δεν μας ζητείται το όλο, αλλά ένα διαφορετικό μέρος. Η μέθοδος παραμένει ακριβώς η ίδια!",
    step4ExamplePrefix: "Αν τα",
    step4ExampleMid: "μιας διαδρομής είναι 18 km, πόσο είναι τα",
    step4ExampleSuffix: ";",
    step4Step1: "1/5 ＝ 18 : 2 ＝ 9 km",
    step4Step2: "4/5 ＝ 9 · 4 ＝ 36 km",
    step4SubNote: "Πρώτα στο 1 μέρος (διαίρεση) και μετά στα ζητούμενα μέρη (πολλαπλασιασμός).",
    step4SummaryRule: "Σύνοψη Κανόνα: Γνωστή Τιμή : Αριθμητή · Ζητούμενα Μέρη.",

    // Εργαστήριο
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Πειραματικός Υπολογιστής Αναγωγής στη Μονάδα",
    labDesc: "Όρισε πόσα μέρη γνωρίζεις, σε πόσα μέρη χωρίστηκε το ποσό και την τιμή τους. Παρακολούθησε βήμα-βήμα την αυτόματη επίλυση στο διάγραμμα.",
    panelTitle: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
    knownPartsLabel: "Γνωστά μέρη (Αριθμητής):",
    totalPartsLabel: "Συνολικά μέρη (Παρονομαστής):",
    knownValueLabel: "Γνωστή Αξία των",
    canvasTitle: "ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΕΡΙΔΙΩΝ",
    legendUnit: "Κλασματική Μονάδα",
    legendKnown: "Γνωστά Μέρη",
    legendRemaining: "Υπόλοιπα Μέρη",
    step1CardTitle: "ΒΗΜΑ 1Ο • Η ΜΟΝΑΔΑ",
    step1CardDesc: "Διαιρούμε τη γνωστή τιμή με τον αριθμητή:",
    step2CardTitle: "ΒΗΜΑ 2Ο • ΤΟ ΟΛΟ",
    step2CardDesc: "Πολλαπλασιάζουμε το 1 μέρος με τον παρονομαστή:",
    conclusionStart: "🎯 Ολόκληρο το ποσό (",
    conclusionMid: ") αξίζει ακριβώς",
    calloutTitle: "Ώρα για Εξάσκηση στην Αναγωγή στη Μονάδα!",
    calloutDesc: "Λύσε απαιτητικά προβλήματα με χρήματα, βάρη, μήκη και ποσότητες, υπολογίζοντας πρώτα την κλασματική μονάδα.",
    calloutBtn: "Έναρξη Ασκήσεων",
    bottomFooterText: "Κεφάλαιο 4 • Αναγωγή στην Κλασματική Μονάδα",
    bottomFooterBtn: "Μετάβαση στις Ασκήσεις",
    knownTextSvg: "Γνωστό:",
    wholeAmountSvg: "ΟΛΟΚΛΗΡΟ ΤΟ ΠΟΣΟ"
  },
  en: {
    pageTitle: "Unitary Method with Fractions - Grade 5 | LearnMaths.gr",
    pageDesc: "Complete theory with examples on the unitary method with fractions, finding the whole from a given part, and interactive lab for Grade 5.",
    backText: "Grade 5",
    exercisesBtn: "Exercises",
    headerBadge: "CHAPTER 4 • GRADE 5",
    headerTitle: "Unitary Method with Fractions",
    headerDesc: "When we know the value of a fraction of a quantity and need to find the entire amount (or another part of it), the most powerful strategy is to first calculate the value of 1 part (unit fraction)!",
    interactiveTag: "Theory & Dynamic Problem Solving",
    tryExercises: "Try the Exercises",

    stepsTitle: "Core Concepts in 4 Steps",
    stepsDesc: "The two-step method and how to solve fraction word problems clearly and accurately.",

    // Step 1
    step1Badge: "STEP 1",
    step1Sub: "Definition",
    step1Title: "What is a Unit Fraction?",
    step1Text: "A unit fraction is any fraction that has a numerator of 1 (e.g.",
    step1Desc: "It represents a single equal part into which the entire quantity has been divided.",
    step1SubDesc: "Once we know the value of this single unit part, we can easily calculate any other quantity with a simple multiplication!",
    step1Key: "The Key: The unit fraction serves as the intermediate stepping stone to solve any multi-step problem.",

    // Step 2
    step2Badge: "STEP 2",
    step2Sub: "First Step",
    step2Title: "Divide by the Numerator",
    step2Text: "When we know the value of several parts, we divide the given value by the numerator to determine 1 part:",
    step2ExamplePrefix: "If",
    step2ExampleMid: "of a land plot costs",
    step2ExampleRes: "Therefore",
    step2ExampleResSuffix: "of the plot costs €7,000.",
    step2Warning: "We divide by the numerator because the known value corresponds to that exact number of equal pieces.",

    // Step 3
    step3Badge: "STEP 3",
    step3Sub: "Second Step",
    step3Title: "Multiply by the Denominator",
    step3Text: "After determining the value of 1 part, we multiply by the denominator to find the full quantity:",
    step3ExamplePrefix: "Example continuation: If",
    step3ExampleMid: "costs €7,000:",
    step3ExampleRes: "The entire land plot (",
    step3ExampleResSuffix: ") costs €49,000.",
    step3Target: "We multiply by the denominator because the complete unit is composed of that total number of equal parts.",

    // Step 4
    step4Badge: "STEP 4",
    step4Sub: "Variation",
    step4Title: "From One Part to... Another Part!",
    step4Text: "Often a problem asks for another specific fractional part rather than the total. The core strategy remains identical!",
    step4ExamplePrefix: "If",
    step4ExampleMid: "of a route is 18 km, how long is",
    step4ExampleSuffix: "?",
    step4Step1: "1/5 ＝ 18 : 2 ＝ 9 km",
    step4Step2: "4/5 ＝ 9 · 4 ＝ 36 km",
    step4SubNote: "First step: find 1 part (divide). Second step: multiply by the target number of parts.",
    step4SummaryRule: "Rule Summary: Known Value : Numerator · Target Parts.",

    // Lab
    labBadge: "INTERACTIVE LAB",
    labTitle: "Interactive Unitary Fraction Calculator",
    labDesc: "Set the known fraction terms and value. Watch the step-by-step resolution dynamically update across the bar model.",
    panelTitle: "PROBLEM DATA",
    knownPartsLabel: "Known parts (Numerator):",
    totalPartsLabel: "Total parts (Denominator):",
    knownValueLabel: "Known value of",
    canvasTitle: "VISUAL PARTITION MODEL",
    legendUnit: "Unit Fraction",
    legendKnown: "Known Parts",
    legendRemaining: "Remaining Parts",
    step1CardTitle: "STEP 1 • THE UNIT FRACTION",
    step1CardDesc: "Divide the known value by the numerator:",
    step2CardTitle: "STEP 2 • THE WHOLE",
    step2CardDesc: "Multiply the single unit part by the denominator:",
    conclusionStart: "🎯 The entire quantity (",
    conclusionMid: ") is worth exactly",
    calloutTitle: "Time to Practice the Unitary Method!",
    calloutDesc: "Solve challenging real-world word problems with money, weights, distances, and quantities by finding the unit fraction first.",
    calloutBtn: "Start Exercises",
    bottomFooterText: "Chapter 4 • Unitary Method with Fractions",
    bottomFooterBtn: "Go to Exercises",
    knownTextSvg: "Known:",
    wholeAmountSvg: "ENTIRE QUANTITY"
  }
};

export default function AnagogiTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  // Το κλάσμα του ποσού που γνωρίζουμε (π.χ. τα 3/5)
  const [num, setNum] = useState(3);
  const [den, setDen] = useState(5);

  // Η γνωστή αξία αυτών των μερών (σε €)
  const [knownValue, setKnownValue] = useState(60);

  const MIN_NUM = 2;
  const MIN_DEN = 3;
  const MAX_DEN = 10;
  const MIN_VALUE = 10;
  const MAX_VALUE = 400;

  // 1ο Βήμα: Αξία της κλασματικής μονάδας ( 1/den ) -> Διαίρεση με τον αριθμητή
  const unitValue = knownValue / num;

  // 2ο Βήμα: Αξία του όλου ( den/den ) -> Πολλαπλασιασμός με τον παρονομαστή
  const totalValue = unitValue * den;

  // Μορφοποίηση αριθμών
  const formatVal = (val) =>
    val.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', {
      minimumFractionDigits: Number.isInteger(val) ? 0 : 2,
      maximumFractionDigits: 2
    });

  // Σχεδίαση ενιαίας Responsive SVG Ράβδου Μεριδίων
  const renderFractionBarSvg = () => {
    const totalWidth = 600;
    const barHeight = 64;
    const startX = 10;
    const startY = 30;
    const usableWidth = totalWidth - 2 * startX;
    const partWidth = usableWidth / den;

    const parts = [];
    for (let i = 0; i < den; i++) {
      const isKnown = i < num;
      const isUnit = i === 0;
      const x = startX + i * partWidth;

      let fillClass = 'fill-slate-100';
      if (isUnit) fillClass = 'fill-amber-500';
      else if (isKnown) fillClass = 'fill-sky-500';

      parts.push(
        <g key={`bar-part-${i}`}>
          <rect
            x={x}
            y={startY}
            width={partWidth}
            height={barHeight}
            className={`${fillClass} stroke-slate-800 stroke-[2] transition-colors duration-200`}
          />
          {/* Κείμενο κλασματικής μονάδας */}
          <text
            x={x + partWidth / 2}
            y={startY + 26}
            textAnchor="middle"
            className={`font-mono font-black text-xs ${
              isKnown ? 'fill-white' : 'fill-slate-600'
            }`}
          >
            1/{den}
          </text>
          {/* Κείμενο αξίας μεριδίου */}
          <text
            x={x + partWidth / 2}
            y={startY + 48}
            textAnchor="middle"
            className={`font-mono font-bold text-[11px] ${
              isKnown ? 'fill-white/90' : 'fill-slate-400'
            }`}
          >
            {formatVal(unitValue)} €
          </text>
        </g>
      );
    }

    return (
      <svg
        viewBox={`0 0 ${totalWidth} 130`}
        className="w-full h-auto drop-shadow-sm select-none"
        aria-label="Fractional unit bar model visualization"
      >
        {/* Σχεδίαση των επιμέρους μεριδίων */}
        {parts}

        {/* Αγκύλη / Ένδειξη Γνωστού Μέρους (Από κάτω) */}
        <path
          d={`M ${startX} ${startY + barHeight + 8} L ${startX + num * partWidth} ${startY + barHeight + 8}`}
          className="stroke-sky-600 stroke-[3] fill-none"
        />
        <text
          x={startX + (num * partWidth) / 2}
          y={startY + barHeight + 26}
          textAnchor="middle"
          className="fill-sky-900 font-bold text-xs font-mono"
        >
          {t.knownTextSvg} {num}/{den} ＝ {formatVal(knownValue)} €
        </text>

        {/* Ένδειξη για το Όλο */}
        <text
          x={totalWidth / 2}
          y={18}
          textAnchor="middle"
          className="fill-slate-600 font-black text-xs tracking-wider font-mono"
        >
          {t.wholeAmountSvg} ({den}/{den}) ＝ {formatVal(totalValue)} €
        </text>
      </svg>
    );
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
          href="/e-dimotikou/04-anagogi-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.exercisesBtn}</span>
        </Link>
      }
    >
      {/* Full-width container για 2K & 4K */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 space-y-10 2xl:space-y-14 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.headerBadge)}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
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
              href="/e-dimotikou/04-anagogi-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base whitespace-nowrap"
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
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-w-0">
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
                  {t.step1Text}{' '}
                  <Fraction num={1} den={2} size="sm" className="text-sky-600" />,{' '}
                  <Fraction num={1} den={5} size="sm" className="text-sky-600" />,{' '}
                  <Fraction num={1} den={8} size="sm" className="text-sky-600" />).
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 leading-relaxed">
                    {t.step1Desc}
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {t.step1SubDesc}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium leading-relaxed">
                💡 {t.step1Key}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-w-0">
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
                  {t.step2Text}{' '}
                  <span className="whitespace-nowrap inline-flex items-center">
                    <Fraction num="α" den="β" size="sm" /> ➔ <Fraction num={1} den="β" size="sm" />
                  </span>.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 leading-relaxed">
                    {t.step2ExamplePrefix}{' '}
                    <Fraction num={3} den={7} size="sm" className="text-sky-700" />{' '}
                    {t.step2ExampleMid} <strong>21.000 €</strong>:
                  </p>
                  <div className="py-2 flex items-center justify-center font-mono font-black text-slate-900 text-sm sm:text-base bg-white p-2.5 rounded-xl border border-slate-300 shadow-inner whitespace-nowrap">
                    21.000 : 3 ＝ 7.000 €
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {t.step2ExampleRes}{' '}
                    <Fraction num={1} den={7} size="xs" />{' '}
                    {t.step2ExampleResSuffix}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium leading-relaxed">
                ⚡ {t.step2Warning}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-w-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Sub}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}{' '}
                  <span className="whitespace-nowrap inline-flex items-center">
                    <Fraction num="β" den="β" size="sm" /> ＝ 1
                  </span>.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 leading-relaxed">
                    {t.step3ExamplePrefix}{' '}
                    <Fraction num={1} den={7} size="sm" />{' '}
                    {t.step3ExampleMid}
                  </p>
                  <div className="py-2 flex items-center justify-center font-mono font-black text-slate-900 text-sm sm:text-base bg-white p-2.5 rounded-xl border border-slate-300 shadow-inner whitespace-nowrap">
                    7.000 · 7 ＝ 49.000 €
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {t.step3ExampleRes}{' '}
                    <Fraction num={7} den={7} size="xs" />{' '}
                    {t.step3ExampleResSuffix}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium leading-relaxed">
                🎯 {t.step3Target}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-w-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Sub}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 leading-relaxed">
                    {t.step4ExamplePrefix}{' '}
                    <Fraction num={2} den={5} size="sm" className="text-emerald-700" />{' '}
                    {t.step4ExampleMid}{' '}
                    <Fraction num={4} den={5} size="sm" className="text-emerald-700" />
                    {t.step4ExampleSuffix}
                  </p>
                  <ol className="list-decimal list-inside space-y-1 font-mono text-slate-800">
                    <li className="whitespace-nowrap">{t.step4Step1}</li>
                    <li className="whitespace-nowrap">{t.step4Step2}</li>
                  </ol>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {t.step4SubNote}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium leading-relaxed">
                🚀 <strong>{t.step4SummaryRule}</strong>
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΑΝΑΓΩΓΗΣ ΣΤΗ ΜΟΝΑΔΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8 min-w-0">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {toCleanUppercase(t.labBadge)}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.labDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start min-w-0">
            {/* Αριστερή Στήλη: Χειριστήρια */}
            <div className="xl:col-span-5 2xl:col-span-4 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200 min-w-0">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500 uppercase">
                {toCleanUppercase(t.panelTitle)}
              </h4>

              {/* Stepper Αριθμητή */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">
                    {t.knownPartsLabel}
                  </span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
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
                    aria-label="Known parts"
                    className="w-full min-w-0 max-w-full accent-sky-600 cursor-pointer"
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
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">
                    {t.totalPartsLabel}
                  </span>
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
                    aria-label="Total parts"
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

              {/* Stepper Γνωστής Αξίας */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800 flex items-center flex-wrap">
                    {t.knownValueLabel} <Fraction num={num} den={den} size="xs" />:
                  </span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    {knownValue} €
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease value by 10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setKnownValue((prev) => Math.max(MIN_VALUE, prev - 10));
                    }}
                    disabled={knownValue <= MIN_VALUE}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={MIN_VALUE}
                    max={MAX_VALUE}
                    step={5}
                    value={knownValue}
                    onChange={(e) => setKnownValue(Number(e.target.value))}
                    aria-label="Known value"
                    className="w-full min-w-0 max-w-full accent-emerald-500 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Increase value by 10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setKnownValue((prev) => Math.min(MAX_VALUE, prev + 10));
                    }}
                    disabled={knownValue >= MAX_VALUE}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα βοηθητικά κουμπιά */}
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  {[20, 50, 100, 150, 200].map((val) => (
                    <button
                      key={`btn-val-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setKnownValue(val);
                      }}
                      className={`text-xs 2xl:text-sm px-2 py-1 rounded-lg font-semibold transition ${
                        knownValue === val
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {val}€
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG Ράβδος & Βήματα */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 space-y-6 min-w-0">
              <div className="flex items-center justify-between text-xs sm:text-sm 2xl:text-base font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.canvasTitle)}</span>
                <span className="font-mono text-indigo-600 flex items-center">
                  <Fraction num={num} den={den} size="xs" /> ＝ {formatVal(knownValue)} €
                </span>
              </div>

              {/* Ενιαίο Responsive SVG Canvas */}
              <div className="w-full bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {renderFractionBarSvg()}
              </div>

              {/* Υπόμνημα Χρωμάτων */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs 2xl:text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-amber-500"></span>
                  <span className="text-slate-700 font-semibold flex items-center">
                    <Fraction num={1} den={den} size="xs" /> ({t.legendUnit})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-sky-500"></span>
                  <span className="text-slate-700 font-semibold">{t.legendKnown} ({num})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-400"></span>
                  <span className="text-slate-600 font-medium">{t.legendRemaining}</span>
                </div>
              </div>

              {/* Τα 2 Βήματα Υπολογισμού */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Βήμα 1: Κλασματική Μονάδα */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-xs font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md tracking-wider inline-flex items-center">
                    {t.step1CardTitle} (<Fraction num={1} den={den} size="xs" />)
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t.step1CardDesc}
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono font-black text-slate-900 text-sm sm:text-base text-center whitespace-nowrap">
                    {knownValue} : {num} ＝{' '}
                    <span className="text-amber-600">{formatVal(unitValue)} €</span>
                  </div>
                </div>

                {/* Βήμα 2: Το Όλο */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <span className="text-xs font-black text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md tracking-wider inline-flex items-center">
                    {t.step2CardTitle} (<Fraction num={den} den={den} size="xs" />)
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t.step2CardDesc}
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono font-black text-slate-900 text-sm sm:text-base text-center whitespace-nowrap">
                    {formatVal(unitValue)} · {den} ＝{' '}
                    <span className="text-indigo-600">{formatVal(totalValue)} €</span>
                  </div>
                </div>
              </div>

              {/* Τελικό Συμπέρασμα */}
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl text-center font-bold text-xs sm:text-sm 2xl:text-base shadow-sm flex items-center justify-center flex-wrap gap-1 leading-relaxed">
                <span>{t.conclusionStart}</span>
                <Fraction num={den} den={den} size="sm" />
                <span>{t.conclusionMid}</span>
                <span className="text-amber-300 font-black text-lg 2xl:text-xl font-mono ml-1 whitespace-nowrap">
                  {formatVal(totalValue)} €
                </span>
                !
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left min-w-0">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight break-words [overflow-wrap:anywhere]">
              {t.calloutTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.calloutDesc}
            </p>
          </div>

          <Link
            href="/e-dimotikou/04-anagogi-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto whitespace-nowrap"
          >
            <span>🎯 {t.calloutBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>

      {/* Σταθερό κάτω Footer */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm 2xl:text-base text-slate-300 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="font-semibold truncate">{t.bottomFooterText}</span>
          </div>
          <Link
            href="/e-dimotikou/04-anagogi-ask"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base transition active:scale-95 shadow-md whitespace-nowrap shrink-0"
          >
            <span>🎯 {t.bottomFooterBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </footer>
    </Layout>
  );
}
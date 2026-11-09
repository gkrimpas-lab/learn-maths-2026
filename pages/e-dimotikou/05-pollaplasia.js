// pages/e-dimotikou/05-pollaplasia.js
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
    pageTitle: "Πολλαπλάσια ενός Αριθμού - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Πλήρης θεωρία με παραδείγματα, συμβολισμό συνόλου Π(α), αριθμητική γραμμή αλμάτων και διαδραστική γεννήτρια πολλαπλασίων για την Ε' Δημοτικού.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    headerBadge: "ΚΕΦΑΛΑΙΟ 5 • Ε' ΔΗΜΟΤΙΚΟΥ",
    headerTitle: "Πολλαπλάσια ενός Αριθμού",
    headerDesc: "Ανακαλύπτουμε τι είναι τα πολλαπλάσια, πώς παράγονται με διαδοχικά άλματα, τον ειδικό ρόλο του μηδενός και τον τρόπο γραφής του συνόλου των πολλαπλασίων.",
    interactiveTag: "Θεωρία & Διαδραστική Γεννήτρια",
    tryExercises: "Δοκίμασε τις Ασκήσεις",

    stepsTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsDesc: "Όλα όσα πρέπει να γνωρίζεις για τα πολλαπλάσια των φυσικών αριθμών.",

    // Βήμα 1
    step1Badge: "ΒΗΜΑ 1",
    step1Sub: "Ορισμός",
    step1Title: "Τι είναι Πολλαπλάσιο;",
    step1Text: "Πολλαπλάσιο ενός φυσικού αριθμού ονομάζεται κάθε αριθμός που προκύπτει όταν πολλαπλασιάσουμε τον αριθμό αυτόν με οποιονδήποτε φυσικό αριθμό (0, 1, 2, 3, 4, ...).",
    step1Tip: "Κάθε αριθμός έχει άπειρα πολλαπλάσια, επειδή οι φυσικοί αριθμοί δεν τελειώνουν ποτέ!",

    // Βήμα 2
    step2Badge: "ΒΗΜΑ 2",
    step2Sub: "Ιδιότητες",
    step2Title: "Οι 2 Χρυσοί Κανόνες",
    step2Text: "Υπάρχουν δύο σταθερές ιδιότητες που ισχύουν για τα πολλαπλάσια οποιουδήποτε αριθμού:",
    step2Rule1Title: "1.",
    step2Rule1Text: "Το 0 είναι πολλαπλάσιο όλων των αριθμών (αφού α · 0 ＝ 0).",
    step2Rule2Title: "2.",
    step2Rule2Text: "Κάθε αριθμός είναι πολλαπλάσιο του εαυτού του (αφού α · 1 ＝ α).",
    step2Tip: "Μετά το 0, το μικρότερο μη μηδενικό πολλαπλάσιο ενός αριθμού είναι πάντα ο ίδιος ο αριθμός!",

    // Βήμα 3
    step3Badge: "ΒΗΜΑ 3",
    step3Sub: "Συμβολισμός",
    step3Title: "Πώς Γράφονται: Π(α)",
    step3Text: "Στα μαθηματικά συμβολίζουμε το σύνολο των πολλαπλασίων ενός αριθμού με το κεφαλαίο γράμμα Π και τον αριθμό σε παρένθεση.",
    step3ExamplePrefix: "Παράδειγμα για το 6:",
    step3DotsDesc: "Τα αποσιωπητικά (...) μέσα στα άγκιστρα δηλώνουν ότι η σειρά συνεχίζεται επ' άπειρον.",
    step3Tip: "Κάθε επόμενο πολλαπλάσιο προκύπτει προσθέτοντας σταθερά τον αριθμό βάσης (βήμα ＋α).",

    // Βήμα 4
    step4Badge: "ΒΗΜΑ 4",
    step4Sub: "Έλεγχος",
    step4Title: "Έλεγχος με Τέλεια Διαίρεση",
    step4Text: "Για να ελέγξουμε αν ένας μεγάλος αριθμός είναι πολλαπλάσιο ενός άλλου, εκτελούμε διαίρεση:",
    step4Question: "Είναι το 84 πολλαπλάσιο του 7;",
    step4Division: "84 : 7 ＝ 12 (Υπόλοιπο 0)",
    step4Explanation: "Επειδή η διαίρεση είναι τέλεια (υπόλοιπο 0), το 84 είναι πολλαπλάσιο του 7.",
    step4Tip: "Αν η διαίρεση αφήνει υπόλοιπο μεγαλύτερο του 0, ο αριθμός δεν είναι πολλαπλάσιο.",

    // Εργαστήριο
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Γεννήτρια & Άξονας Αλμάτων Πολλαπλασίων",
    labDesc: "Επίλεξε τον αριθμό βάσης και δες πώς γεννιούνται τα πολλαπλάσιά του στον άξονα και στον αναλυτικό πίνακα.",
    panelTitle: "ΕΠΙΛΟΓΗ ΑΡΙΘΜΟΥ",
    baseNumberLabel: "Αριθμός Βάσης:",
    showCountLabel: "Πλήθος στον Πίνακα:",
    termsWord: "όροι",
    setNotationTitle: "ΜΑΘΗΜΑΤΙΚΗ ΓΡΑΦΗ ΣΥΝΟΛΟΥ",
    setSymbol: "Π",
    numberLineTitle: "ΑΡΙΘΜΗΤΙΚΗ ΓΡΑΜΜΗ ΑΛΜΑΤΩΝ ( ΒΗΜΑ ＋",
    numberLineSuffix: " )",
    tableTitle: "ΑΝΑΛΥΤΙΚΟΣ ΠΙΝΑΚΑΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ",
    labCalloutPart1: "📢 Κάθε πολλαπλάσιο του",
    labCalloutPart2: "διαιρείται ακριβώς με το",
    labCalloutPart3: ", αφήνοντας υπόλοιπο 0!",

    // Callout & Footer
    calloutTitle: "Ώρα για Εξάσκηση στα Πολλαπλάσια!",
    calloutDesc: "Δοκίμασε τις γνώσεις σου σε απαιτητικές ασκήσεις εύρεσης πολλαπλασίων, ελέγχου διαιρετότητας και προβλήματα πραγματικής ζωής.",
    calloutBtn: "Έναρξη Ασκήσεων",
    bottomFooterText: "Κεφάλαιο 5 • Πολλαπλάσια ενός Αριθμού",
    bottomFooterBtn: "Μετάβαση στις Ασκήσεις"
  },
  en: {
    pageTitle: "Multiples of a Number - Grade 5 | LearnMaths.gr",
    pageDesc: "Complete theory with examples, set notation M(a), number line jumps, and interactive multiples generator for Grade 5.",
    backText: "Grade 5",
    exercisesBtn: "Exercises",
    headerBadge: "CHAPTER 5 • GRADE 5",
    headerTitle: "Multiples of a Number",
    headerDesc: "Discover what multiples are, how they are generated through consecutive jumps, the special role of zero, and how to write the set of multiples.",
    interactiveTag: "Theory & Interactive Generator",
    tryExercises: "Try the Exercises",

    stepsTitle: "Core Concepts in 4 Steps",
    stepsDesc: "Everything you need to know about the multiples of whole numbers.",

    // Step 1
    step1Badge: "STEP 1",
    step1Sub: "Definition",
    step1Title: "What is a Multiple?",
    step1Text: "A multiple of a whole number is any number obtained by multiplying that number by any whole number (0, 1, 2, 3, 4, ...).",
    step1Tip: "Every number has infinitely many multiples because whole numbers never end!",

    // Step 2
    step2Badge: "STEP 2",
    step2Sub: "Properties",
    step2Title: "The 2 Golden Rules",
    step2Text: "There are two fundamental properties that hold true for the multiples of every number:",
    step2Rule1Title: "1.",
    step2Rule1Text: "0 is a multiple of every number (since a · 0 ＝ 0).",
    step2Rule2Title: "2.",
    step2Rule2Text: "Every number is a multiple of itself (since a · 1 ＝ a).",
    step2Tip: "After 0, the smallest non-zero multiple of any number is always the number itself!",

    // Step 3
    step3Badge: "STEP 3",
    step3Sub: "Notation",
    step3Title: "How They Are Written: M(a)",
    step3Text: "In mathematics, we denote the set of multiples of a number using the capital letter M with the number in parentheses.",
    step3ExamplePrefix: "Example for 6:",
    step3DotsDesc: "The ellipsis (...) inside the brackets indicates that the sequence continues indefinitely.",
    step3Tip: "Each subsequent multiple is formed by constantly adding the base number (step ＋a).",

    // Step 4
    step4Badge: "STEP 4",
    step4Sub: "Verification",
    step4Title: "Verification with Exact Division",
    step4Text: "To verify whether a large number is a multiple of another, we perform division:",
    step4Question: "Is 84 a multiple of 7?",
    step4Division: "84 : 7 ＝ 12 (Remainder 0)",
    step4Explanation: "Since the division is exact (remainder 0), 84 is a multiple of 7.",
    step4Tip: "If the division leaves a remainder greater than 0, the number is not a multiple.",

    // Lab
    labBadge: "INTERACTIVE LAB",
    labTitle: "Multiples Generator & Jump Number Line",
    labDesc: "Select the base number to explore how its multiples are generated across the number line and in the comprehensive multiplication table.",
    panelTitle: "NUMBER SELECTION",
    baseNumberLabel: "Base Number:",
    showCountLabel: "Count in Table:",
    termsWord: "terms",
    setNotationTitle: "SET NOTATION",
    setSymbol: "M",
    numberLineTitle: "JUMP NUMBER LINE ( STEP ＋",
    numberLineSuffix: " )",
    tableTitle: "COMPREHENSIVE MULTIPLICATION TABLE",
    labCalloutPart1: "📢 Every multiple of",
    labCalloutPart2: "is divisible by",
    labCalloutPart3: ", leaving a remainder of 0!",

    // Callout & Footer
    calloutTitle: "Time to Practice Multiples!",
    calloutDesc: "Test your skills with challenging exercises covering finding multiples, checking divisibility, and solving real-world word problems.",
    calloutBtn: "Start Exercises",
    bottomFooterText: "Chapter 5 • Multiples of a Number",
    bottomFooterBtn: "Go to Exercises"
  }
};

export default function PollaplasiaTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  // Ο αριθμός βάσης για τον οποίο ψάχνουμε τα πολλαπλάσια
  const [baseNum, setBaseNum] = useState(4);
  const [showCount, setShowCount] = useState(12);

  const MIN_BASE = 2;
  const MAX_BASE = 20;

  // Δημιουργία πίνακα πολλαπλασιαστών από 0 έως showCount - 1
  const multipliers = Array.from({ length: showCount }, (_, i) => i);

  // Σχεδίαση Responsive SVG Αριθμητικής Γραμμής Αλμάτων
  const renderNumberLineSvg = () => {
    const totalWidth = 960;
    const height = 140;
    const startX = 40;
    const endX = 920;
    const stepsCount = Math.min(8, showCount - 1);
    const stepDist = (endX - startX) / stepsCount;
    const lineY = 100;

    const ticksAndArcs = [];

    for (let i = 0; i <= stepsCount; i++) {
      const currentVal = baseNum * i;
      const x = startX + i * stepDist;

      // Σημάδι άξονα
      ticksAndArcs.push(
        <g key={`tick-${i}`}>
          <circle cx={x} cy={lineY} r="5" className="fill-blue-600" />
          <text
            x={x}
            y={lineY + 24}
            textAnchor="middle"
            className="font-mono font-black text-xs sm:text-sm fill-slate-800"
          >
            {currentVal}
          </text>
        </g>
      );

      // Καμπύλη άλματος πολλαπλασιασμού
      if (i < stepsCount) {
        const nextX = startX + (i + 1) * stepDist;
        const midX = (x + nextX) / 2;
        const arcY = lineY - 48;
        const pathData = `M ${x} ${lineY - 4} Q ${midX} ${arcY} ${nextX} ${lineY - 4}`;

        ticksAndArcs.push(
          <g key={`arc-${i}`}>
            <path
              d={pathData}
              fill="none"
              className="stroke-amber-500 stroke-[2.5]"
            />
            <text
              x={midX}
              y={arcY + 6}
              textAnchor="middle"
              className="font-mono font-bold text-[11px] fill-amber-700"
            >
              ＋{baseNum}
            </text>
          </g>
        );
      }
    }

    return (
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="w-full h-auto drop-shadow-sm"
        aria-label={`Jump number line for multiples of ${baseNum}`}
      >
        {/* Κύρια γραμμή άξονα */}
        <line
          x1={startX - 15}
          y1={lineY}
          x2={endX + 15}
          y2={lineY}
          className="stroke-slate-400 stroke-2"
        />
        {/* Βέλος δεξιά */}
        <polygon
          points={`${endX + 22},${lineY} ${endX + 12},${lineY - 5} ${endX + 12},${lineY + 5}`}
          className="fill-slate-500"
        />
        {ticksAndArcs}
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
          href="/e-dimotikou/05-pollaplasia-ask"
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
              href="/e-dimotikou/05-pollaplasia-ask"
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div>4 · 0 ＝ <strong className="text-blue-600">0</strong></div>
                  <div>4 · 1 ＝ <strong className="text-blue-600">4</strong></div>
                  <div>4 · 2 ＝ <strong className="text-blue-600">8</strong></div>
                  <div>4 · 3 ＝ <strong className="text-blue-600">12</strong></div>
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Sub}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <div className="flex items-start gap-2">
                    <span className="font-black text-amber-600 shrink-0">{t.step2Rule1Title}</span>
                    <div>{t.step2Rule1Text}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-black text-amber-600 shrink-0">{t.step2Rule2Title}</span>
                    <div>{t.step2Rule2Text}</div>
                  </div>
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Sub}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">{t.step3ExamplePrefix}</p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono text-xs sm:text-sm text-indigo-950 shadow-inner">
                    {t.setSymbol}(6) ＝ {'{'} 0, 6, 12, 18, 24, 30, ... {'}'}
                  </div>
                  <p className="text-slate-500 text-xs">
                    {t.step3DotsDesc}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
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
                  <p className="text-slate-700">
                    {t.step4Question}
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-center text-emerald-800 shadow-inner">
                    {t.step4Division}
                  </div>
                  <p className="text-slate-600 text-xs">
                    {t.step4Explanation}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΟΛΛΑΠΛΑΣΙΩΝ */}
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

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Αριστερή Στήλη: Χειριστήρια με Touch Steppers */}
            <div className="xl:col-span-5 2xl:col-span-4 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500 uppercase">
                {toCleanUppercase(t.panelTitle)}
              </h4>

              {/* Stepper Αριθμού Βάσης */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.baseNumberLabel}</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                    {baseNum}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease base number by 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBaseNum((prev) => Math.max(MIN_BASE, prev - 1));
                    }}
                    disabled={baseNum <= MIN_BASE}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={MIN_BASE}
                    max={MAX_BASE}
                    step={1}
                    value={baseNum}
                    onChange={(e) => setBaseNum(Number(e.target.value))}
                    aria-label="Base Number"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Increase base number by 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBaseNum((prev) => Math.min(MAX_BASE, prev + 1));
                    }}
                    disabled={baseNum >= MAX_BASE}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά συνήθων αριθμών */}
                <div className="flex flex-wrap items-center justify-end gap-1.5 pt-1">
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((val) => (
                    <button
                      key={`btn-quick-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setBaseNum(val);
                      }}
                      className={`text-xs 2xl:text-sm px-2.5 py-1 rounded-lg font-semibold transition ${
                        baseNum === val
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Πλήθος Πολλαπλασίων για Προβολή */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.showCountLabel}</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-base 2xl:text-lg text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                    {showCount} {t.termsWord}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[6, 12, 18, 24].map((cnt) => (
                    <button
                      key={`btn-cnt-${cnt}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowCount(cnt);
                      }}
                      className={`flex-1 py-1.5 rounded-xl font-bold text-xs 2xl:text-sm transition ${
                        showCount === cnt
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Μαθηματικός Συμβολισμός Συνόλου */}
              <div className="p-4 2xl:p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <span className="text-xs font-black tracking-wider text-slate-400 uppercase">
                  {toCleanUppercase(t.setNotationTitle)}
                </span>
                <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs sm:text-sm 2xl:text-base leading-relaxed break-words shadow-inner">
                  <span className="text-white font-bold">{t.setSymbol}({baseNum}) ＝ </span>
                  <span>{'{ '}</span>
                  {multipliers.slice(0, 8).map((m, idx) => (
                    <span key={`set-${m}`}>
                      {baseNum * m}
                      {idx < 7 ? ', ' : ''}
                    </span>
                  ))}
                  <span className="text-slate-500 animate-pulse">, ... {'}'}</span>
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG Άξονας Αλμάτων & Πλέγμα Καρτών */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between text-xs sm:text-sm 2xl:text-base font-bold text-slate-500 px-1">
                <span>{t.numberLineTitle}{baseNum}{t.numberLineSuffix}</span>
                <span className="font-mono text-blue-600 font-bold">{t.setSymbol}({baseNum})</span>
              </div>

              {/* SVG Canvas Άξονα */}
              <div className="w-full bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {renderNumberLineSvg()}
              </div>

              {/* Πλέγμα Καρτών Πολλαπλασιασμού */}
              <div className="space-y-3 pt-2">
                <div className="text-xs 2xl:text-sm font-bold text-slate-500 px-1">
                  {toCleanUppercase(t.tableTitle)}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 gap-3">
                  {multipliers.map((m) => {
                    const result = baseNum * m;
                    return (
                      <div
                        key={`card-${m}`}
                        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-1.5 hover:border-blue-400 hover:shadow-md transition group"
                      >
                        <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors font-mono">
                          {baseNum} · {m}
                        </span>
                        <div className="w-full h-[1px] bg-slate-100"></div>
                        <span className="text-xl 2xl:text-2xl font-mono font-black text-slate-800 group-hover:scale-105 transition-transform">
                          {result}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="p-4 bg-emerald-600 text-white rounded-2xl text-center font-bold text-xs sm:text-sm 2xl:text-base shadow-sm">
                {t.labCalloutPart1} <span className="text-amber-300 font-black">{baseNum}</span> {t.labCalloutPart2} {baseNum}{t.labCalloutPart3}
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
            href="/e-dimotikou/05-pollaplasia-ask"
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
            href="/e-dimotikou/05-pollaplasia-ask"
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
// pages/e-dimotikou/09-krit-diaret.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση άτονων κεφαλαίων (διατηρεί το Ε')
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

// Component για κανονική εμφάνιση κλάσματος (αριθμητής πάνω, οριζόντια γραμμή, παρονομαστής κάτω)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="text-center px-1 pb-0.5 border-b-2 border-current w-full block text-[0.9em]">
        {num}
      </span>
      <span className="text-center px-1 pt-0.5 w-full block text-[0.9em]">
        {den}
      </span>
    </span>
  );
}

const LIMITS = {
  NUM_MIN: 1,
  NUM_MAX: 9999
};

const TRANSLATIONS = {
  el: {
    metaTitle: "Κριτήρια Διαιρετότητας - Ε' Δημοτικού | LearnMaths.gr",
    metaDesc: "Μάθετε τα κριτήρια διαιρετότητας για το 2, 3, 4, 5, 9, 10, 25, πώς ελέγχουμε μεγάλους αριθμούς χωρίς διαίρεση και δοκιμάστε το διαδραστικό εργαστήριο.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 9 • Ε' ΔΗΜΟΤΙΚΟΥ",
    mainTitle: "Κριτήρια Διαιρετότητας",
    mainSubtitle: "Ανακαλύπτουμε τους κανόνες με τους οποίους ελέγχουμε ακαριαία αν ένας αριθμός διαιρείται ακριβώς με το 2, 3, 4, 5, 9, 10, 25 χωρίς να χρειάζεται να εκτελέσουμε την κάθετη διαίρεση!",
    liveBadge: "Θεωρία & Ζωντανός Αναλυτής Αριθμών",
    tryExercisesBtn: "Δοκίμασε τις Ασκήσεις",

    stepsSectionTitle: "Βασικοί Κανόνες σε 4 Ομάδες",
    stepsSectionSubtitle: "Κατηγοριοποίηση των κριτηρίων ανάλογα με τη μέθοδο εξέτασης των ψηφίων.",

    step1Badge: "ΟΜΑΔΑ 1",
    step1Category: "Τελευταίο Ψηφίο",
    step1Title: "Κριτήρια για 2, 5 και 10",
    step1Text: "Σε αυτούς τους αριθμούς κοιτάμε μόνο το τελευταίο ψηφίο (τις μονάδες):",
    rule2Label: "Με το 2:",
    rule2Desc: "Αν λήγει σε 0, 2, 4, 6, 8 (άρτιος αριθμός).",
    rule5Label: "Με το 5:",
    rule5Desc: "Αν λήγει σε 0 ή 5.",
    rule10Label: "Με το 10:",
    rule10Desc: "Αν λήγει σε 0.",
    step1Tip: "Αν ένας αριθμός λήγει σε 0, διαιρείται ταυτόχρονα με το 2, το 5 και το 10!",

    step2Badge: "ΟΜΑΔΑ 2",
    step2Category: "Άθροισμα Ψηφίων",
    step2Title: "Κριτήρια για 3 και 9",
    step2Text: "Εδώ προσθέτουμε όλα τα ψηφία του αριθμού και ελέγχουμε το άθροισμα:",
    rule3Label: "Με το 3:",
    rule3Desc: "Αν το άθροισμα των ψηφίων του διαιρείται με το 3.",
    rule3Example: "π.χ. Για το 423: 4 ＋ 2 ＋ 3 ＝ 9 (διαιρείται με το 3).",
    rule9Label: "Με το 9:",
    rule9Desc: "Αν το άθροισμα των ψηφίων του διαιρείται με το 9.",
    rule9Example: "π.χ. Για το 738: 7 ＋ 3 ＋ 8 ＝ 18 (διαιρείται με το 9).",
    step2Tip: "Κάθε αριθμός που διαιρείται με το 9 διαιρείται πάντα και με το 3 (το αντίστροφο δεν ισχύει πάντα).",

    step3Badge: "ΟΜΑΔΑ 3",
    step3Category: "Δύο Τελευταία Ψηφία",
    step3Title: "Κριτήρια για 4 και 25",
    step3Text: "Κοιτάμε μόνο τον διψήφιο αριθμό που σχηματίζουν οι δεκάδες και οι μονάδες:",
    rule4Label: "Με το 4:",
    rule4Desc: "Αν τα 2 τελευταία ψηφία είναι 00 ή σχηματίζουν αριθμό που διαιρείται με το 4 (π.χ. 316, 524, 1.200).",
    rule25Label: "Με το 25:",
    rule25Desc: "Αν λήγει σε 00, 25, 50, 75 (π.χ. 375, 1.450, 2.000).",
    step3Tip: "Αγνοούμε όλα τα προηγούμενα ψηφία (εκατοντάδες, χιλιάδες) γιατί το 100 διαιρείται ακριβώς και με το 4 και με το 25!",

    step4Badge: "ΟΜΑΔΑ 4",
    step4Category: "Συνδυαστικοί Κανόνες",
    step4Title: "Σύνθετα Κριτήρια (π.χ. 6)",
    step4Text: "Όταν ένας αριθμός είναι γινόμενο δύο πρώτων μεταξύ τους παραγόντων, ελέγχουμε τα δύο κριτήρια ταυτόχρονα:",
    rule6Title: "Κριτήριο του 6 ( 2 · 3 ＝ 6 ):",
    rule6Desc: "Ένας αριθμός διαιρείται με το 6 αν είναι άρτιος (διαιρείται με το 2) ΚΑΙ το άθροισμα των ψηφίων του διαιρείται με το 3.",
    rule6Example: "π.χ. 354 ➔ Άρτιος (λήγει σε 4) ΚΑΙ 3 ＋ 5 ＋ 4 ＝ 12 ➔ Διαιρείται με το 6!",
    step4Tip: "Με τον ίδιο τρόπο, ένας αριθμός διαιρείται με το 15 αν διαιρείται ταυτόχρονα με το 3 και το 5!",

    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Ζωντανός Αναλυτής Κριτηρίων Διαιρετότητας",
    labSubtitle: "Επίλεξε ή άλλαξε έναν αριθμό και παρακολούθησε σε πραγματικό χρόνο την αυτόματη εφαρμογή όλων των κριτηρίων.",
    selectNumberTitle: "ΕΠΙΛΟΓΗ ΑΡΙΘΜΟΥ",
    checkNumberLabel: "Αριθμός για Έλεγχο:",
    decreaseAria: "Μείωση αριθμού κατά 1",
    increaseAria: "Αύξηση αριθμού κατά 1",
    anatomyTitle: "ΑΝΑΤΟΜΙΑ ΨΗΦΙΩΝ ΤΟΥ",
    lastDigitLabel: "Τελευταίο Ψηφίο:",
    lastTwoDigitsLabel: "Δύο Τελευταία Ψηφία:",
    sumDigitsLabel: "Άθροισμα Ψηφίων:",
    resultsTitle: "ΑΠΟΤΕΛΕΣΜΑΤΑ ΚΡΙΤΗΡΙΩΝ ΔΙΑΙΡΕΤΟΤΗΤΑΣ",
    numberPrefix: "Αριθμός:",

    crit2Title: "Διαίρεση με το 2",
    crit3Title: "Διαίρεση με το 3",
    crit4Title: "Διαίρεση με το 4",
    crit5Title: "Διαίρεση με το 5",
    crit6Title: "Διαίρεση με το 6",
    crit9Title: "Διαίρεση με το 9",
    crit10Title: "Διαίρεση με το 10",
    crit25Title: "Διαίρεση με το 25",

    yes: "✔ Ναι",
    no: "✖ Όχι",
    endsIn: "Λήγει σε",
    even: "άρτιος",
    odd: "περιττός",
    sumWord: "Άθροισμα:",
    divBy3Yes: "(διαιρείται με 3)",
    divBy3No: "(δεν διαιρείται)",
    lastTwoWord: "Τελευταία δύο:",
    divBy4Yes: "ακέραιος",
    divBy4No: "(δεν διαιρείται)",
    divBy5Yes: "(είναι 0 ή 5)",
    divBy5No: "(ούτε 0 ούτε 5)",
    divBy6Text: "Διαιρείται ταυτόχρονα με 2",
    andWord: "και 3",
    divBy9Yes: "(διαιρείται με 9)",
    divBy9No: "(δεν διαιρείται)",
    divBy10Yes: "(είναι 0)",
    divBy10No: "(διάφορο του 0)",
    divBy25Yes: "(λήγει σε 00, 25, 50, 75)",
    divBy25No: "(δεν διαιρείται)",

    ctaTitle: "Ώρα για Εξάσκηση στα Κριτήρια Διαιρετότητας!",
    ctaSubtitle: "Έλεγξε τις γνώσεις σου σε απαιτητικές ασκήσεις εύρεσης άγνωστων ψηφίων, συνδυαστικών κριτηρίων και αναγνώρισης διαιρετότητας.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    metaTitle: "Divisibility Rules - 5th Grade | LearnMaths.gr",
    metaDesc: "Master the divisibility rules for 2, 3, 4, 5, 9, 10, 25, learn how to check large numbers without long division, and explore the interactive lab.",
    backText: "5th Grade",
    exercisesBtn: "Exercises",
    chapterBadge: "CHAPTER 9 • 5TH GRADE",
    mainTitle: "Divisibility Rules",
    mainSubtitle: "Discover the rules that allow you to check instantly whether a number is divisible by 2, 3, 4, 5, 9, 10, 25 without performing long division!",
    liveBadge: "Theory & Live Number Analyzer",
    tryExercisesBtn: "Try Exercises",

    stepsSectionTitle: "Core Rules in 4 Groups",
    stepsSectionSubtitle: "Categorizing divisibility criteria according to digit inspection methods.",

    step1Badge: "GROUP 1",
    step1Category: "Last Digit",
    step1Title: "Rules for 2, 5, and 10",
    step1Text: "For these divisors, we only inspect the last digit (the units place):",
    rule2Label: "By 2:",
    rule2Desc: "If it ends in 0, 2, 4, 6, 8 (an even number).",
    rule5Label: "By 5:",
    rule5Desc: "If it ends in 0 or 5.",
    rule10Label: "By 10:",
    rule10Desc: "If it ends in 0.",
    step1Tip: "If a number ends in 0, it is simultaneously divisible by 2, 5, and 10!",

    step2Badge: "GROUP 2",
    step2Category: "Sum of Digits",
    step2Title: "Rules for 3 and 9",
    step2Text: "Here, we sum all digits of the number and check the total:",
    rule3Label: "By 3:",
    rule3Desc: "If the sum of its digits is divisible by 3.",
    rule3Example: "e.g. For 423: 4 ＋ 2 ＋ 3 ＝ 9 (divisible by 3).",
    rule9Label: "By 9:",
    rule9Desc: "If the sum of its digits is divisible by 9.",
    rule9Example: "e.g. For 738: 7 ＋ 3 ＋ 8 ＝ 18 (divisible by 9).",
    step2Tip: "Any number divisible by 9 is always divisible by 3 as well (the reverse is not always true).",

    step3Badge: "GROUP 3",
    step3Category: "Last Two Digits",
    step3Title: "Rules for 4 and 25",
    step3Text: "We examine only the two-digit number formed by the tens and units places:",
    rule4Label: "By 4:",
    rule4Desc: "If the last 2 digits are 00 or form a number divisible by 4 (e.g. 316, 524, 1,200).",
    rule25Label: "By 25:",
    rule25Desc: "If it ends in 00, 25, 50, or 75 (e.g. 375, 1,450, 2,000).",
    step3Tip: "We ignore all leading digits (hundreds, thousands) because 100 is perfectly divisible by both 4 and 25!",

    step4Badge: "GROUP 4",
    step4Category: "Composite Rules",
    step4Title: "Composite Divisibility (e.g. 6)",
    step4Text: "When a divisor is the product of two co-prime factors, we test both individual criteria simultaneously:",
    rule6Title: "Rule for 6 ( 2 · 3 ＝ 6 ):",
    rule6Desc: "A number is divisible by 6 if it is even (divisible by 2) AND the sum of its digits is divisible by 3.",
    rule6Example: "e.g. 354 ➔ Even (ends in 4) AND 3 ＋ 5 ＋ 4 ＝ 12 ➔ Divisible by 6!",
    step4Tip: "Similarly, a number is divisible by 15 if it is simultaneously divisible by 3 and 5!",

    labBadge: "INTERACTIVE LAB",
    labTitle: "Live Divisibility Rules Analyzer",
    labSubtitle: "Select or adjust a number to watch the real-time application of all divisibility rules.",
    selectNumberTitle: "CHOOSE NUMBER",
    checkNumberLabel: "Number to Test:",
    decreaseAria: "Decrease number by 1",
    increaseAria: "Increase number by 1",
    anatomyTitle: "DIGIT ANATOMY OF",
    lastDigitLabel: "Last Digit:",
    lastTwoDigitsLabel: "Last Two Digits:",
    sumDigitsLabel: "Sum of Digits:",
    resultsTitle: "DIVISIBILITY RULES RESULTS",
    numberPrefix: "Number:",

    crit2Title: "Division by 2",
    crit3Title: "Division by 3",
    crit4Title: "Division by 4",
    crit5Title: "Division by 5",
    crit6Title: "Division by 6",
    crit9Title: "Division by 9",
    crit10Title: "Division by 10",
    crit25Title: "Division by 25",

    yes: "✔ Yes",
    no: "✖ No",
    endsIn: "Ends in",
    even: "even",
    odd: "odd",
    sumWord: "Sum:",
    divBy3Yes: "(divisible by 3)",
    divBy3No: "(not divisible)",
    lastTwoWord: "Last two:",
    divBy4Yes: "integer",
    divBy4No: "(not divisible)",
    divBy5Yes: "(is 0 or 5)",
    divBy5No: "(neither 0 nor 5)",
    divBy6Text: "Divisible simultaneously by 2",
    andWord: "and 3",
    divBy9Yes: "(divisible by 9)",
    divBy9No: "(not divisible)",
    divBy10Yes: "(is 0)",
    divBy10No: "(different from 0)",
    divBy25Yes: "(ends in 00, 25, 50, 75)",
    divBy25No: "(not divisible)",

    ctaTitle: "Time to Practice Divisibility Rules!",
    ctaSubtitle: "Test your skills with missing digit problems, composite divisibility challenges, and quick divisibility recognition.",
    ctaBtn: "Start Exercises"
  }
};

export default function KritiriaDiairetisisTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [num, setNum] = useState(124);

  // Ανάλυση ψηφίων
  const numStr = Math.max(1, Math.abs(num || 1)).toString();
  const lastDigit = parseInt(numStr[numStr.length - 1], 10);
  const lastTwoDigits = numStr.length > 1 ? parseInt(numStr.slice(-2), 10) : parseInt(numStr, 10);

  const digitsArray = numStr.split('').map(Number);
  const digitsSum = digitsArray.reduce((acc, curr) => acc + curr, 0);

  // Έλεγχοι κριτηρίων διαιρετότητας
  const divBy2 = num % 2 === 0;
  const divBy3 = num % 3 === 0;
  const divBy4 = num % 4 === 0;
  const divBy5 = num % 5 === 0;
  const divBy9 = num % 9 === 0;
  const divBy10 = num % 10 === 0;
  const divBy6 = divBy2 && divBy3;
  const divBy25 = num % 25 === 0;

  const formatNum = (val) =>
    val.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/09-krit-diaret-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.exercisesBtn}</span>
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K & 4K και responsive για κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 2xl:space-y-14">
        
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
              {t.mainSubtitle}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.liveBadge}</span>
            </div>
            <Link
              href="/e-dimotikou/09-krit-diaret-ask"
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
                    {toCleanUppercase(t.step1Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step1Category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base">
                  <div>
                    <strong className="text-blue-700 font-mono font-black">{t.rule2Label}</strong> {t.rule2Desc}
                  </div>
                  <div>
                    <strong className="text-emerald-700 font-mono font-black">{t.rule5Label}</strong> {t.rule5Desc}
                  </div>
                  <div>
                    <strong className="text-amber-700 font-mono font-black">{t.rule10Label}</strong> {t.rule10Desc}
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
                    {t.step2Category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div>
                    <strong className="text-blue-700 font-sans">{t.rule3Label}</strong> {t.rule3Desc}
                  </div>
                  <div className="text-slate-500 text-xs font-sans">
                    {t.rule3Example}
                  </div>
                  <div className="pt-1">
                    <strong className="text-indigo-700 font-sans">{t.rule9Label}</strong> {t.rule9Desc}
                  </div>
                  <div className="text-slate-500 text-xs font-sans">
                    {t.rule9Example}
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
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step3Category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base">
                  <div>
                    <strong className="text-purple-700 font-mono font-black">{t.rule4Label}</strong> {t.rule4Desc}
                  </div>
                  <div>
                    <strong className="text-emerald-700 font-mono font-black">{t.rule25Label}</strong> {t.rule25Desc}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step4Category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">{t.rule6Title}</p>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {t.rule6Desc}
                  </p>
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-mono text-xs text-center font-bold text-slate-800">
                    {t.rule6Example}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΚΡΙΤΗΡΙΩΝ ΔΙΑΙΡΕΤΟΤΗΤΑΣ */}
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

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Αριστερή Στήλη: Χειριστήριο Εισαγωγής & Ανατομία Αριθμού */}
            <div className="xl:col-span-5 2xl:col-span-4 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                {toCleanUppercase(t.selectNumberTitle)}
              </h4>

              {/* Stepper Αριθμού */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.checkNumberLabel}</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                    {formatNum(num)}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.decreaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.max(LIMITS.NUM_MIN, prev - 1));
                    }}
                    disabled={num <= LIMITS.NUM_MIN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={LIMITS.NUM_MIN}
                    max={LIMITS.NUM_MAX}
                    step={1}
                    value={num}
                    onChange={(e) => setNum(Number(e.target.value))}
                    aria-label={t.checkNumberLabel}
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.increaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.min(LIMITS.NUM_MAX, prev + 1));
                    }}
                    disabled={num >= LIMITS.NUM_MAX}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά άλματος */}
                <div className="flex flex-wrap items-center justify-end gap-1.5 pt-1">
                  {[24, 75, 120, 248, 540, 789, 900, 1025].map((val) => (
                    <button
                      key={`quick-btn-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setNum(val);
                      }}
                      className={`text-xs 2xl:text-sm px-2.5 py-1 rounded-lg font-semibold transition ${
                        num === val
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {formatNum(val)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτα Ανατομίας Ψηφίων */}
              <div className="p-4 2xl:p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <span className="text-xs font-black tracking-wider text-slate-400">
                  {toCleanUppercase(t.anatomyTitle)} {formatNum(num)}
                </span>

                <div className="space-y-2 text-xs sm:text-sm font-mono">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-sans font-medium">{t.lastDigitLabel}</span>
                    <strong className="text-blue-700 text-base">{lastDigit}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-sans font-medium">{t.lastTwoDigitsLabel}</span>
                    <strong className="text-purple-700 text-base">{lastTwoDigits}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-sans font-medium">{t.sumDigitsLabel}</span>
                    <strong className="text-emerald-700 text-base">
                      {digitsArray.join(' ＋ ')} ＝ {digitsSum}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: Πλέγμα Ελέγχων Κριτηρίων */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between text-xs sm:text-sm 2xl:text-base font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.resultsTitle)}</span>
                <span className="font-mono text-slate-700">{t.numberPrefix} {formatNum(num)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
                {/* Κριτήριο του 2 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy2 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">{t.crit2Title}</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy2 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy2 ? t.yes : t.no}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    {t.endsIn} <strong className="text-slate-900">{lastDigit}</strong> ({divBy2 ? t.even : t.odd}).
                  </div>
                </div>

                {/* Κριτήριο του 3 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy3 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">{t.crit3Title}</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy3 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy3 ? t.yes : t.no}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    {t.sumWord} <strong className="text-slate-900">{digitsSum}</strong> {divBy3 ? t.divBy3Yes : t.divBy3No}.
                  </div>
                </div>

                {/* Κριτήριο του 4 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy4 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">{t.crit4Title}</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy4 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy4 ? t.yes : t.no}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono flex items-center flex-wrap gap-1">
                    <span>{t.lastTwoWord} <strong className="text-slate-900">{lastTwoDigits}</strong> :</span>
                    {divBy4 ? (
                      <span className="inline-flex items-center">
                        <Fraction num={lastTwoDigits} den="4" />
                        <span>＝ {lastTwoDigits / 4}</span>
                      </span>
                    ) : (
                      <span>{t.divBy4No}</span>
                    )}
                  </div>
                </div>

                {/* Κριτήριο του 5 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy5 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">{t.crit5Title}</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy5 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy5 ? t.yes : t.no}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    {t.endsIn} <strong className="text-slate-900">{lastDigit}</strong> {divBy5 ? t.divBy5Yes : t.divBy5No}.
                  </div>
                </div>

                {/* Κριτήριο του 6 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy6 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">{t.crit6Title}</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy6 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy6 ? t.yes : t.no}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    {t.divBy6Text} {divBy2 ? '(✔)' : '(✖)'} {t.andWord} {divBy3 ? '(✔)' : '(✖)'}.
                  </div>
                </div>

                {/* Κριτήριο του 9 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy9 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">{t.crit9Title}</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy9 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy9 ? t.yes : t.no}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    {t.sumWord} <strong className="text-slate-900">{digitsSum}</strong> {divBy9 ? t.divBy9Yes : t.divBy9No}.
                  </div>
                </div>

                {/* Κριτήριο του 10 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy10 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">{t.crit10Title}</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy10 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy10 ? t.yes : t.no}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    {t.endsIn} <strong className="text-slate-900">{lastDigit}</strong> {divBy10 ? t.divBy10Yes : t.divBy10No}.
                  </div>
                </div>

                {/* Κριτήριο του 25 */}
                <div
                  className={`p-4 2xl:p-5 rounded-2xl border transition bg-white flex flex-col justify-between space-y-3 shadow-sm ${
                    divBy25 ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm 2xl:text-base text-slate-900">{t.crit25Title}</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        divBy25 ? 'bg-emerald-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {divBy25 ? t.yes : t.no}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed font-mono">
                    {t.lastTwoWord} <strong className="text-slate-900">{lastTwoDigits}</strong> {divBy25 ? t.divBy25Yes : t.divBy25No}.
                  </div>
                </div>
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
            href="/e-dimotikou/09-krit-diaret-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {t.ctaBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
// pages/e-dimotikou/07-diairetes.js
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

// Component για κανονική εμφάνιση κλάσματος (αριθμητής, οριζόντια γραμμή, παρονομαστής)
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
  BASE_MIN: 2,
  BASE_MAX: 48
};

const TRANSLATIONS = {
  el: {
    metaTitle: "Διαιρέτες ενός Αριθμού - Ε' Δημοτικού | LearnMaths.gr",
    metaDesc: "Πλήρης θεωρία με παραδείγματα για τους διαιρέτες φυσικών αριθμών, το σύμβολο Δ(α), τη μέθοδο των ζευγών, πρώτους και σύνθετους αριθμούς.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 7 • Ε' ΔΗΜΟΤΙΚΟΥ",
    mainTitle: "Διαιρέτες ενός Αριθμού",
    mainSubtitle: "Ανακαλύπτουμε ποιους αριθμούς ονομάζουμε διαιρέτες, γιατί το πλήθος τους είναι πάντα συγκεκριμένο και πεπερασμένο, πώς τους βρίσκουμε γρήγορα με ζεύγη γινομένων και πότε ένας αριθμός λέγεται πρώτος.",
    liveBadge: "Θεωρία & Διαδραστικός Έλεγχος Διαιρετών",
    tryExercisesBtn: "Δοκίμασε τις Ασκήσεις",

    stepsSectionTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsSectionSubtitle: "Η μαθηματική δομή των διαιρετών και οι κανόνες εντοπισμού τους.",

    step1Badge: "ΒΗΜΑ 1",
    step1Category: "Ορισμός",
    step1Title: "Τι είναι Διαιρέτης;",
    step1Text: "Διαιρέτης ενός φυσικού αριθμού ονομάζεται κάθε φυσικός αριθμός που τον διαιρεί τέλεια, δηλαδή η διαίρεση (ή το αντίστοιχο κλάσμα) δίνει ακέραιο αποτέλεσμα με υπόλοιπο 0.",
    remZeroDivisor: "υπόλοιπο 0 ➔ το 1 είναι διαιρέτης",
    remZeroDivisor3: "υπόλοιπο 0 ➔ το 3 είναι διαιρέτης",
    remTwoNotDivisor: "υπόλοιπο 2 ➔ το 5 δεν είναι",
    step1Tip: "Αντίθετα με τα πολλαπλάσια που είναι άπειρα, οι διαιρέτες ενός αριθμού είναι πάντα συγκεκριμένοι (πεπερασμένοι).",

    step2Badge: "ΒΗΜΑ 2",
    step2Category: "Ιδιότητες",
    step2Title: "Οι 2 Απαράβατοι Κανόνες",
    step2Text: "Για κάθε φυσικό αριθμό μεγαλύτερο του 1 ισχύουν δύο θεμελιώδεις κανόνες:",
    rule1Text: "Ο αριθμός 1 είναι διαιρέτης όλων των φυσικών αριθμών.",
    rule2Text: "Κάθε αριθμός έχει ως μεγαλύτερο διαιρέτη τον ίδιο του τον εαυτό.",
    step2Tip: "Κανένας αριθμός δεν μπορεί να έχει διαιρέτη μεγαλύτερο από τον εαυτό του!",

    step3Badge: "ΒΗΜΑ 3",
    step3Category: "Στρατηγική",
    step3Title: "Μέθοδος Ζευγών Γινομένου",
    step3Text: "Για να μην ξεχάσουμε κανέναν διαιρέτη, ψάχνουμε ποια ζευγάρια αριθμών πολλαπλασιαζόμενα δίνουν τον αριθμό βάσης:",
    forExampleDivisors: "Για το 18:",
    step3Tip: "Βρίσκοντας έναν διαιρέτη, βρίσκουμε αυτόματα και το «ταίρι» του από τη διαίρεση!",

    step4Badge: "ΒΗΜΑ 4",
    step4Category: "Διάκριση",
    step4Title: "Πρώτοι & Σύνθετοι Αριθμοί",
    step4Text: "Ανάλογα με το πόσους διαιρέτες έχει ένας φυσικός αριθμός, κατατάσσεται σε μία από τις δύο κατηγορίες:",
    primeLabel: "Πρώτος:",
    primeDesc: "Έχει ακριβώς 2 διαιρέτες (το 1 και τον εαυτό του, π.χ. 2, 3, 5, 7, 11, 13).",
    compositeLabel: "Σύνθετος:",
    compositeDesc: "Έχει περισσότερους από 2 διαιρέτες (π.χ. 4, 6, 8, 9, 10, 12).",
    step4Tip: "Ο αριθμός 1 δεν είναι ούτε πρώτος ούτε σύνθετος, γιατί έχει μόνο 1 διαιρέτη (τον εαυτό του).",

    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Εξερεύνηση Διαιρετών & Ζευγών Γινομένου",
    labSubtitle: "Επίλεξε έναν αριθμό και παρατήρησε τις δοκιμές διαιρέσεων, τα ζεύγη παραγόντων και αν ο αριθμός είναι πρώτος ή σύνθετος.",
    selectNumberTitle: "ΕΠΙΛΟΓΗ ΑΡΙΘΜΟΥ",
    checkNumberLabel: "Αριθμός για Έλεγχο:",
    decreaseAria: "Μείωση αριθμού κατά 1",
    increaseAria: "Αύξηση αριθμού κατά 1",
    mathIdentityTitle: "ΜΑΘΗΜΑΤΙΚΗ ΤΑΥΤΟΤΗΤΑ",
    primeBadge: "Πρώτος Αριθμός",
    compositeBadge: "Σύνθετος Αριθμός",
    divisorsSymbol: "Δ",
    totalDivisorsPrefix: "Σύνολο διαιρετών:",
    factorPairsTitle: "ΖΕΥΓΑΡΙΑ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ",
    gridCheckTitlePrefix: "ΕΛΕΓΧΟΣ ΟΛΩΝ ΤΩΝ ΔΙΑΙΡΕΣΕΩΝ ( 1 ΕΩΣ",
    gridCheckTitleSuffix: ")",
    perfectDivisionsSuffix: "τέλειες διαιρέσεις",
    remPrefix: "Υπ:",
    congratsCallout1: "Οι πράσινες κάρτες δείχνουν τους",
    congratsCallout2: "μοναδικούς αριθμούς που διαιρούν ακριβώς το",
    congratsCallout3: "χωρίς υπόλοιπο!",

    ctaTitle: "Ώρα για Εξάσκηση στους Διαιρέτες!",
    ctaSubtitle: "Έλεγξε τις δυνάμεις σου σε απαιτητικές ασκήσεις εύρεσης διαιρετών, αναγνώρισης πρώτων και σύνθετων αριθμών, και πρακτικά προβλήματα ισοκατανομής.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    metaTitle: "Divisors of a Number - 5th Grade | LearnMaths.gr",
    metaDesc: "Complete theory with examples on divisors of natural numbers, the D(n) notation, the factor pairs method, prime, and composite numbers.",
    backText: "5th Grade",
    exercisesBtn: "Exercises",
    chapterBadge: "CHAPTER 7 • 5TH GRADE",
    mainTitle: "Divisors of a Number",
    mainSubtitle: "Discover which numbers are called divisors, why their count is always finite, how to find them quickly using factor pairs, and when a number is called prime.",
    liveBadge: "Theory & Interactive Divisors Lab",
    tryExercisesBtn: "Try Exercises",

    stepsSectionTitle: "Core Concepts in 4 Steps",
    stepsSectionSubtitle: "The mathematical structure of divisors and strategies for identifying them.",

    step1Badge: "STEP 1",
    step1Category: "Definition",
    step1Title: "What is a Divisor?",
    step1Text: "A divisor (or factor) of a natural number is any natural number that divides it completely, meaning the division (or fraction) results in an exact integer with a remainder of 0.",
    remZeroDivisor: "remainder 0 ➔ 1 is a divisor",
    remZeroDivisor3: "remainder 0 ➔ 3 is a divisor",
    remTwoNotDivisor: "remainder 2 ➔ 5 is NOT",
    step1Tip: "Unlike multiples which are infinite, the divisors of a number are always finite and specific.",

    step2Badge: "STEP 2",
    step2Category: "Properties",
    step2Title: "The 2 Golden Rules",
    step2Text: "For every natural number greater than 1, two fundamental rules always hold:",
    rule1Text: "The number 1 is a divisor of all natural numbers.",
    rule2Text: "Every number has itself as its greatest divisor.",
    step2Tip: "No number can ever have a divisor greater than itself!",

    step3Badge: "STEP 3",
    step3Category: "Strategy",
    step3Title: "The Factor Pairs Method",
    step3Text: "To avoid missing any divisor, we look for pairs of numbers whose product equals the base number:",
    forExampleDivisors: "For 18:",
    step3Tip: "Finding one divisor immediately reveals its complementary partner from the division!",

    step4Badge: "STEP 4",
    step4Category: "Classification",
    step4Title: "Prime & Composite Numbers",
    step4Text: "Depending on how many divisors a natural number has, it falls into one of two categories:",
    primeLabel: "Prime:",
    primeDesc: "Has exactly 2 divisors (1 and itself, e.g. 2, 3, 5, 7, 11, 13).",
    compositeLabel: "Composite:",
    compositeDesc: "Has more than 2 divisors (e.g. 4, 6, 8, 9, 10, 12).",
    step4Tip: "The number 1 is neither prime nor composite, as it has only 1 divisor (itself).",

    labBadge: "INTERACTIVE LAB",
    labTitle: "Divisors & Factor Pairs Explorer",
    labSubtitle: "Pick a number to examine its test divisions, factor pairs, and whether it is prime or composite.",
    selectNumberTitle: "CHOOSE NUMBER",
    checkNumberLabel: "Number to Test:",
    decreaseAria: "Decrease number by 1",
    increaseAria: "Increase number by 1",
    mathIdentityTitle: "MATHEMATICAL IDENTITY",
    primeBadge: "Prime Number",
    compositeBadge: "Composite Number",
    divisorsSymbol: "D",
    totalDivisorsPrefix: "Total divisors:",
    factorPairsTitle: "MULTIPLICATION PAIRS",
    gridCheckTitlePrefix: "TESTING ALL DIVISIONS ( 1 TO",
    gridCheckTitleSuffix: ")",
    perfectDivisionsSuffix: "exact divisions",
    remPrefix: "Rem:",
    congratsCallout1: "The green cards highlight the",
    congratsCallout2: "unique numbers that divide",
    congratsCallout3: "evenly with no remainder!",

    ctaTitle: "Time to Practice Divisors!",
    ctaSubtitle: "Put your skills to the test with divisor identification, prime vs. composite classifications, and practical grouping word problems.",
    ctaBtn: "Start Exercises"
  }
};

export default function DiairetesTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Ο αριθμός για τον οποίο ψάχνουμε τους διαιρέτες
  const [baseNum, setBaseNum] = useState(12);

  // Δημιουργία πίνακα όλων των αριθμών από το 1 έως τον ίδιο τον αριθμό
  const potentialDivisors = Array.from({ length: baseNum }, (_, i) => i + 1);

  // Φιλτράρισμα πραγματικών διαιρετών (υπόλοιπο 0)
  const realDivisors = potentialDivisors.filter((d) => baseNum % d === 0);

  // Εύρεση ζευγών γινομένου (π.χ. για 12: 1·12, 2·6, 3·4)
  const factorPairs = [];
  for (let i = 1; i <= Math.floor(Math.sqrt(baseNum)); i++) {
    if (baseNum % i === 0) {
      factorPairs.push([i, baseNum / i]);
    }
  }

  // Έλεγχος αν ο αριθμός είναι πρώτος
  const isPrime = realDivisors.length === 2;

  const formatNum = (num) =>
    num.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/07-diairetes-ask"
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
              href="/e-dimotikou/07-diairetes-ask"
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="flex items-center flex-wrap gap-1">
                    <Fraction num="12" den="1" />
                    <span>＝ 12</span>
                    <span className="font-sans text-slate-500 text-xs ml-1 font-normal">({t.remZeroDivisor})</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-1">
                    <Fraction num="12" den="3" />
                    <span>＝ 4</span>
                    <span className="font-sans text-slate-500 text-xs ml-1 font-normal">({t.remZeroDivisor3})</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-1">
                    <Fraction num="12" den="5" />
                    <span>＝ 2</span>
                    <span className="font-sans text-slate-500 text-xs ml-1 font-normal">({t.remTwoNotDivisor})</span>
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <div className="flex items-start gap-2">
                    <span className="font-black text-amber-600 shrink-0">1.</span>
                    <div>
                      {t.rule1Text}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-black text-amber-600 shrink-0">2.</span>
                    <div>
                      {t.rule2Text}
                    </div>
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <p className="text-slate-700 font-sans font-semibold">{t.forExampleDivisors}</p>
                  <div>1 · 18 ＝ 18</div>
                  <div>2 · 9 ＝ 18</div>
                  <div>3 · 6 ＝ 18</div>
                  <div className="pt-2 border-t border-slate-200 text-indigo-900 font-bold">
                    {t.divisorsSymbol}(18) ＝ {'{'} 1, 2, 3, 6, 9, 18 {'}'}
                  </div>
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

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <strong>{t.primeLabel}</strong> {t.primeDesc}
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    <strong>{t.compositeLabel}</strong> {t.compositeDesc}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚠️ {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΔΙΑΙΡΕΤΩΝ */}
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
            {/* Αριστερή Στήλη: Stepper & Σύνολο Διαιρετών */}
            <div className="xl:col-span-5 2xl:col-span-4 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                {toCleanUppercase(t.selectNumberTitle)}
              </h4>

              {/* Stepper Αριθμού Βάσης */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.checkNumberLabel}</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                    {formatNum(baseNum)}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.decreaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBaseNum((prev) => Math.max(LIMITS.BASE_MIN, prev - 1));
                    }}
                    disabled={baseNum <= LIMITS.BASE_MIN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={LIMITS.BASE_MIN}
                    max={LIMITS.BASE_MAX}
                    step={1}
                    value={baseNum}
                    onChange={(e) => setBaseNum(Number(e.target.value))}
                    aria-label={t.checkNumberLabel}
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.increaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBaseNum((prev) => Math.min(LIMITS.BASE_MAX, prev + 1));
                    }}
                    disabled={baseNum >= LIMITS.BASE_MAX}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά συνήθων αριθμών */}
                <div className="flex flex-wrap items-center justify-end gap-1.5 pt-1">
                  {[6, 8, 12, 16, 18, 20, 24, 30, 36, 48].map((val) => (
                    <button
                      key={`btn-num-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setBaseNum(val);
                      }}
                      className={`text-xs 2xl:text-sm px-2 py-1 rounded-lg font-semibold transition ${
                        baseNum === val
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {formatNum(val)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Μαθηματική Ταυτότητα του Αριθμού */}
              <div className="p-4 2xl:p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-wider text-slate-400">
                    {toCleanUppercase(t.mathIdentityTitle)}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      isPrime
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-purple-50 text-purple-800 border-purple-300'
                    }`}
                  >
                    {isPrime ? t.primeBadge : t.compositeBadge}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs sm:text-sm 2xl:text-base leading-relaxed break-words shadow-inner">
                  <span className="text-white font-bold">{t.divisorsSymbol}({formatNum(baseNum)}) ＝ </span>
                  <span>{'{ '}</span>
                  {realDivisors.map((d, idx) => (
                    <span key={`set-d-${d}`}>
                      <strong className="text-amber-300 font-bold">{formatNum(d)}</strong>
                      {idx < realDivisors.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  <span>{' }'}</span>
                </div>

                <div className="text-xs text-slate-600 pt-1">
                  {t.totalDivisorsPrefix} <strong className="text-slate-900 font-mono">{formatNum(realDivisors.length)}</strong>
                </div>
              </div>

              {/* Ζεύγη Γινομένου */}
              <div className="p-4 2xl:p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <span className="text-xs font-black tracking-wider text-slate-400">
                  {toCleanUppercase(t.factorPairsTitle)}
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs sm:text-sm">
                  {factorPairs.map(([a, b], idx) => (
                    <div
                      key={`pair-${idx}`}
                      className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center font-bold text-slate-800"
                    >
                      {formatNum(a)} · {formatNum(b)} ＝ {formatNum(baseNum)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: Πλέγμα Ελέγχου Όλων των Διαιρέσεων */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between text-xs sm:text-sm 2xl:text-base font-bold text-slate-500 px-1">
                <span>
                  {toCleanUppercase(t.gridCheckTitlePrefix)} 1 {toCleanUppercase(locale === 'el' ? 'ΕΩΣ' : 'TO')} {formatNum(baseNum)} {t.gridCheckTitleSuffix}
                </span>
                <span className="font-mono text-emerald-600 font-bold">
                  {formatNum(realDivisors.length)} {t.perfectDivisionsSuffix}
                </span>
              </div>

              {/* Πλέγμα Δοκιμών */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 gap-3">
                {potentialDivisors.map((d) => {
                  const isDiv = baseNum % d === 0;
                  return (
                    <div
                      key={`test-d-${d}`}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center space-y-1 transition duration-150 ${
                        isDiv
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm font-bold scale-102'
                          : 'bg-white text-slate-400 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-center py-1">
                        <Fraction num={formatNum(baseNum)} den={formatNum(d)} />
                      </div>
                      <div
                        className={`w-full h-[1px] ${
                          isDiv ? 'bg-emerald-400' : 'bg-slate-100'
                        }`}
                      ></div>
                      <span className="text-xs font-mono font-black">
                        {isDiv ? `＝ ${formatNum(baseNum / d)}` : `${t.remPrefix} ${formatNum(baseNum % d)}`}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="p-4 bg-emerald-600 text-white rounded-2xl text-center font-bold text-xs sm:text-sm 2xl:text-base shadow-sm">
                📢 {t.congratsCallout1} <strong>{formatNum(realDivisors.length)}</strong> {t.congratsCallout2} {formatNum(baseNum)} {t.congratsCallout3}
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
            href="/e-dimotikou/07-diairetes-ask"
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
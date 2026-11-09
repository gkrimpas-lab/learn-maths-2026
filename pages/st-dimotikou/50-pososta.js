// pages/st-dimotikou/50-pososta.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητικό component εμφάνισης κανονικού κλάσματος
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono ${className}`}>
      <span className="border-b-2 border-current px-1.5 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Μορφοποίηση αριθμού ανά locale
function formatNum(val, locale = 'el', decimals = 2) {
  if (val === undefined || val === null || isNaN(val)) return '0';
  const targetLocale = locale === 'en' ? 'en-US' : 'el-GR';
  if (Number.isInteger(val)) {
    return val.toLocaleString(targetLocale);
  }
  return Number(val.toFixed(decimals)).toLocaleString(targetLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

// Μετατροπή σε άτονα κεφαλαία με εξαίρεση το ΣΤ'
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Συγκεντρωτικό λεξικό μεταφράσεων (i18n)
const TRANSLATIONS = {
  el: {
    metaTitle: "Ποσοστά: Έννοια & Μετατροπές - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε την έννοια των ποσοστών στα εκατό (%) και στα χίλια (‰), πώς μετατρέπουμε κλάσματα και δεκαδικούς σε ποσοστά με διαδραστικά εργαστήρια.",
    backText: "ΣΤ' Δημοτικού",
    actionBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 50 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    headerTitle: "Ποσοστά στα Εκατό (%) & στα Χίλια (‰)",
    headerDesc: "Ανακαλύπτουμε τη γλώσσα των ποσοστών: Πώς συγκρίνουμε μεγέθη με αναγωγή στο 100, πώς μετατρέπουμε κλάσματα και δεκαδικούς αριθμούς σε ποσοστό στα εκατό (%) και πώς τα αξιοποιούμε στην καθημερινή ζωή.",
    headerFeature: "Θεωρία, Οπτικοί Πίνακες & Διαδραστικό Πλέγμα 100 Τετραγώνων",
    tryExercises: "Δοκίμασε τις Ασκήσεις",

    stepsTitle: "Η Έννοια του Ποσοστού σε 4 Βήματα",
    stepsDesc: "Από την αναγωγή στα 100 ίσα μέρη στις τρεις ισοδύναμες μορφές έκφρασης.",

    step1Badge: "ΒΗΜΑ 1",
    step1Type: "Ορισμός",
    step1Title: "Τι είναι το Ποσοστό;",
    step1Text: "Ποσοστό στα εκατό (%) είναι ένας λόγος ή ένα κλάσμα με σταθερό παρονομαστή το 100:",
    step1Tip: "💡 Δείχνει πόσα μέρη παίρνουμε αν χωρίσουμε το όλο σε 100 ίσα τμήματα.",

    step2Badge: "ΒΗΜΑ 2",
    step2Type: "Μετατροπή Κλάσματος",
    step2Title: "Από Κλάσμα σε Ποσοστό",
    step2Text: "Μετατρέπουμε το κλάσμα σε ισοδύναμο με παρονομαστή το 100 ή κάνουμε τη διαίρεση:",
    step2Tip: "⚡ Κάθε απλό κλάσμα έχει το δικό του αντίστοιχο ποσοστό!",

    step3Badge: "ΒΗΜΑ 3",
    step3Type: "Δεκαδικός",
    step3Title: "Από Δεκαδικό σε Ποσοστό",
    step3Text: "Πολλαπλασιάζουμε τον δεκαδικό αριθμό με το 100 (μετακίνηση υποδιαστολής 2 θέσεις δεξιά):",
    step3Tip: "🎯 Αντίστροφα: 35% ➔ 35 : 100 ＝ 0,35.",

    step4Badge: "ΒΗΜΑ 4",
    step4Type: "Στα Χίλια (‰)",
    step4Title: "Ποσοστό στα Χίλια (‰)",
    step4Text: "Όταν έχουμε πολύ μικρές αναλογίες, χρησιμοποιούμε την αναγωγή στο 1.000:",
    step4Sub: "Χρησιμοποιείται συχνά στην περιεκτικότητα αλατιού στη θάλασσα ή στους τόκους τραπεζών.",
    step4Tip: "🚀 10 ‰ ισούται ακριβώς με 1 %.",

    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Δυναμικό Πλέγμα 100 Τετραγώνων (Οπτικοποίηση %)",
    lab1Desc: "Σύρετε τον slider για να δείτε ακριβώς πόσα τετράγωνα από τα 100 χρωματίζονται και πώς συνδέεται το ποσοστό με το κλάσμα και τον δεκαδικό.",
    lab1Label: "ΠΟΣΟΣΤΟ (%):",
    gridTitle: "ΠΛΕΓΜΑ 10x10 (100 ΤΕΤΡΑΓΩΝΑ)",
    fractionLabel: "Κλάσμα",
    decimalLabel: "Δεκαδικός",
    coloredSummary: "Χρωματισμένα:",
    outOf100: "από τα 100 τετράγωνα",

    lab2Badge: "⚡ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΚΛΑΣΜΑΤΑ ΣΕ ΠΟΣΟΣΤΑ",
    lab2Title: "Βασικά Κλάσματα και τα Ποσοστά τους",
    lab2Desc: "Επιλέξτε ένα γνωστό κλάσμα για να δείτε άμεσα την ισοδυναμία του σε δεκαδικό αριθμό και ποσοστό στα εκατό:",
    selectedLabel: "Επιλεγμένο:",
    half: "Μισό",
    quarter: "Τέταρτο",
    threeQuarters: "Τρία τέταρτα",
    oneFifth: "Ένα πέμπτο",

    examplesTitle: "Λυμένα Προβλήματα με Ποσοστά",
    examplesDesc: "Δύο χαρακτηριστικά παραδείγματα μετατροπής αναλογιών και υπολογισμού ποσοστών.",

    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΜΕΤΑΤΡΟΠΗ ΣΕ ΠΟΣΟΣΤΟ",
    prob1Category: "Σχολείο",
    prob1Title: "Επίδοση Μαθητή σε Τεστ 20 Ερωτήσεων",
    prob1Text: "Σε ένα τεστ 20 ερωτήσεων, ένας μαθητής απάντησε σωστά στις 16 ερωτήσεις. Ποιο είναι το ποσοστό επιτυχίας (%) του μαθητή;",
    prob1Method1: "Μέθοδος 1: Με ισοδύναμο κλάσμα",
    prob1Method2: "Μέθοδος 2: Με διαίρεση και πολλαπλασιασμό",
    prob1Success: "✓ Ο μαθητής πέτυχε ποσοστό επιτυχίας 80%.",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΑΝΑΓΩΓΗ ΣΤΑ 100",
    prob2Category: "Διατροφή",
    prob2Title: "Περιεκτικότητα Χυμού σε Φρούτα",
    prob2Text: "Σε ένα μπουκάλι χυμού 250 ml περιέχονται 150 ml φυσικού χυμού πορτοκαλιού. Ποιο είναι το ποσοστό (%) φυσικού χυμού;",
    prob2Method: "Υπολογισμός ποσοστού:",
    prob2FracLabel: "Κλάσμα",
    prob2PctLabel: "Ποσοστό",
    prob2Success: "✓ Το μπουκάλι περιέχει 60% φυσικό χυμό πορτοκαλιού.",

    bottomTitle: "Ώρα για Εξάσκηση στα Ποσοστά!",
    bottomDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις μετατροπής κλασμάτων, δεκαδικών και ποσοστών στα εκατό (%) και στα χίλια (‰) για τη ΣΤ' Δημοτικού.",
    startExercises: "🎯 Έναρξη Ασκήσεων",
  },
  en: {
    metaTitle: "Percentages: Concept & Conversions - Grade 6 | LearnMaths.gr",
    metaDesc: "Learn the concept of percentages per hundred (%) and per thousand (‰), and how to convert fractions and decimals into percentages with interactive labs.",
    backText: "Grade 6",
    actionBtn: "🎯 Practice",
    badgeChapter: "CHAPTER 50 • GRADE 6",
    headerTitle: "Percentages per Hundred (%) & per Thousand (‰)",
    headerDesc: "Discover the language of percentages: How we compare quantities using a base of 100, how we convert fractions and decimals to percentages (%), and how we use them in everyday life.",
    headerFeature: "Theory, Visual Tables & Interactive 100-Square Grid",
    tryExercises: "Try the Exercises",

    stepsTitle: "The Concept of Percentage in 4 Steps",
    stepsDesc: "From scaling to 100 equal parts to three equivalent expressions.",

    step1Badge: "STEP 1",
    step1Type: "Definition",
    step1Title: "What is a Percentage?",
    step1Text: "A percentage per hundred (%) is a ratio or fraction with a constant denominator of 100:",
    step1Tip: "💡 It shows how many parts we take when dividing the whole into 100 equal pieces.",

    step2Badge: "STEP 2",
    step2Type: "Fraction Conversion",
    step2Title: "From Fraction to Percentage",
    step2Text: "Convert the fraction into an equivalent one with a denominator of 100, or perform the division:",
    step2Tip: "⚡ Every simple fraction corresponds to its own specific percentage!",

    step3Badge: "STEP 3",
    step3Type: "Decimal",
    step3Title: "From Decimal to Percentage",
    step3Text: "Multiply the decimal number by 100 (shift the decimal point 2 places to the right):",
    step3Tip: "🎯 In reverse: 35% ➔ 35 : 100 ＝ 0.35.",

    step4Badge: "STEP 4",
    step4Type: "Per Thousand (‰)",
    step4Title: "Percentage per Thousand (‰)",
    step4Text: "When dealing with very small proportions, we scale to 1,000:",
    step4Sub: "Frequently used to measure ocean salinity or banking interest rates.",
    step4Tip: "🚀 10 ‰ equals exactly 1 %.",

    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Dynamic 100-Square Grid (% Visualization)",
    lab1Desc: "Drag the slider to see how many squares out of 100 are shaded and how percentage links directly to fractions and decimals.",
    lab1Label: "PERCENTAGE (%):",
    gridTitle: "10x10 GRID (100 SQUARES)",
    fractionLabel: "Fraction",
    decimalLabel: "Decimal",
    coloredSummary: "Shaded:",
    outOf100: "out of 100 squares",

    lab2Badge: "⚡ INTERACTIVE LAB 2: FRACTIONS TO PERCENTAGES",
    lab2Title: "Common Fractions and their Percentages",
    lab2Desc: "Select a benchmark fraction to instantly see its equivalent decimal value and percentage:",
    selectedLabel: "Selected:",
    half: "Half",
    quarter: "One Quarter",
    threeQuarters: "Three Quarters",
    oneFifth: "One Fifth",

    examplesTitle: "Solved Percentage Problems",
    examplesDesc: "Two representative examples of ratio conversion and percentage calculation.",

    prob1Badge: "PROBLEM 1: CONVERTING TO PERCENTAGE",
    prob1Category: "School",
    prob1Title: "Student Performance in a 20-Question Test",
    prob1Text: "In a test of 20 questions, a student answered 16 questions correctly. What is the student's success percentage (%)?",
    prob1Method1: "Method 1: Using an equivalent fraction",
    prob1Method2: "Method 2: Using division and multiplication",
    prob1Success: "✓ The student achieved a success rate of 80%.",

    prob2Badge: "PROBLEM 2: SCALING TO 100",
    prob2Category: "Nutrition",
    prob2Title: "Juice Fruit Content",
    prob2Text: "A 250 ml bottle of juice contains 150 ml of pure orange juice. What is the percentage (%) of pure juice?",
    prob2Method: "Percentage calculation:",
    prob2FracLabel: "Fraction",
    prob2PctLabel: "Percentage",
    prob2Success: "✓ The bottle contains 60% pure orange juice.",

    bottomTitle: "Ready to Practice Percentages?",
    bottomDesc: "Test your skills on 10 challenging exercises converting fractions, decimals, and percentages per hundred (%) and per thousand (‰) for Grade 6.",
    startExercises: "🎯 Start Exercises",
  },
};

export default function PosostaTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Διαδραστικό Πλέγμα 100 Τετραγώνων
  const [gridValue, setGridValue] = useState(25); // 25%

  const decimalVal = useMemo(() => {
    return Number((gridValue / 100).toFixed(2));
  }, [gridValue]);

  // Εργαστήριο 2: Ισοδυναμία Κλάσματος - Δεκαδικού - Ποσοστού
  const [customFraction, setCustomFraction] = useState({ num: 3, den: 4 });

  const fractionPct = useMemo(() => {
    if (customFraction.den === 0) return 0;
    const raw = (customFraction.num / customFraction.den) * 100;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [customFraction]);

  const presetFractions = [
    { num: 1, den: 2, label: `1/2 (${t.half})`, pct: 50 },
    { num: 1, den: 4, label: `1/4 (${t.quarter})`, pct: 25 },
    { num: 3, den: 4, label: `3/4 (${t.threeQuarters})`, pct: 75 },
    { num: 1, den: 5, label: `1/5 (${t.oneFifth})`, pct: 20 },
  ];

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/50-pososta-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.actionBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-10 2xl:space-y-14">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.badgeChapter}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.headerTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-2xl leading-relaxed max-w-4xl">
              {locale === 'el' ? (
                <>
                  Ανακαλύπτουμε τη γλώσσα των ποσοστών: Πώς συγκρίνουμε μεγέθη με αναγωγή στο <strong>100</strong>, πώς μετατρέπουμε κλάσματα και δεκαδικούς αριθμούς σε ποσοστό στα εκατό (%) και πώς τα αξιοποιούμε στην καθημερινή ζωή.
                </>
              ) : (
                <>
                  Discover the language of percentages: How we compare quantities using a base of <strong>100</strong>, how we convert fractions and decimals to percentages (%), and how we use them in everyday life.
                </>
              )}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.headerFeature}</span>
            </div>
            <Link
              href="/st-dimotikou/50-pososta-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
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
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.stepsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* Βήμα 1ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step1Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step1Type}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step1Text}
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm">
                  <div className="p-1.5 bg-white rounded-xl border border-slate-200 font-bold text-slate-800 flex items-center justify-center gap-1.5 flex-wrap">
                    <span>25 %</span>
                    <span>＝</span>
                    <Fraction num="25" den="100" />
                    <span>＝</span>
                    <span>{formatNum(0.25, locale, 2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.step1Tip}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step2Type}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="space-y-2 text-[11px] sm:text-xs font-mono">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 flex items-center gap-1 flex-wrap justify-center">
                    <span>•</span>
                    <Fraction num="1" den="2" />
                    <span>＝</span>
                    <Fraction num="1 · 50" den="2 · 50" />
                    <span>＝</span>
                    <Fraction num="50" den="100" />
                    <span>＝</span>
                    <strong>50 %</strong>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 flex items-center gap-1 flex-wrap justify-center">
                    <span>•</span>
                    <Fraction num="3" den="4" />
                    <span>＝</span>
                    <Fraction num="3 · 25" den="4 · 25" />
                    <span>＝</span>
                    <Fraction num="75" den="100" />
                    <span>＝</span>
                    <strong>75 %</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step2Tip}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step3Type}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 font-mono text-xs space-y-1 text-center">
                  <div className="text-slate-800 font-bold">
                    {formatNum(0.45, locale, 2)} · 100 ＝ <strong>45 %</strong>
                  </div>
                  <div className="text-slate-800 font-bold">
                    {formatNum(0.08, locale, 2)} · 100 ＝ <strong>8 %</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step4Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step4Type}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step4Text}
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs font-mono text-center">
                  <div className="p-1.5 bg-white rounded-xl border border-slate-200 text-slate-800 font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 flex-wrap">
                    <span>5 ‰</span>
                    <span>＝</span>
                    <Fraction num="5" den="1000" />
                    <span>＝</span>
                    <span>{formatNum(0.005, locale, 3)}</span>
                  </div>
                  <p className="text-slate-600 text-[10.5px] font-sans">
                    {t.step4Sub}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΠΛΕΓΜΑ 100 ΤΕΤΡΑΓΩΝΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{t.lab1Badge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab1Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab1Desc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστήριο Slider */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider">
                    {t.lab1Label}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {gridValue} %
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setGridValue((prev) => Math.max(0, prev - 1)); }}
                    disabled={gridValue <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={gridValue}
                    onChange={(e) => setGridValue(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setGridValue((prev) => Math.min(100, prev + 1)); }}
                    disabled={gridValue >= 100}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Γρήγορες Επιλογές */}
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 75].map((preset) => (
                  <button
                    key={`grid-pre-${preset}`}
                    type="button"
                    onClick={() => setGridValue(preset)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-1.5 rounded-xl font-bold text-xs text-slate-700 shadow-sm transition active:scale-95 text-center"
                  >
                    {preset} %
                  </button>
                ))}
              </div>

              {/* Ισοδύναμες μορφές με κανονικό κλάσμα */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                  <span className="text-slate-500 font-sans block text-[10.5px] mb-1">{t.fractionLabel}</span>
                  <div className="text-blue-900 text-sm font-bold">
                    <Fraction num={gridValue} den="100" />
                  </div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                  <span className="text-slate-500 font-sans block text-[10.5px] mb-1">{t.decimalLabel}</span>
                  <strong className="text-emerald-700 text-sm">{formatNum(decimalVal, locale, 2)}</strong>
                </div>
              </div>
            </div>

            {/* Πλέγμα 100 Τετραγώνων */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center w-full">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 text-center">
                {t.gridTitle}
              </span>

              <div className="w-full max-w-[220px] sm:max-w-[260px] aspect-square bg-white p-2 rounded-2xl border-2 border-slate-300 shadow-sm">
                <div className="grid grid-cols-10 gap-0.5 sm:gap-1 w-full h-full">
                  {Array.from({ length: 100 }).map((_, idx) => {
                    const isFilled = idx < gridValue;
                    return (
                      <div
                        key={`cell-${idx}`}
                        className={`w-full h-full rounded-[2px] transition-colors duration-150 ${
                          isFilled ? 'bg-blue-600' : 'bg-slate-100'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <span className="text-[11px] sm:text-xs text-slate-600 font-semibold mt-3 text-center">
                {t.coloredSummary} <strong className="font-mono text-blue-700">{gridValue}</strong> {t.outOf100} (<strong>{gridValue} %</strong>)
              </span>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΙΣΟΔΥΝΑΜΙΑ ΚΛΑΣΜΑΤΩΝ ΚΑΙ ΠΟΣΟΣΤΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-5 sm:space-y-6">
          <div className="border-b border-slate-100 pb-3 sm:pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>{t.lab2Badge}</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab2Desc}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {presetFractions.map((fItem, idx) => (
              <button
                key={`frac-btn-${idx}`}
                type="button"
                onClick={() => setCustomFraction({ num: fItem.num, den: fItem.den })}
                className={`p-3 rounded-2xl border text-center transition active:scale-95 flex flex-col items-center justify-center gap-1 ${
                  customFraction.num === fItem.num && customFraction.den === fItem.den
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="font-mono font-black text-sm sm:text-base">
                  <Fraction num={fItem.num} den={fItem.den} />
                </div>
                <span className="text-[10.5px] opacity-90 font-sans">{fItem.label}</span>
                <span className="text-xs sm:text-sm font-black font-mono pt-0.5">＝ {fItem.pct} %</span>
              </button>
            ))}
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs sm:text-sm text-emerald-950 font-mono flex items-center justify-center gap-1.5 flex-wrap">
            <span>{t.selectedLabel}</span>
            <Fraction num={customFraction.num} den={customFraction.den} />
            <span>＝</span>
            <span>{formatNum(customFraction.num / customFraction.den, locale, 2)}</span>
            <span>＝</span>
            <strong>{fractionPct} %</strong>
          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              {t.examplesTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.examplesDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Παράδειγμα 1 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-[11px] sm:text-xs font-black rounded-lg">
                  {t.prob1Badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob1Category}</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                {t.prob1Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob1Text}
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">
                    {t.prob1Method1}
                  </span>
                  <div className="flex items-center gap-1 flex-wrap">
                    <Fraction num="16" den="20" />
                    <span>＝</span>
                    <Fraction num="16 · 5" den="20 · 5" />
                    <span>＝</span>
                    <Fraction num="80" den="100" />
                    <span>＝</span>
                    <strong className="text-emerald-700 text-sm sm:text-base">80 %</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">
                    {t.prob1Method2}
                  </span>
                  <div>
                    (16 : 20) · 100 ＝ {formatNum(0.8, locale, 2)} · 100 ＝ <strong className="text-emerald-700 text-sm sm:text-base">80 %</strong>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-[11px] sm:text-xs text-blue-950 font-medium">
                {t.prob1Success}
              </div>
            </article>

            {/* Παράδειγμα 2 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg">
                  {t.prob2Badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob2Category}</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                {t.prob2Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob2Text}
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">
                    {t.prob2Method}
                  </span>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span>{t.prob2FracLabel}</span>
                    <span>＝</span>
                    <Fraction num="150" den="250" />
                    <span>＝</span>
                    <span>150 : 250</span>
                    <span>＝</span>
                    <span>{formatNum(0.6, locale, 2)}</span>
                  </div>
                  <div>
                    <span>{t.prob2PctLabel}</span> ＝ {formatNum(0.6, locale, 2)} · 100 ＝ <strong className="text-amber-800 text-sm sm:text-base">60 %</strong>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] sm:text-xs text-amber-950 font-medium">
                {t.prob2Success}
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.bottomTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.bottomDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/50-pososta-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>{t.startExercises}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
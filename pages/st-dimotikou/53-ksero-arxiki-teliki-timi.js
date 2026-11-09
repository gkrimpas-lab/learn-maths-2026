// pages/st-dimotikou/53-ksero-arxiki-teliki-timi.js
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
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const targetLocale = locale === 'en' ? 'en-US' : 'el-GR';
  const num = Number(val);
  if (Number.isInteger(num)) {
    return num.toLocaleString(targetLocale);
  }
  return Number(num.toFixed(decimals)).toLocaleString(targetLocale, {
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
    metaTitle: "Εύρεση Ποσοστού από Αρχική και Τελική Τιμή - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε πώς υπολογίζουμε το ποσοστό έκπτωσης ή αύξησης όταν γνωρίζουμε την αρχική και την τελική τιμή ενός ποσού με διαδραστικά εργαστήρια και παραδείγματα.",
    backText: "ΣΤ' Δημοτικού",
    actionBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 53 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    headerTitle: "Εύρεση Ποσοστού όταν Ξέρω Αρχική και Τελική Τιμή",
    headerDesc: "Μαθαίνουμε πώς να υπολογίζουμε το ακριβές ποσοστό έκπτωσης (%) ή αύξησης (%) όταν γνωρίζουμε πόσο κόστιζε ένα προϊόν αρχικά και πόσο πληρώσαμε τελικά, χρησιμοποιώντας τη διαφορά των τιμών και τη μέθοδο των ανάλογων ποσών.",
    headerFeature: "Θεωρία, Λυμένα Προβλήματα & Διαδραστικός Υπολογιστής Ποσοστού",
    tryExercises: "Δοκίμασε τις Ασκήσεις",

    stepsTitle: "Η Διαδικασία Επίλυσης σε 4 Βήματα",
    stepsDesc: "Πώς μετατρέπουμε τη χρηματική διαφορά ανάμεσα στις δύο τιμές σε ποσοστό στα εκατό (%).",

    step1Badge: "ΒΗΜΑ 1",
    step1Type: "Πρώτη Πράξη",
    step1Title: "Εύρεση της Διαφοράς",
    step1Text: "Το πρώτο και απαραίτητο βήμα είναι να βρούμε πόσα ευρώ (€) μειώθηκε ή αυξήθηκε η τιμή κάνοντας αφαίρεση:",
    step1DiscountTitle: "Σε Έκπτωση:",
    step1DiscountFormula: "Διαφορά ＝ Αρχική Τιμή － Τελική Τιμή",
    step1IncreaseTitle: "Σε Αύξηση:",
    step1IncreaseFormula: "Διαφορά ＝ Τελική Τιμή － Αρχική Τιμή",
    step1Tip: "💡 Η διαφορά αυτή δείχνει την απόλυτη μεταβολή σε ευρώ πριν τη μετατρέψουμε σε ποσοστό.",

    step2Badge: "ΒΗΜΑ 2",
    step2Type: "Βάση Σύγκρισης",
    step2Title: "Πάντα στην Αρχική Τιμή!",
    step2Text: "Το ποσοστό μεταβολής συγκρίνεται ΠΑΝΤΟΤΕ με την αρχική τιμή (αυτή είναι το 100%):",
    step2FracLabel: "Κλάσμα ＝",
    step2FracNum: "Μεταβολή (€)",
    step2FracDen: "Αρχική Τιμή (€)",
    step2SubText: "Ποτέ δεν βάζουμε στον παρονομαστή την τελική τιμή, γιατί η έκπτωση ή η αύξηση ξεκίνησε από την αρχική!",
    step2Tip: "⚡ Κανόνας: «Στα πόσα ευρώ αρχικής αξίας είχαμε τόσα ευρώ αλλαγής;»",

    step3Badge: "ΒΗΜΑ 3",
    step3Type: "Μέθοδος 1",
    step3Title: "Πίνακας Ποσών & Χιαστί",
    step3Text: "Στήνουμε έναν πίνακα ποσών και τιμών συγκρίνοντας την αρχική τιμή με τη διαφορά:",
    step3ColInitial: "Αρχική Τιμή (€)",
    step3ColChange: "Μεταβολή (€)",
    step3RowInitialLabel: "Αρχική",
    step3RowDiffLabel: "Διαφορά",
    step3FormulaText: "χ ＝ (Διαφορά · 100) : Αρχική",
    step3Tip: "🎯 Ο πίνακας βοηθάει να βλέπουμε καθαρά ότι το 100 τοποθετείται κάτω από την αρχική τιμή.",

    step4Badge: "ΒΗΜΑ 4",
    step4Type: "Μέθοδος 2",
    step4Title: "Μετατροπή σε %",
    step4Text: "Η ταχύτερη μέθοδος: διαιρούμε τη διαφορά με την αρχική τιμή και πολλαπλασιάζουμε με το 100:",
    step4FormulaBadge: "% ＝ (Διαφορά : Αρχική) · 100",
    step4Example: "Παράδειγμα: 20 € στα 80 € ➔ 20 : 80 ＝ 0,25 ➔ 0,25 · 100 ＝ 25 %.",
    step4Tip: "🚀 Απλή διαίρεση και μετακίνηση της υποδιαστολής 2 θέσεις δεξιά.",

    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Δυναμικός Εξομοιωτής Εύρεσης Ποσοστού Μεταβολής",
    lab1Desc: "Ορίστε την αρχική και την τελική τιμή ανά 1 μονάδα. Ο εξομοιωτής εντοπίζει αυτόματα αν πρόκειται για αύξηση ή μείωση και υπολογίζει το ποσοστό στα εκατό (%).",
    labelInitialPrice: "ΑΡΧΙΚΗ ΤΙΜΗ (€)",
    labelFinalPrice: "ΤΕΛΙΚΗ ΤΙΜΗ (€)",
    statusDiscount: "🔻 Έκπτωση / Μείωση: Η τιμή έπεσε κατά {diff} € ({init} － {final}).",
    statusIncrease: "🔺 Αύξηση: Η τιμή ανέβηκε κατά {diff} € ({final} － {init}).",
    statusStable: "⚖️ Καμία μεταβολή: Αρχική και τελική τιμή είναι ίσες (ποσοστό 0%).",
    tableTitle: "ΠΙΝΑΚΑΣ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ (ΑΝΑΓΩΓΗ ΣΤΑ 100)",
    tableInitialCol: "Αρχική (€)",
    tableChangeCol: "Μεταβολή (€)",
    tableXFormula: "χ ＝ ({diff} · 100) : {init} ＝ {pct} %",
    resultDiffLabel: "ΔΙΑΦΟΡΑ ΤΙΜΗΣ",
    resultPctDiscountLabel: "ΠΟΣΟΣΤΟ ΕΚΠΤΩΣΗΣ",
    resultPctIncreaseLabel: "ΠΟΣΟΣΤΟ ΑΥΞΗΣΗΣ",
    resultPctStableLabel: "ΠΟΣΟΣΤΟ ΜΕΤΑΒΟΛΗΣ",

    lab2Badge: "⚡ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΣΥΓΚΡΙΣΗ ΜΕΘΟΔΩΝ",
    lab2Title: "Πώς Λύνεται με τους 2 Τρόπους",
    lab2Intro: "Παράδειγμα: Ένα προϊόν κόστιζε αρχικά {init} € και πωλήθηκε τελικά προς {final} € (Έκπτωση {diff} €):",
    m1Title: "1ος ΤΡΟΠΟΣ: ΠΙΝΑΚΑΣ ΠΟΣΩΝ (ΜΕΘΟΔΟΣ ΤΩΝ ΤΡΙΩΝ)",
    m1Desc: "Στήνουμε τον πίνακα συσχετίζοντας την αρχική τιμή με τη διαφορά:",
    m1Line1: "Στα {init} € είχαμε έκπτωση {diff} €",
    m1Line2: "Στα 100 € πόση έκπτωση έχουμε (χ);",
    m1Result: "χ ＝ ({diff} · 100) : {init} ＝ {pct} %",
    m1Footer: "Ασφαλής και παραστατική μέθοδος για κάθε μαθητή.",
    m2Title: "2ος ΤΡΟΠΟΣ: ΚΛΑΣΜΑ & ΔΙΑΙΡΕΣΗ",
    m2Desc: "Διαιρούμε τη διαφορά με την αρχική τιμή και πολλαπλασιάζουμε με το 100:",
    m2FracPrefix: "Κλάσμα ＝",
    m2FracSuffix: "＝ 0,25",
    m2Result: "0,25 · 100 ＝ {pct} %",
    m2Footer: "Ταχύτατος τρόπος όταν η διαίρεση δίνει απλό δεκαδικό αριθμό.",

    examplesTitle: "Λυμένα Προβλήματα Εύρεσης Ποσοστού",
    examplesDesc: "Δύο χαρακτηριστικά παραδείγματα καθημερινής ζωής με αναλυτική παρουσίαση των βημάτων.",

    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΠΟΣΟΣΤΟ ΕΚΠΤΩΣΗΣ",
    prob1Category: "Αγορά Ρούχων",
    prob1Title: "Υπολογισμός Έκπτωσης σε Μπουφάν",
    prob1Text: "Ένα μπουφάν είχε αρχική τιμή 150 € και πωλήθηκε στις εκπτώσεις προς 105 € . Ποιο ήταν το ποσοστό έκπτωσης (%) που έγινε;",
    prob1Step1Title: "Βήμα 1: Πόσα ευρώ ήταν η έκπτωση;",
    prob1Step1Formula: "Έκπτωση σε € ＝ 150 － 105 ＝ 45 €",
    prob1Step2Title: "Βήμα 2: Ποσοστό επί της αρχικής τιμής",
    prob1Step2Formula: "(45 : 150) · 100 ＝ 0,30 · 100 ＝ 30 %",
    prob1VerifyTip: "✓ Επαλήθευση: Το 30% των 150 € είναι 45 €. Τελική τιμή: 150 － 45 ＝ 105 €.",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΠΟΣΟΣΤΟ ΑΥΞΗΣΗΣ",
    prob2Category: "Συγκοινωνίες",
    prob2Title: "Αύξηση Τιμής Εισιτηρίου Λεωφορείου",
    prob2Text: "Το εισιτήριο λεωφορείου κόστιζε 1,20 € και η νέα τιμή του έγινε 1,50 € . Ποιο ήταν το ποσοστό αύξησης (%) στην τιμή;",
    prob2Step1Title: "Βήμα 1: Πόσα ευρώ ήταν η αύξηση;",
    prob2Step1Formula: "Αύξηση σε € ＝ 1,50 － 1,20 ＝ 0,30 €",
    prob2Step2Title: "Βήμα 2: Ποσοστό επί της αρχικής τιμής",
    prob2Step2Formula: "(0,30 : 1,20) · 100 ＝ 0,25 · 100 ＝ 25 %",
    prob2VerifyTip: "✓ Επαλήθευση: Το 25% των 1,20 € είναι 0,30 €. Νέα τιμή: 1,20 ＋ 0,30 ＝ 1,50 €.",

    bottomTitle: "Ώρα για Εξάσκηση στην Εύρεση Ποσοστού Μεταβολής!",
    bottomDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις υπολογισμού ποσοστού έκπτωσης, αύξησης και κέρδους όταν γνωρίζεις την αρχική και την τελική τιμή.",
    startExercises: "🎯 Έναρξη Ασκήσεων",
  },
  en: {
    metaTitle: "Finding Percentage from Original & Final Price - Grade 6 | LearnMaths.gr",
    metaDesc: "Learn how to calculate the discount or markup rate when given the original and final price of an item using interactive labs and worked examples.",
    backText: "Grade 6",
    actionBtn: "🎯 Practice",
    badgeChapter: "CHAPTER 53 • GRADE 6",
    headerTitle: "Finding Percentage When Knowing Original and Final Price",
    headerDesc: "Learn how to compute the exact discount rate (%) or markup rate (%) when given what an item cost originally and what was paid at the end, using price difference and proportions.",
    headerFeature: "Theory, Solved Problems & Interactive Percentage Calculator",
    tryExercises: "Try the Exercises",

    stepsTitle: "Problem Solving Process in 4 Steps",
    stepsDesc: "How to convert the monetary difference between two prices into a percentage rate (%).",

    step1Badge: "STEP 1",
    step1Type: "First Operation",
    step1Title: "Finding the Difference",
    step1Text: "The essential first step is to subtract to find how many euros (€) the price decreased or increased:",
    step1DiscountTitle: "For a Discount:",
    step1DiscountFormula: "Difference ＝ Original Price － Final Price",
    step1IncreaseTitle: "For an Increase:",
    step1IncreaseFormula: "Difference ＝ Final Price － Original Price",
    step1Tip: "💡 This difference shows the absolute price change in euros before converting it to a percentage.",

    step2Badge: "STEP 2",
    step2Type: "Comparison Base",
    step2Title: "Always Against the Original Price!",
    step2Text: "The rate of change is ALWAYS compared to the original price (which represents 100%):",
    step2FracLabel: "Fraction ＝",
    step2FracNum: "Change (€)",
    step2FracDen: "Original Price (€)",
    step2SubText: "Never place the final price in the denominator, because the discount or markup started from the original price!",
    step2Tip: "⚡ Rule: \"For how many euros of original value did we have this amount of change?\"",

    step3Badge: "STEP 3",
    step3Type: "Method 1",
    step3Title: "Proportion Table & Cross-Multiplication",
    step3Text: "Set up a proportion table comparing the original price with the price change:",
    step3ColInitial: "Original Price (€)",
    step3ColChange: "Change (€)",
    step3RowInitialLabel: "Original",
    step3RowDiffLabel: "Difference",
    step3FormulaText: "x ＝ (Difference · 100) : Original",
    step3Tip: "🎯 The table clarifies that 100 is always placed below the original price.",

    step4Badge: "STEP 4",
    step4Type: "Method 2",
    step4Title: "Direct Conversion to %",
    step4Text: "The fastest method: divide the difference by the original price and multiply by 100:",
    step4FormulaBadge: "% ＝ (Difference : Original) · 100",
    step4Example: "Example: 20 € out of 80 € ➔ 20 : 80 ＝ 0.25 ➔ 0.25 · 100 ＝ 25 %.",
    step4Tip: "🚀 Simple division and shifting the decimal point 2 places to the right.",

    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Dynamic Rate of Change Simulator",
    lab1Desc: "Set original and final price in steps of 1 unit. The simulator automatically identifies discount or markup and calculates the percentage (%).",
    labelInitialPrice: "ORIGINAL PRICE (€)",
    labelFinalPrice: "FINAL PRICE (€)",
    statusDiscount: "🔻 Discount / Decrease: The price dropped by {diff} € ({init} － {final}).",
    statusIncrease: "🔺 Increase / Markup: The price went up by {diff} € ({final} － {init}).",
    statusStable: "⚖️ No change: Original and final price are equal (0% change).",
    tableTitle: "PROPORTION TABLE (BASE 100)",
    tableInitialCol: "Original (€)",
    tableChangeCol: "Change (€)",
    tableXFormula: "x ＝ ({diff} · 100) : {init} ＝ {pct} %",
    resultDiffLabel: "PRICE DIFFERENCE",
    resultPctDiscountLabel: "DISCOUNT RATE",
    resultPctIncreaseLabel: "MARKUP RATE",
    resultPctStableLabel: "RATE OF CHANGE",

    lab2Badge: "⚡ INTERACTIVE LAB 2: COMPARING METHODS",
    lab2Title: "How to Solve with Both Methods",
    lab2Intro: "Example: An item originally cost {init} € and was finally sold for {final} € (Discount of {diff} €):",
    m1Title: "METHOD 1: PROPORTION TABLE (RULE OF THREE)",
    m1Desc: "Set up the proportion table linking original price with the difference:",
    m1Line1: "On {init} € we had a discount of {diff} €",
    m1Line2: "On 100 € what discount do we have (x)?",
    m1Result: "x ＝ ({diff} · 100) : {init} ＝ {pct} %",
    m1Footer: "Reliable and intuitive method for every student.",
    m2Title: "METHOD 2: FRACTION & DIVISION",
    m2Desc: "Divide the difference by the original price and multiply by 100:",
    m2FracPrefix: "Fraction ＝",
    m2FracSuffix: "＝ 0.25",
    m2Result: "0.25 · 100 ＝ {pct} %",
    m2Footer: "Fastest way when division produces a clean decimal.",

    examplesTitle: "Solved Problems for Finding Percentage",
    examplesDesc: "Two representative real-world examples with step-by-step mathematical reasoning.",

    prob1Badge: "PROBLEM 1: DISCOUNT RATE",
    prob1Category: "Clothing Shopping",
    prob1Title: "Calculating Discount on a Jacket",
    prob1Text: "A jacket had an original price of 150 € and was sold on sale for 105 € . What was the discount percentage (%) applied?",
    prob1Step1Title: "Step 1: How much was the discount in euros?",
    prob1Step1Formula: "Discount in € ＝ 150 － 105 ＝ 45 €",
    prob1Step2Title: "Step 2: Percentage against the original price",
    prob1Step2Formula: "(45 : 150) · 100 ＝ 0.30 · 100 ＝ 30 %",
    prob1VerifyTip: "✓ Verification: 30% of 150 € is 45 €. Final price: 150 － 45 ＝ 105 €.",

    prob2Badge: "PROBLEM 2: INCREASE RATE",
    prob2Category: "Transportation",
    prob2Title: "Bus Fare Increase",
    prob2Text: "A bus ticket used to cost 1.20 € and its new price became 1.50 € . What was the percentage increase (%) in price?",
    prob2Step1Title: "Step 1: How much was the price increase?",
    prob2Step1Formula: "Increase in € ＝ 1.50 － 1.20 ＝ 0.30 €",
    prob2Step2Title: "Step 2: Percentage against the original price",
    prob2Step2Formula: "(0.30 : 1.20) · 100 ＝ 0.25 · 100 ＝ 25 %",
    prob2VerifyTip: "✓ Verification: 25% of 1.20 € is 0.30 €. New price: 1.20 ＋ 0.30 ＝ 1.50 €.",

    bottomTitle: "Ready to Practice Finding the Rate of Change?",
    bottomDesc: "Test your skills on 10 challenging exercises calculating discount, markup, and profit rates given initial and final prices.",
    startExercises: "🎯 Start Exercises",
  },
};

export default function KseroArxikiTelikiTimiTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Διαδραστικός Υπολογιστής Ποσοστού Μεταβολής
  const [initialPrice, setInitialPrice] = useState(80); // Αρχική τιμή σε €
  const [finalPrice, setFinalPrice] = useState(60);     // Τελική τιμή σε €

  const difference = useMemo(() => {
    return Math.abs(finalPrice - initialPrice);
  }, [finalPrice, initialPrice]);

  const changeType = finalPrice < initialPrice ? 'discount' : finalPrice > initialPrice ? 'increase' : 'stable';

  const percentage = useMemo(() => {
    if (initialPrice <= 0) return 0;
    const raw = (difference / initialPrice) * 100;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [difference, initialPrice]);

  // Εργαστήριο 2: Προκαθορισμένο Παράδειγμα
  const sampleOriginal = 120;
  const sampleFinal = 90;
  const sampleDiff = sampleOriginal - sampleFinal; // 30 €
  const samplePct = (sampleDiff / sampleOriginal) * 100; // 25%

  const resultLabel = changeType === 'discount'
    ? t.resultPctDiscountLabel
    : changeType === 'increase'
      ? t.resultPctIncreaseLabel
      : t.resultPctStableLabel;

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/53-ksero-arxiki-teliki-timi-ask"
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
              {t.headerDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.headerFeature}</span>
            </div>
            <Link
              href="/st-dimotikou/53-ksero-arxiki-teliki-timi-ask"
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

                <div className="space-y-2 text-[11px] sm:text-xs font-mono">
                  <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-950 leading-relaxed">
                    🔻 <strong>{t.step1DiscountTitle}</strong><br />
                    {t.step1DiscountFormula}
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 leading-relaxed">
                    🔺 <strong>{t.step1IncreaseTitle}</strong><br />
                    {t.step1IncreaseFormula}
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

                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-center">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-bold font-mono text-[11px] sm:text-xs flex items-center justify-center gap-1 flex-wrap">
                    <span>{t.step2FracLabel}</span>
                    <Fraction num={t.step2FracNum} den={t.step2FracDen} />
                  </div>
                  <p className="text-slate-500 text-[11px] pt-1 font-sans">
                    {t.step2SubText}
                  </p>
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

                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 font-mono text-xs space-y-1.5 text-center">
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-1 font-bold text-slate-600 text-[11px]">
                    <span>{t.step3ColInitial}</span>
                    <span>{t.step3ColChange}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5 font-bold text-slate-800">
                    <span>{t.step3RowInitialLabel}</span>
                    <span>{t.step3RowDiffLabel}</span>
                    <span>100</span>
                    <span className="text-indigo-600">χ</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500 font-sans pt-1">
                    {t.step3FormulaText}
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
                  <div className="p-1.5 bg-white rounded-xl border border-slate-200 text-slate-800 font-bold text-[11px] sm:text-xs">
                    {t.step4FormulaBadge}
                  </div>
                  <p className="text-slate-500 text-[10.5px] font-sans">
                    {t.step4Example}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΥΠΟΛΟΓΙΣΤΗΣ ΠΟΣΟΣΤΟΥ ΜΕΤΑΒΟΛΗΣ */}
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
            
            {/* Χειριστήρια Αρχικής & Τελικής Τιμής */}
            <div className="lg:col-span-5 space-y-3.5">
              
              {/* Αρχική Τιμή */}
              <div className="bg-blue-50/70 p-3 sm:p-4 rounded-2xl border border-blue-200 space-y-1.5">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">
                    {t.labelInitialPrice}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {formatNum(initialPrice, locale)} €
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setInitialPrice((prev) => Math.max(1, prev - 1)); }}
                    disabled={initialPrice <= 1}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={200}
                    step={1}
                    value={initialPrice}
                    onChange={(e) => setInitialPrice(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setInitialPrice((prev) => Math.min(200, prev + 1)); }}
                    disabled={initialPrice >= 200}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Τελική Τιμή */}
              <div className="bg-indigo-50/70 p-3 sm:p-4 rounded-2xl border border-indigo-200 space-y-1.5">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-indigo-900 tracking-wider">
                    {t.labelFinalPrice}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    {formatNum(finalPrice, locale)} €
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFinalPrice((prev) => Math.max(1, prev - 1)); }}
                    disabled={finalPrice <= 1}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={200}
                    step={1}
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFinalPrice((prev) => Math.min(200, prev + 1)); }}
                    disabled={finalPrice >= 200}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Ενημερωτική Κάρτα Κατάστασης */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                {changeType === 'discount' && (
                  <span className="text-rose-800 font-bold">
                    {t.statusDiscount
                      .replace('{diff}', formatNum(difference, locale))
                      .replace('{init}', formatNum(initialPrice, locale))
                      .replace('{final}', formatNum(finalPrice, locale))}
                  </span>
                )}
                {changeType === 'increase' && (
                  <span className="text-emerald-800 font-bold">
                    {t.statusIncrease
                      .replace('{diff}', formatNum(difference, locale))
                      .replace('{init}', formatNum(initialPrice, locale))
                      .replace('{final}', formatNum(finalPrice, locale))}
                  </span>
                )}
                {changeType === 'stable' && (
                  <span className="text-slate-700 font-bold">
                    {t.statusStable}
                  </span>
                )}
              </div>

            </div>

            {/* Πίνακας Αναλογίας & Αποτελέσματα */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4 w-full">
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                {t.tableTitle}
              </div>

              {/* Πίνακας 2x2 */}
              <div className="w-full max-w-sm mx-auto bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-3 sm:p-4 space-y-2.5 font-mono text-center">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2 font-bold text-slate-600 text-xs sm:text-sm">
                  <span className="bg-blue-50 py-1 rounded-lg text-blue-900 truncate">{t.tableInitialCol}</span>
                  <span className={`py-1 rounded-lg truncate ${changeType === 'discount' ? 'bg-rose-50 text-rose-900' : 'bg-emerald-50 text-emerald-900'}`}>
                    {t.tableChangeCol}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-base sm:text-xl font-black text-slate-800">
                  <div className="bg-slate-100 p-2 rounded-xl">{formatNum(initialPrice, locale)}</div>
                  <div className="bg-slate-100 p-2 rounded-xl">{formatNum(difference, locale)}</div>
                  <div className="bg-slate-100 p-2 rounded-xl">100</div>
                  <div className="bg-amber-100 p-2 rounded-xl text-amber-950 border border-amber-300 animate-pulse">
                    χ
                  </div>
                </div>
                <div className="text-[11px] sm:text-xs font-sans text-slate-500 pt-1">
                  {t.tableXFormula
                    .replace('{diff}', formatNum(difference, locale))
                    .replace('{init}', formatNum(initialPrice, locale))
                    .replace('{pct}', formatNum(percentage, locale, 1))}
                </div>
              </div>

              {/* Κάρτες Αποτελεσμάτων */}
              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10.5px] sm:text-xs font-bold text-slate-500 uppercase block">
                    {t.resultDiffLabel}
                  </span>
                  <div className={`font-mono font-black text-lg sm:text-2xl ${changeType === 'discount' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {formatNum(difference, locale)} €
                  </div>
                </div>

                <div className="p-3 bg-white rounded-2xl border-2 border-amber-300 bg-amber-50/50 space-y-1">
                  <span className="text-[10.5px] sm:text-xs font-bold text-amber-900 uppercase block">
                    {resultLabel}
                  </span>
                  <div className="font-mono font-black text-lg sm:text-2xl text-amber-700">
                    {formatNum(percentage, locale, 1)} %
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΣΥΓΚΡΙΣΗ ΤΩΝ 2 ΜΕΘΟΔΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-5 sm:space-y-6">
          <div className="border-b border-slate-100 pb-3 sm:pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>{t.lab2Badge}</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab2Intro
                .replace('{init}', formatNum(sampleOriginal, locale))
                .replace('{final}', formatNum(sampleFinal, locale))
                .replace('{diff}', formatNum(sampleDiff, locale))}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Μέθοδος 1: Πίνακας Αναλογίας */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                  {t.m1Title}
                </span>
                <p className="text-xs text-slate-600">
                  {t.m1Desc}
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-1 text-center">
                  <div>
                    {t.m1Line1
                      .replace('{init}', formatNum(sampleOriginal, locale))
                      .replace('{diff}', formatNum(sampleDiff, locale))}
                  </div>
                  <div className="text-indigo-900 font-bold">
                    {t.m1Line2}
                  </div>
                  <div className="pt-1 border-t border-slate-100 text-sm sm:text-base text-emerald-700 font-black">
                    {t.m1Result
                      .replace('{diff}', formatNum(sampleDiff, locale))
                      .replace('{init}', formatNum(sampleOriginal, locale))
                      .replace('{pct}', formatNum(samplePct, locale))}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center font-medium">
                {t.m1Footer}
              </p>
            </div>

            {/* Μέθοδος 2: Κλασματική Αναγωγή */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2.5">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                  {t.m2Title}
                </span>
                <p className="text-xs text-slate-600">
                  {t.m2Desc}
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-1.5 text-center">
                  <div className="flex items-center justify-center text-[11px] sm:text-xs flex-wrap">
                    <span>{t.m2FracPrefix}</span>
                    <Fraction num={formatNum(sampleDiff, locale)} den={formatNum(sampleOriginal, locale)} />
                    <span>{t.m2FracSuffix}</span>
                  </div>
                  <div className="text-emerald-700 font-black text-sm sm:text-base pt-1">
                    {t.m2Result.replace('{pct}', formatNum(samplePct, locale))}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center font-medium">
                {t.m2Footer}
              </p>
            </div>

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
                <span className="px-2.5 py-1 bg-rose-100 text-rose-900 text-[11px] sm:text-xs font-black rounded-lg">
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
                    {t.prob1Step1Title}
                  </span>
                  <div>
                    {t.prob1Step1Formula}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">
                    {t.prob1Step2Title}
                  </span>
                  <div>
                    {t.prob1Step2Formula}
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] sm:text-xs text-emerald-950 font-medium">
                {t.prob1VerifyTip}
              </div>
            </article>

            {/* Παράδειγμα 2 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs font-black rounded-lg">
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
                    {t.prob2Step1Title}
                  </span>
                  <div>
                    {t.prob2Step1Formula}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">
                    {t.prob2Step2Title}
                  </span>
                  <div>
                    {t.prob2Step2Formula}
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] sm:text-xs text-emerald-950 font-medium">
                {t.prob2VerifyTip}
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
            href="/st-dimotikou/53-ksero-arxiki-teliki-timi-ask"
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
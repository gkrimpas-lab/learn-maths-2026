// pages/st-dimotikou/52-brisko-arxiki-timi.js
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

// Άτονα ελληνικά κεφαλαία με διατήρηση του ΣΤ'
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
    metaTitle: "Εύρεση Αρχικής Τιμής στα Ποσοστά - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε πώς υπολογίζουμε την αρχική τιμή όταν γνωρίζουμε την τελική τιμή και το ποσοστό έκπτωσης ή αύξησης, αποφεύγοντας τη μεγάλη παγίδα των ποσοστών.",
    backText: "ΣΤ' Δημοτικού",
    actionBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 52 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    headerTitle: "Εύρεση της Αρχικής Τιμής",
    headerDesc: "Μαθαίνουμε πώς να υπολογίζουμε πόσο κόστιζε ένα προϊόν πριν από την έκπτωση ή τον φόρο (Φ.Π.Α.), όταν γνωρίζουμε μόνο την τελική τιμή πληρωμής και το ποσοστό μεταβολής, αποφεύγοντας τη μεγάλη μαθηματική παγίδα.",
    headerFeature: "Θεωρία, Η Μεγάλη Παγίδα & Διαδραστικός Υπολογιστής Αρχικής Τιμής",
    tryExercises: "Δοκίμασε τις Ασκήσεις",

    stepsTitle: "Η Μεθοδολογία σε 4 Βήματα",
    stepsDesc: "Πώς οδηγούμαστε με ασφάλεια στην αρχική τιμή (το 100%) χωρίς να παρασυρθούμε σε λάθος πράξεις.",

    step1Badge: "ΒΗΜΑ 1",
    step1Type: "Ποσοστό Τελικής",
    step1Title: "Σε ποιο ποσοστό αντιστοιχεί;",
    step1Text: "Η τελική τιμή δεν είναι το 100%. Αντιστοιχεί σε ποσοστό μικρότερο ή μεγαλύτερο του 100%:",
    step1DiscountTitle: "Σε Έκπτωση 20%:",
    step1DiscountFormula: "Πληρώνουμε το 100% － 20% ＝ 80%",
    step1IncreaseTitle: "Σε Αύξηση / Φ.Π.Α. 24%:",
    step1IncreaseFormula: "Πληρώνουμε το 100% ＋ 24% ＝ 124%",
    step1Tip: "💡 Βρίσκουμε πρώτα σε ποιο ποσοστό της αρχικής τιμής αντιστοιχεί το ποσό που πληρώσαμε.",

    step2Badge: "ΒΗΜΑ 2",
    step2Type: "ΠΡΟΣΟΧΗ!",
    step2Title: "Η Μεγάλη Παγίδα!",
    step2Text: "Αν πληρώσαμε 80 € μετά από έκπτωση 20%, ΕΙΝΑΙ ΛΑΘΟΣ να υπολογίσουμε το 20% των 80 € και να το προσθέσουμε:",
    step2MistakeCalc: "80 ＋ (20% των 80) ＝ 80 ＋ 16 ＝ 96 € (ΛΑΘΟΣ!)",
    step2MistakeExplain: "Το 20% αφαιρέθηκε από την αρχική τιμή (που ήταν 100 €) και όχι από τα 80 €!",
    step2Tip: "⚡ Κανόνας: Ποτέ δεν εφαρμόζουμε το ποσοστό στην τελική τιμή για να βρούμε την αρχική!",

    step3Badge: "ΒΗΜΑ 3",
    step3Type: "Μέθοδος 1",
    step3Title: "Πίνακας Ποσών (Χιαστί)",
    step3Text: "Στήνουμε έναν πίνακα συσχετίζοντας την αρχική τιμή (100) με την τελική τιμή:",
    step3ColInitial: "Αρχική (€)",
    step3ColFinal: "Τελική (€)",
    step3RowFinalDiscount: "100 － Έκπτωση",
    step3RowFinalLabel: "Τελική Τιμή",
    step3FormulaText: "χ ＝ (Τελική · 100) : (100 － Έκπτωση)",
    step3Tip: "🎯 Ο πίνακας προστατεύει από λάθη γιατί τοποθετεί τον άγνωστο χ κάτω από το 100.",

    step4Badge: "ΒΗΜΑ 4",
    step4Type: "Μέθοδος 2",
    step4Title: "Δεκαδικός Συντελεστής",
    step4Text: "Η ταχύτερη μέθοδος: διαιρούμε απευθείας την τελική τιμή με τον δεκαδικό συντελεστή του ποσοστού:",
    step4RuleTitle: "Αρχική ＝ Τελική : Συντελεστή",
    step4RuleDisc: "• Έκπτωση 20% ➔ Διαίρεση με 0,80 (80 : 0,80 ＝ 100 €)",
    step4RuleVat: "• Φ.Π.Α. 24% ➔ Διαίρεση με 1,24",
    step4Tip: "🚀 Μία απλή διαίρεση δίνει απευθείας την αρχική τιμή.",

    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    labTitle: "Δυναμικός Εξομοιωτής Εύρεσης Αρχικής Τιμής",
    labDesc: "Επιλέξτε αν πρόκειται για έκπτωση ή αύξηση, ορίστε την τελική τιμή και το ποσοστό, και δείτε πώς υπολογίζεται αυτόματα η αρχική τιμή χωρίς λάθη.",
    modeDiscount: "🔻 Έκπτωση",
    modeIncrease: "🔺 Αύξηση / Φ.Π.Α.",
    labelFinalPrice: "ΤΕΛΙΚΗ ΤΙΜΗ ΠΛΗΡΩΜΗΣ (€)",
    labelPctDiscount: "ΠΟΣΟΣΤΟ ΕΚΠΤΩΣΗΣ (%)",
    labelPctIncrease: "ΠΟΣΟΣΤΟ ΑΥΞΗΣΗΣ (%)",
    labExplainBanner: "Η τελική τιμή των {price} € αντιστοιχεί στο {pct} % της αρχικής αξίας.",
    tableTitle: "ΠΙΝΑΚΑΣ ΠΟΣΩΝ (ΑΝΑΓΩΓΗ ΣΤΟ 100)",
    tableInitialCol: "Αρχική (€)",
    tableFinalCol: "Τελική (€)",
    tableXFormula: "χ ＝ ({final} · 100) : {finalPct} ＝ {init} €",
    resultInitialLabel: "ΑΡΧΙΚΗ ΤΙΜΗ (100%)",
    resultDiscountLabel: "ΠΟΣΟ ΕΚΠΤΩΣΗΣ",
    resultIncreaseLabel: "ΠΟΣΟ ΑΥΞΗΣΗΣ",

    examplesTitle: "Λυμένα Προβλήματα Εύρεσης Αρχικής Τιμής",
    examplesDesc: "Δύο χαρακτηριστικά προβλήματα αγορών με αναλυτική παρουσίαση των βημάτων.",

    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΑΡΧΙΚΗ ΤΙΜΗ ΜΕΤΑ ΑΠΟ ΕΚΠΤΩΣΗ",
    prob1Category: "Έκπτωση 20%",
    prob1Title: "Αγορά Παπουτσιών στις Εκπτώσεις",
    prob1Text: "Ένα ζευγάρι παπούτσια πωλήθηκε στις εκπτώσεις προς 72 € με έκπτωση 20 %. Ποια ήταν η αρχική τιμή των παπουτσιών;",
    prob1Step1Title: "Βήμα 1: Σε ποιο ποσοστό αντιστοιχούν τα 72 €;",
    prob1Step1Formula: "100 % － 20 % ＝ 80 % της αρχικής τιμής.",
    prob1Step2Title: "Βήμα 2: Υπολογισμός αρχικής τιμής (100%)",
    prob1Step2Table: "Με πίνακα (χιαστί): χ ＝ (72 · 100) : 80 ＝ 7.200 : 80 ＝ 90 €",
    prob1Step2Div: "Με διαίρεση: 72 : 0,80 ＝ 90 €",
    prob1VerifyTip: "✓ Επαλήθευση: Το 20% των 90 € είναι 18 €. Τελική τιμή: 90 － 18 ＝ 72 €.",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΑΡΧΙΚΗ ΤΙΜΗ ΠΡΟ ΦΟΡΟΥ (Φ.Π.Α.)",
    prob2Category: "Φ.Π.Α. 24%",
    prob2Title: "Καθαρή Αξία Τηλεόρασης",
    prob2Text: "Η τελική τιμή μιας τηλεόρασης μαζί με Φ.Π.Α. 24 % είναι 372 €. Ποια ήταν η καθαρή αρχική τιμή της χωρίς τον φόρο;",
    prob2Step1Title: "Βήμα 1: Σε ποιο ποσοστό αντιστοιχούν τα 372 €;",
    prob2Step1Formula: "100 % ＋ 24 % ＝ 124 % της καθαρής αξίας.",
    prob2Step2Title: "Βήμα 2: Υπολογισμός καθαρής αξίας (100%)",
    prob2Step2Table: "Με πίνακα (χιαστί): χ ＝ (372 · 100) : 124 ＝ 37.200 : 124 ＝ 300 €",
    prob2Step2Div: "Με διαίρεση: 372 : 1,24 ＝ 300 €",
    prob2VerifyTip: "✓ Επαλήθευση: Το 24% των 300 € είναι 72 €. Τελική τιμή: 300 ＋ 72 ＝ 372 €.",

    bottomTitle: "Ώρα για Εξάσκηση στην Εύρεση Αρχικής Τιμής!",
    bottomDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις υπολογισμού αρχικής αξίας προ έκπτωσης ή προ φόρου και απέφυγε την παγίδα των ποσοστών.",
    startExercises: "🎯 Έναρξη Ασκήσεων",
  },
  en: {
    metaTitle: "Finding the Original Price in Percentages - Grade 6 | LearnMaths.gr",
    metaDesc: "Learn how to calculate the original price when given the final price and the percentage discount or increase, avoiding the common percentage trap.",
    backText: "Grade 6",
    actionBtn: "🎯 Practice",
    badgeChapter: "CHAPTER 52 • GRADE 6",
    headerTitle: "Finding the Original Price",
    headerDesc: "Learn how to calculate the price of an item before a discount or tax (VAT) when you only know the final amount paid and the rate of change, avoiding common mathematical traps.",
    headerFeature: "Theory, The Great Trap & Interactive Original Price Calculator",
    tryExercises: "Try the Exercises",

    stepsTitle: "Methodology in 4 Steps",
    stepsDesc: "How to reliably work backwards to the original price (100%) without making incorrect calculations.",

    step1Badge: "STEP 1",
    step1Type: "Final Percentage",
    step1Title: "What percentage does it represent?",
    step1Text: "The final price is not 100%. It corresponds to a percentage less than or greater than 100%:",
    step1DiscountTitle: "For a 20% Discount:",
    step1DiscountFormula: "We pay 100% － 20% ＝ 80%",
    step1IncreaseTitle: "For a 24% Increase / VAT:",
    step1IncreaseFormula: "We pay 100% ＋ 24% ＝ 124%",
    step1Tip: "💡 First identify what percentage of the original price corresponds to the paid amount.",

    step2Badge: "STEP 2",
    step2Type: "ATTENTION!",
    step2Title: "The Common Trap!",
    step2Text: "If we paid 80 € after a 20% discount, IT IS WRONG to calculate 20% of 80 € and add it back:",
    step2MistakeCalc: "80 ＋ (20% of 80) ＝ 80 ＋ 16 ＝ 96 € (INCORRECT!)",
    step2MistakeExplain: "The 20% was deducted from the original price (which was 100 €) and not from the 80 €!",
    step2Tip: "⚡ Rule: Never apply the percentage directly to the final price to find the original price!",

    step3Badge: "STEP 3",
    step3Type: "Method 1",
    step3Title: "Proportion Table (Cross-Multiplication)",
    step3Text: "Set up a table linking the original price (100) with the final price:",
    step3ColInitial: "Original (€)",
    step3ColFinal: "Final (€)",
    step3RowFinalDiscount: "100 － Discount",
    step3RowFinalLabel: "Final Price",
    step3FormulaText: "x ＝ (Final · 100) : (100 － Discount)",
    step3Tip: "🎯 The table prevents errors by correctly placing variable x under 100.",

    step4Badge: "STEP 4",
    step4Type: "Method 2",
    step4Title: "Decimal Multiplier",
    step4Text: "The fastest method: divide the final price directly by the decimal multiplier of the percentage:",
    step4RuleTitle: "Original ＝ Final : Multiplier",
    step4RuleDisc: "• 20% Discount ➔ Divide by 0.80 (80 : 0.80 ＝ 100 €)",
    step4RuleVat: "• 24% VAT ➔ Divide by 1.24",
    step4Tip: "🚀 A single division directly yields the original price.",

    labBadge: "🔬 INTERACTIVE LAB 1",
    labTitle: "Dynamic Original Price Simulator",
    labDesc: "Choose discount or markup, set the final price and percentage, and watch the original price calculate automatically without errors.",
    modeDiscount: "🔻 Discount",
    modeIncrease: "🔺 Markup / VAT",
    labelFinalPrice: "FINAL PAID PRICE (€)",
    labelPctDiscount: "DISCOUNT RATE (%)",
    labelPctIncrease: "MARKUP RATE (%)",
    labExplainBanner: "The final price of {price} € corresponds to {pct} % of the original value.",
    tableTitle: "PROPORTION TABLE (BASE 100)",
    tableInitialCol: "Original (€)",
    tableFinalCol: "Final (€)",
    tableXFormula: "x ＝ ({final} · 100) : {finalPct} ＝ {init} €",
    resultInitialLabel: "ORIGINAL PRICE (100%)",
    resultDiscountLabel: "DISCOUNT AMOUNT",
    resultIncreaseLabel: "MARKUP AMOUNT",

    examplesTitle: "Solved Problems for Finding Original Price",
    examplesDesc: "Two representative retail shopping problems with step-by-step solutions.",

    prob1Badge: "PROBLEM 1: ORIGINAL PRICE AFTER DISCOUNT",
    prob1Category: "20% Discount",
    prob1Title: "Buying Shoes on Sale",
    prob1Text: "A pair of shoes was sold on sale for 72 € with a 20 % discount. What was the original price of the shoes?",
    prob1Step1Title: "Step 1: What percentage does 72 € correspond to?",
    prob1Step1Formula: "100 % － 20 % ＝ 80 % of the original price.",
    prob1Step2Title: "Step 2: Calculating original price (100%)",
    prob1Step2Table: "Using proportion: x ＝ (72 · 100) : 80 ＝ 7,200 : 80 ＝ 90 €",
    prob1Step2Div: "Using division: 72 : 0.80 ＝ 90 €",
    prob1VerifyTip: "✓ Verification: 20% of 90 € is 18 €. Final price: 90 － 18 ＝ 72 €.",

    prob2Badge: "PROBLEM 2: ORIGINAL PRICE BEFORE TAX (VAT)",
    prob2Category: "24% VAT",
    prob2Title: "Net Value of a Television",
    prob2Text: "The final price of a television including 24 % VAT is 372 €. What was its net original price before tax?",
    prob2Step1Title: "Step 1: What percentage does 372 € correspond to?",
    prob2Step1Formula: "100 % ＋ 24 % ＝ 124 % of net value.",
    prob2Step2Title: "Step 2: Calculating net value (100%)",
    prob2Step2Table: "Using proportion: x ＝ (372 · 100) : 124 ＝ 37,200 : 124 ＝ 300 €",
    prob2Step2Div: "Using division: 372 : 1.24 ＝ 300 €",
    prob2VerifyTip: "✓ Verification: 24% of 300 € is 72 €. Final price: 300 ＋ 72 ＝ 372 €.",

    bottomTitle: "Ready to Practice Finding the Original Price?",
    bottomDesc: "Test your skills on 10 challenging exercises calculating pre-discount and pre-tax values while avoiding percentage traps.",
    startExercises: "🎯 Start Exercises",
  },
};

export default function BriskoArxikiTimiTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Διαδραστικός Υπολογιστής Αρχικής Τιμής
  const [calcType, setCalcType] = useState('discount'); // 'discount' ή 'increase'
  const [finalPrice, setFinalPrice] = useState(80);     // Τελική τιμή σε €
  const [percentage, setPercentage] = useState(20);     // Ποσοστό %

  // Υπολογισμός ποσοστού τελικής τιμής
  const finalPercentage = useMemo(() => {
    return calcType === 'discount' ? 100 - percentage : 100 + percentage;
  }, [calcType, percentage]);

  // Υπολογισμός αρχικής τιμής: (finalPrice * 100) / finalPercentage
  const initialPrice = useMemo(() => {
    if (finalPercentage <= 0) return 0;
    const raw = (finalPrice * 100) / finalPercentage;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [finalPrice, finalPercentage]);

  // Διαφορά (ποσό έκπτωσης ή αύξησης)
  const priceDiff = useMemo(() => {
    return Math.abs(Number((initialPrice - finalPrice).toFixed(2)));
  }, [initialPrice, finalPrice]);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/52-brisko-arxiki-timi-ask"
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
              href="/st-dimotikou/52-brisko-arxiki-timi-ask"
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

            {/* Βήμα 2ο - Η Μεγάλη Παγίδα */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border-2 border-rose-300 shadow-sm flex flex-col justify-between space-y-5 bg-rose-50/20">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-bold text-rose-600">
                    {t.step2Type}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-rose-950">
                  {t.step2Title}
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="bg-white p-3 rounded-2xl border border-rose-200 space-y-1.5 text-xs text-center font-mono">
                  <div className="text-rose-600 font-black line-through">
                    {t.step2MistakeCalc}
                  </div>
                  <p className="text-slate-600 text-[11px] pt-1 font-sans">
                    {t.step2MistakeExplain}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-rose-100/60 rounded-2xl border border-rose-300 text-xs 2xl:text-sm text-rose-950 font-medium">
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
                    <span>{t.step3ColFinal}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5 font-bold text-slate-800">
                    <span>100</span>
                    <span>{t.step3RowFinalDiscount}</span>
                    <span className="text-indigo-600">χ</span>
                    <span>{t.step3RowFinalLabel}</span>
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
                    {t.step4RuleTitle}
                  </div>
                  <p className="text-slate-600 text-[10.5px] font-sans leading-relaxed">
                    {t.step4RuleDisc}<br />
                    {t.step4RuleVat}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΥΠΟΛΟΓΙΣΤΗΣ ΑΡΧΙΚΗΣ ΤΙΜΗΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{t.labBadge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.labTitle}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.labDesc}
              </p>
            </div>

            {/* Διακόπτης Έκπτωσης / Αύξησης */}
            <div className="grid grid-cols-2 sm:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCalcType('discount')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  calcType === 'discount'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.modeDiscount}
              </button>
              <button
                type="button"
                onClick={() => setCalcType('increase')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  calcType === 'increase'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.modeIncrease}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστήρια Τελικής Τιμής & Ποσοστού */}
            <div className="lg:col-span-5 space-y-3.5">
              
              {/* Τελική Τιμή */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider">
                    {t.labelFinalPrice}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(finalPrice, locale)} €
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFinalPrice((prev) => Math.max(10, prev - 5)); }}
                    disabled={finalPrice <= 10}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={10}
                    max={300}
                    step={5}
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFinalPrice((prev) => Math.min(300, prev + 5)); }}
                    disabled={finalPrice >= 300}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Ποσοστό Μεταβολής */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider">
                    {calcType === 'discount' ? t.labelPctDiscount : t.labelPctIncrease}
                  </span>
                  <span className={`font-mono font-black text-base sm:text-lg bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 ${calcType === 'discount' ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {percentage} %
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPercentage((prev) => Math.max(5, prev - 5)); }}
                    disabled={percentage <= 5}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    step={5}
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    className={`w-full cursor-pointer ${calcType === 'discount' ? 'accent-rose-600' : 'accent-emerald-600'}`}
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPercentage((prev) => Math.min(60, prev + 5)); }}
                    disabled={percentage >= 60}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Επεξηγηματική Κάρτα */}
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-950 leading-relaxed">
                {t.labExplainBanner
                  .replace('{price}', formatNum(finalPrice, locale))
                  .replace('{pct}', String(finalPercentage))}
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
                  <span className="bg-indigo-50 py-1 rounded-lg text-indigo-900 truncate">{t.tableFinalCol}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-base sm:text-xl font-black text-slate-800">
                  <div className="bg-slate-100 p-2 rounded-xl">100</div>
                  <div className="bg-slate-100 p-2 rounded-xl">{finalPercentage}</div>
                  <div className="bg-amber-100 p-2 rounded-xl text-amber-950 border border-amber-300 animate-pulse">
                    χ
                  </div>
                  <div className="bg-slate-100 p-2 rounded-xl">{formatNum(finalPrice, locale)}</div>
                </div>
                <div className="text-[11px] sm:text-xs font-sans text-slate-500 pt-1">
                  {t.tableXFormula
                    .replace('{final}', formatNum(finalPrice, locale))
                    .replace('{finalPct}', String(finalPercentage))
                    .replace('{init}', formatNum(initialPrice, locale))}
                </div>
              </div>

              {/* Κάρτες Αποτελεσμάτων */}
              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 bg-white rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 space-y-1">
                  <span className="text-[10.5px] sm:text-xs font-bold text-emerald-900 uppercase block">
                    {t.resultInitialLabel}
                  </span>
                  <div className="font-mono font-black text-lg sm:text-2xl text-emerald-700">
                    {formatNum(initialPrice, locale)} €
                  </div>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10.5px] sm:text-xs font-bold text-slate-500 uppercase block">
                    {calcType === 'discount' ? t.resultDiscountLabel : t.resultIncreaseLabel}
                  </span>
                  <div className="font-mono font-black text-lg sm:text-2xl text-slate-800">
                    {formatNum(priceDiff, locale)} €
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ */}
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
                    100 % － 20 % ＝ <strong className="text-blue-700">80 %</strong> {locale === 'el' ? 'της αρχικής τιμής.' : 'of the original price.'}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">
                    {t.prob1Step2Title}
                  </span>
                  <div>
                    {locale === 'el' ? 'Με πίνακα (χιαστί):' : 'Using proportion:'} χ ＝ (72 · 100) : 80 ＝ {formatNum(7200, locale)} : 80 ＝ <strong className="text-emerald-700 text-sm sm:text-base">90 €</strong>
                  </div>
                  <div>
                    {locale === 'el' ? 'Με διαίρεση:' : 'Using division:'} 72 : {formatNum(0.8, locale, 2)} ＝ <strong className="text-emerald-700 text-sm sm:text-base">90 €</strong>
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
                    100 % ＋ 24 % ＝ <strong className="text-indigo-700">124 %</strong> {locale === 'el' ? 'της καθαρής αξίας.' : 'of the net value.'}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">
                    {t.prob2Step2Title}
                  </span>
                  <div>
                    {locale === 'el' ? 'Με πίνακα (χιαστί):' : 'Using proportion:'} χ ＝ (372 · 100) : 124 ＝ {formatNum(37200, locale)} : 124 ＝ <strong className="text-emerald-700 text-sm sm:text-base">300 €</strong>
                  </div>
                  <div>
                    {locale === 'el' ? 'Με διαίρεση:' : 'Using division:'} 372 : {formatNum(1.24, locale, 2)} ＝ <strong className="text-emerald-700 text-sm sm:text-base">300 €</strong>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] sm:text-xs text-emerald-950 font-medium">
                {t.prob2VerifyTip}
              </div>
            </article>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
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
            href="/st-dimotikou/52-brisko-arxiki-timi-ask"
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
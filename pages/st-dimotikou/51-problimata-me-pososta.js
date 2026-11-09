// pages/st-dimotikou/51-problimata-me-pososta.js
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
    metaTitle: "Προβλήματα με Ποσοστά - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε πώς υπολογίζουμε το ποσό έκπτωσης, αύξησης, κέρδους και την τελική τιμή πληρωμής σε ρεαλιστικά προβλήματα με διαδραστικά εργαστήρια.",
    backText: "ΣΤ' Δημοτικού",
    actionBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 51 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    headerTitle: "Προβλήματα με Ποσοστά",
    headerDesc: "Μαθαίνουμε πώς να υπολογίζουμε το ποσό της έκπτωσης, τον φόρο (Φ.Π.Α.), το κέρδος και την τελική τιμή ενός προϊόντος, εφαρμόζοντας τις μεθόδους των αναλογιών και του πολλαπλασιασμού με κλάσμα.",
    headerFeature: "Θεωρία, Λυμένα Προβλήματα & Διαδραστικός Υπολογιστής Τελικής Τιμής",
    tryExercises: "Δοκίμασε τις Ασκήσεις",

    stepsTitle: "Επίλυση Προβλημάτων Ποσοστών σε 4 Βήματα",
    stepsDesc: "Από την αρχική τιμή στον υπολογισμό της μεταβολής και την τελική πληρωμή.",

    step1Badge: "ΒΗΜΑ 1",
    step1Type: "Ποσό Μεταβολής",
    step1Title: "Υπολογισμός του Ποσοστού",
    step1Text: "Για να βρούμε πόσα ευρώ (€) είναι η έκπτωση ή η αύξηση, πολλαπλασιάζουμε την αρχική τιμή με το κλάσμα του ποσοστού:",
    step1ChangeLabel: "Ποσό Μεταβολής",
    step1BaseLabel: "Αρχική Τιμή",
    step1PctLabel: "Ποσοστό",
    step1Tip: "💡 Παράδειγμα: Το 20% των 80 € είναι (80 · 20) : 100 ＝ 16 €.",

    step2Badge: "ΒΗΜΑ 2",
    step2Type: "Έκπτωση vs Αύξηση",
    step2Title: "Πρόσθεση ή Αφαίρεση;",
    step2Text: "Ανάλογα με το είδος του προβλήματος, ενεργούμε ως εξής:",
    step2DiscountTitle: "Σε Έκπτωση / Ζημιά:",
    step2DiscountFormula: "Τελική Τιμή ＝ Αρχική Τιμή － Έκπτωση",
    step2IncreaseTitle: "Σε Αύξηση / Κέρδος / Φ.Π.Α.:",
    step2IncreaseFormula: "Τελική Τιμή ＝ Αρχική Τιμή ＋ Αύξηση",
    step2Tip: "⚡ Ποτέ δεν ξεχνάμε: Το ποσό της έκπτωσης αφαιρείται, ενώ ο φόρος/αύξηση προστίθεται!",

    step3Badge: "ΒΗΜΑ 3",
    step3Type: "Μέθοδος 1",
    step3Title: "Πίνακας Ποσών (Χιαστί)",
    step3Text: "Στήνουμε πίνακα συγκρίνοντας την αρχική αξία (100) με το ποσοστό ή την τελική τιμή:",
    step3ColInitial: "Αρχική (€)",
    step3ColChange: "Μεταβολή (€)",
    step3Tip: "🎯 χ ＝ (Αρχική Τιμή · Ποσοστό) : 100.",

    step4Badge: "ΒΗΜΑ 4",
    step4Type: "Μέθοδος 2",
    step4Title: "Απευθείας Υπολογισμός",
    step4Text: "Μπορούμε να βρούμε την τελική τιμή σε ένα μόνο βήμα:",
    step4DirectExample: "Έκπτωση 20% ➔ Πληρώνουμε το 80% (0,80)",
    step4DirectFormula: "Τελική τιμή ＝ 80 € · 0,80 ＝ 64 €",
    step4Tip: "🚀 Ταχύτατος υπολογισμός χωρίς ενδιάμεση αφαίρεση.",

    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Δυναμικός Υπολογιστής Έκπτωσης, Αύξησης & Τελικής Τιμής",
    labDesc: "Επιλέξτε αν πρόκειται για έκπτωση ή αύξηση, ορίστε την αρχική τιμή και το ποσοστό, και δείτε πώς υπολογίζεται το ποσό μεταβολής και η τελική τιμή.",
    modeDiscount: "🔻 Έκπτωση",
    modeIncrease: "🔺 Αύξηση / Φ.Π.Α.",
    labelBasePrice: "ΑΡΧΙΚΗ ΤΙΜΗ (€)",
    labelPctDiscount: "ΠΟΣΟΣΤΟ ΕΚΠΤΩΣΗΣ (%)",
    labelPctIncrease: "ΠΟΣΟΣΤΟ ΑΥΞΗΣΗΣ (%)",
    labAmountExplain: "Υπολογισμός ποσού:",
    tableTitle: "ΠΙΝΑΚΑΣ ΠΟΣΩΝ (ΑΝΑΓΩΓΗ ΣΤΑ 100)",
    tableInitialCol: "Αρχική (€)",
    tableDiscountCol: "Έκπτωση (€)",
    tableIncreaseCol: "Αύξηση (€)",
    tableXFormula: "χ ＝ ({base} · {pct}) : 100 ＝ {amt} €",
    resultDiscountLabel: "ΠΟΣΟ ΕΚΠΤΩΣΗΣ",
    resultIncreaseLabel: "ΠΟΣΟ ΑΥΞΗΣΗΣ",
    resultFinalLabel: "ΤΕΛΙΚΗ ΤΙΜΗ",

    examplesTitle: "Λυμένα Προβλήματα με Ποσοστά",
    examplesDesc: "Δύο ολοκληρωμένα παραδείγματα υπολογισμού έκπτωσης και επιβάρυνσης φόρου (Φ.Π.Α.).",

    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΥΠΟΛΟΓΙΣΜΟΣ ΕΚΠΤΩΣΗΣ",
    prob1Category: "Έκπτωση 30%",
    prob1Title: "Αγορά Ποδηλάτου στις Εκπτώσεις",
    prob1Text: "Ένα ποδήλατο κοστίζει αρχικά 180 € και προσφέρεται με έκπτωση 30 %. Πόσα ευρώ θα πληρώσει ο πελάτης;",
    prob1Step1Title: "Βήμα 1: Πόσα ευρώ είναι η έκπτωση;",
    prob1Step1Formula: "Έκπτωση ＝ (180 · 30) : 100 ＝ 5.400 : 100 ＝ 54 €",
    prob1Step2Title: "Βήμα 2: Ποια είναι η τελική τιμή πληρωμής;",
    prob1Step2Formula: "Τελική Τιμή ＝ 180 € － 54 € ＝ 126 €",
    prob1DirectTip: "✓ Απευθείας τρόπος: Πληρώνουμε το 70% (100 － 30). Τελική τιμή ＝ 180 · 0,70 ＝ 126 €.",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΕΠΙΒΑΡΥΝΣΗ Φ.Π.Α.",
    prob2Category: "Φ.Π.Α. 24%",
    prob2Title: "Αγορά Ηλεκτρονικού Υπολογιστή",
    prob2Text: "Η καθαρή αξία ενός υπολογιστή είναι 500 € και επιβαρύνεται με Φ.Π.Α. 24 %. Ποια είναι η τελική τιμή του υπολογιστή;",
    prob2Step1Title: "Βήμα 1: Πόσα ευρώ είναι ο φόρος Φ.Π.Α.;",
    prob2Step1Formula: "Φ.Π.Α. ＝ (500 · 24) : 100 ＝ 12.000 : 100 ＝ 120 €",
    prob2Step2Title: "Βήμα 2: Ποια είναι η τελική τιμή;",
    prob2Step2Formula: "Τελική Τιμή ＝ 500 € ＋ 120 € ＝ 620 €",
    prob2DirectTip: "✓ Απευθείας τρόπος: Τελική τιμή ＝ 500 · 1,24 ＝ 620 €.",

    bottomTitle: "Ώρα για Εξάσκηση στα Προβλήματα με Ποσοστά!",
    bottomDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις υπολογισμού εκπτώσεων, αυξήσεων, φόρων και τελικών τιμών για τη ΣΤ' Δημοτικού.",
    startExercises: "🎯 Έναρξη Ασκήσεων",
  },
  en: {
    metaTitle: "Problems with Percentages - Grade 6 | LearnMaths.gr",
    metaDesc: "Learn how to calculate discounts, markups, profit, and the final payment price in real-world problems using interactive labs.",
    backText: "Grade 6",
    actionBtn: "🎯 Practice",
    badgeChapter: "CHAPTER 51 • GRADE 6",
    headerTitle: "Problems with Percentages",
    headerDesc: "Learn how to calculate the discount amount, VAT / sales tax, profit, and final retail price using proportions and multiplication by fraction.",
    headerFeature: "Theory, Solved Problems & Interactive Final Price Calculator",
    tryExercises: "Try the Exercises",

    stepsTitle: "Solving Percentage Problems in 4 Steps",
    stepsDesc: "From the original price to calculating the change and finding the final amount.",

    step1Badge: "STEP 1",
    step1Type: "Amount of Change",
    step1Title: "Calculating the Percentage Amount",
    step1Text: "To find the amount in euros (€) for the discount or increase, multiply the original price by the fraction of the percentage:",
    step1ChangeLabel: "Amount of Change",
    step1BaseLabel: "Original Price",
    step1PctLabel: "Percentage",
    step1Tip: "💡 Example: 20% of 80 € is (80 · 20) : 100 ＝ 16 €.",

    step2Badge: "STEP 2",
    step2Type: "Discount vs Markup",
    step2Title: "Addition or Subtraction?",
    step2Text: "Depending on the problem context, apply the following rule:",
    step2DiscountTitle: "For Discount / Loss:",
    step2DiscountFormula: "Final Price ＝ Original Price － Discount",
    step2IncreaseTitle: "For Markup / Profit / VAT:",
    step2IncreaseFormula: "Final Price ＝ Original Price ＋ Markup",
    step2Tip: "⚡ Never forget: A discount amount is subtracted, while tax/markup is added!",

    step3Badge: "STEP 3",
    step3Type: "Method 1",
    step3Title: "Proportion Table (Cross-Multiplication)",
    step3Text: "Set up a proportion table comparing base 100 with the percentage change:",
    step3ColInitial: "Original (€)",
    step3ColChange: "Change (€)",
    step3Tip: "🎯 x ＝ (Original Price · Percentage) : 100.",

    step4Badge: "STEP 4",
    step4Type: "Method 2",
    step4Title: "Direct Calculation",
    step4Text: "Calculate the final price directly in a single step:",
    step4DirectExample: "20% discount ➔ We pay 80% (0.80)",
    step4DirectFormula: "Final price ＝ 80 € · 0.80 ＝ 64 €",
    step4Tip: "🚀 Fast calculation without an intermediate subtraction step.",

    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Dynamic Discount, Markup & Final Price Calculator",
    labDesc: "Choose discount or markup, adjust the original price and percentage, and watch the change amount and final price update instantly.",
    modeDiscount: "🔻 Discount",
    modeIncrease: "🔺 Markup / VAT",
    labelBasePrice: "ORIGINAL PRICE (€)",
    labelPctDiscount: "DISCOUNT RATE (%)",
    labelPctIncrease: "MARKUP RATE (%)",
    labAmountExplain: "Amount calculation:",
    tableTitle: "PROPORTION TABLE (BASE 100)",
    tableInitialCol: "Original (€)",
    tableDiscountCol: "Discount (€)",
    tableIncreaseCol: "Markup (€)",
    tableXFormula: "x ＝ ({base} · {pct}) : 100 ＝ {amt} €",
    resultDiscountLabel: "DISCOUNT AMOUNT",
    resultIncreaseLabel: "MARKUP AMOUNT",
    resultFinalLabel: "FINAL PRICE",

    examplesTitle: "Solved Percentage Problems",
    examplesDesc: "Two comprehensive worked examples calculating discount and tax (VAT).",

    prob1Badge: "PROBLEM 1: DISCOUNT CALCULATION",
    prob1Category: "30% Discount",
    prob1Title: "Buying a Bicycle on Sale",
    prob1Text: "A bicycle originally costs 180 € and is offered with a 30 % discount. How much will the customer pay?",
    prob1Step1Title: "Step 1: How much is the discount in euros?",
    prob1Step1Formula: "Discount ＝ (180 · 30) : 100 ＝ 5,400 : 100 ＝ 54 €",
    prob1Step2Title: "Step 2: What is the final payment price?",
    prob1Step2Formula: "Final Price ＝ 180 € － 54 € ＝ 126 €",
    prob1DirectTip: "✓ Direct method: We pay 70% (100 － 30). Final price ＝ 180 · 0.70 ＝ 126 €.",

    prob2Badge: "PROBLEM 2: VAT ADDITION",
    prob2Category: "24% VAT",
    prob2Title: "Purchasing a Computer",
    prob2Text: "The net price of a computer is 500 € and it is subject to 24 % VAT. What is the final price of the computer?",
    prob2Step1Title: "Step 1: How much is the VAT in euros?",
    prob2Step1Formula: "VAT ＝ (500 · 24) : 100 ＝ 12,000 : 100 ＝ 120 €",
    prob2Step2Title: "Step 2: What is the final retail price?",
    prob2Step2Formula: "Final Price ＝ 500 € ＋ 120 € ＝ 620 €",
    prob2DirectTip: "✓ Direct method: Final price ＝ 500 · 1.24 ＝ 620 €.",

    bottomTitle: "Ready to Practice Percentage Problems?",
    bottomDesc: "Test your skills with 10 challenging exercises on discounts, price increases, taxes, and final prices for Grade 6.",
    startExercises: "🎯 Start Exercises",
  },
};

export default function ProblimataMePosostaTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Διαδραστικός Υπολογιστής Ποσοστού & Τελικής Τιμής
  const [calcMode, setCalcMode] = useState('discount'); // 'discount' ή 'increase'
  const [basePrice, setBasePrice] = useState(80);       // Αρχική τιμή σε €
  const [pctRate, setPctRate] = useState(25);           // Ποσοστό %

  // Υπολογισμός ποσού μεταβολής: (basePrice * pctRate) / 100
  const amountChange = useMemo(() => {
    const raw = (basePrice * pctRate) / 100;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [basePrice, pctRate]);

  // Τελική τιμή μετά από έκπτωση ή αύξηση
  const finalPrice = useMemo(() => {
    const res = calcMode === 'discount' ? basePrice - amountChange : basePrice + amountChange;
    return Number.isInteger(res) ? res : Number(res.toFixed(2));
  }, [basePrice, amountChange, calcMode]);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/51-problimata-me-pososta-ask"
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
              href="/st-dimotikou/51-problimata-me-pososta-ask"
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
                  <div className="p-2 bg-white rounded-xl border border-slate-200 font-bold text-slate-800 flex items-center justify-center gap-1.5 flex-wrap">
                    <span>{t.step1ChangeLabel}</span>
                    <span>＝</span>
                    <span>{t.step1BaseLabel}</span>
                    <span>·</span>
                    <Fraction num={t.step1PctLabel} den="100" />
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
                  <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-950 leading-relaxed">
                    🔻 <strong>{t.step2DiscountTitle}</strong><br />
                    {t.step2DiscountFormula}
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 leading-relaxed">
                    🔺 <strong>{t.step2IncreaseTitle}</strong><br />
                    {t.step2IncreaseFormula}
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

                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 font-mono text-xs space-y-1.5 text-center">
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-1 font-bold text-slate-600 text-[11px]">
                    <span>{t.step3ColInitial}</span>
                    <span>{t.step3ColChange}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5 font-bold text-slate-800">
                    <span>100</span>
                    <span>{t.step1PctLabel} %</span>
                    <span>{t.step1BaseLabel}</span>
                    <span className="text-indigo-600">χ</span>
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
                    {t.step4DirectExample}
                  </div>
                  <p className="text-slate-600 text-[11px] font-sans">
                    {t.step4DirectFormula}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΥΠΟΛΟΓΙΣΤΗΣ ΠΟΣΟΣΤΟΥ & ΤΕΛΙΚΗΣ ΤΙΜΗΣ */}
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
                onClick={() => setCalcMode('discount')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  calcMode === 'discount'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.modeDiscount}
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('increase')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  calcMode === 'increase'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.modeIncrease}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστήρια Αρχικής Τιμής & Ποσοστού */}
            <div className="lg:col-span-5 space-y-3.5">
              
              {/* Αρχική Τιμή */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider">
                    {t.labelBasePrice}
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(basePrice, locale)} €
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBasePrice((prev) => Math.max(10, prev - 5)); }}
                    disabled={basePrice <= 10}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={10}
                    max={300}
                    step={5}
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBasePrice((prev) => Math.min(300, prev + 5)); }}
                    disabled={basePrice >= 300}
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
                    {calcMode === 'discount' ? t.labelPctDiscount : t.labelPctIncrease}
                  </span>
                  <span className={`font-mono font-black text-base sm:text-lg bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 ${calcMode === 'discount' ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {pctRate} %
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPctRate((prev) => Math.max(5, prev - 5)); }}
                    disabled={pctRate <= 5}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    step={5}
                    value={pctRate}
                    onChange={(e) => setPctRate(Number(e.target.value))}
                    className={`w-full cursor-pointer ${calcMode === 'discount' ? 'accent-rose-600' : 'accent-emerald-600'}`}
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPctRate((prev) => Math.min(60, prev + 5)); }}
                    disabled={pctRate >= 60}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Επεξηγηματική Κάρτα */}
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-950 leading-relaxed">
                {t.labAmountExplain} ({formatNum(basePrice, locale)} · {pctRate}) : 100 ＝ <strong>{formatNum(amountChange, locale)} €</strong>.
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
                  <span className={`py-1 rounded-lg truncate ${calcMode === 'discount' ? 'bg-rose-50 text-rose-900' : 'bg-emerald-50 text-emerald-900'}`}>
                    {calcMode === 'discount' ? t.tableDiscountCol : t.tableIncreaseCol}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-base sm:text-xl font-black text-slate-800">
                  <div className="bg-slate-100 p-2 rounded-xl">100</div>
                  <div className="bg-slate-100 p-2 rounded-xl">{pctRate}</div>
                  <div className="bg-slate-100 p-2 rounded-xl">{formatNum(basePrice, locale)}</div>
                  <div className="bg-amber-100 p-2 rounded-xl text-amber-950 border border-amber-300 animate-pulse">
                    χ
                  </div>
                </div>
                <div className="text-[11px] sm:text-xs font-sans text-slate-500 pt-1">
                  χ ＝ ({formatNum(basePrice, locale)} · {pctRate}) : 100 ＝ <strong>{formatNum(amountChange, locale)} €</strong>
                </div>
              </div>

              {/* Κάρτες Αποτελεσμάτων */}
              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10.5px] sm:text-xs font-bold text-slate-500 uppercase block">
                    {calcMode === 'discount' ? t.resultDiscountLabel : t.resultIncreaseLabel}
                  </span>
                  <div className={`font-mono font-black text-lg sm:text-2xl ${calcMode === 'discount' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {formatNum(amountChange, locale)} €
                  </div>
                </div>

                <div className="p-3 bg-white rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 space-y-1">
                  <span className="text-[10.5px] sm:text-xs font-bold text-emerald-900 uppercase block">
                    {t.resultFinalLabel}
                  </span>
                  <div className="font-mono font-black text-lg sm:text-2xl text-emerald-700">
                    {formatNum(finalPrice, locale)} €
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
                    {locale === 'el' ? 'Έκπτωση' : 'Discount'} ＝ (180 · 30) : 100 ＝ {formatNum(5400, locale)} : 100 ＝ <strong className="text-rose-700">54 €</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">
                    {t.prob1Step2Title}
                  </span>
                  <div>
                    {locale === 'el' ? 'Τελική Τιμή' : 'Final Price'} ＝ 180 € － 54 € ＝ <strong className="text-emerald-700 text-sm sm:text-base">126 €</strong>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] sm:text-xs text-emerald-950 font-medium">
                {t.prob1DirectTip}
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
                    {locale === 'el' ? 'Φ.Π.Α.' : 'VAT'} ＝ (500 · 24) : 100 ＝ {formatNum(12000, locale)} : 100 ＝ <strong className="text-indigo-700">120 €</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">
                    {t.prob2Step2Title}
                  </span>
                  <div>
                    {locale === 'el' ? 'Τελική Τιμή' : 'Final Price'} ＝ 500 € ＋ 120 € ＝ <strong className="text-emerald-700 text-sm sm:text-base">620 €</strong>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] sm:text-xs text-emerald-950 font-medium">
                {t.prob2DirectTip}
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
            href="/st-dimotikou/51-problimata-me-pososta-ask"
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
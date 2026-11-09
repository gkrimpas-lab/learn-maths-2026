// pages/e-dimotikou/12-pososta.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Συνάρτηση για άτονα κεφαλαία με εξαίρεση το Ε'
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

// Οπτική απόδοση κλάσματος (αριθμητής πάνω, κλασματική γραμμή, παρονομαστής κάτω)
function MathFraction({ numerator, denominator, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none ${className}`}>
      <span className="px-1 text-center border-b-[1.5px] border-current w-full pb-0.5">
        {numerator}
      </span>
      <span className="px-1 text-center pt-0.5 w-full">
        {denominator}
      </span>
    </span>
  );
}

const I18N = {
  el: {
    pageTitle: "Ποσοστά (% και ‰) - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθετε την έννοια του ποσοστού, τη σύνδεση με τα κλάσματα και τους δεκαδικούς, πώς υπολογίζουμε το ποσοστό ενός ποσού και δοκιμάστε το διαδραστικό εργαστήριο.",
    backText: "Ε' Δημοτικού",
    actionButton: "Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 12 • Ε' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Ποσοστά (% και ‰)",
    heroSubtitle: "Ανακαλύπτουμε τι εκφράζει το ποσοστό, πώς μετατρέπεται σε κλάσμα με παρονομαστή το 100 και σε δεκαδικό αριθμό, πώς υπολογίζουμε το ποσοστό οποιασδήποτε ποσότητας και πώς εφαρμόζεται σε εκπτώσεις και αυξήσεις.",
    heroStatus: "Θεωρία, Πλέγμα 100 & Υπολογιστής Ποσού",
    heroAction: "Δοκίμασε τις Ασκήσεις",

    stepsSectionTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsSectionSubtitle: "Η μαθηματική γλώσσα των ποσοστών και οι κανόνες υπολογισμού τους.",

    step1Badge: "ΒΗΜΑ 1",
    step1Type: "Ορισμός",
    step1Title: "Τι είναι το Ποσοστό;",
    step1P1: "Ποσοστό είναι ένα κλάσμα που δείχνει πόσα μέρη παίρνουμε",
    step1P1Bold: "από τα 100 ίσα μέρη",
    step1P1End: "στα οποία χωρίζουμε μια μονάδα ή ένα σύνολο.",
    step1ExampleIntro: "Συμβολίζεται με το σύμβολο % (επί τοις εκατό):",
    step1ExampleNote: "Αν χωρίσουμε ένα τετράγωνο σε 100 ίσα κουτάκια, το 25% σημαίνει ότι χρωματίζουμε ακριβώς τα 25 από αυτά.",
    step1Tip: "Το σύνολο (το όλο) εκφράζεται πάντα με το 100% (δηλαδή 100/100 ＝ 1).",

    step2Badge: "ΒΗΜΑ 2",
    step2Type: "Τριπλή Μορφή",
    step2Title: "Ποσοστό, Κλάσμα, Δεκαδικός",
    step2Intro: "Κάθε ποσοστό μπορεί να γραφτεί με 3 ισοδύναμους τρόπους που εκφράζουν ακριβώς την ίδια αξία:",
    step2Tip: "Για να μετατρέψουμε ποσοστό σε δεκαδικό, διαιρούμε με το 100 (μετακινούμε την υποδιαστολή 2 θέσεις αριστερά).",

    step3Badge: "ΒΗΜΑ 3",
    step3Type: "Υπολογισμός",
    step3Title: "Ποσοστό πάνω σε ένα Ποσό",
    step3Intro: "Για να βρούμε το ποσοστό ενός ποσού,",
    step3IntroBold: "πολλαπλασιάζουμε το ποσό με το κλάσμα του ποσοστού:",
    step3ExampleQ: "Πόσο είναι το 20% των 150 €;",
    step3Alternative: "Εναλλακτικά με δεκαδικό:",
    step3TipTitle: "Κανόνας:",
    step3TipDesc: "Ποσό · Ποσοστό ： 100.",

    step4Badge: "ΒΗΜΑ 4",
    step4Type: "Εφαρμογές",
    step4Title: "Έκπτωση & Αύξηση Τιμής",
    step4Intro: "Στην καθημερινή ζωή, αφού υπολογίσουμε την αξία του ποσοστού, κάνουμε αφαίρεση ή πρόσθεση:",
    step4DiscountTitle: "Έκπτωση (Μείωση):",
    step4DiscountDesc: "Αφαιρούμε την έκπτωση από την αρχική τιμή:",
    step4DiscountFormula: "Τελική Τιμή ＝ Αρχική Τιμή － Έκπτωση",
    step4MarkupTitle: "Αύξηση (ΦΠΑ / Κέρδος):",
    step4MarkupDesc: "Προσθέτουμε την αύξηση στην αρχική τιμή:",
    step4MarkupFormula: "Τελική Τιμή ＝ Αρχική Τιμή ＋ Αύξηση",
    step4Tip: "Αν ένα προϊόν 80 € έχει έκπτωση 25% (20 €), η νέα τιμή του είναι: 80 － 20 ＝ 60 €.",

    lab1Badge: "ΜΕΡΟΣ 1ο",
    lab1Title: "Η Οπτική Έννοια του Ποσοστού (Πλέγμα 100)",
    lab1Subtitle: "Άλλαξε το ποσοστό και δες πόσα από τα 100 τετραγωνάκια χρωματίζονται, καθώς και την αυτόματη αντιστοίχιση σε κλάσμα και δεκαδικό.",
    pctLabel: "Ποσοστό (%):",
    btnDecr5: "Μείωση ποσοστού κατά 5",
    btnIncr5: "Αύξηση ποσοστού κατά 5",
    symbolLabel: "ΣΥΜΒΟΛΟ",
    fractionLabel: "ΚΛΑΣΜΑ",
    decimalLabel: "ΔΕΚΑΔΙΚΟΣ",

    lab2Badge: "ΜΕΡΟΣ 2ο",
    lab2Title: "Υπολογισμός Ποσοστού πάνω σε ένα Ποσό",
    lab2Subtitle: "Ρύθμισε ελεύθερα το συνολικό ποσό και το ποσοστό για να δεις τη βήμα-βήμα μαθηματική επίλυση και τη γραφική μπάρα.",
    ctrl1Title: "1. ΣΥΝΟΛΙΚΟ ΠΟΣΟ",
    ctrl2Title: "2. ΠΟΣΟΣΤΟ (%)",
    btnDecr20: "Μείωση ποσού κατά 20",
    btnIncr20: "Αύξηση ποσού κατά 20",
    mathSolutionHeader: "Η ΜΑΘΗΜΑΤΙΚΗ ΕΠΙΛΥΣΗ",
    conclusionPart1: "Το",
    conclusionPart2: "του ποσού",
    conclusionPart3: "ισούται ακριβώς με:",

    ctaTitle: "Ώρα για Εξάσκηση στα Ποσοστά!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού ποσοστού, μετατροπές κλασμάτων και πραγματικά προβλήματα εκπτώσεων και αυξήσεων.",
    ctaButton: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Percentages (% and ‰) - 5th Grade | LearnMaths.gr",
    pageDescription: "Understand the concept of percentages, connection to fractions and decimals, calculating percent of a quantity, and try the interactive lab.",
    backText: "5th Grade",
    actionButton: "Practice",
    badgeChapter: "CHAPTER 12 • 5TH GRADE",
    heroTitle: "Percentages (% and ‰)",
    heroSubtitle: "Discover what a percentage represents, how it converts to a fraction with denominator 100 and a decimal, how to calculate percent of an amount, and how it applies to discounts and markups.",
    heroStatus: "Theory, 100-Grid & Value Calculator",
    heroAction: "Try the Practice Problems",

    stepsSectionTitle: "Core Concepts in 4 Steps",
    stepsSectionSubtitle: "The mathematical language of percentages and rules for calculating them.",

    step1Badge: "STEP 1",
    step1Type: "Definition",
    step1Title: "What is a Percentage?",
    step1P1: "A percentage is a fraction showing how many parts we take",
    step1P1Bold: "out of 100 equal parts",
    step1P1End: "into which a unit or set is divided.",
    step1ExampleIntro: "It is represented with the % symbol (per cent):",
    step1ExampleNote: "If we split a square into 100 equal boxes, 25% means shading exactly 25 of them.",
    step1Tip: "The whole is always expressed as 100% (that is, 100/100 ＝ 1).",

    step2Badge: "STEP 2",
    step2Type: "Triple Form",
    step2Title: "Percent, Fraction, Decimal",
    step2Intro: "Every percentage can be written in 3 equivalent ways that represent the exact same value:",
    step2Tip: "To convert a percentage to a decimal, divide by 100 (shift the decimal point 2 places to the left).",

    step3Badge: "STEP 3",
    step3Type: "Calculation",
    step3Title: "Percentage of an Amount",
    step3Intro: "To find the percentage of an amount,",
    step3IntroBold: "we multiply the amount by the percentage fraction:",
    step3ExampleQ: "What is 20% of 150 €?",
    step3Alternative: "Alternatively using decimals:",
    step3TipTitle: "Rule:",
    step3TipDesc: "Amount · Percentage ： 100.",

    step4Badge: "STEP 4",
    step4Type: "Applications",
    step4Title: "Discounts & Price Increases",
    step4Intro: "In everyday life, once we determine the percentage value, we subtract or add:",
    step4DiscountTitle: "Discount (Reduction):",
    step4DiscountDesc: "Subtract the discount from the original price:",
    step4DiscountFormula: "Final Price ＝ Original Price － Discount",
    step4MarkupTitle: "Markup (VAT / Profit):",
    step4MarkupDesc: "Add the increase to the original price:",
    step4MarkupFormula: "Final Price ＝ Original Price ＋ Markup",
    step4Tip: "If an 80 € item has a 25% discount (20 €), its new price is: 80 － 20 ＝ 60 €.",

    lab1Badge: "PART 1",
    lab1Title: "Visual Concept of Percentage (100-Grid)",
    lab1Subtitle: "Change the percentage to see how many of the 100 cells are shaded, along with automatic mapping to fraction and decimal forms.",
    pctLabel: "Percentage (%):",
    btnDecr5: "Decrease percentage by 5",
    btnIncr5: "Increase percentage by 5",
    symbolLabel: "SYMBOL",
    fractionLabel: "FRACTION",
    decimalLabel: "DECIMAL",

    lab2Badge: "PART 2",
    lab2Title: "Calculating Percentage of an Amount",
    lab2Subtitle: "Adjust the total amount and percentage to observe step-by-step mathematical working and the visual proportion bar.",
    ctrl1Title: "1. TOTAL AMOUNT",
    ctrl2Title: "2. PERCENTAGE (%)",
    btnDecr20: "Decrease amount by 20",
    btnIncr20: "Increase amount by 20",
    mathSolutionHeader: "MATHEMATICAL WORKING",
    conclusionPart1: "",
    conclusionPart2: "% of the amount",
    conclusionPart3: "equals exactly:",

    ctaTitle: "Time to Practice Percentages!",
    ctaDesc: "Test your skills with percentage calculation exercises, fraction conversions, and practical discount/markup word problems.",
    ctaButton: "Start Exercises"
  }
};

export default function PosostaTheoryPage() {
  const router = useRouter();
  const { locale } = router;
  const isEn = locale === 'en';
  const t = isEn ? I18N.en : I18N.el;
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  // Μέρος 1ο: State για την έννοια του ποσοστού (πλέγμα 100)
  const [pct1, setPct1] = useState(25);

  // Μέρος 2ο: State για τον υπολογισμό πάνω σε ποσό
  const [amount, setAmount] = useState(280);
  const [pct2, setPct2] = useState(35);

  // Υπολογισμοί Μέρους 2
  const rawCalc = (amount * pct2) / 100;
  const calculatedValue = rawCalc.toLocaleString(numberLocale, {
    minimumFractionDigits: Number.isInteger(rawCalc) ? 0 : 2,
    maximumFractionDigits: 2
  });
  const mathStep1 = amount * pct2;

  // Δημιουργία των 100 κουτιών για το πλέγμα
  const gridBoxes = Array.from({ length: 100 }, (_, i) => i < pct1);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/12-pososta-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.actionButton}</span>
        </Link>
      }
    >
      {/* Container πλήρους εύρους σύμφωνα με τις προδιαγραφές */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 2xl:space-y-14">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.badgeChapter)}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.heroSubtitle}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.heroStatus}</span>
            </div>
            <Link
              href="/e-dimotikou/12-pososta-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>{t.heroAction}</span>
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
                    {t.step1Type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1P1} <strong>{t.step1P1Bold}</strong> {t.step1P1End}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    {t.step1ExampleIntro}
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-slate-900 shadow-inner text-center flex items-center justify-center gap-1.5 flex-wrap">
                    <span>25% ＝</span>
                    <MathFraction numerator="25" denominator="100" />
                    <span>＝ {(0.25).toLocaleString(numberLocale, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <p className="text-slate-500 text-xs">
                    {t.step1ExampleNote}
                  </p>
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
                    {t.step2Type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Intro}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono">
                  {[
                    { pct: '50%', num: '50', den: '100', simpNum: '1', simpDen: '2', dec: 0.5 },
                    { pct: '25%', num: '25', den: '100', simpNum: '1', simpDen: '4', dec: 0.25 },
                    { pct: '75%', num: '75', den: '100', simpNum: '3', simpDen: '4', dec: 0.75 }
                  ].map((row, idx) => (
                    <div
                      key={`row-${idx}`}
                      className="p-2 sm:p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-1 text-center"
                    >
                      <span className="text-blue-700 font-bold w-12 shrink-0">{row.pct}</span>
                      <span className="text-slate-400 font-sans">＝</span>
                      <div className="flex items-center justify-center gap-1 text-slate-800 font-semibold tracking-tight">
                        <MathFraction numerator={row.num} denominator={row.den} />
                        <span className="text-slate-500 font-normal flex items-center">
                          (<MathFraction numerator={row.simpNum} denominator={row.simpDen} />)
                        </span>
                      </div>
                      <span className="text-slate-400 font-sans">＝</span>
                      <span className="text-emerald-700 font-bold w-12 shrink-0 text-right">
                        {row.dec.toLocaleString(numberLocale, { minimumFractionDigits: row.dec === 0.5 ? 1 : 2 })}
                      </span>
                    </div>
                  ))}
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
                    {t.step3Type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Intro} <strong>{t.step3IntroBold}</strong>
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <p className="text-slate-700 font-sans font-semibold">{t.step3ExampleQ}</p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-center text-indigo-950 shadow-inner flex flex-wrap items-center justify-center gap-1.5 leading-none">
                    <span>150 ·</span>
                    <MathFraction numerator="20" denominator="100" />
                    <span>＝</span>
                    <MathFraction numerator="150 · 20" denominator="100" />
                    <span>＝</span>
                    <MathFraction numerator={(3000).toLocaleString(numberLocale)} denominator="100" />
                    <span>＝ {(30).toLocaleString(numberLocale)} €</span>
                  </div>
                  <p className="text-slate-500 text-xs font-sans">
                    {t.step3Alternative} 150 · {(0.2).toLocaleString(numberLocale, { minimumFractionDigits: 2 })} ＝ {(30).toLocaleString(numberLocale)} €.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 <strong>{t.step3TipTitle}</strong> {t.step3TipDesc}
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
                    {t.step4Type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Intro}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <strong>{t.step4DiscountTitle}</strong> {t.step4DiscountDesc}<br />
                    <span className="font-mono font-bold">{t.step4DiscountFormula}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    <strong>{t.step4MarkupTitle}</strong> {t.step4MarkupDesc}<br />
                    <span className="font-mono font-bold">{t.step4MarkupFormula}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ: ΜΕΡΟΣ 1 & ΜΕΡΟΣ 2 */}
        <section className="space-y-10">
          {/* ΜΕΡΟΣ 1: ΠΛΕΓΜΑ 100 ΚΟΥΤΙΩΝ */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🎨 {toCleanUppercase(t.lab1Badge)}</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab1Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab1Subtitle}
              </p>
            </div>

            {/* Stepper Ποσοστού 1 */}
            <div className="max-w-xl mx-auto bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.pctLabel}</span>
                <span className="min-w-[72px] text-center font-mono font-black text-xl text-sky-600 bg-white px-2 py-0.5 rounded-lg border border-sky-200 shadow-sm">
                  {pct1.toLocaleString(numberLocale)}%
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label={t.btnDecr5}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPct1((prev) => Math.max(0, prev - 5));
                  }}
                  disabled={pct1 <= 0}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                >
                  －5
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={pct1}
                  onChange={(e) => setPct1(Number(e.target.value))}
                  aria-label={t.pctLabel}
                  className="w-full min-w-0 max-w-full accent-sky-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label={t.btnIncr5}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPct1((prev) => Math.min(100, prev + 5));
                  }}
                  disabled={pct1 >= 100}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                >
                  ＋5
                </button>
              </div>

              {/* Γρήγορα κουμπιά βασικών ποσοστών */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {[10, 20, 25, 50, 75, 100].map((val) => (
                  <button
                    key={`quick-pct-${val}`}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPct1(val);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                      pct1 === val
                        ? 'bg-sky-600 text-white'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {val.toLocaleString(numberLocale)}%
                  </button>
                ))}
              </div>
            </div>

            {/* Πλέγμα 100 κουτιών και Τριπλή Αναπαράσταση */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12 pt-2">
              {/* Πλέγμα 10x10 */}
              <div className="w-full max-w-[280px] aspect-square p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-10 gap-1">
                {gridBoxes.map((isFilled, idx) => (
                  <div
                    key={`grid-box-${idx}`}
                    className={`aspect-square rounded-sm transition-colors duration-150 ${
                      isFilled ? 'bg-sky-500 shadow-xs' : 'bg-slate-200/70'
                    }`}
                  ></div>
                ))}
              </div>

              {/* 3 Κάρτες Ισοδυναμίας */}
              <div className="grid grid-cols-3 md:grid-cols-1 gap-3 w-full max-w-md md:max-w-[220px]">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs flex flex-col justify-center items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {toCleanUppercase(t.symbolLabel)}
                  </span>
                  <span className="text-xl 2xl:text-2xl font-black font-mono text-slate-900 mt-1">
                    {pct1.toLocaleString(numberLocale)}%
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs flex flex-col justify-center items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {toCleanUppercase(t.fractionLabel)}
                  </span>
                  <div className="flex flex-col items-center font-mono font-black text-base text-slate-900 mt-1 leading-none">
                    <MathFraction numerator={pct1.toLocaleString(numberLocale)} denominator="100" />
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs flex flex-col justify-center items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {toCleanUppercase(t.decimalLabel)}
                  </span>
                  <span className="text-xl 2xl:text-2xl font-black font-mono text-slate-900 mt-1">
                    {(pct1 / 100).toLocaleString(numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ΜΕΡΟΣ 2: ΥΠΟΛΟΓΙΣΜΟΣ ΠΟΣΟΣΤΟΥ ΠΑΝΩ ΣΕ ΠΟΣΟ */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>🧮 {toCleanUppercase(t.lab2Badge)}</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab2Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab2Subtitle}
              </p>
            </div>

            {/* Δύο Χειριστήρια Steppers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Χειριστήριο Ποσού */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs 2xl:text-sm font-black uppercase text-slate-600 tracking-wider">
                    {toCleanUppercase(t.ctrl1Title)}
                  </span>
                  <span className="min-w-[72px] text-center font-mono font-black text-xl text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200 shadow-sm">
                    {amount.toLocaleString(numberLocale)}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.btnDecr20}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAmount((prev) => Math.max(10, prev - 20));
                    }}
                    disabled={amount <= 10}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    －20
                  </button>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    aria-label={t.ctrl1Title}
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label={t.btnIncr20}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAmount((prev) => Math.min(1000, prev + 20));
                    }}
                    disabled={amount >= 1000}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    ＋20
                  </button>
                </div>
              </div>

              {/* Χειριστήριο Ποσοστού 2 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs 2xl:text-sm font-black uppercase text-slate-600 tracking-wider">
                    {toCleanUppercase(t.ctrl2Title)}
                  </span>
                  <span className="min-w-[72px] text-center font-mono font-black text-xl text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-sm">
                    {pct2.toLocaleString(numberLocale)}%
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.btnDecr5}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPct2((prev) => Math.max(0, prev - 5));
                    }}
                    disabled={pct2 <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    －5
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={pct2}
                    onChange={(e) => setPct2(Number(e.target.value))}
                    aria-label={t.ctrl2Title}
                    className="w-full min-w-0 max-w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label={t.btnIncr5}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPct2((prev) => Math.min(100, prev + 5));
                    }}
                    disabled={pct2 >= 100}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    ＋5
                  </button>
                </div>
              </div>
            </div>

            {/* Οπτική Μπάρα Αναλογίας */}
            <div className="max-w-4xl mx-auto bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-500">
                <span>0%</span>
                <span className="text-emerald-700 font-black text-sm">{pct2.toLocaleString(numberLocale)}%</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-slate-200 h-6 rounded-xl overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full transition-all duration-200 rounded-xl"
                  style={{ width: `${pct2}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-mono font-bold text-slate-600 pt-0.5">
                <span>0</span>
                <span className="text-blue-700 font-black text-sm">{calculatedValue}</span>
                <span>{amount.toLocaleString(numberLocale)}</span>
              </div>
            </div>

            {/* Αναλυτική Μαθηματική Επίλυση */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto text-center space-y-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                {toCleanUppercase(t.mathSolutionHeader)}
              </span>

              <div className="flex flex-wrap items-center justify-center gap-3 font-mono font-black text-lg sm:text-xl text-slate-800 leading-none">
                <span className="text-blue-600 text-2xl">{amount.toLocaleString(numberLocale)}</span>
                <span className="font-sans text-slate-400">·</span>
                <div className="text-emerald-600">
                  <MathFraction numerator={pct2.toLocaleString(numberLocale)} denominator="100" />
                </div>
                <span className="font-sans text-slate-400">＝</span>
                <div className="text-slate-700 text-base">
                  <MathFraction
                    numerator={`${amount.toLocaleString(numberLocale)} · ${pct2.toLocaleString(numberLocale)}`}
                    denominator="100"
                  />
                </div>
                <span className="font-sans text-slate-400">＝</span>
                <div className="text-slate-700 text-base">
                  <MathFraction numerator={mathStep1.toLocaleString(numberLocale)} denominator="100" />
                </div>
                <span className="font-sans text-slate-400">＝</span>
                <span className="bg-emerald-600 text-white p-2 px-4 rounded-xl shadow-sm text-2xl animate-pulse">
                  {calculatedValue}
                </span>
              </div>
            </div>

            {/* Callout Συμπεράσματος */}
            <div className="p-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 text-white rounded-2xl text-center font-bold text-xs sm:text-sm 2xl:text-base shadow-sm max-w-2xl mx-auto">
              🎯 {t.conclusionPart1 && `${t.conclusionPart1} `}
              <span className="text-amber-300 font-black font-mono">{pct2.toLocaleString(numberLocale)}%</span>{' '}
              {t.conclusionPart2}{' '}
              <span className="text-amber-300 font-black font-mono">{amount.toLocaleString(numberLocale)}</span>{' '}
              {t.conclusionPart3}{' '}
              <span className="text-amber-300 text-xl font-black font-mono ml-1">{calculatedValue}</span>!
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
            href="/e-dimotikou/12-pososta-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {t.ctaButton}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
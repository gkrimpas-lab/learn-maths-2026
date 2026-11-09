// pages/e-dimotikou/11-mesitimi.js
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

const LIMITS = {
  VAL_MIN: 1,
  VAL_MAX: 12
};

const I18N = {
  el: {
    pageTitle: "Μέση Τιμή (Μέσος Όρος) - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Πλήρης θεωρία με παραδείγματα για τη Μέση Τιμή, τον τρόπο υπολογισμού, τις αντίστροφες πράξεις και διαδραστικό ιστόγραμμα για την Ε' Δημοτικού.",
    backText: "Ε' Δημοτικού",
    actionButton: "Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 11 • Ε' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Μέση Τιμή (Μέσος Όρος)",
    heroSubtitle: "Μαθαίνουμε τι εκφράζει η μέση τιμή, πώς ισομοιράζει δίκαια άνισες ποσότητες, πώς υπολογίζεται με τη διαίρεση του αθροίσματος διά του πλήθους και πώς λύνουμε αντίστροφα προβλήματα.",
    heroStatus: "Θεωρία & Ζωντανό Ιστόγραμμα Ισομοιρασιάς",
    heroAction: "Δοκίμασε τις Ασκήσεις",

    stepsSectionTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsSectionSubtitle: "Η μαθηματική προσέγγιση της ισοκατανομής και οι πρακτικές εφαρμογές της.",

    step1Badge: "ΒΗΜΑ 1",
    step1Type: "Έννοια",
    step1Title: "Τι είναι η Μέση Τιμή;",
    step1P1: "Μέση τιμή (ή μέσος όρος) είναι η μοναδική τιμή που θα είχε κάθε ποσότητα αν",
    step1P1Bold: "μοιράζαμε το συνολικό άθροισμα απολύτως δίκαια και ισότιμα",
    step1P1End: "σε όλες τις ομάδες.",
    step1ExampleIntro: "Αν τρία παιδιά έχουν 4, 9 και 5 μήλα αντίστοιχα:",
    step1Apples: "μήλα",
    step1ExampleNote: "Αν τα μάζευαν όλα μαζί και τα μοίραζαν ίσα, καθένας θα έπαιρνε ακριβώς 6 μήλα.",
    step1Tip: "Η μέση τιμή εξομαλύνει τις διαφορές και εκπροσωπεί ολόκληρο το σύνολο δεδομένων με έναν μόνο αριθμό.",

    step2Badge: "ΒΗΜΑ 2",
    step2Type: "Ο Μαθηματικός Τύπος",
    step2Title: "Πώς Υπολογίζεται (2 Βήματα)",
    step2Intro: "Ο υπολογισμός της μέσης τιμής εκτελείται πάντα σε δύο διαδοχικές πράξεις:",
    step2Step1Title: "1ο Βήμα (Πρόσθεση):",
    step2Step1Desc: "Προσθέτουμε όλες τις επιμέρους τιμές για να βρούμε το συνολικό άθροισμα.",
    step2Step2Title: "2ο Βήμα (Διαίρεση):",
    step2Step2Desc: "Διαιρούμε το συνολικό άθροισμα με το πλήθος των τιμών.",
    step2FormulaMean: "Μέση Τιμή",
    step2FormulaSum: "Άθροισμα Τιμών",
    step2FormulaCount: "Πλήθος Τιμών",
    step2Tip: "Η μέση τιμή δεν είναι απαραίτητα ακέραιος! Πολύ συχνά είναι δεκαδικός αριθμός (π.χ. 7,4 βαθμοί).",

    step3Badge: "ΒΗΜΑ 3",
    step3Type: "Αντίστροφο Πρόβλημα",
    step3Title: "Εύρεση του Συνολικού Αθροίσματος",
    step3Intro: "Όταν γνωρίζουμε τη μέση τιμή και το πλήθος των ομάδων, βρίσκουμε το συνολικό άθροισμα με",
    step3IntroBold: "πολλαπλασιασμό:",
    step3FormulaTotal: "Συνολικό Άθροισμα",
    step3FormulaMean: "Μέση Τιμή",
    step3FormulaCount: "Πλήθος",
    step3ExampleLabel: "Παράδειγμα:",
    step3ExampleText1: "Αν 4 μαθητές έχουν μέσο όρο βαθμολογίας 18, τότε όλοι μαζί συγκέντρωσαν: 18 · 4 ＝",
    step3ExampleText2: "72 βαθμούς.",
    step3Tip: "Αυτός ο κανόνας μάς επιτρέπει να βρίσκουμε μια άγνωστη τιμή αν γνωρίζουμε όλες τις υπόλοιπες και τον μέσο όρο.",

    step4Badge: "ΒΗΜΑ 4",
    step4Type: "Ιδιότητες",
    step4Title: "Τα Όρια της Μέσης Τιμής",
    step4Intro: "Η μέση τιμή βρίσκεται πάντα ανάμεσα στη μικρότερη και τη μεγαλύτερη τιμή των δεδομένων:",
    step4Min: "Ελάχιστη Τιμή",
    step4Mean: "Μέση Τιμή",
    step4Max: "Μέγιστη Τιμή",
    step4Note: "Αν οι βαθμοί σου είναι 15, 17 και 19, ο μέσος όρος είναι αδύνατον να βγει μικρότερος από 15 ή μεγαλύτερος από 19!",
    step4TipTitle: "Γρήγορος Έλεγχος:",
    step4TipDesc: "Αν υπολογίσεις μέση τιμή που είναι έξω από τα άκρα των δεδομένων, έχεις σίγουρα κάνει λάθος στην πράξη.",

    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Ζωντανό Ιστόγραμμα & Γραμμή Μέσου Όρου",
    labSubtitle: "Επίλεξε το πλήθος των ομάδων (2 έως 6) και αυξομείωσε τις τιμές τους. Παρατήρησε πώς η διακεκομμένη γραμμή ισορροπεί δυναμικά ανάμεσα στις στήλες.",
    groupsText: "Ομάδες",
    groupsTextShort: "Ομ.",
    groupValuesHeader: "ΤΙΜΕΣ ΟΜΑΔΩΝ",
    calcHeader: "ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ",
    calcStep1Label: "1ο Βήμα • Συνολικό Άθροισμα:",
    calcStep2Label: "2ο Βήμα • Διαίρεση με το Πλήθος",
    chartTitle: "ΓΡΑΦΙΚΗ ΙΣΟΡΡΟΠΙΑ ΣΤΗΛΩΝ (ΔΙΚΑΙΗ ΜΟΙΡΑΣΙΑ)",
    chartAverage: "Μέσος Όρος:",
    legendGroupQty: "Ποσότητα κάθε Ομάδας",
    legendAvgLine: "Γραμμή Μέσης Τιμής",
    conclusionNotice: "Αν κόβαμε τα μέρη που περισσεύουν πάνω από την κόκκινη γραμμή και τα βάζαμε στις χαμηλές στήλες, όλες οι ομάδες θα ισοϋψώνονταν ακριβώς στο",
    ctaTitle: "Ώρα για Εξάσκηση στη Μέση Τιμή!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού μέσου όρου, προβλήματα εύρεσης άγνωστης τιμής και σύνθετα σενάρια πραγματικής ζωής.",
    ctaButton: "Έναρξη Ασκήσεων",

    groups: ['Ομάδα Α', 'Ομάδα Β', 'Ομάδα Γ', 'Ομάδα Δ', 'Ομάδα Ε', 'Ομάδα ΣΤ'],
    shortGroups: ['Ομ. Α', 'Ομ. Β', 'Ομ. Γ', 'Ομ. Δ', 'Ομ. Ε', 'Ομ. ΣΤ'],
    svgAriaLabel: "Γραφική παράσταση μέσης τιμής και στηλών",
    badgeAvgText: "ΜΕΣΗ ΤΙΜΗ:"
  },
  en: {
    pageTitle: "Mean (Average) - 5th Grade | LearnMaths.gr",
    pageDescription: "Complete theory with examples on Mean Value, calculation steps, inverse operations, and an interactive histogram for 5th Grade Mathematics.",
    backText: "5th Grade",
    actionButton: "Practice",
    badgeChapter: "CHAPTER 11 • 5TH GRADE",
    heroTitle: "Mean Value (Average)",
    heroSubtitle: "Discover what the average represents, how it fairly redistributes unequal quantities, how it is calculated by dividing total sum by count, and how to solve inverse problems.",
    heroStatus: "Theory & Dynamic Fair-Share Histogram",
    heroAction: "Try the Practice Problems",

    stepsSectionTitle: "Core Concepts in 4 Steps",
    stepsSectionSubtitle: "The mathematical approach to equal distribution and its practical applications.",

    step1Badge: "STEP 1",
    step1Type: "Concept",
    step1Title: "What is the Mean Value?",
    step1P1: "The mean value (or average) is the unique single value each group would have if we",
    step1P1Bold: "redistributed the total sum equally and fairly",
    step1P1End: "across all groups.",
    step1ExampleIntro: "If three children have 4, 9, and 5 apples respectively:",
    step1Apples: "apples",
    step1ExampleNote: "If they combined them and shared them equally, each would receive exactly 6 apples.",
    step1Tip: "The mean value levels out differences and represents the entire data set with a single representative number.",

    step2Badge: "STEP 2",
    step2Type: "Mathematical Formula",
    step2Title: "How to Calculate (2 Steps)",
    step2Intro: "Calculating the average is always performed in two consecutive operations:",
    step2Step1Title: "Step 1 (Addition):",
    step2Step1Desc: "Add all individual values to find the total sum.",
    step2Step2Title: "Step 2 (Division):",
    step2Step2Desc: "Divide the total sum by the number of values (count).",
    step2FormulaMean: "Mean Value",
    step2FormulaSum: "Sum of Values",
    step2FormulaCount: "Number of Values",
    step2Tip: "The mean value is not necessarily a whole number! Quite often it is a decimal (e.g. 7.4 points).",

    step3Badge: "STEP 3",
    step3Type: "Inverse Problem",
    step3Title: "Finding the Total Sum",
    step3Intro: "When we know the mean value and the count of groups, we find the total sum using",
    step3IntroBold: "multiplication:",
    step3FormulaTotal: "Total Sum",
    step3FormulaMean: "Mean Value",
    step3FormulaCount: "Count",
    step3ExampleLabel: "Example:",
    step3ExampleText1: "If 4 students have an average grade of 18, their combined total score is: 18 · 4 ＝",
    step3ExampleText2: "72 points.",
    step3Tip: "This rule enables us to discover an unknown value whenever we know all the other values plus the average.",

    step4Badge: "STEP 4",
    step4Type: "Properties",
    step4Title: "Limits of the Mean Value",
    step4Intro: "The mean value is always bounded between the lowest and the highest values in the data set:",
    step4Min: "Minimum Value",
    step4Mean: "Mean Value",
    step4Max: "Maximum Value",
    step4Note: "If your grades are 15, 17, and 19, the average cannot possibly be lower than 15 or higher than 19!",
    step4TipTitle: "Quick Check:",
    step4TipDesc: "If your calculated average lies outside the extreme bounds of your data set, you made an arithmetic error.",

    labBadge: "INTERACTIVE LAB",
    labTitle: "Live Histogram & Average Balance Line",
    labSubtitle: "Select the number of groups (2 to 6) and adjust their values. Observe how the dashed line balances dynamically across the bars.",
    groupsText: "Groups",
    groupsTextShort: "Gr.",
    groupValuesHeader: "GROUP VALUES",
    calcHeader: "MATHEMATICAL CALCULATION",
    calcStep1Label: "Step 1 • Total Sum:",
    calcStep2Label: "Step 2 • Division by Count",
    chartTitle: "GRAPHICAL BALANCE OF BARS (EQUAL SHARE)",
    chartAverage: "Average:",
    legendGroupQty: "Quantity per Group",
    legendAvgLine: "Average Line",
    conclusionNotice: "If we sliced the tops exceeding the red line and filled the lower bars, all columns would equalize precisely at",
    ctaTitle: "Time to Practice Average Values!",
    ctaDesc: "Test your skills with average calculation exercises, unknown value word problems, and real-world multi-step scenarios.",
    ctaButton: "Start Exercises",

    groups: ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F'],
    shortGroups: ['Gr. A', 'Gr. B', 'Gr. C', 'Gr. D', 'Gr. E', 'Gr. F'],
    svgAriaLabel: "Graphical histogram of mean value and columns",
    badgeAvgText: "MEAN:"
  }
};

export default function MesiTimiTheoryPage() {
  const router = useRouter();
  const { locale } = router;
  const isEn = locale === 'en';
  const t = isEn ? I18N.en : I18N.el;
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  // Πλήθος ομάδων/στηλών (από 2 έως 6)
  const [count, setCount] = useState(4);

  // Αρχικές τιμές για έως και 6 ομάδες
  const [omades, setOmades] = useState([8, 4, 9, 3, 6, 7]);

  // Επιλογή των ενεργών τιμών
  const activeValues = omades.slice(0, count);

  // Υπολογισμοί
  const sum = activeValues.reduce((acc, curr) => acc + curr, 0);
  const avgNumeric = count > 0 ? sum / count : 0;
  const avgFormatted = avgNumeric.toLocaleString(numberLocale, {
    minimumFractionDigits: Number.isInteger(avgNumeric) ? 0 : 2,
    maximumFractionDigits: 2
  });

  // Ενημέρωση τιμής
  const updateValue = (index, delta) => {
    setOmades((prev) => {
      const next = [...prev];
      next[index] = Math.max(LIMITS.VAL_MIN, Math.min(LIMITS.VAL_MAX, next[index] + delta));
      return next;
    });
  };

  const labels = t.groups;
  const shortLabels = t.shortGroups;

  // Responsive SVG Ιστόγραμμα με Διακεκομμένη Γραμμή Μέσου Όρου
  const renderHistogramSvg = () => {
    const totalWidth = 720;
    const totalHeight = 280;
    const topPadding = 40;
    const bottomPadding = 50;
    const leftPadding = 45;
    const rightPadding = 25;

    const chartHeight = totalHeight - topPadding - bottomPadding;
    const chartWidth = totalWidth - leftPadding - rightPadding;

    const maxScale = 12;
    const barSpacing = chartWidth / count;
    const barWidth = Math.min(64, barSpacing * 0.65);

    // Ύψος μέσης τιμής
    const avgY = topPadding + chartHeight - (avgNumeric / maxScale) * chartHeight;

    return (
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="w-full h-auto drop-shadow-sm"
        aria-label={t.svgAriaLabel}
      >
        {/* Οριζόντιες γραμμές πλέγματος */}
        {[0, 3, 6, 9, 12].map((tick) => {
          const y = topPadding + chartHeight - (tick / maxScale) * chartHeight;
          return (
            <g key={`grid-line-${tick}`}>
              <line
                x1={leftPadding}
                y1={y}
                x2={totalWidth - rightPadding}
                y2={y}
                className="stroke-slate-200 stroke-1"
                strokeDasharray="4 4"
              />
              <text
                x={leftPadding - 10}
                y={y + 4}
                textAnchor="end"
                className="font-mono text-[11px] fill-slate-400 font-bold"
              >
                {tick.toLocaleString(numberLocale)}
              </text>
            </g>
          );
        })}

        {/* Άξονας X */}
        <line
          x1={leftPadding}
          y1={topPadding + chartHeight}
          x2={totalWidth - rightPadding}
          y2={topPadding + chartHeight}
          className="stroke-slate-400 stroke-2"
        />

        {/* Στήλες (Bars) */}
        {activeValues.map((val, idx) => {
          const colHeight = (val / maxScale) * chartHeight;
          const xCenter = leftPadding + idx * barSpacing + barSpacing / 2;
          const x = xCenter - barWidth / 2;
          const y = topPadding + chartHeight - colHeight;

          return (
            <g key={`svg-bar-${idx}`}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={colHeight}
                rx="6"
                className="fill-sky-500 hover:fill-sky-600 transition-colors duration-200 stroke-slate-800 stroke-[1.5]"
              />
              <text
                x={xCenter}
                y={y - 8}
                textAnchor="middle"
                className="font-mono font-black text-xs sm:text-sm fill-slate-800"
              >
                {val.toLocaleString(numberLocale)}
              </text>
              <text
                x={xCenter}
                y={topPadding + chartHeight + 22}
                textAnchor="middle"
                className="font-sans font-bold text-xs fill-slate-600"
              >
                {shortLabels[idx]}
              </text>
            </g>
          );
        })}

        {/* Διακεκομμένη Γραμμή Μέσης Τιμής */}
        <line
          x1={leftPadding}
          y1={avgY}
          x2={totalWidth - rightPadding}
          y2={avgY}
          className="stroke-rose-500 stroke-[3]"
          strokeDasharray="6 4"
        />

        {/* Badge Μέσης Τιμής στο δεξί άκρο */}
        <rect
          x={totalWidth - rightPadding - 120}
          y={avgY - 14}
          width="120"
          height="28"
          rx="6"
          className="fill-rose-500"
        />
        <text
          x={totalWidth - rightPadding - 60}
          y={avgY + 4}
          textAnchor="middle"
          className="fill-white font-mono font-black text-xs"
        >
          {t.badgeAvgText} {avgFormatted}
        </text>
      </svg>
    );
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/11-mesitimi-ask"
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
              href="/e-dimotikou/11-mesitimi-ask"
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
                  <strong>{t.heroTitle}</strong> {t.step1P1} <strong>{t.step1P1Bold}</strong> {t.step1P1End}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    {t.step1ExampleIntro}
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-slate-900 shadow-inner text-center flex flex-wrap items-center justify-center gap-2">
                    <span>
                      <MathFraction numerator="4 ＋ 9 ＋ 5" denominator="3" />
                      &nbsp;＝&nbsp;
                      <MathFraction numerator="18" denominator="3" />
                      &nbsp;＝&nbsp;
                      {(6).toLocaleString(numberLocale)} {t.step1Apples}
                    </span>
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base">
                  <div>
                    <strong className="text-blue-700">{t.step2Step1Title}</strong> {t.step2Step1Desc}
                  </div>
                  <div>
                    <strong className="text-emerald-700">{t.step2Step2Title}</strong> {t.step2Step2Desc}
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono font-bold text-center text-slate-900 shadow-inner flex items-center justify-center gap-2">
                    <span>{t.step2FormulaMean} ＝</span>
                    <MathFraction numerator={t.step2FormulaSum} denominator={t.step2FormulaCount} />
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
                    {t.step3Type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Intro} <strong>{t.step3IntroBold}</strong>
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-center text-indigo-950 shadow-inner">
                    {t.step3FormulaTotal} ＝ {t.step3FormulaMean} · {t.step3FormulaCount}
                  </div>
                  <p className="text-slate-700 font-semibold pt-1">{t.step3ExampleLabel}</p>
                  <p className="text-slate-600 text-xs">
                    {t.step3ExampleText1} <strong>{t.step3ExampleText2}</strong>
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-center text-emerald-800 shadow-inner">
                    {t.step4Min} ≤ {t.step4Mean} ≤ {t.step4Max}
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {t.step4Note}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 <strong>{t.step4TipTitle}</strong> {t.step4TipDesc}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΜΕΣΗΣ ΤΙΜΗΣ */}
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
                {t.labSubtitle}
              </p>
            </div>

            {/* Επιλογέας Πλήθους Ομάδων */}
            <div className="inline-flex max-w-full p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-center">
              {[2, 3, 4, 5, 6].map((n) => (
                <button
                  key={`btn-count-${n}`}
                  type="button"
                  onClick={() => setCount(n)}
                  className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-bold transition select-none touch-manipulation active:scale-95 ${
                    count === n
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{n}</span>
                  <span className="hidden sm:inline sm:ml-1">{t.groupsText}</span>
                  <span className="inline sm:hidden text-[10px] ml-0.5">{t.groupsTextShort}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Αριστερή Στήλη: Χειριστήρια Ομάδων & Βήματα Υπολογισμού */}
            <div className="xl:col-span-5 2xl:col-span-4 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                {toCleanUppercase(t.groupValuesHeader)}
              </h4>

              {/* Πλέγμα Steppers για κάθε ενεργή ομάδα */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeValues.map((val, idx) => (
                  <div
                    key={`group-control-${idx}`}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>{labels[idx]}</span>
                      <span className="font-mono text-base font-black text-blue-600">
                        {val.toLocaleString(numberLocale)}
                      </span>
                    </div>
                    <div className="grid grid-cols-[32px_1fr_32px] items-center h-9 w-full gap-1.5">
                      <button
                        type="button"
                        aria-label={`Decrease ${labels[idx]}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateValue(idx, -1);
                        }}
                        disabled={val <= LIMITS.VAL_MIN}
                        className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 text-sm"
                      >
                        －
                      </button>
                      <input
                        type="range"
                        min={LIMITS.VAL_MIN}
                        max={LIMITS.VAL_MAX}
                        value={val}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setOmades((prev) => {
                            const next = [...prev];
                            next[idx] = v;
                            return next;
                          });
                        }}
                        aria-label={labels[idx]}
                        className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                      />
                      <button
                        type="button"
                        aria-label={`Increase ${labels[idx]}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateValue(idx, 1);
                        }}
                        disabled={val >= LIMITS.VAL_MAX}
                        className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 text-sm"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Αναλυτικά Βήματα Υπολογισμού */}
              <div className="p-4 2xl:p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <span className="text-xs font-black tracking-wider text-slate-400">
                  {toCleanUppercase(t.calcHeader)}
                </span>

                <div className="space-y-2 text-xs sm:text-sm font-mono">
                  <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1">
                    <span className="text-blue-900 font-sans font-bold text-[11px] uppercase tracking-wider block">
                      {t.calcStep1Label}
                    </span>
                    <div className="font-bold text-slate-900 text-sm">
                      {activeValues.map((v) => v.toLocaleString(numberLocale)).join(' ＋ ')} ＝{' '}
                      <span className="text-blue-700 font-black">{sum.toLocaleString(numberLocale)}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                    <span className="text-emerald-900 font-sans font-bold text-[11px] uppercase tracking-wider block">
                      {t.calcStep2Label} ({count.toLocaleString(numberLocale)}):
                    </span>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <MathFraction numerator={sum.toLocaleString(numberLocale)} denominator={count.toLocaleString(numberLocale)} />
                      <span>＝</span>
                      <span className="text-emerald-700 font-black text-base">{avgFormatted}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Ιστόγραμμα */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between text-xs sm:text-sm 2xl:text-base font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.chartTitle)}</span>
                <span className="font-mono text-rose-600 font-bold">{t.chartAverage} {avgFormatted}</span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {renderHistogramSvg()}
              </div>

              {/* Υπόμνημα */}
              <div className="flex flex-wrap items-center justify-center gap-5 text-xs 2xl:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-sky-500"></span>
                  <span className="text-slate-700 font-semibold">{t.legendGroupQty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-0.5 border-t-2 border-dashed border-rose-500"></span>
                  <span className="text-rose-700 font-bold">{t.legendAvgLine} ({avgFormatted})</span>
                </div>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="p-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white rounded-2xl text-center font-bold text-xs sm:text-sm 2xl:text-base shadow-sm">
                📢 {t.conclusionNotice} <span className="text-amber-300 font-black text-lg font-mono ml-1">{avgFormatted}</span>!
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
              {t.ctaDesc}
            </p>
          </div>

          <Link
            href="/e-dimotikou/11-mesitimi-ask"
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
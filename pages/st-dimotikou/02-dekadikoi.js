import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητικό component εμφάνισης κλάσματος με οριζόντια γραμμή (καθαρό JSX)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono ${className}`}>
      <span className="border-b-2 border-current px-1 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

const TRANSLATIONS = {
  el: {
    pageTitle: "Δεκαδικοί Αριθμοί και Δεκαδικά Κλάσματα - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθε πώς η υποδιαστολή διαχωρίζει τις ακέραιες μονάδες από τα δεκαδικά μέρη για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    exercisesBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 2 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Δεκαδικοί Αριθμοί & Δεκαδικά Κλάσματα",
    heroDesc: "Μάθε πώς η υποδιαστολή διαχωρίζει τις ακέραιες μονάδες από τα δεκαδικά μέρη, και ανακάλυψε την αξία των δεκάτων, εκατοστών και χιλιοστών!",
    heroPills: "Ακέραιο & Δεκαδικό Μέρος, Τάξεις και Ισοδύναμοι Δεκαδικοί",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες σε 3 Βήματα",
    theorySubtitle: "Η ανατομία, οι υποδιαιρέσεις και οι ιδιότητες των δεκαδικών αριθμών.",
    steps: [
      {
        badge: "ΒΗΜΑ 1",
        sub: "Διαχωρισμός",
        title: "Ακέραιο και Δεκαδικό Μέρος",
        body: "Η υποδιαστολή ( , ) χωρίζει τον αριθμό σε δύο μέρη: το ακέραιο μέρος (αριστερά) και το δεκαδικό μέρος (δεξιά).",
        tip: "💡 Το ακέραιο μέρος εκφράζει πλήρεις μονάδες, ενώ το δεκαδικό εκφράζει τμήματα της μονάδας."
      },
      {
        badge: "ΒΗΜΑ 2",
        sub: "Υποδιαιρέσεις",
        title: "Τάξεις Δεκαδικού Μέρους",
        body: "Κάθε θέση δεξιά από την υποδιαστολή αντιστοιχεί σε δεκαδικό κλάσμα με παρονομαστή δύναμη του 10.",
        units: {
          d: "δ (Δέκατα):",
          c: "ε (Εκατοστά):",
          m: "χ (Χιλιοστά):"
        },
        tip: "⚡ Κάθε δεκαδική τάξη είναι 10 φορές μικρότερη από την τάξη που βρίσκεται αμέσως αριστερά της!"
      },
      {
        badge: "ΒΗΜΑ 3",
        sub: "Ιδιότητα",
        title: "Ισοδύναμοι Δεκαδικοί",
        body: "Όταν προσθέτουμε ή αφαιρούμε μηδενικά στο τέλος του δεκαδικού μέρους, η αξία του αριθμού δεν μεταβάλλεται!",
        example: "3,5 ＝ 3,50 ＝ 3,500",
        tip: "🎯 Τα τελικά μηδενικά στο δεκαδικό μέρος δεν αλλάζουν την ποσότητα, απλώς δηλώνουν μεγαλύτερη ακρίβεια μέτρησης."
      }
    ],
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικός Αναλυτής Δεκαδικών & Θέσης Υποδιαστολής",
    labDesc: "Πληκτρολόγησε έναν δεκαδικό αριθμό ή επίλεξε ένα παράδειγμα για να δεις την πλήρη ανάλυσή του!",
    presets: [
      { label: "🌡️ Θερμοκρασία", val: "36,6" },
      { label: "💶 Τιμή Προϊόντος", val: "12,50" },
      { label: "⚖️ Βάρος σε κιλά", val: "74,250" },
      { label: "📏 Μήκος ακριβείας", val: "108,405" }
    ],
    inputLabel: "ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΔΕΚΑΔΙΚΟ ΑΡΙΘΜΟ (Π.Χ. 345,672):",
    inputPlaceholder: "π.χ. 345,672",
    inputTip: "💡 Πάτησε σε ένα ψηφίο του πίνακα για να εστιάσεις στην αξία του!",
    readingLabel: "ΠΩΣ ΔΙΑΒΑΖΕΤΑΙ:",
    tableHeader: "🗂️ ΠΙΝΑΚΑΣ ΑΞΙΑΣ ΘΕΣΗΣ ΔΕΚΑΔΙΚΩΝ",
    tablePartInt: "ΑΚΕΡΑΙΟ ΜΕΡΟΣ",
    tablePartDec: "ΔΕΚΑΔΙΚΟ ΜΕΡΟΣ",
    commaLabel: "Υποδ.",
    intClasses: [
      { name: 'Εκατοντάδες', short: 'Ε' },
      { name: 'Δεκάδες', short: 'Δ' },
      { name: 'Μονάδες', short: 'Μ' }
    ],
    decClasses: [
      { name: 'Δέκατα', short: 'δ' },
      { name: 'Εκατοστά', short: 'ε' },
      { name: 'Χιλιοστά', short: 'χ' }
    ],
    expandedFormTitle: "🧬 ΠΛΗΡΗΣ ΑΝΑΛΥΤΙΚΗ ΜΟΡΦΗ (ΑΚΕΡΑΙΕΣ ΜΟΝΑΔΕΣ & ΔΕΚΑΔΙΚΑ ΚΛΑΣΜΑΤΑ)",
    expandedFormBadge: "Πλήρης Εμφάνιση",
    chartTitle: "📊 ΥΨΟΣ ΨΗΦΙΟΥ (ΟΠΤΙΚΗ ΣΥΓΚΡΙΣΗ ΜΕΓΕΘΩΝ)",
    chartBadge: "Ακέραια & Δεκαδικά",
    chartLegendLeft: "⬅️ Ακέραιες Εκατοντάδες",
    chartLegendRight: "Δεκαδικά Χιλιοστά ➡️",
    footerText: "✨ Εκατοντάδες (Ε) • Δεκάδες (Δ) • Μονάδες (Μ) , Δέκατα (δ) • Εκατοστά (ε) • Χιλιοστά (χ)",
    ctaTitle: "Ώρα για Εξάσκηση στους Δεκαδικούς!",
    ctaDesc: "Κατανόησες τη θέση της υποδιαστολής και τα δεκαδικά μέρη; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "🎯 Έναρξη Ασκήσεων",
    unitSingular: "μονάδα",
    unitPlural: "μονάδες",
    exactSuffix: "(ακριβώς)",
    andWord: "και",
    decUnits: {
      tenthSing: "δέκατο",
      tenthPlur: "δέκατα",
      hundSing: "εκατοστό",
      hundPlur: "εκατοστά",
      thouSing: "χιλιοστό",
      thouPlur: "χιλιοστά"
    }
  },
  en: {
    pageTitle: "Decimal Numbers and Decimal Fractions - Grade 6 | LearnMaths.gr",
    pageDescription: "Learn how the decimal point separates whole units from decimal parts for Grade 6 Mathematics.",
    backText: "Grade 6",
    exercisesBtn: "🎯 Exercises",
    badgeChapter: "CHAPTER 2 • GRADE 6",
    heroTitle: "Decimal Numbers & Decimal Fractions",
    heroDesc: "Discover how the decimal point separates whole units from decimal parts, and explore the value of tenths, hundredths, and thousandths!",
    heroPills: "Whole & Decimal Parts, Place Values, and Equivalent Decimals",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts in 3 Steps",
    theorySubtitle: "Structure, decimal subdivisions, and properties of decimal numbers.",
    steps: [
      {
        badge: "STEP 1",
        sub: "Separation",
        title: "Whole and Decimal Parts",
        body: "The decimal point separates the number into two parts: the whole part (left) and the decimal part (right).",
        tip: "💡 The whole part represents whole units, while the decimal part represents parts of a unit."
      },
      {
        badge: "STEP 2",
        sub: "Subdivisions",
        title: "Decimal Place Values",
        body: "Each place value to the right of the decimal point corresponds to a decimal fraction with a power of 10 denominator.",
        units: {
          d: "t (Tenths):",
          c: "h (Hundredths):",
          m: "th (Thousandths):"
        },
        tip: "⚡ Each decimal place is 10 times smaller than the place immediately to its left!"
      },
      {
        badge: "STEP 3",
        sub: "Property",
        title: "Equivalent Decimals",
        body: "Adding or removing trailing zeros at the end of the decimal part does not change the numerical value of the number!",
        example: "3.5 ＝ 3.50 ＝ 3.500",
        tip: "🎯 Trailing zeros in a decimal do not change the quantity; they simply indicate greater precision of measurement."
      }
    ],
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Decimal & Place Value Analyzer",
    labDesc: "Enter any decimal number or pick a real-world preset to inspect its automated place value breakdown!",
    presets: [
      { label: "🌡️ Temperature", val: "36.6" },
      { label: "💶 Product Price", val: "12.50" },
      { label: "⚖️ Weight in kg", val: "74.250" },
      { label: "📏 Precision Length", val: "108.405" }
    ],
    inputLabel: "TYPE A DECIMAL NUMBER (E.G. 345.672):",
    inputPlaceholder: "e.g. 345.672",
    inputTip: "💡 Tap any digit in the chart to inspect its exact place value!",
    readingLabel: "HOW IT IS READ:",
    tableHeader: "🗂️ DECIMAL PLACE VALUE TABLE",
    tablePartInt: "WHOLE PART",
    tablePartDec: "DECIMAL PART",
    commaLabel: "Pt.",
    intClasses: [
      { name: 'Hundreds', short: 'H' },
      { name: 'Tens', short: 'T' },
      { name: 'Units', short: 'U' }
    ],
    decClasses: [
      { name: 'Tenths', short: 't' },
      { name: 'Hundredths', short: 'h' },
      { name: 'Thousandths', short: 'th' }
    ],
    expandedFormTitle: "🧬 COMPLETE EXPANDED FORM (WHOLE UNITS & DECIMAL FRACTIONS)",
    expandedFormBadge: "Expanded View",
    chartTitle: "📊 DIGIT HEIGHT (VISUAL MAGNITUDE)",
    chartBadge: "Whole & Decimals",
    chartLegendLeft: "⬅️ Whole Hundreds",
    chartLegendRight: "Decimal Thousandths ➡️",
    footerText: "✨ Hundreds (H) • Tens (T) • Units (U) . Tenths (t) • Hundredths (h) • Thousandths (th)",
    ctaTitle: "Time to Practice Decimal Numbers!",
    ctaDesc: "Mastered the decimal point and place values? Challenge yourself with 10 interactive questions designed to test your skills!",
    ctaBtn: "🎯 Start Exercises",
    unitSingular: "unit",
    unitPlural: "units",
    exactSuffix: "(exact)",
    andWord: "and",
    decUnits: {
      tenthSing: "tenth",
      tenthPlur: "tenths",
      hundSing: "hundredth",
      hundPlur: "hundredths",
      thouSing: "thousandth",
      thouPlur: "thousandths"
    }
  }
};

export default function DekadikoiArithmoiPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = TRANSLATIONS[locale];

  // Default number: 345,672 for Greek, 345.672 for English
  const defaultNum = isEn ? '345.672' : '345,672';
  const [number, setNumber] = useState(defaultNum);
  const [activeDigitKey, setActiveDigitKey] = useState('dec-0');

  // Καθαρισμός και προετοιμασία ακέραιου & δεκαδικού μέρους
  const sep = isEn ? '.' : ',';
  const sanitized = isEn 
    ? number.replace(/,/g, '.').replace(/[^0-9.]/g, '')
    : number.replace(/\./g, ',').replace(/[^0-9,]/g, '');

  const parts = sanitized.split(sep);
  const intRaw = parts[0] || '0';
  const decRaw = parts[1] || '';

  const intDigits = intRaw.padStart(3, '0').slice(-3).split('');
  const decDigits = decRaw.padEnd(3, '0').slice(0, 3).split('');
  const intFirstNonZero = intDigits.findIndex((d) => d !== '0');

  const intClassesData = [
    { ...t.intClasses[0], weight: 100, color: 'bg-emerald-600', light: 'bg-emerald-50/70', hex: '#059669' },
    { ...t.intClasses[1], weight: 10, color: 'bg-emerald-600', light: 'bg-emerald-50/70', hex: '#10b981' },
    { ...t.intClasses[2], weight: 1, color: 'bg-emerald-600', light: 'bg-emerald-50/70', hex: '#34d399' }
  ];

  const decClassesData = [
    { ...t.decClasses[0], weight: 10, num: 1, den: 10, val: 0.1, color: 'bg-blue-600', light: 'bg-blue-50/70', hex: '#2563eb' },
    { ...t.decClasses[1], weight: 100, num: 1, den: 100, val: 0.01, color: 'bg-blue-600', light: 'bg-blue-50/70', hex: '#3b82f6' },
    { ...t.decClasses[2], weight: 1000, num: 1, den: 1000, val: 0.001, color: 'bg-blue-600', light: 'bg-blue-50/70', hex: '#60a5fa' }
  ];

  // Λεκτική ανάγνωση δεκαδικού
  const getDecimalReading = () => {
    const intVal = parseInt(intRaw, 10) || 0;
    const formatInt = intVal.toLocaleString(isEn ? 'en-US' : 'el-GR');
    const intPartText = `${formatInt} ${intVal === 1 ? t.unitSingular : t.unitPlural}`;
    
    if (!decRaw || parseInt(decRaw, 10) === 0) {
      return `${intPartText} ${t.exactSuffix}`;
    }

    const decLength = Math.min(decRaw.length, 3);
    const decVal = parseInt(decRaw.slice(0, 3), 10);
    const formatDec = decVal.toLocaleString(isEn ? 'en-US' : 'el-GR');

    let decUnitWord = t.decUnits.thouPlur;
    if (decLength === 1) {
      decUnitWord = decVal === 1 ? t.decUnits.tenthSing : t.decUnits.tenthPlur;
    } else if (decLength === 2) {
      decUnitWord = decVal === 1 ? t.decUnits.hundSing : t.decUnits.hundPlur;
    } else if (decLength === 3) {
      decUnitWord = decVal === 1 ? t.decUnits.thouSing : t.decUnits.thouPlur;
    }

    return `${intPartText} ${t.andWord} ${formatDec} ${decUnitWord}`;
  };

  // Υπολογισμός ύψους στήλης (12% έως 100%)
  const calculateBarHeight = (digit, isLeading) => {
    const val = parseInt(digit, 10);
    if (val === 0 || isLeading) return 0;
    return 12 + (val - 1) * 11;
  };

  const chartItems = [
    ...intDigits.map((d, i) => {
      const val = parseInt(d, 10);
      const isLeading = intFirstNonZero !== -1 && i < intFirstNonZero;
      const displayTooltip = (val * intClassesData[i].weight).toLocaleString(isEn ? 'en-US' : 'el-GR');

      return {
        key: `int-${i}`,
        digit: d,
        name: intClassesData[i].name,
        short: intClassesData[i].short,
        weightLabel: intClassesData[i].weight.toString(),
        valStr: displayTooltip,
        hex: intClassesData[i].hex,
        isLeading: isLeading || val === 0,
        heightPercent: calculateBarHeight(d, isLeading)
      };
    }),
    ...decDigits.map((d, i) => {
      const val = parseInt(d, 10);
      const isTrailing = (i >= decRaw.length && decRaw.length > 0) || val === 0;
      const decTooltips = isEn 
        ? [`0.${d}`, `0.0${d}`, `0.00${d}`]
        : [`0,${d}`, `0,0${d}`, `0,00${d}`];

      return {
        key: `dec-${i}`,
        digit: d,
        name: decClassesData[i].name,
        short: decClassesData[i].short,
        weightLabel: `${decClassesData[i].num}/${decClassesData[i].den.toLocaleString(isEn ? 'en-US' : 'el-GR')}`,
        valStr: decTooltips[i],
        hex: decClassesData[i].hex,
        isLeading: isTrailing,
        heightPercent: calculateBarHeight(d, isTrailing)
      };
    })
  ];

  const activeChartItem = chartItems.find((item) => item.key === activeDigitKey);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/02-dekadikoi-ask"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.exercisesBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.badgeChapter}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.heroPills}</span>
            </div>
            <Link
              href="/st-dimotikou/02-dekadikoi-ask"
              locale={locale}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.theoryTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.theorySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            {/* Βήμα 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.steps[0].badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.steps[0].sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.steps[0].title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.steps[0].body}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-center font-mono font-bold">
                  <span className="text-emerald-700 text-base sm:text-lg">345</span>
                  <span className="text-amber-500 text-lg sm:text-xl font-bold"> {sep} </span>
                  <span className="text-blue-600 text-base sm:text-lg">672</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.steps[0].tip}
              </div>
            </article>

            {/* Βήμα 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.steps[1].badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.steps[1].sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.steps[1].title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.steps[1].body}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-blue-800 font-bold">
                    <span><strong>{t.steps[1].units.d}</strong></span>
                    <Fraction num="1" den="10" />
                    <span>＝ {isEn ? '0.1' : '0,1'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-800 font-bold">
                    <span><strong>{t.steps[1].units.c}</strong></span>
                    <Fraction num="1" den="100" />
                    <span>＝ {isEn ? '0.01' : '0,01'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-800 font-bold">
                    <span><strong>{t.steps[1].units.m}</strong></span>
                    <Fraction num="1" den={isEn ? "1,000" : "1.000"} />
                    <span>＝ {isEn ? '0.001' : '0,001'}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs 2xl:text-sm text-blue-950 font-medium">
                {t.steps[1].tip}
              </div>
            </article>

            {/* Βήμα 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.steps[2].badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.steps[2].sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.steps[2].title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.steps[2].body}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-mono text-center font-bold">
                  {isEn ? '3.5 ＝ 3.50 ＝ 3.500' : '3,5 ＝ 3,50 ＝ 3,500'}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.steps[2].tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΔΕΚΑΔΙΚΩΝ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
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

            <div className="flex flex-wrap gap-2">
              {t.presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setNumber(preset.val);
                    setActiveDigitKey('dec-0');
                  }}
                  className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs 2xl:text-sm font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 transition shadow-sm touch-manipulation active:scale-95"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* ROW 1: INPUT & READING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
              <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3 shadow-inner flex flex-col justify-center">
                <label className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                  {t.inputLabel}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={number}
                  onChange={(e) => {
                    let val = isEn
                      ? e.target.value.replace(/,/g, '.').replace(/[^0-9.]/g, '')
                      : e.target.value.replace(/\./g, ',').replace(/[^0-9,]/g, '');
                    const currentSep = isEn ? '.' : ',';
                    const sepCount = (val.match(new RegExp(`\\${currentSep}`, 'g')) || []).length;
                    if (sepCount <= 1) {
                      const p = val.split(currentSep);
                      if ((p[0] || '').length <= 3 && (p[1] || '').length <= 3) {
                        setNumber(val);
                      }
                    }
                  }}
                  className="text-xl sm:text-2xl md:text-3xl font-black text-center p-3 bg-white border-2 border-emerald-300 rounded-2xl shadow-sm focus:border-emerald-500 outline-none transition-all w-full tracking-wider text-emerald-700 font-mono"
                  placeholder={t.inputPlaceholder}
                />
                <p className="text-[11px] sm:text-xs text-slate-400 text-center font-medium">
                  {t.inputTip}
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-4 sm:p-5 rounded-2xl space-y-2 shadow-md flex flex-col justify-center">
                <span className="text-[11px] sm:text-xs font-black text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <span>🗣️</span> {t.readingLabel}
                </span>
                <p className="text-sm sm:text-base md:text-lg 2xl:text-xl font-bold text-slate-100 leading-snug break-words">
                  {getDecimalReading()}
                </p>
              </div>
            </div>

            {/* ROW 2: ΠΙΝΑΚΑΣ ΑΞΙΑΣ ΘΕΣΗΣ ΔΕΚΑΔΙΚΩΝ */}
            <div className="bg-slate-50 border border-slate-200 p-2 sm:p-5 md:p-6 rounded-2xl space-y-4 sm:space-y-6">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-600 uppercase tracking-wider">
                    {t.tableHeader}
                  </span>
                </div>

                <div className="w-full border border-slate-200/80 rounded-2xl bg-white shadow-sm overflow-hidden">
                  {/* Κεφαλίδες Μερών */}
                  <div className="grid grid-cols-7 text-white text-center font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-wider">
                    <div className="col-span-3 bg-emerald-600 py-2 sm:py-3 border-r border-white/20">{t.tablePartInt}</div>
                    <div className="bg-amber-500 py-2 sm:py-3 border-r border-white/20">{sep}</div>
                    <div className="col-span-3 bg-blue-600 py-2 sm:py-3">{t.tablePartDec}</div>
                  </div>

                  {/* Κεφαλίδες Τάξεων */}
                  <div className="grid grid-cols-7 text-[10px] sm:text-xs font-black text-slate-500 text-center border-b bg-slate-100 uppercase py-1.5 sm:py-2">
                    {intClassesData.map((c, i) => (
                      <div key={`hc1-${i}`} className="border-r border-slate-200">
                        {c.short} <span className="hidden sm:inline font-normal lowercase">({c.name})</span>
                      </div>
                    ))}
                    <div className="text-amber-600 font-bold border-r border-slate-200 bg-amber-50/50">{t.commaLabel}</div>
                    {decClassesData.map((c, i) => (
                      <div key={`hc2-${i}`} className="border-r border-slate-200 last:border-0">
                        {c.short} <span className="hidden sm:inline font-normal lowercase">({c.name})</span>
                      </div>
                    ))}
                  </div>

                  {/* Ψηφία */}
                  <div className="grid grid-cols-7 text-center items-center p-1 sm:p-2 bg-white gap-0.5 sm:gap-1">
                    {intDigits.map((digit, i) => {
                      const key = `int-${i}`;
                      const isLeading = intFirstNonZero !== -1 && i < intFirstNonZero;
                      const isSelected = activeDigitKey === key;

                      return (
                        <div key={key} className="px-0.5">
                          <button
                            type="button"
                            onClick={() => setActiveDigitKey(key)}
                            onMouseEnter={() => setActiveDigitKey(key)}
                            className={`w-full py-2.5 sm:py-4 text-base sm:text-2xl font-black rounded-xl transition-colors duration-150 focus:outline-none font-mono flex items-center justify-center border-2 box-border touch-manipulation
                              ${intClassesData[i].light}
                              ${isSelected 
                                ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm' 
                                : 'border-transparent hover:bg-amber-100/70 hover:border-amber-300'}
                              ${isLeading && !isSelected ? 'text-slate-300' : isSelected ? 'text-slate-900' : 'text-slate-800'}`}
                          >
                            {digit}
                          </button>
                        </div>
                      );
                    })}

                    <div className="px-0.5">
                      <div className="w-full py-2.5 sm:py-4 text-lg sm:text-3xl font-black text-amber-500 bg-amber-50/50 rounded-xl flex items-center justify-center font-mono border-2 border-transparent">
                        {sep}
                      </div>
                    </div>

                    {decDigits.map((digit, i) => {
                      const key = `dec-${i}`;
                      const isTrailing = i >= decRaw.length && decRaw.length > 0;
                      const isSelected = activeDigitKey === key;

                      return (
                        <div key={key} className="px-0.5">
                          <button
                            type="button"
                            onClick={() => setActiveDigitKey(key)}
                            onMouseEnter={() => setActiveDigitKey(key)}
                            className={`w-full py-2.5 sm:py-4 text-base sm:text-2xl font-black rounded-xl transition-colors duration-150 focus:outline-none font-mono flex items-center justify-center border-2 box-border touch-manipulation
                              ${decClassesData[i].light}
                              ${isSelected 
                                ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm' 
                                : 'border-transparent hover:bg-amber-100/70 hover:border-amber-300'}
                              ${isTrailing && !isSelected ? 'text-slate-300' : isSelected ? 'text-slate-900' : 'text-slate-800'}`}
                          >
                            {digit}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ΠΛΗΡΗΣ ΑΝΑΛΥΤΙΚΗ ΜΟΡΦΗ */}
              <div className="bg-white border border-slate-200 p-3 sm:p-5 rounded-2xl font-mono text-xs sm:text-sm space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider block font-sans">
                    {t.expandedFormTitle}
                  </span>
                  <span className="text-[10px] sm:text-xs font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {t.expandedFormBadge}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
                  {/* Ακέραια ψηφία */}
                  {intDigits.map((digit, i) => {
                    if (digit === '0' && intFirstNonZero !== -1 && i < intFirstNonZero) return null;
                    const weight = intClassesData[i].weight;
                    const totalVal = (Number(digit) * weight).toLocaleString(isEn ? 'en-US' : 'el-GR');
                    const key = `int-${i}`;
                    const isSelected = activeDigitKey === key;

                    return (
                      <div
                        key={key}
                        onMouseEnter={() => setActiveDigitKey(key)}
                        onClick={() => setActiveDigitKey(key)}
                        className={`flex flex-wrap sm:flex-nowrap items-center justify-between p-2 sm:p-2.5 rounded-xl border-2 box-border transition-colors cursor-pointer gap-1 sm:gap-2 touch-manipulation ${
                          isSelected 
                            ? 'bg-amber-50 border-amber-400 shadow-sm' 
                            : 'bg-slate-50/70 border-transparent hover:bg-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                          <span className="text-emerald-700 font-black">{digit}</span>
                          <span className="text-slate-400">·</span>
                          <span className="font-bold text-slate-800">{weight}</span>
                        </div>
                        <div>
                          <span className="text-[10px] sm:text-xs font-sans text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block">
                            {intClassesData[i].name}
                          </span>
                        </div>
                        <div className="text-right font-black text-xs sm:text-sm text-slate-700">
                          ＝ {totalVal}
                        </div>
                      </div>
                    );
                  })}

                  {/* Δεκαδικά ψηφία */}
                  {decDigits.map((digit, i) => {
                    if (digit === '0' && i >= decRaw.length && decRaw.length > 0) return null;
                    const decCls = decClassesData[i];
                    const numVal = Number(digit) / decCls.weight;
                    const valCalc = isEn 
                      ? numVal.toFixed(i + 1)
                      : numVal.toFixed(i + 1).replace('.', ',');
                    const key = `dec-${i}`;
                    const isSelected = activeDigitKey === key;

                    return (
                      <div
                        key={key}
                        onMouseEnter={() => setActiveDigitKey(key)}
                        onClick={() => setActiveDigitKey(key)}
                        className={`flex flex-wrap sm:flex-nowrap items-center justify-between p-2 sm:p-2.5 rounded-xl border-2 box-border transition-colors cursor-pointer gap-1 sm:gap-2 touch-manipulation ${
                          isSelected 
                            ? 'bg-amber-50 border-amber-400 shadow-sm' 
                            : 'bg-slate-50/70 border-transparent hover:bg-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1 text-xs sm:text-sm">
                          <span className="text-blue-700 font-black">{digit}</span>
                          <span className="text-slate-400">·</span>
                          <Fraction num={decCls.num} den={decCls.den.toLocaleString(isEn ? 'en-US' : 'el-GR')} className="text-xs" />
                        </div>
                        <div>
                          <span className="text-[10px] sm:text-xs font-sans text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold inline-block">
                            {decCls.name}
                          </span>
                        </div>
                        <div className="text-right font-black text-xs sm:text-sm text-blue-700">
                          ＝ {valCalc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center text-xs 2xl:text-sm font-bold text-slate-400 pt-1">
                <span>{t.footerText}</span>
              </div>
            </div>

            {/* ROW 3: ΟΠΤΙΚΟ ΓΡΑΦΗΜΑ ΡΑΒΔΩΝ */}
            <div className="bg-white border border-slate-200 p-3 sm:p-5 rounded-2xl space-y-3 shadow-sm w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5 uppercase">
                  {t.chartTitle}
                </span>
                <span className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full shrink-0">
                  {t.chartBadge}
                </span>
              </div>

              {/* Floating Value Tooltip Banner */}
              {activeChartItem && !activeChartItem.isLeading && (
                <div className="flex items-center justify-center">
                  <div className="bg-slate-900 text-amber-300 text-[11px] sm:text-xs font-mono font-bold px-3 py-1 rounded-full shadow-md text-center max-w-full truncate">
                    {activeChartItem.name}: {activeChartItem.valStr}
                  </div>
                </div>
              )}

              {/* Chart Grid - 6 Στήλες (3 ακέραιες + 3 δεκαδικές) */}
              <div className="w-full bg-slate-50 rounded-xl border border-slate-100 pt-6 sm:pt-10 pb-2 px-1 sm:px-4 overflow-hidden">
                <div className="grid grid-cols-6 gap-1 sm:gap-3 h-36 sm:h-44 border-b-2 border-slate-200 pb-0 items-end w-full">
                  {chartItems.map((item) => {
                    const isSelected = activeDigitKey === item.key;
                    const hasValue = !item.isLeading;

                    return (
                      <div
                        key={item.key}
                        onMouseEnter={() => { if (hasValue) setActiveDigitKey(item.key); }}
                        onClick={() => { if (hasValue) setActiveDigitKey(item.key); }}
                        className={`flex flex-col items-center justify-end h-full min-w-0 w-full touch-manipulation ${hasValue ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        {/* Value Label */}
                        <span className={`text-[10px] sm:text-xs font-black mb-1 truncate ${hasValue ? 'text-slate-700' : 'text-transparent'}`}>
                          {hasValue ? item.digit : '·'}
                        </span>

                        {/* Bar */}
                        <div className="w-full h-24 sm:h-32 flex items-end justify-center">
                          {hasValue ? (
                            <div
                              style={{ 
                                height: `${item.heightPercent}%`,
                                backgroundColor: item.hex 
                              }}
                              className={`w-full max-w-[28px] sm:max-w-[34px] rounded-t sm:rounded-t-lg transition-all duration-150 ${isSelected ? 'ring-2 sm:ring-4 ring-amber-400 brightness-110 shadow-md' : 'opacity-90 hover:opacity-100'}`}
                            />
                          ) : (
                            <div className="w-full h-[2px] bg-slate-200" />
                          )}
                        </div>

                        {/* X-axis Label */}
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 mt-1 truncate leading-none">
                          {item.short}
                        </span>
                        <span className="text-[7.5px] sm:text-[8.5px] text-slate-400 font-mono truncate leading-none mt-0.5">
                          {item.weightLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex flex-col xs:flex-row justify-between items-center text-[10px] sm:text-xs text-slate-400 font-semibold gap-1 px-2 pt-1">
                <span>{t.chartLegendLeft}</span>
                <span>{t.chartLegendRight}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.ctaTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/02-dekadikoi-ask"
            locale={locale}
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>{t.ctaBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
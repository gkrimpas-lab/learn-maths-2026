// pages/st-dimotikou/24-klasma-se-dekadiko.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μέγιστες επιτρεπόμενες τιμές
const MAX_NUMERATOR = 40;
const MAX_DENOMINATOR = 40;

// Αυστηρή συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
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

// Μορφοποίηση δεκαδικών βάσει locale
function formatDecimal(num, locale = 'el', maxDecimals = 3) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  return Number(num).toLocaleString(loc, {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals
  });
}

// Component για κανονική κατακόρυφη μορφή κλάσματος
function FractionDisplay({ num, den, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: { numDen: 'text-xs sm:text-sm font-bold', line: 'w-full h-0.5' },
    md: { numDen: 'text-sm sm:text-base font-black', line: 'w-full h-0.5' },
    lg: { numDen: 'text-xl sm:text-2xl font-black', line: 'w-full h-1' },
    xl: { numDen: 'text-3xl sm:text-4xl font-black', line: 'w-full h-1.5' }
  };

  const selected = sizeClasses[size] || sizeClasses.md;

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle font-mono leading-none px-1 ${className}`}>
      <span className={`${selected.numDen} pb-0.5`}>{num}</span>
      <span className={`${selected.line} bg-current rounded-full my-0.5 min-w-[12px]`} />
      <span className={`${selected.numDen} pt-0.5`}>{den}</span>
    </span>
  );
}

const PRESETS = [
  { num: 1, den: 2, labelEl: 'Μισό', labelEn: 'Half' },
  { num: 1, den: 4, labelEl: 'Τέταρτο', labelEn: 'Quarter' },
  { num: 3, den: 4, labelEl: '', labelEn: '' },
  { num: 2, den: 5, labelEl: '', labelEn: '' },
  { num: 1, den: 3, labelEl: 'Περιοδικός', labelEn: 'Repeating' },
  { num: 5, den: 2, labelEl: '', labelEn: '' }
];

const TRANSLATIONS = {
  el: {
    pageTitle: "Κλασματική Μονάδα & Δεκαδικός - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθε τι είναι η Κλασματική Μονάδα (1/ν) και πώς κάθε κλάσμα μετατρέπεται σε δεκαδικό αριθμό εκτελώντας τη διαίρεση: Αριθμητής : Παρονομαστής για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 24 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Κλασματική Μονάδα και Μετατροπή Κλάσματος σε Δεκαδικό",
    heroDesc: "Μάθε τι είναι η Κλασματική Μονάδα (1/ν) και πώς κάθε κλάσμα μετατρέπεται σε δεκαδικό αριθμό εκτελώντας τη διαίρεση: Αριθμητής : Παρονομαστής!",
    heroFeature: "Διαδραστική Αριθμογραμμή & Αυτόματη Μετατροπή σε Δεκαδικό",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες & Μέθοδος Μετατροπής σε Δεκαδικό",
    theorySubtitle: "Η σχέση της κλασματικής μονάδας, της διαίρεσης και των δεκαδικών αριθμών.",
    card1Badge: "ΟΡΙΣΜΟΣ",
    card1Sub: "1/ν",
    card1Title: "Τι είναι η Κλασματική Μονάδα;",
    card1Text: "Είναι κάθε κλάσμα που έχει ως αριθμητή το 1 (1/ν). Μας δείχνει το ένα μόνο μέρος από τα ίσα μέρη στα οποία χωρίσαμε τη μονάδα.",
    card1Tip: "💡 Κάθε κλάσμα σχηματίζεται από πολλές κλασματικές μονάδες μαζί (π.χ. τα 3/4 είναι 3 φορές το 1/4).",
    card2Badge: "ΠΡΑΞΗ ΔΙΑΙΡΕΣΗΣ",
    card2Sub: "Αριθμητής : Παρονομαστής",
    card2Title: "Κλάσμα ➔ Δεκαδικός",
    card2Text: "Κάθε κλάσμα ισούται με μια διαίρεση! Διαιρούμε τον αριθμητή με τον παρονομαστή: Αριθμητής : Παρονομαστής.",
    card2Tip: "⚡ Αν το κλάσμα είναι γνήσιο, το ακέραιο μέρος του δεκαδικού είναι πάντα 0 (π.χ. 0,4 ή 0,75).",
    card3Badge: "ΕΙΔΙΚΗ ΠΕΡΙΠΤΩΣΗ",
    card3Sub: "Άπειρα Ψηφία",
    card3Title: "Περιοδικοί Αριθμοί",
    card3Text: "Όταν η διαίρεση δεν τελειώνει και ένα ψηφίο (ή ομάδα ψηφίων) επαναλαμβάνεται επ' άπειρον, ο δεκαδικός ονομάζεται περιοδικός.",
    card3Tip: "🎯 Στην καθημερινότητα συχνά στρογγυλοποιούμε τους περιοδικούς αριθμούς στα δύο δεκαδικά ψηφία (π.χ. 0,33).",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Μετατροπής σε Δεκαδικό",
    labSubtitle: "Όρισε τον αριθμητή και τον παρονομαστή και παρατήρησε τη θέση του δεκαδικού πάνω στην αριθμογραμμή και στο κυκλικό μοντέλο!",
    btnFractionalUnit: (den) => `⚡ Κλασματική Μονάδα (1/${den})`,
    numeratorLabel: "Αριθμητής (Διαιρετέος):",
    denominatorLabel: "Παρονομαστής (Διαιρέτης):",
    presetsTitle: "ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:",
    unitStateActiveTitle: "✨ Κλασματική Μονάδα",
    unitStateInactiveTitle: "ℹ Κατάσταση",
    unitStateActiveDesc: (den) => `Το κλάσμα 1/${den} εκφράζει το 1 από τα ${den} ίσα μέρη.`,
    unitStateInactiveDesc: "Για να γίνει κλασματική μονάδα, ο αριθμητής πρέπει να είναι 1.",
    labTip: (num, den) => `💡 Κάνε τη διαίρεση: ${num} : ${den} για να βρεις τον δεκαδικό!`,
    divisionOp: "ΠΡΑΞΗ ΔΙΑΙΡΕΣΗΣ:",
    decimalNumber: "ΔΕΚΑΔΙΚΟΣ ΑΡΙΘΜΟΣ:",
    repeatingWarning: "⚠️ ΠΕΡΙΟΔΙΚΟΣ ΑΡΙΘΜΟΣ",
    numberLineTitle: "📍 ΘΕΣΗ ΤΟΥ ΔΕΚΑΔΙΚΟΥ ΣΤΗΝ ΑΡΙΘΜΟΓΡΑΜΜΗ:",
    lineOutOfRange: "Ο αριθμός είναι μεγαλύτερος από το 4 και βρίσκεται εκτός των ορίων της γραμμής!",
    lineMarkerDesc: (dec) => `Η καρφίτσα δείχνει ακριβώς πού τοποθετείται ο δεκαδικός ${dec} ανάμεσα στους ακεραίους.`,
    circleVisualTitle: "🍕 ΟΠΤΙΚΟΠΟΙΗΣΗ ΜΟΝΑΔΩΝ (ΚΥΚΛΙΚΟ ΜΟΝΤΕΛΟ):",
    unitBadge: (i) => `Μονάδα ${i}`,
    summaryTitle: "ΣΥΜΠΕΡΑΣΜΑ:",
    ctaTitle: "Ώρα για Εξάσκηση στα Κλάσματα και στους Δεκαδικούς!",
    ctaDesc: "Έμαθες να μετατρέπεις κλάσματα σε δεκαδικούς αριθμούς; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "Έναρξη Ασκήσεων",
    pieceTitle: (i, den) => `Κομμάτι ${i} από ${den}`
  },
  en: {
    pageTitle: "Unit Fractions & Decimals - 6th Grade | LearnMaths.gr",
    pageDesc: "Learn what a Unit Fraction is (1/n) and how any fraction converts into a decimal number via division: Numerator : Denominator for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 24 • 6TH GRADE",
    heroTitle: "Unit Fractions & Converting Fractions to Decimals",
    heroDesc: "Discover what a Unit Fraction (1/n) is and how every fraction converts into a decimal number by performing division: Numerator : Denominator!",
    heroFeature: "Interactive Number Line & Real-Time Decimal Conversion",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts & Conversion to Decimal",
    theorySubtitle: "The relationship between unit fractions, division, and decimal numbers.",
    card1Badge: "DEFINITION",
    card1Sub: "1/n",
    card1Title: "What is a Unit Fraction?",
    card1Text: "A unit fraction is any fraction with a numerator of 1 (1/n). It shows exactly one of the equal parts the whole is divided into.",
    card1Tip: "💡 Every fraction is formed by combining multiple unit fractions (e.g., 3/4 is 3 times 1/4).",
    card2Badge: "DIVISION PROCESS",
    card2Sub: "Numerator : Denominator",
    card2Title: "Fraction ➔ Decimal",
    card2Text: "Every fraction represents a division! Divide numerator by denominator: Numerator : Denominator.",
    card2Tip: "⚡ For proper fractions, the integer part of the decimal is always 0 (e.g., 0.4 or 0.75).",
    card3Badge: "SPECIAL CASE",
    card3Sub: "Infinite Digits",
    card3Title: "Repeating Decimals",
    card3Text: "When the division does not terminate and a digit or block of digits repeats endlessly, the decimal is called repeating (periodic).",
    card3Tip: "🎯 In practice, we often round repeating decimals to two decimal places (e.g., 0.33).",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Decimal Conversion Lab",
    labSubtitle: "Set numerator and denominator to observe the decimal placement on the number line and in circular models!",
    btnFractionalUnit: (den) => `⚡ Unit Fraction (1/${den})`,
    numeratorLabel: "Numerator (Dividend):",
    denominatorLabel: "Denominator (Divisor):",
    presetsTitle: "PRESET EXAMPLES:",
    unitStateActiveTitle: "✨ Unit Fraction",
    unitStateInactiveTitle: "ℹ Status",
    unitStateActiveDesc: (den) => `The fraction 1/${den} represents 1 out of ${den} equal parts.`,
    unitStateInactiveDesc: "To be a unit fraction, the numerator must equal 1.",
    labTip: (num, den) => `💡 Divide: ${num} : ${den} to find the decimal!`,
    divisionOp: "DIVISION OPERATION:",
    decimalNumber: "DECIMAL NUMBER:",
    repeatingWarning: "⚠️ REPEATING DECIMAL",
    numberLineTitle: "📍 DECIMAL POSITION ON THE NUMBER LINE:",
    lineOutOfRange: "The value is greater than 4 and lies beyond the boundary of this line!",
    lineMarkerDesc: (dec) => `The pin marks exactly where ${dec} is located among the whole numbers.`,
    circleVisualTitle: "🍕 CIRCULAR UNIT VISUALIZER:",
    unitBadge: (i) => `Unit ${i}`,
    summaryTitle: "SUMMARY:",
    ctaTitle: "Time to Practice Fractions & Decimals!",
    ctaDesc: "Mastered converting fractions to decimal numbers? Test your skills with 10 challenging interactive questions to consolidate your knowledge!",
    ctaBtn: "Start Exercises",
    pieceTitle: (i, den) => `Slice ${i} of ${den}`
  }
};

export default function KlasmaSeDekadikoPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(4);

  const handleNumeratorInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setNumerator('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_NUMERATOR) return;
    setNumerator(n);
  };

  const handleDenominatorInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setDenominator('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_DENOMINATOR) return;
    setDenominator(n);
  };

  const handleNumeratorChange = (amount) => {
    setNumerator(prev => Math.max(0, Math.min(MAX_NUMERATOR, (Number(prev) || 0) + amount)));
  };

  const handleDenominatorChange = (amount) => {
    setDenominator(prev => Math.max(1, Math.min(MAX_DENOMINATOR, (Number(prev) || 1) + amount)));
  };

  const makeFractionalUnit = () => {
    setNumerator(1);
  };

  const activeNumerator = numerator === '' ? 0 : Number(numerator);
  const activeDenominator = denominator === '' || Number(denominator) === 0 ? 1 : Number(denominator);
  const decimalValue = activeNumerator / activeDenominator;

  const isPeriodic = () => {
    const str = decimalValue.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      return decimals.length > 5;
    }
    return false;
  };

  const renderPizza = (pizzaIndex = 0) => {
    const slices = [];
    const radius = 55;
    const cx = 65;
    const cy = 65;

    const startingNumeratorForPizza = pizzaIndex * activeDenominator;
    const activeSlicesForThisPizza = Math.max(
      0,
      Math.min(activeDenominator, activeNumerator - startingNumeratorForPizza)
    );

    for (let i = 0; i < activeDenominator; i++) {
      const angleStep = 360 / activeDenominator;
      const startAngle = i * angleStep - 90;
      const endAngle = (i + 1) * angleStep - 90;

      const rad1 = (startAngle * Math.PI) / 180;
      const rad2 = (endAngle * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(rad1);
      const y1 = cy + radius * Math.sin(rad1);
      const x2 = cx + radius * Math.cos(rad2);
      const y2 = cy + radius * Math.sin(rad2);

      const largeArcFlag = angleStep > 180 ? 1 : 0;

      const d = activeDenominator === 1
        ? `M ${cx} ${cy} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const isFilled = i < activeSlicesForThisPizza;

      slices.push(
        <path
          key={i}
          d={d}
          onClick={() => {
            const clickedNumber = pizzaIndex * activeDenominator + i + 1;
            setNumerator(clickedNumber);
          }}
          className={`${
            isFilled 
              ? 'fill-indigo-500 stroke-indigo-700 hover:fill-indigo-400' 
              : 'fill-slate-100 stroke-slate-300 hover:fill-slate-200'
          } transition-colors duration-200 stroke-[1.5] cursor-pointer`}
          title={t.pieceTitle(i + 1, activeDenominator)}
        />
      );
    }

    return (
      <svg width="130" height="130" viewBox="0 0 130 130" className="drop-shadow-xs shrink-0">
        {slices}
        <circle cx={cx} cy={cy} r="3" className="fill-slate-800" />
      </svg>
    );
  };

  const neededVisuals = Math.max(1, Math.ceil(activeNumerator / activeDenominator));

  const displayDecimalFormatted = isPeriodic()
    ? `${formatDecimal(decimalValue, locale, 4)}...`
    : (locale === 'en' ? decimalValue.toString() : decimalValue.toString().replace('.', ','));

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/24-klasma-se-dekadiko-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.navExercises}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.heroBadge}</span>
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
              <span>{t.heroFeature}</span>
            </div>
            <Link
              href="/st-dimotikou/24-klasma-se-dekadiko-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (3 COLS) */}
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
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.card1Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.card1Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.card1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.card1Text}
                </p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-center flex flex-wrap justify-center gap-2 font-bold items-center">
                  <span className="bg-white px-2 py-1 rounded-xl border border-slate-200 text-slate-800 flex items-center gap-1">
                    <FractionDisplay num="1" den="2" size="sm" />
                    <span className="text-[11px]">({locale === 'en' ? 'half' : 'μισό'})</span>
                  </span>
                  <span className="bg-white px-2 py-1 rounded-xl border border-slate-200 text-slate-800 flex items-center gap-1">
                    <FractionDisplay num="1" den="4" size="sm" />
                    <span className="text-[11px]">({locale === 'en' ? 'quarter' : 'τέταρτο'})</span>
                  </span>
                  <span className="bg-white px-2 py-1 rounded-xl border border-slate-200 text-sky-700 flex items-center gap-1">
                    <FractionDisplay num="1" den="10" size="sm" />
                    <span className="text-[11px]">({locale === 'en' ? 'tenth' : 'δέκατο'})</span>
                  </span>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.card1Tip}
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.card2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-amber-600">{t.card2Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.card2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.card2Text}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold flex items-center justify-center gap-2">
                  <FractionDisplay num="2" den="5" size="md" className="text-amber-700" />
                  <span>＝ 2 : 5 ＝ <strong className="text-amber-700">0{locale === 'en' ? '.4' : ',4'}</strong></span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.card2Tip}
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.card3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-600">{t.card3Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.card3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.card3Text}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold flex items-center justify-center gap-2">
                  <FractionDisplay num="1" den="3" size="md" className="text-emerald-700" />
                  <span>＝ 1 : 3 ＝ <strong className="text-emerald-700">0{locale === 'en' ? '.333...' : ',333...'}</strong></span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.card3Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
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
                {t.labSubtitle}
              </p>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* ΚΟΥΜΠΙ ΚΛΑΣΜΑΤΙΚΗΣ ΜΟΝΑΔΑΣ */}
                <button
                  type="button"
                  onClick={makeFractionalUnit}
                  className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs sm:text-sm font-black transition uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs touch-manipulation active:scale-95"
                >
                  {t.btnFractionalUnit(activeDenominator)}
                </button>

                <div className="space-y-3">
                  {/* ΕΛΕΓΧΟΣ ΑΡΙΘΜΗΤΗ */}
                  <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-indigo-200 shadow-xs space-y-2">
                    <span className="text-xs font-black text-indigo-800 uppercase block">
                      {t.numeratorLabel}
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleNumeratorChange(-1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-slate-100 hover:bg-slate-200 text-indigo-700 border border-slate-200 rounded-xl font-black transition shadow-xs text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        －
                      </button>
                      <input
                        key={`num-input-${numerator}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck="false"
                        value={numerator === '' ? '' : String(numerator)}
                        onChange={(e) => handleNumeratorInputChange(e.target.value)}
                        placeholder="1"
                        className="w-full min-w-0 flex-1 text-center font-mono font-black text-xl sm:text-2xl text-indigo-600 bg-indigo-50/50 border-2 border-indigo-200 rounded-xl p-1.5 focus:border-indigo-500 outline-none shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => handleNumeratorChange(1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black transition shadow-md text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  {/* ΕΛΕΓΧΟΣ ΠΑΡΟΝΟΜΑΣΤΗ */}
                  <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-amber-200 shadow-xs space-y-2">
                    <span className="text-xs font-black text-amber-800 uppercase block">
                      {t.denominatorLabel}
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleDenominatorChange(-1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-slate-100 hover:bg-slate-200 text-amber-700 border border-slate-200 rounded-xl font-black transition shadow-xs text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        －
                      </button>
                      <input
                        key={`den-input-${denominator}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck="false"
                        value={denominator === '' ? '' : String(denominator)}
                        onChange={(e) => handleDenominatorInputChange(e.target.value)}
                        placeholder="4"
                        className="w-full min-w-0 flex-1 text-center font-mono font-black text-xl sm:text-2xl text-amber-600 bg-amber-50/50 border-2 border-amber-200 rounded-xl p-1.5 focus:border-amber-500 outline-none shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => handleDenominatorChange(1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black transition shadow-md text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* PRESET EXAMPLES */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    {t.presetsTitle}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p, idx) => {
                      const label = locale === 'en' ? p.labelEn : p.labelEl;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNumerator(p.num);
                            setDenominator(p.den);
                          }}
                          className={`py-2 px-1.5 rounded-xl border text-xs transition-all text-center touch-manipulation active:scale-95 flex items-center justify-center gap-1.5 ${
                            activeNumerator === p.num && activeDenominator === p.den
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                          }`}
                        >
                          <FractionDisplay num={p.num} den={p.den} size="sm" />
                          <span className="font-mono font-bold text-[11px]">
                            ＝ {formatDecimal(p.num / p.den, locale, 2)}
                          </span>
                          {label && (
                            <span className="text-[10px] opacity-75">({label})</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ΚΑΤΑΣΤΑΣΗ ΚΛΑΣΜΑΤΙΚΗΣ ΜΟΝΑΔΑΣ */}
                <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                  activeNumerator === 1 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  <span className="font-bold uppercase tracking-wider block text-[10px]">
                    {activeNumerator === 1 ? t.unitStateActiveTitle : t.unitStateInactiveTitle}
                  </span>
                  <p>
                    {activeNumerator === 1 
                      ? t.unitStateActiveDesc(activeDenominator)
                      : t.unitStateInactiveDesc}
                  </p>
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                {t.labTip(activeNumerator, activeDenominator)}
              </div>
            </div>

            {/* RIGHT: VISUALIZATION & NUMBER LINE */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 sm:space-y-7 pb-4 sm:pb-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΜΕΤΑΤΡΟΠΗ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                {/* Κλάσμα σε κατακόρυφη μορφή */}
                <div className="flex flex-col items-center justify-center">
                  <FractionDisplay num={activeNumerator} den={activeDenominator} size="xl" className="text-indigo-600" />
                </div>

                {/* Πράξη */}
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    {t.divisionOp}
                  </span>
                  <div className="font-mono text-lg sm:text-xl font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 inline-block shadow-xs">
                    {activeNumerator} : {activeDenominator}
                  </div>
                </div>

                {/* Δεκαδικός */}
                <div className="text-center space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    {t.decimalNumber}
                  </span>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-emerald-600">
                    {displayDecimalFormatted}
                  </div>
                  {isPeriodic() && (
                    <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">
                      {t.repeatingWarning}
                    </span>
                  )}
                </div>
              </div>

              {/* 2. ΑΡΙΘΜΗΤΙΚΗ ΓΡΑΜΜΗ (NUMBER LINE) */}
              <div className="space-y-3 bg-slate-50/80 p-4 sm:p-6 rounded-2xl border border-slate-200 overflow-hidden">
                <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block text-center">
                  {t.numberLineTitle}
                </span>
                
                <div className="relative w-full pt-12 pb-6 px-4 sm:px-6 select-none">
                  {/* Η Αριθμητική Γραμμή */}
                  <div className="relative w-full h-1.5 bg-slate-300 rounded-full">
                    
                    {/* Υποδιαιρέσεις & Ακέραιοι (0, 1, 2, 3, 4) */}
                    {[0, 1, 2, 3, 4].map((num) => {
                      const percentage = (num / 4) * 100;
                      return (
                        <div key={num} className="absolute flex flex-col items-center" style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}>
                          <div className="w-0.5 h-4 bg-slate-800 -top-2 relative" />
                          <span className="text-xs font-mono font-black text-slate-700 top-1 relative">{num}</span>
                        </div>
                      );
                    })}

                    {/* Ο Δείκτης (Marker) του Δεκαδικού */}
                    {decimalValue <= 4 && (
                      <div 
                        className="absolute flex flex-col items-center -top-9 transition-all duration-500 ease-out z-10"
                        style={{ left: `${(decimalValue / 4) * 100}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className="bg-emerald-600 text-white font-mono text-[11px] sm:text-xs font-black px-2 py-0.5 rounded-lg shadow-md mb-0.5 whitespace-nowrap">
                          {displayDecimalFormatted}
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-md animate-bounce" />
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-400 italic text-center pt-1">
                  {decimalValue > 4 
                    ? t.lineOutOfRange 
                    : t.lineMarkerDesc(displayDecimalFormatted)}
                </p>
              </div>

              {/* 3. ΚΥΚΛΙΚΟ ΜΟΝΤΕΛΟ (ΠΙΤΣΑ) */}
              <div className="space-y-2">
                <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block text-center">
                  {t.circleVisualTitle}
                </span>
                <div className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-5 p-4 sm:p-5 bg-slate-50/70 rounded-2xl border border-slate-200 shadow-inner">
                  {Array.from({ length: neededVisuals }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-1">
                      {renderPizza(i)}
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{t.unitBadge(i + 1)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. FINAL RESULT SUMMARY BANNER */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-4 sm:p-5 rounded-2xl text-center shadow-lg space-y-1">
                <span className="text-xs font-sans uppercase tracking-wider block text-blue-200 font-bold">
                  {t.summaryTitle}
                </span>
                <div className="text-base sm:text-lg md:text-xl font-black tracking-wide flex flex-wrap justify-center items-center gap-2">
                  <FractionDisplay num={activeNumerator} den={activeDenominator} size="md" className="text-white" />
                  <span>＝ {activeNumerator} : {activeDenominator} ＝</span>
                  <span className="text-amber-300 font-mono">
                    {displayDecimalFormatted}
                  </span>
                </div>
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
            href="/st-dimotikou/24-klasma-se-dekadiko-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase(t.ctaBtn)}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
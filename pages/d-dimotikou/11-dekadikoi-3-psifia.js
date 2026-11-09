// pages/d-dimotikou/11-dekadikoi-3-psifia.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Συνάρτηση μετατροπής σε άτονα ελληνικά κεφαλαία με εξαίρεση το "Δ'"
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Δ')/g);
  return parts
    .map((part) => {
      if (part === "Δ'") return "Δ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Component για μαθηματική γραφή κλασμάτων (κατακόρυφη μορφή)
const Fraction = ({ num, den }) => (
  <span className="inline-flex flex-col items-center align-middle mx-1 text-center font-serif leading-none">
    <span className="border-b border-current px-1 pb-0.5 text-[0.95em]">{num}</span>
    <span className="px-1 pt-0.5 text-[0.95em]">{den}</span>
  </span>
);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumberByLocale(num, isEn) {
  if (num === null || num === undefined || isNaN(num)) return '';
  return Number(num).toLocaleString(isEn ? 'en-US' : 'el-GR');
}

// Συγκεντρωτικό λεξικό μεταφράσεων i18n
const TRANSLATIONS = {
  el: {
    metaTitle: "Δεκαδικοί Αριθμοί με 3 Δεκαδικά Ψηφία (Χιλιοστά) - Θεωρία | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε τα χιλιοστά, τα δεκαδικά κλάσματα με παρονομαστή 1.000, τον πίνακα αξίας θέσης 3 δεκαδικών ψηφίων και τους τρόπους ανάγνωσης.",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "🔢 Δεκαδικοί Αριθμοί με 3 Δεκαδικά Ψηφία",
    heroDesc: "Γνωρίζουμε τα χιλιοστά (χ), τη θέση τους μετά την υποδιαστολή και τη μετατροπή δεκαδικών κλασμάτων με παρονομαστή το 1.000!",
    readyPracticeTitle: "Έτοιμος για εξάσκηση;",
    readyPracticeDesc: "Δοκίμασε τις ασκήσεις στους δεκαδικούς με 3 ψηφία για να σιγουρευτείς ότι τους κατέκτησες!",
    goToExercises: "🎯 Μετάβαση στις Ασκήσεις",
    theorySectionTitle: "Αναλυτική Θεωρία: Τα Χιλιοστά",
    cardFractionsTitle: "Δεκαδικά Κλάσματα με παρονομαστή το 1.000",
    cardFractionsDesc: "Όταν χωρίζουμε τη μονάδα σε 1.000 ίσα μέρη, το κάθε μέρος ονομάζεται 1 χιλιοστό:",
    thousandthUnit: "1 χιλιοστό",
    card3DigitsTitle: "Τα 3 Δεκαδικά Ψηφία",
    card3DigitsDesc: "Τα 3 ψηφία μετά την υποδιαστολή εκφράζουν κατά σειρά τα δέκατα (δ), τα εκατοστά (ε) και τα χιλιοστά (χ):",
    digitsNote: "(3 δεκαδικά ψηφία)",
    partsSectionTitle: "Τα μέρη του αριθμού:",
    partIntegerTitle: "1. Ακέραιο Μέρος (πριν το κόμμα)",
    partIntegerDesc: "Δείχνει τις ακέραιες μονάδες:",
    unitsSymbol: "Μονάδες (Μ)",
    partDecimalTitle: "2. Δεκαδικό Μέρος (3 Ψηφία)",
    partDecimalDesc: "Δείχνει τις υποδιαιρέσεις της μονάδας:",
    interactiveTitle: "Διαδραστικός Μετατροπέας Χιλιοστών",
    interactiveDesc: "Άλλαξε τον αριθμητή και παρατήρησε άμεσα τη μετατροπή σε δεκαδικό αριθμό 3 δεκαδικών ψηφίων!",
    randomBtn: "Τυχαίος Αριθμός",
    sliderLabel: "ΑΡΙΘΜΗΤΗΣ ΚΛΑΣΜΑΤΟΣ (/1000)",
    decreaseTitle: "Μείωση κατά 10",
    decreaseAria: "Μείωση αριθμητή",
    increaseTitle: "Αύξηση κατά 10",
    increaseAria: "Αύξηση αριθμητή",
    box1Label: "1. Δεκαδικο Κλασμα",
    box2Label: "2. Δεκαδικος Αριθμος",
    box3Label: "3. Πινακας Αξιας Θεσης",
    tableUnits: "Μονάδες",
    tableUnitsSym: "(Μ)",
    tableTenths: "Δέκατα",
    tableTenthsSym: "(δ)",
    tableHundredths: "Εκατοστά",
    tableHundredthsSym: "(ε)",
    tableThousandths: "Χιλιοστά",
    tableThousandthsSym: "(χ)",
    readingHeader: "🗣️ Πως διαβαζεται ο αριθμος:",
    orConnector: "ή",
    bottomTitle: "Ώρα για Εξάσκηση στα Χιλιοστά!",
    bottomDesc: "Έμαθες τους δεκαδικούς αριθμούς με 3 δεκαδικά ψηφία; Δοκίμασε τις διαδραστικές ασκήσεις!",
    bottomBtn: "Ξεκίνα τις Ασκήσεις ➔"
  },
  en: {
    metaTitle: "Decimal Numbers with 3 Decimal Places (Thousandths) - Theory | LearnMaths.gr",
    metaDesc: "Learn about thousandths, decimal fractions with a denominator of 1,000, the 3-decimal-place value chart, and reading rules.",
    backText: "Grade 4",
    exercisesBtn: "Exercises",
    gradeBadge: "GRADE 4",
    heroTitle: "🔢 Decimals with 3 Decimal Places",
    heroDesc: "Discover thousandths (th), their place value after the decimal point, and converting decimal fractions with a denominator of 1,000!",
    readyPracticeTitle: "Ready for practice?",
    readyPracticeDesc: "Try the exercises on 3-place decimals to ensure you have mastered the concept!",
    goToExercises: "🎯 Go to Exercises",
    theorySectionTitle: "Detailed Theory: The Thousandths",
    cardFractionsTitle: "Decimal Fractions with Denominator 1,000",
    cardFractionsDesc: "When we divide a whole unit into 1,000 equal parts, each part is called 1 thousandth:",
    thousandthUnit: "1 thousandth",
    card3DigitsTitle: "The 3 Decimal Places",
    card3DigitsDesc: "The 3 digits after the decimal point represent, in order, tenths (t), hundredths (h), and thousandths (th):",
    digitsNote: "(3 decimal places)",
    partsSectionTitle: "Parts of the number:",
    partIntegerTitle: "1. Whole Number Part (before point)",
    partIntegerDesc: "Represents the whole units:",
    unitsSymbol: "Units (U)",
    partDecimalTitle: "2. Decimal Part (3 Digits)",
    partDecimalDesc: "Represents fractional subdivisions of the unit:",
    interactiveTitle: "Interactive Thousandths Converter",
    interactiveDesc: "Adjust the numerator and instantly observe its conversion into a 3-place decimal number!",
    randomBtn: "Random Number",
    sliderLabel: "FRACTION NUMERATOR (/1000)",
    decreaseTitle: "Decrease by 10",
    decreaseAria: "Decrease numerator",
    increaseTitle: "Increase by 10",
    increaseAria: "Increase numerator",
    box1Label: "1. Decimal Fraction",
    box2Label: "2. Decimal Number",
    box3Label: "3. Place Value Chart",
    tableUnits: "Units",
    tableUnitsSym: "(U)",
    tableTenths: "Tenths",
    tableTenthsSym: "(t)",
    tableHundredths: "Hundredths",
    tableHundredthsSym: "(h)",
    tableThousandths: "Thousandths",
    tableThousandthsSym: "(th)",
    readingHeader: "🗣️ How the number is read:",
    orConnector: "or",
    bottomTitle: "Time to Practice Thousandths!",
    bottomDesc: "Mastered 3-place decimal numbers? Test your skills with interactive exercises!",
    bottomBtn: "Start Exercises ➔"
  }
};

export default function Dekadikoi3PsifiaTheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];
  const isEn = locale === 'en';

  const [numerator, setNumerator] = useState(2345);

  const denominator = 1000;
  const decimalVal = numerator / denominator;

  // Διαχωρισμός Ακέραιου και Δεκαδικού Μέρους
  const integerPart = Math.floor(decimalVal);
  const decimalPartString = (decimalVal % 1).toFixed(3).substring(2);

  const tenthsDigit = parseInt(decimalPartString[0] || '0', 10);
  const hundredthsDigit = parseInt(decimalPartString[1] || '0', 10);
  const thousandthsDigit = parseInt(decimalPartString[2] || '0', 10);

  // Δημιουργία ολόγραφης ανάγνωσης
  const isDecimalZero = parseInt(decimalPartString, 10) === 0;
  const decimalPartInt = parseInt(decimalPartString, 10);

  let way1 = '';
  let way2 = '';

  if (isEn) {
    if (isDecimalZero) {
      way1 = `${integerPart}`;
      way2 = `${integerPart}`;
    } else if (integerPart === 0) {
      way1 = `${decimalPartInt} thousandths`;
      way2 = `zero point ${decimalPartString.split('').join(' ')}`;
    } else {
      way1 = `${integerPart} and ${decimalPartInt} thousandths`;
      way2 = `${integerPart} point ${decimalPartString.split('').join(' ')}`;
    }
  } else {
    if (isDecimalZero) {
      way1 = `${integerPart}`;
      way2 = `${integerPart}`;
    } else if (integerPart === 0) {
      way1 = `${decimalPartInt} χιλιοστά`;
      way2 = `μηδέν κόμμα ${decimalPartString}`;
    } else {
      way1 = `${integerPart} και ${decimalPartInt} χιλιοστά`;
      way2 = `${integerPart} κόμμα ${decimalPartString}`;
    }
  }

  const handleRandomize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setNumerator(getRandomInt(5, 4995));
  };

  const updateNumerator = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setNumerator((prev) => Math.max(1, Math.min(9999, prev + delta)));
  };

  const decimalSeparator = isEn ? '.' : ',';

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/11-dekadikoi-3-psifia-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.gradeBadge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-purple-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.readyPracticeTitle}</h3>
              <p className="text-xs text-purple-100">
                {t.readyPracticeDesc}
              </p>
              <Link
                href="/d-dimotikou/11-dekadikoi-3-psifia-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                {t.goToExercises}
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - SECTION 1 */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> {t.theorySectionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Χιλιοστά & Κλάσματα */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>🍰</span> {t.cardFractionsTitle}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t.cardFractionsDesc}
              </p>
              <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 p-2.5 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm font-bold text-slate-800 w-full shadow-sm">
                <Fraction num="1" den={formatNumberByLocale(1000, isEn)} />
                <span>＝</span>
                <span className="font-sans font-bold">{t.thousandthUnit}</span>
                <span>＝</span>
                <span className="text-indigo-700 font-black">{isEn ? '0.001' : '0,001'}</span>
              </div>
            </div>

            {/* 3 Δεκαδικά Ψηφία */}
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-purple-900 flex items-center gap-2">
                <span>✏️</span> {t.card3DigitsTitle}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t.card3DigitsDesc}
              </p>
              <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 p-2.5 bg-white rounded-xl border border-purple-100 font-mono text-xs sm:text-sm font-bold text-slate-800 w-full shadow-sm">
                <Fraction num="125" den={formatNumberByLocale(1000, isEn)} />
                <span>＝</span>
                <span className="text-purple-700 font-black">{isEn ? '0.125' : '0,125'}</span>
                <span className="font-sans text-xs text-slate-500 font-normal">{t.digitsNote}</span>
              </div>
            </div>
          </div>

          {/* ΑΝΑΛΥΣΗ ΜΕΡΩΝ ΔΕΚΑΔΙΚΟΥ */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
              🔍 {t.partsSectionTitle} <span className="text-indigo-600 font-mono">{isEn ? '2.345' : '2,345'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <h4 className="font-bold text-blue-700 border-b pb-1 text-sm sm:text-base">
                  {t.partIntegerTitle}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {t.partIntegerDesc}
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-blue-50/80 rounded-xl border border-blue-200/80 font-mono font-bold text-slate-900 w-full">
                  <span className="text-blue-600 text-lg sm:text-xl">2</span>
                  <span>{decimalSeparator} 345</span>
                  <span>➔</span>
                  <span className="text-blue-700 font-black">{isEn ? '2 Units (U)' : '2 Μονάδες (Μ)'}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <h4 className="font-bold text-purple-700 border-b pb-1 text-sm sm:text-base">
                  {t.partDecimalTitle}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {t.partDecimalDesc}
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-purple-50/80 rounded-xl border border-purple-200/80 font-mono font-bold text-slate-900 w-full">
                  <span>2 {decimalSeparator}</span>
                  <span className="text-teal-600 font-black text-base sm:text-lg">3</span>
                  <span className="text-amber-600 font-black text-base sm:text-lg">4</span>
                  <span className="text-rose-600 font-black text-base sm:text-lg">5</span>
                  <span>➔</span>
                  <span className="text-teal-700">{isEn ? '3 t' : '3 δ'}</span>
                  <span>＋</span>
                  <span className="text-amber-700">{isEn ? '4 h' : '4 ε'}</span>
                  <span>＋</span>
                  <span className="text-rose-700">{isEn ? '5 th' : '5 χ'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> {t.interactiveTitle}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                {t.interactiveDesc}
              </p>
            </div>

            <button
              onClick={handleRandomize}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center gap-1.5 self-start sm:self-auto active:scale-95 touch-manipulation"
            >
              <span>🎲</span> {t.randomBtn}
            </button>
          </div>

          {/* TOUCH SLIDER ΧΕΙΡΙΣΜΟΥ */}
          <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-2">
            <div className="h-8 flex items-center justify-between text-center px-1">
              <span className="text-xs font-black uppercase text-slate-500">
                {toCleanUppercase(t.sliderLabel)}
              </span>
              <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                {formatNumberByLocale(numerator, isEn)}
              </span>
            </div>

            <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
              <button
                onClick={(e) => updateNumerator(e, -10)}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                title={t.decreaseTitle}
                aria-label={t.decreaseAria}
              >
                －
              </button>

              <input
                type="range"
                min="1"
                max="9999"
                value={numerator}
                onChange={(e) => setNumerator(Number(e.target.value))}
                className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
              />

              <button
                onClick={(e) => updateNumerator(e, 10)}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                title={t.increaseTitle}
                aria-label={t.increaseAria}
              >
                ＋
              </button>
            </div>
          </div>

          {/* ΠΡΟΒΟΛΗ ΚΛΑΣΜΑΤΟΣ, ΔΕΚΑΔΙΚΟΥ & ΠΙΝΑΚΑ ΑΞΙΑΣ ΘΕΣΗΣ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* 1. Δεκαδικό Κλάσμα */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl border border-indigo-200 text-center space-y-2 shadow-sm">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-500 block">
                {toCleanUppercase(t.box1Label)}
              </span>
              <div className="py-2 flex justify-center">
                <span className="inline-flex flex-col items-center font-mono font-black text-3xl sm:text-4xl text-indigo-900 leading-none">
                  <span className="px-2 pb-1 border-b-4 border-indigo-900">{formatNumberByLocale(numerator, isEn)}</span>
                  <span className="px-2 pt-1">{formatNumberByLocale(denominator, isEn)}</span>
                </span>
              </div>
            </div>

            {/* 2. Δεκαδικός Αριθμός */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-200 text-center space-y-2 shadow-sm">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-500 block">
                {toCleanUppercase(t.box2Label)}
              </span>
              <div className="font-mono font-black text-4xl sm:text-5xl text-purple-900 py-4">
                {decimalVal.toLocaleString(isEn ? 'en-US' : 'el-GR', {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })}
              </div>
            </div>

            {/* 3. Πίνακας Αξίας Θέσης (Responsive SVG) */}
            <div className="bg-slate-950 p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block text-center">
                {toCleanUppercase(t.box3Label)}
              </span>

              <div className="w-full flex justify-center">
                <svg
                  viewBox="0 0 460 150"
                  className="w-full h-auto max-w-[350px] block select-none font-sans"
                >
                  {/* Headers */}
                  <rect x="10" y="10" width="85" height="46" rx="8" fill="#1e3a8a" />
                  <text x="52" y="32" fill="#93c5fd" fontSize="10.5" fontWeight="700" textAnchor="middle">
                    {t.tableUnits}
                  </text>
                  <text x="52" y="47" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    {t.tableUnitsSym}
                  </text>

                  {/* Υποδιαστολή Header */}
                  <rect x="103" y="10" width="26" height="46" rx="6" fill="#334155" />
                  <text x="116" y="38" fill="#94a3b8" fontSize="18" fontWeight="900" textAnchor="middle">
                    {decimalSeparator}
                  </text>

                  {/* Δέκατα Header */}
                  <rect x="137" y="10" width="95" height="46" rx="8" fill="#115e59" />
                  <text x="184" y="32" fill="#99f6e4" fontSize="10.5" fontWeight="700" textAnchor="middle">
                    {t.tableTenths}
                  </text>
                  <text x="184" y="47" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    {t.tableTenthsSym}
                  </text>

                  {/* Εκατοστά Header */}
                  <rect x="240" y="10" width="95" height="46" rx="8" fill="#854d0e" />
                  <text x="287" y="32" fill="#fde68a" fontSize="10.5" fontWeight="700" textAnchor="middle">
                    {t.tableHundredths}
                  </text>
                  <text x="287" y="47" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    {t.tableHundredthsSym}
                  </text>

                  {/* Χιλιοστά Header */}
                  <rect x="343" y="10" width="107" height="46" rx="8" fill="#9f1239" />
                  <text x="396" y="32" fill="#fecdd3" fontSize="10.5" fontWeight="700" textAnchor="middle">
                    {t.tableThousandths}
                  </text>
                  <text x="396" y="47" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    {t.tableThousandthsSym}
                  </text>

                  {/* Values Row */}
                  <rect x="10" y="68" width="85" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="52" y="113" fill="#60a5fa" fontSize="28" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {integerPart}
                  </text>

                  <rect x="103" y="68" width="26" height="68" rx="6" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="116" y="113" fill="#94a3b8" fontSize="28" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {decimalSeparator}
                  </text>

                  <rect x="137" y="68" width="95" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="184" y="113" fill="#2dd4bf" fontSize="28" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {tenthsDigit}
                  </text>

                  <rect x="240" y="68" width="95" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="287" y="113" fill="#fbbf24" fontSize="28" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {hundredthsDigit}
                  </text>

                  <rect x="343" y="68" width="107" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="396" y="113" fill="#fb7185" fontSize="28" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {thousandthsDigit}
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* ΟΛΟΓΡΑΦΗ ΕΞΗΓΗΣΗ (2 ΤΡΟΠΟΙ ΑΝΑΓΝΩΣΗΣ) */}
          <div className="bg-emerald-50/80 p-5 sm:p-6 rounded-2xl border border-emerald-200 text-center space-y-2">
            <span className="text-xs font-black uppercase text-emerald-900 block">
              {toCleanUppercase(t.readingHeader)}
            </span>

            {isDecimalZero ? (
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-4 py-2.5 bg-white rounded-xl border border-emerald-200 shadow-sm text-base sm:text-lg font-black text-emerald-950">
                « <span className="text-indigo-700">{way1}</span> »
              </div>
            ) : (
              <div className="inline-flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base font-bold text-emerald-950">
                <span className="bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shadow-sm">
                  « <span className="text-indigo-700 font-black">{way1}</span> »
                </span>
                <span className="text-xs font-black text-emerald-600 uppercase">{t.orConnector}</span>
                <span className="bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shadow-sm">
                  « <span className="text-purple-700 font-black">{way2}</span> »
                </span>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 {t.bottomTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">
              {t.bottomDesc}
            </p>
          </div>
          <Link
            href="/d-dimotikou/11-dekadikoi-3-psifia-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.bottomBtn}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
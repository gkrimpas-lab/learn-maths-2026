// pages/d-dimotikou/7-dekadikoi-sinexeia.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ ΚΑΘΑΡΙΣΜΟΥ & ΤΥΠΟΓΡΑΦΙΑΣ --- //

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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumberLocale(num, locale = 'el', options = {}) {
  if (num === null || num === undefined || isNaN(num)) return '';
  return num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR', options);
}

// Component για κανονική μαθηματική γραφή κλασμάτων (κατακόρυφη διάταξη)
const Fraction = ({ num, den, inline = false }) => (
  <span
    className={`${
      inline ? 'inline-flex' : 'flex'
    } flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none select-none`}
  >
    <span className="px-1.5 pb-0.5 text-center text-xs sm:text-sm border-b-2 border-current">
      {num}
    </span>
    <span className="px-1.5 pt-0.5 text-center text-xs sm:text-sm">
      {den}
    </span>
  </span>
);

// --- ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n --- //
const translations = {
  el: {
    metaTitle: "Δεκαδικοί Αριθμοί & Δεκαδικά Κλάσματα - Θεωρία | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε τη σχέση δεκαδικών κλασμάτων και δεκαδικών αριθμών, την αξία θέσης (μονάδες, δέκατα, εκατοστά) και τους τρόπους ανάγνωσης.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    exercisesUrl: "/d-dimotikou/7-dekadikoi-sinexeia-ask",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Δεκαδικοί Αριθμοί και Δεκαδικά Κλάσματα",
    heroDesc: "Μαθαίνουμε τα δέκατα, τα εκατοστά, τον πίνακα αξίας θέσης και πώς μετατρέπουμε με ευκολία τα δεκαδικά κλάσματα σε δεκαδικούς αριθμούς!",
    promoReadyTitle: "Έτοιμος για εξάσκηση;",
    promoReadyDesc: "Δοκίμασε τις ασκήσεις στους δεκαδικούς αριθμούς για να τελειοποιήσεις τις γνώσεις σου!",
    promoReadyBtn: "Μετάβαση στις Ασκήσεις",
    // Section 1
    sec1Title: "Αναλυτική Θεωρία και Ορισμοί",
    cardFractionsTitle: "Δεκαδικά Κλάσματα",
    cardFractionsDesc1: "ονομάζονται τα κλάσματα που έχουν παρονομαστή το",
    cardFractionsDesc2: "(ή το 1.000):",
    cardFractionsBold1: "Δεκαδικά κλάσματα",
    cardFractionsBold2: "10 ή το 100",
    fractionTenthWord: "1 δέκατο",
    fractionHundredthWord: "1 εκατοστό",
    cardDecimalsTitle: "Δεκαδικοί Αριθμοί",
    cardDecimalsDesc: "Κάθε δεκαδικό κλάσμα γράφεται και ως",
    cardDecimalsBold: "δεκαδικός αριθμός",
    cardDecimalsTail: "χρησιμοποιώντας την υποδιαστολή (κόμμα «,»):",
    decTenthsNote: "(1 δεκαδικό ψηφίο: δέκατα)",
    decHundredthsNote: "(2 δεκαδικά ψηφία: εκατοστά)",
    analysisTitle: "Τα δύο μέρη του δεκαδικού αριθμού:",
    cardIntPartTitle: "1. Ακέραιο Μέρος (πριν το κόμμα)",
    cardIntPartDesc: "Δείχνει τις ολόκληρες ακέραιες μονάδες:",
    cardIntPartUnits: "Μονάδες (Μ)",
    cardDecPartTitle: "2. Δεκαδικό Μέρος (μετά το κόμμα)",
    cardDecPartDesc: "Δείχνει τα κομμάτια (υποδιαιρέσεις) της μονάδας:",
    cardDecPartTenths: "δέκατα (δ)",
    cardDecPartHundredths: "εκατοστά (ε)",
    // Section 2
    sec2Title: "Διαδραστικός Μετατροπέας Κλασμάτων και Δεκαδικών",
    sec2Desc: "Άλλαξε τον αριθμητή και παρατήρησε άμεσα τη μετατροπή σε δεκαδικό και τον πίνακα αξίας θέσης!",
    modeTenthsBtn: "/ 10 (Δέκατα)",
    modeHundredthsBtn: "/ 100 (Εκατοστά)",
    randomBtn: "Τυχαίος",
    sliderNumeratorLabel: "ΑΡΙΘΜΗΤΗΣ ΚΛΑΣΜΑΤΟΣ",
    btnDecrease: "Μείωση",
    btnIncrease: "Αύξηση",
    step1Title: "1. Δεκαδικό Κλάσμα",
    step2Title: "2. Δεκαδικός Αριθμός",
    step3Title: "3. Πίνακας Αξίας Θέσης",
    colUnitsName: "Μονάδες",
    colUnitsShort: "(Μ)",
    colTenthsName: "Δέκατα",
    colTenthsShort: "(δ)",
    colHundredthsName: "Εκατοστά",
    colHundredthsShort: "(ε)",
    readTitle: "Πώς διαβάζεται ο αριθμός:",
    readOrWord: "ή",
    readWordZero: "μηδέν",
    readWordComma: "κόμμα",
    readWordAnd: "και",
    nameTenthsPlural: "δέκατα",
    nameHundredthsPlural: "εκατοστά",
    // Bottom Promo
    bottomPromoTitle: "Ώρα για Εξάσκηση!",
    bottomPromoDesc: "Έμαθες τους δεκαδικούς αριθμούς και τα δεκαδικά κλάσματα; Δοκίμασε τις διαδραστικές ασκήσεις!",
    bottomPromoBtn: "Ξεκίνα τις Ασκήσεις ➔"
  },
  en: {
    metaTitle: "Decimal Numbers & Decimal Fractions - Theory | LearnMaths.gr",
    metaDesc: "Learn the relationship between decimal fractions and decimals, place value (units, tenths, hundredths), and reading methods.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    exercisesBtn: "Exercises",
    exercisesUrl: "/en/d-dimotikou/7-dekadikoi-sinexeia-ask",
    badge: "4TH GRADE",
    heroTitle: "Decimal Numbers and Decimal Fractions",
    heroDesc: "Learn tenths, hundredths, the place value chart, and how to convert decimal fractions into decimals with ease!",
    promoReadyTitle: "Ready for practice?",
    promoReadyDesc: "Try the decimal practice exercises to master reading, writing, and place value!",
    promoReadyBtn: "Go to Exercises",
    // Section 1
    sec1Title: "Detailed Theory and Definitions",
    cardFractionsTitle: "Decimal Fractions",
    cardFractionsDesc1: "are called the fractions whose denominator is",
    cardFractionsDesc2: "(or 1,000):",
    cardFractionsBold1: "Decimal fractions",
    cardFractionsBold2: "10 or 100",
    fractionTenthWord: "1 tenth",
    fractionHundredthWord: "1 hundredth",
    cardDecimalsTitle: "Decimal Numbers",
    cardDecimalsDesc: "Every decimal fraction can also be written as a",
    cardDecimalsBold: "decimal number",
    cardDecimalsTail: "using a decimal point (\".\"): ",
    decTenthsNote: "(1 decimal place: tenths)",
    decHundredthsNote: "(2 decimal places: hundredths)",
    analysisTitle: "The two parts of a decimal number:",
    cardIntPartTitle: "1. Whole / Integer Part (before the decimal point)",
    cardIntPartDesc: "Shows the whole units:",
    cardIntPartUnits: "Units (U)",
    cardDecPartTitle: "2. Decimal Part (after the decimal point)",
    cardDecPartDesc: "Shows fractional subdivisions of the unit:",
    cardDecPartTenths: "tenths (t)",
    cardDecPartHundredths: "hundredths (h)",
    // Section 2
    sec2Title: "Interactive Fraction and Decimal Converter",
    sec2Desc: "Change the numerator and instantly observe decimal conversion and place value alignment!",
    modeTenthsBtn: "/ 10 (Tenths)",
    modeHundredthsBtn: "/ 100 (Hundredths)",
    randomBtn: "Random",
    sliderNumeratorLabel: "FRACTION NUMERATOR",
    btnDecrease: "Decrease",
    btnIncrease: "Increase",
    step1Title: "1. Decimal Fraction",
    step2Title: "2. Decimal Number",
    step3Title: "3. Place Value Chart",
    colUnitsName: "Units",
    colUnitsShort: "(U)",
    colTenthsName: "Tenths",
    colTenthsShort: "(t)",
    colHundredthsName: "Hundredths",
    colHundredthsShort: "(h)",
    readTitle: "How the number is read:",
    readOrWord: "or",
    readWordZero: "zero",
    readWordComma: "point",
    readWordAnd: "and",
    nameTenthsPlural: "tenths",
    nameHundredthsPlural: "hundredths",
    // Bottom Promo
    bottomPromoTitle: "Time to Practice!",
    bottomPromoDesc: "Mastered decimals and decimal fractions? Try the interactive practice exercises!",
    bottomPromoBtn: "Start Exercises ➔"
  }
};

export default function DekadikoiTheoryPage() {
  const router = useRouter();
  const rawLocale = router.locale || router.query.locale;
  const currentLocale = rawLocale === 'en' ? 'en' : 'el';
  const t = translations[currentLocale];

  const [mode, setMode] = useState('tenths');
  const [numerator, setNumerator] = useState(35);

  const denominator = mode === 'tenths' ? 10 : 100;
  const decimalVal = numerator / denominator;

  const integerPart = Math.floor(decimalVal);
  const decimalPartString = (decimalVal % 1).toFixed(mode === 'tenths' ? 1 : 2).substring(2);

  const tenthsDigit = parseInt(decimalPartString[0] || '0', 10);
  const hundredthsDigit = mode === 'hundredths' ? parseInt(decimalPartString[1] || '0', 10) : 0;

  const decimalPartName = mode === 'tenths' ? t.nameTenthsPlural : t.nameHundredthsPlural;
  const isDecimalZero = parseInt(decimalPartString, 10) === 0;

  let way1 = '';
  let way2 = '';

  if (isDecimalZero) {
    way1 = `${formatNumberLocale(integerPart, currentLocale)}`;
    way2 = `${formatNumberLocale(integerPart, currentLocale)}`;
  } else if (integerPart === 0) {
    way1 = `${parseInt(decimalPartString, 10)} ${decimalPartName}`;
    way2 = `${t.readWordZero} ${t.readWordComma} ${decimalPartString}`;
  } else {
    way1 = `${formatNumberLocale(integerPart, currentLocale)} ${t.readWordAnd} ${parseInt(decimalPartString, 10)} ${decimalPartName}`;
    way2 = `${formatNumberLocale(integerPart, currentLocale)} ${t.readWordComma} ${decimalPartString}`;
  }

  const handleRandomize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (mode === 'tenths') {
      setNumerator(getRandomInt(1, 99));
    } else {
      setNumerator(getRandomInt(1, 499));
    }
  };

  const handleModeSwitch = (e, newMode, defaultVal) => {
    e.preventDefault();
    e.stopPropagation();
    setMode(newMode);
    setNumerator(defaultVal);
  };

  const updateNumerator = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    const maxVal = mode === 'tenths' ? 99 : 499;
    setNumerator((prev) => Math.max(1, Math.min(maxVal, prev + delta)));
  };

  const sampleDecimalString = currentLocale === 'en' ? '3.54' : '3,54';

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl={t.backUrl}
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href={t.exercisesUrl}
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.badge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                🔢 {t.heroTitle}
              </h1>
              <p className="text-teal-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.promoReadyTitle}</h3>
              <p className="text-xs text-teal-100">
                {t.promoReadyDesc}
              </p>
              <Link
                href={t.exercisesUrl}
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 {t.promoReadyBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - SECTION 1 */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> {t.sec1Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Δεκαδικά Κλάσματα */}
            <div className="bg-teal-50/70 p-5 sm:p-6 rounded-2xl border border-teal-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-teal-900 flex items-center gap-2">
                <span>🍰</span> {t.cardFractionsTitle}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>{t.cardFractionsBold1}</strong> {t.cardFractionsDesc1} <strong>{t.cardFractionsBold2}</strong> {t.cardFractionsDesc2}
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2 flex-wrap">
                  <span className="text-teal-600 font-bold">•</span>
                  <Fraction num="1" den="10" inline={true} />
                  <span>＝</span>
                  <span className="font-bold">{t.fractionTenthWord}</span>
                </li>
                <li className="flex items-center gap-2 flex-wrap">
                  <span className="text-teal-600 font-bold">•</span>
                  <Fraction num="1" den="100" inline={true} />
                  <span>＝</span>
                  <span className="font-bold">{t.fractionHundredthWord}</span>
                </li>
              </ul>
            </div>

            {/* Δεκαδικοί Αριθμοί */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>✏️</span> {t.cardDecimalsTitle}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t.cardDecimalsDesc} <strong>{t.cardDecimalsBold}</strong> {t.cardDecimalsTail}
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2 flex-wrap">
                  <span className="text-indigo-600 font-bold">•</span>
                  <Fraction num="3" den="10" inline={true} />
                  <span>＝</span>
                  <strong className="text-indigo-700 font-bold font-mono">
                    {formatNumberLocale(0.3, currentLocale, { minimumFractionDigits: 1 })}
                  </strong>
                  <span className="text-slate-500 font-normal">{t.decTenthsNote}</span>
                </li>
                <li className="flex items-center gap-2 flex-wrap">
                  <span className="text-indigo-600 font-bold">•</span>
                  <Fraction num="25" den="100" inline={true} />
                  <span>＝</span>
                  <strong className="text-indigo-700 font-bold font-mono">
                    {formatNumberLocale(0.25, currentLocale, { minimumFractionDigits: 2 })}
                  </strong>
                  <span className="text-slate-500 font-normal">{t.decHundredthsNote}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ΑΝΑΛΥΣΗ ΜΕΡΩΝ ΔΕΚΑΔΙΚΟΥ */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
              🔍 {t.analysisTitle} <span className="text-indigo-600 font-mono">{sampleDecimalString}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <h4 className="font-bold text-blue-700 border-b pb-1 text-sm sm:text-base">
                  {t.cardIntPartTitle}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {t.cardIntPartDesc}
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-blue-50/80 rounded-xl border border-blue-200/80 font-mono font-bold text-slate-900 w-full">
                  <span className="text-blue-600 text-lg sm:text-xl">3</span>
                  <span>{currentLocale === 'en' ? '. 54' : ', 54'}</span>
                  <span>➔</span>
                  <span className="text-blue-700">3 {t.cardIntPartUnits}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <h4 className="font-bold text-purple-700 border-b pb-1 text-sm sm:text-base">
                  {t.cardDecPartTitle}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {t.cardDecPartDesc}
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-purple-50/80 rounded-xl border border-purple-200/80 font-mono font-bold text-slate-900 w-full">
                  <span>3 {currentLocale === 'en' ? '.' : ','}</span>
                  <span className="text-teal-600 text-lg sm:text-xl">5</span>
                  <span className="text-amber-600 text-lg sm:text-xl">4</span>
                  <span>➔</span>
                  <span className="text-teal-700">5 {t.cardDecPartTenths}</span>
                  <span>＆</span>
                  <span className="text-amber-700">4 {t.cardDecPartHundredths}</span>
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
                <span>🧮</span> {t.sec2Title}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                {t.sec2Desc}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={(e) => handleModeSwitch(e, 'tenths', 35)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  mode === 'tenths'
                    ? 'bg-indigo-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.modeTenthsBtn}
              </button>
              <button
                type="button"
                onClick={(e) => handleModeSwitch(e, 'hundredths', 145)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation ${
                  mode === 'hundredths'
                    ? 'bg-purple-600 text-white shadow-md font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.modeHundredthsBtn}
              </button>
              <button
                type="button"
                onClick={handleRandomize}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs sm:text-sm transition shadow-sm active:scale-95 touch-manipulation"
              >
                🎲 {t.randomBtn}
              </button>
            </div>
          </div>

          {/* TOUCH SLIDER ΧΕΙΡΙΣΜΟΥ */}
          <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-2">
            <div className="h-8 flex items-center justify-between text-center px-1">
              <span className="text-xs font-black uppercase text-slate-500">
                {t.sliderNumeratorLabel}
              </span>
              <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                {formatNumberLocale(numerator, currentLocale)}
              </span>
            </div>

            <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
              <button
                type="button"
                onClick={(e) => updateNumerator(e, -1)}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                title="-1"
                aria-label={t.btnDecrease}
              >
                －
              </button>

              <input
                type="range"
                min="1"
                max={mode === 'tenths' ? 99 : 499}
                value={numerator}
                onChange={(e) => setNumerator(Number(e.target.value))}
                className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
              />

              <button
                type="button"
                onClick={(e) => updateNumerator(e, 1)}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                title="+1"
                aria-label={t.btnIncrease}
              >
                ＋
              </button>
            </div>
          </div>

          {/* ΠΡΟΒΟΛΗ ΚΛΑΣΜΑΤΟΣ, ΔΕΚΑΔΙΚΟΥ & ΠΙΝΑΚΑ ΑΞΙΑΣ ΘΕΣΗΣ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* 1. Δεκαδικό Κλάσμα (Κατακόρυφο κλάσμα) */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl border border-indigo-200 text-center space-y-2 shadow-sm">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-500 block">
                {t.step1Title}
              </span>
              <div className="py-2 flex justify-center">
                <span className="inline-flex flex-col items-center justify-center font-mono font-black text-3xl sm:text-4xl text-indigo-900 leading-none select-none">
                  <span className="px-3 pb-1 border-b-4 border-indigo-900">{formatNumberLocale(numerator, currentLocale)}</span>
                  <span className="px-3 pt-1">{formatNumberLocale(denominator, currentLocale)}</span>
                </span>
              </div>
            </div>

            {/* 2. Δεκαδικός Αριθμός */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-200 text-center space-y-2 shadow-sm">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-500 block">
                {t.step2Title}
              </span>
              <div className="font-mono font-black text-4xl sm:text-5xl text-purple-900 py-4">
                {formatNumberLocale(decimalVal, currentLocale, {
                  minimumFractionDigits: mode === 'tenths' ? 1 : 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            {/* 3. Πίνακας Αξίας Θέσης (Responsive SVG) */}
            <div className="bg-slate-950 p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block text-center">
                {t.step3Title}
              </span>

              <div className="w-full flex justify-center">
                <svg
                  viewBox="0 0 420 150"
                  className="w-full h-auto max-w-[340px] block select-none font-sans"
                >
                  {/* Headers */}
                  <rect x="10" y="10" width="115" height="46" rx="8" fill="#1e3a8a" />
                  <text x="67" y="32" fill="#93c5fd" fontSize="11" fontWeight="700" textAnchor="middle">
                    {t.colUnitsName}
                  </text>
                  <text x="67" y="47" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    {t.colUnitsShort}
                  </text>

                  {/* Υποδιαστολή / Decimal Point Header */}
                  <rect x="135" y="10" width="30" height="46" rx="8" fill="#334155" />
                  <text x="150" y="38" fill="#94a3b8" fontSize="18" fontWeight="900" textAnchor="middle">
                    {currentLocale === 'en' ? '.' : ','}
                  </text>

                  {/* Δέκατα Header */}
                  <rect x="175" y="10" width="115" height="46" rx="8" fill="#115e59" />
                  <text x="232" y="32" fill="#99f6e4" fontSize="11" fontWeight="700" textAnchor="middle">
                    {t.colTenthsName}
                  </text>
                  <text x="232" y="47" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    {t.colTenthsShort}
                  </text>

                  {/* Εκατοστά Header */}
                  <rect x="295" y="10" width="115" height="46" rx="8" fill="#854d0e" />
                  <text x="352" y="32" fill="#fde68a" fontSize="11" fontWeight="700" textAnchor="middle">
                    {t.colHundredthsName}
                  </text>
                  <text x="352" y="47" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                    {t.colHundredthsShort}
                  </text>

                  {/* Values Row */}
                  <rect x="10" y="68" width="115" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="67" y="113" fill="#60a5fa" fontSize="30" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {integerPart}
                  </text>

                  <rect x="135" y="68" width="30" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="150" y="113" fill="#94a3b8" fontSize="30" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {currentLocale === 'en' ? '.' : ','}
                  </text>

                  <rect x="175" y="68" width="115" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="232" y="113" fill="#2dd4bf" fontSize="30" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {tenthsDigit}
                  </text>

                  <rect x="295" y="68" width="115" height="68" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                  <text x="352" y="113" fill="#fbbf24" fontSize="30" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                    {mode === 'hundredths' ? hundredthsDigit : '－'}
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* ΟΛΟΓΡΑΦΗ ΕΞΗΓΗΣΗ (2 ΤΡΟΠΟΙ ΑΝΑΓΝΩΣΗΣ) */}
          <div className="bg-emerald-50/80 p-5 sm:p-6 rounded-2xl border border-emerald-200 text-center space-y-2">
            <span className="text-xs font-black uppercase text-emerald-900 block">
              🗣️ {t.readTitle}
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
                <span className="text-xs font-black text-emerald-600 uppercase">{t.readOrWord}</span>
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
            <h3 className="text-xl sm:text-2xl font-black">📝 {t.bottomPromoTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">
              {t.bottomPromoDesc}
            </p>
          </div>
          <Link
            href={t.exercisesUrl}
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.bottomPromoBtn}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
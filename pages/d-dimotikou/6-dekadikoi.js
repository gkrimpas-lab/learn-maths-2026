// pages/d-dimotikou/6-dekadikoi.js
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
    metaDesc: "Μαθαίνουμε πώς συνδέονται τα δεκαδικά κλάσματα με τους δεκαδικούς αριθμούς, τα δέκατα και τα εκατοστά με διαδραστική οπτικοποίηση μονάδας.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    exercisesUrl: "/d-dimotikou/6-dekadikoi-ask",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Δεκαδικά Κλάσματα και Δεκαδικοί Αριθμοί",
    heroDesc: "Ανακαλύπτουμε πώς μετατρέπουμε τα κλάσματα σε δεκαδικούς αριθμούς με υποδιαστολή, γνωρίζοντας τα δέκατα και τα εκατοστά!",
    promoReadyTitle: "Έτοιμος για εξάσκηση;",
    promoReadyDesc: "Δοκίμασε τις ασκήσεις στους δεκαδικούς αριθμούς για να σιγουρευτείς ότι τα έμαθες όλα!",
    promoReadyBtn: "Μετάβαση στις Ασκήσεις",
    // Section 1
    sec1Title: "Από τα Κλάσματα στους Δεκαδικούς Αριθμούς",
    cardFractionsTitle: "Τι είναι τα Δεκαδικά Κλάσματα;",
    cardFractionsDesc1: "Όταν χωρίζουμε μια ακέραιη μονάδα σε",
    cardFractionsDesc2: "δημιουργούμε τα",
    cardFractionsBold1: "10, 100 ή 1.000 ίσα μέρη",
    cardFractionsBold2: "δεκαδικά κλάσματα",
    cardFractionsItem1Lead: "10 ίσα μέρη:",
    cardFractionsItem1Tail: "Κάθε μέρος είναι το",
    cardFractionsItem1Name: "(ένα δέκατο).",
    cardFractionsItem2Lead: "100 ίσα μέρη:",
    cardFractionsItem2Tail: "Κάθε μέρος είναι το",
    cardFractionsItem2Name: "(ένα εκατοστό).",
    cardDecimalsTitle: "Η Υποδιαστολή και οι Δεκαδικοί",
    cardDecimalsDesc: "Κάθε δεκαδικό κλάσμα γράφεται πιο σύντομα ως",
    cardDecimalsBold: "δεκαδικός αριθμός",
    cardDecimalsTail: "με υποδιαστολή:",
    decTenthsNote: "(1ο ψηφίο μετά την υποδιαστολή: δέκατα)",
    decHundredthsNote: "(2ο ψηφίο μετά την υποδιαστολή: εκατοστά)",
    // Section 2
    sec2Title: "Διαδραστική Συσχέτιση Κλάσματος & Δεκαδικού",
    sec2Desc: "Επίλεξε δέκατα ή εκατοστά, σύρε τη μπάρα και παρατήρησε την ταυτόχρονη κλασματική και δεκαδική αναπαράσταση!",
    modeTenthsBtn: "Δέκατα (1/10)",
    modeHundredthsBtn: "Εκατοστά (1/100)",
    equivalenceBadge: "ΙΣΟΔΥΝΑΜΙΑ ΚΛΑΣΜΑΤΟΣ ΚΑΙ ΔΕΚΑΔΙΚΟΥ ΑΡΙΘΜΟΥ",
    selectionLabel: "ΕΠΙΛΟΓΗ ΜΕΡΩΝ",
    selectionTenths: "ΔΕΚΑΤΑ",
    selectionHundredths: "ΕΚΑΤΟΣΤΑ",
    btnDecrease: "Μείωση τιμής",
    btnIncrease: "Αύξηση τιμής",
    unitVisualTitle: "Γεωμετρικη Οπτικοποιηση της Ενιαιας Μοναδας:",
    coloredPartsLabel: "Χρωματισμένα μέρη:",
    fromTotalLabel: "από τα",
    equalSlicesLabel: "ίσα τμήματα της μονάδας.",
    // Bottom Promo
    bottomPromoTitle: "Ώρα για Εξάσκηση στους Δεκαδικούς!",
    bottomPromoDesc: "Κατάλαβες πώς συνδέονται τα κλάσματα με τους δεκαδικούς αριθμούς; Κάνε τις διαδραστικές ασκήσεις!",
    bottomPromoBtn: "Ξεκίνα τις Ασκήσεις ➔"
  },
  en: {
    metaTitle: "Decimals & Decimal Fractions - Theory | LearnMaths.gr",
    metaDesc: "Learn how decimal fractions connect with decimal numbers, tenths, and hundredths through an interactive visual unit model.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    exercisesBtn: "Exercises",
    exercisesUrl: "/en/d-dimotikou/6-dekadikoi-ask",
    badge: "4TH GRADE",
    heroTitle: "Decimal Fractions and Decimal Numbers",
    heroDesc: "Discover how to convert fractions into decimal numbers with a decimal point, exploring tenths and hundredths!",
    promoReadyTitle: "Ready for practice?",
    promoReadyDesc: "Try the decimal numbers practice exercises to make sure you have mastered everything!",
    promoReadyBtn: "Go to Exercises",
    // Section 1
    sec1Title: "From Fractions to Decimal Numbers",
    cardFractionsTitle: "What are Decimal Fractions?",
    cardFractionsDesc1: "When we divide a whole unit into",
    cardFractionsDesc2: "we create",
    cardFractionsBold1: "10, 100, or 1,000 equal parts",
    cardFractionsBold2: "decimal fractions",
    cardFractionsItem1Lead: "10 equal parts:",
    cardFractionsItem1Tail: "Each part is",
    cardFractionsItem1Name: "(one tenth).",
    cardFractionsItem2Lead: "100 equal parts:",
    cardFractionsItem2Tail: "Each part is",
    cardFractionsItem2Name: "(one hundredth).",
    cardDecimalsTitle: "The Decimal Point and Decimals",
    cardDecimalsDesc: "Every decimal fraction can be written more concisely as a",
    cardDecimalsBold: "decimal number",
    cardDecimalsTail: "with a decimal point:",
    decTenthsNote: "(1st digit after decimal point: tenths)",
    decHundredthsNote: "(2nd digit after decimal point: hundredths)",
    // Section 2
    sec2Title: "Interactive Fraction & Decimal Converter",
    sec2Desc: "Choose tenths or hundredths, drag the slider, and observe the simultaneous fraction and decimal representations!",
    modeTenthsBtn: "Tenths (1/10)",
    modeHundredthsBtn: "Hundredths (1/100)",
    equivalenceBadge: "EQUIVALENCE OF FRACTION AND DECIMAL NUMBER",
    selectionLabel: "SELECT PARTS",
    selectionTenths: "TENTHS",
    selectionHundredths: "HUNDREDTHS",
    btnDecrease: "Decrease value",
    btnIncrease: "Increase value",
    unitVisualTitle: "Geometric Visualization of the Whole Unit:",
    coloredPartsLabel: "Shaded parts:",
    fromTotalLabel: "out of",
    equalSlicesLabel: "equal slices of the unit.",
    // Bottom Promo
    bottomPromoTitle: "Time to Practice Decimals!",
    bottomPromoDesc: "Understood how fractions relate to decimal numbers? Try the interactive practice exercises!",
    bottomPromoBtn: "Start Exercises ➔"
  }
};

export default function DekadikoiPage() {
  const router = useRouter();
  const rawLocale = router.locale || router.query.locale;
  const currentLocale = rawLocale === 'en' ? 'en' : 'el';
  const t = translations[currentLocale];

  const [decimalMode, setDecimalMode] = useState('tenths');
  const [decimalValue, setDecimalValue] = useState(4);

  const maxSlices = decimalMode === 'tenths' ? 10 : 100;
  const numericDecimal = decimalValue / maxSlices;

  const handleModeChange = (e, mode) => {
    e.preventDefault();
    e.stopPropagation();
    setDecimalMode(mode);
    setDecimalValue(mode === 'tenths' ? 4 : 40);
  };

  const updateValue = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setDecimalValue((prev) => Math.max(0, Math.min(maxSlices, prev + delta)));
  };

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
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.badge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                🍰 {t.heroTitle}
              </h1>
              <p className="text-amber-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.promoReadyTitle}</h3>
              <p className="text-xs text-amber-100">
                {t.promoReadyDesc}
              </p>
              <Link
                href={t.exercisesUrl}
                className="inline-block w-full bg-white hover:bg-amber-50 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
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
            {/* Ορισμός Δεκαδικών Κλασμάτων */}
            <div className="bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-amber-900 flex items-center gap-2">
                <span>🔹</span> {t.cardFractionsTitle}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t.cardFractionsDesc1} <strong>{t.cardFractionsBold1}</strong>, {t.cardFractionsDesc2}{' '}
                <strong>{t.cardFractionsBold2}</strong>:
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2 flex-wrap">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>{t.cardFractionsItem1Lead}</strong> {t.cardFractionsItem1Tail}</span>
                  <Fraction num="1" den="10" inline={true} />
                  <span>{t.cardFractionsItem1Name}</span>
                </li>
                <li className="flex items-center gap-2 flex-wrap">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>{t.cardFractionsItem2Lead}</strong> {t.cardFractionsItem2Tail}</span>
                  <Fraction num="1" den="100" inline={true} />
                  <span>{t.cardFractionsItem2Name}</span>
                </li>
              </ul>
            </div>

            {/* Δεκαδικοί Αριθμοί & Υποδιαστολή */}
            <div className="bg-orange-50/70 p-5 sm:p-6 rounded-2xl border border-orange-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-orange-900 flex items-center gap-2">
                <span>✍️</span> {t.cardDecimalsTitle}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t.cardDecimalsDesc} <strong>{t.cardDecimalsBold}</strong> {t.cardDecimalsTail}
              </p>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="inline-flex flex-wrap items-center gap-2 p-2.5 bg-white rounded-xl border border-orange-200 font-mono text-slate-900 w-full font-bold">
                  <Fraction num="1" den="10" inline={true} />
                  <span>＝</span>
                  <span className="text-amber-600 font-black text-base">{formatNumberLocale(0.1, currentLocale, { minimumFractionDigits: 1 })}</span>
                  <span className="font-sans text-xs text-slate-600 font-normal">{t.decTenthsNote}</span>
                </div>
                <div className="inline-flex flex-wrap items-center gap-2 p-2.5 bg-white rounded-xl border border-orange-200 font-mono text-slate-900 w-full font-bold">
                  <Fraction num="1" den="100" inline={true} />
                  <span>＝</span>
                  <span className="text-orange-600 font-black text-base">{formatNumberLocale(0.01, currentLocale, { minimumFractionDigits: 2 })}</span>
                  <span className="font-sans text-xs text-slate-600 font-normal">{t.decHundredthsNote}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🎚️</span> {t.sec2Title}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                {t.sec2Desc}
              </p>
            </div>

            {/* Toggles Επιλογής Τάξης */}
            <div className="flex gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={(e) => handleModeChange(e, 'tenths')}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition active:scale-95 touch-manipulation ${
                  decimalMode === 'tenths'
                    ? 'bg-amber-500 text-white shadow-md font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t.modeTenthsBtn}
              </button>
              <button
                type="button"
                onClick={(e) => handleModeChange(e, 'hundredths')}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition active:scale-95 touch-manipulation ${
                  decimalMode === 'hundredths'
                    ? 'bg-amber-500 text-white shadow-md font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t.modeHundredthsBtn}
              </button>
            </div>
          </div>

          {/* ΠΡΟΒΟΛΗ ΚΛΑΣΜΑΤΙΚΗΣ & ΔΕΚΑΔΙΚΗΣ ΜΟΡΦΗΣ */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 sm:p-8 rounded-2xl shadow-md text-center space-y-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-200">
              {t.equivalenceBadge}
            </span>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-1">
              {/* Κλασματική Μορφή (Κατακόρυφο κλάσμα) */}
              <div className="bg-white/10 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/20">
                <div className="inline-flex flex-col items-center justify-center leading-none">
                  <span className="text-amber-200 font-mono font-black text-3xl sm:text-4xl pb-1">
                    {formatNumberLocale(decimalValue, currentLocale)}
                  </span>
                  <div className="w-16 sm:w-20 h-1 bg-white rounded-full my-1"></div>
                  <span className="text-white font-mono font-black text-3xl sm:text-4xl pt-1">
                    {formatNumberLocale(maxSlices, currentLocale)}
                  </span>
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-amber-200">＝</div>

              {/* Δεκαδική Μορφή */}
              <div className="bg-white text-amber-600 font-mono font-black text-3xl sm:text-5xl px-7 py-3.5 rounded-2xl shadow-inner min-w-[140px]">
                {formatNumberLocale(numericDecimal, currentLocale, {
                  minimumFractionDigits: decimalMode === 'tenths' ? 1 : 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          {/* TOUCH SLIDER ΧΕΙΡΙΣΜΟΥ */}
          <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="h-8 flex items-center justify-between text-center px-1">
              <span className="text-xs font-black uppercase text-slate-500">
                {t.selectionLabel} ({decimalMode === 'tenths' ? t.selectionTenths : t.selectionHundredths})
              </span>
              <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-amber-600 text-base">
                {formatNumberLocale(decimalValue, currentLocale)} / {formatNumberLocale(maxSlices, currentLocale)}
              </span>
            </div>

            <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
              <button
                type="button"
                onClick={(e) => updateValue(e, decimalMode === 'tenths' ? -1 : -5)}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                title="-1"
                aria-label={t.btnDecrease}
              >
                －
              </button>

              <input
                type="range"
                min="0"
                max={maxSlices}
                value={decimalValue}
                onChange={(e) => setDecimalValue(parseInt(e.target.value, 10))}
                className="w-full min-w-0 max-w-full accent-amber-500 cursor-pointer"
              />

              <button
                type="button"
                onClick={(e) => updateValue(e, decimalMode === 'tenths' ? 1 : 5)}
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                title="+1"
                aria-label={t.btnIncrease}
              >
                ＋
              </button>
            </div>
          </div>

          {/* ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΟΝΑΔΑΣ (RESPONSIVE SVG) */}
          <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200/90 space-y-3">
            <span className="text-xs font-black uppercase text-slate-500 block text-center sm:text-left">
              {t.unitVisualTitle}
            </span>

            <div className="bg-white p-3 sm:p-5 rounded-2xl border border-slate-200 shadow-inner flex justify-center">
              {decimalMode === 'tenths' ? (
                // 10 Δέκατα σε οριζόντια μπάρα
                <svg
                  viewBox="0 0 500 80"
                  className="w-full h-auto max-w-xl block select-none font-sans"
                >
                  {Array.from({ length: 10 }).map((_, i) => {
                    const isFilled = i < decimalValue;
                    const xPos = 10 + i * 48;
                    return (
                      <g key={i}>
                        <rect
                          x={xPos}
                          y="15"
                          width="44"
                          height="44"
                          rx="6"
                          fill={isFilled ? '#f59e0b' : '#f8fafc'}
                          stroke={isFilled ? '#d97706' : '#cbd5e1'}
                          strokeWidth="1.5"
                        />
                        <text
                          x={xPos + 22}
                          y="42"
                          fill={isFilled ? '#ffffff' : '#94a3b8'}
                          fontSize="12"
                          fontWeight="800"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          1/10
                        </text>
                      </g>
                    );
                  })}
                </svg>
              ) : (
                // 100 Εκατοστά σε πλέγμα 10 x 10
                <svg
                  viewBox="0 0 340 340"
                  className="w-full h-auto max-w-[280px] sm:max-w-[320px] block select-none font-sans"
                >
                  {Array.from({ length: 100 }).map((_, i) => {
                    const row = Math.floor(i / 10);
                    const col = i % 10;
                    const isFilled = i < decimalValue;
                    const xPos = 10 + col * 32;
                    const yPos = 10 + row * 32;

                    return (
                      <rect
                        key={i}
                        x={xPos}
                        y={yPos}
                        width="28"
                        height="28"
                        rx="4"
                        fill={isFilled ? '#f59e0b' : '#f8fafc'}
                        stroke={isFilled ? '#d97706' : '#e2e8f0'}
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>
              )}
            </div>

            <p className="text-xs text-slate-500 text-center font-medium">
              {t.coloredPartsLabel} <strong className="text-amber-600 font-bold">{formatNumberLocale(decimalValue, currentLocale)}</strong> {t.fromTotalLabel} <strong className="text-slate-800 font-bold">{formatNumberLocale(maxSlices, currentLocale)}</strong> {t.equalSlicesLabel}
            </p>
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
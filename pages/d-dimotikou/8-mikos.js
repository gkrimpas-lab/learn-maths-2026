// pages/d-dimotikou/8-mikos.js
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

// Μονάδες μέτρησης και οι συντελεστές τους σε σχέση με το μέτρο (m)
const UNITS = {
  km: {
    factor: 1000,
    symbol: 'km',
    nameEl: 'Χιλιόμετρο',
    nameEn: 'Kilometre',
    shortEl: 'Χιλιόμετρο',
    shortEn: 'Kilometre',
    descEl: 'Μεγάλες αποστάσεις (δρόμοι, πόλεις)',
    descEn: 'Long distances (roads, cities)',
  },
  m: {
    factor: 1,
    symbol: 'm',
    nameEl: 'Μέτρο',
    nameEn: 'Metre',
    shortEl: 'Μέτρο',
    shortEn: 'Metre',
    descEl: 'Βασική μονάδα μέτρησης (ύψος, δωμάτιο)',
    descEn: 'Base unit of measurement (height, room)',
  },
  dm: {
    factor: 0.1,
    symbol: 'dm',
    nameEl: 'Δεκατόμετρο',
    nameEn: 'Decimetre',
    shortEl: 'Δεκατόμ.',
    shortEn: 'Decim.',
    descEl: '1/10 του μέτρου (χάρακας)',
    descEn: '1/10 of a metre (ruler)',
  },
  cm: {
    factor: 0.01,
    symbol: 'cm',
    nameEl: 'Εκατοστόμετρο',
    nameEn: 'Centimetre',
    shortEl: 'Εκατοστόμ.',
    shortEn: 'Centim.',
    descEl: '1/100 του μέτρου (τετράδιο)',
    descEn: '1/100 of a metre (notebook)',
  },
  mm: {
    factor: 0.001,
    symbol: 'mm',
    nameEl: 'Χιλιοστόμετρο',
    nameEn: 'Millimetre',
    shortEl: 'Χιλιοστόμ.',
    shortEn: 'Millim.',
    descEl: '1/1000 του μέτρου (μικρά αντικείμενα)',
    descEn: '1/1000 of a metre (small objects)',
  },
};

// --- ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n --- //
const translations = {
  el: {
    metaTitle: "Μέτρηση Μήκους και Μετατροπές - Θεωρία | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε το μέτρο, τα υποπολλαπλάσιά του (dm, cm, mm), το χιλιόμετρο (km) και πώς κάνουμε μετατροπές μεταξύ των μονάδων μέτρησης μήκους.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    exercisesUrl: "/d-dimotikou/8-mikos-ask",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Μέτρηση Μήκους και Μετατροπές",
    heroDesc: "Μαθαίνουμε το μέτρο, τα υποπολλαπλάσιά του (δεκατόμετρο, εκατοστόμετρο, χιλιοστόμετρο), το χιλιόμετρο και τους κανόνες μετατροπής!",
    promoReadyTitle: "Έτοιμος για εξάσκηση;",
    promoReadyDesc: "Δοκίμασε τις ασκήσεις στις μετατροπές μήκους για να σιγουρευτείς ότι τις κατανόησες πλήρως!",
    promoReadyBtn: "Μετάβαση στις Ασκήσεις",
    // Section 1
    sec1Title: "Αναλυτική Θεωρία και Σχέσεις Μονάδων",
    cardMultipleTitle: "Πολλαπλάσιο (Χιλιόμετρο)",
    cardMultipleDesc: "Για να μετρήσουμε μεγάλες αποστάσεις χρησιμοποιούμε το",
    cardMultipleBold: "Χιλιόμετρο (km):",
    cardBaseTitle: "Βασική Μονάδα (Μέτρο)",
    cardBaseDesc: "Η βασική μονάδα μέτρησης του μήκους είναι το",
    cardBaseBold: "Μέτρο (m):",
    cardSubTitle: "Υποπολλαπλάσια του Μέτρου",
    chartTitle: "Πώς κάνουμε μετατροπές μεταξύ των μονάδων;",
    ruleLargerToSmallerTitle: "⬇️ Από Μεγαλύτερη σε Μικρότερη μονάδα:",
    ruleLargerToSmallerAction: "Πολλαπλασιάζουμε",
    ruleLargerToSmallerMults: "(· 10, · 100, · 1.000).",
    ruleLargerToSmallerExample: "Π.χ. μέτρα σε εκατοστά: 3 m ＝ 3 · 100 cm ＝ 300 cm.",
    ruleSmallerToLargerTitle: "⬆️ Από Μικρότερη σε Μεγαλύτερη μονάδα:",
    ruleSmallerToLargerAction: "Διαιρούμε",
    ruleSmallerToLargerDivs: "(: 10, : 100, : 1.000).",
    ruleSmallerToLargerExample: "Π.χ. εκατοστά σε μέτρα: 500 cm ＝ 500 : 100 m ＝ 5 m.",
    // Section 2
    sec2Title: "Διαδραστικός Μετατροπέας Μονάδων Μήκους",
    sec2Desc: "Πληκτρολόγησε μια τιμή, επίλεξε μονάδα και δες άμεσα την αυτόματη μετατροπή σε όλες τις υπόλοιπες!",
    randomBtn: "Τυχαία Τιμή",
    inputValLabel: "ΤΙΜΗ ΜΗΚΟΥΣ",
    baseUnitLabel: "ΑΡΧΙΚΗ ΜΟΝΑΔΑ ΜΕΤΡΗΣΗΣ",
    btnDecrease: "Μείωση",
    btnIncrease: "Αύξηση",
    // Bottom Promo
    bottomPromoTitle: "Ώρα για Εξάσκηση!",
    bottomPromoDesc: "Έμαθες τις μονάδες μήκους και τις μετατροπές; Δοκίμασε τις διαδραστικές ασκήσεις!",
    bottomPromoBtn: "Ξεκίνα τις Ασκήσεις ➔",
  },
  en: {
    metaTitle: "Length Measurement & Conversions - Theory | LearnMaths.gr",
    metaDesc: "Learn the metre, its submultiples (dm, cm, mm), the kilometre (km), and unit conversions for length measurements.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    exercisesBtn: "Exercises",
    exercisesUrl: "/en/d-dimotikou/8-mikos-ask",
    badge: "4TH GRADE",
    heroTitle: "Length Measurement & Conversions",
    heroDesc: "Learn the metre, its submultiples (decimetre, centimetre, millimetre), the kilometre, and length conversion rules!",
    promoReadyTitle: "Ready for practice?",
    promoReadyDesc: "Try the length conversion practice exercises to make sure you have mastered every conversion!",
    promoReadyBtn: "Go to Exercises",
    // Section 1
    sec1Title: "Detailed Theory and Unit Relationships",
    cardMultipleTitle: "Multiple (Kilometre)",
    cardMultipleDesc: "To measure large distances we use the",
    cardMultipleBold: "Kilometre (km):",
    cardBaseTitle: "Base Unit (Metre)",
    cardBaseDesc: "The base unit of length measurement is the",
    cardBaseBold: "Metre (m):",
    cardSubTitle: "Submultiples of the Metre",
    chartTitle: "How do we convert between units of length?",
    ruleLargerToSmallerTitle: "⬇️ From Larger to Smaller unit:",
    ruleLargerToSmallerAction: "Multiply",
    ruleLargerToSmallerMults: "(· 10, · 100, · 1,000).",
    ruleLargerToSmallerExample: "E.g. metres to centimetres: 3 m ＝ 3 · 100 cm ＝ 300 cm.",
    ruleSmallerToLargerTitle: "⬆️ From Smaller to Larger unit:",
    ruleSmallerToLargerAction: "Divide",
    ruleSmallerToLargerDivs: "(: 10, : 100, : 1,000).",
    ruleSmallerToLargerExample: "E.g. centimetres to metres: 500 cm ＝ 500 : 100 m ＝ 5 m.",
    // Section 2
    sec2Title: "Interactive Length Unit Converter",
    sec2Desc: "Type a value, select a base unit, and instantly view the conversion across all units!",
    randomBtn: "Random Value",
    inputValLabel: "LENGTH VALUE",
    baseUnitLabel: "INITIAL MEASUREMENT UNIT",
    btnDecrease: "Decrease",
    btnIncrease: "Increase",
    // Bottom Promo
    bottomPromoTitle: "Time to Practice!",
    bottomPromoDesc: "Mastered units of length and conversions? Try the interactive practice exercises!",
    bottomPromoBtn: "Start Exercises ➔",
  },
};

export default function MikosTheoryPage() {
  const router = useRouter();
  const rawLocale = router.locale || router.query.locale;
  const currentLocale = rawLocale === 'en' ? 'en' : 'el';
  const t = translations[currentLocale];

  const [valInput, setValInput] = useState(currentLocale === 'en' ? '2.5' : '2,5');
  const [baseUnit, setBaseUnit] = useState('m');

  const numericVal = parseFloat(valInput.replace(',', '.')) || 0;
  const valInMeters = numericVal * UNITS[baseUnit].factor;

  const handleRandomize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const unitsKeys = Object.keys(UNITS);
    const randomUnit = unitsKeys[Math.floor(Math.random() * unitsKeys.length)];
    const randomValNum = parseFloat((Math.random() * 45 + 1).toFixed(1));
    setBaseUnit(randomUnit);
    setValInput(
      formatNumberLocale(randomValNum, currentLocale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
    );
  };

  const handleDelta = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    const current = parseFloat(valInput.replace(',', '.')) || 0;
    const nextVal = Math.max(0.1, current + delta);
    setValInput(
      formatNumberLocale(parseFloat(nextVal.toFixed(1)), currentLocale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
    );
  };

  const formatUnitValue = (val) => {
    if (Number.isInteger(val)) {
      return formatNumberLocale(val, currentLocale);
    }
    const rounded = parseFloat(val.toFixed(3));
    return formatNumberLocale(rounded, currentLocale, {
      maximumFractionDigits: 3,
    });
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
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.badge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                📏 {t.heroTitle}
              </h1>
              <p className="text-cyan-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.promoReadyTitle}</h3>
              <p className="text-xs text-cyan-100">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Πολλαπλάσιο */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>🚗</span> {t.cardMultipleTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.cardMultipleDesc} <strong>{t.cardMultipleBold}</strong>
              </p>
              <div className="bg-white p-3 rounded-xl border border-indigo-100 text-xs sm:text-sm font-mono font-bold text-indigo-900 text-center shadow-sm">
                1 km ＝ {formatNumberLocale(1000, currentLocale)} m
              </div>
            </div>

            {/* 2. Βασική Μονάδα */}
            <div className="bg-cyan-50/70 p-5 sm:p-6 rounded-2xl border border-cyan-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-cyan-900 flex items-center gap-2">
                <span>📏</span> {t.cardBaseTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.cardBaseDesc} <strong>{t.cardBaseBold}</strong>
              </p>
              <div className="bg-white p-3 rounded-xl border border-cyan-100 text-[11px] sm:text-xs font-mono font-bold text-cyan-900 text-center shadow-sm">
                1 m ＝ 10 dm ＝ 100 cm ＝ {formatNumberLocale(1000, currentLocale)} mm
              </div>
            </div>

            {/* 3. Υποπολλαπλάσια */}
            <div className="bg-teal-50/70 p-5 sm:p-6 rounded-2xl border border-teal-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-teal-900 flex items-center gap-2">
                <span>🔍</span> {t.cardSubTitle}
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700 font-mono">
                <li className="flex items-center gap-1.5 flex-wrap">
                  <strong>1 dm:</strong>
                  <Fraction num="1" den="10" inline={true} />
                  <span>m ＝ {formatNumberLocale(0.1, currentLocale, { minimumFractionDigits: 1 })} m</span>
                </li>
                <li className="flex items-center gap-1.5 flex-wrap">
                  <strong>1 cm:</strong>
                  <Fraction num="1" den="100" inline={true} />
                  <span>m ＝ {formatNumberLocale(0.01, currentLocale, { minimumFractionDigits: 2 })} m</span>
                </li>
                <li className="flex items-center gap-1.5 flex-wrap">
                  <strong>1 mm:</strong>
                  <Fraction num="1" den={formatNumberLocale(1000, currentLocale)} inline={true} />
                  <span>m ＝ {formatNumberLocale(0.001, currentLocale, { minimumFractionDigits: 3 })} m</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ΣΚΑΛΑ ΜΕΤΑΤΡΟΠΩΝ - RESPONSIVE SVG */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 text-center sm:text-left">
              🪜 {t.chartTitle}
            </h3>

            <div className="bg-white p-3 sm:p-5 rounded-2xl border border-slate-200 shadow-inner">
              <svg
                viewBox="0 0 500 130"
                className="w-full h-auto max-w-2xl mx-auto block select-none font-sans"
              >
                {/* Επάνω Βέλη: Πολλαπλασιασμός */}
                <path d="M 65 35 Q 110 15 155 35" fill="none" stroke="#059669" strokeWidth="2" />
                <text x="110" y="20" fill="#059669" fontSize="10" fontWeight="900" textAnchor="middle">
                  · {formatNumberLocale(1000, currentLocale)}
                </text>

                <path d="M 175 35 Q 212 18 250 35" fill="none" stroke="#059669" strokeWidth="2" />
                <text x="212" y="22" fill="#059669" fontSize="10" fontWeight="900" textAnchor="middle">
                  · 10
                </text>

                <path d="M 270 35 Q 307 18 345 35" fill="none" stroke="#059669" strokeWidth="2" />
                <text x="307" y="22" fill="#059669" fontSize="10" fontWeight="900" textAnchor="middle">
                  · 10
                </text>

                <path d="M 365 35 Q 402 18 440 35" fill="none" stroke="#059669" strokeWidth="2" />
                <text x="402" y="22" fill="#059669" fontSize="10" fontWeight="900" textAnchor="middle">
                  · 10
                </text>

                {/* Μονάδες Badges (km, m, dm, cm, mm) */}
                {[
                  { x: 25, w: 70, label: 'km', desc: currentLocale === 'en' ? UNITS.km.shortEn : UNITS.km.shortEl, bg: '#e0e7ff', text: '#3730a3' },
                  { x: 135, w: 60, label: 'm', desc: currentLocale === 'en' ? UNITS.m.shortEn : UNITS.m.shortEl, bg: '#ccfbf1', text: '#115e59' },
                  { x: 235, w: 60, label: 'dm', desc: currentLocale === 'en' ? UNITS.dm.shortEn : UNITS.dm.shortEl, bg: '#fef3c7', text: '#92400e' },
                  { x: 330, w: 60, label: 'cm', desc: currentLocale === 'en' ? UNITS.cm.shortEn : UNITS.cm.shortEl, bg: '#fed7aa', text: '#9a3412' },
                  { x: 425, w: 60, label: 'mm', desc: currentLocale === 'en' ? UNITS.mm.shortEn : UNITS.mm.shortEl, bg: '#fee2e2', text: '#991b1b' },
                ].map((b) => (
                  <g key={b.label}>
                    <rect x={b.x} y="45" width={b.w} height="40" rx="8" fill={b.bg} stroke="#cbd5e1" strokeWidth="1" />
                    <text x={b.x + b.w / 2} y="64" fill={b.text} fontSize="14" fontWeight="900" textAnchor="middle">
                      {b.label}
                    </text>
                    <text x={b.x + b.w / 2} y="78" fill="#64748b" fontSize="8.5" fontWeight="700" textAnchor="middle">
                      {b.desc}
                    </text>
                  </g>
                ))}

                {/* Κάτω Βέλη: Διαίρεση */}
                <path d="M 440 95 Q 402 112 365 95" fill="none" stroke="#dc2626" strokeWidth="2" />
                <text x="402" y="118" fill="#dc2626" fontSize="10" fontWeight="900" textAnchor="middle">
                  : 10
                </text>

                <path d="M 345 95 Q 307 112 270 95" fill="none" stroke="#dc2626" strokeWidth="2" />
                <text x="307" y="118" fill="#dc2626" fontSize="10" fontWeight="900" textAnchor="middle">
                  : 10
                </text>

                <path d="M 250 95 Q 212 112 175 95" fill="none" stroke="#dc2626" strokeWidth="2" />
                <text x="212" y="118" fill="#dc2626" fontSize="10" fontWeight="900" textAnchor="middle">
                  : 10
                </text>

                <path d="M 155 95 Q 110 115 65 95" fill="none" stroke="#dc2626" strokeWidth="2" />
                <text x="110" y="122" fill="#dc2626" fontSize="10" fontWeight="900" textAnchor="middle">
                  : {formatNumberLocale(1000, currentLocale)}
                </text>
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-emerald-600 font-bold">{t.ruleLargerToSmallerTitle}</span>
                <p className="text-slate-600">
                  <strong>{t.ruleLargerToSmallerAction}</strong> {t.ruleLargerToSmallerMults}
                </p>
                <p className="font-mono text-xs text-slate-500">{t.ruleLargerToSmallerExample}</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-rose-600 font-bold">{t.ruleSmallerToLargerTitle}</span>
                <p className="text-slate-600">
                  <strong>{t.ruleSmallerToLargerAction}</strong> {t.ruleSmallerToLargerDivs}
                </p>
                <p className="font-mono text-xs text-slate-500">{t.ruleSmallerToLargerExample}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟΣ ΜΕΤΑΤΡΟΠΕΑΣ - SECTION 2 */}
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

            <button
              type="button"
              onClick={handleRandomize}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center gap-1.5 self-start sm:self-auto active:scale-95 touch-manipulation"
            >
              <span>🎲</span> {t.randomBtn}
            </button>
          </div>

          {/* INPUTS / CONTROLS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
            {/* Input Τιμής με Steppers */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">{t.inputValLabel}</span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-cyan-600 text-base">
                  {valInput} {UNITS[baseUnit].symbol}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => handleDelta(e, -1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-cyan-50 hover:bg-cyan-100 active:bg-cyan-200 text-cyan-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="-1"
                  aria-label={t.btnDecrease}
                >
                  －
                </button>

                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  maxLength={10}
                  id="length-input-val"
                  name="length-input-val"
                  value={valInput}
                  onChange={(e) =>
                    setValInput(e.target.value.replace(/\./g, ',').replace(/[^0-9,]/g, '').slice(0, 10))
                  }
                  className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="2,5"
                />

                <button
                  type="button"
                  onClick={(e) => handleDelta(e, 1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-cyan-50 hover:bg-cyan-100 active:bg-cyan-200 text-cyan-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="+1"
                  aria-label={t.btnIncrease}
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Επιλογή Αρχικής Μονάδας */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-center text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">{t.baseUnitLabel}</span>
              </div>

              <div className="h-11 flex items-center">
                <select
                  value={baseUnit}
                  onChange={(e) => setBaseUnit(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 font-bold text-sm text-slate-800 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none cursor-pointer"
                >
                  {Object.keys(UNITS).map((uKey) => (
                    <option key={uKey} value={uKey}>
                      {currentLocale === 'en' ? UNITS[uKey].nameEn : UNITS[uKey].nameEl} ({UNITS[uKey].symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ΠΙΝΑΚΑΣ ΑΥΤΟΜΑΤΩΝ ΜΕΤΑΤΡΟΠΩΝ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {Object.keys(UNITS).map((uKey) => {
              const isSelected = uKey === baseUnit;
              const convertedValue = valInMeters / UNITS[uKey].factor;

              return (
                <div
                  key={uKey}
                  className={`p-4 sm:p-5 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-cyan-600 text-white border-cyan-700 shadow-lg scale-105'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-[10px] font-black tracking-wider block ${isSelected ? 'text-cyan-200' : 'text-slate-400'}`}>
                    {currentLocale === 'en' ? UNITS[uKey].nameEn : UNITS[uKey].nameEl}
                  </span>

                  <div className="text-xl sm:text-2xl font-mono font-black my-2 break-words">
                    {formatUnitValue(convertedValue)} <span className="text-sm font-bold">{UNITS[uKey].symbol}</span>
                  </div>

                  <p className={`text-[11px] leading-tight ${isSelected ? 'text-cyan-100' : 'text-slate-500'}`}>
                    {currentLocale === 'en' ? UNITS[uKey].descEn : UNITS[uKey].descEl}
                  </p>
                </div>
              );
            })}
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
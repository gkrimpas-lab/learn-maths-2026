// pages/d-dimotikou/9-baros.js
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

// Συγκεντρωτικό λεξικό μεταφράσεων i18n
const TRANSLATIONS = {
  el: {
    metaTitle: "Μέτρηση Βάρους και Μετατροπές - Θεωρία | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε το κιλό (kg), το γραμμάριο (g), τον τόνο (t), τον κανόνα του 1.000 και πώς κάνουμε μετατροπές μεταξύ των μονάδων μέτρησης βάρους.",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "⚖️ Μέτρηση Βάρους και Μετατροπές",
    heroDesc: "Μαθαίνουμε το κιλό (kg), το γραμμάριο (g), τον τόνο (t) και πώς μετατρέπουμε εύκολα τη μία μονάδα στην άλλη με τον κανόνα του 1.000!",
    readyPracticeTitle: "Έτοιμος για εξάσκηση;",
    readyPracticeDesc: "Δοκίμασε τις ασκήσεις στις μετατροπές βάρους για να σιγουρευτείς ότι τις κατανόησες πλήρως!",
    goToExercises: "🎯 Μετάβαση στις Ασκήσεις",
    theorySectionTitle: "Αναλυτική Θεωρία και Σχέσεις Μονάδων Βάρους",
    multipleTitle: "Πολλαπλάσιο (Τόνος)",
    multipleDesc: "Για να μετρήσουμε πολύ μεγάλα βάρη (φορτηγά, ελέφαντες) χρησιμοποιούμε τον",
    tonName: "Τόνο (t)",
    baseUnitTitle: "Βασική Μονάδα (Κιλό)",
    baseUnitDesc: "Η βασική μονάδα μέτρησης βάρους στην καθημερινή ζωή είναι το",
    kgName: "Κιλό ή Χιλιόγραμμο (kg)",
    submultipleTitle: "Υποπολλαπλάσιο (Γραμμάριο)",
    submultipleDesc: "Για μικρά βάρη (τρόφιμα, μπαχαρικά, χρυσό) χρησιμοποιούμε το",
    gName: "Γραμμάριο (g)",
    howToConvertTitle: "Πώς κάνουμε μετατροπές στο Βάρος; (Ο κανόνας του 1.000)",
    stepMulRule: "Από Μεγαλύτερη σε Μικρότερη μονάδα:",
    stepMulDesc: "Πολλαπλασιάζουμε με το 1.000",
    stepMulEg: "Π.χ. Κιλά σε Γραμμάρια: 2 kg ＝ 2 · 1.000 g ＝ 2.000 g.",
    stepDivRule: "Από Μικρότερη σε Μεγαλύτερη μονάδα:",
    stepDivDesc: "Διαιρούμε με το 1.000",
    stepDivEg: "Π.χ. Γραμμάρια σε Κιλά: 5.000 g ＝ 5.000 : 1.000 kg ＝ 5 kg.",
    interactiveTitle: "Διαδραστικός Μετατροπέας Μονάδων Βάρους",
    interactiveDesc: "Πληκτρολόγησε μια τιμή, επίλεξε μονάδα και δες άμεσα τη μετατροπή στις άλλες δύο μονάδες!",
    randomValueBtn: "Τυχαία Τιμή",
    inputValLabel: "ΤΙΜΗ ΒΑΡΟΥΣ",
    initialUnitLabel: "ΑΡΧΙΚΗ ΜΟΝΑΔΑ ΜΕΤΡΗΣΗΣ",
    inputPlaceholder: "π.χ. 3,5",
    decreaseAria: "Μείωση τιμής",
    increaseAria: "Αύξηση τιμής",
    bottomBannerTitle: "Ώρα για Εξάσκηση!",
    bottomBannerDesc: "Έμαθες τις μονάδες βάρους και τις μετατροπές; Δοκίμασε τις διαδραστικές ασκήσεις!",
    bottomBannerBtn: "Ξεκίνα τις Ασκήσεις ➔",
    units: {
      t: { name: 'Τόνος', symbol: 't', factor: 1000, desc: 'Πολύ μεγάλο βάρος (ελέφαντας, φορτηγό)' },
      kg: { name: 'Κιλό (Χιλιόγραμμο)', symbol: 'kg', factor: 1, desc: 'Βασική μονάδα (βάρος σώματος, φρούτα)' },
      g: { name: 'Γραμμάριο', symbol: 'g', factor: 0.001, desc: 'Μικρό βάρος (σοκολάτα, χρυσός, μπαχαρικά)' }
    }
  },
  en: {
    metaTitle: "Weight Measurement and Conversions - Theory | LearnMaths.gr",
    metaDesc: "Learn about the kilogram (kg), gram (g), metric ton (t), the rule of 1,000, and how to convert between weight units.",
    backText: "Grade 4",
    exercisesBtn: "Exercises",
    gradeBadge: "GRADE 4",
    heroTitle: "⚖️ Weight Measurement and Conversions",
    heroDesc: "Learn about kilograms (kg), grams (g), metric tons (t), and how to easily convert between units using the rule of 1,000!",
    readyPracticeTitle: "Ready for practice?",
    readyPracticeDesc: "Try the weight conversion exercises to make sure you have mastered the concept!",
    goToExercises: "🎯 Go to Exercises",
    theorySectionTitle: "Detailed Theory and Weight Unit Relations",
    multipleTitle: "Multiple (Metric Ton)",
    multipleDesc: "To measure very large weights (trucks, elephants) we use the",
    tonName: "Metric Ton (t)",
    baseUnitTitle: "Base Unit (Kilogram)",
    baseUnitDesc: "The base unit of weight in daily life is the",
    kgName: "Kilogram (kg)",
    submultipleTitle: "Submultiple (Gram)",
    submultipleDesc: "For small weights (food, spices, gold) we use the",
    gName: "Gram (g)",
    howToConvertTitle: "How do we convert weight units? (The rule of 1,000)",
    stepMulRule: "From Larger to Smaller unit:",
    stepMulDesc: "Multiply by 1,000",
    stepMulEg: "E.g. Kilograms to Grams: 2 kg ＝ 2 · 1,000 g ＝ 2,000 g.",
    stepDivRule: "From Smaller to Larger unit:",
    stepDivDesc: "Divide by 1,000",
    stepDivEg: "E.g. Grams to Kilograms: 5,000 g ＝ 5,000 : 1,000 kg ＝ 5 kg.",
    interactiveTitle: "Interactive Weight Unit Converter",
    interactiveDesc: "Enter a value, choose a unit, and instantly see the conversion across all three units!",
    randomValueBtn: "Random Value",
    inputValLabel: "WEIGHT VALUE",
    initialUnitLabel: "INITIAL MEASUREMENT UNIT",
    inputPlaceholder: "e.g. 3.5",
    decreaseAria: "Decrease value",
    increaseAria: "Increase value",
    bottomBannerTitle: "Time for Practice!",
    bottomBannerDesc: "Did you master weight units and conversions? Try the interactive exercises!",
    bottomBannerBtn: "Start Exercises ➔",
    units: {
      t: { name: 'Metric Ton', symbol: 't', factor: 1000, desc: 'Very large weight (elephant, truck)' },
      kg: { name: 'Kilogram', symbol: 'kg', factor: 1, desc: 'Base unit (body weight, fruits)' },
      g: { name: 'Gram', symbol: 'g', factor: 0.001, desc: 'Small weight (chocolate, gold, spices)' }
    }
  }
};

export default function BarosTheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];
  const isEn = locale === 'en';

  const [valInput, setValInput] = useState(isEn ? '3.5' : '3,5');
  const [baseUnit, setBaseUnit] = useState('kg');

  // Μορφοποίηση αριθμών σύμφωνα με το locale
  const formatNum = (num) => {
    if (Number.isInteger(num)) {
      return num.toLocaleString(isEn ? 'en-US' : 'el-GR');
    }
    const fixedStr = Number(num.toFixed(3)).toString();
    if (isEn) {
      const parts = fixedStr.split('.');
      parts[0] = parseInt(parts[0], 10).toLocaleString('en-US');
      return parts.join('.');
    }
    const parts = fixedStr.split('.');
    parts[0] = parseInt(parts[0], 10).toLocaleString('el-GR');
    return parts.join(',');
  };

  const parsedVal = isEn
    ? parseFloat(valInput.replace(/,/g, '')) || 0
    : parseFloat(valInput.replace(/\./g, '').replace(',', '.')) || 0;

  // Μετατροπή της τιμής εισαγωγής σε κιλά (kg)
  const valInKg = parsedVal * t.units[baseUnit].factor;

  const handleRandomize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const unitsKeys = Object.keys(t.units);
    const randomUnit = unitsKeys[Math.floor(Math.random() * unitsKeys.length)];
    const randomVal = (Math.random() * 45 + 1).toFixed(1);
    setBaseUnit(randomUnit);
    setValInput(isEn ? randomVal : randomVal.replace('.', ','));
  };

  const handleDelta = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    const current = isEn
      ? parseFloat(valInput.replace(/,/g, '')) || 0
      : parseFloat(valInput.replace(/\./g, '').replace(',', '.')) || 0;
    const nextVal = Math.max(0.1, current + delta);
    const formatted = Number(nextVal.toFixed(1)).toString();
    setValInput(isEn ? formatted : formatted.replace('.', ','));
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    if (isEn) {
      // Μόνο ψηφία και τελεία για τα αγγλικά
      const sanitized = raw.replace(/[^0-9.]/g, '');
      setValInput(sanitized);
    } else {
      // Μόνο ψηφία και κόμμα για τα ελληνικά
      const sanitized = raw.replace(/\./g, ',').replace(/[^0-9,]/g, '');
      setValInput(sanitized);
    }
  };

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/9-baros-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.gradeBadge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.readyPracticeTitle}</h3>
              <p className="text-xs text-emerald-100">
                {t.readyPracticeDesc}
              </p>
              <Link
                href="/d-dimotikou/9-baros-ask"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Πολλαπλάσιο */}
            <div className="bg-sky-50/70 p-5 sm:p-6 rounded-2xl border border-sky-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-sky-900 flex items-center gap-2">
                <span>🐘</span> {t.multipleTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.multipleDesc} <strong>{t.tonName}</strong>:
              </p>
              <div className="bg-white p-3 rounded-xl border border-sky-100 text-xs sm:text-sm font-mono font-bold text-sky-900 text-center shadow-sm">
                1 t ＝ {isEn ? '1,000' : '1.000'} kg
              </div>
            </div>

            {/* 2. Βασική Μονάδα */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>⚖️</span> {t.baseUnitTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.baseUnitDesc} <strong>{t.kgName}</strong>:
              </p>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs sm:text-sm font-mono font-bold text-emerald-900 text-center shadow-sm">
                1 kg ＝ {isEn ? '1,000' : '1.000'} g
              </div>
            </div>

            {/* 3. Υποπολλαπλάσιο */}
            <div className="bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-amber-900 flex items-center gap-2">
                <span>🍫</span> {t.submultipleTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.submultipleDesc} <strong>{t.gName}</strong>:
              </p>
              <div className="bg-white p-3 rounded-xl border border-amber-100 text-xs sm:text-sm font-mono font-bold text-amber-900 text-center shadow-sm flex items-center justify-center gap-1">
                <span>1 g ＝</span>
                <Fraction num="1" den={isEn ? "1,000" : "1.000"} />
                <span>kg ＝ {isEn ? '0.001' : '0,001'} kg</span>
              </div>
            </div>
          </div>

          {/* ΣΚΑΛΑ ΜΕΤΑΤΡΟΠΩΝ - RESPONSIVE SVG */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 text-center sm:text-left">
              🪜 {t.howToConvertTitle}
            </h3>

            <div className="bg-white p-3 sm:p-5 rounded-2xl border border-slate-200 shadow-inner">
              <svg
                viewBox="0 0 500 130"
                className="w-full h-auto max-w-xl mx-auto block select-none font-sans"
              >
                {/* Επάνω Βέλη: Πολλαπλασιασμός */}
                <path d="M 125 35 Q 185 12 245 35" fill="none" stroke="#059669" strokeWidth="2.5" />
                <text x="185" y="20" fill="#059669" fontSize="12" fontWeight="900" textAnchor="middle">
                  · {isEn ? '1,000' : '1.000'}
                </text>

                <path d="M 285 35 Q 345 12 405 35" fill="none" stroke="#059669" strokeWidth="2.5" />
                <text x="345" y="20" fill="#059669" fontSize="12" fontWeight="900" textAnchor="middle">
                  · {isEn ? '1,000' : '1.000'}
                </text>

                {/* Μονάδες Badges (t, kg, g) */}
                {[
                  { x: 50, w: 90, label: 't', desc: t.units.t.name, bg: '#e0f2fe', text: '#0369a1' },
                  { x: 205, w: 90, label: 'kg', desc: t.units.kg.name, bg: '#dcfce7', text: '#15803d' },
                  { x: 360, w: 90, label: 'g', desc: t.units.g.name, bg: '#fef3c7', text: '#b45309' },
                ].map((b) => (
                  <g key={b.label}>
                    <rect x={b.x} y="45" width={b.w} height="42" rx="10" fill={b.bg} stroke="#cbd5e1" strokeWidth="1" />
                    <text x={b.x + b.w / 2} y="66" fill={b.text} fontSize="16" fontWeight="900" textAnchor="middle">
                      {b.label}
                    </text>
                    <text x={b.x + b.w / 2} y="80" fill="#64748b" fontSize="9.5" fontWeight="700" textAnchor="middle">
                      {b.desc}
                    </text>
                  </g>
                ))}

                {/* Κάτω Βέλη: Διαίρεση */}
                <path d="M 405 95 Q 345 118 285 95" fill="none" stroke="#dc2626" strokeWidth="2.5" />
                <text x="345" y="122" fill="#dc2626" fontSize="12" fontWeight="900" textAnchor="middle">
                  : {isEn ? '1,000' : '1.000'}
                </text>

                <path d="M 245 95 Q 185 118 125 95" fill="none" stroke="#dc2626" strokeWidth="2.5" />
                <text x="185" y="122" fill="#dc2626" fontSize="12" fontWeight="900" textAnchor="middle">
                  : {isEn ? '1,000' : '1.000'}
                </text>
              </svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-emerald-600 font-bold">⬇️ {t.stepMulRule}</span>
                <p className="text-slate-600">
                  <strong>{t.stepMulDesc}</strong> (· {isEn ? '1,000' : '1.000'}).
                </p>
                <p className="font-mono text-xs text-slate-500">{t.stepMulEg}</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-sky-600 font-bold">⬆️ {t.stepDivRule}</span>
                <p className="text-slate-600">
                  <strong>{t.stepDivDesc}</strong> (: {isEn ? '1,000' : '1.000'}).
                </p>
                <p className="font-mono text-xs text-slate-500">{t.stepDivEg}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟΣ ΜΕΤΑΤΡΟΠΕΑΣ - SECTION 2 */}
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center gap-1.5 self-start sm:self-auto active:scale-95 touch-manipulation"
            >
              <span>🎲</span> {t.randomValueBtn}
            </button>
          </div>

          {/* INPUTS / CONTROLS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
            {/* Input Τιμής με Steppers */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">
                  {toCleanUppercase(t.inputValLabel)}
                </span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-emerald-600 text-base">
                  {valInput} {t.units[baseUnit].symbol}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  onClick={(e) => handleDelta(e, -1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title={t.decreaseAria}
                  aria-label={t.decreaseAria}
                >
                  －
                </button>

                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  id="weight-input-val"
                  name="weight-input-val"
                  value={valInput}
                  onChange={handleInputChange}
                  className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder={t.inputPlaceholder}
                />

                <button
                  onClick={(e) => handleDelta(e, 1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title={t.increaseAria}
                  aria-label={t.increaseAria}
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Επιλογή Αρχικής Μονάδας */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-center text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">
                  {toCleanUppercase(t.initialUnitLabel)}
                </span>
              </div>

              <div className="h-11 flex items-center">
                <select
                  value={baseUnit}
                  onChange={(e) => setBaseUnit(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 font-bold text-sm text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  {Object.keys(t.units).map((uKey) => (
                    <option key={uKey} value={uKey}>
                      {t.units[uKey].name} ({t.units[uKey].symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ΠΙΝΑΚΑΣ ΑΥΤΟΜΑΤΩΝ ΜΕΤΑΤΡΟΠΩΝ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.keys(t.units).map((uKey) => {
              const isSelected = uKey === baseUnit;
              const convertedValue = valInKg / t.units[uKey].factor;

              return (
                <div
                  key={uKey}
                  className={`p-5 sm:p-6 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-lg scale-105'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-[10px] font-black tracking-wider block ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {t.units[uKey].name}
                  </span>

                  <div className="text-2xl sm:text-3xl font-mono font-black my-2.5 break-words">
                    {formatNum(convertedValue)} <span className="text-base font-bold">{t.units[uKey].symbol}</span>
                  </div>

                  <p className={`text-xs leading-tight ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {t.units[uKey].desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 {t.bottomBannerTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">
              {t.bottomBannerDesc}
            </p>
          </div>
          <Link
            href="/d-dimotikou/9-baros-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.bottomBannerBtn}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
// pages/d-dimotikou/29-posotita-igrou.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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

// Επαναχρησιμοποιήσιμο component για κανονική κατακόρυφη εμφάνιση κλάσματος
function Fraction({ num, den }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-bold leading-none select-none text-[0.95em]">
      <span className="px-1 border-b border-current pb-[1px]">{num}</span>
      <span className="px-1 pt-[1px]">{den}</span>
    </span>
  );
}

const TRANSLATIONS = {
  el: {
    pageTitle: "Μέτρηση Ποσότητας Υγρού (Χωρητικότητα) - Θεωρία | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε πώς μετράμε τα υγρά σε λίτρα (L) και χιλιοστόλιτρα (mL), πώς κάνουμε μετατροπές και πώς υπολογίζουμε το μισό και το τέταρτο του λίτρου με διαδραστικό ογκομετρικό δοχείο.",
    backText: "Δ' Δημοτικού",
    badgeGrade: "Δ' ΔΗΜΟΤΙΚΟΥ",
    exercisesBtn: "Ασκήσεις",
    heroTitle: "Μέτρηση Ποσότητας Υγρού (Χωρητικότητα)",
    heroDesc: "Μαθαίνουμε πώς μετράμε τα υγρά σε λίτρα (L) και χιλιοστόλιτρα (mL), πώς κάνουμε εύκολα μετατροπές και πώς υπολογίζουμε το μισό ή το ένα τέταρτο του λίτρου!",
    heroCardTitle: "Έτοιμος για εξάσκηση;",
    heroCardDesc: "Δοκίμασε τις διαδραστικές ασκήσεις στη μέτρηση υγρών και τις μετατροπές L και mL!",
    heroCardBtn: "Μετάβαση στις Ασκήσεις",
    section1Title: "Μονάδες Μέτρησης και Βασικές Ισότητες",
    card1Badge: "ΒΑΣΙΚΕΣ ΜΟΝΑΔΕΣ",
    card1Title: "Λίτρο (L) και Χιλιοστόλιτρο (mL)",
    card1Text: "Η βασική μονάδα μέτρησης της χωρητικότητας είναι το λίτρο (L). Για μικρότερες ποσότητες (π.χ. αναψυκτικά, φάρμακα) χρησιμοποιούμε το χιλιοστόλιτρο (mL).",
    card2Badge: "ΚΛΑΣΜΑΤΑ ΛΙΤΡΟΥ",
    card2Title: "Μισό και Τέταρτο του Λίτρου",
    halfLiterLabel: "Μισό λίτρο",
    quarterLiterLabel: "Ένα τέταρτο του λίτρου",
    threeQuartersLabel: "Τρία τέταρτα του λίτρου",
    oneAndHalfLabel: "Ενάμισι λίτρο",
    card3Badge: "ΠΩΣ ΚΑΝΟΥΜΕ ΜΕΤΑΤΡΟΠΕΣ",
    card3Title: "Μετατροπές L και mL",
    ruleLtoML: "Από L σε mL: Πολλαπλασιάζουμε με 1.000 (π.χ. 3 L · 1.000 ＝ 3.000 mL).",
    ruleMLtoL: "Από mL σε L: Διαιρούμε με 1.000 (π.χ. 4.000 mL ： 1.000 ＝ 4 L).",
    labTitle: "Διαδραστικό Ογκομετρικό Δοχείο & Μετατροπέας",
    labSubtitle: "Άλλαξε την ποσότητα υγρού για να παρατηρήσεις τη στάθμη στο δοχείο και την αυτόματη μετατροπή σε L και mL!",
    presetCan: "🥤 330 mL (Κουτάκι)",
    presetHalf: "💧 500 mL (1/2 L)",
    presetOne: "🧃 1.000 mL (1 L)",
    presetOneHalf: "🍶 1.500 mL (1,5 L)",
    svgHeader: "ΟΓΚΟΜΕΤΡΙΚΟ ΔΟΧΕΙΟ (0 - 2.000 mL)",
    autoConvertTitle: "ΑΥΤΟΜΑΤΗ ΜΕΤΑΤΡΟΠΗ",
    sliderLabel: "ΠΟΣΟΤΗΤΑ (0 - 2.000 mL)",
    decreaseBtn: "Μείωση ποσότητας",
    increaseBtn: "Αύξηση ποσότητας",
    howToReadTitle: "Πώς το διαβάζουμε:",
    inMilliliters: "Σε Χιλιοστόλιτρα:",
    inLiters: "Σε Λίτρα:",
    sinceFormula: (mlStr, lStr) => `(αφού ${mlStr} ： 1.000 ＝ ${lStr})`,
    specialName: "Ειδική ονομασία:",
    specialHalf: "Μισό λίτρο",
    specialQuarter: "Ένα τέταρτο του λίτρου",
    specialThreeQuarters: "Τρία τέταρτα του λίτρου",
    specialOne: "1 ακέραιο λίτρο (1 L)",
    specialOneHalf: "Ενάμισι λίτρο",
    ctaTitle: "Ώρα για Εξάσκηση!",
    ctaDesc: "Έμαθες να μετράς τα υγρά και να μετατρέπεις τα λίτρα σε χιλιοστόλιτρα; Δοκίμασε τις διαδραστικές ασκήσεις!",
    ctaBtn: "Ξεκίνα τις Ασκήσεις",
    footerGrade: "Μαθηματικά Δ' Δημοτικού",
    footerChapter: "Κεφάλαιο 29: Μέτρηση Ποσότητας Υγρού (Χωρητικότητα)",
    footerAction: "Μετάβαση στις Ασκήσεις"
  },
  en: {
    pageTitle: "Liquid Capacity & Volume - Theory | LearnMaths.gr",
    pageDesc: "Learn how to measure liquids in liters (L) and milliliters (mL), perform unit conversions, and calculate half and quarter liters with an interactive measuring beaker.",
    backText: "4th Grade",
    badgeGrade: "GRADE 4",
    exercisesBtn: "Exercises",
    heroTitle: "Measuring Liquid Volume (Capacity)",
    heroDesc: "Learn how we measure liquids in liters (L) and milliliters (mL), how to easily convert between units, and calculate half or a quarter of a liter!",
    heroCardTitle: "Ready to practice?",
    heroCardDesc: "Test your skills with interactive exercises on measuring liquids and converting between L and mL!",
    heroCardBtn: "Go to Exercises",
    section1Title: "Measurement Units & Core Equalities",
    card1Badge: "BASE UNITS",
    card1Title: "Liter (L) and Milliliter (mL)",
    card1Text: "The standard unit for measuring capacity is the liter (L). For smaller quantities (e.g. sodas, medicine) we use the milliliter (mL).",
    card2Badge: "FRACTIONS OF A LITER",
    card2Title: "Half and Quarter Liter",
    halfLiterLabel: "Half liter",
    quarterLiterLabel: "One quarter of a liter",
    threeQuartersLabel: "Three quarters of a liter",
    oneAndHalfLabel: "One and a half liters",
    card3Badge: "HOW TO CONVERT",
    card3Title: "Conversions between L and mL",
    ruleLtoML: "From L to mL: Multiply by 1,000 (e.g. 3 L · 1,000 ＝ 3,000 mL).",
    ruleMLtoL: "From mL to L: Divide by 1,000 (e.g. 4,000 mL ： 1,000 ＝ 4 L).",
    labTitle: "Interactive Measuring Beaker & Converter",
    labSubtitle: "Adjust the liquid volume to observe the level in the beaker and see the instant conversion between L and mL!",
    presetCan: "🥤 330 mL (Can)",
    presetHalf: "💧 500 mL (1/2 L)",
    presetOne: "🧃 1,000 mL (1 L)",
    presetOneHalf: "🍶 1,500 mL (1.5 L)",
    svgHeader: "MEASURING BEAKER (0 - 2,000 mL)",
    autoConvertTitle: "AUTOMATIC CONVERSION",
    sliderLabel: "VOLUME (0 - 2,000 mL)",
    decreaseBtn: "Decrease volume",
    increaseBtn: "Increase volume",
    howToReadTitle: "How to read it:",
    inMilliliters: "In Milliliters:",
    inLiters: "In Liters:",
    sinceFormula: (mlStr, lStr) => `(since ${mlStr} ： 1,000 ＝ ${lStr})`,
    specialName: "Special designation:",
    specialHalf: "Half liter",
    specialQuarter: "One quarter of a liter",
    specialThreeQuarters: "Three quarters of a liter",
    specialOne: "1 full liter (1 L)",
    specialOneHalf: "One and a half liters",
    ctaTitle: "Time for Practice!",
    ctaDesc: "Mastered measuring liquids and converting liters to milliliters? Test your skills with interactive exercises!",
    ctaBtn: "Start Exercises",
    footerGrade: "Grade 4 Mathematics",
    footerChapter: "Chapter 29: Measuring Liquid Volume (Capacity)",
    footerAction: "Go to Exercises"
  }
};

export default function PosotitaIgrouTheoryPage() {
  const router = useRouter();
  const rawLocale = router?.locale || 'el';
  const locale = TRANSLATIONS[rawLocale] ? rawLocale : 'el';
  const t = TRANSLATIONS[locale];

  const [milliliters, setMilliliters] = useState(500); // 0 - 2000 mL

  const mL = typeof milliliters === 'number' && milliliters >= 0 ? milliliters : 0;
  const litersNum = mL / 1000;

  const formatNumber = (num) => {
    if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
  };

  const formatLiters = (num) => {
    if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3
    });
  };

  const formattedML = formatNumber(mL);
  const formattedLiters = formatLiters(litersNum);

  // Ύψος στάθμης υγρού στο SVG δοχείο (Max 2000 mL -> διαδρομή 128px μέχρι το y = 158)
  const maxCapacity = 2000;
  const fillHeight = Math.min(128, (mL / maxCapacity) * 128);
  const liquidY = 158 - fillHeight;

  const setPreset = (e, amount) => {
    e.preventDefault();
    e.stopPropagation();
    setMilliliters(amount);
  };

  const updateMilliliters = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setMilliliters((prev) => Math.max(0, Math.min(2000, (Number(prev) || 0) + delta)));
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/29-posotita-igrou-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.badgeGrade)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                🥛 {t.heroTitle}
              </h1>
              <p className="text-cyan-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h2 className="font-extrabold text-white text-lg">{t.heroCardTitle}</h2>
              <p className="text-xs text-cyan-100">
                {t.heroCardDesc}
              </p>
              <Link
                href="/d-dimotikou/29-posotita-igrou-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 {t.heroCardBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - SECTION 1 */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> {t.section1Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Το Λίτρο και το Χιλιοστόλιτρο */}
            <div className="bg-cyan-50/70 p-5 sm:p-6 rounded-2xl border border-cyan-100 space-y-3 shadow-sm">
              <div className="bg-cyan-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.card1Badge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-cyan-950">
                {t.card1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.card1Text}
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-cyan-200 text-center font-mono font-black text-cyan-900 text-sm shadow-sm">
                1 L ＝ {formatNumber(1000)} mL
              </div>
            </div>

            {/* 2. Κλασματικά Μέρη του Λίτρου */}
            <div className="bg-teal-50/70 p-5 sm:p-6 rounded-2xl border border-teal-100 space-y-3 shadow-sm">
              <div className="bg-teal-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.card2Badge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-teal-950">
                {t.card2Title}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-center flex-wrap gap-1">
                  <strong>{t.halfLiterLabel} (<Fraction num="1" den="2" /> L)</strong> ＝ {formatNumber(500)} mL
                </li>
                <li className="flex items-center flex-wrap gap-1">
                  <strong>{t.quarterLiterLabel} (<Fraction num="1" den="4" /> L)</strong> ＝ {formatNumber(250)} mL
                </li>
                <li className="flex items-center flex-wrap gap-1">
                  <strong>{t.threeQuartersLabel} (<Fraction num="3" den="4" /> L)</strong> ＝ {formatNumber(750)} mL
                </li>
                <li className="flex items-center flex-wrap gap-1">
                  <strong>{t.oneAndHalfLabel} ({formatLiters(1.5)} L)</strong> ＝ {formatNumber(1500)} mL
                </li>
              </ul>
            </div>

            {/* 3. Κανόνες Μετατροπής */}
            <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100 space-y-3 shadow-sm">
              <div className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.card3Badge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-blue-950">
                {t.card3Title}
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <p className="bg-white p-2.5 rounded-xl border border-blue-200 shadow-sm leading-relaxed">
                  🔹 <strong>{t.ruleLtoML}</strong>
                </p>
                <p className="bg-white p-2.5 rounded-xl border border-blue-200 shadow-sm leading-relaxed">
                  🔸 <strong>{t.ruleMLtoL}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - ΟΓΚΟΜΕΤΡΙΚΟ ΔΟΧΕΙΟ */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> {t.labTitle}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                {t.labSubtitle}
              </p>
            </div>

            {/* ΠΡΟΕΠΙΛΟΓΕΣ ΠΟΣΟΤΗΤΩΝ */}
            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
              <button
                onClick={(e) => setPreset(e, 330)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                {t.presetCan}
              </button>
              <button
                onClick={(e) => setPreset(e, 500)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                {t.presetHalf}
              </button>
              <button
                onClick={(e) => setPreset(e, 1000)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                {t.presetOne}
              </button>
              <button
                onClick={(e) => setPreset(e, 1500)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 transition active:scale-95 touch-manipulation"
              >
                {t.presetOneHalf}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* ΑΡΙΣΤΕΡΑ: SVG ΟΓΚΟΜΕΤΡΙΚΟ ΔΟΧΕΙΟ */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400">
                {toCleanUppercase(t.svgHeader)}
              </span>

              <div className="w-52 h-52 flex items-center justify-center">
                <svg className="w-full h-full block select-none" viewBox="0 0 160 180">
                  {/* Υγρό μέσα στο δοχείο */}
                  {mL > 0 && (
                    <rect
                      x="42"
                      y={liquidY}
                      width="76"
                      height={fillHeight}
                      fill="#06b6d4"
                      fillOpacity="0.8"
                      rx="4"
                    />
                  )}

                  {/* Σώμα Δοχείου (Περίγραμμα) */}
                  <path
                    d="M 40,25 L 40,150 A 10,10 0 0,0 50,160 L 110,160 A 10,10 0 0,0 120,150 L 120,25"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="4"
                  />
                  {/* Χείλος δοχείου */}
                  <path d="M 35,25 L 125,25" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                  {/* Στόμιο εκροής */}
                  <path d="M 35,25 L 25,20 L 40,35" fill="none" stroke="#38bdf8" strokeWidth="3" />

                  {/* Γραμμές διαβάθμισης (Ενδείξεις mL) */}
                  {/* 2000 mL (Top) */}
                  <line x1="105" y1="30" x2="118" y2="30" stroke="#f8fafc" strokeWidth="2" />
                  <text x="98" y="33" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">
                    {formatNumber(2000)}
                  </text>

                  {/* 1500 mL */}
                  <line x1="105" y1="62" x2="118" y2="62" stroke="#f8fafc" strokeWidth="2" />
                  <text x="98" y="65" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">
                    {formatNumber(1500)}
                  </text>

                  {/* 1000 mL (1 L) */}
                  <line x1="100" y1="94" x2="118" y2="94" stroke="#fbbf24" strokeWidth="2.5" />
                  <text x="95" y="97" textAnchor="end" fill="#fbbf24" fontSize="9" fontWeight="900">
                    1 L
                  </text>

                  {/* 500 mL (1/2 L) */}
                  <line x1="105" y1="126" x2="118" y2="126" stroke="#f8fafc" strokeWidth="2" />
                  <text x="98" y="129" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">
                    {formatNumber(500)}
                  </text>
                </svg>
              </div>

              <div className="text-center space-y-1">
                <p className="text-cyan-300 font-mono font-black text-2xl">
                  {formattedML} mL
                </p>
                <p className="text-slate-400 text-xs font-mono font-bold">
                  (＝ {formattedLiters} L)
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΑΥΤΟΜΑΤΟΣ ΜΕΤΑΤΡΟΠΕΑΣ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              {/* DISPLAY ΜΕΤΑΤΡΟΠΗΣ */}
              <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl text-center border-2 border-cyan-500/30 space-y-1 shadow-inner">
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
                  {toCleanUppercase(t.autoConvertTitle)}
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400 tracking-wider">
                  {formattedML} mL ＝ {formattedLiters} L
                </div>
              </div>

              {/* SLIDER & INPUT ΡΥΘΜΙΣΗΣ ΜΕ STEPPERS */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="h-8 flex items-center justify-between text-center px-1">
                  <span className="text-[11px] font-black uppercase text-slate-500">
                    {toCleanUppercase(t.sliderLabel)}
                  </span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-cyan-700 text-base">
                    {formattedML} mL
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    onClick={(e) => updateMilliliters(e, -50)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-cyan-50 hover:bg-cyan-100 active:bg-cyan-200 text-cyan-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                    title="-50 mL"
                    aria-label={t.decreaseBtn}
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={mL <= 2000 ? mL : 2000}
                    onChange={(e) => setMilliliters(Number(e.target.value))}
                    className="w-full min-w-0 max-w-full accent-cyan-600 cursor-pointer"
                  />

                  <button
                    onClick={(e) => updateMilliliters(e, 50)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-cyan-50 hover:bg-cyan-100 active:bg-cyan-200 text-cyan-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                    title="+50 mL"
                    aria-label={t.increaseBtn}
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά ποσοτήτων */}
                <div className="flex justify-center gap-1.5 pt-1">
                  <button
                    onClick={(e) => updateMilliliters(e, -250)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    -250 mL
                  </button>
                  <button
                    onClick={(e) => updateMilliliters(e, -100)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    -100 mL
                  </button>
                  <button
                    onClick={(e) => updateMilliliters(e, 100)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    +100 mL
                  </button>
                  <button
                    onClick={(e) => updateMilliliters(e, 250)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    +250 mL
                  </button>
                </div>
              </div>

              {/* ΑΥΤΟΜΑΤΕΣ ΑΝΑΛΥΣΕΙΣ */}
              <div className="bg-cyan-50/80 p-4 rounded-2xl border border-cyan-200 min-h-[110px] flex flex-col justify-between shadow-sm">
                <h4 className="text-xs font-black uppercase text-cyan-950 flex items-center gap-1.5 mb-1">
                  <span>💡</span> {t.howToReadTitle}
                </h4>
                <ul className="text-xs space-y-1 font-medium text-slate-800">
                  <li>
                    <strong>{t.inMilliliters}</strong> {formattedML} mL
                  </li>
                  <li>
                    <strong>{t.inLiters}</strong> {formattedLiters} L {t.sinceFormula(formattedML, formattedLiters)}
                  </li>
                  {mL === 500 ? (
                    <li className="flex items-center flex-wrap gap-1">
                      <strong>{t.specialName}</strong> {t.specialHalf} (<Fraction num="1" den="2" /> L)
                    </li>
                  ) : mL === 250 ? (
                    <li className="flex items-center flex-wrap gap-1">
                      <strong>{t.specialName}</strong> {t.specialQuarter} (<Fraction num="1" den="4" /> L)
                    </li>
                  ) : mL === 750 ? (
                    <li className="flex items-center flex-wrap gap-1">
                      <strong>{t.specialName}</strong> {t.specialThreeQuarters} (<Fraction num="3" den="4" /> L)
                    </li>
                  ) : mL === 1000 ? (
                    <li>
                      <strong>{t.specialName}</strong> {t.specialOne}
                    </li>
                  ) : mL === 1500 ? (
                    <li>
                      <strong>{t.specialName}</strong> {t.specialOneHalf} ({formatLiters(1.5)} L)
                    </li>
                  ) : (
                    <li className="invisible select-none">
                      <strong>{t.specialName}</strong> -
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 {t.ctaTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">
              {t.ctaDesc}
            </p>
          </div>
          <Link
            href="/d-dimotikou/29-posotita-igrou-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.ctaBtn} ➔
          </Link>
        </div>
      </div>

      {/* ΣΤΑΘΕΡΟ BOTTOM FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-6 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl hidden sm:inline select-none">🥛</span>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider truncate">
                {toCleanUppercase(t.footerGrade)}
              </p>
              <p className="text-sm font-black text-white truncate">
                {t.footerChapter}
              </p>
            </div>
          </div>
          <Link
            href="/d-dimotikou/29-posotita-igrou-ask"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm transition transform active:scale-95 shadow-md flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span>🎯</span>
            <span>{t.footerAction}</span>
          </Link>
        </div>
      </footer>
    </Layout>
  );
}
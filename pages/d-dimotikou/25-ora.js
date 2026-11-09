// pages/d-dimotikou/25-ora.js
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

export function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="text-[0.9em] px-1 pb-0.5 border-b border-current font-bold">{num}</span>
      <span className="text-[0.9em] px-1 pt-0.5 font-bold">{den}</span>
    </span>
  );
}

const translations = {
  el: {
    pageTitle: "Η Μέτρηση του Χρόνου και το Ρολόι - Θεωρία | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε πώς διαβάζουμε το αναλογικό και ψηφιακό ρολόι, πώς μετατρέπουμε ώρες, λεπτά και δευτερόλεπτα με διαδραστικό εργαστήριο χρόνου.",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "⏰ Η Μέτρηση του Χρόνου",
    heroDesc: "Μαθαίνουμε να διαβάζουμε το αναλογικό και το ψηφιακό ρολόι, να μετατρέπουμε ώρες, λεπτά και δευτερόλεπτα και να υπολογίζουμε χρονικές διάρκειες!",
    promoCardTitle: "Έτοιμος για εξάσκηση;",
    promoCardDesc: "Δοκίμασε τις διαδραστικές ασκήσεις για να σιγουρευτείς ότι έμαθες να διαβάζεις και να μετατρέπεις την ώρα!",
    promoCardBtn: "🎯 Μετάβαση στις Ασκήσεις",
    theoryTitle: "Βασικές Μονάδες Μέτρησης Χρόνου & Κανόνες",
    unitsTitle: "Οι Μονάδες Χρόνου",
    dayEquiv: "1 ημέρα ＝ 24 ώρες",
    hourMinEquiv: "1 ώρα (h) ＝ 60 λεπτά (min)",
    minSecEquiv: "1 λεπτό (min) ＝ 60 δευτερόλεπτα (s)",
    hourSecEquiv: "1 ώρα ＝ 3.600 δευτερόλεπτα",
    analogTitle: "Αναλογικό Ρολόι",
    analogDesc: "Διαθέτει 2 βασικούς δείκτες:",
    hourHand: "Μικρός δείκτης: δείχνει τις Ώρες.",
    minHand: "Μεγάλος δείκτης: δείχνει τα Λεπτά.",
    digitalTitle: "Ψηφιακό Ρολόι",
    digitalDesc1: "Προβάλλει την ώρα με αριθμούς (π.χ. 14:30).",
    digitalDesc2: "Μετά το μεσημέρι (12:00), προσθέτουμε 12 στις ώρες (π.χ. 3 μ.μ. ＝ 15:00, 8 μ.μ. ＝ 20:00).",
    conversionRulesTitle: "Πώς μετατρέπουμε τις μονάδες χρόνου:",
    toSmallerHeader: "Από μεγαλύτερη σε μικρότερη μονάδα ( · 60 ):",
    hoursToMinsText: "Ώρες σε Λεπτά: Πολλαπλασιάζουμε με 60 (π.χ. 2 h ＝ 2 · 60 ＝ 120 min).",
    minsToSecsText: "Λεπτά σε Δευτερόλεπτα: Πολλαπλασιάζουμε με 60 (π.χ. 3 min ＝ 3 · 60 ＝ 180 s).",
    toLargerHeader: "Από μικρότερη σε μεγαλύτερη μονάδα ( ： 60 ):",
    minsToHoursText: "Λεπτά σε Ώρες: Διαιρούμε με 60 (π.χ. 180 min ： 60 ＝ 3 h).",
    secsToMinsText: "Δευτερόλεπτα σε Λεπτά: Διαιρούμε με 60 (π.χ. 240 s ： 60 ＝ 4 min).",
    labTitle: "Διαδραστικό Εργαστήριο Ρολογιού & Μετατροπών",
    labDesc: "Άλλαξε την ώρα και παρατήρησε ταυτόχρονα το αναλογικό ρολόι, το ψηφιακό και τους υπολογισμούς!",
    preset1: "🌅 08:00 (Ακριβώς)",
    preset2: "☀️ 12:15 (Και τέταρτο)",
    preset3: "☕ 15:30 (Και μισή)",
    preset4: "🌙 19:45 (Παρά τέταρτο)",
    analogClockTitle: "ΑΝΑΛΟΓΙΚΟ ΡΟΛΟΙ",
    digitalClockTitle: "ΨΗΦΙΑΚΟ ΡΟΛΟΙ (24ΩΡΟ)",
    hoursLabel: "ΩΡΑ (0 - 23)",
    minutesLabel: "ΛΕΠΤΑ (0 - 59)",
    decreaseHourAria: "Μείωση ώρας",
    increaseHourAria: "Αύξηση ώρας",
    decreaseMinAria: "Μείωση λεπτών",
    increaseMinAria: "Αύξηση λεπτών",
    conversionBoxTitle: "🧮 ΑΥΤΟΜΑΤΗ ΜΕΤΑΤΡΟΠΗ ΤΗΣ ΩΡΑΣ:",
    totalMinutesLabel: "Συνολικά Λεπτά",
    totalSecondsLabel: "Συνολικά Δευτερόλεπτα",
    ctaTitle: "📝 Ώρα για Εξάσκηση!",
    ctaDesc: "Έμαθες να διαβάζεις το ρολόι και να μετατρέπεις τις μονάδες χρόνου; Δοκίμασε τις διαδραστικές ασκήσεις!",
    ctaBtn: "Ξεκίνα τις Ασκήσεις ➔",
    footerPrompt: "Ολοκλήρωσες τη θεωρία;",
    footerBtn: "Μετάβαση στις Ασκήσεις 🎯",
    ampmPm: "μ.μ.",
    ampmAm: "π.μ.",
    spokenExact: (h) => `${h} ακριβώς`,
    spokenQuarterPast: (h) => `${h} και τέταρτο`,
    spokenHalfPast: (h) => `${h} και μισή`,
    spokenQuarterTo: (nextH) => `${nextH} παρά τέταρτο`,
    spokenPast: (h, m) => `${h} και ${m} λεπτά`,
    spokenTo: (nextH, rem) => `${nextH} παρά ${rem} λεπτά`
  },
  en: {
    pageTitle: "Time Measurement & Clocks - Theory | LearnMaths.gr",
    pageDesc: "Learn how to read analog and digital clocks, and convert between hours, minutes, and seconds in an interactive time lab.",
    backText: "Grade 4",
    exercisesBtn: "Exercises",
    gradeBadge: "GRADE 4",
    heroTitle: "⏰ Measuring Time",
    heroDesc: "Learn how to tell time on analog and digital clocks, convert between hours, minutes, and seconds, and calculate time elapsed!",
    promoCardTitle: "Ready for practice?",
    promoCardDesc: "Try the interactive exercises to ensure you've mastered reading clocks and converting units of time!",
    promoCardBtn: "🎯 Go to Exercises",
    theoryTitle: "Basic Units of Time & Rules",
    unitsTitle: "Units of Time",
    dayEquiv: "1 day ＝ 24 hours",
    hourMinEquiv: "1 hour (h) ＝ 60 minutes (min)",
    minSecEquiv: "1 minute (min) ＝ 60 seconds (s)",
    hourSecEquiv: "1 hour ＝ 3,600 seconds",
    analogTitle: "Analog Clock",
    analogDesc: "Features 2 primary hands:",
    hourHand: "Short hand: indicates the Hours.",
    minHand: "Long hand: indicates the Minutes.",
    digitalTitle: "Digital Clock",
    digitalDesc1: "Displays time using digits (e.g., 14:30).",
    digitalDesc2: "After noon (12:00), we add 12 to 12-hour values (e.g., 3 PM ＝ 15:00, 8 PM ＝ 20:00).",
    conversionRulesTitle: "How to convert units of time:",
    toSmallerHeader: "From larger to smaller unit ( · 60 ):",
    hoursToMinsText: "Hours to Minutes: Multiply by 60 (e.g., 2 h ＝ 2 · 60 ＝ 120 min).",
    minsToSecsText: "Minutes to Seconds: Multiply by 60 (e.g., 3 min ＝ 3 · 60 ＝ 180 s).",
    toLargerHeader: "From smaller to larger unit ( ： 60 ):",
    minsToHoursText: "Minutes to Hours: Divide by 60 (e.g., 180 min ： 60 ＝ 3 h).",
    secsToMinsText: "Seconds to Minutes: Divide by 60 (e.g., 240 s ： 60 ＝ 4 min).",
    labTitle: "Interactive Clock & Time Conversion Lab",
    labDesc: "Adjust the time to observe the analog clock face, digital readout, and live conversions simultaneously!",
    preset1: "🌅 08:00 (Exact)",
    preset2: "☀️ 12:15 (Quarter past)",
    preset3: "☕ 15:30 (Half past)",
    preset4: "🌙 19:45 (Quarter to)",
    analogClockTitle: "ANALOG CLOCK",
    digitalClockTitle: "DIGITAL CLOCK (24-HOUR)",
    hoursLabel: "HOURS (0 - 23)",
    minutesLabel: "MINUTES (0 - 59)",
    decreaseHourAria: "Decrease hour",
    increaseHourAria: "Increase hour",
    decreaseMinAria: "Decrease minutes",
    increaseMinAria: "Increase minutes",
    conversionBoxTitle: "🧮 AUTOMATIC TIME CONVERSION:",
    totalMinutesLabel: "Total Minutes",
    totalSecondsLabel: "Total Seconds",
    ctaTitle: "📝 Practice Time!",
    ctaDesc: "Mastered reading the clock and converting units of time? Test your skills with interactive exercises!",
    ctaBtn: "Start Exercises ➔",
    footerPrompt: "Finished reviewing the theory?",
    footerBtn: "Go to Exercises 🎯",
    ampmPm: "PM",
    ampmAm: "AM",
    spokenExact: (h) => `${h} o'clock`,
    spokenQuarterPast: (h) => `quarter past ${h}`,
    spokenHalfPast: (h) => `half past ${h}`,
    spokenQuarterTo: (nextH) => `quarter to ${nextH}`,
    spokenPast: (h, m) => `${m} minutes past ${h}`,
    spokenTo: (nextH, rem) => `${rem} minutes to ${nextH}`
  }
};

export default function OraTheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const formatNumber = (num) => {
    if (num === '' || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
  };

  const [hours, setHours] = useState(15);
  const [minutes, setMinutes] = useState(30);

  const hourAngle = ((hours % 12) * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;

  const totalMinutes = (hours * 60) + minutes;
  const totalSeconds = totalMinutes * 60;

  const displayHours12 = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = hours >= 12 ? t.ampmPm : t.ampmAm;
  const formattedDigital = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  const getSpokenTime = () => {
    const h = displayHours12;
    const nextH = (displayHours12 % 12) + 1;

    if (minutes === 0) return t.spokenExact(h);
    if (minutes === 15) return t.spokenQuarterPast(h);
    if (minutes === 30) return t.spokenHalfPast(h);
    if (minutes === 45) return t.spokenQuarterTo(nextH);
    if (minutes < 30) return t.spokenPast(h, minutes);
    return t.spokenTo(nextH, 60 - minutes);
  };

  const setPreset = (e, h, m) => {
    e.preventDefault();
    e.stopPropagation();
    setHours(h);
    setMinutes(m);
  };

  const updateHours = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setHours((prev) => Math.max(0, Math.min(23, prev + delta)));
  };

  const updateMinutes = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setMinutes((prev) => Math.max(0, Math.min(59, prev + delta)));
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
          href="/d-dimotikou/25-ora-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.gradeBadge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.promoCardTitle}</h3>
              <p className="text-xs text-blue-100">
                {t.promoCardDesc}
              </p>
              <Link
                href="/d-dimotikou/25-ora-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                {t.promoCardBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - SECTION 1 */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> {t.theoryTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Σχέσεις Μονάδων */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>⏱️</span> {t.unitsTitle}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                <li><strong>{t.dayEquiv}</strong></li>
                <li><strong>{t.hourMinEquiv}</strong></li>
                <li><strong>{t.minSecEquiv}</strong></li>
                <li><strong>{t.hourSecEquiv}</strong></li>
              </ul>
            </div>

            {/* 2. Αναλογικό Ρολόι */}
            <div className="bg-cyan-50/70 p-5 sm:p-6 rounded-2xl border border-cyan-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-cyan-900 flex items-center gap-2">
                <span>🕰️</span> {t.analogTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.analogDesc}
              </p>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                <li><strong>{t.hourHand}</strong></li>
                <li><strong>{t.minHand}</strong></li>
              </ul>
            </div>

            {/* 3. Ψηφιακό Ρολόι */}
            <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-blue-900 flex items-center gap-2">
                <span>📟</span> {t.digitalTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.digitalDesc1}
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.digitalDesc2}
              </p>
            </div>
          </div>

          {/* ΠΙΝΑΚΑΣ ΜΕΤΑΤΡΟΠΩΝ */}
          <div className="bg-slate-50 p-5 sm:p-7 rounded-3xl border border-slate-200 space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <span>🔄</span> {t.conversionRulesTitle}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
                <p className="font-bold text-emerald-800">{t.toSmallerHeader}</p>
                <p className="text-slate-600">{t.hoursToMinsText}</p>
                <p className="text-slate-600">{t.minsToSecsText}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
                <p className="font-bold text-blue-800">{t.toLargerHeader}</p>
                <p className="text-slate-600">{t.minsToHoursText}</p>
                <p className="text-slate-600">{t.secsToMinsText}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> {t.labTitle}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                {t.labDesc}
              </p>
            </div>

            {/* ΠΡΟΕΠΙΛΟΓΕΣ ΩΡΑΣ */}
            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
              <button
                onClick={(e) => setPreset(e, 8, 0)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                {t.preset1}
              </button>
              <button
                onClick={(e) => setPreset(e, 12, 15)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                {t.preset2}
              </button>
              <button
                onClick={(e) => setPreset(e, 15, 30)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                {t.preset3}
              </button>
              <button
                onClick={(e) => setPreset(e, 19, 45)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                {t.preset4}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* ΑΝΑΛΟΓΙΚΟ ΡΟΛΟΙ */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                {toCleanUppercase(t.analogClockTitle)}
              </span>

              <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                <svg className="w-full h-full block select-none" viewBox="0 0 200 200">
                  {/* Καντράν */}
                  <circle cx="100" cy="100" r="90" fill="#0f172a" stroke="#38bdf8" strokeWidth="5.5" />

                  {/* Σημάδια Ωρών (1 - 12) */}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                    const angle = (num * 30) * (Math.PI / 180);
                    const x = 100 + 70 * Math.sin(angle);
                    const y = 100 - 70 * Math.cos(angle);
                    return (
                      <text
                        key={num}
                        x={x}
                        y={y + 5}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="14"
                        fontWeight="900"
                        fontFamily="monospace"
                      >
                        {num}
                      </text>
                    );
                  })}

                  {/* Μικρός Δείκτης (Ώρα - Μπλε) */}
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="55"
                    stroke="#38bdf8"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    transform={`rotate(${hourAngle}, 100, 100)`}
                  />

                  {/* Μεγάλος Δείκτης (Λεπτά - Ροζ/Κόκκινο) */}
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="32"
                    stroke="#f43f5e"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    transform={`rotate(${minuteAngle}, 100, 100)`}
                  />

                  {/* Κεντρικό καρφάκι */}
                  <circle cx="100" cy="100" r="5" fill="#fbbf24" />
                </svg>
              </div>

              <div className="text-center space-y-1">
                <p className="text-amber-300 font-extrabold text-base sm:text-lg">
                  🗣️ «{getSpokenTime()}»
                </p>
                <p className="text-slate-400 text-xs font-mono">
                  ({displayHours12}:{minutes.toString().padStart(2, '0')} {ampm})
                </p>
              </div>
            </div>

            {/* ΧΕΙΡΙΣΤΗΡΙΑ & ΨΗΦΙΑΚΟ DISPLAY */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              {/* ΨΗΦΙΑΚΟ DISPLAY */}
              <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl text-center border-2 border-indigo-500/30 space-y-1 shadow-inner">
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block">
                  {toCleanUppercase(t.digitalClockTitle)}
                </span>
                <div className="text-4xl sm:text-5xl font-mono font-black text-emerald-400 tracking-widest">
                  {formattedDigital}
                </div>
              </div>

              {/* SLIDERS & STEPPERS */}
              <div className="space-y-3">
                {/* Ώρα */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black uppercase text-slate-500">
                      {toCleanUppercase(t.hoursLabel)}
                    </span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                      {hours} h
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateHours(e, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title={t.decreaseHourAria}
                      aria-label={t.decreaseHourAria}
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="23"
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                    />

                    <button
                      onClick={(e) => updateHours(e, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title={t.increaseHourAria}
                      aria-label={t.increaseHourAria}
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Λεπτά */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black uppercase text-slate-500">
                      {toCleanUppercase(t.minutesLabel)}
                    </span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-rose-600 text-base">
                      {minutes} min
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateMinutes(e, -1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title={t.decreaseMinAria}
                      aria-label={t.decreaseMinAria}
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) => setMinutes(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-rose-600 cursor-pointer"
                    />

                    <button
                      onClick={(e) => updateMinutes(e, 1)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                      title={t.increaseMinAria}
                      aria-label={t.increaseMinAria}
                    >
                      ＋
                    </button>
                  </div>

                  {/* Βοηθητικά κουμπιά 5λέπτων */}
                  <div className="flex justify-center gap-2 pt-0.5">
                    <button
                      onClick={(e) => updateMinutes(e, -5)}
                      className="px-2.5 py-0.5 text-[11px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 touch-manipulation"
                    >
                      -5 min
                    </button>
                    <button
                      onClick={(e) => updateMinutes(e, 5)}
                      className="px-2.5 py-0.5 text-[11px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 touch-manipulation"
                    >
                      +5 min
                    </button>
                  </div>
                </div>
              </div>

              {/* ΑΥΤΟΜΑΤΕΣ ΜΕΤΑΤΡΟΠΕΣ */}
              <div className="bg-indigo-50 p-3.5 rounded-2xl border border-indigo-200 space-y-2">
                <span className="text-[11px] font-black uppercase text-indigo-900 block">
                  {toCleanUppercase(t.conversionBoxTitle)}
                </span>
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-sm">
                    <span className="text-[10px] text-slate-500 block">{t.totalMinutesLabel}</span>
                    <span className="text-indigo-800 font-black text-sm sm:text-base">
                      {formatNumber(totalMinutes)} min
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-sm">
                    <span className="text-[10px] text-slate-500 block">{t.totalSecondsLabel}</span>
                    <span className="text-indigo-800 font-black text-sm sm:text-base">
                      {formatNumber(totalSeconds)} s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">{t.ctaTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">
              {t.ctaDesc}
            </p>
          </div>
          <Link
            href="/d-dimotikou/25-ora-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.ctaBtn}
          </Link>
        </div>
      </div>

      {/* ΣΤΑΘΕΡΟ BOTTOM FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 sm:py-4">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-slate-300 font-medium truncate">
            {t.footerPrompt}
          </div>
          <Link
            href="/d-dimotikou/25-ora-ask"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm transition shadow-lg shrink-0"
          >
            {t.footerBtn}
          </Link>
        </div>
      </footer>
    </Layout>
  );
}
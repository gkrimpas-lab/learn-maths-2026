// pages/d-dimotikou/26-aionas.js
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

function toRoman(num) {
  const romanMap = [
    { val: 30, str: 'XXX' },
    { val: 29, str: 'XXIX' },
    { val: 28, str: 'XXVIII' },
    { val: 27, str: 'XXVII' },
    { val: 26, str: 'XXVI' },
    { val: 25, str: 'XXV' },
    { val: 24, str: 'XXIV' },
    { val: 23, str: 'XXIII' },
    { val: 22, str: 'XXII' },
    { val: 21, str: 'XXI' },
    { val: 20, str: 'XX' },
    { val: 19, str: 'XIX' },
    { val: 18, str: 'XVIII' },
    { val: 17, str: 'XVII' },
    { val: 16, str: 'XVI' },
    { val: 15, str: 'XV' },
    { val: 14, str: 'XIV' },
    { val: 13, str: 'XIII' },
    { val: 12, str: 'XII' },
    { val: 11, str: 'XI' },
    { val: 10, str: 'X' },
    { val: 9, str: 'IX' },
    { val: 8, str: 'VIII' },
    { val: 7, str: 'VII' },
    { val: 6, str: 'VI' },
    { val: 5, str: 'V' },
    { val: 4, str: 'IV' },
    { val: 3, str: 'III' },
    { val: 2, str: 'II' },
    { val: 1, str: 'I' }
  ];
  const found = romanMap.find((item) => item.val === num);
  return found ? found.str : `${num}`;
}

const translations = {
  el: {
    pageTitle: "Ημέρες, Μήνες, Έτη, Αιώνες & Δίσεκτα Έτη - Θεωρία | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε πώς υπολογίζουμε τους αιώνες, πώς ξεχωρίζουμε τα δίσεκτα έτη και πώς συνδέονται οι μονάδες μέτρησης χρόνου με διαδραστικό εργαστήριο.",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "📅 Ημέρες, Μήνες, Έτη, Αιώνες και Δίσεκτα Έτη",
    heroDesc: "Μαθαίνουμε πώς μετράμε τον χρόνο σε εβδομάδες, μήνες, χρόνια και αιώνες, τι ακριβώς είναι τα δίσεκτα έτη και πώς βρίσκουμε εύκολα σε ποιον αιώνα ανήκει οποιαδήποτε χρονιά!",
    promoCardTitle: "Έτοιμος για εξάσκηση;",
    promoCardDesc: "Δοκίμασε τις διαδραστικές ασκήσεις για να σιγουρευτείς ότι κατέκτησες τους αιώνες και τα δίσεκτα έτη!",
    promoCardBtn: "🎯 Μετάβαση στις Ασκήσεις",
    theoryTitle: "Οι Μεγάλες Μονάδες Μέτρησης του Χρόνου",
    section1Title: "Εβδομάδα, Μήνας & Έτος",
    weekEquiv: "1 εβδομάδα ＝ 7 ημέρες",
    monthEquiv: "1 μήνας ＝ 30 ή 31 ημέρες (Φεβρ.: 28 ή 29)",
    yearMonthsEquiv: "1 έτος (χρόνος) ＝ 12 μήνες",
    yearWeeksEquiv: "1 έτος ＝ 52 εβδομάδες",
    yearDaysEquiv: "1 κοινό έτος ＝ 365 ημέρες",
    section2Title: "Τι είναι το Δίσεκτο Έτος;",
    section2Desc: "Κάθε 4 χρόνια έχουμε δίσεκτο έτος, το οποίο διαρκεί 366 ημέρες (1 ημέρα παραπάνω).",
    febDaysNotice: "💡 Τότε ο Φεβρουάριος έχει 29 ημέρες αντί για 28!",
    section3Title: "Δεκαετία, Αιώνας, Χιλιετία",
    decadeEquiv: "1 δεκαετία ＝ 10 χρόνια",
    centuryEquiv: "1 αιώνας (αι.) ＝ 100 χρόνια",
    millenniumEquiv: "1 χιλιετία ＝ 1.000 χρόνια (ή 10 αιώνες)",
    rulesTitle: "Ο Χρυσός Κανόνας: Σε ποιον αιώνα ανήκει ένα έτος;",
    rule1Title: "Περίπτωση 1: Το έτος ΔΕΝ τελειώνει σε «00»",
    rule1Desc: "Κοιτάμε τα πρώτα ψηφία (τις εκατοντάδες) και προσθέτουμε 1 (＋1)!",
    rule1Ex1: "Το έτος 1821 → 18 ＋ 1 ＝ 19ος αιώνας (XIX)",
    rule1Ex2: "Το έτος 2026 → 20 ＋ 1 ＝ 21ος αιώνας (XXI)",
    rule1Ex3: "Το έτος 480 π.Χ. → 4 ＋ 1 ＝ 5ος αιώνας (V)",
    rule2Title: "Περίπτωση 2: Το έτος ΤΕΛΕΙΩΝΕΙ σε «00»",
    rule2Desc: "Ο αιώνας ισούται ακριβώς με τα πρώτα ψηφία (δεν προσθέτουμε τίποτα)!",
    rule2Ex1: "Το έτος 1900 → 19ος αιώνας (XIX)",
    rule2Ex2: "Το έτος 2000 → 20ός αιώνας (XX)",
    rule2Ex3: "Το έτος 1500 → 15ος αιώνας (XV)",
    labTitle: "Διαδραστικός Υπολογιστής Αιώνα και Δίσεκτου Έτους",
    labDesc: "Πληκτρολόγησε οποιαδήποτε χρονιά ή διάλεξε ένα ιστορικό έτος για να δεις αυτόματα τον αιώνα και τα χαρακτηριστικά της!",
    preset1: "🇬🇷 1821 (Επανάσταση)",
    preset2: "🎖️ 1940 (Έπος '40)",
    preset3: "✨ 2000 (Millennium)",
    preset4: "🚀 2026 (Σήμερα)",
    controlsTitle: "Ρύθμιση Έτους:",
    yearLabel: "ΕΤΟΣ (1 - 3.000)",
    decreaseYearAria: "Μείωση κατά 1 έτος",
    increaseYearAria: "Αύξηση κατά 1 έτος",
    centurySpan: (start, end) => `• Διάρκεια Αιώνα: Από το έτος ${start} έως και το ${end}.`,
    febStatus: (y, isLeap) => `• Φεβρουάριος ${y}: Έχει ${isLeap ? '29 ημέρες (Δίσεκτο)' : '28 ημέρες (Κοινό)'}.`,
    resultsHeader: (y) => `ΑΠΟΤΕΛΕΣΜΑΤΑ ΓΙΑ ΤΟ ΕΤΟΣ ${y}`,
    belongsTo: "ΑΝΗΚΕΙ ΣΤΟΝ:",
    centuryText: (c) => `${c}ο Αιώνα`,
    romanText: (rom) => `(Λατινική γραφή: ${rom})`,
    yearTypeLabel: "ΕΙΔΟΣ ΕΤΟΥΣ",
    leapYear: "✨ Δίσεκτο",
    commonYear: "Κοινό Έτος",
    yearDaysLabel: "ΗΜΕΡΕΣ ΕΤΟΥΣ",
    daysCount: (days) => `${days} ημέρες`,
    ctaTitle: "📝 Ώρα για Εξάσκηση!",
    ctaDesc: "Έμαθες να βρίσκεις τους αιώνες και να ξεχωρίζεις τα δίσεκτα έτη; Δοκίμασε τις διαδραστικές ασκήσεις!",
    ctaBtn: "Ξεκίνα τις Ασκήσεις ➔",
    footerPrompt: "Ολοκλήρωσες τη θεωρία;",
    footerBtn: "Μετάβαση στις Ασκήσεις 🎯"
  },
  en: {
    pageTitle: "Days, Months, Years, Centuries & Leap Years - Theory | LearnMaths.gr",
    pageDesc: "Learn how to calculate centuries, identify leap years, and connect units of time in an interactive math lab.",
    backText: "Grade 4",
    exercisesBtn: "Exercises",
    gradeBadge: "GRADE 4",
    heroTitle: "📅 Days, Months, Years, Centuries and Leap Years",
    heroDesc: "Learn how we measure time in weeks, months, years, and centuries, what leap years are, and how to determine the century of any given year!",
    promoCardTitle: "Ready for practice?",
    promoCardDesc: "Try the interactive exercises to make sure you've mastered centuries and leap years!",
    promoCardBtn: "🎯 Go to Exercises",
    theoryTitle: "Major Units of Time Measurement",
    section1Title: "Week, Month & Year",
    weekEquiv: "1 week ＝ 7 days",
    monthEquiv: "1 month ＝ 30 or 31 days (Feb: 28 or 29)",
    yearMonthsEquiv: "1 year ＝ 12 months",
    yearWeeksEquiv: "1 year ＝ 52 weeks",
    yearDaysEquiv: "1 common year ＝ 365 days",
    section2Title: "What is a Leap Year?",
    section2Desc: "Every 4 years we have a leap year, which lasts 366 days (1 extra day).",
    febDaysNotice: "💡 In a leap year, February has 29 days instead of 28!",
    section3Title: "Decade, Century, Millennium",
    decadeEquiv: "1 decade ＝ 10 years",
    centuryEquiv: "1 century (c.) ＝ 100 years",
    millenniumEquiv: "1 millennium ＝ 1,000 years (or 10 centuries)",
    rulesTitle: "The Golden Rule: Which century does a year belong to?",
    rule1Title: "Case 1: The year DOES NOT end in \"00\"",
    rule1Desc: "Take the leading digits (hundreds) and add 1 (＋1)!",
    rule1Ex1: "Year 1821 → 18 ＋ 1 ＝ 19th Century (XIX)",
    rule1Ex2: "Year 2026 → 20 ＋ 1 ＝ 21st Century (XXI)",
    rule1Ex3: "Year 480 BC → 4 ＋ 1 ＝ 5th Century (V)",
    rule2Title: "Case 2: The year ENDS in \"00\"",
    rule2Desc: "The century is strictly equal to the leading digits (do not add anything)!",
    rule2Ex1: "Year 1900 → 19th Century (XIX)",
    rule2Ex2: "Year 2000 → 20th Century (XX)",
    rule2Ex3: "Year 1500 → 15th Century (XV)",
    labTitle: "Interactive Century & Leap Year Calculator",
    labDesc: "Type any year or choose a historical date to see its century and characteristics calculated live!",
    preset1: "🇬🇷 1821 (Revolution)",
    preset2: "🎖️ 1940 (WWII Greece)",
    preset3: "✨ 2000 (Millennium)",
    preset4: "🚀 2026 (Today)",
    controlsTitle: "Year Settings:",
    yearLabel: "YEAR (1 - 3,000)",
    decreaseYearAria: "Decrease year by 1",
    increaseYearAria: "Increase year by 1",
    centurySpan: (start, end) => `• Century span: From year ${start} up to and including ${end}.`,
    febStatus: (y, isLeap) => `• February ${y}: Has ${isLeap ? '29 days (Leap year)' : '28 days (Common year)'}.`,
    resultsHeader: (y) => `RESULTS FOR YEAR ${y}`,
    belongsTo: "BELONGS TO:",
    centuryText: (c) => `${c}${c === 1 ? 'st' : c === 2 ? 'nd' : c === 3 ? 'rd' : 'th'} Century`,
    romanText: (rom) => `(Roman numerals: ${rom})`,
    yearTypeLabel: "YEAR TYPE",
    leapYear: "✨ Leap Year",
    commonYear: "Common Year",
    yearDaysLabel: "DAYS IN YEAR",
    daysCount: (days) => `${days} days`,
    ctaTitle: "📝 Practice Time!",
    ctaDesc: "Mastered finding centuries and identifying leap years? Test your knowledge with interactive exercises!",
    ctaBtn: "Start Exercises ➔",
    footerPrompt: "Finished reviewing the theory?",
    footerBtn: "Go to Exercises 🎯"
  }
};

export default function AionasTheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const formatNumber = (num) => {
    if (num === '' || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
  };

  const [yearInput, setYearInput] = useState(2026);

  const y = typeof yearInput === 'number' && yearInput > 0 ? yearInput : 1;

  const century = Math.floor((y - 1) / 100) + 1;
  const startYear = (century - 1) * 100 + 1;
  const endYear = century * 100;

  const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const daysInYear = isLeap ? 366 : 365;

  const setHistoricalPreset = (e, year) => {
    e.preventDefault();
    e.stopPropagation();
    setYearInput(year);
  };

  const updateYear = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setYearInput((prev) => Math.max(1, Math.min(3000, (Number(prev) || 1) + delta)));
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
          href="/d-dimotikou/26-aionas-ask"
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
              <h3 className="font-extrabold text-white text-lg">{t.promoCardTitle}</h3>
              <p className="text-xs text-purple-100">
                {t.promoCardDesc}
              </p>
              <Link
                href="/d-dimotikou/26-aionas-ask"
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
            {/* 1. Εβδομάδα, Μήνας και Χρόνος */}
            <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-blue-950 flex items-center gap-2">
                <span>🗓️</span> {t.section1Title}
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 font-medium">
                <li><strong>{t.weekEquiv}</strong></li>
                <li><strong>{t.monthEquiv}</strong></li>
                <li><strong>{t.yearMonthsEquiv}</strong></li>
                <li><strong>{t.yearWeeksEquiv}</strong></li>
                <li><strong>{t.yearDaysEquiv}</strong></li>
              </ul>
            </div>

            {/* 2. Δίσεκτο Έτος */}
            <div className="bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-amber-950 flex items-center gap-2">
                <span>❄️</span> {t.section2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.section2Desc}
              </p>
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs text-amber-950 font-bold shadow-sm">
                {t.febDaysNotice}
              </div>
            </div>

            {/* 3. Δεκαετία, Αιώνας & Χιλιετία */}
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-purple-950 flex items-center gap-2">
                <span>🏛️</span> {t.section3Title}
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 font-medium">
                <li><strong>{t.decadeEquiv}</strong></li>
                <li><strong>{t.centuryEquiv}</strong></li>
                <li><strong>{t.millenniumEquiv}</strong></li>
              </ul>
            </div>
          </div>

          {/* ΠΩΣ ΒΡΙΣΚΟΥΜΕ ΤΟΝ ΑΙΩΝΑ */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 sm:p-8 rounded-3xl border border-indigo-100 space-y-4 shadow-sm">
            <h3 className="text-base sm:text-lg font-extrabold text-indigo-950 flex items-center gap-2">
              <span>🔍</span> {t.rulesTitle}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-indigo-100 space-y-2 shadow-sm">
                <h4 className="font-black text-indigo-900">
                  {t.rule1Title}
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  {t.rule1Desc}
                </p>
                <ul className="space-y-1 text-slate-700 font-mono font-bold">
                  <li>{t.rule1Ex1}</li>
                  <li>{t.rule1Ex2}</li>
                  <li>{t.rule1Ex3}</li>
                </ul>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-indigo-100 space-y-2 shadow-sm">
                <h4 className="font-black text-purple-900">
                  {t.rule2Title}
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  {t.rule2Desc}
                </p>
                <ul className="space-y-1 text-slate-700 font-mono font-bold">
                  <li>{t.rule2Ex1}</li>
                  <li>{t.rule2Ex2}</li>
                  <li>{t.rule2Ex3}</li>
                </ul>
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

            {/* ΠΡΟΕΠΙΛΟΓΕΣ ΧΡΟΝΙΩΝ */}
            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
              <button
                onClick={(e) => setHistoricalPreset(e, 1821)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                {t.preset1}
              </button>
              <button
                onClick={(e) => setHistoricalPreset(e, 1940)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                {t.preset2}
              </button>
              <button
                onClick={(e) => setHistoricalPreset(e, 2000)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 touch-manipulation"
              >
                {t.preset3}
              </button>
              <button
                onClick={(e) => setHistoricalPreset(e, 2026)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition active:scale-95 touch-manipulation"
              >
                {t.preset4}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* ΧΕΙΡΙΣΤΗΡΙΑ ΕΙΣΑΓΩΓΗΣ ΧΡΟΝΙΑΣ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span>⚙️</span> {t.controlsTitle}
              </h3>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="h-8 flex items-center justify-between text-center px-1">
                  <span className="text-[11px] font-black uppercase text-slate-500">
                    {toCleanUppercase(t.yearLabel)}
                  </span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                    {formatNumber(y)}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    onClick={(e) => updateYear(e, -1)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                    title={t.decreaseYearAria}
                    aria-label={t.decreaseYearAria}
                  >
                    －
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    autoComplete="off"
                    id="input-year"
                    name="input-year"
                    value={yearInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                      if (val === '') setYearInput('');
                      else setYearInput(Math.min(3000, Number(val)));
                    }}
                    onBlur={() => {
                      if (!yearInput || yearInput < 1) setYearInput(1);
                    }}
                    className="w-full min-w-0 max-w-full text-center font-mono font-black text-xl sm:text-2xl text-indigo-700 border border-slate-300 rounded-xl py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="2026"
                  />

                  <button
                    onClick={(e) => updateYear(e, 1)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                    title={t.increaseYearAria}
                    aria-label={t.increaseYearAria}
                  >
                    ＋
                  </button>
                </div>

                <div className="pt-2">
                  <input
                    type="range"
                    min="1"
                    max="3000"
                    value={y}
                    onChange={(e) => setYearInput(Number(e.target.value))}
                    className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Γρήγορα κουμπιά δεκαετιών και αιώνων */}
                <div className="flex justify-center gap-1.5 pt-1">
                  <button
                    onClick={(e) => updateYear(e, -100)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    -100
                  </button>
                  <button
                    onClick={(e) => updateYear(e, -10)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    -10
                  </button>
                  <button
                    onClick={(e) => updateYear(e, 10)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    +10
                  </button>
                  <button
                    onClick={(e) => updateYear(e, 100)}
                    className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                  >
                    +100
                  </button>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5 shadow-sm">
                <p>
                  {t.centurySpan(formatNumber(startYear), formatNumber(endYear))}
                </p>
                <p>
                  {t.febStatus(y, isLeap)}
                </p>
              </div>
            </div>

            {/* ΟΠΤΙΚΟΠΟΙΗΣΗ ΑΠΟΤΕΛΕΣΜΑΤΩΝ */}
            <div className="bg-slate-950 text-white p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-4 text-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400 block">
                {toCleanUppercase(t.resultsHeader(formatNumber(y)))}
              </span>

              {/* Badge Αιώνα */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 sm:p-6 rounded-2xl border border-indigo-400/30 space-y-1 shadow-lg">
                <span className="text-xs font-bold text-indigo-200 block uppercase">{t.belongsTo}</span>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono">
                  {t.centuryText(century)}
                </div>
                <span className="text-sm font-bold text-indigo-100 block font-mono">
                  {t.romanText(toRoman(century))}
                </span>
              </div>

              {/* Στοιχεία Δίσεκτου Έτους & Ημερών */}
              <div className="grid grid-cols-2 gap-3 text-center font-mono">
                <div
                  className={`p-3 rounded-2xl border shadow-sm ${
                    isLeap
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-[10px] uppercase font-sans font-bold block text-slate-400">
                    {toCleanUppercase(t.yearTypeLabel)}
                  </span>
                  <span className="text-sm sm:text-base font-black">
                    {isLeap ? t.leapYear : t.commonYear}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-slate-200 shadow-sm">
                  <span className="text-[10px] uppercase font-sans font-bold block text-slate-400">
                    {toCleanUppercase(t.yearDaysLabel)}
                  </span>
                  <span className="text-sm sm:text-base font-black text-amber-300">
                    {t.daysCount(daysInYear)}
                  </span>
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
            href="/d-dimotikou/26-aionas-ask"
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
            href="/d-dimotikou/26-aionas-ask"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm transition shadow-lg shrink-0"
          >
            {t.footerBtn}
          </Link>
        </div>
      </footer>
    </Layout>
  );
}
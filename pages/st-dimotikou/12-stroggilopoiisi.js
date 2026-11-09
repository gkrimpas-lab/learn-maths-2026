import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const TRANSLATIONS = {
  el: {
    pageTitle: "Στρογγυλοποίηση Φυσικών και Δεκαδικών Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθε τον κανόνα του ψηφίου-κλειδιού για να στρογγυλοποιείς με ακρίβεια σε μονάδες, δεκάδες, εκατοντάδες, δέκατα, εκατοστά και χιλιοστά για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    exercisesBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 12 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Στρογγυλοποίηση Φυσικών & Δεκαδικών Αριθμών",
    heroDesc: "Μάθε τον «κανόνα του ψηφίου-κλειδιού» για να στρογγυλοποιείς με ακρίβεια σε οποιαδήποτε τάξη: Μονάδες, Δεκάδες, Εκατοντάδες ή Δέκατα, Εκατοστά και Χιλιοστά!",
    heroPills: "Κανόνας Ψηφίου-Κλειδιού & Διαδραστική Αριθμογραμμή",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Οι Βασικοί Κανόνες Στρογγυλοποίησης",
    theorySubtitle: "Πώς αποφασίζουμε αν θα στρογγυλοποιήσουμε προς τα πάνω ή προς τα κάτω.",
    cards: [
      {
        badge: "ΒΑΣΙΚΗ ΕΝΝΟΙΑ",
        sub: "Εκτίμηση",
        title: "Τι είναι η Στρογγυλοποίηση;",
        body: "Αντικαθιστούμε έναν αριθμό με έναν κοντινό του πιο «στρογγυλό», ώστε να κάνουμε γρήγορους υπολογισμούς και εκτιμήσεις στην καθημερινή ζωή.",
        example: "19,85 € ≈ 20 €",
        tip: "💡 Η στρογγυλοποίηση μας δίνει μια προσεγγιστική αλλά εύχρηστη τιμή."
      },
      {
        badge: "ΚΑΝΟΝΑΣ 1",
        sub: "0, 1, 2, 3, 4",
        title: "Στρογγυλοποίηση Κάτω",
        body: "Αν το αμέσως επόμενο ψηφίο (δεξιά από τη θέση στρογγυλοποίησης) είναι 0, 1, 2, 3 ή 4, το ψηφίο της τάξης παραμένει ίδιο.",
        example: "432 ≈ 430 (δεκάδες)",
        tip: "📉 Ο αριθμός είναι πιο κοντά στο κάτω όριο της αριθμογραμμής."
      },
      {
        badge: "ΚΑΝΟΝΑΣ 2",
        sub: "5, 6, 7, 8, 9",
        title: "Στρογγυλοποίηση Πάνω",
        body: "Αν το αμέσως επόμενο ψηφίο (δεξιά από τη θέση στρογγυλοποίησης) είναι 5, 6, 7, 8 ή 9, το ψηφίο της τάξης αυξάνεται κατά 1.",
        example: "437 ≈ 440 (δεκάδες)",
        tip: "📈 Ο αριθμός έχει φτάσει ή ξεπεράσει τη μέση, άρα πλησιάζει το πάνω όριο."
      }
    ],
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Στρογγυλοποίησης",
    labDesc: "Πληκτρολόγησε έναν αριθμό, επίλεξε την τάξη στρογγυλοποίησης και παρατήρησε την κίνηση πάνω στην αριθμογραμμή!",
    inputLabel: "ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΑΡΙΘΜΟ:",
    selectPlaceLabel: "ΕΠΙΛΕΞΕ ΤΑΞΗ ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗΣ:",
    ruleTip: "💡 Στρογγυλοποιούμε πάντα με βάση το αμέσως επόμενο ψηφίο στα δεξιά!",
    visualTitle: "ΟΠΤΙΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗΣ:",
    whereIsLabel: "Πού βρίσκεται ο αριθμός",
    lowerLimitLabel: "ΚΑΤΩ ΟΡΙΟ",
    upperLimitLabel: "ΠΑΝΩ ΟΡΙΟ",
    keyDigitLabel: "ΨΗΦΙΟ-ΚΛΕΙΔΙ:",
    roundUpLabel: "ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΠΑΝΩ ➔",
    roundDownLabel: "⮨ ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΚΑΤΩ",
    reasonUp: "Επειδή το αμέσως επόμενο ψηφίο είναι ≥ 5",
    reasonDown: "Επειδή το αμέσως επόμενο ψηφίο είναι ＜ 5",
    roundedToLabel: "ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΣΤΑ/ΣΤΙΣ:",
    finalValueLabel: "ΤΕΛΙΚΗ ΤΙΜΗ:",
    finalFooterNote: "🔍 Όταν στρογγυλοποιούμε, όλα τα ψηφία δεξιά από τη θέση στρογγυλοποίησης μηδενίζονται (ή παραλείπονται στα δεκαδικά)!",
    ctaTitle: "Ώρα για Εξάσκηση στη Στρογγυλοποίηση!",
    ctaDesc: "Κατανόησες τον κανόνα του ψηφίου-κλειδιού; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "🎯 Έναρξη Ασκήσεων",
    places: {
      hundreds: 'Εκατοντάδες',
      tens: 'Δεκάδες',
      units: 'Μονάδες',
      tenths: 'Δέκατα (0,1)',
      hundredths: 'Εκατοστά (0,01)',
      thousandths: 'Χιλιοστά (0,001)'
    },
    presets: [
      { label: '💶 19,85 € (Τιμή)', val: '19,85', place: 'units' },
      { label: '📏 145,28 μ. (Μήκος)', val: '145,28', place: 'tenths' },
      { label: '⚖️ 74,625 κιλά (Βάρος)', val: '74,625', place: 'hundredths' },
      { label: '👥 1.482 κάτοικοι', val: '1482', place: 'hundreds' }
    ]
  },
  en: {
    pageTitle: "Rounding Whole Numbers & Decimals - Grade 6 | LearnMaths.gr",
    pageDescription: "Master the key-digit rule to accurately round numbers to units, tens, hundreds, tenths, hundredths, and thousandths for Grade 6 Mathematics.",
    backText: "Grade 6",
    exercisesBtn: "🎯 Exercises",
    badgeChapter: "CHAPTER 12 • GRADE 6",
    heroTitle: "Rounding Whole Numbers & Decimals",
    heroDesc: "Master the 'key-digit rule' to round precisely to any place value: Units, Tens, Hundreds, or Tenths, Hundredths, and Thousandths!",
    heroPills: "Key-Digit Rule & Interactive Number Line",
    heroCta: "Try the Exercises",
    theoryTitle: "Fundamental Rounding Rules",
    theorySubtitle: "How we decide whether to round up or down.",
    cards: [
      {
        badge: "CORE CONCEPT",
        sub: "Estimation",
        title: "What is Rounding?",
        body: "We replace a number with a nearby, simpler value to facilitate quick mental calculations and estimations in daily life.",
        example: "19.85 € ≈ 20 €",
        tip: "💡 Rounding provides an approximate yet practical and convenient value."
      },
      {
        badge: "RULE 1",
        sub: "0, 1, 2, 3, 4",
        title: "Rounding Down",
        body: "If the digit immediately following (to the right of the rounding place) is 0, 1, 2, 3, or 4, the rounding place digit remains the same.",
        example: "432 ≈ 430 (tens)",
        tip: "📉 The number is closer to the lower bound on the number line."
      },
      {
        badge: "RULE 2",
        sub: "5, 6, 7, 8, 9",
        title: "Rounding Up",
        body: "If the digit immediately following (to the right of the rounding place) is 5, 6, 7, 8, or 9, the rounding place digit increases by 1.",
        example: "437 ≈ 440 (tens)",
        tip: "📈 The number has reached or passed the midpoint, so it rounds up to the upper bound."
      }
    ],
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Rounding Lab",
    labDesc: "Type a number, select the target rounding place, and watch the needle position on the interactive number line!",
    inputLabel: "ENTER NUMBER:",
    selectPlaceLabel: "SELECT ROUNDING PLACE:",
    ruleTip: "💡 Always round based on the immediate next digit to the right!",
    visualTitle: "VISUAL ROUNDING NUMBER LINE:",
    whereIsLabel: "Where is the number",
    lowerLimitLabel: "LOWER BOUND",
    upperLimitLabel: "UPPER BOUND",
    keyDigitLabel: "KEY DIGIT:",
    roundUpLabel: "ROUND UP ➔",
    roundDownLabel: "⮨ ROUND DOWN",
    reasonUp: "Because the next digit is ≥ 5",
    reasonDown: "Because the next digit is ＜ 5",
    roundedToLabel: "ROUNDED TO:",
    finalValueLabel: "FINAL VALUE:",
    finalFooterNote: "🔍 When rounding, all digits to the right of the target place become zero (or are omitted for decimals)!",
    ctaTitle: "Time to Practice Rounding!",
    ctaDesc: "Understood the key-digit rule? Test your rounding accuracy with 10 interactive questions!",
    ctaBtn: "🎯 Start Exercises",
    places: {
      hundreds: 'Hundreds',
      tens: 'Tens',
      units: 'Units',
      tenths: 'Tenths (0.1)',
      hundredths: 'Hundredths (0.01)',
      thousandths: 'Thousandths (0.001)'
    },
    presets: [
      { label: '💶 19.85 € (Price)', val: '19.85', place: 'units' },
      { label: '📏 145.28 m (Length)', val: '145.28', place: 'tenths' },
      { label: '⚖️ 74.625 kg (Weight)', val: '74.625', place: 'hundredths' },
      { label: '👥 1,482 residents', val: '1482', place: 'hundreds' }
    ]
  }
};

export default function StroggilopoiisiPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';
  const t = TRANSLATIONS[locale];

  const [inputValue, setInputValue] = useState(isEn ? '432.658' : '432,658');
  const [roundPlace, setRoundPlace] = useState('units');

  const handleInputChange = (val) => {
    const sep = isEn ? '.' : ',';
    let clean = isEn
      ? val.replace(/,/g, '.').replace(/[^0-9.]/g, '')
      : val.replace(/\./g, ',').replace(/[^0-9,]/g, '');
    const parts = clean.split(sep);
    let intPart = (parts[0] || '').slice(0, 6);
    if (parts.length > 1) {
      let decPart = parts.slice(1).join('').slice(0, 4);
      setInputValue(`${intPart}${sep}${decPart}`);
      return;
    }
    setInputValue(intPart);
  };

  const parseVal = (str) => {
    if (!str) return 0;
    const clean = str.replace(/\s+/g, '').replace(',', '.');
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  };

  const num = parseVal(inputValue);

  let lowerBound = 0;
  let upperBound = 0;
  let roundedValue = 0;
  let placeName = '';
  let keyDigit = 0;
  let precisionDigits = 0;

  switch (roundPlace) {
    case 'hundreds':
      placeName = t.places.hundreds;
      lowerBound = Math.floor(num / 100) * 100;
      upperBound = lowerBound + 100;
      roundedValue = Math.round(num / 100) * 100;
      keyDigit = Math.floor((num % 100) / 10);
      precisionDigits = 0;
      break;
    case 'tens':
      placeName = t.places.tens;
      lowerBound = Math.floor(num / 10) * 10;
      upperBound = lowerBound + 10;
      roundedValue = Math.round(num / 10) * 10;
      keyDigit = Math.floor(num % 10);
      precisionDigits = 0;
      break;
    case 'units':
      placeName = t.places.units;
      lowerBound = Math.floor(num);
      upperBound = lowerBound + 1;
      roundedValue = Math.round(num);
      keyDigit = Math.floor((num * 10) % 10);
      precisionDigits = 0;
      break;
    case 'tenths':
      placeName = t.places.tenths;
      lowerBound = Math.floor(num * 10) / 10;
      upperBound = parseFloat((lowerBound + 0.1).toFixed(1));
      roundedValue = parseFloat((Math.round(num * 10) / 10).toFixed(1));
      keyDigit = Math.floor((num * 100) % 10);
      precisionDigits = 1;
      break;
    case 'hundredths':
      placeName = t.places.hundredths;
      lowerBound = Math.floor(num * 100) / 100;
      upperBound = parseFloat((lowerBound + 0.01).toFixed(2));
      roundedValue = parseFloat((Math.round(num * 100) / 100).toFixed(2));
      keyDigit = Math.floor((num * 1000) % 10);
      precisionDigits = 2;
      break;
    case 'thousandths':
      placeName = t.places.thousandths;
      lowerBound = Math.floor(num * 1000) / 1000;
      upperBound = parseFloat((lowerBound + 0.001).toFixed(3));
      roundedValue = parseFloat((Math.round(num * 1000) / 1000).toFixed(3));
      keyDigit = Math.floor((num * 10000) % 10);
      precisionDigits = 3;
      break;
    default:
      break;
  }

  keyDigit = Math.abs(keyDigit);

  const range = upperBound - lowerBound;
  let percentage = range > 0 ? ((num - lowerBound) / range) * 100 : 0;
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  const isUp = keyDigit >= 5;

  const formatWithComma = (val, prec) => {
    const formatted = val.toFixed(prec);
    return isEn ? formatted : formatted.replace('.', ',');
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/12-stroggilopoiisi-ask"
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
              href="/st-dimotikou/12-stroggilopoiisi-ask"
              locale={locale}
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
            {t.cards.map((card, idx) => (
              <article key={idx} className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                      {card.badge}
                    </span>
                    <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{card.sub}</span>
                  </div>
                  <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                    {card.body}
                  </p>

                  <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                    <p>{card.example}</p>
                  </div>
                </div>

                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                  {card.tip}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗΣ */}
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

            {/* PRESETS */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {t.presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputValue(preset.val);
                    setRoundPlace(preset.place);
                  }}
                  className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs sm:text-sm font-bold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 transition shadow-sm touch-manipulation active:scale-95 cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: CONTROLS & PLACE SELECTOR (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    {t.inputLabel}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-wide"
                    placeholder="432.658"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    {t.selectPlaceLabel}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRoundPlace('hundreds')}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all text-left truncate touch-manipulation active:scale-95 cursor-pointer ${
                        roundPlace === 'hundreds' ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      💯 {t.places.hundreds}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoundPlace('tens')}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all text-left truncate touch-manipulation active:scale-95 cursor-pointer ${
                        roundPlace === 'tens' ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      📦 {t.places.tens}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoundPlace('units')}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all text-left truncate touch-manipulation active:scale-95 cursor-pointer ${
                        roundPlace === 'units' ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      🎯 {t.places.units}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoundPlace('tenths')}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all text-left truncate touch-manipulation active:scale-95 cursor-pointer ${
                        roundPlace === 'tenths' ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      🧪 {t.places.tenths}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoundPlace('hundredths')}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all text-left truncate touch-manipulation active:scale-95 cursor-pointer ${
                        roundPlace === 'hundredths' ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      🔍 {t.places.hundredths}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoundPlace('thousandths')}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all text-left truncate touch-manipulation active:scale-95 cursor-pointer ${
                        roundPlace === 'thousandths' ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      📐 {t.places.thousandths}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                {t.ruleTip}
              </div>
            </div>

            {/* RIGHT: NUMBER LINE & VISUAL ANALYSIS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-[420px] sm:min-h-[460px]">
              
              <div className="w-full text-center mb-4">
                <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                  {t.visualTitle}
                </span>
                <div className="text-base sm:text-lg md:text-xl font-bold text-slate-700 mt-1">
                  {t.whereIsLabel} <span className="font-mono font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-xl border border-blue-200">{inputValue || '0'}</span>;
                </div>
              </div>

              {/* NUMBER LINE CONTAINER */}
              <div className="w-full max-w-xl mx-auto my-auto py-10 sm:py-12 px-4 sm:px-6">
                <div className="h-3 bg-gradient-to-r from-rose-200 via-amber-200 to-emerald-200 rounded-full relative shadow-inner">
                  
                  {/* Lower Bound */}
                  <div className="absolute left-0 -top-8 text-center -translate-x-1/2">
                    <span className="block font-mono font-black text-slate-700 text-xs md:text-sm whitespace-nowrap">
                      {formatWithComma(lowerBound, precisionDigits)}
                    </span>
                  </div>
                  <div className="absolute left-0 top-4 text-center -translate-x-1/2 mt-1">
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tight whitespace-nowrap">
                      {t.lowerLimitLabel}
                    </span>
                  </div>

                  {/* Upper Bound */}
                  <div className="absolute right-0 -top-8 text-center translate-x-1/2">
                    <span className="block font-mono font-black text-slate-700 text-xs md:text-sm whitespace-nowrap">
                      {formatWithComma(upperBound, precisionDigits)}
                    </span>
                  </div>
                  <div className="absolute right-0 top-4 text-center translate-x-1/2 mt-1">
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tight whitespace-nowrap">
                      {t.upperLimitLabel}
                    </span>
                  </div>

                  {/* Midpoint (5 threshold) */}
                  <div className="absolute left-1/2 top-0 h-5 w-0.5 bg-slate-400 -translate-y-1">
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                      {formatWithComma((lowerBound + upperBound) / 2, precisionDigits + 1)}
                    </span>
                  </div>

                  {/* Current Number Needle */}
                  <div 
                    className="absolute -top-5 -translate-x-1/2 transition-all duration-300 ease-out flex flex-col items-center z-10"
                    style={{ left: `${percentage}%` }}
                  >
                    <span className="bg-blue-600 text-white text-[11px] sm:text-xs font-mono font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shadow-md whitespace-nowrap">
                      {inputValue || '0'}
                    </span>
                    <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-blue-600 rounded-full border-2 border-white shadow mt-1"></div>
                  </div>

                </div>

                {/* Info Breakdown Banner */}
                <div className="mt-14 sm:mt-16 flex flex-col sm:flex-row justify-between items-center w-full bg-slate-50 rounded-2xl p-3.5 sm:p-4 border border-slate-200 font-medium gap-3 sm:gap-2">
                  <div className="text-center sm:text-left space-y-1">
                    <span className="text-[10px] sm:text-xs uppercase text-slate-400 font-black block">
                      {t.keyDigitLabel}
                    </span>
                    <span className={`text-sm sm:text-base font-black font-mono ${isUp ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg' : 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg'}`}>
                      {isNaN(keyDigit) ? 0 : keyDigit}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center text-center">
                    <span className={`text-xs sm:text-sm font-black px-3 py-1 rounded-full uppercase tracking-wider ${isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {isUp ? t.roundUpLabel : t.roundDownLabel}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-500 mt-1">
                      {isUp ? t.reasonUp : t.reasonDown}
                    </span>
                  </div>

                  <div className="text-center sm:text-right space-y-1">
                    <span className="text-[10px] sm:text-xs uppercase text-slate-400 font-black block">
                      {t.roundedToLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-700">
                      {placeName}
                    </span>
                  </div>
                </div>
              </div>

              {/* FINAL RESULT BADGE */}
              <div className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3.5 sm:p-4 rounded-2xl text-center shadow-lg font-mono font-black flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-xl">🎯</span>
                <span className="text-xs md:text-sm font-sans uppercase tracking-wider">{t.finalValueLabel}</span>
                <span className="text-xl sm:text-2xl bg-white/20 px-3 sm:px-4 py-1 rounded-xl shadow-inner">
                  {formatWithComma(roundedValue, precisionDigits)}
                </span>
              </div>

              <div className="w-full flex justify-center text-[11px] sm:text-xs font-bold text-slate-400 pt-4 border-t border-slate-100 mt-6 text-center">
                <span>{t.finalFooterNote}</span>
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
            href="/st-dimotikou/12-stroggilopoiisi-ask"
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
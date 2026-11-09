import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const TRANSLATIONS = {
  el: {
    pageTitle: "Φυσικοί Αριθμοί και Αξία Θέσης - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθε πώς οργανώνουμε τους μεγάλους αριθμούς σε Περιόδους και Τάξεις για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    exercisesBtn: "🎯 Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 1 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Φυσικοί Αριθμοί & Αξία Θέσης Ψηφίου",
    heroDesc: "Μάθε πώς οργανώνουμε τους μεγάλους αριθμούς σε Περιόδους (τριάδες) και Τάξεις, και ανακάλυψε πώς η θέση κάθε ψηφίου καθορίζει τη συνολική του αξία!",
    heroPills: "Περίοδοι, Τάξεις & Αναλυτική Μορφή Δυνάμεων του 10",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες σε 3 Βήματα",
    theorySubtitle: "Η δομή, η οργάνωση και η αξία θέσης των φυσικών αριθμών.",
    steps: [
      {
        badge: "ΒΗΜΑ 1",
        sub: "Ορισμός",
        title: "Τι είναι οι Φυσικοί;",
        body: "Φυσικοί αριθμοί είναι οι αριθμοί 0, 1, 2, 3... που χρησιμοποιούμε για να μετράμε. Δεν έχουν τέλος (είναι άπειροι).",
        ruleTitle: "📌 Βασικός Κανόνας:",
        ruleBody: "Κάθε φυσικός αριθμός έχει έναν επόμενο (＋1) και έναν προηγούμενο (－1) εκτός από το 0.",
        tip: "💡 Το σύνολο των φυσικών αριθμών συμβολίζεται με το γράμμα Ν."
      },
      {
        badge: "ΒΗΜΑ 2",
        sub: "Οργάνωση",
        title: "Περίοδοι & Τάξεις",
        body: "Για να διαβάζουμε εύκολα τους μεγάλους αριθμούς, τους χωρίζουμε από δεξιά προς τα αριστερά σε τριάδες (Περιόδους).",
        ruleTitle: "🗂️ Οι 4 Βασικές Περίοδοι:",
        periods: ["Δισεκατομμύρια", "Εκατομμύρια", "Χιλιάδες", "Μονάδες"],
        tip: "⚡ Κάθε περίοδος αποτελείται πάντα από 3 τάξεις: Μονάδες, Δεκάδες, Εκατοντάδες."
      },
      {
        badge: "ΒΗΜΑ 3",
        sub: "Αξία Θέσης",
        title: "Αξία Θέσης Ψηφίου",
        body: "Η αξία ενός ψηφίου εξαρτάται από τη θέση του. Κάθε θέση προς τα αριστερά έχει 10 φορές μεγαλύτερη αξία από την προηγούμενη!",
        ruleTitle: "💡 Παράδειγμα:",
        ruleBody: "Στο 5.500, το 1ο πέντε αξίζει 5.000 (Χιλιάδες), ενώ το 2ο αξίζει 500 (Εκατοντάδες).",
        tip: "🎯 Το δεκαδικό μας σύστημα αρίθμησης είναι θεσιακό σύστημα."
      }
    ],
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικός Αναλυτής Αξίας Θέσης & Περιόδων",
    labDesc: "Πληκτρολόγησε έναν αριθμό ή επίλεξε ένα παράδειγμα για να δεις την αυτόματη ανάλυσή του!",
    presets: [
      { label: "🇬🇷 Πληθυσμός Ελλάδας", value: "10482487" },
      { label: "🌕 Απόσταση Γης-Σελήνης (km)", value: "384400" },
      { label: "🌍 Ηλικία της Γης (έτη)", value: "4540000000" },
      { label: "⚡ Ταχύτητα Φωτός (m/s)", value: "299792458" }
    ],
    inputLabel: "ΠΛΗΚΤΡΟΛΟΓΗΣΕ ΑΡΙΘΜΟ (ΕΩΣ 12 ΨΗΦΙΑ):",
    inputPlaceholder: "Γράψε έναν αριθμό...",
    inputTip: "💡 Πάτησε σε ένα ψηφίο του πίνακα για να δεις την αξία του!",
    breakdownLabel: "ΠΩΣ ΔΙΑΒΑΖΕΤΑΙ ΑΝΑ ΠΕΡΙΟΔΟ:",
    zeroText: "Μηδέν",
    tableHeader: "🗂️ ΠΙΝΑΚΑΣ ΑΞΙΑΣ ΘΕΣΗΣ (12 ΨΗΦΙΑ)",
    classLabels: { H: "Ε", T: "Δ", U: "Μ" },
    expandedFormTitle: "🧬 ΠΛΗΡΗΣ ΑΝΑΛΥΤΙΚΗ ΜΟΡΦΗ (ΔΥΝΑΜΕΙΣ ΤΟΥ 10)",
    expandedFormBadge: "Πλήρης Εμφάνιση",
    chartTitle: "📊 ΥΨΟΣ ΨΗΦΙΟΥ (ΣΤΑΤΙΣΤΙΚΗ ΚΑΤΑΝΟΜΗ)",
    activeDigitsSuffix: "ενεργά ψηφία",
    chartLegendLeft: "⬅️ Μεγαλύτερη Αξία (Δισ.)",
    chartLegendRight: "Μικρότερη Αξία (Μον.) ➡️",
    footerText: "✨ Εκατοντάδες (Ε) • Δεκάδες (Δ) • Μονάδες (Μ) σε κάθε Περίοδο",
    ctaTitle: "Ώρα για Εξάσκηση στους Φυσικούς Αριθμούς!",
    ctaDesc: "Κατανόησες την αξία θέσης των φυσικών αριθμών; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "🎯 Έναρξη Ασκήσεων",
    periodUnits: {
      dis: "Δισεκατομμύρια",
      ekat: "Εκατομμύρια",
      xil: "Χιλιάδες",
      mon: "Μονάδες"
    }
  },
  en: {
    pageTitle: "Natural Numbers and Place Value - Grade 6 | LearnMaths.gr",
    pageDescription: "Learn how we organize large numbers into Periods and Classes for Grade 6 Mathematics.",
    backText: "Grade 6",
    exercisesBtn: "🎯 Exercises",
    badgeChapter: "CHAPTER 1 • GRADE 6",
    heroTitle: "Natural Numbers & Digit Place Value",
    heroDesc: "Learn how we organize large numbers into Periods (groups of three) and Classes, and discover how the position of each digit defines its total value!",
    heroPills: "Periods, Classes & Expanded Form in Powers of 10",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts in 3 Steps",
    theorySubtitle: "Structure, organization, and place value of natural numbers.",
    steps: [
      {
        badge: "STEP 1",
        sub: "Definition",
        title: "What are Natural Numbers?",
        body: "Natural numbers are the numbers 0, 1, 2, 3... used for counting. They are infinite and have no end.",
        ruleTitle: "📌 Core Rule:",
        ruleBody: "Every natural number has a successor (＋1) and a predecessor (－1), except 0.",
        tip: "💡 The set of natural numbers is denoted by the letter N."
      },
      {
        badge: "STEP 2",
        sub: "Organization",
        title: "Periods & Classes",
        body: "To read large numbers easily, we group digits from right to left into triads (Periods).",
        ruleTitle: "🗂️ The 4 Basic Periods:",
        periods: ["Billions", "Millions", "Thousands", "Units (Ones)"],
        tip: "⚡ Every period consists of 3 classes: Units, Tens, and Hundreds."
      },
      {
        badge: "STEP 3",
        sub: "Place Value",
        title: "Place Value of Digits",
        body: "The value of a digit depends on its position. Each step to the left represents 10 times the value of the previous position!",
        ruleTitle: "💡 Example:",
        ruleBody: "In 5,500, the first 5 is worth 5,000 (Thousands), while the second 5 is worth 500 (Hundreds).",
        tip: "🎯 Our decimal number system is a positional base-10 system."
      }
    ],
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Place Value & Period Analyzer",
    labDesc: "Type a number or choose a preset to explore its automated structural breakdown!",
    presets: [
      { label: "🇬🇷 Greece Population", value: "10482487" },
      { label: "🌕 Earth-Moon Distance (km)", value: "384400" },
      { label: "🌍 Age of the Earth (years)", value: "4540000000" },
      { label: "⚡ Speed of Light (m/s)", value: "299792458" }
    ],
    inputLabel: "TYPE A NUMBER (UP TO 12 DIGITS):",
    inputPlaceholder: "Enter a number...",
    inputTip: "💡 Tap any digit in the chart to inspect its exact value!",
    breakdownLabel: "HOW IT IS READ BY PERIOD:",
    zeroText: "Zero",
    tableHeader: "🗂️ PLACE VALUE TABLE (12 DIGITS)",
    classLabels: { H: "H", T: "T", U: "U" },
    expandedFormTitle: "🧬 COMPLETE EXPANDED FORM (POWERS OF 10)",
    expandedFormBadge: "Expanded View",
    chartTitle: "📊 DIGIT HEIGHT (DISTRIBUTION)",
    activeDigitsSuffix: "active digits",
    chartLegendLeft: "⬅️ Higher Value (Billions)",
    chartLegendRight: "Lower Value (Units) ➡️",
    footerText: "✨ Hundreds (H) • Tens (T) • Units (U) within each Period",
    ctaTitle: "Time to Practice Natural Numbers!",
    ctaDesc: "Mastered place value? Challenge yourself with 10 interactive questions designed to solidify your knowledge!",
    ctaBtn: "🎯 Start Exercises",
    periodUnits: {
      dis: "Billion",
      ekat: "Million",
      xil: "Thousand",
      mon: "Units"
    }
  }
};

export default function FysikoiArithmoiPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [number, setNumber] = useState('478456014574');
  const [activeDigitIndex, setActiveDigitIndex] = useState(1);

  const cleanNumber = number.replace(/\D/g, '').slice(0, 12);
  const padded = cleanNumber.padStart(12, '0');
  const digits = padded.split('');

  const periods = [
    { 
      name: locale === 'en' ? 'Billions' : 'Δισεκατομμύρια', 
      short: locale === 'en' ? 'Bil.' : 'Δισ.', 
      color: 'bg-purple-600', 
      light: 'bg-purple-50/70', 
      hex: '#9333ea', 
      border: 'border-purple-200', 
      text: 'text-purple-700' 
    },
    { 
      name: locale === 'en' ? 'Millions' : 'Εκατομμύρια', 
      short: locale === 'en' ? 'Mil.' : 'Εκατ.', 
      color: 'bg-rose-600', 
      light: 'bg-rose-50/70', 
      hex: '#e11d48', 
      border: 'border-rose-200', 
      text: 'text-rose-700' 
    },
    { 
      name: locale === 'en' ? 'Thousands' : 'Χιλιάδες', 
      short: locale === 'en' ? 'Thous.' : 'Χιλ.', 
      color: 'bg-blue-600', 
      light: 'bg-blue-50/70', 
      hex: '#2563eb', 
      border: 'border-blue-200', 
      text: 'text-blue-700' 
    },
    { 
      name: locale === 'en' ? 'Units' : 'Μονάδες', 
      short: locale === 'en' ? 'Units' : 'Μον.', 
      color: 'bg-emerald-600', 
      light: 'bg-emerald-50/70', 
      hex: '#059669', 
      border: 'border-emerald-200', 
      text: 'text-emerald-700' 
    },
  ];

  const getPeriodBreakdown = () => {
    if (!cleanNumber || cleanNumber === '0') return t.zeroText;
    const dis = parseInt(padded.slice(0, 3), 10);
    const ekat = parseInt(padded.slice(3, 6), 10);
    const xil = parseInt(padded.slice(6, 9), 10);
    const mon = parseInt(padded.slice(9, 12), 10);

    const formatNum = (n) => n.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
    const parts = [];
    if (dis > 0) parts.push(`${formatNum(dis)} ${t.periodUnits.dis}`);
    if (ekat > 0) parts.push(`${formatNum(ekat)} ${t.periodUnits.ekat}`);
    if (xil > 0) parts.push(`${formatNum(xil)} ${t.periodUnits.xil}`);
    if (mon > 0) parts.push(`${formatNum(mon)} ${t.periodUnits.mon}`);

    return parts.length > 0 ? parts.join(' • ') : '0';
  };

  const activeDigitsCount = digits.filter((d) => d !== '0').length;
  const firstNonZero = digits.findIndex((d) => d !== '0');

  const calculateBarHeight = (digit, index) => {
    const val = parseInt(digit, 10);
    const isLeadingZero = digit === '0' && index < firstNonZero;
    if (val === 0 || isLeadingZero) return 0;
    return 12 + (val - 1) * 11;
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
          href="/st-dimotikou/01-fysikoi-ask"
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
              href="/st-dimotikou/01-fysikoi-ask"
              locale={locale}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ */}
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
            {/* Step 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.steps[0].badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.steps[0].sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.steps[0].title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.steps[0].body}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1">
                  <span className="font-bold text-blue-900 block">{t.steps[0].ruleTitle}</span>
                  <p className="text-slate-600 text-[11px] sm:text-xs leading-normal">
                    {t.steps[0].ruleBody}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.steps[0].tip}
              </div>
            </article>

            {/* Step 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.steps[1].badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.steps[1].sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.steps[1].title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.steps[1].body}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5">
                  <span className="font-bold text-indigo-900 block">{t.steps[1].ruleTitle}</span>
                  <ul className="grid grid-cols-2 gap-1 font-semibold text-[11px] pt-1">
                    <li className="text-purple-700">{t.steps[1].periods[0]}</li>
                    <li className="text-rose-700">{t.steps[1].periods[1]}</li>
                    <li className="text-blue-700">{t.steps[1].periods[2]}</li>
                    <li className="text-emerald-700">{t.steps[1].periods[3]}</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {t.steps[1].tip}
              </div>
            </article>

            {/* Step 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.steps[2].badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.steps[2].sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.steps[2].title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.steps[2].body}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1">
                  <span className="font-bold text-amber-900 block">{t.steps[2].ruleTitle}</span>
                  <p className="text-slate-600 text-[11px] sm:text-xs leading-normal">
                    {t.steps[2].ruleBody}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.steps[2].tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΑΞΙΑΣ ΘΕΣΗΣ */}
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

            {/* PRESET BUTTONS */}
            <div className="flex flex-wrap gap-2">
              {t.presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setNumber(preset.value);
                    setActiveDigitIndex(null);
                  }}
                  className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs 2xl:text-sm font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 transition shadow-sm touch-manipulation active:scale-95"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* ROW 1: INPUT & READING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
              <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3 shadow-inner flex flex-col justify-center">
                <label className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                  {t.inputLabel}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={12}
                  value={number}
                  onChange={(e) => {
                    const cleanInput = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                    setNumber(cleanInput);
                    setActiveDigitIndex(null);
                  }}
                  className="text-xl sm:text-2xl md:text-3xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all w-full tracking-wider text-blue-600 font-mono"
                  placeholder={t.inputPlaceholder}
                />
                <p className="text-[11px] sm:text-xs text-slate-400 text-center font-medium">
                  {t.inputTip}
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl space-y-2 shadow-md flex flex-col justify-center">
                <span className="text-[11px] sm:text-xs font-black text-amber-400 tracking-wider block flex items-center gap-1.5 uppercase">
                  <span>🗣️</span> {t.breakdownLabel}
                </span>
                <p className="text-sm sm:text-base md:text-lg 2xl:text-xl font-bold text-slate-100 leading-snug break-words">
                  {getPeriodBreakdown()}
                </p>
              </div>
            </div>

            {/* ROW 2: ΠΙΝΑΚΑΣ ΑΞΙΑΣ ΘΕΣΗΣ */}
            <div className="bg-slate-50 border border-slate-200 p-2 sm:p-5 md:p-6 rounded-2xl space-y-4 sm:space-y-6">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-600 uppercase tracking-wider">
                    {t.tableHeader}
                  </span>
                </div>

                {/* ΠΡΟΒΟΛΗ ΚΙΝΗΤΟΥ (<640px) */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:hidden">
                  {periods.map((p, pIdx) => {
                    const pDigits = [digits[pIdx * 3], digits[pIdx * 3 + 1], digits[pIdx * 3 + 2]];
                    return (
                      <div key={`m-period-${pIdx}`} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                        <div className={`${p.color} text-white text-center font-black text-[11px] py-1`}>
                          {p.name}
                        </div>
                        <div className="grid grid-cols-3 text-[9px] font-black text-slate-400 text-center bg-slate-50 border-b py-0.5">
                          <div>{t.classLabels.H}</div>
                          <div>{t.classLabels.T}</div>
                          <div>{t.classLabels.U}</div>
                        </div>
                        <div className="grid grid-cols-3 p-1 gap-1 text-center">
                          {pDigits.map((d, dIdx) => {
                            const globalIdx = pIdx * 3 + dIdx;
                            const isLeadingZero = d === '0' && globalIdx < firstNonZero;
                            const isSelected = activeDigitIndex === globalIdx;

                            return (
                              <button
                                key={`m-d-${globalIdx}`}
                                type="button"
                                onClick={() => setActiveDigitIndex(globalIdx)}
                                className={`py-2 text-base font-black rounded-lg font-mono transition-colors border ${
                                  isSelected
                                    ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm'
                                    : 'bg-slate-50 border-transparent hover:bg-amber-50'
                                } ${isLeadingZero && !isSelected ? 'text-slate-300' : isSelected ? 'text-slate-900' : 'text-slate-800'}`}
                              >
                                {d}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ΠΡΟΒΟΛΗ DESKTOP/TABLET (>=640px) */}
                <div className="hidden sm:block w-full border border-slate-200/80 rounded-2xl bg-white shadow-sm overflow-hidden">
                  <div className="grid grid-cols-4 text-white text-center font-black text-xs sm:text-sm tracking-wider">
                    {periods.map((p, i) => (
                      <div key={i} className={`${p.color} py-2.5 sm:py-3 border-r border-white/20 last:border-0`}>
                        <span>{p.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-12 text-[10px] sm:text-xs font-black text-slate-500 text-center border-b bg-slate-100 uppercase py-2">
                    {[...Array(4)].map((_, i) => (
                      <span key={i} className="contents">
                        <div className="border-r border-slate-200">{t.classLabels.H}</div>
                        <div className="border-r border-slate-200">{t.classLabels.T}</div>
                        <div className="border-r border-slate-200">{t.classLabels.U}</div>
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-12 text-center items-center p-2 bg-white gap-1">
                    {digits.map((digit, i) => {
                      const periodIdx = Math.floor(i / 3);
                      const isLeadingZero = digit === '0' && i < firstNonZero;
                      const isSelected = activeDigitIndex === i;

                      return (
                        <div key={i} className="px-0.5">
                          <button
                            type="button"
                            onClick={() => setActiveDigitIndex(i)}
                            onMouseEnter={() => setActiveDigitIndex(i)}
                            className={`w-full py-3 sm:py-4 text-lg sm:text-2xl font-black rounded-xl transition-colors duration-150 focus:outline-none font-mono flex items-center justify-center border-2 box-border touch-manipulation
                              ${periods[periodIdx].light}
                              ${isSelected 
                                ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm' 
                                : 'border-transparent hover:bg-amber-100/70 hover:border-amber-300'}
                              ${isLeadingZero && !isSelected ? 'text-slate-300' : isSelected ? 'text-slate-900' : 'text-slate-800'}`}
                          >
                            {digit}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ΠΛΗΡΗΣ ΑΝΑΛΥΤΙΚΗ ΜΟΡΦΗ */}
              <div className="bg-white border border-slate-200 p-3 sm:p-5 rounded-2xl font-mono text-xs sm:text-sm space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider block font-sans">
                    {t.expandedFormTitle}
                  </span>
                  <span className="text-[10px] sm:text-xs font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {t.expandedFormBadge}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
                  {digits.map((digit, i) => {
                    if (digit === '0') return null;
                    const power = 11 - i;
                    const multiplier = Math.pow(10, power).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
                    const totalVal = (parseInt(digit, 10) * Math.pow(10, power)).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
                    const isSelected = activeDigitIndex === i;

                    return (
                      <div
                        key={i}
                        onMouseEnter={() => setActiveDigitIndex(i)}
                        onClick={() => setActiveDigitIndex(i)}
                        className={`flex flex-wrap sm:flex-nowrap items-center justify-between p-2 sm:p-2.5 rounded-xl border-2 box-border transition-colors cursor-pointer gap-1 sm:gap-2 touch-manipulation ${
                          isSelected 
                            ? 'bg-amber-50 border-amber-400 shadow-sm' 
                            : 'bg-slate-50/70 border-transparent hover:bg-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 flex-wrap text-xs sm:text-sm">
                          <span className="text-emerald-600 font-black">{digit}</span>
                          <span className="text-slate-400">·</span>
                          <span className="font-bold text-slate-800 break-all">{multiplier}</span>
                        </div>
                        <div className="sm:text-right text-left">
                          <span className="text-slate-500 font-bold text-[11px] sm:text-xs block break-all">
                            ＝ {totalVal}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center text-xs 2xl:text-sm font-bold text-slate-400 pt-1">
                <span>{t.footerText}</span>
              </div>
            </div>

            {/* ROW 3: ΟΠΤΙΚΟ ΓΡΑΦΗΜΑ ΡΑΒΔΩΝ - 100% RESPONSIVE / FLUID ΣΕ ΚΑΘΕ ΟΘΟΝΗ */}
            <div className="bg-white border border-slate-200 p-3 sm:p-5 rounded-2xl space-y-3 shadow-sm w-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5 uppercase">
                  {t.chartTitle}
                </span>
                <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full shrink-0">
                  {activeDigitsCount} {t.activeDigitsSuffix}
                </span>
              </div>

              {/* Στατικό Floating Tooltip πάνω από το γράφημα για να μην πετάγεται εκτός οθόνης */}
              {activeDigitIndex !== null && digits[activeDigitIndex] !== '0' && (
                <div className="flex items-center justify-center">
                  <div className="bg-slate-900 text-amber-300 text-[11px] sm:text-xs font-mono font-bold px-3 py-1 rounded-full shadow-md text-center max-w-full truncate">
                    {(parseInt(digits[activeDigitIndex], 10) * Math.pow(10, 11 - activeDigitIndex)).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR')}
                  </div>
                </div>
              )}

              {/* Container Ραβδογράμματος: min-w-0 και w-full για αποφυγή horizontal scrollbar */}
              <div className="w-full bg-slate-50 rounded-xl border border-slate-100 pt-6 sm:pt-10 pb-2 px-1 sm:px-3 overflow-hidden">
                <div className="grid grid-cols-12 gap-0.5 sm:gap-1.5 h-36 sm:h-52 border-b-2 border-slate-200 pb-0 items-end w-full">
                  {digits.map((digit, i) => {
                    const periodIdx = Math.floor(i / 3);
                    const power = 11 - i;
                    const val = parseInt(digit, 10);
                    const isLeadingZero = digit === '0' && i < firstNonZero;
                    const hasValue = val > 0 && !isLeadingZero;
                    const barHeightPercent = calculateBarHeight(digit, i);
                    const isSelected = activeDigitIndex === i;

                    return (
                      <div
                        key={i}
                        onMouseEnter={() => { if (hasValue) setActiveDigitIndex(i); }}
                        onClick={() => { if (hasValue) setActiveDigitIndex(i); }}
                        className={`flex flex-col items-center justify-end h-full min-w-0 w-full touch-manipulation ${
                          hasValue ? 'cursor-pointer' : 'cursor-default'
                        }`}
                      >
                        {/* Ψηφίο */}
                        <span className={`text-[9px] sm:text-xs font-black mb-0.5 sm:mb-1 truncate ${
                          hasValue ? 'text-slate-700' : 'text-transparent'
                        }`}>
                          {hasValue ? digit : '·'}
                        </span>

                        {/* Η ράβδος: shrink-to-fit χωρίς σταθερά px ώστε να συμπιέζεται ομαλά στα 320px */}
                        <div className="w-full h-24 sm:h-36 flex items-end justify-center">
                          {hasValue ? (
                            <div
                              style={{ 
                                height: `${barHeightPercent}%`,
                                backgroundColor: periods[periodIdx].hex 
                              }}
                              className={`w-full max-w-[18px] sm:max-w-[28px] rounded-t sm:rounded-t-lg transition-all duration-150 ${
                                isSelected ? 'ring-2 sm:ring-4 ring-amber-400 brightness-110 shadow-sm' : 'opacity-90'
                              }`}
                            />
                          ) : (
                            <div className="w-full h-[2px] bg-slate-200" />
                          )}
                        </div>

                        {/* Εκθέτης: Στα κινητά δείχνει μόνο τον αριθμό του εκθέτη (^11 -> 11) για να χωράει τέλεια */}
                        <span className="text-[7px] sm:text-[9px] font-mono font-bold text-slate-400 mt-1 truncate leading-none">
                          <span className="hidden sm:inline">10^</span>
                          <span>{power}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Υπόμνημα: flex-col σε στενές οθόνες για να μην επικαλύπτονται τα κείμενα */}
              <div className="flex flex-col xs:flex-row justify-between items-center text-[10px] sm:text-xs text-slate-400 font-semibold gap-1 px-1 pt-1">
                <span>{t.chartLegendLeft}</span>
                <span>{t.chartLegendRight}</span>
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
            href="/st-dimotikou/01-fysikoi-ask"
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
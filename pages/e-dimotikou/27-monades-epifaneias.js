// pages/e-dimotikou/27-monades-epifaneias.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Ε')/g);
  return parts
    .map((part) => {
      if (part === "Ε'") return "Ε'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function Fraction({ numerator, denominator, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-mono leading-none ${className}`}>
      <span className="px-1 text-[0.9em] border-b-2 border-current pb-0.5 w-full block">
        {numerator}
      </span>
      <span className="px-1 text-[0.9em] pt-0.5 w-full block">
        {denominator}
      </span>
    </span>
  );
}

const translations = {
  el: {
    pageTitle: "Μονάδες Επιφάνειας - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθετε πώς μετατρέπουμε μονάδες μέτρησης επιφάνειας (m², dm², cm², mm²), γιατί κάθε σκαλοπάτι αξίζει 100, και εξερευνήστε το διαδραστικό πλέγμα του 1 m².",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 27 • Ε' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Μονάδες Μέτρησης Επιφάνειας",
    heroSubtitle: "Ανακαλύπτουμε το τετραγωνικό μέτρο (m²), τις υποδιαιρέσεις του (dm², cm², mm²) και τα πολλαπλάσιά του. Βλέπουμε οπτικά γιατί κάθε σκαλοπάτι στην επιφάνεια αξίζει 100 και μαθαίνουμε να κάνουμε αλάνθαστες μετατροπές.",
    theoryLiveStatus: "Θεωρία & Ζωντανός Αναλυτής Υποδιαιρέσεων 1 m²",
    tryExercises: "Δοκίμασε τις Ασκήσεις",
    keyConceptsTitle: "Βασικές Έννοιες σε 4 Βήματα",
    keyConceptsSubtitle: "Η γεωμετρική κλίμακα των μονάδων επιφάνειας και ο κανόνας του 100.",
    step1Badge: "ΒΗΜΑ 1",
    step1Category: "Βασική Μονάδα",
    step1Title: "Το Τετραγωνικό Μέτρο (m²)",
    step1Desc: "Βασική μονάδα μέτρησης επιφανειών είναι το τετραγωνικό μέτρο (m²), δηλαδή η επιφάνεια ενός τετραγώνου με πλευρά 1 m:",
    step1Formula: "1 m² ＝ 1 m · 1 m",
    step1Explanation: "Χρησιμοποιείται για να μετρήσουμε το μέγεθος ενός δωματίου, ενός διαμερίσματος ή μιας αυλής.",
    step1Tip: "💡 Το τετραγωνικό μέτρο γράφεται m² (με εκθέτη 2, επειδή μετράμε 2 διαστάσεις: μήκος και πλάτος).",
    step2Badge: "ΒΗΜΑ 2",
    step2Category: "Ο Κανόνας του 100",
    step2Title: "Γιατί κάθε βήμα είναι 100;",
    step2Desc: "Στο μήκος 1 m ＝ 10 dm. Στην επιφάνεια όμως έχουμε τετράγωνο:",
    step2Formula: "1 m² ＝ 10 dm · 10 dm ＝ 100 dm²",
    step2Explanation: "Επειδή πολλαπλασιάζουμε 10 σειρές επί 10 στήλες, κάθε σκαλοπάτι στην επιφάνεια είναι 100 φορές μεγαλύτερο ή μικρότερο (10 · 10 ＝ 100)!",
    step2TipPrefix: "⚡",
    step2TipLabel: "Κανόνας μνήμης:",
    step2TipText: "Στο μήκος πάμε ανά 10, στην επιφάνεια πάμε ανά 100!",
    step3Badge: "ΒΗΜΑ 3",
    step3Category: "Υποδιαιρέσεις",
    step3Title: "Οι Υποδιαιρέσεις του m²",
    step3Desc: "Για μικρότερες επιφάνειες χρησιμοποιούμε τις υποδιαιρέσεις:",
    step3Sub1: "1 m² ＝ 100 dm²",
    step3Sub1Action: "( · 100 )",
    step3Sub2: "1 dm² ＝ 100 cm²",
    step3Sub2Action: "( · 100 )",
    step3Sub3: "1 cm² ＝ 100 mm²",
    step3Sub3Action: "( · 100 )",
    step3Sub4: "1 m² ＝ 10.000 cm²",
    step3Sub4Action: "( · 10.000 )",
    step3FractionNote: "Κλασματική σχέση:",
    step3Tip: "🎯 Όταν κατεβαίνουμε 1 σκαλοπάτι πολλαπλασιάζουμε με 100. Όταν ανεβαίνουμε 1 σκαλοπάτι διαιρούμε με 100.",
    step4Badge: "ΒΗΜΑ 4",
    step4Category: "Μεγάλες Εκτάσεις",
    step4Title: "Το Στρέμμα & το km²",
    step4Desc: "Για αγροτεμάχια, χωράφια και πόλεις χρησιμοποιούμε μεγαλύτερες μονάδες:",
    step4StremmaTitle: "1 Στρέμμα ＝ 1.000 m²",
    step4StremmaDesc: "(Η πιο συνηθισμένη αγροτική μονάδα στην Ελλάδα).",
    step4KmTitle: "1 km² ＝ 1.000.000 m² ＝ 1.000 στρέμματα",
    step4KmDesc: "(Για εκτάσεις δήμων, νησιών και κρατών).",
    step4Tip: "🔍 Ένα χωράφι 5 στρεμμάτων έχει εμβαδόν: 5 · 1.000 ＝ 5.000 m²!",
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Προσομοίωση του 1 m² & Υποδιαιρέσεις",
    labDesc: "Σύρε τον δρομέα για να φωτίσεις από 1 έως 100 τετραγωνικά δεκατόμετρα (dm²). Παρατήρησε πώς μετατρέπονται αυτόματα σε m², cm² και mm², και δες τις 10.000 μικροσκοπικές υποδιαιρέσεις cm²!",
    dmLabel: "Τετραγωνικά δεκατόμετρα ( dm² ):",
    decreaseDmAria: "Μείωση κατά 5 dm²",
    increaseDmAria: "Αύξηση κατά 5 dm²",
    sliderDmAria: "Επιλογή τετραγωνικών δεκατομέτρων",
    equivalentAreasTitle: "ΙΣΟΔΥΝΑΜΕΣ ΕΠΙΦΑΝΕΙΕΣ",
    mathAnalysisTitle: "ΜΑΘΗΜΑΤΙΚΗ ΑΝΑΛΥΣΗ ΜΕΤΑΤΡΟΠΩΝ",
    visualTitle: "ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ: ΟΛΟΚΛΗΡΟ ΤΟ ΠΛΑΙΣΙΟ ＝ 1 m²",
    canvasUnitLabel: "1 dm²",
    gridCallout: "🟦 Το 1 m² αποτελείται από 100 dm², και καθένα από αυτά περιέχει 100 cm² (συνολικά 10.000 cm²)!",
    ctaTitle: "Ώρα για Εξάσκηση στις Μονάδες Επιφάνειας!",
    ctaSubtitle: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις μετατροπών, δεκαδικών υπολογισμών, στρεμμάτων και προβλημάτων καθημερινής ζωής με εκτάσεις.",
    ctaButton: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Units of Area - 5th Grade | LearnMaths.gr",
    pageDescription: "Learn how to convert surface area units (m², dm², cm², mm²), understand why each step multiplies or divides by 100, and explore the interactive 1 m² grid.",
    backText: "5th Grade",
    exercisesBtn: "Exercises",
    chapterBadge: "CHAPTER 27 • 5TH GRADE",
    heroTitle: "Units of Surface Area Measurement",
    heroSubtitle: "Discover the square meter (m²), its submultiples (dm², cm², mm²), and its multiples. Visually see why each unit step changes by a factor of 100 and learn flawless conversions.",
    theoryLiveStatus: "Theory & Live 1 m² Subdivisions Analyzer",
    tryExercises: "Try the Exercises",
    keyConceptsTitle: "Core Concepts in 4 Steps",
    keyConceptsSubtitle: "The geometric scale of area units and the rule of 100.",
    step1Badge: "STEP 1",
    step1Category: "Base Unit",
    step1Title: "The Square Meter (m²)",
    step1Desc: "The primary base unit for measuring area is the square meter (m²), representing the area of a square with sides of 1 m:",
    step1Formula: "1 m² ＝ 1 m · 1 m",
    step1Explanation: "It is widely used to measure the size of a room, an apartment, or a courtyard.",
    step1Tip: "💡 The square meter is written as m² (with an exponent of 2, because we measure two spatial dimensions: length and width).",
    step2Badge: "STEP 2",
    step2Category: "The Rule of 100",
    step2Title: "Why does each step equal 100?",
    step2Desc: "In linear measure, 1 m ＝ 10 dm. In 2D surface area, however, we have a square grid:",
    step2Formula: "1 m² ＝ 10 dm · 10 dm ＝ 100 dm²",
    step2Explanation: "Because we multiply 10 rows by 10 columns, each step on the area scale is 100 times larger or smaller (10 · 10 ＝ 100)!",
    step2TipPrefix: "⚡",
    step2TipLabel: "Memory rule:",
    step2TipText: "For length we move in tens, but for surface area we move in hundreds!",
    step3Badge: "STEP 3",
    step3Category: "Submultiples",
    step3Title: "Submultiples of the m²",
    step3Desc: "For smaller surface areas, we use submultiples:",
    step3Sub1: "1 m² ＝ 100 dm²",
    step3Sub1Action: "( · 100 )",
    step3Sub2: "1 dm² ＝ 100 cm²",
    step3Sub2Action: "( · 100 )",
    step3Sub3: "1 cm² ＝ 100 mm²",
    step3Sub3Action: "( · 100 )",
    step3Sub4: "1 m² ＝ 10,000 cm²",
    step3Sub4Action: "( · 10,000 )",
    step3FractionNote: "Fractional relation:",
    step3Tip: "🎯 Moving down 1 step: multiply by 100. Moving up 1 step: divide by 100.",
    step4Badge: "STEP 4",
    step4Category: "Large Land Areas",
    step4Title: "The Stremma & the km²",
    step4Desc: "For fields, farmland, and cities, larger land measurement units are used:",
    step4StremmaTitle: "1 Stremma (decare) ＝ 1,000 m²",
    step4StremmaDesc: "(The standard agricultural land unit in Greece).",
    step4KmTitle: "1 km² ＝ 1,000,000 m² ＝ 1,000 stremmata",
    step4KmDesc: "(Used for municipal, island, and regional areas).",
    step4Tip: "🔍 A field of 5 stremmata has an area of: 5 · 1,000 ＝ 5,000 m²!",
    labBadge: "INTERACTIVE LAB",
    labTitle: "1 m² Simulation & Area Subdivisions",
    labDesc: "Drag the slider to highlight between 1 and 100 square decimeters (dm²). See how they dynamically convert into m², cm², and mm², and inspect the 10,000 microscopic cm² subdivisions!",
    dmLabel: "Square decimeters ( dm² ):",
    decreaseDmAria: "Decrease by 5 dm²",
    increaseDmAria: "Increase by 5 dm²",
    sliderDmAria: "Select square decimeters",
    equivalentAreasTitle: "EQUIVALENT AREAS",
    mathAnalysisTitle: "MATHEMATICAL STEP ANALYSIS",
    visualTitle: "VISUAL REPRESENTATION: ENTIRE FRAME ＝ 1 m²",
    canvasUnitLabel: "1 dm²",
    gridCallout: "🟦 1 m² consists of 100 dm², and each of these contains 100 cm² (amounting to 10,000 cm² in total)!",
    ctaTitle: "Time to Practice Surface Area Units!",
    ctaSubtitle: "Put your skills to the test with unit conversions, decimal calculations, land measures, and real-life area estimation problems.",
    ctaButton: "Start Exercises"
  }
};

export default function MonadesEpifaneiasTheoryPage() {
  const router = useRouter();
  const currentLocale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = currentLocale === 'en';
  const t = translations[currentLocale];

  const [squareDecimeters, setSquareDecimeters] = useState(25);

  const currentM2 = squareDecimeters / 100;
  const currentCm2 = squareDecimeters * 100;
  const currentMm2 = squareDecimeters * 10000;

  const formatNumber = (num, minDec = 0, maxDec = 2) => {
    return num.toLocaleString(isEn ? 'en-US' : 'el-GR', {
      minimumFractionDigits: minDec,
      maximumFractionDigits: maxDec
    });
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/27-monades-epifaneias-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.exercisesBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 2xl:space-y-14">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.chapterBadge)}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.heroSubtitle}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.theoryLiveStatus}</span>
            </div>
            <Link
              href="/e-dimotikou/27-monades-epifaneias-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>{t.tryExercises}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.keyConceptsTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              {t.keyConceptsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-teal-100 text-teal-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step1Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-teal-950 shadow-inner">
                    {t.step1Formula}
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    {t.step1Explanation}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 text-xs 2xl:text-sm text-teal-950 font-medium">
                {t.step1Tip}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step2Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-blue-950 shadow-inner">
                    {t.step2Formula}
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    {t.step2Explanation}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-xs 2xl:text-sm text-blue-950 font-medium">
                {t.step2TipPrefix} <strong>{t.step2TipLabel}</strong> {t.step2TipText}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Desc}
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm font-mono">
                  <div className="flex justify-between items-center p-1.5 bg-white rounded-lg border border-slate-200">
                    <span>{t.step3Sub1}</span>
                    <span className="text-slate-500">{t.step3Sub1Action}</span>
                  </div>
                  <div className="flex justify-between items-center p-1.5 bg-white rounded-lg border border-slate-200">
                    <span>{t.step3Sub2}</span>
                    <span className="text-slate-500">{t.step3Sub2Action}</span>
                  </div>
                  <div className="flex justify-between items-center p-1.5 bg-white rounded-lg border border-slate-200">
                    <span>{t.step3Sub3}</span>
                    <span className="text-slate-500">{t.step3Sub3Action}</span>
                  </div>
                  <div className="flex justify-between items-center p-1.5 bg-amber-50 rounded-lg border border-amber-200 font-bold text-amber-950">
                    <span>{t.step3Sub4}</span>
                    <span>{t.step3Sub4Action}</span>
                  </div>
                </div>

                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 flex items-center justify-center gap-1.5">
                  <span className="font-sans text-slate-500">{t.step3FractionNote}</span>
                  <span>1 dm² ＝</span>
                  <Fraction numerator="1" denominator="100" className="text-xs font-bold" />
                  <span>m²</span>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Desc}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>{t.step4StremmaTitle}</strong><br />
                    <span className="text-xs font-sans text-purple-800">{t.step4StremmaDesc}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                    • <strong>{t.step4KmTitle}</strong><br />
                    <span className="text-xs font-sans text-slate-600">{t.step4KmDesc}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΜΟΝΑΔΩΝ ΕΠΙΦΑΝΕΙΑΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {toCleanUppercase(t.labBadge)}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.labDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Αριστερή Στήλη: Χειριστήρια & Πίνακας Μετατροπών */}
            <div className="lg:col-span-6 2xl:col-span-6 space-y-6 bg-slate-50 p-4 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Stepper dm² */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-800">
                      {t.dmLabel}
                    </span>
                    <span className="shrink-0 whitespace-nowrap font-mono font-black text-base sm:text-xl text-blue-600 bg-white px-2.5 py-1 rounded-xl border border-blue-200 shadow-xs">
                      {squareDecimeters} / 100
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      aria-label={t.decreaseDmAria}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSquareDecimeters((prev) => Math.max(1, prev - 5));
                      }}
                      disabled={squareDecimeters <= 1}
                      className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={squareDecimeters}
                      onChange={(e) => setSquareDecimeters(Number(e.target.value))}
                      aria-label={t.sliderDmAria}
                      className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                    />

                    <button
                      type="button"
                      aria-label={t.increaseDmAria}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSquareDecimeters((prev) => Math.min(100, prev + 5));
                      }}
                      disabled={squareDecimeters >= 100}
                      className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                    >
                      ＋
                    </button>
                  </div>

                  {/* Γρήγορα κουμπιά επιλογής */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                    {[1, 25, 50, 75, 100].map((val) => (
                      <button
                        key={`btn-dm-${val}`}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSquareDecimeters(val);
                        }}
                        className={`text-xs font-mono px-2.5 sm:px-3 py-1 rounded-lg font-semibold transition ${
                          squareDecimeters === val
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {val} dm²
                      </button>
                    ))}
                  </div>
                </div>

                {/* Πλέγμα Καρτών Μετατροπών */}
                <div>
                  <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500 uppercase mb-2.5">
                    {toCleanUppercase(t.equivalentAreasTitle)}
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="bg-white border-2 border-teal-500/30 rounded-2xl p-3 sm:p-4 shadow-xs overflow-hidden">
                      <span className="text-[11px] sm:text-xs font-black text-teal-700 uppercase block truncate">
                        🏠 m²
                      </span>
                      <div className="text-sm min-[380px]:text-base sm:text-xl font-mono font-black text-slate-900 mt-1 truncate">
                        {formatNumber(currentM2, 2, 2)}
                      </div>
                    </div>

                    <div className="bg-white border-2 border-blue-500/30 rounded-2xl p-3 sm:p-4 shadow-xs overflow-hidden">
                      <span className="text-[11px] sm:text-xs font-black text-blue-700 uppercase block truncate">
                        🟩 dm²
                      </span>
                      <div className="text-sm min-[380px]:text-base sm:text-xl font-mono font-black text-slate-900 mt-1 truncate">
                        {formatNumber(squareDecimeters, 0, 0)}
                      </div>
                    </div>

                    <div className="bg-white border-2 border-amber-500/30 rounded-2xl p-3 sm:p-4 shadow-xs overflow-hidden">
                      <span className="text-[11px] sm:text-xs font-black text-amber-700 uppercase block truncate">
                        📏 cm²
                      </span>
                      <div className="text-sm min-[380px]:text-base sm:text-xl font-mono font-black text-slate-900 mt-1 truncate">
                        {formatNumber(currentCm2, 0, 0)}
                      </div>
                    </div>

                    <div className="bg-white border-2 border-rose-500/30 rounded-2xl p-3 sm:p-4 shadow-xs overflow-hidden">
                      <span className="text-[11px] sm:text-xs font-black text-rose-700 uppercase block truncate">
                        🔍 mm²
                      </span>
                      <div className="text-sm min-[380px]:text-base sm:text-xl font-mono font-black text-slate-900 mt-1 truncate">
                        {formatNumber(currentMm2, 0, 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Βήμα-βήμα ανάλυση υπολογισμών */}
              <div className="bg-emerald-50 text-slate-900 p-3.5 sm:p-5 rounded-2xl border border-emerald-200 space-y-2.5 shadow-xs mt-4">
                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">
                  {toCleanUppercase(t.mathAnalysisTitle)}
                </span>
                <div className="space-y-2 font-mono text-[11px] min-[360px]:text-xs sm:text-sm text-emerald-950">
                  <div className="flex items-center justify-between gap-1 border-b border-emerald-200/60 pb-1.5">
                    <span className="whitespace-nowrap">{squareDecimeters} dm² ： 100 ＝</span>
                    <strong className="font-bold text-teal-800 whitespace-nowrap">{formatNumber(currentM2, 2, 2)} m²</strong>
                  </div>
                  <div className="flex items-center justify-between gap-1 border-b border-emerald-200/60 pb-1.5">
                    <span className="whitespace-nowrap">{squareDecimeters} dm² · 100 ＝</span>
                    <strong className="font-bold text-amber-800 whitespace-nowrap">{formatNumber(currentCm2, 0, 0)} cm²</strong>
                  </div>
                  <div className="flex items-center justify-between gap-1 pb-0.5">
                    <span className="whitespace-nowrap">{formatNumber(currentCm2, 0, 0)} cm² · 100 ＝</span>
                    <strong className="font-bold text-rose-800 whitespace-nowrap">{formatNumber(currentMm2, 0, 0)} mm²</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Πλέγμα 1 m² */}
            <div className="lg:col-span-6 2xl:col-span-6 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-between space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.visualTitle)}</span>
                <span className="font-mono text-blue-600 font-bold">{squareDecimeters} dm²</span>
              </div>

              {/* SVG Canvas 1 m² (10x10 dm² πλέγμα) */}
              <div className="w-full max-w-[400px] aspect-square bg-white p-3 rounded-2xl border-2 border-slate-300 shadow-inner flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  <defs>
                    <pattern id="cmGrid" width="4" height="4" patternUnits="userSpaceOnUse">
                      <rect width="4" height="4" fill="none" stroke="#f1f5f9" strokeWidth="0.5" />
                    </pattern>
                  </defs>

                  {/* 100 τετράγωνα dm² */}
                  {[...Array(100)].map((_, i) => {
                    const row = Math.floor(i / 10);
                    const col = i % 10;
                    const x = col * 40;
                    const y = row * 40;
                    const isActive = i < squareDecimeters;

                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={y}
                          width="40"
                          height="40"
                          fill={isActive ? 'rgba(37, 99, 235, 0.2)' : 'none'}
                          stroke={isActive ? '#2563eb' : '#cbd5e1'}
                          strokeWidth={isActive ? '2' : '1'}
                          className="transition-colors duration-150"
                        />
                        <rect
                          x={x}
                          y={y}
                          width="40"
                          height="40"
                          fill="url(#cmGrid)"
                          pointerEvents="none"
                        />
                        {i === 0 && (
                          <text
                            x="5"
                            y="14"
                            fill="#1e40af"
                            fontSize="8"
                            fontWeight="bold"
                            pointerEvents="none"
                          >
                            {t.canvasUnitLabel}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                {t.gridCallout}
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.ctaTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaSubtitle}
            </p>
          </div>

          <Link
            href="/e-dimotikou/27-monades-epifaneias-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {t.ctaButton}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
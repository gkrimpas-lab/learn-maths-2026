// pages/e-dimotikou/06-ekp.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση άτονων κεφαλαίων (διατηρεί το Ε')
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

// Component για κανονική εμφάνιση κλάσματος (αριθμητής, οριζόντια γραμμή, παρονομαστής)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="text-center px-1 pb-0.5 border-b-2 border-current w-full block text-[0.9em]">
        {num}
      </span>
      <span className="text-center px-1 pt-0.5 w-full block text-[0.9em]">
        {den}
      </span>
    </span>
  );
}

const LIMITS = {
  NUM_MIN: 2,
  NUM_MAX: 24,
  COUNT_SHOW: 15
};

const TRANSLATIONS = {
  el: {
    metaTitle: "Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ) - Ε' Δημοτικού | LearnMaths.gr",
    metaDesc: "Πλήρης θεωρία με παραδείγματα, μεθόδους υπολογισμού ΕΚΠ, σύνδεση με τα ομώνυμα κλάσματα και διαδραστικό εργαστήριο για την Ε' Δημοτικού.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 6 • Ε' ΔΗΜΟΤΙΚΟΥ",
    mainTitle: "Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)",
    mainSubtitle: "Μαθαίνουμε πώς να βρίσκουμε το μικρότερο κοινό πολλαπλάσιο δύο ή περισσότερων φυσικών αριθμών (εκτός από το 0), ποιες στρατηγικές εξοικονομούν χρόνο και γιατί το ΕΚΠ είναι απαραίτητο για τα ομώνυμα κλάσματα.",
    liveBadge: "Θεωρία & Δυναμική Σύγκριση Πολλαπλασίων",
    tryExercisesBtn: "Δοκίμασε τις Ασκήσεις",
    
    stepsSectionTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsSectionSubtitle: "Όλα όσα χρειάζεται να γνωρίζεις για να κατανοήσεις και να υπολογίζεις ταχύτατα το ΕΚΠ.",
    
    step1Badge: "ΒΗΜΑ 1",
    step1Category: "Ορισμός",
    step1Title: "Τι είναι το ΕΚΠ;",
    step1Text: "Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ) δύο ή περισσότερων φυσικών αριθμών ονομάζεται το μικρότερο θετικό κοινό πολλαπλάσιό τους (δηλαδή το μικρότερο κοινό πολλαπλάσιο εκτός από το 0).",
    notationLabel: "Συμβολισμός:",
    notationRead: "Διαβάζεται: «Το Ελάχιστο Κοινό Πολλαπλάσιο του 4 και του 6 είναι το 12».",
    step1Tip: "Εξαιρούμε πάντα το 0, γιατί το 0 είναι κοινό πολλαπλάσιο όλων των αριθμών.",
    
    step2Badge: "ΒΗΜΑ 2",
    step2Category: "1η Μέθοδος",
    step2Title: "Μέθοδος με Λίστες Πολλαπλασίων",
    step2Text: "Γράφουμε τα πρώτα πολλαπλάσια κάθε αριθμού με τη σειρά και κυκλώνουμε το πρώτο κοινό νούμερο που θα συναντήσουμε.",
    commonMultiplesPrefix: "Κοινά πολλαπλάσια: 12, 24, 36, ... ➔ Μικρότερο: 12.",
    step2Tip: "Είναι η πιο απλή και κατανοητή μέθοδος για μικρούς αριθμούς.",
    
    step3Badge: "ΒΗΜΑ 3",
    step3Category: "2η Μέθοδος (Γρήγορη)",
    step3Title: "Έλεγχος Πολλαπλασίων Μεγαλύτερου",
    step3Text: "Αντί να γράφουμε όλες τις λίστες, παίρνουμε τον μεγαλύτερο αριθμό και εξετάζουμε τα πολλαπλάσιά του ένα-ένα:",
    forExampleLcm: "Για το ΕΚΠ(3, 8):",
    step3L1: "8 · 1 ＝ 8 (διαιρείται με το 3; Όχι)",
    step3L2: "8 · 2 ＝ 16 (διαιρείται με το 3; Όχι)",
    step3L3: "8 · 3 ＝ 24 (διαιρείται με το 3; Ναι!)",
    step3Conclusion: "Άρα ΕΚΠ(3, 8) ＝ 24.",
    step3TipPrefix: "Κόλπο:",
    step3Tip: "Αν δύο αριθμοί είναι πρώτοι μεταξύ τους, το ΕΚΠ είναι απλά το γινόμενό τους (π.χ. 3 · 8 ＝ 24).",
    
    step4Badge: "ΒΗΜΑ 4",
    step4Category: "Εφαρμογή",
    step4Title: "Γιατί είναι Απαραίτητο το ΕΚΠ;",
    step4Text: "Το ΕΚΠ των παρονομαστών είναι ο ιδανικός κοινός παρονομαστής για να μετατρέψουμε ετερώνυμα κλάσματα σε ομώνυμα!",
    fractionAddPrompt: "Αν θέλουμε να προσθέσουμε τα κλάσματα:",
    fractionStepFind: "Βρίσκουμε ΕΚΠ(4, 6) ＝ 12. Κάνουμε κοινό παρονομαστή το 12:",
    step4Tip: "Χρησιμοποιώντας το ΕΚΠ διατηρούμε τους αριθμούς όσο το δυνατόν μικρότερους, αποφεύγοντας περιττές πράξεις.",
    
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Δυναμικός Υπολογιστής & Συγκριτής ΕΚΠ",
    labSubtitle: "Επίλεξε 2, 3 ή 4 αριθμούς. Παρατήρησε τις λίστες πολλαπλασίων και δες πώς φωτίζεται το πρώτο κοινό τους σημείο συνάντησης.",
    numbersCountSuffix: "Αριθμοί",
    num1Label: "1ΟΣ ΑΡΙΘΜΟΣ",
    num2Label: "2ΟΣ ΑΡΙΘΜΟΣ",
    num3Label: "3ΟΣ ΑΡΙΘΜΟΣ",
    num4Label: "4ΟΣ ΑΡΙΘΜΟΣ",
    inactive3: "Ανενεργός 3ος",
    inactive4: "Ανενεργός 4ος",
    decreaseAria: "Μείωση",
    increaseAria: "Αύξηση",
    
    listComparisonTitle: "ΠΑΡΑΘΕΣΗ ΠΟΛΛΑΠΛΑΣΙΩΝ & ΕΝΤΟΠΙΣΜΟΣ ΚΟΙΝΩΝ ΟΡΩΝ",
    legendEkp: "ΕΚΠ",
    legendOthers: "Άλλα Κοινά",
    symbolMultiple: "Π",
    
    resultHeader: "ΤΟ ΕΛΑΧΙΣΤΟ ΚΟΙΝΟ ΠΟΛΛΑΠΛΑΣΙΟ",
    resultDescPart1: "Ο αριθμός",
    resultDescPart2: "είναι ο μικρότερος δυνατός αριθμός (εκτός του 0) που διαιρείται τέλεια και ταυτόχρονα με όλους τους αριθμούς:",
    
    ctaTitle: "Ώρα για Εξάσκηση στο ΕΚΠ!",
    ctaSubtitle: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού ΕΚΠ, σύνθετα προβλήματα συγχρονισμού και μετατροπή κλασμάτων σε ομώνυμα.",
    ctaBtn: "Έναρξη Ασκήσεων",
    lcmNotationName: "ΕΚΠ"
  },
  en: {
    metaTitle: "Least Common Multiple (LCM) - 5th Grade | LearnMaths.gr",
    metaDesc: "Comprehensive theory with examples, LCM calculation methods, connection to common denominators, and an interactive lab for 5th Grade.",
    backText: "5th Grade",
    exercisesBtn: "Exercises",
    chapterBadge: "CHAPTER 6 • 5TH GRADE",
    mainTitle: "Least Common Multiple (LCM)",
    mainSubtitle: "Learn how to find the least common multiple of two or more natural numbers (excluding 0), discover time-saving strategies, and see why LCM is essential for common denominators.",
    liveBadge: "Theory & Dynamic Multiples Comparison",
    tryExercisesBtn: "Try Exercises",
    
    stepsSectionTitle: "Core Concepts in 4 Steps",
    stepsSectionSubtitle: "Everything you need to master and quickly calculate the LCM.",
    
    step1Badge: "STEP 1",
    step1Category: "Definition",
    step1Title: "What is LCM?",
    step1Text: "The Least Common Multiple (LCM) of two or more natural numbers is their smallest positive common multiple (that is, the smallest common multiple excluding 0).",
    notationLabel: "Notation:",
    notationRead: "Read as: \"The Least Common Multiple of 4 and 6 is 12\".",
    step1Tip: "We always exclude 0, as 0 is a common multiple of all numbers.",
    
    step2Badge: "STEP 2",
    step2Category: "Method 1",
    step2Title: "Listing Multiples Method",
    step2Text: "Write out the first multiples of each number sequentially and circle the first shared number encountered.",
    commonMultiplesPrefix: "Common multiples: 12, 24, 36, ... ➔ Smallest: 12.",
    step2Tip: "This is the most intuitive method for smaller numbers.",
    
    step3Badge: "STEP 3",
    step3Category: "Method 2 (Fast)",
    step3Title: "Testing Multiples of the Largest",
    step3Text: "Instead of writing full lists, take the largest number and test its multiples sequentially:",
    forExampleLcm: "For LCM(3, 8):",
    step3L1: "8 · 1 ＝ 8 (divisible by 3? No)",
    step3L2: "8 · 2 ＝ 16 (divisible by 3? No)",
    step3L3: "8 · 3 ＝ 24 (divisible by 3? Yes!)",
    step3Conclusion: "Therefore LCM(3, 8) ＝ 24.",
    step3TipPrefix: "Pro Tip:",
    step3Tip: "If two numbers are co-prime (relatively prime), their LCM is simply their product (e.g. 3 · 8 ＝ 24).",
    
    step4Badge: "STEP 4",
    step4Category: "Application",
    step4Title: "Why is LCM Essential?",
    step4Text: "The LCM of denominators is the optimal common denominator used to convert unlike fractions into like fractions!",
    fractionAddPrompt: "To add the fractions:",
    fractionStepFind: "We find LCM(4, 6) ＝ 12. We convert to common denominator 12:",
    step4Tip: "Using the LCM keeps numbers as small as possible, avoiding unnecessary large-number calculations.",
    
    labBadge: "INTERACTIVE LAB",
    labTitle: "Dynamic LCM Calculator & Comparator",
    labSubtitle: "Select 2, 3, or 4 numbers. Observe the multiple streams and watch their first meeting point highlight dynamically.",
    numbersCountSuffix: "Numbers",
    num1Label: "1ST NUMBER",
    num2Label: "2ND NUMBER",
    num3Label: "3RD NUMBER",
    num4Label: "4TH NUMBER",
    inactive3: "Inactive 3rd",
    inactive4: "Inactive 4th",
    decreaseAria: "Decrease",
    increaseAria: "Increase",
    
    listComparisonTitle: "MULTIPLES COMPARISON & COMMON TERMS DETECTION",
    legendEkp: "LCM",
    legendOthers: "Other Common",
    symbolMultiple: "M",
    
    resultHeader: "THE LEAST COMMON MULTIPLE",
    resultDescPart1: "The number",
    resultDescPart2: "is the smallest natural number (excluding 0) perfectly divisible by all selected numbers:",
    
    ctaTitle: "Time to Practice LCM!",
    ctaSubtitle: "Test your skills with dynamic LCM calculations, multi-step sync word problems, and fraction denominator conversions.",
    ctaBtn: "Start Exercises",
    lcmNotationName: "LCM"
  }
};

export default function EkpTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Πλήθος αριθμών προς εξέταση (2, 3 ή 4)
  const [numCount, setNumCount] = useState(2);

  // Οι τιμές για έως και 4 αριθμούς
  const [n1, setN1] = useState(4);
  const [n2, setN2] = useState(6);
  const [n3, setN3] = useState(3);
  const [n4, setN4] = useState(8);

  // Συναρτήσεις υπολογισμού ΜΚΔ και ΕΚΠ
  const findGCD = (a, b) => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      const temp = y;
      y = x % y;
      x = temp;
    }
    return x;
  };

  const findLCMOfTwo = (a, b) => {
    if (a === 0 || b === 0) return 0;
    return (a * b) / findGCD(a, b);
  };

  // Υπολογισμός τελικού ΕΚΠ
  let ekpResult = findLCMOfTwo(n1, n2);
  if (numCount >= 3) ekpResult = findLCMOfTwo(ekpResult, n3);
  if (numCount === 4) ekpResult = findLCMOfTwo(ekpResult, n4);

  // Παραγωγή λιστών πολλαπλασίων
  const list1 = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => n1 * (i + 1));
  const list2 = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => n2 * (i + 1));
  const list3 = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => n3 * (i + 1));
  const list4 = Array.from({ length: LIMITS.COUNT_SHOW }, (_, i) => n4 * (i + 1));

  // Έλεγχος αν ένας αριθμός είναι κοινό πολλαπλάσιο όλων των ενεργών αριθμών
  const isCommonMultiple = (val) => {
    if (numCount === 2) return val % n1 === 0 && val % n2 === 0;
    if (numCount === 3) return val % n1 === 0 && val % n2 === 0 && val % n3 === 0;
    return val % n1 === 0 && val % n2 === 0 && val % n3 === 0 && val % n4 === 0;
  };

  const activeNumbers = [n1, n2];
  if (numCount >= 3) activeNumbers.push(n3);
  if (numCount === 4) activeNumbers.push(n4);

  const formatNum = (num) =>
    num.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/06-ekp-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.exercisesBtn}</span>
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K & 4K και responsive για κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 2xl:space-y-14">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.chapterBadge)}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.mainTitle}
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.mainSubtitle}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.liveBadge}</span>
            </div>
            <Link
              href="/e-dimotikou/06-ekp-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>{t.tryExercisesBtn}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.stepsSectionTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              {t.stepsSectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step1Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step1Category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">{t.notationLabel}</p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-slate-900 shadow-inner text-center">
                    {t.lcmNotationName}(4, 6) ＝ 12
                  </div>
                  <p className="text-slate-500 text-xs">
                    {t.notationRead}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 {t.step1Tip}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step2Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step2Category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div>{t.symbolMultiple}(4) ＝ {'{'} 4, 8, <strong className="text-amber-600 font-black">12</strong>, 16, 20, 24, ... {'}'}</div>
                  <div>{t.symbolMultiple}(6) ＝ {'{'} 6, <strong className="text-amber-600 font-black">12</strong>, 18, 24, 30, ... {'}'}</div>
                  <div className="pt-2 border-t border-slate-200 text-emerald-800 font-bold font-sans">
                    {t.commonMultiplesPrefix}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ {t.step2Tip}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step3Category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">{t.forExampleLcm}</p>
                  <ol className="list-decimal list-inside space-y-1 font-mono text-slate-700">
                    <li>{t.step3L1}</li>
                    <li>{t.step3L2}</li>
                    <li>8 · 3 ＝ <strong className="text-indigo-600">24</strong> ({locale === 'el' ? 'διαιρείται με το 3; Ναι!' : 'divisible by 3? Yes!'})</li>
                  </ol>
                  <div className="pt-1 text-indigo-900 font-bold font-mono">
                    {t.step3Conclusion}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 <strong>{t.step3TipPrefix}</strong> {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step4Category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <div className="text-slate-700 flex items-center flex-wrap gap-1">
                    <span>{t.fractionAddPrompt}</span>
                    <span className="font-bold inline-flex items-center font-mono">
                      <Fraction num="1" den="4" />
                      <span className="mx-1">＋</span>
                      <Fraction num="1" den="6" />
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    {t.fractionStepFind}
                  </p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-center text-emerald-800 text-xs sm:text-sm flex items-center justify-center">
                    <Fraction num="3" den="12" />
                    <span className="mx-1.5">＋</span>
                    <Fraction num="2" den="12" />
                    <span className="mx-1.5">＝</span>
                    <Fraction num="5" den="12" />
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΕΚΠ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 {toCleanUppercase(t.labBadge)}</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.labTitle}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.labSubtitle}
              </p>
            </div>

            {/* Επιλογέας Πλήθους Αριθμών */}
            <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-center">
              {[2, 3, 4].map((cnt) => (
                <button
                  key={`btn-cnt-${cnt}`}
                  type="button"
                  onClick={() => setNumCount(cnt)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-bold transition ${
                    numCount === cnt
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cnt} {t.numbersCountSuffix}
                </button>
              ))}
            </div>
          </div>

          {/* Πλέγμα Χειριστηρίων Steppers (2, 3 ή 4 στήλες) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Αριθμός 1 */}
            <div className="bg-blue-50/70 p-4 2xl:p-5 rounded-2xl border border-blue-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-blue-900 tracking-wider">
                  {toCleanUppercase(t.num1Label)}
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  {formatNum(n1)}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label={`${t.decreaseAria} 1`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setN1((prev) => Math.max(LIMITS.NUM_MIN, prev - 1));
                  }}
                  disabled={n1 <= LIMITS.NUM_MIN}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.NUM_MIN}
                  max={LIMITS.NUM_MAX}
                  value={n1}
                  onChange={(e) => setN1(Number(e.target.value))}
                  aria-label={t.num1Label}
                  className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label={`${t.increaseAria} 1`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setN1((prev) => Math.min(LIMITS.NUM_MAX, prev + 1));
                  }}
                  disabled={n1 >= LIMITS.NUM_MAX}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Αριθμός 2 */}
            <div className="bg-indigo-50/70 p-4 2xl:p-5 rounded-2xl border border-indigo-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-xs 2xl:text-sm font-black uppercase text-indigo-900 tracking-wider">
                  {toCleanUppercase(t.num2Label)}
                </span>
                <span className="min-w-[56px] text-center font-mono font-black text-lg text-indigo-600 bg-white px-2 py-0.5 rounded-lg border border-indigo-200">
                  {formatNum(n2)}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label={`${t.decreaseAria} 2`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setN2((prev) => Math.max(LIMITS.NUM_MIN, prev - 1));
                  }}
                  disabled={n2 <= LIMITS.NUM_MIN}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.NUM_MIN}
                  max={LIMITS.NUM_MAX}
                  value={n2}
                  onChange={(e) => setN2(Number(e.target.value))}
                  aria-label={t.num2Label}
                  className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label={`${t.increaseAria} 2`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setN2((prev) => Math.min(LIMITS.NUM_MAX, prev + 1));
                  }}
                  disabled={n2 >= LIMITS.NUM_MAX}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Αριθμός 3 (Εμφάνιση αν numCount >= 3) */}
            {numCount >= 3 ? (
              <div className="bg-purple-50/70 p-4 2xl:p-5 rounded-2xl border border-purple-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs 2xl:text-sm font-black uppercase text-purple-900 tracking-wider">
                    {toCleanUppercase(t.num3Label)}
                  </span>
                  <span className="min-w-[56px] text-center font-mono font-black text-lg text-purple-600 bg-white px-2 py-0.5 rounded-lg border border-purple-200">
                    {formatNum(n3)}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={`${t.decreaseAria} 3`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setN3((prev) => Math.max(LIMITS.NUM_MIN, prev - 1));
                    }}
                    disabled={n3 <= LIMITS.NUM_MIN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={LIMITS.NUM_MIN}
                    max={LIMITS.NUM_MAX}
                    value={n3}
                    onChange={(e) => setN3(Number(e.target.value))}
                    aria-label={t.num3Label}
                    className="w-full min-w-0 max-w-full accent-purple-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label={`${t.increaseAria} 3`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setN3((prev) => Math.min(LIMITS.NUM_MAX, prev + 1));
                    }}
                    disabled={n3 >= LIMITS.NUM_MAX}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 flex-col items-center justify-center text-center opacity-40">
                <span className="text-xs font-bold text-slate-400">{t.inactive3}</span>
              </div>
            )}

            {/* Αριθμός 4 (Εμφάνιση αν numCount === 4) */}
            {numCount === 4 ? (
              <div className="bg-emerald-50/70 p-4 2xl:p-5 rounded-2xl border border-emerald-200 space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-xs 2xl:text-sm font-black uppercase text-emerald-900 tracking-wider">
                    {toCleanUppercase(t.num4Label)}
                  </span>
                  <span className="min-w-[56px] text-center font-mono font-black text-lg text-emerald-600 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                    {formatNum(n4)}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={`${t.decreaseAria} 4`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setN4((prev) => Math.max(LIMITS.NUM_MIN, prev - 1));
                    }}
                    disabled={n4 <= LIMITS.NUM_MIN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={LIMITS.NUM_MIN}
                    max={LIMITS.NUM_MAX}
                    value={n4}
                    onChange={(e) => setN4(Number(e.target.value))}
                    aria-label={t.num4Label}
                    className="w-full min-w-0 max-w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label={`${t.increaseAria} 4`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setN4((prev) => Math.min(LIMITS.NUM_MAX, prev + 1));
                    }}
                    disabled={n4 >= LIMITS.NUM_MAX}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 flex-col items-center justify-center text-center opacity-40">
                <span className="text-xs font-bold text-slate-400">{t.inactive4}</span>
              </div>
            )}
          </div>

          {/* Παράθεση Λιστών Πολλαπλασίων με Σήμανση του ΕΚΠ */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
              <span>{toCleanUppercase(t.listComparisonTitle)}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-amber-500"></span>
                  <span className="text-slate-700">{t.legendEkp}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-sky-500"></span>
                  <span className="text-slate-700">{t.legendOthers}</span>
                </span>
              </div>
            </div>

            {/* Λίστα 1 */}
            <div className="bg-white p-4 2xl:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-lg tracking-wider inline-block">
                {t.symbolMultiple}({formatNum(n1)})
              </span>
              <div className="flex flex-wrap gap-2 pt-1 text-sm 2xl:text-base font-mono font-bold">
                {list1.map((v) => {
                  const isEkp = v === ekpResult;
                  const isCommon = isCommonMultiple(v);
                  return (
                    <span
                      key={`l1-${v}`}
                      className={`px-3 py-1.5 rounded-xl border transition ${
                        isEkp
                          ? 'bg-amber-500 text-white border-amber-600 font-black scale-105 shadow-md'
                          : isCommon
                          ? 'bg-sky-500 text-white border-sky-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {formatNum(v)}
                    </span>
                  );
                })}
                <span className="text-slate-400 self-center px-1">...</span>
              </div>
            </div>

            {/* Λίστα 2 */}
            <div className="bg-white p-4 2xl:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg tracking-wider inline-block">
                {t.symbolMultiple}({formatNum(n2)})
              </span>
              <div className="flex flex-wrap gap-2 pt-1 text-sm 2xl:text-base font-mono font-bold">
                {list2.map((v) => {
                  const isEkp = v === ekpResult;
                  const isCommon = isCommonMultiple(v);
                  return (
                    <span
                      key={`l2-${v}`}
                      className={`px-3 py-1.5 rounded-xl border transition ${
                        isEkp
                          ? 'bg-amber-500 text-white border-amber-600 font-black scale-105 shadow-md'
                          : isCommon
                          ? 'bg-sky-500 text-white border-sky-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {formatNum(v)}
                    </span>
                  );
                })}
                <span className="text-slate-400 self-center px-1">...</span>
              </div>
            </div>

            {/* Λίστα 3 */}
            {numCount >= 3 && (
              <div className="bg-white p-4 2xl:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 animate-fade-in">
                <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-lg tracking-wider inline-block">
                  {t.symbolMultiple}({formatNum(n3)})
                </span>
                <div className="flex flex-wrap gap-2 pt-1 text-sm 2xl:text-base font-mono font-bold">
                  {list3.map((v) => {
                    const isEkp = v === ekpResult;
                    const isCommon = isCommonMultiple(v);
                    return (
                      <span
                        key={`l3-${v}`}
                        className={`px-3 py-1.5 rounded-xl border transition ${
                          isEkp
                            ? 'bg-amber-500 text-white border-amber-600 font-black scale-105 shadow-md'
                            : isCommon
                            ? 'bg-sky-500 text-white border-sky-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {formatNum(v)}
                      </span>
                    );
                  })}
                  <span className="text-slate-400 self-center px-1">...</span>
                </div>
              </div>
            )}

            {/* Λίστα 4 */}
            {numCount === 4 && (
              <div className="bg-white p-4 2xl:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 animate-fade-in">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg tracking-wider inline-block">
                  {t.symbolMultiple}({formatNum(n4)})
                </span>
                <div className="flex flex-wrap gap-2 pt-1 text-sm 2xl:text-base font-mono font-bold">
                  {list4.map((v) => {
                    const isEkp = v === ekpResult;
                    const isCommon = isCommonMultiple(v);
                    return (
                      <span
                        key={`l4-${v}`}
                        className={`px-3 py-1.5 rounded-xl border transition ${
                          isEkp
                            ? 'bg-amber-500 text-white border-amber-600 font-black scale-105 shadow-md'
                            : isCommon
                            ? 'bg-sky-500 text-white border-sky-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {formatNum(v)}
                      </span>
                    );
                  })}
                  <span className="text-slate-400 self-center px-1">...</span>
                </div>
              </div>
            )}
          </div>

          {/* Τελική Κάρτα Αποτελέσματος ΕΚΠ */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white p-6 2xl:p-8 rounded-3xl text-center shadow-lg max-w-3xl mx-auto space-y-2">
            <span className="text-xs 2xl:text-sm uppercase font-black text-sky-200 tracking-wider block">
              {toCleanUppercase(t.resultHeader)}
            </span>
            <div className="text-2xl sm:text-3xl 2xl:text-4xl font-black font-mono">
              {t.lcmNotationName}({activeNumbers.map((num) => formatNum(num)).join(', ')}) ＝{' '}
              <span className="text-amber-300 text-3xl sm:text-5xl font-black ml-1 inline-block animate-pulse">
                {formatNum(ekpResult)}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto pt-1 leading-relaxed">
              {t.resultDescPart1} <strong>{formatNum(ekpResult)}</strong> {t.resultDescPart2}{' '}
              {activeNumbers.map((num) => formatNum(num)).join(', ')}!
            </p>
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
            href="/e-dimotikou/06-ekp-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {t.ctaBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
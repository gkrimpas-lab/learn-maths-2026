// pages/e-dimotikou/01-klasma.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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

// Επαναχρησιμοποιήσιμο εξάρτημα για κανονική μορφή κλάσματος
function Fraction({ num, den, className = '', size = 'md' }) {
  const sizeClasses = {
    sm: 'text-xs 2xl:text-sm',
    md: 'text-sm sm:text-base 2xl:text-lg',
    lg: 'text-base sm:text-xl 2xl:text-2xl',
    xl: 'text-xl sm:text-2xl 2xl:text-3xl'
  };

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <span className="px-1 text-center">{num}</span>
      <span className="w-full min-w-[0.9em] h-[1.5px] bg-current my-[1px] rounded-full"></span>
      <span className="px-1 text-center">{den}</span>
    </span>
  );
}

const translations = {
  el: {
    pageTitle: "Η Έννοια του Κλάσματος - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Πλήρης θεωρία με παραδείγματα, ορολογία, είδη κλασμάτων, κλάσμα ως πηλίκο διαίρεσης και διαδραστικό εργαστήριο για την Ε' Δημοτικού.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    headerBadge: "ΚΕΦΑΛΑΙΟ 1 • Ε' ΔΗΜΟΤΙΚΟΥ",
    headerTitle: "Η Έννοια του Κλάσματος",
    headerDesc: "Μαθαίνουμε πώς να χωρίζουμε τη μονάδα σε ίσα μέρη, να αναγνωρίζουμε τους όρους του κλάσματος, να ερμηνεύουμε το κλάσμα ως πηλίκο διαίρεσης και να διακρίνουμε τα γνήσια από τα καταχρηστικά κλάσματα.",
    interactiveTag: "Θεωρία & Διαδραστική Οπτικοποίηση",
    tryExercises: "Δοκίμασε τις Ασκήσεις",
    
    stepsTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsDesc: "Όλα όσα χρειάζεται να γνωρίζεις για να κατανοήσεις σε βάθος τα κλάσματα.",
    
    step1Badge: "ΒΗΜΑ 1Ο",
    step1Sub: "Μέρος της Μονάδας",
    step1Title: "Τι είναι Κλάσμα & ποιοι οι Όροι του;",
    step1Text: "Όταν χωρίζουμε μια ακέραιη μονάδα σε ίσα μέρη, κάθε μέρος ονομάζεται κλάσμα. Ένα κλάσμα αποτελείται από τρία στοιχεία:",
    step1NumTitle: "Αριθμητής (πάνω):",
    step1NumDesc: "Δείχνει πόσα από τα ίσα μέρη έχουμε πάρει.",
    step1LineTitle: "Γραμμή Κλάσματος (μέση):",
    step1LineDesc: "Συμβολίζει την πράξη της διαίρεσης.",
    step1DenTitle: "Παρονομαστής (κάτω):",
    step1DenDesc: "Δείχνει σε πόσα ίσα μέρη χωρίστηκε συνολικά η μονάδα (δεν μπορεί να είναι ποτέ 0).",
    step1NumeratorLabel: "Αριθμητής",
    step1DenominatorLabel: "Παρονομαστής",
    step1MeaningText: "«Πήραμε τα 3 από τα 5 ίσα μέρη»",

    step2Badge: "ΒΗΜΑ 2Ο",
    step2Sub: "Πηλίκο Διαίρεσης",
    step2Title: "Το Κλάσμα ως Ακριβές Πηλίκο",
    step2Text: "Κάθε κλάσμα ισοδυναμεί με τη διαίρεση του αριθμητή διά του παρονομαστή. Όταν η διαίρεση δεν είναι τέλεια, το κλάσμα είναι η ακριβής τιμή του πηλίκου.",
    step2ExampleText: "Αν μοιράσουμε 3 πίτσες ισότιμα σε 4 παιδιά, κάθε παιδί θα πάρει:",
    step2ResultNote: "Κάθε παιδί παίρνει τα",
    step2ResultNoteEnd: "μιας ολόκληρης πίτσας.",
    step2Warning: "Προσοχή: Ο παρονομαστής δεν μπορεί ΠΟΤΕ να είναι 0, γιατί η διαίρεση με το μηδέν είναι αδύνατη στα μαθηματικά!",

    step3Badge: "ΒΗΜΑ 3Ο",
    step3Sub: "Κατηγοριοποίηση",
    step3Title: "Τα 3 Είδη Κλασμάτων",
    step3Text: "Συγκρίνοντας τον αριθμητή με τον παρονομαστή, διακρίνουμε τα κλάσματα σε τρεις κατηγορίες:",
    catProperTitle: "1. Γνήσιο Κλάσμα ( ＜ 1 ):",
    catProperDesc: "Αριθμητής ＜ Παρονομαστή.",
    catEqualTitle: "2. Ίσο με τη Μονάδα ( ＝ 1 ):",
    catEqualDesc: "Αριθμητής ＝ Παρονομαστή.",
    catImproperTitle: "3. Καταχρηστικό Κλάσμα ( ＞ 1 ):",
    catImproperDesc: "Αριθμητής ＞ Παρονομαστή.",
    catMixedNote: "Τα καταχρηστικά κλάσματα γράφονται και ως μεικτοί αριθμοί:",

    step4Badge: "ΒΗΜΑ 4Ο",
    step4Sub: "Εφαρμογή",
    step4Title: "Κλάσμα ως Μέρος ενός Συνόλου",
    step4Text: "Ένα κλάσμα μπορεί να εκφράσει και ένα τμήμα από ένα πλήθος αντικειμένων (σύνολο).",
    step4ExamplePrefix: "Παράδειγμα: Πόσο είναι τα",
    step4ExampleSuffix: "των 20 μαθητών;",
    step4Step1: "Βρίσκουμε το 1/5: 20 : 5 ＝ 4 μαθητές.",
    step4Step2: "Πολλαπλασιάζουμε επί 3: 4 · 3 ＝ 12 μαθητές.",
    step4Formula: "(20 : 5) · 3 ＝ 12 μαθητές",
    step4Rule: "Κανόνας: Διαιρούμε το σύνολο με τον παρονομαστή και πολλαπλασιάζουμε με τον αριθμητή.",

    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Εξερεύνηση & Οπτικοποίηση Κλάσματος",
    labDesc: "Άλλαξε τον αριθμητή και τον παρονομαστή για να παρατηρήσεις πώς μεταβάλλεται το σχήμα και το είδος του κλάσματος.",
    viewPies: "🍕 Κυκλικοί Δίσκοι",
    viewBars: "🍫 Ορθογώνιες Ράβδοι",
    settingsTitle: "ΡΥΘΜΙΣΕΙΣ ΟΡΩΝ",
    numeratorSetting: "Αριθμητής (μέρη που παίρνουμε):",
    denominatorSetting: "Παρονομαστής (ίσα μέρη μονάδας):",
    btnEqualDen: "＝ Παρονομαστή",
    mathAnalysisTitle: "ΜΑΘΗΜΑΤΙΚΗ ΑΝΑΛΥΣΗ",
    asMixedNumber: "Ως Μεικτός Αριθμός:",
    wholeUnitsWord: "ακέραιες μονάδες",
    andMoreWord: "και ακόμη",
    visualTitle: "Οπτική Αναπαράσταση",
    unitSingular: "μονάδα",
    unitPlural: "μονάδες",
    totalPartsLabel: "Σύνολο μερών:",
    unitCardTitle: "Μονάδα",
    legendTaken: "Μέρη που πήραμε",
    legendRemaining: "Υπόλοιπα μέρη",

    calloutTitle: "Είσαι έτοιμος για εξάσκηση;",
    calloutDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις με αναγνώριση κλασμάτων, ισοδυναμίες, μεικτούς αριθμούς και προβλήματα πραγματικής ζωής.",
    calloutBtn: "Έναρξη Ασκήσεων",
    bottomFooterText: "Κεφάλαιο 1 • Η Έννοια του Κλάσματος",
    bottomFooterBtn: "Μετάβαση στις Ασκήσεις",

    catZeroLabel: "Μηδενικό Κλάσμα",
    catZeroDesc: "Δεν έχουμε πάρει κανένα μέρος από τη μονάδα.",
    catProperLabel: "Γνήσιο Κλάσμα ( ＜ 1 )",
    catProperFullDesc: "Ο αριθμητής είναι μικρότερος από τον παρονομαστή. Εκφράζει ποσότητα μικρότερη από 1 ακέραιη μονάδα.",
    catUnitLabel: "Ίσο με τη Μονάδα ( ＝ 1 )",
    catUnitFullDesc: "Ο αριθμητής είναι ίσος με τον παρονομαστή. Συμπληρώνει ακριβώς 1 ολόκληρη μονάδα.",
    catImproperLabel: "Καταχρηστικό Κλάσμα ( ＞ 1 )",
    catImproperFullDesc: "Ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή. Χρειαζόμαστε περισσότερες από μία μονάδες (μεικτός αριθμός)."
  },
  en: {
    pageTitle: "The Concept of Fractions - Grade 5 | LearnMaths.gr",
    pageDesc: "Complete theory with examples, terminology, types of fractions, fraction as a division quotient, and an interactive lab for Grade 5.",
    backText: "Grade 5",
    exercisesBtn: "Exercises",
    headerBadge: "CHAPTER 1 • GRADE 5",
    headerTitle: "The Concept of Fractions",
    headerDesc: "Learn how to divide a unit into equal parts, recognize fraction terms, understand fractions as division quotients, and differentiate proper from improper fractions.",
    interactiveTag: "Theory & Interactive Visualization",
    tryExercises: "Try the Exercises",

    stepsTitle: "Core Concepts in 4 Steps",
    stepsDesc: "Everything you need to deeply understand fractions.",

    step1Badge: "STEP 1",
    step1Sub: "Part of a Unit",
    step1Title: "What is a Fraction & What are its Terms?",
    step1Text: "When we divide a whole unit into equal parts, each part is called a fraction. A fraction consists of three elements:",
    step1NumTitle: "Numerator (top):",
    step1NumDesc: "Shows how many equal parts we have taken.",
    step1LineTitle: "Fraction Bar (middle):",
    step1LineDesc: "Represents the division operation.",
    step1DenTitle: "Denominator (bottom):",
    step1DenDesc: "Shows into how many equal parts the whole unit was divided (can never be 0).",
    step1NumeratorLabel: "Numerator",
    step1DenominatorLabel: "Denominator",
    step1MeaningText: "«We took 3 out of 5 equal parts»",

    step2Badge: "STEP 2",
    step2Sub: "Division Quotient",
    step2Title: "The Fraction as an Exact Quotient",
    step2Text: "Every fraction is equivalent to dividing the numerator by the denominator. When the division is not exact, the fraction represents the precise quotient value.",
    step2ExampleText: "If we divide 3 pizzas equally among 4 children, each child receives:",
    step2ResultNote: "Each child gets",
    step2ResultNoteEnd: "of a whole pizza.",
    step2Warning: "Warning: The denominator can NEVER be 0, because division by zero is undefined in mathematics!",

    step3Badge: "STEP 3",
    step3Sub: "Classification",
    step3Title: "The 3 Types of Fractions",
    step3Text: "Comparing the numerator with the denominator gives three distinct fraction categories:",
    catProperTitle: "1. Proper Fraction ( ＜ 1 ):",
    catProperDesc: "Numerator ＜ Denominator.",
    catEqualTitle: "2. Equal to One Unit ( ＝ 1 ):",
    catEqualDesc: "Numerator ＝ Denominator.",
    catImproperTitle: "3. Improper Fraction ( ＞ 1 ):",
    catImproperDesc: "Numerator ＞ Denominator.",
    catMixedNote: "Improper fractions can also be written as mixed numbers:",

    step4Badge: "STEP 4",
    step4Sub: "Application",
    step4Title: "Fraction as Part of a Set",
    step4Text: "A fraction can also describe a subset of items within a collection (set).",
    step4ExamplePrefix: "Example: What is",
    step4ExampleSuffix: "of 20 students?",
    step4Step1: "Find 1/5: 20 : 5 ＝ 4 students.",
    step4Step2: "Multiply by 3: 4 · 3 ＝ 12 students.",
    step4Formula: "(20 : 5) · 3 ＝ 12 students",
    step4Rule: "Rule: Divide the set total by the denominator and multiply by the numerator.",

    labBadge: "INTERACTIVE LAB",
    labTitle: "Fraction Exploration & Visualization",
    labDesc: "Adjust the numerator and denominator to see how the visual models and fraction category dynamically update.",
    viewPies: "🍕 Circular Discs",
    viewBars: "🍫 Rectangular Bars",
    settingsTitle: "TERM CONTROLS",
    numeratorSetting: "Numerator (parts taken):",
    denominatorSetting: "Denominator (total equal parts):",
    btnEqualDen: "＝ Denominator",
    mathAnalysisTitle: "MATHEMATICAL BREAKDOWN",
    asMixedNumber: "As a Mixed Number:",
    wholeUnitsWord: "whole units",
    andMoreWord: "and another",
    visualTitle: "Visual Representation",
    unitSingular: "unit",
    unitPlural: "units",
    totalPartsLabel: "Total parts:",
    unitCardTitle: "Unit",
    legendTaken: "Parts taken",
    legendRemaining: "Remaining parts",

    calloutTitle: "Ready to practice?",
    calloutDesc: "Challenge yourself with interactive exercises covering fraction identification, equivalence, mixed numbers, and real-world word problems.",
    calloutBtn: "Start Exercises",
    bottomFooterText: "Chapter 1 • The Concept of Fractions",
    bottomFooterBtn: "Go to Exercises",

    catZeroLabel: "Zero Fraction",
    catZeroDesc: "We have not taken any parts of the unit.",
    catProperLabel: "Proper Fraction ( ＜ 1 )",
    catProperFullDesc: "The numerator is smaller than the denominator. Represents a quantity smaller than 1 whole unit.",
    catUnitLabel: "Equal to One Unit ( ＝ 1 )",
    catUnitFullDesc: "The numerator is equal to the denominator. Exactly completes 1 whole unit.",
    catImproperLabel: "Improper Fraction ( ＞ 1 )",
    catImproperFullDesc: "The numerator is greater than the denominator. Requires more than one unit (mixed number)."
  }
};

export default function KlasmaTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [num, setNum] = useState(3);
  const [den, setDen] = useState(4);
  const [viewType, setViewType] = useState('pie'); // 'pie' | 'bar'

  const MIN_NUM = 0;
  const MAX_NUM = 24;
  const MIN_DEN = 1;
  const MAX_DEN = 12;

  const wholeUnits = den > 0 ? Math.floor(num / den) : 0;
  const remainderParts = den > 0 ? num % den : 0;
  const totalShapes = Math.max(1, Math.ceil(num / den) || 1);

  // Σχεδίαση τομέων κυκλικού δίσκου
  const renderPieSlices = (shapeIndex) => {
    const slices = [];
    const radius = 88;
    const cx = 100;
    const cy = 100;

    for (let i = 0; i < den; i++) {
      const sliceGlobalIndex = shapeIndex * den + i;
      const isFilled = sliceGlobalIndex < num;

      if (den === 1) {
        return (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            className={`${
              isFilled ? 'fill-amber-500' : 'fill-slate-100'
            } stroke-slate-800 stroke-[3] transition-colors duration-150`}
          />
        );
      }

      const startAngle = (i * 360) / den - 90;
      const endAngle = ((i + 1) * 360) / den - 90;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);

      const largeArc = 360 / den > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      slices.push(
        <path
          key={`slice-${shapeIndex}-${i}`}
          d={pathData}
          className={`${
            isFilled ? 'fill-amber-500' : 'fill-slate-100'
          } stroke-slate-800 stroke-[2] transition-colors duration-150`}
        />
      );
    }
    return slices;
  };

  // Σχεδίαση ορθογώνιας ράβδου
  const renderBarParts = (shapeIndex) => {
    const rects = [];
    const totalWidth = 260;
    const barHeight = 64;
    const startX = 20;
    const startY = 28;
    const partWidth = totalWidth / den;

    for (let i = 0; i < den; i++) {
      const partGlobalIndex = shapeIndex * den + i;
      const isFilled = partGlobalIndex < num;
      const x = startX + i * partWidth;

      rects.push(
        <rect
          key={`bar-${shapeIndex}-${i}`}
          x={x}
          y={startY}
          width={partWidth}
          height={barHeight}
          className={`${
            isFilled ? 'fill-sky-500' : 'fill-slate-100'
          } stroke-slate-800 stroke-[2] transition-colors duration-150`}
        />
      );
    }
    return rects;
  };

  const getFractionCategory = () => {
    if (num === 0) {
      return {
        label: t.catZeroLabel,
        badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
        desc: t.catZeroDesc
      };
    }
    if (num < den) {
      return {
        label: t.catProperLabel,
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        desc: t.catProperFullDesc
      };
    }
    if (num === den) {
      return {
        label: t.catUnitLabel,
        badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-300',
        desc: t.catUnitFullDesc
      };
    }
    return {
      label: t.catImproperLabel,
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
      desc: t.catImproperFullDesc
    };
  };

  const fractionCategory = getFractionCategory();

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/01-klasma-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.exercisesBtn}</span>
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K & 4K */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 space-y-10 2xl:space-y-14 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.headerBadge)}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.headerTitle}
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.headerDesc}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.interactiveTag}</span>
            </div>
            <Link
              href="/e-dimotikou/01-klasma-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>{t.tryExercises}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.stepsTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              {t.stepsDesc}
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Sub}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <div className="flex items-start gap-2">
                    <span className="font-black text-amber-600 shrink-0">1.</span>
                    <div>
                      <strong className="text-slate-900">{t.step1NumTitle}</strong> {t.step1NumDesc}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-black text-slate-700 shrink-0">2.</span>
                    <div>
                      <strong className="text-slate-900">{t.step1LineTitle}</strong> {t.step1LineDesc}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-black text-sky-600 shrink-0">3.</span>
                    <div>
                      <strong className="text-slate-900">{t.step1DenTitle}</strong> {t.step1DenDesc}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-4 2xl:p-6 rounded-2xl border border-sky-200 flex items-center justify-center">
                <div className="inline-flex items-center gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm 2xl:text-base font-black text-amber-600">3 ({t.step1NumeratorLabel})</span>
                    <span className="w-full h-1 bg-slate-900 rounded-full my-1"></span>
                    <span className="text-sm 2xl:text-base font-black text-sky-600">5 ({t.step1DenominatorLabel})</span>
                  </div>
                  <span className="text-slate-500 font-sans text-xs sm:text-sm 2xl:text-base max-w-[170px] text-left">
                    {t.step1MeaningText}
                  </span>
                </div>
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step2Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Sub}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    {t.step2ExampleText}
                  </p>
                  <div className="py-2 flex items-center justify-center">
                    <div className="inline-flex flex-wrap items-center justify-center gap-2 font-mono font-black text-slate-900 text-sm sm:text-base 2xl:text-xl bg-white px-4 py-2 rounded-xl border border-slate-300 shadow-inner">
                      <span>3 : 4</span>
                      <span>＝</span>
                      <Fraction num={3} den={4} size="lg" />
                      <span>＝</span>
                      <span>{locale === 'el' ? '0,75' : '0.75'}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs 2xl:text-sm flex items-center justify-center gap-1">
                    <span>{t.step2ResultNote}</span>
                    <Fraction num={3} den={4} size="sm" />
                    <span>{t.step2ResultNoteEnd}</span>
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step2Warning}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Sub}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}
                </p>

                <div className="space-y-2.5 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-wrap items-center gap-1.5">
                    <strong>{t.catProperTitle}</strong> {t.catProperDesc} (π.χ. 
                    <Fraction num={2} den={5} size="sm" />, 
                    <Fraction num={7} den={10} size="sm" />)
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex flex-wrap items-center gap-1.5">
                    <strong>{t.catEqualTitle}</strong> {t.catEqualDesc} (π.χ. 
                    <Fraction num={4} den={4} size="sm" /> ＝ 1, 
                    <Fraction num={8} den={8} size="sm" /> ＝ 1)
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-wrap items-center gap-1.5">
                    <strong>{t.catImproperTitle}</strong> {t.catImproperDesc} (π.χ. 
                    <Fraction num={7} den={4} size="sm" />)
                  </div>
                </div>
              </div>

              <div className="text-xs 2xl:text-sm text-slate-500 italic flex flex-wrap items-center gap-1">
                <span>{t.catMixedNote}</span>
                <Fraction num={7} den={4} size="sm" />
                <span>＝ 1 ＋</span>
                <Fraction num={3} den={4} size="sm" />
                <span>＝ 1</span>
                <Fraction num={3} den={4} size="sm" />
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Sub}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Text}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-800 font-semibold flex items-center flex-wrap gap-1">
                    <span>{t.step4ExamplePrefix}</span>
                    <Fraction num={3} den={5} size="sm" className="text-indigo-600" />
                    <span>{t.step4ExampleSuffix}</span>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>{t.step4Step1}</li>
                    <li>{t.step4Step2}</li>
                  </ol>
                  <div className="mt-2 pt-2 border-t border-slate-200 font-mono font-bold text-indigo-900 flex items-center justify-center">
                    {t.step4Formula}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 {t.step4Rule}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΚΛΑΣΜΑΤΩΝ */}
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
                {t.labDesc}
              </p>
            </div>

            {/* Toggle τύπου απεικόνισης */}
            <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setViewType('pie')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-bold transition ${
                  viewType === 'pie'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.viewPies}
              </button>
              <button
                type="button"
                onClick={() => setViewType('bar')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-bold transition ${
                  viewType === 'bar'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.viewBars}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Αριστερή Στήλη: Steppers & Μαθηματική Ταυτότητα */}
            <div className="xl:col-span-5 2xl:col-span-4 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black uppercase tracking-wider text-slate-500">
                {toCleanUppercase(t.settingsTitle)}
              </h4>

              {/* Stepper Αριθμητή */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.numeratorSetting}</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    {num}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease numerator by 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.max(MIN_NUM, prev - 1));
                    }}
                    disabled={num <= MIN_NUM}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={MIN_NUM}
                    max={MAX_NUM}
                    step={1}
                    value={num}
                    onChange={(e) => setNum(Number(e.target.value))}
                    aria-label="Numerator range"
                    className="w-full min-w-0 max-w-full accent-amber-500 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Increase numerator by 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.min(MAX_NUM, prev + 1));
                    }}
                    disabled={num >= MAX_NUM}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα βοηθητικά buttons */}
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum(0);
                    }}
                    className="text-xs 2xl:text-sm px-2.5 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-300 font-semibold text-slate-700 transition"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum(den);
                    }}
                    className="text-xs 2xl:text-sm px-2.5 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-300 font-semibold text-slate-700 transition"
                  >
                    {t.btnEqualDen}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.min(MAX_NUM, prev + 3));
                    }}
                    className="text-xs 2xl:text-sm px-2.5 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-300 font-semibold text-slate-700 transition"
                  >
                    ＋3
                  </button>
                </div>
              </div>

              {/* Stepper Παρονομαστή */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.denominatorSetting}</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                    {den}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease denominator by 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDen((prev) => Math.max(MIN_DEN, prev - 1));
                    }}
                    disabled={den <= MIN_DEN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={MIN_DEN}
                    max={MAX_DEN}
                    step={1}
                    value={den}
                    onChange={(e) => setDen(Number(e.target.value))}
                    aria-label="Denominator range"
                    className="w-full min-w-0 max-w-full accent-sky-500 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Increase denominator by 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDen((prev) => Math.min(MAX_DEN, prev + 1));
                    }}
                    disabled={den >= MAX_DEN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά συνήθων παρονομαστών */}
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  {[2, 4, 6, 8, 10, 12].map((val) => (
                    <button
                      key={`quick-den-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDen(val);
                      }}
                      className={`text-xs 2xl:text-sm px-2.5 py-1 rounded-lg font-semibold transition ${
                        den === val
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτα Μαθηματικής Ταυτότητας */}
              <div className="p-5 2xl:p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <div className="text-xs 2xl:text-sm font-bold text-slate-500 uppercase tracking-wider">
                  {toCleanUppercase(t.mathAnalysisTitle)}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 font-mono font-black text-2xl 2xl:text-3xl text-slate-900">
                    <Fraction num={num} den={den} size="xl" className="text-slate-900" />
                    <span className="text-slate-400 font-sans text-xl">＝</span>
                    <span className="text-slate-800">
                      {(num / den).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', {
                        maximumFractionDigits: 3
                      })}
                    </span>
                  </div>

                  <span
                    className={`text-xs 2xl:text-sm font-bold px-3 py-1.5 rounded-lg border ${fractionCategory.badgeColor}`}
                  >
                    {fractionCategory.label}
                  </span>
                </div>

                <p className="text-xs 2xl:text-sm text-slate-600 leading-relaxed">
                  {fractionCategory.desc}
                </p>

                {num > den && den > 0 && (
                  <div className="pt-3 border-t border-slate-100 text-xs 2xl:text-sm font-semibold text-slate-700 flex flex-wrap items-center gap-1">
                    <span>💡 {t.asMixedNumber}</span>
                    <span className="font-mono font-bold text-indigo-700 inline-flex items-center">
                      {wholeUnits}
                      {remainderParts > 0 && <Fraction num={remainderParts} den={den} size="sm" />}
                    </span>
                    <span>
                      ({wholeUnits} {t.wholeUnitsWord} {remainderParts > 0 ? `${t.andMoreWord} ` : ''}
                    </span>
                    {remainderParts > 0 && <Fraction num={remainderParts} den={den} size="sm" />}
                    <span>)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Canvas */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center min-h-[380px] 2xl:min-h-[500px] space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm 2xl:text-base font-bold text-slate-500 px-2">
                <span>
                  {t.visualTitle} ({totalShapes} {totalShapes === 1 ? t.unitSingular : t.unitPlural})
                </span>
                <span className="font-mono">
                  {t.totalPartsLabel} {num} / {totalShapes * den}
                </span>
              </div>

              {/* Πλέγμα Σχημάτων */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4 gap-4 2xl:gap-6 place-items-center">
                {Array.from({ length: totalShapes }).map((_, shapeIdx) => (
                  <div
                    key={`shape-${shapeIdx}`}
                    className="w-full max-w-[260px] 2xl:max-w-[320px] bg-white p-4 2xl:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center space-y-3"
                  >
                    <span className="text-[11px] 2xl:text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {toCleanUppercase(t.unitCardTitle)} {shapeIdx + 1}
                    </span>

                    {viewType === 'pie' ? (
                      <div className="w-full aspect-square max-w-[190px] 2xl:max-w-[240px]">
                        <svg
                          viewBox="0 0 200 200"
                          className="w-full h-full drop-shadow-sm"
                          aria-label={`Pie visualization unit ${shapeIdx + 1}`}
                        >
                          {renderPieSlices(shapeIdx)}
                        </svg>
                      </div>
                    ) : (
                      <div className="w-full aspect-[300/120] max-w-[240px] 2xl:max-w-[280px]">
                        <svg
                          viewBox="0 0 300 120"
                          className="w-full h-full drop-shadow-sm"
                          aria-label={`Bar visualization unit ${shapeIdx + 1}`}
                        >
                          {renderBarParts(shapeIdx)}
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Υπόμνημα χρωμάτων */}
              <div className="flex flex-wrap items-center justify-center gap-5 text-xs 2xl:text-sm pt-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded ${
                      viewType === 'pie' ? 'bg-amber-500' : 'bg-sky-500'
                    }`}
                  ></span>
                  <span className="text-slate-700 font-semibold">{t.legendTaken} ({num})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-slate-100 border border-slate-400"></span>
                  <span className="text-slate-600 font-medium">{t.legendRemaining}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.calloutTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.calloutDesc}
            </p>
          </div>

          <Link
            href="/e-dimotikou/01-klasma-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {t.calloutBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>

      {/* Σταθερό κάτω Footer */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm 2xl:text-base text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold">{t.bottomFooterText}</span>
          </div>
          <Link
            href="/e-dimotikou/01-klasma-ask"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base transition active:scale-95 shadow-md"
          >
            <span>🎯 {t.bottomFooterBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </footer>
    </Layout>
  );
}
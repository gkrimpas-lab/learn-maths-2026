// pages/e-dimotikou/03-aplopoiisi.js
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

// Επαναχρησιμοποιήσιμο component για κανονική κατακόρυφη μορφή κλάσματος
function Fraction({ num, den, className = '', size = 'md' }) {
  const sizeClasses = {
    xs: 'text-[11px] 2xl:text-xs',
    sm: 'text-xs 2xl:text-sm',
    md: 'text-sm sm:text-base 2xl:text-lg',
    lg: 'text-base sm:text-xl 2xl:text-2xl',
    xl: 'text-xl sm:text-2xl 2xl:text-3xl'
  };

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <span className="px-1 text-center leading-tight">{num}</span>
      <span className="w-full min-w-[0.9em] h-[1.5px] bg-current my-[1px] rounded-full"></span>
      <span className="px-1 text-center leading-tight">{den}</span>
    </span>
  );
}

const translations = {
  el: {
    pageTitle: "Απλοποίηση Κλάσματος - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθετε πώς απλοποιούμε ένα κλάσμα διαιρώντας με τον Μ.Κ.Δ., πότε ένα κλάσμα ονομάζεται ανάγωγο και πειραματιστείτε με το διαδραστικό εργαστήριο.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    headerBadge: "ΚΕΦΑΛΑΙΟ 3 • Ε' ΔΗΜΟΤΙΚΟΥ",
    headerTitle: "Απλοποίηση Κλάσματος & Ανάγωγη Μορφή",
    headerDesc: "Μαθαίνουμε πώς να μικραίνουμε τους όρους ενός κλάσματος διαιρώντας με κοινούς διαιρέτες, πώς φτάνουμε στο Ανάγωγο Κλάσμα με μία μόνο κίνηση χρησιμοποιώντας τον Μ.Κ.Δ. και γιατί η αξία του κλάσματος παραμένει αναλλοίωτη.",
    interactiveTag: "Θεωρία & Αυτόματη Ανάγωγη Οπτικοποίηση",
    tryExercises: "Δοκίμασε τις Ασκήσεις",

    stepsTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsDesc: "Η μαθηματική λογική πίσω από την απλοποίηση και την ανάγωγη μορφή.",

    // Βήμα 1
    step1Badge: "ΒΗΜΑ 1",
    step1Sub: "Ορισμός",
    step1Title: "Τι είναι η Απλοποίηση;",
    step1Text: "Απλοποίηση ενός κλάσματος είναι η διαίρεση και των δύο όρων (αριθμητή και παρονομαστή) με τον ίδιο αριθμό (κοινό διαιρέτη τους, διάφορο του 0 και του 1).",
    step1Desc: "Με την απλοποίηση σχηματίζουμε ένα ισοδύναμο κλάσμα με μικρότερους όρους που είναι πολύ πιο εύχρηστο στους υπολογισμούς.",
    step1Note: "Παρόλο που οι αριθμοί μικραίνουν, η ποσότητα που εκφράζει το κλάσμα παραμένει απολύτως ίδια.",

    // Βήμα 2
    step2Badge: "ΒΗΜΑ 2",
    step2Sub: "Η Συντομότερη Οδός",
    step2Title: "Ο Ρόλος του Μ.Κ.Δ.",
    step2Text: "Αν διαιρέσουμε τους όρους με οποιονδήποτε κοινό διαιρέτη, το κλάσμα απλοποιείται, αλλά μπορεί να χρειαστεί και άλλη απλοποίηση.",
    step2Desc: "Αν διαιρέσουμε με τον Μέγιστο Κοινό Διαιρέτη (Μ.Κ.Δ.) των όρων, φτάνουμε στην τελική μορφή με μία μόνο πράξη!",
    step2For: "Για το",
    step2GcdIs: "ο Μ.Κ.Δ.(12, 36) ＝",
    step2GoldRule: "Κανόνας Χρυσού: Η διαίρεση με τον Μ.Κ.Δ. εξοικονομεί χρόνο και εκμηδενίζει τα λάθη στις πράξεις.",

    // Βήμα 3
    step3Badge: "ΒΗΜΑ 3",
    step3Sub: "Τελική Μορφή",
    step3Title: "Τι είναι το Ανάγωγο Κλάσμα;",
    step3Text: "Ανάγωγο λέγεται το κλάσμα που δεν μπορεί να απλοποιηθεί άλλο. Αυτό συμβαίνει όταν ο αριθμητής και ο παρονομαστής έχουν μοναδικό κοινό διαιρέτη το 1.",
    step3ExamplesTitle: "Παραδείγματα ανάγωγων κλασμάτων:",
    step3CoprimeNote: "Παρατηρήστε ότι οι αριθμοί 9 και 16 δεν είναι πρώτοι, αλλά είναι πρώτοι μεταξύ τους (Μ.Κ.Δ. ＝ 1).",
    step3MustIrreducible: "Στα μαθηματικά, κάθε τελικό αποτέλεσμα κλάσματος πρέπει να γράφεται πάντα στην ανάγωγη μορφή του!",

    // Βήμα 4
    step4Badge: "ΒΗΜΑ 4",
    step4Sub: "Στρατηγική",
    step4Title: "Σταδιακή Απλοποίηση",
    step4Text: "Αν δεν βλέπουμε αμέσως τον Μ.Κ.Δ. σε μεγάλους αριθμούς, εφαρμόζουμε τα κριτήρια διαιρετότητας σταδιακά (διαιρούμε με 2, 3, 5, 10).",
    step4Step1Note: "(άρτιοι, διά 2) ＝",
    step4Step2Note: "(άρτιοι, διά 2) ＝",
    step4Step3Note: "(διαιρούνται με 3) ＝",
    step4IrreducibleTag: "(Ανάγωγο!)",
    step4BothMethodsNote: "Και οι δύο μέθοδοι (σταδιακή και μέσω Μ.Κ.Δ.) οδηγούν ακριβώς στο ίδιο ανάγωγο κλάσμα.",
    step4CheckTip: "Έλεγχος: Αν οι δύο όροι είναι άρτιοι, διαιρούνται σίγουρα τουλάχιστον με το 2.",

    // Εργαστήριο
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Εξερεύνηση Απλοποίησης & Μ.Κ.Δ.",
    labDesc: "Όρισε ελεύθερα τους όρους του κλάσματος. Το εργαστήριο εντοπίζει αυτόματα τον Μ.Κ.Δ., υπολογίζει την ανάγωγη μορφή και συγκρίνει τα σχήματα.",
    viewPies: "🍕 Κυκλικοί Δίσκοι",
    viewBars: "🍫 Ορθογώνιες Ράβδοι",
    settingsTitle: "ΡΥΘΜΙΣΕΙΣ ΚΛΑΣΜΑΤΟΣ",
    numLabel: "Αριθμητής:",
    denLabel: "Παρονομαστής:",
    mathAnalysisTitle: "ΜΑΘΗΜΑΤΙΚΗ ΑΝΑΛΥΣΗ",
    gcdNotation: "Μ.Κ.Δ.",
    isIrreducibleMsg: "είναι ανάγωγο!",
    alreadyIrreducibleTitle: "✨ Το κλάσμα είναι ήδη Ανάγωγο!",
    alreadyIrreducibleDesc: "Ο αριθμητής και ο παρονομαστής έχουν Μ.Κ.Δ. ＝ 1.",
    comparisonTitle: "ΠΑΡΑΛΛΗΛΗ ΟΠΤΙΚΗ ΣΥΓΚΡΙΣΗ",
    sameQuantityBadge: "Ίδια ποσότητα",
    initialFractionBadge: "ΑΡΧΙΚΟ ΚΛΑΣΜΑ",
    irreducibleFractionBadge: "ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ",
    partsOfTotal: "από τα",
    equalPartsSuffix: "ίσα μέρη",
    calloutSimplified: "📢 Με τη διαίρεση των δύο όρων με το",
    calloutSimplifiedEnd: "(τον Μ.Κ.Δ.), ομαδοποιήσαμε τα μέρη χωρίς να αλλάξει η συνολική ποσότητα!",
    calloutAlreadyIrreducible: "📢 Τα δύο σχήματα είναι πανομοιότυπα επειδή το κλάσμα βρίσκεται ήδη στην απλούστερη δυνατή (ανάγωγη) μορφή του.",

    // Callout & Footer
    calloutTitle: "Ώρα για Εξάσκηση στην Απλοποίηση!",
    calloutDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις με εύρεση Μ.Κ.Δ., πλήρη απλοποίηση σε ανάγωγο κλάσμα και εφαρμογή σε σύνθετα προβλήματα.",
    calloutBtn: "Έναρξη Ασκήσεων",
    bottomFooterText: "Κεφάλαιο 3 • Απλοποίηση Κλάσματος",
    bottomFooterBtn: "Μετάβαση στις Ασκήσεις"
  },
  en: {
    pageTitle: "Fraction Simplification - Grade 5 | LearnMaths.gr",
    pageDesc: "Learn how to simplify fractions by dividing by the GCD, understand irreducible forms, and explore hands-on in the interactive lab for Grade 5.",
    backText: "Grade 5",
    exercisesBtn: "Exercises",
    headerBadge: "CHAPTER 3 • GRADE 5",
    headerTitle: "Fraction Simplification & Irreducible Form",
    headerDesc: "Discover how to reduce the terms of a fraction by dividing by common factors, how to reach an irreducible fraction in one single step using the GCD, and why the value remains constant.",
    interactiveTag: "Theory & Automatic Irreducible Visuals",
    tryExercises: "Try the Exercises",

    stepsTitle: "Core Concepts in 4 Steps",
    stepsDesc: "The mathematical reasoning behind fraction simplification and irreducible representations.",

    // Step 1
    step1Badge: "STEP 1",
    step1Sub: "Definition",
    step1Title: "What is Simplification?",
    step1Text: "Simplifying a fraction means dividing both terms (numerator and denominator) by the same non-zero whole number (their common divisor, different from 1).",
    step1Desc: "Simplification yields an equivalent fraction with smaller terms, making calculations and mental math much simpler.",
    step1Note: "Even though the numbers become smaller, the actual fractional value and quantity remain identical.",

    // Step 2
    step2Badge: "STEP 2",
    step2Sub: "The Shortest Path",
    step2Title: "The Role of the GCD",
    step2Text: "Dividing both terms by any common divisor reduces the fraction, but additional reduction steps may still be required.",
    step2Desc: "Dividing directly by the Greatest Common Divisor (GCD) yields the irreducible fraction in a single operation!",
    step2For: "For",
    step2GcdIs: "the GCD(12, 36) ＝",
    step2GoldRule: "Golden Rule: Dividing by the GCD saves time and eliminates arithmetic errors.",

    // Step 3
    step3Badge: "STEP 3",
    step3Sub: "Final Form",
    step3Title: "What is an Irreducible Fraction?",
    step3Text: "A fraction is called irreducible (or in simplest form) when it cannot be simplified any further. This occurs when the numerator and denominator share no common factors other than 1.",
    step3ExamplesTitle: "Examples of irreducible fractions:",
    step3CoprimeNote: "Notice that numbers 9 and 16 are composite, but they are coprime (their GCD ＝ 1).",
    step3MustIrreducible: "In mathematics, every final fraction answer must always be given in its irreducible form!",

    // Step 4
    step4Badge: "STEP 4",
    step4Sub: "Strategy",
    step4Title: "Step-by-Step Simplification",
    step4Text: "When the GCD is not immediately obvious for large numbers, apply divisibility tests progressively (divide by 2, 3, 5, 10).",
    step4Step1Note: "(both even, divide by 2) ＝",
    step4Step2Note: "(both even, divide by 2) ＝",
    step4Step3Note: "(divisible by 3) ＝",
    step4IrreducibleTag: "(Irreducible!)",
    step4BothMethodsNote: "Both methods (progressive division and direct division by GCD) lead to the exact same irreducible fraction.",
    step4CheckTip: "Quick check: If both terms are even, they are always divisible by at least 2.",

    // Lab
    labBadge: "INTERACTIVE LAB",
    labTitle: "Simplification & GCD Explorer",
    labDesc: "Freely choose any numerator and denominator. The lab dynamically computes the GCD, displays the irreducible fraction, and visually contrasts both models.",
    viewPies: "🍕 Circular Discs",
    viewBars: "🍫 Rectangular Bars",
    settingsTitle: "FRACTION SETTINGS",
    numLabel: "Numerator:",
    denLabel: "Denominator:",
    mathAnalysisTitle: "MATHEMATICAL BREAKDOWN",
    gcdNotation: "GCD",
    isIrreducibleMsg: "is irreducible!",
    alreadyIrreducibleTitle: "✨ This Fraction is Already Irreducible!",
    alreadyIrreducibleDesc: "The numerator and denominator share a GCD ＝ 1.",
    comparisonTitle: "SIDE-BY-SIDE VISUAL COMPARISON",
    sameQuantityBadge: "Equal Quantity",
    initialFractionBadge: "INITIAL FRACTION",
    irreducibleFractionBadge: "IRREDUCIBLE FRACTION",
    partsOfTotal: "out of",
    equalPartsSuffix: "equal parts",
    calloutSimplified: "📢 By dividing both terms by",
    calloutSimplifiedEnd: "(their GCD), we regrouped the partitions without changing the total area!",
    calloutAlreadyIrreducible: "📢 Both visual representations are identical because this fraction is already in simplest form.",

    // Callout & Footer
    calloutTitle: "Time to Practice Simplification!",
    calloutDesc: "Test your skills with challenging exercises covering GCD calculations, reducing fractions to simplest terms, and word problems.",
    calloutBtn: "Start Exercises",
    bottomFooterText: "Chapter 3 • Fraction Simplification",
    bottomFooterBtn: "Go to Exercises"
  }
};

export default function AplopoiisiTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  // Αρχικό Κλάσμα
  const [num, setNum] = useState(8);
  const [den, setDen] = useState(12);

  // Τύπος οπτικοποίησης (Κυκλικοί Δίσκοι ή Ορθογώνιες Ράβδοι)
  const [viewType, setViewType] = useState('pie'); // 'pie' | 'bar'

  const MIN_NUM = 1;
  const MIN_DEN = 2;
  const MAX_DEN = 24;

  // Εύρεση Μέγιστου Κοινού Διαιρέτη (ΜΚΔ)
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

  const gcd = findGCD(num, den);
  const simpleNum = num / gcd;
  const simpleDen = den / gcd;
  const isSimplified = gcd > 1;

  // Σχεδίαση τομέων κυκλικού δίσκου (Responsive SVG)
  const renderPieSlices = (currentNum, currentDen, fillColor = 'fill-amber-500') => {
    const slices = [];
    const radius = 88;
    const cx = 100;
    const cy = 100;

    for (let i = 0; i < currentDen; i++) {
      const isFilled = i < currentNum;

      if (currentDen === 1) {
        return (
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            className={`${
              isFilled ? fillColor : 'fill-slate-100'
            } stroke-slate-800 stroke-[2.5] transition-colors duration-150`}
          />
        );
      }

      const startAngle = (i * 360) / currentDen - 90;
      const endAngle = ((i + 1) * 360) / currentDen - 90;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);

      const largeArc = 360 / currentDen > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      slices.push(
        <path
          key={`pie-${currentDen}-${i}`}
          d={pathData}
          className={`${
            isFilled ? fillColor : 'fill-slate-100'
          } stroke-slate-800 stroke-[2] transition-colors duration-150`}
        />
      );
    }
    return slices;
  };

  // Σχεδίαση ορθογώνιας ράβδου (Responsive SVG)
  const renderBarParts = (currentNum, currentDen, fillColor = 'fill-amber-500') => {
    const rects = [];
    const totalWidth = 260;
    const barHeight = 64;
    const startX = 20;
    const startY = 28;
    const partWidth = totalWidth / currentDen;

    for (let i = 0; i < currentDen; i++) {
      const isFilled = i < currentNum;
      const x = startX + i * partWidth;

      rects.push(
        <rect
          key={`bar-${currentDen}-${i}`}
          x={x}
          y={startY}
          width={partWidth}
          height={barHeight}
          className={`${
            isFilled ? fillColor : 'fill-slate-100'
          } stroke-slate-800 stroke-[2] transition-colors duration-150`}
        />
      );
    }
    return rects;
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/03-aplopoiisi-ask"
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
              href="/e-dimotikou/03-aplopoiisi-ask"
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
                  <p className="text-slate-700">
                    {t.step1Desc}
                  </p>
                  <div className="py-2 flex items-center justify-center font-mono">
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-300 shadow-inner text-sm sm:text-base 2xl:text-lg">
                      <Fraction num="6 : 2" den="10 : 2" size="md" className="text-rose-600" />
                      <span className="font-sans">＝</span>
                      <Fraction num={3} den={5} size="md" className="text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 {t.step1Note}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
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
                    {t.step2Desc}
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono text-xs sm:text-sm space-y-2">
                    <div className="flex items-center flex-wrap gap-1">
                      <span>{t.step2For}</span>
                      <Fraction num={12} den={36} size="sm" className="text-slate-900" />
                      <span>{t.step2GcdIs}</span>
                      <strong className="text-blue-600">12</strong>.
                    </div>
                    <div className="font-bold text-emerald-700 pt-1 flex items-center justify-center gap-1.5">
                      <Fraction num="12 : 12" den="36 : 12" size="sm" />
                      <span className="font-sans">＝</span>
                      <Fraction num={1} den={3} size="sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ {t.step2GoldRule}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700 font-semibold">{t.step3ExamplesTitle}</p>
                  <div className="grid grid-cols-3 gap-2 font-mono font-bold text-center">
                    <span className="p-2 bg-white rounded-lg border border-slate-200 text-emerald-700 flex items-center justify-center">
                      <Fraction num={2} den={3} size="sm" />
                    </span>
                    <span className="p-2 bg-white rounded-lg border border-slate-200 text-emerald-700 flex items-center justify-center">
                      <Fraction num={5} den={7} size="sm" />
                    </span>
                    <span className="p-2 bg-white rounded-lg border border-slate-200 text-emerald-700 flex items-center justify-center">
                      <Fraction num={9} den={16} size="sm" />
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs 2xl:text-sm">
                    {t.step3CoprimeNote}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🎯 {t.step3MustIrreducible}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="font-mono bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-slate-800 flex items-center flex-wrap gap-1">
                      <Fraction num={60} den={84} size="sm" />
                      <span>{t.step4Step1Note}</span>
                      <Fraction num={30} den={42} size="sm" className="text-blue-600" />
                    </div>
                    <div className="text-slate-800 flex items-center flex-wrap gap-1">
                      <Fraction num={30} den={42} size="sm" />
                      <span>{t.step4Step2Note}</span>
                      <Fraction num={15} den={21} size="sm" className="text-indigo-600" />
                    </div>
                    <div className="text-slate-800 flex items-center flex-wrap gap-1">
                      <Fraction num={15} den={21} size="sm" />
                      <span>{t.step4Step3Note}</span>
                      <Fraction num={5} den={7} size="sm" className="text-emerald-600" />
                      <strong className="text-emerald-700">{t.step4IrreducibleTag}</strong>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs">
                    {t.step4BothMethodsNote}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 {t.step4CheckTip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΑΠΛΟΠΟΙΗΣΗΣ */}
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
            {/* Αριστερή Στήλη: Χειριστήρια & Μαθηματική Εξίσωση */}
            <div className="xl:col-span-5 2xl:col-span-4 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500 uppercase">
                {toCleanUppercase(t.settingsTitle)}
              </h4>

              {/* Stepper Αριθμητή */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.numLabel}</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
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
                    max={den}
                    step={1}
                    value={num}
                    onChange={(e) => setNum(Number(e.target.value))}
                    aria-label="Numerator"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Increase numerator by 1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setNum((prev) => Math.min(den, prev + 1));
                    }}
                    disabled={num >= den}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Stepper Παρονομαστή */}
              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.denLabel}</span>
                  <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-lg 2xl:text-xl text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
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
                      const nextDen = Math.max(MIN_DEN, den - 1);
                      setDen(nextDen);
                      if (num > nextDen) setNum(nextDen);
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
                    onChange={(e) => {
                      const nextDen = Number(e.target.value);
                      setDen(nextDen);
                      if (num > nextDen) setNum(nextDen);
                    }}
                    aria-label="Denominator"
                    className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
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
              </div>

              {/* Μαθηματική Εξίσωση & Ταυτότητα Απλοποίησης */}
              <div className="p-4 2xl:p-6 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs 2xl:text-sm font-bold text-slate-500 tracking-wider uppercase">
                    {toCleanUppercase(t.mathAnalysisTitle)}
                  </span>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                    {t.gcdNotation}({num}, {den}) ＝ {gcd}
                  </span>
                </div>

                {isSimplified ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-mono">
                      <Fraction num={num} den={den} size="xl" className="text-blue-600" />
                      <span className="font-sans text-slate-400 text-lg">＝</span>
                      <Fraction num={`${num} : ${gcd}`} den={`${den} : ${gcd}`} size="md" className="text-amber-600" />
                      <span className="font-sans text-slate-400 text-lg">＝</span>
                      <Fraction num={simpleNum} den={simpleDen} size="xl" className="text-emerald-600" />
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs 2xl:text-sm font-medium text-center flex items-center justify-center flex-wrap gap-1">
                      <span>Το κλάσμα</span>
                      <Fraction num={simpleNum} den={simpleDen} size="sm" />
                      <span>{t.isIrreducibleMsg}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-center text-indigo-900 font-bold text-xs 2xl:text-sm">
                    {t.alreadyIrreducibleTitle}
                    <div className="text-[11px] font-normal text-indigo-700 mt-0.5">
                      {t.alreadyIrreducibleDesc}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Δεξιά Στήλη: Παράλληλη Οπτική Σύγκριση (Αρχικό vs Ανάγωγο) */}
            <div className="xl:col-span-7 2xl:col-span-8 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center min-h-[380px] 2xl:min-h-[500px] space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm 2xl:text-base font-bold text-slate-500 px-2">
                <span>{toCleanUppercase(t.comparisonTitle)}</span>
                <span className="font-mono text-emerald-600 font-bold">{t.sameQuantityBadge}</span>
              </div>

              {/* Πλέγμα 2 στηλών για τα δύο κλάσματα */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
                {/* Κάρτα Αρχικού Κλάσματος */}
                <div className="w-full max-w-[280px] 2xl:max-w-[340px] bg-white p-5 2xl:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs 2xl:text-sm font-black tracking-wider">
                    {toCleanUppercase(t.initialFractionBadge)}
                  </div>

                  <Fraction num={num} den={den} size="xl" className="text-blue-600" />

                  {viewType === 'pie' ? (
                    <div className="w-full aspect-square max-w-[190px] 2xl:max-w-[240px]">
                      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm" aria-label="Initial pie visual">
                        {renderPieSlices(num, den, 'fill-blue-500')}
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full aspect-[300/120] max-w-[240px] 2xl:max-w-[280px]">
                      <svg viewBox="0 0 300 120" className="w-full h-full drop-shadow-sm" aria-label="Initial bar visual">
                        {renderBarParts(num, den, 'fill-blue-500')}
                      </svg>
                    </div>
                  )}

                  <span className="text-xs 2xl:text-sm text-slate-500 font-medium">
                    {num} {t.partsOfTotal} {den} {t.equalPartsSuffix}
                  </span>
                </div>

                {/* Κάρτα Ανάγωγου Κλάσματος */}
                <div className="w-full max-w-[280px] 2xl:max-w-[340px] bg-white p-5 2xl:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs 2xl:text-sm font-black tracking-wider">
                    {toCleanUppercase(t.irreducibleFractionBadge)}
                  </div>

                  <Fraction num={simpleNum} den={simpleDen} size="xl" className="text-emerald-600" />

                  {viewType === 'pie' ? (
                    <div className="w-full aspect-square max-w-[190px] 2xl:max-w-[240px]">
                      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm" aria-label="Irreducible pie visual">
                        {renderPieSlices(simpleNum, simpleDen, 'fill-emerald-500')}
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full aspect-[300/120] max-w-[240px] 2xl:max-w-[280px]">
                      <svg viewBox="0 0 300 120" className="w-full h-full drop-shadow-sm" aria-label="Irreducible bar visual">
                        {renderBarParts(simpleNum, simpleDen, 'fill-emerald-500')}
                      </svg>
                    </div>
                  )}

                  <span className="text-xs 2xl:text-sm text-slate-500 font-medium">
                    {simpleNum} {t.partsOfTotal} {simpleDen} {t.equalPartsSuffix}
                  </span>
                </div>
              </div>

              {/* Επεξηγηματικό Callout Συμπεράσματος */}
              <div className="p-4 bg-emerald-600 text-white rounded-2xl text-center font-bold text-xs sm:text-sm 2xl:text-base shadow-sm max-w-xl">
                {isSimplified ? (
                  <span>
                    {t.calloutSimplified} <span className="text-amber-300 font-black">{gcd}</span> {t.calloutSimplifiedEnd}
                  </span>
                ) : (
                  <span>
                    {t.calloutAlreadyIrreducible}
                  </span>
                )}
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
            href="/e-dimotikou/03-aplopoiisi-ask"
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
            href="/e-dimotikou/03-aplopoiisi-ask"
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
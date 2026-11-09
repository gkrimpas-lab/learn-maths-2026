// pages/st-dimotikou/25-isodinama-klasmata.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μέγιστες επιτρεπόμενες τιμές
const MAX_VALUE = 100;
const MAX_MULTIPLIER = 10;

// Αυστηρή συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Μορφοποίηση αριθμών βάσει locale
function formatNum(num, locale = 'el') {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  return Number(num).toLocaleString(loc);
}

// Component για κανονική κατακόρυφη μορφή κλάσματος
function FractionDisplay({ num, den, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: { numDen: 'text-xs sm:text-sm font-bold', line: 'w-full h-0.5' },
    md: { numDen: 'text-sm sm:text-base font-black', line: 'w-full h-0.5' },
    lg: { numDen: 'text-lg sm:text-xl md:text-2xl font-black', line: 'w-full h-1' },
    xl: { numDen: 'text-2xl sm:text-3xl font-black', line: 'w-full h-1.5' }
  };

  const selected = sizeClasses[size] || sizeClasses.md;

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle font-mono leading-none px-1 ${className}`}>
      <span className={`${selected.numDen} pb-0.5`}>{num}</span>
      <span className={`${selected.line} bg-current rounded-full my-0.5 min-w-[12px]`} />
      <span className={`${selected.numDen} pt-0.5`}>{den}</span>
    </span>
  );
}

const PRESETS_CREATE = [
  { num: 1, den: 2, mult: 2 },
  { num: 2, den: 3, mult: 3 },
  { num: 3, den: 4, mult: 2 },
  { num: 2, den: 5, mult: 4 }
];

const PRESETS_REDUCE = [
  { num: 6, den: 8 },
  { num: 12, den: 18 },
  { num: 15, den: 20 },
  { num: 9, den: 12 }
];

const TRANSLATIONS = {
  el: {
    pageTitle: "Ισοδύναμα Κλάσματα & Ανάγωγο - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθε πώς δημιουργούμε ισοδύναμα κλάσματα πολλαπλασιάζοντας τους όρους τους και πώς τα απλοποιούμε με τον Μ.Κ.Δ. για να φτάσουμε στο απλούστερο ανάγωγο κλάσμα για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 25 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Ισοδύναμα Κλάσματα και Απλοποίηση σε Ανάγωγο",
    heroDesc: "Μάθε πώς δημιουργούμε ισοδύναμα κλάσματα πολλαπλασιάζοντας τους όρους τους και πώς τα απλοποιούμε με τον Μ.Κ.Δ. για να φτάσουμε στο απλούστερο ανάγωγο κλάσμα!",
    heroFeature: "Διαδραστική Δημιουργία & Απλοποίηση με Οπτική Επιβεβαίωση Επιφανειών",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες, Δημιουργία Ισοδυνάμων & Απλοποίηση",
    theorySubtitle: "Πώς διατηρείται η αξία ενός κλάσματος και πώς φτάνουμε στην απλούστερη μορφή του.",
    card1Badge: "ΟΡΙΣΜΟΣ",
    card1Sub: "Ίδια Ποσότητα",
    card1Title: "Τι είναι τα Ισοδύναμα;",
    card1Text: "Είναι τα κλάσματα που έχουν διαφορετικούς όρους, αλλά εκφράζουν την ίδια ακριβώς ποσότητα ή αξία.",
    card1Tip: "💡 Αν κάνεις τη διαίρεση σε όλα τα ισοδύναμα κλάσματα, θα βρεις τον ίδιο ακριβώς δεκαδικό αριθμό!",
    card2Badge: "ΜΕΘΟΔΟΣ",
    card2Sub: "Ίδιος Αριθμός",
    card2Title: "Δημιουργία Ισοδυνάμων",
    card2Text: "Πολλαπλασιάζουμε ή διαιρούμε και τον αριθμητή και τον παρονομαστή με τον ίδιο φυσικό αριθμό (διάφορο του 0).",
    card2Tip: "⚡ Κανόνας SOS: Ό,τι πράξη κάνεις στον αριθμητή, πρέπει υποχρεωτικά να την κάνεις και στον παρονομαστή!",
    card3Badge: "ΑΠΛΟΠΟΙΗΣΗ",
    card3Sub: "Με Μ.Κ.Δ.",
    card3Title: "Ανάγωγο Κλάσμα",
    card3Text: "Είναι το κλάσμα που δεν μπορεί να απλοποιηθεί άλλο. Προκύπτει διαιρώντας τους όρους με τον Μ.Κ.Δ. τους!",
    card3IrreducibleBadge: "(Ανάγωγο)",
    card3Tip: "🎯 Στο ανάγωγο κλάσμα, ο αριθμητής και ο παρονομαστής έχουν Μ.Κ.Δ. ίσο με το 1 (είναι πρώτοι μεταξύ τους).",
    tabCreate: "Δημιουργία Ισοδυνάμου",
    tabReduce: "Μετατροπή σε Ανάγωγο",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Ισοδυναμίας και Απλοποίησης",
    labSubtitleCreate: "Δώσε ένα κλάσμα, επίλεξε πολλαπλασιαστή και παρατήρησε πώς προκύπτει το νέο ισοδύναμο κλάσμα!",
    labSubtitleReduce: "Δώσε ένα σύνθετο κλάσμα και δες βήμα προς βήμα την απλοποίησή του μέσω του Μ.Κ.Δ. σε ανάγωγο!",
    initFraction: "1. ΑΡΧΙΚΟ ΚΛΑΣΜΑ:",
    numerator: "ΑΡΙΘΜΗΤΗΣ",
    denominator: "ΠΑΡΟΝΟΜΑΣΤΗΣ",
    multiplierLabel: "Πολλαπλασιαστής:",
    presetsTitle: "ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:",
    reduceHeading: "ΚΛΑΣΜΑ ΓΙΑ ΑΠΛΟΠΟΙΗΣΗ:",
    gcdHeading: "🔍 ΜΕΓΙΣΤΟΣ ΚΟΙΝΟΣ ΔΙΑΙΡΕΤΗΣ:",
    gcdIsOne: "Το κλάσμα είναι ήδη ανάγωγο!",
    gcdDivideMsg: (g) => `Διαιρούμε και τους δύο όρους με το ${g}.`,
    gcdLabel: "Μ.Κ.Δ.",
    tipEquivalentValue: "💡 Τα ισοδύναμα κλάσματα έχουν την ίδια ακριβώς δεκαδική αξία!",
    originalFractionTitle: "ΑΡΧΙΚΟ ΚΛΑΣΜΑ",
    equivalentFractionTitle: "ΙΣΟΔΥΝΑΜΟ ΚΛΑΣΜΑ",
    irreducibleFractionTitle: "ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ",
    visualConfirmation: "⚖️ ΟΠΤΙΚΗ ΕΠΙΒΕΒΑΙΩΣΗ: Οι χρωματισμένες επιφάνειες στους δύο κύκλους είναι ακριβώς ίσες!",
    ctaTitle: "Ώρα για Εξάσκηση στα Ισοδύναμα Κλάσματα!",
    ctaDesc: "Έμαθες να δημιουργείς ισοδύναμα και να απλοποιείς σε ανάγωγο κλάσμα; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Equivalent & Irreducible Fractions - 6th Grade | LearnMaths.gr",
    pageDesc: "Learn how to generate equivalent fractions by multiplying terms, and simplify using the GCD to find the irreducible fraction for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 25 • 6TH GRADE",
    heroTitle: "Equivalent Fractions & Simplification to Lowest Terms",
    heroDesc: "Discover how to create equivalent fractions by multiplying both terms, and simplify using the GCD to obtain the simplest irreducible fraction!",
    heroFeature: "Interactive Creation & Simplification with Visual Area Confirmation",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts, Generating Equivalents & Simplification",
    theorySubtitle: "How fraction value is preserved and how we reach its simplest irreducible form.",
    card1Badge: "DEFINITION",
    card1Sub: "Equal Value",
    card1Title: "What are Equivalent Fractions?",
    card1Text: "Fractions with different terms that represent the exact same quantity, portion, or value.",
    card1Tip: "💡 If you perform division on equivalent fractions, you will always get the exact same decimal number!",
    card2Badge: "METHOD",
    card2Sub: "Same Factor",
    card2Title: "Generating Equivalents",
    card2Text: "Multiply or divide both numerator and denominator by the exact same non-zero whole number.",
    card2Tip: "⚡ Golden Rule: Whatever operation you apply to the numerator, you MUST apply to the denominator!",
    card3Badge: "SIMPLIFICATION",
    card3Sub: "Via GCD",
    card3Title: "Irreducible Fraction",
    card3Text: "A fraction that cannot be simplified further. It is obtained by dividing terms by their Greatest Common Divisor (GCD)!",
    card3IrreducibleBadge: "(Irreducible)",
    card3Tip: "🎯 In an irreducible fraction, numerator and denominator have GCD ＝ 1 (they are coprime).",
    tabCreate: "Create Equivalent",
    tabReduce: "Reduce to Lowest Terms",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Equivalence & Simplification Lab",
    labSubtitleCreate: "Choose a base fraction and a multiplier to observe how the new equivalent fraction is formed!",
    labSubtitleReduce: "Enter any composite fraction to follow its step-by-step reduction to lowest terms using the GCD!",
    initFraction: "1. INITIAL FRACTION:",
    numerator: "NUMERATOR",
    denominator: "DENOMINATOR",
    multiplierLabel: "Multiplier:",
    presetsTitle: "PRESET EXAMPLES:",
    reduceHeading: "FRACTION TO SIMPLIFY:",
    gcdHeading: "🔍 GREATEST COMMON DIVISOR:",
    gcdIsOne: "The fraction is already in lowest terms (irreducible)!",
    gcdDivideMsg: (g) => `Divide both terms by ${g}.`,
    gcdLabel: "GCD",
    tipEquivalentValue: "💡 Equivalent fractions always have the exact same decimal value!",
    originalFractionTitle: "ORIGINAL FRACTION",
    equivalentFractionTitle: "EQUIVALENT FRACTION",
    irreducibleFractionTitle: "IRREDUCIBLE FRACTION",
    visualConfirmation: "⚖️ VISUAL CONFIRMATION: The shaded areas in both circles are identical!",
    ctaTitle: "Time to Practice Equivalent Fractions!",
    ctaDesc: "Mastered building equivalents and simplifying to lowest terms? Test your skills with 10 interactive questions to consolidate your knowledge!",
    ctaBtn: "Start Exercises"
  }
};

export default function IsodinamaKlasmataPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [activeTab, setActiveTab] = useState('create');

  // Λειτουργία 1 (Δημιουργία Ισοδυνάμου)
  const [num1, setNum1] = useState(1);
  const [den1, setDenominator1] = useState(2);
  const [multiplier, setMultiplier] = useState(3);

  // Λειτουργία 2 (Μετατροπή σε Ανάγωγο)
  const [num2, setNum2] = useState(6);
  const [den2, setDenominator2] = useState(8);

  const handleInputChange = (setter, val, currentPair, isDenominator = false) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setter('');
      return;
    }
    const n = Number(clean);

    if (isDenominator) {
      if (n === 0 || n > MAX_VALUE) return;
      setter(n);
      if (currentPair.num > n) {
        currentPair.setNum(n);
      }
    } else {
      if (n > (currentPair.den || MAX_VALUE) || n > MAX_VALUE) return;
      setter(n);
    }
  };

  const adjustValue1 = (type, amount) => {
    if (type === 'num') {
      setNum1(prev => Math.max(0, Math.min(Number(den1) || MAX_VALUE, (Number(prev) || 0) + amount)));
    } else {
      setDenominator1(prev => {
        const nextDen = Math.max(1, Math.min(MAX_VALUE, (Number(prev) || 1) + amount));
        if (num1 > nextDen) setNum1(nextDen);
        return nextDen;
      });
    }
  };

  const adjustValue2 = (type, amount) => {
    if (type === 'num') {
      setNum2(prev => Math.max(0, Math.min(Number(den2) || MAX_VALUE, (Number(prev) || 0) + amount)));
    } else {
      setDenominator2(prev => {
        const nextDen = Math.max(1, Math.min(MAX_VALUE, (Number(prev) || 1) + amount));
        if (num2 > nextDen) setNum2(nextDen);
        return nextDen;
      });
    }
  };

  const findGcd = (a, b) => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      const temp = y;
      y = x % y;
      x = temp;
    }
    return x;
  };

  const activeNum1 = num1 === '' ? 0 : Number(num1);
  const activeDen1 = den1 === '' || den1 === 0 ? 1 : Number(den1);
  const safeMultiplier = Math.min(multiplier, MAX_MULTIPLIER);

  const isoNum = activeNum1 * safeMultiplier;
  const isoDen = activeDen1 * safeMultiplier;

  const activeNum2 = num2 === '' ? 0 : Number(num2);
  const activeDen2 = den2 === '' || den2 === 0 ? 1 : Number(den2);
  const gcd = findGcd(activeNum2, activeDen2) || 1;

  const reducedNum = activeNum2 / gcd;
  const reducedDen = activeDen2 / gcd;

  const renderPizzaDiagram = (num, den, fillColor = 'fill-blue-500', strokeColor = 'stroke-blue-700') => {
    const slices = [];
    const radius = 60;
    const cx = 75;
    const cy = 75;
    const activeSlices = Math.max(0, Math.min(den, num));

    for (let i = 0; i < den; i++) {
      const angleStep = 360 / den;
      const startAngle = i * angleStep - 90;
      const endAngle = (i + 1) * angleStep - 90;

      const rad1 = (startAngle * Math.PI) / 180;
      const rad2 = (endAngle * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(rad1);
      const y1 = cy + radius * Math.sin(rad1);
      const x2 = cx + radius * Math.cos(rad2);
      const y2 = cy + radius * Math.sin(rad2);

      const largeArcFlag = angleStep > 180 ? 1 : 0;

      const d = den === 1
        ? `M ${cx} ${cy} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const isFilled = i < activeSlices;

      slices.push(
        <path
          key={i}
          d={d}
          className={`${
            isFilled 
              ? `${fillColor} ${strokeColor}` 
              : 'fill-slate-100 stroke-slate-300'
          } transition-colors duration-200 stroke-[1.2]`}
        />
      );
    }

    return (
      <svg width="150" height="150" viewBox="0 0 150 150" className="drop-shadow-xs overflow-visible shrink-0 max-w-full">
        {slices}
        <circle cx={cx} cy={cy} r="2.5" className="fill-slate-800" />
      </svg>
    );
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/25-isodinama-klasmata-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.navExercises}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.heroBadge}</span>
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
              <span>{t.heroFeature}</span>
            </div>
            <Link
              href="/st-dimotikou/25-isodinama-klasmata-ask"
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
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.card1Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.card1Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.card1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.card1Text}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-center flex items-center justify-center gap-2 font-bold">
                  <FractionDisplay num="1" den="2" size="sm" />
                  <span>＝</span>
                  <FractionDisplay num="2" den="4" size="sm" className="text-sky-700" />
                  <span>＝</span>
                  <FractionDisplay num="4" den="8" size="sm" className="text-sky-700" />
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.card1Tip}
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.card2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">{t.card2Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.card2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.card2Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold flex items-center justify-center gap-2">
                  <span className="flex flex-col items-center">
                    <span>1 · 3</span>
                    <span className="w-full h-0.5 bg-slate-700 my-0.5" />
                    <span>2 · 3</span>
                  </span>
                  <span>＝</span>
                  <FractionDisplay num="3" den="6" size="md" className="text-indigo-700" />
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {t.card2Tip}
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.card3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-600">{t.card3Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.card3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.card3Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold flex items-center justify-center gap-2">
                  <FractionDisplay num="6" den="8" size="sm" />
                  <span className="text-slate-500 font-sans text-xs">(: 2) ➔</span>
                  <FractionDisplay num="3" den="4" size="md" className="text-emerald-700" />
                  <span className="text-xs text-slate-600 font-sans">{t.card3IrreducibleBadge}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.card3Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. TABS SELECTOR */}
        <div className="flex justify-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner max-w-md mx-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
              activeTab === 'create' ? 'bg-blue-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛠️ {toCleanUppercase(t.tabCreate)}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reduce')}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
              activeTab === 'reduce' ? 'bg-emerald-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 {toCleanUppercase(t.tabReduce)}
          </button>
        </div>

        {/* 4. INTERACTIVE PLAYGROUND */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{t.labBadge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.labTitle}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-1">
                {activeTab === 'create' ? t.labSubtitleCreate : t.labSubtitleReduce}
              </p>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              
              {activeTab === 'create' ? (
                /* TAB 1: ΔΗΜΙΟΥΡΓΙΑ */
                <div className="space-y-4">
                  <div className="space-y-3">
                    <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                      {t.initFraction}
                    </span>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {/* ΑΡΙΘΜΗΤΗΣ */}
                      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-blue-200 shadow-xs space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.numerator}</span>
                        <div className="flex items-center gap-1 sm:gap-1.5 w-full">
                          <button
                            type="button"
                            onClick={() => adjustValue1('num', -1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-slate-100 hover:bg-slate-200 text-blue-700 rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            －
                          </button>
                          <input
                            key={`num1-${num1}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            spellCheck="false"
                            value={num1 === '' ? '' : String(num1)}
                            onChange={(e) => handleInputChange(setNum1, e.target.value, { num: num1, setNum: setNum1, den: den1 }, false)}
                            className="w-full min-w-0 flex-1 text-center font-mono font-black text-base sm:text-lg text-blue-600 bg-blue-50/50 rounded-lg py-1 px-0.5 outline-none border border-blue-200 shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => adjustValue1('num', 1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            ＋
                          </button>
                        </div>
                      </div>

                      {/* ΠΑΡΟΝΟΜΑΣΤΗΣ */}
                      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-blue-200 shadow-xs space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.denominator}</span>
                        <div className="flex items-center gap-1 sm:gap-1.5 w-full">
                          <button
                            type="button"
                            onClick={() => adjustValue1('den', -1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-slate-100 hover:bg-slate-200 text-blue-700 rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            －
                          </button>
                          <input
                            key={`den1-${den1}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            spellCheck="false"
                            value={den1 === '' ? '' : String(den1)}
                            onChange={(e) => handleInputChange(setDenominator1, e.target.value, { num: num1, setNum: setNum1, den: den1 }, true)}
                            className="w-full min-w-0 flex-1 text-center font-mono font-black text-base sm:text-lg text-blue-600 bg-blue-50/50 rounded-lg py-1 px-0.5 outline-none border border-blue-200 shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => adjustValue1('den', 1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            ＋
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* SLIDER ΠΟΛΛΑΠΛΑΣΙΑΣΤΗ */}
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>{t.multiplierLabel}</span>
                        <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                          · {safeMultiplier}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max={MAX_MULTIPLIER}
                        value={safeMultiplier}
                        onChange={(e) => setMultiplier(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none touch-manipulation"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold">
                        <span>· 2</span>
                        <span>· 4</span>
                        <span>· 6</span>
                        <span>· 8</span>
                        <span>· 10</span>
                      </div>
                    </div>

                    {/* PRESETS */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                        {t.presetsTitle}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {PRESETS_CREATE.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setNum1(p.num);
                              setDenominator1(p.den);
                              setMultiplier(p.mult);
                            }}
                            className={`py-2 px-1.5 rounded-xl border text-xs transition-all text-center touch-manipulation active:scale-95 flex items-center justify-center gap-1.5 ${
                              activeNum1 === p.num && activeDen1 === p.den && safeMultiplier === p.mult
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                            }`}
                          >
                            <FractionDisplay num={p.num} den={p.den} size="sm" />
                            <span className="font-mono font-bold text-[11px]">(· {p.mult})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* TAB 2: ΑΝΑΓΩΓΟ */
                <div className="space-y-4">
                  <div className="space-y-3">
                    <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                      {t.reduceHeading}
                    </span>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {/* ΑΡΙΘΜΗΤΗΣ */}
                      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-emerald-200 shadow-xs space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.numerator}</span>
                        <div className="flex items-center gap-1 sm:gap-1.5 w-full">
                          <button
                            type="button"
                            onClick={() => adjustValue2('num', -1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-slate-100 hover:bg-slate-200 text-emerald-700 rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            －
                          </button>
                          <input
                            key={`num2-${num2}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            spellCheck="false"
                            value={num2 === '' ? '' : String(num2)}
                            onChange={(e) => handleInputChange(setNum2, e.target.value, { num: num2, setNum: setNum2, den: den2 }, false)}
                            className="w-full min-w-0 flex-1 text-center font-mono font-black text-base sm:text-lg text-emerald-600 bg-emerald-50/50 rounded-lg py-1 px-0.5 outline-none border border-emerald-200 shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => adjustValue2('num', 1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            ＋
                          </button>
                        </div>
                      </div>

                      {/* ΠΑΡΟΝΟΜΑΣΤΗΣ */}
                      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-emerald-200 shadow-xs space-y-1 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.denominator}</span>
                        <div className="flex items-center gap-1 sm:gap-1.5 w-full">
                          <button
                            type="button"
                            onClick={() => adjustValue2('den', -1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-slate-100 hover:bg-slate-200 text-emerald-700 rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            －
                          </button>
                          <input
                            key={`den2-${den2}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            spellCheck="false"
                            value={den2 === '' ? '' : String(den2)}
                            onChange={(e) => handleInputChange(setDenominator2, e.target.value, { num: num2, setNum: setNum2, den: den2 }, true)}
                            className="w-full min-w-0 flex-1 text-center font-mono font-black text-base sm:text-lg text-emerald-600 bg-emerald-50/50 rounded-lg py-1 px-0.5 outline-none border border-emerald-200 shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => adjustValue2('den', 1)}
                            className="w-7 sm:w-8 h-8 sm:h-9 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-sm flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            ＋
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* BOX Μ.Κ.Δ. / GCD */}
                    <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1 shadow-xs">
                      <span className="font-black uppercase tracking-wider block text-[10px]">
                        {t.gcdHeading}
                      </span>
                      <p>
                        {t.gcdLabel}({activeNum2}, {activeDen2}) ＝ <strong>{gcd}</strong>.{' '}
                        {gcd === 1 ? t.gcdIsOne : t.gcdDivideMsg(gcd)}
                      </p>
                    </div>

                    {/* PRESETS REDUCE */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                        {t.presetsTitle}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {PRESETS_REDUCE.map((p, idx) => {
                          const pGcd = findGcd(p.num, p.den);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setNum2(p.num);
                                setDenominator2(p.den);
                              }}
                              className={`py-2 px-1.5 rounded-xl border text-xs transition-all text-center touch-manipulation active:scale-95 flex items-center justify-center gap-1.5 ${
                                activeNum2 === p.num && activeDen2 === p.den
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                              }`}
                            >
                              <FractionDisplay num={p.num} den={p.den} size="sm" />
                              <span className="font-mono font-bold text-[10px]">
                                ({t.gcdLabel} ＝ {pGcd})
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                {t.tipEquivalentValue}
              </div>
            </div>

            {/* RIGHT: VISUALIZATION & DIAGRAMS */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              {activeTab === 'create' ? (
                /* TAB 1: ΔΗΜΙΟΥΡΓΙΑ */
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  {/* Μαθηματική Πράξη με Κατακόρυφα Κλάσματα */}
                  <div className="flex items-center justify-center p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
                    <div className="flex items-center gap-3 sm:gap-5 font-mono text-xl sm:text-2xl font-black">
                      <FractionDisplay num={activeNum1} den={activeDen1} size="lg" className="text-blue-600" />

                      <div className="text-slate-500 text-[10px] sm:text-xs font-sans font-bold text-center bg-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border border-slate-200 shadow-xs">
                        <div>· {safeMultiplier}</div>
                        <div className="border-t border-slate-200 my-0.5" />
                        <div>· {safeMultiplier}</div>
                      </div>

                      <span className="text-slate-400 font-light">＝</span>

                      <FractionDisplay num={isoNum} den={isoDen} size="lg" className="text-indigo-600" />
                    </div>
                  </div>

                  {/* Γραφική Αναπαράσταση */}
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-6 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider text-center flex items-center gap-1.5">
                        <span>{t.originalFractionTitle}:</span>
                        <FractionDisplay num={activeNum1} den={activeDen1} size="sm" />
                      </span>
                      {renderPizzaDiagram(activeNum1, activeDen1, 'fill-blue-500', 'stroke-blue-700')}
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider text-center flex items-center gap-1.5">
                        <span>{t.equivalentFractionTitle}:</span>
                        <FractionDisplay num={isoNum} den={isoDen} size="sm" />
                      </span>
                      {renderPizzaDiagram(isoNum, isoDen, 'fill-indigo-500', 'stroke-indigo-700')}
                    </div>
                  </div>
                </div>
              ) : (
                /* TAB 2: ΑΝΑΓΩΓΟ */
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  {/* Μαθηματική Πράξη με Κατακόρυφα Κλάσματα */}
                  <div className="flex items-center justify-center p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
                    <div className="flex items-center gap-3 sm:gap-5 font-mono text-xl sm:text-2xl font-black">
                      <FractionDisplay num={activeNum2} den={activeDen2} size="lg" className="text-emerald-600" />

                      <div className="text-slate-500 text-[10px] sm:text-xs font-sans font-bold text-center bg-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border border-slate-200 shadow-xs">
                        <div>: {gcd}</div>
                        <div className="border-t border-slate-200 my-0.5" />
                        <div>: {gcd}</div>
                      </div>

                      <span className="text-slate-400 font-light">＝</span>

                      <FractionDisplay num={reducedNum} den={reducedDen} size="lg" className="text-teal-600" />
                    </div>
                  </div>

                  {/* Γραφική Αναπαράσταση */}
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-6 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider text-center flex items-center gap-1.5">
                        <span>{t.originalFractionTitle}:</span>
                        <FractionDisplay num={activeNum2} den={activeDen2} size="sm" />
                      </span>
                      {renderPizzaDiagram(activeNum2, activeDen2, 'fill-emerald-500', 'stroke-emerald-700')}
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider text-center flex items-center gap-1.5">
                        <span>{t.irreducibleFractionTitle}:</span>
                        <FractionDisplay num={reducedNum} den={reducedDen} size="sm" />
                      </span>
                      {renderPizzaDiagram(reducedNum, reducedDen, 'fill-teal-500', 'stroke-teal-700')}
                    </div>
                  </div>
                </div>
              )}

              {/* Τελική Επιβεβαίωση Αξίας */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-3.5 sm:p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                {t.visualConfirmation}
              </div>

            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
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
            href="/st-dimotikou/25-isodinama-klasmata-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase(t.ctaBtn)}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
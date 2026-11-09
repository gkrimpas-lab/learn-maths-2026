// pages/st-dimotikou/23-klasma.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μέγιστες επιτρεπόμενες τιμές
const MAX_NUMERATOR = 40;
const MAX_DENOMINATOR = 40;

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
    lg: { numDen: 'text-xl sm:text-2xl font-black', line: 'w-full h-1' },
    xl: { numDen: 'text-3xl sm:text-4xl 2xl:text-5xl font-black', line: 'w-full h-1.5' }
  };

  const selected = sizeClasses[size] || sizeClasses.md;

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle font-mono leading-none px-1 ${className}`}>
      <span className={`${selected.numDen} pb-0.5`}>{num}</span>
      <span className={`${selected.line} bg-current rounded-full my-0.5 min-w-[14px]`} />
      <span className={`${selected.numDen} pt-0.5`}>{den}</span>
    </span>
  );
}

const PRESETS = [
  { num: 3, den: 4, typeKey: 'proper' },
  { num: 4, den: 4, typeKey: 'unit' },
  { num: 5, den: 4, typeKey: 'improper' },
  { num: 6, den: 2, typeKey: 'integer' },
  { num: 2, den: 3, typeKey: 'proper' },
  { num: 7, den: 5, typeKey: 'improper' }
];

const TRANSLATIONS = {
  el: {
    pageTitle: "Η Έννοια του Κλάσματος - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθε πώς χωρίζουμε μια μονάδα σε ίσα μέρη, τι σημαίνουν ο Αριθμητής και ο Παρονομαστής και πώς διακρίνουμε τα Γνήσια, Καταχρηστικά και Ίσα με τη Μονάδα κλάσματα για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 23 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Η Έννοια του Κλάσματος (Αριθμητής και Παρονομαστής)",
    heroDesc: "Μάθε πώς χωρίζουμε μια μονάδα σε ίσα μέρη, τι σημαίνουν ο Αριθμητής και ο Παρονομαστής και πώς διακρίνουμε τα Γνήσια, Καταχρηστικά και Ίσα με τη Μονάδα κλάσματα!",
    heroFeature: "Διαδραστικά Μοντέλα Πίτσας & Σοκολάτας με Αυτόματο Υπολογισμό",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες & Ρόλος των Όρων του Κλάσματος",
    theorySubtitle: "Όλα όσα πρέπει να γνωρίζεις για τον αριθμητή, τον παρονομαστή και τη γραμμή του κλάσματος.",
    card1Badge: "ΠΑΝΩ ΜΕΡΟΣ",
    card1Sub: "Πόσα πήραμε",
    card1Title: "Αριθμητής (Πάνω)",
    card1Text: "Δείχνει πόσα από τα ίσα μέρη πήραμε, χρωματίσαμε ή εξετάζουμε.",
    card1ExamplePrefix: "Στο κλάσμα",
    card1ExampleSuffix: "➔ πήραμε τα 3 κομμάτια",
    card1Tip: "💡 Ο αριθμητής μπορεί να είναι 0 (μηδενικό κλάσμα) ή και μεγαλύτερος από τον παρονομαστή (καταχρηστικό).",
    card2Badge: "ΚΑΤΩ ΜΕΡΟΣ",
    card2Sub: "Σε πόσα χωρίσαμε",
    card2Title: "Παρονομαστής (Κάτω)",
    card2Text: "Δείχνει σε πόσα ίσα μέρη χωρίσαμε την αρχική ακέραια μονάδα (δεν μπορεί ποτέ να είναι 0).",
    card2ExamplePrefix: "Στο κλάσμα",
    card2ExampleSuffix: "➔ χωρίσαμε σε 4 ίσα μέρη",
    card2Tip: "⚡ Κανόνας SOS: Ο παρονομαστής ονομάζει τα μέρη (τέταρτα, πέμπτα, δέκατα) και δεν μπορεί ποτέ να είναι μηδέν!",
    card3Badge: "ΠΡΑΞΗ",
    card3Sub: "Διαίρεση",
    card3Title: "Γραμμή Κλάσματος",
    card3Text: "Συμβολίζει πάντα την πράξη της διαίρεσης: Αριθμητής : Παρονομαστής ＝ Δεκαδική Αξία.",
    card3Tip: "🎯 Κάθε κλάσμα είναι ένας ακριβής τρόπος γραφής μιας διαίρεσης χωρίς να χρειάζεται να υπολογίσουμε δεκαδικό!",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Κλασμάτων",
    labSubtitle: "Άλλαξε τον αριθμητή και τον παρονομαστή ή κάνε κλικ στα κομμάτια για να δεις την άμεση οπτική αναπαράσταση!",
    modelPizza: "🍕 Πίτσα",
    modelPizzaSub: "(Κυκλικό)",
    modelChocolate: "🍫 Σοκολάτα",
    modelChocolateSub: "(Γραμμικό)",
    settingsTitle: (max) => `ΡΥΘΜΙΣΗ ΚΛΑΣΜΑΤΟΣ (ΟΡΙΟ: ${max}):`,
    numeratorLabel: "Αριθμητής (Πάνω):",
    denominatorLabel: "Παρονομαστής (Κάτω):",
    presetsTitle: "ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:",
    typeLabel: "ΕΙΔΟΣ ΚΛΑΣΜΑΤΟΣ:",
    labTip: "💡 Tip: Κάνε κλικ πάνω στα κομμάτια για να ορίσεις απευθείας τον αριθμητή!",
    decimalValue: "ΔΕΚΑΔΙΚΗ ΑΞΙΑ:",
    pizzaModelTitle: "🍕 ΚΥΚΛΙΚΟ ΜΟΝΤΕΛΟ (ΠΙΤΣΑ):",
    chocolateModelTitle: "🍫 ΓΡΑΜΜΙΚΟ ΜΟΝΤΕΛΟ (ΣΟΚΟΛΑΤΑ):",
    unitSingular: "μονάδα",
    unitPlural: "μονάδες",
    pieceOf: (i, den) => `Κομμάτι ${i} από ${den}`,
    unitLabel: (i) => `Μονάδα ${i}`,
    chocolateLabel: (i) => `Σοκολάτα ${i}`,
    summaryTitle: "ΣΥΜΠΕΡΑΣΜΑ:",
    summaryText: (num, den) => (
      <span>
        Το κλάσμα <FractionDisplay num={num} den={den} size="sm" className="text-amber-300 mx-1" /> αντιπροσωπεύει <strong>{num}</strong> από τα <strong>{den}</strong> ίσα μέρη.
      </span>
    ),
    ctaTitle: "Ώρα για Εξάσκηση στα Κλάσματα!",
    ctaDesc: "Κατάλαβες πώς λειτουργούν ο αριθμητής και ο παρονομαστής; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "Έναρξη Ασκήσεων",
    presetTypes: {
      proper: 'Γνήσιο',
      unit: 'Μονάδα',
      improper: 'Καταχρηστικό',
      integer: 'Ακέραιος ＝ 3'
    },
    fractionTypes: {
      zero: {
        title: "Μηδενικό Κλάσμα",
        desc: "Όταν ο αριθμητής είναι 0, το κλάσμα ισούται με 0 (δεν πήραμε κανένα μέρος)."
      },
      unit: {
        title: "Ίσο με τη Μονάδα (1 ολόκληρο)",
        desc: "Ο αριθμητής είναι ίσος με τον παρονομαστή. Έχουμε πάρει όλα τα κομμάτια!"
      },
      proper: {
        title: "Γνήσιο Κλάσμα (＜ 1)",
        desc: "Ο αριθμητής είναι μικρότερος από τον παρονομαστή. Αντιπροσωπεύει ποσότητα μικρότερη από 1 ολόκληρη μονάδα."
      },
      integer: (val) => ({
        title: `Ακέραιος Αριθμός (＝ ${val})`,
        desc: `Ο αριθμητής διαιρείται ακριβώς με τον παρονομαστή και μας δίνει ακριβώς ${val} ολόκληρες μονάδες!`
      }),
      improper: {
        title: "Καταχρηστικό Κλάσμα (＞ 1)",
        desc: "Ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή. Χρειαζόμαστε πάνω από 1 ολόκληρη μονάδα!"
      }
    }
  },
  en: {
    pageTitle: "Understanding Fractions - 6th Grade | LearnMaths.gr",
    pageDesc: "Learn how a unit is divided into equal parts, what the Numerator and Denominator mean, and how to identify Proper, Improper, and Unit Fractions for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 23 • 6TH GRADE",
    heroTitle: "Understanding Fractions (Numerator and Denominator)",
    heroDesc: "Discover how a whole unit is split into equal parts, what the Numerator and Denominator represent, and how to distinguish Proper, Improper, and Unit Fractions!",
    heroFeature: "Interactive Pizza & Chocolate Models with Real-Time Calculation",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts & Terms of a Fraction",
    theorySubtitle: "Everything you need to know about the numerator, denominator, and fraction bar.",
    card1Badge: "TOP PART",
    card1Sub: "Parts taken",
    card1Title: "Numerator (Top)",
    card1Text: "Indicates how many of the equal parts have been selected, shaded, or examined.",
    card1ExamplePrefix: "In the fraction",
    card1ExampleSuffix: "➔ we took 3 parts",
    card1Tip: "💡 The numerator can be 0 (zero fraction) or greater than the denominator (improper fraction).",
    card2Badge: "BOTTOM PART",
    card2Sub: "Total divisions",
    card2Title: "Denominator (Bottom)",
    card2Text: "Indicates how many equal parts the whole unit was divided into (can never be 0).",
    card2ExamplePrefix: "In the fraction",
    card2ExampleSuffix: "➔ divided into 4 equal parts",
    card2Tip: "⚡ Golden Rule: The denominator names the fractional unit (fourths, fifths, tenths) and can never equal zero!",
    card3Badge: "OPERATION",
    card3Sub: "Division",
    card3Title: "Fraction Bar",
    card3Text: "Always signifies division: Numerator : Denominator ＝ Decimal Value.",
    card3Tip: "🎯 Every fraction is an exact representation of division without needing decimal approximation!",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Fractions Lab",
    labSubtitle: "Adjust numerator and denominator or click slices to see live visual representations!",
    modelPizza: "🍕 Pizza",
    modelPizzaSub: "(Circular)",
    modelChocolate: "🍫 Chocolate",
    modelChocolateSub: "(Linear)",
    settingsTitle: (max) => `FRACTION SETTINGS (MAX: ${max}):`,
    numeratorLabel: "Numerator (Top):",
    denominatorLabel: "Denominator (Bottom):",
    presetsTitle: "PRESET EXAMPLES:",
    typeLabel: "FRACTION TYPE:",
    labTip: "💡 Tip: Click directly on pieces to set the numerator instantly!",
    decimalValue: "DECIMAL VALUE:",
    pizzaModelTitle: "🍕 CIRCULAR MODEL (PIZZA):",
    chocolateModelTitle: "🍫 LINEAR MODEL (CHOCOLATE):",
    unitSingular: "unit",
    unitPlural: "units",
    pieceOf: (i, den) => `Part ${i} of ${den}`,
    unitLabel: (i) => `Unit ${i}`,
    chocolateLabel: (i) => `Bar ${i}`,
    summaryTitle: "SUMMARY:",
    summaryText: (num, den) => (
      <span>
        The fraction <FractionDisplay num={num} den={den} size="sm" className="text-amber-300 mx-1" /> represents <strong>{num}</strong> out of <strong>{den}</strong> equal parts.
      </span>
    ),
    ctaTitle: "Time to Practice Fractions!",
    ctaDesc: "Mastered the roles of the numerator and denominator? Try the 10 interactive questions to test and consolidate your knowledge!",
    ctaBtn: "Start Exercises",
    presetTypes: {
      proper: 'Proper',
      unit: 'Unit',
      improper: 'Improper',
      integer: 'Integer ＝ 3'
    },
    fractionTypes: {
      zero: {
        title: "Zero Fraction",
        desc: "When the numerator is 0, the fraction equals 0 (no parts are taken)."
      },
      unit: {
        title: "Equal to Whole (1 Whole)",
        desc: "The numerator equals the denominator. All parts are taken!"
      },
      proper: {
        title: "Proper Fraction (＜ 1)",
        desc: "The numerator is smaller than the denominator. Represents less than 1 whole unit."
      },
      integer: (val) => ({
        title: `Integer (＝ ${val})`,
        desc: `The numerator is exactly divisible by the denominator, yielding ${val} whole units!`
      }),
      improper: {
        title: "Improper Fraction (＞ 1)",
        desc: "The numerator is greater than the denominator. More than 1 whole unit is required!"
      }
    }
  }
};

export default function KlasmaPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);
  const [activeModel, setActiveModel] = useState('pizza');

  const handleNumeratorInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setNumerator('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_NUMERATOR) return;
    setNumerator(n);
  };

  const handleDenominatorInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setDenominator('');
      return;
    }
    const n = Number(clean);
    if (n > MAX_DENOMINATOR) return;
    setDenominator(n);
  };

  const handleNumeratorChange = (amount) => {
    setNumerator(prev => Math.max(0, Math.min(MAX_NUMERATOR, (Number(prev) || 0) + amount)));
  };

  const handleDenominatorChange = (amount) => {
    setDenominator(prev => Math.max(1, Math.min(MAX_DENOMINATOR, (Number(prev) || 1) + amount)));
  };

  const activeNumerator = numerator === '' ? 0 : numerator;
  const activeDenominator = denominator === '' || denominator === 0 ? 1 : denominator;
  const fractionValue = activeNumerator / activeDenominator;

  // Σχεδίαση πίτσας (SVG)
  const renderPizza = (pizzaIndex = 0) => {
    const slices = [];
    const radius = 70;
    const cx = 90;
    const cy = 90;

    const startingNumeratorForPizza = pizzaIndex * activeDenominator;
    const activeSlicesForThisPizza = Math.max(
      0,
      Math.min(activeDenominator, activeNumerator - startingNumeratorForPizza)
    );

    for (let i = 0; i < activeDenominator; i++) {
      const angleStep = 360 / activeDenominator;
      const startAngle = i * angleStep - 90;
      const endAngle = (i + 1) * angleStep - 90;

      const rad1 = (startAngle * Math.PI) / 180;
      const rad2 = (endAngle * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(rad1);
      const y1 = cy + radius * Math.sin(rad1);
      const x2 = cx + radius * Math.cos(rad2);
      const y2 = cy + radius * Math.sin(rad2);

      const largeArcFlag = angleStep > 180 ? 1 : 0;

      const d = activeDenominator === 1
        ? `M ${cx} ${cy} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const isFilled = i < activeSlicesForThisPizza;

      slices.push(
        <path
          key={i}
          d={d}
          onClick={() => {
            const clickedNumber = pizzaIndex * activeDenominator + i + 1;
            setNumerator(clickedNumber);
          }}
          className={`${
            isFilled 
              ? 'fill-amber-400 stroke-amber-600 hover:fill-amber-300' 
              : 'fill-slate-100 stroke-slate-300 hover:fill-slate-200'
          } transition-colors duration-200 stroke-[1.5] cursor-pointer`}
          title={t.pieceOf(i + 1, activeDenominator)}
        />
      );
    }

    return (
      <svg width="180" height="180" className="drop-shadow-md shrink-0">
        {slices}
        <circle cx={cx} cy={cy} r="3.5" className="fill-slate-700" />
      </svg>
    );
  };

  // Σχεδίαση σοκολάτας
  const renderChocolate = (chocoIndex = 0) => {
    const blocks = [];
    const startingNumeratorForChoco = chocoIndex * activeDenominator;
    const activeBlocksForThisChoco = Math.max(
      0,
      Math.min(activeDenominator, activeNumerator - startingNumeratorForChoco)
    );

    for (let i = 0; i < activeDenominator; i++) {
      const isFilled = i < activeBlocksForThisChoco;
      blocks.push(
        <div
          key={i}
          onClick={() => {
            const clickedNumber = chocoIndex * activeDenominator + i + 1;
            setNumerator(clickedNumber);
          }}
          className={`flex-1 h-12 border border-amber-800/20 first:rounded-l-lg last:rounded-r-lg cursor-pointer transition-all duration-300 ${
            isFilled
              ? 'bg-amber-700 shadow-inner scale-[0.98]'
              : 'bg-amber-100/50 hover:bg-amber-200/50'
          }`}
          title={t.pieceOf(i + 1, activeDenominator)}
        />
      );
    }

    return (
      <div className="w-full bg-amber-900/10 p-2 rounded-2xl border border-amber-900/20 flex gap-0.5 shadow-sm overflow-hidden">
        {blocks}
      </div>
    );
  };

  const neededVisuals = Math.max(1, Math.ceil(activeNumerator / activeDenominator));

  const getFractionTypeMessage = () => {
    if (activeNumerator === 0) {
      return {
        ...t.fractionTypes.zero,
        color: 'text-slate-700 bg-slate-100 border-slate-300'
      };
    }
    if (activeNumerator === activeDenominator) {
      return {
        ...t.fractionTypes.unit,
        color: 'text-emerald-800 bg-emerald-50 border-emerald-300'
      };
    }
    if (activeNumerator < activeDenominator) {
      return {
        ...t.fractionTypes.proper,
        color: 'text-blue-800 bg-blue-50 border-blue-300'
      };
    }
    if (activeNumerator > activeDenominator) {
      const isInteger = activeNumerator % activeDenominator === 0;
      return {
        ...(isInteger
          ? t.fractionTypes.integer(activeNumerator / activeDenominator)
          : t.fractionTypes.improper),
        color: 'text-purple-800 bg-purple-50 border-purple-300'
      };
    }
  };

  const typeInfo = getFractionTypeMessage();

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/23-klasma-ask"
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
              href="/st-dimotikou/23-klasma-ask"
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-center font-bold flex items-center justify-center gap-1.5 flex-wrap">
                  <span>{t.card1ExamplePrefix}</span>
                  <FractionDisplay num="3" den="4" size="md" className="text-sky-700" />
                  <span>{t.card1ExampleSuffix}</span>
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
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.card2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-600">{t.card2Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.card2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.card2Text}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-center font-bold flex items-center justify-center gap-1.5 flex-wrap">
                  <span>{t.card2ExamplePrefix}</span>
                  <FractionDisplay num="3" den="4" size="md" className="text-emerald-700" />
                  <span>{t.card2ExampleSuffix}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.card2Tip}
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.card3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-purple-700">{t.card3Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.card3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.card3Text}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold flex items-center justify-center gap-2">
                  <FractionDisplay num="3" den="4" size="md" className="text-purple-700" />
                  <span>＝ 3 : 4 ＝ <strong className="text-purple-700">0{locale === 'en' ? '.75' : ',75'}</strong></span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                {t.card3Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{t.labBadge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.labTitle}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.labSubtitle}
              </p>
            </div>

            {/* MODEL TOGGLE */}
            <div className="flex bg-slate-100 p-1 sm:p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveModel('pizza')}
                className={`flex-1 sm:flex-none px-2.5 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs md:text-sm 2xl:text-base font-black transition-all text-center leading-tight sm:leading-normal touch-manipulation active:scale-95 ${
                  activeModel === 'pizza'
                    ? 'bg-amber-500 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{t.modelPizza}</span> <span className="text-[10px] sm:text-xs opacity-90 block sm:inline">{t.modelPizzaSub}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModel('chocolate')}
                className={`flex-1 sm:flex-none px-2.5 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs md:text-sm 2xl:text-base font-black transition-all text-center leading-tight sm:leading-normal touch-manipulation active:scale-95 ${
                  activeModel === 'chocolate'
                    ? 'bg-amber-800 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{t.modelChocolate}</span> <span className="text-[10px] sm:text-xs opacity-90 block sm:inline">{t.modelChocolateSub}</span>
              </button>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                <div className="space-y-3">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    {t.settingsTitle(MAX_NUMERATOR)}
                  </span>

                  {/* ΕΛΕΓΧΟΣ ΑΡΙΘΜΗΤΗ */}
                  <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-blue-200 shadow-xs space-y-2">
                    <span className="text-xs font-black text-blue-800 uppercase block">
                      {t.numeratorLabel}
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleNumeratorChange(-1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-slate-100 hover:bg-slate-200 text-blue-700 border border-slate-200 rounded-xl font-black transition shadow-xs text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        －
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={numerator}
                        onChange={(e) => handleNumeratorInputChange(e.target.value)}
                        className="w-full min-w-0 flex-1 text-center font-mono font-black text-xl sm:text-2xl text-blue-600 bg-blue-50/50 border-2 border-blue-200 rounded-xl p-1.5 focus:border-blue-500 outline-none shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => handleNumeratorChange(1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black transition shadow-md text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  {/* ΕΛΕΓΧΟΣ ΠΑΡΟΝΟΜΑΣΤΗ */}
                  <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
                    <span className="text-xs font-black text-emerald-800 uppercase block">
                      {t.denominatorLabel}
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleDenominatorChange(-1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-slate-100 hover:bg-slate-200 text-emerald-700 border border-slate-200 rounded-xl font-black transition shadow-xs text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        －
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={denominator}
                        onChange={(e) => handleDenominatorInputChange(e.target.value)}
                        className="w-full min-w-0 flex-1 text-center font-mono font-black text-xl sm:text-2xl text-emerald-600 bg-emerald-50/50 border-2 border-emerald-200 rounded-xl p-1.5 focus:border-emerald-500 outline-none shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => handleDenominatorChange(1)}
                        className="w-9 sm:w-11 h-10 sm:h-11 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition shadow-md text-lg flex items-center justify-center touch-manipulation active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    {t.presetsTitle}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNumerator(p.num);
                          setDenominator(p.den);
                        }}
                        className={`py-2 px-2 rounded-xl border text-xs transition-all text-center touch-manipulation active:scale-95 flex items-center justify-center gap-1.5 ${
                          activeNumerator === p.num && activeDenominator === p.den
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                        }`}
                      >
                        <FractionDisplay num={p.num} den={p.den} size="sm" />
                        <span className="text-[10px] font-bold">({t.presetTypes[p.typeKey]})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* BOX ΚΑΤΗΓΟΡΙΑΣ ΚΛΑΣΜΑΤΟΣ */}
                <div className={`p-4 rounded-2xl border ${typeInfo.color} space-y-1 transition-all`}>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                    {t.typeLabel}
                  </span>
                  <h4 className="text-sm font-black">{typeInfo.title}</h4>
                  <p className="text-xs leading-relaxed opacity-90">{typeInfo.desc}</p>
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                {t.labTip}
              </div>
            </div>

            {/* RIGHT: VISUALIZATION */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              {/* 1. HEADER STATUS ME ΚΑΤΑΚΟΡΥΦΗ ΜΟΡΦΗ */}
              <div className="w-full flex flex-col sm:flex-row justify-around items-center bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 gap-4 shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center font-mono select-none">
                    <span className="text-4xl sm:text-5xl font-black text-blue-600">{activeNumerator}</span>
                    <div className="w-14 sm:w-16 h-1.5 bg-slate-800 rounded-full my-1.5" />
                    <span className="text-4xl sm:text-5xl font-black text-emerald-600">{activeDenominator}</span>
                  </div>
                </div>

                <span className="text-2xl sm:text-3xl font-light text-slate-300">＝</span>

                <div className="text-center font-mono bg-white px-5 sm:px-6 py-3 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-sans text-slate-400 block font-bold uppercase tracking-wider">
                    {t.decimalValue}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-800">
                    {Number(fractionValue.toFixed(3)).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR')}
                  </span>
                </div>
              </div>

              {/* 2. ΟΠΤΙΚΟ ΜΟΝΤΕΛΟ */}
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider">
                    {activeModel === 'pizza' ? t.pizzaModelTitle : t.chocolateModelTitle}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {neededVisuals} {neededVisuals === 1 ? t.unitSingular : t.unitPlural}
                  </span>
                </div>

                {activeModel === 'pizza' ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-4 sm:p-6 bg-slate-50/70 rounded-3xl border border-slate-200 max-h-[300px] sm:max-h-[340px] overflow-y-auto shadow-inner">
                    {Array.from({ length: neededVisuals }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center space-y-2">
                        {renderPizza(i)}
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{t.unitLabel(i + 1)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 p-4 sm:p-6 bg-slate-50/70 rounded-3xl border border-slate-200 max-h-[300px] sm:max-h-[340px] overflow-y-auto shadow-inner">
                    {Array.from({ length: neededVisuals }).map((_, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase items-center">
                          <span>{t.chocolateLabel(i + 1)}</span>
                          <span className="flex items-center">
                            <FractionDisplay
                              num={Math.max(0, Math.min(activeDenominator, activeNumerator - i * activeDenominator))}
                              den={activeDenominator}
                              size="sm"
                            />
                          </span>
                        </div>
                        {renderChocolate(i)}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. FINAL SUMMARY BANNER */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-4 sm:p-5 rounded-2xl text-center shadow-lg space-y-1">
                <span className="text-xs font-sans uppercase tracking-wider block text-blue-200 font-bold">
                  {t.summaryTitle}
                </span>
                <div className="text-base sm:text-lg md:text-xl font-black tracking-wide flex items-center justify-center flex-wrap">
                  {t.summaryText(activeNumerator, activeDenominator)}
                </div>
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
            href="/st-dimotikou/23-klasma-ask"
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
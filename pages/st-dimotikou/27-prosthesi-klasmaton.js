// pages/st-dimotikou/27-prosthesi-klasmaton.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Εξωτερικές μεταβλητές ρύθμισης
const MAX_LIMIT = 100;

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
    xl: { numDen: 'text-2xl sm:text-3xl md:text-4xl font-black', line: 'w-full h-1.5' }
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

const PRESETS = [
  { nA: 2, dA: 7, nB: 3, dB: 7, typeEl: 'Ομώνυμα', typeEn: 'Like Denominators' },
  { nA: 1, dA: 3, nB: 1, dB: 6, typeEl: 'Ετερώνυμα', typeEn: 'Unlike Denominators' },
  { nA: 1, dA: 2, nB: 2, dB: 3, typeEl: 'Άθροισμα ＞ 1', typeEn: 'Sum ＞ 1' },
  { nA: 3, dA: 4, nB: 1, dB: 8, typeEl: 'Ε.Κ.Π. ＝ 8', typeEn: 'LCM ＝ 8' }
];

// Βοηθητική συνάρτηση για εύρεση Μέγιστου Κοινού Διαιρέτη (ΜΚΔ)
function findGCD(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Βοηθητική συνάρτηση για εύρεση Ελάχιστου Κοινού Πολλαπλασίου (ΕΚΠ)
function findLCM(a, b) {
  if (!a || !b) return 1;
  return Math.abs(a * b) / findGCD(a, b);
}

const TRANSLATIONS = {
  el: {
    pageTitle: "Πρόσθεση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθε πώς προσθέτουμε ομώνυμα και ετερώνυμα κλάσματα με το Ε.Κ.Π. και πώς απλοποιούμε το αποτέλεσμα για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 27 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Πρόσθεση Κλασμάτων (Ομώνυμα και Ετερώνυμα)",
    heroDesc: "Μάθε πώς προσθέτουμε ομώνυμα κλάσματα προσθέτοντας μόνο τους αριθμητές, και πώς κάνουμε τα ετερώνυμα ομώνυμα με το Ε.Κ.Π. πριν τα προσθέσουμε!",
    heroFeature: "Βήμα-προς-Βήμα Ε.Κ.Π., Ομώνυμα & Οπτική Πρόσθεση σε Πίτσες",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες & Κανόνες Πρόσθεσης Κλασμάτων",
    theorySubtitle: "Όλα όσα πρέπει να γνωρίζεις για τα ομώνυμα, τα ετερώνυμα και την απλοποίηση του αθροίσματος.",
    card1Badge: "1. ΟΜΩΝΥΜΑ",
    card1Sub: "Ίδιος Παρονομαστής",
    card1Title: "Ομώνυμα Κλάσματα",
    card1Text: "Όταν οι παρονομαστές είναι ίδιοι, προσθέτουμε μόνο τους αριθμητές και αφήνουμε τον ίδιο παρονομαστή.",
    card1Tip: "💡 Προσοχή SOS: Ποτέ δεν προσθέτουμε τους παρονομαστές μεταξύ τους (2/7 ＋ 3/7 ≠ 5/14)!",
    card2Badge: "2. ΕΤΕΡΩΝΥΜΑ",
    card2Sub: "Με Ε.Κ.Π.",
    card2Title: "Ετερώνυμα Κλάσματα",
    card2Text: "Βρίσκουμε το Ε.Κ.Π. των παρονομαστών, βάζουμε καπελάκια για να τα κάνουμε ομώνυμα και μετά προσθέτουμε!",
    card2Tip: "⚡ Δεν μπορούμε να προσθέσουμε απευθείας κομμάτια διαφορετικού μεγέθους. Τα χωρίζουμε πρώτα σε ίσα μέρη με το Ε.Κ.Π.!",
    card3Badge: "3. ΑΠΛΟΠΟΙΗΣΗ",
    card3Sub: "Σε Ανάγωγο",
    card3Title: "Απλοποίηση Αποτελέσματος",
    card3Text: "Αν το τελικό κλάσμα δεν είναι ανάγωγο, διαιρούμε με τον Μ.Κ.Δ. για να το γράψουμε στην απλούστερη μορφή του.",
    card3IrreducibleBadge: "(Ανάγωγο)",
    card3Tip: "🎯 Αν το άθροισμα βγει καταχρηστικό (π.χ. 5/4), μπορούμε να το εκφράσουμε και ως μεικτό αριθμό (1 και 1/4).",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Πρόσθεσης Κλασμάτων",
    labSubtitle: "Ρύθμισε τα δύο κλάσματα και παρακολούθησε βήμα-βήμα τη μετατροπή σε ομώνυμα, το άθροισμα, την απλοποίηση και την οπτική αναπαράσταση!",
    fractionALabel: "🔵 ΚΛΑΣΜΑ 1 (ΑΡΙΣΤΕΡΟ)",
    fractionBLabel: "🟠 ΚΛΑΣΜΑ 2 (ΔΕΞΙ)",
    numerator: "ΑΡΙΘΜΗΤΗΣ",
    denominator: "ΠΑΡΟΝΟΜΑΣΤΗΣ",
    presetsTitle: "ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:",
    labTip: "💡 Θυμήσου: Ποτέ δεν προσθέτουμε τους παρονομαστές μεταξύ τους!",
    visualSectionTitle: "🍕 ΟΠΤΙΚΗ ΠΡΟΣΘΕΣΗ (ΚΥΚΛΙΚΟ ΜΟΝΤΕΛΟ):",
    visualAllUnits: "Εμφανίζονται όλες οι μονάδες",
    unitBadge: (p) => `ΜΟΝΑΔΑ ${p}`,
    labelFraction1: "ΚΛΑΣΜΑ 1",
    labelFraction2: "ΚΛΑΣΜΑ 2",
    labelHomo1: "ΟΜΩΝΥΜΟ 1",
    labelHomo2: "ΟΜΩΝΥΜΟ 2",
    labelSum: "ΑΘΡΟΙΣΜΑ",
    labelIrreducible: "ΑΝΑΓΩΓΟ",
    summaryPrefix: "💡 ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ:",
    stepOmonimaTitle: (d) => `🔵 ΟΜΩΝΥΜΑ ΚΛΑΣΜΑΤΑ (ΙΔΙΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ: ${d}):`,
    stepOmonimaDesc: "Προσθέτουμε μόνο τους αριθμητές και διατηρούμε τον ίδιο παρονομαστή:",
    stepHeteroTitle: (dA, dB) => `🟣 ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ (${dA} ≠ ${dB}):`,
    stepHetero1: (lcmVal) => `1. Βρίσκουμε το Ε.Κ.Π. ＝ ${lcmVal}.`,
    stepHetero2: "2. Κάνουμε τα κλάσματα ομώνυμα:",
    stepHetero3: "3. Προσθέτουμε τους νέους αριθμητές:",
    simplifiedNote: (gcdVal, num, den) => (
      <span>
        ✨ Απλοποιώντας με το {gcdVal}, το τελικό ανάγωγο κλάσμα γίνεται: <FractionDisplay num={num} den={den} size="sm" className="text-emerald-800" />
      </span>
    ),
    ctaTitle: "Ώρα για Εξάσκηση στην Πρόσθεση Κλασμάτων!",
    ctaDesc: "Έμαθες να προσθέτεις ομώνυμα και ετερώνυμα κλάσματα; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Adding Fractions - 6th Grade | LearnMaths.gr",
    pageDesc: "Learn how to add like and unlike fractions using LCM and simplify the final sum for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 27 • 6TH GRADE",
    heroTitle: "Adding Fractions (Like and Unlike)",
    heroDesc: "Discover how to add like fractions by adding only their numerators, and how to convert unlike fractions to like denominators using LCM before adding!",
    heroFeature: "Step-by-Step LCM, Like Fractions & Visual Circular Addition",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts & Rules for Adding Fractions",
    theorySubtitle: "Everything you need to know about like, unlike fractions, and simplifying the sum.",
    card1Badge: "1. LIKE FRACTIONS",
    card1Sub: "Same Denominator",
    card1Title: "Like Denominators",
    card1Text: "When denominators are identical, we simply add the numerators and keep the common denominator unchanged.",
    card1Tip: "💡 Warning SOS: Never add denominators together (2/7 ＋ 3/7 ≠ 5/14)!",
    card2Badge: "2. UNLIKE FRACTIONS",
    card2Sub: "With LCM",
    card2Title: "Unlike Fractions",
    card2Text: "Find the LCM of the denominators, scale both fractions to like denominators, and then add the numerators!",
    card2Tip: "⚡ You cannot directly add pieces of different sizes. Subdivide them into equal parts first using the LCM!",
    card3Badge: "3. SIMPLIFICATION",
    card3Sub: "To Lowest Terms",
    card3Title: "Simplifying the Sum",
    card3Text: "If the final fraction is not in lowest terms, divide both terms by their GCD to express it in simplest form.",
    card3IrreducibleBadge: "(Lowest Terms)",
    card3Tip: "🎯 If the sum is an improper fraction (e.g. 5/4), you can also write it as a mixed number (1 1/4).",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Fraction Addition Lab",
    labSubtitle: "Set both fractions to watch step-by-step conversion to common denominators, the sum, reduction, and visual pizza models!",
    fractionALabel: "🔵 FRACTION 1 (LEFT)",
    fractionBLabel: "🟠 FRACTION 2 (RIGHT)",
    numerator: "NUMERATOR",
    denominator: "DENOMINATOR",
    presetsTitle: "PRESET EXAMPLES:",
    labTip: "💡 Remember: Never add denominators together!",
    visualSectionTitle: "🍕 VISUAL ADDITION (CIRCULAR MODEL):",
    visualAllUnits: "All units rendered dynamically",
    unitBadge: (p) => `UNIT ${p}`,
    labelFraction1: "FRACTION 1",
    labelFraction2: "FRACTION 2",
    labelHomo1: "COMMON 1",
    labelHomo2: "COMMON 2",
    labelSum: "SUM",
    labelIrreducible: "LOWEST TERMS",
    summaryPrefix: "💡 FINAL RESULT:",
    stepOmonimaTitle: (d) => `🔵 LIKE FRACTIONS (COMMON DENOMINATOR: ${d}):`,
    stepOmonimaDesc: "Add only the numerators and keep the denominator unchanged:",
    stepHeteroTitle: (dA, dB) => `🟣 UNLIKE FRACTIONS (${dA} ≠ ${dB}):`,
    stepHetero1: (lcmVal) => `1. Find LCM ＝ ${lcmVal}.`,
    stepHetero2: "2. Convert to common denominators:",
    stepHetero3: "3. Add the new numerators:",
    simplifiedNote: (gcdVal, num, den) => (
      <span>
        ✨ Simplifying by dividing by {gcdVal}, the final irreducible fraction is: <FractionDisplay num={num} den={den} size="sm" className="text-emerald-800" />
      </span>
    ),
    ctaTitle: "Time to Practice Adding Fractions!",
    ctaDesc: "Mastered adding like and unlike fractions? Test your skills with 10 interactive questions to solidify your knowledge!",
    ctaBtn: "Start Exercises"
  }
};

export default function ProsthesiKlasmatonPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Κλάσμα Α (Αριστερά - Μπλε)
  const [numA, setNumA] = useState(1);
  const [denA, setDenA] = useState(3);

  // Κλάσμα Β (Δεξιά - Πορτοκαλί)
  const [numB, setNumB] = useState(1);
  const [denB, setDenB] = useState(6);

  const handleNumAChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setNumA(''); return; }
    const n = Number(clean);
    if (n <= MAX_LIMIT) setNumA(n);
  };

  const handleDenAChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setDenA(''); return; }
    const n = Number(clean);
    if (n > 0 && n <= MAX_LIMIT) setDenA(n);
  };

  const handleNumBChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setNumB(''); return; }
    const n = Number(clean);
    if (n <= MAX_LIMIT) setNumB(n);
  };

  const handleDenBChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setDenB(''); return; }
    const n = Number(clean);
    if (n > 0 && n <= MAX_LIMIT) setDenB(n);
  };

  const adjustNumA = (amount) => {
    setNumA(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
  };
  const adjustDenA = (amount) => {
    setDenA(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
  };

  const adjustNumB = (amount) => {
    setNumB(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
  };
  const adjustDenB = (amount) => {
    setDenB(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
  };

  const activeNumA = numA === '' ? 0 : Number(numA);
  const activeDenA = denA === '' || Number(denA) === 0 ? 1 : Number(denA);
  const activeNumB = numB === '' ? 0 : Number(numB);
  const activeDenB = denB === '' || Number(denB) === 0 ? 1 : Number(denB);

  // Υπολογισμός Ε.Κ.Π. και ομώνυμων κλασμάτων
  const lcm = findLCM(activeDenA, activeDenB) || 1;
  const multiplierA = lcm / activeDenA;
  const multiplierB = lcm / activeDenB;

  const equivalentNumA = activeNumA * multiplierA;
  const equivalentNumB = activeNumB * multiplierB;

  // Το άθροισμα εκφρασμένο με βάση το Ε.Κ.Π.
  const lcmResultNum = equivalentNumA + equivalentNumB;
  const lcmResultDen = lcm;

  // Απλοποίηση Αποτελέσματος
  const gcdResult = findGCD(lcmResultNum, lcmResultDen);
  const simplifiedNum = lcmResultNum / gcdResult;
  const simplifiedDen = lcmResultDen / gcdResult;
  const isSimplified = gcdResult > 1;

  const isOriginallyOmonima = activeDenA === activeDenB;

  const renderFractionVisual = (num, den, fillColor = 'fill-blue-500', strokeColor = 'stroke-blue-700') => {
    const totalPizzasNeeded = Math.max(1, Math.ceil(num / den));
    const pizzas = [];

    const radius = 45;
    const cx = 55;
    const cy = 55;

    for (let p = 0; p < totalPizzasNeeded; p++) {
      const slices = [];
      const remainingNumForThisPizza = Math.max(0, Math.min(den, num - p * den));

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

        const isFilled = i < remainingNumForThisPizza;

        slices.push(
          <path
            key={i}
            d={d}
            className={`${
              isFilled ? `${fillColor} ${strokeColor}` : 'fill-slate-100 stroke-slate-300'
            } transition-colors duration-200 stroke-[0.8]`}
          />
        );
      }

      pizzas.push(
        <div key={p} className="flex flex-col items-center space-y-1">
          <svg width="100" height="100" viewBox="0 0 110 110" className="drop-shadow-xs overflow-visible">
            {slices}
            <circle cx={cx} cy={cy} r="2.5" className="fill-slate-800" />
          </svg>
          <span className="text-[9px] font-bold text-slate-400 uppercase">
            {t.unitBadge(p + 1)}
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-2 max-w-full p-2.5 bg-white rounded-2xl border border-slate-200 shadow-inner">
        {pizzas}
      </div>
    );
  };

  const getStepByStepExplanation = () => {
    if (isOriginallyOmonima) {
      return (
        <div className="space-y-2">
          <span className="font-black text-blue-800 uppercase block text-[11px]">
            {t.stepOmonimaTitle(activeDenA)}
          </span>
          <p className="text-slate-600">
            {t.stepOmonimaDesc}
          </p>
          <div className="bg-white p-3 rounded-xl border border-blue-100 font-mono text-xs md:text-sm flex items-center gap-2 flex-wrap">
            <FractionDisplay num={activeNumA} den={activeDenA} size="sm" className="text-blue-600" />
            <span>＋</span>
            <FractionDisplay num={activeNumB} den={activeDenB} size="sm" className="text-orange-600" />
            <span>＝</span>
            <span className="flex items-center">
              ({activeNumA} ＋ {activeNumB}) / {activeDenA}
            </span>
            <span>＝</span>
            <FractionDisplay num={lcmResultNum} den={activeDenA} size="sm" className="text-emerald-700 font-bold" />
          </div>
          {isSimplified && (
            <p className="text-emerald-700 text-xs font-bold pt-1 border-t border-slate-100">
              {t.simplifiedNote(gcdResult, simplifiedNum, simplifiedDen)}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2.5">
        <span className="font-black text-indigo-800 uppercase block text-[11px]">
          {t.stepHeteroTitle(activeDenA, activeDenB)}
        </span>
        <div className="text-slate-600 space-y-1.5 text-xs md:text-sm">
          <p>{t.stepHetero1(lcm)}</p>
          <div className="space-y-1">
            <p>{t.stepHetero2}</p>
            <div className="flex items-center gap-1.5 pl-2 flex-wrap">
              <span>• 1ο:</span>
              <FractionDisplay num={`${activeNumA} · ${multiplierA}`} den={`${activeDenA} · ${multiplierA}`} size="sm" />
              <span>＝</span>
              <FractionDisplay num={equivalentNumA} den={lcm} size="sm" className="text-blue-700 font-bold" />
            </div>
            <div className="flex items-center gap-1.5 pl-2 flex-wrap">
              <span>• 2ο:</span>
              <FractionDisplay num={`${activeNumB} · ${multiplierB}`} den={`${activeDenB} · ${multiplierB}`} size="sm" />
              <span>＝</span>
              <FractionDisplay num={equivalentNumB} den={lcm} size="sm" className="text-orange-700 font-bold" />
            </div>
          </div>
          <p>{t.stepHetero3}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-indigo-100 font-mono text-xs md:text-sm flex items-center gap-2 flex-wrap">
          <FractionDisplay num={equivalentNumA} den={lcm} size="sm" />
          <span>＋</span>
          <FractionDisplay num={equivalentNumB} den={lcm} size="sm" />
          <span>＝</span>
          <span>({equivalentNumA} ＋ {equivalentNumB}) / {lcm}</span>
          <span>＝</span>
          <FractionDisplay num={lcmResultNum} den={lcm} size="sm" className="text-emerald-700 font-bold" />
        </div>
        {isSimplified && (
          <p className="text-emerald-700 text-xs font-bold pt-1 border-t border-slate-100">
            {t.simplifiedNote(gcdResult, simplifiedNum, simplifiedDen)}
          </p>
        )}
      </div>
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
          href="/st-dimotikou/27-prosthesi-klasmaton-ask"
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
              href="/st-dimotikou/27-prosthesi-klasmaton-ask"
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold flex items-center justify-center gap-2">
                  <FractionDisplay num="2" den="7" size="sm" />
                  <span>＋</span>
                  <FractionDisplay num="3" den="7" size="sm" />
                  <span>＝</span>
                  <FractionDisplay num="5" den="7" size="md" className="text-sky-700 font-bold" />
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold flex items-center justify-center gap-1.5 flex-wrap">
                  <FractionDisplay num="1" den="3" size="sm" />
                  <span className="text-[11px] text-slate-500 font-sans">(2/6)</span>
                  <span>＋</span>
                  <FractionDisplay num="1" den="6" size="sm" />
                  <span>＝</span>
                  <FractionDisplay num="3" den="6" size="md" className="text-indigo-700 font-bold" />
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold flex items-center justify-center gap-2">
                  <FractionDisplay num="3" den="6" size="sm" />
                  <span className="text-slate-500 font-sans text-xs">(: 3) ➔</span>
                  <FractionDisplay num="1" den="2" size="md" className="text-emerald-700 font-bold" />
                  <span className="text-xs text-slate-600 font-sans">{t.card3IrreducibleBadge}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.card3Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>{t.labBadge}</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-1">
              {t.labSubtitle}
            </p>
          </div>

          {/* MAIN INTERACTIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Α (ΜΠΛΕ) */}
                <div className="bg-blue-50/60 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-3">
                  <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                    {t.fractionALabel}
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.numerator}</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`numA-${numA}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={numA === '' ? '' : String(numA)}
                          onChange={(e) => handleNumAChange(e.target.value)}
                          placeholder="1"
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-blue-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.denominator}</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`denA-${denA}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={denA === '' ? '' : String(denA)}
                          onChange={(e) => handleDenAChange(e.target.value)}
                          placeholder="3"
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-blue-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ΧΕΙΡΙΣΤΗΡΙΟ ΚΛΑΣΜΑΤΟΣ Β (ΠΟΡΤΟΚΑΛΙ) */}
                <div className="bg-orange-50/60 p-3.5 sm:p-4 rounded-2xl border border-orange-200 space-y-3">
                  <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                    {t.fractionBLabel}
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.numerator}</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`numB-${numB}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={numB === '' ? '' : String(numB)}
                          onChange={(e) => handleNumBChange(e.target.value)}
                          placeholder="1"
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-orange-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.denominator}</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`denB-${denB}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={denB === '' ? '' : String(denB)}
                          onChange={(e) => handleDenBChange(e.target.value)}
                          placeholder="6"
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-orange-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    {t.presetsTitle}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p, idx) => {
                      const typeLabel = locale === 'en' ? p.typeEn : p.typeEl;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNumA(p.nA);
                            setDenA(p.dA);
                            setNumB(p.nB);
                            setDenB(p.dB);
                          }}
                          className={`py-2 px-1 rounded-xl border text-xs transition-all text-center touch-manipulation active:scale-95 flex flex-col items-center justify-center gap-1 ${
                            activeNumA === p.nA && activeDenA === p.dA && activeNumB === p.nB && activeDenB === p.dB
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <FractionDisplay num={p.nA} den={p.dA} size="sm" />
                            <span className="text-[11px] font-bold">＋</span>
                            <FractionDisplay num={p.nB} den={p.dB} size="sm" />
                          </div>
                          <span className="text-[9px] font-bold opacity-75">({typeLabel})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ΒΗΜΑ-ΒΗΜΑ ΕΠΕΞΗΓΗΣΗ */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs">
                  {getStepByStepExplanation()}
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                {t.labTip}
              </div>
            </div>

            {/* RIGHT: VISUALIZATION & AUTO-EXPANDING PIZZAS */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΠΡΟΣΘΕΣΗΣ */}
              <div className="flex items-center justify-center p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
                <div className="flex items-center gap-2.5 sm:gap-4 font-mono font-black text-xl sm:text-2xl md:text-3xl select-none flex-wrap justify-center">
                  
                  {/* 1ο Κλάσμα */}
                  <FractionDisplay num={activeNumA} den={activeDenA} size="lg" className="text-blue-600" />

                  {/* Σύμβολο ＋ */}
                  <div className="text-slate-400 font-light">＋</div>

                  {/* 2ο Κλάσμα */}
                  <FractionDisplay num={activeNumB} den={activeDenB} size="lg" className="text-orange-600" />

                  {/* Ενδιάμεσο βήμα ομωνύμων (αν ήταν ετερώνυμα) */}
                  {!isOriginallyOmonima && (
                    <>
                      <div className="text-slate-400 font-light">＝</div>

                      <FractionDisplay num={equivalentNumA} den={lcm} size="lg" className="text-blue-600/80" />

                      <div className="text-slate-400 font-light">＋</div>

                      <FractionDisplay num={equivalentNumB} den={lcm} size="lg" className="text-orange-600/80" />
                    </>
                  )}

                  <div className="text-slate-500 font-bold">＝</div>

                  {/* Άθροισμα (με βάση το ΕΚΠ) */}
                  <div className="bg-emerald-50 px-3 py-2 rounded-2xl border border-emerald-200 shadow-xs">
                    <FractionDisplay num={lcmResultNum} den={lcmResultDen} size="lg" className="text-emerald-700 font-bold" />
                  </div>

                  {/* Τελικό Ανάγωγο (αν απλοποιείται) */}
                  {isSimplified && (
                    <>
                      <div className="text-emerald-600 font-bold">＝</div>
                      <div className="bg-emerald-100 px-3 py-2 rounded-2xl border border-emerald-300 shadow-xs">
                        <FractionDisplay num={simplifiedNum} den={simplifiedDen} size="lg" className="text-emerald-800 font-black" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 2. ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΠΙΤΣΑΣ */}
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                    {t.visualSectionTitle}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {t.visualAllUnits}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner p-3 sm:p-5">
                  {/* Πίτσα Α */}
                  <div className="flex flex-col items-center space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider text-center flex items-center gap-1">
                      <span>{t.labelFraction1}:</span>
                      <FractionDisplay num={activeNumA} den={activeDenA} size="sm" />
                    </span>
                    {renderFractionVisual(activeNumA, activeDenA, 'fill-blue-500', 'stroke-blue-700')}
                  </div>

                  <div className="text-xl text-slate-400 font-black px-1">＋</div>

                  {/* Πίτσα Β */}
                  <div className="flex flex-col items-center space-y-1.5">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider text-center flex items-center gap-1">
                      <span>{t.labelFraction2}:</span>
                      <FractionDisplay num={activeNumB} den={activeDenB} size="sm" />
                    </span>
                    {renderFractionVisual(activeNumB, activeDenB, 'fill-orange-500', 'stroke-orange-700')}
                  </div>

                  {/* Ενδιάμεσες ομώνυμες πίτσες */}
                  {!isOriginallyOmonima && (
                    <>
                      <div className="text-xl text-slate-400 font-black px-1">＝</div>

                      <div className="flex flex-col items-center space-y-1.5 opacity-90">
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider text-center flex items-center gap-1">
                          <span>{t.labelHomo1}:</span>
                          <FractionDisplay num={equivalentNumA} den={lcm} size="sm" />
                        </span>
                        {renderFractionVisual(equivalentNumA, lcm, 'fill-blue-500/90', 'stroke-blue-600')}
                      </div>

                      <div className="text-xl text-slate-400 font-black px-1">＋</div>

                      <div className="flex flex-col items-center space-y-1.5 opacity-90">
                        <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider text-center flex items-center gap-1">
                          <span>{t.labelHomo2}:</span>
                          <FractionDisplay num={equivalentNumB} den={lcm} size="sm" />
                        </span>
                        {renderFractionVisual(equivalentNumB, lcm, 'fill-orange-500/90', 'stroke-orange-600')}
                      </div>
                    </>
                  )}

                  <div className="text-xl text-slate-500 font-black px-1">＝</div>

                  {/* Πίτσα Αποτελέσματος */}
                  <div className="flex flex-col items-center space-y-1.5 bg-emerald-50/70 p-2 rounded-2xl border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider text-center flex items-center gap-1">
                      <span>{t.labelSum}:</span>
                      <FractionDisplay num={lcmResultNum} den={lcmResultDen} size="sm" />
                    </span>
                    {renderFractionVisual(lcmResultNum, lcmResultDen, 'fill-emerald-500', 'stroke-emerald-700')}
                  </div>

                  {/* Πίτσα Ανάγωγου */}
                  {isSimplified && (
                    <>
                      <div className="text-xl text-emerald-600 font-black px-1">＝</div>
                      <div className="flex flex-col items-center space-y-1.5 bg-emerald-100/70 p-2 rounded-2xl border border-emerald-300">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider text-center flex items-center gap-1">
                          <span>{t.labelIrreducible}:</span>
                          <FractionDisplay num={simplifiedNum} den={simplifiedDen} size="sm" />
                        </span>
                        {renderFractionVisual(simplifiedNum, simplifiedDen, 'fill-emerald-600', 'stroke-emerald-800')}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-3.5 sm:p-4 rounded-2xl text-center font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 flex-wrap">
                <span>{t.summaryPrefix}</span>
                <FractionDisplay num={activeNumA} den={activeDenA} size="sm" className="text-white" />
                <span className="text-base font-mono">＋</span>
                <FractionDisplay num={activeNumB} den={activeDenB} size="sm" className="text-white" />
                <span className="text-base font-mono">＝</span>
                <FractionDisplay
                  num={isSimplified ? simplifiedNum : lcmResultNum}
                  den={isSimplified ? simplifiedDen : lcmResultDen}
                  size="sm"
                  className="text-amber-300 font-bold"
                />
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
            href="/st-dimotikou/27-prosthesi-klasmaton-ask"
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
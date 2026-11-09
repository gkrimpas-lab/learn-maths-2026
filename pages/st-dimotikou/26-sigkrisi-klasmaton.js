// pages/st-dimotikou/26-sigkrisi-klasmaton.js
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
    lg: { numDen: 'text-xl sm:text-2xl font-black', line: 'w-full h-1' },
    xl: { numDen: 'text-3xl sm:text-4xl md:text-5xl font-black', line: 'w-full h-1.5' }
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
  { nA: 3, dA: 8, nB: 5, dB: 8, typeEl: 'Ομώνυμα', typeEn: 'Like Denominators' },
  { nA: 2, dA: 3, nB: 2, dB: 5, typeEl: 'Ίδιος Αριθμητής', typeEn: 'Same Numerator' },
  { nA: 2, dA: 3, nB: 3, dB: 4, typeEl: 'Ετερώνυμα', typeEn: 'Unlike Denominators' },
  { nA: 3, dA: 6, nB: 4, dB: 8, typeEl: 'Ισοδύναμα', typeEn: 'Equivalent' }
];

// Υπολογισμός Μ.Κ.Δ. και Ε.Κ.Π.
function gcd(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a, b) {
  if (!a || !b) return 1;
  return Math.abs(a * b) / gcd(a, b);
}

const TRANSLATIONS = {
  el: {
    pageTitle: "Σύγκριση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθε πώς συγκρίνουμε κλάσματα: ομώνυμα με το Ε.Κ.Π., σύγκριση αριθμητών και μέθοδος χιαστί για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 26 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Σύγκριση Κλασμάτων (Ομώνυμα, Ε.Κ.Π. και Χιαστί)",
    heroDesc: "Μάθε πώς συγκρίνουμε κλάσματα: κάνοντάς τα ομώνυμα με το Ε.Κ.Π., συγκρίνοντας τους αριθμητές ή εφαρμόζοντας τον ταχύτατο πολλαπλασιασμό χιαστί!",
    heroFeature: "Παράλληλη Επεξήγηση με Ε.Κ.Π. & Χιαστί σε Πραγματικό Χρόνο",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες & Μέθοδοι Σύγκρισης Κλασμάτων",
    theorySubtitle: "Οι τρεις αποτελεσματικοί κανόνες για να συγκρίνεις οποιαδήποτε δύο κλάσματα.",
    card1Badge: "1. ΟΜΩΝΥΜΑ",
    card1Sub: "Ίδιος Παρονομαστής",
    card1Title: "Ομώνυμα Κλάσματα",
    card1Text: "Όταν οι παρονομαστές είναι ίδιοι, μεγαλύτερο είναι το κλάσμα με τον μεγαλύτερο αριθμητή.",
    card1Tip: "💡 Αν έχουν τον ίδιο αριθμητή, μεγαλύτερο είναι εκείνο με τον μικρότερο παρονομαστή (π.χ. 2/3 ＞ 2/5).",
    card2Badge: "2. ΜΕ Ε.Κ.Π.",
    card2Sub: "Ετερώνυμα",
    card2Title: "Μετατροπή σε Ομώνυμα",
    card2Text: "Βρίσκουμε το Ε.Κ.Π. των παρονομαστών, φτιάχνουμε ισοδύναμα ομώνυμα κλάσματα και συγκρίνουμε τους νέους αριθμητές.",
    card2Tip: "⚡ Η μέθοδος των ομώνυμων είναι η βασική μέθοδος που χρησιμοποιούμε και στην πρόσθεση ή αφαίρεση κλασμάτων!",
    card3Badge: "3. ΧΙΑΣΤΙ",
    card3Sub: "Ταχύτατος Έλεγχος",
    card3Title: "Μέθοδος Χιαστί",
    card3Text: "Πολλαπλασιάζουμε χιαστί: (α · δ) και (γ · β). Συγκρίνουμε τα γινόμενα για άμεσο αποτέλεσμα!",
    card3Tip: "🎯 Ο χιαστί έλεγχος είναι ιδανικός όταν θέλουμε άμεση σύγκριση χωρίς να ψάχνουμε το Ε.Κ.Π.",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Σύγκρισης Κλασμάτων",
    labSubtitle: "Ρύθμισε τα δύο κλάσματα και παρακολούθησε ταυτόχρονα και τις δύο μεθόδους (Ομώνυμα & Χιαστί) μαζί με την οπτική αναπαράσταση!",
    fractionALabel: "🔵 ΚΛΑΣΜΑ Α (ΑΡΙΣΤΕΡΟ)",
    fractionBLabel: "🟠 ΚΛΑΣΜΑ Β (ΔΕΞΙ)",
    numerator: "ΑΡΙΘΜΗΤΗΣ",
    denominator: "ΠΑΡΟΝΟΜΑΣΤΗΣ",
    presetsTitle: "ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:",
    labTip: "💡 Χρυσός Κανόνας: Δύο κλάσματα συγκρίνονται πάντα ευκολότερα είτε αν έχουν ίδιο παρονομαστή είτε με πολλαπλασιασμό χιαστί!",
    method1Title: "📐 1. ΜΕΤΑΤΡΟΠΗ ΣΕ ΟΜΩΝΥΜΑ",
    lcmBadge: (v) => `Ε.Κ.Π. ＝ ${v}`,
    alreadyCommon: (d, nA, sym, nB) => `Τα κλάσματα είναι ήδη ομώνυμα με παρονομαστή ${d}. Συγκρίνουμε τους αριθμητές: ${nA} ${sym} ${nB}`,
    stepFraction1: "• 1ο:",
    stepFraction2: "• 2ο:",
    compareNewNum: "Σύγκριση νέων αριθμητών:",
    method2Title: "⚡ 2. ΜΕΘΟΔΟΣ ΧΙΑΣΤΙ",
    crossFastBadge: "Γρήγορος Έλεγχος",
    crossLeft: "• Αριστερά:",
    crossRight: "• Δεξιά:",
    compareCross: "Σύγκριση γινομένων:",
    numberLineTitle: (max) => `📍 ΔΥΝΑΜΙΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ (0 ΕΩΣ ${max}):`,
    autoScaleSub: "Προσαρμόζεται αυτόματα στο μέγεθος",
    numberLineTip: "Το κλάσμα που βρίσκεται πιο δεξιά στην αριθμογραμμή είναι το μεγαλύτερο!",
    visualAreaTitle: "🍕 ΟΠΤΙΚΗ ΣΥΓΚΡΙΣΗ ΕΠΙΦΑΝΕΙΑΣ:",
    visualAllUnits: "Εμφανίζονται όλες οι μονάδες",
    unitBadge: (p) => `ΜΟΝΑΔΑ ${p}`,
    commonLabel: (num, den) => `Ομώνυμο: ${num}/${den}`,
    valueLabel: (v) => `Αξία: ${v}`,
    summaryPrefix: "⚖️ ΣΥΜΠΕΡΑΣΜΑ:",
    summarySuffix: "(Το κλάσμα που καλύπτει μεγαλύτερη επιφάνεια και βρίσκεται πιο δεξιά στην αριθμογραμμή είναι το μεγαλύτερο!)",
    ctaTitle: "Ώρα για Εξάσκηση στη Σύγκριση Κλασμάτων!",
    ctaDesc: "Έμαθες να συγκρίνεις ομώνυμα, ετερώνυμα και ισοδύναμα κλάσματα; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Comparing Fractions - 6th Grade | LearnMaths.gr",
    pageDesc: "Learn how to compare fractions: like denominators with LCM, comparing numerators, and the cross-multiplication method for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 26 • 6TH GRADE",
    heroTitle: "Comparing Fractions (Common Denominators, LCM & Cross-Multiplication)",
    heroDesc: "Discover how to compare fractions: convert them to common denominators using the LCM, compare numerators, or apply the rapid cross-multiplication shortcut!",
    heroFeature: "Parallel Real-Time Explanation with LCM & Cross-Multiplication",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts & Methods for Comparing Fractions",
    theorySubtitle: "Three reliable rules to compare any two fractions accurately.",
    card1Badge: "1. LIKE DENOMINATORS",
    card1Sub: "Same Denominator",
    card1Title: "Like Fractions",
    card1Text: "When denominators are identical, the fraction with the greater numerator is greater.",
    card1Tip: "💡 When numerators are identical, the fraction with the smaller denominator is greater (e.g., 2/3 ＞ 2/5).",
    card2Badge: "2. WITH LCM",
    card2Sub: "Unlike Denominators",
    card2Title: "Converting to Like Denominators",
    card2Text: "Find the LCM of the denominators, create equivalent like fractions, and compare their new numerators.",
    card2Tip: "⚡ Finding like denominators is also the fundamental method for adding and subtracting fractions!",
    card3Badge: "3. CROSS-MULTIPLICATION",
    card3Sub: "Fast Check",
    card3Title: "Cross-Multiplication Method",
    card3Text: "Cross-multiply: (a · d) and (c · b). Compare the cross products for an instant result!",
    card3Tip: "🎯 Cross-multiplication is ideal when you need an immediate check without computing the LCM.",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Fraction Comparison Lab",
    labSubtitle: "Adjust both fractions and explore both methods (Common Denominators & Cross-Multiplication) alongside visual models!",
    fractionALabel: "🔵 FRACTION A (LEFT)",
    fractionBLabel: "🟠 FRACTION B (RIGHT)",
    numerator: "NUMERATOR",
    denominator: "DENOMINATOR",
    presetsTitle: "PRESET EXAMPLES:",
    labTip: "💡 Golden Rule: Fractions are always easiest to compare either with like denominators or via cross-multiplication!",
    method1Title: "📐 1. CONVERTING TO LIKE FRACTIONS",
    lcmBadge: (v) => `LCM ＝ ${v}`,
    alreadyCommon: (d, nA, sym, nB) => `Fractions already share common denominator ${d}. Comparing numerators: ${nA} ${sym} ${nB}`,
    stepFraction1: "• 1st:",
    stepFraction2: "• 2nd:",
    compareNewNum: "Comparing new numerators:",
    method2Title: "⚡ 2. CROSS-MULTIPLICATION METHOD",
    crossFastBadge: "Fast Check",
    crossLeft: "• Left product:",
    crossRight: "• Right product:",
    compareCross: "Comparing cross products:",
    numberLineTitle: (max) => `📍 DYNAMIC NUMBER LINE (0 TO ${max}):`,
    autoScaleSub: "Auto-scales to fraction values",
    numberLineTip: "The fraction located further to the right on the number line is the greater one!",
    visualAreaTitle: "🍕 VISUAL AREA COMPARISON:",
    visualAllUnits: "All units rendered dynamically",
    unitBadge: (p) => `UNIT ${p}`,
    commonLabel: (num, den) => `Common: ${num}/${den}`,
    valueLabel: (v) => `Value: ${v}`,
    summaryPrefix: "⚖️ SUMMARY:",
    summarySuffix: "(The fraction covering more area and located further to the right on the number line is the greater one!)",
    ctaTitle: "Time to Practice Comparing Fractions!",
    ctaDesc: "Mastered comparing like, unlike, and equivalent fractions? Test your skills with 10 interactive questions to consolidate your knowledge!",
    ctaBtn: "Start Exercises"
  }
};

export default function SigkrisiKlasmatonPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Κλάσμα Α (Αριστερά - Μπλε)
  const [numA, setNumA] = useState(2);
  const [denA, setDenA] = useState(7);

  // Κλάσμα Β (Δεξιά - Πορτοκαλί)
  const [numB, setNumB] = useState(7);
  const [denB, setDenB] = useState(4);

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

  const valA = activeNumA / activeDenA;
  const valB = activeNumB / activeDenB;

  const maxDecimal = Math.max(valA, valB);
  const maxLineVal = Math.max(2, Math.ceil(maxDecimal + 0.2));

  const step = maxLineVal > 10 ? Math.ceil(maxLineVal / 6) : 1;
  const lineMarkers = [];
  for (let m = 0; m <= maxLineVal; m += step) {
    lineMarkers.push(m);
  }
  if (!lineMarkers.includes(maxLineVal)) {
    lineMarkers.push(maxLineVal);
  }

  const commonDen = lcm(activeDenA, activeDenB) || 1;
  const multA = commonDen / activeDenA;
  const multB = commonDen / activeDenB;
  const homoNumA = activeNumA * multA;
  const homoNumB = activeNumB * multB;

  const crossA = activeNumA * activeDenB;
  const crossB = activeNumB * activeDenA;

  const getComparisonSymbol = () => {
    if (valA > valB) return '＞';
    if (valA < valB) return '＜';
    return '＝';
  };

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
      <div className="flex flex-wrap justify-center gap-2 max-w-full p-3 bg-white rounded-2xl border border-slate-200 shadow-inner">
        {pizzas}
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
          href="/st-dimotikou/26-sigkrisi-klasmaton-ask"
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
              href="/st-dimotikou/26-sigkrisi-klasmaton-ask"
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
                  <FractionDisplay num="5" den="8" size="sm" className="text-sky-700" />
                  <span>＞</span>
                  <FractionDisplay num="3" den="8" size="sm" className="text-sky-700" />
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold flex items-center justify-center gap-2 flex-wrap">
                  <FractionDisplay num="2" den="3" size="sm" />
                  <span className="text-[11px] text-slate-500 font-sans">({locale === 'en' ? '8/12' : '8/12'})</span>
                  <span>＜</span>
                  <FractionDisplay num="3" den="4" size="sm" />
                  <span className="text-[11px] text-slate-500 font-sans">({locale === 'en' ? '9/12' : '9/12'})</span>
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
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    {t.card3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-amber-600">{t.card3Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.card3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.card3Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 text-[11px] sm:text-xs font-mono text-center font-bold flex items-center justify-center gap-1.5 flex-wrap">
                  <span>2 · 4 ＝ 8 ＜ 3 · 3 ＝ 9 ➔</span>
                  <FractionDisplay num="2" den="3" size="sm" />
                  <span>＜</span>
                  <FractionDisplay num="3" den="4" size="sm" />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
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
                          placeholder="2"
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
                          placeholder="7"
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
                          placeholder="7"
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
                          placeholder="4"
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
                            <span className="text-[10px] font-bold">vs</span>
                            <FractionDisplay num={p.nB} den={p.dB} size="sm" />
                          </div>
                          <span className="text-[9px] font-bold opacity-75">({typeLabel})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-4">
                {t.labTip}
              </div>
            </div>

            {/* RIGHT: PARALLEL COMPARISON METHODS, NUMBER LINE & PIZZAS */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΜΕ ΤΟ ΣΥΜΒΟΛΟ */}
              <div className="flex items-center justify-center p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-4 sm:gap-10 select-none">
                  {/* Κλάσμα Α */}
                  <FractionDisplay num={activeNumA} den={activeDenA} size="xl" className="text-blue-600" />

                  {/* Σύμβολο Σύγκρισης */}
                  <div className="text-3xl sm:text-4xl md:text-6xl text-amber-500 bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-md border border-slate-200 font-mono font-black">
                    {getComparisonSymbol()}
                  </div>

                  {/* Κλάσμα Β */}
                  <FractionDisplay num={activeNumB} den={activeDenB} size="xl" className="text-orange-600" />
                </div>
              </div>

              {/* 2. ΟΙ 2 ΜΕΘΟΔΟΙ ΣΥΓΚΡΙΣΗΣ ΔΙΠΛΑ-ΔΙΠΛΑ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* ΜΕΘΟΔΟΣ 1: ΟΜΩΝΥΜΑ ΜΕ Ε.Κ.Π. */}
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                    <span className="text-xs font-black text-blue-900 uppercase">
                      {t.method1Title}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                      {t.lcmBadge(commonDen)}
                    </span>
                  </div>
                  
                  {activeDenA === activeDenB ? (
                    <p className="text-xs text-slate-700 leading-relaxed pt-1">
                      {t.alreadyCommon(activeDenA, activeNumA, getComparisonSymbol(), activeNumB)}
                    </p>
                  ) : (
                    <div className="text-xs text-slate-700 space-y-1.5 pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{t.stepFraction1}</span>
                        <FractionDisplay num={`${activeNumA} · ${multA}`} den={commonDen} size="sm" className="text-blue-700" />
                        <span>＝</span>
                        <FractionDisplay num={homoNumA} den={commonDen} size="sm" className="text-blue-700 font-bold" />
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{t.stepFraction2}</span>
                        <FractionDisplay num={`${activeNumB} · ${multB}`} den={commonDen} size="sm" className="text-orange-700" />
                        <span>＝</span>
                        <FractionDisplay num={homoNumB} den={commonDen} size="sm" className="text-orange-700 font-bold" />
                      </div>
                      <p className="font-sans font-bold text-slate-900 border-t border-blue-200/60 pt-1 flex items-center gap-1.5 flex-wrap">
                        <span>{t.compareNewNum}</span>
                        <FractionDisplay num={homoNumA} den={commonDen} size="sm" />
                        <span>{getComparisonSymbol()}</span>
                        <FractionDisplay num={homoNumB} den={commonDen} size="sm" />
                      </p>
                    </div>
                  )}
                </div>

                {/* ΜΕΘΟΔΟΣ 2: ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΧΙΑΣΤΙ */}
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <span className="text-xs font-black text-amber-900 uppercase">
                      {t.method2Title}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200">
                      {t.crossFastBadge}
                    </span>
                  </div>
                  
                  <div className="text-xs text-slate-700 space-y-1.5 pt-1 font-mono">
                    <p>
                      {t.crossLeft} <span className="text-blue-700 font-bold">{activeNumA} · {activeDenB} ＝ {crossA}</span>
                    </p>
                    <p>
                      {t.crossRight} <span className="text-orange-700 font-bold">{activeNumB} · {activeDenA} ＝ {crossB}</span>
                    </p>
                    <p className="font-sans font-bold text-slate-900 border-t border-amber-200/60 pt-1">
                      {t.compareCross} <span className="font-mono">{crossA} {getComparisonSymbol()} {crossB}</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* 3. ΔΥΝΑΜΙΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ */}
              <div className="space-y-2 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider">
                    {t.numberLineTitle(maxLineVal)}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {t.autoScaleSub}
                  </span>
                </div>

                <div className="relative w-full pt-12 pb-6 px-4 sm:px-6 select-none">
                  <div className="relative w-full h-1.5 bg-slate-300 rounded-full">
                    {/* Δυναμικοί Ακέραιοι/Σημεία */}
                    {lineMarkers.map((num) => {
                      const pct = (num / maxLineVal) * 100;
                      return (
                        <div key={num} className="absolute flex flex-col items-center" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>
                          <div className="w-0.5 h-4 bg-slate-800 -top-2 relative" />
                          <span className="text-xs font-mono font-black text-slate-700 top-1 relative">{num}</span>
                        </div>
                      );
                    })}

                    {/* Δείκτης Κλάσματος Α (Μπλε) */}
                    <div 
                      className="absolute flex flex-col items-center -top-9 transition-all duration-500 ease-out z-10"
                      style={{ left: `${Math.min(100, Math.max(0, (valA / maxLineVal) * 100))}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="bg-blue-600 text-white font-mono text-[10px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-lg shadow-md mb-0.5 whitespace-nowrap">
                        A: {activeNumA}/{activeDenA} ({valA.toFixed(2).replace('.', locale === 'en' ? '.' : ',')})
                      </div>
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-md animate-bounce" />
                    </div>

                    {/* Δείκτης Κλάσματος Β (Πορτοκαλί) */}
                    <div 
                      className="absolute flex flex-col items-center -top-9 transition-all duration-500 ease-out z-20"
                      style={{ left: `${Math.min(100, Math.max(0, (valB / maxLineVal) * 100))}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="bg-orange-600 text-white font-mono text-[10px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-lg shadow-md mb-0.5 whitespace-nowrap">
                        B: {activeNumB}/{activeDenB} ({valB.toFixed(2).replace('.', locale === 'en' ? '.' : ',')})
                      </div>
                      <div className="w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow-md animate-bounce" />
                    </div>
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-400 italic text-center pt-1">
                  {t.numberLineTip}
                </p>
              </div>

              {/* 4. ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΠΙΤΣΑΣ */}
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                    {t.visualAreaTitle}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {t.visualAllUnits}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner">
                  {/* Πίτσα Α */}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-xs font-black text-blue-600 uppercase tracking-wider flex items-center gap-1">
                      <span>{t.fractionALabel}:</span>
                      <FractionDisplay num={activeNumA} den={activeDenA} size="sm" />
                    </span>
                    {renderFractionVisual(activeNumA, activeDenA, 'fill-blue-500', 'stroke-blue-700')}
                    <span className="font-mono text-xs text-slate-600 font-bold bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-xs flex items-center gap-1">
                      {activeDenA !== commonDen
                        ? <span>{t.commonLabel(homoNumA, commonDen)}</span>
                        : <span>{t.valueLabel(valA.toFixed(2).replace('.', locale === 'en' ? '.' : ','))}</span>}
                    </span>
                  </div>

                  {/* Πίτσα Β */}
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-xs font-black text-orange-600 uppercase tracking-wider flex items-center gap-1">
                      <span>{t.fractionBLabel}:</span>
                      <FractionDisplay num={activeNumB} den={activeDenB} size="sm" />
                    </span>
                    {renderFractionVisual(activeNumB, activeDenB, 'fill-orange-500', 'stroke-orange-700')}
                    <span className="font-mono text-xs text-slate-600 font-bold bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-xs flex items-center gap-1">
                      {activeDenA !== commonDen
                        ? <span>{t.commonLabel(homoNumB, commonDen)}</span>
                        : <span>{t.valueLabel(valB.toFixed(2).replace('.', locale === 'en' ? '.' : ','))}</span>}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 text-white p-4 rounded-2xl text-center font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 flex-wrap">
                <span>{t.summaryPrefix}</span>
                <FractionDisplay num={activeNumA} den={activeDenA} size="sm" className="text-white" />
                <span className="text-base font-mono">{getComparisonSymbol()}</span>
                <FractionDisplay num={activeNumB} den={activeDenB} size="sm" className="text-white" />
                <span className="text-[11px] font-normal">{t.summarySuffix}</span>
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
            href="/st-dimotikou/26-sigkrisi-klasmaton-ask"
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
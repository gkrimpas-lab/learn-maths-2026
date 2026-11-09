// pages/st-dimotikou/30-diairesi-klasmaton.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Κεντρική μεταβλητή ρύθμισης μέγιστων τιμών
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

// Component για κανονική κατακόρυφη μορφή απλού κλάσματος
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

// Component για κατακόρυφο σύνθετο κλάσμα
function ComplexFractionDisplay({ nA, dA, nB, dB, size = 'md', className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle font-mono leading-none px-1.5 ${className}`}>
      <FractionDisplay num={nA} den={dA} size={size === 'lg' ? 'md' : 'sm'} className="text-indigo-600" />
      <span className="w-full h-1 sm:h-1.5 bg-slate-900 rounded-full my-1 min-w-[36px]" />
      <FractionDisplay num={nB} den={dB} size={size === 'lg' ? 'md' : 'sm'} className="text-amber-600" />
    </span>
  );
}

const PRESETS_FF = [
  { nA: 3, dA: 4, nB: 1, dB: 4, resNum: 3, resDen: 1 },
  { nA: 1, dA: 2, nB: 1, dB: 6, resNum: 3, resDen: 1 },
  { nA: 2, dA: 3, nB: 3, dB: 4, resNum: 8, resDen: 9 },
  { nA: 4, dA: 5, nB: 2, dB: 5, resNum: 2, resDen: 1 }
];

const PRESETS_FN = [
  { nA: 3, dA: 4, nB: 2, resNum: 3, resDen: 8 },
  { nA: 4, dA: 5, nB: 2, resNum: 2, resDen: 5 },
  { nA: 1, dA: 2, nB: 3, resNum: 1, resDen: 6 },
  { nA: 5, dA: 6, nB: 5, resNum: 1, resDen: 6 }
];

const PRESETS_COMPLEX = [
  { nA: 2, dA: 3, nB: 4, dB: 5, resNum: 5, resDen: 6 },
  { nA: 3, dA: 4, nB: 1, dB: 2, resNum: 3, resDen: 2 },
  { nA: 1, dA: 3, nB: 2, dB: 9, resNum: 3, resDen: 2 },
  { nA: 4, dA: 7, nB: 2, dB: 7, resNum: 2, resDen: 1 }
];

// Βοηθητική συνάρτηση για εύρεση Μεγίστου Κοινού Διαιρέτη (ΜΚΔ)
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

const TRANSLATIONS = {
  el: {
    pageTitle: "Διαίρεση & Σύνθετα Κλάσματα - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθε πώς διαιρούμε κλάσμα με κλάσμα, κλάσμα με ακέραιο και πώς λύνουμε σύνθετα κλάσματα με άκρους και μέσους όρους για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 30 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Διαίρεση Κλασμάτων και Σύνθετα Κλάσματα",
    heroDesc: "Μάθε τον Χρυσό Κανόνα της διαίρεσης κλασμάτων: αντιστρέφουμε τους όρους του δεύτερου κλάσματος και εκτελούμε πολλαπλασιασμό, καθώς και πώς λύνουμε τα σύνθετα κλάσματα με τους άκρους και μέσους όρους!",
    heroFeature: "Οπτική Καταμέτρηση Μεριδίων, Αντιστροφή Κλασμάτων & Σύνθετα Κλάσματα",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες & Κανόνες Διαίρεσης & Σύνθετων Κλασμάτων",
    theorySubtitle: "Πώς μετατρέπουμε οποιαδήποτε διαίρεση σε πολλαπλασιασμό και πώς επιλύουμε τα σύνθετα κλάσματα.",
    card1Badge: "1. Ο ΧΡΥΣΟΣ ΚΑΝΟΝΑΣ",
    card1Sub: "Αντιστροφή 2ου",
    card1Title: "Ο Χρυσός Κανόνας",
    card1Text: "Αφήνουμε το 1ο κλάσμα όπως είναι, αντιστρέφουμε το 2ο κλάσμα και κάνουμε πολλαπλασιασμό.",
    card1Tip: "💡 Μυστικό: «Κρατάω το πρώτο, αλλάζω το σύμβολο σε πολλαπλασιασμό, τουμπάρω το δεύτερο!»",
    card2Badge: "2. ΜΕ ΑΚΕΡΑΙΟ",
    card2Sub: "γ ＝ γ/1",
    card2Title: "Διαίρεση με Ακέραιο",
    card2Text: "Γράφουμε τον ακέραιο ως κλάσμα με παρονομαστή το 1 (γ ＝ γ/1), αντιστρέφουμε σε 1/γ και πολλαπλασιάζουμε.",
    card2Tip: "⚡ Όταν διαιρούμε με ακέραιο αριθμό μεγαλύτερο του 1, το κλάσμα μικραίνει γιατί μοιράζεται σε περισσότερα ίσα μέρη!",
    card3Badge: "3. ΣΥΝΘΕΤΟ ΚΛΑΣΜΑ",
    card3Sub: "Άκρα & Μέσα",
    card3Title: "Σύνθετο Κλάσμα",
    card3Text: "Στη μορφή σύνθετου κλάσματος: γινόμενο άκρων (έξω) όρων στον αριθμητή, γινόμενο μέσων (μέσα) όρων στον παρονομαστή.",
    card3Tip: "🎯 Το σύνθετο κλάσμα είναι ένας κομψός τρόπος γραφής της διαίρεσης κλασμάτων.",
    tabFracFrac: "Κλάσμα με Κλάσμα",
    tabFracNum: "Κλάσμα με Ακέραιο",
    tabComplex: "Σύνθετο Κλάσμα",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitleComplex: "Διαδραστικό Εργαστήριο Σύνθετων Κλασμάτων (Άκροι & Μέσοι Όροι)",
    labTitleDiv: "Διαδραστικό Εργαστήριο Διαίρεσης Κλασμάτων",
    labSubtitleComplex: "Όρισε τους όρους του επάνω και του κάτω κλάσματος και δες πώς οι άκροι όροι δίνουν τον αριθμητή και οι μέσοι τον παρονομαστή!",
    labSubtitleDiv: "Ρύθμισε τον διαιρετέο και τον διαιρέτη και δες την αντιστροφή, τη μαθηματική πράξη και την οπτική καταμέτρηση μερίδων!",
    frac1ComplexLabel: "🔵 ΕΠΑΝΩ ΚΛΑΣΜΑ (ΑΡΙΘΜΗΤΗΣ ΣΥΝΘΕΤΟΥ)",
    frac1DivLabel: "🔵 ΚΛΑΣΜΑ 1 (ΔΙΑΙΡΕΤΕΟΣ)",
    frac2ComplexLabel: "🟠 ΚΑΤΩ ΚΛΑΣΜΑ (ΠΑΡΟΝΟΜΑΣΤΗΣ ΣΥΝΘΕΤΟΥ)",
    frac2DivLabel: "🟠 ΚΛΑΣΜΑ 2 (ΔΙΑΙΡΕΤΗΣ)",
    wholeDivLabel: "🔢 ΑΚΕΡΑΙΟΣ ΔΙΑΙΡΕΤΗΣ",
    numComplex: "Αριθμητής (Άκρος)",
    denComplex: "Παρονομαστής (Μέσος)",
    numComplexLower: "Αριθμητής (Μέσος)",
    denComplexLower: "Παρονομαστής (Άκρος)",
    numerator: "Αριθμητής",
    denominator: "Παρονομαστής",
    valueLabel: "ΤΙΜΗ",
    presetsTitle: "ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:",
    labTipComplex: "💡 Θυμήσου: Γινόμενο άκρων στον αριθμητή, γινόμενο μέσων στον παρονομαστή!",
    labTipDiv: "💡 Θυμήσου: Στη διαίρεση κλασμάτων αντιστρέφουμε πάντα το 2ο κλάσμα και κάνουμε πολλαπλασιασμό!",
    invalidDivisionZero: "⚠️ Αδύνατη Πράξη (Διαίρεση με το 0)",
    complexRuleHeading: "🧱 ΟΠΤΙΚΟΣ ΚΑΝΟΝΑΣ: ΑΚΡΟΙ (ΕΞΩ) ΚΑΙ ΜΕΣΟΙ (ΜΕΣΑ) ΟΡΟΙ",
    complexRuleDesc: "Πολλαπλασιάζουμε τους άκρους όρους για τον νέο αριθμητή και τους μέσους όρους για τον νέο παρονομαστή!",
    extremesCardTitle: "🟣 ΓΙΝΟΜΕΝΟ ΑΚΡΩΝ (ΕΞΩ) ΟΡΩΝ ➔ ΑΡΙΘΜΗΤΗΣ:",
    meansCardTitle: "🟠 ΓΙΝΟΜΕΝΟ ΜΕΣΩΝ (ΜΕΣΑ) ΟΡΩΝ ➔ ΠΑΡΟΝΟΜΑΣΤΗΣ:",
    finalSimpleFraction: "✨ ΤΕΛΙΚΟ ΑΠΛΟ ΚΛΑΣΜΑ:",
    whatMeansDivision: "💡 Τι σημαίνει η διαίρεση; Σημαίνει να μετρήσουμε πόσες φορές χωράει ο διαιρέτης (Κλάσμα 2) μέσα στον διαιρετέο (Κλάσμα 1)!",
    bar1Label: "📏 ΚΛΑΣΜΑ 1 (ΔΙΑΙΡΕΤΕΟΣ)",
    bar2Label: "📐 ΚΛΑΣΜΑ 2 (ΔΙΑΙΡΕΤΗΣ)",
    sizeToDivide: "Μέγεθος προς διαίρεση",
    portionSize: "Μέγεθος μερίδας",
    howFitsTitle: "ΠΩΣ ΧΩΡΑΕΙ Ο ΔΙΑΙΡΕΤΗΣ ΜΕΣΑ ΣΤΟΝ ΔΙΑΙΡΕΤΕΟ:",
    fitTime: (idx, label) => `${idx}η φορά (${label})`,
    remainderPart: "＋ υπόλοιπο μέρος",
    quotientLabel: "ΑΚΡΙΒΕΣ ΠΗΛΙΚΟ (ΠΟΣΕΣ ΦΟΡΕΣ ΧΩΡΑΕΙ):",
    timesUnit: "φορές!",
    fractionalQuotient: "Κλασματικά:",
    stepsComplexTitle: "🧱 ΣΥΝΘΕΤΟ ΚΛΑΣΜΑ:",
    stepComplex1: "1. Πολλαπλασιάζουμε τους άκρους όρους (τους έξω):",
    stepComplex2: "2. Πολλαπλασιάζουμε τους μέσους όρους (τους μέσα):",
    numeratorExtremes: "➔ Αριθμητής:",
    denominatorMeans: "➔ Παρονομαστής:",
    simplifiedMsg: (g, sN, sD) => (
      <span>
        ✨ Απλοποιώντας με το {g}: <FractionDisplay num={sN} den={sD} size="sm" className="text-emerald-800 font-bold" />
      </span>
    ),
    alreadyIrreducible: "Το κλάσμα είναι ήδη στην ανάγωγη μορφή του.",
    stepDivKeep: "1. Κρατάμε το 1ο κλάσμα (διαιρετέο) όπως είναι:",
    stepDivFlip: "2. Αντιστρέφουμε τους όρους του 2ου κλάσματος (διαιρέτη):",
    stepDivBecomes: (orig, invN, invD) => (
      <span>
        ➔ Το <strong>{orig}</strong> γίνεται <span className="bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200 font-mono font-bold">{invN}/{invD}</span>
      </span>
    ),
    stepDivMultiply: "3. Μετατρέπουμε τη διαίρεση σε πολλαπλασιασμό:",
    summaryTitle: "💡 Τελικό Αποτέλεσμα:",
    summaryComplexNote: (nA, dA, nB, dB, rN, rD) => `(Άκροι: ${nA}·${dB} ＝ ${rN}, Μέσοι: ${dA}·${nB} ＝ ${rD})`,
    summaryDivNote: "(Όταν διαιρούμε με κλάσμα ＜ 1, το πηλίκο μεγαλώνει γιατί το μικρό κομμάτι χωράει πολλές φορές!)",
    ctaTitle: "Ώρα για Εξάσκηση στη Διαίρεση Κλασμάτων!",
    ctaDesc: "Έμαθες τον κανόνα της διαίρεσης κλασμάτων και των σύνθετων κλασμάτων; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Division & Complex Fractions - 6th Grade | LearnMaths.gr",
    pageDesc: "Learn how to divide fractions by fractions, divide fractions by integers, and solve complex fractions using extremes and means for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 30 • 6TH GRADE",
    heroTitle: "Dividing Fractions & Complex Fractions",
    heroDesc: "Master the Golden Rule of fraction division: invert the second fraction and multiply, and learn how to solve complex fractions using extremes and means!",
    heroFeature: "Visual Sizing Models, Fraction Inversion & Complex Fraction Breakdown",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts & Rules for Fraction Division & Complex Fractions",
    theorySubtitle: "How to turn any division into multiplication and resolve complex stacked fractions.",
    card1Badge: "1. THE GOLDEN RULE",
    card1Sub: "Invert the 2nd",
    card1Title: "The Golden Rule",
    card1Text: "Keep the 1st fraction unchanged, invert the 2nd fraction (reciprocal), and multiply straight across.",
    card1Tip: "💡 Rhyme: 'Keep the first, flip the second, multiply across as reckoned!'",
    card2Badge: "2. BY AN INTEGER",
    card2Sub: "c ＝ c/1",
    card2Title: "Dividing by an Integer",
    card2Text: "Write the integer as a fraction with denominator 1 (c ＝ c/1), invert it to 1/c, and multiply.",
    card2Tip: "⚡ When dividing by an integer greater than 1, the fraction gets smaller because it is shared into more pieces!",
    card3Badge: "3. COMPLEX FRACTIONS",
    card3Sub: "Extremes & Means",
    card3Title: "Complex Fractions",
    card3Text: "For a stacked fraction: product of outer (extreme) terms goes to numerator, product of inner (mean) terms goes to denominator.",
    card3Tip: "🎯 A complex fraction is simply an elegant vertical way to write fraction division.",
    tabFracFrac: "Fraction by Fraction",
    tabFracNum: "Fraction by Integer",
    tabComplex: "Complex Fraction",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitleComplex: "Interactive Complex Fractions Lab (Extremes & Means)",
    labTitleDiv: "Interactive Fraction Division Lab",
    labSubtitleComplex: "Set numerator and denominator of both top and bottom fractions to watch extremes form the numerator and means form the denominator!",
    labSubtitleDiv: "Adjust dividend and divisor to follow inversion, multiplication, and visual bar-fitting models!",
    frac1ComplexLabel: "🔵 TOP FRACTION (NUMERATOR OF COMPLEX)",
    frac1DivLabel: "🔵 FRACTION 1 (DIVIDEND)",
    frac2ComplexLabel: "🟠 BOTTOM FRACTION (DENOMINATOR OF COMPLEX)",
    frac2DivLabel: "🟠 FRACTION 2 (DIVISOR)",
    wholeDivLabel: "🔢 INTEGER DIVISOR",
    numComplex: "Numerator (Extreme)",
    denComplex: "Denominator (Mean)",
    numComplexLower: "Numerator (Mean)",
    denComplexLower: "Denominator (Extreme)",
    numerator: "Numerator",
    denominator: "Denominator",
    valueLabel: "VALUE",
    presetsTitle: "PRESET EXAMPLES:",
    labTipComplex: "💡 Remember: Product of extremes in the numerator, product of means in the denominator!",
    labTipDiv: "💡 Remember: In fraction division, always invert the second fraction and multiply!",
    invalidDivisionZero: "⚠️ Impossible Operation (Division by 0)",
    complexRuleHeading: "🧱 VISUAL RULE: EXTREMES (OUTER) & MEANS (INNER) TERMS",
    complexRuleDesc: "Multiply extreme terms for the new numerator and mean terms for the new denominator!",
    extremesCardTitle: "🟣 PRODUCT OF EXTREMES (OUTER) ➔ NUMERATOR:",
    meansCardTitle: "🟠 PRODUCT OF MEANS (INNER) ➔ DENOMINATOR:",
    finalSimpleFraction: "✨ FINAL SIMPLE FRACTION:",
    whatMeansDivision: "💡 What does division mean? It means measuring how many times the divisor (Fraction 2) fits into the dividend (Fraction 1)!",
    bar1Label: "📏 FRACTION 1 (DIVIDEND)",
    bar2Label: "📐 FRACTION 2 (DIVISOR)",
    sizeToDivide: "Size to divide",
    portionSize: "Portion size",
    howFitsTitle: "HOW THE DIVISOR FITS INTO THE DIVIDEND:",
    fitTime: (idx, label) => `Fit #${idx} (${label})`,
    remainderPart: "＋ remainder part",
    quotientLabel: "EXACT QUOTIENT (HOW MANY TIMES IT FITS):",
    timesUnit: "times!",
    fractionalQuotient: "Fractional:",
    stepsComplexTitle: "🧱 COMPLEX FRACTION:",
    stepComplex1: "1. Multiply extreme terms (outer):",
    stepComplex2: "2. Multiply mean terms (inner):",
    numeratorExtremes: "➔ Numerator:",
    denominatorMeans: "➔ Denominator:",
    simplifiedMsg: (g, sN, sD) => (
      <span>
        ✨ Simplifying by {g}: <FractionDisplay num={sN} den={sD} size="sm" className="text-emerald-800 font-bold" />
      </span>
    ),
    alreadyIrreducible: "The fraction is already in irreducible lowest terms.",
    stepDivKeep: "1. Keep the 1st fraction (dividend) as it is:",
    stepDivFlip: "2. Invert the 2nd fraction (divisor):",
    stepDivBecomes: (orig, invN, invD) => (
      <span>
        ➔ <strong>{orig}</strong> becomes <span className="bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200 font-mono font-bold">{invN}/{invD}</span>
      </span>
    ),
    stepDivMultiply: "3. Convert division into multiplication:",
    summaryTitle: "💡 Final Result:",
    summaryComplexNote: (nA, dA, nB, dB, rN, rD) => `(Extremes: ${nA}·${dB} ＝ ${rN}, Means: ${dA}·${nB} ＝ ${rD})`,
    summaryDivNote: "(When dividing by a fraction ＜ 1, the quotient increases because the smaller piece fits multiple times!)",
    ctaTitle: "Time to Practice Fraction Division!",
    ctaDesc: "Mastered division of fractions and complex fractions? Test your skills with 10 interactive questions to consolidate your knowledge!",
    ctaBtn: "Start Exercises"
  }
};

export default function DiairesiKlasmatonPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Mode: 'fraction-fraction', 'fraction-number' ή 'complex-fraction'
  const [mode, setMode] = useState('fraction-fraction');

  // Κατάσταση για Κλάσμα Α (Διαιρετέος ή Επάνω Κλάσμα)
  const [numA, setNumA] = useState(3);
  const [denA, setDenA] = useState(4);

  // Κατάσταση για Κλάσμα Β (Διαιρέτης ή Κάτω Κλάσμα ή Ακέραιος)
  const [numB, setNumB] = useState(1);
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
  const activeDenB = mode === 'fraction-number' ? 1 : (denB === '' || Number(denB) === 0 ? 1 : Number(denB));

  const inverseNum = activeDenB;
  const inverseDen = activeNumB;

  const resultNum = activeNumA * inverseNum;
  const resultDen = activeDenA * inverseDen;

  const gcd = findGCD(resultNum, resultDen);
  const simplifiedNum = resultNum / gcd;
  const simplifiedDen = resultDen / gcd;
  const isSimplified = gcd > 1 && resultNum !== 0;

  const decimalResult = activeNumB > 0 ? (activeNumA / activeDenA) / (activeNumB / activeDenB) : 0;

  const renderBarVisual = () => {
    const valA = activeNumA / activeDenA;
    const valB = activeNumB / activeDenB;
    const maxVal = Math.max(valA, valB, 1);

    const widthA = maxVal > 0 ? (valA / maxVal) * 100 : 0;
    const widthB = maxVal > 0 ? (valB / maxVal) * 100 : 0;

    const countFits = valB > 0 ? Math.floor(valA / valB) : 0;
    const hasRemainder = valB > 0 && valA % valB > 0.0001;

    return (
      <div className="w-full bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-6 shadow-inner">
        <div className="text-center text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
          {t.whatMeansDivision}
        </div>

        <div className="space-y-6 max-w-xl mx-auto">
          {/* Μπάρα 1: Διαιρετέος */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-blue-700 uppercase tracking-wider items-center">
              <span>{t.bar1Label}</span>
              <span className="font-mono flex items-center gap-1">
                <FractionDisplay num={activeNumA} den={activeDenA} size="sm" />
                <span>≈ {formatNum(valA.toFixed(3), locale)}</span>
              </span>
            </div>
            <div className="w-full bg-slate-200/80 h-10 rounded-2xl p-1 border border-slate-300 shadow-inner flex">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-xl transition-all duration-500 flex items-center justify-between px-3 text-white font-mono font-black text-xs shadow-md truncate"
                style={{ width: `${Math.min(100, Math.max(8, widthA))}%` }}
              >
                <span>{activeNumA}/{activeDenA}</span>
                {widthA > 20 && <span className="text-[10px] opacity-80 font-normal">{t.sizeToDivide}</span>}
              </div>
            </div>
          </div>

          {/* Μπάρα 2: Διαιρέτης */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-orange-700 uppercase tracking-wider items-center">
              <span>{t.bar2Label}</span>
              <span className="font-mono flex items-center gap-1">
                {mode === 'fraction-number' ? (
                  <span>{activeNumB}</span>
                ) : (
                  <FractionDisplay num={activeNumB} den={activeDenB} size="sm" />
                )}
                <span>≈ {formatNum(valB.toFixed(3), locale)}</span>
              </span>
            </div>
            <div className="w-full bg-slate-200/80 h-10 rounded-2xl p-1 border border-slate-300 shadow-inner flex">
              <div 
                className="bg-gradient-to-r from-orange-400 to-amber-500 h-full rounded-xl transition-all duration-500 flex items-center justify-between px-3 text-white font-mono font-black text-xs shadow-md truncate"
                style={{ width: `${Math.min(100, Math.max(8, widthB))}%` }}
              >
                <span>{mode === 'fraction-number' ? activeNumB : `${activeNumB}/${activeDenB}`}</span>
                {widthB > 20 && <span className="text-[10px] opacity-80 font-normal">{t.portionSize}</span>}
              </div>
            </div>
          </div>

          {/* Οπτική Καταμέτρηση Μεριδίων */}
          {valB > 0 && valA >= valB && countFits <= 12 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider text-center">
                {t.howFitsTitle}
              </span>
              <div className="flex gap-1.5 justify-center flex-wrap items-center">
                {Array.from({ length: countFits }).map((_, idx) => (
                  <div key={idx} className="bg-amber-100 border-2 border-amber-400 text-amber-900 font-mono font-bold text-xs px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1">
                    <span>{idx + 1}η:</span>
                    {mode === 'fraction-number' ? (
                      <span>{activeNumB}</span>
                    ) : (
                      <FractionDisplay num={activeNumB} den={activeDenB} size="sm" />
                    )}
                  </div>
                ))}
                {hasRemainder && (
                  <div className="bg-slate-100 border-2 border-dashed border-slate-400 text-slate-600 font-mono font-bold text-xs px-2 py-1 rounded-xl">
                    {t.remainderPart}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Αποτέλεσμα Σύγκρισης / Πηλίκο */}
        <div className="text-center font-mono text-slate-800 bg-white border border-slate-200 p-4 rounded-2xl max-w-sm mx-auto shadow-sm space-y-1">
          <div className="text-slate-400 font-sans text-[11px] font-bold uppercase tracking-wider">
            {t.quotientLabel}
          </div>
          <div className="text-emerald-600 text-xl md:text-2xl font-black">
            {Number.isInteger(decimalResult) ? decimalResult : formatNum(decimalResult.toFixed(4), locale)} {t.timesUnit}
          </div>
          <div className="text-slate-500 text-xs font-mono font-bold flex items-center justify-center gap-1.5">
            <span>({t.fractionalQuotient}</span>
            {isSimplified ? (
              simplifiedDen === 1 ? (
                <span>{simplifiedNum}</span>
              ) : (
                <FractionDisplay num={simplifiedNum} den={simplifiedDen} size="sm" />
              )
            ) : (
              resultDen === 1 ? (
                <span>{resultNum}</span>
              ) : (
                <FractionDisplay num={resultNum} den={resultDen} size="sm" />
              )
            )}
            <span>)</span>
          </div>
        </div>
      </div>
    );
  };

  const renderComplexFractionVisual = () => {
    return (
      <div className="w-full bg-slate-50 p-4 sm:p-7 rounded-3xl border border-slate-200 space-y-6 shadow-inner">
        <div className="text-center space-y-1">
          <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
            {t.complexRuleHeading}
          </span>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            {t.complexRuleDesc}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 py-4">
          
          {/* Αριστερά: Το Σύνθετο Κλάσμα */}
          <div className="relative flex flex-col items-center bg-white p-6 sm:p-8 rounded-3xl border-2 border-indigo-200 shadow-md font-mono select-none">
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200 shadow-xs ring-2 ring-indigo-400">
                {activeNumA} <span className="text-[10px] font-sans text-indigo-500 font-bold ml-1">({locale === 'en' ? 'Extreme' : 'Άκρος'})</span>
              </span>
              <div className="w-14 sm:w-16 h-0.5 bg-slate-400 my-1 rounded-full" />
              <span className="text-xl sm:text-2xl font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 shadow-xs ring-2 ring-amber-400">
                {activeDenA} <span className="text-[10px] font-sans text-amber-600 font-bold ml-1">({locale === 'en' ? 'Mean' : 'Μέσος'})</span>
              </span>
            </div>

            <div className="w-36 sm:w-44 h-1.5 bg-slate-900 my-3 rounded-full shadow-sm" />

            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 shadow-xs ring-2 ring-amber-400">
                {activeNumB} <span className="text-[10px] font-sans text-amber-600 font-bold ml-1">({locale === 'en' ? 'Mean' : 'Μέσος'})</span>
              </span>
              <div className="w-14 sm:w-16 h-0.5 bg-slate-400 my-1 rounded-full" />
              <span className="text-xl sm:text-2xl font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200 shadow-xs ring-2 ring-indigo-400">
                {activeDenB} <span className="text-[10px] font-sans text-indigo-500 font-bold ml-1">({locale === 'en' ? 'Extreme' : 'Άκρος'})</span>
              </span>
            </div>
          </div>

          <div className="text-3xl text-indigo-600 font-black">➔</div>

          {/* Δεξιά: Οι πράξεις σε κάρτες */}
          <div className="space-y-4 max-w-xs w-full">
            <div className="bg-indigo-50 border-2 border-indigo-300 p-3.5 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-indigo-800 tracking-wider block">
                {t.extremesCardTitle}
              </span>
              <div className="font-mono text-base sm:text-lg font-black text-indigo-950">
                {activeNumA} · {activeDenB} ＝ <strong className="text-indigo-600">{resultNum}</strong>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-300 p-3.5 rounded-2xl shadow-xs space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block">
                {t.meansCardTitle}
              </span>
              <div className="font-mono text-base sm:text-lg font-black text-amber-950">
                {activeDenA} · {activeNumB} ＝ <strong className="text-amber-600">{resultDen}</strong>
              </div>
            </div>

            <div className="bg-white border-2 border-emerald-400 p-3.5 rounded-2xl shadow-sm text-center space-y-1">
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                {t.finalSimpleFraction}
              </span>
              <div className="font-mono text-xl sm:text-2xl font-black text-emerald-700 flex items-center justify-center gap-2">
                <FractionDisplay num={resultNum} den={resultDen} size="md" />
                {isSimplified && (
                  <>
                    <span>＝</span>
                    {simplifiedDen === 1 ? (
                      <span>{simplifiedNum}</span>
                    ) : (
                      <FractionDisplay num={simplifiedNum} den={simplifiedDen} size="md" />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const getStepByStepExplanation = () => {
    if (mode === 'complex-fraction') {
      return (
        <div className="space-y-3 flex flex-col justify-between h-full">
          <div className="space-y-2.5">
            <span className="font-black text-indigo-800 uppercase block text-[11px] flex items-center gap-1.5 flex-wrap">
              <span>{t.stepsComplexTitle}</span>
              <ComplexFractionDisplay nA={activeNumA} dA={activeDenA} nB={activeNumB} dB={activeDenB} size="sm" />
            </span>
            <div className="text-slate-600 space-y-1 text-xs md:text-sm">
              <p>{t.stepComplex1}</p>
              <p className="font-mono text-indigo-700 pl-2">
                {t.numeratorExtremes} {activeNumA} · {activeDenB} ＝ <strong className="text-indigo-900">{resultNum}</strong>
              </p>
              <p>{t.stepComplex2}</p>
              <p className="font-mono text-amber-700 pl-2">
                {t.denominatorMeans} {activeDenA} · {activeNumB} ＝ <strong className="text-amber-900">{resultDen}</strong>
              </p>
            </div>
            
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-xs md:text-sm flex items-center gap-2 flex-wrap">
              <ComplexFractionDisplay nA={activeNumA} dA={activeDenA} nB={activeNumB} dB={activeDenB} size="sm" />
              <span>＝</span>
              <span>({activeNumA} · {activeDenB}) / ({activeDenA} · {activeNumB})</span>
              <span>＝</span>
              <FractionDisplay num={resultNum} den={resultDen} size="sm" className="text-emerald-700 font-bold" />
            </div>
          </div>

          <div className="min-h-[28px] flex items-center pt-1 border-t border-slate-100">
            {isSimplified ? (
              <p className="text-emerald-700 text-xs font-bold">
                {t.simplifiedMsg(gcd, simplifiedNum, simplifiedDen)}
              </p>
            ) : (
              <p className="text-slate-400 text-xs italic">
                {t.alreadyIrreducible}
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3 flex flex-col justify-between h-full">
        <div className="space-y-2.5">
          <span className={`font-black uppercase block text-[11px] ${activeDenA === activeDenB ? 'text-blue-800' : 'text-indigo-800'}`}>
            {activeDenA === activeDenB 
              ? (locale === 'en' ? `🔵 LIKE DENOMINATORS (${activeDenA})` : `🔵 ΟΜΩΝΥΜΑ ΚΛΑΣΜΑΤΑ (ΙΔΙΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ: ${activeDenA})`)
              : (locale === 'en' ? `🟣 UNLIKE DENOMINATORS (${activeDenA} ≠ ${activeDenB})` : `🟣 ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ (${activeDenA} ≠ ${activeDenB})`)}
          </span>
          <div className="text-slate-600 space-y-1 text-xs md:text-sm">
            <p className="flex items-center gap-1.5 flex-wrap">
              <span>{t.stepDivKeep}</span>
              <FractionDisplay num={activeNumA} den={activeDenA} size="sm" className="text-blue-700 font-bold" />
            </p>
            <p>{t.stepDivFlip}</p>
            <p className="font-mono text-orange-700 pl-2">
              {t.stepDivBecomes(
                mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB,
                inverseNum,
                inverseDen
              )}
            </p>
            <p>{t.stepDivMultiply}</p>
          </div>
          
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-xs md:text-sm flex items-center gap-2 flex-wrap">
            <FractionDisplay num={activeNumA} den={activeDenA} size="sm" />
            <span>:</span>
            {mode === 'fraction-fraction' ? (
              <FractionDisplay num={activeNumB} den={activeDenB} size="sm" />
            ) : (
              <span>{activeNumB}</span>
            )}
            <span>＝</span>
            <FractionDisplay num={activeNumA} den={activeDenA} size="sm" />
            <span>·</span>
            <FractionDisplay num={inverseNum} den={inverseDen} size="sm" />
            <span>＝</span>
            <FractionDisplay num={resultNum} den={resultDen} size="sm" className="text-emerald-700 font-bold" />
          </div>
        </div>

        <div className="min-h-[28px] flex items-center pt-1 border-t border-slate-100">
          {isSimplified ? (
            <p className="text-emerald-700 text-xs font-bold">
              {t.simplifiedMsg(gcd, simplifiedNum, simplifiedDen)}
            </p>
          ) : (
            <p className="text-slate-400 text-xs italic">
              {t.alreadyIrreducible}
            </p>
          )}
        </div>
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
          href="/st-dimotikou/30-diairesi-klasmaton-ask"
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
              href="/st-dimotikou/30-diairesi-klasmaton-ask"
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold flex items-center justify-center gap-1.5 flex-wrap">
                  <FractionDisplay num="α" den="β" size="sm" />
                  <span>:</span>
                  <FractionDisplay num="γ" den="δ" size="sm" />
                  <span>＝</span>
                  <FractionDisplay num="α" den="β" size="sm" />
                  <span>·</span>
                  <FractionDisplay num="δ" den="γ" size="sm" className="text-sky-700 font-bold" />
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold flex items-center justify-center gap-1.5 flex-wrap">
                  <FractionDisplay num="α" den="β" size="sm" />
                  <span>: γ ＝</span>
                  <FractionDisplay num="α" den="β" size="sm" />
                  <span>·</span>
                  <FractionDisplay num="1" den="γ" size="sm" className="text-indigo-700 font-bold" />
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
                  <ComplexFractionDisplay nA="α" dA="β" nB="γ" dB="δ" size="sm" />
                  <span>＝</span>
                  <FractionDisplay num="α · δ" den="β · γ" size="md" className="text-emerald-700 font-bold" />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.card3Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. MODE SELECTOR TABS (3 Tabs) */}
        <div className="flex flex-wrap justify-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner max-w-xl mx-auto gap-1">
          <button
            type="button"
            onClick={() => { setMode('fraction-fraction'); setNumA(3); setDenA(4); setNumB(1); setDenB(4); }}
            className={`flex-1 min-w-[140px] text-center py-2.5 px-3 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
              mode === 'fraction-fraction' ? 'bg-blue-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ➗ {toCleanUppercase(t.tabFracFrac)}
          </button>
          <button
            type="button"
            onClick={() => { setMode('fraction-number'); setNumA(3); setDenA(4); setNumB(2); }}
            className={`flex-1 min-w-[140px] text-center py-2.5 px-3 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
              mode === 'fraction-number' ? 'bg-indigo-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔢 {toCleanUppercase(t.tabFracNum)}
          </button>
          <button
            type="button"
            onClick={() => { setMode('complex-fraction'); setNumA(2); setDenA(3); setNumB(4); setDenB(5); }}
            className={`flex-1 min-w-[140px] text-center py-2.5 px-3 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
              mode === 'complex-fraction' ? 'bg-emerald-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧱 {toCleanUppercase(t.tabComplex)}
          </button>
        </div>

        {/* 4. INTERACTIVE PLAYGROUND */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>{t.labBadge}</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {mode === 'complex-fraction' ? t.labTitleComplex : t.labTitleDiv}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-1">
              {mode === 'complex-fraction' ? t.labSubtitleComplex : t.labSubtitleDiv}
            </p>
          </div>

          {/* MAIN INTERACTIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* ΧΕΙΡΙΣΤΗΡΙΟ Α (ΕΠΑΝΩ ΚΛΑΣΜΑ / ΔΙΑΙΡΕΤΕΟΣ) */}
                <div className="bg-blue-50/60 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-3">
                  <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                    {mode === 'complex-fraction' ? t.frac1ComplexLabel : t.frac1DivLabel}
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        {mode === 'complex-fraction' ? t.numComplex : t.numerator}
                      </span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`div-num-a-${numA}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={numA === '' ? '' : String(numA)}
                          onChange={(e) => handleNumAChange(e.target.value)}
                          placeholder="3"
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
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        {mode === 'complex-fraction' ? t.denComplex : t.denominator}
                      </span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`div-den-a-${denA}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={denA === '' ? '' : String(denA)}
                          onChange={(e) => handleDenAChange(e.target.value)}
                          placeholder="4"
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

                {/* ΧΕΙΡΙΣΤΗΡΙΟ Β (ΚΑΤΩ ΚΛΑΣΜΑ / ΔΙΑΙΡΕΤΗΣ) */}
                {mode !== 'fraction-number' ? (
                  <div className="bg-orange-50/60 p-3.5 sm:p-4 rounded-2xl border border-orange-200 space-y-3">
                    <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                      {mode === 'complex-fraction' ? t.frac2ComplexLabel : t.frac2DivLabel}
                    </span>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                          {mode === 'complex-fraction' ? t.numComplexLower : t.numerator}
                        </span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(-1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            －
                          </button>
                          <input
                            key={`div-num-b-${numB}`}
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
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                          {mode === 'complex-fraction' ? t.denComplexLower : t.denominator}
                        </span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(-1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            －
                          </button>
                          <input
                            key={`div-den-b-${denB}`}
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
                ) : (
                  <div className="bg-indigo-50/60 p-3.5 sm:p-4 rounded-2xl border border-indigo-200 space-y-3">
                    <span className="text-xs font-black text-indigo-800 uppercase block tracking-wider">
                      {t.wholeDivLabel}
                    </span>
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.valueLabel}</span>
                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 max-w-[160px] mx-auto">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(-1); }} 
                          className="w-8 h-8 font-black text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`div-whole-b-${numB}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={numB === '' ? '' : String(numB)}
                          onChange={(e) => handleNumBChange(e.target.value)}
                          placeholder="2"
                          className="w-full min-w-0 text-center font-mono font-black text-lg outline-none text-indigo-600"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(1); }} 
                          className="w-8 h-8 font-black text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center justify-center active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    {t.presetsTitle}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(mode === 'fraction-fraction' ? PRESETS_FF : mode === 'fraction-number' ? PRESETS_FN : PRESETS_COMPLEX).map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (mode === 'fraction-fraction') {
                            setNumA(p.nA); setDenA(p.dA); setNumB(p.nB); setDenB(p.dB);
                          } else if (mode === 'fraction-number') {
                            setNumA(p.nA); setDenA(p.dA); setNumB(p.nB);
                          } else {
                            setNumA(p.nA); setDenA(p.dA); setNumB(p.nB); setDenB(p.dB);
                          }
                        }}
                        className="py-2 px-1.5 rounded-xl border text-xs transition-all text-center bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs touch-manipulation active:scale-95 flex items-center justify-center gap-1 flex-wrap"
                      >
                        {mode === 'complex-fraction' ? (
                          <>
                            <ComplexFractionDisplay nA={p.nA} dA={p.dA} nB={p.nB} dB={p.dB} size="sm" />
                            <span>➔</span>
                            {p.resDen === 1 ? (
                              <span className="font-bold">{p.resNum}</span>
                            ) : (
                              <FractionDisplay num={p.resNum} den={p.resDen} size="sm" />
                            )}
                          </>
                        ) : mode === 'fraction-number' ? (
                          <>
                            <FractionDisplay num={p.nA} den={p.dA} size="sm" />
                            <span className="font-bold">: {p.nB} ➔</span>
                            {p.resDen === 1 ? (
                              <span className="font-bold">{p.resNum}</span>
                            ) : (
                              <FractionDisplay num={p.resNum} den={p.resDen} size="sm" />
                            )}
                          </>
                        ) : (
                          <>
                            <FractionDisplay num={p.nA} den={p.dA} size="sm" />
                            <span className="font-bold">:</span>
                            <FractionDisplay num={p.nB} den={p.dB} size="sm" />
                            <span>➔</span>
                            {p.resDen === 1 ? (
                              <span className="font-bold">{p.resNum}</span>
                            ) : (
                              <FractionDisplay num={p.resNum} den={p.resDen} size="sm" />
                            )}
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ΒΗΜΑ-ΒΗΜΑ ΕΠΕΞΗΓΗΣΗ */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs min-h-[220px]">
                  {getStepByStepExplanation()}
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                {mode === 'complex-fraction' ? t.labTipComplex : t.labTipDiv}
              </div>
            </div>

            {/* RIGHT: VISUALIZATION */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΠΡΑΞΗΣ */}
              <div className="flex items-center justify-center p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
                {activeNumB === 0 ? (
                  <div className="text-rose-600 font-bold font-mono text-base">{t.invalidDivisionZero}</div>
                ) : mode === 'complex-fraction' ? (
                  /* Παρουσίαση Σύνθετου Κλάσματος */
                  <div className="flex items-center gap-3 sm:gap-6 font-mono font-black text-base sm:text-xl md:text-2xl select-none flex-wrap justify-center">
                    <ComplexFractionDisplay nA={activeNumA} dA={activeDenA} nB={activeNumB} dB={activeDenB} size="lg" />

                    <div className="text-slate-500 font-bold">＝</div>

                    {/* Ανάλυση Άκρων & Μέσων */}
                    <div className="flex flex-col items-center bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                      <FractionDisplay
                        num={`${activeNumA} · ${activeDenB}`}
                        den={`${activeDenA} · ${activeNumB}`}
                        size="md"
                        className="text-slate-700"
                      />
                    </div>

                    <div className="text-slate-500 font-bold">＝</div>

                    {/* Αποτέλεσμα */}
                    <div className="bg-emerald-50 px-3 py-2 rounded-2xl border border-emerald-200 shadow-xs">
                      <FractionDisplay num={resultNum} den={resultDen} size="lg" className="text-emerald-700 font-bold" />
                    </div>

                    {/* Ανάγωγο */}
                    {isSimplified && (
                      <>
                        <div className="text-emerald-600 font-bold">＝</div>
                        <div className="bg-emerald-100 px-3 py-2 rounded-2xl border border-emerald-300 shadow-xs">
                          {simplifiedDen === 1 ? (
                            <span className="text-emerald-800 text-2xl font-black">{simplifiedNum}</span>
                          ) : (
                            <FractionDisplay num={simplifiedNum} den={simplifiedDen} size="lg" className="text-emerald-800 font-black" />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  /* Παρουσίαση Κλασικής Διαίρεσης */
                  <div className="flex items-center gap-2.5 sm:gap-4 font-mono font-black text-lg sm:text-xl md:text-2xl select-none flex-wrap justify-center">
                    <FractionDisplay num={activeNumA} den={activeDenA} size="lg" className="text-blue-600" />

                    <div className="text-slate-400 font-light text-2xl">：</div>

                    {mode === 'fraction-fraction' ? (
                      <FractionDisplay num={activeNumB} den={activeDenB} size="lg" className="text-orange-600" />
                    ) : (
                      <span className="text-orange-600 text-2xl sm:text-3xl">{activeNumB}</span>
                    )}

                    <div className="text-indigo-600 font-bold px-1">➔</div>

                    <FractionDisplay num={activeNumA} den={activeDenA} size="lg" className="text-blue-600" />

                    <div className="text-indigo-600 font-bold">·</div>

                    <div className="bg-orange-50 px-2 sm:px-2.5 py-1 rounded-xl border-2 border-dashed border-orange-300">
                      <FractionDisplay num={inverseNum} den={inverseDen} size="lg" className="text-orange-700 font-bold" />
                    </div>

                    <div className="text-slate-500 font-bold">＝</div>

                    <div className="bg-emerald-50 px-3 py-2 rounded-2xl border border-emerald-200 shadow-xs">
                      <FractionDisplay num={resultNum} den={resultDen} size="lg" className="text-emerald-700 font-bold" />
                    </div>

                    {isSimplified && (
                      <>
                        <div className="text-emerald-600 font-bold">＝</div>
                        <div className="bg-emerald-100 px-3 py-2 rounded-2xl border border-emerald-300 shadow-xs">
                          {simplifiedDen === 1 ? (
                            <span className="text-emerald-800 text-2xl font-black">{simplifiedNum}</span>
                          ) : (
                            <FractionDisplay num={simplifiedNum} den={simplifiedDen} size="lg" className="text-emerald-800 font-black" />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 2. ΓΡΑΦΙΚΗ ΑΠΕΙΚΟΝΙΣΗ */}
              <div className="space-y-2 flex-1 flex flex-col justify-center">
                {mode === 'complex-fraction' ? (
                  renderComplexFractionVisual()
                ) : (
                  <>
                    <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block text-center">
                      {locale === 'en' ? '📏 GRAPHICAL SIZING & FRACTIONAL MEASUREMENT' : '📏 ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΕΓΕΘΩΝ ΚΑΙ ΚΑΤΑΜΕΤΡΗΣΗ ΜΕΡΙΔΙΩΝ'}
                    </span>
                    {activeNumB > 0 ? (
                      renderBarVisual()
                    ) : (
                      <div className="text-center text-xs text-slate-400 italic py-6">
                        {locale === 'en' ? 'Select a divisor greater than 0 to view the visualization.' : 'Επίλεξε έναν διαιρέτη μεγαλύτερο του 0 για να εμφανιστεί η οπτικοποίηση.'}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-3.5 sm:p-4 rounded-2xl text-center font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 flex-wrap">
                <span>{t.summaryTitle}</span>
                {mode === 'complex-fraction' ? (
                  <>
                    <ComplexFractionDisplay nA={activeNumA} dA={activeDenA} nB={activeNumB} dB={activeDenB} size="sm" />
                    <span className="font-mono">＝</span>
                    {isSimplified && simplifiedDen === 1 ? (
                      <span className="text-amber-300 font-bold">{simplifiedNum}</span>
                    ) : (
                      <FractionDisplay
                        num={isSimplified ? simplifiedNum : resultNum}
                        den={isSimplified ? simplifiedDen : resultDen}
                        size="sm"
                        className="text-amber-300 font-bold"
                      />
                    )}
                    <span className="text-[11px] font-normal">{t.summaryComplexNote(activeNumA, activeDenA, activeNumB, activeDenB, resultNum, resultDen)}</span>
                  </>
                ) : (
                  <>
                    <FractionDisplay num={activeNumA} den={activeDenA} size="sm" className="text-white" />
                    <span className="font-mono">:</span>
                    {mode === 'fraction-number' ? (
                      <span className="font-mono">{activeNumB}</span>
                    ) : (
                      <FractionDisplay num={activeNumB} den={activeDenB} size="sm" className="text-white" />
                    )}
                    <span className="font-mono">＝</span>
                    {isSimplified && simplifiedDen === 1 ? (
                      <span className="text-amber-300 font-bold">{simplifiedNum}</span>
                    ) : (
                      <FractionDisplay
                        num={isSimplified ? simplifiedNum : resultNum}
                        den={isSimplified ? simplifiedDen : resultDen}
                        size="sm"
                        className="text-amber-300 font-bold"
                      />
                    )}
                    <span className="text-[11px] font-normal">{t.summaryDivNote}</span>
                  </>
                )}
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
            href="/st-dimotikou/30-diairesi-klasmaton-ask"
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
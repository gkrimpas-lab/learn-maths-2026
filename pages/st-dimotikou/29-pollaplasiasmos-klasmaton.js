// pages/st-dimotikou/29-pollaplasiasmos-klasmaton.js
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

const PRESETS_FF = [
  { nA: 2, dA: 3, nB: 3, dB: 4, resNum: 1, resDen: 2 },
  { nA: 4, dA: 3, nB: 3, dB: 2, resNum: 2, resDen: 1 },
  { nA: 5, dA: 4, nB: 2, dB: 3, resNum: 5, resDen: 6 },
  { nA: 3, dA: 2, nB: 5, dB: 3, resNum: 5, resDen: 2 }
];

const PRESETS_NF = [
  { nA: 3, nB: 1, dB: 4, resNum: 3, resDen: 4 },
  { nA: 2, nB: 2, dB: 5, resNum: 4, resDen: 5 },
  { nA: 4, nB: 1, dB: 2, resNum: 2, resDen: 1 },
  { nA: 3, nB: 4, dB: 3, resNum: 4, resDen: 1 }
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
    pageTitle: "Πολλαπλασιασμός Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθε πώς πολλαπλασιάζουμε κλάσμα με κλάσμα και ακέραιο με κλάσμα, καθώς και πώς απλοποιούμε το γινόμενο για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 29 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Πολλαπλασιασμός Κλασμάτων και Ακεραίου με Κλάσμα",
    heroDesc: "Μάθε πώς πολλαπλασιάζουμε κλάσμα με κλάσμα (αριθμητή με αριθμητή και παρονομαστή με παρονομαστή) και ακέραιο με κλάσμα, καθώς και πώς απλοποιούμε το γινόμενο!",
    heroFeature: "Οπτικοποίηση με Πλέγμα Εμβαδού & Επαναλαμβανόμενες Μονάδες",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες & Κανόνες Πολλαπλασιασμού Κλασμάτων",
    theorySubtitle: "Όλα όσα πρέπει να γνωρίζεις για το γινόμενο κλασμάτων, τον πολλαπλασιασμό με ακέραιο και τους αντίστροφους αριθμούς.",
    card1Badge: "1. ΚΛΑΣΜΑ ΕΠΙ ΚΛΑΣΜΑ",
    card1Sub: "Απευθείας Γινόμενο",
    card1Title: "Κλάσμα επί Κλάσμα",
    card1Text: "Πολλαπλασιάζουμε αριθμητή με αριθμητή και παρονομαστή με παρονομαστή. Δεν χρειάζεται ποτέ να γίνουν ομώνυμα!",
    card1Tip: "💡 Χρυσός Κανόνας: Δεν ψάχνουμε ποτέ Ε.Κ.Π. στον πολλαπλασιασμό! Πολλαπλασιάζουμε ευθεία οριζόντια.",
    card2Badge: "2. ΑΚΕΡΑΙΟΣ ΕΠΙ ΚΛΑΣΜΑ",
    card2Sub: "Μόνο στον Αριθμητή",
    card2Title: "Ακέραιος επί Κλάσμα",
    card2Text: "Πολλαπλασιάζουμε τον ακέραιο μόνο με τον αριθμητή του κλάσματος. Ο παρονομαστής παραμένει ακριβώς ο ίδιος.",
    card2Tip: "⚡ Κάθε ακέραιος α μπορεί να γραφτεί ως κλάσμα α/1 (π.χ. 3 ＝ 3/1, άρα (3/1) · (2/7) ＝ 6/7).",
    card3Badge: "3. ΑΝΤΙΣΤΡΟΦΟΙ",
    card3Sub: "Γινόμενο ＝ 1",
    card3Title: "Αντίστροφοι Αριθμοί",
    card3Text: "Δύο αριθμοί λέγονται αντίστροφοι όταν το γινόμενό τους ισούται ακριβώς με τη μονάδα (1).",
    card3Tip: "🎯 Για να βρεις τον αντίστροφο ενός κλάσματος, απλώς ανταλλάσσεις τη θέση του αριθμητή και του παρονομαστή!",
    tabFracFrac: "Κλάσμα επί Κλάσμα",
    tabNumFrac: "Ακέραιος επί Κλάσμα",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Διαδραστικό Εργαστήριο Πολλαπλασιασμού Κλασμάτων",
    labSubtitleFF: "Όρισε τους όρους των δύο κλασμάτων και δες το γινόμενο και την οπτικοποίηση με το πλέγμα εμβαδού!",
    labSubtitleNF: "Όρισε τον ακέραιο και το κλάσμα και δες την αναπαράσταση ως επαναλαμβανόμενες μονάδες!",
    fraction1Label: "🔵 ΚΛΑΣΜΑ 1",
    wholeNumberLabel: "🔢 ΦΥΣΙΚΟΣ ΑΡΙΘΜΟΣ (ΑΚΕΡΑΙΟΣ)",
    fraction2Label: "🟠 ΚΛΑΣΜΑ 2",
    numerator: "ΑΡΙΘΜΗΤΗΣ",
    denominator: "ΠΑΡΟΝΟΜΑΣΤΗΣ",
    valueLabel: "ΤΙΜΗ",
    presetsTitle: "ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:",
    stepsTitle: "📝 ΒΗΜΑΤΑ ΥΠΟΛΟΓΙΣΜΟΥ:",
    stepNumerators: (nA, nB, rN) => `1. Αριθμητές: ${nA} · ${nB} ＝ ${rN}`,
    stepDenominators: (dA, dB, rD) => `2. Παρονομαστές: ${dA} · ${dB} ＝ ${rD}`,
    stepImagineWhole: (w) => `1. Φανταζόμαστε τον ακέραιο ως κλάσμα: ${w}/1`,
    stepNumWhole: (w, nB, rN) => `2. Αριθμητής: ${w} · ${nB} ＝ ${rN}`,
    stepDenWhole: (dB, rD) => `3. Παρονομαστής: 1 · ${dB} ＝ ${rD}`,
    simplifiedNotice: (g, sN, sD) => (
      <span>
        ✨ Απλοποίηση με το {g}: <FractionDisplay num={sN} den={sD} size="sm" className="text-emerald-800 font-bold" />
      </span>
    ),
    labTip: "💡 Συμβουλή: Στον πολλαπλασιασμό κλασμάτων δεν χρειάζεται να κάνουμε τα κλάσματα ομώνυμα!",
    visualGridTitle: "🔲 ΟΠΤΙΚΟΠΟΙΗΣΗ ΜΕ ΠΛΕΓΜΑ ΕΜΒΑΔΟΥ:",
    legendFraction1: "1ο Κλάσμα",
    legendFraction2: "2ο Κλάσμα",
    legendOverlap: "Κοινή Περιοχή (Γινόμενο)",
    unitsNotice: (uY, uX, total) => `ℹ️ Εμφανίζονται ${uY} · ${uX} ＝ ${total} ακέραιες μονάδες (χωρισμένες με έντονη γραμμή) λόγω καταχρηστικών κλασμάτων.`,
    visualPizzasTitle: "🍕 ΟΠΤΙΚΟΠΟΙΗΣΗ ΩΣ ΕΠΑΝΑΛΑΜΒΑΝΟΜΕΝΕΣ ΜΟΝΑΔΕΣ:",
    timesLabel: (w) => `${w} φορές`,
    timeRepetition: (i) => `Φορά ${i}η`,
    slicesLabel: (rem, den) => `Κομμάτια: ${rem}/${den}`,
    totalProduct: "ΣΥΝΟΛΙΚΟ ΓΙΝΟΜΕΝΟ",
    summaryTitle: "💡 ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ:",
    ctaTitle: "Ώρα για Εξάσκηση στον Πολλαπλασιασμό Κλασμάτων!",
    ctaDesc: "Έμαθες να πολλαπλασιάζεις κλάσματα και ακεραίους; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Multiplying Fractions - 6th Grade | LearnMaths.gr",
    pageDesc: "Learn how to multiply fractions by fractions and whole numbers by fractions, plus how to simplify products for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 29 • 6TH GRADE",
    heroTitle: "Multiplying Fractions and Whole Numbers by Fractions",
    heroDesc: "Discover how to multiply fraction by fraction (numerator by numerator and denominator by denominator) and whole number by fraction, plus how to simplify!",
    heroFeature: "Visual Area Grid Model & Repeated Addition Representations",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts & Rules for Multiplying Fractions",
    theorySubtitle: "Everything you need to know about fraction products, multiplying with whole numbers, and reciprocals.",
    card1Badge: "1. FRACTION BY FRACTION",
    card1Sub: "Straightforward Product",
    card1Title: "Fraction by Fraction",
    card1Text: "Multiply numerator by numerator and denominator by denominator. Common denominators are NEVER needed!",
    card1Tip: "💡 Golden Rule: We never seek an LCM in multiplication! Simply multiply straight across horizontally.",
    card2Badge: "2. WHOLE NUMBER BY FRACTION",
    card2Sub: "Numerator Only",
    card2Title: "Whole Number by Fraction",
    card2Text: "Multiply the whole number strictly by the numerator. The denominator stays exactly the same.",
    card2Tip: "⚡ Any whole number a can be written as a/1 (e.g. 3 ＝ 3/1, so (3/1) · (2/7) ＝ 6/7).",
    card3Badge: "3. RECIPROCALS",
    card3Sub: "Product ＝ 1",
    card3Title: "Reciprocal Numbers",
    card3Text: "Two numbers are called reciprocals (or multiplicative inverses) when their product equals exactly 1.",
    card3Tip: "🎯 To find the reciprocal of a fraction, simply flip the positions of the numerator and denominator!",
    tabFracFrac: "Fraction by Fraction",
    tabNumFrac: "Whole Number by Fraction",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Interactive Fraction Multiplication Lab",
    labSubtitleFF: "Set the terms of both fractions to watch the product calculation and explore the visual area grid model!",
    labSubtitleNF: "Set the whole number and fraction to observe the repeated fractional units model!",
    fraction1Label: "🔵 FRACTION 1",
    wholeNumberLabel: "🔢 WHOLE NUMBER",
    fraction2Label: "🟠 FRACTION 2",
    numerator: "NUMERATOR",
    denominator: "DENOMINATOR",
    valueLabel: "VALUE",
    presetsTitle: "PRESET EXAMPLES:",
    stepsTitle: "📝 CALCULATION STEPS:",
    stepNumerators: (nA, nB, rN) => `1. Numerators: ${nA} · ${nB} ＝ ${rN}`,
    stepDenominators: (dA, dB, rD) => `2. Denominators: ${dA} · ${dB} ＝ ${rD}`,
    stepImagineWhole: (w) => `1. Imagine the whole number as a fraction: ${w}/1`,
    stepNumWhole: (w, nB, rN) => `2. Numerator: ${w} · ${nB} ＝ ${rN}`,
    stepDenWhole: (dB, rD) => `3. Denominator: 1 · ${dB} ＝ ${rD}`,
    simplifiedNotice: (g, sN, sD) => (
      <span>
        ✨ Simplifying by {g}: <FractionDisplay num={sN} den={sD} size="sm" className="text-emerald-800 font-bold" />
      </span>
    ),
    labTip: "💡 Tip: When multiplying fractions, converting to common denominators is never required!",
    visualGridTitle: "🔲 VISUALIZATION VIA AREA GRID:",
    legendFraction1: "1st Fraction",
    legendFraction2: "2nd Fraction",
    legendOverlap: "Overlap Area (Product)",
    unitsNotice: (uY, uX, total) => `ℹ️ Showing ${uY} · ${uX} ＝ ${total} whole units (separated by bold line borders) due to improper fractions.`,
    visualPizzasTitle: "🍕 VISUALIZATION AS REPEATED UNITS:",
    timesLabel: (w) => `${w} times`,
    timeRepetition: (i) => `Repeat ${i}`,
    slicesLabel: (rem, den) => `Slices: ${rem}/${den}`,
    totalProduct: "TOTAL PRODUCT",
    summaryTitle: "💡 FINAL RESULT:",
    ctaTitle: "Time to Practice Multiplying Fractions!",
    ctaDesc: "Mastered multiplying fractions and whole numbers? Test your skills with 10 interactive questions to solidify your knowledge!",
    ctaBtn: "Start Exercises"
  }
};

export default function PollaplasiasmosKlasmatonPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Mode: 'fraction-fraction' ή 'number-fraction'
  const [mode, setMode] = useState('fraction-fraction');

  // Κατάσταση για Κλάσμα Α (ή Ακέραιο Α)
  const [numA, setNumA] = useState(2);
  const [denA, setDenA] = useState(3);

  // Κατάσταση για Κλάσμα Β
  const [numB, setNumB] = useState(3);
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

  let resultNum = 0;
  let resultDen = 1;

  if (mode === 'fraction-fraction') {
    resultNum = activeNumA * activeNumB;
    resultDen = activeDenA * activeDenB;
  } else {
    resultNum = activeNumA * activeNumB;
    resultDen = activeDenB;
  }

  const gcd = findGCD(resultNum, resultDen);
  const simplifiedNum = resultNum / gcd;
  const simplifiedDen = resultDen / gcd;
  const isSimplified = gcd > 1 && resultNum !== 0;

  const renderGridVisual = () => {
    const unitsY = Math.max(1, Math.ceil(activeNumA / activeDenA));
    const unitsX = Math.max(1, Math.ceil(activeNumB / activeDenB));

    const totalRows = unitsY * activeDenA;
    const totalCols = unitsX * activeDenB;

    const filledRows = activeNumA;
    const filledCols = activeNumB;

    if (totalRows <= 25 && totalCols <= 25) {
      const cells = [];
      for (let r = 0; r < totalRows; r++) {
        for (let c = 0; c < totalCols; c++) {
          const isSelectedA = r < filledRows;
          const isSelectedB = c < filledCols;
          const isOverlap = isSelectedA && isSelectedB;

          const isBottomUnitBorder = (r + 1) % activeDenA === 0 && r + 1 < totalRows;
          const isRightUnitBorder = (c + 1) % activeDenB === 0 && c + 1 < totalCols;

          let cellBg = 'bg-white border-slate-200';
          if (isOverlap) {
            cellBg = 'bg-indigo-600 border-indigo-700 shadow-xs';
          } else if (isSelectedA) {
            cellBg = 'bg-blue-300 border-blue-400';
          } else if (isSelectedB) {
            cellBg = 'bg-orange-300 border-orange-400';
          }

          cells.push(
            <div
              key={`${r}-${c}`}
              className={`border transition-colors duration-200 ${cellBg} ${
                isBottomUnitBorder ? 'border-b-2 border-b-slate-700' : ''
              } ${isRightUnitBorder ? 'border-r-2 border-r-slate-700' : ''}`}
              style={{ aspectRatio: '1/1' }}
            />
          );
        }
      }

      return (
        <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto p-2">
          <div 
            className="grid gap-0.5 border-2 border-slate-800 p-2 rounded-2xl bg-slate-100 shadow-inner w-full overflow-hidden"
            style={{ gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))` }}
          >
            {cells}
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-bold pt-1">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-300 rounded border border-blue-400" /> {t.legendFraction1} ({activeNumA}/{activeDenA})</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-300 rounded border border-orange-400" /> {t.legendFraction2} ({activeNumB}/{activeDenB})</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-indigo-600 rounded border border-indigo-700" /> {t.legendOverlap} ({resultNum}/{resultDen})</span>
          </div>
          {(unitsX > 1 || unitsY > 1) && (
            <span className="text-[11px] text-slate-500 font-medium italic text-center">
              {t.unitsNotice(unitsY, unitsX, unitsY * unitsX)}
            </span>
          )}
        </div>
      );
    }

    const pctW = Math.min(100, (activeNumB / totalCols) * 100);
    const pctH = Math.min(100, (activeNumA / totalRows) * 100);

    return (
      <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto p-2">
        <div className="relative w-full aspect-square border-2 border-slate-800 rounded-2xl bg-white overflow-hidden shadow-inner">
          {Array.from({ length: unitsX - 1 }).map((_, i) => (
            <div 
              key={`vx-${i}`} 
              className="absolute top-0 bottom-0 border-r-2 border-slate-700 z-10" 
              style={{ left: `${((i + 1) / unitsX) * 100}%` }} 
            />
          ))}
          {Array.from({ length: unitsY - 1 }).map((_, i) => (
            <div 
              key={`hy-${i}`} 
              className="absolute left-0 right-0 border-b-2 border-slate-700 z-10" 
              style={{ top: `${((i + 1) / unitsY) * 100}%` }} 
            />
          ))}

          <div 
            className="absolute top-0 left-0 w-full bg-blue-200/80 border-b border-blue-400 transition-all duration-300"
            style={{ height: `${pctH}%` }}
          />
          <div 
            className="absolute top-0 left-0 h-full bg-orange-200/80 border-r border-orange-400 transition-all duration-300"
            style={{ width: `${pctW}%` }}
          />
          <div 
            className="absolute top-0 left-0 bg-indigo-600 border border-indigo-700 transition-all duration-300 shadow-md"
            style={{ width: `${pctW}%`, height: `${pctH}%` }}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-xs font-bold pt-1">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-300 rounded border border-blue-400" /> {t.legendFraction1} ({activeNumA}/{activeDenA})</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-300 rounded border border-orange-400" /> {t.legendFraction2} ({activeNumB}/{activeDenB})</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-indigo-600 rounded border border-indigo-700" /> {t.legendOverlap} ({resultNum}/{resultDen})</span>
        </div>
      </div>
    );
  };

  const renderPizzasVisual = (num, den, fillColor = 'fill-blue-500', strokeColor = 'stroke-blue-700') => {
    const totalPizzasNeeded = Math.max(1, Math.ceil(num / den));
    const pizzas = [];

    const radius = 40;
    const cx = 50;
    const cy = 50;

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
            } transition-colors duration-200 stroke-[0.7]`}
          />
        );
      }

      pizzas.push(
        <div key={p} className="relative flex flex-col items-center">
          <svg width="95" height="95" viewBox="0 0 100 100" className="drop-shadow-xs overflow-visible">
            {slices}
            <circle cx={cx} cy={cy} r="2" className="fill-slate-800" />
          </svg>
          <span className="text-[9px] font-bold text-slate-400 mt-1">{t.slicesLabel(remainingNumForThisPizza, den)}</span>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-2.5 p-2.5 bg-white rounded-2xl border border-slate-200 shadow-inner max-w-full">
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
          href="/st-dimotikou/29-pollaplasiasmos-klasmaton-ask"
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
              href="/st-dimotikou/29-pollaplasiasmos-klasmaton-ask"
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
                  <FractionDisplay num="2" den="3" size="sm" />
                  <span>·</span>
                  <FractionDisplay num="4" den="5" size="sm" />
                  <span>＝</span>
                  <span className="flex flex-col items-center">
                    <span>2 · 4</span>
                    <span className="w-full h-0.5 bg-slate-700 my-0.5" />
                    <span>3 · 5</span>
                  </span>
                  <span>＝</span>
                  <FractionDisplay num="8" den="15" size="md" className="text-sky-700 font-bold" />
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
                  <span>3 ·</span>
                  <FractionDisplay num="2" den="7" size="sm" />
                  <span>＝</span>
                  <span className="flex flex-col items-center">
                    <span>3 · 2</span>
                    <span className="w-full h-0.5 bg-slate-700 my-0.5" />
                    <span>7</span>
                  </span>
                  <span>＝</span>
                  <FractionDisplay num="6" den="7" size="md" className="text-indigo-700 font-bold" />
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold flex items-center justify-center gap-1.5 flex-wrap">
                  <FractionDisplay num="3" den="4" size="sm" />
                  <span>·</span>
                  <FractionDisplay num="4" den="3" size="sm" />
                  <span>＝</span>
                  <FractionDisplay num="12" den="12" size="sm" />
                  <span>＝</span>
                  <strong className="text-emerald-700 text-base">1</strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.card3Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. MODE SELECTOR TABS */}
        <div className="flex justify-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner max-w-md mx-auto gap-1">
          <button
            type="button"
            onClick={() => { setMode('fraction-fraction'); setNumA(2); setDenA(3); setNumB(3); setDenB(4); }}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
              mode === 'fraction-fraction' ? 'bg-blue-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✖️ {toCleanUppercase(t.tabFracFrac)}
          </button>
          <button
            type="button"
            onClick={() => { setMode('number-fraction'); setNumA(3); setNumB(1); setDenB(4); }}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
              mode === 'number-fraction' ? 'bg-indigo-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔢 {toCleanUppercase(t.tabNumFrac)}
          </button>
        </div>

        {/* 4. INTERACTIVE PLAYGROUND */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>{t.labBadge}</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-1">
              {mode === 'fraction-fraction' ? t.labSubtitleFF : t.labSubtitleNF}
            </p>
          </div>

          {/* MAIN INTERACTIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* ΧΕΙΡΙΣΤΗΡΙΟ Α (ΚΛΑΣΜΑ 1 Η ΑΚΕΡΑΙΟΣ) */}
                {mode === 'fraction-fraction' ? (
                  <div className="bg-blue-50/60 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-3">
                    <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                      {t.fraction1Label}
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
                            key={`mult-num-a-${numA}`}
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
                            key={`mult-den-a-${denA}`}
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
                ) : (
                  <div className="bg-indigo-50/60 p-3.5 sm:p-4 rounded-2xl border border-indigo-200 space-y-3">
                    <span className="text-xs font-black text-indigo-800 uppercase block tracking-wider">
                      {t.wholeNumberLabel}
                    </span>
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{t.valueLabel}</span>
                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 max-w-[160px] mx-auto">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(-1); }} 
                          className="w-8 h-8 font-black text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`mult-whole-a-${numA}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={numA === '' ? '' : String(numA)}
                          onChange={(e) => handleNumAChange(e.target.value)}
                          placeholder="3"
                          className="w-full min-w-0 text-center font-mono font-black text-lg outline-none text-indigo-600"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(1); }} 
                          className="w-8 h-8 font-black text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ΧΕΙΡΙΣΤΗΡΙΟ Β (ΚΛΑΣΜΑ 2) */}
                <div className="bg-orange-50/60 p-3.5 sm:p-4 rounded-2xl border border-orange-200 space-y-3">
                  <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                    {t.fraction2Label}
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
                          key={`mult-num-b-${numB}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={numB === '' ? '' : String(numB)}
                          onChange={(e) => handleNumBChange(e.target.value)}
                          placeholder="3"
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
                          key={`mult-den-b-${denB}`}
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
                    {mode === 'fraction-fraction' ? (
                      PRESETS_FF.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNumA(p.nA);
                            setDenA(p.dA);
                            setNumB(p.nB);
                            setDenB(p.dB);
                          }}
                          className={`py-2 px-1.5 rounded-xl border text-xs transition-all text-center touch-manipulation active:scale-95 flex items-center justify-center gap-1 ${
                            activeNumA === p.nA && activeDenA === p.dA && activeNumB === p.nB && activeDenB === p.dB
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                          }`}
                        >
                          <FractionDisplay num={p.nA} den={p.dA} size="sm" />
                          <span className="font-bold">·</span>
                          <FractionDisplay num={p.nB} den={p.dB} size="sm" />
                          <span className="font-bold font-mono">➔</span>
                          {p.resDen === 1 ? (
                            <span className="font-bold">{p.resNum}</span>
                          ) : (
                            <FractionDisplay num={p.resNum} den={p.resDen} size="sm" />
                          )}
                        </button>
                      ))
                    ) : (
                      PRESETS_NF.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNumA(p.nA);
                            setNumB(p.nB);
                            setDenB(p.dB);
                          }}
                          className={`py-2 px-1.5 rounded-xl border text-xs transition-all text-center touch-manipulation active:scale-95 flex items-center justify-center gap-1 ${
                            activeNumA === p.nA && activeNumB === p.nB && activeDenB === p.dB
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                          }`}
                        >
                          <span className="font-bold">{p.nA}</span>
                          <span className="font-bold">·</span>
                          <FractionDisplay num={p.nB} den={p.dB} size="sm" />
                          <span className="font-bold font-mono">➔</span>
                          {p.resDen === 1 ? (
                            <span className="font-bold">{p.resNum}</span>
                          ) : (
                            <FractionDisplay num={p.resNum} den={p.resDen} size="sm" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* ΒΗΜΑ-ΒΗΜΑ ΕΠΕΞΗΓΗΣΗ */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs space-y-2">
                  <span className="font-black text-slate-900 uppercase block text-[11px]">
                    {t.stepsTitle}
                  </span>
                  {mode === 'fraction-fraction' ? (
                    <div className="space-y-1 text-xs">
                      <p>{t.stepNumerators(activeNumA, activeNumB, resultNum)}</p>
                      <p>{t.stepDenominators(activeDenA, activeDenB, resultDen)}</p>
                    </div>
                  ) : (
                    <div className="space-y-1 text-xs">
                      <p>{t.stepImagineWhole(activeNumA)}</p>
                      <p>{t.stepNumWhole(activeNumA, activeNumB, resultNum)}</p>
                      <p>{t.stepDenWhole(activeDenB, resultDen)}</p>
                    </div>
                  )}
                  {isSimplified && (
                    <p className="text-emerald-700 text-[11px] font-bold pt-1 border-t border-slate-100">
                      {t.simplifiedNotice(gcd, simplifiedNum, simplifiedDen)}
                    </p>
                  )}
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                {t.labTip}
              </div>
            </div>

            {/* RIGHT: VISUALIZATION & AREA GRID / PIZZAS */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΠΡΑΞΗΣ */}
              <div className="flex items-center justify-center p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
                <div className="flex items-center gap-2.5 sm:gap-4 font-mono font-black text-xl sm:text-2xl md:text-3xl select-none flex-wrap justify-center">
                  
                  {/* 1ος Όρος */}
                  {mode === 'fraction-fraction' ? (
                    <FractionDisplay num={activeNumA} den={activeDenA} size="lg" className="text-blue-600" />
                  ) : (
                    <span className="text-indigo-600 text-2xl sm:text-3xl md:text-4xl">{activeNumA}</span>
                  )}

                  <div className="text-slate-400 font-light">·</div>

                  {/* 2ος Όρος */}
                  <FractionDisplay num={activeNumB} den={activeDenB} size="lg" className="text-orange-600" />

                  <div className="text-slate-400 font-light">＝</div>

                  {/* Αναλυτικό Ενδιάμεσο Βήμα */}
                  <div className="flex flex-col items-center px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-100 rounded-xl border border-slate-200">
                    {mode === 'fraction-fraction' ? (
                      <FractionDisplay
                        num={`${activeNumA} · ${activeNumB}`}
                        den={`${activeDenA} · ${activeDenB}`}
                        size="md"
                        className="text-slate-700"
                      />
                    ) : (
                      <FractionDisplay
                        num={`${activeNumA} · ${activeNumB}`}
                        den={`${activeDenB}`}
                        size="md"
                        className="text-slate-700"
                      />
                    )}
                  </div>

                  <div className="text-slate-500 font-bold">＝</div>

                  {/* Αποτέλεσμα */}
                  <div className="bg-emerald-50 px-3 py-2 rounded-2xl border border-emerald-200 shadow-xs">
                    <FractionDisplay num={resultNum} den={resultDen} size="lg" className="text-emerald-700 font-bold" />
                  </div>

                  {/* Ανάγωγο Αποτέλεσμα */}
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

              {/* 2. ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ (ΠΛΕΓΜΑ Ή ΠΙΤΣΕΣ) */}
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                {mode === 'fraction-fraction' ? (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                      <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                        {t.visualGridTitle}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <FractionDisplay num={activeNumA} den={activeDenA} size="sm" />
                        <span>·</span>
                        <FractionDisplay num={activeNumB} den={activeDenB} size="sm" />
                      </span>
                    </div>
                    <div className="p-3 sm:p-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner">
                      {renderGridVisual()}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                      <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                        {t.visualPizzasTitle}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <span>{t.timesLabel(activeNumA)}</span>
                        <FractionDisplay num={activeNumB} den={activeDenB} size="sm" />
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-4 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-inner p-3 sm:p-4">
                      <div className="flex flex-wrap items-center justify-center gap-2.5">
                        {Array.from({ length: activeNumA }).map((_, i) => (
                          <div key={i} className="flex flex-col items-center p-2 bg-white rounded-2xl border border-slate-200 shadow-xs">
                            <span className="text-[9px] font-bold text-slate-400 mb-1">{t.timeRepetition(i + 1)}</span>
                            {renderPizzasVisual(activeNumB, activeDenB, 'fill-orange-400', 'stroke-orange-600')}
                          </div>
                        ))}
                      </div>

                      <div className="text-2xl text-slate-400 font-bold px-1">＝</div>

                      <div className="flex flex-col items-center p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <span>{t.totalProduct}:</span>
                          <FractionDisplay num={resultNum} den={resultDen} size="sm" />
                        </span>
                        {renderPizzasVisual(resultNum, resultDen, 'fill-emerald-500', 'stroke-emerald-700')}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-3.5 sm:p-4 rounded-2xl text-center font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 flex-wrap">
                <span>{t.summaryTitle}</span>
                {mode === 'fraction-fraction' ? (
                  <>
                    <FractionDisplay num={activeNumA} den={activeDenA} size="sm" className="text-white" />
                    <span className="text-base font-mono">·</span>
                    <FractionDisplay num={activeNumB} den={activeDenB} size="sm" className="text-white" />
                    <span className="text-base font-mono">＝</span>
                    <FractionDisplay
                      num={isSimplified ? simplifiedNum : resultNum}
                      den={isSimplified ? simplifiedDen : resultDen}
                      size="sm"
                      className="text-amber-300 font-bold"
                    />
                  </>
                ) : (
                  <>
                    <span className="text-base font-mono">{activeNumA}</span>
                    <span className="text-base font-mono">·</span>
                    <FractionDisplay num={activeNumB} den={activeDenB} size="sm" className="text-white" />
                    <span className="text-base font-mono">＝</span>
                    <FractionDisplay
                      num={isSimplified ? simplifiedNum : resultNum}
                      den={isSimplified ? simplifiedDen : resultDen}
                      size="sm"
                      className="text-amber-300 font-bold"
                    />
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
            href="/st-dimotikou/29-pollaplasiasmos-klasmaton-ask"
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
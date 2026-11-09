// pages/st-dimotikou/37-agnostos-dia-gnostos.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Όριο για τον μέγιστο διαιρετέο x
const MAX_TOTAL_X = 36;

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

const PRESETS = [
  { a: 3, b: 4, label: 'x : 3 ＝ 4 (x ＝ 12)' },
  { a: 4, b: 5, label: 'x : 4 ＝ 5 (x ＝ 20)' },
  { a: 2, b: 7, label: 'x : 2 ＝ 7 (x ＝ 14)' },
  { a: 5, b: 3, label: 'x : 5 ＝ 3 (x ＝ 15)' },
  { a: 6, b: 4, label: 'x : 6 ＝ 4 (x ＝ 24)' },
  { a: 3, b: 2, label: 'x : 3 ＝ 2 (x ＝ 6)' }
];

// Χρώματα ανά κομμάτι/διαμέρισμα
const PORTION_COLORS = [
  { fill: 'url(#ballGold)', stroke: '#b45309', tag: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)' },
  { fill: 'url(#ballGreen)', stroke: '#047857', tag: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' },
  { fill: 'url(#ballBlue)', stroke: '#1d4ed8', tag: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)' },
  { fill: 'url(#ballPurple)', stroke: '#6b21a8', tag: '#a855f7', bg: 'rgba(168, 85, 247, 0.2)' },
  { fill: 'url(#ballPink)', stroke: '#be185d', tag: '#ec4899', bg: 'rgba(236, 72, 153, 0.2)' },
  { fill: 'url(#ballCyan)', stroke: '#0e7490', tag: '#06b6d4', bg: 'rgba(6, 182, 212, 0.2)' }
];

const TRANSLATIONS = {
  el: {
    pageTitle: "Εξισώσεις: Άγνωστος Διαιρετέος - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστική θεωρία με 3D ζυγαριά, χωρισμό του κουτιού x σε κομμάτια και ανασύνθεση με πολλαπλασιασμό (x : α = β) για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 37 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "37. Εξισώσεις: Ο Άγνωστος είναι Διαιρετέος (x : α ＝ β)",
    heroDesc: "Μάθε πώς βρίσκουμε τον άγνωστο διαιρετέο (x): κόβουμε το κουτί x σε α ίσα κομμάτια. Αν το κάθε κομμάτι περιέχει β μπάλες, για να βρούμε πόσες έχει όλο το κουτί, κάνουμε πολλαπλασιασμό: x ＝ α · β!",
    heroFeature: "Διαδραστική Ζυγαριά σε Ισορροπία & Οπτική Ανασύνθεση Κουτιού",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες: Ο Διαιρετέος & Επίλυση Εξισώσεων Διαίρεσης",
    theorySubtitle: "Πώς εντοπίζουμε το αρχικό ολικό μέγεθος x όταν γνωρίζουμε το μερίδιο και το πλήθος των μερών.",
    card1Badge: "Ο ΔΙΑΙΡΕΤΕΟΣ",
    card1Sub: "x : α ＝ β",
    card1Title: "1. Ποιος είναι ο Διαιρετέος;",
    card1Text: "Στη διαίρεση x : α ＝ β, το x είναι ο διαιρετέος (το ολόκληρο αρχικό μέγεθος που χωρίζεται σε α ίσα κομμάτια).",
    card1Example: "x : 3 ＝ 2 (1 κομμάτι έχει 2)",
    card1Tip: "💡 Ο διαιρετέος x είναι το αρχικό όλον και υπολογίζεται συνενώνοντας όλα τα ίσα μέρη!",
    card2Badge: "ΜΕΘΟΔΟΣ",
    card2Sub: "x ＝ α · β",
    card2Title: "2. Ο Κανόνας Επίλυσης",
    card2Text: "Για να βρούμε το περιεχόμενο όλου του κουτιού x, πολλαπλασιάζουμε το πλήθος των κομματιών (α) με το περιεχόμενο του ενός (β):",
    card2Example: (
      <span>
        x ＝ 3 · 2 ＝ <strong className="text-indigo-700">6</strong>
      </span>
    ),
    card2Tip: "⚡ Χρυσός Κανόνας: Όταν ο άγνωστος είναι πρώτος στη διαίρεση (διαιρετέος), λύνουμε πάντα με πολλαπλασιασμό!",
    card3Badge: "ΕΛΕΓΧΟΣ",
    card3Sub: "Αντικατάσταση",
    card3Title: "3. Επαλήθευση",
    card3Text: "Αν μοιράσουμε τις 6 μπάλες στα 3 ίσα κομμάτια του κουτιού, κάθε κομμάτι παίρνει ακριβώς 2 μπάλες: 6 : 3 ＝ 2!",
    card3Example: "6 : 3 ＝ 2 (Σωστό! ✔️)",
    card3Tip: "🎯 Αν διαιρέσουμε το αποτέλεσμα με τον διαιρέτη και βγει το πηλίκο, η λύση είναι απόλυτα σωστή!",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: (a) => `Το Κουτί x Χωρισμένο σε ${a} Κομμάτια`,
    labSubtitle: "Ρύθμισε τον διαιρέτη α και τις μπάλες ανά κομμάτι β και δες πώς οι μπάλες γεμίζουν όλα τα κομμάτια του x!",
    step1Btn: (b) => `1️⃣ 1 Κομμάτι ＝ ${b}`,
    step2Btn: (a) => `2️⃣ Πολλαπλασιασμός επί ${a}`,
    step3Btn: (res) => `3️⃣ Όλα τα Κομμάτια (x ＝ ${res})`,
    equationSettings: "⚙️ ΡΥΘΜΙΣΗ ΕΞΙΣΩΣΗΣ: x : α ＝ β",
    divisorLabel: "ΚΟΜΜΑΤΙΑ ΤΟΥ x (α)",
    quotientLabel: "ΜΠΑΛΕΣ ΑΝΑ ΚΟΜΜΑΤΙ (β)",
    equationBadge: (a, b) => `Εξίσωση: x : ${a} ＝ ${b}`,
    presetsTitle: "ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:",
    tryCta: "Δοκιμή ➔",
    stepExplainTitle: (s) => `📖 ΤΙ ΣΥΜΒΑΙΝΕΙ ΣΤΟ ΒΗΜΑ ${s}:`,
    step1Desc: (a, b) => `Το κουτί x είναι χωρισμένο σε ${a} ίσα κομμάτια. Το 1ο κομμάτι μόνο ισούται με ${b} μπάλες: x : ${a} ＝ ${b}.`,
    step2Desc: (a, b) => `Πολλαπλασιάζουμε επί ${a}! Παίρνουμε ${a} ίσες ομάδες των ${b} μπαλών, μία ομάδα για κάθε κομμάτι του x.`,
    step3Desc: (a, b, res) => `Οι μπάλες μπαίνουν μέσα σε κάθε κομμάτι του κουτιού x (${b} μπάλες σε καθένα από τα ${a} κομμάτια). Όλο το κουτί x περιέχει: x ＝ ${a} · ${b} ＝ ${res} μπάλες!`,
    labTip: "💡 Κανόνας: Για να βρούμε τον άγνωστο διαιρετέο x, κάνουμε πάντα πολλαπλασιασμό: x ＝ α · β!",
    scaleTitle: (a, rightLabel) => `⚖️ ΟΠΤΙΚΗ ΖΥΓΑΡΙΑ: ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ (ΚΟΥΤΙ x ΣΕ ${a} ΚΟΜΜΑΤΙΑ) VS ΔΕΞΙΟΣ ΔΙΣΚΟΣ (${rightLabel})`,
    perfectBalance: "✔ Τέλεια Ισορροπία",
    boxHeaderStep3: (res) => `ΟΛΟΚΛΗΡΟ x (x ＝ ${res})`,
    boxHeaderInit: (a) => `ΚΟΥΤΙ x ΣΕ ${a} ΚΟΜΜΑΤΙΑ`,
    leftPanStep3: (res, a, b) => `x ＝ ${res} μπάλες (${a} · ${b})`,
    leftPanInit: (a) => `1 από τα ${a} κομμάτια (x : ${a})`,
    rightPanStep1: (b) => `1 Κομμάτι: ${b} μπάλες`,
    rightPanStep2: (a, b) => `${a} Ομάδες των ${b} μπαλών`,
    rightPanStep3: (res) => `Σύνολο: ${res} μπάλες`,
    stepTitle1: (a, b) => `Βήμα 1: 1 από τα ${a} κομμάτια ＝ ${b}`,
    stepTitle2: (a, b) => `Βήμα 2: ${a} ομάδες των ${b} μπαλών`,
    stepTitle3: (a, b, res) => `Βήμα 3: x ＝ ${a} · ${b} ＝ ${res}`,
    btnPrev: "⬅️ Προηγούμενο",
    btnNext: "Επόμενο ➡️",
    stepOf: (cur, total) => `Βήμα ${cur} από ${total}`,
    summaryTitle: (a, b, res) => `💡 ΣΥΜΠΕΡΑΣΜΑ: Στην εξίσωση x : ${a} ＝ ${b}, ο άγνωστος διαιρετέος ισούται με x ＝ ${a} · ${b} ＝ ${res} (όλες οι μπάλες και στα ${a} κομμάτια)!`,
    ctaTitle: "Ώρα για Εξάσκηση!",
    ctaDesc: "Έμαθες πώς λύνουμε μια εξίσωση με άγνωστο διαιρετέο; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Equations: Unknown Dividend - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive lesson with visual scale, dividing box x into sections, and reconstructing with multiplication (x : a = b) for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 37 • 6TH GRADE",
    heroTitle: "37. Equations: The Unknown is a Dividend (x : a ＝ b)",
    heroDesc: "Discover how to find the unknown dividend (x): partition box x into a equal parts. If each part holds b balls, to find how many balls are in the entire box, we multiply: x ＝ a · b!",
    heroFeature: "Interactive Balanced Scale & Visual Box Reconstruction",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts: The Dividend & Solving Division Equations",
    theorySubtitle: "How to identify the initial total size x when knowing the portion and number of parts.",
    card1Badge: "THE DIVIDEND",
    card1Sub: "x : a ＝ b",
    card1Title: "1. What is the Dividend?",
    card1Text: "In division x : a ＝ b, x is the dividend (the entire initial quantity partitioned into a equal parts).",
    card1Example: "x : 3 ＝ 2 (1 part has 2)",
    card1Tip: "💡 The dividend x is the original whole and is found by uniting all equal parts!",
    card2Badge: "METHOD",
    card2Sub: "x ＝ a · b",
    card2Title: "2. The Solution Rule",
    card2Text: "To find the content of the entire box x, multiply the number of parts (a) by the content of one part (b):",
    card2Example: (
      <span>
        x ＝ 3 · 2 ＝ <strong className="text-indigo-700">6</strong>
      </span>
    ),
    card2Tip: "⚡ Golden Rule: When the unknown is the first term in division (dividend), always solve by multiplication!",
    card3Badge: "CHECK",
    card3Sub: "Substitution",
    card3Title: "3. Verification",
    card3Text: "If we distribute the 6 balls across the 3 equal box parts, each part gets exactly 2 balls: 6 : 3 ＝ 2!",
    card3Example: "6 : 3 ＝ 2 (Correct! ✔️)",
    card3Tip: "🎯 If dividing the result by the divisor produces the quotient, our solution is confirmed!",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: (a) => `Box x Partitioned into ${a} Pieces`,
    labSubtitle: "Adjust divisor a and balls per part b to watch balls fill all sections of box x!",
    step1Btn: (b) => `1️⃣ 1 Piece ＝ ${b}`,
    step2Btn: (a) => `2️⃣ Multiply by ${a}`,
    step3Btn: (res) => `3️⃣ All Pieces (x ＝ ${res})`,
    equationSettings: "⚙️ EQUATION SETUP: x : a ＝ b",
    divisorLabel: "SECTIONS OF x (a)",
    quotientLabel: "BALLS PER SECTION (b)",
    equationBadge: (a, b) => `Equation: x : ${a} ＝ ${b}`,
    presetsTitle: "PRESET EXAMPLES:",
    tryCta: "Try ➔",
    stepExplainTitle: (s) => `📖 WHAT HAPPENS IN STEP ${s}:`,
    step1Desc: (a, b) => `Box x is divided into ${a} equal parts. Just 1 part equals ${b} balls: x : ${a} ＝ ${b}.`,
    step2Desc: (a, b) => `We multiply by ${a}! We get ${a} equal groups of ${b} balls, one group for each section of box x.`,
    step3Desc: (a, b, res) => `The balls enter each section of box x (${b} balls in each of the ${a} sections). The full box holds: x ＝ ${a} · ${b} ＝ ${res} balls!`,
    labTip: "💡 Rule: To find the unknown dividend x, always multiply: x ＝ a · b!",
    scaleTitle: (a, rightLabel) => `⚖️ VISUAL SCALE: LEFT PAN (BOX x IN ${a} SECTIONS) VS RIGHT PAN (${rightLabel})`,
    perfectBalance: "✔ Perfect Balance",
    boxHeaderStep3: (res) => `FULL x (x ＝ ${res})`,
    boxHeaderInit: (a) => `BOX x IN ${a} SECTIONS`,
    leftPanStep3: (res, a, b) => `x ＝ ${res} balls (${a} · ${b})`,
    leftPanInit: (a) => `1 of ${a} sections (x : ${a})`,
    rightPanStep1: (b) => `1 Section: ${b} balls`,
    rightPanStep2: (a, b) => `${a} Groups of ${b} balls`,
    rightPanStep3: (res) => `Total: ${res} balls`,
    stepTitle1: (a, b) => `Step 1: 1 of ${a} sections ＝ ${b}`,
    stepTitle2: (a, b) => `Step 2: ${a} groups of ${b} balls`,
    stepTitle3: (a, b, res) => `Step 3: x ＝ ${a} · ${b} ＝ ${res}`,
    btnPrev: "⬅️ Previous",
    btnNext: "Next ➡️",
    stepOf: (cur, total) => `Step ${cur} of ${total}`,
    summaryTitle: (a, b, res) => `💡 SUMMARY: In equation x : ${a} ＝ ${b}, the unknown dividend equals x ＝ ${a} · ${b} ＝ ${res} (all balls across all ${a} sections)!`,
    ctaTitle: "Time to Practice Unknown Dividend!",
    ctaDesc: "Mastered solving equations with an unknown dividend? Test your skills with 10 interactive questions to consolidate your knowledge!",
    ctaBtn: "Start Exercises"
  }
};

export default function AgnostosDiaGnostosPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Παράμετροι της εξίσωσης: x : a = b (x = a * b)
  const [paramA, setParamA] = useState(3);
  const [paramB, setParamB] = useState(2);

  // Βήμα διαδραστικής επίλυσης: 1 (1 κομμάτι = β), 2 (Πολλαπλασιασμός επί α), 3 (Μπάλες σε κάθε κομμάτι του x)
  const [currentStep, setCurrentStep] = useState(1);

  const activeA = Math.max(2, Math.min(6, Number(paramA) || 2));
  
  function getMaxBForA(a) {
    return Math.min(7, Math.floor(MAX_TOTAL_X / a));
  }

  const rawB = Math.max(1, Number(paramB) || 1);
  const activeB = Math.min(getMaxBForA(activeA), rawB);

  // Σωστή μαθηματική λύση: x = a * b (Διαιρετέος / Αρχικό Σύνολο)
  const exactSolution = activeA * activeB;

  const setEquation = (a, b) => {
    setParamA(a);
    setParamB(b);
    setCurrentStep(1);
  };

  const adjustA = (amount) => {
    setCurrentStep(1);
    const nextA = Math.max(2, Math.min(6, activeA + amount));
    const nextB = Math.min(getMaxBForA(nextA), activeB);
    setParamA(nextA);
    setParamB(nextB);
  };

  const adjustB = (amount) => {
    setCurrentStep(1);
    const maxB = getMaxBForA(activeA);
    const nextB = Math.max(1, Math.min(maxB, activeB + amount));
    setParamB(nextB);
  };

  const BALL_RADIUS = 7.5;
  const BALL_SPACING_Y = 16;
  const BASE_Y = 248;

  const TOTAL_BOX_WIDTH = activeA * 32 + 12;
  const TOTAL_BOX_HEIGHT = Math.max(68, activeB * BALL_SPACING_Y + 18);
  const boxStartX = 150 - TOTAL_BOX_WIDTH / 2;
  const boxStartY = BASE_Y - TOTAL_BOX_HEIGHT - 2;

  const currentRightPortions = currentStep === 1 ? 1 : activeA;
  const MAX_STACK_HEIGHT = 7;
  const rightBalls = [];
  const groupSpacing = activeA <= 3 ? 42 : activeA <= 4 ? 32 : 24;
  const startGroupCenterX = 610 - ((currentRightPortions - 1) * groupSpacing) / 2;

  for (let g = 0; g < currentRightPortions; g++) {
    const centerGX = startGroupCenterX + g * groupSpacing;
    const subCols = activeB > MAX_STACK_HEIGHT ? 2 : 1;
    const subColSpacing = 15;
    const startSubColX = centerGX - ((subCols - 1) * subColSpacing) / 2;

    for (let r = 0; r < activeB; r++) {
      const colIdx = Math.floor(r / MAX_STACK_HEIGHT);
      const rowIdx = r % MAX_STACK_HEIGHT;

      rightBalls.push({
        id: `rball-${g}-${r}`,
        group: g,
        x: startSubColX + colIdx * subColSpacing,
        y: BASE_Y - BALL_RADIUS - 2 - rowIdx * BALL_SPACING_Y,
        isAddedInStep2: g > 0
      });
    }
  }

  const insidePortionBalls = [];
  for (let g = 0; g < activeA; g++) {
    const pCenterX = boxStartX + 6 + g * 32 + 14;
    for (let r = 0; r < activeB; r++) {
      insidePortionBalls.push({
        id: `inside-p-${g}-${r}`,
        group: g,
        x: pCenterX,
        y: boxStartY + TOTAL_BOX_HEIGHT - 6 - BALL_RADIUS - r * BALL_SPACING_Y
      });
    }
  }

  const rightLabelScale = currentStep === 1 ? String(activeB) : `${activeA} · ${activeB} ＝ ${exactSolution}`;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/37-agnostos-dia-gnostos-ask"
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
              href="/st-dimotikou/37-agnostos-dia-gnostos-ask"
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>{t.card1Example}</p>
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>{t.card2Example}</p>
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>{t.card3Example}</p>
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{t.labBadge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.labTitle(activeA)}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-1">
                {t.labSubtitle}
              </p>
            </div>

            {/* STEP CONTROLS BUTTONS */}
            <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(1); }}
                className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all touch-manipulation active:scale-95 ${
                  currentStep === 1
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.step1Btn(activeB)}
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(2); }}
                className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all touch-manipulation active:scale-95 ${
                  currentStep === 2
                    ? 'bg-amber-500 text-white shadow-md scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.step2Btn(activeA)}
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(3); }}
                className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all touch-manipulation active:scale-95 ${
                  currentStep === 3
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.step3Btn(exactSolution)}
              </button>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* ΡΥΘΜΙΣΗ ΕΞΙΣΩΣΗΣ */}
                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                  <span className="text-xs font-black text-slate-800 tracking-wider block uppercase">
                    {t.equationSettings}
                  </span>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-center">
                    {/* ΔΙΑΙΡΕΤΗΣ (a) */}
                    <div className="flex flex-col justify-between space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 h-8 flex items-center justify-center text-center leading-tight uppercase">
                        {t.divisorLabel}
                      </span>
                      <div className="grid grid-cols-[36px_1fr_36px] items-center bg-slate-50 p-1 rounded-xl border border-slate-200 h-11">
                        <button 
                          type="button" 
                          disabled={activeA <= 2}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustA(-1); }} 
                          className="w-9 h-9 font-black text-blue-600 hover:bg-slate-200 disabled:opacity-25 rounded-lg active:scale-95 transition flex items-center justify-center text-lg shrink-0 touch-manipulation"
                        >
                          －
                        </button>
                        <span className="w-full text-center font-mono font-black text-base text-blue-600">{activeA}</span>
                        <button 
                          type="button" 
                          disabled={activeA >= 6}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustA(1); }} 
                          className="w-9 h-9 font-black text-blue-600 hover:bg-slate-200 disabled:opacity-25 rounded-lg active:scale-95 transition flex items-center justify-center text-lg shrink-0 touch-manipulation"
                        >
                          ＋
                        </button>
                      </div>
                    </div>

                    {/* ΠΗΛΙΚΟ (b) */}
                    <div className="flex flex-col justify-between space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 h-8 flex items-center justify-center text-center leading-tight uppercase">
                        {t.quotientLabel}
                      </span>
                      <div className="grid grid-cols-[36px_1fr_36px] items-center bg-slate-50 p-1 rounded-xl border border-slate-200 h-11">
                        <button 
                          type="button" 
                          disabled={activeB <= 1}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustB(-1); }} 
                          className="w-9 h-9 font-black text-emerald-600 hover:bg-slate-200 disabled:opacity-25 rounded-lg active:scale-95 transition flex items-center justify-center text-lg shrink-0 touch-manipulation"
                        >
                          －
                        </button>
                        <span className="w-full text-center font-mono font-black text-base text-emerald-600">{activeB}</span>
                        <button 
                          type="button" 
                          disabled={activeB >= getMaxBForA(activeA)}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustB(1); }} 
                          className="w-9 h-9 font-black text-emerald-600 hover:bg-slate-200 disabled:opacity-25 rounded-lg active:scale-95 transition flex items-center justify-center text-lg shrink-0 touch-manipulation"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-center font-mono text-xs font-bold text-indigo-800 bg-indigo-50 p-2 rounded-xl border border-indigo-200">
                    {t.equationBadge(activeA, activeB)}
                  </div>
                </div>

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    {t.presetsTitle}
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEquation(p.a, p.b); }}
                        className={`py-2 px-3 rounded-xl border font-mono font-black text-xs transition-all text-left flex justify-between items-center touch-manipulation active:scale-95 ${
                          activeA === p.a && activeB === p.b
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                        }`}
                      >
                        <span>{p.label}</span>
                        <span className="text-[10px] opacity-75">{t.tryCta}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ΕΠΕΞΗΓΗΣΗ ΑΝΑΛΟΓΑ ΜΕ ΤΟ ΕΝΕΡΓΟ ΒΗΜΑ */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs space-y-2">
                  <span className="font-black text-slate-900 uppercase block text-[11px]">
                    {t.stepExplainTitle(currentStep)}
                  </span>
                  {currentStep === 1 && (
                    <p>{t.step1Desc(activeA, activeB)}</p>
                  )}
                  {currentStep === 2 && (
                    <p className="text-amber-800">{t.step2Desc(activeA, activeB)}</p>
                  )}
                  {currentStep === 3 && (
                    <p className="text-emerald-800 font-bold">{t.step3Desc(activeA, activeB, exactSolution)}</p>
                  )}
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                {t.labTip}
              </div>
            </div>

            {/* RIGHT: BIG 3D SCALE & SECTIONED BOX VISUALIZER */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[580px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΕΞΙΣΩΣΗΣ & ΒΗΜΑΤΟΣ */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-around text-center flex-wrap gap-4">
                <div className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-slate-800">
                  <span className="text-amber-600 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">x</span>
                  <span className="text-slate-400 mx-2">:</span>
                  <span className="text-blue-600">{activeA}</span>
                  <span className="text-slate-400 mx-2">＝</span>
                  <span className="text-emerald-600">{activeB}</span>
                </div>

                <div className="font-mono text-xs sm:text-sm md:text-base font-black text-indigo-700 bg-white px-3.5 py-2 rounded-2xl border border-indigo-200 shadow-xs">
                  {currentStep === 1 && t.stepTitle1(activeA, activeB)}
                  {currentStep === 2 && t.stepTitle2(activeA, activeB)}
                  {currentStep === 3 && t.stepTitle3(activeA, activeB, exactSolution)}
                </div>
              </div>

              {/* 2. ΜΕΓΑΛΗ ΟΠΤΙΚΗ ΖΥΓΑΡΙΑ ΣΤΟ SVG */}
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                    {t.scaleTitle(activeA, rightLabelScale)}
                  </span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {t.perfectBalance}
                  </span>
                </div>

                {/* SVG CONTAINER */}
                <div className="p-2 sm:p-4 bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-3xl border border-slate-200 shadow-inner flex flex-col items-center justify-center min-h-[360px] overflow-hidden">
                  <svg width="100%" height="340" viewBox="0 0 760 360" className="overflow-visible select-none max-w-full">
                    <defs>
                      <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.25" />
                      </filter>
                      <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.6" />
                      </filter>

                      <linearGradient id="metalBeam" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="40%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                      <linearGradient id="metalPillar" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="50%" stopColor="#64748b" />
                        <stop offset="100%" stopColor="#1e293b" />
                      </linearGradient>

                      <linearGradient id="leftDishGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                      <linearGradient id="rightDishGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#047857" />
                      </linearGradient>

                      <radialGradient id="ballGold" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="40%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#b45309" />
                      </radialGradient>
                      <radialGradient id="ballGreen" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#6ee7b7" />
                        <stop offset="40%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#047857" />
                      </radialGradient>
                      <radialGradient id="ballBlue" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#93c5fd" />
                        <stop offset="40%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </radialGradient>
                      <radialGradient id="ballPurple" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#e9d5ff" />
                        <stop offset="40%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#6b21a8" />
                      </radialGradient>
                      <radialGradient id="ballPink" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#fbcfe8" />
                        <stop offset="40%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#be185d" />
                      </radialGradient>
                      <radialGradient id="ballCyan" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#a5f3fc" />
                        <stop offset="40%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#0e7490" />
                      </radialGradient>
                    </defs>

                    {/* 1. ΒΑΣΗ & ΚΟΛΟΝΑ ΖΥΓΑΡΙΑΣ */}
                    <polygon points="380,270 315,345 445,345" fill="url(#metalBeam)" filter="url(#shadow3d)" />
                    <rect x="373" y="65" width="14" height="215" fill="url(#metalPillar)" rx="3" />
                    <circle cx="380" cy="65" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="2" filter="url(#shadow3d)" />

                    {/* 2. ΟΡΙΖΟΝΤΙΟΣ ΖΥΓΟΣ (BEAM) */}
                    <rect x="90" y="58" width="580" height="14" rx="7" fill="url(#metalBeam)" filter="url(#shadow3d)" />
                    <circle cx="150" cy="65" r="5" fill="#e2e8f0" />
                    <circle cx="610" cy="65" r="5" fill="#e2e8f0" />

                    {/* 3. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ & ΑΛΥΣΙΔΕΣ */}
                    <line x1="150" y1="65" x2="50" y2="250" stroke="#475569" strokeWidth="2.5" strokeDasharray="5 2" />
                    <line x1="150" y1="65" x2="250" y2="250" stroke="#475569" strokeWidth="2.5" strokeDasharray="5 2" />
                    <path d="M 30 250 Q 150 292 270 250 Z" fill="url(#leftDishGrad)" filter="url(#shadow3d)" />
                    <rect x="30" y="248" width="240" height="6" fill="#1e40af" rx="3" />

                    {/* 4. ΔΕΞΙΟΣ ΔΙΣΚΟΣ & ΑΛΥΣΙΔΕΣ */}
                    <line x1="610" y1="65" x2="510" y2="250" stroke="#475569" strokeWidth="2.5" strokeDasharray="5 2" />
                    <line x1="610" y1="65" x2="710" y2="250" stroke="#475569" strokeWidth="2.5" strokeDasharray="5 2" />
                    <path d="M 490 250 Q 610 292 730 250 Z" fill="url(#rightDishGrad)" filter="url(#shadow3d)" />
                    <rect x="490" y="248" width="240" height="6" fill="#065f46" rx="3" />

                    {/* 5. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ: ΤΟ ΚΟΥΤΙ x ΧΩΡΙΣΜΕΝΟ ΣΕ a ΚΟΜΜΑΤΙΑ */}
                    <g filter="url(#shadow3d)">
                      {/* ΕΠΙΚΕΦΑΛΙΔΑ ΕΞΩ ΑΠΟ ΤΟ ΚΟΥΤΙ */}
                      <rect 
                        x={150 - Math.max(85, TOTAL_BOX_WIDTH / 2)} 
                        y={boxStartY - 24} 
                        width={Math.max(170, TOTAL_BOX_WIDTH)} 
                        height="20" 
                        rx="8" 
                        fill={currentStep === 3 ? '#10b981' : '#f59e0b'} 
                      />
                      <text x="150" y={boxStartY - 10} fill="#ffffff" fontSize="10.5" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                        {currentStep === 3 ? t.boxHeaderStep3(exactSolution) : t.boxHeaderInit(activeA)}
                      </text>

                      {/* Εξωτερικό περίβλημα όλου του κουτιού x */}
                      <rect 
                        x={boxStartX} 
                        y={boxStartY} 
                        width={TOTAL_BOX_WIDTH} 
                        height={TOTAL_BOX_HEIGHT} 
                        rx="12" 
                        fill="#f8fafc" 
                        stroke={currentStep === 3 ? '#059669' : '#64748b'} 
                        strokeWidth="2.5" 
                      />

                      {/* Τα a διαμερίσματα/κομμάτια */}
                      {Array.from({ length: activeA }).map((_, i) => {
                        const pX = boxStartX + 6 + i * 32;
                        const pY = boxStartY + 5;
                        const isHighlightedPortion = currentStep < 3 ? i === 0 : true;

                        return (
                          <g key={`portion-box-${i}`}>
                            <rect
                              x={pX}
                              y={pY}
                              width="28"
                              height={TOTAL_BOX_HEIGHT - 10}
                              rx="7"
                              fill={isHighlightedPortion ? PORTION_COLORS[i % PORTION_COLORS.length].bg : '#f1f5f9'}
                              stroke={isHighlightedPortion ? PORTION_COLORS[i % PORTION_COLORS.length].tag : '#cbd5e1'}
                              strokeWidth={isHighlightedPortion ? '2' : '1'}
                              strokeDasharray={currentStep < 3 && i > 0 ? '3 2' : 'none'}
                            />
                            {currentStep < 3 && (
                              <text x={pX + 14} y={boxStartY + TOTAL_BOX_HEIGHT / 2 + 4} fill={i === 0 ? '#b45309' : '#94a3b8'} fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                                {i === 0 ? `x/${activeA}` : '?'}
                              </text>
                            )}
                          </g>
                        );
                      })}

                      {/* Βήμα 3: Οι μπάλες ΜΕΣΑ σε κάθε κομμάτι του x */}
                      {currentStep === 3 && insidePortionBalls.map((pos) => {
                        const colTheme = PORTION_COLORS[pos.group % PORTION_COLORS.length];
                        return (
                          <g key={pos.id} filter="url(#glowGold)">
                            <circle cx={pos.x} cy={pos.y} r={BALL_RADIUS} fill={colTheme.fill} stroke={colTheme.stroke} strokeWidth="1" />
                            <ellipse cx={pos.x - 2} cy={pos.y - 2} rx="2" ry="1.4" fill="#ffffff" opacity="0.6" />
                            <text x={pos.x} y={pos.y + 2.5} fill="#ffffff" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="monospace">1</text>
                          </g>
                        );
                      })}
                    </g>

                    {/* 6. ΔΕΞΙΟΣ ΔΙΣΚΟΣ: ΟΙ ΜΠΑΛΕΣ */}
                    {rightBalls.map((ball) => {
                      const colTheme = currentStep === 1 
                        ? { fill: 'url(#ballGreen)', stroke: '#047857' } 
                        : PORTION_COLORS[ball.group % PORTION_COLORS.length];

                      return (
                        <g key={ball.id} className="transition-all duration-500" filter="url(#shadow3d)">
                          <circle
                            cx={ball.x}
                            cy={ball.y}
                            r={BALL_RADIUS}
                            fill={colTheme.fill}
                            stroke={colTheme.stroke}
                            strokeWidth="1.5"
                            className={ball.isAddedInStep2 && currentStep === 2 ? 'animate-pulse' : ''}
                          />
                          <ellipse cx={ball.x - 2.5} cy={ball.y - 2.5} rx="2.5" ry="1.8" fill="#ffffff" opacity="0.65" />
                          <text x={ball.x} y={ball.y + 3} fill="#ffffff" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                            1
                          </text>
                        </g>
                      );
                    })}

                    {/* Ετικέτες κάτω από τους δίσκους */}
                    <text x="150" y="325" fill="#1e3a8a" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                      {currentStep === 3 ? t.leftPanStep3(exactSolution, activeA, activeB) : t.leftPanInit(activeA)}
                    </text>

                    <text x="610" y="325" fill="#064e3b" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                      {currentStep === 1 && t.rightPanStep1(activeB)}
                      {currentStep === 2 && t.rightPanStep2(activeA, activeB)}
                      {currentStep === 3 && t.rightPanStep3(exactSolution)}
                    </text>
                  </svg>
                </div>

                {/* ACTION BAR ΓΙΑ ΜΕΤΑΒΑΣΗ ΣΤΑ ΒΗΜΑΤΑ */}
                <div className="flex justify-between items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={currentStep === 1}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(prev => prev - 1); }}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-black rounded-xl border border-slate-200 transition touch-manipulation active:scale-95"
                  >
                    {t.btnPrev}
                  </button>

                  <div className="text-xs font-black text-indigo-900 bg-indigo-50 px-3 sm:px-5 py-2 rounded-xl border border-indigo-200 shadow-xs">
                    {t.stepOf(currentStep, 3)}
                  </div>

                  <button
                    type="button"
                    disabled={currentStep === 3}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentStep(prev => prev + 1); }}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-black rounded-xl shadow-md transition transform active:scale-95 touch-manipulation"
                  >
                    {t.btnNext}
                  </button>
                </div>
              </div>

              {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-3.5 sm:p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                {t.summaryTitle(activeA, activeB, exactSolution)}
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
            href="/st-dimotikou/37-agnostos-dia-gnostos-ask"
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
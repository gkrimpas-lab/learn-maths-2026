// pages/st-dimotikou/34-agnostos-kai-afairesi.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Όριο τιμών για το διαδραστικό οπτικό εργαστήριο
const MAX_TOTAL_BALLS = 16;

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
  { a: 3, b: 5, label: 'x － 3 ＝ 5 (x ＝ 8)' },
  { a: 4, b: 6, label: 'x － 4 ＝ 6 (x ＝ 10)' },
  { a: 5, b: 7, label: 'x － 5 ＝ 7 (x ＝ 12)' },
  { a: 2, b: 8, label: 'x － 2 ＝ 8 (x ＝ 10)' },
  { a: 6, b: 8, label: 'x － 6 ＝ 8 (x ＝ 14)' }
];

const TRANSLATIONS = {
  el: {
    pageTitle: "Εξισώσεις: Άγνωστος Μειωτέος - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστική θεωρία με όμορφη ζυγαριά, μεγάλο κουτί x με εσωτερικά ελλείμματα και βήματα πρόσθεσης για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 34 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "34. Εξισώσεις: Ο Άγνωστος είναι Μειωτέος (x － α ＝ β)",
    heroDesc: "Μάθε πώς βρίσκουμε τον άγνωστο μειωτέο (x): όπως συμπληρώνουμε τις α μπάλες που λείπουν μέσα από το κουτί x και προσθέτουμε τις ίδιες α μπάλες και στον δεξιό δίσκο για ισορροπία, έτσι κάνουμε πρόσθεση: x ＝ β ＋ α!",
    heroFeature: "Διαδραστική Ζυγαριά σε Ισορροπία & Οπτική Προσθήκη Βαρών",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες: Ο Μειωτέος & Επίλυση Εξισώσεων Αφαίρεσης",
    theorySubtitle: "Πώς διατηρείται η ισορροπία όταν συμπληρώνουμε το έλλειμμα στον άγνωστο μειωτέο x.",
    card1Badge: "Ο ΜΕΙΩΤΕΟΣ",
    card1Sub: "Αρχικό Ποσό",
    card1Title: "1. Ποιος είναι ο Μειωτέος;",
    card1Text: "Στην αφαίρεση x － α ＝ β, το x είναι ο μειωτέος (η αρχική μεγάλη ποσότητα από την οποία αφαιρούμε).",
    card1Example: "x － 3 ＝ 5 (x ＝ Αρχικό Ποσό)",
    card1Tip: "💡 Ο μειωτέος είναι πάντοτε μεγαλύτερος από (ή ίσος με) τη διαφορά και τον αφαιρετέο!",
    card2Badge: "ΜΕΘΟΔΟΣ",
    card2Sub: "x ＝ β ＋ α",
    card2Title: "2. Ο Κανόνας Επίλυσης",
    card2Text: "Για να βρούμε τον άγνωστο μειωτέο, προσθέτουμε τη διαφορά και τον αφαιρετέο (αντίστροφη πράξη):",
    card2Example: (
      <span>
        x ＝ 5 ＋ 3 ＝ <strong className="text-indigo-700">8</strong>
      </span>
    ),
    card2Tip: "⚡ Χρυσός Κανόνας: Όταν ο άγνωστος είναι πρώτος στην αφαίρεση (μειωτέος), λύνουμε πάντα με πρόσθεση!",
    card3Badge: "ΕΛΕΓΧΟΣ",
    card3Sub: "Αντικατάσταση",
    card3Title: "3. Επαλήθευση",
    card3Text: "Αντικαθιστούμε το x με τον αριθμό που βρήκαμε και ελέγχουμε αν η αφαίρεση είναι σωστή:",
    card3Example: "8 － 3 ＝ 5 (Σωστό! ✔️)",
    card3Tip: "🎯 Αν μετά την αφαίρεση προκύψει το επιθυμητό αποτέλεσμα, η λύση είναι απόλυτα σωστή!",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Συμπλήρωση του Κουτιού x & Επίλυση με Πρόσθεση",
    labSubtitle: "Δες τις κενές θέσεις μέσα στο κουτί x και ακολούθησε τα βήματα για να προστεθούν οι μπάλες και στα δύο μέλη!",
    step1Btn: (a) => `1️⃣ Λείπουν ${a} Μπάλες`,
    step2Btn: (a) => `2️⃣ Προσθήκη ＋${a}`,
    step3Btn: (res) => `3️⃣ Πλήρες x ＝ ${res}`,
    equationSettings: "⚙️ ΡΥΘΜΙΣΗ ΕΞΙΣΩΣΗΣ: x － α ＝ β",
    missingBallsLabel: "ΜΠΑΛΕΣ ΠΟΥ ΛΕΙΠΟΥΝ (α)",
    rightBallsLabel: "ΜΠΑΛΕΣ ΔΕΞΙΑ (β)",
    presetsTitle: "ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:",
    tryCta: "Δοκιμή ➔",
    stepExplainTitle: (s) => `📖 ΤΙ ΣΥΜΒΑΙΝΕΙ ΣΤΟ ΒΗΜΑ ${s}:`,
    step1Desc: (a, b) => `Στον αριστερό δίσκο έχουμε το κουτί x μέσα από το οποίο λείπουν ${a} μπάλες (φαίνονται ως διακεκομμένες κενές θέσεις). Στον δεξιό δίσκο έχουμε ${b} μπάλες: x － ${a} ＝ ${b}.`,
    step2Desc: (a) => `Προσθέτουμε ${a} λαμπερές πορτοκαλί μπάλες για να «κουμπώσουν» μέσα στο κουτί x, και προσθέτουμε ακριβώς ${a} μπάλες και στον δεξιό δίσκο για να διατηρηθεί η ισορροπία!`,
    step3Desc: (a, b, res) => `Το κουτί x είναι πλέον πλήρες (λαμπερό πράσινο)! Στον δεξιό δίσκο βρίσκονται ${b} ＋ ${a} ＝ ${res} μπάλες: x ＝ ${b} ＋ ${a} ＝ ${res}.`,
    labTip: "💡 Κανόνας: Για να βρούμε τον άγνωστο μειωτέο x, κάνουμε πάντα πρόσθεση: x ＝ β ＋ α!",
    scaleTitle: (a, b) => `⚖️ ΟΠΤΙΚΗ ΖΥΓΑΡΙΑ: ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ (x － ${a}) VS ΔΕΞΙΟΣ ΔΙΣΚΟΣ (${b})`,
    perfectBalance: "✔ Τέλεια Ισορροπία",
    boxText: "ΚΟΥΤΙ x",
    boxTextFull: "ΠΛΗΡΕΣ x",
    leftPanStep1: (a) => `x (λείπουν ${a} μπάλες από μέσα)`,
    leftPanStep2: (a) => `x － ${a} ＋ ${a}`,
    leftPanStep3: "Ολόκληρο το Κουτί x",
    rightPanStep1: (b) => `Αρχικά: ${b} μπάλες`,
    rightPanStep2: (b, a) => `Προσθήκη: ${b} ＋ ${a} μπάλες`,
    rightPanStep3: (res) => `Σύνολο: ${res} μπάλες`,
    stepTitle1: "Βήμα 1: Αρχική Ισότητα (x － α ＝ β)",
    stepTitle2: (a) => `Βήμα 2: Προσθήκη ＋${a} και στα δύο μέλη`,
    stepTitle3: (b, a, res) => `Βήμα 3: x ＝ ${b} ＋ ${a} ＝ ${res}`,
    btnPrev: "⬅️ Προηγούμενο",
    btnNext: "Επόμενο ➡️",
    stepOf: (cur, total) => `Βήμα ${cur} από ${total}`,
    summaryTitle: (a, b, res) => `💡 ΣΥΜΠΕΡΑΣΜΑ: Συμπληρώνοντας τις ${a} μπάλες που έλειπαν από το κουτί x και προσθέτοντας ${a} μπάλες και στον δεξιό δίσκο, βρίσκουμε: x ＝ ${b} ＋ ${a} ＝ ${res}!`,
    ctaTitle: "Ώρα για Εξάσκηση στον Άγνωστο Μειωτέο!",
    ctaDesc: "Έμαθες πώς λύνουμε μια εξίσωση με άγνωστο μειωτέο; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Equations: Unknown Minuend - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive lesson with visual balance scale, mystery box x with interior vacancies, and addition steps for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 34 • 6TH GRADE",
    heroTitle: "34. Equations: The Unknown is a Minuend (x － a ＝ b)",
    heroDesc: "Discover how to find the unknown minuend (x): fill in the a missing weights inside box x and add the same a weights to the right pan to keep balance: x ＝ b ＋ a!",
    heroFeature: "Interactive Balanced Scale & Visual Weight Addition",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts: The Minuend & Solving Subtraction Equations",
    theorySubtitle: "How balance is preserved when replenishing the deficit in the unknown minuend x.",
    card1Badge: "THE MINUEND",
    card1Sub: "Initial Amount",
    card1Title: "1. What is the Minuend?",
    card1Text: "In subtraction x － a ＝ b, x is the minuend (the initial larger quantity from which we subtract).",
    card1Example: "x － 3 ＝ 5 (x ＝ Starting Amount)",
    card1Tip: "💡 The minuend is always greater than or equal to both the difference and the subtrahend!",
    card2Badge: "METHOD",
    card2Sub: "x ＝ b ＋ a",
    card2Title: "2. The Solution Rule",
    card2Text: "To find the unknown minuend, add the difference and the subtrahend (inverse operation):",
    card2Example: (
      <span>
        x ＝ 5 ＋ 3 ＝ <strong className="text-indigo-700">8</strong>
      </span>
    ),
    card2Tip: "⚡ Golden Rule: When the unknown is the first term in a subtraction (minuend), always solve by adding!",
    card3Badge: "CHECK",
    card3Sub: "Substitution",
    card3Title: "3. Verification",
    card3Text: "Substitute the found value for x back into the equation to verify the subtraction holds true:",
    card3Example: "8 － 3 ＝ 5 (Correct! ✔️)",
    card3Tip: "🎯 If the subtraction yields the expected difference, our solution is fully verified!",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Replenishing Box x & Solving with Addition",
    labSubtitle: "Inspect the empty slots inside box x and follow the steps as weights are added equally to both sides!",
    step1Btn: (a) => `1️⃣ Missing ${a} Weights`,
    step2Btn: (a) => `2️⃣ Add ＋${a}`,
    step3Btn: (res) => `3️⃣ Full x ＝ ${res}`,
    equationSettings: "⚙️ EQUATION SETUP: x － a ＝ b",
    missingBallsLabel: "MISSING WEIGHTS (a)",
    rightBallsLabel: "RIGHT PAN WEIGHTS (b)",
    presetsTitle: "PRESET EXAMPLES:",
    tryCta: "Try ➔",
    stepExplainTitle: (s) => `📖 WHAT HAPPENS IN STEP ${s}:`,
    step1Desc: (a, b) => `On the left pan we have box x missing ${a} weights (shown as dashed empty slots). On the right pan we have ${b} weights: x － ${a} ＝ ${b}.`,
    step2Desc: (a) => `We add ${a} golden weights to fill the missing slots in box x, and add exactly ${a} weights to the right pan to maintain perfect balance!`,
    step3Desc: (a, b, res) => `Box x is now complete (solid green)! The right pan holds ${b} ＋ ${a} ＝ ${res} weights: x ＝ ${b} ＋ ${a} ＝ ${res}.`,
    labTip: "💡 Rule: To find the unknown minuend x, always add: x ＝ b ＋ a!",
    scaleTitle: (a, b) => `⚖️ VISUAL SCALE: LEFT PAN (x － ${a}) VS RIGHT PAN (${b})`,
    perfectBalance: "✔ Perfect Balance",
    boxText: "BOX x",
    boxTextFull: "FULL x",
    leftPanStep1: (a) => `x (${a} weights missing inside)`,
    leftPanStep2: (a) => `x － ${a} ＋ ${a}`,
    leftPanStep3: "Complete Box x",
    rightPanStep1: (b) => `Initial: ${b} weights`,
    rightPanStep2: (b, a) => `Adding: ${b} ＋ ${a} weights`,
    rightPanStep3: (res) => `Total: ${res} weights`,
    stepTitle1: "Step 1: Initial Equality (x － a ＝ b)",
    stepTitle2: (a) => `Step 2: Add ＋${a} to both sides`,
    stepTitle3: (b, a, res) => `Step 3: x ＝ ${b} ＋ ${a} ＝ ${res}`,
    btnPrev: "⬅️ Previous",
    btnNext: "Next ➡️",
    stepOf: (cur, total) => `Step ${cur} of ${total}`,
    summaryTitle: (a, b, res) => `💡 SUMMARY: Replenishing the ${a} missing weights in box x and adding ${a} weights to the right pan gives: x ＝ ${b} ＋ ${a} ＝ ${res}!`,
    ctaTitle: "Time to Practice Unknown Minuend!",
    ctaDesc: "Understood how to solve subtraction equations with an unknown minuend? Test your skills with 10 interactive questions to consolidate your knowledge!",
    ctaBtn: "Start Exercises"
  }
};

export default function AgnostosKaiAfairesiPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Παράμετροι της εξίσωσης: x - a = b (x = b + a)
  const [paramA, setParamA] = useState(3);
  const [paramB, setParamB] = useState(5);

  // Βήμα διαδραστικής επίλυσης: 1 (Κενές θέσεις), 2 (Προσθήκη και στα δύο μέλη), 3 (Πλήρες x = b + a)
  const [currentStep, setCurrentStep] = useState(1);

  const rawA = Math.max(1, Number(paramA) || 1);
  const rawB = Math.max(1, Number(paramB) || 1);
  
  const activeA = Math.min(6, rawA);
  const activeB = Math.min(MAX_TOTAL_BALLS - activeA, rawB);

  // Σωστή μαθηματική λύση: x = b + a (Μειωτέος)
  const exactSolution = activeB + activeA;

  const setEquation = (a, b) => {
    setParamA(a);
    setParamB(b);
    setCurrentStep(1);
  };

  const adjustValue = (type, amount) => {
    setCurrentStep(1);
    if (type === 'a') {
      setParamA(prevA => {
        const nextA = Math.max(1, Math.min(6, (Number(prevA) || 1) + amount));
        return nextA + activeB <= MAX_TOTAL_BALLS ? nextA : prevA;
      });
    } else {
      setParamB(prevB => {
        const nextB = Math.max(1, Math.min(MAX_TOTAL_BALLS - activeA, (Number(prevB) || 1) + amount));
        return nextB;
      });
    }
  };

  // Σταθερή γεωμετρία σφαιρών
  const BALL_RADIUS = 9.5;
  const BALL_SPACING = BALL_RADIUS * 2 + 5; // 24px
  const BASE_Y = 248;

  // 1. Θέσεις σφαιρών / κενών θέσεων ΜΕΣΑ ΣΤΟ ΚΟΥΤΙ x (Αριστερός Δίσκος)
  const insideBoxSlots = [];
  for (let i = 0; i < activeA; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    insideBoxSlots.push({
      x: 130 + col * BALL_SPACING,
      y: 226 - row * BALL_SPACING
    });
  }

  // 2. Θέσεις σφαιρών δεξιού δίσκου
  const currentRightCount = currentStep === 1 ? activeB : exactSolution;
  const COLS_RIGHT = 6;
  const rightBalls = [];
  for (let i = 0; i < currentRightCount; i++) {
    const row = Math.floor(i / COLS_RIGHT);
    const totalRows = Math.ceil(currentRightCount / COLS_RIGHT);
    const itemsInThisRow = row === totalRows - 1 && currentRightCount % COLS_RIGHT !== 0 
      ? currentRightCount % COLS_RIGHT 
      : COLS_RIGHT;
    
    const colIndexInRow = i % COLS_RIGHT;
    const rowWidth = (itemsInThisRow - 1) * BALL_SPACING;
    const startX = 610 - rowWidth / 2;

    rightBalls.push({
      id: i,
      x: startX + colIndexInRow * BALL_SPACING,
      y: BASE_Y - BALL_RADIUS - 2 - row * BALL_SPACING,
      isAdded: i >= activeB
    });
  }

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/34-agnostos-kai-afairesi-ask"
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
              href="/st-dimotikou/34-agnostos-kai-afairesi-ask"
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
                {t.labTitle}
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
                {t.step1Btn(activeA)}
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
                    {/* ΑΦΑΙΡΕΤΕΟΣ (a) */}
                    <div className="flex flex-col justify-between space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 h-8 flex items-center justify-center text-center leading-tight uppercase">
                        {t.missingBallsLabel}
                      </span>
                      <div className="grid grid-cols-[36px_1fr_36px] items-center bg-slate-50 p-1 rounded-xl border border-slate-200 h-11">
                        <button 
                          type="button" 
                          disabled={activeA <= 1}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustValue('a', -1); }} 
                          className="w-9 h-9 font-black text-rose-600 hover:bg-slate-200 disabled:opacity-25 rounded-lg active:scale-95 transition flex items-center justify-center text-lg touch-manipulation"
                        >
                          －
                        </button>
                        <span className="w-full text-center font-mono font-black text-base text-rose-600">{activeA}</span>
                        <button 
                          type="button" 
                          disabled={activeA >= 6 || activeA + activeB >= MAX_TOTAL_BALLS}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustValue('a', 1); }} 
                          className="w-9 h-9 font-black text-rose-600 hover:bg-slate-200 disabled:opacity-25 rounded-lg active:scale-95 transition flex items-center justify-center text-lg touch-manipulation"
                        >
                          ＋
                        </button>
                      </div>
                    </div>

                    {/* ΔΙΑΦΟΡΑ (b) */}
                    <div className="flex flex-col justify-between space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 h-8 flex items-center justify-center text-center leading-tight uppercase">
                        {t.rightBallsLabel}
                      </span>
                      <div className="grid grid-cols-[36px_1fr_36px] items-center bg-slate-50 p-1 rounded-xl border border-slate-200 h-11">
                        <button 
                          type="button" 
                          disabled={activeB <= 1}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustValue('b', -1); }} 
                          className="w-9 h-9 font-black text-emerald-600 hover:bg-slate-200 disabled:opacity-25 rounded-lg active:scale-95 transition flex items-center justify-center text-lg touch-manipulation"
                        >
                          －
                        </button>
                        <span className="w-full text-center font-mono font-black text-base text-emerald-600">{activeB}</span>
                        <button 
                          type="button" 
                          disabled={activeA + activeB >= MAX_TOTAL_BALLS}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustValue('b', 1); }} 
                          className="w-9 h-9 font-black text-emerald-600 hover:bg-slate-200 disabled:opacity-25 rounded-lg active:scale-95 transition flex items-center justify-center text-lg touch-manipulation"
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
                    <p className="text-amber-800">{t.step2Desc(activeA)}</p>
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

            {/* RIGHT: PREMIUM 3D SCALE & IN-BOX BALLS VISUALIZER */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[580px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΕΞΙΣΩΣΗΣ & ΒΗΜΑΤΟΣ */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-around text-center flex-wrap gap-4">
                <div className="font-mono text-xl sm:text-2xl md:text-3xl font-black text-slate-800">
                  <span className="text-amber-600 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">x</span>
                  <span className="text-slate-400 mx-2">－</span>
                  <span className="text-rose-600">{activeA}</span>
                  <span className="text-slate-400 mx-2">＝</span>
                  <span className="text-emerald-600">{activeB}</span>
                </div>

                <div className="font-mono text-xs sm:text-sm md:text-base font-black text-indigo-700 bg-white px-3.5 py-2 rounded-2xl border border-indigo-200 shadow-xs">
                  {currentStep === 1 && t.stepTitle1}
                  {currentStep === 2 && t.stepTitle2(activeA)}
                  {currentStep === 3 && t.stepTitle3(activeB, activeA, exactSolution)}
                </div>
              </div>

              {/* 2. ΜΕΓΑΛΗ ΟΠΤΙΚΗ ΖΥΓΑΡΙΑ ΣΤΟ SVG */}
              <div className="space-y-3 flex-1 flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                    {t.scaleTitle(activeA, activeB)}
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
                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.6" />
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

                      <radialGradient id="ballGreen" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#6ee7b7" />
                        <stop offset="40%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#047857" />
                      </radialGradient>

                      <radialGradient id="ballGold" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="40%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#b45309" />
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

                    {/* 5. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ: ΜΕΓΑΛΟ «ΓΥΑΛΙΝΟ» ΚΟΥΤΙ x */}
                    <g transform="translate(95, 164)" filter="url(#shadow3d)">
                      <rect 
                        width="110" 
                        height="84" 
                        rx="16" 
                        fill={currentStep === 3 ? "rgba(16, 185, 129, 0.18)" : "rgba(245, 158, 11, 0.12)"} 
                        stroke={currentStep === 3 ? "#059669" : "#d97706"} 
                        strokeWidth="3" 
                        strokeDasharray={currentStep === 1 ? "6 4" : "none"}
                      />
                      <rect x="8" y="8" width="28" height="28" rx="8" fill={currentStep === 3 ? "#10b981" : "#f59e0b"} filter="url(#shadow3d)" />
                      <text x="22" y="28" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">x</text>
                      <text x="66" y="26" fill={currentStep === 3 ? "#065f46" : "#92400e"} fontSize="11" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
                        {currentStep === 3 ? t.boxTextFull : t.boxText}
                      </text>
                    </g>

                    {/* 6. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ: ΟΙ ΜΠΑΛΕΣ / ΕΛΛΕΙΜΜΑΤΑ ΜΕΣΑ ΣΤΟ ΚΟΥΤΙ x */}
                    {insideBoxSlots.map((pos, i) => {
                      if (currentStep === 1) {
                        return (
                          <g key={`inbox-slot-${i}`} className="transition-all duration-500">
                            <circle
                              cx={pos.x}
                              cy={pos.y}
                              r={BALL_RADIUS}
                              fill="rgba(244, 63, 94, 0.1)"
                              stroke="#f43f5e"
                              strokeWidth="2"
                              strokeDasharray="3 3"
                            />
                            <circle cx={pos.x - 3} cy={pos.y - 3} r="2.5" fill="#ffffff" opacity="0.6" />
                            <text x={pos.x} y={pos.y + 3.5} fill="#e11d48" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="monospace">－1</text>
                          </g>
                        );
                      } else {
                        return (
                          <g key={`inbox-filled-${i}`} className="transition-all duration-500" filter={currentStep === 2 ? "url(#glowGold)" : "url(#shadow3d)"}>
                            <circle
                              cx={pos.x}
                              cy={pos.y}
                              r={BALL_RADIUS}
                              fill={currentStep === 2 ? "url(#ballGold)" : "url(#ballGreen)"}
                              stroke={currentStep === 2 ? "#b45309" : "#047857"}
                              strokeWidth="1.5"
                              className={currentStep === 2 ? "animate-pulse" : ""}
                            />
                            <ellipse cx={pos.x - 3} cy={pos.y - 3} rx="3" ry="2" fill="#ffffff" opacity="0.65" />
                            <text x={pos.x} y={pos.y + 3.5} fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                              {currentStep === 2 ? "＋1" : "1"}
                            </text>
                          </g>
                        );
                      }
                    })}

                    {/* 7. ΔΕΞΙΟΣ ΔΙΣΚΟΣ: ΟΙ ΜΠΑΛΕΣ b ΚΑΙ ΟΙ ΠΡΟΣΤΙΘΕΜΕΝΕΣ ΜΠΑΛΕΣ a */}
                    {rightBalls.map((ball) => {
                      const isAddedBall = ball.isAdded;
                      return (
                        <g key={`rball-${ball.id}`} className="transition-all duration-500" filter={isAddedBall && currentStep === 2 ? "url(#glowGold)" : "url(#shadow3d)"}>
                          <circle
                            cx={ball.x}
                            cy={ball.y}
                            r={BALL_RADIUS}
                            fill={isAddedBall ? (currentStep === 2 ? "url(#ballGold)" : "url(#ballGreen)") : "url(#ballGreen)"}
                            stroke={isAddedBall ? (currentStep === 2 ? "#b45309" : "#047857") : "#047857"}
                            strokeWidth="1.5"
                            className={isAddedBall && currentStep === 2 ? "animate-pulse" : ""}
                          />
                          <ellipse cx={ball.x - 3} cy={ball.y - 3} rx="3" ry="2" fill="#ffffff" opacity="0.65" />
                          <text x={ball.x} y={ball.y + 3.5} fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                            {isAddedBall ? "＋1" : "1"}
                          </text>
                        </g>
                      );
                    })}

                    {/* Ετικέτες κάτω από τους δίσκους */}
                    <text x="150" y="325" fill="#1e3a8a" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                      {currentStep === 1 && t.leftPanStep1(activeA)}
                      {currentStep === 2 && t.leftPanStep2(activeA)}
                      {currentStep === 3 && t.leftPanStep3}
                    </text>

                    <text x="610" y="325" fill="#064e3b" fontSize="13.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                      {currentStep === 1 && t.rightPanStep1(activeB)}
                      {currentStep === 2 && t.rightPanStep2(activeB, activeA)}
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
            href="/st-dimotikou/34-agnostos-kai-afairesi-ask"
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
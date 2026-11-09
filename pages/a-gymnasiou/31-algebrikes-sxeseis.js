import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός τόνων στα ελληνικά κεφαλαία (διατηρείται μόνο το Α')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Α')/g);
  return parts
    .map((part) => {
      if (part === "Α'") return "Α'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Επαναχρησιμοποιήσιμο component για κατακόρυφη κλασματική μορφή (Mobile safe, no overflow)
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 sm:gap-1 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-0.5 sm:px-1 border-b border-current w-full text-center break-all">
          {displayNum}
        </span>
        <span className="pt-0.5 px-0.5 sm:px-1 w-full text-center break-all">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

// Συγκεντρωτικό λεξικό όρων & μεταφράσεων (i18n)
const TRANSLATIONS = {
  el: {
    pageTitle: "Αλγεβρικές Σχέσεις & Εξισώσεις | Α' Γυμνασίου",
    pageDescription: "Η έννοια της εξίσωσης, ο άγνωστος x, ο συντελεστής του αγνώστου, η επαλήθευση λύσης, η ζυγαριά ισορροπίας και διαδραστικά εργαστήρια.",
    backText: "Α' Γυμνασίου",
    exercisesBtn: "ΑΣΚΗΣΕΙΣ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 27 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    mainTitle: "Αλγεβρικές Σχέσεις & Η Έννοια της Εξίσωσης",
    mainSubtitle: "Μαθαίνουμε τι είναι μια εξίσωση, πώς ορίζεται ο άγνωστος x και ο συντελεστής του, πώς αναπαριστούμε την εξίσωση σαν μια ζυγαριά σε ισορροπία και πώς επαληθεύουμε αν ένας αριθμός είναι λύση της.",

    // Section 1
    sec1Title: "Τι Είναι η Εξίσωση;",
    sec1Def: "ονομάζεται μια",
    sec1DefEquality: "ισότητα δύο παραστάσεων",
    sec1DefRest: "(1ο μέλος ＝ 2ο μέλος) που περιέχει τουλάχιστον ένα γράμμα, το οποίο ονομάζεται",
    sec1UnknownWord: "άγνωστος",
    sec1Term1: "1ο Μέλος:",
    sec1Term1Desc: "Η παράσταση αριστερά από το σύμβολο ίσον (2x ＋ 3).",
    sec1Term2: "2ο Μέλος:",
    sec1Term2Desc: "Η παράσταση δεξιά από το σύμβολο ίσον (11).",
    sec1Term3: "Άγνωστος (x):",
    sec1Term3Desc: "Ο αριθμός του οποίου την τιμή ψάχνουμε ώστε να αληθεύει η ισότητα.",
    sec1Term4: "Συντελεστής του Αγνώστου:",
    sec1Term4Desc: "Ο αριθμός που πολλαπλασιάζει το x (εδώ το 2).",

    // Section 1 Callout
    calloutTitle: "ΛΥΣΗ (Η ΡΙΖΑ) ΤΗΣ ΕΞΙΣΩΣΗΣ",
    calloutDesc: "μιας εξίσωσης ονομάζεται ο αριθμός που, όταν μπει στη θέση του αγνώστου,",
    calloutVerify: "επαληθεύει την ισότητα",
    calloutVerifyRest: "(κάνει το 1ο μέλος ίσο με το 2ο).",
    calloutCheckTitle: "Έλεγχος για την εξίσωση 2x ＋ 3 ＝ 11:",
    calloutCheckFailPrefix: "Αν βάλουμε x ＝ 3:",
    calloutCheckFailRest: "≠ 11 (το 3",
    calloutNotWord: "δεν",
    calloutCheckFailSuffix: "είναι λύση).",
    calloutCheckPassPrefix: "Αν βάλουμε x ＝ 4:",
    calloutCheckPassRest: "＝ 11 (το 4",
    calloutIsRootWord: "είναι η λύση",
    calloutCheckPassSuffix: "!).",

    // Section 2
    sec2Title: "Η Εξίσωση ως Ζυγαριά σε Ισορροπία",
    sec2Desc: "Μπορούμε να φανταστούμε μια εξίσωση σαν μια παραδοσιακή ζυγαριά δύο δίσκων. Το σύμβολο του ίσον (＝) σημαίνει ότι η ζυγαριά βρίσκεται σε τέλεια ισορροπία: το βάρος στον αριστερό δίσκο είναι ακριβώς ίσο με το βάρος στον δεξιό δίσκο.",
    lab1Heading: "🛠️ Εργαστήριο 1: Διαδραστική Ζυγαριά Ισορροπίας (α · x ＋ β ＝ γ)",
    boxesLabel: "ΚΟΥΤΙΑ x (ΣΥΝΤΕΛΕΣΤΗΣ α)",
    boxSingular: "κουτί",
    boxPlural: "κουτιά",
    ballsLeftLabel: "ΜΠΑΛΕΣ ΑΡΙΣΤΕΡΑ (β)",
    ballsRightLabel: "ΜΠΑΛΕΣ ΔΕΞΙΑ (γ)",
    tryXLabel: "ΔΟΚΙΜΗ x (ΜΠΑΛΕΣ/ΚΟΥΤΙ)",
    legendBox: "📦 Κουτί x",
    legendBallsLeft: "🔵 Μπάλες β",
    legendBallsRight: "🟡 Μπάλες γ",
    scaleStatusTitle: "ΚΑΤΑΣΤΑΣΗ ΖΥΓΑΡΙΑΣ",
    balancedStatus: "ΙΣΟΡΡΟΠΙΑ (ΣΩΣΤΗ ΛΥΣΗ)",
    unbalancedStatus: "ΑΝΙΣΟΡΡΟΠΙΑ (ΚΛΙΣΗ)",
    ballsUnit: "μπάλες",
    eqLabel: "Εξίσωση:",
    testAttemptPrefix: "Δοκιμάζουμε",
    testAttemptSuffix: "μπάλες σε κάθε κουτί:",
    leftPanLabel: "Αριστερός δίσκος:",
    rightPanLabel: "Δεξιός δίσκος:",
    balancedSuccessMsg: (xVal) => `✅ Η ζυγαριά ισορροπεί τέλεια! Ο αριθμός x ＝ ${xVal} είναι η λύση της εξίσωσης.`,
    unbalancedFailMsg: (leftWeight, rightWeight, xVal) =>
      `❌ Η ζυγαριά γέρνει (${leftWeight > rightWeight ? 'βαρύτερος ο αριστερός δίσκος' : 'βαρύτερος ο δεξιός δίσκος'}). Το ${xVal} δεν είναι λύση.`,

    // Section 3
    sec3Title: "Επαλήθευση Λύσης Εξίσωσης",
    coeffLabel: "ΣΥΝΤΕΛΕΣΤΗΣ (α)",
    constLabel: "ΣΤΑΘΕΡΟΣ (β)",
    side2Label: "2Ο ΜΕΛΟΣ (γ)",
    testXLabel: "ΔΟΚΙΜΑΣΤΙΚΟ x",
    verifyTesterTitle: "ΔΟΚΙΜΑΣΤΗΡΙΟ ΕΠΑΛΗΘΕΥΣΗΣ",
    verifiedStatus: "Η ΙΣΟΤΗΤΑ ΕΠΑΛΗΘΕΥΕΤΑΙ",
    notVerifiedStatus: "ΔΕΝ ΕΠΑΛΗΘΕΥΕΤΑΙ",
    calcSide1Title: (xVal) => `Υπολογισμός 1ου μέλους για x ＝ ${xVal}:`,
    side1Label: "1ο μέλος",
    side2ResultLabel: "2ο μέλος",
    verifySuccessMsg: (eqC, userX) =>
      `Συμπέρασμα: Επειδή 1ο μέλος ＝ 2ο μέλος (και τα δύο ισούνται με ${eqC}), ο αριθμός x ＝ ${userX} είναι η λύση της εξίσωσης!`,
    verifyFailMsg: (leftSideVal, eqC, userX) =>
      `Συμπέρασμα: Επειδή 1ο μέλος (${leftSideVal}) ≠ 2ο μέλος (${eqC}), ο αριθμός x ＝ ${userX} ΔΕΝ είναι λύση της εξίσωσης.`,
  },
  en: {
    pageTitle: "Algebraic Relationships & Equations | Grade 7 Math",
    pageDescription: "The concept of an equation, the unknown x, the coefficient, solution verification, balance scales, and interactive laboratories.",
    backText: "Grade 7 Math",
    exercisesBtn: "EXERCISES",
    chapterBadge: "GRADE 7 • CHAPTER 27 • THEORY & LAB",
    mainTitle: "Algebraic Relationships & The Concept of an Equation",
    mainSubtitle: "Learn what an equation is, how to identify the unknown x and its coefficient, how to represent equations using balance scales, and how to verify potential solutions.",

    // Section 1
    sec1Title: "What is an Equation?",
    sec1Def: "is an",
    sec1DefEquality: "equality of two expressions",
    sec1DefRest: "(Left-hand side ＝ Right-hand side) containing at least one variable letter, referred to as the",
    sec1UnknownWord: "unknown",
    sec1Term1: "Left-Hand Side (LHS):",
    sec1Term1Desc: "The expression on the left of the equal sign (2x ＋ 3).",
    sec1Term2: "Right-Hand Side (RHS):",
    sec1Term2Desc: "The expression on the right of the equal sign (11).",
    sec1Term3: "Unknown (x):",
    sec1Term3Desc: "The numerical value we seek to make the equality true.",
    sec1Term4: "Coefficient of the Unknown:",
    sec1Term4Desc: "The numerical factor multiplying x (here 2).",

    // Section 1 Callout
    calloutTitle: "SOLUTION (OR ROOT) OF AN EQUATION",
    calloutDesc: "of an equation is the number that, when substituted for the unknown,",
    calloutVerify: "satisfies the equality",
    calloutVerifyRest: "(makes the Left-Hand Side equal to the Right-Hand Side).",
    calloutCheckTitle: "Verification test for equation 2x ＋ 3 ＝ 11:",
    calloutCheckFailPrefix: "If we substitute x ＝ 3:",
    calloutCheckFailRest: "≠ 11 (3 is",
    calloutNotWord: "not",
    calloutCheckFailSuffix: "a solution).",
    calloutCheckPassPrefix: "If we substitute x ＝ 4:",
    calloutCheckPassRest: "＝ 11 (4",
    calloutIsRootWord: "is the true solution",
    calloutCheckPassSuffix: "!).",

    // Section 2
    sec2Title: "The Equation as a Balanced Scale",
    sec2Desc: "We can visualize an equation as a traditional two-pan balance scale. The equal sign (＝) indicates that the scale is in perfect balance: the weight on the left pan matches the weight on the right pan exactly.",
    lab1Heading: "🛠️ Lab 1: Interactive Balance Scale (a · x ＋ b ＝ c)",
    boxesLabel: "BOXES x (COEFFICIENT a)",
    boxSingular: "box",
    boxPlural: "boxes",
    ballsLeftLabel: "BALLS ON LEFT (b)",
    ballsRightLabel: "BALLS ON RIGHT (c)",
    tryXLabel: "TEST x (BALLS/BOX)",
    legendBox: "📦 Box x",
    legendBallsLeft: "🔵 Balls b",
    legendBallsRight: "🟡 Balls c",
    scaleStatusTitle: "SCALE STATUS",
    balancedStatus: "BALANCED (TRUE SOLUTION)",
    unbalancedStatus: "UNBALANCED (TILTED)",
    ballsUnit: "balls",
    eqLabel: "Equation:",
    testAttemptPrefix: "Testing",
    testAttemptSuffix: "balls per box:",
    leftPanLabel: "Left Pan:",
    rightPanLabel: "Right Pan:",
    balancedSuccessMsg: (xVal) => `✅ The scale balances perfectly! The value x ＝ ${xVal} is the solution to the equation.`,
    unbalancedFailMsg: (leftWeight, rightWeight, xVal) =>
      `❌ The scale tilts (${leftWeight > rightWeight ? 'the left pan is heavier' : 'the right pan is heavier'}). Therefore, ${xVal} is not a solution.`,

    // Section 3
    sec3Title: "Equation Solution Verification",
    coeffLabel: "COEFFICIENT (a)",
    constLabel: "CONSTANT (b)",
    side2Label: "2ND SIDE (c)",
    testXLabel: "TEST VALUE x",
    verifyTesterTitle: "VERIFICATION WORKBENCH",
    verifiedStatus: "EQUALITY SATISFIED",
    notVerifiedStatus: "NOT SATISFIED",
    calcSide1Title: (xVal) => `Computing Left-Hand Side for x ＝ ${xVal}:`,
    side1Label: "LHS",
    side2ResultLabel: "RHS",
    verifySuccessMsg: (eqC, userX) =>
      `Conclusion: Because LHS ＝ RHS (both equal ${eqC}), the number x ＝ ${userX} is a valid solution!`,
    verifyFailMsg: (leftSideVal, eqC, userX) =>
      `Conclusion: Because LHS (${leftSideVal}) ≠ RHS (${eqC}), the number x ＝ ${userX} is NOT a solution.`,
  }
};

export default function AlgebrikesSxeseisTheoria() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const formatNumber = (num) => {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
  };

  // State για Εργαστήριο 1: Διαδραστική Ζυγαριά (a*x + b = c)
  const [scaleCoeffA, setScaleCoeffA] = useState(2); // Συντελεστής του x (πλήθος κουτιών)
  const [scaleConstB, setScaleConstB] = useState(3); // Σταθερός όρος (έξτρα μπάλες αριστερά)
  const [scaleTargetC, setScaleTargetC] = useState(11); // Βάρος δεξιού δίσκου (μπάλες δεξιά)
  const [scaleTestX, setScaleTestX] = useState(4); // Δοκιμαστική τιμή x (μπάλες ΜΕΣΑ σε κάθε κουτί)

  // State για Εργαστήριο 2: Επαλήθευση Ρίζας Εξίσωσης
  const [eqA, setEqA] = useState(3);
  const [eqB, setEqB] = useState(-4);
  const [eqC, setEqC] = useState(11);
  const [userX, setUserX] = useState(5);

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 1 (Ζυγαριά)
  const leftWeight = useMemo(() => scaleCoeffA * scaleTestX + scaleConstB, [scaleCoeffA, scaleTestX, scaleConstB]);
  const rightWeight = scaleTargetC;
  const isBalanced = leftWeight === rightWeight;
  const tiltAngle = useMemo(() => {
    if (leftWeight === rightWeight) return 0;
    const diff = leftWeight - rightWeight;
    return Math.max(-12, Math.min(12, diff * 1.5));
  }, [leftWeight, rightWeight]);

  // Υπολογισμοί Εργαστηρίου 2 (Επαλήθευση)
  const leftSideVal = useMemo(() => eqA * userX + eqB, [eqA, userX, eqB]);
  const isRootCorrect = leftSideVal === eqC;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/31-algebrikes-sxeseis-ask"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.exercisesBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-12">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-8 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3 sm:space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.chapterBadge)}
            </span>
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* 1. ΤΙ ΕΙΝΑΙ Η ΕΞΙΣΩΣΗ */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
            <div className="space-y-4">
              <p className="break-words [overflow-wrap:anywhere]">
                <strong>{locale === 'el' ? 'Εξίσωση' : 'An Equation'}</strong> {t.sec1Def}{' '}
                <strong>{t.sec1DefEquality}</strong> {t.sec1DefRest}{' '}
                <strong>{t.sec1UnknownWord}</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 font-black text-center text-lg sm:text-2xl font-mono shadow-sm inline-flex flex-wrap items-center justify-center gap-1 w-full max-w-full break-words [overflow-wrap:anywhere]">
                <span>2 · x ＋ 3 ＝ 11</span>
              </div>
              <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="break-words [overflow-wrap:anywhere]">
                  <strong>{t.sec1Term1}</strong> {t.sec1Term1Desc}
                </li>
                <li className="break-words [overflow-wrap:anywhere]">
                  <strong>{t.sec1Term2}</strong> {t.sec1Term2Desc}
                </li>
                <li className="break-words [overflow-wrap:anywhere]">
                  <strong>{t.sec1Term3}</strong> {t.sec1Term3Desc}
                </li>
                <li className="break-words [overflow-wrap:anywhere]">
                  <strong>{t.sec1Term4}</strong> {t.sec1Term4Desc}
                </li>
              </ul>
            </div>

            {/* Λύση / Ρίζα της Εξίσωσης */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                {toCleanUppercase(t.calloutTitle)}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                <strong>{locale === 'el' ? 'Λύση (ή ρίζα)' : 'A Solution (or Root)'}</strong> {t.calloutDesc}{' '}
                <strong>{t.calloutVerify}</strong> {t.calloutVerifyRest}
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs sm:text-sm space-y-2 break-words [overflow-wrap:anywhere]">
                <div className="text-indigo-950 font-bold font-sans">
                  {t.calloutCheckTitle}
                </div>
                <div className="text-slate-600 inline-flex flex-wrap items-center gap-1">
                  <span>{t.calloutCheckFailPrefix}</span>
                  <span>2 · 3 ＋ 3 ＝ 6 ＋ 3 ＝ 9</span>
                  <span>{t.calloutCheckFailRest} <strong>{t.calloutNotWord}</strong> {t.calloutCheckFailSuffix}</span>
                </div>
                <div className="text-emerald-700 font-bold inline-flex flex-wrap items-center gap-1">
                  <span>{t.calloutCheckPassPrefix}</span>
                  <span>2 · 4 ＋ 3 ＝ 8 ＋ 3 ＝ 11</span>
                  <span>{t.calloutCheckPassRest} <strong>{t.calloutIsRootWord}</strong>{t.calloutCheckPassSuffix}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Η ΖΥΓΑΡΙΑ ΙΣΟΡΡΟΠΙΑΣ & ΕΡΓΑΣΤΗΡΙΟ 1 */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
            {t.sec2Desc}
          </p>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΗ ΖΥΓΑΡΙΑ ΜΕ ΚΟΥΤΙΑ ΚΑΙ ΜΠΑΛΕΣ */}
          <div className="pt-2 space-y-5">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.lab1Heading}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Χειριστήρια Steppers (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-indigo-900 uppercase block break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(t.boxesLabel)}
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleCoeffA, -1, 1, 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-xs font-mono text-indigo-950 px-1 text-center">
                      {scaleCoeffA} {scaleCoeffA === 1 ? t.boxSingular : t.boxPlural}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleCoeffA, 1, 1, 5, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(t.ballsLeftLabel)}
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleConstB, -1, 0, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono text-slate-800 px-1 text-center">
                      ＋{formatNumber(scaleConstB)} {t.ballsUnit}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleConstB, 1, 0, 10, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-amber-700 uppercase block break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(t.ballsRightLabel)}
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleTargetC, -1, 1, 25, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-xs font-mono text-amber-950 px-1 text-center">
                      {formatNumber(scaleTargetC)} {t.ballsUnit}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleTargetC, 1, 1, 25, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-sky-700 uppercase block break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(t.tryXLabel)}
                  </label>
                  <div className="grid grid-cols-[30px_1fr_30px] items-center h-9 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleTestX, -1, 0, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-xs font-mono text-sky-950 px-1 text-center">
                      x ＝ {formatNumber(scaleTestX)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setScaleTestX, 1, 0, 15, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* Υπόμνημα Χρωμάτων */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-200 grid grid-cols-3 gap-1 text-[10px] font-bold text-center">
                  <div className="p-1 rounded bg-sky-100 text-sky-900 border border-sky-200 break-words [overflow-wrap:anywhere]">
                    {t.legendBox} ({formatNumber(scaleTestX)} •)
                  </div>
                  <div className="p-1 rounded bg-indigo-100 text-indigo-900 border border-indigo-200 break-words [overflow-wrap:anywhere]">
                    {t.legendBallsLeft} ({formatNumber(scaleConstB)})
                  </div>
                  <div className="p-1 rounded bg-amber-100 text-amber-900 border border-amber-200 break-words [overflow-wrap:anywhere]">
                    {t.legendBallsRight} ({formatNumber(scaleTargetC)})
                  </div>
                </div>
              </div>

              {/* Οπτική Ζυγαριά σε SVG (7 cols) */}
              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.scaleStatusTitle)}
                  </span>
                  <span
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                      isBalanced
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                    }`}
                  >
                    {toCleanUppercase(isBalanced ? t.balancedStatus : t.unbalancedStatus)}
                  </span>
                </div>

                {/* SVG Ζυγαριά - 740x400 Responsive */}
                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3 flex justify-center items-center">
                  <svg
                    viewBox="0 0 740 400"
                    className="w-full max-w-[680px] h-auto"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Βάση & Κολόνα */}
                    <rect x="310" y="360" width="120" height="20" rx="6" fill="#334155" />
                    <polygon points="370,160 340,360 400,360" fill="#475569" stroke="#1e293b" strokeWidth="2" />
                    <circle cx="370" cy="160" r="12" fill="#f59e0b" />

                    {/* Κινούμενο σύστημα ζυγού */}
                    <g transform={`rotate(${tiltAngle} 370 160)`} className="transition-transform duration-300">
                      {/* Κεντρικός βραχίονας */}
                      <line x1="140" y1="160" x2="600" y2="160" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

                      {/* --- ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ --- */}
                      <g transform="translate(140, 160)">
                        <line x1="0" y1="0" x2="-120" y2="140" stroke="#64748b" strokeWidth="2.5" />
                        <line x1="0" y1="0" x2="120" y2="140" stroke="#64748b" strokeWidth="2.5" />
                        <ellipse cx="0" cy="140" rx="130" ry="22" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />

                        {/* ΚΟΥΤΙΑ x (Συντελεστής α) */}
                        <g transform="translate(-115, 80)">
                          {Array.from({ length: scaleCoeffA }).map((_, boxIdx) => {
                            const bX = boxIdx * 38;
                            return (
                              <g key={`box-${boxIdx}`}>
                                <rect
                                  x={bX}
                                  y="0"
                                  width="34"
                                  height="55"
                                  rx="4"
                                  fill="#0c4a6e"
                                  stroke="#38bdf8"
                                  strokeWidth="1.5"
                                />
                                <text x={bX + 17} y="13" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                                  x
                                </text>
                                {/* Μπάλες μέσα στο κουτί */}
                                {Array.from({ length: Math.min(scaleTestX, 15) }).map((_, bIdx) => (
                                  <circle
                                    key={`bb-${boxIdx}-${bIdx}`}
                                    cx={bX + 7 + (bIdx % 3) * 10}
                                    cy={48 - Math.floor(bIdx / 3) * 8}
                                    r="3.5"
                                    fill="#7dd3fc"
                                  />
                                ))}
                              </g>
                            );
                          })}
                        </g>

                        {/* ΜΠΑΛΕΣ β (Σταθερός όρος) - Διορθωμένο χωρίς συντακτικά προβλήματα */}
                        <g transform={`translate(${-115 + scaleCoeffA * 38 + 10}, 132)`}>
                          {Array.from({ length: scaleConstB }).map((_, bIdx) => (
                            <circle
                              key={`const-b-${bIdx}`}
                              cx={(bIdx % 3) * 14}
                              cy={-6 - Math.floor(bIdx / 3) * 14}
                              r="6"
                              fill="#818cf8"
                              stroke="#c7d2fe"
                              strokeWidth="1"
                            />
                          ))}
                        </g>

                        {/* Ετικέτα βάρους */}
                        <text x="0" y="185" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                          {formatNumber(leftWeight)} {t.ballsUnit} ({scaleCoeffA}x ＋ {scaleConstB})
                        </text>
                      </g>

                      {/* --- ΔΕΞΙΟΣ ΔΙΣΚΟΣ --- */}
                      <g transform="translate(600, 160)">
                        <line x1="0" y1="0" x2="-120" y2="140" stroke="#64748b" strokeWidth="2.5" />
                        <line x1="0" y1="0" x2="120" y2="140" stroke="#64748b" strokeWidth="2.5" />
                        <ellipse cx="0" cy="140" rx="130" ry="22" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />

                        {/* ΜΠΑΛΕΣ γ (Δεξιός δίσκος) */}
                        <g transform="translate(-42, 132)">
                          {Array.from({ length: Math.min(scaleTargetC, 25) }).map((_, bIdx) => {
                            const col = bIdx % 7;
                            const row = Math.floor(bIdx / 7);
                            return (
                              <circle
                                key={`target-c-${bIdx}`}
                                cx={col * 14}
                                cy={-6 - row * 14}
                                r="6"
                                fill="#f59e0b"
                                stroke="#fde68a"
                                strokeWidth="1"
                              />
                            );
                          })}
                        </g>

                        {/* Ετικέτα βάρους */}
                        <text x="0" y="185" fill="#f59e0b" fontSize="13" fontWeight="bold" textAnchor="middle">
                          {formatNumber(rightWeight)} {t.ballsUnit} (γ)
                        </text>
                      </g>
                    </g>
                  </svg>
                </div>

                {/* Επεξήγηση αποτελέσματος */}
                <div className="p-3 sm:p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-2 text-slate-200 break-words [overflow-wrap:anywhere]">
                  <div className="font-mono text-sm sm:text-base font-bold text-amber-300">
                    {t.eqLabel} {scaleCoeffA} · x ＋ {scaleConstB} ＝ {scaleTargetC}
                  </div>
                  <div className="space-y-1">
                    <div>
                      {t.testAttemptPrefix} <strong>x ＝ {formatNumber(scaleTestX)}</strong> {t.testAttemptSuffix}
                    </div>
                    <div className="font-mono text-xs sm:text-sm inline-flex flex-wrap items-center gap-1">
                      <span className="font-sans text-slate-300">{t.leftPanLabel}</span>
                      <span>{scaleCoeffA} · ({scaleTestX}) ＋ {scaleConstB} ＝ <strong>{formatNumber(leftWeight)} {t.ballsUnit}</strong></span>
                    </div>
                    <div className="font-mono text-xs sm:text-sm inline-flex flex-wrap items-center gap-1">
                      <span className="font-sans text-slate-300">{t.rightPanLabel}</span>
                      <span><strong>{formatNumber(rightWeight)} {t.ballsUnit}</strong></span>
                    </div>
                  </div>
                  <div className={isBalanced ? 'text-emerald-400 font-bold pt-1 break-words [overflow-wrap:anywhere]' : 'text-rose-400 font-bold pt-1 break-words [overflow-wrap:anywhere]'}>
                    {isBalanced
                      ? t.balancedSuccessMsg(scaleTestX)
                      : t.unbalancedFailMsg(leftWeight, rightWeight, scaleTestX)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ΔΟΚΙΜΑΣΤΗΡΙΟ ΕΠΑΛΗΘΕΥΣΗΣ ΕΞΙΣΩΣΗΣ & ΕΡΓΑΣΤΗΡΙΟ 2 */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Steppers (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-900 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.coeffLabel)}
                </label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setEqA, -1, -6, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono text-indigo-950">
                    {eqA > 0 ? `＋${eqA}` : eqA}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setEqA, 1, -6, 6, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.constLabel)}
                </label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setEqB, -1, -15, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-white rounded-lg border border-slate-200 font-bold text-xs font-mono text-slate-800">
                    {eqB > 0 ? `＋${eqB}` : eqB}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setEqB, 1, -15, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-700 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.side2Label)}
                </label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setEqC, -1, -25, 25, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-xs font-mono text-amber-950">
                    {eqC > 0 ? `＋${eqC}` : eqC}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setEqC, 1, -25, 25, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sky-700 uppercase block break-words [overflow-wrap:anywhere]">
                  {toCleanUppercase(t.testXLabel)}
                </label>
                <div className="grid grid-cols-[28px_1fr_28px] items-center h-9 w-full gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleStep(setUserX, -1, -15, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    －
                  </button>
                  <div className="h-full flex items-center justify-center bg-sky-50 rounded-lg border border-sky-200 font-bold text-xs font-mono text-sky-950">
                    x ＝ {userX}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleStep(setUserX, 1, -15, 15, e)}
                    className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs text-slate-800"
                  >
                    ＋
                  </button>
                </div>
              </div>
            </div>

            {/* Αναλυτικός Έλεγχος (7 cols) */}
            <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                  {toCleanUppercase(t.verifyTesterTitle)}
                </span>
                <span
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans ${
                    isRootCorrect
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}
                >
                  {toCleanUppercase(isRootCorrect ? t.verifiedStatus : t.notVerifiedStatus)}
                </span>
              </div>

              {/* Εμφάνιση Εξίσωσης */}
              <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-center text-lg sm:text-2xl font-black inline-flex flex-wrap items-center justify-center gap-1 w-full max-w-full break-words [overflow-wrap:anywhere]">
                <span className="text-sky-300">{eqA}x</span>{' '}
                <span className="text-slate-300">{eqB >= 0 ? `＋ ${eqB}` : `－ ${Math.abs(eqB)}`}</span>{' '}
                <span className="text-amber-400">＝</span>{' '}
                <span className="text-emerald-400">{eqC}</span>
              </div>

              {/* Βήματα Υπολογισμού */}
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 text-xs sm:text-sm font-sans space-y-2 text-slate-200 break-words [overflow-wrap:anywhere]">
                <div>
                  <strong>{t.calcSide1Title(userX)}</strong>
                </div>
                <div className="font-mono text-xs sm:text-sm md:text-base text-indigo-200 inline-flex flex-wrap items-center gap-1 leading-relaxed">
                  <span>{t.side1Label} ＝ ({eqA}) · ({userX}) ＋ ({eqB})</span>
                  <span>＝ {eqA * userX} {eqB >= 0 ? `＋ ${eqB}` : `－ ${Math.abs(eqB)}`}</span>
                  <span>＝ <strong>{leftSideVal}</strong></span>
                </div>
                <div className="font-mono text-xs sm:text-sm md:text-base text-amber-300">
                  {t.side2ResultLabel} ＝ <strong>{eqC}</strong>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-xl border text-xs sm:text-sm font-sans font-bold break-words [overflow-wrap:anywhere] ${
                  isRootCorrect
                    ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-400/40 text-rose-300'
                }`}
              >
                {isRootCorrect
                  ? t.verifySuccessMsg(eqC, userX)
                  : t.verifyFailMsg(leftSideVal, eqC, userX)}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
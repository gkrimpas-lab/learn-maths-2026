import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ ΚΑΘΑΡΙΣΜΟΥ & ΤΥΠΟΓΡΑΦΙΑΣ --- //

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Δ')/g);
  return parts
    .map((part) => {
      if (part === "Δ'") return "Δ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function formatNumberLocale(num, locale = 'el') {
  if (num === null || num === undefined || isNaN(num)) return '';
  return num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n --- //
const translations = {
  el: {
    metaTitle: "Η Διαίρεση με Μονοψήφιο Διαιρέτη - Θεωρία | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε τη διαίρεση διψήφιων και τριψήφιων αριθμών με μονοψήφιο διαιρέτη, τέλειες και ατελείς διαιρέσεις και την επαλήθευση.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    exercisesUrl: "/d-dimotikou/5-diairesi-ask",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Η Διαίρεση με Μονοψήφιο Διαιρέτη",
    heroDesc: "Μαθαίνουμε τη διαίρεση διψήφιων και τριψήφιων αριθμών, τους όρους της και πώς κάνουμε επαλήθευση με τον πολλαπλασιασμό!",
    promoReadyTitle: "Έτοιμος για εξάσκηση;",
    promoReadyDesc: "Δοκίμασε τις ασκήσεις στη διαίρεση για να σιγουρευτείς ότι την κατανόησες πλήρως!",
    promoReadyBtn: "Μετάβαση στις Ασκήσεις",
    // Section 1
    sec1Title: "Αναλυτική Θεωρία και Ορισμοί",
    whatIsTitle: "Τι είναι η Διαίρεση;",
    whatIsDesc1: "είναι η πράξη με την οποία",
    whatIsDesc2: "έναν αριθμό σε ίσα μέρη ή βρίσκουμε πόσες φορές χωράει ένας αριθμός μέσα σε έναν άλλο.",
    whatIsBold1: "Διαίρεση",
    whatIsBold2: "μοιράζουμε",
    whatIsNote: "Η διαίρεση είναι η αντίστροφη πράξη του πολλαπλασιασμού!",
    exactVsTitle: "Τέλεια και Ατελής Διαίρεση",
    exactTitle: "Τέλεια Διαίρεση:",
    exactDesc: "Όταν δεν περισσεύει τίποτα, δηλαδή το υπόλοιπο είναι 0 (υ ＝ 0).",
    inexactTitle: "Ατελής Διαίρεση:",
    inexactDesc: "Όταν περισσεύει μονάδα, δηλαδή το υπόλοιπο είναι μεγαλύτερο του μηδενός (υ ＞ 0).",
    termsHeader: "Οι Όροι της Διαίρεσης και η Επαλήθευση",
    termsCardTitle: "1. Τα 4 Στοιχεία της Διαίρεσης:",
    termDividend: "Διαιρετέος (Δ):",
    termDividendDesc: "Ο αριθμός που μοιράζουμε.",
    termDivisor: "Διαιρέτης (δ):",
    termDivisorDesc: "Σε πόσα ίσα μέρη μοιράζουμε.",
    termQuotient: "Πηλίκο (π):",
    termQuotientDesc: "Πόσο παίρνει το κάθε μέρος.",
    termRemainder: "Υπόλοιπο (υ):",
    termRemainderDesc: "Ό,τι περισσεύει (πάντοτε ισχύει υ ＜ δ).",
    checkCardTitle: "2. Τύπος Επαλήθευσης (με Πολλαπλασιασμό):",
    checkCardDesc: "Για να ελέγξουμε αν η διαίρεση είναι σωστή, πολλαπλασιάζουμε τον διαιρέτη με το πηλίκο και προσθέτουμε το υπόλοιπο:",
    checkFormulaNameDividend: "Διαιρετέος",
    checkFormulaNameDivisor: "Διαιρέτης",
    checkFormulaNameQuotient: "Πηλίκο",
    checkFormulaNameRemainder: "Υπόλοιπο",
    checkSymbolic: "Δ ＝ (δ · π) ＋ υ",
    // Section 2
    sec2Title: "Διαδραστικό Εργαστήριο Κάθετης Διαίρεσης",
    sec2Desc: "Άλλαξε τον διαιρετέο και τον διαιρέτη για να παρακολουθήσεις τα βήματα της κάθετης πράξης!",
    twoDigitBtn: "Διψήφιος",
    threeDigitBtn: "Τριψήφιος",
    sliderDividendLabel: "ΔΙΑΙΡΕΤΕΟΣ (Δ)",
    sliderDivisorLabel: "ΔΙΑΙΡΕΤΗΣ (δ)",
    btnDecreaseDividend: "Μείωση διαιρετέου",
    btnIncreaseDividend: "Αύξηση διαιρετέου",
    btnDecreaseDivisor: "Μείωση διαιρέτη",
    btnIncreaseDivisor: "Αύξηση διαιρέτη",
    layoutTitle: "ΣΧΟΛΙΚΗ ΔΙΑΤΑΞΗ ΠΡΑΞΗΣ:",
    remainderLabel: "ΥΠΟΛΟΙΠΟ (υ):",
    legendD: "Δ ＝ Διαιρετεος",
    legendDLower: "δ ＝ Διαιρετης",
    legendQ: "π ＝ Πηλικο",
    verificationTitle: "Επαλήθευση με Πολλαπλασιασμό",
    verificationDesc: "Ελέγχουμε αν η πράξη είναι σωστή εφαρμόζοντας τον τύπο της Ευκλείδειας διαίρεσης:",
    dividendTag: "(Διαιρετέος)",
    exactNote: "Η διαίρεση είναι τέλεια (υ ＝ 0), άρα ο διαιρετέος ισούται ακριβώς με το γινόμενο δ · π.",
    inexactNote: "Η διαίρεση είναι ατελής (υ ＝ {r} ＜ {d}), άρα προσθέτουμε το υπόλοιπο στο γινόμενο.",
    ruleNote: "Κανόνας: Σε κάθε διαίρεση, το υπόλοιπο (υ) είναι πάντοτε αυστηρά μικρότερο από τον διαιρέτη (δ).",
    // Bottom Promo
    bottomPromoTitle: "Ώρα για Εξάσκηση!",
    bottomPromoDesc: "Έμαθες τη διαίρεση και την επαλήθευση; Δοκίμασε τις διαδραστικές ασκήσεις!",
    bottomPromoBtn: "Ξεκίνα τις Ασκήσεις ➔"
  },
  en: {
    metaTitle: "Division by One-Digit Divisor - Theory | LearnMaths.gr",
    metaDesc: "Learn two-digit and three-digit division by single-digit divisors, exact vs inexact divisions, and check solutions step by step.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    exercisesBtn: "Exercises",
    exercisesUrl: "/en/d-dimotikou/5-diairesi-ask",
    badge: "4TH GRADE",
    heroTitle: "Division by One-Digit Divisor",
    heroDesc: "Learn how to divide two-digit and three-digit numbers, study division terms, and verify solutions via multiplication!",
    promoReadyTitle: "Ready for practice?",
    promoReadyDesc: "Try the division practice exercises to make sure you have fully mastered every step!",
    promoReadyBtn: "Go to Exercises",
    // Section 1
    sec1Title: "Detailed Theory and Definitions",
    whatIsTitle: "What is Division?",
    whatIsDesc1: "is the mathematical operation by which we",
    whatIsDesc2: "a quantity into equal parts or find how many times one number fits into another.",
    whatIsBold1: "Division",
    whatIsBold2: "share equally",
    whatIsNote: "Division is the inverse operation of multiplication!",
    exactVsTitle: "Exact and Inexact Division",
    exactTitle: "Exact Division:",
    exactDesc: "When there is no remainder left over, meaning remainder is 0 (r ＝ 0).",
    inexactTitle: "Inexact Division:",
    inexactDesc: "When units are left over, meaning remainder is greater than zero (r ＞ 0).",
    termsHeader: "Terms of Division and Checking",
    termsCardTitle: "1. The 4 Elements of Division:",
    termDividend: "Dividend (D):",
    termDividendDesc: "The number being divided.",
    termDivisor: "Divisor (d):",
    termDivisorDesc: "How many equal parts we divide into.",
    termQuotient: "Quotient (q):",
    termQuotientDesc: "The result each part receives.",
    termRemainder: "Remainder (r):",
    termRemainderDesc: "What remains left over (always r ＜ d).",
    checkCardTitle: "2. Verification Formula (via Multiplication):",
    checkCardDesc: "To verify whether a division is correct, multiply the divisor by the quotient and add the remainder:",
    checkFormulaNameDividend: "Dividend",
    checkFormulaNameDivisor: "Divisor",
    checkFormulaNameQuotient: "Quotient",
    checkFormulaNameRemainder: "Remainder",
    checkSymbolic: "D ＝ (d · q) ＋ r",
    // Section 2
    sec2Title: "Interactive Long Division Lab",
    sec2Desc: "Adjust the dividend and divisor sliders to explore the step-by-step long division layout!",
    twoDigitBtn: "Two-digit",
    threeDigitBtn: "Three-digit",
    sliderDividendLabel: "DIVIDEND (D)",
    sliderDivisorLabel: "DIVISOR (d)",
    btnDecreaseDividend: "Decrease dividend",
    btnIncreaseDividend: "Increase dividend",
    btnDecreaseDivisor: "Decrease divisor",
    btnIncreaseDivisor: "Increase divisor",
    layoutTitle: "STANDARD COLUMN DIVISION LAYOUT:",
    remainderLabel: "REMAINDER (r):",
    legendD: "D ＝ Dividend",
    legendDLower: "d ＝ Divisor",
    legendQ: "q ＝ Quotient",
    verificationTitle: "Verification via Multiplication",
    verificationDesc: "We verify the operation by applying the Euclidean division formula:",
    dividendTag: "(Dividend)",
    exactNote: "The division is exact (r ＝ 0), so the dividend equals exactly d · q.",
    inexactNote: "The division is inexact (r ＝ {r} ＜ {d}), so we add the remainder to the product.",
    ruleNote: "Rule: In every division, the remainder (r) must always be strictly less than the divisor (d).",
    // Bottom Promo
    bottomPromoTitle: "Time to Practice!",
    bottomPromoDesc: "Understood division steps and verification? Try the interactive practice exercises!",
    bottomPromoBtn: "Start Exercises ➔"
  }
};

export default function DiairesiTheoryPage() {
  const router = useRouter();
  const rawLocale = router.locale || router.query.locale;
  const currentLocale = rawLocale === 'en' ? 'en' : 'el';
  const t = translations[currentLocale];

  const [dividend, setDividend] = useState(756);
  const [divisor, setDivisor] = useState(6);

  const D = Math.floor(dividend) || 10;
  const d = Math.floor(divisor) || 2;

  const q = Math.floor(D / d);
  const r = D % d;
  const isExact = r === 0;

  const handleRandomize2Digit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDividend(getRandomInt(24, 98));
    setDivisor(getRandomInt(2, 9));
  };

  const handleRandomize3Digit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDividend(getRandomInt(105, 995));
    setDivisor(getRandomInt(3, 9));
  };

  const updateDividend = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setDividend((prev) => Math.max(10, Math.min(999, prev + delta)));
  };

  const updateDivisor = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setDivisor((prev) => Math.max(2, Math.min(9, prev + delta)));
  };

  const generateSchoolSteps = () => {
    if (D === 0 || d === 0) return [];

    const steps = [];
    const divStr = D.toString();
    let currentVal = 0;

    for (let i = 0; i < divStr.length; i++) {
      const nextDigit = parseInt(divStr[i], 10);
      currentVal = currentVal * 10 + nextDigit;

      if (currentVal >= d || i === divStr.length - 1) {
        const times = Math.floor(currentVal / d);
        const product = times * d;
        const remainder = currentVal - product;

        if (times > 0 || steps.length > 0 || i === divStr.length - 1) {
          steps.push({
            workNum: currentVal,
            product: product,
            remainder: remainder,
            digitIndex: i
          });
        }

        currentVal = remainder;
      }
    }
    return steps;
  };

  const schoolSteps = generateSchoolSteps();
  const divDigits = D.toString().split('');
  const maxDigits = divDigits.length;

  const getPaddedDigits = (num, endIndex) => {
    const numStr = num.toString();
    const digits = new Array(maxDigits).fill('');

    let numIdx = numStr.length - 1;
    for (let i = endIndex; i >= 0 && numIdx >= 0; i--) {
      digits[i] = numStr[numIdx];
      numIdx--;
    }
    return digits;
  };

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl={t.backUrl}
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href={t.exercisesUrl}
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.badge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                : {t.heroTitle}
              </h1>
              <p className="text-purple-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.promoReadyTitle}</h3>
              <p className="text-xs text-purple-100">
                {t.promoReadyDesc}
              </p>
              <Link
                href={t.exercisesUrl}
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 {t.promoReadyBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - SECTION 1 */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> {t.sec1Title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Τι είναι η Διαίρεση */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>🔹</span> {t.whatIsTitle}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>{t.whatIsBold1}</strong> {t.whatIsDesc1} <strong>{t.whatIsBold2}</strong> {t.whatIsDesc2}
              </p>
              <div className="bg-white p-3 rounded-xl border border-indigo-100 text-xs text-indigo-950 font-medium">
                💡 <i>{t.whatIsNote}</i>
              </div>
            </div>

            {/* Τέλεια vs Ατελής */}
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-purple-900 flex items-center gap-2">
                <span>⚖️</span> {t.exactVsTitle}
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>{t.exactTitle}</strong> {t.exactDesc}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>{t.inexactTitle}</strong> {t.inexactDesc}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ΟΡΟΛΟΓΙΑ & ΕΠΑΛΗΘΕΥΣΗ */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
              🏷️ {t.termsHeader}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-purple-700 border-b pb-1">
                  {t.termsCardTitle}
                </h4>
                <ul className="space-y-1.5 text-slate-700 font-mono">
                  <li><strong className="text-indigo-600">{t.termDividend}</strong> {t.termDividendDesc}</li>
                  <li><strong className="text-blue-600">{t.termDivisor}</strong> {t.termDivisorDesc}</li>
                  <li><strong className="text-emerald-600">{t.termQuotient}</strong> {t.termQuotientDesc}</li>
                  <li><strong className="text-amber-600">{t.termRemainder}</strong> {t.termRemainderDesc}</li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-emerald-700 border-b pb-1">
                  {t.checkCardTitle}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t.checkCardDesc}
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200 font-mono font-bold text-slate-900 w-full text-center">
                  <span>{t.checkFormulaNameDividend}</span>
                  <span>＝</span>
                  <span>({t.checkFormulaNameDivisor} · {t.checkFormulaNameQuotient})</span>
                  <span>＋</span>
                  <span>{t.checkFormulaNameRemainder}</span>
                </div>
                <p className="text-[11px] text-center font-mono text-emerald-800 font-bold">
                  {t.checkSymbolic}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> {t.sec2Title}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                {t.sec2Desc}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleRandomize2Digit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-3.5 py-2 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 active:scale-95 touch-manipulation"
              >
                <span>🎲</span> {t.twoDigitBtn}
              </button>
              <button
                type="button"
                onClick={handleRandomize3Digit}
                className="bg-purple-600 hover:bg-purple-700 text-white font-black px-3.5 py-2 rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 active:scale-95 touch-manipulation"
              >
                <span>🎲</span> {t.threeDigitBtn}
              </button>
            </div>
          </div>

          {/* TOUCH SLIDERS ΧΕΙΡΙΣΜΟΥ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
            {/* Slider Διαιρετέου (Δ) */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">{t.sliderDividendLabel}</span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                  {formatNumberLocale(D, currentLocale)}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => updateDividend(e, -10)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="-10"
                  aria-label={t.btnDecreaseDividend}
                >
                  －
                </button>

                <input
                  type="range"
                  min="10"
                  max="999"
                  value={D}
                  onChange={(e) => setDividend(Number(e.target.value))}
                  className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                />

                <button
                  type="button"
                  onClick={(e) => updateDividend(e, 10)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="+10"
                  aria-label={t.btnIncreaseDividend}
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Slider Διαιρέτη (δ) */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">{t.sliderDivisorLabel}</span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-blue-600 text-base">
                  {formatNumberLocale(d, currentLocale)}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  onClick={(e) => updateDivisor(e, -1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="-1"
                  aria-label={t.btnDecreaseDivisor}
                >
                  －
                </button>

                <input
                  type="range"
                  min="2"
                  max="9"
                  value={d}
                  onChange={(e) => setDivisor(Number(e.target.value))}
                  className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                />

                <button
                  type="button"
                  onClick={(e) => updateDivisor(e, 1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="+1"
                  aria-label={t.btnIncreaseDivisor}
                >
                  ＋
                </button>
              </div>
            </div>
          </div>

          {/* ΑΠΟΤΕΛΕΣΜΑΤΑ (ΓΡΑΦΙΚΟ ΚΑΘΕΤΗΣ ΔΙΑΙΡΕΣΗΣ & ΕΠΑΛΗΘΕΥΣΗ) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* ΑΡΙΣΤΕΡΑ: ΓΡΑΦΙΚΟ ΚΑΘΕΤΗΣ ΔΙΑΙΡΕΣΗΣ */}
            <div className="flex flex-col items-center gap-2 w-full max-w-[360px] mx-auto">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                {t.layoutTitle}
              </span>

              <div className="w-full bg-slate-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl border border-slate-800 font-mono text-xl sm:text-2xl font-black relative min-h-[320px] flex py-6 select-none justify-center">
                <div className="flex w-full items-start justify-center">
                  {/* ΑΡΙΣΤΕΡΟ ΜΕΡΟΣ: ΔΙΑΙΡΕΤΕΟΣ & ΚΑΘΕΤΕΣ ΑΦΑΙΡΕΣΕΙΣ */}
                  <div className="flex flex-col items-end pr-3 sm:pr-4 text-right">
                    {/* Αρχικός Διαιρετέος */}
                    <div className="flex justify-end text-blue-400 font-bold mb-2.5 h-8 items-center">
                      <div className="w-5"></div>
                      <div className="flex justify-end">
                        {divDigits.map((char, i) => (
                          <span key={i} className="w-5 text-center">{char}</span>
                        ))}
                      </div>
                    </div>

                    {/* Σώμα Βημάτων */}
                    <div className="flex flex-col items-end space-y-1.5 w-full">
                      {schoolSteps.map((step, idx) => {
                        const productDigits = getPaddedDigits(step.product, step.digitIndex);
                        const remainderDigits = getPaddedDigits(step.remainder, step.digitIndex);

                        return (
                          <div key={idx} className="flex flex-col items-end w-full">
                            {/* Σειρά Αφαίρεσης */}
                            <div className="flex items-center justify-end w-full h-7">
                              <span className="w-5 text-left text-rose-500 font-bold text-base select-none">－</span>
                              <div className="flex justify-end text-rose-400 font-medium">
                                {productDigits.map((char, i) => (
                                  <span key={i} className="w-5 text-center">{char}</span>
                                ))}
                              </div>
                            </div>

                            {/* Οριζόντια Γραμμή Αφαίρεσης */}
                            <div className="w-full flex justify-end h-[2px] my-1">
                              <div className="w-5"></div>
                              <div className="flex justify-end">
                                {productDigits.map((char, i) => (
                                  <div key={i} className={`w-5 h-full ${char !== '' ? 'bg-slate-700' : ''}`} />
                                ))}
                              </div>
                            </div>

                            {/* Σειρά Αποτελέσματος / Επόμενου Αριθμού */}
                            <div className="flex justify-end w-full h-7 items-center">
                              <div className="w-5"></div>
                              <div className="flex justify-end text-slate-200 font-extrabold">
                                {idx === schoolSteps.length - 1 ? (
                                  remainderDigits.map((char, i) => (
                                    <span key={i} className="w-5 text-center">{char}</span>
                                  ))
                                ) : (
                                  getPaddedDigits(schoolSteps[idx + 1].workNum, schoolSteps[idx + 1].digitIndex).map((char, i) => (
                                    <span key={i} className="w-5 text-center">{char}</span>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ΜΕΣΑΙΟ ΜΕΡΟΣ: ΚΑΘΕΤΗ ΓΡΑΜΜΗ ΤΟΥ «Τ» */}
                  <div className="w-[3px] bg-slate-600 self-stretch min-h-[220px]" />

                  {/* ΔΕΞΙ ΜΕΡΟΣ: ΔΙΑΙΡΕΤΗΣ & ΠΗΛΙΚΟ */}
                  <div className="text-left pl-3 sm:pl-4 flex flex-col h-full justify-start">
                    {/* Διαιρέτης */}
                    <div className="text-emerald-400 font-bold border-b-4 border-slate-600 pb-2 tracking-wider flex w-full">
                      {d.toString().split('').map((char, i) => (
                        <span key={i} className="w-5 text-center">{char}</span>
                      ))}
                    </div>

                    {/* Τελικό Πηλίκο */}
                    <div className="text-purple-400 pt-2.5 font-black tracking-wider flex w-full">
                      {q.toString().split('').map((char, i) => (
                        <span key={i} className="w-5 text-center">{char}</span>
                      ))}
                    </div>

                    {/* Ένδειξη Τελικού Υπολοίπου */}
                    <div className="mt-auto pt-8 text-[11px] font-sans font-black uppercase text-amber-400 tracking-wider">
                      {t.remainderLabel} {formatNumberLocale(r, currentLocale)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Επεξηγηματικό Legend */}
              <div className="flex justify-between w-full text-[10px] font-bold text-slate-500 border-t pt-2 uppercase px-1 tracking-tight">
                <span>🔵 {t.legendD}</span>
                <span>🟢 {t.legendDLower}</span>
                <span>🟣 {t.legendQ}</span>
              </div>
            </div>

            {/* ΔΕΞΙΑ: ΑΝΑΛΥΤΙΚΗ ΕΠΑΛΗΘΕΥΣΗ ΜΕ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟ */}
            <div className="bg-emerald-50/80 p-5 sm:p-7 rounded-3xl border border-emerald-200 space-y-4">
              <div className="flex items-center gap-2 border-b border-emerald-200 pb-3">
                <span className="text-2xl">✅</span>
                <h3 className="font-extrabold text-emerald-950 text-base sm:text-lg">
                  {t.verificationTitle}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.verificationDesc}
              </p>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 font-mono text-sm sm:text-base space-y-2 text-center shadow-sm">
                <div className="text-slate-800 font-bold">
                  (<span className="text-blue-600">{formatNumberLocale(d, currentLocale)}</span> · <span className="text-purple-600">{formatNumberLocale(q, currentLocale)}</span>) ＋ <span className="text-amber-600">{formatNumberLocale(r, currentLocale)}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-sans">
                  ＝ {formatNumberLocale(d * q, currentLocale)} ＋ {formatNumberLocale(r, currentLocale)}
                </div>
                <div className="text-xl sm:text-2xl font-black text-indigo-600 border-t pt-2 border-slate-100">
                  ＝ {formatNumberLocale(D, currentLocale)} <span className="text-xs text-slate-500 font-normal font-sans">{t.dividendTag}</span>
                </div>
              </div>

              <div className="inline-flex flex-wrap items-center gap-1 text-xs text-emerald-900 font-medium">
                <span>💡</span>
                <span>
                  {isExact
                    ? t.exactNote
                    : t.inexactNote
                        .replace('{r}', formatNumberLocale(r, currentLocale))
                        .replace('{d}', formatNumberLocale(d, currentLocale))}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 font-bold border-t pt-3 border-emerald-200">
                🔍 {t.ruleNote}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 {t.bottomPromoTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">
              {t.bottomPromoDesc}
            </p>
          </div>
          <Link
            href={t.exercisesUrl}
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.bottomPromoBtn}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
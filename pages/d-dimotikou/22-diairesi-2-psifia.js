// pages/d-dimotikou/22-diairesi-2-psifia.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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

export function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="text-[0.9em] px-1 pb-0.5 border-b border-current font-bold">{num}</span>
      <span className="text-[0.9em] px-1 pt-0.5 font-bold">{den}</span>
    </span>
  );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const translations = {
  el: {
    pageTitle: "Η Διαίρεση με Διψήφιο Διαιρέτη - Θεωρία | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε τον αλγόριθμο της κάθετης διαίρεσης με διψήφιο διαιρέτη, τα βήματα υπολογισμού του πηλίκου και την επαλήθευση με πολλαπλασιασμό.",
    backText: "Δ' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "➗ Η Διαίρεση με Διψήφιο Διαιρέτη (10 - 99)",
    heroDesc: "Μαθαίνουμε τον αναλυτικό αλγόριθμο της κάθετης διαίρεσης όταν ο διαιρέτης είναι διψήφιος, πώς βρίσκουμε το πηλίκο βήμα-βήμα και πώς κάνουμε επαλήθευση!",
    promoCardTitle: "Έτοιμος για εξάσκηση;",
    promoCardDesc: "Δοκίμασε τις ασκήσεις στη διαίρεση με διψήφιο διαιρέτη για να τελειοποιήσεις τις πράξεις σου!",
    promoCardBtn: "🎯 Μετάβαση στις Ασκήσεις",
    theoryTitle: "Αναλυτική Θεωρία & Τα Βήματα της Κάθετης Διαίρεσης",
    step1Badge: "ΒΗΜΑ 1ο",
    step1Title: "Χωρίζουμε Ψηφία",
    step1Desc: "Επειδή ο διαιρέτης είναι διψήφιος, χωρίζουμε 2 ψηφία από τα αριστερά του διαιρετέου. Αν ο αριθμός που σχηματίζεται είναι μικρότερος από τον διαιρέτη, χωρίζουμε 3 ψηφία.",
    step2Badge: "ΒΗΜΑ 2ο",
    step2Title: "Βρίσκουμε το Ψηφίο του Πηλίκου",
    step2Desc: "Εκτιμούμε πόσες φορές χωράει ο διαιρέτης, πολλαπλασιάζουμε, σημειώνουμε το γινόμενο κάτω από τα επιλεγμένα ψηφία και εκτελούμε αφαίρεση.",
    step3Badge: "ΒΗΜΑ 3ο",
    step3Title: "Κατεβάζουμε το Επόμενο Ψηφίο",
    step3Desc: "Κατεβάζουμε το επόμενο ψηφίο δίπλα στο υπόλοιπο και επαναλαμβάνουμε την ίδια διαδικασία μέχρι να χρησιμοποιηθούν όλα τα ψηφία του διαιρετέου.",
    termsTitle: "🏷️ Οι Όροι της Διαίρεσης και η Μαθηματική Επαλήθευση",
    termsSubtitle1: "1. Τα 4 θεμελιώδη στοιχεία:",
    termDividend: "Διαιρετέος (Δ):",
    termDividendDesc: "Ο αριθμός που μοιράζεται σε ίσα μέρη.",
    termDivisor: "Διαιρέτης (δ):",
    termDivisorDesc: "Ο αριθμός των ίσων μερών (διψήφιος 10 - 99).",
    termQuotient: "Πηλίκο (π):",
    termQuotientDesc: "Το αποτέλεσμα της διαίρεσης.",
    termRemainder: "Υπόλοιπο (υ):",
    termRemainderDesc: "Το μέρος που περισσεύει (ισχύει πάντοτε υ ＜ δ).",
    termsSubtitle2: "2. Τύπος Επαλήθευσης Ευκλείδειας Διαίρεσης:",
    verificationFormulaDesc: "Για να ελέγξουμε αν η διαίρεση εκτελέστηκε σωστά, εφαρμόζουμε τον τύπο:",
    verificationFormulaWords: "Διαιρετέος ＝ (Διαιρέτης · Πηλίκο) ＋ Υπόλοιπο",
    verificationFormulaSymbols: "Δ ＝ (δ · π) ＋ υ",
    labTitle: "Διαδραστικό Εργαστήριο Διαίρεσης με Διψήφιο",
    labDesc: "Άλλαξε τους αριθμούς για να παρατηρήσεις ζωντανά την κάθετη πράξη και την επαλήθευσή της!",
    btn3Digit: "🎲 3ψήφιος ÷ 2ψήφιο",
    btn4Digit: "🎲 4ψήφιος ÷ 2ψήφιο",
    btnExact: "✨ Τέλεια Διαίρεση",
    labelDividend: "ΔΙΑΙΡΕΤΕΟΣ (Δ: 100 - 9.999)",
    labelDivisor: "ΔΙΑΙΡΕΤΗΣ (δ: 10 - 99)",
    decrease1AriaDividend: "Μείωση Διαιρετέου κατά 1",
    increase1AriaDividend: "Αύξηση Διαιρετέου κατά 1",
    decrease1AriaDivisor: "Μείωση Διαιρέτη",
    increase1AriaDivisor: "Αύξηση Διαιρέτη",
    stepByStepTitle: "ΠΛΗΡΗΣ ΑΝΑΛΥΣΗ ΚΑΘΕΤΗΣ ΠΡΑΞΗΣ:",
    exactIndicator: "✨ Τέλεια (υ ＝ 0)",
    remainderIndicator: "🏁 Υπόλοιπο:",
    legendD: "🔵 Δ: Διαιρετέος",
    legendDiv: "🟢 δ: Διαιρέτης",
    legendQ: "🟣 π: Πηλίκο",
    verificationHeader: "Επαλήθευση με Πολλαπλασιασμό",
    verificationIntro: "Εφαρμόζουμε τον τύπο της ευκλείδειας διαίρεσης για να αποδείξουμε ότι ο πολλαπλασιασμός είναι η αντίστροφη πράξη:",
    dividendWord: "(Διαιρετέος)",
    verificationSummary: "💡 Πολλαπλασιάσαμε τον διψήφιο διαιρέτη με το πηλίκο, προσθέσαμε το υπόλοιπο και προέκυψε ακριβώς ο αρχικός διαιρετέος!",
    remainderRule: (r, d) => `🔍 Βασικός κανόνας: Το υπόλοιπο (${r}) είναι πάντοτε αυστηρά μικρότερο από τον διαιρέτη (${d}).`,
    ctaTitle: "📝 Ώρα για Εξάσκηση!",
    ctaDesc: "Έμαθες τη διαίρεση με διψήφιο διαιρέτη και την επαλήθευση; Δοκίμασε τις διαδραστικές ασκήσεις!",
    ctaBtn: "Ξεκίνα τις Ασκήσεις ➔",
    footerPrompt: "Ολοκλήρωσες τη θεωρία;",
    footerBtn: "Μετάβαση στις Ασκήσεις 🎯"
  },
  en: {
    pageTitle: "Division with 2-Digit Divisor - Theory | LearnMaths.gr",
    pageDesc: "Learn long division with a 2-digit divisor, step-by-step quotient calculation, and verification via multiplication.",
    backText: "Grade 4",
    exercisesBtn: "Exercises",
    gradeBadge: "GRADE 4",
    heroTitle: "➗ Division with 2-Digit Divisor (10 - 99)",
    heroDesc: "Learn the complete long division algorithm when the divisor has 2 digits, how to find the quotient step by step, and how to verify your results!",
    promoCardTitle: "Ready for practice?",
    promoCardDesc: "Try the exercises on 2-digit long division to master your division skills!",
    promoCardBtn: "🎯 Go to Exercises",
    theoryTitle: "Detailed Theory & Steps of Long Division",
    step1Badge: "STEP 1",
    step1Title: "Select Digits",
    step1Desc: "Because the divisor is 2-digit, take the first 2 digits from the left of the dividend. If this number is smaller than the divisor, take 3 digits.",
    step2Badge: "STEP 2",
    step2Title: "Determine the Quotient Digit",
    step2Desc: "Estimate how many times the divisor fits, multiply, record the product below the selected digits, and subtract.",
    step3Badge: "STEP 3",
    step3Title: "Bring Down the Next Digit",
    step3Desc: "Bring down the next digit next to the remainder and repeat the exact same procedure until all digits of the dividend are processed.",
    termsTitle: "🏷️ Division Terms & Mathematical Verification",
    termsSubtitle1: "1. The 4 Fundamental Elements:",
    termDividend: "Dividend (D):",
    termDividendDesc: "The number being split into equal parts.",
    termDivisor: "Divisor (d):",
    termDivisorDesc: "The number of equal parts (2-digit 10 - 99).",
    termQuotient: "Quotient (q):",
    termQuotientDesc: "The result of the division.",
    termRemainder: "Remainder (r):",
    termRemainderDesc: "The remaining amount left over (always r ＜ d).",
    termsSubtitle2: "2. Euclidean Division Verification Formula:",
    verificationFormulaDesc: "To verify whether the division is performed accurately, apply the formula:",
    verificationFormulaWords: "Dividend ＝ (Divisor · Quotient) ＋ Remainder",
    verificationFormulaSymbols: "D ＝ (d · q) ＋ r",
    labTitle: "Interactive 2-Digit Division Lab",
    labDesc: "Change the numbers to watch the long division process and its verification update live!",
    btn3Digit: "🎲 3-Digit ÷ 2-Digit",
    btn4Digit: "🎲 4-Digit ÷ 2-Digit",
    btnExact: "✨ Exact Division",
    labelDividend: "DIVIDEND (D: 100 - 9,999)",
    labelDivisor: "DIVISOR (d: 10 - 99)",
    decrease1AriaDividend: "Decrease Dividend by 1",
    increase1AriaDividend: "Increase Dividend by 1",
    decrease1AriaDivisor: "Decrease Divisor",
    increase1AriaDivisor: "Increase Divisor",
    stepByStepTitle: "STEP-BY-STEP VERTICAL WORK:",
    exactIndicator: "✨ Exact (r ＝ 0)",
    remainderIndicator: "🏁 Remainder:",
    legendD: "🔵 D: Dividend",
    legendDiv: "🟢 d: Divisor",
    legendQ: "🟣 q: Quotient",
    verificationHeader: "Multiplication Verification",
    verificationIntro: "We apply the Euclidean division formula to show that multiplication is the inverse operation:",
    dividendWord: "(Dividend)",
    verificationSummary: "💡 We multiplied the 2-digit divisor by the quotient, added the remainder, and reached the exact starting dividend!",
    remainderRule: (r, d) => `🔍 Core rule: The remainder (${r}) is always strictly less than the divisor (${d}).`,
    ctaTitle: "📝 Practice Time!",
    ctaDesc: "Mastered 2-digit division and verification? Test your knowledge with interactive exercises!",
    ctaBtn: "Start Exercises ➔",
    footerPrompt: "Finished reviewing the theory?",
    footerBtn: "Go to Exercises 🎯"
  }
};

export default function Diairesi2PsifiaPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const formatNumber = (num) => {
    if (num === '' || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
  };

  const [dividend, setDividend] = useState(1568);
  const [divisor, setDivisor] = useState(24);

  const D = typeof dividend === 'number' ? dividend : 0;
  const d = typeof divisor === 'number' && divisor >= 10 ? divisor : 10;

  const q = Math.floor(D / d);
  const r = D % d;
  const isExact = r === 0;

  const handleRandomize3Digit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDividend(getRandomInt(120, 999));
    setDivisor(getRandomInt(11, 45));
  };

  const handleRandomize4Digit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDividend(getRandomInt(1050, 9990));
    setDivisor(getRandomInt(12, 85));
  };

  const handleRandomizeExact = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const randomDivisor = getRandomInt(12, 65);
    const randomQuotient = getRandomInt(15, 120);
    setDivisor(randomDivisor);
    setDividend(randomDivisor * randomQuotient);
  };

  const updateDividend = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setDividend((prev) => Math.max(100, Math.min(9999, (Number(prev) || 100) + delta)));
  };

  const updateDivisor = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setDivisor((prev) => Math.max(10, Math.min(99, (Number(prev) || 10) + delta)));
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
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/22-diairesi-2-psifia-ask"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
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
                {toCleanUppercase(t.gradeBadge)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-purple-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">{t.promoCardTitle}</h3>
              <p className="text-xs text-purple-100">
                {t.promoCardDesc}
              </p>
              <Link
                href="/d-dimotikou/22-diairesi-2-psifia-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                {t.promoCardBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - SECTION 1 */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> {t.theoryTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Χωρίζουμε ψηφία */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3 shadow-sm">
              <div className="bg-indigo-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.step1Badge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-indigo-900">
                {t.step1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            {/* 2. Εκτίμηση & Πολλαπλασιασμός */}
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-100 space-y-3 shadow-sm">
              <div className="bg-purple-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.step2Badge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-purple-900">
                {t.step2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            {/* 3. Κατέβασμα & Επανάληψη */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3 shadow-sm">
              <div className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.step3Badge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-900">
                {t.step3Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
          </div>

          {/* ΟΡΟΛΟΓΙΑ & ΕΠΑΛΗΘΕΥΣΗ */}
          <div className="bg-slate-50 p-5 sm:p-7 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {t.termsTitle}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <h4 className="font-bold text-purple-900 border-b border-slate-100 pb-1.5">
                  {t.termsSubtitle1}
                </h4>
                <ul className="space-y-1.5 font-mono text-slate-700">
                  <li>
                    <strong className="text-indigo-600">{t.termDividend}</strong> {t.termDividendDesc}
                  </li>
                  <li>
                    <strong className="text-blue-600">{t.termDivisor}</strong> {t.termDivisorDesc}
                  </li>
                  <li>
                    <strong className="text-emerald-600">{t.termQuotient}</strong> {t.termQuotientDesc}
                  </li>
                  <li>
                    <strong className="text-amber-600">{t.termRemainder}</strong> {t.termRemainderDesc}
                  </li>
                </ul>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                <h4 className="font-bold text-emerald-900 border-b border-slate-100 pb-1.5">
                  {t.termsSubtitle2}
                </h4>
                <p className="text-slate-600 text-xs">
                  {t.verificationFormulaDesc}
                </p>
                <div className="font-mono font-black text-slate-800 bg-emerald-50 p-3 rounded-xl text-center text-sm sm:text-base border border-emerald-200/80">
                  {t.verificationFormulaWords}
                  <span className="block text-xs font-bold text-emerald-800 mt-1">
                    {t.verificationFormulaSymbols}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> {t.labTitle}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                {t.labDesc}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
              <button
                onClick={handleRandomize3Digit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-3.5 py-2 rounded-xl text-xs transition active:scale-95 shadow-sm touch-manipulation"
              >
                {t.btn3Digit}
              </button>
              <button
                onClick={handleRandomize4Digit}
                className="bg-purple-600 hover:bg-purple-700 text-white font-black px-3.5 py-2 rounded-xl text-xs transition active:scale-95 shadow-sm touch-manipulation"
              >
                {t.btn4Digit}
              </button>
              <button
                onClick={handleRandomizeExact}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3.5 py-2 rounded-xl text-xs transition active:scale-95 shadow-sm touch-manipulation"
              >
                {t.btnExact}
              </button>
            </div>
          </div>

          {/* ΠΕΔΙΑ ΕΙΣΑΓΩΓΗΣ & TOUCH CONTROLS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
            {/* Διαιρετέος (Δ) */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-[11px] font-black uppercase text-slate-500">
                  {toCleanUppercase(t.labelDividend)}
                </span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                  {formatNumber(D)}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  onClick={(e) => updateDividend(e, -1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                  title={t.decrease1AriaDividend}
                  aria-label={t.decrease1AriaDividend}
                >
                  －
                </button>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  autoComplete="off"
                  id="calc-dividend"
                  name="calc-dividend"
                  value={dividend}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                    setDividend(digits === '' ? '' : Number(digits));
                  }}
                  onBlur={() => {
                    if (!dividend || dividend < 10) setDividend(100);
                  }}
                  className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="1568"
                />

                <button
                  onClick={(e) => updateDividend(e, 1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                  title={t.increase1AriaDividend}
                  aria-label={t.increase1AriaDividend}
                >
                  ＋
                </button>
              </div>

              {/* Βοηθητικά κουμπιά δεκάδων & εκατοντάδων */}
              <div className="flex justify-center gap-1.5 pt-0.5">
                <button
                  onClick={(e) => updateDividend(e, -100)}
                  className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                >
                  －100
                </button>
                <button
                  onClick={(e) => updateDividend(e, -10)}
                  className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                >
                  －10
                </button>
                <button
                  onClick={(e) => updateDividend(e, 10)}
                  className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                >
                  ＋10
                </button>
                <button
                  onClick={(e) => updateDividend(e, 100)}
                  className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                >
                  ＋100
                </button>
              </div>
            </div>

            {/* Διαιρέτης (δ) */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-[11px] font-black uppercase text-slate-500">
                  {toCleanUppercase(t.labelDivisor)}
                </span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-blue-600 text-base">
                  {formatNumber(d)}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  onClick={(e) => updateDivisor(e, -1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                  title={t.decrease1AriaDivisor}
                  aria-label={t.decrease1AriaDivisor}
                >
                  －
                </button>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  autoComplete="off"
                  id="calc-divisor"
                  name="calc-divisor"
                  value={divisor}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                    setDivisor(digits === '' ? '' : Number(digits));
                  }}
                  onBlur={() => {
                    if (!divisor || divisor < 10) setDivisor(10);
                  }}
                  className="w-full min-w-0 max-w-full text-center font-mono font-black text-base sm:text-lg text-slate-800 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="24"
                />

                <button
                  onClick={(e) => updateDivisor(e, 1)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation shadow-sm"
                  title={t.increase1AriaDivisor}
                  aria-label={t.increase1AriaDivisor}
                >
                  ＋
                </button>
              </div>

              {/* Βοηθητικά κουμπιά δεκάδων για τον διαιρέτη */}
              <div className="flex justify-center gap-1.5 pt-0.5">
                <button
                  onClick={(e) => updateDivisor(e, -10)}
                  className="px-2.5 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                >
                  －10
                </button>
                <button
                  onClick={(e) => updateDivisor(e, 10)}
                  className="px-2.5 py-0.5 text-[10px] font-black rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 touch-manipulation"
                >
                  ＋10
                </button>
              </div>
            </div>
          </div>

          {/* ΑΠΟΤΕΛΕΣΜΑΤΑ (ΓΡΑΦΙΚΟ ΚΑΘΕΤΗΣ ΔΙΑΙΡΕΣΗΣ & ΕΠΑΛΗΘΕΥΣΗ) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* ΑΡΙΣΤΕΡΑ: ΓΡΑΦΙΚΟ ΚΑΘΕΤΗΣ ΔΙΑΙΡΕΣΗΣ */}
            <div className="flex flex-col items-center gap-2 w-full max-w-[420px] mx-auto">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
                {toCleanUppercase(t.stepByStepTitle)}
              </span>

              <div className="w-full bg-slate-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl border-4 border-slate-800 font-mono text-lg sm:text-xl font-black relative min-h-[320px] flex py-6 select-none justify-center">
                <div className="flex w-full items-start justify-center">
                  {/* ΑΡΙΣΤΕΡΟ ΜΕΡΟΣ: ΔΙΑΙΡΕΤΕΟΣ & ΑΦΑΙΡΕΣΕΙΣ */}
                  <div className="flex flex-col items-end pr-3.5 text-right">
                    {/* Αρχικός Διαιρετέος */}
                    <div className="flex justify-end text-blue-400 font-bold mb-2.5 h-7 items-center">
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
                            <div className="flex items-center justify-end w-full h-6">
                              <span className="w-5 text-left text-rose-500 font-bold text-sm select-none">－</span>
                              <div className="flex justify-end text-rose-400 font-semibold">
                                {productDigits.map((char, i) => (
                                  <span key={i} className="w-5 text-center">{char}</span>
                                ))}
                              </div>
                            </div>

                            {/* Οριζόντια Γραμμή Αφαίρεσης */}
                            <div className="w-full flex justify-end h-[2px] my-0.5">
                              <div className="w-5"></div>
                              <div className="flex justify-end">
                                {productDigits.map((char, i) => (
                                  <div key={i} className={`w-5 h-full ${char !== '' ? 'bg-slate-700' : ''}`}></div>
                                ))}
                              </div>
                            </div>

                            {/* Σειρά Αποτελέσματος / Επόμενου Αριθμού */}
                            <div className="flex justify-end w-full h-6 items-center">
                              <div className="w-5"></div>
                              <div className="flex justify-end text-slate-300 font-black">
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
                  <div className="w-[3px] bg-slate-700 self-stretch min-h-[220px]"></div>

                  {/* ΔΕΞΙ ΜΕΡΟΣ: ΔΙΑΙΡΕΤΗΣ & ΠΗΛΙΚΟ */}
                  <div className="text-left pl-3.5 flex flex-col h-full justify-start">
                    {/* Διψήφιος Διαιρέτης */}
                    <div className="text-emerald-400 font-bold border-b-2 border-slate-700 pb-1.5 tracking-wider flex w-full">
                      {d.toString().split('').map((char, i) => (
                        <span key={i} className="w-5 text-center">{char}</span>
                      ))}
                    </div>

                    {/* Τελικό Πηλίκο */}
                    <div className="text-purple-400 pt-2 font-black tracking-wider flex w-full">
                      {q.toString().split('').map((char, i) => (
                        <span key={i} className="w-5 text-center">{char}</span>
                      ))}
                    </div>

                    {/* Ένδειξη Τελικού Υπολοίπου */}
                    <div className={`mt-auto pt-8 text-[11px] font-sans font-black uppercase tracking-wider ${isExact ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isExact ? t.exactIndicator : `${t.remainderIndicator} ${r}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between w-full text-[10px] font-bold text-slate-400 border-t border-slate-200 pt-2 uppercase px-1 tracking-tight">
                <span>{t.legendD}</span>
                <span>{t.legendDiv}</span>
                <span>{t.legendQ}</span>
              </div>
            </div>

            {/* ΔΕΞΙΑ: ΑΝΑΛΥΤΙΚΗ ΕΠΑΛΗΘΕΥΣΗ ΜΕ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟ */}
            <div className="bg-emerald-50/70 p-5 sm:p-7 rounded-3xl border border-emerald-200/80 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-emerald-200/80 pb-3">
                <span className="text-2xl">✅</span>
                <h3 className="font-extrabold text-emerald-950 text-base sm:text-lg">
                  {t.verificationHeader}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.verificationIntro}
              </p>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 font-mono text-base sm:text-lg space-y-2 text-center shadow-sm">
                <div className="text-slate-800 font-bold">
                  (<span className="text-blue-600">{formatNumber(d)}</span> · <span className="text-purple-600">{formatNumber(q)}</span>) ＋ <span className="text-amber-600">{formatNumber(r)}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-sans">
                  ＝ {formatNumber(d * q)} ＋ {formatNumber(r)}
                </div>
                <div className="text-xl sm:text-2xl font-black text-indigo-700 border-t pt-2 border-slate-100">
                  ＝ {formatNumber(D)} <span className="text-xs text-slate-500 font-bold font-sans">{t.dividendWord}</span>
                </div>
              </div>

              <p className="text-xs text-emerald-900 font-semibold leading-relaxed">
                {t.verificationSummary}
              </p>

              <div className="text-xs text-slate-600 font-bold border-t pt-3 border-emerald-200/80">
                {t.remainderRule(formatNumber(r), formatNumber(d))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">{t.ctaTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">
              {t.ctaDesc}
            </p>
          </div>
          <Link
            href="/d-dimotikou/22-diairesi-2-psifia-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.ctaBtn}
          </Link>
        </div>
      </div>

      {/* ΣΤΑΘΕΡΟ BOTTOM FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 sm:py-4">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-slate-300 font-medium truncate">
            {t.footerPrompt}
          </div>
          <Link
            href="/d-dimotikou/22-diairesi-2-psifia-ask"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-sm transition shadow-lg shrink-0"
          >
            {t.footerBtn}
          </Link>
        </div>
      </footer>
    </Layout>
  );
}
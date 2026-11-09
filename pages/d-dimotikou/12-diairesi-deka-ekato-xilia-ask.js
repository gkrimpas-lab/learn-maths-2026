// pages/d-dimotikou/12-diairesi-deka-ekato-xilia-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Συνάρτηση μετατροπής σε άτονα ελληνικά κεφαλαία με εξαίρεση το "Δ'"
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

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumberByLocale(num, isEn) {
  if (num === null || num === undefined || isNaN(num)) return '';
  return Number(num).toLocaleString(isEn ? 'en-US' : 'el-GR');
}

// Συγκεντρωτικό λεξικό μεταφράσεων i18n
const TRANSLATIONS = {
  el: {
    metaTitle: "Ασκήσεις: Διαίρεση & Πολλαπλασιασμός με 10, 100, 1.000 | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού: μετακίνηση υποδιαστολής στη διαίρεση και τον πολλαπλασιασμό με 10, 100 και 1.000, εύρεση άγνωστου τελεστή και σύγκριση.",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "📝 Ασκήσεις: Μετακίνηση Υποδιαστολής (10, 100, 1.000)",
    heroDesc: "Πατώντας «Νέες Ασκήσεις», οι αριθμοί και οι πράξεις ανανεώνονται αυτόματα από τη δεξαμενή!",
    newExercisesBtn: "🔄 Νέες Ασκήσεις",
    checkAnswersBtn: "🎯 Έλεγχος Απαντήσεων",
    placeholderResult: "Αποτέλεσμα",
    divPrompt: "Υπολόγισε το αποτέλεσμα της διαίρεσης:",
    mulPrompt: "Υπολόγισε το γινόμενο:",
    missingFactorPrompt: "Ποιος αριθμός λείπει από την ισότητα;",
    comparePrompt: "Επίλεξε το κατάλληλο σύμβολο σύγκρισης ( ＜ , ＝ , ＞ ):",
    correctAnswerIs: "Το ορθό αποτέλεσμα είναι",
    missingNumberIs: "Ο αριθμός που λείπει είναι το",
    correctRelationIs: "Η σωστή σχέση είναι",
    scoreLabel: "🏆 Σκορ:",
    successRate: "Επιτυχία:",
    footerPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    shift1Pos: "1 θέση",
    shift2Pos: "2 θέσεις",
    shift3Pos: "3 θέσεις",
    explainDiv: (factorFormatted, shift, numFormatted, correctFormatted) =>
      `Στη διαίρεση με το ${factorFormatted}, η υποδιαστολή μετακινείται ${shift} αριστερά: ${numFormatted} : ${factorFormatted} ＝ ${correctFormatted}.`,
    explainMul: (factorFormatted, shift, numStr, correctFormatted) =>
      `Στον πολλαπλασιασμό με το ${factorFormatted}, η υποδιαστολή μετακινείται ${shift} δεξιά: ${numStr} · ${factorFormatted} ＝ ${correctFormatted}.`,
    explainMissingFactor: (shift, correctText) =>
      `Η υποδιαστολή μετακινήθηκε ${shift} αριστερά, άρα ο αριθμός διαιρέθηκε με το ${correctText}.`,
    explainComparison: (exprA, cleanValA, exprB, cleanValB, sym) =>
      `Υπολογίζοντας τις εκφράσεις: ${exprA} ＝ ${cleanValA} και ${exprB} ＝ ${cleanValB}, επομένως ισχύει ${exprA} ${sym} ${exprB}.`
  },
  en: {
    metaTitle: "Exercises: Division & Multiplication by 10, 100, 1,000 | LearnMaths.gr",
    metaDesc: "Interactive 4th-grade math exercises on moving the decimal point in multiplication and division by 10, 100, and 1,000, finding missing divisors, and comparisons.",
    backText: "Grade 4",
    theoryBtn: "Theory",
    gradeBadge: "GRADE 4 • PRACTICE",
    heroTitle: "📝 Exercises: Moving the Decimal Point (10, 100, 1,000)",
    heroDesc: "By clicking \"New Exercises\", values and operations regenerate dynamically from the pool!",
    newExercisesBtn: "🔄 New Exercises",
    checkAnswersBtn: "🎯 Check Answers",
    placeholderResult: "Result",
    divPrompt: "Calculate the result of the division:",
    mulPrompt: "Calculate the product:",
    missingFactorPrompt: "Which number is missing from the equation?",
    comparePrompt: "Select the appropriate comparison symbol ( ＜ , ＝ , ＞ ):",
    correctAnswerIs: "The correct result is",
    missingNumberIs: "The missing number is",
    correctRelationIs: "The correct relation is",
    scoreLabel: "🏆 Score:",
    successRate: "Score:",
    footerPrompt: "Fill in your answers and click \"Check Answers\"!",
    shift1Pos: "1 place",
    shift2Pos: "2 places",
    shift3Pos: "3 places",
    explainDiv: (factorFormatted, shift, numFormatted, correctFormatted) =>
      `In division by ${factorFormatted}, the decimal point shifts ${shift} to the left: ${numFormatted} : ${factorFormatted} ＝ ${correctFormatted}.`,
    explainMul: (factorFormatted, shift, numStr, correctFormatted) =>
      `In multiplication by ${factorFormatted}, the decimal point shifts ${shift} to the right: ${numStr} · ${factorFormatted} ＝ ${correctFormatted}.`,
    explainMissingFactor: (shift, correctText) =>
      `The decimal point shifted ${shift} to the left, so the number was divided by ${correctText}.`,
    explainComparison: (exprA, cleanValA, exprB, cleanValB, sym) =>
      `Evaluating the expressions: ${exprA} ＝ ${cleanValA} and ${exprB} ＝ ${cleanValB}, therefore ${exprA} ${sym} ${exprB}.`
  }
};

// 1. Άσκηση: Διαίρεση με 10, 100, 1.000 (Input)
function makeDivisionQuestion(prevQuestion = null) {
  const factors = [10, 100, 1000];
  let factor, num, val;

  while (true) {
    factor = factors[getRandomInt(0, 2)];
    const endingZeros = getRandomInt(0, 2);
    num = getRandomInt(2, 95) * Math.pow(10, endingZeros);
    val = num / factor;

    if (!prevQuestion || prevQuestion.num !== num || prevQuestion.factor !== factor) {
      break;
    }
  }

  return {
    num,
    factor,
    numericVal: val
  };
}

// 2. Άσκηση: Πολλαπλασιασμός Δεκαδικού με 10, 100, 1.000 (Input)
function makeMultiplicationQuestion(prevQuestion = null) {
  const factors = [10, 100, 1000];
  let factor, decNum, val;

  while (true) {
    factor = factors[getRandomInt(0, 2)];
    decNum = getRandomInt(1, 99) / 10;
    val = decNum * factor;

    if (!prevQuestion || prevQuestion.decNum !== decNum || prevQuestion.factor !== factor) {
      break;
    }
  }

  return {
    decNum,
    factor,
    numericVal: val
  };
}

// 3. Άσκηση: Εύρεση Άγνωστου Τελεστή :10, :100, :1.000 (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeMissingFactorQuestion(prevQuestion = null) {
  const factors = [10, 100, 1000];
  let factor, num, res;

  while (true) {
    factor = factors[getRandomInt(0, 2)];
    num = getRandomInt(2, 85) * (factor >= 100 ? 10 : 1);
    res = num / factor;

    if (!prevQuestion || prevQuestion.num !== num || prevQuestion.factor !== factor) {
      break;
    }
  }

  const allFactors = [10, 100, 1000, 10000];
  const wrongFactors = allFactors.filter((f) => f !== factor);
  const shuffledFactors = [...new Set([factor, ...wrongFactors])].sort(() => Math.random() - 0.5);

  return {
    num,
    factor,
    numericRes: res,
    options: shuffledFactors
  };
}

// 4. Άσκηση: Σύγκριση Εκφράσεων (＜, ＝, ＞)
function makeComparisonQuestion(prevQuestion = null) {
  let isMulA, factorA, baseA, valA;
  let isMulB, factorB, baseB, valB;
  let correctSym;

  while (true) {
    isMulA = Math.random() > 0.5;
    factorA = [10, 100][getRandomInt(0, 1)];
    baseA = getRandomInt(2, 45);
    valA = isMulA ? baseA * factorA : baseA / factorA;

    isMulB = Math.random() > 0.5;
    factorB = [10, 100][getRandomInt(0, 1)];
    baseB = getRandomInt(2, 45);

    if (Math.random() > 0.65) {
      valB = valA;
      baseB = isMulB ? valB / factorB : valB * factorB;
    } else {
      valB = isMulB ? baseB * factorB : baseB / factorB;
    }

    correctSym = '＝';
    if (valA > valB) correctSym = '＞';
    if (valA < valB) correctSym = '＜';

    if (
      !prevQuestion ||
      prevQuestion.baseA !== baseA ||
      prevQuestion.factorA !== factorA ||
      prevQuestion.baseB !== baseB ||
      prevQuestion.factorB !== factorB
    ) {
      break;
    }
  }

  return {
    isMulA,
    factorA,
    baseA,
    valA,
    isMulB,
    factorB,
    baseB,
    valB,
    correct: correctSym
  };
}

// Δημιουργία των 8 Ερωτήσεων
function generateQuestions() {
  const q1 = makeDivisionQuestion();
  const q2 = makeDivisionQuestion(q1);

  const q3 = makeMultiplicationQuestion();
  const q4 = makeMultiplicationQuestion(q3);

  const q5 = makeMissingFactorQuestion();
  const q6 = makeMissingFactorQuestion(q5);

  const q7 = makeComparisonQuestion();
  const q8 = makeComparisonQuestion(q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function Diairesi101001000AskPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];
  const isEn = locale === 'en';

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions());
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, []);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleDecimalInput = (key, rawVal) => {
    if (submitted) return;
    const clean = isEn
      ? rawVal.replace(/[^0-9.]/g, '').slice(0, 10)
      : rawVal.replace(/\./g, ',').replace(/[^0-9,]/g, '').slice(0, 10);
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const checkDecimalEqual = (userStr, targetNumeric) => {
    if (!userStr) return false;
    const parsed = parseFloat(userStr.replace(',', '.'));
    if (isNaN(parsed)) return false;
    return Math.abs(parsed - targetNumeric) <= 0.05;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    if (checkDecimalEqual(answers.q1, questions.q1.numericVal)) currentScore += 1;
    if (checkDecimalEqual(answers.q2, questions.q2.numericVal)) currentScore += 1;
    if (checkDecimalEqual(answers.q3, questions.q3.numericVal)) currentScore += 1;
    if (checkDecimalEqual(answers.q4, questions.q4.numericVal)) currentScore += 1;
    if (parseInt(answers.q5, 10) === questions.q5.factor) currentScore += 1;
    if (parseInt(answers.q6, 10) === questions.q6.factor) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Helper για λεκτικό θέσεων
  const getShiftText = (factor) => {
    if (factor === 10) return t.shift1Pos;
    if (factor === 100) return t.shift2Pos;
    return t.shift3Pos;
  };

  // Render Q1 & Q2: Διαίρεση (Input)
  const renderDivision = (qKey, qData, numLabel) => {
    const isCorrect = checkDecimalEqual(answers[qKey], qData.numericVal);
    const numFormatted = formatNumberByLocale(qData.num, isEn);
    const factorFormatted = formatNumberByLocale(qData.factor, isEn);
    const correctFormatted = formatNumberByLocale(Number(qData.numericVal.toFixed(3)), isEn);
    const shiftText = getShiftText(qData.factor);
    const explainText = t.explainDiv(factorFormatted, shiftText, numFormatted, correctFormatted);

    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-rose-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.divPrompt} <span className="text-rose-600 font-mono font-black text-lg sm:text-xl">{numFormatted} : {factorFormatted} ＝ ?</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{numFormatted}</span>
            <span>:</span>
            <span>{factorFormatted}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.placeholderResult}
              maxLength={10}
              value={answers[qKey]}
              onChange={(e) => handleDecimalInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-rose-900 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctAnswerIs} <span className="font-mono font-bold text-rose-900">{correctFormatted}</span>. {explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Πολλαπλασιασμός (Input)
  const renderMultiplication = (qKey, qData, numLabel) => {
    const isCorrect = checkDecimalEqual(answers[qKey], qData.numericVal);
    const numStr = formatNumberByLocale(Number(qData.decNum.toFixed(1)), isEn);
    const factorFormatted = formatNumberByLocale(qData.factor, isEn);
    const correctFormatted = formatNumberByLocale(Number(qData.numericVal.toFixed(2)), isEn);
    const shiftText = getShiftText(qData.factor);
    const explainText = t.explainMul(factorFormatted, shiftText, numStr, correctFormatted);

    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-emerald-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.mulPrompt} <span className="text-emerald-600 font-mono font-black text-lg sm:text-xl">{numStr} · {factorFormatted} ＝ ?</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{numStr}</span>
            <span>·</span>
            <span>{factorFormatted}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.placeholderResult}
              maxLength={10}
              value={answers[qKey]}
              onChange={(e) => handleDecimalInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-emerald-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctAnswerIs} <span className="font-mono font-bold text-rose-900">{correctFormatted}</span>. {explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Άγνωστος Τελεστής (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
  const renderMissingFactor = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.factor;
    const numFormatted = formatNumberByLocale(qData.num, isEn);
    const resFormatted = formatNumberByLocale(Number(qData.numericRes.toFixed(3)), isEn);
    const correctText = formatNumberByLocale(qData.factor, isEn);
    const shiftText = getShiftText(qData.factor);
    const explainText = t.explainMissingFactor(shiftText, correctText);

    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-indigo-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.missingFactorPrompt} <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{numFormatted} : [ ? ] ＝ {resFormatted}</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:pl-11">
          {qData.options.map((fOpt, idx) => {
            const isSelected = answers[qKey] === fOpt.toString();
            const optionLabel = formatNumberByLocale(fOpt, isEn);
            return (
              <label
                key={idx}
                className={`flex items-center justify-center p-3.5 rounded-2xl border cursor-pointer transition select-none ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${qKey}-opt-${idx}`}
                  name={qKey}
                  value={fOpt.toString()}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, fOpt.toString())}
                  disabled={submitted}
                  className="hidden"
                />
                <span className="font-mono font-bold text-base leading-snug break-words whitespace-normal text-center flex-1">
                  {optionLabel}
                </span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.missingNumberIs} <strong className="font-mono font-bold text-rose-900">{correctText}</strong>. {explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Σύγκριση Εκφράσεων (Buttons)
  const renderComparison = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    const strBaseA = formatNumberByLocale(qData.baseA, isEn);
    const strBaseB = formatNumberByLocale(Number(qData.baseB.toFixed(2)), isEn);
    const factorAFormatted = formatNumberByLocale(qData.factorA, isEn);
    const factorBFormatted = formatNumberByLocale(qData.factorB, isEn);

    const exprA = `${strBaseA} ${qData.isMulA ? '·' : ':'} ${factorAFormatted}`;
    const exprB = `${strBaseB} ${qData.isMulB ? '·' : ':'} ${factorBFormatted}`;

    const cleanValA = formatNumberByLocale(Number(qData.valA.toFixed(2)), isEn);
    const cleanValB = formatNumberByLocale(Number(qData.valB.toFixed(2)), isEn);

    const explainText = t.explainComparison(exprA, cleanValA, exprB, cleanValB, qData.correct);

    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-amber-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.comparePrompt}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-lg sm:text-xl font-mono font-black text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span>{exprA}</span>

            <div className="flex gap-2">
              {['＜', '＝', '＞'].map((sym) => (
                <button
                  type="button"
                  key={sym}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleInputChange(qKey, sym);
                  }}
                  disabled={submitted}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-lg sm:text-xl font-black border transition active:scale-95 touch-manipulation select-none flex items-center justify-center ${
                    answers[qKey] === sym
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>

            <span>{exprB}</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctRelationIs} <span className="font-mono font-bold text-rose-900">{exprA} {qData.correct} {exprB}</span>. {explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/12-diairesi-deka-ekato-xilia"
          className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.gradeBadge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.heroTitle}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              {t.heroDesc}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-blue-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {t.newExercisesBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderDivision('q1', questions.q1, 1)}
          {renderDivision('q2', questions.q2, 2)}

          {renderMultiplication('q3', questions.q3, 3)}
          {renderMultiplication('q4', questions.q4, 4)}

          {renderMissingFactor('q5', questions.q5, 5)}
          {renderMissingFactor('q6', questions.q6, 6)}

          {renderComparison('q7', questions.q7, 7)}
          {renderComparison('q8', questions.q8, 8)}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                {t.checkAnswersBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ΣΤΑΘΕΡΟ ΚΑΤΩ FOOTER (STICKY FOOTER BAR) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>{t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                {t.newExercisesBtn}
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.footerPrompt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
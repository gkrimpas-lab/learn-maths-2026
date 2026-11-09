// pages/d-dimotikou/21-pollaplasiasmos-3-psifia-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIntEndingInZero(min, max) {
  const raw = Math.floor(Math.random() * (max - min + 1)) + min;
  return Math.round(raw / 10) * 10;
}

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

const translations = {
  el: {
    pageTitle: "Ασκήσεις: Πολλαπλασιασμός 3ψήφιων Αριθμών | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στον κάθετο πολλαπλασιασμό τριψήφιων αριθμών: στρογγυλοί αριθμοί, υπολογισμός μερικών γινομένων και τελικό αποτέλεσμα.",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "📝 Ασκήσεις: Πολλαπλασιασμός 3ψήφιων Αριθμών",
    subtitle: "Πατώντας «Νέες Ασκήσεις», οι αριθμοί και τα μερικά γινόμενα ανανεώνονται αυτόματα από τη δεξαμενή!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    fillReminder: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    calculateProduct: "Υπολόγισε το γινόμενο:",
    resultPlaceholder: "Αποτέλεσμα",
    numberPlaceholder: "Γράψε τον αριθμό",
    finalProductPlaceholder: "Τελικό γινόμενο",
    correctAnswerIs: "Η σωστή απάντηση είναι",
    correctRelationIs: "Η σωστή απάντηση είναι:",
    correctProductIs: "Το σωστό γινόμενο είναι",
    partialProductLabel: "Μερικό γινόμενο:",
    selectCorrectProduct: "Επίλεξε το ορθό γινόμενο:",
    calculateFinalResult: "Υπολόγισε το τελικό αποτέλεσμα:",
    roundExplain: (a, baseFactor, prodBase, zerosText, b, correct) =>
      `Πολλαπλασιάζουμε ${a} · ${baseFactor} ＝ ${prodBase} και προσθέτουμε στο τέλος ${zerosText}: ${a} · ${b} ＝ ${correct}.`,
    zerosHundred: "δύο μηδενικά (00)",
    zerosTen: "ένα μηδενικό (0)",
    partialQuestionPrompt: (a, b, partialName) => (
      <>
        Στον πολλαπλασιασμό {a} · {b}, πόσο είναι το {partialName};
      </>
    ),
    partialNameUnits: (a, u) => `1ο μερικό γινόμενο (${a} · ${u})`,
    partialNameTens: (a, t) => `2ο μερικό γινόμενο (${a} · ${t})`,
    partialNameHundreds: (a, h) => `3ο μερικό γινόμενο (${a} · ${h})`,
    partialExplainUnits: (a, u, val) =>
      `Το 1ο μερικό γινόμενο προκύπτει πολλαπλασιάζοντας τον πάνω αριθμό με τις Μονάδες: ${a} · ${u} ＝ ${val}.`,
    partialExplainTens: (a, t, val) =>
      `Το 2ο μερικό γινόμενο προκύπτει πολλαπλασιάζοντας με τις Δεκάδες: ${a} · ${t} ＝ ${val}.`,
    partialExplainHundreds: (a, h, val) =>
      `Το 3ο μερικό γινόμενο προκύπτει πολλαπλασιάζοντας με τις Εκατοντάδες: ${a} · ${h} ＝ ${val}.`,
    mcqExplain: (a, b, correct) =>
      `Εκτελώντας τον κάθετο πολλαπλασιασμό των αριθμών ${a} και ${b}, βρίσκουμε: ${a} · ${b} ＝ ${correct}.`,
    fullExplain: (a, b, correct) =>
      `Το τελικό γινόμενο είναι το άθροισμα των τριών μερικών γινομένων: ${a} · ${b} ＝ ${correct}.`
  },
  en: {
    pageTitle: "Exercises: 3-Digit Multiplication | LearnMaths.gr",
    pageDesc: "Interactive Grade 4 math exercises on 3-digit column multiplication: round numbers, partial products computation, and final product.",
    backText: "Grade 4",
    theoryBtn: "Theory",
    badge: "GRADE 4 • PRACTICE",
    title: "📝 Exercises: Multiplication of 3-Digit Numbers",
    subtitle: "Click «New Exercises» to dynamically refresh the numbers and partial products from the question pool!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "🎯 Check Answers",
    scoreLabel: "Score:",
    successRate: "Accuracy:",
    fillReminder: "Complete all questions and click «Check Answers»!",
    calculateProduct: "Calculate the product:",
    resultPlaceholder: "Result",
    numberPlaceholder: "Enter number",
    finalProductPlaceholder: "Final product",
    correctAnswerIs: "The correct answer is",
    correctRelationIs: "The correct answer is:",
    correctProductIs: "The correct product is",
    partialProductLabel: "Partial product:",
    selectCorrectProduct: "Select the correct product:",
    calculateFinalResult: "Calculate the final result:",
    roundExplain: (a, baseFactor, prodBase, zerosText, b, correct) =>
      `Multiply ${a} · ${baseFactor} ＝ ${prodBase} and append ${zerosText} at the end: ${a} · ${b} ＝ ${correct}.`,
    zerosHundred: "two zeros (00)",
    zerosTen: "one zero (0)",
    partialQuestionPrompt: (a, b, partialName) => (
      <>
        In the multiplication {a} · {b}, what is the value of the {partialName}?
      </>
    ),
    partialNameUnits: (a, u) => `1st partial product (${a} · ${u})`,
    partialNameTens: (a, t) => `2nd partial product (${a} · ${t})`,
    partialNameHundreds: (a, h) => `3rd partial product (${a} · ${h})`,
    partialExplainUnits: (a, u, val) =>
      `The 1st partial product is obtained by multiplying the top number by the Units: ${a} · ${u} ＝ ${val}.`,
    partialExplainTens: (a, t, val) =>
      `The 2nd partial product is obtained by multiplying by the Tens: ${a} · ${t} ＝ ${val}.`,
    partialExplainHundreds: (a, h, val) =>
      `The 3rd partial product is obtained by multiplying by the Hundreds: ${a} · ${h} ＝ ${val}.`,
    mcqExplain: (a, b, correct) =>
      `By executing the vertical multiplication of ${a} and ${b}, we get: ${a} · ${b} ＝ ${correct}.`,
    fullExplain: (a, b, correct) =>
      `The final product is the sum of the three partial products: ${a} · ${b} ＝ ${correct}.`
  }
};

// 1. Άσκηση: Πολλαπλασιασμός με πολλαπλάσια του 10 ή 100 (Input)
function makeRoundMultiplicationQuestion(locale, t, formatNum, prevQ = null) {
  let a, b, isHundred, correct;

  while (true) {
    a = getRandomInt(112, 450);
    isHundred = Math.random() > 0.5;
    b = isHundred ? getRandomInt(2, 9) * 100 : getRandomIntEndingInZero(20, 90);
    correct = a * b;

    if (!prevQ || prevQ.a !== a || prevQ.b !== b) break;
  }

  const baseFactor = isHundred ? b / 100 : b / 10;
  const zerosText = isHundred ? t.zerosHundred : t.zerosTen;

  return {
    a,
    b,
    correct,
    explainText: t.roundExplain(
      formatNum(a),
      formatNum(baseFactor),
      formatNum(a * baseFactor),
      zerosText,
      formatNum(b),
      formatNum(correct)
    )
  };
}

// 2. Άσκηση: Εύρεση Μερικού Γινομένου (Input)
function makePartialProductQuestion(locale, t, formatNum, prevQ = null) {
  let a, b, unitsB, tensB, hundredsB, mode, resultObj;

  while (true) {
    a = getRandomInt(124, 485);
    unitsB = getRandomInt(2, 9);
    tensB = getRandomInt(2, 8);
    hundredsB = getRandomInt(1, 4);
    b = hundredsB * 100 + tensB * 10 + unitsB;
    mode = getRandomInt(1, 3);

    if (mode === 1) {
      const pVal = a * unitsB;
      const partialName = t.partialNameUnits(formatNum(a), formatNum(unitsB));
      resultObj = {
        a,
        b,
        partialName,
        correct: pVal,
        explainText: t.partialExplainUnits(formatNum(a), formatNum(unitsB), formatNum(pVal))
      };
    } else if (mode === 2) {
      const pVal = a * (tensB * 10);
      const partialName = t.partialNameTens(formatNum(a), formatNum(tensB * 10));
      resultObj = {
        a,
        b,
        partialName,
        correct: pVal,
        explainText: t.partialExplainTens(formatNum(a), formatNum(tensB * 10), formatNum(pVal))
      };
    } else {
      const pVal = a * (hundredsB * 100);
      const partialName = t.partialNameHundreds(formatNum(a), formatNum(hundredsB * 100));
      resultObj = {
        a,
        b,
        partialName,
        correct: pVal,
        explainText: t.partialExplainHundreds(formatNum(a), formatNum(hundredsB * 100), formatNum(pVal))
      };
    }

    if (!prevQ || prevQ.correct !== resultObj.correct) break;
  }

  return resultObj;
}

// 3. Άσκηση: Πολλαπλή Επιλογή με 4 Μοναδικές Επιλογές (ΟΜΑΔΑ Α - MCQ)
function makeMCQMultiplicationQuestion(locale, t, formatNum, prevQ = null) {
  let a, b, correct;

  while (true) {
    a = getRandomInt(120, 350);
    b = getRandomInt(112, 245);
    correct = a * b;

    if (!prevQ || prevQ.correctRaw !== correct) break;
  }

  const wrong1 = correct + 100;
  const wrong2 = correct - 100;
  const wrong3 = correct + (getRandomInt(1, 4) * 10);

  const rawOptions = [formatNum(correct), formatNum(wrong1), formatNum(wrong2), formatNum(wrong3)];
  const uniqueOptions = [...new Set(rawOptions)];

  while (uniqueOptions.length < 4) {
    const dummy = formatNum(correct + getRandomInt(15, 300));
    if (!uniqueOptions.includes(dummy)) {
      uniqueOptions.push(dummy);
    }
  }

  const options = uniqueOptions.map((opt) => ({
    text: opt,
    isCorrect: opt === formatNum(correct)
  })).sort(() => Math.random() - 0.5);

  return {
    a,
    b,
    options,
    correctRaw: correct,
    correct: formatNum(correct),
    explainText: t.mcqExplain(formatNum(a), formatNum(b), formatNum(correct))
  };
}

// 4. Άσκηση: Τελικός Πολλαπλασιασμός 3ψηφίων (Input)
function makeFullMultiplicationQuestion(locale, t, formatNum, prevQ = null) {
  let a, b, correct;

  while (true) {
    a = getRandomInt(115, 360);
    b = getRandomInt(112, 240);
    correct = a * b;

    if (!prevQ || prevQ.correct !== correct) break;
  }

  return {
    a,
    b,
    correct,
    explainText: t.fullExplain(formatNum(a), formatNum(b), formatNum(correct))
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions(locale) {
  const t = translations[locale] || translations.el;
  const formatNum = (num) => num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');

  const q1 = makeRoundMultiplicationQuestion(locale, t, formatNum);
  const q2 = makeRoundMultiplicationQuestion(locale, t, formatNum, q1);

  const q3 = makePartialProductQuestion(locale, t, formatNum);
  const q4 = makePartialProductQuestion(locale, t, formatNum, q3);

  const q5 = makeMCQMultiplicationQuestion(locale, t, formatNum);
  const q6 = makeMCQMultiplicationQuestion(locale, t, formatNum, q5);

  const q7 = makeFullMultiplicationQuestion(locale, t, formatNum);
  const q8 = makeFullMultiplicationQuestion(locale, t, formatNum, q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function Pollaplasiasmos3PsifiaAskPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const formatNumber = (num) => {
    if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
  };

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(locale));
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, [locale]);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9]/g, '');
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    if (parseInt(answers.q1, 10) === questions.q1.correct) currentScore += 1;
    if (parseInt(answers.q2, 10) === questions.q2.correct) currentScore += 1;
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (parseInt(answers.q7, 10) === questions.q7.correct) currentScore += 1;
    if (parseInt(answers.q8, 10) === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Q1 & Q2: Στρογγυλοί Αριθμοί (Input)
  const renderRoundMultiplication = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
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
            {t.calculateProduct} <span className="text-emerald-700 font-mono font-black text-lg sm:text-xl">{formatNumber(qData.a)} · {formatNumber(qData.b)}</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{formatNumber(qData.a)} · {formatNumber(qData.b)}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.resultPlaceholder}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-40 sm:w-52 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-emerald-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctAnswerIs} <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Μερικά Γινόμενα (Input)
  const renderPartialProduct = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-amber-500 text-slate-950 font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.partialQuestionPrompt(formatNumber(qData.a), formatNumber(qData.b), <span className="text-amber-800 font-extrabold">{qData.partialName}</span>)}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">{t.partialProductLabel}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.numberPlaceholder}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-40 sm:w-52 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-amber-950 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctAnswerIs} <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Πολλαπλή Επιλογή (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
  const renderMCQMultiplication = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-purple-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.selectCorrectProduct} <span className="text-purple-700 font-mono font-black text-lg sm:text-xl">{formatNumber(qData.a)} · {formatNumber(qData.b)}</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt.text;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/80 font-bold text-purple-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${qKey}-opt-${idx}`}
                  name={qKey}
                  value={opt.text}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt.text)}
                  disabled={submitted}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 shrink-0"
                />
                <span className="break-words whitespace-normal leading-snug flex-1 font-mono font-bold text-sm sm:text-base">
                  {opt.text}
                </span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctRelationIs} <strong className="font-mono font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Τελικός Πολλαπλασιασμός 3ψηφίων (Input)
  const renderFullMultiplication = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
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
            {t.calculateFinalResult} <span className="text-indigo-700 font-mono font-black text-lg sm:text-xl">{formatNumber(qData.a)} · {formatNumber(qData.b)}</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{formatNumber(qData.a)} · {formatNumber(qData.b)}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.finalProductPlaceholder}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-40 sm:w-52 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-indigo-950 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctProductIs} <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/21-pollaplasiasmos-3-psifia"
          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.title}
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-emerald-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderRoundMultiplication('q1', questions.q1, 1)}
          {renderRoundMultiplication('q2', questions.q2, 2)}

          {renderPartialProduct('q3', questions.q3, 3)}
          {renderPartialProduct('q4', questions.q4, 4)}

          {renderMCQMultiplication('q5', questions.q5, 5)}
          {renderMCQMultiplication('q6', questions.q6, 6)}

          {renderFullMultiplication('q7', questions.q7, 7)}
          {renderFullMultiplication('q8', questions.q8, 8)}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                {t.submitBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ΣΤΑΘΕΡΟ FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreLabel}</span>
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
                <span>🔄</span> {t.newQuestionsBtn}
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.fillReminder}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
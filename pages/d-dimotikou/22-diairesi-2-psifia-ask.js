// pages/d-dimotikou/22-diairesi-2-psifia-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
    pageTitle: "Ασκήσεις: Διαίρεση με Διψήφιο Διαιρέτη | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στη διαίρεση με διψήφιο διαιρέτη: τέλεια διαίρεση, εύρεση υπολοίπου, επιλογή πηλίκου και επαλήθευση.",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "📝 Ασκήσεις: Διαίρεση με Διψήφιο Διαιρέτη",
    subtitle: "Πατώντας «Νέες Ασκήσεις», οι αριθμοί και οι πράξεις ανανεώνονται αυτόματα από τη δεξαμενή!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    fillReminder: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    quotientLabel: "Πηλίκο (π):",
    remainderLabel: "Υπόλοιπο (υ):",
    dividendLabel: "Διαιρετέος (Δ):",
    qExactTitle: "Υπολόγισε το πηλίκο της τέλειας διαίρεσης:",
    qRemainderTitle: "Πόσο είναι το υπόλοιπο της διαίρεσης:",
    qMcqTitle: "Επίλεξε το ορθό αποτέλεσμα της διαίρεσης:",
    qVerificationTitle: (d, q, r) => (
      <>
        Σε μια διαίρεση ο διαιρέτης είναι {d}, το πηλίκο είναι {q} και το υπόλοιπο {r}. Ποιος είναι ο Διαιρετέος (Δ);
      </>
    ),
    exactExplain: (D, d, q) =>
      `Η διαίρεση είναι τέλεια (υπόλοιπο 0): ${D} ： ${d} ＝ ${q}, επειδή ${d} · ${q} ＝ ${D}.`,
    exactCorrectIs: "Το σωστό πηλίκο είναι",
    remainderExplain: (D, d, q, prod, diff, r) =>
      `Στη διαίρεση ${D} ： ${d}, το πηλίκο είναι ${q} (${d} · ${q} ＝ ${prod}) και το υπόλοιπο είναι ${D} － ${prod} ＝ ${r} (ισχύει ${r} ＜ ${d}).`,
    remainderCorrectIs: "Το σωστό υπόλοιπο είναι",
    mcqExplain: (D, d, correctText, prod, r) =>
      `Εκτελώντας τη διαίρεση ${D} ： ${d}, προκύπτει ${correctText}, καθώς (${d} · ${prod}) ＋ ${r} ＝ ${D}.`,
    mcqCorrectIs: "Το ορθό αποτέλεσμα είναι:",
    verificationExplain: (d, q, r, prod, D) =>
      `Εφαρμόζουμε τον τύπο της επαλήθευσης: Δ ＝ (δ · π) ＋ υ ＝ (${d} · ${q}) ＋ ${r} ＝ ${prod} ＋ ${r} ＝ ${D}.`,
    verificationCorrectIs: "Ο Διαιρετέος είναι",
    qNotation: "π",
    rNotation: "υ",
    dNotation: "Δ"
  },
  en: {
    pageTitle: "Exercises: 2-Digit Divisor Division | LearnMaths.gr",
    pageDesc: "Interactive Grade 4 math exercises on 2-digit divisor division: exact division, finding remainder, quotient selection, and verification.",
    backText: "Grade 4",
    theoryBtn: "Theory",
    badge: "GRADE 4 • PRACTICE",
    title: "📝 Exercises: Division with 2-Digit Divisor",
    subtitle: "Click «New Exercises» to dynamically refresh the numbers and operations from the pool!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "🎯 Check Answers",
    scoreLabel: "Score:",
    successRate: "Accuracy:",
    fillReminder: "Complete all questions and click «Check Answers»!",
    quotientLabel: "Quotient (q):",
    remainderLabel: "Remainder (r):",
    dividendLabel: "Dividend (D):",
    qExactTitle: "Calculate the quotient of the exact division:",
    qRemainderTitle: "What is the remainder of the division:",
    qMcqTitle: "Select the correct result of the division:",
    qVerificationTitle: (d, q, r) => (
      <>
        In a division, the divisor is {d}, the quotient is {q}, and the remainder is {r}. What is the Dividend (D)?
      </>
    ),
    exactExplain: (D, d, q) =>
      `The division is exact (remainder 0): ${D} ： ${d} ＝ ${q}, because ${d} · ${q} ＝ ${D}.`,
    exactCorrectIs: "The correct quotient is",
    remainderExplain: (D, d, q, prod, diff, r) =>
      `In the division ${D} ： ${d}, the quotient is ${q} (${d} · ${q} ＝ ${prod}) and the remainder is ${D} － ${prod} ＝ ${r} (where ${r} ＜ ${d}).`,
    remainderCorrectIs: "The correct remainder is",
    mcqExplain: (D, d, correctText, prod, r) =>
      `Executing the division ${D} ： ${d} gives ${correctText}, since (${d} · ${prod}) ＋ ${r} ＝ ${D}.`,
    mcqCorrectIs: "The correct result is:",
    verificationExplain: (d, q, r, prod, D) =>
      `We apply the Euclidean verification formula: D ＝ (d · q) ＋ r ＝ (${d} · ${q}) ＋ ${r} ＝ ${prod} ＋ ${r} ＝ ${D}.`,
    verificationCorrectIs: "The Dividend is",
    qNotation: "q",
    rNotation: "r",
    dNotation: "D"
  }
};

// 1. Άσκηση: Τέλεια Διαίρεση με 2ψήφιο διαιρέτη (Input - Εύρεση Πηλίκου)
function makeExactDivisionQuestion(locale, t, formatNum, prevQ = null) {
  let d, q, D;

  while (true) {
    d = getRandomInt(11, 45);
    q = getRandomInt(12, 65);
    D = d * q;

    if (!prevQ || prevQ.D !== D) break;
  }

  return {
    D,
    d,
    correct: q,
    explainText: t.exactExplain(formatNum(D), formatNum(d), formatNum(q))
  };
}

// 2. Άσκηση: Ατελής Διαίρεση - Εύρεση Υπολοίπου (Input)
function makeRemainderQuestion(locale, t, formatNum, prevQ = null) {
  let d, q, r, D;

  while (true) {
    d = getRandomInt(12, 50);
    q = getRandomInt(10, 45);
    r = getRandomInt(1, d - 1);
    D = d * q + r;

    if (!prevQ || prevQ.D !== D) break;
  }

  const prod = d * q;

  return {
    D,
    d,
    correct: r,
    explainText: t.remainderExplain(
      formatNum(D),
      formatNum(d),
      formatNum(q),
      formatNum(prod),
      formatNum(D - prod),
      formatNum(r)
    )
  };
}

// 3. Άσκηση: Πολλαπλή Επιλογή (MCQ) με 4 Μοναδικές Επιλογές (ΟΜΑΔΑ Α)
function makeMCQDivisionQuestion(locale, t, formatNum, prevQ = null) {
  let d, q, r, D, correctText;
  const qSym = t.qNotation;
  const rSym = t.rNotation;

  while (true) {
    d = getRandomInt(12, 35);
    q = getRandomInt(12, 45);
    r = getRandomInt(0, d - 1);
    D = d * q + r;

    correctText = r === 0 ? `${qSym} ＝ ${formatNum(q)}` : `${qSym} ＝ ${formatNum(q)}, ${rSym} ＝ ${formatNum(r)}`;
    if (!prevQ || prevQ.correctText !== correctText) break;
  }

  const wrong1 = r === 0 ? `${qSym} ＝ ${formatNum(q + 2)}` : `${qSym} ＝ ${formatNum(q + 1)}, ${rSym} ＝ ${formatNum(r)}`;
  const wrong2 = r === 0 ? `${qSym} ＝ ${formatNum(Math.max(1, q - 2))}` : `${qSym} ＝ ${formatNum(q)}, ${rSym} ＝ ${formatNum(r > 1 ? r - 1 : r + 2)}`;
  const wrong3 = `${qSym} ＝ ${formatNum(q + 3)}, ${rSym} ＝ ${formatNum(r + 1)}`;

  const rawOptions = [correctText, wrong1, wrong2, wrong3];
  const uniqueOptions = [...new Set(rawOptions)];

  while (uniqueOptions.length < 4) {
    const dummy = `${qSym} ＝ ${formatNum(q + getRandomInt(4, 10))}, ${rSym} ＝ ${formatNum(getRandomInt(0, d - 1))}`;
    if (!uniqueOptions.includes(dummy)) {
      uniqueOptions.push(dummy);
    }
  }

  const choices = uniqueOptions.map((opt) => ({
    text: opt,
    isCorrect: opt === correctText
  })).sort(() => Math.random() - 0.5);

  return {
    D,
    d,
    options: choices,
    correctText,
    correct: correctText,
    explainText: t.mcqExplain(formatNum(D), formatNum(d), correctText, formatNum(q), formatNum(r))
  };
}

// 4. Άσκηση: Επαλήθευση Διαίρεσης - Εύρεση Διαιρετέου (Input)
function makeVerificationQuestion(locale, t, formatNum, prevQ = null) {
  let d, q, r, D;

  while (true) {
    d = getRandomInt(12, 45);
    q = getRandomInt(15, 60);
    r = getRandomInt(0, d - 1);
    D = d * q + r;

    if (!prevQ || prevQ.correct !== D) break;
  }

  const prod = d * q;

  return {
    d,
    q,
    r,
    correct: D,
    explainText: t.verificationExplain(formatNum(d), formatNum(q), formatNum(r), formatNum(prod), formatNum(D))
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions(locale) {
  const t = translations[locale] || translations.el;
  const formatNum = (num) => num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');

  const q1 = makeExactDivisionQuestion(locale, t, formatNum);
  const q2 = makeExactDivisionQuestion(locale, t, formatNum, q1);

  const q3 = makeRemainderQuestion(locale, t, formatNum);
  const q4 = makeRemainderQuestion(locale, t, formatNum, q3);

  const q5 = makeMCQDivisionQuestion(locale, t, formatNum);
  const q6 = makeMCQDivisionQuestion(locale, t, formatNum, q5);

  const q7 = makeVerificationQuestion(locale, t, formatNum);
  const q8 = makeVerificationQuestion(locale, t, formatNum, q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function Diairesi2PsifiaAskPage() {
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

  // Render Q1 & Q2: Τέλεια Διαίρεση (Input)
  const renderExactDivision = (qKey, qData, numLabel) => {
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
            {t.qExactTitle} <span className="text-indigo-700 font-mono font-black text-lg sm:text-xl">{formatNumber(qData.D)} ： {formatNumber(qData.d)}</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">{t.quotientLabel}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.qNotation}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-indigo-950 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
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
                {t.exactCorrectIs} <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Εύρεση Υπολοίπου (Input)
  const renderRemainder = (qKey, qData, numLabel) => {
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
            {t.qRemainderTitle} <span className="text-amber-700 font-mono font-black text-lg sm:text-xl">{formatNumber(qData.D)} ： {formatNumber(qData.d)}</span>;
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">{t.remainderLabel}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.rNotation}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-amber-950 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
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
                {t.remainderCorrectIs} <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Πολλαπλή Επιλογή (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
  const renderMCQDivision = (qKey, qData, numLabel) => {
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
            {t.qMcqTitle} <span className="text-purple-700 font-mono font-black text-lg sm:text-xl">{formatNumber(qData.D)} ： {formatNumber(qData.d)}</span>
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
                {t.mcqCorrectIs} <strong className="font-mono font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Επαλήθευση - Εύρεση Διαιρετέου (Input)
  const renderVerification = (qKey, qData, numLabel) => {
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
            {t.qVerificationTitle(
              <span className="text-blue-600 font-black">{formatNumber(qData.d)}</span>,
              <span className="text-purple-600 font-black">{formatNumber(qData.q)}</span>,
              <span className="text-amber-600 font-black">{formatNumber(qData.r)}</span>
            )}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">{t.dividendLabel}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.dNotation}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-40 sm:w-52 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-emerald-950 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
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
                {t.verificationCorrectIs} <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>. {qData.explainText}
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
          href="/d-dimotikou/22-diairesi-2-psifia"
          className="bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.title}
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-purple-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderExactDivision('q1', questions.q1, 1)}
          {renderExactDivision('q2', questions.q2, 2)}

          {renderRemainder('q3', questions.q3, 3)}
          {renderRemainder('q4', questions.q4, 4)}

          {renderMCQDivision('q5', questions.q5, 5)}
          {renderMCQDivision('q6', questions.q6, 6)}

          {renderVerification('q7', questions.q7, 7)}
          {renderVerification('q8', questions.q8, 8)}

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
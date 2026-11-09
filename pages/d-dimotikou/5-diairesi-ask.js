import { useState, useEffect } from 'react';
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumberLocale(num, locale = 'el') {
  if (num === null || num === undefined || isNaN(num)) return '';
  return num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
}

// Οπτικό στοιχείο κλάσματος (κατακόρυφη διάταξη)
function Fraction({ num, den, inline = false }) {
  return (
    <span
      className={`${
        inline ? 'inline-flex' : 'flex'
      } flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none select-none`}
    >
      <span className="px-1.5 pb-0.5 text-center text-xs sm:text-sm border-b-2 border-current">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center text-xs sm:text-sm">
        {den}
      </span>
    </span>
  );
}

// --- ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n --- //
const translations = {
  el: {
    metaTitle: "Ασκήσεις: Η Διαίρεση με Μονοψήφιο | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στη διαίρεση με μονοψήφιο διαιρέτη: τέλειες διαιρέσεις, υπόλοιπο, επαλήθευση και εύρεση διαιρετέου.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    theoryUrl: "/d-dimotikou/5-diairesi",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Ασκήσεις: Η Διαίρεση",
    subtitle: "Πατώντας «Νέες Ασκήσεις», οι αριθμοί και οι πράξεις ανανεώνονται αυτόματα από τη δεξαμενή!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    bottomPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    // Q1 & Q2
    q1Prompt: "Υπολόγισε το πηλίκο της τέλειας διαίρεσης:",
    q1Placeholder: "Πηλίκο",
    q1FbSuccessLead: "Ο διαιρετέος μοιράζεται ακριβώς:",
    q1FbSuccessMid: "αφού",
    q1FbErrorLead: "Το ακριβές πηλίκο προκύπτει από το κλάσμα:",
    // Q3 & Q4
    q3PromptPrefix: "Πόσο είναι το",
    q3PromptBold: "υπόλοιπο (υ)",
    q3PromptSuffix: "της διαίρεσης",
    q3InputLabel: "Υπόλοιπο (υ):",
    q3Placeholder: "Υπόλοιπο",
    q3FbSuccess: "Το πηλίκο είναι {q} ({d} · {q} ＝ {prod}) και περισσεύει υπόλοιπο {correct} (με {correct} ＜ {d}).",
    q3FbError: "Το υπόλοιπο της διαίρεσης είναι {correct}, διότι {dividend} ＝ ({d} · {q}) ＋ {correct}.",
    // Q5 & Q6
    q5PromptPrefix: "Ποια σχέση εκφράζει την ορθή",
    q5PromptBold: "επαλήθευση",
    q5PromptSuffix: "της διαίρεσης",
    q5RemainderWord: "υπόλοιπο",
    q5FbSuccess: "Εφαρμόζοντας τον τύπο της Ευκλείδειας διαίρεσης Δ ＝ (δ · π) ＋ υ, ισχύει ({d} · {q}) ＋ {r} ＝ {dividend}.",
    q5FbError: "Η σωστή επαλήθευση είναι: {correct}.",
    // Q7 & Q8
    q7PromptPrefix: "Ένας αριθμός όταν διαιρεθεί με το",
    q7PromptMid1: "δίνει πηλίκο",
    q7PromptMid2: "και υπόλοιπο",
    q7PromptSuffix: "Ποιος είναι ο αρχικός διαιρετέος (Δ);",
    q7InputLabel: "Διαιρετέος (Δ):",
    q7Placeholder: "Γράψε τον Δ",
    q7FbSuccess: "Υπολογίζουμε: ({d} · {q}) ＋ {r} ＝ {prod} ＋ {r} ＝ {correct}.",
    q7FbError: "Ο αρχικός διαιρετέος υπολογίζεται ως ({d} · {q}) ＋ {r} ＝ {correct}."
  },
  en: {
    metaTitle: "Exercises: Division by One-Digit Divisor | LearnMaths.gr",
    metaDesc: "Interactive math exercises for 4th Grade on division with one-digit divisors: exact division, remainders, verification, and finding dividends.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    theoryBtn: "Theory",
    theoryUrl: "/en/d-dimotikou/5-diairesi",
    badge: "4TH GRADE • PRACTICE",
    title: "Exercises: Division",
    subtitle: "Clicking 'New Exercises' generates new numbers and operations automatically from the pool!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success Rate:",
    bottomPrompt: "Complete all questions and click 'Check Answers'!",
    // Q1 & Q2
    q1Prompt: "Calculate the quotient of the exact division:",
    q1Placeholder: "Quotient",
    q1FbSuccessLead: "The dividend divides evenly:",
    q1FbSuccessMid: "since",
    q1FbErrorLead: "The exact quotient is calculated by the fraction:",
    // Q3 & Q4
    q3PromptPrefix: "What is the",
    q3PromptBold: "remainder (r)",
    q3PromptSuffix: "of the division",
    q3InputLabel: "Remainder (r):",
    q3Placeholder: "Remainder",
    q3FbSuccess: "The quotient is {q} ({d} · {q} ＝ {prod}) and the remainder is {correct} (with {correct} ＜ {d}).",
    q3FbError: "The remainder of the division is {correct}, because {dividend} ＝ ({d} · {q}) ＋ {correct}.",
    // Q5 & Q6
    q5PromptPrefix: "Which relation expresses the correct",
    q5PromptBold: "verification",
    q5PromptSuffix: "for the division",
    q5RemainderWord: "remainder",
    q5FbSuccess: "Applying Euclidean division D ＝ (d · q) ＋ r, we have ({d} · {q}) ＋ {r} ＝ {dividend}.",
    q5FbError: "The correct verification equation is: {correct}.",
    // Q7 & Q8
    q7PromptPrefix: "When a number is divided by",
    q7PromptMid1: "it yields a quotient of",
    q7PromptMid2: "and a remainder of",
    q7PromptSuffix: "What is the original dividend (D)?",
    q7InputLabel: "Dividend (D):",
    q7Placeholder: "Enter D",
    q7FbSuccess: "We calculate: ({d} · {q}) ＋ {r} ＝ {prod} ＋ {r} ＝ {correct}.",
    q7FbError: "The original dividend is calculated as ({d} · {q}) ＋ {r} ＝ {correct}."
  }
};

// --- ΓΕΝΝΗΤΡΙΕΣ ΕΡΩΤΗΣΕΩΝ --- //

function makeExactDivisionQuestion() {
  const divisor = getRandomInt(3, 9);
  const quotient = getRandomInt(14, 125);
  const dividend = divisor * quotient;

  return {
    dividend,
    divisor,
    correct: quotient
  };
}

function makeRemainderQuestion() {
  const divisor = getRandomInt(3, 9);
  const quotient = getRandomInt(12, 95);
  const remainder = getRandomInt(1, divisor - 1);
  const dividend = divisor * quotient + remainder;

  return {
    dividend,
    divisor,
    quotient,
    correct: remainder
  };
}

function makeVerificationMCQQuestion(locale) {
  const divisor = getRandomInt(3, 9);
  const quotient = getRandomInt(14, 75);
  const remainder = getRandomInt(1, divisor - 1);
  const dividend = divisor * quotient + remainder;

  const correctText = `(${formatNumberLocale(divisor, locale)} · ${formatNumberLocale(quotient, locale)}) ＋ ${formatNumberLocale(remainder, locale)} ＝ ${formatNumberLocale(dividend, locale)}`;
  const wrong1 = `(${formatNumberLocale(divisor, locale)} · ${formatNumberLocale(quotient, locale)}) ＝ ${formatNumberLocale(dividend, locale)}`;
  const wrong2 = `(${formatNumberLocale(divisor, locale)} ＋ ${formatNumberLocale(quotient, locale)}) · ${formatNumberLocale(remainder, locale)} ＝ ${formatNumberLocale(dividend, locale)}`;
  const wrong3 = `(${formatNumberLocale(dividend, locale)} － ${formatNumberLocale(remainder, locale)}) · ${formatNumberLocale(divisor, locale)} ＝ ${formatNumberLocale(quotient, locale)}`;

  const rawOptions = [correctText, wrong1, wrong2, wrong3];
  const uniqueOptions = [...new Set(rawOptions)].sort(() => Math.random() - 0.5);

  return {
    dividend,
    divisor,
    quotient,
    remainder,
    options: uniqueOptions,
    correct: correctText
  };
}

function makeMissingDividendQuestion() {
  const divisor = getRandomInt(3, 9);
  const quotient = getRandomInt(15, 85);
  const isExact = Math.random() > 0.6;
  const remainder = isExact ? 0 : getRandomInt(1, divisor - 1);
  const dividend = divisor * quotient + remainder;

  return {
    divisor,
    quotient,
    remainder,
    isExact,
    correct: dividend
  };
}

function generateQuestions(locale) {
  return {
    q1: makeExactDivisionQuestion(),
    q2: makeExactDivisionQuestion(),
    q3: makeRemainderQuestion(),
    q4: makeRemainderQuestion(),
    q5: makeVerificationMCQQuestion(locale),
    q6: makeVerificationMCQQuestion(locale),
    q7: makeMissingDividendQuestion(),
    q8: makeMissingDividendQuestion()
  };
}

export default function DiairesiAskPage() {
  const router = useRouter();
  const rawLocale = router.locale || router.query.locale;
  const currentLocale = rawLocale === 'en' ? 'en' : 'el';
  const t = translations[currentLocale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(currentLocale));
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, [currentLocale]);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9]/g, '').slice(0, 10);
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

  const totalQuestions = 8;

  // Render Q1 & Q2: Τέλεια Διαίρεση (Input με Fraction στην επεξήγηση)
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
            {t.q1Prompt}{' '}
            <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">
              {formatNumberLocale(qData.dividend, currentLocale)} : {formatNumberLocale(qData.divisor, currentLocale)}
            </span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{formatNumberLocale(qData.dividend, currentLocale)}</span>
            <span>:</span>
            <span>{formatNumberLocale(qData.divisor, currentLocale)}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.q1Placeholder}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-indigo-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60 flex flex-wrap items-center gap-1.5">
                <span>{t.q1FbSuccessLead}</span>
                <Fraction
                  num={formatNumberLocale(qData.dividend, currentLocale)}
                  den={formatNumberLocale(qData.divisor, currentLocale)}
                  inline={true}
                />
                <span>＝</span>
                <span className="font-mono font-bold">{formatNumberLocale(qData.correct, currentLocale)}</span>
                <span>({t.q1FbSuccessMid} {formatNumberLocale(qData.divisor, currentLocale)} · {formatNumberLocale(qData.correct, currentLocale)} ＝ {formatNumberLocale(qData.dividend, currentLocale)}).</span>
              </div>
            ) : (
              <div className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60 flex flex-wrap items-center gap-1.5">
                <span>{t.q1FbErrorLead}</span>
                <Fraction
                  num={formatNumberLocale(qData.dividend, currentLocale)}
                  den={formatNumberLocale(qData.divisor, currentLocale)}
                  inline={true}
                />
                <span>＝</span>
                <span className="font-mono font-bold text-rose-900">{formatNumberLocale(qData.correct, currentLocale)}</span>.
              </div>
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
          <span className="bg-amber-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.q3PromptPrefix}{' '}
            <span className="text-amber-600 font-extrabold">{t.q3PromptBold}</span>{' '}
            {t.q3PromptSuffix}{' '}
            <span className="text-amber-600 font-mono font-black text-lg">
              {formatNumberLocale(qData.dividend, currentLocale)} : {formatNumberLocale(qData.divisor, currentLocale)}
            </span>;
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">
              {t.q3InputLabel}
            </span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.q3Placeholder}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-40 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-amber-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {t.q3FbSuccess
                  .replace('{q}', formatNumberLocale(qData.quotient, currentLocale))
                  .replace(/\{d\}/g, formatNumberLocale(qData.divisor, currentLocale))
                  .replace('{prod}', formatNumberLocale(qData.divisor * qData.quotient, currentLocale))
                  .replace(/\{correct\}/g, formatNumberLocale(qData.correct, currentLocale))}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q3FbError
                  .replace('{dividend}', formatNumberLocale(qData.dividend, currentLocale))
                  .replace('{d}', formatNumberLocale(qData.divisor, currentLocale))
                  .replace('{q}', formatNumberLocale(qData.quotient, currentLocale))
                  .replace(/\{correct\}/g, formatNumberLocale(qData.correct, currentLocale))}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Επαλήθευση (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
  const renderVerificationMCQ = (qKey, qData, numLabel) => {
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
            {t.q5PromptPrefix}{' '}
            <span className="text-purple-600 font-extrabold">{t.q5PromptBold}</span>{' '}
            {t.q5PromptSuffix}{' '}
            <span className="text-purple-600 font-mono font-black text-lg">
              {formatNumberLocale(qData.dividend, currentLocale)} : {formatNumberLocale(qData.divisor, currentLocale)} ＝ {formatNumberLocale(qData.quotient, currentLocale)}
            </span>{' '}
            ({t.q5RemainderWord} {formatNumberLocale(qData.remainder, currentLocale)});
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
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
                  value={opt}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt)}
                  disabled={submitted}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 shrink-0"
                />
                <span className="font-mono font-bold text-sm sm:text-base leading-snug break-words whitespace-normal flex-1">
                  {opt}
                </span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {t.q5FbSuccess
                  .replace('{d}', formatNumberLocale(qData.divisor, currentLocale))
                  .replace('{q}', formatNumberLocale(qData.quotient, currentLocale))
                  .replace('{r}', formatNumberLocale(qData.remainder, currentLocale))
                  .replace('{dividend}', formatNumberLocale(qData.dividend, currentLocale))}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q5FbError.replace('{correct}', qData.correct)}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Εύρεση Άγνωστου Διαιρετέου (Input)
  const renderMissingDividend = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-teal-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.q7PromptPrefix}{' '}
            <span className="text-teal-600 font-mono font-black text-lg">{formatNumberLocale(qData.divisor, currentLocale)}</span>{' '}
            {t.q7PromptMid1}{' '}
            <span className="text-teal-600 font-mono font-black text-lg">{formatNumberLocale(qData.quotient, currentLocale)}</span>{' '}
            {t.q7PromptMid2}{' '}
            <span className="text-teal-600 font-mono font-black text-lg">{formatNumberLocale(qData.remainder, currentLocale)}</span>.{' '}
            {t.q7PromptSuffix}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">
              {t.q7InputLabel}
            </span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.q7Placeholder}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-teal-900 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {t.q7FbSuccess
                  .replace('{d}', formatNumberLocale(qData.divisor, currentLocale))
                  .replace('{q}', formatNumberLocale(qData.quotient, currentLocale))
                  .replace(/\{r\}/g, formatNumberLocale(qData.remainder, currentLocale))
                  .replace('{prod}', formatNumberLocale(qData.divisor * qData.quotient, currentLocale))
                  .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q7FbError
                  .replace('{d}', formatNumberLocale(qData.divisor, currentLocale))
                  .replace('{q}', formatNumberLocale(qData.quotient, currentLocale))
                  .replace('{r}', formatNumberLocale(qData.remainder, currentLocale))
                  .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))}
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
      backUrl={t.backUrl}
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href={t.theoryUrl}
          className="bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
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
              📝 {t.title}
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>

          <button
            type="button"
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

          {renderVerificationMCQ('q5', questions.q5, 5)}
          {renderVerificationMCQ('q6', questions.q6, 6)}

          {renderMissingDividend('q7', questions.q7, 7)}
          {renderMissingDividend('q8', questions.q8, 8)}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 {t.submitBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / {totalQuestions}</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{Math.round((score / totalQuestions) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> {t.newQuestionsBtn}
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.bottomPrompt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
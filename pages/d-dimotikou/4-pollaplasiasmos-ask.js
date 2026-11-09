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

// --- ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n --- //
const translations = {
  el: {
    metaTitle: "Ασκήσεις: Πολλαπλασιασμός με Διψήφιο | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στον πολλαπλασιασμό με διψήφιο αριθμό: πολλαπλάσια του 10, μερικά γινόμενα και κάθετες πράξεις.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    theoryUrl: "/d-dimotikou/4-pollaplasiasmos",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Ασκήσεις: Πολλαπλασιασμός με Διψήφιο",
    subtitle: "Πατώντας «Νέες Ασκήσεις», οι αριθμοί ανανεώνονται αυτόματα από τη δεξαμενή!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    bottomPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    // Q1 & Q2
    q1Prompt: "Υπολόγισε το γινόμενο:",
    q1FbSuccess: "Πολλαπλασιάζουμε {a} · {bDivided} ＝ {subProd} και προσθέτουμε το μηδενικό στο τέλος: {correct}.",
    q1FbError: "Το σωστό γινόμενο είναι {a} · {b} ＝ {correct} ({a} · {bDivided} δεκάδες ＝ {correct}).",
    // Q3 & Q4
    q3PromptPrefix: "Στον κάθετο πολλαπλασιασμό",
    q3PromptSuffix: "πόσο είναι το",
    q3CalcLabel: "Υπολογισμός ({detail}):",
    q3Partial1: "1ο μερικό γινόμενο",
    q3Partial2: "2ο μερικό γινόμενο",
    q3FbSuccess: "Το {label} προκύπτει από την πράξη {detail} ＝ {correct}.",
    q3FbError: "Το {label} είναι ίσο με {detail} ＝ {correct}.",
    // Q5 & Q6
    q5Prompt: "Επίλεξε το σωστό αποτέλεσμα για τον πολλαπλασιασμό:",
    q5FbSuccess: "Ορθός υπολογισμός: {a} · {b} ＝ {correct}.",
    q5FbError: "Το ακριβές γινόμενο είναι {a} · {b} ＝ {correct}.",
    // Q7 & Q8
    q7Prompt: "Εκτέλεσε κάθετα την πράξη και γράψε το τελικό γινόμενο:",
    q7Placeholder: "Τελικό γινόμενο",
    q7FbSuccess: "1ο μερικό γινόμενο: {p1} ({a} · {unitsB}), 2ο μερικό γινόμενο: {p2} ({a} · {tensB}0). Άθροισμα: {correct}.",
    q7FbError: "Το τελικό αποτέλεσμα είναι {p1} ＋ {p2} ＝ {correct}."
  },
  en: {
    metaTitle: "Exercises: Multiplication by Two-Digit Number | LearnMaths.gr",
    metaDesc: "Interactive math exercises for 4th Grade on multiplication by two-digit numbers: multiples of 10, partial products, and column multiplication.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    theoryBtn: "Theory",
    theoryUrl: "/en/d-dimotikou/4-pollaplasiasmos",
    badge: "4TH GRADE • PRACTICE",
    title: "Exercises: Multiplication by Two-Digit Number",
    subtitle: "Clicking 'New Exercises' generates new numbers automatically from the pool!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success Rate:",
    bottomPrompt: "Complete all questions and click 'Check Answers'!",
    // Q1 & Q2
    q1Prompt: "Calculate the product:",
    q1FbSuccess: "We multiply {a} · {bDivided} ＝ {subProd} and append the trailing zero: {correct}.",
    q1FbError: "The correct product is {a} · {b} ＝ {correct} ({a} · {bDivided} tens ＝ {correct}).",
    // Q3 & Q4
    q3PromptPrefix: "In the vertical multiplication",
    q3PromptSuffix: "what is the value of the",
    q3CalcLabel: "Calculation ({detail}):",
    q3Partial1: "1st partial product",
    q3Partial2: "2nd partial product",
    q3FbSuccess: "The {label} is obtained from {detail} ＝ {correct}.",
    q3FbError: "The {label} is equal to {detail} ＝ {correct}.",
    // Q5 & Q6
    q5Prompt: "Choose the correct result for the multiplication:",
    q5FbSuccess: "Correct calculation: {a} · {b} ＝ {correct}.",
    q5FbError: "The exact product is {a} · {b} ＝ {correct}.",
    // Q7 & Q8
    q7Prompt: "Multiply vertically and write the final product:",
    q7Placeholder: "Final product",
    q7FbSuccess: "1st partial product: {p1} ({a} · {unitsB}), 2nd partial product: {p2} ({a} · {tensB}0). Sum: {correct}.",
    q7FbError: "The final result is {p1} ＋ {p2} ＝ {correct}."
  }
};

// --- ΓΕΝΝΗΤΡΙΕΣ ΕΡΩΤΗΣΕΩΝ --- //

function makeRoundMultiplicationQuestion() {
  const a = getRandomInt(14, 85);
  const tensVal = getRandomInt(2, 8) * 10;
  return {
    a,
    b: tensVal,
    correct: a * tensVal
  };
}

function makePartialProductQuestion() {
  const a = getRandomInt(16, 75);
  const unitsB = getRandomInt(2, 9);
  const tensB = getRandomInt(1, 4);
  const b = tensB * 10 + unitsB;

  const isFirstPartial = Math.random() > 0.5;

  if (isFirstPartial) {
    return {
      a,
      b,
      isFirst: true,
      unitsB,
      tensB,
      detail: `${a} · ${unitsB}`,
      correct: a * unitsB
    };
  } else {
    return {
      a,
      b,
      isFirst: false,
      unitsB,
      tensB,
      detail: `${a} · ${tensB * 10}`,
      correct: a * (tensB * 10)
    };
  }
}

function makeMCQMultiplicationQuestion(locale) {
  const a = getRandomInt(15, 48);
  const b = getRandomInt(12, 35);
  const correct = a * b;

  const unitsB = b % 10;
  const tensB = Math.floor(b / 10);

  const wrongCandidates = new Set();

  const forgottenZero = a * unitsB + a * tensB;
  if (forgottenZero !== correct && forgottenZero > 0) wrongCandidates.add(forgottenZero);

  const offBy10 = correct + (Math.random() > 0.5 ? 10 : -10);
  if (offBy10 > 0 && offBy10 !== correct) wrongCandidates.add(offBy10);

  const offBy20 = correct + (Math.random() > 0.5 ? 20 : -20);
  if (offBy20 > 0 && offBy20 !== correct) wrongCandidates.add(offBy20);

  let offset = 15;
  while (wrongCandidates.size < 3) {
    const candidate = correct + offset;
    if (candidate !== correct && candidate > 0) wrongCandidates.add(candidate);
    offset += 25;
  }

  const rawOptions = [
    formatNumberLocale(correct, locale),
    ...Array.from(wrongCandidates).slice(0, 3).map((n) => formatNumberLocale(n, locale))
  ];

  const uniqueOptions = [...new Set(rawOptions)].sort(() => Math.random() - 0.5);

  return {
    a,
    b,
    options: uniqueOptions,
    correct: formatNumberLocale(correct, locale),
    correctNum: correct
  };
}

function makeFullMultiplicationQuestion() {
  const a = getRandomInt(15, 55);
  const b = getRandomInt(12, 38);
  const unitsB = b % 10;
  const tensB = Math.floor(b / 10);

  return {
    a,
    b,
    correct: a * b,
    unitsB,
    tensB,
    p1: a * unitsB,
    p2: a * (tensB * 10)
  };
}

function generateQuestions(locale) {
  return {
    q1: makeRoundMultiplicationQuestion(),
    q2: makeRoundMultiplicationQuestion(),
    q3: makePartialProductQuestion(),
    q4: makePartialProductQuestion(),
    q5: makeMCQMultiplicationQuestion(locale),
    q6: makeMCQMultiplicationQuestion(locale),
    q7: makeFullMultiplicationQuestion(),
    q8: makeFullMultiplicationQuestion()
  };
}

export default function PollaplasiasmosAskPage() {
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

  // Render Q1 & Q2: Πολλαπλασιασμός με Στρογγυλό Αριθμό (Δεκάδα)
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
            {t.q1Prompt}{' '}
            <span className="text-emerald-600 font-mono font-black text-lg sm:text-xl">
              {formatNumberLocale(qData.a, currentLocale)} · {formatNumberLocale(qData.b, currentLocale)}
            </span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{formatNumberLocale(qData.a, currentLocale)}</span>
            <span>·</span>
            <span>{formatNumberLocale(qData.b, currentLocale)}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-emerald-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {t.q1FbSuccess
                  .replace('{a}', formatNumberLocale(qData.a, currentLocale))
                  .replace('{bDivided}', formatNumberLocale(qData.b / 10, currentLocale))
                  .replace('{subProd}', formatNumberLocale(qData.a * (qData.b / 10), currentLocale))
                  .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q1FbError
                  .replace(/\{a\}/g, formatNumberLocale(qData.a, currentLocale))
                  .replace(/\{b\}/g, formatNumberLocale(qData.b, currentLocale))
                  .replace('{bDivided}', formatNumberLocale(qData.b / 10, currentLocale))
                  .replace(/\{correct\}/g, formatNumberLocale(qData.correct, currentLocale))}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Μερικά Γινόμενα
  const renderPartialProduct = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    const partialLabel = qData.isFirst ? t.q3Partial1 : t.q3Partial2;
    const detailString = qData.isFirst
      ? `${formatNumberLocale(qData.a, currentLocale)} · ${formatNumberLocale(qData.unitsB, currentLocale)}`
      : `${formatNumberLocale(qData.a, currentLocale)} · ${formatNumberLocale(qData.tensB * 10, currentLocale)}`;

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
            <span className="text-amber-600 font-mono font-black text-lg">
              {formatNumberLocale(qData.a, currentLocale)} · {formatNumberLocale(qData.b, currentLocale)}
            </span>,{' '}
            {t.q3PromptSuffix}{' '}
            <span className="text-amber-600 font-bold">{partialLabel}</span>;
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">
              {t.q3CalcLabel.replace('{detail}', detailString)}
            </span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-amber-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {t.q3FbSuccess
                  .replace('{label}', partialLabel)
                  .replace('{detail}', detailString)
                  .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q3FbError
                  .replace('{label}', partialLabel)
                  .replace('{detail}', detailString)
                  .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Πολλαπλή Επιλογή (ΟΜΑΔΑ Α - 4 Επιλογές)
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
            {t.q5Prompt}{' '}
            <span className="text-purple-600 font-mono font-black text-lg sm:text-xl">
              {formatNumberLocale(qData.a, currentLocale)} · {formatNumberLocale(qData.b, currentLocale)}
            </span>
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
                <span className="font-mono font-bold text-base leading-snug break-words whitespace-normal flex-1">
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
                  .replace('{a}', formatNumberLocale(qData.a, currentLocale))
                  .replace('{b}', formatNumberLocale(qData.b, currentLocale))
                  .replace('{correct}', qData.correct)}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q5FbError
                  .replace('{a}', formatNumberLocale(qData.a, currentLocale))
                  .replace('{b}', formatNumberLocale(qData.b, currentLocale))
                  .replace('{correct}', qData.correct)}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Τελικός Πολλαπλασιασμός (Input)
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
            {t.q7Prompt}{' '}
            <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">
              {formatNumberLocale(qData.a, currentLocale)} · {formatNumberLocale(qData.b, currentLocale)}
            </span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{formatNumberLocale(qData.a, currentLocale)}</span>
            <span>·</span>
            <span>{formatNumberLocale(qData.b, currentLocale)}</span>
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
              className="w-40 sm:w-48 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-indigo-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {t.q7FbSuccess
                  .replace('{p1}', formatNumberLocale(qData.p1, currentLocale))
                  .replace('{a}', formatNumberLocale(qData.a, currentLocale))
                  .replace('{unitsB}', formatNumberLocale(qData.unitsB, currentLocale))
                  .replace('{p2}', formatNumberLocale(qData.p2, currentLocale))
                  .replace('{tensB}', formatNumberLocale(qData.tensB, currentLocale))
                  .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q7FbError
                  .replace('{p1}', formatNumberLocale(qData.p1, currentLocale))
                  .replace('{p2}', formatNumberLocale(qData.p2, currentLocale))
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
          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
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
              📝 {t.title}
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
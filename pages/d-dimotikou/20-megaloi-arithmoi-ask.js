// pages/d-dimotikou/20-megaloi-arithmoi-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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
    pageTitle: "Ασκήσεις: Οι Μεγάλοι Αριθμοί | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στους μεγάλους αριθμούς έως το 1.000.000: αξία θέσης ψηφίου, σύνθεση από ανάπτυγμα, σύγκριση και θεωρητικές ιδιότητες.",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "📝 Ασκήσεις: Οι Μεγάλοι Αριθμοί (έως 1.000.000)",
    subtitle: "Πατώντας «Νέες Ασκήσεις», οι αριθμοί και οι πράξεις ανανεώνονται αυτόματα από τη δεξαμενή!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    answerPrompt: "Απάντηση:",
    inputPlaceholder: "Γράψε τον αριθμό",
    correctFeedback: "Σωστή απάντηση!",
    correctAnswerPrefix: "Η σωστή απάντηση είναι",
    correctRelationPrefix: "Η ορθή σχέση είναι:",
    statementIs: "Η πρόταση είναι",
    trueLabel: "Σωστό",
    falseLabel: "Λάθος",
    submitBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    fillReminder: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    // Digit value labels
    posHT: "Εκατοντάδες Χιλιάδες",
    posTT: "Δεκάδες Χιλιάδες",
    posT: "Μονάδες Χιλιάδες",
    posH: "Εκατοντάδες",
    q1Template: (num, digit, name) => `Στον αριθμό ${num}, ποια είναι η πραγματική αξία του ψηφίου ${digit} (στη θέση «${name}»);`,
    q1Explain: (digit, name, val) => `Το ψηφίο ${digit} βρίσκεται στη θέση «${name}», επομένως η πραγματική του αξία είναι ${val}.`,
    q2Template: (expr) => `Ποιος αριθμός σχηματίζεται από το ανάπτυγμα: ${expr};`,
    q2Explain: (expr, total) => `Προσθέτοντας όλες τις αξίες θέσης σχηματίζεται ο αριθμός: ${expr} ＝ ${total}.`,
    q3Template: (n1, n2) => `Ποια σχέση σύγκρισης είναι ορθή ανάμεσα στους αριθμούς ${n1} και ${n2};`,
    q3Explain: (n1, n2, rel) => `Ο αριθμός ${n1} έχει μεγαλύτερη αξία στην κλάση των μονάδων από τον ${n2}, άρα ισχύει ${rel}.`,
    tfPool: [
      {
        q: 'Στον αριθμό 542.310, το ψηφίο 5 ανήκει στην τάξη των Εκατοντάδων Χιλιάδων.',
        correct: 'Σωστό',
        explain: 'Το ψηφίο 5 βρίσκεται στην 6η θέση από δεξιά, άρα έχει αξία 500.000 (Εκατοντάδες Χιλιάδες).'
      },
      {
        q: 'Ο αριθμός 100.000 είναι κατά ακριβώς 1 μονάδα μεγαλύτερος από τον αριθμό 99.999.',
        correct: 'Σωστό',
        explain: 'Ισχύει η διαδοχή 99.999 ＋ 1 ＝ 100.000.'
      },
      {
        q: 'Στους μεγάλους αριθμούς, χωρίζουμε τα ψηφία σε κλάσεις ανά 2 ψηφία από τα δεξιά προς τα αριστερά.',
        correct: 'Λάθος',
        explain: 'Στο δεκαδικό σύστημα αρίθμησης οι κλάσεις σχηματίζονται αυστηρά ανά τριάδες ψηφίων (Μονάδες, Δεκάδες, Εκατοντάδες).'
      },
      {
        q: 'Στον αριθμό 405.020, η θέση των Δεκάδων Χιλιάδων έχει τιμή 0.',
        correct: 'Σωστό',
        explain: 'Το 5ο ψηφίο από τα δεξιά είναι το 0, άρα υπάρχουν 0 Δεκάδες Χιλιάδες.'
      },
      {
        q: 'Ο μεγαλύτερος εξαψήφιος φυσικός αριθμός είναι ο 999.999.',
        correct: 'Σωστό',
        explain: 'Ο αμέσως επόμενος φυσικός αριθμός είναι το 1.000.000, ο οποίος είναι επταψήφιος.'
      },
      {
        q: 'Ο αριθμός 250.000 είναι μεγαλύτερος από τον αριθμό 300.000.',
        correct: 'Λάθος',
        explain: 'Συγκρίνοντας τις εκατοντάδες χιλιάδων: 2 ΕΧ ＜ 3 ΕΧ, επομένως 250.000 ＜ 300.000.'
      },
      {
        q: '10 Εκατοντάδες Χιλιάδες ισούνται με 1 Εκατομμύριο (1.000.000).',
        correct: 'Σωστό',
        explain: 'Ισχύει η ισότητα 10 · 100.000 ＝ 1.000.000.'
      }
    ]
  },
  en: {
    pageTitle: "Exercises: Large Numbers | LearnMaths.gr",
    pageDesc: "Interactive Grade 4 math exercises on large numbers up to 1,000,000: place value, expanded form composition, comparisons, and properties.",
    backText: "Grade 4",
    theoryBtn: "Theory",
    badge: "GRADE 4 • PRACTICE",
    title: "📝 Exercises: Large Numbers (up to 1,000,000)",
    subtitle: "Click «New Exercises» to generate new numbers and variations from the question bank!",
    newQuestionsBtn: "New Exercises",
    answerPrompt: "Answer:",
    inputPlaceholder: "Enter number",
    correctFeedback: "Correct answer!",
    correctAnswerPrefix: "The correct answer is",
    correctRelationPrefix: "The correct relation is:",
    statementIs: "The statement is",
    trueLabel: "True",
    falseLabel: "False",
    submitBtn: "🎯 Check Answers",
    scoreLabel: "Score:",
    successRate: "Accuracy:",
    fillReminder: "Complete all questions and click «Check Answers»!",
    // Digit value labels
    posHT: "Hundred Thousands",
    posTT: "Ten Thousands",
    posT: "Thousands",
    posH: "Hundreds",
    q1Template: (num, digit, name) => `In the number ${num}, what is the actual place value of the digit ${digit} (in the «${name}» position)?`,
    q1Explain: (digit, name, val) => `The digit ${digit} is in the «${name}» position, so its place value is ${val}.`,
    q2Template: (expr) => `What number is formed by the expanded form: ${expr}?`,
    q2Explain: (expr, total) => `Adding all place values together gives: ${expr} ＝ ${total}.`,
    q3Template: (n1, n2) => `Which comparison statement is correct between ${n1} and ${n2}?`,
    q3Explain: (n1, n2, rel) => `The number ${n1} has a greater value in the units period than ${n2}, so ${rel}.`,
    tfPool: [
      {
        q: 'In the number 542,310, the digit 5 is in the Hundred Thousands place.',
        correct: 'True',
        explain: 'The digit 5 is the 6th digit from the right, so its value is 500,000 (Hundred Thousands).'
      },
      {
        q: 'The number 100,000 is exactly 1 unit greater than the number 99,999.',
        correct: 'True',
        explain: 'The sequence follows: 99,999 ＋ 1 ＝ 100,000.'
      },
      {
        q: 'In large numbers, we separate digits into periods of 2 digits from right to left.',
        correct: 'False',
        explain: 'In the decimal system, periods are strictly grouped in threes (Units, Tens, Hundreds).'
      },
      {
        q: 'In the number 405,020, the Ten Thousands place has a digit of 0.',
        correct: 'True',
        explain: 'The 5th digit from the right is 0, so there are 0 Ten Thousands.'
      },
      {
        q: 'The largest 6-digit natural number is 999,999.',
        correct: 'True',
        explain: 'The consecutive natural number is 1,000,000, which has 7 digits.'
      },
      {
        q: 'The number 250,000 is greater than the number 300,000.',
        correct: 'False',
        explain: 'Comparing the hundred thousands: 2 HT ＜ 3 HT, therefore 250,000 ＜ 300,000.'
      },
      {
        q: '10 Hundred Thousands are equal to 1 Million (1,000,000).',
        correct: 'True',
        explain: 'The identity holds: 10 · 100,000 ＝ 1,000,000.'
      }
    ]
  }
};

// ----------------------------------------------------
// ΣΥΝΑΡΤΗΣΕΙΣ ΔΗΜΙΟΥΡΓΙΑΣ ΔΥΝΑΜΙΚΩΝ ΑΣΚΗΣΕΩΝ
// ----------------------------------------------------

function makeDigitValueQuestion(locale, t, formatNum, prevQ = null) {
  let total, pos;
  while (true) {
    const digits = [];
    while (digits.length < 6) {
      const d = getRandomInt(digits.length === 0 ? 1 : 0, 9);
      if (!digits.includes(d)) {
        digits.push(d);
      }
    }

    const [ex, dx, x, e, d, m] = digits;
    total = ex * 100000 + dx * 10000 + x * 1000 + e * 100 + d * 10 + m;

    const positions = [
      { name: t.posHT, digit: ex, value: ex * 100000 },
      { name: t.posTT, digit: dx, value: dx * 10000 },
      { name: t.posT, digit: x, value: x * 1000 },
      { name: t.posH, digit: e, value: e * 100 }
    ];

    pos = positions[getRandomInt(0, positions.length - 1)];

    if (!prevQ || prevQ.correct !== pos.value) break;
  }

  return {
    q: t.q1Template(formatNum(total), pos.digit, pos.name),
    correct: pos.value,
    explainText: t.q1Explain(pos.digit, pos.name, formatNum(pos.value))
  };
}

function makeCompositionQuestion(locale, t, formatNum, prevQ = null) {
  let ex, dx, x, e, d, m, total;

  while (true) {
    ex = getRandomInt(1, 9) * 100000;
    dx = getRandomInt(1, 9) * 10000;
    x = getRandomInt(1, 9) * 1000;
    e = getRandomInt(1, 9) * 100;
    d = getRandomInt(1, 9) * 10;
    m = getRandomInt(1, 9);
    total = ex + dx + x + e + d + m;

    if (!prevQ || prevQ.correct !== total) break;
  }

  const exprStr = `${formatNum(ex)} ＋ ${formatNum(dx)} ＋ ${formatNum(x)} ＋ ${formatNum(e)} ＋ ${d} ＋ ${m}`;

  return {
    q: t.q2Template(exprStr),
    correct: total,
    explainText: t.q2Explain(exprStr, formatNum(total))
  };
}

function makeComparisonQuestion(locale, t, formatNum, prevQ = null) {
  let num1, num2, correct;

  while (true) {
    const base = getRandomInt(100, 850) * 1000;
    const diff = getRandomInt(1, 9) * 100;
    num1 = base + diff;
    num2 = base;

    correct = `${formatNum(num1)} ＞ ${formatNum(num2)}`;
    if (!prevQ || prevQ.correct !== correct) break;
  }

  const rawOptions = [
    `${formatNum(num1)} ＞ ${formatNum(num2)}`,
    `${formatNum(num1)} ＜ ${formatNum(num2)}`,
    `${formatNum(num1)} ＝ ${formatNum(num2)}`,
    `${formatNum(num2)} ＞ ${formatNum(num1)}`
  ];

  const options = [...new Set(rawOptions)].sort(() => Math.random() - 0.5);

  return {
    q: t.q3Template(formatNum(num1), formatNum(num2)),
    correct,
    options,
    explainText: t.q3Explain(formatNum(num1), formatNum(num2), correct)
  };
}

function generateQuestions(locale) {
  const t = translations[locale] || translations.el;
  const formatNum = (num) => num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');

  const q1 = makeDigitValueQuestion(locale, t, formatNum);
  const q2 = makeDigitValueQuestion(locale, t, formatNum, q1);

  const q3 = makeCompositionQuestion(locale, t, formatNum);
  const q4 = makeCompositionQuestion(locale, t, formatNum, q3);

  const q5 = makeComparisonQuestion(locale, t, formatNum);
  const q6 = makeComparisonQuestion(locale, t, formatNum, q5);

  const tf1 = t.tfPool[getRandomInt(0, t.tfPool.length - 1)];
  let tf2;
  while (true) {
    tf2 = t.tfPool[getRandomInt(0, t.tfPool.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return { q1, q2, q3, q4, q5, q6, q7: tf1, q8: tf2 };
}

export default function MegaloiArithmoiAskPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const formatNumber = (num) => num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');

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
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Input Number Ασκήσεων (Q1 - Q4)
  const renderInputNumber = (qKey, qData, numLabel, colorClass) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className={`${colorClass} text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}>
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">{t.answerPrompt}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.inputPlaceholder}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-44 sm:w-56 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-teal-900 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
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
                {t.correctAnswerPrefix} <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render MCQ (Q5 & Q6, 4 Επιλογές)
  const renderMcqQuestion = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
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
            {qData.q}
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
                    ? 'border-teal-600 bg-teal-50/80 font-bold text-teal-950 shadow-sm'
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
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500 shrink-0"
                />
                <span className="break-words whitespace-normal leading-snug flex-1 font-mono font-bold text-sm sm:text-base">
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
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctRelationPrefix} <strong className="font-mono font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Σωστό / Λάθος (Q7 & Q8)
  const renderTrueFalse = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    const trueVal = t.trueLabel;
    const falseVal = t.falseLabel;

    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-teal-700 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        <div className="flex gap-3 sm:pl-11">
          {[trueVal, falseVal].map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => handleInputChange(qKey, opt)}
              disabled={submitted}
              className={`px-6 sm:px-8 py-3 rounded-2xl font-black text-sm sm:text-base border transition active:scale-95 touch-manipulation select-none ${
                answers[qKey] === opt
                  ? (opt === trueVal ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-rose-600 text-white border-rose-700 shadow-md')
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explain}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.statementIs} <strong className="font-bold text-rose-900">«{qData.correct}»</strong>: {qData.explain}
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
          href="/d-dimotikou/20-megaloi-arithmoi"
          className="bg-teal-100 hover:bg-teal-200 text-teal-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.title}
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-teal-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInputNumber('q1', questions.q1, 1, 'bg-teal-600')}
          {renderInputNumber('q2', questions.q2, 2, 'bg-teal-600')}

          {renderInputNumber('q3', questions.q3, 3, 'bg-emerald-600')}
          {renderInputNumber('q4', questions.q4, 4, 'bg-emerald-600')}

          {renderMcqQuestion('q5', questions.q5, 5)}
          {renderMcqQuestion('q6', questions.q6, 6)}

          {renderTrueFalse('q7', questions.q7, 7)}
          {renderTrueFalse('q8', questions.q8, 8)}

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
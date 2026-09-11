// pages/d-dimotikou/20-megaloi-arithmoi-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// ----------------------------------------------------
// ΣΥΝΑΡΤΗΣΕΙΣ ΔΗΜΙΟΥΡΓΙΑΣ ΔΥΝΑΜΙΚΩΝ ΑΣΚΗΣΕΩΝ
// ----------------------------------------------------

// 1. Αξία Θέσης Ψηφίου (Input) - Με εγγύηση ΜΟΝΑΔΙΚΟΤΗΤΑΣ ΨΗΦΙΩΝ
function makeDigitValueQuestion(prevQ = null) {
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
      { name: 'Εκατοντάδες Χιλιάδες', digit: ex, value: ex * 100000 },
      { name: 'Δεκάδες Χιλιάδες', digit: dx, value: dx * 10000 },
      { name: 'Μονάδες Χιλιάδες', digit: x, value: x * 1000 },
      { name: 'Εκατοντάδες', digit: e, value: e * 100 }
    ];

    pos = positions[getRandomInt(0, positions.length - 1)];

    if (!prevQ || prevQ.correct !== pos.value) break;
  }

  return {
    q: `Στον αριθμό ${formatNumber(total)}, ποια είναι η πραγματική αξία του ψηφίου ${pos.digit} (στη θέση «${pos.name}»);`,
    correct: pos.value,
    explainText: `Το ψηφίο ${pos.digit} βρίσκεται στη θέση «${pos.name}», επομένως η πραγματική του αξία είναι ${formatNumber(pos.value)}.`
  };
}

// 2. Σύνθεση Αριθμού από Άθροισμα (Input)
function makeCompositionQuestion(prevQ = null) {
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

  const exprStr = `${formatNumber(ex)} ＋ ${formatNumber(dx)} ＋ ${formatNumber(x)} ＋ ${formatNumber(e)} ＋ ${d} ＋ ${m}`;

  return {
    q: `Ποιος αριθμός σχηματίζεται από το ανάπτυγμα: ${exprStr};`,
    correct: total,
    explainText: `Προσθέτοντας όλες τις αξίες θέσης σχηματίζεται ο αριθμός: ${exprStr} ＝ ${formatNumber(total)}.`
  };
}

// 3. Σύγκριση Μεγάλων Αριθμών (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeComparisonQuestion(prevQ = null) {
  let num1, num2, correct;

  while (true) {
    const base = getRandomInt(100, 850) * 1000;
    const diff = getRandomInt(1, 9) * 100;
    num1 = base + diff;
    num2 = base;

    correct = `${formatNumber(num1)} ＞ ${formatNumber(num2)}`;
    if (!prevQ || prevQ.correct !== correct) break;
  }

  const options = [
    `${formatNumber(num1)} ＞ ${formatNumber(num2)}`,
    `${formatNumber(num1)} ＜ ${formatNumber(num2)}`,
    `${formatNumber(num1)} ＝ ${formatNumber(num2)}`,
    `${formatNumber(num2)} ＞ ${formatNumber(num1)}`
  ].sort(() => Math.random() - 0.5);

  return {
    q: `Ποια σχέση σύγκρισης είναι ορθή ανάμεσα στους αριθμούς ${formatNumber(num1)} και ${formatNumber(num2)};`,
    correct,
    options,
    explainText: `Ο αριθμός ${formatNumber(num1)} έχει μεγαλύτερη αξία στην κλάση των μονάδων από τον ${formatNumber(num2)}, άρα ισχύει ${correct}.`
  };
}

// 4. Σωστό / Λάθος για Μεγάλους Αριθμούς
// (Χωρίς «Σωστά!» ή «Λάθος!» στο κείμενο εξήγησης)
const TRUE_FALSE_POOL = [
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
];

// ----------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 8 ΕΡΩΤΗΣΕΩΝ
// ----------------------------------------------------
function generateQuestions() {
  const q1 = makeDigitValueQuestion();
  const q2 = makeDigitValueQuestion(q1);

  const q3 = makeCompositionQuestion();
  const q4 = makeCompositionQuestion(q3);

  const q5 = makeComparisonQuestion();
  const q6 = makeComparisonQuestion(q5);

  const tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return { q1, q2, q3, q4, q5, q6, q7: tf1, q8: tf2 };
}

export default function MegaloiArithmoiAskPage() {
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

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/\D/g, '');
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
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">Απάντηση:</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="Γράψε τον αριθμό"
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
                Η σωστή απάντηση είναι <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>. {qData.explainText}
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
                <span className="leading-snug font-mono font-bold text-sm sm:text-base">{opt}</span>
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
                Η ορθή σχέση είναι: <strong className="font-mono font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
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
          {['Σωστό', 'Λάθος'].map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => handleInputChange(qKey, opt)}
              disabled={submitted}
              className={`px-6 sm:px-8 py-3 rounded-2xl font-black text-sm sm:text-base border transition active:scale-95 touch-manipulation select-none ${
                answers[qKey] === opt
                  ? (opt === 'Σωστό' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-rose-600 text-white border-rose-700 shadow-md')
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
                Η πρόταση είναι <strong className="font-bold text-rose-900">«{qData.correct}»</strong>: {qData.explain}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Οι Μεγάλοι Αριθμοί | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στους μεγάλους αριθμούς έως το 1.000.000: αξία θέσης ψηφίου, σύνθεση από ανάπτυγμα, σύγκριση και θεωρητικές ιδιότητες."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/20-megaloi-arithmoi"
          className="bg-teal-100 hover:bg-teal-200 text-teal-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Οι Μεγάλοι Αριθμοί (έως 1.000.000)
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», οι αριθμοί και οι πράξεις ανανεώνονται αυτόματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-teal-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
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
                🎯 Έλεγχος Απαντήσεων
              </button>
            </div>
          )}
        </form>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                Επιτυχία: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

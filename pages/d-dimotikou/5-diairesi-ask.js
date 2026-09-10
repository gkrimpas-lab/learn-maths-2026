import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// 1. Άσκηση: Τέλεια Διαίρεση - Εύρεση Πηλίκου (Input)
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

// 2. Άσκηση: Ατελής Διαίρεση - Εύρεση Υπολοίπου (Input)
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

// 3. Άσκηση: Επαλήθευση Ευκλείδειας Διαίρεσης (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeVerificationMCQQuestion() {
  const divisor = getRandomInt(3, 9);
  const quotient = getRandomInt(14, 75);
  const remainder = getRandomInt(1, divisor - 1);
  const dividend = divisor * quotient + remainder;

  const correctText = `(${divisor} · ${quotient}) ＋ ${remainder} ＝ ${dividend}`;
  const wrong1 = `(${divisor} · ${quotient}) ＝ ${dividend}`;
  const wrong2 = `(${divisor} ＋ ${quotient}) · ${remainder} ＝ ${dividend}`;
  const wrong3 = `(${dividend} － ${remainder}) · ${divisor} ＝ ${quotient}`;

  const choices = [
    { text: correctText, isCorrect: true },
    { text: wrong1, isCorrect: false },
    { text: wrong2, isCorrect: false },
    { text: wrong3, isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  return {
    dividend,
    divisor,
    quotient,
    remainder,
    options: choices,
    correct: correctText
  };
}

// 4. Άσκηση: Εύρεση Άγνωστου Διαιρετέου (Input)
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

// Δημιουργία των 8 Ερωτήσεων
function generateQuestions() {
  return {
    q1: makeExactDivisionQuestion(),
    q2: makeExactDivisionQuestion(),
    q3: makeRemainderQuestion(),
    q4: makeRemainderQuestion(),
    q5: makeVerificationMCQQuestion(),
    q6: makeVerificationMCQQuestion(),
    q7: makeMissingDividendQuestion(),
    q8: makeMissingDividendQuestion()
  };
}

export default function DiairesiAskPage() {
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
            Υπολόγισε το πηλίκο της τέλειας διαίρεσης: <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{formatNumber(qData.dividend)} : {qData.divisor}</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{formatNumber(qData.dividend)}</span>
            <span>:</span>
            <span>{qData.divisor}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="Πηλίκο"
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
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                Ο διαιρετέος μοιράζεται ακριβώς: {formatNumber(qData.dividend)} : {qData.divisor} ＝ <span className="font-mono font-bold">{formatNumber(qData.correct)}</span> (αφού {qData.divisor} · {formatNumber(qData.correct)} ＝ {formatNumber(qData.dividend)}).
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Το ακριβές πηλίκο είναι {formatNumber(qData.dividend)} : {qData.divisor} ＝ <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>.
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
          <span className="bg-amber-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            Πόσο είναι το <span className="text-amber-600 font-extrabold">υπόλοιπο (υ)</span> της διαίρεσης <span className="text-amber-600 font-mono font-black text-lg">{formatNumber(qData.dividend)} : {qData.divisor}</span>;
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">
              Υπόλοιπο (υ):
            </span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="Υπόλοιπο"
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
                Το πηλίκο είναι {qData.quotient} ({qData.divisor} · {qData.quotient} ＝ {formatNumber(qData.divisor * qData.quotient)}) και περισσεύει υπόλοιπο <span className="font-mono font-bold">{qData.correct}</span> (με {qData.correct} ＜ {qData.divisor}).
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Το υπόλοιπο της διαίρεσης είναι <span className="font-mono font-bold text-rose-900">{qData.correct}</span>, διότι {formatNumber(qData.dividend)} ＝ ({qData.divisor} · {qData.quotient}) ＋ {qData.correct}.
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
            Ποια σχέση εκφράζει την ορθή <span className="text-purple-600 font-extrabold">επαλήθευση</span> της διαίρεσης <span className="text-purple-600 font-mono font-black text-lg">{formatNumber(qData.dividend)} : {qData.divisor} ＝ {qData.quotient}</span> (υπόλοιπο {qData.remainder});
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
                <span className="font-mono font-bold text-sm sm:text-base leading-snug">{opt.text}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                Εφαρμόζοντας τον τύπο της Ευκλείδειας διαίρεσης: Δ ＝ (δ · π) ＋ υ, ισχύει ({qData.divisor} · {qData.quotient}) ＋ {qData.remainder} ＝ <span className="font-mono font-bold">{formatNumber(qData.dividend)}</span>.
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η σωστή επαλήθευση είναι: <span className="font-mono font-bold text-rose-900">{qData.correct}</span>.
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
            Ένας αριθμός όταν διαιρεθεί με το <span className="text-teal-600 font-mono font-black text-lg">{qData.divisor}</span> δίνει πηλίκο <span className="text-teal-600 font-mono font-black text-lg">{qData.quotient}</span> και υπόλοιπο <span className="text-teal-600 font-mono font-black text-lg">{qData.remainder}</span>. Ποιος είναι ο αρχικός διαιρετέος (Δ);
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">
              Διαιρετέος (Δ):
            </span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="Γράψε τον Δ"
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
                Υπολογίζουμε: ({qData.divisor} · {qData.quotient}) ＋ {qData.remainder} ＝ {formatNumber(qData.divisor * qData.quotient)} ＋ {qData.remainder} ＝ <span className="font-mono font-bold">{formatNumber(qData.correct)}</span>.
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Ο αρχικός διαιρετέος είναι ({qData.divisor} · {qData.quotient}) ＋ {qData.remainder} ＝ <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Η Διαίρεση με Μονοψήφιο | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στη διαίρεση με μονοψήφιο διαιρέτη: τέλειες διαιρέσεις, υπόλοιπο, επαλήθευση και εύρεση διαιρετέου."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/5-diairesi"
          className="bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Η Διαίρεση
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», οι αριθμοί και οι πράξεις ανανεώνονται αυτόματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-purple-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
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

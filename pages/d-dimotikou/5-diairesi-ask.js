import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// 1. Ασκηση: Τέλεια Διαίρεση (Εύρεση Πηλίκου)
function makeExactDivisionQuestion() {
  const divisor = getRandomInt(2, 9);
  const quotient = getRandomInt(12, 99);
  const dividend = divisor * quotient;

  return {
    dividend,
    divisor,
    correct: quotient
  };
}

// 2. Ασκηση: Ατελής Διαίρεση (Εύρεση Υπολοίπου)
function makeRemainderQuestion() {
  const divisor = getRandomInt(3, 9);
  const quotient = getRandomInt(12, 85);
  const remainder = getRandomInt(1, divisor - 1);
  const dividend = (divisor * quotient) + remainder;

  return {
    dividend,
    divisor,
    correct: remainder
  };
}

// 3. Ασκηση: Επαλήθευση (MCQ 4 επιλογών)
function makeVerificationMCQQuestion() {
  const divisor = getRandomInt(3, 9);
  const quotient = getRandomInt(12, 50);
  const remainder = getRandomInt(1, divisor - 1);
  const dividend = (divisor * quotient) + remainder;

  const correctText = `(${divisor} × ${quotient}) + ${remainder} = ${dividend}`;
  const wrong1 = `(${divisor} × ${quotient}) = ${dividend}`;
  const wrong2 = `(${divisor} + ${quotient}) × ${remainder} = ${dividend}`;
  const wrong3 = `(${dividend} - ${remainder}) + ${divisor} = ${quotient}`;

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

// 4. Ασκηση: Εύρεση Άγνωστου Διαιρετέου (Input)
function makeMissingDividendQuestion() {
  const divisor = getRandomInt(2, 9);
  const quotient = getRandomInt(10, 45);
  const remainder = getRandomInt(0, divisor - 1);
  const dividend = (divisor * quotient) + remainder;

  return {
    divisor,
    quotient,
    remainder,
    correct: dividend
  };
}

// Δημιουργία 8 Ερωτήσεων
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
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
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
    setAnswers(prev => ({ ...prev, [key]: val }));
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
  const renderExactDivision = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Υπολόγισε το πηλίκο της τέλειας διαίρεσης: <span className="text-indigo-600 font-mono font-black text-xl">{formatNumber(qData.dividend)} : {qData.divisor}</span>
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="number"
          placeholder="Γράψε το πηλίκο"
          value={answers[qKey]}
          onChange={(e) => handleInputChange(qKey, e.target.value)}
          disabled={submitted}
          className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Το σωστό πηλίκο είναι: <span className="font-mono font-black">{formatNumber(qData.correct)}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q3 & Q4: Εύρεση Υπολοίπου (Input)
  const renderRemainder = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-amber-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Πόσο είναι το <span className="text-amber-600 font-bold">υπόλοιπο (υ)</span> της διαίρεσης <span className="text-amber-600 font-mono font-black">{formatNumber(qData.dividend)} : {qData.divisor}</span>;
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="number"
          placeholder="Γράψε το υπόλοιπο"
          value={answers[qKey]}
          onChange={(e) => handleInputChange(qKey, e.target.value)}
          disabled={submitted}
          className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Το υπόλοιπο είναι: <span className="font-mono font-black">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q5 & Q6: Επαλήθευση (MCQ)
  const renderVerificationMCQ = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-purple-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Ποια πρόταση εκφράζει τη σωστή <span className="text-purple-600 font-extrabold">επαλήθευση</span> για τη διαίρεση <span className="text-purple-600 font-mono font-black">{formatNumber(qData.dividend)} : {qData.divisor} = {qData.quotient}</span> (υπόλοιπο {qData.remainder});
        </h3>
      </div>

      <div className="space-y-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt.text 
                ? 'border-purple-600 bg-purple-50/80 font-bold' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input 
              type="radio" 
              name={qKey} 
              value={opt.text}
              checked={answers[qKey] === opt.text}
              onChange={() => handleInputChange(qKey, opt.text)}
              disabled={submitted}
              className="w-5 h-5 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-gray-800 font-mono text-sm md:text-base">{opt.text}</span>
          </label>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Η σωστή επαλήθευση είναι: <span className="font-mono font-black">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q7 & Q8: Εύρεση Άγνωστου Διαιρετέου (Input)
  const renderMissingDividend = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-teal-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Ένας αριθμός όταν διαιρεθεί με το <span className="text-teal-600 font-mono font-black">{qData.divisor}</span> δίνει πηλίκο <span className="text-teal-600 font-mono font-black">{qData.quotient}</span> και υπόλοιπο <span className="text-teal-600 font-mono font-black">{qData.remainder}</span>. Ποιος είναι ο αρχικός αριθμός (Δ);
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="number"
          placeholder="Γράψε τον Διαιρετέο (Δ)"
          value={answers[qKey]}
          onChange={(e) => handleInputChange(qKey, e.target.value)}
          disabled={submitted}
          className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Ο αρχικός αριθμός είναι: <span className="font-mono font-black">{formatNumber(qData.correct)}</span> ({qData.divisor} × {qData.quotient} + {qData.remainder})</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>➗ Ασκήσεις: Διαίρεση - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/d-dimotikou/5-diairesi" className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
                <span>📖</span> Θεωρία
              </Link>
              <button 
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10 space-y-8`}>
          
          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Η Διαίρεση
              </h1>
              <p className="text-purple-100 text-sm md:text-base mt-1">
                Πατώντας «Νέες Ασκήσεις» οι αριθμοί αλλάζουν αυτόματα.
              </p>
            </div>

            <button
              onClick={loadNewQuestions}
              className="bg-white text-gray-900 font-black px-5 py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition transform active:scale-95 text-sm whitespace-nowrap"
            >
              🔄 Αλλαγή Αριθμών
            </button>
          </div>

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
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
                >
                  🎯 Έλεγχος Απαντήσεων
                </button>
              </div>
            )}

          </form>

        </main>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-4 px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-3`}>
          
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-sm font-bold text-slate-300">
                Ποσοστό Επιτυχίας: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                <span>🔄</span> Παίξε ξανά με νέους αριθμούς!
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden md:block">
                Συμπλήρωσε όλες τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

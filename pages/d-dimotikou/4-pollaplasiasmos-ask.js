import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIntEndingInZero(min, max) {
  const raw = Math.floor(Math.random() * (max - min + 1)) + min;
  return Math.round(raw / 10) * 10;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// 1. Ασκηση: Πολλαπλασιασμός με πολλαπλάσια του 10 (Input)
function makeRoundMultiplicationQuestion() {
  const a = getRandomInt(12, 45);
  const b = getRandomIntEndingInZero(10, 50);
  return {
    a,
    b,
    correct: a * b
  };
}

// 2. Ασκηση: Εύρεση Μερικού Γινομένου (Input)
function makePartialProductQuestion() {
  const a = getRandomInt(14, 45);
  const unitsB = getRandomInt(2, 9);
  const tensB = getRandomInt(1, 4);
  const b = tensB * 10 + unitsB;

  const isFirstPartial = Math.random() > 0.5;

  if (isFirstPartial) {
    return {
      a,
      b,
      partialName: `1ο μερικό γινόμενο (${a} × ${unitsB})`,
      correct: a * unitsB
    };
  } else {
    return {
      a,
      b,
      partialName: `2ο μερικό γινόμενο (${a} × ${tensB * 10})`,
      correct: a * (tensB * 10)
    };
  }
}

// 3. Ασκηση: Πολλαπλασιασμός Διψήφιων με Πολλαπλή Επιλογή (4 επιλογές)
function makeMCQMultiplicationQuestion() {
  const a = getRandomInt(14, 38);
  const b = getRandomInt(12, 28);
  const correct = a * b;

  // Παραγωγή 3 λανθασμένων απαντήσεων (με συχνά λάθη)
  const wrong1 = correct + 10;
  const wrong2 = correct - 10;
  const wrong3 = (a * Math.floor(b / 10) * 10) + (a * (b % 10)); // πιθανό υπολογιστικό λάθος

  let choices = [
    { text: formatNumber(correct), isCorrect: true },
    { text: formatNumber(wrong1), isCorrect: false },
    { text: formatNumber(wrong2), isCorrect: false },
    { text: formatNumber(wrong3 !== correct ? wrong3 : correct + 20), isCorrect: false }
  ];

  // Αφαίρεση τυχόν διπλότυπων αν προκύψουν
  const uniqueChoices = [];
  const map = new Map();
  for (const item of choices) {
    if (!map.has(item.text)) {
      map.set(item.text, true);
      uniqueChoices.push(item);
    }
  }

  // Αν λείπουν επιλογές λόγω διπλότυπων, συμπληρώνουμε
  while (uniqueChoices.length < 4) {
    const dummy = correct + getRandomInt(5, 30);
    const dummyText = formatNumber(dummy);
    if (!map.has(dummyText)) {
      map.set(dummyText, true);
      uniqueChoices.push({ text: dummyText, isCorrect: false });
    }
  }

  return {
    a,
    b,
    options: uniqueChoices.sort(() => Math.random() - 0.5),
    correct: formatNumber(correct)
  };
}

// 4. Ασκηση: Τελικός Πολλαπλασιασμός Διψήφιων (Input)
function makeFullMultiplicationQuestion() {
  const a = getRandomInt(12, 35);
  const b = getRandomInt(12, 28);
  return {
    a,
    b,
    correct: a * b
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  return {
    q1: makeRoundMultiplicationQuestion(),
    q2: makeRoundMultiplicationQuestion(),
    q3: makePartialProductQuestion(),
    q4: makePartialProductQuestion(),
    q5: makeMCQMultiplicationQuestion(),
    q6: makeMCQMultiplicationQuestion(),
    q7: makeFullMultiplicationQuestion(),
    q8: makeFullMultiplicationQuestion()
  };
}

export default function PollaplasiasmosAskPage() {
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

  // Render Q1 & Q2: Στρογγυλοί Αριθμοί (Input)
  const renderRoundMultiplication = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-emerald-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Υπολόγισε το γινόμενο: <span className="text-emerald-600 font-mono font-black text-xl">{qData.a} × {qData.b}</span>
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="number"
          placeholder="Γράψε το αποτέλεσμα"
          value={answers[qKey]}
          onChange={(e) => handleInputChange(qKey, e.target.value)}
          disabled={submitted}
          className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Το σωστό αποτέλεσμα είναι: <span className="font-mono font-black">{formatNumber(qData.correct)}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q3 & Q4: Μερικά Γινόμενα (Input)
  const renderPartialProduct = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-amber-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Στον πολλαπλασιασμό <span className="text-amber-600 font-mono font-black">{qData.a} × {qData.b}</span>, πόσο είναι το <span className="text-amber-600 font-bold">{qData.partialName}</span>;
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="number"
          placeholder="Γράψε το μερικό γινόμενο"
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
            <p className="text-red-600">❌ Λάθος. Το μερικό γινόμενο είναι: <span className="font-mono font-black">{formatNumber(qData.correct)}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q5 & Q6: Πολλαπλή Επιλογή με 4 επιλογές (MCQ)
  const renderMCQMultiplication = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-purple-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Επίλεξε το σωστό γινόμενο: <span className="text-purple-600 font-mono font-black text-xl">{qData.a} × {qData.b}</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
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
            <span className="text-gray-800 font-mono text-base">{opt.text}</span>
          </label>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Το σωστό αποτέλεσμα είναι: <span className="font-mono font-black">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q7 & Q8: Τελικός Πολλαπλασιασμός (Input)
  const renderFullMultiplication = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Υπολόγισε το τελικό γινόμενο: <span className="text-indigo-600 font-mono font-black text-xl">{qData.a} × {qData.b}</span>
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="number"
          placeholder="Γράψε το τελικό γινόμενο"
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
            <p className="text-red-600">❌ Λάθος. Το τελικό γινόμενο είναι: <span className="font-mono font-black">{formatNumber(qData.correct)}</span></p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>✖️ Ασκήσεις: Πολλαπλασιασμός - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/4-pollaplasiasmos" className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Πολλαπλασιασμός με Διψήφιο
              </h1>
              <p className="text-emerald-100 text-sm md:text-base mt-1">
                8 Δυναμικές ασκήσεις! Πατώντας **«Νέες Ασκήσεις»** οι αριθμοί αλλάζουν αυτόματα.
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

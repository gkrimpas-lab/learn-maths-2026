import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 1. Ασκηση: Μετατροπή Κλάσματος σε Δεκαδικό με 3 ψηφία (Input)
function makeFractionToDecimalQuestion(prevQuestion = null) {
  let num, val;
  const den = 1000;

  while (true) {
    num = getRandomInt(1, 4999);
    val = (num / den).toFixed(3).replace('.', ',');

    if (!prevQuestion || prevQuestion.num !== num) {
      break;
    }
  }

  return { num, den, correct: val };
}

// 2. Ασκηση: Μετατροπή Δεκαδικού σε Κλάσμα (MCQ)
function makeDecimalToFractionQuestion(prevQuestion = null) {
  let num, decVal;
  const den = 1000;

  while (true) {
    num = getRandomInt(12, 999);
    decVal = (num / den).toFixed(3).replace('.', ',');

    if (!prevQuestion || prevQuestion.decVal !== decVal) {
      break;
    }
  }

  const correctText = `${num}/${den}`;
  const wrong1 = `${num}/100`;
  const wrong2 = `${num}/10`;
  const wrong3 = `${num + 10}/${den}`;

  const choices = [
    { text: correctText, isCorrect: true },
    { text: wrong1, isCorrect: false },
    { text: wrong2, isCorrect: false },
    { text: wrong3, isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  return { decVal, options: choices, correct: correctText };
}

// 3. Ασκηση: Αξία Θέσης Ψηφίου (Input)
function makePlaceValueQuestion(prevQuestion = null) {
  let intPart, tenths, hundredths, thousandths, placeType, decStr, correctDigit;

  const places = ['δέκατα', 'εκατοστά', 'χιλιοστά'];

  while (true) {
    intPart = getRandomInt(0, 9);
    tenths = getRandomInt(1, 9);
    hundredths = getRandomInt(1, 9);
    thousandths = getRandomInt(1, 9);

    placeType = places[getRandomInt(0, places.length - 1)];
    decStr = `${intPart},${tenths}${hundredths}${thousandths}`;

    if (placeType === 'δέκατα') correctDigit = tenths;
    if (placeType === 'εκατοστά') correctDigit = hundredths;
    if (placeType === 'χιλιοστά') correctDigit = thousandths;

    if (!prevQuestion || prevQuestion.decStr !== decStr || prevQuestion.placeType !== placeType) {
      break;
    }
  }

  return { decStr, placeType, correct: correctDigit };
}

// 4. Ασκηση: Σύγκριση Δεκαδικών με 3 ψηφία (<, =, >)
function makeComparisonQuestion(prevQuestion = null) {
  let valA, valB, strA, strB, correctSym;

  while (true) {
    const intPart = getRandomInt(0, 9);
    const decA = getRandomInt(1, 999);
    let decB = getRandomInt(1, 999);

    valA = parseFloat(`${intPart}.${decA.toString().padStart(3, '0')}`);
    valB = parseFloat(`${intPart}.${decB.toString().padStart(3, '0')}`);

    if (Math.random() > 0.75) valB = valA; // 25% πιθανότητα για ίσα

    correctSym = '=';
    if (valA > valB) correctSym = '>';
    if (valA < valB) correctSym = '<';

    strA = valA.toFixed(3).replace('.', ',');
    strB = valB.toFixed(3).replace('.', ',');

    if (!prevQuestion || prevQuestion.strA !== strA || prevQuestion.strB !== strB) {
      break;
    }
  }

  return { strA, strB, correct: correctSym };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  const q1 = makeFractionToDecimalQuestion();
  const q2 = makeFractionToDecimalQuestion(q1);

  const q3 = makeDecimalToFractionQuestion();
  const q4 = makeDecimalToFractionQuestion(q3);

  const q5 = makePlaceValueQuestion();
  const q6 = makePlaceValueQuestion(q5);

  const q7 = makeComparisonQuestion();
  const q8 = makeComparisonQuestion(q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function Dekadikoi3PsifiaAskPage() {
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
    const normalize = (str) => str.toString().trim().replace('.', ',');

    if (normalize(answers.q1) === questions.q1.correct) currentScore += 1;
    if (normalize(answers.q2) === questions.q2.correct) currentScore += 1;
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (parseInt(answers.q6, 10) === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Q1 & Q2: Κλάσμα ➔ Δεκαδικός (Input)
  const renderFractionToDecimal = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey].toString().trim().replace('.', ',') === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-purple-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          Γράψε το δεκαδικό κλάσμα 
          <span className="inline-flex flex-col items-center leading-none text-base font-mono font-black text-purple-700 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
            <span>{qData.num}</span>
            <span className="border-b-2 border-purple-800 w-full"></span>
            <span>1.000</span>
          </span> 
          ως δεκαδικό αριθμό:
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="text"
          placeholder="π.χ. 0,245"
          value={answers[qKey]}
          onChange={(e) => handleInputChange(qKey, e.target.value)}
          disabled={submitted}
          className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey].toString().trim().replace('.', ',') === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Ο σωστός δεκαδικός είναι: <span className="font-mono font-black">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q3 & Q4: Δεκαδικός ➔ Κλάσμα (MCQ)
  const renderDecimalToFraction = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Ποιο δεκαδικό κλάσμα είναι ίσο με τον αριθμό <span className="text-indigo-600 font-mono font-black text-xl">{qData.decVal}</span>;
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => {
          const [n, d] = opt.text.split('/');
          return (
            <label 
              key={idx} 
              className={`flex items-center justify-center p-3.5 rounded-2xl border cursor-pointer transition ${
                answers[qKey] === opt.text 
                  ? 'border-indigo-600 bg-indigo-50/80 font-bold' 
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
                className="hidden"
              />
              <span className="inline-flex flex-col items-center leading-none text-base font-mono font-black text-gray-800">
                <span>{n}</span>
                <span className="border-b-2 border-gray-800 w-full my-0.5"></span>
                <span>{d}</span>
              </span>
            </label>
          );
        })}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Το σωστό κλάσμα είναι: <span className="font-mono font-black">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q5 & Q6: Αξία Θέσης (Input)
  const renderPlaceValue = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-teal-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Ποιο ψηφίο βρίσκεται στη θέση των <span className="text-teal-600 font-extrabold">{qData.placeType}</span> στον αριθμό <span className="text-teal-600 font-mono font-black text-xl">{qData.decStr}</span>;
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="number"
          placeholder="Γράψε το ψηφίο"
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
            <p className="text-red-600">❌ Λάθος. Το ψηφίο είναι το: <span className="font-mono font-black">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q7 & Q8: Σύγκριση (Buttons)
  const renderComparison = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-amber-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Επίλεξε το σωστό σύμβολο σύγκρισης ( &lt; , &gt; , = ):
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-4">
        <div className="flex items-center gap-4 text-xl md:text-2xl font-mono font-black text-gray-800">
          <span>{qData.strA}</span>
          
          <div className="flex gap-2">
            {['<', '=', '>'].map((sym) => (
              <button
                type="button"
                key={sym}
                onClick={() => handleInputChange(qKey, sym)}
                disabled={submitted}
                className={`w-12 h-12 rounded-xl text-xl font-black border transition ${
                  answers[qKey] === sym 
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          <span>{qData.strB}</span>
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Το σωστό σύμβολο είναι το: <span className="font-mono font-black text-lg">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>🔢 Ασκήσεις: Δεκαδικοί με 3 Ψηφία - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/11-dekadikoi-3-psifia" className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
                📝 Ασκήσεις: Δεκαδικοί με 3 Ψηφία
              </h1>
              <p className="text-purple-100 text-sm md:text-base mt-1">
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

            {renderFractionToDecimal('q1', questions.q1, 1)}
            {renderFractionToDecimal('q2', questions.q2, 2)}

            {renderDecimalToFraction('q3', questions.q3, 3)}
            {renderDecimalToFraction('q4', questions.q4, 4)}

            {renderPlaceValue('q5', questions.q5, 5)}
            {renderPlaceValue('q6', questions.q6, 6)}

            {renderComparison('q7', questions.q7, 7)}
            {renderComparison('q8', questions.q8, 8)}

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

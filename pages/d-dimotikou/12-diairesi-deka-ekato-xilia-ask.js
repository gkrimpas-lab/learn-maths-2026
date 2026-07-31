import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 1. Ασκηση: Διαίρεση με 10, 100, 1.000 (Input)
function makeDivisionQuestion(prevQuestion = null) {
  const factors = [10, 100, 1000];
  let factor, num, val, correctStr;

  while (true) {
    factor = factors[getRandomInt(0, 2)];
    // Πιθανότητα για ακέραιο με μηδενικά ή χωρίς μηδενικά
    const endingZeros = getRandomInt(0, 2);
    num = getRandomInt(1, 95) * Math.pow(10, endingZeros);
    val = num / factor;
    correctStr = val.toString().replace('.', ',');

    if (!prevQuestion || prevQuestion.num !== num || prevQuestion.factor !== factor) {
      break;
    }
  }

  return { num, factor, correct: correctStr };
}

// 2. Ασκηση: Πολλαπλασιασμός Δεκαδικού με 10, 100, 1.000 (Input)
function makeMultiplicationQuestion(prevQuestion = null) {
  const factors = [10, 100, 1000];
  let factor, decVal, val, numStr, correctStr;

  while (true) {
    factor = factors[getRandomInt(0, 2)];
    decVal = (getRandomInt(1, 99) / 10).toFixed(1);
    val = parseFloat(decVal) * factor;
    numStr = decVal.replace('.', ',');
    correctStr = val.toString().replace('.', ',');

    if (!prevQuestion || prevQuestion.numStr !== numStr || prevQuestion.factor !== factor) {
      break;
    }
  }

  return { numStr, factor, correct: correctStr };
}

// 3. Ασκηση: Εύρεση Άγνωστου Τελεστή :10, :100, :1.000 (MCQ)
function makeMissingFactorQuestion(prevQuestion = null) {
  const factors = [10, 100, 1000];
  let factor, num, res;

  while (true) {
    factor = factors[getRandomInt(0, 2)];
    num = getRandomInt(1, 85) * factor;
    res = num / factor;

    if (!prevQuestion || prevQuestion.num !== num) {
      break;
    }
  }

  const correctText = factor.toString();
  const options = [
    { text: '10', isCorrect: factor === 10 },
    { text: '100', isCorrect: factor === 100 },
    { text: '1.000', isCorrect: factor === 1000 }
  ].sort(() => Math.random() - 0.5);

  return { num, res, options, correct: correctText };
}

// 4. Ασκηση: Σύγκριση Εκφράσεων (<, =, >)
function makeComparisonQuestion(prevQuestion = null) {
  let exprA, exprB, valA, valB, correctSym;

  while (true) {
    const isMulA = Math.random() > 0.5;
    const factorA = [10, 100][getRandomInt(0, 1)];
    const baseA = getRandomInt(2, 50);

    valA = isMulA ? baseA * factorA : baseA / factorA;
    const strBaseA = baseA.toString().replace('.', ',');
    exprA = `${strBaseA} ${isMulA ? '×' : ':'} ${factorA}`;

    const isMulB = Math.random() > 0.5;
    const factorB = [10, 100][getRandomInt(0, 1)];
    let baseB = getRandomInt(2, 50);

    if (Math.random() > 0.7) {
      // Πιθανότητα για ίσο αποτέλεσμα
      valB = valA;
      baseB = isMulB ? valB / factorB : valB * factorB;
    } else {
      valB = isMulB ? baseB * factorB : baseB / factorB;
    }

    const strBaseB = baseB.toString().replace('.', ',');
    exprB = `${strBaseB} ${isMulB ? '×' : ':'} ${factorB}`;

    correctSym = '=';
    if (valA > valB) correctSym = '>';
    if (valA < valB) correctSym = '<';

    if (!prevQuestion || prevQuestion.exprA !== exprA || prevQuestion.exprB !== exprB) {
      break;
    }
  }

  return { exprA, exprB, correct: correctSym };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  const q1 = makeDivisionQuestion();
  const q2 = makeDivisionQuestion(q1);

  const q3 = makeMultiplicationQuestion();
  const q4 = makeMultiplicationQuestion(q3);

  const q5 = makeMissingFactorQuestion();
  const q6 = makeMissingFactorQuestion(q5);

  const q7 = makeComparisonQuestion();
  const q8 = makeComparisonQuestion(q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function Diairesi101001000AskPage() {
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
    if (normalize(answers.q3) === questions.q3.correct) currentScore += 1;
    if (normalize(answers.q4) === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Q1 & Q2: Διαίρεση (Input)
  const renderDivision = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey].toString().trim().replace('.', ',') === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-rose-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Υπολόγισε το αποτέλεσμα της διαίρεσης: <span className="text-rose-600 font-mono font-black text-xl">{qData.num} : {qData.factor} = ?</span>
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="text"
          placeholder="Γράψε το αποτέλεσμα"
          value={answers[qKey]}
          onChange={(e) => handleInputChange(qKey, e.target.value)}
          disabled={submitted}
          className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none"
        />
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey].toString().trim().replace('.', ',') === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Το σωστό αποτέλεσμα είναι: <span className="font-mono font-black">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q3 & Q4: Πολλαπλασιασμός (Input)
  const renderMultiplication = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey].toString().trim().replace('.', ',') === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-emerald-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Υπολόγισε το αποτέλεσμα του πολλαπλασιασμού: <span className="text-emerald-600 font-mono font-black text-xl">{qData.numStr} × {qData.factor} = ?</span>
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="text"
          placeholder="Γράψε το αποτέλεσμα"
          value={answers[qKey]}
          onChange={(e) => handleInputChange(qKey, e.target.value)}
          disabled={submitted}
          className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey].toString().trim().replace('.', ',') === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Το σωστό αποτέλεσμα είναι: <span className="font-mono font-black">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q5 & Q6: Άγνωστος Τελεστής (MCQ)
  const renderMissingFactor = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Ποιος αριθμός λείπει; <span className="text-indigo-600 font-mono font-black text-xl">{qData.num} : [ ? ] = {qData.res}</span>
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3 pl-0 md:pl-11 max-w-md">
        {qData.options.map((opt, idx) => (
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
            <span className="text-gray-800 font-mono font-black text-base">{opt.text}</span>
          </label>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Ο αριθμός που λείπει είναι το: <span className="font-mono font-black">{qData.correct}</span></p>
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
        <div className="flex flex-wrap items-center gap-4 text-xl md:text-2xl font-mono font-black text-gray-800">
          <span>{qData.exprA}</span>
          
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

          <span>{qData.exprB}</span>
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
        <title>⚡ Ασκήσεις: Διαίρεση & Πολλαπλασιασμός με 10, 100, 1.000 - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/12-diairesi-deka-ekato-xilia" className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις - Διαίρεση με 10, 100, 1.000 και Πολλαπλασιασμός με 10, 100, 1.000
              </h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">
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

            {renderDivision('q1', questions.q1, 1)}
            {renderDivision('q2', questions.q2, 2)}

            {renderMultiplication('q3', questions.q3, 3)}
            {renderMultiplication('q4', questions.q4, 4)}

            {renderMissingFactor('q5', questions.q5, 5)}
            {renderMissingFactor('q6', questions.q6, 6)}

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

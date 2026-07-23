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

// 1. Ασκηση: Επαλήθευση Πρόσθεσης με Αφαίρεση
function makeAdditionCheckQuestion() {
  const a = getRandomInt(1000, 10000);
  const b = getRandomInt(500, 5000);
  const sum = a + b;

  // Επιλέγουμε τυχαία ποιος προσθετέος θα αφαιρεθεί
  const subtractA = Math.random() > 0.5;
  const subNum = subtractA ? a : b;
  const correctResult = subtractA ? b : a;

  return {
    a,
    b,
    sum,
    subNum,
    correct: correctResult
  };
}

// 2. Ασκηση: Επαλήθευση Αφαίρεσης με Πρόσθεση (Δοκιμή)
function makeSubtractionCheckQuestion() {
  const diff = getRandomInt(1000, 8000);
  const sub = getRandomInt(500, 5000);
  const min = diff + sub;

  return {
    min,
    sub,
    diff,
    correct: min
  };
}

// 3. Ασκηση: Εύρεση Άγνωστου Αριθμού
function makeMissingNumberQuestion() {
  const isAddition = Math.random() > 0.5;
  const a = getRandomInt(1000, 8000);
  const b = getRandomInt(500, 4000);

  if (isAddition) {
    const sum = a + b;
    return {
      type: 'add',
      known: a,
      target: sum,
      correct: b
    };
  } else {
    const min = a + b;
    return {
      type: 'sub',
      known: b,
      target: min,
      correct: a
    };
  }
}

// 4. Ασκηση: Ορολογία (MCQ)
function makeTerminologyQuestion() {
  const terms = [
    {
      q: 'Πώς ονομάζεται το αποτέλεσμα της αφαίρεσης;',
      correct: 'Διαφορά',
      wrongs: ['Άθροισμα', 'Προσθετέος']
    },
    {
      q: 'Πώς ονομάζονται οι αριθμοί που προσθέτουμε;',
      correct: 'Προσθετέοι',
      wrongs: ['Αφαιρετέοι', 'Διαφορές']
    },
    {
      q: 'Πώς ονομάζεται το αποτέλεσμα της πρόσθεσης;',
      correct: 'Άθροισμα',
      wrongs: ['Διαφορά', 'Μειωτέος']
    },
    {
      q: 'Στην αφαίρεση 5.000 - 1.200 = 3.800, ο αριθμός 5.000 λέγεται:',
      correct: 'Μειωτέος',
      wrongs: ['Αφαιρετέος', 'Άθροισμα']
    }
  ];

  const selected = terms[getRandomInt(0, terms.length - 1)];
  const options = [
    { text: selected.correct, isCorrect: true },
    { text: selected.wrongs[0], isCorrect: false },
    { text: selected.wrongs[1], isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  return {
    questionText: selected.q,
    options,
    correct: selected.correct
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  return {
    q1: makeAdditionCheckQuestion(),
    q2: makeAdditionCheckQuestion(),
    q3: makeSubtractionCheckQuestion(),
    q4: makeSubtractionCheckQuestion(),
    q5: makeMissingNumberQuestion(),
    q6: makeMissingNumberQuestion(),
    q7: makeTerminologyQuestion(),
    q8: makeTerminologyQuestion()
  };
}

export default function ProsthesiAfairesiAskPage() {
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
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (parseInt(answers.q6, 10) === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Q1 & Q2: Επαλήθευση Πρόσθεσης
  const renderAdditionCheck = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-blue-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Ξέρουμε ότι <span className="text-blue-600 font-mono font-black">{formatNumber(qData.a)} + {formatNumber(qData.b)} = {formatNumber(qData.sum)}</span>. Συμπλήρωσε την αφαίρεση:
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2 font-mono text-lg font-bold text-gray-800 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span>{formatNumber(qData.sum)}</span>
          <span>-</span>
          <span>{formatNumber(qData.subNum)}</span>
          <span>=</span>
          <input 
            type="number"
            placeholder="?"
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-36 p-2 rounded-xl border border-gray-300 font-mono text-lg font-bold text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Το αποτέλεσμα είναι: <span className="font-mono font-black">{formatNumber(qData.correct)}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q3 & Q4: Επαλήθευση Αφαίρεσης (Δοκιμή)
  const renderSubtractionCheck = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-purple-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Κάνε τη δοκιμή της αφαίρεσης <span className="text-purple-600 font-mono font-black">{formatNumber(qData.min)} - {formatNumber(qData.sub)} = {formatNumber(qData.diff)}</span>:
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2 font-mono text-lg font-bold text-gray-800 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span>{formatNumber(qData.diff)}</span>
          <span>+</span>
          <span>{formatNumber(qData.sub)}</span>
          <span>=</span>
          <input 
            type="number"
            placeholder="?"
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-36 p-2 rounded-xl border border-gray-300 font-mono text-lg font-bold text-center focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Το άθροισμα στη δοκιμή πρέπει να ισούται με τον μειωτέο: <span className="font-mono font-black">{formatNumber(qData.correct)}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q5 & Q6: Άγνωστος Αριθμός
  const renderMissingNumber = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-teal-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Βρες τον αριθμό που λείπει χρησιμοποιώντας την αντίστροφη πράξη:
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2 font-mono text-lg font-bold text-gray-800 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          {qData.type === 'add' ? (
            <>
              <span>{formatNumber(qData.known)}</span>
              <span>+</span>
              <input 
                type="number"
                placeholder="?"
                value={answers[qKey]}
                onChange={(e) => handleInputChange(qKey, e.target.value)}
                disabled={submitted}
                className="w-36 p-2 rounded-xl border border-amber-400 bg-amber-50 text-amber-900 font-mono text-lg font-bold text-center focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span>=</span>
              <span>{formatNumber(qData.target)}</span>
            </>
          ) : (
            <>
              <input 
                type="number"
                placeholder="?"
                value={answers[qKey]}
                onChange={(e) => handleInputChange(qKey, e.target.value)}
                disabled={submitted}
                className="w-36 p-2 rounded-xl border border-amber-400 bg-amber-50 text-amber-900 font-mono text-lg font-bold text-center focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span>-</span>
              <span>{formatNumber(qData.known)}</span>
              <span>=</span>
              <span>{formatNumber(qData.target - qData.known)}</span>
            </>
          )}
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Ο αριθμός που λείπει είναι ο: <span className="font-mono font-black">{formatNumber(qData.correct)}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q7 & Q8: Ορολογία
  const renderTerminology = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-amber-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          {qData.questionText}
        </h3>
      </div>

      <div className="space-y-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt.text 
                ? 'border-amber-500 bg-amber-50/80 font-bold' 
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
              className="w-5 h-5 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-gray-800 text-sm md:text-base">{opt.text}</span>
          </label>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Η σωστή απάντηση είναι: <span className="font-black">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>➕➖ Ασκήσεις: Πρόσθεση & Αφαίρεση - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/3-prosthesi-afairesi" className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
                📝 Ασκήσεις: Πρόσθεση & Αφαίρεση
              </h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">
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

            {renderAdditionCheck('q1', questions.q1, 1)}
            {renderAdditionCheck('q2', questions.q2, 2)}

            {renderSubtractionCheck('q3', questions.q3, 3)}
            {renderSubtractionCheck('q4', questions.q4, 4)}

            {renderMissingNumber('q5', questions.q5, 5)}
            {renderMissingNumber('q6', questions.q6, 6)}

            {renderTerminology('q7', questions.q7, 7)}
            {renderTerminology('q8', questions.q8, 8)}

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

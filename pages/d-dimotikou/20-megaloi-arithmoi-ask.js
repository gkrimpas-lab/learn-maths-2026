import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// ----------------------------------------------------
// ΣΥΝΑΡΤΗΣΕΙΣ ΔΗΜΙΟΥΡΓΙΑΣ ΔΥΝΑΜΙΚΩΝ ΑΣΚΗΣΕΩΝ
// ----------------------------------------------------

// 1. Αξία Θέσης Ψηφίου (Input)
function makeDigitValueQuestion() {
  const ex = getRandomInt(1, 9);
  const dx = getRandomInt(0, 9);
  const x = getRandomInt(0, 9);
  const e = getRandomInt(0, 9);
  const d = getRandomInt(0, 9);
  const m = getRandomInt(0, 9);

  const total = ex * 100000 + dx * 10000 + x * 1000 + e * 100 + d * 10 + m;

  const positions = [
    { name: 'Εκατοντάδες Χιλιάδες', digit: ex, value: ex * 100000 },
    { name: 'Δεκάδες Χιλιάδες', digit: dx, value: dx * 10000 },
    { name: 'Μονάδες Χιλιάδες', digit: x, value: x * 1000 },
    { name: 'Εκατοντάδες', digit: e, value: e * 100 }
  ];

  const pos = positions[getRandomInt(0, positions.length - 1)];

  return {
    q: `Στον αριθμό ${formatNumber(total)}, ποια είναι η πραγματική αξία του ψηφίου ${pos.digit} (στη θέση ${pos.name});`,
    correct: pos.value,
    unit: '',
    explain: `Το ψηφίο ${pos.digit} βρίσκεται στις ${pos.name}, οπότε η αξία του είναι ${formatNumber(pos.value)}.`
  };
}

// 2. Σύνθεση Αριθμού από Άθροισμα (Input)
function makeCompositionQuestion() {
  const ex = getRandomInt(1, 9) * 100000;
  const dx = getRandomInt(1, 9) * 10000;
  const x = getRandomInt(1, 9) * 1000;
  const e = getRandomInt(1, 9) * 100;
  const d = getRandomInt(1, 9) * 10;
  const m = getRandomInt(1, 9);

  const total = ex + dx + x + e + d + m;

  return {
    q: `Ποιος αριθμός σχηματίζεται από το άθροισμα: ${formatNumber(ex)} + ${formatNumber(dx)} + ${formatNumber(x)} + ${formatNumber(e)} + ${d} + ${m};`,
    correct: total,
    unit: '',
    explain: `Προσθέτοντας όλες τις αξίες θέσης: ${formatNumber(ex)} + ${formatNumber(dx)} + ${formatNumber(x)} + ${formatNumber(e)} + ${d} + ${m} = ${formatNumber(total)}.`
  };
}

// 3. Σύγκριση Μεγάλων Αριθμών (MCQ)
function makeComparisonQuestion() {
  const base = getRandomInt(100, 800) * 1000;
  const diff = getRandomInt(1, 9) * 100;
  const num1 = base + diff;
  const num2 = base;

  const isGreater = num1 > num2;
  const correct = `${formatNumber(num1)} > ${formatNumber(num2)}`;

  const options = [
    `${formatNumber(num1)} > ${formatNumber(num2)}`,
    `${formatNumber(num1)} < ${formatNumber(num2)}`,
    `${formatNumber(num1)} = ${formatNumber(num2)}`
  ].sort(() => Math.random() - 0.5);

  return {
    q: `Ποια σχέση σύγκρισης είναι η ΣΩΣΤΗ ανάμεσα στους αριθμούς ${formatNumber(num1)} και ${formatNumber(num2)};`,
    correct,
    options,
    explain: `Ο αριθμός ${formatNumber(num1)} είναι μεγαλύτερος από τον ${formatNumber(num2)} (αφού έχει ${diff} παραπάνω).`
  };
}

// 4. Σωστό / Λάθος για Μεγάλους Αριθμούς
const TRUE_FALSE_POOL = [
  { q: 'Στον αριθμό 542.310, το ψηφίο 5 βρίσκεται στις Εκατοντάδες Χιλιάδες.', correct: 'Σωστό', explain: 'Σωστά! Το ψηφίο 5 είναι στις Εκατοντάδες Χιλιάδες (500.000).' },
  { q: 'Ο αριθμός 100.000 είναι κατά 1 μεγαλύτερος από τον αριθμό 99.999.', correct: 'Σωστό', explain: 'Σωστά! 99.999 + 1 = 100.000.' },
  { q: 'Στους μεγάλους αριθμούς, χωρίζουμε τα ψηφία σε κλάσεις ανά 2 ψηφία από δεξιά.', correct: 'Λάθος', explain: 'Λάθος! Χωρίζουμε τα ψηφία σε κλάσεις ανά 3 ψηφία από δεξιά προς τα αριστερά.' },
  { q: 'Ο αριθμός 405.020 έχει 0 Δεκάδες Χιλιάδες.', correct: 'Σωστό', explain: 'Σωστά! Στη θέση των Δεκάδων Χιλιάδων υπάρχει το ψηφίο 0.' },
  { q: 'Ο μεγαλύτερος εξαψήφιος αριθμός είναι ο 999.999.', correct: 'Σωστό', explain: 'Σωστά! Ο 999.999 είναι ο μεγαλύτερος εξαψήφιος αριθμός.' },
  { q: 'Ο αριθμός 250.000 είναι μεγαλύτερος από τον 300.000.', correct: 'Λάθος', explain: 'Λάθος! Ο 300.000 είναι μεγαλύτερος από τον 250.000.' },
  { q: '10 Εκατοντάδες Χιλιάδες είναι ίσες με 1 Εκατομμύριο (1.000.000).', correct: 'Σωστό', explain: 'Σωστά! 10 × 100.000 = 1.000.000.' }
];

// ----------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 8 ΑΣΚΗΣΕΩΝ
// ----------------------------------------------------
function generateQuestions() {
  const q1 = makeDigitValueQuestion();
  const q2 = makeDigitValueQuestion();

  const q3 = makeCompositionQuestion();
  const q4 = makeCompositionQuestion();

  const q5 = makeComparisonQuestion();
  const q6 = makeComparisonQuestion();

  let tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return { q1, q2, q3, q4, q5, q6, q7: tf1, q8: tf2 };
}

export default function MegaloiArithmoiAskPage() {
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
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Input Number Ασκήσεων (Q1 - Q4)
  const renderInputNumber = (qKey, qData, numLabel, colorClass) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`${colorClass} text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center`}>{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">{qData.q}</h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2">
          <input 
            type="number"
            placeholder="Γράψε τον αριθμό"
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. {qData.explain || `Η σωστή απάντηση είναι: ${formatNumber(qData.correct)}`}</p>
          )}
        </div>
      )}
    </div>
  );

  // Render MCQ (Q5 & Q6)
  const renderMcqQuestion = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-emerald-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">{qData.q}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt 
                ? 'border-teal-600 bg-teal-50/80 font-bold text-teal-900' 
                : 'border-gray-200 hover:bg-gray-50 text-gray-800'
            }`}
          >
            <input 
              type="radio" 
              name={qKey} 
              value={opt}
              checked={answers[qKey] === opt}
              onChange={() => handleInputChange(qKey, opt)}
              disabled={submitted}
              className="w-5 h-5 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm md:text-base font-bold font-mono">{opt}</span>
          </label>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Η σωστή απάντηση είναι: <span className="font-black font-mono">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Σωστό / Λάθος (Q7 & Q8)
  const renderTrueFalse = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-teal-700 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">{qData.q}</h3>
      </div>

      <div className="flex gap-4 pl-0 md:pl-11">
        {['Σωστό', 'Λάθος'].map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => handleInputChange(qKey, opt)}
            disabled={submitted}
            className={`px-8 py-3 rounded-2xl font-black text-base border transition ${
              answers[qKey] === opt
                ? (opt === 'Σωστό' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-rose-600 text-white border-rose-700 shadow-md')
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. {qData.explain}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>💎 Ασκήσεις: Οι Μεγάλοι Αριθμοί - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/1-megaloi-arithmoi" className="bg-teal-100 hover:bg-teal-200 text-teal-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Οι Μεγάλοι Αριθμοί
              </h1>
              <p className="text-teal-100 text-sm md:text-base mt-1">
                8 Δυναμικές ασκήσεις! Πατώντας **«Νέες Ασκήσεις»** οι αριθμοί και οι ερωτήσεις αλλάζουν.
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
                <span>🔄</span> Παίξε ξανά με νέες ερωτήσεις!
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

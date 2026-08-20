import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΕΡΩΤΗΣΕΩΝ (POOLS)
// ----------------------------------------------------

// Pool Κατηγορίας 1: Αναγνώριση Σχημάτων (MCQ)
const SHAPES_IDENTIFY_POOL = [
  {
    q: 'Ποιο τετράπλευρο έχει όλες τις πλευρές του ίσες, αλλά οι γωνίες του ΔΕΝ είναι ορθές (90°);',
    correct: 'Ο Ρόμβος',
    wrongs: ['Το Τετράγωνο', 'Το Ορθογώνιο', 'Το Πλάγιο Παραλληλόγραμμο'],
    svg: (
      <svg className="w-48 h-28 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 100">
        <polygon points="70,20 130,20 160,80 100,80" fill="#a855f7" fillOpacity="0.3" stroke="#a855f7" strokeWidth="3" />
      </svg>
    )
  },
  {
    q: 'Ποιο τετράπλευρο έχει τις απέναντι πλευρές του ίσες & παράλληλες και 4 ορθές γωνίες (90°);',
    correct: 'Το Ορθογώνιο Παραλληλόγραμμο',
    wrongs: ['Ο Ρόμβος', 'Το Πλάγιο Παραλληλόγραμμο', 'Τυχαίο τετράπλευρο'],
    svg: (
      <svg className="w-48 h-28 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 100">
        <rect x="40" y="25" width="120" height="50" fill="#3b82f6" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="3" />
        <rect x="40" y="25" width="10" height="10" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    q: 'Ποιο σχήμα έχει ΚΑΙ τις 4 πλευρές του ίσες ΚΑΙ 4 ορθές γωνίες;',
    correct: 'Το Τετράγωνο',
    wrongs: ['Ο Ρόμβος', 'Το Ορθογώνιο', 'Το Πλάγιο Παραλληλόγραμμο'],
    svg: (
      <svg className="w-48 h-28 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 100">
        <rect x="70" y="20" width="60" height="60" fill="#6366f1" fillOpacity="0.3" stroke="#6366f1" strokeWidth="3" />
        <rect x="70" y="20" width="10" height="10" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
      </svg>
    )
  }
];

// Pool Κατηγορίας 2: Ομοιότητες & Διαφορές
const SIMILARITIES_POOL = [
  { q: 'Τι κοινό έχουν το Τετράγωνο και ο Ρόμβος;', correct: 'Έχουν και τα δύο 4 ίσες πλευρές', wrongs: ['Έχουν και τα δύο 4 ορθές γωνίες', 'Δεν έχουν καμία παράλληλη πλευρά', 'Έχουν μόνο 3 πλευρές'] },
  { q: 'Τι κοινό έχουν το Ορθογώνιο και το Τετράγωνο;', correct: 'Έχουν και τα δύο 4 ορθές γωνίες (90°)', wrongs: ['Έχουν πάντα 4 ίσες πλευρές', 'Δεν έχουν παράλληλες πλευρές', 'Έχουν οξεία γωνία'] },
  { q: 'Σε τι διαφέρει ο Ρόμβος από το Τετράγωνο;', correct: 'Ο ρόμβος δεν έχει ορθές γωνίες', wrongs: ['Ο ρόμβος δεν έχει ίσες πλευρές', 'Ο ρόμβος έχει 5 πλευρές', 'Δεν διαφέρουν σε τίποτα'] },
  { q: 'Σε τι διαφέρει το Πλάγιο Παραλληλόγραμμο από το Ορθογώνιο;', correct: 'Το πλάγιο παραλληλόγραμμο δεν έχει ορθές γωνίες', wrongs: ['Το πλάγιο δεν έχει παράλληλες πλευρές', 'Το ορθογώνιο έχει 3 πλευρές', 'Το πλάγιο έχει όλες τις πλευρές ίσες'] }
];

// Pool Κατηγορίας 3: Αριθμητικά Χαρακτηριστικά (Input)
const NUMERIC_POOL = [
  { q: 'Πόσες ορθές γωνίες (90°) έχει ένα ορθογώνιο παραλληλόγραμμο;', correct: 4, explain: 'Το ορθογώνιο έχει ακριβώς 4 ορθές γωνίες.' },
  { q: 'Πόσες ορθές γωνίες έχει ένας ρόμβος;', correct: 0, explain: 'Ο ρόμβος έχει πλάγιες γωνίες (0 ορθές γωνίες).' },
  { q: 'Πόσες ίσες πλευρές έχει ένα τετράγωνο;', correct: 4, explain: 'Το τετράγωνο έχει 4 ίσες πλευρές.' },
  { q: 'Πόσα ζεύγη παράλληλων πλευρών έχει ένα πλάγιο παραλληλόγραμμο;', correct: 2, explain: 'Έχει 2 ζεύγη απέναντι παράλληλων πλευρών.' }
];

// Pool Κατηγορίας 4: Σωστό / Λάθος
const TRUE_FALSE_POOL = [
  { q: 'Το τετράγωνο είναι ταυτόχρονα και ορθογώνιο (έχει 4 ορθές γωνίες) και ρόμβος (έχει 4 ίσες πλευρές).', correct: 'Σωστό', explain: 'Σωστά! Το τετράγωνο συνδυάζει τις ιδιότητες και των δύο.' },
  { q: 'Όλα τα παραλληλόγραμμα έχουν τις απέναντι πλευρές τους παράλληλες και ίσες.', correct: 'Σωστό', explain: 'Σωστά! Αυτή είναι η βασική ιδιότητα των παραλληλογράμμων.' },
  { q: 'Ο ρόμβος έχει 4 ορθές γωνίες όπως το τετράγωνο.', correct: 'Λάθος', explain: 'Λάθος! Ο ρόμβος δεν έχει ορθές γωνίες.' },
  { q: 'Στο ορθογώνιο παραλληλόγραμμο όλες οι πλευρές είναι υποχρεωτικά ίσες μεταξύ τους.', correct: 'Λάθος', explain: 'Λάθος! Στο ορθογώνιο είναι ίσες μόνο οι απέναντι πλευρές.' }
];

// ----------------------------------------------------
// GENERATOR 8 ΑΣΚΗΣΕΩΝ
// ----------------------------------------------------
function generateQuestions() {
  const prepareMcq = (item) => {
    const options = [{ text: item.correct, isCorrect: true }, ...item.wrongs.map(w => ({ text: w, isCorrect: false }))];
    return { ...item, options: options.sort(() => Math.random() - 0.5) };
  };

  // Q1 & Q2: Σχήματα
  let s1 = SHAPES_IDENTIFY_POOL[getRandomInt(0, SHAPES_IDENTIFY_POOL.length - 1)];
  let s2;
  while (true) {
    s2 = SHAPES_IDENTIFY_POOL[getRandomInt(0, SHAPES_IDENTIFY_POOL.length - 1)];
    if (s2.q !== s1.q) break;
  }

  // Q3 & Q4: Ομοιότητες & Διαφορές
  let sim1 = SIMILARITIES_POOL[getRandomInt(0, SIMILARITIES_POOL.length - 1)];
  let sim2;
  while (true) {
    sim2 = SIMILARITIES_POOL[getRandomInt(0, SIMILARITIES_POOL.length - 1)];
    if (sim2.q !== sim1.q) break;
  }

  // Q5 & Q6: Αριθμητικά (Input)
  let num1 = NUMERIC_POOL[getRandomInt(0, NUMERIC_POOL.length - 1)];
  let num2;
  while (true) {
    num2 = NUMERIC_POOL[getRandomInt(0, NUMERIC_POOL.length - 1)];
    if (num2.q !== num1.q) break;
  }

  // Q7 & Q8: Σωστό / Λάθος
  let tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return {
    q1: prepareMcq(s1),
    q2: prepareMcq(s2),
    q3: prepareMcq(sim1),
    q4: prepareMcq(sim2),
    q5: num1,
    q6: num2,
    q7: tf1,
    q8: tf2
  };
}

export default function TetrapleuraAskPage() {
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
    if (answers.q1 === questions.q1.correct) currentScore += 1;
    if (answers.q2 === questions.q2.correct) currentScore += 1;
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (parseInt(answers.q6, 10) === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render MCQ (Q1 - Q4)
  const renderMcqQuestion = (qKey, qData, numLabel, colorClass) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`${colorClass} text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center`}>{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">{qData.q}</h3>
      </div>

      {qData.svg && <div className="mb-4">{qData.svg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt.text 
                ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-900' 
                : 'border-gray-200 hover:bg-gray-50 text-gray-800'
            }`}
          >
            <input 
              type="radio" 
              name={qKey} 
              value={opt.text}
              checked={answers[qKey] === opt.text}
              onChange={() => handleInputChange(qKey, opt.text)}
              disabled={submitted}
              className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm md:text-base font-bold">{opt.text}</span>
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

  // Render Input Number (Q5 & Q6)
  const renderInputNumber = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-teal-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">{qData.q}</h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="number"
          placeholder="Γράψε τον αριθμό"
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
            <p className="text-red-600">❌ Λάθος. {qData.explain}</p>
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
        <span className="bg-amber-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
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
        <title>🔷 Ασκήσεις: Τα Τετράπλευρα - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/16-tetrapleura" className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
                📝 Ασκήσεις: Τα Τετράπλευρα και οι Ιδιότητές τους
              </h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">
                Πατώντας «Νέες Ασκήσεις» οι ερωτήσεις αλλάζουν.
              </p>
            </div>

            <button
              onClick={loadNewQuestions}
              className="bg-white text-gray-900 font-black px-5 py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition transform active:scale-95 text-sm whitespace-nowrap"
            >
              🔄 Αλλαγή Ασκήσεων
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {renderMcqQuestion('q1', questions.q1, 1, 'bg-blue-600')}
            {renderMcqQuestion('q2', questions.q2, 2, 'bg-blue-600')}

            {renderMcqQuestion('q3', questions.q3, 3, 'bg-indigo-600')}
            {renderMcqQuestion('q4', questions.q4, 4, 'bg-indigo-600')}

            {renderInputNumber('q5', questions.q5, 5)}
            {renderInputNumber('q6', questions.q6, 6)}

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

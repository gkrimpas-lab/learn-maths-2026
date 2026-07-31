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

// Pool Κατηγορίας 1: Αναγνώριση από Σχήμα (SVG)
const SHAPE_POOL = [
  {
    type: 'parallel',
    question: 'Τι είδος ευθειών βλέπεις στο παρακάτω σχήμα;',
    correct: 'Παράλληλες ευθείες',
    wrongs: ['Τεμνόμενες ευθείες', 'Κάθετες ευθείες'],
    svg: (
      <svg className="w-48 h-28 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 100">
        <line x1="20" y1="30" x2="180" y2="30" stroke="#3b82f6" strokeWidth="4" />
        <line x1="20" y1="70" x2="180" y2="70" stroke="#60a5fa" strokeWidth="4" />
      </svg>
    )
  },
  {
    type: 'intersecting',
    question: 'Τι είδος ευθειών βλέπεις στο παρακάτω σχήμα;',
    correct: 'Τεμνόμενες ευθείες',
    wrongs: ['Παράλληλες ευθείες', 'Κάθετες ευθείες'],
    svg: (
      <svg className="w-48 h-28 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 100">
        <line x1="30" y1="20" x2="170" y2="80" stroke="#a855f7" strokeWidth="4" />
        <line x1="30" y1="80" x2="170" y2="20" stroke="#e879f9" strokeWidth="4" />
        <circle cx="100" cy="50" r="5" fill="#f43f5e" />
      </svg>
    )
  },
  {
    type: 'perpendicular',
    question: 'Τι είδος ευθειών βλέπεις στο παρακάτω σχήμα;',
    correct: 'Κάθετες ευθείες',
    wrongs: ['Παράλληλες ευθείες (που δεν τέμνονται)', 'Τεμνόμενες (μη κάθετες) ευθείες'],
    svg: (
      <svg className="w-48 h-28 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 100">
        <line x1="20" y1="50" x2="180" y2="50" stroke="#10b981" strokeWidth="4" />
        <line x1="100" y1="10" x2="100" y2="90" stroke="#059669" strokeWidth="4" />
        <rect x="100" y="35" width="15" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
      </svg>
    )
  }
];

// Pool Κατηγορίας 2: Σύμβολα & Ορολογία
const SYMBOLS_POOL = [
  { q: 'Ποιο σύμβολο χρησιμοποιούμε για να δηλώσουμε ότι δύο ευθείες είναι παράλληλες (ε₁ ∥ ε₂);', correct: '∥', wrongs: ['⊥', '=', '≠'] },
  { q: 'Ποιο σύμβολο χρησιμοποιούμε για να δηλώσουμε ότι δύο ευθείες είναι κάθετες (ε₁ ⊥ ε₂);', correct: '⊥', wrongs: ['∥', 'Δ', '×'] },
  { q: 'Πώς ονομάζεται το μοναδικό σημείο στο οποίο συναντιούνται δύο τεμνόμενες ευθείες;', correct: 'Σημείο τομής', wrongs: ['Σημείο επαφής', 'Κορυφή γωνίας', 'Μέσο ευθείας'] },
  { q: 'Τι γωνία σχηματίζουν μεταξύ τους δύο κάθετες ευθείες;', correct: 'Ορθή γωνία (90°)', wrongs: ['Οξεία γωνία', 'Αμβλεία γωνία', 'Ευθεία γωνία'] }
];

// Pool Κατηγορίας 3: Καθημερινή Ζωή
const REAL_LIFE_POOL = [
  { q: 'Οι παράλληλες γραμμές ενός τετραδίου είναι παράδειγμα:', correct: 'Παράλληλων ευθειών', wrongs: ['Τεμνόμενων ευθειών', 'Κάθετων ευθειών'] },
  { q: 'Οι δύο ράγες στις οποίες κινείται ένα τρένο είναι:', correct: 'Παράλληλες ευθείες', wrongs: ['Τεμνόμενες ευθείες', 'Κάθετες ευθείες'] },
  { q: 'Οι δύο δείκτες ενός ρολογιού όταν η ώρα είναι ακριβώς 3:00 είναι:', correct: 'Κάθετες ευθείες', wrongs: ['Παράλληλες ευθείες', 'Τεμνόμενες μη κάθετες ευθείες'] },
  { q: 'Η διασταύρωση δύο δρόμων σε ένα σταυροδρόμι θυμίζει:', correct: 'Τεμνόμενες ευθείες', wrongs: ['Παράλληλες ευθείες', 'Ευθείες που δεν συναντιούνται ποτέ'] },
  { q: 'Οι απέναντι πλευρές ενός ορθογωνίου πίνακα είναι μεταξύ τους:', correct: 'Παράλληλες', wrongs: ['Κάθετες', 'Τεμνόμενες σε μία γωνία'] },
  { q: 'Οι διαδοχικές (διπλανές) πλευρές μιας πόρτας που σχηματίζουν γωνία είναι:', correct: 'Κάθετες ευθείες', wrongs: ['Παράλληλες ευθείες', 'Ευθείες που δεν τέμνονται'] }
];

// Pool Κατηγορίας 4: Σωστό / Λάθος
const TRUE_FALSE_POOL = [
  { q: 'Δύο παράλληλες ευθείες συναντιούνται σε ένα σημείο αν τις προεκτείνουμε πολύ.', correct: 'Λάθος', explain: 'Οι παράλληλες ευθείες δεν συναντιούνται ΠΟΤΕ!' },
  { q: 'Οι κάθετες ευθείες είναι ένας ειδικός τύπος τεμνόμενων ευθειών.', correct: 'Σωστό', explain: 'Σωστά! Είναι τεμνόμενες που σχηματίζουν ορθή γωνία 90°.' },
  { q: 'Δύο τεμνόμενες ευθείες μπορούν να συναντηθούν σε 2 διαφορετικά σημεία.', correct: 'Λάθος', explain: 'Δύο ευθείες συναντιούνται σε 1 μόνο κοινό σημείο.' },
  { q: 'Η απόσταση ανάμεσα σε δύο παράλληλες ευθείες είναι πάντα η ίδια σε όλα τα σημεία.', correct: 'Σωστό', explain: 'Σωστά! Διατηρούν πάντα σταθερή απόσταση.' }
];

// ----------------------------------------------------
// GENERATOR 8 ΑΣΚΗΣΕΩΝ ΜΕ ΕΓΓΥΗΜΕΝΗ ΜΟΝΑΔΙΚΟΤΗΤΑ
// ----------------------------------------------------
function generateQuestions() {
  // Q1 & Q2: Σχήματα (SVG)
  let s1 = SHAPE_POOL[getRandomInt(0, SHAPE_POOL.length - 1)];
  let s2;
  while (true) {
    s2 = SHAPE_POOL[getRandomInt(0, SHAPE_POOL.length - 1)];
    if (s2.type !== s1.type) break;
  }

  // Q3 & Q4: Σύμβολα
  let sym1 = SYMBOLS_POOL[getRandomInt(0, SYMBOLS_POOL.length - 1)];
  let sym2;
  while (true) {
    sym2 = SYMBOLS_POOL[getRandomInt(0, SYMBOLS_POOL.length - 1)];
    if (sym2.q !== sym1.q) break;
  }

  // Q5 & Q6: Καθημερινή ζωή
  let r1 = REAL_LIFE_POOL[getRandomInt(0, REAL_LIFE_POOL.length - 1)];
  let r2;
  while (true) {
    r2 = REAL_LIFE_POOL[getRandomInt(0, REAL_LIFE_POOL.length - 1)];
    if (r2.q !== r1.q) break;
  }

  // Q7 & Q8: Σωστό / Λάθος
  let tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  const prepareMcq = (item) => {
    const options = [{ text: item.correct, isCorrect: true }, ...item.wrongs.map(w => ({ text: w, isCorrect: false }))];
    return { ...item, options: options.sort(() => Math.random() - 0.5) };
  };

  return {
    q1: prepareMcq(s1),
    q2: prepareMcq(s2),
    q3: prepareMcq(sym1),
    q4: prepareMcq(sym2),
    q5: prepareMcq(r1),
    q6: prepareMcq(r2),
    q7: tf1,
    q8: tf2
  };
}

export default function ParallilesAskPage() {
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
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render MCQ Ασκήσεων (Q1 - Q6)
  const renderMcqQuestion = (qKey, qData, numLabel, categoryTitle, colorClass) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`${colorClass} text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center`}>{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">{qData.question || qData.q}</h3>
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
        <title>📐 Ασκήσεις: Παράλληλες & Τεμνόμενες Ευθείες - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/13-paralliles" className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
                📝 Ασκήσεις: Παράλληλες και Τεμνόμενες Ευθείες
              </h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">
                Πατώντας «Νέες Ασκήσεις» οι ερωτήσεις αλλάζουν αυτόματα.
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

            {renderMcqQuestion('q1', questions.q1, 1, 'Σχήματα', 'bg-blue-600')}
            {renderMcqQuestion('q2', questions.q2, 2, 'Σχήματα', 'bg-blue-600')}

            {renderMcqQuestion('q3', questions.q3, 3, 'Σύμβολα', 'bg-indigo-600')}
            {renderMcqQuestion('q4', questions.q4, 4, 'Σύμβολα', 'bg-indigo-600')}

            {renderMcqQuestion('q5', questions.q5, 5, 'Καθημερινότητα', 'bg-purple-600')}
            {renderMcqQuestion('q6', questions.q6, 6, 'Καθημερινότητα', 'bg-purple-600')}

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

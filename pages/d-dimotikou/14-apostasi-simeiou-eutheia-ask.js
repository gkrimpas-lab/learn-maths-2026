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

// Pool Κατηγορίας 1: Σχήματα SVG (Ποιο τμήμα είναι η απόσταση;)
const SHAPE_POOL = [
  {
    q: 'Ποιο από τα παρακάτω ευθύγραμμα τμήματα εκφράζει την ΑΠΟΣΤΑΣΗ του σημείου Α από την ευθεία (ε);',
    correct: 'Το τμήμα ΑΗ',
    wrongs: ['Το τμήμα ΑΖ', 'Το τμήμα ΑΚ'],
    svg: (
      <svg className="w-56 h-32 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 240 120">
        <line x1="20" y1="90" x2="220" y2="90" stroke="#3b82f6" strokeWidth="4" />
        <text x="205" y="80" fill="#60a5fa" fontWeight="bold" fontSize="14">ε</text>

        {/* Κάθετος ΑΗ */}
        <line x1="120" y1="20" x2="120" y2="90" stroke="#10b981" strokeWidth="4" />
        <rect x="120" y="75" width="12" height="12" fill="none" stroke="#f59e0b" strokeWidth="2" />
        <text x="125" y="105" fill="#34d399" fontWeight="bold" fontSize="12">Η</text>

        {/* Πλάγιες ΑΖ, ΑΚ */}
        <line x1="120" y1="20" x2="60" y2="90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        <text x="55" y="105" fill="#94a3b8" fontWeight="bold" fontSize="12">Ζ</text>

        <line x1="120" y1="20" x2="180" y2="90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        <text x="180" y="105" fill="#94a3b8" fontWeight="bold" fontSize="12">Κ</text>

        {/* Σημείο Α */}
        <circle cx="120" cy="20" r="5" fill="#f43f5e" />
        <text x="115" y="12" fill="#f43f5e" fontWeight="black" fontSize="16">Α</text>
      </svg>
    )
  },
  {
    q: 'Στο παρακάτω σχήμα, το τμήμα ΑΗ είναι κάθετο στην ευθεία (ε). Ποιο τμήμα είναι το πιο ΣΥΝΤΟΜΟ (μικρότερο σε μήκος);',
    correct: 'Το κάθετο τμήμα ΑΗ',
    wrongs: ['Το πλάγιο τμήμα ΑΜ', 'Το πλάγιο τμήμα ΑΝ'],
    svg: (
      <svg className="w-56 h-32 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 240 120">
        <line x1="20" y1="90" x2="220" y2="90" stroke="#3b82f6" strokeWidth="4" />
        <text x="205" y="80" fill="#60a5fa" fontWeight="bold" fontSize="14">ε</text>

        {/* Κάθετος ΑΗ */}
        <line x1="80" y1="20" x2="80" y2="90" stroke="#10b981" strokeWidth="4" />
        <rect x="80" y="75" width="12" height="12" fill="none" stroke="#f59e0b" strokeWidth="2" />
        <text x="75" y="105" fill="#34d399" fontWeight="bold" fontSize="12">Η</text>

        {/* Πλάγιες ΑΜ, ΑΝ */}
        <line x1="80" y1="20" x2="140" y2="90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        <text x="140" y="105" fill="#94a3b8" fontWeight="bold" fontSize="12">Μ</text>

        <line x1="80" y1="20" x2="190" y2="90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        <text x="190" y="105" fill="#94a3b8" fontWeight="bold" fontSize="12">Ν</text>

        {/* Σημείο Α */}
        <circle cx="80" cy="20" r="5" fill="#f43f5e" />
        <text x="75" y="12" fill="#f43f5e" fontWeight="black" fontSize="16">Α</text>
      </svg>
    )
  }
];

// Pool Κατηγορίας 2: Θεωρητικές Ιδιότητες
const PROPERTIES_POOL = [
  { q: 'Τι γωνία σχηματίζει το ευθύγραμμο τμήμα της απόστασης ενός σημείου με την ευθεία;', correct: 'Ορθή γωνία (90°)', wrongs: ['Οξεία γωνία', 'Αμβλεία γωνία'] },
  { q: 'Ποιο όργανο γεωμετρίας χρησιμοποιούμε για να φέρουμε την κάθετη γραμμή από ένα σημείο σε μια ευθεία;', correct: 'Τον γνώμονα', wrongs: ['Μόνο τον διαβήτη', 'Το μοιρογνωμόνιο'] },
  { q: 'Αν φέρουμε από ένα σημείο Α προς μια ευθεία 5 διαφορετικά ευθύγραμμα τμήματα, ποιο θα έχει το ΜΙΚΡΟΤΕΡΟ μήκος;', correct: 'Το κάθετο τμήμα', wrongs: ['Το πιο λοξό τμήμα', 'Όλα θα έχουν το ίδιο μήκος'] }
];

// Pool Κατηγορίας 4: Σωστό / Λάθος
const TRUE_FALSE_POOL = [
  { q: 'Η απόσταση ενός σημείου από μια ευθεία είναι η πιο σύντομη διαδρομή ανάμεσά τους.', correct: 'Σωστό', explain: 'Σωστά! Το κάθετο τμήμα είναι πάντα το μικρότερο.' },
  { q: 'Μπορούμε να μετρήσουμε την απόσταση ενός σημείου από μια ευθεία φέρνοντας μια οποιαδήποτε πλάγια γραμμή.', correct: 'Λάθος', explain: 'Λάθος. Η απόσταση μετριέται ΜΟΝΟ με το ΚΑΘΕΤΟ ευθύγραμμο τμήμα.' },
  { q: 'Όλα τα πλάγια ευθύγραμμα τμήματα που ξεκινούν από το σημείο Α προς την ευθεία είναι μεγαλύτερα από το κάθετο τμήμα.', correct: 'Σωστό', explain: 'Σωστά! Η κάθετος είναι πάντα η μικρότερη.' },
  { q: 'Αν ένα σημείο Α βρίσκεται πάνω στην ευθεία (ε), τότε η απόστασή του από την ευθεία είναι 0 cm.', correct: 'Σωστό', explain: 'Σωστά! Αφού βρίσκεται πάνω στην ευθεία, η απόσταση είναι μηδέν.' }
];

// ----------------------------------------------------
// GENERATOR 8 ΑΣΚΗΣΕΩΝ
// ----------------------------------------------------
function makeComparisonQuestion(prevQuestion = null) {
  let ah, az;
  while (true) {
    ah = getRandomInt(3, 12); // Κάθετο (πάντα μικρότερο)
    az = ah + getRandomInt(2, 6); // Πλάγιο (πάντα μεγαλύτερο)

    if (!prevQuestion || prevQuestion.ah !== ah) break;
  }

  return {
    ah,
    az,
    exprA: `Κάθετο (ΑΗ) = ${ah} cm`,
    exprB: `Πλάγιο (ΑΖ) = ${az} cm`,
    correct: '<' // ΑΗ < ΑΖ
  };
}

function generateQuestions() {
  const prepareMcq = (item) => {
    const options = [{ text: item.correct, isCorrect: true }, ...item.wrongs.map(w => ({ text: w, isCorrect: false }))];
    return { ...item, options: options.sort(() => Math.random() - 0.5) };
  };

  // Q1 & Q2: Σχήματα
  const q1 = prepareMcq(SHAPE_POOL[0]);
  const q2 = prepareMcq(SHAPE_POOL[1]);

  // Q3 & Q4: Ιδιότητες
  let p1 = PROPERTIES_POOL[getRandomInt(0, PROPERTIES_POOL.length - 1)];
  let p2;
  while (true) {
    p2 = PROPERTIES_POOL[getRandomInt(0, PROPERTIES_POOL.length - 1)];
    if (p2.q !== p1.q) break;
  }

  // Q5 & Q6: Σύγκριση Μηκών
  const q5 = makeComparisonQuestion();
  const q6 = makeComparisonQuestion(q5);

  // Q7 & Q8: Σωστό / Λάθος
  let tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return {
    q1,
    q2,
    q3: prepareMcq(p1),
    q4: prepareMcq(p2),
    q5,
    q6,
    q7: tf1,
    q8: tf2
  };
}

export default function ApostasiAskPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt.text 
                ? 'border-teal-600 bg-teal-50/80 font-bold text-teal-900' 
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
              className="w-5 h-5 text-teal-600 focus:ring-teal-500"
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

  // Render Σύγκριση Μηκών (Q5 & Q6)
  const renderComparison = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Σύγκρινε το μήκος του κάθετου τμήματος με το πλάγιο τμήμα ( &lt; , &gt; , = ):
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-lg md:text-xl font-mono font-black text-gray-800">
          <span className="text-emerald-700">{qData.exprA}</span>
          
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

          <span className="text-slate-600">{qData.exprB}</span>
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος) — Το κάθετο τμήμα είναι πάντα μικρότερο!</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Το κάθετο τμήμα είναι πάντα μικρότερο, οπότε το σωστό σύμβολο είναι: <span className="font-mono font-black text-lg">&lt;</span></p>
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
        <title>📏 Ασκήσεις: Απόσταση Σημείου από Ευθεία - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/14-apostasi-simeiou-eutheia" className="bg-teal-100 hover:bg-teal-200 text-teal-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Απόσταση Σημείου από Ευθεία
              </h1>
              <p className="text-teal-100 text-sm md:text-base mt-1">
                8 Δυναμικές ασκήσεις! Πατώντας **«Νέες Ασκήσεις»** οι ερωτήσεις και οι αριθμοί αλλάζουν.
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

            {renderMcqQuestion('q1', questions.q1, 1, 'bg-teal-600')}
            {renderMcqQuestion('q2', questions.q2, 2, 'bg-teal-600')}

            {renderMcqQuestion('q3', questions.q3, 3, 'bg-emerald-600')}
            {renderMcqQuestion('q4', questions.q4, 4, 'bg-emerald-600')}

            {renderComparison('q5', questions.q5, 5)}
            {renderComparison('q6', questions.q6, 6)}

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

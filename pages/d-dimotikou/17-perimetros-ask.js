import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ----------------------------------------------------
// GENERATOR 8 ΑΣΚΗΣΕΩΝ
// ----------------------------------------------------

// 1. Υπολογισμός Περιμέτρου από Σχήμα (SVG)
function makeShapePerimeterQuestion(prevQ = null) {
  const shapes = ['square', 'rectangle', 'triangle'];
  let shapeType = shapes[getRandomInt(0, shapes.length - 1)];

  if (prevQ && prevQ.shapeType === shapeType) {
    shapeType = shapeType === 'square' ? 'rectangle' : 'square';
  }

  if (shapeType === 'square') {
    const a = getRandomInt(3, 12);
    const correct = 4 * a;
    return {
      shapeType,
      q: `Υπολόγισε την περίμετρο του παρακάτω τετραγώνου με πλευρά a = ${a} cm:`,
      correct,
      unit: 'cm',
      svg: (
        <svg className="w-48 h-32 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 120">
          <rect x="65" y="25" width="70" height="70" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="3" />
          <text x="100" y="18" fill="#fbbf24" fontWeight="bold" fontSize="12" textAnchor="middle">{a} cm</text>
          <text x="145" y="65" fill="#fbbf24" fontWeight="bold" fontSize="12">{a} cm</text>
        </svg>
      )
    };
  } else if (shapeType === 'rectangle') {
    const a = getRandomInt(6, 15); // Μήκος
    const b = getRandomInt(3, a - 1); // Πλάτος
    const correct = 2 * a + 2 * b;
    return {
      shapeType,
      q: `Υπολόγισε την περίμετρο του παρακάτω ορθογωνίου με μήκος ${a} cm και πλάτος ${b} cm:`,
      correct,
      unit: 'cm',
      svg: (
        <svg className="w-52 h-32 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 220 120">
          <rect x="40" y="30" width="140" height="60" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="3" />
          <text x="110" y="22" fill="#fbbf24" fontWeight="bold" fontSize="12" textAnchor="middle">{a} cm</text>
          <text x="190" y="65" fill="#fbbf24" fontWeight="bold" fontSize="12">{b} cm</text>
        </svg>
      )
    };
  } else {
    const a = getRandomInt(4, 10);
    const b = getRandomInt(4, 10);
    const c = getRandomInt(4, 10);
    const correct = a + b + c;
    return {
      shapeType,
      q: `Υπολόγισε την περίμετρο του παρακάτω τριγώνου με πλευρές a = ${a} cm, b = ${b} cm, c = ${c} cm:`,
      correct,
      unit: 'cm',
      svg: (
        <svg className="w-48 h-32 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 120">
          <polygon points="100,20 40,95 160,95" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="3" />
          <text x="60" y="55" fill="#fbbf24" fontWeight="bold" fontSize="11">{a} cm</text>
          <text x="140" y="55" fill="#fbbf24" fontWeight="bold" fontSize="11">{b} cm</text>
          <text x="100" y="112" fill="#fbbf24" fontWeight="bold" fontSize="11" textAnchor="middle">{c} cm</text>
        </svg>
      )
    };
  }
}

// 2. Εύρεση Άγνωστης Πλευράς (Input)
function makeMissingSideQuestion(prevQ = null) {
  const isSquare = prevQ ? !prevQ.isSquare : Math.random() > 0.5;

  if (isSquare) {
    const side = getRandomInt(4, 15);
    const perim = side * 4;
    return {
      isSquare: true,
      q: `Ένα τετράγωνο έχει συνολική περίμετρο ${perim} cm. Πόσο είναι το μήκος της μίας πλευράς του;`,
      correct: side,
      unit: 'cm',
      explain: `Αφού το τετράγωνο έχει 4 ίσες πλευρές: ${perim} : 4 = ${side} cm.`
    };
  } else {
    const side = getRandomInt(5, 18);
    const perim = side * 3;
    return {
      isSquare: false,
      q: `Ένα ισόπλευρο τρίγωνο (με 3 ίσες πλευρές) έχει περίμετρο ${perim} cm. Πόσο είναι η κάθε πλευρά του;`,
      correct: side,
      unit: 'cm',
      explain: `Αφού το ισόπλευρο τρίγωνο έχει 3 ίσες πλευρές: ${perim} : 3 = ${side} cm.`
    };
  }
}

// 3. Προβλήματα Καθημερινότητας (MCQ) - Pool
const REAL_PROBLEMS_POOL = [
  {
    make: () => {
      const w = getRandomInt(12, 25);
      const h = getRandomInt(8, 15);
      const correctVal = 2 * w + 2 * h;
      return {
        q: `Ο κύριος Νίκος θέλει να βάλει ξύλινο φράχτη γύρω από έναν ορθογώνιο κήπο με μήκος ${w} m και πλάτος ${h} m. Πόσα μέτρα φράχτη θα χρειαστεί;`,
        correct: `${correctVal} μέτρα`,
        wrongs: [`${w + h} μέτρα`, `${2 * w + h} μέτρα`, `${w * h} μέτρα`]
      };
    }
  },
  {
    make: () => {
      const side = getRandomInt(5, 12);
      const correctVal = 4 * side;
      return {
        q: `Μια τετράγωνη παιδική χαρά έχει πλευρά ${side} m. Πόσο μήκος έχει το προστατευτικό κιγκλίδωμα γύρω-γύρω;`,
        correct: `${correctVal} m`,
        wrongs: [`${side * 2} m`, `${side * 3} m`, `${side * side} m`]
      };
    }
  },
  {
    make: () => {
      const a = getRandomInt(10, 20);
      const b = getRandomInt(10, 20);
      const c = getRandomInt(10, 20);
      const correctVal = a + b + c;
      return {
        q: `Ένα τριγωνικό πάρκο έχει πλευρές ${a} m, ${b} m και ${c} m. Πόσα μέτρα είναι ο γύρος του πάρκου;`,
        correct: `${correctVal} m`,
        wrongs: [`${a + b} m`, `${2 * (a + b)} m`, `${a + c} m`]
      };
    }
  }
];

function makeRealProblemQuestion(prevQ = null) {
  let probObj;
  while (true) {
    const raw = REAL_PROBLEMS_POOL[getRandomInt(0, REAL_PROBLEMS_POOL.length - 1)];
    probObj = raw.make();
    if (!prevQ || prevQ.q !== probObj.q) break;
  }

  const options = [
    { text: probObj.correct, isCorrect: true },
    ...probObj.wrongs.map(w => ({ text: w, isCorrect: false }))
  ].sort(() => Math.random() - 0.5);

  return { ...probObj, options };
}

// 4. Σωστό / Λάθος
const TRUE_FALSE_POOL = [
  { q: 'Η περίμετρος ενός σχήματος είναι το συνολικό μήκος του περιγράμματός του.', correct: 'Σωστό', explain: 'Σωστά! Είναι το άθροισμα όλων των εξωτερικών πλευρών.' },
  { q: 'Για να βρούμε την περίμετρο ενός τετραγώνου, πολλαπλασιάζουμε την πλευρά του επί 4.', correct: 'Σωστό', explain: 'Σωστά! Αφού έχει 4 ίσες πλευρές.' },
  { q: 'Για να βρούμε την περίμετρο ενός ορθογωνίου, προσθέτουμε μόνο το μήκος και το πλάτος του 1 φορά.', correct: 'Λάθος', explain: 'Λάθος! Πρέπει να τα προσθέσουμε από 2 φορές (2 × μήκος + 2 × πλάτος).' },
  { q: 'Δύο διαφορετικά σχήματα είναι αδύνατον να έχουν την ίδια περίμετρο.', correct: 'Λάθος', explain: 'Λάθος! Δύο διαφορετικά σχήματα μπορούν να έχουν την ίδια περίμετρο (π.χ. ένα τετράγωνο πλευράς 3cm και ένα ορθογώνιο 4cm x 2cm έχουν και τα δύο περίμετρο 12cm).' }
];

function generateQuestions() {
  const q1 = makeShapePerimeterQuestion();
  const q2 = makeShapePerimeterQuestion(q1);

  const q3 = makeMissingSideQuestion();
  const q4 = makeMissingSideQuestion(q3);

  const q5 = makeRealProblemQuestion();
  const q6 = makeRealProblemQuestion(q5);

  let tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return { q1, q2, q3, q4, q5, q6, q7: tf1, q8: tf2 };
}

export default function PerimetrosAskPage() {
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

      {qData.svg && <div className="mb-4">{qData.svg}</div>}

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2">
          <input 
            type="number"
            placeholder="Γράψε τον αριθμό"
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <span className="font-bold text-gray-600">{qData.unit}</span>
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. {qData.explain || `Η σωστή απάντηση είναι: ${qData.correct} ${qData.unit}`}</p>
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
        <span className="bg-orange-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">{qData.q}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt.text 
                ? 'border-amber-600 bg-amber-50/80 font-bold text-amber-900' 
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
              className="w-5 h-5 text-amber-600 focus:ring-amber-500"
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
        <span className="bg-rose-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
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
        <title>📏 Ασκήσεις: Υπολογισμός Περιμέτρου - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/17-perimetros" className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Υπολογισμός Περιμέτρου
              </h1>
              <p className="text-amber-100 text-sm md:text-base mt-1">
                8 Δυναμικές ασκήσεις! Πατώντας **«Νέες Ασκήσεις»** οι ερωτήσεις και οι αριθμοί αλλάζουν.
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

            {renderInputNumber('q1', questions.q1, 1, 'bg-amber-500')}
            {renderInputNumber('q2', questions.q2, 2, 'bg-amber-500')}

            {renderInputNumber('q3', questions.q3, 3, 'bg-amber-600')}
            {renderInputNumber('q4', questions.q4, 4, 'bg-amber-600')}

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

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// SVG Γραφικά για τις ερωτήσεις αναγνώρισης
const SOLIDS_SVGS = {
  cube: (
    <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
      <line x1="50" y1="130" x2="50" y2="70" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <line x1="50" y1="130" x2="110" y2="130" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <line x1="50" y1="130" x2="90" y2="160" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <polygon points="90,100 150,100 150,160 90,160" fill="#3b82f6" fillOpacity="0.4" stroke="#1d4ed8" strokeWidth="3" />
      <polygon points="90,100 150,100 110,70 50,70" fill="#60a5fa" fillOpacity="0.5" stroke="#1d4ed8" strokeWidth="3" />
      <polygon points="150,100 150,160 110,130 110,70" fill="#2563eb" fillOpacity="0.6" stroke="#1d4ed8" strokeWidth="3" />
    </svg>
  ),
  cuboid: (
    <svg className="w-40 h-36 mx-auto" viewBox="0 0 220 200">
      <line x1="40" y1="130" x2="40" y2="70" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <line x1="40" y1="130" x2="130" y2="130" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <line x1="40" y1="130" x2="80" y2="160" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <polygon points="80,100 170,100 170,160 80,160" fill="#14b8a6" fillOpacity="0.4" stroke="#0f766e" strokeWidth="3" />
      <polygon points="80,100 170,100 130,70 40,70" fill="#2dd4bf" fillOpacity="0.5" stroke="#0f766e" strokeWidth="3" />
      <polygon points="170,100 170,160 130,130 130,70" fill="#0d9488" fillOpacity="0.6" stroke="#0f766e" strokeWidth="3" />
    </svg>
  ),
  sqPyramid: (
    <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
      <line x1="40" y1="130" x2="130" y2="130" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <line x1="40" y1="130" x2="70" y2="160" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <line x1="40" y1="130" x2="100" y2="40" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <polygon points="70,160 160,160 100,40" fill="#f59e0b" fillOpacity="0.4" stroke="#b45309" strokeWidth="3" />
      <polygon points="160,160 130,130 100,40" fill="#d97706" fillOpacity="0.6" stroke="#b45309" strokeWidth="3" />
      <polygon points="70,160 100,40 40,130" fill="#fbbf24" fillOpacity="0.3" stroke="#b45309" strokeWidth="3" />
    </svg>
  ),
  triPyramid: (
    <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
      <line x1="90" y1="120" x2="100" y2="40" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <line x1="40" y1="150" x2="90" y2="120" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <line x1="160" y1="150" x2="90" y2="120" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <polygon points="40,150 160,150 100,40" fill="#f43f5e" fillOpacity="0.4" stroke="#be123c" strokeWidth="3" />
    </svg>
  ),
  cylinder: (
    <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
      <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <path d="M 50,60 L 50,150 A 50,15 0 0,0 150,150 L 150,60 Z" fill="#8b5cf6" fillOpacity="0.4" stroke="#6d28d9" strokeWidth="3" />
      <ellipse cx="100" cy="60" rx="50" ry="15" fill="#a78bfa" fillOpacity="0.7" stroke="#6d28d9" strokeWidth="3" />
    </svg>
  ),
  cone: (
    <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
      <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <path d="M 50,150 L 100,40 L 150,150 A 50,15 0 0,1 50,150 Z" fill="#06b6d4" fillOpacity="0.4" stroke="#0e7490" strokeWidth="3" />
      <circle cx="100" cy="40" r="4" fill="#fbbf24" />
    </svg>
  ),
  sphere: (
    <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="65" fill="#10b981" fillOpacity="0.4" stroke="#047857" strokeWidth="3" />
      <path d="M 35,100 A 65,20 0 0,1 165,100" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
      <path d="M 35,100 A 65,20 0 0,0 165,100" fill="none" stroke="#047857" strokeWidth="2" />
      <ellipse cx="80" cy="75" rx="15" ry="8" fill="#ffffff" fillOpacity="0.6" transform="rotate(-30, 80, 75)" />
    </svg>
  )
};

const SOLIDS_DATABASE = [
  { key: 'cube', name: 'Κύβος', faces: 6, edges: 12, vertices: 8, facesDesc: '6 ίσα τετράγωνα' },
  { key: 'cuboid', name: 'Ορθογώνιο Παραλληλεπίπεδο', faces: 6, edges: 12, vertices: 8, facesDesc: '6 ορθογώνια' },
  { key: 'sqPyramid', name: 'Τετραγωνική Πυραμίδα', faces: 5, edges: 8, vertices: 5, facesDesc: '1 τετράγωνο και 4 τρίγωνα' },
  { key: 'triPyramid', name: 'Τριγωνική Πυραμίδα (Τετράεδρο)', faces: 4, edges: 6, vertices: 4, facesDesc: '4 τρίγωνα' },
  { key: 'cylinder', name: 'Κύλινδρος', faces: 3, edges: 0, vertices: 0, facesDesc: '2 κύκλοι και 1 καμπύλη επιφάνεια' },
  { key: 'cone', name: 'Κώνος', faces: 2, edges: 0, vertices: 1, facesDesc: '1 κύκλος και 1 καμπύλη επιφάνεια' },
  { key: 'sphere', name: 'Σφαίρα', faces: 1, edges: 0, vertices: 0, facesDesc: '1 ενιαία καμπύλη επιφάνεια' }
];

// 1. Άσκηση: Αναγνώριση Στερεού από SVG (MCQ)
function makeSolidRecognitionQuestion() {
  const solid = SOLIDS_DATABASE[getRandomInt(0, SOLIDS_DATABASE.length - 1)];
  const correctName = solid.name;

  const wrongs = SOLIDS_DATABASE
    .map(s => s.name)
    .filter(n => n !== correctName);

  const shuffledWrongs = wrongs.sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [correctName, ...shuffledWrongs].sort(() => Math.random() - 0.5);

  return {
    q: 'Ποιο γεωμετρικό στερεό απεικονίζεται στο παρακάτω σχήμα;',
    svg: SOLIDS_SVGS[solid.key],
    options,
    correct: correctName,
    explain: `Το σχήμα είναι ${correctName}.`
  };
}

// 2. Άσκηση: Καταμέτρηση Εδρών, Ακμών ή Κορυφών (Input)
function makeCountFeatureQuestion() {
  const polyhedra = SOLIDS_DATABASE.slice(0, 4); // Μόνο πολύεδρα (Κύβος, Παραλληλεπίπεδο, Πυραμίδες)
  const solid = polyhedra[getRandomInt(0, polyhedra.length - 1)];
  const featureType = getRandomInt(1, 3); // 1 = Έδρες, 2 = Ακμές, 3 = Κορυφές

  let qText = '';
  let correctVal = 0;
  let featureName = '';

  if (featureType === 1) {
    qText = `Πόσες έδρες έχει το στερεό: «${solid.name}»;`;
    correctVal = solid.faces;
    featureName = 'έδρες';
  } else if (featureType === 2) {
    qText = `Πόσες ακμές έχει το στερεό: «${solid.name}»;`;
    correctVal = solid.edges;
    featureName = 'ακμές';
  } else {
    qText = `Πόσες κορυφές έχει το στερεό: «${solid.name}»;`;
    correctVal = solid.vertices;
    featureName = 'κορυφές';
  }

  return {
    q: qText,
    correct: correctVal,
    explain: `${solid.name} έχει ακριβώς ${correctVal} ${featureName}.`
  };
}

// 3. Άσκηση: Αντικείμενα Καθημερινότητας (MCQ)
function makeRealLifeMatchingQuestion() {
  const examples = [
    { item: 'Ένα ζάρι 🎲', correct: 'Κύβος', wrongs: ['Σφαίρα', 'Κώνος', 'Κύλινδρος'] },
    { item: 'Ένα κουτάκι αναψυκτικού 🥤', correct: 'Κύλινδρος', wrongs: ['Κύβος', 'Τετραγωνική Πυραμίδα', 'Κώνος'] },
    { item: 'Μία μπάλα ποδοσφαίρου ⚽', correct: 'Σφαίρα', wrongs: ['Κύβος', 'Κύλινδρος', 'Ορθογώνιο Παραλληλεπίπεδο'] },
    { item: 'Ένα χωνάκι παγωτού 🍦', correct: 'Κώνος', wrongs: ['Σφαίρα', 'Κύβος', 'Ορθογώνιο Παραλληλεπίπεδο'] },
    { item: 'Ένα κουτί παπουτσιών 📦', correct: 'Ορθογώνιο Παραλληλεπίπεδο', wrongs: ['Κύλινδρος', 'Σφαίρα', 'Κώνος'] },
    { item: 'Μία σκηνή κάμπινγκ τύπου πυραμίδας ⛺', correct: 'Τετραγωνική Πυραμίδα', wrongs: ['Κύλινδρος', 'Κύβος', 'Σφαίρα'] }
  ];

  const ex = examples[getRandomInt(0, examples.length - 1)];
  const options = [ex.correct, ...ex.wrongs].sort(() => Math.random() - 0.5);

  return {
    q: `${ex.item} έχει το σχήμα ποιου γεωμετρικού στερεού;`,
    options,
    correct: ex.correct,
    explain: `${ex.item} έχει το σχήμα: ${ex.correct}.`
  };
}

// 4. Άσκηση: Σωστό / Λάθος για τα Στερεά
const TRUE_FALSE_POOL = [
  {
    q: 'Ο κύβος έχει 6 ίσες τετράγωνες έδρες, 12 ακμές και 8 κορυφές.',
    correct: 'Σωστό',
    explain: 'Σωστά! Ο κύβος έχει 6 έδρες (τετράγωνα), 12 ακμές και 8 κορυφές.'
  },
  {
    q: 'Η σφαίρα έχει 6 επίπεδες έδρες και 8 κορυφές.',
    correct: 'Λάθος',
    explain: 'Λάθος! Η σφαίρα έχει 1 ενιαία καμπύλη επιφάνεια και καθόλου ακμές ή κορυφές.'
  },
  {
    q: 'Ο κύλινδρος έχει 2 κυκλικές βάσεις και 1 καμπύλη επιφάνεια.',
    correct: 'Σωστό',
    explain: 'Σωστά! Ο κύλινδρος έχει 2 ίσους κυκλικούς δίσκους για βάσεις.'
  },
  {
    q: 'Η τετραγωνική πυραμίδα έχει συνολικά 8 κορυφές.',
    correct: 'Λάθος',
    explain: 'Λάθος! Η τετραγωνική πυραμίδα έχει 5 κορυφές (4 στη βάση + 1 στην κορυφή).'
  },
  {
    q: 'Το ορθογώνιο παραλληλεπίπεδο έχει 12 ακμές και 8 κορυφές.',
    correct: 'Σωστό',
    explain: 'Σωστά! Το παραλληλεπίπεδο έχει 6 έδρες, 12 ακμές και 8 κορυφές.'
  },
  {
    q: 'Ο κώνος έχει 1 κυκλική βάση και 1 κορυφή.',
    correct: 'Σωστό',
    explain: 'Σωστά! Ο κώνος έχει 1 κυκλική βάση και 1 κορυφή.'
  }
];

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  let tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return {
    q1: makeSolidRecognitionQuestion(),
    q2: makeSolidRecognitionQuestion(),
    q3: makeCountFeatureQuestion(),
    q4: makeCountFeatureQuestion(),
    q5: makeRealLifeMatchingQuestion(),
    q6: makeRealLifeMatchingQuestion(),
    q7: tf1,
    q8: tf2
  };
}

export default function StereaAskPage() {
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
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render MCQ Ασκήσεων (Q1, Q2, Q5, Q6)
  const renderMCQQuestion = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">{qData.q}</h3>
      </div>

      {qData.svg && (
        <div className="bg-slate-900 p-4 rounded-2xl w-fit mx-auto mb-5 shadow-inner">
          {qData.svg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt 
                ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-900' 
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
              className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm md:text-base font-bold">{opt}</span>
          </label>
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

  // Render Input Number Ασκήσεων (Q3 & Q4)
  const renderInputNumber = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-purple-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">{qData.q}</h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2">
          <input 
            type="number"
            placeholder="Γράψε τον αριθμό"
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>
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
        <span className="bg-teal-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">{qData.q}</h3>
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
        <title>🧊 Ασκήσεις: Γεωμετρικά Στερεά - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/27-sterea" className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
                📝 Ασκήσεις: Γεωμετρικά Στερεά
              </h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">
                8 Δυναμικές ασκήσεις! Πατώντας **«Νέες Ασκήσεις»** τα στερεά και οι ερωτήσεις αλλάζουν αυτόματα.
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

            {renderMCQQuestion('q1', questions.q1, 1)}
            {renderMCQQuestion('q2', questions.q2, 2)}

            {renderInputNumber('q3', questions.q3, 3)}
            {renderInputNumber('q4', questions.q4, 4)}

            {renderMCQQuestion('q5', questions.q5, 5)}
            {renderMCQQuestion('q6', questions.q6, 6)}

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
                <span>🔄</span> Παίξε ξανά με νέες ασκήσεις!
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

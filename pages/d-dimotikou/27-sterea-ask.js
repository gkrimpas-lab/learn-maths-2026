// pages/d-dimotikou/27-sterea-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// SVG Γραφικά για τις ερωτήσεις αναγνώρισης
const SOLIDS_SVGS = {
  cube: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <line x1="50" y1="130" x2="50" y2="70" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="50" y1="130" x2="110" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="50" y1="130" x2="90" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <polygon points="90,100 150,100 150,160 90,160" fill="#3b82f6" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="3" />
      <polygon points="90,100 150,100 110,70 50,70" fill="#60a5fa" fillOpacity="0.45" stroke="#1d4ed8" strokeWidth="3" />
      <polygon points="150,100 150,160 110,130 110,70" fill="#2563eb" fillOpacity="0.55" stroke="#1d4ed8" strokeWidth="3" />
    </svg>
  ),
  cuboid: (
    <svg className="w-40 h-36 mx-auto block select-none" viewBox="0 0 220 200">
      <line x1="40" y1="130" x2="40" y2="70" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="40" y1="130" x2="130" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="40" y1="130" x2="80" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <polygon points="80,100 170,100 170,160 80,160" fill="#14b8a6" fillOpacity="0.35" stroke="#0f766e" strokeWidth="3" />
      <polygon points="80,100 170,100 130,70 40,70" fill="#2dd4bf" fillOpacity="0.45" stroke="#0f766e" strokeWidth="3" />
      <polygon points="170,100 170,160 130,130 130,70" fill="#0d9488" fillOpacity="0.55" stroke="#0f766e" strokeWidth="3" />
    </svg>
  ),
  sqPyramid: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <line x1="40" y1="130" x2="130" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="40" y1="130" x2="70" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="40" y1="130" x2="100" y2="40" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <polygon points="70,160 160,160 100,40" fill="#f59e0b" fillOpacity="0.35" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="160,160 130,130 100,40" fill="#d97706" fillOpacity="0.55" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="70,160 100,40 40,130" fill="#fbbf24" fillOpacity="0.25" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  ),
  triPyramid: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <line x1="90" y1="120" x2="100" y2="40" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="40" y1="150" x2="90" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="160" y1="150" x2="90" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <polygon points="40,150 160,150 100,40" fill="#f43f5e" fillOpacity="0.4" stroke="#be123c" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  ),
  cylinder: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <path d="M 50,60 L 50,150 A 50,15 0 0,0 150,150 L 150,60 Z" fill="#8b5cf6" fillOpacity="0.35" stroke="#6d28d9" strokeWidth="3" />
      <ellipse cx="100" cy="60" rx="50" ry="15" fill="#a78bfa" fillOpacity="0.65" stroke="#6d28d9" strokeWidth="3" />
    </svg>
  ),
  cone: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <path d="M 50,150 L 100,40 L 150,150 A 50,15 0 0,1 50,150 Z" fill="#06b6d4" fillOpacity="0.35" stroke="#0e7490" strokeWidth="3" />
      <circle cx="100" cy="40" r="4.5" fill="#fbbf24" />
    </svg>
  ),
  sphere: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="65" fill="#10b981" fillOpacity="0.35" stroke="#047857" strokeWidth="3" />
      <path d="M 35,100 A 65,20 0 0,1 165,100" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <path d="M 35,100 A 65,20 0 0,0 165,100" fill="none" stroke="#047857" strokeWidth="2.5" />
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

// 1. Άσκηση: Αναγνώριση Στερεού από SVG (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeSolidRecognitionQuestion(prevQ = null) {
  let solid, correctName;

  while (true) {
    solid = SOLIDS_DATABASE[getRandomInt(0, SOLIDS_DATABASE.length - 1)];
    correctName = solid.name;
    if (!prevQ || prevQ.correct !== correctName) break;
  }

  const wrongs = SOLIDS_DATABASE.map((s) => s.name).filter((n) => n !== correctName);
  const shuffledWrongs = wrongs.sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [correctName, ...shuffledWrongs].sort(() => Math.random() - 0.5);

  return {
    q: 'Ποιο γεωμετρικό στερεό απεικονίζεται στο παρακάτω σχήμα;',
    svg: SOLIDS_SVGS[solid.key],
    options,
    correct: correctName,
    explainText: `Το συγκεκριμένο τρισδιάστατο γεωμετρικό σώμα είναι ${correctName}.`
  };
}

// 2. Άσκηση: Καταμέτρηση Εδρών, Ακμών ή Κορυφών (Input)
function makeCountFeatureQuestion(prevQ = null) {
  const polyhedra = SOLIDS_DATABASE.slice(0, 4); // Πολύεδρα
  let solid, featureType, qText, correctVal, featureName;

  while (true) {
    solid = polyhedra[getRandomInt(0, polyhedra.length - 1)];
    featureType = getRandomInt(1, 3); // 1 = Έδρες, 2 = Ακμές, 3 = Κορυφές

    if (featureType === 1) {
      qText = `Πόσες έδρες έχει συνολικά το στερεό: «${solid.name}»;`;
      correctVal = solid.faces;
      featureName = 'έδρες';
    } else if (featureType === 2) {
      qText = `Πόσες ακμές έχει συνολικά το στερεό: «${solid.name}»;`;
      correctVal = solid.edges;
      featureName = 'ακμές';
    } else {
      qText = `Πόσες κορυφές έχει συνολικά το στερεό: «${solid.name}»;`;
      correctVal = solid.vertices;
      featureName = 'κορυφές';
    }

    if (!prevQ || prevQ.q !== qText) break;
  }

  return {
    q: qText,
    correct: correctVal,
    unit: featureName,
    explainText: `${solid.name} έχει ακριβώς ${correctVal} ${featureName}.`
  };
}

// 3. Άσκηση: Αντικείμενα Καθημερινότητας (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeRealLifeMatchingQuestion(prevQ = null) {
  const examples = [
    { item: 'Ένα ζάρι 🎲', correct: 'Κύβος', wrongs: ['Σφαίρα', 'Κώνος', 'Κύλινδρος'] },
    { item: 'Ένα κουτάκι αναψυκτικού 🥤', correct: 'Κύλινδρος', wrongs: ['Κύβος', 'Τετραγωνική Πυραμίδα', 'Κώνος'] },
    { item: 'Μία μπάλα ποδοσφαίρου ⚽', correct: 'Σφαίρα', wrongs: ['Κύβος', 'Κύλινδρος', 'Ορθογώνιο Παραλληλεπίπεδο'] },
    { item: 'Ένα χωνάκι παγωτού 🍦', correct: 'Κώνος', wrongs: ['Σφαίρα', 'Κύβος', 'Ορθογώνιο Παραλληλεπίπεδο'] },
    { item: 'Ένα κουτί παπουτσιών 📦', correct: 'Ορθογώνιο Παραλληλεπίπεδο', wrongs: ['Κύλινδρος', 'Σφαίρα', 'Κώνος'] },
    { item: 'Μία σκηνή κάμπινγκ τύπου πυραμίδας ⛺', correct: 'Τετραγωνική Πυραμίδα', wrongs: ['Κύλινδρος', 'Κύβος', 'Σφαίρα'] }
  ];

  let ex;
  while (true) {
    ex = examples[getRandomInt(0, examples.length - 1)];
    if (!prevQ || prevQ.item !== ex.item) break;
  }

  const options = [ex.correct, ...ex.wrongs].sort(() => Math.random() - 0.5);

  return {
    item: ex.item,
    q: `${ex.item} έχει το σχήμα ποιου γεωμετρικού στερεού;`,
    options,
    correct: ex.correct,
    explainText: `${ex.item} προσομοιάζει το γεωμετρικό σχήμα: ${ex.correct}.`
  };
}

// 4. Άσκηση: Σωστό / Λάθος για τα Στερεά
// (Χωρίς «Σωστά!» ή «Λάθος!» στο κείμενο εξήγησης)
const TRUE_FALSE_POOL = [
  {
    q: 'Ο κύβος έχει 6 ίσες τετράγωνες έδρες, 12 ακμές και 8 κορυφές.',
    correct: 'Σωστό',
    explain: 'Ο κύβος αποτελείται από 6 ίσα τετράγωνα, έχει 12 ακμές και 8 κορυφές.'
  },
  {
    q: 'Η σφαίρα διαθέτει 6 επίπεδες έδρες και 8 κορυφές.',
    correct: 'Λάθος',
    explain: 'Η σφαίρα είναι σώμα εκ περιστροφής με 1 ενιαία καμπύλη επιφάνεια και δεν έχει καθόλου ακμές ή κορυφές.'
  },
  {
    q: 'Ο κύλινδρος έχει 2 ίσες κυκλικές βάσεις και 1 καμπύλη επιφάνεια.',
    correct: 'Σωστό',
    explain: 'Οι δύο βάσεις του κυλίνδρου είναι ίσοι κυκλικοί δίσκοι ενωμένοι με καμπύλη παράπλευρη επιφάνεια.'
  },
  {
    q: 'Η τετραγωνική πυραμίδα έχει συνολικά 8 κορυφές.',
    correct: 'Λάθος',
    explain: 'Η τετραγωνική πυραμίδα έχει 5 κορυφές (4 στη βάση ＋ 1 στην κορυφή), ενώ 8 είναι οι ακμές της.'
  },
  {
    q: 'Το ορθογώνιο παραλληλεπίπεδο έχει 12 ακμές και 8 κορυφές.',
    correct: 'Σωστό',
    explain: 'Το ορθογώνιο παραλληλεπίπεδο αποτελείται από 6 ορθογώνιες έδρες, 12 ακμές και 8 κορυφές.'
  },
  {
    q: 'Ο κώνος διαθέτει 1 κυκλική βάση και 1 κορυφή.',
    correct: 'Σωστό',
    explain: 'Ο κώνος έχει μία επίπεδη κυκλική βάση και μία μυτερή κορυφή.'
  }
];

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  const q1 = makeSolidRecognitionQuestion();
  const q2 = makeSolidRecognitionQuestion(q1);

  const q3 = makeCountFeatureQuestion();
  const q4 = makeCountFeatureQuestion(q3);

  const q5 = makeRealLifeMatchingQuestion();
  const q6 = makeRealLifeMatchingQuestion(q5);

  const tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return { q1, q2, q3, q4, q5, q6, q7: tf1, q8: tf2 };
}

export default function StereaAskPage() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
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
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/\D/g, '');
    setAnswers((prev) => ({ ...prev, [key]: clean }));
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
  const renderMCQQuestion = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-indigo-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        {qData.svg && (
          <div className="bg-slate-950 p-4 rounded-2xl w-fit mx-auto mb-4 border border-slate-800 shadow-inner">
            {qData.svg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${qKey}-opt-${idx}`}
                  name={qKey}
                  value={opt}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt)}
                  disabled={submitted}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0"
                />
                <span className="leading-snug font-bold text-sm sm:text-base">{opt}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η σωστή απάντηση είναι: <strong className="font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Input Number Ασκήσεων (Q3 & Q4)
  const renderInputNumber = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-purple-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">Αποτέλεσμα:</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="Αριθμός"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-purple-950 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
            />
            <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">
              {qData.unit}
            </span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η σωστή απάντηση είναι <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)} {qData.unit}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Σωστό / Λάθος (Q7 & Q8)
  const renderTrueFalse = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-teal-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        <div className="flex gap-3 sm:pl-11">
          {['Σωστό', 'Λάθος'].map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => handleInputChange(qKey, opt)}
              disabled={submitted}
              className={`px-6 sm:px-8 py-3 rounded-2xl font-black text-sm sm:text-base border transition active:scale-95 touch-manipulation select-none ${
                answers[qKey] === opt
                  ? (opt === 'Σωστό' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-rose-600 text-white border-rose-700 shadow-md')
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explain}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η πρόταση είναι <strong className="font-bold text-rose-900">«{qData.correct}»</strong>: {qData.explain}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Γεωμετρικά Στερεά Σώματα | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στα γεωμετρικά στερεά: αναγνώριση 3D σχημάτων, καταμέτρηση εδρών, ακμών και κορυφών και αντικείμενα καθημερινότητας."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/27-sterea"
          className="bg-blue-100 hover:bg-blue-200 text-blue-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Γεωμετρικά Στερεά Σώματα
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», τα στερεά, οι ερωτήσεις και οι μετρήσεις ανανεώνονται αυτόματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-blue-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
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
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 Έλεγχος Απαντήσεων
              </button>
            </div>
          )}
        </form>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                Επιτυχία: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

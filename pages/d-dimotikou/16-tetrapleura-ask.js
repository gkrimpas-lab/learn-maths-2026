// pages/d-dimotikou/16-tetrapleura-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΕΡΩΤΗΣΕΩΝ (POOLS)
// ----------------------------------------------------

// Pool Κατηγορίας 1: Αναγνώριση Σχημάτων (MCQ) - 4 Επιλογές (ΟΜΑΔΑ Α)
const SHAPES_IDENTIFY_POOL = [
  {
    q: 'Ποιο τετράπλευρο έχει όλες τις πλευρές του ίσες, αλλά οι γωνίες του ΔΕΝ είναι ορθές (90°);',
    correct: 'Ο Ρόμβος',
    wrongs: ['Το Τετράγωνο', 'Το Ορθογώνιο', 'Το Πλάγιο Παραλληλόγραμμο'],
    explainText: 'Ο ρόμβος έχει και τις 4 πλευρές ίσες, όμως οι γωνίες του είναι πλάγιες (δεν είναι ορθές 90°).',
    svg: (
      <svg className="w-56 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
        <polygon points="65,22 125,22 145,78 85,78" fill="#a855f7" fillOpacity="0.25" stroke="#a855f7" strokeWidth="3.5" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    q: 'Ποιο τετράπλευρο έχει τις απέναντι πλευρές του ίσες & παράλληλες και 4 ορθές γωνίες (90°);',
    correct: 'Το Ορθογώνιο Παραλληλόγραμμο',
    wrongs: ['Ο Ρόμβος', 'Το Πλάγιο Παραλληλόγραμμο', 'Το Τραπέζιο'],
    explainText: 'Το ορθογώνιο έχει 4 ορθές γωνίες και οι απέναντι πλευρές του είναι παράλληλες και ίσες ανά δύο.',
    svg: (
      <svg className="w-56 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
        <rect x="35" y="25" width="130" height="50" rx="3" fill="#3b82f6" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="3.5" />
        <path d="M 35 37 L 47 37 L 47 25" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
        <path d="M 153 25 L 153 37 L 165 37" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
        <path d="M 35 63 L 47 63 L 47 75" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
        <path d="M 153 75 L 153 63 L 165 63" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
      </svg>
    )
  },
  {
    q: 'Ποιο κανονικό τετράπλευρο έχει ΚΑΙ τις 4 πλευρές του ίσες ΚΑΙ 4 ορθές γωνίες (90°);',
    correct: 'Το Τετράγωνο',
    wrongs: ['Ο Ρόμβος', 'Το Ορθογώνιο Παραλληλόγραμμο', 'Το Πλάγιο Παραλληλόγραμμο'],
    explainText: 'Το τετράγωνο συνδυάζει 4 ίσες πλευρές και 4 ορθές γωνίες 90°.',
    svg: (
      <svg className="w-56 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
        <rect x="70" y="20" width="60" height="60" rx="3" fill="#6366f1" fillOpacity="0.25" stroke="#6366f1" strokeWidth="3.5" />
        <path d="M 70 32 L 82 32 L 82 20" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
        <path d="M 118 20 L 118 32 L 130 32" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
        <path d="M 70 68 L 82 68 L 82 80" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
        <path d="M 118 80 L 118 68 L 130 68" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
      </svg>
    )
  },
  {
    q: 'Ποιο τετράπλευρο έχει απέναντι πλευρές ίσες και παράλληλες, αλλά καμία ορθή γωνία;',
    correct: 'Το Πλάγιο Παραλληλόγραμμο',
    wrongs: ['Το Τετράγωνο', 'Το Ορθογώνιο', 'Ο Ρόμβος με ίσες πλευρές'],
    explainText: 'Το πλάγιο παραλληλόγραμμο έχει απέναντι πλευρές ίσες και παράλληλες, με τις γωνίες του να μην είναι ορθές.',
    svg: (
      <svg className="w-56 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
        <polygon points="55,25 145,25 125,75 35,75" fill="#14b8a6" fillOpacity="0.25" stroke="#14b8a6" strokeWidth="3.5" strokeLinejoin="round" />
      </svg>
    )
  }
];

// Pool Κατηγορίας 2: Ομοιότητες & Διαφορές - 4 Επιλογές (ΟΜΑΔΑ Α)
const SIMILARITIES_POOL = [
  {
    q: 'Ποια κοινή ιδιότητα μοιράζονται το Τετράγωνο και ο Ρόμβος;',
    correct: 'Έχουν και τα δύο 4 ίσες πλευρές',
    wrongs: [
      'Έχουν και τα δύο 4 ορθές γωνίες',
      'Δεν έχουν καμία παράλληλη πλευρά',
      'Έχουν μόνο 3 κορυφές'
    ],
    explainText: 'Τόσο το τετράγωνο όσο και ο ρόμβος έχουν και τις 4 πλευρές τους ίσες μεταξύ τους.'
  },
  {
    q: 'Ποια κοινή ιδιότητα μοιράζονται το Ορθογώνιο και το Τετράγωνο;',
    correct: 'Έχουν και τα δύο 4 ορθές γωνίες (90°)',
    wrongs: [
      'Έχουν υποχρεωτικά και τις 4 πλευρές ίσες',
      'Δεν έχουν απέναντι παράλληλες πλευρές',
      'Έχουν πλάγιες οξείες γωνίες'
    ],
    explainText: 'Και στα δύο αυτά σχήματα όλες οι γωνίες είναι ορθές (90°).'
  },
  {
    q: 'Σε ποια βασική ιδιότητα διαφέρει ο Ρόμβος από το Τετράγωνο;',
    correct: 'Ο ρόμβος δεν έχει ορθές γωνίες (90°)',
    wrongs: [
      'Ο ρόμβος δεν έχει 4 ίσες πλευρές',
      'Ο ρόμβος έχει 5 πλευρές',
      'Ο ρόμβος δεν έχει απέναντι παράλληλες πλευρές'
    ],
    explainText: 'Ενώ και τα δύο έχουν 4 ίσες πλευρές, το τετράγωνο έχει 4 ορθές γωνίες ενώ ο ρόμβος έχει πλάγιες.'
  },
  {
    q: 'Σε ποια βασική ιδιότητα διαφέρει το Πλάγιο Παραλληλόγραμμο από το Ορθογώνιο;',
    correct: 'Το πλάγιο παραλληλόγραμμο δεν έχει ορθές γωνίες',
    wrongs: [
      'Το πλάγιο δεν έχει παράλληλες απέναντι πλευρές',
      'Το ορθογώνιο έχει μόνο 3 πλευρές',
      'Το πλάγιο έχει υποχρεωτικά όλες τις πλευρές ίσες'
    ],
    explainText: 'Και τα δύο έχουν απέναντι πλευρές ίσες και παράλληλες, αλλά μόνο το ορθογώνιο έχει ορθές γωνίες 90°.'
  }
];

// Pool Κατηγορίας 3: Αριθμητικά Χαρακτηριστικά (Input)
const NUMERIC_POOL = [
  {
    q: 'Πόσες ορθές γωνίες (90°) έχει συνολικά ένα ορθογώνιο παραλληλόγραμμο;',
    correct: 4,
    explainText: 'Το ορθογώνιο παραλληλόγραμμο έχει ακριβώς 4 ορθές γωνίες των 90°.'
  },
  {
    q: 'Πόσες ορθές γωνίες (90°) έχει ένας ρόμβος;',
    correct: 0,
    explainText: 'Ο ρόμβος έχει πλάγιες γωνίες και επομένως έχει 0 ορθές γωνίες.'
  },
  {
    q: 'Πόσες ίσες πλευρές έχει εξ ορισμού ένα τετράγωνο;',
    correct: 4,
    explainText: 'Το τετράγωνο έχει όλες τις 4 πλευρές του ίσες μεταξύ τους.'
  },
  {
    q: 'Πόσα ζεύγη απέναντι παράλληλων πλευρών έχει ένα πλάγιο παραλληλόγραμμο;',
    correct: 2,
    explainText: 'Κάθε παραλληλόγραμμο έχει ακριβώς 2 ζεύγη απέναντι παράλληλων πλευρών.'
  },
  {
    q: 'Πόσες κορυφές έχει συνολικά οποιοδήποτε τετράπλευρο γεωμετρικό σχήμα;',
    correct: 4,
    explainText: 'Κάθε τετράπλευρο έχει ακριβώς 4 πλευρές, 4 γωνίες και 4 κορυφές.'
  }
];

// Pool Κατηγορίας 4: Σωστό / Λάθος
const TRUE_FALSE_POOL = [
  {
    q: 'Το τετράγωνο μπορεί να θεωρηθεί ταυτόχρονα και ορθογώνιο (4 ορθές γωνίες) και ρόμβος (4 ίσες πλευρές).',
    correct: 'Σωστό',
    explain: 'Το τετράγωνο συγκεντρώνει όλες τις ιδιότητες του ορθογωνίου και του ρόμβου.'
  },
  {
    q: 'Όλα τα παραλληλόγραμμα έχουν τις απέναντι πλευρές τους παράλληλες και ίσες μεταξύ τους.',
    correct: 'Σωστό',
    explain: 'Αυτός είναι ο βασικός γεωμετρικός ορισμός όλων των ειδών παραλληλογράμμου.'
  },
  {
    q: 'Ο ρόμβος έχει υποχρεωτικά 4 ορθές γωνίες ακριβώς όπως το τετράγωνο.',
    correct: 'Λάθος',
    explain: 'Ο ρόμβος έχει πλάγιες γωνίες (δύο οξείες και δύο αμβλείες), όχι ορθές.'
  },
  {
    q: 'Στο ορθογώνιο παραλληλόγραμμο όλες οι 4 πλευρές είναι υποχρεωτικά ίσες μεταξύ τους.',
    correct: 'Λάθος',
    explain: 'Στο γενικό ορθογώνιο παραλληλόγραμμο ίσες είναι μόνο οι απέναντι πλευρές ανά δύο.'
  }
];

// ----------------------------------------------------
// GENERATOR 8 ΑΣΚΗΣΕΩΝ ΜΕ ΕΓΓΥΗΜΕΝΗ ΜΟΝΑΔΙΚΟΤΗΤΑ
// ----------------------------------------------------
function generateQuestions() {
  const prepareMcq = (item) => {
    const options = [
      { text: item.correct, isCorrect: true },
      ...item.wrongs.slice(0, 3).map((w) => ({ text: w, isCorrect: false }))
    ];
    return { ...item, options: options.sort(() => Math.random() - 0.5) };
  };

  // Q1 & Q2: Σχήματα (MCQ)
  const s1 = SHAPES_IDENTIFY_POOL[getRandomInt(0, SHAPES_IDENTIFY_POOL.length - 1)];
  let s2;
  while (true) {
    s2 = SHAPES_IDENTIFY_POOL[getRandomInt(0, SHAPES_IDENTIFY_POOL.length - 1)];
    if (s2.q !== s1.q) break;
  }

  // Q3 & Q4: Ομοιότητες & Διαφορές (MCQ)
  const sim1 = SIMILARITIES_POOL[getRandomInt(0, SIMILARITIES_POOL.length - 1)];
  let sim2;
  while (true) {
    sim2 = SIMILARITIES_POOL[getRandomInt(0, SIMILARITIES_POOL.length - 1)];
    if (sim2.q !== sim1.q) break;
  }

  // Q5 & Q6: Αριθμητικά (Input)
  const num1 = NUMERIC_POOL[getRandomInt(0, NUMERIC_POOL.length - 1)];
  let num2;
  while (true) {
    num2 = NUMERIC_POOL[getRandomInt(0, NUMERIC_POOL.length - 1)];
    if (num2.q !== num1.q) break;
  }

  // Q7 & Q8: Σωστό / Λάθος
  const tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
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
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (parseInt(answers.q6, 10) === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render MCQ (Q1 - Q4, 4 Επιλογές)
  const renderMcqQuestion = (qKey, qData, numLabel, colorClass) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className={`${colorClass} text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}>
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        {qData.svg && <div className="mb-4">{qData.svg}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt.text;
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
                  value={opt.text}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt.text)}
                  disabled={submitted}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0"
                />
                <span className="leading-snug">{opt.text}</span>
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

  // Render Αριθμητικό Input (Q5 & Q6)
  const renderInputNumber = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
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

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">Απάντηση:</span>
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
              className="w-28 sm:w-36 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-teal-900 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
            />
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
                Η σωστή απάντηση είναι <span className="font-mono font-bold text-rose-900">{qData.correct}</span>. {qData.explainText}
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
          <span className="bg-amber-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
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
                Η ορθή απάντηση είναι «{qData.correct}». {qData.explain}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Τα Τετράπλευρα και οι Ιδιότητές τους | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στα τετράπλευρα: αναγνώριση τετραγώνου, ορθογωνίου, ρόμβου και παραλληλογράμμου, ομοιότητες και διαφορές."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/16-tetrapleura"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
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
              📝 Ασκήσεις: Τα Τετράπλευρα και οι Ιδιότητές τους
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», τα σχήματα και οι ερωτήσεις ανανεώνονται αυτόματα από τη δεξαμενή!
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

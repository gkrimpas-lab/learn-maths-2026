import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function toRoman(num) {
  const romanMap = [
    { val: 21, str: 'XXI' },
    { val: 20, str: 'XX' },
    { val: 19, str: 'XIX' },
    { val: 18, str: 'XVIII' },
    { val: 17, str: 'XVII' },
    { val: 16, str: 'XVI' },
    { val: 15, str: 'XV' },
    { val: 14, str: 'XIV' },
    { val: 13, str: 'XIII' },
    { val: 12, str: 'XII' },
    { val: 11, str: 'XI' },
    { val: 10, str: 'X' },
    { val: 9, str: 'IX' },
    { val: 8, str: 'VIII' },
    { val: 7, str: 'VII' },
    { val: 6, str: 'VI' },
    { val: 5, str: 'V' },
    { val: 4, str: 'IV' },
    { val: 3, str: 'III' },
    { val: 2, str: 'II' },
    { val: 1, str: 'I' }
  ];
  const found = romanMap.find(item => item.val === num);
  return found ? found.str : `${num}ος`;
}

// 1. Άσκηση: Εύρεση Αιώνα από Έτος (Input)
function makeCenturyQuestion() {
  const isRound = Math.random() > 0.6;
  let year = isRound 
    ? getRandomInt(10, 20) * 100 
    : getRandomInt(1001, 2030);

  const century = Math.floor((year - 1) / 100) + 1;

  return {
    q: `Σε ποιον αιώνα ανήκει το έτος ${formatNumber(year)}; (Γράψε μόνο τον αριθμό του αιώνα):`,
    year,
    correct: century,
    explain: year % 100 === 0 
      ? `Επειδή το έτος ${formatNumber(year)} τελειώνει σε 00, ανήκει ακριβώς στον ${century}ο αιώνα (${toRoman(century)}).`
      : `Κοιτάμε τις εκατοντάδες και προσθέτουμε 1: το ${formatNumber(year)} ανήκει στον ${century}ο αιώνα (${toRoman(century)}).`
  };
}

// 2. Άσκηση: Μετατροπές Μονάδων Χρόνου (Input)
function makeUnitConversionQuestion() {
  const type = getRandomInt(1, 3);

  if (type === 1) {
    const years = getRandomInt(2, 8);
    const correct = years * 12;
    return {
      q: `Πόσους μήνες έχουν τα ${years} χρόνια (έτη);`,
      correct,
      unit: 'μήνες',
      explain: `1 χρόνος = 12 μήνες, άρα τα ${years} χρόνια έχουν ${years} × 12 = ${correct} μήνες.`
    };
  } else if (type === 2) {
    const weeks = getRandomInt(3, 9);
    const correct = weeks * 7;
    return {
      q: `Πόσες ημέρες είναι οι ${weeks} εβδομάδες;`,
      correct,
      unit: 'ημέρες',
      explain: `1 εβδομάδα = 7 ημέρες, άρα οι ${weeks} εβδομάδες είναι ${weeks} × 7 = ${correct} ημέρες.`
    };
  } else {
    const centuries = getRandomInt(2, 6);
    const correct = centuries * 100;
    return {
      q: `Πόσα χρόνια είναι οι ${centuries} αιώνες;`,
      correct,
      unit: 'χρόνια',
      explain: `1 αιώνας = 100 χρόνια, άρα οι ${centuries} αιώνες είναι ${centuries} × 100 = ${correct} χρόνια.`
    };
  }
}

// 3. Άσκηση: Πολλαπλή Επιλογή (MCQ - Διάρκεια Αιώνα / Λατινικά)
function makeCenturyRangeMCQQuestion() {
  const c = getRandomInt(14, 21);
  const startYear = (c - 1) * 100 + 1;
  const endYear = c * 100;
  const roman = toRoman(c);

  const correctText = `Από το ${formatNumber(startYear)} έως το ${formatNumber(endYear)}`;
  const wrong1 = `Από το ${formatNumber(startYear - 1)} έως το ${formatNumber(endYear - 1)}`;
  const wrong2 = `Από το ${formatNumber(startYear + 100)} έως το ${formatNumber(endYear + 100)}`;
  const wrong3 = `Από το ${formatNumber(startYear - 100)} έως το ${formatNumber(endYear - 100)}`;

  const rawOptions = [correctText, wrong1, wrong2, wrong3];
  const uniqueOptions = Array.from(new Set(rawOptions));

  const choices = uniqueOptions.map(opt => ({
    text: opt,
    isCorrect: opt === correctText
  })).sort(() => Math.random() - 0.5);

  return {
    q: `Ποια είναι η ακριβής διάρκεια του ${c}ου αιώνα (${roman});`,
    options: choices,
    correct: correctText,
    explain: `Ο ${c}ος αιώνας ξεκινάει την 1η Ιανουαρίου του ${formatNumber(startYear)} και τελειώνει την 31η Δεκεμβρίου του ${formatNumber(endYear)}.`
  };
}

// 4. Άσκηση: Σωστό / Λάθος για Δίσεκτα Έτη & Αιώνες
const TRUE_FALSE_POOL = [
  {
    q: 'Ένα δίσεκτο έτος έχει 366 ημέρες επειδή ο Φεβρουάριος έχει 29 ημέρες.',
    correct: 'Σωστό',
    explain: 'Σωστά! Στα δίσεκτα έτη προστίθεται 1 ημέρα στον Φεβρουάριο (29 ημέρες).'
  },
  {
    q: 'Το έτος 1821 ανήκει στον 18ο αιώνα.',
    correct: 'Λάθος',
    explain: 'Λάθος! Το 1821 ανήκει στον 19ο αιώνα (18 + 1 = 19).'
  },
  {
    q: 'Το έτος 2000 ήταν δίσεκτο έτος και ανήκει στον 20ό αιώνα.',
    correct: 'Σωστό',
    explain: 'Σωστά! Το 2000 ήταν το τελευταίο έτος του 20ού αιώνα και ήταν δίσεκτο.'
  },
  {
    q: 'Μία δεκαετία αποτελείται από 100 χρόνια.',
    correct: 'Λάθος',
    explain: 'Λάθος! Μία δεκαετία αποτελείται από 10 χρόνια (ο αιώνας έχει 100 χρόνια).'
  },
  {
    q: 'Μία χιλιετία αποτελείται από 10 αιώνες (δηλαδή 1.000 χρόνια).',
    correct: 'Σωστό',
    explain: 'Σωστά! 10 αιώνες × 100 χρόνια = 1.000 χρόνια = 1 χιλιετία.'
  },
  {
    q: 'Τα δίσεκτα έτη συμβαίνουν κάθε 2 χρόνια.',
    correct: 'Λάθος',
    explain: 'Λάθος! Τα δίσεκτα έτη συμβαίνουν κάθε 4 χρόνια.'
  },
  {
    q: 'Το έτος 2024 ήταν δίσεκτο έτος (αφού διαιρείται ακριβώς με το 4).',
    correct: 'Σωστό',
    explain: 'Σωστά! 2024 : 4 = 506 (τέλεια διαίρεση), άρα ήταν δίσεκτο.'
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
    q1: makeCenturyQuestion(),
    q2: makeCenturyQuestion(),
    q3: makeUnitConversionQuestion(),
    q4: makeUnitConversionQuestion(),
    q5: makeCenturyRangeMCQQuestion(),
    q6: makeCenturyRangeMCQQuestion(),
    q7: tf1,
    q8: tf2
  };
}

export default function AionasAskPage() {
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

  // Render Input Number Ασκήσεων (Q1, Q2, Q3, Q4)
  const renderInputNumber = (qKey, qData, numLabel, colorClass, placeholderText) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`${colorClass} text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center`}>{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">{qData.q}</h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2">
          <input 
            type="number"
            placeholder={placeholderText}
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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

  // Render MCQ (Q5 & Q6)
  const renderMCQQuestion = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-purple-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">{qData.q}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt.text 
                ? 'border-purple-600 bg-purple-50/80 font-bold text-purple-900' 
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
              className="w-5 h-5 text-purple-600 focus:ring-purple-500"
            />
            <span className="font-mono text-base font-bold">{opt.text}</span>
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

  // Render Σωστό / Λάθος (Q7 & Q8)
  const renderTrueFalse = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-700 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
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
        <title>📅 Ασκήσεις: Αιώνες & Δίσεκτα Έτη - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/26-aionas" className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Αιώνες & Δίσεκτα Έτη
              </h1>
              <p className="text-purple-100 text-sm md:text-base mt-1">
                8 Δυναμικές ασκήσεις! Πατώντας **«Νέες Ασκήσεις»** τα έτη και οι ερωτήσεις αλλάζουν αυτόματα.
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

            {renderInputNumber('q1', questions.q1, 1, 'bg-purple-600', 'Γράψε τον αιώνα (π.χ. 19)')}
            {renderInputNumber('q2', questions.q2, 2, 'bg-purple-600', 'Γράψε τον αιώνα (π.χ. 21)')}

            {renderInputNumber('q3', questions.q3, 3, 'bg-indigo-600', 'Γράψε τον αριθμό')}
            {renderInputNumber('q4', questions.q4, 4, 'bg-indigo-600', 'Γράψε τον αριθμό')}

            {renderMCQQuestion('q5', questions.q5, 5)}
            {renderMCQQuestion('q6', questions.q6, 6)}

            {renderTrueFalse('q7', questions.q7, 7, 7)}
            {renderTrueFalse('q8', questions.q8, 8, 8)}

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

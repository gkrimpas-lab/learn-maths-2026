import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 1. Ασκηση: Μετατροπή από Μεγάλη σε Μικρότερη Μονάδα (Input)
function makeBigToSmallQuestion(prevQuestion = null) {
  const types = [
    { from: 'm', to: 'cm', factor: 100, min: 1, max: 15 },
    { from: 'km', to: 'm', factor: 1000, min: 1, max: 10 },
    { from: 'm', to: 'mm', factor: 1000, min: 1, max: 8 },
    { from: 'dm', to: 'cm', factor: 10, min: 2, max: 30 }
  ];
  
  let chosen, val, correct;

  while (true) {
    chosen = types[getRandomInt(0, types.length - 1)];
    val = getRandomInt(chosen.min, chosen.max);
    correct = val * chosen.factor;

    if (!prevQuestion || prevQuestion.from !== chosen.from || prevQuestion.val !== val) {
      break;
    }
  }

  return { val, from: chosen.from, to: chosen.to, correct };
}

// 2. Ασκηση: Μετατροπή από Μικρή σε Μεγαλύτερη Μονάδα (Input)
function makeSmallToBigQuestion(prevQuestion = null) {
  const types = [
    { from: 'cm', to: 'm', factor: 100, min: 1, max: 12 },
    { from: 'm', to: 'km', factor: 1000, min: 1, max: 9 },
    { from: 'mm', to: 'cm', factor: 10, min: 2, max: 20 }
  ];

  let chosen, correct, val;

  while (true) {
    chosen = types[getRandomInt(0, types.length - 1)];
    correct = getRandomInt(chosen.min, chosen.max);
    val = correct * chosen.factor;

    if (!prevQuestion || prevQuestion.from !== chosen.from || prevQuestion.val !== val) {
      break;
    }
  }

  return { val, from: chosen.from, to: chosen.to, correct };
}

// 3. Ασκηση: Επιλογή Κατάλληλης Μονάδας (MCQ) - 22 ΔΙΑΦΟΡΕΤΙΚΕΣ ΕΡΩΤΗΣΕΙΣ
const SUITABLE_UNITS_POOL = [
  // ΧΙΛΙΟΜΕΤΡΑ (km)
  { q: 'Την απόσταση μεταξύ δύο πόλεων (π.χ. Αθήνα - Θεσσαλονίκη)', correct: 'Χιλιόμετρα (km)', wrongs: ['Μέτρα (m)', 'Εκατοστά (cm)', 'Χιλιοστά (mm)'] },
  { q: 'Το συνολικό μήκος ενός αυτοκινητοδρόμου', correct: 'Χιλιόμετρα (km)', wrongs: ['Μέτρα (m)', 'Δεκατόμετρα (dm)', 'Εκατοστά (cm)'] },
  { q: 'Την απόσταση που διανύει ένα αεροπλάνο σε μια πτήση', correct: 'Χιλιόμετρα (km)', wrongs: ['Μέτρα (m)', 'Εκατοστά (cm)', 'Χιλιοστά (mm)'] },
  { q: 'Το μήκος μιας διαδρομής μαραθωνίου δρόμου', correct: 'Χιλιόμετρα (km)', wrongs: ['Μέτρα (m)', 'Δεκατόμετρα (dm)', 'Εκατοστά (cm)'] },
  { q: 'Την απόσταση του σπιτιού σου από το διπλανό χωριό', correct: 'Χιλιόμετρα (km)', wrongs: ['Μέτρα (m)', 'Εκατοστά (cm)', 'Χιλιοστά (mm)'] },

  // ΜΕΤΡΑ (m)
  { q: 'Το μήκος μιας πισίνας ολυμπιακών διαστάσεων', correct: 'Μέτρα (m)', wrongs: ['Χιλιόμετρα (km)', 'Εκατοστά (cm)', 'Χιλιοστά (mm)'] },
  { q: 'Το ύψος ενός πολυώροφου κτιρίου', correct: 'Μέτρα (m)', wrongs: ['Χιλιόμετρα (km)', 'Χιλιοστά (mm)', 'Δεκατόμετρα (dm)'] },
  { q: 'Το μήκος ενός γηπέδου ποδοσφαίρου', correct: 'Μέτρα (m)', wrongs: ['Χιλιόμετρα (km)', 'Εκατοστά (cm)', 'Χιλιοστά (mm)'] },
  { q: 'Το ύψος μιας σχολικής αίθουσας', correct: 'Μέτρα (m)', wrongs: ['Χιλιόμετρα (km)', 'Χιλιοστά (mm)', 'Εκατοστά (cm)'] },
  { q: 'Το μήκος ενός λεωφορείου', correct: 'Μέτρα (m)', wrongs: ['Χιλιόμετρα (km)', 'Χιλιοστά (mm)', 'Δεκατόμετρα (dm)'] },

  // ΕΚΑΤΟΣΤΑ (cm)
  { q: 'Το μήκος ενός μολυβιού ή ενός στυλό', correct: 'Εκατοστά (cm)', wrongs: ['Χιλιόμετρα (km)', 'Μέτρα (m)', 'Χιλιοστά (mm)'] },
  { q: 'Το πλάτος ενός βιβλίου ή τετραδίου', correct: 'Εκατοστά (cm)', wrongs: ['Χιλιόμετρα (km)', 'Μέτρα (m)', 'Χιλιοστά (mm)'] },
  { q: 'Το μήκος μιας οθόνης κινητού τηλεφώνου', correct: 'Εκατοστά (cm)', wrongs: ['Χιλιόμετρα (km)', 'Μέτρα (m)', 'Χιλιοστά (mm)'] },
  { q: 'Το μήκος του πέλματος ενός παπουτσιού', correct: 'Εκατοστά (cm)', wrongs: ['Χιλιόμετρα (km)', 'Μέτρα (m)', 'Χιλιοστά (mm)'] },
  { q: 'Το μήκος ενός συνηθισμένου χάρακα', correct: 'Εκατοστά (cm)', wrongs: ['Χιλιόμετρα (km)', 'Μέτρα (m)', 'Χιλιοστά (mm)'] },
  { q: 'Το πλάτος μιας πιστωτικής κάρτας', correct: 'Εκατοστά (cm)', wrongs: ['Χιλιόμετρα (km)', 'Μέτρα (m)', 'Χιλιοστά (mm)'] },

  // ΧΙΛΙΟΣΤΑ (mm)
  { q: 'Το πάχος ενός κέρματος των 2 ευρώ', correct: 'Χιλιοστά (mm)', wrongs: ['Μέτρα (m)', 'Χιλιόμετρα (km)', 'Εκατοστά (cm)'] },
  { q: 'Το πάχος μιας γόμας ή μιας πιστωτικής κάρτας', correct: 'Χιλιοστά (mm)', wrongs: ['Μέτρα (m)', 'Χιλιόμετρα (km)', 'Δεκατόμετρα (dm)'] },
  { q: 'Το μήκος μιας μυρμηγκοφωλιάς ή ενός μυρμηγκιού', correct: 'Χιλιοστά (mm)', wrongs: ['Μέτρα (m)', 'Χιλιόμετρα (km)', 'Εκατοστά (cm)'] },
  { q: 'Το πάχος του γυαλιού ενός παραθύρου', correct: 'Χιλιοστά (mm)', wrongs: ['Μέτρα (m)', 'Χιλιόμετρα (km)', 'Δεκατόμετρα (dm)'] },
  { q: 'Τη διάμετρο της μύτης ενός μηχανικού μολυβιού (π.χ. 0,5)', correct: 'Χιλιοστά (mm)', wrongs: ['Μέτρα (m)', 'Χιλιόμετρα (km)', 'Εκατοστά (cm)'] },
  { q: 'Το πάχος ενός φύλλου χαρτιού σχεδίασης', correct: 'Χιλιοστά (mm)', wrongs: ['Μέτρα (m)', 'Χιλιόμετρα (km)', 'Εκατοστά (cm)'] }
];

function makeSuitableUnitQuestion(prevQuestion = null) {
  let selected;

  while (true) {
    selected = SUITABLE_UNITS_POOL[getRandomInt(0, SUITABLE_UNITS_POOL.length - 1)];
    if (!prevQuestion || prevQuestion.qText !== selected.q) {
      break;
    }
  }

  const options = [
    { text: selected.correct, isCorrect: true },
    { text: selected.wrongs[0], isCorrect: false },
    { text: selected.wrongs[1], isCorrect: false },
    { text: selected.wrongs[2], isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  return {
    qText: selected.q,
    options,
    correct: selected.correct
  };
}

// 4. Ασκηση: Σύγκριση Μηκών (<, =, >)
function makeComparisonQuestion(prevQuestion = null) {
  const pairs = [
    { unitA: 'm', unitB: 'cm', factorA: 100 },
    { unitA: 'km', unitB: 'm', factorA: 1000 },
    { unitA: 'dm', unitB: 'cm', factorA: 10 }
  ];

  let pair, valA, valB, correctSym;

  while (true) {
    pair = pairs[getRandomInt(0, pairs.length - 1)];
    valA = getRandomInt(2, 10);
    
    valB = valA * pair.factorA;
    if (Math.random() > 0.3) {
      valB = (valA + getRandomInt(-1, 2)) * pair.factorA;
      if (valB <= 0) valB = valA * pair.factorA + 50;
    }

    const realBInAUnit = valB / pair.factorA;
    correctSym = '=';
    if (valA > realBInAUnit) correctSym = '>';
    if (valA < realBInAUnit) correctSym = '<';

    if (!prevQuestion || prevQuestion.valA !== valA || prevQuestion.valB !== valB || prevQuestion.unitA !== pair.unitA) {
      break;
    }
  }

  return {
    valA,
    unitA: pair.unitA,
    valB,
    unitB: pair.unitB,
    correct: correctSym
  };
}

// Δημιουργία 8 Ερωτήσεων με Εγγυημένη Μοναδικότητα
function generateQuestions() {
  const q1 = makeBigToSmallQuestion();
  const q2 = makeBigToSmallQuestion(q1);

  const q3 = makeSmallToBigQuestion();
  const q4 = makeSmallToBigQuestion(q3);

  const q5 = makeSuitableUnitQuestion();
  const q6 = makeSuitableUnitQuestion(q5);

  const q7 = makeComparisonQuestion();
  const q8 = makeComparisonQuestion(q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function MikosAskPage() {
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

  // Render Q1 & Q2: Μεγάλη ➔ Μικρή (Input)
  const renderBigToSmall = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-cyan-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Μετάτρεψε τη μονάδα μέτρησης: <span className="text-cyan-600 font-mono font-black text-xl">{qData.val} {qData.from}</span> = <span className="text-cyan-600 font-mono font-black text-xl">? {qData.to}</span>
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2">
          <input 
            type="number"
            placeholder="Γράψε τον αριθμό"
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
          <span className="font-bold text-gray-600">{qData.to}</span>
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Η σωστή απάντηση είναι: <span className="font-mono font-black">{qData.correct} {qData.to}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q3 & Q4: Μικρή ➔ Μεγάλη (Input)
  const renderSmallToBig = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-teal-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Μετάτρεψε τη μονάδα μέτρησης: <span className="text-teal-600 font-mono font-black text-xl">{qData.val} {qData.from}</span> = <span className="text-teal-600 font-mono font-black text-xl">? {qData.to}</span>
        </h3>
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
          <span className="font-bold text-gray-600">{qData.to}</span>
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Η σωστή απάντηση είναι: <span className="font-mono font-black">{qData.correct} {qData.to}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q5 & Q6: Κατάλληλη Μονάδα (MCQ)
  const renderSuitableUnit = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Με ποια μονάδα είναι πιο κατάλληλο να μετρήσουμε <span className="text-indigo-600 font-bold">{qData.qText}</span>;
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt.text 
                ? 'border-indigo-600 bg-indigo-50/80 font-bold' 
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
              className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
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
            <p className="text-red-600">❌ Λάθος. Η σωστή μονάδα είναι: <span className="font-black">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q7 & Q8: Σύγκριση (Buttons)
  const renderComparison = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-amber-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Επίλεξε το σωστό σύμβολο σύγκρισης ( &lt; , &gt; , = ):
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-4">
        <div className="flex items-center gap-4 text-xl md:text-2xl font-mono font-black text-gray-800">
          <span>{qData.valA} {qData.unitA}</span>
          
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

          <span>{qData.valB} {qData.unitB}</span>
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Το σωστό σύμβολο είναι το: <span className="font-mono font-black text-lg">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>📏 Ασκήσεις: Μονάδες Μήκους - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/8-mikos" className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Μέτρηση Μήκους
              </h1>
              <p className="text-cyan-100 text-sm md:text-base mt-1">
                Πατώντας «Νέες Ασκήσεις» οι αριθμοί αλλάζουν αυτόματα.
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

            {renderBigToSmall('q1', questions.q1, 1)}
            {renderBigToSmall('q2', questions.q2, 2)}

            {renderSmallToBig('q3', questions.q3, 3)}
            {renderSmallToBig('q4', questions.q4, 4)}

            {renderSuitableUnit('q5', questions.q5, 5)}
            {renderSuitableUnit('q6', questions.q6, 6)}

            {renderComparison('q7', questions.q7, 7)}
            {renderComparison('q8', questions.q8, 8)}

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

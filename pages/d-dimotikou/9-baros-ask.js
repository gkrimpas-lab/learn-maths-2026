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
    { from: 'kg', to: 'g', factor: 1000, min: 1, max: 15 },
    { from: 't', to: 'kg', factor: 1000, min: 1, max: 10 }
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
    { from: 'g', to: 'kg', factor: 1000, min: 1, max: 12 },
    { from: 'kg', to: 't', factor: 1000, min: 1, max: 9 }
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

// 3. Ασκηση: Επιλογή Κατάλληλης Μονάδας (MCQ) - Δεξαμενή Σεναρίων
const SUITABLE_UNITS_POOL = [
  // ΤΟΝΟΙ (t)
  { q: 'Το βάρος ενός ελέφαντα', correct: 'Τόνους (t)', wrongs: ['Κιλά (kg)', 'Γραμμάρια (g)'] },
  { q: 'Το βάρος ενός φορτηγού με το φορτίο του', correct: 'Τόνους (t)', wrongs: ['Κιλά (kg)', 'Γραμμάρια (g)'] },
  { q: 'Το βάρος ενός μεγάλου πλοίου', correct: 'Τόνους (t)', wrongs: ['Κιλά (kg)', 'Γραμμάρια (g)'] },
  { q: 'Την παραγωγή σιταριού ενός μεγάλου αγρού', correct: 'Τόνους (t)', wrongs: ['Κιλά (kg)', 'Γραμμάρια (g)'] },
  { q: 'Το βάρος μιας γαλάζιας φάλαινας', correct: 'Τόνους (t)', wrongs: ['Κιλά (kg)', 'Γραμμάρια (g)'] },

  // ΚΙΛΑ (kg)
  { q: 'Το βάρος ενός μαθητή της Δ\' Δημοτικού', correct: 'Κιλά (kg)', wrongs: ['Τόνους (t)', 'Γραμμάρια (g)'] },
  { q: 'Το βάρος μιας τσάντας με καρπούζια', correct: 'Κιλά (kg)', wrongs: ['Τόνους (t)', 'Γραμμάρια (g)'] },
  { q: 'Το βάρος ενός σκύλου', correct: 'Κιλά (kg)', wrongs: ['Τόνους (t)', 'Γραμμάρια (g)'] },
  { q: 'Το βάρος ενός ποδηλάτου', correct: 'Κιλά (kg)', wrongs: ['Τόνους (t)', 'Γραμμάρια (g)'] },
  { q: 'Το βάρος ενός τσουβαλιού με πατάτες', correct: 'Κιλά (kg)', wrongs: ['Τόνους (t)', 'Γραμμάρια (g)'] },

  // ΓΡΑΜΜΑΡΙΑ (g)
  { q: 'Το βάρος μιας σοκολάτας', correct: 'Γραμμάρια (g)', wrongs: ['Τόνους (t)', 'Κιλά (kg)'] },
  { q: 'Το βάρος ενός χρυσού δαχτυλιδιού', correct: 'Γραμμάρια (g)', wrongs: ['Τόνους (t)', 'Κιλά (kg)'] },
  { q: 'Το βάρος ενός μήλου ή ενός πορτοκαλιού', correct: 'Γραμμάρια (g)', wrongs: ['Τόνους (t)', 'Κιλά (kg)'] },
  { q: 'Το βάρος ενός φακέλου με μια επιστολή', correct: 'Γραμμάρια (g)', wrongs: ['Τόνους (t)', 'Κιλά (kg)'] },
  { q: 'Το βάρος μιας κουταλιάς αλάτι', correct: 'Γραμμάρια (g)', wrongs: ['Τόνους (t)', 'Κιλά (kg)'] }
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
    { text: selected.wrongs[1], isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  return {
    qText: selected.q,
    options,
    correct: selected.correct
  };
}

// 4. Ασκηση: Σύγκριση Βαρών (<, =, >)
function makeComparisonQuestion(prevQuestion = null) {
  const pairs = [
    { unitA: 'kg', unitB: 'g', factorA: 1000 },
    { unitA: 't', unitB: 'kg', factorA: 1000 }
  ];

  let pair, valA, valB, correctSym;

  while (true) {
    pair = pairs[getRandomInt(0, pairs.length - 1)];
    valA = getRandomInt(2, 10);
    
    valB = valA * pair.factorA;
    if (Math.random() > 0.3) {
      valB = (valA + getRandomInt(-1, 2)) * pair.factorA;
      if (valB <= 0) valB = valA * pair.factorA + 500;
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

export default function BarosAskPage() {
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
        <span className="bg-emerald-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Μετάτρεψε τη μονάδα μέτρησης: <span className="text-emerald-600 font-mono font-black text-xl">{qData.val} {qData.from}</span> = <span className="text-emerald-600 font-mono font-black text-xl">? {qData.to}</span>
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
            className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <span className="font-bold text-gray-600">{qData.to}</span>
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Η σωστή απάντηση είναι: <span className="font-mono font-black">{qData.correct.toLocaleString('el-GR')} {qData.to}</span></p>
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
          Μετάτρεψε τη μονάδα μέτρησης: <span className="text-teal-600 font-mono font-black text-xl">{qData.val.toLocaleString('el-GR')} {qData.from}</span> = <span className="text-teal-600 font-mono font-black text-xl">? {qData.to}</span>
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
        <span className="bg-sky-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Με ποια μονάδα είναι πιο κατάλληλο να μετρήσουμε <span className="text-sky-600 font-bold">{qData.qText}</span>;
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt.text 
                ? 'border-sky-600 bg-sky-50/80 font-bold' 
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
              className="w-5 h-5 text-sky-600 focus:ring-sky-500"
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

          <span>{qData.valB.toLocaleString('el-GR')} {qData.unitB}</span>
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
        <title>⚖️ Ασκήσεις: Μονάδες Βάρους - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/9-baros" className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Μέτρηση Βάρους
              </h1>
              <p className="text-emerald-100 text-sm md:text-base mt-1">
                8 Δυναμικές ασκήσεις! Πατώντας **«Νέες Ασκήσεις»** οι αριθμοί αλλάζουν αυτόματα.
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

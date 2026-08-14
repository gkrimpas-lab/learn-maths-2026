import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const ITEMS_POOL = [
  { item: 'μολύβια', single: 'μολύβι', emoji: '✏️' },
  { item: 'τετράδια', single: 'τετράδιο', emoji: '📓' },
  { item: 'σοκολάτες', single: 'σοκολάτα', emoji: '🍫' },
  { item: 'μπάλες', single: 'μπάλα', emoji: '⚽' },
  { item: 'χυμοί', single: 'χυμός', emoji: '🧃' },
  { item: 'μαρκαδόροι', single: 'μαρκαδόρος', emoji: '🖍️' },
  { item: 'κρουασάν', single: 'κρουασάν', emoji: '🥐' }
];

// 1. Βήμα 1: Εύρεση Τιμής Μονάδας (Input)
function makeUnitCostQuestion() {
  const itemObj = ITEMS_POOL[getRandomInt(0, ITEMS_POOL.length - 1)];
  const unitPrice = getRandomInt(2, 8);
  const qty = getRandomInt(2, 6);
  const totalCost = unitPrice * qty;

  return {
    q: `Αν τα ${qty} ${itemObj.item} ${itemObj.emoji} κοστίζουν συνολικά ${totalCost} €, πόσο κοστίζει το 1 ${itemObj.single};`,
    correct: unitPrice,
    unit: '€',
    explain: `Διαιρούμε το συνολικό ποσό με το πλήθος: ${totalCost} : ${qty} = ${unitPrice} €.`
  };
}

// 2. Πλήρες Πρόβλημα Αναγωγής στη Μονάδα (Input)
function makeFullProblemQuestion() {
  const itemObj = ITEMS_POOL[getRandomInt(0, ITEMS_POOL.length - 1)];
  const unitPrice = getRandomInt(2, 7);
  const initialQty = getRandomInt(2, 5);
  const initialCost = unitPrice * initialQty;

  let targetQty = getRandomInt(3, 9);
  while (targetQty === initialQty) {
    targetQty = getRandomInt(3, 9);
  }

  const finalCost = unitPrice * targetQty;

  return {
    q: `Τα ${initialQty} ${itemObj.item} ${itemObj.emoji} κοστίζουν ${initialCost} €. Πόσο θα πληρώσουμε για να αγοράσουμε ${targetQty} ${itemObj.item};`,
    correct: finalCost,
    unit: '€',
    explain: `Βήμα 1: Το 1 ${itemObj.single} κοστίζει ${initialCost} : ${initialQty} = ${unitPrice} €. Βήμα 2: Τα ${targetQty} ${itemObj.item} κοστίζουν ${targetQty} × ${unitPrice} = ${finalCost} €.`
  };
}

// 3. Πολλαπλή Επιλογή (MCQ)
function makeMCQQuestion() {
  const itemObj = ITEMS_POOL[getRandomInt(0, ITEMS_POOL.length - 1)];
  const unitPrice = getRandomInt(2, 6);
  const initialQty = getRandomInt(2, 4);
  const initialCost = unitPrice * initialQty;
  const targetQty = getRandomInt(5, 8);
  const finalCost = unitPrice * targetQty;

  const correctText = `${finalCost} €`;
  const wrong1 = `${finalCost + unitPrice} €`;
  const wrong2 = `${finalCost - unitPrice} €`;
  const wrong3 = `${finalCost + 2 * unitPrice} €`;

  const rawOptions = [correctText, wrong1, wrong2, wrong3];
  const uniqueOptions = Array.from(new Set(rawOptions));

  while (uniqueOptions.length < 4) {
    const dummy = `${finalCost + getRandomInt(4, 15)} €`;
    if (!uniqueOptions.includes(dummy)) {
      uniqueOptions.push(dummy);
    }
  }

  const choices = uniqueOptions.map(opt => ({
    text: opt,
    isCorrect: opt === correctText
  })).sort(() => Math.random() - 0.5);

  return {
    q: `Ένα κατάστημα πουλάει ${initialQty} ${itemObj.item} ${itemObj.emoji} προς ${initialCost} €. Πόσο κοστίζουν τα ${targetQty} ${itemObj.item};`,
    options: choices,
    correct: correctText,
    explain: `Το 1 ${itemObj.single} κοστίζει ${initialCost} : ${initialQty} = ${unitPrice} €. Άρα τα ${targetQty} κοστίζουν ${targetQty} × ${unitPrice} = ${finalCost} €.`
  };
}

// 4. Αντίστροφο Πρόβλημα: Εύρεση Πλήθους (Input)
function makeReverseQuestion() {
  const itemObj = ITEMS_POOL[getRandomInt(0, ITEMS_POOL.length - 1)];
  const unitPrice = getRandomInt(2, 5);
  const initialQty = getRandomInt(2, 4);
  const initialCost = unitPrice * initialQty;

  const targetQty = getRandomInt(5, 10);
  const budget = unitPrice * targetQty;

  return {
    q: `Τα ${initialQty} ${itemObj.item} ${itemObj.emoji} κοστίζουν ${initialCost} €. Πόσα ${itemObj.item} μπορούμε να αγοράσουμε με ${budget} €;`,
    correct: targetQty,
    unit: itemObj.item,
    explain: `Βήμα 1: Το 1 ${itemObj.single} κοστίζει ${initialCost} : ${initialQty} = ${unitPrice} €. Βήμα 2: Με ${budget} € αγοράζουμε ${budget} : ${unitPrice} = ${targetQty} ${itemObj.item}.`
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  return {
    q1: makeUnitCostQuestion(),
    q2: makeUnitCostQuestion(),
    q3: makeFullProblemQuestion(),
    q4: makeFullProblemQuestion(),
    q5: makeMCQQuestion(),
    q6: makeMCQQuestion(),
    q7: makeReverseQuestion(),
    q8: makeReverseQuestion()
  };
}

export default function AnagogiMonadaAskPage() {
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
    if (parseInt(answers.q7, 10) === questions.q7.correct) currentScore += 1;
    if (parseInt(answers.q8, 10) === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Input Ασκήσεων
  const renderInputQuestion = (qKey, qData, numLabel, colorClass) => (
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
            placeholder="Γράψε την απάντηση"
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          {qData.unit && <span className="font-bold text-gray-600 text-lg">{qData.unit}</span>}
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>🎯 Ασκήσεις: Αναγωγή στη Μονάδα - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/23-anagogi-monada" className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
                📝 Ασκήσεις: Αναγωγή στη Μονάδα
              </h1>
              <p className="text-amber-100 text-sm md:text-base mt-1">
                8 Δυναμικά προβλήματα! Πατώντας **«Νέες Ασκήσεις»** οι αριθμοί και τα σενάρια αλλάζουν αυτόματα.
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

            {renderInputQuestion('q1', questions.q1, 1, 'bg-blue-600')}
            {renderInputQuestion('q2', questions.q2, 2, 'bg-blue-600')}

            {renderInputQuestion('q3', questions.q3, 3, 'bg-emerald-600')}
            {renderInputQuestion('q4', questions.q4, 4, 'bg-emerald-600')}

            {renderMCQQuestion('q5', questions.q5, 5)}
            {renderMCQQuestion('q6', questions.q6, 6)}

            {renderInputQuestion('q7', questions.q7, 7, 'bg-amber-600')}
            {renderInputQuestion('q8', questions.q8, 8, 'bg-amber-600')}

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

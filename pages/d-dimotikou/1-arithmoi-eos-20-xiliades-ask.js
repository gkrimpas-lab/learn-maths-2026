import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// --- BOHΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function numberToGreekWords(num) {
  if (num === 0) return 'μηδέν';
  if (num === 20000) return 'είκοσι χιλιάδες';

  const units = ['', 'ένα', 'δύο', 'τρία', 'τέσσερα', 'πέντε', 'έξι', 'επτά', 'οκτώ', 'εννέα'];
  const tens = ['', 'δέκα', 'είκοσι', 'τριάντα', 'σαράντα', 'πενήντα', 'εξήντα', 'εβδομήντα', 'ογδόντα', 'εννενήντα'];
  const hundreds = ['', 'εκατό', 'διακόσια', 'τρακόσια', 'τετρακόσια', 'πεντακόσια', 'εξακόσια', 'επτακόσια', 'οκτακόσια', 'εννιακόσια'];

  const thousandWords = [
    '', 'χίλια', 'δύο χιλιάδες', 'τρεις χιλιάδες', 'τέσσερις χιλιάδες',
    'πέντε χιλιάδες', 'έξι χιλιάδες', 'επτά χιλιάδες', 'οκτώ χιλιάδες', 'εννέα χιλιάδες',
    'δέκα χιλιάδες', 'έντεκα χιλιάδες', 'δώδεκα χιλιάδες', 'δεκατρείς χιλιάδες',
    'δεκατέσσερις χιλιάδες', 'δεκαπέντε χιλιάδες', 'δεκαέξι χιλιάδες', 'δεκαεπτά χιλιάδες',
    'δεκαοκτώ χιλιάδες', 'δεκαεννέα χιλιάδες', 'είκοσι χιλιάδες'
  ];

  const th = Math.floor(num / 1000);
  const rem = num % 1000;

  let res = '';
  if (th > 0) res += thousandWords[th] + ' ';

  if (rem > 0) {
    const e = Math.floor(rem / 100);
    const d = Math.floor((rem % 100) / 10);
    const m = rem % 10;

    if (e > 0) {
      if (e === 1 && (d > 0 || m > 0)) res += 'εκατόν ';
      else res += hundreds[e] + ' ';
    }

    if (d === 1) {
      if (m === 0) res += 'δέκα';
      else if (m === 1) res += 'έντεκα';
      else if (m === 2) res += 'δώδεκα';
      else if (m === 3) res += 'δεκατρία';
      else if (m === 4) res += 'δεκατέσσερα';
      else res += 'δέκα ' + units[m];
    } else {
      if (d > 1) res += tens[d] + ' ';
      if (m > 0) res += units[m];
    }
  }

  return res.trim().replace(/\s+/g, ' ');
}

// Παραγωγή Τυχαίων Ασκήσεων
function generateQuestions() {
  // 1. Πώς διαβάζεται ο αριθμός (Πολλαπλής Επιλογής)
  const num1 = getRandomInt(1000, 20000);
  const correctText1 = numberToGreekWords(num1);
  let wrongTextA = numberToGreekWords(num1 + (getRandomInt(1, 3) * 1000));
  let wrongTextB = numberToGreekWords(num1 + getRandomInt(1, 9) * 10);
  
  const options1 = [
    { text: correctText1, isCorrect: true },
    { text: wrongTextA, isCorrect: false },
    { text: wrongTextB, isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  // 2. Αξία θέσης ψηφίου
  const num2 = getRandomInt(1000, 19999);
  const places = [
    { name: 'Δεκάδων Χιλιάδων', multiplier: 10000 },
    { name: 'Μονάδων Χιλιάδων', multiplier: 1000 },
    { name: 'Εκατοντάδων', multiplier: 100 },
    { name: 'Δεκάδων', multiplier: 10 },
    { name: 'Μονάδων', multiplier: 1 }
  ];
  
  // Επιλέγουμε μια θέση που να μην έχει μηδέν αν είναι δυνατόν
  const validPlaces = places.filter(p => Math.floor(num2 / p.multiplier) % 10 > 0);
  const chosenPlace = validPlaces.length > 0 ? validPlaces[getRandomInt(0, validPlaces.length - 1)] : places[1];
  const digit2 = Math.floor(num2 / chosenPlace.multiplier) % 10;
  const correctVal2 = digit2 * chosenPlace.multiplier;

  // 3. Συμπλήρωση Κενού στην Ανάλυση
  const num3 = getRandomInt(5000, 19999);
  const dx3 = Math.floor(num3 / 10000) * 10000;
  const x3 = Math.floor((num3 % 10000) / 1000) * 1000;
  const e3 = Math.floor((num3 % 1000) / 100) * 100;
  const d3 = Math.floor((num3 % 100) / 10) * 10;
  const m3 = num3 % 10;

  // Επιλέγουμε τυχαία ποιο τμήμα θα λείπει
  const components3 = [
    { name: 'dx', val: dx3 },
    { name: 'x', val: x3 },
    { name: 'e', val: e3 },
    { name: 'd', val: d3 },
    { name: 'm', val: m3 }
  ].filter(c => c.val > 0);

  const missingComp = components3[getRandomInt(0, components3.length - 1)];

  // 4. Σύγκριση Αριθμών
  const num4A = getRandomInt(1000, 20000);
  let num4B = getRandomInt(1000, 20000);
  if (Math.random() > 0.7) num4B = num4A; // 30% πιθανότητα να είναι ίσα

  let correctSym4 = '=';
  if (num4A > num4B) correctSym4 = '>';
  if (num4A < num4B) correctSym4 = '<';

  return {
    q1: { number: num1, options: options1, correct: correctText1 },
    q2: { number: num2, digit: digit2, placeName: chosenPlace.name, correct: correctVal2 },
    q3: { number: num3, parts: { dx: dx3, x: x3, e: e3, d: d3, m: m3 }, missingKey: missingComp.name, correct: missingComp.val },
    q4: { numA: num4A, numB: num4B, correct: correctSym4 }
  };
}

export default function ArithmoiEos20XiliadesAskPage() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Αρχικοποίηση ερωτήσεων
  const loadNewQuestions = () => {
    setQuestions(generateQuestions());
    setAnswers({ q1: '', q2: '', q3: '', q4: '' });
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

    // Έλεγχος Q1
    if (answers.q1 === questions.q1.correct) currentScore += 1;

    // Έλεγχος Q2
    if (parseInt(answers.q2, 10) === questions.q2.correct) currentScore += 1;

    // Έλεγχος Q3
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;

    // Έλεγχος Q4
    if (answers.q4 === questions.q4.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>📝 Ασκήσεις: Αριθμοί έως το 20.000 - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/1-arithmoi-eos-20-xiliades" className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Αριθμοί έως το 20.000
              </h1>
              <p className="text-amber-100 text-sm md:text-base mt-1">
                Λύσε τις παρακάτω ασκήσεις! Πατώντας **«Νέες Ασκήσεις»** οι αριθμοί αλλάζουν αυτόματα.
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

            {/* ΑΣΚΗΣΗ 1: Πολλαπλής Επιλογής - Ονομασία */}
            <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
              submitted 
                ? (answers.q1 === questions.q1.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
                : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">1</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Πώς διαβάζεται ο αριθμός <span className="text-blue-600 font-mono font-black text-xl">{formatNumber(questions.q1.number)}</span>;
                </h3>
              </div>

              <div className="space-y-3 pl-0 md:pl-11">
                {questions.q1.options.map((opt, idx) => (
                  <label 
                    key={idx} 
                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                      answers.q1 === opt.text 
                        ? 'border-blue-600 bg-blue-50/80 font-bold' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="q1" 
                      value={opt.text}
                      checked={answers.q1 === opt.text}
                      onChange={() => handleInputChange('q1', opt.text)}
                      disabled={submitted}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-800 capitalize text-sm md:text-base">{opt.text}</span>
                  </label>
                ))}
              </div>

              {submitted && (
                <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                  {answers.q1 === questions.q1.correct ? (
                    <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                  ) : (
                    <p className="text-red-600">❌ Λάθος. Η σωστή απάντηση είναι: <span className="capitalize font-black">{questions.q1.correct}</span></p>
                  )}
                </div>
              )}
            </div>

            {/* ΑΣΚΗΣΗ 2: Αξία Θέσης Ψηφίου */}
            <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
              submitted 
                ? (parseInt(answers.q2, 10) === questions.q2.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
                : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">2</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Ποια είναι η πραγματική αξία του ψηφίου <span className="text-indigo-600 font-mono font-black text-xl">{questions.q2.digit}</span> στον αριθμό <span className="text-indigo-600 font-mono font-black text-xl">{formatNumber(questions.q2.number)}</span>;
                </h3>
              </div>

              <div className="pl-0 md:pl-11 space-y-3">
                <p className="text-xs text-gray-500">(Βρίσκεται στη θέση των {questions.q2.placeName})</p>
                <input 
                  type="number"
                  placeholder="Γράψε την αξία (π.χ. 4000)"
                  value={answers.q2}
                  onChange={(e) => handleInputChange('q2', e.target.value)}
                  disabled={submitted}
                  className="w-full md:w-72 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {submitted && (
                <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                  {parseInt(answers.q2, 10) === questions.q2.correct ? (
                    <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                  ) : (
                    <p className="text-red-600">❌ Λάθος. Η σωστή απάντηση είναι: <span className="font-mono font-black">{formatNumber(questions.q2.correct)}</span></p>
                  )}
                </div>
              )}
            </div>

            {/* ΑΣΚΗΣΗ 3: Συμπλήρωση Κενού στην Ανάλυση */}
            <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
              submitted 
                ? (parseInt(answers.q3, 10) === questions.q3.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
                : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-teal-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">3</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Συμπλήρωσε τον αριθμό που λείπει στην ανάλυση:
                </h3>
              </div>

              <div className="pl-0 md:pl-11 space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-sm md:text-lg font-bold flex flex-wrap items-center gap-2 text-gray-800">
                  <span className="text-teal-700 font-black">{formatNumber(questions.q3.number)}</span>
                  <span>=</span>

                  {questions.q3.parts.dx > 0 && (
                    <>
                      {questions.q3.missingKey === 'dx' ? (
                        <input 
                          type="number" 
                          value={answers.q3}
                          onChange={(e) => handleInputChange('q3', e.target.value)}
                          disabled={submitted}
                          className="w-28 p-1.5 bg-amber-100 border-2 border-amber-400 rounded-lg text-center text-amber-900 focus:outline-none"
                          placeholder="?"
                        />
                      ) : (
                        <span>{formatNumber(questions.q3.parts.dx)}</span>
                      )}
                      <span>+</span>
                    </>
                  )}

                  {questions.q3.parts.x > 0 && (
                    <>
                      {questions.q3.missingKey === 'x' ? (
                        <input 
                          type="number" 
                          value={answers.q3}
                          onChange={(e) => handleInputChange('q3', e.target.value)}
                          disabled={submitted}
                          className="w-28 p-1.5 bg-amber-100 border-2 border-amber-400 rounded-lg text-center text-amber-900 focus:outline-none"
                          placeholder="?"
                        />
                      ) : (
                        <span>{formatNumber(questions.q3.parts.x)}</span>
                      )}
                      <span>+</span>
                    </>
                  )}

                  {questions.q3.parts.e > 0 && (
                    <>
                      {questions.q3.missingKey === 'e' ? (
                        <input 
                          type="number" 
                          value={answers.q3}
                          onChange={(e) => handleInputChange('q3', e.target.value)}
                          disabled={submitted}
                          className="w-28 p-1.5 bg-amber-100 border-2 border-amber-400 rounded-lg text-center text-amber-900 focus:outline-none"
                          placeholder="?"
                        />
                      ) : (
                        <span>{questions.q3.parts.e}</span>
                      )}
                      <span>+</span>
                    </>
                  )}

                  {questions.q3.parts.d > 0 && (
                    <>
                      {questions.q3.missingKey === 'd' ? (
                        <input 
                          type="number" 
                          value={answers.q3}
                          onChange={(e) => handleInputChange('q3', e.target.value)}
                          disabled={submitted}
                          className="w-28 p-1.5 bg-amber-100 border-2 border-amber-400 rounded-lg text-center text-amber-900 focus:outline-none"
                          placeholder="?"
                        />
                      ) : (
                        <span>{questions.q3.parts.d}</span>
                      )}
                      <span>+</span>
                    </>
                  )}

                  {questions.q3.parts.m > 0 && (
                    <>
                      {questions.q3.missingKey === 'm' ? (
                        <input 
                          type="number" 
                          value={answers.q3}
                          onChange={(e) => handleInputChange('q3', e.target.value)}
                          disabled={submitted}
                          className="w-28 p-1.5 bg-amber-100 border-2 border-amber-400 rounded-lg text-center text-amber-900 focus:outline-none"
                          placeholder="?"
                        />
                      ) : (
                        <span>{questions.q3.parts.m}</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {submitted && (
                <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                  {parseInt(answers.q3, 10) === questions.q3.correct ? (
                    <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                  ) : (
                    <p className="text-red-600">❌ Λάθος. Ο αριθμός που έλειπε είναι ο: <span className="font-mono font-black">{formatNumber(questions.q3.correct)}</span></p>
                  )}
                </div>
              )}
            </div>

            {/* ΑΣΚΗΣΗ 4: Σύγκριση Αριθμών */}
            <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
              submitted 
                ? (answers.q4 === questions.q4.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
                : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-purple-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">4</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Επίλεξε το σωστό σύμβολο σύγκρισης ( &lt; , &gt; , = ):
                </h3>
              </div>

              <div className="pl-0 md:pl-11 space-y-4">
                <div className="flex items-center gap-4 text-xl md:text-2xl font-mono font-black text-gray-800">
                  <span>{formatNumber(questions.q4.numA)}</span>
                  
                  <div className="flex gap-2">
                    {['<', '=', '>'].map((sym) => (
                      <button
                        type="button"
                        key={sym}
                        onClick={() => handleInputChange('q4', sym)}
                        disabled={submitted}
                        className={`w-12 h-12 rounded-xl text-xl font-black border transition ${
                          answers.q4 === sym 
                            ? 'bg-purple-600 text-white border-purple-700 shadow-md' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>

                  <span>{formatNumber(questions.q4.numB)}</span>
                </div>
              </div>

              {submitted && (
                <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                  {answers.q4 === questions.q4.correct ? (
                    <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                  ) : (
                    <p className="text-red-600">❌ Λάθος. Το σωστό σύμβολο είναι το: <span className="font-mono font-black text-lg">{questions.q4.correct}</span></p>
                  )}
                </div>
              )}
            </div>

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
              <span className="text-2xl font-mono">{score} / 4</span>
            </div>
            {submitted && (
              <span className="text-sm font-bold text-slate-300">
                Ποσοστό Επιτυχίας: <span className="text-emerald-400 font-black">{Math.round((score / 4) * 100)}%</span>
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

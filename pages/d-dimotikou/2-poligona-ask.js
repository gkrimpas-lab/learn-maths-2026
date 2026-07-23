import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ & ΔΕΔΟΜΕΝΑ --- //

const POLYGON_DATA = {
  3: { name: 'Τρίγωνο', plural: 'τρίγωνο' },
  4: { name: 'Τετράπλευρο', plural: 'τετράπλευρο' },
  5: { name: 'Πεντάγωνο', plural: 'πεντάγωνο' },
  6: { name: 'Εξάγωνο', plural: 'εξάγωνο' },
  7: { name: 'Επτάγωνο', plural: 'επτάγωνο' },
  8: { name: 'Οκτάγωνο', plural: 'οκτάγωνο' }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Παραγωγή σημείων SVG για πολύγωνο
function generateSvgPoints(sides, radius = 55, centerX = 75, centerY = 75) {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI / sides) - (Math.PI / 2);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

// 1. Ασκηση MCQ: Αναγνώριση Πολυγώνου από SVG
function makeIdentifyQuestion() {
  const sides = getRandomInt(3, 8);
  const correctName = POLYGON_DATA[sides].name;

  const allNames = Object.values(POLYGON_DATA).map(p => p.name);
  const wrongNames = allNames.filter(n => n !== correctName).sort(() => Math.random() - 0.5).slice(0, 2);

  const options = [
    { text: correctName, isCorrect: true },
    { text: wrongNames[0], isCorrect: false },
    { text: wrongNames[1], isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  return { sides, options, correct: correctName };
}

// 2. Ασκηση: Πλήθος Πλευρών/Κορυφών
function makeCountQuestion() {
  const sides = getRandomInt(3, 8);
  const polyObj = POLYGON_DATA[sides];
  const features = ['πλευρές', 'κορυφές', 'γωνίες'];
  const chosenFeature = features[getRandomInt(0, 2)];

  return {
    sides,
    polyName: polyObj.name,
    feature: chosenFeature,
    correct: sides
  };
}

// 3. Ασκηση: Υπολογισμός Περιμέτρου
function makePerimeterQuestion() {
  const sides = getRandomInt(3, 8);
  const sideLength = getRandomInt(3, 12);
  const polyName = POLYGON_DATA[sides].name;

  return {
    sides,
    sideLength,
    polyName,
    correct: sides * sideLength
  };
}

// 4. Ασκηση: Εύρεση Πλευράς από Περίμετρο
function makeSideFromPerimeterQuestion() {
  const sides = getRandomInt(3, 8);
  const sideLength = getRandomInt(4, 15);
  const perimeter = sides * sideLength;
  const polyName = POLYGON_DATA[sides].name;

  return {
    sides,
    perimeter,
    polyName,
    correct: sideLength
  };
}

// Δημιουργία 8 Ερωτήσεων (2 από κάθε κατηγορία)
function generateQuestions() {
  return {
    q1: makeIdentifyQuestion(),
    q2: makeIdentifyQuestion(),
    q3: makeCountQuestion(),
    q4: makeCountQuestion(),
    q5: makePerimeterQuestion(),
    q6: makePerimeterQuestion(),
    q7: makeSideFromPerimeterQuestion(),
    q8: makeSideFromPerimeterQuestion()
  };
}

export default function PoligonaAskPage() {
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
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (parseInt(answers.q6, 10) === questions.q6.correct) currentScore += 1;
    if (parseInt(answers.q7, 10) === questions.q7.correct) currentScore += 1;
    if (parseInt(answers.q8, 10) === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Q1 & Q2: Αναγνώριση
  const renderIdentify = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-teal-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Πώς ονομάζεται το παρακάτω πολύγωνο;
        </h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 pl-0 md:pl-11">
        {/* SVG Σχήμα */}
        <div className="bg-slate-900 p-4 rounded-2xl shadow-inner flex items-center justify-center w-36 h-36 shrink-0">
          <svg className="w-full h-full" viewBox="0 0 150 150">
            <polygon
              points={generateSvgPoints(qData.sides)}
              className="fill-teal-500/30 stroke-teal-400 stroke-[4]"
            />
          </svg>
        </div>

        {/* Επιλογές */}
        <div className="space-y-3 w-full">
          {qData.options.map((opt, idx) => (
            <label 
              key={idx} 
              className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                answers[qKey] === opt.text 
                  ? 'border-teal-600 bg-teal-50/80 font-bold' 
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
                className="w-5 h-5 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-gray-800 text-sm md:text-base">{opt.text}</span>
            </label>
          ))}
        </div>
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

  // Render Q3 & Q4: Πλήθος Στοιχείων
  const renderCount = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Πόσες <span className="text-indigo-600 font-extrabold">{qData.feature}</span> έχει ένα κανονικό <span className="text-indigo-600 font-extrabold">{qData.polyName}</span>;
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="number"
          placeholder="Γράψε τον αριθμό (π.χ. 5)"
          value={answers[qKey]}
          onChange={(e) => handleInputChange(qKey, e.target.value)}
          disabled={submitted}
          className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-sm placeholder:font-normal placeholder:text-gray-400"
        />
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Έχει <span className="font-mono font-black">{qData.correct}</span> {qData.feature}.</p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q5 & Q6: Περίμετρος
  const renderPerimeter = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-amber-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Ένα κανονικό <span className="text-amber-600 font-extrabold">{qData.polyName}</span> έχει κάθε πλευρά του ίση με <span className="text-amber-600 font-mono font-black">{qData.sideLength} εκ.</span> Πόση είναι η περίμετρός του;
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2">
          <input 
            type="number"
            placeholder="Γράψε την περίμετρο"
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-sm placeholder:font-normal placeholder:text-gray-400"
          />
          <span className="font-bold text-gray-600">εκ.</span>
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Η περίμετρος είναι: <span className="font-mono font-black">{qData.correct} εκ.</span> ({qData.sides} × {qData.sideLength})</p>
          )}
        </div>
      )}
    </div>
  );

  // Render Q7 & Q8: Εύρεση Πλευράς
  const renderSideFromPerimeter = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-purple-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Η περίμετρος ενός κανονικού <span className="text-purple-600 font-extrabold">{qData.polyName}</span> είναι <span className="text-purple-600 font-mono font-black">{qData.perimeter} εκ.</span> Πόσο μήκος έχει η κάθε πλευρά του;
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2">
          <input 
            type="number"
            placeholder="Γράψε το μήκος της πλευράς"
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-sm placeholder:font-normal placeholder:text-gray-400"
          />
          <span className="font-bold text-gray-600">εκ.</span>
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Κάθε πλευρά έχει μήκος: <span className="font-mono font-black">{qData.correct} εκ.</span> ({qData.perimeter} ÷ {qData.sides})</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>📐 Ασκήσεις: Πολύγωνα - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/2-poligona" className="bg-teal-100 hover:bg-teal-200 text-teal-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-teal-500 via-emerald-600 to-indigo-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📐 Ασκήσεις: Τα Πολύγωνα
              </h1>
              <p className="text-teal-100 text-sm md:text-base mt-1">
                8 Δυναμικές ασκήσεις! Πατώντας **«Νέες Ασκήσεις»** τα σχήματα και οι αριθμοί αλλάζουν αυτόματα.
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

            {renderIdentify('q1', questions.q1, 1)}
            {renderIdentify('q2', questions.q2, 2)}

            {renderCount('q3', questions.q3, 3)}
            {renderCount('q4', questions.q4, 4)}

            {renderPerimeter('q5', questions.q5, 5)}
            {renderPerimeter('q6', questions.q6, 6)}

            {renderSideFromPerimeter('q7', questions.q7, 7)}
            {renderSideFromPerimeter('q8', questions.q8, 8)}

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

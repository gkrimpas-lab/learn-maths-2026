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

// 1. Άσκηση: Ανάγνωση Αναλογικού Ρολογιού (SVG)
function makeClockReadingQuestion() {
  const h = getRandomInt(1, 12);
  const minutesOptions = [0, 15, 30, 45, 10, 20, 40, 50];
  const m = minutesOptions[getRandomInt(0, minutesOptions.length - 1)];

  const hourAngle = (h * 30) + (m * 0.5);
  const minuteAngle = m * 6;

  const clockSvg = (
    <div className="w-44 h-44 mx-auto my-2">
      <svg className="w-full h-full" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="#0f172a" stroke="#38bdf8" strokeWidth="5" />
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
          const angle = (num * 30) * (Math.PI / 180);
          const x = 100 + 70 * Math.sin(angle);
          const y = 100 - 70 * Math.cos(angle);
          return (
            <text key={num} x={x} y={y + 5} textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="900" fontFamily="monospace">
              {num}
            </text>
          );
        })}
        {/* Δείκτης Ώρας */}
        <line x1="100" y1="100" x2="100" y2="55" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" transform={`rotate(${hourAngle}, 100, 100)`} />
        {/* Δείκτης Λεπτών */}
        <line x1="100" y1="100" x2="100" y2="32" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" transform={`rotate(${minuteAngle}, 100, 100)`} />
        <circle cx="100" cy="100" r="5" fill="#fbbf24" />
      </svg>
    </div>
  );

  return {
    q: 'Κοίταξε το αναλογικό ρολόι και γράψε πόσα λεπτά (min) δείχνει ο μεγάλος δείκτης:',
    h,
    m,
    svg: clockSvg,
    correct: m,
    explain: `Ο μεγάλος (κόκκινος) δείκτης δείχνει ${m} λεπτά (και ο μικρός δείχνει την ώρα ${h}).`
  };
}

// 2. Άσκηση: Μετατροπή Μονάδων Χρόνου (Input)
function makeTimeConversionQuestion() {
  const isHoursToMinutes = Math.random() > 0.5;

  if (isHoursToMinutes) {
    const h = getRandomInt(2, 6);
    const correct = h * 60;
    return {
      q: `Πόσα λεπτά (min) είναι οι ${h} ώρες;`,
      correct,
      explain: `1 ώρα = 60 λεπτά, άρα οι ${h} ώρες είναι ${h} × 60 = ${correct} λεπτά.`
    };
  } else {
    const m = getRandomInt(2, 6);
    const correct = m * 60;
    return {
      q: `Πόσα δευτερόλεπτα (s) είναι τα ${m} λεπτά;`,
      correct,
      explain: `1 λεπτό = 60 δευτερόλεπτα, άρα τα ${m} λεπτά είναι ${m} × 60 = ${correct} δευτερόλεπτα.`
    };
  }
}

// 3. Άσκηση: Μετατροπή 24ωρου σε Λεκτικό 12ωρο (MCQ)
function makeDigitalToSpokenMCQQuestion() {
  const pmHours = [13, 14, 15, 16, 17, 18, 19, 20, 21];
  const h = pmHours[getRandomInt(0, pmHours.length - 1)];
  const m = [0, 15, 30, 45][getRandomInt(0, 3)];

  const h12 = h - 12;
  const nextH12 = h12 + 1;

  let correctText = '';
  if (m === 0) correctText = `${h12} ακριβώς το απόγευμα/βράδυ`;
  else if (m === 15) correctText = `${h12} και τέταρτο μ.μ.`;
  else if (m === 30) correctText = `${h12} και μισή μ.μ.`;
  else if (m === 45) correctText = `${nextH12} παρά τέταρτο μ.μ.`;

  const formattedDigital = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

  const wrongs = [
    `${h12 + 1} και μισή μ.μ.`,
    `${h12} και τέταρτο π.μ.`,
    `${h} ακριβώς το πρωί`,
    `${h12} παρά τέταρτο μ.μ.`
  ].filter(w => w !== correctText);

  const options = [correctText, ...wrongs.slice(0, 3)].sort(() => Math.random() - 0.5);

  return {
    q: `Το ψηφιακό ρολόι δείχνει ${formattedDigital}. Πώς λέμε αυτή την ώρα με απλά λόγια;`,
    options,
    correct: correctText,
    explain: `Η ώρα ${formattedDigital} είναι ${correctText}.`
  };
}

// 4. Άσκηση: Υπολογισμός Χρονικής Διάρκειας (Input)
function makeDurationProblemQuestion() {
  const startH = getRandomInt(14, 19);
  const startM = [0, 10, 15, 20, 30][getRandomInt(0, 4)];
  const duration = [15, 20, 30, 40, 45][getRandomInt(0, 4)];

  const totalStartMin = startH * 60 + startM;
  const totalEndMin = totalStartMin + duration;

  const endH = Math.floor(totalEndMin / 60);
  const endM = totalEndMin % 60;

  const startFormatted = `${startH}:${startM.toString().padStart(2, '0')}`;
  const endFormatted = `${endH}:${endM.toString().padStart(2, '0')}`;

  return {
    q: `Ένα μάθημα μουσικής ξεκίνησε στις ${startFormatted} και διήρκεσε ${duration} λεπτά. Πόσα λεπτά (min) πέρασαν από την αρχή της ώρας (${endH}:00) μέχρι να τελειώσει; (Δηλαδή ποια είναι τα λεπτά της ώρας ${endFormatted});`,
    correct: endM,
    endFormatted,
    explain: `Αν προσθέσουμε ${duration} λεπτά στην ώρα ${startFormatted}, το μάθημα τελείωσε στις ${endFormatted} (άρα τα λεπτά είναι ${endM}).`
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  return {
    q1: makeClockReadingQuestion(),
    q2: makeClockReadingQuestion(),
    q3: makeTimeConversionQuestion(),
    q4: makeTimeConversionQuestion(),
    q5: makeDigitalToSpokenMCQQuestion(),
    q6: makeDigitalToSpokenMCQQuestion(),
    q7: makeDurationProblemQuestion(),
    q8: makeDurationProblemQuestion()
  };
}

export default function OraAskPage() {
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

  // Render Input Number Ασκήσεων (Q1, Q2, Q3, Q4, Q7, Q8)
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

      {qData.svg && <div className="mb-4">{qData.svg}</div>}

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2">
          <input 
            type="number"
            placeholder={placeholderText}
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              answers[qKey] === opt 
                ? 'border-purple-600 bg-purple-50/80 font-bold text-purple-900' 
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
              className="w-5 h-5 text-purple-600 focus:ring-purple-500"
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>⏰ Ασκήσεις: Μέτρηση του Χρόνου - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/25-ora" className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Η Μέτρηση του Χρόνου & το Ρολόι
              </h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">
                8 Δυναμικές ασκήσεις με ρολόγια και μετατροπές! Πατώντας **«Νέες Ασκήσεις»** τα δεδομένα αλλάζουν αυτόματα.
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

            {renderInputNumber('q1', questions.q1, 1, 'bg-blue-600', 'Γράψε τα λεπτά')}
            {renderInputNumber('q2', questions.q2, 2, 'bg-blue-600', 'Γράψε τα λεπτά')}

            {renderInputNumber('q3', questions.q3, 3, 'bg-cyan-600', 'Γράψε τον αριθμό')}
            {renderInputNumber('q4', questions.q4, 4, 'bg-cyan-600', 'Γράψε τον αριθμό')}

            {renderMCQQuestion('q5', questions.q5, 5)}
            {renderMCQQuestion('q6', questions.q6, 6)}

            {renderInputNumber('q7', questions.q7, 7, 'bg-indigo-600', 'Γράψε τα λεπτά')}
            {renderInputNumber('q8', questions.q8, 8, 'bg-indigo-600', 'Γράψε τα λεπτά')}

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

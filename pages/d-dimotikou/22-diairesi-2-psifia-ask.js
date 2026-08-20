import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// 1. Άσκηση: Τέλεια Διαίρεση με 2ψήφιο διαιρέτη (Input - Εύρεση Πηλίκου)
function makeExactDivisionQuestion() {
  const d = getRandomInt(11, 45);       // Διαιρέτης (δ)
  const q = getRandomInt(12, 65);       // Πηλίκο (π)
  const D = d * q;                      // Διαιρετέος (Δ)

  return {
    D,
    d,
    correct: q,
    explain: `Η διαίρεση είναι τέλεια: ${formatNumber(D)} : ${d} = ${q} (αφού ${d} × ${q} = ${formatNumber(D)}).`
  };
}

// 2. Άσκηση: Ατελής Διαίρεση - Εύρεση Υπολοίπου (Input)
function makeRemainderQuestion() {
  const d = getRandomInt(12, 50);       // Διαιρέτης (δ)
  const q = getRandomInt(10, 45);       // Πηλίκο (π)
  const r = getRandomInt(1, d - 1);     // Υπόλοιπο (υ < δ)
  const D = d * q + r;                  // Διαιρετέος (Δ)

  return {
    D,
    d,
    correct: r,
    explain: `Στη διαίρεση ${formatNumber(D)} : ${d}, το πηλίκο είναι ${q} και το υπόλοιπο είναι ${r} (αφού ${d} × ${q} = ${formatNumber(d * q)} και ${formatNumber(D)} - ${formatNumber(d * q)} = ${r}).`
  };
}

// 3. Άσκηση: Πολλαπλή Επιλογή (MCQ) με 4 Μοναδικές Επιλογές (Πηλίκο & Υπόλοιπο)
function makeMCQDivisionQuestion() {
  const d = getRandomInt(12, 35);
  const q = getRandomInt(12, 45);
  const r = getRandomInt(0, d - 1);
  const D = d * q + r;

  const correctText = r === 0 ? `π = ${q}` : `π = ${q}, υ = ${r}`;
  const wrong1 = r === 0 ? `π = ${q + 2}` : `π = ${q + 1}, υ = ${r}`;
  const wrong2 = r === 0 ? `π = ${q - 2}` : `π = ${q}, υ = ${r > 1 ? r - 1 : r + 2}`;
  const wrong3 = `π = ${q + 3}, υ = ${r + 1}`;

  const rawOptions = [correctText, wrong1, wrong2, wrong3];
  const uniqueOptions = Array.from(new Set(rawOptions));

  while (uniqueOptions.length < 4) {
    const dummy = `π = ${q + getRandomInt(4, 10)}, υ = ${getRandomInt(0, d - 1)}`;
    if (!uniqueOptions.includes(dummy)) {
      uniqueOptions.push(dummy);
    }
  }

  const choices = uniqueOptions.map(opt => ({
    text: opt,
    isCorrect: opt === correctText
  })).sort(() => Math.random() - 0.5);

  return {
    D,
    d,
    options: choices,
    correct: correctText,
    explain: `Το σωστό αποτέλεσμα είναι: ${correctText} (αφού ${d} × ${q} + ${r} = ${formatNumber(D)}).`
  };
}

// 4. Άσκηση: Επαλήθευση Διαίρεσης - Εύρεση Διαιρετέου (Input)
function makeVerificationQuestion() {
  const d = getRandomInt(12, 45);
  const q = getRandomInt(15, 60);
  const r = getRandomInt(0, d - 1);
  const D = d * q + r;

  return {
    d,
    q,
    r,
    correct: D,
    explain: `Χρησιμοποιούμε τον τύπο της επαλήθευσης: Δ = (δ × π) + υ = (${d} × ${q}) + ${r} = ${formatNumber(d * q)} + ${r} = ${formatNumber(D)}.`
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  return {
    q1: makeExactDivisionQuestion(),
    q2: makeExactDivisionQuestion(),
    q3: makeRemainderQuestion(),
    q4: makeRemainderQuestion(),
    q5: makeMCQDivisionQuestion(),
    q6: makeMCQDivisionQuestion(),
    q7: makeVerificationQuestion(),
    q8: makeVerificationQuestion()
  };
}

export default function Diairesi2PsifiaAskPage() {
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

  // Render Q1 & Q2: Τέλεια Διαίρεση (Input)
  const renderExactDivision = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Υπολόγισε το πηλίκο της τέλειας διαίρεσης: <span className="text-indigo-600 font-mono font-black text-xl">{formatNumber(qData.D)} : {qData.d}</span>
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="number"
          placeholder="Γράψε το πηλίκο (π)"
          value={answers[qKey]}
          onChange={(e) => handleInputChange(qKey, e.target.value)}
          disabled={submitted}
          className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
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

  // Render Q3 & Q4: Εύρεση Υπολοίπου (Input)
  const renderRemainder = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-amber-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Πόσο είναι το <span className="text-amber-600 font-black">υπόλοιπο</span> της διαίρεσης: <span className="text-amber-600 font-mono font-black text-xl">{formatNumber(qData.D)} : {qData.d}</span>;
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="number"
          placeholder="Γράψε το υπόλοιπο (υ)"
          value={answers[qKey]}
          onChange={(e) => handleInputChange(qKey, e.target.value)}
          disabled={submitted}
          className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
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

  // Render Q5 & Q6: Πολλαπλή Επιλογή (MCQ)
  const renderMCQDivision = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-purple-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Επίλεξε το σωστό αποτέλεσμα της διαίρεσης: <span className="text-purple-600 font-mono font-black text-xl">{formatNumber(qData.D)} : {qData.d}</span>
        </h3>
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

  // Render Q7 & Q8: Επαλήθευση - Εύρεση Διαιρετέου (Input)
  const renderVerification = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-emerald-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">
          Σε μια διαίρεση ο διαιρέτης είναι <span className="text-blue-600 font-black">{qData.d}</span>, το πηλίκο είναι <span className="text-emerald-600 font-black">{qData.q}</span> και το υπόλοιπο <span className="text-amber-600 font-black">{qData.r}</span>. Ποιος είναι ο <span className="text-indigo-600 font-black">Διαιρετέος (Δ)</span>;
        </h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <input 
          type="number"
          placeholder="Γράψε τον Διαιρετέο (Δ)"
          value={answers[qKey]}
          onChange={(e) => handleInputChange(qKey, e.target.value)}
          disabled={submitted}
          className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>➗ Ασκήσεις: Διαίρεση με Διψήφιο - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/22-diairesi-2-psifia" className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
                📝 Ασκήσεις: Διαίρεση με Διψήφιο Διαιρέτη
              </h1>
              <p className="text-purple-100 text-sm md:text-base mt-1">
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

            {renderExactDivision('q1', questions.q1, 1)}
            {renderExactDivision('q2', questions.q2, 2)}

            {renderRemainder('q3', questions.q3, 3)}
            {renderRemainder('q4', questions.q4, 4)}

            {renderMCQDivision('q5', questions.q5, 5)}
            {renderMCQDivision('q6', questions.q6, 6)}

            {renderVerification('q7', questions.q7, 7)}
            {renderVerification('q8', questions.q8, 8)}

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

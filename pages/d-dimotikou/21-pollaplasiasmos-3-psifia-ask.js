// pages/d-dimotikou/21-pollaplasiasmos-3-psifia-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIntEndingInZero(min, max) {
  const raw = Math.floor(Math.random() * (max - min + 1)) + min;
  return Math.round(raw / 10) * 10;
}

function formatNumber(num) {
  if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// 1. Άσκηση: Πολλαπλασιασμός με πολλαπλάσια του 10 ή 100 (Input)
function makeRoundMultiplicationQuestion(prevQ = null) {
  let a, b, isHundred, correct;

  while (true) {
    a = getRandomInt(112, 450);
    isHundred = Math.random() > 0.5;
    b = isHundred ? getRandomInt(2, 9) * 100 : getRandomIntEndingInZero(20, 90);
    correct = a * b;

    if (!prevQ || prevQ.a !== a || prevQ.b !== b) break;
  }

  const baseFactor = isHundred ? b / 100 : b / 10;
  const zerosText = isHundred ? 'δύο μηδενικά (00)' : 'ένα μηδενικό (0)';

  return {
    a,
    b,
    correct,
    explainText: `Πολλαπλασιάζουμε ${a} · ${baseFactor} ＝ ${formatNumber(a * baseFactor)} και προσθέτουμε στο τέλος ${zerosText}: ${a} · ${b} ＝ ${formatNumber(correct)}.`
  };
}

// 2. Άσκηση: Εύρεση Μερικού Γινομένου (Input)
function makePartialProductQuestion(prevQ = null) {
  let a, b, unitsB, tensB, hundredsB, mode, resultObj;

  while (true) {
    a = getRandomInt(124, 485);
    unitsB = getRandomInt(2, 9);
    tensB = getRandomInt(2, 8);
    hundredsB = getRandomInt(1, 4);
    b = hundredsB * 100 + tensB * 10 + unitsB;
    mode = getRandomInt(1, 3); // 1 = 1ο, 2 = 2ο, 3 = 3ο

    if (mode === 1) {
      resultObj = {
        a,
        b,
        partialName: `1ο μερικό γινόμενο (${a} · ${unitsB})`,
        correct: a * unitsB,
        explainText: `Το 1ο μερικό γινόμενο προκύπτει πολλαπλασιάζοντας τον πάνω αριθμό με τις Μονάδες: ${a} · ${unitsB} ＝ ${formatNumber(a * unitsB)}.`
      };
    } else if (mode === 2) {
      resultObj = {
        a,
        b,
        partialName: `2ο μερικό γινόμενο (${a} · ${tensB * 10})`,
        correct: a * (tensB * 10),
        explainText: `Το 2ο μερικό γινόμενο προκύπτει πολλαπλασιάζοντας με τις Δεκάδες: ${a} · ${tensB * 10} ＝ ${formatNumber(a * tensB * 10)}.`
      };
    } else {
      resultObj = {
        a,
        b,
        partialName: `3ο μερικό γινόμενο (${a} · ${hundredsB * 100})`,
        correct: a * (hundredsB * 100),
        explainText: `Το 3ο μερικό γινόμενο προκύπτει πολλαπλασιάζοντας με τις Εκατοντάδες: ${a} · ${hundredsB * 100} ＝ ${formatNumber(a * hundredsB * 100)}.`
      };
    }

    if (!prevQ || prevQ.correct !== resultObj.correct) break;
  }

  return resultObj;
}

// 3. Άσκηση: Πολλαπλή Επιλογή με 4 Μοναδικές Επιλογές (ΟΜΑΔΑ Α - MCQ)
function makeMCQMultiplicationQuestion(prevQ = null) {
  let a, b, correct;

  while (true) {
    a = getRandomInt(120, 350);
    b = getRandomInt(112, 245);
    correct = a * b;

    if (!prevQ || prevQ.correct !== formatNumber(correct)) break;
  }

  const wrong1 = correct + 100;
  const wrong2 = correct - 100;
  const wrong3 = correct + (getRandomInt(1, 4) * 10);

  const rawOptions = [formatNumber(correct), formatNumber(wrong1), formatNumber(wrong2), formatNumber(wrong3)];
  const uniqueOptions = Array.from(new Set(rawOptions));

  while (uniqueOptions.length < 4) {
    const dummy = formatNumber(correct + getRandomInt(15, 300));
    if (!uniqueOptions.includes(dummy)) {
      uniqueOptions.push(dummy);
    }
  }

  const options = uniqueOptions.map((opt) => ({
    text: opt,
    isCorrect: opt === formatNumber(correct)
  })).sort(() => Math.random() - 0.5);

  return {
    a,
    b,
    options,
    correct: formatNumber(correct),
    explainText: `Εκτελώντας τον κάθετο πολλαπλασιασμό των αριθμών ${a} και ${b}, βρίσκουμε: ${a} · ${b} ＝ ${formatNumber(correct)}.`
  };
}

// 4. Άσκηση: Τελικός Πολλαπλασιασμός 3ψηφίων (Input)
function makeFullMultiplicationQuestion(prevQ = null) {
  let a, b, correct;

  while (true) {
    a = getRandomInt(115, 360);
    b = getRandomInt(112, 240);
    correct = a * b;

    if (!prevQ || prevQ.correct !== correct) break;
  }

  return {
    a,
    b,
    correct,
    explainText: `Το τελικό γινόμενο είναι το άθροισμα των τριών μερικών γινομένων: ${a} · ${b} ＝ ${formatNumber(correct)}.`
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  const q1 = makeRoundMultiplicationQuestion();
  const q2 = makeRoundMultiplicationQuestion(q1);

  const q3 = makePartialProductQuestion();
  const q4 = makePartialProductQuestion(q3);

  const q5 = makeMCQMultiplicationQuestion();
  const q6 = makeMCQMultiplicationQuestion(q5);

  const q7 = makeFullMultiplicationQuestion();
  const q8 = makeFullMultiplicationQuestion(q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function Pollaplasiasmos3PsifiaAskPage() {
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

  // Render Q1 & Q2: Στρογγυλοί Αριθμοί (Input)
  const renderRoundMultiplication = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-emerald-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            Υπολόγισε το γινόμενο: <span className="text-emerald-700 font-mono font-black text-lg sm:text-xl">{qData.a} · {qData.b}</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{qData.a} · {qData.b}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="Αποτέλεσμα"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-40 sm:w-52 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-emerald-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
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
                Η σωστή απάντηση είναι <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Μερικά Γινόμενα (Input)
  const renderPartialProduct = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-amber-500 text-slate-950 font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            Στον πολλαπλασιασμό <span className="text-amber-700 font-mono font-black">{qData.a} · {qData.b}</span>, πόσο είναι το <span className="text-amber-800 font-extrabold">{qData.partialName}</span>;
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">Μερικό γινόμενο:</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="Γράψε τον αριθμό"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-40 sm:w-52 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-amber-950 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
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
                Η σωστή απάντηση είναι <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Πολλαπλή Επιλογή (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
  const renderMCQMultiplication = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
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
            Επίλεξε το ορθό γινόμενο: <span className="text-purple-700 font-mono font-black text-lg sm:text-xl">{qData.a} · {qData.b}</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt.text;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/80 font-bold text-purple-950 shadow-sm'
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
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 shrink-0"
                />
                <span className="leading-snug font-mono font-bold text-sm sm:text-base">{opt.text}</span>
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
                Η σωστή απάντηση είναι: <strong className="font-mono font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Τελικός Πολλαπλασιασμός 3ψηφίων (Input)
  const renderFullMultiplication = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
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
            Υπολόγισε το τελικό αποτέλεσμα: <span className="text-indigo-700 font-mono font-black text-lg sm:text-xl">{qData.a} · {qData.b}</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{qData.a} · {qData.b}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="Τελικό γινόμενο"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-40 sm:w-52 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-indigo-950 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
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
                Το σωστό γινόμενο είναι <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Πολλαπλασιασμός 3ψήφιων Αριθμών | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στον κάθετο πολλαπλασιασμό τριψήφιων αριθμών: στρογγυλοί αριθμοί, υπολογισμός μερικών γινομένων και τελικό αποτέλεσμα."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/21-pollaplasiasmos-3-psifia"
          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Πολλαπλασιασμός 3ψήφιων Αριθμών
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», οι αριθμοί και τα μερικά γινόμενα ανανεώνονται αυτόματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-emerald-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderRoundMultiplication('q1', questions.q1, 1)}
          {renderRoundMultiplication('q2', questions.q2, 2)}

          {renderPartialProduct('q3', questions.q3, 3)}
          {renderPartialProduct('q4', questions.q4, 4)}

          {renderMCQMultiplication('q5', questions.q5, 5)}
          {renderMCQMultiplication('q6', questions.q6, 6)}

          {renderFullMultiplication('q7', questions.q7, 7)}
          {renderFullMultiplication('q8', questions.q8, 8)}

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

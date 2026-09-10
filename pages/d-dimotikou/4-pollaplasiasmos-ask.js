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
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// 1. Άσκηση: Πολλαπλασιασμός με πολλαπλάσια του 10 (Input)
function makeRoundMultiplicationQuestion() {
  const a = getRandomInt(14, 85);
  const tensVal = getRandomInt(2, 8) * 10; // 20, 30, 40, ..., 80
  return {
    a,
    b: tensVal,
    correct: a * tensVal
  };
}

// 2. Άσκηση: Εύρεση Μερικού Γινομένου (Input)
function makePartialProductQuestion() {
  const a = getRandomInt(16, 75);
  const unitsB = getRandomInt(2, 9);
  const tensB = getRandomInt(1, 4);
  const b = tensB * 10 + unitsB;

  const isFirstPartial = Math.random() > 0.5;

  if (isFirstPartial) {
    return {
      a,
      b,
      partialLabel: '1ο μερικό γινόμενο',
      detail: `${a} · ${unitsB}`,
      multiplierVal: unitsB,
      correct: a * unitsB
    };
  } else {
    return {
      a,
      b,
      partialLabel: '2ο μερικό γινόμενο',
      detail: `${a} · ${tensB * 10}`,
      multiplierVal: tensB * 10,
      correct: a * (tensB * 10)
    };
  }
}

// 3. Άσκηση: Πολλαπλασιασμός Διψήφιων (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeMCQMultiplicationQuestion() {
  const a = getRandomInt(15, 48);
  const b = getRandomInt(12, 35);
  const correct = a * b;

  const unitsB = b % 10;
  const tensB = Math.floor(b / 10);

  // Δημιουργία συνηθισμένων μαθητικών λαθών (distractors)
  const wrongCandidates = new Set();

  // Λάθος 1: Ξεχασμένο μηδενικό στο 2ο μερικό γινόμενο (a * units + a * tens αντί tens*10)
  const forgottenZero = a * unitsB + a * tensB;
  if (forgottenZero !== correct) wrongCandidates.add(forgottenZero);

  // Λάθος 2: Παραλλαγή κατά ±10 ή ±20
  const offBy10 = correct + (Math.random() > 0.5 ? 10 : -10);
  if (offBy10 > 0 && offBy10 !== correct) wrongCandidates.add(offBy10);

  const offBy20 = correct + (Math.random() > 0.5 ? 20 : -20);
  if (offBy20 > 0 && offBy20 !== correct) wrongCandidates.add(offBy20);

  // Συμπλήρωση με παραλλαγές αν χρειαστεί
  let offset = 15;
  while (wrongCandidates.size < 3) {
    const candidate = correct + offset;
    if (candidate !== correct && candidate > 0) wrongCandidates.add(candidate);
    offset += 25;
  }

  const wrongArr = Array.from(wrongCandidates).slice(0, 3);
  const options = [
    { text: formatNumber(correct), isCorrect: true },
    { text: formatNumber(wrongArr[0]), isCorrect: false },
    { text: formatNumber(wrongArr[1]), isCorrect: false },
    { text: formatNumber(wrongArr[2]), isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  return {
    a,
    b,
    options,
    correct: formatNumber(correct),
    correctNum: correct
  };
}

// 4. Άσκηση: Τελικός Πολλαπλασιασμός Διψήφιων (Input)
function makeFullMultiplicationQuestion() {
  const a = getRandomInt(15, 55);
  const b = getRandomInt(12, 38);
  return {
    a,
    b,
    correct: a * b,
    unitsB: b % 10,
    tensB: Math.floor(b / 10),
    p1: a * (b % 10),
    p2: a * (Math.floor(b / 10) * 10)
  };
}

// Δημιουργία των 8 Ερωτήσεων
function generateQuestions() {
  return {
    q1: makeRoundMultiplicationQuestion(),
    q2: makeRoundMultiplicationQuestion(),
    q3: makePartialProductQuestion(),
    q4: makePartialProductQuestion(),
    q5: makeMCQMultiplicationQuestion(),
    q6: makeMCQMultiplicationQuestion(),
    q7: makeFullMultiplicationQuestion(),
    q8: makeFullMultiplicationQuestion()
  };
}

export default function PollaplasiasmosAskPage() {
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

  // Render Q1 & Q2: Πολλαπλασιασμός με Στρογγυλό Αριθμό (Δεκάδα)
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
            Υπολόγισε το γινόμενο: <span className="text-emerald-600 font-mono font-black text-lg sm:text-xl">{qData.a} · {qData.b}</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{qData.a}</span>
            <span>·</span>
            <span>{qData.b}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-emerald-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                Πολλαπλασιάζουμε {qData.a} · {qData.b / 10} ＝ {qData.a * (qData.b / 10)} και προσθέτουμε το μηδενικό στο τέλος: <span className="font-mono font-bold">{formatNumber(qData.correct)}</span>.
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Το σωστό γινόμενο είναι {qData.a} · {qData.b} ＝ <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span> ({qData.a} · {qData.b / 10} δεκάδες ＝ {formatNumber(qData.correct)}).
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Μερικά Γινόμενα
  const renderPartialProduct = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
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
            Στον κάθετο πολλαπλασιασμό <span className="text-amber-600 font-mono font-black text-lg">{qData.a} · {qData.b}</span>, πόσο είναι το <span className="text-amber-600 font-bold">{qData.partialLabel}</span>;
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">
              Υπολογισμός ({qData.detail}):
            </span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-amber-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                Το {qData.partialLabel} προκύπτει από την πράξη {qData.detail} ＝ <span className="font-mono font-bold">{formatNumber(qData.correct)}</span>.
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Το {qData.partialLabel} είναι ίσο με {qData.detail} ＝ <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Πολλαπλή Επιλογή (ΟΜΑΔΑ Α - 4 Επιλογές)
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
            Επίλεξε το σωστό αποτέλεσμα για τον πολλαπλασιασμό: <span className="text-purple-600 font-mono font-black text-lg sm:text-xl">{qData.a} · {qData.b}</span>
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
                <span className="font-mono font-bold text-base leading-snug">{opt.text}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                Ορθός υπολογισμός: {qData.a} · {qData.b} ＝ <span className="font-mono font-bold">{qData.correct}</span>.
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Το ακριβές γινόμενο είναι {qData.a} · {qData.b} ＝ <span className="font-mono font-bold text-rose-900">{qData.correct}</span>.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Τελικός Πολλαπλασιασμός (Input)
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
            Εκτέλεσε κάθετα την πράξη και γράψε το τελικό γινόμενο: <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{qData.a} · {qData.b}</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{qData.a}</span>
            <span>·</span>
            <span>{qData.b}</span>
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
              className="w-40 sm:w-48 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-indigo-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                1ο μερικό γινόμενο: {formatNumber(qData.p1)} ({qData.a} · {qData.unitsB}), 2ο μερικό γινόμενο: {formatNumber(qData.p2)} ({qData.a} · {qData.tensB * 10}). Άθροισμα: <span className="font-mono font-bold">{formatNumber(qData.correct)}</span>.
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Το τελικό αποτέλεσμα είναι {formatNumber(qData.p1)} ＋ {formatNumber(qData.p2)} ＝ <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Πολλαπλασιασμός με Διψήφιο | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στον πολλαπλασιασμό με διψήφιο αριθμό: πολλαπλάσια του 10, μερικά γινόμενα και κάθετες πράξεις."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/4-pollaplasiasmos"
          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
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
              📝 Ασκήσεις: Πολλαπλασιασμός με Διψήφιο
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», οι αριθμοί ανανεώνονται αυτόματα από τη δεξαμενή!
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

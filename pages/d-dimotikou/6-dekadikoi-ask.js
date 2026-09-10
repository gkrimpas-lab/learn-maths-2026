// pages/d-dimotikou/6-dekadikoi-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Component για μαθηματική γραφή κλασμάτων
const Fraction = ({ num, den }) => (
  <span className="inline-flex flex-col items-center align-middle mx-1 text-center font-serif leading-none">
    <span className="border-b border-current px-1 pb-0.5 text-[0.95em]">{num}</span>
    <span className="px-1 pt-0.5 text-[0.95em]">{den}</span>
  </span>
);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 1. Άσκηση: Μετατροπή Δεκαδικού Κλάσματος σε Δεκαδικό Αριθμό (Input)
function makeFractionToDecimalQuestion() {
  const isTenths = Math.random() > 0.5;
  if (isTenths) {
    const num = getRandomInt(1, 9);
    const correct = `0,${num}`;
    return {
      num,
      den: 10,
      correct,
      explainText: `Το κλάσμα έχει παρονομαστή το 10 (δέκατα), επομένως γράφεται με ένα δεκαδικό ψηφίο: 0,${num}.`
    };
  } else {
    const num = getRandomInt(1, 99);
    const correct = num < 10 ? `0,0${num}` : `0,${num}`;
    return {
      num,
      den: 100,
      correct,
      explainText: `Το κλάσμα έχει παρονομαστή το 100 (εκατοστά), επομένως γράφεται με δύο δεκαδικά ψηφία: ${correct}.`
    };
  }
}

// 2. Άσκηση: Αξία Θέσης Δεκαδικού Ψηφίου (Input)
function makePlaceValueQuestion() {
  const isTenthsTarget = Math.random() > 0.5;
  let d1 = getRandomInt(1, 9);
  let d2 = getRandomInt(1, 9);
  while (d1 === d2) {
    d2 = getRandomInt(1, 9);
  }

  const numStr = `0,${d1}${d2}`;
  if (isTenthsTarget) {
    return {
      numStr,
      digit: d1,
      targetPlace: 'δέκατα',
      correct: `0,${d1}`,
      explainText: `Το ψηφίο ${d1} βρίσκεται στην πρώτη θέση μετά την υποδιαστολή, άρα εκφράζει ${d1} δέκατα (0,${d1}).`
    };
  } else {
    return {
      numStr,
      digit: d2,
      targetPlace: 'εκατοστά',
      correct: `0,0${d2}`,
      explainText: `Το ψηφίο ${d2} βρίσκεται στη δεύτερη θέση μετά την υποδιαστολή, άρα εκφράζει ${d2} εκατοστά (0,0${d2}).`
    };
  }
}

// 3. Άσκηση: Σύγκριση Δεκαδικών Αριθμών
function makeComparisonQuestion() {
  const type = getRandomInt(1, 3);
  let numAVal = 0;
  let numBVal = 0;
  let numAStr = '';
  let numBStr = '';

  if (type === 1) {
    // Ίδια τιμή με μηδενικό στο τέλος: π.χ. 0,4 και 0,40
    const d = getRandomInt(1, 9);
    numAVal = d / 10;
    numBVal = d / 10;
    numAStr = `0,${d}`;
    numBStr = `0,${d}0`;
  } else if (type === 2) {
    // Σύγκριση δεκάτων με εκατοστά: π.χ. 0,5 και 0,48
    const d = getRandomInt(2, 8);
    numAVal = d / 10;
    const offset = getRandomInt(2, 6);
    numBVal = (d * 10 - offset) / 100;
    numAStr = `0,${d}`;
    numBStr = `0,${d * 10 - offset}`;
  } else {
    // Δύο εκατοστά: π.χ. 0,25 και 0,31
    const v1 = getRandomInt(11, 89);
    const v2 = getRandomInt(11, 89);
    numAVal = v1 / 100;
    numBVal = v2 / 100;
    numAStr = `0,${v1}`;
    numBStr = `0,${v2}`;
  }

  let correctSym = '＝';
  if (numAVal > numBVal) correctSym = '＞';
  if (numAVal < numBVal) correctSym = '＜';

  return {
    numAStr,
    numBStr,
    correct: correctSym,
    explainText:
      numAVal === numBVal
        ? `Οι αριθμοί ${numAStr} και ${numBStr} είναι ίσοι, καθώς το μηδενικό στο τέλος ενός δεκαδικού δεν αλλάζει την αξία του.`
        : `Συγκρίνοντας τα δέκατα και έπειτα τα εκατοστά, ισχύει ${numAStr} ${correctSym} ${numBStr}.`
  };
}

// 4. Άσκηση: Πολλαπλή Επιλογή Μετατροπής (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeMCQQuestion() {
  const isTenths = Math.random() > 0.5;
  if (isTenths) {
    const num = getRandomInt(1, 9);
    const correct = `0,${num}`;
    const wrong1 = `0,0${num}`;
    const wrong2 = `${num},0`;
    const wrong3 = `0,${num}0`;

    const choices = [
      { text: correct, isCorrect: true },
      { text: wrong1, isCorrect: false },
      { text: wrong2, isCorrect: false },
      { text: wrong3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    return {
      num,
      den: 10,
      options: choices,
      correct,
      explainText: `Το κλάσμα ${num}/10 εκφράζει ${num} δέκατα και γράφεται ακριβώς ως ${correct}.`
    };
  } else {
    const num = getRandomInt(3, 9); // Μονοψήφιος αριθμητής στα εκατοστά (συχνή παγίδα)
    const correct = `0,0${num}`;
    const wrong1 = `0,${num}`;
    const wrong2 = `0,${num}0`;
    const wrong3 = `${num},00`;

    const choices = [
      { text: correct, isCorrect: true },
      { text: wrong1, isCorrect: false },
      { text: wrong2, isCorrect: false },
      { text: wrong3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    return {
      num,
      den: 100,
      options: choices,
      correct,
      explainText: `Το κλάσμα ${num}/100 εκφράζει ${num} εκατοστά, άρα το ψηφίο ${num} τοποθετείται στη 2η δεκαδική θέση: ${correct}.`
    };
  }
}

// Δημιουργία των 8 Ερωτήσεων
function generateQuestions() {
  return {
    q1: makeFractionToDecimalQuestion(),
    q2: makeFractionToDecimalQuestion(),
    q3: makePlaceValueQuestion(),
    q4: makePlaceValueQuestion(),
    q5: makeComparisonQuestion(),
    q6: makeComparisonQuestion(),
    q7: makeMCQQuestion(),
    q8: makeMCQQuestion()
  };
}

export default function DekadikoiAskPage() {
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

  const handleDecimalInput = (key, rawVal) => {
    if (submitted) return;
    // Αποδοχή ψηφίων, κόμματος και τελείας (αυτόματη μετατροπή τελείας σε κόμμα)
    const clean = rawVal.replace('.', ',').replace(/[^0-9,]/g, '');
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    const normalize = (str) => (str || '').trim().replace('.', ',');

    if (normalize(answers.q1) === normalize(questions.q1.correct)) currentScore += 1;
    if (normalize(answers.q2) === normalize(questions.q2.correct)) currentScore += 1;
    if (normalize(answers.q3) === normalize(questions.q3.correct)) currentScore += 1;
    if (normalize(answers.q4) === normalize(questions.q4.correct)) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Q1 & Q2: Κλάσμα σε Δεκαδικό (Input)
  const renderFractionToDecimal = (qKey, qData, numLabel) => {
    const isCorrect = (answers[qKey] || '').trim().replace('.', ',') === qData.correct;
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
            Γράψε το δεκαδικό κλάσμα <Fraction num={qData.num} den={qData.den} /> ως δεκαδικό αριθμό με υποδιαστολή:
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <Fraction num={qData.num} den={qData.den} />
            <span>＝</span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="π.χ. 0,4"
              value={answers[qKey]}
              onChange={(e) => handleDecimalInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-40 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-amber-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
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
                Η σωστή δεκαδική μορφή είναι <span className="font-mono font-bold text-rose-900">{qData.correct}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Αξία Θέσης Ψηφίου (Input)
  const renderPlaceValue = (qKey, qData, numLabel) => {
    const isCorrect = (answers[qKey] || '').trim().replace('.', ',') === qData.correct;
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
            Στον αριθμό <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{qData.numStr}</span>, ποια είναι η πραγματική αξία του ψηφίου <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{qData.digit}</span>;
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">
              Αξία ψηφίου:
            </span>
            <span>＝</span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="π.χ. 0,4 ή 0,05"
              value={answers[qKey]}
              onChange={(e) => handleDecimalInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-indigo-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
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
                Η πραγματική αξία του ψηφίου {qData.digit} είναι <span className="font-mono font-bold text-rose-900">{qData.correct}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Σύγκριση Δεκαδικών
  const renderComparison = (qKey, qData, numLabel) => {
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
            Επίλεξε το κατάλληλο σύμβολο σύγκρισης ( ＜ , ＝ , ＞ ):
          </h3>
        </div>

        <div className="sm:pl-11 space-y-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-lg sm:text-2xl font-mono font-black text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span>{qData.numAStr}</span>

            <div className="flex gap-2">
              {['＜', '＝', '＞'].map((sym) => (
                <button
                  type="button"
                  key={sym}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleInputChange(qKey, sym);
                  }}
                  disabled={submitted}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-lg sm:text-xl font-black border transition active:scale-95 touch-manipulation select-none flex items-center justify-center ${
                    answers[qKey] === sym
                      ? 'bg-purple-600 text-white border-purple-700 shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>

            <span>{qData.numBStr}</span>
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
                Η ορθή σύγκριση είναι <span className="font-mono font-bold text-rose-900">{qData.numAStr} {qData.correct} {qData.numBStr}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Πολλαπλή Επιλογή (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
  const renderMCQ = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-rose-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            Ποιος δεκαδικός αριθμός αντιστοιχεί ακριβώς στο κλάσμα <Fraction num={qData.num} den={qData.den} />;
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
                    ? 'border-rose-500 bg-rose-50/80 font-bold text-rose-950 shadow-sm'
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
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500 shrink-0"
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
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η σωστή επιλογή είναι το <span className="font-mono font-bold text-rose-900">{qData.correct}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Δεκαδικοί Αριθμοί & Κλάσματα | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στους δεκαδικούς αριθμούς: μετατροπή δεκαδικών κλασμάτων, αξία θέσης και σύγκριση δεκαδικών."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/6-dekadikoi"
          className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Δεκαδικοί Αριθμοί
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», τα κλάσματα και οι δεκαδικοί αριθμοί ανανεώνονται αυτόματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderFractionToDecimal('q1', questions.q1, 1)}
          {renderFractionToDecimal('q2', questions.q2, 2)}

          {renderPlaceValue('q3', questions.q3, 3)}
          {renderPlaceValue('q4', questions.q4, 4)}

          {renderComparison('q5', questions.q5, 5)}
          {renderComparison('q6', questions.q6, 6)}

          {renderMCQ('q7', questions.q7, 7)}
          {renderMCQ('q8', questions.q8, 8)}

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

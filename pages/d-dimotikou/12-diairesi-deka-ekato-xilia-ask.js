// pages/d-dimotikou/12-diairesi-deka-ekato-xilia-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// 1. Άσκηση: Διαίρεση με 10, 100, 1.000 (Input)
function makeDivisionQuestion(prevQuestion = null) {
  const factors = [10, 100, 1000];
  let factor, num, val, correctStr;

  while (true) {
    factor = factors[getRandomInt(0, 2)];
    // Πιθανότητα για ακέραιο με μηδενικά ή δεκαδικό αποτέλεσμα
    const endingZeros = getRandomInt(0, 2);
    num = getRandomInt(2, 95) * Math.pow(10, endingZeros);
    val = num / factor;
    correctStr = Number(val.toFixed(3)).toString().replace('.', ',');

    if (!prevQuestion || prevQuestion.num !== num || prevQuestion.factor !== factor) {
      break;
    }
  }

  const shift = factor === 10 ? '1 θέση' : factor === 100 ? '2 θέσεις' : '3 θέσεις';

  return {
    num,
    factor,
    correct: correctStr,
    explainText: `Στη διαίρεση με το ${formatNumber(factor)}, η υποδιαστολή μετακινείται ${shift} αριστερά: ${formatNumber(num)} ： ${formatNumber(factor)} ＝ ${correctStr}.`
  };
}

// 2. Άσκηση: Πολλαπλασιασμός Δεκαδικού με 10, 100, 1.000 (Input)
function makeMultiplicationQuestion(prevQuestion = null) {
  const factors = [10, 100, 1000];
  let factor, decVal, val, numStr, correctStr;

  while (true) {
    factor = factors[getRandomInt(0, 2)];
    decVal = (getRandomInt(1, 99) / 10).toFixed(1);
    val = parseFloat(decVal) * factor;
    numStr = decVal.replace('.', ',');
    correctStr = Number(val.toFixed(2)).toString().replace('.', ',');

    if (!prevQuestion || prevQuestion.numStr !== numStr || prevQuestion.factor !== factor) {
      break;
    }
  }

  const shift = factor === 10 ? '1 θέση' : factor === 100 ? '2 θέσεις' : '3 θέσεις';

  return {
    numStr,
    factor,
    correct: correctStr,
    explainText: `Στον πολλαπλασιασμό με το ${formatNumber(factor)}, η υποδιαστολή μετακινείται ${shift} δεξιά: ${numStr} · ${formatNumber(factor)} ＝ ${formatNumber(correctStr)}.`
  };
}

// 3. Άσκηση: Εύρεση Άγνωστου Τελεστή :10, :100, :1.000 (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeMissingFactorQuestion(prevQuestion = null) {
  const factors = [10, 100, 1000];
  let factor, num, res, resStr;

  while (true) {
    factor = factors[getRandomInt(0, 2)];
    num = getRandomInt(2, 85) * (factor >= 100 ? 10 : 1);
    res = num / factor;
    resStr = Number(res.toFixed(3)).toString().replace('.', ',');

    if (!prevQuestion || prevQuestion.num !== num || prevQuestion.factor !== factor) {
      break;
    }
  }

  const correctText = formatNumber(factor);
  const allChoices = ['10', '100', '1.000', '10.000'];
  const wrongs = allChoices.filter((c) => c !== correctText);

  const options = [
    { text: correctText, isCorrect: true },
    { text: wrongs[0], isCorrect: false },
    { text: wrongs[1], isCorrect: false },
    { text: wrongs[2], isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  return {
    num,
    factor,
    resStr,
    options,
    correct: correctText,
    explainText: `Η υποδιαστολή μετακινήθηκε ${factor === 10 ? '1 θέση' : factor === 100 ? '2 θέσεις' : '3 θέσεις'} αριστερά, άρα ο αριθμός διαιρέθηκε με το ${correctText}.`
  };
}

// 4. Άσκηση: Σύγκριση Εκφράσεων (<, =, >)
function makeComparisonQuestion(prevQuestion = null) {
  let exprA, exprB, valA, valB, correctSym;

  while (true) {
    const isMulA = Math.random() > 0.5;
    const factorA = [10, 100][getRandomInt(0, 1)];
    const baseA = getRandomInt(2, 45);

    valA = isMulA ? baseA * factorA : baseA / factorA;
    const strBaseA = baseA.toString().replace('.', ',');
    exprA = `${strBaseA} ${isMulA ? '·' : '：'} ${factorA}`;

    const isMulB = Math.random() > 0.5;
    const factorB = [10, 100][getRandomInt(0, 1)];
    let baseB = getRandomInt(2, 45);

    if (Math.random() > 0.65) {
      // Πιθανότητα για ίσο αποτέλεσμα
      valB = valA;
      baseB = isMulB ? valB / factorB : valB * factorB;
    } else {
      valB = isMulB ? baseB * factorB : baseB / factorB;
    }

    const strBaseB = Number(baseB.toFixed(2)).toString().replace('.', ',');
    exprB = `${strBaseB} ${isMulB ? '·' : '：'} ${factorB}`;

    correctSym = '＝';
    if (valA > valB) correctSym = '＞';
    if (valA < valB) correctSym = '＜';

    if (!prevQuestion || prevQuestion.exprA !== exprA || prevQuestion.exprB !== exprB) {
      break;
    }
  }

  const cleanValA = Number(valA.toFixed(2)).toString().replace('.', ',');
  const cleanValB = Number(valB.toFixed(2)).toString().replace('.', ',');

  return {
    exprA,
    exprB,
    valA: cleanValA,
    valB: cleanValB,
    correct: correctSym,
    explainText: `Υπολογίζοντας τις εκφράσεις: ${exprA} ＝ ${cleanValA} και ${exprB} ＝ ${cleanValB}, επομένως ισχύει ${exprA} ${correctSym} ${exprB}.`
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  const q1 = makeDivisionQuestion();
  const q2 = makeDivisionQuestion(q1);

  const q3 = makeMultiplicationQuestion();
  const q4 = makeMultiplicationQuestion(q3);

  const q5 = makeMissingFactorQuestion();
  const q6 = makeMissingFactorQuestion(q5);

  const q7 = makeComparisonQuestion();
  const q8 = makeComparisonQuestion(q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function Diairesi101001000AskPage() {
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
    const clean = rawVal.replace('.', ',').replace(/[^0-9,]/g, '');
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    const normalize = (str) => (str || '').toString().trim().replace('.', ',');

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

  // Render Q1 & Q2: Διαίρεση (Input)
  const renderDivision = (qKey, qData, numLabel) => {
    const isCorrect = (answers[qKey] || '').toString().trim().replace('.', ',') === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-rose-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            Υπολόγισε το αποτέλεσμα της διαίρεσης: <span className="text-rose-600 font-mono font-black text-lg sm:text-xl">{formatNumber(qData.num)} ： {formatNumber(qData.factor)} ＝ ?</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{formatNumber(qData.num)}</span>
            <span>：</span>
            <span>{formatNumber(qData.factor)}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="Αποτέλεσμα"
              value={answers[qKey]}
              onChange={(e) => handleDecimalInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-rose-900 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none shadow-sm"
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
                Το ορθό αποτέλεσμα είναι <span className="font-mono font-bold text-rose-900">{qData.correct}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Πολλαπλασιασμός (Input)
  const renderMultiplication = (qKey, qData, numLabel) => {
    const isCorrect = (answers[qKey] || '').toString().trim().replace('.', ',') === qData.correct;
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
            Υπολόγισε το γινόμενο: <span className="text-emerald-600 font-mono font-black text-lg sm:text-xl">{qData.numStr} · {formatNumber(qData.factor)} ＝ ?</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{qData.numStr}</span>
            <span>·</span>
            <span>{formatNumber(qData.factor)}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="Αποτέλεσμα"
              value={answers[qKey]}
              onChange={(e) => handleDecimalInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-emerald-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
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
                Το ορθό αποτέλεσμα είναι <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Άγνωστος Τελεστής (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
  const renderMissingFactor = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
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
            Ποιος αριθμός λείπει από την ισότητα; <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{formatNumber(qData.num)} ： [ ? ] ＝ {qData.resStr}</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt.text;
            return (
              <label
                key={idx}
                className={`flex items-center justify-center p-3.5 rounded-2xl border cursor-pointer transition select-none ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-sm'
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
                  className="hidden"
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
                Ο αριθμός που λείπει είναι το <strong className="font-mono font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Σύγκριση Εκφράσεων (Buttons)
  const renderComparison = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
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
            Επίλεξε το κατάλληλο σύμβολο σύγκρισης ( ＜ , ＝ , ＞ ):
          </h3>
        </div>

        <div className="sm:pl-11 space-y-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-lg sm:text-xl font-mono font-black text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span>{qData.exprA}</span>

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
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>

            <span>{qData.exprB}</span>
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
                Η σωστή σχέση είναι <span className="font-mono font-bold text-rose-900">{qData.exprA} {qData.correct} {qData.exprB}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Διαίρεση & Πολλαπλασιασμός με 10, 100, 1.000 | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού: μετακίνηση υποδιαστολής στη διαίρεση και τον πολλαπλασιασμό με 10, 100 και 1.000, εύρεση άγνωστου τελεστή και σύγκριση."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/12-diairesi-deka-ekato-xilia"
          className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Μετακίνηση Υποδιαστολής (10, 100, 1.000)
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», οι αριθμοί και οι πράξεις ανανεώνονται αυτόματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-blue-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderDivision('q1', questions.q1, 1)}
          {renderDivision('q2', questions.q2, 2)}

          {renderMultiplication('q3', questions.q3, 3)}
          {renderMultiplication('q4', questions.q4, 4)}

          {renderMissingFactor('q5', questions.q5, 5)}
          {renderMissingFactor('q6', questions.q6, 6)}

          {renderComparison('q7', questions.q7, 7)}
          {renderComparison('q8', questions.q8, 8)}

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

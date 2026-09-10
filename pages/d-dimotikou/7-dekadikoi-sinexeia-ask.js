// pages/d-dimotikou/7-dekadikoi-sinexeia-ask.js
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

// 1. Άσκηση: Μετατροπή Κλάσματος σε Δεκαδικό Αριθμό (Input)
function makeFractionToDecimalQuestion() {
  const isTenths = Math.random() > 0.5;
  const den = isTenths ? 10 : 100;
  const num = isTenths ? getRandomInt(12, 98) : getRandomInt(105, 495);
  const correct = (num / den).toFixed(isTenths ? 1 : 2).replace('.', ',');

  return {
    num,
    den,
    correct,
    explainText: isTenths
      ? `Διαιρώντας με το 10, η υποδιαστολή μετακινείται 1 θέση αριστερά: ${num}/10 ＝ ${correct}.`
      : `Διαιρώντας με το 100, η υποδιαστολή μετακινείται 2 θέσεις αριστερά: ${num}/100 ＝ ${correct}.`
  };
}

// 2. Άσκηση: Μετατροπή Δεκαδικού σε Δεκαδικό Κλάσμα (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeDecimalToFractionQuestion() {
  const isTenths = Math.random() > 0.5;
  const den = isTenths ? 10 : 100;
  const num = isTenths ? getRandomInt(3, 39) : getRandomInt(15, 185);
  const decVal = (num / den).toFixed(isTenths ? 1 : 2).replace('.', ',');

  const correctText = `${num}/${den}`;

  const wrongCandidates = new Set();
  wrongCandidates.add(`${num}/${den === 10 ? 100 : 10}`);
  wrongCandidates.add(`${num + (num > 10 ? 5 : 2)}/${den}`);
  wrongCandidates.add(`${den}/${num}`);

  while (wrongCandidates.size < 3) {
    wrongCandidates.add(`${num + getRandomInt(1, 9)}/${den}`);
  }

  const wrongArr = Array.from(wrongCandidates).slice(0, 3);
  const options = [
    { num, den, text: correctText, isCorrect: true },
    { num: parseInt(wrongArr[0].split('/')[0], 10), den: parseInt(wrongArr[0].split('/')[1], 10), text: wrongArr[0], isCorrect: false },
    { num: parseInt(wrongArr[1].split('/')[0], 10), den: parseInt(wrongArr[1].split('/')[1], 10), text: wrongArr[1], isCorrect: false },
    { num: parseInt(wrongArr[2].split('/')[0], 10), den: parseInt(wrongArr[2].split('/')[1], 10), text: wrongArr[2], isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  return {
    decVal,
    num,
    den,
    options,
    correct: correctText,
    explainText: `Ο αριθμός ${decVal} έχει ${isTenths ? '1 δεκαδικό ψηφίο (δέκατα)' : '2 δεκαδικά ψηφία (εκατοστά)'}, άρα ισούται με το κλάσμα ${num}/${den}.`
  };
}

// 3. Άσκηση: Αξία Θέσης Ψηφίου (με εξασφάλιση μοναδικότητας)
function makePlaceValueQuestion() {
  let intPart = 0;
  let tenths = 0;
  let hundredths = 0;

  // Εγγύηση: όλα τα ψηφία είναι διαφορετικά μεταξύ τους
  while (true) {
    intPart = getRandomInt(1, 9);
    tenths = getRandomInt(1, 9);
    hundredths = getRandomInt(1, 9);
    if (intPart !== tenths && intPart !== hundredths && tenths !== hundredths) break;
  }

  const placeType = Math.random() > 0.5 ? 'δέκατα' : 'εκατοστά';
  const decStr = `${intPart},${tenths}${hundredths}`;
  const correctDigit = placeType === 'δέκατα' ? tenths : hundredths;

  return {
    decStr,
    placeType,
    correct: correctDigit,
    explainText:
      placeType === 'δέκατα'
        ? `Το ψηφίο των δεκάτων είναι το πρώτο ψηφίο αμέσως μετά την υποδιαστολή, δηλαδή το ${correctDigit}.`
        : `Το ψηφίο των εκατοστών είναι το δεύτερο ψηφίο μετά την υποδιαστολή, δηλαδή το ${correctDigit}.`
  };
}

// 4. Άσκηση: Σύγκριση Δεκαδικών Αριθμών
function makeComparisonQuestion() {
  const type = getRandomInt(1, 3);
  let valA = 0;
  let valB = 0;
  let strA = '';
  let strB = '';

  if (type === 1) {
    // Ίσοι αριθμοί με τελικό μηδενικό (π.χ. 2,4 vs 2,40)
    const intP = getRandomInt(1, 12);
    const d = getRandomInt(1, 9);
    valA = intP + d / 10;
    valB = valA;
    strA = `${intP},${d}`;
    strB = `${intP},${d}0`;
  } else if (type === 2) {
    // Ίδιο ακέραιο μέρος, διαφορετικά δέκατα (π.χ. 3,6 vs 3,58)
    const intP = getRandomInt(1, 12);
    const d = getRandomInt(3, 8);
    valA = intP + d / 10;
    const diff = getRandomInt(2, 8);
    valB = intP + (d * 10 - diff) / 100;
    strA = `${intP},${d}`;
    strB = `${intP},${d * 10 - diff}`;
  } else {
    // Διαφορετικά ακέραια μέρη (π.χ. 4,21 vs 3,89)
    const intP1 = getRandomInt(3, 14);
    const intP2 = intP1 - 1;
    const d1 = getRandomInt(10, 40);
    const d2 = getRandomInt(60, 95);
    valA = intP1 + d1 / 100;
    valB = intP2 + d2 / 100;
    strA = `${intP1},${d1}`;
    strB = `${intP2},${d2}`;
  }

  let correctSym = '＝';
  if (valA > valB) correctSym = '＞';
  if (valA < valB) correctSym = '＜';

  return {
    strA,
    strB,
    correct: correctSym,
    explainText:
      valA === valB
        ? `Οι αριθμοί ${strA} και ${strB} είναι ίσοι, αφού το μηδενικό στο τέλος του δεκαδικού μέρους δεν μεταβάλλει την αξία.`
        : `Συγκρίνοντας πρώτα τα ακέραια μέρη και έπειτα τα δέκατα, προκύπτει ${strA} ${correctSym} ${strB}.`
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  return {
    q1: makeFractionToDecimalQuestion(),
    q2: makeFractionToDecimalQuestion(),
    q3: makeDecimalToFractionQuestion(),
    q4: makeDecimalToFractionQuestion(),
    q5: makePlaceValueQuestion(),
    q6: makePlaceValueQuestion(),
    q7: makeComparisonQuestion(),
    q8: makeComparisonQuestion()
  };
}

export default function DekadikoiSinexeiaAskPage() {
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
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (parseInt(answers.q6, 10) === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Q1 & Q2: Κλάσμα ➔ Δεκαδικός (Input)
  const renderFractionToDecimal = (qKey, qData, numLabel) => {
    const isCorrect = (answers[qKey] || '').toString().trim().replace('.', ',') === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-teal-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
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
              placeholder="π.χ. 3,5"
              value={answers[qKey]}
              onChange={(e) => handleDecimalInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-40 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-teal-900 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
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

  // Render Q3 & Q4: Δεκαδικός ➔ Κλάσμα (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
  const renderDecimalToFraction = (qKey, qData, numLabel) => {
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
            Ποιο δεκαδικό κλάσμα ισούται με τον δεκαδικό αριθμό <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{qData.decVal}</span>;
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
                <Fraction num={opt.num} den={opt.den} />
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
                Το ορθό δεκαδικό κλάσμα είναι το <Fraction num={qData.num} den={qData.den} />. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Αξία Θέσης (Input)
  const renderPlaceValue = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
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
            Ποιο ψηφίο βρίσκεται στη θέση των <span className="text-purple-600 font-extrabold">{qData.placeType}</span> στον αριθμό <span className="text-purple-600 font-mono font-black text-lg sm:text-xl">{qData.decStr}</span>;
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">
              Ψηφίο ({qData.placeType}):
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
              onChange={(e) => handleDecimalInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-28 sm:w-36 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-purple-900 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
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
                Το ψηφίο είναι το <span className="font-mono font-bold text-rose-900">{qData.correct}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Σύγκριση (Buttons)
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
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-lg sm:text-2xl font-mono font-black text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span>{qData.strA}</span>

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

            <span>{qData.strB}</span>
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
                Η σωστή σύγκριση είναι <span className="font-mono font-bold text-rose-900">{qData.strA} {qData.correct} {qData.strB}</span>. {qData.explainText}
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
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στους δεκαδικούς αριθμούς: μετατροπή κλασμάτων, αξία θέσης δεκάτων/εκατοστών και σύγκριση."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/7-dekadikoi-sinexeia"
          className="bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Δεκαδικοί Αριθμοί και Κλάσματα
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», τα κλάσματα και οι δεκαδικοί αριθμοί ανανεώνονται αυτόματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-teal-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderFractionToDecimal('q1', questions.q1, 1)}
          {renderFractionToDecimal('q2', questions.q2, 2)}

          {renderDecimalToFraction('q3', questions.q3, 3)}
          {renderDecimalToFraction('q4', questions.q4, 4)}

          {renderPlaceValue('q5', questions.q5, 5)}
          {renderPlaceValue('q6', questions.q6, 6)}

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

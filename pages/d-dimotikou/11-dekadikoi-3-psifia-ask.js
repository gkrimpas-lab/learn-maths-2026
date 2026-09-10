// pages/d-dimotikou/11-dekadikoi-3-psifia-ask.js
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

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// 1. Άσκηση: Μετατροπή Κλάσματος σε Δεκαδικό με 3 ψηφία (Input)
function makeFractionToDecimalQuestion(prevQuestion = null) {
  let num, val;
  const den = 1000;

  while (true) {
    // Εναλλαγή μεταξύ μονοψήφιου, διψήφιου, τριψήφιου και τετραψήφιου αριθμητή για ποικιλία παγίδων
    const category = getRandomInt(1, 4);
    if (category === 1) num = getRandomInt(3, 9); // π.χ. 7/1000 -> 0,007
    else if (category === 2) num = getRandomInt(12, 85); // π.χ. 45/1000 -> 0,045
    else if (category === 3) num = getRandomInt(105, 995); // π.χ. 325/1000 -> 0,325
    else num = getRandomInt(1005, 4995); // π.χ. 2345/1000 -> 2,345

    val = (num / den).toFixed(3).replace('.', ',');

    if (!prevQuestion || prevQuestion.num !== num) {
      break;
    }
  }

  return {
    num,
    den,
    correct: val,
    explainText: `Διαιρώντας με το 1.000, η υποδιαστολή μετακινείται 3 θέσεις προς τα αριστερά: ${formatNumber(num)}/1.000 ＝ ${val}.`
  };
}

// 2. Άσκηση: Μετατροπή Δεκαδικού σε Κλάσμα (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeDecimalToFractionQuestion(prevQuestion = null) {
  let num, decVal;
  const den = 1000;

  while (true) {
    num = getRandomInt(15, 985);
    decVal = (num / den).toFixed(3).replace('.', ',');

    if (!prevQuestion || prevQuestion.decVal !== decVal) {
      break;
    }
  }

  const correctText = `${num}/${den}`;
  const wrongCandidates = new Set();
  wrongCandidates.add(`${num}/100`);
  wrongCandidates.add(`${num}/10`);
  wrongCandidates.add(`${num + (num > 10 ? 10 : 2)}/${den}`);
  wrongCandidates.add(`${den}/${num}`);

  while (wrongCandidates.size < 3) {
    wrongCandidates.add(`${num + getRandomInt(3, 20)}/${den}`);
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
    options,
    correct: correctText,
    num,
    den,
    explainText: `Ο αριθμός ${decVal} έχει 3 δεκαδικά ψηφία (χιλιοστά), επομένως ισούται ακριβώς με το δεκαδικό κλάσμα ${num}/1.000.`
  };
}

// 3. Άσκηση: Αξία Θέσης Ψηφίου (με εγγύηση μοναδικότητας)
function makePlaceValueQuestion(prevQuestion = null) {
  let intPart, tenths, hundredths, thousandths, placeType, decStr, correctDigit;
  const places = ['δέκατα', 'εκατοστά', 'χιλιοστά'];

  while (true) {
    intPart = getRandomInt(0, 9);
    tenths = getRandomInt(1, 9);
    hundredths = getRandomInt(1, 9);
    thousandths = getRandomInt(1, 9);

    // Εξασφάλιση μοναδικότητας: όλα τα ψηφία του αριθμού είναι διαφορετικά
    if (
      intPart !== tenths &&
      intPart !== hundredths &&
      intPart !== thousandths &&
      tenths !== hundredths &&
      tenths !== thousandths &&
      hundredths !== thousandths
    ) {
      placeType = places[getRandomInt(0, places.length - 1)];
      decStr = `${intPart},${tenths}${hundredths}${thousandths}`;

      if (placeType === 'δέκατα') correctDigit = tenths;
      if (placeType === 'εκατοστά') correctDigit = hundredths;
      if (placeType === 'χιλιοστά') correctDigit = thousandths;

      if (!prevQuestion || prevQuestion.decStr !== decStr || prevQuestion.placeType !== placeType) {
        break;
      }
    }
  }

  return {
    decStr,
    placeType,
    correct: correctDigit.toString(),
    explainText:
      placeType === 'δέκατα'
        ? `Το ψηφίο των δεκάτων είναι το 1ο ψηφίο μετά την υποδιαστολή, δηλαδή το ${correctDigit}.`
        : placeType === 'εκατοστά'
        ? `Το ψηφίο των εκατοστών είναι το 2ο ψηφίο μετά την υποδιαστολή, δηλαδή το ${correctDigit}.`
        : `Το ψηφίο των χιλιοστών είναι το 3ο ψηφίο μετά την υποδιαστολή, δηλαδή το ${correctDigit}.`
  };
}

// 4. Άσκηση: Σύγκριση Δεκαδικών με 3 ψηφία (<, =, >)
function makeComparisonQuestion(prevQuestion = null) {
  let valA, valB, strA, strB, correctSym;

  while (true) {
    const intPart = getRandomInt(0, 9);
    const type = getRandomInt(1, 3);

    if (type === 1) {
      // Ίσοι αριθμοί με μηδενικά στο τέλος (π.χ. 3,400 vs 3,4)
      const d = getRandomInt(1, 9);
      valA = intPart + d / 10;
      valB = valA;
      strA = `${intPart},${d}00`;
      strB = `${intPart},${d}`;
    } else if (type === 2) {
      // Ίδια δέκατα, διαφορά στα εκατοστά ή χιλιοστά
      const d = getRandomInt(1, 8);
      const decA = d * 100 + getRandomInt(10, 80);
      const decB = decA + getRandomInt(-15, 25);
      valA = intPart + decA / 1000;
      valB = intPart + decB / 1000;
      strA = `${intPart},${decA.toString().padStart(3, '0')}`;
      strB = `${intPart},${decB.toString().padStart(3, '0')}`;
    } else {
      // Διαφορά ήδη από το ακέραιο μέρος ή τα δέκατα
      const decA = getRandomInt(15, 950);
      const decB = getRandomInt(15, 950);
      valA = intPart + decA / 1000;
      valB = intPart + (Math.random() > 0.5 ? 1 : 0) + decB / 1000;
      strA = (intPart + decA / 1000).toFixed(3).replace('.', ',');
      strB = valB.toFixed(3).replace('.', ',');
    }

    correctSym = '＝';
    if (valA > valB) correctSym = '＞';
    if (valA < valB) correctSym = '＜';

    if (!prevQuestion || prevQuestion.strA !== strA || prevQuestion.strB !== strB) {
      break;
    }
  }

  return {
    strA,
    strB,
    correct: correctSym,
    explainText:
      valA === valB
        ? `Οι αριθμοί ${strA} και ${strB} είναι ίσοι, αφού τα μηδενικά στο τέλος του δεκαδικού μέρους δεν αλλάζουν την αξία.`
        : `Συγκρίνοντας τα ψηφία από τα αριστερά προς τα δεξιά, προκύπτει ${strA} ${correctSym} ${strB}.`
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  const q1 = makeFractionToDecimalQuestion();
  const q2 = makeFractionToDecimalQuestion(q1);

  const q3 = makeDecimalToFractionQuestion();
  const q4 = makeDecimalToFractionQuestion(q3);

  const q5 = makePlaceValueQuestion();
  const q6 = makePlaceValueQuestion(q5);

  const q7 = makeComparisonQuestion();
  const q8 = makeComparisonQuestion(q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function Dekadikoi3PsifiaAskPage() {
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
    if (parseInt(answers.q5, 10) === parseInt(questions.q5.correct, 10)) currentScore += 1;
    if (parseInt(answers.q6, 10) === parseInt(questions.q6.correct, 10)) currentScore += 1;
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
          <span className="bg-purple-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            Γράψε το δεκαδικό κλάσμα <Fraction num={formatNumber(qData.num)} den={formatNumber(qData.den)} /> ως δεκαδικό αριθμό με υποδιαστολή:
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <Fraction num={formatNumber(qData.num)} den={formatNumber(qData.den)} />
            <span>＝</span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="π.χ. 0,245"
              value={answers[qKey]}
              onChange={(e) => handleDecimalInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-purple-900 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
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
                Ο σωστός δεκαδικός αριθμός είναι <span className="font-mono font-bold text-rose-900">{qData.correct}</span>. {qData.explainText}
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
            Ποιο δεκαδικό κλάσμα ισούται με τον αριθμό <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{qData.decVal}</span>;
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
                <Fraction num={formatNumber(opt.num)} den={formatNumber(opt.den)} />
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
                Το ορθό δεκαδικό κλάσμα είναι το <Fraction num={formatNumber(qData.num)} den={formatNumber(qData.den)} />. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Αξία Θέσης (Input)
  const renderPlaceValue = (qKey, qData, numLabel) => {
    const isCorrect = (answers[qKey] || '').toString().trim() === qData.correct;
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
            Ποιο ψηφίο βρίσκεται στη θέση των <span className="text-teal-600 font-extrabold">{qData.placeType}</span> στον αριθμό <span className="text-teal-600 font-mono font-black text-lg sm:text-xl">{qData.decStr}</span>;
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
              className="w-28 sm:w-36 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-teal-900 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
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
                Η σωστή σχέση είναι <span className="font-mono font-bold text-rose-900">{qData.strA} {qData.correct} {qData.strB}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Δεκαδικοί Αριθμοί με 3 Ψηφία | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στους δεκαδικούς με 3 ψηφία (χιλιοστά): μετατροπή κλασμάτων με παρονομαστή 1.000, αξία θέσης και σύγκριση."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/11-dekadikoi-3-psifia"
          className="bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Δεκαδικοί με 3 Ψηφία (Χιλιοστά)
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», οι αριθμοί και τα κλάσματα ανανεώνονται αυτόματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-purple-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
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

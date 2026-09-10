// pages/d-dimotikou/9-baros-ask.js
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

// 1. Άσκηση: Μετατροπή από Μεγαλύτερη σε Μικρότερη Μονάδα (Input)
function makeBigToSmallQuestion(prevQuestion = null) {
  const types = [
    { from: 'kg', to: 'g', factor: 1000, min: 2, max: 25 },
    { from: 't', to: 'kg', factor: 1000, min: 2, max: 15 }
  ];

  let chosen, val, correct;

  while (true) {
    chosen = types[getRandomInt(0, types.length - 1)];
    val = getRandomInt(chosen.min, chosen.max);
    correct = val * chosen.factor;

    if (!prevQuestion || prevQuestion.from !== chosen.from || prevQuestion.val !== val) {
      break;
    }
  }

  return {
    val,
    from: chosen.from,
    to: chosen.to,
    factor: chosen.factor,
    correct,
    explainText: `Για να μετατρέψουμε από ${chosen.from} σε ${chosen.to}, πολλαπλασιάζουμε με το 1.000: ${val} · 1.000 ＝ ${formatNumber(correct)} ${chosen.to}.`
  };
}

// 2. Άσκηση: Μετατροπή από Μικρότερη σε Μεγαλύτερη Μονάδα (Input)
function makeSmallToBigQuestion(prevQuestion = null) {
  const types = [
    { from: 'g', to: 'kg', factor: 1000, min: 2, max: 20 },
    { from: 'kg', to: 't', factor: 1000, min: 2, max: 12 }
  ];

  let chosen, correct, val;

  while (true) {
    chosen = types[getRandomInt(0, types.length - 1)];
    correct = getRandomInt(chosen.min, chosen.max);
    val = correct * chosen.factor;

    if (!prevQuestion || prevQuestion.from !== chosen.from || prevQuestion.val !== val) {
      break;
    }
  }

  return {
    val,
    from: chosen.from,
    to: chosen.to,
    factor: chosen.factor,
    correct,
    explainText: `Για να μετατρέψουμε από ${chosen.from} σε ${chosen.to}, διαιρούμε με το 1.000: ${formatNumber(val)} ： 1.000 ＝ ${correct} ${chosen.to}.`
  };
}

// 3. Άσκηση: Επιλογή Κατάλληλης Μονάδας Βάρους (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
const SUITABLE_UNITS_POOL = [
  // ΤΟΝΟΙ (t)
  { q: 'το βάρος ενός ενήλικου αφρικανικού ελέφαντα', correct: 'Τόνοι (t)', contextDesc: 'πολύ μεγάλα ζώα της ξηράς' },
  { q: 'το βάρος ενός φορτηγού αυτοκινήτου με το φορτίο του', correct: 'Τόνοι (t)', contextDesc: 'βαριά οχήματα μεταφορών' },
  { q: 'το βάρος ενός επιβατηγού πλοίου', correct: 'Τόνοι (t)', contextDesc: 'πλοία και ναυπηγήματα' },
  { q: 'τη συνολική ετήσια σοδειά σιταριού ενός μεγάλου αγροκτήματος', correct: 'Τόνοι (t)', contextDesc: 'μεγάλες αγροτικές παραγωγές' },
  { q: 'το βάρος μιας γαλάζιας φάλαινας στον ωκεανό', correct: 'Τόνοι (t)', contextDesc: 'τα μεγαλύτερα θηλαστικά του πλανήτη' },
  { q: 'το βάρος ενός αεροπλάνου τύπου Boeing', correct: 'Τόνοι (t)', contextDesc: 'μεγάλα αεροσκάφη' },

  // ΚΙΛΑ (kg)
  { q: 'το βάρος ενός μαθητή της Δ\' Δημοτικού', correct: 'Κιλά (kg)', contextDesc: 'το ανθρώπινο σωματικό βάρος' },
  { q: 'το βάρος μιας σακούλας με φρέσκα πορτοκάλια και μήλα', correct: 'Κιλά (kg)', contextDesc: 'αγορές φρούτων στη λαϊκή' },
  { q: 'το βάρος ενός σκύλου ράτσας λαμπραντόρ', correct: 'Κιλά (kg)', contextDesc: 'κατοικίδια ζώα μεσαίου μεγέθους' },
  { q: 'το βάρος ενός ποδηλάτου βουνού', correct: 'Κιλά (kg)', contextDesc: 'αθλητικό εξοπλισμό' },
  { q: 'το βάρος ενός σακιού με πατάτες', correct: 'Κιλά (kg)', contextDesc: 'συσκευασμένα τρόφιμα' },
  { q: 'το βάρος ενός σχολικού γραφείου', correct: 'Κιλά (kg)', contextDesc: 'σχολικά έπιπλα' },

  // ΓΡΑΜΜΑΡΙΑ (g)
  { q: 'το βάρος μιας πλάκας σοκολάτας', correct: 'Γραμμάρια (g)', contextDesc: 'τυποποιημένα γλυκίσματα' },
  { q: 'το βάρος ενός χρυσού δαχτυλιδιού', correct: 'Γραμμάρια (g)', contextDesc: 'κοσμήματα και πολύτιμα μέταλλα' },
  { q: 'το βάρος ενός αυγού κότας', correct: 'Γραμμάρια (g)', contextDesc: 'μικρά μεμονωμένα τρόφιμα' },
  { q: 'το βάρος ενός ταχυδρομικού φακέλου με μια κάρτα', correct: 'Γραμμάρια (g)', contextDesc: 'αλληλογραφία και επιστολές' },
  { q: 'το βάρος μιας κουταλιάς μαγειρικού αλατιού', correct: 'Γραμμάρια (g)', contextDesc: 'μικρές δόσεις μπαχαρικών' },
  { q: 'το βάρος μιας γόμας σχεδίασης', correct: 'Γραμμάρια (g)', contextDesc: 'μικρά σχολικά είδη' }
];

function makeSuitableUnitQuestion(prevQuestion = null) {
  let selected;

  while (true) {
    selected = SUITABLE_UNITS_POOL[getRandomInt(0, SUITABLE_UNITS_POOL.length - 1)];
    if (!prevQuestion || prevQuestion.qText !== selected.q) {
      break;
    }
  }

  // 4 επιλογές για αυστηρή τήρηση ΟΜΑΔΑΣ Α
  const allChoices = ['Τόνοι (t)', 'Κιλά (kg)', 'Γραμμάρια (g)', 'Χιλιοστόγραμμα (mg)'];
  const wrongs = allChoices.filter((c) => c !== selected.correct);

  const options = [
    { text: selected.correct, isCorrect: true },
    { text: wrongs[0], isCorrect: false },
    { text: wrongs[1], isCorrect: false },
    { text: wrongs[2], isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  return {
    qText: selected.q,
    options,
    correct: selected.correct,
    explainText: `Για να μετρήσουμε ${selected.contextDesc}, η καταλληλότερη μονάδα μέτρησης είναι τα ${selected.correct}.`
  };
}

// 4. Άσκηση: Σύγκριση Βαρών (<, =, >)
function makeComparisonQuestion(prevQuestion = null) {
  const pairs = [
    { unitA: 'kg', unitB: 'g', factorA: 1000 },
    { unitA: 't', unitB: 'kg', factorA: 1000 }
  ];

  let pair, valA, valB, correctSym;

  while (true) {
    pair = pairs[getRandomInt(0, pairs.length - 1)];
    valA = getRandomInt(2, 12);

    valB = valA * pair.factorA;
    if (Math.random() > 0.35) {
      valB = (valA + getRandomInt(-2, 2)) * pair.factorA;
      if (valB <= 0 || valB === valA * pair.factorA) {
        valB = valA * pair.factorA + (Math.random() > 0.5 ? 500 : -500);
      }
    }

    const realBInAUnit = valB / pair.factorA;
    correctSym = '＝';
    if (valA > realBInAUnit) correctSym = '＞';
    if (valA < realBInAUnit) correctSym = '＜';

    if (!prevQuestion || prevQuestion.valA !== valA || prevQuestion.valB !== valB || prevQuestion.unitA !== pair.unitA) {
      break;
    }
  }

  return {
    valA,
    unitA: pair.unitA,
    valB,
    unitB: pair.unitB,
    correct: correctSym,
    explainText: `Μετατρέποντας στην ίδια μονάδα: ${valA} ${pair.unitA} ＝ ${formatNumber(valA * pair.factorA)} ${pair.unitB}, επομένως ισχύει ${valA} ${pair.unitA} ${correctSym} ${formatNumber(valB)} ${pair.unitB}.`
  };
}

// Δημιουργία των 8 Ερωτήσεων
function generateQuestions() {
  const q1 = makeBigToSmallQuestion();
  const q2 = makeBigToSmallQuestion(q1);

  const q3 = makeSmallToBigQuestion();
  const q4 = makeSmallToBigQuestion(q3);

  const q5 = makeSuitableUnitQuestion();
  const q6 = makeSuitableUnitQuestion(q5);

  const q7 = makeComparisonQuestion();
  const q8 = makeComparisonQuestion(q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function BarosAskPage() {
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
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Q1 & Q2: Μεγάλη ➔ Μικρή Μονάδα (Input)
  const renderBigToSmall = (qKey, qData, numLabel) => {
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
            Μετάτρεψε τη μονάδα μέτρησης βάρους: <span className="text-emerald-600 font-mono font-black text-lg sm:text-xl">{qData.val} {qData.from}</span> ＝ <span className="text-emerald-600 font-mono font-black text-lg sm:text-xl">? {qData.to}</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{qData.val} {qData.from}</span>
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
              className="w-32 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-emerald-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
            />
            <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">{qData.to}</span>
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
                Η σωστή απάντηση είναι <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)} {qData.to}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Μικρή ➔ Μεγάλη Μονάδα (Input)
  const renderSmallToBig = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
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
            Μετάτρεψε τη μονάδα μέτρησης βάρους: <span className="text-teal-600 font-mono font-black text-lg sm:text-xl">{formatNumber(qData.val)} {qData.from}</span> ＝ <span className="text-teal-600 font-mono font-black text-lg sm:text-xl">? {qData.to}</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{formatNumber(qData.val)} {qData.from}</span>
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
              className="w-32 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-teal-900 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
            />
            <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">{qData.to}</span>
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
                Η σωστή απάντηση είναι <span className="font-mono font-bold text-rose-900">{qData.correct} {qData.to}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Κατάλληλη Μονάδα (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
  const renderSuitableUnit = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-sky-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            Με ποια μονάδα μέτρησης είναι πιο κατάλληλο να εκφράσουμε <span className="text-sky-600 font-extrabold">{qData.qText}</span>;
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
                    ? 'border-sky-600 bg-sky-50/80 font-bold text-sky-950 shadow-sm'
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
                  className="w-4 h-4 text-sky-600 focus:ring-sky-500 shrink-0"
                />
                <span className="leading-snug">{opt.text}</span>
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
                Η πλέον κατάλληλη μονάδα μέτρησης είναι: <strong className="font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Σύγκριση Βαρών (Buttons)
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
            <span>{qData.valA} {qData.unitA}</span>

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

            <span>{formatNumber(qData.valB)} {qData.unitB}</span>
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
                Η ορθή σχέση είναι <span className="font-mono font-bold text-rose-900">{qData.valA} {qData.unitA} {qData.correct} {formatNumber(qData.valB)} {qData.unitB}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Μέτρηση Βάρους & Μετατροπές | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στις μονάδες βάρους: μετατροπές τόνων, κιλών και γραμμαρίων, επιλογή κατάλληλης μονάδας και σύγκριση."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/9-baros"
          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Μέτρηση Βάρους
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», οι τιμές και τα ερωτήματα ανανεώνονται αυτόματα από τη δεξαμενή!
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
          {renderBigToSmall('q1', questions.q1, 1)}
          {renderBigToSmall('q2', questions.q2, 2)}

          {renderSmallToBig('q3', questions.q3, 3)}
          {renderSmallToBig('q4', questions.q4, 4)}

          {renderSuitableUnit('q5', questions.q5, 5)}
          {renderSuitableUnit('q6', questions.q6, 6)}

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

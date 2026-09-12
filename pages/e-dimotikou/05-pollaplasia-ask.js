// pages/e-dimotikou/05-pollaplasia-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εύρεση Πολλαπλασίου σε Συγκεκριμένο Διάστημα (Input)
function makeRangeMultipleQuestion(isUpperBound = false) {
  if (!isUpperBound) {
    // q1: Το αμέσως μεγαλύτερο πολλαπλάσιο του k μετά από έναν αριθμό N
    const base = [6, 7, 8, 9, 12][getRandomInt(0, 4)];
    const factor = getRandomInt(8, 15);
    const targetThreshold = base * factor - getRandomInt(2, base - 1);
    const correctMultiple = base * factor;

    return {
      type: 'input',
      correct: correctMultiple,
      unit: 'αριθμος',
      prompt: `Ποιο είναι το αμέσως επόμενο (μικρότερο δυνατό) πολλαπλάσιο του ${base} που είναι μεγαλύτερο από το ${targetThreshold};`,
      explanation: `Διαιρούμε το ${targetThreshold} με το ${base}: ${targetThreshold} ： ${base} ＝ ${factor - 1} με υπόλοιπο ${targetThreshold % base}. Το αμέσως επόμενο πολλαπλάσιο είναι το ${base} · ${factor} ＝ ${correctMultiple}.`
    };
  } else {
    // q2: Το αμέσως μικρότερο πολλαπλάσιο του k πριν από έναν αριθμό N
    const base = [7, 8, 9, 11, 15][getRandomInt(0, 4)];
    const factor = getRandomInt(10, 18);
    const targetThreshold = base * factor + getRandomInt(2, base - 1);
    const correctMultiple = base * factor;

    return {
      type: 'input',
      correct: correctMultiple,
      unit: 'αριθμος',
      prompt: `Ποιο είναι το μεγαλύτερο πολλαπλάσιο του ${base} που είναι μικρότερο από το ${targetThreshold};`,
      explanation: `Εκτελούμε τη διαίρεση ${targetThreshold} ： ${base} ＝ ${factor} με υπόλοιπο ${targetThreshold % base}. Άρα το μεγαλύτερο πολλαπλάσιο πριν το ${targetThreshold} είναι το ${base} · ${factor} ＝ ${correctMultiple}.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Έλεγχος & Αναγνώριση Πολλαπλασίων (MCQ)
function makeMultipleCheckQuestion(isNotMultiple = false) {
  if (!isNotMultiple) {
    // q3: Ποιος από τους 4 αριθμούς είναι πολλαπλάσιο του base
    const base = [6, 7, 8, 9, 12][getRandomInt(0, 4)];
    const correctFactor = getRandomInt(12, 25);
    const correctVal = base * correctFactor;

    const distractors = [
      correctVal + 1,
      correctVal - 2,
      correctVal + base - 1
    ].filter((v) => v % base !== 0);

    const options = shuffleArray([correctVal, ...distractors.slice(0, 3)]).map(String);

    return {
      type: 'mcq',
      correct: String(correctVal),
      options,
      prompt: `Ποιος από τους παρακάτω αριθμούς είναι πολλαπλάσιο του ${base};`,
      explanation: `Ο αριθμός ${correctVal} διαιρείται ακριβώς με το ${base}: ${correctVal} ： ${base} ＝ ${correctFactor} (υπόλοιπο 0). Οι υπόλοιποι αριθμοί αφήνουν υπόλοιπο διάφορο του μηδενός.`
    };
  } else {
    // q4: Ποιος από τους 4 αριθμούς ΔΕΝ είναι πολλαπλάσιο του base
    const base = [4, 6, 7, 8, 9][getRandomInt(0, 4)];
    const f1 = getRandomInt(10, 14);
    const f2 = getRandomInt(15, 18);
    const f3 = getRandomInt(19, 23);

    const m1 = base * f1;
    const m2 = base * f2;
    const m3 = base * f3;
    const fake = base * getRandomInt(11, 16) + [1, 2, 3][getRandomInt(0, 2)];

    const options = shuffleArray([m1, m2, m3, fake]).map(String);

    return {
      type: 'mcq',
      correct: String(fake),
      options,
      prompt: `Ποιος από τους παρακάτω αριθμούς ΔΕΝ είναι πολλαπλάσιο του ${base};`,
      explanation: `Ο αριθμός ${fake} δεν διαιρείται ακριβώς με το ${base}, καθώς η διαίρεση ${fake} ： ${base} αφήνει υπόλοιπο ${fake % base}. Όλοι οι άλλοι αριθμοί είναι πολλαπλάσια του ${base}.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Κοινά Πολλαπλάσια & Συμπλήρωση Σειράς (Input & MCQ)
function makeCommonMultipleQuestion(isSequence = false) {
  if (!isSequence) {
    // q5: Εύρεση του μικρότερου κοινού θετικού πολλαπλασίου δύο αριθμών (Input)
    const pairs = [
      [3, 4, 12], [4, 6, 12], [6, 8, 24], [4, 5, 20], [6, 9, 18], [8, 12, 24], [5, 6, 30]
    ];
    const [a, b, lcmVal] = pairs[getRandomInt(0, pairs.length - 1)];

    return {
      type: 'input',
      correct: lcmVal,
      unit: 'αριθμος',
      prompt: `Ποιος είναι ο μικρότερος θετικός αριθμός (μεγαλύτερος από το 0) που είναι ταυτόχρονα πολλαπλάσιο του ${a} και του ${b};`,
      explanation: `Γράφουμε τα πρώτα θετικά πολλαπλάσια: Π(${a}) ＝ {${a}, ${a * 2}, ${a * 3}, ...} και Π(${b}) ＝ {${b}, ${b * 2}, ${b * 3}, ...}. Το μικρότερο κοινό πολλαπλάσιο τους είναι το ${lcmVal}.`
    };
  } else {
    // q6: Συμπλήρωση άγνωστου όρου σε αριθμητική ακολουθία πολλαπλασίων (MCQ)
    const base = [7, 8, 9, 12, 14][getRandomInt(0, 4)];
    const startFactor = getRandomInt(3, 7);
    const missingIndex = getRandomInt(1, 3); // Ποιος όρος λείπει
    const seqTerms = [0, 1, 2, 3, 4].map((i) => base * (startFactor + i));
    const correctVal = seqTerms[missingIndex];

    const distractors = [
      correctVal + base * 2,
      correctVal - 1,
      correctVal + 1
    ].filter((v) => v !== correctVal);

    const options = shuffleArray([correctVal, ...distractors.slice(0, 3)]).map(String);

    const maskedTermsStr = seqTerms
      .map((term, i) => (i === missingIndex ? '...' : term))
      .join(', ');

    return {
      type: 'mcq',
      correct: String(correctVal),
      options,
      prompt: `Παρατήρησε την παρακάτω σειρά διαδοχικών πολλαπλασίων του ${base}: ${maskedTermsStr}. Ποιος αριθμός λείπει στη θέση των αποσιωπητικών;`,
      explanation: `Σε μια σειρά διαδοχικών πολλαπλασίων του ${base}, κάθε επόμενος όρος προκύπτει προσθέτοντας ${base}. Ο όρος που λείπει είναι ο ${correctVal}.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Περιοδικότητας & Ομαδοποίησης (MCQ & Input)
function makeMultipleWordProblem(isInput = false) {
  if (!isInput) {
    // q7: Πρόβλημα συγχρονισμού φαναριών / αναλαμπών (MCQ)
    const pairs = [
      { t1: 6, t2: 8, correct: 24 },
      { t1: 4, t2: 10, correct: 20 },
      { t1: 9, t2: 12, correct: 36 },
      { t1: 8, t2: 10, correct: 40 }
    ];
    const item = pairs[getRandomInt(0, pairs.length - 1)];

    const distractors = [
      item.correct + item.t1,
      item.correct - item.t2,
      item.t1 * item.t2
    ].filter((v) => v !== item.correct && v > 0);

    const options = shuffleArray([item.correct, ...distractors.slice(0, 3)]).map((v) => `${v} s`);

    return {
      type: 'mcq',
      correct: `${item.correct} s`,
      options,
      prompt: `Ένας φωτεινός φάρος αναβοσβήνει κάθε ${item.t1} s και ένας δεύτερος φάρος κάθε ${item.t2} s. Αν αναβοσβήσουν ταυτόχρονα τώρα, μετά από πόσα δευτερόλεπτα (s) θα ξανασυναντηθούν για πρώτη φορά;`,
      explanation: `Αναζητούμε το μικρότερο κοινό πολλαπλάσιο των αριθμών ${item.t1} και ${item.t2}. Τα πολλαπλάσια του ${item.t1} είναι {${item.t1}, ${item.t1 * 2}, ...} και του ${item.t2} είναι {${item.t2}, ${item.t2 * 2}, ...}. Το πρώτο κοινό τους σημείο είναι στα ${item.correct} s.`
    };
  } else {
    // q8: Πρόβλημα ομαδοποίησης αντικειμένων (Input)
    const packSize = [6, 8, 9, 12][getRandomInt(0, 3)];
    const targetMin = getRandomInt(65, 95);
    // Βρίσκουμε το πρώτο πολλαπλάσιο >= targetMin
    const neededPacks = Math.ceil(targetMin / packSize);
    const totalItems = neededPacks * packSize;

    return {
      type: 'input',
      correct: totalItems,
      unit: 'τεμαχια',
      prompt: `Ένας ζαχαροπλάστης συσκευάζει σοκολατάκια σε κουτιά των ${packSize} τεμαχίων. Χρειάζεται να ετοιμάσει τουλάχιστον ${targetMin} σοκολατάκια. Ποιος είναι ο ελάχιστος ακριβής αριθμός σοκολατάκια που πρέπει να φτιάξει ώστε όλα τα κουτιά να είναι απολύτως γεμάτα;`,
      explanation: `Ο συνολικός αριθμός πρέπει να είναι πολλαπλάσιο του ${packSize} και τουλάχιστον ίσος με ${targetMin}. Διαιρούμε ${targetMin} ： ${packSize} ＝ ${Math.floor(targetMin / packSize)} με υπόλοιπο ${targetMin % packSize}. Άρα απαιτούνται ${neededPacks} πλήρη κουτιά, δηλαδή ${neededPacks} · ${packSize} ＝ ${totalItems} τεμάχια.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeRangeMultipleQuestion(false),
    q2: makeRangeMultipleQuestion(true),
    q3: makeMultipleCheckQuestion(false),
    q4: makeMultipleCheckQuestion(true),
    q5: makeCommonMultipleQuestion(false),
    q6: makeCommonMultipleQuestion(true),
    q7: makeMultipleWordProblem(false),
    q8: makeMultipleWordProblem(true)
  };
}

export default function PollaplasiaAskPage() {
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
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (parseInt(answers.q8, 10) === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Component για Ερωτήσεις MCQ
  const renderMCQ = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span
            className={`${accentColor} text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}
          >
            {numLabel}
          </span>
          <div className="space-y-1">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400">
              {badgeTitle}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.prompt}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11 2xl:pl-13">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition select-none text-sm sm:text-base 2xl:text-lg font-mono font-bold ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${qKey}-opt-${idx}`}
                  name={qKey}
                  value={opt}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt)}
                  disabled={submitted}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0"
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </p>
            ) : (
              <p className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                Η σωστή απάντηση είναι: <strong className="font-bold text-rose-950">{qData.correct}</strong>. {qData.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Component για Ερωτήσεις Input
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span
            className={`${accentColor} text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}
          >
            {numLabel}
          </span>
          <div className="space-y-1">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400">
              {badgeTitle}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.prompt}
            </h3>
          </div>
        </div>

        <div className="sm:pl-11 2xl:pl-13 space-y-3">
          <div className="flex items-center gap-3">
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
              className="w-32 sm:w-40 h-12 sm:h-14 p-3 text-center rounded-2xl border-2 border-slate-300 font-mono text-lg sm:text-xl 2xl:text-2xl font-black focus:border-indigo-600 focus:outline-none bg-slate-50/60 focus:bg-white text-slate-900 disabled:opacity-75"
            />
            <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-600">
              {qData.unit}
            </span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </p>
            ) : (
              <p className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                Η σωστή απάντηση είναι: <strong className="font-bold text-rose-950">{qData.correct} {qData.unit}</strong>. {qData.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Πολλαπλάσια ενός Αριθμού - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα πολλαπλάσια: εύρεση ορίων, έλεγχος διαιρετότητας, κοινά πολλαπλάσια και προβλήματα."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/05-pollaplasia"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K / 4K και responsive για κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8">
        
        {/* HEADER BANNER - Ίδια χρωματική παλέτα με τη θεωρία */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Πολλαπλάσια ενός Αριθμού
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ & PB SAFE AREA */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderInput('q1', questions.q1, 1, 'ΕΠΟΜΕΝΟ ΠΟΛΛΑΠΛΑΣΙΟ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΠΡΟΗΓΟΥΜΕΝΟ ΠΟΛΛΑΠΛΑΣΙΟ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΕΛΕΓΧΟΣ ΠΟΛΛΑΠΛΑΣΙΟΥ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΕΝΤΟΠΙΣΜΟΣ ΜΗ ΠΟΛΛΑΠΛΑΣΙΟΥ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΜΙΚΡΟΤΕΡΟ ΚΟΙΝΟ ΠΟΛΛΑΠΛΑΣΙΟ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΣΥΜΠΛΗΡΩΣΗ ΣΕΙΡΑΣ ΠΟΛΛΑΠΛΑΣΙΩΝ', 'bg-teal-600')}

          {renderMCQ('q7', questions.q7, 7, 'ΠΡΟΒΛΗΜΑ ΠΕΡΙΟΔΙΚΟΤΗΤΑΣ', 'bg-purple-600')}
          {renderInput('q8', questions.q8, 8, 'ΠΡΟΒΛΗΜΑ ΟΜΑΔΟΠΟΙΗΣΗΣ', 'bg-purple-600')}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 Έλεγχος Απαντήσεων
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5 z-50">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                Επιτυχία: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 2xl:px-7 2xl:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm 2xl:text-base flex items-center gap-2 active:scale-95"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

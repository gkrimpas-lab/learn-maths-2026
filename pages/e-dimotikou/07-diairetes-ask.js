// pages/e-dimotikou/07-diairetes-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDivisors(num) {
  const divisors = [];
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) {
      divisors.push(i);
    }
  }
  return divisors;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Πλήθος Διαιρετών & Συμπλήρωση Συνόλου (Input)
function makeDivisorCountAndMissingQuestion(isMissing = false) {
  if (!isMissing) {
    // q1: Πόσους διαιρέτες έχει συνολικά ένας αριθμός
    const candidates = [12, 16, 18, 20, 24, 28, 30, 36, 40, 48];
    const n = candidates[getRandomInt(0, candidates.length - 1)];
    const divs = getDivisors(n);

    return {
      type: 'input',
      correct: divs.length,
      unit: 'διαιρετες',
      prompt: `Πόσους διαιρέτες έχει συνολικά ο αριθμός ${n}; (Υπολόγισε το πλήθος των στοιχείων του συνόλου Δ(${n}))`,
      explanation: `Οι διαιρέτες του ${n} είναι: Δ(${n}) ＝ {${divs.join(', ')}}. Το σύνολο περιέχει ακριβώς ${divs.length} διαιρέτες.`
    };
  } else {
    // q2: Συμπλήρωση διαιρέτη που λείπει από ταξινομημένο σύνολο
    const candidates = [
      { n: 24, divs: [1, 2, 3, 4, 6, 8, 12, 24] },
      { n: 30, divs: [1, 2, 3, 5, 6, 10, 15, 30] },
      { n: 36, divs: [1, 2, 3, 4, 6, 9, 12, 18, 36] },
      { n: 40, divs: [1, 2, 4, 5, 8, 10, 20, 40] },
      { n: 42, divs: [1, 2, 3, 6, 7, 14, 21, 42] }
    ];
    const item = candidates[getRandomInt(0, candidates.length - 1)];
    const missingIndex = getRandomInt(2, item.divs.length - 2);
    const correctMissing = item.divs[missingIndex];

    const maskedDivsStr = item.divs
      .map((d, idx) => (idx === missingIndex ? 'x' : d))
      .join(', ');

    return {
      type: 'input',
      correct: correctMissing,
      unit: 'τιμη του x',
      prompt: `Στο σύνολο των διαιρετών του ${item.n}, Δ(${item.n}) ＝ {${maskedDivsStr}}, ποιος αριθμός είναι το x;`,
      explanation: `Ο αριθμός που λείπει είναι το ${correctMissing}, γιατί ${correctMissing} · ${item.n / correctMissing} ＝ ${item.n} και ${item.n} ： ${correctMissing} ＝ ${item.n / correctMissing} (υπόλοιπο 0).`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Έλεγχος Διαιρέτη (MCQ)
function makeDivisorCheckQuestion(isNotDivisor = false) {
  if (!isNotDivisor) {
    // q3: Ποιος από τους 4 αριθμούς είναι διαιρέτης του N
    const baseList = [48, 54, 56, 60, 72, 84, 90];
    const n = baseList[getRandomInt(0, baseList.length - 1)];
    const allDivs = getDivisors(n).filter((d) => d > 2 && d < n);
    const correctD = allDivs[getRandomInt(0, allDivs.length - 1)];

    const nonDivs = [];
    let candidate = 5;
    while (nonDivs.length < 3) {
      if (n % candidate !== 0 && candidate < n) {
        nonDivs.push(candidate);
      }
      candidate += getRandomInt(1, 3);
    }

    const options = shuffleArray([correctD, ...nonDivs.slice(0, 3)]).map(String);

    return {
      type: 'mcq',
      correct: String(correctD),
      options,
      prompt: `Ποιος από τους παρακάτω αριθμούς είναι διαιρέτης του ${n};`,
      explanation: `Ο αριθμός ${correctD} είναι διαιρέτης του ${n}, γιατί η διαίρεση ${n} ： ${correctD} ＝ ${n / correctD} είναι τέλεια (υπόλοιπο 0). Οι υπόλοιποι αριθμοί αφήνουν υπόλοιπο μεγαλύτερο του μηδενός.`
    };
  } else {
    // q4: Ποιος από τους 4 αριθμούς ΔΕΝ είναι διαιρέτης του N
    const baseList = [36, 40, 48, 60, 72, 80];
    const n = baseList[getRandomInt(0, baseList.length - 1)];
    const allDivs = getDivisors(n).filter((d) => d > 2 && d < n);
    const chosenDivs = shuffleArray(allDivs).slice(0, 3);

    // Εύρεση αριθμού που δεν είναι διαιρέτης
    let fake = [7, 9, 11, 13, 14, 15, 17].find((x) => n % x !== 0) || 7;

    const options = shuffleArray([...chosenDivs, fake]).map(String);

    return {
      type: 'mcq',
      correct: String(fake),
      options,
      prompt: `Ποιος από τους παρακάτω αριθμούς ΔΕΝ είναι διαιρέτης του ${n};`,
      explanation: `Ο αριθμός ${fake} δεν διαιρεί ακριβώς το ${n}, αφού η διαίρεση ${n} ： ${fake} αφήνει υπόλοιπο ${n % fake}. Όλοι οι άλλοι αριθμοί διαιρούν ακριβώς το ${n}.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Πρώτοι & Σύνθετοι Αριθμοί (MCQ)
function makePrimeCompositeQuestion(findComposite = false) {
  if (!findComposite) {
    // q5: Εντοπισμός Πρώτου Αριθμού
    const primes = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const composites = [15, 21, 25, 27, 33, 35, 39, 45, 49];

    const correctPrime = primes[getRandomInt(0, primes.length - 1)];
    const chosenComposites = shuffleArray(composites).slice(0, 3);
    const options = shuffleArray([correctPrime, ...chosenComposites]).map(String);

    return {
      type: 'mcq',
      correct: String(correctPrime),
      options,
      prompt: `Ποιος από τους παρακάτω αριθμούς είναι ΠΡΩΤΟΣ αριθμός;`,
      explanation: `Ο αριθμός ${correctPrime} είναι πρώτος, γιατί έχει ακριβώς δύο διαιρέτες: το 1 και τον εαυτό του ({1, ${correctPrime}}). Οι υπόλοιποι είναι σύνθετοι αριθμοί.`
    };
  } else {
    // q6: Εντοπισμός Σύνθετου Αριθμού ανάμεσα σε πρώτους
    const primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
    const composites = [27, 33, 39, 49, 51, 57];

    const correctComp = composites[getRandomInt(0, composites.length - 1)];
    const chosenPrimes = shuffleArray(primes).slice(0, 3);
    const options = shuffleArray([correctComp, ...chosenPrimes]).map(String);

    const divs = getDivisors(correctComp);

    return {
      type: 'mcq',
      correct: String(correctComp),
      options,
      prompt: `Ποιος από τους παρακάτω αριθμούς είναι ΣΥΝΘΕΤΟΣ αριθμός;`,
      explanation: `Ο αριθμός ${correctComp} είναι σύνθετος, γιατί έχει περισσότερους από δύο διαιρέτες: Δ(${correctComp}) ＝ {${divs.join(', ')}}. Οι υπόλοιποι αριθμοί είναι πρώτοι.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Ισοκατανομής & Συσκευασίας (Input & MCQ)
function makeDistributionProblem(isMCQ = false) {
  if (!isMCQ) {
    // q7: Μοίρασμα μαθητών σε ισάριθμες ομάδες (Input)
    const cases = [
      { total: 36, groupSize: 4, correctTeams: 9 },
      { total: 42, groupSize: 6, correctTeams: 7 },
      { total: 48, groupSize: 8, correctTeams: 6 },
      { total: 40, groupSize: 5, correctTeams: 8 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    return {
      type: 'input',
      correct: c.correctTeams,
      unit: 'ομαδες',
      prompt: `Σε μια εκδρομή συμμετέχουν ${c.total} μαθητές. Ο γυμναστής θέλει να τους χωρίσει σε ισάριθμες ομάδες των ${c.groupSize} παιδιών χωρίς να περισσέψει κανένας. Πόσες ομάδες θα δημιουργηθούν;`,
      explanation: `Επειδή το ${c.groupSize} είναι διαιρέτης του ${c.total}, η διαίρεση είναι τέλεια: ${c.total} ： ${c.groupSize} ＝ ${c.correctTeams} ομάδες (υπόλοιπο 0).`
    };
  } else {
    // q8: Ποια επιλογή συσκευασίας ΔΕΝ είναι δυνατή (MCQ)
    const items = [
      { total: 36, valid: [3, 4, 6], invalid: 5 },
      { total: 40, valid: [4, 5, 8], invalid: 6 },
      { total: 48, valid: [4, 6, 8], invalid: 7 },
      { total: 60, valid: [5, 6, 10], invalid: 8 }
    ];
    const c = items[getRandomInt(0, items.length - 1)];

    const options = shuffleArray([...c.valid, c.invalid]).map((v) => `Κουτιά των ${v}`);

    return {
      type: 'mcq',
      correct: `Κουτιά των ${c.invalid}`,
      options,
      prompt: `Ένα κατάστημα έχει ${c.total} γυάλινα ποτήρια. Με ποιον από τους παρακάτω τρόπους συσκευασίας ΔΕΝ μπορεί να τα τοποθετήσει σε ισάριθμα κουτιά χωρίς να περισσέψει κανένα ποτήρι;`,
      explanation: `Το ${c.invalid} δεν είναι διαιρέτης του ${c.total}, καθώς η διαίρεση ${c.total} ： ${c.invalid} αφήνει υπόλοιπο ${c.total % c.invalid}. Οι υπόλοιποι αριθμοί είναι διαιρέτες του ${c.total}.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeDivisorCountAndMissingQuestion(false),
    q2: makeDivisorCountAndMissingQuestion(true),
    q3: makeDivisorCheckQuestion(false),
    q4: makeDivisorCheckQuestion(true),
    q5: makePrimeCompositeQuestion(false),
    q6: makePrimeCompositeQuestion(true),
    q7: makeDistributionProblem(false),
    q8: makeDistributionProblem(true)
  };
}

export default function DiairetesAskPage() {
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
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (parseInt(answers.q7, 10) === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

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
      title="Ασκήσεις: Διαιρέτες ενός Αριθμού - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στους διαιρέτες: πλήθος διαιρετών, αναγνώριση πρώτων και σύνθετων αριθμών, προβλήματα ισοκατανομής."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/07-diairetes"
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
              📝 Ασκήσεις: Διαιρέτες ενός Αριθμού
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
          {renderInput('q1', questions.q1, 1, 'ΠΛΗΘΟΣ ΔΙΑΙΡΕΤΩΝ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΣΥΜΠΛΗΡΩΣΗ ΣΥΝΟΛΟΥ ΔΙΑΙΡΕΤΩΝ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΕΛΕΓΧΟΣ ΔΙΑΙΡΕΤΗ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΕΝΤΟΠΙΣΜΟΣ ΜΗ ΔΙΑΙΡΕΤΗ', 'bg-indigo-600')}

          {renderMCQ('q5', questions.q5, 5, 'ΑΝΑΓΝΩΡΙΣΗ ΠΡΩΤΟΥ ΑΡΙΘΜΟΥ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΑΝΑΓΝΩΡΙΣΗ ΣΥΝΘΕΤΟΥ ΑΡΙΘΜΟΥ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΠΡΟΒΛΗΜΑ ΙΣΟΚΑΤΑΝΟΜΗΣ ΟΜΑΔΩΝ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΠΡΟΒΛΗΜΑ ΣΥΣΚΕΥΑΣΙΑΣ ΧΩΡΙΣ ΥΠΟΛΟΙΠΟ', 'bg-purple-600')}

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

// pages/e-dimotikou/08-mkd-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function gcdThree(a, b, c) {
  return gcd(gcd(a, b), c);
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Υπολογισμός ΜΚΔ 2 Αριθμών (Input)
function makeGcdTwoQuestion(isDivisibleCase = false) {
  if (!isDivisibleCase) {
    // q1: Κανονικό ζεύγος αριθμών με ΜΚΔ > 2
    const pairs = [
      [24, 36], [28, 42], [30, 45], [32, 48], [36, 54], [40, 60], [42, 56], [48, 72]
    ];
    const [a, b] = pairs[getRandomInt(0, pairs.length - 1)];
    const correctVal = gcd(a, b);

    return {
      type: 'input',
      correct: correctVal,
      unit: 'αριθμος',
      prompt: `Υπολόγισε τον Μέγιστο Κοινό Διαιρέτη των αριθμών ${a} και ${b}, δηλαδή τον ΜΚΔ(${a}, ${b}):`,
      explanation: `Οι κοινοί διαιρέτες των αριθμών ${a} και ${b} έχουν ως μεγαλύτερο στοιχείο το ${correctVal}. Επομένως ΜΚΔ(${a}, ${b}) ＝ ${correctVal}.`
    };
  } else {
    // q2: Ειδική περίπτωση (ο μικρότερος διαιρεί ακριβώς τον μεγαλύτερο)
    const small = [6, 8, 9, 12, 14, 15][getRandomInt(0, 5)];
    const factor = getRandomInt(3, 5);
    const big = small * factor;
    const correctVal = small;

    return {
      type: 'input',
      correct: correctVal,
      unit: 'αριθμος',
      prompt: `Βρες τον ΜΚΔ(${small}, ${big}):`,
      explanation: `Επειδή ο αριθμός ${big} διαιρείται ακριβώς με το ${small} (${big} ： ${small} ＝ ${factor}), ο Μέγιστος Κοινός Διαιρέτης τους είναι άμεσα ο ίδιος ο μικρότερος αριθμός: ΜΚΔ(${small}, ${big}) ＝ ${correctVal}.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Υπολογισμός ΜΚΔ 3 Αριθμών & Πρώτοι Μεταξύ τους (MCQ)
function makeGcdThreeQuestion(isCoprime = false) {
  if (!isCoprime) {
    // q3: ΜΚΔ 3 αριθμών με ουσιαστικό κοινό διαιρέτη
    const triplets = [
      [18, 24, 36, 6],
      [24, 36, 48, 12],
      [20, 30, 50, 10],
      [16, 24, 40, 8],
      [28, 42, 70, 14],
      [30, 45, 60, 15]
    ];
    const [a, b, c, correctVal] = triplets[getRandomInt(0, triplets.length - 1)];

    const distractors = [
      correctVal / 2,
      correctVal === 12 ? 8 : correctVal + 2,
      correctVal === 6 ? 4 : correctVal - 2,
      correctVal * 2
    ].filter((v) => v !== correctVal && v > 1);

    const options = shuffleArray([correctVal, ...distractors.slice(0, 3)]).map(String);

    return {
      type: 'mcq',
      correct: String(correctVal),
      options,
      prompt: `Ποιος είναι ο Μέγιστος Κοινός Διαιρέτης των αριθμών ${a}, ${b} και ${c}, δηλαδή ο ΜΚΔ(${a}, ${b}, ${c});`,
      explanation: `Βρίσκουμε πρώτα τον ΜΚΔ των δύο πρώτων αριθμών: ΜΚΔ(${a}, ${b}) ＝ ${gcd(a, b)}. Έπειτα βρίσκουμε τον ΜΚΔ του αποτελέσματος με τον τρίτο αριθμό: ΜΚΔ(${gcd(a, b)}, ${c}) ＝ ${correctVal}.`
    };
  } else {
    // q4: Εντοπισμός ζεύγους αριθμών που είναι πρώτοι μεταξύ τους (ΜΚΔ = 1)
    const pairs = [
      { text: '14 και 25', isCoprime: true, expl: 'Ο αριθμός 14 έχει διαιρέτες {1, 2, 7, 14} και το 25 έχει {1, 5, 25}. Ο μόνος κοινός διαιρέτης είναι το 1.' },
      { text: '18 και 27', isCoprime: false },
      { text: '15 και 35', isCoprime: false },
      { text: '24 και 32', isCoprime: false }
    ];

    const correctPair = pairs[0];
    const options = shuffleArray(pairs.map((p) => p.text));

    return {
      type: 'mcq',
      correct: correctPair.text,
      options,
      prompt: `Ποιο από τα παρακάτω ζευγάρια αριθμών αποτελείται από αριθμούς ΠΡΩΤΟΥΣ ΜΕΤΑΞΥ ΤΟΥΣ (δηλαδή έχουν ΜΚΔ ＝ 1);`,
      explanation: `Το ζεύγος ${correctPair.text} είναι πρώτοι μεταξύ τους, διότι ο μοναδικός κοινός διαιρέτης τους είναι το 1 (ΜΚΔ ＝ 1). Στα υπόλοιπα ζευγάρια υπάρχει κοινός διαιρέτης μεγαλύτερος του 1.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Εφαρμογή ΜΚΔ στην Απλοποίηση Κλασμάτων (Input & MCQ)
function makeFractionSimplificationQuestion(isMCQ = false) {
  const irreducibleBases = [
    [2, 3], [3, 4], [3, 5], [4, 7], [5, 6], [5, 8], [7, 9], [7, 12]
  ];
  const [irrNum, irrDen] = irreducibleBases[getRandomInt(0, irreducibleBases.length - 1)];
  const divisor = [6, 8, 9, 12, 14, 16][getRandomInt(0, 5)];
  const bigNum = irrNum * divisor;
  const bigDen = irrDen * divisor;

  if (!isMCQ) {
    // q5: Εύρεση του διαιρέτη που κάνει το κλάσμα ανάγωγο (δηλαδή ο ΜΚΔ)
    return {
      type: 'input',
      correct: divisor,
      unit: 'αριθμος ( ΜΚΔ )',
      prompt: `Με ποιον αριθμό πρέπει να διαιρέσουμε ταυτόχρονα τον αριθμητή και τον παρονομαστή του κλάσματος ${bigNum}/${bigDen} ώστε να μετατραπεί σε ανάγωγο με ένα μόνο βήμα;`,
      explanation: `Για να γίνει ένα κλάσμα ανάγωγο με μία μόνο διαίρεση, διαιρούμε και τους δύο όρους με τον Μέγιστο Κοινό Διαιρέτη τους: ΜΚΔ(${bigNum}, ${bigDen}) ＝ ${divisor}.`
    };
  } else {
    // q6: MCQ για το τελικό ανάγωγο κλάσμα
    const correctFrac = `${irrNum}/${irrDen}`;
    const distractors = [
      `${irrNum * 2}/${irrDen * 2}`,
      `${irrNum + 1}/${irrDen}`,
      `${irrNum}/${irrDen + 1}`
    ].filter((f) => f !== correctFrac);

    const options = shuffleArray([correctFrac, ...distractors.slice(0, 3)]);

    return {
      type: 'mcq',
      correct: correctFrac,
      options,
      prompt: `Απλοποιώντας πλήρως το κλάσμα ${bigNum}/${bigDen} με τη βοήθεια του ΜΚΔ (${divisor}), ποιο ανάγωγο κλάσμα προκύπτει;`,
      explanation: `Διαιρούμε και τους δύο όρους με τον ΜΚΔ(${bigNum}, ${bigDen}) ＝ ${divisor}: (${bigNum} ： ${divisor}) / (${bigDen} ： ${divisor}) ＝ ${correctFrac}.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Μέγιστης Ισοκατανομής (Input & MCQ)
function makeDistributionWordProblem(isInput = true) {
  if (isInput) {
    // q7: Μέγιστος αριθμός όμοιων πακέτων δώρων (Input)
    const multiplier = [6, 8, 12, 15][getRandomInt(0, 3)];
    const pensPerBag = getRandomInt(2, 4);
    const booksPerBag = pensPerBag + getRandomInt(1, 3);
    const totalPens = pensPerBag * multiplier;
    const totalBooks = booksPerBag * multiplier;
    const correctBags = gcd(totalPens, totalBooks); // = multiplier

    return {
      type: 'input',
      correct: correctBags,
      unit: 'πακετα',
      prompt: `Ένας βιβλιοπώλης έχει ${totalPens} μαρκαδόρους και ${totalBooks} τετράδια. Θέλει να φτιάξει όμοια πακέτα δώρων χωρίς να περισσέψει κανένα αντικείμενο. Ποιος είναι ο ΜΕΓΙΣΤΟΣ αριθμός πακέτων που μπορεί να δημιουργήσει;`,
      explanation: `Ο μέγιστος αριθμός όμοιων πακέτων ισούται με τον Μέγιστο Κοινό Διαιρέτη των δύο ποσοτήτων: ΜΚΔ(${totalPens}, ${totalBooks}) ＝ ${correctBags} πακέτα. Σε κάθε πακέτο θα μπουν ${totalPens / correctBags} μαρκαδόροι και ${totalBooks / correctBags} τετράδια.`
    };
  } else {
    // q8: Κοπή ξύλινων δοκών σε ίσα κομμάτια μέγιστου μήκους (MCQ)
    const cases = [
      { l1: 48, l2: 72, correctLen: 24 },
      { l1: 60, l2: 84, correctLen: 12 },
      { l1: 75, l2: 90, correctLen: 15 },
      { l1: 80, l2: 120, correctLen: 40 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    const distractors = [
      c.correctLen / 2,
      c.correctLen === 24 ? 16 : c.correctLen + 6,
      c.correctLen === 40 ? 30 : c.correctLen + 10
    ].filter((v) => v !== c.correctLen && v > 0);

    const options = shuffleArray([c.correctLen, ...distractors.slice(0, 3)]).map((v) => `${v} cm`);

    return {
      type: 'mcq',
      correct: `${c.correctLen} cm`,
      options,
      prompt: `Ένας μαραγκός έχει δύο ξύλινες δοκούς με μήκη ${c.l1} cm και ${c.l2} cm. Θέλει να τις κόψει σε ίσα κομμάτια που να έχουν το ΜΕΓΑΛΥΤΕΡΟ δυνατό μήκος, χωρίς να πάει χαμένο καθόλου ξύλο. Πόσο πρέπει να είναι το μήκος κάθε κομματιού;`,
      explanation: `Το μέγιστο κοινό μήκος κοπής ισούται με τον Μέγιστο Κοινό Διαιρέτη των μηκών: ΜΚΔ(${c.l1}, ${c.l2}) ＝ ${c.correctLen} cm.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeGcdTwoQuestion(false),
    q2: makeGcdTwoQuestion(true),
    q3: makeGcdThreeQuestion(false),
    q4: makeGcdThreeQuestion(true),
    q5: makeFractionSimplificationQuestion(false),
    q6: makeFractionSimplificationQuestion(true),
    q7: makeDistributionWordProblem(true),
    q8: makeDistributionWordProblem(false)
  };
}

export default function MkdAskPage() {
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
      title="Ασκήσεις: Μέγιστος Κοινός Διαιρέτης (ΜΚΔ) - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στον ΜΚΔ: υπολογισμός 2 και 3 αριθμών, πρώτοι μεταξύ τους, αναγωγή κλασμάτων και προβλήματα ισοκατανομής."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/08-mkd"
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
              📝 Ασκήσεις: Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)
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
          {renderInput('q1', questions.q1, 1, 'ΜΚΔ ΔΥΟ ΑΡΙΘΜΩΝ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΕΙΔΙΚΗ ΠΕΡΙΠΤΩΣΗ ΔΙΑΙΡΕΤΟΤΗΤΑΣ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΜΚΔ ΤΡΙΩΝ ΑΡΙΘΜΩΝ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ ΑΡΙΘΜΟΙ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΑΜΕΣΗ ΑΠΛΟΠΟΙΗΣΗ ΣΕ ΑΝΑΓΩΓΟ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΕΥΡΕΣΗ ΑΝΑΓΩΓΟΥ ΚΛΑΣΜΑΤΟΣ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΠΡΟΒΛΗΜΑ ΜΕΓΙΣΤΗΣ ΙΣΟΚΑΤΑΝΟΜΗΣ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΠΡΟΒΛΗΜΑ ΚΟΠΗΣ ΣΕ ΜΕΓΙΣΤΟ ΜΗΚΟΣ', 'bg-purple-600')}

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

// pages/e-dimotikou/02-isodinama-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εύρεση Άγνωστου Όρου (Αριθμητής ή Παρονομαστής)
function makeUnknownTermQuestion(findDenominator = false) {
  if (!findDenominator) {
    // q1: Εύρεση άγνωστου αριθμητή x (π.χ. 3/7 = x/35)
    const basePairs = [
      [2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [3, 7], [5, 6], [5, 8]
    ];
    const [num, den] = basePairs[getRandomInt(0, basePairs.length - 1)];
    const k = getRandomInt(3, 8);
    const targetDen = den * k;
    const correctX = num * k;

    return {
      type: 'input',
      correct: correctX,
      unit: 'τιμη του x',
      prompt: `Στην ισότητα ισοδύναμων κλασμάτων ${num}/${den} ＝ x/${targetDen}, ποιος αριθμός είναι το x;`,
      explanation: `Ο παρονομαστής ${den} πολλαπλασιάστηκε με το ${k} για να γίνει ${targetDen} (${den} · ${k} ＝ ${targetDen}). Επομένως και ο αριθμητής πολλαπλασιάζεται με το ${k}: ${num} · ${k} ＝ ${correctX}.`
    };
  } else {
    // q2: Εύρεση άγνωστου παρονομαστή y (π.χ. 4/9 = 28/y)
    const basePairs = [
      [3, 8], [4, 7], [5, 9], [7, 10], [6, 11], [5, 12], [4, 9], [7, 12]
    ];
    const [num, den] = basePairs[getRandomInt(0, basePairs.length - 1)];
    const m = getRandomInt(3, 7);
    const targetNum = num * m;
    const correctY = den * m;

    return {
      type: 'input',
      correct: correctY,
      unit: 'τιμη του y',
      prompt: `Στην ισότητα ισοδύναμων κλασμάτων ${num}/${den} ＝ ${targetNum}/y, ποιος αριθμός είναι το y;`,
      explanation: `Ο αριθμητής ${num} πολλαπλασιάστηκε με το ${m} για να γίνει ${targetNum} (${num} · ${m} ＝ ${targetNum}). Επομένως και ο παρονομαστής πολλαπλασιάζεται με το ${m}: ${den} · ${m} ＝ ${correctY}.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Απλοποίηση σε Ανάγωγο Κλάσμα (Input)
function makeIrreducibleFractionQuestion(askForNumerator = false) {
  // Επιλογή απλού ανάγωγου κλάσματος και πολλαπλασιαστή
  const irreduciblePairs = [
    [2, 3], [3, 4], [3, 5], [4, 7], [5, 6], [5, 8], [7, 9], [7, 12]
  ];
  const [irrNum, irrDen] = irreduciblePairs[getRandomInt(0, irreduciblePairs.length - 1)];
  const commonDivisor = [4, 6, 8, 9, 12][getRandomInt(0, 4)];
  const bigNum = irrNum * commonDivisor;
  const bigDen = irrDen * commonDivisor;

  if (askForNumerator) {
    // q3: Ζητείται ο νέος αριθμητής
    return {
      type: 'input',
      correct: irrNum,
      unit: 'αριθμητης',
      prompt: `Απλοποίησε πλήρως το κλάσμα ${bigNum}/${bigDen} ώστε να γίνει ανάγωγο. Ποιος είναι ο αριθμητής του ανάγωγου κλάσματος;`,
      explanation: `Ο Μέγιστος Κοινός Διαιρέτης του ${bigNum} και του ${bigDen} είναι το ${commonDivisor}. Διαιρούμε και τους δύο όρους διά ${commonDivisor}: ${bigNum} ： ${commonDivisor} ＝ ${irrNum} και ${bigDen} ： ${commonDivisor} ＝ ${irrDen}. Το ανάγωγο κλάσμα είναι ${irrNum}/${irrDen}, άρα ο αριθμητής είναι ${irrNum}.`
    };
  } else {
    // q4: Ζητείται ο νέος παρονομαστής
    return {
      type: 'input',
      correct: irrDen,
      unit: 'παρονομαστης',
      prompt: `Απλοποίησε πλήρως το κλάσμα ${bigNum}/${bigDen} ώστε να γίνει ανάγωγο. Ποιος είναι ο παρονομαστής του ανάγωγου κλάσματος;`,
      explanation: `Ο Μέγιστος Κοινός Διαιρέτης του ${bigNum} και του ${bigDen} είναι το ${commonDivisor}. Διαιρούμε και τους δύο όρους διά ${commonDivisor}: ${bigNum} ： ${commonDivisor} ＝ ${irrNum} και ${bigDen} ： ${commonDivisor} ＝ ${irrDen}. Το ανάγωγο κλάσμα είναι ${irrNum}/${irrDen}, άρα ο παρονομαστής είναι ${irrDen}.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Έλεγχος & Αναγνώριση Ισοδυναμίας (MCQ)
function makeEquivalenceCheckQuestion(isFindingNonEquivalent = false) {
  if (!isFindingNonEquivalent) {
    // q5: Ποιο από τα 4 κλάσματα είναι ισοδύναμο με το δοθέν
    const basePairs = [
      [3, 4], [2, 5], [5, 6], [3, 8], [4, 9]
    ];
    const [num, den] = basePairs[getRandomInt(0, basePairs.length - 1)];
    const correctMult = getRandomInt(3, 6);
    const correctFraction = `${num * correctMult}/${den * correctMult}`;

    // Δημιουργία 3 distractors
    const distractors = new Set();
    distractors.add(`${num * correctMult + 1}/${den * correctMult}`);
    distractors.add(`${num * correctMult}/${den * correctMult + 1}`);
    distractors.add(`${num * (correctMult + 1)}/${den * correctMult}`);

    while (distractors.size < 3) {
      distractors.add(`${num * 2 + 1}/${den * 2}`);
    }

    const options = shuffleArray([correctFraction, ...Array.from(distractors).slice(0, 3)]);

    return {
      type: 'mcq',
      correct: correctFraction,
      options,
      prompt: `Ποιο από τα παρακάτω κλάσματα είναι ισοδύναμο με το κλάσμα ${num}/${den};`,
      explanation: `Πολλαπλασιάζοντας τον αριθμητή και τον παρονομαστή του ${num}/${den} με το ${correctMult}, προκύπτει: (${num} · ${correctMult})/(${den} · ${correctMult}) ＝ ${correctFraction}. Επίσης τα χιαστί γινόμενα είναι ίσα.`
    };
  } else {
    // q6: Ποιο από τα 4 κλάσματα ΔΕΝ είναι ισοδύναμο με τα υπόλοιπα (MCQ)
    const basePairs = [
      [2, 3], [3, 5], [3, 4], [5, 8]
    ];
    const [num, den] = basePairs[getRandomInt(0, basePairs.length - 1)];

    const f1 = `${num * 2}/${den * 2}`;
    const f2 = `${num * 4}/${den * 4}`;
    const f3 = `${num * 5}/${den * 5}`;
    const fake = `${num * 3 + 1}/${den * 3}`; // Μη ισοδύναμο

    const options = shuffleArray([f1, f2, f3, fake]);

    return {
      type: 'mcq',
      correct: fake,
      options,
      prompt: `Ποιο από τα παρακάτω κλάσματα ΔΕΝ είναι ισοδύναμο με το ${num}/${den};`,
      explanation: `Τα κλάσματα ${f1}, ${f2} και ${f3} προκύπτουν με διαπλάτυνση του ${num}/${den} (πολλαπλασιασμός με 2, 4 και 5 αντίστοιχα). Το κλάσμα ${fake} δεν προκύπτει με πολλαπλασιασμό των δύο όρων με τον ίδιο αριθμό.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Χιαστί Γινόμενα & Σύνθετο Πρόβλημα Κατανόησης
function makeAdvancedEquivQuestion(isWordProblem = false) {
  if (!isWordProblem) {
    // q7: Έλεγχος ισότητας χιαστί γινομένων (MCQ)
    const a = getRandomInt(3, 7);
    const b = getRandomInt(8, 12);
    const mult = getRandomInt(2, 4);
    const c = a * mult;
    const d = b * mult;
    const crossProduct = a * d;

    const distractors = shuffleArray([
      crossProduct + a,
      crossProduct - b,
      (a + 1) * d,
      crossProduct + 10
    ]).filter((val) => val !== crossProduct).slice(0, 3);

    const options = shuffleArray([crossProduct, ...distractors]).map(String);

    return {
      type: 'mcq',
      correct: String(crossProduct),
      options,
      prompt: `Για τα ισοδύναμα κλάσματα ${a}/${b} ＝ ${c}/${d}, πόσο ισούται το κοινό χιαστί γινόμενο (${a} · ${d} και ${b} · ${c});`,
      explanation: `Σε κάθε ζεύγος ισοδύναμων κλασμάτων τα χιαστί γινόμενα είναι απολύτως ίσα: ${a} · ${d} ＝ ${crossProduct} και ${b} · ${c} ＝ ${crossProduct}.`
    };
  } else {
    // q8: Σύνθετο πρόβλημα ισοδυναμίας με αναλογίες (MCQ)
    // Π.χ. Ένα δοχείο περιέχει 15/25 L. Αν ένα άλλο δοχείο ίδιας χωρητικότητας έχει χωριστεί σε 50 ίσα μέρη, πόσα μέρη πρέπει να γεμίσουμε;
    const baseNum = getRandomInt(3, 6);
    const baseDen = getRandomInt(7, 10);
    const factor1 = getRandomInt(2, 3);
    const factor2 = factor1 * 2; // διπλάσιος διαμερισμός

    const containerA_num = baseNum * factor1;
    const containerA_den = baseDen * factor1;
    const containerB_den = baseDen * factor2;
    const containerB_num = baseNum * factor2;

    const distractors = [
      containerB_num + factor1,
      containerB_num - factor1,
      containerA_num + factor2
    ].filter((val) => val !== containerB_num);

    const options = shuffleArray([containerB_num, ...distractors.slice(0, 3)]).map((val) => `${val} μερη`);

    return {
      type: 'mcq',
      correct: `${containerB_num} μερη`,
      options,
      prompt: `Μια δεξαμενή είναι γεμάτη κατά τα ${containerA_num}/${containerA_den} της χωρητικότητάς της. Μια δεύτερη πανομοιότυπη δεξαμενή έχει χωριστεί σε ${containerB_den} ίσα μέρη. Πόσα από τα μέρη της δεύτερης δεξαμενής πρέπει να γεμίσουν ώστε να περιέχει ακριβώς την ίδια ποσότητα νερού;`,
      explanation: `Αναζητούμε ισοδύναμο κλάσμα με παρονομαστή το ${containerB_den}: ${containerA_num}/${containerA_den} ＝ x/${containerB_den}. Επειδή ${containerA_den} · 2 ＝ ${containerB_den}, πολλαπλασιάζουμε και τον αριθμητή: ${containerA_num} · 2 ＝ ${containerB_num} μέρη.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeUnknownTermQuestion(false),
    q2: makeUnknownTermQuestion(true),
    q3: makeIrreducibleFractionQuestion(true),
    q4: makeIrreducibleFractionQuestion(false),
    q5: makeEquivalenceCheckQuestion(false),
    q6: makeEquivalenceCheckQuestion(true),
    q7: makeAdvancedEquivQuestion(false),
    q8: makeAdvancedEquivQuestion(true)
  };
}

export default function IsodinamaAskPage() {
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
      title="Ασκήσεις: Ισοδύναμα Κλάσματα - Έ Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Έ Δημοτικού στα ισοδύναμα κλάσματα: εύρεση αγνώστου όρου, απλοποίηση σε ανάγωγο, χιαστί γινόμενα."
      backUrl="/e-dimotikou"
      backText="Έ Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/02-isodinama"
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
              Έ ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Ισοδύναμα Κλάσματα
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
          {renderInput('q1', questions.q1, 1, 'ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ ΑΡΙΘΜΗΤΗ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ ΠΑΡΟΝΟΜΑΣΤΗ', 'bg-blue-600')}

          {renderInput('q3', questions.q3, 3, 'ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ ( ΑΡΙΘΜΗΤΗΣ )', 'bg-indigo-600')}
          {renderInput('q4', questions.q4, 4, 'ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ ( ΠΑΡΟΝΟΜΑΣΤΗΣ )', 'bg-indigo-600')}

          {renderMCQ('q5', questions.q5, 5, 'ΑΝΑΓΝΩΡΙΣΗ ΙΣΟΔΥΝΑΜΟΥ ΚΛΑΣΜΑΤΟΣ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΕΝΤΟΠΙΣΜΟΣ ΜΗ ΙΣΟΔΥΝΑΜΟΥ', 'bg-teal-600')}

          {renderMCQ('q7', questions.q7, 7, 'ΕΛΕΓΧΟΣ ΜΕ ΧΙΑΣΤΙ ΓΙΝΟΜΕΝΑ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΑΝΑΛΟΓΙΑΣ', 'bg-purple-600')}

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

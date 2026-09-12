// pages/e-dimotikou/09-krit-diaret-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εύρεση Άγνωστου Ψηφίου x για Διαιρετότητα με 3 ή 9 (Input)
function makeMissingDigitSumQuestion(isDivByNine = false) {
  if (!isDivByNine) {
    // q1: Διαιρετότητα με το 3 (Ζητείται το μικρότερο μη μηδενικό ψηφίο x)
    const d1 = getRandomInt(2, 8);
    const d2 = getRandomInt(1, 8);
    const sumKnown = d1 + d2;
    // Βρίσκουμε το ελάχιστο μονοψήφιο x (από 1 έως 9) ώστε (sumKnown + x) % 3 === 0
    let correctX = 1;
    for (let candidate = 1; candidate <= 9; candidate++) {
      if ((sumKnown + candidate) % 3 === 0) {
        correctX = candidate;
        break;
      }
    }
    const fullSum = sumKnown + correctX;

    return {
      type: 'input',
      correct: correctX,
      unit: 'ψηφιο x',
      prompt: `Στον τριψήφιο αριθμό ${d1}x${d2}, ποιο είναι το ΜΙΚΡΟΤΕΡΟ μονοψήφιο ψηφίο x (μεγαλύτερο από το 0) ώστε ο αριθμός να διαιρείται ακριβώς με το 3;`,
      explanation: `Για να διαιρείται ο αριθμός με το 3, το άθροισμα των ψηφίων του πρέπει να διαιρείται με το 3. Το γνωστό άθροισμα είναι ${d1} ＋ ${d2} ＝ ${sumKnown}. Το μικρότερο μονοψήφιο ψηφίο (x ＞ 0) είναι το ${correctX}, ώστε ${d1} ＋ ${correctX} ＋ ${d2} ＝ ${fullSum} (${fullSum} ： 3 ＝ ${fullSum / 3}).`
    };
  } else {
    // q2: Διαιρετότητα με το 9 (Μοναδικό ψηφίο x)
    const d1 = getRandomInt(2, 7);
    const d2 = getRandomInt(1, 6);
    const d3 = getRandomInt(1, 5);
    const sumKnown = d1 + d2 + d3;
    // Εύρεση του μοναδικού x (0 έως 9) ώστε (sumKnown + x) % 9 === 0
    let correctX = (9 - (sumKnown % 9)) % 9;
    const fullSum = sumKnown + correctX;

    return {
      type: 'input',
      correct: correctX,
      unit: 'ψηφιο x',
      prompt: `Στον τετραψήφιο αριθμό ${d1}.${d2}x${d3}, ποιο ψηφίο πρέπει να είναι το x ώστε ο αριθμός να διαιρείται ακριβώς με το 9;`,
      explanation: `Για να διαιρείται με το 9, το άθροισμα όλων των ψηφίων πρέπει να είναι πολλαπλάσιο του 9. Τα γνωστά ψηφία έχουν άθροισμα ${d1} ＋ ${d2} ＋ ${d3} ＝ ${sumKnown}. Πρέπει ${sumKnown} ＋ x ＝ ${fullSum}, άρα x ＝ ${correctX}.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Κριτήρια των Δύο Τελευταίων Ψηφίων (4 και 25) (MCQ)
function makeLastTwoDigitsQuestion(isDivBy25 = false) {
  if (!isDivBy25) {
    // q3: Διαιρετότητα με το 4
    const validEnds = [12, 16, 24, 28, 32, 36, 44, 48, 52, 56, 64, 72, 84, 96];
    const invalidEnds = [14, 18, 22, 26, 34, 38, 42, 54, 58, 62, 74, 82];

    const chosenValidEnd = validEnds[getRandomInt(0, validEnds.length - 1)];
    const chosenInvalidEnds = shuffleArray(invalidEnds).slice(0, 3);

    const prefix = getRandomInt(1, 9) * 100;
    const correctNum = prefix + chosenValidEnd;
    const distractors = chosenInvalidEnds.map((end) => prefix + end);

    const options = shuffleArray([correctNum, ...distractors]).map(String);

    return {
      type: 'mcq',
      correct: String(correctNum),
      options,
      prompt: `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το 4;`,
      explanation: `Ένας αριθμός διαιρείται με το 4 αν τα δύο τελευταία ψηφία του σχηματίζουν αριθμό που διαιρείται με το 4. Στον αριθμό ${correctNum}, τα δύο τελευταία ψηφία είναι το ${chosenValidEnd} (${chosenValidEnd} ： 4 ＝ ${chosenValidEnd / 4}).`
    };
  } else {
    // q4: Διαιρετότητα με το 25
    const validEnds = ['00', '25', '50', '75'];
    const invalidEnds = ['15', '35', '45', '65', '85', '20', '70'];

    const chosenValidEnd = validEnds[getRandomInt(0, validEnds.length - 1)];
    const chosenInvalidEnds = shuffleArray(invalidEnds).slice(0, 3);

    const prefix = getRandomInt(12, 85);
    const correctNum = `${prefix}${chosenValidEnd}`;
    const distractors = chosenInvalidEnds.map((end) => `${prefix}${end}`);

    const options = shuffleArray([correctNum, ...distractors]);

    return {
      type: 'mcq',
      correct: correctNum,
      options,
      prompt: `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το 25;`,
      explanation: `Ένας αριθμός διαιρείται με το 25 αν λήγει σε 00, 25, 50 ή 75. Ο αριθμός ${correctNum} λήγει σε ${chosenValidEnd}, άρα διαιρείται ακριβώς με το 25.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Σύνθετα Κριτήρια (6 και 15) (MCQ)
function makeCompositeCriteriaQuestion(isDivBy15 = false) {
  if (!isDivBy15) {
    // q5: Διαιρετότητα με το 6 (Πρέπει να είναι άρτιος ΚΑΙ το άθροισμα ψηφίων να διαιρείται με το 3)
    const validNumbers = [234, 342, 456, 528, 612, 738, 816, 924];
    const invalidNumbers = [
      235, // περιττός (άθροισμα 10)
      345, // περιττός (διαιρείται με 3 αλλά όχι με 2)
      452, // άρτιος αλλά άθροισμα 11 (όχι με 3)
      526, // άρτιος αλλά άθροισμα 13 (όχι με 3)
      734  // άρτιος αλλά άθροισμα 14 (όχι με 3)
    ];

    const correctVal = validNumbers[getRandomInt(0, validNumbers.length - 1)];
    const distractors = shuffleArray(invalidNumbers).slice(0, 3);
    const options = shuffleArray([correctVal, ...distractors]).map(String);

    const digits = correctVal.toString().split('').map(Number);
    const sum = digits.reduce((a, b) => a + b, 0);

    return {
      type: 'mcq',
      correct: String(correctVal),
      options,
      prompt: `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το 6;`,
      explanation: `Για να διαιρείται ένας αριθμός με το 6, πρέπει να διαιρείται ταυτόχρονα με το 2 και το 3. Ο αριθμός ${correctVal} είναι άρτιος (λήγει σε ${digits[2]}) ΚΑΙ το άθροισμα των ψηφίων του είναι ${digits.join(' ＋ ')} ＝ ${sum} (διαιρείται με το 3).`
    };
  } else {
    // q6: Διαιρετότητα με το 15 (Πρέπει να λήγει σε 0 ή 5 ΚΑΙ το άθροισμα να διαιρείται με το 3)
    const validNumbers = [135, 240, 315, 420, 525, 630, 705, 840];
    const invalidNumbers = [
      130, // λήγει σε 0 αλλά άθροισμα 4
      245, // λήγει σε 5 αλλά άθροισμα 11
      314, // δεν λήγει σε 0 ή 5
      425, // λήγει σε 5 αλλά άθροισμα 11
      520  // λήγει σε 0 αλλά άθροισμα 7
    ];

    const correctVal = validNumbers[getRandomInt(0, validNumbers.length - 1)];
    const distractors = shuffleArray(invalidNumbers).slice(0, 3);
    const options = shuffleArray([correctVal, ...distractors]).map(String);

    const digits = correctVal.toString().split('').map(Number);
    const sum = digits.reduce((a, b) => a + b, 0);

    return {
      type: 'mcq',
      correct: String(correctVal),
      options,
      prompt: `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το 15;`,
      explanation: `Για να διαιρείται με το 15, πρέπει να διαιρείται ταυτόχρονα με το 5 (να λήγει σε 0 ή 5) και με το 3 (άθροισμα ψηφίων πολλαπλάσιο του 3). Ο αριθμός ${correctVal} λήγει σε ${digits[2]} και έχει άθροισμα ψηφίων ${digits.join(' ＋ ')} ＝ ${sum} (${sum} ： 3 ＝ ${sum / 3}).`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα με Ταυτόχρονα Κριτήρια (Input & MCQ)
function makeSimultaneousCriteriaProblem(isMCQ = false) {
  if (!isMCQ) {
    // q7: Αριθμός της μορφής 4.7x0 που διαιρείται ταυτόχρονα με το 9 (Input)
    // 4 + 7 + x + 0 = 11 + x -> x = 7 ώστε άθροισμα = 18
    const d1 = [3, 4, 5, 6][getRandomInt(0, 3)];
    const d2 = [5, 6, 7, 8][getRandomInt(0, 3)];
    const sumKnown = d1 + d2; // π.χ. 4 + 7 = 11
    const targetSum = Math.ceil(sumKnown / 9) * 9; // π.χ. 18
    const correctX = targetSum - sumKnown; // π.χ. 7

    return {
      type: 'input',
      correct: correctX,
      unit: 'ψηφιο x',
      prompt: `Ο τετραψήφιος αριθμός ${d1}.${d2}x0 λήγει σε 0, άρα διαιρείται με το 10. Ποιο ψηφίο πρέπει να είναι το x ώστε ο αριθμός να διαιρείται ταυτόχρονα ΚΑΙ με το 9;`,
      explanation: `Για να διαιρείται με το 9, το άθροισμα των ψηφίων του πρέπει να ισούται με πολλαπλάσιο του 9. Έχουμε: ${d1} ＋ ${d2} ＋ x ＋ 0 ＝ ${sumKnown} ＋ x. Το αμέσως επόμενο πολλαπλάσιο του 9 είναι το ${targetSum}. Επομένως: x ＝ ${targetSum} － ${sumKnown} ＝ ${correctX}.`
    };
  } else {
    // q8: Ποιος αριθμός διαιρείται ταυτόχρονα με το 2, το 3 και το 5 (δηλαδή με το 30) (MCQ)
    const validNumbers = [120, 180, 240, 360, 420, 450, 540];
    const invalidNumbers = [
      125, // διαιρείται με 5 αλλά όχι με 2
      140, // διαιρείται με 2 και 5 αλλά άθροισμα 5 (όχι με 3)
      182, // διαιρείται με 2 αλλά όχι με 5
      230, // διαιρείται με 2 και 5 αλλά άθροισμα 5 (όχι με 3)
      350  // διαιρείται με 2 και 5 αλλά άθροισμα 8 (όχι με 3)
    ];

    const correctVal = validNumbers[getRandomInt(0, validNumbers.length - 1)];
    const distractors = shuffleArray(invalidNumbers).slice(0, 3);
    const options = shuffleArray([correctVal, ...distractors]).map(String);

    return {
      type: 'mcq',
      correct: String(correctVal),
      options,
      prompt: `Ποιος από τους παρακάτω αριθμούς διαιρείται ΤΑΥΤΟΧΡΟΝΑ με το 2, το 3 και το 5;`,
      explanation: `Για να διαιρείται ταυτόχρονα με 2 και 5, πρέπει να λήγει σε 0. Για να διαιρείται και με το 3, το άθροισμα των ψηφίων του πρέπει να διαιρείται με το 3 (δηλαδή να διαιρείται με το ΕΚΠ(2, 3, 5) ＝ 30). Ο αριθμός ${correctVal} πληροί και τις τρεις προϋποθέσεις.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeMissingDigitSumQuestion(false),
    q2: makeMissingDigitSumQuestion(true),
    q3: makeLastTwoDigitsQuestion(false),
    q4: makeLastTwoDigitsQuestion(true),
    q5: makeCompositeCriteriaQuestion(false),
    q6: makeCompositeCriteriaQuestion(true),
    q7: makeSimultaneousCriteriaProblem(false),
    q8: makeSimultaneousCriteriaProblem(true)
  };
}

export default function KritDiaretAskPage() {
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
      title="Ασκήσεις: Κριτήρια Διαιρετότητας - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα κριτήρια διαιρετότητας: εύρεση άγνωστων ψηφίων, συνδυαστικοί κανόνες για το 6 και το 15, και έλεγχος με το 4 και το 25."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/09-krit-diaret"
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
              📝 Ασκήσεις: Κριτήρια Διαιρετότητας
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
          {renderInput('q1', questions.q1, 1, 'ΑΓΝΩΣΤΟ ΨΗΦΙΟ ( ΔΙΑΙΡΕΣΗ ΜΕ ΤΟ 3 )', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΑΓΝΩΣΤΟ ΨΗΦΙΟ ( ΔΙΑΙΡΕΣΗ ΜΕ ΤΟ 9 )', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΚΡΙΤΗΡΙΟ ΤΟΥ 4 ( ΤΕΛΕΥΤΑΙΑ ΔΥΟ ΨΗΦΙΑ )', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΚΡΙΤΗΡΙΟ ΤΟΥ 25', 'bg-indigo-600')}

          {renderMCQ('q5', questions.q5, 5, 'ΣΥΝΘΕΤΟ ΚΡΙΤΗΡΙΟ ΤΟΥ 6', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΣΥΝΘΕΤΟ ΚΡΙΤΗΡΙΟ ΤΟΥ 15', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ 9 ΚΑΙ 10', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ 2, 3 ΚΑΙ 5', 'bg-purple-600')}

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

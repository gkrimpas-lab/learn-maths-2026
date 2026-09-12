// pages/e-dimotikou/03-aplopoiisi-ask.js
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

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εύρεση ΜΚΔ για Απλοποίηση με 1 Κίνηση (MCQ & Input)
function makeGCDQuestion(isInput = false) {
  const basePairs = [
    [18, 24], [24, 36], [30, 45], [28, 42], [36, 48], [40, 60], [32, 48], [42, 56]
  ];
  const [num, den] = basePairs[getRandomInt(0, basePairs.length - 1)];
  const correctGCD = gcd(num, den);

  if (!isInput) {
    // q1: MCQ
    const distractors = [
      correctGCD / 2,
      correctGCD === 12 ? 8 : correctGCD + 2,
      correctGCD === 6 ? 4 : correctGCD - 2
    ].filter((val) => val > 1 && val !== correctGCD);

    const options = shuffleArray([correctGCD, ...distractors.slice(0, 3)]).map(String);

    return {
      type: 'mcq',
      correct: String(correctGCD),
      options,
      prompt: `Με ποιον αριθμό (τον ΜΚΔ) πρέπει να διαιρέσουμε ταυτόχρονα τους όρους του κλάσματος ${num}/${den} ώστε να γίνει ανάγωγο με μία μόνο πράξη;`,
      explanation: `Ο Μέγιστος Κοινός Διαιρέτης των αριθμών ${num} και ${den} είναι το ${correctGCD}. Διαιρώντας με το ${correctGCD} προκύπτει αμέσως το ανάγωγο κλάσμα ${num / correctGCD}/${den / correctGCD}.`
    };
  } else {
    // q2: Input
    return {
      type: 'input',
      correct: correctGCD,
      unit: 'τιμη του ΜΚΔ',
      prompt: `Βρες τον Μέγιστο Κοινό Διαιρέτη (ΜΚΔ) των αριθμών ${num} και ${den} για να απλοποιηθεί πλήρως το κλάσμα ${num}/${den}:`,
      explanation: `Ο ΜΚΔ(${num}, ${den}) είναι το ${correctGCD}. Διαιρώντας αριθμητή και παρονομαστή με το ${correctGCD}, το κλάσμα γίνεται ανάγωγο (${num / correctGCD}/${den / correctGCD}).`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Πλήρης Απλοποίηση σε Ανάγωγο Κλάσμα (Input Αριθμητή & Παρονομαστή)
function makeIrreducibleInputQuestion(askForNumerator = true) {
  const basePairs = [
    [3, 7], [4, 9], [5, 8], [7, 11], [5, 12], [8, 15], [9, 14], [7, 16]
  ];
  const [irrNum, irrDen] = basePairs[getRandomInt(0, basePairs.length - 1)];
  const mult = [4, 6, 7, 8, 9][getRandomInt(0, 4)];
  const num = irrNum * mult;
  const den = irrDen * mult;

  if (askForNumerator) {
    // q3: Ζητείται ο αριθμητής
    return {
      type: 'input',
      correct: irrNum,
      unit: 'αριθμητης',
      prompt: `Απλοποίησε το κλάσμα ${num}/${den} στην ανάγωγη μορφή του. Ποιος είναι ο νέος αριθμητής;`,
      explanation: `Ο ΜΚΔ(${num}, ${den}) είναι το ${mult}. Διαιρούμε και τους δύο όρους διά ${mult}: ${num} ： ${mult} ＝ ${irrNum} και ${den} ： ${mult} ＝ ${irrDen}. Άρα ο αριθμητής του ανάγωγου κλάσματος είναι ${irrNum}.`
    };
  } else {
    // q4: Ζητείται ο παρονομαστής
    return {
      type: 'input',
      correct: irrDen,
      unit: 'παρονομαστης',
      prompt: `Απλοποίησε το κλάσμα ${num}/${den} στην ανάγωγη μορφή του. Ποιος είναι ο νέος παρονομαστής;`,
      explanation: `Ο ΜΚΔ(${num}, ${den}) είναι το ${mult}. Διαιρούμε και τους δύο όρους διά ${mult}: ${num} ： ${mult} ＝ ${irrNum} και ${den} ： ${mult} ＝ ${irrDen}. Άρα ο παρονομαστής του ανάγωγου κλάσματος είναι ${irrDen}.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Αναγνώριση Ανάγωγων Κλασμάτων (MCQ)
function makeIdentifyIrreducibleQuestion(isIdentifyNotIrreducible = false) {
  if (!isIdentifyNotIrreducible) {
    // q5: Ποιο από τα 4 είναι ανάγωγο
    const irreducibles = ['5/12', '7/15', '8/21', '11/24', '9/20', '13/18'];
    const reducibles = ['6/18', '14/21', '15/25', '12/28', '20/35', '18/30'];

    const chosenIrreducible = irreducibles[getRandomInt(0, irreducibles.length - 1)];
    const chosenReducibles = shuffleArray(reducibles).slice(0, 3);
    const options = shuffleArray([chosenIrreducible, ...chosenReducibles]);

    return {
      type: 'mcq',
      correct: chosenIrreducible,
      options,
      prompt: `Ποιο από τα παρακάτω κλάσματα είναι ΑΝΑΓΩΓΟ (δεν μπορεί να απλοποιηθεί άλλο);`,
      explanation: `Το κλάσμα ${chosenIrreducible} είναι ανάγωγο, διότι ο αριθμητής και ο παρονομαστής του είναι πρώτοι μεταξύ τους (ο ΜΚΔ τους ισούται με 1). Τα υπόλοιπα έχουν κοινούς διαιρέτες μεγαλύτερους του 1.`
    };
  } else {
    // q6: Ποιο από τα 4 ΔΕΝ είναι ανάγωγο
    const irreducibles = ['4/15', '7/16', '9/22', '11/30', '13/24'];
    const reducibles = ['9/21', '14/35', '16/28', '15/36', '18/42'];

    const chosenReducible = reducibles[getRandomInt(0, reducibles.length - 1)];
    const chosenIrreducibles = shuffleArray(irreducibles).slice(0, 3);
    const options = shuffleArray([chosenReducible, ...chosenIrreducibles]);

    return {
      type: 'mcq',
      correct: chosenReducible,
      options,
      prompt: `Ποιο από τα παρακάτω κλάσματα ΔΕΝ είναι ανάγωγο (δηλαδή επιδέχεται απλοποίηση);`,
      explanation: `Το κλάσμα ${chosenReducible} δεν είναι ανάγωγο, γιατί ο αριθμητής και ο παρονομαστής έχουν κοινό διαιρέτη μεγαλύτερο του 1 και μπορούν να απλοποιηθούν περαιτέρω.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα με Απλοποίηση σε Πραγματικά Σενάρια
function makeWordProblemQuestion(isPercentageStyle = false) {
  if (!isPercentageStyle) {
    // q7: Μαθητές τάξης (π.χ. 18 αγόρια σε 30 μαθητές -> 18/30 -> ανάγωγο 3/5, ποιος ο αριθμητής;)
    const totalStudents = [24, 28, 30, 36, 40][getRandomInt(0, 4)];
    const divisor = [4, 6][getRandomInt(0, 1)];
    const unitPart = totalStudents / (divisor === 4 ? 4 : 6);
    const girlsCount = unitPart * (divisor === 4 ? 3 : 5);
    const d = gcd(girlsCount, totalStudents);
    const irrNum = girlsCount / d;
    const irrDen = totalStudents / d;

    return {
      type: 'input',
      correct: irrNum,
      unit: 'αριθμητης',
      prompt: `Σε ένα σχολείο υπάρχουν ${totalStudents} παιδιά, από τα οποία τα ${girlsCount} είναι κορίτσια. Γράψε το κλάσμα των κοριτσιών ως προς το σύνολο των παιδιών στην ανάγωγη μορφή του. Ποιος είναι ο αριθμητής του;`,
      explanation: `Το αρχικό κλάσμα είναι ${girlsCount}/${totalStudents}. Ο ΜΚΔ(${girlsCount}, ${totalStudents}) είναι το ${d}. Διαιρούμε και τους δύο όρους: (${girlsCount} ： ${d}) / (${totalStudents} ： ${d}) ＝ ${irrNum}/${irrDen}. Επομένως ο αριθμητής του ανάγωγου κλάσματος είναι ${irrNum}.`
    };
  } else {
    // q8: Μέρος της ώρας ή της ημέρας σε ανάγωγο κλάσμα (MCQ)
    const minutesList = [
      { min: 40, frac: '2/3', expl: '40/60 ＝ (40 ： 20) / (60 ： 20) ＝ 2/3' },
      { min: 45, frac: '3/4', expl: '45/60 ＝ (45 ： 15) / (60 ： 15) ＝ 3/4' },
      { min: 48, frac: '4/5', expl: '48/60 ＝ (48 ： 12) / (60 ： 12) ＝ 4/5' },
      { min: 50, frac: '5/6', expl: '50/60 ＝ (50 ： 10) / (60 ： 10) ＝ 5/6' }
    ];
    const chosen = minutesList[getRandomInt(0, minutesList.length - 1)];

    const distractors = ['1/2', '2/5', '3/5', '5/8'].filter((f) => f !== chosen.frac);
    const options = shuffleArray([chosen.frac, ...distractors.slice(0, 3)]);

    return {
      type: 'mcq',
      correct: chosen.frac,
      options,
      prompt: `Ο χρόνος των ${chosen.min} min ποιο ανάγωγο κλάσμα της 1 ώρας (60 min) εκφράζει;`,
      explanation: `Μία ώρα έχει 60 min. Το κλάσμα είναι ${chosen.min}/60. Απλοποιώντας με τον ΜΚΔ προκύπτει: ${chosen.expl}.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeGCDQuestion(false),
    q2: makeGCDQuestion(true),
    q3: makeIrreducibleInputQuestion(true),
    q4: makeIrreducibleInputQuestion(false),
    q5: makeIdentifyIrreducibleQuestion(false),
    q6: makeIdentifyIrreducibleQuestion(true),
    q7: makeWordProblemQuestion(false),
    q8: makeWordProblemQuestion(true)
  };
}

export default function AplopoiisiAskPage() {
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

    if (answers.q1 === questions.q1.correct) currentScore += 1;
    if (parseInt(answers.q2, 10) === questions.q2.correct) currentScore += 1;
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
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
      title="Ασκήσεις: Απλοποίηση Κλάσματος - Έ Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Έ Δημοτικού στην απλοποίηση κλασμάτων: υπολογισμός ΜΚΔ, αναγωγή στην απλούστερη μορφή και σύνθετα προβλήματα."
      backUrl="/e-dimotikou"
      backText="Έ Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/03-aplopoiisi"
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
              📝 Ασκήσεις: Απλοποίηση Κλάσματος
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
          {renderMCQ('q1', questions.q1, 1, 'ΕΥΡΕΣΗ ΜΚΔ ΓΙΑ ΑΠΛΟΠΟΙΗΣΗ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΥΠΟΛΟΓΙΣΜΟΣ ΜΕΓΙΣΤΟΥ ΚΟΙΝΟΥ ΔΙΑΙΡΕΤΗ', 'bg-blue-600')}

          {renderInput('q3', questions.q3, 3, 'ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ ( ΑΡΙΘΜΗΤΗΣ )', 'bg-indigo-600')}
          {renderInput('q4', questions.q4, 4, 'ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ ( ΠΑΡΟΝΟΜΑΣΤΗΣ )', 'bg-indigo-600')}

          {renderMCQ('q5', questions.q5, 5, 'ΕΝΤΟΠΙΣΜΟΣ ΑΝΑΓΩΓΟΥ ΚΛΑΣΜΑΤΟΣ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΕΝΤΟΠΙΣΜΟΣ ΜΗ ΑΝΑΓΩΓΟΥ ΚΛΑΣΜΑΤΟΣ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΠΡΟΒΛΗΜΑ ΜΕ ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΥΠΟΛΟΓΙΣΜΟΣ ΜΕΡΟΥΣ ΧΡΟΝΟΥ', 'bg-purple-600')}

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

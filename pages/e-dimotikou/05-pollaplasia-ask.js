// pages/e-dimotikou/05-pollaplasia-ask.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΤΥΠΟΓΡΑΦΙΑ & ΣΥΜΒΟΛΑ --- //

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Ε')/g);
  return parts
    .map((part) => {
      if (part === "Ε'") return "Ε'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Επαναχρησιμοποιήσιμο component για κανονική κατακόρυφη μορφή κλάσματος
function Fraction({ num, den, className = '', size = 'md' }) {
  const sizeClasses = {
    xs: 'text-[11px] 2xl:text-xs',
    sm: 'text-xs 2xl:text-sm',
    md: 'text-sm sm:text-base 2xl:text-lg',
    lg: 'text-base sm:text-lg 2xl:text-xl'
  };

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <span className="px-1 text-center leading-tight">{num}</span>
      <span className="w-full min-w-[0.85em] h-[1.5px] bg-current my-[1px] rounded-full"></span>
      <span className="px-1 text-center leading-tight">{den}</span>
    </span>
  );
}

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

// --- ΔΗΜΙΟΥΡΓΙΑ ΕΡΩΤΗΣΕΩΝ ΜΕ i18n (8 ΕΡΩΤΗΣΕΙΣ) --- //

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εύρεση Πολλαπλασίου σε Συγκεκριμένο Διάστημα (Input)
function makeRangeMultipleQuestion(isUpperBound = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isUpperBound) {
    // q1: Το αμέσως μεγαλύτερο πολλαπλάσιο του k μετά από έναν αριθμό N
    const base = [6, 7, 8, 9, 12][getRandomInt(0, 4)];
    const factor = getRandomInt(8, 15);
    const targetThreshold = base * factor - getRandomInt(2, base - 1);
    const correctMultiple = base * factor;

    return {
      type: 'input',
      correct: correctMultiple,
      unit: isEl ? 'αριθμός' : 'number',
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>
              Ποιο είναι το αμέσως επόμενο (μικρότερο δυνατό) πολλαπλάσιο του {base} που είναι μεγαλύτερο από το {targetThreshold};
            </>
          ) : (
            <>
              What is the very next (smallest possible) multiple of {base} that is strictly greater than {targetThreshold}?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="font-mono">
          {isEl ? (
            <>
              Διαιρούμε το {targetThreshold} με το {base}: {targetThreshold} : {base} ＝ {factor - 1} με υπόλοιπο {targetThreshold % base}. Το αμέσως επόμενο πολλαπλάσιο είναι το {base} · {factor} ＝ {correctMultiple}.
            </>
          ) : (
            <>
              Divide {targetThreshold} by {base}: {targetThreshold} : {base} ＝ {factor - 1} with remainder {targetThreshold % base}. The immediately next multiple is {base} · {factor} ＝ {correctMultiple}.
            </>
          )}
        </span>
      )
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
      unit: isEl ? 'αριθμός' : 'number',
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>
              Ποιο είναι το μεγαλύτερο πολλαπλάσιο του {base} που είναι μικρότερο από το {targetThreshold};
            </>
          ) : (
            <>
              What is the largest multiple of {base} that is strictly less than {targetThreshold}?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="font-mono">
          {isEl ? (
            <>
              Εκτελούμε τη διαίρεση {targetThreshold} : {base} ＝ {factor} με υπόλοιπο {targetThreshold % base}. Άρα το μεγαλύτερο πολλαπλάσιο πριν το {targetThreshold} είναι το {base} · {factor} ＝ {correctMultiple}.
            </>
          ) : (
            <>
              Perform the division {targetThreshold} : {base} ＝ {factor} with remainder {targetThreshold % base}. Thus, the largest multiple before {targetThreshold} is {base} · {factor} ＝ {correctMultiple}.
            </>
          )}
        </span>
      )
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Έλεγχος & Αναγνώριση Πολλαπλασίων (MCQ)
function makeMultipleCheckQuestion(isNotMultiple = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isNotMultiple) {
    // q3: Ποιος από τους 4 αριθμούς είναι πολλαπλάσιο του base
    const base = [6, 7, 8, 9, 12][getRandomInt(0, 4)];
    const correctFactor = getRandomInt(12, 25);
    const correctVal = base * correctFactor;

    const rawDistractors = [
      correctVal + 1,
      correctVal - 2,
      correctVal + base - 1
    ].filter((v) => v % base !== 0);

    const rawOptions = [correctVal, ...rawDistractors];
    const options = shuffleArray([...new Set(rawOptions)].slice(0, 4)).map(String);

    return {
      type: 'mcq',
      correct: String(correctVal),
      options,
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>Ποιος από τους παρακάτω αριθμούς είναι πολλαπλάσιο του {base};</>
          ) : (
            <>Which of the following numbers is a multiple of {base}?</>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="font-mono">
          {isEl ? (
            <>
              Ο αριθμός {correctVal} διαιρείται ακριβώς με το {base}: {correctVal} : {base} ＝ {correctFactor} (υπόλοιπο 0). Οι υπόλοιποι αριθμοί αφήνουν υπόλοιπο διάφορο του μηδενός.
            </>
          ) : (
            <>
              The number {correctVal} is exactly divisible by {base}: {correctVal} : {base} ＝ {correctFactor} (remainder 0). The other numbers leave a non-zero remainder.
            </>
          )}
        </span>
      )
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

    const rawOptions = [m1, m2, m3, fake];
    const options = shuffleArray([...new Set(rawOptions)]).map(String);

    return {
      type: 'mcq',
      correct: String(fake),
      options,
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>Ποιος από τους παρακάτω αριθμούς ΔΕΝ είναι πολλαπλάσιο του {base};</>
          ) : (
            <>Which of the following numbers is NOT a multiple of {base}?</>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="font-mono">
          {isEl ? (
            <>
              Ο αριθμός {fake} δεν διαιρείται ακριβώς με το {base}, καθώς η διαίρεση {fake} : {base} αφήνει υπόλοιπο {fake % base}. Όλοι οι άλλοι αριθμοί είναι πολλαπλάσια του {base}.
            </>
          ) : (
            <>
              The number {fake} is not exactly divisible by {base}, as {fake} : {base} leaves a remainder of {fake % base}. All other numbers are multiples of {base}.
            </>
          )}
        </span>
      )
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Κοινά Πολλαπλάσια & Συμπλήρωση Σειράς (Input & MCQ)
function makeCommonMultipleQuestion(isSequence = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isSequence) {
    // q5: Εύρεση του μικρότερου κοινού θετικού πολλαπλασίου δύο αριθμών (Input)
    const pairs = [
      [3, 4, 12], [4, 6, 12], [6, 8, 24], [4, 5, 20], [6, 9, 18], [8, 12, 24], [5, 6, 30]
    ];
    const [a, b, lcmVal] = pairs[getRandomInt(0, pairs.length - 1)];

    return {
      type: 'input',
      correct: lcmVal,
      unit: isEl ? 'αριθμός' : 'number',
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>
              Ποιος είναι ο μικρότερος θετικός αριθμός (μεγαλύτερος από το 0) που είναι ταυτόχρονα πολλαπλάσιο του {a} και του {b};
            </>
          ) : (
            <>
              What is the smallest positive number (greater than 0) that is simultaneously a multiple of both {a} and {b}?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="font-mono">
          {isEl ? (
            <>
              Γράφουμε τα πρώτα θετικά πολλαπλάσια: Π({a}) ＝ {'{'}{a}, {a * 2}, {a * 3}, ...{'}'} και Π({b}) ＝ {'{'}{b}, {b * 2}, {b * 3}, ...{'}'}. Το μικρότερο κοινό πολλαπλάσιό τους είναι το {lcmVal}.
            </>
          ) : (
            <>
              Writing the first positive multiples: M({a}) ＝ {'{'}{a}, {a * 2}, {a * 3}, ...{'}'} and M({b}) ＝ {'{'}{b}, {b * 2}, {b * 3}, ...{'}'}. Their least common multiple is {lcmVal}.
            </>
          )}
        </span>
      )
    };
  } else {
    // q6: Συμπλήρωση άγνωστου όρου σε αριθμητική ακολουθία πολλαπλασίων (MCQ)
    const base = [7, 8, 9, 12, 14][getRandomInt(0, 4)];
    const startFactor = getRandomInt(3, 7);
    const missingIndex = getRandomInt(1, 3);
    const seqTerms = [0, 1, 2, 3, 4].map((i) => base * (startFactor + i));
    const correctVal = seqTerms[missingIndex];

    const rawDistractors = [
      correctVal + base * 2,
      correctVal - 1,
      correctVal + 1
    ].filter((v) => v !== correctVal);

    const rawOptions = [correctVal, ...rawDistractors.slice(0, 3)];
    const options = shuffleArray([...new Set(rawOptions)]).map(String);

    const maskedTermsStr = seqTerms
      .map((term, i) => (i === missingIndex ? '...' : term))
      .join(', ');

    return {
      type: 'mcq',
      correct: String(correctVal),
      options,
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>
              Παρατήρησε την παρακάτω σειρά διαδοχικών πολλαπλασίων του {base}: <span className="font-mono font-bold text-indigo-700">{maskedTermsStr}</span>. Ποιος αριθμός λείπει στη θέση των αποσιωπητικών;
            </>
          ) : (
            <>
              Observe the following sequence of consecutive multiples of {base}: <span className="font-mono font-bold text-indigo-700">{maskedTermsStr}</span>. Which number is missing in place of the ellipsis?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="font-mono">
          {isEl ? (
            <>
              Σε μια σειρά διαδοχικών πολλαπλασίων του {base}, κάθε επόμενος όρος προκύπτει προσθέτοντας {base}. Ο όρος που λείπει είναι ο {correctVal}.
            </>
          ) : (
            <>
              In a sequence of consecutive multiples of {base}, each subsequent term is obtained by adding {base}. The missing term is {correctVal}.
            </>
          )}
        </span>
      )
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Περιοδικότητας & Ομαδοποίησης (MCQ & Input)
function makeMultipleWordProblem(isInput = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isInput) {
    // q7: Πρόβλημα συγχρονισμού φαναριών / αναλαμπών (MCQ)
    const pairs = [
      { t1: 6, t2: 8, correct: 24 },
      { t1: 4, t2: 10, correct: 20 },
      { t1: 9, t2: 12, correct: 36 },
      { t1: 8, t2: 10, correct: 40 }
    ];
    const item = pairs[getRandomInt(0, pairs.length - 1)];

    const rawDistractors = [
      item.correct + item.t1,
      item.correct - item.t2,
      item.t1 * item.t2
    ].filter((v) => v !== item.correct && v > 0);

    const rawOptions = [item.correct, ...rawDistractors.slice(0, 3)];
    const options = shuffleArray([...new Set(rawOptions)]).map((v) => `${v} s`);

    return {
      type: 'mcq',
      correct: `${item.correct} s`,
      options,
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>
              Ένας φωτεινός φάρος αναβοσβήνει κάθε {item.t1} s και ένας δεύτερος φάρος κάθε {item.t2} s. Αν αναβοσβήσουν ταυτόχρονα τώρα, μετά από πόσα δευτερόλεπτα (s) θα ξανασυναντηθούν για πρώτη φορά;
            </>
          ) : (
            <>
              One lighthouse flashes every {item.t1} s and a second lighthouse every {item.t2} s. If they flash together right now, after how many seconds (s) will they flash together again for the first time?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="font-mono">
          {isEl ? (
            <>
              Αναζητούμε το μικρότερο κοινό πολλαπλάσιο των αριθμών {item.t1} και {item.t2}. Τα πολλαπλάσια του {item.t1} είναι {'{'}{item.t1}, {item.t1 * 2}, ...{'}'} και του {item.t2} είναι {'{'}{item.t2}, {item.t2 * 2}, ...{'}'}. Το πρώτο κοινό τους σημείο είναι στα {item.correct} s.
            </>
          ) : (
            <>
              We find the least common multiple of {item.t1} and {item.t2}. Multiples of {item.t1} are {'{'}{item.t1}, {item.t1 * 2}, ...{'}'} and of {item.t2} are {'{'}{item.t2}, {item.t2 * 2}, ...{'}'}. Their first common flash occurs at {item.correct} s.
            </>
          )}
        </span>
      )
    };
  } else {
    // q8: Πρόβλημα ομαδοποίησης αντικειμένων (Input)
    const packSize = [6, 8, 9, 12][getRandomInt(0, 3)];
    const targetMin = getRandomInt(65, 95);
    const neededPacks = Math.ceil(targetMin / packSize);
    const totalItems = neededPacks * packSize;

    return {
      type: 'input',
      correct: totalItems,
      unit: isEl ? 'τεμάχια' : 'pieces',
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>
              Ένας ζαχαροπλάστης συσκευάζει σοκολατάκια σε κουτιά των {packSize} τεμαχίων. Χρειάζεται να ετοιμάσει τουλάχιστον {targetMin} σοκολατάκια. Ποιος είναι ο ελάχιστος ακριβής αριθμός από σοκολατάκια που πρέπει να φτιάξει ώστε όλα τα κουτιά να είναι απολύτως γεμάτα;
            </>
          ) : (
            <>
              A confectioner packs chocolates into boxes of {packSize} pieces. He needs to prepare at least {targetMin} chocolates. What is the minimum exact number of chocolates he must make so that all boxes are completely full?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="font-mono">
          {isEl ? (
            <>
              Ο συνολικός αριθμός πρέπει να είναι πολλαπλάσιο του {packSize} και τουλάχιστον ίσος με {targetMin}. Διαιρούμε {targetMin} : {packSize} ＝ {Math.floor(targetMin / packSize)} με υπόλοιπο {targetMin % packSize}. Άρα απαιτούνται {neededPacks} πλήρη κουτιά, δηλαδή {neededPacks} · {packSize} ＝ {totalItems} τεμάχια.
            </>
          ) : (
            <>
              The total count must be a multiple of {packSize} and at least equal to {targetMin}. Dividing {targetMin} : {packSize} ＝ {Math.floor(targetMin / packSize)} with remainder {targetMin % packSize}. Thus, {neededPacks} complete boxes are needed, i.e. {neededPacks} · {packSize} ＝ {totalItems} pieces.
            </>
          )}
        </span>
      )
    };
  }
}

function generateQuestions(locale) {
  return {
    q1: makeRangeMultipleQuestion(false, locale),
    q2: makeRangeMultipleQuestion(true, locale),
    q3: makeMultipleCheckQuestion(false, locale),
    q4: makeMultipleCheckQuestion(true, locale),
    q5: makeCommonMultipleQuestion(false, locale),
    q6: makeCommonMultipleQuestion(true, locale),
    q7: makeMultipleWordProblem(false, locale),
    q8: makeMultipleWordProblem(true, locale)
  };
}

const translations = {
  el: {
    pageTitle: "Ασκήσεις: Πολλαπλάσια ενός Αριθμού - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα πολλαπλάσια: εύρεση ορίων, έλεγχος διαιρετότητας, κοινά πολλαπλάσια και προβλήματα.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeChapter: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    headerTitle: "📝 Ασκήσεις: Πολλαπλάσια ενός Αριθμού",
    headerDesc: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα τυχαιοποιημένα δεδομένα από τη δεξαμενή προβλημάτων!",
    newQuestionsBtn: "🔄 Νέες Ασκήσεις",
    checkBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreText: "Σκορ:",
    successRate: "Επιτυχία:",
    fillPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctLabel: "Η σωστή απάντηση είναι:",
    titles: {
      q1: "ΕΠΟΜΕΝΟ ΠΟΛΛΑΠΛΑΣΙΟ",
      q2: "ΠΡΟΗΓΟΥΜΕΝΟ ΠΟΛΛΑΠΛΑΣΙΟ",
      q3: "ΕΛΕΓΧΟΣ ΠΟΛΛΑΠΛΑΣΙΟΥ",
      q4: "ΕΝΤΟΠΙΣΜΟΣ ΜΗ ΠΟΛΛΑΠΛΑΣΙΟΥ",
      q5: "ΜΙΚΡΟΤΕΡΟ ΚΟΙΝΟ ΠΟΛΛΑΠΛΑΣΙΟ",
      q6: "ΣΥΜΠΛΗΡΩΣΗ ΣΕΙΡΑΣ ΠΟΛΛΑΠΛΑΣΙΩΝ",
      q7: "ΠΡΟΒΛΗΜΑ ΠΕΡΙΟΔΙΚΟΤΗΤΑΣ",
      q8: "ΠΡΟΒΛΗΜΑ ΟΜΑΔΟΠΟΙΗΣΗΣ"
    }
  },
  en: {
    pageTitle: "Exercises: Multiples of a Number - Grade 5 | LearnMaths.gr",
    pageDesc: "Challenging Grade 5 math practice on multiples: finding bounds, divisibility checks, least common multiples, and word problems.",
    backText: "Grade 5",
    theoryBtn: "Theory",
    badgeChapter: "GRADE 5 • PRACTICE",
    headerTitle: "📝 Exercises: Multiples of a Number",
    headerDesc: "Every time you click 'New Exercises', fresh randomized numbers are generated from our problem bank!",
    newQuestionsBtn: "🔄 New Exercises",
    checkBtn: "🎯 Check Answers",
    scoreText: "Score:",
    successRate: "Success Rate:",
    fillPrompt: "Complete all questions and click 'Check Answers'!",
    correctLabel: "The correct answer is:",
    titles: {
      q1: "NEXT MULTIPLE",
      q2: "PREVIOUS MULTIPLE",
      q3: "MULTIPLE VERIFICATION",
      q4: "IDENTIFYING NON-MULTIPLE",
      q5: "LEAST COMMON MULTIPLE",
      q6: "SEQUENCE COMPLETION",
      q7: "PERIODICITY PROBLEM",
      q8: "GROUPING WORD PROBLEM"
    }
  }
};

export default function PollaplasiaAskPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(locale));
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, [locale]);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9]/g, '').slice(0, 10);
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
              {toCleanUppercase(badgeTitle)}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.renderPrompt()}
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
                <span className="break-words whitespace-normal leading-snug flex-1">
                  {opt}
                </span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.renderExplanation()}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                <div className="mb-1">
                  {t.correctLabel} <strong className="font-bold text-rose-950">{qData.correct}</strong>.
                </div>
                {qData.renderExplanation()}
              </div>
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
              {toCleanUppercase(badgeTitle)}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.renderPrompt()}
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
              maxLength={10}
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
              <div className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.renderExplanation()}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                <div className="mb-1">
                  {t.correctLabel} <strong className="font-bold text-rose-950">{qData.correct} {qData.unit}</strong>.
                </div>
                {qData.renderExplanation()}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/05-pollaplasia"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      {/* Full-width container για 2K / 4K */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 space-y-8 overflow-x-hidden">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              {toCleanUppercase(t.badgeChapter)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              {t.headerTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              {t.headerDesc}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ (8 ΕΡΩΤΗΣΕΙΣ) */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInput('q1', questions.q1, 1, t.titles.q1, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.titles.q2, 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, t.titles.q3, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.titles.q4, 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, t.titles.q5, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.titles.q6, 'bg-teal-600')}

          {renderMCQ('q7', questions.q7, 7, t.titles.q7, 'bg-purple-600')}
          {renderInput('q8', questions.q8, 8, t.titles.q8, 'bg-purple-600')}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                {t.checkBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <footer className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5 z-50">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreText}</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
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
                {t.newQuestionsBtn}
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                {t.fillPrompt}
              </p>
            )}
          </div>
        </div>
      </footer>
    </Layout>
  );
}
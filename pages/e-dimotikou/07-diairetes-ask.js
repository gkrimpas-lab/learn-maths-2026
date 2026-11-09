// pages/e-dimotikou/07-diairetes-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

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

function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="text-center px-1 pb-0.5 border-b-2 border-current w-full block text-[0.9em]">
        {num}
      </span>
      <span className="text-center px-1 pt-0.5 w-full block text-[0.9em]">
        {den}
      </span>
    </span>
  );
}

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

const TRANSLATIONS = {
  el: {
    metaTitle: "Ασκήσεις: Διαιρέτες ενός Αριθμού - Ε' Δημοτικού | LearnMaths.gr",
    metaDesc: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στους διαιρέτες: πλήθος διαιρετών, αναγνώριση πρώτων και σύνθετων αριθμών, προβλήματα ισοκατανομής.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    headerBadge: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "📝 Ασκήσεις: Διαιρέτες ενός Αριθμού",
    mainSubtitle: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRateLabel: "Επιτυχία:",
    fillPromptBottom: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctAnswerPrefix: "Η σωστή απάντηση είναι:",
    unitDivisors: "διαιρέτες",
    unitValueOfX: "τιμή του x",
    unitTeams: "ομάδες",
    boxesOf: "Κουτιά των",

    // Badges
    b1: "ΠΛΗΘΟΣ ΔΙΑΙΡΕΤΩΝ",
    b2: "ΣΥΜΠΛΗΡΩΣΗ ΣΥΝΟΛΟΥ ΔΙΑΙΡΕΤΩΝ",
    b3: "ΕΛΕΓΧΟΣ ΔΙΑΙΡΕΤΗ",
    b4: "ΕΝΤΟΠΙΣΜΟΣ ΜΗ ΔΙΑΙΡΕΤΗ",
    b5: "ΑΝΑΓΝΩΡΙΣΗ ΠΡΩΤΟΥ ΑΡΙΘΜΟΥ",
    b6: "ΑΝΑΓΝΩΡΙΣΗ ΣΥΝΘΕΤΟΥ ΑΡΙΘΜΟΥ",
    b7: "ΠΡΟΒΛΗΜΑ ΙΣΟΚΑΤΑΝΟΜΗΣ ΟΜΑΔΩΝ",
    b8: "ΠΡΟΒΛΗΜΑ ΣΥΣΚΕΥΑΣΙΑΣ ΧΩΡΙΣ ΥΠΟΛΟΙΠΟ",

    divisorsSymbol: "Δ"
  },
  en: {
    metaTitle: "Exercises: Divisors of a Number - 5th Grade | LearnMaths.gr",
    metaDesc: "Challenging 5th Grade math exercises on divisors: count of divisors, prime and composite recognition, equal distribution word problems.",
    backText: "5th Grade",
    theoryBtn: "Theory",
    headerBadge: "5TH GRADE • PRACTICE",
    mainTitle: "📝 Exercises: Divisors of a Number",
    mainSubtitle: "Every time you click \"New Exercises\", fresh dynamic problems are generated!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRateLabel: "Success:",
    fillPromptBottom: "Complete all questions and click \"Check Answers\"!",
    correctAnswerPrefix: "The correct answer is:",
    unitDivisors: "divisors",
    unitValueOfX: "value of x",
    unitTeams: "teams",
    boxesOf: "Boxes of",

    // Badges
    b1: "NUMBER OF DIVISORS",
    b2: "COMPLETE DIVISOR SET",
    b3: "DIVISOR CHECK",
    b4: "NON-DIVISOR IDENTIFICATION",
    b5: "PRIME NUMBER IDENTIFICATION",
    b6: "COMPOSITE NUMBER IDENTIFICATION",
    b7: "EQUAL GROUP DISTRIBUTION PROBLEM",
    b8: "PACKAGING WITHOUT REMAINDER PROBLEM",

    divisorsSymbol: "D"
  }
};

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Πλήθος Διαιρετών & Συμπλήρωση Συνόλου (Input)
function makeDivisorCountAndMissingQuestion(isMissing = false, locale = 'el') {
  const isEl = locale === 'el';
  const sym = isEl ? 'Δ' : 'D';

  if (!isMissing) {
    const candidates = [12, 16, 18, 20, 24, 28, 30, 36, 40, 48];
    const n = candidates[getRandomInt(0, candidates.length - 1)];
    const divs = getDivisors(n);
    const unit = isEl ? 'διαιρέτες' : 'divisors';

    const promptText = isEl
      ? `Πόσους διαιρέτες έχει συνολικά ο αριθμός ${n}; (Υπολόγισε το πλήθος των στοιχείων του συνόλου ${sym}(${n}))`
      : `How many divisors does ${n} have in total? (Calculate the count of elements in set ${sym}(${n}))`;

    const explanationText = isEl
      ? `Οι διαιρέτες του ${n} είναι: ${sym}(${n}) ＝ {${divs.join(', ')}}. Το σύνολο περιέχει ακριβώς ${divs.length} διαιρέτες.`
      : `The divisors of ${n} are: ${sym}(${n}) ＝ {${divs.join(', ')}}. The set contains exactly ${divs.length} divisors.`;

    return {
      type: 'input',
      correct: divs.length,
      unit,
      promptNode: <span>{promptText}</span>,
      explanation: explanationText
    };
  } else {
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
    const partner = item.n / correctMissing;
    const unit = isEl ? 'τιμή του x' : 'value of x';

    const maskedDivsStr = item.divs
      .map((d, idx) => (idx === missingIndex ? 'x' : d))
      .join(', ');

    const promptText = isEl
      ? `Στο σύνολο των διαιρετών του ${item.n}, ${sym}(${item.n}) ＝ {${maskedDivsStr}}, ποιος αριθμός είναι το x;`
      : `In the set of divisors of ${item.n}, ${sym}(${item.n}) ＝ {${maskedDivsStr}}, what number is x?`;

    const explanationNode = isEl ? (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Ο αριθμός που λείπει είναι το {correctMissing}, γιατί</span>
        <span>{correctMissing} · {partner} ＝ {item.n}</span>
        <span>και</span>
        <Fraction num={item.n} den={correctMissing} />
        <span>＝ {partner} (υπόλοιπο 0).</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>The missing number is {correctMissing}, because</span>
        <span>{correctMissing} · {partner} ＝ {item.n}</span>
        <span>and</span>
        <Fraction num={item.n} den={correctMissing} />
        <span>＝ {partner} (remainder 0).</span>
      </span>
    );

    return {
      type: 'input',
      correct: correctMissing,
      unit,
      promptNode: <span>{promptText}</span>,
      explanation: explanationNode
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Έλεγχος Διαιρέτη (MCQ)
function makeDivisorCheckQuestion(isNotDivisor = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isNotDivisor) {
    const baseList = [48, 54, 56, 60, 72, 84, 90];
    const n = baseList[getRandomInt(0, baseList.length - 1)];
    const allDivs = getDivisors(n).filter((d) => d > 2 && d < n);
    const correctD = allDivs[getRandomInt(0, allDivs.length - 1)];

    const nonDivs = [];
    let candidate = 5;
    while (nonDivs.length < 5) {
      if (n % candidate !== 0 && candidate < n) {
        nonDivs.push(candidate);
      }
      candidate += getRandomInt(1, 3);
    }

    const rawOptions = [correctD, ...nonDivs];
    const uniqueOptions = [...new Set(rawOptions.map(String))].slice(0, 4);
    const options = shuffleArray(uniqueOptions);

    const promptText = isEl
      ? `Ποιος από τους παρακάτω αριθμούς είναι διαιρέτης του ${n};`
      : `Which of the following numbers is a divisor of ${n}?`;

    const explanationNode = isEl ? (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Ο αριθμός {correctD} είναι διαιρέτης του {n}, γιατί</span>
        <Fraction num={n} den={correctD} />
        <span>＝ {n / correctD} είναι ακέραιος (υπόλοιπο 0). Οι υπόλοιποι αριθμοί αφήνουν υπόλοιπο μεγαλύτερο του μηδενός.</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>The number {correctD} is a divisor of ${n}, because</span>
        <Fraction num={n} den={correctD} />
        <span>＝ {n / correctD} gives an exact integer (remainder 0). The other numbers leave a non-zero remainder.</span>
      </span>
    );

    return {
      type: 'mcq',
      correct: String(correctD),
      options,
      promptNode: <span>{promptText}</span>,
      explanation: explanationNode
    };
  } else {
    const baseList = [36, 40, 48, 60, 72, 80];
    const n = baseList[getRandomInt(0, baseList.length - 1)];
    const allDivs = getDivisors(n).filter((d) => d > 2 && d < n);
    const chosenDivs = shuffleArray(allDivs).slice(0, 3);

    const fakeCandidates = [7, 9, 11, 13, 14, 17, 19, 21, 23].filter((x) => n % x !== 0);
    const fake = fakeCandidates[getRandomInt(0, fakeCandidates.length - 1)] || 7;

    const rawOptions = [...chosenDivs, fake];
    const uniqueOptions = [...new Set(rawOptions.map(String))].slice(0, 4);
    const options = shuffleArray(uniqueOptions);

    const promptText = isEl
      ? `Ποιος από τους παρακάτω αριθμούς ΔΕΝ είναι διαιρέτης του ${n};`
      : `Which of the following numbers is NOT a divisor of ${n}?`;

    const explanationNode = isEl ? (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Ο αριθμός {fake} δεν διαιρεί ακριβώς το {n}, αφού το</span>
        <Fraction num={n} den={fake} />
        <span>δεν είναι ακέραιος και αφήνει υπόλοιπο {n % fake}. Όλοι οι άλλοι αριθμοί διαιρούν ακριβώς το {n}.</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>The number {fake} does not divide {n} evenly, as</span>
        <Fraction num={n} den={fake} />
        <span>is not an integer and leaves a remainder of {n % fake}. All other options divide {n} perfectly.</span>
      </span>
    );

    return {
      type: 'mcq',
      correct: String(fake),
      options,
      promptNode: <span>{promptText}</span>,
      explanation: explanationNode
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Πρώτοι & Σύνθετοι Αριθμοί (MCQ)
function makePrimeCompositeQuestion(findComposite = false, locale = 'el') {
  const isEl = locale === 'el';
  const sym = isEl ? 'Δ' : 'D';

  if (!findComposite) {
    const primes = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const composites = [15, 21, 25, 27, 33, 35, 39, 45, 49];

    const correctPrime = primes[getRandomInt(0, primes.length - 1)];
    const chosenComposites = shuffleArray(composites).slice(0, 3);

    const rawOptions = [correctPrime, ...chosenComposites];
    const uniqueOptions = [...new Set(rawOptions.map(String))].slice(0, 4);
    const options = shuffleArray(uniqueOptions);

    const promptText = isEl
      ? `Ποιος από τους παρακάτω αριθμούς είναι ΠΡΩΤΟΣ αριθμός;`
      : `Which of the following numbers is a PRIME number?`;

    const explanationText = isEl
      ? `Ο αριθμός ${correctPrime} είναι πρώτος, γιατί έχει ακριβώς δύο διαιρέτες: το 1 και τον εαυτό του ({1, ${correctPrime}}). Οι υπόλοιποι είναι σύνθετοι αριθμοί.`
      : `The number ${correctPrime} is prime because it has exactly two divisors: 1 and itself ({1, ${correctPrime}}). The others are composite numbers.`;

    return {
      type: 'mcq',
      correct: String(correctPrime),
      options,
      promptNode: <span>{promptText}</span>,
      explanation: explanationText
    };
  } else {
    const primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
    const composites = [27, 33, 39, 49, 51, 57];

    const correctComp = composites[getRandomInt(0, composites.length - 1)];
    const chosenPrimes = shuffleArray(primes).slice(0, 3);

    const rawOptions = [correctComp, ...chosenPrimes];
    const uniqueOptions = [...new Set(rawOptions.map(String))].slice(0, 4);
    const options = shuffleArray(uniqueOptions);

    const divs = getDivisors(correctComp);

    const promptText = isEl
      ? `Ποιος από τους παρακάτω αριθμούς είναι ΣΥΝΘΕΤΟΣ αριθμός;`
      : `Which of the following numbers is a COMPOSITE number?`;

    const explanationText = isEl
      ? `Ο αριθμός ${correctComp} είναι σύνθετος, γιατί έχει περισσότερους από δύο διαιρέτες: ${sym}(${correctComp}) ＝ {${divs.join(', ')}}. Οι υπόλοιποι αριθμοί είναι πρώτοι.`
      : `The number ${correctComp} is composite because it has more than two divisors: ${sym}(${correctComp}) ＝ {${divs.join(', ')}}. The other numbers are prime.`;

    return {
      type: 'mcq',
      correct: String(correctComp),
      options,
      promptNode: <span>{promptText}</span>,
      explanation: explanationText
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Ισοκατανομής & Συσκευασίας (Input & MCQ)
function makeDistributionProblem(isMCQ = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isMCQ) {
    const cases = [
      { total: 36, groupSize: 4, correctTeams: 9 },
      { total: 42, groupSize: 6, correctTeams: 7 },
      { total: 48, groupSize: 8, correctTeams: 6 },
      { total: 40, groupSize: 5, correctTeams: 8 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const unit = isEl ? 'ομάδες' : 'teams';

    const promptText = isEl
      ? `Σε μια εκδρομή συμμετέχουν ${c.total} μαθητές. Ο γυμναστής θέλει να τους χωρίσει σε ισάριθμες ομάδες των ${c.groupSize} παιδιών χωρίς να περισσέψει κανένας. Πόσες ομάδες θα δημιουργηθούν;`
      : `On a field trip, ${c.total} students participate. The teacher wants to divide them into equal groups of ${c.groupSize} students with none left over. How many teams will be formed?`;

    const explanationNode = isEl ? (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Επειδή το {c.groupSize} είναι διαιρέτης του {c.total}, έχουμε:</span>
        <Fraction num={c.total} den={c.groupSize} />
        <span>＝ {c.correctTeams} ομάδες (υπόλοιπο 0).</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Since {c.groupSize} is a divisor of {c.total}, we have:</span>
        <Fraction num={c.total} den={c.groupSize} />
        <span>＝ {c.correctTeams} teams (remainder 0).</span>
      </span>
    );

    return {
      type: 'input',
      correct: c.correctTeams,
      unit,
      promptNode: <span>{promptText}</span>,
      explanation: explanationNode
    };
  } else {
    const items = [
      { total: 36, valid: [3, 4, 6], invalid: 5 },
      { total: 40, valid: [4, 5, 8], invalid: 6 },
      { total: 48, valid: [4, 6, 8], invalid: 7 },
      { total: 60, valid: [5, 6, 10], invalid: 8 }
    ];
    const c = items[getRandomInt(0, items.length - 1)];

    const prefix = isEl ? 'Κουτιά των' : 'Boxes of';
    const rawOptions = [...c.valid, c.invalid];
    const uniqueOptions = [...new Set(rawOptions)];
    const options = shuffleArray(uniqueOptions).map((v) => `${prefix} ${v}`);

    const promptText = isEl
      ? `Ένα κατάστημα έχει ${c.total} γυάλινα ποτήρια. Με ποιον από τους παρακάτω τρόπους συσκευασίας ΔΕΝ μπορεί να τα τοποθετήσει σε ισάριθμα κουτιά χωρίς να περισσέψει κανένα ποτήρι;`
      : `A store has ${c.total} glasses. Which of the following packaging options CANNOT be used to pack them into equal boxes without any glass left over?`;

    const explanationNode = isEl ? (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Το {c.invalid} δεν είναι διαιρέτης του {c.total}, καθώς το</span>
        <Fraction num={c.total} den={c.invalid} />
        <span>αφήνει υπόλοιπο {c.total % c.invalid}. Οι υπόλοιποι αριθμοί διαιρούν ακριβώς το {c.total}.</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>The number {c.invalid} is not a divisor of {c.total}, as</span>
        <Fraction num={c.total} den={c.invalid} />
        <span>leaves a remainder of {c.total % c.invalid}. All other numbers divide {c.total} evenly.</span>
      </span>
    );

    return {
      type: 'mcq',
      correct: `${prefix} ${c.invalid}`,
      options,
      promptNode: <span>{promptText}</span>,
      explanation: explanationNode
    };
  }
}

function generateQuestions(locale = 'el') {
  return {
    q1: makeDivisorCountAndMissingQuestion(false, locale),
    q2: makeDivisorCountAndMissingQuestion(true, locale),
    q3: makeDivisorCheckQuestion(false, locale),
    q4: makeDivisorCheckQuestion(true, locale),
    q5: makePrimeCompositeQuestion(false, locale),
    q6: makePrimeCompositeQuestion(true, locale),
    q7: makeDistributionProblem(false, locale),
    q8: makeDistributionProblem(true, locale)
  };
}

export default function DiairetesAskPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

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
              {toCleanUppercase(badgeTitle)}
            </span>
            <div className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.promptNode}
            </div>
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
                {qData.explanation}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                {t.correctAnswerPrefix} <strong className="font-bold text-rose-950">{qData.correct}</strong>. {qData.explanation}
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
            <div className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.promptNode}
            </div>
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
                {qData.explanation}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                {t.correctAnswerPrefix} <strong className="font-bold text-rose-950">{qData.correct} {qData.unit}</strong>. {qData.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/07-diairetes"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K & 4K και responsive για κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              {toCleanUppercase(t.headerBadge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              {t.mainTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              {t.mainSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newExercisesBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ & PB SAFE AREA */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-36">
          {renderInput('q1', questions.q1, 1, t.b1, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.b2, 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, t.b3, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.b4, 'bg-indigo-600')}

          {renderMCQ('q5', questions.q5, 5, t.b5, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.b6, 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, t.b7, 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, t.b8, 'bg-purple-600')}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 {t.submitBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                {t.successRateLabel} <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
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
                <span>🔄</span> {t.newExercisesBtn}
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                {t.fillPromptBottom}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
// pages/e-dimotikou/08-mkd-ask.js
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

const TRANSLATIONS = {
  el: {
    metaTitle: "Ασκήσεις: Μέγιστος Κοινός Διαιρέτης (ΜΚΔ) - Ε' Δημοτικού | LearnMaths.gr",
    metaDesc: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στον ΜΚΔ: υπολογισμός 2 και 3 αριθμών, πρώτοι μεταξύ τους, αναγωγή κλασμάτων και προβλήματα ισοκατανομής.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    headerBadge: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "📝 Ασκήσεις: Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)",
    mainSubtitle: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRateLabel: "Επιτυχία:",
    fillPromptBottom: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctAnswerPrefix: "Η σωστή απάντηση είναι:",
    unitNumber: "αριθμός",
    unitGcdNumber: "αριθμός (ΜΚΔ)",
    unitPackages: "πακέτα",
    unitCm: "cm",

    // Badges
    b1: "ΜΚΔ ΔΥΟ ΑΡΙΘΜΩΝ",
    b2: "ΕΙΔΙΚΗ ΠΕΡΙΠΤΩΣΗ ΔΙΑΙΡΕΤΟΤΗΤΑΣ",
    b3: "ΜΚΔ ΤΡΙΩΝ ΑΡΙΘΜΩΝ",
    b4: "ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ ΑΡΙΘΜΟΙ",
    b5: "ΑΜΕΣΗ ΑΠΛΟΠΟΙΗΣΗ ΣΕ ΑΝΑΓΩΓΟ",
    b6: "ΕΥΡΕΣΗ ΑΝΑΓΩΓΟΥ ΚΛΑΣΜΑΤΟΣ",
    b7: "ΠΡΟΒΛΗΜΑ ΜΕΓΙΣΤΗΣ ΙΣΟΚΑΤΑΝΟΜΗΣ",
    b8: "ΠΡΟΒΛΗΜΑ ΚΟΠΗΣ ΣΕ ΜΕΓΙΣΤΟ ΜΗΚΟΣ",

    mkdSymbol: "ΜΚΔ",
    andWord: "και"
  },
  en: {
    metaTitle: "Exercises: Greatest Common Divisor (GCD) - 5th Grade | LearnMaths.gr",
    metaDesc: "Challenging 5th Grade math exercises on GCD: 2 and 3 numbers calculation, co-prime numbers, fraction reduction, and equal distribution problems.",
    backText: "5th Grade",
    theoryBtn: "Theory",
    headerBadge: "5TH GRADE • PRACTICE",
    mainTitle: "📝 Exercises: Greatest Common Divisor (GCD)",
    mainSubtitle: "Every time you click \"New Exercises\", fresh dynamic problems are generated!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRateLabel: "Success:",
    fillPromptBottom: "Complete all questions and click \"Check Answers\"!",
    correctAnswerPrefix: "The correct answer is:",
    unitNumber: "number",
    unitGcdNumber: "number (GCD)",
    unitPackages: "packages",
    unitCm: "cm",

    // Badges
    b1: "GCD OF TWO NUMBERS",
    b2: "SPECIAL DIVISIBILITY CASE",
    b3: "GCD OF THREE NUMBERS",
    b4: "RELATIVELY PRIME NUMBERS",
    b5: "DIRECT REDUCTION TO LOWEST TERMS",
    b6: "FINDING IRREDUCIBLE FRACTION",
    b7: "MAXIMUM EQUAL DISTRIBUTION PROBLEM",
    b8: "CUTTING AT MAXIMUM LENGTH PROBLEM",

    mkdSymbol: "GCD",
    andWord: "and"
  }
};

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Υπολογισμός ΜΚΔ 2 Αριθμών (Input)
function makeGcdTwoQuestion(isDivisibleCase = false, locale = 'el') {
  const isEl = locale === 'el';
  const sym = isEl ? 'ΜΚΔ' : 'GCD';
  const unit = isEl ? 'αριθμός' : 'number';

  if (!isDivisibleCase) {
    const pairs = [
      [24, 36], [28, 42], [30, 45], [32, 48], [36, 54], [40, 60], [42, 56], [48, 72]
    ];
    const [a, b] = pairs[getRandomInt(0, pairs.length - 1)];
    const correctVal = gcd(a, b);

    const promptText = isEl
      ? `Υπολόγισε τον Μέγιστο Κοινό Διαιρέτη των αριθμών ${a} και ${b}, δηλαδή τον ${sym}(${a}, ${b}):`
      : `Calculate the Greatest Common Divisor of ${a} and ${b}, that is ${sym}(${a}, ${b}):`;

    const explanationText = isEl
      ? `Οι κοινοί διαιρέτες των αριθμών ${a} και ${b} έχουν ως μεγαλύτερο στοιχείο το ${correctVal}. Επομένως ${sym}(${a}, ${b}) ＝ ${correctVal}.`
      : `The common divisors of ${a} and ${b} have ${correctVal} as their greatest element. Therefore ${sym}(${a}, ${b}) ＝ ${correctVal}.`;

    return {
      type: 'input',
      correct: correctVal,
      unit,
      promptNode: <span>{promptText}</span>,
      explanation: explanationText
    };
  } else {
    const small = [6, 8, 9, 12, 14, 15][getRandomInt(0, 5)];
    const factor = getRandomInt(3, 5);
    const big = small * factor;
    const correctVal = small;

    const promptText = isEl
      ? `Βρες τον ${sym}(${small}, ${big}):`
      : `Find ${sym}(${small}, ${big}):`;

    const explanationNode = isEl ? (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Επειδή ο αριθμός {big} διαιρείται ακριβώς με το {small} (</span>
        <Fraction num={big} den={small} />
        <span>＝ {factor}), ο Μέγιστος Κοινός Διαιρέτης τους είναι άμεσα ο ίδιος ο μικρότερος αριθμός: {sym}({small}, ${big}) ＝ {correctVal}.</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Since {big} is evenly divisible by {small} (</span>
        <Fraction num={big} den={small} />
        <span>＝ {factor}), their Greatest Common Divisor is directly the smaller number itself: ${sym}({small}, ${big}) ＝ {correctVal}.</span>
      </span>
    );

    return {
      type: 'input',
      correct: correctVal,
      unit,
      promptNode: <span>{promptText}</span>,
      explanation: explanationNode
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Υπολογισμός ΜΚΔ 3 Αριθμών & Πρώτοι Μεταξύ τους (MCQ)
function makeGcdThreeQuestion(isCoprime = false, locale = 'el') {
  const isEl = locale === 'el';
  const sym = isEl ? 'ΜΚΔ' : 'GCD';

  if (!isCoprime) {
    const triplets = [
      [18, 24, 36, 6],
      [24, 36, 48, 12],
      [20, 30, 50, 10],
      [16, 24, 40, 8],
      [28, 42, 70, 14],
      [30, 45, 60, 15]
    ];
    const [a, b, c, correctVal] = triplets[getRandomInt(0, triplets.length - 1)];

    const rawDistractors = [
      Math.round(correctVal / 2),
      correctVal === 12 ? 8 : correctVal + 2,
      correctVal === 6 ? 4 : correctVal - 2,
      correctVal * 2,
      correctVal + 4,
      Math.max(2, correctVal - 3)
    ].filter((v) => v !== correctVal && v > 1);

    const rawOptions = [correctVal, ...rawDistractors];
    const uniqueOptions = [...new Set(rawOptions.map(String))].slice(0, 4);
    const options = shuffleArray(uniqueOptions);

    const promptText = isEl
      ? `Ποιος είναι ο Μέγιστος Κοινός Διαιρέτης των αριθμών ${a}, ${b} και ${c}, δηλαδή ο ${sym}(${a}, ${b}, ${c});`
      : `What is the Greatest Common Divisor of ${a}, ${b}, and ${c}, that is ${sym}(${a}, ${b}, ${c})?`;

    const explanationText = isEl
      ? `Βρίσκουμε πρώτα τον ${sym} των δύο πρώτων αριθμών: ${sym}(${a}, ${b}) ＝ ${gcd(a, b)}. Έπειτα βρίσκουμε τον ${sym} του αποτελέσματος με τον τρίτο αριθμό: ${sym}(${gcd(a, b)}, ${c}) ＝ ${correctVal}.`
      : `First find the ${sym} of the first two numbers: ${sym}(${a}, ${b}) ＝ ${gcd(a, b)}. Then compute the ${sym} of that result with the third number: ${sym}(${gcd(a, b)}, ${c}) ＝ ${correctVal}.`;

    return {
      type: 'mcq',
      correct: String(correctVal),
      options,
      promptNode: <span>{promptText}</span>,
      explanation: explanationText
    };
  } else {
    const andW = isEl ? 'και' : 'and';
    const pairs = isEl
      ? [
          { text: `14 ${andW} 25`, isCoprime: true, expl: 'Ο αριθμός 14 έχει διαιρέτες {1, 2, 7, 14} και το 25 έχει {1, 5, 25}. Ο μόνος κοινός διαιρέτης είναι το 1 (ΜΚΔ ＝ 1).' },
          { text: `18 ${andW} 27`, isCoprime: false },
          { text: `15 ${andW} 35`, isCoprime: false },
          { text: `24 ${andW} 32`, isCoprime: false },
          { text: `21 ${andW} 28`, isCoprime: false }
        ]
      : [
          { text: `14 ${andW} 25`, isCoprime: true, expl: 'Number 14 has divisors {1, 2, 7, 14} and 25 has {1, 5, 25}. Their only common divisor is 1 (GCD ＝ 1).' },
          { text: `18 ${andW} 27`, isCoprime: false },
          { text: `15 ${andW} 35`, isCoprime: false },
          { text: `24 ${andW} 32`, isCoprime: false },
          { text: `21 ${andW} 28`, isCoprime: false }
        ];

    const correctPair = pairs[0];
    const distractors = pairs.slice(1);
    const rawOptions = [correctPair.text, ...distractors.map((d) => d.text)];
    const uniqueOptions = [...new Set(rawOptions)].slice(0, 4);
    const options = shuffleArray(uniqueOptions);

    const promptText = isEl
      ? `Ποιο από τα παρακάτω ζευγάρια αριθμών αποτελείται από αριθμούς ΠΡΩΤΟΥΣ ΜΕΤΑΞΥ ΤΟΥΣ (δηλαδή έχουν ${sym} ＝ 1);`
      : `Which of the following pairs of numbers consists of RELATIVELY PRIME (co-prime) numbers (having ${sym} ＝ 1)?`;

    const explanationText = isEl
      ? `Το ζεύγος ${correctPair.text} είναι πρώτοι μεταξύ τους, διότι ${correctPair.expl} Στα υπόλοιπα ζευγάρια υπάρχει κοινός διαιρέτης μεγαλύτερος του 1.`
      : `The pair ${correctPair.text} is co-prime because ${correctPair.expl} In the remaining pairs, there is a common divisor strictly greater than 1.`;

    return {
      type: 'mcq',
      correct: correctPair.text,
      options,
      promptNode: <span>{promptText}</span>,
      explanation: explanationText
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Εφαρμογή ΜΚΔ στην Απλοποίηση Κλασμάτων (Input & MCQ)
function makeFractionSimplificationQuestion(isMCQ = false, locale = 'el') {
  const isEl = locale === 'el';
  const sym = isEl ? 'ΜΚΔ' : 'GCD';

  const irreducibleBases = [
    [2, 3], [3, 4], [3, 5], [4, 7], [5, 6], [5, 8], [7, 9], [7, 12]
  ];
  const [irrNum, irrDen] = irreducibleBases[getRandomInt(0, irreducibleBases.length - 1)];
  const divisor = [6, 8, 9, 12, 14, 16][getRandomInt(0, 5)];
  const bigNum = irrNum * divisor;
  const bigDen = irrDen * divisor;

  if (!isMCQ) {
    const unit = isEl ? 'αριθμός (ΜΚΔ)' : 'number (GCD)';

    const promptNode = isEl ? (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Με ποιον αριθμό πρέπει να διαιρέσουμε ταυτόχρονα τον αριθμητή και τον παρονομαστή του κλάσματος</span>
        <Fraction num={bigNum} den={bigDen} />
        <span>ώστε να μετατραπεί σε ανάγωγο με ένα μόνο βήμα;</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>By what single number should we divide both the numerator and denominator of the fraction</span>
        <Fraction num={bigNum} den={bigDen} />
        <span>to simplify it to irreducible form in one step?</span>
      </span>
    );

    const explanationNode = isEl ? (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Για να γίνει ένα κλάσμα ανάγωγο με μία μόνο απλοποίηση, διαιρούμε και τους δύο όρους με τον Μέγιστο Κοινό Διαιρέτη τους: {sym}({bigNum}, {bigDen}) ＝ {divisor}.</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>To reduce a fraction to lowest terms in a single step, divide both terms by their Greatest Common Divisor: {sym}({bigNum}, {bigDen}) ＝ {divisor}.</span>
      </span>
    );

    return {
      type: 'input',
      correct: divisor,
      unit,
      promptNode,
      explanation: explanationNode
    };
  } else {
    const correctFrac = `${irrNum}/${irrDen}`;
    const rawDistractors = [
      `${irrNum * 2}/${irrDen * 2}`,
      `${irrNum + 1}/${irrDen}`,
      `${irrNum}/${irrDen + 1}`,
      `${irrNum + 2}/${irrDen + 2}`,
      `${irrDen}/${irrNum}`
    ].filter((f) => f !== correctFrac);

    const rawOptions = [correctFrac, ...rawDistractors];
    const uniqueOptions = [...new Set(rawOptions)].slice(0, 4);
    const options = shuffleArray(uniqueOptions);

    const promptNode = isEl ? (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Απλοποιώντας πλήρως το κλάσμα</span>
        <Fraction num={bigNum} den={bigDen} />
        <span>με τη βοήθεια του {sym} ({divisor}), ποιο ανάγωγο κλάσμα προκύπτει;</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>By fully simplifying the fraction</span>
        <Fraction num={bigNum} den={bigDen} />
        <span>using the {sym} ({divisor}), which irreducible fraction is obtained?</span>
      </span>
    );

    const explanationNode = isEl ? (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Διαιρούμε και τους δύο όρους με τον {sym}({bigNum}, {bigDen}) ＝ {divisor}:</span>
        <Fraction num={bigNum} den={bigDen} />
        <span>＝</span>
        <Fraction num={`${bigNum} : ${divisor}`} den={`${bigDen} : ${divisor}`} />
        <span>＝</span>
        <Fraction num={irrNum} den={irrDen} className="text-emerald-800 font-bold" />
        <span>(ανάγωγη μορφή: {correctFrac}).</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Divide numerator and denominator by {sym}({bigNum}, {bigDen}) ＝ {divisor}:</span>
        <Fraction num={bigNum} den={bigDen} />
        <span>＝</span>
        <Fraction num={`${bigNum} : ${divisor}`} den={`${bigDen} : ${divisor}`} />
        <span>＝</span>
        <Fraction num={irrNum} den={irrDen} className="text-emerald-800 font-bold" />
        <span>(irreducible form: {correctFrac}).</span>
      </span>
    );

    return {
      type: 'mcq',
      correct: correctFrac,
      options,
      promptNode,
      explanation: explanationNode
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Μέγιστης Ισοκατανομής (Input & MCQ)
function makeDistributionWordProblem(isInput = true, locale = 'el') {
  const isEl = locale === 'el';
  const sym = isEl ? 'ΜΚΔ' : 'GCD';

  if (isInput) {
    const multiplier = [6, 8, 12, 15][getRandomInt(0, 3)];
    const pensPerBag = getRandomInt(2, 4);
    const booksPerBag = pensPerBag + getRandomInt(1, 3);
    const totalPens = pensPerBag * multiplier;
    const totalBooks = booksPerBag * multiplier;
    const correctBags = gcd(totalPens, totalBooks);
    const unit = isEl ? 'πακέτα' : 'packages';

    const promptText = isEl
      ? `Ένας βιβλιοπώλης έχει ${totalPens} μαρκαδόρους και ${totalBooks} τετράδια. Θέλει να φτιάξει όμοια πακέτα δώρων χωρίς να περισσέψει κανένα αντικείμενο. Ποιος είναι ο ΜΕΓΙΣΤΟΣ αριθμός πακέτων που μπορεί να δημιουργήσει;`
      : `A bookstore has ${totalPens} markers and ${totalBooks} notebooks. The owner wants to make identical gift bags with none left over. What is the MAXIMUM number of bags that can be created?`;

    const explanationNode = isEl ? (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Ο μέγιστος αριθμός όμοιων πακέτων ισούται με τον Μέγιστο Κοινό Διαιρέτη των δύο ποσοτήτων: {sym}({totalPens}, {totalBooks}) ＝ {correctBags} πακέτα. Σε κάθε πακέτο αντιστοιχούν</span>
        <Fraction num={totalPens} den={correctBags} />
        <span>＝ {totalPens / correctBags} μαρκαδόροι και</span>
        <Fraction num={totalBooks} den={correctBags} />
        <span>＝ {totalBooks / correctBags} τετράδια.</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>The maximum number of identical bags equals the Greatest Common Divisor of both quantities: {sym}({totalPens}, {totalBooks}) ＝ {correctBags} packages. Each bag will contain</span>
        <Fraction num={totalPens} den={correctBags} />
        <span>＝ {totalPens / correctBags} markers and</span>
        <Fraction num={totalBooks} den={correctBags} />
        <span>＝ {totalBooks / correctBags} notebooks.</span>
      </span>
    );

    return {
      type: 'input',
      correct: correctBags,
      unit,
      promptNode: <span>{promptText}</span>,
      explanation: explanationNode
    };
  } else {
    const cases = [
      { l1: 48, l2: 72, correctLen: 24 },
      { l1: 60, l2: 84, correctLen: 12 },
      { l1: 75, l2: 90, correctLen: 15 },
      { l1: 80, l2: 120, correctLen: 40 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    const rawDistractors = [
      Math.round(c.correctLen / 2),
      c.correctLen === 24 ? 16 : c.correctLen + 6,
      c.correctLen === 40 ? 30 : c.correctLen + 10,
      c.correctLen * 2,
      Math.max(4, c.correctLen - 4)
    ].filter((v) => v !== c.correctLen && v > 0);

    const rawOptions = [c.correctLen, ...rawDistractors];
    const uniqueOptions = [...new Set(rawOptions)].slice(0, 4);
    const options = shuffleArray(uniqueOptions).map((v) => `${v} cm`);

    const promptText = isEl
      ? `Ένας μαραγκός έχει δύο ξύλινες δοκούς με μήκη ${c.l1} cm και ${c.l2} cm. Θέλει να τις κόψει σε ίσα κομμάτια που να έχουν το ΜΕΓΑΛΥΤΕΡΟ δυνατό μήκος, χωρίς να πάει χαμένο καθόλου ξύλο. Πόσο πρέπει να είναι το μήκος κάθε κομματιού;`
      : `A carpenter has two wooden beams with lengths of ${c.l1} cm and ${c.l2} cm. He wants to cut them into equal pieces of the GREATEST possible length, with no wood wasted. What should the length of each piece be?`;

    const explanationNode = isEl ? (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>Το μέγιστο κοινό μήκος κοπής ισούται με τον Μέγιστο Κοινό Διαιρέτη των μηκών: {sym}({c.l1}, {c.l2}) ＝ {c.correctLen} cm. Από την πρώτη δοκό προκύπτουν</span>
        <Fraction num={c.l1} den={c.correctLen} />
        <span>＝ {c.l1 / c.correctLen} κομμάτια και από τη δεύτερη</span>
        <Fraction num={c.l2} den={c.correctLen} />
        <span>＝ {c.l2 / c.correctLen} κομμάτια.</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1 leading-relaxed">
        <span>The maximum cut length equals the Greatest Common Divisor of the lengths: {sym}({c.l1}, {c.l2}) ＝ {c.correctLen} cm. The first beam yields</span>
        <Fraction num={c.l1} den={c.correctLen} />
        <span>＝ {c.l1 / c.correctLen} pieces and the second</span>
        <Fraction num={c.l2} den={c.correctLen} />
        <span>＝ {c.l2 / c.correctLen} pieces.</span>
      </span>
    );

    return {
      type: 'mcq',
      correct: `${c.correctLen} cm`,
      options,
      promptNode: <span>{promptText}</span>,
      explanation: explanationNode
    };
  }
}

function generateQuestions(locale = 'el') {
  return {
    q1: makeGcdTwoQuestion(false, locale),
    q2: makeGcdTwoQuestion(true, locale),
    q3: makeGcdThreeQuestion(false, locale),
    q4: makeGcdThreeQuestion(true, locale),
    q5: makeFractionSimplificationQuestion(false, locale),
    q6: makeFractionSimplificationQuestion(true, locale),
    q7: makeDistributionWordProblem(true, locale),
    q8: makeDistributionWordProblem(false, locale)
  };
}

export default function MkdAskPage() {
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
          href="/e-dimotikou/08-mkd"
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

          {renderInput('q5', questions.q5, 5, t.b5, 'bg-teal-600')}
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
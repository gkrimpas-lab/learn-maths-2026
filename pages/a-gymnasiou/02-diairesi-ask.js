import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός τόνων στα κεφαλαία με εξαίρεση το "Α'"
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Α')/g);
  return parts
    .map((part) => {
      if (part === "Α'") return "Α'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Inline helper για κατακόρυφη κλασματική μορφή (αριθμητής πάνω, γραμμή, παρονομαστής κάτω)
const renderFraction = (num, den) =>
  `<span class="inline-flex flex-col text-center align-middle mx-1 font-mono text-[0.9em] leading-none">` +
  `<span class="border-b border-current px-1 pb-0.5">${num}</span>` +
  `<span class="pt-0.5">${den}</span>` +
  `</span>`;

// Βοηθητική συνάρτηση τυχαίου ακέραιου [min, max]
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Βοηθητική συνάρτηση ανακατέματος πίνακα (Fisher-Yates)
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Εξασφάλιση 4 μοναδικών επιλογών σε MCQ χωρίς διπλότυπα
const makeUniqueOptions = (correct, wrongCandidates) => {
  const unique = new Set([correct]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  return shuffleArray(Array.from(unique));
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 20 ΔΙΑΦΟΡΕΤΙΚΩΝ ΤΥΠΩΝ ΑΣΚΗΣΕΩΝ ΔΙΑΙΡΕΣΗΣ (i18n)
// ========================================================
const EXERCISE_GENERATORS = [
  // 1. Εύρεση Διαιρετέου από την ταυτότητα (Input)
  (locale) => {
    const d = randInt(4, 9);
    const p = randInt(11, 25);
    const u = randInt(1, d - 1);
    const D = d * p + u;
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΕΥΚΛΕΙΔΕΙΑ ΔΙΑΙΡΕΣΗ' : 'EUCLIDEAN DIVISION',
      question: isEl
        ? `Σε μια διαίρεση ο διαιρέτης είναι ${d}, το πηλίκο ${p} και το υπόλοιπο ${u}. Ποιος είναι ο διαιρετέος;`
        : `In a division, the divisor is ${d}, the quotient is ${p}, and the remainder is ${u}. What is the dividend?`,
      correctAnswer: D.toString(),
      solution: isEl
        ? `Εφαρμόζουμε την ταυτότητα της Ευκλείδειας διαίρεσης: Δ ＝ δ · π ＋ υ ＝ ${d} · ${p} ＋ ${u} ＝ ${d * p} ＋ ${u} ＝ ${D}.`
        : `Applying the Euclidean division identity: D ＝ d · q ＋ r ＝ ${d} · ${p} ＋ ${u} ＝ ${d * p} ＋ ${u} ＝ ${D}.`,
    };
  },

  // 2. Εύρεση Πηλίκου και Υπολοίπου (Input)
  (locale) => {
    const d = randInt(4, 8);
    const p = randInt(6, 15);
    const u = randInt(1, d - 1);
    const D = d * p + u;
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΕΥΚΛΕΙΔΕΙΑ ΔΙΑΙΡΕΣΗ' : 'EUCLIDEAN DIVISION',
      question: isEl
        ? `Ποιο είναι το υπόλοιπο της διαίρεσης ${D} : ${d} ;`
        : `What is the remainder of the division ${D} : ${d} ?`,
      correctAnswer: u.toString(),
      solution: isEl
        ? `Διαιρώντας το ${D} με το ${d}, βρίσκουμε πηλίκο ${p} γιατί ${d} · ${p} ＝ ${d * p}. Άρα το υπόλοιπο είναι ${D} － ${d * p} ＝ ${u}.`
        : `Dividing ${D} by ${d}, the quotient is ${p} because ${d} · ${p} ＝ ${d * p}. Thus the remainder is ${D} － ${d * p} ＝ ${u}.`,
    };
  },

  // 3. Περιορισμός Υπολοίπου - Μέγιστο δυνατό υπόλοιπο (Input)
  (locale) => {
    const d = randInt(6, 25);
    const maxU = d - 1;
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΠΕΡΙΟΡΙΣΜΟΣ ΥΠΟΛΟΙΠΟΥ' : 'REMAINDER CONSTRAINT',
      question: isEl
        ? `Σε μια διαίρεση με διαιρέτη το ${d}, ποιο είναι το μεγαλύτερο δυνατό υπόλοιπο που μπορεί να εμφανιστεί;`
        : `In a division with divisor ${d}, what is the maximum possible remainder?`,
      correctAnswer: maxU.toString(),
      solution: isEl
        ? `Σε κάθε Ευκλείδεια διαίρεση ισχύει πάντοτε 0 ≤ υ ＜ δ. Επομένως, το μέγιστο δυνατό υπόλοιπο είναι δ － 1 ＝ ${d} － 1 ＝ ${maxU}.`
        : `In Euclidean division, 0 ≤ r ＜ d always holds. Thus, the maximum possible remainder is d － 1 ＝ ${d} － 1 ＝ ${maxU}.`,
    };
  },

  // 4. Έλεγχος αποδεκτής ταυτότητας διαίρεσης (MCQ)
  (locale) => {
    const d = randInt(5, 9);
    const p = randInt(6, 12);
    const uValid = randInt(1, d - 1);
    const D = d * p + uValid;
    const uInvalid = d + randInt(1, 4);
    const D_bad = d * (p - 1) + uInvalid;
    const isEl = locale === 'el';

    const correct = `${D} ＝ ${d} · ${p} ＋ ${uValid}`;
    const candidates = [
      `${D_bad} ＝ ${d} · ${p - 1} ＋ ${uInvalid}`,
      `${D} ＝ ${d} · ${p + 1} ＋ ${uValid + 2}`,
      `${D} ＝ ${d + 1} · ${p} ＋ ${uValid + 3}`,
    ];

    return {
      type: 'mcq',
      topic: isEl ? 'ΤΑΥΤΟΤΗΤΑ ΔΙΑΙΡΕΣΗΣ' : 'DIVISION IDENTITY',
      question: isEl
        ? `Ποια από τις παρακάτω ισότητες παριστάνει σωστά Ευκλείδεια διαίρεση με διαιρέτη το ${d};`
        : `Which of the following equalities correctly represents a Euclidean division with divisor ${d}?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Για να είναι σωστή η ισότητα Δ ＝ δ · π ＋ υ, πρέπει υποχρεωτικά το υπόλοιπο να είναι μικρότερο από τον διαιρέτη (υ ＜ δ). Μόνο στην ισότητα ${correct} ισχύει ${uValid} ＜ ${d}.`
        : `For the equality D ＝ d · q ＋ r to be valid, the remainder must strictly be less than the divisor (r ＜ d). Only in ${correct} is ${uValid} ＜ ${d}.`,
    };
  },

  // 5. Κριτήριο διαιρετότητας με το 3 (MCQ)
  (locale) => {
    const baseMult = randInt(25, 60) * 3;
    const correct = baseMult.toString();
    const wrong1 = (baseMult + 1).toString();
    const wrong2 = (baseMult + 2).toString();
    const wrong3 = (baseMult + 4).toString();
    const isEl = locale === 'el';

    return {
      type: 'mcq',
      topic: isEl ? 'ΚΡΙΤΗΡΙΑ ΔΙΑΙΡΕΤΟΤΗΤΑΣ' : 'DIVISIBILITY RULES',
      question: isEl
        ? `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το 3;`
        : `Which of the following numbers is divisible by 3?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: isEl
        ? `Ένας αριθμός διαιρείται με το 3 όταν το άθροισμα των ψηφίων του διαιρείται με το 3. Για τον αριθμό ${correct}, το άθροισμα των ψηφίων του είναι πολλαπλάσιο του 3.`
        : `A number is divisible by 3 when the sum of its digits is divisible by 3. For ${correct}, the sum of digits is a multiple of 3.`,
    };
  },

  // 6. Κριτήριο διαιρετότητας με το 9 (Input - Συμπλήρωση ψηφίου)
  (locale) => {
    const digitA = randInt(2, 8);
    const digitB = randInt(1, 7);
    const sum = digitA + digitB;
    let missing = (9 - (sum % 9)) % 9;
    if (missing === 0) missing = 9;
    const isEl = locale === 'el';

    return {
      type: 'input',
      topic: isEl ? 'ΚΡΙΤΗΡΙΑ ΔΙΑΙΡΕΤΟΤΗΤΑΣ' : 'DIVISIBILITY RULES',
      question: isEl
        ? `Ποιο ψηφίο πρέπει να μπει στη θέση του x ώστε ο τριψήφιος αριθμός ${digitA}${digitB}x να διαιρείται με το 9;`
        : `Which digit should replace x so that the 3-digit number ${digitA}${digitB}x is divisible by 9?`,
      correctAnswer: missing.toString(),
      solution: isEl
        ? `Για να διαιρείται με το 9, πρέπει το άθροισμα ${digitA} ＋ ${digitB} ＋ x ＝ ${sum} ＋ x να είναι πολλαπλάσιο του 9. Για x ＝ ${missing}, το άθροισμα γίνεται ${sum + missing} που διαιρείται με το 9.`
        : `To be divisible by 9, the sum ${digitA} ＋ ${digitB} ＋ x ＝ ${sum} ＋ x must be a multiple of 9. For x ＝ ${missing}, the sum becomes ${sum + missing}, which is divisible by 9.`,
    };
  },

  // 7. Κριτήριο διαιρετότητας με το 4 (MCQ)
  (locale) => {
    const correct = `${randInt(1, 9)}${['12', '16', '24', '28', '32', '36', '48'][randInt(0, 6)]}`;
    const wrong1 = `${randInt(1, 9)}${['13', '15', '23', '27', '31'][randInt(0, 4)]}`;
    const wrong2 = `${randInt(1, 9)}18`;
    const wrong3 = `${randInt(1, 9)}22`;
    const isEl = locale === 'el';

    return {
      type: 'mcq',
      topic: isEl ? 'ΚΡΙΤΗΡΙΑ ΔΙΑΙΡΕΤΟΤΗΤΑΣ' : 'DIVISIBILITY RULES',
      question: isEl
        ? `Ποιος από τους παρακάτω αριθμούς διαιρείται με το 4;`
        : `Which of the following numbers is divisible by 4?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: isEl
        ? `Ένας αριθμός διαιρείται με το 4 αν τα 2 τελευταία ψηφία του σχηματίζουν αριθμό που διαιρείται με το 4. Στον αριθμό ${correct}, τα δύο τελευταία ψηφία διαιρούνται ακριβώς με το 4.`
        : `A number is divisible by 4 if its last 2 digits form a number divisible by 4. In ${correct}, the last two digits are divisible by 4.`,
    };
  },

  // 8. Κριτήριο διαιρετότητας με το 25 (MCQ)
  (locale) => {
    const tails = ['25', '50', '75', '00'];
    const badTails = ['15', '35', '60', '85'];
    const correct = `${randInt(1, 8)}${tails[randInt(0, 3)]}`;
    const wrong1 = `${randInt(1, 8)}${badTails[0]}`;
    const wrong2 = `${randInt(1, 8)}${badTails[1]}`;
    const wrong3 = `${randInt(1, 8)}${badTails[2]}`;
    const isEl = locale === 'el';

    return {
      type: 'mcq',
      topic: isEl ? 'ΚΡΙΤΗΡΙΑ ΔΙΑΙΡΕΤΟΤΗΤΑΣ' : 'DIVISIBILITY RULES',
      question: isEl
        ? `Ποιος αριθμός διαιρείται ακριβώς με το 25;`
        : `Which number is divisible by 25?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: isEl
        ? `Ένας αριθμός διαιρείται με το 25 όταν τα δύο τελευταία ψηφία του είναι 00, 25, 50 ή 75. Επομένως ο ${correct} διαιρείται με το 25.`
        : `A number is divisible by 25 when its last two digits are 00, 25, 50, or 75. Therefore ${correct} is divisible by 25.`,
    };
  },

  // 9. Αναγνώριση πρώτου αριθμού (MCQ)
  (locale) => {
    const primes = [13, 17, 19, 23, 29, 31, 37, 41, 43];
    const composites = [15, 21, 27, 33, 35, 39, 49, 51];
    const pIdx = randInt(0, primes.length - 1);
    const correct = primes[pIdx].toString();

    const shuffledComp = shuffleArray(composites);
    const candidates = [shuffledComp[0].toString(), shuffledComp[1].toString(), shuffledComp[2].toString()];
    const isEl = locale === 'el';

    return {
      type: 'mcq',
      topic: isEl ? 'ΠΡΩΤΟΙ ΑΡΙΘΜΟΙ' : 'PRIME NUMBERS',
      question: isEl
        ? `Ποιος από τους παρακάτω αριθμούς είναι πρώτος;`
        : `Which of the following numbers is a prime number?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Ο αριθμός ${correct} είναι πρώτος επειδή έχει ακριβώς δύο διαιρέτες, το 1 και τον εαυτό του (${correct}). Οι υπόλοιποι είναι σύνθετοι γιατί έχουν και άλλους διαιρέτες.`
        : `${correct} is prime because it has exactly two divisors: 1 and itself (${correct}). The others are composite because they have additional divisors.`,
    };
  },

  // 10. Αναγνώριση σύνθετου αριθμού (MCQ)
  (locale) => {
    const primes = [11, 13, 17, 19, 23, 29, 31];
    const composites = [14, 22, 25, 27, 35, 49];
    const correct = composites[randInt(0, composites.length - 1)].toString();

    const shuffledPrimes = shuffleArray(primes);
    const candidates = [shuffledPrimes[0].toString(), shuffledPrimes[1].toString(), shuffledPrimes[2].toString()];
    const isEl = locale === 'el';

    return {
      type: 'mcq',
      topic: isEl ? 'ΣΥΝΘΕΤΟΙ ΑΡΙΘΜΟΙ' : 'COMPOSITE NUMBERS',
      question: isEl
        ? `Ποιος από τους παρακάτω αριθμούς είναι σύνθετος;`
        : `Which of the following numbers is a composite number?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Ο αριθμός ${correct} είναι σύνθετος επειδή έχει περισσότερους από δύο διαιρέτες (δεν διαιρείται μόνο με το 1 και τον εαυτό του).`
        : `${correct} is composite because it has more than two divisors (it is not divisible only by 1 and itself).`,
    };
  },

  // 11. Ο μοναδικός άρτιος πρώτος (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const noExistLabel = isEl ? 'Δεν υπάρχει' : 'None';
    return {
      type: 'mcq',
      topic: isEl ? 'ΠΡΩΤΟΙ ΑΡΙΘΜΟΙ' : 'PRIME NUMBERS',
      question: isEl
        ? `Ποιος είναι ο μοναδικός άρτιος πρώτος αριθμός;`
        : `Which is the only even prime number?`,
      options: makeUniqueOptions('2', ['0', '4', noExistLabel]),
      correctAnswer: '2',
      solution: isEl
        ? `Το 2 είναι ο μόνος άρτιος πρώτος αριθμός, καθώς έχει μόνο διαιρέτες το 1 και το 2. Κάθε άλλος μεγαλύτερος άρτιος αριθμός διαιρείται και με το 2, άρα είναι σύνθετος.`
        : `2 is the only even prime number, having only 1 and 2 as divisors. Every other even number is divisible by 2 and thus composite.`,
    };
  },

  // 12. Ειδική περίπτωση αριθμού 1 (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const correct = isEl ? 'Δεν είναι ούτε πρώτος ούτε σύνθετος' : 'Neither prime nor composite';
    const wrong = isEl
      ? [
          'Είναι ο μικρότερος πρώτος αριθμός',
          'Είναι σύνθετος αριθμός',
          'Είναι άρτιος αριθμός',
        ]
      : [
          'It is the smallest prime number',
          'It is a composite number',
          'It is an even number',
        ];

    return {
      type: 'mcq',
      topic: isEl ? 'ΠΡΩΤΟΙ ΑΡΙΘΜΟΙ' : 'PRIME NUMBERS',
      question: isEl
        ? `Ποιος από τους παρακάτω ισχυρισμούς είναι σωστός για τον αριθμό 1;`
        : `Which of the following statements is true for the number 1?`,
      options: makeUniqueOptions(correct, wrong),
      correctAnswer: correct,
      solution: isEl
        ? `Ο αριθμός 1 δεν είναι πρώτος (απαιτούνται ακριβώς 2 διαιρέτες) ούτε σύνθετος (απαιτούνται περισσότεροι από 2 διαιρέτες), αφού έχει μόνο 1 διαιρέτη, τον εαυτό του.`
        : `The number 1 is neither prime (requires exactly 2 divisors) nor composite (requires more than 2 divisors), since it has only 1 divisor: itself.`,
    };
  },

  // 13. Πλήθος διαιρετών πρώτου αριθμού (Input)
  (locale) => {
    const p = [13, 17, 29, 43, 67][randInt(0, 4)];
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΠΡΩΤΟΙ ΑΡΙΘΜΟΙ' : 'PRIME NUMBERS',
      question: isEl
        ? `Πόσους διαιρέτες έχει συνολικά ο πρώτος αριθμός ${p};`
        : `How many total divisors does the prime number ${p} have?`,
      correctAnswer: '2',
      solution: isEl
        ? `Κάθε πρώτος αριθμός έχει εξ ορισμού ακριβώς 2 διαιρέτες: το 1 και τον εαυτό του. Επομένως ο ${p} έχει 2 διαιρέτες.`
        : `Every prime number by definition has exactly 2 divisors: 1 and itself. Thus ${p} has 2 divisors.`,
    };
  },

  // 14. Τέλεια διαίρεση - Εύρεση διαιρέτη με Κλασματική Μορφή (Input)
  (locale) => {
    const d = randInt(4, 9);
    const p = randInt(7, 14);
    const D = d * p;
    const isEl = locale === 'el';

    const fractionFormula = isEl
      ? `δ ＝ ${renderFraction('Δ', 'π')} ＝ ${renderFraction(D, p)} ＝ ${d}`
      : `d ＝ ${renderFraction('D', 'q')} ＝ ${renderFraction(D, p)} ＝ ${d}`;

    return {
      type: 'input',
      topic: isEl ? 'ΤΕΛΕΙΑ ΔΙΑΙΡΕΣΗ' : 'EXACT DIVISION',
      question: isEl
        ? `Σε μια τέλεια διαίρεση ο διαιρετέος είναι ${D} και το πηλίκο ${p}. Ποιος είναι ο διαιρέτης;`
        : `In an exact division, the dividend is ${D} and the quotient is ${p}. What is the divisor?`,
      correctAnswer: d.toString(),
      solution: isEl
        ? `Στην τέλεια διαίρεση ισχύει Δ ＝ δ · π. Επομένως ${fractionFormula}.`
        : `In exact division D ＝ d · q holds. Therefore ${fractionFormula}.`,
    };
  },

  // 15. Ταυτόχρονη διαίρεση με 2 και 5 (MCQ)
  (locale) => {
    const correct = `${randInt(11, 89)}0`;
    const wrong1 = `${randInt(11, 89)}5`;
    const wrong2 = `${randInt(11, 89)}2`;
    const wrong3 = `${randInt(11, 89)}8`;
    const isEl = locale === 'el';

    return {
      type: 'mcq',
      topic: isEl ? 'ΚΡΙΤΗΡΙΑ ΔΙΑΙΡΕΤΟΤΗΤΑΣ' : 'DIVISIBILITY RULES',
      question: isEl
        ? `Ποιος αριθμός διαιρείται ταυτόχρονα και με το 2 και με το 5;`
        : `Which number is divisible by both 2 and 5?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: isEl
        ? `Ένας αριθμός που διαιρείται και με το 2 και με το 5 διαιρείται με το 10, άρα πρέπει υποχρεωτικά να λήγει σε 0. Επομένως είναι ο ${correct}.`
        : `A number divisible by both 2 and 5 is divisible by 10, so it must end in 0. Therefore it is ${correct}.`,
    };
  },

  // 16. Ταυτόχρονη διαίρεση με 3 και 5 (Input - Συμπλήρωση ψηφίου)
  (locale) => {
    const a = randInt(1, 4);
    const sumFixed = a + 5;
    const ansDigit = (3 - (sumFixed % 3)) % 3;
    const isEl = locale === 'el';

    return {
      type: 'input',
      topic: isEl ? 'ΚΡΙΤΗΡΙΑ ΔΙΑΙΡΕΤΟΤΗΤΑΣ' : 'DIVISIBILITY RULES',
      question: isEl
        ? `Ποιο είναι το μικρότερο ψηφίο x ώστε ο αριθμός ${a}x5 να διαιρείται ταυτόχρονα με το 3 και το 5;`
        : `What is the smallest digit x such that ${a}x5 is divisible by both 3 and 5?`,
      correctAnswer: ansDigit.toString(),
      solution: isEl
        ? `Ο αριθμός λήγει σε 5, άρα διαιρείται ήδη με το 5. Για να διαιρείται και με το 3, πρέπει το άθροισμα των ψηφίων ${a} ＋ x ＋ 5 ＝ ${sumFixed} ＋ x να διαιρείται με το 3. Το μικρότερο ψηφίο είναι το ${ansDigit}.`
        : `The number ends in 5, so it is already divisible by 5. To be divisible by 3, the sum of digits ${a} ＋ x ＋ 5 ＝ ${sumFixed} ＋ x must be divisible by 3. The smallest digit is ${ansDigit}.`,
    };
  },

  // 17. Εύρεση όλων των διαιρετών (Input)
  (locale) => {
    const num = [6, 8, 10, 14, 15][randInt(0, 4)];
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΔΙΑΙΡΕΤΕΣ' : 'DIVISORS',
      question: isEl
        ? `Πόσους διαφορετικούς φυσικούς διαιρέτες έχει ο αριθμός ${num};`
        : `How many distinct natural divisors does ${num} have?`,
      correctAnswer: '4',
      solution: isEl
        ? `Οι διαιρέτες του ${num} προκύπτουν από τις αναλύσεις γινομένων. Ο ${num} έχει ακριβώς 4 διαιρέτες (το 1, τον εαυτό του και δύο ενδιάμεσους παράγοντες).`
        : `The divisors of ${num} are obtained through factorization. ${num} has exactly 4 divisors (1, itself, and two intermediate factors).`,
    };
  },

  // 18. Πολλαπλάσια φυσικού αριθμού (MCQ)
  (locale) => {
    const base = randInt(6, 11);
    const k = randInt(4, 9);
    const correct = (base * k).toString();
    const wrong1 = (base * k + 2).toString();
    const wrong2 = (base * k - 3).toString();
    const wrong3 = (base * (k + 1) - 1).toString();
    const isEl = locale === 'el';

    return {
      type: 'mcq',
      topic: isEl ? 'ΠΟΛΛΑΠΛΑΣΙΑ' : 'MULTIPLES',
      question: isEl
        ? `Ποιος από τους παρακάτω αριθμούς είναι πολλαπλάσιο του ${base};`
        : `Which of the following numbers is a multiple of ${base}?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: isEl
        ? `Πολλαπλάσιο του ${base} είναι κάθε αριθμός που προκύπτει από τον τύπο ${base} · κ. Εδώ ${base} · ${k} ＝ ${correct}.`
        : `A multiple of ${base} is any number given by ${base} · k. Here ${base} · ${k} ＝ ${correct}.`,
    };
  },

  // 19. Πρόβλημα με υπόλοιπο Ευκλείδειας διαίρεσης (Input)
  (locale) => {
    const students = randInt(32, 58);
    const teamSize = 5;
    const leftover = students % teamSize;
    const isEl = locale === 'el';

    return {
      type: 'input',
      topic: isEl ? 'ΠΡΟΒΛΗΜΑΤΑ ΔΙΑΙΡΕΣΗΣ' : 'DIVISION PROBLEMS',
      question: isEl
        ? `Θέλουμε να χωρίσουμε ${students} μαθητές σε ισοδύναμες ομάδες των ${teamSize} ατόμων. Πόσοι μαθητές θα περισσέψουν;`
        : `We want to divide ${students} students into equal teams of ${teamSize}. How many students will be left over?`,
      correctAnswer: leftover.toString(),
      solution: isEl
        ? `Εκτελούμε την Ευκλείδεια διαίρεση ${students} : ${teamSize}. Έχουμε ${students} ＝ ${teamSize} · ${Math.floor(students / teamSize)} ＋ ${leftover}. Άρα περισσεύουν ${leftover} μαθητές.`
        : `Executing Euclidean division ${students} : ${teamSize}, we have ${students} ＝ ${teamSize} · ${Math.floor(students / teamSize)} ＋ ${leftover}. Thus ${leftover} students are left over.`,
    };
  },

  // 20. Αδύνατη τιμή υπολοίπου (MCQ)
  (locale) => {
    const d = randInt(6, 12);
    const invalidU = d + randInt(0, 3);
    const val1 = randInt(0, 2);
    const val2 = randInt(3, d - 2);
    const val3 = d - 1;
    const isEl = locale === 'el';

    return {
      type: 'mcq',
      topic: isEl ? 'ΠΕΡΙΟΡΙΣΜΟΣ ΥΠΟΛΟΙΠΟΥ' : 'REMAINDER CONSTRAINT',
      question: isEl
        ? `Σε μια διαίρεση με διαιρέτη το ${d}, ποιο από τα παρακάτω ΔΕΝ μπορεί να είναι το υπόλοιπο;`
        : `In a division with divisor ${d}, which of the following CANNOT be the remainder?`,
      options: makeUniqueOptions(invalidU.toString(), [val1.toString(), val2.toString(), val3.toString()]),
      correctAnswer: invalidU.toString(),
      solution: isEl
        ? `Το υπόλοιπο πρέπει να ικανοποιεί πάντα τον περιορισμό 0 ≤ υ ＜ ${d}. Το ${invalidU} είναι μεγαλύτερο ή ίσο του διαιρέτη ${d}, επομένως είναι αδύνατο να αποτελεί υπόλοιπο.`
        : `The remainder must always satisfy 0 ≤ r ＜ ${d}. Since ${invalidU} is greater than or equal to divisor ${d}, it cannot be a remainder.`,
    };
  },
];

// UI Λεξικό
const translations = {
  el: {
    metaTitle: "Ασκήσεις: Ευκλείδεια Διαίρεση & Διαιρετότητα | Α' Γυμνασίου",
    metaDescription: "10 δυναμικές ασκήσεις στην Ευκλείδεια διαίρεση, τα κριτήρια διαιρετότητας και τους πρώτους αριθμούς.",
    backText: "Α' Γυμνασίου",
    actionButton: "ΘΕΩΡΙΑ",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Ευκλείδεια Διαίρεση & Διαιρετότητα",
    mainSubtitle: "Επίλυσε τις 10 επιλεγμένες ασκήσεις. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    inputPlaceholder: "Απάντηση...",
    correctTag: "ΣΩΣΤΟ",
    wrongTag: "ΛΑΘΟΣ",
    correctAnswerLabel: "ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:",
    checkAnswers: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
    checkShort: "ΕΛΕΓΧΟΣ",
    newExercises: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    retryShort: "ΕΠΑΝΑΛΗΨΗ",
    finalScore: "ΤΕΛΙΚΟ ΣΚΟΡ",
    progress: "ΠΡΟΟΔΟΣ",
    successRate: "ΕΠΙΤΥΧΙΑ",
  },
  en: {
    metaTitle: "Exercises: Euclidean Division & Divisibility | 7th Grade",
    metaDescription: "10 dynamic exercises on Euclidean division, divisibility criteria, and prime numbers.",
    backText: "7th Grade",
    actionButton: "THEORY",
    badge: "7TH GRADE • PRACTICE",
    mainTitle: "Euclidean Division & Divisibility",
    mainSubtitle: "Solve the 10 selected exercises. Then click 'CHECK ANSWERS' to view your score and detailed solutions.",
    inputPlaceholder: "Answer...",
    correctTag: "CORRECT",
    wrongTag: "INCORRECT",
    correctAnswerLabel: "CORRECT ANSWER:",
    checkAnswers: "CHECK ANSWERS",
    checkShort: "CHECK",
    newExercises: "NEW EXERCISES",
    retryShort: "RETRY",
    finalScore: "FINAL SCORE",
    progress: "PROGRESS",
    successRate: "SUCCESS RATE",
  },
};

export default function DiairesiAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = translations[locale] || translations.el;

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή 10 τυχαίων ερωτήσεων
  const generateQuestions = () => {
    const shuffledGen = shuffleArray(EXERCISE_GENERATORS);
    const selected = shuffledGen.slice(0, 10).map((gen, idx) => ({
      id: idx + 1,
      ...gen(locale),
    }));
    setQuestions(selected);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    generateQuestions();
  }, [locale]);

  // Αυστηρός έλεγχος εισαγωγής input (μόνο ψηφία και έως ένα κόμμα, max 10 χαρακτήρες)
  const handleInputChange = (id, val) => {
    if (isSubmitted) return;
    let clean = val.replace('.', ',');
    clean = clean.replace(/[^0-9,]/g, '');
    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) return;
    if (clean.length > 10) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  // Υποβολή και έλεγχος
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      const userAns = (userAnswers[q.id] || '').trim().replace(/\s+/g, '');
      const correctAns = q.correctAnswer.trim().replace(/\s+/g, '');
      if (userAns === correctAns) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && userAnswers[k].trim() !== ''
  ).length;

  const scorePercentage = Math.round((score / 10) * 100);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/02-diairesi"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.actionButton)}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* Banner Header - Ενιαίο Indigo Theme χωρίς τόνους στα κεφαλαία */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {t.mainTitle}
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const isCorrect =
                isSubmitted &&
                userAns.trim().replace(/\s+/g, '') ===
                  q.correctAnswer.trim().replace(/\s+/g, '');

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-xs sm:text-sm">
                        {q.id}
                      </span>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md">
                        {toCleanUppercase(q.topic)}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ */}
                  <div className="space-y-2 pt-2">
                    {q.type === 'input' ? (
                      <div className="relative max-w-xs">
                        <input
                          type="text"
                          inputMode="decimal"
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder={t.inputPlaceholder}
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-base font-bold rounded-xl border transition-all outline-none font-mono ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                                : 'bg-rose-50 border-rose-500 text-rose-950'
                              : 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAns === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleMCQSelect(q.id, opt)}
                              className={`min-h-[44px] px-3 py-2 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between transition-all touch-manipulation active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span
                                className="break-words whitespace-normal leading-snug flex-1 mr-2"
                                dangerouslySetInnerHTML={{ __html: opt }}
                              />
                              {isSelected && <span className="font-black">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση μετά την υποβολή */}
                    {isSubmitted && (
                      <div
                        className={`p-4 rounded-xl text-xs sm:text-sm space-y-2.5 mt-3 border ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-sm sm:text-base">
                            <span>✅</span>
                            <span>{toCleanUppercase(t.correctTag)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>{toCleanUppercase(t.wrongTag)}</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-block font-mono">
                              {toCleanUppercase(t.correctAnswerLabel)}{' '}
                              <span
                                className="text-emerald-700 font-black ml-1"
                                dangerouslySetInnerHTML={{ __html: q.correctAnswer }}
                              />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-relaxed font-normal pt-1.5 border-t border-slate-200/60 font-mono"
                          dangerouslySetInnerHTML={{ __html: q.solution }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Κουμπί Υποβολής / Ανανέωσης εντός σελίδας */}
          <div className="flex justify-center pt-4">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount === 0}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkAnswers)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newExercises)}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {isSubmitted ? toCleanUppercase(t.finalScore) : toCleanUppercase(t.progress)}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 10` : `${answeredCount} / 10`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {toCleanUppercase(t.successRate)}
                </div>
                <div
                  className={`text-base sm:text-xl font-black font-mono ${
                    scorePercentage >= 80
                      ? 'text-emerald-400'
                      : scorePercentage >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {scorePercentage}%
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={generateQuestions}
              className="px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">{toCleanUppercase(t.newExercises)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkShort)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                {toCleanUppercase(t.retryShort)}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
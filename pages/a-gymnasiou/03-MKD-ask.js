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

// Βοηθητική συνάρτηση τυχαίου ακέραιου [min, max]
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Βοηθητική συνάρτηση ανακατέματος πίνακα (Fisher-Yates)
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
};

// Εξασφάλιση μοναδικών επιλογών σε MCQ χωρίς διπλότυπα
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

// Υπολογισμός ΜΚΔ 2 αριθμών (Ευκλείδης)
const gcd2 = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
};

// Υπολογισμός ΜΚΔ πίνακα αριθμών
const gcdArray = (arr) => arr.reduce((acc, curr) => gcd2(acc, curr), arr[0]);

// ========================================================
// ΔΕΞΑΜΕΝΗ 20 ΔΙΑΦΟΡΕΤΙΚΩΝ ΤΥΠΩΝ ΑΣΚΗΣΕΩΝ ΜΚΔ (i18n)
// ========================================================
const EXERCISE_GENERATORS = [
  // 1. ΜΚΔ δύο απλών αριθμών (Input)
  (locale) => {
    const g = randInt(2, 6);
    const m1 = [3, 4, 5, 7][randInt(0, 3)];
    let m2 = [3, 4, 5, 7][randInt(0, 3)];
    while (gcd2(m1, m2) !== 1) {
      m2 = randInt(2, 9);
    }
    const a = g * m1;
    const b = g * m2;
    const ans = gcd2(a, b);
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'input',
      topic: isEl ? 'ΜΚΔ ΔΥΟ ΑΡΙΘΜΩΝ' : 'GCD OF TWO NUMBERS',
      question: isEl
        ? `Υπολόγισε τον Μέγιστο Κοινό Διαιρέτη των αριθμών ${a} και ${b}: ${tag}(${a}, ${b})`
        : `Calculate the Greatest Common Divisor of ${a} and ${b}: ${tag}(${a}, ${b})`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `Οι κοινοί διαιρέτες των αριθμών ${a} και ${b} έχουν ως μεγαλύτερο αριθμό το ${ans}. Επομένως ${tag}(${a}, ${b}) ＝ ${ans}.`
        : `The common divisors of ${a} and ${b} have ${ans} as their largest. Therefore ${tag}(${a}, ${b}) ＝ ${ans}.`,
    };
  },

  // 2. ΜΚΔ τριών αριθμών (Input)
  (locale) => {
    const g = [2, 3, 4, 5, 6][randInt(0, 4)];
    const m = [2, 3, 5];
    const a = g * m[0];
    const b = g * m[1];
    const c = g * m[2];
    const ans = gcdArray([a, b, c]);
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'input',
      topic: isEl ? 'ΜΚΔ ΤΡΙΩΝ ΑΡΙΘΜΩΝ' : 'GCD OF THREE NUMBERS',
      question: isEl
        ? `Υπολόγισε τον Μέγιστο Κοινό Διαιρέτη: ${tag}(${a}, ${b}, ${c})`
        : `Calculate the Greatest Common Divisor: ${tag}(${a}, ${b}, ${c})`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `Βρίσκουμε τους κοινούς διαιρέτες και των τριών αριθμών ή αναλύουμε σε πρώτους παράγοντες. Ο ${tag}(${a}, ${b}, ${c}) ＝ ${ans}.`
        : `Finding common divisors of all three numbers or factoring into primes: ${tag}(${a}, ${b}, ${c}) ＝ ${ans}.`,
    };
  },

  // 3. ΜΚΔ τεσσάρων αριθμών (Input)
  (locale) => {
    const g = [2, 4, 5, 6][randInt(0, 3)];
    const a = g * 2;
    const b = g * 3;
    const c = g * 4;
    const d = g * 5;
    const ans = gcdArray([a, b, c, d]);
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'input',
      topic: isEl ? 'ΜΚΔ ΤΕΣΣΑΡΩΝ ΑΡΙΘΜΩΝ' : 'GCD OF FOUR NUMBERS',
      question: isEl
        ? `Υπολόγισε τον Μέγιστο Κοινό Διαιρέτη των 4 αριθμών: ${tag}(${a}, ${b}, ${c}, ${d})`
        : `Calculate the Greatest Common Divisor of the 4 numbers: ${tag}(${a}, ${b}, ${c}, ${d})`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `Ο μεγαλύτερος φυσικός αριθμός που διαιρεί ταυτόχρονα και τους τέσσερις αριθμούς (${a}, ${b}, ${c}, ${d}) είναι το ${ans}.`
        : `The largest natural number that divides all four numbers (${a}, ${b}, ${c}, ${d}) simultaneously is ${ans}.`,
    };
  },

  // 4. Εύρεση ΜΚΔ από έτοιμη ανάλυση πρώτων παραγόντων (MCQ)
  (locale) => {
    const correct = '2<sup>2</sup> · 3<sup>2</sup>';
    const candidates = [
      '2<sup>3</sup> · 3<sup>3</sup>',
      '2<sup>2</sup> · 3 · 5',
      '2 · 3',
      '2<sup>3</sup> · 3<sup>2</sup> · 5 · 7',
    ];
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    const varA = isEl ? 'α' : 'a';
    const varB = isEl ? 'β' : 'b';
    return {
      type: 'mcq',
      topic: isEl ? 'ΑΝΑΛΥΣΗ ΣΕ ΠΡΩΤΟΥΣ' : 'PRIME FACTORIZATION',
      question: isEl
        ? `Αν ${varA} ＝ 2<sup>3</sup> · 3<sup>2</sup> · 5 και ${varB} ＝ 2<sup>2</sup> · 3<sup>3</sup> · 7, ποιος είναι ο ${tag}(${varA}, ${varB}) σε μορφή γινομένου πρώτων παραγόντων;`
        : `If ${varA} ＝ 2<sup>3</sup> · 3<sup>2</sup> · 5 and ${varB} ＝ 2<sup>2</sup> · 3<sup>3</sup> · 7, what is ${tag}(${varA}, ${varB}) in prime factored form?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Επιλέγουμε μόνο τους κοινούς πρώτους παράγοντες (το 2 και το 3) με τον μικρότερο εκθέτη: για το 2 είναι το 2 (2<sup>2</sup>) και για το 3 είναι το 2 (3<sup>2</sup>). Άρα ${tag} ＝ 2<sup>2</sup> · 3<sup>2</sup>.`
        : `We select only the common prime factors (2 and 3) with the lowest exponents: for 2 it is 2 (2<sup>2</sup>) and for 3 it is 2 (3<sup>2</sup>). Thus ${tag} ＝ 2<sup>2</sup> · 3<sup>2</sup>.`,
    };
  },

  // 5. Υπολογισμός τιμής από ανάλυση πρώτων παραγόντων (Input)
  (locale) => {
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'input',
      topic: isEl ? 'ΑΝΑΛΥΣΗ ΣΕ ΠΡΩΤΟΥΣ' : 'PRIME FACTORIZATION',
      question: isEl
        ? `Αν ο ${tag} τριών αριθμών προκύπτει από το γινόμενο 2<sup>2</sup> · 5, ποια είναι η τελική αριθμητική τιμή του ${tag};`
        : `If the ${tag} of three numbers is given by the product 2<sup>2</sup> · 5, what is its numerical value?`,
      correctAnswer: '20',
      solution: isEl
        ? `Υπολογίζουμε τις δυνάμεις και το γινόμενο: 2<sup>2</sup> · 5 ＝ 4 · 5 ＝ 20.`
        : `Evaluating powers and multiplying: 2<sup>2</sup> · 5 ＝ 4 · 5 ＝ 20.`,
    };
  },

  // 6. Πρώτοι μεταξύ τους αριθμοί (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    const varA = isEl ? 'α' : 'a';
    const varB = isEl ? 'β' : 'b';
    const correct = `${tag}(${varA}, ${varB}) ＝ 1`;
    const candidates = [
      `${tag}(${varA}, ${varB}) ＝ 0`,
      `${varA} ＋ ${varB} ＝ 1`,
      `${varA} · ${varB} ＝ 1`,
    ];
    return {
      type: 'mcq',
      topic: isEl ? 'ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ' : 'COPRIME NUMBERS',
      question: isEl
        ? `Πότε δύο φυσικοί αριθμοί ${varA} και ${varB} ονομάζονται πρώτοι μεταξύ τους;`
        : `When are two natural numbers ${varA} and ${varB} called relatively prime (coprime)?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Δύο αριθμοί λέγονται πρώτοι μεταξύ τους όταν ο μόνος κοινός διαιρέτης τους είναι η μονάδα, δηλαδή όταν ${tag}(${varA}, ${varB}) ＝ 1.`
        : `Two numbers are called coprime when their only common divisor is 1, which means ${tag}(${varA}, ${varB}) ＝ 1.`,
    };
  },

  // 7. Αναγνώριση ζεύγους πρώτων μεταξύ τους αριθμών (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    const andWord = isEl ? 'και' : 'and';
    const correct = `8 ${andWord} 9`;
    const candidates = [
      `6 ${andWord} 9`,
      `10 ${andWord} 15`,
      `14 ${andWord} 21`,
    ];
    return {
      type: 'mcq',
      topic: isEl ? 'ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ' : 'COPRIME NUMBERS',
      question: isEl
        ? `Ποιο από τα παρακάτω ζεύγη αριθμών αποτελείται από αριθμούς πρώτους μεταξύ τους;`
        : `Which of the following pairs consists of relatively prime (coprime) numbers?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Για το 8 και το 9 έχουμε ${tag}(8, 9) ＝ 1 (δεν έχουν κανέναν κοινό πρώτο παράγοντα). Τα υπόλοιπα ζεύγη έχουν κοινό διαιρέτη το 3, το 5 ή το 7.`
        : `For 8 and 9 we have ${tag}(8, 9) ＝ 1 (they share no common prime factors). The other pairs share common divisors 3, 5, or 7.`,
    };
  },

  // 8. Ιδιότητα: Ο ένας αριθμός διαιρεί τον άλλον (MCQ)
  (locale) => {
    const small = randInt(4, 9);
    const mult = randInt(3, 6);
    const big = small * mult;
    const correct = small.toString();
    const candidates = [big.toString(), '1', (small * 2).toString()];
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'mcq',
      topic: isEl ? 'ΙΔΙΟΤΗΤΕΣ ΜΚΔ' : 'GCD PROPERTIES',
      question: isEl
        ? `Αν ο αριθμός ${small} διαιρεί ακριβώς τον αριθμό ${big}, ποιος είναι ο ${tag}(${small}, ${big});`
        : `If ${small} divides ${big} exactly, what is ${tag}(${small}, ${big})?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Όταν ένας φυσικός αριθμός διαιρεί έναν άλλον, ο Μέγιστος Κοινός Διαιρέτης τους είναι ο μικρότερος από τους δύο αριθμούς. Άρα ${tag}(${small}, ${big}) ＝ ${small}.`
        : `When a natural number divides another, their Greatest Common Divisor is the smaller of the two. Thus ${tag}(${small}, ${big}) ＝ ${small}.`,
    };
  },

  // 9. Πρακτικό πρόβλημα: Ισοδύναμα πακέτα (Input)
  (locale) => {
    const g = [4, 6, 8, 10][randInt(0, 3)];
    const apples = g * randInt(2, 5);
    const oranges = g * 7;
    const ans = gcd2(apples, oranges);
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'input',
      topic: isEl ? 'ΠΡΟΒΛΗΜΑΤΑ ΜΚΔ' : 'GCD PROBLEMS',
      question: isEl
        ? `Ένας οπωροπώλης έχει ${apples} μήλα και ${oranges} πορτοκάλια. Θέλει να φτιάξει τον μέγιστο δυνατό αριθμό ομοιόμορφων καλαθιών χωρίς να περισσέψει κανένα φρούτο. Πόσα καλάθια θα φτιάξει;`
        : `A fruit seller has ${apples} apples and ${oranges} oranges. He wants to make the maximum number of identical baskets without leftovers. How many baskets will he make?`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `Το πλήθος των καλαθιών πρέπει να διαιρεί ακριβώς και τα μήλα και τα πορτοκάλια, και να είναι το μέγιστο δυνατό. Άρα ισούται με ${tag}(${apples}, ${oranges}) ＝ ${ans} καλάθια.`
        : `The number of baskets must divide both quantities and be maximized. Thus it equals ${tag}(${apples}, ${oranges}) ＝ ${ans} baskets.`,
    };
  },

  // 10. Πρακτικό πρόβλημα: Κοπή κορδελών σε μέγιστα ίσα τμήματα (Input)
  (locale) => {
    const g = [3, 5, 7, 9][randInt(0, 3)];
    const r1 = g * 4;
    const r2 = g * 6;
    const ans = gcd2(r1, r2);
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'input',
      topic: isEl ? 'ΠΡΟΒΛΗΜΑΤΑ ΜΚΔ' : 'GCD PROBLEMS',
      question: isEl
        ? `Έχουμε δύο κορδέλες με μήκη ${r1} cm και ${r2} cm. Θέλουμε να τις κόψουμε σε ίσα κομμάτια με το μεγαλύτερο δυνατό μήκος χωρίς να περισσέψει τίποτα. Πόσα cm θα είναι το κάθε κομμάτι;`
        : `We have two ribbons of length ${r1} cm and ${r2} cm. We want to cut them into equal pieces of the maximum possible length without leftovers. How many cm will each piece be?`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `Το μέγιστο μήκος κάθε κομματιού είναι ο ${tag} των μηκών: ${tag}(${r1}, ${r2}) ＝ ${ans} cm.`
        : `The maximum length of each piece is the ${tag} of the lengths: ${tag}(${r1}, ${r2}) ＝ ${ans} cm.`,
    };
  },

  // 11. ΜΚΔ διαδοχικών φυσικών αριθμών (MCQ)
  (locale) => {
    const n = randInt(15, 80);
    const nextN = n + 1;
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'mcq',
      topic: isEl ? 'ΙΔΙΟΤΗΤΕΣ ΜΚΔ' : 'GCD PROPERTIES',
      question: isEl
        ? `Πόσο ισούται πάντοτε ο ${tag} δύο διαδοχικών φυσικών αριθμών, όπως ${tag}(${n}, ${nextN});`
        : `What is always the ${tag} of two consecutive natural numbers, such as ${tag}(${n}, ${nextN})?`,
      options: makeUniqueOptions('1', ['2', `${n}`, '0']),
      correctAnswer: '1',
      solution: isEl
        ? `Δύο διαδοχικοί φυσικοί αριθμοί είναι πάντοτε πρώτοι μεταξύ τους, επομένως ο ${tag} τους ισούται πάντα με 1.`
        : `Two consecutive natural numbers are always coprime, so their ${tag} is always 1.`,
    };
  },

  // 12. ΜΚΔ δύο πρώτων αριθμών (Input)
  (locale) => {
    const primes = [13, 17, 19, 23, 29, 31];
    const p1 = primes[randInt(0, 2)];
    const p2 = primes[randInt(3, 5)];
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'input',
      topic: isEl ? 'ΠΡΩΤΟΙ ΑΡΙΘΜΟΙ' : 'PRIME NUMBERS',
      question: isEl
        ? `Ποιος είναι ο ${tag} των δύο πρώτων αριθμών ${p1} και ${p2};`
        : `What is the ${tag} of the two prime numbers ${p1} and ${p2}?`,
      correctAnswer: '1',
      solution: isEl
        ? `Επειδή οι αριθμοί ${p1} και ${p2} είναι πρώτοι, οι μόνοι θετικοί διαιρέτες τους είναι η μονάδα και ο εαυτός τους. Άρα ο μόνος κοινός τους διαιρέτης είναι το 1: ${tag}(${p1}, ${p2}) ＝ 1.`
        : `Because ${p1} and ${p2} are prime numbers, their only divisors are 1 and themselves. Their only common divisor is 1: ${tag}(${p1}, ${p2}) ＝ 1.`,
    };
  },

  // 13. ΜΚΔ τριών αριθμών με κοινό παράγοντα το 10 (Input)
  (locale) => {
    const a = 20;
    const b = 50;
    const c = 70;
    const ans = gcdArray([a, b, c]);
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'input',
      topic: isEl ? 'ΜΚΔ ΤΡΙΩΝ ΑΡΙΘΜΩΝ' : 'GCD OF THREE NUMBERS',
      question: isEl
        ? `Υπολόγισε τον ${tag} των αριθμών: ${tag}(${a}, ${b}, ${c})`
        : `Calculate the ${tag} of the numbers: ${tag}(${a}, ${b}, ${c})`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `Και οι τρεις αριθμοί λήγουν σε 0 και οι παράγοντες 2, 5, 7 δεν έχουν άλλο κοινό διαιρέτη εκτός του 1. Άρα ${tag}(${a}, ${b}, ${c}) ＝ ${ans}.`
        : `All three numbers end in 0, and factors 2, 5, 7 share no common divisor other than 1. Thus ${tag}(${a}, ${b}, ${c}) ＝ ${ans}.`,
    };
  },

  // 14. Εύρεση εκθέτη στον κανόνα του ΜΚΔ (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    const correct = isEl ? 'Τον μικρότερο εκθέτη' : 'The lowest exponent';
    const wrong = isEl
      ? ['Τον μεγαλύτερο εκθέτη', 'Το άθροισμα των εκθετών', 'Το γινόμενο των εκθετών']
      : ['The highest exponent', 'The sum of exponents', 'The product of exponents'];
    return {
      type: 'mcq',
      topic: isEl ? 'ΚΑΝΟΝΑΣ ΜΚΔ' : 'GCD RULE',
      question: isEl
        ? `Στον κανόνα εύρεσης του ${tag} με ανάλυση σε πρώτους παράγοντες, ποιον εκθέτη επιλέγουμε για κάθε κοινό παράγοντα;`
        : `In the prime factorization rule for ${tag}, which exponent do we choose for each common factor?`,
      options: makeUniqueOptions(correct, wrong),
      correctAnswer: correct,
      solution: isEl
        ? `Για τον Μέγιστο Κοινό Διαιρέτη παίρνουμε μόνο τους κοινούς πρώτους παράγοντες με τον μικρότερο εκθέτη.`
        : `For the Greatest Common Divisor, we take only common prime factors with the lowest exponent.`,
    };
  },

  // 15. Μη κοινός παράγοντας στην ανάλυση (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    const correct = isEl
      ? 'Τον αγνοούμε (δεν τον συμπεριλαμβάνουμε)'
      : 'Ignore it (do not include it)';
    const wrong = isEl
      ? [
          'Τον βάζουμε με εκθέτη 1',
          'Τον πολλαπλασιάζουμε στο τέλος',
          'Τον προσθέτουμε στο γινόμενο',
        ]
      : [
          'Include it with exponent 1',
          'Multiply it at the end',
          'Add it to the product',
        ];
    return {
      type: 'mcq',
      topic: isEl ? 'ΚΑΝΟΝΑΣ ΜΚΔ' : 'GCD RULE',
      question: isEl
        ? `Αν ένας πρώτος παράγοντας δεν εμφανίζεται σε όλους τους αριθμούς, τι κάνουμε κατά τον υπολογισμό του ${tag};`
        : `If a prime factor does not appear in all numbers, what do we do when computing ${tag}?`,
      options: makeUniqueOptions(correct, wrong),
      correctAnswer: correct,
      solution: isEl
        ? `Στον ${tag} συμπεριλαμβάνουμε αποκλειστικά και μόνο τους παράγοντες που είναι κοινοί σε όλους τους αριθμούς. Κάθε μη κοινός παράγοντας αγνοείται.`
        : `In ${tag}, we include only factors that are common to all numbers. Any non-common factor is omitted.`,
    };
  },

  // 16. ΜΚΔ 4 αριθμών όπου όλοι διαιρούνται με το 3 (Input)
  (locale) => {
    const a = 12;
    const b = 18;
    const c = 24;
    const d = 30;
    const ans = gcdArray([a, b, c, d]);
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'input',
      topic: isEl ? 'ΜΚΔ ΤΕΣΣΑΡΩΝ ΑΡΙΘΜΩΝ' : 'GCD OF FOUR NUMBERS',
      question: isEl
        ? `Υπολόγισε τον Μέγιστο Κοινό Διαιρέτη: ${tag}(${a}, ${b}, ${c}, ${d})`
        : `Calculate the Greatest Common Divisor: ${tag}(${a}, ${b}, ${c}, ${d})`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `Οι κοινοί διαιρέτες των 12, 18, 24, 30 είναι το 1, το 2, το 3 και το 6. Ο μέγιστος είναι το ${ans}.`
        : `The common divisors of 12, 18, 24, 30 are 1, 2, 3, and 6. The greatest is ${ans}.`,
    };
  },

  // 17. Πρόβλημα διαμοιρασμού μαθητών σε ομάδες (Input)
  (locale) => {
    const boys = 36;
    const girls = 48;
    const ans = gcd2(boys, girls);
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'input',
      topic: isEl ? 'ΠΡΟΒΛΗΜΑΤΑ ΜΚΔ' : 'GCD PROBLEMS',
      question: isEl
        ? `Σε μια εκδήλωση συμμετέχουν ${boys} αγόρια και ${girls} κορίτσια. Θέλουμε να χωριστούν στον μεγαλύτερο δυνατό αριθμό όμοιων ομάδων. Πόσες ομάδες θα δημιουργηθούν;`
        : `At an event, ${boys} boys and ${girls} girls participate. They must be divided into the maximum number of identical teams. How many teams will be formed?`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `Ο μέγιστος αριθμός όμοιων ομάδων ισούται με τον ${tag}(${boys}, ${girls}) ＝ ${ans}. Κάθε ομάδα θα έχει 3 αγόρια και 4 κορίτσια.`
        : `The maximum number of identical teams equals ${tag}(${boys}, ${girls}) ＝ ${ans}. Each team will have 3 boys and 4 girls.`,
    };
  },

  // 18. Υπολογισμός ΜΚΔ με αριθμό 1 (MCQ)
  (locale) => {
    const n = randInt(15, 95);
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    const undefLabel = isEl ? 'Δεν ορίζεται' : 'Undefined';
    return {
      type: 'mcq',
      topic: isEl ? 'ΙΔΙΟΤΗΤΕΣ ΜΚΔ' : 'GCD PROPERTIES',
      question: isEl
        ? `Ποιος είναι ο ${tag}(${n}, 1);`
        : `What is ${tag}(${n}, 1)?`,
      options: makeUniqueOptions('1', [`${n}`, '0', undefLabel]),
      correctAnswer: '1',
      solution: isEl
        ? `Ο αριθμός 1 έχει μοναδικό διαιρέτη το 1. Επομένως ο μοναδικός κοινός διαιρέτης του 1 με οποιονδήποτε φυσικό αριθμό είναι το 1: ${tag}(${n}, 1) ＝ 1.`
        : `The number 1 has only one divisor: 1. Thus the only common divisor of 1 with any natural number is 1: ${tag}(${n}, 1) ＝ 1.`,
    };
  },

  // 19. ΜΚΔ τριών αριθμών με κοινό το 7 (Input)
  (locale) => {
    const a = 14;
    const b = 28;
    const c = 35;
    const ans = gcdArray([a, b, c]);
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'input',
      topic: isEl ? 'ΜΚΔ ΤΡΙΩΝ ΑΡΙΘΜΩΝ' : 'GCD OF THREE NUMBERS',
      question: isEl
        ? `Υπολόγισε τον ${tag}(${a}, ${b}, ${c})`
        : `Calculate ${tag}(${a}, ${b}, ${c})`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `14 ＝ 2 · 7, 28 ＝ 2<sup>2</sup> · 7, 35 ＝ 5 · 7. Ο μόνος κοινός πρώτος παράγοντας είναι το 7 με εκθέτη 1. Άρα ${tag} ＝ ${ans}.`
        : `14 ＝ 2 · 7, 28 ＝ 2<sup>2</sup> · 7, 35 ＝ 5 · 7. The only common prime factor is 7 with exponent 1. Thus ${tag} ＝ ${ans}.`,
    };
  },

  // 20. ΜΚΔ ίσων αριθμών (Input)
  (locale) => {
    const n = randInt(12, 45);
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'input',
      topic: isEl ? 'ΙΔΙΟΤΗΤΕΣ ΜΚΔ' : 'GCD PROPERTIES',
      question: isEl
        ? `Ποιος είναι ο Μέγιστος Κοινός Διαιρέτης δύο ίσων αριθμών: ${tag}(${n}, ${n});`
        : `What is the Greatest Common Divisor of two equal numbers: ${tag}(${n}, ${n})?`,
      correctAnswer: n.toString(),
      solution: isEl
        ? `Ο μεγαλύτερος διαιρέτης ενός αριθμού είναι ο ίδιος ο εαυτός του. Επομένως ${tag}(${n}, ${n}) ＝ ${n}.`
        : `The largest divisor of any number is itself. Therefore ${tag}(${n}, ${n}) ＝ ${n}.`,
    };
  },
];

// UI Λεξικό
const translations = {
  el: {
    metaTitle: "Ασκήσεις: Μέγιστος Κοινός Διαιρέτης (ΜΚΔ) | Α' Γυμνασίου",
    metaDescription: "Εξάσκηση σε 10 δυναμικές ασκήσεις στον Μέγιστο Κοινό Διαιρέτη (ΜΚΔ) για 2, 3 ή 4 αριθμούς και προβλήματα.",
    backText: "Α' Γυμνασίου",
    actionButton: "ΘΕΩΡΙΑ",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)",
    mainSubtitle: "Επίλυσε τις παρακάτω 10 ασκήσεις στον ΜΚΔ δύο, τριών και τεσσάρων αριθμών. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
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
    metaTitle: "Exercises: Greatest Common Divisor (GCD) | 7th Grade",
    metaDescription: "Practice with 10 dynamic exercises on Greatest Common Divisor (GCD) for 2, 3, or 4 numbers and word problems.",
    backText: "7th Grade",
    actionButton: "THEORY",
    badge: "7TH GRADE • PRACTICE",
    mainTitle: "Greatest Common Divisor (GCD)",
    mainSubtitle: "Solve the 10 selected exercises on GCD of two, three, and four numbers. Then click 'CHECK ANSWERS' to view your score and detailed solutions.",
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

export default function MKDAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = translations[locale] || translations.el;

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργία 10 τυχαίων ερωτήσεων
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

  // Αυστηρός έλεγχος εισαγωγής input
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

  // Υποβολή και έλεγχος απαντήσεων
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
          href="/a-gymnasiou/03-MKD"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.actionButton)}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* Banner Header */}
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

          {/* Κουμπί Ελέγχου / Ανανέωσης εντός σελίδας */}
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
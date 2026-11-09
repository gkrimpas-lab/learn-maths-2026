import React, { useState, useEffect } from 'react';
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

// =========================================================================
// ΔΕΞΑΜΕΝΕΣ ΕΡΩΤΗΣΕΩΝ ΑΝΑ ΚΕΦΑΛΑΙΟ (8 ΑΠΑΙΤΗΤΙΚΕΣ ΓΕΝΝΗΤΡΙΕΣ ΑΝΑ ΚΕΦΑΛΑΙΟ)
// =========================================================================

// --- ΚΕΦΑΛΑΙΟ 1: ΦΥΣΙΚΟΙ ΑΡΙΘΜΟΙ, ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ & ΔΥΝΑΜΕΙΣ ---
const CH1_GENERATORS = [
  // 1.1 Σύνθετη αριθμητική παράσταση με δυνάμεις και παρενθέσεις (Input)
  (locale) => {
    const a = randInt(2, 4);
    const b = randInt(2, 3);
    const c = randInt(2, 5);
    const p1 = Math.pow(a, 2);
    const p2 = Math.pow(b, 3);
    const inside = p1 + p2;
    const ans = inside * c - Math.pow(2, 4);
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΣΥΝΘΕΤΗ ΠΑΡΑΣΤΑΣΗ ΔΥΝΑΜΕΩΝ' : 'COMPLEX POWER EXPRESSION',
      question: isEl
        ? `Υπολόγισε την τιμή της παράστασης: (${a}<sup>2</sup> ＋ ${b}<sup>3</sup>) · ${c} － 2<sup>4</sup>`
        : `Calculate the value of the expression: (${a}<sup>2</sup> ＋ ${b}<sup>3</sup>) · ${c} － 2<sup>4</sup>`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `Πρώτα οι δυνάμεις: ${a}<sup>2</sup> ＝ ${p1}, ${b}<sup>3</sup> ＝ ${p2}, 2<sup>4</sup> ＝ 16. Μέσα στην παρένθεση: ${p1} ＋ ${p2} ＝ ${inside}. Πολλαπλασιασμός: ${inside} · ${c} ＝ ${inside * c}. Τέλος η αφαίρεση: ${inside * c} － 16 ＝ ${ans}.`
        : `First evaluate powers: ${a}<sup>2</sup> ＝ ${p1}, ${b}<sup>3</sup> ＝ ${p2}, 2<sup>4</sup> ＝ 16. Parentheses: ${p1} ＋ ${p2} ＝ ${inside}. Multiply: ${inside} · ${c} ＝ ${inside * c}. Subtract: ${inside * c} － 16 ＝ ${ans}.`,
    };
  },

  // 1.2 Επιμεριστική ιδιότητα με μεγάλους αριθμούς και κοινό παράγοντα (Input)
  (locale) => {
    const k = randInt(18, 35);
    const a = randInt(55, 85);
    const b = 100 - a;
    const ans = k * 100;
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΕΞΥΠΝΟΣ ΥΠΟΛΟΓΙΣΜΟΣ' : 'CLEVER COMPUTATION',
      question: isEl
        ? `Υπολόγισε έξυπνα με κοινό παράγοντα: ${k} · ${a} ＋ ${k} · ${b}`
        : `Calculate cleverly using a common factor: ${k} · ${a} ＋ ${k} · ${b}`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `Βγάζουμε κοινό παράγοντα το ${k}: ${k} · (${a} ＋ ${b}) ＝ ${k} · 100 ＝ ${ans}.`
        : `Factoring out ${k}: ${k} · (${a} ＋ ${b}) ＝ ${k} · 100 ＝ ${ans}.`,
    };
  },

  // 1.3 Εύρεση εκθέτη σε εξίσωση δυνάμεων (Input)
  (locale) => {
    const base = randInt(2, 5);
    const x = randInt(3, 5);
    const val = Math.pow(base, x);
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΕΞΙΣΩΣΗ ΔΥΝΑΜΗΣ' : 'POWER EQUATION',
      question: isEl
        ? `Βρες τον φυσικό αριθμό x αν ισχύει: ${base}<sup>x</sup> ＝ ${val.toLocaleString('el-GR')}`
        : `Find the natural number x if: ${base}<sup>x</sup> ＝ ${val.toLocaleString('en-US')}`,
      correctAnswer: x.toString(),
      solution: isEl
        ? `Αναλύουμε το ${val}: ${Array(x).fill(base).join(' · ')} ＝ ${val}. Άρα x ＝ ${x}.`
        : `Decomposing ${val}: ${Array(x).fill(base).join(' · ')} ＝ ${val}. Thus x ＝ ${x}.`,
    };
  },

  // 1.4 Σύγκριση δυνάμεων με διαφορετική βάση και εκθέτη (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const correct = '2<sup>6</sup> ＝ 8<sup>2</sup>';
    const candidates = [
      '2<sup>6</sup> ＞ 8<sup>2</sup>',
      '2<sup>6</sup> ＜ 8<sup>2</sup>',
      '2<sup>6</sup> ＋ 8<sup>2</sup> ＝ 100',
    ];
    return {
      type: 'mcq',
      topic: isEl ? 'ΣΥΓΚΡΙΣΗ ΔΥΝΑΜΕΩΝ' : 'POWER COMPARISON',
      question: isEl
        ? `Ποια σχέση ισχύει μεταξύ των δυνάμεων 2<sup>6</sup> και 8<sup>2</sup>;`
        : `Which relation holds between 2<sup>6</sup> and 8<sup>2</sup>?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Υπολογίζουμε: 2<sup>6</sup> ＝ 64 και 8<sup>2</sup> ＝ 64. Άρα 2<sup>6</sup> ＝ 8<sup>2</sup>.`
        : `Evaluating: 2<sup>6</sup> ＝ 64 and 8<sup>2</sup> ＝ 64. Therefore 2<sup>6</sup> ＝ 8<sup>2</sup>.`,
    };
  },

  // 1.5 Άθροισμα τριών διαδοχικών φυσικών (Input)
  (locale) => {
    const n = randInt(25, 75);
    const sum = 3 * n + 3;
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΔΙΑΔΟΧΙΚΟΙ ΦΥΣΙΚΟΙ' : 'CONSECUTIVE INTEGERS',
      question: isEl
        ? `Το άθροισμα τριών διαδοχικών φυσικών αριθμών είναι ${sum}. Ποιος είναι ο μικρότερος από αυτούς;`
        : `The sum of three consecutive natural numbers is ${sum}. What is the smallest of them?`,
      correctAnswer: n.toString(),
      solution: isEl
        ? `Αν ο μικρότερος είναι ο ν, τότε ν ＋ (ν ＋ 1) ＋ (ν ＋ 2) ＝ 3 · ν ＋ 3 ＝ ${sum}. Άρα 3 · ν ＝ ${sum - 3}, οπότε ν ＝ ${(sum - 3) / 3}.`
        : `If the smallest is n, then n ＋ (n ＋ 1) ＋ (n ＋ 2) ＝ 3 · n ＋ 3 ＝ ${sum}. Thus 3 · n ＝ ${sum - 3}, so n ＝ ${(sum - 3) / 3}.`,
    };
  },

  // 1.6 Πλήθος ψηφίων σε δύναμη του 10 με πολλαπλασιαστή (Input)
  (locale) => {
    const m = randInt(12, 85);
    const exp = randInt(4, 7);
    const digitsCount = m.toString().length + exp;
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΨΗΦΙΑ ΑΡΙΘΜΟΥ' : 'DIGITS COUNT',
      question: isEl
        ? `Πόσα ψηφία έχει συνολικά ο αριθμός που προκύπτει από την πράξη: ${m} · 10<sup>${exp}</sup>;`
        : `How many total digits does the number resulting from ${m} · 10<sup>${exp}</sup> have?`,
      correctAnswer: digitsCount.toString(),
      solution: isEl
        ? `Ο αριθμός αποτελείται από τα ${m.toString().length} ψηφία του ${m} ακολουθούμενα από ${exp} μηδενικά. Συνολικά: ${m.toString().length} ＋ ${exp} ＝ ${digitsCount} ψηφία.`
        : `The number consists of ${m.toString().length} digits of ${m} followed by ${exp} zeros. Total: ${m.toString().length} ＋ ${exp} ＝ ${digitsCount} digits.`,
    };
  },

  // 1.7 Δύναμη δυνάμεων & προτεραιότητα (Input)
  (locale) => {
    const a = 2;
    const b = randInt(2, 3);
    const c = randInt(2, 3);
    const ans = Math.pow(a, b * c);
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΔΥΝΑΜΗ ΔΥΝΑΜΗΣ' : 'POWER OF A POWER',
      question: isEl
        ? `Υπολόγισε την τιμή της παράστασης: (${a}<sup>${b}</sup>)<sup>${c}</sup>`
        : `Calculate the value of the expression: (${a}<sup>${b}</sup>)<sup>${c}</sup>`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `Πρώτα μέσα στην παρένθεση: ${a}<sup>${b}</sup> ＝ ${Math.pow(a, b)}. Στη συνέχεια: ${Math.pow(a, b)}<sup>${c}</sup> ＝ ${ans}. (Ισοδύναμα ${a}<sup>${b * c}</sup> ＝ ${ans}).`
        : `Inside the parentheses: ${a}<sup>${b}</sup> ＝ ${Math.pow(a, b)}. Then: ${Math.pow(a, b)}<sup>${c}</sup> ＝ ${ans}. (Equivalently ${a}<sup>${b * c}</sup> ＝ ${ans}).`,
    };
  },

  // 1.8 Συνδυασμός 0 και 1 ως εκθέτες (Input)
  (locale) => {
    const a = randInt(15, 95);
    const b = randInt(15, 95);
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΕΙΔΙΚΕΣ ΔΥΝΑΜΕΙΣ' : 'SPECIAL POWERS',
      question: isEl
        ? `Υπολόγισε την τιμή: ${b}<sup>0</sup> ＋ ${a}<sup>1</sup> － 1<sup>100</sup>`
        : `Calculate the value: ${b}<sup>0</sup> ＋ ${a}<sup>1</sup> － 1<sup>100</sup>`,
      correctAnswer: a.toString(),
      solution: isEl
        ? `Εφαρμόζουμε τις συμβάσεις: ${b}<sup>0</sup> ＝ 1, ${a}<sup>1</sup> ＝ ${a}, 1<sup>100</sup> ＝ 1. Επομένως 1 ＋ ${a} － 1 ＝ ${a}.`
        : `Applying conventions: ${b}<sup>0</sup> ＝ 1, ${a}<sup>1</sup> ＝ ${a}, 1<sup>100</sup> ＝ 1. Thus 1 ＋ ${a} － 1 ＝ ${a}.`,
    };
  },
];

// --- ΚΕΦΑΛΑΙΟ 2: ΕΥΚΛΕΙΔΕΙΑ ΔΙΑΙΡΕΣΗ, ΔΙΑΙΡΕΤΟΤΗΤΑ & ΠΡΩΤΟΙ ---
const CH2_GENERATORS = [
  // 2.1 Εύρεση διαιρέτη όταν δίνονται Δ, π, υ (Input)
  (locale) => {
    const d = randInt(7, 15);
    const p = randInt(8, 20);
    const u = randInt(2, d - 1);
    const D = d * p + u;
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΕΥΡΕΣΗ ΔΙΑΙΡΕΤΗ' : 'FINDING DIVISOR',
      question: isEl
        ? `Σε μια διαίρεση ο διαιρετέος είναι ${D}, το πηλίκο ${p} και το υπόλοιπο ${u}. Ποιος είναι ο διαιρέτης;`
        : `In a division, the dividend is ${D}, the quotient is ${p}, and the remainder is ${u}. What is the divisor?`,
      correctAnswer: d.toString(),
      solution: isEl
        ? `Από την ταυτότητα Δ ＝ δ · π ＋ υ έχουμε: δ · π ＝ Δ － υ ＝ ${D} － ${u} ＝ ${D - u}. Επομένως δ ＝ ${D - u} : ${p} ＝ ${d}.`
        : `From D ＝ d · q ＋ r we get: d · q ＝ D － r ＝ ${D} － ${u} ＝ ${D - u}. Thus d ＝ ${D - u} : ${p} ＝ ${d}.`,
    };
  },

  // 2.2 Διπλό κριτήριο διαιρετότητας με 4 και 9 (Input)
  (locale) => {
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΣΥΝΔΥΑΣΤΙΚΑ ΚΡΙΤΗΡΙΑ' : 'COMBINED CRITERIA',
      question: isEl
        ? `Ποιο ψηφίο πρέπει να μπει στη θέση του x ώστε ο τετραψήφιος αριθμός 2x36 να διαιρείται ταυτόχρονα με το 4 και με το 9;`
        : `Which digit should replace x so that the 4-digit number 2x36 is divisible by both 4 and 9?`,
      correctAnswer: '7',
      solution: isEl
        ? `Τα δύο τελευταία ψηφία 36 διαιρούνται ήδη με το 4 (36 : 4 ＝ 9). Για να διαιρείται και με το 9, το άθροισμα των ψηφίων 2 ＋ x ＋ 3 ＋ 6 ＝ 11 ＋ x πρέπει να είναι πολλαπλάσιο του 9. Άρα x ＝ 7 (11 ＋ 7 ＝ 18).`
        : `The last two digits 36 are already divisible by 4. To be divisible by 9, the sum of digits 2 ＋ x ＋ 3 ＋ 6 ＝ 11 ＋ x must be a multiple of 9. Thus x ＝ 7 (11 ＋ 7 ＝ 18).`,
    };
  },

  // 2.3 Διπλό κριτήριο 5 και 9 με 2 άγνωστα (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const correct = 'x ＝ 2, y ＝ 5';
    const candidates = [
      'x ＝ 7, y ＝ 0',
      'x ＝ 3, y ＝ 5',
      'x ＝ 2, y ＝ 0',
    ];
    return {
      type: 'mcq',
      topic: isEl ? 'ΣΥΝΔΥΑΣΤΙΚΑ ΚΡΙΤΗΡΙΑ' : 'COMBINED CRITERIA',
      question: isEl
        ? `Ο τετραψήφιος αριθμός 4x7y είναι περιττός και διαιρείται ταυτόχρονα με το 5 και με το 9. Ποιες είναι οι τιμές των ψηφίων x και y;`
        : `The 4-digit number 4x7y is odd and divisible by both 5 and 9. What are the values of digits x and y?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Επειδή είναι περιττός και διαιρείται με το 5, υποχρεωτικά y ＝ 5. Για να διαιρείται με το 9: 4 ＋ x ＋ 7 ＋ 5 ＝ 16 ＋ x. Το άθροισμα γίνεται πολλαπλάσιο του 9 για x ＝ 2 (16 ＋ 2 ＝ 18).`
        : `Since it is odd and divisible by 5, necessarily y ＝ 5. For divisibility by 9: 4 ＋ x ＋ 7 ＋ 5 ＝ 16 ＋ x. Sum is a multiple of 9 for x ＝ 2 (16 ＋ 2 ＝ 18).`,
    };
  },

  // 2.4 Εύρεση πρώτου αριθμού σε εύρος (Input)
  (locale) => {
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΠΡΩΤΟΙ ΑΡΙΘΜΟΙ' : 'PRIME NUMBERS',
      question: isEl
        ? `Ποιος είναι ο μοναδικός πρώτος αριθμός ανάμεσα στο 90 και το 100;`
        : `What is the only prime number between 90 and 100?`,
      correctAnswer: '97',
      solution: isEl
        ? `Ελέγχουμε τους αριθμούς: 91 ＝ 7 · 13, 92 άρτιος, 93 ＝ 3 · 31, 94 άρτιος, 95 λήγει σε 5, 96 άρτιος, 98 άρτιος, 99 ＝ 9 · 11. Μόνο ο 97 δεν διαιρείται με κανέναν άλλον αριθμό εκτός από το 1 και τον εαυτό του.`
        : `Testing numbers: 91 ＝ 7 · 13, 93 ＝ 3 · 31, 95 ends in 5, evens are composite, 99 ＝ 9 · 11. Only 97 has no divisors other than 1 and itself.`,
    };
  },

  // 2.5 Μέγιστος διαιρετέος με δεδομένο διαιρέτη και πηλίκο (Input)
  (locale) => {
    const d = randInt(12, 25);
    const p = randInt(10, 18);
    const maxU = d - 1;
    const maxD = d * p + maxU;
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΜΕΓΙΣΤΟΣ ΔΙΑΙΡΕΤΕΟΣ' : 'MAXIMUM DIVIDEND',
      question: isEl
        ? `Σε μια διαίρεση ο διαιρέτης είναι ${d} και το πηλίκο ${p}. Ποιος είναι ο μέγιστος δυνατός διαιρετέος;`
        : `In a division, the divisor is ${d} and the quotient is ${p}. What is the maximum possible dividend?`,
      correctAnswer: maxD.toString(),
      solution: isEl
        ? `Ο διαιρετέος γίνεται μέγιστος όταν το υπόλοιπο πάρει τη μέγιστη δυνατή τιμή του: υ_max ＝ δ － 1 ＝ ${d} － 1 ＝ ${maxU}. Τότε Δ ＝ ${d} · ${p} ＋ ${maxU} ＝ ${d * p} ＋ ${maxU} ＝ ${maxD}.`
        : `The dividend is maximized when remainder takes its maximum value: r_max ＝ d － 1 ＝ ${d} － 1 ＝ ${maxU}. Then D ＝ ${d} · ${p} ＋ ${maxU} ＝ ${maxD}.`,
    };
  },

  // 2.6 Ανάλυση σύνθετου σε γινόμενο πρώτων παραγόντων (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const correct = '2<sup>3</sup> · 3<sup>2</sup> · 5';
    const candidates = [
      '2<sup>2</sup> · 3<sup>3</sup> · 5',
      '2<sup>4</sup> · 3 · 5',
      '2<sup>3</sup> · 3 · 5<sup>2</sup>',
    ];
    return {
      type: 'mcq',
      topic: isEl ? 'ΑΝΑΛΥΣΗ ΣΕ ΠΡΩΤΟΥΣ' : 'PRIME FACTORIZATION',
      question: isEl
        ? `Ποια είναι η σωστή ανάλυση του αριθμού 360 σε γινόμενο πρώτων παραγόντων;`
        : `What is the correct prime factorization of the number 360?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Διαιρούμε διαδοχικά με πρώτους: 360 : 2 ＝ 180, 180 : 2 ＝ 90, 90 : 2 ＝ 45, 45 : 3 ＝ 15, 15 : 3 ＝ 5, 5 : 5 ＝ 1. Άρα 360 ＝ 2<sup>3</sup> · 3<sup>2</sup> · 5.`
        : `Successive division by primes: 360 : 2 ＝ 180, 180 : 2 ＝ 90, 90 : 2 ＝ 45, 45 : 3 ＝ 15, 15 : 3 ＝ 5, 5 : 5 ＝ 1. Thus 360 ＝ 2<sup>3</sup> · 3<sup>2</sup> · 5.`,
    };
  },

  // 2.7 Πλήθος φυσικών διαιρετών από την ανάλυση (Input)
  (locale) => {
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΠΛΗΘΟΣ ΔΙΑΙΡΕΤΩΝ' : 'DIVISORS COUNT',
      question: isEl
        ? `Πόσους φυσικούς διαιρέτες έχει συνολικά ο αριθμός 72;`
        : `How many total natural divisors does the number 72 have?`,
      correctAnswer: '12',
      solution: isEl
        ? `Αναλύουμε σε πρώτους παράγοντες: 72 ＝ 2<sup>3</sup> · 3<sup>2</sup>. Το πλήθος των διαιρετών προκύπτει πολλαπλασιάζοντας τους εκθέτες αυξημένους κατά 1: (3 ＋ 1) · (2 ＋ 1) ＝ 4 · 3 ＝ 12.`
        : `Factoring into primes: 72 ＝ 2<sup>3</sup> · 3<sup>2</sup>. The number of divisors is obtained by multiplying exponents increased by 1: (3 ＋ 1) · (2 ＋ 1) ＝ 4 · 3 ＝ 12.`,
    };
  },

  // 2.8 Πρόβλημα διαίρεσης με σταθερό υπόλοιπο (Input)
  (locale) => {
    const d = 6;
    const u = 4;
    const p = randInt(12, 19);
    const D = d * p + u;
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΠΡΟΒΛΗΜΑ ΔΙΑΙΡΕΣΗΣ' : 'DIVISION PROBLEM',
      question: isEl
        ? `Ένα σχολείο έχει ${D} μαθητές. Αν χωριστούν σε ομάδες των ${d} ατόμων, πόσοι μαθητές περισσεύουν;`
        : `A school has ${D} students. If they are divided into teams of ${d}, how many students remain?`,
      correctAnswer: u.toString(),
      solution: isEl
        ? `Εκτελούμε τη διαίρεση ${D} : ${d}. Έχουμε ${D} ＝ ${d} · ${p} ＋ ${u}. Επομένως περισσεύουν ${u} μαθητές.`
        : `Performing division ${D} : ${d}. We have ${D} ＝ ${d} · ${p} ＋ ${u}. Thus ${u} students remain.`,
    };
  },
];

// --- ΚΕΦΑΛΑΙΟ 3: ΜΕΓΙΣΤΟΣ ΚΟΙΝΟΣ ΔΙΑΙΡΕΤΗΣ (ΜΚΔ) ---
const CH3_GENERATORS = [
  // 3.1 ΜΚΔ 3 αριθμών με κοινούς πολλαπλούς πρώτους (Input)
  (locale) => {
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'input',
      topic: isEl ? 'ΜΚΔ ΤΡΙΩΝ ΑΡΙΘΜΩΝ' : 'GCD OF THREE NUMBERS',
      question: isEl
        ? `Υπολόγισε τον Μέγιστο Κοινό Διαιρέτη των αριθμών 48, 72 και 120: ${tag}(48, 72, 120)`
        : `Calculate the Greatest Common Divisor of 48, 72, and 120: ${tag}(48, 72, 120)`,
      correctAnswer: '24',
      solution: isEl
        ? `Αναλύουμε: 48 ＝ 2<sup>4</sup> · 3, 72 ＝ 2<sup>3</sup> · 3<sup>2</sup>, 120 ＝ 2<sup>3</sup> · 3 · 5. Οι κοινοί παράγοντες με τον μικρότερο εκθέτη είναι 2<sup>3</sup> · 3 ＝ 8 · 3 ＝ 24.`
        : `Factoring: 48 ＝ 2<sup>4</sup> · 3, 72 ＝ 2<sup>3</sup> · 3<sup>2</sup>, 120 ＝ 2<sup>3</sup> · 3 · 5. Common factors with lowest exponent: 2<sup>3</sup> · 3 ＝ 24.`,
    };
  },

  // 3.2 Προχωρημένο πρόβλημα ΜΚΔ: Πλακόστρωση δαπέδου με τετράγωνα πλακίδια (Input)
  (locale) => {
    const length = 180;
    const width = 120;
    const side = gcd2(length, width);
    const tiles = (length / side) * (width / side);
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΠΡΟΒΛΗΜΑ ΠΛΑΚΟΣΤΡΩΣΗΣ' : 'TILING PROBLEM',
      question: isEl
        ? `Ένα ορθογώνιο δωμάτιο έχει διαστάσεις ${length} cm και ${width} cm. Θέλουμε να το καλύψουμε με τον ελάχιστο δυνατό αριθμό ίσων τετράγωνων πλακιδίων. Πόσα τέτοια πλακίδια θα χρειαστούν συνολικά;`
        : `A rectangular room has dimensions ${length} cm by ${width} cm. We want to tile it with the minimum number of identical square tiles. How many tiles are needed?`,
      correctAnswer: tiles.toString(),
      solution: isEl
        ? `Για να έχουμε τον ελάχιστο αριθμό πλακιδίων, η πλευρά τους πρέπει να είναι ο ΜΚΔ(${length}, ${width}) ＝ ${side} cm. Κατά μήκος χρειάζονται ${length} : ${side} ＝ 3 πλακίδια και κατά πλάτος ${width} : ${side} ＝ 2. Συνολικά: 3 · 2 ＝ ${tiles} πλακίδια.`
        : `For minimal tiles, side length must be GCD(${length}, ${width}) ＝ ${side} cm. Along length: ${length} : ${side} ＝ 3 tiles, along width: ${width} : ${side} ＝ 2. Total: 3 · 2 ＝ ${tiles} tiles.`,
    };
  },

  // 3.3 ΜΚΔ 4 αριθμών (Input)
  (locale) => {
    const nums = [36, 54, 90, 108];
    const ans = gcdArray(nums);
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'input',
      topic: isEl ? 'ΜΚΔ ΤΕΣΣΑΡΩΝ ΑΡΙΘΜΩΝ' : 'GCD OF FOUR NUMBERS',
      question: isEl
        ? `Υπολόγισε τον ${tag} των 4 αριθμών: ${tag}(36, 54, 90, 108)`
        : `Calculate the ${tag} of the 4 numbers: ${tag}(36, 54, 90, 108)`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `Αναλύουμε: 36 ＝ 2<sup>2</sup> · 3<sup>2</sup>, 54 ＝ 2 · 3<sup>3</sup>, 90 ＝ 2 · 3<sup>2</sup> · 5, 108 ＝ 2<sup>2</sup> · 3<sup>3</sup>. Κοινοί πρώτοι παράγοντες: 2<sup>1</sup> · 3<sup>2</sup> ＝ 2 · 9 ＝ ${ans}.`
        : `Factoring: 36 ＝ 2<sup>2</sup> · 3<sup>2</sup>, 54 ＝ 2 · 3<sup>3</sup>, 90 ＝ 2 · 3<sup>2</sup> · 5, 108 ＝ 2<sup>2</sup> · 3<sup>3</sup>. Common factors: 2<sup>1</sup> · 3<sup>2</sup> ＝ ${ans}.`,
    };
  },

  // 3.4 Εύρεση αριθμών με γνωστό ΜΚΔ και άθροισμα (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const andWord = isEl ? 'και' : 'and';
    const correct = `15 ${andWord} 60`;
    const candidates = [
      `35 ${andWord} 40`,
      `25 ${andWord} 50`,
      `20 ${andWord} 55`,
    ];
    return {
      type: 'mcq',
      topic: isEl ? 'ΕΥΡΕΣΗ ΑΡΙΘΜΩΝ ΑΠΟ ΜΚΔ' : 'FINDING NUMBERS FROM GCD',
      question: isEl
        ? `Δύο φυσικοί αριθμοί έχουν άθροισμα 75 και ο Μέγιστος Κοινός Διαιρέτης τους είναι το 15. Ποιο μπορεί να είναι το ζεύγος των αριθμών;`
        : `Two natural numbers have sum 75 and their Greatest Common Divisor is 15. Which pair could they be?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Οι αριθμοί πρέπει να είναι πολλαπλάσια του 15: 15 · x ＋ 15 · y ＝ 75 ⇒ x ＋ y ＝ 5 με πρώτους μεταξύ τους x, y. Για x ＝ 1 και y ＝ 4, οι αριθμοί είναι 15 και 60.`
        : `The numbers must be multiples of 15: 15 · x ＋ 15 · y ＝ 75 ⇒ x ＋ y ＝ 5 with coprime x, y. For x ＝ 1 and y ＝ 4, the numbers are 15 and 60.`,
    };
  },

  // 3.5 Ανάλυση 3 μεγάλων δυνάμεων για εύρεση ΜΚΔ (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const correct = '2<sup>3</sup> · 3<sup>2</sup>';
    const candidates = [
      '2<sup>3</sup> · 3<sup>2</sup> · 5',
      '2<sup>5</sup> · 3<sup>5</sup>',
      '2<sup>4</sup> · 3<sup>3</sup>',
    ];
    return {
      type: 'mcq',
      topic: isEl ? 'ΜΚΔ ΑΠΟ ΑΝΑΛΥΣΗ' : 'GCD FROM FACTORIZATION',
      question: isEl
        ? `Αν Α ＝ 2<sup>4</sup> · 3<sup>3</sup> · 5<sup>2</sup>, Β ＝ 2<sup>3</sup> · 3<sup>5</sup> · 7 και Γ ＝ 2<sup>5</sup> · 3<sup>2</sup> · 5, ποιος είναι ο ΜΚΔ(Α, Β, Γ);`
        : `If A ＝ 2<sup>4</sup> · 3<sup>3</sup> · 5<sup>2</sup>, B ＝ 2<sup>3</sup> · 3<sup>5</sup> · 7, and C ＝ 2<sup>5</sup> · 3<sup>2</sup> · 5, what is GCD(A, B, C)?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Μόνο τα πρώτα 2 και 3 είναι κοινά και στους 3 αριθμούς. Επιλέγουμε τους ελάχιστους εκθέτες: για το 2 είναι το 3 (2<sup>3</sup>) και για το 3 είναι το 2 (3<sup>2</sup>). Άρα ΜΚΔ ＝ 2<sup>3</sup> · 3<sup>2</sup>.`
        : `Only primes 2 and 3 are common to all 3 numbers. Minimum exponents: 2<sup>3</sup> and 3<sup>2</sup>. Thus GCD ＝ 2<sup>3</sup> · 3<sup>2</sup>.`,
    };
  },

  // 3.6 ΜΚΔ με παραμέτρους (MCQ)
  (locale) => {
    const k = randInt(3, 8);
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    const correct = `${k}`;
    const candidates = [`${k * 2}`, '1', `${k * 3}`];
    return {
      type: 'mcq',
      topic: isEl ? 'ΑΛΓΕΒΡΙΚΗ ΙΔΙΟΤΗΤΑ ΜΚΔ' : 'ALGEBRAIC GCD PROPERTY',
      question: isEl
        ? `Αν ο αριθμός α είναι περιττός και ισχύει α ＝ ${k} · β με β περιττό και ΜΚΔ(α/β, β) ＝ 1, ποιος είναι ο ${tag}(${k} · x, ${k} · y) όταν ΜΚΔ(x, y) ＝ 1;`
        : `If GCD(x, y) ＝ 1, what is ${tag}(${k} · x, ${k} · y)?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Ισχύει η θεμελιώδης ιδιότητα: ΜΚΔ(κ · x, κ · y) ＝ κ · ΜΚΔ(x, y). Επειδή ΜΚΔ(x, y) ＝ 1, το αποτέλεσμα είναι ${k} · 1 ＝ ${k}.`
        : `Fundamental property: GCD(k · x, k · y) ＝ k · GCD(x, y). Since GCD(x, y) ＝ 1, the result is ${k} · 1 ＝ ${k}.`,
    };
  },

  // 3.7 Πρόβλημα διανομής με κοινό υπόλοιπο (Input)
  (locale) => {
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΜΚΔ' : 'ADVANCED GCD PROBLEM',
      question: isEl
        ? `Ποιος είναι ο μεγαλύτερος φυσικός αριθμός που όταν διαιρέσει το 76 και το 130 αφήνει και στις δύο περιπτώσεις υπόλοιπο 4;`
        : `What is the largest natural number that leaves a remainder of 4 when dividing both 76 and 130?`,
      correctAnswer: '18',
      solution: isEl
        ? `Ο αριθμός πρέπει να διαιρεί ακριβώς τις διαφορές: 76 － 4 ＝ 72 και 130 － 4 ＝ 126. Άρα αναζητούμε τον ΜΚΔ(72, 126). 72 ＝ 2<sup>3</sup> · 3<sup>2</sup> και 126 ＝ 2 · 3<sup>2</sup> · 7. ΜΚΔ ＝ 2 · 3<sup>2</sup> ＝ 18 (και είναι > 4, άρα αποδεκτός).`
        : `The number must divide: 76 － 4 ＝ 72 and 130 － 4 ＝ 126. We compute GCD(72, 126) ＝ 18 (and 18 > 4).`,
    };
  },

  // 3.8 Πρώτοι μεταξύ τους με μεταβλητή n (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const tag = isEl ? 'ΜΚΔ' : 'GCD';
    return {
      type: 'mcq',
      topic: isEl ? 'ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ' : 'COPRIME NUMBERS',
      question: isEl
        ? `Για κάθε φυσικό αριθμό ν, ποιος είναι ο ${tag}(ν, ν ＋ 1);`
        : `For any natural number n, what is ${tag}(n, n ＋ 1)?`,
      options: makeUniqueOptions('1', ['ν', 'ν ＋ 1', '0']),
      correctAnswer: '1',
      solution: isEl
        ? `Δύο διαδοχικοί φυσικοί αριθμοί δεν έχουν κανέναν κοινό διαιρέτη μεγαλύτερο του 1, καθώς η διαφορά τους είναι (ν ＋ 1) － ν ＝ 1. Άρα είναι πάντα πρώτοι μεταξύ τους.`
        : `Two consecutive integers share no common divisor greater than 1 because their difference is 1. Thus they are always coprime.`,
    };
  },
];

// --- ΚΕΦΑΛΑΙΟ 4: ΣΥΣΤΗΜΑΤΑ ΑΡΙΘΜΗΣΗΣ ---
const CH4_GENERATORS = [
  // 4.1 Μετατροπή 6-bit δυαδικού σε δεκαδικό (Input)
  (locale) => {
    const dec = randInt(35, 63);
    const bin = dec.toString(2);
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΔΥΑΔΙΚΟ ΣΕ ΔΕΚΑΔΙΚΟ' : 'BINARY TO DECIMAL',
      question: isEl
        ? `Υπολόγισε τη δεκαδική τιμή του 6-bit δυαδικού αριθμού: ${bin}<sub>(2)</sub>`
        : `Calculate the decimal value of the 6-bit binary number: ${bin}<sub>(2)</sub>`,
      correctAnswer: dec.toString(),
      solution: isEl
        ? `Αναλύουμε σε δυνάμεις του 2: ${bin
            .split('')
            .map((b, i) => `${b} · 2<sup>${bin.length - 1 - i}</sup>`)
            .join(' ＋ ')} ＝ ${dec}.`
        : `Expanding in powers of 2: ${bin
            .split('')
            .map((b, i) => `${b} · 2<sup>${bin.length - 1 - i}</sup>`)
            .join(' ＋ ')} ＝ ${dec}.`,
    };
  },

  // 4.2 Μετατροπή οκταδικού σε δυαδικό μέσω δεκαδικού (Input)
  (locale) => {
    const octDigit1 = randInt(2, 5);
    const octDigit0 = randInt(1, 7);
    const dec = octDigit1 * 8 + octDigit0;
    const bin = dec.toString(2);
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΟΚΤΑΔΙΚΟ ΣΕ ΔΥΑΔΙΚΟ' : 'OCTAL TO BINARY',
      question: isEl
        ? `Γράψε τον οκταδικό αριθμό ${octDigit1}${octDigit0}<sub>(8)</sub> στο δυαδικό σύστημα (χωρίς δείκτη):`
        : `Write the octal number ${octDigit1}${octDigit0}<sub>(8)</sub> in binary (without base subscript):`,
      correctAnswer: bin,
      solution: isEl
        ? `Πρώτα σε δεκαδικό: ${octDigit1} · 8 ＋ ${octDigit0} ＝ ${dec}. Στη συνέχεια μετατρέπουμε το ${dec} σε δυαδικό διαιρώντας με το 2: ${bin}<sub>(2)</sub>.`
        : `First to decimal: ${octDigit1} · 8 ＋ ${octDigit0} ＝ ${dec}. Then to binary: ${bin}<sub>(2)</sub>.`,
    };
  },

  // 4.3 Πρόσθεση δύο δυαδικών αριθμών (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const correct = `10001<sub>(2)</sub>`;
    const candidates = [
      `11111<sub>(2)</sub>`,
      `10011<sub>(2)</sub>`,
      `11001<sub>(2)</sub>`,
    ];
    return {
      type: 'mcq',
      topic: isEl ? 'ΔΥΑΔΙΚΗ ΠΡΟΣΘΕΣΗ' : 'BINARY ADDITION',
      question: isEl
        ? `Υπολόγισε το άθροισμα στο δυαδικό σύστημα: 1011<sub>(2)</sub> ＋ 110<sub>(2)</sub>`
        : `Calculate the sum in the binary system: 1011<sub>(2)</sub> ＋ 110<sub>(2)</sub>`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `1011<sub>(2)</sub> ＝ 11 και 110<sub>(2)</sub> ＝ 6 στο δεκαδικό. Το άθροισμά τους είναι 11 ＋ 6 ＝ 17, το οποίο στο δυαδικό γράφεται ως 10001<sub>(2)</sub> (16 ＋ 1).`
        : `1011<sub>(2)</sub> ＝ 11 and 110<sub>(2)</sub> ＝ 6 in decimal. Their sum is 17, which in binary is 10001<sub>(2)</sub> (16 ＋ 1).`,
    };
  },

  // 4.4 Μέγιστος αριθμός με n bits (Input)
  (locale) => {
    const bits = randInt(5, 7);
    const maxVal = Math.pow(2, bits) - 1;
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΜΕΓΙΣΤΗ ΤΙΜΗ BITS' : 'MAX BITS VALUE',
      question: isEl
        ? `Ποιος είναι ο μέγιστος δεκαδικός αριθμός που μπορεί να αποθηκευτεί σε έναν καταχωρητή ${bits} bits;`
        : `What is the maximum decimal number that can be stored in a ${bits}-bit register?`,
      correctAnswer: maxVal.toString(),
      solution: isEl
        ? `Ο μέγιστος αριθμός με ν δυαδικά ψηφία ισούται με 2<sup>ν</sup> － 1. Για ${bits} bits: 2<sup>${bits}</sup> － 1 ＝ ${Math.pow(2, bits)} － 1 ＝ ${maxVal}.`
        : `The maximum value with n bits equals 2<sup>n</sup> － 1. For ${bits} bits: 2<sup>${bits}</sup> － 1 ＝ ${Math.pow(2, bits)} － 1 ＝ ${maxVal}.`,
    };
  },

  // 4.5 Πολυωνυμική ανάλυση οκταδικού σε δυνάμεις του 8 (Input)
  (locale) => {
    const d2 = randInt(2, 5);
    const d1 = randInt(1, 6);
    const d0 = randInt(1, 7);
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΠΟΛΥΩΝΥΜΙΚΗ ΑΝΑΛΥΣΗ' : 'POLYNOMIAL EXPANSION',
      question: isEl
        ? `Στην ανάλυση του οκταδικού αριθμού ${d2}${d1}${d0}<sub>(8)</sub> ＝ ${d2} · 8<sup>x</sup> ＋ ${d1} · 8<sup>1</sup> ＋ ${d0} · 8<sup>0</sup>, ποιος είναι ο εκθέτης x;`
        : `In the expansion of ${d2}${d1}${d0}<sub>(8)</sub> ＝ ${d2} · 8<sup>x</sup> ＋ ${d1} · 8<sup>1</sup> ＋ ${d0} · 8<sup>0</sup>, what is the exponent x?`,
      correctAnswer: '2',
      solution: isEl
        ? `Το ψηφίο ${d2} βρίσκεται στην τρίτη θέση από δεξιά, η οποία αντιστοιχεί στο 8<sup>2</sup> ＝ 64. Άρα x ＝ 2.`
        : `The digit ${d2} is in the third position from the right, which corresponds to 8<sup>2</sup> ＝ 64. Thus x ＝ 2.`,
    };
  },

  // 4.6 Σύγκριση 3 διαφορετικών βάσεων (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const correct = '11111<sub>(2)</sub> ＝ 37<sub>(8)</sub>';
    const candidates = [
      '11111<sub>(2)</sub> ＞ 37<sub>(8)</sub>',
      '11111<sub>(2)</sub> ＜ 37<sub>(8)</sub>',
      '11111<sub>(2)</sub> ＋ 37<sub>(8)</sub> ＝ 50',
    ];
    return {
      type: 'mcq',
      topic: isEl ? 'ΣΥΓΚΡΙΣΗ ΣΥΣΤΗΜΑΤΩΝ' : 'SYSTEM COMPARISON',
      question: isEl
        ? `Ποια σχέση ισχύει μεταξύ του δυαδικού 11111<sub>(2)</sub> και του οκταδικού 37<sub>(8)</sub>;`
        : `Which relation holds between binary 11111<sub>(2)</sub> and octal 37<sub>(8)</sub>?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `11111<sub>(2)</sub> ＝ 16 ＋ 8 ＋ 4 ＋ 2 ＋ 1 ＝ 31<sub>(10)</sub>. Επίσης 37<sub>(8)</sub> ＝ 3 · 8 ＋ 7 ＝ 24 ＋ 7 ＝ 31<sub>(10)</sub>. Επομένως είναι ίσοι.`
        : `11111<sub>(2)</sub> ＝ 31<sub>(10)</sub> and 37<sub>(8)</sub> ＝ 3 · 8 ＋ 7 ＝ 31<sub>(10)</sub>. Therefore they are equal.`,
    };
  },

  // 4.7 Υπολογισμός τιμής από 8-bit Byte (Input)
  (locale) => {
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? '8-BIT BYTE' : '8-BIT BYTE',
      question: isEl
        ? `Ποια είναι η δεκαδική τιμή του byte 01010101<sub>(2)</sub>;`
        : `What is the decimal value of the byte 01010101<sub>(2)</sub>?`,
      correctAnswer: '85',
      solution: isEl
        ? `Προσθέτουμε τις ενεργές θέσεις: 2<sup>6</sup> ＋ 2<sup>4</sup> ＋ 2<sup>2</sup> ＋ 2<sup>0</sup> ＝ 64 ＋ 16 ＋ 4 ＋ 1 ＝ 85.`
        : `Sum of active weights: 2<sup>6</sup> ＋ 2<sup>4</sup> ＋ 2<sup>2</sup> ＋ 2<sup>0</sup> ＝ 64 ＋ 16 ＋ 4 ＋ 1 ＝ 85.`,
    };
  },

  // 4.8 Αφαίρεση στο δυαδικό σύστημα (Input)
  (locale) => {
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΔΥΑΔΙΚΕΣ ΠΡΑΞΕΙΣ' : 'BINARY OPERATIONS',
      question: isEl
        ? `Υπολόγισε τη διαφορά στο δυαδικό σύστημα (γράψε μόνο τα bits): 1000<sub>(2)</sub> － 1<sub>(2)</sub>`
        : `Calculate the difference in binary (enter bits only): 1000<sub>(2)</sub> － 1<sub>(2)</sub>`,
      correctAnswer: '111',
      solution: isEl
        ? `1000<sub>(2)</sub> ＝ 8 και 1<sub>(2)</sub> ＝ 1. Η διαφορά είναι 8 － 1 ＝ 7, το οποίο στο δυαδικό ισούται με 111<sub>(2)</sub>.`
        : `1000<sub>(2)</sub> ＝ 8 and 1<sub>(2)</sub> ＝ 1. The difference is 8 － 1 ＝ 7, which in binary is 111<sub>(2)</sub>.`,
    };
  },
];

// UI Λεξικό
const translations = {
  el: {
    metaTitle: "1η Επανάληψη: Κεφάλαια 1-4 | Α' Γυμνασίου",
    metaDescription: "12 επιλεγμένες προχωρημένες επαναληπτικές ασκήσεις στα Κεφάλαια 1 έως 4 της Α' Γυμνασίου (3 από κάθε κεφάλαιο).",
    backText: "Α' Γυμνασίου",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • 1η ΓΕΝΙΚΗ ΕΠΑΝΑΛΗΨΗ",
    mainTitle: "Επαναληπτικές Ασκήσεις (Κεφάλαια 1 - 4)",
    mainSubtitle: "12 απαιτητικές ασκήσεις με αυστηρή ισοκατανομή: ακριβώς 3 ασκήσεις από κάθε κεφάλαιο, τυχαία επιλεγμένες από δεξαμενή 32 ασκήσεων.",
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
    metaTitle: "Review 1: Chapters 1-4 | 7th Grade",
    metaDescription: "12 advanced review exercises covering Chapters 1 to 4 of 7th Grade math (3 from each chapter).",
    backText: "7th Grade",
    badge: "7TH GRADE • GENERAL REVIEW 1",
    mainTitle: "Comprehensive Review (Chapters 1 - 4)",
    mainSubtitle: "12 challenging exercises with balanced coverage: exactly 3 from each chapter, randomly chosen from a pool of 32 generators.",
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

export default function Epanalipsi1Ask() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = translations[locale] || translations.el;

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργία 12 τυχαίων ερωτήσεων (3 από κάθε κεφάλαιο)
  const generateQuestions = () => {
    const ch1 = shuffleArray(CH1_GENERATORS).slice(0, 3);
    const ch2 = shuffleArray(CH2_GENERATORS).slice(0, 3);
    const ch3 = shuffleArray(CH3_GENERATORS).slice(0, 3);
    const ch4 = shuffleArray(CH4_GENERATORS).slice(0, 3);

    // Συνένωση και τελικό ανακάτεμα της σειράς εμφάνισης
    const allSelected = shuffleArray([...ch1, ...ch2, ...ch3, ...ch4]);

    const generated = allSelected.map((gen, idx) => ({
      id: idx + 1,
      ...gen(locale),
    }));

    setQuestions(generated);
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

  const scorePercentage = Math.round((score / 12) * 100);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      hideFooter={true}
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
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
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
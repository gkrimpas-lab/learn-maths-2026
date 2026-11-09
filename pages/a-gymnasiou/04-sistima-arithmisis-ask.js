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
// ΔΕΞΑΜΕΝΗ 20 ΔΙΑΦΟΡΕΤΙΚΩΝ ΤΥΠΩΝ ΑΣΚΗΣΕΩΝ ΣΥΣΤΗΜΑΤΩΝ (i18n)
// ========================================================
const EXERCISE_GENERATORS = [
  // 1. Μετατροπή απλού δυαδικού (4-bit) σε δεκαδικό (Input)
  (locale) => {
    const dec = randInt(5, 15);
    const bin = dec.toString(2);
    const isEl = locale === 'el';
    const expansion = bin
      .split('')
      .map((b, i) => `${b} · 2<sup>${bin.length - 1 - i}</sup>`)
      .join(' ＋ ');

    return {
      type: 'input',
      topic: isEl ? 'ΔΥΑΔΙΚΟ ΣΕ ΔΕΚΑΔΙΚΟ' : 'BINARY TO DECIMAL',
      question: isEl
        ? `Μετάτρεψε τον δυαδικό αριθμό ${bin}<sub>(2)</sub> στο δεκαδικό σύστημα:`
        : `Convert the binary number ${bin}<sub>(2)</sub> to the decimal system:`,
      correctAnswer: dec.toString(),
      solution: isEl
        ? `Αναλύουμε σε δυνάμεις του 2: ${expansion} ＝ ${dec}.`
        : `Expanding in powers of 2: ${expansion} ＝ ${dec}.`,
    };
  },

  // 2. Μετατροπή 5-bit δυαδικού σε δεκαδικό (Input)
  (locale) => {
    const dec = randInt(17, 31);
    const bin = dec.toString(2);
    const isEl = locale === 'el';
    const expansion = bin
      .split('')
      .map((b, i) => `${b} · 2<sup>${bin.length - 1 - i}</sup>`)
      .join(' ＋ ');

    return {
      type: 'input',
      topic: isEl ? 'ΔΥΑΔΙΚΟ ΣΕ ΔΕΚΑΔΙΚΟ' : 'BINARY TO DECIMAL',
      question: isEl
        ? `Ποιος είναι ο δεκαδικός αριθμός που αντιστοιχεί στον δυαδικό ${bin}<sub>(2)</sub> ;`
        : `What is the decimal number corresponding to binary ${bin}<sub>(2)</sub> ?`,
      correctAnswer: dec.toString(),
      solution: isEl
        ? `Αναλύουμε: ${expansion} ＝ ${dec}.`
        : `Expanding: ${expansion} ＝ ${dec}.`,
    };
  },

  // 3. Μετατροπή δεκαδικού σε δυαδικό (MCQ)
  (locale) => {
    const dec = randInt(10, 26);
    const correct = `${dec.toString(2)}<sub>(2)</sub>`;
    const candidates = [
      `${(dec + 1).toString(2)}<sub>(2)</sub>`,
      `${(dec - 1).toString(2)}<sub>(2)</sub>`,
      `${(dec + 2).toString(2)}<sub>(2)</sub>`,
    ];
    const isEl = locale === 'el';

    return {
      type: 'mcq',
      topic: isEl ? 'ΔΕΚΑΔΙΚΟ ΣΕ ΔΥΑΔΙΚΟ' : 'DECIMAL TO BINARY',
      question: isEl
        ? `Πώς γράφεται ο δεκαδικός αριθμός ${dec} στο δυαδικό σύστημα;`
        : `How is the decimal number ${dec} written in the binary system?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Διαιρούμε διαδοχικά με το 2 ή αναλύουμε σε άθροισμα δυνάμεων του 2. Ο αριθμός ${dec} ισούται με ${correct}.`
        : `By successive divisions by 2 or expanding into powers of 2, the number ${dec} equals ${correct}.`,
    };
  },

  // 4. Μετατροπή οκταδικού σε δεκαδικό (Input)
  (locale) => {
    const d1 = randInt(1, 5);
    const d0 = randInt(0, 7);
    const oct = `${d1}${d0}`;
    const dec = d1 * 8 + d0;
    const isEl = locale === 'el';

    return {
      type: 'input',
      topic: isEl ? 'ΟΚΤΑΔΙΚΟ ΣΕ ΔΕΚΑΔΙΚΟ' : 'OCTAL TO DECIMAL',
      question: isEl
        ? `Υπολόγισε τη δεκαδική τιμή του οκταδικού αριθμού ${oct}<sub>(8)</sub> :`
        : `Calculate the decimal value of the octal number ${oct}<sub>(8)</sub> :`,
      correctAnswer: dec.toString(),
      solution: isEl
        ? `${oct}<sub>(8)</sub> ＝ ${d1} · 8<sup>1</sup> ＋ ${d0} · 8<sup>0</sup> ＝ ${d1 * 8} ＋ ${d0} ＝ ${dec}.`
        : `${oct}<sub>(8)</sub> ＝ ${d1} · 8<sup>1</sup> ＋ ${d0} · 8<sup>0</sup> ＝ ${d1 * 8} ＋ ${d0} ＝ ${dec}.`,
    };
  },

  // 5. Μετατροπή 3ψήφιου οκταδικού σε δεκαδικό (Input)
  (locale) => {
    const d2 = randInt(1, 3);
    const d1 = randInt(0, 5);
    const d0 = randInt(0, 7);
    const oct = `${d2}${d1}${d0}`;
    const dec = d2 * 64 + d1 * 8 + d0;
    const isEl = locale === 'el';

    return {
      type: 'input',
      topic: isEl ? 'ΟΚΤΑΔΙΚΟ ΣΕ ΔΕΚΑΔΙΚΟ' : 'OCTAL TO DECIMAL',
      question: isEl
        ? `Μετάτρεψε τον οκταδικό αριθμό ${oct}<sub>(8)</sub> στο δεκαδικό σύστημα:`
        : `Convert the octal number ${oct}<sub>(8)</sub> to the decimal system:`,
      correctAnswer: dec.toString(),
      solution: isEl
        ? `${oct}<sub>(8)</sub> ＝ ${d2} · 8<sup>2</sup> ＋ ${d1} · 8<sup>1</sup> ＋ ${d0} · 8<sup>0</sup> ＝ ${d2 * 64} ＋ ${d1 * 8} ＋ ${d0} ＝ ${dec}.`
        : `${oct}<sub>(8)</sub> ＝ ${d2} · 8<sup>2</sup> ＋ ${d1} · 8<sup>1</sup> ＋ ${d0} · 8<sup>0</sup> ＝ ${d2 * 64} ＋ ${d1 * 8} ＋ ${d0} ＝ ${dec}.`,
    };
  },

  // 6. Αναγνώριση μη έγκυρου ψηφίου στο οκταδικό (MCQ)
  (locale) => {
    const invalidDigits = ['8', '9'];
    const badDigit = invalidDigits[randInt(0, 1)];
    const isEl = locale === 'el';
    const correct = isEl ? `Περιέχει το ψηφίο ${badDigit}` : `Contains the digit ${badDigit}`;
    const candidates = isEl
      ? ['Είναι άρτιος αριθμός', 'Είναι περιττός αριθμός', 'Έχει πάνω από 2 ψηφία']
      : ['It is an even number', 'It is an odd number', 'It has more than 2 digits'];

    return {
      type: 'mcq',
      topic: isEl ? 'ΟΚΤΑΔΙΚΟ ΣΥΣΤΗΜΑ' : 'OCTAL SYSTEM',
      question: isEl
        ? `Γιατί η γραφή 3${badDigit}5<sub>(8)</sub> ΔΕΝ είναι αποδεκτή στο οκταδικό σύστημα;`
        : `Why is the notation 3${badDigit}5<sub>(8)</sub> NOT acceptable in the octal system?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Στο οκταδικό σύστημα (βάση 8) τα μόνα επιτρεπόμενα ψηφία είναι τα 0, 1, 2, 3, 4, 5, 6, 7. Το ψηφίο ${badDigit} δεν υπάρχει στο σύστημα αυτό.`
        : `In the octal system (base 8), the only allowed digits are 0, 1, 2, 3, 4, 5, 6, 7. The digit ${badDigit} does not exist in this system.`,
    };
  },

  // 7. Πλήθος ψηφίων στο δυαδικό σύστημα (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const correct = isEl ? 'Μόνο το 0 και το 1' : 'Only 0 and 1';
    const candidates = isEl
      ? [
          'Όλα τα ψηφία από 0 έως 2',
          'Μόνο το 1 και το 2',
          'Όλα τα ψηφία από 0 έως 9',
        ]
      : [
          'All digits from 0 to 2',
          'Only 1 and 2',
          'All digits from 0 to 9',
        ];

    return {
      type: 'mcq',
      topic: isEl ? 'ΔΥΑΔΙΚΟ ΣΥΣΤΗΜΑ' : 'BINARY SYSTEM',
      question: isEl
        ? `Ποια ψηφία χρησιμοποιούνται αποκλειστικά στο δυαδικό σύστημα αρίθμησης;`
        : `Which digits are used exclusively in the binary numeral system?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Το δυαδικό σύστημα έχει βάση το 2 και χρησιμοποιεί ακριβώς δύο ψηφία: το 0 και το 1 (δυαδικά ψηφία ή bits).`
        : `The binary system has base 2 and uses exactly two digits: 0 and 1 (binary digits or bits).`,
    };
  },

  // 8. Θεσιακή αξία ψηφίου στο δεκαδικό (Input)
  (locale) => {
    const d3 = randInt(1, 9);
    const d2 = randInt(0, 9);
    const d1 = randInt(0, 9);
    const d0 = randInt(0, 9);
    const num = `${d3}${d2}${d1}${d0}`;
    const value = d2 * 100;
    const isEl = locale === 'el';

    return {
      type: 'input',
      topic: isEl ? 'ΘΕΣΙΑΚΗ ΑΞΙΑ' : 'PLACE VALUE',
      question: isEl
        ? `Ποια είναι η θεσιακή αξία του ψηφίου ${d2} στον δεκαδικό αριθμό ${num};`
        : `What is the place value of digit ${d2} in the decimal number ${num}?`,
      correctAnswer: value.toString(),
      solution: isEl
        ? `Το ψηφίο ${d2} βρίσκεται στη θέση των εκατοντάδων (10<sup>2</sup> ＝ 100), επομένως η θεσιακή του αξία είναι ${d2} · 100 ＝ ${value}.`
        : `The digit ${d2} is in the hundreds position (10<sup>2</sup> ＝ 100), so its place value is ${d2} · 100 ＝ ${value}.`,
    };
  },

  // 9. Δύναμη του 2 ως δυαδικός αριθμός (MCQ)
  (locale) => {
    const p = randInt(2, 5);
    const dec = Math.pow(2, p);
    const bin = `1${'0'.repeat(p)}<sub>(2)</sub>`;
    const candidates = [
      `1${'1'.repeat(p)}<sub>(2)</sub>`,
      `1${'0'.repeat(p - 1)}<sub>(2)</sub>`,
      `1${'0'.repeat(p + 1)}<sub>(2)</sub>`,
    ];
    const isEl = locale === 'el';

    return {
      type: 'mcq',
      topic: isEl ? 'ΔΥΑΔΙΚΟ ΣΥΣΤΗΜΑ' : 'BINARY SYSTEM',
      question: isEl
        ? `Πώς γράφεται ο αριθμός ${dec} (δηλαδή το 2<sup>${p}</sup>) στο δυαδικό σύστημα;`
        : `How is ${dec} (i.e. 2<sup>${p}</sup>) written in the binary system?`,
      options: makeUniqueOptions(bin, candidates),
      correctAnswer: bin,
      solution: isEl
        ? `Κάθε δύναμη 2<sup>ν</sup> στο δυαδικό σύστημα γράφεται ως το 1 ακολουθούμενο από ν μηδενικά. Άρα το 2<sup>${p}</sup> γράφεται ως ${bin}.`
        : `Any power 2<sup>n</sup> in binary is written as 1 followed by n zeros. Thus 2<sup>${p}</sup> is written as ${bin}.`,
    };
  },

  // 10. Μετατροπή δεκαδικού σε οκταδικό (MCQ)
  (locale) => {
    const dec = randInt(18, 55);
    const correct = `${dec.toString(8)}<sub>(8)</sub>`;
    const candidates = [
      `${(dec + 2).toString(8)}<sub>(8)</sub>`,
      `${(dec - 2).toString(8)}<sub>(8)</sub>`,
      `${(dec + 8).toString(8)}<sub>(8)</sub>`,
    ];
    const isEl = locale === 'el';

    return {
      type: 'mcq',
      topic: isEl ? 'ΔΕΚΑΔΙΚΟ ΣΕ ΟΚΤΑΔΙΚΟ' : 'DECIMAL TO OCTAL',
      question: isEl
        ? `Πώς γράφεται ο δεκαδικός αριθμός ${dec} στο οκταδικό σύστημα;`
        : `How is the decimal number ${dec} written in the octal system?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Εκτελούμε διαδοχικές διαιρέσεις με το 8. Ο δεκαδικός αριθμός ${dec} ισούται με ${correct}.`
        : `By successive divisions by 8, the decimal number ${dec} equals ${correct}.`,
    };
  },

  // 11. Πρόσθεση στο δυαδικό σύστημα: 1 + 1 (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const correct = `10<sub>(2)</sub>`;
    const candidates = [`2<sub>(2)</sub>`, `11<sub>(2)</sub>`, `0<sub>(2)</sub>`];

    return {
      type: 'mcq',
      topic: isEl ? 'ΔΥΑΔΙΚΕΣ ΠΡΑΞΕΙΣ' : 'BINARY OPERATIONS',
      question: isEl
        ? `Πόσο κάνει 1<sub>(2)</sub> ＋ 1<sub>(2)</sub> στο δυαδικό σύστημα αρίθμησης;`
        : `What is 1<sub>(2)</sub> ＋ 1<sub>(2)</sub> in the binary numeral system?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Στο δυαδικό σύστημα 1 ＋ 1 ＝ 2 στο δεκαδικό, το οποίο γράφεται ως 10<sub>(2)</sub> (0 και κρατούμενο 1 στην επόμενη θέση).`
        : `In binary 1 ＋ 1 ＝ 2 in decimal, which is written as 10<sub>(2)</sub> (0 with a carry of 1 to the next position).`,
    };
  },

  // 12. Πολυωνυμική ανάλυση σε δυνάμεις του 10 (Input)
  (locale) => {
    const a = randInt(2, 8);
    const b = randInt(1, 9);
    const c = randInt(1, 9);
    const num = a * 100 + b * 10 + c;
    const isEl = locale === 'el';

    return {
      type: 'input',
      topic: isEl ? 'ΠΟΛΥΩΝΥΜΙΚΗ ΑΝΑΛΥΣΗ' : 'POLYNOMIAL EXPANSION',
      question: isEl
        ? `Στην ανάλυση ${num} ＝ ${a} · 10<sup>x</sup> ＋ ${b} · 10<sup>1</sup> ＋ ${c} · 10<sup>0</sup>, ποιος είναι ο εκθέτης x;`
        : `In the expansion ${num} ＝ ${a} · 10<sup>x</sup> ＋ ${b} · 10<sup>1</sup> ＋ ${c} · 10<sup>0</sup>, what is the exponent x?`,
      correctAnswer: '2',
      solution: isEl
        ? `Το ψηφίο ${a} είναι στις εκατοντάδες, άρα πολλαπλασιάζεται με το 10<sup>2</sup> ＝ 100. Επομένως x ＝ 2.`
        : `The digit ${a} is in the hundreds position, so it is multiplied by 10<sup>2</sup> ＝ 100. Therefore x ＝ 2.`,
    };
  },

  // 13. Μέγιστος αριθμός με 3 bits (Input)
  (locale) => {
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΔΥΑΔΙΚΟ ΣΥΣΤΗΜΑ' : 'BINARY SYSTEM',
      question: isEl
        ? `Ποιος είναι ο μεγαλύτερος δεκαδικός αριθμός που μπορεί να παρασταθεί με 3 δυαδικά ψηφία (bits), δηλαδή ο 111<sub>(2)</sub> ;`
        : `What is the largest decimal number that can be represented with 3 bits, i.e. 111<sub>(2)</sub> ?`,
      correctAnswer: '7',
      solution: isEl
        ? `111<sub>(2)</sub> ＝ 1 · 2<sup>2</sup> ＋ 1 · 2<sup>1</sup> ＋ 1 · 2<sup>0</sup> ＝ 4 ＋ 2 ＋ 1 ＝ 7 (ή 2<sup>3</sup> － 1 ＝ 8 － 1 ＝ 7).`
        : `111<sub>(2)</sub> ＝ 1 · 2<sup>2</sup> ＋ 1 · 2<sup>1</sup> ＋ 1 · 2<sup>0</sup> ＝ 4 ＋ 2 ＋ 1 ＝ 7 (or 2<sup>3</sup> － 1 ＝ 8 － 1 ＝ 7).`,
    };
  },

  // 14. Μέγιστος αριθμός με 4 bits (Input)
  (locale) => {
    const isEl = locale === 'el';
    return {
      type: 'input',
      topic: isEl ? 'ΔΥΑΔΙΚΟ ΣΥΣΤΗΜΑ' : 'BINARY SYSTEM',
      question: isEl
        ? `Ποια είναι η δεκαδική τιμή του δυαδικού αριθμού 1111<sub>(2)</sub> ;`
        : `What is the decimal value of the binary number 1111<sub>(2)</sub> ?`,
      correctAnswer: '15',
      solution: isEl
        ? `1111<sub>(2)</sub> ＝ 8 ＋ 4 ＋ 2 ＋ 1 ＝ 15 (δηλαδή 2<sup>4</sup> － 1 ＝ 16 － 1 ＝ 15).`
        : `1111<sub>(2)</sub> ＝ 8 ＋ 4 ＋ 2 ＋ 1 ＝ 15 (i.e. 2<sup>4</sup> － 1 ＝ 16 － 1 ＝ 15).`,
    };
  },

  // 15. Βάση του δεκαδικού συστήματος (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const correct = isEl ? 'Το 10' : '10';
    const candidates = isEl ? ['Το 2', 'Το 8', 'Το 12'] : ['2', '8', '12'];

    return {
      type: 'mcq',
      topic: isEl ? 'ΘΕΩΡΙΑ ΣΥΣΤΗΜΑΤΩΝ' : 'NUMBER SYSTEM THEORY',
      question: isEl
        ? `Ποια είναι η βάση του συστήματος αρίθμησης που χρησιμοποιούμε στην καθημερινότητά μας;`
        : `What is the base of the numeral system we use in our daily lives?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Το σύστημα της καθημερινότητάς μας είναι το δεκαδικό, επειδή έχει βάση το 10 και χρησιμοποιεί 10 ψηφία (0 έως 9).`
        : `The system of everyday life is decimal because it has base 10 and uses 10 digits (0 to 9).`,
    };
  },

  // 16. Ισοδυναμία δυαδικού και οκταδικού (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const correct = `7<sub>(8)</sub>`;
    const candidates = [`11<sub>(8)</sub>`, `6<sub>(8)</sub>`, `10<sub>(8)</sub>`];

    return {
      type: 'mcq',
      topic: isEl ? 'ΜΕΤΑΤΡΟΠΕΣ ΣΥΣΤΗΜΑΤΩΝ' : 'SYSTEM CONVERSIONS',
      question: isEl
        ? `Ποιος αριθμός στο οκταδικό σύστημα ισούται με τον δυαδικό 111<sub>(2)</sub> ;`
        : `Which number in the octal system equals binary 111<sub>(2)</sub> ?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Ο δυαδικός αριθμός 111<sub>(2)</sub> ισούται με 4 ＋ 2 ＋ 1 ＝ 7 στο δεκαδικό, που γράφεται ακριβώς ως 7<sub>(8)</sub> στο οκταδικό σύστημα.`
        : `Binary 111<sub>(2)</sub> equals 4 ＋ 2 ＋ 1 ＝ 7 in decimal, which is written precisely as 7<sub>(8)</sub> in octal.`,
    };
  },

  // 17. Θεσιακή αξία στο οκταδικό σύστημα (Input)
  (locale) => {
    const d = randInt(2, 6);
    const ans = d * 64;
    const isEl = locale === 'el';

    return {
      type: 'input',
      topic: isEl ? 'ΟΚΤΑΔΙΚΟ ΣΥΣΤΗΜΑ' : 'OCTAL SYSTEM',
      question: isEl
        ? `Ποια είναι η δεκαδική αξία του ψηφίου ${d} όταν βρίσκεται στην 3η θέση (θέση του 8<sup>2</sup>) ενός οκταδικού αριθμού;`
        : `What is the decimal value of digit ${d} when it is in the 3rd position (8<sup>2</sup> position) of an octal number?`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `Η θέση 8<sup>2</sup> έχει αξία 64. Άρα το ψηφίο ${d} έχει αξία ${d} · 64 ＝ ${ans}.`
        : `Position 8<sup>2</sup> has value 64. Thus digit ${d} has value ${d} · 64 ＝ ${ans}.`,
    };
  },

  // 18. Σύγκριση αριθμών σε διαφορετικά συστήματα (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const correct = `1010<sub>(2)</sub> ＝ 12<sub>(8)</sub>`;
    const candidates = [
      `1010<sub>(2)</sub> ＞ 12<sub>(8)</sub>`,
      `1010<sub>(2)</sub> ＜ 12<sub>(8)</sub>`,
      `1010<sub>(2)</sub> ＋ 12<sub>(8)</sub> ＝ 0`,
    ];

    return {
      type: 'mcq',
      topic: isEl ? 'ΣΥΓΚΡΙΣΗ ΣΥΣΤΗΜΑΤΩΝ' : 'SYSTEM COMPARISON',
      question: isEl
        ? `Ποια σχέση ισχύει μεταξύ του 1010<sub>(2)</sub> και του 12<sub>(8)</sub> ;`
        : `Which relation holds between 1010<sub>(2)</sub> and 12<sub>(8)</sub> ?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `1010<sub>(2)</sub> ＝ 8 ＋ 2 ＝ 10<sub>(10)</sub>. Επίσης 12<sub>(8)</sub> ＝ 1 · 8 ＋ 2 ＝ 10<sub>(10)</sub>. Άρα είναι ίσοι.`
        : `1010<sub>(2)</sub> ＝ 8 ＋ 2 ＝ 10<sub>(10)</sub>. Also 12<sub>(8)</sub> ＝ 1 · 8 ＋ 2 ＝ 10<sub>(10)</sub>. Therefore they are equal.`,
    };
  },

  // 19. Δυαδικός αριθμός που λήγει σε 0 (MCQ)
  (locale) => {
    const isEl = locale === 'el';
    const correct = isEl ? 'Άρτιο αριθμό' : 'An even number';
    const candidates = isEl
      ? [
          'Περιττό αριθμό',
          'Πρώτο αριθμό',
          'Αριθμό που διαιρείται με το 10',
        ]
      : [
          'An odd number',
          'A prime number',
          'A number divisible by 10',
        ];

    return {
      type: 'mcq',
      topic: isEl ? 'ΔΥΑΔΙΚΟ ΣΥΣΤΗΜΑ' : 'BINARY SYSTEM',
      question: isEl
        ? `Ένας δυαδικός αριθμός που το τελευταίο του ψηφίο είναι 0, τι είδους δεκαδικό αριθμό παριστάνει πάντοτε;`
        : `A binary number whose last digit is 0 always represents what kind of decimal number?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: isEl
        ? `Το τελευταίο ψηφίο αντιστοιχεί στο 2<sup>0</sup> ＝ 1. Αν είναι 0, ο αριθμός δεν περιέχει περιττή μονάδα, άρα είναι πάντοτε άρτιος.`
        : `The last digit corresponds to 2<sup>0</sup> ＝ 1. If it is 0, the number contains no odd unit, and is always even.`,
    };
  },

  // 20. Υπολογισμός δεκαδικής τιμής από ανάλυση (Input)
  (locale) => {
    const ans = 16 + 4 + 1; // 21
    const isEl = locale === 'el';

    return {
      type: 'input',
      topic: isEl ? 'ΔΥΑΔΙΚΟ ΣΕ ΔΕΚΑΔΙΚΟ' : 'BINARY TO DECIMAL',
      question: isEl
        ? `Υπολόγισε το δεκαδικό αποτέλεσμα του αθροίσματος: 1 · 2<sup>4</sup> ＋ 1 · 2<sup>2</sup> ＋ 1 · 2<sup>0</sup>`
        : `Calculate the decimal result of the sum: 1 · 2<sup>4</sup> ＋ 1 · 2<sup>2</sup> ＋ 1 · 2<sup>0</sup>`,
      correctAnswer: ans.toString(),
      solution: isEl
        ? `1 · 16 ＋ 1 · 4 ＋ 1 · 1 ＝ 16 ＋ 4 ＋ 1 ＝ ${ans}.`
        : `1 · 16 ＋ 1 · 4 ＋ 1 · 1 ＝ 16 ＋ 4 ＋ 1 ＝ ${ans}.`,
    };
  },
];

// UI Λεξικό
const translations = {
  el: {
    metaTitle: "Ασκήσεις: Συστήματα Αρίθμησης | Α' Γυμνασίου",
    metaDescription: "Εξάσκηση σε 10 δυναμικές ασκήσεις στο Δεκαδικό, Δυαδικό και Οκταδικό σύστημα αρίθμησης.",
    backText: "Α' Γυμνασίου",
    actionButton: "ΘΕΩΡΙΑ",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Συστήματα Αρίθμησης",
    mainSubtitle: "Επίλυσε τις παρακάτω 10 επιλεγμένες ασκήσεις στα συστήματα αρίθμησης (Δεκαδικό, Δυαδικό, Οκταδικό). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία και αναλυτικές λύσεις.",
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
    metaTitle: "Exercises: Numeral Systems | 7th Grade",
    metaDescription: "Practice with 10 dynamic exercises on Decimal, Binary, and Octal numeral systems.",
    backText: "7th Grade",
    actionButton: "THEORY",
    badge: "7TH GRADE • PRACTICE",
    mainTitle: "Numeral Systems",
    mainSubtitle: "Solve the 10 selected exercises on numeral systems (Decimal, Binary, Octal). Then click 'CHECK ANSWERS' to view your score and detailed solutions.",
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

export default function SistimaArithmisisAsk() {
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
          href="/a-gymnasiou/04-sistima-arithmisis"
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
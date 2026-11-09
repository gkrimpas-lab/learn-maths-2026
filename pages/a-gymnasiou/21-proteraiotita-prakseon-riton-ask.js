import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός κεφαλαίων από τόνους με διατήρηση του Α'
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

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
};

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

// Helper για ασφαλή κατακόρυφη κλασματική γραφή σε HTML string
const htmlFrac = (num, den, isNeg = false) => {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;
  const absNum = numStr.replace(/^-/, '');
  const absDen = denStr.replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] shrink-0 max-w-full">${
    hasMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${absNum}</span><span class="px-0.5 sm:px-1 pt-0.5 break-all">${absDen}</span></span></span>`;
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ ΠΡΑΞΕΩΝ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Πολλαπλασιασμός πριν την πρόσθεση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ & ΠΡΟΣΘΕΣΗ' : 'MULTIPLICATION & ADDITION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης: 5 ＋ 3 · 4`
        : `Calculate the value of the expression: 5 ＋ 3 · 4`,
      correctAnswer: '17',
      solution: locale === 'el'
        ? `Προηγείται ο πολλαπλασιασμός: 3 · 4 ＝ 12. Στη συνέχεια προσθέτουμε: 5 ＋ 12 ＝ 17.`
        : `Multiplication takes precedence: 3 · 4 ＝ 12. Then we add: 5 ＋ 12 ＝ 17.`,
    };
  },

  // 2. Παρένθεση πριν τον πολλαπλασιασμό (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΑΡΕΝΘΕΣΗ ΥΠΕΡΙΣΧΥΕΙ' : 'PARENTHESES FIRST',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης: (5 ＋ 3) · 4`
        : `Calculate the value of the expression: (5 ＋ 3) · 4`,
      correctAnswer: '32',
      solution: locale === 'el'
        ? `Προηγείται η πράξη μέσα στην παρένθεση: 5 ＋ 3 ＝ 8. Μετά πολλαπλασιάζουμε: 8 · 4 ＝ 32.`
        : `Operation inside parentheses comes first: 5 ＋ 3 ＝ 8. Then multiply: 8 · 4 ＝ 32.`,
    };
  },

  // 3. Δύναμη πριν τον πολλαπλασιασμό (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΥΝΑΜΗ & ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ' : 'POWER & MULTIPLICATION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης: 2 · 3<sup>2</sup>`
        : `Calculate the value of the expression: 2 · 3<sup>2</sup>`,
      correctAnswer: '18',
      solution: locale === 'el'
        ? `Προηγείται η δύναμη: 3<sup>2</sup> ＝ 9. Στη συνέχεια πολλαπλασιάζουμε: 2 · 9 ＝ 18.`
        : `The power takes precedence: 3<sup>2</sup> ＝ 9. Then multiply: 2 · 9 ＝ 18.`,
    };
  },

  // 4. Διαίρεση και πολλαπλασιασμός από αριστερά προς τα δεξιά (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΕΙΡΑ ΑΠΟ ΑΡΙΣΤΕΡΑ' : 'ORDER FROM LEFT',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης: 12 ： 3 · 2`
        : `Calculate the value of the expression: 12 ： 3 · 2`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `Επειδή διαίρεση και πολλαπλασιασμός έχουν την ίδια προτεραιότητα, εκτελούνται από αριστερά προς τα δεξιά: (12 ： 3) · 2 ＝ 4 · 2 ＝ 8.`
        : `Because division and multiplication have the same priority, they are performed from left to right: (12 ： 3) · 2 ＝ 4 · 2 ＝ 8.`,
    };
  },

  // 5. Παράσταση με αρνητικούς αριθμούς (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟΙ & ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ' : 'NEGATIVES & MULTIPLICATION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: 20 － 4 · (－3)`
        : `Calculate the value: 20 － 4 · (－3)`,
      correctAnswer: '32',
      solution: locale === 'el'
        ? `Προηγείται ο πολλαπλασιασμός: 4 · (－3) ＝ －12. Μετά η αφαίρεση: 20 － (－12) ＝ 20 ＋ 12 ＝ 32.`
        : `Multiplication comes first: 4 · (－3) ＝ －12. Then subtraction: 20 － (－12) ＝ 20 ＋ 12 ＝ 32.`,
    };
  },

  // 6. Δύναμη αρνητικού μέσα σε παρένθεση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΥΝΑΜΗ ΑΡΝΗΤΙΚΟΥ' : 'POWER OF NEGATIVE',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: 10 － (－2)<sup>3</sup>`
        : `Calculate the value: 10 － (－2)<sup>3</sup>`,
      correctAnswer: '18',
      solution: locale === 'el'
        ? `Υπολογίζουμε πρώτα τη δύναμη: (－2)<sup>3</sup> ＝ －8. Στη συνέχεια αφαιρούμε: 10 － (－8) ＝ 10 ＋ 8 ＝ 18.`
        : `Calculate the power first: (－2)<sup>3</sup> ＝ －8. Then subtract: 10 － (－8) ＝ 10 ＋ 8 ＝ 18.`,
    };
  },

  // 7. Προτεραιότητα μέσα σε παρένθεση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΘΕΤΗ ΠΑΡΕΝΘΕΣΗ' : 'COMPLEX PARENTHESES',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: 3 · (10 － 2 · 3)`
        : `Calculate the value: 3 · (10 － 2 · 3)`,
      correctAnswer: '12',
      solution: locale === 'el'
        ? `Μέσα στην παρένθεση προηγείται ο πολλαπλασιασμός: 2 · 3 ＝ 6. Άρα: 10 － 6 ＝ 4. Τέλος: 3 · 4 ＝ 12.`
        : `Inside the parentheses, multiplication comes first: 2 · 3 ＝ 6. So: 10 － 6 ＝ 4. Finally: 3 · 4 ＝ 12.`,
    };
  },

  // 8. Πράξεις με κλάσματα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΣΕ ΚΛΑΣΜΑΤΑ' : 'ORDER IN FRACTIONS',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: (${htmlFrac(1, 2)}) ＋ (${htmlFrac(3, 2)}) · (${htmlFrac(1, 3)})`
        : `Calculate the value: (${htmlFrac(1, 2)}) ＋ (${htmlFrac(3, 2)}) · (${htmlFrac(1, 3)})`,
      correctAnswer: '1',
      solution: locale === 'el'
        ? `Προηγείται ο πολλαπλασιασμός: (${htmlFrac(3, 2)}) · (${htmlFrac(1, 3)}) ＝ 3/6 ＝ ${htmlFrac(1, 2)}. Στη συνέχεια προσθέτουμε: ${htmlFrac(1, 2)} ＋ ${htmlFrac(1, 2)} ＝ 1.`
        : `Multiplication comes first: (${htmlFrac(3, 2)}) · (${htmlFrac(1, 3)}) ＝ 3/6 ＝ ${htmlFrac(1, 2)}. Then add: ${htmlFrac(1, 2)} ＋ ${htmlFrac(1, 2)} ＝ 1.`,
    };
  },

  // 9. Παράσταση με δεκαδικούς (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΟΙ ΑΡΙΘΜΟΙ' : 'DECIMAL NUMBERS',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: 4,5 － 1,5 · 2`
        : `Calculate the value: 4.5 － 1.5 · 2`,
      correctAnswer: locale === 'el' ? '1,5' : '1.5',
      solution: locale === 'el'
        ? `Προηγείται ο πολλαπλασιασμός: 1,5 · 2 ＝ 3,0. Στη συνέχεια: 4,5 － 3,0 ＝ 1,5.`
        : `Multiplication comes first: 1.5 · 2 ＝ 3.0. Then: 4.5 － 3.0 ＝ 1.5.`,
    };
  },

  // 10. Θεωρία ιεραρχίας πράξεων (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? '1. Δυνάμεις ➔ 2. Πολλαπλασιασμοί & Διαιρέσεις ➔ 3. Προσθέσεις & Αφαιρέσεις'
      : '1. Powers ➔ 2. Multiplications & Divisions ➔ 3. Additions & Subtractions';
    const wrongs = locale === 'el'
      ? [
          '1. Προσθέσεις & Αφαιρέσεις ➔ 2. Πολλαπλασιασμοί ➔ 3. Δυνάμεις',
          '1. Πολλαπλασιασμοί ➔ 2. Δυνάμεις ➔ 3. Προσθέσεις',
          'Εκτελούνται πάντοτε αυστηρά από αριστερά προς τα δεξιά ανεξάρτητα από το είδος της πράξης',
        ]
      : [
          '1. Additions & Subtractions ➔ 2. Multiplications ➔ 3. Powers',
          '1. Multiplications ➔ 2. Powers ➔ 3. Additions',
          'Operations are strictly performed left-to-right regardless of operation type',
        ];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΚΑΝΟΝΑΣ ΙΕΡΑΡΧΙΑΣ' : 'HIERARCHY RULE',
      question: locale === 'el'
        ? `Ποια είναι η σωστή σειρά εκτέλεσης πράξεων σε μια αριθμητική παράσταση χωρίς παρενθέσεις;`
        : `What is the correct order of operations in a numerical expression without parentheses?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Η σωστή ιεραρχία είναι: πρώτα οι δυνάμεις, μετά οι πολλαπλασιασμοί και οι διαιρέσεις, και τέλος οι προσθέσεις και οι αφαιρέσεις.`
        : `The correct hierarchy is: powers first, followed by multiplication and division, and finally addition and subtraction.`,
    };
  },

  // 11. Διπλή παρένθεση / αγκύλη (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΣΩΤΕΡΙΚΗ ΠΑΡΕΝΘΕΣΗ' : 'INNER PARENTHESIS',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: 2 · [15 － (3 ＋ 2)]`
        : `Calculate the value: 2 · [15 － (3 ＋ 2)]`,
      correctAnswer: '20',
      solution: locale === 'el'
        ? `Υπολογίζουμε πρώτα την εσωτερική παρένθεση: 3 ＋ 2 ＝ 5. Έπειτα την αγκύλη: 15 － 5 ＝ 10. Τέλος: 2 · 10 ＝ 20.`
        : `First compute the inner parenthesis: 3 ＋ 2 ＝ 5. Next the brackets: 15 － 5 ＝ 10. Finally: 2 · 10 ＝ 20.`,
    };
  },

  // 12. Παγίδα αρνητικού πρόσημου και δύναμης (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΑΓΙΔΑ ΠΡΟΣΗΜΟΥ' : 'SIGN TRAP',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: －3<sup>2</sup> ＋ 4 · 2`
        : `Calculate the value: －3<sup>2</sup> ＋ 4 · 2`,
      correctAnswer: '-1',
      solution: locale === 'el'
        ? `－3<sup>2</sup> ＝ －9 (το μείον δεν είναι σε παρένθεση). 4 · 2 ＝ 8. Άρα: －9 ＋ 8 ＝ －1.`
        : `－3<sup>2</sup> ＝ －9 (the minus sign is not in parentheses). 4 · 2 ＝ 8. Thus: －9 ＋ 8 ＝ －1.`,
    };
  },

  // 13. Διαίρεση κλασμάτων σε παρένθεση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΑΡΕΝΘΕΣΗ ΜΕ ΔΙΑΙΡΕΣΗ' : 'PARENTHESIS WITH DIVISION',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(1, 3)}) · [(${htmlFrac(2, 5)}) ： (${htmlFrac(2, 5)})] (μορφή α/β):`
        : `Calculate as an irreducible fraction: (${htmlFrac(1, 3)}) · [(${htmlFrac(2, 5)}) ： (${htmlFrac(2, 5)})] (form a/b):`,
      correctAnswer: '1/3',
      solution: locale === 'el'
        ? `Μέσα στην παρένθεση: (${htmlFrac(2, 5)}) ： (${htmlFrac(2, 5)}) ＝ 1. Έτσι: (${htmlFrac(1, 3)}) · 1 ＝ ${htmlFrac(1, 3)}.`
        : `Inside the brackets: (${htmlFrac(2, 5)}) ： (${htmlFrac(2, 5)}) ＝ 1. Thus: (${htmlFrac(1, 3)}) · 1 ＝ ${htmlFrac(1, 3)}.`,
    };
  },

  // 14. Αφαίρεση και διαίρεση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΙΑΙΡΕΣΗ ΠΡΙΝ ΤΗΝ ΑΦΑΙΡΕΣΗ' : 'DIVISION BEFORE SUBTRACTION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: 16 － 8 ： 4`
        : `Calculate the value: 16 － 8 ： 4`,
      correctAnswer: '14',
      solution: locale === 'el'
        ? `Προηγείται η διαίρεση: 8 ： 4 ＝ 2. Μετά η αφαίρεση: 16 － 2 ＝ 14.`
        : `Division comes first: 8 ： 4 ＝ 2. Then subtraction: 16 － 2 ＝ 14.`,
    };
  },

  // 15. Δύναμη σε άθροισμα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΥΝΑΜΗ ΑΘΡΟΙΣΜΑΤΟΣ' : 'POWER OF A SUM',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: (2 ＋ 1)<sup>3</sup> － 7`
        : `Calculate the value: (2 ＋ 1)<sup>3</sup> － 7`,
      correctAnswer: '20',
      solution: locale === 'el'
        ? `Πρώτα το άθροισμα στην παρένθεση: 2 ＋ 1 ＝ 3. Μετά η δύναμη: 3<sup>3</sup> ＝ 27. Τέλος: 27 － 7 ＝ 20.`
        : `First calculate the sum in parentheses: 2 ＋ 1 ＝ 3. Next the power: 3<sup>3</sup> ＝ 27. Finally: 27 － 7 ＝ 20.`,
    };
  },

  // 16. Παράσταση με μηδέν (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΗΔΕΝΙΚΟΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ' : 'ZERO MULTIPLICATION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: 8 ＋ 0 · (4<sup>2</sup> － 5)`
        : `Calculate the value: 8 ＋ 0 · (4<sup>2</sup> － 5)`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `Οποιοσδήποτε αριθμός πολλαπλασιαστεί με το 0 ισούται με 0. Άρα: 8 ＋ 0 ＝ 8.`
        : `Any number multiplied by 0 equals 0. Thus: 8 ＋ 0 ＝ 8.`,
    };
  },

  // 17. Διαίρεση αρνητικών με πρόσθεση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟΙ ΣΕ ΔΙΑΙΡΕΣΗ' : 'NEGATIVES IN DIVISION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: (－15) ： (－3) － 7`
        : `Calculate the value: (－15) ： (－3) － 7`,
      correctAnswer: '-2',
      solution: locale === 'el'
        ? `Προηγείται η διαίρεση ομόσημων: (－15) ： (－3) ＝ ＋5. Στη συνέχεια: 5 － 7 ＝ －2.`
        : `Division of numbers with the same sign comes first: (－15) ： (－3) ＝ ＋5. Then: 5 － 7 ＝ －2.`,
    };
  },

  // 18. Σειρά εκτέλεσης σε διαδοχικές διαιρέσεις (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΙΑΔΟΧΙΚΕΣ ΔΙΑΙΡΕΣΕΙΣ' : 'CONSECUTIVE DIVISIONS',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: 24 ： 4 ： 2`
        : `Calculate the value: 24 ： 4 ： 2`,
      correctAnswer: '3',
      solution: locale === 'el'
        ? `Εκτελούμε αυστηρά από αριστερά προς τα δεξιά: (24 ： 4) ： 2 ＝ 6 ： 2 ＝ 3.`
        : `Execute strictly from left to right: (24 ： 4) ： 2 ＝ 6 ： 2 ＝ 3.`,
    };
  },

  // 19. Παράσταση με δεκαδικό και δύναμη (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΟΣ & ΔΥΝΑΜΗ' : 'DECIMAL & POWER',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: 10 － 2 · 0,5<sup>2</sup>`
        : `Calculate the value: 10 － 2 · 0.5<sup>2</sup>`,
      correctAnswer: locale === 'el' ? '9,5' : '9.5',
      solution: locale === 'el'
        ? `Προηγείται η δύναμη: 0,5<sup>2</sup> ＝ 0,25. Μετά ο πολλαπλασιασμός: 2 · 0,25 ＝ 0,5. Τέλος: 10 － 0,5 ＝ 9,5.`
        : `The power comes first: 0.5<sup>2</sup> ＝ 0.25. Then multiplication: 2 · 0.25 ＝ 0.5. Finally: 10 － 0.5 ＝ 9.5.`,
    };
  },

  // 20. Σύνθετη αριθμητική παράσταση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΘΕΤΗ ΑΡΙΘΜΗΤΙΚΗ' : 'COMPLEX NUMERICAL',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: 5 · 2 ＋ 18 ： 3<sup>2</sup>`
        : `Calculate the value: 5 · 2 ＋ 18 ： 3<sup>2</sup>`,
      correctAnswer: '12',
      solution: locale === 'el'
        ? `1. Δύναμη: 3<sup>2</sup> ＝ 9. 2. Πολλαπλασιασμός και διαίρεση: 5 · 2 ＝ 10 και 18 ： 9 ＝ 2. 3. Πρόσθεση: 10 ＋ 2 ＝ 12.`
        : `1. Power: 3<sup>2</sup> ＝ 9. 2. Multiplication and division: 5 · 2 ＝ 10 and 18 ： 9 ＝ 2. 3. Addition: 10 ＋ 2 ＝ 12.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΠΟΛΛΑΠΛΩΝ ΠΡΑΞΕΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Αγορές στο σούπερ μάρκετ
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'PROBLEMS: SHOPPING',
      question: locale === 'el'
        ? `Ο Νίκος αγόρασε 3 τετράδια προς 2,50 € το ένα και 4 στυλό προς 1,20 € το ένα. Έδωσε χαρτονόμισμα των 20 €. Πόσα ρέστα πήρε σε ευρώ (παράσταση: 20 － (3 · 2,5 ＋ 4 · 1,2));`
        : `Nikos bought 3 notebooks for 2.50 € each and 4 pens for 1.20 € each. He paid with a 20 € bill. How much change did he receive in euros (expression: 20 － (3 · 2.5 ＋ 4 · 1.2))?`,
      correctAnswer: locale === 'el' ? '7,7' : '7.7',
      solution: locale === 'el'
        ? `Κόστος ＝ 3 · 2,50 ＋ 4 · 1,20 ＝ 7,50 ＋ 4,80 ＝ 12,30 €. Ρέστα ＝ 20 － 12,30 ＝ 7,70 € (γράφεται 7,7).`
        : `Cost ＝ 3 · 2.50 ＋ 4 · 1.20 ＝ 7.50 ＋ 4.80 ＝ 12.30 €. Change ＝ 20 － 12.30 ＝ 7.70 € (written as 7.7).`,
    };
  },

  // Πρόβλημα 2: Εισιτήρια κινηματογράφου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΙΣΙΤΗΡΙΑ' : 'PROBLEMS: TICKETS',
      question: locale === 'el'
        ? `Μια παρέα 2 ενηλίκων και 3 παιδιών πήγε σινεμά. Το εισιτήριο ενηλίκων κοστίζει 8 € και το παιδικό 5 €. Αν είχαν συνολική έκπτωση 4 € από κουπόνι, πόσα ευρώ πλήρωσαν (παράσταση: 2 · 8 ＋ 3 · 5 － 4);`
        : `A group of 2 adults and 3 children went to the cinema. The adult ticket costs 8 € and the child ticket 5 €. If they had a coupon discount of 4 €, how much did they pay in total (expression: 2 · 8 ＋ 3 · 5 － 4)?`,
      correctAnswer: '27',
      solution: locale === 'el'
        ? `2 · 8 ＋ 3 · 5 － 4 ＝ 16 ＋ 15 － 4 ＝ 31 － 4 ＝ 27 €.`
        : `2 · 8 ＋ 3 · 5 － 4 ＝ 16 ＋ 15 － 4 ＝ 31 － 4 ＝ 27 €.`,
    };
  },

  // Πρόβλημα 3: Εμβαδόν πλακόστρωσης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Μια αυλή αποτελείται από ένα ορθογώνιο διαστάσεων 6 m επί 4 m και ένα τετράγωνο παρτέρι πλευράς 3 m που αφαιρείται από το πλακόστρωτο. Ποιο είναι το καθαρό εμβαδόν πλακόστρωσης σε τ.μ. (παράσταση: 6 · 4 － 3<sup>2</sup>);`
        : `A courtyard consists of a 6 m by 4 m rectangle and a 3 m square flowerbed subtracted from the paved area. What is the net paved area in m² (expression: 6 · 4 － 3<sup>2</sup>)?`,
      correctAnswer: '15',
      solution: locale === 'el'
        ? `6 · 4 － 3<sup>2</sup> ＝ 24 － 9 ＝ 15 τ.μ.`
        : `6 · 4 － 3<sup>2</sup> ＝ 24 － 9 ＝ 15 m².`,
    };
  },

  // Πρόβλημα 4: Αμοιβή εργασίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΙΣΘΟΔΟΣΙΑ' : 'PROBLEMS: LABOR',
      question: locale === 'el'
        ? `Ένας τεχνικός χρεώνει 25 € πάγια επίσκεψη και 15 € για κάθε ώρα εργασίας. Αν εργάστηκε 4 ώρες και έγινε έκπτωση 10 €, ποια ήταν η συνολική αμοιβή του σε ευρώ (παράσταση: 25 ＋ 4 · 15 － 10);`
        : `A technician charges 25 € base call fee and 15 € per hour of work. If he worked 4 hours and offered a 10 € discount, what was his total fee in euros (expression: 25 ＋ 4 · 15 － 10)?`,
      correctAnswer: '75',
      solution: locale === 'el'
        ? `25 ＋ 4 · 15 － 10 ＝ 25 ＋ 60 － 10 ＝ 85 － 10 ＝ 75 €.`
        : `25 ＋ 4 · 15 － 10 ＝ 25 ＋ 60 － 10 ＝ 85 － 10 ＝ 75 €.`,
    };
  },

  // Πρόβλημα 5: Διαχείριση αποταμίευσης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'PROBLEMS: SAVINGS',
      question: locale === 'el'
        ? `Η Ελένη είχε 50 €. Επί 4 εβδομάδες αποταμίευε 12 € την εβδομάδα και στο τέλος αγόρασε ένα βιβλίο αξίας 28 €. Πόσα χρήματα της έμειναν σε ευρώ (παράσταση: 50 ＋ 4 · 12 － 28);`
        : `Eleni had 50 €. For 4 weeks she saved 12 € each week and then bought a book worth 28 €. How much money did she have left in euros (expression: 50 ＋ 4 · 12 － 28)?`,
      correctAnswer: '70',
      solution: locale === 'el'
        ? `50 ＋ 4 · 12 － 28 ＝ 50 ＋ 48 － 28 ＝ 98 － 28 ＝ 70 €.`
        : `50 ＋ 4 · 12 － 28 ＝ 50 ＋ 48 － 28 ＝ 98 － 28 ＝ 70 €.`,
    };
  },

  // Πρόβλημα 6: Βαθμολογία διαγωνίσματος
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ' : 'PROBLEMS: GRADING',
      question: locale === 'el'
        ? `Σε ένα κουίζ κάθε σωστή απάντηση δίνει ＋4 πόντους και κάθε λάθος αφαιρεί 2 πόντους (－2). Ένας μαθητής είχε 15 σωστές και 5 λάθη. Ποια ήταν η τελική βαθμολογία του (παράσταση: 15 · 4 ＋ 5 · (－2));`
        : `In a quiz, each correct answer gives ＋4 points and each wrong answer subtracts 2 points (－2). A student had 15 correct and 5 wrong answers. What was the final score (expression: 15 · 4 ＋ 5 · (－2))?`,
      correctAnswer: '50',
      solution: locale === 'el'
        ? `15 · 4 ＋ 5 · (－2) ＝ 60 － 10 ＝ 50 πόντοι.`
        : `15 · 4 ＋ 5 · (－2) ＝ 60 － 10 ＝ 50 points.`,
    };
  },

  // Πρόβλημα 7: Χωρητικότητα κιβωτίων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΘΗΚΗ' : 'PROBLEMS: WAREHOUSE',
      question: locale === 'el'
        ? `Σε μια αποθήκη υπάρχουν 5 μεγάλα κιβώτια με 12 μπουκάλια το καθένα και 4 μικρότερα με 6 μπουκάλια το καθένα. Αν αφαιρεθούν 14 μπουκάλια για παραγγελία, πόσα απομένουν (παράσταση: 5 · 12 ＋ 4 · 6 － 14);`
        : `In a warehouse there are 5 large boxes with 12 bottles each and 4 smaller ones with 6 bottles each. If 14 bottles are removed for an order, how many remain (expression: 5 · 12 ＋ 4 · 6 － 14)?`,
      correctAnswer: '70',
      solution: locale === 'el'
        ? `5 · 12 ＋ 4 · 6 － 14 ＝ 60 ＋ 24 － 14 ＝ 84 － 14 ＝ 70 μπουκάλια.`
        : `5 · 12 ＋ 4 · 6 － 14 ＝ 60 ＋ 24 － 14 ＝ 84 － 14 ＝ 70 bottles.`,
    };
  },

  // Πρόβλημα 8: Μεταβολή θερμοκρασίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ' : 'PROBLEMS: TEMPERATURE',
      question: locale === 'el'
        ? `Το πρωί η θερμοκρασία ήταν 2 °C. Τις επόμενες 3 ώρες ανέβαινε κατά 2 °C την ώρα και το βράδυ έπεσε κατά 5 °C. Ποια είναι η τελική θερμοκρασία σε °C (παράσταση: 2 ＋ 3 · 2 － 5);`
        : `In the morning the temperature was 2 °C. Over the next 3 hours it rose by 2 °C per hour, and at night it dropped by 5 °C. What is the final temperature in °C (expression: 2 ＋ 3 · 2 － 5)?`,
      correctAnswer: '3',
      solution: locale === 'el'
        ? `2 ＋ 3 · 2 － 5 ＝ 2 ＋ 6 － 5 ＝ 8 － 5 ＝ 3 °C.`
        : `2 ＋ 3 · 2 － 5 ＝ 2 ＋ 6 － 5 ＝ 8 － 5 ＝ 3 °C.`,
    };
  },

  // Πρόβλημα 9: Υπολογισμός μέσου όρου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΤΑΤΙΣΤΙΚΗ' : 'PROBLEMS: STATISTICS',
      question: locale === 'el'
        ? `Ένας μαθητής έγραψε σε τρία τεστ 16, 18 και 17. Ποιος είναι ο μέσος όρος του (παράσταση: (16 ＋ 18 ＋ 17) ： 3);`
        : `A student scored 16, 18, and 17 on three tests. What is their average score (expression: (16 ＋ 18 ＋ 17) ： 3)?`,
      correctAnswer: '17',
      solution: locale === 'el'
        ? `(16 ＋ 18 ＋ 17) ： 3 ＝ 51 ： 3 ＝ 17.`
        : `(16 ＋ 18 ＋ 17) ： 3 ＝ 51 ： 3 ＝ 17.`,
    };
  },

  // Πρόβλημα 10: Κατανάλωση καυσίμου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ' : 'PROBLEMS: FUEL',
      question: locale === 'el'
        ? `Ένα ντεπόζιτο είχε 60 λίτρα καυσίμου. Σε ένα ταξίδι καταναλώνονταν 6 λίτρα ανά 100 km για 4 εκατοντάδες km και κατόπιν προστέθηκαν 15 λίτρα στο βενζινάδικο. Πόσα λίτρα έχει τώρα (παράσταση: 60 － 4 · 6 ＋ 15);`
        : `A fuel tank had 60 liters. On a journey, 6 liters per 100 km were consumed for 4 hundred km, and then 15 liters were added at a station. How many liters does it hold now (expression: 60 － 4 · 6 ＋ 15)?`,
      correctAnswer: '51',
      solution: locale === 'el'
        ? `60 － 4 · 6 ＋ 15 ＝ 60 － 24 ＋ 15 ＝ 36 ＋ 15 ＝ 51 λίτρα.`
        : `60 － 4 · 6 ＋ 15 ＝ 60 － 24 ＋ 15 ＝ 36 ＋ 15 ＝ 51 liters.`,
    };
  },

  // Πρόβλημα 11: Αξία πακέτων προσφοράς
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'PROBLEMS: SHOPPING',
      question: locale === 'el'
        ? `Ένα κατάστημα πουλάει 3 μπλούζες προς 15 € τη μία. Αν στη δεύτερη και στην τρίτη γίνεται συνολική έκπτωση 8 €, πόσο πληρώνει ο πελάτης σε ευρώ (παράσταση: 3 · 15 － 8);`
        : `A store sells 3 shirts for 15 € each. If a total discount of 8 € is applied to the bundle, how much does the customer pay in euros (expression: 3 · 15 － 8)?`,
      correctAnswer: '37',
      solution: locale === 'el'
        ? `3 · 15 － 8 ＝ 45 － 8 ＝ 37 €.`
        : `3 · 15 － 8 ＝ 45 － 8 ＝ 37 €.`,
    };
  },

  // Πρόβλημα 12: Περίμετρος σύνθετου σχήματος
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ένα σχήμα αποτελείται από 2 πλευρές των 8 cm και 3 πλευρές των 5 cm. Ποια είναι η περίμετρός του σε cm (παράσταση: 2 · 8 ＋ 3 · 5);`
        : `A polygon consists of 2 sides measuring 8 cm each and 3 sides measuring 5 cm each. What is its perimeter in cm (expression: 2 · 8 ＋ 3 · 5)?`,
      correctAnswer: '31',
      solution: locale === 'el'
        ? `2 · 8 ＋ 3 · 5 ＝ 16 ＋ 15 ＝ 31 cm.`
        : `2 · 8 ＋ 3 · 5 ＝ 16 ＋ 15 ＝ 31 cm.`,
    };
  },

  // Πρόβλημα 13: Προγραμματισμός χρόνου μελέτης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ' : 'PROBLEMS: STUDY TIME',
      question: locale === 'el'
        ? `Ο Αλέξανδρος διαβάζει 4 μαθήματα αφιερώνοντας 25 λεπτά στο καθένα και κάνει ένα διάλειμμα 15 λεπτών. Πόσα λεπτά διαρκεί συνολικά η μελέτη του (παράσταση: 4 · 25 ＋ 15);`
        : `Alexandros studies 4 subjects spending 25 minutes on each and takes a 15-minute break. How many minutes does his study take in total (expression: 4 · 25 ＋ 15)?`,
      correctAnswer: '115',
      solution: locale === 'el'
        ? `4 · 25 ＋ 15 ＝ 100 ＋ 15 ＝ 115 λεπτά.`
        : `4 · 25 ＋ 15 ＝ 100 ＋ 15 ＝ 115 minutes.`,
    };
  },

  // Πρόβλημα 14: Κατασκευή περιφράξεων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ' : 'PROBLEMS: CONSTRUCTION',
      question: locale === 'el'
        ? `Ένας εργάτης είχε 100 μέτρα σύρμα. Περιέφραξε 3 οικόπεδα χρησιμοποιώντας 24 μέτρα για το καθένα και του δόθηκε επιπλέον κουλούρα 15 μέτρων. Πόσα μέτρα σύρμα έχει τώρα (παράσταση: 100 － 3 · 24 ＋ 15);`
        : `A worker had 100 meters of wire. He fenced 3 plots using 24 meters for each and received an additional roll of 15 meters. How many meters of wire does he have now (expression: 100 － 3 · 24 ＋ 15)?`,
      correctAnswer: '43',
      solution: locale === 'el'
        ? `100 － 3 · 24 ＋ 15 ＝ 100 － 72 ＋ 15 ＝ 28 ＋ 15 ＝ 43 μέτρα.`
        : `100 － 3 · 24 ＋ 15 ＝ 100 － 72 ＋ 15 ＝ 28 ＋ 15 ＝ 43 meters.`,
    };
  },

  // Πρόβλημα 15: Μοίρασμα κερδών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΤΑΙΡΕΙΕΣ' : 'PROBLEMS: BUSINESS',
      question: locale === 'el'
        ? `Μια επιχείρηση είχε έσοδα 800 € και έξοδα 200 €. Τα καθαρά κέρδη μοιράστηκαν ισόποσα σε 4 εταίρους. Πόσα ευρώ πήρε ο καθένας (παράσταση: (800 － 200) ： 4);`
        : `A business had revenues of 800 € and expenses of 200 €. The net profits were split equally among 4 partners. How many euros did each partner receive (expression: (800 － 200) ： 4)?`,
      correctAnswer: '150',
      solution: locale === 'el'
        ? `(800 － 200) ： 4 ＝ 600 ： 4 ＝ 150 €.`
        : `(800 － 200) ： 4 ＝ 600 ： 4 ＝ 150 €.`,
    };
  },

  // Πρόβλημα 16: Αγορά υλικών συσκευασίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'PROBLEMS: PACKAGING',
      question: locale === 'el'
        ? `Αγοράστηκαν 6 χαρτοκιβώτια προς 1,50 € το ένα και 2 ρολά ταινίας προς 2,50 € το ένα. Πόσο ήταν το συνολικό κόστος σε ευρώ (παράσταση: 6 · 1,5 ＋ 2 · 2,5);`
        : `6 cardboard boxes were bought at 1.50 € each and 2 rolls of tape at 2.50 € each. What was the total cost in euros (expression: 6 · 1.5 ＋ 2 · 2.5)?`,
      correctAnswer: '14',
      solution: locale === 'el'
        ? `6 · 1,50 ＋ 2 · 2,50 ＝ 9,00 ＋ 5,00 ＝ 14 €.`
        : `6 · 1.50 ＋ 2 · 2.50 ＝ 9.00 ＋ 5.00 ＝ 14 €.`,
    };
  },

  // Πρόβλημα 17: Χωρητικότητα πισίνας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΥΔΡΑΥΛΙΚΑ' : 'PROBLEMS: CAPACITY',
      question: locale === 'el'
        ? `Μια πισίνα αδειάζει με ρυθμό 5 κυβικά μέτρα την ώρα επί 4 ώρες και μετά γεμίζει κατά 12 κυβικά μέτρα. Αν αρχικά είχε 80 κυβικά μέτρα, πόσα έχει τώρα (παράσταση: 80 － 4 · 5 ＋ 12);`
        : `A pool drains at a rate of 5 cubic meters per hour for 4 hours and then is replenished with 12 cubic meters. If it initially had 80 cubic meters, how many does it hold now (expression: 80 － 4 · 5 ＋ 12)?`,
      correctAnswer: '72',
      solution: locale === 'el'
        ? `80 － 4 · 5 ＋ 12 ＝ 80 － 20 ＋ 12 ＝ 60 ＋ 12 ＝ 72 κ.μ.`
        : `80 － 4 · 5 ＋ 12 ＝ 80 － 20 ＋ 12 ＝ 60 ＋ 12 ＝ 72 m³.`,
    };
  },

  // Πρόβλημα 18: Βάρος φορτίου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ' : 'PROBLEMS: TRANSPORT',
      question: locale === 'el'
        ? `Ένα φορτηγό ζυγίζει 2.000 kg κενό και φορτώθηκαν 8 παλέτες των 250 kg η καθεμία. Στο πρώτο σημείο ξεφορτώθηκαν 500 kg. Ποιο είναι το συνολικό βάρος του φορτηγού σε kg (παράσταση: 2000 ＋ 8 · 250 － 500);`
        : `An empty truck weighs 2,000 kg and 8 pallets of 250 kg each were loaded. At the first destination, 500 kg were unloaded. What is the total weight of the truck in kg (expression: 2000 ＋ 8 · 250 － 500)?`,
      correctAnswer: '3500',
      solution: locale === 'el'
        ? `2000 ＋ 8 · 250 － 500 ＝ 2000 ＋ 2000 － 500 ＝ 4000 － 500 ＝ 3.500 kg.`
        : `2000 ＋ 8 · 250 － 500 ＝ 2000 ＋ 2000 － 500 ＝ 4000 － 500 ＝ 3,500 kg.`,
    };
  },

  // Πρόβλημα 19: Κόστος εκτύπωσης φυλλαδίων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΤΥΠΩΣΕΙΣ' : 'PROBLEMS: PRINTING',
      question: locale === 'el'
        ? `Ένα τυπογραφείο χρεώνει 30 € πάγια έξοδα προετοιμασίας και 0,10 € ανά φυλλάδιο. Πόσο κοστίζει η εκτύπωση 500 φυλλαδίων σε ευρώ (παράσταση: 30 ＋ 500 · 0,1);`
        : `A print shop charges 30 € fixed setup fee and 0.10 € per flyer. How much does printing 500 flyers cost in euros (expression: 30 ＋ 500 · 0.1)?`,
      correctAnswer: '80',
      solution: locale === 'el'
        ? `30 ＋ 500 · 0,10 ＝ 30 ＋ 50 ＝ 80 €.`
        : `30 ＋ 500 · 0.10 ＝ 30 ＋ 50 ＝ 80 €.`,
    };
  },

  // Πρόβλημα 20: Διάρκεια τηλεφωνικών κλήσεων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΠΙΚΟΙΝΩΝΙΑ' : 'PROBLEMS: CALLS',
      question: locale === 'el'
        ? `Ένας συνδρομητής έκανε 5 κλήσεις διάρκειας 4 λεπτών η καθεμία και 3 κλήσεις διάρκειας 6 λεπτών η καθεμία. Πόσα λεπτά μίλησε συνολικά (παράσταση: 5 · 4 ＋ 3 · 6);`
        : `A subscriber made 5 calls lasting 4 minutes each and 3 calls lasting 6 minutes each. How many minutes did they talk in total (expression: 5 · 4 ＋ 3 · 6)?`,
      correctAnswer: '38',
      solution: locale === 'el'
        ? `5 · 4 ＋ 3 · 6 ＝ 20 ＋ 18 ＝ 38 λεπτά.`
        : `5 · 4 ＋ 3 · 6 ＝ 20 ＋ 18 ＝ 38 minutes.`,
    };
  },
];

export default function ProteraiotitaPrakseonAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Συγκεντρωτικό λεξικό UI
  const t = {
    el: {
      pageTitle: "Ασκήσεις: Προτεραιότητα Πράξεων στους Ρητούς | Α' Γυμνασίου",
      pageDesc: "12 δυναμικές ασκήσεις και προβλήματα στην ιεραρχία και την προτεραιότητα πράξεων με ρητούς αριθμούς για την Α' Γυμνασίου.",
      backText: "Α' Γυμνασίου",
      btnTheory: "ΘΕΩΡΙΑ",
      badgeHeader: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 19 • ΕΞΑΣΚΗΣΗ",
      mainTitle: "Προτεραιότητα Πράξεων στους Ρητούς",
      mainSubtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία προτεραιότητας ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
      problemBadge: "ΠΡΟΒΛΗΜΑ",
      placeholderInput: "π.χ. 17 ή -1",
      labelCorrect: "ΣΩΣΤΟ",
      labelWrong: "ΛΑΘΟΣ",
      correctAnswerLabel: "ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:",
      btnCheck: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
      btnNew: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
      btnRetry: "ΕΠΑΝΑΛΗΨΗ",
      finalScore: "ΤΕΛΙΚΟ ΣΚΟΡ",
      progress: "ΠΡΟΟΔΟΣ",
      successRate: "ΕΠΙΤΥΧΙΑ"
    },
    en: {
      pageTitle: "Exercises: Order of Operations in Rational Numbers | 7th Grade",
      pageDesc: "12 dynamic exercises and problems on order of operations and arithmetic hierarchy in rational numbers for 7th Grade.",
      backText: "7th Grade",
      btnTheory: "THEORY",
      badgeHeader: "7TH GRADE • CHAPTER 19 • PRACTICE",
      mainTitle: "Order of Operations in Rational Numbers",
      mainSubtitle: "Solve the 12 selected exercises below (10 operations and precedence theory ＋ 2 real-world problems). Click 'CHECK ANSWERS' at the end to see your score and detailed solutions.",
      problemBadge: "PROBLEM",
      placeholderInput: "e.g. 17 or -1",
      labelCorrect: "CORRECT",
      labelWrong: "WRONG",
      correctAnswerLabel: "CORRECT ANSWER:",
      btnCheck: "CHECK ANSWERS",
      btnNew: "NEW EXERCISES",
      btnRetry: "RETRY",
      finalScore: "FINAL SCORE",
      progress: "PROGRESS",
      successRate: "SUCCESS"
    }
  }[locale];

  // Παραγωγή: 10 ασκήσεις υπολογισμών/θεωρίας + 2 ρεαλιστικά προβλήματα = 12 συνολικά
  const generateQuestions = () => {
    const shuffledCalcs = shuffleArray(CALCULATION_GENERATORS);
    const shuffledProblems = shuffleArray(WORD_PROBLEM_GENERATORS);

    const selectedCalcs = shuffledCalcs.slice(0, 10).map((gen, idx) => ({
      id: idx + 1,
      ...gen(locale),
    }));

    const selectedProblems = shuffledProblems.slice(0, 2).map((gen, idx) => ({
      id: 11 + idx,
      ...gen(locale),
    }));

    setQuestions([...selectedCalcs, ...selectedProblems]);
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

  const handleInputChange = (id, val) => {
    if (isSubmitted) return;
    let clean = val;
    if (locale === 'el') {
      clean = clean.replace(/\./g, ',');
      clean = clean.replace(/[^0-9,/,-]/g, '');
      const commaCount = (clean.match(/,/g) || []).length;
      if (commaCount > 1) return;
    } else {
      clean = clean.replace(/,/g, '.');
      clean = clean.replace(/[^0-9./,-]/g, '');
      const dotCount = (clean.match(/\./g) || []).length;
      if (dotCount > 1) return;
    }

    if (clean.includes('-')) {
      const parts = clean.split('-');
      clean = '-' + parts.join('').replace(/-/g, '');
    }

    const slashCount = (clean.match(/\//g) || []).length;
    if (slashCount > 1) return;
    if (clean.length > 12) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      let userAns = (userAnswers[q.id] || '').trim().toUpperCase().replace(/\s+/g, '');
      let correctAns = q.correctAnswer.trim().toUpperCase().replace(/\s+/g, '');

      userAns = userAns.replace(/^\+/, '');
      correctAns = correctAns.replace(/^\+/, '');

      if (locale === 'el') {
        userAns = userAns.replace(/\./g, ',');
        correctAns = correctAns.replace(/\./g, ',');
      } else {
        userAns = userAns.replace(/,/g, '.');
        correctAns = correctAns.replace(/,/g, '.');
      }

      // Ανοχή 0.05 σε δεκαδικούς ελέγχους
      const userNum = parseFloat(userAns.replace(',', '.'));
      const correctNum = parseFloat(correctAns.replace(',', '.'));

      if (!isNaN(userNum) && !isNaN(correctNum) && !userAns.includes('/') && !correctAns.includes('/')) {
        if (Math.abs(userNum - correctNum) < 0.05) {
          totalCorrect += 1;
          return;
        }
      }

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
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/21-proteraiotita-prakseon-riton"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.btnTheory)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-36 overflow-x-hidden space-y-8 box-border">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words">
              {toCleanUppercase(t.badgeHeader)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words">
              {toCleanUppercase(t.mainTitle)}
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
              let cleanUser = userAns.trim().toUpperCase().replace(/\s+/g, '').replace(/^\+/, '');
              let cleanCorrect = q.correctAnswer.trim().toUpperCase().replace(/\s+/g, '').replace(/^\+/, '');

              if (locale === 'el') {
                cleanUser = cleanUser.replace(/\./g, ',');
                cleanCorrect = cleanCorrect.replace(/\./g, ',');
              } else {
                cleanUser = cleanUser.replace(/,/g, '.');
                cleanCorrect = cleanCorrect.replace(/,/g, '.');
              }

              const userNum = parseFloat(cleanUser.replace(',', '.'));
              const correctNum = parseFloat(cleanCorrect.replace(',', '.'));

              let isCorrect = false;
              if (isSubmitted) {
                if (!isNaN(userNum) && !isNaN(correctNum) && !cleanUser.includes('/') && !cleanCorrect.includes('/')) {
                  isCorrect = Math.abs(userNum - correctNum) < 0.05;
                } else {
                  isCorrect = cleanUser === cleanCorrect;
                }
              }

              const isWordProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 min-w-0 ${
                    isWordProblem ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'
                  } ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3 min-w-0">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs sm:text-sm shrink-0 ${
                            isWordProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {q.id}
                        </span>
                        {isWordProblem && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded break-words">
                            {toCleanUppercase(t.problemBadge)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md break-words">
                        {toCleanUppercase(q.topic)}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug break-words"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ */}
                  <div className="space-y-2 pt-2 min-w-0">
                    {q.type === 'input' ? (
                      <div className="relative max-w-xs w-full">
                        <input
                          type="text"
                          inputMode="text"
                          maxLength={12}
                          disabled={isSubmitted}
                          placeholder={t.placeholderInput}
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-base font-bold rounded-xl border transition-all outline-none ${
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
                              className={`min-h-[44px] py-2 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between gap-2 transition-all touch-manipulation active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span className="break-words whitespace-normal leading-snug flex-1" dangerouslySetInnerHTML={{ __html: opt }} />
                              {isSelected && <span className="shrink-0">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση */}
                    {isSubmitted && (
                      <div
                        className={`p-4 rounded-xl text-xs sm:text-sm space-y-2.5 mt-3 border min-w-0 ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-sm sm:text-base">
                            <span>✅</span>
                            <span>{toCleanUppercase(t.labelCorrect)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>{toCleanUppercase(t.labelWrong)}</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-block break-words max-w-full">
                              {toCleanUppercase(t.correctAnswerLabel)}{' '}
                              <span className="text-emerald-700 font-black ml-1 inline-flex items-center flex-wrap" dangerouslySetInnerHTML={{ __html: q.correctAnswer }} />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-relaxed font-normal pt-1.5 border-t border-slate-200/60 break-words"
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
                <span>{toCleanUppercase(t.btnCheck)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.btnNew)}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR (12 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {toCleanUppercase(isSubmitted ? t.finalScore : t.progress)}
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
              <span className="hidden sm:inline">{toCleanUppercase(t.btnNew)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.btnCheck)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                {toCleanUppercase(t.btnRetry)}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
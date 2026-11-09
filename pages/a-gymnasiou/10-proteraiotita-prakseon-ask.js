import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΠΡΑΞΕΩΝ ΚΑΙ ΘΕΩΡΙΑΣ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ (i18n)
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Πολλαπλασιασμός πριν την πρόσθεση: a + b * c (Input)
  (locale) => {
    const a = randInt(4, 15);
    const b = randInt(2, 6);
    const c = randInt(3, 7);
    const prod = b * c;
    const ans = a + prod;
    return {
      type: 'input',
      topic: locale === 'en' ? 'ORDER OF OPERATIONS' : 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ',
      question:
        locale === 'en'
          ? `Calculate: ${a} ＋ ${b} · ${c}`
          : `Υπολόγισε την τιμή: ${a} ＋ ${b} · ${c}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Multiplication precedes addition: ${b} · ${c} ＝ ${prod}. Then add: ${a} ＋ ${prod} ＝ ${ans}.`
          : `Προηγείται ο πολλαπλασιασμός: ${b} · ${c} ＝ ${prod}. Έπειτα προσθέτουμε: ${a} ＋ ${prod} ＝ ${ans}.`,
    };
  },

  // 2. Πολλαπλασιασμός με αρνητικό: a - b * (-c) (Input)
  (locale) => {
    const a = randInt(5, 15);
    const b = randInt(2, 5);
    const c = randInt(3, 6);
    const prod = -(b * c);
    const ans = a - prod; // a + b*c
    return {
      type: 'input',
      topic: locale === 'en' ? 'ORDER OF OPERATIONS' : 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΠΡΑΞΕΩΝ',
      question:
        locale === 'en'
          ? `Calculate: ${a} － ${b} · (－${c})`
          : `Υπολόγισε: ${a} － ${b} · (－${c})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Multiplication first: ${b} · (－${c}) ＝ ${prod}. Next: ${a} － (${prod}) ＝ ${a} ＋ ${b * c} ＝ ${ans}.`
          : `Προηγείται ο πολλαπλασιασμός: ${b} · (－${c}) ＝ ${prod}. Στη συνέχεια: ${a} － (${prod}) ＝ ${a} ＋ ${b * c} ＝ ${ans}.`,
    };
  },

  // 3. Δύναμη πριν τον πολλαπλασιασμό: a + b * c^2 (Input)
  (locale) => {
    const a = randInt(5, 12);
    const b = randInt(2, 4);
    const c = randInt(2, 3);
    const pVal = c * c;
    const prod = b * pVal;
    const ans = a + prod;
    return {
      type: 'input',
      topic: locale === 'en' ? 'POWERS & MULTIPLICATION' : 'ΔΥΝΑΜΕΙΣ & ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
      question:
        locale === 'en'
          ? `Calculate: ${a} ＋ ${b} · ${c}<sup>2</sup>`
          : `Υπολόγισε: ${a} ＋ ${b} · ${c}<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Power takes priority: ${c}<sup>2</sup> ＝ ${pVal}. Then multiplication: ${b} · ${pVal} ＝ ${prod}. Finally: ${a} ＋ ${prod} ＝ ${ans}.`
          : `Προηγείται η δύναμη: ${c}<sup>2</sup> ＝ ${pVal}. Μετά ο πολλαπλασιασμός: ${b} · ${pVal} ＝ ${prod}. Τέλος: ${a} ＋ ${prod} ＝ ${ans}.`,
    };
  },

  // 4. Αρνητική βάση σε δύναμη: a * (-b)^2 (Input)
  (locale) => {
    const a = randInt(3, 7);
    const b = randInt(2, 4);
    const pVal = b * b;
    const ans = a * pVal;
    return {
      type: 'input',
      topic: locale === 'en' ? 'POWERS & MULTIPLICATION' : 'ΔΥΝΑΜΕΙΣ & ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
      question:
        locale === 'en'
          ? `Calculate: ${a} · (－${b})<sup>2</sup>`
          : `Υπολόγισε: ${a} · (－${b})<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${b})<sup>2</sup> ＝ ＋${pVal} (even exponent). Then: ${a} · ${pVal} ＝ ${ans}.`
          : `(－${b})<sup>2</sup> ＝ ＋${pVal} (άρτιος εκθέτης). Έπειτα: ${a} · ${pVal} ＝ ${ans}.`,
    };
  },

  // 5. Διαίρεση και πολλαπλασιασμός στη σειρά (MCQ)
  (locale) => {
    const m = randInt(2, 4);
    const d = randInt(2, 4);
    const a = m * d * randInt(2, 4);
    const mult = randInt(2, 3);
    const ans = (a / d) * mult;
    const wrong = a / (d * mult);
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'LEFT-TO-RIGHT ORDER' : 'ΣΕΙΡΑ ΑΡΙΣΤΕΡΑ-ΔΕΞΙΑ',
      question:
        locale === 'en'
          ? `What is the value of: ${a} : ${d} · ${mult}?`
          : `Ποιο είναι το αποτέλεσμα της παράστασης ${a} ： ${d} · ${mult};`,
      options: makeUniqueOptions(ans.toString(), [
        wrong.toString(),
        (ans + 2).toString(),
        (ans - 2).toString(),
      ]),
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Division and multiplication share equal precedence and are evaluated strictly from left to right: ${a} : ${d} ＝ ${a / d}, then ${a / d} · ${mult} ＝ ${ans}.`
          : `Η διαίρεση και ο πολλαπλασιασμός έχουν την ίδια προτεραιότητα και εκτελούνται αυστηρά από αριστερά προς τα δεξιά: ${a} ： ${d} ＝ ${a / d}, και έπειτα ${a / d} · ${mult} ＝ ${ans}.`,
    };
  },

  // 6. Παρένθεση με πρόσθεση πριν τον πολλαπλασιασμό (Input)
  (locale) => {
    const a = randInt(2, 5);
    const b = randInt(3, 7);
    const c = randInt(2, 6);
    const parenSum = a + b;
    const ans = parenSum * c;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PARENTHESES' : 'ΠΑΡΕΝΘΕΣΕΙΣ',
      question:
        locale === 'en'
          ? `Calculate: (${a} ＋ ${b}) · ${c}`
          : `Υπολόγισε: (${a} ＋ ${b}) · ${c}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Parentheses take absolute priority: ${a} ＋ ${b} ＝ ${parenSum}. Then: ${parenSum} · ${c} ＝ ${ans}.`
          : `Η παρένθεση έχει απόλυτη προτεραιότητα: ${a} ＋ ${b} ＝ ${parenSum}. Έπειτα: ${parenSum} · ${c} ＝ ${ans}.`,
    };
  },

  // 7. Παρένθεση με αφαίρεση και δύναμη απ' έξω (Input)
  (locale) => {
    const a = randInt(2, 5);
    const b = a + randInt(2, 4);
    const diff = a - b;
    const ans = Math.pow(diff, 2);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PARENTHESES & POWERS' : 'ΠΑΡΕΝΘΕΣΕΙΣ & ΔΥΝΑΜΕΙΣ',
      question:
        locale === 'en'
          ? `Calculate: (${a} － ${b})<sup>2</sup>`
          : `Υπολόγισε: (${a} － ${b})<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Inside parentheses: ${a} － ${b} ＝ ${diff}. Then: (${diff})<sup>2</sup> ＝ ＋${ans}.`
          : `Μέσα στην παρένθεση: ${a} － ${b} ＝ ${diff}. Στη συνέχεια: (${diff})<sup>2</sup> ＝ ＋${ans}.`,
    };
  },

  // 8. Σύνθετη με αγκύλες και παρενθέσεις (Input)
  (locale) => {
    const a = randInt(2, 4);
    const b = randInt(2, 4);
    const c = randInt(1, 3);
    const insideParen = b - c;
    const insideBracket = 10 - insideParen;
    const ans = a * insideBracket;
    return {
      type: 'input',
      topic: locale === 'en' ? 'BRACKETS & PARENTHESES' : 'ΑΓΚΥΛΕΣ & ΠΑΡΕΝΘΕΣΕΙΣ',
      question:
        locale === 'en'
          ? `Calculate: ${a} · [ 10 － (${b} － ${c}) ]`
          : `Υπολόγισε: ${a} · [ 10 － (${b} － ${c}) ]`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `1) Inner parentheses: ${b} － ${c} ＝ ${insideParen}. 2) Brackets: 10 － ${insideParen} ＝ ${insideBracket}. 3) Multiplication: ${a} · ${insideBracket} ＝ ${ans}.`
          : `1) Εσωτερική παρένθεση: ${b} － ${c} ＝ ${insideParen}. 2) Αγκύλη: 10 － ${insideParen} ＝ ${insideBracket}. 3) Πολλαπλασιασμός: ${a} · ${insideBracket} ＝ ${ans}.`,
    };
  },

  // 9. Δύναμη του 0 στην προτεραιότητα (Input)
  (locale) => {
    const a = randInt(10, 25);
    const b = randInt(3, 8);
    const ans = a + b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'POWERS' : 'ΔΥΝΑΜΕΙΣ',
      question:
        locale === 'en'
          ? `Calculate: ${a} ＋ ${b} · (－7)<sup>0</sup>`
          : `Υπολόγισε: ${a} ＋ ${b} · (－7)<sup>0</sup>`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－7)<sup>0</sup> ＝ 1. Next: ${b} · 1 ＝ ${b}. Finally: ${a} ＋ ${b} ＝ ${ans}.`
          : `(－7)<sup>0</sup> ＝ 1. Έπειτα: ${b} · 1 ＝ ${b}. Τέλος: ${a} ＋ ${b} ＝ ${ans}.`,
    };
  },

  // 10. Δύο γινόμενα που αφαιρούνται (Input)
  (locale) => {
    const a = randInt(3, 6);
    const b = randInt(4, 7);
    const c = randInt(2, 5);
    const d = randInt(2, 4);
    const prod1 = a * b;
    const prod2 = c * d;
    const ans = prod1 - prod2;
    return {
      type: 'input',
      topic: locale === 'en' ? 'MULTIPLICATIONS' : 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate: ${a} · ${b} － ${c} · ${d}`
          : `Υπολόγισε: ${a} · ${b} － ${c} · ${d}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Execute multiplications first: ${a} · ${b} ＝ ${prod1} and ${c} · ${d} ＝ ${prod2}. Finally subtract: ${prod1} － ${prod2} ＝ ${ans}.`
          : `Εκτελούμε πρώτα τους δύο πολλαπλασιασμούς: ${a} · ${b} ＝ ${prod1} και ${c} · ${d} ＝ ${prod2}. Στο τέλος αφαιρούμε: ${prod1} － ${prod2} ＝ ${ans}.`,
    };
  },

  // 11. Πρώτο βήμα στην ιεραρχία (MCQ)
  (locale) => {
    const correct = locale === 'en' ? 'Operations inside parentheses' : 'Οι πράξεις μέσα στις παρενθέσεις';
    const candidates =
      locale === 'en'
        ? ['Multiplications', 'Powers', 'Additions']
        : ['Οι πολλαπλασιασμοί', 'Οι δυνάμεις', 'Οι προσθέσεις'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'ORDER OF OPERATIONS THEORY' : 'ΘΕΩΡΙΑ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ',
      question:
        locale === 'en'
          ? 'Which operations are always evaluated first in a numerical expression?'
          : 'Ποια πράξη εκτελείται πάντοτε πρώτη σε μια αριθμητική παράσταση;',
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'Parentheses and brackets take precedence over all operations and are executed from innermost to outermost.'
          : 'Οι παρενθέσεις (και οι αγκύλες) υπερισχύουν όλων των πράξεων και εκτελούνται πάντα πρώτες, από τις εσωτερικές προς τις εξωτερικές.',
    };
  },

  // 12. Προτεραιότητα δύναμης έναντι πολλαπλασιασμού (MCQ)
  (locale) => {
    const correct =
      locale === 'en'
        ? 'Compute 3² ＝ 9 first, then 4 · 9 ＝ 36'
        : 'Υπολογίζουμε πρώτα το 3² ＝ 9 και μετά 4 · 9 ＝ 36';
    const candidates =
      locale === 'en'
        ? [
            'Multiply 4 · 3 ＝ 12 first, then 12² ＝ 144',
            'Perform multiplication and power simultaneously',
            'The result is 24',
          ]
        : [
            'Πολλαπλασιάζουμε πρώτα 4 · 3 ＝ 12 και μετά 12² ＝ 144',
            'Εκτελούμε ταυτόχρονα τις πράξεις',
            'Το αποτέλεσμα είναι 24',
          ];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'ORDER OF OPERATIONS THEORY' : 'ΘΕΩΡΙΑ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ',
      question:
        locale === 'en'
          ? 'In the expression 4 · 3<sup>2</sup>, what is the correct calculation sequence?'
          : 'Στην παράσταση 4 · 3<sup>2</sup>, ποιος είναι ο σωστός τρόπος υπολογισμού;',
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'Powers take precedence over multiplication: 3² ＝ 9, then 4 · 9 ＝ 36.'
          : 'Η δύναμη προηγείται του πολλαπλασιασμού: 3² ＝ 9 και στη συνέχεια 4 · 9 ＝ 36.',
    };
  },

  // 13. Πρόσθεση και αφαίρεση στη σειρά (Input)
  (locale) => {
    const a = randInt(15, 30);
    const b = randInt(5, 12);
    const c = randInt(4, 10);
    const diff = a - b;
    const ans = diff + c;
    return {
      type: 'input',
      topic: locale === 'en' ? 'LEFT-TO-RIGHT ORDER' : 'ΣΕΙΡΑ ΑΡΙΣΤΕΡΑ-ΔΕΞΙΑ',
      question:
        locale === 'en'
          ? `Calculate: ${a} － ${b} ＋ ${c}`
          : `Υπολόγισε: ${a} － ${b} ＋ ${c}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Addition and subtraction share equal precedence and proceed strictly from left to right: ${a} － ${b} ＝ ${diff}, and ${diff} ＋ ${c} ＝ ${ans}.`
          : `Πρόσθεση και αφαίρεση έχουν την ίδια προτεραιότητα και γίνονται από αριστερά προς τα δεξιά: ${a} － ${b} ＝ ${diff}, και ${diff} ＋ ${c} ＝ ${ans}.`,
    };
  },

  // 14. Παράσταση με αρνητικό εκτός δύναμης: -a^2 + b (Input)
  (locale) => {
    const a = randInt(3, 6);
    const b = randInt(10, 25);
    const pVal = a * a;
    const ans = -pVal + b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PARENTHESES AND SIGNS' : 'ΠΑΡΕΝΘΕΣΕΙΣ ΚΑΙ ΠΡΟΣΗΜΑ',
      question:
        locale === 'en'
          ? `Calculate: －${a}<sup>2</sup> ＋ ${b}`
          : `Υπολόγισε: －${a}<sup>2</sup> ＋ ${b}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Without parentheses: －${a}<sup>2</sup> ＝ －${pVal}. Then: －${pVal} ＋ ${b} ＝ ${ans}.`
          : `Χωρίς παρένθεση: －${a}<sup>2</sup> ＝ －${pVal}. Έπειτα: －${pVal} ＋ ${b} ＝ ${ans}.`,
    };
  },

  // 15. Παράσταση με κλάσμα/διαίρεση και παρενθέσεις (Input)
  (locale) => {
    const sum = randInt(2, 5) * 4;
    const a = randInt(3, sum - 2);
    const b = sum - a;
    const ans = sum / 4;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PARENTHESES & DIVISION' : 'ΠΑΡΕΝΘΕΣΕΙΣ & ΔΙΑΙΡΕΣΗ',
      question:
        locale === 'en'
          ? `Calculate: (${a} ＋ ${b}) : 4`
          : `Υπολόγισε: (${a} ＋ ${b}) ： 4`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Parentheses first: ${a} ＋ ${b} ＝ ${sum}. Then division: ${sum} : 4 ＝ ${ans}.`
          : `Πρώτα η παρένθεση: ${a} ＋ ${b} ＝ ${sum}. Μετά η διαίρεση: ${sum} ： 4 ＝ ${ans}.`,
    };
  },

  // 16. Τριπλή πράξη με δυνάμεις (Input)
  (locale) => {
    const ans = 8 + 9 - 4;
    return {
      type: 'input',
      topic: locale === 'en' ? 'POWERS' : 'ΔΥΝΑΜΕΙΣ',
      question:
        locale === 'en'
          ? 'Calculate: 2<sup>3</sup> ＋ 3<sup>2</sup> － 4<sup>1</sup>'
          : 'Υπολόγισε: 2<sup>3</sup> ＋ 3<sup>2</sup> － 4<sup>1</sup>',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? '2<sup>3</sup> ＝ 8, 3<sup>2</sup> ＝ 9, 4<sup>1</sup> ＝ 4. Thus: 8 ＋ 9 － 4 ＝ 13.'
          : `2<sup>3</sup> ＝ 8, 3<sup>2</sup> ＝ 9, 4<sup>1</sup> ＝ 4. Τελικά: 8 ＋ 9 － 4 ＝ ${ans}.`,
    };
  },

  // 17. Πολλαπλασιασμός με μηδέν στην παράσταση (Input)
  (locale) => {
    const a = randInt(12, 35);
    const b = randInt(4, 9);
    const c = randInt(5, 12);
    const ans = a;
    return {
      type: 'input',
      topic: locale === 'en' ? 'ZERO ELEMENT' : 'ΜΗΔΕΝΙΚΟ ΣΤΟΙΧΕΙΟ',
      question:
        locale === 'en'
          ? `Calculate: ${a} ＋ ${b} · 0 · (－${c})`
          : `Υπολόγισε: ${a} ＋ ${b} · 0 · (－${c})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `The multiplication product contains 0, so ${b} · 0 · (－${c}) ＝ 0. Therefore ${a} ＋ 0 ＝ ${ans}.`
          : `Ο πολλαπλασιασμός περιέχει το 0, άρα ${b} · 0 · (－${c}) ＝ 0. Επομένως ${a} ＋ 0 ＝ ${ans}.`,
    };
  },

  // 18. Σύνθετη με αρνητικά: (-3) * (-4) - 2 * (-5) (Input)
  (locale) => {
    const ans = 22;
    return {
      type: 'input',
      topic: locale === 'en' ? 'SIGNS & ORDER' : 'ΠΡΟΣΗΜΑ & ΠΡΟΤΕΡΑΙΟΤΗΤΑ',
      question:
        locale === 'en'
          ? 'Calculate: (－3) · (－4) － 2 · (－5)'
          : 'Υπολόγισε: (－3) · (－4) － 2 · (－5)',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? '(－3) · (－4) ＝ ＋12 and 2 · (－5) ＝ －10. Then: 12 － (－10) ＝ 12 ＋ 10 ＝ 22.'
          : '(－3) · (－4) ＝ ＋12 και 2 · (－5) ＝ －10. Άρα 12 － (－10) ＝ 12 ＋ 10 ＝ 22.',
    };
  },

  // 19. Προτεραιότητα μέσα σε αγκύλη με δύναμη (Input)
  (locale) => {
    const ans = 2;
    return {
      type: 'input',
      topic: locale === 'en' ? 'BRACKETS & POWERS' : 'ΑΓΚΥΛΕΣ & ΔΥΝΑΜΕΙΣ',
      question:
        locale === 'en'
          ? 'Evaluate inside the brackets: [ 20 － 2 · 3<sup>2</sup> ]'
          : 'Υπολόγισε την τιμή μέσα στην αγκύλη: [ 20 － 2 · 3<sup>2</sup> ]',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? '3<sup>2</sup> ＝ 9, then 2 · 9 ＝ 18. Finally: 20 － 18 ＝ 2.'
          : '3<sup>2</sup> ＝ 9, μετά 2 · 9 ＝ 18. Τελικά: 20 － 18 ＝ 2.',
    };
  },

  // 20. Επιμεριστική έναντι προτεραιότητας (MCQ)
  (locale) => {
    const correct =
      locale === 'en'
        ? 'Compute parentheses 6 ＋ 4 ＝ 10 first, then 5 · 10 ＝ 50'
        : 'Εκτελούμε πρώτα την παρένθεση 6 ＋ 4 ＝ 10 και μετά 5 · 10 ＝ 50';
    const candidates =
      locale === 'en'
        ? [
            'Multiply 5 · 6 ＝ 30 first and add 4 (result 34)',
            'Add 5 ＋ 6 ＝ 11 first and multiply by 4 (result 44)',
            'The result is 24',
          ]
        : [
            'Πολλαπλασιάζουμε μόνο το 5 · 6 ＝ 30 και προσθέτουμε 4 (αποτέλεσμα 34)',
            'Προσθέτουμε πρώτα 5 ＋ 6 ＝ 11 και μετά πολλαπλασιάζουμε με το 4 (αποτέλεσμα 44)',
            'Το αποτέλεσμα είναι 24',
          ];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'ORDER OF OPERATIONS THEORY' : 'ΘΕΩΡΙΑ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ',
      question:
        locale === 'en'
          ? 'In the expression 5 · (6 ＋ 4), which method evaluates directly to the correct answer?'
          : 'Στην παράσταση 5 · (6 ＋ 4), ποιος υπολογισμός δίνει άμεσα το σωστό αποτέλεσμα;',
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'According to standard order of operations, evaluate inside parentheses first (6 ＋ 4 ＝ 10), then multiply by 5: 5 · 10 ＝ 50.'
          : 'Σύμφωνα με την προτεραιότητα, λύνουμε πρώτα την πράξη μέσα στην παρένθεση (6 ＋ 4 ＝ 10) και έπειτα πολλαπλασιάζουμε με το 5: 5 · 10 ＝ 50.',
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΣΥΝΘΕΤΩΝ ΠΑΡΑΣΤΑΣΕΩΝ (i18n)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Αγορές στο σούπερ μάρκετ με έκπτωση
  (locale) => {
    const qtyA = randInt(2, 4);
    const priceA = randInt(3, 6);
    const qtyB = randInt(2, 5);
    const priceB = randInt(2, 4);
    const discount = randInt(2, 5);
    const partA = qtyA * priceA;
    const partB = qtyB * priceB;
    const ans = partA + partB - discount;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `Elena bought ${qtyA} cartons of milk at ${priceA} € each and ${qtyB} packs of biscuits at ${priceB} € each. At checkout she redeemed a discount coupon of ${discount} €. How much did she pay in total?`
          : `Η Ελένη αγόρασε ${qtyA} κουτιά γάλα προς ${priceA} € το καθένα και ${qtyB} πακέτα μπισκότα προς ${priceB} € το καθένα. Στο ταμείο χρησιμοποίησε εκπτωτικό κουπόνι αξίας ${discount} €. Πόσα ευρώ πλήρωσε συνολικά;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Numerical expression: ${qtyA} · ${priceA} ＋ ${qtyB} · ${priceB} － ${discount} ＝ ${partA} ＋ ${partB} － ${discount} ＝ ${ans} €.`
          : `Σχηματίζουμε την αριθμητική παράσταση: ${qtyA} · ${priceA} ＋ ${qtyB} · ${priceB} － ${discount} ＝ ${partA} ＋ ${partB} － ${discount} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 2: Εισιτήρια κινηματογράφου για ενήλικες και παιδιά
  (locale) => {
    const adults = randInt(2, 3);
    const adultPrice = 8;
    const kids = randInt(2, 4);
    const kidPrice = 5;
    const comboPopcorn = randInt(6, 10);
    const partAdults = adults * adultPrice;
    const partKids = kids * kidPrice;
    const ans = partAdults + partKids + comboPopcorn;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `A group bought ${adults} adult cinema tickets at 8 € each, ${kids} children tickets at 5 € each and a family popcorn combo for ${comboPopcorn} €. What was the total cost of their outing in €?`
          : `Μια παρέα αγόρασε ${adults} εισιτήρια ενηλίκων προς 8 € το καθένα, ${kids} παιδικά εισιτήρια προς 5 € το καθένα και ένα οικογενειακό πακέτο ποπ κορν αξίας ${comboPopcorn} €. Ποιο ήταν το συνολικό κόστος της εξόδου σε €;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: ${adults} · 8 ＋ ${kids} · 5 ＋ ${comboPopcorn} ＝ ${partAdults} ＋ ${partKids} ＋ ${comboPopcorn} ＝ ${ans} €.`
          : `Παράσταση: ${adults} · 8 ＋ ${kids} · 5 ＋ ${comboPopcorn} ＝ ${partAdults} ＋ ${partKids} ＋ ${comboPopcorn} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 3: Βαθμολογία διαγωνισμού με σωστές και λάθος απαντήσεις
  (locale) => {
    const correctAnswers = randInt(12, 18);
    const pointsPerCorrect = 4;
    const wrongAnswers = randInt(2, 5);
    const penaltyPerWrong = 2;
    const partCorrect = correctAnswers * pointsPerCorrect;
    const partWrong = wrongAnswers * penaltyPerWrong;
    const ans = partCorrect - partWrong;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: SCORE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question:
        locale === 'en'
          ? `In a competition each correct answer gives 4 points, while each wrong answer deducts 2 points. A student had ${correctAnswers} correct answers and ${wrongAnswers} wrong answers. What was his final score?`
          : `Σε έναν μαθηματικό διαγωνισμό κάθε σωστή απάντηση δίνει 4 βαθμούς, ενώ κάθε λάθος απάντηση αφαιρεί 2 βαθμούς. Ένας μαθητής είχε ${correctAnswers} σωστές απαντήσεις και ${wrongAnswers} λάθη. Ποια ήταν η τελική του βαθμολογία;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: ${correctAnswers} · 4 － ${wrongAnswers} · 2 ＝ ${partCorrect} － ${partWrong} ＝ ${ans} points.`
          : `Αριθμητική παράσταση: ${correctAnswers} · 4 － ${wrongAnswers} · 2 ＝ ${partCorrect} － ${partWrong} ＝ ${ans} βαθμοί.`,
    };
  },

  // Πρόβλημα 4: Ρέστα από χαρτονόμισμα
  (locale) => {
    const bill = 50;
    const notebooks = randInt(3, 5);
    const notebookPrice = randInt(2, 4);
    const pens = randInt(2, 4);
    const penPrice = 2;
    const partN = notebooks * notebookPrice;
    const partP = pens * penPrice;
    const spent = partN + partP;
    const ans = bill - spent;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `Nikos paid with a 50 € banknote to buy ${notebooks} notebooks at ${notebookPrice} € each and ${pens} pens at 2 € each. How much change in € did he receive?`
          : `Ο Νίκος πλήρωσε με χαρτονόμισμα των 50 € για να αγοράσει ${notebooks} τετράδια προς ${notebookPrice} € το καθένα και ${pens} στυλό προς 2 € το καθένα. Πόσα ευρώ πήρε ρέστα;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression with parentheses: 50 － (${notebooks} · ${notebookPrice} ＋ ${pens} · 2) ＝ 50 － (${partN} ＋ ${partP}) ＝ 50 － ${spent} ＝ ${ans} €.`
          : `Παράσταση με παρένθεση: 50 － (${notebooks} · ${notebookPrice} ＋ ${pens} · 2) ＝ 50 － (${partN} ＋ ${partP}) ＝ 50 － ${spent} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 5: Διανομή κιβωτίων με χυμούς
  (locale) => {
    const boxes = randInt(4, 7);
    const packsPerBox = 6;
    const bottlesPerPack = 4;
    const broken = randInt(3, 8);
    const totalBottles = boxes * packsPerBox * bottlesPerPack;
    const ans = totalBottles - broken;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: WAREHOUSE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΘΗΚΗ',
      question:
        locale === 'en'
          ? `A grocery store received ${boxes} boxes of juice. Each box contains 6 packs, and each pack has 4 bottles. During shipping ${broken} bottles broke. How many intact bottles remained for sale?`
          : `Ένα παντοπωλείο παρέλαβε ${boxes} κιβώτια με χυμούς. Κάθε κιβώτιο περιέχει 6 συσκευασίες και κάθε συσκευασία 4 μπουκάλια. Κατά τη μεταφορά έσπασαν ${broken} μπουκάλια. Πόσα ακέραια μπουκάλια έμειναν για πώληση;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: ${boxes} · 6 · 4 － ${broken} ＝ ${totalBottles} － ${broken} ＝ ${ans} bottles.`
          : `Παράσταση: ${boxes} · 6 · 4 － ${broken} ＝ ${totalBottles} － ${broken} ＝ ${ans} μπουκάλια.`,
    };
  },

  // Πρόβλημα 6: Ομαδικό ταμείο και μοίρασμα εξόδων
  (locale) => {
    const friends = 4;
    const pizzas = 3;
    const pizzaPrice = 9;
    const drinks = 4;
    const drinkPrice = 2;
    const partPizzas = pizzas * pizzaPrice;
    const partDrinks = drinks * drinkPrice;
    const total = partPizzas + partDrinks;
    const ans = total / friends;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: COST SHARING' : 'ΠΡΟΒΛΗΜΑΤΑ: ΕΠΙΜΕΡΙΣΜΟΣ',
      question:
        locale === 'en'
          ? `Four friends ordered ${pizzas} pizzas at 9 € each and ${drinks} soft drinks at 2 € each. If they shared the total cost equally, how much did each person pay in €?`
          : `Τέσσερις φίλοι παρήγγειλαν ${pizzas} πίτσες προς 9 € τη μία και ${drinks} αναψυκτικά προς 2 € το ένα. Αν μοιράστηκαν το συνολικό ποσό εξίσου, πόσα ευρώ πλήρωσε ο καθένας;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: (${pizzas} · 9 ＋ ${drinks} · 2) : 4 ＝ (${partPizzas} ＋ ${partDrinks}) : 4 ＝ ${total} : 4 ＝ ${ans} €.`
          : `Παράσταση με παρένθεση και διαίρεση: (${pizzas} · 9 ＋ ${drinks} · 2) ： 4 ＝ (${partPizzas} ＋ ${partDrinks}) ： 4 ＝ ${total} ： 4 ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 7: Εισφορές και έξοδα σχολικής εκδρομής
  (locale) => {
    const students = randInt(18, 24);
    const feePerStudent = 10;
    const busCost = 140;
    const ticketsCost = randInt(25, 40);
    const collected = students * feePerStudent;
    const ans = collected - busCost - ticketsCost;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: SCHOOL TRIP' : 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΟΛΕΙΟ',
      question:
        locale === 'en'
          ? `For a school trip ${students} students contributed 10 € each. From that pool 140 € was spent on the bus and ${ticketsCost} € on a tour guide. How much money in € remained in the class fund?`
          : `Για μια σχολική εκδρομή ${students} μαθητές πλήρωσαν από 10 € ο καθένας. Από το συνολικό ποσό πληρώθηκαν 140 € για το λεωφορείο και ${ticketsCost} € για ξεναγό. Πόσα ευρώ περίσσεψαν στο ταμείο της τάξης;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: ${students} · 10 － 140 － ${ticketsCost} ＝ ${collected} － 140 － ${ticketsCost} ＝ ${ans} €.`
          : `Παράσταση: ${students} · 10 － 140 － ${ticketsCost} ＝ ${collected} － 140 － ${ticketsCost} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 8: Αμοιβή εργασίας με υπερωρίες
  (locale) => {
    const baseHours = 40;
    const baseRate = 10;
    const overtimeHours = randInt(5, 12);
    const overtimeRate = 15;
    const tax = randInt(30, 60);
    const overtimePay = overtimeHours * overtimeRate;
    const ans = baseHours * baseRate + overtimePay - tax;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: WAGES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ',
      question:
        locale === 'en'
          ? `A technician worked 40 regular hours at 10 €/hour and ${overtimeHours} overtime hours at 15 €/hour. Deductions totaled ${tax} €. What was his net earnings in €?`
          : `Ένας τεχνικός εργάστηκε 40 ώρες κανονικού ωραρίου προς 10 € την ώρα και ${overtimeHours} ώρες υπερωρίας προς 15 € την ώρα. Από τις αποδοχές του κρατήθηκαν ${tax} € για εισφορές. Ποιο ήταν το καθαρό ποσό που έλαβε σε €;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: 40 · 10 ＋ ${overtimeHours} · 15 － ${tax} ＝ 400 ＋ ${overtimePay} － ${tax} ＝ ${ans} €.`
          : `Παράσταση: 40 · 10 ＋ ${overtimeHours} · 15 － ${tax} ＝ 400 ＋ ${overtimePay} － ${tax} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 9: Φύτευση δέντρων σε σειρές με απώλειες
  (locale) => {
    const rows = randInt(5, 8);
    const treesPerRow = randInt(12, 16);
    const extraTrees = randInt(10, 20);
    const dryTrees = randInt(4, 9);
    const plantedInRows = rows * treesPerRow;
    const ans = plantedInRows + extraTrees - dryTrees;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: ENVIRONMENT' : 'ΠΡΟΒΛΗΜΑΤΑ: ΠΕΡΙΒΑΛΛΟΝ',
      question:
        locale === 'en'
          ? `In a reforestation project volunteers planted ${rows} rows with ${treesPerRow} pine trees each, plus ${extraTrees} cypresses. If ${dryTrees} trees dried up, how many trees survived in total?`
          : `Σε μια δενδροφύτευση φυτεύτηκαν ${rows} σειρές με ${treesPerRow} πεύκα σε κάθε σειρά, καθώς και ${extraTrees} κυπαρίσσια στην είσοδο. Αν από το σύνολο ξεράθηκαν ${dryTrees} δέντρα, πόσα δέντρα επιβίωσαν τελικά;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: ${rows} · ${treesPerRow} ＋ ${extraTrees} － ${dryTrees} ＝ ${plantedInRows} ＋ ${extraTrees} － ${dryTrees} ＝ ${ans} trees.`
          : `Παράσταση: ${rows} · ${treesPerRow} ＋ ${extraTrees} － ${dryTrees} ＝ ${plantedInRows} ＋ ${extraTrees} － ${dryTrees} ＝ ${ans} δέντρα.`,
    };
  },

  // Πρόβλημα 10: Αγορά εξοπλισμού γυμναστηρίου με δόσεις
  (locale) => {
    const initialPayment = 120;
    const months = 6;
    const installment = randInt(25, 45);
    const discount = 20;
    const totalInstallments = months * installment;
    const ans = initialPayment + totalInstallments - discount;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `To purchase fitness equipment a down payment of 120 € was paid, followed by 6 monthly installments of ${installment} €. A special promotional discount of 20 € was subtracted from the final bill. What was the net cost in €?`
          : `Για την αγορά ενός διαδρόμου γυμναστικής δόθηκε προκαταβολή 120 € και συμφωνήθηκαν 6 μηνιαίες δόσεις των ${installment} €. Λόγω ειδικής προσφοράς έγινε έκπτωση 20 € στο συνολικό ποσό. Πόσο κόστισε τελικά ο διάδρομος σε €;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: 120 ＋ 6 · ${installment} － 20 ＝ 120 ＋ ${totalInstallments} － 20 ＝ ${ans} €.`
          : `Παράσταση: 120 ＋ 6 · ${installment} － 20 ＝ 120 ＋ ${totalInstallments} － 20 ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 11: Συσκευασία δώρων με κορδέλες
  (locale) => {
    const bigBoxes = randInt(3, 5);
    const ribbonPerBig = 4;
    const smallBoxes = randInt(4, 7);
    const ribbonPerSmall = 2;
    const initialRibbon = 50;
    const partBig = bigBoxes * ribbonPerBig;
    const partSmall = smallBoxes * ribbonPerSmall;
    const used = partBig + partSmall;
    const ans = initialRibbon - used;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: MEASUREMENTS' : 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ',
      question:
        locale === 'en'
          ? `A store started with a 50 m roll of ribbon. It wrapped ${bigBoxes} large boxes (4 m each) and ${smallBoxes} small boxes (2 m each). How many meters of ribbon remained on the roll?`
          : `Ένα κατάστημα είχε μια κουλούρα κορδέλας μήκους 50 m. Χρησιμοποίησε κορδέλα για να τυλίξει ${bigBoxes} μεγάλα κουτιά (4 m το καθένα) και ${smallBoxes} μικρά κουτιά (2 m το καθένα). Πόσα μέτρα κορδέλας έμειναν στην κουλούρα;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: 50 － (${bigBoxes} · 4 ＋ ${smallBoxes} · 2) ＝ 50 － (${partBig} ＋ ${partSmall}) ＝ 50 － ${used} ＝ ${ans} m.`
          : `Παράσταση με παρένθεση: 50 － (${bigBoxes} · 4 ＋ ${smallBoxes} · 2) ＝ 50 － (${partBig} ＋ ${partSmall}) ＝ 50 － ${used} ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 12: Αγορά βιβλίων για σχολική βιβλιοθήκη
  (locale) => {
    const novels = randInt(4, 7);
    const novelPrice = 12;
    const scienceBooks = randInt(3, 5);
    const sciencePrice = 15;
    const grant = 150;
    const partNovels = novels * novelPrice;
    const partScience = scienceBooks * sciencePrice;
    const spent = partNovels + partScience;
    const ans = grant - spent;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: LIBRARY' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΙΒΛΙΟΘΗΚΗ',
      question:
        locale === 'en'
          ? `A parents' association allocated 150 € for the school library. They bought ${novels} literature books at 12 € each and ${scienceBooks} science books at 15 € each. How much money in € remained from the grant?`
          : `Ο σύλλογος γονέων διέθεσε 150 € για τη σχολική βιβλιοθήκη. Αγοράστηκαν ${novels} λογοτεχνικά βιβλία προς 12 € το ένα και ${scienceBooks} επιστημονικά βιβλία προς 15 € το ένα. Πόσα ευρώ περίσσεψαν από τη δωρεά;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: 150 － (${novels} · 12 ＋ ${scienceBooks} · 15) ＝ 150 － (${partNovels} ＋ ${partScience}) ＝ 150 － ${spent} ＝ ${ans} €.`
          : `Παράσταση: 150 － (${novels} · 12 ＋ ${scienceBooks} · 15) ＝ 150 － (${partNovels} ＋ ${partScience}) ＝ 150 － ${spent} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 13: Παραγωγή αρτοποιείου σε λαμαρίνες
  (locale) => {
    const trays = randInt(4, 6);
    const itemsPerTray = 24;
    const morningSales = randInt(45, 65);
    const afternoonSales = randInt(25, 35);
    const totalBaked = trays * itemsPerTray;
    const ans = totalBaked - morningSales - afternoonSales;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: BAKERY' : 'ΠΡΟΒΛΗΜΑΤΑ: ΠΑΡΑΓΩΓΗ',
      question:
        locale === 'en'
          ? `A bakery baked ${trays} trays of cheese pies in the morning, with 24 pies per tray. In the morning ${morningSales} pies were sold, and in the afternoon ${afternoonSales} more. How many pies remained at the end of the day?`
          : `Ένας φούρνος έψησε το πρωί ${trays} λαμαρίνες με τυρόπιτες, όπου κάθε λαμαρίνα περιείχε 24 τυρόπιτες. Το πρωί πουλήθηκαν ${morningSales} τυρόπιτες και το απόγευμα άλλες ${afternoonSales}. Πόσες τυρόπιτες περίσσεψαν στο τέλος της ημέρας;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: ${trays} · 24 － ${morningSales} － ${afternoonSales} ＝ ${totalBaked} － ${morningSales} － ${afternoonSales} ＝ ${ans} pies.`
          : `Παράσταση: ${trays} · 24 － ${morningSales} － ${afternoonSales} ＝ ${totalBaked} － ${morningSales} － ${afternoonSales} ＝ ${ans} τυρόπιτες.`,
    };
  },

  // Πρόβλημα 14: Έξοδα εκτύπωσης σχολικής εφημερίδας
  (locale) => {
    const copies = randInt(150, 250);
    const costPerCopy = 2;
    const designFee = 80;
    const adIncome = randInt(120, 200);
    const printCost = copies * costPerCopy;
    const ans = printCost + designFee - adIncome;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: PUBLISHING' : 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΔΟΣΕΙΣ',
      question:
        locale === 'en'
          ? `A student newspaper printed ${copies} copies at 2 € per copy, with an 80 € layout fee. Sponsorships covered ${adIncome} €. What was the net cost in € covered by the school club?`
          : `Η συντακτική ομάδα ενός σχολείου τύπωσε ${copies} τεύχη σχολικής εφημερίδας με κόστος εκτύπωσης 2 € ανά τεύχος και έξοδα σελιδοποίησης 80 €. Από χορηγίες συγκεντρώθηκαν ${adIncome} €. Ποιο ήταν το τελικό κόστος που έπρεπε να καλυφθεί από το ταμείο;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: ${copies} · 2 ＋ 80 － ${adIncome} ＝ ${printCost} ＋ 80 － ${adIncome} ＝ ${ans} €.`
          : `Παράσταση: ${copies} · 2 ＋ 80 － ${adIncome} ＝ ${printCost} ＋ 80 － ${adIncome} ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 15: Συγκομιδή ελιών σε σακιά
  (locale) => {
    const trees = randInt(8, 14);
    const kgPerTree = 25;
    const bonusFromGround = randInt(30, 60);
    const sackCapacity = 50;
    const harvestTrees = trees * kgPerTree;
    const totalKg = harvestTrees + bonusFromGround;
    const sacks = Math.floor(totalKg / sackCapacity);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: AGRICULTURE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΡΟΤΙΚΑ',
      question:
        locale === 'en'
          ? `A grower harvested 25 kg of olives per tree from ${trees} trees, plus ${bonusFromGround} kg from the ground. If each sack holds 50 kg, how many completely filled 50-kg sacks did he pack?`
          : `Ένας παραγωγός μάζεψε από ${trees} ελαιόδεντρα 25 kg ελιές από το καθένα και επιπλέον ${bonusFromGround} kg που είχαν πέσει στο έδαφος. Αν γεμίζει σακιά χωρητικότητας 50 kg το καθένα, πόσα πλήρη σακιά των 50 kg γέμισε συνολικά;`,
      correctAnswer: sacks.toString(),
      solution:
        locale === 'en'
          ? `Total kg: ${trees} · 25 ＋ ${bonusFromGround} ＝ ${harvestTrees} ＋ ${bonusFromGround} ＝ ${totalKg} kg. Full sacks: ${totalKg} : 50 ＝ ${sacks} sacks (with ${totalKg % sackCapacity} kg remaining).`
          : `Συνολικά κιλά: ${trees} · 25 ＋ ${bonusFromGround} ＝ ${harvestTrees} ＋ ${bonusFromGround} ＝ ${totalKg} kg. Πλήρη σακιά: ${totalKg} ： 50 ＝ ${sacks} σακιά (με υπόλοιπο ${totalKg % sackCapacity} kg).`,
    };
  },

  // Πρόβλημα 16: Βαθμολογία σε τηλεοπτικό κουίζ 3 γύρων
  (locale) => {
    const round1 = randInt(3, 6) * 10;
    const round2Correct = randInt(4, 7);
    const pointsR2 = 15;
    const penaltyR3 = randInt(2, 4) * 20;
    const round2Points = round2Correct * pointsR2;
    const ans = round1 + round2Points - penaltyR3;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: SCORE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question:
        locale === 'en'
          ? `In round 1 of a quiz show a contestant scored ${round1} points. In round 2 she answered ${round2Correct} questions correctly at 15 points each. In round 3 she incurred a penalty of ${penaltyR3} points. What was her final score?`
          : `Στον 1ο γύρο ενός κουίζ ένας παίκτης συγκέντρωσε ${round1} βαθμούς. Στον 2ο γύρο απάντησε σωστά σε ${round2Correct} ερωτήσεις των 15 βαθμών η καθεμία. Στον 3ο γύρο υπέπεσε σε ποινή ${penaltyR3} βαθμών. Ποιο ήταν το τελικό σκορ του;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: ${round1} ＋ ${round2Correct} · 15 － ${penaltyR3} ＝ ${round1} ＋ ${round2Points} － ${penaltyR3} ＝ ${ans} points.`
          : `Παράσταση: ${round1} ＋ ${round2Correct} · 15 － ${penaltyR3} ＝ ${round1} ＋ ${round2Points} － ${penaltyR3} ＝ ${ans} βαθμοί.`,
    };
  },

  // Πρόβλημα 17: Κατανάλωση καυσίμου σε ταξίδι
  (locale) => {
    const fullTank = 60;
    const hoursHighway = randInt(3, 5);
    const litersPerHour = 6;
    const cityDrivingLiters = randInt(8, 14);
    const highwayConsumed = hoursHighway * litersPerHour;
    const consumed = highwayConsumed + cityDrivingLiters;
    const ans = fullTank - consumed;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FUEL CONSUMPTION' : 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ',
      question:
        locale === 'en'
          ? `A car set off with a full tank of 60 l. It drove on the highway for ${hoursHighway} hours burning 6 l/h, then burned an additional ${cityDrivingLiters} l in city traffic. How many liters of fuel remained in the tank?`
          : `Ένα αυτοκίνητο ξεκίνησε με γεμάτο ρεζερβουάρ 60 l. Ταξίδεψε στην εθνική οδό για ${hoursHighway} ώρες καταναλώνοντας 6 l ανά ώρα και κατόπιν κατανάλωσε άλλα ${cityDrivingLiters} l μέσα στην πόλη. Πόσα λίτρα καυσίμου έμειναν στο ρεζερβουάρ;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: 60 － (${hoursHighway} · 6 ＋ ${cityDrivingLiters}) ＝ 60 － (${highwayConsumed} ＋ ${cityDrivingLiters}) ＝ 60 － ${consumed} ＝ ${ans} l.`
          : `Παράσταση: 60 － (${hoursHighway} · 6 ＋ ${cityDrivingLiters}) ＝ 60 － (${highwayConsumed} ＋ ${cityDrivingLiters}) ＝ 60 － ${consumed} ＝ ${ans} l.`,
    };
  },

  // Πρόβλημα 18: Αγορά αθλητικών ειδών με ειδική έκπτωση ανά τεμάχιο
  (locale) => {
    const shirts = randInt(4, 7);
    const shirtPrice = 18;
    const discountPerShirt = 3;
    const socks = 2;
    const socksPrice = 5;
    const netShirtPrice = shirtPrice - discountPerShirt;
    const totalShirts = shirts * netShirtPrice;
    const totalSocks = socks * socksPrice;
    const ans = totalShirts + totalSocks;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `A sports club purchased ${shirts} jerseys originally priced at 18 € each with a 3 € discount per jersey, and 2 pairs of socks at 5 € each. What was the total amount paid in €?`
          : `Μια ομάδα αγόρασε ${shirts} φανέλες αρχικής αξίας 18 € με έκπτωση 3 € σε κάθε φανέλα, καθώς και 2 ζευγάρια κάλτσες προς 5 € το καθένα. Ποιο ήταν το συνολικό ποσό πληρωμής σε €;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: ${shirts} · (18 － 3) ＋ 2 · 5 ＝ ${shirts} · 15 ＋ 10 ＝ ${totalShirts} ＋ ${totalSocks} ＝ ${ans} €.`
          : `Παράσταση: ${shirts} · (18 － 3) ＋ 2 · 5 ＝ ${shirts} · 15 ＋ 10 ＝ ${totalShirts} ＋ 10 ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 19: Κόστος εκτύπωσης φωτογραφιών
  (locale) => {
    const sets = randInt(3, 5);
    const photosPerSet = 10;
    const pricePerPhoto = 2;
    const albumPrice = 15;
    const discount = 5;
    const totalPhotoCost = sets * photosPerSet * pricePerPhoto;
    const ans = totalPhotoCost + albumPrice - discount;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: PRINTING' : 'ΠΡΟΒΛΗΜΑΤΑ: ΦΩΤΟΓΡΑΦΙΕΣ',
      question:
        locale === 'en'
          ? `A customer printed ${sets} sets of photos with 10 photos per set at 2 € each. He also bought an album for 15 € and received a 5 € store discount. How much did he pay in total in €?`
          : `Ένας πελάτης τύπωσε ${sets} πακέτα φωτογραφιών με 10 φωτογραφίες το καθένα προς 2 € τη φωτογραφία. Αγόρασε επίσης ένα άλμπουμ αξίας 15 € και του έγινε συνολική έκπτωση 5 €. Πόσα ευρώ πλήρωσε συνολικά;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: ${sets} · 10 · 2 ＋ 15 － 5 ＝ ${totalPhotoCost} ＋ 15 － 5 ＝ ${ans} €.`
          : `Παράσταση: ${sets} · 10 · 2 ＋ 15 － 5 ＝ ${totalPhotoCost} ＋ 15 － 5 ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 20: Ομαδικό πακέτο πεζοπορίας
  (locale) => {
    const participants = randInt(6, 10);
    const ticket = 25;
    const equipmentRent = 5;
    const groupDiscount = 30;
    const perPerson = ticket + equipmentRent;
    const totalGross = participants * perPerson;
    const ans = totalGross - groupDiscount;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: EXCURSIONS' : 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΔΡΟΜΕΣ',
      question:
        locale === 'en'
          ? `A hiking group of ${participants} people booked a guided trek. The ticket was 25 € per person and equipment rental 5 € per person. A group discount of 30 € was deducted from the overall sum. What was the net cost paid by the group in €?`
          : `Μια ορειβατική ομάδα ${participants} ατόμων συμμετείχε σε οργανωμένη ανάβαση. Το εισιτήριο ήταν 25 € ανά άτομο και η ενοικίαση εξοπλισμού 5 € ανά άτομο. Λόγω ομαδικής κράτησης αφαιρέθηκαν 30 € από το συνολικό κόστος. Πόσα ευρώ πλήρωσε συνολικά η ομάδα;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Expression: ${participants} · (25 ＋ 5) － 30 ＝ ${participants} · 30 － 30 ＝ ${totalGross} － 30 ＝ ${ans} €.`
          : `Παράσταση: ${participants} · (25 ＋ 5) － 30 ＝ ${participants} · 30 － 30 ＝ ${totalGross} － 30 ＝ ${ans} €.`,
    };
  },
];

const UI_TEXT = {
  el: {
    metaTitle: "Ασκήσεις: Προτεραιότητα Πράξεων | Α' Γυμνασίου",
    metaDescription: "Εξάσκηση σε 12 δυναμικές αριθμητικές παραστάσεις και σύνθετα προβλήματα προτεραιότητας πράξεων για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Προτεραιότητα των Πράξεων",
    heroDesc: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 αριθμητικές παραστάσεις και θεωρία + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    problemBadge: "ΠΡΟΒΛΗΜΑ",
    placeholder: "Απάντηση...",
    correctBadge: "ΣΩΣΤΟ",
    wrongBadge: "ΛΑΘΟΣ",
    correctAnswerLabel: "ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:",
    checkAnswersBtn: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
    newExercisesBtn: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    finalScoreLabel: "ΤΕΛΙΚΟ ΣΚΟΡ",
    progressLabel: "ΠΡΟΟΔΟΣ",
    successRateLabel: "ΕΠΙΤΥΧΙΑ",
    retryBtn: "ΕΠΑΝΑΛΗΨΗ",
    checkBtnShort: "ΕΛΕΓΧΟΣ",
  },
  en: {
    metaTitle: "Exercises: Order of Operations | 7th Grade Mathematics",
    metaDescription: "Practice with 12 dynamic numerical expressions and word scenarios on order of operations.",
    backText: "7th Grade",
    theoryBtn: "THEORY",
    badge: "GRADE 7 • PRACTICE",
    title: "Order of Operations",
    heroDesc: "Solve the following 12 selected exercises (10 numerical expressions and theory + 2 realistic word problems). Then click 'CHECK ANSWERS' to view your score and step-by-step solutions.",
    problemBadge: "WORD PROBLEM",
    placeholder: "Answer...",
    correctBadge: "CORRECT",
    wrongBadge: "INCORRECT",
    correctAnswerLabel: "CORRECT ANSWER:",
    checkAnswersBtn: "CHECK ANSWERS",
    newExercisesBtn: "NEW EXERCISES",
    finalScoreLabel: "FINAL SCORE",
    progressLabel: "PROGRESS",
    successRateLabel: "SUCCESS RATE",
    retryBtn: "RETRY",
    checkBtnShort: "CHECK",
  },
};

export default function ProteraiotitaPrakseonAsk() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = UI_TEXT[locale];

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή: 10 ασκήσεις πράξεων/θεωρίας + 2 ρεαλιστικά προβλήματα = 12 συνολικά
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
    let clean = val.replace('.', ',');
    clean = clean.replace(/[^0-9,-]/g, '');

    if (clean.includes('-')) {
      const parts = clean.split('-');
      clean = '-' + parts.join('').replace(/-/g, '');
    }

    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) return;
    if (clean.length > 10) return;

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
      let userAns = (userAnswers[q.id] || '').trim().replace(/\s+/g, '');
      let correctAns = q.correctAnswer.trim().replace(/\s+/g, '');

      userAns = userAns.replace(/[\u2212\uFF0D]/g, '-').replace(/[\uFF0B]/g, '+');
      correctAns = correctAns.replace(/[\u2212\uFF0D]/g, '-').replace(/[\uFF0B]/g, '+');

      userAns = userAns.replace(/^\+/, '');
      correctAns = correctAns.replace(/^\+/, '');

      if (userAns === correctAns) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && String(userAnswers[k]).trim() !== ''
  ).length;

  const scorePercentage = Math.round((score / 12) * 100);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/10-proteraiotita-prakseon"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 touch-manipulation"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-40 overflow-x-hidden box-border space-y-6 sm:space-y-8">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-8 lg:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs md:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.heroDesc}
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              let cleanUser = userAns.trim().replace(/\s+/g, '').replace(/[\u2212\uFF0D]/g, '-').replace(/[\uFF0B]/g, '+').replace(/^\+/, '');
              let cleanCorrect = q.correctAnswer.trim().replace(/\s+/g, '').replace(/[\u2212\uFF0D]/g, '-').replace(/[\uFF0B]/g, '+').replace(/^\+/, '');
              const isCorrect = isSubmitted && cleanUser === cleanCorrect;
              const isWordProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-4 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 min-w-0 max-w-full overflow-hidden ${
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
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs sm:text-sm shrink-0 ${
                            isWordProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {q.id}
                        </span>
                        {isWordProblem && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded shrink-0">
                            {toCleanUppercase(t.problemBadge)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md shrink-0">
                        {toCleanUppercase(q.topic)}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-sm sm:text-base md:text-lg leading-snug break-words [overflow-wrap:anywhere]"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ */}
                  <div className="space-y-2 pt-2 min-w-0">
                    {q.type === 'input' ? (
                      <div className="relative w-full max-w-xs">
                        <input
                          type="text"
                          inputMode="text"
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder={t.placeholder}
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-sm sm:text-base font-bold rounded-xl border transition-all outline-none box-border ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                                : 'bg-rose-50 border-rose-500 text-rose-950'
                              : 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAns === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleMCQSelect(q.id, opt)}
                              className={`min-h-[44px] py-2 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between gap-2 transition-all touch-manipulation active:scale-[0.98] break-words whitespace-normal leading-snug flex-1 ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span
                                className="break-words [overflow-wrap:anywhere] flex-1"
                                dangerouslySetInnerHTML={{ __html: opt }}
                              />
                              {isSelected && <span className="shrink-0 text-amber-300 font-black">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση */}
                    {isSubmitted && (
                      <div
                        className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm space-y-2.5 mt-3 border min-w-0 overflow-hidden ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-xs sm:text-sm md:text-base">
                            <span>✅</span>
                            <span>{toCleanUppercase(t.correctBadge)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5 min-w-0">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-xs sm:text-sm md:text-base">
                              <span>❌</span>
                              <span>{toCleanUppercase(t.wrongBadge)}</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-block max-w-full break-words [overflow-wrap:anywhere]">
                              {toCleanUppercase(t.correctAnswerLabel)}{' '}
                              <span
                                className="text-emerald-700 font-black ml-1 break-words [overflow-wrap:anywhere]"
                                dangerouslySetInnerHTML={{ __html: q.correctAnswer }}
                              />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-relaxed font-normal pt-1.5 border-t border-slate-200/60 break-words [overflow-wrap:anywhere]"
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
                className="w-full sm:w-auto min-w-[260px] h-12 sm:h-13 px-6 sm:px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm md:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkAnswersBtn)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-12 sm:h-13 px-6 sm:px-8 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs sm:text-sm md:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newExercisesBtn)}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR (12 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-3 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div>
              <div className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">
                {toCleanUppercase(isSubmitted ? t.finalScoreLabel : t.progressLabel)}
              </div>
              <div className="text-sm sm:text-lg md:text-xl font-black text-amber-400 font-mono whitespace-nowrap">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-3 sm:pl-6 hidden xs:block">
                <div className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">
                  {toCleanUppercase(t.successRateLabel)}
                </div>
                <div
                  className={`text-sm sm:text-lg md:text-xl font-black font-mono ${
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

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={generateQuestions}
              className="px-2.5 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5 touch-manipulation"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">{toCleanUppercase(t.newExercisesBtn)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-3.5 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5 touch-manipulation"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkBtnShort)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-3.5 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition touch-manipulation"
              >
                {toCleanUppercase(t.retryBtn)}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
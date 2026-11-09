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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΠΡΑΞΕΩΝ ΚΑΙ ΘΕΩΡΙΑΣ ΔΥΝΑΜΕΩΝ (i18n)
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Αρνητική βάση με άρτιο εκθέτη (Input)
  (locale) => {
    const base = randInt(2, 5);
    const exp = 2;
    const ans = Math.pow(base, exp);
    return {
      type: 'input',
      topic: locale === 'en' ? 'EVEN EXPONENT' : 'ΑΡΤΙΟΣ ΕΚΘΕΤΗΣ',
      question:
        locale === 'en'
          ? `Calculate the value of the power: (－${base})<sup>${exp}</sup>`
          : `Υπολόγισε την τιμή της δύναμης: (－${base})<sup>${exp}</sup>`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `A negative base raised to an even exponent yields a positive result: (－${base}) · (－${base}) ＝ ＋${ans}.`
          : `Αρνητική βάση με άρτιο εκθέτη δίνει θετικό αποτέλεσμα: (－${base}) · (－${base}) ＝ ＋${ans}.`,
    };
  },

  // 2. Αρνητική βάση με περιττό εκθέτη (Input)
  (locale) => {
    const base = randInt(2, 4);
    const exp = 3;
    const ans = -Math.pow(base, exp);
    return {
      type: 'input',
      topic: locale === 'en' ? 'ODD EXPONENT' : 'ΠΕΡΙΤΤΟΣ ΕΚΘΕΤΗΣ',
      question:
        locale === 'en'
          ? `Calculate the value of the power: (－${base})<sup>${exp}</sup>`
          : `Υπολόγισε την τιμή της δύναμης: (－${base})<sup>${exp}</sup>`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `A negative base raised to an odd exponent yields a negative result: (－${base}) · (－${base}) · (－${base}) ＝ ${ans}.`
          : `Αρνητική βάση με περιττό εκθέτη δίνει αρνητικό αποτέλεσμα: (－${base}) · (－${base}) · (－${base}) ＝ ${ans}.`,
    };
  },

  // 3. Δύναμη χωρίς παρένθεση (Input)
  (locale) => {
    const base = randInt(3, 7);
    const ans = -(base * base);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PARENTHESES AND SIGNS' : 'ΠΑΡΕΝΘΕΣΕΙΣ ΚΑΙ ΠΡΟΣΗΜΑ',
      question:
        locale === 'en'
          ? `Calculate the value: －${base}<sup>2</sup>`
          : `Υπολόγισε την τιμή: －${base}<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Without parentheses, the exponent affects only the base ${base}, while the minus sign remains outside: －(${base} · ${base}) ＝ ${ans}.`
          : `Χωρίς παρένθεση, ο εκθέτης επηρεάζει μόνο τον αριθμό ${base}, ενώ το πρόσημο μείον παραμένει: －(${base} · ${base}) ＝ ${ans}.`,
    };
  },

  // 4. Σύγκριση (－α)² και －α² (MCQ) - Bug fix syntax
  (locale) => {
    const a = randInt(3, 8);
    const correct = `(－${a})<sup>2</sup> ＞ －${a}<sup>2</sup>`;
    const candidates = [
      `(－${a})<sup>2</sup> ＜ －${a}<sup>2</sup>`,
      `(－${a})<sup>2</sup> ＝ －${a}<sup>2</sup>`,
      `(－${a})<sup>2</sup> ≤ －${a}<sup>2</sup>`,
    ];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'PARENTHESES AND SIGNS' : 'ΠΑΡΕΝΘΕΣΕΙΣ ΚΑΙ ΠΡΟΣΗΜΑ',
      question:
        locale === 'en'
          ? `Which relation holds true between (－${a})<sup>2</sup> and －${a}<sup>2</sup>?`
          : `Ποια σχέση ισχύει μεταξύ των παραστάσεων (－${a})<sup>2</sup> και －${a}<sup>2</sup>;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `(－${a})<sup>2</sup> ＝ ＋${a * a} (positive), while －${a}<sup>2</sup> ＝ －${a * a} (negative). Therefore (－${a})<sup>2</sup> ＞ －${a}<sup>2</sup>.`
          : `(－${a})<sup>2</sup> ＝ ＋${a * a} (θετικό), ενώ －${a}<sup>2</sup> ＝ －${a * a} (αρνητικό). Επομένως (－${a})<sup>2</sup> ＞ －${a}<sup>2</sup>.`,
    };
  },

  // 5. Δύναμη του －1 με μεγάλο άρτιο εκθέτη (MCQ)
  (locale) => {
    const exp = randInt(50, 200) * 2;
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'POWERS OF -1' : 'ΔΥΝΑΜΕΙΣ ΤΟΥ -1',
      question:
        locale === 'en'
          ? `What is the value of the power (－1)<sup>${exp}</sup>?`
          : `Ποια είναι η τιμή της δύναμης (－1)<sup>${exp}</sup>;`,
      options: makeUniqueOptions('1', ['－1', `${exp}`, `－${exp}`]),
      correctAnswer: '1',
      solution:
        locale === 'en'
          ? `The number －1 raised to any even exponent (${exp}) always equals ＋1 (or 1).`
          : `Ο αριθμός －1 υψωμένος σε άρτιο εκθέτη (${exp}) ισούται πάντοτε με ＋1 (ή 1).`,
    };
  },

  // 6. Δύναμη του －1 με μεγάλο περιττό εκθέτη (MCQ)
  (locale) => {
    const exp = randInt(50, 200) * 2 + 1;
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'POWERS OF -1' : 'ΔΥΝΑΜΕΙΣ ΤΟΥ -1',
      question:
        locale === 'en'
          ? `What is the value of the power (－1)<sup>${exp}</sup>?`
          : `Ποια είναι η τιμή της δύναμης (－1)<sup>${exp}</sup>;`,
      options: makeUniqueOptions('－1', ['1', `${exp}`, '0']),
      correctAnswer: '－1',
      solution:
        locale === 'en'
          ? `The number －1 raised to any odd exponent (${exp}) always equals －1.`
          : `Ο αριθμός －1 υψωμένος σε περιττό εκθέτη (${exp}) ισούται πάντοτε με －1.`,
    };
  },

  // 7. Δύναμη με εκθέτη 0 (Input)
  (locale) => {
    const base = randInt(12, 95);
    return {
      type: 'input',
      topic: locale === 'en' ? 'ZERO EXPONENT' : 'ΜΗΔΕΝΙΚΟΣ ΕΚΘΕΤΗΣ',
      question:
        locale === 'en'
          ? `Calculate the value of: (－${base})<sup>0</sup>`
          : `Υπολόγισε την τιμή της παράστασης: (－${base})<sup>0</sup>`,
      correctAnswer: '1',
      solution:
        locale === 'en'
          ? 'Any non-zero base raised to the power of zero equals 1 by definition: α<sup>0</sup> ＝ 1.'
          : 'Κάθε μη μηδενικός αριθμός υψωμένος στο μηδέν ισούται εξ ορισμού με 1: α<sup>0</sup> ＝ 1.',
    };
  },

  // 8. Δύναμη με εκθέτη 1 (Input)
  (locale) => {
    const base = randInt(15, 60);
    return {
      type: 'input',
      topic: locale === 'en' ? 'POWER PROPERTIES' : 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question:
        locale === 'en'
          ? `Calculate the value: (－${base})<sup>1</sup>`
          : `Υπολόγισε την τιμή: (－${base})<sup>1</sup>`,
      correctAnswer: `-${base}`,
      solution:
        locale === 'en'
          ? `Any number raised to exponent 1 remains unchanged: (－${base})<sup>1</sup> ＝ －${base}.`
          : `Κάθε αριθμός υψωμένος στον εκθέτη 1 παραμένει ο ίδιος: (－${base})<sup>1</sup> ＝ －${base}.`,
    };
  },

  // 9. Γινόμενο δυνάμεων με την ίδια βάση (MCQ) - Bug fix syntax
  (locale) => {
    const base = randInt(2, 5);
    const m = randInt(2, 4);
    const n = randInt(2, 4);
    const sumExp = m + n;
    const multExp = m * n;
    const correct = `(－${base})<sup>${sumExp}</sup>`;
    const candidates = [
      `(－${base})<sup>${multExp}</sup>`,
      `(＋${base})<sup>${sumExp}</sup>`,
      `(－${base * 2})<sup>${sumExp}</sup>`,
    ];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'POWER PROPERTIES' : 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question:
        locale === 'en'
          ? `Express as a single power the product: (－${base})<sup>${m}</sup> · (－${base})<sup>${n}</sup>`
          : `Πώς γράφεται ως μία δύναμη το γινόμενο: (－${base})<sup>${m}</sup> · (－${base})<sup>${n}</sup>;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `Keep the same base and add exponents: α<sup>m</sup> · α<sup>n</sup> ＝ α<sup>m＋n</sup> ＝ (－${base})<sup>${sumExp}</sup>.`
          : `Διατηρούμε την ίδια βάση και προσθέτουμε τους εκθέτες: α<sup>μ</sup> · α<sup>ν</sup> ＝ α<sup>μ＋ν</sup> ＝ (－${base})<sup>${sumExp}</sup>.`,
    };
  },

  // 10. Πηλίκο δυνάμεων με την ίδια βάση (MCQ)
  (locale) => {
    const base = randInt(3, 6);
    const n = randInt(2, 3);
    const diff = randInt(2, 3);
    const m = n + diff;
    const correct = `(－${base})<sup>${diff}</sup>`;
    const candidates = [
      `(－${base})<sup>${m + n}</sup>`,
      `(－${base})<sup>${Math.floor(m / n)}</sup>`,
      `(＋${base})<sup>${diff}</sup>`,
    ];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'POWER PROPERTIES' : 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question:
        locale === 'en'
          ? `Express as a single power the quotient: (－${base})<sup>${m}</sup> : (－${base})<sup>${n}</sup>`
          : `Πώς γράφεται ως μία δύναμη το πηλίκο: (－${base})<sup>${m}</sup> ： (－${base})<sup>${n}</sup>;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `Keep the base and subtract exponents: α<sup>m</sup> : α<sup>n</sup> ＝ α<sup>m－n</sup> ＝ (－${base})<sup>${diff}</sup>.`
          : `Διατηρούμε την ίδια βάση και αφαιρούμε τους εκθέτες: α<sup>μ</sup> ： α<sup>ν</sup> ＝ α<sup>μ－ν</sup> ＝ (－${base})<sup>${diff}</sup>.`,
    };
  },

  // 11. Δύναμη σε δύναμη (MCQ)
  (locale) => {
    const base = randInt(2, 4);
    const m = 2;
    const n = 3;
    const multExp = m * n;
    const correct = `(－${base})<sup>${multExp}</sup>`;
    const candidates = [
      `(－${base})<sup>${m + n}</sup>`,
      `(＋${base})<sup>${multExp}</sup>`,
      `(－${base})<sup>${Math.pow(m, n)}</sup>`,
    ];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'POWER PROPERTIES' : 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question:
        locale === 'en'
          ? `Simplify the expression: [ (－${base})<sup>${m}</sup> ]<sup>${n}</sup>`
          : `Πώς απλοποιείται η παράσταση [ (－${base})<sup>${m}</sup> ]<sup>${n}</sup>;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `Multiply exponents: (α<sup>m</sup>)<sup>n</sup> ＝ α<sup>m·n</sup> ＝ (－${base})<sup>${multExp}</sup>.`
          : `Πολλαπλασιάζουμε τους εκθέτες: (α<sup>μ</sup>)<sup>ν</sup> ＝ α<sup>μ·ν</sup> ＝ (－${base})<sup>${multExp}</sup>.`,
    };
  },

  // 12. Άθροισμα δυνάμεων (Input)
  (locale) => {
    const a = randInt(2, 4);
    const b = randInt(2, 3);
    const valA = a * a;
    const valB = -(b * b * b);
    const ans = valA + valB;
    return {
      type: 'input',
      topic: locale === 'en' ? 'EVALUATING EXPRESSIONS' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΠΑΡΑΣΤΑΣΗΣ',
      question:
        locale === 'en'
          ? `Calculate: (－${a})<sup>2</sup> ＋ (－${b})<sup>3</sup>`
          : `Υπολόγισε την τιμή: (－${a})<sup>2</sup> ＋ (－${b})<sup>3</sup>`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${a})<sup>2</sup> ＝ ＋${valA} and (－${b})<sup>3</sup> ＝ ${valB}. Thus ${valA} ＋ (${valB}) ＝ ${ans}.`
          : `(－${a})<sup>2</sup> ＝ ＋${valA} και (－${b})<sup>3</sup> ＝ ${valB}. Άρα ${valA} ＋ (${valB}) ＝ ${ans}.`,
    };
  },

  // 13. Διαφορά δυνάμεων (Input) - Bug fix syntax
  (locale) => {
    const a = randInt(2, 4);
    const b = randInt(2, 3);
    const valA = a * a;
    const valB = b * b;
    const ans = valA - valB;
    return {
      type: 'input',
      topic: locale === 'en' ? 'EVALUATING EXPRESSIONS' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΠΑΡΑΣΤΑΣΗΣ',
      question:
        locale === 'en'
          ? `Calculate: (－${a})<sup>2</sup> － (－${b})<sup>2</sup>`
          : `Υπολόγισε: (－${a})<sup>2</sup> － (－${b})<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${a})<sup>2</sup> ＝ ${valA} and (－${b})<sup>2</sup> ＝ ${valB}. Therefore ${valA} － ${valB} ＝ ${ans}.`
          : `(－${a})<sup>2</sup> ＝ ${valA} και (－${b})<sup>2</sup> ＝ ${valB}. Επομένως ${valA} － ${valB} ＝ ${ans}.`,
    };
  },

  // 14. Δύναμη γινομένου (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'POWER PROPERTIES' : 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question:
        locale === 'en'
          ? 'According to power properties, what does (α · β)<sup>ν</sup> equal?'
          : 'Σύμφωνα με τις ιδιότητες των δυνάμεων, σε τι ισούται η παράσταση (α · β)<sup>ν</sup>;',
      options: makeUniqueOptions(
        'α<sup>ν</sup> · β<sup>ν</sup>',
        ['α · β<sup>ν</sup>', 'α<sup>ν</sup> ＋ β<sup>ν</sup>', '(α ＋ β)<sup>ν</sup>']
      ),
      correctAnswer: 'α<sup>ν</sup> · β<sup>ν</sup>',
      solution:
        locale === 'en'
          ? 'The power of a product equals the product of each factor raised to that power: (α · β)<sup>ν</sup> ＝ α<sup>ν</sup> · β<sup>ν</sup>.'
          : 'Η δύναμη ενός γινομένου ισούται με το γινόμενο των δυνάμεων των παραγόντων του: (α · β)<sup>ν</sup> ＝ α<sup>ν</sup> · β<sup>ν</sup>.',
    };
  },

  // 15. Δύναμη του 0 (MCQ)
  (locale) => {
    const exp = randInt(3, 15);
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'POWER PROPERTIES' : 'ΙΔΙΟΤΗΤΕΣ ΔΥΝΑΜΕΩΝ',
      question:
        locale === 'en'
          ? `What is the value of 0<sup>${exp}</sup>?`
          : `Ποια είναι η τιμή της δύναμης 0<sup>${exp}</sup>;`,
      options: makeUniqueOptions('0', ['1', `${exp}`, locale === 'en' ? 'Undefined' : 'Δεν ορίζεται']),
      correctAnswer: '0',
      solution:
        locale === 'en'
          ? 'Zero raised to any positive integer exponent always equals 0: 0<sup>ν</sup> ＝ 0.'
          : 'Το μηδέν υψωμένο σε οποιονδήποτε θετικό ακέραιο εκθέτη ισούται πάντα με 0: 0<sup>ν</sup> ＝ 0.',
    };
  },

  // 16. Παράσταση με πρόσημο έξω από παρένθεση: －(－α)³ (Input)
  (locale) => {
    const a = randInt(2, 3);
    const inner = -Math.pow(a, 3);
    const ans = Math.pow(a, 3);
    return {
      type: 'input',
      topic: locale === 'en' ? 'COMPOUND SIGNS' : 'ΣΥΝΘΕΤΑ ΠΡΟΣΗΜΑ',
      question:
        locale === 'en'
          ? `Calculate: －(－${a})<sup>3</sup>`
          : `Υπολόγισε την τιμή της παράστασης: －(－${a})<sup>3</sup>`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${a})<sup>3</sup> ＝ ${inner}. Therefore with the minus sign in front: －(${inner}) ＝ ＋${ans}.`
          : `(－${a})<sup>3</sup> ＝ ${inner}. Επομένως με το μείον απ' έξω: －(${inner}) ＝ ＋${ans}.`,
    };
  },

  // 17. Παράσταση με πρόσημο έξω: －(－α)² (Input) - Bug fix syntax
  (locale) => {
    const a = randInt(3, 6);
    const valA = a * a;
    const ans = -valA;
    return {
      type: 'input',
      topic: locale === 'en' ? 'COMPOUND SIGNS' : 'ΣΥΝΘΕΤΑ ΠΡΟΣΗΜΑ',
      question:
        locale === 'en'
          ? `Calculate: －(－${a})<sup>2</sup>`
          : `Υπολόγισε την τιμή: －(－${a})<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${a})<sup>2</sup> ＝ ＋${valA}. With the minus sign in front: －(＋${valA}) ＝ ${ans}.`
          : `(－${a})<sup>2</sup> ＝ ＋${valA}. Με το μείον μπροστά: －(＋${valA}) ＝ ${ans}.`,
    };
  },

  // 18. Άθροισμα δυνάμεων του －1 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'en' ? 'POWERS OF -1' : 'ΔΥΝΑΜΕΙΣ ΤΟΥ -1',
      question:
        locale === 'en'
          ? 'Calculate: (－1)<sup>2</sup> ＋ (－1)<sup>3</sup> ＋ (－1)<sup>4</sup>'
          : 'Υπολόγισε: (－1)<sup>2</sup> ＋ (－1)<sup>3</sup> ＋ (－1)<sup>4</sup>',
      correctAnswer: '1',
      solution:
        locale === 'en'
          ? '(－1)<sup>2</sup> ＝ 1, (－1)<sup>3</sup> ＝ －1, (－1)<sup>4</sup> ＝ 1. Thus 1 ＋ (－1) ＋ 1 ＝ 1.'
          : '(－1)<sup>2</sup> ＝ 1, (－1)<sup>3</sup> ＝ －1, (－1)<sup>4</sup> ＝ 1. Άρα 1 ＋ (－1) ＋ 1 ＝ 1.',
    };
  },

  // 19. Τέταρτη δύναμη αρνητικού (Input)
  (locale) => {
    const ans = 16;
    return {
      type: 'input',
      topic: locale === 'en' ? 'EVEN EXPONENT' : 'ΑΡΤΙΟΣ ΕΚΘΕΤΗΣ',
      question:
        locale === 'en'
          ? 'Calculate: (－2)<sup>4</sup>'
          : 'Υπολόγισε: (－2)<sup>4</sup>',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? '(－2) · (－2) · (－2) · (－2) ＝ ＋16.'
          : '(－2) · (－2) · (－2) · (－2) ＝ ＋16.',
    };
  },

  // 20. Πέμπτη δύναμη αρνητικού (Input)
  (locale) => {
    const ans = -32;
    return {
      type: 'input',
      topic: locale === 'en' ? 'ODD EXPONENT' : 'ΠΕΡΙΤΤΟΣ ΕΚΘΕΤΗΣ',
      question:
        locale === 'en'
          ? 'Calculate: (－2)<sup>5</sup>'
          : 'Υπολόγισε: (－2)<sup>5</sup>',
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? '(－2)<sup>5</sup> ＝ (－2) · (－2) · (－2) · (－2) · (－2) ＝ －32.'
          : '(－2)<sup>5</sup> ＝ (－2) · (－2) · (－2) · (－2) · (－2) ＝ －32.',
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΔΥΝΑΜΕΩΝ (i18n)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Πληθυσμός βακτηρίων (διπλασιασμός ανά ώρα)
  (locale) => {
    const hours = randInt(3, 5);
    const ans = Math.pow(2, hours);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: EXPONENTIAL GROWTH' : 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΘΕΤΙΚΗ ΑΥΞΗΣΗ',
      question:
        locale === 'en'
          ? `In a biology experiment a bacterial colony doubles in size every hour. If it starts with 1 bacterium, how many bacteria will exist after ${hours} hours?`
          : `Σε ένα πείραμα βιολογίας μια αποικία βακτηρίων διπλασιάζεται κάθε ώρα (συντελεστής 2). Αν αρχικά υπήρχε 1 βακτήριο, πόσα βακτήρια θα υπάρχουν μετά από ${hours} ώρες;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `The population is given by 2<sup>${hours}</sup> ＝ ${ans} bacteria.`
          : `Ο πληθυσμός εκφράζεται από τη δύναμη 2<sup>${hours}</sup> ＝ ${ans} βακτήρια.`,
    };
  },

  // Πρόβλημα 2: Εμβαδόν τετράγωνου οικοπέδου
  (locale) => {
    const side = randInt(12, 25);
    const ans = side * side;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: GEOMETRY' : 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question:
        locale === 'en'
          ? `A square plot has a side length of ${side} m. What is the area of the plot in m²?`
          : `Ένα τετράγωνο οικόπεδο έχει πλευρά μήκους ${side} m. Ποιο είναι το εμβαδόν του οικοπέδου σε m²;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Area of a square: A ＝ ${side}<sup>2</sup> ＝ ${ans} m².`
          : `Το εμβαδόν τετραγώνου ισούται με το τετράγωνο της πλευράς του: Ε ＝ ${side}<sup>2</sup> ＝ ${ans} m².`,
    };
  },

  // Πρόβλημα 3: Όγκος κυβικής δεξαμενής
  (locale) => {
    const edge = randInt(3, 6);
    const ans = edge * edge * edge;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: GEOMETRY' : 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question:
        locale === 'en'
          ? `A storage room has the shape of a cube with edge length ${edge} m. What is the volume of the room in m³?`
          : `Μια αποθήκη έχει σχήμα κύβου με ακμή ${edge} m. Ποιος είναι ο όγκος της αποθήκης σε m³;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Volume of a cube: V ＝ ${edge}<sup>3</sup> ＝ ${ans} m³.`
          : `Ο όγκος κύβου ισούται με την τρίτη δύναμη της ακμής του: V ＝ ${edge}<sup>3</sup> ＝ ${ans} m³.`,
    };
  },

  // Πρόβλημα 4: Τριπλασιασμός αρχείων σε δίκτυο υπολογιστών
  (locale) => {
    const steps = randInt(2, 4);
    const ans = Math.pow(3, steps);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: COMPUTER SCIENCE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΠΛΗΡΟΦΟΡΙΚΗ',
      question:
        locale === 'en'
          ? `A computer script triples its replicas across a network every minute. If it starts with 1 replica, how many replicas will exist after ${steps} minutes?`
          : `Ένας ιός τριπλασιάζει τα αντίγραφά του σε ένα δίκτυο ανά λεπτό (συντελεστής 3). Αν αρχικά υπήρχε 1 αντίγραφο, πόσα αντίγραφα θα υπάρχουν μετά από ${steps} λεπτά;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Calculate the power: 3<sup>${steps}</sup> ＝ ${ans} replicas.`
          : `Υπολογίζουμε τη δύναμη: 3<sup>${steps}</sup> ＝ ${ans} αντίγραφα.`,
    };
  },

  // Πρόβλημα 5: Παιχνίδι ερωτήσεων με διπλασιασμό πόντων
  (locale) => {
    const rounds = randInt(4, 6);
    const ans = Math.pow(2, rounds);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: SCORE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question:
        locale === 'en'
          ? `In a quiz game each correct answer doubles the player's points. If a contestant starts with 1 point and answers correctly ${rounds} consecutive times, how many points does she accumulate?`
          : `Σε ένα τηλεπαιχνίδι κάθε σωστή απάντηση διπλασιάζει τους πόντους του παίκτη. Αν ξεκίνησε με 1 πόντο και απάντησε σωστά σε ${rounds} διαδοχικές ερωτήσεις, πόσους πόντους συγκέντρωσε;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Total points: 2<sup>${rounds}</sup> ＝ ${ans} points.`
          : `Οι πόντοι είναι 2<sup>${rounds}</sup> ＝ ${ans} πόντοι.`,
    };
  },

  // Πρόβλημα 6: Δέντρο αποφάσεων (δυαδικό δέντρο)
  (locale) => {
    const levels = randInt(3, 5);
    const ans = Math.pow(2, levels);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: COMBINATORICS' : 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΔΥΑΣΤΙΚΗ',
      question:
        locale === 'en'
          ? `In a decision tree each node branches into 2 choices. How many possible terminal leaves exist at level ${levels}?`
          : `Σε ένα τουρνουά σκακιού κάθε διακλάδωση χωρίζεται σε 2 νέες επιλογές. Πόσες δυνατές καταλήξεις υπάρχουν στο επίπεδο ${levels};`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Leaves in a binary tree: 2<sup>${levels}</sup> ＝ ${ans}.`
          : `Σε δυαδικό δέντρο ${levels} επιπέδων τα φύλλα είναι 2<sup>${levels}</sup> ＝ ${ans}.`,
    };
  },

  // Πρόβλημα 7: Χωρητικότητα μνήμης σε δυνάμεις του 2
  (locale) => {
    const p = randInt(4, 7);
    const ans = Math.pow(2, p);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: COMPUTER SCIENCE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΠΛΗΡΟΦΟΡΙΚΗ',
      question:
        locale === 'en'
          ? `A microcontroller bus uses ${p} addressing bits. How many unique memory addresses can it access (calculate 2<sup>${p}</sup>)?`
          : `Ένας μικροελεγκτής διαθέτει καταχωρητή με ${p} bits διευθυνσιοδότησης. Πόσες διαφορετικές θέσεις μνήμης μπορεί να προσπελάσει (υπολόγισε το 2<sup>${p}</sup>);`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Total unique states: 2<sup>${p}</sup> ＝ ${ans}.`
          : `Το πλήθος των διαφορετικών καταστάσεων είναι 2<sup>${p}</sup> ＝ ${ans}.`,
    };
  },

  // Πρόβλημα 8: Εμβαδόν πλατείας
  (locale) => {
    const side = randInt(30, 60);
    const ans = side * side;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: GEOMETRY' : 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question:
        locale === 'en'
          ? `A town square has a side of ${side} m. How many square meters (m²) of paving are required to pave the entire square?`
          : `Μια τετράγωνη πλατεία έχει πλευρά ${side} m. Πόσα τετραγωνικά μέτρα (m²) πλακόστρωσης απαιτούνται για να καλυφθεί ολόκληρη;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `A ＝ ${side}<sup>2</sup> ＝ ${ans} m².`
          : `Ε ＝ ${side}<sup>2</sup> ＝ ${ans} m².`,
    };
  },

  // Πρόβλημα 9: Αλυσίδα μηνυμάτων (email chain)
  (locale) => {
    const people = 4;
    const rounds = randInt(2, 3);
    const ans = Math.pow(people, rounds);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: EXPONENTIAL GROWTH' : 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΘΕΤΙΚΗ ΑΥΞΗΣΗ',
      question:
        locale === 'en'
          ? `An announcement is forwarded by 1 person to ${people} recipients, each of whom forwards it to ${people} new people. How many people receive the message in round ${rounds}?`
          : `Ένα ενημερωτικό μήνυμα στέλνεται από 1 άτομο σε ${people} άτομα, και καθένα από αυτά το προωθεί σε άλλα ${people} νέα άτομα. Πόσα άτομα θα λάβουν το μήνυμα στον ${rounds}ο γύρο προώθησης;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `In round ${rounds} recipients total ${people}<sup>${rounds}</sup> ＝ ${ans}.`
          : `Στον ${rounds}ο γύρο τα άτομα είναι ${people}<sup>${rounds}</sup> ＝ ${ans}.`,
    };
  },

  // Πρόβλημα 10: Δίπλωμα χαρτιού στη μέση
  (locale) => {
    const folds = randInt(4, 7);
    const ans = Math.pow(2, folds);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: EXPONENTIAL GROWTH' : 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΘΕΤΙΚΗ ΑΥΞΗΣΗ',
      question:
        locale === 'en'
          ? `A sheet of paper is folded in half ${folds} consecutive times. How many layer thicknesses are created?`
          : `Διπλώνουμε ένα φύλλο χαρτί στη μέση ${folds} διαδοχικές φορές. Σε πόσα επάλληλα στρώματα (πάχη) χωρίζεται το χαρτί;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Each fold doubles the layers: 2<sup>${folds}</sup> ＝ ${ans} layers.`
          : `Κάθε δίπλωμα διπλασιάζει τα στρώματα: 2<sup>${folds}</sup> ＝ ${ans} στρώματα.`,
    };
  },

  // Πρόβλημα 11: Όγκος κυβικού κιβωτίου αποθήκευσης
  (locale) => {
    const edge = randInt(7, 10);
    const ans = edge * edge * edge;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: GEOMETRY' : 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question:
        locale === 'en'
          ? `A storage box is shaped as a cube with edge ${edge} dm. What is its capacity in cubic decimeters (dm³)?`
          : `Ένα κιβώτιο αποθήκευσης έχει σχήμα κύβου με ακμή ${edge} dm. Ποια είναι η χωρητικότητά του σε κυβικά δεκατόμετρα (dm³);`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `V ＝ ${edge}<sup>3</sup> ＝ ${ans} dm³.`
          : `V ＝ ${edge}<sup>3</sup> ＝ ${ans} dm³.`,
    };
  },

  // Πρόβλημα 12: Συνδυασμοί ψηφιακού κωδικού PIN
  (locale) => {
    const digits = randInt(2, 3);
    const ans = Math.pow(10, digits);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: COMBINATORICS' : 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΔΥΑΣΤΙΚΗ',
      question:
        locale === 'en'
          ? `A padlock code consists of ${digits} rotating dials (each dial has 10 digits, 0-9). How many distinct combinations can be formed (10<sup>${digits}</sup>)?`
          : `Ένα λουκέτο ασφαλείας έχει κωδικό με ${digits} περιστρεφόμενους τροχούς (κάθε τροχός έχει ψηφία 0-9, δηλαδή 10 επιλογές). Πόσοι διαφορετικοί συνδυασμοί μπορούν να σχηματιστούν (10<sup>${digits}</sup>);`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Combinations: 10<sup>${digits}</sup> ＝ ${ans}.`
          : `Οι δυνατοί συνδυασμοί είναι 10<sup>${digits}</sup> ＝ ${ans}.`,
    };
  },

  // Πρόβλημα 13: Τετραγωνισμός αριθμού μαθητών σε σχηματισμό παρέλασης
  (locale) => {
    const rows = randInt(6, 12);
    const ans = rows * rows;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: GEOMETRY' : 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question:
        locale === 'en'
          ? `Students stand in a square parade formation of ${rows} rows and ${rows} columns. How many students participate in total?`
          : `Σε μια σχολική γιορτή οι μαθητές παρατάσσονται σε τετράγωνο σχηματισμό με ${rows} σειρές και ${rows} στήλες. Πόσοι μαθητές συμμετέχουν συνολικά στον σχηματισμό;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Total students: ${rows} · ${rows} ＝ ${rows}<sup>2</sup> ＝ ${ans}.`
          : `Συνολικοί μαθητές: ${rows} · ${rows} ＝ ${rows}<sup>2</sup> ＝ ${ans}.`,
    };
  },

  // Πρόβλημα 14: Διάδοση φήμης (πενταπλασιασμός)
  (locale) => {
    const rounds = 3;
    const ans = Math.pow(5, rounds);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: EXPONENTIAL GROWTH' : 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΘΕΤΙΚΗ ΑΥΞΗΣΗ',
      question:
        locale === 'en'
          ? `In a school each student shares news with 5 peers during recess. If it starts from 1 student, how many new students will learn the news during the 3rd recess?`
          : `Σε ένα σχολείο κάθε μαθητής μεταφέρει ένα νέο σε 5 συμμαθητές του σε κάθε διάλειμμα. Αν ξεκινήσει από 1 μαθητή, πόσοι νέοι μαθητές θα ενημερωθούν στο 3ο διάλειμμα;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Power calculation: 5<sup>3</sup> ＝ 125 students.`
          : `Υπολογίζουμε τη δύναμη: 5<sup>3</sup> ＝ 125 μαθητές.`,
    };
  },

  // Πρόβλημα 15: Εμβαδόν τετράγωνου ηλιακού συλλέκτη
  (locale) => {
    const side = randInt(4, 9);
    const ans = side * side;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: ENERGY' : 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΕΡΓΕΙΑ',
      question:
        locale === 'en'
          ? `A square solar panel has a side of ${side} m. What is its collection surface area in m²?`
          : `Ένας τετράγωνος ηλιακός συλλέκτης έχει μήκος πλευράς ${side} m. Ποια είναι η επιφάνεια συλλογής ενέργειας σε m²;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `A ＝ ${side}<sup>2</sup> ＝ ${ans} m².`
          : `Ε ＝ ${side}<sup>2</sup> ＝ ${ans} m².`,
    };
  },

  // Πρόβλημα 16: Ρυθμός αναπαραγωγής κυττάρων
  (locale) => {
    const cycles = randInt(5, 7);
    const ans = Math.pow(2, cycles);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: BIOLOGY' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΙΟΛΟΓΙΑ',
      question:
        locale === 'en'
          ? `An initial cell divides into 2 daughter cells during each cycle. How many cells will have emerged after ${cycles} consecutive division cycles?`
          : `Ένα αρχικό κύτταρο διαιρείται σε 2 νέα κύτταρα σε κάθε κύκλο μίτωσης. Πόσα κύτταρα θα έχουν προκύψει μετά από ${cycles} διαδοχικούς κύκλους διαίρεσης;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Total cells: 2<sup>${cycles}</sup> ＝ ${ans}.`
          : `Πλήθος κυττάρων: 2<sup>${cycles}</sup> ＝ ${ans}.`,
    };
  },

  // Πρόβλημα 17: Όγκος κυβικής παγοκύβου
  (locale) => {
    const edge = randInt(2, 4);
    const ans = edge * edge * edge;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: GEOMETRY' : 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question:
        locale === 'en'
          ? `An ice cube has the shape of a perfect cube with edge ${edge} cm. What is its volume in cm³?`
          : `Ένα παγάκι έχει σχήμα τέλειου κύβου με ακμή ${edge} cm. Ποιος είναι ο όγκος του σε cm³;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `V ＝ ${edge}<sup>3</sup> ＝ ${ans} cm³.`
          : `V ＝ ${edge}<sup>3</sup> ＝ ${ans} cm³.`,
    };
  },

  // Πρόβλημα 18: Πιθανοί συνδυασμοί ρίψης νομίσματος
  (locale) => {
    const tosses = randInt(3, 5);
    const ans = Math.pow(2, tosses);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: PROBABILITY' : 'ΠΡΟΒΛΗΜΑΤΑ: ΠΙΘΑΝΟΤΗΤΕΣ',
      question:
        locale === 'en'
          ? `A coin is tossed ${tosses} consecutive times (each toss has 2 outcomes: heads or tails). How many different sequence outcomes exist?`
          : `Ρίχνουμε ένα κέρμα ${tosses} συνεχόμενες φορές (σε κάθε ρίψη υπάρχουν 2 αποτελέσματα: κορώνα ή γράμματα). Πόσα διαφορετικά πιθανά αποτελέσματα ακολουθιών υπάρχουν;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Total outcomes: 2<sup>${tosses}</sup> ＝ ${ans}.`
          : `Συνολικά αποτελέσματα: 2<sup>${tosses}</sup> ＝ ${ans}.`,
    };
  },

  // Πρόβλημα 19: Κυβικό δοχείο λαδιού
  (locale) => {
    const edge = 5;
    const ans = edge * edge * edge;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: GEOMETRY' : 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question:
        locale === 'en'
          ? `A cubic container has an edge of 5 dm. How many liters of olive oil can it hold, knowing that 1 dm³ equals 1 l?`
          : `Ένα κυβικό δοχείο έχει ακμή 5 dm. Πόσα λίτρα λαδιού χωράει αν γνωρίζουμε ότι 1 dm³ ισοδυναμεί με 1 l;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `V ＝ 5<sup>3</sup> ＝ 125 dm³ ＝ 125 l.`
          : `V ＝ 5<sup>3</sup> ＝ 125 dm³ ＝ 125 l.`,
    };
  },

  // Πρόβλημα 20: Τετραγωνισμός επιφάνειας ψηφιδωτού
  (locale) => {
    const side = randInt(11, 20);
    const ans = side * side;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: ART' : 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΗ',
      question:
        locale === 'en'
          ? `An artist constructs a square mosaic by placing ${side} tiles along each side. How many tiles are needed in total?`
          : `Ένας καλλιτέχνης δημιουργεί ένα τετράγωνο ψηφιδωτό τοποθετώντας ${side} ψηφίδες σε κάθε πλευρά. Πόσες ψηφίδες χρειάζεται συνολικά για να γεμίσει το τετράγωνο;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Total tiles: ${side}<sup>2</sup> ＝ ${ans}.`
          : `Συνολικές ψηφίδες: ${side}<sup>2</sup> ＝ ${ans}.`,
    };
  },
];

const UI_TEXT = {
  el: {
    metaTitle: "Ασκήσεις: Δυνάμεις Ακεραίων | Α' Γυμνασίου",
    metaDescription: "Εξάσκηση σε 12 δυναμικές ασκήσεις και προβλήματα στις δυνάμεις ακεραίων αριθμών και τις ιδιότητές τους.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Δυνάμεις Ακέραιων Αριθμών",
    heroDesc: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
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
    metaTitle: "Exercises: Powers of Integers | 7th Grade Mathematics",
    metaDescription: "Practice with 12 dynamic problems and word scenarios on powers of integers and their properties.",
    backText: "7th Grade",
    theoryBtn: "THEORY",
    badge: "GRADE 7 • PRACTICE",
    title: "Powers of Integers",
    heroDesc: "Solve the following 12 selected exercises (10 operations and theory + 2 realistic word problems). Then click 'CHECK ANSWERS' to view your score and step-by-step solutions.",
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

export default function DinameisAsk() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = UI_TEXT[locale];

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή: 10 ασκήσεις πράξεων + 2 ρεαλιστικά προβλήματα = 12 συνολικά
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
          href="/a-gymnasiou/09-dinameis"
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
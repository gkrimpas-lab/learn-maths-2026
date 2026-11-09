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
    [arr[i], arr[j]] = [arr[j], arr[i]];
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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΠΡΑΞΕΩΝ ΚΑΙ ΘΕΩΡΙΑΣ (i18n)
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Πρόσθεση θετικών (Input)
  (locale) => {
    const a = randInt(5, 25);
    const b = randInt(6, 30);
    const ans = a + b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'SAME SIGN NUMBERS' : 'ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate the sum: (＋${a}) ＋ (＋${b})`
          : `Υπολόγισε το άθροισμα: (＋${a}) ＋ (＋${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Adding two positive numbers: ＋(${a} ＋ ${b}) ＝ ＋${ans}.`
          : `Προσθέτουμε δύο θετικούς αριθμούς: ＋(${a} ＋ ${b}) ＝ ＋${ans}.`,
    };
  },

  // 2. Πρόσθεση αρνητικών (Input)
  (locale) => {
    const a = randInt(4, 22);
    const b = randInt(5, 28);
    const ans = -(a + b);
    return {
      type: 'input',
      topic: locale === 'en' ? 'SAME SIGN NUMBERS' : 'ΟΜΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate the sum: (－${a}) ＋ (－${b})`
          : `Υπολόγισε το άθροισμα: (－${a}) ＋ (－${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Adding two negative numbers: keep the common sign (－) and add absolute values: －(${a} ＋ ${b}) ＝ －${a + b}.`
          : `Προσθέτουμε δύο αρνητικούς αριθμούς. Κρατάμε το κοινό πρόσημο (－) και προσθέτουμε τις απόλυτες τιμές: －(${a} ＋ ${b}) ＝ －${a + b}.`,
    };
  },

  // 3. Ετερόσημοι με θετικό αποτέλεσμα (Input)
  (locale) => {
    const b = randInt(3, 15);
    const a = b + randInt(2, 14);
    const ans = a - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'DIFFERENT SIGNS' : 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate the sum: (＋${a}) ＋ (－${b})`
          : `Υπολόγισε το άθροισμα: (＋${a}) ＋ (－${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Since |＋${a}| ＞ |－${b}|, the result has a positive sign: ＋(${a} － ${b}) ＝ ＋${ans}.`
          : `Επειδή |＋${a}| ＞ |－${b}|, το αποτέλεσμα έχει θετικό πρόσημο: ＋(${a} － ${b}) ＝ ＋${ans}.`,
    };
  },

  // 4. Ετερόσημοι με αρνητικό αποτέλεσμα (Input)
  (locale) => {
    const a = randInt(2, 14);
    const b = a + randInt(3, 16);
    const ans = a - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'DIFFERENT SIGNS' : 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate the sum: (＋${a}) ＋ (－${b})`
          : `Υπολόγισε το άθροισμα: (＋${a}) ＋ (－${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Since |－${b}| ＞ |＋${a}|, keep the negative sign: －(${b} － ${a}) ＝ －${b - a}.`
          : `Επειδή |－${b}| ＞ |＋${a}|, κρατάμε το αρνητικό πρόσημο: －(${b} － ${a}) ＝ －${b - a}.`,
    };
  },

  // 5. Ετερόσημοι με πρώτο αρνητικό και θετικό αποτέλεσμα (Input)
  (locale) => {
    const a = randInt(4, 15);
    const b = a + randInt(2, 15);
    const ans = b - a;
    return {
      type: 'input',
      topic: locale === 'en' ? 'DIFFERENT SIGNS' : 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate the sum: (－${a}) ＋ (＋${b})`
          : `Υπολόγισε το άθροισμα: (－${a}) ＋ (＋${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `＋${b} has a greater absolute value: ＋(${b} － ${a}) ＝ ＋${ans}.`
          : `Το ＋${b} έχει μεγαλύτερη απόλυτη τιμή: ＋(${b} － ${a}) ＝ ＋${ans}.`,
    };
  },

  // 6. Ετερόσημοι με πρώτο αρνητικό και αρνητικό αποτέλεσμα (Input)
  (locale) => {
    const b = randInt(3, 12);
    const a = b + randInt(4, 18);
    const ans = -(a - b);
    return {
      type: 'input',
      topic: locale === 'en' ? 'DIFFERENT SIGNS' : 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate the sum: (－${a}) ＋ (＋${b})`
          : `Υπολόγισε το άθροισμα: (－${a}) ＋ (＋${b})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `－${a} has a greater absolute value: －(${a} － ${b}) ＝ －${a - b}.`
          : `Το －${a} έχει μεγαλύτερη απόλυτη τιμή: －(${a} － ${b}) ＝ －${a - b}.`,
    };
  },

  // 7. Άθροισμα αντιθέτων αριθμών (Input)
  (locale) => {
    const n = randInt(11, 75);
    return {
      type: 'input',
      topic: locale === 'en' ? 'OPPOSITE NUMBERS' : 'ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Calculate the sum of opposites: (＋${n}) ＋ (－${n})`
          : `Υπολόγισε το άθροισμα των αντιθέτων: (＋${n}) ＋ (－${n})`,
      correctAnswer: '0',
      solution:
        locale === 'en'
          ? 'The sum of two opposite numbers is always zero (a ＋ (－a) ＝ 0).'
          : 'Το άθροισμα δύο αντίθετων αριθμών ισούται πάντοτε με το μηδέν (α ＋ (－α) ＝ 0).',
    };
  },

  // 8. Πρόσθεση με το μηδέν (Input)
  (locale) => {
    const n = randInt(8, 45);
    return {
      type: 'input',
      topic: locale === 'en' ? 'ADDITION PROPERTIES' : 'ΙΔΙΟΤΗΤΕΣ ΠΡΟΣΘΕΣΗΣ',
      question:
        locale === 'en'
          ? `Calculate the sum: (－${n}) ＋ 0`
          : `Υπολόγισε το άθροισμα: (－${n}) ＋ 0`,
      correctAnswer: `-${n}`,
      solution:
        locale === 'en'
          ? `Zero is the additive identity: (－${n}) ＋ 0 ＝ －${n}.`
          : `Το μηδέν είναι το ουδέτερο στοιχείο της πρόσθεσης: (－${n}) ＋ 0 ＝ －${n}.`,
    };
  },

  // 9. Άθροισμα τριών αριθμών (Input)
  (locale) => {
    const a = randInt(5, 12);
    const b = randInt(3, 8);
    const c = randInt(6, 14);
    const ans = a - b - c;
    return {
      type: 'input',
      topic: locale === 'en' ? 'MULTI-TERM SUM' : 'ΑΘΡΟΙΣΜΑ ΠΟΛΛΩΝ ΟΡΩΝ',
      question:
        locale === 'en'
          ? `Calculate: (＋${a}) ＋ (－${b}) ＋ (－${c})`
          : `Υπολόγισε: (＋${a}) ＋ (－${b}) ＋ (－${c})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `First add the negative numbers: (－${b}) ＋ (－${c}) ＝ －${b + c}. Then: (＋${a}) ＋ (－${b + c}) ＝ ${ans}.`
          : `Προσθέτουμε πρώτα τους αρνητικούς: (－${b}) ＋ (－${c}) ＝ －${b + c}. Έπειτα: (＋${a}) ＋ (－${b + c}) ＝ ${ans}.`,
    };
  },

  // 10. Απλοποιημένη γραφή χωρίς παρενθέσεις (Input)
  (locale) => {
    const a = randInt(10, 25);
    const b = randInt(12, 35);
    const ans = a - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'SIMPLIFIED NOTATION' : 'ΑΠΛΟΠΟΙΗΜΕΝΗ ΓΡΑΦΗ',
      question:
        locale === 'en'
          ? `Calculate the value of: ${a} － ${b}`
          : `Υπολόγισε την τιμή της παράστασης: ${a} － ${b}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `This is equivalent to (＋${a}) ＋ (－${b}) ＝ －(${b} － ${a}) ＝ ${ans}.`
          : `Η παράσταση ισοδυναμεί με (＋${a}) ＋ (－${b}) ＝ －(${b} － ${a}) ＝ ${ans}.`,
    };
  },

  // 11. Δύο διαδοχικά μείον σε άθροισμα (Input)
  (locale) => {
    const a = randInt(6, 18);
    const b = randInt(4, 15);
    const ans = -a - b;
    return {
      type: 'input',
      topic: locale === 'en' ? 'SIMPLIFIED NOTATION' : 'ΑΠΛΟΠΟΙΗΜΕΝΗ ΓΡΑΦΗ',
      question:
        locale === 'en'
          ? `Calculate: －${a} － ${b}`
          : `Υπολόγισε: －${a} － ${b}`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Equivalent to (－${a}) ＋ (－${b}) ＝ －(${a} ＋ ${b}) ＝ －${a + b}.`
          : `Ισοδυναμεί με (－${a}) ＋ (－${b}) ＝ －(${a} ＋ ${b}) ＝ －${a + b}.`,
    };
  },

  // 12. Σωστός κανόνας ομόσημων (MCQ)
  (locale) => {
    const correct = locale === 'en' ? 'Always a negative number' : 'Πάντοτε αρνητικός αριθμός';
    const candidates =
      locale === 'en'
        ? ['Always a positive number', 'Always zero', 'Depends on absolute values']
        : ['Πάντοτε θετικός αριθμός', 'Πάντοτε το μηδέν', 'Εξαρτάται από τις απόλυτες τιμές'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'ADDITION THEORY' : 'ΘΕΩΡΙΑ ΠΡΟΣΘΕΣΗΣ',
      question:
        locale === 'en'
          ? 'What is always the result of adding two negative numbers?'
          : 'Ποιο είναι το αποτέλεσμα της πρόσθεσης δύο αρνητικών αριθμών;',
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'The sum of two negative numbers preserves their common negative sign, hence it is always a negative number.'
          : 'Το άθροισμα δύο αρνητικών αριθμών διατηρεί το κοινό τους πρόσημο, επομένως είναι πάντοτε αρνητικός αριθμός.',
    };
  },

  // 13. Πότε το άθροισμα ετερόσημων είναι μηδέν (MCQ)
  (locale) => {
    const correct = locale === 'en' ? 'When the numbers are opposites' : 'Όταν οι αριθμοί είναι αντίθετοι';
    const candidates =
      locale === 'en'
        ? ['When one number is double the other', 'When both are even', 'It can never equal zero']
        : ['Όταν ο ένας είναι διπλάσιος του άλλου', 'Όταν και οι δύο είναι άρτιοι', 'Ποτέ δεν μπορεί να είναι μηδέν'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'ADDITION THEORY' : 'ΘΕΩΡΙΑ ΠΡΟΣΘΕΣΗΣ',
      question:
        locale === 'en'
          ? 'When does the sum of two numbers with different signs equal zero?'
          : 'Πότε το άθροισμα δύο ετερόσημων αριθμών ισούται με το μηδέν;',
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'The sum of numbers with different signs equals zero only when they have equal absolute values, meaning they are opposite numbers.'
          : 'Το άθροισμα δύο ετερόσημων αριθμών είναι μηδέν μόνο όταν έχουν ίσες απόλυτες τιμές, δηλαδή όταν είναι αντίθετοι αριθμοί.',
    };
  },

  // 14. Πρόσημο αθροίσματος ετερόσημων (MCQ)
  (locale) => {
    const a = randInt(15, 30);
    const b = randInt(4, 12);
    const correct = locale === 'en' ? 'Negative (－)' : 'Αρνητικό (－)';
    const candidates =
      locale === 'en'
        ? ['Positive (＋)', 'Zero', 'Undefined']
        : ['Θετικό (＋)', 'Μηδέν', 'Δεν ορίζεται'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'DIFFERENT SIGNS' : 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `Without doing the arithmetic, what is the sign of the sum (－${a}) ＋ (＋${b})?`
          : `Χωρίς να κάνεις την πράξη, ποιο είναι το πρόσημο του αθροίσματος (－${a}) ＋ (＋${b});`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `Since |－${a}| ＝ ${a} ＞ ${b} ＝ |＋${b}|, the sum takes the sign of the number with the larger absolute value, which is negative (－).`
          : `Επειδή |－${a}| ＝ ${a} ＞ ${b} ＝ |＋${b}|, το άθροισμα παίρνει το πρόσημο του αριθμού με τη μεγαλύτερη απόλυτη τιμή, δηλαδή το αρνητικό (－).`,
    };
  },

  // 15. Άθροισμα με αντίθετους που απλοποιούνται (Input)
  (locale) => {
    const a = randInt(10, 40);
    const b = randInt(3, 18);
    return {
      type: 'input',
      topic: locale === 'en' ? 'SMART COMPUTATION' : 'ΕΞΥΠΝΟΣ ΥΠΟΛΟΓΙΣΜΟΣ',
      question:
        locale === 'en'
          ? `Calculate smartly: (＋${a}) ＋ (－${b}) ＋ (－${a})`
          : `Υπολόγισε έξυπνα: (＋${a}) ＋ (－${b}) ＋ (－${a})`,
      correctAnswer: `-${b}`,
      solution:
        locale === 'en'
          ? `The terms ＋${a} and －${a} are opposites and sum to 0. Only －${b} remains.`
          : `Οι όροι ＋${a} και －${a} είναι αντίθετοι και έχουν άθροισμα 0. Άρα απομένει μόνο το －${b}.`,
    };
  },

  // 16. Συμπλήρωση όρου πρόσθεσης (Input)
  (locale) => {
    const a = randInt(3, 12);
    const target = randInt(-10, -2);
    const missing = target - a;
    return {
      type: 'input',
      topic: locale === 'en' ? 'SOLVING FOR UNKNOWN' : 'ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ',
      question:
        locale === 'en'
          ? `Find integer x such that: (＋${a}) ＋ x ＝ ${target}`
          : `Βρες τον ακέραιο x ώστε: (＋${a}) ＋ x ＝ ${target}`,
      correctAnswer: missing.toString(),
      solution:
        locale === 'en'
          ? `x ＝ ${target} － (＋${a}) ＝ ${target} － ${a} ＝ ${missing}.`
          : `x ＝ ${target} － (＋${a}) ＝ ${target} － ${a} ＝ ${missing}.`,
    };
  },

  // 17. Μετακίνηση στον άξονα: δεξιά ή αριστερά (MCQ)
  (locale) => {
    const b = randInt(3, 9);
    const correct = locale === 'en' ? `Shift ${b} units to the left` : `Κατά ${b} θέσεις προς τα αριστερά`;
    const candidates =
      locale === 'en'
        ? [`Shift ${b} units to the right`, 'Stay at the same position', 'Return to 0']
        : [`Κατά ${b} θέσεις προς τα δεξιά`, 'Παραμονή στην ίδια θέση', 'Επιστροφή στο 0'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'GEOMETRIC INTERPRETATION' : 'ΓΕΩΜΕΤΡΙΚΗ ΕΡΜΗΝΕΙΑ',
      question:
        locale === 'en'
          ? `On the number line, adding the number (－${b}) represents a:`
          : `Στον άξονα των αριθμών, η πρόσθεση του αριθμού (－${b}) σημαίνει μετακίνηση:`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? 'The negative sign indicates movement along the negative direction, which is to the left.'
          : 'Το αρνητικό πρόσημο εκφράζει πάντοτε μετατόπιση προς την αρνητική κατεύθυνση, δηλαδή προς τα αριστερά.',
    };
  },

  // 18. Υπολογισμός τεσσάρων όρων (Input)
  (locale) => {
    const ans = randInt(-8, 8);
    const p1 = 6;
    const p2 = 8;
    const n1 = -4;
    const n2 = ans - (p1 + p2 + n1);
    const n2Formatted = n2 >= 0 ? `＋${n2}` : `－${Math.abs(n2)}`;
    return {
      type: 'input',
      topic: locale === 'en' ? 'MULTI-TERM SUM' : 'ΑΘΡΟΙΣΜΑ ΠΟΛΛΩΝ ΟΡΩΝ',
      question:
        locale === 'en'
          ? `Calculate: (＋${p1}) ＋ (－4) ＋ (＋${p2}) ＋ (${n2Formatted})`
          : `Υπολόγισε: (＋${p1}) ＋ (－4) ＋ (＋${p2}) ＋ (${n2Formatted})`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Group positive and negative terms together: (＋${p1 + p2}) ＋ (${n1 + n2}) ＝ ${ans}.`
          : `Ομαδοποιούμε θετικούς και αρνητικούς όρους: (＋${p1 + p2}) ＋ (${n1 + n2}) ＝ ${ans}.`,
    };
  },

  // 19. Σύγκριση αθροίσματος με το μηδέν (MCQ)
  (locale) => {
    const a = randInt(8, 20);
    const b = a + randInt(1, 5);
    const correct = locale === 'en' ? 'It is less than 0 (negative)' : 'Είναι μικρότερο από το 0 (αρνητικό)';
    const candidates =
      locale === 'en'
        ? ['It is greater than 0 (positive)', 'It equals 0', 'It equals ＋1']
        : ['Είναι μεγαλύτερο από το 0 (θετικό)', 'Είναι ίσο με το 0', 'Είναι ίσο με ＋1'];
    return {
      type: 'mcq',
      topic: locale === 'en' ? 'DIFFERENT SIGNS' : 'ΕΤΕΡΟΣΗΜΟΙ ΑΡΙΘΜΟΙ',
      question:
        locale === 'en'
          ? `What is true about the sum (＋${a}) ＋ (－${b})?`
          : `Ποια σχέση ισχύει για το άθροισμα (＋${a}) ＋ (－${b});`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution:
        locale === 'en'
          ? `Since |－${b}| ＞ |＋${a}|, the sum is strictly negative (less than 0).`
          : `Επειδή |－${b}| ＞ |＋${a}|, το άθροισμα είναι αρνητικό, δηλαδή μικρότερο από το 0.`,
    };
  },

  // 20. Απόλυτη τιμή αθροίσματος (Input)
  (locale) => {
    const a = randInt(4, 12);
    const b = randInt(14, 25);
    const inside = a - b;
    const ans = Math.abs(inside);
    return {
      type: 'input',
      topic: locale === 'en' ? 'ABSOLUTE VALUE & ADDITION' : 'ΑΠΟΛΥΤΗ ΤΙΜΗ & ΠΡΟΣΘΕΣΗ',
      question:
        locale === 'en'
          ? `Calculate the value: |(＋${a}) ＋ (－${b})|`
          : `Υπολόγισε την τιμή: |(＋${a}) ＋ (－${b})|`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `First compute the sum inside the absolute value: (＋${a}) ＋ (－${b}) ＝ ${inside}. Then take the absolute value: |${inside}| ＝ ${ans}.`
          : `Πρώτα εκτελούμε την πρόσθεση μέσα στην απόλυτη τιμή: (＋${a}) ＋ (－${b}) ＝ ${inside}. Στη συνέχεια παίρνουμε την απόλυτη τιμή: |${inside}| ＝ ${ans}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ (i18n)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Πτώση θερμοκρασίας κάτω από το μηδέν
  (locale) => {
    const start = randInt(2, 6);
    const drop = randInt(start + 2, start + 7);
    const ans = start - drop;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: TEMPERATURE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question:
        locale === 'en'
          ? `In Kastoria the noon temperature was ＋${start} °C. By midnight it dropped by ${drop} °C. What is the new temperature in °C? (type with － sign)`
          : `Στην Καστοριά η θερμοκρασία το μεσημέρι ήταν ＋${start} °C. Μέχρι τα μεσάνυχτα η θερμοκρασία έπεσε κατά ${drop} °C. Ποια είναι η νέα θερμοκρασία σε °C; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `We express the drop as adding a negative number: (＋${start}) ＋ (－${drop}) ＝ －(${drop} － ${start}) ＝ ${ans} °C.`
          : `Εκφράζουμε την πτώση ως πρόσθεση αρνητικού αριθμού: (＋${start}) ＋ (－${drop}) ＝ －(${drop} － ${start}) ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 2: Άνοδος θερμοκρασίας από παγετό
  (locale) => {
    const start = randInt(4, 9);
    const rise = randInt(start + 2, start + 8);
    const ans = -start + rise;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: TEMPERATURE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question:
        locale === 'en'
          ? `In the morning in an alpine village the temperature was －${start} °C. By noon it rose by ${rise} °C. What is the noon temperature in °C?`
          : `Το πρωί σε ένα ορεινό χωριό η θερμοκρασία ήταν －${start} °C. Το μεσημέρι ανέβηκε κατά ${rise} °C. Ποια είναι η θερμοκρασία το μεσημέρι σε °C;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `The rise corresponds to adding a positive number: (－${start}) ＋ (＋${rise}) ＝ ＋(${rise} － ${start}) ＝ ＋${ans} °C.`
          : `Η άνοδος αντιστοιχεί σε θετικό αριθμό: (－${start}) ＋ (＋${rise}) ＝ ＋(${rise} － ${start}) ＝ ＋${ans} °C.`,
    };
  },

  // Πρόβλημα 3: Τραπεζική κατάθεση και ανάληψη (υπόλοιπο αρνητικό)
  (locale) => {
    const deposit = randInt(40, 90);
    const withdraw = deposit + randInt(20, 60);
    const ans = deposit - withdraw;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `A bank account had a balance of ${deposit} €. The owner withdrew ${withdraw} € via overdraft. What is the new balance in €? (type with － sign)`
          : `Ένας τραπεζικός λογαριασμός είχε υπόλοιπο ${deposit} €. Ο κάτοχος έκανε ανάληψη ${withdraw} € με δικαίωμα υπερανάληψης. Ποιο είναι το νέο υπόλοιπο σε €; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Withdrawal is represented by a negative integer: (＋${deposit}) ＋ (－${withdraw}) ＝ ${ans} €. The new balance is negative.`
          : `Η ανάληψη εκφράζεται ως αρνητικός αριθμός: (＋${deposit}) ＋ (－${withdraw}) ＝ ${ans} €. Το υπόλοιπο είναι αρνητικό.`,
    };
  },

  // Πρόβλημα 4: Αποπληρωμή χρέους (παραμένει χρέος)
  (locale) => {
    const debt = randInt(80, 150);
    const pay = debt - randInt(15, 45);
    const ans = -debt + pay;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `A merchant had an outstanding debt of ${debt} €. He made a partial payment of ${pay} €. What is his remaining balance in €? (type with － sign)`
          : `Ένας επαγγελματίας είχε οφειλή (χρέος) ${debt} €. Πλήρωσε έναντι ${pay} €. Ποιο είναι το υπόλοιπο της οφειλής του σε €; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Debt is negative and payment is positive: (－${debt}) ＋ (＋${pay}) ＝ －(${debt} － ${pay}) ＝ ${ans} €. Debt remains.`
          : `Το χρέος είναι αρνητικό και η πληρωμή θετική: (－${debt}) ＋ (＋${pay}) ＝ －(${debt} － ${pay}) ＝ ${ans} €.`,
    };
  },

  // Πρόβλημα 5: Αποπληρωμή χρέους με πλεόνασμα
  (locale) => {
    const debt = randInt(50, 90);
    const pay = debt + randInt(20, 50);
    const ans = -debt + pay;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `A subscriber owed his phone company ${debt} €. By mistake he transferred ${pay} €. What is his new credit balance in €?`
          : `Ένας συνδρομητής όφειλε στην εταιρεία κινητής τηλεφωνίας ${debt} €. Κατέθεσε κατά λάθος ${pay} €. Ποιο είναι το νέο πιστωτικό του υπόλοιπο σε €;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${debt}) ＋ (＋${pay}) ＝ ＋(${pay} － ${debt}) ＝ ＋${ans} €. A positive credit balance is formed.`
          : `(－${debt}) ＋ (＋${pay}) ＝ ＋(${pay} － ${debt}) ＝ ＋${ans} €. Δημιουργείται θετικό πιστωτικό υπόλοιπο.`,
    };
  },

  // Πρόβλημα 6: Κίνηση ασανσέρ (υπόγειο σε όροφο)
  (locale) => {
    const basement = randInt(2, 4);
    const floorsUp = basement + randInt(2, 6);
    const ans = -basement + floorsUp;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: ELEVATOR' : 'ΠΡΟΒΛΗΜΑΤΑ: ΑΝΕΛΚΥΣΤΗΡΑΣ',
      question:
        locale === 'en'
          ? `An elevator starts at basement level ${basement} (floor －${basement}) and ascends ${floorsUp} floors. Which floor does it stop on?`
          : `Ο ανελκυστήρας ενός εμπορικού κέντρου ξεκινά από το ${basement}ο υπόγειο (όροφος －${basement}) και ανεβαίνει κατά ${floorsUp} ορόφους. Σε ποιον όροφο σταματά;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${basement}) ＋ (＋${floorsUp}) ＝ ＋(${floorsUp} － ${basement}) ＝ ＋${ans} (i.e. on floor ${ans}).`
          : `(－${basement}) ＋ (＋${floorsUp}) ＝ ＋(${floorsUp} － ${basement}) ＝ ＋${ans} (δηλαδή στον ${ans}ο όροφο).`,
    };
  },

  // Πρόβλημα 7: Κίνηση ασανσέρ (όροφος σε υπόγειο)
  (locale) => {
    const floor = randInt(3, 7);
    const floorsDown = floor + randInt(2, 4);
    const ans = floor - floorsDown;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: ELEVATOR' : 'ΠΡΟΒΛΗΜΑΤΑ: ΑΝΕΛΚΥΣΤΗΡΑΣ',
      question:
        locale === 'en'
          ? `An elevator is on floor ${floor} (＋${floor}) and moves down ${floorsDown} floors. What integer represents its current floor? (type with － sign)`
          : `Ένας ανελκυστήρας βρίσκεται στον ${floor}ο όροφο (＋${floor}) και κατεβαίνει κατά ${floorsDown} ορόφους. Σε ποιον όροφο βρίσκεται τώρα; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${floor}) ＋ (－${floorsDown}) ＝ －(${floorsDown} － ${floor}) ＝ ${ans} (in basement level ${Math.abs(ans)}).`
          : `(＋${floor}) ＋ (－${floorsDown}) ＝ －(${floorsDown} － ${floor}) ＝ ${ans} (στο ${Math.abs(ans)}ο υπόγειο).`,
    };
  },

  // Πρόβλημα 8: Υποβρύχιο που καταδύεται βαθύτερα
  (locale) => {
    const depth1 = randInt(40, 90);
    const depth2 = randInt(20, 50);
    const ans = -(depth1 + depth2);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: DEPTH' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question:
        locale === 'en'
          ? `A submarine cruises at a depth of ${depth1} m (elevation －${depth1} m). It then dives an additional ${depth2} m. What integer represents its new elevation in meters? (type with － sign)`
          : `Ένα υποβρύχιο πλέει σε βάθος ${depth1} m (υψόμετρο －${depth1} m). Στη συνέχεια καταδύεται κατά ακόμα ${depth2} m. Ποιο είναι το νέο του βάθος ως ακέραιος αριθμός σε μέτρα; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `Adding two negative displacements: (－${depth1}) ＋ (－${depth2}) ＝ －(${depth1} ＋ ${depth2}) ＝ ${ans} m.`
          : `Προσθέτουμε δύο αρνητικές μετατοπίσεις: (－${depth1}) ＋ (－${depth2}) ＝ －(${depth1} ＋ ${depth2}) ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 9: Υποβρύχιο που αναδύεται μερικώς
  (locale) => {
    const depth = randInt(70, 130);
    const ascent = randInt(25, depth - 15);
    const ans = -depth + ascent;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: DEPTH' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question:
        locale === 'en'
          ? `A research submarine was at elevation －${depth} m. It climbed ${ascent} m toward the surface. What integer represents its current elevation in meters? (type with － sign)`
          : `Ένα ερευνητικό υποβρύχιο βρισκόταν σε βάθος ${depth} m (－${depth} m). Ανέβηκε κατά ${ascent} m προς την επιφάνεια. Σε ποιο υψόμετρο βρίσκεται τώρα σε μέτρα; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${depth}) ＋ (＋${ascent}) ＝ －(${depth} － ${ascent}) ＝ ${ans} m.`
          : `(－${depth}) ＋ (＋${ascent}) ＝ －(${depth} － ${ascent}) ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 10: Βαθμολογία σε τηλεπαιχνίδι
  (locale) => {
    const penalty = randInt(15, 35);
    const reward = penalty + randInt(10, 25);
    const ans = -penalty + reward;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: SCORE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question:
        locale === 'en'
          ? `In a game show a contestant had a penalty score of －${penalty} points. In the next round she scored ${reward} points. What is her final score?`
          : `Σε ένα τηλεπαιχνίδι ένας παίκτης είχε ποινή －${penalty} βαθμούς. Στον επόμενο γύρο κέρδισε ${reward} βαθμούς. Ποια είναι η τελική του βαθμολογία;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${penalty}) ＋ (＋${reward}) ＝ ＋(${reward} － ${penalty}) ＝ ＋${ans} points.`
          : `(－${penalty}) ＋ (＋${reward}) ＝ ＋(${reward} － ${penalty}) ＝ ＋${ans} βαθμοί.`,
    };
  },

  // Πρόβλημα 11: Διαδοχικές ποινές σε επιτραπέζιο
  (locale) => {
    const p1 = randInt(10, 25);
    const p2 = randInt(8, 20);
    const ans = -(p1 + p2);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: SCORE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question:
        locale === 'en'
          ? `In a board game John received a penalty of ${p1} points and then another penalty of ${p2} points. What is his total score? (type with － sign)`
          : `Σε έναν γύρο ενός επιτραπέζιου παιχνιδιού ο Γιάννης δέχτηκε ποινή ${p1} βαθμών και στον επόμενο γύρο νέα ποινή ${p2} βαθμών. Ποιο είναι το συνολικό σκορ του; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${p1}) ＋ (－${p2}) ＝ －(${p1} ＋ ${p2}) ＝ ${ans} points.`
          : `(－${p1}) ＋ (－${p2}) ＝ －(${p1} ＋ ${p2}) ＝ ${ans} βαθμοί.`,
    };
  },

  // Πρόβλημα 12: Διαφορά θερμοκρασίας καταψύκτη
  (locale) => {
    const start = randInt(14, 20);
    const cold = randInt(3, 8);
    const ans = -(start + cold);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: TEMPERATURE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question:
        locale === 'en'
          ? `A commercial freezer is set at －${start} °C. The technician lowers the temperature by another ${cold} °C. What is the new reading in °C? (type with － sign)`
          : `Ένας επαγγελματικός καταψύκτης έχει θερμοκρασία －${start} °C. Ο τεχνικός ρυθμίζει τη θερμοκρασία να πέσει κατά άλλους ${cold} °C. Ποια είναι η νέα ένδειξη σε °C; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${start}) ＋ (－${cold}) ＝ －(${start} ＋ ${cold}) ＝ ${ans} °C.`
          : `(－${start}) ＋ (－${cold}) ＝ －(${start} ＋ ${cold}) ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 13: Κέρδος και ζημιά καταστήματος
  (locale) => {
    const loss = randInt(120, 250);
    const profit = loss + randInt(50, 150);
    const ans = -loss + profit;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `During the first week a retail store recorded a loss of ${loss} €. In the second week it made a profit of ${profit} €. What is the net financial result for the two weeks in €?`
          : `Ένα κατάστημα την πρώτη εβδομάδα κατέγραψε ζημιά ${loss} €. Τη δεύτερη εβδομάδα είχε κέρδος ${profit} €. Ποιο είναι το συνολικό οικονομικό αποτέλεσμα των δύο εβδομάδων σε €;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${loss}) ＋ (＋${profit}) ＝ ＋(${profit} － ${loss}) ＝ ＋${ans} €. Net positive gain.`
          : `(－${loss}) ＋ (＋${profit}) ＝ ＋(${profit} － ${loss}) ＝ ＋${ans} €. Συνολικό κέρδος.`,
    };
  },

  // Πρόβλημα 14: Ζημιά μεγαλύτερη από το κέρδος
  (locale) => {
    const profit = randInt(100, 200);
    const loss = profit + randInt(40, 110);
    const ans = profit - loss;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: FINANCES' : 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question:
        locale === 'en'
          ? `A small business recorded a profit of ${profit} € on Monday, but on Tuesday recorded a loss of ${loss} €. What is the net cash result in €? (type with － sign)`
          : `Μια μικρή επιχείρηση είχε κέρδος ${profit} € τη Δευτέρα, αλλά την Τρίτη κατέγραψε ζημιά ${loss} €. Ποιο είναι το τελικό ταμειακό αποτέλεσμα σε €; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${profit}) ＋ (－${loss}) ＝ －(${loss} － ${profit}) ＝ ${ans} €. Net loss.`
          : `(＋${profit}) ＋ (－${loss}) ＝ －(${loss} － ${profit}) ＝ ${ans} €. Συνολική ζημιά.`,
    };
  },

  // Πρόβλημα 15: Δύτης που ανεβαίνει
  (locale) => {
    const depth = randInt(18, 35);
    const up = randInt(5, depth - 4);
    const ans = -depth + up;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: DEPTH' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ',
      question:
        locale === 'en'
          ? `A diver descends to a depth of ${depth} m (position －${depth} m). He then ascends ${up} m for decompression. What integer represents his current depth? (type with － sign)`
          : `Ένας δύτης καταδύεται σε βάθος ${depth} m (θέση －${depth} m). Στη συνέχεια ανεβαίνει κατά ${up} m για αποσυμπίεση. Σε ποιο βάθος βρίσκεται τώρα ως ακέραιος με πρόσημο; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${depth}) ＋ (＋${up}) ＝ －(${depth} － ${up}) ＝ ${ans} m.`
          : `(－${depth}) ＋ (＋${up}) ＝ －(${depth} － ${up}) ＝ ${ans} m.`,
    };
  },

  // Πρόβλημα 16: Μεταβολή θερμοκρασίας σε εργαστήριο
  (locale) => {
    const t1 = randInt(1, 5);
    const drop = randInt(6, 12);
    const ans = t1 - drop;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: TEMPERATURE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question:
        locale === 'en'
          ? `In a chemistry experiment a chemical solution had a temperature of ＋${t1} °C. Adding dry ice lowered the temperature by ${drop} °C. What is the final temperature in °C? (type with － sign)`
          : `Σε ένα πείραμα χημείας η θερμοκρασία ενός διαλύματος ήταν ＋${t1} °C. Με την προσθήκη ξηρού πάγου η θερμοκρασία μειώθηκε κατά ${drop} °C. Ποια είναι η τελική θερμοκρασία σε °C; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(＋${t1}) ＋ (－${drop}) ＝ －(${drop} － ${t1}) ＝ ${ans} °C.`
          : `(＋${t1}) ＋ (－${drop}) ＝ －(${drop} － ${t1}) ＝ ${ans} °C.`,
    };
  },

  // Πρόβλημα 17: Μετοχές και μεταβολή δείκτη
  (locale) => {
    const fall = randInt(15, 40);
    const rise = randInt(10, 35);
    const ans = -fall + rise;
    const formattedAns = ans > 0 ? `＋${ans}` : `${ans}`;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: STOCK MARKET' : 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΗΜΑΤΙΣΤΗΡΙΟ',
      question:
        locale === 'en'
          ? `A stock index fell by ${fall} points on Wednesday and gained ${rise} points on Thursday. What is the total two-day point change?`
          : `Ο γενικός δείκτης τιμών υποχώρησε την Τετάρτη κατά ${fall} μονάδες και την Πέμπτη ενισχύθηκε κατά ${rise} μονάδες. Ποια είναι η συνολική μεταβολή του δείκτη στο διήμερο;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${fall}) ＋ (＋${rise}) ＝ ${formattedAns} points.`
          : `(－${fall}) ＋ (＋${rise}) ＝ ${formattedAns} μονάδες.`,
    };
  },

  // Πρόβλημα 18: Υπόγειο πάρκινγκ
  (locale) => {
    const down1 = 2;
    const down2 = 1;
    const ans = -(down1 + down2);
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: ELEVATOR' : 'ΠΡΟΒΛΗΜΑΤΑ: ΑΝΕΛΚΥΣΤΗΡΑΣ',
      question:
        locale === 'en'
          ? `A driver parks at basement level 2 (floor －2) and descends 1 additional level via escalator. What integer represents his current level? (type with － sign)`
          : `Ένας οδηγός κατεβαίνει στο 2ο υπόγειο (－2) και κατόπιν κατεβαίνει ένα ακόμα επίπεδο με τις κυλιόμενες σκάλες. Σε ποιο υπόγειο επίπεδο βρίσκεται τώρα ως αρνητικός αριθμός; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${down1}) ＋ (－${down2}) ＝ －${down1 + down2}. He is on basement level ${Math.abs(ans)}. `
          : `(－${down1}) ＋ (－${down2}) ＝ －${down1 + down2}. Βρίσκεται στο ${Math.abs(ans)}ο υπόγειο.`,
    };
  },

  // Πρόβλημα 19: Διαφορά στάθμης δεξαμενής
  (locale) => {
    const below = randInt(12, 28);
    const refill = below + randInt(5, 18);
    const ans = -below + refill;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: WATER LEVEL' : 'ΠΡΟΒΛΗΜΑΤΑ: ΣΤΑΘΜΗ',
      question:
        locale === 'en'
          ? `The water level of a reservoir was ${below} cm below normal limit (－${below} cm). After rain the level rose by ${refill} cm. What is the new level in cm relative to the limit?`
          : `Η στάθμη του νερού σε μια τεχνητή λίμνη βρισκόταν ${below} cm κάτω από το κανονικό όριο (－${below} cm). Μετά από βροχόπτωση η στάθμη ανέβηκε κατά ${refill} cm. Ποια είναι η νέα στάθμη σε cm σε σχέση με το όριο;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${below}) ＋ (＋${refill}) ＝ ＋(${refill} － ${below}) ＝ ＋${ans} cm.`
          : `(－${below}) ＋ (＋${refill}) ＝ ＋(${refill} － ${below}) ＝ ＋${ans} cm.`,
    };
  },

  // Πρόβλημα 20: Παιχνίδι ερωτήσεων με βαθμούς
  (locale) => {
    const wrongPenalty = randInt(20, 50);
    const rightBonus = randInt(10, 40);
    const ans = -wrongPenalty + rightBonus;
    const formattedAns = ans > 0 ? `＋${ans}` : `${ans}`;
    return {
      type: 'input',
      topic: locale === 'en' ? 'PROBLEMS: SCORE' : 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question:
        locale === 'en'
          ? `A quiz team started with a delay penalty of －${wrongPenalty} points, then earned ${rightBonus} points for a correct answer. What is their current score?`
          : `Μια ομάδα μαθητών ξεκίνησε έναν γύρο γνώσεων με ποινή －${wrongPenalty} πόντων λόγω καθυστέρησης, αλλά απάντησε σωστά κερδίζοντας ${rightBonus} πόντους. Ποιο είναι το σκορ της;`,
      correctAnswer: ans.toString(),
      solution:
        locale === 'en'
          ? `(－${wrongPenalty}) ＋ (＋${rightBonus}) ＝ ${formattedAns} points.`
          : `(－${wrongPenalty}) ＋ (＋${rightBonus}) ＝ ${formattedAns} πόντοι.`,
    };
  },
];

const UI_TEXT = {
  el: {
    metaTitle: "Ασκήσεις: Πρόσθεση Ακεραίων | Α' Γυμνασίου",
    metaDescription: "Εξάσκηση σε 12 δυναμικές ασκήσεις και προβλήματα στην πρόσθεση ομόσημων και ετερόσημων ακεραίων αριθμών.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    badge: "Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Πρόσθεση Ακέραιων Αριθμών",
    heroDesc: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις το σκορ σου και αναλυτικές λύσεις.",
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
    metaTitle: "Exercises: Integer Addition | 7th Grade Mathematics",
    metaDescription: "Practice with 12 dynamic problems and word scenarios on integer addition with same and different signs.",
    backText: "7th Grade",
    theoryBtn: "THEORY",
    badge: "GRADE 7 • PRACTICE",
    title: "Integer Addition",
    heroDesc: "Solve the following 12 selected problems (10 operations/theory + 2 realistic word problems). Then click 'CHECK ANSWERS' to view your score and step-by-step solutions.",
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

export default function ProsthesiAkeraionAsk() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = UI_TEXT[locale];

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

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
          href="/a-gymnasiou/06-prosthesi-akeraion"
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
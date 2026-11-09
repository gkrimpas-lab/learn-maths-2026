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

const gcd = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Πολλαπλασιασμός θετικών κλασμάτων (Input)
  (locale) => {
    const n1 = randInt(1, 3);
    const d1 = randInt(4, 5);
    const n2 = randInt(1, 3);
    const d2 = randInt(2, 3);
    const rawN = n1 * n2;
    const rawD = d1 * d2;
    const g = gcd(rawN, rawD);
    const redN = rawN / g;
    const redD = rawD / g;
    const ansStr = redD === 1 ? `${redN}` : `${redN}/${redD}`;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΚΛΑΣΜΑΤΩΝ' : 'FRACTION MULTIPLICATION',
      question: locale === 'el'
        ? `Υπολόγισε το γινόμενο σε ανάγωγο κλάσμα: (${htmlFrac(n1, d1)}) · (${htmlFrac(n2, d2)}) (μορφή α/β):`
        : `Calculate the product as an irreducible fraction: (${htmlFrac(n1, d1)}) · (${htmlFrac(n2, d2)}) (form a/b):`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `Πολλαπλασιάζουμε αριθμητή με αριθμητή και παρονομαστή με παρονομαστή: (${n1} · ${n2}) / (${d1} · ${d2}) ＝ ${htmlFrac(rawN, rawD)}${g > 1 ? ` ＝ ${htmlFrac(redN, redD)} μετά από διαίρεση με το ${g}` : ''}.`
        : `Multiply numerator by numerator and denominator by denominator: (${n1} · ${n2}) / (${d1} · ${d2}) ＝ ${htmlFrac(rawN, rawD)}${g > 1 ? ` ＝ ${htmlFrac(redN, redD)} after division by ${g}` : ''}.`,
    };
  },

  // 2. Πολλαπλασιασμός ομόσημων αρνητικών κλασμάτων (Input)
  (locale) => {
    const n1 = 2;
    const d1 = 3;
    const n2 = 4;
    const d2 = 5;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΟΜΟΣΗΜΑ ΑΡΝΗΤΙΚΑ' : 'SAME SIGN NEGATIVES',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγη μορφή: (${htmlFrac(-n1, d1)}) · (${htmlFrac(-n2, d2)}) (μορφή α/β):`
        : `Calculate in reduced form: (${htmlFrac(-n1, d1)}) · (${htmlFrac(-n2, d2)}) (form a/b):`,
      correctAnswer: '8/15',
      solution: locale === 'el'
        ? `Το γινόμενο δύο ομόσημων αρνητικών αριθμών είναι θετικό (－ · － ＝ ＋): (2 · 4) / (3 · 5) ＝ ${htmlFrac(8, 15)}.`
        : `The product of two negative numbers with the same sign is positive (－ · － ＝ ＋): (2 · 4) / (3 · 5) ＝ ${htmlFrac(8, 15)}.`,
    };
  },

  // 3. Πολλαπλασιασμός ετερόσημων κλασμάτων (Input)
  (locale) => {
    const n1 = 3;
    const d1 = 4;
    const n2 = 2;
    const d2 = 5;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΤΕΡΟΣΗΜΑ ΚΛΑΣΜΑΤΑ' : 'DIFFERENT SIGNS',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγη μορφή: (${htmlFrac(n1, d1)}) · (${htmlFrac(-n2, d2)}) (μορφή α/β):`
        : `Calculate in reduced form: (${htmlFrac(n1, d1)}) · (${htmlFrac(-n2, d2)}) (form a/b):`,
      correctAnswer: '-3/10',
      solution: locale === 'el'
        ? `Το γινόμενο ετερόσημων είναι αρνητικό (＋ · － ＝ －): －(3 · 2) / (4 · 5) ＝ －6/20 ＝ ${htmlFrac(-3, 10)} μετά από διαίρεση με το 2.`
        : `The product of different signs is negative (＋ · － ＝ －): －(3 · 2) / (4 · 5) ＝ －6/20 ＝ ${htmlFrac(-3, 10)} after division by 2.`,
    };
  },

  // 4. Εύρεση αντιστρόφου κλάσματος (Input)
  (locale) => {
    const n = randInt(2, 7);
    const d = randInt(8, 13);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΤΙΣΤΡΟΦΟΣ ΡΗΤΟΣ' : 'RECIPROCAL NUMBER',
      question: locale === 'el'
        ? `Ποιος είναι ο αντίστροφος αριθμός του κλάσματος ${htmlFrac(n, d)}; (μορφή α/β):`
        : `What is the reciprocal of the fraction ${htmlFrac(n, d)}? (form a/b):`,
      correctAnswer: `${d}/${n}`,
      solution: locale === 'el'
        ? `Ο αντίστροφος του ${htmlFrac(n, d)} προκύπτει αντιστρέφοντας τους όρους: ${htmlFrac(d, n)} (καθώς ${htmlFrac(n, d)} · ${htmlFrac(d, n)} ＝ 1).`
        : `The reciprocal of ${htmlFrac(n, d)} is found by swapping the terms: ${htmlFrac(d, n)} (since ${htmlFrac(n, d)} · ${htmlFrac(d, n)} ＝ 1).`,
    };
  },

  // 5. Εύρεση αντιστρόφου αρνητικού κλάσματος (Input)
  (locale) => {
    const n = 3;
    const d = 5;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΤΙΣΤΡΟΦΟΣ ΑΡΝΗΤΙΚΟΥ' : 'RECIPROCAL OF NEGATIVE',
      question: locale === 'el'
        ? `Ποιος είναι ο αντίστροφος αριθμός του αρνητικού κλάσματος ${htmlFrac(-n, d)}; (μορφή α/β):`
        : `What is the reciprocal of the negative fraction ${htmlFrac(-n, d)}? (form a/b):`,
      correctAnswer: '-5/3',
      solution: locale === 'el'
        ? `Ο αντίστροφος διατηρεί πάντοτε το ίδιο πρόσημο: ${htmlFrac(-d, n)}.`
        : `The reciprocal always maintains the same sign: ${htmlFrac(-d, n)}.`,
    };
  },

  // 6. Γινόμενο αντίστροφων ρητών (Input)
  (locale) => {
    const a = randInt(4, 9);
    const b = randInt(11, 19);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΓΙΝΟΜΕΝΟ ΑΝΤΙΣΤΡΟΦΩΝ' : 'PRODUCT OF RECIPROCALS',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: (${htmlFrac(-a, b)}) · (${htmlFrac(-b, a)})`
        : `Calculate the result: (${htmlFrac(-a, b)}) · (${htmlFrac(-b, a)})`,
      correctAnswer: '1',
      solution: locale === 'el'
        ? `Το γινόμενο δύο αντίστροφων αριθμών ισούται πάντοτε με 1.`
        : `The product of two reciprocal numbers is always equal to 1.`,
    };
  },

  // 7. Πολλαπλασιασμός δεκαδικών με ίδιο πρόσημο (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΟΜΟΣΗΜΟΙ ΔΕΚΑΔΙΚΟΙ' : 'SAME SIGN DECIMALS',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: (－1,2) · (－0,3)`
        : `Calculate the result: (－1.2) · (－0.3)`,
      correctAnswer: locale === 'el' ? '0,36' : '0.36',
      solution: locale === 'el'
        ? `Το πρόσημο είναι θετικό (－ · － ＝ ＋). Πολλαπλασιάζουμε 12 · 3 ＝ 36 και χωρίζουμε 2 δεκαδικά ψηφία: 0,36.`
        : `The sign is positive (－ · － ＝ ＋). Multiply 12 · 3 ＝ 36 and separate 2 decimal places: 0.36.`,
    };
  },

  // 8. Πολλαπλασιασμός ετερόσημων δεκαδικών (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΤΕΡΟΣΗΜΟΙ ΔΕΚΑΔΙΚΟΙ' : 'DIFFERENT SIGN DECIMALS',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: (＋2,5) · (－0,4)`
        : `Calculate the result: (＋2.5) · (－0.4)`,
      correctAnswer: '-1',
      solution: locale === 'el'
        ? `Το πρόσημο είναι αρνητικό. 25 · 4 ＝ 100 με 2 δεκαδικά ψηφία: －1,00 ＝ －1.`
        : `The sign is negative. 25 · 4 ＝ 100 with 2 decimal places: －1.00 ＝ －1.`,
    };
  },

  // 9. Πολλαπλασιασμός με το μηδέν (Input)
  (locale) => {
    const a = -8;
    const b = 13;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΗΔΕΝΙΚΟ ΣΤΟΙΧΕΙΟ' : 'ZERO PROPERTY',
      question: locale === 'el'
        ? `Υπολόγισε το γινόμενο: (${htmlFrac(a, b)}) · 0`
        : `Calculate the product: (${htmlFrac(a, b)}) · 0`,
      correctAnswer: '0',
      solution: locale === 'el'
        ? `Κάθε ρητός αριθμός πολλαπλασιαζόμενος με το 0 δίνει 0.`
        : `Any rational number multiplied by 0 gives 0.`,
    };
  },

  // 10. Αναγνώριση επιμεριστικής ιδιότητας (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'α · (β ＋ γ) ＝ α · β ＋ α · γ'
      : 'a · (b ＋ c) ＝ a · b ＋ a · c';
    const wrongs = locale === 'el'
      ? [
          'α · (β · γ) ＝ (α · β) · γ',
          'α · β ＝ β · α',
          'α · 1 ＝ α',
        ]
      : [
          'a · (b · c) ＝ (a · b) · c',
          'a · b ＝ b · a',
          'a · 1 ＝ a',
        ];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ' : 'DISTRIBUTIVE PROPERTY',
      question: locale === 'el'
        ? `Ποια από τις παρακάτω ισότητες εκφράζει την επιμεριστική ιδιότητα του πολλαπλασιασμού;`
        : `Which equation expresses the distributive property of multiplication?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Η επιμεριστική ιδιότητα επιμερίζει τον πολλαπλασιασμό ως προς την πρόσθεση: ${correct}.`
        : `The distributive property distributes multiplication over addition: ${correct}.`,
    };
  },

  // 11. Πολλαπλασιασμός ακέραιου με κλάσμα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΚΕΡΑΙΟΣ ΜΕ ΚΛΑΣΜΑ' : 'INTEGER WITH FRACTION',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: 3 · (${htmlFrac(2, 9)}) (μορφή α/β):`
        : `Calculate as an irreducible fraction: 3 · (${htmlFrac(2, 9)}) (form a/b):`,
      correctAnswer: '2/3',
      solution: locale === 'el'
        ? `(3 · 2) / 9 ＝ 6/9 ＝ ${htmlFrac(2, 3)} μετά από διαίρεση με το 3.`
        : `(3 · 2) / 9 ＝ 6/9 ＝ ${htmlFrac(2, 3)} after division by 3.`,
    };
  },

  // 12. Απλοποίηση με διαίρεση πριν το γινόμενο (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΠΛΟΠΟΙΗΣΗ ΧΙΑΣΤΙ' : 'CROSS SIMPLIFICATION',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(4, 7)}) · (${htmlFrac(7, 12)}) (μορφή α/β):`
        : `Calculate as an irreducible fraction: (${htmlFrac(4, 7)}) · (${htmlFrac(7, 12)}) (form a/b):`,
      correctAnswer: '1/3',
      solution: locale === 'el'
        ? `Διαιρούμε τα 7 με το 7 και μένει 4/12 ＝ ${htmlFrac(1, 3)} μετά από διαίρεση με το 4.`
        : `Divide 7 by 7 to leave 4/12 ＝ ${htmlFrac(1, 3)} after division by 4.`,
    };
  },

  // 13. Αντίστροφος ακέραιου αριθμού (Input)
  (locale) => {
    const n = randInt(3, 8);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΤΙΣΤΡΟΦΟΣ ΑΚΕΡΑΙΟΥ' : 'RECIPROCAL OF INTEGER',
      question: locale === 'el'
        ? `Ποιος είναι ο αντίστροφος του ακέραιου αριθμού <strong>${n}</strong> (μορφή α/β);`
        : `What is the reciprocal of the integer <strong>${n}</strong>? (form a/b):`,
      correctAnswer: `1/${n}`,
      solution: locale === 'el'
        ? `Ο ακέραιος ${n} γράφεται ${htmlFrac(n, 1)}, επομένως ο αντίστροφός του είναι το ${htmlFrac(1, n)}.`
        : `The integer ${n} is written as ${htmlFrac(n, 1)}, so its reciprocal is ${htmlFrac(1, n)}.`,
    };
  },

  // 14. Πολλαπλασιασμός τριών παραγόντων (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΤΡΕΙΣ ΠΑΡΑΓΟΝΤΕΣ' : 'THREE FACTORS',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγη μορφή: (${htmlFrac(-1, 2)}) · (${htmlFrac(-2, 3)}) · (${htmlFrac(-3, 4)}) (μορφή α/β):`
        : `Calculate in reduced form: (${htmlFrac(-1, 2)}) · (${htmlFrac(-2, 3)}) · (${htmlFrac(-3, 4)}) (form a/b):`,
      correctAnswer: '-1/4',
      solution: locale === 'el'
        ? `Υπάρχουν 3 αρνητικοί παράγοντες (περιττό πλήθος), άρα το τελικό πρόσημο είναι αρνητικό: －(1 · 2 · 3) / (2 · 3 · 4) ＝ －6/24 ＝ ${htmlFrac(-1, 4)}.`
        : `There are 3 negative factors (odd count), so the final sign is negative: －(1 · 2 · 3) / (2 · 3 · 4) ＝ －6/24 ＝ ${htmlFrac(-1, 4)}.`,
    };
  },

  // 15. Αντίστροφος του 0 (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Το μηδέν δεν έχει αντίστροφο αριθμό'
      : 'Zero does not have a reciprocal';
    const wrongs = locale === 'el'
      ? ['Το 0', 'Το 1', 'Το －1']
      : ['0', '1', '－1'];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΑΝΤΙΣΤΡΟΦΟΣ ΤΟΥ ΜΗΔΕΝΟΣ' : 'RECIPROCAL OF ZERO',
      question: locale === 'el'
        ? `Ποιος είναι ο αντίστροφος αριθμός του μηδενός (0);`
        : `What is the reciprocal of zero (0)?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Δεν υπάρχει αριθμός που πολλαπλασιαζόμενος με το 0 να δίνει 1, επομένως το μηδέν δεν έχει αντίστροφο.`
        : `No number multiplied by 0 equals 1, so zero has no reciprocal.`,
    };
  },

  // 16. Υπολογισμός με επιμεριστική (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΦΑΡΜΟΓΗ ΕΠΙΜΕΡΙΣΤΙΚΗΣ' : 'APPLYING DISTRIBUTIVE',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης: 6 · [(${htmlFrac(1, 2)}) ＋ (${htmlFrac(1, 3)})]`
        : `Calculate the value of the expression: 6 · [(${htmlFrac(1, 2)}) ＋ (${htmlFrac(1, 3)})]`,
      correctAnswer: '5',
      solution: locale === 'el'
        ? `Εφαρμόζουμε επιμεριστική ιδιότητα: 6 · (${htmlFrac(1, 2)}) ＋ 6 · (${htmlFrac(1, 3)}) ＝ 3 ＋ 2 ＝ 5.`
        : `Apply the distributive property: 6 · (${htmlFrac(1, 2)}) ＋ 6 · (${htmlFrac(1, 3)}) ＝ 3 ＋ 2 ＝ 5.`,
    };
  },

  // 17. Πολλαπλασιασμός με το 1 (Input)
  (locale) => {
    const a = -5;
    const b = 11;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΟΥΔΕΤΕΡΟ ΣΤΟΙΧΕΙΟ' : 'IDENTITY ELEMENT',
      question: locale === 'el'
        ? `Υπολόγισε το γινόμενο: (${htmlFrac(a, b)}) · 1 (μορφή α/β):`
        : `Calculate the product: (${htmlFrac(a, b)}) · 1 (form a/b):`,
      correctAnswer: `${a}/${b}`,
      solution: locale === 'el'
        ? `Το 1 είναι το ουδέτερο στοιχείο του πολλαπλασιασμού: ${htmlFrac(a, b)}.`
        : `1 is the identity element of multiplication: ${htmlFrac(a, b)}.`,
    };
  },

  // 18. Πρόσημο γινομένου με 4 παράγοντες (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Θετικό (＋), γιατί το πλήθος των αρνητικών παραγόντων είναι άρτιο (4)'
      : 'Positive (＋), because the count of negative factors is even (4)';
    const wrongs = locale === 'el'
      ? [
          'Αρνητικό (－), γιατί όλοι οι παράγοντες είναι αρνητικοί',
          'Μηδέν',
          'Εξαρτάται από τις απόλυτες τιμές',
        ]
      : [
          'Negative (－), because all factors are negative',
          'Zero',
          'It depends on absolute values',
        ];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΠΡΟΣΗΜΟ ΠΟΛΛΑΠΛΩΝ ΠΑΡΑΓΟΝΤΩΝ' : 'MULTIPLE FACTOR SIGNS',
      question: locale === 'el'
        ? `Τι πρόσημο έχει το γινόμενο τεσσάρων αρνητικών ρητών αριθμών;`
        : `What sign does the product of four negative rational numbers have?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Άρτιο πλήθος αρνητικών παραγόντων δίνει πάντοτε θετικό γινόμενο: (－) · (－) · (－) · (－) ＝ ＋.`
        : `An even number of negative factors always yields a positive product: (－) · (－) · (－) · (－) ＝ ＋.`,
    };
  },

  // 19. Πολλαπλασιασμός δεκαδικού με 10 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ ΤΟ 10' : 'MULTIPLICATION BY 10',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: (－0,45) · 10`
        : `Calculate the result: (－0.45) · 10`,
      correctAnswer: locale === 'el' ? '-4,5' : '-4.5',
      solution: locale === 'el'
        ? `Μετακινούμε την υποδιαστολή μία θέση δεξιά διατηρώντας το πρόσημο: －4,5.`
        : `Move the decimal point one place to the right keeping the sign: －4.5.`,
    };
  },

  // 20. Αντίστροφος δεκαδικού αριθμού (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΤΙΣΤΡΟΦΟΣ ΔΕΚΑΔΙΚΟΥ' : 'RECIPROCAL OF DECIMAL',
      question: locale === 'el'
        ? `Ποιος είναι ο αντίστροφος αριθμός του δεκαδικού <strong>0,5</strong>;`
        : `What is the reciprocal of the decimal <strong>0.5</strong>?`,
      correctAnswer: '2',
      solution: locale === 'el'
        ? `0,5 ＝ ${htmlFrac(1, 2)}, επομένως ο αντίστροφός του είναι το ${htmlFrac(2, 1)} ＝ 2.`
        : `0.5 ＝ ${htmlFrac(1, 2)}, so its reciprocal is ${htmlFrac(2, 1)} ＝ 2.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ ΡΗΤΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Κλασματικό μέρος ποσού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΡΙΔΙΑ' : 'PROBLEMS: SHARES',
      question: locale === 'el'
        ? `Ο Γιάννης είχε 60 € και ξόδεψε τα ${htmlFrac(3, 4)} των χρημάτων του. Πόσα ευρώ ξόδεψε;`
        : `Giannis had 60 € and spent ${htmlFrac(3, 4)} of his money. How many euros did he spend?`,
      correctAnswer: '45',
      solution: locale === 'el'
        ? `Υπολογίζουμε το γινόμενο: 60 · (${htmlFrac(3, 4)}) ＝ (60 · 3) / 4 ＝ 180 / 4 ＝ 45 €.`
        : `Calculate the product: 60 · (${htmlFrac(3, 4)}) ＝ (60 · 3) / 4 ＝ 180 / 4 ＝ 45 €.`,
    };
  },

  // Πρόβλημα 2: Εμβαδόν ορθογωνίου με κλάσματα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ένα ορθογώνιο έχει μήκος ${htmlFrac(3, 2)} μέτρα και πλάτος ${htmlFrac(4, 5)} του μέτρου. Ποιο είναι το εμβαδόν του σε τετραγωνικά μέτρα (σε ανάγωγο κλάσμα α/β);`
        : `A rectangle has a length of ${htmlFrac(3, 2)} meters and a width of ${htmlFrac(4, 5)} meters. What is its area in square meters (irreducible fraction a/b)?`,
      correctAnswer: '6/5',
      solution: locale === 'el'
        ? `Εμβαδόν ＝ μήκος · πλάτος ＝ (${htmlFrac(3, 2)}) · (${htmlFrac(4, 5)}) ＝ 12/10 ＝ ${htmlFrac(6, 5)} τ.μ. μετά από διαίρεση με το 2.`
        : `Area ＝ length · width ＝ (${htmlFrac(3, 2)}) · (${htmlFrac(4, 5)}) ＝ 12/10 ＝ ${htmlFrac(6, 5)} m² after division by 2.`,
    };
  },

  // Πρόβλημα 3: Συνταγή μαγειρικής
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΤΑΓΕΣ' : 'PROBLEMS: RECIPES',
      question: locale === 'el'
        ? `Μια συνταγή απαιτεί ${htmlFrac(2, 3)} του κιλού αλεύρι για 1 δόση. Πόσα κιλά αλεύρι θα χρειαστούν για 3 δόσεις;`
        : `A recipe calls for ${htmlFrac(2, 3)} kg of flour for 1 batch. How many kilograms of flour are needed for 3 batches?`,
      correctAnswer: '2',
      solution: locale === 'el'
        ? `3 · (${htmlFrac(2, 3)}) ＝ 6/3 ＝ 2 kg.`
        : `3 · (${htmlFrac(2, 3)}) ＝ 6/3 ＝ 2 kg.`,
    };
  },

  // Πρόβλημα 4: Υπολογισμός έκπτωσης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'PROBLEMS: ECONOMICS',
      question: locale === 'el'
        ? `Ένα μπουφάν κοστίζει 80 € και προσφέρεται με έκπτωση 0,25 (δηλαδή 25%). Πόσα ευρώ είναι η έκπτωση;`
        : `A jacket costs 80 € and is offered with a discount factor of 0.25 (i.e. 25%). How many euros is the discount?`,
      correctAnswer: '20',
      solution: locale === 'el'
        ? `80 · 0,25 ＝ 20 €.`
        : `80 · 0.25 ＝ 20 €.`,
    };
  },

  // Πρόβλημα 5: Διανυθείσα απόσταση
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΙΚΗ' : 'PROBLEMS: PHYSICS',
      question: locale === 'el'
        ? `Ένα αυτοκίνητο κινείται με σταθερή ταχύτητα 90 km/h. Πόσα χιλιόμετρα θα διανύσει σε ${htmlFrac(2, 3)} της ώρας;`
        : `A car travels at a constant speed of 90 km/h. How many kilometers will it cover in ${htmlFrac(2, 3)} of an hour?`,
      correctAnswer: '60',
      solution: locale === 'el'
        ? `Απόσταση ＝ 90 · (${htmlFrac(2, 3)}) ＝ 180 / 3 ＝ 60 km.`
        : `Distance ＝ 90 · (${htmlFrac(2, 3)}) ＝ 180 / 3 ＝ 60 km.`,
    };
  },

  // Πρόβλημα 6: Κλάσμα του κλάσματος
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΡΙΔΙΑ' : 'PROBLEMS: SHARES',
      question: locale === 'el'
        ? `Σε ένα σχολείο τα ${htmlFrac(1, 2)} των μαθητών είναι κορίτσια και τα ${htmlFrac(1, 3)} των κοριτσιών παίζουν μπάσκετ. Ποιο κλάσμα του συνόλου των μαθητών είναι κορίτσια που παίζουν μπάσκετ (σε ανάγωγο κλάσμα α/β);`
        : `In a school ${htmlFrac(1, 2)} of students are girls and ${htmlFrac(1, 3)} of the girls play basketball. What fraction of all students are girls who play basketball (irreducible fraction a/b)?`,
      correctAnswer: '1/6',
      solution: locale === 'el'
        ? `(${htmlFrac(1, 2)}) · (${htmlFrac(1, 3)}) ＝ ${htmlFrac(1, 6)}.`
        : `(${htmlFrac(1, 2)}) · (${htmlFrac(1, 3)}) ＝ ${htmlFrac(1, 6)}.`,
    };
  },

  // Πρόβλημα 7: Εμβαδόν με δεκαδικούς
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ένα οικόπεδο έχει διαστάσεις 12,5 μέτρα και 8,0 μέτρα. Ποιο είναι το εμβαδόν του σε τετραγωνικά μέτρα;`
        : `A plot has dimensions of 12.5 meters and 8.0 meters. What is its area in square meters?`,
      correctAnswer: '100',
      solution: locale === 'el'
        ? `12,5 · 8 ＝ 100 τ.μ.`
        : `12.5 · 8 ＝ 100 m².`,
    };
  },

  // Πρόβλημα 8: Αξία αγοράς καυσίμου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ' : 'PROBLEMS: FUEL',
      question: locale === 'el'
        ? `Ένας οδηγός έβαλε 20 λίτρα βενζίνης με τιμή 1,85 € το λίτρο. Πόσα ευρώ πλήρωσε συνολικά;`
        : `A driver purchased 20 liters of gasoline at 1.85 € per liter. How much did they pay in total in euros?`,
      correctAnswer: '37',
      solution: locale === 'el'
        ? `20 · 1,85 ＝ 37 €.`
        : `20 · 1.85 ＝ 37 €.`,
    };
  },

  // Πρόβλημα 9: Συσκευασία υγρού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ' : 'PROBLEMS: CAPACITY',
      question: locale === 'el'
        ? `Γεμίσαμε 12 μπουκάλια χωρητικότητας ${htmlFrac(3, 4)} του λίτρου το καθένα. Πόσα λίτρα υγρού χρησιμοποιήθηκαν συνολικά;`
        : `We filled 12 bottles with a capacity of ${htmlFrac(3, 4)} liters each. How many liters of liquid were used in total?`,
      correctAnswer: '9',
      solution: locale === 'el'
        ? `12 · (${htmlFrac(3, 4)}) ＝ 36 / 4 ＝ 9 λίτρα.`
        : `12 · (${htmlFrac(3, 4)}) ＝ 36 / 4 ＝ 9 liters.`,
    };
  },

  // Πρόβλημα 10: Απώλεια βάρους
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΒΟΛΗ' : 'PROBLEMS: CHANGE',
      question: locale === 'el'
        ? `Ένας αθλητής έχανε σταθερά 0,8 kg την εβδομάδα (－0,8) για 4 εβδομάδες. Ποια ήταν η συνολική μεταβολή του βάρους του σε kg;`
        : `An athlete consistently lost 0.8 kg per week (－0.8) for 4 weeks. What was the total change in weight in kg?`,
      correctAnswer: locale === 'el' ? '-3,2' : '-3.2',
      solution: locale === 'el'
        ? `4 · (－0,8) ＝ －3,2 kg.`
        : `4 · (－0.8) ＝ －3.2 kg.`,
    };
  },

  // Πρόβλημα 11: Μερίδιο κληρονομιάς
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΜΕΡΙΣΜΟΣ' : 'PROBLEMS: SHARING',
      question: locale === 'el'
        ? `Από ένα αγρόκτημα αξίας 120.000 € ένας κληρονόμος έλαβε τα ${htmlFrac(2, 5)}. Πόσα ευρώ αντιστοιχούν στο μερίδιό του;`
        : `From a property worth 120,000 €, an heir received ${htmlFrac(2, 5)}. How many euros correspond to their share?`,
      correctAnswer: '48000',
      solution: locale === 'el'
        ? `120000 · (${htmlFrac(2, 5)}) ＝ (120000 · 2) / 5 ＝ 240000 / 5 ＝ 48.000 €.`
        : `120000 · (${htmlFrac(2, 5)}) ＝ (120000 · 2) / 5 ＝ 240000 / 5 ＝ 48,000 €.`,
    };
  },

  // Πρόβλημα 12: Χρόνος εργασίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ' : 'PROBLEMS: TIME',
      question: locale === 'el'
        ? `Ένας τεχνικός εργάστηκε 5 ημέρες επί 4,5 ώρες την ημέρα. Πόσες ώρες εργάστηκε συνολικά;`
        : `A technician worked 5 days at 4.5 hours per day. How many hours did they work in total?`,
      correctAnswer: locale === 'el' ? '22,5' : '22.5',
      solution: locale === 'el'
        ? `5 · 4,5 ＝ 22,5 ώρες.`
        : `5 · 4.5 ＝ 22.5 hours.`,
    };
  },

  // Πρόβλημα 13: Αναλογία χαρτιού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΑΡΤΙ' : 'PROBLEMS: PAPER',
      question: locale === 'el'
        ? `Ένα πακέτο χαρτί ζυγίζει ${htmlFrac(5, 2)} kg. Πόσο ζυγίζουν 6 ίδια πακέτα;`
        : `A pack of paper weighs ${htmlFrac(5, 2)} kg. How much do 6 identical packs weigh?`,
      correctAnswer: '15',
      solution: locale === 'el'
        ? `6 · (${htmlFrac(5, 2)}) ＝ 30 / 2 ＝ 15 kg.`
        : `6 · (${htmlFrac(5, 2)}) ＝ 30 / 2 ＝ 15 kg.`,
    };
  },

  // Πρόβλημα 14: Μείωση θερμοκρασίας ανά ώρα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ' : 'PROBLEMS: TEMPERATURE',
      question: locale === 'el'
        ? `Τη νύχτα η θερμοκρασία έπεφτε κατά 1,5 °C κάθε ώρα (－1,5). Πόσους βαθμούς έπεσε συνολικά μετά από 6 ώρες;`
        : `At night the temperature dropped by 1.5 °C every hour (－1.5). How many degrees did it drop in total after 6 hours?`,
      correctAnswer: '-9',
      solution: locale === 'el'
        ? `6 · (－1,5) ＝ －9 °C.`
        : `6 · (－1.5) ＝ －9 °C.`,
    };
  },

  // Πρόβλημα 15: Μήκος κορδέλας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ' : 'PROBLEMS: MEASUREMENTS',
      question: locale === 'el'
        ? `Κόψαμε 8 κομμάτια κορδέλας μήκους ${htmlFrac(3, 4)} του μέτρου το καθένα. Πόσα μέτρα κορδέλας κόπηκαν συνολικά;`
        : `We cut 8 pieces of ribbon measuring ${htmlFrac(3, 4)} meters each. How many meters of ribbon were cut in total?`,
      correctAnswer: '6',
      solution: locale === 'el'
        ? `8 · (${htmlFrac(3, 4)}) ＝ 24 / 4 ＝ 6 μέτρα.`
        : `8 · (${htmlFrac(3, 4)}) ＝ 24 / 4 ＝ 6 meters.`,
    };
  },

  // Πρόβλημα 16: Αξία φρούτων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'PROBLEMS: SHOPPING',
      question: locale === 'el'
        ? `Αγοράστηκαν 3,5 kg πορτοκάλια προς 1,20 € το κιλό. Ποιο ήταν το συνολικό κόστος σε ευρώ;`
        : `3.5 kg of oranges were purchased at 1.20 € per kg. What was the total cost in euros?`,
      correctAnswer: locale === 'el' ? '4,2' : '4.2',
      solution: locale === 'el'
        ? `3,5 · 1,2 ＝ 4,20 € (γράφεται 4,2).`
        : `3.5 · 1.2 ＝ 4.20 € (written as 4.2).`,
    };
  },

  // Πρόβλημα 17: Κατανάλωση καυσίμου ανά 100 km
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΥΤΟΚΙΝΗΤΟ' : 'PROBLEMS: CARS',
      question: locale === 'el'
        ? `Ένα όχημα καταναλώνει 6,5 λίτρα καυσίμου ανά 100 km. Πόσα λίτρα θα κάψει σε διαδρομή 300 km (δηλαδή 3 εκατοντάδες km);`
        : `A car consumes 6.5 liters of fuel per 100 km. How many liters will it burn on a 300 km trip (i.e. 3 hundred km)?`,
      correctAnswer: locale === 'el' ? '19,5' : '19.5',
      solution: locale === 'el'
        ? `3 · 6,5 ＝ 19,5 λίτρα.`
        : `3 · 6.5 ＝ 19.5 liters.`,
    };
  },

  // Πρόβλημα 18: Βάθος κατάδυσης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΔΥΣΕΙΣ' : 'PROBLEMS: DIVING',
      question: locale === 'el'
        ? `Ένας δύτης καταδύεται με ρυθμό 2,4 μέτρα το λεπτό (－2,4 m/min). Σε ποιο βάθος/υψόμετρο θα βρίσκεται μετά από 5 λεπτά σε μέτρα;`
        : `A diver descends at a rate of 2.4 meters per minute (－2.4 m/min). At what depth/altitude in meters will they be after 5 minutes?`,
      correctAnswer: '-12',
      solution: locale === 'el'
        ? `5 · (－2,4) ＝ －12 m.`
        : `5 · (－2.4) ＝ －12 m.`,
    };
  },

  // Πρόβλημα 19: Χωρητικότητα αποθήκης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΘΗΚΗ' : 'PROBLEMS: WAREHOUSE',
      question: locale === 'el'
        ? `Μια αποθήκη χωράει 40 τόνους σιτάρι και γέμισε κατά τα ${htmlFrac(7, 8)}. Πόσοι τόνοι σιτάρι αποθηκεύτηκαν;`
        : `A warehouse holds 40 tons of wheat and was filled to ${htmlFrac(7, 8)}. How many tons of wheat were stored?`,
      correctAnswer: '35',
      solution: locale === 'el'
        ? `40 · (${htmlFrac(7, 8)}) ＝ (40 · 7) / 8 ＝ 5 · 7 ＝ 35 τόνοι.`
        : `40 · (${htmlFrac(7, 8)}) ＝ (40 · 7) / 8 ＝ 5 · 7 ＝ 35 tons.`,
    };
  },

  // Πρόβλημα 20: Δόσεις αποπληρωμής
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΔΑΝΕΙΑ' : 'PROBLEMS: LOANS',
      question: locale === 'el'
        ? `Κάθε μήνα αφαιρούνται από τον λογαριασμό 45,50 € για δάνειο (－45,5). Ποια είναι η συνολική χρέωση μετά από 10 μήνες σε ευρώ;`
        : `Each month 45.50 € is deducted from an account for a loan (－45.5). What is the total deduction after 10 months in euros?`,
      correctAnswer: '-455',
      solution: locale === 'el'
        ? `10 · (－45,5) ＝ －455 €.`
        : `10 · (－45.5) ＝ －455 €.`,
    };
  },
];

export default function PollaplasiasmosKlasmataAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Συγκεντρωτικό λεξικό UI
  const t = {
    el: {
      pageTitle: "Ασκήσεις: Πολλαπλασιασμός Ρητών Αριθμών | Α' Γυμνασίου",
      pageDesc: "12 δυναμικές ασκήσεις και προβλήματα στον πολλαπλασιασμό ρητών αριθμών (κλάσματα και δεκαδικοί) για την Α' Γυμνασίου.",
      backText: "Α' Γυμνασίου",
      btnTheory: "ΘΕΩΡΙΑ",
      badgeHeader: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 16 • ΕΞΑΣΚΗΣΗ",
      mainTitle: "Πολλαπλασιασμός Ρητών Αριθμών",
      mainSubtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία πολλαπλασιασμού/αντιστρόφων ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
      problemBadge: "ΠΡΟΒΛΗΜΑ",
      placeholderInput: "π.χ. -3/10 ή 0,36",
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
      pageTitle: "Exercises: Multiplication of Rational Numbers | 7th Grade",
      pageDesc: "12 dynamic exercises and problems on multiplying rational numbers (fractions and decimals) for 7th Grade.",
      backText: "7th Grade",
      btnTheory: "THEORY",
      badgeHeader: "7TH GRADE • CHAPTER 16 • PRACTICE",
      mainTitle: "Multiplication of Rational Numbers",
      mainSubtitle: "Solve the 12 selected exercises below (10 multiplication/reciprocal operations and theory ＋ 2 real-world problems). Click 'CHECK ANSWERS' at the end to see your score and detailed solutions.",
      problemBadge: "PROBLEM",
      placeholderInput: "e.g. -3/10 or 0.36",
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

      // Ανοχή 0.05 στους δεκαδικούς ελέγχους
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
          href="/a-gymnasiou/18-pollaplasiasmos-klasmata"
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
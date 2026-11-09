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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ ΔΥΝΑΜΕΩΝ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Δύναμη αρνητικού με άρτιο εκθέτη (Input)
  (locale) => {
    const base = -2;
    const exp = 4;
    const ans = Math.pow(base, exp); // 16
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΗ ΒΑΣΗ (ΑΡΤΙΟΣ)' : 'NEGATIVE BASE (EVEN)',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της δύναμης: (${base})<sup>${exp}</sup>`
        : `Calculate the value of the power: (${base})<sup>${exp}</sup>`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Επειδή η βάση είναι αρνητική και ο εκθέτης είναι άρτιος (${exp}), το αποτέλεσμα είναι θετικό: (${base})<sup>${exp}</sup> ＝ ＋${ans}.`
        : `Since the base is negative and the exponent is even (${exp}), the result is positive: (${base})<sup>${exp}</sup> ＝ ＋${ans}.`,
    };
  },

  // 2. Δύναμη αρνητικού με περιττό εκθέτη (Input)
  (locale) => {
    const base = -2;
    const exp = 3;
    const ans = Math.pow(base, exp); // -8
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΗ ΒΑΣΗ (ΠΕΡΙΤΤΟΣ)' : 'NEGATIVE BASE (ODD)',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της δύναμης: (${base})<sup>${exp}</sup>`
        : `Calculate the value of the power: (${base})<sup>${exp}</sup>`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Επειδή η βάση είναι αρνητική και ο εκθέτης είναι περιττός (${exp}), το αποτέλεσμα είναι αρνητικό: (${base})<sup>${exp}</sup> ＝ ${ans}.`
        : `Since the base is negative and the exponent is odd (${exp}), the result is negative: (${base})<sup>${exp}</sup> ＝ ${ans}.`,
    };
  },

  // 3. Η παγίδα της παρένθεσης (Input)
  (locale) => {
    const base = 3;
    const exp = 2;
    const ans = -Math.pow(base, exp); // -9
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΑΓΙΔΑ ΠΑΡΕΝΘΕΣΗΣ' : 'PARENTHESES TRAP',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης: －${base}<sup>${exp}</sup>`
        : `Calculate the value of the expression: －${base}<sup>${exp}</sup>`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Επειδή το μείον δεν βρίσκεται μέσα σε παρένθεση, ο εκθέτης επηρεάζει μόνο τον αριθμό ${base}: －${base}<sup>${exp}</sup> ＝ －(${base} · ${base}) ＝ ${ans}.`
        : `Because the minus sign is not inside parentheses, the exponent only affects the number ${base}: －${base}<sup>${exp}</sup> ＝ －(${base} · ${base}) ＝ ${ans}.`,
    };
  },

  // 4. Δύναμη κλάσματος (Input)
  (locale) => {
    const n = 2;
    const d = 3;
    const exp = 3;
    const ansNum = Math.pow(n, exp); // 8
    const ansDen = Math.pow(d, exp); // 27
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΥΝΑΜΗ ΚΛΑΣΜΑΤΟΣ' : 'POWER OF A FRACTION',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(n, d)})<sup>${exp}</sup> (μορφή α/β):`
        : `Calculate as an irreducible fraction: (${htmlFrac(n, d)})<sup>${exp}</sup> (form a/b):`,
      correctAnswer: `${ansNum}/${ansDen}`,
      solution: locale === 'el'
        ? `Υψώνουμε αριθμητή και παρονομαστή στον εκθέτη: ${htmlFrac(`${n}<sup>${exp}</sup>`, `${d}<sup>${exp}</sup>`)} ＝ ${htmlFrac(ansNum, ansDen)}.`
        : `Raise numerator and denominator to the exponent: ${htmlFrac(`${n}<sup>${exp}</sup>`, `${d}<sup>${exp}</sup>`)} ＝ ${htmlFrac(ansNum, ansDen)}.`,
    };
  },

  // 5. Δύναμη αρνητικού κλάσματος με άρτιο εκθέτη (Input)
  (locale) => {
    const n = -1;
    const d = 2;
    const exp = 4;
    const ansDen = Math.pow(d, exp); // 16
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟ ΚΛΑΣΜΑ (ΑΡΤΙΟΣ)' : 'NEGATIVE FRACTION (EVEN)',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(n, d)})<sup>${exp}</sup>`
        : `Calculate as an irreducible fraction: (${htmlFrac(n, d)})<sup>${exp}</sup>`,
      correctAnswer: `1/${ansDen}`,
      solution: locale === 'el'
        ? `Ο εκθέτης είναι άρτιος (${exp}), επομένως το αποτέλεσμα είναι θετικό: ${htmlFrac(1, `2<sup>${exp}</sup>`)} ＝ ${htmlFrac(1, ansDen)}.`
        : `The exponent is even (${exp}), so the result is positive: ${htmlFrac(1, `2<sup>${exp}</sup>`)} ＝ ${htmlFrac(1, ansDen)}.`,
    };
  },

  // 6. Γινόμενο δυνάμεων με την ίδια βάση (MCQ)
  (locale) => {
    const b = 5;
    const m = 3;
    const n = 4;
    const sumExp = m + n; // 7
    const correct = `${b}<sup>${sumExp}</sup>`;
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΓΙΝΟΜΕΝΟ ΙΔΙΑΣ ΒΑΣΗΣ' : 'PRODUCT SAME BASE',
      question: locale === 'el'
        ? `Γράψε ως μία δύναμη το γινόμενο: ${b}<sup>${m}</sup> · ${b}<sup>${n}</sup>`
        : `Write as a single power the product: ${b}<sup>${m}</sup> · ${b}<sup>${n}</sup>`,
      options: makeUniqueOptions(correct, [
        `${b}<sup>${m * n}</sup>`,
        `${b * b}<sup>${sumExp}</sup>`,
        `${b}<sup>${Math.abs(m - n)}</sup>`,
      ]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Διατηρούμε την ίδια βάση και προσθέτουμε τους εκθέτες: ${b}<sup>${m} ＋ ${n}</sup> ＝ ${correct}.`
        : `Keep the same base and add exponents: ${b}<sup>${m} ＋ ${n}</sup> ＝ ${correct}.`,
    };
  },

  // 7. Πηλίκο δυνάμεων με την ίδια βάση (MCQ)
  (locale) => {
    const b = 7;
    const m = 8;
    const n = 5;
    const diffExp = m - n; // 3
    const correct = `${b}<sup>${diffExp}</sup>`;
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΠΗΛΙΚΟ ΙΔΙΑΣ ΒΑΣΗΣ' : 'QUOTIENT SAME BASE',
      question: locale === 'el'
        ? `Γράψε ως μία δύναμη το πηλίκο: ${b}<sup>${m}</sup> ： ${b}<sup>${n}</sup>`
        : `Write as a single power the quotient: ${b}<sup>${m}</sup> ： ${b}<sup>${n}</sup>`,
      options: makeUniqueOptions(correct, [
        `${b}<sup>${m + n}</sup>`,
        `1<sup>${diffExp}</sup>`,
        `${b}<sup>${m * n}</sup>`,
      ]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Διατηρούμε την ίδια βάση και αφαιρούμε τους εκθέτες: ${b}<sup>${m} － ${n}</sup> ＝ ${correct}.`
        : `Keep the same base and subtract exponents: ${b}<sup>${m} － ${n}</sup> ＝ ${correct}.`,
    };
  },

  // 8. Δύναμη σε δύναμη (MCQ)
  (locale) => {
    const b = 2;
    const m = 3;
    const n = 4;
    const prodExp = m * n; // 12
    const correct = `${b}<sup>${prodExp}</sup>`;
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΔΥΝΑΜΗ ΣΕ ΔΥΝΑΜΗ' : 'POWER OF A POWER',
      question: locale === 'el'
        ? `Γράψε ως μία δύναμη την παράσταση: (${b}<sup>${m}</sup>)<sup>${n}</sup>`
        : `Write as a single power the expression: (${b}<sup>${m}</sup>)<sup>${n}</sup>`,
      options: makeUniqueOptions(correct, [
        `${b}<sup>${m + n}</sup>`,
        `${b}<sup>${Math.pow(m, n)}</sup>`,
        `${b * n}<sup>${m}</sup>`,
      ]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Διατηρούμε τη βάση και πολλαπλασιάζουμε τους εκθέτες: ${b}<sup>${m} · ${n}</sup> ＝ ${correct}.`
        : `Keep the base and multiply exponents: ${b}<sup>${m} · ${n}</sup> ＝ ${correct}.`,
    };
  },

  // 9. Δύναμη δεκαδικού αριθμού (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΥΝΑΜΗ ΔΕΚΑΔΙΚΟΥ' : 'POWER OF A DECIMAL',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: 0,2<sup>3</sup>`
        : `Calculate the value: 0.2<sup>3</sup>`,
      correctAnswer: locale === 'el' ? '0,008' : '0.008',
      solution: locale === 'el'
        ? `0,2 · 0,2 · 0,2 ＝ 0,008 (1 δεκαδικό ψηφίο επί εκθέτη 3 ＝ 3 δεκαδικά ψηφία).`
        : `0.2 · 0.2 · 0.2 ＝ 0.008 (1 decimal place times exponent 3 ＝ 3 decimal places).`,
    };
  },

  // 10. Δύναμη γινομένου (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? '(α · β)<sup>ν</sup> ＝ α<sup>ν</sup> · β<sup>ν</sup>'
      : '(a · b)<sup>n</sup> ＝ a<sup>n</sup> · b<sup>n</sup>';
    const wrongs = locale === 'el'
      ? [
          '(α · β)<sup>ν</sup> ＝ α · β<sup>ν</sup>',
          '(α · β)<sup>ν</sup> ＝ α<sup>ν</sup> ＋ β<sup>ν</sup>',
          '(α ＋ β)<sup>ν</sup> ＝ α<sup>ν</sup> ＋ β<sup>ν</sup>',
        ]
      : [
          '(a · b)<sup>n</sup> ＝ a · b<sup>n</sup>',
          '(a · b)<sup>n</sup> ＝ a<sup>n</sup> ＋ b<sup>n</sup>',
          '(a ＋ b)<sup>n</sup> ＝ a<sup>n</sup> ＋ b<sup>n</sup>',
        ];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΔΥΝΑΜΗ ΓΙΝΟΜΕΝΟΥ' : 'POWER OF A PRODUCT',
      question: locale === 'el'
        ? `Ποια από τις παρακάτω ισότητες εκφράζει σωστά τη δύναμη γινομένου;`
        : `Which of the following equations correctly expresses the power of a product?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Στη δύναμη γινομένου υψώνεται κάθε παράγοντας ξεχωριστά στον ίδιο εκθέτη: ${correct}.`
        : `In the power of a product, each factor is raised separately to the same exponent: ${correct}.`,
    };
  },

  // 11. Δύναμη του 1 (Input)
  (locale) => {
    const exp = randInt(15, 99);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΥΝΑΜΗ ΤΟΥ 1' : 'POWER OF 1',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: 1<sup>${exp}</sup>`
        : `Calculate the value: 1<sup>${exp}</sup>`,
      correctAnswer: '1',
      solution: locale === 'el'
        ? `Ο αριθμός 1 υψωμένος σε οποιαδήποτε θετική δύναμη ισούται πάντοτε με 1.`
        : `The number 1 raised to any positive power is always equal to 1.`,
    };
  },

  // 12. Δύναμη του -1 με άρτιο εκθέτη (Input)
  (locale) => {
    const exp = 24;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΥΝΑΜΗ ΤΟΥ -1 (ΑΡΤΙΟΣ)' : 'POWER OF -1 (EVEN)',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: (－1)<sup>${exp}</sup>`
        : `Calculate the value: (－1)<sup>${exp}</sup>`,
      correctAnswer: '1',
      solution: locale === 'el'
        ? `Επειδή ο εκθέτης είναι άρτιος (${exp}), το αποτέλεσμα είναι θετικό: ＋1.`
        : `Because the exponent is even (${exp}), the result is positive: ＋1.`,
    };
  },

  // 13. Δύναμη του -1 με περιττό εκθέτη (Input)
  (locale) => {
    const exp = 37;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΥΝΑΜΗ ΤΟΥ -1 (ΠΕΡΙΤΤΟΣ)' : 'POWER OF -1 (ODD)',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: (－1)<sup>${exp}</sup>`
        : `Calculate the value: (－1)<sup>${exp}</sup>`,
      correctAnswer: '-1',
      solution: locale === 'el'
        ? `Επειδή ο εκθέτης είναι περιττός (${exp}), το αποτέλεσμα παραμένει αρνητικό: －1.`
        : `Because the exponent is odd (${exp}), the result remains negative: －1.`,
    };
  },

  // 14. Δύναμη με εκθέτη 1 (Input)
  (locale) => {
    const a = -14;
    const b = 17;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΚΘΕΤΗΣ 1' : 'EXPONENT 1',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: (${htmlFrac(a, b)})<sup>1</sup> (μορφή α/β):`
        : `Calculate the result: (${htmlFrac(a, b)})<sup>1</sup> (form a/b):`,
      correctAnswer: `${a}/${b}`,
      solution: locale === 'el'
        ? `Κάθε αριθμός υψωμένος στην 1η δύναμη ισούται με τον εαυτό του: ${htmlFrac(a, b)}.`
        : `Any number raised to the 1st power equals itself: ${htmlFrac(a, b)}.`,
    };
  },

  // 15. Δύναμη του μηδενός (Input)
  (locale) => {
    const exp = randInt(3, 10);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΥΝΑΜΗ ΤΟΥ 0' : 'POWER OF 0',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: 0<sup>${exp}</sup>`
        : `Calculate the value: 0<sup>${exp}</sup>`,
      correctAnswer: '0',
      solution: locale === 'el'
        ? `Το μηδέν υψωμένο σε οποιονδήποτε θετικό φυσικό εκθέτη ισούται με 0.`
        : `Zero raised to any positive natural exponent equals 0.`,
    };
  },

  // 16. Υπολογισμός παράστασης με δυνάμεις (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΙΘΜΗΤΙΚΗ ΠΑΡΑΣΤΑΣΗ' : 'NUMERICAL EXPRESSION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης: (－2)<sup>3</sup> ＋ (－1)<sup>4</sup>`
        : `Calculate the value of the expression: (－2)<sup>3</sup> ＋ (－1)<sup>4</sup>`,
      correctAnswer: '-7',
      solution: locale === 'el'
        ? `(－2)<sup>3</sup> ＝ －8 και (－1)<sup>4</sup> ＝ ＋1. Άρα: (－8) ＋ 1 ＝ －7.`
        : `(－2)<sup>3</sup> ＝ －8 and (－1)<sup>4</sup> ＝ ＋1. Thus: (－8) ＋ 1 ＝ －7.`,
    };
  },

  // 17. Δύναμη αρνητικού δεκαδικού με άρτιο εκθέτη (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟΣ ΔΕΚΑΔΙΚΟΣ (ΑΡΤΙΟΣ)' : 'NEGATIVE DECIMAL (EVEN)',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: (－0,5)<sup>2</sup>`
        : `Calculate the value: (－0.5)<sup>2</sup>`,
      correctAnswer: locale === 'el' ? '0,25' : '0.25',
      solution: locale === 'el'
        ? `Ο εκθέτης είναι άρτιος, άρα το πρόσημο γίνεται θετικό: (－0,5) · (－0,5) ＝ ＋0,25.`
        : `The exponent is even, so the sign becomes positive: (－0.5) · (－0.5) ＝ ＋0.25.`,
    };
  },

  // 18. Σύγκριση δυνάμεων (MCQ)
  (locale) => {
    const correct = '(－2)<sup>2</sup> ＞ －2<sup>2</sup>';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΓΚΡΙΣΗ ΔΥΝΑΜΕΩΝ' : 'COMPARING POWERS',
      question: locale === 'el'
        ? `Ποια σχέση ισχύει μεταξύ των αριθμών (－2)<sup>2</sup> και －2<sup>2</sup>;`
        : `Which relation holds between the numbers (－2)<sup>2</sup> and －2<sup>2</sup>?`,
      options: makeUniqueOptions(correct, [
        '(－2)<sup>2</sup> ＜ －2<sup>2</sup>',
        '(－2)<sup>2</sup> ＝ －2<sup>2</sup>',
        locale === 'el' ? 'Είναι και οι δύο ίσοι με το 0' : 'Both are equal to 0',
      ]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `(－2)<sup>2</sup> ＝ ＋4 ενώ －2<sup>2</sup> ＝ －4. Επειδή ＋4 ＞ －4, ισχύει ${correct}.`
        : `(－2)<sup>2</sup> ＝ ＋4 while －2<sup>2</sup> ＝ －4. Because ＋4 ＞ －4, ${correct} holds.`,
    };
  },

  // 19. Δύναμη πηλίκου με απλοποίηση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΥΝΑΜΗ ΠΗΛΙΚΟΥ' : 'POWER OF A QUOTIENT',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: (${htmlFrac(6, 3)})<sup>2</sup>`
        : `Calculate the value: (${htmlFrac(6, 3)})<sup>2</sup>`,
      correctAnswer: '4',
      solution: locale === 'el'
        ? `${htmlFrac(6, 3)} ＝ 2. Επομένως: 2<sup>2</sup> ＝ 4.`
        : `${htmlFrac(6, 3)} ＝ 2. Therefore: 2<sup>2</sup> ＝ 4.`,
    };
  },

  // 20. Ανάποδη εφαρμογή ιδιότητας κοινού εκθέτη (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΚΟΙΝΟΣ ΕΚΘΕΤΗΣ' : 'COMMON EXPONENT',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης: 2<sup>3</sup> · 5<sup>3</sup>`
        : `Calculate the value of the expression: 2<sup>3</sup> · 5<sup>3</sup>`,
      correctAnswer: '1000',
      solution: locale === 'el'
        ? `Εφαρμόζουμε την ιδιότητα κοινού εκθέτη: 2<sup>3</sup> · 5<sup>3</sup> ＝ (2 · 5)<sup>3</sup> ＝ 10<sup>3</sup> ＝ 1.000.`
        : `Apply the common exponent property: 2<sup>3</sup> · 5<sup>3</sup> ＝ (2 · 5)<sup>3</sup> ＝ 10<sup>3</sup> ＝ 1,000.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΔΥΝΑΜΕΩΝ ΡΗΤΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Εμβαδόν τετραγώνου με κλασματική πλευρά
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ένα τετράγωνο έχει πλευρά μήκους ${htmlFrac(3, 4)} του μέτρου. Ποιο είναι το εμβαδόν του σε τετραγωνικά μέτρα (σε ανάγωγο κλάσμα α/β);`
        : `A square has a side length of ${htmlFrac(3, 4)} meters. What is its area in square meters (irreducible fraction a/b)?`,
      correctAnswer: '9/16',
      solution: locale === 'el'
        ? `Εμβαδόν ＝ (πλευρά)<sup>2</sup> ＝ (${htmlFrac(3, 4)})<sup>2</sup> ＝ ${htmlFrac(9, 16)} τ.μ.`
        : `Area ＝ (side)<sup>2</sup> ＝ (${htmlFrac(3, 4)})<sup>2</sup> ＝ ${htmlFrac(9, 16)} m².`,
    };
  },

  // Πρόβλημα 2: Όγκος κύβου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ένας κύβος έχει ακμή 0,3 μέτρα. Ποιος είναι ο όγκος του σε κυβικά μέτρα;`
        : `A cube has an edge of 0.3 meters. What is its volume in cubic meters?`,
      correctAnswer: locale === 'el' ? '0,027' : '0.027',
      solution: locale === 'el'
        ? `Όγκος ＝ (ακμή)<sup>3</sup> ＝ 0,3<sup>3</sup> ＝ 0,3 · 0,3 · 0,3 ＝ 0,027 κ.μ.`
        : `Volume ＝ (edge)<sup>3</sup> ＝ 0.3<sup>3</sup> ＝ 0.3 · 0.3 · 0.3 ＝ 0.027 m³.`,
    };
  },

  // Πρόβλημα 3: Διπλασιασμός βακτηρίων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΙΟΛΟΓΙΑ' : 'PROBLEMS: BIOLOGY',
      question: locale === 'el'
        ? `Ένας πληθυσμός βακτηρίων διπλασιάζεται κάθε ώρα (δηλαδή πολλαπλασιάζεται επί 2). Αν αρχικά υπάρχει 1 βακτήριο, πόσα βακτήρια θα υπάρχουν μετά από 6 ώρες (2<sup>6</sup>);`
        : `A bacterial population doubles every hour (multiplied by 2). If there is initially 1 bacterium, how many bacteria will exist after 6 hours (2<sup>6</sup>)?`,
      correctAnswer: '64',
      solution: locale === 'el'
        ? `2<sup>6</sup> ＝ 64 βακτήρια.`
        : `2<sup>6</sup> ＝ 64 bacteria.`,
    };
  },

  // Πρόβλημα 4: Εμβαδόν τετραγωνικού πλακιδίου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ' : 'PROBLEMS: CONSTRUCTION',
      question: locale === 'el'
        ? `Ένα τετραγωνικό πλακάκι έχει πλευρά 0,5 m. Ποιο είναι το εμβαδόν του σε τετραγωνικά μέτρα;`
        : `A square tile has a side of 0.5 m. What is its area in square meters?`,
      correctAnswer: locale === 'el' ? '0,25' : '0.25',
      solution: locale === 'el'
        ? `Εμβαδόν ＝ 0,5<sup>2</sup> ＝ 0,25 τ.μ.`
        : `Area ＝ 0.5<sup>2</sup> ＝ 0.25 m².`,
    };
  },

  // Πρόβλημα 5: Τριπλασιασμός διαμοιρασμού πληροφορίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΔΙΚΤΥΑ' : 'PROBLEMS: NETWORKS',
      question: locale === 'el'
        ? `Ένα μήνυμα προωθείται σε 3 άτομα στον 1ο γύρο, καθένα από αυτά το στέλνει σε άλλα 3 στον 2ο γύρο κ.ο.κ. Πόσα άτομα θα λάβουν το μήνυμα στον 4ο γύρο (3<sup>4</sup>);`
        : `A message is forwarded to 3 people in the 1st round, each sends it to 3 others in the 2nd round, and so on. How many people will receive it in the 4th round (3<sup>4</sup>)?`,
      correctAnswer: '81',
      solution: locale === 'el'
        ? `3<sup>4</sup> ＝ 81 άτομα.`
        : `3<sup>4</sup> ＝ 81 people.`,
    };
  },

  // Πρόβλημα 6: Όγκος κύβου με κλάσμα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ένα κυβικό κουτί έχει ακμή ${htmlFrac(1, 2)} του μέτρου. Ποιος είναι ο όγκος του σε κυβικά μέτρα (σε ανάγωγο κλάσμα α/β);`
        : `A cubic box has an edge of ${htmlFrac(1, 2)} meters. What is its volume in cubic meters (irreducible fraction a/b)?`,
      correctAnswer: '1/8',
      solution: locale === 'el'
        ? `(${htmlFrac(1, 2)})<sup>3</sup> ＝ ${htmlFrac('1<sup>3</sup>', '2<sup>3</sup>')} ＝ ${htmlFrac(1, 8)} κ.μ.`
        : `(${htmlFrac(1, 2)})<sup>3</sup> ＝ ${htmlFrac('1<sup>3</sup>', '2<sup>3</sup>')} ＝ ${htmlFrac(1, 8)} m³.`,
    };
  },

  // Πρόβλημα 7: Ψηφιακή αποθήκευση (δυνάμεις του 2)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΠΛΗΡΟΦΟΡΙΚΗ' : 'PROBLEMS: COMPUTER SCIENCE',
      question: locale === 'el'
        ? `Στην πληροφορική, 1 Byte αποτελείται από 8 bit, τα οποία μπορούν να αναπαραστήσουν 2<sup>8</sup> διαφορετικές τιμές. Πόσες τιμές είναι αυτές;`
        : `In computer science, 1 Byte consists of 8 bits, which can represent 2<sup>8</sup> distinct values. How many values is that?`,
      correctAnswer: '256',
      solution: locale === 'el'
        ? `2<sup>8</sup> ＝ 256 τιμές.`
        : `2<sup>8</sup> ＝ 256 values.`,
    };
  },

  // Πρόβλημα 8: Απομείωση ραδιενεργού υλικού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΙΚΗ' : 'PROBLEMS: PHYSICS',
      question: locale === 'el'
        ? `Μια ποσότητα υλικού υποδιπλασιάζεται κάθε ημέρα (πολλαπλασιάζεται επί 1/2). Ποιο κλάσμα της αρχικής ποσότητας θα απομείνει μετά από 4 ημέρες (δηλαδή (${htmlFrac(1, 2)})<sup>4</sup>);`
        : `A quantity of material halves every day (multiplied by 1/2). What fraction of the initial quantity remains after 4 days (i.e. (${htmlFrac(1, 2)})<sup>4</sup>)?`,
      correctAnswer: '1/16',
      solution: locale === 'el'
        ? `(${htmlFrac(1, 2)})<sup>4</sup> ＝ ${htmlFrac(1, 16)}.`
        : `(${htmlFrac(1, 2)})<sup>4</sup> ＝ ${htmlFrac(1, 16)}.`,
    };
  },

  // Πρόβλημα 9: Εμβαδόν τετραγώνου με πλευρά δεκαδικό
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ένα τετράγωνο χωράφι έχει πλευρά 1,2 km. Ποιο είναι το εμβαδόν του σε τετραγωνικά χιλιόμετρα;`
        : `A square field has a side of 1.2 km. What is its area in square kilometers?`,
      correctAnswer: locale === 'el' ? '1,44' : '1.44',
      solution: locale === 'el'
        ? `1,2<sup>2</sup> ＝ 1,44 τ.χλμ.`
        : `1.2<sup>2</sup> ＝ 1.44 km².`,
    };
  },

  // Πρόβλημα 10: Δέντρο τουρνουά νοκ-άουτ
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ' : 'PROBLEMS: SPORTS',
      question: locale === 'el'
        ? `Σε ένα τουρνουά τένις υπάρχουν 5 γύροι νοκ-άουτ μέχρι τον τελικό. Πόσοι αθλητές ξεκίνησαν συνολικά στο ταμπλό αν στον 1ο γύρο αγωνίζονται 2<sup>5</sup> παίκτες;`
        : `In a tennis tournament, there are 5 knockout rounds until the final. How many athletes started on the board if 2<sup>5</sup> players compete in the 1st round?`,
      correctAnswer: '32',
      solution: locale === 'el'
        ? `2<sup>5</sup> ＝ 32 αθλητές.`
        : `2<sup>5</sup> ＝ 32 athletes.`,
    };
  },

  // Πρόβλημα 11: Εμβαδόν τετραγώνου με πλευρά 5/2
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Μια τετράγωνη επιφάνεια έχει πλευρά ${htmlFrac(5, 2)} μέτρα. Ποιο είναι το εμβαδόν της σε τετραγωνικά μέτρα (σε ανάγωγο κλάσμα α/β);`
        : `A square surface has a side of ${htmlFrac(5, 2)} meters. What is its area in square meters (irreducible fraction a/b)?`,
      correctAnswer: '25/4',
      solution: locale === 'el'
        ? `(${htmlFrac(5, 2)})<sup>2</sup> ＝ ${htmlFrac(25, 4)} τ.μ.`
        : `(${htmlFrac(5, 2)})<sup>2</sup> ＝ ${htmlFrac(25, 4)} m².`,
    };
  },

  // Πρόβλημα 12: Αλυσίδα τηλεφωνικών κλήσεων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΠΙΚΟΙΝΩΝΙΑ' : 'PROBLEMS: COMMUNICATION',
      question: locale === 'el'
        ? `Ένας μαθητής ειδοποιεί 4 συμμαθητές του, και καθένας από αυτούς άλλους 4 στο επόμενο στάδιο. Πόσοι μαθητές θα ειδοποιηθούν στο 3ο στάδιο (4<sup>3</sup>);`
        : `A student notifies 4 classmates, and each of them notifies 4 more in the next stage. How many students will be notified in the 3rd stage (4<sup>3</sup>)?`,
      correctAnswer: '64',
      solution: locale === 'el'
        ? `4<sup>3</sup> ＝ 64 μαθητές.`
        : `4<sup>3</sup> ＝ 64 students.`,
    };
  },

  // Πρόβλημα 13: Όγκος μικρού κυβικού ζαριού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΠΑΙΧΝΙΔΙΑ' : 'PROBLEMS: GAMES',
      question: locale === 'el'
        ? `Ένα ζάρι έχει ακμή 0,2 dm. Ποιος είναι ο όγκος του σε κυβικά δέκατα (dm<sup>3</sup>);`
        : `A die has an edge of 0.2 dm. What is its volume in cubic decimeters (dm<sup>3</sup>)?`,
      correctAnswer: locale === 'el' ? '0,008' : '0.008',
      solution: locale === 'el'
        ? `0,2<sup>3</sup> ＝ 0,008 dm<sup>3</sup>.`
        : `0.2<sup>3</sup> ＝ 0.008 dm<sup>3</sup>.`,
    };
  },

  // Πρόβλημα 14: Πιθανοί συνδυασμοί κωδικού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΔΥΑΣΤΙΚΗ' : 'PROBLEMS: COMBINATORICS',
      question: locale === 'el'
        ? `Ένα ψηφιακό λουκέτο έχει 3 ρόδες, καθεμία από τις οποίες έχει τα 10 ψηφία 0-9. Πόσοι είναι οι συνολικοί δυνατοί συνδυασμοί (10<sup>3</sup>);`
        : `A combination padlock has 3 wheels, each with 10 digits 0-9. How many possible combinations are there in total (10<sup>3</sup>)?`,
      correctAnswer: '1000',
      solution: locale === 'el'
        ? `10<sup>3</sup> ＝ 1.000 διαφορετικοί συνδυασμοί.`
        : `10<sup>3</sup> ＝ 1,000 different combinations.`,
    };
  },

  // Πρόβλημα 15: Εμβαδόν τετραγώνου με πλευρά 0,8
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ποιο είναι το εμβαδόν τετραγώνου με πλευρά 0,8 m σε τετραγωνικά μέτρα;`
        : `What is the area of a square with a side of 0.8 m in square meters?`,
      correctAnswer: locale === 'el' ? '0,64' : '0.64',
      solution: locale === 'el'
        ? `0,8<sup>2</sup> ＝ 0,64 τ.μ.`
        : `0.8<sup>2</sup> ＝ 0.64 m².`,
    };
  },

  // Πρόβλημα 16: Αύξηση επένδυσης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'PROBLEMS: FINANCE',
      question: locale === 'el'
        ? `Μια επένδυση αυξάνεται κάθε χρόνο με συντελεστή 1,1. Ποιος είναι ο συνολικός συντελεστής αύξησης μετά από 2 χρόνια (1,1<sup>2</sup>);`
        : `An investment grows each year by a factor of 1.1. What is the total growth factor after 2 years (1.1<sup>2</sup>)?`,
      correctAnswer: locale === 'el' ? '1,21' : '1.21',
      solution: locale === 'el'
        ? `1,1<sup>2</sup> ＝ 1,21.`
        : `1.1<sup>2</sup> ＝ 1.21.`,
    };
  },

  // Πρόβλημα 17: Κλασματικό εμβαδόν
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ένα τετράγωνο έχει πλευρά ${htmlFrac(2, 5)} του μέτρου. Ποιο είναι το εμβαδόν του σε τετραγωνικά μέτρα (σε ανάγωγο κλάσμα α/β);`
        : `A square has a side of ${htmlFrac(2, 5)} meters. What is its area in square meters (irreducible fraction a/b)?`,
      correctAnswer: '4/25',
      solution: locale === 'el'
        ? `(${htmlFrac(2, 5)})<sup>2</sup> ＝ ${htmlFrac(4, 25)} τ.μ.`
        : `(${htmlFrac(2, 5)})<sup>2</sup> ＝ ${htmlFrac(4, 25)} m².`,
    };
  },

  // Πρόβλημα 18: Διπλασιασμός διπλώματος χαρτιού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΑΡΤΙ' : 'PROBLEMS: PAPER',
      question: locale === 'el'
        ? `Αν διπλώσουμε ένα φύλλο χαρτί στη μέση 5 φορές, σε πόσα στρώματα πάχους θα χωριστεί (2<sup>5</sup>);`
        : `If we fold a sheet of paper in half 5 times, how many layers thick will it become (2<sup>5</sup>)?`,
      correctAnswer: '32',
      solution: locale === 'el'
        ? `2<sup>5</sup> ＝ 32 στρώματα.`
        : `2<sup>5</sup> ＝ 32 layers.`,
    };
  },

  // Πρόβλημα 19: Όγκος κύβου με ακμή 4
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ένας κύβος έχει ακμή 4 cm. Ποιος είναι ο όγκος του σε cm<sup>3</sup>;`
        : `A cube has an edge of 4 cm. What is its volume in cm<sup>3</sup>;`,
      correctAnswer: '64',
      solution: locale === 'el'
        ? `4<sup>3</sup> ＝ 64 cm<sup>3</sup>.`
        : `4<sup>3</sup> ＝ 64 cm<sup>3</sup>.`,
    };
  },

  // Πρόβλημα 20: Δύναμη του 10 σε επιστημονική μέτρηση
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ' : 'PROBLEMS: MEASUREMENTS',
      question: locale === 'el'
        ? `Ένα χιλιόμετρο ισούται με 10<sup>3</sup> μέτρα και 1 μέτρο με 10<sup>3</sup> χιλιοστά. Πόσα χιλιοστά έχει ένα χιλιόμετρο (10<sup>3</sup> · 10<sup>3</sup> ＝ 10<sup>6</sup>);`
        : `One kilometer equals 10<sup>3</sup> meters and 1 meter equals 10<sup>3</sup> millimeters. How many millimeters are in one kilometer (10<sup>3</sup> · 10<sup>3</sup> ＝ 10<sup>6</sup>)?`,
      correctAnswer: '1000000',
      solution: locale === 'el'
        ? `10<sup>3</sup> · 10<sup>3</sup> ＝ 10<sup>6</sup> ＝ 1.000.000 χιλιοστά.`
        : `10<sup>3</sup> · 10<sup>3</sup> ＝ 10<sup>6</sup> ＝ 1,000,000 millimeters.`,
    };
  },
];

export default function DinamiRitonAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Συγκεντρωτικό λεξικό UI
  const t = {
    el: {
      pageTitle: "Ασκήσεις: Δυνάμεις Ρητών με Θετικό Εκθέτη | Α' Γυμνασίου",
      pageDesc: "12 δυναμικές ασκήσεις και προβλήματα στις δυνάμεις ρητών αριθμών και τις ιδιότητές τους για την Α' Γυμνασίου.",
      backText: "Α' Γυμνασίου",
      btnTheory: "ΘΕΩΡΙΑ",
      badgeHeader: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 17 • ΕΞΑΣΚΗΣΗ",
      mainTitle: "Δυνάμεις Ρητών Αριθμών",
      mainSubtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις/ιδιότητες δυνάμεων ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
      problemBadge: "ΠΡΟΒΛΗΜΑ",
      placeholderInput: "π.χ. -8 ή 9/16",
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
      pageTitle: "Exercises: Powers of Rational Numbers with Positive Exponent | 7th Grade",
      pageDesc: "12 dynamic exercises and problems on powers of rational numbers and their properties for 7th Grade.",
      backText: "7th Grade",
      btnTheory: "THEORY",
      badgeHeader: "7TH GRADE • CHAPTER 17 • PRACTICE",
      mainTitle: "Powers of Rational Numbers",
      mainSubtitle: "Solve the 12 selected exercises below (10 power operations/properties ＋ 2 real-world problems). Click 'CHECK ANSWERS' at the end to see your score and detailed solutions.",
      problemBadge: "PROBLEM",
      placeholderInput: "e.g. -8 or 9/16",
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

      // Ανοχή σε δεκαδικούς ελέγχους
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
          href="/a-gymnasiou/19-dinami-riton-ekth-thetikos"
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
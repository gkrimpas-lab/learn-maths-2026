import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός κεφαλαίων: άτονα παντού εκτός από το "Α'"
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

const lcm = (a, b) => {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
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

// Helper για responsive κατακόρυφη κλασματική γραφή σε HTML string
const htmlFrac = (num, den, isNeg = false) => {
  const numericNeg = (typeof num === 'number' && num < 0) || (typeof den === 'number' && den < 0);
  const showMinus = isNeg || numericNeg;
  const absNum = typeof num === 'number' ? Math.abs(num) : num.toString().replace(/^-/, '');
  const absDen = typeof den === 'number' ? Math.abs(den) : den.toString().replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 sm:gap-1 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">${
    showMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${absNum}</span><span class="pt-0.5 px-0.5 sm:px-1 break-all">${absDen}</span></span></span>`;
};

// Συγκεντρωτικό Λεξικό Μεταφράσεων i18n
const translations = {
  el: {
    pageTitle: "Ασκήσεις: Αφαίρεση Ρητών Αριθμών | Α' Γυμνασίου",
    pageDesc: "12 δυναμικές ασκήσεις και προβλήματα στην αφαίρεση ομόσημων και ετερόσημων ρητών αριθμών (κλάσματα και δεκαδικοί).",
    backText: "Α' Γυμνασίου",
    btnTheory: "ΘΕΩΡΙΑ",
    badgeChapter: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 15 • ΕΞΑΣΚΗΣΗ",
    titleMain: "Αφαίρεση Ρητών Αριθμών",
    descMain: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία αφαίρεσης ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    badgeProblem: "ΠΡΟΒΛΗΜΑ",
    placeholderInput: "π.χ. 1/4 ή -2,5",
    correctLabel: "ΣΩΣΤΟ",
    wrongLabel: "ΛΑΘΟΣ",
    correctAnswerText: "ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:",
    btnSubmit: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
    btnNewExercises: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    btnRetry: "ΕΠΑΝΑΛΗΨΗ",
    scoreFinal: "ΤΕΛΙΚΟ ΣΚΟΡ",
    scoreProgress: "ΠΡΟΟΔΟΣ",
    scoreSuccess: "ΕΠΙΤΥΧΙΑ",
    btnCheckShort: "ΕΛΕΓΧΟΣ",
  },
  en: {
    pageTitle: "Exercises: Subtraction of Rational Numbers | Grade 7",
    pageDesc: "12 dynamic exercises and word problems on subtracting rational numbers with like and unlike signs (fractions and decimals).",
    backText: "Grade 7",
    btnTheory: "THEORY",
    badgeChapter: "GRADE 7 • CHAPTER 15 • PRACTICE",
    titleMain: "Subtraction of Rational Numbers",
    descMain: "Solve the following 12 selected exercises (10 calculation/theory questions ＋ 2 real-life word problems). Click «CHECK ANSWERS» to view your score and detailed solutions.",
    badgeProblem: "PROBLEM",
    placeholderInput: "e.g. 1/4 or -2.5",
    correctLabel: "CORRECT",
    wrongLabel: "INCORRECT",
    correctAnswerText: "CORRECT ANSWER:",
    btnSubmit: "CHECK ANSWERS",
    btnNewExercises: "NEW EXERCISES",
    btnRetry: "RETRY",
    scoreFinal: "FINAL SCORE",
    scoreProgress: "PROGRESS",
    scoreSuccess: "SCORE",
    btnCheckShort: "CHECK",
  }
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ ΑΦΑΙΡΕΣΗΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Αφαίρεση ομώνυμων θετικών κλασμάτων (Input)
  (locale) => {
    const den = randInt(5, 9);
    const n1 = randInt(4, 7);
    const n2 = randInt(1, 3);
    const diffN = n1 - n2;
    const g = gcd(diffN, den);
    const finalN = diffN / g;
    const finalD = den / g;
    const ansStr = finalD === 1 ? `${finalN}` : `${finalN}/${finalD}`;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΟΜΩΝΥΜΑ ΚΛΑΣΜΑΤΑ' : 'LIKE FRACTIONS',
      question: locale === 'el'
        ? `Υπολόγισε τη διαφορά σε ανάγωγο κλάσμα: (${htmlFrac(n1, den)}) － (${htmlFrac(n2, den)})`
        : `Calculate the difference as an irreducible fraction: (${htmlFrac(n1, den)}) － (${htmlFrac(n2, den)})`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `Διατηρούμε τον κοινό παρονομαστή και αφαιρούμε τους αριθμητές: (${n1} － ${n2}) / ${den} ＝ ${htmlFrac(diffN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)} μετά από διαίρεση με το ${g}` : ''}.`
        : `Keep the common denominator and subtract numerators: (${n1} － ${n2}) / ${den} ＝ ${htmlFrac(diffN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)} after dividing by ${g}` : ''}.`,
    };
  },

  // 2. Αφαίρεση αρνητικού από θετικό (διπλό μείον) (Input)
  (locale) => {
    const den = randInt(4, 8);
    const n1 = randInt(1, 3);
    const n2 = randInt(1, 3);
    const diffN = n1 + n2;
    const g = gcd(diffN, den);
    const finalN = diffN / g;
    const finalD = den / g;
    const ansStr = finalD === 1 ? `${finalN}` : `${finalN}/${finalD}`;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΦΑΙΡΕΣΗ ΑΡΝΗΤΙΚΟΥ' : 'SUBTRACTING NEGATIVE',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγη μορφή: (${htmlFrac(n1, den)}) － (${htmlFrac(-n2, den)})`
        : `Calculate in irreducible form: (${htmlFrac(n1, den)}) － (${htmlFrac(-n2, den)})`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `Η αφαίρεση αρνητικού μετατρέπεται σε πρόσθεση: (${htmlFrac(n1, den)}) ＋ (${htmlFrac(n2, den)}) ＝ ${htmlFrac(diffN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)}` : ''}.`
        : `Subtracting a negative converts to addition: (${htmlFrac(n1, den)}) ＋ (${htmlFrac(n2, den)}) ＝ ${htmlFrac(diffN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)}` : ''}.`,
    };
  },

  // 3. Αφαίρεση αρνητικού από αρνητικό (Input)
  (locale) => {
    const den = randInt(5, 10);
    const n1 = 5;
    const n2 = 2;
    const diffN = -3;
    const g = gcd(Math.abs(diffN), den);
    const finalN = diffN / g;
    const finalD = den / g;
    const ansStr = finalD === 1 ? `${finalN}` : `${finalN}/${finalD}`;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΑ ΟΜΩΝΥΜΑ' : 'NEGATIVE LIKE FRACTIONS',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγη μορφή: (${htmlFrac(-n1, den)}) － (${htmlFrac(-n2, den)})`
        : `Calculate in irreducible form: (${htmlFrac(-n1, den)}) － (${htmlFrac(-n2, den)})`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `(${htmlFrac(-n1, den)}) － (${htmlFrac(-n2, den)}) ＝ (${htmlFrac(-n1, den)}) ＋ (${htmlFrac(n2, den)}) ＝ (－${n1} ＋ ${n2}) / ${den} ＝ ${htmlFrac(diffN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)}` : ''}.`
        : `(${htmlFrac(-n1, den)}) － (${htmlFrac(-n2, den)}) ＝ (${htmlFrac(-n1, den)}) ＋ (${htmlFrac(n2, den)}) ＝ (－${n1} ＋ ${n2}) / ${den} ＝ ${htmlFrac(diffN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)}` : ''}.`,
    };
  },

  // 4. Αφαίρεση απλών ετερώνυμων κλασμάτων (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ' : 'UNLIKE FRACTIONS',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(3, 4)}) － (${htmlFrac(1, 2)})`
        : `Calculate as an irreducible fraction: (${htmlFrac(3, 4)}) － (${htmlFrac(1, 2)})`,
      correctAnswer: '1/4',
      solution: locale === 'el'
        ? `ΕΚΠ(4, 2) ＝ 4. Μετατρέπουμε σε ομώνυμα με πολλαπλασιασμό των όρων: ${htmlFrac(3, 4)} － ${htmlFrac(2, 4)} ＝ ${htmlFrac(1, 4)}.`
        : `LCM(4, 2) ＝ 4. Convert to like fractions: ${htmlFrac(3, 4)} － ${htmlFrac(2, 4)} ＝ ${htmlFrac(1, 4)}.`,
    };
  },

  // 5. Αφαίρεση ετερώνυμων με ΕΚΠ 6 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ' : 'UNLIKE FRACTIONS',
      question: locale === 'el'
        ? `Υπολόγισε τη διαφορά σε ανάγωγη μορφή: (${htmlFrac(5, 6)}) － (${htmlFrac(2, 3)})`
        : `Calculate the difference in irreducible form: (${htmlFrac(5, 6)}) － (${htmlFrac(2, 3)})`,
      correctAnswer: '1/6',
      solution: locale === 'el'
        ? `ΕΚΠ(6, 3) ＝ 6. ${htmlFrac(5, 6)} － ${htmlFrac(4, 6)} ＝ ${htmlFrac(1, 6)}.`
        : `LCM(6, 3) ＝ 6. ${htmlFrac(5, 6)} － ${htmlFrac(4, 6)} ＝ ${htmlFrac(1, 6)}.`,
    };
  },

  // 6. Αφαίρεση ίσων κλασμάτων (Input)
  (locale) => {
    const a = randInt(3, 8);
    const b = randInt(9, 15);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΦΑΙΡΕΣΗ ΙΣΩΝ ΟΡΩΝ' : 'SUBTRACTING EQUAL TERMS',
      question: locale === 'el'
        ? `Ποιο είναι το αποτέλεσμα: (${htmlFrac(a, b)}) － (${htmlFrac(a, b)});`
        : `What is the result: (${htmlFrac(a, b)}) － (${htmlFrac(a, b)})?`,
      correctAnswer: '0',
      solution: locale === 'el'
        ? `Η διαφορά δύο ίσων αριθμών ισούται πάντοτε με 0.`
        : `The difference between two equal numbers is always 0.`,
    };
  },

  // 7. Αφαίρεση δεκαδικών (θετικός μείον θετικός) (Input)
  (locale) => {
    const strA = (5.8).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    const strB = (2.3).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    const diffStr = (3.5).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΦΑΙΡΕΣΗ ΔΕΚΑΔΙΚΩΝ' : 'DECIMAL SUBTRACTION',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: (＋${strA}) － (＋${strB})`
        : `Calculate the result: (＋${strA}) － (＋${strB})`,
      correctAnswer: diffStr,
      solution: locale === 'el'
        ? `${strA} － ${strB} ＝ ${diffStr}.`
        : `${strA} － ${strB} ＝ ${diffStr}.`,
    };
  },

  // 8. Αφαίρεση αρνητικού δεκαδικού (Input)
  (locale) => {
    const strA = (3.2).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    const strB = (1.5).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    const diffStr = (4.7).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΟΣ ΜΕΙΟΝ ΑΡΝΗΤΙΚΟ' : 'DECIMAL MINUS NEGATIVE',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: (＋${strA}) － (－${strB})`
        : `Calculate the result: (＋${strA}) － (－${strB})`,
      correctAnswer: diffStr,
      solution: locale === 'el'
        ? `${strA} － (－${strB}) ＝ ${strA} ＋ ${strB} ＝ ${diffStr}.`
        : `${strA} － (－${strB}) ＝ ${strA} ＋ ${strB} ＝ ${diffStr}.`,
    };
  },

  // 9. Αφαίρεση θετικού δεκαδικού από αρνητικό (Input)
  (locale) => {
    const strA = (4.1).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    const strB = (2.6).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    const diffStr = (-6.7).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    const sumDigits = (6.7).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟΣ ΜΕΙΟΝ ΘΕΤΙΚΟ' : 'NEGATIVE MINUS POSITIVE',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: (－${strA}) － (＋${strB})`
        : `Calculate the result: (－${strA}) － (＋${strB})`,
      correctAnswer: diffStr,
      solution: locale === 'el'
        ? `(－${strA}) ＋ (－${strB}) ＝ －(${strA} ＋ ${strB}) ＝ －${sumDigits}.`
        : `(－${strA}) ＋ (－${strB}) ＝ －(${strA} ＋ ${strB}) ＝ －${sumDigits}.`,
    };
  },

  // 10. Θεωρητικός ορισμός της αφαίρεσης (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Ως πρόσθεση του μειωτέου με τον αντίθετο του αφαιρετέου: α ＋ (－β)'
      : 'As addition of the minuend with the opposite of the subtrahend: a ＋ (－b)';
    const wrong1 = locale === 'el' ? 'Ως πολλαπλασιασμός με τον αντίστροφο: α · (1/β)' : 'As multiplication with the reciprocal: a · (1/b)';
    const wrong2 = locale === 'el' ? 'Ως διαίρεση των δύο αριθμών: α : β' : 'As division of the two numbers: a : b';
    const wrong3 = locale === 'el' ? 'Ως διαφορά των απολύτων τιμών τους' : 'As the difference of their absolute values';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΟΡΙΣΜΟΣ ΑΦΑΙΡΕΣΗΣ' : 'DEFINITION OF SUBTRACTION',
      question: locale === 'el'
        ? `Πώς ορίζεται η αφαίρεση α － β στους ρητούς αριθμούς;`
        : `How is subtraction a － b defined for rational numbers?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Στους ρητούς αριθμούς η αφαίρεση είναι πρόσθεση με τον αντίθετο: α － β ＝ α ＋ (－β).`
        : `In rational numbers, subtraction is defined as adding the opposite: a － b ＝ a ＋ (－b).`,
    };
  },

  // 11. Αφαίρεση κλάσματος από το 1 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΦΑΙΡΕΣΗ ΑΠΟ ΤΗ ΜΟΝΑΔΑ' : 'SUBTRACTING FROM 1',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: 1 － (${htmlFrac(2, 5)})`
        : `Calculate as an irreducible fraction: 1 － (${htmlFrac(2, 5)})`,
      correctAnswer: '3/5',
      solution: locale === 'el'
        ? `1 ＝ ${htmlFrac(5, 5)}. Άρα: ${htmlFrac(5, 5)} － ${htmlFrac(2, 5)} ＝ ${htmlFrac(3, 5)}.`
        : `1 ＝ ${htmlFrac(5, 5)}. Thus: ${htmlFrac(5, 5)} － ${htmlFrac(2, 5)} ＝ ${htmlFrac(3, 5)}.`,
    };
  },

  // 12. Αφαίρεση με αποτέλεσμα αρνητικό κλάσμα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΦΑΙΡΕΣΗ ΜΕ ΑΡΝΗΤΙΚΟ ΑΠΟΤΕΛΕΣΜΑ' : 'SUBTRACTION WITH NEGATIVE RESULT',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: (${htmlFrac(1, 3)}) － (${htmlFrac(4, 3)})`
        : `Calculate the result: (${htmlFrac(1, 3)}) － (${htmlFrac(4, 3)})`,
      correctAnswer: '-1',
      solution: locale === 'el'
        ? `(1 － 4) / 3 ＝ －3 / 3 ＝ －1.`
        : `(1 － 4) / 3 ＝ －3 / 3 ＝ －1.`,
    };
  },

  // 13. Αφαίρεση του μηδενός (Input)
  (locale) => {
    const a = -4;
    const b = 7;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΦΑΙΡΕΣΗ ΜΗΔΕΝΟΣ' : 'SUBTRACTING ZERO',
      question: locale === 'el'
        ? `Ποιο είναι το αποτέλεσμα: (${htmlFrac(a, b)}) － 0;`
        : `What is the result: (${htmlFrac(a, b)}) － 0?`,
      correctAnswer: `${a}/${b}`,
      solution: locale === 'el'
        ? `Αν αφαιρέσουμε το μηδέν από οποιονδήποτε αριθμό, ο αριθμός παραμένει αμετάβλητος: ${htmlFrac(a, b)}.`
        : `Subtracting zero from any number leaves it unchanged: ${htmlFrac(a, b)}.`,
    };
  },

  // 14. Αφαίρεση από το μηδέν (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΦΑΙΡΕΣΗ ΑΠΟ ΤΟ ΜΗΔΕΝ' : 'SUBTRACTING FROM ZERO',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: 0 － (${htmlFrac(3, 5)})`
        : `Calculate the result: 0 － (${htmlFrac(3, 5)})`,
      correctAnswer: '-3/5',
      solution: locale === 'el'
        ? `0 － (${htmlFrac(3, 5)}) ＝ 0 ＋ (${htmlFrac(-3, 5)}) ＝ ${htmlFrac(-3, 5)}.`
        : `0 － (${htmlFrac(3, 5)}) ＝ 0 ＋ (${htmlFrac(-3, 5)}) ＝ ${htmlFrac(-3, 5)}.`,
    };
  },

  // 15. Κανόνας προσήμων παρένθεσης (MCQ)
  (locale) => {
    const correct = '＋α';
    const wrong1 = '－α';
    const wrong2 = '0';
    const wrong3 = '1';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΚΑΝΟΝΑΣ ΠΑΡΕΝΘΕΣΗΣ' : 'PARENTHESIS SIGN RULE',
      question: locale === 'el'
        ? `Σε ποιο από τα παρακάτω ισούται η παράσταση: －(－α);`
        : `Which expression is equivalent to: －(－a)?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Ο αντίθετος του αντίθετου αριθμού ισούται με τον αρχικό αριθμό: －(－α) ＝ ＋α.`
        : `The opposite of the opposite of a number equals the original number: －(－a) ＝ ＋a.`,
    };
  },

  // 16. Αφαίρεση ετερώνυμων με ΕΚΠ 12 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΤΕΡΩΝΥΜΑ & ΑΝΑΓΩΓΟ' : 'UNLIKE & IRREDUCIBLE',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(5, 12)}) － (${htmlFrac(1, 4)})`
        : `Calculate as an irreducible fraction: (${htmlFrac(5, 12)}) － (${htmlFrac(1, 4)})`,
      correctAnswer: '1/6',
      solution: locale === 'el'
        ? `ΕΚΠ(12, 4) ＝ 12. ${htmlFrac(5, 12)} － ${htmlFrac(3, 12)} ＝ ${htmlFrac(2, 12)} ＝ ${htmlFrac(1, 6)} μετά από διαίρεση με το 2.`
        : `LCM(12, 4) ＝ 12. ${htmlFrac(5, 12)} － ${htmlFrac(3, 12)} ＝ ${htmlFrac(2, 12)} ＝ ${htmlFrac(1, 6)} after dividing by 2.`,
    };
  },

  // 17. Αφαίρεση αρνητικών δεκαδικών με θετικό αποτέλεσμα (Input)
  (locale) => {
    const strA = (2.1).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    const strB = (5.4).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    const diffStr = (3.3).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟΙ ΔΕΚΑΔΙΚΟΙ' : 'NEGATIVE DECIMALS',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: (－${strA}) － (－${strB})`
        : `Calculate the result: (－${strA}) － (－${strB})`,
      correctAnswer: diffStr,
      solution: locale === 'el'
        ? `(－${strA}) ＋ ${strB} ＝ ${strB} － ${strA} ＝ ${diffStr}.`
        : `(－${strA}) ＋ ${strB} ＝ ${strB} － ${strA} ＝ ${diffStr}.`,
    };
  },

  // 18. Αντιμεταθετική ιδιότητα στην αφαίρεση (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Όχι, ισχύει γενικά α － β ＝ －(β － α)'
      : 'No, in general a － b ＝ －(b － a)';
    const wrong1 = locale === 'el' ? 'Ναι, ισχύει πάντοτε' : 'Yes, it always holds';
    const wrong2 = locale === 'el' ? 'Ισχύει μόνο όταν οι αριθμοί είναι θετικοί' : 'Holds only when numbers are positive';
    const wrong3 = locale === 'el' ? 'Ισχύει μόνο για ομώνυμα κλάσματα' : 'Holds only for like fractions';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ ΑΦΑΙΡΕΣΗΣ' : 'SUBTRACTION PROPERTIES',
      question: locale === 'el'
        ? `Ισχύει η αντιμεταθετική ιδιότητα στην αφαίρεση των ρητών αριθμών (δηλαδή α － β ＝ β － α);`
        : `Does the commutative property apply to subtraction of rationals (i.e. a － b ＝ b － a)?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Η αφαίρεση ΔΕΝ έχει αντιμεταθετική ιδιότητα. Τα αποτελέσματα α － β και β － α είναι αντίθετοι αριθμοί.`
        : `Subtraction is NOT commutative. The results a － b and b － a are opposite numbers.`,
    };
  },

  // 19. Αφαίρεση δεκαδικού από ακέραιο (Input)
  (locale) => {
    const strB = (1.4).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    const diffStr = (1.6).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΚΕΡΑΙΟΣ ΜΕΙΟΝ ΔΕΚΑΔΙΚΟ' : 'INTEGER MINUS DECIMAL',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: 3 － ${strB}`
        : `Calculate the result: 3 － ${strB}`,
      correctAnswer: diffStr,
      solution: locale === 'el'
        ? `3,0 － ${strB} ＝ ${diffStr}.`
        : `3.0 － ${strB} ＝ ${diffStr}.`,
    };
  },

  // 20. Αφαίρεση ετερώνυμων με αρνητικό μειωτέο (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΑ ΕΤΕΡΩΝΥΜΑ' : 'NEGATIVE UNLIKE FRACTIONS',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(-1, 2)}) － (${htmlFrac(1, 4)})`
        : `Calculate as an irreducible fraction: (${htmlFrac(-1, 2)}) － (${htmlFrac(1, 4)})`,
      correctAnswer: '-3/4',
      solution: locale === 'el'
        ? `ΕΚΠ(2, 4) ＝ 4. (${htmlFrac(-2, 4)}) ＋ (${htmlFrac(-1, 4)}) ＝ ${htmlFrac(-3, 4)}.`
        : `LCM(2, 4) ＝ 4. (${htmlFrac(-2, 4)}) ＋ (${htmlFrac(-1, 4)}) ＝ ${htmlFrac(-3, 4)}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΑΦΑΙΡΕΣΗΣ ΡΗΤΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Διαφορά θερμοκρασίας ημέρας και νύχτας
  (locale) => {
    const ansStr = (8.2).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ' : 'WORD PROBLEMS: TEMPERATURE',
      question: locale === 'el'
        ? `Το μεσημέρι η θερμοκρασία ήταν ＋6,4 °C και το βράδυ έπεσε στους －1,8 °C. Πόσους βαθμούς Κελσίου ήταν η πτώση (δηλαδή η διαφορά 6,4 － (－1,8));`
        : `At noon the temperature was ＋6.4 °C and at night it dropped to －1.8 °C. How many degrees Celsius was the drop (the difference 6.4 － (－1.8))?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `6,4 － (－1,8) ＝ 6,4 ＋ 1,8 ＝ ${ansStr} °C.`
        : `6.4 － (－1.8) ＝ 6.4 ＋ 1.8 ＝ ${ansStr} °C.`,
    };
  },

  // Πρόβλημα 2: Υπόλοιπο πίτσας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΡΙΔΙΑ' : 'WORD PROBLEMS: PORTIONS',
      question: locale === 'el'
        ? `Από μια ολόκληρη πίτσα (1) καταναλώθηκαν τα ${htmlFrac(5, 8)}. Ποιο κλάσμα της πίτσας απομένει (σε ανάγωγο κλάσμα);`
        : `From a whole pizza (1), ${htmlFrac(5, 8)} was consumed. What fraction of the pizza remains (irreducible fraction)?`,
      correctAnswer: '3/8',
      solution: locale === 'el'
        ? `1 － ${htmlFrac(5, 8)} ＝ ${htmlFrac(8, 8)} － ${htmlFrac(5, 8)} ＝ ${htmlFrac(3, 8)}.`
        : `1 － ${htmlFrac(5, 8)} ＝ ${htmlFrac(8, 8)} － ${htmlFrac(5, 8)} ＝ ${htmlFrac(3, 8)}.`,
    };
  },

  // Πρόβλημα 3: Διαφορά υψομέτρου
  (locale) => {
    const ansStr = (892.8).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΥΨΟΜΕΤΡΑ' : 'WORD PROBLEMS: ALTITUDE',
      question: locale === 'el'
        ? `Μια κορυφή βουνού βρίσκεται σε υψόμετρο ＋850,5 m και ένα υπόγειο σπήλαιο σε υψόμετρο －42,3 m. Ποια είναι η υψομετρική διαφορά τους σε μέτρα;`
        : `A mountain peak is at ＋850.5 m and an underground cave at －42.3 m. What is their altitude difference in meters?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `850,5 － (－42,3) ＝ 850,5 ＋ 42,3 ＝ ${ansStr} m.`
        : `850.5 － (－42.3) ＝ 850.5 ＋ 42.3 ＝ ${ansStr} m.`,
    };
  },

  // Πρόβλημα 4: Κατανάλωση υφάσματος
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ' : 'WORD PROBLEMS: MEASUREMENTS',
      question: locale === 'el'
        ? `Ένα τόπι ύφασμα είχε μήκος ${htmlFrac(7, 4)} m και κόπηκε κομμάτι ${htmlFrac(2, 3)} m. Πόσα μέτρα ύφασμα απέμειναν (σε ανάγωγο κλάσμα);`
        : `A roll of fabric was ${htmlFrac(7, 4)} m long and a piece of ${htmlFrac(2, 3)} m was cut. How many meters remain (irreducible fraction)?`,
      correctAnswer: '13/12',
      solution: locale === 'el'
        ? `ΕΚΠ(4, 3) ＝ 12. ${htmlFrac(21, 12)} － ${htmlFrac(8, 12)} ＝ ${htmlFrac(13, 12)} m.`
        : `LCM(4, 3) ＝ 12. ${htmlFrac(21, 12)} － ${htmlFrac(8, 12)} ＝ ${htmlFrac(13, 12)} m.`,
    };
  },

  // Πρόβλημα 5: Τραπεζική ανάληψη
  (locale) => {
    const ansStr = (-14.4).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'WORD PROBLEMS: FINANCE',
      question: locale === 'el'
        ? `Ένας λογαριασμός είχε 85,60 € και έγινε ανάληψη 100,00 €. Ποιο είναι το νέο αρνητικό υπόλοιπο του λογαριασμού (85,6 － 100);`
        : `A bank account had 85.60 € and a withdrawal of 100.00 € occurred. What is the new negative balance (85.6 － 100)?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `85,6 － 100 ＝ ${ansStr} €.`
        : `85.6 － 100 ＝ ${ansStr} €.`,
    };
  },

  // Πρόβλημα 6: Διαφορά χρόνου σε αγώνα
  (locale) => {
    const ansStr = (0.55).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 2 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ' : 'WORD PROBLEMS: SPORTS',
      question: locale === 'el'
        ? `Ο νικητής τερμάτισε σε 14,25 δευτερόλεπτα και ο δεύτερος σε 14,80. Ποια ήταν η διαφορά χρόνου σε δευτερόλεπτα (14,80 － 14,25);`
        : `The winner finished in 14.25 seconds and the runner-up in 14.80. What was their time difference in seconds (14.80 － 14.25)?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `14,80 － 14,25 ＝ ${ansStr} δευτερόλεπτα.`
        : `14.80 － 14.25 ＝ ${ansStr} seconds.`,
    };
  },

  // Πρόβλημα 7: Υπόλοιπο δεξαμενής πετρελαίου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ' : 'WORD PROBLEMS: CAPACITY',
      question: locale === 'el'
        ? `Μια δεξαμενή ήταν γεμάτη κατά τα ${htmlFrac(5, 6)} και καταναλώθηκαν τα ${htmlFrac(1, 4)}. Ποιο κλάσμα της δεξαμενής απομένει (σε ανάγωγο κλάσμα);`
        : `A fuel tank was ${htmlFrac(5, 6)} full and ${htmlFrac(1, 4)} was consumed. What fraction of the tank remains (irreducible fraction)?`,
      correctAnswer: '7/12',
      solution: locale === 'el'
        ? `ΕΚΠ(6, 4) ＝ 12. ${htmlFrac(10, 12)} － ${htmlFrac(3, 12)} ＝ ${htmlFrac(7, 12)}.`
        : `LCM(6, 4) ＝ 12. ${htmlFrac(10, 12)} － ${htmlFrac(3, 12)} ＝ ${htmlFrac(7, 12)}.`,
    };
  },

  // Πρόβλημα 8: Διαφορά βάρους
  (locale) => {
    const ansStr = (1.45).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 2 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΡΟΣ' : 'WORD PROBLEMS: WEIGHT',
      question: locale === 'el'
        ? `Ένα δέμα ζυγίζει 4,2 kg και ένα άλλο 2,75 kg. Πόσο βαρύτερο είναι το πρώτο δέμα σε kg;`
        : `One parcel weighs 4.2 kg and another 2.75 kg. How much heavier is the first parcel in kg?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `4,20 － 2,75 ＝ ${ansStr} kg.`
        : `4.20 － 2.75 ＝ ${ansStr} kg.`,
    };
  },

  // Πρόβλημα 9: Υπολειπόμενη διαδρομή
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΣΤΑΣΕΙΣ' : 'WORD PROBLEMS: DISTANCES',
      question: locale === 'el'
        ? `Ένας πεζοπόρος πρέπει να διανύσει ${htmlFrac(9, 10)} km και έχει ήδη περπατήσει ${htmlFrac(2, 5)} km. Πόσο του απομένει (σε ανάγωγο κλάσμα);`
        : `A hiker needs to cover ${htmlFrac(9, 10)} km and has walked ${htmlFrac(2, 5)} km. How much distance remains (irreducible fraction)?`,
      correctAnswer: '1/2',
      solution: locale === 'el'
        ? `${htmlFrac(9, 10)} － ${htmlFrac(4, 10)} ＝ ${htmlFrac(5, 10)} ＝ ${htmlFrac(1, 2)} km.`
        : `${htmlFrac(9, 10)} － ${htmlFrac(4, 10)} ＝ ${htmlFrac(5, 10)} ＝ ${htmlFrac(1, 2)} km.`,
    };
  },

  // Πρόβλημα 10: Πτώση μετοχής
  (locale) => {
    const ansStr = (1.65).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 2 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΗΜΑΤΙΣΤΗΡΙΟ' : 'WORD PROBLEMS: STOCK MARKET',
      question: locale === 'el'
        ? `Η τιμή μιας μετοχής ήταν 12,80 € και στο κλείσιμο έπεσε στα 11,15 €. Πόση ήταν η απώλεια σε ευρώ;`
        : `A stock was priced at 12.80 € and closed at 11.15 €. How much was the loss in euros?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `12,80 － 11,15 ＝ ${ansStr} €.`
        : `12.80 － 11.15 ＝ ${ansStr} €.`,
    };
  },

  // Πρόβλημα 11: Υπόλοιπο χρόνου μελέτης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ' : 'WORD PROBLEMS: TIME',
      question: locale === 'el'
        ? `Το πρόγραμμα προβλέπει ${htmlFrac(3, 4)} της ώρας διάβασμα. Αν ο μαθητής έχει διαβάσει ${htmlFrac(1, 3)} της ώρας, πόση ώρα απομένει (σε ανάγωγο κλάσμα);`
        : `A study plan sets ${htmlFrac(3, 4)} hour for reading. If a student has read for ${htmlFrac(1, 3)} hour, how much time remains (irreducible fraction)?`,
      correctAnswer: '5/12',
      solution: locale === 'el'
        ? `ΕΚΠ(4, 3) ＝ 12. ${htmlFrac(9, 12)} － ${htmlFrac(4, 12)} ＝ ${htmlFrac(5, 12)} της ώρας.`
        : `LCM(4, 3) ＝ 12. ${htmlFrac(9, 12)} － ${htmlFrac(4, 12)} ＝ ${htmlFrac(5, 12)} of an hour.`,
    };
  },

  // Πρόβλημα 12: Μεταβολή στάθμης ποταμού
  (locale) => {
    const ansStr = (2.2).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΥΔΡΑΥΛΙΚΑ' : 'WORD PROBLEMS: WATER LEVEL',
      question: locale === 'el'
        ? `Η στάθμη του ποταμού ήταν ＋1,4 m και έπεσε στο －0,8 m. Πόσα μέτρα υποχώρησε συνολικά (1,4 － (－0,8));`
        : `River water level was at ＋1.4 m and dropped to －0.8 m. How many meters did it recede in total (1.4 － (－0.8))?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `1,4 － (－0,8) ＝ 1,4 ＋ 0,8 ＝ ${ansStr} m.`
        : `1.4 － (－0.8) ＝ 1.4 ＋ 0.8 ＝ ${ansStr} m.`,
    };
  },

  // Πρόβλημα 13: Υπόλοιπο υλικού κατασκευής
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ' : 'WORD PROBLEMS: CONSTRUCTION',
      question: locale === 'el'
        ? `Από ένα ξύλο μήκους ${htmlFrac(5, 2)} m κόπηκε κομμάτι ${htmlFrac(4, 3)} m. Πόσα μέτρα ξύλου απέμειναν (σε ανάγωγο κλάσμα);`
        : `From a timber board ${htmlFrac(5, 2)} m long, a piece of ${htmlFrac(4, 3)} m was cut off. How many meters remain (irreducible fraction)?`,
      correctAnswer: '7/6',
      solution: locale === 'el'
        ? `ΕΚΠ(2, 3) ＝ 6. ${htmlFrac(15, 6)} － ${htmlFrac(8, 6)} ＝ ${htmlFrac(7, 6)} m.`
        : `LCM(2, 3) ＝ 6. ${htmlFrac(15, 6)} － ${htmlFrac(8, 6)} ＝ ${htmlFrac(7, 6)} m.`,
    };
  },

  // Πρόβλημα 14: Έκπτωση και πληρωμή
  (locale) => {
    const ansStr = (32.7).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'WORD PROBLEMS: FINANCE',
      question: locale === 'el'
        ? `Ένα ρούχο αξίας 45,50 € πουλήθηκε με έκπτωση 12,80 €. Ποια ήταν η τελική τιμή πώλησης;`
        : `A clothing item priced at 45.50 € was sold with a discount of 12.80 €. What was the final selling price?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `45,50 － 12,80 ＝ ${ansStr} €.`
        : `45.50 － 12.80 ＝ ${ansStr} €.`,
    };
  },

  // Πρόβλημα 15: Υπόλοιπο χυμού σε κανάτα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ' : 'WORD PROBLEMS: CAPACITY',
      question: locale === 'el'
        ? `Σε μια κανάτα υπήρχαν ${htmlFrac(7, 8)} L χυμός και σερβιρίστηκαν ${htmlFrac(1, 2)} L. Πόσο περίσσεψε (σε ανάγωγο κλάσμα);`
        : `A pitcher had ${htmlFrac(7, 8)} L juice and ${htmlFrac(1, 2)} L was served. How much remained (irreducible fraction)?`,
      correctAnswer: '3/8',
      solution: locale === 'el'
        ? `${htmlFrac(7, 8)} － ${htmlFrac(4, 8)} ＝ ${htmlFrac(3, 8)} L.`
        : `${htmlFrac(7, 8)} － ${htmlFrac(4, 8)} ＝ ${htmlFrac(3, 8)} L.`,
    };
  },

  // Πρόβλημα 16: Διαφορά βαθμολογίας
  (locale) => {
    const ansStr = (2.75).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 2 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΙ' : 'WORD PROBLEMS: GRADES',
      question: locale === 'el'
        ? `Στο 1ο τεστ ένας μαθητής συγκέντρωσε 18,5 μονάδες και στο 2ο 15,75. Πόσο μειώθηκε η βαθμολογία του;`
        : `In test 1 a student scored 18.5 points and in test 2 scored 15.75. By how much did the score decrease?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `18,50 － 15,75 ＝ ${ansStr} μονάδες.`
        : `18.50 － 15.75 ＝ ${ansStr} points.`,
    };
  },

  // Πρόβλημα 17: Υπόλοιπο χωρητικότητας δίσκου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ' : 'WORD PROBLEMS: TECHNOLOGY',
      question: locale === 'el'
        ? `Ο αποθηκευτικός χώρος ήταν κατειλημμένος κατά τα ${htmlFrac(9, 10)}. Αν διαγραφούν αρχεία μεγέθους ${htmlFrac(1, 5)}, ποιο κλάσμα του χώρου παραμένει κατειλημμένο (σε ανάγωγο κλάσμα);`
        : `Disk storage was ${htmlFrac(9, 10)} full. If files occupying ${htmlFrac(1, 5)} are deleted, what fraction of storage remains occupied (irreducible fraction)?`,
      correctAnswer: '7/10',
      solution: locale === 'el'
        ? `${htmlFrac(9, 10)} － ${htmlFrac(2, 10)} ＝ ${htmlFrac(7, 10)}.`
        : `${htmlFrac(9, 10)} － ${htmlFrac(2, 10)} ＝ ${htmlFrac(7, 10)}.`,
    };
  },

  // Πρόβλημα 18: Βάθος υποβρυχίου
  (locale) => {
    const ansStr = (-145.6).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΟΣ' : 'WORD PROBLEMS: DEPTH',
      question: locale === 'el'
        ? `Ένα υποβρύχιο βρισκόταν σε βάθος 120,4 m (－120,4) και κατέβηκε άλλα 25,2 m. Ποιο είναι το νέο βάθος (－120,4 － 25,2);`
        : `A submarine was at depth 120.4 m (－120.4) and submerged another 25.2 m. What is its new depth/altitude (－120.4 － 25.2)?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `－120,4 － 25,2 ＝ ${ansStr} m.`
        : `－120.4 － 25.2 ＝ ${ansStr} m.`,
    };
  },

  // Πρόβλημα 19: Υπόλοιπο μπαταρίας
  (locale) => {
    const ansStr = (0.53).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 2 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΠΑΤΑΡΙΑ' : 'WORD PROBLEMS: BATTERY',
      question: locale === 'el'
        ? `Η μπαταρία του tablet ήταν στο 0,85 (85%) και καταναλώθηκε το 0,32 (32%). Ποιο δεκαδικό ποσοστό μπαταρίας απομένει;`
        : `A tablet's battery was at 0.85 (85%) and 0.32 (32%) was consumed. What decimal battery percentage remains?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `0,85 － 0,32 ＝ ${ansStr}.`
        : `0.85 － 0.32 ＝ ${ansStr}.`,
    };
  },

  // Πρόβλημα 20: Διαφορά επίδοσης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ' : 'WORD PROBLEMS: SPORTS',
      question: locale === 'el'
        ? `Ένας άλτης έκανε άλμα ${htmlFrac(13, 2)} m στην 1η προσπάθεια και ${htmlFrac(23, 4)} m στη 2η. Πόσο μεγαλύτερο ήταν το 1ο άλμα (σε ανάγωγο κλάσμα);`
        : `A long jumper jumped ${htmlFrac(13, 2)} m on attempt 1 and ${htmlFrac(23, 4)} m on attempt 2. How much longer was the first jump (irreducible fraction)?`,
      correctAnswer: '3/4',
      solution: locale === 'el'
        ? `ΕΚΠ(2, 4) ＝ 4. ${htmlFrac(26, 4)} － ${htmlFrac(23, 4)} ＝ ${htmlFrac(3, 4)} m.`
        : `LCM(2, 4) ＝ 4. ${htmlFrac(26, 4)} － ${htmlFrac(23, 4)} ＝ ${htmlFrac(3, 4)} m.`,
    };
  },
];

export default function AfairesiKlasmataAsk() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = translations[locale] || translations.el;

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

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
      clean = clean.replace('.', ',');
    } else {
      clean = clean.replace(',', '.');
    }

    // Επιτρέπουμε νούμερα, κόμμα, τελεία, κάθετο (για κλάσματα) και μείον
    clean = clean.replace(/[^0-9,/.-]/g, '');

    if (clean.includes('-')) {
      const parts = clean.split('-');
      clean = '-' + parts.join('').replace(/-/g, '');
    }

    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) return;
    const dotCount = (clean.match(/\./g) || []).length;
    if (dotCount > 1) return;
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
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      let userAns = (userAnswers[q.id] || '').trim().toUpperCase().replace(/\s+/g, '').replace(/^\+/, '');
      let correctAns = q.correctAnswer.trim().toUpperCase().replace(/\s+/g, '').replace(/^\+/, '');

      const normUser = userAns.replace(',', '.');
      const normCorrect = correctAns.replace(',', '.');

      if (userAns === correctAns || normUser === normCorrect) {
        totalCorrect += 1;
      } else {
        const numU = parseFloat(normUser);
        const numC = parseFloat(normCorrect);
        if (!isNaN(numU) && !isNaN(numC) && !userAns.includes('/') && !correctAns.includes('/')) {
          if (Math.abs(numU - numC) <= 0.05) {
            totalCorrect += 1;
          }
        }
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
          href="/a-gymnasiou/17-afairesi-klasmata"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.btnTheory)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-40 overflow-x-hidden space-y-8 box-border">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words">
              {toCleanUppercase(t.badgeChapter)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words">
              {t.titleMain}
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed break-words">
              {t.descMain}
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns.trim().toUpperCase().replace(/\s+/g, '').replace(/^\+/, '');
              const cleanCorrect = q.correctAnswer.trim().toUpperCase().replace(/\s+/g, '').replace(/^\+/, '');

              const normUser = cleanUser.replace(',', '.');
              const normCorrect = cleanCorrect.replace(',', '.');
              const numU = parseFloat(normUser);
              const numC = parseFloat(normCorrect);
              const isNumericClose = !isNaN(numU) && !isNaN(numC) && !cleanUser.includes('/') && !cleanCorrect.includes('/') && Math.abs(numU - numC) <= 0.05;

              const isCorrect = isSubmitted && (cleanUser === cleanCorrect || normUser === normCorrect || isNumericClose);
              const isWordProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-4 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 min-w-0 max-w-full overflow-hidden box-border ${
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
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded shrink-0">
                            {toCleanUppercase(t.badgeProblem)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md shrink-0">
                        {toCleanUppercase(q.topic)}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug break-words [overflow-wrap:anywhere]"
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
                          maxLength={12}
                          disabled={isSubmitted}
                          placeholder={t.placeholderInput}
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
                              className={`min-h-[44px] py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between gap-2 transition-all touch-manipulation active:scale-[0.99] break-words whitespace-normal leading-snug flex-1 ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span className="flex-1 min-w-0 break-words [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: opt }} />
                              {isSelected && <span className="shrink-0 font-black">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση (No-Giveaway) */}
                    {isSubmitted && (
                      <div
                        className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm space-y-2.5 mt-3 border break-words [overflow-wrap:anywhere] ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-sm sm:text-base">
                            <span>✅</span>
                            <span>{toCleanUppercase(t.correctLabel)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>{toCleanUppercase(t.wrongLabel)}</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-flex flex-wrap items-center gap-1 max-w-full">
                              <span>{toCleanUppercase(t.correctAnswerText)}</span>
                              <span className="text-emerald-700 font-black ml-1 break-all" dangerouslySetInnerHTML={{ __html: q.correctAnswer }} />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-relaxed font-normal pt-1.5 border-t border-slate-200/60"
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
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.btnSubmit)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.btnNewExercises)}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl box-border">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {toCleanUppercase(isSubmitted ? t.scoreFinal : t.scoreProgress)}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-3 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {toCleanUppercase(t.scoreSuccess)}
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
              className="px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5 touch-manipulation"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">{toCleanUppercase(t.btnNewExercises)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5 touch-manipulation"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.btnCheckShort)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition touch-manipulation"
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
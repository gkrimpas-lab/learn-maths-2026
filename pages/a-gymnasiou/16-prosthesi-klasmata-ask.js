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
    pageTitle: "Ασκήσεις: Πρόσθεση Ρητών Αριθμών | Α' Γυμνασίου",
    pageDesc: "12 δυναμικές ασκήσεις και προβλήματα στην πρόσθεση ομόσημων και ετερόσημων ρητών αριθμών (κλάσματα και δεκαδικοί).",
    backText: "Α' Γυμνασίου",
    btnTheory: "ΘΕΩΡΙΑ",
    badgeChapter: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 14 • ΕΞΑΣΚΗΣΗ",
    titleMain: "Πρόσθεση Ρητών Αριθμών",
    descMain: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία πρόσθεσης ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    badgeProblem: "ΠΡΟΒΛΗΜΑ",
    placeholderInput: "π.χ. -3/4 ή 2,5",
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
    pageTitle: "Exercises: Addition of Rational Numbers | Grade 7",
    pageDesc: "12 dynamic exercises and word problems on adding rational numbers with like and unlike signs (fractions and decimals).",
    backText: "Grade 7",
    btnTheory: "THEORY",
    badgeChapter: "GRADE 7 • CHAPTER 14 • PRACTICE",
    titleMain: "Addition of Rational Numbers",
    descMain: "Solve the following 12 selected exercises (10 calculation/theory questions ＋ 2 real-life word problems). Click «CHECK ANSWERS» to view your score and detailed solutions.",
    badgeProblem: "PROBLEM",
    placeholderInput: "e.g. -3/4 or 2.5",
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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ ΠΡΟΣΘΕΣΗΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Πρόσθεση ομόσημων θετικών ομώνυμων κλασμάτων (Input)
  (locale) => {
    const den = randInt(5, 9);
    const n1 = randInt(1, 3);
    const n2 = randInt(1, 3);
    const sumN = n1 + n2;
    const g = gcd(sumN, den);
    const finalN = sumN / g;
    const finalD = den / g;
    const ansStr = finalD === 1 ? `${finalN}` : `${finalN}/${finalD}`;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΟΜΟΣΗΜΑ ΟΜΩΝΥΜΑ (+)' : 'LIKE FRACTIONS (+)',
      question: locale === 'el'
        ? `Υπολόγισε το άθροισμα στην πιο απλή (ανάγωγη) μορφή: (${htmlFrac(n1, den)}) ＋ (${htmlFrac(n2, den)})`
        : `Calculate the sum in simplest (irreducible) form: (${htmlFrac(n1, den)}) ＋ (${htmlFrac(n2, den)})`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `Προσθέτουμε τους αριθμητές διατηρώντας τον κοινό παρονομαστή: (${n1} ＋ ${n2}) / ${den} ＝ ${htmlFrac(sumN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)} μετά από διαίρεση με το ${g}` : ''}.`
        : `Add numerators while keeping the common denominator: (${n1} ＋ ${n2}) / ${den} ＝ ${htmlFrac(sumN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)} after dividing by ${g}` : ''}.`,
    };
  },

  // 2. Πρόσθεση ομόσημων αρνητικών ομώνυμων κλασμάτων (Input)
  (locale) => {
    const den = randInt(6, 11);
    const n1 = randInt(1, 3);
    const n2 = randInt(1, 3);
    const sumN = -(n1 + n2);
    const g = gcd(Math.abs(sumN), den);
    const finalN = sumN / g;
    const finalD = den / g;
    const ansStr = finalD === 1 ? `${finalN}` : `${finalN}/${finalD}`;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΟΜΟΣΗΜΑ ΟΜΩΝΥΜΑ (-)' : 'LIKE FRACTIONS (-)',
      question: locale === 'el'
        ? `Υπολόγισε το άθροισμα σε ανάγωγη μορφή: (${htmlFrac(-n1, den)}) ＋ (${htmlFrac(-n2, den)})`
        : `Calculate the sum in irreducible form: (${htmlFrac(-n1, den)}) ＋ (${htmlFrac(-n2, den)})`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `Προσθέτουμε τις απόλυτες τιμές και κρατάμε το αρνητικό πρόσημο: [－(${n1} ＋ ${n2})] / ${den} ＝ ${htmlFrac(sumN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)}` : ''}.`
        : `Add absolute values and keep the negative sign: [－(${n1} ＋ ${n2})] / ${den} ＝ ${htmlFrac(sumN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)}` : ''}.`,
    };
  },

  // 3. Πρόσθεση ετερόσημων ομώνυμων κλασμάτων (Input)
  (locale) => {
    const den = randInt(5, 10);
    const pos = randInt(4, 7);
    const neg = randInt(1, 3);
    const sumN = pos - neg;
    const g = gcd(sumN, den);
    const finalN = sumN / g;
    const finalD = den / g;
    const ansStr = finalD === 1 ? `${finalN}` : `${finalN}/${finalD}`;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΤΕΡΟΣΗΜΑ ΟΜΩΝΥΜΑ' : 'UNLIKE SIGNED LIKE FRACTIONS',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα σε ανάγωγη μορφή: (${htmlFrac(pos, den)}) ＋ (${htmlFrac(-neg, den)})`
        : `Calculate the result in irreducible form: (${htmlFrac(pos, den)}) ＋ (${htmlFrac(-neg, den)})`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `Αφαιρούμε τις απόλυτες τιμές των αριθμητών: (${pos} － ${neg}) / ${den} ＝ ${htmlFrac(sumN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)}` : ''}.`
        : `Subtract the absolute values of the numerators: (${pos} － ${neg}) / ${den} ＝ ${htmlFrac(sumN, den)}${g > 1 ? ` ＝ ${htmlFrac(finalN, finalD)}` : ''}.`,
    };
  },

  // 4. Πρόσθεση ετερώνυμων κλασμάτων (Input)
  (locale) => {
    const d1 = 2;
    const d2 = 3;
    const n1 = 1;
    const n2 = 1;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ' : 'UNLIKE FRACTIONS',
      question: locale === 'el'
        ? `Υπολόγισε το άθροισμα σε ανάγωγη μορφή: (${htmlFrac(n1, d1)}) ＋ (${htmlFrac(n2, d2)})`
        : `Calculate the sum in irreducible form: (${htmlFrac(n1, d1)}) ＋ (${htmlFrac(n2, d2)})`,
      correctAnswer: '5/6',
      solution: locale === 'el'
        ? `ΕΚΠ(2, 3) ＝ 6. Μετατρέπουμε σε ομώνυμα με πολλαπλασιασμό των όρων: ${htmlFrac(3, 6)} ＋ ${htmlFrac(2, 6)} ＝ ${htmlFrac(5, 6)}.`
        : `LCM(2, 3) ＝ 6. Convert to like fractions: ${htmlFrac(3, 6)} ＋ ${htmlFrac(2, 6)} ＝ ${htmlFrac(5, 6)}.`,
    };
  },

  // 5. Πρόσθεση ετερώνυμων με αρνητικό όρο (Input)
  (locale) => {
    const d1 = 4;
    const d2 = 6;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΤΕΡΩΝΥΜΑ ΜΕ ΠΡΟΣΗΜΟ' : 'SIGNED UNLIKE FRACTIONS',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγη μορφή: (${htmlFrac(3, d1)}) ＋ (${htmlFrac(-1, d2)})`
        : `Calculate in irreducible form: (${htmlFrac(3, d1)}) ＋ (${htmlFrac(-1, d2)})`,
      correctAnswer: '7/12',
      solution: locale === 'el'
        ? `ΕΚΠ(4, 6) ＝ 12. Μετατρέπουμε σε ομώνυμα: ${htmlFrac(9, 12)} ＋ (${htmlFrac(-2, 12)}) ＝ ${htmlFrac(7, 12)}.`
        : `LCM(4, 6) ＝ 12. Convert to like fractions: ${htmlFrac(9, 12)} ＋ (${htmlFrac(-2, 12)}) ＝ ${htmlFrac(7, 12)}.`,
    };
  },

  // 6. Άθροισμα αντίθετων ρητών (Input)
  (locale) => {
    const n = randInt(2, 8);
    const d = randInt(9, 15);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΤΙΘΕΤΟΙ ΡΗΤΟΙ' : 'OPPOSITE RATIONALS',
      question: locale === 'el'
        ? `Ποιο είναι το αποτέλεσμα της πρόσθεσης: (${htmlFrac(n, d)}) ＋ (${htmlFrac(-n, d)});`
        : `What is the result of the addition: (${htmlFrac(n, d)}) ＋ (${htmlFrac(-n, d)})?`,
      correctAnswer: '0',
      solution: locale === 'el'
        ? `Το άθροισμα δύο αντίθετων ρητών αριθμών ισούται πάντοτε με 0.`
        : `The sum of any two opposite rational numbers is always 0.`,
    };
  },

  // 7. Πρόσθεση ομόσημων αρνητικών δεκαδικών (Input)
  (locale) => {
    const numA = randInt(11, 28) / 10;
    const numB = randInt(11, 35) / 10;
    const sumVal = -(numA + numB);
    const strA = numA.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const strB = numB.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const sumStr = sumVal.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΟΜΟΣΗΜΟΙ ΔΕΚΑΔΙΚΟΙ (-)' : 'SAME SIGN DECIMALS (-)',
      question: locale === 'el'
        ? `Υπολόγισε το άθροισμα: (－${strA}) ＋ (－${strB})`
        : `Calculate the sum: (－${strA}) ＋ (－${strB})`,
      correctAnswer: sumStr,
      solution: locale === 'el'
        ? `Είναι ομόσημοι αρνητικοί: Προσθέτουμε τις απόλυτες τιμές (${strA} ＋ ${strB}) και βάζουμε πρόσημο μείον: ${sumStr}.`
        : `Both are negative: Add absolute values (${strA} ＋ ${strB}) and assign the negative sign: ${sumStr}.`,
    };
  },

  // 8. Πρόσθεση ετερόσημων δεκαδικών (Input)
  (locale) => {
    const strA = (4.5).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const strB = (1.8).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const sumStr = (2.7).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΤΕΡΟΣΗΜΟΙ ΔΕΚΑΔΙΚΟΙ' : 'DIFFERENT SIGN DECIMALS',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: (＋${strA}) ＋ (－${strB})`
        : `Calculate the result: (＋${strA}) ＋ (－${strB})`,
      correctAnswer: sumStr,
      solution: locale === 'el'
        ? `Είναι ετερόσημοι: Αφαιρούμε τις απόλυτες τιμές (${strA} － ${strB} ＝ ${sumStr}) και κρατάμε το πρόσημο του μεγαλύτερου κατά απόλυτη τιμή (＋): ＋${sumStr} (ή ${sumStr}).`
        : `Different signs: Subtract absolute values (${strA} － ${strB} ＝ ${sumStr}) and keep the sign of the larger magnitude (＋): ＋${sumStr} (or ${sumStr}).`,
    };
  },

  // 9. Πρόσθεση ετερόσημων δεκαδικών με αρνητικό αποτέλεσμα (Input)
  (locale) => {
    const strA = (2.3).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const strB = (6.5).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const sumStr = (-4.2).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΤΕΡΟΣΗΜΟΙ ΔΕΚΑΔΙΚΟΙ (-)' : 'DIFFERENT SIGN DECIMALS (-)',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: (＋${strA}) ＋ (－${strB})`
        : `Calculate the result: (＋${strA}) ＋ (－${strB})`,
      correctAnswer: sumStr,
      solution: locale === 'el'
        ? `Αφαιρούμε τις απόλυτες τιμές: ${strB} － ${strA} ＝ 4,2. Επειδή |-${strB}| ＞ |+${strA}|, το πρόσημο είναι μείον: ${sumStr}.`
        : `Subtract absolute values: ${strB} － ${strA} ＝ 4.2. Since |-${strB}| ＞ |+${strA}|, the sign is negative: ${sumStr}.`,
    };
  },

  // 10. Ιδιότητα ουδέτερου στοιχείου (MCQ)
  (locale) => {
    const correct = locale === 'el' ? 'Το 0' : '0';
    const wrong1 = locale === 'el' ? 'Το 1' : '1';
    const wrong2 = locale === 'el' ? 'Το －1' : '－1';
    const wrong3 = locale === 'el' ? 'Δεν υπάρχει' : 'None exists';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΟΥΔΕΤΕΡΟ ΣΤΟΙΧΕΙΟ' : 'ADDITIVE IDENTITY',
      question: locale === 'el'
        ? `Ποιο είναι το ουδέτερο στοιχείο της πρόσθεσης στους ρητούς αριθμούς;`
        : `What is the identity element for addition in rational numbers?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Το μηδέν (0) είναι το ουδέτερο στοιχείο της πρόσθεσης, αφού α ＋ 0 ＝ 0 ＋ α ＝ α για κάθε ρητό α.`
        : `Zero (0) is the additive identity, since a ＋ 0 ＝ 0 ＋ a ＝ a for any rational number a.`,
    };
  },

  // 11. Πρόσθεση ακέραιου με κλάσμα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΚΕΡΑΙΟΣ ΜΕ ΚΛΑΣΜΑ' : 'INTEGER WITH FRACTION',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: 1 ＋ (${htmlFrac(1, 3)})`
        : `Calculate as an irreducible fraction: 1 ＋ (${htmlFrac(1, 3)})`,
      correctAnswer: '4/3',
      solution: locale === 'el'
        ? `Γράφουμε τον ακέραιο 1 ως ${htmlFrac(3, 3)}: ${htmlFrac(3, 3)} ＋ ${htmlFrac(1, 3)} ＝ ${htmlFrac(4, 3)}.`
        : `Write integer 1 as ${htmlFrac(3, 3)}: ${htmlFrac(3, 3)} ＋ ${htmlFrac(1, 3)} ＝ ${htmlFrac(4, 3)}.`,
    };
  },

  // 12. Πρόσθεση αρνητικού ακέραιου με κλάσμα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΚΕΡΑΙΟΣ ΜΕ ΚΛΑΣΜΑ (-)' : 'NEGATIVE INTEGER WITH FRACTION',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα σε ανάγωγο κλάσμα: (－1) ＋ (${htmlFrac(1, 4)})`
        : `Calculate the result as an irreducible fraction: (－1) ＋ (${htmlFrac(1, 4)})`,
      correctAnswer: '-3/4',
      solution: locale === 'el'
        ? `Γράφουμε το －1 ως ${htmlFrac(-4, 4)}: ${htmlFrac(-4, 4)} ＋ ${htmlFrac(1, 4)} ＝ ${htmlFrac(-3, 4)}.`
        : `Write －1 as ${htmlFrac(-4, 4)}: ${htmlFrac(-4, 4)} ＋ ${htmlFrac(1, 4)} ＝ ${htmlFrac(-3, 4)}.`,
    };
  },

  // 13. Πρόσθεση τριών ομώνυμων κλασμάτων (Input)
  (locale) => {
    const den = 7;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΤΡΙΑ ΟΜΩΝΥΜΑ' : 'THREE LIKE FRACTIONS',
      question: locale === 'el'
        ? `Υπολόγισε το άθροισμα: (${htmlFrac(1, den)}) ＋ (${htmlFrac(2, den)}) ＋ (${htmlFrac(3, den)})`
        : `Calculate the sum: (${htmlFrac(1, den)}) ＋ (${htmlFrac(2, den)}) ＋ (${htmlFrac(3, den)})`,
      correctAnswer: '6/7',
      solution: locale === 'el'
        ? `Διατηρούμε τον παρονομαστή 7 και προσθέτουμε τους αριθμητές: (1 ＋ 2 ＋ 3) / 7 ＝ ${htmlFrac(6, 7)}.`
        : `Keep denominator 7 and add numerators: (1 ＋ 2 ＋ 3) / 7 ＝ ${htmlFrac(6, 7)}.`,
    };
  },

  // 14. Πρόσθεση δεκαδικού με κλάσμα (Input)
  (locale) => {
    const strDec = (0.5).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    const strAns = (0.75).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 2 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΟΣ ΚΑΙ ΚΛΑΣΜΑ' : 'DECIMAL AND FRACTION',
      question: locale === 'el'
        ? `Υπολόγισε σε δεκαδική μορφή: ${strDec} ＋ (${htmlFrac(1, 4)})`
        : `Calculate in decimal form: ${strDec} ＋ (${htmlFrac(1, 4)})`,
      correctAnswer: strAns,
      solution: locale === 'el'
        ? `Το κλάσμα ${htmlFrac(1, 4)} ισούται με 0,25. Άρα: ${strDec} ＋ 0,25 ＝ ${strAns}.`
        : `The fraction ${htmlFrac(1, 4)} equals 0.25. Thus: ${strDec} ＋ 0.25 ＝ ${strAns}.`,
    };
  },

  // 15. Κανόνας προσήμων ετερόσημων (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Το πρόσημο του αριθμού με τη μεγαλύτερη απόλυτη τιμή'
      : 'The sign of the number with the larger absolute value';
    const wrong1 = locale === 'el' ? 'Πάντα θετικό' : 'Always positive';
    const wrong2 = locale === 'el' ? 'Πάντα αρνητικό' : 'Always negative';
    const wrong3 = locale === 'el' ? 'Εξαρτάται μόνο από τον παρονομαστή' : 'Depends only on the denominator';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΘΕΩΡΙΑ ΠΡΟΣΗΜΩΝ' : 'SIGN RULES THEORY',
      question: locale === 'el'
        ? `Ποιο πρόσημο έχει το άθροισμα δύο ετερόσημων ρητών αριθμών;`
        : `What sign does the sum of two rationals with different signs have?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Στην πρόσθεση ετερόσημων αφαιρούμε τις απόλυτες τιμές και επικρατεί το πρόσημο του αριθμού με τη μεγαλύτερη απόλυτη τιμή.`
        : `When adding numbers with different signs, subtract absolute values and take the sign of the larger magnitude.`,
    };
  },

  // 16. Πρόσθεση ετερώνυμων με απλοποίηση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΤΕΡΩΝΥΜΑ & ΑΝΑΓΩΓΟ' : 'UNLIKE & IRREDUCIBLE',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα σε ανάγωγη μορφή: (${htmlFrac(1, 6)}) ＋ (${htmlFrac(1, 3)})`
        : `Calculate the result in irreducible form: (${htmlFrac(1, 6)}) ＋ (${htmlFrac(1, 3)})`,
      correctAnswer: '1/2',
      solution: locale === 'el'
        ? `ΕΚΠ(6, 3) ＝ 6. ${htmlFrac(1, 6)} ＋ ${htmlFrac(2, 6)} ＝ ${htmlFrac(3, 6)} ＝ ${htmlFrac(1, 2)} μετά από διαίρεση με το 3.`
        : `LCM(6, 3) ＝ 6. ${htmlFrac(1, 6)} ＋ ${htmlFrac(2, 6)} ＝ ${htmlFrac(3, 6)} ＝ ${htmlFrac(1, 2)} after dividing by 3.`,
    };
  },

  // 17. Πρόσθεση δεκαδικών με αντίθετα πρόσημα και ίση απόλυτη τιμή (Input)
  (locale) => {
    const strVal = (3.8).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΤΙΘΕΤΟΙ ΔΕΚΑΔΙΚΟΙ' : 'OPPOSITE DECIMALS',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: (＋${strVal}) ＋ (－${strVal})`
        : `Calculate the result: (＋${strVal}) ＋ (－${strVal})`,
      correctAnswer: '0',
      solution: locale === 'el'
        ? `Είναι αντίθετοι αριθμοί, επομένως το άθροισμά τους είναι 0.`
        : `They are opposite numbers, so their sum equals 0.`,
    };
  },

  // 18. Αντιμεταθετική ιδιότητα (MCQ)
  (locale) => {
    const correct = locale === 'el' ? 'Αντιμεταθετική ιδιότητα' : 'Commutative property';
    const wrong1 = locale === 'el' ? 'Προσεταιριστική ιδιότητα' : 'Associative property';
    const wrong2 = locale === 'el' ? 'Επιμεριστική ιδιότητα' : 'Distributive property';
    const wrong3 = locale === 'el' ? 'Ιδιότητα του αντιστρόφου' : 'Inverse property';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ ΠΡΟΣΘΕΣΗΣ' : 'ADDITION PROPERTIES',
      question: locale === 'el'
        ? `Ποια ιδιότητα εκφράζει η ισότητα: α ＋ β ＝ β ＋ α;`
        : `Which property is expressed by: a ＋ b ＝ b ＋ a?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Η δυνατότητα να αλλάζουμε τη σειρά των προσθετέων χωρίς να αλλάζει το αποτέλεσμα ονομάζεται αντιμεταθετική ιδιότητα.`
        : `The rule that allows changing the order of addends without altering the sum is the commutative property.`,
    };
  },

  // 19. Πρόσθεση αρνητικών ετερώνυμων (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΑ ΕΤΕΡΩΝΥΜΑ' : 'NEGATIVE UNLIKE FRACTIONS',
      question: locale === 'el'
        ? `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(-1, 2)}) ＋ (${htmlFrac(-1, 4)})`
        : `Calculate as an irreducible fraction: (${htmlFrac(-1, 2)}) ＋ (${htmlFrac(-1, 4)})`,
      correctAnswer: '-3/4',
      solution: locale === 'el'
        ? `ΕΚΠ(2, 4) ＝ 4. (${htmlFrac(-2, 4)}) ＋ (${htmlFrac(-1, 4)}) ＝ ${htmlFrac(-3, 4)}.`
        : `LCM(2, 4) ＝ 4. (${htmlFrac(-2, 4)}) ＋ (${htmlFrac(-1, 4)}) ＝ ${htmlFrac(-3, 4)}.`,
    };
  },

  // 20. Πρόσθεση με μηδέν (Input)
  (locale) => {
    const a = -7;
    const b = 9;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΣΘΕΣΗ ΜΕ ΤΟ 0' : 'ADDING ZERO',
      question: locale === 'el'
        ? `Υπολόγισε το αποτέλεσμα: (${htmlFrac(a, b)}) ＋ 0`
        : `Calculate the result: (${htmlFrac(a, b)}) ＋ 0`,
      correctAnswer: `${a}/${b}`,
      solution: locale === 'el'
        ? `Η πρόσθεση του μηδενός δεν μεταβάλλει τον αριθμό: ${htmlFrac(a, b)}.`
        : `Adding zero leaves the number unchanged: ${htmlFrac(a, b)}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΠΡΟΣΘΕΣΗΣ ΡΗΤΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Οικονομικό ισοζύγιο καταστήματος
  (locale) => {
    const ansStr = (2.7).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'WORD PROBLEMS: FINANCE',
      question: locale === 'el'
        ? `Ένα κατάστημα την πρώτη εβδομάδα κατέγραψε ζημία 1,8 χιλιάδες ευρώ (δηλαδή －1,8) και τη δεύτερη εβδομάδα κατέγραψε κέρδος 4,5 χιλιάδες ευρώ (δηλαδή ＋4,5). Ποιο είναι το συνολικό οικονομικό αποτέλεσμα των δύο εβδομάδων σε χιλιάδες ευρώ;`
        : `In week one a store had a loss of 1.8 thousand euros (－1.8) and in week two a profit of 4.5 thousand euros (＋4.5). What is the total financial outcome in thousands of euros?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `Προσθέτουμε τα ποσά: (－1,8) ＋ (＋4,5) ＝ ＋${ansStr} χιλιάδες ευρώ κέρδος.`
        : `Add the amounts: (－1.8) ＋ (＋4.5) ＝ ＋${ansStr} thousand euros profit.`,
    };
  },

  // Πρόβλημα 2: Μεταβολή θερμοκρασίας
  (locale) => {
    const ansStr = (1.7).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ' : 'WORD PROBLEMS: TEMPERATURE',
      question: locale === 'el'
        ? `Το πρωί η θερμοκρασία σε μια πόλη ήταν －3,5 °C. Μέχρι το μεσημέρι ανέβηκε κατά ＋5,2 °C. Ποια είναι η νέα θερμοκρασία;`
        : `In the morning the temperature was －3.5 °C. By noon it rose by ＋5.2 °C. What is the new temperature?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `Προσθέτουμε τη μεταβολή: (－3,5) ＋ (＋5,2) ＝ ＋${ansStr} °C.`
        : `Add the variation: (－3.5) ＋ (＋5.2) ＝ ＋${ansStr} °C.`,
    };
  },

  // Πρόβλημα 3: Συνδυασμός υλικών σε συνταγή
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΤΑΓΕΣ' : 'WORD PROBLEMS: RECIPES',
      question: locale === 'el'
        ? `Για ένα κέικ χρησιμοποιήθηκαν ${htmlFrac(1, 2)} kg αλεύρι και ${htmlFrac(1, 4)} kg ζάχαρη. Πόσα κιλά ζυγίζουν συνολικά τα δύο υλικά (σε ανάγωγο κλάσμα);`
        : `A cake recipe uses ${htmlFrac(1, 2)} kg flour and ${htmlFrac(1, 4)} kg sugar. How many kg do both ingredients weigh in total (as an irreducible fraction)?`,
      correctAnswer: '3/4',
      solution: locale === 'el'
        ? `${htmlFrac(1, 2)} ＋ ${htmlFrac(1, 4)} ＝ ${htmlFrac(2, 4)} ＋ ${htmlFrac(1, 4)} ＝ ${htmlFrac(3, 4)} kg.`
        : `${htmlFrac(1, 2)} ＋ ${htmlFrac(1, 4)} ＝ ${htmlFrac(2, 4)} ＋ ${htmlFrac(1, 4)} ＝ ${htmlFrac(3, 4)} kg.`,
    };
  },

  // Πρόβλημα 4: Τραπεζικός λογαριασμός
  (locale) => {
    const ansStr = (75.2).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΡΑΠΕΖΕΣ' : 'WORD PROBLEMS: BANKING',
      question: locale === 'el'
        ? `Ένας λογαριασμός είχε υπόλοιπο ＋120,5 € και έγινε χρέωση －45,3 € για συνδρομή. Ποιο είναι το νέο υπόλοιπο;`
        : `A bank account had a balance of ＋120.5 € and a subscription fee of －45.3 € was charged. What is the new balance?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `(＋120,5) ＋ (－45,3) ＝ ＋${ansStr} €.`
        : `(＋120.5) ＋ (－45.3) ＝ ＋${ansStr} €.`,
    };
  },

  // Πρόβλημα 5: Χρόνος προπόνησης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ' : 'WORD PROBLEMS: TIME',
      question: locale === 'el'
        ? `Ένας αθλητής έκανε ζέσταμα για ${htmlFrac(1, 3)} της ώρας και κύρια προπόνηση για ${htmlFrac(1, 2)} της ώρας. Ποιο κλάσμα της ώρας διήρκεσε συνολικά η άσκηση (σε ανάγωγο κλάσμα);`
        : `An athlete warmed up for ${htmlFrac(1, 3)} hour and trained for ${htmlFrac(1, 2)} hour. What fraction of an hour was the total workout (irreducible fraction)?`,
      correctAnswer: '5/6',
      solution: locale === 'el'
        ? `${htmlFrac(1, 3)} ＋ ${htmlFrac(1, 2)} ＝ ${htmlFrac(2, 6)} ＋ ${htmlFrac(3, 6)} ＝ ${htmlFrac(5, 6)} της ώρας.`
        : `${htmlFrac(1, 3)} ＋ ${htmlFrac(1, 2)} ＝ ${htmlFrac(2, 6)} ＋ ${htmlFrac(3, 6)} ＝ ${htmlFrac(5, 6)} of an hour.`,
    };
  },

  // Πρόβλημα 6: Στάθμη νερού
  (locale) => {
    const ansStr = (0.7).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΥΔΡΑΥΛΙΚΑ' : 'WORD PROBLEMS: WATER LEVEL',
      question: locale === 'el'
        ? `Η στάθμη μιας δεξαμενής υποχώρησε κατά 0,8 μέτρα (－0,8) και μετά ανέβηκε κατά 1,5 μέτρα (＋1,5). Ποια είναι η συνολική μεταβολή της στάθμης;`
        : `A tank's water level dropped by 0.8 meters (－0.8) and then rose by 1.5 meters (＋1.5). What is the net water level change?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `(－0,8) ＋ (＋1,5) ＝ ＋${ansStr} μέτρα.`
        : `(－0.8) ＋ (＋1.5) ＝ ＋${ansStr} meters.`,
    };
  },

  // Πρόβλημα 7: Διαδρομή με ενδιάμεση στάση
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΣΤΑΣΕΙΣ' : 'WORD PROBLEMS: DISTANCES',
      question: locale === 'el'
        ? `Ο Πέτρος περπάτησε ${htmlFrac(2, 5)} km μέχρι το κατάστημα και άλλα ${htmlFrac(3, 10)} km μέχρι το πάρκο. Πόσα km διένυσε συνολικά (σε ανάγωγο κλάσμα);`
        : `Petros walked ${htmlFrac(2, 5)} km to the shop and another ${htmlFrac(3, 10)} km to the park. How many km did he walk in total (irreducible fraction)?`,
      correctAnswer: '7/10',
      solution: locale === 'el'
        ? `${htmlFrac(2, 5)} ＋ ${htmlFrac(3, 10)} ＝ ${htmlFrac(4, 10)} ＋ ${htmlFrac(3, 10)} ＝ ${htmlFrac(7, 10)} km.`
        : `${htmlFrac(2, 5)} ＋ ${htmlFrac(3, 10)} ＝ ${htmlFrac(4, 10)} ＋ ${htmlFrac(3, 10)} ＝ ${htmlFrac(7, 10)} km.`,
    };
  },

  // Πρόβλημα 8: Υψόμετρο υποβρυχίου
  (locale) => {
    const ansStr = (-25.2).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΥΨΟΜΕΤΡΑ' : 'WORD PROBLEMS: ALTITUDE',
      question: locale === 'el'
        ? `Ένα υποβρύχιο βρισκόταν σε βάθος 45,6 μέτρων (υψόμετρο －45,6 m) και αναδύθηκε κατά 20,4 μέτρα (＋20,4 m). Ποιο είναι το νέο του υψόμετρο;`
        : `A submarine was at depth 45.6 m (altitude －45.6 m) and ascended 20.4 m (＋20.4 m). What is its new depth/altitude?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `(－45,6) ＋ (＋20,4) ＝ ${ansStr} m.`
        : `(－45.6) ＋ (＋20.4) ＝ ${ansStr} m.`,
    };
  },

  // Πρόβλημα 9: Μοίρασμα εργασίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ' : 'WORD PROBLEMS: WORK',
      question: locale === 'el'
        ? `Η ομάδα Α ολοκλήρωσε τα ${htmlFrac(3, 8)} μιας εργασίας και η ομάδα Β τα ${htmlFrac(1, 4)}. Ποιο κλάσμα της εργασίας ολοκληρώθηκε συνολικά (σε ανάγωγο κλάσμα);`
        : `Team A completed ${htmlFrac(3, 8)} of a task and team B completed ${htmlFrac(1, 4)}. What fraction of the task was completed in total (irreducible fraction)?`,
      correctAnswer: '5/8',
      solution: locale === 'el'
        ? `${htmlFrac(3, 8)} ＋ ${htmlFrac(1, 4)} ＝ ${htmlFrac(3, 8)} ＋ ${htmlFrac(2, 8)} ＝ ${htmlFrac(5, 8)}.`
        : `${htmlFrac(3, 8)} ＋ ${htmlFrac(1, 4)} ＝ ${htmlFrac(3, 8)} ＋ ${htmlFrac(2, 8)} ＝ ${htmlFrac(5, 8)}.`,
    };
  },

  // Πρόβλημα 10: Βαθμοί ποινής σε παιχνίδι
  (locale) => {
    const ansStr = (-6.7).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΠΑΙΧΝΙΔΙΑ' : 'WORD PROBLEMS: GAMES',
      question: locale === 'el'
        ? `Ένας παίκτης στον 1ο γύρο έχασε 2,5 πόντους (－2,5) και στον 2ο γύρο έχασε 4,2 πόντους (－4,2). Ποιο είναι το συνολικό σκορ ποινών του;`
        : `In round 1 a player lost 2.5 points (－2.5) and in round 2 lost 4.2 points (－4.2). What is their total penalty score?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `(－2,5) ＋ (－4,2) ＝ ${ansStr} πόντοι.`
        : `(－2.5) ＋ (－4.2) ＝ ${ansStr} points.`,
    };
  },

  // Πρόβλημα 11: Κατανάλωση υγρών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ' : 'WORD PROBLEMS: CAPACITY',
      question: locale === 'el'
        ? `Η Νίκη ήπιε ${htmlFrac(3, 5)} L νερό το πρωί και ${htmlFrac(1, 2)} L το απόγευμα. Πόσα λίτρα νερό κατανάλωσε συνολικά (σε ανάγωγο κλάσμα);`
        : `Niki drank ${htmlFrac(3, 5)} L water in the morning and ${htmlFrac(1, 2)} L in the afternoon. How many liters did she drink in total (irreducible fraction)?`,
      correctAnswer: '11/10',
      solution: locale === 'el'
        ? `ΕΚΠ(5, 2) ＝ 10. ${htmlFrac(6, 10)} ＋ ${htmlFrac(5, 10)} ＝ ${htmlFrac(11, 10)} L.`
        : `LCM(5, 2) ＝ 10. ${htmlFrac(6, 10)} ＋ ${htmlFrac(5, 10)} ＝ ${htmlFrac(11, 10)} L.`,
    };
  },

  // Πρόβλημα 12: Μεταβολή βάρους
  (locale) => {
    const ansStr = (-0.7).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΡΟΣ' : 'WORD PROBLEMS: WEIGHT',
      question: locale === 'el'
        ? `Ένας αθλητής τον 1ο μήνα έχασε 1,6 kg (－1,6) και τον 2ο μήνα πήρε 0,9 kg (＋0,9). Ποια είναι η συνολική μεταβολή βάρους σε kg;`
        : `In month 1 an athlete lost 1.6 kg (－1.6) and in month 2 gained 0.9 kg (＋0.9). What is the net weight change in kg?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `(－1,6) ＋ (＋0,9) ＝ ${ansStr} kg.`
        : `(－1.6) ＋ (＋0.9) ＝ ${ansStr} kg.`,
    };
  },

  // Πρόβλημα 13: Ύφασμα για ρούχα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΡΑΠΤΙΚΗ' : 'WORD PROBLEMS: SEWING',
      question: locale === 'el'
        ? `Μια μοδίστρα χρησιμοποίησε ${htmlFrac(3, 4)} m για γιλέκο και ${htmlFrac(2, 3)} m για παντελόνι. Πόσα μέτρα ύφασμα χρησιμοποίησε συνολικά (σε ανάγωγο κλάσμα);`
        : `A tailor used ${htmlFrac(3, 4)} m for a vest and ${htmlFrac(2, 3)} m for trousers. How many meters of fabric were used in total (irreducible fraction)?`,
      correctAnswer: '17/12',
      solution: locale === 'el'
        ? `ΕΚΠ(4, 3) ＝ 12. ${htmlFrac(9, 12)} ＋ ${htmlFrac(8, 12)} ＝ ${htmlFrac(17, 12)} m.`
        : `LCM(4, 3) ＝ 12. ${htmlFrac(9, 12)} ＋ ${htmlFrac(8, 12)} ＝ ${htmlFrac(17, 12)} m.`,
    };
  },

  // Πρόβλημα 14: Έξοδα και έσοδα
  (locale) => {
    const ansStr = (17.6).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'WORD PROBLEMS: FINANCE',
      question: locale === 'el'
        ? `Ένας φοιτητής είχε έξοδα 62,4 € (－62,4) και εισέπραξε επίδομα 80,0 € (＋80,0). Ποιο είναι το τελικό υπόλοιπο;`
        : `A student had expenses of 62.4 € (－62.4) and received an allowance of 80.0 € (＋80.0). What is the net balance?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `(－62,4) ＋ (＋80,0) ＝ ＋${ansStr} €.`
        : `(－62.4) ＋ (＋80.0) ＝ ＋${ansStr} €.`,
    };
  },

  // Πρόβλημα 15: Συγκομιδή καρπών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΡΟΤΙΚΑ' : 'WORD PROBLEMS: HARVEST',
      question: locale === 'el'
        ? `Από ένα περιβόλι μαζεύτηκαν τα ${htmlFrac(2, 7)} της παραγωγής τη Δευτέρα και τα ${htmlFrac(3, 7)} την Τρίτη. Ποιο μέρος μαζεύτηκε συνολικά;`
        : `From an orchard, ${htmlFrac(2, 7)} of the harvest was gathered on Monday and ${htmlFrac(3, 7)} on Tuesday. What fraction was gathered in total?`,
      correctAnswer: '5/7',
      solution: locale === 'el'
        ? `${htmlFrac(2, 7)} ＋ ${htmlFrac(3, 7)} ＝ ${htmlFrac(5, 7)}.`
        : `${htmlFrac(2, 7)} ＋ ${htmlFrac(3, 7)} ＝ ${htmlFrac(5, 7)}.`,
    };
  },

  // Πρόβλημα 16: Ανελκυστήρας κτιρίου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΡΟΦΟΙ' : 'WORD PROBLEMS: FLOORS',
      question: locale === 'el'
        ? `Ο ανελκυστήρας ξεκίνησε από το 2ο υπόγειο (－2) και ανέβηκε 5 ορόφους (＋5). Σε ποιον όροφο έφτασε;`
        : `An elevator started at basement level 2 (－2) and went up 5 floors (＋5). Which floor did it reach?`,
      correctAnswer: '3',
      solution: locale === 'el'
        ? `(－2) ＋ (＋5) ＝ ＋3ος όροφος.`
        : `(－2) ＋ (＋5) ＝ ＋3rd floor.`,
    };
  },

  // Πρόβλημα 17: Καθαρός χρόνος μελέτης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ' : 'WORD PROBLEMS: TIME',
      question: locale === 'el'
        ? `Η Ελένη διάβασε ${htmlFrac(3, 10)} της ώρας ιστορία και ${htmlFrac(2, 5)} της ώρας μαθηματικά. Πόση ώρα μελέτησε συνολικά (σε ανάγωγο κλάσμα);`
        : `Eleni studied history for ${htmlFrac(3, 10)} hour and math for ${htmlFrac(2, 5)} hour. How long did she study in total (irreducible fraction)?`,
      correctAnswer: '7/10',
      solution: locale === 'el'
        ? `${htmlFrac(3, 10)} ＋ ${htmlFrac(4, 10)} ＝ ${htmlFrac(7, 10)} της ώρας.`
        : `${htmlFrac(3, 10)} ＋ ${htmlFrac(4, 10)} ＝ ${htmlFrac(7, 10)} of an hour.`,
    };
  },

  // Πρόβλημα 18: Πτώση και άνοδος μετοχής
  (locale) => {
    const ansStr = (0.15).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 2 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΗΜΑΤΙΣΤΗΡΙΟ' : 'WORD PROBLEMS: STOCK MARKET',
      question: locale === 'el'
        ? `Μια μετοχή υποχώρησε κατά 0,45 € (－0,45) το πρωί και ενισχύθηκε κατά 0,60 € (＋0,60) το απόγευμα. Ποια ήταν η συνολική μεταβολή;`
        : `A stock dropped by 0.45 € (－0.45) in the morning and gained 0.60 € (＋0.60) in the afternoon. What was the net change?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `(－0,45) ＋ (＋0,60) ＝ ＋${ansStr} €.`
        : `(－0.45) ＋ (＋0.60) ＝ ＋${ansStr} €.`,
    };
  },

  // Πρόβλημα 19: Μήκος ξύλινων δοκών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ' : 'WORD PROBLEMS: CONSTRUCTION',
      question: locale === 'el'
        ? `Ενώνουμε δύο σανίδες μήκους ${htmlFrac(5, 6)} m και ${htmlFrac(1, 4)} m. Ποιο είναι το συνολικό μήκος σε ανάγωγο κλάσμα;`
        : `Connecting two wooden boards of lengths ${htmlFrac(5, 6)} m and ${htmlFrac(1, 4)} m, what is their combined length (irreducible fraction)?`,
      correctAnswer: '13/12',
      solution: locale === 'el'
        ? `ΕΚΠ(6, 4) ＝ 12. ${htmlFrac(10, 12)} ＋ ${htmlFrac(3, 12)} ＝ ${htmlFrac(13, 12)} m.`
        : `LCM(6, 4) ＝ 12. ${htmlFrac(10, 12)} ＋ ${htmlFrac(3, 12)} ＝ ${htmlFrac(13, 12)} m.`,
    };
  },

  // Πρόβλημα 20: Ρεύμα ποταμού
  (locale) => {
    const ansStr = (3.3).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', { minimumFractionDigits: 1 });
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΙΚΗ' : 'WORD PROBLEMS: PHYSICS',
      question: locale === 'el'
        ? `Μια βάρκα κινείται με ＋4,8 km/h ενώ το αντίθετο ρεύμα την επιβραδύνει με －1,5 km/h. Ποια είναι η πραγματική ταχύτητα της βάρκας;`
        : `A boat moves at ＋4.8 km/h against an opposing current of －1.5 km/h. What is the net speed of the boat?`,
      correctAnswer: ansStr,
      solution: locale === 'el'
        ? `(＋4,8) ＋ (－1,5) ＝ ＋${ansStr} km/h.`
        : `(＋4.8) ＋ (－1.5) ＝ ＋${ansStr} km/h.`,
    };
  },
];

export default function ProsthesiKlasmataAsk() {
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
          href="/a-gymnasiou/16-prosthesi-klasmata"
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
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
    [arr[i], arr[j]] = [arr[j], arr[i]];
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
    pageTitle: "Ασκήσεις: Ισοδύναμα Κλάσματα | Α' Γυμνασίου",
    pageDesc: "12 δυναμικές ασκήσεις και προβλήματα στη διαστολή, απλοποίηση και ισοδυναμία κλασμάτων για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    btnTheory: "ΘΕΩΡΙΑ",
    badgeChapter: "Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ",
    titleMain: "Ισοδύναμα Κλάσματα",
    descMain: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 υπολογισμοί/θεωρία ισοδυναμίας ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    badgeProblem: "ΠΡΟΒΛΗΜΑ",
    placeholderInput: "π.χ. 3/4 ή 12",
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
    pageTitle: "Exercises: Equivalent Fractions | Grade 7",
    pageDesc: "12 dynamic exercises and word problems on fraction expansion, simplification, and equivalence for Grade 7.",
    backText: "Grade 7",
    btnTheory: "THEORY",
    badgeChapter: "GRADE 7 • PRACTICE",
    titleMain: "Equivalent Fractions",
    descMain: "Solve the following 12 selected exercises (10 calculation/theory questions ＋ 2 real-life word problems). Click «CHECK ANSWERS» to view your score and detailed solutions.",
    badgeProblem: "PROBLEM",
    placeholderInput: "e.g. 3/4 or 12",
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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ ΙΣΟΔΥΝΑΜΙΑΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Εύρεση αγνώστου αριθμητή με διαστολή (Input)
  (locale) => {
    const a = randInt(2, 5);
    const b = randInt(3, 7);
    const k = randInt(2, 6);
    const newDen = b * k;
    const ans = a * k;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΙΑΣΤΟΛΗ ΚΛΑΣΜΑΤΩΝ' : 'FRACTION EXPANSION',
      question: locale === 'el'
        ? `Συμπλήρωσε τον αριθμητή x ώστε τα κλάσματα να είναι ισοδύναμα: ${htmlFrac(a, b)} ＝ ${htmlFrac('x', newDen)}`
        : `Find the numerator x so that the fractions are equivalent: ${htmlFrac(a, b)} ＝ ${htmlFrac('x', newDen)}`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Ο παρονομαστής πολλαπλασιάστηκε με το ${k} (${b} · ${k} ＝ ${newDen}). Πολλαπλασιάζουμε και τον αριθμητή: x ＝ ${a} · ${k} ＝ ${ans}.`
        : `The denominator was multiplied by ${k} (${b} · ${k} ＝ ${newDen}). Multiply the numerator accordingly: x ＝ ${a} · ${k} ＝ ${ans}.`,
    };
  },

  // 2. Εύρεση αγνώστου παρονομαστή με διαστολή (Input)
  (locale) => {
    const a = randInt(2, 6);
    const b = randInt(3, 8);
    const k = randInt(2, 5);
    const newNum = a * k;
    const ans = b * k;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΙΑΣΤΟΛΗ ΚΛΑΣΜΑΤΩΝ' : 'FRACTION EXPANSION',
      question: locale === 'el'
        ? `Συμπλήρωσε τον παρονομαστή y ώστε τα κλάσματα να είναι ισοδύναμα: ${htmlFrac(a, b)} ＝ ${htmlFrac(newNum, 'y')}`
        : `Find the denominator y so that the fractions are equivalent: ${htmlFrac(a, b)} ＝ ${htmlFrac(newNum, 'y')}`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Ο αριθμητής πολλαπλασιάστηκε με το ${k} (${a} · ${k} ＝ ${newNum}). Πολλαπλασιάζουμε και τον παρονομαστή: y ＝ ${b} · ${k} ＝ ${ans}.`
        : `The numerator was multiplied by ${k} (${a} · ${k} ＝ ${newNum}). Multiply the denominator accordingly: y ＝ ${b} · ${k} ＝ ${ans}.`,
    };
  },

  // 3. Απλοποίηση σε ανάγωγο κλάσμα (Input)
  (locale) => {
    const baseN = randInt(2, 5);
    const baseD = randInt(baseN + 1, 9);
    const g0 = gcd(baseN, baseD);
    const redN = baseN / g0;
    const redD = baseD / g0;
    const k = randInt(2, 5);
    const num = redN * k;
    const den = redD * k;
    const totalGcd = k;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΠΛΟΠΟΙΗΣΗ ΣΕ ΑΝΑΓΩΓΟ' : 'SIMPLIFICATION TO IRREDUCIBLE',
      question: locale === 'el'
        ? `Απλοποίησε το κλάσμα ${htmlFrac(num, den)} στην ανάγωγη μορφή του (μορφή α/β):`
        : `Simplify the fraction ${htmlFrac(num, den)} to its irreducible form (format a/b):`,
      correctAnswer: `${redN}/${redD}`,
      solution: locale === 'el'
        ? `Διαιρούμε αριθμητή και παρονομαστή με τον Μ.Κ.Δ.(${num}, ${den}) ＝ ${totalGcd}: ${num} : ${totalGcd} ＝ ${redN} και ${den} : ${totalGcd} ＝ ${redD}. Άρα ${htmlFrac(redN, redD)}.`
        : `Divide numerator and denominator by their GCD(${num}, ${den}) ＝ ${totalGcd}: ${num} : ${totalGcd} ＝ ${redN} and ${den} : ${totalGcd} ＝ ${redD}. Thus ${htmlFrac(redN, redD)}.`,
    };
  },

  // 4. Έλεγχος ισοδυναμίας με χιαστί γινόμενα (MCQ)
  (locale) => {
    const a = 3;
    const b = 4;
    const k = 3;
    const c = a * k;
    const d = b * k;
    const prod = a * d;
    const correct = locale === 'el'
      ? `Ναι, γιατί τα χιαστί γινόμενα είναι ίσα (3 · 12 ＝ 4 · 9 ＝ 36)`
      : `Yes, because the cross-products are equal (3 · 12 ＝ 4 · 9 ＝ 36)`;
    const candidates = locale === 'el'
      ? [
          'Όχι, γιατί έχουν διαφορετικούς όρους',
          'Όχι, γιατί 3 · 9 ≠ 4 · 12',
          'Μόνο αν είναι και τα δύο αρνητικά',
        ]
      : [
          'No, because their terms are different',
          'No, because 3 · 9 ≠ 4 · 12',
          'Only if both fractions are negative',
        ];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΛΕΓΧΟΣ ΙΣΟΔΥΝΑΜΙΑΣ' : 'EQUIVALENCE CHECK',
      question: locale === 'el'
        ? `Είναι τα κλάσματα ${htmlFrac(a, b)} και ${htmlFrac(c, d)} ισοδύναμα;`
        : `Are the fractions ${htmlFrac(a, b)} and ${htmlFrac(c, d)} equivalent?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Ελέγχουμε τα χιαστί γινόμενα: ${a} · ${d} ＝ ${prod} και ${b} · ${c} ＝ ${prod}. Επειδή είναι ίσα, τα κλάσματα είναι ισοδύναμα.`
        : `Check the cross-products: ${a} · ${d} ＝ ${prod} and ${b} · ${c} ＝ ${prod}. Since they are equal, the fractions are equivalent.`,
    };
  },

  // 5. Εύρεση άγνωστου με χιαστί γινόμενα (Input)
  (locale) => {
    const a = randInt(3, 7);
    const b = randInt(4, 9);
    const k = randInt(2, 4);
    const c = a * k;
    const ans = b * k;
    const prod = b * c;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΧΙΑΣΤΙ ΓΙΝΟΜΕΝΑ' : 'CROSS-PRODUCTS',
      question: locale === 'el'
        ? `Υπολόγισε τον άγνωστο x από την αναλογία: ${htmlFrac(a, b)} ＝ ${htmlFrac(c, 'x')}`
        : `Find the unknown value x from the proportion: ${htmlFrac(a, b)} ＝ ${htmlFrac(c, 'x')}`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Εφαρμόζουμε χιαστί γινόμενα: ${a} · x ＝ ${b} · ${c} ⟺ ${a} · x ＝ ${prod} ⟺ x ＝ ${prod} : ${a} ＝ ${ans}.`
        : `Apply cross-products: ${a} · x ＝ ${b} · ${c} ⟺ ${a} · x ＝ ${prod} ⟺ x ＝ ${prod} : ${a} ＝ ${ans}.`,
    };
  },

  // 6. Ισοδύναμο κλάσμα με αρνητικό πρόσημο (Input)
  (locale) => {
    const a = 2;
    const b = 5;
    const k = randInt(2, 5);
    const newDen = b * k;
    const ans = -(a * k);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΑ ΙΣΟΔΥΝΑΜΑ ΚΛΑΣΜΑΤΑ' : 'NEGATIVE EQUIVALENT FRACTIONS',
      question: locale === 'el'
        ? `Συμπλήρωσε τον ακέραιο x ώστε: ${htmlFrac(-a, b)} ＝ ${htmlFrac('x', newDen)}`
        : `Fill in the integer x such that: ${htmlFrac(-a, b)} ＝ ${htmlFrac('x', newDen)}`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Διατηρούμε το αρνητικό πρόσημο: x ＝ (－${a}) · ${k} ＝ ${ans}.`
        : `Preserve the negative sign: x ＝ (－${a}) · ${k} ＝ ${ans}.`,
    };
  },

  // 7. Πότε ένα κλάσμα λέγεται ανάγωγο (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Όταν ο αριθμητής και ο παρονομαστής έχουν Μ.Κ.Δ. ＝ 1 (πρώτοι μεταξύ τους)'
      : 'When numerator and denominator have GCD ＝ 1 (coprime)';
    const candidates = locale === 'el'
      ? [
          'Όταν ο αριθμητής είναι μικρότερος από τον παρονομαστή',
          'Όταν ο παρονομαστής είναι πρώτος αριθμός',
          'Όταν δεν έχει δεκαδικό μέρος',
        ]
      : [
          'When the numerator is strictly smaller than the denominator',
          'When the denominator is a prime number',
          'When it has no decimal part',
        ];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΘΕΩΡΙΑ: ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ' : 'THEORY: IRREDUCIBLE FRACTION',
      question: locale === 'el'
        ? `Πότε ένα κλάσμα ${htmlFrac('α', 'β')} ονομάζεται ανάγωγο;`
        : `When is a fraction ${htmlFrac('a', 'b')} called irreducible?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Ανάγωγο είναι το κλάσμα που δεν απλοποιείται άλλο, δηλαδή όταν ο αριθμητής και ο παρονομαστής έχουν μοναδικό κοινό διαιρέτη το 1.`
        : `A fraction is irreducible when it cannot be simplified further, meaning its numerator and denominator share no common factors other than 1.`,
    };
  },

  // 8. Απλοποίηση καταχρηστικού κλάσματος (α > β) σε ανάγωγο (Input)
  (locale) => {
    const redN = randInt(5, 8);
    const redD = randInt(2, 4);
    const k = randInt(2, 4);
    const num = redN * k;
    const den = redD * k;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΚΑΤΑΧΡΗΣΤΙΚΑ ΚΛΑΣΜΑΤΑ' : 'IMPROPER FRACTIONS',
      question: locale === 'el'
        ? `Απλοποίησε το κλάσμα ${htmlFrac(num, den)} στην ανάγωγη μορφή του (μορφή α/β):`
        : `Simplify the improper fraction ${htmlFrac(num, den)} to its irreducible form (format a/b):`,
      correctAnswer: `${redN}/${redD}`,
      solution: locale === 'el'
        ? `Διαιρούμε και τους δύο όρους με το ${k}: ${num} : ${k} ＝ ${redN} και ${den} : ${k} ＝ ${redD}. Άρα ${htmlFrac(redN, redD)}.`
        : `Divide both terms by ${k}: ${num} : ${k} ＝ ${redN} and ${den} : ${k} ＝ ${redD}. Thus ${htmlFrac(redN, redD)}.`,
    };
  },

  // 9. Διαστολή με δεκαδικό παρονομαστή 100 (Input)
  (locale) => {
    const a = randInt(3, 9);
    const b = 20;
    const mult = 5;
    const ans = a * mult;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΕΤΑΤΡΟΠΗ ΣΕ ΕΚΑΤΟΣΤΑ' : 'CONVERSION TO HUNDREDTHS',
      question: locale === 'el'
        ? `Γράψε το κλάσμα ${htmlFrac(a, b)} ως ισοδύναμο με παρονομαστή το 100. Ποιος είναι ο αριθμητής;`
        : `Write the fraction ${htmlFrac(a, b)} as an equivalent fraction with denominator 100. What is the numerator?`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Πολλαπλασιάζουμε αριθμητή και παρονομαστή με το 5: ${a} · 5 ＝ ${ans}. Το κλάσμα είναι ${htmlFrac(ans, 100)}.`
        : `Multiply numerator and denominator by 5: ${a} · 5 ＝ ${ans}. The fraction is ${htmlFrac(ans, 100)}.`,
    };
  },

  // 10. Μη ισοδύναμα κλάσματα (MCQ)
  (locale) => {
    const correct = `${htmlFrac(2, 3)} ${locale === 'el' ? 'και' : 'and'} ${htmlFrac(4, 9)}`;
    const candidates = [
      `${htmlFrac(1, 2)} ${locale === 'el' ? 'και' : 'and'} ${htmlFrac(4, 8)}`,
      `${htmlFrac(3, 5)} ${locale === 'el' ? 'και' : 'and'} ${htmlFrac(6, 10)}`,
      `${htmlFrac(4, 7)} ${locale === 'el' ? 'και' : 'and'} ${htmlFrac(12, 21)}`,
    ];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΛΕΓΧΟΣ ΙΣΟΔΥΝΑΜΙΑΣ' : 'EQUIVALENCE CHECK',
      question: locale === 'el'
        ? `Ποιο από τα παρακάτω ζεύγη κλασμάτων ΔΕΝ είναι ισοδύναμο;`
        : `Which of the following fraction pairs is NOT equivalent?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Στο ζεύγος ${htmlFrac(2, 3)} και ${htmlFrac(4, 9)} τα χιαστί γινόμενα είναι 2 · 9 ＝ 18 και 3 · 4 ＝ 12 (18 ≠ 12), άρα δεν είναι ισοδύναμα.`
        : `For the pair ${htmlFrac(2, 3)} and ${htmlFrac(4, 9)}, cross-products are 2 · 9 ＝ 18 and 3 · 4 ＝ 12 (18 ≠ 12), so they are not equivalent.`,
    };
  },

  // 11. Διπλή διαστολή (Input)
  (locale) => {
    const a = 1;
    const b = 3;
    const k = randInt(4, 8);
    const ans = a * k;
    const newDen = b * k;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΙΑΣΤΟΛΗ ΚΛΑΣΜΑΤΩΝ' : 'FRACTION EXPANSION',
      question: locale === 'el'
        ? `Βρες τον αριθμητή x ώστε: ${htmlFrac(a, b)} ＝ ${htmlFrac('x', newDen)}`
        : `Find the numerator x such that: ${htmlFrac(a, b)} ＝ ${htmlFrac('x', newDen)}`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `x ＝ 1 · ${k} ＝ ${ans}.`
        : `x ＝ 1 · ${k} ＝ ${ans}.`,
    };
  },

  // 12. Απλοποίηση με μεγάλο κοινό διαιρέτη (Input)
  (locale) => {
    const redN = randInt(2, 5);
    const redD = randInt(6, 11);
    const g0 = gcd(redN, redD);
    const n = redN / g0;
    const d = redD / g0;
    const k = 10;
    const num = n * k;
    const den = d * k;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΠΛΟΠΟΙΗΣΗ ΜΕ ΤΟ 10' : 'SIMPLIFYING BY 10',
      question: locale === 'el'
        ? `Απλοποίησε το κλάσμα ${htmlFrac(num, den)} σε ανάγωγο (μορφή α/β):`
        : `Simplify the fraction ${htmlFrac(num, den)} to an irreducible fraction (format a/b):`,
      correctAnswer: `${n}/${d}`,
      solution: locale === 'el'
        ? `Διαιρούμε αριθμητή και παρονομαστή με το 10: ${num} : 10 ＝ ${n} και ${den} : 10 ＝ ${d}. Άρα ${htmlFrac(n, d)}.`
        : `Divide numerator and denominator by 10: ${num} : 10 ＝ ${n} and ${den} : 10 ＝ ${d}. Thus ${htmlFrac(n, d)}.`,
    };
  },

  // 13. Χιαστί γινόμενα με αρνητικούς αριθμούς (Input)
  (locale) => {
    const ans = -10;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΧΙΑΣΤΙ ΓΙΝΟΜΕΝΑ & ΠΡΟΣΗΜΑ' : 'CROSS-PRODUCTS & SIGNS',
      question: locale === 'el'
        ? `Αν ${htmlFrac(-2, 5)} ＝ ${htmlFrac('x', 25)}, ποια είναι η τιμή του x;`
        : `If ${htmlFrac(-2, 5)} ＝ ${htmlFrac('x', 25)}, what is the value of x?`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `5 · x ＝ (－2) · 25 ⟺ 5 · x ＝ －50 ⟺ x ＝ －10.`
        : `5 · x ＝ (－2) · 25 ⟺ 5 · x ＝ －50 ⟺ x ＝ －10.`,
    };
  },

  // 14. Εύρεση του παράγοντα απλοποίησης (Input)
  (locale) => {
    const k = randInt(3, 7);
    const a = 2 * k;
    const b = 5 * k;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΕΓΙΣΤΟΣ ΚΟΙΝΟΣ ΔΙΑΙΡΕΤΗΣ' : 'GREATEST COMMON DIVISOR',
      question: locale === 'el'
        ? `Με ποιον αριθμό πρέπει να διαιρεθούν και οι δύο όροι του κλάσματος ${htmlFrac(a, b)} για να προκύψει το ανάγωγο ${htmlFrac(2, 5)};`
        : `By what number must both terms of ${htmlFrac(a, b)} be divided to yield the irreducible fraction ${htmlFrac(2, 5)}?`,
      correctAnswer: k.toString(),
      solution: locale === 'el'
        ? `Ο αριθμητής ${a} διαιρείται με το ${k} για να δώσει 2 (${a} : ${k} ＝ 2), άρα ο συντελεστής είναι το ${k}.`
        : `The numerator ${a} is divided by ${k} to give 2 (${a} : ${k} ＝ 2), so the simplifying factor is ${k}.`,
    };
  },

  // 15. Ισοδυναμία ακέραιου με κλάσμα (Input)
  (locale) => {
    const whole = randInt(3, 7);
    const den = randInt(2, 5);
    const ans = whole * den;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΚΕΡΑΙΟΣ ΩΣ ΚΛΑΣΜΑ' : 'INTEGER AS FRACTION',
      question: locale === 'el'
        ? `Γράψε τον ακέραιο <strong>${whole}</strong> ως ισοδύναμο κλάσμα με παρονομαστή το ${den}. Ποιος είναι ο αριθμητής;`
        : `Express the integer <strong>${whole}</strong> as an equivalent fraction with denominator ${den}. What is the numerator?`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Ισχύει ${whole} ＝ ${htmlFrac(whole, 1)} ＝ ${htmlFrac(`${whole} · ${den}`, den)} ＝ ${htmlFrac(ans, den)}. Ο αριθμητής είναι ${ans}.`
        : `We have ${whole} ＝ ${htmlFrac(whole, 1)} ＝ ${htmlFrac(`${whole} · ${den}`, den)} ＝ ${htmlFrac(ans, den)}. The numerator is ${ans}.`,
    };
  },

  // 16. Έλεγχος ισότητας αλυσίδας κλασμάτων (MCQ)
  (locale) => {
    const correct = `${htmlFrac(1, 2)} ＝ ${htmlFrac(2, 4)} ＝ ${htmlFrac(3, 6)} ＝ ${htmlFrac(4, 8)}`;
    const candidates = [
      `${htmlFrac(1, 2)} ＝ ${htmlFrac(2, 3)} ＝ ${htmlFrac(3, 4)} ＝ ${htmlFrac(4, 5)}`,
      `${htmlFrac(2, 5)} ＝ ${htmlFrac(4, 10)} ＝ ${htmlFrac(6, 12)}`,
      `${htmlFrac(3, 4)} ＝ ${htmlFrac(6, 8)} ＝ ${htmlFrac(9, 15)}`,
    ];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΑΛΥΣΙΔΑ ΙΣΟΔΥΝΑΜΩΝ' : 'EQUIVALENT CHAIN',
      question: locale === 'el'
        ? `Ποια από τις παρακάτω αλυσίδες ισοδύναμων κλασμάτων είναι απόλυτα σωστή;`
        : `Which of the following chains of equivalent fractions is completely correct?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Κάθε κλάσμα προκύπτει πολλαπλασιάζοντας αριθμητή και παρονομαστή του ${htmlFrac(1, 2)} με το 2, το 3 και το 4 αντίστοιχα.`
        : `Each fraction is formed by multiplying numerator and denominator of ${htmlFrac(1, 2)} by 2, 3, and 4 respectively.`,
    };
  },

  // 17. Απλοποίηση κλάσματος με ίσους όρους (Input)
  (locale) => {
    const n = randInt(12, 45);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΠΛΟΠΟΙΗΣΗ' : 'SIMPLIFICATION',
      question: locale === 'el'
        ? `Ποια είναι η τελική ανάγωγη τιμή του κλάσματος ${htmlFrac(n, n)};`
        : `What is the simplified irreducible value of the fraction ${htmlFrac(n, n)}?`,
      correctAnswer: '1',
      solution: locale === 'el'
        ? `Κάθε κλάσμα με ίσο μη μηδενικό αριθμητή και παρονομαστή ισούται με 1 (${n} : ${n} ＝ 1).`
        : `Any fraction with equal non-zero numerator and denominator equals 1 (${n} : ${n} ＝ 1).`,
    };
  },

  // 18. Αντίθετα ισοδύναμα (Input)
  (locale) => {
    const a = 3;
    const b = 7;
    const k = 2;
    const num = a * k;
    const ans = -(b * k);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΣΗΜΑ ΚΛΑΣΜΑΤΩΝ' : 'SIGNS IN FRACTIONS',
      question: locale === 'el'
        ? `Αν ${htmlFrac(-a, b)} ＝ ${htmlFrac(num, 'y')}, ποιος είναι ο παρονομαστής y;`
        : `If ${htmlFrac(-a, b)} ＝ ${htmlFrac(num, 'y')}, what is the denominator y?`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Επειδή το κλάσμα είναι αρνητικό και ο αριθμητής είναι θετικός (＋${num}), το μείον μεταφέρεται στον παρονομαστή: y ＝ －${b * k}.`
        : `Because the fraction is negative and the numerator is positive (＋${num}), the minus sign shifts to the denominator: y ＝ －${b * k}.`,
    };
  },

  // 19. Εύρεση πολλαπλασιαστή διαστολής (Input)
  (locale) => {
    const a = randInt(3, 5);
    const b = randInt(6, 8);
    const k = randInt(3, 7);
    const newN = a * k;
    const newD = b * k;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΤΕΛΕΣΤΗΣ ΔΙΑΣΤΟΛΗΣ' : 'EXPANSION FACTOR',
      question: locale === 'el'
        ? `Με ποιον φυσικό αριθμό πολλαπλασιάστηκαν οι όροι του ${htmlFrac(a, b)} για να γίνει ${htmlFrac(newN, newD)};`
        : `By what natural number were both terms of ${htmlFrac(a, b)} multiplied to produce ${htmlFrac(newN, newD)}?`,
      correctAnswer: k.toString(),
      solution: locale === 'el'
        ? `${newN} : ${a} ＝ ${k} (ή ${newD} : ${b} ＝ ${k}).`
        : `${newN} : ${a} ＝ ${k} (or ${newD} : ${b} ＝ ${k}).`,
    };
  },

  // 20. Επιλογή ανάγωγου κλάσματος (MCQ)
  (locale) => {
    const correct = htmlFrac(7, 9);
    const candidates = [htmlFrac(4, 6), htmlFrac(10, 15), htmlFrac(6, 8)];
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΑΝΑΓΝΩΡΙΣΗ ΑΝΑΓΩΓΟΥ' : 'IDENTIFYING IRREDUCIBLE',
      question: locale === 'el'
        ? `Ποιο από τα παρακάτω κλάσματα είναι ήδη ανάγωγο;`
        : `Which of the following fractions is already irreducible?`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Το κλάσμα ${htmlFrac(7, 9)} είναι ανάγωγο γιατί ο Μ.Κ.Δ.(7, 9) ＝ 1. Όλα τα υπόλοιπα απλοποιούνται με το 2 ή το 5.`
        : `The fraction ${htmlFrac(7, 9)} is irreducible because GCD(7, 9) ＝ 1. The others can be simplified by 2 or 5.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΙΣΟΔΥΝΑΜΩΝ ΚΛΑΣΜΑΤΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Αναλογία υλικών σε συνταγή (διπλασιασμός)
  (locale) => {
    const a = 2;
    const b = 3;
    const k = 2;
    const ans = a * k;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΤΑΓΕΣ' : 'WORD PROBLEMS: RECIPES',
      question: locale === 'el'
        ? `Μια συνταγή για 4 άτομα απαιτεί ${htmlFrac(a, b)} του κιλού ζάχαρη. Αν διπλασιάσουμε τη δοσολογία για 8 άτομα, ποιος θα είναι ο νέος αριθμητής αν ο παρονομαστής γίνει 6;`
        : `A recipe for 4 people calls for ${htmlFrac(a, b)} kg of sugar. If we double the portion for 8 people, what is the new numerator if the denominator becomes 6?`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Διαστολή με το 2: ${htmlFrac(a, b)} ＝ ${htmlFrac(`${a} · ${k}`, `${b} · ${k}`)} ＝ ${htmlFrac(4, 6)}. Ο αριθμητής είναι 4.`
        : `Expansion by 2: ${htmlFrac(a, b)} ＝ ${htmlFrac(`${a} · ${k}`, `${b} · ${k}`)} ＝ ${htmlFrac(4, 6)}. The numerator is 4.`,
    };
  },

  // Πρόβλημα 2: Επίδοση σε αγώνα μπάσκετ
  (locale) => {
    const hits = 6;
    const total = 10;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ' : 'WORD PROBLEMS: SPORTS',
      question: locale === 'el'
        ? `Ένας παίκτης πέτυχε 6 καλάθια σε 10 προσπάθειες (${htmlFrac(hits, total)}). Ποιο είναι το ανάγωγο κλάσμα της ευστοχίας του (μορφή α/β);`
        : `A player scored 6 baskets in 10 attempts (${htmlFrac(hits, total)}). What is the irreducible fraction of their accuracy (format a/b)?`,
      correctAnswer: '3/5',
      solution: locale === 'el'
        ? `Απλοποιούμε με το 2: ${htmlFrac(hits, total)} ＝ ${htmlFrac('3', '5')}.`
        : `Simplify by 2: ${htmlFrac(hits, total)} ＝ ${htmlFrac('3', '5')}.`,
    };
  },

  // Πρόβλημα 3: Μοίρασμα σοκολάτας
  (locale) => {
    const pieces = 4;
    const total = 12;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΡΙΔΙΑ' : 'WORD PROBLEMS: PORTIONS',
      question: locale === 'el'
        ? `Η Ελένη έφαγε 4 από τα 12 ίσα τετραγωνάκια μιας σοκολάτας. Ποιο ανάγωγο κλάσμα της σοκολάτας έφαγε (μορφή α/β);`
        : `Helen ate 4 out of 12 equal squares of chocolate. What irreducible fraction of the chocolate did she eat (format a/b)?`,
      correctAnswer: '1/3',
      solution: locale === 'el'
        ? `Απλοποιούμε το ${htmlFrac(pieces, total)} με το 4 και βρίσκουμε ${htmlFrac('1', '3')}.`
        : `Simplify ${htmlFrac(pieces, total)} by 4 to get ${htmlFrac('1', '3')}.`,
    };
  },

  // Πρόβλημα 4: Χρόνος μελέτης
  (locale) => {
    const mins = 30;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ' : 'WORD PROBLEMS: TIME',
      question: locale === 'el'
        ? `Ο Γιάννης διάβασε για 30 λεπτά (δηλαδή ${htmlFrac(mins, 60)} της ώρας). Ποιο ανάγωγο κλάσμα της ώρας μελέτησε (μορφή α/β);`
        : `John studied for 30 minutes (which is ${htmlFrac(mins, 60)} of an hour). What irreducible fraction of an hour did he study (format a/b)?`,
      correctAnswer: '1/2',
      solution: locale === 'el'
        ? `Απλοποιούμε με το 30: ${htmlFrac('30', '60')} ＝ ${htmlFrac('1', '2')} της ώρας.`
        : `Simplify by 30: ${htmlFrac('30', '60')} ＝ ${htmlFrac('1', '2')} of an hour.`,
    };
  },

  // Πρόβλημα 5: Βαθμολογία σε τεστ
  (locale) => {
    const grade = 15;
    const maxGrade = 20;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ' : 'WORD PROBLEMS: GRADES',
      question: locale === 'el'
        ? `Σε ένα τεστ ένας μαθητής πήρε 15 στα 20 (${htmlFrac(grade, maxGrade)}). Ποιο ανάγωγο κλάσμα εκφράζει την επίδοσή του (μορφή α/β);`
        : `On a test, a student scored 15 out of 20 (${htmlFrac(grade, maxGrade)}). What irreducible fraction represents their score (format a/b)?`,
      correctAnswer: '3/4',
      solution: locale === 'el'
        ? `Απλοποιούμε με το 5: ${htmlFrac('15', '20')} ＝ ${htmlFrac('3', '4')}.`
        : `Simplify by 5: ${htmlFrac('15', '20')} ＝ ${htmlFrac('3', '4')}.`,
    };
  },

  // Πρόβλημα 6: Στάθμη δεξαμενής πετρελαίου
  (locale) => {
    const filled = 8;
    const total = 10;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ' : 'WORD PROBLEMS: CAPACITY',
      question: locale === 'el'
        ? `Μια δεξαμενή έχει γεμίσει κατά τα ${htmlFrac(filled, total)}. Ποιο ανάγωγο κλάσμα εκφράζει το γεμάτο μέρος (μορφή α/β);`
        : `A fuel tank is filled to ${htmlFrac(filled, total)}. What irreducible fraction represents the filled portion (format a/b)?`,
      correctAnswer: '4/5',
      solution: locale === 'el'
        ? `Διαιρούμε με το 2: ${htmlFrac('8', '10')} ＝ ${htmlFrac('4', '5')}.`
        : `Divide by 2: ${htmlFrac('8', '10')} ＝ ${htmlFrac('4', '5')}.`,
    };
  },

  // Πρόβλημα 7: Ποσοστό κοριτσιών σε τάξη
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΟΛΕΙΟ' : 'WORD PROBLEMS: SCHOOL',
      question: locale === 'el'
        ? `Σε ένα τμήμα 20 μαθητών υπάρχουν 12 κορίτσια. Ποιο είναι το ανάγωγο κλάσμα των κοριτσιών ως προς το σύνολο της τάξης (μορφή α/β);`
        : `In a class of 20 students, 12 are girls. What is the irreducible fraction of girls relative to the total class (format a/b)?`,
      correctAnswer: '3/5',
      solution: locale === 'el'
        ? `Απλοποιούμε το ${htmlFrac('12', '20')} δια του 4: ${htmlFrac('3', '5')}.`
        : `Simplify ${htmlFrac('12', '20')} by dividing by 4: ${htmlFrac('3', '5')}.`,
    };
  },

  // Πρόβλημα 8: Διαδρομή μαραθωνίου
  (locale) => {
    const done = 25;
    const total = 100;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΣΤΑΣΗ' : 'WORD PROBLEMS: DISTANCE',
      question: locale === 'el'
        ? `Ένας δρομέας έχει καλύψει τα ${htmlFrac(done, total)} της διαδρομής. Ποιο ανάγωγο κλάσμα της διαδρομής έχει διανύσει (μορφή α/β);`
        : `A runner covered ${htmlFrac(done, total)} of the course. What irreducible fraction of the route have they completed (format a/b)?`,
      correctAnswer: '1/4',
      solution: locale === 'el'
        ? `Διαιρούμε με το 25: ${htmlFrac('25', '100')} ＝ ${htmlFrac('1', '4')}.`
        : `Divide by 25: ${htmlFrac('25', '100')} ＝ ${htmlFrac('1', '4')}.`,
    };
  },

  // Πρόβλημα 9: Έκπτωση σε τιμή προϊόντος
  (locale) => {
    const discount = 20;
    const original = 50;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'WORD PROBLEMS: FINANCE',
      question: locale === 'el'
        ? `Σε ένα μπουφάν αξίας 50 € έγινε έκπτωση 20 € (${htmlFrac(discount, original)}). Ποιο ανάγωγο κλάσμα της αρχικής τιμής αντιστοιχεί στην έκπτωση (μορφή α/β);`
        : `A jacket priced at 50 € was discounted by 20 € (${htmlFrac(discount, original)}). What irreducible fraction of the original price does the discount represent (format a/b)?`,
      correctAnswer: '2/5',
      solution: locale === 'el'
        ? `Απλοποιούμε με το 10: ${htmlFrac('20', '50')} ＝ ${htmlFrac('2', '5')}.`
        : `Simplify by 10: ${htmlFrac('20', '50')} ＝ ${htmlFrac('2', '5')}.`,
    };
  },

  // Πρόβλημα 10: Συσκευασία αυγών
  (locale) => {
    const used = 6;
    const total = 12;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΑΓΕΙΡΙΚΗ' : 'WORD PROBLEMS: COOKING',
      question: locale === 'el'
        ? `Από μια καρτέλα 12 αυγών χρησιμοποιήθηκαν τα 6. Ποιο ανάγωγο κλάσμα των αυγών χρησιμοποιήθηκε (μορφή α/β);`
        : `Out of an egg carton of 12 eggs, 6 were used. What irreducible fraction of the eggs was used (format a/b)?`,
      correctAnswer: '1/2',
      solution: locale === 'el'
        ? `Απλοποιούμε με το 6: ${htmlFrac('6', '12')} ＝ ${htmlFrac('1', '2')}.`
        : `Simplify by 6: ${htmlFrac('6', '12')} ＝ ${htmlFrac('1', '2')}.`,
    };
  },

  // Πρόβλημα 11: Σελίδες βιβλίου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΝΑΓΝΩΣΗ' : 'WORD PROBLEMS: READING',
      question: locale === 'el'
        ? `Η Μαρία διάβασε 50 σελίδες από ένα βιβλίο 200 σελίδων. Ποιο ανάγωγο κλάσμα του βιβλίου διάβασε (μορφή α/β);`
        : `Maria read 50 pages of a 200-page book. What irreducible fraction of the book did she read (format a/b)?`,
      correctAnswer: '1/4',
      solution: locale === 'el'
        ? `Διαιρούμε με το 50: ${htmlFrac('50', '200')} ＝ ${htmlFrac('1', '4')}.`
        : `Divide by 50: ${htmlFrac('50', '200')} ＝ ${htmlFrac('1', '4')}.`,
    };
  },

  // Πρόβλημα 12: Φύτευση δέντρων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΠΕΡΙΒΑΛΛΟΝ' : 'WORD PROBLEMS: ENVIRONMENT',
      question: locale === 'el'
        ? `Σε ένα πάρκο φυτεύτηκαν 18 από τα 24 προβλεπόμενα δέντρα. Ποιο ανάγωγο κλάσμα των δέντρων έχει φυτευτεί (μορφή α/β);`
        : `In a public park, 18 out of 24 planned trees were planted. What irreducible fraction of the trees has been planted (format a/b)?`,
      correctAnswer: '3/4',
      solution: locale === 'el'
        ? `Απλοποιούμε με το 6: ${htmlFrac('18', '24')} ＝ ${htmlFrac('3', '4')}.`
        : `Simplify by 6: ${htmlFrac('18', '24')} ＝ ${htmlFrac('3', '4')}.`,
    };
  },

  // Πρόβλημα 13: Ώρες ύπνου
  (locale) => {
    const sleepHours = 8;
    const dayHours = 24;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΥΓΕΙΑ' : 'WORD PROBLEMS: HEALTH',
      question: locale === 'el'
        ? `Ένας έφηβος κοιμάται 8 ώρες το εικοσιτετράωρο (${htmlFrac(sleepHours, dayHours)}). Ποιο ανάγωγο κλάσμα της ημέρας αφιερώνει στον ύπνο (μορφή α/β);`
        : `A teenager sleeps 8 hours per day (${htmlFrac(sleepHours, dayHours)}). What irreducible fraction of the day do they spend sleeping (format a/b)?`,
      correctAnswer: '1/3',
      solution: locale === 'el'
        ? `Απλοποιούμε με το 8: ${htmlFrac('8', '24')} ＝ ${htmlFrac('1', '3')}.`
        : `Simplify by 8: ${htmlFrac('8', '24')} ＝ ${htmlFrac('1', '3')}.`,
    };
  },

  // Πρόβλημα 14: Νίκες ποδοσφαιρικής ομάδας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ' : 'WORD PROBLEMS: SPORTS',
      question: locale === 'el'
        ? `Μια ομάδα ποδοσφαίρου κέρδισε τους 14 από τους 21 αγώνες που έδωσε. Ποιο ανάγωγο κλάσμα των αγώνων κέρδισε (μορφή α/β);`
        : `A football team won 14 out of the 21 matches played. What irreducible fraction of the matches did they win (format a/b)?`,
      correctAnswer: '2/3',
      solution: locale === 'el'
        ? `Απλοποιούμε με το 7: ${htmlFrac('14', '21')} ＝ ${htmlFrac('2', '3')}.`
        : `Simplify by 7: ${htmlFrac('14', '21')} ＝ ${htmlFrac('2', '3')}.`,
    };
  },

  // Πρόβλημα 15: Μπαταρία tablet
  (locale) => {
    const remaining = 75;
    const full = 100;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ' : 'WORD PROBLEMS: TECHNOLOGY',
      question: locale === 'el'
        ? `Η μπαταρία ενός tablet βρίσκεται στο 75% (${htmlFrac(remaining, full)}). Ποιο ανάγωγο κλάσμα της πλήρους φόρτισης απομένει (μορφή α/β);`
        : `A tablet's battery is at 75% (${htmlFrac(remaining, full)}). What irreducible fraction of the total battery charge remains (format a/b)?`,
      correctAnswer: '3/4',
      solution: locale === 'el'
        ? `Απλοποιούμε με το 25: ${htmlFrac('75', '100')} ＝ ${htmlFrac('3', '4')}.`
        : `Simplify by 25: ${htmlFrac('75', '100')} ＝ ${htmlFrac('3', '4')}.`,
    };
  },

  // Πρόβλημα 16: Αποταμίευση χαρτζιλικιού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'WORD PROBLEMS: FINANCE',
      question: locale === 'el'
        ? `Από χαρτζιλίκι 45 € ένας μαθητής αποταμίευσε τα 15 €. Ποιο ανάγωγο κλάσμα του ποσού έβαλε στον κουμπαρά του (μορφή α/β);`
        : `From a 45 € allowance, a student saved 15 €. What irreducible fraction of the money did they save (format a/b)?`,
      correctAnswer: '1/3',
      solution: locale === 'el'
        ? `Διαιρούμε με το 15: ${htmlFrac('15', '45')} ＝ ${htmlFrac('1', '3')}.`
        : `Divide by 15: ${htmlFrac('15', '45')} ＝ ${htmlFrac('1', '3')}.`,
    };
  },

  // Πρόβλημα 17: Καθαρός χρόνος παιχνιδιού
  (locale) => {
    const playMins = 40;
    const hourMins = 60;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ' : 'WORD PROBLEMS: TIME',
      question: locale === 'el'
        ? `Ένας αγώνας μπάσκετ διαρκεί 40 λεπτά καθαρού χρόνου (${htmlFrac(playMins, hourMins)} της ώρας). Ποιο ανάγωγο κλάσμα της ώρας είναι αυτό (μορφή α/β);`
        : `A basketball game lasts 40 minutes of playing time (${htmlFrac(playMins, hourMins)} of an hour). What irreducible fraction of an hour is this (format a/b)?`,
      correctAnswer: '2/3',
      solution: locale === 'el'
        ? `Απλοποιούμε με το 20: ${htmlFrac('40', '60')} ＝ ${htmlFrac('2', '3')}.`
        : `Simplify by 20: ${htmlFrac('40', '60')} ＝ ${htmlFrac('2', '3')}.`,
    };
  },

  // Πρόβλημα 18: Μερίδιο συνιδιοκτησίας
  (locale) => {
    const share = 300;
    const total = 1000;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΚΙΝΗΤΑ' : 'WORD PROBLEMS: PROPERTY',
      question: locale === 'el'
        ? `Σε μια πολυκατοικία ένα διαμέρισμα κατέχει 300 χιλιοστά (${htmlFrac(share, total)}) επί του οικοπέδου. Ποιο είναι το ανάγωγο κλάσμα της συνιδιοκτησίας του (μορφή α/β);`
        : `In an apartment building, a flat owns 300 thousandths (${htmlFrac(share, total)}) of the lot. What is the irreducible fraction of co-ownership (format a/b)?`,
      correctAnswer: '3/10',
      solution: locale === 'el'
        ? `Απλοποιούμε με το 100: ${htmlFrac('300', '1000')} ＝ ${htmlFrac('3', '10')}.`
        : `Simplify by 100: ${htmlFrac('300', '1000')} ＝ ${htmlFrac('3', '10')}.`,
    };
  },

  // Πρόβλημα 19: Επιτυχείς βολές τοξοβολίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ' : 'WORD PROBLEMS: SPORTS',
      question: locale === 'el'
        ? `Ένας τοξοβόλος πέτυχε το κέντρο του στόχου σε 16 από τις 20 βολές του. Ποιο ανάγωγο κλάσμα εκφράζει την επιτυχία του (μορφή α/β);`
        : `An archer hit the center in 16 out of 20 shots. What irreducible fraction represents their success rate (format a/b)?`,
      correctAnswer: '4/5',
      solution: locale === 'el'
        ? `Απλοποιούμε με το 4: ${htmlFrac('16', '20')} ＝ ${htmlFrac('4', '5')}.`
        : `Simplify by 4: ${htmlFrac('16', '20')} ＝ ${htmlFrac('4', '5')}.`,
    };
  },

  // Πρόβλημα 20: Κατανάλωση αποθέματος νερού
  (locale) => {
    const drank = 350;
    const bottle = 500;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ' : 'WORD PROBLEMS: CAPACITY',
      question: locale === 'el'
        ? `Από ένα παγούρι 500 ml καταναλώθηκαν τα 350 ml (${htmlFrac(drank, bottle)}). Ποιο ανάγωγο κλάσμα του νερού ήπιε ο αθλητής (μορφή α/β);`
        : `Out of a 500 ml water bottle, 350 ml was consumed (${htmlFrac(drank, bottle)}). What irreducible fraction of the water was drank (format a/b)?`,
      correctAnswer: '7/10',
      solution: locale === 'el'
        ? `Απλοποιούμε με το 50: ${htmlFrac('350', '500')} ＝ ${htmlFrac('7', '10')}.`
        : `Simplify by 50: ${htmlFrac('350', '500')} ＝ ${htmlFrac('7', '10')}.`,
    };
  },
];

export default function IsodinamaKlasmataAsk() {
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

    // Επιτρέπουμε αριθμούς, κόμμα, τελεία, κάθετο κλάσματος και μείον
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
    if (clean.length > 10) return;

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
      let userAns = (userAnswers[q.id] || '').trim().replace(/\s+/g, '').replace(/^\+/, '');
      let correctAns = q.correctAnswer.trim().replace(/\s+/g, '').replace(/^\+/, '');

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
          href="/a-gymnasiou/14-isodinama-klasmata"
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
              const cleanUser = userAns.trim().replace(/\s+/g, '').replace(/^\+/, '');
              const cleanCorrect = q.correctAnswer.trim().replace(/\s+/g, '').replace(/^\+/, '');

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
                          maxLength={10}
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
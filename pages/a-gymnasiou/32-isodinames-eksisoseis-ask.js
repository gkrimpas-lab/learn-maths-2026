import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Καθαρισμός τόνων στα ελληνικά κεφαλαία (διατηρείται μόνο το Α')
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

// Βοηθητική συνάρτηση κατακόρυφης κλασματικής μορφής (Safe, no-overflow)
const renderFraction = (num, den, isNeg = false) =>
  `<span class="inline-flex items-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">` +
  (isNeg ? `<span class="font-bold mr-0.5">－</span>` : ``) +
  `<span class="inline-flex flex-col text-center">` +
  `<span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${num}</span>` +
  `<span class="pt-0.5 break-all">${den}</span>` +
  `</span></span>`;

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

// Συγκεντρωτικό λεξικό όρων & μεταφράσεων (i18n)
const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Ισοδύναμες Εξισώσεις & Επίλυση | Α' Γυμνασίου",
    pageDescription: "12 δυναμικές ασκήσεις και προβλήματα στις ισοδύναμες εξισώσεις, τη μεταφορά όρων και την επίλυση για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 28 • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Ισοδύναμες Εξισώσεις & Επίλυση",
    mainSubtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 ασκήσεις κατανόησης κανόνων ισοδυναμίας και επίλυσης ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    problemBadge: "ΠΡΟΒΛΗΜΑ",
    placeholderInput: "π.χ. 7 ή -3",
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
    pageTitle: "Exercises: Equivalent Equations & Solving | Grade 7 Math",
    pageDescription: "12 dynamic exercises and word problems on equivalent equations, transposing terms, and equation solving for Grade 7 Math.",
    backText: "Grade 7 Math",
    theoryBtn: "THEORY",
    chapterBadge: "GRADE 7 • CHAPTER 28 • PRACTICE",
    mainTitle: "Equivalent Equations & Solving",
    mainSubtitle: "Solve the 12 selected exercises below (10 questions on equivalence rules and solving ＋ 2 real-world application problems). Then click 'CHECK ANSWERS' to view your score and detailed step-by-step solutions.",
    problemBadge: "PROBLEM",
    placeholderInput: "e.g. 7 or -3",
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
  }
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΙΣΟΔΥΝΑΜΩΝ ΕΞΙΣΩΣΕΩΝ & ΕΠΙΛΥΣΗΣ (el / en)
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Ορισμός ισοδύναμων εξισώσεων (MCQ)
  (locale) => {
    const elCorrect = 'Όταν έχουν ακριβώς τις ίδιες λύσεις (ή ρίζες)';
    const enCorrect = 'When they have exactly the same solutions (or roots)';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΟΡΙΣΜΟΣ ΙΣΟΔΥΝΑΜΙΑΣ' : 'DEFINITION OF EQUIVALENCE',
      question: locale === 'el'
        ? 'Πότε δύο εξισώσεις με τον ίδιο άγνωστο ονομάζονται <strong>ισοδύναμες</strong>;'
        : 'When are two equations with the same variable called <strong>equivalent</strong>?',
      options: locale === 'el'
        ? makeUniqueOptions(elCorrect, [
            'Όταν έχουν τους ίδιους συντελεστές',
            'Όταν έχουν το ίδιο δεύτερο μέλος',
            'Όταν έχουν τον ίδιο αριθμό όρων'
          ])
        : makeUniqueOptions(enCorrect, [
            'When they have the same coefficients',
            'When they have the same right-hand side',
            'When they have the same number of terms'
          ]),
      correctAnswer: locale === 'el' ? elCorrect : enCorrect,
      solution: locale === 'el'
        ? 'Δύο εξισώσεις είναι ισοδύναμες αν και μόνο αν επαληθεύονται από τις ίδιες ακριβώς τιμές του αγνώστου.'
        : 'Two equations are equivalent if and only if they are satisfied by the exact same values of the variable.',
    };
  },

  // 2. Μεταφορά όρου με αλλαγή προσήμου (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΜΕΤΑΦΟΡΑ ΟΡΟΥ' : 'TRANSPOSING TERMS',
      question: locale === 'el'
        ? 'Ποια είναι η σωστή ισοδύναμη μορφή της εξίσωσης <strong>x ＋ 5 ＝ 12</strong> μετά τη μεταφορά του 5 στο 2ο μέλος;'
        : 'What is the correct equivalent form of <strong>x ＋ 5 ＝ 12</strong> after moving 5 to the right-hand side?',
      options: makeUniqueOptions('x ＝ 12 － 5', ['x ＝ 12 ＋ 5', 'x ＝ 5 － 12', 'x ＝ 12 · 5']),
      correctAnswer: 'x ＝ 12 － 5',
      solution: locale === 'el'
        ? 'Όταν ένας όρος μεταφέρεται από το ένα μέλος στο άλλο, αλλάζει υποχρεωτικά το πρόσημό του: από ＋5 γίνεται －5.'
        : 'When a term is moved to the opposite side, its sign must be inverted: from ＋5 it becomes －5.',
    };
  },

  // 3. Επίλυση απλής εξίσωσης (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΠΙΛΥΣΗ ΜΕ ΔΙΑΙΡΕΣΗ' : 'SOLVING VIA DIVISION',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση <strong>3 · x ＝ 21</strong> και βρες την τιμή του <strong>x</strong>:'
        : 'Solve the equation <strong>3 · x ＝ 21</strong> and find the value of <strong>x</strong>:',
      correctAnswer: '7',
      solution: locale === 'el'
        ? `Διαιρούμε και τα δύο μέλη με τον συντελεστή 3: x ＝ ${renderFraction('21', '3')} ＝ 7.`
        : `Divide both sides by the coefficient 3: x ＝ ${renderFraction('21', '3')} ＝ 7.`,
    };
  },

  // 4. Μεταφορά αρνητικού όρου (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΜΕΤΑΦΟΡΑ ΟΡΟΥ' : 'TRANSPOSING TERMS',
      question: locale === 'el'
        ? 'Αν στην εξίσωση <strong>2 · x － 4 ＝ 10</strong> μεταφέρουμε το －4 στο δεύτερο μέλος, ποια ισοδύναμη εξίσωση προκύπτει;'
        : 'If we move －4 to the right-hand side in <strong>2 · x － 4 ＝ 10</strong>, which equivalent equation is formed?',
      options: makeUniqueOptions('2 · x ＝ 10 ＋ 4', ['2 · x ＝ 10 － 4', 'x ＝ 10 ＋ 4', '2 · x ＝ 4 － 10']),
      correctAnswer: '2 · x ＝ 10 ＋ 4',
      solution: locale === 'el'
        ? 'Ο όρος －4 μεταφέρεται στο δεξί μέλος και αλλάζει πρόσημο σε ＋4: 2x ＝ 10 ＋ 4.'
        : 'The term －4 is moved to the right side and changes sign to ＋4: 2x ＝ 10 ＋ 4.',
    };
  },

  // 5. Πλήρης επίλυση εξίσωσης a*x + b = c (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΛΗΡΗΣ ΕΠΙΛΥΣΗ' : 'FULL EQUATION SOLVING',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>4 · x ＋ 3 ＝ 19</strong>'
        : 'Solve the equation: <strong>4 · x ＋ 3 ＝ 19</strong>',
      correctAnswer: '4',
      solution: locale === 'el'
        ? `1. Μεταφορά όρου: 4x ＝ 19 － 3 ➔ 4x ＝ 16.<br/>2. Διαίρεση με το 4: x ＝ ${renderFraction('16', '4')} ＝ 4.`
        : `1. Transpose term: 4x ＝ 19 － 3 ➔ 4x ＝ 16.<br/>2. Divide by 4: x ＝ ${renderFraction('16', '4')} ＝ 4.`,
    };
  },

  // 6. Εξίσωση με αρνητικό αποτέλεσμα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΗ ΡΙΖΑ' : 'NEGATIVE ROOT',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>5 · x ＋ 20 ＝ 5</strong>'
        : 'Solve the equation: <strong>5 · x ＋ 20 ＝ 5</strong>',
      correctAnswer: '-3',
      solution: locale === 'el'
        ? `5x ＝ 5 － 20 ➔ 5x ＝ －15. Διαιρούμε με το 5: x ＝ ${renderFraction('15', '5', true)} ＝ －3.`
        : `5x ＝ 5 － 20 ➔ 5x ＝ －15. Divide by 5: x ＝ ${renderFraction('15', '5', true)} ＝ －3.`,
    };
  },

  // 7. Έλεγχος ισοδυναμίας δύο εξισώσεων (MCQ)
  (locale) => {
    const elCorrect = 'Ναι, διότι έχουν και οι δύο μοναδική λύση το x ＝ 4';
    const enCorrect = 'Yes, because both share the unique solution x ＝ 4';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΛΕΓΧΟΣ ΙΣΟΔΥΝΑΜΙΑΣ' : 'EQUIVALENCE CHECK',
      question: locale === 'el'
        ? 'Είναι οι εξισώσεις <strong>2 · x ＝ 8</strong> και <strong>3 · x － 2 ＝ 10</strong> ισοδύναμες;'
        : 'Are the equations <strong>2 · x ＝ 8</strong> and <strong>3 · x － 2 ＝ 10</strong> equivalent?',
      options: locale === 'el'
        ? makeUniqueOptions(elCorrect, [
            'Όχι, διότι έχουν διαφορετικούς συντελεστές',
            'Όχι, διότι η μία έχει δύο όρους και η άλλη έναν',
            'Ναι, διότι 8 ＋ 2 ＝ 10'
          ])
        : makeUniqueOptions(enCorrect, [
            'No, because they have different coefficients',
            'No, because one has two terms and the other has one',
            'Yes, because 8 ＋ 2 ＝ 10'
          ]),
      correctAnswer: locale === 'el' ? elCorrect : enCorrect,
      solution: locale === 'el'
        ? `Η πρώτη δίνει x ＝ ${renderFraction('8', '2')} ＝ 4. Η δεύτερη δίνει 3x ＝ 12 ➔ x ＝ ${renderFraction('12', '3')} ＝ 4. Έχουν την ίδια λύση, άρα είναι ισοδύναμες.`
        : `The first yields x ＝ ${renderFraction('8', '2')} ＝ 4. The second yields 3x ＝ 12 ➔ x ＝ ${renderFraction('12', '3')} ＝ 4. They share the same root, so they are equivalent.`,
    };
  },

  // 8. Επίλυση με αρνητικό συντελεστή (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ' : 'NEGATIVE COEFFICIENT',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>－3 · x ＋ 2 ＝ 14</strong>'
        : 'Solve the equation: <strong>－3 · x ＋ 2 ＝ 14</strong>',
      correctAnswer: '-4',
      solution: locale === 'el'
        ? `－3x ＝ 14 － 2 ➔ －3x ＝ 12. Διαιρούμε με το －3: x ＝ ${renderFraction('12', '－3')} ＝ －4.`
        : `－3x ＝ 14 － 2 ➔ －3x ＝ 12. Divide by －3: x ＝ ${renderFraction('12', '－3')} ＝ －4.`,
    };
  },

  // 9. Πολλαπλασιασμός με τον ίδιο αριθμό (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΚΑΝΟΝΕΣ ΙΣΟΤΗΤΑΣ' : 'PROPERTIES OF EQUALITY',
      question: locale === 'el'
        ? 'Αν στην εξίσωση <strong>x ＝ 6</strong> πολλαπλασιάσουμε και τα δύο μέλη με το 4, ποια ισοδύναμη εξίσωση προκύπτει;'
        : 'If both sides of the equation <strong>x ＝ 6</strong> are multiplied by 4, what equivalent equation is obtained?',
      options: makeUniqueOptions('4 · x ＝ 24', ['4 · x ＝ 6', 'x ＋ 4 ＝ 10', 'x ＝ 24']),
      correctAnswer: '4 · x ＝ 24',
      solution: locale === 'el'
        ? 'Πολλαπλασιάζουμε και τα δύο μέλη με το 4: 4 · x ＝ 4 · 6 ＝ 24.'
        : 'Multiply both sides by 4: 4 · x ＝ 4 · 6 ＝ 24.',
    };
  },

  // 10. Επίλυση με άγνωστο και στα δύο μέλη (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΓΝΩΣΤΟΣ ΚΑΙ ΣΤΑ ΔΥΟ ΜΕΛΗ' : 'VARIABLE ON BOTH SIDES',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>5 · x ＝ 2 · x ＋ 12</strong>'
        : 'Solve the equation: <strong>5 · x ＝ 2 · x ＋ 12</strong>',
      correctAnswer: '4',
      solution: locale === 'el'
        ? `Μεταφέρουμε το 2x αριστερά: 5x － 2x ＝ 12 ➔ 3x ＝ 12. Διαιρούμε με το 3: x ＝ ${renderFraction('12', '3')} ＝ 4.`
        : `Move 2x to the left: 5x － 2x ＝ 12 ➔ 3x ＝ 12. Divide by 3: x ＝ ${renderFraction('12', '3')} ＝ 4.`,
    };
  },

  // 11. Διαίρεση με μηδέν (MCQ)
  (locale) => {
    const elCorrect = 'Όχι, η διαίρεση με το μηδέν δεν ορίζεται στα Μαθηματικά';
    const enCorrect = 'No, division by zero is undefined in mathematics';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ ΙΣΟΤΗΤΑΣ' : 'PROPERTIES OF EQUALITY',
      question: locale === 'el'
        ? 'Επιτρέπεται να διαιρέσουμε και τα δύο μέλη μιας εξίσωσης με το <strong>0</strong>;'
        : 'Is it allowed to divide both sides of an equation by <strong>0</strong>?',
      options: locale === 'el'
        ? makeUniqueOptions(elCorrect, [
            'Ναι, αρκεί να αλλάξουμε το πρόσημο',
            'Ναι, πάντοτε δίνει αποτέλεσμα 0',
            'Επιτρέπεται μόνο αν και το 2ο μέλος είναι 0'
          ])
        : makeUniqueOptions(enCorrect, [
            'Yes, provided we reverse the signs',
            'Yes, it always evaluates to 0',
            'Only allowed if the right-hand side is also 0'
          ]),
      correctAnswer: locale === 'el' ? elCorrect : enCorrect,
      solution: locale === 'el'
        ? 'Στον κανόνα της ισοδυναμίας, ο αριθμός με τον οποίο διαιρούμε ή πολλαπλασιάζουμε πρέπει απαραίτητα να είναι διάφορος του μηδενός (γ ≠ 0).'
        : 'Under equivalence transformation rules, any multiplier or divisor must be strictly non-zero (c ≠ 0).',
    };
  },

  // 12. Επίλυση εξίσωσης με κλάσμα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΠΙΛΥΣΗ ΜΕ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟ' : 'SOLVING VIA MULTIPLICATION',
      question: locale === 'el'
        ? `Αν <strong>${renderFraction('x', '3')} ＝ 5</strong>, ποια είναι η τιμή του <strong>x</strong>;`
        : `If <strong>${renderFraction('x', '3')} ＝ 5</strong>, what is the value of <strong>x</strong>?`,
      correctAnswer: '15',
      solution: locale === 'el'
        ? 'Πολλαπλασιάζουμε και τα δύο μέλη με το 3: x ＝ 5 · 3 ＝ 15.'
        : 'Multiply both sides by 3: x ＝ 5 · 3 ＝ 15.',
    };
  },

  // 13. Ποια εξίσωση ΔΕΝ είναι ισοδύναμη (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΛΕΓΧΟΣ ΙΣΟΔΥΝΑΜΙΑΣ' : 'EQUIVALENCE CHECK',
      question: locale === 'el'
        ? 'Ποια από τις παρακάτω εξισώσεις <strong>ΔΕΝ είναι ισοδύναμη</strong> με την <strong>x ＝ 5</strong>;'
        : 'Which of the following equations is <strong>NOT equivalent</strong> to <strong>x ＝ 5</strong>?',
      options: makeUniqueOptions('2 · x ＋ 1 ＝ 9', ['2 · x ＝ 10', 'x ＋ 3 ＝ 8', '3 · x － 1 ＝ 14']),
      correctAnswer: '2 · x ＋ 1 ＝ 9',
      solution: locale === 'el'
        ? `Η εξίσωση 2x ＋ 1 ＝ 9 δίνει 2x ＝ 8 ➔ x ＝ ${renderFraction('8', '2')} ＝ 4 (όχι 5), άρα δεν είναι ισοδύναμη.`
        : `The equation 2x ＋ 1 ＝ 9 gives 2x ＝ 8 ➔ x ＝ ${renderFraction('8', '2')} ＝ 4 (not 5), hence it is not equivalent.`,
    };
  },

  // 14. Επίλυση: 6x - 7 = 2x + 9 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΧΩΡΙΣΜΟΣ ΓΝΩΣΤΩΝ ΑΠΟ ΑΓΝΩΣΤΟΥΣ' : 'SEPARATING VARIABLES AND CONSTANTS',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>6 · x － 7 ＝ 2 · x ＋ 9</strong>'
        : 'Solve the equation: <strong>6 · x － 7 ＝ 2 · x ＋ 9</strong>',
      correctAnswer: '4',
      solution: locale === 'el'
        ? `Χωρίζουμε γνωστούς από αγνώστους: 6x － 2x ＝ 9 ＋ 7 ➔ 4x ＝ 16. Διαιρούμε με το 4: x ＝ ${renderFraction('16', '4')} ＝ 4.`
        : `Group variables and constants: 6x － 2x ＝ 9 ＋ 7 ➔ 4x ＝ 16. Divide by 4: x ＝ ${renderFraction('16', '4')} ＝ 4.`,
    };
  },

  // 15. Εύρεση ρίζας 0 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΗΔΕΝΙΚΗ ΡΙΖΑ' : 'ZERO ROOT',
      question: locale === 'el'
        ? 'Ποια είναι η λύση της εξίσωσης <strong>7 · x ＋ 5 ＝ 5</strong>;'
        : 'What is the solution to the equation <strong>7 · x ＋ 5 ＝ 5</strong>?',
      correctAnswer: '0',
      solution: locale === 'el'
        ? `7x ＝ 5 － 5 ➔ 7x ＝ 0. Διαιρούμε με το 7: x ＝ ${renderFraction('0', '7')} ＝ 0.`
        : `7x ＝ 5 － 5 ➔ 7x ＝ 0. Divide by 7: x ＝ ${renderFraction('0', '7')} ＝ 0.`,
    };
  },

  // 16. Πράξη απαλοιφής παρονομαστή (MCQ)
  (locale) => {
    const elCorrect = 'Με το 4';
    const enCorrect = 'By 4';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΑΠΑΛΟΙΦΗ ΠΑΡΟΝΟΜΑΣΤΗ' : 'CLEARING FRACTION DENOMINATORS',
      question: locale === 'el'
        ? `Για να λύσουμε την εξίσωση <strong>${renderFraction('x', '4')} ＝ 3</strong>, με ποιον αριθμό πολλαπλασιάζουμε και τα δύο μέλη;`
        : `To solve <strong>${renderFraction('x', '4')} ＝ 3</strong>, by what number do we multiply both sides?`,
      options: locale === 'el'
        ? makeUniqueOptions(elCorrect, ['Με το 3', 'Με το 12', 'Με το 1'])
        : makeUniqueOptions(enCorrect, ['By 3', 'By 12', 'By 1']),
      correctAnswer: locale === 'el' ? elCorrect : enCorrect,
      solution: locale === 'el'
        ? `Πολλαπλασιάζουμε με τον παρονομαστή 4 για να απλοποιηθεί το κλάσμα: 4 · ${renderFraction('x', '4')} ＝ 4 · 3 ➔ x ＝ 12.`
        : `Multiply by the denominator 4 to eliminate the fraction: 4 · ${renderFraction('x', '4')} ＝ 4 · 3 ➔ x ＝ 12.`,
    };
  },

  // 17. Επίλυση: 8x - 14 = 10 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΠΙΛΥΣΗ ΕΞΙΣΩΣΗΣ' : 'EQUATION SOLVING',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>8 · x － 14 ＝ 10</strong>'
        : 'Solve the equation: <strong>8 · x － 14 ＝ 10</strong>',
      correctAnswer: '3',
      solution: locale === 'el'
        ? `8x ＝ 10 ＋ 14 ➔ 8x ＝ 24. Διαιρούμε με το 8: x ＝ ${renderFraction('24', '8')} ＝ 3.`
        : `8x ＝ 10 ＋ 14 ➔ 8x ＝ 24. Divide by 8: x ＝ ${renderFraction('24', '8')} ＝ 3.`,
    };
  },

  // 18. Σωστή διατύπωση κανόνα προσήμων (MCQ)
  (locale) => {
    const elCorrect = 'Αλλάζει υποχρεωτικά το πρόσημό του (από ＋ σε － ή από － σε ＋)';
    const enCorrect = 'Its sign is inverted (from ＋ to － or from － to ＋)';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΚΑΝΟΝΑΣ ΜΕΤΑΦΟΡΑΣ' : 'TRANSPOSITION RULE',
      question: locale === 'el'
        ? 'Όταν ένας όρος αλλάζει μέλος σε μια εξίσωση:'
        : 'When a term is transposed to the other side of an equation:',
      options: locale === 'el'
        ? makeUniqueOptions(elCorrect, [
            'Διατηρεί πάντα το αρχικό του πρόσημο',
            'Γίνεται υποχρεωτικά θετικός αριθμός',
            'Αντιστρέφεται σε κλάσμα'
          ])
        : makeUniqueOptions(enCorrect, [
            'It always retains its original sign',
            'It necessarily becomes a positive number',
            'It turns into its reciprocal fraction'
          ]),
      correctAnswer: locale === 'el' ? elCorrect : enCorrect,
      solution: locale === 'el'
        ? 'Βάσει των ιδιοτήτων της ισότητας, η μεταφορά όρου ισοδυναμεί με πρόσθεση ή αφαίρεση του ίδιου όρου και στα δύο μέλη, άρα αλλάζει πρόσημο.'
        : 'Based on the properties of equality, transposing a term is equivalent to adding or subtracting that quantity on both sides, thus reversing its sign.',
    };
  },

  // 19. Επίλυση με αναγωγή ομοίων στο 1ο μέλος (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΑΓΩΓΗ ΚΑΙ ΕΠΙΛΥΣΗ' : 'COLLECTING LIKE TERMS',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>3 · x ＋ 2 · x － 5 ＝ 20</strong>'
        : 'Solve the equation: <strong>3 · x ＋ 2 · x － 5 ＝ 20</strong>',
      correctAnswer: '5',
      solution: locale === 'el'
        ? `Κάνουμε αναγωγή ομοίων όρων: 5x － 5 ＝ 20 ➔ 5x ＝ 25. Διαιρούμε με το 5: x ＝ ${renderFraction('25', '5')} ＝ 5.`
        : `Collect like terms: 5x － 5 ＝ 20 ➔ 5x ＝ 25. Divide by 5: x ＝ ${renderFraction('25', '5')} ＝ 5.`,
    };
  },

  // 20. Επίλυση: -x + 4 = -3 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΠΙΛΥΣΗ ΜΕ ΠΡΟΣΗΜΑ' : 'SIGNS IN EQUATIONS',
      question: locale === 'el'
        ? 'Λύσε την εξίσωση: <strong>－x ＋ 4 ＝ －3</strong>'
        : 'Solve the equation: <strong>－x ＋ 4 ＝ －3</strong>',
      correctAnswer: '7',
      solution: locale === 'el'
        ? `－x ＝ －3 － 4 ➔ －x ＝ －7. Διαιρούμε με το －1: x ＝ ${renderFraction('－7', '－1')} ＝ 7.`
        : `－x ＝ －3 － 4 ➔ －x ＝ －7. Divide by －1: x ＝ ${renderFraction('－7', '－1')} ＝ 7.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (el / en)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // 1. Αγορά ρούχων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'PROBLEMS: PURCHASES',
      question: locale === 'el'
        ? 'Ο Νίκος αγόρασε 3 όμοια μπλουζάκια και ένα καπέλο που κόστιζε 8 €. Πλήρωσε συνολικά 50 €. Πόσα ευρώ κόστισε το κάθε μπλουζάκι;'
        : 'Nikos bought 3 identical shirts and a cap costing 8 €. He paid 50 € in total. How much did each shirt cost in euros?',
      correctAnswer: '14',
      solution: locale === 'el'
        ? `Έστω x η τιμή για κάθε μπλουζάκι. Εξίσωση: 3x ＋ 8 ＝ 50 ➔ 3x ＝ 42. Διαιρούμε με το 3: x ＝ ${renderFraction('42', '3')} ＝ 14 €.`
        : `Let x be the shirt price. Equation: 3x ＋ 8 ＝ 50 ➔ 3x ＝ 42. Divide by 3: x ＝ ${renderFraction('42', '3')} ＝ 14 €.`,
    };
  },

  // 2. Περίμετρος ισοσκελούς τριγώνου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? 'Ένα ισοσκελές τρίγωνο έχει βάση 10 cm και περίμετρο 36 cm. Πόσα εκατοστά είναι το μήκος καθεμιάς από τις δύο ίσες πλευρές του;'
        : 'An isosceles triangle has a base of 10 cm and a perimeter of 36 cm. What is the length of each of its two equal sides in cm?',
      correctAnswer: '13',
      solution: locale === 'el'
        ? `Έστω x το μήκος καθεμιάς από τις ίσες πλευρές. Εξίσωση: 2x ＋ 10 ＝ 36 ➔ 2x ＝ 26. Διαιρούμε με το 2: x ＝ ${renderFraction('26', '2')} ＝ 13 cm.`
        : `Let x be the length of each equal side. Equation: 2x ＋ 10 ＝ 36 ➔ 2x ＝ 26. Divide by 2: x ＝ ${renderFraction('26', '2')} ＝ 13 cm.`,
    };
  },

  // 3. Ενοικίαση ποδηλάτων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΚΙΝΗΣΗ' : 'PROBLEMS: TRANSPORTATION',
      question: locale === 'el'
        ? 'Η ενοικίαση ποδηλάτου κοστίζει 4 € πάγια ασφάλεια συν 3 € για κάθε ώρα χρήσης. Ένας τουρίστας πλήρωσε συνολικά 22 €. Πόσες ώρες κράτησε το ποδήλατο;'
        : 'Bicycle rental costs a fixed insurance fee of 4 € plus 3 € per hour of usage. A tourist paid 22 € in total. For how many hours was the bicycle rented?',
      correctAnswer: '6',
      solution: locale === 'el'
        ? `Έστω x οι ώρες. Εξίσωση: 3x ＋ 4 ＝ 22 ➔ 3x ＝ 18. Διαιρούμε με το 3: x ＝ ${renderFraction('18', '3')} ＝ 6 ώρες.`
        : `Let x be the hours. Equation: 3x ＋ 4 ＝ 22 ➔ 3x ＝ 18. Divide by 3: x ＝ ${renderFraction('18', '3')} ＝ 6 hours.`,
    };
  },

  // 4. Ηλικία πατέρα και γιου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΗΛΙΚΙΕΣ' : 'PROBLEMS: AGES',
      question: locale === 'el'
        ? 'Ένας πατέρας είναι 28 χρόνια μεγαλύτερος από τον γιο του. Αν το άθροισμα των ηλικιών τους είναι 44 χρόνια, ποια είναι η ηλικία του γιου;'
        : 'A father is 28 years older than his son. If the sum of their ages is 44 years, what is the age of the son?',
      correctAnswer: '8',
      solution: locale === 'el'
        ? `Έστω x η ηλικία του γιου. Ο πατέρας είναι x ＋ 28. Εξίσωση: x ＋ (x ＋ 28) ＝ 44 ➔ 2x ＋ 28 ＝ 44 ➔ 2x ＝ 16. Διαιρούμε με το 2: x ＝ ${renderFraction('16', '2')} ＝ 8 ετών.`
        : `Let x be the son\'s age. The father is x ＋ 28. Equation: x ＋ (x ＋ 28) ＝ 44 ➔ 2x ＋ 28 ＝ 44 ➔ 2x ＝ 16. Divide by 2: x ＝ ${renderFraction('16', '2')} ＝ 8 years.`,
    };
  },

  // 5. Αποταμίευση για τάμπλετ
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'PROBLEMS: SAVINGS',
      question: locale === 'el'
        ? 'Η Μαρία θέλει να αγοράσει ένα τάμπλετ αξίας 150 €. Έχει ήδη 30 € και αποταμιεύει 12 € κάθε εβδομάδα. Σε πόσες εβδομάδες θα συγκεντρώσει το απαιτούμενο ποσό;'
        : 'Maria wants to buy a tablet worth 150 €. She already has 30 € and saves 12 € per week. In how many weeks will she reach her goal?',
      correctAnswer: '10',
      solution: locale === 'el'
        ? `Έστω x οι εβδομάδες. Εξίσωση: 12x ＋ 30 ＝ 150 ➔ 12x ＝ 120. Διαιρούμε με το 12: x ＝ ${renderFraction('120', '12')} ＝ 10 εβδομάδες.`
        : `Let x be the weeks. Equation: 12x ＋ 30 ＝ 150 ➔ 12x ＝ 120. Divide by 12: x ＝ ${renderFraction('120', '12')} ＝ 10 weeks.`,
    };
  },

  // 6. Κόστος εκτύπωσης φυλλαδίων
  (locale) => {
    const rate = locale === 'el' ? '0,10' : '0.10';
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΤΥΠΩΣΕΙΣ' : 'PROBLEMS: PRINTING',
      question: locale === 'el'
        ? `Ένα τυπογραφείο χρεώνει 15 € πάγια έξοδα σχεδίασης συν ${rate} € για κάθε φυλλάδιο. Αν ο λογαριασμός ήταν 45 €, πόσα φυλλάδια τυπώθηκαν;`
        : `A print shop charges a 15 € fixed setup fee plus ${rate} € per leaflet. If the final bill was 45 €, how many leaflets were printed?`,
      correctAnswer: '300',
      solution: locale === 'el'
        ? `Έστω x τα φυλλάδια. Εξίσωση: 0,10x ＋ 15 ＝ 45 ➔ 0,10x ＝ 30. Διαιρούμε με το 0,10: x ＝ ${renderFraction('30', '0,10')} ＝ 300 φυλλάδια.`
        : `Let x be the leaflets. Equation: 0.10x ＋ 15 ＝ 45 ➔ 0.10x ＝ 30. Divide by 0.10: x ＝ ${renderFraction('30', '0.10')} ＝ 300 leaflets.`,
    };
  },

  // 7. Πρόβλημα διαδοχικών αριθμών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΡΙΘΜΟΙ' : 'PROBLEMS: NUMBERS',
      question: locale === 'el'
        ? 'Το άθροισμα δύο διαδοχικών ακεραίων αριθμών είναι 45. Ποιος είναι ο μικρότερος από τους δύο αριθμούς;'
        : 'The sum of two consecutive integers is 45. What is the smaller integer?',
      correctAnswer: '22',
      solution: locale === 'el'
        ? `Έστω x ο μικρότερος και x ＋ 1 ο επόμενος. Εξίσωση: x ＋ (x ＋ 1) ＝ 45 ➔ 2x ＋ 1 ＝ 45 ➔ 2x ＝ 44. Διαιρούμε με το 2: x ＝ ${renderFraction('44', '2')} ＝ 22.`
        : `Let x be the smaller and x ＋ 1 the next integer. Equation: x ＋ (x ＋ 1) ＝ 45 ➔ 2x ＋ 1 ＝ 45 ➔ 2x ＝ 44. Divide by 2: x ＝ ${renderFraction('44', '2')} ＝ 22.`,
    };
  },

  // 8. Πλήρωση κιβωτίων με μήλα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΣΚΕΥΑΣΙΑ' : 'PROBLEMS: PACKAGING',
      question: locale === 'el'
        ? 'Ένας παραγωγός έχει 85 κιλά μήλα. Κράτησε 5 κιλά για την οικογένειά του και τα υπόλοιπα τα μοίρασε εξίσου σε 8 ίδια τελάρα. Πόσα κιλά μήλα περιέχει κάθε τελάρο;'
        : 'A farmer picked 85 kg of apples. He set aside 5 kg for his family and divided the rest equally into 8 crates. How many kg of apples are in each crate?',
      correctAnswer: '10',
      solution: locale === 'el'
        ? `Έστω x τα κιλά ανά τελάρο. Εξίσωση: 8x ＋ 5 ＝ 85 ➔ 8x ＝ 80. Διαιρούμε με το 8: x ＝ ${renderFraction('80', '8')} ＝ 10 kg.`
        : `Let x be the kg per crate. Equation: 8x ＋ 5 ＝ 85 ➔ 8x ＝ 80. Divide by 8: x ＝ ${renderFraction('80', '8')} ＝ 10 kg.`,
    };
  },

  // 9. Περίμετρος ορθογωνίου με σχέση πλευρών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? 'Σε ένα ορθογώνιο το μήκος είναι διπλάσιο από το πλάτος. Αν η περίμετρος του ορθογωνίου είναι 48 μέτρα, ποιο είναι το πλάτος του σε μέτρα;'
        : 'In a rectangle, the length is double the width. If the perimeter is 48 meters, what is the width in meters?',
      correctAnswer: '8',
      solution: locale === 'el'
        ? `Έστω x το πλάτος, άρα το μήκος είναι 2x. Περίμετρος: 2 · (x ＋ 2x) ＝ 48 ➔ 2 · 3x ＝ 48 ➔ 6x ＝ 48. Διαιρούμε με το 6: x ＝ ${renderFraction('48', '6')} ＝ 8 m.`
        : `Let x be the width, so length is 2x. Perimeter: 2 · (x ＋ 2x) ＝ 48 ➔ 2 · 3x ＝ 48 ➔ 6x ＝ 48. Divide by 6: x ＝ ${renderFraction('48', '6')} ＝ 8 m.`,
    };
  },

  // 10. Ταξί με απόσταση
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ' : 'PROBLEMS: TRANSPORTATION',
      question: locale === 'el'
        ? 'Ένα ταξί χρεώνει 3 € σημαία και 2 € για κάθε χιλιόμετρο διαδρομής. Αν ένας επιβάτης πλήρωσε 27 €, πόσα χιλιόμετρα ήταν η διαδρομή;'
        : 'A taxi charges a 3 € base fare plus 2 € per kilometer. If a passenger paid 27 €, how long was the ride in kilometers?',
      correctAnswer: '12',
      solution: locale === 'el'
        ? `Έστω x τα χιλιόμετρα. Εξίσωση: 2x ＋ 3 ＝ 27 ➔ 2x ＝ 24. Διαιρούμε με το 2: x ＝ ${renderFraction('24', '2')} ＝ 12 km.`
        : `Let x be the distance in km. Equation: 2x ＋ 3 ＝ 27 ➔ 2x ＝ 24. Divide by 2: x ＝ ${renderFraction('24', '2')} ＝ 12 km.`,
    };
  },

  // 11. Κατανάλωση κεριού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ' : 'PROBLEMS: MEASUREMENTS',
      question: locale === 'el'
        ? 'Ένα κερί έχει αρχικό ύψος 25 cm και κάθε ώρα που καίει μειώνεται κατά 2 cm. Μετά από πόσες ώρες το ύψος του θα είναι 11 cm;'
        : 'A candle has an initial height of 25 cm and shortens by 2 cm each hour it burns. After how many hours will its height reach 11 cm?',
      correctAnswer: '7',
      solution: locale === 'el'
        ? `Έστω x οι ώρες. Εξίσωση: 25 － 2x ＝ 11 ➔ －2x ＝ 11 － 25 ➔ －2x ＝ －14. Διαιρούμε με το －2: x ＝ ${renderFraction('－14', '－2')} ＝ 7 ώρες.`
        : `Let x be the hours. Equation: 25 － 2x ＝ 11 ➔ －2x ＝ 11 － 25 ➔ －2x ＝ －14. Divide by －2: x ＝ ${renderFraction('－14', '－2')} ＝ 7 hours.`,
    };
  },

  // 12. Αμοιβή τεχνικού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΥΠΗΡΕΣΙΕΣ' : 'PROBLEMS: SERVICES',
      question: locale === 'el'
        ? 'Ένας ηλεκτρολόγος χρεώνει 25 € για την επίσκεψη και 16 € για κάθε ώρα εργασίας. Αν η συνολική αμοιβή του ήταν 89 €, πόσες ώρες εργάστηκε;'
        : 'An electrician charges 25 € for a visit plus 16 € for each hour of work. If the total bill was 89 €, how many hours did he work?',
      correctAnswer: '4',
      solution: locale === 'el'
        ? `Έστω x οι ώρες. Εξίσωση: 16x ＋ 25 ＝ 89 ➔ 16x ＝ 64. Διαιρούμε με το 16: x ＝ ${renderFraction('64', '16')} ＝ 4 ώρες.`
        : `Let x be the hours. Equation: 16x ＋ 25 ＝ 89 ➔ 16x ＝ 64. Divide by 16: x ＝ ${renderFraction('64', '16')} ＝ 4 hours.`,
    };
  },

  // 13. Πρόβλημα με εισιτήρια συναυλίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΙΣΙΤΗΡΙΑ' : 'PROBLEMS: TICKETS',
      question: locale === 'el'
        ? 'Μια παρέα αγόρασε 5 εισιτήρια για συναυλία και πλήρωσε επιπλέον 4 € συνολικά έξοδα κράτησης. Αν το συνολικό ποσό ήταν 79 €, πόσο κόστιζε το κάθε εισιτήριο;'
        : 'A group of friends purchased 5 concert tickets and paid an additional 4 € booking fee in total. If the final amount was 79 €, how much did each ticket cost?',
      correctAnswer: '15',
      solution: locale === 'el'
        ? `Έστω x η τιμή του εισιτηρίου. Εξίσωση: 5x ＋ 4 ＝ 79 ➔ 5x ＝ 75. Διαιρούμε με το 5: x ＝ ${renderFraction('75', '5')} ＝ 15 €.`
        : `Let x be the ticket price. Equation: 5x ＋ 4 ＝ 79 ➔ 5x ＝ 75. Divide by 5: x ＝ ${renderFraction('75', '5')} ＝ 15 €.`,
    };
  },

  // 14. Μοίρασμα καραμελών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΜΕΡΙΣΜΟΣ' : 'PROBLEMS: DISTRIBUTION',
      question: locale === 'el'
        ? 'Η δασκάλα μοίρασε 48 καραμέλες σε ίσα σακουλάκια των 6 καραμελών. Πόσα σακουλάκια έφτιαξε;'
        : 'A teacher distributed 48 candies into bags containing 6 candies each. How many bags did she prepare?',
      correctAnswer: '8',
      solution: locale === 'el'
        ? `Έστω x τα σακουλάκια. Εξίσωση: 6x ＝ 48. Διαιρούμε με το 6: x ＝ ${renderFraction('48', '6')} ＝ 8 σακουλάκια.`
        : `Let x be the number of bags. Equation: 6x ＝ 48. Divide by 6: x ＝ ${renderFraction('48', '6')} ＝ 8 bags.`,
    };
  },

  // 15. Φόρτιση μπαταρίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ' : 'PROBLEMS: TECHNOLOGY',
      question: locale === 'el'
        ? 'Ένα κινητό έχει στάθμη μπαταρίας 12% και φορτίζει κατά 4% κάθε λεπτό. Σε πόσα λεπτά η μπαταρία θα φτάσει στο 60%;'
        : 'A phone battery is at 12% and charges by 4% every minute. In how many minutes will the battery level reach 60%?',
      correctAnswer: '12',
      solution: locale === 'el'
        ? `Έστω x τα λεπτά. Εξίσωση: 4x ＋ 12 ＝ 60 ➔ 4x ＝ 48. Διαιρούμε με το 4: x ＝ ${renderFraction('48', '4')} ＝ 12 λεπτά.`
        : `Let x be the minutes. Equation: 4x ＋ 12 ＝ 60 ➔ 4x ＝ 48. Divide by 4: x ＝ ${renderFraction('48', '4')} ＝ 12 minutes.`,
    };
  },

  // 16. Γραφική ύλη
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'PROBLEMS: PURCHASES',
      question: locale === 'el'
        ? 'Ο Γιώργος αγόρασε 4 ίδια στυλό και πλήρωσε με χαρτονόμισμα των 10 €. Πήρε ρέστα 2 €. Πόσα ευρώ κόστισε το κάθε στυλό;'
        : 'George bought 4 identical pens, paid with a 10 € bill, and received 2 € in change. How much did each pen cost in euros?',
      correctAnswer: '2',
      solution: locale === 'el'
        ? `Τα στυλό κόστισαν 10 － 2 ＝ 8 €. Εξίσωση: 4x ＝ 8. Διαιρούμε με το 4: x ＝ ${renderFraction('8', '4')} ＝ 2 €.`
        : `The pens cost 10 － 2 ＝ 8 €. Equation: 4x ＝ 8. Divide by 4: x ＝ ${renderFraction('8', '4')} ＝ 2 €.`,
    };
  },

  // 17. Εμβαδόν ορθογωνίου με σταθερό πλάτος
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? 'Ένα ορθογώνιο δωμάτιο έχει πλάτος 4 μέτρα και συνολικό εμβαδόν 28 τ.μ. Πόσα μέτρα είναι το μήκος του δωματίου;'
        : 'A rectangular room has a width of 4 meters and a total area of 28 sq. meters. What is the length of the room in meters?',
      correctAnswer: '7',
      solution: locale === 'el'
        ? `Έστω x το μήκος. Εμβαδόν: 4 · x ＝ 28. Διαιρούμε με το 4: x ＝ ${renderFraction('28', '4')} ＝ 7 m.`
        : `Let x be the length. Area: 4 · x ＝ 28. Divide by 4: x ＝ ${renderFraction('28', '4')} ＝ 7 m.`,
    };
  },

  // 18. Σχολικά βιβλία
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΙΒΛΙΑ' : 'PROBLEMS: BOOKS',
      question: locale === 'el'
        ? 'Ένα σχολείο αγόρασε 7 όμοια επιστημονικά βιβλία. Μαζί με έξοδα αποστολής 5 €, ο συνολικός λογαριασμός ήταν 96 €. Πόσο κόστιζε το κάθε βιβλίο;'
        : 'A school ordered 7 identical science books. Together with a 5 € shipping fee, the total was 96 €. How much did each book cost?',
      correctAnswer: '13',
      solution: locale === 'el'
        ? `Έστω x η τιμή του βιβλίου. Εξίσωση: 7x ＋ 5 ＝ 96 ➔ 7x ＝ 91. Διαιρούμε με το 7: x ＝ ${renderFraction('91', '7')} ＝ 13 €.`
        : `Let x be the price per book. Equation: 7x ＋ 5 ＝ 96 ➔ 7x ＝ 91. Divide by 7: x ＝ ${renderFraction('91', '7')} ＝ 13 €.`,
    };
  },

  // 19. Άθροισμα τριπλάσιου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΡΙΘΜΟΙ' : 'PROBLEMS: NUMBERS',
      question: locale === 'el'
        ? 'Αν σε έναν αριθμό προσθέσουμε το τριπλάσιό του, το αποτέλεσμα ισούται με 36. Ποιος είναι αυτός ο αριθμός;'
        : 'If triple a number is added to the number itself, the result is 36. What is the number?',
      correctAnswer: '9',
      solution: locale === 'el'
        ? `Έστω x ο αριθμός. Εξίσωση: x ＋ 3x ＝ 36 ➔ 4x ＝ 36. Διαιρούμε με το 4: x ＝ ${renderFraction('36', '4')} ＝ 9.`
        : `Let x be the number. Equation: x ＋ 3x ＝ 36 ➔ 4x ＝ 36. Divide by 4: x ＝ ${renderFraction('36', '4')} ＝ 9.`,
    };
  },

  // 20. Αγορά πίτσας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΣΤΙΑΣΗ' : 'PROBLEMS: FOOD & DINING',
      question: locale === 'el'
        ? 'Μια παρέα παρήγγειλε 3 ίδιες πίτσες και πλήρωσε επιπλέον 2 € για τη διανομή. Αν πλήρωσαν συνολικά 29 €, πόσο κόστισε η κάθε πίτσα;'
        : 'A group of friends ordered 3 identical pizzas and paid an extra 2 € delivery fee. If their total bill was 29 €, how much did each pizza cost?',
      correctAnswer: '9',
      solution: locale === 'el'
        ? `Έστω x η τιμή της πίτσας. Εξίσωση: 3x ＋ 2 ＝ 29 ➔ 3x ＝ 27. Διαιρούμε με το 3: x ＝ ${renderFraction('27', '3')} ＝ 9 €.`
        : `Let x be the pizza price. Equation: 3x ＋ 2 ＝ 29 ➔ 3x ＝ 27. Divide by 3: x ＝ ${renderFraction('27', '3')} ＝ 9 €.`,
    };
  },
];

export default function IsodinamesEksisoseisAsk() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

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
    let clean = val.replace('.', ',');
    clean = clean.replace(/[^0-9,/,\-x,X,*,+]/g, '');

    if (clean.length > 14) return;

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
      let userAns = (userAnswers[q.id] || '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/,/g, '.');

      let correctAns = q.correctAnswer
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/,/g, '.');

      userAns = userAns.replace(/^\+/, '');
      correctAns = correctAns.replace(/^\+/, '');

      const parsedUser = parseFloat(userAns);
      const parsedCorrect = parseFloat(correctAns);

      if (!isNaN(parsedUser) && !isNaN(parsedCorrect) && userAns === String(parsedUser) && correctAns === String(parsedCorrect)) {
        if (Math.abs(parsedUser - parsedCorrect) <= 0.05) {
          totalCorrect += 1;
        }
      } else if (userAns === correctAns) {
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
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/32-isodinames-eksisoseis"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm md:text-base transition-all shadow-md shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-36 overflow-x-hidden space-y-6 sm:space-y-8">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-8 lg:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3 sm:space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.chapterBadge)}
            </span>
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-xs sm:text-base text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/,/g, '.');

              const cleanCorrect = q.correctAnswer
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/,/g, '.');

              const parsedUser = parseFloat(cleanUser);
              const parsedCorrect = parseFloat(cleanCorrect);
              let isCorrect = false;

              if (isSubmitted) {
                if (!isNaN(parsedUser) && !isNaN(parsedCorrect) && cleanUser === String(parsedUser) && cleanCorrect === String(parsedCorrect)) {
                  isCorrect = Math.abs(parsedUser - parsedCorrect) <= 0.05;
                } else {
                  isCorrect = cleanUser === cleanCorrect;
                }
              }

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
                            {toCleanUppercase(t.problemBadge)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md break-words [overflow-wrap:anywhere]">
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
                          maxLength={14}
                          disabled={isSubmitted}
                          placeholder={t.placeholderInput}
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-sm sm:text-base font-bold rounded-xl border transition-all outline-none font-mono ${
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
                              className={`min-h-[44px] py-2 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between gap-2 transition-all touch-manipulation active:scale-[0.98] break-words whitespace-normal leading-snug flex-1 ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span
                                className="break-words [overflow-wrap:anywhere]"
                                dangerouslySetInnerHTML={{ __html: opt }}
                              />
                              {isSelected && <span className="shrink-0 font-bold ml-1">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση */}
                    {isSubmitted && (
                      <div
                        className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm space-y-2 mt-3 border break-words [overflow-wrap:anywhere] ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-xs sm:text-sm">
                            <span>✅</span>
                            <span>{toCleanUppercase(t.correctBadge)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-xs sm:text-sm">
                              <span>❌</span>
                              <span>{toCleanUppercase(t.wrongBadge)}</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-flex flex-wrap items-center gap-1 font-mono break-words [overflow-wrap:anywhere]">
                              <span>{t.correctAnswerLabel}</span>
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
                className="w-full sm:w-auto min-w-[260px] h-12 sm:h-13 px-6 sm:px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm md:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkAnswersBtn)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-12 sm:h-13 px-6 sm:px-8 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs sm:text-sm md:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
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
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div>
              <div className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {toCleanUppercase(isSubmitted ? t.finalScoreLabel : t.progressLabel)}
              </div>
              <div className="text-sm sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-3 sm:pl-6">
                <div className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {toCleanUppercase(t.successRateLabel)}
                </div>
                <div
                  className={`text-sm sm:text-xl font-black font-mono ${
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

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={generateQuestions}
              className="px-2.5 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">{toCleanUppercase(t.newExercisesBtn)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-3 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkBtnShort)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-3 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
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
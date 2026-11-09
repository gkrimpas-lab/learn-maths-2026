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
const renderFraction = (num, den) =>
  `<span class="inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">` +
  `<span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${num}</span>` +
  `<span class="pt-0.5 break-all">${den}</span>` +
  `</span>`;

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
    pageTitle: "Ασκήσεις: Απλοποίηση Παραστάσεων & Πίνακες Τιμών | Α' Γυμνασίου",
    pageDescription: "12 δυναμικές ασκήσεις και προβλήματα στην απλοποίηση αλγεβρικών παραστάσεων με επιμεριστική ιδιότητα και πίνακες τιμών για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 26 • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Απλοποίηση Παραστάσεων & Πίνακες Τιμών",
    mainSubtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 ασκήσεις επιμεριστικής, αναγωγής και πινάκων τιμών ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    problemBadge: "ΠΡΟΒΛΗΜΑ",
    placeholderInput: "π.χ. 19 ή 7",
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
    pageTitle: "Exercises: Simplifying Expressions & Tables of Values | Grade 7 Math",
    pageDescription: "12 dynamic exercises and word problems on simplifying algebraic expressions using the distributive property and tables of values for Grade 7 Math.",
    backText: "Grade 7 Math",
    theoryBtn: "THEORY",
    chapterBadge: "GRADE 7 • CHAPTER 26 • PRACTICE",
    mainTitle: "Simplifying Expressions & Tables of Values",
    mainSubtitle: "Solve the 12 selected exercises below (10 expressions, reduction, and tables of values ＋ 2 real-world application problems). Then click 'CHECK ANSWERS' to view your score and step-by-step solutions.",
    problemBadge: "PROBLEM",
    placeholderInput: "e.g. 19 or 7",
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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΑΠΛΟΠΟΙΗΣΗΣ & ΠΙΝΑΚΩΝ ΤΙΜΩΝ (el / en)
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Απλή επιμεριστική (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ' : 'DISTRIBUTIVE PROPERTY',
      question: locale === 'el'
        ? 'Απλοποίησε την παράσταση: <strong>3 · (x ＋ 4)</strong>'
        : 'Simplify the expression: <strong>3 · (x ＋ 4)</strong>',
      options: makeUniqueOptions('3 · x ＋ 12', ['3 · x ＋ 4', 'x ＋ 12', '7 · x']),
      correctAnswer: '3 · x ＋ 12',
      solution: locale === 'el'
        ? 'Πολλαπλασιάζουμε το 3 με κάθε όρο της παρένθεσης: 3 · x ＋ 3 · 4 ＝ 3 · x ＋ 12.'
        : 'Multiply 3 by each term inside the parentheses: 3 · x ＋ 3 · 4 ＝ 3 · x ＋ 12.',
    };
  },

  // 2. Επιμεριστική με αρνητικό συντελεστή (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΠΡΟΣΗΜΑ & ΕΠΙΜΕΡΙΣΤΙΚΗ' : 'SIGNS & DISTRIBUTION',
      question: locale === 'el'
        ? 'Απλοποίησε την παράσταση: <strong>－2 · (x － 5)</strong>'
        : 'Simplify the expression: <strong>－2 · (x － 5)</strong>',
      options: makeUniqueOptions('－2 · x ＋ 10', ['－2 · x － 10', '2 · x － 10', '－2 · x － 5']),
      correctAnswer: '－2 · x ＋ 10',
      solution: locale === 'el'
        ? '(－2) · x － (－2) · 5 ＝ －2x ＋ 10 (το γινόμενο δύο αρνητικών είναι θετικό).'
        : '(－2) · x － (－2) · 5 ＝ －2x ＋ 10 (the product of two negative numbers is positive).',
    };
  },

  // 3. Επιμεριστική και αναγωγή ομοίων όρων (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΑΠΛΟΠΟΙΗΣΗ ΠΑΡΑΣΤΑΣΗΣ' : 'EXPRESSION SIMPLIFICATION',
      question: locale === 'el'
        ? 'Απλοποίησε την παράσταση: <strong>2 · (x ＋ 3) ＋ 4 · x</strong>'
        : 'Simplify the expression: <strong>2 · (x ＋ 3) ＋ 4 · x</strong>',
      options: makeUniqueOptions('6 · x ＋ 6', ['2 · x ＋ 10', '6 · x ＋ 3', '8 · x']),
      correctAnswer: '6 · x ＋ 6',
      solution: locale === 'el'
        ? '1. Επιμεριστική: 2x ＋ 6. 2. Αναγωγή ομοίων όρων: 2x ＋ 4x ＋ 6 ＝ 6x ＋ 6.'
        : '1. Distribute: 2x ＋ 6. 2. Collect like terms: 2x ＋ 4x ＋ 6 ＝ 6x ＋ 6.',
    };
  },

  // 4. Υπολογισμός τιμής απλοποιημένης παράστασης (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ' : 'NUMERICAL VALUE',
      question: locale === 'el'
        ? 'Υπολόγισε την τιμή της παράστασης <strong>3 · (x ＋ 2) ＋ 1</strong> για <strong>x ＝ 4</strong>:'
        : 'Evaluate the expression <strong>3 · (x ＋ 2) ＋ 1</strong> for <strong>x ＝ 4</strong>:',
      correctAnswer: '19',
      solution: locale === 'el'
        ? 'Μέσα στην παρένθεση: 4 ＋ 2 ＝ 6. Έπειτα: 3 · 6 ＋ 1 ＝ 18 ＋ 1 ＝ 19.'
        : 'Inside the parentheses: 4 ＋ 2 ＝ 6. Then: 3 · 6 ＋ 1 ＝ 18 ＋ 1 ＝ 19.',
    };
  },

  // 5. Συμπλήρωση πίνακα τιμών (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΙΝΑΚΑΣ ΤΙΜΩΝ' : 'TABLE OF VALUES',
      question: locale === 'el'
        ? 'Σε έναν πίνακα τιμών για την παράσταση <strong>2 · x － 3</strong>, ποια τιμή αντιστοιχεί για <strong>x ＝ 5</strong>;'
        : 'In a table of values for the expression <strong>2 · x － 3</strong>, what value corresponds to <strong>x ＝ 5</strong>?',
      correctAnswer: '7',
      solution: '2 · 5 － 3 ＝ 10 － 3 ＝ 7.',
    };
  },

  // 6. Υπολογισμός τιμής με αρνητικό αριθμό (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΗ ΑΝΤΙΚΑΤΑΣΤΑΣΗ' : 'NEGATIVE SUBSTITUTION',
      question: locale === 'el'
        ? 'Υπολόγισε την τιμή της παράστασης <strong>2 · (x － 1) ＋ 5</strong> για <strong>x ＝ －3</strong>:'
        : 'Evaluate the expression <strong>2 · (x － 1) ＋ 5</strong> for <strong>x ＝ －3</strong>:',
      correctAnswer: '-3',
      solution: locale === 'el'
        ? 'Μέσα στην παρένθεση: －3 － 1 ＝ －4. Μετά: 2 · (－4) ＋ 5 ＝ －8 ＋ 5 ＝ －3.'
        : 'Inside parentheses: －3 － 1 ＝ －4. Then: 2 · (－4) ＋ 5 ＝ －8 ＋ 5 ＝ －3.',
    };
  },

  // 7. Αφαίρεση παρένθεσης με μείον μπροστά (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΠΑΡΕΝΘΕΣΗ ΜΕ ΜΕΙΟΝ' : 'MINUS SIGN BEFORE PARENTHESES',
      question: locale === 'el'
        ? 'Ποια είναι η απλοποιημένη μορφή της παράστασης: <strong>－(x ＋ 7)</strong>;'
        : 'What is the simplified form of the expression: <strong>－(x ＋ 7)</strong>?',
      options: makeUniqueOptions('－x － 7', ['－x ＋ 7', 'x － 7', '－7 · x']),
      correctAnswer: '－x － 7',
      solution: locale === 'el'
        ? 'Το μείον μπροστά από παρένθεση αλλάζει τα πρόσημα όλων των όρων μέσα σε αυτήν: －x － 7.'
        : 'A minus sign preceding parentheses flips the sign of every term inside: －x － 7.',
    };
  },

  // 8. Αφαίρεση παρένθεσης με μείον και εσωτερικό μείον (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΠΑΡΕΝΘΕΣΗ ΜΕ ΜΕΙΟΝ' : 'MINUS SIGN BEFORE PARENTHESES',
      question: locale === 'el'
        ? 'Ποια είναι η απλοποιημένη μορφή της παράστασης: <strong>－(x － 4)</strong>;'
        : 'What is the simplified form of the expression: <strong>－(x － 4)</strong>?',
      options: makeUniqueOptions('－x ＋ 4', ['－x － 4', 'x ＋ 4', '4 · x']),
      correctAnswer: '－x ＋ 4',
      solution: locale === 'el'
        ? 'Αλλάζουμε όλα τα πρόσημα: το x γίνεται －x και το －4 γίνεται ＋4, άρα －x ＋ 4.'
        : 'Reverse all internal signs: x becomes －x and －4 becomes ＋4, giving －x ＋ 4.',
    };
  },

  // 9. Δύο επιμεριστικές μαζί (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΝΘΕΤΗ ΑΠΛΟΠΟΙΗΣΗ' : 'COMPOUND SIMPLIFICATION',
      question: locale === 'el'
        ? 'Απλοποίησε την παράσταση: <strong>2 · (x ＋ 1) ＋ 3 · (x ＋ 2)</strong>'
        : 'Simplify the expression: <strong>2 · (x ＋ 1) ＋ 3 · (x ＋ 2)</strong>',
      options: makeUniqueOptions('5 · x ＋ 8', ['5 · x ＋ 3', '6 · x ＋ 8', '5 · x ＋ 6']),
      correctAnswer: '5 · x ＋ 8',
      solution: '2x ＋ 2 ＋ 3x ＋ 6 ＝ (2 ＋ 3)x ＋ (2 ＋ 6) ＝ 5x ＋ 8.',
    };
  },

  // 10. Τιμή για x = 0 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΤΙΜΗ ΓΙΑ x = 0' : 'VALUE FOR x = 0',
      question: locale === 'el'
        ? 'Υπολόγισε την τιμή της παράστασης <strong>4 · (x ＋ 3) － 2 · x</strong> όταν <strong>x ＝ 0</strong>:'
        : 'Evaluate the expression <strong>4 · (x ＋ 3) － 2 · x</strong> when <strong>x ＝ 0</strong>:',
      correctAnswer: '12',
      solution: locale === 'el'
        ? 'Για x ＝ 0: 4 · (0 ＋ 3) － 2 · 0 ＝ 4 · 3 － 0 ＝ 12.'
        : 'For x ＝ 0: 4 · (0 ＋ 3) － 2 · 0 ＝ 4 · 3 － 0 ＝ 12.',
    };
  },

  // 11. Γεωμετρική ερμηνεία επιμεριστικής (MCQ)
  (locale) => {
    const elCorrect = 'Στον υπολογισμό του εμβαδού ενός ορθογωνίου ως άθροισμα των εμβαδών δύο επιμέρους ορθογωνίων';
    const enCorrect = 'Calculating the area of a rectangle as the sum of two smaller sub-rectangles';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΓΕΩΜΕΤΡΙΚΗ ΕΡΜΗΝΕΙΑ' : 'GEOMETRIC INTERPRETATION',
      question: locale === 'el'
        ? 'Σε τι αντιστοιχεί γεωμετρικά η επιμεριστική ιδιότητα α · (β ＋ γ) ＝ α · β ＋ α · γ;'
        : 'What does the distributive property a · (b ＋ c) ＝ a · b ＋ a · c geometrically represent?',
      options: locale === 'el'
        ? makeUniqueOptions(elCorrect, [
            'Στον υπολογισμό του όγκου ενός κυλίνδρου',
            'Στην περίμετρο ενός κύκλου',
            'Στο άθροισμα των γωνιών ενός τριγώνου',
          ])
        : makeUniqueOptions(enCorrect, [
            'Calculating the volume of a cylinder',
            'The perimeter of a circle',
            'The sum of the angles of a triangle',
          ]),
      correctAnswer: locale === 'el' ? elCorrect : enCorrect,
      solution: locale === 'el'
        ? 'Το εμβαδόν ορθογωνίου με ύψος α και βάση (β ＋ γ) ισούται με το άθροισμα των εμβαδών των δύο τμημάτων: α · β ＋ α · γ.'
        : 'The area of a rectangle with height a and base (b ＋ c) equals the sum of its two sub-areas: a · b ＋ a · c.',
    };
  },

  // 12. Πίνακας τιμών: εύρεση τιμής εισόδου x (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΙΝΑΚΑΣ ΤΙΜΩΝ' : 'TABLE OF VALUES',
      question: locale === 'el'
        ? 'Αν στην παράσταση <strong>3 · (x ＋ 1)</strong> το αποτέλεσμα είναι <strong>15</strong>, ποια είναι η τιμή του <strong>x</strong>;'
        : 'If the expression <strong>3 · (x ＋ 1)</strong> evaluates to <strong>15</strong>, what is the value of <strong>x</strong>?',
      correctAnswer: '4',
      solution: `3 · (x ＋ 1) ＝ 15 ➔ x ＋ 1 ＝ ${renderFraction('15', '3')} ＝ 5 ➔ x ＝ 5 － 1 ＝ 4.`,
    };
  },

  // 13. Απλοποίηση με αφαίρεση (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΝΘΕΤΗ ΑΠΛΟΠΟΙΗΣΗ' : 'COMPOUND SIMPLIFICATION',
      question: locale === 'el'
        ? 'Απλοποίησε την παράσταση: <strong>5 · (x ＋ 2) － 3 · (x ＋ 1)</strong>'
        : 'Simplify the expression: <strong>5 · (x ＋ 2) － 3 · (x ＋ 1)</strong>',
      options: makeUniqueOptions('2 · x ＋ 7', ['2 · x ＋ 13', '8 · x ＋ 7', '2 · x ＋ 1']),
      correctAnswer: '2 · x ＋ 7',
      solution: '5x ＋ 10 － 3x － 3 ＝ (5 － 3)x ＋ (10 － 3) ＝ 2x ＋ 7.',
    };
  },

  // 14. Υπολογισμός τιμής για x = 1 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ' : 'NUMERICAL VALUE',
      question: locale === 'el'
        ? 'Υπολόγισε την τιμή της παράστασης <strong>2 · (3 · x ＋ 4) － 5</strong> για <strong>x ＝ 1</strong>:'
        : 'Evaluate the expression <strong>2 · (3 · x ＋ 4) － 5</strong> for <strong>x ＝ 1</strong>:',
      correctAnswer: '9',
      solution: locale === 'el'
        ? 'Για x ＝ 1: 2 · (3 · 1 ＋ 4) － 5 ＝ 2 · 7 － 5 ＝ 14 － 5 ＝ 9.'
        : 'For x ＝ 1: 2 · (3 · 1 ＋ 4) － 5 ＝ 2 · 7 － 5 ＝ 14 － 5 ＝ 9.',
    };
  },

  // 15. Κοινός παράγοντας (ανάποδη επιμεριστική) (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΚΟΙΝΟΣ ΠΑΡΑΓΟΝΤΑΣ' : 'COMMON FACTOR',
      question: locale === 'el'
        ? 'Ποια παράσταση προκύπτει αν βγάλουμε κοινό παράγοντα το 4 από την <strong>4 · x ＋ 12</strong>;'
        : 'What expression results from factoring out 4 from <strong>4 · x ＋ 12</strong>?',
      options: makeUniqueOptions('4 · (x ＋ 3)', ['4 · (x ＋ 12)', 'x ＋ 3', '4 · (x ＋ 8)']),
      correctAnswer: '4 · (x ＋ 3)',
      solution: locale === 'el'
        ? 'Επειδή 12 ＝ 4 · 3, βγάζοντας κοινό παράγοντα το 4 έχουμε: 4 · (x ＋ 3).'
        : 'Since 12 ＝ 4 · 3, factoring out 4 gives: 4 · (x ＋ 3).',
    };
  },

  // 16. Συμπλήρωση πίνακα τιμών για x = -1 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΙΝΑΚΑΣ ΤΙΜΩΝ' : 'TABLE OF VALUES',
      question: locale === 'el'
        ? 'Υπολόγισε την τιμή της παράστασης <strong>4 － 3 · x</strong> όταν <strong>x ＝ －1</strong>:'
        : 'Evaluate the expression <strong>4 － 3 · x</strong> when <strong>x ＝ －1</strong>:',
      correctAnswer: '7',
      solution: '4 － 3 · (－1) ＝ 4 － (－3) ＝ 4 ＋ 3 ＝ 7.',
    };
  },

  // 17. Επιμεριστική με δεκαδικό (MCQ)
  (locale) => {
    const expr = locale === 'el' ? '0,5 · (2 · x ＋ 6)' : '0.5 · (2 · x ＋ 6)';
    const opt4 = locale === 'el' ? '0,5 · x ＋ 3' : '0.5 · x ＋ 3';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΗ ΕΠΙΜΕΡΙΣΤΙΚΗ' : 'DECIMAL DISTRIBUTION',
      question: locale === 'el'
        ? `Απλοποίησε την παράσταση: <strong>${expr}</strong>`
        : `Simplify the expression: <strong>${expr}</strong>`,
      options: makeUniqueOptions('x ＋ 3', ['x ＋ 6', '2 · x ＋ 3', opt4]),
      correctAnswer: 'x ＋ 3',
      solution: locale === 'el'
        ? '0,5 · 2x ＋ 0,5 · 6 ＝ 1x ＋ 3 ＝ x ＋ 3.'
        : '0.5 · 2x ＋ 0.5 · 6 ＝ 1x ＋ 3 ＝ x ＋ 3.',
    };
  },

  // 18. Υπολογισμός τιμής με κλάσμα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ' : 'NUMERICAL VALUE',
      question: locale === 'el'
        ? 'Απλοποίησε και υπολόγισε την τιμή της παράστασης <strong>2 · x ＋ 6</strong> όταν <strong>x ＝ 6</strong>:'
        : 'Simplify and evaluate the expression <strong>2 · x ＋ 6</strong> when <strong>x ＝ 6</strong>:',
      correctAnswer: '18',
      solution: '2 · 6 ＋ 6 ＝ 12 ＋ 6 ＝ 18.',
    };
  },

  // 19. Αναγωγή ομοίων με μεταβλητή x και σταθερούς (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΑΓΩΓΗ & ΤΙΜΗ' : 'REDUCTION & EVALUATION',
      question: locale === 'el'
        ? 'Υπολόγισε την τιμή της παράστασης <strong>7 · x － 4 · x ＋ 10 － 3</strong> για <strong>x ＝ 2</strong>:'
        : 'Evaluate the expression <strong>7 · x － 4 · x ＋ 10 － 3</strong> for <strong>x ＝ 2</strong>:',
      correctAnswer: '13',
      solution: locale === 'el'
        ? 'Απλοποίηση: 3x ＋ 7. Για x ＝ 2: 3 · 2 ＋ 7 ＝ 6 ＋ 7 ＝ 13.'
        : 'Simplification: 3x ＋ 7. For x ＝ 2: 3 · 2 ＋ 7 ＝ 6 ＋ 7 ＝ 13.',
    };
  },

  // 20. Επιμεριστική σε τρεις όρους (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΠΙΜΕΡΙΣΤΙΚΗ ΣΕ 3 ΟΡΟΥΣ' : 'DISTRIBUTION OVER 3 TERMS',
      question: locale === 'el'
        ? 'Απλοποίησε την παράσταση: <strong>2 · (x ＋ y ＋ 3)</strong>'
        : 'Simplify the expression: <strong>2 · (x ＋ y ＋ 3)</strong>',
      options: makeUniqueOptions('2 · x ＋ 2 · y ＋ 6', ['2 · x ＋ y ＋ 3', '2 · x ＋ 2 · y ＋ 3', 'x ＋ y ＋ 6']),
      correctAnswer: '2 · x ＋ 2 · y ＋ 6',
      solution: locale === 'el'
        ? 'Πολλαπλασιάζουμε το 2 με κάθε έναν από τους τρεις όρους: 2x ＋ 2y ＋ 6.'
        : 'Multiply 2 by each of the three terms: 2x ＋ 2y ＋ 6.',
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (el / en)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Περίμετρος ορθογωνίου με επιμεριστική
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? 'Ένα ορθογώνιο έχει πλάτος 5 μέτρα και μήκος ίσο με το πλάτος αυξημένο κατά 3 μέτρα. Ποια είναι η περίμετρος του ορθογωνίου σε μέτρα;'
        : 'A rectangle has a width of 5 meters and a length equal to the width plus 3 meters. What is the perimeter of the rectangle in meters?',
      correctAnswer: '26',
      solution: locale === 'el'
        ? 'Πλάτος: 5 m. Μήκος: 5 ＋ 3 ＝ 8 m. Περίμετρος: 2 · (5 ＋ 8) ＝ 2 · 13 ＝ 26 m.'
        : 'Width: 5 m. Length: 5 ＋ 3 ＝ 8 m. Perimeter: 2 · (5 ＋ 8) ＝ 2 · 13 ＝ 26 m.',
    };
  },

  // Πρόβλημα 2: Αγορά σχολικών πακέτων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'PROBLEMS: PURCHASES',
      question: locale === 'el'
        ? 'Ένας γονέας αγόρασε 3 όμοια σχολικά πακέτα για τα παιδιά του. Κάθε πακέτο περιέχει μια τσάντα αξίας 25 € και ένα σετ μαρκαδόρων αξίας 6 €. Πόσα ευρώ πλήρωσε συνολικά;'
        : 'A parent purchased 3 identical school packs for their children. Each pack contains a backpack worth 25 € and a marker set worth 6 €. How many euros were paid in total?',
      correctAnswer: '93',
      solution: locale === 'el'
        ? 'Κόστος ανά πακέτο: 25 ＋ 6 ＝ 31 €. Συνολικό κόστος: 3 · (25 ＋ 6) ＝ 3 · 31 ＝ 93 €.'
        : 'Cost per pack: 25 ＋ 6 ＝ 31 €. Total cost: 3 · (25 ＋ 6) ＝ 3 · 31 ＝ 93 €.',
    };
  },

  // Πρόβλημα 3: Εμβαδόν διπλού αγροτεμαχίου
  (locale) => {
    const formattedNum = locale === 'el' ? '1.000' : '1,000';
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΡΓΙΑ' : 'PROBLEMS: AGRICULTURE',
      question: locale === 'el'
        ? 'Ένα χωράφι έχει σταθερό πλάτος 20 μέτρα και χωρίζεται σε δύο τμήματα μήκους 35 μέτρων και 15 μέτρων αντίστοιχα. Ποιο είναι το συνολικό εμβαδόν του χωραφιού σε τ.μ.;'
        : 'A plot of land has a constant width of 20 meters and is partitioned into two adjacent sections of length 35 meters and 15 meters respectively. What is the total area in sq. meters?',
      correctAnswer: '1000',
      solution: locale === 'el'
        ? `Συνολικό μήκος: 35 ＋ 15 ＝ 50 m. Εμβαδόν: 20 · (35 ＋ 15) ＝ 20 · 50 ＝ ${formattedNum} τ.μ.`
        : `Total length: 35 ＋ 15 ＝ 50 m. Area: 20 · (35 ＋ 15) ＝ 20 · 50 ＝ ${formattedNum} sq. meters.`,
    };
  },

  // Πρόβλημα 4: Ομαδικά εισιτήρια και σνακ
  (locale) => {
    const ticketCost = locale === 'el' ? '7,50' : '7.50';
    const drinkCost = locale === 'el' ? '3,50' : '3.50';
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΨΥΧΑΓΩΓΙΑ' : 'PROBLEMS: ENTERTAINMENT',
      question: locale === 'el'
        ? `Μια παρέα 4 φίλων πήγε στον κινηματογράφο. Κάθε άτομο πλήρωσε ${ticketCost} € για το εισιτήριό του και ${drinkCost} € για αναψυκτικό. Πόσα ευρώ πλήρωσαν συνολικά όλοι μαζί;`
        : `A group of 4 friends went to the cinema. Each person spent ${ticketCost} € on their ticket and ${drinkCost} € on a soda. How many euros did they spend altogether?`,
      correctAnswer: '44',
      solution: locale === 'el'
        ? `Κόστος ανά άτομο: ${ticketCost} ＋ ${drinkCost} ＝ 11 €. Συνολικό κόστος: 4 · 11 ＝ 44 €.`
        : `Cost per person: ${ticketCost} ＋ ${drinkCost} ＝ 11 €. Total cost: 4 · 11 ＝ 44 €.`,
    };
  },

  // Πρόβλημα 5: Κατασκευή περιφράξεων με διαστήματα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ' : 'PROBLEMS: CONSTRUCTION',
      question: locale === 'el'
        ? 'Ένας κηπουρός θέλει να περιφράξει 2 όμοια παρτέρια. Κάθε παρτέρι έχει διαστάσεις 4 μέτρα επί 6 μέτρα. Πόσα μέτρα φράχτη θα χρειαστεί συνολικά;'
        : 'A gardener wants to fence 2 identical garden beds. Each bed measures 4 meters by 6 meters. How many meters of fencing are required in total?',
      correctAnswer: '40',
      solution: locale === 'el'
        ? 'Περίμετρος ενός παρτεριού: 2 · (4 ＋ 6) ＝ 2 · 10 ＝ 20 m. Για 2 παρτέρια: 2 · 20 ＝ 40 m.'
        : 'Perimeter of one bed: 2 · (4 ＋ 6) ＝ 2 · 10 ＝ 20 m. For 2 beds: 2 · 20 ＝ 40 m.',
    };
  },

  // Πρόβλημα 6: Αποταμίευση σε δύο κουμπαράδες
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'PROBLEMS: SAVINGS',
      question: locale === 'el'
        ? 'Δύο αδέλφια αποταμιεύουν μαζί. Ο πρώτος βάζει 4 € την εβδομάδα και ο δεύτερος 6 € την εβδομάδα. Πόσα χρήματα θα έχουν συγκεντρώσει συνολικά μετά από 8 εβδομάδες;'
        : 'Two siblings save money together. One saves 4 € per week and the other saves 6 € per week. How much money will they accumulate in total after 8 weeks?',
      correctAnswer: '80',
      solution: locale === 'el'
        ? 'Εβδομαδιαία αποταμίευση: 4 ＋ 6 ＝ 10 €. Σε 8 εβδομάδες: 8 · (4 ＋ 6) ＝ 8 · 10 ＝ 80 €.'
        : 'Weekly savings: 4 ＋ 6 ＝ 10 €. Over 8 weeks: 8 · (4 ＋ 6) ＝ 8 · 10 ＝ 80 €.',
    };
  },

  // Πρόβλημα 7: Εμβαδόν τοίχου με πόρτα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΔΟΜΗ' : 'PROBLEMS: HOME IMPROVEMENT',
      question: locale === 'el'
        ? 'Ένας τοίχος έχει ύψος 3 μέτρα και συνολικό μήκος 8 μέτρα, αλλά αφαιρείται μια πόρτα πλάτους 1 μέτρου (στο ίδιο ύψος 3 m). Ποιο είναι το καθαρό εμβαδόν βαφής σε τ.μ.;'
        : 'A wall is 3 meters tall and 8 meters long, but excludes a door 1 meter wide (of the same 3 m height). What is the net area to be painted in sq. meters?',
      correctAnswer: '21',
      solution: locale === 'el'
        ? 'Καθαρό μήκος τοίχου: 8 － 1 ＝ 7 m. Εμβαδόν: 3 · (8 － 1) ＝ 3 · 7 ＝ 21 τ.μ.'
        : 'Net wall length: 8 － 1 ＝ 7 m. Paint area: 3 · (8 － 1) ＝ 3 · 7 ＝ 21 sq. meters.',
    };
  },

  // Πρόβλημα 8: Αμοιβή υπερωριών συνεργείου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ' : 'PROBLEMS: LABOR',
      question: locale === 'el'
        ? 'Ένα συνεργείο 5 τεχνικών εργάστηκε υπερωριακά. Κάθε τεχνικός πληρώνεται 12 € κανονική ωριαία αμοιβή συν 4 € ειδικό επίδομα υπερωρίας για κάθε ώρα. Πόσο κοστίζει 1 ώρα εργασίας όλου του συνεργείου;'
        : 'A team of 5 technicians worked overtime. Each technician receives a standard wage of 12 € plus a 4 € overtime bonus per hour. What is the total cost for 1 hour of team labor?',
      correctAnswer: '80',
      solution: locale === 'el'
        ? 'Αμοιβή ανά τεχνικό: 12 ＋ 4 ＝ 16 €. Για 5 τεχνικούς: 5 · (12 ＋ 4) ＝ 5 · 16 ＝ 80 €.'
        : 'Wage per technician: 12 ＋ 4 ＝ 16 €. For 5 technicians: 5 · (12 ＋ 4) ＝ 5 · 16 ＝ 80 €.',
    };
  },

  // Πρόβλημα 9: Συσκευασία δώρων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΣΚΕΥΑΣΙΑ' : 'PROBLEMS: PACKAGING',
      question: locale === 'el'
        ? 'Σε ένα κατάστημα ετοιμάζονται 6 όμοια καλάθια δώρων. Σε κάθε καλάθι τοποθετούνται προϊόντα αξίας 18 € συν 3 € για το καλάθι και την κορδέλα. Ποιο είναι το συνολικό κόστος των 6 καλαθιών;'
        : 'A gift shop prepares 6 identical gift hampers. Each hamper contains 18 € worth of products plus 3 € for the basket and ribbon. What is the total cost for all 6 hampers?',
      correctAnswer: '126',
      solution: locale === 'el'
        ? 'Κόστος ανά καλάθι: 18 ＋ 3 ＝ 21 €. Για 6 καλάθια: 6 · (18 ＋ 3) ＝ 6 · 21 ＝ 126 €.'
        : 'Cost per hamper: 18 ＋ 3 ＝ 21 €. For 6 hampers: 6 · (18 ＋ 3) ＝ 6 · 21 ＝ 126 €.',
    };
  },

  // Πρόβλημα 10: Κατανάλωση καυσίμου δύο οχημάτων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ' : 'PROBLEMS: TRANSPORTATION',
      question: locale === 'el'
        ? 'Δύο φορτηγά διανύουν την ίδια απόσταση των 4 εκατοντάδων χιλιομέτρων (400 km). Το πρώτο καίει 8 λίτρα ανά 100 km και το δεύτερο 11 λίτρα ανά 100 km. Πόσα λίτρα καυσίμου κατανάλωσαν συνολικά και τα δύο;'
        : 'Two trucks drive the same distance of 400 km. The first burns 8 liters per 100 km and the second burns 11 liters per 100 km. How many liters of fuel did they consume together?',
      correctAnswer: '76',
      solution: locale === 'el'
        ? 'Κατανάλωση ανά 100 km: 8 ＋ 11 ＝ 19 L. Για 400 km: 4 · (8 ＋ 11) ＝ 4 · 19 ＝ 76 L.'
        : 'Consumption per 100 km: 8 ＋ 11 ＝ 19 L. For 400 km: 4 · (8 ＋ 11) ＝ 4 · 19 ＝ 76 L.',
    };
  },

  // Πρόβλημα 11: Αγορά αθλητικών ειδών με έκπτωση
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'PROBLEMS: PURCHASES',
      question: locale === 'el'
        ? 'Μια ομάδα αγόρασε 10 μπάλες ποδοσφαίρου. Η αρχική τιμή κάθε μπάλας ήταν 20 €, αλλά έγινε έκπτωση 3 € σε κάθε μπάλα. Πόσα ευρώ πλήρωσε συνολικά η ομάδα;'
        : 'A football team bought 10 balls. The original price of each ball was 20 €, but a discount of 3 € was applied to each. How many euros did the team pay in total?',
      correctAnswer: '170',
      solution: locale === 'el'
        ? 'Τιμή μετά την έκπτωση: 20 － 3 ＝ 17 €. Για 10 μπάλες: 10 · (20 － 3) ＝ 10 · 17 ＝ 170 €.'
        : 'Price after discount: 20 － 3 ＝ 17 €. For 10 balls: 10 · (20 － 3) ＝ 10 · 17 ＝ 170 €.',
    };
  },

  // Πρόβλημα 12: Διανομή φυλλαδίων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΗΜΕΡΩΣΗ' : 'PROBLEMS: DISTRIBUTION',
      question: locale === 'el'
        ? 'Τρεις εθελοντές μοίρασαν ενημερωτικά φυλλάδια σε 4 πολυκατοικίες. Αν σε κάθε πολυκατοικία μοίρασαν από 25 φυλλάδια ο καθένας, πόσα φυλλάδια μοιράστηκαν συνολικά σε κάθε πολυκατοικία;'
        : 'Three volunteers distributed informational flyers across 4 residential buildings. If each volunteer distributed 25 flyers per building, how many flyers were delivered to each building in total?',
      correctAnswer: '75',
      solution: locale === 'el'
        ? 'Σε κάθε πολυκατοικία μοιράζουν 3 εθελοντές από 25 φυλλάδια: 3 · 25 ＝ 75 φυλλάδια.'
        : 'In each building, 3 volunteers deliver 25 flyers: 3 · 25 ＝ 75 flyers.',
    };
  },

  // Πρόβλημα 13: Περίμετρος σύνθετου γραμμικού διαδρόμου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? 'Ένα ορθογώνιο δωμάτιο έχει πλάτος 4 μέτρα και μήκος 7 μέτρα. Πόσα μέτρα σοβατεπί απαιτούνται για να τοποθετηθούν περιμετρικά σε 2 ίδια τέτοια δωμάτια;'
        : 'A rectangular room is 4 meters wide and 7 meters long. How many meters of skirting board are needed along the perimeter of 2 identical such rooms?',
      correctAnswer: '44',
      solution: locale === 'el'
        ? 'Περίμετρος ενός δωματίου: 2 · (4 ＋ 7) ＝ 2 · 11 ＝ 22 m. Για 2 δωμάτια: 2 · 22 ＝ 44 m.'
        : 'Perimeter of one room: 2 · (4 ＋ 7) ＝ 2 · 11 ＝ 22 m. For 2 rooms: 2 · 22 ＝ 44 m.',
    };
  },

  // Πρόβλημα 14: Ημερήσια έξοδα κατασκήνωσης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΗΝΩΣΗ' : 'PROBLEMS: CAMPING',
      question: locale === 'el'
        ? 'Σε μια κατασκήνωση το ημερήσιο κόστος ανά κατασκηνωτή είναι 14 € για διαμονή και 11 € για διατροφή. Πόσο κοστίζει η παραμονή ενός παιδιού για 6 ημέρες;'
        : 'At a summer camp, the daily fee per camper is 14 € for lodging and 11 € for meals. What is the total fee for a child staying for 6 days?',
      correctAnswer: '150',
      solution: locale === 'el'
        ? 'Ημερήσιο κόστος: 14 ＋ 11 ＝ 25 €. Για 6 ημέρες: 6 · (14 ＋ 11) ＝ 6 · 25 ＝ 150 €.'
        : 'Daily cost: 14 ＋ 11 ＝ 25 €. For 6 days: 6 · (14 ＋ 11) ＝ 6 · 25 ＝ 150 €.',
    };
  },

  // Πρόβλημα 15: Εμβαδόν διπλού γηπέδου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ' : 'PROBLEMS: SPORTS',
      question: locale === 'el'
        ? 'Δύο διπλανά γήπεδα μπάσκετ έχουν κοινό πλάτος 15 μέτρα και μήκος 28 μέτρα το καθένα. Ποιο είναι το συνολικό εμβαδόν των δύο γηπέδων σε τ.μ.;'
        : 'Two adjacent basketball courts share a width of 15 meters and each has a length of 28 meters. What is their combined surface area in sq. meters?',
      correctAnswer: '840',
      solution: locale === 'el'
        ? 'Συνολικό μήκος: 28 ＋ 28 ＝ 56 m. Εμβαδόν: 15 · (28 ＋ 28) ＝ 15 · 56 ＝ 840 τ.μ.'
        : 'Total length: 28 ＋ 28 ＝ 56 m. Area: 15 · (28 ＋ 28) ＝ 15 · 56 ＝ 840 sq. meters.',
    };
  },

  // Πρόβλημα 16: Αγορά βιβλίων με έκπτωση
  (locale) => {
    const discount = locale === 'el' ? '2,50' : '2.50';
    const subtotal = locale === 'el' ? '12,50' : '12.50';
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΙΒΛΙΑ' : 'PROBLEMS: BOOKS',
      question: locale === 'el'
        ? `Ένα σχολείο αγόρασε 8 αντίτυπα ενός λεξικού. Η αρχική τιμή ήταν 15 €, αλλά το βιβλιοπωλείο έκανε έκπτωση ${discount} € σε κάθε αντίτυπο. Πόσα ευρώ πλήρωσε το σχολείο;`
        : `A school ordered 8 copies of a dictionary. The catalog price was 15 €, but the bookstore granted a discount of ${discount} € on each copy. How many euros did the school pay?`,
      correctAnswer: '100',
      solution: locale === 'el'
        ? `Τιμή ανά αντίτυπο: 15 － ${discount} ＝ ${subtotal} €. Για 8 αντίτυπα: 8 · ${subtotal} ＝ 100 €.`
        : `Price per copy: 15 － ${discount} ＝ ${subtotal} €. For 8 copies: 8 · ${subtotal} ＝ 100 €.`,
    };
  },

  // Πρόβλημα 17: Φύτευση παρτεριών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΗΠΟΣ' : 'PROBLEMS: GARDENING',
      question: locale === 'el'
        ? 'Ένας γεωπόνος φυτεύει σε 5 σειρές τριανταφυλλιές και γαρυφαλλιές. Σε κάθε σειρά βάζει 8 τριανταφυλλιές και 12 γαρυφαλλιές. Πόσα φυτά φύτεψε συνολικά;'
        : 'An agronomist plants roses and carnations across 5 rows. In each row, 8 roses and 12 carnations are planted. How many plants were planted altogether?',
      correctAnswer: '100',
      solution: locale === 'el'
        ? 'Φυτά ανά σειρά: 8 ＋ 12 ＝ 20. Σε 5 σειρές: 5 · (8 ＋ 12) ＝ 5 · 20 ＝ 100 φυτά.'
        : 'Plants per row: 8 ＋ 12 ＝ 20. Across 5 rows: 5 · (8 ＋ 12) ＝ 5 · 20 ＝ 100 plants.',
    };
  },

  // Πρόβλημα 18: Καθαρή αμοιβή με κρατήσεις
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΙΣΘΟΔΟΣΙΑ' : 'PROBLEMS: PAYROLL',
      question: locale === 'el'
        ? 'Ένας υπάλληλος αμείβεται με 12 € την ώρα, αλλά έχει κρατήσεις 2 € για κάθε ώρα εργασίας. Ποια είναι η καθαρή αμοιβή του για εργασία 30 ωρών σε ευρώ;'
        : 'An employee earns 12 € per hour, subject to mandatory deductions of 2 € per hour. What is the net compensation for 30 hours of work in euros?',
      correctAnswer: '300',
      solution: locale === 'el'
        ? 'Καθαρό ωρομίσθιο: 12 － 2 ＝ 10 €. Για 30 ώρες: 30 · (12 － 2) ＝ 30 · 10 ＝ 300 €.'
        : 'Net hourly wage: 12 － 2 ＝ 10 €. For 30 hours: 30 · (12 － 2) ＝ 30 · 10 ＝ 300 €.',
    };
  },

  // Πρόβλημα 19: Κόστος εκτύπωσης φυλλαδίων σε παρτίδες
  (locale) => {
    const totalFlyers = locale === 'el' ? '1.600' : '1,600';
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΥΠΟΓΡΑΦΕΙΟ' : 'PROBLEMS: PRINTING',
      question: locale === 'el'
        ? 'Τυπώθηκαν 4 παρτίδες φυλλαδίων. Κάθε παρτίδα περιείχε 150 έγχρωμα και 250 ασπρόμαυρα φυλλάδια. Πόσα φυλλάδια τυπώθηκαν συνολικά;'
        : 'A print shop ran 4 batches of leaflets. Each batch contained 150 full-color and 250 black-and-white leaflets. How many leaflets were printed in total?',
      correctAnswer: '1600',
      solution: locale === 'el'
        ? `Φυλλάδια ανά παρτίδα: 150 ＋ 250 ＝ 400. Για 4 παρτίδες: 4 · (150 ＋ 250) ＝ 4 · 400 ＝ ${totalFlyers} φυλλάδια.`
        : `Leaflets per batch: 150 ＋ 250 ＝ 400. For 4 batches: 4 · (150 ＋ 250) ＝ 4 · 400 ＝ ${totalFlyers} leaflets.`,
    };
  },

  // Πρόβλημα 20: Παραγωγή κουτιών σε δύο βάρδιες
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΟΣΤΑΣΙΟ' : 'PROBLEMS: MANUFACTURING',
      question: locale === 'el'
        ? 'Σε ένα εργοστάσιο λειτουργούν 3 ίδιες γραμμές παραγωγής. Κάθε γραμμή παράγει 45 μικρά κουτιά και 35 μεγάλα κουτιά ανά ώρα. Πόσα κουτιά παράγουν συνολικά και οι 3 γραμμές σε 1 ώρα;'
        : 'A manufacturing plant operates 3 identical production lines. Each line assembles 45 small boxes and 35 large boxes per hour. How many boxes do all 3 lines assemble in 1 hour?',
      correctAnswer: '240',
      solution: locale === 'el'
        ? 'Παραγωγή μίας γραμμής: 45 ＋ 35 ＝ 80 κουτιά. Για 3 γραμμές: 3 · (45 ＋ 35) ＝ 3 · 80 ＝ 240 κουτιά.'
        : 'Output per line: 45 ＋ 35 ＝ 80 boxes. For 3 lines: 3 · (45 ＋ 35) ＝ 3 · 80 ＝ 240 boxes.',
    };
  },
];

export default function AplopoiisiAsk() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή 12 ερωτήσεων: 10 υπολογισμοί/θεωρία + 2 ρεαλιστικά προβλήματα
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
    // Αριθμοί, κόμμα, διαίρεση/κλάσμα, μείον, συν, x
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

      // Αριθμητικός έλεγχος με ανοχή δεκαδικών 0.05
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
          href="/a-gymnasiou/29-aplopoiisi"
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

                    {/* Feedback & Λύση (No-Giveaway: Εμφανίζεται αποκλειστικά μετά την υποβολή) */}
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
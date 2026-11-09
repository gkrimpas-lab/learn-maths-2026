import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Συνάρτηση καθαρισμού τόνων για κεφαλαία (διατηρεί μόνο το Α')
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

// Συγκεντρωτικό λεξικό UI strings
const translations = {
  el: {
    pageTitle: "Ασκήσεις: Αναπαράσταση Κανονικοτήτων | Α' Γυμνασίου",
    pageDesc: "12 δυναμικές ασκήσεις και προβλήματα στην αναπαράσταση κανονικοτήτων (πίνακες τιμών, συστήματα αξόνων, τύπος α·ν) για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 23 • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Αναπαράσταση Κανονικοτήτων (α · ν)",
    mainSubtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 ασκήσεις πινάκων τιμών, συστημάτων αξόνων και τύπων ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    wordProblemTag: "ΠΡΟΒΛΗΜΑ",
    inputPlaceholder: "π.χ. 6 ή 4*ν",
    correctFeedback: "ΣΩΣΤΟ",
    wrongFeedback: "ΛΑΘΟΣ",
    correctAnswerLabel: "ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:",
    checkBtn: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
    newExercisesBtn: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    repeatBtn: "ΕΠΑΝΑΛΗΨΗ",
    checkScoreShort: "ΕΛΕΓΧΟΣ",
    progressLabel: "ΠΡΟΟΔΟΣ",
    finalScoreLabel: "ΤΕΛΙΚΟ ΣΚΟΡ",
    successRateLabel: "ΕΠΙΤΥΧΙΑ"
  },
  en: {
    pageTitle: "Exercises: Representation of Sequences | 7th Grade Math",
    pageDesc: "12 dynamic exercises and problems on representing sequences (tables of values, coordinate systems, formula a · n) for Grade 7.",
    backText: "7th Grade",
    theoryBtn: "THEORY",
    chapterBadge: "GRADE 7 • CHAPTER 23 • PRACTICE",
    mainTitle: "Representation of Sequences (a · n)",
    mainSubtitle: "Solve the following 12 selected exercises (10 exercises on tables of values, coordinate systems, and formulas ＋ 2 realistic problems). Click \"CHECK ANSWERS\" to see your score and step-by-step solutions.",
    wordProblemTag: "WORD PROBLEM",
    inputPlaceholder: "e.g. 6 or 4*n",
    correctFeedback: "CORRECT",
    wrongFeedback: "INCORRECT",
    correctAnswerLabel: "CORRECT ANSWER:",
    checkBtn: "CHECK ANSWERS",
    newExercisesBtn: "NEW EXERCISES",
    repeatBtn: "RETRY",
    checkScoreShort: "CHECK",
    progressLabel: "PROGRESS",
    finalScoreLabel: "FINAL SCORE",
    successRateLabel: "SUCCESS"
  }
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΑΝΑΠΑΡΑΣΤΑΣΗΣ ΚΑΝΟΝΙΚΟΤΗΤΩΝ (α · ν)
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Εύρεση συντελεστή α από πίνακα τιμών (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΙΝΑΚΑΣ ΤΙΜΩΝ' : 'TABLE OF VALUES',
      question: locale === 'el'
        ? `Σε έναν πίνακα τιμών μιας κανονικότητας της μορφής <strong>α · ${v}</strong>, για ${v} ＝ 1 η τιμή είναι 6 και για ${v} ＝ 2 είναι 12. Ποιος είναι ο συντελεστής <strong>α</strong>;`
        : `In a table of values for a sequence of the form <strong>a · ${v}</strong>, for ${v} ＝ 1 the value is 6 and for ${v} ＝ 2 it is 12. What is the coefficient <strong>a</strong>?`,
      correctAnswer: '6',
      solution: locale === 'el'
        ? `Για ${v} ＝ 1 έχουμε α · 1 ＝ 6, άρα α ＝ 6. Ο γενικός όρος είναι 6 · ${v}.`
        : `For ${v} ＝ 1 we have a · 1 ＝ 6, so a ＝ 6. The general formula is 6 · ${v}.`,
    };
  },

  // 2. Εύρεση συντεταγμένης y στο σύστημα αξόνων (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ' : 'COORDINATE SYSTEM',
      question: locale === 'el'
        ? `Η κανονικότητα παριστάνεται στο σύστημα αξόνων από σημεία της μορφής (${v}, y) με τύπο <strong>y ＝ 4 · ${v}</strong>. Ποια είναι η τεταγμένη <strong>y</strong> του σημείου με τετμημένη <strong>${v} ＝ 3</strong>;`
        : `The sequence is represented on the coordinate plane by points (${v}, y) with formula <strong>y ＝ 4 · ${v}</strong>. What is the y-coordinate of the point with <strong>${v} ＝ 3</strong>?`,
      correctAnswer: '12',
      solution: locale === 'el'
        ? `Αντικαθιστούμε ${v} ＝ 3: y ＝ 4 · 3 ＝ 12. Το σημείο είναι το (3, 12).`
        : `Substitute ${v} ＝ 3: y ＝ 4 · 3 ＝ 12. The point is (3, 12).`,
    };
  },

  // 3. Εύρεση τύπου από γεωμετρικό μοτίβο (MCQ)
  (locale, v) => {
    const correct = `4 · ${v}`;
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΓΕΩΜΕΤΡΙΚΟ ΜΟΤΙΒΟ' : 'GEOMETRIC PATTERN',
      question: locale === 'el'
        ? `Κατασκευάζουμε ανεξάρτητα τετράγωνα με σπίρτα: 1 τετράγωνο έχει 4 σπίρτα, 2 τετράγωνα έχουν 8, 3 τετράγωνα έχουν 12. Ποιος είναι ο τύπος για τα σπίρτα σε ${v} τετράγωνα;`
        : `We construct independent squares with matchsticks: 1 square has 4 matches, 2 squares have 8, 3 squares have 12. What is the formula for the matchsticks in ${v} squares?`,
      options: makeUniqueOptions(correct, [`${v} ＋ 4`, `4 · ${v} ＋ 1`, `${v}<sup>2</sup>`]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Κάθε ανεξάρτητο τετράγωνο απαιτεί σταθερά 4 σπίρτα, άρα για ${v} τετράγωνα χρειαζόμαστε 4 · ${v} σπίρτα.`
        : `Each independent square requires exactly 4 matches, so for ${v} squares we need 4 · ${v} matches.`,
    };
  },

  // 4. Εύρεση του α με δεκαδικό συντελεστή (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ' : 'DECIMAL COEFFICIENT',
      question: locale === 'el'
        ? `Αν ο γενικός όρος μιας κανονικότητας είναι <strong>1,5 · ${v}</strong>, ποια είναι η τιμή του <strong>4ου όρου</strong> (για ${v} ＝ 4);`
        : `If the general term formula is <strong>1.5 · ${v}</strong>, what is the value of the <strong>4th term</strong> (for ${v} ＝ 4)?`,
      correctAnswer: '6',
      solution: locale === 'el'
        ? `Για ${v} ＝ 4 υπολογίζουμε: 1,5 · 4 ＝ 6.`
        : `For ${v} ＝ 4: 1.5 · 4 ＝ 6.`,
    };
  },

  // 5. Εύρεση τετμημένης ν από σημείο (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ' : 'COORDINATE SYSTEM',
      question: locale === 'el'
        ? `Στην ευθεία της κανονικότητας <strong>y ＝ 5 · ${v}</strong>, ένα σημείο έχει τεταγμένη <strong>y ＝ 35</strong>. Ποια είναι η τιμή του <strong>${v}</strong>;`
        : `On the sequence line <strong>y ＝ 5 · ${v}</strong>, a point has y-coordinate <strong>y ＝ 35</strong>. What is the value of <strong>${v}</strong>?`,
      correctAnswer: '7',
      solution: locale === 'el'
        ? `5 · ${v} ＝ 35 ➔ ${v} ＝ 35 : 5 ＝ 7. Το σημείο είναι το (7, 35).`
        : `5 · ${v} ＝ 35 ➔ ${v} ＝ 35 : 5 ＝ 7. The point is (7, 35).`,
    };
  },

  // 6. Αναγνώριση γραφικής παράστασης ευθείας (MCQ)
  (locale, v) => {
    const correct = locale === 'el'
      ? 'Βρίσκονται όλα πάνω σε μια ευθεία γραμμή που διέρχεται από την αρχή των αξόνων (0, 0)'
      : 'They all lie on a straight line passing through the origin (0, 0)';
    const wrongs = locale === 'el'
      ? [
          'Βρίσκονται πάνω σε μια καμπύλη γραμμή που αλλάζει κατεύθυνση',
          'Σχηματίζουν έναν κύκλο γύρω από το κέντρο',
          'Είναι τυχαία διασκορπισμένα χωρίς κανένα γεωμετρικό μοτίβο',
        ]
      : [
          'They lie on a curved line that changes direction',
          'They form a circle centered around the origin',
          'They are randomly scattered with no geometric pattern',
        ];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ' : 'GRAPHICAL REPRESENTATION',
      question: locale === 'el'
        ? `Τι μορφή έχουν τα σημεία μιας κανονικότητας <strong>α · ${v}</strong> όταν σχεδιαστούν σε σύστημα αξόνων;`
        : `What shape do the points of a sequence <strong>a · ${v}</strong> form when plotted on a coordinate plane?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Οι κανονικότητες της μορφής α · ${v} παριστάνουν ανάλογα ποσά, άρα τα σημεία τους ανήκουν σε ευθεία γραμμή που περνά από το (0, 0).`
        : `Sequences of the form a · ${v} represent proportional quantities, so their points lie on a straight line passing through (0, 0).`,
    };
  },

  // 7. Αρνητικός συντελεστής α (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ' : 'NEGATIVE COEFFICIENT',
      question: locale === 'el'
        ? `Αν ο κανόνας είναι <strong>y ＝ －3 · ${v}</strong>, ποια είναι η τιμή του όρου για <strong>${v} ＝ 4</strong>;`
        : `If the rule is <strong>y ＝ －3 · ${v}</strong>, what is the term value for <strong>${v} ＝ 4</strong>?`,
      correctAnswer: '-12',
      solution: locale === 'el'
        ? `(－3) · 4 ＝ －12.`
        : `(－3) · 4 ＝ －12.`,
    };
  },

  // 8. Συσχέτιση πίνακα και ζεύγους συντεταγμένων (MCQ)
  (locale, v) => {
    const correct = '(5, 20)';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΖΕΥΓΟΣ ΣΥΝΤΕΤΑΓΜΕΝΩΝ' : 'COORDINATE PAIR',
      question: locale === 'el'
        ? `Αν σε έναν πίνακα τιμών για ${v} ＝ 5 αντιστοιχεί τιμή 20, ποιο σημείο σημειώνουμε στο σύστημα αξόνων;`
        : `If in a table of values ${v} ＝ 5 corresponds to a value of 20, which point do we plot on the coordinate plane?`,
      options: makeUniqueOptions(correct, ['(20, 5)', '(5, 5)', '(20, 20)']),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Η πρώτη συντεταγμένη (άξονας x) είναι η θέση ${v} ＝ 5 και η δεύτερη (άξονας y) είναι η τιμή 20: σημείο (5, 20).`
        : `The horizontal coordinate is index ${v} ＝ 5 and the vertical is value 20: point (5, 20).`,
    };
  },

  // 9. Εύρεση συντελεστή από σημείο (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΥΡΕΣΗ ΣΥΝΤΕΛΕΣΤΗ' : 'FINDING COEFFICIENT',
      question: locale === 'el'
        ? `Το σημείο <strong>(4, 32)</strong> ανήκει στη γραφική παράσταση της κανονικότητας <strong>y ＝ α · ${v}</strong>. Πόσο ισούται ο συντελεστής <strong>α</strong>;`
        : `The point <strong>(4, 32)</strong> lies on the graph of the sequence <strong>y ＝ a · ${v}</strong>. What is the value of coefficient <strong>a</strong>?`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `α · 4 ＝ 32 ➔ α ＝ 32 : 4 ＝ 8. Ο τύπος είναι y ＝ 8 · ${v}.`
        : `a · 4 ＝ 32 ➔ a ＝ 32 : 4 ＝ 8. The formula is y ＝ 8 · ${v}.`,
    };
  },

  // 10. Μετάβαση από λεκτική διατύπωση σε τύπο (MCQ)
  (locale, v) => {
    const correct = `7 · ${v}`;
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΛΕΚΤΙΚΗ ΣΕ ΑΛΓΕΒΡΙΚΗ' : 'VERBAL TO ALGEBRAIC',
      question: locale === 'el'
        ? `«Το μήκος ενός φράχτη ισούται με 7 μέτρα επί τον αριθμό των τμημάτων του (${v}).» Ποιος είναι ο αλγεβρικός τύπος;`
        : `\"The total fence length equals 7 meters multiplied by the number of sections (${v}).\" What is the algebraic formula?`,
      options: makeUniqueOptions(correct, [`${v} ＋ 7`, `7 : ${v}`, `${v} · ${v}`]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Η φράση «7 μέτρα επί τον αριθμό ${v}» μεταφράζεται συμβολικά σε 7 · ${v}.`
        : `\"7 meters times the number ${v}\" is represented symbolically as 7 · ${v}.`,
    };
  },

  // 11. Υπολογισμός τιμής από πίνακα με κλάσμα (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ' : 'DECIMAL COEFFICIENT',
      question: locale === 'el'
        ? `Αν ο τύπος μιας κανονικότητας είναι <strong>0,5 · ${v}</strong> (το μισό του ${v}), ποια είναι η τιμή για <strong>${v} ＝ 6</strong>;`
        : `If the formula of a sequence is <strong>0.5 · ${v}</strong> (half of ${v}), what is the value for <strong>${v} ＝ 6</strong>?`,
      correctAnswer: '3',
      solution: locale === 'el'
        ? `0,5 · 6 ＝ 3.`
        : `0.5 · 6 ＝ 3.`,
    };
  },

  // 12. Εύρεση συντελεστή α από πίνακα διαδοχικών όρων (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΙΝΑΚΑΣ ΤΙΜΩΝ' : 'TABLE OF VALUES',
      question: locale === 'el'
        ? `Σε πίνακα τιμών της μορφής α · ${v} έχουμε τις τιμές 9, 18, 27, 36... Ποιος είναι ο συντελεστής <strong>α</strong>;`
        : `In a table of values for a · ${v} we have the terms 9, 18, 27, 36... What is the coefficient <strong>a</strong>?`,
      correctAnswer: '9',
      solution: locale === 'el'
        ? `Για ${v} ＝ 1 η τιμή είναι 9, άρα α ＝ 9.`
        : `For ${v} ＝ 1 the term is 9, so a ＝ 9.`,
    };
  },

  // 13. Εύρεση του 8ου όρου (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ' : 'TERM CALCULATION',
      question: locale === 'el'
        ? `Στην κανονικότητα <strong>y ＝ 7 · ${v}</strong>, ποια είναι η τιμή του <strong>8ου όρου</strong>;`
        : `In the sequence <strong>y ＝ 7 · ${v}</strong>, what is the value of the <strong>8th term</strong>?`,
      correctAnswer: '56',
      solution: locale === 'el'
        ? `7 · 8 ＝ 56.`
        : `7 · 8 ＝ 56.`,
    };
  },

  // 14. Έλεγχος σημείου αν ανήκει στην ευθεία (MCQ)
  (locale, v) => {
    const correct = '(3, 18)';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΛΕΓΧΟΣ ΣΗΜΕΙΟΥ' : 'POINT VERIFICATION',
      question: locale === 'el'
        ? `Ποιο από τα παρακάτω σημεία ανήκει στη γραφική παράσταση της κανονικότητας <strong>y ＝ 6 · ${v}</strong>;`
        : `Which of the following points lies on the line of the sequence <strong>y ＝ 6 · ${v}</strong>?`,
      options: makeUniqueOptions(correct, ['(3, 15)', '(2, 10)', '(4, 20)']),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Για ${v} ＝ 3: y ＝ 6 · 3 ＝ 18. Άρα το σημείο (3, 18) ανήκει στην ευθεία.`
        : `For ${v} ＝ 3: y ＝ 6 · 3 ＝ 18. Hence point (3, 18) lies on the line.`,
    };
  },

  // 15. Εύρεση συντελεστή από αρνητικό σημείο (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ' : 'NEGATIVE COEFFICIENT',
      question: locale === 'el'
        ? `Αν το σημείο <strong>(3, －15)</strong> ανήκει στην ευθεία <strong>y ＝ α · ${v}</strong>, ποιος είναι ο συντελεστής <strong>α</strong>;`
        : `If point <strong>(3, －15)</strong> lies on the line <strong>y ＝ a · ${v}</strong>, what is coefficient <strong>a</strong>?`,
      correctAnswer: '-5',
      solution: locale === 'el'
        ? `α · 3 ＝ －15 ➔ α ＝ －15 : 3 ＝ －5.`
        : `a · 3 ＝ －15 ➔ a ＝ －15 : 3 ＝ －5.`,
    };
  },

  // 16. Συμπλήρωση πίνακα τιμών (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΜΠΛΗΡΩΣΗ ΠΙΝΑΚΑ' : 'TABLE COMPLETION',
      question: locale === 'el'
        ? `Σε έναν πίνακα τιμών με τύπο <strong>10 · ${v}</strong>, ποια τιμή αντιστοιχεί στη στήλη με <strong>${v} ＝ 5</strong>;`
        : `In a table of values with formula <strong>10 · ${v}</strong>, what value corresponds to column <strong>${v} ＝ 5</strong>?`,
      correctAnswer: '50',
      solution: locale === 'el'
        ? `10 · 5 ＝ 50.`
        : `10 · 5 ＝ 50.`,
    };
  },

  // 17. Εύρεση θέσης ν για δεκαδικό τύπο (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΥΡΕΣΗ ΘΕΣΗΣ' : 'FINDING INDEX',
      question: locale === 'el'
        ? `Αν <strong>y ＝ 2,5 · ${v}</strong> και το αποτέλεσμα είναι <strong>20</strong>, ποια είναι η τιμή του <strong>${v}</strong>;`
        : `If <strong>y ＝ 2.5 · ${v}</strong> and the output is <strong>20</strong>, what is the value of <strong>${v}</strong>?`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `${v} ＝ 20 : 2,5 ＝ 8.`
        : `${v} ＝ 20 : 2.5 ＝ 8.`,
    };
  },

  // 18. Σημασία της αρχής των αξόνων (MCQ)
  (locale, v) => {
    const correct = locale === 'el'
      ? `Γιατί αν ${v} ＝ 0, τότε και η τιμή y ＝ α · 0 ισούται με 0`
      : `Because if ${v} ＝ 0, then the value y ＝ a · 0 also equals 0`;
    const wrongs = locale === 'el'
      ? [
          'Επειδή όλα τα σχήματα έχουν 0 πλευρές',
          'Είναι τυχαίο σημείο εκκίνησης',
          'Ισχύει μόνο όταν ο συντελεστής α είναι θετικός',
        ]
      : [
          'Because all geometric shapes have 0 sides',
          'It is just an arbitrary starting point',
          'It only holds when coefficient a is positive',
        ];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ' : 'COORDINATE SYSTEM',
      question: locale === 'el'
        ? `Γιατί η ευθεία της κανονικότητας <strong>y ＝ α · ${v}</strong> ξεκινά από το σημείο (0, 0);`
        : `Why does the graph of sequence <strong>y ＝ a · ${v}</strong> always pass through point (0, 0)?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Για ${v} ＝ 0 έχουμε y ＝ α · 0 ＝ 0, επομένως η ευθεία περνά υποχρεωτικά από το (0, 0).`
        : `For ${v} ＝ 0 we have y ＝ a · 0 ＝ 0, therefore the line strictly passes through (0, 0).`,
    };
  },

  // 19. Υπολογισμός 10ου όρου με δεκαδικό (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ' : 'TERM CALCULATION',
      question: locale === 'el'
        ? `Στην κανονικότητα <strong>y ＝ 0,8 · ${v}</strong>, ποια είναι η τιμή του <strong>10ου όρου</strong>;`
        : `In the sequence <strong>y ＝ 0.8 · ${v}</strong>, what is the value of the <strong>10th term</strong>?`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `0,8 · 10 ＝ 8.`
        : `0.8 · 10 ＝ 8.`,
    };
  },

  // 20. Αντίστροφη ανάγνωση από πίνακα (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΘΕΤΟΣ ΥΠΟΛΟΓΙΣΜΟΣ' : 'MULTI-STEP CALCULATION',
      question: locale === 'el'
        ? `Μια κανονικότητα της μορφής α · ${v} δίνει τιμή 14 για ${v} ＝ 2. Ποια είναι η τιμή της για <strong>${v} ＝ 5</strong>;`
        : `A sequence of the form a · ${v} yields a value of 14 for ${v} ＝ 2. What is its value for <strong>${v} ＝ 5</strong>?`,
      correctAnswer: '35',
      solution: locale === 'el'
        ? `α ＝ 14 : 2 ＝ 7. Άρα για ${v} ＝ 5 έχουμε: 7 · 5 ＝ 35.`
        : `a ＝ 14 : 2 ＝ 7. Thus for ${v} ＝ 5: 7 · 5 ＝ 35.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ ΑΝΑΠΑΡΑΣΤΑΣΕΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Ωρομίσθιο εργασίας
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ' : 'PROBLEMS: WORK',
      question: locale === 'el'
        ? `Ένας καθηγητής αμείβεται με 15 € για κάθε ώρα διδασκαλίας. Το εισόδημά του περιγράφεται από τον τύπο <strong>y ＝ 15 · ${v}</strong> (όπου ${v} οι ώρες). Πόσα ευρώ θα λάβει για <strong>8 ώρες</strong> διδασκαλίας;`
        : `A tutor earns €15 per hour of teaching. Total earnings follow the formula <strong>y ＝ 15 · ${v}</strong> (where ${v} is hours). How much will they earn for <strong>8 hours</strong> of teaching?`,
      correctAnswer: '120',
      solution: locale === 'el'
        ? `15 · 8 ＝ 120 €. Στο σύστημα αξόνων αυτό αντιστοιχεί στο σημείο (8, 120).`
        : `15 · 8 ＝ €120. On the coordinate plane this corresponds to point (8, 120).`,
    };
  },

  // Πρόβλημα 2: Περίμετρος ισόπλευρου τριγώνου
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Η περίμετρος ενός ισόπλευρου τριγώνου με πλευρά μήκους ${v} εκατοστά δίνεται από τον τύπο <strong>Π ＝ 3 · ${v}</strong>. Αν η πλευρά είναι <strong>${v} ＝ 14 cm</strong>, ποια είναι η περίμετρος σε cm;`
        : `The perimeter of an equilateral triangle with side length ${v} cm is given by <strong>P ＝ 3 · ${v}</strong>. If side length is <strong>${v} ＝ 14 cm</strong>, what is the perimeter in cm?`,
      correctAnswer: '42',
      solution: locale === 'el'
        ? `Π ＝ 3 · 14 ＝ 42 cm.`
        : `P ＝ 3 · 14 ＝ 42 cm.`,
    };
  },

  // Πρόβλημα 3: Κατανάλωση νερού
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΝΑΛΩΣΗ' : 'PROBLEMS: WATER FLOW',
      question: locale === 'el'
        ? `Μια βρύση τρέχει με σταθερή παροχή 12 λίτρων ανά λεπτό (τύπος: <strong>y ＝ 12 · ${v}</strong>). Πόσα λίτρα νερού θα γεμίσουν έναν κάδο σε <strong>6 λεπτά</strong>;`
        : `A tap runs at a constant rate of 12 liters per minute (formula: <strong>y ＝ 12 · ${v}</strong>). How many liters of water will flow into a bucket in <strong>6 minutes</strong>?`,
      correctAnswer: '72',
      solution: locale === 'el'
        ? `12 · 6 ＝ 72 λίτρα. Στο γράφημα αντιστοιχεί στο σημείο (6, 72).`
        : `12 · 6 ＝ 72 liters. On the graph this corresponds to point (6, 72).`,
    };
  },

  // Πρόβλημα 4: Κόστος εισιτηρίων
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΙΣΙΤΗΡΙΑ' : 'PROBLEMS: TICKETS',
      question: locale === 'el'
        ? `Το εισιτήριο για ένα θεματικό πάρκο κοστίζει 8,50 € ανά άτομο (τύπος: <strong>y ＝ 8,5 · ${v}</strong>). Πόσο θα πληρώσει μια ομάδα <strong>10 ατόμων</strong> σε ευρώ;`
        : `Admission to a theme park costs €8.50 per person (formula: <strong>y ＝ 8.5 · ${v}</strong>). How much will a group of <strong>10 people</strong> pay in euros?`,
      correctAnswer: '85',
      solution: locale === 'el'
        ? `8,5 · 10 ＝ 85 €. Σημείο γραφήματος: (10, 85).`
        : `8.5 · 10 ＝ €85. Graph coordinate: (10, 85).`,
    };
  },

  // Πρόβλημα 5: Ταχύτητα και απόσταση
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΙΚΗ' : 'PROBLEMS: PHYSICS',
      question: locale === 'el'
        ? `Ένας δρομέας τρέχει με σταθερή ταχύτητα 9 km/h. Η απόσταση που διανύει δίνεται από τον τύπο <strong>s ＝ 9 · ${v}</strong> (όπου ${v} οι ώρες). Πόσα χιλιόμετρα θα διανύσει σε <strong>4 ώρες</strong>;`
        : `A runner runs at a constant speed of 9 km/h. Distance covered is given by <strong>s ＝ 9 · ${v}</strong> (where ${v} is hours). How many kilometers will they run in <strong>4 hours</strong>?`,
      correctAnswer: '36',
      solution: locale === 'el'
        ? `s ＝ 9 · 4 ＝ 36 km.`
        : `s ＝ 9 · 4 ＝ 36 km.`,
    };
  },

  // Πρόβλημα 6: Περίμετρος τετραγώνου
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Η περίμετρος τετραγώνου πλευράς ${v} cm δίνεται από τον τύπο <strong>Π ＝ 4 · ${v}</strong>. Αν η περίμετρος είναι <strong>48 cm</strong>, ποιο είναι το μήκος της πλευράς <strong>${v}</strong> σε cm;`
        : `The perimeter of a square with side ${v} cm is <strong>P ＝ 4 · ${v}</strong>. If the perimeter is <strong>48 cm</strong>, what is the side length <strong>${v}</strong> in cm?`,
      correctAnswer: '12',
      solution: locale === 'el'
        ? `4 · ${v} ＝ 48 ➔ ${v} ＝ 48 : 4 ＝ 12 cm.`
        : `4 · ${v} ＝ 48 ➔ ${v} ＝ 48 : 4 ＝ 12 cm.`,
    };
  },

  // Πρόβλημα 7: Παραγωγή αρτοποιείου
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΠΑΡΑΓΩΓΗ' : 'PROBLEMS: PRODUCTION',
      question: locale === 'el'
        ? `Ένας φούρνος παράγει 25 φραντζόλες ψωμί ανά ταψί (τύπος: <strong>y ＝ 25 · ${v}</strong>). Πόσες φραντζόλες θα παραχθούν σε <strong>8 ταψιά</strong>;`
        : `A bakery bakes 25 loaves of bread per tray (formula: <strong>y ＝ 25 · ${v}</strong>). How many loaves will be baked in <strong>8 trays</strong>?`,
      correctAnswer: '200',
      solution: locale === 'el'
        ? `25 · 8 ＝ 200 φραντζόλες.`
        : `25 · 8 ＝ 200 loaves.`,
    };
  },

  // Πρόβλημα 8: Αγορά βιβλίων
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'PROBLEMS: PURCHASES',
      question: locale === 'el'
        ? `Μια σειρά επιστημονικών περιοδικών κοστίζει 4 € το τεύχος (τύπος: <strong>y ＝ 4 · ${v}</strong>). Αν ένας αναγνώστης πλήρωσε <strong>36 €</strong>, πόσα τεύχη (${v}) αγόρασε;`
        : `A science magazine series costs €4 per issue (formula: <strong>y ＝ 4 · ${v}</strong>). If a reader spent <strong>€36</strong>, how many issues (${v}) did they purchase?`,
      correctAnswer: '9',
      solution: locale === 'el'
        ? `4 · ${v} ＝ 36 ➔ ${v} ＝ 36 : 4 ＝ 9 τεύχη.`
        : `4 · ${v} ＝ 36 ➔ ${v} ＝ 36 : 4 ＝ 9 issues.`,
    };
  },

  // Πρόβλημα 9: Συσκευασία αυγών
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΣΚΕΥΑΣΙΑ' : 'PROBLEMS: PACKAGING',
      question: locale === 'el'
        ? `Κάθε καρτέλα περιέχει 30 αυγά (τύπος: <strong>y ＝ 30 · ${v}</strong>). Πόσα αυγά περιέχονται σε <strong>7 καρτέλες</strong>;`
        : `Each egg flat contains 30 eggs (formula: <strong>y ＝ 30 · ${v}</strong>). How many eggs are contained in <strong>7 flats</strong>?`,
      correctAnswer: '210',
      solution: locale === 'el'
        ? `30 · 7 ＝ 210 αυγά.`
        : `30 · 7 ＝ 210 eggs.`,
    };
  },

  // Πρόβλημα 10: Κατανάλωση ενέργειας
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΕΡΓΕΙΑ' : 'PROBLEMS: ENERGY',
      question: locale === 'el'
        ? `Μια λάμπα LED καταναλώνει 0,01 kWh ανά ώρα λειτουργίας (τύπος: <strong>y ＝ 0,01 · ${v}</strong>). Πόσες kWh θα καταναλώσει σε <strong>500 ώρες</strong> λειτουργίας;`
        : `An LED lamp consumes 0.01 kWh per hour of use (formula: <strong>y ＝ 0.01 · ${v}</strong>). How many kWh will it consume in <strong>500 hours</strong>?`,
      correctAnswer: '5',
      solution: locale === 'el'
        ? `0,01 · 500 ＝ 5 kWh.`
        : `0.01 · 500 ＝ 5 kWh.`,
    };
  },

  // Πρόβλημα 11: Συναρμολόγηση ποδηλάτων
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ' : 'PROBLEMS: ASSEMBLY',
      question: locale === 'el'
        ? `Κάθε ποδήλατο χρειάζεται 2 ρόδες (τύπος: <strong>y ＝ 2 · ${v}</strong>). Αν ένα εργοστάσιο έχει <strong>96 ρόδες</strong>, πόσα ποδήλατα (${v}) μπορεί να συναρμολογήσει;`
        : `Each bicycle requires 2 wheels (formula: <strong>y ＝ 2 · ${v}</strong>). If a workshop has <strong>96 wheels</strong>, how many bicycles (${v}) can be assembled?`,
      correctAnswer: '48',
      solution: locale === 'el'
        ? `2 · ${v} ＝ 96 ➔ ${v} ＝ 96 : 2 ＝ 48 ποδήλατα.`
        : `2 · ${v} ＝ 96 ➔ ${v} ＝ 96 : 2 ＝ 48 bicycles.`,
    };
  },

  // Πρόβλημα 12: Φύτευση δενδρυλλίων
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΡΓΙΑ' : 'PROBLEMS: AGRICULTURE',
      question: locale === 'el'
        ? `Σε έναν ελαιώνα φυτεύονται 16 δέντρα ανά σειρά (τύπος: <strong>y ＝ 16 · ${v}</strong>). Πόσα δέντρα φυτεύτηκαν συνολικά σε <strong>5 σειρές</strong>;`
        : `In an olive grove, 16 trees are planted per row (formula: <strong>y ＝ 16 · ${v}</strong>). How many trees were planted in <strong>5 rows</strong>?`,
      correctAnswer: '80',
      solution: locale === 'el'
        ? `16 · 5 ＝ 80 δέντρα.`
        : `16 · 5 ＝ 80 trees.`,
    };
  },

  // Πρόβλημα 13: Κόστος φωτοτυπιών
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΤΥΠΩΣΕΙΣ' : 'PROBLEMS: PRINTING',
      question: locale === 'el'
        ? `Σε ένα φωτοτυπείο κάθε σελίδα κοστίζει 0,05 € (τύπος: <strong>y ＝ 0,05 · ${v}</strong>). Πόσα ευρώ κοστίζει η εκτύπωση <strong>200 σελίδων</strong>;`
        : `At a copy shop each page costs €0.05 (formula: <strong>y ＝ 0.05 · ${v}</strong>). How much does printing <strong>200 pages</strong> cost in euros?`,
      correctAnswer: '10',
      solution: locale === 'el'
        ? `0,05 · 200 ＝ 10 €.`
        : `0.05 · 200 ＝ €10.`,
    };
  },

  // Πρόβλημα 14: Βάρος φορτίου κιβωτίων
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ' : 'PROBLEMS: TRANSPORT',
      question: locale === 'el'
        ? `Κάθε κιβώτιο με φρούτα ζυγίζει 18 kg (τύπος: <strong>y ＝ 18 · ${v}</strong>). Ποιο είναι το συνολικό βάρος σε kg για <strong>10 κιβώτια</strong>;`
        : `Each crate of fruit weighs 18 kg (formula: <strong>y ＝ 18 · ${v}</strong>). What is the total weight in kg for <strong>10 crates</strong>?`,
      correctAnswer: '180',
      solution: locale === 'el'
        ? `18 · 10 ＝ 180 kg.`
        : `18 · 10 ＝ 180 kg.`,
    };
  },

  // Πρόβλημα 15: Πλήρωση μπουκαλιών
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ' : 'PROBLEMS: CAPACITY',
      question: locale === 'el'
        ? `Κάθε μπουκάλι χωράει 1,5 λίτρο γάλα (τύπος: <strong>y ＝ 1,5 · ${v}</strong>). Πόσα λίτρα γάλα περιέχουν <strong>8 μπουκάλια</strong>;`
        : `Each bottle holds 1.5 liters of milk (formula: <strong>y ＝ 1.5 · ${v}</strong>). How many liters of milk are contained in <strong>8 bottles</strong>?`,
      correctAnswer: '12',
      solution: locale === 'el'
        ? `1,5 · 8 ＝ 12 λίτρα.`
        : `1.5 · 8 ＝ 12 liters.`,
    };
  },

  // Πρόβλημα 16: Αμοιβή υπερωρίας
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΙΣΘΟΔΟΣΙΑ' : 'PROBLEMS: OVERTIME',
      question: locale === 'el'
        ? `Η αμοιβή υπερωρίας είναι 14 € ανά ώρα (τύπος: <strong>y ＝ 14 · ${v}</strong>). Αν ένας εργαζόμενος έλαβε <strong>70 €</strong> υπερωρίες, πόσες ώρες (${v}) εργάστηκε;`
        : `Overtime pay is €14 per hour (formula: <strong>y ＝ 14 · ${v}</strong>). If an employee received <strong>€70</strong> in overtime pay, how many hours (${v}) did they work?`,
      correctAnswer: '5',
      solution: locale === 'el'
        ? `14 · ${v} ＝ 70 ➔ ${v} ＝ 70 : 14 ＝ 5 ώρες.`
        : `14 · ${v} ＝ 70 ➔ ${v} ＝ 70 : 14 ＝ 5 hours.`,
    };
  },

  // Πρόβλημα 17: Κατασκευή παγκακιών
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΞΥΛΟΥΡΓΙΚΗ' : 'PROBLEMS: WOODWORKING',
      question: locale === 'el'
        ? `Για κάθε ξύλινο παγκάκι απαιτούνται 6 σανίδες (τύπος: <strong>y ＝ 6 · ${v}</strong>). Πόσες σανίδες χρειάζονται για <strong>11 παγκάκια</strong>;`
        : `Each wooden bench requires 6 planks (formula: <strong>y ＝ 6 · ${v}</strong>). How many planks are needed for <strong>11 benches</strong>?`,
      correctAnswer: '66',
      solution: locale === 'el'
        ? `6 · 11 ＝ 66 σανίδες.`
        : `6 · 11 ＝ 66 planks.`,
    };
  },

  // Πρόβλημα 18: Χρόνος περιστροφής τροχού
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΗΧΑΝΙΚΗ' : 'PROBLEMS: ROTATION',
      question: locale === 'el'
        ? `Ένας τροχός κάνει 45 περιστροφές ανά λεπτό (τύπος: <strong>y ＝ 45 · ${v}</strong>). Πόσες περιστροφές θα ολοκληρώσει σε <strong>4 λεπτά</strong>;`
        : `A wheel makes 45 revolutions per minute (formula: <strong>y ＝ 45 · ${v}</strong>). How many revolutions will it complete in <strong>4 minutes</strong>?`,
      correctAnswer: '180',
      solution: locale === 'el'
        ? `45 · 4 ＝ 180 περιστροφές.`
        : `45 · 4 ＝ 180 revolutions.`,
    };
  },

  // Πρόβλημα 19: Κόστος καυσίμου
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ' : 'PROBLEMS: FUEL',
      question: locale === 'el'
        ? `Ένα όχημα καίει 0,08 λίτρα βενζίνης ανά χιλιόμετρο (τύπος: <strong>y ＝ 0,08 · ${v}</strong>). Πόσα λίτρα καυσίμου θα κάψει σε διαδρομή <strong>100 χιλιομέτρων</strong>;`
        : `A car consumes 0.08 liters of petrol per kilometer (formula: <strong>y ＝ 0.08 · ${v}</strong>). How many liters of fuel will it burn on a <strong>100 km trip</strong>?`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `0,08 · 100 ＝ 8 λίτρα.`
        : `0.08 · 100 ＝ 8 liters.`,
    };
  },

  // Πρόβλημα 20: Δημιουργία πακέτων δώρων
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΣΚΕΥΑΣΙΑ' : 'PROBLEMS: PACKAGING',
      question: locale === 'el'
        ? `Σε κάθε πακέτο δώρου τοποθετούνται 5 σοκολατάκια (τύπος: <strong>y ＝ 5 · ${v}</strong>). Αν έχουμε <strong>75 σοκολατάκια</strong>, πόσα πλήρη πακέτα (${v}) μπορούμε να φτιάξουμε;`
        : `Each gift box contains 5 chocolates (formula: <strong>y ＝ 5 · ${v}</strong>). If we have <strong>75 chocolates</strong>, how many complete boxes (${v}) can we make?`,
      correctAnswer: '15',
      solution: locale === 'el'
        ? `5 · ${v} ＝ 75 ➔ ${v} ＝ 75 : 5 ＝ 15 πακέτα.`
        : `5 · ${v} ＝ 75 ➔ ${v} ＝ 75 : 5 ＝ 15 gift boxes.`,
    };
  },
];

export default function AkolouthiaViewAsk() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];
  const variableSymbol = locale === 'el' ? 'ν' : 'n';

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
      ...gen(locale, variableSymbol),
    }));

    const selectedProblems = shuffledProblems.slice(0, 2).map((gen, idx) => ({
      id: 11 + idx,
      ...gen(locale, variableSymbol),
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
    // Επιτρέπουμε νούμερα, κόμμα, μείον και μεταβλητή v/ν/n
    clean = clean.replace(/[^0-9,/,\-v,ν,n,*,+,()]/gi, '');

    if (clean.length > 14) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const checkAnswerMatch = (userRaw, correctRaw) => {
    if (!userRaw || !correctRaw) return false;

    const normalize = (str) =>
      str
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/ν/g, 'v')
        .replace(/n/g, 'v')
        .replace(/^\+/, '')
        .replace(/\./g, ',');

    const u = normalize(userRaw);
    const c = normalize(correctRaw);

    if (u === c) return true;

    // Έλεγχος αριθμητικών τιμών με ανοχή 0.05
    const uNum = parseFloat(u.replace(',', '.'));
    const cNum = parseFloat(c.replace(',', '.'));
    if (!isNaN(uNum) && !isNaN(cNum) && !u.includes('v') && !c.includes('v') && !u.includes('(')) {
      return Math.abs(uNum - cNum) <= 0.05;
    }

    return false;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      const userAns = userAnswers[q.id] || '';
      if (checkAnswerMatch(userAns, q.correctAnswer)) {
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
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/26-akolouthia-view"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-32 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.chapterBadge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.mainTitle}
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.mainSubtitle}
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const isCorrect = isSubmitted && checkAnswerMatch(userAns, q.correctAnswer);
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
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded shrink-0">
                            {toCleanUppercase(t.wordProblemTag)}
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
                          maxLength={14}
                          disabled={isSubmitted}
                          placeholder={t.inputPlaceholder}
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
                              className={`min-h-[46px] py-2 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between gap-2 transition-all touch-manipulation active:scale-[0.98] w-full break-words whitespace-normal leading-snug flex-1 ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span className="flex-1 break-words [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: opt }} />
                              {isSelected && <span className="shrink-0 font-black">✓</span>}
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
                            <span>{toCleanUppercase(t.correctFeedback)}</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>{toCleanUppercase(t.wrongFeedback)}</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-flex flex-wrap items-center gap-1 font-mono">
                              <span>{toCleanUppercase(t.correctAnswerLabel)}</span>
                              <span className="text-emerald-700 font-black" dangerouslySetInnerHTML={{ __html: q.correctAnswer }} />
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
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkBtn)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newExercisesBtn)}</span>
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
                {toCleanUppercase(isSubmitted ? t.finalScoreLabel : t.progressLabel)}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {toCleanUppercase(t.successRateLabel)}
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
              <span className="hidden sm:inline">{toCleanUppercase(t.newExercisesBtn)}</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>{toCleanUppercase(t.checkScoreShort)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                {toCleanUppercase(t.repeatBtn)}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
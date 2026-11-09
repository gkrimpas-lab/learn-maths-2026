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
    pageTitle: "Ασκήσεις: Η Έννοια της Μεταβλητής | Α' Γυμνασίου",
    pageDesc: "12 δυναμικές ασκήσεις και προβλήματα στην έννοια της μεταβλητής, τον συντελεστή και τον σταθερό όρο για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 24 • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Μεταβλητή, Συντελεστής & Σταθερός Όρος",
    mainSubtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 ασκήσεις αναγνώρισης όρων και υπολογισμού αριθμητικής τιμής ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    wordProblemTag: "ΠΡΟΒΛΗΜΑ",
    inputPlaceholder: "π.χ. 17 ή 45",
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
    pageTitle: "Exercises: The Concept of Variable | 7th Grade Math",
    pageDesc: "12 dynamic exercises and problems on the concept of variables, coefficients, and constants for Grade 7.",
    backText: "7th Grade",
    theoryBtn: "THEORY",
    chapterBadge: "GRADE 7 • CHAPTER 24 • PRACTICE",
    mainTitle: "Variables, Coefficients & Constants",
    mainSubtitle: "Solve the following 12 selected exercises (10 exercises on identifying terms and evaluating numerical expressions ＋ 2 realistic problems). Click \"CHECK ANSWERS\" to see your score and step-by-step solutions.",
    wordProblemTag: "WORD PROBLEM",
    inputPlaceholder: "e.g. 17 or 45",
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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΜΕΤΑΒΛΗΤΗΣ, ΣΥΝΤΕΛΕΣΤΗ & ΣΤΑΘΕΡΟΥ ΟΡΟΥ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Εύρεση συντελεστή σε απλή παράσταση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΤΕΛΕΣΤΗΣ' : 'COEFFICIENT',
      question: locale === 'el'
        ? `Ποιος είναι ο συντελεστής της μεταβλητής x στην παράσταση <strong>7 · x</strong>;`
        : `What is the coefficient of variable x in the expression <strong>7 · x</strong>?`,
      correctAnswer: '7',
      solution: locale === 'el'
        ? `Συντελεστής είναι ο αριθμός που πολλαπλασιάζεται με τη μεταβλητή, δηλαδή το 7.`
        : `The coefficient is the numerical factor multiplying the variable, which is 7.`,
    };
  },

  // 2. Εύρεση συντελεστή στο -x (MCQ)
  (locale) => {
    const correct = '－1';
    const wrongs = locale === 'el'
      ? ['0', '1', 'Δεν υπάρχει συντελεστής']
      : ['0', '1', 'No coefficient exists'];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΙΔΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ' : 'SPECIAL COEFFICIENT',
      question: locale === 'el'
        ? `Ποιος είναι ο συντελεστής της μεταβλητής στην παράσταση <strong>－x</strong>;`
        : `What is the coefficient of the variable in the expression <strong>－x</strong>?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Το －x ισοδυναμεί με (－1) · x, επομένως ο συντελεστής είναι το －1.`
        : `－x is equivalent to (－1) · x, so the coefficient is －1.`,
    };
  },

  // 3. Εύρεση σταθερού όρου (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΤΑΘΕΡΟΣ ΟΡΟΣ' : 'CONSTANT TERM',
      question: locale === 'el'
        ? `Ποιος είναι ο σταθερός όρος στην αλγεβρική παράσταση <strong>4 · x ＋ 9</strong>;`
        : `What is the constant term in the algebraic expression <strong>4 · x ＋ 9</strong>?`,
      correctAnswer: '9',
      solution: locale === 'el'
        ? `Σταθερός όρος είναι ο αριθμός που δεν περιέχει μεταβλητή, δηλαδή το ＋9.`
        : `The constant term is the number without any variable attached, which is ＋9.`,
    };
  },

  // 4. Εύρεση αρνητικού σταθερού όρου (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟΣ ΣΤΑΘΕΡΟΣ' : 'NEGATIVE CONSTANT',
      question: locale === 'el'
        ? `Ποιος είναι ο σταθερός όρος στην αλγεβρική παράσταση <strong>2 · x － 5</strong>;`
        : `What is the constant term in the algebraic expression <strong>2 · x － 5</strong>?`,
      correctAnswer: '-5',
      solution: locale === 'el'
        ? `Ο σταθερός όρος παίρνει πάντοτε το πρόσημό του: －5.`
        : `The constant term always carries its sign: －5.`,
    };
  },

  // 5. Υπολογισμός αριθμητικής τιμής (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ' : 'NUMERICAL VALUE',
      question: locale === 'el'
        ? `Υπολόγισε την αριθμητική τιμή της παράστασης <strong>3 · x ＋ 4</strong> για <strong>x ＝ 2</strong>:`
        : `Calculate the numerical value of expression <strong>3 · x ＋ 4</strong> for <strong>x ＝ 2</strong>:`,
      correctAnswer: '10',
      solution: locale === 'el'
        ? `Αντικαθιστούμε x ＝ 2: 3 · 2 ＋ 4 ＝ 6 ＋ 4 ＝ 10.`
        : `Substitute x ＝ 2: 3 · 2 ＋ 4 ＝ 6 ＋ 4 ＝ 10.`,
    };
  },

  // 6. Υπολογισμός τιμής με αρνητικό x (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΗ ΜΕΤΑΒΛΗΤΗ' : 'NEGATIVE VARIABLE',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης <strong>5 · x ＋ 12</strong> για <strong>x ＝ －2</strong>:`
        : `Calculate the value of expression <strong>5 · x ＋ 12</strong> for <strong>x ＝ －2</strong>:`,
      correctAnswer: '2',
      solution: locale === 'el'
        ? `Αντικαθιστούμε x ＝ －2: 5 · (－2) ＋ 12 ＝ －10 ＋ 12 ＝ 2.`
        : `Substitute x ＝ －2: 5 · (－2) ＋ 12 ＝ －10 ＋ 12 ＝ 2.`,
    };
  },

  // 7. Υπολογισμός τιμής με αρνητικό συντελεστή (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ' : 'NEGATIVE COEFFICIENT',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης <strong>－2 · x ＋ 10</strong> για <strong>x ＝ 3</strong>:`
        : `Calculate the value of expression <strong>－2 · x ＋ 10</strong> for <strong>x ＝ 3</strong>:`,
      correctAnswer: '4',
      solution: locale === 'el'
        ? `(－2) · 3 ＋ 10 ＝ －6 ＋ 10 ＝ 4.`
        : `(－2) · 3 ＋ 10 ＝ －6 ＋ 10 ＝ 4.`,
    };
  },

  // 8. Υπολογισμός τιμής για x = 0 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΗΔΕΝΙΚΗ ΜΕΤΑΒΛΗΤΗ' : 'ZERO VARIABLE',
      question: locale === 'el'
        ? `Ποια είναι η τιμή της παράστασης <strong>8 · x ＋ 15</strong> όταν <strong>x ＝ 0</strong>;`
        : `What is the value of expression <strong>8 · x ＋ 15</strong> when <strong>x ＝ 0</strong>?`,
      correctAnswer: '15',
      solution: locale === 'el'
        ? `8 · 0 ＋ 15 ＝ 0 ＋ 15 ＝ 15 (απομένει μόνο ο σταθερός όρος).`
        : `8 · 0 ＋ 15 ＝ 0 ＋ 15 ＝ 15 (only the constant term remains).`,
    };
  },

  // 9. Μετάβαση από λεκτική σε αλγεβρική μορφή (MCQ)
  (locale) => {
    const correct = '5 · x ＋ 3';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΛΓΕΒΡΑ' : 'ALGEBRAIC TRANSLATION',
      question: locale === 'el'
        ? `Πώς γράφεται συμβολικά η φράση: «Το πενταπλάσιο ενός αριθμού x αυξημένο κατά 3»;`
        : `How is the phrase \"Five times a number x increased by 3\" written symbolically?`,
      options: makeUniqueOptions(correct, ['5 · (x ＋ 3)', 'x ＋ 5 · 3', '5 · x － 3']),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Πενταπλάσιο του x είναι το 5 · x και αυξημένο κατά 3 είναι το ＋ 3, άρα 5 · x ＋ 3.`
        : `Five times x is 5 · x, and increased by 3 gives ＋ 3, so 5 · x ＋ 3.`,
    };
  },

  // 10. Αναγνώριση σταθερού όρου στο 6x (MCQ)
  (locale) => {
    const correct = '0';
    const wrongs = locale === 'el'
      ? ['6', '1', 'Δεν ορίζεται']
      : ['6', '1', 'Undefined'];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΤΑΘΕΡΟΣ ΟΡΟΣ' : 'CONSTANT TERM',
      question: locale === 'el'
        ? `Ποιος είναι ο σταθερός όρος στην παράσταση <strong>6 · x</strong>;`
        : `What is the constant term in the expression <strong>6 · x</strong>?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Η παράσταση 6x γράφεται 6x ＋ 0, άρα ο σταθερός όρος είναι το 0.`
        : `6x can be written as 6x ＋ 0, so the constant term is 0.`,
    };
  },

  // 11. Συντελεστής στο x (MCQ)
  (locale) => {
    const correct = '1';
    const wrongs = locale === 'el'
      ? ['8', '0', 'Δεν υπάρχει']
      : ['8', '0', 'None'];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΝΤΕΛΕΣΤΗΣ' : 'COEFFICIENT',
      question: locale === 'el'
        ? `Ποιος είναι ο συντελεστής της μεταβλητής στην παράσταση <strong>x ＋ 8</strong>;`
        : `What is the coefficient of the variable in the expression <strong>x ＋ 8</strong>?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Μπροστά από το x εννοείται ο αριθμός 1 (1 · x ＝ x), άρα ο συντελεστής είναι 1.`
        : `In front of x, the factor 1 is implied (1 · x ＝ x), so the coefficient is 1.`,
    };
  },

  // 12. Υπολογισμός τιμής με δύο αρνητικά (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΣΗΜΑ & ΥΠΟΛΟΓΙΣΜΟΣ' : 'SIGNS & EVALUATION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης <strong>－3 · x － 5</strong> για <strong>x ＝ －4</strong>:`
        : `Calculate the value of expression <strong>－3 · x － 5</strong> for <strong>x ＝ －4</strong>:`,
      correctAnswer: '7',
      solution: locale === 'el'
        ? `(－3) · (－4) － 5 ＝ ＋12 － 5 ＝ 7.`
        : `(－3) · (－4) － 5 ＝ ＋12 － 5 ＝ 7.`,
    };
  },

  // 13. Εύρεση μεταβλητής x όταν γνωρίζουμε την τιμή (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΥΡΕΣΗ ΜΕΤΑΒΛΗΤΗΣ' : 'FINDING VARIABLE',
      question: locale === 'el'
        ? `Αν η παράσταση <strong>2 · x ＋ 1</strong> έχει αριθμητική τιμή ίση με <strong>15</strong>, ποια είναι η τιμή του <strong>x</strong>;`
        : `If the expression <strong>2 · x ＋ 1</strong> evaluates to <strong>15</strong>, what is the value of <strong>x</strong>?`,
      correctAnswer: '7',
      solution: locale === 'el'
        ? `2 · x ＋ 1 ＝ 15 ➔ 2 · x ＝ 14 ➔ x ＝ 7.`
        : `2 · x ＋ 1 ＝ 15 ➔ 2 · x ＝ 14 ➔ x ＝ 7.`,
    };
  },

  // 14. Συντελεστής με κλάσμα/δεκαδικό (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ' : 'DECIMAL COEFFICIENT',
      question: locale === 'el'
        ? `Ποιος είναι ο συντελεστής της μεταβλητής στην παράσταση <strong>0,5 · x ＋ 3</strong>;`
        : `What is the coefficient of the variable in the expression <strong>0.5 · x ＋ 3</strong>?`,
      correctAnswer: '0,5',
      solution: locale === 'el'
        ? `Ο συντελεστής είναι ο δεκαδικός αριθμός 0,5.`
        : `The coefficient is the decimal number 0.5.`,
    };
  },

  // 15. Υπολογισμός τιμής με δεκαδικό (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΗ ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ' : 'DECIMAL EVALUATION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης <strong>1,5 · x ＋ 2</strong> για <strong>x ＝ 4</strong>:`
        : `Calculate the value of expression <strong>1.5 · x ＋ 2</strong> for <strong>x ＝ 4</strong>:`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `1,5 · 4 ＋ 2 ＝ 6 ＋ 2 ＝ 8.`
        : `1.5 · 4 ＋ 2 ＝ 6 ＋ 2 ＝ 8.`,
    };
  },

  // 16. Τι σημαίνει μεταβλητή (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Ένα γράμμα που εκφράζει έναν άγνωστο αριθμό ή έναν αριθμό που μπορεί να πάρει διάφορες τιμές'
      : 'A letter representing an unknown number or a quantity that can take various values';
    const wrongs = locale === 'el'
      ? [
          'Έναν αριθμό που παραμένει υποχρεωτικά σταθερός για πάντα',
          'Ένα γεωμετρικό σχήμα με 4 πλευρές',
          'Το σύμβολο του πολλαπλασιασμού',
        ]
      : [
          'A number that strictly remains constant forever',
          'A geometric shape with 4 sides',
          'The symbol of multiplication',
        ];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΝΝΟΙΑ ΜΕΤΑΒΛΗΤΗΣ' : 'CONCEPT OF VARIABLE',
      question: locale === 'el'
        ? `Τι παριστάνει μια μεταβλητή στα Μαθηματικά;`
        : `What does a variable represent in mathematics?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Η μεταβλητή είναι ένα γράμμα που εκφράζει άγνωστη ή μεταβαλλόμενη ποσότητα.`
        : `A variable is a symbol or letter denoting an unknown or changing quantity.`,
    };
  },

  // 17. Εύρεση συντελεστή σε παράσταση 10 - 4x (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΤΕΛΕΣΤΗΣ' : 'COEFFICIENT',
      question: locale === 'el'
        ? `Ποιος είναι ο συντελεστής του x στην παράσταση <strong>10 － 4 · x</strong>;`
        : `What is the coefficient of x in the expression <strong>10 － 4 · x</strong>?`,
      correctAnswer: '-4',
      solution: locale === 'el'
        ? `Μπροστά από το x βρίσκεται το －4 (η παράσταση γράφεται －4x ＋ 10), άρα ο συντελεστής είναι το －4.`
        : `In front of x is －4 (the expression can be rewritten as －4x ＋ 10), so the coefficient is －4.`,
    };
  },

  // 18. Σταθερός όρος στην 10 - 4x (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΤΑΘΕΡΟΣ ΟΡΟΣ' : 'CONSTANT TERM',
      question: locale === 'el'
        ? `Ποιος είναι ο σταθερός όρος στην παράσταση <strong>10 － 4 · x</strong>;`
        : `What is the constant term in the expression <strong>10 － 4 · x</strong>?`,
      correctAnswer: '10',
      solution: locale === 'el'
        ? `Ο όρος χωρίς μεταβλητή είναι το ＋10.`
        : `The term without any variable is ＋10.`,
    };
  },

  // 19. Υπολογισμός τιμής με κλάσμα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΙΘΜΗΤΙΚΗ ΤΙΜΗ' : 'NUMERICAL VALUE',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης <strong>0,5 · x ＋ 5</strong> για <strong>x ＝ 6</strong>:`
        : `Calculate the value of expression <strong>0.5 · x ＋ 5</strong> for <strong>x ＝ 6</strong>:`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `0,5 · 6 ＋ 5 ＝ 3 ＋ 5 ＝ 8.`
        : `0.5 · 6 ＋ 5 ＝ 3 ＋ 5 ＝ 8.`,
    };
  },

  // 20. Μετάφραση φράσης «ελαττωμένο» (MCQ)
  (locale) => {
    const correct = '4 · x － 7';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΛΓΕΒΡΑ' : 'ALGEBRAIC TRANSLATION',
      question: locale === 'el'
        ? `Πώς εκφράζεται συμβολικά: «Το τετραπλάσιο ενός αριθμού x ελαττωμένο κατά 7»;`
        : `How is \"Four times a number x decreased by 7\" written symbolically?`,
      options: makeUniqueOptions(correct, ['4 · x ＋ 7', '7 · x － 4', '4 · (x － 7)']),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Τετραπλάσιο είναι 4 · x και ελαττωμένο κατά 7 σημαίνει － 7.`
        : `Four times is 4 · x, and decreased by 7 means － 7.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (ΧΩΡΙΣ ΕΤΟΙΜΟΥΣ ΤΥΠΟΥΣ)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Χρέωση ταξί
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ' : 'PROBLEMS: TRANSPORTATION',
      question: locale === 'el'
        ? `Ένα ταξί χρεώνει 2 € πάγια εκκίνηση (σημαία) και επιπλέον 1,50 € για κάθε χιλιόμετρο διαδρομής. Πόσο θα πληρώσει ένας επιβάτης για μια διαδρομή <strong>10 χιλιομέτρων</strong> σε ευρώ;`
        : `A taxi charges a €2 base flag drop plus €1.50 per kilometer of travel. How much will a passenger pay for a <strong>10 km ride</strong> in euros?`,
      correctAnswer: '17',
      solution: locale === 'el'
        ? `Σταθερός όρος: 2 €. Μεταβλητό κόστος: 1,5 · 10 ＝ 15 €. Συνολικό κόστος: 1,5 · 10 ＋ 2 ＝ 17 €.`
        : `Fixed fee: €2. Variable cost: 1.5 · 10 ＝ €15. Total: 1.5 · 10 ＋ 2 ＝ €17.`,
    };
  },

  // Πρόβλημα 2: Συνδρομή γυμναστηρίου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΔΡΟΜΗ' : 'PROBLEMS: MEMBERSHIP',
      question: locale === 'el'
        ? `Ένα γυμναστήριο χρεώνει 20 € εφάπαξ εγγραφή και 25 € για κάθε μήνα προπόνησης. Πόσο θα πληρώσει συνολικά ένα νέο μέλος για <strong>4 μήνες</strong> σε ευρώ;`
        : `A gym charges a €20 one-time registration fee and €25 per month of workout. How much will a new member pay in total for <strong>4 months</strong> in euros?`,
      correctAnswer: '120',
      solution: locale === 'el'
        ? `Σταθερό κόστος εγγραφής: 20 €. Μηνιαίες συνδρομές: 25 · 4 ＝ 100 €. Σύνολο: 25 · 4 ＋ 20 ＝ 120 €.`
        : `One-time fee: €20. Monthly dues: 25 · 4 ＝ €100. Total: 25 · 4 ＋ 20 ＝ €120.`,
    };
  },

  // Πρόβλημα 3: Αποταμίευση στον κουμπαρά
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΤΑΜΙΕΥΣΗ' : 'PROBLEMS: SAVINGS',
      question: locale === 'el'
        ? `Η Ελένη έχει ήδη 30 € στον κουμπαρά της και αποφασίζει να αποταμιεύει 6 € κάθε εβδομάδα. Πόσα χρήματα θα έχει συγκεντρώσει συνολικά μετά από <strong>5 εβδομάδες</strong>;`
        : `Helen already has €30 in her piggy bank and decides to save €6 every week. How much money will she have in total after <strong>5 weeks</strong>?`,
      correctAnswer: '60',
      solution: locale === 'el'
        ? `Αρχικό ποσό (σταθερό): 30 €. Αποταμίευση 5 εβδομάδων: 6 · 5 ＝ 30 €. Συνολικό ποσό: 6 · 5 ＋ 30 ＝ 60 €.`
        : `Initial savings: €30. Saved in 5 weeks: 6 · 5 ＝ €30. Total: 6 · 5 ＋ 30 ＝ €60.`,
    };
  },

  // Πρόβλημα 4: Πάγιο κινητής τηλεφωνίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΗΛΕΦΩΝΙΑ' : 'PROBLEMS: MOBILE PLAN',
      question: locale === 'el'
        ? `Ένα συμβόλαιο κινητής τηλεφωνίας έχει σταθερό πάγιο 12 € το μήνα και χρεώνει 0,10 € για κάθε επιπλέον γραπτό μήνυμα. Πόσο θα πληρώσει ένας συνδρομητής που έστειλε <strong>50 επιπλέον μηνύματα</strong> σε ευρώ;`
        : `A mobile contract has a fixed €12 monthly fee and charges €0.10 for each additional text message. How much will a subscriber pay if they send <strong>50 extra messages</strong> in euros?`,
      correctAnswer: '17',
      solution: locale === 'el'
        ? `Σταθερό πάγιο: 12 €. Κόστος μηνυμάτων: 0,10 · 50 ＝ 5 €. Τελικό ποσό: 0,1 · 50 ＋ 12 ＝ 17 €.`
        : `Fixed fee: €12. Messages cost: 0.10 · 50 ＝ €5. Total: 0.1 · 50 ＋ 12 ＝ €17.`,
    };
  },

  // Πρόβλημα 5: Ενοικίαση εργαλείου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΟΙΚΙΑΣΗ' : 'PROBLEMS: EQUIPMENT RENTAL',
      question: locale === 'el'
        ? `Η ενοικίαση ενός μηχανήματος απαιτεί 15 € βασική εγγύηση συν 8 € για κάθε ημέρα χρήσης του. Πόσο θα πληρώσει ένας τεχνικός για <strong>6 ημέρες</strong> χρήσης σε ευρώ;`
        : `Renting a machine requires a €15 base fee plus €8 for each day of use. How much will a technician pay for <strong>6 days</strong> of use in euros?`,
      correctAnswer: '63',
      solution: locale === 'el'
        ? `Βασική χρέωση: 15 €. Ημερήσιο κόστος: 8 · 6 ＝ 48 €. Σύνολο: 8 · 6 ＋ 15 ＝ 63 €.`
        : `Base fee: €15. Daily charge: 8 · 6 ＝ €48. Total: 8 · 6 ＋ 15 ＝ €63.`,
    };
  },

  // Πρόβλημα 6: Κατανάλωση καυσίμου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΥΤΟΚΙΝΗΤΟ' : 'PROBLEMS: FUEL',
      question: locale === 'el'
        ? `Ένα ρεζερβουάρ περιέχει αρχικά 50 λίτρα βενζίνης. Το αυτοκίνητο καταναλώνει 2 λίτρα καυσίμου για κάθε ώρα ταξιδιού. Πόσα λίτρα βενζίνης θα απομένουν μετά από <strong>7 ώρες</strong> οδήγησης;`
        : `A fuel tank initially contains 50 liters of petrol. The car consumes 2 liters of fuel per hour of travel. How many liters of fuel will remain after <strong>7 hours</strong> of driving?`,
      correctAnswer: '36',
      solution: locale === 'el'
        ? `Αρχικό καύσιμο: 50 L. Κατανάλωση: 2 · 7 ＝ 14 L. Απομένουν: 50 － 2 · 7 ＝ 36 L.`
        : `Initial fuel: 50 L. Consumption: 2 · 7 ＝ 14 L. Remaining: 50 － 2 · 7 ＝ 36 L.`,
    };
  },

  // Πρόβλημα 7: Χρέωση εκτύπωσης βιβλίων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΤΥΠΩΣΕΙΣ' : 'PROBLEMS: PRINTING',
      question: locale === 'el'
        ? `Ένα τυπογραφείο χρεώνει 25 € πάγια έξοδα σελιδοποίησης και επιπλέον 0,05 € για κάθε σελίδα που εκτυπώνεται. Πόσο κοστίζει η εκτύπωση ενός βιβλίου <strong>400 σελίδων</strong> σε ευρώ;`
        : `A printing shop charges €25 setup fee plus €0.05 per printed page. How much does printing a <strong>400-page</strong> book cost in euros?`,
      correctAnswer: '45',
      solution: locale === 'el'
        ? `Πάγιο: 25 €. Κόστος σελίδων: 0,05 · 400 ＝ 20 €. Τελικό κόστος: 0,05 · 400 ＋ 25 ＝ 45 €.`
        : `Setup fee: €25. Page cost: 0.05 · 400 ＝ €20. Total: 0.05 · 400 ＋ 25 ＝ €45.`,
    };
  },

  // Πρόβλημα 8: Αμοιβή τεχνικού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΥΠΗΡΕΣΙΕΣ' : 'PROBLEMS: SERVICES',
      question: locale === 'el'
        ? `Ένας υδραυλικός χρεώνει 20 € σταθερή αμοιβή επίσκεψης και 15 € για κάθε ώρα εργασίας του. Πόσο θα πληρωθεί συνολικά για επισκευή που διήρκεσε <strong>3 ώρες</strong> σε ευρώ;`
        : `A plumber charges a €20 fixed call-out fee and €15 per hour of labor. How much will they be paid in total for a repair lasting <strong>3 hours</strong> in euros?`,
      correctAnswer: '65',
      solution: locale === 'el'
        ? `Πάγια επίσκεψη: 20 €. Ώρες εργασίας: 15 · 3 ＝ 45 €. Σύνολο: 15 · 3 ＋ 20 ＝ 65 €.`
        : `Call-out fee: €20. Labor: 15 · 3 ＝ €45. Total: 15 · 3 ＋ 20 ＝ €65.`,
    };
  },

  // Πρόβλημα 9: Στάθμη νερού πισίνας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΥΔΡΑΥΛΙΚΑ' : 'PROBLEMS: RESERVOIR',
      question: locale === 'el'
        ? `Μια δεξαμενή περιέχει αρχικά 80 κυβικά μέτρα νερό και αδειάζει με ρυθμό 3 κυβικά μέτρα ανά ώρα. Πόσα κυβικά μέτρα νερού θα απομένουν στη δεξαμενή μετά από <strong>10 ώρες</strong>;`
        : `A water tank initially holds 80 cubic meters of water and drains at 3 cubic meters per hour. How many cubic meters of water will remain in the tank after <strong>10 hours</strong>?`,
      correctAnswer: '50',
      solution: locale === 'el'
        ? `Αρχικό νερό: 80 κ.μ. Αδειάζουν: 3 · 10 ＝ 30 κ.μ. Απομένουν: 80 － 3 · 10 ＝ 50 κ.μ.`
        : `Initial water: 80 m³. Drained: 3 · 10 ＝ 30 m³. Remaining: 80 － 3 · 10 ＝ 50 m³.`,
    };
  },

  // Πρόβλημα 10: Αγορά εισιτηρίων συναυλίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΙΣΙΤΗΡΙΑ' : 'PROBLEMS: TICKETS',
      question: locale === 'el'
        ? `Σε μια συναυλία κάθε εισιτήριο κοστίζει 18 €, ενώ υπάρχει και μία σταθερή επιβάρυνση 3 € για ολόκληρη την παραγγελία. Πόσο θα κοστίσει συνολικά η αγορά <strong>4 εισιτηρίων</strong> σε ευρώ;`
        : `For a concert each ticket costs €18, with a fixed booking fee of €3 for the order. How much will buying <strong>4 tickets</strong> cost in total in euros?`,
      correctAnswer: '75',
      solution: locale === 'el'
        ? `Εισιτήρια: 18 · 4 ＝ 72 €. Πάγια επιβάρυνση: 3 €. Συνολικό κόστος: 18 · 4 ＋ 3 ＝ 75 €.`
        : `Tickets: 18 · 4 ＝ €72. Booking fee: €3. Total: 18 · 4 ＋ 3 ＝ €75.`,
    };
  },

  // Πρόβλημα 11: Ύψος αναρριχητικού φυτού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΗ' : 'PROBLEMS: NATURE',
      question: locale === 'el'
        ? `Ένα φυτό έχει αρχικό ύψος 10 cm και ψηλώνει σταθερά κατά 4 cm κάθε εβδομάδα. Ποιο θα είναι το ύψος του φυτού σε εκατοστά μετά από <strong>8 εβδομάδες</strong>;`
        : `A plant has an initial height of 10 cm and steadily grows by 4 cm each week. What will its height be in centimeters after <strong>8 weeks</strong>?`,
      correctAnswer: '42',
      solution: locale === 'el'
        ? `Αρχικό ύψος: 10 cm. Ανάπτυξη: 4 · 8 ＝ 32 cm. Τελικό ύψος: 4 · 8 ＋ 10 ＝ 42 cm.`
        : `Initial height: 10 cm. Growth: 4 · 8 ＝ 32 cm. Total: 4 · 8 ＋ 10 ＝ 42 cm.`,
    };
  },

  // Πρόβλημα 12: Φόρτιση μπαταρίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ' : 'PROBLEMS: TECHNOLOGY',
      question: locale === 'el'
        ? `Η μπαταρία ενός φορητού υπολογιστή βρίσκεται στο 15% και φορτίζει με σταθερό ρυθμό 2% ανά λεπτό. Σε ποιο ποσοστό (%) θα βρίσκεται η μπαταρία μετά από <strong>25 λεπτά</strong> φόρτισης;`
        : `A laptop battery is at 15% and charges at a steady rate of 2% per minute. At what percentage (%) will the battery be after <strong>25 minutes</strong> of charging?`,
      correctAnswer: '65',
      solution: locale === 'el'
        ? `Αρχικό ποσοστό: 15%. Αύξηση: 2 · 25 ＝ 50%. Τελικό ποσοστό: 2 · 25 ＋ 15 ＝ 65%.`
        : `Initial: 15%. Increase: 2 · 25 ＝ 50%. Final percentage: 2 · 25 ＋ 15 ＝ 65%.`,
    };
  },

  // Πρόβλημα 13: Κόστος παράδοσης δεμάτων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: COURIER' : 'PROBLEMS: SHIPPING',
      question: locale === 'el'
        ? `Μια εταιρεία ταχυμεταφορών χρεώνει 4 € πάγια έξοδα αποστολής συν 1,20 € για κάθε κιλό βάρους του δέματος. Πόσο κοστίζει η αποστολή ενός δέματος βάρους <strong>5 kg</strong> σε ευρώ;`
        : `A courier company charges a €4 base fee plus €1.20 per kilogram of parcel weight. How much does sending a <strong>5 kg</strong> parcel cost in euros?`,
      correctAnswer: '10',
      solution: locale === 'el'
        ? `Πάγια αποστολή: 4 €. Χρέωση βάρους: 1,2 · 5 ＝ 6 €. Σύνολο: 1,2 · 5 ＋ 4 ＝ 10 €.`
        : `Base fee: €4. Weight cost: 1.2 · 5 ＝ €6. Total: 1.2 · 5 ＋ 4 ＝ €10.`,
    };
  },

  // Πρόβλημα 14: Καύση κεριού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ' : 'PROBLEMS: MEASUREMENT',
      question: locale === 'el'
        ? `Ένα κερί έχει αρχικό ύψος 30 cm και καίγεται μειούμενο κατά 2,5 cm για κάθε ώρα που παραμένει αναμμένο. Ποιο θα είναι το ύψος του κεριού σε εκατοστά μετά από <strong>4 ώρες</strong>;`
        : `A candle has an initial height of 30 cm and burns down by 2.5 cm per hour. What will the candle's height be in centimeters after <strong>4 hours</strong>?`,
      correctAnswer: '20',
      solution: locale === 'el'
        ? `Αρχικό ύψος: 30 cm. Μείωση: 2,5 · 4 ＝ 10 cm. Υπόλοιπο ύψος: 30 － 2,5 · 4 ＝ 20 cm.`
        : `Initial height: 30 cm. Burned: 2.5 · 4 ＝ 10 cm. Remaining: 30 － 2.5 · 4 ＝ 20 cm.`,
    };
  },

  // Πρόβλημα 15: Παραγωγή ηλιακών πάνελ
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΕΡΓΕΙΑ' : 'PROBLEMS: SOLAR ENERGY',
      question: locale === 'el'
        ? `Μια μπαταρία ηλιακού συστήματος περιέχει ήδη 10 kWh ενέργειας. Κατά τη διάρκεια της ημέρας τα πάνελ προσθέτουν 3 kWh για κάθε ώρα ηλιοφάνειας. Πόση ενέργεια (σε kWh) θα περιέχει η μπαταρία μετά από <strong>6 ώρες</strong> ηλιοφάνειας;`
        : `A solar battery system currently holds 10 kWh. During the day the panels produce 3 kWh per hour of sunshine. How much energy (in kWh) will the battery contain after <strong>6 hours</strong> of sunshine?`,
      correctAnswer: '28',
      solution: locale === 'el'
        ? `Αρχικό απόθεμα: 10 kWh. Νέα ενέργεια: 3 · 6 ＝ 18 kWh. Σύνολο: 3 · 6 ＋ 10 ＝ 28 kWh.`
        : `Initial: 10 kWh. Produced: 3 · 6 ＝ 18 kWh. Total: 3 · 6 ＋ 10 ＝ 28 kWh.`,
    };
  },

  // Πρόβλημα 16: Αμοιβή babysitting
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ' : 'PROBLEMS: WORK',
      question: locale === 'el'
        ? `Μια παιδαγωγός χρεώνει 5 € πάγια έξοδα μετακίνησης και 7 € για κάθε ώρα απασχόλησης. Πόσο θα πληρωθεί για απασχόληση διάρκειας <strong>4 ωρών</strong> σε ευρώ;`
        : `A babysitter charges €5 travel expenses plus €7 per hour of child care. How much will she be paid for <strong>4 hours</strong> of work in euros?`,
      correctAnswer: '33',
      solution: locale === 'el'
        ? `Μετακίνηση: 5 €. Ωριαία αμοιβή: 7 · 4 ＝ 28 €. Τελική αμοιβή: 7 · 4 ＋ 5 ＝ 33 €.`
        : `Travel: €5. Hourly pay: 7 · 4 ＝ €28. Total: 7 · 4 ＋ 5 ＝ €33.`,
    };
  },

  // Πρόβλημα 17: Χωρητικότητα σκληρού δίσκου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΠΛΗΡΟΦΟΡΙΚΗ' : 'PROBLEMS: COMPUTING',
      question: locale === 'el'
        ? `Σε έναν υπολογιστή υπάρχουν 100 GB ελεύθερου αποθηκευτικού χώρου. Κάθε εφαρμογή που εγκαθίσταται καταλαμβάνει σταθερά 12 GB. Πόσα GB ελεύθερου χώρου θα απομένουν μετά την εγκατάσταση <strong>5 εφαρμογών</strong>;`
        : `A computer has 100 GB of free storage. Each installed application occupies 12 GB. How many GB of free space will remain after installing <strong>5 applications</strong>?`,
      correctAnswer: '40',
      solution: locale === 'el'
        ? `Αρχικός χώρος: 100 GB. Δεσμευμένος χώρος: 12 · 5 ＝ 60 GB. Ελεύθερος χώρος: 100 － 12 · 5 ＝ 40 GB.`
        : `Initial space: 100 GB. Used: 12 · 5 ＝ 60 GB. Free space: 100 － 12 · 5 ＝ 40 GB.`,
    };
  },

  // Πρόβλημα 18: Ενοικίαση αυτοκινήτου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΑΞΙΔΙΑ' : 'PROBLEMS: CAR RENTAL',
      question: locale === 'el'
        ? `Μια εταιρεία ενοικίασης αυτοκινήτων χρεώνει 40 € πάγιο κόστος ασφάλισης και 35 € για κάθε ημέρα ενοικίασης του οχήματος. Πόσο θα κοστίσει η ενοικίαση για <strong>3 ημέρες</strong> σε ευρώ;`
        : `A car rental agency charges a €40 insurance fee plus €35 per day of rental. How much will renting the car for <strong>3 days</strong> cost in euros?`,
      correctAnswer: '145',
      solution: locale === 'el'
        ? `Ασφάλιση: 40 €. Ημερήσιο κόστος: 35 · 3 ＝ 105 €. Συνολικό κόστος: 35 · 3 ＋ 40 ＝ 145 €.`
        : `Insurance: €40. Daily cost: 35 · 3 ＝ €105. Total: 35 · 3 ＋ 40 ＝ €145.`,
    };
  },

  // Πρόβλημα 19: Κόστος catering εκδήλωσης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΣΤΙΑΣΗ' : 'PROBLEMS: CATERING',
      question: locale === 'el'
        ? `Μια υπηρεσία τροφοδοσίας χρεώνει 50 € πάγιο κόστος οργάνωσης εξοπλισμού και 12 € για το μενού κάθε καλεσμένου. Πόσο θα κοστίσει το τραπέζι για <strong>20 καλεσμένους</strong> σε ευρώ;`
        : `A catering service charges a €50 equipment setup fee plus €12 per guest meal. How much will the dinner for <strong>20 guests</strong> cost in euros?`,
      correctAnswer: '290',
      solution: locale === 'el'
        ? `Πάγιο οργάνωσης: 50 €. Κόστος καλεσμένων: 12 · 20 ＝ 240 €. Σύνολο: 12 · 20 ＋ 50 ＝ 290 €.`
        : `Setup fee: €50. Meals: 12 · 20 ＝ €240. Total: 12 · 20 ＋ 50 ＝ €290.`,
    };
  },

  // Πρόβλημα 20: Δαπάνες θέρμανσης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΠΙΤΙ' : 'PROBLEMS: HEATING',
      question: locale === 'el'
        ? `Η λειτουργία ενός καυστήρα απαιτεί 10 € μηνιαίο πάγιο συντήρησης και καταναλώνει καύσιμο αξίας 1,50 € για κάθε ώρα λειτουργίας. Ποιο είναι το συνολικό κόστος για <strong>40 ώρες</strong> λειτουργίας μέσα στον μήνα σε ευρώ;`
        : `A heating boiler requires a €10 monthly maintenance fee and consumes €1.50 worth of fuel per hour of operation. What is the total cost for <strong>40 hours</strong> of operation during the month in euros?`,
      correctAnswer: '70',
      solution: locale === 'el'
        ? `Πάγιο: 10 €. Κόστος καυσίμου: 1,5 · 40 ＝ 60 €. Σύνολο: 1,5 · 40 ＋ 10 ＝ 70 €.`
        : `Fixed fee: €10. Fuel cost: 1.5 · 40 ＝ €60. Total: 1.5 · 40 ＋ 10 ＝ €70.`,
    };
  },
];

export default function MetablitiAsk() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

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
    // Επιτρέπουμε νούμερα, κόμμα, μείον και μεταβλητή x
    clean = clean.replace(/[^0-9,/,\-x,X,*,+]/g, '');

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
        .replace(/,/g, '.')
        .replace(/－/g, '-')
        .replace(/^\+/, '');

    const u = normalize(userRaw);
    const c = normalize(correctRaw);

    if (u === c) return true;

    // Έλεγχος αριθμητικών τιμών με ανοχή 0.05
    const uNum = parseFloat(u);
    const cNum = parseFloat(c);
    if (!isNaN(uNum) && !isNaN(cNum) && !u.includes('x') && !c.includes('x')) {
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
          href="/a-gymnasiou/27-metabliti"
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
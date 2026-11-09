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
    pageTitle: "Ασκήσεις: Αλγεβρικές Σχέσεις & Εξισώσεις | Α' Γυμνασίου",
    pageDescription: "12 δυναμικές ασκήσεις και προβλήματα στην έννοια της εξίσωσης, τον συντελεστή και την εύρεση της ρίζας (λύσης) για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 27 • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Αλγεβρικές Σχέσεις & Εξισώσεις",
    mainSubtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 ασκήσεις κατανόησης εξισώσεων, ελέγχου λύσεων ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    problemBadge: "ΠΡΟΒΛΗΜΑ",
    placeholderInput: "π.χ. 5 ή 11",
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
    pageTitle: "Exercises: Algebraic Relationships & Equations | Grade 7 Math",
    pageDescription: "12 dynamic exercises and word problems on the concept of an equation, coefficients, and finding roots for Grade 7 Math.",
    backText: "Grade 7 Math",
    theoryBtn: "THEORY",
    chapterBadge: "GRADE 7 • CHAPTER 27 • PRACTICE",
    mainTitle: "Algebraic Relationships & Equations",
    mainSubtitle: "Solve the 12 selected exercises below (10 concept and verification questions ＋ 2 real-world application problems). Then click 'CHECK ANSWERS' to view your score and step-by-step solutions.",
    problemBadge: "PROBLEM",
    placeholderInput: "e.g. 5 or 11",
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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΕΝΝΟΙΑΣ ΕΞΙΣΩΣΗΣ & ΕΛΕΓΧΟΥ ΡΙΖΑΣ (el / en)
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Τι είναι εξίσωση (MCQ)
  (locale) => {
    const elCorrect = 'Μια ισότητα δύο παραστάσεων που περιέχει τουλάχιστον έναν άγνωστο αριθμό (μεταβλητή)';
    const enCorrect = 'An equality of two expressions containing at least one unknown number (variable)';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΟΡΙΣΜΟΣ ΕΞΙΣΩΣΗΣ' : 'DEFINITION OF EQUATION',
      question: locale === 'el'
        ? 'Τι ονομάζουμε <strong>εξίσωση</strong> στα Μαθηματικά;'
        : 'What is an <strong>equation</strong> in mathematics?',
      options: locale === 'el'
        ? makeUniqueOptions(elCorrect, [
            'Μια ανισότητα ανάμεσα σε δύο αριθμούς',
            'Μια μαθηματική παράσταση χωρίς το σύμβολο του ίσον',
            'Το αποτέλεσμα μιας πρόσθεσης'
          ])
        : makeUniqueOptions(enCorrect, [
            'An inequality between two numbers',
            'A mathematical expression without an equal sign',
            'The result of an addition'
          ]),
      correctAnswer: locale === 'el' ? elCorrect : enCorrect,
      solution: locale === 'el'
        ? 'Εξίσωση είναι πάντα μια ισότητα (έχει ＝) και περιέχει τουλάχιστον ένα γράμμα που λέγεται άγνωστος (π.χ. x).'
        : 'An equation is always an equality (containing ＝) and includes at least one variable letter known as the unknown (e.g., x).',
    };
  },

  // 2. Αναγνώριση συντελεστή (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΤΕΛΕΣΤΗΣ ΑΓΝΩΣΤΟΥ' : 'COEFFICIENT OF UNKNOWN',
      question: locale === 'el'
        ? 'Στην εξίσωση <strong>5 · x ＋ 4 ＝ 19</strong>, ποιος είναι ο συντελεστής του αγνώστου;'
        : 'In the equation <strong>5 · x ＋ 4 ＝ 19</strong>, what is the coefficient of the unknown?',
      correctAnswer: '5',
      solution: locale === 'el'
        ? 'Συντελεστής του αγνώστου είναι ο αριθμός που πολλαπλασιάζει το x, δηλαδή το 5.'
        : 'The coefficient of the unknown is the numerical factor multiplying x, which is 5.',
    };
  },

  // 3. Αναγνώριση 2ου μέλους (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΕΛΗ ΕΞΙΣΩΣΗΣ' : 'SIDES OF EQUATION',
      question: locale === 'el'
        ? 'Στην εξίσωση <strong>3 · x － 2 ＝ 10</strong>, ποιος αριθμός αποτελεί το <strong>2ο μέλος</strong> της εξίσωσης;'
        : 'In the equation <strong>3 · x － 2 ＝ 10</strong>, what number forms the <strong>right-hand side (2nd member)</strong>?',
      correctAnswer: '10',
      solution: locale === 'el'
        ? 'Το 2ο μέλος είναι η παράσταση στα δεξιά του συμβόλου της ισότητας (＝), δηλαδή το 10.'
        : 'The right-hand side is the expression to the right of the equal sign (＝), which is 10.',
    };
  },

  // 4. Επαλήθευση λύσης (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΛΕΓΧΟΣ ΛΥΣΗΣ' : 'SOLUTION VERIFICATION',
      question: locale === 'el'
        ? 'Ποιος αριθμός αποτελεί τη <strong>λύση (ρίζα)</strong> της εξίσωσης <strong>2 · x ＋ 1 ＝ 9</strong>;'
        : 'What number is the <strong>solution (root)</strong> of the equation <strong>2 · x ＋ 1 ＝ 9</strong>?',
      correctAnswer: '4',
      solution: locale === 'el'
        ? 'Αν δοκιμάσουμε το 4, έχουμε: 2 · 4 ＋ 1 ＝ 8 ＋ 1 ＝ 9. Άρα η λύση είναι το 4.'
        : 'Testing 4 gives: 2 · 4 ＋ 1 ＝ 8 ＋ 1 ＝ 9. Thus, the solution is 4.',
    };
  },

  // 5. Μετάφραση σε εξίσωση (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΜΕΤΑΦΡΑΣΗ ΣΕ ΕΞΙΣΩΣΗ' : 'TRANSLATING TO EQUATION',
      question: locale === 'el'
        ? 'Πώς γράφεται σε μορφή εξίσωσης η πρόταση: «Το τριπλάσιο ενός αριθμού μειωμένο κατά 5 ισούται με 16»;'
        : 'How is the sentence translated into an equation: "Triple a number decreased by 5 equals 16"?',
      options: makeUniqueOptions('3 · x － 5 ＝ 16', ['3 · x ＋ 5 ＝ 16', '3 · (x － 5) ＝ 16', 'x － 5 ＝ 16']),
      correctAnswer: '3 · x － 5 ＝ 16',
      solution: locale === 'el'
        ? 'Το τριπλάσιο είναι 3 · x, μειωμένο κατά 5 σημαίνει － 5 και ισούται με 16.'
        : 'Triple is 3 · x, decreased by 5 means － 5, and equals 16.',
    };
  },

  // 6. Έλεγχος ρίζας (MCQ)
  (locale) => {
    const elOpt1 = 'Ναι, διότι 4 · 3 － 2 ＝ 10';
    const enOpt1 = 'Yes, because 4 · 3 － 2 ＝ 10';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΛΕΓΧΟΣ ΡΙΖΑΣ' : 'ROOT CHECK',
      question: locale === 'el'
        ? 'Είναι ο αριθμός <strong>x ＝ 3</strong> λύση της εξίσωσης <strong>4 · x － 2 ＝ 10</strong>;'
        : 'Is <strong>x ＝ 3</strong> a solution to the equation <strong>4 · x － 2 ＝ 10</strong>?',
      options: locale === 'el'
        ? makeUniqueOptions(elOpt1, ['Όχι, διότι 4 · 3 － 2 ＝ 14', 'Όχι, η λύση είναι το 2', 'Ναι, διότι 4 ＋ 3 ＝ 7'])
        : makeUniqueOptions(enOpt1, ['No, because 4 · 3 － 2 ＝ 14', 'No, the solution is 2', 'Yes, because 4 ＋ 3 ＝ 7']),
      correctAnswer: locale === 'el' ? elOpt1 : enOpt1,
      solution: locale === 'el'
        ? 'Αντικαθιστούμε το x με το 3 στο πρώτο μέλος: 4 · 3 － 2 ＝ 12 － 2 ＝ 10. Αφού 1ο μέλος ＝ 2ο μέλος, το 3 είναι λύση.'
        : 'Substitute x with 3 in LHS: 4 · 3 － 2 ＝ 12 － 2 ＝ 10. Since LHS ＝ RHS, 3 is a solution.',
    };
  },

  // 7. Λύση εξίσωσης με δοκιμή (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΥΡΕΣΗ ΡΙΖΑΣ' : 'FINDING ROOT',
      question: locale === 'el'
        ? 'Βρες με το μυαλό σου τη λύση της εξίσωσης: <strong>5 · x ＝ 35</strong>'
        : 'Solve mentally: <strong>5 · x ＝ 35</strong>',
      correctAnswer: '7',
      solution: locale === 'el'
        ? 'Ποιος αριθμός αν πολλαπλασιαστεί με το 5 μας δίνει 35; Είναι το 7 (5 · 7 ＝ 35).'
        : 'What number multiplied by 5 gives 35? It is 7 (5 · 7 ＝ 35).',
    };
  },

  // 8. Αναγνώριση σταθερού όρου στο 1ο μέλος (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΟΡΟΙ ΕΞΙΣΩΣΗΣ' : 'EQUATION TERMS',
      question: locale === 'el'
        ? 'Στην εξίσωση <strong>8 · x ＋ 12 ＝ 28</strong>, ποιος είναι ο <strong>σταθερός όρος</strong> του πρώτου μέλους;'
        : 'In the equation <strong>8 · x ＋ 12 ＝ 28</strong>, what is the <strong>constant term</strong> of the left-hand side?',
      correctAnswer: '12',
      solution: locale === 'el'
        ? 'Στο 1ο μέλος (8x ＋ 12), ο όρος χωρίς μεταβλητή είναι το 12.'
        : 'On the LHS (8x ＋ 12), the term without a variable is 12.',
    };
  },

  // 9. Μετάφραση προβλήματος (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΜΕΤΑΦΡΑΣΗ ΣΕ ΕΞΙΣΩΣΗ' : 'TRANSLATING TO EQUATION',
      question: locale === 'el'
        ? 'Ποια εξίσωση ταιριάζει στο πρόβλημα: «Σκέφτηκα έναν αριθμό, του πρόσθεσα 4 και το αποτέλεσμα είναι 11»;'
        : 'Which equation matches the problem: "I thought of a number, added 4 to it, and the result is 11"?',
      options: makeUniqueOptions('x ＋ 4 ＝ 11', ['4 · x ＝ 11', 'x － 4 ＝ 11', 'x ＝ 11 ＋ 4']),
      correctAnswer: 'x ＋ 4 ＝ 11',
      solution: locale === 'el'
        ? 'Έστω x ο αριθμός που σκέφτηκα. Αν του προσθέσω 4 γίνεται x ＋ 4. Το αποτέλεσμα είναι 11, άρα x ＋ 4 ＝ 11.'
        : 'Let x be the number. Adding 4 gives x ＋ 4. The result is 11, hence x ＋ 4 ＝ 11.',
    };
  },

  // 10. Εύρεση ρίζας (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΥΡΕΣΗ ΡΙΖΑΣ' : 'FINDING ROOT',
      question: locale === 'el'
        ? 'Ποια είναι η λύση της εξίσωσης <strong>x － 6 ＝ 14</strong>;'
        : 'What is the solution to the equation <strong>x － 6 ＝ 14</strong>?',
      correctAnswer: '20',
      solution: locale === 'el'
        ? 'Ο αριθμός που αν του αφαιρέσουμε 6 μας δίνει 14 είναι το 20 (20 － 6 ＝ 14).'
        : 'The number from which subtracting 6 yields 14 is 20 (20 － 6 ＝ 14).',
    };
  },

  // 11. Τι είναι η λύση της εξίσωσης (MCQ)
  (locale) => {
    const elCorrect = 'Σημαίνει ότι αν βάλουμε 5 στη θέση του x, το 1ο μέλος γίνεται ίσο με το 2ο μέλος';
    const enCorrect = 'It means that substituting 5 for x makes the left side equal to the right side';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΟΡΙΣΜΟΣ' : 'DEFINITION',
      question: locale === 'el'
        ? 'Τι σημαίνει η φράση «το x ＝ 5 είναι ρίζα της εξίσωσης»;'
        : 'What does the statement "x ＝ 5 is a root of the equation" mean?',
      options: locale === 'el'
        ? makeUniqueOptions(elCorrect, [
            'Σημαίνει ότι η εξίσωση δεν έχει καμία άλλη τιμή εκτός από το 5',
            'Σημαίνει ότι το δεύτερο μέλος της εξίσωσης είναι το 5',
            'Σημαίνει ότι πρέπει να διαιρέσουμε την εξίσωση με το 5'
          ])
        : makeUniqueOptions(enCorrect, [
            'It means the equation has no other values besides 5',
            'It means the right-hand side of the equation is 5',
            'It means we must divide the equation by 5'
          ]),
      correctAnswer: locale === 'el' ? elCorrect : enCorrect,
      solution: locale === 'el'
        ? 'Ρίζα (ή λύση) είναι η τιμή του αγνώστου που επαληθεύει την ισότητα.'
        : 'A root (or solution) is the value of the unknown that satisfies the equality.',
    };
  },

  // 12. Εξίσωση με αρνητικό x (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΞΙΣΩΣΗ ΜΕ ΑΡΝΗΤΙΚΑ' : 'EQUATION WITH NEGATIVES',
      question: locale === 'el'
        ? 'Βρες τη λύση της εξίσωσης: <strong>－2 · x ＝ 10</strong>'
        : 'Find the solution to the equation: <strong>－2 · x ＝ 10</strong>',
      correctAnswer: '-5',
      solution: locale === 'el'
        ? 'Για να βγει θετικό αποτέλεσμα (10) από πολλαπλασιασμό με αρνητικό (－2), πρέπει το x να είναι αρνητικό. (－2) · (－5) ＝ 10, άρα x ＝ －5.'
        : 'To get a positive result (10) multiplying by a negative (－2), x must be negative. (－2) · (－5) ＝ 10, so x ＝ －5.',
    };
  },

  // 13. Εύρεση συντελεστή 1 (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΝΤΕΛΕΣΤΗΣ' : 'COEFFICIENT',
      question: locale === 'el'
        ? 'Στην εξίσωση <strong>x ＋ 7 ＝ 12</strong>, ποιος είναι ο συντελεστής του αγνώστου x;'
        : 'In the equation <strong>x ＋ 7 ＝ 12</strong>, what is the coefficient of the unknown x?',
      options: makeUniqueOptions('1', ['0', '7', '12']),
      correctAnswer: '1',
      solution: locale === 'el'
        ? 'Όταν το x είναι μόνο του, ο συντελεστής του εννοείται ότι είναι το 1 (διότι 1 · x ＝ x).'
        : 'When x stands alone, its coefficient is understood to be 1 (since 1 · x ＝ x).',
    };
  },

  // 14. Εξίσωση ισορροπίας (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΙΣΟΡΡΟΠΙΑ' : 'BALANCE',
      question: locale === 'el'
        ? 'Αν σε μια ζυγαριά έχουμε 3 όμοια κουτιά (3x) αριστερά, και 1 κουτί (x) μαζί με 10 κιλά δεξιά, πόσα κιλά ζυγίζει το κάθε κουτί; (Δηλαδή λύσε την 3x ＝ x ＋ 10)'
        : 'If a scale has 3 identical boxes (3x) on the left, and 1 box (x) plus 10 kg on the right, how much does each box weigh? (Solve 3x ＝ x ＋ 10)',
      correctAnswer: '5',
      solution: locale === 'el'
        ? 'Αφαιρώντας από 1 κουτί και στα δύο πιάτα, μας μένουν 2 κουτιά ＝ 10 κιλά. Άρα 1 κουτί ζυγίζει 5 κιλά.'
        : 'Subtracting 1 box from both pans leaves 2 boxes ＝ 10 kg. Thus, 1 box weighs 5 kg.',
    };
  },

  // 15. Δοκιμή λύσεων (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΛΕΓΧΟΣ ΛΥΣΗΣ' : 'SOLUTION CHECK',
      question: locale === 'el'
        ? 'Ποιος από τους παρακάτω αριθμούς είναι η λύση της εξίσωσης <strong>3 · x － 1 ＝ 20</strong>;'
        : 'Which of the following numbers is the solution to the equation <strong>3 · x － 1 ＝ 20</strong>?',
      options: makeUniqueOptions('7', ['6', '8', '21']),
      correctAnswer: '7',
      solution: locale === 'el'
        ? 'Αν δοκιμάσουμε το 7: 3 · 7 － 1 ＝ 21 － 1 ＝ 20. Επαληθεύεται!'
        : 'Testing 7: 3 · 7 － 1 ＝ 21 － 1 ＝ 20. Verified!',
    };
  },

  // 16. Μετάφραση μισού (MCQ)
  (locale) => {
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΜΕΤΑΦΡΑΣΗ ΣΕ ΕΞΙΣΩΣΗ' : 'TRANSLATING TO EQUATION',
      question: locale === 'el'
        ? 'Πώς μεταφράζεται στην Άλγεβρα η φράση: «Το μισό ενός αριθμού x ισούται με 8»;'
        : 'How is the phrase translated into algebra: "Half of a number x equals 8"?',
      options: makeUniqueOptions('x ： 2 ＝ 8', ['2 · x ＝ 8', 'x － 2 ＝ 8', '8 ： 2 ＝ x']),
      correctAnswer: 'x ： 2 ＝ 8',
      solution: locale === 'el'
        ? 'Το μισό ενός αριθμού βρίσκεται με διαίρεση διά του 2. Οπότε x ： 2 ＝ 8.'
        : 'Half of a number is found by dividing by 2. Thus x ： 2 ＝ 8.',
    };
  },

  // 17. Εξίσωση με 0 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΗΔΕΝΙΚΗ ΡΙΖΑ' : 'ZERO ROOT',
      question: locale === 'el'
        ? 'Ποια είναι η λύση της εξίσωσης <strong>x ＋ 5 ＝ 5</strong>;'
        : 'What is the solution to the equation <strong>x ＋ 5 ＝ 5</strong>?',
      correctAnswer: '0',
      solution: locale === 'el'
        ? 'Ο αριθμός που αν του προσθέσουμε 5 δεν αλλάζει είναι το 0 (0 ＋ 5 ＝ 5).'
        : 'The number that when 5 is added to it remains unchanged is 0 (0 ＋ 5 ＝ 5).',
    };
  },

  // 18. Αρνητική ρίζα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΗ ΡΙΖΑ' : 'NEGATIVE ROOT',
      question: locale === 'el'
        ? 'Βρες τη λύση της εξίσωσης: <strong>x ＋ 3 ＝ 1</strong>'
        : 'Find the solution to the equation: <strong>x ＋ 3 ＝ 1</strong>',
      correctAnswer: '-2',
      solution: locale === 'el'
        ? 'Σκεφτόμαστε: ποιος αριθμός αν αυξηθεί κατά 3 δίνει 1; Είναι το －2 (αφού －2 ＋ 3 ＝ 1).'
        : 'Thinking: what number increased by 3 gives 1? It is －2 (since －2 ＋ 3 ＝ 1).',
    };
  },

  // 19. Δύο πράξεις (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΥΡΕΣΗ ΡΙΖΑΣ' : 'FINDING ROOT',
      question: locale === 'el'
        ? 'Ποια είναι η λύση της εξίσωσης <strong>(x ： 2) ＋ 1 ＝ 6</strong>;'
        : 'What is the solution to the equation <strong>(x ： 2) ＋ 1 ＝ 6</strong>?',
      correctAnswer: '10',
      solution: locale === 'el'
        ? 'Αφαιρώντας το 1, έχουμε ότι το μισό του x είναι 5 (x ： 2 ＝ 5). Άρα x ＝ 10.'
        : 'Subtracting 1, half of x is 5 (x ： 2 ＝ 5). Thus x ＝ 10.',
    };
  },

  // 20. Απόλυτη τιμή σε εξίσωση (MCQ)
  (locale) => {
    const elCorrect = 'Καμία, είναι αδύνατη';
    const enCorrect = 'None, it is impossible';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ ΕΞΙΣΩΣΕΩΝ' : 'EQUATION PROPERTIES',
      question: locale === 'el'
        ? 'Πόσες λύσεις έχει η εξίσωση <strong>0 · x ＝ 5</strong>;'
        : 'How many solutions does the equation <strong>0 · x ＝ 5</strong> have?',
      options: locale === 'el'
        ? makeUniqueOptions(elCorrect, [
            'Μία, το 5',
            'Άπειρες, είναι ταυτότητα',
            'Μία, το 0'
          ])
        : makeUniqueOptions(enCorrect, [
            'One, 5',
            'Infinitely many, it is an identity',
            'One, 0'
          ]),
      correctAnswer: locale === 'el' ? elCorrect : enCorrect,
      solution: locale === 'el'
        ? 'Το γινόμενο οποιουδήποτε αριθμού με το 0 κάνει 0. Δεν υπάρχει αριθμός x που να δίνει 0 · x ＝ 5. Άρα είναι αδύνατη.'
        : 'The product of any number with 0 is 0. There is no x giving 0 · x ＝ 5. Thus it is impossible.',
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ ΕΞΙΣΩΣΕΩΝ (el / en)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // 1. Ταξί
  (locale) => {
    const rate = locale === 'el' ? '1,50' : '1.50';
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ' : 'PROBLEMS: TRANSPORTATION',
      question: locale === 'el'
        ? `Ένα ταξί χρεώνει 2 € με το ξεκίνημα (σημαία) και ${rate} € για κάθε χιλιόμετρο. Ένας επιβάτης πλήρωσε συνολικά 14 €. Πόσα χιλιόμετρα διένυσε;`
        : `A taxi charges a base fee of 2 € plus ${rate} € for each kilometer. A passenger paid a total of 14 €. How many kilometers did they travel?`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `Έστω x τα χιλιόμετρα. Η εξίσωση είναι 1,5 · x ＋ 2 ＝ 14. Αφαιρώντας τα 2€ (σημαία), τα χιλιόμετρα κόστισαν 12€. Άρα 1,5 · x ＝ 12 ➔ x ＝ 12 ： 1,5 ＝ 8 km.`
        : `Let x be the distance. The equation is 1.5 · x ＋ 2 ＝ 14. Subtracting the 2 € base fee leaves 12 €. Thus 1.5 · x ＝ 12 ➔ x ＝ 12 ： 1.5 ＝ 8 km.`,
    };
  },

  // 2. Ηλικίες
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΗΛΙΚΙΕΣ' : 'PROBLEMS: AGES',
      question: locale === 'el'
        ? 'Ο Γιάννης είναι 4 χρόνια μεγαλύτερος από τη Μαρία. Αν το άθροισμα των ηλικιών τους είναι 26, πόσων ετών είναι η Μαρία;'
        : 'John is 4 years older than Mary. If the sum of their ages is 26, how old is Mary?',
      correctAnswer: '11',
      solution: locale === 'el'
        ? 'Έστω x η ηλικία της Μαρίας. Ο Γιάννης είναι x ＋ 4. Εξίσωση: x ＋ (x ＋ 4) ＝ 26 ➔ 2x ＋ 4 ＝ 26 ➔ 2x ＝ 22 ➔ x ＝ 11.'
        : 'Let x be Mary\'s age. John is x ＋ 4. Equation: x ＋ (x ＋ 4) ＝ 26 ➔ 2x ＋ 4 ＝ 26 ➔ 2x ＝ 22 ➔ x ＝ 11.',
    };
  },

  // 3. Περίμετρος τετραγώνου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? 'Η περίμετρος ενός τετραγώνου είναι 36 μέτρα. Πόσα μέτρα είναι το μήκος της πλευράς του;'
        : 'The perimeter of a square is 36 meters. What is the length of its side in meters?',
      correctAnswer: '9',
      solution: locale === 'el'
        ? 'Έστω x η πλευρά του τετραγώνου. Επειδή έχει 4 ίσες πλευρές: 4 · x ＝ 36 ➔ x ＝ 36 ： 4 ＝ 9 m.'
        : 'Let x be the side length. Since it has 4 equal sides: 4 · x ＝ 36 ➔ x ＝ 36 ： 4 ＝ 9 m.',
    };
  },

  // 4. Αποταμίευση
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΤΑΜΙΕΥΣΗ' : 'PROBLEMS: SAVINGS',
      question: locale === 'el'
        ? 'Ο Κώστας είχε 40 € και αποφάσισε να αποταμιεύει 5 € κάθε εβδομάδα. Σε πόσες εβδομάδες θα έχει συνολικά 100 €;'
        : 'Kostas had 40 € and decided to save 5 € each week. In how many weeks will he have a total of 100 €?',
      correctAnswer: '12',
      solution: locale === 'el'
        ? 'Έστω x οι εβδομάδες. Εξίσωση: 5 · x ＋ 40 ＝ 100 ➔ 5 · x ＝ 60 ➔ x ＝ 60 ： 5 ＝ 12 εβδομάδες.'
        : 'Let x be the weeks. Equation: 5 · x ＋ 40 ＝ 100 ➔ 5 · x ＝ 60 ➔ x ＝ 60 ： 5 ＝ 12 weeks.',
    };
  },

  // 5. Αγορές
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'PROBLEMS: PURCHASES',
      question: locale === 'el'
        ? 'Η Ελένη αγόρασε 3 ίδια βιβλία και ένα τετράδιο που έκανε 2 €. Πλήρωσε συνολικά 26 €. Πόσα ευρώ κόστισε το κάθε βιβλίο;'
        : 'Helen bought 3 identical books and a notebook costing 2 €. She paid a total of 26 €. How much did each book cost in euros?',
      correctAnswer: '8',
      solution: locale === 'el'
        ? 'Έστω x η τιμή του βιβλίου. Εξίσωση: 3 · x ＋ 2 ＝ 26 ➔ 3 · x ＝ 24 ➔ x ＝ 24 ： 3 ＝ 8 €.'
        : 'Let x be the book price. Equation: 3 · x ＋ 2 ＝ 26 ➔ 3 · x ＝ 24 ➔ x ＝ 24 ： 3 ＝ 8 €.',
    };
  },

  // 6. Συσκευασία
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΣΚΕΥΑΣΙΑ' : 'PROBLEMS: PACKAGING',
      question: locale === 'el'
        ? 'Ένα άδειο καλάθι ζυγίζει 1 κιλό. Όταν τοποθετήσουμε μέσα 6 ίδια πεπόνια, το συνολικό βάρος γίνεται 13 κιλά. Πόσα κιλά ζυγίζει το κάθε πεπόνι;'
        : 'An empty basket weighs 1 kg. When 6 identical melons are placed inside, the total weight becomes 13 kg. How much does each melon weigh in kg?',
      correctAnswer: '2',
      solution: locale === 'el'
        ? 'Έστω x το βάρος του πεπονιού. Εξίσωση: 6 · x ＋ 1 ＝ 13 ➔ 6 · x ＝ 12 ➔ x ＝ 12 ： 6 ＝ 2 kg.'
        : 'Let x be the melon weight. Equation: 6 · x ＋ 1 ＝ 13 ➔ 6 · x ＝ 12 ➔ x ＝ 12 ： 6 ＝ 2 kg.',
    };
  },

  // 7. Εισιτήρια
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΙΣΙΤΗΡΙΑ' : 'PROBLEMS: TICKETS',
      question: locale === 'el'
        ? 'Σε έναν κινηματογράφο το εισιτήριο έχει 7 €. Μια ομάδα φίλων πλήρωσε 35 € μόνο για εισιτήρια. Πόσα άτομα ήταν στην ομάδα;'
        : 'At a cinema, a ticket costs 7 €. A group of friends spent 35 € solely on tickets. How many people were in the group?',
      correctAnswer: '5',
      solution: locale === 'el'
        ? 'Έστω x ο αριθμός των ατόμων. Εξίσωση: 7 · x ＝ 35 ➔ x ＝ 35 ： 7 ＝ 5 άτομα.'
        : 'Let x be the number of people. Equation: 7 · x ＝ 35 ➔ x ＝ 35 ： 7 ＝ 5 people.',
    };
  },

  // 8. Υδραυλικός
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ' : 'PROBLEMS: LABOR',
      question: locale === 'el'
        ? 'Ένας τεχνικός χρεώνει 20 € για την επίσκεψη στο σπίτι και 15 € για κάθε ώρα εργασίας. Πληρώθηκε 80 € συνολικά. Πόσες ώρες εργάστηκε;'
        : 'A technician charges a 20 € house call fee plus 15 € for each hour of work. He was paid 80 € in total. How many hours did he work?',
      correctAnswer: '4',
      solution: locale === 'el'
        ? 'Έστω x οι ώρες. Εξίσωση: 15 · x ＋ 20 ＝ 80 ➔ 15 · x ＝ 60 ➔ x ＝ 60 ： 15 ＝ 4 ώρες.'
        : 'Let x be the hours. Equation: 15 · x ＋ 20 ＝ 80 ➔ 15 · x ＝ 60 ➔ x ＝ 60 ： 15 ＝ 4 hours.',
    };
  },

  // 9. Περίμετρος ορθογωνίου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? 'Η περίμετρος ενός ορθογωνίου είναι 30 m. Το πλάτος του είναι 5 m. Πόσα μέτρα είναι το μήκος του;'
        : 'The perimeter of a rectangle is 30 m. Its width is 5 m. What is its length in meters?',
      correctAnswer: '10',
      solution: locale === 'el'
        ? 'Έστω x το μήκος. Η περίμετρος είναι Π ＝ 2x ＋ 2·5 ＝ 2x ＋ 10. Εξίσωση: 2x ＋ 10 ＝ 30 ➔ 2x ＝ 20 ➔ x ＝ 10 m.'
        : 'Let x be the length. Perimeter is P ＝ 2x ＋ 2·5 ＝ 2x ＋ 10. Equation: 2x ＋ 10 ＝ 30 ➔ 2x ＝ 20 ➔ x ＝ 10 m.',
    };
  },

  // 10. Συνδρομή γυμναστηρίου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΔΡΟΜΗ' : 'PROBLEMS: MEMBERSHIP',
      question: locale === 'el'
        ? 'Η εγγραφή σε ένα γυμναστήριο είναι 15 € και κάθε μήνας προπόνησης κοστίζει 25 €. Ο Νίκος πλήρωσε συνολικά 140 €. Πόσους μήνες προπονήθηκε;'
        : 'A gym membership has a 15 € sign-up fee and costs 25 € per month. Nikos paid a total of 140 €. For how many months did he work out?',
      correctAnswer: '5',
      solution: locale === 'el'
        ? 'Έστω x οι μήνες. Εξίσωση: 25 · x ＋ 15 ＝ 140 ➔ 25 · x ＝ 125 ➔ x ＝ 125 ： 25 ＝ 5 μήνες.'
        : 'Let x be the months. Equation: 25 · x ＋ 15 ＝ 140 ➔ 25 · x ＝ 125 ➔ x ＝ 125 ： 25 ＝ 5 months.',
    };
  },

  // 11. Κατανάλωση νερού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΥΔΡΑΥΛΙΚΑ' : 'PROBLEMS: PLUMBING',
      question: locale === 'el'
        ? 'Μια δεξαμενή έχει 100 λίτρα νερό και αδειάζει κατά 4 λίτρα κάθε λεπτό. Σε πόσα λεπτά η δεξαμενή θα περιέχει ακριβώς 40 λίτρα;'
        : 'A tank holds 100 liters of water and drains at a rate of 4 liters per minute. In how many minutes will the tank contain exactly 40 liters?',
      correctAnswer: '15',
      solution: locale === 'el'
        ? 'Έστω x τα λεπτά. Εξίσωση: 100 － 4 · x ＝ 40 ➔ 4 · x ＝ 60 ➔ x ＝ 60 ： 4 ＝ 15 λεπτά.'
        : 'Let x be the minutes. Equation: 100 － 4 · x ＝ 40 ➔ 4 · x ＝ 60 ➔ x ＝ 60 ： 4 ＝ 15 minutes.',
    };
  },

  // 12. Ενοικίαση αυτοκινήτου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΑΞΙΔΙΑ' : 'PROBLEMS: TRAVEL',
      question: locale === 'el'
        ? 'Η ενοικίαση ενός αυτοκινήτου κοστίζει 30 € την ημέρα. Ένας πελάτης πλήρωσε 210 € στο τέλος. Πόσες μέρες κράτησε το αυτοκίνητο;'
        : 'Car rental costs 30 € per day. A customer paid 210 € at the end. For how many days did they rent the car?',
      correctAnswer: '7',
      solution: locale === 'el'
        ? 'Έστω x οι μέρες. Εξίσωση: 30 · x ＝ 210 ➔ x ＝ 210 ： 30 ＝ 7 ημέρες.'
        : 'Let x be the days. Equation: 30 · x ＝ 210 ➔ x ＝ 210 ： 30 ＝ 7 days.',
    };
  },

  // 13. Μοίρασμα ποσού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΜΕΡΙΣΜΟΣ' : 'PROBLEMS: DISTRIBUTION',
      question: locale === 'el'
        ? 'Ο παππούς μοίρασε 120 € στα 4 εγγόνια του. Αν έδωσε 15 € στη μεγάλη του εγγονή και τα υπόλοιπα τα μοίρασε εξίσου στα άλλα 3 εγγόνια, πόσα ευρώ πήρε το καθένα από τα 3;'
        : 'Grandfather distributed 120 € among his 4 grandchildren. If he gave 15 € to his oldest granddaughter and split the remainder equally among the other 3 grandchildren, how much did each of the 3 receive?',
      correctAnswer: '35',
      solution: locale === 'el'
        ? 'Έστω x το ποσό για καθένα από τα 3. Εξίσωση: 3 · x ＋ 15 ＝ 120 ➔ 3 · x ＝ 105 ➔ x ＝ 105 ： 3 ＝ 35 €.'
        : 'Let x be the amount for each of the 3. Equation: 3 · x ＋ 15 ＝ 120 ➔ 3 · x ＝ 105 ➔ x ＝ 105 ： 3 ＝ 35 €.',
    };
  },

  // 14. Σκοποβολή
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ' : 'PROBLEMS: SPORTS',
      question: locale === 'el'
        ? 'Σε ένα παιχνίδι σκοποβολής ξεκινάς με 50 πόντους. Για κάθε στόχο που πετυχαίνεις παίρνεις 8 πόντους. Η Μαρία τελείωσε με 90 πόντους. Πόσους στόχους πέτυχε;'
        : 'In a shooting game, you start with 50 points. For each target hit, you gain 8 points. Mary finished with 90 points. How many targets did she hit?',
      correctAnswer: '5',
      solution: locale === 'el'
        ? 'Έστω x οι στόχοι. Εξίσωση: 8 · x ＋ 50 ＝ 90 ➔ 8 · x ＝ 40 ➔ x ＝ 40 ： 8 ＝ 5 στόχοι.'
        : 'Let x be the targets. Equation: 8 · x ＋ 50 ＝ 90 ➔ 8 · x ＝ 40 ➔ x ＝ 40 ： 8 ＝ 5 targets.',
    };
  },

  // 15. Ζυγίζοντας φρούτα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΡΟΣ' : 'PROBLEMS: WEIGHT',
      question: locale === 'el'
        ? 'Σε μια ζυγαριά, στον αριστερό δίσκο υπάρχουν 2 ίδια καρπούζια. Στον δεξιό δίσκο υπάρχει 1 βαρίδι των 12 κιλών. Αν η ζυγαριά ισορροπεί, πόσα κιλά ζυγίζει το κάθε καρπούζι;'
        : 'On a balance scale, the left pan holds 2 identical watermelons. The right pan holds a 12 kg weight. If the scale balances, how much does each watermelon weigh in kg?',
      correctAnswer: '6',
      solution: locale === 'el'
        ? 'Έστω x το βάρος του καρπουζιού. Εξίσωση: 2 · x ＝ 12 ➔ x ＝ 12 ： 2 ＝ 6 kg.'
        : 'Let x be the weight of the watermelon. Equation: 2 · x ＝ 12 ➔ x ＝ 12 ： 2 ＝ 6 kg.',
    };
  },

  // 16. Προβολές βίντεο
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: INTERNET' : 'PROBLEMS: SOCIAL MEDIA',
      question: locale === 'el'
        ? 'Ένα βίντεο είχε 200 προβολές την πρώτη μέρα. Στη συνέχεια προσθέτονταν σταθερά 50 προβολές κάθε ώρα. Σε πόσες ώρες (μετά την 1η μέρα) έφτασε τις 600 προβολές;'
        : 'A video had 200 views on day one. Afterwards, a steady 50 views were added every hour. In how many hours (after day 1) did it reach 600 views?',
      correctAnswer: '8',
      solution: locale === 'el'
        ? 'Έστω x οι ώρες. Εξίσωση: 50 · x ＋ 200 ＝ 600 ➔ 50 · x ＝ 400 ➔ x ＝ 400 ： 50 ＝ 8 ώρες.'
        : 'Let x be the hours. Equation: 50 · x ＋ 200 ＝ 600 ➔ 50 · x ＝ 400 ➔ x ＝ 400 ： 50 ＝ 8 hours.',
    };
  },

  // 17. Ηλεκτρική ενέργεια
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΕΡΓΕΙΑ' : 'PROBLEMS: ENERGY',
      question: locale === 'el'
        ? 'Η μπαταρία ενός κινητού βρίσκεται στο 10% και φορτίζει κατά 3% κάθε λεπτό. Σε πόσα λεπτά η μπαταρία θα φτάσει στο 100%;'
        : 'A phone battery is at 10% and charges at a rate of 3% per minute. In how many minutes will the battery reach 100%?',
      correctAnswer: '30',
      solution: locale === 'el'
        ? 'Έστω x τα λεπτά. Εξίσωση: 3 · x ＋ 10 ＝ 100 ➔ 3 · x ＝ 90 ➔ x ＝ 90 ： 3 ＝ 30 λεπτά.'
        : 'Let x be the minutes. Equation: 3 · x ＋ 10 ＝ 100 ➔ 3 · x ＝ 90 ➔ x ＝ 90 ： 3 ＝ 30 minutes.',
    };
  },

  // 18. Πρόβλημα με ζώα φάρμας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΡΓΙΑ' : 'PROBLEMS: AGRICULTURE',
      question: locale === 'el'
        ? 'Σε μια φάρμα υπάρχουν αγελάδες (με 4 πόδια) και 10 κότες (με 2 πόδια η καθεμία). Αν μετρήσαμε συνολικά 68 πόδια, πόσες είναι οι αγελάδες;'
        : 'On a farm there are cows (with 4 legs) and 10 chickens (with 2 legs each). If a total of 68 legs were counted, how many cows are there?',
      correctAnswer: '12',
      solution: locale === 'el'
        ? 'Οι κότες έχουν 10 · 2 ＝ 20 πόδια. Έστω x οι αγελάδες. Εξίσωση: 4 · x ＋ 20 ＝ 68 ➔ 4 · x ＝ 48 ➔ x ＝ 48 ： 4 ＝ 12 αγελάδες.'
        : 'The chickens have 10 · 2 ＝ 20 legs. Let x be the cows. Equation: 4 · x ＋ 20 ＝ 68 ➔ 4 · x ＝ 48 ➔ x ＝ 48 ： 4 ＝ 12 cows.',
    };
  },

  // 19. Δέντρα σε δενδροστοιχία
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΗΠΟΥΡΙΚΗ' : 'PROBLEMS: GARDENING',
      question: locale === 'el'
        ? 'Σε μια σειρά φυτεύτηκαν δενδρύλλια ανά 4 μέτρα. Η συνολική απόσταση από το πρώτο ως το τελευταίο δέντρο είναι 32 μέτρα. Πόσα διαστήματα των 4 μέτρων υπάρχουν;'
        : 'Saplings were planted in a row 4 meters apart. The total distance from the first to the last tree is 32 meters. How many 4-meter intervals are there?',
      correctAnswer: '8',
      solution: locale === 'el'
        ? 'Έστω x ο αριθμός των διαστημάτων. Εξίσωση: 4 · x ＝ 32 ➔ x ＝ 32 ： 4 ＝ 8 διαστήματα (τα δέντρα είναι 9).'
        : 'Let x be the number of intervals. Equation: 4 · x ＝ 32 ➔ x ＝ 32 ： 4 ＝ 8 intervals (there are 9 trees).',
    };
  },

  // 20. Αγορά λουλουδιών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'PROBLEMS: PURCHASES',
      question: locale === 'el'
        ? 'Ο Πέτρος αγόρασε 5 όμοια τριαντάφυλλα. Έδωσε ένα χαρτονόμισμα των 20 € και πήρε ρέστα 5 €. Πόσα ευρώ έκανε το κάθε τριαντάφυλλο;'
        : 'Peter bought 5 identical roses. He paid with a 20 € banknote and received 5 € in change. How much did each rose cost in euros?',
      correctAnswer: '3',
      solution: locale === 'el'
        ? 'Το συνολικό κόστος είναι 20 － 5 ＝ 15 €. Έστω x η τιμή του τριαντάφυλλου. Εξίσωση: 5 · x ＝ 15 ➔ x ＝ 15 ： 5 ＝ 3 €.'
        : 'The total cost is 20 － 5 ＝ 15 €. Let x be the price of a rose. Equation: 5 · x ＝ 15 ➔ x ＝ 15 ： 5 ＝ 3 €.',
    };
  },
];

export default function AlgebrikesSxeseisAsk() {
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
    // Επιτρέπουμε νούμερα, κόμμα, κάθετο για κλάσματα, μείον και μεταβλητή x
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
          href="/a-gymnasiou/31-algebrikes-sxeseis"
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
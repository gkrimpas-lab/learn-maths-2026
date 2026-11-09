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
    pageTitle: "Ασκήσεις: Αριθμητικές & Αλγεβρικές Παραστάσεις | Α' Γυμνασίου",
    pageDesc: "12 δυναμικές ασκήσεις και προβλήματα στη διάκριση και χρήση αριθμητικών και αλγεβρικών παραστάσεων για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 25 • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Αριθμητικές & Αλγεβρικές Παραστάσεις",
    mainSubtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 ασκήσεις αναγνώρισης, υπολογισμού τιμής και μοντελοποίησης ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    wordProblemTag: "ΠΡΟΒΛΗΜΑ",
    inputPlaceholder: "π.χ. 14 ή 23",
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
    pageTitle: "Exercises: Numerical & Algebraic Expressions | 7th Grade Math",
    pageDesc: "12 dynamic exercises and problems on distinguishing and using numerical and algebraic expressions for Grade 7.",
    backText: "7th Grade",
    theoryBtn: "THEORY",
    chapterBadge: "GRADE 7 • CHAPTER 25 • PRACTICE",
    mainTitle: "Numerical & Algebraic Expressions",
    mainSubtitle: "Solve the following 12 selected exercises (10 exercises on identification, evaluation, and modeling ＋ 2 realistic problems). Click \"CHECK ANSWERS\" to see your score and step-by-step solutions.",
    wordProblemTag: "WORD PROBLEM",
    inputPlaceholder: "e.g. 14 or 23",
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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΑΡΙΘΜΗΤΙΚΩΝ & ΑΛΓΕΒΡΙΚΩΝ ΠΑΡΑΣΤΑΣΕΩΝ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Διάκριση Αριθμητικής Παράστασης (MCQ)
  (locale) => {
    const correct = '3 · 4 ＋ 5 · 2';
    const wrongs = locale === 'el'
      ? ['3 · x ＋ 5', '2 · α － 4', 'x² ＋ 1']
      : ['3 · x ＋ 5', '2 · a － 4', 'x² ＋ 1'];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΔΙΑΚΡΙΣΗ ΠΑΡΑΣΤΑΣΕΩΝ' : 'EXPRESSION TYPE',
      question: locale === 'el'
        ? `Ποια από τις παρακάτω παραστάσεις είναι <strong>αριθμητική</strong>;`
        : `Which of the following expressions is strictly <strong>numerical</strong>?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Αριθμητική παράσταση είναι εκείνη που περιέχει μόνο αριθμούς και πράξεις μεταξύ τους, χωρίς καθόλου μεταβλητές (γράμματα).`
        : `A numerical expression contains only fixed numbers and arithmetic operations, without any variables.`,
    };
  },

  // 2. Διάκριση Αλγεβρικής Παράστασης (MCQ)
  (locale) => {
    const correct = '4 · x － 7';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΔΙΑΚΡΙΣΗ ΠΑΡΑΣΤΑΣΕΩΝ' : 'EXPRESSION TYPE',
      question: locale === 'el'
        ? `Ποια από τις παρακάτω εκφράσεις είναι <strong>αλγεβρική παράσταση</strong>;`
        : `Which of the following expressions is an <strong>algebraic expression</strong>?`,
      options: makeUniqueOptions(
        correct,
        ['12 ＋ 8 : 2', '5 · (6 － 2)', '10² － 25']
      ),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Αλγεβρική παράσταση ονομάζεται κάθε έκφραση που περιέχει τουλάχιστον μία μεταβλητή (εδώ το x).`
        : `An algebraic expression contains at least one variable (in this case x).`,
    };
  },

  // 3. Υπολογισμός τιμής αριθμητικής παράστασης (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΙΘΜΗΤΙΚΗ ΠΑΡΑΣΤΑΣΗ' : 'NUMERICAL EXPRESSION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της αριθμητικής παράστασης: <strong>4 · 5 － 18 : 3</strong>`
        : `Calculate the value of the numerical expression: <strong>4 · 5 － 18 : 3</strong>`,
      correctAnswer: '14',
      solution: locale === 'el'
        ? `Προηγούνται πολλαπλασιασμός και διαίρεση: 4 · 5 ＝ 20 και 18 : 3 ＝ 6. Στη συνέχεια: 20 － 6 ＝ 14.`
        : `Multiplication and division precede: 4 · 5 ＝ 20 and 18 : 3 ＝ 6. Then: 20 － 6 ＝ 14.`,
    };
  },

  // 4. Υπολογισμός αλγεβρικής παράστασης για x = 3 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΛΓΕΒΡΙΚΗ ΠΑΡΑΣΤΑΣΗ' : 'ALGEBRAIC EXPRESSION',
      question: locale === 'el'
        ? `Υπολόγισε την αριθμητική τιμή της παράστασης <strong>2 · x<sup>2</sup> ＋ 5</strong> για <strong>x ＝ 3</strong>:`
        : `Calculate the numerical value of expression <strong>2 · x<sup>2</sup> ＋ 5</strong> for <strong>x ＝ 3</strong>:`,
      correctAnswer: '23',
      solution: locale === 'el'
        ? `Για x ＝ 3 έχουμε: 2 · 3<sup>2</sup> ＋ 5 ＝ 2 · 9 ＋ 5 ＝ 18 ＋ 5 ＝ 23.`
        : `For x ＝ 3: 2 · 3<sup>2</sup> ＋ 5 ＝ 2 · 9 ＋ 5 ＝ 18 ＋ 5 ＝ 23.`,
    };
  },

  // 5. Μετάφραση προβλήματος σε αλγεβρική παράσταση (MCQ)
  (locale) => {
    const correct = '3 · x ＋ 5';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΜΟΝΤΕΛΟΠΟΙΗΣΗ' : 'MODELING',
      question: locale === 'el'
        ? `Ένα κατάστημα χρεώνει 5 € πάγια συσκευασία συν 3 € για κάθε μπλούζα x. Ποια είναι η αλγεβρική παράσταση του συνολικού κόστους;`
        : `A store charges a €5 flat packaging fee plus €3 for each shirt x. Which algebraic expression models the total cost?`,
      options: makeUniqueOptions(correct, ['5 · x ＋ 3', '3 · (x ＋ 5)', '8 · x']),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Για x μπλούζες το κόστος είναι 3 · x συν το πάγιο 5 €, δηλαδή 3 · x ＋ 5.`
        : `For x shirts the cost is 3 · x plus the flat fee of €5, giving 3 · x ＋ 5.`,
    };
  },

  // 6. Υπολογισμός τιμής με αρνητικό x (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΛΓΕΒΡΙΚΗ ΜΕ ΑΡΝΗΤΙΚΟ' : 'NEGATIVE VARIABLE EVALUATION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της αλγεβρικής παράστασης <strong>4 · x ＋ 15</strong> για <strong>x ＝ －2</strong>:`
        : `Calculate the value of expression <strong>4 · x ＋ 15</strong> for <strong>x ＝ －2</strong>:`,
      correctAnswer: '7',
      solution: locale === 'el'
        ? `4 · (－2) ＋ 15 ＝ －8 ＋ 15 ＝ 7.`
        : `4 · (－2) ＋ 15 ＝ －8 ＋ 15 ＝ 7.`,
    };
  },

  // 7. Αριθμητική παράσταση με παρενθέσεις (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΙΘΜΗΤΙΚΗ ΠΑΡΑΣΤΑΣΗ' : 'NUMERICAL EXPRESSION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης: <strong>3 · (8 ＋ 2) － 10</strong>`
        : `Calculate the value of: <strong>3 · (8 ＋ 2) － 10</strong>`,
      correctAnswer: '20',
      solution: locale === 'el'
        ? `Μέσα στην παρένθεση: 8 ＋ 2 ＝ 10. Έπειτα: 3 · 10 － 10 ＝ 30 － 10 ＝ 20.`
        : `Inside parentheses: 8 ＋ 2 ＝ 10. Then: 3 · 10 － 10 ＝ 30 － 10 ＝ 20.`,
    };
  },

  // 8. Υπολογισμός αλγεβρικής παράστασης δύο μεταβλητών (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΥΟ ΜΕΤΑΒΛΗΤΕΣ' : 'TWO VARIABLES',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης <strong>3 · α ＋ 2 · β</strong> όταν <strong>α ＝ 4</strong> και <strong>β ＝ 5</strong>:`
        : `Calculate the value of expression <strong>3 · a ＋ 2 · b</strong> when <strong>a ＝ 4</strong> and <strong>b ＝ 5</strong>:`,
      correctAnswer: '22',
      solution: locale === 'el'
        ? `3 · 4 ＋ 2 · 5 ＝ 12 ＋ 10 ＝ 22.`
        : `3 · 4 ＋ 2 · 5 ＝ 12 ＋ 10 ＝ 22.`,
    };
  },

  // 9. Μετατροπή λεκτικής έκφρασης σε αλγεβρική (MCQ)
  (locale) => {
    const correct = '(x : 3) － 4';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΛΓΕΒΡΑ' : 'ALGEBRAIC TRANSLATION',
      question: locale === 'el'
        ? `Πώς εκφράζεται συμβολικά: «Το ένα τρίτο ενός ποσού x ελαττωμένο κατά 4»;`
        : `How is \"One third of an amount x decreased by 4\" written symbolically?`,
      options: makeUniqueOptions(correct, ['3 · x － 4', '(x － 4) : 3', 'x : (3 － 4)']),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Το ένα τρίτο του x είναι x : 3 και ελαττωμένο κατά 4 σημαίνει － 4.`
        : `One third of x is x : 3, and decreased by 4 gives － 4.`,
    };
  },

  // 10. Πότε μηδενίζεται η παράσταση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΗΔΕΝΙΣΜΟΣ ΠΑΡΑΣΤΑΣΗΣ' : 'ZERO OF EXPRESSION',
      question: locale === 'el'
        ? `Για ποια τιμή του <strong>x</strong> η αλγεβρική παράσταση <strong>5 · x － 20</strong> ισούται με <strong>0</strong>;`
        : `For what value of <strong>x</strong> does the expression <strong>5 · x － 20</strong> equal <strong>0</strong>?`,
      correctAnswer: '4',
      solution: locale === 'el'
        ? `5 · x － 20 ＝ 0 ➔ 5 · x ＝ 20 ➔ x ＝ 20 : 5 ＝ 4.`
        : `5 · x － 20 ＝ 0 ➔ 5 · x ＝ 20 ➔ x ＝ 20 : 5 ＝ 4.`,
    };
  },

  // 11. Υπολογισμός για x = 0 (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΤΙΜΗ ΓΙΑ x = 0' : 'VALUE FOR x = 0',
      question: locale === 'el'
        ? `Ποια είναι η τιμή της παράστασης <strong>7 · x<sup>2</sup> － 3 · x ＋ 9</strong> όταν <strong>x ＝ 0</strong>;`
        : `What is the value of expression <strong>7 · x<sup>2</sup> － 3 · x ＋ 9</strong> when <strong>x ＝ 0</strong>?`,
      correctAnswer: '9',
      solution: locale === 'el'
        ? `7 · 0<sup>2</sup> － 3 · 0 ＋ 9 ＝ 0 － 0 ＋ 9 ＝ 9.`
        : `7 · 0<sup>2</sup> － 3 · 0 ＋ 9 ＝ 0 － 0 ＋ 9 ＝ 9.`,
    };
  },

  // 12. Αριθμητική παράσταση με δύναμη (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΙΘΜΗΤΙΚΗ ΜΕ ΔΥΝΑΜΕΙΣ' : 'NUMERICAL WITH POWERS',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή: <strong>2<sup>3</sup> · 5 － 4<sup>2</sup></strong>`
        : `Calculate the value: <strong>2<sup>3</sup> · 5 － 4<sup>2</sup></strong>`,
      correctAnswer: '24',
      solution: locale === 'el'
        ? `2<sup>3</sup> ＝ 8 και 4<sup>2</sup> ＝ 16. Άρα: 8 · 5 － 16 ＝ 40 － 16 ＝ 24.`
        : `2<sup>3</sup> ＝ 8 and 4<sup>2</sup> ＝ 16. So: 8 · 5 － 16 ＝ 40 － 16 ＝ 24.`,
    };
  },

  // 13. Επιλογή τύπου παράστασης σε πραγματικό σενάριο (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Αλγεβρική παράσταση με μεταβλητή το πλήθος των ατόμων'
      : 'An algebraic expression with a variable representing the number of people';
    const wrongs = locale === 'el'
      ? [
          'Αριθμητική παράσταση με τυχαίους αριθμούς',
          'Μόνο γεωμετρικό σχήμα χωρίς μαθηματικά σύμβολα',
          'Έναν απλό ακέραιο αριθμό',
        ]
      : [
          'A numerical expression using random numbers',
          'A geometric sketch without symbols',
          'A single fixed integer',
        ];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΜΟΝΤΕΛΟΠΟΙΗΣΗ' : 'MODELING',
      question: locale === 'el'
        ? `Αν θέλουμε να εκφράσουμε το κόστος αγοράς εισιτηρίων όταν δεν γνωρίζουμε ακόμη πόσα άτομα θα έρθουν, ποιο είδος παράστασης θα χρησιμοποιήσουμε;`
        : `If we want to model ticket costs before knowing how many guests will attend, what type of expression should we use?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Όταν ένα μέγεθος είναι μεταβαλλόμενο ή άγνωστο, χρησιμοποιούμε αλγεβρική παράσταση με μεταβλητή (π.χ. x).`
        : `When a quantity is unknown or variable, we construct an algebraic expression with a variable (e.g. x).`,
    };
  },

  // 14. Υπολογισμός περιμέτρου ορθογωνίου (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΓΕΩΜΕΤΡΙΚΗ ΠΑΡΑΣΤΑΣΗ' : 'GEOMETRIC EXPRESSION',
      question: locale === 'el'
        ? `Ένα ορθογώνιο έχει διαστάσεις μήκος <strong>x ＋ 3</strong> και πλάτος <strong>4</strong>. Υπολόγισε την περίμετρό του όταν <strong>x ＝ 5</strong>:`
        : `A rectangle has dimensions length <strong>x ＋ 3</strong> and width <strong>4</strong>. Calculate its perimeter when <strong>x ＝ 5</strong>:`,
      correctAnswer: '24',
      solution: locale === 'el'
        ? `Για x ＝ 5, το μήκος είναι 5 ＋ 3 ＝ 8. Η περίμετρος είναι 2 · 8 ＋ 2 · 4 ＝ 16 ＋ 8 ＝ 24.`
        : `For x ＝ 5, length is 5 ＋ 3 ＝ 8. Perimeter is 2 · 8 ＋ 2 · 4 ＝ 16 ＋ 8 ＝ 24.`,
    };
  },

  // 15. Απλοποίηση πριν τον υπολογισμό (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΑΓΩΓΗ & ΥΠΟΛΟΓΙΣΜΟΣ' : 'COMBINING & EVALUATION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης <strong>3 · x ＋ 5 · x － 2 · x</strong> για <strong>x ＝ 4</strong>:`
        : `Calculate the value of expression <strong>3 · x ＋ 5 · x － 2 · x</strong> for <strong>x ＝ 4</strong>:`,
      correctAnswer: '24',
      solution: locale === 'el'
        ? `Απλοποιούμε πρώτα τους όμοιους όρους: (3 ＋ 5 － 2) · x ＝ 6 · x. Για x ＝ 4: 6 · 4 ＝ 24.`
        : `Combine like terms first: (3 ＋ 5 － 2) · x ＝ 6 · x. For x ＝ 4: 6 · 4 ＝ 24.`,
    };
  },

  // 16. Τι είναι μεταβλητή σε παράσταση (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Η παρουσία τουλάχιστον μίας μεταβλητής (γράμματος)'
      : 'The presence of at least one variable (letter)';
    const wrongs = locale === 'el'
      ? ['Η χρήση παρενθέσεων', 'Η ύπαρξη δυνάμεων', 'Το σύμβολο της διαίρεσης']
      : ['The use of parentheses', 'The presence of exponents', 'The division symbol'];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΘΕΩΡΙΑ ΠΑΡΑΣΤΑΣΕΩΝ' : 'EXPRESSION THEORY',
      question: locale === 'el'
        ? `Ποιο στοιχείο μετατρέπει μια αριθμητική παράσταση σε αλγεβρική;`
        : `What distinct feature turns a numerical expression into an algebraic one?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Η παρουσία μεταβλητής είναι το καθοριστικό στοιχείο που χαρακτηρίζει μια παράσταση ως αλγεβρική.`
        : `The presence of a variable is the defining criterion of an algebraic expression.`,
    };
  },

  // 17. Υπολογισμός τιμής με δεκαδικό x (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΗ ΤΙΜΗ' : 'DECIMAL EVALUATION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης <strong>2 · x ＋ 3</strong> για <strong>x ＝ 2,5</strong>:`
        : `Calculate the value of expression <strong>2 · x ＋ 3</strong> for <strong>x ＝ 2.5</strong>:`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `2 · 2,5 ＋ 3 ＝ 5 ＋ 3 ＝ 8.`
        : `2 · 2.5 ＋ 3 ＝ 5 ＋ 3 ＝ 8.`,
    };
  },

  // 18. Υπολογισμός εμβαδού τριγώνου με μεταβλητή (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΜΒΑΔΟΝ ΜΕ ΜΕΤΑΒΛΗΤΗ' : 'AREA WITH VARIABLE',
      question: locale === 'el'
        ? `Το εμβαδόν τριγώνου με βάση x και ύψος 6 δίνεται από την παράσταση <strong>(6 · x) : 2</strong>. Ποιο είναι το εμβαδόν για <strong>x ＝ 7</strong>;`
        : `The area of a triangle with base x and height 6 is modeled by <strong>(6 · x) : 2</strong>. What is the area for <strong>x ＝ 7</strong>?`,
      correctAnswer: '21',
      solution: locale === 'el'
        ? `(6 · 7) : 2 ＝ 42 : 2 ＝ 21.`
        : `(6 · 7) : 2 ＝ 42 : 2 ＝ 21.`,
    };
  },

  // 19. Αντικατάσταση δύο μεταβλητών με αρνητικό (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΡΝΗΤΙΚΗ ΑΝΤΙΚΑΤΑΣΤΑΣΗ' : 'NEGATIVE SUBSTITUTION',
      question: locale === 'el'
        ? `Υπολόγισε την τιμή της παράστασης <strong>2 · α － 3 · β</strong> όταν <strong>α ＝ 5</strong> και <strong>β ＝ －2</strong>:`
        : `Calculate the value of expression <strong>2 · a － 3 · b</strong> when <strong>a ＝ 5</strong> and <strong>b ＝ －2</strong>:`,
      correctAnswer: '16',
      solution: locale === 'el'
        ? `2 · 5 － 3 · (－2) ＝ 10 － (－6) ＝ 10 ＋ 6 ＝ 16.`
        : `2 · 5 － 3 · (－2) ＝ 10 － (－6) ＝ 10 ＋ 6 ＝ 16.`,
    };
  },

  // 20. Έλεγχος ισότητας παραστάσεων (MCQ)
  (locale) => {
    const correct = '2 · x ＋ 8';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΙΣΟΔΥΝΑΜΙΑ' : 'EQUIVALENCE',
      question: locale === 'el'
        ? `Ποια από τις παρακάτω παραστάσεις είναι ισοδύναμη με την <strong>2 · (x ＋ 4)</strong>;`
        : `Which of the following expressions is equivalent to <strong>2 · (x ＋ 4)</strong>?`,
      options: makeUniqueOptions(correct, ['2 · x ＋ 4', 'x ＋ 8', '2 · x · 4']),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Εφαρμόζοντας την επιμεριστική ιδιότητα: 2 · (x ＋ 4) ＝ 2 · x ＋ 2 · 4 ＝ 2 · x ＋ 8.`
        : `Applying distributive property: 2 · (x ＋ 4) ＝ 2 · x ＋ 2 · 4 ＝ 2 · x ＋ 8.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (ΧΩΡΙΣ ΕΤΟΙΜΟΥΣ ΤΥΠΟΥΣ)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Έξοδα σχολικής εκδρομής
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΟΛΕΙΟ' : 'PROBLEMS: SCHOOL TRIP',
      question: locale === 'el'
        ? `Για μια σχολική εκδρομή ναυλώθηκε λεωφορείο με πάγιο κόστος 180 €, ενώ το εισιτήριο στο μουσείο κοστίζει 4 € ανά μαθητή. Πόσο θα κοστίσει συνολικά η εκδρομή αν συμμετάσχουν <strong>25 μαθητές</strong> σε ευρώ;`
        : `For a school field trip, a bus was chartered for €180, while museum admission is €4 per student. How much will the trip cost in total if <strong>25 students</strong> participate (in euros)?`,
      correctAnswer: '280',
      solution: locale === 'el'
        ? `Πάγιο λεωφορείου: 180 €. Εισιτήρια μουσείου: 4 · 25 ＝ 100 €. Συνολικό κόστος: 180 ＋ 100 ＝ 280 €.`
        : `Bus fee: €180. Museum tickets: 4 · 25 ＝ €100. Total cost: 180 ＋ 100 ＝ €280.`,
    };
  },

  // Πρόβλημα 2: Παραγγελία πίτσας με διανομή
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΣΤΙΑΣΗ' : 'PROBLEMS: FOOD DELIVERY',
      question: locale === 'el'
        ? `Μια πιτσαρία χρεώνει 8 € για κάθε οικογενειακή πίτσα και επιπλέον 2,50 € πάγια έξοδα διανομής για όλη την παραγγελία. Πόσο θα πληρώσει μια παρέα που παρήγγειλε <strong>4 πίτσες</strong> σε ευρώ;`
        : `A pizzeria charges €8 for each family pizza plus a €2.50 flat delivery fee. How much will a group order of <strong>4 pizzas</strong> cost in euros?`,
      correctAnswer: '34,5',
      solution: locale === 'el'
        ? `Κόστος πιτσών: 8 · 4 ＝ 32 €. Έξοδα διανομής: 2,50 €. Συνολικό ποσό: 32 ＋ 2,5 ＝ 34,50 € (γράφεται 34,5).`
        : `Pizza cost: 8 · 4 ＝ €32. Delivery: €2.50. Total: 32 ＋ 2.5 ＝ €34.50 (written as 34.5).`,
    };
  },

  // Πρόβλημα 3: Ενοικίαση ηλεκτρικού πατινιού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΚΙΝΗΣΗ' : 'PROBLEMS: SCOOTER RENTAL',
      question: locale === 'el'
        ? `Η χρήση ηλεκτρικού πατινιού κοστίζει 1 € για το ξεκλείδωμα συν 0,20 € για κάθε λεπτό διαδρομής. Πόσο θα κοστίσει μια διαδρομή διάρκειας <strong>35 λεπτών</strong> σε ευρώ;`
        : `An e-scooter costs €1 to unlock plus €0.20 per minute of ride. How much will a <strong>35-minute ride</strong> cost in euros?`,
      correctAnswer: '8',
      solution: locale === 'el'
        ? `Πάγιο ξεκλείδωμα: 1 €. Χρέωση χρόνου: 0,20 · 35 ＝ 7 €. Συνολικό κόστος: 1 ＋ 7 ＝ 8 €.`
        : `Unlock: €1. Time fee: 0.20 · 35 ＝ €7. Total: 1 ＋ 7 ＝ €8.`,
    };
  },

  // Πρόβλημα 4: Περίμετρος οικοπέδου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ένα ορθογώνιο οικόπεδο έχει πλάτος 15 μέτρα και το μήκος του είναι κατά 8 μέτρα μεγαλύτερο από το πλάτος του. Πόσα μέτρα συρματόπλεγμα χρειάζονται για να περιφραχτεί ολόκληρο το οικόπεδο;`
        : `A rectangular plot has width 15 meters and its length is 8 meters greater than its width. How many meters of fencing are required to enclose the entire plot?`,
      correctAnswer: '76',
      solution: locale === 'el'
        ? `Πλάτος: 15 m. Μήκος: 15 ＋ 8 ＝ 23 m. Περίμετρος: 2 · 23 ＋ 2 · 15 ＝ 46 ＋ 30 ＝ 76 m.`
        : `Width: 15 m. Length: 15 ＋ 8 ＝ 23 m. Perimeter: 2 · 23 ＋ 2 · 15 ＝ 46 ＋ 30 ＝ 76 m.`,
    };
  },

  // Πρόβλημα 5: Αμοιβή baby sitting με έξοδα κίνησης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ' : 'PROBLEMS: WORK',
      question: locale === 'el'
        ? `Μια παιδαγωγός λαμβάνει 6 € πάγια αποζημίωση μετακίνησης και 8 € για κάθε ώρα απασχόλησης. Πόσα ευρώ θα πληρωθεί συνολικά για εργασία <strong>5 ωρών</strong>;`
        : `A babysitter receives a flat €6 travel compensation plus €8 per hour of work. How much will she be paid in total for <strong>5 hours</strong> of work in euros?`,
      correctAnswer: '46',
      solution: locale === 'el'
        ? `Πάγια μετακίνηση: 6 €. Ωρομίσθιο: 8 · 5 ＝ 40 €. Σύνολο: 6 ＋ 40 ＝ 46 €.`
        : `Travel fee: €6. Hourly pay: 8 · 5 ＝ €40. Total: 6 ＋ 40 ＝ €46.`,
    };
  },

  // Πρόβλημα 6: Στάθμη δεξαμενής καυσίμου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ' : 'PROBLEMS: FUEL LEVEL',
      question: locale === 'el'
        ? `Μια δεξαμενή πετρελαίου περιείχε αρχικά 450 λίτρα. Ένας καυστήρας καταναλώνει 15 λίτρα για κάθε ώρα λειτουργίας. Πόσα λίτρα πετρελαίου θα απομένουν στη δεξαμενή μετά από <strong>12 ώρες</strong> συνεχούς λειτουργίας;`
        : `An oil tank initially held 450 liters. A burner consumes 15 liters per hour of operation. How many liters of oil will remain after <strong>12 hours</strong> of continuous operation?`,
      correctAnswer: '270',
      solution: locale === 'el'
        ? `Αρχική ποσότητα: 450 L. Κατανάλωση: 15 · 12 ＝ 180 L. Απομένουν: 450 － 180 ＝ 270 L.`
        : `Initial fuel: 450 L. Burned: 15 · 12 ＝ 180 L. Remaining: 450 － 180 ＝ 270 L.`,
    };
  },

  // Πρόβλημα 7: Αγορά γραφικής ύλης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'PROBLEMS: PURCHASES',
      question: locale === 'el'
        ? `Ο Ανδρέας αγόρασε 5 ίδια τετράδια προς 1,80 € το ένα και 3 στυλό προς 0,90 € το ένα. Πόσα ρέστα πήρε από χαρτονόμισμα των 20 € (σε ευρώ);`
        : `Andrew bought 5 notebooks at €1.80 each and 3 pens at €0.90 each. How much change did he receive from a €20 bill (in euros)?`,
      correctAnswer: '8,3',
      solution: locale === 'el'
        ? `Κόστος τετραδίων: 5 · 1,80 ＝ 9 €. Κόστος στυλό: 3 · 0,90 ＝ 2,70 €. Συνολικό κόστος: 9 ＋ 2,70 ＝ 11,70 €. Ρέστα: 20 － 11,70 ＝ 8,30 € (γράφεται 8,3).`
        : `Notebooks: 5 · 1.80 ＝ €9. Pens: 3 · 0.90 ＝ €2.70. Subtotal: 9 ＋ 2.70 ＝ €11.70. Change: 20 － 11.70 ＝ €8.30 (written as 8.3).`,
    };
  },

  // Πρόβλημα 8: Εμβαδόν πλατείας με συντριβάνι
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Μια ορθογώνια πλατεία έχει διαστάσεις 30 m επί 20 m. Στο κέντρο της κατασκευάζεται τετράγωνο συντριβάνι πλευράς 6 m. Ποιο είναι το καθαρό εμβαδόν της πλατείας που απομένει για τους πεζούς σε τ.μ.;`
        : `A rectangular town square measures 30 m by 20 m. A square fountain of side 6 m is built in the center. What is the remaining pedestrian area in square meters?`,
      correctAnswer: '564',
      solution: locale === 'el'
        ? `Εμβαδόν πλατείας: 30 · 20 ＝ 600 τ.μ. Εμβαδόν συντριβανιού: 6 · 6 ＝ 36 τ.μ. Καθαρό εμβαδόν: 600 － 36 ＝ 564 τ.μ.`
        : `Square area: 30 · 20 ＝ 600 sq.m. Fountain: 6 · 6 ＝ 36 sq.m. Remaining area: 600 － 36 ＝ 564 sq.m.`,
    };
  },

  // Πρόβλημα 9: Αποταμίευση για αγορά κονσόλας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'PROBLEMS: SAVINGS',
      question: locale === 'el'
        ? `Ο Μάνος έχει ήδη αποταμιεύσει 65 € και προσθέτει στον κουμπαρά του 15 € κάθε εβδομάδα. Πόσα χρήματα θα έχει συγκεντρώσει συνολικά μετά από <strong>9 εβδομάδες</strong> σε ευρώ;`
        : `Manos already saved €65 and adds €15 to his savings each week. How much money will he have accumulated after <strong>9 weeks</strong> in euros?`,
      correctAnswer: '200',
      solution: locale === 'el'
        ? `Αρχικό ποσό: 65 €. Νέα αποταμίευση: 15 · 9 ＝ 135 €. Σύνολο: 65 ＋ 135 ＝ 200 €.`
        : `Initial: €65. Added: 15 · 9 ＝ €135. Total: 65 ＋ 135 ＝ €200.`,
    };
  },

  // Πρόβλημα 10: Φόρτωση κιβωτίων σε ανελκυστήρα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΡΟΣ' : 'PROBLEMS: CARGO WEIGHT',
      question: locale === 'el'
        ? `Σε έναν ανελκυστήρα φορτίων μπαίνει ο χειριστής που ζυγίζει 85 kg μαζί με 14 όμοια κιβώτια βάρους 25 kg το καθένα. Ποιο είναι το συνολικό φορτίο σε kg;`
        : `A freight elevator carries an operator weighing 85 kg along with 14 identical boxes weighing 25 kg each. What is the total payload in kg?`,
      correctAnswer: '435',
      solution: locale === 'el'
        ? `Βάρος χειριστή: 85 kg. Βάρος κιβωτίων: 14 · 25 ＝ 350 kg. Συνολικό βάρος: 85 ＋ 350 ＝ 435 kg.`
        : `Operator: 85 kg. Boxes: 14 · 25 ＝ 350 kg. Total: 85 ＋ 350 ＝ 435 kg.`,
    };
  },

  // Πρόβλημα 11: Χρέωση εκτύπωσης αφισών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΤΥΠΩΣΕΙΣ' : 'PROBLEMS: PRINTING',
      question: locale === 'el'
        ? `Ένα τυπογραφείο χρεώνει 30 € πάγια έξοδα σχεδιασμού μακέτας και 0,50 € για την εκτύπωση κάθε αφίσας. Πόσο θα κοστίσει η εκτύπωση <strong>120 αφισών</strong> σε ευρώ;`
        : `A print shop charges a €30 flat design setup fee plus €0.50 per poster printed. How much will printing <strong>120 posters</strong> cost in euros?`,
      correctAnswer: '90',
      solution: locale === 'el'
        ? `Πάγιο μακέτας: 30 €. Κόστος εκτύπωσης: 0,50 · 120 ＝ 60 €. Συνολικό κόστος: 30 ＋ 60 ＝ 90 €.`
        : `Design fee: €30. Printing: 0.50 · 120 ＝ €60. Total: 30 ＋ 60 ＝ €90.`,
    };
  },

  // Πρόβλημα 12: Διαδρομή τρένου με ενδιάμεσες στάσεις
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ' : 'PROBLEMS: TRAVEL TIME',
      question: locale === 'el'
        ? `Ένα τρένο ταξιδεύει επί 3 ώρες με σταθερή ταχύτητα 80 km/h και στη συνέχεια κάνει 4 στάσεις διάρκειας 15 λεπτών η καθεμία. Πόσα λεπτά διήρκεσαν συνολικά όλες οι στάσεις μαζί;`
        : `A train travels for 3 hours at 80 km/h and makes 4 intermediate stops of 15 minutes each. How many minutes did all the stops take combined?`,
      correctAnswer: '60',
      solution: locale === 'el'
        ? `4 στάσεις των 15 λεπτών: 4 · 15 ＝ 60 λεπτά (1 ώρα).`
        : `4 stops of 15 minutes each: 4 · 15 ＝ 60 minutes (1 hour).`,
    };
  },

  // Πρόβλημα 13: Κόστος πλυσίματος αυτοκινήτου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΥΠΗΡΕΣΙΕΣ' : 'PROBLEMS: SERVICES',
      question: locale === 'el'
        ? `Ένα πλυντήριο αυτοκινήτων χρεώνει 7 € βασικό εξωτερικό πλύσιμο συν 2,50 € για κάθε επιπλέον ειδικό καθαριστικό. Πόσο θα πληρώσει ένας οδηγός που επέλεξε <strong>3 ειδικά καθαριστικά</strong> σε ευρώ;`
        : `A car wash charges €7 for a basic wash plus €2.50 for each extra detailing service. How much will a driver pay if they choose <strong>3 extra services</strong> in euros?`,
      correctAnswer: '14,5',
      solution: locale === 'el'
        ? `Βασικό πλύσιμο: 7 €. Καθαριστικά: 3 · 2,50 ＝ 7,50 €. Συνολικό ποσό: 7 ＋ 7,50 ＝ 14,50 € (γράφεται 14,5).`
        : `Basic wash: €7. Extras: 3 · 2.50 ＝ €7.50. Total: 7 ＋ 7.50 ＝ €14.50 (written as 14.5).`,
    };
  },

  // Πρόβλημα 14: Κατασκευή περιφράγματος με πασσάλους
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ' : 'PROBLEMS: CONSTRUCTION',
      question: locale === 'el'
        ? `Σε έναν ευθύγραμμο φράχτη τοποθετούνται 16 πάσσαλοι σε ίση απόσταση 3 μέτρων ο ένας από τον επόμενο. Ποιο είναι το συνολικό μήκος του φράχτη από τον πρώτο έως τον τελευταίο πάσσαλο σε μέτρα;`
        : `Along a straight fence, 16 posts are placed 3 meters apart. What is the total length of the fence from the first to the last post in meters?`,
      correctAnswer: '45',
      solution: locale === 'el'
        ? `Ανάμεσα σε 16 πασσάλους υπάρχουν 15 ίσα διαστήματα: 15 · 3 ＝ 45 μέτρα.`
        : `Between 16 posts there are 15 equal intervals: 15 · 3 ＝ 45 meters.`,
    };
  },

  // Πρόβλημα 15: Συνδρομή streaming πλατφόρμας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΔΡΟΜΗ' : 'PROBLEMS: SUBSCRIPTION',
      question: locale === 'el'
        ? `Μια πλατφόρμα ταινιών χρεώνει 9 € μηνιαία συνδρομή και 2 € για κάθε ταινία νέας κυκλοφορίας που ενοικιάζεται. Πόσο θα πληρώσει ένας συνδρομητής που ενοικίασε <strong>6 νέες ταινίες</strong> μέσα στον μήνα σε ευρώ;`
        : `A movie streaming platform charges €9 monthly plus €2 per new premiere movie rented. How much will a subscriber pay if they rented <strong>6 new movies</strong> during the month in euros?`,
      correctAnswer: '21',
      solution: locale === 'el'
        ? `Πάγια συνδρομή: 9 €. Ενοικιάσεις: 6 · 2 ＝ 12 €. Συνολικός λογαριασμός: 9 ＋ 12 ＝ 21 €.`
        : `Base fee: €9. Rentals: 6 · 2 ＝ €12. Total bill: 9 ＋ 12 ＝ €21.`,
    };
  },

  // Πρόβλημα 16: Εμβαδόν διαδρόμου γύρω από κήπο
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ' : 'PROBLEMS: GEOMETRY',
      question: locale === 'el'
        ? `Ένας τετράγωνος κήπος έχει πλευρά 10 m. Γύρω του κατασκευάζεται διάδρομος, διαμορφώνοντας ένα μεγαλύτερο τετράγωνο συνολικής πλευράς 12 m. Ποιο είναι το εμβαδόν του διαδρόμου σε τ.μ.;`
        : `A square garden has side length 10 m. A pathway is built around it, forming a larger concentric square of side 12 m. What is the area of the pathway in square meters?`,
      correctAnswer: '44',
      solution: locale === 'el'
        ? `Εξωτερικό τετράγωνο: 12 · 12 ＝ 144 τ.μ. Εσωτερικός κήπος: 10 · 10 ＝ 100 τ.μ. Εμβαδόν διαδρόμου: 144 － 100 ＝ 44 τ.μ.`
        : `Outer square: 12 · 12 ＝ 144 sq.m. Inner garden: 10 · 10 ＝ 100 sq.m. Pathway area: 144 － 100 ＝ 44 sq.m.`,
    };
  },

  // Πρόβλημα 17: Συγκομιδή ελαιοκάρπου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΡΟΤΙΚΑ' : 'PROBLEMS: AGRICULTURE',
      question: locale === 'el'
        ? `Ένας παραγωγός γέμισε 8 σακιά των 50 kg και άλλα 6 σακιά των 40 kg. Πόσα κιλά ελιές μάζεψε συνολικά;`
        : `An olive farmer filled 8 sacks of 50 kg each and another 6 sacks of 40 kg each. How many kilograms of olives were harvested in total?`,
      correctAnswer: '640',
      solution: locale === 'el'
        ? `8 · 50 ＝ 400 kg και 6 · 40 ＝ 240 kg. Συνολική συγκομιδή: 400 ＋ 240 ＝ 640 kg.`
        : `8 · 50 ＝ 400 kg and 6 · 40 ＝ 240 kg. Total harvest: 400 ＋ 240 ＝ 640 kg.`,
    };
  },

  // Πρόβλημα 18: Κατανάλωση ηλεκτρικού ρεύματος
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΕΡΓΕΙΑ' : 'PROBLEMS: UTILITIES',
      question: locale === 'el'
        ? `Ένας λογαριασμός ρεύματος περιλαμβάνει 18 € πάγια δημοτικά τέλη και χρεώνει 0,15 € για κάθε κιλοβατώρα (kWh) κατανάλωσης. Πόσο θα πληρώσει ένα νοικοκυριό που κατανάλωσε <strong>300 kWh</strong> σε ευρώ;`
        : `An electric utility bill includes a €18 municipal service fee and charges €0.15 per kilowatt-hour (kWh). How much will a household pay for consuming <strong>300 kWh</strong> in euros?`,
      correctAnswer: '63',
      solution: locale === 'el'
        ? `Πάγια τέλη: 18 €. Χρέωση ενέργειας: 0,15 · 300 ＝ 45 €. Συνολικό ποσό: 18 ＋ 45 ＝ 63 €.`
        : `Base fee: €18. Energy charge: 0.15 · 300 ＝ €45. Total: 18 ＋ 45 ＝ €63.`,
    };
  },

  // Πρόβλημα 19: Χρέωση γηπέδου τένις
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ' : 'PROBLEMS: SPORTS',
      question: locale === 'el'
        ? `Η ενοικίαση γηπέδου τένις κοστίζει 10 € την ώρα, συν 4 € εφάπαξ για τον φωτισμό του γηπέδου το βράδυ. Πόσο θα κοστίσει η προπόνηση για <strong>2 ώρες</strong> με αναμμένο φωτισμό σε ευρώ;`
        : `Renting a tennis court costs €10 per hour, plus a €4 flat fee for evening floodlights. How much will a <strong>2-hour training session</strong> with lights on cost in euros?`,
      correctAnswer: '24',
      solution: locale === 'el'
        ? `Ενοικίαση γηπέδου: 2 · 10 ＝ 20 €. Φωτισμός: 4 €. Συνολικό κόστος: 20 ＋ 4 ＝ 24 €.`
        : `Court rental: 2 · 10 ＝ €20. Lights: €4. Total: 20 ＋ 4 ＝ €24.`,
    };
  },

  // Πρόβλημα 20: Παραγωγή χυμού σε συσκευασίες
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΠΑΡΑΓΩΓΗ' : 'PROBLEMS: PACKAGING',
      question: locale === 'el'
        ? `Ένα εργοστάσιο εμφιάλωσε 120 κιβώτια των 6 μπουκαλιών και 50 κιβώτια των 12 μπουκαλιών. Πόσα μπουκάλια χυμού εμφιαλώθηκαν συνολικά;`
        : `A juice packaging facility filled 120 boxes of 6 bottles each and 50 boxes of 12 bottles each. How many bottles of juice were packaged in total?`,
      correctAnswer: '1320',
      solution: locale === 'el'
        ? `120 · 6 ＝ 720 μπουκάλια και 50 · 12 ＝ 600 μπουκάλια. Σύνολο: 720 ＋ 600 ＝ 1.320 μπουκάλια.`
        : `120 · 6 ＝ 720 bottles and 50 · 12 ＝ 600 bottles. Total: 720 ＋ 600 ＝ 1,320 bottles.`,
    };
  },
];

export default function ParastaseisAsk() {
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
    // Επιτρέπουμε νούμερα, κόμμα, κάθετο για κλάσματα, μείον και μεταβλητή x
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
        .replace(/：/g, ':')
        .replace(/^\+/, '');

    const u = normalize(userRaw);
    const c = normalize(correctRaw);

    if (u === c) return true;

    // Έλεγχος αριθμητικών τιμών με ανοχή 0.05
    const uNum = parseFloat(u);
    const cNum = parseFloat(c);
    if (!isNaN(uNum) && !isNaN(cNum) && !u.includes('x') && !c.includes('x') && !u.includes(':') && !c.includes(':')) {
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
          href="/a-gymnasiou/28-parastaseis"
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
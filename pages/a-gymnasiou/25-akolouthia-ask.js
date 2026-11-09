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
    pageTitle: "Ασκήσεις: Κανονικότητες & Ακολουθίες | Α' Γυμνασίου",
    pageDesc: "12 δυναμικές ασκήσεις και προβλήματα στην αναγνώριση κανονικοτήτων και τον υπολογισμό του ν-οστού όρου για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 22 • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Κανονικότητες & Ο ν-οστός Όρος",
    mainSubtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 εύρεσης μοτίβων/τύπων ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    wordProblemTag: "ΠΡΟΒΛΗΜΑ",
    inputPlaceholder: "π.χ. 19 ή 2*ν",
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
    pageTitle: "Exercises: Patterns & Sequences | 7th Grade Math",
    pageDesc: "12 dynamic exercises and problems on identifying sequences and calculating the nth term for Grade 7.",
    backText: "7th Grade",
    theoryBtn: "THEORY",
    chapterBadge: "GRADE 7 • CHAPTER 22 • PRACTICE",
    mainTitle: "Patterns & Sequences (The nth Term)",
    mainSubtitle: "Solve the following 12 selected exercises (10 pattern/formula finding ＋ 2 realistic problems). Click \"CHECK ANSWERS\" to see your score and step-by-step solutions.",
    wordProblemTag: "WORD PROBLEM",
    inputPlaceholder: "e.g. 19 or 2*n",
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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΚΑΝΟΝΙΚΟΤΗΤΑΣ & ν-ΟΣΤΟΥ ΟΡΟΥ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Εύρεση επόμενου όρου σε σταθερή πρόσθεση (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΠΟΜΕΝΟΣ ΟΡΟΣ' : 'NEXT TERM',
      question: locale === 'el'
        ? `Ποιος είναι ο επόμενος όρος της κανονικότητας: <strong>3, 7, 11, 15, ...</strong>;`
        : `What is the next term in the sequence: <strong>3, 7, 11, 15, ...</strong>?`,
      correctAnswer: '19',
      solution: locale === 'el'
        ? `Παρατηρούμε ότι κάθε όρος προκύπτει προσθέτοντας το 4 στον προηγούμενο (σταθερή αύξηση κατά 4). Άρα ο επόμενος είναι: 15 ＋ 4 ＝ 19.`
        : `Each term increases by 4 from the previous one. Thus the next term is: 15 ＋ 4 ＝ 19.`,
    };
  },

  // 2. Εύρεση επόμενου όρου σε σταθερή μείωση (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΦΘΙΝΟΥΣΑ ΚΑΝΟΝΙΚΟΤΗΤΑΣ' : 'DECREASING SEQUENCE',
      question: locale === 'el'
        ? `Ποιος είναι ο επόμενος όρος της κανονικότητας: <strong>30, 25, 20, 15, ...</strong>;`
        : `What is the next term in the sequence: <strong>30, 25, 20, 15, ...</strong>?`,
      correctAnswer: '10',
      solution: locale === 'el'
        ? `Κάθε όρος μειώνεται κατά 5 από τον προηγούμενο: 15 － 5 ＝ 10.`
        : `Each term decreases by 5: 15 － 5 ＝ 10.`,
    };
  },

  // 3. Υπολογισμός συγκεκριμένου όρου από τον τύπο (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ' : 'TERM CALCULATION',
      question: locale === 'el'
        ? `Ο γενικός τύπος μιας ακολουθίας είναι <strong>4 · ${v} － 1</strong>. Υπολόγισε τον <strong>6ο όρο</strong> (για ${v} ＝ 6):`
        : `The general term formula is <strong>4 · ${v} － 1</strong>. Calculate the <strong>6th term</strong> (for ${v} ＝ 6):`,
      correctAnswer: '23',
      solution: locale === 'el'
        ? `Αντικαθιστούμε ${v} ＝ 6 στον τύπο: 4 · 6 － 1 ＝ 24 － 1 ＝ 23.`
        : `Substitute ${v} ＝ 6 into the formula: 4 · 6 － 1 ＝ 24 － 1 ＝ 23.`,
    };
  },

  // 4. Υπολογισμός 10ου όρου (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ' : 'TERM CALCULATION',
      question: locale === 'el'
        ? `Αν ο όρος είναι <strong>3 · ${v} ＋ 5</strong>, ποια είναι η τιμή του <strong>10ου όρου</strong>;`
        : `If the nth term is <strong>3 · ${v} ＋ 5</strong>, what is the value of the <strong>10th term</strong>?`,
      correctAnswer: '35',
      solution: locale === 'el'
        ? `Για ${v} ＝ 10 έχουμε: 3 · 10 ＋ 5 ＝ 30 ＋ 5 ＝ 35.`
        : `For ${v} ＝ 10: 3 · 10 ＋ 5 ＝ 30 ＋ 5 ＝ 35.`,
    };
  },

  // 5. Αναγνώριση του τύπου των άρτιων (MCQ)
  (locale, v) => {
    const correct = `2 · ${v}`;
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΑΡΤΙΟΙ ΑΡΙΘΜΟΙ' : 'EVEN NUMBERS',
      question: locale === 'el'
        ? `Ποιος είναι ο γενικός όρος των θετικών άρτιων αριθμών <strong>2, 4, 6, 8, ...</strong>;`
        : `What is the general term for the positive even numbers <strong>2, 4, 6, 8, ...</strong>?`,
      options: makeUniqueOptions(correct, [`${v} ＋ 2`, `2 · ${v} ＋ 1`, `${v}<sup>2</sup>`]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Για ${v} ＝ 1 έχουμε 2 · 1 ＝ 2, για ${v} ＝ 2 έχουμε 2 · 2 ＝ 4 κ.ο.κ. Άρα ο τύπος είναι 2 · ${v}.`
        : `For ${v} ＝ 1 we get 2 · 1 ＝ 2, for ${v} ＝ 2 we get 2 · 2 ＝ 4, etc. Thus the formula is 2 · ${v}.`,
    };
  },

  // 6. Αναγνώριση του τύπου των περιττών (MCQ)
  (locale, v) => {
    const correct = `2 · ${v} － 1`;
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΠΕΡΙΤΤΟΙ ΑΡΙΘΜΟΙ' : 'ODD NUMBERS',
      question: locale === 'el'
        ? `Ποιος είναι ο γενικός όρος των περιττών αριθμών <strong>1, 3, 5, 7, ...</strong>;`
        : `What is the general term for the odd numbers <strong>1, 3, 5, 7, ...</strong>?`,
      options: makeUniqueOptions(correct, [`2 · ${v}`, `${v} ＋ 2`, `2 · ${v} ＋ 1`]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Για ${v} ＝ 1: 2 · 1 － 1 ＝ 1. Για ${v} ＝ 2: 2 · 2 － 1 ＝ 3. Ο τύπος είναι 2 · ${v} － 1.`
        : `For ${v} ＝ 1: 2 · 1 － 1 ＝ 1. For ${v} ＝ 2: 2 · 2 － 1 ＝ 3. Formula is 2 · ${v} － 1.`,
    };
  },

  // 7. Τετραγωνικοί αριθμοί (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΤΕΤΡΑΓΩΝΙΚΟΙ ΑΡΙΘΜΟΙ' : 'SQUARE NUMBERS',
      question: locale === 'el'
        ? `Στην κανονικότητα <strong>1, 4, 9, 16, 25, ...</strong> (${v}<sup>2</sup>), ποιος είναι ο <strong>7ος όρος</strong>;`
        : `In the sequence <strong>1, 4, 9, 16, 25, ...</strong> (${v}<sup>2</sup>), what is the <strong>7th term</strong>?`,
      correctAnswer: '49',
      solution: locale === 'el'
        ? `Ο κανόνας είναι ${v}<sup>2</sup>, επομένως για τον 7ο όρο έχουμε: 7<sup>2</sup> ＝ 7 · 7 ＝ 49.`
        : `The rule is ${v}<sup>2</sup>, so for the 7th term: 7<sup>2</sup> ＝ 7 · 7 ＝ 49.`,
    };
  },

  // 8. Διπλασιασμός (Γεωμετρική αύξηση) (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΟΛΛΑΠΛΑΣΙΑΣΤΙΚΗ ΚΑΝΟΝΙΚΟΤΗΤΑ' : 'GEOMETRIC SEQUENCE',
      question: locale === 'el'
        ? `Ποιος είναι ο επόμενος όρος της κανονικότητας: <strong>2, 4, 8, 16, 32, ...</strong>;`
        : `What is the next term in the sequence: <strong>2, 4, 8, 16, 32, ...</strong>?`,
      correctAnswer: '64',
      solution: locale === 'el'
        ? `Κάθε όρος προκύπτει πολλαπλασιάζοντας τον προηγούμενο επί 2: 32 · 2 ＝ 64.`
        : `Each term is multiplied by 2: 32 · 2 ＝ 64.`,
    };
  },

  // 9. Εύρεση θέσης ν από γνωστή τιμή (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? `ΕΥΡΕΣΗ ΘΕΣΗΣ (${v})` : `FINDING POSITION (${v})`,
      question: locale === 'el'
        ? `Αν ο γενικός όρος είναι <strong>5 · ${v}</strong>, σε ποια θέση (ποιο είναι το ${v}) βρίσκεται ο αριθμός <strong>45</strong>;`
        : `If the general term is <strong>5 · ${v}</strong>, at what position (${v}) is the number <strong>45</strong>?`,
      correctAnswer: '9',
      solution: locale === 'el'
        ? `Λύνουμε την εξίσωση 5 · ${v} ＝ 45: ${v} ＝ 45 : 5 ＝ 9.`
        : `Solve 5 · ${v} ＝ 45: ${v} ＝ 45 : 5 ＝ 9.`,
    };
  },

  // 10. Εύρεση θέσης ν με σταθερά (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? `ΕΥΡΕΣΗ ΘΕΣΗΣ (${v})` : `FINDING POSITION (${v})`,
      question: locale === 'el'
        ? `Στην ακολουθία με τύπο <strong>3 · ${v} ＋ 2</strong>, ποιος όρος ισούται με <strong>29</strong> (βρες το ${v});`
        : `In the sequence with formula <strong>3 · ${v} ＋ 2</strong>, which term equals <strong>29</strong> (find ${v})?`,
      correctAnswer: '9',
      solution: locale === 'el'
        ? `3 · ${v} ＋ 2 ＝ 29 ➔ 3 · ${v} ＝ 29 － 2 ＝ 27 ➔ ${v} ＝ 27 : 3 ＝ 9.`
        : `3 · ${v} ＋ 2 ＝ 29 ➔ 3 · ${v} ＝ 29 － 2 ＝ 27 ➔ ${v} ＝ 27 : 3 ＝ 9.`,
    };
  },

  // 11. Αναγνώριση του τύπου από τη διαφορά (MCQ)
  (locale, v) => {
    const correct = `3 · ${v} ＋ 1`;
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΥΡΕΣΗ ΤΥΠΟΥ' : 'FINDING FORMULA',
      question: locale === 'el'
        ? `Ποιος τύπος παράγει τους όρους της ακολουθίας <strong>4, 7, 10, 13, ...</strong>;`
        : `Which formula generates the terms of the sequence <strong>4, 7, 10, 13, ...</strong>?`,
      options: makeUniqueOptions(correct, [`3 · ${v}`, `4 · ${v}`, `3 · ${v} ＋ 4`]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Η διαφορά ανάμεσα σε διαδοχικούς όρους είναι σταθερά 3. Για ${v} ＝ 1 θέλουμε 4, άρα 3 · 1 ＋ 1 ＝ 4. Ο τύπος είναι 3 · ${v} ＋ 1.`
        : `The common difference is 3. For ${v} ＝ 1 we need 4, so 3 · 1 ＋ 1 ＝ 4. Formula is 3 · ${v} ＋ 1.`,
    };
  },

  // 12. Εύρεση του 1ου όρου (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΩΤΟΣ ΟΡΟΣ' : 'FIRST TERM',
      question: locale === 'el'
        ? `Ποιος είναι ο <strong>1ος όρος</strong> (για ${v} ＝ 1) της ακολουθίας με τύπο <strong>6 · ${v} － 4</strong>;`
        : `What is the <strong>1st term</strong> (for ${v} ＝ 1) of the sequence with formula <strong>6 · ${v} － 4</strong>?`,
      correctAnswer: '2',
      solution: locale === 'el'
        ? `Βάζουμε ${v} ＝ 1: 6 · 1 － 4 ＝ 6 － 4 ＝ 2.`
        : `Set ${v} ＝ 1: 6 · 1 － 4 ＝ 6 － 4 ＝ 2.`,
    };
  },

  // 13. Εύρεση του 20ού όρου (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ' : 'TERM CALCULATION',
      question: locale === 'el'
        ? `Υπολόγισε τον <strong>20ό όρο</strong> της ακολουθίας με τύπο <strong>5 · ${v} ＋ 2</strong>:`
        : `Calculate the <strong>20th term</strong> of the sequence with formula <strong>5 · ${v} ＋ 2</strong>:`,
      correctAnswer: '102',
      solution: locale === 'el'
        ? `Για ${v} ＝ 20: 5 · 20 ＋ 2 ＝ 100 ＋ 2 ＝ 102.`
        : `For ${v} ＝ 20: 5 · 20 ＋ 2 ＝ 100 ＋ 2 ＝ 102.`,
    };
  },

  // 14. Εναλλασσόμενη κανονικότητα (MCQ)
  (locale, v) => {
    const correct = locale === 'el'
      ? `Τη θέση ή τον αύξοντα αριθμό του όρου (1ος, 2ος, 3ος, ...)`
      : `The position or ordinal index of the term (1st, 2nd, 3rd, ...)`;
    const wrongs = locale === 'el'
      ? [
          'Την τιμή του πρώτου αριθμού πάντοτε',
          'Τη διαφορά ανάμεσα σε δύο όρους',
          'Το άθροισμα όλων των αριθμών',
        ]
      : [
          'Always the value of the first number',
          'The difference between two terms',
          'The sum of all numbers',
        ];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΙΔΙΟΤΗΤΕΣ ΚΑΝΟΝΙΚΟΤΗΤΑΣ' : 'SEQUENCE PROPERTIES',
      question: locale === 'el'
        ? `Τι εκφράζει το σύμβολο <strong>${v}</strong> στον τύπο μιας κανονικότητας;`
        : `What does the symbol <strong>${v}</strong> represent in a sequence formula?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Η μεταβλητή ${v} είναι φυσικός αριθμός (1, 2, 3, ...) που δηλώνει τη θέση του κάθε όρου στην ακολουθία.`
        : `Variable ${v} is a natural integer (1, 2, 3, ...) representing the position of each term.`,
    };
  },

  // 15. Κλασματική κανονικότητα (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΚΛΑΣΜΑΤΙΚΗ ΑΚΟΛΟΥΘΙΑ' : 'FRACTIONAL SEQUENCE',
      question: locale === 'el'
        ? `Στην ακολουθία 1/2, 1/3, 1/4, 1/5, ... ποιος είναι ο παρονομαστής του <strong>10ου όρου</strong>;`
        : `In the sequence 1/2, 1/3, 1/4, 1/5, ... what is the denominator of the <strong>10th term</strong>?`,
      correctAnswer: '11',
      solution: locale === 'el'
        ? `Ο 1ος όρος έχει παρονομαστή 2 (1 ＋ 1), ο 2ος έχει 3 (2 ＋ 1). Άρα ο 10ος όρος έχει παρονομαστή 10 ＋ 1 ＝ 11 (το κλάσμα είναι 1/11).`
        : `The 1st term denominator is 2 (1 ＋ 1), 2nd is 3 (2 ＋ 1). Thus the 10th term denominator is 10 ＋ 1 ＝ 11.`,
    };
  },

  // 16. Τριγωνικοί αριθμοί (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΕΤΑΒΑΛΛΟΜΕΝΗ ΑΥΞΗΣΗ' : 'VARYING INCREMENT',
      question: locale === 'el'
        ? `Ποιος είναι ο επόμενος όρος της κανονικότητας: <strong>1, 3, 6, 10, ...</strong>;`
        : `What is the next term in the sequence: <strong>1, 3, 6, 10, ...</strong>?`,
      correctAnswer: '15',
      solution: locale === 'el'
        ? `Η αύξηση μεγαλώνει κατά 1 σε κάθε βήμα: 1 (＋2) ➔ 3 (＋3) ➔ 6 (＋4) ➔ 10 (＋5) ➔ 15.`
        : `The increment increases by 1 at each step: 1 (＋2) ➔ 3 (＋3) ➔ 6 (＋4) ➔ 10 (＋5) ➔ 15.`,
    };
  },

  // 17. Υπολογισμός 50ού όρου (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ' : 'TERM CALCULATION',
      question: locale === 'el'
        ? `Υπολόγισε τον <strong>50ό όρο</strong> της ακολουθίας με τύπο <strong>2 · ${v} ＋ 3</strong>:`
        : `Calculate the <strong>50th term</strong> of the sequence with formula <strong>2 · ${v} ＋ 3</strong>:`,
      correctAnswer: '103',
      solution: locale === 'el'
        ? `Για ${v} ＝ 50: 2 · 50 ＋ 3 ＝ 100 ＋ 3 ＝ 103.`
        : `For ${v} ＝ 50: 2 · 50 ＋ 3 ＝ 100 ＋ 3 ＝ 103.`,
    };
  },

  // 18. Αφαίρεση στον γενικό όρο (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΟΥ' : 'TERM CALCULATION',
      question: locale === 'el'
        ? `Ποιος είναι ο <strong>4ος όρος</strong> της ακολουθίας με τύπο <strong>10 · ${v} － 7</strong>;`
        : `What is the <strong>4th term</strong> of the sequence with formula <strong>10 · ${v} － 7</strong>?`,
      correctAnswer: '33',
      solution: locale === 'el'
        ? `10 · 4 － 7 ＝ 40 － 7 ＝ 33.`
        : `10 · 4 － 7 ＝ 40 － 7 ＝ 33.`,
    };
  },

  // 19. Αναγνώριση κανόνα πολλαπλασίων του 7 (Input)
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΟΛΛΑΠΛΑΣΙΑ' : 'MULTIPLES',
      question: locale === 'el'
        ? `Στην ακολουθία <strong>7, 14, 21, 28, ...</strong> (πολλαπλάσια του 7), ποιος είναι ο <strong>8ος όρος</strong>;`
        : `In the sequence <strong>7, 14, 21, 28, ...</strong> (multiples of 7), what is the <strong>8th term</strong>?`,
      correctAnswer: '56',
      solution: locale === 'el'
        ? `Ο τύπος είναι 7 · ${v}. Για ${v} ＝ 8: 7 · 8 ＝ 56.`
        : `The formula is 7 · ${v}. For ${v} ＝ 8: 7 · 8 ＝ 56.`,
    };
  },

  // 20. Έλεγχος αν ένας αριθμός ανήκει στην ακολουθία (MCQ)
  (locale, v) => {
    const correct = '20';
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΛΕΓΧΟΣ ΟΡΟΥ' : 'TERM CHECK',
      question: locale === 'el'
        ? `Ποιος από τους παρακάτω αριθμούς <strong>ΔΕΝ</strong> είναι όρος της ακολουθίας με τύπο <strong>4 · ${v} ＋ 1</strong>;`
        : `Which of the following numbers is <strong>NOT</strong> a term of the sequence with formula <strong>4 · ${v} ＋ 1</strong>?`,
      options: makeUniqueOptions(correct, ['5', '13', '25']),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Αν 4 · ${v} ＋ 1 ＝ 20 ➔ 4 · ${v} ＝ 19 ➔ ${v} ＝ 19/4 ＝ 4,75 (δεν είναι φυσικός αριθμός!). Άρα το 20 δεν ανήκει στην ακολουθία.`
        : `If 4 · ${v} ＋ 1 ＝ 20 ➔ ${v} ＝ 4.75 (not a natural integer!). Thus 20 does not belong.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΝΟΝΙΚΟΤΗΤΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Καθίσματα σε τραπέζια
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΣΤΙΑΤΟΡΙΟ' : 'PROBLEMS: RESTAURANT',
      question: locale === 'el'
        ? `Σε ένα εστιατόριο ενώνουν τετράγωνα τραπέζια στη σειρά. Το 1 τραπέζι έχει 4 θέσεις, τα 2 έχουν 6 θέσεις κ.ο.κ. (τύπος: 2 · ${v} ＋ 2). Πόσες θέσεις θα έχουν <strong>10 τραπέζια</strong> ενωμένα στη σειρά;`
        : `A restaurant joins square tables in a line. 1 table seats 4, 2 tables seat 6, etc. (formula: 2 · ${v} ＋ 2). How many seats will <strong>10 joined tables</strong> have?`,
      correctAnswer: '22',
      solution: locale === 'el'
        ? `Εφαρμόζουμε τον τύπο για ${v} ＝ 10: 2 · 10 ＋ 2 ＝ 20 ＋ 2 ＝ 22 θέσεις.`
        : `Apply formula for ${v} ＝ 10: 2 · 10 ＋ 2 ＝ 20 ＋ 2 ＝ 22 seats.`,
    };
  },

  // Πρόβλημα 2: Σπίρτα για κατασκευή τριγώνων
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΗΜΑΤΑ' : 'PROBLEMS: SHAPES',
      question: locale === 'el'
        ? `Για να φτιάξουμε 1 τρίγωνο χρειαζόμαστε 3 σπίρτα. Για κάθε επόμενο ενωμένο τρίγωνο προσθέτουμε 2 σπίρτα (τύπος: 2 · ${v} ＋ 1). Πόσα σπίρτα χρειάζονται για να φτιάξουμε <strong>8 ενωμένα τρίγωνα</strong>;`
        : `Making 1 triangle takes 3 matches. Each subsequent joined triangle adds 2 matches (formula: 2 · ${v} ＋ 1). How many matches are needed for <strong>8 joined triangles</strong>?`,
      correctAnswer: '17',
      solution: locale === 'el'
        ? `Για ${v} ＝ 8 τρίγωνα: 2 · 8 ＋ 1 ＝ 16 ＋ 1 ＝ 17 σπίρτα.`
        : `For ${v} ＝ 8 triangles: 2 · 8 ＋ 1 ＝ 16 ＋ 1 ＝ 17 matches.`,
    };
  },

  // Πρόβλημα 3: Αποταμίευση στον κουμπαρά
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'PROBLEMS: FINANCE',
      question: locale === 'el'
        ? `Η Ελένη έχει ήδη 20 € στον κουμπαρά της και κάθε εβδομάδα προσθέτει 4 € (τύπος: 4 · ${v} ＋ 20). Πόσα χρήματα θα έχει συγκεντρώσει μετά από <strong>12 εβδομάδες</strong>;`
        : `Helen has €20 in her piggy bank and adds €4 each week (formula: 4 · ${v} ＋ 20). How much money will she have after <strong>12 weeks</strong>?`,
      correctAnswer: '68',
      solution: locale === 'el'
        ? `Για ${v} ＝ 12 εβδομάδες: 4 · 12 ＋ 20 ＝ 48 ＋ 20 ＝ 68 €.`
        : `For ${v} ＝ 12 weeks: 4 · 12 ＋ 20 ＝ 48 ＋ 20 ＝ €68.`,
    };
  },

  // Πρόβλημα 4: Σκαλοπάτια σκάλας
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ' : 'PROBLEMS: STAIRS',
      question: locale === 'el'
        ? `Κάθε σκαλοπάτι μιας σκάλας έχει ύψος 18 cm. Ποιο είναι το συνολικό ύψος της σκάλας σε εκατοστά (cm) όταν ανέβουμε <strong>15 σκαλοπάτια</strong> (τύπος: 18 · ${v});`
        : `Each step of a staircase is 18 cm high. What is the total height in cm when climbing <strong>15 steps</strong> (formula: 18 · ${v})?`,
      correctAnswer: '270',
      solution: locale === 'el'
        ? `Ύψος ＝ 18 · 15 ＝ 270 cm.`
        : `Height ＝ 18 · 15 ＝ 270 cm.`,
    };
  },

  // Πρόβλημα 5: Φύτευση δέντρων σε δενδροστοιχία
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΗΠΟΥΡΙΚΗ' : 'PROBLEMS: GARDENING',
      question: locale === 'el'
        ? `Σε έναν ευθύγραμμο δρόμο φυτεύονται δέντρα ανά 6 μέτρα. Στην αρχή (0 m) μπαίνει το 1ο δέντρο. Σε ποια απόσταση από την αρχή (σε μέτρα) βρίσκεται το <strong>11ο δέντρο</strong> (τύπος: 6 · (${v} － 1));`
        : `Trees are planted every 6 meters along a road. The 1st tree is at 0 m. At what distance (in meters) from the start is the <strong>11th tree</strong> (formula: 6 · (${v} － 1))?`,
      correctAnswer: '60',
      solution: locale === 'el'
        ? `Ανάμεσα σε 11 δέντρα υπάρχουν 10 διαστήματα των 6 μέτρων: 6 · (11 － 1) ＝ 60 μέτρα.`
        : `Between 11 trees there are 10 intervals of 6 meters: 6 · (11 － 1) ＝ 60 meters.`,
    };
  },

  // Πρόβλημα 6: Πυραμίδα από κουτάκια αναψυκτικών
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΠΥΡΑΜΙΔΑ' : 'PROBLEMS: PYRAMID',
      question: locale === 'el'
        ? `Σε μια στοίβα, η 1η σειρά στην κορυφή έχει 1 κουτάκι, η 2η έχει 3, η 3η έχει 5 κ.ο.κ. (τύπος: 2 · ${v} － 1). Πόσα κουτάκια έχει η <strong>7η σειρά</strong>;`
        : `In a stack, the top 1st row has 1 can, the 2nd has 3, etc. (formula: 2 · ${v} － 1). How many cans are in the <strong>7th row</strong>?`,
      correctAnswer: '13',
      solution: locale === 'el'
        ? `Για ${v} ＝ 7: 2 · 7 － 1 ＝ 14 － 1 ＝ 13 κουτάκια.`
        : `For ${v} ＝ 7: 2 · 7 － 1 ＝ 14 － 1 ＝ 13 cans.`,
    };
  },

  // Πρόβλημα 7: Χρέωση ταξί
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ' : 'PROBLEMS: TAXI',
      question: locale === 'el'
        ? `Ένα ταξί έχει σημαία 2 € και χρεώνει 1,5 € για κάθε χιλιόμετρο (τύπος: 1,5 · ${v} ＋ 2). Πόσο θα κοστίσει μια διαδρομή <strong>10 χιλιομέτρων</strong> σε ευρώ;`
        : `A taxi charges a €2 base fee plus €1.50 per kilometer (formula: 1.5 · ${v} ＋ 2). How much will a <strong>10 km ride</strong> cost in euros?`,
      correctAnswer: '17',
      solution: locale === 'el'
        ? `1,5 · 10 ＋ 2 ＝ 15 ＋ 2 ＝ 17 €.`
        : `1.5 · 10 ＋ 2 ＝ 15 ＋ 2 ＝ €17.`,
    };
  },

  // Πρόβλημα 8: Αλυσίδα τηλεφωνημάτων
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΔΙΚΤΥΑ' : 'PROBLEMS: NETWORKS',
      question: locale === 'el'
        ? `Σε μια ειδοποίηση, 1 άτομο ειδοποιεί 2, αυτά τα 2 άλλα 4 κ.ο.κ. (δυνάμεις: 2<sup>${v}</sup>). Πόσα άτομα ειδοποιούνται στο <strong>5ο βήμα</strong>;`
        : `In an alert chain, 1 person notifies 2, those 2 notify 4, etc. (powers: 2<sup>${v}</sup>). How many people are notified at the <strong>5th step</strong>?`,
      correctAnswer: '32',
      solution: locale === 'el'
        ? `2<sup>5</sup> ＝ 32 άτομα.`
        : `2<sup>5</sup> ＝ 32 people.`,
    };
  },

  // Πρόβλημα 9: Περίφραξη με πασσάλους
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΠΕΡΙΦΡΑΞΗ' : 'PROBLEMS: FENCING',
      question: locale === 'el'
        ? `Για ${v} τμήματα φράχτη χρειάζονται ${v} ＋ 1 πάσσαλοι. Πόσοι πάσσαλοι χρειάζονται για να στηθούν <strong>24 τμήματα φράχτη</strong>;`
        : `For ${v} fence sections, ${v} ＋ 1 posts are needed. How many posts are needed to set up <strong>24 fence sections</strong>?`,
      correctAnswer: '25',
      solution: locale === 'el'
        ? `${v} ＋ 1 ＝ 24 ＋ 1 ＝ 25 πάσσαλοι.`
        : `${v} ＋ 1 ＝ 24 ＋ 1 ＝ 25 posts.`,
    };
  },

  // Πρόβλημα 10: Ενοικίαση ηλεκτρικού ποδηλάτου
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΝΟΙΚΙΑΣΗ' : 'PROBLEMS: RENTAL',
      question: locale === 'el'
        ? `Η ενοικίαση ποδηλάτου κοστίζει 3 € πάγιο συν 2 € για κάθε ώρα χρήσης (τύπος: 2 · ${v} ＋ 3). Πόσο κοστίζει η ενοικίαση για <strong>5 ώρες</strong> σε ευρώ;`
        : `Bike rental costs a €3 base fee plus €2 per hour of use (formula: 2 · ${v} ＋ 3). How much does rental cost for <strong>5 hours</strong> in euros?`,
      correctAnswer: '13',
      solution: locale === 'el'
        ? `2 · 5 ＋ 3 ＝ 10 ＋ 3 ＝ 13 €.`
        : `2 · 5 ＋ 3 ＝ 10 ＋ 3 ＝ €13.`,
    };
  },

  // Πρόβλημα 11: Πλακόστρωση αυλής
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ' : 'PROBLEMS: PAVING',
      question: locale === 'el'
        ? `Σε ένα μονοπάτι, κάθε μέτρο μήκους απαιτεί 8 πλακάκια, συν 4 πλακάκια για το τελείωμα (τύπος: 8 · ${v} ＋ 4). Πόσα πλακάκια χρειάζονται για μονοπάτι μήκους <strong>6 μέτρων</strong>;`
        : `A path requires 8 tiles per meter of length, plus 4 extra ending tiles (formula: 8 · ${v} ＋ 4). How many tiles are needed for a path of <strong>6 meters</strong>?`,
      correctAnswer: '52',
      solution: locale === 'el'
        ? `8 · 6 ＋ 4 ＝ 48 ＋ 4 ＝ 52 πλακάκια.`
        : `8 · 6 ＋ 4 ＝ 48 ＋ 4 ＝ 52 tiles.`,
    };
  },

  // Πρόβλημα 12: Συνδρομή γυμναστηρίου
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΔΡΟΜΗ' : 'PROBLEMS: MEMBERSHIP',
      question: locale === 'el'
        ? `Ένα γυμναστήριο χρεώνει 15 € εγγραφή και 25 € για κάθε μήνα (τύπος: 25 · ${v} ＋ 15). Πόσο θα πληρώσει συνολικά ένα μέλος για <strong>4 μήνες</strong> σε ευρώ;`
        : `A gym charges a €15 registration fee and €25 per month (formula: 25 · ${v} ＋ 15). How much will a member pay in total for <strong>4 months</strong> in euros?`,
      correctAnswer: '115',
      solution: locale === 'el'
        ? `25 · 4 ＋ 15 ＝ 100 ＋ 15 ＝ 115 €.`
        : `25 · 4 ＋ 15 ＝ 100 ＋ 15 ＝ €115.`,
    };
  },

  // Πρόβλημα 13: Παραγωγή εργοστασίου ανά ώρα
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΠΑΡΑΓΩΓΗ' : 'PROBLEMS: PRODUCTION',
      question: locale === 'el'
        ? `Μια μηχανή παράγει 40 τεμάχια την ώρα. Αν στην αρχή υπήρχαν ήδη 50 έτοιμα τεμάχια (τύπος: 40 · ${v} ＋ 50), πόσα τεμάχια θα υπάρχουν μετά από <strong>6 ώρες</strong>;`
        : `A machine produces 40 items per hour. If there were already 50 items initially (formula: 40 · ${v} ＋ 50), how many items will exist after <strong>6 hours</strong>?`,
      correctAnswer: '290',
      solution: locale === 'el'
        ? `40 · 6 ＋ 50 ＝ 240 ＋ 50 ＝ 290 τεμάχια.`
        : `40 · 6 ＋ 50 ＝ 240 ＋ 50 ＝ 290 items.`,
    };
  },

  // Πρόβλημα 14: Καθίσματα κινηματογράφου ανά σειρά
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΙΝΗΜΑΤΟΓΡΑΦΟΣ' : 'PROBLEMS: CINEMA',
      question: locale === 'el'
        ? `Η 1η σειρά μιας αίθουσας έχει 12 καθίσματα και κάθε επόμενη σειρά έχει 2 καθίσματα περισσότερα (τύπος: 2 · ${v} ＋ 10). Πόσα καθίσματα έχει η <strong>8η σειρά</strong>;`
        : `The 1st row of a hall has 12 seats and each subsequent row has 2 more seats (formula: 2 · ${v} ＋ 10). How many seats does the <strong>8th row</strong> have?`,
      correctAnswer: '26',
      solution: locale === 'el'
        ? `2 · 8 ＋ 10 ＝ 16 ＋ 10 ＝ 26 καθίσματα.`
        : `2 · 8 ＋ 10 ＝ 16 ＋ 10 ＝ 26 seats.`,
    };
  },

  // Πρόβλημα 15: Μήκος αναρριχητικού φυτού
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΗ' : 'PROBLEMS: NATURE',
      question: locale === 'el'
        ? `Ένα φυτό έχει αρχικό μήκος 30 cm και μεγαλώνει 5 cm κάθε εβδομάδα (τύπος: 5 · ${v} ＋ 30). Ποιο θα είναι το μήκος του σε εκατοστά μετά από <strong>8 εβδομάδες</strong>;`
        : `A plant has an initial length of 30 cm and grows 5 cm each week (formula: 5 · ${v} ＋ 30). What will be its length in centimeters after <strong>8 weeks</strong>?`,
      correctAnswer: '70',
      solution: locale === 'el'
        ? `5 · 8 ＋ 30 ＝ 40 ＋ 30 ＝ 70 cm.`
        : `5 · 8 ＋ 30 ＝ 40 ＋ 30 ＝ 70 cm.`,
    };
  },

  // Πρόβλημα 16: Στόχοι σκοποβολής
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΜΑΤΑ' : 'PROBLEMS: SPORTS',
      question: locale === 'el'
        ? `Σε ένα παιχνίδι σκοποβολής, κάθε εύστοχη βολή στη σειρά δίνει 10 πόντους παραπάνω από την προηγούμενη (τύπος: 10 · ${v}). Πόσους πόντους κερδίζει ο παίκτης στην <strong>9η συνεχόμενη εύστοχη βολή</strong>;`
        : `In a shooting game, each consecutive hit awards 10 more points than the previous one (formula: 10 · ${v}). How many points does the player score on the <strong>9th consecutive hit</strong>?`,
      correctAnswer: '90',
      solution: locale === 'el'
        ? `10 · 9 ＝ 90 πόντοι.`
        : `10 · 9 ＝ 90 points.`,
    };
  },

  // Πρόβλημα 17: Φόρτιση μπαταρίας
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ' : 'PROBLEMS: TECHNOLOGY',
      question: locale === 'el'
        ? `Ένα κινητό ξεκινά με 10% μπαταρία και φορτίζει με ρυθμό 3% ανά λεπτό (τύπος: 3 · ${v} ＋ 10). Σε τι ποσοστό (%) θα βρίσκεται μετά από <strong>20 λεπτά</strong>;`
        : `A phone starts at 10% battery and charges at 3% per minute (formula: 3 · ${v} ＋ 10). What percentage (%) will it reach after <strong>20 minutes</strong>?`,
      correctAnswer: '70',
      solution: locale === 'el'
        ? `3 · 20 ＋ 10 ＝ 60 ＋ 10 ＝ 70%.`
        : `3 · 20 ＋ 10 ＝ 60 ＋ 10 ＝ 70%.`,
    };
  },

  // Πρόβλημα 18: Κατανάλωση κεριού
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ' : 'PROBLEMS: MEASUREMENT',
      question: locale === 'el'
        ? `Ένα κερί ύψους 25 cm λιώνει κατά 2 cm για κάθε ώρα που καίει (τύπος: 25 － 2 · ${v}). Ποιο θα είναι το ύψος του σε εκατοστά μετά από <strong>7 ώρες</strong>;`
        : `A 25 cm tall candle melts by 2 cm for each hour it burns (formula: 25 － 2 · ${v}). What will be its height in cm after <strong>7 hours</strong>?`,
      correctAnswer: '11',
      solution: locale === 'el'
        ? `25 － 2 · 7 ＝ 25 － 14 ＝ 11 cm.`
        : `25 － 2 · 7 ＝ 25 － 14 ＝ 11 cm.`,
    };
  },

  // Πρόβλημα 19: Κόστος εκτύπωσης φωτογραφιών
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΦΩΤΟΓΡΑΦΙΑ' : 'PROBLEMS: PHOTOGRAPHY',
      question: locale === 'el'
        ? `Ένα φωτογραφείο χρεώνει 0,20 € ανά φωτογραφία συν 1 € για το άλμπουμ (τύπος: 0,2 · ${v} ＋ 1). Πόσο κοστίζει η εκτύπωση <strong>30 φωτογραφιών</strong> σε ευρώ;`
        : `A photo studio charges €0.20 per photo plus €1 for the album (formula: 0.2 · ${v} ＋ 1). How much does printing <strong>30 photos</strong> cost in euros?`,
      correctAnswer: '7',
      solution: locale === 'el'
        ? `0,2 · 30 ＋ 1 ＝ 6 ＋ 1 ＝ 7 €.`
        : `0.2 · 30 ＋ 1 ＝ 6 ＋ 1 ＝ €7.`,
    };
  },

  // Πρόβλημα 20: Δρομολόγια λεωφορείου
  (locale, v) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΔΡΟΜΟΛΟΓΙΑ' : 'PROBLEMS: TRANSPORTATION',
      question: locale === 'el'
        ? `Το 1ο λεωφορείο περνά στις 07:00 (0 λεπτά) και τα επόμενα ανά 15 λεπτά (τύπος: 15 · (${v} － 1)). Μετά από πόσα λεπτά από την έναρξη περνάει το <strong>5ο λεωφορείο</strong>;`
        : `The 1st bus passes at 07:00 (0 min) and subsequent ones every 15 min (formula: 15 · (${v} － 1)). After how many minutes from the start does the <strong>5th bus</strong> pass?`,
      correctAnswer: '60',
      solution: locale === 'el'
        ? `15 · (5 － 1) ＝ 15 · 4 ＝ 60 λεπτά.`
        : `15 · (5 － 1) ＝ 15 · 4 ＝ 60 minutes.`,
    };
  },
];

export default function AkolouthiaAsk() {
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
    // Επιτρέπουμε νούμερα, κόμμα, κάθετο για κλάσματα, μείον και μεταβλητή v/ν/n
    clean = clean.replace(/[^0-9,/,\-v,ν,n,*,+,^]/gi, '');

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
        .replace(/Ν/g, 'V')
        .replace(/N/g, 'V')
        .replace(/,/g, '.');

      let correctAns = q.correctAnswer
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/Ν/g, 'V')
        .replace(/N/g, 'V')
        .replace(/,/g, '.');

      userAns = userAns.replace(/^\+/, '');
      correctAns = correctAns.replace(/^\+/, '');

      if (userAns === correctAns) {
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
          href="/a-gymnasiou/25-akolouthia"
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
              const cleanUser = userAns
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/Ν/g, 'V')
                .replace(/N/g, 'V')
                .replace(/,/g, '.');

              const cleanCorrect = q.correctAnswer
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/Ν/g, 'V')
                .replace(/N/g, 'V')
                .replace(/,/g, '.');

              const isCorrect = isSubmitted && cleanUser === cleanCorrect;
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
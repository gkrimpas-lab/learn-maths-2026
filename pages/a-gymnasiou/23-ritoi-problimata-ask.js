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

// Helper για αυστηρά κατακόρυφη κλασματική μορφή σε HTML string (χωρίς οριζόντιο overflow)
const htmlFrac = (num, den, isNeg = false) => {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;
  const absNum = numStr.replace(/^-/, '');
  const absDen = denStr.replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">${
    hasMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col text-center align-middle"><span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${absNum}</span><span class="pt-0.5 px-0.5 sm:px-1 break-all">${absDen}</span></span></span>`;
};

// Συγκεντρωτικό λεξικό UI strings
const translations = {
  el: {
    pageTitle: "Ασκήσεις: Προβλήματα με Ρητούς Αριθμούς | Α' Γυμνασίου",
    pageDesc: "12 δυναμικές ασκήσεις και ρεαλιστικά προβλήματα στην επίλυση προβλημάτων με ρητούς αριθμούς για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    theoryBtn: "ΘΕΩΡΙΑ",
    chapterBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 21 • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Προβλήματα με Ρητούς Αριθμούς",
    mainSubtitle: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 μαθηματικής μοντελοποίησης και κλασματικών υπολογισμών ＋ 2 ρεαλιστικά πολυσύνθετα προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    wordProblemTag: "ΠΡΟΒΛΗΜΑ",
    inputPlaceholder: "π.χ. 60 ή －50 ή 5/6",
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
    pageTitle: "Exercises: Problem Solving with Rational Numbers | 7th Grade Math",
    pageDesc: "12 dynamic exercises and realistic word problems on solving problems with rational numbers for Grade 7.",
    backText: "7th Grade",
    theoryBtn: "THEORY",
    chapterBadge: "GRADE 7 • CHAPTER 21 • PRACTICE",
    mainTitle: "Problem Solving with Rational Numbers",
    mainSubtitle: "Solve the following 12 selected exercises (10 mathematical modeling and fraction calculations ＋ 2 realistic multi-step word problems). Click \"CHECK ANSWERS\" to see your score and step-by-step solutions.",
    wordProblemTag: "WORD PROBLEM",
    inputPlaceholder: "e.g. 60, -50 or 5/6",
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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΜΑΘΗΜΑΤΙΚΗΣ ΜΟΝΤΕΛΟΠΟΙΗΣΗΣ & ΥΠΟΛΟΓΙΣΜΩΝ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Υπολογισμός κλασματικού μέρους (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΚΛΑΣΜΑΤΙΚΟ ΜΕΡΟΣ' : 'FRACTIONAL PART',
      question: locale === 'el'
        ? `Υπολόγισε πόσα είναι τα ${htmlFrac(2, 5)} του αριθμού 150:`
        : `Calculate ${htmlFrac(2, 5)} of 150:`,
      correctAnswer: '60',
      solution: locale === 'el'
        ? `Πολλαπλασιάζουμε το ποσό με το κλάσμα: 150 · ${htmlFrac(2, 5)} ＝ ${htmlFrac('150 · 2', 5)} ＝ ${htmlFrac(300, 5)} ＝ 60.`
        : `Multiply the number by the fraction: 150 · ${htmlFrac(2, 5)} ＝ ${htmlFrac('150 · 2', 5)} ＝ ${htmlFrac(300, 5)} ＝ 60.`,
    };
  },

  // 2. Υπολογισμός υπολοίπου από κλάσμα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΠΟΛΟΙΠΟ ΠΟΣΟΥ' : 'REMAINING AMOUNT',
      question: locale === 'el'
        ? `Αν ξοδέψουμε τα ${htmlFrac(3, 4)} ενός ποσού 200 €, πόσα ευρώ απομένουν;`
        : `If you spend ${htmlFrac(3, 4)} of €200, how many euros are left?`,
      correctAnswer: '50',
      solution: locale === 'el'
        ? `Ξοδεύτηκαν: 200 · ${htmlFrac(3, 4)} ＝ 150 €. Υπόλοιπο: 200 － 150 ＝ 50 € (ή απευθείας 200 · ${htmlFrac(1, 4)} ＝ 50 €).`
        : `Spent: 200 · ${htmlFrac(3, 4)} ＝ €150. Remainder: 200 － 150 ＝ €50 (or directly 200 · ${htmlFrac(1, 4)} ＝ €50).`,
    };
  },

  // 3. Αντίστροφο πρόβλημα: Εύρεση αρχικού ποσού (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΤΙΣΤΡΟΦΗ ΠΟΡΕΙΑ' : 'REVERSE PROBLEM',
      question: locale === 'el'
        ? `Αν τα ${htmlFrac(2, 3)} ενός ποσού ισούνται με 40 €, ποιο είναι το αρχικό ποσό σε ευρώ;`
        : `If ${htmlFrac(2, 3)} of an amount equals €40, what is the initial amount in euros?`,
      correctAnswer: '60',
      solution: locale === 'el'
        ? `Διαιρούμε την ποσότητα με το κλάσμα: 40 : ${htmlFrac(2, 3)} ＝ 40 · ${htmlFrac(3, 2)} ＝ ${htmlFrac(120, 2)} ＝ 60 €.`
        : `Divide the quantity by the fraction: 40 : ${htmlFrac(2, 3)} ＝ 40 · ${htmlFrac(3, 2)} ＝ ${htmlFrac(120, 2)} ＝ €60.`,
    };
  },

  // 4. Οικονομικό ισοζύγιο με πρόσημα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΛΓΕΒΡΙΚΟ ΙΣΟΖΥΓΙΟ' : 'ALGEBRAIC BALANCE',
      question: locale === 'el'
        ? `Ένας λογαριασμός είχε 100 €. Κατατέθηκαν 50 €, πληρώθηκε λογαριασμός 80 € και αγοράστηκε είδος 30 €. Ποιο είναι το τελικό υπόλοιπο σε ευρώ;`
        : `An account had €100. €50 was deposited, a bill of €80 was paid, and an item was bought for €30. What is the final balance in euros?`,
      correctAnswer: '40',
      solution: locale === 'el'
        ? `100 ＋ 50 － 80 － 30 ＝ 150 － 110 ＝ 40 €. Ταμειακό πλεόνασμα: ＋40 €.`
        : `100 ＋ 50 － 80 － 30 ＝ 150 － 110 ＝ €40. Surplus: ＋€40.`,
    };
  },

  // 5. Αρνητικό ισοζύγιο (χρέος) (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΛΛΕΙΜΜΑ / ΧΡΕΟΣ' : 'DEFICIT / OVERDRAFT',
      question: locale === 'el'
        ? `Ένας τραπεζικός λογαριασμός είχε 30 € και έγινε ανάληψη 80 €. Ποιο είναι το νέο (αρνητικό) υπόλοιπο του λογαριασμού σε ευρώ;`
        : `A bank account had €30 and an €80 withdrawal was made. What is the new (negative) balance in euros?`,
      correctAnswer: '-50',
      solution: locale === 'el'
        ? `30 － 80 ＝ －50 €. Το αρνητικό πρόσημο δηλώνει χρέος/έλλειμμα 50 €.`
        : `30 － 80 ＝ －€50. The minus sign denotes a deficit of €50.`,
    };
  },

  // 6. Μεταβολή θερμοκρασίας (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΕΤΑΒΟΛΗ ΘΕΡΜΟΚΡΑΣΙΑΣ' : 'TEMPERATURE CHANGE',
      question: locale === 'el'
        ? `Το πρωί η θερμοκρασία ήταν －4 °C. Το μεσημέρι ανέβηκε κατά 7 °C και το βράδυ έπεσε κατά 5 °C. Ποια είναι η τελική θερμοκρασία σε °C;`
        : `In the morning the temperature was －4 °C. By noon it rose by 7 °C and in the evening it dropped by 5 °C. What is the final temperature in °C?`,
      correctAnswer: '-2',
      solution: locale === 'el'
        ? `(－4) ＋ 7 － 5 ＝ 3 － 5 ＝ －2 °C.`
        : `(－4) ＋ 7 － 5 ＝ 3 － 5 ＝ －2 °C.`,
    };
  },

  // 7. Υπολογισμός τελικής τιμής με έκπτωση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΚΠΤΩΣΗ & ΤΕΛΙΚΗ ΤΙΜΗ' : 'DISCOUNT & FINAL PRICE',
      question: locale === 'el'
        ? `Ένα παντελόνι κόστους 80 € πωλείται με έκπτωση ίση με το ${htmlFrac(1, 4)} της αρχικής τιμής. Ποια είναι η τελική τιμή πώλησης σε ευρώ;`
        : `A pair of trousers priced at €80 is sold with a discount equal to ${htmlFrac(1, 4)} of the original price. What is the final selling price in euros?`,
      correctAnswer: '60',
      solution: locale === 'el'
        ? `Έκπτωση: 80 · ${htmlFrac(1, 4)} ＝ 20 €. Τελική τιμή: 80 － 20 ＝ 60 €.`
        : `Discount: 80 · ${htmlFrac(1, 4)} ＝ €20. Final price: 80 － 20 ＝ €60.`,
    };
  },

  // 8. Υπολογισμός κλάσματος από δύο διαδοχικά έξοδα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΘΡΟΙΣΜΑ ΜΕΡΙΔΙΩΝ' : 'SUM OF SHARES',
      question: locale === 'el'
        ? `Ο Πέτρος ξόδεψε το ${htmlFrac(1, 2)} των χρημάτων του και στη συνέχεια το ${htmlFrac(1, 3)} των αρχικών χρημάτων του. Ποιο κλάσμα των χρημάτων του ξόδεψε συνολικά (σε ανάγωγο κλάσμα, π.χ. 5/6);`
        : `Peter spent ${htmlFrac(1, 2)} of his money and then ${htmlFrac(1, 3)} of his initial money. What fraction of his money did he spend in total (in irreducible form, e.g. 5/6)?`,
      correctAnswer: '5/6',
      solution: locale === 'el'
        ? `${htmlFrac(1, 2)} ＋ ${htmlFrac(1, 3)} ＝ ${htmlFrac(3, 6)} ＋ ${htmlFrac(2, 6)} ＝ ${htmlFrac(5, 6)}.`
        : `${htmlFrac(1, 2)} ＋ ${htmlFrac(1, 3)} ＝ ${htmlFrac(3, 6)} ＋ ${htmlFrac(2, 6)} ＝ ${htmlFrac(5, 6)}.`,
    };
  },

  // 9. Υπόλοιπο μετά από δύο κλασματικά έξοδα (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΚΛΑΣΜΑΤΙΚΟ ΥΠΟΛΟΙΠΟ' : 'FRACTIONAL REMAINDER',
      question: locale === 'el'
        ? `Αν από μια ποσότητα ξοδευτούν τα ${htmlFrac(5, 6)}, ποιο κλάσμα της αρχικής ποσότητας απομένει (π.χ. 1/6);`
        : `If ${htmlFrac(5, 6)} of a quantity is spent, what fraction of the original quantity remains (e.g. 1/6)?`,
      correctAnswer: '1/6',
      solution: locale === 'el'
        ? `1 － ${htmlFrac(5, 6)} ＝ ${htmlFrac(6, 6)} － ${htmlFrac(5, 6)} ＝ ${htmlFrac(1, 6)}.`
        : `1 － ${htmlFrac(5, 6)} ＝ ${htmlFrac(6, 6)} － ${htmlFrac(5, 6)} ＝ ${htmlFrac(1, 6)}.`,
    };
  },

  // 10. Θεωρία βημάτων επίλυσης (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Η προσεκτική κατανόηση του προβλήματος και ο εντοπισμός δεδομένων και ζητουμένων'
      : 'Carefully understanding the problem and identifying given data and goals';
    const wrongs = locale === 'el'
      ? [
          'Η άμεση εκτέλεση πράξεων με τους αριθμούς της εκφώνησης',
          'Η μαντεψιά του τελικού αποτελέσματος',
          'Η επιλογή της μεγαλύτερης δυνατής πράξης',
        ]
      : [
          'Immediately executing operations with given numbers',
          'Guessing the final result blindly',
          'Choosing the operation yielding the largest number',
        ];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΜΕΘΟΔΟΛΟΓΙΑ ΕΠΙΛΥΣΗΣ' : 'PROBLEM SOLVING METHOD',
      question: locale === 'el'
        ? `Ποιο είναι το πρώτο και θεμελιώδες στάδιο κατά την επίλυση ενός μαθηματικού προβλήματος;`
        : `What is the first and most fundamental step when solving any math problem?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Το 1ο βήμα είναι πάντοτε η κατανόηση της εκφώνησης, ώστε να διαχωρίσουμε τα γνωστά δεδομένα από το άγνωστο ζητούμενο.`
        : `Step 1 is always understanding the statement, distinguishing given data from unknown quantities.`,
    };
  },

  // 11. Υπολογισμός ποσού από ποσοστό δεκαδικού (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΔΕΚΑΔΙΚΟ ΠΟΣΟΣΤΟ' : 'DECIMAL PERCENTAGE',
      question: locale === 'el'
        ? `Υπολόγισε το 0,2 (δηλαδή το 20%) ενός ποσού 250 € σε ευρώ:`
        : `Calculate 0.2 (i.e. 20%) of an amount of €250 in euros:`,
      correctAnswer: '50',
      solution: locale === 'el'
        ? `250 · 0,2 ＝ 50 €.`
        : `250 · 0.2 ＝ €50.`,
    };
  },

  // 12. Αντίστροφη πορεία με δεκαδικό (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΤΙΣΤΡΟΦΗ ΜΕ ΔΕΚΑΔΙΚΟ' : 'INVERSE WITH DECIMAL',
      question: locale === 'el'
        ? `Αν το 0,5 (το μισό) ενός ποσού είναι 45 €, ποιο είναι ολόκληρο το αρχικό ποσό σε ευρώ;`
        : `If 0.5 (half) of an amount is €45, what is the whole original amount in euros?`,
      correctAnswer: '90',
      solution: locale === 'el'
        ? `45 : 0,5 ＝ 90 €.`
        : `45 : 0.5 ＝ €90.`,
    };
  },

  // 13. Διαφορά υψομέτρου και βάθους (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΨΟΜΕΤΡΑ & ΒΑΘΗ' : 'ELEVATION & DEPTH',
      question: locale === 'el'
        ? `Ένα σημείο βρίσκεται σε υψόμετρο ＋250 m και ένα υποθαλάσσιο σπήλαιο σε βάθος －50 m. Ποια είναι η υψομετρική απόστασή τους σε μέτρα (250 － (－50));`
        : `A location has an elevation of ＋250 m and an undersea cave has a depth of －50 m. What is their vertical distance in meters (250 － (－50))?`,
      correctAnswer: '300',
      solution: locale === 'el'
        ? `250 － (－50) ＝ 250 ＋ 50 ＝ 300 m.`
        : `250 － (－50) ＝ 250 ＋ 50 ＝ 300 m.`,
    };
  },

  // 14. Μοίρασμα ποσού σε ίσα μέρη (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΙΣΟΜΕΡΗΣ ΚΑΤΑΜΕΡΙΣΜΟΣ' : 'EQUAL SHARING',
      question: locale === 'el'
        ? `Ένα κέρδος 180 € μοιράζεται ισόποσα σε 4 συνεργάτες. Πόσα ευρώ αντιστοιχούν στον καθένα;`
        : `A profit of €180 is shared equally among 4 partners. How many euros does each person receive?`,
      correctAnswer: '45',
      solution: locale === 'el'
        ? `180 : 4 ＝ 45 € στον καθένα.`
        : `180 : 4 ＝ €45 each.`,
    };
  },

  // 15. Κλάσμα του υπολοίπου (MCQ)
  (locale) => {
    const correct = `${htmlFrac(1, 4)}`;
    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΚΛΑΣΜΑ ΤΟΥ ΥΠΟΛΟΙΠΟΥ' : 'FRACTION OF REMAINDER',
      question: locale === 'el'
        ? `Αν ξοδέψουμε το ${htmlFrac(1, 2)} ενός ποσού και μετά το ${htmlFrac(1, 2)} του υπολοίπου, ποιο κλάσμα του αρχικού ποσού απομένει;`
        : `If you spend ${htmlFrac(1, 2)} of an amount and then ${htmlFrac(1, 2)} of the remainder, what fraction of the original amount is left?`,
      options: makeUniqueOptions(correct, [
        `${htmlFrac(1, 2)}`,
        `${htmlFrac(0, 1)}`,
        `${htmlFrac(3, 4)}`,
      ]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Υπόλοιπο μετά το 1ο έξοδο: ${htmlFrac(1, 2)}. Το μισό του υπολοίπου: ${htmlFrac(1, 2)} · ${htmlFrac(1, 2)} ＝ ${htmlFrac(1, 4)}. Επομένως απομένει: ${htmlFrac(1, 2)} － ${htmlFrac(1, 4)} ＝ ${htmlFrac(1, 4)}.`
        : `Remainder after 1st expense: ${htmlFrac(1, 2)}. Half of remainder: ${htmlFrac(1, 2)} · ${htmlFrac(1, 2)} ＝ ${htmlFrac(1, 4)}. Remaining total: ${htmlFrac(1, 2)} － ${htmlFrac(1, 4)} ＝ ${htmlFrac(1, 4)}.`,
    };
  },

  // 16. Μέση τιμή μεταβολών (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΕΣΟΣ ΟΡΟΣ ΜΕΤΑΒΟΛΩΝ' : 'AVERAGE CHANGE',
      question: locale === 'el'
        ? `Σε τρεις διαδοχικές ημέρες η στάθμη του νερού μεταβλήθηκε κατά ＋4 cm, －2 cm και ＋1 cm. Ποια ήταν η μέση ημερήσια μεταβολή σε cm;`
        : `Over three consecutive days water level changed by ＋4 cm, －2 cm, and ＋1 cm. What was the average daily change in cm?`,
      correctAnswer: '1',
      solution: locale === 'el'
        ? `(4 ＋ (－2) ＋ 1) : 3 ＝ 3 : 3 ＝ 1 cm.`
        : `(4 ＋ (－2) ＋ 1) : 3 ＝ 3 : 3 ＝ 1 cm.`,
    };
  },

  // 17. Κόστος με επιπλέον χρέωση (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΠΙΒΑΡΥΝΣΗ ΠΟΣΟΣΤΟΥ' : 'SURCHARGE / PENALTY',
      question: locale === 'el'
        ? `Ένας λογαριασμός 50 € επιβαρύνθηκε με προσαύξηση ίση με το ${htmlFrac(1, 10)} της αξίας του. Πόσο είναι το τελικό πληρωτέο ποσό σε ευρώ;`
        : `A bill of €50 was subject to a surcharge equal to ${htmlFrac(1, 10)} of its value. What is the final payable amount in euros?`,
      correctAnswer: '55',
      solution: locale === 'el'
        ? `Επιβάρυνση: 50 · ${htmlFrac(1, 10)} ＝ 5 €. Τελικό ποσό: 50 ＋ 5 ＝ 55 €.`
        : `Surcharge: 50 · ${htmlFrac(1, 10)} ＝ €5. Final amount: 50 ＋ 5 ＝ €55.`,
    };
  },

  // 18. Αντίστροφο πρόβλημα με υπόλοιπο (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΥΡΕΣΗ ΑΠΟ ΤΟ ΥΠΟΛΟΙΠΟ' : 'INITIAL FROM REMAINDER',
      question: locale === 'el'
        ? `Ο Γιώργος ξόδεψε τα ${htmlFrac(3, 5)} των χρημάτων του και του περίσσεψαν 40 €. Πόσα χρήματα είχε αρχικά σε ευρώ;`
        : `George spent ${htmlFrac(3, 5)} of his money and had €40 left. How much money did he have initially in euros?`,
      correctAnswer: '100',
      solution: locale === 'el'
        ? `Του περίσσεψαν τα 1 － ${htmlFrac(3, 5)} ＝ ${htmlFrac(2, 5)}. Άρα: 40 : ${htmlFrac(2, 5)} ＝ 40 · ${htmlFrac(5, 2)} ＝ ${htmlFrac(200, 2)} ＝ 100 €.`
        : `He had 1 － ${htmlFrac(3, 5)} ＝ ${htmlFrac(2, 5)} left. Thus: 40 : ${htmlFrac(2, 5)} ＝ 40 · ${htmlFrac(5, 2)} ＝ ${htmlFrac(200, 2)} ＝ €100.`,
    };
  },

  // 19. Πολλαπλάσια μέρη (Input)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΜΕΡΙΔΙΟΥ' : 'SHARE CALCULATION',
      question: locale === 'el'
        ? `Υπολόγισε τα ${htmlFrac(3, 8)} του αριθμού 64:`
        : `Calculate ${htmlFrac(3, 8)} of 64:`,
      correctAnswer: '24',
      solution: locale === 'el'
        ? `64 · ${htmlFrac(3, 8)} ＝ ${htmlFrac('64 · 3', 8)} ＝ 8 · 3 ＝ 24.`
        : `64 · ${htmlFrac(3, 8)} ＝ ${htmlFrac('64 · 3', 8)} ＝ 8 · 3 ＝ 24.`,
    };
  },

  // 20. Έλεγχος λογικής αποτελέσματος (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Έχει γίνει μαθηματικό λάθος, γιατί το πλήθος των ανθρώπων είναι πάντοτε φυσικός ακέραιος αριθμός'
      : 'A calculation error occurred, because a headcount of people must always be a non-negative integer';
    const wrongs = locale === 'el'
      ? [
          'Το αποτέλεσμα είναι σωστό και αποδεκτό',
          'Σημαίνει ότι ένας μαθητής είναι μισός σε ύψος',
          'Στρογγυλοποιούμε υποχρεωτικά στο 24 χωρίς να ελέγξουμε τις πράξεις',
        ]
      : [
          'The result is completely normal and acceptable',
          'It means one student is half in height',
          'We must round down to 24 without checking operations',
        ];

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΕΛΕΓΧΟΣ ΛΟΓΙΚΗΣ' : 'PLAUSIBILITY CHECK',
      question: locale === 'el'
        ? `Αν σε ένα πρόβλημα υπολογισμού του αριθμού των μαθητών μιας τάξης βρούμε αποτέλεσμα 24,5 μαθητές, τι σημαίνει αυτό;`
        : `If a problem asks for the number of students in a classroom and yields 24.5 students, what does this indicate?`,
      options: makeUniqueOptions(correct, wrongs),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Στο 4ο στάδιο επίλυσης ελέγχουμε τη λογική του αποτελέσματος: μεγέθη όπως άνθρωποι, βιβλία κ.λπ. παίρνουν αποκλειστικά ακέραιες φυσικές τιμές.`
        : `In step 4 we verify plausibility: discrete quantities such as people or books must strictly be non-negative integers.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΣΥΝΘΕΤΑ ΠΡΟΒΛΗΜΑΤΑ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Διαχείριση μισθού και αποταμίευση
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΟΙΚΟΝΟΜΙΚΑ' : 'FINANCE',
      question: locale === 'el'
        ? `Ένας εργαζόμενος με μηνιαίο μισθό 1.200 € διαθέτει το ${htmlFrac(1, 3)} για ενοίκιο και το ${htmlFrac(1, 4)} για έξοδα διατροφής. Πόσα ευρώ του απομένουν για τις υπόλοιπες ανάγκες του;`
        : `An employee earning €1,200 monthly allocates ${htmlFrac(1, 3)} for rent and ${htmlFrac(1, 4)} for groceries. How many euros remain for other expenses?`,
      correctAnswer: '500',
      solution: locale === 'el'
        ? `Ενοίκιο: 1200 · ${htmlFrac(1, 3)} ＝ 400 €. Διατροφή: 1200 · ${htmlFrac(1, 4)} ＝ 300 €. Σύνολο εξόδων: 400 ＋ 300 ＝ 700 €. Απομένουν: 1200 － 700 ＝ 500 €.`
        : `Rent: 1200 · ${htmlFrac(1, 3)} ＝ €400. Food: 1200 · ${htmlFrac(1, 4)} ＝ €300. Total expenses: 400 ＋ 300 ＝ €700. Remaining: 1200 － 700 ＝ €500.`,
    };
  },

  // Πρόβλημα 2: Ταξίδι και κατανάλωση βενζίνης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΚΑΥΣΙΜΑ' : 'FUEL CONSUMPTION',
      question: locale === 'el'
        ? `Το ρεζερβουάρ ενός αυτοκινήτου χωράει 60 λίτρα βενζίνης. Στο πρώτο μέρος του ταξιδιού καταναλώθηκαν τα ${htmlFrac(2, 5)} του καυσίμου και στο δεύτερο μέρος τα ${htmlFrac(1, 3)} του αρχικού καυσίμου. Πόσα λίτρα βενζίνης απέμειναν;`
        : `A car's fuel tank holds 60 liters of petrol. On the first leg of a trip, ${htmlFrac(2, 5)} of the fuel was used, and on the second leg ${htmlFrac(1, 3)} of the initial fuel. How many liters of petrol remain?`,
      correctAnswer: '16',
      solution: locale === 'el'
        ? `1ο μέρος: 60 · ${htmlFrac(2, 5)} ＝ 24 L. 2ο μέρος: 60 · ${htmlFrac(1, 3)} ＝ 20 L. Καταναλώθηκαν: 24 ＋ 20 ＝ 44 L. Απομένουν: 60 － 44 ＝ 16 L.`
        : `Leg 1: 60 · ${htmlFrac(2, 5)} ＝ 24 L. Leg 2: 60 · ${htmlFrac(1, 3)} ＝ 20 L. Consumed: 24 ＋ 20 ＝ 44 L. Remaining: 60 － 44 ＝ 16 L.`,
    };
  },

  // Πρόβλημα 3: Διανομή βιβλίων σε σχολείο
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΧΟΛΕΙΟ' : 'SCHOOL LIBRARY',
      question: locale === 'el'
        ? `Μια σχολική βιβλιοθήκη παρέλαβε 240 νέα βιβλία. Τα ${htmlFrac(3, 8)} είναι λογοτεχνικά και τα ${htmlFrac(1, 4)} είναι επιστημονικά. Πόσα είναι τα υπόλοιπα βιβλία άλλων κατηγοριών;`
        : `A school library received 240 new books. ${htmlFrac(3, 8)} are literature and ${htmlFrac(1, 4)} are science. How many are the remaining books in other categories?`,
      correctAnswer: '90',
      solution: locale === 'el'
        ? `Λογοτεχνικά: 240 · ${htmlFrac(3, 8)} ＝ 90. Επιστημονικά: 240 · ${htmlFrac(1, 4)} ＝ 60. Σύνολο: 90 ＋ 60 ＝ 150. Υπόλοιπα: 240 － 150 ＝ 90 βιβλία.`
        : `Literature: 240 · ${htmlFrac(3, 8)} ＝ 90. Science: 240 · ${htmlFrac(1, 4)} ＝ 60. Subtotal: 90 ＋ 60 ＝ 150. Remaining: 240 － 150 ＝ 90 books.`,
    };
  },

  // Πρόβλημα 4: Αντίστροφο πρόβλημα με υπόλοιπο χρημάτων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΓΟΡΕΣ' : 'SHOPPING',
      question: locale === 'el'
        ? `Η Μαρία ξόδεψε τα ${htmlFrac(2, 5)} των χρημάτων της για ρούχα και το ${htmlFrac(1, 5)} για φαγητό. Αν της περίσσεψαν 80 €, πόσα χρήματα είχε αρχικά σε ευρώ;`
        : `Maria spent ${htmlFrac(2, 5)} of her money on clothes and ${htmlFrac(1, 5)} on food. If she had €80 left, how much money did she have initially in euros?`,
      correctAnswer: '200',
      solution: locale === 'el'
        ? `Ξόδεψε συνολικά: ${htmlFrac(2, 5)} ＋ ${htmlFrac(1, 5)} ＝ ${htmlFrac(3, 5)}. Της περίσσεψαν: 1 － ${htmlFrac(3, 5)} ＝ ${htmlFrac(2, 5)}. Αρχικό ποσό: 80 : ${htmlFrac(2, 5)} ＝ 80 · ${htmlFrac(5, 2)} ＝ ${htmlFrac(400, 2)} ＝ 200 €.`
        : `Total spent: ${htmlFrac(2, 5)} ＋ ${htmlFrac(1, 5)} ＝ ${htmlFrac(3, 5)}. Left: 1 － ${htmlFrac(3, 5)} ＝ ${htmlFrac(2, 5)}. Initial amount: 80 : ${htmlFrac(2, 5)} ＝ 80 · ${htmlFrac(5, 2)} ＝ ${htmlFrac(400, 2)} ＝ €200.`,
    };
  },

  // Πρόβλημα 5: Θερμοκρασιακές μεταβολές σε ορεινό καταφύγιο
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΚΑΙΡΟΣ' : 'WEATHER',
      question: locale === 'el'
        ? `Τα μεσάνυχτα η θερμοκρασία ήταν －6 °C. Μέχρι το μεσημέρι ανέβηκε κατά 11 °C και μέχρι το επόμενο βράδυ έπεσε κατά 8 °C. Ποια ήταν η τελική θερμοκρασία σε °C;`
        : `At midnight the temperature was －6 °C. By noon it rose by 11 °C and by the following night it dropped by 8 °C. What was the final temperature in °C?`,
      correctAnswer: '-3',
      solution: locale === 'el'
        ? `(－6) ＋ 11 － 8 ＝ 5 － 8 ＝ －3 °C.`
        : `(－6) ＋ 11 － 8 ＝ 5 － 8 ＝ －3 °C.`,
    };
  },

  // Πρόβλημα 6: Ποδηλατική διαδρομή
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΘΛΗΤΙΣΜΟΣ' : 'CYCLING',
      question: locale === 'el'
        ? `Μια ποδηλατική διαδρομή έχει συνολικό μήκος 45 km. Ένας αθλητής διένυσε τα ${htmlFrac(2, 3)} της διαδρομής, έκανε διάλειμμα και μετά διένυσε άλλα 10 km. Πόσα χιλιόμετρα του απομένουν για τον τερματισμό;`
        : `A cycling route has a total length of 45 km. A cyclist covered ${htmlFrac(2, 3)} of the route, took a break, and then covered another 10 km. How many kilometers remain to the finish line?`,
      correctAnswer: '5',
      solution: locale === 'el'
        ? `1ο μέρος: 45 · ${htmlFrac(2, 3)} ＝ 30 km. Συνολικά διένυσε: 30 ＋ 10 ＝ 40 km. Απομένουν: 45 － 40 ＝ 5 km.`
        : `Leg 1: 45 · ${htmlFrac(2, 3)} ＝ 30 km. Covered so far: 30 ＋ 10 ＝ 40 km. Remaining: 45 － 40 ＝ 5 km.`,
    };
  },

  // Πρόβλημα 7: Εισπράξεις και έξοδα καταστήματος
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΜΠΟΡΙΟ' : 'COMMERCE',
      question: locale === 'el'
        ? `Ένα κατάστημα ξεκίνησε την ημέρα με 150 € στο ταμείο. Είχε εισπράξεις 420 €, πλήρωσε προμηθευτή 280 € και λογαριασμό ρεύματος 90 €. Πόσα ευρώ έχει το ταμείο στο κλείσιμο;`
        : `A store started the day with €150 in the register. It made sales of €420, paid a supplier €280, and paid an electricity bill of €90. How many euros are in the register at closing?`,
      correctAnswer: '200',
      solution: locale === 'el'
        ? `150 ＋ 420 － 280 － 90 ＝ 570 － 370 ＝ 200 €.`
        : `150 ＋ 420 － 280 － 90 ＝ 570 － 370 ＝ €200.`,
    };
  },

  // Πρόβλημα 8: Μερίδιο χωραφιού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΓΕΩΡΓΙΑ' : 'AGRICULTURE',
      question: locale === 'el'
        ? `Ένα αγρόκτημα 60 στρεμμάτων καλλιεργείται ως εξής: το ${htmlFrac(1, 2)} με σιτάρι, το ${htmlFrac(1, 3)} με καλαμπόκι και τα υπόλοιπα στρέμματα με λαχανικά. Πόσα στρέμματα καταλαμβάνουν τα λαχανικά;`
        : `A 60-acre farm is cultivated as follows: ${htmlFrac(1, 2)} with wheat, ${htmlFrac(1, 3)} with corn, and the rest with vegetables. How many acres are planted with vegetables?`,
      correctAnswer: '10',
      solution: locale === 'el'
        ? `Σιτάρι: 60 · ${htmlFrac(1, 2)} ＝ 30 στρέμματα. Καλαμπόκι: 60 · ${htmlFrac(1, 3)} ＝ 20 στρέμματα. Λαχανικά: 60 － 30 － 20 ＝ 10 στρέμματα.`
        : `Wheat: 60 · ${htmlFrac(1, 2)} ＝ 30 acres. Corn: 60 · ${htmlFrac(1, 3)} ＝ 20 acres. Vegetables: 60 － 30 － 20 ＝ 10 acres.`,
    };
  },

  // Πρόβλημα 9: Κατασκευή συνταγής γλυκού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΤΑΓΕΣ' : 'RECIPES',
      question: locale === 'el'
        ? `Για ένα γλυκό χρειάζονται 1,5 kg αλεύρι. Αν έχουμε ένα σακουλάκι με ${htmlFrac(3, 4)} του κιλού και ένα άλλο με 0,5 kg, πόσα kg αλεύρι λείπουν ακόμα (γράψε δεκαδικό αριθμό);`
        : `A cake recipe requires 1.5 kg of flour. If you have one bag with ${htmlFrac(3, 4)} kg and another with 0.5 kg, how many kg of flour are still needed (enter decimal)?`,
      correctAnswer: '0,25',
      solution: locale === 'el'
        ? `Διαθέτουμε: ${htmlFrac(3, 4)} ＝ 0,75 kg και 0,5 kg, άρα σύνολο 1,25 kg. Λείπουν: 1,50 － 1,25 ＝ 0,25 kg (ή ${htmlFrac(1, 4)} kg).`
        : `Available: ${htmlFrac(3, 4)} ＝ 0.75 kg and 0.5 kg, total 1.25 kg. Needed: 1.50 － 1.25 ＝ 0.25 kg (or ${htmlFrac(1, 4)} kg).`,
    };
  },

  // Πρόβλημα 10: Καθαρή αξία με ΦΠΑ και έκπτωση
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΟΙΚΟΝΟΜΙΚΑ' : 'PURCHASES',
      question: locale === 'el'
        ? `Μια ηλεκτρική συσκευή αξίας 200 € πωλείται με έκπτωση 40 € αλλά επιβαρύνεται με έξοδα αποστολής 15 €. Πόσο θα πληρώσει τελικά ο αγοραστής σε ευρώ;`
        : `An appliance priced at €200 is on sale with a €40 discount, but delivery costs €15. How much will the customer pay in total in euros?`,
      correctAnswer: '175',
      solution: locale === 'el'
        ? `200 － 40 ＋ 15 ＝ 160 ＋ 15 ＝ 175 €.`
        : `200 － 40 ＋ 15 ＝ 160 ＋ 15 ＝ €175.`,
    };
  },

  // Πρόβλημα 11: Στάθμη νερού φράγματος
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΔΡΑΥΛΙΚΑ' : 'RESERVOIR LEVEL',
      question: locale === 'el'
        ? `Η στάθμη ενός φράγματος βρισκόταν στα ＋2,4 m πάνω από το κανονικό όριο. Μετά από ξηρασία υποχώρησε κατά 3,6 m. Σε ποιο επίπεδο σε σχέση με το όριο (αρνητικός αριθμός σε μέτρα) βρίσκεται τώρα;`
        : `The water level of a reservoir was ＋2.4 m above the standard mark. After a dry period it dropped by 3.6 m. At what level relative to the mark (negative number in meters) is it now?`,
      correctAnswer: '-1,2',
      solution: locale === 'el'
        ? `2,4 － 3,6 ＝ －1,2 m.`
        : `2.4 － 3.6 ＝ －1.2 m.`,
    };
  },

  // Πρόβλημα 12: Διανομή χρόνου σε διαγώνισμα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΧΡΟΝΟΣ' : 'EXAM TIME',
      question: locale === 'el'
        ? `Ένα διαγώνισμα διαρκεί 60 λεπτά. Ένας μαθητής αφιέρωσε το ${htmlFrac(1, 4)} του χρόνου στο 1ο θέμα, το ${htmlFrac(1, 3)} στο 2ο θέμα και 15 λεπτά στο 3ο θέμα. Πόσα λεπτά του έμειναν για τον τελικό έλεγχο;`
        : `An exam lasts 60 minutes. A student spent ${htmlFrac(1, 4)} of the time on question 1, ${htmlFrac(1, 3)} on question 2, and 15 minutes on question 3. How many minutes remained for review?`,
      correctAnswer: '10',
      solution: locale === 'el'
        ? `1ο θέμα: 60 · ${htmlFrac(1, 4)} ＝ 15 λεπτά. 2ο θέμα: 60 · ${htmlFrac(1, 3)} ＝ 20 λεπτά. 3ο θέμα: 15 λεπτά. Σύνολο χρόνου: 15 ＋ 20 ＋ 15 ＝ 50 λεπτά. Έλεγχος: 60 － 50 ＝ 10 λεπτά.`
        : `Q1: 60 · ${htmlFrac(1, 4)} ＝ 15 min. Q2: 60 · ${htmlFrac(1, 3)} ＝ 20 min. Q3: 15 min. Total used: 15 ＋ 20 ＋ 15 ＝ 50 min. Review: 60 － 50 ＝ 10 min.`,
    };
  },

  // Πρόβλημα 13: Κέρδος και ζημία μετοχών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΧΡΗΜΑΤΙΣΤΗΡΙΟ' : 'INVESTMENTS',
      question: locale === 'el'
        ? `Ένας επενδυτής είχε την 1η ημέρα κέρδος 120 €, τη 2η ημέρα ζημία 190 € και την 3η ημέρα κέρδος 40 €. Ποιο ήταν το συνολικό καθαρό αποτέλεσμα των 3 ημερών σε ευρώ (αρνητικός αριθμός αν είναι ζημία);`
        : `An investor gained €120 on day 1, lost €190 on day 2, and gained €40 on day 3. What was the net result over the 3 days in euros (negative number if loss)?`,
      correctAnswer: '-30',
      solution: locale === 'el'
        ? `120 － 190 ＋ 40 ＝ －70 ＋ 40 ＝ －30 € (καθαρή ζημία 30 €).`
        : `120 － 190 ＋ 40 ＝ －70 ＋ 40 ＝ －€30 (net loss of €30).`,
    };
  },

  // Πρόβλημα 14: Αποθήκευση λαδιού σε δοχεία
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΧΩΡΗΤΙΚΟΤΗΤΑ' : 'CAPACITY',
      question: locale === 'el'
        ? `Μια δεξαμενή είχε 180 λίτρα λάδι. Γεμίστηκαν 20 δοχεία των 5 λίτρων το καθένα και 15 δοχεία των 3 λίτρων το καθένα. Πόσα λίτρα λαδιού περίσσεψαν στη δεξαμενή;`
        : `A tank had 180 liters of olive oil. 20 containers of 5 liters each and 15 containers of 3 liters each were filled. How many liters of oil remained in the tank?`,
      correctAnswer: '35',
      solution: locale === 'el'
        ? `20 · 5 ＝ 100 L και 15 · 3 ＝ 45 L. Σύνολο που αφαιρέθηκε: 100 ＋ 45 ＝ 145 L. Περίσσεψαν: 180 － 145 ＝ 35 L.`
        : `20 · 5 ＝ 100 L and 15 · 3 ＝ 45 L. Total removed: 100 ＋ 45 ＝ 145 L. Left: 180 － 145 ＝ 35 L.`,
    };
  },

  // Πρόβλημα 15: Υπολειπόμενο κομμάτι σύρματος
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΚΑΤΑΣΚΕΥΕΣ' : 'MEASUREMENT',
      question: locale === 'el'
        ? `Από ένα ρολό σύρματος μήκους 50 μέτρων κόπηκαν 3 κομμάτια μήκους 8,5 μέτρων το καθένα και άλλα 2 κομμάτια μήκους 10 μέτρων το καθένα. Πόσα μέτρα σύρμα απομένουν;`
        : `From a 50-meter spool of wire, 3 pieces of 8.5 m each and 2 pieces of 10 m each were cut. How many meters of wire remain?`,
      correctAnswer: '4,5',
      solution: locale === 'el'
        ? `3 · 8,5 ＝ 25,5 m και 2 · 10 ＝ 20 m. Σύνολο κοπής: 25,5 ＋ 20 ＝ 45,5 m. Απομένουν: 50 － 45,5 ＝ 4,5 m.`
        : `3 · 8.5 ＝ 25.5 m and 2 · 10 ＝ 20 m. Total cut: 25.5 ＋ 20 ＝ 45.5 m. Remaining: 50 － 45.5 ＝ 4.5 m.`,
    };
  },

  // Πρόβλημα 16: Μερίδιο κληρονομιάς σε φιλανθρωπία
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΚΛΗΡΟΝΟΜΙΑ' : 'CHARITY SHARE',
      question: locale === 'el'
        ? `Ένα ποσό 50.000 € διανέμεται ως εξής: τα ${htmlFrac(3, 5)} στα παιδιά και το ${htmlFrac(1, 10)} σε φιλανθρωπικό ίδρυμα. Πόσα ευρώ δόθηκαν στο φιλανθρωπικό ίδρυμα;`
        : `An estate of €50,000 is distributed: ${htmlFrac(3, 5)} to the children and ${htmlFrac(1, 10)} to charity. How many euros were donated to charity?`,
      correctAnswer: '5000',
      solution: locale === 'el'
        ? `50.000 · ${htmlFrac(1, 10)} ＝ 5.000 €.`
        : `50,000 · ${htmlFrac(1, 10)} ＝ €5,000.`,
    };
  },

  // Πρόβλημα 17: Αποστράγγιση δεξαμενής
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΔΡΑΥΛΙΚΑ' : 'POOL DRAINAGE',
      question: locale === 'el'
        ? `Μια πισίνα περιέχει 120 κυβικά μέτρα νερό. Μια αντλία αδειάζει 15 κυβικά μέτρα την ώρα επί 6 ώρες. Πόσα κυβικά μέτρα νερό απομένουν στην πισίνα;`
        : `A swimming pool contains 120 cubic meters of water. A pump drains 15 cubic meters per hour for 6 hours. How many cubic meters of water remain in the pool?`,
      correctAnswer: '30',
      solution: locale === 'el'
        ? `Αδειάστηκαν: 6 · 15 ＝ 90 κυβικά μέτρα. Απομένουν: 120 － 90 ＝ 30 κυβικά μέτρα.`
        : `Drained: 6 · 15 ＝ 90 m³. Remaining: 120 － 90 ＝ 30 m³.`,
    };
  },

  // Πρόβλημα 18: Βάθος υποβρυχίου μετά από ελιγμούς
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΝΑΥΤΙΛΙΑ' : 'NAVIGATION',
      question: locale === 'el'
        ? `Ένα υποβρύχιο βρισκόταν σε βάθος 140 m (－140). Ανέβηκε κατά 45 m και στη συνέχεια καταδύθηκε κατά 25 m. Ποιο είναι το νέο του βάθος σε μέτρα (αρνητικός αριθμός);`
        : `A submarine was at a depth of 140 m (－140). It ascended by 45 m and then descended by 25 m. What is its new depth in meters (negative number)?`,
      correctAnswer: '-120',
      solution: locale === 'el'
        ? `(－140) ＋ 45 － 25 ＝ －95 － 25 ＝ －120 m (βάθος 120 μέτρα).`
        : `(－140) ＋ 45 － 25 ＝ －95 － 25 ＝ －120 m (depth of 120 meters).`,
    };
  },

  // Πρόβλημα 19: Κόστος εκδρομής ανά άτομο
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΚΔΡΟΜΕΣ' : 'EXCURSIONS',
      question: locale === 'el'
        ? `Το λεωφορείο για μια εκδρομή κοστίζει συνολικά 360 € και συμμετέχουν 20 μαθητές. Αν ο σύλλογος γονέων επιδοτεί τη συνολική δαπάνη με 60 €, πόσα ευρώ θα πληρώσει κάθε μαθητής;`
        : `A bus for a school trip costs €360 in total and 20 students participate. If the parents' association subsidizes the trip with €60, how much will each student pay in euros?`,
      correctAnswer: '15',
      solution: locale === 'el'
        ? `Καθαρό κόστος: 360 － 60 ＝ 300 €. Ανά μαθητή: 300 : 20 ＝ 15 €.`
        : `Net cost: 360 － 60 ＝ €300. Per student: 300 : 20 ＝ €15.`,
    };
  },

  // Πρόβλημα 20: Καταμέτρηση θερμίδων διατροφής
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΥΓΕΙΑ' : 'NUTRITION & FITNESS',
      question: locale === 'el'
        ? `Ένα ενεργειακό ποτό περιέχει 250 θερμίδες. Αν ένας αθλητής πιει τα ${htmlFrac(4, 5)} του μπουκαλιού και κάψει 300 θερμίδες στην προπόνηση, ποιο είναι το καθαρό ισοζύγιο θερμίδων (θερμίδες που πήρε μείον αυτές που έκαψε, αρνητικός αριθμός);`
        : `An energy drink contains 250 calories. If an athlete drinks ${htmlFrac(4, 5)} of the bottle and burns 300 calories during workout, what is the net calorie balance (calories in minus calories out, negative number)?`,
      correctAnswer: '-100',
      solution: locale === 'el'
        ? `Θερμίδες που έλαβε: 250 · ${htmlFrac(4, 5)} ＝ 200 θερμίδες. Ισοζύγιο: 200 － 300 ＝ －100 θερμίδες.`
        : `Calories consumed: 250 · ${htmlFrac(4, 5)} ＝ 200 calories. Balance: 200 － 300 ＝ －100 calories.`,
    };
  },
];

export default function RitoiProblimataAsk() {
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
    // Επιτρέπουμε νούμερα, κόμμα, κάθετο (για κλάσματα) και μείον
    clean = clean.replace(/[^0-9,/,-]/g, '');

    if (clean.includes('-')) {
      const parts = clean.split('-');
      clean = '-' + parts.join('').replace(/-/g, '');
    }

    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) return;
    const slashCount = (clean.match(/\//g) || []).length;
    if (slashCount > 1) return;
    if (clean.length > 12) return;

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
        .replace(/^\+/, '')
        .replace(/\./g, ',');

    const u = normalize(userRaw);
    const c = normalize(correctRaw);

    if (u === c) return true;

    // Έλεγχος δεκαδικών με αριθμητική ανοχή 0.05
    const uNum = parseFloat(u.replace(',', '.'));
    const cNum = parseFloat(c.replace(',', '.'));
    if (!isNaN(uNum) && !isNaN(cNum) && !u.includes('/') && !c.includes('/')) {
      return Math.abs(uNum - cNum) <= 0.05;
    }

    // Έλεγχος ισοδυναμίας κλασμάτων π.χ. 5/6
    if (u.includes('/') && c.includes('/')) {
      const [uN, uD] = u.split('/').map(Number);
      const [cN, cD] = c.split('/').map(Number);
      if (uD !== 0 && cD !== 0 && !isNaN(uN) && !isNaN(uD) && !isNaN(cN) && !isNaN(cD)) {
        return uN * cD === cN * uD;
      }
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
          href="/a-gymnasiou/23-ritoi-problimata"
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
                          maxLength={12}
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

                    {/* Feedback & Λύση (No-Giveaway: εμφανίζεται ΜΟΝΟ μετά την υποβολή) */}
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
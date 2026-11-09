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
    pageTitle: "Ασκήσεις: Ομώνυμα & Ετερώνυμα Κλάσματα | Α' Γυμνασίου",
    pageDesc: "12 δυναμικές ασκήσεις και προβλήματα στη μετατροπή ετερώνυμων σε ομώνυμα, τη σύγκριση και τη διάταξη ρητών για την Α' Γυμνασίου.",
    backText: "Α' Γυμνασίου",
    btnTheory: "ΘΕΩΡΙΑ",
    badgeChapter: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 13 • ΕΞΑΣΚΗΣΗ",
    titleMain: "Ομώνυμα & Ετερώνυμα Κλάσματα",
    descMain: "Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 υπολογισμοί/θεωρία μετατροπών και σύγκρισης ＋ 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.",
    badgeProblem: "ΠΡΟΒΛΗΜΑ",
    placeholderInput: "Απάντηση...",
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
    pageTitle: "Exercises: Like & Unlike Fractions | Grade 7",
    pageDesc: "12 dynamic exercises and word problems on converting unlike fractions to like, comparing, and ordering rationals.",
    backText: "Grade 7",
    btnTheory: "THEORY",
    badgeChapter: "GRADE 7 • CHAPTER 13 • PRACTICE",
    titleMain: "Like & Unlike Fractions",
    descMain: "Solve the following 12 selected exercises (10 calculation/theory questions ＋ 2 real-world word problems). Click «CHECK ANSWERS» to review your score and detailed solutions.",
    badgeProblem: "PROBLEM",
    placeholderInput: "Answer...",
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
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Εύρεση ΕΚΠ παρονομαστών για ομώνυμα (Input)
  (locale) => {
    const d1 = randInt(2, 6);
    let d2 = randInt(3, 8);
    while (d2 === d1) d2 = randInt(3, 8);
    const ans = lcm(d1, d2);
    const n1 = randInt(1, d1 - 1) || 1;
    const n2 = randInt(1, d2 - 1) || 1;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΚΟΙΝΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ' : 'COMMON DENOMINATOR',
      question: locale === 'el'
        ? `Ποιος είναι ο μικρότερος κοινός παρονομαστής (ΕΚΠ) για τα ετερώνυμα κλάσματα ${htmlFrac(n1, d1)} και ${htmlFrac(n2, d2)};`
        : `What is the least common denominator (LCM) for the unlike fractions ${htmlFrac(n1, d1)} and ${htmlFrac(n2, d2)}?`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Βρίσκουμε το Ελάχιστο Κοινό Πολλαπλάσιο των παρονομαστών: ΕΚΠ(${d1}, ${d2}) ＝ ${ans}.`
        : `Find the Least Common Multiple of the denominators: LCM(${d1}, ${d2}) ＝ ${ans}.`,
    };
  },

  // 2. Μετατροπή ετερώνυμου σε ομώνυμο (Input)
  (locale) => {
    const d1 = 3;
    const targetLcm = 12;
    const n1 = 2;
    const mult = targetLcm / d1; // 4
    const ans = n1 * mult; // 8
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΕΤΑΤΡΟΠΗ ΣΕ ΟΜΩΝΥΜΑ' : 'CONVERSION TO LIKE FRACTIONS',
      question: locale === 'el'
        ? `Αν μετατρέψουμε το κλάσμα ${htmlFrac(n1, d1)} σε ισοδύναμο με παρονομαστή το ${targetLcm}, ποιος είναι ο νέος αριθμητής;`
        : `If we convert the fraction ${htmlFrac(n1, d1)} to an equivalent fraction with denominator ${targetLcm}, what is the new numerator?`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Διαιρούμε τον νέο παρονομαστή με τον παλιό: ${targetLcm} : ${d1} ＝ ${mult}. Πολλαπλασιάζουμε τον αριθμητή: ${n1} · ${mult} ＝ ${ans}.`
        : `Divide the new denominator by the original: ${targetLcm} : ${d1} ＝ ${mult}. Multiply the numerator: ${n1} · ${mult} ＝ ${ans}.`,
    };
  },

  // 3. Σύγκριση θετικών ομώνυμων κλασμάτων (MCQ)
  (locale) => {
    const den = randInt(5, 11);
    const n1 = randInt(2, den - 2);
    const n2 = n1 + randInt(1, 2);
    const correct = `${htmlFrac(n1, den)} ＜ ${htmlFrac(n2, den)}`;
    const wrong1 = `${htmlFrac(n1, den)} ＞ ${htmlFrac(n2, den)}`;
    const wrong2 = `${htmlFrac(n1, den)} ＝ ${htmlFrac(n2, den)}`;
    const wrong3 = locale === 'el' ? 'Δεν συγκρίνονται' : 'Cannot be compared';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΓΚΡΙΣΗ ΟΜΩΝΥΜΩΝ' : 'COMPARING LIKE FRACTIONS',
      question: locale === 'el'
        ? `Ποια σχέση ισχύει μεταξύ των ομώνυμων κλασμάτων ${htmlFrac(n1, den)} και ${htmlFrac(n2, den)};`
        : `Which relationship holds between the like fractions ${htmlFrac(n1, den)} and ${htmlFrac(n2, den)}?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Στα ομώνυμα κλάσματα με θετικούς όρους, μεγαλύτερο είναι εκείνο με τον μεγαλύτερο αριθμητή. Επειδή ${n1} ＜ ${n2}, ισχύει ${htmlFrac(n1, den)} ＜ ${htmlFrac(n2, den)}.`
        : `For like fractions with positive terms, the one with the larger numerator is greater. Since ${n1} ＜ ${n2}, we have ${htmlFrac(n1, den)} ＜ ${htmlFrac(n2, den)}.`,
    };
  },

  // 4. Σύγκριση αρνητικών ομώνυμων κλασμάτων (MCQ)
  (locale) => {
    const den = randInt(4, 9);
    const n1 = 2;
    const n2 = 5;
    const correct = `${htmlFrac(-n1, den)} ＞ ${htmlFrac(-n2, den)}`;
    const wrong1 = `${htmlFrac(-n1, den)} ＜ ${htmlFrac(-n2, den)}`;
    const wrong2 = `${htmlFrac(-n1, den)} ＝ ${htmlFrac(-n2, den)}`;
    const wrong3 = locale === 'el' ? 'Είναι ίσα με το 0' : 'Both equal 0';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΓΚΡΙΣΗ ΑΡΝΗΤΙΚΩΝ' : 'COMPARING NEGATIVES',
      question: locale === 'el'
        ? `Ποια σχέση ισχύει μεταξύ των αρνητικών κλασμάτων ${htmlFrac(-n1, den)} και ${htmlFrac(-n2, den)};`
        : `Which inequality holds between the negative fractions ${htmlFrac(-n1, den)} and ${htmlFrac(-n2, den)}?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Στους αρνητικούς αριθμούς μεγαλύτερος είναι εκείνος που βρίσκεται πλησιέστερα στο 0 (έχει μικρότερη απόλυτη τιμή). Επειδή －${n1} ＞ －${n2}, ισχύει ${correct}.`
        : `For negative numbers, the number closer to 0 is greater (smaller absolute value). Since －${n1} ＞ －${n2}, it holds that ${correct}.`,
    };
  },

  // 5. Σύγκριση ετερώνυμων με κοινό αριθμητή (MCQ)
  (locale) => {
    const num = randInt(2, 5);
    const d1 = 3;
    const d2 = 7;
    const correct = `${htmlFrac(num, d1)} ＞ ${htmlFrac(num, d2)}`;
    const wrong1 = `${htmlFrac(num, d1)} ＜ ${htmlFrac(num, d2)}`;
    const wrong2 = `${htmlFrac(num, d1)} ＝ ${htmlFrac(num, d2)}`;
    const wrong3 = locale === 'el' ? 'Δεν μπορούμε να γνωρίζουμε' : 'Cannot be determined';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΙΔΙΟΙ ΑΡΙΘΜΗΤΕΣ' : 'SAME NUMERATOR',
      question: locale === 'el'
        ? `Ποια είναι η σωστή σύγκριση για τα κλάσματα ${htmlFrac(num, d1)} και ${htmlFrac(num, d2)};`
        : `What is the correct comparison between ${htmlFrac(num, d1)} and ${htmlFrac(num, d2)}?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Όταν δύο θετικά κλάσματα έχουν τον ίδιο αριθμητή, μεγαλύτερο είναι εκείνο με τον ΜΙΚΡΟΤΕΡΟ παρονομαστή (γιατί η μονάδα χωρίστηκε σε λιγότερα και άρα μεγαλύτερα κομμάτια).`
        : `When two positive fractions share the same numerator, the fraction with the SMALLER denominator is greater (the whole is divided into fewer, larger pieces).`,
    };
  },

  // 6. Απόλυτη τιμή αρνητικού κλάσματος (Input)
  (locale) => {
    const a = randInt(3, 7);
    const b = randInt(8, 12);
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΠΟΛΥΤΗ ΤΙΜΗ' : 'ABSOLUTE VALUE',
      question: locale === 'el'
        ? `Υπολόγισε την απόλυτη τιμή: |${htmlFrac(-a, b)}| (μορφή α/β):`
        : `Calculate the absolute value: |${htmlFrac(-a, b)}| (format a/b):`,
      correctAnswer: `${a}/${b}`,
      solution: locale === 'el'
        ? `Η απόλυτη τιμή είναι πάντοτε μη αρνητική: |${htmlFrac(-a, b)}| ＝ ${htmlFrac(a, b)}.`
        : `The absolute value is always non-negative: |${htmlFrac(-a, b)}| ＝ ${htmlFrac(a, b)}.`,
    };
  },

  // 7. Σύγκριση μέσω χιαστί γινομένων (Input: < ή > ή =)
  (locale) => {
    const a = 2;
    const b = 5;
    const c = 3;
    const d = 7;
    const p1 = a * d;
    const p2 = b * c;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΧΙΑΣΤΙ ΓΙΝΟΜΕΝΑ' : 'CROSS-PRODUCTS',
      question: locale === 'el'
        ? `Σύγκρινε τα κλάσματα ${htmlFrac(a, b)} και ${htmlFrac(c, d)}. Γράψε το σύμβολο < ή >:`
        : `Compare the fractions ${htmlFrac(a, b)} and ${htmlFrac(c, d)}. Enter the symbol < or >:`,
      correctAnswer: '<',
      solution: locale === 'el'
        ? `Υπολογίζουμε τα χιαστί γινόμενα: ${a} · ${d} ＝ ${p1} και ${b} · ${c} ＝ ${p2}. Επειδή ${p1} ＜ ${p2}, ισχύει ${htmlFrac(a, b)} ＜ ${htmlFrac(c, d)}.`
        : `Calculate cross-products: ${a} · ${d} ＝ ${p1} and ${b} · ${c} ＝ ${p2}. Since ${p1} ＜ ${p2}, we have ${htmlFrac(a, b)} ＜ ${htmlFrac(c, d)}.`,
    };
  },

  // 8. Σύγκριση θετικού με αρνητικό κλάσμα (MCQ)
  (locale) => {
    const a = randInt(1, 4);
    const b = randInt(5, 9);
    const c = randInt(2, 6);
    const d = randInt(3, 7);
    const correct = locale === 'el'
      ? `Το ${htmlFrac(a, b)} είναι μεγαλύτερο γιατί κάθε θετικός αριθμός είναι μεγαλύτερος από κάθε αρνητικό`
      : `${htmlFrac(a, b)} is greater because every positive number is greater than any negative number`;
    const wrong1 = locale === 'el' ? `Το ${htmlFrac(-c, d)} είναι μεγαλύτερο` : `${htmlFrac(-c, d)} is greater`;
    const wrong2 = locale === 'el' ? 'Είναι ίσα' : 'They are equal';
    const wrong3 = locale === 'el' ? 'Πρέπει πρώτα να γίνουν ομώνυμα για να αποφασίσουμε' : 'They must first be converted to like fractions';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΘΕΤΙΚΟΣ ΕΝΑΝΤΙ ΑΡΝΗΤΙΚΟΥ' : 'POSITIVE VS NEGATIVE',
      question: locale === 'el'
        ? `Ποιο κλάσμα είναι μεγαλύτερο μεταξύ του ${htmlFrac(a, b)} και του ${htmlFrac(-c, d)};`
        : `Which fraction is greater between ${htmlFrac(a, b)} and ${htmlFrac(-c, d)}?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Κάθε θετικός ρητός αριθμός είναι πάντα μεγαλύτερος από οποιονδήποτε αρνητικό ρητό αριθμό.`
        : `Any positive rational number is strictly greater than any negative rational number.`,
    };
  },

  // 9. Διάταξη τριών ομώνυμων κλασμάτων (MCQ)
  (locale) => {
    const den = 9;
    const correct = `${htmlFrac(-5, den)} ＜ ${htmlFrac(2, den)} ＜ ${htmlFrac(7, den)}`;
    const wrong1 = `${htmlFrac(7, den)} ＜ ${htmlFrac(2, den)} ＜ ${htmlFrac(-5, den)}`;
    const wrong2 = `${htmlFrac(-5, den)} ＜ ${htmlFrac(7, den)} ＜ ${htmlFrac(2, den)}`;
    const wrong3 = `${htmlFrac(2, den)} ＜ ${htmlFrac(-5, den)} ＜ ${htmlFrac(7, den)}`;

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΔΙΑΤΑΞΗ ΡΗΤΩΝ' : 'ORDERING RATIONALS',
      question: locale === 'el'
        ? `Ποια είναι η σωστή διάταξη από το μικρότερο προς το μεγαλύτερο για τα κλάσματα ${htmlFrac(2, den)}, ${htmlFrac(-5, den)} και ${htmlFrac(7, den)};`
        : `What is the correct ordering from least to greatest for ${htmlFrac(2, den)}, ${htmlFrac(-5, den)}, and ${htmlFrac(7, den)}?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Συγκρίνουμε τους αριθμητές: －5 ＜ 2 ＜ 7. Άρα: ${correct}.`
        : `Compare numerators: －5 ＜ 2 ＜ 7. Thus: ${correct}.`,
    };
  },

  // 10. Πότε δύο κλάσματα λέγονται ομώνυμα (MCQ)
  (locale) => {
    const correct = locale === 'el'
      ? 'Εκείνα που έχουν ακριβώς τον ίδιο παρονομαστή'
      : 'Fractions that have the exact same denominator';
    const wrong1 = locale === 'el' ? 'Εκείνα που έχουν τον ίδιο αριθμητή' : 'Fractions that share the same numerator';
    const wrong2 = locale === 'el' ? 'Εκείνα που έχουν ίση αριθμητική αξία' : 'Fractions that have equal value';
    const wrong3 = locale === 'el' ? 'Εκείνα που έχουν θετικούς όρους' : 'Fractions that have positive terms';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΘΕΩΡΙΑ ΟΜΩΝΥΜΩΝ' : 'THEORY OF LIKE FRACTIONS',
      question: locale === 'el'
        ? `Ποια κλάσματα ονομάζονται ομώνυμα;`
        : `Which fractions are called like fractions?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Ομώνυμα λέγονται τα κλάσματα που έχουν τον ίδιο παρονομαστή.`
        : `Like fractions are fractions that share the exact same denominator.`,
    };
  },

  // 11. Πολλαπλασιαστής μετατροπής σε ΕΚΠ (Input)
  (locale) => {
    const d1 = 6;
    const d2 = 8;
    const comLcm = 24;
    const mult = comLcm / d1; // 4
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΝΤΕΛΕΣΤΗΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ' : 'SCALE FACTOR',
      question: locale === 'el'
        ? `Με ποιον αριθμό πρέπει να πολλαπλασιάσουμε τους όρους του κλάσματος ${htmlFrac(5, d1)} ώστε να γίνει ομώνυμο με το ${htmlFrac(3, d2)} (κοινός παρονομαστής το ΕΚΠ ＝ ${comLcm});`
        : `By what number must we multiply both terms of ${htmlFrac(5, d1)} to make it a like fraction with ${htmlFrac(3, d2)} (common denominator LCM ＝ ${comLcm})?`,
      correctAnswer: mult.toString(),
      solution: locale === 'el'
        ? `Διαιρούμε το ΕΚΠ με τον παρονομαστή: ${comLcm} : ${d1} ＝ ${mult}.`
        : `Divide the LCM by the denominator: ${comLcm} : ${d1} ＝ ${mult}.`,
    };
  },

  // 12. Σύγκριση με το 1 (MCQ)
  (locale) => {
    const n = 7;
    const d = 5;
    const correct = `${htmlFrac(n, d)} ＞ 1`;
    const wrong1 = `${htmlFrac(n, d)} ＜ 1`;
    const wrong2 = `${htmlFrac(n, d)} ＝ 1`;
    const wrong3 = locale === 'el' ? 'Δεν συγκρίνονται' : 'Cannot be compared';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΓΚΡΙΣΗ ΜΕ ΤΗ ΜΟΝΑΔΑ' : 'COMPARING WITH 1',
      question: locale === 'el'
        ? `Ποια σχέση ισχύει μεταξύ του κλάσματος ${htmlFrac(n, d)} και του αριθμού 1;`
        : `Which relationship holds between the fraction ${htmlFrac(n, d)} and the number 1?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Όταν ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή (σε θετικό κλάσμα), το κλάσμα είναι καταχρηστικό και είναι μεγαλύτερο από τη μονάδα 1.`
        : `When the numerator is greater than the denominator (in a positive fraction), the improper fraction is strictly greater than 1.`,
    };
  },

  // 13. Σύγκριση αρνητικού με το -1 (MCQ)
  (locale) => {
    const n = 3;
    const d = 4;
    const correct = `${htmlFrac(-n, d)} ＞ －1`;
    const wrong1 = `${htmlFrac(-n, d)} ＜ －1`;
    const wrong2 = `${htmlFrac(-n, d)} ＝ －1`;
    const wrong3 = locale === 'el' ? 'Είναι θετικό' : 'It is positive';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΓΚΡΙΣΗ ΜΕ ΤΟ -1' : 'COMPARING WITH -1',
      question: locale === 'el'
        ? `Ποια σχέση ισχύει μεταξύ του αρνητικού κλάσματος ${htmlFrac(-n, d)} και του －1;`
        : `Which relationship holds between the negative fraction ${htmlFrac(-n, d)} and －1?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Επειδή |${htmlFrac(-n, d)}| ＝ 0,75 ＜ 1, ο αριθμός βρίσκεται δεξιότερα από το －1 στον άξονα, άρα είναι μεγαλύτερος από το －1.`
        : `Since |${htmlFrac(-n, d)}| ＝ 0.75 ＜ 1, the number lies to the right of －1 on the number line, making it greater than －1.`,
    };
  },

  // 14. Μετατροπή δύο ετερώνυμων σε ομώνυμα (Input: νέος αριθμητής 2ου κλάσματος)
  (locale) => {
    const d1 = 5;
    const d2 = 6;
    const comLcm = 30;
    const n2 = 4;
    const mult2 = comLcm / d2; // 5
    const ans = n2 * mult2; // 20
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΜΕΤΑΤΡΟΠΗ ΣΕ ΟΜΩΝΥΜΑ' : 'CONVERSION TO LIKE FRACTIONS',
      question: locale === 'el'
        ? `Μετατρέπουμε τα κλάσματα ${htmlFrac(2, d1)} και ${htmlFrac(n2, d2)} σε ομώνυμα με κοινό παρονομαστή το ${comLcm}. Ποιος είναι ο νέος αριθμητής του 2ου κλάσματος;`
        : `Converting ${htmlFrac(2, d1)} and ${htmlFrac(n2, d2)} to like fractions with common denominator ${comLcm}, what is the new numerator of the 2nd fraction?`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Πολλαπλασιάζουμε αριθμητή και παρονομαστή του 2ου κλάσματος με το ${mult2} (${comLcm} : ${d2} ＝ ${mult2}): ${n2} · ${mult2} ＝ ${ans}.`
        : `Multiply the numerator and denominator of the 2nd fraction by ${mult2} (${comLcm} : ${d2} ＝ ${mult2}): ${n2} · ${mult2} ＝ ${ans}.`,
    };
  },

  // 15. Σύγκριση απολύτων τιμών αρνητικών κλασμάτων (Input: < ή >)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΠΟΛΥΤΕΣ ΤΙΜΕΣ' : 'ABSOLUTE VALUES',
      question: locale === 'el'
        ? `Σύγκρινε τις απόλυτες τιμές: |${htmlFrac(-1, 2)}| και |${htmlFrac(-3, 4)}|. Γράψε το σύμβολο < ή >:`
        : `Compare the absolute values: |${htmlFrac(-1, 2)}| and |${htmlFrac(-3, 4)}|. Enter < or >:`,
      correctAnswer: '<',
      solution: locale === 'el'
        ? `|${htmlFrac(-1, 2)}| ＝ ${htmlFrac(1, 2)} ＝ ${htmlFrac(2, 4)} και |${htmlFrac(-3, 4)}| ＝ ${htmlFrac(3, 4)}. Επειδή ${htmlFrac(2, 4)} ＜ ${htmlFrac(3, 4)}, ισχύει ＜.`
        : `|${htmlFrac(-1, 2)}| ＝ ${htmlFrac(1, 2)} ＝ ${htmlFrac(2, 4)} and |${htmlFrac(-3, 4)}| ＝ ${htmlFrac(3, 4)}. Since ${htmlFrac(2, 4)} ＜ ${htmlFrac(3, 4)}, the answer is ＜.`,
    };
  },

  // 16. Σύγκριση ετερώνυμων με διαίρεση σε δεκαδικό (Input: < ή >)
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΣΥΓΚΡΙΣΗ ΚΛΑΣΜΑΤΩΝ' : 'COMPARING FRACTIONS',
      question: locale === 'el'
        ? `Σύγκρινε τα κλάσματα ${htmlFrac(1, 4)} και ${htmlFrac(2, 5)}. Γράψε το σύμβολο < ή >:`
        : `Compare the fractions ${htmlFrac(1, 4)} and ${htmlFrac(2, 5)}. Enter < or >:`,
      correctAnswer: '<',
      solution: locale === 'el'
        ? `${htmlFrac(1, 4)} ＝ 0,25 και ${htmlFrac(2, 5)} ＝ 0,40. Επειδή 0,25 ＜ 0,40, ισχύει ＜.`
        : `${htmlFrac(1, 4)} ＝ 0.25 and ${htmlFrac(2, 5)} ＝ 0.40. Since 0.25 ＜ 0.40, the answer is ＜.`,
    };
  },

  // 17. Αντίθετα ομώνυμα κλάσματα (Input)
  (locale) => {
    const n = randInt(2, 7);
    const d = 9;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΑΝΤΙΘΕΤΑ ΚΛΑΣΜΑΤΑ' : 'OPPOSITE FRACTIONS',
      question: locale === 'el'
        ? `Ποιο είναι το άθροισμα των αντίθετων ομώνυμων κλασμάτων ${htmlFrac(n, d)} και ${htmlFrac(-n, d)};`
        : `What is the sum of the opposite like fractions ${htmlFrac(n, d)} and ${htmlFrac(-n, d)}?`,
      correctAnswer: '0',
      solution: locale === 'el'
        ? `Το άθροισμα δύο αντίθετων ρητών αριθμών ισούται πάντοτε με 0.`
        : `The sum of two opposite rational numbers is always 0.`,
    };
  },

  // 18. Σύγκριση τριών αρνητικών (MCQ: ποιος είναι ο μικρότερος)
  (locale) => {
    const den = 12;
    const correct = htmlFrac(-7, den);
    const wrong1 = htmlFrac(-1, den);
    const wrong2 = htmlFrac(-5, den);
    const wrong3 = locale === 'el' ? 'Είναι όλα ίσα' : 'They are all equal';

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΜΙΚΡΟΤΕΡΟΣ ΑΡΝΗΤΙΚΟΣ' : 'SMALLEST NEGATIVE',
      question: locale === 'el'
        ? `Ποιο είναι το μικρότερο από τα κλάσματα ${htmlFrac(-1, den)}, ${htmlFrac(-5, den)} και ${htmlFrac(-7, den)};`
        : `Which is the smallest among ${htmlFrac(-1, den)}, ${htmlFrac(-5, den)}, and ${htmlFrac(-7, den)}?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Στους αρνητικούς αριθμούς μικρότερος είναι εκείνος με τη μεγαλύτερη απόλυτη τιμή (βρίσκεται πιο αριστερά στον άξονα): ${correct}.`
        : `Among negative numbers, the one with the largest absolute value is smallest (furthest left on the axis): ${correct}.`,
    };
  },

  // 19. ΕΚΠ διαδοχικών αριθμών ως παρονομαστών (Input)
  (locale) => {
    const ans = 20;
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΕΚΠ ΠΡΩΤΩΝ ΜΕΤΑΞΥ ΤΟΥΣ' : 'LCM OF COPRIME DENOMINATORS',
      question: locale === 'el'
        ? `Ποιος είναι ο κοινός παρονομαστής (ΕΚΠ) για κλάσματα με παρονομαστές 4 και 5;`
        : `What is the least common denominator (LCM) for fractions with denominators 4 and 5?`,
      correctAnswer: ans.toString(),
      solution: locale === 'el'
        ? `Επειδή οι αριθμοί 4 και 5 είναι πρώτοι μεταξύ τους (Μ.Κ.Δ. ＝ 1), το ΕΚΠ ισούται με το γινόμενό τους: 4 · 5 ＝ 20.`
        : `Since 4 and 5 are coprime (GCD ＝ 1), their LCM equals their product: 4 · 5 ＝ 20.`,
    };
  },

  // 20. Διάταξη κλασμάτων με το 0 (MCQ)
  (locale) => {
    const correct = `${htmlFrac(-3, 5)} ＜ 0 ＜ ${htmlFrac(2, 7)}`;
    const wrong1 = `0 ＜ ${htmlFrac(-3, 5)} ＜ ${htmlFrac(2, 7)}`;
    const wrong2 = `${htmlFrac(2, 7)} ＜ 0 ＜ ${htmlFrac(-3, 5)}`;
    const wrong3 = `${htmlFrac(-3, 5)} ＜ ${htmlFrac(2, 7)} ＜ 0`;

    return {
      type: 'mcq',
      topic: locale === 'el' ? 'ΣΥΓΚΡΙΣΗ ΜΕ ΤΟ ΜΗΔΕΝ' : 'COMPARISON WITH ZERO',
      question: locale === 'el'
        ? `Ποια είναι η σωστή σχέση διάταξης των αριθμών 0, ${htmlFrac(2, 7)} και ${htmlFrac(-3, 5)};`
        : `What is the correct ordering for 0, ${htmlFrac(2, 7)}, and ${htmlFrac(-3, 5)}?`,
      options: makeUniqueOptions(correct, [wrong1, wrong2, wrong3]),
      correctAnswer: correct,
      solution: locale === 'el'
        ? `Κάθε αρνητικός είναι μικρότερος από το 0 και το 0 είναι μικρότερο από κάθε θετικό: ${correct}.`
        : `Every negative number is less than 0, and 0 is less than any positive number: ${correct}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΣΥΓΚΡΙΣΗΣ ΚΑΙ ΜΕΤΑΤΡΟΠΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Κατανάλωση πίτσας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΓΚΡΙΣΗ' : 'WORD PROBLEMS: COMPARISON',
      question: locale === 'el'
        ? `Ο Νίκος έφαγε τα ${htmlFrac(3, 4)} μιας πίτσας και ο Κώστας έφαγε τα ${htmlFrac(5, 6)} μιας ίδιας πίτσας. Ποιος έφαγε περισσότερο; (Γράψε ΝΙΚΟΣ ή ΚΩΣΤΑΣ):`
        : `Nikos ate ${htmlFrac(3, 4)} of a pizza and Kostas ate ${htmlFrac(5, 6)} of an identical pizza. Who ate more? (Type NIKOS or KOSTAS):`,
      correctAnswer: locale === 'el' ? 'ΚΩΣΤΑΣ' : 'KOSTAS',
      solution: locale === 'el'
        ? `Κάνουμε τα κλάσματα ομώνυμα με ΕΚΠ(4, 6) ＝ 12: Νίκος ＝ ${htmlFrac(9, 12)}, Κώστας ＝ ${htmlFrac(10, 12)}. Επειδή ${htmlFrac(10, 12)} ＞ ${htmlFrac(9, 12)}, περισσότερο έφαγε ο Κώστας.`
        : `Convert to like fractions with LCM(4, 6) ＝ 12: Nikos ＝ ${htmlFrac(9, 12)}, Kostas ＝ ${htmlFrac(10, 12)}. Since ${htmlFrac(10, 12)} ＞ ${htmlFrac(9, 12)}, Kostas ate more.`,
    };
  },

  // Πρόβλημα 2: Χρόνος μελέτης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ' : 'WORD PROBLEMS: TIME',
      question: locale === 'el'
        ? `Η Μαρία διάβασε για τα ${htmlFrac(2, 3)} της ώρας και η Ελένη για τα ${htmlFrac(3, 5)} της ώρας. Ποια διάβασε περισσότερο χρόνο; (Γράψε ΜΑΡΙΑ ή ΕΛΕΝΗ):`
        : `Maria studied for ${htmlFrac(2, 3)} of an hour and Eleni for ${htmlFrac(3, 5)} of an hour. Who studied longer? (Type MARIA or ELENI):`,
      correctAnswer: locale === 'el' ? 'ΜΑΡΙΑ' : 'MARIA',
      solution: locale === 'el'
        ? `ΕΚΠ(3, 5) ＝ 15. Μαρία ＝ ${htmlFrac(10, 15)}, Ελένη ＝ ${htmlFrac(9, 15)}. Επειδή ${htmlFrac(10, 15)} ＞ ${htmlFrac(9, 15)}, περισσότερο διάβασε η Μαρία.`
        : `LCM(3, 5) ＝ 15. Maria ＝ ${htmlFrac(10, 15)}, Eleni ＝ ${htmlFrac(9, 15)}. Since ${htmlFrac(10, 15)} ＞ ${htmlFrac(9, 15)}, Maria studied longer.`,
    };
  },

  // Πρόβλημα 3: Διαδρομή αγώνα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΣΤΑΣΕΙΣ' : 'WORD PROBLEMS: DISTANCES',
      question: locale === 'el'
        ? `Ένας δρομέας κάλυψε τα ${htmlFrac(5, 8)} μιας διαδρομής και ένας άλλος τα ${htmlFrac(7, 12)}. Ποιος κάλυψε μεγαλύτερη απόσταση; (Γράψε 1ΟΣ ή 2ΟΣ):`
        : `A runner completed ${htmlFrac(5, 8)} of a race course and another finished ${htmlFrac(7, 12)}. Who covered a greater distance? (Type 1ST or 2ND):`,
      correctAnswer: locale === 'el' ? '1ΟΣ' : '1ST',
      solution: locale === 'el'
        ? `ΕΚΠ(8, 12) ＝ 24. 1ος ＝ ${htmlFrac(15, 24)}, 2ος ＝ ${htmlFrac(14, 24)}. Μεγαλύτερη απόσταση κάλυψε ο 1ος.`
        : `LCM(8, 12) ＝ 24. 1st ＝ ${htmlFrac(15, 24)}, 2nd ＝ ${htmlFrac(14, 24)}. The 1st runner covered greater distance.`,
    };
  },

  // Πρόβλημα 4: Επίδοση σε διαγώνισμα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ' : 'WORD PROBLEMS: GRADES',
      question: locale === 'el'
        ? `Στο τεστ μαθηματικών ο Αλέξανδρος πέτυχε τα ${htmlFrac(4, 5)} των βαθμών και ο Βασίλης τα ${htmlFrac(17, 20)}. Ποιος είχε υψηλότερη επίδοση; (Γράψε ΑΛΕΞΑΝΔΡΟΣ ή ΒΑΣΙΛΗΣ):`
        : `On a math test, Alexandros achieved ${htmlFrac(4, 5)} of the score and Vasilis scored ${htmlFrac(17, 20)}. Who performed higher? (Type ALEXANDROS or VASILIS):`,
      correctAnswer: locale === 'el' ? 'ΒΑΣΙΛΗΣ' : 'VASILIS',
      solution: locale === 'el'
        ? `Μετατρέπουμε σε παρονομαστή 20: Αλέξανδρος ＝ ${htmlFrac(16, 20)}, Βασίλης ＝ ${htmlFrac(17, 20)}. Υψηλότερη επίδοση είχε ο Βασίλης.`
        : `Convert to common denominator 20: Alexandros ＝ ${htmlFrac(16, 20)}, Vasilis ＝ ${htmlFrac(17, 20)}. Vasilis performed higher.`,
    };
  },

  // Πρόβλημα 5: Ποσότητα υγρού σε δοχείο
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ' : 'WORD PROBLEMS: CAPACITY',
      question: locale === 'el'
        ? `Το δοχείο Α περιέχει ${htmlFrac(3, 5)} του λίτρου χυμό και το δοχείο Β περιέχει ${htmlFrac(5, 8)} του λίτρου. Ποιο δοχείο έχει περισσότερο χυμό; (Γράψε Α ή Β):`
        : `Container A holds ${htmlFrac(3, 5)} L of juice and container B holds ${htmlFrac(5, 8)} L. Which container has more juice? (Type A or B):`,
      correctAnswer: locale === 'el' ? 'Β' : 'B',
      solution: locale === 'el'
        ? `Χιαστί γινόμενα: 3 · 8 ＝ 24 και 5 · 5 ＝ 25. Επειδή 24 ＜ 25, το δοχείο Β έχει περισσότερο χυμό.`
        : `Cross-products: 3 · 8 ＝ 24 and 5 · 5 ＝ 25. Since 24 ＜ 25, container B holds more juice.`,
    };
  },

  // Πρόβλημα 6: Στάθμη φόρτισης μπαταρίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ' : 'WORD PROBLEMS: TECHNOLOGY',
      question: locale === 'el'
        ? `Το tablet έχει μπαταρία ${htmlFrac(7, 10)} και το κινητό ${htmlFrac(3, 4)}. Ποια συσκευή έχει περισσότερη μπαταρία; (Γράψε TABLET ή ΚΙΝΗΤΟ):`
        : `A tablet's battery is at ${htmlFrac(7, 10)} and a phone's at ${htmlFrac(3, 4)}. Which device has more battery? (Type TABLET or PHONE):`,
      correctAnswer: locale === 'el' ? 'ΚΙΝΗΤΟ' : 'PHONE',
      solution: locale === 'el'
        ? `ΕΚΠ(10, 4) ＝ 20. Tablet ＝ ${htmlFrac(14, 20)}, Κινητό ＝ ${htmlFrac(15, 20)}. Περισσότερη μπαταρία έχει το κινητό.`
        : `LCM(10, 4) ＝ 20. Tablet ＝ ${htmlFrac(14, 20)}, Phone ＝ ${htmlFrac(15, 20)}. The phone has more battery charge.`,
    };
  },

  // Πρόβλημα 7: Ποσοστό κοριτσιών σε δύο τμήματα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΟΛΕΙΟ' : 'WORD PROBLEMS: SCHOOL',
      question: locale === 'el'
        ? `Στο τμήμα Α1 τα κορίτσια αποτελούν τα ${htmlFrac(1, 2)} των μαθητών, ενώ στο Α2 τα ${htmlFrac(4, 7)}. Σε ποιο τμήμα είναι μεγαλύτερο το ποσοστό των κοριτσιών; (Γράψε Α1 ή Α2):`
        : `In class A1 girls represent ${htmlFrac(1, 2)} of students, while in A2 they make up ${htmlFrac(4, 7)}. Which class has a higher proportion of girls? (Type A1 or A2):`,
      correctAnswer: 'Α2',
      solution: locale === 'el'
        ? `Χιαστί γινόμενα: 1 · 7 ＝ 7 και 2 · 4 ＝ 8. Επειδή 7 ＜ 8, μεγαλύτερο ποσοστό έχει το Α2.`
        : `Cross-products: 1 · 7 ＝ 7 and 2 · 4 ＝ 8. Since 7 ＜ 8, class A2 has a higher proportion.`,
    };
  },

  // Πρόβλημα 8: Αποταμίευση χαρτζιλικιού
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'WORD PROBLEMS: FINANCE',
      question: locale === 'el'
        ? `Ο Πέτρος αποταμίευσε τα ${htmlFrac(2, 5)} του χαρτζιλικιού του και η αδελφή του τα ${htmlFrac(3, 8)}. Ποιος αποταμίευσε μεγαλύτερο μέρος του ποσού; (Γράψε ΠΕΤΡΟΣ ή ΑΔΕΛΦΗ):`
        : `Petros saved ${htmlFrac(2, 5)} of his allowance and his sister saved ${htmlFrac(3, 8)}. Who saved a larger share? (Type PETROS or SISTER):`,
      correctAnswer: locale === 'el' ? 'ΠΕΤΡΟΣ' : 'PETROS',
      solution: locale === 'el'
        ? `Χιαστί: 2 · 8 ＝ 16 και 5 · 3 ＝ 15. Επειδή 16 ＞ 15, ο Πέτρος αποταμίευσε μεγαλύτερο μέρος.`
        : `Cross-products: 2 · 8 ＝ 16 and 5 · 3 ＝ 15. Since 16 ＞ 15, Petros saved a larger share.`,
    };
  },

  // Πρόβλημα 9: Δοσολογία ζάχαρης σε γλυκό
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΤΑΓΕΣ' : 'WORD PROBLEMS: RECIPES',
      question: locale === 'el'
        ? `Η συνταγή Α χρειάζεται ${htmlFrac(2, 3)} φλιτζανιού ζάχαρη, ενώ η συνταγή Β χρειάζεται ${htmlFrac(3, 4)}. Ποια συνταγή απαιτεί περισσότερη ζάχαρη; (Γράψε Α ή Β):`
        : `Recipe A calls for ${htmlFrac(2, 3)} cup of sugar, while recipe B calls for ${htmlFrac(3, 4)} cup. Which recipe requires more sugar? (Type A or B):`,
      correctAnswer: locale === 'el' ? 'Β' : 'B',
      solution: locale === 'el'
        ? `Ομώνυμα με ΕΚΠ 12: Α ＝ ${htmlFrac(8, 12)}, Β ＝ ${htmlFrac(9, 12)}. Περισσότερη ζάχαρη απαιτεί η συνταγή Β.`
        : `Like fractions with LCM 12: A ＝ ${htmlFrac(8, 12)}, B ＝ ${htmlFrac(9, 12)}. Recipe B requires more sugar.`,
    };
  },

  // Πρόβλημα 10: Ευστοχία σε πέναλτι
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ' : 'WORD PROBLEMS: SPORTS',
      question: locale === 'el'
        ? `Ο παίκτης Χ ευστόχησε στα ${htmlFrac(5, 6)} των σουτ και ο παίκτης Ψ στα ${htmlFrac(7, 9)}. Ποιος παίκτης είχε μεγαλύτερη ευστοχία; (Γράψε Χ ή Ψ):`
        : `Player X hit ${htmlFrac(5, 6)} of their shots and player Y hit ${htmlFrac(7, 9)}. Who had higher accuracy? (Type X or Y):`,
      correctAnswer: locale === 'el' ? 'Χ' : 'X',
      solution: locale === 'el'
        ? `ΕΚΠ(6, 9) ＝ 18. Παίκτης Χ ＝ ${htmlFrac(15, 18)}, Παίκτης Ψ ＝ ${htmlFrac(14, 18)}. Μεγαλύτερη ευστοχία είχε ο παίκτης Χ.`
        : `LCM(6, 9) ＝ 18. Player X ＝ ${htmlFrac(15, 18)}, Player Y ＝ ${htmlFrac(14, 18)}. Player X had higher accuracy.`,
    };
  },

  // Πρόβλημα 11: Σελίδες βιβλίου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΝΑΓΝΩΣΗ' : 'WORD PROBLEMS: READING',
      question: locale === 'el'
        ? `Ο Μάνος διάβασε τα ${htmlFrac(3, 8)} ενός βιβλίου και η Σοφία τα ${htmlFrac(2, 5)} του ίδιου βιβλίου. Ποιος διάβασε περισσότερες σελίδες; (Γράψε ΜΑΝΟΣ ή ΣΟΦΙΑ):`
        : `Manos read ${htmlFrac(3, 8)} of a book and Sofia read ${htmlFrac(2, 5)} of the same book. Who read more pages? (Type MANOS or SOFIA):`,
      correctAnswer: locale === 'el' ? 'ΣΟΦΙΑ' : 'SOFIA',
      solution: locale === 'el'
        ? `Χιαστί: 3 · 5 ＝ 15 και 8 · 2 ＝ 16. Επειδή 15 ＜ 16, περισσότερες σελίδες διάβασε η Σοφία.`
        : `Cross-products: 3 · 5 ＝ 15 and 8 · 2 ＝ 16. Since 15 ＜ 16, Sofia read more pages.`,
    };
  },

  // Πρόβλημα 12: Βάρος φρούτων
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ' : 'WORD PROBLEMS: SHOPPING',
      question: locale === 'el'
        ? `Μια σακούλα μήλα ζυγίζει ${htmlFrac(5, 4)} kg και μια σακούλα πορτοκάλια ζυγίζει ${htmlFrac(4, 3)} kg. Ποια σακούλα είναι βαρύτερη; (Γράψε ΜΗΛΑ ή ΠΟΡΤΟΚΑΛΙΑ):`
        : `A bag of apples weighs ${htmlFrac(5, 4)} kg and a bag of oranges weighs ${htmlFrac(4, 3)} kg. Which bag is heavier? (Type APPLES or ORANGES):`,
      correctAnswer: locale === 'el' ? 'ΠΟΡΤΟΚΑΛΙΑ' : 'ORANGES',
      solution: locale === 'el'
        ? `ΕΚΠ(4, 3) ＝ 12. Μήλα ＝ ${htmlFrac(15, 12)} kg, Πορτοκάλια ＝ ${htmlFrac(16, 12)} kg. Βαρύτερα είναι τα πορτοκάλια.`
        : `LCM(4, 3) ＝ 12. Apples ＝ ${htmlFrac(15, 12)} kg, Oranges ＝ ${htmlFrac(16, 12)} kg. The oranges are heavier.`,
    };
  },

  // Πρόβλημα 13: Κατανάλωση βενζίνης
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ' : 'WORD PROBLEMS: FUEL',
      question: locale === 'el'
        ? `Στη διαδρομή 1 καταναλώθηκαν τα ${htmlFrac(3, 7)} του ντεπόζιτου και στη διαδρομή 2 τα ${htmlFrac(4, 9)}. Σε ποια διαδρομή καταναλώθηκε περισσότερη βενζίνη; (Γράψε 1 ή 2):`
        : `Route 1 consumed ${htmlFrac(3, 7)} of the fuel tank and route 2 consumed ${htmlFrac(4, 9)}. On which route was more fuel consumed? (Type 1 or 2):`,
      correctAnswer: '2',
      solution: locale === 'el'
        ? `Χιαστί: 3 · 9 ＝ 27 και 7 · 4 ＝ 28. Επειδή 27 ＜ 28, στη διαδρομή 2 καταναλώθηκε περισσότερη βενζίνη.`
        : `Cross-products: 3 · 9 ＝ 27 and 7 · 4 ＝ 28. Since 27 ＜ 28, route 2 consumed more fuel.`,
    };
  },

  // Πρόβλημα 14: Έκπτωση καταστήματος
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ' : 'WORD PROBLEMS: FINANCE',
      question: locale === 'el'
        ? `Το κατάστημα Α κάνει έκπτωση ${htmlFrac(1, 3)} της τιμής και το κατάστημα Β κάνει έκπτωση ${htmlFrac(3, 10)}. Ποιο κατάστημα προσφέρει μεγαλύτερη έκπτωση; (Γράψε Α ή Β):`
        : `Store A gives a discount of ${htmlFrac(1, 3)} and store B offers ${htmlFrac(3, 10)}. Which store offers a larger discount? (Type A or B):`,
      correctAnswer: locale === 'el' ? 'Α' : 'A',
      solution: locale === 'el'
        ? `Χιαστί: 1 · 10 ＝ 10 και 3 · 3 ＝ 9. Επειδή 10 ＞ 9, μεγαλύτερη έκπτωση προσφέρει το κατάστημα Α.`
        : `Cross-products: 1 · 10 ＝ 10 and 3 · 3 ＝ 9. Since 10 ＞ 9, store A offers a larger discount.`,
    };
  },

  // Πρόβλημα 15: Μήκος υφάσματος
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ' : 'WORD PROBLEMS: MEASUREMENTS',
      question: locale === 'el'
        ? `Το ρετάλι 1 έχει μήκος ${htmlFrac(7, 8)} του μέτρου και το ρετάλι 2 έχει μήκος ${htmlFrac(9, 10)}. Ποιο ρετάλι είναι μακρύτερο; (Γράψε 1 ή 2):`
        : `Fabric piece 1 is ${htmlFrac(7, 8)} m long and piece 2 is ${htmlFrac(9, 10)} m long. Which piece is longer? (Type 1 or 2):`,
      correctAnswer: '2',
      solution: locale === 'el'
        ? `Χιαστί: 7 · 10 ＝ 70 και 8 · 9 ＝ 72. Επειδή 70 ＜ 72, μακρύτερο είναι το ρετάλι 2.`
        : `Cross-products: 7 · 10 ＝ 70 and 8 · 9 ＝ 72. Since 70 ＜ 72, piece 2 is longer.`,
    };
  },

  // Πρόβλημα 16: Μερίδιο οικοπέδου
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΚΙΝΗΤΑ' : 'WORD PROBLEMS: PROPERTY',
      question: locale === 'el'
        ? `Ο ιδιοκτήτης Α έχει μερίδιο ${htmlFrac(5, 12)} και ο ιδιοκτήτης Β έχει ${htmlFrac(7, 16)}. Ποιος έχει το μεγαλύτερο μερίδιο; (Γράψε Α ή Β):`
        : `Owner A holds a share of ${htmlFrac(5, 12)} and owner B holds ${htmlFrac(7, 16)}. Who has the larger share? (Type A or B):`,
      correctAnswer: locale === 'el' ? 'Β' : 'B',
      solution: locale === 'el'
        ? `ΕΚΠ(12, 16) ＝ 48. Α ＝ ${htmlFrac(20, 48)}, Β ＝ ${htmlFrac(21, 48)}. Μεγαλύτερο μερίδιο έχει ο Β.`
        : `LCM(12, 16) ＝ 48. A ＝ ${htmlFrac(20, 48)}, B ＝ ${htmlFrac(21, 48)}. Owner B holds the larger share.`,
    };
  },

  // Πρόβλημα 17: Ταχύτητα ολοκλήρωσης εργασίας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ' : 'WORD PROBLEMS: WORK',
      question: locale === 'el'
        ? `Σε μία ώρα ο εργάτης 1 τελείωσε τα ${htmlFrac(3, 10)} του έργου και ο εργάτης 2 τα ${htmlFrac(4, 15)}. Ποιος εργάτης προχώρησε ταχύτερα; (Γράψε 1 ή 2):`
        : `In one hour, worker 1 finished ${htmlFrac(3, 10)} of a task and worker 2 finished ${htmlFrac(4, 15)}. Who progressed faster? (Type 1 or 2):`,
      correctAnswer: '1',
      solution: locale === 'el'
        ? `ΕΚΠ(10, 15) ＝ 30. Εργάτης 1 ＝ ${htmlFrac(9, 30)}, Εργάτης 2 ＝ ${htmlFrac(8, 30)}. Ταχύτερα προχώρησε ο εργάτης 1.`
        : `LCM(10, 15) ＝ 30. Worker 1 ＝ ${htmlFrac(9, 30)}, Worker 2 ＝ ${htmlFrac(8, 30)}. Worker 1 progressed faster.`,
    };
  },

  // Πρόβλημα 18: Συγκομιδή ελιών
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΡΟΤΙΚΑ' : 'WORD PROBLEMS: HARVEST',
      question: locale === 'el'
        ? `Το κτήμα Α μάζεψε τα ${htmlFrac(5, 6)} της παραγωγής και το κτήμα Β τα ${htmlFrac(7, 8)}. Ποιο κτήμα μάζεψε μεγαλύτερο μέρος της παραγωγής του; (Γράψε Α ή Β):`
        : `Farm A harvested ${htmlFrac(5, 6)} of its crop and farm B harvested ${htmlFrac(7, 8)}. Which farm harvested a larger fraction? (Type A or B):`,
      correctAnswer: locale === 'el' ? 'Β' : 'B',
      solution: locale === 'el'
        ? `ΕΚΠ(6, 8) ＝ 24. Κτήμα Α ＝ ${htmlFrac(20, 24)}, Κτήμα Β ＝ ${htmlFrac(21, 24)}. Μεγαλύτερο μέρος μάζεψε το κτήμα Β.`
        : `LCM(6, 8) ＝ 24. Farm A ＝ ${htmlFrac(20, 24)}, Farm B ＝ ${htmlFrac(21, 24)}. Farm B harvested a larger share.`,
    };
  },

  // Πρόβλημα 19: Καθαρό ποσοστό χρυσού σε κόσμημα
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΚΟΣΜΗΜΑΤΑ' : 'WORD PROBLEMS: JEWELRY',
      question: locale === 'el'
        ? `Το κόσμημα 1 περιέχει ${htmlFrac(3, 4)} καθαρό χρυσό και το κόσμημα 2 περιέχει ${htmlFrac(17, 24)}. Ποιο κόσμημα έχει μεγαλύτερη αναλογία χρυσού; (Γράψε 1 ή 2):`
        : `Jewel 1 contains ${htmlFrac(3, 4)} pure gold and jewel 2 contains ${htmlFrac(17, 24)}. Which jewel has a higher gold ratio? (Type 1 or 2):`,
      correctAnswer: '1',
      solution: locale === 'el'
        ? `Μετατρέπουμε σε παρονομαστή 24: Κόσμημα 1 ＝ ${htmlFrac(18, 24)}, Κόσμημα 2 ＝ ${htmlFrac(17, 24)}. Μεγαλύτερη αναλογία έχει το κόσμημα 1.`
        : `Convert to common denominator 24: Jewel 1 ＝ ${htmlFrac(18, 24)}, Jewel 2 ＝ ${htmlFrac(17, 24)}. Jewel 1 has a higher gold ratio.`,
    };
  },

  // Πρόβλημα 20: Πλήρωση πισίνας
  (locale) => {
    return {
      type: 'input',
      topic: locale === 'el' ? 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ' : 'WORD PROBLEMS: CAPACITY',
      question: locale === 'el'
        ? `Η βρύση Α γέμισε τα ${htmlFrac(4, 7)} της πισίνας και η βρύση Β τα ${htmlFrac(5, 9)}. Ποια βρύση έριξε περισσότερο νερό; (Γράψε Α ή Β):`
        : `Tap A filled ${htmlFrac(4, 7)} of a pool and tap B filled ${htmlFrac(5, 9)}. Which tap poured more water? (Type A or B):`,
      correctAnswer: locale === 'el' ? 'Α' : 'A',
      solution: locale === 'el'
        ? `Χιαστί: 4 · 9 ＝ 36 και 7 · 5 ＝ 35. Επειδή 36 ＞ 35, η βρύση Α έριξε περισσότερο νερό.`
        : `Cross-products: 4 · 9 ＝ 36 and 7 · 5 ＝ 35. Since 36 ＞ 35, tap A poured more water.`,
    };
  },
];

export default function OmonimaEteronimaAsk() {
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

    // Επιτρέπουμε γράμματα, αριθμούς, <, >, /, κόμμα, τελεία και μείον
    clean = clean.replace(/[^0-9,/.-A-Za-zΑ-Ωα-ωά-ώΆ-Ώ<>]/g, '');

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

      // Ενοποίηση συμβόλων ανισότητας
      const normUser = userAns.replace(/＞/g, '>').replace(/＜/g, '<').replace(/＝/g, '=').replace(',', '.');
      const normCorrect = correctAns.replace(/＞/g, '>').replace(/＜/g, '<').replace(/＝/g, '=').replace(',', '.');

      // Normalization για κείμενα (αφαίρεση τόνων)
      const cleanU = normUser.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const cleanC = normCorrect.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if (userAns === correctAns || normUser === normCorrect || cleanU === cleanC) {
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
          href="/a-gymnasiou/15-omonima-eteronima-klasmata"
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

              const normUser = cleanUser.replace(/＞/g, '>').replace(/＜/g, '<').replace(/＝/g, '=').replace(',', '.');
              const normCorrect = cleanCorrect.replace(/＞/g, '>').replace(/＜/g, '<').replace(/＝/g, '=').replace(',', '.');
              const cleanU = normUser.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
              const cleanC = normCorrect.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

              const numU = parseFloat(normUser);
              const numC = parseFloat(normCorrect);
              const isNumericClose = !isNaN(numU) && !isNaN(numC) && !cleanUser.includes('/') && !cleanCorrect.includes('/') && Math.abs(numU - numC) <= 0.05;

              const isCorrect = isSubmitted && (cleanUser === cleanCorrect || normUser === normCorrect || cleanU === cleanC || isNumericClose);
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
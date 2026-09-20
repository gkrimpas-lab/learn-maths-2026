import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
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

// Helper για αυθεντική κλασματική γραφή σε HTML string με πρόσημο μπροστά από τη γραμμή
const htmlFrac = (num, den, isNeg = false) => {
  const numericNeg = (typeof num === 'number' && num < 0) || (typeof den === 'number' && den < 0);
  const showMinus = isNeg || numericNeg;
  const absNum = typeof num === 'number' ? Math.abs(num) : num.toString().replace(/^-/, '');
  const absDen = typeof den === 'number' ? Math.abs(den) : den.toString().replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-1 font-mono">${
    showMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="border-b-2 border-current px-1 pb-0.5">${absNum}</span><span class="px-1 pt-0.5">${absDen}</span></span></span>`;
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Εύρεση ΕΚΠ παρονομαστών για ομώνυμα (Input)
  () => {
    const d1 = randInt(2, 6);
    let d2 = randInt(3, 8);
    while (d2 === d1) d2 = randInt(3, 8);
    const ans = lcm(d1, d2);
    const n1 = randInt(1, d1 - 1) || 1;
    const n2 = randInt(1, d2 - 1) || 1;
    return {
      type: 'input',
      topic: 'ΚΟΙΝΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ',
      question: `Ποιος είναι ο μικρότερος κοινός παρονομαστής (ΕΚΠ) για τα ετερώνυμα κλάσματα ${htmlFrac(n1, d1)} και ${htmlFrac(n2, d2)};`,
      correctAnswer: ans.toString(),
      solution: `Βρίσκουμε το Ελάχιστο Κοινό Πολλαπλάσιο των παρονομαστών: ΕΚΠ(${d1}, ${d2}) ＝ ${ans}.`,
    };
  },

  // 2. Μετατροπή ετερώνυμου σε ομώνυμο (Input)
  () => {
    const d1 = 3;
    const d2 = 4;
    const targetLcm = 12;
    const n1 = 2;
    const mult = targetLcm / d1; // 4
    const ans = n1 * mult; // 8
    return {
      type: 'input',
      topic: 'ΜΕΤΑΤΡΟΠΗ ΣΕ ΟΜΩΝΥΜΑ',
      question: `Αν μετατρέψουμε το κλάσμα ${htmlFrac(n1, d1)} σε ισοδύναμο με παρονομαστή το ${targetLcm}, ποιος είναι ο νέος αριθμητής;`,
      correctAnswer: ans.toString(),
      solution: `Διαιρούμε τον νέο παρονομαστή με τον παλιό: ${targetLcm} ： ${d1} ＝ ${mult}. Πολλαπλασιάζουμε τον αριθμητή: ${n1} · ${mult} ＝ ${ans}.`,
    };
  },

  // 3. Σύγκριση θετικών ομώνυμων κλασμάτων (MCQ)
  () => {
    const den = randInt(5, 11);
    const n1 = randInt(2, den - 2);
    const n2 = n1 + randInt(1, 2);
    const correct = `${htmlFrac(n1, den)} ＜ ${htmlFrac(n2, den)}`;
    return {
      type: 'mcq',
      topic: 'ΣΥΓΚΡΙΣΗ ΟΜΩΝΥΜΩΝ',
      question: `Ποια σχέση ισχύει μεταξύ των ομώνυμων κλασμάτων ${htmlFrac(n1, den)} και ${htmlFrac(n2, den)};`,
      options: makeUniqueOptions(correct, [
        `${htmlFrac(n1, den)} ＞ ${htmlFrac(n2, den)}`,
        `${htmlFrac(n1, den)} ＝ ${htmlFrac(n2, den)}`,
        'Δεν συγκρίνονται',
      ]),
      correctAnswer: correct,
      solution: `Στα ομώνυμα κλάσματα με θετικούς όρους, μεγαλύτερο είναι εκείνο με τον μεγαλύτερο αριθμητή. Επειδή ${n1} ＜ ${n2}, ισχύει ${htmlFrac(n1, den)} ＜ ${htmlFrac(n2, den)}.`,
    };
  },

  // 4. Σύγκριση αρνητικών ομώνυμων κλασμάτων (MCQ)
  () => {
    const den = randInt(4, 9);
    const n1 = 2;
    const n2 = 5;
    // -2/den > -5/den
    const correct = `${htmlFrac(-n1, den)} ＞ ${htmlFrac(-n2, den)}`;
    return {
      type: 'mcq',
      topic: 'ΣΥΓΚΡΙΣΗ ΑΡΝΗΤΙΚΩΝ',
      question: `Ποια σχέση ισχύει μεταξύ των αρνητικών κλασμάτων ${htmlFrac(-n1, den)} και ${htmlFrac(-n2, den)};`,
      options: makeUniqueOptions(correct, [
        `${htmlFrac(-n1, den)} ＜ ${htmlFrac(-n2, den)}`,
        `${htmlFrac(-n1, den)} ＝ ${htmlFrac(-n2, den)}`,
        'Είναι ίσα με το 0',
      ]),
      correctAnswer: correct,
      solution: `Στους αρνητικούς αριθμούς μεγαλύτερος είναι εκείνος που βρίσκεται πλησιέστερα στο 0 (έχει μικρότερη απόλυτη τιμή). Επειδή －${n1} ＞ －${n2}, ισχύει ${correct}.`,
    };
  },

  // 5. Σύγκριση ετερώνυμων με κοινό αριθμητή (MCQ)
  () => {
    const num = randInt(2, 5);
    const d1 = 3;
    const d2 = 7;
    // num/3 > num/7
    const correct = `${htmlFrac(num, d1)} ＞ ${htmlFrac(num, d2)}`;
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΙ ΑΡΙΘΜΗΤΕΣ',
      question: `Ποια είναι η σωστή σύγκριση για τα κλάσματα ${htmlFrac(num, d1)} και ${htmlFrac(num, d2)};`,
      options: makeUniqueOptions(correct, [
        `${htmlFrac(num, d1)} ＜ ${htmlFrac(num, d2)}`,
        `${htmlFrac(num, d1)} ＝ ${htmlFrac(num, d2)}`,
        'Δεν μπορούμε να γνωρίζουμε',
      ]),
      correctAnswer: correct,
      solution: `Όταν δύο θετικά κλάσματα έχουν τον ίδιο αριθμητή, μεγαλύτερο είναι εκείνο με τον ΜΙΚΡΟΤΕΡΟ παρονομαστή (γιατί η μονάδα χωρίστηκε σε λιγότερα και άρα μεγαλύτερα κομμάτια).`,
    };
  },

  // 6. Απόλυτη τιμή αρνητικού κλάσματος (Input)
  () => {
    const a = randInt(3, 7);
    const b = randInt(8, 12);
    return {
      type: 'input',
      topic: 'ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question: `Υπολόγισε την απόλυτη τιμή: |${htmlFrac(-a, b)}| (μορφή α/β):`,
      correctAnswer: `${a}/${b}`,
      solution: `Η απόλυτη τιμή είναι πάντοτε μη αρνητική: |${htmlFrac(-a, b)}| ＝ ${htmlFrac(a, b)}.`,
    };
  },

  // 7. Σύγκριση μέσω χιαστί γινομένων (Input: < ή > ή =)
  () => {
    const a = 2;
    const b = 5;
    const c = 3;
    const d = 7;
    // 2*7 = 14 < 5*3 = 15 => 2/5 < 3/7
    return {
      type: 'input',
      topic: 'ΧΙΑΣΤΙ ΓΙΝΟΜΕΝΑ',
      question: `Σύγκρινε τα κλάσματα ${htmlFrac(a, b)} και ${htmlFrac(c, d)}. Γράψε το σύμβολο < ή >:`,
      correctAnswer: '<',
      solution: `Υπολογίζουμε τα χιαστί γινόμενα: ${a} · ${d} ＝ ${a * d} και ${b} · ${c} ＝ ${b * c}. Επειδή ${a * d} ＜ ${b * c}, ισχύει ${htmlFrac(a, b)} ＜ ${htmlFrac(c, d)}.`,
    };
  },

  // 8. Σύγκριση θετικού με αρνητικό κλάσμα (MCQ)
  () => {
    const a = randInt(1, 4);
    const b = randInt(5, 9);
    const c = randInt(2, 6);
    const d = randInt(3, 7);
    const correct = `${htmlFrac(a, b)} ＞ ${htmlFrac(-c, d)}`;
    return {
      type: 'mcq',
      topic: 'ΘΕΤΙΚΟΣ ΕΝΑΝΤΙ ΑΡΝΗΤΙΚΟΥ',
      question: `Ποιο κλάσμα είναι μεγαλύτερο μεταξύ του ${htmlFrac(a, b)} και του ${htmlFrac(-c, d)};`,
      options: makeUniqueOptions(
        `Το ${htmlFrac(a, b)} είναι μεγαλύτερο γιατί κάθε θετικός αριθμός είναι μεγαλύτερος από κάθε αρνητικό`,
        [
          `Το ${htmlFrac(-c, d)} είναι μεγαλύτερο`,
          'Είναι ίσα',
          'Πρέπει πρώτα να γίνουν ομώνυμα για να αποφασίσουμε',
        ]
      ),
      correctAnswer: `Το ${htmlFrac(a, b)} είναι μεγαλύτερο γιατί κάθε θετικός αριθμός είναι μεγαλύτερος από κάθε αρνητικό`,
      solution: `Κάθε θετικός ρητός αριθμός είναι πάντα μεγαλύτερος από οποιονδήποτε αρνητικό ρητό αριθμό.`,
    };
  },

  // 9. Διάταξη τριών ομώνυμων κλασμάτων (MCQ)
  () => {
    const den = 9;
    const correct = `${htmlFrac(-5, den)} ＜ ${htmlFrac(2, den)} ＜ ${htmlFrac(7, den)}`;
    return {
      type: 'mcq',
      topic: 'ΔΙΑΤΑΞΗ ΡΗΤΩΝ',
      question: `Ποια είναι η σωστή διάταξη από το μικρότερο προς το μεγαλύτερο για τα κλάσματα ${htmlFrac(2, den)}, ${htmlFrac(-5, den)} και ${htmlFrac(7, den)};`,
      options: makeUniqueOptions(correct, [
        `${htmlFrac(7, den)} ＜ ${htmlFrac(2, den)} ＜ ${htmlFrac(-5, den)}`,
        `${htmlFrac(-5, den)} ＜ ${htmlFrac(7, den)} ＜ ${htmlFrac(2, den)}`,
        `${htmlFrac(2, den)} ＜ ${htmlFrac(-5, den)} ＜ ${htmlFrac(7, den)}`,
      ]),
      correctAnswer: correct,
      solution: `Συγκρίνουμε τους αριθμητές: －5 ＜ 2 ＜ 7. Άρα: ${correct}.`,
    };
  },

  // 10. Πότε δύο κλάσματα λέγονται ομώνυμα (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΟΜΩΝΥΜΩΝ',
      question: `Ποια κλάσματα ονομάζονται ομώνυμα;`,
      options: makeUniqueOptions(
        'Εκείνα που έχουν ακριβώς τον ίδιο παρονομαστή',
        [
          'Εκείνα που έχουν τον ίδιο αριθμητή',
          'Εκείνα που έχουν ίση αριθμητική αξία',
          'Εκείνα που έχουν θετικούς όρους',
        ]
      ),
      correctAnswer: 'Εκείνα που έχουν ακριβώς τον ίδιο παρονομαστή',
      solution: `Ομώνυμα (ίδιο όνομα/παρονομαστής) λέγονται τα κλάσματα που έχουν τον ίδιο παρονομαστή.`,
    };
  },

  // 11. Πολλαπλασιαστής μετατροπής σε ΕΚΠ (Input)
  () => {
    const d1 = 6;
    const d2 = 8;
    const comLcm = 24;
    const mult = comLcm / d1; // 4
    return {
      type: 'input',
      topic: 'ΣΥΝΤΕΛΕΣΤΗΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ',
      question: `Με ποιον αριθμό πρέπει να πολλαπλασιάσουμε τους όρους του κλάσματος ${htmlFrac(5, d1)} ώστε να γίνει ομώνυμο με το ${htmlFrac(3, d2)} (κοινός παρονομαστής το ΕΚΠ ＝ ${comLcm});`,
      correctAnswer: mult.toString(),
      solution: `Διαιρούμε το ΕΚΠ με τον παρονομαστή: ${comLcm} ： ${d1} ＝ ${mult}.`,
    };
  },

  // 12. Σύγκριση με το 1 (MCQ)
  () => {
    const n = 7;
    const d = 5;
    return {
      type: 'mcq',
      topic: 'ΣΥΓΚΡΙΣΗ ΜΕ ΤΗ ΜΟΝΑΔΑ',
      question: `Ποια σχέση ισχύει μεταξύ του κλάσματος ${htmlFrac(n, d)} και του αριθμού 1;`,
      options: makeUniqueOptions(
        `${htmlFrac(n, d)} ＞ 1`,
        [`${htmlFrac(n, d)} ＜ 1`, `${htmlFrac(n, d)} ＝ 1`, 'Δεν συγκρίνονται']
      ),
      correctAnswer: `${htmlFrac(n, d)} ＞ 1`,
      solution: `Όταν ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή (σε θετικό κλάσμα), το κλάσμα είναι καταχρηστικό και είναι μεγαλύτερο από τη μονάδα 1.`,
    };
  },

  // 13. Σύγκριση αρνητικού με το -1 (MCQ)
  () => {
    const n = 3;
    const d = 4;
    // -3/4 > -1
    return {
      type: 'mcq',
      topic: 'ΣΥΓΚΡΙΣΗ ΜΕ ΤΟ -1',
      question: `Ποια σχέση ισχύει μεταξύ του αρνητικού κλάσματος ${htmlFrac(-n, d)} και του －1;`,
      options: makeUniqueOptions(
        `${htmlFrac(-n, d)} ＞ －1`,
        [`${htmlFrac(-n, d)} ＜ －1`, `${htmlFrac(-n, d)} ＝ －1`, 'Είναι θετικό']
      ),
      correctAnswer: `${htmlFrac(-n, d)} ＞ －1`,
      solution: `Επειδή |${htmlFrac(-n, d)}| ＝ 0,75 ＜ 1, ο αριθμός βρίσκεται δεξιότερα από το －1 στον άξονα, άρα είναι μεγαλύτερος από το －1.`,
    };
  },

  // 14. Μετατροπή δύο ετερώνυμων σε ομώνυμα (Input: νέος αριθμητής 2ου κλάσματος)
  () => {
    const d1 = 5;
    const d2 = 6;
    const comLcm = 30;
    const n2 = 4;
    const mult2 = comLcm / d2; // 5
    const ans = n2 * mult2; // 20
    return {
      type: 'input',
      topic: 'ΜΕΤΑΤΡΟΠΗ ΣΕ ΟΜΩΝΥΜΑ',
      question: `Μετατρέπουμε τα κλάσματα ${htmlFrac(2, d1)} και ${htmlFrac(n2, d2)} σε ομώνυμα με κοινό παρονομαστή το ${comLcm}. Ποιος είναι ο νέος αριθμητής του 2ου κλάσματος;`,
      correctAnswer: ans.toString(),
      solution: `Πολλαπλασιάζουμε αριθμητή και παρονομαστή του 2ου κλάσματος με το ${mult2} (${comLcm} ： ${d2} ＝ ${mult2}): ${n2} · ${mult2} ＝ ${ans}.`,
    };
  },

  // 15. Σύγκριση απολύτων τιμών αρνητικών κλασμάτων (Input: < ή >)
  () => {
    // |-1/2| = 1/2 = 0.5, |-3/4| = 3/4 = 0.75 => |-1/2| < |-3/4|
    return {
      type: 'input',
      topic: 'ΑΠΟΛΥΤΕΣ ΤΙΜΕΣ',
      question: `Σύγκρινε τις απόλυτες τιμές: |${htmlFrac(-1, 2)}| και |${htmlFrac(-3, 4)}|. Γράψε το σύμβολο < ή >:`,
      correctAnswer: '<',
      solution: `|${htmlFrac(-1, 2)}| ＝ ${htmlFrac(1, 2)} ＝ ${htmlFrac(2, 4)} και |${htmlFrac(-3, 4)}| ＝ ${htmlFrac(3, 4)}. Επειδή 2/4 ＜ 3/4, ισχύει ＜.`,
    };
  },

  // 16. Σύγκριση ετερώνυμων με διαίρεση σε δεκαδικό (Input: < ή >)
  () => {
    // 1/4 = 0.25, 2/5 = 0.40 => 1/4 < 2/5
    return {
      type: 'input',
      topic: 'ΣΥΓΚΡΙΣΗ ΚΛΑΣΜΑΤΩΝ',
      question: `Σύγκρινε τα κλάσματα ${htmlFrac(1, 4)} και ${htmlFrac(2, 5)}. Γράψε το σύμβολο < ή >:`,
      correctAnswer: '<',
      solution: `${htmlFrac(1, 4)} ＝ 0,25 και ${htmlFrac(2, 5)} ＝ 0,40. Επειδή 0,25 ＜ 0,40, ισχύει ＜.`,
    };
  },

  // 17. Αντίθετα ομώνυμα κλάσματα (Input)
  () => {
    const n = randInt(2, 7);
    const d = 9;
    return {
      type: 'input',
      topic: 'ΑΝΤΙΘΕΤΑ ΚΛΑΣΜΑΤΑ',
      question: `Ποιο είναι το άθροισμα των αντίθετων ομώνυμων κλασμάτων ${htmlFrac(n, d)} και ${htmlFrac(-n, d)};`,
      correctAnswer: '0',
      solution: `Το άθροισμα δύο αντίθετων ρητών αριθμών ισούται πάντοτε με 0.`,
    };
  },

  // 18. Σύγκριση τριών αρνητικών (MCQ: ποιος είναι ο μικρότερος)
  () => {
    const den = 12;
    const correct = htmlFrac(-7, den);
    return {
      type: 'mcq',
      topic: 'ΜΙΚΡΟΤΕΡΟΣ ΑΡΝΗΤΙΚΟΣ',
      question: `Ποιο είναι το μικρότερο από τα κλάσματα ${htmlFrac(-1, den)}, ${htmlFrac(-5, den)} και ${htmlFrac(-7, den)};`,
      options: makeUniqueOptions(correct, [
        htmlFrac(-1, den),
        htmlFrac(-5, den),
        'Είναι όλα ίσα',
      ]),
      correctAnswer: correct,
      solution: `Στους αρνητικούς αριθμούς μικρότερος είναι εκείνος με τη μεγαλύτερη απόλυτη τιμή (βρίσκεται πιο αριστερά στον άξονα): ${correct}.`,
    };
  },

  // 19. ΕΚΠ διαδοχικών αριθμών ως παρονομαστών (Input)
  () => {
    const d1 = 4;
    const d2 = 5;
    const ans = 20;
    return {
      type: 'input',
      topic: 'ΕΚΠ ΠΡΩΤΩΝ ΜΕΤΑΞΥ ΤΟΥΣ',
      question: `Ποιος είναι ο κοινός παρονομαστής (ΕΚΠ) για κλάσματα με παρονομαστές 4 και 5;`,
      correctAnswer: ans.toString(),
      solution: `Επειδή οι αριθμοί 4 και 5 είναι πρώτοι μεταξύ τους (ΜΚΔ ＝ 1), το ΕΚΠ ισούται με το γινόμενό τους: 4 · 5 ＝ 20.`,
    };
  },

  // 20. Διάταξη κλασμάτων με το 0 (MCQ)
  () => {
    const correct = `${htmlFrac(-3, 5)} ＜ 0 ＜ ${htmlFrac(2, 7)}`;
    return {
      type: 'mcq',
      topic: 'ΣΥΓΚΡΙΣΗ ΜΕ ΤΟ ΜΗΔΕΝ',
      question: `Ποια είναι η σωστή σχέση διάταξης των αριθμών 0, ${htmlFrac(2, 7)} και ${htmlFrac(-3, 5)};`,
      options: makeUniqueOptions(correct, [
        `0 ＜ ${htmlFrac(-3, 5)} ＜ ${htmlFrac(2, 7)}`,
        `${htmlFrac(2, 7)} ＜ 0 ＜ ${htmlFrac(-3, 5)}`,
        `${htmlFrac(-3, 5)} ＜ ${htmlFrac(2, 7)} ＜ 0`,
      ]),
      correctAnswer: correct,
      solution: `Κάθε αρνητικός είναι μικρότερος από το 0 και το 0 είναι μικρότερο από κάθε θετικό: ${correct}.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΣΥΓΚΡΙΣΗΣ ΚΑΙ ΜΕΤΑΤΡΟΠΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Κατανάλωση πίτσας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΓΚΡΙΣΗ',
      question: `Ο Νίκος έφαγε τα ${htmlFrac(3, 4)} μιας πίτσας και ο Κώστας έφαγε τα ${htmlFrac(5, 6)} μιας ίδιας πίτσας. Ποιος έφαγε περισσότερο; (Γράψε ΝΙΚΟΣ ή ΚΩΣΤΑΣ):`,
      correctAnswer: 'ΚΩΣΤΑΣ',
      solution: `Κάνουμε τα κλάσματα ομώνυμα με ΕΚΠ(4, 6) ＝ 12: Νίκος ＝ ${htmlFrac(9, 12)}, Κώστας ＝ ${htmlFrac(10, 12)}. Επειδή 10/12 ＞ 9/12, περισσότερο έφαγε ο Κώστας.`,
    };
  },

  // Πρόβλημα 2: Χρόνος μελέτης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question: `Η Μαρία διάβασε για τα ${htmlFrac(2, 3)} της ώρας και η Ελένη για τα ${htmlFrac(3, 5)} της ώρας. Ποια διάβασε περισσότερο χρόνο; (Γράψε ΜΑΡΙΑ ή ΕΛΕΝΗ):`,
      correctAnswer: 'ΜΑΡΙΑ',
      solution: `ΕΚΠ(3, 5) ＝ 15. Μαρία ＝ ${htmlFrac(10, 15)}, Ελένη ＝ ${htmlFrac(9, 15)}. Επειδή 10/15 ＞ 9/15, περισσότερο διάβασε η Μαρία.`,
    };
  },

  // Πρόβλημα 3: Διαδρομή αγώνα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΣΤΑΣΕΙΣ',
      question: `Ένας δρομέας κάλυψε τα ${htmlFrac(5, 8)} μιας διαδρομής και ένας άλλος τα ${htmlFrac(7, 12)}. Ποιος κάλυψε μεγαλύτερη απόσταση; (Γράψε 1ΟΣ ή 2ΟΣ):`,
      correctAnswer: '1ΟΣ',
      solution: `ΕΚΠ(8, 12) ＝ 24. 1ος ＝ ${htmlFrac(15, 24)}, 2ος ＝ ${htmlFrac(14, 24)}. Μεγαλύτερη απόσταση κάλυψε ο 1ος.`,
    };
  },

  // Πρόβλημα 4: Επίδοση σε διαγώνισμα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question: `Στο τεστ μαθηματικών ο Αλέξανδρος πέτυχε τα ${htmlFrac(4, 5)} των βαθμών και ο Βασίλης τα ${htmlFrac(17, 20)}. Ποιος είχε υψηλότερη επίδοση; (Γράψε ΑΛΕΞΑΝΔΡΟΣ ή ΒΑΣΙΛΗΣ):`,
      correctAnswer: 'ΒΑΣΙΛΗΣ',
      solution: `Μετατρέπουμε σε παρονομαστή 20: Αλέξανδρος ＝ ${htmlFrac(16, 20)}, Βασίλης ＝ ${htmlFrac(17, 20)}. Υψηλότερη επίδοση είχε ο Βασίλης.`,
    };
  },

  // Πρόβλημα 5: Ποσότητα υγρού σε δοχείο
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ',
      question: `Το δοχείο Α περιέχει ${htmlFrac(3, 5)} του λίτρου χυμό και το δοχείο Β περιέχει ${htmlFrac(5, 8)} του λίτρου. Ποιο δοχείο έχει περισσότερο χυμό; (Γράψε Α ή Β):`,
      correctAnswer: 'Β',
      solution: `Χιαστί γινόμενα: 3 · 8 ＝ 24 και 5 · 5 ＝ 25. Επειδή 24 ＜ 25, το δοχείο Β έχει περισσότερο χυμό.`,
    };
  },

  // Πρόβλημα 6: Στάθμη φόρτισης μπαταρίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ',
      question: `Το tablet έχει μπαταρία ${htmlFrac(7, 10)} και το κινητό ${htmlFrac(3, 4)}. Ποια συσκευή έχει περισσότερη μπαταρία; (Γράψε TABLET ή ΚΙΝΗΤΟ):`,
      correctAnswer: 'ΚΙΝΗΤΟ',
      solution: `ΕΚΠ(10, 4) ＝ 20. Tablet ＝ ${htmlFrac(14, 20)}, Κινητό ＝ ${htmlFrac(15, 20)}. Περισσότερη μπαταρία έχει το κινητό.`,
    };
  },

  // Πρόβλημα 7: Ποσοστό κοριτσιών σε δύο τμήματα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΟΛΕΙΟ',
      question: `Στο τμήμα Α1 τα κορίτσια αποτελούν τα ${htmlFrac(1, 2)} των μαθητών, ενώ στο Α2 τα ${htmlFrac(4, 7)}. Σε ποιο τμήμα είναι μεγαλύτερο το ποσοστό των κοριτσιών; (Γράψε Α1 ή Α2):`,
      correctAnswer: 'Α2',
      solution: `Χιαστί γινόμενα: 1 · 7 ＝ 7 και 2 · 4 ＝ 8. Επειδή 7 ＜ 8, μεγαλύτερο ποσοστό έχει το Α2.`,
    };
  },

  // Πρόβλημα 8: Αποταμίευση χαρτζιλικιού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ο Πέτρος αποταμίευσε τα ${htmlFrac(2, 5)} του χαρτζιλικιού του και η αδελφή του τα ${htmlFrac(3, 8)}. Ποιος αποταμίευσε μεγαλύτερο μέρος του ποσού; (Γράψε ΠΕΤΡΟΣ ή ΑΔΕΛΦΗ):`,
      correctAnswer: 'ΠΕΤΡΟΣ',
      solution: `Χιαστί: 2 · 8 ＝ 16 και 5 · 3 ＝ 15. Επειδή 16 ＞ 15, ο Πέτρος αποταμίευσε μεγαλύτερο μέρος.`,
    };
  },

  // Πρόβλημα 9: Δοσολογία ζάχαρης σε γλυκό
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΥΝΤΑΓΕΣ',
      question: `Η συνταγή Α χρειάζεται ${htmlFrac(2, 3)} φλιτζανιού ζάχαρη, ενώ η συνταγή Β χρειάζεται ${htmlFrac(3, 4)}. Ποια συνταγή απαιτεί περισσότερη ζάχαρη; (Γράψε Α ή Β):`,
      correctAnswer: 'Β',
      solution: `Ομώνυμα με ΕΚΠ 12: Α ＝ ${htmlFrac(8, 12)}, Β ＝ ${htmlFrac(9, 12)}. Περισσότερη ζάχαρη απαιτεί η συνταγή Β.`,
    };
  },

  // Πρόβλημα 10: Ευστοχία σε πέναλτι
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ',
      question: `Ο παίκτης Χ ευστόχησε στα ${htmlFrac(5, 6)} των σουτ και ο παίκτης Ψ στα ${htmlFrac(7, 9)}. Ποιος παίκτης είχε μεγαλύτερη ευστοχία; (Γράψε Χ ή Ψ):`,
      correctAnswer: 'Χ',
      solution: `ΕΚΠ(6, 9) ＝ 18. Παίκτης Χ ＝ ${htmlFrac(15, 18)}, Παίκτης Ψ ＝ ${htmlFrac(14, 18)}. Μεγαλύτερη ευστοχία είχε ο παίκτης Χ.`,
    };
  },

  // Πρόβλημα 11: Σελίδες βιβλίου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΝΑΓΝΩΣΗ',
      question: `Ο Μάνος διάβασε τα ${htmlFrac(3, 8)} ενός βιβλίου και η Σοφία τα ${htmlFrac(2, 5)} του ίδιου βιβλίου. Ποιος διάβασε περισσότερες σελίδες; (Γράψε ΜΑΝΟΣ ή ΣΟΦΙΑ):`,
      correctAnswer: 'ΣΟΦΙΑ',
      solution: `Χιαστί: 3 · 5 ＝ 15 και 8 · 2 ＝ 16. Επειδή 15 ＜ 16, περισσότερες σελίδες διάβασε η Σοφία.`,
    };
  },

  // Πρόβλημα 12: Βάρος φρούτων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Μια σακούλα μήλα ζυγίζει ${htmlFrac(5, 4)} kg και μια σακούλα πορτοκάλια ζυγίζει ${htmlFrac(4, 3)} kg. Ποια σακούλα είναι βαρύτερη; (Γράψε ΜΗΛΑ ή ΠΟΡΤΟΚΑΛΙΑ):`,
      correctAnswer: 'ΠΟΡΤΟΚΑΛΙΑ',
      solution: `ΕΚΠ(4, 3) ＝ 12. Μήλα ＝ ${htmlFrac(15, 12)} kg, Πορτοκάλια ＝ ${htmlFrac(16, 12)} kg. Βαρύτερα είναι τα πορτοκάλια.`,
    };
  },

  // Πρόβλημα 13: Κατανάλωση βενζίνης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ',
      question: `Στη διαδρομή 1 καταναλώθηκαν τα ${htmlFrac(3, 7)} του ντεπόζιτου και στη διαδρομή 2 τα ${htmlFrac(4, 9)}. Σε ποια διαδρομή καταναλώθηκε περισσότερη βενζίνη; (Γράψε 1 ή 2):`,
      correctAnswer: '2',
      solution: `Χιαστί: 3 · 9 ＝ 27 και 7 · 4 ＝ 28. Επειδή 27 ＜ 28, στη διαδρομή 2 καταναλώθηκε περισσότερη βενζίνη.`,
    };
  },

  // Πρόβλημα 14: Έκπτωση καταστήματος
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Το κατάστημα Α κάνει έκπτωση ${htmlFrac(1, 3)} της τιμής και το κατάστημα Β κάνει έκπτωση ${htmlFrac(3, 10)}. Ποιο κατάστημα προσφέρει μεγαλύτερη έκπτωση; (Γράψε Α ή Β):`,
      correctAnswer: 'Α',
      solution: `Χιαστί: 1 · 10 ＝ 10 και 3 · 3 ＝ 9. Επειδή 10 ＞ 9, μεγαλύτερη έκπτωση προσφέρει το κατάστημα Α.`,
    };
  },

  // Πρόβλημα 15: Μήκος υφάσματος
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΡΗΣΕΙΣ',
      question: `Το ρετάλι 1 έχει μήκος ${htmlFrac(7, 8)} του μέτρου και το ρετάλι 2 έχει μήκος ${htmlFrac(9, 10)}. Ποιο ρετάλι είναι μακρύτερο; (Γράψε 1 ή 2):`,
      correctAnswer: '2',
      solution: `Χιαστί: 7 · 10 ＝ 70 και 8 · 9 ＝ 72. Επειδή 70 ＜ 72, μακρύτερο είναι το ρετάλι 2.`,
    };
  },

  // Πρόβλημα 16: Μερίδιο οικοπέδου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΚΙΝΗΤΑ',
      question: `Ο ιδιοκτήτης Α έχει μερίδιο ${htmlFrac(5, 12)} και ο ιδιοκτήτης Β έχει ${htmlFrac(7, 16)}. Ποιος έχει το μεγαλύτερο μερίδιο; (Γράψε Α ή Β):`,
      correctAnswer: 'Β',
      solution: `ΕΚΠ(12, 16) ＝ 48. Α ＝ ${htmlFrac(20, 48)}, Β ＝ ${htmlFrac(21, 48)}. Μεγαλύτερο μερίδιο έχει ο Β.`,
    };
  },

  // Πρόβλημα 17: Ταχύτητα ολοκλήρωσης εργασίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ',
      question: `Σε μία ώρα ο εργάτης 1 τελείωσε τα ${htmlFrac(3, 10)} του έργου και ο εργάτης 2 τα ${htmlFrac(4, 15)}. Ποιος εργάτης προχώρησε ταχύτερα; (Γράψε 1 ή 2):`,
      correctAnswer: '1',
      solution: `ΕΚΠ(10, 15) ＝ 30. Εργάτης 1 ＝ ${htmlFrac(9, 30)}, Εργάτης 2 ＝ ${htmlFrac(8, 30)}. Ταχύτερα προχώρησε ο εργάτης 1.`,
    };
  },

  // Πρόβλημα 18: Συγκομιδή ελιών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΡΟΤΙΚΑ',
      question: `Το κτήμα Α μάζεψε τα ${htmlFrac(5, 6)} της παραγωγής και το κτήμα Β τα ${htmlFrac(7, 8)}. Ποιο κτήμα μάζεψε μεγαλύτερο μέρος της παραγωγής του; (Γράψε Α ή Β):`,
      correctAnswer: 'Β',
      solution: `ΕΚΠ(6, 8) ＝ 24. Κτήμα Α ＝ ${htmlFrac(20, 24)}, Κτήμα Β ＝ ${htmlFrac(21, 24)}. Μεγαλύτερο μέρος μάζεψε το κτήμα Β.`,
    };
  },

  // Πρόβλημα 19: Καθαρό ποσοστό χρυσού σε κόσμημα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΟΣΜΗΜΑΤΑ',
      question: `Το κόσμημα 1 περιέχει ${htmlFrac(3, 4)} καθαρό χρυσό και το κόσμημα 2 περιέχει ${htmlFrac(17, 24)}. Ποιο κόσμημα έχει μεγαλύτερη αναλογία χρυσού; (Γράψε 1 ή 2):`,
      correctAnswer: '1',
      solution: `Μετατρέπουμε σε παρονομαστή 24: Κόσμημα 1 ＝ ${htmlFrac(18, 24)}, Κόσμημα 2 ＝ ${htmlFrac(17, 24)}. Μεγαλύτερη αναλογία έχει το κόσμημα 1.`,
    };
  },

  // Πρόβλημα 20: Πλήρωση πισίνας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΩΡΗΤΙΚΟΤΗΤΑ',
      question: `Η βρύση Α γέμισε τα ${htmlFrac(4, 7)} της πισίνας και η βρύση Β τα ${htmlFrac(5, 9)}. Ποια βρύση έριξε περισσότερο νερό; (Γράψε Α ή Β):`,
      correctAnswer: 'Α',
      solution: `Χιαστί: 4 · 9 ＝ 36 και 7 · 5 ＝ 35. Επειδή 36 ＞ 35, η βρύση Α έριξε περισσότερο νερό.`,
    };
  },
];

export default function OmonimaEteronimaAsk() {
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
      ...gen(),
    }));

    const selectedProblems = shuffledProblems.slice(0, 2).map((gen, idx) => ({
      id: 11 + idx,
      ...gen(),
    }));

    setQuestions([...selectedCalcs, ...selectedProblems]);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  const handleInputChange = (id, val) => {
    if (isSubmitted) return;
    let clean = val.replace('.', ',');
    // Επιτρέπουμε ελληνικά γράμματα (για προβλήματα), νούμερα, <, >, /, κόμμα και μείον
    clean = clean.replace(/[^0-9,/,-,A-Za-zΑ-Ωα-ωά-ώΆ-Ώ<>]/g, '');

    if (clean.length > 12) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      let userAns = (userAnswers[q.id] || '').trim().toUpperCase().replace(/\s+/g, '');
      let correctAns = q.correctAnswer.trim().toUpperCase().replace(/\s+/g, '');

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
    (k) => userAnswers[k] && userAnswers[k].trim() !== ''
  ).length;

  const scorePercentage = Math.round((score / 12) * 100);

  return (
    <Layout
      title="Ασκήσεις: Ομώνυμα & Ετερώνυμα Κλάσματα | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στη μετατροπή ετερώνυμων σε ομώνυμα, τη σύγκριση και τη διάταξη ρητών για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/15-omonima-eteronima-klasmata"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
        >
          <span>📖</span>
          <span>ΘΕΩΡΙΑ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 pb-32 sm:pb-36 space-y-8">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 13 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Ομώνυμα & Ετερώνυμα Κλάσματα
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 υπολογισμοί/θεωρία μετατροπών και σύγκρισης + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns.trim().toUpperCase().replace(/\s+/g, '').replace(/^\+/, '');
              const cleanCorrect = q.correctAnswer.trim().toUpperCase().replace(/\s+/g, '').replace(/^\+/, '');
              const isCorrect = isSubmitted && cleanUser === cleanCorrect;
              const isWordProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                    isWordProblem ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'
                  } ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs sm:text-sm ${
                            isWordProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {q.id}
                        </span>
                        {isWordProblem && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                            ΠΡΟΒΛΗΜΑ
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md">
                        {q.topic}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ */}
                  <div className="space-y-2 pt-2">
                    {q.type === 'input' ? (
                      <div className="relative max-w-xs">
                        <input
                          type="text"
                          inputMode="text"
                          maxLength={12}
                          disabled={isSubmitted}
                          placeholder="Απάντηση..."
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-base font-bold rounded-xl border transition-all outline-none ${
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
                              className={`h-11 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between transition-all touch-manipulation active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span dangerouslySetInnerHTML={{ __html: opt }} />
                              {isSelected && <span>✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση */}
                    {isSubmitted && (
                      <div
                        className={`p-4 rounded-xl text-xs sm:text-sm space-y-2.5 mt-3 border ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-sm sm:text-base">
                            <span>✅</span>
                            <span>ΣΩΣΤΟ</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>ΛΑΘΟΣ</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-block">
                              ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ: <span className="text-emerald-700 font-black ml-1" dangerouslySetInnerHTML={{ __html: q.correctAnswer }} />
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
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR (12 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {isSubmitted ? 'ΤΕΛΙΚΟ ΣΚΟΡ' : 'ΠΡΟΟΔΟΣ'}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  ΕΠΙΤΥΧΙΑ
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
              <span className="hidden sm:inline">ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                ΕΠΑΝΑΛΗΨΗ
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

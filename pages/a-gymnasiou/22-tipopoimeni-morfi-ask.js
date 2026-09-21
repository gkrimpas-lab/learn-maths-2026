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

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΥΠΟΛΟΓΙΣΜΩΝ & ΘΕΩΡΙΑΣ ΤΥΠΟΠΟΙΗΜΕΝΗΣ ΜΟΡΦΗΣ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Μετατροπή μεγάλου ακέραιου με πολλαπλά μηδενικά (Input)
  () => {
    // 5.000.000 = 5 * 10^6
    return {
      type: 'input',
      topic: 'ΜΕΓΑΛΟΣ ΑΡΙΘΜΟΣ',
      question: `Γράψε τον αριθμό <strong>5.000.000</strong> σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '5*10^6',
      solution: `Ο αριθμός γράφεται 5 · 10<sup>6</sup> καθώς μετακινούμε την υποδιαστολή 6 θέσεις αριστερά.`,
    };
  },

  // 2. Μετατροπή δεκαδικού μικρότερου του 1 (Input)
  () => {
    // 0,0004 = 4 * 10^-4
    return {
      type: 'input',
      topic: 'ΜΙΚΡΟΣ ΑΡΙΘΜΟΣ',
      question: `Γράψε τον δεκαδικό <strong>0,0004</strong> σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '4*10^-4',
      solution: `Μετακινούμε την υποδιαστολή 4 θέσεις δεξιά: 4 · 10<sup>-4</sup>.`,
    };
  },

  // 3. Εύρεση εκθέτη k σε μεγάλο αριθμό (Input)
  () => {
    // 340.000 = 3,4 * 10^k => k = 5
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΕΚΘΕΤΗ',
      question: `Αν 340.000 ＝ 3,4 · 10<sup>k</sup>, ποια είναι η τιμή του εκθέτη k;`,
      correctAnswer: '5',
      solution: `Η υποδιαστολή μετακινείται 5 θέσεις αριστερά από το τέλος μέχρι ανάμεσα στο 3 και το 4, άρα k ＝ 5.`,
    };
  },

  // 4. Εύρεση εκθέτη k σε μικρό αριθμό (Input)
  () => {
    // 0,000072 = 7,2 * 10^k => k = -5
    return {
      type: 'input',
      topic: 'ΕΥΡΕΣΗ ΑΡΝΗΤΙΚΟΥ ΕΚΘΕΤΗ',
      question: `Αν 0,000072 ＝ 7,2 · 10<sup>k</sup>, ποια είναι η τιμή του εκθέτη k;`,
      correctAnswer: '-5',
      solution: `Η υποδιαστολή μετακινείται 5 θέσεις δεξιά, άρα ο εκθέτης είναι αρνητικός: k ＝ －5.`,
    };
  },

  // 5. Έλεγχος έγκυρης τυποποιημένης μορφής (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΟΡΙΣΜΟΣ ΣΥΝΤΕΛΕΣΤΗ',
      question: `Ποιος από τους παρακάτω αριθμούς είναι γραμμένος σε σωστή τυποποιημένη μορφή;`,
      options: makeUniqueOptions(
        '4,5 · 10<sup>7</sup>',
        [
          '45 · 10<sup>6</sup>',
          '0,45 · 10<sup>8</sup>',
          '450 · 10<sup>5</sup>',
        ]
      ),
      correctAnswer: '4,5 · 10<sup>7</sup>',
      solution: `Στην τυποποιημένη μορφή α · 10<sup>k</sup> πρέπει ο συντελεστής α να ικανοποιεί 1 ≤ |α| ＜ 10, δηλαδή να έχει ακριβώς ένα ψηφίο διάφορο του μηδενός αριστερά από την υποδιαστολή (εδώ το 4,5).`,
    };
  },

  // 6. Μετατροπή από τυποποιημένη σε δεκαδική μορφή (Input)
  () => {
    // 2,5 * 10^3 = 2500
    return {
      type: 'input',
      topic: 'ΑΝΑΠΤΥΓΜΑ ΔΥΝΑΜΗΣ',
      question: `Ποιος φυσικός αριθμός αντιστοιχεί στην παράσταση <strong>2,5 · 10<sup>3</sup></strong>;`,
      correctAnswer: '2500',
      solution: `2,5 · 1.000 ＝ 2.500 (μετακινούμε την υποδιαστολή 3 θέσεις δεξιά).`,
    };
  },

  // 7. Μετατροπή αρνητικού εκθέτη σε δεκαδικό (Input)
  () => {
    // 6 * 10^-2 = 0,06
    return {
      type: 'input',
      topic: 'ΜΕΤΑΤΡΟΠΗ ΣΕ ΔΕΚΑΔΙΚΟ',
      question: `Γράψε ως δεκαδικό αριθμό την τιμή <strong>6 · 10<sup>-2</sup></strong>:`,
      correctAnswer: '0,06',
      solution: `6 · 0,01 ＝ 0,06 (μετακινούμε την υποδιαστολή 2 θέσεις αριστερά).`,
    };
  },

  // 8. Μετατροπή μη τυποποιημένης μορφής σε τυποποιημένη (MCQ)
  () => {
    // 25 * 10^4 = 2,5 * 10^5
    const correct = '2,5 · 10<sup>5</sup>';
    return {
      type: 'mcq',
      topic: 'ΔΙΟΡΘΩΣΗ ΜΟΡΦΗΣ',
      question: `Πώς γράφεται σωστά σε τυποποιημένη μορφή ο αριθμός 25 · 10<sup>4</sup>;`,
      options: makeUniqueOptions(correct, [
        '2,5 · 10<sup>3</sup>',
        '0,25 · 10<sup>6</sup>',
        '25 · 10<sup>4</sup>',
      ]),
      correctAnswer: correct,
      solution: `25 ＝ 2,5 · 10<sup>1</sup>. Άρα: (2,5 · 10<sup>1</sup>) · 10<sup>4</sup> ＝ 2,5 · 10<sup>5</sup>.`,
    };
  },

  // 9. Μετατροπή δεκαδικού συντελεστή < 1 (MCQ)
  () => {
    // 0,3 * 10^6 = 3 * 10^5
    const correct = '3 · 10<sup>5</sup>';
    return {
      type: 'mcq',
      topic: 'ΔΙΟΡΘΩΣΗ ΜΟΡΦΗΣ',
      question: `Πώς γράφεται σωστά σε τυποποιημένη μορφή ο αριθμός 0,3 · 10<sup>6</sup>;`,
      options: makeUniqueOptions(correct, [
        '3 · 10<sup>7</sup>',
        '3 · 10<sup>6</sup>',
        '30 · 10<sup>4</sup>',
      ]),
      correctAnswer: correct,
      solution: `0,3 ＝ 3 · 10<sup>-1</sup>. Άρα: (3 · 10<sup>-1</sup>) · 10<sup>6</sup> ＝ 3 · 10<sup>5</sup>.`,
    };
  },

  // 10. Όριο συντελεστή α (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ: ΟΡΙΑ ΣΥΝΤΕΛΕΣΤΗ',
      question: `Ποιο διάστημα τιμών πρέπει να ικανοποιεί ο συντελεστής α στην τυποποιημένη μορφή α · 10<sup>k</sup>;`,
      options: makeUniqueOptions(
        '1 ≤ |α| ＜ 10',
        ['0 ≤ |α| ＜ 1', '1 ＜ |α| ≤ 10', '0,1 ≤ |α| ＜ 1']
      ),
      correctAnswer: '1 ≤ |α| ＜ 10',
      solution: `Ο συντελεστής α πρέπει να έχει απόλυτη τιμή τουλάχιστον 1 και αυστηρά μικρότερη από 10 (1 ≤ |α| ＜ 10).`,
    };
  },

  // 11. Μετατροπή δεκαδικού με 2 σημαντικά ψηφία (Input)
  () => {
    // 0,0056 = 5,6 * 10^-3
    return {
      type: 'input',
      topic: 'ΜΙΚΡΟΣ ΔΕΚΑΔΙΚΟΣ',
      question: `Γράψε τον αριθμό <strong>0,0056</strong> σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '5,6*10^-3',
      solution: `Μετακινούμε την υποδιαστολή 3 θέσεις δεξιά: 5,6 · 10<sup>-3</sup>.`,
    };
  },

  // 12. Αρνητικός αριθμός σε τυποποιημένη μορφή (Input)
  () => {
    // -82.000 = -8,2 * 10^4
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟΣ ΑΡΙΘΜΟΣ',
      question: `Γράψε τον αριθμό <strong>－82.000</strong> σε τυποποιημένη μορφή (μορφή: -α*10^k):`,
      correctAnswer: '-8,2*10^4',
      solution: `Διατηρούμε το αρνητικό πρόσημο και μετακινούμε την υποδιαστολή 4 θέσεις αριστερά: －8,2 · 10<sup>4</sup>.`,
    };
  },

  // 13. Σύγκριση αριθμών σε τυποποιημένη μορφή (MCQ)
  () => {
    // 3 * 10^5 vs 2 * 10^6
    const correct = '2 · 10<sup>6</sup> ＞ 3 · 10<sup>5</sup>';
    return {
      type: 'mcq',
      topic: 'ΣΥΓΚΡΙΣΗ ΜΕΓΕΘΩΝ',
      question: `Ποια σχέση ισχύει μεταξύ των αριθμών 3 · 10<sup>5</sup> και 2 · 10<sup>6</sup>;`,
      options: makeUniqueOptions(correct, [
        '3 · 10<sup>5</sup> ＞ 2 · 10<sup>6</sup>',
        '3 · 10<sup>5</sup> ＝ 2 · 10<sup>6</sup>',
        'Δεν συγκρίνονται χωρίς κομπιουτεράκι',
      ]),
      correctAnswer: correct,
      solution: `Μεγαλύτερος είναι ο αριθμός με τον μεγαλύτερο εκθέτη στη δύναμη του 10 (το 10<sup>6</sup> είναι ένα εκατομμύριο ενώ το 10<sup>5</sup> εκατό χιλιάδες): 2.000.000 ＞ 300.000.`,
    };
  },

  // 14. Σύγκριση αρνητικών εκθετών (MCQ)
  () => {
    // 4 * 10^-3 vs 9 * 10^-5
    const correct = '4 · 10<sup>-3</sup> ＞ 9 · 10<sup>-5</sup>';
    return {
      type: 'mcq',
      topic: 'ΣΥΓΚΡΙΣΗ ΜΙΚΡΩΝ ΑΡΙΘΜΩΝ',
      question: `Ποιος αριθμός είναι μεγαλύτερος: ο 4 · 10<sup>-3</sup> ή ο 9 · 10<sup>-5</sup>;`,
      options: makeUniqueOptions(
        'Ο 4 · 10<sup>-3</sup> είναι μεγαλύτερος',
        [
          'Ο 9 · 10<sup>-5</sup> είναι μεγαλύτερος γιατί έχει συντελεστή 9',
          'Είναι ίσοι',
          'Είναι και οι δύο αρνητικοί αριθμοί',
        ]
      ),
      correctAnswer: 'Ο 4 · 10<sup>-3</sup> είναι μεγαλύτερος',
      solution: `4 · 10<sup>-3</sup> ＝ 0,004 ενώ 9 · 10<sup>-5</sup> ＝ 0,00009. Μεγαλύτερος είναι εκείνος με τον μεγαλύτερο (λιγότερο αρνητικό) εκθέτη: －3 ＞ －5.`,
    };
  },

  // 15. Γινόμενο αριθμών σε τυποποιημένη μορφή (Input)
  () => {
    // (2 * 10^3) * (3 * 10^4) = 6 * 10^7
    return {
      type: 'input',
      topic: 'ΓΙΝΟΜΕΝΟ',
      question: `Υπολόγισε το γινόμενο σε τυποποιημένη μορφή: (2 · 10<sup>3</sup>) · (3 · 10<sup>4</sup>) (μορφή: α*10^k):`,
      correctAnswer: '6*10^7',
      solution: `Πολλαπλασιάζουμε τους συντελεστές (2 · 3 ＝ 6) και προσθέτουμε τους εκθέτες (3 ＋ 4 ＝ 7): 6 · 10<sup>7</sup>.`,
    };
  },

  // 16. Πηλίκο αριθμών σε τυποποιημένη μορφή (Input)
  () => {
    // (8 * 10^6) : (2 * 10^2) = 4 * 10^4
    return {
      type: 'input',
      topic: 'ΠΗΛΙΚΟ',
      question: `Υπολόγισε το πηλίκο σε τυποποιημένη μορφή: (8 · 10<sup>6</sup>) ： (2 · 10<sup>2</sup>) (μορφή: α*10^k):`,
      correctAnswer: '4*10^4',
      solution: `Διαιρούμε τους συντελεστές (8 ： 2 ＝ 4) και αφαιρούμε τους εκθέτες (6 － 2 ＝ 4): 4 · 10<sup>4</sup>.`,
    };
  },

  // 17. Μετατροπή 1 εκατομμυρίου (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΕΚΑΤΟΜΜΥΡΙΟ',
      question: `Γράψε τον αριθμό 1.000.000 (1 εκατομμύριο) σε τυποποιημένη μορφή (μορφή: 1*10^k):`,
      correctAnswer: '1*10^6',
      solution: `1.000.000 ＝ 1 · 10<sup>6</sup>.`,
    };
  },

  // 18. Μετατροπή 1 δισεκατομμυρίου (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΔΙΣΕΚΑΤΟΜΜΥΡΙΟ',
      question: `Γράψε τον αριθμό 1.000.000.000 (1 δισεκατομμύριο) σε τυποποιημένη μορφή (μορφή: 1*10^k):`,
      correctAnswer: '1*10^9',
      solution: `1.000.000.000 ＝ 1 · 10<sup>9</sup>.`,
    };
  },

  // 19. Μετατροπή 1 χιλιοστού (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΧΙΛΙΟΣΤΟ',
      question: `Γράψε τον αριθμό 0,001 (1 χιλιοστό) σε τυποποιημένη μορφή (μορφή: 1*10^k):`,
      correctAnswer: '1*10^-3',
      solution: `0,001 ＝ 1 · 10<sup>-3</sup>.`,
    };
  },

  // 20. Αριθμός μεταξύ 1 και 10 (Input)
  () => {
    // 7 = 7 * 10^0
    return {
      type: 'input',
      topic: 'ΕΚΘΕΤΗΣ ΜΗΔΕΝ',
      question: `Ποιος είναι ο εκθέτης k αν γράψουμε τον αριθμό 7 σε μορφή 7 · 10<sup>k</sup>;`,
      correctAnswer: '0',
      solution: `Επειδή 7 ＝ 7 · 1 και 10<sup>0</sup> ＝ 1, ο εκθέτης είναι k ＝ 0.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΤΥΠΟΠΟΙΗΜΕΝΗΣ ΜΟΡΦΗΣ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Ταχύτητα του φωτός
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΦΥΣΙΚΗ',
      question: `Η ταχύτητα του φωτός στο κενό είναι περίπου 300.000.000 m/s. Γράψε την τιμή αυτή σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '3*10^8',
      solution: `300.000.000 m/s ＝ 3 · 10<sup>8</sup> m/s.`,
    };
  },

  // Πρόβλημα 2: Απόσταση Γης - Σελήνης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΣΤΡΟΝΟΜΙΑ',
      question: `Η μέση απόσταση της Γης από τη Σελήνη είναι 384.000 km. Γράψε την απόσταση αυτή σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '3,84*10^5',
      solution: `384.000 km ＝ 3,84 · 10<sup>5</sup> km.`,
    };
  },

  // Πρόβλημα 3: Διάμετρος ερυθρού αιμοσφαιρίου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΙΟΛΟΓΙΑ',
      question: `Η διάμετρος ενός ερυθρού αιμοσφαιρίου είναι περίπου 0,000007 μέτρα. Γράψε τη διάσταση σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '7*10^-6',
      solution: `0,000007 m ＝ 7 · 10<sup>-6</sup> m.`,
    };
  },

  // Πρόβλημα 4: Πληθυσμός του πλανήτη
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΔΗΜΟΓΡΑΦΙΑ',
      question: `Ο πληθυσμός της Γης εκτιμάται σε περίπου 8.000.000.000 ανθρώπους. Γράψε τον αριθμό σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '8*10^9',
      solution: `8.000.000.000 ＝ 8 · 10<sup>9</sup>.`,
    };
  },

  // Πρόβλημα 5: Πάχος μεμβράνης κυττάρου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΙΚΡΟΒΙΟΛΟΓΙΑ',
      question: `Το πάχος μιας κυτταρικής μεμβράνης είναι περίπου 0,000000008 μέτρα. Γράψε το μέγεθος σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '8*10^-9',
      solution: `0,000000008 m ＝ 8 · 10<sup>-9</sup> m.`,
    };
  },

  // Πρόβλημα 6: Απόσταση Γης - Ήλιου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΣΤΡΟΝΟΜΙΑ',
      question: `Η απόσταση Γης - Ήλιου είναι περίπου 150.000.000 km. Γράψε την σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '1,5*10^8',
      solution: `150.000.000 km ＝ 1,5 · 10<sup>8</sup> km.`,
    };
  },

  // Πρόβλημα 7: Χρόνος παλμού λέιζερ
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ',
      question: `Ένας υπερταχύς παλμός λέιζερ διαρκεί 0,000000000012 δευτερόλεπτα. Γράψε τη διάρκεια σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '1,2*10^-11',
      solution: `0,000000000012 s ＝ 1,2 · 10<sup>-11</sup> s.`,
    };
  },

  // Πρόβλημα 8: Αποθηκευτικός χώρος σκληρού δίσκου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΛΗΡΟΦΟΡΙΚΗ',
      question: `Ένας σκληρός δίσκος χωρητικότητας 2 Terabytes αποθηκεύει 2.000.000.000.000 Bytes. Γράψε τη χωρητικότητα σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '2*10^12',
      solution: `2.000.000.000.000 B ＝ 2 · 10<sup>12</sup> B.`,
    };
  },

  // Πρόβλημα 9: Μέγεθος ιού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΙΟΛΟΓΙΑ',
      question: `Η διάμετρος ενός ιού είναι περίπου 0,00000012 μέτρα. Γράψε τη διάμετρο σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '1,2*10^-7',
      solution: `0,00000012 m ＝ 1,2 · 10<sup>-7</sup> m.`,
    };
  },

  // Πρόβλημα 10: Ηλικία της Γης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΛΟΓΙΑ',
      question: `Η ηλικία της Γης υπολογίζεται σε 4.500.000.000 έτη. Γράψε τον αριθμό σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '4,5*10^9',
      solution: `4.500.000.000 ＝ 4,5 · 10<sup>9</sup> έτη.`,
    };
  },

  // Πρόβλημα 11: Μάζα σταγόνας νερού
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΗΜΕΙΑ',
      question: `Η μάζα μιας πολύ μικρής σταγόνας νερού είναι 0,00005 kg. Γράψε τη μάζα σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '5*10^-5',
      solution: `0,00005 kg ＝ 5 · 10<sup>-5</sup> kg.`,
    };
  },

  // Πρόβλημα 12: Συνολικά κύτταρα στο ανθρώπινο σώμα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΝΑΤΟΜΙΑ',
      question: `Το ανθρώπινο σώμα αποτελείται από περίπου 37.000.000.000.000 κύτταρα. Γράψε τον αριθμό σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '3,7*10^13',
      solution: `37.000.000.000.000 ＝ 3,7 · 10<sup>13</sup> κύτταρα.`,
    };
  },

  // Πρόβλημα 13: Μήκος κύματος πράσινου φωτός
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΠΤΙΚΗ',
      question: `Το μήκος κύματος του πράσινου φωτός είναι 0,00000055 μέτρα. Γράψε το σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '5,5*10^-7',
      solution: `0,00000055 m ＝ 5,5 · 10<sup>-7</sup> m.`,
    };
  },

  // Πρόβλημα 14: Έτος φωτός σε χιλιόμετρα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΣΤΡΟΦΥΣΙΚΗ',
      question: `Ένα έτος φωτός ισούται περίπου με 9.460.000.000.000 km. Γράψε την απόσταση σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '9,46*10^12',
      solution: `9.460.000.000.000 km ＝ 9,46 · 10<sup>12</sup> km.`,
    };
  },

  // Πρόβλημα 15: Μέγεθος κόκκου γύρης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΟΤΑΝΙΚΗ',
      question: `Ένας κόκκος γύρης έχει διάμετρο 0,000025 μέτρα. Γράψε τη διάσταση σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '2,5*10^-5',
      solution: `0,000025 m ＝ 2,5 · 10<sup>-5</sup> m.`,
    };
  },

  // Πρόβλημα 16: Αριθμός αστεριών στον γαλαξία
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΣΤΡΟΝΟΜΙΑ',
      question: `Ο Γαλαξίας μας εκτιμάται ότι περιέχει περίπου 250.000.000.000 αστέρια. Γράψε τον αριθμό σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '2,5*10^11',
      solution: `250.000.000.000 ＝ 2,5 · 10<sup>11</sup> αστέρια.`,
    };
  },

  // Πρόβλημα 17: Χρόνος ενός νανοδευτερολέπτου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΗΛΕΚΤΡΟΝΙΚΗ',
      question: `Ένα νανοδευτερόλεπτο (1 ns) ισούται με 0,000000001 δευτερόλεπτα. Γράψε το σε τυποποιημένη μορφή (μορφή: 1*10^k):`,
      correctAnswer: '1*10^-9',
      solution: `0,000000001 s ＝ 1 · 10<sup>-9</sup> s.`,
    };
  },

  // Πρόβλημα 18: Όγκος νερού στους ωκεανούς
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΩΚΕΑΝΟΓΡΑΦΙΑ',
      question: `Ο συνολικός όγκος νερού στους ωκεανούς είναι περίπου 1.332.000.000 κυβικά χιλιόμετρα. Γράψε τον αριθμό σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '1,332*10^9',
      solution: `1.332.000.000 km<sup>3</sup> ＝ 1,332 · 10<sup>9</sup> km<sup>3</sup>.`,
    };
  },

  // Πρόβλημα 19: Μάζα μορίου οξυγόνου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΗΜΕΙΑ',
      question: `Η μάζα ενός μορίου οξυγόνου είναι περίπου 0,000000000000000000000053 γραμμάρια (23 δεκαδικά ψηφία). Γράψε τη μάζα σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '5,3*10^-23',
      solution: `Μετακινούμε την υποδιαστολή 23 θέσεις δεξιά: 5,3 · 10<sup>-23</sup> g.`,
    };
  },

  // Πρόβλημα 20: Εκπομπή ενέργειας Ήλιου ανά δευτερόλεπτο
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΣΤΡΟΦΥΣΙΚΗ',
      question: `Ο Ήλιος ακτινοβολεί ενέργεια περίπου 380.000.000.000.000.000.000.000.000 Joules κάθε δευτερόλεπτο (26 μηδενικά). Γράψε την ενέργεια σε τυποποιημένη μορφή (μορφή: α*10^k):`,
      correctAnswer: '3,8*10^26',
      solution: `380.000.000.000.000.000.000.000.000 J ＝ 3,8 · 10<sup>26</sup> J.`,
    };
  },
];

export default function TipopoimeniMorfiAsk() {
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
    // Επιτρέπουμε νούμερα, κόμμα, *, ^ και μείον
    clean = clean.replace(/[^0-9,*^·-]/g, '');

    if (clean.length > 18) return;

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
      let userAns = (userAnswers[q.id] || '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/\./g, ',');

      let correctAns = q.correctAnswer
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/\./g, ',');

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
      title="Ασκήσεις: Τυποποιημένη Μορφή Αριθμών | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στην τυποποιημένη μορφή (επιστημονική σημειογραφία) μικρών και μεγάλων αριθμών για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/22-tipopoimeni-morfi"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 20 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Τυποποιημένη Μορφή Αριθμών
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία τυποποιημένης μορφής + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
                .replace(/\./g, ',');
              const cleanCorrect = q.correctAnswer
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/\./g, ',');

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
                          maxLength={18}
                          disabled={isSubmitted}
                          placeholder="π.χ. 3*10^8 ή 5"
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
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-block font-mono">
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

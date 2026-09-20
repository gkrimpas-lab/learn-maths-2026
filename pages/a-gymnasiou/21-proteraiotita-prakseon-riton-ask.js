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

// Helper για αυθεντική κλασματική γραφή σε HTML string με ασφαλές πρόσημο
const htmlFrac = (num, den, isNeg = false) => {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;
  const absNum = numStr.replace(/^-/, '');
  const absDen = denStr.replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-1 font-mono">${
    hasMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="border-b-2 border-current px-1 pb-0.5">${absNum}</span><span class="px-1 pt-0.5">${absDen}</span></span></span>`;
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ ΠΡΑΞΕΩΝ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Πολλαπλασιασμός πριν την πρόσθεση (Input)
  () => {
    // 5 + 3 * 4 = 5 + 12 = 17
    return {
      type: 'input',
      topic: 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ & ΠΡΟΣΘΕΣΗ',
      question: `Υπολόγισε την τιμή της παράστασης: 5 ＋ 3 · 4`,
      correctAnswer: '17',
      solution: `Προηγείται ο πολλαπλασιασμός: 3 · 4 ＝ 12. Στη συνέχεια προσθέτουμε: 5 ＋ 12 ＝ 17.`,
    };
  },

  // 2. Παρένθεση πριν τον πολλαπλασιασμό (Input)
  () => {
    // (5 + 3) * 4 = 8 * 4 = 32
    return {
      type: 'input',
      topic: 'ΠΑΡΕΝΘΕΣΗ ΥΠΕΡΙΣΧΥΕΙ',
      question: `Υπολόγισε την τιμή της παράστασης: (5 ＋ 3) · 4`,
      correctAnswer: '32',
      solution: `Προηγείται η πράξη μέσα στην παρένθεση: 5 ＋ 3 ＝ 8. Μετά πολλαπλασιάζουμε: 8 · 4 ＝ 32.`,
    };
  },

  // 3. Δύναμη πριν τον πολλαπλασιασμό (Input)
  () => {
    // 2 * 3^2 = 2 * 9 = 18
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΗ & ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
      question: `Υπολόγισε την τιμή της παράστασης: 2 · 3<sup>2</sup>`,
      correctAnswer: '18',
      solution: `Προηγείται η δύναμη: 3<sup>2</sup> ＝ 9. Στη συνέχεια πολλαπλασιάζουμε: 2 · 9 ＝ 18.`,
    };
  },

  // 4. Διαίρεση και πολλαπλασιασμός από αριστερά προς τα δεξιά (Input)
  () => {
    // 12 : 3 * 2 = 4 * 2 = 8
    return {
      type: 'input',
      topic: 'ΣΕΙΡΑ ΑΠΟ ΑΡΙΣΤΕΡΑ',
      question: `Υπολόγισε την τιμή της παράστασης: 12 ： 3 · 2`,
      correctAnswer: '8',
      solution: `Επειδή διαίρεση και πολλαπλασιασμός έχουν την ίδια προτεραιότητα, εκτελούνται από αριστερά προς τα δεξιά: (12 ： 3) · 2 ＝ 4 · 2 ＝ 8.`,
    };
  },

  // 5. Παράσταση με αρνητικούς αριθμούς (Input)
  () => {
    // 20 - 4 * (-3) = 20 - (-12) = 20 + 12 = 32
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟΙ & ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
      question: `Υπολόγισε την τιμή: 20 － 4 · (－3)`,
      correctAnswer: '32',
      solution: `Προηγείται ο πολλαπλασιασμός: 4 · (－3) ＝ －12. Μετά η αφαίρεση: 20 － (－12) ＝ 20 ＋ 12 ＝ 32.`,
    };
  },

  // 6. Δύναμη αρνητικού μέσα σε παρένθεση (Input)
  () => {
    // 10 - (-2)^3 = 10 - (-8) = 18
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΗ ΑΡΝΗΤΙΚΟΥ',
      question: `Υπολόγισε την τιμή: 10 － (－2)<sup>3</sup>`,
      correctAnswer: '18',
      solution: `Υπολογίζουμε πρώτα τη δύναμη: (－2)<sup>3</sup> ＝ －8. Στη συνέχεια αφαιρούμε: 10 － (－8) ＝ 10 ＋ 8 ＝ 18.`,
    };
  },

  // 7. Προτεραιότητα μέσα σε παρένθεση (Input)
  () => {
    // 3 * (10 - 2 * 3) = 3 * (10 - 6) = 3 * 4 = 12
    return {
      type: 'input',
      topic: 'ΣΥΝΘΕΤΗ ΠΑΡΕΝΘΕΣΗ',
      question: `Υπολόγισε την τιμή: 3 · (10 － 2 · 3)`,
      correctAnswer: '12',
      solution: `Μέσα στην παρένθεση προηγείται ο πολλαπλασιασμός: 2 · 3 ＝ 6. Άρα: 10 － 6 ＝ 4. Τέλος: 3 · 4 ＝ 12.`,
    };
  },

  // 8. Πράξεις με κλάσματα (Input)
  () => {
    // 1/2 + 3/2 * 1/3 = 1/2 + 3/6 = 1/2 + 1/2 = 1
    return {
      type: 'input',
      topic: 'ΠΡΟΤΕΡΑΙΟΤΗΤΑ ΣΕ ΚΛΑΣΜΑΤΑ',
      question: `Υπολόγισε την τιμή: (${htmlFrac(1, 2)}) ＋ (${htmlFrac(3, 2)}) · (${htmlFrac(1, 3)})`,
      correctAnswer: '1',
      solution: `Προηγείται ο πολλαπλασιασμός: (${htmlFrac(3, 2)}) · (${htmlFrac(1, 3)}) ＝ 3/6 ＝ ${htmlFrac(1, 2)}. Στη συνέχεια προσθέτουμε: ${htmlFrac(1, 2)} ＋ ${htmlFrac(1, 2)} ＝ 1.`,
    };
  },

  // 9. Παράσταση με δεκαδικούς (Input)
  () => {
    // 4.5 - 1.5 * 2 = 4.5 - 3 = 1.5
    return {
      type: 'input',
      topic: 'ΔΕΚΑΔΙΚΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε την τιμή: 4,5 － 1,5 · 2`,
      correctAnswer: '1,5',
      solution: `Προηγείται ο πολλαπλασιασμός: 1,5 · 2 ＝ 3,0. Στη συνέχεια: 4,5 － 3,0 ＝ 1,5.`,
    };
  },

  // 10. Θεωρία ιεραρχίας πράξεων (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΚΑΝΟΝΑΣ ΙΕΡΑΡΧΙΑΣ',
      question: `Ποια είναι η σωστή σειρά εκτέλεσης πράξεων σε μια αριθμητική παράσταση χωρίς παρενθέσεις;`,
      options: makeUniqueOptions(
        '1. Δυνάμεις ➔ 2. Πολλαπλασιασμοί & Διαιρέσεις ➔ 3. Προσθέσεις & Αφαιρέσεις',
        [
          '1. Προσθέσεις & Αφαιρέσεις ➔ 2. Πολλαπλασιασμοί ➔ 3. Δυνάμεις',
          '1. Πολλαπλασιασμοί ➔ 2. Δυνάμεις ➔ 3. Προσθέσεις',
          'Εκτελούνται πάντοτε αυστηρά από αριστερά προς τα δεξιά ανεξάρτητα από το είδος της πράξης',
        ]
      ),
      correctAnswer: '1. Δυνάμεις ➔ 2. Πολλαπλασιασμοί & Διαιρέσεις ➔ 3. Προσθέσεις & Αφαιρέσεις',
      solution: `Η σωστή ιεραρχία είναι: πρώτα οι δυνάμεις, μετά οι πολλαπλασιασμοί και οι διαιρέσεις, και τέλος οι προσθέσεις και οι αφαιρέσεις.`,
    };
  },

  // 11. Διπλή παρένθεση / αγκύλη (Input)
  () => {
    // 2 * [15 - (3 + 2)] = 2 * [15 - 5] = 2 * 10 = 20
    return {
      type: 'input',
      topic: 'ΕΣΩΤΕΡΙΚΗ ΠΑΡΕΝΘΕΣΗ',
      question: `Υπολόγισε την τιμή: 2 · [15 － (3 ＋ 2)]`,
      correctAnswer: '20',
      solution: `Υπολογίζουμε πρώτα την εσωτερική παρένθεση: 3 ＋ 2 ＝ 5. Έπειτα την αγκύλη: 15 － 5 ＝ 10. Τέλος: 2 · 10 ＝ 20.`,
    };
  },

  // 12. Παγίδα αρνητικού πρόσημου και δύναμης (Input)
  () => {
    // -3^2 + 4 * 2 = -9 + 8 = -1
    return {
      type: 'input',
      topic: 'ΠΑΓΙΔΑ ΠΡΟΣΗΜΟΥ',
      question: `Υπολόγισε την τιμή: －3<sup>2</sup> ＋ 4 · 2`,
      correctAnswer: '-1',
      solution: `－3<sup>2</sup> ＝ －9 (το μείον δεν είναι σε παρένθεση). 4 · 2 ＝ 8. Άρα: －9 ＋ 8 ＝ －1.`,
    };
  },

  // 13. Διαίρεση κλασμάτων σε παρένθεση (Input)
  () => {
    // (1/3) * (2/5 : 2/5) = 1/3 * 1 = 1/3
    return {
      type: 'input',
      topic: 'ΠΑΡΕΝΘΕΣΗ ΜΕ ΔΙΑΙΡΕΣΗ',
      question: `Υπολόγισε σε ανάγωγο κλάσμα: (${htmlFrac(1, 3)}) · [(${htmlFrac(2, 5)}) ： (${htmlFrac(2, 5)})]`,
      correctAnswer: '1/3',
      solution: `Μέσα στην παρένθεση: (${htmlFrac(2, 5)}) ： (${htmlFrac(2, 5)}) ＝ 1. Έτσι: (${htmlFrac(1, 3)}) · 1 ＝ ${htmlFrac(1, 3)}.`,
    };
  },

  // 14. Αφαίρεση και διαίρεση (Input)
  () => {
    // 16 - 8 : 4 = 16 - 2 = 14
    return {
      type: 'input',
      topic: 'ΔΙΑΙΡΕΣΗ ΠΡΙΝ ΤΗΝ ΑΦΑΙΡΕΣΗ',
      question: `Υπολόγισε την τιμή: 16 － 8 ： 4`,
      correctAnswer: '14',
      solution: `Προηγείται η διαίρεση: 8 ： 4 ＝ 2. Μετά η αφαίρεση: 16 － 2 ＝ 14.`,
    };
  },

  // 15. Δύναμη σε άθροισμα (Input)
  () => {
    // (2 + 1)^3 - 7 = 3^3 - 7 = 27 - 7 = 20
    return {
      type: 'input',
      topic: 'ΔΥΝΑΜΗ ΑΘΡΟΙΣΜΑΤΟΣ',
      question: `Υπολόγισε την τιμή: (2 ＋ 1)<sup>3</sup> － 7`,
      correctAnswer: '20',
      solution: `Πρώτα το άθροισμα στην παρένθεση: 2 ＋ 1 ＝ 3. Μετά η δύναμη: 3<sup>3</sup> ＝ 27. Τέλος: 27 － 7 ＝ 20.`,
    };
  },

  // 16. Παράσταση με μηδέν (Input)
  () => {
    // 8 + 0 * (4^2 - 5) = 8 + 0 = 8
    return {
      type: 'input',
      topic: 'ΜΗΔΕΝΙΚΟΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
      question: `Υπολόγισε την τιμή: 8 ＋ 0 · (4<sup>2</sup> － 5)`,
      correctAnswer: '8',
      solution: `Οποιοσδήποτε αριθμός πολλαπλασιαστεί με το 0 ισούται με 0. Άρα: 8 ＋ 0 ＝ 8.`,
    };
  },

  // 17. Διαίρεση αρνητικών με πρόσθεση (Input)
  () => {
    // (-15) : (-3) - 7 = 5 - 7 = -2
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟΙ ΣΕ ΔΙΑΙΡΕΣΗ',
      question: `Υπολόγισε την τιμή: (－15) ： (－3) － 7`,
      correctAnswer: '-2',
      solution: `Προηγείται η διαίρεση ομόσημων: (－15) ： (－3) ＝ ＋5. Στη συνέχεια: 5 － 7 ＝ －2.`,
    };
  },

  // 18. Σειρά εκτέλεσης σε διαδοχικές διαιρέσεις (Input)
  () => {
    // 24 : 4 : 2 = 6 : 2 = 3
    return {
      type: 'input',
      topic: 'ΔΙΑΔΟΧΙΚΕΣ ΔΙΑΙΡΕΣΕΙΣ',
      question: `Υπολόγισε την τιμή: 24 ： 4 ： 2`,
      correctAnswer: '3',
      solution: `Εκτελούμε αυστηρά από αριστερά προς τα δεξιά: (24 ： 4) ： 2 ＝ 6 ： 2 ＝ 3.`,
    };
  },

  // 19. Παράσταση με δεκαδικό και δύναμη (Input)
  () => {
    // 10 - 2 * 0.5^2 = 10 - 2 * 0.25 = 10 - 0.5 = 9.5
    return {
      type: 'input',
      topic: 'ΔΕΚΑΔΙΚΟΣ & ΔΥΝΑΜΗ',
      question: `Υπολόγισε την τιμή: 10 － 2 · 0,5<sup>2</sup>`,
      correctAnswer: '9,5',
      solution: `Προηγείται η δύναμη: 0,5<sup>2</sup> ＝ 0,25. Μετά ο πολλαπλασιασμός: 2 · 0,25 ＝ 0,5. Τέλος: 10 － 0,5 ＝ 9,5.`,
    };
  },

  // 20. Σύνθετη αριθμητική παράσταση (Input)
  () => {
    // 5 * 2 + 18 : (3^2) = 10 + 18 : 9 = 10 + 2 = 12
    return {
      type: 'input',
      topic: 'ΣΥΝΘΕΤΗ ΑΡΙΘΜΗΤΙΚΗ',
      question: `Υπολόγισε την τιμή: 5 · 2 ＋ 18 ： 3<sup>2</sup>`,
      correctAnswer: '12',
      solution: `1. Δύναμη: 3<sup>2</sup> ＝ 9. 2. Πολλαπλασιασμός και διαίρεση: 5 · 2 ＝ 10 και 18 ： 9 ＝ 2. 3. Πρόσθεση: 10 ＋ 2 ＝ 12.`,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΠΡΟΒΛΗΜΑΤΑ ΠΟΛΛΑΠΛΩΝ ΠΡΑΞΕΩΝ
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // Πρόβλημα 1: Αγορές στο σούπερ μάρκετ
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Ο Νίκος αγόρασε 3 τετράδια προς 2,50 € το ένα και 4 στυλό προς 1,20 € το ένα. Έδωσε χαρτονόμισμα των 20 €. Πόσα ρέστα πήρε σε ευρώ (παράσταση: 20 － (3 · 2,5 ＋ 4 · 1,2));`,
      correctAnswer: '7,7',
      solution: `Κόστος ＝ 3 · 2,50 ＋ 4 · 1,20 ＝ 7,50 ＋ 4,80 ＝ 12,30 €. Ρέστα ＝ 20 － 12,30 ＝ 7,70 € (γράφεται 7,7).`,
    };
  },

  // Πρόβλημα 2: Εισιτήρια κινηματογράφου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΙΣΙΤΗΡΙΑ',
      question: `Μια παρέα 2 ενηλίκων και 3 παιδιών πήγε σινεμά. Το εισιτήριο ενηλίκων κοστίζει 8 € και το παιδικό 5 €. Αν είχαν συνολική έκπτωση 4 € από κουπόνι, πόσα ευρώ πλήρωσαν (παράσταση: 2 · 8 ＋ 3 · 5 － 4);`,
      correctAnswer: '27',
      solution: `2 · 8 ＋ 3 · 5 － 4 ＝ 16 ＋ 15 － 4 ＝ 31 － 4 ＝ 27 €.`,
    };
  },

  // Πρόβλημα 3: Εμβαδόν πλακόστρωσης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Μια αυλή αποτελείται από ένα ορθογώνιο διαστάσεων 6 m επί 4 m και ένα τετράγωνο παρτέρι πλευράς 3 m που αφαιρείται από το πλακόστρωτο. Ποιο είναι το καθαρό εμβαδόν πλακόστρωσης σε τ.μ. (παράσταση: 6 · 4 － 3<sup>2</sup>);`,
      correctAnswer: '15',
      solution: `6 · 4 － 3<sup>2</sup> ＝ 24 － 9 ＝ 15 τ.μ.`,
    };
  },

  // Πρόβλημα 4: Αμοιβή εργασίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΙΣΘΟΔΟΣΙΑ',
      question: `Ένας τεχνικός χρεώνει 25 € πάγια επίσκεψη και 15 € για κάθε ώρα εργασίας. Αν εργάστηκε 4 ώρες και έγινε έκπτωση 10 €, ποια ήταν η συνολική αμοιβή του σε ευρώ (παράσταση: 25 ＋ 4 · 15 － 10);`,
      correctAnswer: '75',
      solution: `25 ＋ 4 · 15 － 10 ＝ 25 ＋ 60 － 10 ＝ 85 － 10 ＝ 75 €.`,
    };
  },

  // Πρόβλημα 5: Διαχείριση αποταμίευσης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Η Ελένη είχε 50 €. Επί 4 εβδομάδες αποταμίευε 12 € την εβδομάδα και στο τέλος αγόρασε ένα βιβλίο αξίας 28 €. Πόσα χρήματα της έμειναν (παράσταση: 50 ＋ 4 · 12 － 28);`,
      correctAnswer: '70',
      solution: `50 ＋ 4 · 12 － 28 ＝ 50 ＋ 48 － 28 ＝ 98 － 28 ＝ 70 €.`,
    };
  },

  // Πρόβλημα 6: Βαθμολογία διαγωνίσματος
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΒΑΘΜΟΛΟΓΙΑ',
      question: `Σε ένα κουίζ κάθε σωστή απάντηση δίνει ＋4 πόντους και κάθε λάθος αφαιρεί 2 πόντους (－2). Ένας μαθητής είχε 15 σωστές και 5 λάθη. Ποια ήταν η τελική βαθμολογία του (παράσταση: 15 · 4 ＋ 5 · (－2));`,
      correctAnswer: '50',
      solution: `15 · 4 ＋ 5 · (－2) ＝ 60 － 10 ＝ 50 πόντοι.`,
    };
  },

  // Πρόβλημα 7: Χωρητικότητα κιβωτίων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΠΟΘΗΚΗ',
      question: `Σε μια αποθήκη υπάρχουν 5 μεγάλα κιβώτια με 12 μπουκάλια το καθένα και 4 μικρότερα με 6 μπουκάλια το καθένα. Αν αφαιρεθούν 14 μπουκάλια για παραγγελία, πόσα απομένουν (παράσταση: 5 · 12 ＋ 4 · 6 － 14);`,
      correctAnswer: '70',
      solution: `5 · 12 ＋ 4 · 6 － 14 ＝ 60 ＋ 24 － 14 ＝ 84 － 14 ＝ 70 μπουκάλια.`,
    };
  },

  // Πρόβλημα 8: Μεταβολή θερμοκρασίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΘΕΡΜΟΚΡΑΣΙΑ',
      question: `Το πρωί η θερμοκρασία ήταν 2 °C. Τις επόμενες 3 ώρες ανέβαινε κατά 2 °C την ώρα και το βράδυ έπεσε κατά 5 °C. Ποια είναι η τελική θερμοκρασία σε °C (παράσταση: 2 ＋ 3 · 2 － 5);`,
      correctAnswer: '3',
      solution: `2 ＋ 3 · 2 － 5 ＝ 2 ＋ 6 － 5 ＝ 8 － 5 ＝ 3 °C.`,
    };
  },

  // Πρόβλημα 9: Υπολογισμός μέσου όρου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΤΑΤΙΣΤΙΚΗ',
      question: `Ένας μαθητής έγραψε σε τρία τεστ 16, 18 και 17. Ποιος είναι ο μέσος όρος του (παράσταση: (16 ＋ 18 ＋ 17) ： 3);`,
      correctAnswer: '17',
      solution: `(16 ＋ 18 ＋ 17) ： 3 ＝ 51 ： 3 ＝ 17.`,
    };
  },

  // Πρόβλημα 10: Κατανάλωση καυσίμου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ',
      question: `Ένα ντεπόζιτο είχε 60 λίτρα καυσίμου. Σε ένα ταξίδι καταναλώνονταν 6 λίτρα ανά 100 km για 4 εκατοντάδες km και κατόπιν προστέθηκαν 15 λίτρα στο βενζινάδικο. Πόσα λίτρα έχει τώρα (παράσταση: 60 － 4 · 6 ＋ 15);`,
      correctAnswer: '51',
      solution: `60 － 4 · 6 ＋ 15 ＝ 60 － 24 ＋ 15 ＝ 36 ＋ 15 ＝ 51 λίτρα.`,
    };
  },

  // Πρόβλημα 11: Αξία πακέτων προσφοράς
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Ένα κατάστημα πουλάει 3 μπλούζες προς 15 € τη μία. Αν στη δεύτερη και στην τρίτη γίνεται συνολική έκπτωση 8 €, πόσο πληρώνει ο πελάτης (παράσταση: 3 · 15 － 8);`,
      correctAnswer: '37',
      solution: `3 · 15 － 8 ＝ 45 － 8 ＝ 37 €.`,
    };
  },

  // Πρόβλημα 12: Περίμετρος σύνθετου σχήματος
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα σχήμα αποτελείται από 2 πλευρές των 8 cm και 3 πλευρές των 5 cm. Ποια είναι η περίμετρός του σε cm (παράσταση: 2 · 8 ＋ 3 · 5);`,
      correctAnswer: '31',
      solution: `2 · 8 ＋ 3 · 5 ＝ 16 ＋ 15 ＝ 31 cm.`,
    };
  },

  // Πρόβλημα 13: Προγραμματισμός χρόνου μελέτης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΧΡΟΝΟΣ',
      question: `Ο Αλέξανδρος διαβάζει 4 μαθήματα αφιερώνοντας 25 λεπτά στο καθένα και κάνει ένα διάλειμμα 15 λεπτών. Πόσα λεπτά διαρκεί συνολικά η μελέτη του (παράσταση: 4 · 25 ＋ 15);`,
      correctAnswer: '115',
      solution: `4 · 25 ＋ 15 ＝ 100 ＋ 15 ＝ 115 λεπτά.`,
    };
  },

  // Πρόβλημα 14: Κατασκευή περιφράξεων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΣΚΕΥΕΣ',
      question: `Ένας εργάτης είχε 100 μέτρα σύρμα. Περιέφραξε 3 οικόπεδα χρησιμοποιώντας 24 μέτρα για το καθένα και του δόθηκε επιπλέον κουλούρα 15 μέτρων. Πόσα μέτρα σύρμα έχει τώρα (παράσταση: 100 － 3 · 24 ＋ 15);`,
      correctAnswer: '43',
      solution: `100 － 3 · 24 ＋ 15 ＝ 100 － 72 ＋ 15 ＝ 28 ＋ 15 ＝ 43 μέτρα.`,
    };
  },

  // Πρόβλημα 15: Μοίρασμα κερδών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΤΑΙΡΕΙΕΣ',
      question: `Μια επιχείρηση είχε έσοδα 800 € και έξοδα 200 €. Τα καθαρά κέρδη μοιράστηκαν ισόποσα σε 4 εταίρους. Πόσα ευρώ πήρε ο καθένας (παράσταση: (800 － 200) ： 4);`,
      correctAnswer: '150',
      solution: `(800 － 200) ： 4 ＝ 600 ： 4 ＝ 150 €.`,
    };
  },

  // Πρόβλημα 16: Αγορά υλικών συσκευασίας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Αγοράστηκαν 6 χαρτοκιβώτια προς 1,50 € το ένα και 2 ρολά ταινίας προς 2,50 € το ένα. Πόσο ήταν το συνολικό κόστος σε ευρώ (παράσταση: 6 · 1,5 ＋ 2 · 2,5);`,
      correctAnswer: '14',
      solution: `6 · 1,50 ＋ 2 · 2,50 ＝ 9,00 ＋ 5,00 ＝ 14 €.`,
    };
  },

  // Πρόβλημα 17: Χωρητικότητα πισίνας
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΥΔΡΑΥΛΙΚΑ',
      question: `Μια πισίνα αδειάζει με ρυθμό 5 κυβικά μέτρα την ώρα επί 4 ώρες και μετά γεμίζει κατά 12 κυβικά μέτρα. Αν αρχικά είχε 80 κυβικά μέτρα, πόσα έχει τώρα (παράσταση: 80 － 4 · 5 ＋ 12);`,
      correctAnswer: '72',
      solution: `80 － 4 · 5 ＋ 12 ＝ 80 － 20 ＋ 12 ＝ 60 ＋ 12 ＝ 72 κ.μ.`,
    };
  },

  // Πρόβλημα 18: Βάρος φορτίου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ',
      question: `Ένα φορτηγό ζυγίζει 2.000 kg κενό και φορτώθηκαν 8 παλέτες των 250 kg η καθεμία. Στο πρώτο σημείο ξεφορτώθηκαν 500 kg. Ποιο είναι το συνολικό βάρος του φορτηγού σε kg (παράσταση: 2000 ＋ 8 · 250 － 500);`,
      correctAnswer: '3500',
      solution: `2000 ＋ 8 · 250 － 500 ＝ 2000 ＋ 2000 － 500 ＝ 4000 － 500 ＝ 3.500 kg.`,
    };
  },

  // Πρόβλημα 19: Κόστος εκτύπωσης φυλλαδίων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΚΤΥΠΩΣΕΙΣ',
      question: `Ένα τυπογραφείο χρεώνει 30 € πάγια έξοδα προετοιμασίας και 0,10 € ανά φυλλάδιο. Πόσο κοστίζει η εκτύπωση 500 φυλλαδίων (παράσταση: 30 ＋ 500 · 0,1);`,
      correctAnswer: '80',
      solution: `30 ＋ 500 · 0,10 ＝ 30 ＋ 50 ＝ 80 €.`,
    };
  },

  // Πρόβλημα 20: Διάρκεια τηλεφωνικών κλήσεων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΠΙΚΟΙΝΩΝΙΑ',
      question: `Ένας συνδρομητής έκανε 5 κλήσεις διάρκειας 4 λεπτών η καθεμία και 3 κλήσεις διάρκειας 6 λεπτών η καθεμία. Πόσα λεπτά μίλησε συνολικά (παράσταση: 5 · 4 ＋ 3 · 6);`,
      correctAnswer: '38',
      solution: `5 · 4 ＋ 3 · 6 ＝ 20 ＋ 18 ＝ 38 λεπτά.`,
    };
  },
];

export default function ProteraiotitaPrakseonAsk() {
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
      title="Ασκήσεις: Προτεραιότητα Πράξεων στους Ρητούς | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στην ιεραρχία και την προτεραιότητα πράξεων με ρητούς αριθμούς για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/21-proteraiotita-prakseon-riton"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 19 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Προτεραιότητα Πράξεων στους Ρητούς
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 πράξεις και θεωρία προτεραιότητας + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
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
                          placeholder="π.χ. 17 ή -1"
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

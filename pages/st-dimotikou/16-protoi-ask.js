// pages/st-dimotikou/16-protoi-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

// Τυχαιος ακεραιος στο [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ανακατεμα πινακα
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Ελεγχος αν ο αριθμος ειναι πρωτος
function checkIsPrime(n) {
  if (n <= 1) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

// Ευρεση ολων των διαιρετων
function getDivisors(n) {
  const divs = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) divs.push(i);
  }
  return divs;
}

// Δεξαμενη πρωτων και συνθετων αριθμων
const PRIMES_UNDER_50 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
const COMPOSITES_UNDER_50 = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45, 46, 48, 49, 50];

// Διευρυμενη δεξαμενη κανονικων προβληματων για την Ερωτηση 9 (MCQ)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_prime_std_1',
    generate: () => {
      const candidates = [49, 51, 53, 57];
      const primeNum = 53;
      return {
        title: 'ΑΝΑΓΝΩΡΙΣΗ ΠΡΩΤΟΥ ΑΡΙΘΜΟΥ',
        instruction: 'Επιλέξτε ποιος αριθμός είναι πρώτος:',
        text: 'Ποιος από τους παρακάτω αριθμούς είναι πρώτος αριθμός: 49, 51, 53 ή 57;',
        tableData: { col1: 'Υποψήφιοι Αριθμοί', col2: 'Ανάλυση Διαιρετών', r1: ['49, 51, 57', 'Σύνθετοι (διαιρούνται με 7 ή 3)'], r2: ['53', 'Πρώτος (διαιρέτες μόνο 1 και 53) ✅'] },
        optionsRaw: candidates.map(String),
        correctText: String(primeNum),
        explanation: 'Ο αριθμός 53 δεν διαιρείται με το 2, το 3, το 5 ή το 7 και έχει διαιρέτες μόνο το 1 και τον εαυτό του, άρα είναι πρώτος. (49 ＝ 7 · 7, 51 ＝ 3 · 17, 57 ＝ 3 · 19).'
      };
    }
  },
  {
    id: 'p_prime_std_2',
    generate: () => {
      const candidates = [61, 67, 71, 77];
      const compNum = 77;
      return {
        title: 'ΑΝΑΓΝΩΡΙΣΗ ΣΥΝΘΕΤΟΥ ΑΡΙΘΜΟΥ',
        instruction: 'Επιλέξτε ποιος αριθμός είναι σύνθετος:',
        text: 'Ποιος από τους παρακάτω αριθμούς είναι σύνθετος αριθμός: 61, 67, 71 ή 77;',
        tableData: { col1: 'Υποψήφιοι Αριθμοί', col2: 'Ανάλυση Διαιρετών', r1: ['61, 67, 71', 'Πρώτοι αριθμοί'], r2: ['77', 'Σύνθετος (77 ＝ 7 · 11) ✅'] },
        optionsRaw: candidates.map(String),
        correctText: String(compNum),
        explanation: 'Ο αριθμός 77 διαιρείται με το 7 και το 11 (77 ＝ 7 · 11), επομένως έχει περισσότερους από δύο διαιρέτες και είναι σύνθετος. Οι αριθμοί 61, 67 και 71 είναι πρώτοι.'
      };
    }
  },
  {
    id: 'p_prime_std_3',
    generate: () => {
      const candidates = [81, 83, 85, 87];
      const primeNum = 83;
      return {
        title: 'ΑΝΑΖΗΤΗΣΗ ΠΡΩΤΟΥ ΣΤΗΝ ΟΓΔΟΝΤΑΔΑ',
        instruction: 'Επιλέξτε τον πρώτο αριθμό:',
        text: 'Ποιος από τους παρακάτω αριθμούς είναι πρώτος: 81, 83, 85 ή 87;',
        tableData: { col1: 'Υποψήφιοι', col2: 'Έλεγχος Διαιρετότητας', r1: ['81 (διά 9), 85 (διά 5), 87 (διά 3)', 'Σύνθετοι αριθμοί'], r2: ['83', 'Πρώτος αριθμός ✅'] },
        optionsRaw: candidates.map(String),
        correctText: String(primeNum),
        explanation: 'Ο αριθμός 83 είναι πρώτος. Το 81 διαιρείται με το 9, το 85 με το 5 και το 87 με το 3 (8 ＋ 7 ＝ 15).'
      };
    }
  },
  {
    id: 'p_prime_std_4',
    generate: () => {
      const candidates = [91, 93, 95, 97];
      const primeNum = 97;
      return {
        title: 'ΜΕΓΑΛΥΤΕΡΟΣ ΔΙΨΗΦΙΟΣ ΠΡΩΤΟΣ',
        instruction: 'Επιλέξτε τον πρώτο αριθμό:',
        text: 'Ποιος από τους παρακάτω αριθμούς είναι πρώτος: 91, 93, 95 ή 97;',
        tableData: { col1: 'Υποψήφιοι', col2: 'Έλεγχος', r1: ['91 (7·13), 93 (3·31), 95 (5·19)', 'Σύνθετοι'], r2: ['97', 'Πρώτος αριθμός ✅'] },
        optionsRaw: candidates.map(String),
        correctText: String(primeNum),
        explanation: 'Ο αριθμός 97 είναι ο μεγαλύτερος διψήφιος πρώτος. Το 91 ＝ 7 · 13, το 93 ＝ 3 · 31 και το 95 ＝ 5 · 19.'
      };
    }
  },
  {
    id: 'p_prime_std_5',
    generate: () => {
      const candidates = [33, 35, 37, 39];
      const primeNum = 37;
      return {
        title: 'ΑΝΑΖΗΤΗΣΗ ΠΡΩΤΟΥ ΣΤΗΝ ΤΡΙΑΝΤΑΔΑ',
        instruction: 'Επιλέξτε τον πρώτο αριθμό:',
        text: 'Ποιος από τους παρακάτω αριθμούς είναι πρώτος: 33, 35, 37 ή 39;',
        tableData: { col1: 'Αριθμοί', col2: 'Διαιρέτες', r1: ['33 (3·11), 35 (5·7), 39 (3·13)', 'Σύνθετοι'], r2: ['37', 'Πρώτος ✅'] },
        optionsRaw: candidates.map(String),
        correctText: String(primeNum),
        explanation: 'Ο αριθμός 37 έχει διαιρέτες μόνο το 1 και το 37, άρα είναι πρώτος.'
      };
    }
  },
  {
    id: 'p_prime_std_6',
    generate: () => {
      const candidates = [21, 23, 25, 27];
      const primeNum = 23;
      return {
        title: 'ΕΥΡΕΣΗ ΠΡΩΤΟΥ ΣΤΗΝ ΕΙΚΟΣΑΔΑ',
        instruction: 'Επιλέξτε τον πρώτο αριθμό:',
        text: 'Ποιος από τους παρακάτω αριθμούς είναι πρώτος: 21, 23, 25 ή 27;',
        tableData: { col1: 'Υποψήφιοι', col2: 'Ανάλυση', r1: ['21 (3·7), 25 (5·5), 27 (3·9)', 'Σύνθετοι'], r2: ['23', 'Πρώτος ✅'] },
        optionsRaw: candidates.map(String),
        correctText: String(primeNum),
        explanation: 'Ο αριθμός 23 είναι πρώτος, ενώ οι 21, 25 και 27 είναι σύνθετοι.'
      };
    }
  }
];

// Διευρυμενη δεξαμενη προβληματων για την Ερωτηση 10 (MCQ)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_prime_hard_1',
    generate: () => {
      const chairs = 29;
      return {
        title: 'ΔΙΑΤΑΞΗ ΚΑΘΙΣΜΑΤΩΝ ΕΚΔΗΛΩΣΗΣ',
        instruction: 'Επιλέξτε αν είναι δυνατή η διάταξη:',
        text: `Ένας διοργανωτής εκδηλώσεων έχει ${chairs} καρέκλες. Μπορεί να τις τοποθετήσει σε περισσότερες από 1 ίσες σειρές με τον ίδιο αριθμό καθισμάτων χωρίς να περισσέψει καμία;`,
        tableData: { col1: 'Σύνολο Καρεκλών', col2: 'Ιδιότητα Αριθμού', r1: [`${chairs} καρέκλες`, 'Πρώτος αριθμός'], r2: ['Διαιρέτες', 'Μόνο το 1 και το 29 (Όχι ❌)'] },
        optionsRaw: ['Ναι', 'Όχι'],
        correctText: 'Όχι',
        explanation: 'Επειδή ο αριθμός 29 είναι πρώτος, οι μοναδικοί διαιρέτες του είναι το 1 και το 29. Άρα δεν μπορεί να τοποθετηθεί σε περισσότερες από 1 ίσες σειρές χωρίς να περισσέψει καρέκλα.'
      };
    }
  },
  {
    id: 'p_prime_hard_2',
    generate: () => {
      const tiles = 31;
      return {
        title: 'ΟΡΘΟΓΩΝΙΟ ΠΛΑΚΟΣΤΡΩΤΟ ΜΕ ΠΛΑΚΑΚΙΑ',
        instruction: 'Επιλέξτε αν μπορεί να σχηματιστεί ορθογώνιο πλέγμα:',
        text: `Ένας τεχνίτης έχει ${tiles} τετράγωνα πλακάκια. Μπορεί να φτιάξει ένα ορθογώνιο πλακόστρωτο με περισσότερες από μία σειρές και στήλες;`,
        tableData: { col1: 'Πλακάκια', col2: 'Ιδιότητα', r1: [`${tiles} πλακάκια`, 'Πρώτος αριθμός'], r2: ['Διαστάσεις', 'Μόνο 1 · 31 (Όχι ❌)'] },
        optionsRaw: ['Ναι', 'Όχι'],
        correctText: 'Όχι',
        explanation: 'Ο αριθμός 31 είναι πρώτος. Μπορεί να τοποθετηθεί μόνο σε μία ευθεία γραμμή 1 · 31 και όχι σε πολυεπίπεδο ορθογώνιο.'
      };
    }
  },
  {
    id: 'p_prime_hard_3',
    generate: () => {
      const students = 41;
      return {
        title: 'ΙΣΟΜΕΡΗΣ ΚΑΤΑΝΟΜΗ ΜΑΘΗΤΩΝ',
        instruction: 'Επιλέξτε αν μπορούν να σχηματιστούν ισοπληθείς ομάδες:',
        text: `Σε μια κατασκήνωση υπάρχουν ${students} παιδιά. Μπορεί ο υπεύθυνος να χωρίσει τα παιδιά σε ισοπληθείς ομάδες με τουλάχιστον 2 παιδιά σε κάθε ομάδα;`,
        tableData: { col1: 'Παιδιά', col2: 'Έλεγχος', r1: [`${students} παιδιά`, 'Πρώτος αριθμός'], r2: ['Ομάδες', 'Αδύνατος διαχωρισμός (Όχι ❌)'] },
        optionsRaw: ['Ναι', 'Όχι'],
        correctText: 'Όχι',
        explanation: 'Ο αριθμός 41 είναι πρώτος και δεν διαιρείται με κανέναν ακέραιο αριθμό εκτός από το 1 και το 41.'
      };
    }
  },
  {
    id: 'p_prime_hard_4',
    generate: () => {
      const candies = 47;
      return {
        title: 'ΣΥΣΚΕΥΑΣΙΑ ΚΑΡΑΜΕΛΩΝ ΣΕ ΣΑΚΟΥΛΑΚΙΑ',
        instruction: 'Επιλέξτε αν είναι εφικτή η συσκευασία:',
        text: `Μια ζαχαροπλάστης έχει ${candies} καραμέλες. Μπορεί να τις μοιράσει ισόποσα σε περισσότερα από ένα σακουλάκια χωρίς να περισσέψει καμία;`,
        tableData: { col1: 'Καραμέλες', col2: 'Ιδιότητα', r1: [`${candies} καραμέλες`, 'Πρώτος αριθμός'], r2: ['Αποτέλεσμα', 'Μόνο 1 σακουλάκι των 47 (Όχι ❌)'] },
        optionsRaw: ['Ναι', 'Όχι'],
        correctText: 'Όχι',
        explanation: 'Ο αριθμός 47 είναι πρώτος αριθμός, επομένως δεν μπορεί να μοιραστεί ισότιμα σε περισσότερα σακουλάκια.'
      };
    }
  },
  {
    id: 'p_prime_hard_5',
    generate: () => {
      const soldiers = 37;
      return {
        title: 'ΣΧΗΜΑΤΙΣΜΟΣ ΠΑΡΕΛΑΣΗΣ',
        instruction: 'Επιλέξτε αν μπορούν να σχηματιστούν ίσες σειρές:',
        text: `Σε μια παρέλαση συμμετέχουν ${soldiers} άτομα. Μπορούν να παρελάσουν σε ίσες σειρές των 2, 3, 4 ή 5 ατόμων χωρίς να περισσέψει κανείς;`,
        tableData: { col1: 'Άτομα', col2: 'Διαιρέτες', r1: [`${soldiers} άτομα`, 'Πρώτος αριθμός'], r2: ['Έλεγχος', 'Όχι ❌'] },
        optionsRaw: ['Ναι', 'Όχι'],
        correctText: 'Όχι',
        explanation: 'Ο αριθμός 37 είναι πρώτος και δεν διαιρείται με το 2, 3, 4 ή 5.'
      };
    }
  },
  {
    id: 'p_prime_hard_6',
    generate: () => {
      const books = 43;
      return {
        title: 'ΤΟΠΟΘΕΤΗΣΗ ΒΙΒΛΙΩΝ ΣΕ ΡΑΦΙΑ',
        instruction: 'Επιλέξτε αν μπορούν να μοιραστούν ισόποσα:',
        text: `Έχουμε ${books} βιβλία. Μπορούμε να τα τοποθετήσουμε ισόποσα σε περισσότερα από ένα ράφια χωρίς να περισσέψει κανένα;`,
        tableData: { col1: 'Βιβλία', col2: 'Ιδιότητα', r1: [`${books} βιβλία`, 'Πρώτος αριθμός'], r2: ['Ράφια', 'Όχι ❌'] },
        optionsRaw: ['Ναι', 'Όχι'],
        correctText: 'Όχι',
        explanation: 'Ο αριθμός 43 είναι πρώτος και διαιρείται μόνο με το 1 και το 43.'
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (MCQ): Κατηγοριοποίηση Αριθμού (Πρώτος ή Σύνθετος)
  {
    const q1IsPrime = Math.random() > 0.5;
    const q1Num = q1IsPrime 
      ? PRIMES_UNDER_50[randInt(2, PRIMES_UNDER_50.length - 1)] 
      : COMPOSITES_UNDER_50[randInt(2, COMPOSITES_UNDER_50.length - 1)];
    const q1Correct = q1IsPrime ? 'Πρώτος' : 'Σύνθετος';
    const rawOptions = ['Πρώτος', 'Σύνθετος'];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q1Correct
    }));

    qList.push({
      id: 1,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 1 • ΚΑΤΗΓΟΡΙΟΠΟΙΗΣΗ ΑΡΙΘΜΟΥ',
      instruction: 'Χαρακτηρίστε τον αριθμό ως πρώτο ή σύνθετο:',
      prompt: `Ο αριθμός ${q1Num} είναι Πρώτος ή Σύνθετος;`,
      options,
      correctText: q1Correct,
      explanation: q1IsPrime
        ? `Ο αριθμός ${q1Num} έχει μόνο 2 διαιρέτες (το 1 και το ${q1Num}), επομένως είναι Πρώτος.`
        : `Ο αριθμός ${q1Num} έχει διαιρέτες τους: ${getDivisors(q1Num).join(', ')} (περισσότερους από 2), επομένως είναι Σύνθετος.`
    });
  }

  // Q2 (Input - Decimal): Εύρεση του αμέσως επόμενου πρώτου αριθμού
  {
    const baseQ2 = [10, 14, 20, 24, 30, 32, 38, 44][randInt(0, 7)];
    let nextPrime = baseQ2 + 1;
    while (!checkIsPrime(nextPrime)) {
      nextPrime++;
    }

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΕΥΡΕΣΗ ΕΠΟΜΕΝΟΥ ΠΡΩΤΟΥ',
      instruction: 'Συμπληρώστε τον επόμενο πρώτο αριθμό (ακέραιος):',
      prompt: `Ποιος είναι ο αμέσως επόμενος πρώτος αριθμός μετά το ${baseQ2};`,
      correctVal: nextPrime,
      correctStr: String(nextPrime),
      explanation: `Ο αμέσως επόμενος πρώτος αριθμός μετά το ${baseQ2} είναι το ${nextPrime}.`
    });
  }

  // Q3 (MCQ): Επιλογή Πρώτου Αριθμού ανάμεσα σε Σύνθετους
  {
    const q3CorrectPrime = PRIMES_UNDER_50[randInt(3, PRIMES_UNDER_50.length - 1)];
    const q3Composites = shuffle(COMPOSITES_UNDER_50).slice(0, 3);
    const rawOptions = [String(q3CorrectPrime), ...q3Composites.map(String)];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === String(q3CorrectPrime)
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΑΝΑΓΝΩΡΙΣΗ ΠΡΩΤΟΥ ΑΡΙΘΜΟΥ',
      instruction: 'Επιλέξτε ποιος αριθμός είναι πρώτος:',
      prompt: 'Ποιος από τους παρακάτω αριθμούς είναι Πρώτος;',
      options,
      correctText: String(q3CorrectPrime),
      explanation: `Το ${q3CorrectPrime} διαιρείται μόνο με το 1 και τον εαυτό του, άρα είναι Πρώτος.`
    });
  }

  // Q4 (MCQ): Επιλογή Σύνθετου Αριθμού ανάμεσα σε Πρώτους
  {
    const q4CorrectComp = COMPOSITES_UNDER_50[randInt(3, COMPOSITES_UNDER_50.length - 1)];
    const q4Primes = shuffle(PRIMES_UNDER_50).slice(0, 3);
    const rawOptions = [String(q4CorrectComp), ...q4Primes.map(String)];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === String(q4CorrectComp)
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΑΝΑΓΝΩΡΙΣΗ ΣΥΝΘΕΤΟΥ ΑΡΙΘΜΟΥ',
      instruction: 'Επιλέξτε ποιος αριθμός είναι σύνθετος:',
      prompt: 'Ποιος από τους παρακάτω αριθμούς είναι Σύνθετος;',
      options,
      correctText: String(q4CorrectComp),
      explanation: `Το ${q4CorrectComp} έχει διαιρέτες τους: ${getDivisors(q4CorrectComp).join(', ')}, άρα είναι Σύνθετος.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας για το 0 και το 1
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Οι αριθμοί 0 και 1 δεν είναι ούτε πρώτοι ούτε σύνθετοι.'
      : 'Ο αριθμός 1 είναι ο μικρότερος πρώτος αριθμός.';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΕΙΔΙΚΕΣ ΠΕΡΙΠΤΩΣΕΙΣ (0 & 1)',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Το 0 και το 1 δεν ανήκουν ούτε στους πρώτους ούτε στους σύνθετους αριθμούς.'
        : 'Λάθος! Ο μικρότερος πρώτος αριθμός είναι το 2. Το 1 δεν είναι πρώτος αριθμός.'
    });
  }

  // Q6 (MCQ): True / False - Κανόνας για τους ζυγούς αριθμούς
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Ο αριθμός 2 είναι ο μοναδικός ζυγός (άρτιος) πρώτος αριθμός.'
      : 'Όλοι οι ζυγοί (άρτιοι) αριθμοί είναι σύνθετοι.';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΖΥΓΟΙ ΠΡΩΤΟΙ ΑΡΙΘΜΟΙ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Το 2 είναι ο μοναδικός ζυγός πρώτος. Όλοι οι άλλοι ζυγοί διαιρούνται και με το 2, άρα είναι σύνθετοι.'
        : 'Λάθος! Ο αριθμός 2 είναι ζυγός αλλά είναι πρώτος (έχει διαιρέτες μόνο το 1 και το 2).'
    });
  }

  // Q7 (Input - Decimal): Ορθογώνιοι Σχηματισμοί
  {
    const q7Num = [6, 7, 8, 11, 12, 13, 15, 17][randInt(0, 7)];
    const q7Divs = getDivisors(q7Num);
    const q7IsPrime = checkIsPrime(q7Num);
    const q7Correct = q7IsPrime ? 2 : q7Divs.length;

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΟΡΘΟΓΩΝΙΕΣ ΔΙΑΤΑΞΕΙΣ',
      instruction: 'Υπολογίστε το πλήθος των διαφορετικών διατάξεων (ακέραιος):',
      prompt: `Πόσους διαφορετικούς ορθογώνιους σχηματισμούς μπορείς να φτιάξεις με ${q7Num} τετράγωνα κουτάκια;`,
      correctVal: q7Correct,
      correctStr: String(q7Correct),
      explanation: q7IsPrime
        ? `Επειδή το ${q7Num} είναι Πρώτος αριθμός, μπορεί να σχηματίσει μόνο 2 διατάξεις (1 · ${q7Num} και ${q7Num} · 1).`
        : `Το ${q7Num} έχει ${q7Divs.length} διαιρέτες (${q7Divs.join(', ')}), επομένως σχηματίζει ${q7Correct} διαφορετικές ορθογώνιες διατάξεις.`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας (Ισόποσο μοίρασμα σε ομάδες)
  {
    const q8Students = [17, 19, 23, 29, 31][randInt(0, 4)];
    const q8CorrectStr = 'Όχι, γιατί ο αριθμός είναι πρώτος και διαιρείται μόνο με το 1 και τον εαυτό του';
    const q8Wrong1 = 'Ναι, σε 2 ίσες ομάδες';
    const q8Wrong2 = 'Ναι, σε 3 ίσες ομάδες';
    const q8Wrong3 = 'Ναι, σε 5 ίσες ομάδες';

    const rawOptions = [q8CorrectStr, q8Wrong1, q8Wrong2, q8Wrong3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8CorrectStr
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: 'Επιλέξτε τη σωστή απάντηση για το μοίρασμα των μαθητών:',
      prompt: `Μια δασκάλα θέλει να μοιράσει ${q8Students} μαθητές σε ισόποσες ομάδες με περισσότερους από 1 μαθητή. Μπορεί να το κάνει;`,
      options,
      correctText: q8CorrectStr,
      explanation: `Ο αριθμός ${q8Students} είναι πρώτος αριθμός, επομένως δεν μπορεί να χωριστεί σε ισόποσες ομάδες περισσότερων των 1 ατόμων.`
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές (1 Input, 1 MCQ)
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate();
    const hardProb = shuffledHard[0].generate();

    // Q9 (MCQ) - Χωρίς πίνακα στην εκφώνηση
    const optionsQ9 = shuffle([...new Set(stdProb.optionsRaw)]).map((text) => ({
      text,
      isCorrect: text === stdProb.correctText
    }));

    qList.push({
      id: 9,
      type: 'mcq',
      title: `ΕΡΩΤΗΣΗ 9 • ${stdProb.title}`,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      options: optionsQ9,
      correctText: stdProb.correctText,
      explanation: stdProb.explanation
    });

    // Q10 (MCQ) - Χωρίς πίνακα στην εκφώνηση
    const optionsQ10 = shuffle([...new Set(hardProb.optionsRaw)]).map((text) => ({
      text,
      isCorrect: text === hardProb.correctText
    }));

    qList.push({
      id: 10,
      type: 'mcq',
      title: `ΕΡΩΤΗΣΗ 10 • ${hardProb.title}`,
      instruction: hardProb.instruction,
      prompt: hardProb.text,
      tableData: hardProb.tableData,
      options: optionsQ10,
      correctText: hardProb.correctText,
      explanation: hardProb.explanation
    });
  }

  return qList;
}

export default function ProtoiExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργια νεων ασκησεων
  const loadNewSet = useCallback(() => {
    const q = generateQuestions();
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμος Input με καθαρισμο χαρακτηρων (μονο 0-9, οριο 10 χαρακτηρων)
  const handleInputChange = (qId, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/\./g, ',');
    sanitized = sanitized.replace(/[^0-9,]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: sanitized
    }));
  };

  // Χειρισμος MCQ
  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  // Ελεγχος Απαντησεων
  const handleCheckAnswers = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitted) return;

    let currentScore = 0;

    questions.forEach((q) => {
      if (q.type === 'mcq') {
        const userChoice = answers[`q_${q.id}`];
        if (userChoice === q.correctText) {
          currentScore += 1;
        }
      } else if (q.type === 'decimal_input') {
        const userValStr = (answers[`q_${q.id}`] || '').trim().replace(',', '.');
        const userVal = parseFloat(userValStr);
        if (!isNaN(userVal) && Math.abs(userVal - q.correctVal) < 0.05) {
          currentScore += 1;
        }
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  return (
    <Layout
      title="Ασκήσεις: Πρώτοι και Σύνθετοι Αριθμοί - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στους πρώτους και σύνθετους αριθμούς για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/16-protoi"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      {/* Container πληρους ευρους για κινητα εως 2K, 4K & 8K */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-32 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ασκήσεις &amp; Προβλήματα: Πρώτοι &amp; Σύνθετοι Αριθμοί
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες αναγνώρισης πρώτων αριθμών, ορθογώνιων διατάξεων, ιδιοτήτων και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation"
            >
              <span>🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>
          </div>
        </section>

        {/* Λιστα 10 Ασκησεων */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q) => {
            let isCorrect = false;
            if (isSubmitted) {
              if (q.type === 'mcq') {
                isCorrect = answers[`q_${q.id}`] === q.correctText;
              } else if (q.type === 'decimal_input') {
                const uv = parseFloat((answers[`q_${q.id}`] || '').replace(',', '.'));
                isCorrect = !isNaN(uv) && Math.abs(uv - q.correctVal) < 0.05;
              }
            }

            return (
              <article
                key={`q-${q.id}`}
                className={`bg-white rounded-3xl border p-5 sm:p-8 2xl:p-10 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλιδα Ερωτησης (Καθαρα ατονα κεφαλαια εκτος ΣΤ') */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {toCleanUppercase(q.title)}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs 2xl:text-sm font-bold px-3 py-1 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '✓ ΣΩΣΤΟ' : '✗ ΛΑΘΟΣ'}
                    </span>
                  )}
                </div>

                {/* Εκφωνηση (Καθαρο κειμενο χωρις πινακες που προδιδουν τη λυση) */}
                <div className="space-y-3 mb-5">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500">
                        (Ακέραιος αριθμός)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) - Χωρις truncate, πληρες κειμενο break-words */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1">
                              {opt.text}
                            </span>
                            <span
                              className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-xs ${
                                isSelected
                                  ? 'border-white bg-white text-blue-600 font-bold'
                                  : 'border-slate-400 bg-transparent'
                              }`}
                            >
                              {isSelected ? '●' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>

                {/* Feedback μετα την υποβολη (Εδω εμφανιζεται ο αναλυτικος πινακας δεδομενων) */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-2.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? '🎉 Εξαιρετικά!' : '💡 Μαθηματική Επεξήγηση:'}</span>
                    </div>

                    {/* Οργανωτικός Πίνακας Δεδομένων στην Επεξήγηση */}
                    {q.tableData && (
                      <div className="inline-block max-w-full bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-inner my-1 font-mono text-xs sm:text-sm">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                          <span className="bg-blue-100/70 px-2 py-0.5 rounded-lg text-blue-900 break-words">{q.tableData.col1}</span>
                          <span className="bg-emerald-100/70 px-2 py-0.5 rounded-lg text-emerald-900 break-words">{q.tableData.col2}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                          <span>{q.tableData.r1[0]}</span>
                          <span className="text-indigo-700 font-bold">{q.tableData.r1[1]}</span>
                          <span>{q.tableData.r2[0]}</span>
                          <span className="text-amber-600 font-black">{q.tableData.r2[1]}</span>
                        </div>
                      </div>
                    )}

                    <div>{q.explanation}</div>
                    
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800">
                        Σωστή απάντηση:{' '}
                        <span className="font-mono font-bold text-blue-900">
                          {q.correctStr || q.correctText}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Κουμπι Ελεγχου στο τελος της φορμας */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleCheckAnswers}
            disabled={isSubmitted}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Απαντήσεων</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                ΣΚΟΡ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-base">/ 10</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-xs text-slate-400 font-semibold block">
                ΠΟΣΟΣΤΟ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
                {Math.round((score / 10) * 100)} %
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                ΕΛΕΓΧΟΣ
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}

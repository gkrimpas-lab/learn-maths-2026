import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const text = String(str);
  const parts = text.split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function formatNumber(val, locale = 'el') {
  if (val === undefined || val === null || val === '') return '';
  const num = Number(val);
  if (!isNaN(num) && typeof val !== 'boolean') {
    return num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
  }
  return String(val);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function checkIsPrime(n) {
  if (n <= 1) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function getDivisors(n) {
  const divs = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) divs.push(i);
  }
  return divs;
}

const makeUniqueOptions = (correct, candidates) => {
  const unique = new Set([String(correct)]);
  for (const c of candidates) {
    if (c !== undefined && c !== null && String(c).trim() !== '') {
      unique.add(String(c));
    }
    if (unique.size === 4) break;
  }
  return shuffle(Array.from(unique));
};

const PRIMES_UNDER_50 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
const COMPOSITES_UNDER_50 = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45, 46, 48, 49, 50];

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_prime_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const candidates = [49, 51, 53, 57];
      const primeNum = 53;
      return {
        title: isEn ? 'IDENTIFYING A PRIME NUMBER' : 'ΑΝΑΓΝΩΡΙΣΗ ΠΡΩΤΟΥ ΑΡΙΘΜΟΥ',
        instruction: isEn ? 'Select which number is prime:' : 'Επιλέξτε ποιος αριθμός είναι πρώτος:',
        text: isEn
          ? 'Which of the following numbers is a prime number: 49, 51, 53, or 57?'
          : 'Ποιος από τους παρακάτω αριθμούς είναι πρώτος αριθμός: 49, 51, 53 ή 57;',
        tableData: {
          col1: isEn ? 'Candidates' : 'Υποψήφιοι Αριθμοί',
          col2: isEn ? 'Divisor Analysis' : 'Ανάλυση Διαιρετών',
          r1: ['49, 51, 57', isEn ? 'Composite (divisible by 7 or 3)' : 'Σύνθετοι (διαιρούνται με 7 ή 3)'],
          r2: ['53', isEn ? 'Prime (divisors only 1 and 53) ✅' : 'Πρώτος (διαιρέτες μόνο 1 και 53) ✅']
        },
        optionsRaw: candidates.map(String),
        correctText: String(primeNum),
        explanation: isEn
          ? '53 is not divisible by 2, 3, 5, or 7 and has only two divisors: 1 and 53 (49 ＝ 7 · 7, 51 ＝ 3 · 17, 57 ＝ 3 · 19).'
          : 'Ο αριθμός 53 δεν διαιρείται με το 2, το 3, το 5 ή το 7 και έχει διαιρέτες μόνο το 1 και τον εαυτό του, άρα είναι πρώτος (49 ＝ 7 · 7, 51 ＝ 3 · 17, 57 ＝ 3 · 19).'
      };
    }
  },
  {
    id: 'p_prime_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const candidates = [61, 67, 71, 77];
      const compNum = 77;
      return {
        title: isEn ? 'IDENTIFYING A COMPOSITE NUMBER' : 'ΑΝΑΓΝΩΡΙΣΗ ΣΥΝΘΕΤΟΥ ΑΡΙΘΜΟΥ',
        instruction: isEn ? 'Select which number is composite:' : 'Επιλέξτε ποιος αριθμός είναι σύνθετος:',
        text: isEn
          ? 'Which of the following numbers is a composite number: 61, 67, 71, or 77?'
          : 'Ποιος από τους παρακάτω αριθμούς είναι σύνθετος αριθμός: 61, 67, 71 ή 77;',
        tableData: {
          col1: isEn ? 'Candidates' : 'Υποψήφιοι Αριθμοί',
          col2: isEn ? 'Divisor Analysis' : 'Ανάλυση Διαιρετών',
          r1: ['61, 67, 71', isEn ? 'Prime numbers' : 'Πρώτοι αριθμοί'],
          r2: ['77', isEn ? 'Composite (77 ＝ 7 · 11) ✅' : 'Σύνθετος (77 ＝ 7 · 11) ✅']
        },
        optionsRaw: candidates.map(String),
        correctText: String(compNum),
        explanation: isEn
          ? '77 divides by 7 and 11 (77 ＝ 7 · 11), having more than two divisors, making it composite. 61, 67, and 71 are primes.'
          : 'Ο αριθμός 77 διαιρείται με το 7 και το 11 (77 ＝ 7 · 11), επομένως έχει περισσότερους από δύο διαιρέτες και είναι σύνθετος. Οι αριθμοί 61, 67 και 71 είναι πρώτοι.'
      };
    }
  },
  {
    id: 'p_prime_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const candidates = [81, 83, 85, 87];
      const primeNum = 83;
      return {
        title: isEn ? 'FINDING A PRIME IN THE 80s' : 'ΑΝΑΖΗΤΗΣΗ ΠΡΩΤΟΥ ΣΤΗΝ ΟΓΔΟΝΤΑΔΑ',
        instruction: isEn ? 'Select the prime number:' : 'Επιλέξτε τον πρώτο αριθμό:',
        text: isEn
          ? 'Which of the following numbers is prime: 81, 83, 85, or 87?'
          : 'Ποιος από τους παρακάτω αριθμούς είναι πρώτος: 81, 83, 85 ή 87;',
        tableData: {
          col1: isEn ? 'Candidates' : 'Υποψήφιοι',
          col2: isEn ? 'Divisibility Check' : 'Έλεγχος Διαιρετότητας',
          r1: [isEn ? '81 (: 9), 85 (: 5), 87 (: 3)' : '81 (: 9), 85 (: 5), 87 (: 3)', isEn ? 'Composite numbers' : 'Σύνθετοι αριθμοί'],
          r2: ['83', isEn ? 'Prime number ✅' : 'Πρώτος αριθμός ✅']
        },
        optionsRaw: candidates.map(String),
        correctText: String(primeNum),
        explanation: isEn
          ? '83 is prime. 81 is divisible by 9, 85 by 5, and 87 by 3 (8 ＋ 7 ＝ 15).'
          : 'Ο αριθμός 83 είναι πρώτος. Το 81 διαιρείται με το 9, το 85 με το 5 και το 87 με το 3 (8 ＋ 7 ＝ 15).'
      };
    }
  },
  {
    id: 'p_prime_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const candidates = [91, 93, 95, 97];
      const primeNum = 97;
      return {
        title: isEn ? 'LARGEST TWO-DIGIT PRIME' : 'ΜΕΓΑΛΥΤΕΡΟΣ ΔΙΨΗΦΙΟΣ ΠΡΩΤΟΣ',
        instruction: isEn ? 'Select the prime number:' : 'Επιλέξτε τον πρώτο αριθμό:',
        text: isEn
          ? 'Which of the following numbers is prime: 91, 93, 95, or 97?'
          : 'Ποιος από τους παρακάτω αριθμούς είναι πρώτος: 91, 93, 95 ή 97;',
        tableData: {
          col1: isEn ? 'Candidates' : 'Υποψήφιοι',
          col2: isEn ? 'Check' : 'Έλεγχος',
          r1: ['91 (7 · 13), 93 (3 · 31), 95 (5 · 19)', isEn ? 'Composite' : 'Σύνθετοι'],
          r2: ['97', isEn ? 'Prime number ✅' : 'Πρώτος αριθμός ✅']
        },
        optionsRaw: candidates.map(String),
        correctText: String(primeNum),
        explanation: isEn
          ? '97 is the largest two-digit prime number. 91 ＝ 7 · 13, 93 ＝ 3 · 31, and 95 ＝ 5 · 19.'
          : 'Ο αριθμός 97 είναι ο μεγαλύτερος διψήφιος πρώτος. Το 91 ＝ 7 · 13, το 93 ＝ 3 · 31 και το 95 ＝ 5 · 19.'
      };
    }
  },
  {
    id: 'p_prime_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const candidates = [33, 35, 37, 39];
      const primeNum = 37;
      return {
        title: isEn ? 'FINDING A PRIME IN THE 30s' : 'ΑΝΑΖΗΤΗΣΗ ΠΡΩΤΟΥ ΣΤΗΝ ΤΡΙΑΝΤΑΔΑ',
        instruction: isEn ? 'Select the prime number:' : 'Επιλέξτε τον πρώτο αριθμό:',
        text: isEn
          ? 'Which of the following numbers is prime: 33, 35, 37, or 39?'
          : 'Ποιος από τους παρακάτω αριθμούς είναι πρώτος: 33, 35, 37 ή 39;',
        tableData: {
          col1: isEn ? 'Numbers' : 'Αριθμοί',
          col2: isEn ? 'Divisors' : 'Διαιρέτες',
          r1: ['33 (3 · 11), 35 (5 · 7), 39 (3 · 13)', isEn ? 'Composite' : 'Σύνθετοι'],
          r2: ['37', isEn ? 'Prime ✅' : 'Πρώτος ✅']
        },
        optionsRaw: candidates.map(String),
        correctText: String(primeNum),
        explanation: isEn
          ? '37 has only 1 and 37 as divisors, making it prime.'
          : 'Ο αριθμός 37 έχει διαιρέτες μόνο το 1 και το 37, άρα είναι πρώτος.'
      };
    }
  },
  {
    id: 'p_prime_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const candidates = [21, 23, 25, 27];
      const primeNum = 23;
      return {
        title: isEn ? 'FINDING A PRIME IN THE 20s' : 'ΕΥΡΕΣΗ ΠΡΩΤΟΥ ΣΤΗΝ ΕΙΚΟΣΑΔΑ',
        instruction: isEn ? 'Select the prime number:' : 'Επιλέξτε τον πρώτο αριθμό:',
        text: isEn
          ? 'Which of the following numbers is prime: 21, 23, 25, or 27?'
          : 'Ποιος από τους παρακάτω αριθμούς είναι πρώτος: 21, 23, 25 ή 27;',
        tableData: {
          col1: isEn ? 'Candidates' : 'Υποψήφιοι',
          col2: isEn ? 'Analysis' : 'Ανάλυση',
          r1: ['21 (3 · 7), 25 (5 · 5), 27 (3 · 9)', isEn ? 'Composite' : 'Σύνθετοι'],
          r2: ['23', isEn ? 'Prime ✅' : 'Πρώτος ✅']
        },
        optionsRaw: candidates.map(String),
        correctText: String(primeNum),
        explanation: isEn
          ? '23 is a prime number, while 21, 25, and 27 are composite.'
          : 'Ο αριθμός 23 είναι πρώτος, ενώ οι 21, 25 και 27 είναι σύνθετοι.'
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_prime_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const chairs = 29;
      const correctText = isEn
        ? 'No, because 29 is prime'
        : 'Όχι, γιατί το 29 είναι πρώτος αριθμός';
      const wrongCandidates = isEn
        ? [
            'Yes, in 2 equal rows',
            'Yes, in 3 equal rows',
            'Yes, in 5 equal rows'
          ]
        : [
            'Ναι, σε 2 ίσες σειρές',
            'Ναι, σε 3 ίσες σειρές',
            'Ναι, σε 5 ίσες σειρές'
          ];
      return {
        title: isEn ? 'EVENT SEATING ARRANGEMENT' : 'ΔΙΑΤΑΞΗ ΚΑΘΙΣΜΑΤΩΝ ΕΚΔΗΛΩΣΗΣ',
        instruction: isEn ? 'Select whether multiple equal rows are possible:' : 'Επιλέξτε αν είναι δυνατή η διάταξη:',
        text: isEn
          ? `An event organizer has ${chairs} chairs. Can he arrange them in more than 1 equal row with the same number of chairs without any left over?`
          : `Ένας διοργανωτής εκδηλώσεων έχει ${chairs} καρέκλες. Μπορεί να τις τοποθετήσει σε περισσότερες από 1 ίσες σειρές με τον ίδιο αριθμό καθισμάτων χωρίς να περισσέψει καμία;`,
        tableData: {
          col1: isEn ? 'Total Chairs' : 'Σύνολο Καρεκλών',
          col2: isEn ? 'Number Property' : 'Ιδιότητα Αριθμού',
          r1: [isEn ? `${chairs} chairs` : `${chairs} καρέκλες`, isEn ? 'Prime number' : 'Πρώτος αριθμός'],
          r2: [isEn ? 'Divisors' : 'Διαιρέτες', isEn ? 'Only 1 and 29 (No ❌)' : 'Μόνο το 1 και το 29 (Όχι ❌)']
        },
        optionsRaw: makeUniqueOptions(correctText, wrongCandidates),
        correctText,
        explanation: isEn
          ? 'Because 29 is prime, its only divisors are 1 and 29. Therefore, it cannot be arranged in more than 1 equal row without chairs remaining.'
          : 'Επειδή ο αριθμός 29 είναι πρώτος, οι μοναδικοί διαιρέτες του είναι το 1 και το 29. Άρα δεν μπορεί να τοποθετηθεί σε περισσότερες από 1 ίσες σειρές χωρίς να περισσέψει καρέκλα.'
      };
    }
  },
  {
    id: 'p_prime_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const tiles = 31;
      const correctText = isEn
        ? 'No, it can form only a single line (1 · 31)'
        : 'Όχι, σχηματίζει μόνο μία ευθεία γραμμή (1 · 31)';
      const wrongCandidates = isEn
        ? [
            'Yes, in a 2 · 15 grid',
            'Yes, in a 3 · 10 grid',
            'Yes, in a 4 · 8 grid'
          ]
        : [
            'Ναι, σε πλέγμα 2 · 15',
            'Ναι, σε πλέγμα 3 · 10',
            'Ναι, σε πλέγμα 4 · 8'
          ];
      return {
        title: isEn ? 'RECTANGULAR TILE LAYOUT' : 'ΟΡΘΟΓΩΝΙΟ ΠΛΑΚΟΣΤΡΩΤΟ ΜΕ ΠΛΑΚΑΚΙΑ',
        instruction: isEn ? 'Select whether a multi-row rectangular grid can be formed:' : 'Επιλέξτε αν μπορεί να σχηματιστεί ορθογώνιο πλέγμα:',
        text: isEn
          ? `A craftsman has ${tiles} square tiles. Can he build a rectangular paving layout with more than one row and column?`
          : `Ένας τεχνίτης έχει ${tiles} τετράγωνα πλακάκια. Μπορεί να φτιάξει ένα ορθογώνιο πλακόστρωτο με περισσότερες από μία σειρές και στήλες;`,
        tableData: {
          col1: isEn ? 'Tiles' : 'Πλακάκια',
          col2: isEn ? 'Property' : 'Ιδιότητα',
          r1: [isEn ? `${tiles} tiles` : `${tiles} πλακάκια`, isEn ? 'Prime number' : 'Πρώτος αριθμός'],
          r2: [isEn ? 'Dimensions' : 'Διαστάσεις', isEn ? 'Only 1 · 31 (No ❌)' : 'Μόνο 1 · 31 (Όχι ❌)']
        },
        optionsRaw: makeUniqueOptions(correctText, wrongCandidates),
        correctText,
        explanation: isEn
          ? '31 is a prime number. It can only be arranged in a single line (1 · 31) and not into a multi-row grid.'
          : 'Ο αριθμός 31 είναι πρώτος. Μπορεί να τοποθετηθεί μόνο σε μία ευθεία γραμμή 1 · 31 και όχι σε πολυεπίπεδο ορθογώνιο.'
      };
    }
  },
  {
    id: 'p_prime_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const students = 41;
      const correctText = isEn
        ? 'No, because 41 is a prime number'
        : 'Όχι, διότι το 41 είναι πρώτος αριθμός';
      const wrongCandidates = isEn
        ? [
            'Yes, into 3 equal teams',
            'Yes, into 4 equal teams',
            'Yes, into 5 equal teams'
          ]
        : [
            'Ναι, σε 3 ισοπληθείς ομάδες',
            'Ναι, σε 4 ισοπληθείς ομάδες',
            'Ναι, σε 5 ισοπληθείς ομάδες'
          ];
      return {
        title: isEn ? 'EQUAL STUDENT GROUPING' : 'ΙΣΟΜΕΡΗΣ ΚΑΤΑΝΟΜΗ ΜΑΘΗΤΩΝ',
        instruction: isEn ? 'Select whether equal groups can be formed:' : 'Επιλέξτε αν μπορούν να σχηματιστούν ισοπληθείς ομάδες:',
        text: isEn
          ? `In a camp there are ${students} children. Can the leader divide them into equal teams with at least 2 children in each team?`
          : `Σε μια κατασκήνωση υπάρχουν ${students} παιδιά. Μπορεί ο υπεύθυνος να χωρίσει τα παιδιά σε ισοπληθείς ομάδες με τουλάχιστον 2 παιδιά σε κάθε ομάδα;`,
        tableData: {
          col1: isEn ? 'Children' : 'Παιδιά',
          col2: isEn ? 'Check' : 'Έλεγχος',
          r1: [isEn ? `${students} children` : `${students} παιδιά`, isEn ? 'Prime number' : 'Πρώτος αριθμός'],
          r2: [isEn ? 'Teams' : 'Ομάδες', isEn ? 'Impossible partition (No ❌)' : 'Αδύνατος διαχωρισμός (Όχι ❌)']
        },
        optionsRaw: makeUniqueOptions(correctText, wrongCandidates),
        correctText,
        explanation: isEn
          ? '41 is prime and is not divisible by any integer other than 1 and 41.'
          : 'Ο αριθμός 41 είναι πρώτος και δεν διαιρείται με κανέναν ακέραιο αριθμό εκτός από το 1 και το 41.'
      };
    }
  },
  {
    id: 'p_prime_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const candies = 47;
      const correctText = isEn
        ? 'No, 47 cannot be divided equally across bags'
        : 'Όχι, το 47 δεν μοιράζεται ισόποσα σε σακουλάκια';
      const wrongCandidates = isEn
        ? [
            'Yes, in bags of 3 candies',
            'Yes, in bags of 5 candies',
            'Yes, in bags of 7 candies'
          ]
        : [
            'Ναι, σε σακουλάκια των 3 καραμελών',
            'Ναι, σε σακουλάκια των 5 καραμελών',
            'Ναι, σε σακουλάκια των 7 καραμελών'
          ];
      return {
        title: isEn ? 'PACKING CANDIES INTO BAGS' : 'ΣΥΣΚΕΥΑΣΙΑ ΚΑΡΑΜΕΛΩΝ ΣΕ ΣΑΚΟΥΛΑΚΙΑ',
        instruction: isEn ? 'Select whether equal packaging is feasible:' : 'Επιλέξτε αν είναι εφικτή η συσκευασία:',
        text: isEn
          ? `A confectioner has ${candies} candies. Can she pack them equally into more than one bag without any left over?`
          : `Ένας ζαχαροπλάστης έχει ${candies} καραμέλες. Μπορεί να τις μοιράσει ισόποσα σε περισσότερα από ένα σακουλάκια χωρίς να περισσέψει καμία;`,
        tableData: {
          col1: isEn ? 'Candies' : 'Καραμέλες',
          col2: isEn ? 'Property' : 'Ιδιότητα',
          r1: [isEn ? `${candies} candies` : `${candies} καραμέλες`, isEn ? 'Prime number' : 'Πρώτος αριθμός'],
          r2: [isEn ? 'Result' : 'Αποτέλεσμα', isEn ? 'Only 1 bag of 47 (No ❌)' : 'Μόνο 1 σακουλάκι των 47 (Όχι ❌)']
        },
        optionsRaw: makeUniqueOptions(correctText, wrongCandidates),
        correctText,
        explanation: isEn
          ? '47 is prime, so it cannot be shared equally across multiple bags.'
          : 'Ο αριθμός 47 είναι πρώτος αριθμός, επομένως δεν μπορεί να μοιραστεί ισόποσα σε περισσότερα σακουλάκια.'
      };
    }
  },
  {
    id: 'p_prime_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const soldiers = 37;
      const correctText = isEn
        ? 'No, 37 is prime and leaves a remainder'
        : 'Όχι, το 37 είναι πρώτος και αφήνει υπόλοιπο';
      const wrongCandidates = isEn
        ? [
            'Yes, in equal rows of 2',
            'Yes, in equal rows of 3',
            'Yes, in equal rows of 5'
          ]
        : [
            'Ναι, σε ίσες σειρές των 2',
            'Ναι, σε ίσες σειρές των 3',
            'Ναι, σε ίσες σειρές των 5'
          ];
      return {
        title: isEn ? 'PARADE FORMATION' : 'ΣΧΗΜΑΤΙΣΜΟΣ ΠΑΡΕΛΑΣΗΣ',
        instruction: isEn ? 'Select whether equal rows can be formed:' : 'Επιλέξτε αν μπορούν να σχηματιστούν ίσες σειρές:',
        text: isEn
          ? `In a parade, ${soldiers} people participate. Can they march in equal rows of 2, 3, 4, or 5 people without anyone left over?`
          : `Σε μια παρέλαση συμμετέχουν ${soldiers} άτομα. Μπορούν να παρελάσουν σε ίσες σειρές των 2, 3, 4 ή 5 ατόμων χωρίς να περισσέψει κανένα άτομο;`,
        tableData: {
          col1: isEn ? 'Participants' : 'Άτομα',
          col2: isEn ? 'Divisors' : 'Διαιρέτες',
          r1: [isEn ? `${soldiers} people` : `${soldiers} άτομα`, isEn ? 'Prime number' : 'Πρώτος αριθμός'],
          r2: [isEn ? 'Check' : 'Έλεγχος', isEn ? 'No ❌' : 'Όχι ❌']
        },
        optionsRaw: makeUniqueOptions(correctText, wrongCandidates),
        correctText,
        explanation: isEn
          ? '37 is prime and is not divisible by 2, 3, 4, or 5.'
          : 'Ο αριθμός 37 είναι πρώτος και δεν διαιρείται με το 2, 3, 4 ή 5.'
      };
    }
  },
  {
    id: 'p_prime_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const books = 43;
      const correctText = isEn
        ? 'No, 43 is prime and has no divisors except 1 and 43'
        : 'Όχι, το 43 είναι πρώτος και δεν έχει άλλους διαιρέτες εκτός από 1 και 43';
      const wrongCandidates = isEn
        ? [
            'Yes, equally across 2 shelves',
            'Yes, equally across 3 shelves',
            'Yes, equally across 4 shelves'
          ]
        : [
            'Ναι, ισόποσα σε 2 ράφια',
            'Ναι, ισόποσα σε 3 ράφια',
            'Ναι, ισόποσα σε 4 ράφια'
          ];
      return {
        title: isEn ? 'ARRANGING BOOKS ON SHELVES' : 'ΤΟΠΟΘΕΤΗΣΗ ΒΙΒΛΙΩΝ ΣΕ ΡΑΦΙΑ',
        instruction: isEn ? 'Select whether equal shelving is possible:' : 'Επιλέξτε αν μπορούν να μοιραστούν ισόποσα:',
        text: isEn
          ? `We have ${books} books. Can we place them equally across more than one shelf without any left over?`
          : `Έχουμε ${books} βιβλία. Μπορούμε να τα τοποθετήσουμε ισόποσα σε περισσότερα από ένα ράφια χωρίς να περισσέψει κανένα;`,
        tableData: {
          col1: isEn ? 'Books' : 'Βιβλία',
          col2: isEn ? 'Property' : 'Ιδιότητα',
          r1: [isEn ? `${books} books` : `${books} βιβλία`, isEn ? 'Prime number' : 'Πρώτος αριθμός'],
          r2: [isEn ? 'Shelves' : 'Ράφια', isEn ? 'No ❌' : 'Όχι ❌']
        },
        optionsRaw: makeUniqueOptions(correctText, wrongCandidates),
        correctText,
        explanation: isEn
          ? '43 is prime and is divisible only by 1 and 43.'
          : 'Ο αριθμός 43 είναι πρώτος και διαιρείται μόνο με το 1 και το 43.'
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const qList = [];
  const primeWord = isEn ? 'Prime' : 'Πρώτος';
  const compositeWord = isEn ? 'Composite' : 'Σύνθετος';

  // Q1 (MCQ): Κατηγοριοποίηση Αριθμού (Πρώτος ή Σύνθετος)
  {
    const q1IsPrime = Math.random() > 0.5;
    const q1Num = q1IsPrime 
      ? PRIMES_UNDER_50[randInt(2, PRIMES_UNDER_50.length - 1)] 
      : COMPOSITES_UNDER_50[randInt(2, COMPOSITES_UNDER_50.length - 1)];
    const q1Correct = q1IsPrime ? primeWord : compositeWord;
    const rawOptions = [primeWord, compositeWord];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q1Correct
    }));

    qList.push({
      id: 1,
      type: 'mcq',
      title: isEn ? 'QUESTION 1 • NUMBER CLASSIFICATION' : 'ΕΡΩΤΗΣΗ 1 • ΚΑΤΗΓΟΡΙΟΠΟΙΗΣΗ ΑΡΙΘΜΟΥ',
      instruction: isEn ? 'Classify number as prime or composite:' : 'Χαρακτηρίστε τον αριθμό ως πρώτο ή σύνθετο:',
      prompt: isEn ? `Is the number ${q1Num} Prime or Composite?` : `Ο αριθμός ${q1Num} είναι Πρώτος ή Σύνθετος;`,
      options,
      correctText: q1Correct,
      correctStr: q1Correct,
      explanation: q1IsPrime
        ? (isEn
            ? `The number ${q1Num} has exactly 2 divisors (1 and ${q1Num}), so it is Prime.`
            : `Ο αριθμός ${q1Num} έχει μόνο 2 διαιρέτες (το 1 και το ${q1Num}), επομένως είναι Πρώτος.`)
        : (isEn
            ? `The number ${q1Num} has divisors: ${getDivisors(q1Num).join(', ')} (more than 2), so it is Composite.`
            : `Ο αριθμός ${q1Num} έχει διαιρέτες τους: ${getDivisors(q1Num).join(', ')} (περισσότερους από 2), επομένως είναι Σύνθετος.`)
    });
  }

  // Q2 (Input): Εύρεση του αμέσως επόμενου πρώτου αριθμού
  {
    const baseQ2 = [10, 14, 20, 24, 30, 32, 38, 44][randInt(0, 7)];
    let nextPrime = baseQ2 + 1;
    while (!checkIsPrime(nextPrime)) {
      nextPrime++;
    }

    qList.push({
      id: 2,
      type: 'integer_input',
      title: isEn ? 'QUESTION 2 • FINDING NEXT PRIME' : 'ΕΡΩΤΗΣΗ 2 • ΕΥΡΕΣΗ ΕΠΟΜΕΝΟΥ ΠΡΩΤΟΥ',
      instruction: isEn ? 'Enter the next prime number (integer):' : 'Συμπληρώστε τον επόμενο πρώτο αριθμό (ακέραιος):',
      prompt: isEn ? `What is the immediate next prime number after ${baseQ2}?` : `Ποιος είναι ο αμέσως επόμενος πρώτος αριθμός μετά το ${baseQ2};`,
      correctVal: nextPrime,
      correctStr: String(nextPrime),
      explanation: isEn
        ? `The immediate next prime number after ${baseQ2} is ${nextPrime}.`
        : `Ο αμέσως επόμενος πρώτος αριθμός μετά το ${baseQ2} είναι το ${nextPrime}.`
    });
  }

  // Q3 (MCQ): Επιλογή Πρώτου Αριθμού ανάμεσα σε Σύνθετους
  {
    const q3CorrectPrime = PRIMES_UNDER_50[randInt(3, PRIMES_UNDER_50.length - 1)];
    const q3Composites = shuffle(COMPOSITES_UNDER_50).slice(0, 5);
    const optionsRaw = makeUniqueOptions(q3CorrectPrime, q3Composites);
    const options = optionsRaw.map((text) => ({
      text,
      isCorrect: text === String(q3CorrectPrime)
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • IDENTIFYING A PRIME NUMBER' : 'ΕΡΩΤΗΣΗ 3 • ΑΝΑΓΝΩΡΙΣΗ ΠΡΩΤΟΥ ΑΡΙΘΜΟΥ',
      instruction: isEn ? 'Select which number is prime:' : 'Επιλέξτε ποιος αριθμός είναι πρώτος:',
      prompt: isEn ? 'Which of the following numbers is Prime?' : 'Ποιος από τους παρακάτω αριθμούς είναι Πρώτος;',
      options,
      correctText: String(q3CorrectPrime),
      correctStr: String(q3CorrectPrime),
      explanation: isEn
        ? `${q3CorrectPrime} is divisible only by 1 and itself, so it is Prime.`
        : `Το ${q3CorrectPrime} διαιρείται μόνο με το 1 και τον εαυτό του, άρα είναι Πρώτος.`
    });
  }

  // Q4 (MCQ): Επιλογή Σύνθετου Αριθμού ανάμεσα σε Πρώτους
  {
    const q4CorrectComp = COMPOSITES_UNDER_50[randInt(3, COMPOSITES_UNDER_50.length - 1)];
    const q4Primes = shuffle(PRIMES_UNDER_50).slice(0, 5);
    const optionsRaw = makeUniqueOptions(q4CorrectComp, q4Primes);
    const options = optionsRaw.map((text) => ({
      text,
      isCorrect: text === String(q4CorrectComp)
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • IDENTIFYING A COMPOSITE NUMBER' : 'ΕΡΩΤΗΣΗ 4 • ΑΝΑΓΝΩΡΙΣΗ ΣΥΝΘΕΤΟΥ ΑΡΙΘΜΟΥ',
      instruction: isEn ? 'Select which number is composite:' : 'Επιλέξτε ποιος αριθμός είναι σύνθετος:',
      prompt: isEn ? 'Which of the following numbers is Composite?' : 'Ποιος από τους παρακάτω αριθμούς είναι Σύνθετος;',
      options,
      correctText: String(q4CorrectComp),
      correctStr: String(q4CorrectComp),
      explanation: isEn
        ? `${q4CorrectComp} has divisors: ${getDivisors(q4CorrectComp).join(', ')}, so it is Composite.`
        : `Το ${q4CorrectComp} έχει διαιρέτες τους: ${getDivisors(q4CorrectComp).join(', ')}, άρα είναι Σύνθετος.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας για το 0 και το 1
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? 'The numbers 0 and 1 are neither prime nor composite.'
          : 'The number 1 is the smallest prime number.')
      : (q5IsTrue
          ? 'Οι αριθμοί 0 και 1 δεν είναι ούτε πρώτοι ούτε σύνθετοι.'
          : 'Ο αριθμός 1 είναι ο μικρότερος πρώτος αριθμός.');
    const labelTrue = isEn ? 'True' : 'Σωστό';
    const labelFalse = isEn ? 'False' : 'Λάθος';
    const correctAns = q5IsTrue ? labelTrue : labelFalse;

    const options = [
      { text: labelTrue, isCorrect: q5IsTrue },
      { text: labelFalse, isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: isEn ? 'QUESTION 5 • SPECIAL CASES (0 & 1)' : 'ΕΡΩΤΗΣΗ 5 • ΕΙΔΙΚΕΣ ΠΕΡΙΠΤΩΣΕΙΣ (0 & 1)',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      correctStr: correctAns,
      explanation: q5IsTrue
        ? (isEn
            ? 'Correct! 0 and 1 are neither prime nor composite numbers.'
            : 'Σωστό! Το 0 και το 1 δεν ανήκουν ούτε στους πρώτους ούτε στους σύνθετους αριθμούς.')
        : (isEn
            ? 'False! The smallest prime number is 2. The number 1 is not prime.'
            : 'Λάθος! Ο μικρότερος πρώτος αριθμός είναι το 2. Το 1 δεν είναι πρώτος αριθμός.')
    });
  }

  // Q6 (MCQ): True / False - Κανόνας για τους ζυγούς αριθμούς
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? 'The number 2 is the only even prime number.'
          : 'All even numbers are composite.')
      : (q6IsTrue
          ? 'Ο αριθμός 2 είναι ο μοναδικός ζυγός (άρτιος) πρώτος αριθμός.'
          : 'Όλοι οι ζυγοί (άρτιοι) αριθμοί είναι σύνθετοι.');
    const labelTrue = isEn ? 'True' : 'Σωστό';
    const labelFalse = isEn ? 'False' : 'Λάθος';
    const correctAns = q6IsTrue ? labelTrue : labelFalse;

    const options = [
      { text: labelTrue, isCorrect: q6IsTrue },
      { text: labelFalse, isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: isEn ? 'QUESTION 6 • EVEN PRIME NUMBERS' : 'ΕΡΩΤΗΣΗ 6 • ΖΥΓΟΙ ΠΡΩΤΟΙ ΑΡΙΘΜΟΙ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      correctStr: correctAns,
      explanation: q6IsTrue
        ? (isEn
            ? 'Correct! 2 is the only even prime. All other even numbers are divisible by 2 and thus composite.'
            : 'Σωστό! Το 2 είναι ο μοναδικός ζυγός πρώτος. Όλοι οι άλλοι ζυγοί διαιρούνται και με το 2, άρα είναι σύνθετοι.')
        : (isEn
            ? 'False! The number 2 is even but prime (having only 1 and 2 as divisors).'
            : 'Λάθος! Ο αριθμός 2 είναι ζυγός αλλά είναι πρώτος (έχει διαιρέτες μόνο το 1 και το 2).')
    });
  }

  // Q7 (Input): Ορθογώνιοι Σχηματισμοί
  {
    const q7Num = [6, 7, 8, 11, 12, 13, 15, 17][randInt(0, 7)];
    const q7Divs = getDivisors(q7Num);
    const q7IsPrime = checkIsPrime(q7Num);
    const q7Correct = q7IsPrime ? 2 : q7Divs.length;

    qList.push({
      id: 7,
      type: 'integer_input',
      title: isEn ? 'QUESTION 7 • RECTANGULAR LAYOUTS' : 'ΕΡΩΤΗΣΗ 7 • ΟΡΘΟΓΩΝΙΕΣ ΔΙΑΤΑΞΕΙΣ',
      instruction: isEn ? 'Calculate the number of different rectangular layouts (integer):' : 'Υπολογίστε το πλήθος των διαφορετικών διατάξεων (ακέραιος):',
      prompt: isEn
        ? `How many distinct rectangular grid formations can you build with ${q7Num} unit squares?`
        : `Πόσους διαφορετικούς ορθογώνιους σχηματισμούς μπορείς να φτιάξεις με ${q7Num} τετράγωνα κουτάκια;`,
      correctVal: q7Correct,
      correctStr: String(q7Correct),
      explanation: q7IsPrime
        ? (isEn
            ? `Because ${q7Num} is prime, it can form only 2 layouts (1 · ${q7Num} and ${q7Num} · 1).`
            : `Επειδή το ${q7Num} είναι Πρώτος αριθμός, μπορεί να σχηματίσει μόνο 2 διατάξεις (1 · ${q7Num} και ${q7Num} · 1).`)
        : (isEn
            ? `${q7Num} has ${q7Divs.length} divisors (${q7Divs.join(', ')}), so it forms ${q7Correct} distinct rectangular layouts.`
            : `Το ${q7Num} έχει ${q7Divs.length} διαιρέτες (${q7Divs.join(', ')}), επομένως σχηματίζει ${q7Correct} διαφορετικές ορθογώνιες διατάξεις.`)
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας (Ισόποσο μοίρασμα σε ομάδες)
  {
    const q8Students = [17, 19, 23, 29, 31][randInt(0, 4)];
    const q8CorrectStr = isEn
      ? 'No, because the number is prime and divisible only by 1 and itself'
      : 'Όχι, γιατί ο αριθμός είναι πρώτος και διαιρείται μόνο με το 1 και τον εαυτό του';
    const q8Wrong1 = isEn ? 'Yes, in 2 equal teams' : 'Ναι, σε 2 ίσες ομάδες';
    const q8Wrong2 = isEn ? 'Yes, in 3 equal teams' : 'Ναι, σε 3 ίσες ομάδες';
    const q8Wrong3 = isEn ? 'Yes, in 5 equal teams' : 'Ναι, σε 5 ίσες ομάδες';

    const rawOptions = [q8CorrectStr, q8Wrong1, q8Wrong2, q8Wrong3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8CorrectStr
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • EVERYDAY PROBLEM' : 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: isEn ? 'Select the correct answer regarding student partitioning:' : 'Επιλέξτε τη σωστή απάντηση για τον διαχωρισμό των μαθητών:',
      prompt: isEn
        ? `A teacher wants to divide ${q8Students} students into equal teams of more than 1 student each. Can she do it?`
        : `Μια δασκάλα θέλει να χωρίσει ${q8Students} μαθητές σε ισοπληθείς ομάδες με περισσότερους από 1 μαθητή. Μπορεί να το κάνει;`,
      options,
      correctText: q8CorrectStr,
      correctStr: q8CorrectStr,
      explanation: isEn
        ? `The number ${q8Students} is prime, so it cannot be divided into equal groups of more than 1 student.`
        : `Ο αριθμός ${q8Students} είναι πρώτος αριθμός, επομένως δεν μπορεί να χωριστεί σε ισοπληθείς ομάδες με περισσότερους από 1 μαθητή.`
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate(locale);
    const hardProb = shuffledHard[0].generate(locale);

    const optionsQ9 = shuffle([...new Set(stdProb.optionsRaw)]).map((text) => ({
      text,
      isCorrect: text === stdProb.correctText
    }));

    qList.push({
      id: 9,
      type: 'mcq',
      title: `${isEn ? 'QUESTION 9 • ' : 'ΕΡΩΤΗΣΗ 9 • '}${stdProb.title}`,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      options: optionsQ9,
      correctText: stdProb.correctText,
      correctStr: stdProb.correctText,
      explanation: stdProb.explanation
    });

    const optionsQ10 = shuffle([...new Set(hardProb.optionsRaw)]).map((text) => ({
      text,
      isCorrect: text === hardProb.correctText
    }));

    qList.push({
      id: 10,
      type: 'mcq',
      title: `${isEn ? 'QUESTION 10 • ' : 'ΕΡΩΤΗΣΗ 10 • '}${hardProb.title}`,
      instruction: hardProb.instruction,
      prompt: hardProb.text,
      tableData: hardProb.tableData,
      options: optionsQ10,
      correctText: hardProb.correctText,
      correctStr: hardProb.correctText,
      explanation: hardProb.explanation
    });
  }

  return qList;
}

const UI_STRINGS = {
  el: {
    pageTitle: "Ασκήσεις: Πρώτοι και Σύνθετοι Αριθμοί - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στους πρώτους και σύνθετους αριθμούς για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 16 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Πρώτοι & Σύνθετοι Αριθμοί",
    heroDesc: "10 δυναμικές δραστηριότητες αναγνώρισης πρώτων αριθμών, ορθογώνιων διατάξεων, ιδιοτήτων και ρεαλιστικά προβλήματα καθημερινής ζωής.",
    heroDynamicNote: "⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.",
    btnNewSet: "🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    badgeCorrect: "✓ ΣΩΣΤΟ",
    badgeWrong: "✗ ΛΑΘΟΣ",
    inputPlaceholder: "Απάντηση...",
    inputNote: "(Ακέραιος αριθμός)",
    feedbackGreat: "🎉 Εξαιρετικά!",
    feedbackExpl: "💡 Μαθηματική Επεξήγηση:",
    correctAnswerLabel: "Σωστή απάντηση:",
    btnCheckMain: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "ΣΚΟΡ",
    answeredLabel: "ΑΠΑΝΤΗΘΗΚΑΝ",
    pctLabel: "ΠΟΣΟΣΤΟ",
    btnCheckBar: "ΕΛΕΓΧΟΣ"
  },
  en: {
    pageTitle: "Exercises: Prime & Composite Numbers - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems testing prime and composite numbers and factoring for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "CHAPTER 16 • GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Prime & Composite Numbers",
    heroDesc: "10 dynamic activities identifying prime numbers, rectangular formations, prime properties, and everyday word problems.",
    heroDynamicNote: "⚡ Each exercise set is dynamically generated with random parameters.",
    btnNewSet: "🔄 NEW EXERCISES",
    badgeCorrect: "✓ CORRECT",
    badgeWrong: "✗ WRONG",
    inputPlaceholder: "Answer...",
    inputNote: "(Integer number)",
    feedbackGreat: "🎉 Excellent!",
    feedbackExpl: "💡 Mathematical Explanation:",
    correctAnswerLabel: "Correct answer:",
    btnCheckMain: "🎯 Check Answers",
    scoreLabel: "SCORE",
    answeredLabel: "ANSWERED",
    pctLabel: "PERCENTAGE",
    btnCheckBar: "CHECK"
  }
};

export default function ProtoiExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = UI_STRINGS[locale];

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const q = generateQuestions(locale);
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [locale]);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleInputChange = (qId, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/[^0-9]/g, '');
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: sanitized
    }));
  };

  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  const isQuestionCorrect = (q) => {
    if (q.type === 'mcq') {
      return answers[`q_${q.id}`] === q.correctText;
    }
    if (q.type === 'integer_input') {
      const userValStr = (answers[`q_${q.id}`] || '').trim();
      const userVal = parseInt(userValStr, 10);
      return !isNaN(userVal) && userVal === q.correctVal;
    }
    return false;
  };

  const handleCheckAnswers = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitted) return;

    let currentScore = 0;
    questions.forEach((q) => {
      if (isQuestionCorrect(q)) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  const answeredCount = Object.values(answers).filter(
    (val) => val !== undefined && val !== null && String(val).trim() !== ''
  ).length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/16-protoi"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.theoryBtn}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-36 overflow-x-hidden box-border">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.badgeChapter}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words [overflow-wrap:anywhere]">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200">
              {t.heroDynamicNote}
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation cursor-pointer"
            >
              <span>{t.btnNewSet}</span>
            </button>
          </div>
        </section>

        {/* Λίστα 10 Ασκήσεων */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q) => {
            const isCorrect = isSubmitted && isQuestionCorrect(q);

            return (
              <article
                key={`q-${q.id}`}
                className={`bg-white rounded-3xl border p-5 sm:p-8 2xl:p-10 shadow-sm transition-all overflow-hidden ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλίδα Ερώτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg break-words">
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
                      {isCorrect ? t.badgeCorrect : t.badgeWrong}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση */}
                <div className="space-y-3 mb-5">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500 break-words [overflow-wrap:anywhere]">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed break-words [overflow-wrap:anywhere]">
                    {q.prompt}
                  </p>
                </div>

                {/* Περιοχή Απάντησης */}
                <div className="py-2">
                  {q.type === 'integer_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck="false"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder={t.inputPlaceholder}
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500 font-medium">
                        {t.inputNote}
                      </span>
                    </div>
                  )}

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
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 min-h-[48px] cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-300'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1">
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

                {/* Feedback μετά την υποβολή */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-2.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? t.feedbackGreat : t.feedbackExpl}</span>
                    </div>

                    {q.tableData && (
                      <div className="w-full min-w-0 max-w-full bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-inner my-1 font-mono text-xs sm:text-sm overflow-x-auto block">
                        <div className="grid grid-cols-2 gap-2 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                          <span className="bg-blue-100/70 px-2 py-0.5 rounded-lg text-blue-900 break-words [overflow-wrap:anywhere]">{q.tableData.col1}</span>
                          <span className="bg-emerald-100/70 px-2 py-0.5 rounded-lg text-emerald-900 break-words [overflow-wrap:anywhere]">{q.tableData.col2}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                          <span className="break-words [overflow-wrap:anywhere]">{q.tableData.r1[0]}</span>
                          <span className="text-indigo-700 font-bold break-words [overflow-wrap:anywhere]">{q.tableData.r1[1]}</span>
                          <span className="break-words [overflow-wrap:anywhere]">{q.tableData.r2[0]}</span>
                          <span className="text-amber-600 font-black break-words [overflow-wrap:anywhere]">{q.tableData.r2[1]}</span>
                        </div>
                      </div>
                    )}

                    <div className="break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                    
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800">
                        {t.correctAnswerLabel}{' '}
                        <span className="font-mono font-bold text-blue-900 break-words">
                          {formatNumber(q.correctStr || q.correctText, locale)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Κουμπί Ελέγχου στο τέλος της φόρμας */}
        {!isSubmitted && (
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={handleCheckAnswers}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation cursor-pointer"
            >
              <span>{t.btnCheckMain}</span>
            </button>
          </div>
        )}

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                {isSubmitted ? t.scoreLabel : t.answeredLabel}
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {isSubmitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-8">
                <span className="text-xs text-slate-400 font-semibold block">
                  {t.pctLabel}
                </span>
                <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
                  {Math.round((score / 10) * 100)} %
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation cursor-pointer"
              >
                {t.btnCheckBar}
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation cursor-pointer"
              >
                <span>{t.btnNewSet}</span>
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}
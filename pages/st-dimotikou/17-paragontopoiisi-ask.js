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

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
}

function getPrimeFactors(n) {
  if (!n || n < 2) return [];
  let num = n;
  const factors = [];
  let divisor = 2;

  while (num >= 2) {
    if (num % divisor === 0) {
      factors.push(divisor);
      num = num / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}

function getPowerRepresentation(factors) {
  if (!factors || factors.length === 0) return '';
  const counts = {};
  factors.forEach((f) => {
    counts[f] = (counts[f] || 0) + 1;
  });

  return Object.keys(counts)
    .map((factor) => {
      const count = counts[factor];
      const exponent = count > 1 ? `<sup>${count}</sup>` : '';
      return `${factor}${exponent}`;
    })
    .join(' · ');
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

const renderMathHtml = (htmlStr) => {
  return <span dangerouslySetInnerHTML={{ __html: htmlStr }} />;
};

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_factor_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const num = 144;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: isEn ? 'DECOMPOSITION INTO POWERS' : 'ΑΝΑΛΥΣΗ ΣΕ ΔΥΝΑΜΕΙΣ',
        instruction: isEn ? 'Select the correct power representation:' : 'Επιλέξτε τη σωστή μορφή δυνάμεων:',
        text: isEn
          ? `An electronics store received ${num} microchips. What is the complete prime factorization of ${num} expressed in powers?`
          : `Ένα κατάστημα ηλεκτρονικών παρέλαβε ${num} μικροτσίπ. Ποια είναι η πλήρης ανάλυση του αριθμού ${num} σε γινόμενο πρώτων παραγόντων με μορφή δυνάμεων;`,
        tableData: {
          col1: isEn ? 'Number' : 'Αριθμός',
          col2: isEn ? 'Prime Factor Product' : 'Γινόμενο Πρώτων Παραγόντων',
          r1: [`${num}`, `${factors.join(' · ')}`],
          r2: [isEn ? 'Power Form' : 'Μορφή Δυνάμεων', `${powerStr}`]
        },
        optionsRaw: [
          powerStr,
          '2<sup>3</sup> · 3<sup>2</sup>',
          '2<sup>4</sup> · 3<sup>3</sup>',
          '4<sup>2</sup> · 9'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  },
  {
    id: 'p_factor_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const num = 180;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: isEn ? 'BOOK FACTORIZATION' : 'ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗ ΒΙΒΛΙΩΝ',
        instruction: isEn ? 'Select the correct prime factorization:' : 'Επιλέξτε τη σωστή παραγοντοποίηση:',
        text: isEn
          ? `A library has ${num} literature books. What is the correct prime factorization of ${num} in power notation?`
          : `Μια βιβλιοθήκη έχει ${num} λογοτεχνικά βιβλία. Ποια είναι η σωστή παραγοντοποίηση του ${num} σε πρώτους παράγοντες με μορφή δυνάμεων;`,
        tableData: {
          col1: isEn ? 'Number' : 'Αριθμός',
          col2: isEn ? 'Prime Factor Breakdown' : 'Ανάλυση σε Πρώτους',
          r1: [`${num}`, `${factors.join(' · ')}`],
          r2: [isEn ? 'Final Form' : 'Τελική Μορφή', `${powerStr}`]
        },
        optionsRaw: [
          powerStr,
          '2 · 3<sup>2</sup> · 5',
          '2<sup>2</sup> · 3 · 5<sup>2</sup>',
          '4 · 9 · 5'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  },
  {
    id: 'p_factor_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const num = 200;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: isEn ? 'FACTORING NOTEBOOKS INTO POWERS' : 'ΑΝΑΛΥΣΗ ΤΕΤΡΑΔΙΩΝ ΣΕ ΔΥΝΑΜΕΙΣ',
        instruction: isEn ? 'Select the correct power representation:' : 'Επιλέξτε τη σωστή μορφή δυνάμεων:',
        text: isEn
          ? `A school received ${num} notebooks. What is the correct prime factorization of ${num}?`
          : `Ένα σχολείο παρέλαβε ${num} τετράδια. Ποια είναι η σωστή ανάλυση του ${num} σε πρώτους παράγοντες;`,
        tableData: {
          col1: isEn ? 'Number' : 'Αριθμός',
          col2: isEn ? 'Decomposition' : 'Ανάλυση',
          r1: [`${num}`, `${factors.join(' · ')}`],
          r2: [isEn ? 'Power Form' : 'Μορφή Δυνάμεων', `${powerStr}`]
        },
        optionsRaw: [
          powerStr,
          '2<sup>2</sup> · 5<sup>2</sup>',
          '2<sup>4</sup> · 5',
          '8 · 25'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  },
  {
    id: 'p_factor_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const num = 150;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: isEn ? 'FACTORING CANDIES' : 'ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗ ΚΑΡΑΜΕΛΩΝ',
        instruction: isEn ? 'Select the correct power representation:' : 'Επιλέξτε τη σωστή μορφή δυνάμεων:',
        text: isEn
          ? `A baker packed ${num} candies. What is the complete prime factorization of ${num}?`
          : `Ένας ζαχαροπλάστης συσκεύασε ${num} καραμέλες. Ποια είναι η πλήρης ανάλυση του ${num} σε πρώτους παράγοντες;`,
        tableData: {
          col1: isEn ? 'Number' : 'Αριθμός',
          col2: isEn ? 'Product' : 'Γινόμενο',
          r1: [`${num}`, `${factors.join(' · ')}`],
          r2: [isEn ? 'Power Form' : 'Μορφή Δυνάμεων', `${powerStr}`]
        },
        optionsRaw: [
          powerStr,
          '2<sup>2</sup> · 3 · 5',
          '2 · 3<sup>2</sup> · 5',
          '6 · 25'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  },
  {
    id: 'p_factor_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const num = 108;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: isEn ? 'FACTORING JUICE PACKAGES' : 'ΑΝΑΛΥΣΗ ΣΥΣΚΕΥΑΣΙΩΝ ΧΥΜΟΥ',
        instruction: isEn ? 'Select the correct power representation:' : 'Επιλέξτε τη σωστή ανάλυση σε δυνάμεις:',
        text: isEn
          ? `A warehouse holds ${num} juice cartons. What is the correct prime factorization of ${num}?`
          : `Μια αποθήκη διαθέτει ${num} συσκευασίες χυμού. Ποια είναι η σωστή παραγοντοποίηση του ${num} σε πρώτους παράγοντες;`,
        tableData: {
          col1: isEn ? 'Number' : 'Αριθμός',
          col2: isEn ? 'Decomposition' : 'Ανάλυση',
          r1: [`${num}`, `${factors.join(' · ')}`],
          r2: [isEn ? 'Power Form' : 'Μορφή Δυνάμεων', `${powerStr}`]
        },
        optionsRaw: [
          powerStr,
          '2<sup>3</sup> · 3<sup>2</sup>',
          '2<sup>2</sup> · 3<sup>2</sup>',
          '4 · 27'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  },
  {
    id: 'p_factor_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const num = 160;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: isEn ? 'FACTORING TENNIS BALLS' : 'ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗ ΑΘΛΗΤΙΚΩΝ ΜΠΑΛΩΝ',
        instruction: isEn ? 'Select the correct power representation:' : 'Επιλέξτε τη σωστή ανάλυση σε δυνάμεις:',
        text: isEn
          ? `A sports gym has ${num} tennis balls. What is the prime factorization of ${num} in power form?`
          : `Ένα γυμναστήριο έχει ${num} μπάλες τένις. Ποια είναι η ανάλυση του ${num} σε γινόμενο πρώτων παραγόντων με μορφή δυνάμεων;`,
        tableData: {
          col1: isEn ? 'Number' : 'Αριθμός',
          col2: isEn ? 'Decomposition' : 'Ανάλυση',
          r1: [`${num}`, `${factors.join(' · ')}`],
          r2: [isEn ? 'Power Form' : 'Μορφή Δυνάμεων', `${powerStr}`]
        },
        optionsRaw: [
          powerStr,
          '2<sup>4</sup> · 5',
          '2<sup>5</sup> · 3',
          '32 · 5'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_factor_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const num = 210;
      const factors = getPrimeFactors(num);
      const uniqueFactors = [...new Set(factors)];
      const count = uniqueFactors.length;
      return {
        title: isEn ? 'COUNT OF DISTINCT PRIME FACTORS' : 'ΠΛΗΘΟΣ ΔΙΑΦΟΡΕΤΙΚΩΝ ΠΡΩΤΩΝ ΠΑΡΑΓΟΝΤΩΝ',
        instruction: isEn ? 'Select the number of distinct prime factors:' : 'Επιλέξτε το πλήθος των διαφορετικών πρώτων παραγόντων:',
        text: isEn
          ? `A farmer bottled ${num} kg of olive oil. How many distinct prime factors are contained in the factorization of ${num}?`
          : `Ένας αγρότης συσκεύασε ${num} κιλά λάδι. Πόσους διαφορετικούς πρώτους παράγοντες περιέχει η ανάλυση του αριθμού ${num};`,
        tableData: {
          col1: isEn ? 'Number' : 'Αριθμός',
          col2: isEn ? 'Prime Factors' : 'Πρώτοι Παράγοντες',
          r1: [`${num}`, `${factors.join(' · ')}`],
          r2: [isEn ? 'Total Distinct' : 'Πλήθος', isEn ? `${count} distinct factors` : `${count} διαφορετικοί παράγοντες`]
        },
        optionsRaw: [
          String(count),
          String(count - 1),
          String(count + 1),
          String(count + 2)
        ],
        correctText: String(count),
        explanation: isEn
          ? `${num} ＝ 2 · 3 · 5 · 7. Therefore, it has exactly ${count} distinct prime factors.`
          : `${num} ＝ 2 · 3 · 5 · 7. Άρα έχει ακριβώς ${count} διαφορετικούς πρώτους παράγοντες.`
      };
    }
  },
  {
    id: 'p_factor_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const num = 300;
      const factors = getPrimeFactors(num);
      const uniqueFactors = [...new Set(factors)];
      const count = uniqueFactors.length;
      return {
        title: isEn ? 'DECOMPOSITION & DISTINCT PRIMES' : 'ΑΝΑΛΥΣΗ ΚΑΙ ΔΙΑΦΟΡΕΤΙΚΟΙ ΠΡΩΤΟΙ ΠΑΡΑΓΟΝΤΕΣ',
        instruction: isEn ? 'Select the number of distinct prime factors:' : 'Επιλέξτε το πλήθος των διαφορετικών πρώτων παραγόντων:',
        text: isEn
          ? `A warehouse stores ${num} boxes. How many distinct prime factors does the factorization of ${num} have?`
          : `Μια αποθήκη περιέχει ${num} χαρτοκιβώτια. Πόσους διαφορετικούς πρώτους παράγοντες έχει η παραγοντοποίηση του ${num};`,
        tableData: {
          col1: isEn ? 'Number' : 'Αριθμός',
          col2: isEn ? 'Decomposition' : 'Ανάλυση',
          r1: [`${num}`, '2<sup>2</sup> · 3 · 5<sup>2</sup>'],
          r2: [isEn ? 'Distinct Primes' : 'Διαφορετικοί', '2, 3, 5']
        },
        optionsRaw: [
          String(count),
          String(count + 1),
          String(count + 2),
          String(count - 1)
        ],
        correctText: String(count),
        explanation: isEn
          ? `${num} ＝ 2<sup>2</sup> · 3 · 5<sup>2</sup>. The distinct prime factors are 2, 3, and 5 (${count} in total).`
          : `${num} ＝ 2<sup>2</sup> · 3 · 5<sup>2</sup>. Οι διαφορετικοί πρώτοι παράγοντες είναι οι 2, 3 και 5 (συνολικά ${count}).`
      };
    }
  },
  {
    id: 'p_factor_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const num = 240;
      const factors = getPrimeFactors(num);
      const totalCount = factors.length;
      return {
        title: isEn ? 'TOTAL COUNT OF PRIME FACTORS' : 'ΣΥΝΟΛΙΚΟ ΠΛΗΘΟΣ ΠΡΩΤΩΝ ΠΑΡΑΓΟΝΤΩΝ',
        instruction: isEn ? 'Select total prime factors (including repetitions):' : 'Επιλέξτε το συνολικό πλήθος παραγόντων (με τις επαναλήψεις):',
        text: isEn
          ? `A factory manufactured ${num} spare parts. How many prime factors in total (counting repetitions) are in the prime factorization of ${num}?`
          : `Ένα εργοστάσιο παρήγαγε ${num} εξαρτήματα. Πόσους πρώτους παράγοντες συνολικά (μαζί με τις επαναλήψεις) περιέχει η ανάλυση του ${num};`,
        tableData: {
          col1: isEn ? 'Number' : 'Αριθμός',
          col2: isEn ? 'Prime Product' : 'Γινόμενο',
          r1: [`${num}`, `${factors.join(' · ')}`],
          r2: [isEn ? 'Total Factor Count' : 'Σύνολο Παραγόντων', `${totalCount}`]
        },
        optionsRaw: [
          String(totalCount),
          String(totalCount - 1),
          String(totalCount + 1),
          String(totalCount + 2)
        ],
        correctText: String(totalCount),
        explanation: isEn
          ? `${num} ＝ 2<sup>4</sup> · 3 · 5 ＝ 2 · 2 · 2 · 2 · 3 · 5, giving ${totalCount} prime factors in total.`
          : `${num} ＝ 2<sup>4</sup> · 3 · 5 ＝ 2 · 2 · 2 · 2 · 3 · 5, άρα περιέχει ${totalCount} πρώτους παράγοντες συνολικά.`
      };
    }
  },
  {
    id: 'p_factor_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const num = 360;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: isEn ? 'FULL FACTORIZATION IN POWERS' : 'ΠΛΗΡΗΣ ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗ ΣΕ ΔΥΝΑΜΕΙΣ',
        instruction: isEn ? 'Select the correct power representation:' : 'Επιλέξτε τη σωστή μορφή δυνάμεων:',
        text: isEn
          ? `An auditorium has ${num} seats. What is the full prime factorization of ${num} in power notation?`
          : `Μια αίθουσα διαθέτει ${num} καθίσματα. Ποια είναι η πλήρης ανάλυση του ${num} σε γινόμενο πρώτων παραγόντων με μορφή δυνάμεων;`,
        tableData: {
          col1: isEn ? 'Number' : 'Αριθμός',
          col2: isEn ? 'Decomposition' : 'Ανάλυση',
          r1: [`${num}`, `${factors.join(' · ')}`],
          r2: [isEn ? 'Power Form' : 'Μορφή Δυνάμεων', `${powerStr}`]
        },
        optionsRaw: [
          powerStr,
          '2<sup>2</sup> · 3<sup>3</sup> · 5',
          '2<sup>4</sup> · 3 · 5',
          '8 · 9 · 5'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  },
  {
    id: 'p_factor_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const num = 420;
      const factors = getPrimeFactors(num);
      const uniqueFactors = [...new Set(factors)];
      const count = uniqueFactors.length;
      return {
        title: isEn ? 'FINDING DISTINCT PRIME FACTORS' : 'ΕΥΡΕΣΗ ΔΙΑΦΟΡΕΤΙΚΩΝ ΠΡΩΤΩΝ ΠΑΡΑΓΟΝΤΩΝ',
        instruction: isEn ? 'Select the number of distinct prime factors:' : 'Επιλέξτε το πλήθος των διαφορετικών πρώτων παραγόντων:',
        text: isEn
          ? `A pharmacy received ${num} medical packages. How many distinct prime factors are contained in the prime factorization of ${num}?`
          : `Ένα φαρμακείο παρέλαβε ${num} σκευάσματα. Πόσους διαφορετικούς πρώτους παράγοντες περιέχει η ανάλυση του ${num};`,
        tableData: {
          col1: isEn ? 'Number' : 'Αριθμός',
          col2: isEn ? 'Decomposition' : 'Ανάλυση',
          r1: [`${num}`, '2<sup>2</sup> · 3 · 5 · 7'],
          r2: [isEn ? 'Distinct Primes' : 'Διαφορετικοί', '2, 3, 5, 7']
        },
        optionsRaw: [
          String(count),
          String(count - 1),
          String(count + 1),
          String(count + 2)
        ],
        correctText: String(count),
        explanation: isEn
          ? `${num} ＝ 2<sup>2</sup> · 3 · 5 · 7. There are 4 distinct prime factors (2, 3, 5, and 7).`
          : `${num} ＝ 2<sup>2</sup> · 3 · 5 · 7. Οι διαφορετικοί πρώτοι παράγοντες είναι 4 (το 2, 3, 5 και 7).`
      };
    }
  },
  {
    id: 'p_factor_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const num = 500;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: isEn ? 'FACTORING PAPER SHEETS' : 'ΑΝΑΛΥΣΗ ΦΥΛΛΩΝ ΧΑΡΤΙΟΥ',
        instruction: isEn ? 'Select the correct power representation:' : 'Επιλέξτε τη σωστή μορφή δυνάμεων:',
        text: isEn
          ? `A paper ream contains ${num} sheets. What is the correct prime factorization of ${num}?`
          : `Μια δεσμίδα περιέχει ${num} φύλλα χαρτί. Ποια είναι η σωστή παραγοντοποίηση του ${num} σε πρώτους παράγοντες;`,
        tableData: {
          col1: isEn ? 'Number' : 'Αριθμός',
          col2: isEn ? 'Decomposition' : 'Ανάλυση',
          r1: [`${num}`, `${factors.join(' · ')}`],
          r2: [isEn ? 'Power Form' : 'Μορφή Δυνάμεων', `${powerStr}`]
        },
        optionsRaw: [
          powerStr,
          '2<sup>3</sup> · 5<sup>2</sup>',
          '2 · 5<sup>4</sup>',
          '4 · 125'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const qList = [];

  // Q1 (MCQ): Σωστή παραγοντοποίηση ενός αριθμού σε μορφή δυνάμεων
  {
    const q1Pool = [24, 36, 40, 48, 60, 72, 90, 100, 120];
    const q1Num = q1Pool[randInt(0, q1Pool.length - 1)];
    const q1Factors = getPrimeFactors(q1Num);
    const q1Correct = getPowerRepresentation(q1Factors);

    const q1Wrong1 = q1Factors.join(' · ');
    const q1Wrong2 = getPowerRepresentation(getPrimeFactors(q1Num + 6)) || '2<sup>3</sup> · 5';
    const q1Wrong3 = `${q1Factors[0]} · ${Math.floor(q1Num / q1Factors[0])}`;

    const rawOptions = makeUniqueOptions(q1Correct, [q1Wrong1, q1Wrong2, q1Wrong3, '2<sup>2</sup> · 3<sup>2</sup>']);
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === q1Correct
    }));

    qList.push({
      id: 1,
      type: 'mcq',
      title: isEn ? 'QUESTION 1 • PRIME FACTORIZATION' : 'ΕΡΩΤΗΣΗ 1 • ΑΝΑΛΥΣΗ ΣΕ ΠΡΩΤΟΥΣ ΠΑΡΑΓΟΝΤΕΣ',
      instruction: isEn ? 'Select the correct prime factorization in power form:' : 'Επιλέξτε τη σωστή παραγοντοποίηση σε μορφή δυνάμεων:',
      prompt: isEn
        ? `What is the correct prime factorization of ${q1Num} expressed in powers?`
        : `Ποια είναι η σωστή παραγοντοποίηση του αριθμού ${q1Num} σε μορφή δυνάμεων;`,
      options,
      correctText: q1Correct,
      explanation: isEn
        ? `The decomposition of ${q1Num} is: ${q1Factors.join(' · ')} ＝ ${q1Correct}.`
        : `Η ανάλυση του ${q1Num} είναι: ${q1Factors.join(' · ')} ＝ ${q1Correct}.`
    });
  }

  // Q2 (Input): Μικρότερος πρώτος διαιρέτης μιας περιττής σύνθετης τιμής
  {
    const q2Pool = [27, 35, 45, 63, 75, 105, 135];
    const q2Num = q2Pool[randInt(0, q2Pool.length - 1)];
    const q2Factors = getPrimeFactors(q2Num);
    const q2Correct = q2Factors[0];

    qList.push({
      id: 2,
      type: 'integer_input',
      title: isEn ? 'QUESTION 2 • SMALLEST PRIME DIVISOR' : 'ΕΡΩΤΗΣΗ 2 • ΜΙΚΡΟΤΕΡΟΣ ΠΡΩΤΟΣ ΔΙΑΙΡΕΤΗΣ',
      instruction: isEn ? 'Enter the smallest prime divisor (integer):' : 'Συμπληρώστε τον μικρότερο πρώτο διαιρέτη (ακέραιος):',
      prompt: isEn
        ? `What is the smallest prime divisor of the number ${q2Num}?`
        : `Ποιος είναι ο μικρότερος πρώτος διαιρέτης του αριθμού ${q2Num};`,
      correctVal: q2Correct,
      correctStr: String(q2Correct),
      explanation: isEn
        ? `The prime factors of ${q2Num} are: ${q2Factors.join(', ')}. The smallest is ${q2Correct}.`
        : `Οι πρώτοι παράγοντες του ${q2Num} είναι: ${q2Factors.join(', ')}. Ο μικρότερος είναι το ${q2Correct}.`
    });
  }

  // Q3 (MCQ): Εύρεση αριθμού από τη μορφή δυνάμεών του
  {
    const q3Presets = [
      { expr: '2<sup>2</sup> · 3 · 5', val: 60 },
      { expr: '2<sup>3</sup> · 3<sup>2</sup>', val: 72 },
      { expr: '2 · 3<sup>2</sup> · 5', val: 90 },
      { expr: '2<sup>2</sup> · 5<sup>2</sup>', val: 100 },
      { expr: '2<sup>3</sup> · 3 · 5', val: 120 },
      { expr: '3<sup>2</sup> · 5<sup>2</sup>', val: 225 }
    ];
    const q3Chosen = q3Presets[randInt(0, q3Presets.length - 1)];
    const q3CorrectStr = String(q3Chosen.val);

    const rawCandidates = [
      String(q3Chosen.val - 10),
      String(q3Chosen.val + 12),
      String(Math.floor(q3Chosen.val / 2))
    ];
    const rawOptions = makeUniqueOptions(q3CorrectStr, rawCandidates);
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === q3CorrectStr
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • FINDING NUMBER FROM POWERS' : 'ΕΡΩΤΗΣΗ 3 • ΕΥΡΕΣΗ ΑΡΙΘΜΟΥ ΑΠΟ ΔΥΝΑΜΕΙΣ',
      instruction: isEn ? 'Select the correct number:' : 'Επιλέξτε τον σωστό αριθμό:',
      prompt: isEn
        ? `Which number has the prime factorization ${q3Chosen.expr}?`
        : `Ποιος αριθμός έχει παραγοντοποίηση ${q3Chosen.expr};`,
      options,
      correctText: q3CorrectStr,
      explanation: isEn
        ? `Evaluate the powers and multiply: ${q3Chosen.expr} ＝ ${q3Chosen.val}.`
        : `Υπολογίζουμε τις δυνάμεις και το γινόμενο: ${q3Chosen.expr} ＝ ${q3Chosen.val}.`
    });
  }

  // Q4 (MCQ): Εύρεση παράγοντα/εκθέτη που λείπει
  {
    const q4Presets = [
      { num: 72, known: '2<sup>3</sup> · ', missing: '3<sup>2</sup>', explain: '72 ＝ 8 · 9 ＝ 2<sup>3</sup> · 3<sup>2</sup>' },
      { num: 60, known: '2<sup>2</sup> · ', missing: '3 · 5', explain: '60 ＝ 4 · 15 ＝ 2<sup>2</sup> · 3 · 5' },
      { num: 100, known: '2<sup>2</sup> · ', missing: '5<sup>2</sup>', explain: '100 ＝ 4 · 25 ＝ 2<sup>2</sup> · 5<sup>2</sup>' },
      { num: 120, known: '2<sup>3</sup> · ', missing: '3 · 5', explain: '120 ＝ 8 · 15 ＝ 2<sup>3</sup> · 3 · 5' },
      { num: 90, known: '2 · ', missing: '3<sup>2</sup> · 5', explain: '90 ＝ 2 · 45 ＝ 2 · 3<sup>2</sup> · 5' }
    ];
    const q4Chosen = q4Presets[randInt(0, q4Presets.length - 1)];
    const rawOptions = makeUniqueOptions(q4Chosen.missing, ['3', '5', '2<sup>2</sup>', '3<sup>3</sup>']);
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === q4Chosen.missing
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • MISSING FACTOR COMPLETION' : 'ΕΡΩΤΗΣΗ 4 • ΣΥΜΠΛΗΡΩΣΗ ΠΑΡΑΓΟΝΤΑ',
      instruction: isEn ? 'Select the missing factor:' : 'Επιλέξτε τον παράγοντα που λείπει:',
      prompt: `${q4Chosen.num} ＝ ${q4Chosen.known} [ ? ]`,
      options,
      correctText: q4Chosen.missing,
      explanation: q4Chosen.explain
    });
  }

  // Q5 (MCQ): True / False - Μοναδικότητα ανάλυσης
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? 'Every composite number factors uniquely into a product of prime numbers.'
          : 'A composite number can have multiple different prime factorizations.')
      : (q5IsTrue
          ? 'Κάθε σύνθετος αριθμός αναλύεται κατά έναν και μοναδικό τρόπο σε γινόμενο πρώτων παραγόντων.'
          : 'Ένας σύνθετος αριθμός μπορεί να έχει πολλές διαφορετικές αναλύσεις σε πρώτους παράγοντες.');
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
      title: isEn ? 'QUESTION 5 • UNIQUENESS OF FACTORIZATION' : 'ΕΡΩΤΗΣΗ 5 • ΜΟΝΑΔΙΚΟΤΗΤΑ ΑΝΑΛΥΣΕΩΣ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? (isEn
            ? 'Correct! The prime factorization of any composite number is unique (Fundamental Theorem of Arithmetic).'
            : 'Σωστό! Η ανάλυση κάθε σύνθετου αριθμού σε γινόμενο πρώτων παραγόντων είναι μοναδική (Θεμελιώδες Θεώρημα της Αριθμητικής).')
        : (isEn
            ? 'False! Every composite number has one and only one unique prime factorization.'
            : 'Λάθος! Κάθε σύνθετος αριθμός έχει μία και μοναδική παραγοντοποίηση σε πρώτους αριθμούς.')
    });
  }

  // Q6 (MCQ): True / False - Κανόνας κατακόρυφης γραμμής
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? 'In successive division ladders, we write strictly prime numbers to the right of the vertical bar.'
          : 'In successive division ladders, we can write composite numbers (e.g. 4 or 6) to the right of the vertical bar.')
      : (q6IsTrue
          ? 'Στη μέθοδο των διαδοχικών διαιρέσεων, δεξιά από την κατακόρυφη γραμμή γράφουμε μόνο πρώτους αριθμούς.'
          : 'Στη μέθοδο των διαδοχικών διαιρέσεων, δεξιά από την κατακόρυφη γραμμή μπορούμε να γράψουμε και σύνθετους αριθμούς (π.χ. 4 ή 6).');
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
      title: isEn ? 'QUESTION 6 • SUCCESSIVE DIVISION RULE' : 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΔΙΑΔΟΧΙΚΩΝ ΔΙΑΙΡΕΣΕΩΝ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? (isEn
            ? 'Correct! To the right of the vertical line, we write exclusively prime numbers (2, 3, 5, 7...).'
            : 'Σωστό! Δεξιά από τη γραμμή γράφουμε αποκλειστικά πρώτους αριθμούς (2, 3, 5, 7...).')
        : (isEn
            ? 'False! Composite numbers are not permitted on the right side of the vertical line.'
            : 'Λάθος! Δεν επιτρέπεται να γράψουμε σύνθετους αριθμούς δεξιά από τη γραμμή.')
    });
  }

  // Q7 (Input): Πλήθος πρώτων παραγόντων (με επαναλήψεις)
  {
    const q7Pool = [18, 24, 30, 36, 40, 48, 60, 72];
    const q7Num = q7Pool[randInt(0, q7Pool.length - 1)];
    const q7Factors = getPrimeFactors(q7Num);
    const q7Correct = q7Factors.length;

    qList.push({
      id: 7,
      type: 'integer_input',
      title: isEn ? 'QUESTION 7 • TOTAL PRIME FACTORS COUNT' : 'ΕΡΩΤΗΣΗ 7 • ΠΛΗΘΟΣ ΠΡΩΤΩΝ ΠΑΡΑΓΟΝΤΩΝ',
      instruction: isEn ? 'Calculate total prime factors (including repetitions, integer):' : 'Υπολογίστε το πλήθος των πρώτων παραγόντων (ακέραιος):',
      prompt: isEn
        ? `How many prime factors in total (counting repetitions) does the number ${q7Num} have?`
        : `Πόσους πρώτους παράγοντες συνολικά (μαζί με τις επαναλήψεις) έχει ο αριθμός ${q7Num};`,
      correctVal: q7Correct,
      correctStr: String(q7Correct),
      explanation: isEn
        ? `${q7Num} ＝ ${q7Factors.join(' · ')} (${q7Correct} prime factors in total).`
        : `${q7Num} ＝ ${q7Factors.join(' · ')} (συνολικά ${q7Correct} πρώτοι παράγοντες).`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας
  {
    const q8Presets = isEn
      ? [
          { num: 36, item: 'boxes', explain: '36 ＝ 2<sup>2</sup> · 3<sup>2</sup> (2 · 2 · 3 · 3)' },
          { num: 48, item: 'candies', explain: '48 ＝ 2<sup>4</sup> · 3 (2 · 2 · 2 · 2 · 3)' },
          { num: 60, item: 'books', explain: '60 ＝ 2<sup>2</sup> · 3 · 5 (2 · 2 · 3 · 5)' },
          { num: 90, item: 'chocolates', explain: '90 ＝ 2 · 3<sup>2</sup> · 5 (2 · 3 · 3 · 5)' }
        ]
      : [
          { num: 36, item: 'κουτάκια', explain: '36 ＝ 2<sup>2</sup> · 3<sup>2</sup> (2 · 2 · 3 · 3)' },
          { num: 48, item: 'καραμέλες', explain: '48 ＝ 2<sup>4</sup> · 3 (2 · 2 · 2 · 2 · 3)' },
          { num: 60, item: 'βιβλία', explain: '60 ＝ 2<sup>2</sup> · 3 · 5 (2 · 2 · 3 · 5)' },
          { num: 90, item: 'σοκολάτες', explain: '90 ＝ 2 · 3<sup>2</sup> · 5 (2 · 3 · 3 · 5)' }
        ];
    const q8Chosen = q8Presets[randInt(0, q8Presets.length - 1)];
    const q8CorrectStr = getPowerRepresentation(getPrimeFactors(q8Chosen.num));
    const q8Wrong1 = `${Math.floor(q8Chosen.num / 2)} · 2`;
    const q8Wrong2 = `4 · ${Math.floor(q8Chosen.num / 4)}`;
    const q8Wrong3 = getPowerRepresentation(getPrimeFactors(q8Chosen.num + 12)) || '2 · 3 · 7';

    const rawOptions = makeUniqueOptions(q8CorrectStr, [q8Wrong1, q8Wrong2, q8Wrong3, '2<sup>3</sup> · 5']);
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === q8CorrectStr
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • EVERYDAY WORD PROBLEM' : 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: isEn ? 'Select the complete prime factorization:' : 'Επιλέξτε την πλήρη ανάλυση σε πρώτους παράγοντες:',
      prompt: isEn
        ? `A workshop packs ${q8Chosen.num} ${q8Chosen.item}. Which expression represents its complete prime factorization?`
        : `Ένα εργαστήριο συσκευάζει ${q8Chosen.num} ${q8Chosen.item}. Ποια έκφραση αντιπροσωπεύει την πλήρη ανάλυση σε πρώτους παράγοντες;`,
      options,
      correctText: q8CorrectStr,
      explanation: isEn
        ? `The complete prime factorization of ${q8Chosen.num} is: ${q8Chosen.explain}.`
        : `Η πλήρης ανάλυση του ${q8Chosen.num} σε πρώτους παράγοντες είναι: ${q8Chosen.explain}.`
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate(locale);
    const hardProb = shuffledHard[0].generate(locale);

    const optionsQ9 = makeUniqueOptions(stdProb.correctText, stdProb.optionsRaw).map((text) => ({
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
      explanation: stdProb.explanation
    });

    const optionsQ10 = makeUniqueOptions(hardProb.correctText, hardProb.optionsRaw).map((text) => ({
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
      explanation: hardProb.explanation
    });
  }

  return qList;
}

const UI_STRINGS = {
  el: {
    pageTitle: "Ασκήσεις: Παραγοντοποίηση Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στην παραγοντοποίηση αριθμών για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 17 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Παραγοντοποίηση Αριθμών",
    heroDesc: "10 δυναμικές δραστηριότητες ανάλυσης σύνθετων αριθμών σε πρώτους παράγοντες, μορφής δυνάμεων, διαδοχικών διαιρέσεων και ρεαλιστικά προβλήματα καθημερινής ζωής.",
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
    pageTitle: "Exercises: Prime Factorization - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems on prime factorization, power representations, and division ladders for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "CHAPTER 17 • GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Prime Factorization",
    heroDesc: "10 dynamic activities decomposing composite numbers into prime factors, exponential representations, and everyday real-world word problems.",
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

export default function ParagontopoiisiExercisesPage() {
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
          href="/st-dimotikou/17-paragontopoiisi"
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
                    {renderMathHtml(q.prompt)}
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
                              {renderMathHtml(opt.text)}
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
                          <span className="break-words [overflow-wrap:anywhere]">{renderMathHtml(q.tableData.r1[0])}</span>
                          <span className="text-indigo-700 font-bold break-words [overflow-wrap:anywhere]">{renderMathHtml(q.tableData.r1[1])}</span>
                          <span className="break-words [overflow-wrap:anywhere]">{renderMathHtml(q.tableData.r2[0])}</span>
                          <span className="text-amber-600 font-black break-words [overflow-wrap:anywhere]">{renderMathHtml(q.tableData.r2[1])}</span>
                        </div>
                      </div>
                    )}

                    <div className="break-words [overflow-wrap:anywhere]">
                      {renderMathHtml(q.explanation)}
                    </div>
                    
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800">
                        {t.correctAnswerLabel}{' '}
                        <span className="font-mono font-bold text-blue-900 break-words">
                          {renderMathHtml(q.correctStr || q.correctText)}
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
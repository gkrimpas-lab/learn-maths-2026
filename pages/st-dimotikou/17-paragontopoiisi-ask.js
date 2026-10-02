// pages/st-dimotikou/17-paragontopoiisi-ask.js
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

// Υπολογισμος πρωτων παραγοντων
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

// Υπολογισμος μορφης δυναμεων (π.χ. [2,2,3,5] => "2² · 3 · 5")
function getPowerRepresentation(factors) {
  if (!factors || factors.length === 0) return '';
  const counts = {};
  factors.forEach((f) => {
    counts[f] = (counts[f] || 0) + 1;
  });

  const exponentsUnicode = { 1: '', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶' };

  return Object.keys(counts)
    .map((factor) => {
      const count = counts[factor];
      const exponent = count > 1 ? (exponentsUnicode[count] || `^${count}`) : '';
      return `${factor}${exponent}`;
    })
    .join(' · ');
}

// Διευρυμενη δεξαμενη κανονικων προβληματων για την Ερωτηση 9 (MCQ)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_factor_std_1',
    generate: () => {
      const num = 144;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: 'ΑΝΑΛΥΣΗ ΜΙΚΡΟΤΣΙΠ ΣΕ ΔΥΝΑΜΕΙΣ',
        instruction: 'Επιλέξτε τη σωστή μορφή δυνάμεων:',
        text: `Ένα κατάστημα ηλεκτρονικών παρέλαβε ${num} μικροτσίπ. Ποια είναι η πλήρης ανάλυση του αριθμού ${num} σε γινόμενο πρώτων παραγόντων με μορφή δυνάμεων;`,
        tableData: { col1: 'Αριθμός', col2: 'Γινόμενο Πρώτων Παραγόντων', r1: [`${num}`, `${factors.join(' · ')}`], r2: ['Μορφή Δυνάμεων', `${powerStr}`] },
        optionsRaw: [
          powerStr,
          '2³ · 3²',
          '2⁴ · 3³',
          '4² · 9'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  },
  {
    id: 'p_factor_std_2',
    generate: () => {
      const num = 180;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: 'ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗ ΒΙΒΛΙΩΝ ΒΙΒΛΙΟΘΗΚΗΣ',
        instruction: 'Επιλέξτε τη σωστή παραγοντοποίηση:',
        text: `Μια βιβλιοθήκη έχει ${num} λογοτεχνικά βιβλία. Ποια είναι η σωστή παραγοντοποίηση του ${num} σε πρώτους παράγοντες με μορφή δυνάμεων;`,
        tableData: { col1: 'Αριθμός', col2: 'Ανάλυση σε Πρώτους', r1: [`${num}`, `${factors.join(' · ')}`], r2: ['Τελική Μορφή', `${powerStr}`] },
        optionsRaw: [
          powerStr,
          '2 · 3² · 5',
          '2² · 3 · 5²',
          '4 · 9 · 5'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  },
  {
    id: 'p_factor_std_3',
    generate: () => {
      const num = 200;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: 'ΑΝΑΛΥΣΗ ΤΕΤΡΑΔΙΩΝ ΣΕ ΔΥΝΑΜΕΙΣ',
        instruction: 'Επιλέξτε τη σωστή μορφή δυνάμεων:',
        text: `Ένα σχολείο παρέλαβε ${num} τετράδια. Ποια είναι η σωστή ανάλυση του ${num} σε πρώτους παράγοντες;`,
        tableData: { col1: 'Αριθμός', col2: 'Ανάλυση', r1: [`${num}`, `${factors.join(' · ')}`], r2: ['Μορφή Δυνάμεων', `${powerStr}`] },
        optionsRaw: [
          powerStr,
          '2² · 5²',
          '2⁴ · 5',
          '8 · 25'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  },
  {
    id: 'p_factor_std_4',
    generate: () => {
      const num = 150;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: 'ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗ ΚΑΡΑΜΕΛΩΝ',
        instruction: 'Επιλέξτε τη σωστή μορφή δυνάμεων:',
        text: `Μια ζαχαροπλάστης συσκεύασε ${num} καραμέλες. Ποια είναι η πλήρης ανάλυση του ${num} σε πρώτους παράγοντες;`,
        tableData: { col1: 'Αριθμός', col2: 'Γινόμενο', r1: [`${num}`, `${factors.join(' · ')}`], r2: ['Μορφή Δυνάμεων', `${powerStr}`] },
        optionsRaw: [
          powerStr,
          '2² · 3 · 5',
          '2 · 3² · 5',
          '6 · 25'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  },
  {
    id: 'p_factor_std_5',
    generate: () => {
      const num = 108;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: 'ΑΝΑΛΥΣΗ ΣΥΣΚΕΥΑΣΙΩΝ ΧΥΜΟΥ',
        instruction: 'Επιλέξτε τη σωστή ανάλυση σε δυνάμεις:',
        text: `Μια αποθήκη διαθέτει ${num} συσκευασίες χυμού. Ποια είναι η σωστή παραγοντοποίηση του ${num} σε πρώτους παράγοντες;`,
        tableData: { col1: 'Αριθμός', col2: 'Ανάλυση', r1: [`${num}`, `${factors.join(' · ')}`], r2: ['Μορφή Δυνάμεων', `${powerStr}`] },
        optionsRaw: [
          powerStr,
          '2³ · 3²',
          '2² · 3²',
          '4 · 27'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  },
  {
    id: 'p_factor_std_6',
    generate: () => {
      const num = 160;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: 'ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗ ΑΘΛΗΤΙΚΩΝ ΜΠΑΛΩΝ',
        instruction: 'Επιλέξτε τη σωστή ανάλυση σε δυνάμεις:',
        text: `Ένα γυμναστήριο έχει ${num} μπάλες τένις. Ποια είναι η ανάλυση του ${num} σε γινόμενο πρώτων παραγόντων με μορφή δυνάμεων;`,
        tableData: { col1: 'Αριθμός', col2: 'Ανάλυση', r1: [`${num}`, `${factors.join(' · ')}`], r2: ['Μορφή Δυνάμεων', `${powerStr}`] },
        optionsRaw: [
          powerStr,
          '2⁴ · 5',
          '2⁵ · 3',
          '32 · 5'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  }
];

// Διευρυμενη δεξαμενη προβληματων για την Ερωτηση 10 (MCQ)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_factor_hard_1',
    generate: () => {
      const num = 210;
      const factors = getPrimeFactors(num);
      const uniqueFactors = [...new Set(factors)];
      const count = uniqueFactors.length;
      return {
        title: 'ΔΙΑΦΟΡΕΤΙΚΟΙ ΠΡΩΤΟΙ ΠΑΡΑΓΟΝΤΕΣ ΣΤΟ ΕΛΑΙΟΛΑΔΟ',
        instruction: 'Επιλέξτε το πλήθος των διαφορετικών πρώτων παραγόντων:',
        text: `Ένας αγρότης συσκεύασε ${num} κιλά λάδι. Πόσους διαφορετικούς πρώτους παράγοντες περιέχει η ανάλυση του αριθμού ${num};`,
        tableData: { col1: 'Αριθμός', col2: 'Πρώτοι Παράγοντες', r1: [`${num}`, `${factors.join(' · ')}`], r2: ['Πλήθος', `${count} διαφορετικοί παράγοντες`] },
        optionsRaw: [
          String(count),
          String(count - 1),
          String(count + 1),
          String(count + 2)
        ],
        correctText: String(count),
        explanation: `${num} ＝ 2 · 3 · 5 · 7. Άρα έχει ακριβώς ${count} διαφορετικούς πρώτους παράγοντες.`
      };
    }
  },
  {
    id: 'p_factor_hard_2',
    generate: () => {
      const num = 300;
      const factors = getPrimeFactors(num);
      const uniqueFactors = [...new Set(factors)];
      const count = uniqueFactors.length;
      return {
        title: 'ΔΙΑΦΟΡΕΤΙΚΟΙ ΠΡΩΤΟΙ ΠΑΡΑΓΟΝΤΕΣ ΣΤΑ ΧΑΡΤΟΚΙΒΩΤΙΑ',
        instruction: 'Επιλέξτε το πλήθος των διαφορετικών πρώτων παραγόντων:',
        text: `Μια αποθήκη περιέχει ${num} χαρτοκιβώτια. Πόσους διαφορετικούς πρώτους παράγοντες έχει η παραγοντοποίηση του ${num};`,
        tableData: { col1: 'Αριθμός', col2: 'Ανάλυση', r1: [`${num}`, '2² · 3 · 5²'], r2: ['Διαφορετικοί', '2, 3, 5'] },
        optionsRaw: [
          String(count),
          String(count + 1),
          String(count + 2),
          String(count - 1)
        ],
        correctText: String(count),
        explanation: `${num} ＝ 2² · 3 · 5². Οι διαφορετικοί πρώτοι παράγοντες είναι οι 2, 3 και 5 (συνολικά ${count}).`
      };
    }
  },
  {
    id: 'p_factor_hard_3',
    generate: () => {
      const num = 240;
      const factors = getPrimeFactors(num);
      const totalCount = factors.length;
      return {
        title: 'ΣΥΝΟΛΙΚΟ ΠΛΗΘΟΣ ΠΡΩΤΩΝ ΠΑΡΑΓΟΝΤΩΝ',
        instruction: 'Επιλέξτε το συνολικό πλήθος παραγόντων (με τις επαναλήψεις):',
        text: `Ένα εργοστάσιο παρήγαγε ${num} εξαρτήματα. Πόσους πρώτους παράγοντες συνολικά (μαζί με τις επαναλήψεις) περιέχει η ανάλυση του ${num};`,
        tableData: { col1: 'Αριθμός', col2: 'Γινόμενο', r1: [`${num}`, `${factors.join(' · ')}`], r2: ['Σύνολο Παραγόντων', `${totalCount}`] },
        optionsRaw: [
          String(totalCount),
          String(totalCount - 1),
          String(totalCount + 1),
          String(totalCount + 2)
        ],
        correctText: String(totalCount),
        explanation: `${num} ＝ 2⁴ · 3 · 5 ＝ 2 · 2 · 2 · 2 · 3 · 5, άρα περιέχει ${totalCount} πρώτους παράγοντες συνολικά.`
      };
    }
  },
  {
    id: 'p_factor_hard_4',
    generate: () => {
      const num = 360;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: 'ΠΛΗΡΗΣ ΠΑΡΑΓΟΝΤΟΠΟΙΗΣΗ ΣΕ ΔΥΝΑΜΕΙΣ',
        instruction: 'Επιλέξτε τη σωστή μορφή δυνάμεων:',
        text: `Μια αίθουσα διαθέτει ${num} καθίσματα. Ποια είναι η πλήρης ανάλυση του ${num} σε γινόμενο πρώτων παραγόντων με μορφή δυνάμεων;`,
        tableData: { col1: 'Αριθμός', col2: 'Ανάλυση', r1: [`${num}`, `${factors.join(' · ')}`], r2: ['Μορφή Δυνάμεων', `${powerStr}`] },
        optionsRaw: [
          powerStr,
          '2² · 3³ · 5',
          '2⁴ · 3 · 5',
          '8 · 9 · 5'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  },
  {
    id: 'p_factor_hard_5',
    generate: () => {
      const num = 420;
      const factors = getPrimeFactors(num);
      const uniqueFactors = [...new Set(factors)];
      const count = uniqueFactors.length;
      return {
        title: 'ΠΡΩΤΟΙ ΠΑΡΑΓΟΝΤΕΣ ΣΕ ΦΑΡΜΑΚΕΥΤΙΚΑ ΣΚΕΥΑΣΜΑΤΑ',
        instruction: 'Επιλέξτε το πλήθος των διαφορετικών πρώτων παραγόντων:',
        text: `Ένα φαρμακείο παρέλαβε ${num} σκευάσματα. Πόσους διαφορετικούς πρώτους παράγοντες περιέχει η ανάλυση του ${num};`,
        tableData: { col1: 'Αριθμός', col2: 'Ανάλυση', r1: [`${num}`, '2² · 3 · 5 · 7'], r2: ['Διαφορετικοί', '2, 3, 5, 7'] },
        optionsRaw: [
          String(count),
          String(count - 1),
          String(count + 1),
          String(count + 2)
        ],
        correctText: String(count),
        explanation: `${num} ＝ 2² · 3 · 5 · 7. Οι διαφορετικοί πρώτοι παράγοντες είναι 4 (το 2, 3, 5 και 7).`
      };
    }
  },
  {
    id: 'p_factor_hard_6',
    generate: () => {
      const num = 500;
      const factors = getPrimeFactors(num);
      const powerStr = getPowerRepresentation(factors);
      return {
        title: 'ΑΝΑΛΥΣΗ ΦΥΛΛΩΝ ΧΑΡΤΙΟΥ',
        instruction: 'Επιλέξτε τη σωστή μορφή δυνάμεων:',
        text: `Μια δεσμίδα περιέχει ${num} φύλλα χαρτί. Ποια είναι η σωστή παραγοντοποίηση του ${num} σε πρώτους παράγοντες;`,
        tableData: { col1: 'Αριθμός', col2: 'Ανάλυση', r1: [`${num}`, `${factors.join(' · ')}`], r2: ['Μορφή Δυνάμεων', `${powerStr}`] },
        optionsRaw: [
          powerStr,
          '2³ · 5²',
          '2 · 5⁴',
          '4 · 125'
        ],
        correctText: powerStr,
        explanation: `${num} ＝ ${factors.join(' · ')} ＝ ${powerStr}.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (MCQ): Σωστή παραγοντοποίηση ενός αριθμού σε μορφή δυνάμεων (Εγγύηση Μοναδικότητας)
  {
    const q1Pool = [24, 36, 40, 48, 60, 72, 90, 100, 120];
    const q1Num = q1Pool[randInt(0, q1Pool.length - 1)];
    const q1Factors = getPrimeFactors(q1Num);
    const q1Correct = getPowerRepresentation(q1Factors);

    const q1Wrong1 = q1Factors.join(' · ');
    const q1Wrong2 = getPowerRepresentation(getPrimeFactors(q1Num + 6)) || '2³ · 5';
    const q1Wrong3 = `${q1Factors[0]} · ${q1Num / q1Factors[0]}`;

    const rawOptions = [q1Correct, q1Wrong1, q1Wrong2, q1Wrong3];
    const options = shuffle([...new Set(rawOptions)]).slice(0, 4).map((text) => ({
      text,
      isCorrect: text === q1Correct
    }));

    qList.push({
      id: 1,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 1 • ΑΝΑΛΥΣΗ ΣΕ ΠΡΩΤΟΥΣ ΠΑΡΑΓΟΝΤΕΣ',
      instruction: 'Επιλέξτε τη σωστή παραγοντοποίηση σε μορφή δυνάμεων:',
      prompt: `Ποια είναι η σωστή παραγοντοποίηση του αριθμού ${q1Num} σε μορφή δυνάμεων;`,
      options,
      correctText: q1Correct,
      explanation: `Η ανάλυση του ${q1Num} είναι: ${q1Factors.join(' · ')} ＝ ${q1Correct}.`
    });
  }

  // Q2 (Input - Decimal): Μικρότερος πρώτος διαιρέτης μιας περιττής σύνθετης τιμής
  {
    const q2Pool = [27, 35, 45, 63, 75, 105, 135];
    const q2Num = q2Pool[randInt(0, q2Pool.length - 1)];
    const q2Factors = getPrimeFactors(q2Num);
    const q2Correct = q2Factors[0];

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΜΙΚΡΟΤΕΡΟΣ ΠΡΩΤΟΣ ΔΙΑΙΡΕΤΗΣ',
      instruction: 'Συμπληρώστε τον μικρότερο πρώτο διαιρέτη (ακέραιος):',
      prompt: `Ποιος είναι ο μικρότερος πρώτος διαιρέτης του αριθμού ${q2Num};`,
      correctVal: q2Correct,
      correctStr: String(q2Correct),
      explanation: `Οι πρώτοι παράγοντες του ${q2Num} είναι: ${q2Factors.join(', ')}. Ο μικρότερος είναι το ${q2Correct}.`
    });
  }

  // Q3 (MCQ): Εύρεση αριθμού από τη μορφή δυνάμεών του (Εγγύηση Μοναδικότητας)
  {
    const q3Presets = [
      { expr: '2² · 3 · 5', val: 60 },
      { expr: '2³ · 3²', val: 72 },
      { expr: '2 · 3² · 5', val: 90 },
      { expr: '2² · 5²', val: 100 },
      { expr: '2³ · 3 · 5', val: 120 },
      { expr: '3² · 5²', val: 225 }
    ];
    const q3Chosen = q3Presets[randInt(0, q3Presets.length - 1)];
    const q3CorrectStr = String(q3Chosen.val);

    const rawOptions = [
      q3CorrectStr,
      String(q3Chosen.val - 10),
      String(q3Chosen.val + 12),
      String(Math.floor(q3Chosen.val / 2))
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q3CorrectStr
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΕΥΡΕΣΗ ΑΡΙΘΜΟΥ ΑΠΟ ΔΥΝΑΜΕΙΣ',
      instruction: 'Επιλέξτε τον σωστό αριθμό:',
      prompt: `Ποιος αριθμός έχει παραγοντοποίηση ${q3Chosen.expr};`,
      options,
      correctText: q3CorrectStr,
      explanation: `Υπολογίζουμε τις δυνάμεις και το γινόμενο: ${q3Chosen.expr} ＝ ${q3Chosen.val}.`
    });
  }

  // Q4 (MCQ): Εύρεση παράγοντα/εκθέτη που λείπει (Εγγύηση Μοναδικότητας)
  {
    const q4Presets = [
      { num: 72, known: '2³ · ', missing: '3²', explain: '72 ＝ 8 · 9 ＝ 2³ · 3²' },
      { num: 60, known: '2² · ', missing: '3 · 5', explain: '60 ＝ 4 · 15 ＝ 2² · 3 · 5' },
      { num: 100, known: '2² · ', missing: '5²', explain: '100 ＝ 4 · 25 ＝ 2² · 5²' },
      { num: 120, known: '2³ · ', missing: '3 · 5', explain: '120 ＝ 8 · 15 ＝ 2³ · 3 · 5' },
      { num: 90, known: '2 · ', missing: '3² · 5', explain: '90 ＝ 2 · 45 ＝ 2 · 3² · 5' }
    ];
    const q4Chosen = q4Presets[randInt(0, q4Presets.length - 1)];
    const rawOptions = [q4Chosen.missing, '3', '5', '2²'];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q4Chosen.missing
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΣΥΜΠΛΗΡΩΣΗ ΠΑΡΑΓΟΝΤΑ',
      instruction: 'Επιλέξτε τον παράγοντα που λείπει:',
      prompt: `Συμπληρώστε το κενό: ${q4Chosen.num} ＝ ${q4Chosen.known} [ ? ]`,
      options,
      correctText: q4Chosen.missing,
      explanation: q4Chosen.explain
    });
  }

  // Q5 (MCQ): True / False - Μοναδικότητα ανάλυσης
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Κάθε σύνθετος αριθμός αναλύεται κατά έναν και μοναδικό τρόπο σε γινόμενο πρώτων παραγόντων.'
      : 'Ένας σύνθετος αριθμός μπορεί να έχει πολλές διαφορετικές αναλύσεις σε πρώτους παράγοντες.';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΜΟΝΑΔΙΚΟΤΗΤΑ ΑΝΑΛΥΣΕΩΣ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Η ανάλυση κάθε σύνθετου αριθμού σε γινόμενο πρώτων παραγόντων είναι μοναδική (Θεμελιώδες Θεώρημα της Αριθμητικής).'
        : 'Λάθος! Κάθε σύνθετος αριθμός έχει μία και μοναδική παραγοντοποίηση σε πρώτους αριθμούς.'
    });
  }

  // Q6 (MCQ): True / False - Κανόνας κατακόρυφης γραμμής
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Στη μέθοδο των διαδοχικών διαιρέσεων, δεξιά από την κατακόρυφη γραμμή γράφουμε μόνο πρώτους αριθμούς.'
      : 'Στη μέθοδο των διαδοχικών διαιρέσεων, δεξιά από την κατακόρυφη γραμμή μπορούμε να γράψουμε και σύνθετους αριθμούς (π.χ. 4 ή 6).';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΔΙΑΔΟΧΙΚΩΝ ΔΙΑΙΡΕΣΕΩΝ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Δεξιά από τη γραμμή γράφουμε αποκλειστικά πρώτους αριθμούς (2, 3, 5, 7...).'
        : 'Λάθος! Δεν επιτρέπεται να γράψουμε σύνθετους αριθμούς δεξιά από τη γραμμή.'
    });
  }

  // Q7 (Input - Decimal): Πλήθος πρώτων παραγόντων (με επαναλήψεις)
  {
    const q7Pool = [18, 24, 30, 36, 40, 48, 60, 72];
    const q7Num = q7Pool[randInt(0, q7Pool.length - 1)];
    const q7Factors = getPrimeFactors(q7Num);
    const q7Correct = q7Factors.length;

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΛΗΘΟΣ ΠΡΩΤΩΝ ΠΑΡΑΓΟΝΤΩΝ',
      instruction: 'Υπολογίστε το πλήθος των πρώτων παραγόντων (ακέραιος):',
      prompt: `Πόσους πρώτους παράγοντες συνολικά (μαζί με τις επαναλήψεις) έχει ο αριθμός ${q7Num};`,
      correctVal: q7Correct,
      correctStr: String(q7Correct),
      explanation: `${q7Num} ＝ ${q7Factors.join(' · ')} (συνολικά ${q7Correct} πρώτοι παράγοντες).`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας (Εγγύηση Μοναδικότητας)
  {
    const q8Presets = [
      { num: 36, item: 'κουτάκια', explain: '36 ＝ 2² · 3² (2 · 2 · 3 · 3)' },
      { num: 48, item: 'καραμέλες', explain: '48 ＝ 2⁴ · 3 (2 · 2 · 2 · 2 · 3)' },
      { num: 60, item: 'βιβλία', explain: '60 ＝ 2² · 3 · 5 (2 · 2 · 3 · 5)' },
      { num: 90, item: 'σοκολάτες', explain: '90 ＝ 2 · 3² · 5 (2 · 3 · 3 · 5)' }
    ];
    const q8Chosen = q8Presets[randInt(0, q8Presets.length - 1)];
    const q8CorrectStr = getPowerRepresentation(getPrimeFactors(q8Chosen.num));
    const q8Wrong1 = `${q8Chosen.num / 2} · 2`;
    const q8Wrong2 = `6 · ${q8Chosen.num / 6}`;
    const q8Wrong3 = `10 · ${q8Chosen.num / 10}`;

    const rawOptions = [q8CorrectStr, q8Wrong1, q8Wrong2, q8Wrong3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8CorrectStr
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: 'Επιλέξτε την πλήρη ανάλυση σε πρώτους παράγοντες:',
      prompt: `Ένα εργαστήριο συσκευάζει ${q8Chosen.num} ${q8Chosen.item}. Ποια έκφραση αντιπροσωπεύει την πλήρη ανάλυση σε πρώτους παράγοντες;`,
      options,
      correctText: q8CorrectStr,
      explanation: `Η πλήρης ανάλυση του ${q8Chosen.num} σε πρώτους παράγοντες είναι: ${q8Chosen.explain}.`
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

export default function ParagontopoiisiExercisesPage() {
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

  // Χειρισμος Input με καθαρισμο χαρακτηρων (μονο 0-9 και ενα κομμα, οριο 10 χαρακτηρων)
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
      title="Ασκήσεις: Παραγοντοποίηση Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στην παραγοντοποίηση αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/17-paragontopoiisi"
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
              Ασκήσεις &amp; Προβλήματα: Παραγοντοποίηση Αριθμών
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες ανάλυσης σύνθετων αριθμών σε πρώτους παράγοντες, μορφής δυνάμεων, διαδοχικών διαιρέσεων και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
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

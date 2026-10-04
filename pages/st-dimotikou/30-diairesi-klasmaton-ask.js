// pages/st-dimotikou/30-diairesi-klasmaton-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ & DEFENSIVE CHECKS
// ---------------------------------------------------------

function randInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
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

function findGCD(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Αφαιρεση τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποιηση αριθμων με ελληνικο locale
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    title: 'Συσκευασία Αλευριού σε Σακουλάκια',
    unit: 'σακουλάκια',
    generate: () => {
      // 3/4 : 1/8 = 3/4 · 8/1 = 24/4 = 6
      const n1 = 3;
      const d1 = 4;
      const n2 = 1;
      const d2 = 8;
      const res = (n1 * d2) / (d1 * n2);
      return {
        prompt: `Έχουμε ${n1}/${d1} του κιλού αλεύρι και θέλουμε να τα συσκευάσουμε σε σακουλάκια που χωρούν ${n2}/${d2} του κιλού το καθένα. Πόσα σακουλάκια θα γεμίσουν συνολικά;`,
        unit: 'σακουλάκια',
        correctVal: String(res),
        correctText: `${res} σακουλάκια`,
        tableData: [
          { item: 'Συνολικό αλεύρι', formula: `${n1}/${d1} κιλά`, val: `${n1}/${d1}` },
          { item: 'Χωρητικότητα σακούλας', formula: `${n2}/${d2} κιλά`, val: `${n2}/${d2}` },
          { item: 'Διαίρεση', formula: `(${n1}/${d1}) : (${n2}/${d2}) ＝ (${n1}/${d1}) · (${d2}/${n2})`, val: `${res} σακουλάκια` }
        ],
        explain: `Διαιρούμε τη συνολική ποσότητα με τη χωρητικότητα κάθε σακούλας: (${n1}/${d1}) : (${n2}/${d2}) ＝ (${n1}/${d1}) · (${d2}/${n2}) ＝ 24/4 ＝ ${res} σακουλάκια.`,
        distractors: [String(res + 2), String(res - 2), String(res * 2)]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Μοίρασμα Χυμού σε Μπουκαλάκια',
    unit: 'μπουκαλάκια',
    generate: () => {
      // 4/5 : 1/10 = 4/5 · 10/1 = 40/5 = 8
      const n1 = 4;
      const d1 = 5;
      const n2 = 1;
      const d2 = 10;
      const res = (n1 * d2) / (d1 * n2);
      return {
        prompt: `Μία κανάτα περιέχει ${n1}/${d1} του λίτρου χυμό. Μοιράζουμε τον χυμό σε μπουκαλάκια των ${n2}/${d2} του λίτρου. Πόσα μπουκαλάκια θα γεμίσουν;`,
        unit: 'μπουκαλάκια',
        correctVal: String(res),
        correctText: `${res} μπουκαλάκια`,
        tableData: [
          { item: 'Συνολικός χυμός', formula: `${n1}/${d1} λ.`, val: `${n1}/${d1}` },
          { item: 'Μέγεθος μερίδας', formula: `${n2}/${d2} λ.`, val: `${n2}/${d2}` },
          { item: 'Διαίρεση', formula: `(${n1}/${d1}) · (${d2}/${n2}) ＝ 40/5`, val: `${res} μπουκαλάκια` }
        ],
        explain: `Υπολογίζουμε: (${n1}/${d1}) : (${n2}/${d2}) ＝ (${n1}/${d1}) · (${d2}/${n2}) ＝ 40/5 ＝ ${res} μπουκαλάκια.`,
        distractors: [String(res - 2), String(res + 2), String(res + 4)]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Κοπή Κορδέλας σε Ίσα Κομμάτια',
    unit: 'κομμάτια',
    generate: () => {
      // 3/2 : 1/4 = 3/2 · 4/1 = 12/2 = 6
      const n1 = 3;
      const d1 = 2;
      const n2 = 1;
      const d2 = 4;
      const res = (n1 * d2) / (d1 * n2);
      return {
        prompt: `Μια κορδέλα έχει μήκος ${n1}/${d1} του μέτρου (1 και 1/2 μέτρο). Την κόβουμε σε κομμάτια μήκους ${n2}/${d2} του μέτρου. Πόσα κομμάτια θα πάρουμε συνολικά;`,
        unit: 'κομμάτια',
        correctVal: String(res),
        correctText: `${res} κομμάτια`,
        tableData: [
          { item: 'Συνολικό μήκος', formula: `${n1}/${d1} μ.`, val: `${n1}/${d1}` },
          { item: 'Μήκος κομματιού', formula: `${n2}/${d2} μ.`, val: `${n2}/${d2}` },
          { item: 'Διαίρεση', formula: `(${n1}/${d1}) · (${d2}/${n2}) ＝ 12/2`, val: `${res} κομμάτια` }
        ],
        explain: `Εκτελούμε τη διαίρεση: (${n1}/${d1}) : (${n2}/${d2}) ＝ (${n1}/${d1}) · (${d2}/${n2}) ＝ 12/2 ＝ ${res} κομμάτια.`,
        distractors: [String(res + 2), String(res - 1), String(res + 4)]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Συσκευασία Βάζων Μελιού',
    unit: 'βαζάκια',
    generate: () => {
      // 2/3 : 1/6 = 2/3 · 6/1 = 12/3 = 4
      const n1 = 2;
      const d1 = 3;
      const n2 = 1;
      const d2 = 6;
      const res = (n1 * d2) / (d1 * n2);
      return {
        prompt: `Ένας μελισσοκόμος έχει ${n1}/${d1} του κιλού μέλι και το τοποθετεί σε βαζάκια των ${n2}/${d2} του κιλού. Πόσα βαζάκια θα γεμίσουν;`,
        unit: 'βαζάκια',
        correctVal: String(res),
        correctText: `${res} βαζάκια`,
        tableData: [
          { item: 'Συνολικό μέλι', formula: `${n1}/${d1} κιλά`, val: `${n1}/${d1}` },
          { item: 'Μέγεθος βάζου', formula: `${n2}/${d2} κιλά`, val: `${n2}/${d2}` },
          { item: 'Διαίρεση', formula: `(${n1}/${d1}) · (${d2}/${n2}) ＝ 12/3`, val: `${res} βαζάκια` }
        ],
        explain: `Διαιρούμε: (${n1}/${d1}) : (${n2}/${d2}) ＝ (${n1}/${d1}) · (${d2}/${n2}) ＝ 12/3 ＝ ${res} βαζάκια.`,
        distractors: [String(res + 2), String(res - 1), String(res + 3)]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Κοπή Υφάσματος για Λωρίδες',
    unit: 'λωρίδες',
    generate: () => {
      // 5/2 : 1/2 = 5/2 · 2/1 = 5
      const n1 = 5;
      const d1 = 2;
      const n2 = 1;
      const d2 = 2;
      const res = (n1 * d2) / (d1 * n2);
      return {
        prompt: `Ένα ύφασμα έχει μήκος ${n1}/${d1} του μέτρου και κόβεται σε λωρίδες των ${n2}/${d2} του μέτρου. Πόσες λωρίδες θα προκύψουν;`,
        unit: 'λωρίδες',
        correctVal: String(res),
        correctText: `${res} λωρίδες`,
        tableData: [
          { item: 'Μήκος υφάσματος', formula: `${n1}/${d1} μ.`, val: `${n1}/${d1}` },
          { item: 'Μήκος λωρίδας', formula: `${n2}/${d2} μ.`, val: `${n2}/${d2}` },
          { item: 'Διαίρεση', formula: `(${n1}/${d1}) · (${d2}/${n2}) ＝ 10/2`, val: `${res} λωρίδες` }
        ],
        explain: `Υπολογίζουμε: (${n1}/${d1}) : (${n2}/${d2}) ＝ (${n1}/${d1}) · (${d2}/${n2}) ＝ 10/2 ＝ ${res} λωρίδες.`,
        distractors: [String(res + 2), String(res - 2), String(res + 1)]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Συσκευασία Καφέ σε Κουτάκια',
    unit: 'κουτάκια',
    generate: () => {
      // 3/5 : 1/10 = 3/5 · 10/1 = 30/5 = 6
      const n1 = 3;
      const d1 = 5;
      const n2 = 1;
      const d2 = 10;
      const res = (n1 * d2) / (d1 * n2);
      return {
        prompt: `Μία ποσότητα καφέ ζυγίζει ${n1}/${d1} του κιλού και συσκευάζεται σε κουτάκια των ${n2}/${d2} του κιλού. Πόσα κουτάκια θα γεμίσουν συνολικά;`,
        unit: 'κουτάκια',
        correctVal: String(res),
        correctText: `${res} κουτάκια`,
        tableData: [
          { item: 'Συνολικός καφές', formula: `${n1}/${d1} κιλά`, val: `${n1}/${d1}` },
          { item: 'Μέγεθος κουτιού', formula: `${n2}/${d2} κιλά`, val: `${n2}/${d2}` },
          { item: 'Διαίρεση', formula: `(${n1}/${d1}) · (${d2}/${n2}) ＝ 30/5`, val: `${res} κουτάκια` }
        ],
        explain: `Διαιρούμε: (${n1}/${d1}) : (${n2}/${d2}) ＝ (${n1}/${d1}) · (${d2}/${n2}) ＝ 30/5 ＝ ${res} κουτάκια.`,
        distractors: [String(res + 2), String(res - 2), String(res * 2)]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Σύνθετο Κλάσμα με Άκρους & Μέσους',
    unit: '',
    generate: () => {
      // (2/3) / (4/5) = (2 · 5) / (3 · 4) = 10/12 = 5/6
      const a = 2;
      const b = 3;
      const c = 4;
      const d = 5;
      return {
        prompt: `Υπολόγισε την τιμή του σύνθετου κλάσματος: (${a}/${b}) / (${c}/${d}):`,
        unit: '',
        correctVal: '5/6',
        correctText: '5/6 (ή 10/12)',
        tableData: [
          { item: 'Γινόμενο άκρων (έξω)', formula: `${a} · ${d}`, val: '10' },
          { item: 'Γινόμενο μέσων (μέσα)', formula: `${b} · ${c}`, val: '12' },
          { item: 'Απλοποίηση', formula: '10/12 (: 2)', val: '5/6' }
        ],
        explain: `Στο σύνθετο κλάσμα πολλαπλασιάζουμε τους άκρους όρους για τον αριθμητή και τους μέσους για τον παρονομαστή: (2 · 5) / (3 · 4) ＝ 10/12 ＝ 5/6.`,
        distractors: ['6/5', '8/15', '12/10']
      };
    }
  },
  {
    id: 'hp2',
    title: 'Διαίρεση Ακέραιου με Κλάσμα (Μοίρασμα)',
    unit: 'μερίδες',
    generate: () => {
      // 5 : 1/3 = 5 · 3/1 = 15
      const whole = 5;
      const den = 3;
      const res = whole * den;
      return {
        prompt: `Ένας σεφ έχει ${whole} ολόκληρα κιλά κιμά και φτιάχνει μπιφτέκια βάρους 1/${den} του κιλού το καθένα. Πόσα μπιφτέκια θα φτιάξει συνολικά;`,
        unit: 'μπιφτέκια',
        correctVal: String(res),
        correctText: `${res} μπιφτέκια`,
        tableData: [
          { item: 'Συνολικός κιμάς', formula: `${whole} κιλά`, val: `${whole}` },
          { item: 'Βάρος μπιφτεκιού', formula: `1/${den} κιλά`, val: `1/${den}` },
          { item: 'Διαίρεση', formula: `${whole} : (1/${den}) ＝ ${whole} · ${den}`, val: `${res} μπιφτέκια` }
        ],
        explain: `Διαιρούμε τον ακέραιο με το κλάσμα: ${whole} : (1/${den}) ＝ ${whole} · (${den}/1) ＝ ${res} μπιφτέκια.`,
        distractors: [String(res - 3), String(res + 3), String(whole + den)]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Εύρεση Άγνωστου Διαιρέτη',
    unit: '',
    generate: () => {
      // 3/4 : [?] = 3/8 -> [?] = 3/4 : 3/8 = 3/4 · 8/3 = 24/12 = 2
      return {
        prompt: 'Ποιος είναι ο άγνωστος αριθμός x στην ισότητα: (3/4) : x ＝ 3/8;',
        unit: '',
        correctVal: '2',
        correctText: 'x ＝ 2 (ακέραιος)',
        tableData: [
          { item: 'Διαιρετέος', formula: '3/4', val: '3/4' },
          { item: 'Πηλίκο', formula: '3/8', val: '3/8' },
          { item: 'Υπολογισμός διαιρέτη', formula: '(3/4) : (3/8) ＝ (3/4) · (8/3) ＝ 24/12', val: '2' }
        ],
        explain: `Για να βρούμε τον διαιρέτη, διαιρούμε τον διαιρετέο με το πηλίκο: x ＝ (3/4) : (3/8) ＝ (3/4) · (8/3) ＝ 24/12 ＝ 2.`,
        distractors: ['1/2', '4', '8']
      };
    }
  },
  {
    id: 'hp4',
    title: 'Διαίρεση με Μικτό Αριθμό',
    unit: '',
    generate: () => {
      // 3/4 : (1 και 1/2) = 3/4 : 3/2 = 3/4 · 2/3 = 6/12 = 1/2
      return {
        prompt: 'Υπολόγισε το πηλίκο της διαίρεσης: (3/4) : (1 και 1/2):',
        unit: '',
        correctVal: '1/2',
        correctText: '1/2 (ή 6/12)',
        tableData: [
          { item: 'Μικτός σε κλάσμα', formula: '1 και 1/2 ＝ 2/2 ＋ 1/2', val: '3/2' },
          { item: 'Αντιστροφή διαιρέτη', formula: 'Αντίστροφο του 3/2', val: '2/3' },
          { item: 'Πολλαπλασιασμός', formula: '(3/4) · (2/3) ＝ 6/12 (: 6)', val: '1/2' }
        ],
        explain: `Μετατρέπουμε τον μικτό αριθμό σε κλάσμα: 1 και 1/2 ＝ 3/2. Έπειτα εκτελούμε: (3/4) : (3/2) ＝ (3/4) · (2/3) ＝ 6/12 ＝ 1/2.`,
        distractors: ['3/8', '2', '9/8']
      };
    }
  },
  {
    id: 'hp5',
    title: 'Σύνθετο Κλάσμα με Ακέραιο',
    unit: '',
    generate: () => {
      // (3/4) / 6 = (3/4) / (6/1) = 3/24 = 1/8
      return {
        prompt: 'Υπολόγισε την τιμή του σύνθετου κλάσματος: (3/4) / 6:',
        unit: '',
        correctVal: '1/8',
        correctText: '1/8 (ή 3/24)',
        tableData: [
          { item: 'Ακέραιος ως κλάσμα', formula: '6 ＝ 6/1', val: '6/1' },
          { item: 'Άκροι όροι', formula: '3 · 1', val: '3' },
          { item: 'Μέσοι όροι', formula: '4 · 6', val: '24' },
          { item: 'Απλοποίηση', formula: '3/24 (: 3)', val: '1/8' }
        ],
        explain: `Γράφουμε τον ακέραιο 6 ως 6/1. Στο σύνθετο κλάσμα (3/4) / (6/1) οι άκροι δίνουν 3 · 1 ＝ 3 και οι μέσοι 4 · 6 ＝ 24. Απλοποιώντας: 3/24 ＝ 1/8.`,
        distractors: ['9/2', '1/2', '3/8']
      };
    }
  },
  {
    id: 'hp6',
    title: 'Σύγκριση Αποτελέσματος Διαίρεσης',
    unit: '',
    generate: () => {
      // Διαίρεση με γνήσιο κλάσμα μεγαλώνει τον αριθμό
      return {
        prompt: 'Έστω η διαίρεση 4 : (2/3). Ποια σχέση συνδέει το πηλίκο με τον αρχικό αριθμό 4;',
        unit: '',
        correctVal: 'Το πηλίκο είναι 6 (μεγαλύτερο από το 4)',
        correctText: 'Το πηλίκο είναι 6 (μεγαλύτερο από το 4)',
        tableData: [
          { item: 'Πράξη διαίρεσης', formula: '4 : (2/3) ＝ 4 · (3/2)', val: '12/2 ＝ 6' },
          { item: 'Σύγκριση με τον διαιρετέο', formula: '6 ＞ 4', val: 'Πηλίκο ＞ 4' }
        ],
        explain: `Υπολογίζουμε: 4 : (2/3) ＝ 4 · (3/2) ＝ 12/2 ＝ 6. Επειδή διαιρούμε με αριθμό μικρότερο του 1 (2/3 ＜ 1), το πηλίκο είναι μεγαλύτερο από τον αρχικό αριθμό (6 ＞ 4).`,
        distractors: [
          'Το πηλίκο είναι 8/3 (μικρότερο από το 4)',
          'Το πηλίκο είναι ίσο με 4',
          'Το πηλίκο είναι 2'
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Διαίρεση Κλάσματος με Κλάσμα
  const q1Num1 = randInt(1, 4);
  const q1Den1 = randInt(q1Num1 + 1, 6);
  const q1Num2 = randInt(1, 3);
  const q1Den2 = randInt(q1Num2 + 1, 5);
  const q1ResN = q1Num1 * q1Den2;
  const q1ResD = q1Den1 * q1Num2;
  const q1G = findGCD(q1ResN, q1ResD);
  const q1CorrectRaw = `${q1ResN}/${q1ResD}`;
  const q1CorrectSimp = q1ResD / q1G === 1 ? String(q1ResN / q1G) : `${q1ResN / q1G}/${q1ResD / q1G}`;

  // Q2: Input - Διαίρεση Κλάσματος με Ακέραιο
  const q2Num = randInt(2, 6);
  const q2Den = randInt(3, 7);
  const q2Whole = randInt(2, 4);
  const q2ResN = q2Num;
  const q2ResD = q2Den * q2Whole;
  const q2G = findGCD(q2ResN, q2ResD);
  const q2CorrectRaw = `${q2ResN}/${q2ResD}`;
  const q2CorrectSimp = q2ResD / q2G === 1 ? String(q2ResN / q2G) : `${q2ResN / q2G}/${q2ResD / q2G}`;

  // Q3: MCQ - Διαίρεση Ακέραιου με Κλάσμα (π.χ. 3 : 1/2 = 6)
  const q3Whole = randInt(2, 4);
  const q3Den = randInt(2, 4);
  const q3Res = q3Whole * q3Den;
  const q3CorrectStr = String(q3Res);
  const q3Wrongs = [
    String(q3Whole + q3Den),
    `${q3Whole}/${q3Den}`,
    String(Math.max(1, q3Res - 2))
  ];
  const q3Options = shuffle([...new Set([q3CorrectStr, ...q3Wrongs])]);

  // Q4: MCQ - Μετατροπή σε Πολλαπλασιασμό
  const q4N1 = randInt(2, 5);
  const q4D1 = randInt(3, 7);
  const q4N2 = randInt(1, 4);
  const q4D2 = randInt(2, 6);
  const q4CorrectStr = `(${q4N1}/${q4D1}) · (${q4D2}/${q4N2})`;
  const q4Wrongs = [
    `(${q4D1}/${q4N1}) · (${q4N2}/${q4D2})`,
    `(${q4N1}/${q4D1}) · (${q4N2}/${q4D2})`,
    `(${q4D1}/${q4N1}) · (${q4D2}/${q4N2})`
  ];
  const q4Options = shuffle([...new Set([q4CorrectStr, ...q4Wrongs])]);

  // Q5: True/False - Κανόνας αντιστροφής
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στη διαίρεση κλασμάτων αντιστρέφουμε πάντοτε τους όρους του δεύτερου κλάσματος (διαιρέτη) και κάνουμε πολλαπλασιασμό.'
    : 'Στη διαίρεση κλασμάτων αντιστρέφουμε τους όρους του πρώτου κλάσματος (διαιρετέου) και κάνουμε πολλαπλασιασμό.';

  // Q6: True/False - Διαίρεση με κλάσμα < 1
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Όταν διαιρούμε έναν αριθμό με ένα γνήσιο κλάσμα (μικρότερο του 1), το πηλίκο είναι μεγαλύτερο από τον αρχικό αριθμό.'
    : 'Όταν διαιρούμε έναν αριθμό με ένα γνήσιο κλάσμα (μικρότερο του 1), το πηλίκο είναι πάντοτε μικρότερο από τον αρχικό αριθμό.';

  // Q7: Input - Σύνθετο Κλάσμα (Άκροι / Μέσοι)
  const q7A = randInt(1, 3);
  const q7B = randInt(2, 4);
  const q7C = randInt(1, 3);
  const q7D = randInt(2, 5);
  const q7Top = q7A * q7D;
  const q7Bot = q7B * q7C;
  const q7G = findGCD(q7Top, q7Bot);
  const q7CorrectRaw = `${q7Top}/${q7Bot}`;
  const q7CorrectSimp = q7Bot / q7G === 1 ? String(q7Top / q7G) : `${q7Top / q7G}/${q7Bot / q7G}`;

  // Q8: MCQ - Πράξη σύνθετου κλάσματος
  const q8Top = '1/2';
  const q8Bot = '3/4';
  const q8CorrectComp = '4/6';
  const q8CorrectSimpComp = '2/3';
  const q8WrongsComp = ['3/8', '8/3', '1/4'];
  const q8Options = shuffle([...new Set([q8CorrectSimpComp, ...q8WrongsComp])]);

  // Q9: Standard Problem (Pool of 6)
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate();
  const q9Options = shuffle([
    ...new Set([q9Raw.correctText, ...q9Raw.distractors])
  ]);

  // Q10: Hard Problem (Pool of 6)
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate();
  const q10Options = shuffle([
    ...new Set([q10Raw.correctText, ...q10Raw.distractors])
  ]);

  return [
    {
      id: 'q1',
      type: 'input',
      title: 'Κλάσμα : Κλάσμα',
      prompt: `Υπολόγισε το πηλίκο: (${q1Num1}/${q1Den1}) : (${q1Num2}/${q1Den2}) (π.χ. 3/2):`,
      correct: q1CorrectRaw,
      altCorrect: q1CorrectSimp,
      explain: `(${q1Num1}/${q1Den1}) : (${q1Num2}/${q1Den2}) ＝ (${q1Num1}/${q1Den1}) · (${q1Den2}/${q1Num2}) ＝ ${q1CorrectRaw}${q1G > 1 ? ` (ή απλοποιημένο: ${q1CorrectSimp})` : ''}.`
    },
    {
      id: 'q2',
      type: 'input',
      title: 'Κλάσμα : Ακέραιο',
      prompt: `Υπολόγισε το πηλίκο: (${q2Num}/${q2Den}) : ${q2Whole} (π.χ. 3/8):`,
      correct: q2CorrectRaw,
      altCorrect: q2CorrectSimp,
      explain: `(${q2Num}/${q2Den}) : ${q2Whole} ＝ (${q2Num}/${q2Den}) · (1/${q2Whole}) ＝ ${q2CorrectRaw}${q2G > 1 ? ` ＝ ${q2CorrectSimp}` : ''}.`
    },
    {
      id: 'q3',
      type: 'mcq',
      title: 'Ακέραιος : Κλάσμα',
      prompt: `Ποιο είναι το αποτέλεσμα της διαίρεσης ${q3Whole} : (1/${q3Den});`,
      options: q3Options,
      correct: q3CorrectStr,
      explain: `${q3Whole} : (1/${q3Den}) ＝ ${q3Whole} · (${q3Den}/1) ＝ ${q3Whole * q3Den} ＝ ${q3CorrectStr}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Κανόνας Αντιστροφής',
      prompt: `Πώς μετατρέπεται σε πολλαπλασιασμό η διαίρεση (${q4N1}/${q4D1}) : (${q4N2}/${q4D2});`,
      options: q4Options,
      correct: q4CorrectStr,
      explain: `Κρατάμε το 1ο κλάσμα όπως είναι και πολλαπλασιάζουμε με το αντίστροφο του 2ου: ${q4CorrectStr}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Χρυσός Κανόνας Διαίρεσης',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Αντιστρέφουμε πάντοτε το 2ο κλάσμα (διαιρέτη) και κάνουμε πολλαπλασιασμό.'
        : 'Λάθος! Το 1ο κλάσμα (διαιρετέος) παραμένει ΑΜΕΤΑΒΛΗΤΟ. Αντιστρέφουμε μόνο το 2ο κλάσμα.'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Διαίρεση με Κλάσμα ＜ 1',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Επειδή ένα μικρό κομμάτι χωράει πολλές φορές, το πηλίκο είναι μεγαλύτερο από τον διαιρετέο (π.χ. 2 : 1/2 ＝ 4 ＞ 2).'
        : 'Λάθος! Όταν διαιρούμε με κλάσμα ＜ 1, το αποτέλεσμα μεγαλώνει (π.χ. 3 : 1/2 ＝ 6).'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Σύνθετο Κλάσμα (Άκροι & Μέσοι)',
      prompt: `Υπολόγισε την τιμή του σύνθετου κλάσματος: (${q7A}/${q7B}) / (${q7C}/${q7D}) (π.χ. 6/5):`,
      correct: q7CorrectRaw,
      altCorrect: q7CorrectSimp,
      explain: `Γινόμενο άκρων προς γινόμενο μέσων: (${q7A} · ${q7D}) / (${q7B} · ${q7C}) ＝ ${q7CorrectRaw}${q7G > 1 ? ` (ή απλοποιημένο: ${q7CorrectSimp})` : ''}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Επίλυση Σύνθετου Κλάσματος',
      prompt: `Ποιο είναι το απλούστερο ανάγωγο αποτέλεσμα του σύνθετου κλάσματος (${q8Top}) / (${q8Bot});`,
      options: q8Options,
      correct: q8CorrectSimpComp,
      explain: `Πολλαπλασιάζουμε τους άκρους όρους (1 · 4 ＝ 4) και τους μέσους (2 · 3 ＝ 6). Παίρνουμε 4/6, το οποίο απλοποιείται σε 2/3.`
    },
    {
      id: 'q9',
      type: 'mcq',
      title: `Πρόβλημα: ${STANDARD_PROBLEMS_POOL[spIndex].title}`,
      prompt: q9Raw.prompt,
      options: q9Options,
      correct: q9Raw.correctText,
      tableData: q9Raw.tableData,
      explain: q9Raw.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `Σύνθετο Πρόβλημα: ${HARD_PROBLEMS_POOL[hpIndex].title}`,
      prompt: q10Raw.prompt,
      options: q10Options,
      correct: q10Raw.correctText,
      tableData: q10Raw.tableData,
      explain: q10Raw.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function DiairesiKlasmatonExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions();
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach(q => {
      initialAnswers[q.id] = q.type === 'tf' ? null : '';
    });
    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleInputChange = (id, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\s+/g, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\s+/g, '').trim().toLowerCase() : null;
      return cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt);
    }
    if (q.type === 'mcq') {
      return userVal === q.correct;
    }
    if (q.type === 'tf') {
      return userVal === q.correct;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || questions.length === 0) return;

    let total = 0;
    questions.forEach(q => {
      if (isQuestionCorrect(q)) total += 1;
    });

    setScore(total);
    setSubmitted(true);
  };

  const getCardStyle = (q) => {
    if (!submitted) return 'bg-white border-slate-200 shadow-sm';
    return isQuestionCorrect(q)
      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-1 ring-emerald-400'
      : 'bg-rose-50/70 border-rose-400 shadow-md ring-1 ring-rose-400';
  };

  return (
    <Layout
      title="Ασκήσεις: Διαίρεση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στη διαίρεση κλασμάτων, ακεραίων και σύνθετων κλασμάτων για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/30-diairesi-klasmaton"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase('Θεωρία')}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-32 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>ΚΕΦΑΛΑΙΟ 30 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Διαίρεση Κλασμάτων
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη διαίρεση κλασμάτων, στη διαίρεση με ακέραιο, στα σύνθετα κλάσματα και σε προβλήματα καθημερινότητας!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase('Νέες Ασκήσεις')}</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΙΣ 10 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all ${getCardStyle(q)}`}
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider">
                        {toCleanUppercase(`Άσκηση ${qNum}`)} • {toCleanUppercase(q.title)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4">
                      {q.type === 'tf' ? `«${q.text}»` : q.prompt}
                    </p>

                    {/* INPUTS / OPTIONS */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleInputChange(q.id, opt)}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words whitespace-normal leading-snug flex items-center justify-center min-h-[48px] ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'input' && (
                      <div className="space-y-2 mb-3">
                        <input
                          type="text"
                          inputMode="text"
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder="π.χ. 3/2"
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}

                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(q.id, true)}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            answers[q.id] === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                          }`}
                        >
                          👍 {toCleanUppercase('Σωστό')}
                        </button>
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(q.id, false)}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            answers[q.id] === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          👎 {toCleanUppercase('Λάθος')}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          <table className="w-full text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase('Στοιχείο')}</th>
                                <th className="p-1.5">{toCleanUppercase('Πράξη / Μέθοδος')}</th>
                                <th className="p-1.5">{toCleanUppercase('Τιμή')}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900">{row.item}</td>
                                  <td className="p-1.5 text-indigo-700">{row.formula}</td>
                                  <td className="p-1.5 font-black text-emerald-700">{row.val}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? '🎯 Εξαιρετικά!' : '💡 Επεξήγηση:'}
                        </p>
                        <p>{q.explain}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation"
              >
                <span className="text-xl">🎯</span>
                <span>{toCleanUppercase('Έλεγχος Απαντήσεων')}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{toCleanUppercase('Σκορ')}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">{score} / 10</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase('Ποσοστό')}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 10) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* GUIDANCE OR RESTART */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase('Νέες Ασκήσεις')}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Απάντησε και στις 10 ερωτήσεις και πάτησε «{toCleanUppercase('Έλεγχος Απαντήσεων')}»!
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}

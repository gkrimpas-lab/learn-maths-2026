// pages/st-dimotikou/28-afairesi-klasmaton-ask.js
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

function findLCM(a, b) {
  if (!a || !b) return 1;
  return Math.abs(a * b) / findGCD(a, b);
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
    title: 'Υπόλοιπο Πίτσας',
    unit: 'της πίτσας',
    generate: () => {
      // 7/8 - 1/2 = 7/8 - 4/8 = 3/8
      const n1 = 7;
      const d1 = 8;
      const n2 = 1;
      const d2 = 2;
      const resN = 3;
      const resD = 8;
      return {
        prompt: `Σε μια πιατέλα υπήρχαν τα ${n1}/${d1} μιας πίτσας. Τα παιδιά κατανάλωσαν το ${n2}/${d2} της πίτσας. Ποιο μέρος της πίτσας περίσσεψε;`,
        unit: '',
        correctVal: `${resN}/${resD}`,
        correctText: `${resN}/${resD}`,
        tableData: [
          { item: 'Αρχική ποσότητα', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: 'Ποσότητα που καταναλώθηκε (Ομώνυμο)', formula: `(${n2} · 4) / (${d2} · 4)`, val: `4/${resD}` },
          { item: 'Υπόλοιπο (Διαφορά)', formula: `${n1}/${resD} － 4/${resD}`, val: `${resN}/${resD}` }
        ],
        explain: `Κάνουμε τα κλάσματα ομώνυμα με Ε.Κ.Π.(8, 2) ＝ 8. Το 1/2 γίνεται 4/8. Αφαιρούμε τους αριθμητές: 7/8 － 4/8 ＝ ${resN}/${resD}.`,
        distractors: [`6/6`, `5/8`, `2/8`]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Χυμός σε Μπουκάλι',
    unit: 'του μπουκαλιού',
    generate: () => {
      // 5/6 - 1/3 = 5/6 - 2/6 = 3/6 = 1/2
      const n1 = 5;
      const d1 = 6;
      const n2 = 1;
      const d2 = 3;
      return {
        prompt: `Ένα μπουκάλι περιείχε τα ${n1}/${d1} χυμού. Ήπιαμε το ${n2}/${d2} του χυμού. Ποιο μέρος του χυμού έμεινε στο μπουκάλι;`,
        unit: '',
        correctVal: `1/2`,
        correctText: `1/2 (3/6)`,
        tableData: [
          { item: 'Αρχικό περιεχόμενο', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: 'Ποσότητα που ήπιαμε (Ομώνυμο)', formula: `(${n2} · 2) / (${d2} · 2)`, val: `2/6` },
          { item: 'Υπόλοιπο & Απλοποίηση', formula: `5/6 － 2/6 ＝ 3/6 (: 3)`, val: `1/2` }
        ],
        explain: `Ε.Κ.Π.(6, 3) ＝ 6. Το 1/3 γίνεται 2/6. Αφαιρούμε: 5/6 － 2/6 ＝ 3/6. Απλοποιώντας διαιρώντας με το 3 παίρνουμε 1/2.`,
        distractors: [`4/3`, `2/3`, `1/6`]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Ρολό Υφάσματος',
    unit: 'του υφάσματος',
    generate: () => {
      // 3/4 - 1/4 = 2/4 = 1/2
      const n1 = 3;
      const d1 = 4;
      const n2 = 1;
      const d2 = 4;
      return {
        prompt: `Μια μοδίστρα είχε τα ${n1}/${d1} ενός τόπι υφάσματος και χρησιμοποίησε το ${n2}/${d2}. Ποιο μέρος του υφάσματος περίσσεψε;`,
        unit: '',
        correctVal: `1/2`,
        correctText: `1/2 (2/4)`,
        tableData: [
          { item: 'Αρχικό ύφασμα', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: 'Ύφασμα που χρησιμοποιήθηκε', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: 'Διαφορά & Απλοποίηση', formula: `(${n1} － ${n2})/${d1} ＝ 2/4 (: 2)`, val: `1/2` }
        ],
        explain: `Τα κλάσματα είναι ομώνυμα: 3/4 － 1/4 ＝ 2/4. Απλοποιώντας με το 2 έχουμε 1/2.`,
        distractors: [`2/0`, `1/4`, `3/8`]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Επιφάνεια Σχολικού Κήπου',
    unit: 'του κήπου',
    generate: () => {
      // 9/10 - 2/5 = 9/10 - 4/10 = 5/10 = 1/2
      const n1 = 9;
      const d1 = 10;
      const n2 = 2;
      const d2 = 5;
      return {
        prompt: `Οι μαθητές είχαν σκάψει τα ${n1}/${d1} ενός κήπου. Φύτεψαν λουλούδια στα ${n2}/${d2} του κήπου. Ποιο μέρος του κήπου έμεινε σκαμμένο χωρίς φυτά;`,
        unit: '',
        correctVal: `1/2`,
        correctText: `1/2 (5/10)`,
        tableData: [
          { item: 'Σκαμμένο μέρος', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: 'Φυτεμένο μέρος (Ομώνυμο)', formula: `(${n2} · 2) / (${d2} · 2)`, val: `4/10` },
          { item: 'Υπόλοιπο & Απλοποίηση', formula: `9/10 － 4/10 ＝ 5/10 (: 5)`, val: `1/2` }
        ],
        explain: `Ε.Κ.Π.(10, 5) ＝ 10. Το 2/5 γίνεται 4/10. Αφαιρούμε: 9/10 － 4/10 ＝ 5/10 ＝ 1/2.`,
        distractors: [`7/5`, `3/10`, `7/10`]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Μοίρασμα Σοκολάτας',
    unit: 'της σοκολάτας',
    generate: () => {
      // 4/5 - 3/10 = 8/10 - 3/10 = 5/10 = 1/2
      const n1 = 4;
      const d1 = 5;
      const n2 = 3;
      const d2 = 10;
      return {
        prompt: `Μία πλάκα σοκολάτας είχε τα ${n1}/${d1} του βάρους της. Δόθηκαν τα ${n2}/${d2}. Ποιο μέρος της σοκολάτας περίσσεψε;`,
        unit: '',
        correctVal: `1/2`,
        correctText: `1/2 (5/10)`,
        tableData: [
          { item: 'Αρχική ποσότητα (Ομώνυμο)', formula: `(${n1} · 2) / (${d1} · 2)`, val: `8/10` },
          { item: 'Ποσότητα που δόθηκε', formula: `${n2}/${d2}`, val: `3/10` },
          { item: 'Διαφορά & Απλοποίηση', formula: `8/10 － 3/10 ＝ 5/10 (: 5)`, val: `1/2` }
        ],
        explain: `Κάνουμε τα κλάσματα ομώνυμα με Ε.Κ.Π.(5, 10) ＝ 10: 4/5 ＝ 8/10. Αφαιρούμε: 8/10 － 3/10 ＝ 5/10 ＝ 1/2.`,
        distractors: [`1/5`, `2/5`, `1/10`]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Υπόλοιπο Αθλητικής Διαδρομής',
    unit: 'της διαδρομής',
    generate: () => {
      // 7/12 - 1/4 = 7/12 - 3/12 = 4/12 = 1/3
      const n1 = 7;
      const d1 = 12;
      const n2 = 1;
      const d2 = 4;
      return {
        prompt: `Ένας ποδηλάτης είχε σχεδιάσει να διανύσει τα ${n1}/${d1} μιας διαδρομής. Αν διάνυσε μόνο το ${n2}/${d2}, ποιο μέρος της σχεδιασμένης διαδρομής του απομένει;`,
        unit: '',
        correctVal: `1/3`,
        correctText: `1/3 (4/12)`,
        tableData: [
          { item: 'Σχεδιασμένη διαδρομή', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: 'Διανυθείσα διαδρομή (Ομώνυμο)', formula: `(${n2} · 3) / (${d2} · 3)`, val: `3/12` },
          { item: 'Υπόλοιπο & Απλοποίηση', formula: `7/12 － 3/12 ＝ 4/12 (: 4)`, val: `1/3` }
        ],
        explain: `Ε.Κ.Π.(12, 4) ＝ 12. Το 1/4 γίνεται 3/12. Αφαιρούμε: 7/12 － 3/12 ＝ 4/12 ＝ 1/3.`,
        distractors: [`6/8`, `1/4`, `5/12`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Αφαίρεση από Ακέραιο Αριθμό',
    unit: '',
    generate: () => {
      // 2 - 3/4 = 8/4 - 3/4 = 5/4
      const whole = 2;
      const num = 3;
      const den = 4;
      const resN = 5;
      const resD = 4;
      return {
        prompt: `Υπολόγισε το αποτέλεσμα της αφαίρεσης: ${whole} － ${num}/${den}:`,
        unit: '',
        correctVal: `${resN}/${resD}`,
        correctText: `${resN}/${resD} (ή 1 και 1/4)`,
        tableData: [
          { item: 'Ακέραιος σε τέταρτα', formula: `${whole} ＝ (${whole} · ${den})/${den}`, val: `8/4` },
          { item: 'Αφαιρετέος', formula: `${num}/${den}`, val: `3/4` },
          { item: 'Διαφορά', formula: `8/4 － 3/4`, val: `${resN}/${resD}` }
        ],
        explain: `Γράφουμε τον ακέραιο 2 ως κλάσμα με παρονομαστή 4: 2 ＝ 8/4. Αφαιρούμε: 8/4 － 3/4 ＝ 5/4 (ή 1 και 1/4).`,
        distractors: [`1/4`, `7/4`, `5/0`]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Αφαίρεση από τη Μονάδα (1)',
    unit: '',
    generate: () => {
      // 1 - 5/7 = 7/7 - 5/7 = 2/7
      const den = 7;
      const num = 5;
      const resN = den - num;
      return {
        prompt: `Ένα δοχείο ήταν εντελώς γεμάτο (1 ολόκληρη μονάδα). Αν καταναλωθούν τα ${num}/${den} του περιεχομένου, ποιο μέρος απομένει;`,
        unit: '',
        correctVal: `${resN}/${den}`,
        correctText: `${resN}/${den}`,
        tableData: [
          { item: 'Ολόκληρη μονάδα', formula: `1 ＝ ${den}/${den}`, val: `${den}/${den}` },
          { item: 'Ποσότητα που καταναλώθηκε', formula: `${num}/${den}`, val: `${num}/${den}` },
          { item: 'Υπόλοιπο', formula: `${den}/${den} － ${num}/${den}`, val: `${resN}/${den}` }
        ],
        explain: `Η ακέραια μονάδα ισούται με ${den}/${den}. Αφαιρούμε: ${den}/${den} － ${num}/${den} ＝ ${resN}/${den}.`,
        distractors: [`${num}/${den}`, `1/${den}`, `3/${den}`]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Σύνθετη Αφαίρεση Δύο Κλασμάτων από Ακέραιο',
    unit: '',
    generate: () => {
      // 1 - (1/3 + 1/6) = 1 - 3/6 = 3/6 = 1/2
      return {
        prompt: 'Από 1 ολόκληρη πίτσα αφαιρούμε πρώτα το 1/3 και μετά το 1/6. Ποιο μέρος της πίτσας απομένει;',
        unit: 'της πίτσας',
        correctVal: '1/2',
        correctText: '1/2 (ή 3/6)',
        tableData: [
          { item: 'Άθροισμα αφαιρέσεων', formula: '1/3 ＋ 1/6 ＝ 2/6 ＋ 1/6', val: '3/6' },
          { item: 'Αρχική πίτσα', formula: '1 ＝ 6/6', val: '6/6' },
          { item: 'Τελικό υπόλοιπο', formula: '6/6 － 3/6 ＝ 3/6 (: 3)', val: '1/2' }
        ],
        explain: 'Προσθέτουμε πρώτα τα κομμάτια που αφαιρέθηκαν: 1/3 ＋ 1/6 ＝ 2/6 ＋ 1/6 ＝ 3/6 ＝ 1/2. Αφαιρούμε από το όλον: 1 － 1/2 ＝ 1/2 της πίτσας.',
        distractors: ['1/3', '1/6', '2/3']
      };
    }
  },
  {
    id: 'hp4',
    title: 'Εύρεση Άγνωστου Αφαιρετέου',
    unit: '',
    generate: () => {
      // 4/5 - [?] = 3/10 -> [?] = 8/10 - 3/10 = 5/10 = 1/2
      return {
        prompt: 'Ποιο κλάσμα πρέπει να αφαιρεθεί από το 4/5 για να προκύψει διαφορά ίση με 3/10;',
        unit: '',
        correctVal: '1/2',
        correctText: '1/2 (ή 5/10)',
        tableData: [
          { item: 'Μειωτέος σε δέκατα', formula: '(4 · 2) / 10', val: '8/10' },
          { item: 'Επιθυμητή διαφορά', formula: '3/10', val: '3/10' },
          { item: 'Άγνωστος αφαιρετέος', formula: '8/10 － 3/10 ＝ 5/10 (: 5)', val: '1/2' }
        ],
        explain: 'Μετατρέπουμε το 4/5 σε 8/10. Ο άγνωστος αφαιρετέος είναι: 8/10 － 3/10 ＝ 5/10, το οποίο απλοποιείται σε 1/2.',
        distractors: ['1/5', '2/5', '3/5']
      };
    }
  },
  {
    id: 'hp5',
    title: 'Αφαίρεση Ετερωνύμων με Μεγάλο Ε.Κ.Π.',
    unit: '',
    generate: () => {
      // 7/10 - 4/15 = 21/30 - 8/30 = 13/30
      return {
        prompt: 'Υπολόγισε τη διαφορά των ετερώνυμων κλασμάτων: 7/10 － 4/15:',
        unit: '',
        correctVal: '13/30',
        correctText: '13/30',
        tableData: [
          { item: 'Ε.Κ.Π.(10, 15)', formula: 'Κοινός παρονομαστής', val: '30' },
          { item: '1ο Κλάσμα (· 3)', formula: '(7 · 3) / 30', val: '21/30' },
          { item: '2ο Κλάσμα (· 2)', formula: '(4 · 2) / 30', val: '8/30' },
          { item: 'Διαφορά', formula: '21/30 － 8/30', val: '13/30' }
        ],
        explain: 'Ε.Κ.Π.(10, 15) ＝ 30. Μετατρέπουμε σε ομώνυμα: 21/30 － 8/30 ＝ 13/30.',
        distractors: ['3/5', '11/30', '17/30']
      };
    }
  },
  {
    id: 'hp6',
    title: 'Σύγκριση Διαφοράς με το Μηδέν',
    unit: '',
    generate: () => {
      // 3/4 - 6/8 = 0
      return {
        prompt: 'Ποιο είναι το αποτέλεσμα της αφαίρεσης των ισοδύναμων κλασμάτων: 3/4 － 6/8;',
        unit: '',
        correctVal: '0',
        correctText: '0 (μηδέν)',
        tableData: [
          { item: '1ο Κλάσμα', formula: '3/4', val: '6/8' },
          { item: '2ο Κλάσμα', formula: '6/8', val: '6/8' },
          { item: 'Διαφορά ίσων κλασμάτων', formula: '6/8 － 6/8', val: '0' }
        ],
        explain: 'Επειδή 3/4 ＝ 6/8 (είναι ισοδύναμα κλάσματα), όταν αφαιρούμε δύο ίσες ποσότητες το αποτέλεσμα είναι πάντοτε 0.',
        distractors: ['1/8', '3/8', '1']
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Αφαίρεση Ομώνυμων Κλασμάτων
  const q1Den = randInt(5, 12);
  const q1Num1 = randInt(3, q1Den);
  const q1Num2 = randInt(1, q1Num1 - 1);
  const q1DiffNum = q1Num1 - q1Num2;
  const q1Gcd = findGCD(q1DiffNum, q1Den);
  const q1CorrectRaw = `${q1DiffNum}/${q1Den}`;
  const q1CorrectSimp = `${q1DiffNum / q1Gcd}/${q1Den / q1Gcd}`;

  // Q2: Input - Αφαίρεση Ετερώνυμων Κλασμάτων
  const q2Pairs = [
    { n1: 3, d1: 4, n2: 1, d2: 2 },
    { n1: 5, d1: 6, n2: 1, d2: 3 },
    { n1: 4, d1: 5, n2: 3, d2: 10 },
    { n1: 7, d1: 8, n2: 1, d2: 4 },
    { n1: 2, d1: 3, n2: 1, d2: 6 },
    { n1: 5, d1: 6, n2: 1, d2: 2 }
  ];
  const q2Item = q2Pairs[randInt(0, q2Pairs.length - 1)];
  const q2Lcm = findLCM(q2Item.d1, q2Item.d2);
  const q2Equiv1 = q2Item.n1 * (q2Lcm / q2Item.d1);
  const q2Equiv2 = q2Item.n2 * (q2Lcm / q2Item.d2);
  const q2DiffN = q2Equiv1 - q2Equiv2;
  const q2G = findGCD(q2DiffN, q2Lcm);
  const q2CorrectRaw = `${q2DiffN}/${q2Lcm}`;
  const q2CorrectSimp = `${q2DiffN / q2G}/${q2Lcm / q2G}`;

  // Q3: MCQ - Αφαίρεση από τη Μονάδα (1 － κλάσμα)
  const q3Den = randInt(3, 8);
  const q3Num = randInt(1, q3Den - 1);
  const q3DiffNum = q3Den - q3Num;
  const q3CorrectStr = `${q3DiffNum}/${q3Den}`;
  const q3Wrongs = [
    `${q3DiffNum + 1}/${q3Den}`,
    `${q3Num}/${q3Den}`,
    `${q3DiffNum}/${q3Den + 1}`
  ];
  const q3Options = shuffle([...new Set([q3CorrectStr, ...q3Wrongs])]);

  // Q4: MCQ - Αφαίρεση Ακέραιου με Κλάσμα
  const q4Whole = randInt(2, 3);
  const q4Den = randInt(3, 5);
  const q4Num = randInt(1, q4Den - 1);
  const q4ResNum = q4Whole * q4Den - q4Num;
  const q4CorrectStr = `${q4ResNum}/${q4Den}`;
  const q4WrongsList = [
    `${q4ResNum + 1}/${q4Den}`,
    `${q4Whole * q4Den}/${q4Den}`,
    `${q4Whole - q4Num}/${q4Den}`
  ];
  const q4Options = shuffle([...new Set([q4CorrectStr, ...q4WrongsList])]);

  // Q5: True/False - Κανόνας ομωνύμων
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στην αφαίρεση ομώνυμων κλασμάτων, αφαιρούμε μόνο τους αριθμητές και αφήνουμε τον ίδιο παρονομαστή.'
    : 'Στην αφαίρεση ομώνυμων κλασμάτων, αφαιρούμε και τους αριθμητές και τους παρονομαστές μεταξύ τους.';

  // Q6: True/False - Αφαίρεση ετερωνύμων
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Για να αφαιρέσουμε ετερώνυμα κλάσματα, πρέπει πρώτα οπωσδήποτε να τα μετατρέψουμε σε ομώνυμα βρίσκοντας το Ε.Κ.Π.'
    : 'Μπορούμε να αφαιρέσουμε ετερώνυμα κλάσματα αφαιρώντας απευθείας τους αριθμητές και τους παρονομαστές.';

  // Q7: Input - Εύρεση άγνωστου όρου
  const q7Den = randInt(6, 12);
  const q7Target = randInt(1, q7Den - 3);
  const q7Start = randInt(q7Target + 2, q7Den);
  const q7Correct = String(q7Start - q7Target);

  // Q8: MCQ - Απλοποίηση διαφοράς
  const q8Pairs = [
    { n1: 5, d: 8, n2: 1, simp: '1/2', raw: '4/8' },
    { n1: 7, d: 9, n2: 4, simp: '1/3', raw: '3/9' },
    { n1: 8, d: 10, n2: 3, simp: '1/2', raw: '5/10' },
    { n1: 5, d: 6, n2: 1, simp: '2/3', raw: '4/6' }
  ];
  const q8Item = q8Pairs[randInt(0, q8Pairs.length - 1)];
  const q8Wrongs = ['1/4', '3/4', '2/5'].filter(w => w !== q8Item.simp);
  const q8Options = shuffle([...new Set([q8Item.simp, ...q8Wrongs])]);

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
      title: 'Ομώνυμα Κλάσματα',
      prompt: `Υπολόγισε τη διαφορά των ομώνυμων κλασμάτων: ${q1Num1}/${q1Den} － ${q1Num2}/${q1Den} (π.χ. 2/7):`,
      correct: q1CorrectRaw,
      altCorrect: q1CorrectSimp,
      explain: `${q1Num1}/${q1Den} － ${q1Num2}/${q1Den} ＝ (${q1Num1} － ${q1Num2})/${q1Den} ＝ ${q1CorrectRaw}${q1Gcd > 1 ? ` (ή απλοποιημένο: ${q1CorrectSimp})` : ''}.`
    },
    {
      id: 'q2',
      type: 'input',
      title: 'Ετερώνυμα Κλάσματα',
      prompt: `Υπολόγισε τη διαφορά: ${q2Item.n1}/${q2Item.d1} － ${q2Item.n2}/${q2Item.d2} (π.χ. 1/4):`,
      correct: q2CorrectRaw,
      altCorrect: q2CorrectSimp,
      explain: `Ε.Κ.Π.(${q2Item.d1}, ${q2Item.d2}) ＝ ${q2Lcm}. Μετατρέπουμε σε ομώνυμα: ${q2Equiv1}/${q2Lcm} － ${q2Equiv2}/${q2Lcm} ＝ ${q2CorrectRaw}${q2G > 1 ? ` ＝ ${q2CorrectSimp}` : ''}.`
    },
    {
      id: 'q3',
      type: 'mcq',
      title: 'Αφαίρεση από τη Μονάδα',
      prompt: `Ποιο είναι το αποτέλεσμα της πράξης 1 － ${q3Num}/${q3Den};`,
      options: q3Options,
      correct: q3CorrectStr,
      explain: `Γράφουμε τη μονάδα ως κλάσμα: 1 ＝ ${q3Den}/${q3Den}. Επομένως: ${q3Den}/${q3Den} － ${q3Num}/${q3Den} ＝ ${q3CorrectStr}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Ακέραιος － Κλάσμα',
      prompt: `Ποιο είναι το αποτέλεσμα της πράξης ${q4Whole} － ${q4Num}/${q4Den};`,
      options: q4Options,
      correct: q4CorrectStr,
      explain: `Γράφουμε τον ακέραιο ως κλάσμα: ${q4Whole} ＝ ${q4Whole * q4Den}/${q4Den}. Επομένως: ${q4Whole * q4Den}/${q4Den} － ${q4Num}/${q4Den} ＝ ${q4CorrectStr}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Κανόνας Ομωνύμων',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Στα ομώνυμα κλάσματα αφαιρούμε ΜΟΝΟ τους αριθμητές και κρατάμε τον ίδιο παρονομαστή.'
        : 'Λάθος! ΠΟΤΕ δεν αφαιρούμε τους παρονομαστές μεταξύ τους.'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Κανόνας Ετερωνύμων',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Για να αφαιρέσουμε ετερώνυμα κλάσματα πρέπει πρώτα οπωσδήποτε να τα κάνουμε ομώνυμα με το Ε.Κ.Π.'
        : 'Λάθος! Δεν μπορούμε να αφαιρέσουμε ετερώνυμα κλάσματα χωρίς να τα μετατρέψουμε πρώτα σε ομώνυμα.'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Εύρεση Άγνωστου Αριθμητή',
      prompt: `Βρες τον αριθμητή x στην ισότητα: ${q7Start}/${q7Den} － x/${q7Den} ＝ ${q7Target}/${q7Den}`,
      correct: q7Correct,
      explain: `Αφού τα κλάσματα είναι ομώνυμα, ισχύει ${q7Start} － x ＝ ${q7Target} ➔ x ＝ ${q7Start} － ${q7Target} ＝ ${q7Correct}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Απλοποίηση Διαφοράς',
      prompt: `Ποιο είναι το απλούστερο ανάγωγο κλάσμα που προκύπτει από τη διαφορά ${q8Item.n1}/${q8Item.d} － ${q8Item.n2}/${q8Item.d};`,
      options: q8Options,
      correct: q8Item.simp,
      explain: `Αφαιρούμε: ${q8Item.n1}/${q8Item.d} － ${q8Item.n2}/${q8Item.d} ＝ ${q8Item.raw}. Απλοποιώντας τους όρους με τον Μ.Κ.Δ. παίρνουμε το ανάγωγο ${q8Item.simp}.`
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

export default function AfairesiKlasmatonExercisesPage() {
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
      title="Ασκήσεις: Αφαίρεση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην αφαίρεση ομώνυμων και ετερώνυμων κλασμάτων για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/28-afairesi-klasmaton"
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
                <span>ΚΕΦΑΛΑΙΟ 28 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Αφαίρεση Κλασμάτων
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην αφαίρεση ομώνυμων &amp; ετερώνυμων κλασμάτων, στην αφαίρεση από ακέραιο και στην απλοποίηση!
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
                          placeholder="π.χ. 1/4"
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

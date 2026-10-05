// pages/st-dimotikou/37-agnostos-dia-gnostos-ask.js
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

function gcd(a, b) {
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
    title: 'Μοιρασιά Χρημάτων σε Φίλους',
    unit: 'ευρώ',
    generate: () => {
      // x : a = b -> x : 4 = 18 -> x = 72
      const a = randInt(3, 5);
      const b = randInt(14, 25);
      const x = a * b;
      return {
        prompt: `Ένα χρηματικό ποσό x μοιράστηκε εξίσου σε ${a} φίλους. Αν ο καθένας πήρε ${b}€, ποιο ήταν το αρχικό ποσό (x);`,
        unit: 'ευρώ',
        correctVal: String(x),
        correctText: `${x}€`,
        tableData: [
          { item: 'Πλήθος φίλων (α)', formula: `${a}`, val: `${a}` },
          { item: 'Μερίδιο καθενός (β)', formula: `${b} €`, val: `${b}` },
          { item: 'Εξίσωση (x : α ＝ β)', formula: `x : ${a} ＝ ${b}`, val: `x ＝ ${a} · ${b} ＝ ${x}€` }
        ],
        explain: `Σχηματίζουμε την εξίσωση: x : ${a} ＝ ${b}. Για να βρούμε τον άγνωστο διαιρετέο x, κάνουμε πολλαπλασιασμό: x ＝ ${a} · ${b} ＝ ${x}€.`,
        distractors: [`${x + a}€`, `${x - b}€`, `${Math.round(b / a)}€`]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Μοίρασμα Χυμού σε Κανάτες',
    unit: 'λίτρα',
    generate: () => {
      // x : a = b -> x : 5 = 6 -> x = 30
      const a = randInt(4, 6);
      const b = randInt(5, 12);
      const x = a * b;
      return {
        prompt: `Ένα βαρέλι περιείχε x λίτρα χυμό. Μοιράστηκε ισόποσα σε ${a} κανάτες και κάθε κανάτα γέμισε με ${b} λίτρα. Πόσα λίτρα χυμό είχε αρχικά το βαρέλι (x);`,
        unit: 'λίτρα',
        correctVal: String(x),
        correctText: `${x} λίτρα`,
        tableData: [
          { item: 'Κανάτες (α)', formula: `${a}`, val: `${a}` },
          { item: 'Χωρητικότητα κανάτας (β)', formula: `${b} λ.`, val: `${b}` },
          { item: 'Εξίσωση', formula: `x : ${a} ＝ ${b}`, val: `x ＝ ${a} · ${b} ＝ ${x} λ.` }
        ],
        explain: `Η εξίσωση είναι x : ${a} ＝ ${b}. Βρίσκουμε τον άγνωστο διαιρετέο με πολλαπλασιασμό: x ＝ ${a} · ${b} ＝ ${x} λίτρα.`,
        distractors: [`${x + 5} λίτρα`, `${x - 4} λίτρα`, `${b + a} λίτρα`]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Σακιά Αλευριού σε Αποθήκη',
    unit: 'κιλά',
    generate: () => {
      // x : a = b -> x : 6 = 25 -> x = 150
      const a = randInt(4, 7);
      const b = randInt(15, 30);
      const x = a * b;
      return {
        prompt: `Μια αποθήκη είχε x κιλά αλεύρι συσκευασμένα σε ${a} ίσα σακιά. Αν το κάθε σακί περιείχε ${b} κιλά, πόσα κιλά ήταν συνολικά το αλεύρι;`,
        unit: 'κιλά',
        correctVal: String(x),
        correctText: `${x} κιλά`,
        tableData: [
          { item: 'Σακιά (α)', formula: `${a}`, val: `${a}` },
          { item: 'Βάρος σακιού (β)', formula: `${b} κιλά`, val: `${b}` },
          { item: 'Εξίσωση', formula: `x : ${a} ＝ ${b}`, val: `x ＝ ${a} · ${b} ＝ ${x} κιλά` }
        ],
        explain: `x : ${a} ＝ ${b} ➔ x ＝ ${a} · ${b} ＝ ${x} κιλά.`,
        distractors: [`${x + 10} κιλά`, `${x - 10} κιλά`, `${Math.round(b / a)} κιλά`]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Βιβλία σε Ράφια Βιβλιοθήκης',
    unit: 'βιβλία',
    generate: () => {
      // x : a = b -> x : 8 = 14 -> x = 112
      const a = randInt(5, 8);
      const b = randInt(10, 18);
      const x = a * b;
      return {
        prompt: `Σε μια βιβλιοθήκη τοποθετήθηκαν x βιβλία σε ${a} ίσα ράφια. Αν κάθε ράφι χωράει ${b} βιβλία, πόσα είναι συνολικά τα βιβλία (x);`,
        unit: 'βιβλία',
        correctVal: String(x),
        correctText: `${x} βιβλία`,
        tableData: [
          { item: 'Ράφια (α)', formula: `${a}`, val: `${a}` },
          { item: 'Βιβλία ανά ράφι (β)', formula: `${b}`, val: `${b}` },
          { item: 'Εξίσωση', formula: `x : ${a} ＝ ${b}`, val: `x ＝ ${a} · ${b} ＝ ${x}` }
        ],
        explain: `Εξίσωση: x : ${a} ＝ ${b} ➔ x ＝ ${a} · ${b} ＝ ${x} βιβλία.`,
        distractors: [`${x + 8} βιβλία`, `${x - 6} βιβλία`, `${b + a} βιβλία`]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Κομμάτια Πίτσας σε Πάρτι',
    unit: 'κομμάτια',
    generate: () => {
      // x : 4 = 6 -> x = 24
      const a = 4;
      const b = randInt(5, 8);
      const x = a * b;
      return {
        prompt: `Σε ένα πάρτι κόπηκαν x κομμάτια πίτσας και μοιράστηκαν ισόποσα σε ${a} παρέες παιδιών. Αν κάθε παρέα πήρε ${b} κομμάτια, πόσα ήταν συνολικά τα κομμάτια (x);`,
        unit: 'κομμάτια',
        correctVal: String(x),
        correctText: `${x} κομμάτια`,
        tableData: [
          { item: 'Παρέες (α)', formula: `${a}`, val: `${a}` },
          { item: 'Κομμάτια ανά παρέα (β)', formula: `${b}`, val: `${b}` },
          { item: 'Εξίσωση', formula: `x : ${a} ＝ ${b}`, val: `x ＝ ${a} · ${b} ＝ ${x}` }
        ],
        explain: `x : ${a} ＝ ${b} ➔ x ＝ ${a} · ${b} ＝ ${x} κομμάτια.`,
        distractors: [`${x + 4} κομμάτια`, `${x - 4} κομμάτια`, `${b + a} κομμάτια`]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Ρολό Υφάσματος για Στολές',
    unit: 'μέτρα',
    generate: () => {
      // x : 7 = 3 -> x = 21
      const a = 7;
      const b = randInt(3, 5);
      const x = a * b;
      return {
        prompt: `Από ένα τόπι υφάσματος x μέτρων ράφτηκαν ${a} ίδιες στολές, χρησιμοποιώντας ${b} μέτρα για την καθεμία. Πόσα μέτρα ήταν το αρχικό τόπι υφάσματος;`,
        unit: 'μέτρα',
        correctVal: String(x),
        correctText: `${x} μέτρα`,
        tableData: [
          { item: 'Στολές (α)', formula: `${a}`, val: `${a}` },
          { item: 'Μέτρα ανά στολή (β)', formula: `${b} μ.`, val: `${b}` },
          { item: 'Εξίσωση', formula: `x : ${a} ＝ ${b}`, val: `x ＝ ${a} · ${b} ＝ ${x} μ.` }
        ],
        explain: `x : ${a} ＝ ${b} ➔ x ＝ ${a} · ${b} ＝ ${x} μέτρα.`,
        distractors: [`${x + 3} μέτρα`, `${x - 3} μέτρα`, `${a + b} μέτρα`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Εξίσωση με Δεκαδικό Πηλίκο',
    unit: '',
    generate: () => {
      // x : 4 = 3,5 -> x = 14
      const a = 4;
      const b = 3.5;
      const x = Number((a * b).toFixed(1));
      const bStr = b.toFixed(1).replace('.', ',');
      return {
        prompt: `Λύσε την εξίσωση με δεκαδικό αριθμό: x : ${a} ＝ ${bStr}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: 'Εξίσωση', formula: `x : ${a} ＝ ${bStr}`, val: `x ＝ ${a} · ${bStr}` },
          { item: 'Πολλαπλασιασμός', formula: `${a} · ${b}`, val: `x ＝ ${x}` }
        ],
        explain: `x ＝ ${a} · ${bStr} ＝ ${x}.`,
        distractors: [String(x + 2), String(x - 2), (b / a).toFixed(2).replace('.', ',')]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Εξίσωση με Κλάσμα ως Διαιρέτη',
    unit: '',
    generate: () => {
      // x : (1/3) = 15 -> x = 15 * 1/3 = 5
      const den = 3;
      const b = 15;
      const x = b / den;
      return {
        prompt: `Λύσε την εξίσωση με κλάσμα: x : (1/${den}) ＝ ${b}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: 'Εξίσωση', formula: `x : (1/${den}) ＝ ${b}`, val: `x ＝ ${b} · (1/${den})` },
          { item: 'Υπολογισμός γινομένου', formula: `(${b} · 1) / ${den} ＝ ${b}/${den}`, val: `${x}` }
        ],
        explain: `Για να βρούμε τον διαιρετέο x, πολλαπλασιάζουμε τον διαιρέτη με το πηλίκο: x ＝ ${b} · (1/${den}) ＝ ${b}/${den} ＝ ${x}.`,
        distractors: [String(b * den), String(x + 2), String(Math.max(1, x - 2))]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Σύνθετη Εξίσωση (x : 3) ＋ 4 ＝ 12',
    unit: '',
    generate: () => {
      // (x : 3) + 4 = 12 -> x : 3 = 8 -> x = 24
      const a = 3;
      const add = 4;
      const total = 12;
      const inter = total - add; // 8
      const x = a * inter; // 24
      return {
        prompt: `Λύσε τη σύνθετη εξίσωση: (x : ${a}) ＋ ${add} ＝ ${total}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: '1ο Βήμα (αφαίρεση προσθετέου)', formula: `${total} － ${add}`, val: `x : ${a} ＝ ${inter}` },
          { item: '2ο Βήμα (πολλαπλασιασμός)', formula: `${a} · ${inter}`, val: `x ＝ ${x}` }
        ],
        explain: `Πρώτα βρίσκουμε πόσο είναι το x : ${a} αφαιρώντας το ${add}: x : ${a} ＝ ${total} － ${add} ＝ ${inter}. Στη συνέχεια βρίσκουμε τον διαιρετέο: x ＝ ${a} · ${inter} ＝ ${x}.`,
        distractors: [String(x + 3), String(x - 6), String(total * a)]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Σύνθετη Εξίσωση (x : 5) － 2 ＝ 6',
    unit: '',
    generate: () => {
      // (x : 5) - 2 = 6 -> x : 5 = 8 -> x = 40
      const a = 5;
      const sub = 2;
      const rem = 6;
      const inter = rem + sub; // 8
      const x = a * inter; // 40
      return {
        prompt: `Λύσε τη σύνθετη εξίσωση: (x : ${a}) － ${sub} ＝ ${rem}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: '1ο Βήμα (πρόσθεση αφαιρετέου)', formula: `${rem} ＋ ${sub}`, val: `x : ${a} ＝ ${inter}` },
          { item: '2ο Βήμα (πολλαπλασιασμός)', formula: `${a} · ${inter}`, val: `x ＝ ${x}` }
        ],
        explain: `Πρώτα βρίσκουμε το x : ${a}: x : ${a} ＝ ${rem} ＋ ${sub} ＝ ${inter}. Έπειτα υπολογίζουμε το x: x ＝ ${a} · ${inter} ＝ ${x}.`,
        distractors: [String(x + 5), String(x - 5), String((rem - sub) * a)]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Εξίσωση με Κλάσμα στο Πηλίκο',
    unit: '',
    generate: () => {
      // x : 6 = 2/3 -> x = 6 * 2/3 = 12/3 = 4
      const a = 6;
      const numB = 2;
      const denB = 3;
      const x = (a * numB) / denB; // 4
      return {
        prompt: `Λύσε την εξίσωση: x : ${a} ＝ ${numB}/${denB}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: 'Εξίσωση', formula: `x : ${a} ＝ ${numB}/${denB}`, val: `x ＝ ${a} · (${numB}/${denB})` },
          { item: 'Υπολογισμός', formula: `(${a} · ${numB}) / ${denB} ＝ 12/3`, val: `${x}` }
        ],
        explain: `x ＝ ${a} · (${numB}/${denB}) ＝ (${a} · ${numB}) / ${denB} ＝ 12/3 ＝ ${x}.`,
        distractors: [String(x + 2), String(x - 1), '9']
      };
    }
  },
  {
    id: 'hp6',
    title: 'Πρόβλημα Μεριδίου με Ποσοστό',
    unit: 'ευρώ',
    generate: () => {
      // x : 4 = 25 -> x = 100
      const a = 4;
      const b = 25;
      const x = a * b;
      return {
        prompt: `Αν το 1/4 ενός ποσού x αντιστοιχεί σε ${b}€ (δηλαδή x : ${a} ＝ ${b}), ποιο είναι ολόκληρο το ποσό x;`,
        unit: 'ευρώ',
        correctVal: String(x),
        correctText: `${x}€`,
        tableData: [
          { item: 'Εξίσωση μεριδίου', formula: `x : ${a} ＝ ${b}`, val: `x ＝ ${a} · ${b}` },
          { item: 'Συνολικό ποσό', formula: `${a} · ${b}€`, val: `${x}€` }
        ],
        explain: `x : ${a} ＝ ${b} ➔ x ＝ ${a} · ${b} ＝ ${x}€.`,
        distractors: [`${x - 20}€`, `${x + 25}€`, `${Math.round(b / a)}€`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Βασική εξίσωση x : a = b με φυσικούς αριθμούς
  const q1A = randInt(3, 9);
  const q1B = randInt(4, 15);
  const q1X = q1A * q1B;

  // Q2: Input - Εξίσωση x : a = b με μεγαλύτερους φυσικούς αριθμούς
  const q2A = randInt(12, 25);
  const q2B = randInt(8, 20);
  const q2X = q2A * q2B;

  // Q3: Input - Εξίσωση με δεκαδικούς αριθμούς: x : a = b (x = a * b)
  const q3A = randInt(2, 6);
  const q3B_raw = randInt(12, 65) / 10;
  const q3X_raw = Number((q3A * q3B_raw).toFixed(1));
  const q3B = q3B_raw.toFixed(1).replace('.', ',');
  const q3Correct = q3X_raw.toFixed(1).replace('.', ',');

  // Q4: MCQ - Επιλογή του σωστού βήματος επίλυσης για την εξίσωση x : a = b
  const q4A = randInt(4, 12);
  const q4B = randInt(5, 14);
  const q4CorrectStep = `x ＝ ${q4A} · ${q4B}`;
  const q4Wrongs = [
    `x ＝ ${q4B} : ${q4A}`,
    `x ＝ ${q4A} : ${q4B}`,
    `x ＝ ${q4A} ＋ ${q4B}`
  ];
  const q4Options = shuffle([...new Set([q4CorrectStep, ...q4Wrongs])]);

  // Q5: True/False - Κανόνας εύρεσης άγνωστου διαιρετέου
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στην εξίσωση x : α ＝ β, ο άγνωστος x είναι ο διαιρετέος και υπολογίζεται με πολλαπλασιασμό: x ＝ α · β.'
    : 'Στην εξίσωση x : α ＝ β, ο άγνωστος x υπολογίζεται πάντοτε με διαίρεση: x ＝ β : α.';

  // Q6: True/False - Σχέση μεγέθους διαιρετέου
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Ο διαιρετέος (x) είναι το αρχικό ολικό μέγεθος, επομένως είναι μεγαλύτερος τόσο από τον διαιρέτη (α) όσο και από το πηλίκο (β).'
    : 'Ο διαιρετέος (x) είναι πάντοτε μικρότερος από το πηλίκο (β).';

  // Q7: Input - Εξίσωση με κλάσματα: x : a/b = c
  const q7Den = randInt(3, 7);
  const q7NumA = randInt(2, 5);
  const q7K = randInt(2, 5);
  const q7B = q7K * q7Den;
  const q7X = q7K * q7NumA;
  const q7Prompt = `Λύσε την εξίσωση: x : (${q7NumA}/${q7Den}) ＝ ${q7B}`;
  const q7Correct = String(q7X);

  // Q8: MCQ - Επαλήθευση εξίσωσης διαίρεσης
  const q8A = randInt(3, 6);
  const q8B = randInt(5, 10);
  const q8CorrectX = q8A * q8B;
  const q8Options = shuffle([...new Set([String(q8CorrectX), String(q8CorrectX + 4), String(q8CorrectX - 3), String(q8A + q8B)])]);

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
      title: 'Εξίσωση: x : α ＝ β',
      prompt: `Λύσε την εξίσωση: x : ${q1A} ＝ ${q1B}`,
      correct: String(q1X),
      explain: `x ＝ ${q1A} · ${q1B} ＝ ${q1X}.`
    },
    {
      id: 'q2',
      type: 'input',
      title: 'Μεγαλύτεροι Αριθμοί',
      prompt: `Λύσε την εξίσωση: x : ${q2A} ＝ ${q2B}`,
      correct: String(q2X),
      explain: `x ＝ ${q2A} · ${q2B} ＝ ${q2X}.`
    },
    {
      id: 'q3',
      type: 'input',
      title: 'Δεκαδικοί Αριθμοί',
      prompt: `Λύσε την εξίσωση: x : ${q3A} ＝ ${q3B}`,
      correct: q3Correct,
      explain: `x ＝ ${q3A} · ${q3B} ＝ ${q3Correct}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Σωστό Βήμα Επίλυσης',
      prompt: `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση x : ${q4A} ＝ ${q4B};`,
      options: q4Options,
      correct: q4CorrectStep,
      explain: `Για να βρούμε τον άγνωστο διαιρετέο x, πολλαπλασιάζουμε τον διαιρέτη με το πηλίκο: ${q4CorrectStep}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Κανόνας Διαιρετέου',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Η αντίστροφη πράξη της διαίρεσης είναι ο πολλαπλασιασμός: x ＝ α · β.'
        : 'Λάθος! Για να βρούμε τον άγνωστο διαιρετέο κάνουμε πολλαπλασιασμό (x ＝ α · β).'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Ιδιότητα Διαιρετέου',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Ο διαιρετέος είναι το αρχικό ολικό ποσό που μοιράστηκε, άρα είναι μεγαλύτερος από το πηλίκο και τον διαιρέτη.'
        : 'Λάθος! Ο διαιρετέος είναι το γινόμενο των δύο άλλων όρων, άρα είναι το μεγαλύτερο μέγεθος.'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Εξίσωση με Κλάσματα',
      prompt: q7Prompt,
      correct: q7Correct,
      explain: `x ＝ ${q7B} · (${q7NumA}/${q7Den}) ＝ (${q7B} · ${q7NumA}) / ${q7Den} ＝ ${q7X}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Επαλήθευση Εξίσωσης',
      prompt: `Στην εξίσωση x : ${q8A} ＝ ${q8B}, ποια τιμή του x επαληθεύει την ισότητα;`,
      options: q8Options,
      correct: String(q8CorrectX),
      explain: `Αντικαθιστούμε x ＝ ${q8CorrectX}: ${q8CorrectX} : ${q8A} ＝ ${q8B} (Σωστό ✔).`
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

export default function AgnostosDiaGnostosExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      return cleanUser === cleanTarget;
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
      title="Ασκήσεις: Άγνωστος Διαιρετέος - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση εξισώσεων με άγνωστο διαιρετέο (x : α = β) για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/37-agnostos-dia-gnostos"
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
                <span>ΚΕΦΑΛΑΙΟ 37 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Άγνωστος Διαιρετέος (x : α ＝ β)
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην επίλυση εξισώσεων διαίρεσης με φυσικούς αριθμούς, δεκαδικούς, κλάσματα και προβλήματα καθημερινότητας!
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
                          key={`input-${q.id}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="text"
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder="x ＝ ..."
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

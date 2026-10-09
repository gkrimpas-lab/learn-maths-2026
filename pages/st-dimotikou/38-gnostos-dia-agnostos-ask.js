// pages/st-dimotikou/38-gnostos-dia-agnostos-ask.js
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

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποίηση αριθμών με ελληνικό locale
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
    title: 'Μοιρασιά Χρημάτων σε Παιδιά',
    unit: 'παιδιά',
    generate: () => {
      // a : x = b -> 60 : x = 12 -> x = 5
      const x = randInt(3, 6);
      const b = randInt(10, 20);
      const a = x * b;
      return {
        prompt: `Ο κύριος Νίκος μοίρασε εξίσου ${a}€ στα παιδιά του (x παιδιά). Αν κάθε παιδί πήρε ${b}€, πόσα είναι τα παιδιά του (x);`,
        unit: 'παιδιά',
        correctVal: String(x),
        correctText: `${x} παιδιά`,
        tableData: [
          { item: 'Συνολικό ποσό (α)', formula: `${a} €`, val: `${a} €` },
          { item: 'Ποσό ανά παιδί (β)', formula: `${b} €`, val: `${b} €` },
          { item: 'Εξίσωση (α : x ＝ β)', formula: `${a} : x ＝ ${b}`, val: `x ＝ ${a} : ${b} ＝ ${x} παιδιά` }
        ],
        explain: `Σχηματίζουμε την εξίσωση: ${a} : x ＝ ${b}. Για να βρούμε τον άγνωστο διαιρέτη x, διαιρούμε τον διαιρετέο με το πηλίκο: x ＝ ${a} : ${b} ＝ ${x} παιδιά.`,
        distractors: [`${x + 2} παιδιά`, `${Math.max(1, x - 1)} παιδιά`, `${x + 4} παιδιά`]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Μοίρασμα Γάλακτος σε Μπουκάλια',
    unit: 'μπουκάλια',
    generate: () => {
      // a : x = b -> 48 : x = 6 -> x = 8
      const x = randInt(4, 8);
      const b = randInt(6, 12);
      const a = x * b;
      return {
        prompt: `Ένα δοχείο περιείχε ${a} λίτρα γάλα. Μοιράστηκε ισόποσα σε x μπουκάλια, έτσι ώστε κάθε μπουκάλι να περιέχει ${b} λίτρα. Πόσα μπουκάλια (x) χρησιμοποιήθηκαν;`,
        unit: 'μπουκάλια',
        correctVal: String(x),
        correctText: `${x} μπουκάλια`,
        tableData: [
          { item: 'Συνολικό γάλα (α)', formula: `${a} λ.`, val: `${a} λ.` },
          { item: 'Χωρητικότητα μπουκαλιού (β)', formula: `${b} λ.`, val: `${b} λ.` },
          { item: 'Εξίσωση', formula: `${a} : x ＝ ${b}`, val: `x ＝ ${a} : ${b} ＝ ${x} μπουκάλια` }
        ],
        explain: `Η εξίσωση είναι ${a} : x ＝ ${b}. Βρίσκουμε τον άγνωστο διαιρέτη με διαίρεση: x ＝ ${a} : ${b} ＝ ${x} μπουκάλια.`,
        distractors: [`${x + 2} μπουκάλια`, `${x - 2} μπουκάλια`, `${x + 3} μπουκάλια`]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Χωρισμός Μαθητών σε Ομάδες',
    unit: 'ομάδες',
    generate: () => {
      // a : x = b -> 72 : x = 12 -> x = 6
      const x = randInt(4, 7);
      const b = randInt(10, 16);
      const a = x * b;
      return {
        prompt: `Σε ένα σχολείο ${a} μαθητές χωρίστηκαν σε x ισάριθμες ομάδες. Αν η κάθε ομάδα έχει ${b} μαθητές, πόσες ομάδες σχηματίστηκαν;`,
        unit: 'ομάδες',
        correctVal: String(x),
        correctText: `${x} ομάδες`,
        tableData: [
          { item: 'Συνολικοί μαθητές (α)', formula: `${a}`, val: `${a}` },
          { item: 'Μαθητές ανά ομάδα (β)', formula: `${b}`, val: `${b}` },
          { item: 'Εξίσωση', formula: `${a} : x ＝ ${b}`, val: `x ＝ ${a} : ${b} ＝ ${x} ομάδες` }
        ],
        explain: `${a} : x ＝ ${b} ➔ x ＝ ${a} : ${b} ＝ ${x} ομάδες.`,
        distractors: [`${x + 2} ομάδες`, `${x - 1} ομάδες`, `${x + 4} ομάδες`]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Συσκευασία Πατάτας σε Σακιά',
    unit: 'σακιά',
    generate: () => {
      // a : x = b -> 90 : x = 15 -> x = 6
      const x = randInt(4, 8);
      const b = randInt(12, 20);
      const a = x * b;
      return {
        prompt: `Μια αποθήκη συσκεύασε ${a} κιλά πατάτες σε x όμοια σακιά. Αν κάθε σακί περιέχει ${b} κιλά, πόσα σακιά χρησιμοποιήθηκαν συνολικά;`,
        unit: 'σακιά',
        correctVal: String(x),
        correctText: `${x} σακιά`,
        tableData: [
          { item: 'Συνολικό βάρος (α)', formula: `${a} κιλά`, val: `${a} κιλά` },
          { item: 'Βάρος σακιού (β)', formula: `${b} κιλά`, val: `${b} κιλά` },
          { item: 'Εξίσωση', formula: `${a} : x ＝ ${b}`, val: `x ＝ ${a} : ${b} ＝ ${x}` }
        ],
        explain: `Εξίσωση: ${a} : x ＝ ${b} ➔ x ＝ ${a} : ${b} ＝ ${x} σακιά.`,
        distractors: [`${x + 3} σακιά`, `${x - 2} σακιά`, `${x + 5} σακιά`]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Κιβώτια με Φρούτα',
    unit: 'κιβώτια',
    generate: () => {
      // 80 : x = 16 -> x = 5
      const x = randInt(4, 6);
      const b = randInt(12, 18);
      const a = x * b;
      return {
        prompt: `Ένας μανάβης είχε ${a} κιλά πορτοκάλια και τα τοποθέτησε σε x ίδια κιβώτια. Αν το κάθε κιβώτιο χωράει ${b} κιλά, πόσα κιβώτια (x) χρησιμοποίησε;`,
        unit: 'κιβώτια',
        correctVal: String(x),
        correctText: `${x} κιβώτια`,
        tableData: [
          { item: 'Συνολικά πορτοκάλια (α)', formula: `${a} κιλά`, val: `${a} κιλά` },
          { item: 'Κιλά ανά κιβώτιο (β)', formula: `${b} κιλά`, val: `${b} κιλά` },
          { item: 'Εξίσωση', formula: `${a} : x ＝ ${b}`, val: `x ＝ ${a} : ${b} ＝ ${x}` }
        ],
        explain: `${a} : x ＝ ${b} ➔ x ＝ ${a} : ${b} ＝ ${x} κιβώτια.`,
        distractors: [`${x + 2} κιβώτια`, `${x - 1} κιβώτια`, `${x + 3} κιβώτια`]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Κοπή Κορδέλας σε Ίσα Κομμάτια',
    unit: 'κομμάτια',
    generate: () => {
      // 36 : x = 4 -> x = 9
      const x = randInt(6, 9);
      const b = randInt(3, 5);
      const a = x * b;
      return {
        prompt: `Μια κορδέλα μήκους ${a} μέτρων κόπηκε σε x ίσα κομμάτια μήκους ${b} μέτρων το καθένα. Πόσα κομμάτια (x) προέκυψαν;`,
        unit: 'κομμάτια',
        correctVal: String(x),
        correctText: `${x} κομμάτια`,
        tableData: [
          { item: 'Αρχικό μήκος (α)', formula: `${a} μ.`, val: `${a} μ.` },
          { item: 'Μήκος κομματιού (β)', formula: `${b} μ.`, val: `${b} μ.` },
          { item: 'Εξίσωση', formula: `${a} : x ＝ ${b}`, val: `x ＝ ${a} : ${b} ＝ ${x}` }
        ],
        explain: `${a} : x ＝ ${b} ➔ x ＝ ${a} : ${b} ＝ ${x} κομμάτια.`,
        distractors: [`${x + 2} κομμάτια`, `${x - 2} κομμάτια`, `${x + 4} κομμάτια`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Εξίσωση με Δεκαδικό Διαιρετέο',
    unit: '',
    generate: () => {
      // 14,4 : x = 2,4 -> x = 6
      const x = randInt(3, 6);
      const b = 2.4;
      const a = Number((x * b).toFixed(1));
      const aStr = a.toFixed(1).replace('.', ',');
      const bStr = b.toFixed(1).replace('.', ',');
      return {
        prompt: `Λύσε την εξίσωση με δεκαδικούς αριθμούς: ${aStr} : x ＝ ${bStr}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: 'Εξίσωση', formula: `${aStr} : x ＝ ${bStr}`, val: `x ＝ ${aStr} : ${bStr}` },
          { item: 'Διαίρεση δεκαδικών', formula: `${a} : ${b}`, val: `x ＝ ${x}` }
        ],
        explain: `x ＝ ${aStr} : ${bStr} ＝ ${x}.`,
        distractors: [String(x + 1), String(Math.max(1, x - 1)), String(x * 2)]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Εξίσωση με Κλάσματα (3/4 : x ＝ 1/4)',
    unit: '',
    generate: () => {
      // 3/4 : x = 1/4 -> x = (3/4) : (1/4) = 3
      const den = 4;
      const numA = 3;
      const numB = 1;
      const x = numA / numB; // 3
      return {
        prompt: `Λύσε την εξίσωση με κλάσματα: ${numA}/${den} : x ＝ ${numB}/${den}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: 'Εξίσωση', formula: `${numA}/${den} : x ＝ ${numB}/${den}`, val: `x ＝ (${numA}/${den}) : (${numB}/${den})` },
          { item: 'Αντιστροφή και υπολογισμός', formula: `(${numA}/${den}) · (${den}/${numB}) ＝ ${numA}/${numB}`, val: `${x}` }
        ],
        explain: `x ＝ (${numA}/${den}) : (${numB}/${den}) ＝ (${numA}/${den}) · (${den}/${numB}) ＝ ${numA} : ${numB} ＝ ${x}.`,
        distractors: [String(x + 1), String(x - 1), '1/3']
      };
    }
  },
  {
    id: 'hp3',
    title: 'Σύνθετη Εξίσωση (40 : x) ＋ 3 ＝ 11',
    unit: '',
    generate: () => {
      // (40 : x) + 3 = 11 -> 40 : x = 8 -> x = 5
      const a = 40;
      const add = 3;
      const inter = 8;
      const total = inter + add; // 11
      const x = a / inter; // 5
      return {
        prompt: `Λύσε τη σύνθετη εξίσωση: (${a} : x) ＋ ${add} ＝ ${total}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: '1ο Βήμα (αφαίρεση προσθετέου)', formula: `${total} － ${add}`, val: `${a} : x ＝ ${inter}` },
          { item: '2ο Βήμα (διαίρεση διαιρετέου)', formula: `${a} : ${inter}`, val: `x ＝ ${x}` }
        ],
        explain: `Πρώτα βρίσκουμε πόσο είναι το ${a} : x αφαιρώντας το ${add}: ${a} : x ＝ ${total} － ${add} ＝ ${inter}. Στη συνέχεια βρίσκουμε τον διαιρέτη: x ＝ ${a} : ${inter} ＝ ${x}.`,
        distractors: [String(x + 2), String(x - 1), String(x + 4)]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Σύνθετη Εξίσωση (60 : x) － 4 ＝ 6',
    unit: '',
    generate: () => {
      // (60 : x) - 4 = 6 -> 60 : x = 10 -> x = 6
      const a = 60;
      const sub = 4;
      const rem = 6;
      const inter = rem + sub; // 10
      const x = a / inter; // 6
      return {
        prompt: `Λύσε τη σύνθετη εξίσωση: (${a} : x) － ${sub} ＝ ${rem}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: '1ο Βήμα (πρόσθεση αφαιρετέου)', formula: `${rem} ＋ ${sub}`, val: `${a} : x ＝ ${inter}` },
          { item: '2ο Βήμα (διαίρεση διαιρετέου)', formula: `${a} : ${inter}`, val: `x ＝ ${x}` }
        ],
        explain: `Πρώτα βρίσκουμε το ${a} : x προσθέτοντας το ${sub}: ${a} : x ＝ ${rem} ＋ ${sub} ＝ ${inter}. Έπειτα υπολογίζουμε το x: x ＝ ${a} : ${inter} ＝ ${x}.`,
        distractors: [String(x + 2), String(x - 2), String(x + 4)]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Εξίσωση με Κλάσμα στο Πηλίκο (4 : x ＝ 2/3)',
    unit: '',
    generate: () => {
      // 4 : x = 2/3 -> x = 4 : 2/3 = 4 * 3/2 = 6
      const a = 4;
      const numB = 2;
      const denB = 3;
      const x = (a * denB) / numB; // 6
      return {
        prompt: `Λύσε την εξίσωση: ${a} : x ＝ ${numB}/${denB}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: 'Εξίσωση', formula: `${a} : x ＝ ${numB}/${denB}`, val: `x ＝ ${a} : (${numB}/${denB})` },
          { item: 'Πολλαπλασιασμός με αντίστροφο', formula: `${a} · (${denB}/${numB}) ＝ 12/2`, val: `${x}` }
        ],
        explain: `x ＝ ${a} : (${numB}/${denB}) ＝ ${a} · (${denB}/${numB}) ＝ 12/2 ＝ ${x}.`,
        distractors: [String(x + 2), String(x - 2), '8/3']
      };
    }
  },
  {
    id: 'hp6',
    title: 'Πρόβλημα Μοιρασιάς με Σταθερό Πηλίκο',
    unit: 'κομμάτια',
    generate: () => {
      // 45 : x = 5 -> x = 9
      const a = 45;
      const b = 5;
      const x = a / b;
      return {
        prompt: `Μια πίτσα έχει ${a} εκατοστά περιφέρεια και κόπηκε σε x ίσα κομμάτια, έτσι ώστε κάθε κομμάτι να έχει τόξο ${b} εκατοστών. Σε πόσα κομμάτια (x) κόπηκε η πίτσα;`,
        unit: 'κομμάτια',
        correctVal: String(x),
        correctText: `${x} κομμάτια`,
        tableData: [
          { item: 'Ολικό μήκος περιφέρειας (α)', formula: `${a} εκ.`, val: `${a} εκ.` },
          { item: 'Μήκος κομματιού (β)', formula: `${b} εκ.`, val: `${b} εκ.` },
          { item: 'Εξίσωση', formula: `${a} : x ＝ ${b}`, val: `x ＝ ${a} : ${b} ＝ ${x}` }
        ],
        explain: `${a} : x ＝ ${b} ➔ x ＝ ${a} : ${b} ＝ ${x} κομμάτια.`,
        distractors: [`${x + 2} κομμάτια`, `${x - 2} κομμάτια`, `${x + 3} κομμάτια`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Βασική εξίσωση a : x = b με φυσικούς αριθμούς
  const q1X = randInt(3, 9);
  const q1B = randInt(4, 15);
  const q1A = q1X * q1B;

  // Q2: Input - Εξίσωση a : x = b με μεγαλύτερους φυσικούς αριθμούς
  const q2X = randInt(11, 25);
  const q2B = randInt(8, 20);
  const q2A = q2X * q2B;

  // Q3: Input - Εξίσωση με δεκαδικούς αριθμούς: a : x = b (x = a / b)
  const q3X = randInt(2, 6);
  const q3B_raw = randInt(12, 55) / 10;
  const q3A_raw = Number((q3X * q3B_raw).toFixed(1));
  const q3A = q3A_raw.toFixed(1).replace('.', ',');
  const q3B = q3B_raw.toFixed(1).replace('.', ',');
  const q3Correct = String(q3X);

  // Q4: MCQ - Επιλογή του σωστού βήματος επίλυσης για την εξίσωση a : x = b
  const q4X = randInt(4, 12);
  const q4B = randInt(5, 14);
  const q4A = q4X * q4B;
  const q4CorrectStep = `x ＝ ${q4A} : ${q4B}`;
  const q4Wrongs = [
    `x ＝ ${q4A} · ${q4B}`,
    `x ＝ ${q4B} : ${q4A}`,
    `x ＝ ${q4A} － ${q4B}`
  ];
  const q4Options = shuffle([...new Set([q4CorrectStep, ...q4Wrongs])]);

  // Q5: True/False - Κανόνας εύρεσης άγνωστου διαιρέτη
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στην εξίσωση α : x ＝ β, ο άγνωστος x είναι ο διαιρέτης και υπολογίζεται με διαίρεση: x ＝ α : β.'
    : 'Στην εξίσωση α : x ＝ β, ο άγνωστος x υπολογίζεται πάντοτε με πολλαπλασιασμό: x ＝ α · β.';

  // Q6: True/False - Σχέση όρων στη διαίρεση
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Στη διαίρεση α : x ＝ β, ο διαιρετέος (α) είναι πάντοτε μεγαλύτερος τόσο από τον διαιρέτη (x) όσο και από το πηλίκο (β).'
    : 'Στη διαίρεση α : x ＝ β, ο άγνωστος διαιρέτης (x) είναι πάντοτε μεγαλύτερος από τον διαιρετέο (α).';

  // Q7: Input - Εξίσωση με κλάσματα: a/b : x = c/d
  const q7Den = randInt(4, 9);
  const q7X = randInt(2, 6);
  const q7NumB = randInt(2, 5);
  const q7NumA = q7NumB * q7X;
  const q7Prompt = `Λύσε την εξίσωση: ${q7NumA}/${q7Den} : x ＝ ${q7NumB}/${q7Den}`;
  const q7Correct = String(q7X);

  // Q8: MCQ - Επαλήθευση εξίσωσης διαιρέτη
  const q8X = randInt(3, 8);
  const q8B = randInt(5, 10);
  const q8A = q8X * q8B;
  const q8Options = shuffle([...new Set([String(q8X), String(q8X + 2), String(q8X - 1), String(q8A - q8B)])]);

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
      inputType: 'number',
      title: 'Εξίσωση: α : x ＝ β',
      prompt: `Λύσε την εξίσωση: ${q1A} : x ＝ ${q1B}`,
      correct: String(q1X),
      explain: `x ＝ ${q1A} : ${q1B} ＝ ${q1X}.`
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: 'Μεγαλύτεροι Αριθμοί',
      prompt: `Λύσε την εξίσωση: ${q2A} : x ＝ ${q2B}`,
      correct: String(q2X),
      explain: `x ＝ ${q2A} : ${q2B} ＝ ${q2X}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Δεκαδικοί Αριθμοί',
      prompt: `Λύσε την εξίσωση: ${q3A} : x ＝ ${q3B}`,
      correct: q3Correct,
      explain: `x ＝ ${q3A} : ${q3B} ＝ ${q3Correct}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Σωστό Βήμα Επίλυσης',
      prompt: `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση ${q4A} : x ＝ ${q4B};`,
      options: q4Options,
      correct: q4CorrectStep,
      explain: `Για να βρούμε τον άγνωστο διαιρέτη x, διαιρούμε τον διαιρετέο με το πηλίκο: ${q4CorrectStep}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Κανόνας Διαιρέτη',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Για να βρούμε τον άγνωστο διαιρέτη κάνουμε διαίρεση: x ＝ α : β.'
        : 'Λάθος! Για να βρούμε τον άγνωστο διαιρέτη κάνουμε διαίρεση (x ＝ α : β).'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Ιδιότητα Διαιρετέου',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Ο διαιρετέος (α) είναι το αρχικό συνολικό μέγεθος, άρα είναι μεγαλύτερος από το x και από το β.'
        : 'Λάθος! Ο διαιρετέος (α) είναι το μεγαλύτερο μέγεθος στη διαίρεση.'
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: 'Εξίσωση με Κλάσματα',
      prompt: q7Prompt,
      correct: q7Correct,
      explain: `x ＝ (${q7NumA}/${q7Den}) : (${q7NumB}/${q7Den}) ＝ (${q7NumA}/${q7Den}) · (${q7Den}/${q7NumB}) ＝ ${q7NumA} : ${q7NumB} ＝ ${q7X}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Επαλήθευση Εξίσωσης',
      prompt: `Στην εξίσωση ${q8A} : x ＝ ${q8B}, ποια τιμή του x επαληθεύει την ισότητα;`,
      options: q8Options,
      correct: String(q8X),
      explain: `Αντικαθιστούμε x ＝ ${q8X}: ${q8A} : ${q8X} ＝ ${q8B} (Σωστό ✔).`
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

export default function GnostosDiaAgnostosExercisesPage() {
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

  // Χειρισμός απαντήσεων: sanitize για inputs, αυτούσιο για mcq/tf
  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      let sanitized = String(rawValue).replace(/[^0-9]/g, '');
      if (sanitized.length > 10) {
        sanitized = sanitized.slice(0, 10);
      }
      setAnswers(prev => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers(prev => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase();
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

  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== null && String(val).trim() !== '').length;

  return (
    <Layout
      title="Ασκήσεις: Άγνωστος Διαιρέτης - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση εξισώσεων με άγνωστο διαιρέτη (α : x = β) για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/38-gnostos-dia-agnostos"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase('Θεωρία')}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>ΚΕΦΑΛΑΙΟ 38 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Άγνωστος Διαιρέτης (α : x ＝ β)
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
                              onClick={() => handleAnswerChange(q.id, opt, 'mcq')}
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
                          inputMode="numeric"
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
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
                          onClick={() => handleAnswerChange(q.id, true, 'tf')}
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
                          onClick={() => handleAnswerChange(q.id, false, 'tf')}
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
                                <th className="p-1.5">{toCleanUppercase('Ανάλυση / Τύπος')}</th>
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
              <span>{submitted ? toCleanUppercase('Σκορ') : toCleanUppercase('Απαντήθηκαν')}:</span>
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

// pages/st-dimotikou/36-gnostos-epi-agnostos-ask.js
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
    title: 'Αγορά Τετραδίων',
    unit: 'ευρώ',
    generate: () => {
      // a * x = b -> 5 * x = 20 -> x = 4
      const a = randInt(4, 7);
      const x = randInt(3, 8);
      const b = a * x;
      return {
        prompt: `Ο Κώστας αγόρασε ${a} ίδια τετράδια (x ευρώ το καθένα) και πλήρωσε συνολικά ${b}€. Πόσο κόστιζε το κάθε τετράδιο (x);`,
        unit: 'ευρώ',
        correctVal: String(x),
        correctText: `${x}€`,
        tableData: [
          { item: 'Πλήθος τετραδίων (α)', formula: `${a}`, val: `${a}` },
          { item: 'Συνολικό κόστος (β)', formula: `${b} €`, val: `${b}` },
          { item: 'Εξίσωση (α · x ＝ β)', formula: `${a} · x ＝ ${b}`, val: `x ＝ ${b} : ${a} ＝ ${x}€` }
        ],
        explain: `Σχηματίζουμε την εξίσωση: ${a} · x ＝ ${b}. Για να βρούμε τον άγνωστο παράγοντα x, διαιρούμε το γινόμενο με τον γνωστό παράγοντα: x ＝ ${b} : ${a} ＝ ${x}€.`,
        distractors: [`${x + 2}€`, `${Math.max(1, x - 2)}€`, `${b - a}€`]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Συσκευασία Πατατών σε Σακιά',
    unit: 'κιλά',
    generate: () => {
      // a * x = b -> 6 * x = 72 -> x = 12
      const a = randInt(4, 8);
      const x = randInt(8, 15);
      const b = a * x;
      return {
        prompt: `Ένας αγρότης συσκεύασε ${b} κιλά πατάτες σε ${a} όμοια σακιά (x κιλά το καθένα). Πόσα κιλά περιείχε το κάθε σακί;`,
        unit: 'κιλά',
        correctVal: String(x),
        correctText: `${x} κιλά`,
        tableData: [
          { item: 'Πλήθος σακιών (α)', formula: `${a}`, val: `${a}` },
          { item: 'Συνολικό βάρος (β)', formula: `${b} κιλά`, val: `${b}` },
          { item: 'Εξίσωση', formula: `${a} · x ＝ ${b}`, val: `x ＝ ${b} : ${a} ＝ ${x} κιλά` }
        ],
        explain: `Η εξίσωση είναι ${a} · x ＝ ${b}. Βρίσκουμε τον άγνωστο παράγοντα με διαίρεση: x ＝ ${b} : ${a} ＝ ${x} κιλά.`,
        distractors: [`${x + 3} κιλά`, `${x - 2} κιλά`, `${x + 5} κιλά`]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Καθίσματα σε Θέατρο',
    unit: 'καθίσματα',
    generate: () => {
      // a * x = b -> 5 * x = 90 -> x = 18
      const a = randInt(4, 6);
      const x = randInt(12, 22);
      const b = a * x;
      return {
        prompt: `Σε ένα θέατρο υπάρχουν ${a} ίσες σειρές καθισμάτων (x καθίσματα ανά σειρά). Αν συνολικά υπάρχουν ${b} καθίσματα, πόσα καθίσματα έχει κάθε σειρά;`,
        unit: 'καθίσματα',
        correctVal: String(x),
        correctText: `${x} καθίσματα`,
        tableData: [
          { item: 'Σειρές (α)', formula: `${a}`, val: `${a}` },
          { item: 'Συνολικά καθίσματα (β)', formula: `${b}`, val: `${b}` },
          { item: 'Εξίσωση', formula: `${a} · x ＝ ${b}`, val: `x ＝ ${b} : ${a} ＝ ${x} καθίσματα` }
        ],
        explain: `${a} · x ＝ ${b} ➔ x ＝ ${b} : ${a} ＝ ${x} καθίσματα ανά σειρά.`,
        distractors: [`${x + 4} καθίσματα`, `${x - 3} καθίσματα`, `${x + 2} καθίσματα`]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Κιβώτια με Μπουκάλια Χυμού',
    unit: 'μπουκάλια',
    generate: () => {
      // a * x = b -> 8 * x = 96 -> x = 12
      const a = randInt(5, 8);
      const x = randInt(6, 14);
      const b = a * x;
      return {
        prompt: `Σε μια αποθήκη τοποθετήθηκαν ${a} κιβώτια με ίσο αριθμό από μπουκάλια χυμού (x μπουκάλια το καθένα). Αν όλα μαζί είναι ${b} μπουκάλια, πόσα μπουκάλια έχει κάθε κιβώτιο;`,
        unit: 'μπουκάλια',
        correctVal: String(x),
        correctText: `${x} μπουκάλια`,
        tableData: [
          { item: 'Κιβώτια (α)', formula: `${a}`, val: `${a}` },
          { item: 'Σύνολο μπουκαλιών (β)', formula: `${b}`, val: `${b}` },
          { item: 'Εξίσωση', formula: `${a} · x ＝ ${b}`, val: `x ＝ ${b} : ${a} ＝ ${x}` }
        ],
        explain: `Εξίσωση: ${a} · x ＝ ${b} ➔ x ＝ ${b} : ${a} ＝ ${x} μπουκάλια.`,
        distractors: [`${x + 2} μπουκάλια`, `${x - 2} μπουκάλια`, `${x + 4} μπουκάλια`]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Εισιτήρια Λούνα Παρκ',
    unit: 'ευρώ',
    generate: () => {
      // 4 * x = 28 -> x = 7
      const a = 4;
      const x = randInt(6, 9);
      const b = a * x;
      return {
        prompt: `Μια παρέα ${a} παιδιών αγόρασε ισάριθμα εισιτήρια για ένα παιχνίδι στο λούνα παρκ και πλήρωσε συνολικά ${b}€. Πόσο κόστιζε το εισιτήριο για κάθε παιδί (x);`,
        unit: 'ευρώ',
        correctVal: String(x),
        correctText: `${x}€`,
        tableData: [
          { item: 'Παιδιά (α)', formula: `${a}`, val: `${a}` },
          { item: 'Συνολικό κόστος (β)', formula: `${b} €`, val: `${b}` },
          { item: 'Εξίσωση', formula: `${a} · x ＝ ${b}`, val: `x ＝ ${b} : ${a} ＝ ${x}€` }
        ],
        explain: `${a} · x ＝ ${b} ➔ x ＝ ${b} : ${a} ＝ ${x}€.`,
        distractors: [`${x + 2}€`, `${x - 2}€`, `${b - a}€`]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Φύτευση Δενδρυλλίων σε Σειρές',
    unit: 'δενδρύλλια',
    generate: () => {
      // 6 * x = 48 -> x = 8
      const a = 6;
      const x = randInt(7, 12);
      const b = a * x;
      return {
        prompt: `Ένας γεωπόνος φύτεψε ${b} δενδρύλλια σε ${a} ίσες σειρές. Πόσα δενδρύλλια (x) φύτεψε σε κάθε σειρά;`,
        unit: 'δενδρύλλια',
        correctVal: String(x),
        correctText: `${x} δενδρύλλια`,
        tableData: [
          { item: 'Σειρές (α)', formula: `${a}`, val: `${a}` },
          { item: 'Συνολικά δέντρα (β)', formula: `${b}`, val: `${b}` },
          { item: 'Εξίσωση', formula: `${a} · x ＝ ${b}`, val: `x ＝ ${b} : ${a} ＝ ${x}` }
        ],
        explain: `${a} · x ＝ ${b} ➔ x ＝ ${b} : ${a} ＝ ${x} δενδρύλλια.`,
        distractors: [`${x + 2} δενδρύλλια`, `${x - 2} δενδρύλλια`, `${x + 4} δενδρύλλια`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Περίμετρος Τετραγώνου με Άγνωστη Πλευρά',
    unit: 'εκ.',
    generate: () => {
      // 4 · x = 36 -> x = 9
      const side = randInt(6, 14);
      const perim = 4 * side;
      return {
        prompt: `Η περίμετρος ενός τετραγώνου είναι ${perim} εκατοστά. Πόσα εκατοστά είναι το μήκος της πλευράς του (x);`,
        unit: 'εκ.',
        correctVal: String(side),
        correctText: `${side} εκ.`,
        tableData: [
          { item: 'Τύπος περιμέτρου', formula: 'Π ＝ 4 · x', val: `4 · x ＝ ${perim}` },
          { item: 'Επίλυση εξίσωσης', formula: `${perim} : 4`, val: `x ＝ ${side} εκ.` }
        ],
        explain: `Το τετράγωνο έχει 4 ίσες πλευρές, άρα 4 · x ＝ ${perim} ➔ x ＝ ${perim} : 4 ＝ ${side} εκ.`,
        distractors: [`${side + 2} εκ.`, `${side - 2} εκ.`, `${Math.round(perim / 2)} εκ.`]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Εμβαδόν Ορθογωνίου με Άγνωστη Πλευρά',
    unit: 'μ.',
    generate: () => {
      // 6 · x = 42 -> x = 7
      const width = 6;
      const length = randInt(7, 12);
      const area = width * length;
      return {
        prompt: `Ένα ορθογώνιο οικόπεδο έχει εμβαδόν ${area} τ.μ. και πλάτος ${width} μέτρα. Πόσα μέτρα είναι το μήκος του (x);`,
        unit: 'μ.',
        correctVal: String(length),
        correctText: `${length} μ.`,
        tableData: [
          { item: 'Τύπος εμβαδού', formula: 'Ε ＝ πλάτος · μήκος', val: `${width} · x ＝ ${area}` },
          { item: 'Επίλυση εξίσωσης', formula: `${area} : ${width}`, val: `x ＝ ${length} μ.` }
        ],
        explain: `Ε ＝ ${width} · x ＝ ${area} ➔ x ＝ ${area} : ${width} ＝ ${length} μέτρα.`,
        distractors: [`${length + 2} μ.`, `${length - 2} μ.`, `${area - width} μ.`]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Εξίσωση με Δεκαδικό Παράγοντα (2,5 · x ＝ 15)',
    unit: '',
    generate: () => {
      // 2,5 * x = 15 -> x = 6
      const a = 2.5;
      const x = randInt(4, 8);
      const b = a * x;
      const aStr = a.toFixed(1).replace('.', ',');
      const bStr = b.toFixed(1).replace('.', ',');
      return {
        prompt: `Λύσε την εξίσωση: ${aStr} · x ＝ ${bStr}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: 'Εξίσωση', formula: `${aStr} · x ＝ ${bStr}`, val: `x ＝ ${bStr} : ${aStr}` },
          { item: 'Διαίρεση δεκαδικών', formula: `${b} : ${a}`, val: `x ＝ ${x}` }
        ],
        explain: `x ＝ ${bStr} : ${aStr} ＝ ${x}.`,
        distractors: [String(x + 1), String(x - 1), String(x * 2)]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Εξίσωση με Κλάσμα ως Συντελεστή (2/3 · x ＝ 8)',
    unit: '',
    generate: () => {
      // 2/3 * x = 8 -> x = 8 : 2/3 = 8 * 3/2 = 12
      const num = 2;
      const den = 3;
      const x = randInt(6, 12);
      const b = (num * x) / den;
      if (!Number.isInteger(b)) {
        return {
          prompt: 'Λύσε την εξίσωση: 2/3 · x ＝ 8:',
          unit: '',
          correctVal: '12',
          correctText: '12',
          tableData: [
            { item: 'Εξίσωση', formula: '2/3 · x ＝ 8', val: 'x ＝ 8 : (2/3)' },
            { item: 'Αντιστροφή και πολλαπλασιασμός', formula: '8 · (3/2) ＝ 24/2', val: '12' }
          ],
          explain: 'x ＝ 8 : (2/3) ＝ 8 · (3/2) ＝ 24/2 ＝ 12.',
          distractors: ['16/3', '10', '6']
        };
      }
      return {
        prompt: `Λύσε την εξίσωση: ${num}/${den} · x ＝ ${b}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: 'Εξίσωση', formula: `${num}/${den} · x ＝ ${b}`, val: `x ＝ ${b} : (${num}/${den})` },
          { item: 'Πολλαπλασιασμός με αντίστροφο', formula: `${b} · (${den}/${num})`, val: `${x}` }
        ],
        explain: `x ＝ ${b} : (${num}/${den}) ＝ ${b} · (${den}/${num}) ＝ ${x}.`,
        distractors: [String(x + 2), String(x - 2), String(b * num)]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Σύνθετη Εξίσωση (3x ＋ 5 ＝ 26)',
    unit: '',
    generate: () => {
      // 3x + 5 = 26 -> 3x = 21 -> x = 7
      const a = 3;
      const add = 5;
      const x = randInt(4, 8);
      const total = a * x + add;
      const inter = total - add;
      return {
        prompt: `Λύσε τη σύνθετη εξίσωση: ${a}x ＋ ${add} ＝ ${total}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: '1ο Βήμα (αφαίρεση προσθετέου)', formula: `${total} － ${add}`, val: `${a}x ＝ ${inter}` },
          { item: '2ο Βήμα (διαίρεση συντελεστή)', formula: `${inter} : ${a}`, val: `x ＝ ${x}` }
        ],
        explain: `Πρώτα βρίσκουμε πόσο είναι το ${a}x αφαιρώντας το ${add}: ${a}x ＝ ${total} － ${add} ＝ ${inter}. Έπειτα διαιρούμε με τον συντελεστή: x ＝ ${inter} : ${a} ＝ ${x}.`,
        distractors: [String(x + 1), String(x - 1), String(x + 2)]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Περίμετρος Ισόπλευρου Τριγώνου',
    unit: 'εκ.',
    generate: () => {
      // 3 · x = 45 -> x = 15
      const side = randInt(8, 16);
      const perim = 3 * side;
      return {
        prompt: `Η περίμετρος ενός ισόπλευρου τριγώνου είναι ${perim} εκατοστά. Πόσο είναι το μήκος της κάθε πλευράς του (x);`,
        unit: 'εκ.',
        correctVal: String(side),
        correctText: `${side} εκ.`,
        tableData: [
          { item: 'Τύπος περιμέτρου', formula: 'Π ＝ 3 · x', val: `3 · x ＝ ${perim}` },
          { item: 'Επίλυση', formula: `${perim} : 3`, val: `x ＝ ${side} εκ.` }
        ],
        explain: `Το ισόπλευρο τρίγωνο έχει 3 ίσες πλευρές: 3 · x ＝ ${perim} ➔ x ＝ ${perim} : 3 ＝ ${side} εκ.`,
        distractors: [`${side + 3} εκ.`, `${side - 3} εκ.`, `${perim - 3} εκ.`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Βασική εξίσωση a · x = b με φυσικούς αριθμούς
  const q1A = randInt(3, 9);
  const q1X = randInt(4, 15);
  const q1B = q1A * q1X;

  // Q2: Input - Εξίσωση x · a = b με μεγαλύτερους φυσικούς αριθμούς
  const q2A = randInt(12, 25);
  const q2X = randInt(11, 35);
  const q2B = q2A * q2X;

  // Q3: Input - Εξίσωση με δεκαδικούς αριθμούς: a · x = b
  const q3A = randInt(2, 6);
  const q3X_raw = randInt(12, 65) / 10;
  const q3B_raw = Number((q3A * q3X_raw).toFixed(1));
  const q3B = q3B_raw.toFixed(1).replace('.', ',');
  const q3Correct = q3X_raw.toFixed(1).replace('.', ',');

  // Q4: MCQ - Επιλογή του σωστού βήματος επίλυσης για την εξίσωση a · x = b
  const q4A = randInt(4, 12);
  const q4X = randInt(5, 14);
  const q4B = q4A * q4X;
  const q4CorrectStep = `x ＝ ${q4B} : ${q4A}`;
  const q4Wrongs = [
    `x ＝ ${q4B} · ${q4A}`,
    `x ＝ ${q4B} － ${q4A}`,
    `x ＝ ${q4A} : ${q4B}`
  ];
  const q4Options = shuffle([...new Set([q4CorrectStep, ...q4Wrongs])]);

  // Q5: True/False - Κανόνας εύρεσης άγνωστου παράγοντα
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Για να βρούμε τον άγνωστο παράγοντα σε μια εξίσωση πολλαπλασιασμού, διαιρούμε το γινόμενο με τον γνωστό παράγοντα (x ＝ β : α).'
    : 'Για να βρούμε τον άγνωστο παράγοντα σε μια εξίσωση πολλαπλασιασμού, πολλαπλασιάζουμε το γινόμενο με τον γνωστό παράγοντα (x ＝ β · α).';

  // Q6: True/False - Αντιμεταθετική ιδιότητα (α · x = x · α)
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Η εξίσωση 5 · x ＝ 35 και η εξίσωση x · 5 ＝ 35 λύνονται με τον ίδιο ακριβώς τρόπο (x ＝ 35 : 5).'
    : 'Στην εξίσωση x · 5 ＝ 35 δεν μπορούμε να κάνουμε διαίρεση επειδή το x είναι πρώτος παράγοντας.';

  // Q7: Input - Εξίσωση με κλάσματα: a/b · x = c/d
  const q7Den = randInt(3, 8);
  const q7NumA = randInt(2, 5);
  const q7X = randInt(2, 6);
  const q7NumB = q7NumA * q7X;
  const q7Prompt = `Λύσε την εξίσωση: ${q7NumA}/${q7Den} · x ＝ ${q7NumB}/${q7Den}`;
  const q7Correct = String(q7X);

  // Q8: MCQ - Επαλήθευση εξίσωσης πολλαπλασιασμού
  const q8A = randInt(3, 6);
  const q8X = randInt(6, 12);
  const q8B = q8A * q8X;
  const q8Options = shuffle([...new Set([String(q8X), String(q8X + 2), String(q8X - 2), String(q8B - q8A)])]);

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
      title: 'Εξίσωση: α · x ＝ β',
      prompt: `Λύσε την εξίσωση: ${q1A} · x ＝ ${q1B}`,
      correct: String(q1X),
      explain: `x ＝ ${q1B} : ${q1A} ＝ ${q1X}.`
    },
    {
      id: 'q2',
      type: 'input',
      title: 'Εξίσωση: x · α ＝ β',
      prompt: `Λύσε την εξίσωση: x · ${q2A} ＝ ${q2B}`,
      correct: String(q2X),
      explain: `x ＝ ${q2B} : ${q2A} ＝ ${q2X}.`
    },
    {
      id: 'q3',
      type: 'input',
      title: 'Δεκαδικοί Αριθμοί',
      prompt: `Λύσε την εξίσωση: ${q3A} · x ＝ ${q3B}`,
      correct: q3Correct,
      explain: `x ＝ ${q3B} : ${q3A} ＝ ${q3Correct}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Σωστό Βήμα Επίλυσης',
      prompt: `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση ${q4A} · x ＝ ${q4B};`,
      options: q4Options,
      correct: q4CorrectStep,
      explain: `Για να βρούμε τον άγνωστο παράγοντα x, διαιρούμε το γινόμενο με τον γνωστό παράγοντα: ${q4CorrectStep}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Κανόνας Παράγοντα Γινομένου',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Η αντίστροφη πράξη του πολλαπλασιασμού είναι η διαίρεση: x ＝ β : α.'
        : 'Λάθος! Για να βρούμε τον άγνωστο παράγοντα κάνουμε διαίρεση (x ＝ β : α).'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Θέση του Αγνώστου',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Λόγω της αντιμεταθετικής ιδιότητας του πολλαπλασιασμού, είτε το x είναι πρώτος είτε δεύτερος παράγοντας, λύνεται πάντα με διαίρεση: x ＝ β : α.'
        : 'Λάθος! Και στις δύο περιπτώσεις ο άγνωστος είναι παράγοντας γινομένου και υπολογίζεται με διαίρεση.'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Εξίσωση με Κλάσματα',
      prompt: q7Prompt,
      correct: q7Correct,
      explain: `x ＝ (${q7NumB}/${q7Den}) : (${q7NumA}/${q7Den}) ＝ (${q7NumB}/${q7Den}) · (${q7Den}/${q7NumA}) ＝ ${q7NumB} : ${q7NumA} ＝ ${q7X}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Επαλήθευση Εξίσωσης',
      prompt: `Στην εξίσωση ${q8A} · x ＝ ${q8B}, ποια τιμή του x επαληθεύει την ισότητα;`,
      options: q8Options,
      correct: String(q8X),
      explain: `Αντικαθιστούμε x ＝ ${q8X}: ${q8A} · ${q8X} ＝ ${q8B} (Σωστό ✔).`
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

export default function GnostosEpiAgnostosExercisesPage() {
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
      title="Ασκήσεις: Άγνωστος Παράγοντας - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση εξισώσεων με άγνωστο παράγοντα γινομένου (α · x = β) για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/36-gnostos-epi-agnostos"
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
                <span>ΚΕΦΑΛΑΙΟ 36 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Άγνωστος Παράγοντας (α · x ＝ β)
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην επίλυση εξισώσεων πολλαπλασιασμού με φυσικούς αριθμούς, δεκαδικούς, κλάσματα και προβλήματα καθημερινότητας!
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

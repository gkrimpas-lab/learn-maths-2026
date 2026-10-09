// pages/st-dimotikou/32-metabliti-ask.js
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
    title: 'Χρέωση Ταξί',
    unit: '€',
    generate: () => {
      // 2x + 3 για x = 5 -> 13
      const x = 5;
      const coeff = 2;
      const base = 3;
      const res = coeff * x + base;
      return {
        prompt: `Σε ένα ταξί η πάγια χρέωση εκκίνησης (ταρίφα) είναι ${base}€ και για κάθε χιλιόμετρο (x) η χρέωση είναι ${coeff}€. Η συνολική χρέωση δίνεται από την παράσταση ${coeff}x ＋ ${base}. Πόσα ευρώ θα πληρώσουμε για διαδρομή ${x} χιλιομέτρων;`,
        unit: '€',
        correctVal: String(res),
        correctText: `${res}€`,
        tableData: [
          { item: 'Χιλιόμετρα (x)', formula: `${x} χλμ.`, val: `${x}` },
          { item: 'Χρέωση κίνησης', formula: `${coeff} · ${x}€`, val: `${coeff * x}€` },
          { item: 'Πάγιο ταρίφας', formula: `${base}€`, val: `${base}€` },
          { item: 'Συνολικό κόστος', formula: `${coeff * x} ＋ ${base}€`, val: `${res}€` }
        ],
        explain: `Αντικαθιστούμε το x με το ${x} στην παράσταση: ${coeff} · ${x} ＋ ${base} ＝ ${coeff * x} ＋ ${base} ＝ ${res}€.`,
        distractors: [`${res + 2}€`, `${res - 3}€`, `${res + 5}€`]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Εισιτήριο Κινηματογράφου & Ποπ Κορν',
    unit: '€',
    generate: () => {
      // 3x + 7 για x = 4 -> 19
      const x = 4;
      const coeff = 3;
      const base = 7;
      const res = coeff * x + base;
      return {
        prompt: `Σε έναν κινηματογράφο το εισιτήριο εισόδου κοστίζει ${base}€ και κάθε κουτί ποπ κορν (x) κοστίζει ${coeff}€. Το συνολικό κόστος εκφράζεται ως ${coeff}x ＋ ${base}. Πόσο θα πληρώσει ένας θεατής αν αγοράσει ${x} κουτιά ποπ κορν;`,
        unit: '€',
        correctVal: String(res),
        correctText: `${res}€`,
        tableData: [
          { item: 'Κουτιά ποπ κορν (x)', formula: `${x} τεμάχια`, val: `${x}` },
          { item: 'Κόστος ποπ κορν', formula: `${coeff} · ${x}€`, val: `${coeff * x}€` },
          { item: 'Εισιτήριο εισόδου', formula: `${base}€`, val: `${base}€` },
          { item: 'Συνολικό ποσό', formula: `${coeff * x} ＋ ${base}€`, val: `${res}€` }
        ],
        explain: `Υπολογίζουμε για x ＝ ${x}: ${coeff} · ${x} ＋ ${base} ＝ ${coeff * x} ＋ ${base} ＝ ${res}€.`,
        distractors: [`${res + 3}€`, `${res - 2}€`, `${res + 4}€`]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Συνδρομή Γυμναστηρίου',
    unit: '€',
    generate: () => {
      // 4x + 10 για x = 6 -> 34
      const x = 6;
      const coeff = 4;
      const base = 10;
      const res = coeff * x + base;
      return {
        prompt: `Μια συνδρομή στο γυμναστήριο έχει μηνιαίο πάγιο ${base}€ και ${coeff}€ για κάθε ειδικό μάθημα (x). Το μηνιαίο κόστος είναι ${coeff}x ＋ ${base}. Πόσα ευρώ θα πληρώσει ένα μέλος που έκανε ${x} μαθήματα μέσα στον μήνα;`,
        unit: '€',
        correctVal: String(res),
        correctText: `${res}€`,
        tableData: [
          { item: 'Μαθήματα (x)', formula: `${x} μαθήματα`, val: `${x}` },
          { item: 'Κόστος μαθημάτων', formula: `${coeff} · ${x}€`, val: `${coeff * x}€` },
          { item: 'Μηνιαίο πάγιο', formula: `${base}€`, val: `${base}€` },
          { item: 'Σύνολο πληρωμής', formula: `${coeff * x} ＋ ${base}€`, val: `${res}€` }
        ],
        explain: `Για x ＝ ${x} έχουμε: ${coeff} · ${x} ＋ ${base} ＝ ${coeff * x} ＋ ${base} ＝ ${res}€.`,
        distractors: [`${res + 4}€`, `${res - 4}€`, `${res + 6}€`]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Εργαστήριο Κεραμικής',
    unit: '€',
    generate: () => {
      // 5x + 12 για x = 3 -> 27
      const x = 3;
      const coeff = 5;
      const base = 12;
      const res = coeff * x + base;
      return {
        prompt: `Σε ένα εργαστήριο κεραμικής η εγγραφή κοστίζει ${base}€ και κάθε ώρα χρήσης τροχού (x) κοστίζει ${coeff}€. Η συνολική χρέωση είναι ${coeff}x ＋ ${base}. Πόσα ευρώ θα πληρώσουμε για ${x} ώρες χρήσης;`,
        unit: '€',
        correctVal: String(res),
        correctText: `${res}€`,
        tableData: [
          { item: 'Ώρες τροχού (x)', formula: `${x} ώρες`, val: `${x}` },
          { item: 'Χρέωση ωρών', formula: `${coeff} · ${x}€`, val: `${coeff * x}€` },
          { item: 'Εγγραφή', formula: `${base}€`, val: `${base}€` },
          { item: 'Τελική τιμή', formula: `${coeff * x} ＋ ${base}€`, val: `${res}€` }
        ],
        explain: `Αντικαθιστούμε x ＝ ${x}: ${coeff} · ${x} ＋ ${base} ＝ ${coeff * x} ＋ ${base} ＝ ${res}€.`,
        distractors: [`${res + 5}€`, `${res - 3}€`, `${res + 2}€`]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Πίστα Καρτ',
    unit: '€',
    generate: () => {
      // 4x + 8 για x = 5 -> 28
      const x = 5;
      const coeff = 4;
      const base = 8;
      const res = coeff * x + base;
      return {
        prompt: `Σε μια πίστα καρτ το εισιτήριο εισόδου κοστίζει ${base}€ και κάθε γύρος στην πίστα (x) χρεώνεται με ${coeff}€. Η συνολική δαπάνη εκφράζεται ως ${coeff}x ＋ ${base}. Πόσο θα κοστίσει αν ένας οδηγός κάνει ${x} γύρους;`,
        unit: '€',
        correctVal: String(res),
        correctText: `${res}€`,
        tableData: [
          { item: 'Γύροι (x)', formula: `${x} γύροι`, val: `${x}` },
          { item: 'Κόστος γύρων', formula: `${coeff} · ${x}€`, val: `${coeff * x}€` },
          { item: 'Είσοδος', formula: `${base}€`, val: `${base}€` },
          { item: 'Συνολικό κόστος', formula: `${coeff * x} ＋ ${base}€`, val: `${res}€` }
        ],
        explain: `Για x ＝ ${x}: ${coeff} · ${x} ＋ ${base} ＝ ${coeff * x} ＋ ${base} ＝ ${res}€.`,
        distractors: [`${res + 4}€`, `${res - 4}€`, `${res + 6}€`]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Αποστολή Δέματος Courier',
    unit: '€',
    generate: () => {
      // 2x + 4 για x = 7 -> 18
      const x = 7;
      const coeff = 2;
      const base = 4;
      const res = coeff * x + base;
      return {
        prompt: `Μια εταιρεία courier χρεώνει πάγια αποστολή ${base}€ και επιπλέον ${coeff}€ για κάθε κιλό βάρους του δέματος (x). Η συνολική χρέωση είναι ${coeff}x ＋ ${base}. Πόσο θα κοστίσει η αποστολή ενός δέματος βάρους ${x} κιλών;`,
        unit: '€',
        correctVal: String(res),
        correctText: `${res}€`,
        tableData: [
          { item: 'Βάρος δέματος (x)', formula: `${x} κιλά`, val: `${x}` },
          { item: 'Χρέωση κιλών', formula: `${coeff} · ${x}€`, val: `${coeff * x}€` },
          { item: 'Πάγιο', formula: `${base}€`, val: `${base}€` },
          { item: 'Τελικό κόστος', formula: `${coeff * x} ＋ ${base}€`, val: `${res}€` }
        ],
        explain: `Υπολογίζουμε για x ＝ ${x}: ${coeff} · ${x} ＋ ${base} ＝ ${coeff * x} ＋ ${base} ＝ ${res}€.`,
        distractors: [`${res + 2}€`, `${res - 2}€`, `${res + 4}€`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Περίμετρος Ορθογωνίου με Μεταβλητή',
    unit: 'εκ.',
    generate: () => {
      // Μήκος = 2x + 3, Πλάτος = x. Περίμετρος = 2*(2x+3 + x) = 6x + 6. Για x = 4 -> Π = 30 εκ.
      const x = 4;
      const len = 2 * x + 3;
      const wid = x;
      const perim = 2 * (len + wid);
      return {
        prompt: `Ένα ορθογώνιο έχει μήκος (2x ＋ 3) εκατοστά και πλάτος x εκατοστά. Πόσα εκατοστά είναι η περίμετρος του ορθογωνίου όταν x ＝ ${x};`,
        unit: 'εκ.',
        correctVal: String(perim),
        correctText: `${perim} εκ.`,
        tableData: [
          { item: 'Πλάτος (x)', formula: `x ＝ ${x}`, val: `${wid} εκ.` },
          { item: 'Μήκος', formula: `2 · ${x} ＋ 3`, val: `${len} εκ.` },
          { item: 'Περίμετρος', formula: `2 · (${len} ＋ ${wid})`, val: `${perim} εκ.` }
        ],
        explain: `Για x ＝ ${x}, το πλάτος είναι ${wid} εκ. και το μήκος 2 · ${x} ＋ 3 ＝ ${len} εκ. Η περίμετρος ισούται με 2 · (${len} ＋ ${wid}) ＝ 2 · ${len + wid} ＝ ${perim} εκ.`,
        distractors: [`${perim - 4} εκ.`, `${perim + 4} εκ.`, `${len * wid} εκ.`]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Σύνθετη Έκφραση Ηλικιών',
    unit: 'έτη',
    generate: () => {
      // Ο πατέρας είναι 3x - 2 ετών, όπου x είναι η ηλικία της κόρης. Αν x = 12, ηλικία πατέρα = 34.
      const x = 12;
      const ageFather = 3 * x - 2;
      return {
        prompt: `Η ηλικία ενός πατέρα δίνεται από την παράσταση 3x － 2, όπου x είναι η ηλικία της κόρης του. Αν η κόρη είναι σήμερα ${x} ετών, πόσων ετών είναι ο πατέρας;`,
        unit: 'έτη',
        correctVal: String(ageFather),
        correctText: `${ageFather} ετών`,
        tableData: [
          { item: 'Ηλικία κόρης (x)', formula: `x ＝ ${x}`, val: `${x}` },
          { item: 'Τριπλάσιο ηλικίας', formula: `3 · ${x}`, val: `${3 * x}` },
          { item: 'Ηλικία πατέρα', formula: `3 · ${x} － 2`, val: `${ageFather}` }
        ],
        explain: `Αντικαθιστούμε x ＝ ${x} στην παράσταση: 3 · ${x} － 2 ＝ ${3 * x} － 2 ＝ ${ageFather} ετών.`,
        distractors: [`${ageFather + 2} ετών`, `${ageFather - 2} ετών`, `${3 * x} ετών`]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Παράσταση με Κλάσμα: (3x ＋ 6) : 3',
    unit: '',
    generate: () => {
      // (3x + 6) / 3 = x + 2. Για x = 5 -> 7
      const x = 5;
      const top = 3 * x + 6;
      const res = top / 3;
      return {
        prompt: `Υπολόγισε την αριθμητική τιμή της παράστασης (3x ＋ 6) : 3 όταν x ＝ ${x}:`,
        unit: '',
        correctVal: String(res),
        correctText: String(res),
        tableData: [
          { item: 'Αριθμητής (3x ＋ 6)', formula: `3 · ${x} ＋ 6`, val: `${top}` },
          { item: 'Διαίρεση με το 3', formula: `${top} : 3`, val: `${res}` }
        ],
        explain: `Πρώτα υπολογίζουμε την παρένθεση: 3 · ${x} ＋ 6 ＝ ${3 * x} ＋ 6 ＝ ${top}. Έπειτα διαιρούμε με το 3: ${top} : 3 ＝ ${res}.`,
        distractors: [String(res + 2), String(res - 1), String(res * 2)]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Εύρεση Μεταβλητής με Αφαίρεση (4x － 5 ＝ 27)',
    unit: '',
    generate: () => {
      // 4x - 5 = 27 -> 4x = 32 -> x = 8
      const x = 8;
      const target = 4 * x - 5;
      return {
        prompt: `Για ποια τιμή της μεταβλητής x η παράσταση 4x － 5 γίνεται ίση με ${target};`,
        unit: '',
        correctVal: String(x),
        correctText: `x ＝ ${x}`,
        tableData: [
          { item: 'Ισότητα', formula: `4x － 5 ＝ ${target}`, val: `4x ＝ ${target + 5}` },
          { item: 'Εύρεση 4x', formula: `${target} ＋ 5`, val: `${4 * x}` },
          { item: 'Τιμή x', formula: `${4 * x} : 4`, val: `${x}` }
        ],
        explain: `Αν 4x － 5 ＝ ${target}, τότε 4x ＝ ${target} ＋ 5 ＝ ${4 * x}. Επομένως x ＝ ${4 * x} : 4 ＝ ${x}.`,
        distractors: [`x ＝ ${x - 1}`, `x ＝ ${x + 1}`, `x ＝ ${x + 2}`]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Σύνθετο Κόστος Αγορών με 2 Μεταβλητές',
    unit: '€',
    generate: () => {
      // 3x + 2y για x=4 (τετράδια), y=5 (στυλό) -> 12 + 10 = 22€
      const x = 4;
      const y = 5;
      const res = 3 * x + 2 * y;
      return {
        prompt: `Ένας μαθητής αγόρασε 3 τετράδια αξίας x ευρώ το καθένα και 2 στυλό αξίας y ευρώ το καθένα (συνολικό κόστος: 3x ＋ 2y). Αν κάθε τετράδιο κοστίζει x ＝ ${x}€ και κάθε στυλό y ＝ ${y}€, πόσα ευρώ πλήρωσε συνολικά;`,
        unit: '€',
        correctVal: String(res),
        correctText: `${res}€`,
        tableData: [
          { item: 'Κόστος τετραδίων (3x)', formula: `3 · ${x}€`, val: `${3 * x}€` },
          { item: 'Κόστος στυλό (2y)', formula: `2 · ${y}€`, val: `${2 * y}€` },
          { item: 'Συνολική δαπάνη', formula: `${3 * x} ＋ ${2 * y}€`, val: `${res}€` }
        ],
        explain: `Αντικαθιστούμε x ＝ ${x} και y ＝ ${y}: 3 · ${x} ＋ 2 · ${y} ＝ ${3 * x} ＋ ${2 * y} ＝ ${res}€.`,
        distractors: [`${res - 2}€`, `${res + 3}€`, `${res + 5}€`]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Απλοποίηση & Υπολογισμός Παράστασης: 2(x ＋ 5)',
    unit: '',
    generate: () => {
      // 2*(x + 5) για x = 7 -> 2*12 = 24
      const x = 7;
      const inside = x + 5;
      const res = 2 * inside;
      return {
        prompt: `Υπολόγισε την αριθμητική τιμή της παράστασης 2 · (x ＋ 5) όταν x ＝ ${x}:`,
        unit: '',
        correctVal: String(res),
        correctText: String(res),
        tableData: [
          { item: 'Υπολογισμός παρένθεσης', formula: `${x} ＋ 5`, val: `${inside}` },
          { item: 'Πολλαπλασιασμός επί 2', formula: `2 · ${inside}`, val: `${res}` }
        ],
        explain: `Πρώτα εκτελούμε την πράξη μέσα στην παρένθεση: ${x} ＋ 5 ＝ ${inside}. Στη συνέχεια πολλαπλασιάζουμε επί 2: 2 · ${inside} ＝ ${res}.`,
        distractors: [String(res + 2), String(res - 2), String(res + 5)]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Υπολογισμός Αριθμητικής Τιμής (ax + b)
  const q1A = randInt(2, 5);
  const q1B = randInt(3, 8);
  const q1X = randInt(2, 6);
  const q1Res = q1A * q1X + q1B;

  // Q2: Input - Υπολογισμός Αριθμητικής Τιμής με αφαίρεση (ax - b)
  const q2A = randInt(3, 6);
  const q2X = randInt(4, 7);
  const q2B = randInt(2, q2A * q2X - 5);
  const q2Res = q2A * q2X - q2B;

  // Q3: MCQ - Μετάφραση λεκτικής φράσης σε μαθηματική έκφραση με x
  const q3Pool = [
    { text: 'Το τριπλάσιο ενός αριθμού αυξημένο κατά 5', expr: '3x ＋ 5', wrongs: ['x/3 ＋ 5', '3 · (x － 5)', '3x － 5'] },
    { text: 'Το διπλάσιο ενός αριθμού ελαττωμένο κατά 4', expr: '2x － 4', wrongs: ['2x ＋ 4', 'x/2 － 4', '2 · (x ＋ 4)'] },
    { text: 'Το μισό ενός αριθμού αυξημένο κατά 7', expr: 'x/2 ＋ 7', wrongs: ['2x ＋ 7', 'x/7 ＋ 2', '2 · (x － 7)'] },
    { text: 'Το τετραπλάσιο ενός αριθμού αυξημένο κατά 2', expr: '4x ＋ 2', wrongs: ['4x － 2', 'x/4 ＋ 2', '4 · (x ＋ 2)'] },
    { text: 'Το πενταπλάσιο ενός αριθμού ελαττωμένο κατά 3', expr: '5x － 3', wrongs: ['5x ＋ 3', 'x/5 － 3', '5 · (x ＋ 3)'] }
  ];
  const q3Item = q3Pool[randInt(0, q3Pool.length - 1)];
  const q3Options = shuffle([...new Set([q3Item.expr, ...q3Item.wrongs])]);

  // Q4: MCQ - Εύρεση της τιμής του x ώστε η παράσταση να έχει συγκεκριμένο αποτέλεσμα
  const q4A = randInt(2, 4);
  const q4B = randInt(1, 6);
  const q4X = randInt(2, 6);
  const q4Target = q4A * q4X + q4B;
  const q4Wrongs = [String(q4X + 1), String(Math.max(1, q4X - 1)), String(q4X + 2)];
  const q4Options = shuffle([...new Set([String(q4X), ...q4Wrongs])]);

  // Q5: True/False - Η έννοια της παράλειψης του συμβόλου του πολλαπλασιασμού
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στην άλγεβρα, η έκφραση 3x σημαίνει 3 · x (δηλαδή 3 φορές το x).'
    : 'Στην άλγεβρα, η έκφραση 3x σημαίνει 3 ＋ x.';

  // Q6: True/False - Η έννοια της μεταβλητής
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Μια μεταβλητή (όπως το x) μπορεί να πάρει διάφορες αριθμητικές τιμές.'
    : 'Μια μεταβλητή (όπως το x) έχει πάντοτε την ίδια ακριβώς σταθερή τιμή και δεν αλλάζει ποτέ.';

  // Q7: Input - Παράσταση με δύο μεταβλητές: 2x + 3y
  const q7X = randInt(2, 5);
  const q7Y = randInt(1, 4);
  const q7Res = 2 * q7X + 3 * q7Y;

  // Q8: MCQ - Πράξη με αντικατάσταση
  const q8X = randInt(3, 6);
  const q8A = randInt(3, 5);
  const q8Res = q8A * q8X;
  const q8Options = shuffle([...new Set([String(q8Res), String(q8Res + 2), String(q8Res - 3), String(q8Res + 5)])]);

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
      title: 'Υπολογισμός Τιμής',
      prompt: `Υπολόγισε την αριθμητική τιμή της παράστασης ${q1A}x ＋ ${q1B} για x ＝ ${q1X}:`,
      correct: String(q1Res),
      explain: `Αντικαθιστούμε το x με το ${q1X}: ${q1A} · ${q1X} ＋ ${q1B} ＝ ${q1A * q1X} ＋ ${q1B} ＝ ${q1Res}.`
    },
    {
      id: 'q2',
      type: 'input',
      title: 'Παράσταση με Αφαίρεση',
      prompt: `Υπολόγισε την τιμή της παράστασης ${q2A}x － ${q2B} για x ＝ ${q2X}:`,
      correct: String(q2Res),
      explain: `Αντικαθιστούμε το x με το ${q2X}: ${q2A} · ${q2X} － ${q2B} ＝ ${q2A * q2X} － ${q2B} ＝ ${q2Res}.`
    },
    {
      id: 'q3',
      type: 'mcq',
      title: 'Λεκτική σε Αλγεβρική Έκφραση',
      prompt: `Ποια αλγεβρική παράσταση εκφράζει τη φράση: «${q3Item.text}»;`,
      options: q3Options,
      correct: q3Item.expr,
      explain: `Η φράση «${q3Item.text}» αντιστοιχεί ακριβώς στην παράσταση ${q3Item.expr}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Εύρεση Μεταβλητής',
      prompt: `Για ποια τιμή του x η παράσταση ${q4A}x ＋ ${q4B} ισούται με ${q4Target};`,
      options: q4Options,
      correct: String(q4X),
      explain: `Για x ＝ ${q4X}, έχουμε: ${q4A} · ${q4X} ＋ ${q4B} ＝ ${q4A * q4X} ＋ ${q4B} ＝ ${q4Target}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Συμβολισμός Πολλαπλασιασμού',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Όταν ένας αριθμός βρίσκεται ακριβώς δίπλα σε ένα γράμμα (π.χ. 3x), εννοείται πολλαπλασιασμός.'
        : 'Λάθος! Το 3x σημαίνει 3 · x (πολλαπλασιασμός), όχι πρόσθεση.'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Ορισμός Μεταβλητής',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Η μεταβλητή ονομάζεται έτσι επειδή η τιμή της μπορεί να μεταβάλλεται (να αλλάζει).'
        : 'Λάθος! Μια μεταβλητή μπορεί να πάρει πολλές διαφορετικές τιμές.'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Δύο Μεταβλητές',
      prompt: `Υπολόγισε την τιμή της παράστασης 2x ＋ 3y όταν x ＝ ${q7X} και y ＝ ${q7Y}:`,
      correct: String(q7Res),
      explain: `Αντικαθιστούμε: 2 · ${q7X} ＋ 3 · ${q7Y} ＝ ${2 * q7X} ＋ ${3 * q7Y} ＝ ${q7Res}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Απλό Γινόμενο Μεταβλητής',
      prompt: `Ποια είναι η τιμή της παράστασης ${q8A}x όταν x ＝ ${q8X};`,
      options: q8Options,
      correct: String(q8Res),
      explain: `Υπολογίζουμε: ${q8A} · ${q8X} ＝ ${q8Res}.`
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

export default function MetablitiExercisesPage() {
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
      const cleanUser = userVal.replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\s+/g, '').trim().toLowerCase();
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
      title="Ασκήσεις: Η Έννοια της Μεταβλητής - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην έννοια της μεταβλητής και τις αλγεβρικές παραστάσεις για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/32-metabliti"
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
                <span>ΚΕΦΑΛΑΙΟ 32 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Η Έννοια της Μεταβλητής
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον υπολογισμό αριθμητικής τιμής, στη μετάφραση λεκτικών εκφράσεων σε παραστάσεις με x και στα αλγεβρικά προβλήματα!
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
                          placeholder="Γράψε το αποτέλεσμα..."
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

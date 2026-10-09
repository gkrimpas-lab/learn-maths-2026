// pages/st-dimotikou/33-agnostos-kai-prosthesi-ask.js
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
    title: 'Χαρτζιλίκι από τον Παππού',
    unit: 'ευρώ',
    generate: () => {
      // x + 15 = 42 -> x = 27
      const add = 15;
      const total = 42;
      const x = total - add;
      return {
        prompt: `Ο Νίκος είχε ένα χρηματικό ποσό (x). Ο παππούς του τού έδωσε ακόμη ${add}€ και τώρα έχει συνολικά ${total}€. Πόσα ευρώ είχε αρχικά ο Νίκος;`,
        unit: 'ευρώ',
        correctVal: String(x),
        correctText: `${x}€`,
        tableData: [
          { item: 'Εξίσωση προβλήματος', formula: `x ＋ ${add} ＝ ${total}`, val: `x ＝ ${total} － ${add}` },
          { item: 'Αφαίρεση', formula: `${total} － ${add}`, val: `${x}€` }
        ],
        explain: `Σχηματίζουμε την εξίσωση: x ＋ ${add} ＝ ${total}. Για να βρούμε το x, αφαιρούμε: x ＝ ${total} － ${add} ＝ ${x}€.`,
        distractors: [`${x + 5}€`, `${x - 4}€`, `${total + add}€`]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Σελίδες Βιβλίου',
    unit: 'σελίδες',
    generate: () => {
      // x + 28 = 75 -> x = 47
      const add = 28;
      const total = 75;
      const x = total - add;
      return {
        prompt: `Η Μαρία διάβασε ένα μέρος ενός βιβλίου (x) το πρωί και το απόγευμα διάβασε άλλες ${add} σελίδες. Αν συνολικά διάβασε ${total} σελίδες, πόσες σελίδες είχε διαβάσει το πρωί;`,
        unit: 'σελίδες',
        correctVal: String(x),
        correctText: `${x} σελίδες`,
        tableData: [
          { item: 'Εξίσωση', formula: `x ＋ ${add} ＝ ${total}`, val: `x ＝ ${total} － ${add}` },
          { item: 'Υπολογισμός', formula: `${total} － ${add}`, val: `${x} σελίδες` }
        ],
        explain: `Λύνουμε την εξίσωση πρόσθεσης x ＋ ${add} ＝ ${total}: x ＝ ${total} － ${add} ＝ ${x} σελίδες.`,
        distractors: [`${x + 6} σελίδες`, `${x - 5} σελίδες`, `${total + add} σελίδες`]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Βάρος Κιβωτίου με Φρούτα',
    unit: 'κιλά',
    generate: () => {
      // x + 12 = 35 -> x = 23
      const add = 12;
      const total = 35;
      const x = total - add;
      return {
        prompt: `Ένα κιβώτιο γεμάτο με μήλα ζυγίζει συνολικά ${total} κιλά. Αν τα μήλα μόνα τους ζυγίζουν ${add} κιλά, πόσα κιλά ζυγίζει το άδειο κιβώτιο (x);`,
        unit: 'κιλά',
        correctVal: String(x),
        correctText: `${x} κιλά`,
        tableData: [
          { item: 'Σχέση βάρους', formula: `x ＋ ${add} ＝ ${total}`, val: `x ＝ ${total} － ${add}` },
          { item: 'Βάρος κιβωτίου', formula: `${total} － ${add}`, val: `${x} κιλά` }
        ],
        explain: `Το βάρος του κιβωτίου συν τα μήλα δίνει το μεικτό βάρος: x ＋ ${add} ＝ ${total} ➔ x ＝ ${total} － ${add} ＝ ${x} κιλά.`,
        distractors: [`${x + 3} κιλά`, `${x - 3} κιλά`, `${total + add} κιλά`]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Μαθητές σε Σχολικό Λεωφορείο',
    unit: 'μαθητές',
    generate: () => {
      // x + 14 = 48 -> x = 34
      const add = 14;
      const total = 48;
      const x = total - add;
      return {
        prompt: `Σε ένα σχολικό λεωφορείο επέβαιναν μαθητές (x). Στην πρώτη στάση επιβιβάστηκαν ακόμη ${add} μαθητές και τώρα βρίσκονται μέσα ${total} μαθητές. Πόσοι μαθητές βρίσκονταν αρχικά στο λεωφορείο;`,
        unit: 'μαθητές',
        correctVal: String(x),
        correctText: `${x} μαθητές`,
        tableData: [
          { item: 'Εξίσωση επιβατών', formula: `x ＋ ${add} ＝ ${total}`, val: `x ＝ ${total} － ${add}` },
          { item: 'Αρχικοί μαθητές', formula: `${total} － ${add}`, val: `${x}` }
        ],
        explain: `Η εξίσωση είναι x ＋ ${add} ＝ ${total}. Βρίσκουμε τον άγνωστο προσθετέο: x ＝ ${total} － ${add} ＝ ${x} μαθητές.`,
        distractors: [`${x + 4} μαθητές`, `${x - 4} μαθητές`, `${total + add} μαθητές`]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Πόντοι Αγώνα Μπάσκετ',
    unit: 'πόντοι',
    generate: () => {
      // x + 34 = 78 -> x = 44
      const add = 34;
      const total = 78;
      const x = total - add;
      return {
        prompt: `Σε έναν αγώνα μπάσκετ η ομάδα πέτυχε κάποιους πόντους στο πρώτο ημίχρονο (x) και στο δεύτερο ημίχρονο πρόσθεσε άλλους ${add} πόντους, φτάνοντας συνολικά τους ${total} πόντους. Πόσους πόντους είχε πετύχει στο πρώτο ημίχρονο;`,
        unit: 'πόντοι',
        correctVal: String(x),
        correctText: `${x} πόντοι`,
        tableData: [
          { item: 'Εξίσωση πόντων', formula: `x ＋ ${add} ＝ ${total}`, val: `x ＝ ${total} － ${add}` },
          { item: 'Πόντοι 1ου ημιχρόνου', formula: `${total} － ${add}`, val: `${x}` }
        ],
        explain: `x ＋ ${add} ＝ ${total} ➔ x ＝ ${total} － ${add} ＝ ${x} πόντοι.`,
        distractors: [`${x + 6} πόντοι`, `${x - 6} πόντοι`, `${total + add} πόντοι`]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Συλλογή Αυτοκόλλητων',
    unit: 'αυτοκόλλητα',
    generate: () => {
      // x + 19 = 63 -> x = 44
      const add = 19;
      const total = 63;
      const x = total - add;
      return {
        prompt: `Ο Γιώργος είχε μια συλλογή με αυτοκόλλητα (x). Η φίλη του τού χάρισε ακόμη ${add} αυτοκόλλητα και η συλλογή του έφτασε τα ${total}. Πόσα αυτοκόλλητα είχε αρχικά ο Γιώργος;`,
        unit: 'αυτοκόλλητα',
        correctVal: String(x),
        correctText: `${x} αυτοκόλλητα`,
        tableData: [
          { item: 'Εξίσωση συλλογής', formula: `x ＋ ${add} ＝ ${total}`, val: `x ＝ ${total} － ${add}` },
          { item: 'Αρχικά αυτοκόλλητα', formula: `${total} － ${add}`, val: `${x}` }
        ],
        explain: `Υπολογίζουμε: x ＝ ${total} － ${add} ＝ ${x} αυτοκόλλητα.`,
        distractors: [`${x + 5} αυτοκόλλητα`, `${x - 5} αυτοκόλλητα`, `${total + add} αυτοκόλλητα`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Περίμετρος Τριγώνου με Άγνωστη Πλευρά',
    unit: 'εκ.',
    generate: () => {
      // x + 7 + 9 = 24 -> x + 16 = 24 -> x = 8
      const a = 7;
      const b = 9;
      const sumKnown = a + b;
      const totalP = 24;
      const x = totalP - sumKnown;
      return {
        prompt: `Η περίμετρος ενός τριγώνου είναι ${totalP} εκατοστά. Οι δύο γνωστές πλευρές του έχουν μήκος ${a} εκ. και ${b} εκ. αντίστοιχα. Πόσα εκατοστά είναι η τρίτη πλευρά (x);`,
        unit: 'εκ.',
        correctVal: String(x),
        correctText: `${x} εκ.`,
        tableData: [
          { item: 'Άθροισμα γνωστών πλευρών', formula: `${a} ＋ ${b}`, val: `${sumKnown} εκ.` },
          { item: 'Εξίσωση περιμέτρου', formula: `x ＋ ${sumKnown} ＝ ${totalP}`, val: `x ＝ ${totalP} － ${sumKnown}` },
          { item: 'Μήκος τρίτης πλευράς', formula: `${totalP} － ${sumKnown}`, val: `${x} εκ.` }
        ],
        explain: `Η περίμετρος είναι το άθροισμα των τριών πλευρών: x ＋ ${a} ＋ ${b} ＝ ${totalP} ➔ x ＋ ${sumKnown} ＝ ${totalP} ➔ x ＝ ${totalP} － ${sumKnown} ＝ ${x} εκ.`,
        distractors: [`${x + 2} εκ.`, `${x - 2} εκ.`, `${sumKnown} εκ.`]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Εξίσωση με Ετερώνυμα Κλάσματα',
    unit: '',
    generate: () => {
      // x + 1/3 = 5/6 -> x = 5/6 - 2/6 = 3/6 = 1/2
      return {
        prompt: 'Λύσε την εξίσωση με τα ετερώνυμα κλάσματα: x ＋ 1/3 ＝ 5/6:',
        unit: '',
        correctVal: '1/2',
        correctText: '1/2 (ή 3/6)',
        tableData: [
          { item: 'Εξίσωση', formula: 'x ＋ 1/3 ＝ 5/6', val: 'x ＝ 5/6 － 1/3' },
          { item: 'Μετατροπή σε ομώνυμα', formula: '5/6 － 2/6', val: '3/6' },
          { item: 'Απλοποίηση', formula: '3/6 (: 3)', val: '1/2' }
        ],
        explain: 'x ＝ 5/6 － 1/3 ＝ 5/6 － 2/6 ＝ 3/6 ＝ 1/2.',
        distractors: ['2/3', '1/3', '4/6']
      };
    }
  },
  {
    id: 'hp3',
    title: 'Σύνθετο Πρόβλημα Αγορών & Ρέστα',
    unit: '€',
    generate: () => {
      // (x + 18) + 12 = 50 -> x + 30 = 50 -> x = 20
      const paid = 50;
      const itemBook = 18;
      const change = 12;
      const spentTotal = paid - change; // 38
      const x = spentTotal - itemBook; // 20
      return {
        prompt: `Ο Ανδρέας αγόρασε ένα βιβλίο αξίας ${itemBook}€ και ένα παιχνίδι (x). Πλήρωσε με χαρτονόμισμα των ${paid}€ και πήρε ρέστα ${change}€. Πόσα ευρώ κόστιζε το παιχνίδι;`,
        unit: '€',
        correctVal: String(x),
        correctText: `${x}€`,
        tableData: [
          { item: 'Συνολικό κόστος αγορών', formula: `${paid} － ${change}`, val: `${spentTotal}€` },
          { item: 'Εξίσωση δαπάνης', formula: `x ＋ ${itemBook} ＝ ${spentTotal}`, val: `x ＝ ${spentTotal} － ${itemBook}` },
          { item: 'Κόστος παιχνιδιού', formula: `${spentTotal} － ${itemBook}`, val: `${x}€` }
        ],
        explain: `Το συνολικό ποσό που ξόδεψε είναι ${paid} － ${change} ＝ ${spentTotal}€. Επομένως x ＋ ${itemBook} ＝ ${spentTotal} ➔ x ＝ ${spentTotal} － ${itemBook} ＝ ${x}€.`,
        distractors: [`${x + 4}€`, `${x - 4}€`, `${spentTotal}€`]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Εξίσωση με Δεκαδικούς Αριθμούς',
    unit: '',
    generate: () => {
      // x + 14,75 = 32,5 -> x = 17,75
      const a = 14.75;
      const total = 32.5;
      const x = total - a;
      const aStr = a.toFixed(2).replace('.', ',');
      const totalStr = total.toFixed(2).replace('.', ',');
      const xStr = x.toFixed(2).replace('.', ',');
      return {
        prompt: `Λύσε την εξίσωση με τους δεκαδικούς αριθμούς: x ＋ ${aStr} ＝ ${totalStr}:`,
        unit: '',
        correctVal: xStr,
        correctText: xStr,
        tableData: [
          { item: 'Εξίσωση', formula: `x ＋ ${aStr} ＝ ${totalStr}`, val: `x ＝ ${totalStr} － ${aStr}` },
          { item: 'Αφαίρεση δεκαδικών', formula: `${totalStr} － ${aStr}`, val: `${xStr}` }
        ],
        explain: `x ＝ ${totalStr} － ${aStr} ＝ ${xStr}.`,
        distractors: [
          (x + 1).toFixed(2).replace('.', ','),
          (x - 1).toFixed(2).replace('.', ','),
          (total + a).toFixed(2).replace('.', ',')
        ]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Άθροισμα Τριών Αριθμών με Μεταβλητή',
    unit: '',
    generate: () => {
      // 15 + x + 25 = 70 -> x + 40 = 70 -> x = 30
      const a = 15;
      const b = 25;
      const sumKnown = a + b;
      const total = 70;
      const x = total - sumKnown;
      return {
        prompt: `Στην ισότητα ${a} ＋ x ＋ ${b} ＝ ${total}, ποια είναι η τιμή του άγνωστου προσθετέου x;`,
        unit: '',
        correctVal: String(x),
        correctText: `x ＝ ${x}`,
        tableData: [
          { item: 'Άθροισμα γνωστών όρων', formula: `${a} ＋ ${b}`, val: `${sumKnown}` },
          { item: 'Εξίσωση', formula: `x ＋ ${sumKnown} ＝ ${total}`, val: `x ＝ ${total} － ${sumKnown}` },
          { item: 'Υπολογισμός x', formula: `${total} － ${sumKnown}`, val: `${x}` }
        ],
        explain: `Προσθέτουμε πρώτα τους γνωστούς όρους: ${a} ＋ ${b} ＝ ${sumKnown}. Η εξίσωση γίνεται x ＋ ${sumKnown} ＝ ${total} ➔ x ＝ ${total} － ${sumKnown} ＝ ${x}.`,
        distractors: [`x ＝ ${x + 5}`, `x ＝ ${x - 5}`, `x ＝ ${sumKnown}`]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Συμπλήρωση μέχρι τον Επόμενο Ακέραιο',
    unit: '',
    generate: () => {
      // x + 3/7 = 2 -> x = 2 - 3/7 = 14/7 - 3/7 = 11/7
      return {
        prompt: 'Λύσε την εξίσωση όπου το άθροισμα είναι ακέραιος αριθμός: x ＋ 3/7 ＝ 2:',
        unit: '',
        correctVal: '11/7',
        correctText: '11/7 (ή 1 και 4/7)',
        tableData: [
          { item: 'Ακέραιος σε έβδομα', formula: '2 ＝ 14/7', val: '14/7' },
          { item: 'Εξίσωση', formula: 'x ＋ 3/7 ＝ 14/7', val: 'x ＝ 14/7 － 3/7' },
          { item: 'Λύση', formula: '14/7 － 3/7', val: '11/7' }
        ],
        explain: 'Γράφουμε τον ακέραιο 2 ως κλάσμα με παρονομαστή 7: 2 ＝ 14/7. Επομένως x ＝ 14/7 － 3/7 ＝ 11/7.',
        distractors: ['4/7', '1', '10/7']
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Βασική εξίσωση x + a = b με φυσικούς αριθμούς
  const q1A = randInt(14, 48);
  const q1X = randInt(15, 55);
  const q1B = q1X + q1A;

  // Q2: Input - Εξίσωση a + x = b με φυσικούς αριθμούς
  const q2A = randInt(35, 120);
  const q2X = randInt(25, 90);
  const q2B = q2A + q2X;

  // Q3: Input - Εξίσωση με δεκαδικούς αριθμούς: x + a = b
  const q3A_raw = randInt(12, 85) / 10;
  const q3X_raw = randInt(15, 65) / 10;
  const q3B_raw = Number((q3X_raw + q3A_raw).toFixed(1));
  const q3A = q3A_raw.toFixed(1).replace('.', ',');
  const q3B = q3B_raw.toFixed(1).replace('.', ',');
  const q3Correct = q3X_raw.toFixed(1).replace('.', ',');

  // Q4: MCQ - Επιλογή του σωστού βήματος επίλυσης για την εξίσωση x + a = b
  const q4A = randInt(15, 45);
  const q4B = q4A + randInt(10, 30);
  const q4CorrectStep = `x ＝ ${q4B} － ${q4A}`;
  const q4Wrongs = [
    `x ＝ ${q4B} ＋ ${q4A}`,
    `x ＝ ${q4A} － ${q4B}`,
    `x ＝ ${q4B} : ${q4A}`
  ];
  const q4Options = shuffle([...new Set([q4CorrectStep, ...q4Wrongs])]);

  // Q5: True / False - Κανόνας εύρεσης άγνωστου προσθετέου
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Για να βρούμε τον άγνωστο προσθετέο σε μια εξίσωση πρόσθεσης, αφαιρούμε τον γνωστό προσθετέο από το άθροισμα (x ＝ β － α).'
    : 'Για να βρούμε τον άγνωστο προσθετέο σε μια εξίσωση πρόσθεσης, προσθέτουμε τον γνωστό προσθετέο στο άθροισμα (x ＝ β ＋ α).';

  // Q6: True / False - Ιδιότητα μετάθεσης στην πρόσθεση (x + a = a + x)
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Η εξίσωση x ＋ 12 ＝ 30 λύνεται με τον ίδιο ακριβώς τρόπο όπως η εξίσωση 12 ＋ x ＝ 30.'
    : 'Στην εξίσωση 12 ＋ x ＝ 30 δεν μπορούμε να κάνουμε αφαίρεση επειδή το x είναι δεύτερος προσθετέος.';

  // Q7: Input - Εξίσωση με ομώνυμα κλάσματα: x + n1/d = n2/d
  const q7Den = randInt(5, 12);
  const q7N1 = randInt(1, Math.floor((q7Den - 1) / 2));
  const q7N2 = randInt(q7N1 + 2, q7Den);
  const q7DiffN = q7N2 - q7N1;
  const q7G = gcd(q7DiffN, q7Den);
  const q7CorrectRaw = `${q7DiffN}/${q7Den}`;
  const q7CorrectSimp = q7G > 1 ? `${q7DiffN / q7G}/${q7Den / q7G}` : q7CorrectRaw;

  // Q8: MCQ - Επαλήθευση εξίσωσης
  const q8A = randInt(12, 25);
  const q8B = randInt(35, 55);
  const q8CorrectX = q8B - q8A;
  const q8Options = shuffle([...new Set([String(q8CorrectX), String(q8CorrectX + 3), String(q8CorrectX - 3), String(q8B + q8A)])]);

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
      title: 'Εξίσωση: x ＋ α ＝ β',
      prompt: `Λύσε την εξίσωση: x ＋ ${q1A} ＝ ${q1B}`,
      correct: String(q1X),
      explain: `x ＝ ${q1B} － ${q1A} ＝ ${q1X}.`
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: 'Εξίσωση: α ＋ x ＝ β',
      prompt: `Λύσε την εξίσωση: ${q2A} ＋ x ＝ ${q2B}`,
      correct: String(q2X),
      explain: `x ＝ ${q2B} － ${q2A} ＝ ${q2X}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: 'Δεκαδικοί Αριθμοί',
      prompt: `Λύσε την εξίσωση: x ＋ ${q3A} ＝ ${q3B}`,
      correct: q3Correct,
      explain: `x ＝ ${q3B} － ${q3A} ＝ ${q3Correct}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Σωστό Βήμα Επίλυσης',
      prompt: `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση x ＋ ${q4A} ＝ ${q4B};`,
      options: q4Options,
      correct: q4CorrectStep,
      explain: `Για να βρούμε τον άγνωστο προσθετέο x, κάνουμε αφαίρεση: ${q4CorrectStep}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Κανόνας Προσθετέου',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Η αντίστροφη πράξη της πρόσθεσης είναι η αφαίρεση: x ＝ β － α.'
        : 'Λάθος! Για να απομονώσουμε το x κάνουμε αφαίρεση (x ＝ β － α), όχι πρόσθεση.'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Θέση του Αγνώστου',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Λόγω της αντιμεταθετικής ιδιότητας, είτε το x είναι 1ος είτε 2ος προσθετέος, λύνεται πάντα με αφαίρεση: x ＝ β － α.'
        : 'Λάθος! Και στις δύο περιπτώσεις ο άγνωστος είναι προσθετέος και υπολογίζεται με αφαίρεση.'
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'fraction',
      title: 'Εξίσωση με Κλάσματα',
      prompt: `Λύσε την εξίσωση: x ＋ ${q7N1}/${q7Den} ＝ ${q7N2}/${q7Den} (π.χ. 3/7):`,
      correct: q7CorrectRaw,
      altCorrect: q7CorrectSimp,
      explain: `x ＝ ${q7N2}/${q7Den} － ${q7N1}/${q7Den} ＝ (${q7N2} － ${q7N1})/${q7Den} ＝ ${q7CorrectRaw}${q7G > 1 ? ` (ή ανάγωγο: ${q7CorrectSimp})` : ''}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Επαλήθευση Εξίσωσης',
      prompt: `Στην εξίσωση x ＋ ${q8A} ＝ ${q8B}, ποια τιμή του x επαληθεύει την ισότητα;`,
      options: q8Options,
      correct: String(q8CorrectX),
      explain: `Αντικαθιστούμε x ＝ ${q8CorrectX}: ${q8CorrectX} ＋ ${q8A} ＝ ${q8B} (Σωστό ✔️).`
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

export default function AgnostosKaiProsthesiExercisesPage() {
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
      const q = questions.find(item => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        sanitized = sanitized.replace(/\./g, ',').replace(/[^0-9,]/g, '');
        const parts = sanitized.split(',');
        if (parts.length > 2) sanitized = parts[0] + ',' + parts.slice(1).join('');
      } else if (q?.inputType === 'fraction') {
        sanitized = sanitized.replace(/[^0-9/]/g, '');
        const parts = sanitized.split('/');
        if (parts.length > 2) sanitized = parts[0] + '/' + parts.slice(1).join('');
      }
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
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase() : null;

      if (cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt)) return true;

      // Για δεκαδικούς αριθμούς (Q3)
      if (q.inputType === 'decimal') {
        const numUser = parseFloat(cleanUser.replace(',', '.'));
        const numTarget = parseFloat(cleanTarget.replace(',', '.'));
        return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) < 0.05;
      }
      return false;
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
      title="Ασκήσεις: Άγνωστος Προσθετέος - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση εξισώσεων πρόσθεσης για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/33-agnostos-kai-prosthesi"
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
                <span>ΚΕΦΑΛΑΙΟ 33 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Άγνωστος Προσθετέος (x ＋ α ＝ β)
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην επίλυση εξισώσεων πρόσθεσης με φυσικούς αριθμούς, δεκαδικούς, κλάσματα και προβλήματα καθημερινότητας!
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
                          inputMode={q.inputType === 'fraction' ? 'text' : q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.inputType === 'fraction' ? 'π.χ. 3/7' : q.inputType === 'decimal' ? 'π.χ. 2,5' : 'Απάντηση...'}
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

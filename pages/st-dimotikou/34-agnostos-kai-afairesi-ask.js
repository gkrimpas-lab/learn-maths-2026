// pages/st-dimotikou/34-agnostos-kai-afairesi-ask.js
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
    title: 'Ανάγνωση Σελίδων Βιβλίου',
    unit: 'σελίδες',
    generate: () => {
      // x - 35 = 90 -> x = 125
      const sub = 35;
      const rem = 90;
      const total = sub + rem;
      return {
        prompt: `Ένα μυθιστόρημα έχει συνολικά x σελίδες. Η Ελένη διάβασε ${sub} σελίδες και της έμειναν ${rem} σελίδες αδιάβαστες. Πόσες σελίδες έχει συνολικά το μυθιστόρημα;`,
        unit: 'σελίδες',
        correctVal: String(total),
        correctText: `${total} σελίδες`,
        tableData: [
          { item: 'Σελίδες που διαβάστηκαν', formula: `${sub}`, val: `${sub}` },
          { item: 'Σελίδες που έμειναν', formula: `${rem}`, val: `${rem}` },
          { item: 'Εξίσωση (x － α ＝ β)', formula: `x － ${sub} ＝ ${rem}`, val: `x ＝ ${rem} ＋ ${sub} ＝ ${total}` }
        ],
        explain: `Σχηματίζουμε την εξίσωση αφαίρεσης: x － ${sub} ＝ ${rem}. Για να βρούμε τον άγνωστο μειωτέο x, κάνουμε πρόσθεση: x ＝ ${rem} ＋ ${sub} ＝ ${total} σελίδες.`,
        distractors: [`${total - 10} σελίδες`, `${total + 15} σελίδες`, `${rem - sub} σελίδες`]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Μαθητές στην Αυλή του Σχολείου',
    unit: 'μαθητές',
    generate: () => {
      // x - 24 = 36 -> x = 60
      const sub = 24;
      const rem = 36;
      const total = sub + rem;
      return {
        prompt: `Στην αυλή βρίσκονταν x μαθητές. Μπήκαν στις τάξεις ${sub} μαθητές και στην αυλή έμειναν ${rem} μαθητές. Πόσοι μαθητές βρίσκονταν αρχικά στην αυλή;`,
        unit: 'μαθητές',
        correctVal: String(total),
        correctText: `${total} μαθητές`,
        tableData: [
          { item: 'Μαθητές που έφυγαν', formula: `${sub}`, val: `${sub}` },
          { item: 'Μαθητές που έμειναν', formula: `${rem}`, val: `${rem}` },
          { item: 'Εξίσωση', formula: `x － ${sub} ＝ ${rem}`, val: `x ＝ ${rem} ＋ ${sub} ＝ ${total}` }
        ],
        explain: `Η εξίσωση είναι x － ${sub} ＝ ${rem}. Βρίσκουμε τον μειωτέο με πρόσθεση: x ＝ ${rem} ＋ ${sub} ＝ ${total} μαθητές.`,
        distractors: [`${total + 10} μαθητές`, `${total - 6} μαθητές`, `${rem - sub} μαθητές`]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Χρήση Αλευριού από Σακί',
    unit: 'κιλά',
    generate: () => {
      // x - 18 = 32 -> x = 50
      const sub = 18;
      const rem = 32;
      const total = sub + rem;
      return {
        prompt: `Ένα σακί περιείχε x κιλά αλεύρι. Χρησιμοποιήσαμε για ψωμί ${sub} κιλά και στο σακί έμειναν ${rem} κιλά. Πόσα κιλά αλεύρι είχε αρχικά το σακί;`,
        unit: 'κιλά',
        correctVal: String(total),
        correctText: `${total} κιλά`,
        tableData: [
          { item: 'Αλεύρι που χρησιμοποιήθηκε', formula: `${sub} κιλά`, val: `${sub}` },
          { item: 'Αλεύρι που έμεινε', formula: `${rem} κιλά`, val: `${rem}` },
          { item: 'Εξίσωση', formula: `x － ${sub} ＝ ${rem}`, val: `x ＝ ${rem} ＋ ${sub} ＝ ${total}` }
        ],
        explain: `x － ${sub} ＝ ${rem} ➔ x ＝ ${rem} ＋ ${sub} ＝ ${total} κιλά.`,
        distractors: [`${total + 5} κιλά`, `${total - 5} κιλά`, `${rem - sub} κιλά`]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Αγορά Βιβλίου και Υπόλοιπο Χρημάτων',
    unit: 'ευρώ',
    generate: () => {
      // x - 25 = 45 -> x = 70
      const sub = 25;
      const rem = 45;
      const total = sub + rem;
      return {
        prompt: `Ο Πέτρος είχε ένα χρηματικό ποσό x. Αγόρασε ένα βιβλίο που κόστιζε ${sub} ευρώ και του έμειναν ${rem} ευρώ. Πόσα χρήματα είχε αρχικά ο Πέτρος;`,
        unit: 'ευρώ',
        correctVal: String(total),
        correctText: `${total} ευρώ`,
        tableData: [
          { item: 'Κόστος βιβλίου', formula: `${sub} €`, val: `${sub}` },
          { item: 'Ρέστα που έμειναν', formula: `${rem} €`, val: `${rem}` },
          { item: 'Αρχικό ποσό', formula: `${rem} ＋ ${sub}`, val: `${total} €` }
        ],
        explain: `x － ${sub} ＝ ${rem} ➔ x ＝ ${rem} ＋ ${sub} ＝ ${total} ευρώ.`,
        distractors: [`${total + 10} ευρώ`, `${total - 10} ευρώ`, `${rem - sub} ευρώ`]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Κατανάλωση Βενζίνης σε Αυτοκίνητο',
    unit: 'λίτρα',
    generate: () => {
      // x - 20 = 25 -> x = 45
      const sub = 20;
      const rem = 25;
      const total = sub + rem;
      return {
        prompt: `Το ρεζερβουάρ ενός αυτοκινήτου είχε x λίτρα βενζίνη. Κατά τη διάρκεια ενός ταξιδιού καταναλώθηκαν ${sub} λίτρα και στο ρεζερβουάρ έμειναν ${rem} λίτρα. Πόσα λίτρα βενζίνη είχε αρχικά;`,
        unit: 'λίτρα',
        correctVal: String(total),
        correctText: `${total} λίτρα`,
        tableData: [
          { item: 'Κατανάλωση', formula: `${sub} λ.`, val: `${sub}` },
          { item: 'Υπόλοιπο', formula: `${rem} λ.`, val: `${rem}` },
          { item: 'Αρχική ποσότητα', formula: `${rem} ＋ ${sub}`, val: `${total} λ.` }
        ],
        explain: `x － ${sub} ＝ ${rem} ➔ x ＝ ${rem} ＋ ${sub} ＝ ${total} λίτρα.`,
        distractors: [`${total + 5} λίτρα`, `${total - 5} λίτρα`, `${rem - sub} λίτρα`]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Αφαίρεση Μήκους από Σχοινί',
    unit: 'μέτρα',
    generate: () => {
      // x - 12 = 38 -> x = 50
      const sub = 12;
      const rem = 38;
      const total = sub + rem;
      return {
        prompt: `Ένα σχοινί είχε αρχικό μήκος x μέτρα. Κόψαμε ένα κομμάτι μήκους ${sub} μέτρων και το υπόλοιπο τμήμα έχει μήκος ${rem} μέτρα. Πόσο ήταν το αρχικό μήκος του σχοινιού;`,
        unit: 'μέτρα',
        correctVal: String(total),
        correctText: `${total} μέτρα`,
        tableData: [
          { item: 'Κομμάτι που κόπηκε', formula: `${sub} μ.`, val: `${sub}` },
          { item: 'Υπόλοιπο σχοινί', formula: `${rem} μ.`, val: `${rem}` },
          { item: 'Αρχικό μήκος', formula: `${rem} ＋ ${sub}`, val: `${total} μ.` }
        ],
        explain: `x － ${sub} ＝ ${rem} ➔ x ＝ ${rem} ＋ ${sub} ＝ ${total} μέτρα.`,
        distractors: [`${total + 10} μέτρα`, `${total - 8} μέτρα`, `${rem - sub} μέτρα`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Εξίσωση με Δεκαδικό Μειωτέο',
    unit: '',
    generate: () => {
      // x - 3,5 = 4,2 -> x = 7,7
      const a = 3.5;
      const b = 4.2;
      const x = Number((a + b).toFixed(1));
      const aStr = a.toFixed(1).replace('.', ',');
      const bStr = b.toFixed(1).replace('.', ',');
      const xStr = x.toFixed(1).replace('.', ',');
      return {
        prompt: `Λύσε την εξίσωση με δεκαδικούς αριθμούς: x － ${aStr} ＝ ${bStr}:`,
        unit: '',
        correctVal: xStr,
        correctText: xStr,
        tableData: [
          { item: 'Εξίσωση', formula: `x － ${aStr} ＝ ${bStr}`, val: `x ＝ ${bStr} ＋ ${aStr}` },
          { item: 'Πρόσθεση δεκαδικών', formula: `${bStr} ＋ ${aStr}`, val: `${xStr}` }
        ],
        explain: `x ＝ ${bStr} ＋ ${aStr} ＝ ${xStr}.`,
        distractors: ['0,7', (x + 1).toFixed(1).replace('.', ','), (x - 0.5).toFixed(1).replace('.', ',')]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Εξίσωση με Κλάσματα (x - 2/5 = 4/5)',
    unit: '',
    generate: () => {
      // x - 2/5 = 4/5 -> x = 6/5
      const den = 5;
      const a = 2;
      const b = 4;
      const xNum = a + b;
      return {
        prompt: 'Λύσε την εξίσωση με ομώνυμα κλάσματα: x － 2/5 ＝ 4/5 (π.χ. 6/5):',
        unit: '',
        correctVal: `${xNum}/${den}`,
        correctText: `${xNum}/${den} (ή 1 και 1/5)`,
        tableData: [
          { item: 'Εξίσωση', formula: 'x － 2/5 ＝ 4/5', val: 'x ＝ 4/5 ＋ 2/5' },
          { item: 'Πρόσθεση αριθμητών', formula: '(4 ＋ 2) / 5', val: `${xNum}/${den}` }
        ],
        explain: 'x ＝ 4/5 ＋ 2/5 ＝ (4 ＋ 2)/5 ＝ 6/5.',
        distractors: ['2/5', '8/5', '1/5']
      };
    }
  },
  {
    id: 'hp3',
    title: 'Σύνθετη Εξίσωση (x － 12) ＋ 8 ＝ 35',
    unit: '',
    generate: () => {
      // (x - 12) + 8 = 35 -> x - 12 = 27 -> x = 39
      const a = 12;
      const add = 8;
      const total = 35;
      const intermediate = total - add; // 27
      const x = intermediate + a; // 39
      return {
        prompt: `Λύσε την εξίσωση: (x － ${a}) ＋ ${add} ＝ ${total}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: 'Πρώτο βήμα (αφαίρεση προσθετέου)', formula: `${total} － ${add}`, val: `x － ${a} ＝ ${intermediate}` },
          { item: 'Δεύτερο βήμα (εύρεση μειωτέου)', formula: `${intermediate} ＋ ${a}`, val: `x ＝ ${x}` }
        ],
        explain: `Πρώτα απλοποιούμε την εξίσωση αφαιρώντας το 8 από το 35: x － ${a} ＝ ${total} － ${add} ＝ ${intermediate}. Έπειτα βρίσκουμε τον μειωτέο με πρόσθεση: x ＝ ${intermediate} ＋ ${a} ＝ ${x}.`,
        distractors: [String(x + 5), String(x - 4), String(total + a)]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Εύρεση Αφαιρετέου από Μειωτέο (15 － x ＝ 9)',
    unit: '',
    generate: () => {
      // 15 - x = 9 -> x = 15 - 9 = 6
      const total = 15;
      const rem = 9;
      const x = total - rem;
      return {
        prompt: `Λύσε την εξίσωση όπου ο άγνωστος είναι αφαιρετέος: ${total} － x ＝ ${rem}:`,
        unit: '',
        correctVal: String(x),
        correctText: `x ＝ ${x}`,
        tableData: [
          { item: 'Ισορροπία αφαίρεσης', formula: `${total} － ${rem}`, val: `${total} － ${rem}` },
          { item: 'Υπολογισμός x', formula: `${total} － ${rem}`, val: `${x}` }
        ],
        explain: `Όταν ο άγνωστος είναι αφαιρετέος, αφαιρούμε τη διαφορά από τον μειωτέο: x ＝ ${total} － ${rem} ＝ ${x}.`,
        distractors: [`x ＝ ${total + rem}`, `x ＝ ${x + 2}`, `x ＝ ${Math.max(1, x - 2)}`]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Πρόβλημα Ηλικίας με Μειωτέο',
    unit: 'έτη',
    generate: () => {
      // x - 5 = 28 -> x = 33
      const sub = 5;
      const rem = 28;
      const x = rem + sub;
      return {
        prompt: `Πριν από ${sub} χρόνια η ηλικία του Νίκου ήταν ${rem} ετών. Πόσων ετών είναι σήμερα ο Νίκος (x);`,
        unit: 'έτη',
        correctVal: String(x),
        correctText: `${x} ετών`,
        tableData: [
          { item: 'Εξίσωση ηλικίας', formula: `x － ${sub} ＝ ${rem}`, val: `x ＝ ${rem} ＋ ${sub}` },
          { item: 'Συνολικά έτη', formula: `${rem} ＋ ${sub}`, val: `${x} ετών` }
        ],
        explain: `Η εξίσωση είναι x － ${sub} ＝ ${rem}. Η σημερινή ηλικία είναι η ηλικία του παρελθόντος συν τα χρόνια που πέρασαν: x ＝ ${rem} ＋ ${sub} ＝ ${x} ετών.`,
        distractors: [`${rem - sub} ετών`, `${x + 3} ετών`, `${x - 2} ετών`]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Εξίσωση με Δύο Πράξεις και Μειωτέο',
    unit: '',
    generate: () => {
      // (x - 4) * 2 = 16 -> x - 4 = 8 -> x = 12
      const sub = 4;
      const mult = 2;
      const val = 16;
      const inter = val / mult; // 8
      const x = inter + sub; // 12
      return {
        prompt: `Λύσε την εξίσωση: (x － ${sub}) · ${mult} ＝ ${val}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: 'Πρώτο βήμα (διαίρεση)', formula: `${val} : ${mult}`, val: `x － ${sub} ＝ ${inter}` },
          { item: 'Δεύτερο βήμα (πρόσθεση)', formula: `${inter} ＋ ${sub}`, val: `x ＝ ${x}` }
        ],
        explain: `Διαιρούμε πρώτα το 16 με το 2: x － ${sub} ＝ ${val} : ${mult} ＝ ${inter}. Στη συνέχεια βρίσκουμε τον μειωτέο με πρόσθεση: x ＝ ${inter} ＋ ${sub} ＝ ${x}.`,
        distractors: [String(x + 4), String(x - 3), String(val + sub)]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Βασική εξίσωση x - a = b με φυσικούς αριθμούς
  const q1A = randInt(12, 45);
  const q1B = randInt(15, 65);
  const q1X = q1B + q1A;

  // Q2: Input - Εξίσωση x - a = b με μεγαλύτερους φυσικούς αριθμούς
  const q2A = randInt(45, 150);
  const q2B = randInt(55, 230);
  const q2X = q2B + q2A;

  // Q3: Input - Εξίσωση με δεκαδικούς αριθμούς: x - a = b
  const q3A_raw = randInt(15, 85) / 10;
  const q3B_raw = randInt(25, 95) / 10;
  const q3X_raw = Number((q3B_raw + q3A_raw).toFixed(1));
  const q3A = q3A_raw.toFixed(1).replace('.', ',');
  const q3B = q3B_raw.toFixed(1).replace('.', ',');
  const q3Correct = q3X_raw.toFixed(1).replace('.', ',');

  // Q4: MCQ - Επιλογή του σωστού βήματος επίλυσης για την εξίσωση x - a = b
  const q4A = randInt(12, 38);
  const q4B = randInt(20, 50);
  const q4CorrectStep = `x ＝ ${q4B} ＋ ${q4A}`;
  const q4Wrongs = [
    `x ＝ ${q4B} － ${q4A}`,
    `x ＝ ${q4A} － ${q4B}`,
    `x ＝ ${q4B} : ${q4A}`
  ];
  const q4Options = shuffle([...new Set([q4CorrectStep, ...q4Wrongs])]);

  // Q5: True/False - Κανόνας εύρεσης άγνωστου μειωτέου
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στην εξίσωση x － α ＝ β, ο άγνωστος x είναι ο μειωτέος και υπολογίζεται με πρόσθεση: x ＝ β ＋ α.'
    : 'Στην εξίσωση x － α ＝ β, ο άγνωστος x υπολογίζεται πάντοτε με αφαίρεση: x ＝ β － α.';

  // Q6: True/False - Σχέση μεγέθους μειωτέου
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Ο μειωτέος (x) είναι πάντοτε μεγαλύτερος τόσο από τον αφαιρετέο (α) όσο και από τη διαφορά (β).'
    : 'Ο μειωτέος (x) είναι πάντοτε μικρότερος από τη διαφορά (β).';

  // Q7: Input - Εξίσωση με ομώνυμα κλάσματα: x - n1/d = n2/d
  const q7Den = randInt(5, 12);
  const q7N1 = randInt(1, 4);
  const q7N2 = randInt(2, 5);
  const q7SumN = q7N1 + q7N2;
  const q7G = gcd(q7SumN, q7Den);
  const q7CorrectRaw = `${q7SumN}/${q7Den}`;
  const q7CorrectSimp = q7G > 1 ? `${q7SumN / q7G}/${q7Den / q7G}` : q7CorrectRaw;

  // Q8: MCQ - Επαλήθευση εξίσωσης αφαίρεσης
  const q8A = randInt(10, 20);
  const q8B = randInt(25, 45);
  const q8CorrectX = q8B + q8A;
  const q8Options = shuffle([...new Set([String(q8CorrectX), String(q8CorrectX - 5), String(q8B - q8A), String(q8CorrectX + 4)])]);

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
      title: 'Εξίσωση: x － α ＝ β',
      prompt: `Λύσε την εξίσωση: x － ${q1A} ＝ ${q1B}`,
      correct: String(q1X),
      explain: `x ＝ ${q1B} ＋ ${q1A} ＝ ${q1X}.`
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: 'Μεγαλύτεροι Αριθμοί',
      prompt: `Λύσε την εξίσωση: x － ${q2A} ＝ ${q2B}`,
      correct: String(q2X),
      explain: `x ＝ ${q2B} ＋ ${q2A} ＝ ${q2X}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: 'Δεκαδικοί Αριθμοί',
      prompt: `Λύσε την εξίσωση: x － ${q3A} ＝ ${q3B}`,
      correct: q3Correct,
      explain: `x ＝ ${q3B} ＋ ${q3A} ＝ ${q3Correct}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Σωστό Βήμα Επίλυσης',
      prompt: `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση x － ${q4A} ＝ ${q4B};`,
      options: q4Options,
      correct: q4CorrectStep,
      explain: `Για να βρούμε τον άγνωστο μειωτέο x, κάνουμε πρόσθεση: ${q4CorrectStep}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Κανόνας Μειωτέου',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Ο μειωτέος είναι το αρχικό σύνολο, άρα προκύπτει προσθέτοντας τη διαφορά και τον αφαιρετέο: x ＝ β ＋ α.'
        : 'Λάθος! Για να βρούμε τον μειωτέο κάνουμε πρόσθεση (x ＝ β ＋ α).'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Ιδιότητα Μειωτέου',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Επειδή από τον μειωτέο αφαιρούμε ποσότητα, είναι πάντα μεγαλύτερος από τη διαφορά και τον αφαιρετέο.'
        : 'Λάθος! Ο μειωτέος είναι το άθροισμα των άλλων δύο όρων, άρα είναι ο μεγαλύτερος αριθμός.'
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'fraction',
      title: 'Εξίσωση με Κλάσματα',
      prompt: `Λύσε την εξίσωση: x － ${q7N1}/${q7Den} ＝ ${q7N2}/${q7Den} (π.χ. 5/7):`,
      correct: q7CorrectRaw,
      altCorrect: q7CorrectSimp,
      explain: `x ＝ ${q7N2}/${q7Den} ＋ ${q7N1}/${q7Den} ＝ (${q7N2} ＋ ${q7N1})/${q7Den} ＝ ${q7CorrectRaw}${q7G > 1 ? ` (ή ανάγωγο: ${q7CorrectSimp})` : ''}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Επαλήθευση Εξίσωσης',
      prompt: `Στην εξίσωση x － ${q8A} ＝ ${q8B}, ποια τιμή του x επαληθεύει την ισότητα;`,
      options: q8Options,
      correct: String(q8CorrectX),
      explain: `Αντικαθιστούμε x ＝ ${q8CorrectX}: ${q8CorrectX} － ${q8A} ＝ ${q8B} (Σωστό ✔).`
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

export default function AgnostosKaiAfairesiExercisesPage() {
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
      title="Ασκήσεις: Άγνωστος Μειωτέος - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση εξισώσεων με άγνωστο μειωτέο (x - α = β) για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/34-agnostos-kai-afairesi"
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
                <span>ΚΕΦΑΛΑΙΟ 34 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Άγνωστος Μειωτέος (x － α ＝ β)
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην επίλυση εξισώσεων αφαίρεσης με φυσικούς αριθμούς, δεκαδικούς, κλάσματα και προβλήματα καθημερινότητας!
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
                          placeholder={q.inputType === 'fraction' ? 'π.χ. 5/7' : q.inputType === 'decimal' ? 'π.χ. 7,7' : 'Απάντηση...'}
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

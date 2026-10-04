// pages/st-dimotikou/35-gnostos-meion-agnostos-ask.js
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
    title: 'Αγορά Παιχνιδιού και Ρέστα',
    unit: 'ευρώ',
    generate: () => {
      // 75 - x = 28 -> x = 47
      const a = 75;
      const b = 28;
      const x = a - b;
      return {
        prompt: `Ο Γιώργος είχε ${a} ευρώ. Αγόρασε ένα παιχνίδι που κόστιζε x ευρώ και του έμειναν ${b} ευρώ. Πόσο κόστιζε το παιχνίδι (x);`,
        unit: 'ευρώ',
        correctVal: String(x),
        correctText: `${x} ευρώ`,
        tableData: [
          { item: 'Αρχικό ποσό (α)', formula: `${a} €`, val: `${a}` },
          { item: 'Υπόλοιπο (β)', formula: `${b} €`, val: `${b}` },
          { item: 'Εξίσωση (α － x ＝ β)', formula: `${a} － x ＝ ${b}`, val: `x ＝ ${a} － ${b} ＝ ${x} ευρώ` }
        ],
        explain: `Σχηματίζουμε την εξίσωση αφαίρεσης: ${a} － x ＝ ${b}. Για να βρούμε τον άγνωστο αφαιρετέο x, αφαιρούμε τη διαφορά από τον μειωτέο: x ＝ ${a} － ${b} ＝ ${x} ευρώ.`,
        distractors: [`${x + 5} ευρώ`, `${x - 4} ευρώ`, `${a + b} ευρώ`]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Κατανάλωση Λαδιού από Δοχείο',
    unit: 'λίτρα',
    generate: () => {
      // 60 - x = 22 -> x = 38
      const a = 60;
      const b = 22;
      const x = a - b;
      return {
        prompt: `Ένα δοχείο περιείχε ${a} λίτρα λάδι. Χρησιμοποιήσαμε x λίτρα για το μαγείρεμα και στο δοχείο έμειναν ${b} λίτρα. Πόσα λίτρα λάδι χρησιμοποιήσαμε;`,
        unit: 'λίτρα',
        correctVal: String(x),
        correctText: `${x} λίτρα`,
        tableData: [
          { item: 'Αρχικό λάδι', formula: `${a} λ.`, val: `${a}` },
          { item: 'Λάδι που έμεινε', formula: `${b} λ.`, val: `${b}` },
          { item: 'Εξίσωση', formula: `${a} － x ＝ ${b}`, val: `x ＝ ${a} － ${b} ＝ ${x} λίτρα` }
        ],
        explain: `Η εξίσωση είναι ${a} － x ＝ ${b}. Βρίσκουμε τον αφαιρετέο με αφαίρεση: x ＝ ${a} － ${b} ＝ ${x} λίτρα.`,
        distractors: [`${x + 4} λίτρα`, `${x - 5} λίτρα`, `${a + b} λίτρα`]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Ανάγνωση Σελίδων Βιβλίου',
    unit: 'σελίδες',
    generate: () => {
      // 180 - x = 65 -> x = 115
      const a = 180;
      const b = 65;
      const x = a - b;
      return {
        prompt: `Ένα βιβλίο έχει ${a} σελίδες. Η Άννα διάβασε x σελίδες και της απομένουν ακόμα ${b} σελίδες για να το τελειώσει. Πόσες σελίδες διάβασε;`,
        unit: 'σελίδες',
        correctVal: String(x),
        correctText: `${x} σελίδες`,
        tableData: [
          { item: 'Συνολικές σελίδες', formula: `${a}`, val: `${a}` },
          { item: 'Σελίδες που απομένουν', formula: `${b}`, val: `${b}` },
          { item: 'Εξίσωση', formula: `${a} － x ＝ ${b}`, val: `x ＝ ${a} － ${b} ＝ ${x} σελίδες` }
        ],
        explain: `${a} － x ＝ ${b} ➔ x ＝ ${a} － ${b} ＝ ${x} σελίδες.`,
        distractors: [`${x + 10} σελίδες`, `${x - 10} σελίδες`, `${a + b} σελίδες`]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Πώληση Μπαλών σε Κατάστημα',
    unit: 'μπάλες',
    generate: () => {
      // 50 - x = 18 -> x = 32
      const a = 50;
      const b = 18;
      const x = a - b;
      return {
        prompt: `Σε ένα κατάστημα υπήρχαν ${a} μπάλες. Πουλήθηκαν x μπάλες και στο κατάστημα έμειναν ${b} μπάλες. Πόσες μπάλες πουλήθηκαν;`,
        unit: 'μπάλες',
        correctVal: String(x),
        correctText: `${x} μπάλες`,
        tableData: [
          { item: 'Αρχικές μπάλες', formula: `${a}`, val: `${a}` },
          { item: 'Μπάλες που έμειναν', formula: `${b}`, val: `${b}` },
          { item: 'Εξίσωση', formula: `${a} － x ＝ ${b}`, val: `x ＝ ${a} － ${b} ＝ ${x} μπάλες` }
        ],
        explain: `Εξίσωση: ${a} － x ＝ ${b} ➔ x ＝ ${a} － ${b} ＝ ${x} μπάλες.`,
        distractors: [`${x + 4} μπάλες`, `${x - 4} μπάλες`, `${a + b} μπάλες`]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Χρήση Κορδέλας από Ρολό',
    unit: 'μέτρα',
    generate: () => {
      // 40 - x = 14 -> x = 26
      const a = 40;
      const b = 14;
      const x = a - b;
      return {
        prompt: `Ένα τόπι κορδέλας είχε μήκος ${a} μέτρα. Κόψαμε ένα κομμάτι x μέτρων για συσκευασία δώρων και στο τόπι έμειναν ${b} μέτρα. Πόσο ήταν το μήκος του κομματιού που κόψαμε;`,
        unit: 'μέτρα',
        correctVal: String(x),
        correctText: `${x} μέτρα`,
        tableData: [
          { item: 'Αρχικό μήκος', formula: `${a} μ.`, val: `${a}` },
          { item: 'Μήκος που έμεινε', formula: `${b} μ.`, val: `${b}` },
          { item: 'Εξίσωση', formula: `${a} － x ＝ ${b}`, val: `x ＝ ${a} － ${b} ＝ ${x} μ.` }
        ],
        explain: `${a} － x ＝ ${b} ➔ x ＝ ${a} － ${b} ＝ ${x} μέτρα.`,
        distractors: [`${x + 5} μέτρα`, `${x - 3} μέτρα`, `${a + b} μέτρα`]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Κατανάλωση Χαρτιού Εκτύπωσης',
    unit: 'φύλλα',
    generate: () => {
      // 500 - x = 320 -> x = 180
      const a = 500;
      const b = 320;
      const x = a - b;
      return {
        prompt: `Ένα πακέτο φωτοτυπικού χαρτιού είχε ${a} φύλλα. Χρησιμοποιήσαμε x φύλλα για εκτυπώσεις και στο πακέτο έμειναν ${b} φύλλα. Πόσα φύλλα χαρτιού χρησιμοποιήσαμε;`,
        unit: 'φύλλα',
        correctVal: String(x),
        correctText: `${x} φύλλα`,
        tableData: [
          { item: 'Αρχικά φύλλα', formula: `${a}`, val: `${a}` },
          { item: 'Φύλλα που έμειναν', formula: `${b}`, val: `${b}` },
          { item: 'Εξίσωση', formula: `${a} － x ＝ ${b}`, val: `x ＝ ${a} － ${b} ＝ ${x} φύλλα` }
        ],
        explain: `Εξίσωση: ${a} － x ＝ ${b} ➔ x ＝ ${a} － ${b} ＝ ${x} φύλλα.`,
        distractors: [`${x + 20} φύλλα`, `${x - 20} φύλλα`, `${a + b} φύλλα`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Εξίσωση με Δεκαδικό Αφαιρετέο',
    unit: '',
    generate: () => {
      // 8,5 - x = 3,2 -> x = 5,3
      const a = 8.5;
      const b = 3.2;
      const x = Number((a - b).toFixed(1));
      const aStr = a.toFixed(1).replace('.', ',');
      const bStr = b.toFixed(1).replace('.', ',');
      const xStr = x.toFixed(1).replace('.', ',');
      return {
        prompt: `Λύσε την εξίσωση με δεκαδικούς αριθμούς: ${aStr} － x ＝ ${bStr}:`,
        unit: '',
        correctVal: xStr,
        correctText: xStr,
        tableData: [
          { item: 'Εξίσωση', formula: `${aStr} － x ＝ ${bStr}`, val: `x ＝ ${aStr} － ${bStr}` },
          { item: 'Αφαίρεση δεκαδικών', formula: `${aStr} － ${bStr}`, val: `${xStr}` }
        ],
        explain: `x ＝ ${aStr} － ${bStr} ＝ ${xStr}.`,
        distractors: ['11,7', (x + 1).toFixed(1).replace('.', ','), (x - 0.5).toFixed(1).replace('.', ',')]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Εξίσωση με Ομώνυμα Κλάσματα (7/8 － x ＝ 3/8)',
    unit: '',
    generate: () => {
      // 7/8 - x = 3/8 -> x = 4/8 = 1/2
      return {
        prompt: 'Λύσε την εξίσωση με κλάσματα: 7/8 － x ＝ 3/8 (π.χ. 4/8 ή 1/2):',
        unit: '',
        correctVal: '4/8',
        altCorrect: '1/2',
        correctText: '4/8 (ή 1/2)',
        tableData: [
          { item: 'Εξίσωση', formula: '7/8 － x ＝ 3/8', val: 'x ＝ 7/8 － 3/8' },
          { item: 'Αφαίρεση αριθμητών', formula: '(7 － 3) / 8', val: '4/8 ＝ 1/2' }
        ],
        explain: 'x ＝ 7/8 － 3/8 ＝ (7 － 3)/8 ＝ 4/8, το οποίο απλοποιείται σε 1/2.',
        distractors: ['10/8', '2/8', '5/8']
      };
    }
  },
  {
    id: 'hp3',
    title: 'Σύνθετη Εξίσωση 50 － (x ＋ 10) ＝ 25',
    unit: '',
    generate: () => {
      // 50 - (x + 10) = 25 -> x + 10 = 25 -> x = 15
      const a = 50;
      const b = 25;
      const knownAdd = 10;
      const inter = a - b; // 25
      const x = inter - knownAdd; // 15
      return {
        prompt: `Λύσε την εξίσωση: ${a} － (x ＋ ${knownAdd}) ＝ ${b}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: 'Πρώτο βήμα (εύρεση παρένθεσης)', formula: `${a} － ${b}`, val: `x ＋ ${knownAdd} ＝ ${inter}` },
          { item: 'Δεύτερο βήμα (λύση πρόσθεσης)', formula: `${inter} － ${knownAdd}`, val: `x ＝ ${x}` }
        ],
        explain: `Πρώτα βρίσκουμε πόσο είναι η παρένθεση: x ＋ ${knownAdd} ＝ ${a} － ${b} ＝ ${inter}. Στη συνέχεια λύνουμε την απλή πρόσθεση: x ＝ ${inter} － ${knownAdd} ＝ ${x}.`,
        distractors: [String(x + 5), String(x - 3), String(a + b)]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Εύρεση Μειωτέου όταν ο Αφαιρετέος είναι Άγνωστος',
    unit: '',
    generate: () => {
      // x - (25 - x) -> παραλλαγή με δύο αφαιρετέους
      const a = 40;
      const b = 12;
      const x = a - b;
      return {
        prompt: `Αν σε μια εξίσωση α － x ＝ β γνωρίζουμε ότι η διαφορά β είναι το 30% του μειωτέου α (όπου α ＝ 40), ποια είναι η τιμή του x;`,
        unit: '',
        correctVal: String(12),
        correctText: '12',
        tableData: [
          { item: 'Υπολογισμός 30% του 40', formula: '40 · 30 / 100', val: '12' },
          { item: 'Εξίσωση', formula: '40 － x ＝ 12', val: 'x ＝ 40 － 12 ＝ 28 (ή 12 ανάλογα με τα δεδομένα)' }
        ],
        explain: 'Αν β ＝ 12, τότε x ＝ 40 － 12 ＝ 28. (ή αν β ＝ 28, τότε x ＝ 12).',
        distractors: ['28', '15', '20']
      };
    }
  },
  {
    id: 'hp5',
    title: 'Πρόβλημα Ηλικίας με Αφαιρετέο',
    unit: 'έτη',
    generate: () => {
      // Ηλικία μητέρας 40, κόρης x. Πριν από 10 χρόνια η κόρη ήταν... (αφηγηματικό)
      const ageMom = 38;
      const diff = 12;
      const x = ageMom - diff; // 26
      return {
        prompt: `Ο πατέρας είναι ${ageMom} ετών. Αν από την ηλικία του αφαιρέσουμε την ηλικία του γιου του (x), μένει διαφορά ${diff} χρόνια (δηλαδή πόσα χρόνια είναι μεγαλύτερος). Πόσων ετών είναι ο γιος (x);`,
        unit: 'έτη',
        correctVal: String(x),
        correctText: `${x} ετών`,
        tableData: [
          { item: 'Εξίσωση ηλικίας', formula: `${ageMom} － x ＝ ${diff}`, val: `x ＝ ${ageMom} － ${diff}` },
          { item: 'Ηλικία γιου', formula: `${ageMom} － ${diff}`, val: `${x} ετών` }
        ],
        explain: `Σχηματίζουμε την εξίσωση: ${ageMom} － x ＝ ${diff}. Ο αφαιρετέος x υπολογίζεται με αφαίρεση: x ＝ ${ageMom} － ${diff} ＝ ${x} ετών.`,
        distractors: [`${x + 4} ετών`, `${x - 3} ετών`, `${ageMom + diff} ετών`]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Σύνθετη Εξίσωση 100 － 2x ＝ 60',
    unit: '',
    generate: () => {
      // 100 - 2x = 60 -> 2x = 40 -> x = 20
      const a = 100;
      const b = 60;
      const diff = a - b; // 40
      const x = diff / 2; // 20
      return {
        prompt: `Λύσε την εξίσωση: ${a} － 2x ＝ ${b}:`,
        unit: '',
        correctVal: String(x),
        correctText: String(x),
        tableData: [
          { item: 'Εύρεση διπλάσιου 2x', formula: `${a} － ${b}`, val: `2x ＝ ${diff}` },
          { item: 'Εύρεση x', formula: `${diff} : 2`, val: `x ＝ ${x}` }
        ],
        explain: `Το 2x λειτουργεί ως άγνωστος αφαιρετέος: 2x ＝ ${a} － ${b} ＝ ${diff}. Άρα x ＝ ${diff} : 2 ＝ ${x}.`,
        distractors: [String(x + 10), String(Math.max(1, x - 5)), String(a - b)]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Βασική εξίσωση a - x = b με φυσικούς αριθμούς
  const q1A = randInt(25, 75);
  const q1B = randInt(8, q1A - 8);
  const q1X = q1A - q1B;

  // Q2: Input - Εξίσωση a - x = b με μεγαλύτερους φυσικούς αριθμούς
  const q2A = randInt(110, 350);
  const q2B = randInt(35, q2A - 40);
  const q2X = q2A - q2B;

  // Q3: Input - Εξίσωση με δεκαδικούς αριθμούς: a - x = b
  const q3A_raw = randInt(45, 95) / 10;
  const q3B_raw = randInt(12, Math.floor(q3A_raw * 10) - 10) / 10;
  const q3X_raw = Number((q3A_raw - q3B_raw).toFixed(1));
  const q3A = q3A_raw.toFixed(1).replace('.', ',');
  const q3B = q3B_raw.toFixed(1).replace('.', ',');
  const q3Correct = q3X_raw.toFixed(1).replace('.', ',');

  // Q4: MCQ - Επιλογή του σωστού βήματος επίλυσης για την εξίσωση a - x = b
  const q4A = randInt(30, 80);
  const q4B = randInt(10, q4A - 10);
  const q4CorrectStep = `x ＝ ${q4A} － ${q4B}`;
  const q4Wrongs = [
    `x ＝ ${q4A} ＋ ${q4B}`,
    `x ＝ ${q4B} － ${q4A}`,
    `x ＝ ${q4A} : ${q4B}`
  ];
  const q4Options = shuffle([...new Set([q4CorrectStep, ...q4Wrongs])]);

  // Q5: True/False - Κανόνας εύρεσης άγνωστου αφαιρετέου
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στην εξίσωση α － x ＝ β, ο άγνωστος x είναι ο αφαιρετέος και υπολογίζεται με αφαίρεση: x ＝ α － β.'
    : 'Στην εξίσωση α － x ＝ β, ο άγνωστος x υπολογίζεται με πρόσθεση: x ＝ α ＋ β.';

  // Q6: True/False - Σχέση μεγέθους όρων στην αφαίρεση
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Στην εξίσωση α － x ＝ β, ο μειωτέος (α) είναι πάντοτε μεγαλύτερος τόσο από τον αφαιρετέο (x) όσο και από τη διαφορά (β).'
    : 'Στην εξίσωση α － x ＝ β, ο άγνωστος αφαιρετέος (x) είναι πάντοτε μεγαλύτερος από τον μειωτέο (α).';

  // Q7: Input - Εξίσωση με ομώνυμα κλάσματα: n1/d - x = n2/d
  const q7Den = randInt(6, 15);
  const q7N1 = randInt(5, q7Den - 1);
  const q7N2 = randInt(1, q7N1 - 2);
  const q7DiffN = q7N1 - q7N2;
  const q7G = gcd(q7DiffN, q7Den);
  const q7CorrectRaw = `${q7DiffN}/${q7Den}`;
  const q7CorrectSimp = q7G > 1 ? `${q7DiffN / q7G}/${q7Den / q7G}` : q7CorrectRaw;

  // Q8: MCQ - Επαλήθευση εξίσωσης αφαίρεσης
  const q8A = randInt(30, 60);
  const q8B = randInt(10, q8A - 10);
  const q8CorrectX = q8A - q8B;
  const q8Options = shuffle([...new Set([String(q8CorrectX), String(q8CorrectX + 5), String(q8A + q8B), String(Math.max(1, q8CorrectX - 3))])]);

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
      title: 'Εξίσωση: α － x ＝ β',
      prompt: `Λύσε την εξίσωση: ${q1A} － x ＝ ${q1B}`,
      correct: String(q1X),
      explain: `x ＝ ${q1A} － ${q1B} ＝ ${q1X}.`
    },
    {
      id: 'q2',
      type: 'input',
      title: 'Μεγαλύτεροι Αριθμοί',
      prompt: `Λύσε την εξίσωση: ${q2A} － x ＝ ${q2B}`,
      correct: String(q2X),
      explain: `x ＝ ${q2A} － ${q2B} ＝ ${q2X}.`
    },
    {
      id: 'q3',
      type: 'input',
      title: 'Δεκαδικοί Αριθμοί',
      prompt: `Λύσε την εξίσωση: ${q3A} － x ＝ ${q3B}`,
      correct: q3Correct,
      explain: `x ＝ ${q3A} － ${q3B} ＝ ${q3Correct}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Σωστό Βήμα Επίλυσης',
      prompt: `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση ${q4A} － x ＝ ${q4B};`,
      options: q4Options,
      correct: q4CorrectStep,
      explain: `Για να βρούμε τον άγνωστο αφαιρετέο x, αφαιρούμε τη διαφορά από τον μειωτέο: ${q4CorrectStep}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Κανόνας Αφαιρετέου',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Για να βρούμε τι αφαιρέθηκε από το αρχικό ποσό (αφαιρετέος), αφαιρούμε τη διαφορά από τον μειωτέο: x ＝ α － β.'
        : 'Λάθος! Για να βρούμε τον αφαιρετέο κάνουμε αφαίρεση (x ＝ α － β).'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Σχέση Όρων Αφαίρεσης',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Ο μειωτέος (α) είναι το αρχικό ολικό μέγεθος, επομένως είναι μεγαλύτερος από το x και από το β.'
        : 'Λάθος! Ο μειωτέος (α) είναι το μεγαλύτερο μέγεθος στην αφαίρεση (α ＞ x και α ＞ β).'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Εξίσωση με Κλάσματα',
      prompt: `Λύσε την εξίσωση: ${q7N1}/${q7Den} － x ＝ ${q7N2}/${q7Den} (π.χ. 3/8):`,
      correct: q7CorrectRaw,
      altCorrect: q7CorrectSimp,
      explain: `x ＝ ${q7N1}/${q7Den} － ${q7N2}/${q7Den} ＝ (${q7N1} － ${q7N2})/${q7Den} ＝ ${q7CorrectRaw}${q7G > 1 ? ` (ή ανάγωγο: ${q7CorrectSimp})` : ''}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Επαλήθευση Εξίσωσης',
      prompt: `Στην εξίσωση ${q8A} － x ＝ ${q8B}, ποια τιμή του x επαληθεύει την ισότητα;`,
      options: q8Options,
      correct: String(q8CorrectX),
      explain: `Αντικαθιστούμε x ＝ ${q8CorrectX}: ${q8A} － ${q8CorrectX} ＝ ${q8B} (Σωστό ✔).`
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

export default function GnostosMeionAgnostosExercisesPage() {
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
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase() : null;
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
      title="Ασκήσεις: Άγνωστος Αφαιρετέος - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση εξισώσεων με άγνωστο αφαιρετέο (α - x = β) για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/35-gnostos-meion-agnostos"
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
                <span>ΚΕΦΑΛΑΙΟ 35 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Άγνωστος Αφαιρετέος (α － x ＝ β)
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

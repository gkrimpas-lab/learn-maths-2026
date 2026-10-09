// pages/st-dimotikou/49-antistrofos-analoga-posa-ask.js
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

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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

// Μορφοποίηση αριθμού (ακέραιος ή δεκαδικός με κόμμα)
function formatNum(val, decimals = 1) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  if (Number.isInteger(Number(val))) return String(val);
  const rounded = Number(Number(val).toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'inv_std_1',
    title: 'Εργάτες και Χρόνος Ολοκλήρωσης',
    unit: 'ημέρες',
    generate: () => {
      const w1 = pickRandom([3, 4, 6]);
      const d1 = pickRandom([6, 8, 12]);
      const prod = w1 * d1;
      const w2 = pickRandom([2, 4, 6, 8, 12].filter(w => w !== w1 && prod % w === 0));
      const d2 = prod / w2;
      return {
        prompt: `${w1} εργάτες τελειώνουν ένα έργο σε ${d1} ημέρες. Σε πόσες ημέρες θα τελειώσουν το ίδιο έργο ${w2} εργάτες, εργαζόμενοι με τον ίδιο ρυθμό;`,
        unit: 'ημέρες',
        correctVal: String(d2),
        correctText: `${d2} ημέρες`,
        tableData: [
          { item: 'Αρχική ομάδα', formula: `${w1} εργάτες · ${d1} ημέρες`, val: `${prod} μεροκάματα` },
          { item: 'Νέα ομάδα', formula: `${w2} εργάτες`, val: `${w2}` },
          { item: 'Απαιτούμενες ημέρες', formula: `${prod} : ${w2}`, val: `${d2} ημέρες` }
        ],
        explain: `Τα ποσά είναι αντιστρόφως ανάλογα (σταθερό γινόμενο: ${w1} · ${d1} ＝ ${prod}). Άρα: x ＝ ${prod} : ${w2} ＝ ${d2} ημέρες.`,
        distractors: [`${d2 + 2} ημέρες`, `${Math.max(1, d2 - 2)} ημέρες`, `${d2 + 4} ημέρες`]
      };
    }
  },
  {
    id: 'inv_std_2',
    title: 'Ταχύτητα και Χρόνος Διαδρομής',
    unit: 'ώρες',
    generate: () => {
      const v1 = pickRandom([40, 50, 60, 80]);
      const t1 = pickRandom([2, 3, 4]);
      const dist = v1 * t1;
      const v2 = pickRandom([60, 80, 100, 120].filter(v => v !== v1 && dist % v === 0));
      const t2 = dist / v2;
      return {
        prompt: `Ένα αυτοκίνητο κινούμενο με μέση ταχύτητα ${v1} km/h διανύει μια απόσταση σε ${t1} ώρες. Πόσες ώρες θα χρειαστεί για να διανύσει την ίδια απόσταση αν τρέχει με ${v2} km/h;`,
        unit: 'ώρες',
        correctVal: String(t2),
        correctText: `${t2} ώρες`,
        tableData: [
          { item: 'Σταθερή απόσταση', formula: `${v1} · ${t1}`, val: `${dist} km` },
          { item: 'Νέα ταχύτητα', formula: `${v2} km/h`, val: `${v2} km/h` },
          { item: 'Νέος χρόνος', formula: `${dist} : ${v2}`, val: `${t2} h` }
        ],
        explain: `Σταθερή απόσταση: ${v1} · ${t1} ＝ ${dist} km. Νέος χρόνος: ${dist} : ${v2} ＝ ${t2} ώρες.`,
        distractors: [`${t2 + 1} ώρες`, `${Math.max(1, t2 - 1)} ώρες`, `${t2 + 2} ώρες`]
      };
    }
  },
  {
    id: 'inv_std_3',
    title: 'Βρύσες και Γέμισμα Πισίνας',
    unit: 'ώρες',
    generate: () => {
      const b1 = pickRandom([2, 3, 4]);
      const h1 = pickRandom([6, 8, 12]);
      const prod = b1 * h1;
      const b2 = pickRandom([6, 8, 12].filter(b => b !== b1 && prod % b === 0));
      const h2 = prod / b2;
      return {
        prompt: `${b1} ίδιες βρύσες γεμίζουν μια πισίνα σε ${h1} ώρες. Σε πόσες ώρες θα γεμίσουν την πισίνα ${b2} ίδιες βρύσες;`,
        unit: 'ώρες',
        correctVal: String(h2),
        correctText: `${h2} ώρες`,
        tableData: [
          { item: 'Σταθερό γινόμενο', formula: `${b1} · ${h1}`, val: `${prod}` },
          { item: 'Νέες βρύσες', formula: `${b2} βρύσες`, val: `${b2}` },
          { item: 'Χρόνος γεμίσματος', formula: `${prod} : ${b2}`, val: `${h2} h` }
        ],
        explain: `Σταθερό γινόμενο: ${b1} · ${h1} ＝ ${prod}. Άρα: x ＝ ${prod} : ${b2} ＝ ${h2} ώρες.`,
        distractors: [`${h2 + 2} ώρες`, `${Math.max(1, h2 - 2)} ώρες`, `${h2 + 3} ώρες`]
      };
    }
  },
  {
    id: 'inv_std_4',
    title: 'Ζωοτροφή και Ημέρες Επάρκειας',
    unit: 'ημέρες',
    generate: () => {
      const animal1 = pickRandom([10, 15, 20]);
      const days1 = pickRandom([12, 16, 20]);
      const foodUnits = animal1 * days1;
      const animal2 = pickRandom([20, 25, 30].filter(a => a !== animal1 && foodUnits % a === 0));
      const days2 = foodUnits / animal2;
      return {
        prompt: `Μια ποσότητα ζωοτροφής επαρκεί για ${animal1} ζώα για ${days1} ημέρες. Για πόσες ημέρες θα επαρκέσει η ίδια τροφή για ${animal2} ζώα;`,
        unit: 'ημέρες',
        correctVal: String(days2),
        correctText: `${days2} ημέρες`,
        tableData: [
          { item: 'Συνολικές μερίδες τροφής', formula: `${animal1} · ${days1}`, val: `${foodUnits} μερίδες` },
          { item: 'Νέος αριθμός ζώων', formula: `${animal2} ζώα`, val: `${animal2}` },
          { item: 'Ημέρες επάρκειας', formula: `${foodUnits} : ${animal2}`, val: `${days2} ημέρες` }
        ],
        explain: `Σταθερή ποσότητα τροφής: ${animal1} · ${days1} ＝ ${foodUnits}. Ημέρες: ${foodUnits} : ${animal2} ＝ ${days2} ημέρες.`,
        distractors: [`${days2 + 4} ημέρες`, `${Math.max(1, days2 - 4)} ημέρες`, `${days2 + 6} ημέρες`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'inv_hard_1',
    title: 'Έργο με Ενίσχυση Εργατών',
    unit: 'ημέρες',
    generate: () => {
      return {
        prompt: 'Ένα συνεργείο 8 εργατών μπορεί να τελειώσει ένα έργο σε 15 ημέρες. Αφού εργάστηκαν όλοι μαζί για 3 ημέρες, προστέθηκαν άλλοι 4 εργάτες. Πόσες ημέρες ακόμα θα χρειαστούν για να ολοκληρωθεί το έργο;',
        unit: 'ημέρες',
        correctVal: '8',
        correctText: '8 ημέρες',
        tableData: [
          { item: 'Εναπομείναν έργο (σε μεροκάματα)', formula: '8 εργάτες · (15 － 3) ημέρες', val: '96 μεροκάματα' },
          { item: 'Συνολικοί εργάτες', formula: '8 ＋ 4', val: '12 εργάτες' },
          { item: 'Ημέρες που απομένουν', formula: '96 : 12', val: '8 ημέρες' }
        ],
        explain: 'Απομένουν 15 － 3 ＝ 12 ημέρες για τους 8 εργάτες (8 · 12 ＝ 96 εργατοημέρες). Με 8 ＋ 4 ＝ 12 εργάτες: 96 : 12 ＝ 8 ημέρες.',
        distractors: ['10 ημέρες', '6 ημέρες', '12 ημέρες']
      };
    }
  },
  {
    id: 'inv_hard_2',
    title: 'Αύξηση Ταχύτητας Πεζοπόρου',
    unit: 'km/h',
    generate: () => {
      return {
        prompt: 'Ένας πεζοπόρος βαδίζοντας με ταχύτητα 4 km/h χρειάζεται 6 ώρες για μια διαδρομή. Αν θέλει να καλύψει την ίδια διαδρομή σε 4 ώρες, κατά πόσα km/h πρέπει να ΑΥΞΗΣΕΙ την ταχύτητά του;',
        unit: 'km/h',
        correctVal: '2',
        correctText: '2 km/h',
        tableData: [
          { item: 'Σταθερή απόσταση', formula: '4 km/h · 6 h', val: '24 km' },
          { item: 'Νέα απαιτούμενη ταχύτητα', formula: '24 km : 4 h', val: '6 km/h' },
          { item: 'Απαιτούμενη αύξηση ταχύτητας', formula: '6 － 4', val: '2 km/h' }
        ],
        explain: 'Απόσταση: 4 · 6 ＝ 24 km. Νέα ταχύτητα: 24 : 4 ＝ 6 km/h. Αύξηση ταχύτητας: 6 － 4 ＝ 2 km/h.',
        distractors: ['3 km/h', '1 km/h', '4 km/h']
      };
    }
  },
  {
    id: 'inv_hard_3',
    title: 'Ωράριο Εργασίας και Ημέρες Παράδοσης',
    unit: 'ημέρες',
    generate: () => {
      return {
        prompt: 'Μια ομάδα 12 εργατών ολοκληρώνει ένα έργο δουλεύοντας 6 ώρες την ημέρα σε 10 ημέρες. Πόσες ημέρες θα χρειάζονταν οι ίδιοι 12 εργάτες αν δούλευαν 8 ώρες την ημέρα;',
        unit: 'ημέρες',
        correctVal: '7,5',
        correctText: '7,5 ημέρες',
        tableData: [
          { item: 'Συνολικές ώρες έργου', formula: '6 h/ημέρα · 10 ημέρες', val: '60 ώρες' },
          { item: 'Νέο ημερήσιο ωράριο', formula: '8 ώρες/ημέρα', val: '8 h' },
          { item: 'Νέες ημέρες ολοκλήρωσης', formula: '60 : 8', val: '7,5 ημέρες' }
        ],
        explain: 'Συνολικές ώρες έργου: 6 · 10 ＝ 60 ώρες. Με 8 ώρες καθημερινά: 60 : 8 ＝ 7,5 ημέρες.',
        distractors: ['8,5 ημέρες', '6,5 ημέρες', '9 ημέρες']
      };
    }
  },
  {
    id: 'inv_hard_4',
    title: 'Προσθήκη Βρυσών για Ταχύτερο Γέμισμα',
    unit: 'βρύσες',
    generate: () => {
      return {
        prompt: 'Μια δεξαμενή γεμίζει από 2 βρύσες σε 12 ώρες. Αν θέλουμε η δεξαμενή να γεμίσει σε μόλις 3 ώρες, πόσες τέτοιες βρύσες ΠΡΕΠΕΙ ΝΑ ΠΡΟΣΤΕΘΟΥΝ συνολικά;',
        unit: 'βρύσες',
        correctVal: '6',
        correctText: '6 βρύσες',
        tableData: [
          { item: 'Σταθερό γινόμενο έργου', formula: '2 βρύσες · 12 ώρες', val: '24' },
          { item: 'Συνολικές βρύσες που απαιτούνται', formula: '24 : 3 ώρες', val: '8 βρύσες' },
          { item: 'Βρύσες που πρέπει να προστεθούν', formula: '8 － 2', val: '6 βρύσες' }
        ],
        explain: 'Σταθερό έργο: 2 · 12 ＝ 24. Συνολικές βρύσες που χρειάζονται: 24 : 3 ＝ 8 βρύσες. Πρέπει να προστεθούν: 8 － 2 ＝ 6 βρύσες.',
        distractors: ['8 βρύσες', '4 βρύσες', '5 βρύσες']
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Βασικό πρόβλημα εργατών
  const q1W1 = pickRandom([3, 4, 6]);
  const q1D1 = pickRandom([6, 8, 12]);
  const q1Prod = q1W1 * q1D1;
  const q1W2 = pickRandom([2, 4, 6, 8, 12].filter(w => w !== q1W1 && q1Prod % w === 0));
  const q1D2 = q1Prod / q1W2;

  // Q2: MCQ - Βασική ιδιότητα αντιστρόφως αναλόγων
  const q2Correct = 'Το γινόμενο των αντίστοιχων τιμών τους είναι πάντοτε σταθερό (x · y ＝ σταθερό)';
  const q2Options = shuffle([
    q2Correct,
    'Το πηλίκο των αντίστοιχων τιμών τους είναι πάντοτε σταθερό',
    'Όταν αυξάνεται το ένα ποσό, αυξάνεται και το άλλο στον ίδιο ρυθμό',
    'Η διαφορά ανάμεσα στις τιμές τους είναι πάντοτε ίση με το μηδέν'
  ]);

  // Q3: Input - Ταχύτητα και χρόνος
  const q3V1 = pickRandom([40, 60, 80]);
  const q3T1 = pickRandom([2, 3, 4]);
  const q3Dist = q3V1 * q3T1;
  const q3V2 = pickRandom([60, 80, 120].filter(v => v !== q3V1 && q3Dist % v === 0));
  const q3T2 = q3Dist / q3V2;

  // Q4: MCQ - Χιαστί πολλαπλασιασμός παγίδα
  const q4Correct = 'Όχι, στα αντιστρόφως ανάλογα ποσά πολλαπλασιάζουμε οριζόντια και διαιρούμε με τον τρίτο αριθμό';
  const q4Options = shuffle([
    q4Correct,
    'Ναι, ο χιαστί πολλαπλασιασμός εφαρμόζεται σε όλα τα είδη ποσών',
    'Ναι, αρκεί πρώτα να προσθέσουμε τους δύο αριθμούς',
    'Όχι, γιατί στα αντιστρόφως ανάλογα ποσά δεν κάνουμε ποτέ πράξεις'
  ]);

  // Q5: Input - Βρύσες και χρόνος
  const q5B1 = 3;
  const q5H1 = 8;
  const q5B2 = 6;
  const q5H2 = 4;

  // Q6: MCQ - Διπλασιασμός της μιας τιμής
  const q6Correct = 'Ο χρόνος μειώνεται στο μισό (διαιρείται με το 2)';
  const q6Options = shuffle([
    q6Correct,
    'Ο χρόνος διπλασιάζεται (πολλαπλασιάζεται με το 2)',
    'Ο χρόνος παραμένει ακριβώς ο ίδιος',
    'Ο χρόνος αυξάνεται κατά 2 ώρες'
  ]);

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate();

  // Q8: Standard Problem (MCQ)
  let spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  while (spIndex2 === spIndex1) spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q8Data = STANDARD_PROBLEMS_POOL[spIndex2].generate();
  const q8Options = shuffle([
    ...new Set([
      q8Data.correctText,
      ...q8Data.distractors
    ])
  ]);

  // Q9: Hard Problem (Input)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate();

  // Q10: Hard Problem (MCQ)
  let hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  while (hpIndex2 === hpIndex1) hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hpIndex2].generate();
  const q10Options = shuffle([
    ...new Set([
      q10Data.correctText,
      ...q10Data.distractors
    ])
  ]);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: 'Εργάτες και Χρόνος Ολοκλήρωσης',
      prompt: `${q1W1} εργάτες τελειώνουν ένα έργο σε ${q1D1} ημέρες. Σε πόσες ημέρες θα τελειώσουν το ίδιο έργο ${q1W2} εργάτες;`,
      correct: String(q1D2),
      explain: `Σταθερό γινόμενο: ${q1W1} · ${q1D1} ＝ ${q1Prod}. Ημέρες για ${q1W2} εργάτες: ${q1Prod} : ${q1W2} ＝ ${q1D2} ημέρες.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Η Βασική Ιδιότητα',
      prompt: 'Ποιο είναι το βασικό μαθηματικό χαρακτηριστικό που διακρίνει δύο αντιστρόφως ανάλογα ποσά;',
      options: q2Options,
      correct: q2Correct,
      explain: 'Στα αντιστρόφως ανάλογα ποσά το γινόμενο των αντίστοιχων τιμών τους παραμένει πάντα σταθερό (x · y ＝ σταθερό).'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Ταχύτητα και Χρόνος',
      prompt: `Ένα αυτοκίνητο διανύει μια διαδρομή σε ${q3T1} ώρες με ταχύτητα ${q3V1} km/h. Πόσες ώρες θα χρειαστεί με ταχύτητα ${q3V2} km/h;`,
      correct: String(q3T2),
      explain: `Σταθερή απόσταση: ${q3V1} · ${q3T1} ＝ ${q3Dist} km. Νέος χρόνος: ${q3Dist} : ${q3V2} ＝ ${q3T2} ώρες.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Χιαστί Πολλαπλασιασμός',
      prompt: 'Μπορούμε να χρησιμοποιήσουμε χιαστί πολλαπλασιασμό στον πίνακα αντιστρόφως αναλόγων ποσών;',
      options: q4Options,
      correct: q4Correct,
      explain: 'Ο χιαστί πολλαπλασιασμός ισχύει μόνο στα ανάλογα ποσά (σταθερό πηλίκο). Στα αντιστρόφως ανάλογα ποσά εξισώνουμε τα οριζόντια γινόμενα (x₁ · y₁ ＝ x₂ · y₂).'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Βρύσες και Χρόνος',
      prompt: `${q5B1} ίδιες βρύσες γεμίζουν μια δεξαμενή σε ${q5H1} ώρες. Σε πόσες ώρες θα γεμίσουν την ίδια δεξαμενή ${q5B2} ίδιες βρύσες;`,
      correct: String(q5H2),
      explain: `Διπλάσιες βρύσες (${q5B2}) ➔ Μισός χρόνος: (${q5B1} · ${q5H1}) : ${q5B2} ＝ 24 : 6 ＝ ${q5H2} ώρες.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Διπλασιασμός της Μιας Τιμής',
      prompt: 'Σε δύο αντιστρόφως ανάλογα ποσά, αν διπλασιάσουμε την τιμή του πρώτου ποσού, τι θα συμβεί στην αντίστοιχη τιμή του δεύτερου ποσού;',
      options: q6Options,
      correct: q6Correct,
      explain: 'Όταν η τιμή του ενός ποσού πολλαπλασιάζεται με το 2, η αντίστοιχη τιμή του άλλου διαιρείται με το 2.'
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'decimal',
      title: `Πρόβλημα: ${q7Data.title}`,
      prompt: q7Data.prompt,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: `Πρόβλημα: ${q8Data.title}`,
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correctText,
      tableData: q8Data.tableData,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'input',
      inputType: 'decimal',
      title: `Σύνθετο Πρόβλημα: ${q9Data.title}`,
      prompt: q9Data.prompt,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `Σύνθετο Πρόβλημα: ${q10Data.title}`,
      prompt: q10Data.prompt,
      options: q10Options,
      correct: q10Data.correctText,
      tableData: q10Data.tableData,
      explain: q10Data.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function AntistrofosAnalogaPosaExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions();
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach(q => {
      initialAnswers[q.id] = '';
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

  // Χειρισμός απαντήσεων: sanitize για inputs, αυτούσιο για mcq
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/^[xyψχ][=＝]/i, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/^[xyψχ][=＝]/i, '').trim().toLowerCase();

      if (cleanUser === cleanTarget) return true;

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
      title="Ασκήσεις: Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα αντιστρόφως ανάλογα ποσά, το σταθερό γινόμενο και την αναγωγή στη μονάδα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/49-antistrofos-analoga-posa"
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
                <span>ΚΕΦΑΛΑΙΟ 49 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Αντιστρόφως Ανάλογα Ποσά
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στο σταθερό γινόμενο x · y, στην αναγωγή στη μονάδα και στην επίλυση ρεαλιστικών προβλημάτων!
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
                      {q.prompt}
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
                          inputMode={q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.inputType === 'decimal' ? 'π.χ. 7,5' : 'Απάντηση...'}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
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

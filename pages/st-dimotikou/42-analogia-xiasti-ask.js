// pages/st-dimotikou/42-analogia-xiasti-ask.js
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

// Μορφοποίηση αριθμού (ακέραιος ή δεκαδικός με κόμμα)
function formatNum(val, decimals = 2) {
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
    id: 'p_xiasti_std_1',
    title: 'Αγορά Μήλων με Πίνακα Ποσών',
    unit: '€',
    generate: () => {
      const kg1 = randInt(2, 4);
      const costPerKg = randInt(3, 7);
      const cost1 = kg1 * costPerKg;
      const kg2 = kg1 + randInt(3, 6);
      const cost2 = kg2 * costPerKg;
      return {
        prompt: `Σε έναν πίνακα ποσών και τιμών, τα ${kg1} kg μήλων κοστίζουν ${cost1} €. Πόσα € κοστίζουν τα ${kg2} kg μήλων;`,
        unit: '€',
        correctVal: String(cost2),
        correctText: `${cost2} €`,
        tableData: [
          { item: 'Πρώτη ποσότητα', formula: `${kg1} kg ➔ ${cost1} €`, val: `${cost1} €` },
          { item: 'Δεύτερη ποσότητα', formula: `${kg2} kg ➔ x €`, val: 'x €' },
          { item: 'Σταυρωτό γινόμενο', formula: `(${cost1} · ${kg2}) : ${kg1}`, val: `${cost2} €` }
        ],
        explain: `Από τον πίνακα ποσών και τιμών προκύπτει η αναλογία: ${kg1} : ${cost1} ＝ ${kg2} : x. Εφαρμόζοντας χιαστί πολλαπλασιασμό: x ＝ (${cost1} · ${kg2}) : ${kg1} ＝ ${cost1 * kg2} : ${kg1} ＝ ${cost2} €.`,
        distractors: [`${cost2 + 4} €`, `${cost2 - 3} €`, `${cost2 + 6} €`]
      };
    }
  },
  {
    id: 'p_xiasti_std_2',
    title: 'Διαδρομή Τρένου με Σταθερή Ταχύτητα',
    unit: 'km',
    generate: () => {
      const hours1 = randInt(2, 4);
      const speed = randInt(70, 90);
      const dist1 = hours1 * speed;
      const hours2 = hours1 + randInt(2, 3);
      const dist2 = hours2 * speed;
      return {
        prompt: `Ένα τρένο διανύει ${dist1} km σε ${hours1} ώρες. Πόσα km θα διανύσει σε ${hours2} ώρες κινούμενο με τον ίδιο σταθερό ρυθμό;`,
        unit: 'km',
        correctVal: String(dist2),
        correctText: `${dist2} km`,
        tableData: [
          { item: 'Χρόνος 1 ➔ Απόσταση 1', formula: `${hours1} h ➔ ${dist1} km`, val: `${dist1} km` },
          { item: 'Χρόνος 2 ➔ Απόσταση 2', formula: `${hours2} h ➔ x km`, val: 'x km' },
          { item: 'Υπολογισμός χιαστί', formula: `(${dist1} · ${hours2}) : ${hours1}`, val: `${dist2} km` }
        ],
        explain: `Οργανώνουμε τον πίνακα: ${hours1} h αντιστοιχούν σε ${dist1} km και ${hours2} h σε x km. Με χιαστί υπολογίζουμε: x ＝ (${dist1} · ${hours2}) : ${hours1} ＝ ${dist2} km.`,
        distractors: [`${dist2 + 25} km`, `${dist2 - 30} km`, `${dist2 + 50} km`]
      };
    }
  },
  {
    id: 'p_xiasti_std_3',
    title: 'Συναρμολόγηση Εξαρτημάτων',
    unit: 'τεμάχια',
    generate: () => {
      const workers1 = randInt(2, 4);
      const production1 = workers1 * 45;
      const workers2 = workers1 + randInt(3, 5);
      const production2 = workers2 * 45;
      return {
        prompt: `Σε μια γραμμή παραγωγής ${workers1} εργάτες συναρμολογούν ${production1} εξαρτήματα. Πόσα εξαρτήματα θα συναρμολογήσουν ${workers2} εργάτες με την ίδια απόδοση;`,
        unit: 'τεμάχια',
        correctVal: String(production2),
        correctText: `${production2} τεμάχια`,
        tableData: [
          { item: 'Εργάτες 1', formula: `${workers1} εργάτες`, val: `${production1} τεμ.` },
          { item: 'Εργάτες 2', formula: `${workers2} εργάτες`, val: 'x τεμ.' },
          { item: 'Σταυρωτά γινόμενα', formula: `(${production1} · ${workers2}) : ${workers1}`, val: `${production2} τεμ.` }
        ],
        explain: `Στήνουμε τα ποσά στον πίνακα: ${workers1} προς ${production1} και ${workers2} προς x. Υπολογίζουμε με χιαστί: x ＝ (${production1} · ${workers2}) : ${workers1} ＝ ${production2} εξαρτήματα.`,
        distractors: [`${production2 + 30} τεμάχια`, `${production2 - 45} τεμάχια`, `${production2 + 60} τεμάχια`]
      };
    }
  },
  {
    id: 'p_xiasti_std_4',
    title: 'Αγορά Βιβλίων',
    unit: '€',
    generate: () => {
      const books1 = randInt(3, 6);
      const priceBook = randInt(8, 14);
      const cost1 = books1 * priceBook;
      const books2 = books1 + randInt(2, 5);
      const cost2 = books2 * priceBook;
      return {
        prompt: `Για την αγορά ${books1} ίδιων βιβλίων πληρώσαμε ${cost1} €. Πόσα € θα πληρώσουμε αν αγοράσουμε ${books2} τέτοια βιβλία;`,
        unit: '€',
        correctVal: String(cost2),
        correctText: `${cost2} €`,
        tableData: [
          { item: 'Πρώτη αγορά', formula: `${books1} βιβλία ➔ ${cost1} €`, val: `${cost1} €` },
          { item: 'Δεύτερη αγορά', formula: `${books2} βιβλία ➔ x €`, val: 'x €' },
          { item: 'Χιαστί υπολογισμός', formula: `(${cost1} · ${books2}) : ${books1}`, val: `${cost2} €` }
        ],
        explain: `Οργανώνουμε τα δεδομένα σε πίνακα: x ＝ (${cost1} · ${books2}) : ${books1} ＝ ${cost1 * books2} : ${books1} ＝ ${cost2} €.`,
        distractors: [`${cost2 + 8} €`, `${cost2 - 6} €`, `${cost2 + 12} €`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_xiasti_hard_1',
    title: 'Υπολογισμός Κόστους με Μετατροπή Μονάδων',
    unit: '€',
    generate: () => {
      const massKg = 2.5;
      const costEur = 7.5;
      const massGrams = randInt(6, 14) * 250;
      const massKgTarget = massGrams / 1000;
      const finalCost = (costEur * massKgTarget) / massKg;
      return {
        prompt: `Τα ${formatNum(massKg)} kg ενός προϊόντος κοστίζουν ${formatNum(costEur)} €. Πόσα € κοστίζουν ${massGrams} g από το ίδιο προϊόν;`,
        unit: '€',
        correctVal: formatNum(finalCost),
        correctText: `${formatNum(finalCost)} €`,
        tableData: [
          { item: 'Μετατροπή κιλών σε γραμμάρια', formula: `${formatNum(massKg)} kg · 1.000`, val: `${massKg * 1000} g` },
          { item: 'Σταυρωτό γινόμενο', formula: `(${formatNum(costEur)} · ${massGrams}) : ${massKg * 1000}`, val: `${formatNum(finalCost)} €` }
        ],
        explain: `Μετατρέπουμε πρώτα τα ${formatNum(massKg)} kg σε γραμμάρια: ${formatNum(massKg)} · 1.000 ＝ ${massKg * 1000} g. Τοποθετούμε στον πίνακα: ${massKg * 1000} : ${formatNum(costEur)} ＝ ${massGrams} : x. Με χιαστί βρίσκουμε: x ＝ (${formatNum(costEur)} · ${massGrams}) : ${massKg * 1000} ＝ ${formatNum(finalCost)} €.`,
        distractors: [`${formatNum(finalCost + 1.5)} €`, `${formatNum(Math.max(1, finalCost - 1.2))} €`, `${formatNum(finalCost * 1.5)} €`]
      };
    }
  },
  {
    id: 'p_xiasti_hard_2',
    title: 'Χρόνος Λειτουργίας Εκτυπωτή',
    unit: 'αφίσες',
    generate: () => {
      const extraMinutes = 30;
      const totalMin1 = 90;
      const pages1 = 45;
      const targetHours = 2;
      const targetMin = targetHours * 60;
      const targetPages = (pages1 * targetMin) / totalMin1;
      return {
        prompt: `Μια εκτυπωτική μηχανή τυπώνει ${pages1} αφίσες σε 1 ώρα και ${extraMinutes} λεπτά. Πόσες αφίσες θα τυπώσει σε ${targetHours} ώρες συνεχούς λειτουργίας;`,
        unit: 'αφίσες',
        correctVal: String(targetPages),
        correctText: `${targetPages} αφίσες`,
        tableData: [
          { item: 'Χρόνος 1 (σε λεπτά)', formula: '1 h 30 min', val: `${totalMin1} min` },
          { item: 'Χρόνος 2 (σε λεπτά)', formula: `${targetHours} h · 60`, val: `${targetMin} min` },
          { item: 'Χιαστί υπολογισμός', formula: `(${pages1} · ${targetMin}) : ${totalMin1}`, val: `${targetPages} αφίσες` }
        ],
        explain: `Μετατρέπουμε όλες τις μονάδες χρόνου σε λεπτά: 1 h 30 min ＝ 90 min και 2 h ＝ 120 min. Στήνουμε τον πίνακα: 90 : 45 ＝ 120 : x. Εφαρμόζοντας χιαστί: x ＝ (45 · 120) : 90 ＝ 5.400 : 90 ＝ ${targetPages} αφίσες.`,
        distractors: [`${targetPages + 10} αφίσες`, `${targetPages - 15} αφίσες`, `${targetPages + 20} αφίσες`]
      };
    }
  },
  {
    id: 'p_xiasti_hard_3',
    title: 'Υπολογισμός Έκπτωσης με Πίνακα',
    unit: '€',
    generate: () => {
      const origEur = randInt(12, 25) * 10;
      const pct = 25;
      const discEur = (origEur * pct) / 100;
      const payEur = origEur - discEur;
      return {
        prompt: `Σε περίοδο εκπτώσεων ένα κατάστημα προσφέρει έκπτωση ${pct} %. Αν ένα μπουφάν είχε αρχική τιμή ${origEur} €, πόσα € θα πληρώσει τελικά ο αγοραστής;`,
        unit: '€',
        correctVal: formatNum(payEur),
        correctText: `${formatNum(payEur)} €`,
        tableData: [
          { item: 'Αναλογία έκπτωσης', formula: '100 € αρχική ➔ 75 € τελική', val: '25% έκπτωση' },
          { item: 'Χιαστί υπολογισμός', formula: `(${100 - pct} · ${origEur}) : 100`, val: `${formatNum(payEur)} €` }
        ],
        explain: `Η αρχική τιμή 100 € αντιστοιχεί σε τελική πληρωμή ${100 - pct} €. Στήνουμε τον πίνακα ποσών και τιμών: 100 : ${100 - pct} ＝ ${origEur} : x. Με χιαστί υπολογίζουμε: x ＝ (${100 - pct} · ${origEur}) : 100 ＝ ${formatNum(payEur)} €.`,
        distractors: [`${formatNum(payEur + 15)} €`, `${formatNum(payEur - 10)} €`, `${formatNum(origEur - 20)} €`]
      };
    }
  },
  {
    id: 'p_xiasti_hard_4',
    title: 'Πραγματική Απόσταση σε Χάρτη',
    unit: 'km',
    generate: () => {
      const scale = 250000;
      const mapCm = 4.5;
      const realKm = (mapCm * scale) / 100000;
      return {
        prompt: `Σε έναν οδικό χάρτη με κλίμακα 1 : ${formatNum(scale)}, δύο πόλεις απέχουν ${formatNum(mapCm)} cm. Πόσα km είναι η πραγματική απόσταση μεταξύ τους;`,
        unit: 'km',
        correctVal: formatNum(realKm),
        correctText: `${formatNum(realKm)} km`,
        tableData: [
          { item: 'Κλίμακα', formula: '1 cm χάρτη ➔ 250.000 cm', val: '2,5 km' },
          { item: 'Πραγματική απόσταση σε cm', formula: `${formatNum(mapCm)} · ${scale}`, val: `${mapCm * scale} cm` },
          { item: 'Μετατροπή σε km', formula: `(${mapCm * scale}) : 100.000`, val: `${formatNum(realKm)} km` }
        ],
        explain: `Η κλίμακα δηλώνει ότι 1 cm στον χάρτη ισούται με ${scale} cm στην πραγματικότητα. Με χιαστί: x ＝ ${formatNum(mapCm)} · ${scale} ＝ ${mapCm * scale} cm. Μετατρέπουμε τα cm σε km διαιρώντας με το 100.000: ${mapCm * scale} : 100.000 ＝ ${formatNum(realKm)} km.`,
        distractors: [`${formatNum(realKm + 2.5)} km`, `${formatNum(Math.max(1, realKm - 2))} km`, `${formatNum(realKm * 1.5)} km`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Συμπλήρωση πίνακα ποσών & εύρεση x
  const q1A = randInt(3, 6);
  const q1B = randInt(12, 30);
  const q1C = randInt(7, 12);
  const q1XVal = (q1B * q1C) / q1A;
  const q1FinalVal = Number.isInteger(q1XVal) ? q1XVal : Number(q1XVal.toFixed(2));

  // Q2: MCQ - Επιλογή σωστής εξίσωσης χιαστί
  const q2P1 = randInt(4, 8);
  const q2P2 = randInt(15, 35);
  const q2P3 = randInt(9, 14);
  const q2CorrectEq = `x ＝ (${q2P2} · ${q2P3}) : ${q2P1}`;
  const q2Options = shuffle([
    ...new Set([
      q2CorrectEq,
      `x ＝ (${q2P1} · ${q2P2}) : ${q2P3}`,
      `x ＝ (${q2P1} · ${q2P3}) : ${q2P2}`,
      `x ＝ (${q2P2} ＋ ${q2P3}) : ${q2P1}`
    ])
  ]);

  // Q3: Input - Άγνωστος στη θέση του πρώτου ποσού (x στην πρώτη στήλη)
  const q3K = randInt(3, 7);
  const q3Mult = randInt(4, 9);
  const q3B = q3K * q3Mult;
  const q3C = randInt(5, 12);
  const q3D = q3C * q3Mult;
  const q3XVal = q3K;

  // Q4: MCQ - Έλεγχος αν ένας πίνακας είναι πίνακας ανάλογων ποσών
  const q4Base1 = randInt(2, 5);
  const q4Base2 = randInt(6, 10);
  const q4Mult = randInt(2, 4);
  const q4IsTrue = Math.random() > 0.4;
  const q4Row2Col1 = q4Base1 * q4Mult;
  const q4Row2Col2 = q4IsTrue ? q4Base2 * q4Mult : q4Base2 * q4Mult + randInt(2, 5);

  const q4CorrectAns = q4IsTrue
    ? `Ναι, γιατί τα σταυρωτά γινόμενα είναι ίσα (${q4Base1} · ${q4Row2Col2} ＝ ${q4Base2} · ${q4Row2Col1})`
    : `Όχι, γιατί τα σταυρωτά γινόμενα δεν είναι ίσα (${q4Base1 * q4Row2Col2} ≠ ${q4Base2 * q4Row2Col1})`;
  const q4WrongAns = q4IsTrue
    ? 'Όχι, γιατί οι αριθμοί δεν είναι ίσοι'
    : 'Ναι, γιατί τα ποσά αυξάνονται';
  const q4Options = shuffle([q4CorrectAns, q4WrongAns]);

  // Q5: Input - Υπολογισμός x σε σχέση κλασμάτων
  const q5N = randInt(3, 8);
  const q5D = randInt(4, 9);
  const q5M = randInt(2, 5);
  const q5TargetN = q5N * q5M;
  const q5TargetD = q5D * q5M;

  // Q6: MCQ - Σταυρωτό γινόμενο
  const q6A = randInt(5, 9);
  const q6B = randInt(11, 18);
  const q6C = randInt(3, 7);
  const q6CorrectMult = `${q6A} · x ＝ ${q6B} · ${q6C}`;
  const q6Options = shuffle([
    ...new Set([
      q6CorrectMult,
      `${q6A} · ${q6B} ＝ ${q6C} · x`,
      `${q6A} · ${q6C} ＝ ${q6B} · x`,
      `${q6A} ＋ x ＝ ${q6B} ＋ ${q6C}`
    ])
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
      inputType: 'decimal',
      title: 'Συμπλήρωση Πίνακα Ποσών',
      prompt: `Σε έναν πίνακα ανάλογων ποσών, το ${q1A} αντιστοιχεί στο ${q1B} και το ${q1C} αντιστοιχεί στο x. Ποια είναι η τιμή του x;`,
      correct: formatNum(q1FinalVal),
      explain: `Από τον πίνακα ποσών και τιμών σχηματίζουμε την αναλογία: ${q1A} : ${q1B} ＝ ${q1C} : x. Εφαρμόζοντας χιαστί πολλαπλασιασμό: x ＝ (${q1B} · ${q1C}) : ${q1A} ＝ ${formatNum(q1FinalVal)}.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Μαθηματικός Τύπος Χιαστί',
      prompt: `Αν σε έναν πίνακα ποσών έχουμε: ${q2P1} αντιστοιχεί σε ${q2P2} και ${q2P3} αντιστοιχεί σε x, ποιος είναι ο σωστός τύπος επίλυσης;`,
      options: q2Options,
      correct: q2CorrectEq,
      explain: `Στον χιαστί πολλαπλασιασμό πολλαπλασιάζουμε τα στοιχεία της πλήρους διαγωνίου (${q2P2} · ${q2P3}) και διαιρούμε με το στοιχείο που είναι διαγώνια απέναντι από το x (${q2P1}): ${q2CorrectEq}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Άγνωστος σε Διαφορετική Θέση',
      prompt: `Σε πίνακα ανάλογων ποσών έχουμε στην πρώτη γραμμή [x, ${q3B}] και στη δεύτερη γραμμή [${q3C}, ${q3D}]. Υπολόγισε το x:`,
      correct: String(q3XVal),
      explain: `Σχηματίζουμε την ισότητα των σταυρωτών γινομένων: x · ${q3D} ＝ ${q3B} · ${q3C} ➔ x ＝ (${q3B} · ${q3C}) : ${q3D} ＝ ${q3XVal}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Έλεγχος Πίνακα Αναλογίας',
      prompt: `Είναι ο πίνακας με 1η γραμμή [${q4Base1}, ${q4Base2}] και 2η γραμμή [${q4Row2Col1}, ${q4Row2Col2}] πίνακας ανάλογων ποσών;`,
      options: q4Options,
      correct: q4CorrectAns,
      explain: `Ελέγχουμε τα σταυρωτά γινόμενα (χιαστί): ${q4Base1} · ${q4Row2Col2} ＝ ${q4Base1 * q4Row2Col2} και ${q4Base2} · ${q4Row2Col1} ＝ ${q4Base2 * q4Row2Col1}. ${q4CorrectAns}.`
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Επίλυση με Χιαστί σε Κλάσματα',
      prompt: `Στην ισότητα κλασμάτων ${q5N}/${q5D} ＝ ${q5TargetN}/x, ποια είναι η τιμή του άγνωστου όρου x;`,
      correct: String(q5TargetD),
      explain: `Εφαρμόζοντας σταυρωτά γινόμενα: ${q5N} · x ＝ ${q5D} · ${q5TargetN} ➔ x ＝ (${q5D} · ${q5TargetN}) : ${q5N} ＝ ${q5TargetD}.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Σταυρωτό Γινόμενο',
      prompt: `Από την αναλογία ${q6A} : ${q6B} ＝ ${q6C} : x, ποια σχέση προκύπτει άμεσα;`,
      options: q6Options,
      correct: q6CorrectMult,
      explain: `Σύμφωνα με την ιδιότητα του χιαστί πολλαπλασιασμού, τα σταυρωτά γινόμενα είναι ίσα: ${q6CorrectMult}.`
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
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

export default function XiastiExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase();

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
      title="Ασκήσεις: Αναλογία Χιαστί - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στους πίνακες ποσών και τιμών και στον σταυρωτό πολλαπλασιασμό χιαστί για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/42-analogia-xiasti"
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
                <span>ΚΕΦΑΛΑΙΟ 42 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Αναλογία Χιαστί
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη συμπλήρωση πινάκων ποσών και τιμών, στα σταυρωτά γινόμενα και σε σύνθετα πρακτικά προβλήματα!
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
                          placeholder={q.inputType === 'decimal' ? 'π.χ. 4,5' : 'Απάντηση...'}
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

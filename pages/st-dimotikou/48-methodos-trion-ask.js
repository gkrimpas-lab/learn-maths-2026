// pages/st-dimotikou/48-methodos-trion-ask.js
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
    id: 'm3_std_1',
    title: 'Αγορά Τυριού (Ανάλογα Ποσά)',
    unit: '€',
    generate: () => {
      const kg1 = randInt(3, 5);
      const unitCost = randInt(4, 8);
      const cost1 = kg1 * unitCost;
      const kg2 = kg1 + randInt(3, 6);
      const cost2 = kg2 * unitCost;
      return {
        prompt: `Για ${kg1} kg τυρί πληρώσαμε ${cost1} €. Πόσα € θα πληρώσουμε για ${kg2} kg από το ίδιο τυρί;`,
        unit: '€',
        correctVal: String(cost2),
        correctText: `${cost2} €`,
        tableData: [
          { item: 'Πρώτη ποσότητα', formula: `${kg1} kg ➔ ${cost1} €`, val: `${cost1} €` },
          { item: 'Δεύτερη ποσότητα', formula: `${kg2} kg ➔ x €`, val: 'x €' },
          { item: 'Σταυρωτό γινόμενο (χιαστί)', formula: `(${cost1} · ${kg2}) : ${kg1}`, val: `${cost2} €` }
        ],
        explain: `Τα ποσά είναι ανάλογα (περισσότερα κιλά ➔ περισσότερα χρήματα). Κατάταξη: ${kg1} kg ➔ ${cost1} € και ${kg2} kg ➔ x €. Εφαρμόζουμε χιαστί πολλαπλασιασμό: x ＝ (${cost1} · ${kg2}) : ${kg1} ＝ ${cost2} €.`,
        distractors: [`${cost2 + unitCost} €`, `${cost2 - unitCost} €`, `${cost2 + 2 * unitCost} €`]
      };
    }
  },
  {
    id: 'm3_std_2',
    title: 'Επισκευή Μηχανήματος (Αντιστρόφως Ανάλογα)',
    unit: 'ημέρες',
    generate: () => {
      const w1 = randInt(2, 4);
      const d1 = randInt(6, 12);
      const totalWork = w1 * d1;
      const w2 = w1 + randInt(2, 4);
      const d2 = totalWork / w2;
      const cleanD2 = Number.isInteger(d2) ? d2 : Number(d2.toFixed(1));
      return {
        prompt: `Σε ένα συνεργείο ${w1} μηχανικοί επισκευάζουν ένα μηχάνημα σε ${d1} ημέρες. Σε πόσες ημέρες θα το επισκεύαζαν ${w2} μηχανικοί με τον ίδιο ρυθμό εργασίας;`,
        unit: 'ημέρες',
        correctVal: formatNum(cleanD2),
        correctText: `${formatNum(cleanD2)} ημέρες`,
        tableData: [
          { item: 'Αρχικοί μηχανικοί', formula: `${w1} μηχανικοί ➔ ${d1} ημέρες`, val: `${totalWork} μεροκάματα` },
          { item: 'Νέοι μηχανικοί', formula: `${w2} μηχανικοί ➔ x ημέρες`, val: 'x ημέρες' },
          { item: 'Οριζόντιο γινόμενο', formula: `(${w1} · ${d1}) : ${w2}`, val: `${formatNum(cleanD2)} ημέρες` }
        ],
        explain: `Τα ποσά είναι αντιστρόφως ανάλογα (περισσότεροι μηχανικοί ➔ λιγότερες ημέρες). Κατάταξη: ${w1} ➔ ${d1} και ${w2} ➔ x. Εφαρμόζουμε οριζόντιο πολλαπλασιασμό: x ＝ (${w1} · ${d1}) : ${w2} ＝ ${formatNum(cleanD2)} ημέρες.`,
        distractors: [`${formatNum(cleanD2 + 2)} ημέρες`, `${formatNum(Math.max(1, cleanD2 - 2))} ημέρες`, `${formatNum(cleanD2 + 4)} ημέρες`]
      };
    }
  },
  {
    id: 'm3_std_3',
    title: 'Κίνηση Οχήματος (Ανάλογα Ποσά)',
    unit: 'km',
    generate: () => {
      const hours1 = randInt(2, 4);
      const speed = randInt(70, 95);
      const dist1 = hours1 * speed;
      const hours2 = hours1 + randInt(2, 3);
      const dist2 = hours2 * speed;
      return {
        prompt: `Ένα όχημα διανύει ${dist1} km σε ${hours1} ώρες με σταθερή ταχύτητα. Πόσα km θα διανύσει σε ${hours2} ώρες;`,
        unit: 'km',
        correctVal: String(dist2),
        correctText: `${dist2} km`,
        tableData: [
          { item: 'Χρόνος 1', formula: `${hours1} h ➔ ${dist1} km`, val: `${dist1} km` },
          { item: 'Χρόνος 2', formula: `${hours2} h ➔ x km`, val: 'x km' },
          { item: 'Χιαστί υπολογισμός', formula: `(${dist1} · ${hours2}) : ${hours1}`, val: `${dist2} km` }
        ],
        explain: `Τα ποσά είναι ανάλογα. Κατάταξη: ${hours1} h ➔ ${dist1} km και ${hours2} h ➔ x km. Με χιαστί: x ＝ (${dist1} · ${hours2}) : ${hours1} ＝ ${dist2} km.`,
        distractors: [`${dist2 + 25} km`, `${dist2 - 30} km`, `${dist2 + 50} km`]
      };
    }
  },
  {
    id: 'm3_std_4',
    title: 'Ταχύτητα και Χρόνος Τρένου (Αντιστρόφως Ανάλογα)',
    unit: 'ώρες',
    generate: () => {
      const speed1 = 60;
      const time1 = randInt(3, 5);
      const dist = speed1 * time1;
      const speed2 = 90;
      const time2 = dist / speed2;
      const cleanTime2 = Number.isInteger(time2) ? time2 : Number(time2.toFixed(1));
      return {
        prompt: `Ένα τρένο καλύπτει μια διαδρομή σε ${time1} ώρες με ταχύτητα ${speed1} km/h. Πόσες ώρες θα χρειαστεί αν αυξήσει την ταχύτητά του στα ${speed2} km/h;`,
        unit: 'ώρες',
        correctVal: formatNum(cleanTime2),
        correctText: `${formatNum(cleanTime2)} ώρες`,
        tableData: [
          { item: 'Ταχύτητα 1 ➔ Χρόνος 1', formula: `${speed1} km/h ➔ ${time1} h`, val: `${dist} km` },
          { item: 'Ταχύτητα 2 ➔ Χρόνος 2', formula: `${speed2} km/h ➔ x h`, val: 'x h' },
          { item: 'Οριζόντιο γινόμενο', formula: `(${speed1} · ${time1}) : ${speed2}`, val: `${formatNum(cleanTime2)} h` }
        ],
        explain: `Ταχύτητα και χρόνος είναι αντιστρόφως ανάλογα ποσά (μεγαλύτερη ταχύτητα ➔ λιγότερος χρόνος). Οριζόντιος πολλαπλασιασμός: x ＝ (${speed1} · ${time1}) : ${speed2} ＝ ${formatNum(cleanTime2)} ώρες.`,
        distractors: [`${formatNum(cleanTime2 + 1)} ώρες`, `${formatNum(Math.max(1, cleanTime2 - 1))} ώρες`, `${formatNum(cleanTime2 + 2)} ώρες`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'm3_hard_1',
    title: 'Ταχύτητα και Μετατροπή Χρόνου σε Λεπτά',
    unit: 'km/h',
    generate: () => {
      const speed1 = 80;
      const minutes1 = 150;
      const dist = (speed1 * minutes1) / 60;
      const targetMin = 100;
      const reqSpeed = (dist / targetMin) * 60;
      return {
        prompt: `Ένα αυτοκίνητο καλύπτει μια διαδρομή σε 2 ώρες και 30 λεπτά με σταθερή ταχύτητα ${speed1} km/h. Με ποια ταχύτητα σε km/h πρέπει να κινηθεί για να καλύψει την ίδια διαδρομή σε 1 ώρα και 40 λεπτά;`,
        unit: 'km/h',
        correctVal: String(reqSpeed),
        correctText: `${reqSpeed} km/h`,
        tableData: [
          { item: 'Μετατροπή χρόνων σε min', formula: '150 min και 100 min', val: 'Σταθερή απόσταση' },
          { item: 'Οριζόντιος υπολογισμός', formula: `(${speed1} · 150) : 100`, val: `${reqSpeed} km/h` }
        ],
        explain: `Μετατρέπουμε τον χρόνο σε λεπτά: 2 h 30 min ＝ 150 min και 1 h 40 min ＝ 100 min. Ταχύτητα και χρόνος είναι αντιστρόφως ανάλογα ποσά (σταθερή απόσταση). Οριζόντιος υπολογισμός: x ＝ (${speed1} · 150) : 100 ＝ 12.000 : 100 ＝ ${reqSpeed} km/h.`,
        distractors: [`${reqSpeed + 15} km/h`, `${reqSpeed - 20} km/h`, `${reqSpeed + 25} km/h`]
      };
    }
  },
  {
    id: 'm3_hard_2',
    title: 'Παραγωγή Ψωμιού με Μετατροπή Μονάδων',
    unit: 'kg',
    generate: () => {
      const flourGrams = 800;
      const breadKg = 1.2;
      const targetFlourKg = 3;
      const targetFlourGrams = 3000;
      const resBread = (breadKg * targetFlourGrams) / flourGrams;
      return {
        prompt: `Από ${flourGrams} g αλεύρι παρασκευάζονται ${formatNum(breadKg)} kg ψωμί. Πόσα kg ψωμί θα παρασκευαστούν χρησιμοποιώντας ${targetFlourKg} kg από το ίδιο αλεύρι;`,
        unit: 'kg',
        correctVal: formatNum(resBread),
        correctText: `${formatNum(resBread)} kg`,
        tableData: [
          { item: 'Μετατροπή kg σε γραμμάρια', formula: `${targetFlourKg} kg · 1.000`, val: `${targetFlourGrams} g` },
          { item: 'Σταυρωτό γινόμενο (χιαστί)', formula: `(${formatNum(breadKg)} · 3.000) : ${flourGrams}`, val: `${formatNum(resBread)} kg` }
        ],
        explain: `Μετατρέπουμε τα ${targetFlourKg} kg σε γραμμάρια: 3.000 g. Τα ποσά είναι ανάλογα. Εφαρμόζουμε χιαστί: x ＝ (${formatNum(breadKg)} · 3.000) : ${flourGrams} ＝ 3.600 : 800 ＝ ${formatNum(resBread)} kg.`,
        distractors: [`${formatNum(resBread + 1)} kg`, `${formatNum(Math.max(1, resBread - 1))} kg`, `${formatNum(resBread * 1.5)} kg`]
      };
    }
  },
  {
    id: 'm3_hard_3',
    title: 'Υπόλοιπο Έργου με Προσθήκη Εργατών',
    unit: 'ημέρες',
    generate: () => {
      const initWorkers = 6;
      const initDays = 18;
      const doneDays = 3;
      const remDays = initDays - doneDays;
      const remWork = initWorkers * remDays;
      const addedWorkers = 3;
      const totalWorkers = initWorkers + addedWorkers;
      const finalDays = remWork / totalWorkers;
      return {
        prompt: `Μια ομάδα ${initWorkers} εργατών είχε προγραμματίσει να τελειώσει ένα έργο σε ${initDays} ημέρες. Αφού εργάστηκαν μόνοι τους για ${doneDays} ημέρες, προστέθηκαν στην ομάδα άλλοι ${addedWorkers} εργάτες. Σε πόσες ημέρες θα παραδοθεί το υπόλοιπο του έργου;`,
        unit: 'ημέρες',
        correctVal: String(finalDays),
        correctText: `${finalDays} ημέρες`,
        tableData: [
          { item: 'Έργο που απομένει', formula: `${initWorkers} · (${initDays} － ${doneDays})`, val: `${remWork} μεροκάματα` },
          { item: 'Νέος αριθμός εργατών', formula: `${initWorkers} ＋ ${addedWorkers}`, val: `${totalWorkers} εργάτες` },
          { item: 'Οριζόντιο γινόμενο', formula: `(${initWorkers} · ${remDays}) : ${totalWorkers}`, val: `${finalDays} ημέρες` }
        ],
        explain: `Το έργο που απομένει αντιστοιχεί σε ${initWorkers} εργάτες για ${remDays} ημέρες. Τώρα οι εργάτες έγιναν ${totalWorkers}. Ποσά αντιστρόφως ανάλογα: x ＝ (${initWorkers} · ${remDays}) : ${totalWorkers} ＝ 90 : 9 ＝ ${finalDays} ημέρες.`,
        distractors: [`${finalDays + 2} ημέρες`, `${finalDays - 2} ημέρες`, `${finalDays + 4} ημέρες`]
      };
    }
  },
  {
    id: 'm3_hard_4',
    title: 'Υπολογισμός Ελαιολάδου με Μετατροπή ml',
    unit: 'kg',
    generate: () => {
      const olivesKg = 30;
      const oilLiters = 5;
      const targetMlLiters = 9000;
      const targetLiters = 9;
      const olivesNeeded = targetLiters * (olivesKg / oilLiters);
      return {
        prompt: `Από ${olivesKg} kg ελιές παράγονται ${oilLiters} l λάδι. Πόσα kg ελιές απαιτούνται για να παραχθούν ${targetMlLiters} ml ελαιόλαδο ίδιας ποιότητας;`,
        unit: 'kg',
        correctVal: String(olivesNeeded),
        correctText: `${olivesNeeded} kg`,
        tableData: [
          { item: 'Μετατροπή ml σε λίτρα', formula: `${targetMlLiters} ml : 1.000`, val: `${targetLiters} l` },
          { item: 'Αναλογία (χιαστί)', formula: `(${olivesKg} · ${targetLiters}) : ${oilLiters}`, val: `${olivesNeeded} kg` }
        ],
        explain: `Μετατρέπουμε τα ${targetMlLiters} ml σε λίτρα: 9 l. Τα ποσά είναι ανάλογα. Με χιαστί: x ＝ (${olivesKg} · 9) : ${oilLiters} ＝ 270 : 5 ＝ ${olivesNeeded} kg ελιές.`,
        distractors: [`${olivesNeeded + 6} kg`, `${olivesNeeded - 6} kg`, `${olivesNeeded + 10} kg`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Υπολογισμός x σε Ανάλογα Ποσά (Χιαστί)
  const q1A = randInt(3, 6);
  const q1B = randInt(12, 24);
  const q1C = q1A * randInt(2, 4);
  const q1D = (q1B * q1C) / q1A;

  // Q2: MCQ - Βήματα μεθόδου των τριών
  const q2CorrectSeq = '1. Κατάταξη δεδομένων σε ομώνυμες στήλες, 2. Έλεγχος είδους ποσών (ανάλογα ή αντίστροφα), 3. Επιλογή σωστού τύπου επίλυσης';
  const q2Options = shuffle([
    q2CorrectSeq,
    '1. Πολλαπλασιασμός όλων των αριθμών, 2. Διαίρεση με το 100, 3. Αφαίρεση του μικρότερου',
    '1. Χιαστί πολλαπλασιασμός χωρίς έλεγχο, 2. Πρόσθεση των στηλών, 3. Αντιστροφή όρων',
    '1. Μετατροπή των αριθμών σε δεκαδικούς, 2. Σχεδίαση γραφικής παράστασης, 3. Μέτρηση με χάρακα'
  ]);

  // Q3: Input - Υπολογισμός x σε Αντιστρόφως Ανάλογα (Οριζόντια)
  const q3W1 = randInt(2, 5);
  const q3D1 = randInt(8, 16);
  const q3Total = q3W1 * q3D1;
  const q3W2 = randInt(6, 10);
  const q3D2 = q3Total / q3W2;
  const q3CleanD2 = Number.isInteger(q3D2) ? q3D2 : Number(q3D2.toFixed(1));

  // Q4: MCQ - Ονομασία μεθόδου
  const q4CorrectReason = 'Επειδή γνωρίζουμε 3 όρους και αναζητούμε τον 4ο άγνωστο όρο';
  const q4Options = shuffle([
    q4CorrectReason,
    'Επειδή περιλαμβάνει υποχρεωτικά 3 διαφορετικά ποσά',
    'Επειδή λύνεται πάντοτε σε 3 λεπτά',
    'Επειδή χρησιμοποιεί 3 διαδοχικούς πίνακες'
  ]);

  // Q5: Input - Πρόβλημα Αναγωγής στη Μονάδα
  const q5Items = randInt(4, 7);
  const q5UnitPrice = randInt(3, 6);
  const q5InitialCost = q5Items * q5UnitPrice;
  const q5TargetItems = q5Items + randInt(3, 5);
  const q5ExpectedCost = q5TargetItems * q5UnitPrice;

  // Q6: MCQ - Χιαστί ή Οριζόντια
  const q6CorrectDiff = 'Στα ανάλογα πολλαπλασιάζουμε διαγώνια (χιαστί), ενώ στα αντιστρόφως ανάλογα πολλαπλασιάζουμε οριζόντια';
  const q6Options = shuffle([
    q6CorrectDiff,
    'Στα ανάλογα πολλαπλασιάζουμε οριζόντια και στα αντίστροφα διαγώνια',
    'Και στα δύο είδη ποσών κάνουμε ακριβώς τον ίδιο χιαστί πολλαπλασιασμό',
    'Στα ανάλογα κάνουμε πρόσθεση και στα αντίστροφα αφαίρεση'
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
      title: 'Επίλυση Ανάλογων Ποσών',
      prompt: `Στην κατάταξη ανάλογων ποσών: ${q1A} kg κοστίζουν ${q1B} € και ${q1C} kg κοστίζουν x €. Πόσα € είναι το x;`,
      correct: String(q1D),
      explain: `Στα ανάλογα ποσά εφαρμόζουμε χιαστί πολλαπλασιασμό: x ＝ (${q1B} · ${q1C}) : ${q1A} ＝ ${q1B * q1C} : ${q1A} ＝ ${q1D} €.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Τα Βήματα της Μεθόδου',
      prompt: 'Ποια είναι τα βασικά βήματα που ακολουθούμε για τη λύση ενός προβλήματος με τη μέθοδο των τριών;',
      options: q2Options,
      correct: q2CorrectSeq,
      explain: 'Πρώτα κατατάσσουμε τα ομοειδή ποσά το ένα κάτω από το άλλο, μετά ελέγχουμε αν είναι ανάλογα ή αντιστρόφως ανάλογα, και τέλος επιλέγουμε τον αντίστοιχο τύπο (χιαστί ή οριζόντιο).'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: 'Επίλυση Αντιστρόφως Ανάλογων Ποσών',
      prompt: `Στην κατάταξη αντιστρόφως ανάλογων ποσών: ${q3W1} εργάτες θέλουν ${q3D1} ημέρες και ${q3W2} εργάτες θέλουν x ημέρες. Πόσες ημέρες είναι το x;`,
      correct: formatNum(q3CleanD2),
      explain: `Στα αντιστρόφως ανάλογα ποσά εφαρμόζουμε οριζόντιο πολλαπλασιασμό: x ＝ (${q3W1} · ${q3D1}) : ${q3W2} ＝ ${q3Total} : ${q3W2} ＝ ${formatNum(q3CleanD2)} ημέρες.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Ονομασία της Μεθόδου',
      prompt: 'Για ποιο λόγο η μέθοδος ονομάζεται «Απλή Μέθοδος των Τριών»;',
      options: q4Options,
      correct: q4CorrectReason,
      explain: 'Ονομάζεται έτσι επειδή δίνονται τρεις γνωστές τιμές ανάμεσα σε δύο ποσά και ζητείται ο υπολογισμός της τέταρτης άγνωστης τιμής.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Αναγωγή στη Μονάδα',
      prompt: `Αν ${q5Items} τεμάχια ενός είδους κοστίζουν ${q5InitialCost} €, πόσα € κοστίζουν ${q5TargetItems} ίδια τεμάχια;`,
      correct: String(q5ExpectedCost),
      explain: `Το 1 τεμάχιο κοστίζει ${q5InitialCost} : ${q5Items} ＝ ${q5UnitPrice} €. Τα ${q5TargetItems} τεμάχια κοστίζουν: ${q5TargetItems} · ${q5UnitPrice} ＝ ${q5ExpectedCost} €.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Χιαστί ή Οριζόντια;',
      prompt: 'Πώς διαφέρει ο υπολογισμός του αγνώστου x στα ανάλογα σε σχέση με τα αντιστρόφως ανάλογα ποσά;',
      options: q6Options,
      correct: q6CorrectDiff,
      explain: 'Στα ανάλογα ποσά ισχύει η ισότητα των σταυρωτών γινομένων (χιαστί), ενώ στα αντιστρόφως ανάλογα ποσά ισχύει η ισότητα των οριζόντιων γινομένων (σταθερό γινόμενο).'
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

export default function MethodosTrionExercisesPage() {
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
      title="Ασκήσεις: Η Απλή Μέθοδος των Τριών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην απλή μέθοδο των τριών, στα ανάλογα και αντιστρόφως ανάλογα ποσά για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/48-methodos-trion"
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
                <span>ΚΕΦΑΛΑΙΟ 48 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Η Απλή Μέθοδος των Τριών
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην κατάταξη ποσών, στη διάκριση ανάλογων και αντιστρόφως ανάλογων ποσών και στον υπολογισμό του αγνώστου!
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
                      {q.tableData && (
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

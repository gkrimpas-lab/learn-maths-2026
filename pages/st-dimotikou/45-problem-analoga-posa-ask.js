// pages/st-dimotikou/45-problem-analoga-posa-ask.js
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
    id: 'prob_std_1',
    title: 'Αγορά Μήλων με Αναγωγή στη Μονάδα',
    unit: '€',
    generate: () => {
      const kg1 = randInt(3, 5);
      const unitRate = randInt(4, 7);
      const cost1 = kg1 * unitRate;
      const kg2 = kg1 + randInt(3, 6);
      const cost2 = kg2 * unitRate;
      return {
        prompt: `Για ${kg1} kg μήλα πληρώσαμε ${cost1} €. Πόσα € θα πληρώσουμε για ${kg2} kg από τα ίδια μήλα;`,
        unit: '€',
        correctVal: String(cost2),
        correctText: `${cost2} €`,
        tableData: [
          { item: 'Αναγωγή στη μονάδα (1 kg)', formula: `${cost1} : ${kg1}`, val: `${unitRate} €/kg` },
          { item: 'Νέα ποσότητα (x)', formula: `${kg2} kg`, val: `${kg2} kg` },
          { item: 'Τελικό κόστος', formula: `${kg2} · ${unitRate}`, val: `${cost2} €` }
        ],
        explain: `Με αναγωγή στη μονάδα: το 1 kg κοστίζει ${cost1} : ${kg1} ＝ ${unitRate} €. Άρα τα ${kg2} kg κοστίζουν ${kg2} · ${unitRate} ＝ ${cost2} €.`,
        distractors: [`${cost2 + unitRate} €`, `${cost2 - unitRate} €`, `${cost2 + 2 * unitRate} €`]
      };
    }
  },
  {
    id: 'prob_std_2',
    title: 'Διαδρομή με Σταθερή Ταχύτητα',
    unit: 'km',
    generate: () => {
      const hours1 = randInt(2, 4);
      const speed = randInt(65, 85);
      const dist1 = hours1 * speed;
      const hours2 = hours1 + randInt(2, 3);
      const dist2 = hours2 * speed;
      return {
        prompt: `Ένα αυτοκίνητο διανύει ${dist1} km σε ${hours1} ώρες. Πόσα km θα διανύσει σε ${hours2} ώρες αν διατηρεί σταθερή ταχύτητα;`,
        unit: 'km',
        correctVal: String(dist2),
        correctText: `${dist2} km`,
        tableData: [
          { item: 'Ταχύτητα (Απόσταση ανά 1 h)', formula: `${dist1} : ${hours1}`, val: `${speed} km/h` },
          { item: 'Χρόνος ταξιδιού', formula: `${hours2} ώρες`, val: `${hours2} h` },
          { item: 'Συνολική απόσταση', formula: `${hours2} · ${speed}`, val: `${dist2} km` }
        ],
        explain: `Σε 1 ώρα διανύει ${dist1} : ${hours1} ＝ ${speed} km (ταχύτητα). Σε ${hours2} ώρες θα διανύσει: ${hours2} · ${speed} ＝ ${dist2} km.`,
        distractors: [`${dist2 + speed} km`, `${dist2 - speed} km`, `${dist2 + 30} km`]
      };
    }
  },
  {
    id: 'prob_std_3',
    title: 'Αναλογία Αυγών και Μπισκότων',
    unit: 'μπισκότα',
    generate: () => {
      const eggs1 = randInt(2, 4);
      const mult = randInt(4, 6);
      const cookies1 = eggs1 * mult * 5;
      const eggs2 = eggs1 + randInt(2, 4);
      const cookies2 = eggs2 * mult * 5;
      return {
        prompt: `Με ${eggs1} αυγά μια ζαχαροπλάστης φτιάχνει ${cookies1} μπισκότα. Πόσα μπισκότα θα φτιάξει με ${eggs2} αυγά ακολουθώντας την ίδια αναλογία;`,
        unit: 'μπισκότα',
        correctVal: String(cookies2),
        correctText: `${cookies2} μπισκότα`,
        tableData: [
          { item: 'Μπισκότα ανά 1 αυγό', formula: `${cookies1} : ${eggs1}`, val: `${mult * 5} τεμάχια` },
          { item: 'Νέα ποσότητα αυγών', formula: `${eggs2} αυγά`, val: `${eggs2}` },
          { item: 'Συνολικά μπισκότα', formula: `${eggs2} · ${mult * 5}`, val: `${cookies2} μπισκότα` }
        ],
        explain: `Με 1 αυγό φτιάχνονται ${cookies1} : ${eggs1} ＝ ${mult * 5} μπισκότα. Με ${eggs2} αυγά θα φτιαχτούν: ${eggs2} · ${mult * 5} ＝ ${cookies2} μπισκότα.`,
        distractors: [`${cookies2 + 15} μπισκότα`, `${cookies2 - 20} μπισκότα`, `${cookies2 + 30} μπισκότα`]
      };
    }
  },
  {
    id: 'prob_std_4',
    title: 'Ημερομίσθιο και Αμοιβή Τεχνίτη',
    unit: '€',
    generate: () => {
      const days1 = randInt(3, 6);
      const earnPerDay = randInt(35, 55);
      const total1 = days1 * earnPerDay;
      const days2 = days1 + randInt(3, 5);
      const total2 = days2 * earnPerDay;
      return {
        prompt: `Ένας τεχνίτης αμείφθηκε με ${total1} € για εργασία ${days1} ημερών. Πόσα € θα λάβει αν εργαστεί για ${days2} ημέρες με το ίδιο ημερομίσθιο;`,
        unit: '€',
        correctVal: String(total2),
        correctText: `${total2} €`,
        tableData: [
          { item: 'Ημερομίσθιο (1 ημέρα)', formula: `${total1} : ${days1}`, val: `${earnPerDay} €/ημέρα` },
          { item: 'Ημέρες εργασίας', formula: `${days2} ημέρες`, val: `${days2}` },
          { item: 'Συνολική αμοιβή', formula: `${days2} · ${earnPerDay}`, val: `${total2} €` }
        ],
        explain: `Το ημερομίσθιο (τιμή της μονάδας) είναι ${total1} : ${days1} ＝ ${earnPerDay} €/ημέρα. Για ${days2} ημέρες θα λάβει: ${days2} · ${earnPerDay} ＝ ${total2} €.`,
        distractors: [`${total2 + earnPerDay} €`, `${total2 - earnPerDay} €`, `${total2 + 40} €`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'prob_hard_1',
    title: 'Παραγωγή Ελαιολάδου με Μετατροπή Μονάδων',
    unit: 'kg',
    generate: () => {
      const olivesKg = 24;
      const oilLiters = 4;
      const targetMlLiters = 7500;
      const targetLiters = targetMlLiters / 1000;
      const olivesNeeded = targetLiters * (olivesKg / oilLiters);
      return {
        prompt: `Από ${olivesKg} kg ελιές παράγονται ${oilLiters} l ελαιόλαδο. Πόσα kg ελιές απαιτούνται για να παραχθούν ${targetMlLiters} ml ελαιόλαδο ίδιας ποιότητας;`,
        unit: 'kg',
        correctVal: formatNum(olivesNeeded),
        correctText: `${formatNum(olivesNeeded)} kg`,
        tableData: [
          { item: 'Μετατροπή ml σε λίτρα', formula: `${targetMlLiters} ml : 1.000`, val: `${formatNum(targetLiters)} l` },
          { item: 'Ελιές ανά 1 l λάδι', formula: `${olivesKg} : ${oilLiters}`, val: '6 kg/l' },
          { item: 'Απαιτούμενες ελιές', formula: `${formatNum(targetLiters)} · 6`, val: `${formatNum(olivesNeeded)} kg` }
        ],
        explain: `Μετατρέπουμε τα ml σε λίτρα: ${targetMlLiters} ml ＝ ${formatNum(targetLiters)} l. Για 1 l λάδι χρειάζονται ${olivesKg} : ${oilLiters} ＝ 6 kg ελιές. Για ${formatNum(targetLiters)} l απαιτούνται: ${formatNum(targetLiters)} · 6 ＝ ${formatNum(olivesNeeded)} kg ελιές.`,
        distractors: [`${formatNum(olivesNeeded + 6)} kg`, `${formatNum(Math.max(1, olivesNeeded - 6))} kg`, `${formatNum(olivesNeeded + 12)} kg`]
      };
    }
  },
  {
    id: 'prob_hard_2',
    title: 'Παραγωγή Ψωμιού με Μετατροπή Μονάδων',
    unit: 'kg',
    generate: () => {
      const flourGrams = 750;
      const breadKg = 1.2;
      const targetFlourKg = 2.5;
      const targetFlourGrams = targetFlourKg * 1000;
      const breadProduced = (breadKg * targetFlourGrams) / flourGrams;
      return {
        prompt: `Από ${flourGrams} g αλεύρι ένας φούρναρης παρασκευάζει ${formatNum(breadKg)} kg ψωμί. Πόσα kg ψωμί θα παρασκευάσει χρησιμοποιώντας ${formatNum(targetFlourKg)} kg από το ίδιο αλεύρι;`,
        unit: 'kg',
        correctVal: formatNum(breadProduced),
        correctText: `${formatNum(breadProduced)} kg`,
        tableData: [
          { item: 'Μετατροπή kg σε γραμμάρια', formula: `${formatNum(targetFlourKg)} kg · 1.000`, val: `${targetFlourGrams} g` },
          { item: 'Αναλογία χιαστί', formula: `(${formatNum(breadKg)} · ${targetFlourGrams}) : ${flourGrams}`, val: `${formatNum(breadProduced)} kg` }
        ],
        explain: `Μετατρέπουμε τα ${formatNum(targetFlourKg)} kg σε γραμμάρια: ${targetFlourGrams} g. Στήνουμε την αναλογία: ${flourGrams} : ${formatNum(breadKg)} ＝ ${targetFlourGrams} : x. Με χιαστί: x ＝ (${formatNum(breadKg)} · ${targetFlourGrams}) : ${flourGrams} ＝ ${formatNum(breadProduced)} kg.`,
        distractors: [`${formatNum(breadProduced + 0.8)} kg`, `${formatNum(Math.max(1, breadProduced - 0.8))} kg`, `${formatNum(breadProduced * 1.5)} kg`]
      };
    }
  },
  {
    id: 'prob_hard_3',
    title: 'Διαδρομή Οχήματος με Ώρες και Λεπτά',
    unit: 'km',
    generate: () => {
      const distKm = 54;
      const min1 = 45;
      const min2 = 150; // 2 h 30 min
      const dist2 = (distKm / min1) * min2;
      return {
        prompt: `Ένα όχημα διήνυσε ${distKm} km σε 45 λεπτά κινούμενο με σταθερό ρυθμό. Πόσα km θα διανύσει σε χρόνο 2 ωρών και 30 λεπτών;`,
        unit: 'km',
        correctVal: String(dist2),
        correctText: `${dist2} km`,
        tableData: [
          { item: 'Χρόνος 2 σε λεπτά', formula: '2 h 30 min ＝ (2 · 60) ＋ 30', val: `${min2} min` },
          { item: 'Αναλογία αποστάσεων', formula: `(${distKm} · ${min2}) : ${min1}`, val: `${dist2} km` }
        ],
        explain: `Εκφράζουμε τους χρόνους σε λεπτά: 45 min και 2 h 30 min ＝ 150 min. Στήνουμε την αναλογία: 45 : ${distKm} ＝ 150 : x. Με χιαστί βρίσκουμε: x ＝ (${distKm} · 150) : 45 ＝ ${dist2} km.`,
        distractors: [`${dist2 + 20} km`, `${dist2 - 25} km`, `${dist2 + 36} km`]
      };
    }
  },
  {
    id: 'prob_hard_4',
    title: 'Μάζα Μεταλλικού Σύρματος',
    unit: 'g',
    generate: () => {
      const wireCm = 150;
      const wireGrams = 450;
      const targetMeters = 4.2;
      const targetCm = targetMeters * 100;
      const targetGrams = (wireGrams * targetCm) / wireCm;
      return {
        prompt: `Ένα μεταλλικό σύρμα μήκους ${wireCm} cm έχει μάζα ${wireGrams} g. Ποια είναι η μάζα σε g ενός σύρματος από το ίδιο μέταλλο με μήκος ${formatNum(targetMeters)} m;`,
        unit: 'g',
        correctVal: String(targetGrams),
        correctText: `${targetGrams} g`,
        tableData: [
          { item: 'Μετατροπή μέτρων σε cm', formula: `${formatNum(targetMeters)} m · 100`, val: `${targetCm} cm` },
          { item: 'Μάζα ανά 1 cm', formula: `${wireGrams} : ${wireCm}`, val: '3 g/cm' },
          { item: 'Συνολική μάζα', formula: `${targetCm} · 3`, val: `${targetGrams} g` }
        ],
        explain: `Μετατρέπουμε τα ${formatNum(targetMeters)} m σε cm: ${targetCm} cm. Στο 1 cm αντιστοιχούν ${wireGrams} : ${wireCm} ＝ 3 g. Για ${targetCm} cm η μάζα είναι: ${targetCm} · 3 ＝ ${targetGrams} g.`,
        distractors: [`${targetGrams + 120} g`, `${targetGrams - 150} g`, `${targetGrams + 200} g`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Αναγωγή στη Μονάδα (Βήμα 1)
  const q1Count = randInt(4, 8);
  const q1UnitCost = randInt(3, 7);
  const q1TotalCost = q1Count * q1UnitCost;

  // Q2: MCQ - Μαθηματική έκφραση αναγωγής
  const q2Items = randInt(3, 6);
  const q2Price = randInt(12, 24);
  const q2TargetItems = q2Items + randInt(2, 4);
  const q2CorrectExpr = `(${q2Price} : ${q2Items}) · ${q2TargetItems}`;
  const q2Options = shuffle([
    q2CorrectExpr,
    `(${q2Price} · ${q2Items}) : ${q2TargetItems}`,
    `(${q2Price} ＋ ${q2Items}) · ${q2TargetItems}`,
    `(${q2Price} : ${q2TargetItems}) · ${q2Items}`
  ]);

  // Q3: Input - Επίλυση με Σταυρωτά Γινόμενα (Χιαστί)
  const q3A = randInt(3, 6);
  const q3B = randInt(15, 30);
  const q3C = q3A * randInt(2, 4);
  const q3D = (q3B * q3C) / q3A;

  // Q4: MCQ - Σύγκριση μεθόδων
  const q4CorrectStatement = 'Όλες οι μέθοδοι (αναγωγή στη μονάδα, χιαστί, συντελεστής λ) οδηγούν στο ίδιο ακριβώς αποτέλεσμα';
  const q4Options = shuffle([
    q4CorrectStatement,
    'Η αναγωγή στη μονάδα δίνει πάντοτε μεγαλύτερο αποτέλεσμα από το χιαστί',
    'Ο συντελεστής αναλογίας μπορεί να εφαρμοστεί μόνο σε μη ανάλογα ποσά',
    'Η μέθοδος χιαστί εφαρμόζεται μόνο όταν τα ποσά έχουν ακέραιες τιμές'
  ]);

  // Q5: Input - Χρήση του Συντελεστή Αναλογίας (y = λ * x)
  const q5Lambda = randInt(4, 9);
  const q5TargetX = randInt(5, 12);
  const q5ExpectedY = q5Lambda * q5TargetX;

  // Q6: MCQ - Κανόνας μονάδων μέτρησης
  const q6CorrectRule = 'Πρέπει πρώτα να μετατρέψουμε τα ομοειδή ποσά στην ίδια μονάδα μέτρησης (π.χ. όλα σε kg ή όλα σε g)';
  const q6Options = shuffle([
    q6CorrectRule,
    'Μπορούμε να κάνουμε κατευθείαν πολλαπλασιασμό χωρίς καμία μετατροπή',
    'Πρέπει να προσθέσουμε τους αριθμούς ανεξάρτητα από τις μονάδες τους',
    'Δεν επιτρέπεται να λύσουμε πρόβλημα που περιέχει διαφορετικές μονάδες μέτρησης'
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
      title: 'Αναγωγή στη Μονάδα',
      prompt: `Αν ${q1Count} ίδια βιβλία κοστίζουν συνολικά ${q1TotalCost} €, πόσα € κοστίζει το 1 βιβλίο;`,
      correct: String(q1UnitCost),
      explain: `Για να βρούμε την τιμή της 1 μονάδας (αναγωγή στη μονάδα), διαιρούμε το συνολικό κόστος με το πλήθος των τεμαχίων: ${q1TotalCost} : ${q1Count} ＝ ${q1UnitCost} €.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Μαθηματική Έκφραση Αναγωγής',
      prompt: `Αν ${q2Items} τεμάχια κοστίζουν ${q2Price} €, ποια έκφραση δίνει το κόστος των ${q2TargetItems} τεμαχίων με τη μέθοδο της αναγωγής στη μονάδα;`,
      options: q2Options,
      correct: q2CorrectExpr,
      explain: `Πρώτα υπολογίζουμε την τιμή του ενός τεμαχίου (${q2Price} : ${q2Items}) και στη συνέχεια πολλαπλασιάζουμε με το ζητούμενο πλήθος (${q2TargetItems}): ${q2CorrectExpr}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Επίλυση με Χιαστί',
      prompt: `Στον πίνακα ποσών και τιμών: ${q3A} kg αντιστοιχούν σε ${q3B} € και ${q3C} kg αντιστοιχούν σε x €. Πόσα € είναι το x;`,
      correct: String(q3D),
      explain: `Εφαρμόζουμε σταυρωτό πολλαπλασιασμό (χιαστί): x ＝ (${q3B} · ${q3C}) : ${q3A} ＝ ${q3B * q3C} : ${q3A} ＝ ${q3D} €.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Σύγκριση Μεθόδων',
      prompt: 'Ποια από τις παρακάτω προτάσεις ισχύει για τα προβλήματα με ανάλογα ποσά;',
      options: q4Options,
      correct: q4CorrectStatement,
      explain: 'Στα ανάλογα ποσά, είτε χρησιμοποιήσουμε αναγωγή στη μονάδα, είτε πίνακα με χιαστί, είτε τον συντελεστή λ, καταλήγουμε υποχρεωτικά στο ίδιο ακριβώς αποτέλεσμα.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Χρήση Συντελεστή Αναλογίας',
      prompt: `Σε ένα πρόβλημα ανάλογων ποσών ο συντελεστής αναλογίας υπολογίστηκε ίσος με λ ＝ ${q5Lambda}. Αν η νέα τιμή του ποσού x είναι ${q5TargetX}, ποια είναι η αντίστοιχη τιμή του y;`,
      correct: String(q5ExpectedY),
      explain: `Εφαρμόζουμε τον τύπο του συντελεστή αναλογίας: y ＝ λ · x ＝ ${q5Lambda} · ${q5TargetX} ＝ ${q5ExpectedY}.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Κανόνας Μονάδων Μέτρησης',
      prompt: 'Τι πρέπει οπωσδήποτε να κάνουμε σε ένα πρόβλημα ανάλογων ποσών όταν η μία ποσότητα δίνεται σε kg και η άλλη σε g;',
      options: q6Options,
      correct: q6CorrectRule,
      explain: 'Όταν συγκρίνουμε ομοειδή ποσά, είναι απαραίτητο να εκφράζονται στην ίδια ακριβώς μονάδα μέτρησης πριν εκτελεστεί οποιαδήποτε πράξη ή αναλογία.'
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

export default function ProblemAnalogaPosaExercisesPage() {
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
      const cleanTarget = q.correct.replace(/\./g, ',').replace(/\s+/g, '').replace(/^[xyψχ][=＝]/i, '').trim().toLowerCase();

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
      title="Ασκήσεις: Προβλήματα με Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση προβλημάτων με ανάλογα ποσά και αναγωγή στη μονάδα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/45-problem-analoga-posa"
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
                <span>ΚΕΦΑΛΑΙΟ 45 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Προβλήματα με Ανάλογα Ποσά
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην αναγωγή στη μονάδα, στη μέθοδο των σταυρωτών γινομένων (χιαστί) και στον συντελεστή αναλογίας λ!
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

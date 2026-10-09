// pages/st-dimotikou/47-problem-antistrofos-analoga-posa-ask.js
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
    id: 'p_antistr_std_1',
    title: 'Συναρμολόγηση Παραγγελίας',
    unit: 'ημέρες',
    generate: () => {
      const workers1 = randInt(2, 4);
      const days1 = randInt(6, 12);
      const totalWork = workers1 * days1;
      const workers2 = workers1 + randInt(2, 4);
      const days2 = totalWork / workers2;
      const cleanDays2 = Number.isInteger(days2) ? days2 : Number(days2.toFixed(1));
      return {
        prompt: `Σε ένα συνεργείο ${workers1} τεχνικοί συναρμολογούν μια παραγγελία σε ${days1} ημέρες. Σε πόσες ημέρες θα συναρμολογούσαν την ίδια παραγγελία ${workers2} τεχνικοί με τον ίδιο ρυθμό εργασίας;`,
        unit: 'ημέρες',
        correctVal: formatNum(cleanDays2),
        correctText: `${formatNum(cleanDays2)} ημέρες`,
        tableData: [
          { item: 'Αρχικός όγκος εργασίας', formula: `${workers1} τεχνικοί · ${days1} ημέρες`, val: `${totalWork} μεροκάματα` },
          { item: 'Νέος αριθμός τεχνικών', formula: `${workers2} τεχνικοί`, val: `${workers2}` },
          { item: 'Απαιτούμενες ημέρες', formula: `${totalWork} : ${workers2}`, val: `${formatNum(cleanDays2)} ημέρες` }
        ],
        explain: `Τα ποσά είναι αντιστρόφως ανάλογα (σταθερό γινόμενο). Συνολικός όγκος εργασίας: ${workers1} · ${days1} ＝ ${totalWork} μεροκάματα. Για ${workers2} τεχνικούς οι ημέρες είναι: ${totalWork} : ${workers2} ＝ ${formatNum(cleanDays2)} ημέρες.`,
        distractors: [`${formatNum(cleanDays2 + 2)} ημέρες`, `${formatNum(Math.max(1, cleanDays2 - 2))} ημέρες`, `${formatNum(cleanDays2 + 4)} ημέρες`]
      };
    }
  },
  {
    id: 'p_antistr_std_2',
    title: 'Χρόνος Διαδρομής Φορτηγού',
    unit: 'ώρες',
    generate: () => {
      const speed1 = randInt(6, 8) * 10;
      const time1 = randInt(3, 5);
      const totalDist = speed1 * time1;
      const speed2 = speed1 + 20;
      const time2 = totalDist / speed2;
      const cleanTime2 = Number.isInteger(time2) ? time2 : Number(time2.toFixed(1));
      return {
        prompt: `Ένα φορτηγό καλύπτει μια διαδρομή σε ${time1} ώρες κινούμενο με σταθερή ταχύτητα ${speed1} km/h. Σε πόσες ώρες θα κάλυπτε την ίδια απόσταση αν κινούνταν με ταχύτητα ${speed2} km/h;`,
        unit: 'ώρες',
        correctVal: formatNum(cleanTime2),
        correctText: `${formatNum(cleanTime2)} ώρες`,
        tableData: [
          { item: 'Σταθερή απόσταση', formula: `${speed1} · ${time1}`, val: `${totalDist} km` },
          { item: 'Νέα ταχύτητα', formula: `${speed2} km/h`, val: `${speed2} km/h` },
          { item: 'Νέος απαιτούμενος χρόνος', formula: `${totalDist} : ${speed2}`, val: `${formatNum(cleanTime2)} h` }
        ],
        explain: `Ταχύτητα και χρόνος έχουν σταθερό γινόμενο (απόσταση): ${speed1} · ${time1} ＝ ${totalDist} km. Ο νέος χρόνος είναι: ${totalDist} : ${speed2} ＝ ${formatNum(cleanTime2)} ώρες.`,
        distractors: [`${formatNum(cleanTime2 + 1)} ώρες`, `${formatNum(Math.max(1, cleanTime2 - 1))} ώρες`, `${formatNum(cleanTime2 + 2)} ώρες`]
      };
    }
  },
  {
    id: 'p_antistr_std_3',
    title: 'Άδειασμα Δεξαμενής με Αντλίες',
    unit: 'ώρες',
    generate: () => {
      const taps1 = randInt(2, 3);
      const hours1 = randInt(4, 6);
      const totalCapacity = taps1 * hours1;
      const taps2 = taps1 + randInt(2, 3);
      const hours2 = totalCapacity / taps2;
      const cleanH2 = Number.isInteger(hours2) ? hours2 : Number(hours2.toFixed(1));
      return {
        prompt: `${taps1} ίδιες αντλίες αδειάζουν μια δεξαμενή σε ${hours1} ώρες. Σε πόσες ώρες θα άδειαζαν την ίδια δεξαμενή ${taps2} ίδιες αντλίες αν λειτουργούσαν ταυτόχρονα;`,
        unit: 'ώρες',
        correctVal: formatNum(cleanH2),
        correctText: `${formatNum(cleanH2)} ώρες`,
        tableData: [
          { item: 'Σταθερό γινόμενο', formula: `${taps1} · ${hours1}`, val: `${totalCapacity}` },
          { item: 'Νέες αντλίες', formula: `${taps2} αντλίες`, val: `${taps2}` },
          { item: 'Χρόνος εκκένωσης', formula: `${totalCapacity} : ${taps2}`, val: `${formatNum(cleanH2)} h` }
        ],
        explain: `Οι αντλίες και ο χρόνος είναι αντιστρόφως ανάλογα ποσά. Σταθερό γινόμενο: ${taps1} · ${hours1} ＝ ${totalCapacity}. Με ${taps2} αντλίες απαιτούνται: ${totalCapacity} : ${taps2} ＝ ${formatNum(cleanH2)} ώρες.`,
        distractors: [`${formatNum(cleanH2 + 1.5)} ώρες`, `${formatNum(Math.max(1, cleanH2 - 1))} ώρες`, `${formatNum(cleanH2 + 2.5)} ώρες`]
      };
    }
  },
  {
    id: 'p_antistr_std_4',
    title: 'Συσκευασία Τσαγιού σε Κουτιά',
    unit: 'κουτιά',
    generate: () => {
      const packCapacity = randInt(3, 6) * 50;
      const packsCount = randInt(8, 14);
      const totalGrams = packCapacity * packsCount;
      const newPackCap = packCapacity + 50;
      const newPacks = totalGrams / newPackCap;
      const cleanPacks = Number.isInteger(newPacks) ? newPacks : Number(newPacks.toFixed(1));
      return {
        prompt: `Μια ποσότητα τσαγιού συσκευάστηκε σε ${packsCount} κουτιά των ${packCapacity} g το καθένα. Πόσα κουτιά των ${newPackCap} g θα χρειάζονταν για να συσκευαστεί η ίδια ακριβώς ποσότητα;`,
        unit: 'κουτιά',
        correctVal: formatNum(cleanPacks),
        correctText: `${formatNum(cleanPacks)} κουτιά`,
        tableData: [
          { item: 'Συνολική μάζα (σταθερή)', formula: `${packCapacity} · ${packsCount}`, val: `${totalGrams} g` },
          { item: 'Νέα χωρητικότητα κουτιού', formula: `${newPackCap} g`, val: `${newPackCap} g` },
          { item: 'Νέο πλήθος κουτιών', formula: `${totalGrams} : ${newPackCap}`, val: `${formatNum(cleanPacks)}` }
        ],
        explain: `Η χωρητικότητα και το πλήθος κουτιών είναι αντιστρόφως ανάλογα ποσά. Συνολική μάζα: ${packCapacity} · ${packsCount} ＝ ${totalGrams} g. Νέο πλήθος: ${totalGrams} : ${newPackCap} ＝ ${formatNum(cleanPacks)} κουτιά.`,
        distractors: [`${formatNum(cleanPacks + 2)} κουτιά`, `${formatNum(Math.max(1, cleanPacks - 2))} κουτιά`, `${formatNum(cleanPacks + 4)} κουτιά`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_antistr_hard_1',
    title: 'Ολοκλήρωση Έργου με Επιπλέον Εργάτες',
    unit: 'ημέρες',
    generate: () => {
      const initWorkers = 8;
      const initDays = 15;
      const doneDays = 3;
      const remWork = initWorkers * (initDays - doneDays);
      const addedWorkers = 4;
      const totalWorkers = initWorkers + addedWorkers;
      const remDays = remWork / totalWorkers;
      return {
        prompt: `Μια ομάδα ${initWorkers} εργατών είχε προγραμματίσει να τελειώσει ένα έργο σε ${initDays} ημέρες. Αφού εργάστηκαν μόνοι τους για ${doneDays} ημέρες, προστέθηκαν στην ομάδα άλλοι ${addedWorkers} εργάτες. Σε πόσες ημέρες θα ολοκληρωθεί το υπόλοιπο έργο;`,
        unit: 'ημέρες',
        correctVal: String(remDays),
        correctText: `${remDays} ημέρες`,
        tableData: [
          { item: 'Έργο που απομένει', formula: `${initWorkers} · (${initDays} － ${doneDays})`, val: `${remWork} μεροκάματα` },
          { item: 'Συνολικοί εργάτες', formula: `${initWorkers} ＋ ${addedWorkers}`, val: `${totalWorkers} εργάτες` },
          { item: 'Χρόνος για το υπόλοιπο', formula: `${remWork} : ${totalWorkers}`, val: `${remDays} ημέρες` }
        ],
        explain: `Το έργο που απομένει ισοδυναμεί με ${initWorkers} εργάτες · (${initDays} － ${doneDays}) ημέρες ＝ ${initWorkers} · ${initDays - doneDays} ＝ ${remWork} μεροκάματα. Τώρα εργάζονται ${initWorkers} ＋ ${addedWorkers} ＝ ${totalWorkers} εργάτες. Το υπόλοιπο έργο θα τελειώσει σε: ${remWork} : ${totalWorkers} ＝ ${remDays} ημέρες.`,
        distractors: [`${remDays + 3} ημέρες`, `${remDays - 2} ημέρες`, `${remDays + 5} ημέρες`]
      };
    }
  },
  {
    id: 'p_antistr_hard_2',
    title: 'Διάρκεια Ζωοτροφών μετά από Πώληση Ζώων',
    unit: 'ημέρες',
    generate: () => {
      const animals = 40;
      const days = 30;
      const daysPassed = 6;
      const remFood = animals * (days - daysPassed);
      const animalsSold = 16;
      const remAnimals = animals - animalsSold;
      const extraDays = remFood / remAnimals;
      return {
        prompt: `Σε ένα αγρόκτημα υπάρχουν ζωοτροφές για ${animals} αγελάδες για ${days} ημέρες. Μετά από ${daysPassed} ημέρες, πωλούνται ${animalsSold} αγελάδες. Για πόσες ημέρες ακόμα θα διαρκέσουν οι ζωοτροφές για τις αγελάδες που απέμειναν;`,
        unit: 'ημέρες',
        correctVal: String(extraDays),
        correctText: `${extraDays} ημέρες`,
        tableData: [
          { item: 'Υπόλοιπο τροφών', formula: `${animals} · (${days} － ${daysPassed})`, val: `${remFood} μερίδες` },
          { item: 'Ζώα που έμειναν', formula: `${animals} － ${animalsSold}`, val: `${remAnimals} αγελάδες` },
          { item: 'Διάρκεια υπολοίπου', formula: `${remFood} : ${remAnimals}`, val: `${extraDays} ημέρες` }
        ],
        explain: `Οι ζωοτροφές που απομένουν επαρκούν για ${animals} ζώα για ${days - daysPassed} ημέρες, δηλαδή ${animals} · ${days - daysPassed} ＝ ${remFood} ημερήσιες μερίδες. Οι εναπομείνασες αγελάδες είναι ${remAnimals}. Θα διαρκέσουν για: ${remFood} : ${remAnimals} ＝ ${extraDays} ημέρες.`,
        distractors: [`${extraDays + 5} ημέρες`, `${extraDays - 5} ημέρες`, `${extraDays + 10} ημέρες`]
      };
    }
  },
  {
    id: 'p_antistr_hard_3',
    title: 'Ορθογώνιο Δάπεδο Σταθερού Εμβαδού',
    unit: 'm',
    generate: () => {
      const length1 = 20;
      const width1 = 15;
      const area = length1 * width1;
      const length2 = 25;
      const width2 = area / length2;
      return {
        prompt: `Ένα ορθογώνιο δάπεδο με σταθερό εμβαδόν έχει μήκος ${length1} m και πλάτος ${width1} m. Αν θέλουμε να διαμορφώσουμε ένα άλλο ορθογώνιο με το ίδιο ακριβώς εμβαδόν αλλά μήκος ${length2} m, ποιο πρέπει να είναι το πλάτος του σε m;`,
        unit: 'm',
        correctVal: String(width2),
        correctText: `${width2} m`,
        tableData: [
          { item: 'Σταθερό εμβαδόν', formula: `${length1} · ${width1}`, val: `${area} m²` },
          { item: 'Νέο μήκος', formula: `${length2} m`, val: `${length2} m` },
          { item: 'Νέο πλάτος', formula: `${area} : ${length2}`, val: `${width2} m` }
        ],
        explain: `Μήκος και πλάτος είναι αντιστρόφως ανάλογα ποσά (σταθερό εμβαδόν). Εμβαδόν: ${length1} · ${width1} ＝ ${area} m². Το νέο πλάτος είναι: ${area} : ${length2} ＝ ${width2} m.`,
        distractors: [`${width2 + 2} m`, `${width2 - 2} m`, `${width2 + 4} m`]
      };
    }
  },
  {
    id: 'p_antistr_hard_4',
    title: 'Ημερήσιο Ωράριο και Προθεσμία Παραγγελίας',
    unit: 'ώρες/ημέρα',
    generate: () => {
      const hoursPerDay1 = 7;
      const days1 = 20;
      const totalHours = hoursPerDay1 * days1;
      const days2 = 14;
      const reqHoursPerDay = totalHours / days2;
      return {
        prompt: `Μια βιοτεχνία εκτελεί μια παραγγελία σε ${days1} ημέρες δουλεύοντας ${hoursPerDay1} ώρες την ημέρα. Πόσες ώρες την ημέρα πρέπει να δουλεύει για να παραδώσει την ίδια παραγγελία σε ${days2} ημέρες;`,
        unit: 'ώρες/ημέρα',
        correctVal: String(reqHoursPerDay),
        correctText: `${reqHoursPerDay} ώρες/ημέρα`,
        tableData: [
          { item: 'Συνολικός απαιτούμενος χρόνος', formula: `${hoursPerDay1} · ${days1}`, val: `${totalHours} ώρες` },
          { item: 'Νέα προθεσμία', formula: `${days2} ημέρες`, val: `${days2} d` },
          { item: 'Νέο ημερήσιο ωράριο', formula: `${totalHours} : ${days2}`, val: `${reqHoursPerDay} h/ημέρα` }
        ],
        explain: `Συνολικές ώρες παραγγελίας: ${hoursPerDay1} · ${days1} ＝ ${totalHours} ώρες. Για παράδοση σε ${days2} ημέρες απαιτούνται: ${totalHours} : ${days2} ＝ ${reqHoursPerDay} ώρες την ημέρα.`,
        distractors: [`${reqHoursPerDay + 2} ώρες/ημέρα`, `${reqHoursPerDay - 1} ώρες/ημέρα`, `${reqHoursPerDay + 3} ώρες/ημέρα`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Αναγωγή στη Μονάδα (Βήμα 1: Ο 1 εργάτης)
  const q1Workers = randInt(3, 6);
  const q1Days = randInt(4, 8);
  const q1TotalManDays = q1Workers * q1Days;

  // Q2: MCQ - Μεθοδολογία αναγωγής στη μονάδα
  const q2CorrectMethod = 'Πολλαπλασιασμό, επειδή ο 1 εργάτης θα χρειαστεί περισσότερο χρόνο';
  const q2Options = shuffle([
    q2CorrectMethod,
    'Διαίρεση, ακριβώς όπως κάναμε και στα ανάλογα ποσά',
    'Πρόσθεση των εργατών και των ημερών',
    'Αφαίρεση του 1 από το σύνολο των εργατών'
  ]);

  // Q3: Input - Οριζόντιος πολλαπλασιασμός πίνακα
  const q3W1 = randInt(2, 5);
  const q3D1 = randInt(10, 20);
  const q3W2 = randInt(6, 10);
  const q3Total = q3W1 * q3D1;
  const q3TargetD = q3Total / q3W2;
  const q3CleanTargetD = Number.isInteger(q3TargetD) ? q3TargetD : Number(q3TargetD.toFixed(1));

  // Q4: MCQ - Η παγίδα του χιαστί
  const q4CorrectTrap = 'Όχι, γιατί η μέθοδος χιαστί εφαρμόζεται αποκλειστικά στα ανάλογα ποσά και όχι στα αντιστρόφως ανάλογα';
  const q4Options = shuffle([
    q4CorrectTrap,
    'Ναι, σε όλα τα προβλήματα του Δημοτικού κάνουμε υποχρεωτικά χιαστί',
    'Ναι, αρκεί οι αριθμοί να είναι ακέραιοι',
    'Όχι, γιατί στα προβλήματα κάνουμε μόνο πρόσθεση και αφαίρεση'
  ]);

  // Q5: Input - Σταθερή απόσταση και ταχύτητα
  const q5Sp1 = 60;
  const q5T1 = randInt(4, 6);
  const q5Dist = q5Sp1 * q5T1;
  const q5Sp2 = 100;
  const q5T2 = q5Dist / q5Sp2;
  const q5CleanT2 = Number.isInteger(q5T2) ? q5T2 : Number(q5T2.toFixed(1));

  // Q6: MCQ - Έλεγχος λογικής αποτελέσματος
  const q6CorrectLogic = 'Ο χρόνος πρέπει υποχρεωτικά να είναι λιγότερος από τις αρχικές 10 ημέρες';
  const q6Options = shuffle([
    q6CorrectLogic,
    'Ο χρόνος πρέπει υποχρεωτικά να είναι μεγαλύτερος από τις αρχικές 10 ημέρες',
    'Ο χρόνος θα παραμείνει ακριβώς ο ίδιος',
    'Δεν μπορούμε να γνωρίζουμε εκ των προτέρων'
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
      prompt: `Αν ${q1Workers} εργάτες τελειώνουν ένα έργο σε ${q1Days} ημέρες, πόσες ημέρες θα χρειαζόταν 1 μόνος εργάτης για να εκτελέσει το ίδιο ακριβώς έργο;`,
      correct: String(q1TotalManDays),
      explain: `Στα αντιστρόφως ανάλογα ποσά για τη μονάδα πολλαπλασιάζουμε: ο 1 εργάτης θα χρειαστεί ${q1Workers} · ${q1Days} ＝ ${q1TotalManDays} ημέρες.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Μεθοδολογία Αναγωγής στη Μονάδα',
      prompt: 'Στα αντιστρόφως ανάλογα ποσά (π.χ. εργάτες και ημέρες), ποια πράξη εκτελούμε για να βρούμε τι αντιστοιχεί στη 1 μονάδα;',
      options: q2Options,
      correct: q2CorrectMethod,
      explain: 'Επειδή 1 μόνο άτομο χρειάζεται πολλαπλάσιο χρόνο από μια ολόκληρη ομάδα, πολλαπλασιάζουμε τους εργάτες με τις ημέρες για να βρούμε το συνολικό έργο.'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: 'Οριζόντια Γινόμενα στον Πίνακα',
      prompt: `Σε πίνακα αντιστρόφως ανάλογων ποσών με 1η γραμμή [${q3W1}, ${q3D1}] και 2η γραμμή [${q3W2}, x], βρείτε την τιμή του x:`,
      correct: formatNum(q3CleanTargetD),
      explain: `Στα αντιστρόφως ανάλογα ποσά τα οριζόντια γινόμενα είναι ίσα: ${q3W1} · ${q3D1} ＝ ${q3W2} · x ➔ x ＝ (${q3W1} · ${q3D1}) : ${q3W2} ＝ ${q3Total} : ${q3W2} ＝ ${formatNum(q3CleanTargetD)}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Η Παγίδα του Χιαστί',
      prompt: 'Επιτρέπεται να εφαρμόσουμε σταυρωτό πολλαπλασιασμό (χιαστί) σε πίνακα με αντιστρόφως ανάλογα ποσά;',
      options: q4Options,
      correct: q4CorrectTrap,
      explain: 'Στα αντιστρόφως ανάλογα ποσά δεν κάνουμε ποτέ χιαστί! Στα αντιστρόφως ανάλογα πολλαπλασιάζουμε οριζόντια τα ζεύγη των τιμών (x₁ · y₁ ＝ x₂ · y₂).'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'decimal',
      title: 'Σταθερή Απόσταση & Ταχύτητα',
      prompt: `Ένα όχημα καλύπτει μια απόσταση σε ${q5T1} ώρες κινούμενο με ταχύτητα ${q5Sp1} km/h. Σε πόσες ώρες θα καλύψει την ίδια απόσταση αν αυξήσει την ταχύτητά του στα ${q5Sp2} km/h;`,
      correct: formatNum(q5CleanT2),
      explain: `Σταθερή απόσταση: ${q5Sp1} · ${q5T1} ＝ ${q5Dist} km. Νέος χρόνος: ${q5Dist} : ${q5Sp2} ＝ ${formatNum(q5CleanT2)} ώρες.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Έλεγχος Λογικής Αποτελέσματος',
      prompt: 'Αν 4 εργάτες κάνουν 10 ημέρες για ένα έργο, τι περιμένουμε για το αποτέλεσμα αν εργαστούν 8 εργάτες;',
      options: q6Options,
      correct: q6CorrectLogic,
      explain: 'Αφού οι εργάτες αυξήθηκαν (διπλασιάστηκαν), ο χρόνος πρέπει υποχρεωτικά να μειωθεί (να υποδιπλασιαστεί σε 5 ημέρες).'
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

export default function ProblemAntistrofosAnalogaExercisesPage() {
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
      title="Ασκήσεις: Λύση Προβλημάτων με Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση προβλημάτων με αντιστρόφως ανάλογα ποσά και οριζόντια γινόμενα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/47-problem-antistrofos-analoga-posa"
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
                <span>ΚΕΦΑΛΑΙΟ 47 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Προβλήματα με Αντιστρόφως Ανάλογα Ποσά
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην αναγωγή στη μονάδα στα αντιστρόφως ανάλογα ποσά, στα οριζόντια γινόμενα και στην αποφυγή της παγίδας του χιαστί!
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

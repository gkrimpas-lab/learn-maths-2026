// pages/st-dimotikou/46-antistrofos-analoga-posa-ask.js
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
    id: 'antistr_std_1',
    title: 'Εργάτες και Ημέρες Ολοκλήρωσης Έργου',
    unit: 'ημέρες',
    generate: () => {
      const w1 = randInt(2, 4);
      const daysPerWorker = randInt(6, 12);
      const totalWork = w1 * daysPerWorker;
      const w2 = w1 + randInt(2, 4);
      const d2 = totalWork / w2;
      const cleanD2 = Number.isInteger(d2) ? d2 : Number(d2.toFixed(1));
      return {
        prompt: `Σε ένα εργοτάξιο ${w1} εργάτες τελειώνουν ένα έργο σε ${daysPerWorker} ημέρες. Σε πόσες ημέρες θα ολοκληρώσουν το ίδιο έργο ${w2} εργάτες με τον ίδιο ακριβώς ρυθμό εργασίας;`,
        unit: 'ημέρες',
        correctVal: formatNum(cleanD2),
        correctText: `${formatNum(cleanD2)} ημέρες`,
        tableData: [
          { item: 'Αρχική ομάδα εργατών', formula: `${w1} εργάτες · ${daysPerWorker} ημέρες`, val: `${totalWork} μεροκάματα` },
          { item: 'Νέα ομάδα εργατών', formula: `${w2} εργάτες`, val: `${w2}` },
          { item: 'Απαιτούμενες ημέρες', formula: `${totalWork} : ${w2}`, val: `${formatNum(cleanD2)} ημέρες` }
        ],
        explain: `Οι εργάτες και οι ημέρες είναι αντιστρόφως ανάλογα ποσά (σταθερό γινόμενο). Συνολικά μεροκάματα: ${w1} · ${daysPerWorker} ＝ ${totalWork}. Για ${w2} εργάτες οι ημέρες είναι: ${totalWork} : ${w2} ＝ ${formatNum(cleanD2)} ημέρες.`,
        distractors: [`${formatNum(cleanD2 + 2)} ημέρες`, `${formatNum(Math.max(1, cleanD2 - 2))} ημέρες`, `${formatNum(cleanD2 + 4)} ημέρες`]
      };
    }
  },
  {
    id: 'antistr_std_2',
    title: 'Ταχύτητα και Χρόνος Διαδρομής',
    unit: 'ώρες',
    generate: () => {
      const speed1 = randInt(6, 8) * 10;
      const time1 = randInt(3, 5);
      const totalDist = speed1 * time1;
      const speed2 = speed1 + 20;
      const time2 = totalDist / speed2;
      const cleanTime2 = Number.isInteger(time2) ? time2 : Number(time2.toFixed(1));
      return {
        prompt: `Ένα αυτοκίνητο κάλυψε μια διαδρομή σε ${time1} ώρες κινούμενο με σταθερή ταχύτητα ${speed1} km/h. Σε πόσες ώρες θα κάλυπτε την ίδια απόσταση αν κινούνταν με ταχύτητα ${speed2} km/h;`,
        unit: 'ώρες',
        correctVal: formatNum(cleanTime2),
        correctText: `${formatNum(cleanTime2)} ώρες`,
        tableData: [
          { item: 'Σταθερή απόσταση (γινόμενο)', formula: `${speed1} · ${time1}`, val: `${totalDist} km` },
          { item: 'Νέα ταχύτητα', formula: `${speed2} km/h`, val: `${speed2} km/h` },
          { item: 'Νέος χρόνος', formula: `${totalDist} : ${speed2}`, val: `${formatNum(cleanTime2)} h` }
        ],
        explain: `Η ταχύτητα και ο χρόνος είναι αντιστρόφως ανάλογα ποσά (σταθερή απόσταση). Απόσταση: ${speed1} · ${time1} ＝ ${totalDist} km. Ο νέος χρόνος είναι: ${totalDist} : ${speed2} ＝ ${formatNum(cleanTime2)} ώρες.`,
        distractors: [`${formatNum(cleanTime2 + 1)} ώρες`, `${formatNum(Math.max(1, cleanTime2 - 1))} ώρες`, `${formatNum(cleanTime2 + 2)} ώρες`]
      };
    }
  },
  {
    id: 'antistr_std_3',
    title: 'Βρύσες και Χρόνος Γεμίσματος Δεξαμενής',
    unit: 'ώρες',
    generate: () => {
      const taps1 = randInt(2, 3);
      const hours1 = randInt(4, 6);
      const totalCapacity = taps1 * hours1;
      const taps2 = taps1 + randInt(2, 3);
      const hours2 = totalCapacity / taps2;
      const cleanH2 = Number.isInteger(hours2) ? hours2 : Number(hours2.toFixed(1));
      return {
        prompt: `${taps1} ίδιες βρύσες γεμίζουν μια πισίνα σε ${hours1} ώρες. Σε πόσες ώρες θα γέμιζαν την ίδια πισίνα ${taps2} ίδιες βρύσες αν άνοιγαν ταυτόχρονα;`,
        unit: 'ώρες',
        correctVal: formatNum(cleanH2),
        correctText: `${formatNum(cleanH2)} ώρες`,
        tableData: [
          { item: 'Σταθερό γινόμενο', formula: `${taps1} · ${hours1}`, val: `${totalCapacity}` },
          { item: 'Νέες βρύσες', formula: `${taps2} βρύσες`, val: `${taps2}` },
          { item: 'Χρόνος γεμίσματος', formula: `${totalCapacity} : ${taps2}`, val: `${formatNum(cleanH2)} h` }
        ],
        explain: `Ο αριθμός των βρυσών και ο χρόνος είναι αντιστρόφως ανάλογα ποσά. Σταθερό γινόμενο: ${taps1} · ${hours1} ＝ ${totalCapacity}. Με ${taps2} βρύσες απαιτούνται: ${totalCapacity} : ${taps2} ＝ ${formatNum(cleanH2)} ώρες.`,
        distractors: [`${formatNum(cleanH2 + 1.5)} ώρες`, `${formatNum(Math.max(1, cleanH2 - 1))} ώρες`, `${formatNum(cleanH2 + 2.5)} ώρες`]
      };
    }
  },
  {
    id: 'antistr_std_4',
    title: 'Χωρητικότητα και Πλήθος Συσκευασιών',
    unit: 'σακουλάκια',
    generate: () => {
      const packCapacity = randInt(3, 6) * 50;
      const packsCount = randInt(8, 15);
      const totalGrams = packCapacity * packsCount;
      const newPackCap = packCapacity + 50;
      const newPacks = totalGrams / newPackCap;
      const cleanPacks = Number.isInteger(newPacks) ? newPacks : Number(newPacks.toFixed(1));
      return {
        prompt: `Μια ποσότητα καφέ συσκευάστηκε σε ${packsCount} σακουλάκια των ${packCapacity} g το καθένα. Πόσα σακουλάκια των ${newPackCap} g θα χρειάζονταν για να συσκευαστεί η ίδια ακριβώς ποσότητα καφέ;`,
        unit: 'σακουλάκια',
        correctVal: formatNum(cleanPacks),
        correctText: `${formatNum(cleanPacks)} σακουλάκια`,
        tableData: [
          { item: 'Συνολική μάζα καφέ (σταθερή)', formula: `${packCapacity} · ${packsCount}`, val: `${totalGrams} g` },
          { item: 'Νέα χωρητικότητα συσκευασίας', formula: `${newPackCap} g`, val: `${newPackCap} g` },
          { item: 'Νέο πλήθος συσκευασιών', formula: `${totalGrams} : ${newPackCap}`, val: `${formatNum(cleanPacks)}` }
        ],
        explain: `Η χωρητικότητα και το πλήθος των συσκευασιών είναι αντιστρόφως ανάλογα ποσά. Συνολικός καφές: ${packCapacity} · ${packsCount} ＝ ${totalGrams} g. Νέο πλήθος συσκευασιών: ${totalGrams} : ${newPackCap} ＝ ${formatNum(cleanPacks)} σακουλάκια.`,
        distractors: [`${formatNum(cleanPacks + 2)} σακουλάκια`, `${formatNum(Math.max(1, cleanPacks - 2))} σακουλάκια`, `${formatNum(cleanPacks + 4)} σακουλάκια`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'antistr_hard_1',
    title: 'Σύνθετο Πρόβλημα Εργατών με Ενίσχυση Ομάδας',
    unit: 'ημέρες',
    generate: () => {
      const initialWorkers = 6;
      const initialDays = 20;
      const workDoneDays = 5;
      const remainingWork = initialWorkers * (initialDays - workDoneDays);
      const addedWorkers = 3;
      const totalWorkersNow = initialWorkers + addedWorkers;
      const remainingDays = remainingWork / totalWorkersNow;
      return {
        prompt: `Μια ομάδα ${initialWorkers} εργατών ανέλαβε να ολοκληρώσει ένα έργο σε ${initialDays} ημέρες. Αφού εργάστηκαν μόνοι τους για ${workDoneDays} ημέρες, προστέθηκαν στην ομάδα άλλοι ${addedWorkers} εργάτες. Σε πόσες ημέρες θα ολοκληρωθεί το υπόλοιπο του έργου;`,
        unit: 'ημέρες',
        correctVal: String(remainingDays),
        correctText: `${remainingDays} ημέρες`,
        tableData: [
          { item: 'Έργο που απομένει', formula: `${initialWorkers} · (${initialDays} － ${workDoneDays})`, val: `${remainingWork} μεροκάματα` },
          { item: 'Συνολικοί εργάτες πλέον', formula: `${initialWorkers} ＋ ${addedWorkers}`, val: `${totalWorkersNow} εργάτες` },
          { item: 'Χρόνος ολοκλήρωσης υπολοίπου', formula: `${remainingWork} : ${totalWorkersNow}`, val: `${remainingDays} ημέρες` }
        ],
        explain: `Το έργο που απομένει ισοδυναμεί με: ${initialWorkers} εργάτες · (${initialDays} － ${workDoneDays}) ημέρες ＝ ${initialWorkers} · ${initialDays - workDoneDays} ＝ ${remainingWork} μεροκάματα. Τώρα εργάζονται ${initialWorkers} ＋ ${addedWorkers} ＝ ${totalWorkersNow} εργάτες. Οι ημέρες που απομένουν είναι: ${remainingWork} : ${totalWorkersNow} ＝ ${remainingDays} ημέρες.`,
        distractors: [`${remainingDays + 3} ημέρες`, `${remainingDays - 2} ημέρες`, `${remainingDays + 5} ημέρες`]
      };
    }
  },
  {
    id: 'antistr_hard_2',
    title: 'Απόθεμα Ζωοτροφών με Μεταβολή Πληθυσμού',
    unit: 'ημέρες',
    generate: () => {
      const animals = 30;
      const days = 40;
      const daysPassed = 10;
      const remainingFood = animals * (days - daysPassed);
      const animalsLeft = animals - 10;
      const extraDays = remainingFood / animalsLeft;
      return {
        prompt: `Σε έναν στάβλο υπάρχουν ζωοτροφές που επαρκούν για ${animals} ζώα για ${days} ημέρες. Μετά από ${daysPassed} ημέρες, πωλούνται 10 ζώα. Για πόσες ημέρες ακόμα θα επαρκέσουν οι υπόλοιπες ζωοτροφές για τα ζώα που έμειναν;`,
        unit: 'ημέρες',
        correctVal: String(extraDays),
        correctText: `${extraDays} ημέρες`,
        tableData: [
          { item: 'Υπόλοιπο τροφών (σε μερίδες)', formula: `${animals} · (${days} － ${daysPassed})`, val: `${remainingFood} μερίδες` },
          { item: 'Εναπομείναντα ζώα', formula: `${animals} － 10`, val: `${animalsLeft} ζώα` },
          { item: 'Διάρκεια υπολοίπου τροφών', formula: `${remainingFood} : ${animalsLeft}`, val: `${extraDays} ημέρες` }
        ],
        explain: `Οι ζωοτροφές που απέμειναν επαρκούν για ${animals} ζώα για ${days - daysPassed} ημέρες, δηλαδή ${animals} · ${days - daysPassed} ＝ ${remainingFood} ημερήσιες μερίδες. Τα ζώα που έμειναν είναι ${animalsLeft}. Οι ημέρες που θα διαρκέσουν είναι: ${remainingFood} : ${animalsLeft} ＝ ${extraDays} ημέρες.`,
        distractors: [`${extraDays + 5} ημέρες`, `${extraDays - 5} ημέρες`, `${extraDays + 10} ημέρες`]
      };
    }
  },
  {
    id: 'antistr_hard_3',
    title: 'Ορθογώνιο με Σταθερό Εμβαδόν',
    unit: 'm',
    generate: () => {
      const length1 = 18;
      const width1 = 12;
      const area = length1 * width1;
      const length2 = 24;
      const width2 = area / length2;
      return {
        prompt: `Σε ένα ορθογώνιο οικόπεδο με σταθερό εμβαδόν, το μήκος και το πλάτος είναι αντιστρόφως ανάλογα ποσά. Αν με μήκος ${length1} m το πλάτος είναι ${width1} m, ποιο θα είναι το πλάτος σε m αν το μήκος γίνει ${length2} m;`,
        unit: 'm',
        correctVal: String(width2),
        correctText: `${width2} m`,
        tableData: [
          { item: 'Σταθερό εμβαδόν (γινόμενο)', formula: `${length1} · ${width1}`, val: `${area} m²` },
          { item: 'Νέο μήκος', formula: `${length2} m`, val: `${length2} m` },
          { item: 'Νέο πλάτος', formula: `${area} : ${length2}`, val: `${width2} m` }
        ],
        explain: `Το εμβαδόν παραμένει σταθερό: Ε ＝ μήκος · πλάτος ＝ ${length1} · ${width1} ＝ ${area} m². Με νέο μήκος ${length2} m, το πλάτος είναι: ${area} : ${length2} ＝ ${width2} m.`,
        distractors: [`${width2 + 2} m`, `${width2 - 2} m`, `${width2 + 4} m`]
      };
    }
  },
  {
    id: 'antistr_hard_4',
    title: 'Ημερήσιο Ωράριο και Διάρκεια Παράδοσης',
    unit: 'ώρες/ημέρα',
    generate: () => {
      const hoursPerDay1 = 8;
      const days1 = 15;
      const totalHours = hoursPerDay1 * days1;
      const days2 = 12;
      const reqHoursPerDay = totalHours / days2;
      return {
        prompt: `Ένα έργο απαιτεί ${days1} ημέρες εργασίας αν οι τεχνίτες δουλεύουν ${hoursPerDay1} ώρες την ημέρα. Πόσες ώρες την ημέρα πρέπει να εργάζονται για να παραδώσουν το ίδιο έργο σε ${days2} ημέρες;`,
        unit: 'ώρες/ημέρα',
        correctVal: String(reqHoursPerDay),
        correctText: `${reqHoursPerDay} ώρες/ημέρα`,
        tableData: [
          { item: 'Συνολικός απαιτούμενος χρόνος', formula: `${hoursPerDay1} · ${days1}`, val: `${totalHours} ώρες` },
          { item: 'Νέα προθεσμία', formula: `${days2} ημέρες`, val: `${days2} d` },
          { item: 'Ημερήσιες ώρες εργασίας', formula: `${totalHours} : ${days2}`, val: `${reqHoursPerDay} h/ημέρα` }
        ],
        explain: `Οι ημερήσιες ώρες και οι ημέρες είναι αντιστρόφως ανάλογα ποσά. Συνολικές ώρες έργου: ${hoursPerDay1} · ${days1} ＝ ${totalHours} ώρες. Για να τελειώσει σε ${days2} ημέρες απαιτούνται: ${totalHours} : ${days2} ＝ ${reqHoursPerDay} ώρες την ημέρα.`,
        distractors: [`${reqHoursPerDay + 2} ώρες/ημέρα`, `${reqHoursPerDay - 1} ώρες/ημέρα`, `${reqHoursPerDay + 3} ώρες/ημέρα`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Εύρεση σταθερού γινομένου (α)
  const q1X = randInt(3, 6);
  const q1Y = randInt(8, 15);
  const q1Alpha = q1X * q1Y;

  // Q2: MCQ - Έλεγχος πίνακα τιμών
  const q2IsAntistr = Math.random() > 0.4;
  const q2YVals = q2IsAntistr ? [18, 12, 6] : [18, 12, 8];
  const q2CorrectAns = q2IsAntistr
    ? 'Ναι, γιατί όλα τα γινόμενα x · y είναι ίσα με 36'
    : 'Όχι, γιατί τα γινόμενα x · y δεν παραμένουν σταθερά';
  const q2WrongAns = q2IsAntistr
    ? 'Όχι, γιατί το y μειώνεται ενώ το x αυξάνεται'
    : 'Ναι, γιατί όσο το x μεγαλώνει, το y μικραίνει';
  const q2Options = shuffle([q2CorrectAns, q2WrongAns]);

  // Q3: Input - Υπολογισμός τιμής y από το σταθερό γινόμενο
  const q3X1 = randInt(2, 4);
  const q3Y1 = randInt(12, 20);
  const q3Alpha = q3X1 * q3Y1;
  const q3X2 = q3X1 * 2;
  const q3Y2 = q3Alpha / q3X2;

  // Q4: MCQ - Γραφική παράσταση υπερβολής
  const q4CorrectShape = 'Καμπύλη γραμμή που ονομάζεται υπερβολή και δεν περνάει από το (0, 0)';
  const q4Options = shuffle([
    q4CorrectShape,
    'Ευθεία γραμμή που διέρχεται από την αρχή των αξόνων (0, 0)',
    'Κυκλική γραμμή γύρω από το κέντρο των αξόνων',
    'Ευθεία γραμμή παράλληλη προς τον οριζόντιο άξονα'
  ]);

  // Q5: Input - Εύρεση του x όταν δίνεται το y
  const q5Alpha = 72;
  const q5YVal = [6, 8, 9, 12][randInt(0, 3)];
  const q5ExpectedX = q5Alpha / q5YVal;

  // Q6: MCQ - Ανάλογα vs Αντιστρόφως Ανάλογα
  const q6CorrectStatement = 'Στα ανάλογα ποσά είναι σταθερό το πηλίκο (y : x), ενώ στα αντιστρόφως ανάλογα είναι σταθερό το γινόμενο (x · y)';
  const q6Options = shuffle([
    q6CorrectStatement,
    'Και στα δύο είδη ποσών είναι σταθερό το άθροισμα των τιμών τους',
    'Στα ανάλογα ποσά είναι σταθερό το γινόμενο και στα αντιστρόφως ανάλογα το πηλίκο',
    'Και στα δύο είδη ποσών η γραφική παράσταση είναι ευθεία γραμμή'
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
      title: 'Σταθερό Γινόμενο',
      prompt: `Σε δύο αντιστρόφως ανάλογα ποσά x και y, όταν x ＝ ${q1X}, το y ισούται με ${q1Y}. Ποιο είναι το σταθερό γινόμενο α των δύο ποσών (α ＝ x · y);`,
      correct: String(q1Alpha),
      explain: `Στα αντιστρόφως ανάλογα ποσά το γινόμενο των αντίστοιχων τιμών είναι πάντοτε σταθερό: α ＝ x · y ＝ ${q1X} · ${q1Y} ＝ ${q1Alpha}.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Έλεγχος Πίνακα Τιμών',
      prompt: `Είναι τα ποσά x και y αντιστρόφως ανάλογα όταν για x ＝ [2, 3, 6] οι αντίστοιχες τιμές y είναι [${q2YVals[0]}, ${q2YVals[1]}, ${q2YVals[2]}];`,
      options: q2Options,
      correct: q2CorrectAns,
      explain: `Ελέγχουμε τα γινόμενα x · y: 2 · ${q2YVals[0]} ＝ ${2 * q2YVals[0]}, 3 · ${q2YVals[1]} ＝ ${3 * q2YVals[1]}, 6 · ${q2YVals[2]} ＝ ${6 * q2YVals[2]}. ${q2CorrectAns}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: 'Συμπλήρωση Αντιστρόφου Ποσού',
      prompt: `Δύο ποσά x και y είναι αντιστρόφως ανάλογα με σταθερό γινόμενο α ＝ ${q3Alpha}. Αν η τιμή του x είναι ${q3X2}, ποια είναι η αντίστοιχη τιμή του y;`,
      correct: formatNum(q3Y2),
      explain: `Εφαρμόζουμε τη βασική σχέση: y ＝ α : x ＝ ${q3Alpha} : ${q3X2} ＝ ${formatNum(q3Y2)}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Γραφική Παράσταση',
      prompt: 'Ποια είναι η μορφή της γραφικής παράστασης δύο αντιστρόφως ανάλογων ποσών σε σύστημα αξόνων;',
      options: q4Options,
      correct: q4CorrectShape,
      explain: 'Η γραφική παράσταση των αντιστρόφως ανάλογων ποσών είναι καμπύλη γραμμή που ονομάζεται υπερβολή. Δεν περνάει ποτέ από το σημείο (0, 0) και δεν ακουμπάει ποτέ τους άξονες.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Αντίστροφος Υπολογισμός',
      prompt: `Σε δύο αντιστρόφως ανάλογα ποσά το σταθερό γινόμενο είναι α ＝ ${q5Alpha}. Αν y ＝ ${q5YVal}, ποια είναι η τιμή του x;`,
      correct: String(q5ExpectedX),
      explain: `Αφού x · y ＝ α, έχουμε: x ＝ α : y ＝ ${q5Alpha} : ${q5YVal} ＝ ${q5ExpectedX}.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Ανάλογα vs Αντιστρόφως Ανάλογα',
      prompt: 'Ποια είναι η θεμελιώδης διαφορά μεταξύ ανάλογων και αντιστρόφως ανάλογων ποσών;',
      options: q6Options,
      correct: q6CorrectStatement,
      explain: 'Στα ανάλογα ποσά παραμένει σταθερό το πηλίκο των τιμών τους (y : x ＝ λ), ενώ στα αντιστρόφως ανάλογα παραμένει σταθερό το γινόμενο των τιμών τους (x · y ＝ α).'
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

export default function AntistrofosAnalogaExercisesPage() {
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
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα αντιστρόφως ανάλογα ποσά, το σταθερό γινόμενο και τη γραφική παράσταση για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/46-antistrofos-analoga-posa"
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
                <span>ΚΕΦΑΛΑΙΟ 46 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Αντιστρόφως Ανάλογα Ποσά
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον υπολογισμό του σταθερού γινομένου α ＝ x · y, στη συμπλήρωση πινάκων τιμών και στη γραφική παράσταση (υπερβολή)!
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

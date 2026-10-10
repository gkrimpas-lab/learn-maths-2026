// pages/st-dimotikou/59-mikos-ask.js
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
function formatNum(val, decimals = 3) {
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
    id: 'p_len_std_1',
    title: 'Διαίρεση Κορδέλας σε Ίσα Κομμάτια',
    unit: 'cm',
    generate: () => {
      const parts = pickRandom([2, 4, 5, 8, 10]);
      const ribM = randInt(2, 6);
      const totalCm = ribM * 100;
      const partCm = totalCm / parts;
      const cleanPart = Number.isInteger(partCm) ? partCm : Number(partCm.toFixed(1));
      return {
        prompt: `Μια κορδέλα έχει μήκος ${ribM} m. Την κόβουμε σε ${parts} ίσα κομμάτια. Πόσα εκατοστά (cm) είναι το μήκος κάθε κομματιού;`,
        unit: 'cm',
        correctVal: formatNum(cleanPart),
        correctText: `${formatNum(cleanPart)} cm`,
        tableData: [
          { item: 'Αρχικό μήκος σε cm', formula: `${ribM} m · 100`, val: `${totalCm} cm` },
          { item: 'Πλήθος κομματιών', formula: `${parts} ίσα μέρη`, val: `${parts}` },
          { item: 'Μήκος κάθε κομματιού', formula: `${totalCm} : ${parts}`, val: `${formatNum(cleanPart)} cm` }
        ],
        explain: `Μετατρέπουμε τα μέτρα σε εκατοστά: ${ribM} · 100 ＝ ${totalCm} cm. Διαιρούμε σε ${parts} ίσα μέρη: ${totalCm} : ${parts} ＝ ${formatNum(cleanPart)} cm.`,
        distractors: [`${formatNum(cleanPart + 10)} cm`, `${formatNum(Math.max(5, cleanPart - 10))} cm`, `${formatNum(cleanPart + 15)} cm`]
      };
    }
  },
  {
    id: 'p_len_std_2',
    title: 'Υπόλοιπο Υφάσματος μετά από Κοπή',
    unit: 'm',
    generate: () => {
      const rollM = randInt(12, 20);
      const usedCm = randInt(3, 6) * 100 + 50;
      const rollCm = rollM * 100;
      const remainingCm = rollCm - usedCm;
      const remainingM = remainingCm / 100;
      return {
        prompt: `Από ένα τόπι υφάσματος μήκους ${rollM} m κόπηκε ένα κομμάτι μήκους ${usedCm} cm. Πόσα μέτρα (m) υφάσματος έμειναν στο τόπι;`,
        unit: 'm',
        correctVal: formatNum(remainingM),
        correctText: `${formatNum(remainingM)} m`,
        tableData: [
          { item: 'Αρχικό τόπι', formula: `${rollM} m`, val: `${rollM} m` },
          { item: 'Κομμάτι που κόπηκε σε μέτρα', formula: `${usedCm} : 100`, val: `${formatNum(usedCm / 100)} m` },
          { item: 'Υπόλοιπο υφάσματος', formula: `${rollM} － ${formatNum(usedCm / 100)}`, val: `${formatNum(remainingM)} m` }
        ],
        explain: `Μετατρέπουμε το κομμάτι που κόπηκε σε μέτρα: ${usedCm} : 100 ＝ ${formatNum(usedCm / 100)} m. Αφαιρούμε: ${rollM} － ${formatNum(usedCm / 100)} ＝ ${formatNum(remainingM)} m.`,
        distractors: [`${formatNum(remainingM + 1)} m`, `${formatNum(remainingM - 1)} m`, `${formatNum(remainingM + 0.5)} m`]
      };
    }
  },
  {
    id: 'p_len_std_3',
    title: 'Περίμετρος Τετράγωνου Παρτεριού',
    unit: 'm',
    generate: () => {
      const sideCm = randInt(15, 35) * 10;
      const perimCm = sideCm * 4;
      const perimM = perimCm / 100;
      return {
        prompt: `Ένα τετράγωνο παρτέρι έχει πλευρά μήκους ${sideCm} cm. Πόσα μέτρα (m) είναι η περίμετρος του παρτεριού;`,
        unit: 'm',
        correctVal: formatNum(perimM),
        correctText: `${formatNum(perimM)} m`,
        tableData: [
          { item: 'Μήκος πλευράς', formula: `${sideCm} cm`, val: `${sideCm} cm` },
          { item: 'Περίμετρος σε cm', formula: `4 · ${sideCm}`, val: `${perimCm} cm` },
          { item: 'Μετατροπή σε μέτρα', formula: `${perimCm} : 100`, val: `${formatNum(perimM)} m` }
        ],
        explain: `Η περίμετρος του τετραγώνου είναι 4 · ${sideCm} ＝ ${perimCm} cm. Μετατρέπουμε σε μέτρα διαιρώντας με το 100: ${perimCm} : 100 ＝ ${formatNum(perimM)} m.`,
        distractors: [`${formatNum(perimM + 2)} m`, `${formatNum(Math.max(1, perimM - 2))} m`, `${formatNum(perimM + 4)} m`]
      };
    }
  },
  {
    id: 'p_len_std_4',
    title: 'Απόσταση Περιπατητή σε Μέτρα',
    unit: 'm',
    generate: () => {
      const stepCm = randInt(65, 80);
      const steps = randInt(20, 50) * 10;
      const totalCm = stepCm * steps;
      const totalM = totalCm / 100;
      return {
        prompt: `Το βήμα ενός περιπατητή έχει μήκος ${stepCm} cm. Αν έκανε ${steps} βήματα σε ευθεία γραμμή, πόσα μέτρα (m) διένυσε;`,
        unit: 'm',
        correctVal: formatNum(totalM),
        correctText: `${formatNum(totalM)} m`,
        tableData: [
          { item: 'Μήκος βήματος', formula: `${stepCm} cm`, val: `${stepCm} cm` },
          { item: 'Συνολική απόσταση σε cm', formula: `${stepCm} · ${steps}`, val: `${totalCm} cm` },
          { item: 'Μετατροπή σε μέτρα', formula: `${totalCm} : 100`, val: `${formatNum(totalM)} m` }
        ],
        explain: `Συνολική απόσταση σε εκατοστά: ${stepCm} · ${steps} ＝ ${totalCm} cm. Μετατρέπουμε σε μέτρα: ${totalCm} : 100 ＝ ${formatNum(totalM)} m.`,
        distractors: [`${formatNum(totalM + 25)} m`, `${formatNum(totalM - 20)} m`, `${formatNum(totalM + 50)} m`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_len_hard_1',
    title: 'Υπολογισμός Πραγματικής Απόστασης από Χάρτη',
    unit: 'km',
    generate: () => {
      const scale = 50000;
      const mapCm = 6.4;
      const realCm = mapCm * scale;
      const realKm = realCm / 100000;
      return {
        prompt: `Σε έναν γεωγραφικό χάρτη με κλίμακα 1 : ${formatNum(scale, 0)}, η απόσταση δύο χωριών μετρήθηκε ίση με ${formatNum(mapCm)} cm. Πόσα χιλιόμετρα (km) είναι η πραγματική απόσταση;`,
        unit: 'km',
        correctVal: formatNum(realKm),
        correctText: `${formatNum(realKm)} km`,
        tableData: [
          { item: 'Απόσταση στον χάρτη', formula: `${formatNum(mapCm)} cm`, val: `${formatNum(mapCm)} cm` },
          { item: 'Πραγματική απόσταση σε cm', formula: `${formatNum(mapCm)} · ${scale}`, val: `${realCm} cm` },
          { item: 'Μετατροπή σε km', formula: `${realCm} : 100.000`, val: `${formatNum(realKm)} km` }
        ],
        explain: `Πραγματική απόσταση σε εκατοστά: ${formatNum(mapCm)} · ${scale} ＝ ${realCm} cm. Επειδή 1 km ＝ 100.000 cm, διαιρούμε με το 100.000: ${realCm} : 100.000 ＝ ${formatNum(realKm)} km.`,
        distractors: [`${formatNum(realKm + 1.6)} km`, `${formatNum(Math.max(1, realKm - 1))} km`, `${formatNum(realKm * 1.5)} km`]
      };
    }
  },
  {
    id: 'p_len_hard_2',
    title: 'Περίφραξη Οικοπέδου με 3 Σειρές Σύρματος',
    unit: 'm',
    generate: () => {
      const lengthM = 15;
      const widthCm = 850;
      const widthM = widthCm / 100;
      const perimM = 2 * (lengthM + widthM);
      const wireLayers = 3;
      const totalWireM = perimM * wireLayers;
      return {
        prompt: `Ένα ορθογώνιο οικόπεδο έχει μήκος ${lengthM} m και πλάτος ${widthCm} cm. Θέλουμε να το περιφράξουμε περιμετρικά με συρματόπλεγμα 3 σειρών. Πόσα μέτρα (m) συρματοπλέγματος θα χρειαστούν συνολικά;`,
        unit: 'm',
        correctVal: String(totalWireM),
        correctText: `${totalWireM} m`,
        tableData: [
          { item: 'Πλάτος σε μέτρα', formula: `${widthCm} : 100`, val: `${formatNum(widthM)} m` },
          { item: 'Περίμετρος (1 σειρά)', formula: `2 · (${lengthM} ＋ ${formatNum(widthM)})`, val: `${formatNum(perimM)} m` },
          { item: 'Συνολικό σύρμα (3 σειρές)', formula: `3 · ${formatNum(perimM)}`, val: `${totalWireM} m` }
        ],
        explain: `Μετατρέπουμε το πλάτος σε μέτρα: ${widthCm} : 100 ＝ ${formatNum(widthM)} m. Υπολογίζουμε την περίμετρο: 2 · (${lengthM} ＋ ${formatNum(widthM)}) ＝ 2 · ${lengthM + widthM} ＝ ${formatNum(perimM)} m. Για 3 σειρές συρματοπλέγματος απαιτούνται: 3 · ${formatNum(perimM)} ＝ ${totalWireM} m.`,
        distractors: [`${totalWireM + 15} m`, `${totalWireM - 18} m`, `${totalWireM + 30} m`]
      };
    }
  },
  {
    id: 'p_len_hard_3',
    title: 'Φύτευση Δέντρων κατά Μήκος Δρόμου',
    unit: 'δέντρα',
    generate: () => {
      const distKm = 4.2;
      const distM = distKm * 1000;
      const treeSpacingM = 14;
      const trees = (distM / treeSpacingM) + 1;
      return {
        prompt: `Στη μία πλευρά ενός ευθύγραμμου δρόμου μήκους ${formatNum(distKm)} km φυτεύονται δέντρα ανά 14 m, ξεκινώντας από την αρχή του δρόμου (στο 0 m) μέχρι και το τέλος του. Πόσα δέντρα θα φυτευτούν συνολικά;`,
        unit: 'δέντρα',
        correctVal: String(trees),
        correctText: `${trees} δέντρα`,
        tableData: [
          { item: 'Μήκος δρόμου σε μέτρα', formula: `${formatNum(distKm)} · 1.000`, val: `${distM} m` },
          { item: 'Αριθμός διαστημάτων', formula: `${distM} : 14`, val: `${distM / treeSpacingM}` },
          { item: 'Συνολικά δέντρα (συμπεριλαμβανομένης της αρχής)', formula: `${distM / treeSpacingM} ＋ 1`, val: `${trees} δέντρα` }
        ],
        explain: `Μετατρέπουμε τα χιλιόμετρα σε μέτρα: ${formatNum(distKm)} · 1.000 ＝ ${distM} m. Βρίσκουμε τον αριθμό των ίσων διαστημάτων: ${distM} : 14 ＝ ${distM / treeSpacingM}. Επειδή φυτεύεται δέντρο και στην αρχή και στο τέλος, προσθέτουμε 1: ${distM / treeSpacingM} ＋ 1 ＝ ${trees} δέντρα.`,
        distractors: [`${trees - 1} δέντρα`, `${trees + 10} δέντρα`, `${trees - 10} δέντρα`]
      };
    }
  },
  {
    id: 'p_len_hard_4',
    title: 'Σύνθεση Σωλήνα με Διαφορετικές Μονάδες',
    unit: 'm',
    generate: () => {
      const rM = 2.4;
      const rDm = 18;
      const rCm = 350;
      const sumM = rM + (rDm / 10) + (rCm / 100);
      return {
        prompt: `Ενώνουμε διαδοχικά τρία κομμάτια σωλήνα: το πρώτο έχει μήκος ${formatNum(rM)} m, το δεύτερο ${rDm} dm και το τρίτο ${rCm} cm. Πόσα μέτρα (m) είναι το συνολικό μήκος του νέου σωλήνα;`,
        unit: 'm',
        correctVal: formatNum(sumM),
        correctText: `${formatNum(sumM)} m`,
        tableData: [
          { item: '1ο Τμήμα', formula: `${formatNum(rM)} m`, val: `${formatNum(rM)} m` },
          { item: '2ο Τμήμα σε m', formula: `${rDm} : 10`, val: `${formatNum(rDm / 10)} m` },
          { item: '3ο Τμήμα σε m', formula: `${rCm} : 100`, val: `${formatNum(rCm / 100)} m` },
          { item: 'Συνολικό μήκος', formula: `${formatNum(rM)} ＋ ${formatNum(rDm / 10)} ＋ ${formatNum(rCm / 100)}`, val: `${formatNum(sumM)} m` }
        ],
        explain: `Μετατρέπουμε όλα τα τμήματα σε μέτρα: 1ο: ${formatNum(rM)} m, 2ο: ${rDm} dm ＝ ${formatNum(rDm / 10)} m, 3ο: ${rCm} cm ＝ ${formatNum(rCm / 100)} m. Προσθέτουμε: ${formatNum(rM)} ＋ ${formatNum(rDm / 10)} ＋ ${formatNum(rCm / 100)} ＝ ${formatNum(sumM)} m.`,
        distractors: [`${formatNum(sumM + 1)} m`, `${formatNum(sumM - 1)} m`, `${formatNum(sumM + 0.5)} m`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Μετατροπή m σε cm
  const q1M = Number((randInt(2, 8) + pickRandom([0.2, 0.4, 0.5, 0.75])).toFixed(2));
  const q1Cm = Number((q1M * 100).toFixed(0));

  // Q2: MCQ - Βασική σχέση και μονάδα αναφοράς
  const q2Correct = 'Το μέτρο (m)';
  const q2Options = shuffle([
    q2Correct,
    'Το χιλιόμετρο (km)',
    'Το εκατοστόμετρο (cm)',
    'Το τετραγωνικό μέτρο (m²)'
  ]);

  // Q3: Input - Μετατροπή cm σε m
  const q3Cm = randInt(12, 65) * 10 + pickRandom([0, 5]);
  const q3M = Number((q3Cm / 100).toFixed(2));

  // Q4: MCQ - Κανόνας μετατροπών στη σκάλα
  const q4Correct = 'Πολλαπλασιάζουμε όταν πηγαίνουμε σε μικρότερη μονάδα και διαιρούμε όταν πηγαίνουμε σε μεγαλύτερη';
  const q4Options = shuffle([
    q4Correct,
    'Διαιρούμε πάντα με το 10 σε οποιαδήποτε αλλαγή μονάδας',
    'Προσθέτουμε 100 όταν κατεβαίνουμε σκαλοπάτια',
    'Αφαιρούμε μηδενικά ανεξάρτητα από τη μονάδα'
  ]);

  // Q5: Input - Μετατροπή m σε km
  const q5M = randInt(15, 85) * 100;
  const q5Km = Number((q5M / 1000).toFixed(3));

  // Q6: MCQ - Ισοδυναμία υποδιαιρέσεων του μέτρου
  const q6Correct = '1 m ＝ 10 dm ＝ 100 cm ＝ 1.000 mm';
  const q6Options = shuffle([
    q6Correct,
    '1 m ＝ 100 dm ＝ 10 cm ＝ 1.000 mm',
    '1 m ＝ 10 dm ＝ 1.000 cm ＝ 100 mm',
    '1 km ＝ 100 m ＝ 1.000 dm'
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
      title: 'Μετατροπή από Μέτρα σε Εκατοστά',
      prompt: `Πόσα εκατοστά (cm) είναι τα ${formatNum(q1M)} m;`,
      correct: String(q1Cm),
      explain: `Για να μετατρέψουμε μέτρα (m) σε εκατοστά (cm) κατεβαίνουμε δύο σκαλοπάτια, άρα πολλαπλασιάζουμε με το 100: ${formatNum(q1M)} · 100 ＝ ${q1Cm} cm.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Βασική Μονάδα Μέτρησης',
      prompt: 'Ποια είναι η βασική μονάδα μέτρησης του μήκους στο Διεθνές Σύστημα Μονάδων;',
      options: q2Options,
      correct: q2Correct,
      explain: 'Βασική μονάδα μέτρησης του μήκους είναι το μέτρο (m). Όλες οι υπόλοιπες μονάδες (km, dm, cm, mm) είναι πολλαπλάσια ή υποδιαιρέσεις του.'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: 'Μετατροπή από Εκατοστά σε Μέτρα',
      prompt: `Πόσα μέτρα (m) είναι τα ${q3Cm} cm;`,
      correct: formatNum(q3M),
      explain: `Για να μετατρέψουμε εκατοστά (cm) σε μέτρα (m) ανεβαίνουμε δύο σκαλοπάτια, άρα διαιρούμε με το 100: ${q3Cm} : 100 ＝ ${formatNum(q3M)} m.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Κανόνας Μετατροπής Σκάλας',
      prompt: 'Ποιος είναι ο σωστός κανόνας για τις μετατροπές των μονάδων μήκους;',
      options: q4Options,
      correct: q4Correct,
      explain: 'Όταν μετατρέπουμε από μεγαλύτερη σε μικρότερη μονάδα πολλαπλασιάζουμε με δυνάμεις του 10 (10, 100, 1.000). Όταν μετατρέπουμε από μικρότερη σε μεγαλύτερη, διαιρούμε αντίστοιχα.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'decimal',
      title: 'Μετατροπή από Μέτρα σε Χιλιόμετρα',
      prompt: `Πόσα χιλιόμετρα (km) είναι τα ${q5M} m;`,
      correct: formatNum(q5Km),
      explain: `Επειδή 1 km ＝ 1.000 m, για να μετατρέψουμε μέτρα σε χιλιόμετρα διαιρούμε με το 1.000: ${q5M} : 1.000 ＝ ${formatNum(q5Km)} km.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Ισοδυναμία Υποδιαιρέσεων',
      prompt: 'Ποια από τις παρακάτω σχέσεις ισοδυναμίας είναι απολύτως σωστή;',
      options: q6Options,
      correct: q6Correct,
      explain: 'Κάθε μέτρο χωρίζεται ακριβώς σε 10 δεκατόμετρα (dm), 100 εκατοστόμετρα (cm) και 1.000 χιλιοστόμετρα (mm).'
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

export default function MikosExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/(cm|m|km|dm|mm)/gi, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/(cm|m|km|dm|mm)/gi, '').trim().toLowerCase();

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
      title="Ασκήσεις: Μονάδες Μήκους & Μετατροπές - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στις μονάδες μέτρησης μήκους, τις μετατροπές κλίμακας και τις περιμέτρους για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/59-mikos"
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
                <span>ΚΕΦΑΛΑΙΟ 59 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Μονάδες Μήκους
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη σκάλα μετατροπών των μονάδων μήκους (km, m, dm, cm, mm), στους υπολογισμούς περιμέτρου και σε πρακτικά προβλήματα!
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
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-3">
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
                          placeholder={q.inputType === 'decimal' ? 'π.χ. 4,25' : 'Απάντηση...'}
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
                                <th className="p-1.5">{toCleanUppercase('Ανάλυση / Μετατροπή')}</th>
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

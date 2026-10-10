// pages/st-dimotikou/60-baros-ask.js
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
    id: 'p_wt_std_1',
    title: 'Αγορά Αλευριού και Μετατροπή σε Γραμμάρια',
    unit: 'g',
    generate: () => {
      const bags = randInt(4, 8);
      const bagKg = 2.5;
      const totalKg = bags * bagKg;
      const totalG = totalKg * 1000;
      return {
        prompt: `Μια οικογένεια αγόρασε ${bags} σακούλες αλεύρι, βάρους ${formatNum(bagKg)} kg η καθεμία. Πόσα γραμμάρια (g) αλεύρι αγόρασε συνολικά;`,
        unit: 'g',
        correctVal: String(totalG),
        correctText: `${totalG} g`,
        tableData: [
          { item: 'Βάρος σε κιλά', formula: `${bags} · ${formatNum(bagKg)} kg`, val: `${formatNum(totalKg)} kg` },
          { item: 'Σχέση μονάδων', formula: '1 kg ＝ 1.000 g', val: '1.000' },
          { item: 'Συνολικό βάρος σε g', formula: `${formatNum(totalKg)} · 1.000`, val: `${totalG} g` }
        ],
        explain: `Συνολικό βάρος σε κιλά: ${bags} · ${formatNum(bagKg)} ＝ ${formatNum(totalKg)} kg. Μετατρέπουμε σε γραμμάρια πολλαπλασιάζοντας με το 1.000: ${formatNum(totalKg)} · 1.000 ＝ ${totalG} g.`,
        distractors: [`${totalG + 500} g`, `${totalG - 500} g`, `${totalG + 1000} g`]
      };
    }
  },
  {
    id: 'p_wt_std_2',
    title: 'Υπολογισμός Καθαρού Βάρους Πορτοκαλιών',
    unit: 'kg',
    generate: () => {
      const grossKg = randInt(18, 25);
      const tareG = randInt(12, 18) * 100;
      const tareKg = tareG / 1000;
      const netKg = Number((grossKg - tareKg).toFixed(2));
      return {
        prompt: `Ένα καφάσι γεμάτο πορτοκάλια έχει μικτό βάρος ${grossKg} kg. Το άδειο καφάσι (απόβαρο) ζυγίζει ${tareG} g. Ποιο είναι το καθαρό βάρος των πορτοκαλιών σε κιλά (kg);`,
        unit: 'kg',
        correctVal: formatNum(netKg),
        correctText: `${formatNum(netKg)} kg`,
        tableData: [
          { item: 'Μικτό βάρος', formula: `${grossKg} kg`, val: `${grossKg} kg` },
          { item: 'Απόβαρο σε κιλά', formula: `${tareG} : 1.000`, val: `${formatNum(tareKg)} kg` },
          { item: 'Καθαρό βάρος', formula: `${grossKg} － ${formatNum(tareKg)}`, val: `${formatNum(netKg)} kg` }
        ],
        explain: `Μετατρέπουμε το απόβαρο σε κιλά: ${tareG} : 1.000 ＝ ${formatNum(tareKg)} kg. Καθαρό βάρος: Μικτό － Απόβαρο ＝ ${grossKg} － ${formatNum(tareKg)} ＝ ${formatNum(netKg)} kg.`,
        distractors: [`${formatNum(netKg + 1)} kg`, `${formatNum(netKg - 1)} kg`, `${formatNum(netKg + 0.5)} kg`]
      };
    }
  },
  {
    id: 'p_wt_std_3',
    title: 'Αγορά Φέτας και Υπολογισμός Κόστους',
    unit: '€',
    generate: () => {
      const cheeseG = randInt(3, 7) * 250;
      const pricePerKg = randInt(10, 16);
      const cheeseKg = cheeseG / 1000;
      const cost = Number((cheeseKg * pricePerKg).toFixed(2));
      return {
        prompt: `Αγοράσαμε ${cheeseG} g φέτα προς ${pricePerKg} € το κιλό. Πόσα ευρώ (€) πληρώσαμε;`,
        unit: '€',
        correctVal: formatNum(cost),
        correctText: `${formatNum(cost)} €`,
        tableData: [
          { item: 'Βάρος σε κιλά', formula: `${cheeseG} : 1.000`, val: `${formatNum(cheeseKg)} kg` },
          { item: 'Τιμή μονάδας', formula: `${pricePerKg} €/kg`, val: `${pricePerKg} €` },
          { item: 'Συνολικό κόστος', formula: `${formatNum(cheeseKg)} · ${pricePerKg}`, val: `${formatNum(cost)} €` }
        ],
        explain: `Μετατρέπουμε τα γραμμάρια σε κιλά: ${cheeseG} : 1.000 ＝ ${formatNum(cheeseKg)} kg. Κόστος: ${formatNum(cheeseKg)} · ${pricePerKg} ＝ ${formatNum(cost)} €.`,
        distractors: [`${formatNum(cost + 2)} €`, `${formatNum(Math.max(1, cost - 2))} €`, `${formatNum(cost + 3.5)} €`]
      };
    }
  },
  {
    id: 'p_wt_std_4',
    title: 'Συνολικό Βάρος Φαρμάκου σε Γραμμάρια',
    unit: 'g',
    generate: () => {
      const pills = randInt(20, 50);
      const pillMg = 250;
      const totalMg = pills * pillMg;
      const totalG = totalMg / 1000;
      return {
        prompt: `Ένα κουτί περιέχει ${pills} χάπια των ${pillMg} mg το καθένα. Πόσα γραμμάρια (g) φαρμάκου περιέχονται συνολικά στο κουτί;`,
        unit: 'g',
        correctVal: formatNum(totalG),
        correctText: `${formatNum(totalG)} g`,
        tableData: [
          { item: 'Συνολικά χιλιοστόγραμμα', formula: `${pills} · ${pillMg} mg`, val: `${totalMg} mg` },
          { item: 'Σχέση μονάδων', formula: '1 g ＝ 1.000 mg', val: '1.000' },
          { item: 'Μετατροπή σε γραμμάρια', formula: `${totalMg} : 1.000`, val: `${formatNum(totalG)} g` }
        ],
        explain: `Συνολικό βάρος σε χιλιοστόγραμμα: ${pills} · ${pillMg} ＝ ${totalMg} mg. Μετατρέπουμε σε γραμμάρια διαιρώντας με το 1.000: ${totalMg} : 1.000 ＝ ${formatNum(totalG)} g.`,
        distractors: [`${formatNum(totalG + 2.5)} g`, `${formatNum(Math.max(1, totalG - 2.5))} g`, `${formatNum(totalG + 5)} g`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_wt_hard_1',
    title: 'Συνολικό Καθαρό Βάρος Τελάρων με Ροδάκινα',
    unit: 'kg',
    generate: () => {
      const crates = randInt(15, 30);
      const grossPerCrateKg = 22.5;
      const tarePerCrateG = 1500;
      const tarePerCrateKg = tarePerCrateG / 1000;
      const netPerCrateKg = grossPerCrateKg - tarePerCrateKg;
      const totalNetKg = crates * netPerCrateKg;
      return {
        prompt: `Ένας έμπορος παρέλαβε ${crates} τελάρα με ροδάκινα. Το μικτό βάρος κάθε τελάρου ήταν ${formatNum(grossPerCrateKg)} kg και το απόβαρο κάθε άδειου τελάρου ${tarePerCrateG} g. Ποιο είναι το συνολικό καθαρό βάρος των ροδάκινων σε κιλά (kg);`,
        unit: 'kg',
        correctVal: String(totalNetKg),
        correctText: `${totalNetKg} kg`,
        tableData: [
          { item: 'Απόβαρο ανά τελάρο σε κιλά', formula: `${tarePerCrateG} : 1.000`, val: `${formatNum(tarePerCrateKg)} kg` },
          { item: 'Καθαρό βάρος ανά τελάρο', formula: `${formatNum(grossPerCrateKg)} － ${formatNum(tarePerCrateKg)}`, val: `${netPerCrateKg} kg` },
          { item: 'Συνολικό καθαρό βάρος', formula: `${crates} · ${netPerCrateKg}`, val: `${totalNetKg} kg` }
        ],
        explain: `Μετατρέπουμε το απόβαρο σε κιλά: ${tarePerCrateG} : 1.000 ＝ ${formatNum(tarePerCrateKg)} kg. Καθαρό βάρος ανά τελάρο: ${formatNum(grossPerCrateKg)} － ${formatNum(tarePerCrateKg)} ＝ ${netPerCrateKg} kg. Συνολικό καθαρό βάρος για τα ${crates} τελάρα: ${crates} · ${netPerCrateKg} ＝ ${totalNetKg} kg.`,
        distractors: [`${totalNetKg + 30} kg`, `${totalNetKg - 25} kg`, `${totalNetKg + 50} kg`]
      };
    }
  },
  {
    id: 'p_wt_hard_2',
    title: 'Υπολειπόμενο Επιτρεπόμενο Φορτίο Φορτηγού',
    unit: 't',
    generate: () => {
      const truckLimitT = 4.2;
      const truckLimitKg = truckLimitT * 1000;
      const bagsCount = 90;
      const bagKg = 40;
      const currentLoadKg = bagsCount * bagKg;
      const remainKg = truckLimitKg - currentLoadKg;
      const remainT = remainKg / 1000;
      return {
        prompt: `Ένα φορτηγό έχει μέγιστο επιτρεπόμενο όριο φορτίου ${formatNum(truckLimitT)} t. Φορτώθηκαν σε αυτό ${bagsCount} τσουβάλια τσιμέντο των ${bagKg} kg το καθένα. Πόσους τόνους (t) επιπλέον φορτίου μπορεί να μεταφέρει το φορτηγό χωρίς να ξεπεράσει το όριο;`,
        unit: 't',
        correctVal: formatNum(remainT),
        correctText: `${formatNum(remainT)} t`,
        tableData: [
          { item: 'Όριο σε κιλά', formula: `${formatNum(truckLimitT)} · 1.000`, val: `${truckLimitKg} kg` },
          { item: 'Τρέχον φορτίο σε κιλά', formula: `${bagsCount} · ${bagKg}`, val: `${currentLoadKg} kg` },
          { item: 'Υπόλοιπο σε τόνους', formula: `(${truckLimitKg} － ${currentLoadKg}) : 1.000`, val: `${formatNum(remainT)} t` }
        ],
        explain: `Όριο σε κιλά: ${formatNum(truckLimitT)} · 1.000 ＝ ${truckLimitKg} kg. Τρέχον φορτίο: ${bagsCount} · ${bagKg} ＝ ${currentLoadKg} kg. Υπόλοιπο σε κιλά: ${truckLimitKg} － ${currentLoadKg} ＝ ${remainKg} kg. Μετατρέπουμε σε τόνους: ${remainKg} : 1.000 ＝ ${formatNum(remainT)} t.`,
        distractors: [`${formatNum(remainT + 0.4)} t`, `${formatNum(Math.max(0.1, remainT - 0.2))} t`, `${formatNum(remainT + 0.8)} t`]
      };
    }
  },
  {
    id: 'p_wt_hard_3',
    title: 'Είσπραξη από Πώληση Καθαρού Βάρους Μελιού',
    unit: '€',
    generate: () => {
      const netKg = 120;
      const pricePerKg = 4.5;
      const totalRevenue = netKg * pricePerKg;
      const tareWeightKg = 12;
      const grossKg = netKg + tareWeightKg;
      return {
        prompt: `Ένας παραγωγός πούλησε μέλι προς ${formatNum(pricePerKg)} € το κιλό καθαρού βάρους. Αν το μικτό βάρος των δοχείων ήταν ${grossKg} kg και το συνολικό απόβαρο των κενών δοχείων ${tareWeightKg} kg, πόσα ευρώ (€) εισέπραξε;`,
        unit: '€',
        correctVal: formatNum(totalRevenue),
        correctText: `${formatNum(totalRevenue)} €`,
        tableData: [
          { item: 'Καθαρό βάρος', formula: `${grossKg} － ${tareWeightKg}`, val: `${netKg} kg` },
          { item: 'Τιμή ανά κιλό καθαρού', formula: `${formatNum(pricePerKg)} €/kg`, val: `${formatNum(pricePerKg)} €` },
          { item: 'Συνολική είσπραξη', formula: `${netKg} · ${formatNum(pricePerKg)}`, val: `${formatNum(totalRevenue)} €` }
        ],
        explain: `Πληρώνεται αποκλειστικά το καθαρό βάρος! Καθαρό βάρος μελιού: ${grossKg} － ${tareWeightKg} ＝ ${netKg} kg. Συνολική είσπραξη: ${netKg} · ${formatNum(pricePerKg)} ＝ ${formatNum(totalRevenue)} €.`,
        distractors: [`${formatNum(totalRevenue + 54)} €`, `${formatNum(totalRevenue - 45)} €`, `${formatNum(totalRevenue + 90)} €`]
      };
    }
  },
  {
    id: 'p_wt_hard_4',
    title: 'Συνολικό Βάρος Φορτίων σε Τόνους',
    unit: 't',
    generate: () => {
      const part1T = 1.8;
      const part2Kg = 750;
      const part3Kg = 450;
      const sumKg = (part1T * 1000) + part2Kg + part3Kg;
      const sumT = sumKg / 1000;
      return {
        prompt: `Σε μια αποθήκη παραδόθηκαν τρία φορτία σιταριού: το 1ο ζύγιζε ${formatNum(part1T)} t, το 2ο ${part2Kg} kg και το 3ο ${part3Kg} kg. Πόσους τόνους (t) σιταριού παρέλαβε συνολικά η αποθήκη;`,
        unit: 't',
        correctVal: formatNum(sumT),
        correctText: `${formatNum(sumT)} t`,
        tableData: [
          { item: '1ο Φορτίο', formula: `${formatNum(part1T)} t`, val: `${formatNum(part1T)} t` },
          { item: '2ο Φορτίο σε τόνους', formula: `${part2Kg} : 1.000`, val: `${formatNum(part2Kg / 1000)} t` },
          { item: '3ο Φορτίο σε τόνους', formula: `${part3Kg} : 1.000`, val: `${formatNum(part3Kg / 1000)} t` },
          { item: 'Συνολικό βάρος', formula: `${formatNum(part1T)} ＋ ${formatNum(part2Kg / 1000)} ＋ ${formatNum(part3Kg / 1000)}`, val: `${formatNum(sumT)} t` }
        ],
        explain: `Μετατρέπουμε όλα τα φορτία σε τόνους: 1ο: ${formatNum(part1T)} t, 2ο: ${part2Kg} : 1.000 ＝ ${formatNum(part2Kg / 1000)} t, 3ο: ${part3Kg} : 1.000 ＝ ${formatNum(part3Kg / 1000)} t. Άθροισμα: ${formatNum(part1T)} ＋ ${formatNum(part2Kg / 1000)} ＋ ${formatNum(part3Kg / 1000)} ＝ ${formatNum(sumT)} t.`,
        distractors: [`${formatNum(sumT + 0.5)} t`, `${formatNum(sumT - 0.5)} t`, `${formatNum(sumT + 1)} t`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Μετατροπή kg σε g
  const q1Kg = Number((randInt(2, 7) + pickRandom([0.2, 0.4, 0.5, 0.75])).toFixed(2));
  const q1G = Number((q1Kg * 1000).toFixed(0));

  // Q2: MCQ - Βασική μονάδα μέτρησης μάζας
  const q2Correct = 'Το χιλιόγραμμο ή κιλό (kg)';
  const q2Options = shuffle([
    q2Correct,
    'Ο τόνος (t)',
    'Το γραμμάριο (g)',
    'Το χιλιοστόγραμμο (mg)'
  ]);

  // Q3: Input - Μετατροπή g σε kg
  const q3G = randInt(15, 85) * 100 + pickRandom([0, 50]);
  const q3Kg = Number((q3G / 1000).toFixed(3));

  // Q4: MCQ - Σχέση Μικτού, Καθαρού και Αποβάρου
  const q4Correct = 'Καθαρό Βάρος ＝ Μικτό Βάρος － Απόβαρο';
  const q4Options = shuffle([
    q4Correct,
    'Καθαρό Βάρος ＝ Μικτό Βάρος ＋ Απόβαρο',
    'Απόβαρο ＝ Μικτό Βάρος ＋ Καθαρό Βάρος',
    'Μικτό Βάρος ＝ Καθαρό Βάρος － Απόβαρο'
  ]);

  // Q5: Input - Μετατροπή kg σε t
  const q5Kg = randInt(12, 75) * 100;
  const q5T = Number((q5Kg / 1000).toFixed(3));

  // Q6: MCQ - Ισοδυναμία υποδιαιρέσεων και πολλαπλασίων
  const q6Correct = '1 t ＝ 1.000 kg και 1 kg ＝ 1.000 g';
  const q6Options = shuffle([
    q6Correct,
    '1 t ＝ 100 kg και 1 kg ＝ 100 g',
    '1 t ＝ 1.000 g και 1 kg ＝ 1.000 mg',
    '1 kg ＝ 100 g και 1 g ＝ 1.000 mg'
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
      title: 'Μετατροπή από Κιλά σε Γραμμάρια',
      prompt: `Πόσα γραμμάρια (g) είναι τα ${formatNum(q1Kg)} kg;`,
      correct: String(q1G),
      explain: `Επειδή 1 kg ＝ 1.000 g, για να μετατρέψουμε κιλά σε γραμμάρια πολλαπλασιάζουμε με το 1.000: ${formatNum(q1Kg)} · 1.000 ＝ ${q1G} g.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Βασική Μονάδα Βάρους',
      prompt: 'Ποια είναι η βασική μονάδα μέτρησης του βάρους (μάζας) στην καθημερινή ζωή;',
      options: q2Options,
      correct: q2Correct,
      explain: 'Βασική μονάδα μέτρησης του βάρους είναι το χιλιόγραμμο (kg), το οποίο συνήθως αποκαλούμε απλά κιλό.'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: 'Μετατροπή από Γραμμάρια σε Κιλά',
      prompt: `Πόσα κιλά (kg) είναι τα ${formatNum(q3G, 0)} g;`,
      correct: formatNum(q3Kg),
      explain: `Για να μετατρέψουμε γραμμάρια σε κιλά διαιρούμε με το 1.000: ${formatNum(q3G, 0)} : 1.000 ＝ ${formatNum(q3Kg)} kg.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Σχέση Καθαρού & Μικτού Βάρους',
      prompt: 'Ποιος είναι ο σωστός τύπος για τον υπολογισμό του καθαρού βάρους ενός προϊόντος;',
      options: q4Options,
      correct: q4Correct,
      explain: 'Το καθαρό βάρος προκύπτει αφαιρώντας το βάρος της συσκευασίας (απόβαρο) από το συνολικό βάρος (μικτό): Καθαρό ＝ Μικτό － Απόβαρο.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'decimal',
      title: 'Μετατροπή από Κιλά σε Τόνους',
      prompt: `Πόσοι τόνοι (t) είναι τα ${formatNum(q5Kg, 0)} kg;`,
      correct: formatNum(q5T),
      explain: `Επειδή 1 t ＝ 1.000 kg, για να μετατρέψουμε κιλά σε τόνους διαιρούμε με το 1.000: ${formatNum(q5Kg, 0)} : 1.000 ＝ ${formatNum(q5T)} t.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Ισοδυναμία Μονάδων Βάρους',
      prompt: 'Ποια από τις παρακάτω σχέσεις ισοδυναμίας των μονάδων βάρους είναι σωστή;',
      options: q6Options,
      correct: q6Correct,
      explain: 'Ένας τόνος έχει ακριβώς 1.000 κιλά (1 t ＝ 1.000 kg) και ένα κιλό έχει ακριβώς 1.000 γραμμάρια (1 kg ＝ 1.000 g).'
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
      inputType: 'number',
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

export default function BarosExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/(kg|g|t|mg|€)/gi, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/(kg|g|t|mg|€)/gi, '').trim().toLowerCase();

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
      title="Ασκήσεις: Μονάδες Βάρους & Μετατροπές - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στις μονάδες μέτρησης βάρους (t, kg, g, mg), στο μικτό και καθαρό βάρος για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/60-baros"
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
                <span>ΚΕΦΑΛΑΙΟ 60 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Μονάδες Βάρους
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη σκάλα μετατροπών των μονάδων βάρους (t, kg, g, mg), στη διάκριση μικτού, καθαρού βάρους και αποβάρου και σε ρεαλιστικά προβλήματα!
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
                          placeholder={q.inputType === 'decimal' ? 'π.χ. 2,45' : 'Απάντηση...'}
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

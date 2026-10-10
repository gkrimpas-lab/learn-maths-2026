// pages/st-dimotikou/58-mesos-oros-ask.js
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
    id: 'p_avg_std_1',
    title: 'Μέσος Όρος Βαθμολογίας Μαθημάτων',
    unit: 'βαθμοί',
    generate: () => {
      const g1 = randInt(14, 18);
      const g2 = randInt(15, 19);
      const g3 = randInt(16, 20);
      const g4 = randInt(13, 17);
      const sum = g1 + g2 + g3 + g4;
      const avg = sum / 4;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        prompt: `Ένας μαθητής της ΣΤ' Δημοτικού έγραψε στα τέσσερα μαθήματα βαθμούς: ${g1}, ${g2}, ${g3} και ${g4}. Ποιος είναι ο μέσος όρος της βαθμολογίας του;`,
        unit: 'βαθμοί',
        correctVal: formatNum(cleanAvg),
        correctText: `${formatNum(cleanAvg)}`,
        tableData: [
          { item: 'Βαθμολογίες 4 μαθημάτων', formula: `${g1} ＋ ${g2} ＋ ${g3} ＋ ${g4}`, val: `${sum} βαθμοί` },
          { item: 'Πλήθος μαθημάτων', formula: '4 μαθήματα', val: '4' },
          { item: 'Μέσος όρος', formula: `${sum} : 4`, val: `${formatNum(cleanAvg)}` }
        ],
        explain: `Αθροίζουμε όλους τους βαθμούς: ${g1} ＋ ${g2} ＋ ${g3} ＋ ${g4} ＝ ${sum}. Διαιρούμε με το πλήθος των μαθημάτων (4): ${sum} : 4 ＝ ${formatNum(cleanAvg)}.`
      };
    }
  },
  {
    id: 'p_avg_std_2',
    title: 'Μέσος Όρος Πόντων με Μηδενική Τιμή',
    unit: 'πόντοι',
    generate: () => {
      const p1 = randInt(10, 16);
      const p2 = randInt(12, 18);
      const p3 = 0;
      const p4 = randInt(14, 22);
      const sum = p1 + p2 + p3 + p4;
      const avg = sum / 4;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        prompt: `Μια αθλήτρια μπάσκετ σε 4 αγώνες σημείωσε: ${p1}, ${p2}, ${p3} και ${p4} πόντους. Ποιος είναι ο μέσος όρος πόντων της ανά αγώνα;`,
        unit: 'πόντοι',
        correctVal: formatNum(cleanAvg),
        correctText: `${formatNum(cleanAvg)} πόντοι`,
        tableData: [
          { item: 'Συνολικοί πόντοι (συμπεριλαμβανομένου του 0)', formula: `${p1} ＋ ${p2} ＋ ${p3} ＋ ${p4}`, val: `${sum} πόντοι` },
          { item: 'Σύνολο αγώνων', formula: '4 αγώνες', val: '4' },
          { item: 'Μέσος όρος ανά αγώνα', formula: `${sum} : 4`, val: `${formatNum(cleanAvg)}` }
        ],
        explain: `Προσέχουμε ότι ο αγώνας με τους 0 πόντους μετράει κανονικά στο πλήθος των αγώνων! Συνολικοί πόντοι: ${p1} ＋ ${p2} ＋ ${p3} ＋ ${p4} ＝ ${sum}. Διαιρούμε με το 4: ${sum} : 4 ＝ ${formatNum(cleanAvg)} πόντοι ανά αγώνα.`,
        distractors: [`${formatNum(cleanAvg + 2)}`, `${formatNum(Math.max(1, cleanAvg - 2))}`, `${formatNum(cleanAvg + 4)}`]
      };
    }
  },
  {
    id: 'p_avg_std_3',
    title: 'Μέσος Όρος Πελατών Σούπερ Μάρκετ',
    unit: 'πελάτες',
    generate: () => {
      const c1 = randInt(6, 8) * 10;
      const c2 = randInt(5, 7) * 10;
      const c3 = randInt(7, 9) * 10;
      const sum = c1 + c2 + c3;
      const avg = sum / 3;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        prompt: `Ένα σούπερ μάρκετ είχε τις τρεις πρώτες ημέρες της εβδομάδας ${c1}, ${c2} και ${c3} πελάτες αντίστοιχα. Ποιος ήταν ο μέσος όρος πελατών ανά ημέρα;`,
        unit: 'πελάτες',
        correctVal: formatNum(cleanAvg),
        correctText: `${formatNum(cleanAvg)} πελάτες`,
        tableData: [
          { item: 'Σύνολο πελατών', formula: `${c1} ＋ ${c2} ＋ ${c3}`, val: `${sum} πελάτες` },
          { item: 'Πλήθος ημερών', formula: '3 ημέρες', val: '3' },
          { item: 'Μέσος όρος ανά ημέρα', formula: `${sum} : 3`, val: `${formatNum(cleanAvg)}` }
        ],
        explain: `Συνολικοί πελάτες: ${c1} ＋ ${c2} ＋ ${c3} ＝ ${sum}. Διαιρούμε με τις 3 ημέρες: ${sum} : 3 ＝ ${formatNum(cleanAvg)} πελάτες.`,
        distractors: [`${formatNum(cleanAvg + 10)}`, `${formatNum(cleanAvg - 10)}`, `${formatNum(cleanAvg + 15)}`]
      };
    }
  },
  {
    id: 'p_avg_std_4',
    title: 'Μέση Θερμοκρασία Πενθημέρου',
    unit: '°C',
    generate: () => {
      const t1 = randInt(14, 18);
      const t2 = randInt(19, 23);
      const t3 = randInt(22, 26);
      const t4 = randInt(17, 21);
      const t5 = randInt(13, 17);
      const sum = t1 + t2 + t3 + t4 + t5;
      const avg = sum / 5;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        prompt: `Σε έναν μετεωρολογικό σταθμό καταγράφηκαν οι μεσημεριανές θερμοκρασίες για 5 συνεχόμενες ημέρες: ${t1}°C, ${t2}°C, ${t3}°C, ${t4}°C και ${t5}°C. Ποια ήταν η μέση θερμοκρασία (°C);`,
        unit: '°C',
        correctVal: formatNum(cleanAvg),
        correctText: `${formatNum(cleanAvg)} °C`,
        tableData: [
          { item: 'Άθροισμα θερμοκρασιών', formula: `${t1} ＋ ${t2} ＋ ${t3} ＋ ${t4} ＋ ${t5}`, val: `${sum} °C` },
          { item: 'Πλήθος ημερών', formula: '5 ημέρες', val: '5' },
          { item: 'Μέση θερμοκρασία', formula: `${sum} : 5`, val: `${formatNum(cleanAvg)} °C` }
        ],
        explain: `Άθροισμα θερμοκρασιών: ${t1} ＋ ${t2} ＋ ${t3} ＋ ${t4} ＋ ${t5} ＝ ${sum}°C. Διαιρούμε με τις 5 ημέρες: ${sum} : 5 ＝ ${formatNum(cleanAvg)}°C.`,
        distractors: [`${formatNum(cleanAvg + 1.5)} °C`, `${formatNum(cleanAvg - 1.5)} °C`, `${formatNum(cleanAvg + 2)} °C`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_avg_hard_1',
    title: 'Υπολογισμός Βαθμού για Επίτευξη Στόχου',
    unit: 'βαθμοί',
    generate: () => {
      const targetAvg = randInt(16, 18);
      const g1 = targetAvg - randInt(1, 3);
      const g2 = targetAvg + randInt(0, 2);
      const g3 = targetAvg - randInt(0, 2);
      const currentSum = g1 + g2 + g3;
      const requiredSum = targetAvg * 4;
      const g4 = requiredSum - currentSum;
      return {
        prompt: `Ένας μαθητής έγραψε στα τρία πρώτα τεστ βαθμούς ${g1}, ${g2} και ${g3}. Τι βαθμό πρέπει να γράψει στο 4ο τεστ για να έχει τελικό μέσο όρο ακριβώς ${targetAvg};`,
        unit: 'βαθμοί',
        correctVal: String(g4),
        correctText: `${g4}`,
        tableData: [
          { item: 'Απαιτούμενο συνολικό άθροισμα', formula: `4 · ${targetAvg}`, val: `${requiredSum} βαθμοί` },
          { item: 'Άθροισμα πρώτων 3 τεστ', formula: `${g1} ＋ ${g2} ＋ ${g3}`, val: `${currentSum} βαθμοί` },
          { item: 'Απαιτούμενος βαθμός 4ου τεστ', formula: `${requiredSum} － ${currentSum}`, val: `${g4}` }
        ],
        explain: `Για να έχει μέσο όρο ${targetAvg} σε 4 τεστ, το συνολικό άθροισμα των βαθμών του πρέπει να είναι: 4 · ${targetAvg} ＝ ${requiredSum}. Στα τρία πρώτα τεστ έχει συγκεντρώσει: ${g1} ＋ ${g2} ＋ ${g3} ＝ ${currentSum}. Άρα στο 4ο τεστ χρειάζεται: ${requiredSum} － ${currentSum} ＝ ${g4}.`,
        distractors: [`${g4 + 1}`, `${g4 - 1}`, `${g4 + 2}`]
      };
    }
  },
  {
    id: 'p_avg_hard_2',
    title: 'Νέος Μέσος Όρος μετά από Προσθήκη Μέλους',
    unit: 'έτη',
    generate: () => {
      const count = 5;
      const avgAge = randInt(11, 14);
      const totalAge = count * avgAge;
      const newChildAge = randInt(16, 18);
      const newTotal = totalAge + newChildAge;
      const newCount = count + 1;
      const newAvg = newTotal / newCount;
      const cleanNewAvg = Number.isInteger(newAvg) ? newAvg : Number(newAvg.toFixed(2));
      return {
        prompt: `Μια ομάδα 5 παιδιών έχει μέσο όρο ηλικίας ${avgAge} έτη. Στην ομάδα προστίθεται ένα νέο παιδί ηλικίας ${newChildAge} ετών. Ποιος είναι ο νέος μέσος όρος ηλικίας της ομάδας (6 παιδιά);`,
        unit: 'έτη',
        correctVal: formatNum(cleanNewAvg),
        correctText: `${formatNum(cleanNewAvg)} έτη`,
        tableData: [
          { item: 'Αρχικό άθροισμα ηλικιών (5 παιδιά)', formula: `5 · ${avgAge}`, val: `${totalAge} έτη` },
          { item: 'Νέο συνολικό άθροισμα (6 παιδιά)', formula: `${totalAge} ＋ ${newChildAge}`, val: `${newTotal} έτη` },
          { item: 'Νέος μέσος όρος', formula: `${newTotal} : 6`, val: `${formatNum(cleanNewAvg)} έτη` }
        ],
        explain: `Το αρχικό άθροισμα ηλικιών των 5 παιδιών είναι: 5 · ${avgAge} ＝ ${totalAge} έτη. Με το νέο παιδί, το νέο άθροισμα γίνεται: ${totalAge} ＋ ${newChildAge} ＝ ${newTotal} έτη. Διαιρούμε με το νέο πλήθος των παιδιών (6): ${newTotal} : 6 ＝ ${formatNum(cleanNewAvg)} έτη.`,
        distractors: [`${formatNum(cleanNewAvg + 0.5)} έτη`, `${formatNum(Math.max(1, cleanNewAvg - 0.5))} έτη`, `${formatNum(cleanNewAvg + 1)} έτη`]
      };
    }
  },
  {
    id: 'p_avg_hard_3',
    title: 'Εύρεση Τιμής Τελευταίας Ημέρας Εβδομάδας',
    unit: '°C',
    generate: () => {
      const days = 7;
      const targetWeeklyAvg = randInt(15, 20);
      const totalSum = days * targetWeeklyAvg;
      const first6Sum = totalSum - randInt(12, 22);
      const lastDayTemp = totalSum - first6Sum;
      return {
        prompt: `Σε μια πόλη η μέση θερμοκρασία μιας εβδομάδας (7 ημέρες) ήταν ${targetWeeklyAvg}°C. Το άθροισμα των θερμοκρασιών των πρώτων 6 ημερών ήταν ${first6Sum}°C. Ποια ήταν η θερμοκρασία (°C) την 7η ημέρα;`,
        unit: '°C',
        correctVal: String(lastDayTemp),
        correctText: `${lastDayTemp} °C`,
        tableData: [
          { item: 'Συνολικό άθροισμα 7 ημερών', formula: `7 · ${targetWeeklyAvg}`, val: `${totalSum} °C` },
          { item: 'Άθροισμα πρώτων 6 ημερών', formula: `${first6Sum} °C`, val: `${first6Sum} °C` },
          { item: 'Θερμοκρασία 7ης ημέρας', formula: `${totalSum} － ${first6Sum}`, val: `${lastDayTemp} °C` }
        ],
        explain: `Το συνολικό άθροισμα των 7 ημερών είναι: 7 · ${targetWeeklyAvg} ＝ ${totalSum}°C. Αφαιρούμε το άθροισμα των πρώτων 6 ημερών: ${totalSum} － ${first6Sum} ＝ ${lastDayTemp}°C.`,
        distractors: [`${lastDayTemp + 2} °C`, `${lastDayTemp - 2} °C`, `${lastDayTemp + 3} °C`]
      };
    }
  },
  {
    id: 'p_avg_hard_4',
    title: 'Εύρεση Μισθού Τέταρτου Εργαζομένου',
    unit: '€',
    generate: () => {
      const workers = 4;
      const avgSalary = randInt(85, 110) * 10;
      const totalSalaries = workers * avgSalary;
      const s1 = avgSalary - 100;
      const s2 = avgSalary + 150;
      const s3 = avgSalary - 50;
      const s4 = totalSalaries - (s1 + s2 + s3);
      return {
        prompt: `Τέσσερις εργαζόμενοι έχουν μέσο μηνιαίο μισθό ${avgSalary} €. Αν οι τρεις πρώτοι αμείβονται με ${s1} €, ${s2} € και ${s3} €, ποιος είναι ο μισθός του τέταρτου εργαζομένου σε €;`,
        unit: '€',
        correctVal: String(s4),
        correctText: `${s4} €`,
        tableData: [
          { item: 'Συνολικό ποσό 4 μισθών', formula: `4 · ${avgSalary}`, val: `${totalSalaries} €` },
          { item: 'Άθροισμα 3 γνωστών μισθών', formula: `${s1} ＋ ${s2} ＋ ${s3}`, val: `${s1 + s2 + s3} €` },
          { item: 'Μισθός 4ου εργαζομένου', formula: `${totalSalaries} － ${s1 + s2 + s3}`, val: `${s4} €` }
        ],
        explain: `Το σύνολο των μισθών των 4 εργαζομένων είναι: 4 · ${avgSalary} ＝ ${totalSalaries} €. Το άθροισμα των τριών πρώτων είναι: ${s1} ＋ ${s2} ＋ ${s3} ＝ ${s1 + s2 + s3} €. Άρα ο 4ος παίρνει: ${totalSalaries} － ${s1 + s2 + s3} ＝ ${s4} €.`,
        distractors: [`${s4 + 100} €`, `${s4 - 100} €`, `${s4 + 50} €`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Βασικός υπολογισμός μέσου όρου 3 ακέραιων τιμών
  const q1A = randInt(10, 18);
  const q1B = randInt(12, 22);
  const q1C = randInt(14, 24);
  const q1Sum = q1A + q1B + q1C;
  const q1Avg = q1Sum / 3;
  const q1CleanAvg = Number.isInteger(q1Avg) ? q1Avg : Number(q1Avg.toFixed(2));

  // Q2: MCQ - Μαθηματικός τύπος και ορισμός μέσου όρου
  const q2Correct = 'Διαιρούμε το άθροισμα όλων των τιμών με το πλήθος των τιμών';
  const q2Options = shuffle([
    q2Correct,
    'Πολλαπλασιάζουμε τη μικρότερη τιμή με τη μεγαλύτερη',
    'Αφαιρούμε τη μικρότερη τιμή από το άθροισμα των υπόλοιπων',
    'Διαιρούμε πάντα με το 100 όπως στα ποσοστά'
  ]);

  // Q3: Input - Μέσος όρος με την παρουσία μηδενικής τιμής
  const q3A = randInt(12, 18);
  const q3B = 0;
  const q3C = randInt(16, 24);
  const q3D = randInt(14, 22);
  const q3Sum = q3A + q3B + q3C + q3D;
  const q3Avg = q3Sum / 4;
  const q3CleanAvg = Number.isInteger(q3Avg) ? q3Avg : Number(q3Avg.toFixed(2));

  // Q4: MCQ - Ιδιότητα μέσου όρου (εύρος τιμών)
  const q4Min = 12;
  const q4Max = 28;
  const q4Correct = `Βρίσκεται πάντοτε ανάμεσα στο ${q4Min} και στο ${q4Max}`;
  const q4Options = shuffle([
    q4Correct,
    `Είναι πάντοτε μεγαλύτερος από το ${q4Max}`,
    'Είναι πάντοτε ίσος με το μηδέν',
    `Είναι πάντοτε μικρότερος από το ${q4Min}`
  ]);

  // Q5: Input - Αντίστροφος υπολογισμός συνολικού αθροίσματος
  const q5Count = randInt(4, 8);
  const q5Avg = randInt(12, 25);
  const q5Total = q5Count * q5Avg;

  // Q6: MCQ - Μέσος όρος ίσων τιμών
  const q6Val = randInt(14, 28);
  const q6Options = shuffle([
    `${q6Val}`,
    `${q6Val * 2}`,
    `${q6Val / 2}`,
    `${q6Val + 2}`
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
      title: 'Βασικός Υπολογισμός Μέσου Όρου',
      prompt: `Ποιος είναι ο μέσος όρος των αριθμών ${q1A}, ${q1B} και ${q1C};`,
      correct: formatNum(q1CleanAvg),
      explain: `Προσθέτουμε όλους τους αριθμούς: ${q1A} ＋ ${q1B} ＋ ${q1C} ＝ ${q1Sum}. Διαιρούμε με το πλήθος τους (3): ${q1Sum} : 3 ＝ ${formatNum(q1CleanAvg)}.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Μαθηματικός Ορισμός Μέσης Τιμής',
      prompt: 'Πώς υπολογίζουμε τον μέσο όρο (μέση τιμή) μιας ομάδας δεδομένων;',
      options: q2Options,
      correct: q2Correct,
      explain: 'Ο μέσος όρος ισούται πάντοτε με το άθροισμα όλων των τιμών διαιρεμένο με το πλήθος των τιμών.'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: 'Μέσος Όρος με Μηδενική Τιμή',
      prompt: `Βρείτε τον μέσο όρο των τεσσάρων αριθμών: ${q3A}, ${q3B}, ${q3C} και ${q3D}:`,
      correct: formatNum(q3CleanAvg),
      explain: `Το μηδέν (0) συμμετέχει κανονικά στο πλήθος των τιμών! Άθροισμα: ${q3A} ＋ ${q3B} ＋ ${q3C} ＋ ${q3D} ＝ ${q3Sum}. Διαιρούμε με το 4: ${q3Sum} : 4 ＝ ${formatNum(q3CleanAvg)}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Ιδιότητα του Μέσου Όρου',
      prompt: `Αν σε μια ομάδα αριθμών η μικρότερη τιμή είναι το ${q4Min} και η μεγαλύτερη το ${q4Max}, τι ισχύει υποχρεωτικά για τον μέσο όρο;`,
      options: q4Options,
      correct: q4Correct,
      explain: 'Ο μέσος όρος εκφράζει την εξισορρόπηση των τιμών, επομένως βρίσκεται πάντοτε αυστηρά ανάμεσα στη μικρότερη και τη μεγαλύτερη τιμή των δεδομένων.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Αντίστροφη Εύρεση Αθροίσματος',
      prompt: `Ο μέσος όρος ${q5Count} αριθμών είναι ${q5Avg}. Ποιο είναι το άθροισμα αυτών των ${q5Count} αριθμών;`,
      correct: String(q5Total),
      explain: `Εφόσον Μέσος Όρος ＝ Άθροισμα : Πλήθος, ισχύει αντίστροφα: Άθροισμα ＝ Μέσος Όρος · Πλήθος ＝ ${q5Avg} · ${q5Count} ＝ ${q5Total}.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Μέσος Όρος Ίσων Τιμών',
      prompt: `Αν όλες οι τιμές μιας ομάδας είναι ίσες με ${q6Val}, ποιος είναι ο μέσος όρος τους;`,
      options: q6Options,
      correct: `${q6Val}`,
      explain: `Όταν όλες οι τιμές είναι ίσες μεταξύ τους (π.χ. (${q6Val} ＋ ${q6Val}) : 2 ＝ ${q6Val}), ο μέσος όρος ισούται πάντοτε με την ίδια την τιμή: ${q6Val}.`
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

export default function MesosOrosExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/[%°€]/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/[%°€]/g, '').trim().toLowerCase();

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
      title="Ασκήσεις: Μέσος Όρος (Μέση Τιμή) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στον μέσο όρο και σε αντίστροφους υπολογισμούς στόχου για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/58-mesos-oros"
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
                <span>ΚΕΦΑΛΑΙΟ 58 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Ο Μέσος Όρος (Μέση Τιμή)
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον υπολογισμό του μέσου όρου, στη διαχείριση μηδενικών τιμών και σε απαιτητικούς αντίστροφους υπολογισμούς στόχου!
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
                          placeholder={q.inputType === 'decimal' ? 'π.χ. 16,5' : 'Απάντηση...'}
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

// pages/st-dimotikou/19-ekp-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Τυχαίος ακέραιος στο [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ανακάτεμα πίνακα
function shuffle(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Μέγιστος Κοινός Διαιρέτης
function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

// Ελάχιστο Κοινό Πολλαπλάσιο δύο αριθμών
function lcmTwo(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

// ΕΚΠ πίνακα αριθμών
function lcmArray(arr) {
  return arr.reduce((acc, curr) => lcmTwo(acc, curr), arr[0]);
}

// Διευρυμένη δεξαμενή προβλημάτων για την Ερώτηση 9 (MCQ)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_ekp_std_1',
    generate: () => {
      const busA = 12;
      const busB = 18;
      const l = lcmTwo(busA, busB);
      const correctStr = `${l} λεπτά`;
      return {
        title: 'ΣΥΓΧΡΟΝΙΣΜΟΣ ΔΡΟΜΟΛΟΓΙΩΝ ΛΕΩΦΟΡΕΙΩΝ',
        instruction: 'Επιλέξτε τον σωστό χρόνο ταυτόχρονης αναχώρησης:',
        text: `Σε έναν σταθμό, το λεωφορείο Α αναχωρεί κάθε ${busA} λεπτά και το λεωφορείο Β αναχωρεί κάθε ${busB} λεπτά. Αν ξεκινήσουν ταυτόχρονα στις 08:00 το πρωί, μετά από πόσα λεπτά θα αναχωρήσουν ξανά ταυτόχρονα για πρώτη φορά;`,
        tableData: { col1: 'Δρομολόγια', col2: 'Χρόνος Αναχώρησης', r1: [`Λεωφορείο Α: ${busA} λ.`, `Λεωφορείο Β: ${busB} λ.`], r2: ['Υπολογισμός Ε.Κ.Π.', `Ε.Κ.Π.(${busA}, ${busB}) ＝ ${l} λεπτά ✅`] },
        optionsRaw: [
          correctStr,
          `${busA + busB} λεπτά`,
          `${l * 2} λεπτά`,
          `${busA * 2} λεπτά`
        ],
        correctText: correctStr,
        explanation: `Τα λεωφορεία θα συναντηθούν στο Ελάχιστο Κοινό Πολλαπλάσιο των χρόνων τους: Ε.Κ.Π.(${busA}, ${busB}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_std_2',
    generate: () => {
      const light1 = 15;
      const light2 = 20;
      const l = lcmTwo(light1, light2);
      const correctStr = `${l} δευτερόλεπτα`;
      return {
        title: 'ΡΥΘΜΙΚΕΣ ΦΩΤΕΙΝΕΣ ΠΙΝΑΚΙΔΕΣ',
        instruction: 'Επιλέξτε κάθε πόσα δευτερόλεπτα ανάβουν ταυτόχρονα:',
        text: `Σε έναν δρόμο δύο φωτεινές πινακίδες αναβοσβήνουν ρυθμικά: η πρώτη ανάβει κάθε ${light1} δευτερόλεπτα και η δεύτερη κάθε ${light2} δευτερόλεπτα. Κάθε πόσα δευτερόλεπτα θα ανάβουν ταυτόχρονα;`,
        tableData: { col1: 'Πινακίδες', col2: 'Συχνότητα', r1: [`Πινακίδα 1: ${light1} δευτ.`, `Πινακίδα 2: ${light2} δευτ.`], r2: ['Υπολογισμός Ε.Κ.Π.', `Ε.Κ.Π.(${light1}, ${light2}) ＝ ${l} δευτερόλεπτα ✅`] },
        optionsRaw: [
          correctStr,
          `${light1 + light2} δευτερόλεπτα`,
          `${l * 2} δευτερόλεπτα`,
          `${light1 * 2} δευτερόλεπτα`
        ],
        correctText: correctStr,
        explanation: `Οι πινακίδες ανάβουν ταυτόχρονα σε χρόνο ίσο με το Ε.Κ.Π. των δύο περιόδων: Ε.Κ.Π.(${light1}, ${light2}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_std_3',
    generate: () => {
      const doctorDays = 6;
      const nurseDays = 9;
      const l = lcmTwo(doctorDays, nurseDays);
      const correctStr = `${l} ημέρες`;
      return {
        title: 'ΚΟΙΝΗ ΕΦΗΜΕΡΙΑ ΣΤΟ ΝΟΣΟΚΟΜΕΙΟ',
        instruction: 'Επιλέξτε μετά από πόσες ημέρες θα συμπέσει η εφημερία:',
        text: `Ένας γιατρός έχει εφημερία κάθε ${doctorDays} ημέρες και μια νοσηλεύτρια έχει εφημερία κάθε ${nurseDays} ημέρες. Αν εφημερεύουν μαζί σήμερα, μετά από πόσες ημέρες θα συμπέσει ξανά η εφημερία τους;`,
        tableData: { col1: 'Εφημερίες', col2: 'Συχνότητα', r1: [`Γιατρός: ${doctorDays} ημέρες`, `Νοσηλεύτρια: ${nurseDays} ημέρες`], r2: ['Υπολογισμός Ε.Κ.Π.', `Ε.Κ.Π.(${doctorDays}, ${nurseDays}) ＝ ${l} ημέρες ✅`] },
        optionsRaw: [
          correctStr,
          `${doctorDays + nurseDays} ημέρες`,
          `${l + 6} ημέρες`,
          `${l * 2} ημέρες`
        ],
        correctText: correctStr,
        explanation: `Η κοινή εφημερία θα συμβεί ξανά σε ημέρες που ισούνται με το Ε.Κ.Π. των δύο διαστημάτων: Ε.Κ.Π.(${doctorDays}, ${nurseDays}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_std_4',
    generate: () => {
      const bellA = 45;
      const bellB = 60;
      const l = lcmTwo(bellA, bellB);
      const correctStr = `${l} λεπτά`;
      return {
        title: 'ΣΥΓΧΡΟΝΙΣΜΟΣ ΚΟΥΔΟΥΝΙΩΝ ΣΧΟΛΕΙΟΥ',
        instruction: 'Επιλέξτε μετά από πόσα λεπτά θα χτυπήσουν μαζί:',
        text: `Σε δύο γειτονικά σχολεία τα κουδούνια χτυπούν ανά ${bellA} λεπτά και ${bellB} λεπτά αντίστοιχα. Αν χτύπησαν ταυτόχρονα το πρωί, μετά από πόσα λεπτά θα ξαναχτυπήσουν μαζί;`,
        tableData: { col1: 'Κουδούνια', col2: 'Περίοδος', r1: [`Σχολείο Α: ${bellA} λ.`, `Σχολείο Β: ${bellB} λ.`], r2: ['Ε.Κ.Π.', `Ε.Κ.Π.(${bellA}, ${bellB}) ＝ ${l} λ. ✅`] },
        optionsRaw: [
          correctStr,
          `${bellA + bellB} λεπτά`,
          `${l * 2} λεπτά`,
          `${l - 30} λεπτά`
        ],
        correctText: correctStr,
        explanation: `Τα κουδούνια χτυπούν ξανά ταυτόχρονα στο Ε.Κ.Π.(${bellA}, ${bellB}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_std_5',
    generate: () => {
      const cycle1 = 8;
      const cycle2 = 12;
      const l = lcmTwo(cycle1, cycle2);
      const correctStr = `${l} λεπτά`;
      return {
        title: 'ΓΥΡΟΙ ΣΤΗΝ ΠΙΣΤΑ ΑΓΩΝΩΝ',
        instruction: 'Επιλέξτε μετά από πόσο χρόνο θα συναντηθούν στην αφετηρία:',
        text: `Δύο καρτ κινούνται σε κυκλική πίστα. Το πρώτο ολοκληρώνει έναν γύρο σε ${cycle1} λεπτά και το δεύτερο σε ${cycle2} λεπτά. Αν ξεκινήσουν μαζί, μετά από πόσα λεπτά θα περάσουν ξανά ταυτόχρονα από την αφετηρία;`,
        tableData: { col1: 'Καρτ', col2: 'Χρόνος Γύρου', r1: [`1ο Καρτ: ${cycle1} λ.`, `2ο Καρτ: ${cycle2} λ.`], r2: ['Ε.Κ.Π.', `Ε.Κ.Π.(${cycle1}, ${cycle2}) ＝ ${l} λ. ✅`] },
        optionsRaw: [
          correctStr,
          `${cycle1 + cycle2} λεπτά`,
          `${l * 2} λεπτά`,
          `${l + 4} λεπτά`
        ],
        correctText: correctStr,
        explanation: `Θα συναντηθούν ξανά στην αφετηρία σε χρόνο ίσο με το Ε.Κ.Π.(${cycle1}, ${cycle2}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_std_6',
    generate: () => {
      const waterA = 4;
      const waterB = 6;
      const l = lcmTwo(waterA, waterB);
      const correctStr = `${l} ημέρες`;
      return {
        title: 'ΠΟΤΙΣΜΑ ΦΥΤΩΝ',
        instruction: 'Επιλέξτε κάθε πόσες ημέρες ποτίζονται ταυτόχρονα:',
        text: `Σε έναν κήπο τα τριαντάφυλλα ποτίζονται κάθε ${waterA} ημέρες και οι ορτανσίες κάθε ${waterB} ημέρες. Κάθε πόσες ημέρες ποτίζονται και τα δύο φυτά την ίδια ημέρα;`,
        tableData: { col1: 'Φυτά', col2: 'Συχνότητα', r1: [`Τριαντάφυλλα: ${waterA} ημέρες`, `Ορτανσίες: ${waterB} ημέρες`], r2: ['Ε.Κ.Π.', `Ε.Κ.Π.(${waterA}, ${waterB}) ＝ ${l} ημέρες ✅`] },
        optionsRaw: [
          correctStr,
          `${waterA + waterB} ημέρες`,
          `${l * 2} ημέρες`,
          `${l + 2} ημέρες`
        ],
        correctText: correctStr,
        explanation: `Ποτίζονται ταυτόχρονα σε διάστημα ίσο με το Ε.Κ.Π.(${waterA}, ${waterB}) ＝ ${correctStr}.`
      };
    }
  }
];

// Διευρυμένη δεξαμενή προβλημάτων για την Ερώτηση 10 (MCQ)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_ekp_hard_1',
    generate: () => {
      const shipA = 6;
      const shipB = 8;
      const shipC = 12;
      const l = lcmArray([shipA, shipB, shipC]);
      const correctStr = `${l} ημέρες`;
      return {
        title: 'ΣΥΝΑΝΤΗΣΗ ΤΡΙΩΝ ΠΛΟΙΩΝ ΣΤΟ ΛΙΜΑΝΙ',
        instruction: 'Επιλέξτε μετά από πόσες ημέρες θα συμπέσουν και τα τρία πλοία:',
        text: `Τρία πλοία επιστρέφουν στο ίδιο λιμάνι: το πρώτο κάθε ${shipA} ημέρες, το δεύτερο κάθε ${shipB} ημέρες και το τρίτο κάθε ${shipC} ημέρες. Αν αναχώρησαν σήμερα μαζί, μετά από πόσες ημέρες θα ξαναβρεθούν ταυτόχρονα στο λιμάνι;`,
        tableData: { col1: 'Πλοία', col2: 'Διάστημα Επιστροφής', r1: [`A: ${shipA} ημ., B: ${shipB} ημ.`, `Γ: ${shipC} ημ.`], r2: ['Υπολογισμός Ε.Κ.Π.', `Ε.Κ.Π.(${shipA}, ${shipB}, ${shipC}) ＝ ${l} ημέρες ✅`] },
        optionsRaw: [
          correctStr,
          `${l * 2} ημέρες`,
          `${shipA + shipB + shipC} ημέρες`,
          `${l - 6} ημέρες`
        ],
        correctText: correctStr,
        explanation: `Υπολογίζουμε το Ε.Κ.Π. των τριών αριθμών: Ε.Κ.Π.(${shipA}, ${shipB}, ${shipC}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_hard_2',
    generate: () => {
      const runnerA = 3;
      const runnerB = 4;
      const runnerC = 5;
      const l = lcmArray([runnerA, runnerB, runnerC]);
      const correctStr = `${l} λεπτά`;
      return {
        title: 'ΣΥΝΑΝΤΗΣΗ ΤΡΙΩΝ ΔΡΟΜΕΩΝ ΣΤΗΝ ΑΦΕΤΗΡΙΑ',
        instruction: 'Επιλέξτε μετά από πόσα λεπτά θα συναντηθούν ξανά στην αφετηρία:',
        text: `Τρεις δρομείς τρέχουν σε κυκλικό στίβο και κάνουν έναν γύρο σε ${runnerA}, ${runnerB} και ${runnerC} λεπτά αντίστοιχα. Αν ξεκινήσουν ταυτόχρονα, μετά από πόσα λεπτά θα ξαναβρεθούν όλοι μαζί στην αφετηρία;`,
        tableData: { col1: 'Δρομείς', col2: 'Χρόνοι Γύρου', r1: [`${runnerA} λ., ${runnerB} λ.`, `${runnerC} λ.`], r2: ['Ε.Κ.Π.', `Ε.Κ.Π.(${runnerA}, ${runnerB}, ${runnerC}) ＝ ${l} λεπτά ✅`] },
        optionsRaw: [
          correctStr,
          `${l * 2} λεπτά`,
          `${runnerA * runnerB} λεπτά`,
          `${l - 15} λεπτά`
        ],
        correctText: correctStr,
        explanation: `Επειδή οι αριθμοί είναι πρώτοι μεταξύ τους ανά ζεύγη: Ε.Κ.Π.(${runnerA}, ${runnerB}, ${runnerC}) ＝ ${runnerA} · ${runnerB} · ${runnerC} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_hard_3',
    generate: () => {
      const packSpoons = 10;
      const packForks = 12;
      const l = lcmTwo(packSpoons, packForks);
      const correctStr = `${l} τεμάχια`;
      return {
        title: 'ΑΓΟΡΑ ΣΕΤ ΜΑΧΑΙΡΟΠΙΡΟΥΝΩΝ',
        instruction: 'Επιλέξτε τον ελάχιστο ίσο αριθμό κουταλιών και πιρουνιών:',
        text: `Ένα κατάστημα πουλάει κουτάλια σε πακέτα των ${packSpoons} και πιρούνια σε πακέτα των ${packForks}. Ποιο είναι το ελάχιστο πλήθος που πρέπει να αγοράσουμε από το καθένα ώστε να έχουμε ίσο αριθμό κουταλιών και πιρουνιών;`,
        tableData: { col1: 'Συσκευασίες', col2: 'Ε.Κ.Π.', r1: [`Κουτάλια: ${packSpoons}`, `Πιρούνια: ${packForks}`], r2: ['Ελάχιστη Ίση Ποσότητα', `${correctStr} ✅`] },
        optionsRaw: [
          correctStr,
          `${packSpoons * packForks} τεμάχια`,
          `${l * 2} τεμάχια`,
          `${packSpoons + packForks} τεμάχια`
        ],
        correctText: correctStr,
        explanation: `Αναζητούμε το Ε.Κ.Π. των συσκευασιών: Ε.Κ.Π.(${packSpoons}, ${packForks}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_hard_4',
    generate: () => {
      const trainA = 20;
      const trainB = 30;
      const l = lcmTwo(trainA, trainB);
      const correctStr = `${l} λεπτά`;
      return {
        title: 'ΔΡΟΜΟΛΟΓΙΑ ΤΡΕΝΩΝ',
        instruction: 'Επιλέξτε μετά από πόσο χρόνο θα αναχωρήσουν ξανά ταυτόχρονα:',
        text: `Δύο τρένα αναχωρούν από τον κεντρικό σταθμό ανά ${trainA} λεπτά και ${trainB} λεπτά αντίστοιχα. Αν αναχώρησαν μαζί στις 09:00, μετά από πόσα λεπτά θα αναχωρήσουν πάλι μαζί;`,
        tableData: { col1: 'Τρένα', col2: 'Συχνότητα', r1: [`Τρένο 1: ${trainA} λ.`, `Τρένο 2: ${trainB} λ.`], r2: ['Ε.Κ.Π.', `Ε.Κ.Π.(${trainA}, ${trainB}) ＝ ${l} λεπτά ✅`] },
        optionsRaw: [
          correctStr,
          `${trainA + trainB} λεπτά`,
          `${l * 2} λεπτά`,
          `${trainA * 2} λεπτά`
        ],
        correctText: correctStr,
        explanation: `Υπολογίζουμε: Ε.Κ.Π.(${trainA}, ${trainB}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_hard_5',
    generate: () => {
      const alarmA = 12;
      const alarmB = 16;
      const l = lcmTwo(alarmA, alarmB);
      const correctStr = `${l} δευτερόλεπτα`;
      return {
        title: 'ΗΧΗΤΙΚΑ ΣΗΜΑΤΑ ΣΥΝΑΓΕΡΜΟΥ',
        instruction: 'Επιλέξτε κάθε πόσα δευτερόλεπτα ηχούν ταυτόχρονα:',
        text: `Δύο συσκευές συναγερμού εκπέμπουν ηχητικό σήμα ανά ${alarmA} δευτερόλεπτα και ${alarmB} δευτερόλεπτα αντίστοιχα. Κάθε πόσα δευτερόλεπτα ηχούν ταυτόχρονα;`,
        tableData: { col1: 'Συσκευές', col2: 'Περίοδος', r1: [`Συσκευή 1: ${alarmA} δευτ.`, `Συσκευή 2: ${alarmB} δευτ.`], r2: ['Ε.Κ.Π.', `Ε.Κ.Π.(${alarmA}, ${alarmB}) ＝ ${l} δευτερόλεπτα ✅`] },
        optionsRaw: [
          correctStr,
          `${alarmA + alarmB} δευτερόλεπτα`,
          `${l * 2} δευτερόλεπτα`,
          `${alarmA * 2} δευτερόλεπτα`
        ],
        correctText: correctStr,
        explanation: `Υπολογίζουμε: Ε.Κ.Π.(${alarmA}, ${alarmB}) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_ekp_hard_6',
    generate: () => {
      const lessonA = 4;
      const lessonB = 5;
      const l = lcmTwo(lessonA, lessonB);
      const correctStr = `${l} ημέρες`;
      return {
        title: 'ΣΥΜΠΤΩΣΗ ΕΞΩΣΧΟΛΙΚΩΝ ΔΡΑΣΤΗΡΙΟΤΗΤΩΝ',
        instruction: 'Επιλέξτε μετά από πόσες ημέρες συμπίπτουν ξανά:',
        text: `Ο Γιάννης έχει μάθημα κιθάρας κάθε ${lessonA} ημέρες και μάθημα σκακιού κάθε ${lessonB} ημέρες. Αν σήμερα είχε και τα δύο μαθήματα, μετά από πόσες ημέρες θα έχει ξανά και τα δύο την ίδια ημέρα;`,
        tableData: { col1: 'Μαθήματα', col2: 'Συχνότητα', r1: [`Κιθάρα: ${lessonA} ημέρες`, `Σκάκι: ${lessonB} ημέρες`], r2: ['Ε.Κ.Π.', `Ε.Κ.Π.(${lessonA}, ${lessonB}) ＝ ${l} ημέρες ✅`] },
        optionsRaw: [
          correctStr,
          `${lessonA + lessonB} ημέρες`,
          `${l * 2} ημέρες`,
          `${lessonA * 3} ημέρες`
        ],
        correctText: correctStr,
        explanation: `Επειδή το 4 και το 5 είναι πρώτοι μεταξύ τους: Ε.Κ.Π.(4, 5) ＝ 4 · 5 ＝ ${correctStr}.`
      };
    }
  }
];

// Δημιουργία των 10 δυναμικών ερωτήσεων
function generateQuestions() {
  const qList = [];

  // Q1 (MCQ): Ε.Κ.Π. δύο απλών αριθμών (Εγγύηση ακριβώς 4 μοναδικών επιλογών)
  {
    const q1Pairs = [
      [4, 6], [6, 8], [3, 5], [6, 9], [8, 12], [5, 10], [4, 10], [9, 12]
    ];
    const q1Chosen = q1Pairs[randInt(0, q1Pairs.length - 1)];
    const q1CorrectVal = lcmArray(q1Chosen);
    const q1Correct = String(q1CorrectVal);

    // Δημιουργία δεξαμενής πιθανών λαθών που διαφέρουν από τη σωστή απάντηση
    const candidateWrongs = [
      q1CorrectVal * 2,
      q1CorrectVal * 3,
      q1Chosen[0] * q1Chosen[1],
      Math.max(...q1Chosen) + 2,
      Math.max(...q1Chosen),
      q1CorrectVal - Math.min(...q1Chosen)
    ]
      .filter((v) => v > 0 && v !== q1CorrectVal)
      .map(String);

    const uniqueWrongs = [...new Set(candidateWrongs)];
    const selectedWrongs = shuffle(uniqueWrongs).slice(0, 3);

    const options = shuffle([q1Correct, ...selectedWrongs]).map((text) => ({
      text,
      isCorrect: text === q1Correct
    }));

    qList.push({
      id: 1,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 1 • Ε.Κ.Π. ΔΥΟ ΑΡΙΘΜΩΝ',
      instruction: 'Επιλέξτε το Ελάχιστο Κοινό Πολλαπλάσιο:',
      prompt: `Ποιο είναι το Ε.Κ.Π. των αριθμών ${q1Chosen[0]} και ${q1Chosen[1]};`,
      options,
      correctText: q1Correct,
      explanation: `Π(${q1Chosen[0]}): ${q1Chosen[0]}, ${q1Chosen[0] * 2}, ${q1Chosen[0] * 3}... και Π(${q1Chosen[1]}): ${q1Chosen[1]}, ${q1Chosen[1] * 2}... Το μικρότερο κοινό θετικό πολλαπλάσιο είναι το ${q1Correct}.`
    });
  }

  // Q2 (Input): Ε.Κ.Π. δύο πρώτων μεταξύ τους αριθμών
  {
    const q2Pairs = [
      [3, 4], [5, 7], [4, 9], [7, 8], [5, 9], [3, 8], [5, 6]
    ];
    const q2Chosen = q2Pairs[randInt(0, q2Pairs.length - 1)];
    const q2CorrectVal = q2Chosen[0] * q2Chosen[1];

    qList.push({
      id: 2,
      type: 'integer_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ',
      instruction: 'Συμπληρώστε το Ε.Κ.Π. των αριθμών (ακέραιος):',
      prompt: `Ποιο είναι το Ε.Κ.Π. των αριθμών ${q2Chosen[0]} και ${q2Chosen[1]};`,
      correctVal: q2CorrectVal,
      correctStr: String(q2CorrectVal),
      explanation: `Επειδή οι αριθμοί ${q2Chosen[0]} και ${q2Chosen[1]} δεν έχουν κοινό διαιρέτη εκτός του 1 (είναι πρώτοι μεταξύ τους), το Ε.Κ.Π. τους ισούται με το γινόμενό τους: ${q2Chosen[0]} · ${q2Chosen[1]} ＝ ${q2CorrectVal}.`
    });
  }

  // Q3 (MCQ): Ε.Κ.Π. τριών αριθμών
  {
    const q3Triplets = [
      { nums: [2, 3, 4], val: 12 },
      { nums: [3, 4, 6], val: 12 },
      { nums: [4, 6, 8], val: 24 },
      { nums: [6, 8, 12], val: 24 },
      { nums: [4, 5, 10], val: 20 },
      { nums: [3, 5, 15], val: 15 },
      { nums: [6, 10, 15], val: 30 }
    ];
    const q3Chosen = q3Triplets[randInt(0, q3Triplets.length - 1)];
    const q3CorrectStr = String(q3Chosen.val);

    const rawOptions = [
      q3CorrectStr,
      String(q3Chosen.val * 2),
      String(q3Chosen.nums[0] * q3Chosen.nums[1] * q3Chosen.nums[2]),
      String(q3Chosen.val + 6)
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q3CorrectStr
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • Ε.Κ.Π. ΤΡΙΩΝ ΑΡΙΘΜΩΝ',
      instruction: 'Επιλέξτε το σωστό Ε.Κ.Π.:',
      prompt: `Ποιο είναι το Ε.Κ.Π. των αριθμών (${q3Chosen.nums.join(', ')});`,
      options,
      correctText: q3CorrectStr,
      explanation: `Ο αριθμός ${q3CorrectStr} είναι ο μικρότερος θετικός αριθμός που διαιρείται ακριβώς με το ${q3Chosen.nums[0]}, το ${q3Chosen.nums[1]} και το ${q3Chosen.nums[2]}.`
    });
  }

  // Q4 (MCQ): Εύρεση του 2ου κοινού πολλαπλασίου (2 · ΕΚΠ)
  {
    const q4Pairs = [
      { nums: [4, 6], ekp: 12, second: 24 },
      { nums: [6, 8], ekp: 24, second: 48 },
      { nums: [5, 6], ekp: 30, second: 60 },
      { nums: [8, 12], ekp: 24, second: 48 },
      { nums: [10, 15], ekp: 30, second: 60 }
    ];
    const q4Chosen = q4Pairs[randInt(0, q4Pairs.length - 1)];

    const rawOptions = [
      String(q4Chosen.second),
      String(q4Chosen.ekp),
      String(q4Chosen.ekp * 3),
      String(q4Chosen.second + 10)
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === String(q4Chosen.second)
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΕΠΟΜΕΝΟ ΚΟΙΝΟ ΠΟΛΛΑΠΛΑΣΙΟ',
      instruction: 'Επιλέξτε το 2ο κοινό πολλαπλάσιο:',
      prompt: `Το Ε.Κ.Π. των αριθμών ${q4Chosen.nums[0]} και ${q4Chosen.nums[1]} είναι το ${q4Chosen.ekp}. Ποιο είναι το αμέσως επόμενο (2ο) κοινό πολλαπλάσιό τους;`,
      options,
      correctText: String(q4Chosen.second),
      explanation: `Τα κοινά πολλαπλάσια είναι τα πολλαπλάσια του Ε.Κ.Π.: 1ο ＝ ${q4Chosen.ekp}, 2ο ＝ ${q4Chosen.ekp} · 2 ＝ ${q4Chosen.second}.`
    });
  }

  // Q5 (MCQ): True / False - Περίπτωση όπου ένας αριθμός είναι πολλαπλάσιο του άλλου
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Αν ένας αριθμός διαιρείται ακριβώς με έναν άλλον (π.χ. 12 και 4), τότε το Ε.Κ.Π. τους είναι ο μεγαλύτερος αριθμός (το 12).'
      : 'Αν ένας αριθμός διαιρείται ακριβώς με έναν άλλον (π.χ. 12 και 4), τότε το Ε.Κ.Π. τους είναι πάντα το γινόμενό τους (48).';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΕΙΔΙΚΗ ΠΕΡΙΠΤΩΣΗ ΔΙΑΙΡΕΤΟΤΗΤΑΣ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Όταν ένας αριθμός είναι πολλαπλάσιο ενός άλλου, το Ε.Κ.Π. τους είναι πάντοτε ο μεγαλύτερος αριθμός.'
        : 'Λάθος! Όταν ένας αριθμός διαιρείται από τον άλλον, το Ε.Κ.Π. είναι ο μεγαλύτερος αριθμός, όχι το γινόμενό τους.'
    });
  }

  // Q6 (MCQ): True / False - Σχέση ΕΚΠ με το 0
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Το Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.) είναι πάντα ένας θετικός αριθμός (δεν παίρνουμε ποτέ ως Ε.Κ.Π. το 0).'
      : 'Το Ε.Κ.Π. οποιωνδήποτε φυσικών αριθμών είναι πάντα το 0, επειδή το 0 είναι κοινό πολλαπλάσιο όλων.';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΤΟ 0 ΚΑΙ ΤΟ Ε.Κ.Π.',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Εξ ορισμού το Ε.Κ.Π. είναι το μικρότερο κοινό θετικό πολλαπλάσιο (διάφορο του μηδενός).'
        : 'Λάθος! Το 0 εξαιρείται από τον ορισμό του Ε.Κ.Π., διαφορετικά το Ε.Κ.Π. κάθε ομάδας αριθμών θα ήταν πάντα 0.'
    });
  }

  // Q7 (Input): Ε.Κ.Π. τεσσάρων αριθμών
  {
    const q7Quads = [
      { nums: [2, 3, 4, 6], val: 12 },
      { nums: [2, 4, 6, 8], val: 24 },
      { nums: [3, 4, 6, 12], val: 12 },
      { nums: [2, 5, 10, 20], val: 20 },
      { nums: [3, 5, 6, 10], val: 30 }
    ];
    const q7Chosen = q7Quads[randInt(0, q7Quads.length - 1)];

    qList.push({
      id: 7,
      type: 'integer_input',
      title: 'ΕΡΩΤΗΣΗ 7 • Ε.Κ.Π. ΤΕΣΣΑΡΩΝ ΑΡΙΘΜΩΝ',
      instruction: 'Υπολογίστε το Ε.Κ.Π. (ακέραιος):',
      prompt: `Ποιο είναι το Ε.Κ.Π. των 4 αριθμών (${q7Chosen.nums.join(', ')});`,
      correctVal: q7Chosen.val,
      correctStr: String(q7Chosen.val),
      explanation: `Ε.Κ.Π.(${q7Chosen.nums.join(', ')}) ＝ ${q7Chosen.val}.`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας
  {
    const q8Scenarios = [
      {
        itemA: 'Το πλοίο Α αναχωρεί κάθε 6 ώρες',
        itemB: 'το πλοίο Β κάθε 8 ώρες',
        q: 'Αν αναχωρήσουν ταυτόχρονα, μετά από πόσες ώρες θα αναχωρήσουν ξανά μαζί;',
        val: 24,
        unit: 'ώρες',
        wrong: [14, 48, 16]
      },
      {
        itemA: 'Ένα φανάρι ανάβει πράσινο κάθε 12 δευτερόλεπτα',
        itemB: 'ένα άλλο κάθε 15 δευτερόλεπτα',
        q: 'Κάθε πόσα δευτερόλεπτα θα ανάβουν πράσινο ταυτόχρονα;',
        val: 60,
        unit: 'δευτερόλεπτα',
        wrong: [27, 30, 180]
      },
      {
        itemA: 'Ο Νίκος επισκέπτεται τη γιαγιά του κάθε 4 ημέρες',
        itemB: 'η Ελένη κάθε 6 ημέρες',
        q: 'Αν συναντήθηκαν σήμερα, μετά από πόσες ημέρες θα ξανασυναντηθούν;',
        val: 12,
        unit: 'ημέρες',
        wrong: [10, 24, 18]
      }
    ];
    const q8Chosen = q8Scenarios[randInt(0, q8Scenarios.length - 1)];
    const q8CorrectStr = `${q8Chosen.val} ${q8Chosen.unit}`;

    const rawOptions = [
      q8CorrectStr,
      ...q8Chosen.wrong.map((w) => `${w} ${q8Chosen.unit}`)
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8CorrectStr
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: 'Επιλέξτε τη σωστή χρονική στιγμή συνάντησης:',
      prompt: `${q8Chosen.itemA} και ${q8Chosen.itemB}. ${q8Chosen.q}`,
      options,
      correctText: q8CorrectStr,
      explanation: `Βρίσκουμε το Ε.Κ.Π. των δύο χρόνων: Ε.Κ.Π. ＝ ${q8CorrectStr}.`
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate();
    const hardProb = shuffledHard[0].generate();

    // Q9 (MCQ)
    const optionsQ9 = shuffle([...new Set(stdProb.optionsRaw)]).map((text) => ({
      text,
      isCorrect: text === stdProb.correctText
    }));

    qList.push({
      id: 9,
      type: 'mcq',
      title: `ΕΡΩΤΗΣΗ 9 • ${stdProb.title}`,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      options: optionsQ9,
      correctText: stdProb.correctText,
      explanation: stdProb.explanation
    });

    // Q10 (MCQ)
    const optionsQ10 = shuffle([...new Set(hardProb.optionsRaw)]).map((text) => ({
      text,
      isCorrect: text === hardProb.correctText
    }));

    qList.push({
      id: 10,
      type: 'mcq',
      title: `ΕΡΩΤΗΣΗ 10 • ${hardProb.title}`,
      instruction: hardProb.instruction,
      prompt: hardProb.text,
      tableData: hardProb.tableData,
      options: optionsQ10,
      correctText: hardProb.correctText,
      explanation: hardProb.explanation
    });
  }

  return qList;
}

export default function EkpExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργία νέων ασκήσεων
  const loadNewSet = useCallback(() => {
    const q = generateQuestions();
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμός Input μόνο για ακέραιους αριθμούς (0-9)
  const handleInputChange = (qId, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/[^0-9]/g, '');
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: sanitized
    }));
  };

  // Χειρισμός MCQ
  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  const isQuestionCorrect = (q) => {
    if (q.type === 'mcq') {
      return answers[`q_${q.id}`] === q.correctText;
    }
    if (q.type === 'integer_input') {
      const userValStr = (answers[`q_${q.id}`] || '').trim();
      const userVal = parseInt(userValStr, 10);
      return !isNaN(userVal) && userVal === q.correctVal;
    }
    return false;
  };

  // Έλεγχος Απαντήσεων
  const handleCheckAnswers = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitted) return;

    let currentScore = 0;
    questions.forEach((q) => {
      if (isQuestionCorrect(q)) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== null && String(val).trim() !== '').length;

  return (
    <Layout
      title="Ασκήσεις: Ε.Κ.Π. - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στο Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.) για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/19-ekp"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 {toCleanUppercase('Θεωρία')}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 19 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ασκήσεις &amp; Προβλήματα: Ε.Κ.Π.
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 δυναμικές δραστηριότητες υπολογισμού Ε.Κ.Π. για 2, 3 ή 4 αριθμούς, πρώτων μεταξύ τους αριθμών και ρεαλιστικά προβλήματα καθημερινής ζωής.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation"
            >
              <span>🔄 {toCleanUppercase('Νέες Ασκήσεις')}</span>
            </button>
          </div>
        </section>

        {/* Λίστα 10 Ασκήσεων */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q) => {
            const isCorrect = isSubmitted && isQuestionCorrect(q);

            return (
              <article
                key={`q-${q.id}`}
                className={`bg-white rounded-3xl border p-5 sm:p-8 2xl:p-10 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλίδα Ερώτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {toCleanUppercase(q.title)}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs 2xl:text-sm font-bold px-3 py-1 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? `✓ ${toCleanUppercase('Σωστό')}` : `✗ ${toCleanUppercase('Λάθος')}`}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση */}
                <div className="space-y-3 mb-5">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>
                </div>

                {/* Περιοχή Απάντησης */}
                <div className="py-2">
                  {/* Integer Input */}
                  {q.type === 'integer_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck="false"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500 font-medium">
                        (Ακέραιος αριθμός)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 min-h-[48px] ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-300'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1">
                              {opt.text}
                            </span>
                            <span
                              className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-xs ${
                                isSelected
                                  ? 'border-white bg-white text-blue-600 font-bold'
                                  : 'border-slate-400 bg-transparent'
                              }`}
                            >
                              {isSelected ? '●' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Feedback μετά την υποβολή */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-2.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? '🎉 Εξαιρετικά!' : '💡 Μαθηματική Επεξήγηση:'}</span>
                    </div>

                    {/* Οργανωτικός Πίνακας Δεδομένων στην Επεξήγηση */}
                    {q.tableData && (
                      <div className="inline-block max-w-full bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-inner my-1 font-mono text-xs sm:text-sm">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                          <span className="bg-blue-100/70 px-2 py-0.5 rounded-lg text-blue-900 break-words">{q.tableData.col1}</span>
                          <span className="bg-emerald-100/70 px-2 py-0.5 rounded-lg text-emerald-900 break-words">{q.tableData.col2}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                          <span>{q.tableData.r1[0]}</span>
                          <span className="text-indigo-700 font-bold">{q.tableData.r1[1]}</span>
                          <span>{q.tableData.r2[0]}</span>
                          <span className="text-amber-600 font-black">{q.tableData.r2[1]}</span>
                        </div>
                      </div>
                    )}

                    <div>{q.explanation}</div>
                    
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800">
                        Σωστή απάντηση:{' '}
                        <span className="font-mono font-bold text-blue-900">
                          {q.correctStr || q.correctText}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Κουμπί Ελέγχου στο τέλος της φόρμας */}
        {!isSubmitted && (
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={handleCheckAnswers}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
            >
              <span>🎯 {toCleanUppercase('Έλεγχος Απαντήσεων')}</span>
            </button>
          </div>
        )}

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                {isSubmitted ? toCleanUppercase('Σκορ') : toCleanUppercase('Απαντήθηκαν')}
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {isSubmitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-8">
                <span className="text-xs text-slate-400 font-semibold block">
                  {toCleanUppercase('Ποσοστό')}
                </span>
                <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
                  {Math.round((score / 10) * 100)} %
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                {toCleanUppercase('Έλεγχος')}
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                <span>🔄 {toCleanUppercase('Νέες Ασκήσεις')}</span>
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}

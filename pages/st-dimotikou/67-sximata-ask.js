// pages/st-dimotikou/67-sximata-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// -------------------------------------------------------------
// DEFENSIVE UTILITY FUNCTIONS
// -------------------------------------------------------------

function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatNum(val) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString('el-GR');
}

// Διασφάλιση ακριβώς 4 μοναδικών επιλογών για ερωτήσεις MCQ
function ensureFourUniqueOptions(correctText, distractorsGen) {
  const optionsSet = new Set([String(correctText).trim()]);
  const candidates = distractorsGen();

  for (const c of candidates) {
    if (optionsSet.size >= 4) break;
    if (c !== undefined && c !== null && String(c).trim() !== '') {
      optionsSet.add(String(c).trim());
    }
  }

  let counter = 1;
  while (optionsSet.size < 4) {
    optionsSet.add(`${correctText} (${counter})`);
    counter++;
  }

  return shuffle([...optionsSet]);
}

// -------------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (POOLS) ΓΙΑ Q9 & Q10
// -------------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  // 1. Περίμετρος κανονικού οκταγώνου
  () => {
    const side = randInt(4, 15);
    const ansVal = 8 * side;
    const unit = 'cm';
    const correct = `${ansVal} ${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `${ansVal + 8} ${unit}`,
      `${ansVal - 8} ${unit}`,
      `${6 * side} ${unit}`,
      `${7 * side} ${unit}`,
      `${ansVal + 16} ${unit}`
    ]);
    return {
      title: 'ΠΕΡΙΜΕΤΡΟΣ ΚΑΝΟΝΙΚΟΥ ΟΚΤΑΓΩΝΟΥ',
      prompt: `Μια διακοσμητική πινακίδα έχει σχήμα κανονικού οκταγώνου με μήκος κάθε πλευράς ${side} ${unit}. Πόση είναι η συνολική περίμετρος της πινακίδας;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Σχήμα', value: 'Κανονικό οκτάγωνο (8 ίσες πλευρές)' },
        { label: 'Μήκος πλευράς', value: `${side} ${unit}` },
        { label: 'Πράξη', value: `8 · ${side} ${unit}` },
        { label: 'Περίμετρος', value: `${ansVal} ${unit}` }
      ],
      explanation: `Σε κάθε κανονικό οκτάγωνο όλες οι 8 πλευρές είναι ίσες μεταξύ τους. Υπολογίζουμε την περίμετρο πολλαπλασιάζοντας: 8 · ${side} ＝ ${ansVal} ${unit}.`
    };
  },
  // 2. Πλευρά κανονικού πενταγώνου από περίμετρο
  () => {
    const side = randInt(6, 20);
    const perimeter = 5 * side;
    const unit = 'm';
    const correct = `${side} ${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `${side + 2} ${unit}`,
      `${side - 2} ${unit}`,
      `${side + 5} ${unit}`,
      `${Math.round(perimeter / 4)} ${unit}`,
      `${side + 10} ${unit}`
    ]);
    return {
      title: 'ΠΛΕΥΡΑ ΚΑΝΟΝΙΚΟΥ ΠΕΝΤΑΓΩΝΟΥ',
      prompt: `Ένα παρτέρι σε σχήμα κανονικού πενταγώνου έχει περίμετρο ${perimeter} ${unit}. Ποιο είναι το μήκος κάθε πλευράς του παρτεριού;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Σχήμα', value: 'Κανονικό πεντάγωνο (5 ίσες πλευρές)' },
        { label: 'Περίμετρος', value: `${perimeter} ${unit}` },
        { label: 'Πράξη', value: `${perimeter} : 5` },
        { label: 'Μήκος πλευράς', value: `${side} ${unit}` }
      ],
      explanation: `Επειδή το πεντάγωνο είναι κανονικό, έχει 5 ίσες πλευρές. Διαιρούμε την περίμετρο με το 5: ${perimeter} : 5 ＝ ${side} ${unit}.`
    };
  },
  // 3. Περίφραξη κανονικού εξαγώνου με κόστος
  () => {
    const side = randInt(5, 12);
    const perim = 6 * side;
    const costPerM = randInt(8, 15);
    const totalCost = perim * costPerM;
    const unit = '€';
    const correct = `${totalCost} ${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `${totalCost + costPerM * 2} ${unit}`,
      `${totalCost - costPerM * 2} ${unit}`,
      `${perim * (costPerM + 2)} ${unit}`,
      `${5 * side * costPerM} ${unit}`
    ]);
    return {
      title: 'ΚΟΣΤΟΣ ΠΕΡΙΦΡΑΞΗΣ ΕΞΑΓΩΝΟΥ',
      prompt: `Ένα οικόπεδο έχει σχήμα κανονικού εξαγώνου με πλευρά ${side} m. Θέλουμε να το περιφράξουμε με συρματόπλεγμα που κοστίζει ${costPerM} € το μέτρο. Πόσο θα κοστίσει η περίφραξη;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Μήκος πλευράς', value: `${side} m` },
        { label: 'Περίμετρος εξαγώνου', value: `6 · ${side} ＝ ${perim} m` },
        { label: 'Κόστος ανά μέτρο', value: `${costPerM} €/m` },
        { label: 'Συνολικό κόστος', value: `${perim} · ${costPerM} ＝ ${totalCost} €` }
      ],
      explanation: `Πρώτα υπολογίζουμε την περίμετρο: 6 · ${side} m ＝ ${perim} m. Στη συνέχεια πολλαπλασιάζουμε με το κόστος ανά μέτρο: ${perim} · ${costPerM} € ＝ ${totalCost} €.`
    };
  },
  // 4. Διαγώνιοι από μία κορυφή επταγώνου
  () => {
    const n = 7;
    const diagOne = n - 3;
    const unit = 'διαγώνιοι';
    const correct = `${diagOne} ${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `3 ${unit}`,
      `5 ${unit}`,
      `7 ${unit}`,
      `2 ${unit}`
    ]);
    return {
      title: 'ΔΙΑΓΩΝΙΟΙ ΑΠΟ ΜΙΑ ΚΟΡΥΦΗ',
      prompt: `Πόσες διαγώνιοι μπορούν να χαραχτούν ξεκινώντας από μία μόνο κορυφή ενός επταγώνου;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Πολύγωνο', value: 'Επτάγωνο (ν ＝ 7)' },
        { label: 'Μη επιτρεπόμενες κορυφές', value: '3 (η ίδια και οι 2 γειτονικές)' },
        { label: 'Τύπος', value: 'ν － 3' },
        { label: 'Αποτέλεσμα', value: `7 － 3 ＝ ${diagOne} ${unit}` }
      ],
      explanation: `Από μία κορυφή δεν μπορούμε να φέρουμε διαγώνιο προς την ίδια την κορυφή ούτε προς τις 2 γειτονικές της (καθώς σχηματίζουν πλευρές). Επομένως: ν － 3 ＝ 7 － 3 ＝ 4 διαγώνιοι.`
    };
  },
  // 5. Συνολικές διαγώνιοι εξαγώνου
  () => {
    const n = 6;
    const total = (n * (n - 3)) / 2;
    const unit = 'διαγώνιοι';
    const correct = `${total} ${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `6 ${unit}`,
      `12 ${unit}`,
      `18 ${unit}`,
      `8 ${unit}`
    ]);
    return {
      title: 'ΣΥΝΟΛΙΚΕΣ ΔΙΑΓΩΝΙΟΙ ΕΞΑΓΩΝΟΥ',
      prompt: `Πόσες διαγωνίους έχει συνολικά ένα εξάγωνο;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Κορυφές (ν)', value: '6' },
        { label: 'Διαγώνιοι από 1 κορυφή', value: '6 － 3 ＝ 3' },
        { label: 'Μαθηματικός τύπος', value: '[ν · (ν － 3)] : 2' },
        { label: 'Υπολογισμός', value: `(6 · 3) : 2 ＝ 18 : 2 ＝ ${total} ${unit}` }
      ],
      explanation: `Εφαρμόζουμε τον τύπο υπολογισμού όλων των διαγωνίων: [ν · (ν － 3)] : 2 ＝ [6 · (6 － 3)] : 2 ＝ (6 · 3) : 2 ＝ 18 : 2 ＝ 9 διαγώνιοι.`
    };
  },
  // 6. Περίμετρος ισόπλευρου τριγώνου
  () => {
    const side = randInt(7, 25);
    const perim = 3 * side;
    const unit = 'cm';
    const correct = `${perim} ${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `${perim + 3} ${unit}`,
      `${perim - 3} ${unit}`,
      `${4 * side} ${unit}`,
      `${2 * side} ${unit}`
    ]);
    return {
      title: 'ΠΕΡΙΜΕΤΡΟΣ ΙΣΟΠΛΕΥΡΟΥ ΤΡΙΓΩΝΟΥ',
      prompt: `Ένα ισόπλευρο τρίγωνο έχει μήκος πλευράς ${side} ${unit}. Πόση είναι η περίμετρός του;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Σχήμα', value: 'Ισόπλευρο τρίγωνο (3 ίσες πλευρές)' },
        { label: 'Μήκος πλευράς', value: `${side} ${unit}` },
        { label: 'Πράξη', value: `3 · ${side}` },
        { label: 'Περίμετρος', value: `${perim} ${unit}` }
      ],
      explanation: `Το ισόπλευρο τρίγωνο είναι κανονικό πολύγωνο με 3 ίσες πλευρές. Άρα: Περίμετρος ＝ 3 · ${side} ${unit} ＝ ${perim} ${unit}.`
    };
  }
];

const HARD_PROBLEMS_POOL = [
  // 1. Συνολικές διαγώνιοι δεκαγώνου
  () => {
    const n = 10;
    const total = (n * (n - 3)) / 2;
    const unit = 'διαγώνιοι';
    const correct = `${total} ${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `70 ${unit}`,
      `30 ${unit}`,
      `25 ${unit}`,
      `40 ${unit}`
    ]);
    return {
      title: 'ΔΙΑΓΩΝΙΟΙ ΔΕΚΑΓΩΝΟΥ',
      prompt: `Σε μια άσκηση γεωμετρίας μελετάμε ένα δεκάγωνο (10 πλευρές και 10 κορυφές). Πόσες διαγωνίους έχει συνολικά το σχήμα αυτό;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Κορυφές πολυγώνου (ν)', value: '10' },
        { label: 'Διαγώνιοι ανά κορυφή', value: '10 － 3 ＝ 7' },
        { label: 'Τύπος συνόλου διαγωνίων', value: '[ν · (ν － 3)] : 2' },
        { label: 'Υπολογισμός', value: `(10 · 7) : 2 ＝ 70 : 2 ＝ ${total} ${unit}` }
      ],
      explanation: `Εφαρμόζουμε τον τύπο: [ν · (ν － 3)] : 2. Για ν ＝ 10 έχουμε: [10 · (10 － 3)] : 2 ＝ (10 · 7) : 2 ＝ 70 : 2 ＝ 35 διαγώνιοι.`
    };
  },
  // 2. Σύγκριση περιμέτρων κανονικού τετραπλεύρου και κανονικού οκταγώνου
  () => {
    const sideSquare = randInt(10, 16);
    const perimSquare = 4 * sideSquare;
    const sideOct = randInt(4, 7);
    const perimOct = 8 * sideOct;
    const diff = Math.abs(perimSquare - perimOct);
    const unit = 'cm';
    const correct = `${diff} ${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `${diff + 4} ${unit}`,
      `${diff + 8} ${unit}`,
      `${diff + 2} ${unit}`,
      `${perimSquare} ${unit}`
    ]);
    return {
      title: 'ΣΥΓΚΡΙΣΗ ΠΕΡΙΜΕΤΡΩΝ ΠΟΛΥΓΩΝΩΝ',
      prompt: `Ένα τετράγωνο έχει πλευρά ${sideSquare} ${unit} και ένα κανονικό οκτάγωνο έχει πλευρά ${sideOct} ${unit}. Πόσο διαφέρουν οι περίμετροι των δύο σχημάτων;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Περίμετρος τετραγώνου', value: `4 · ${sideSquare} ＝ ${perimSquare} ${unit}` },
        { label: 'Περίμετρος οκταγώνου', value: `8 · ${sideOct} ＝ ${perimOct} ${unit}` },
        { label: 'Διαφορά περιμέτρων', value: `${Math.max(perimSquare, perimOct)} － ${Math.min(perimSquare, perimOct)} ＝ ${diff} ${unit}` }
      ],
      explanation: `Υπολογίζουμε την περίμετρο του τετραγώνου: 4 · ${sideSquare} ＝ ${perimSquare} ${unit}. Υπολογίζουμε την περίμετρο του οκταγώνου: 8 · ${sideOct} ＝ ${perimOct} ${unit}. Αφαιρούμε: ${Math.max(perimSquare, perimOct)} － ${Math.min(perimSquare, perimOct)} ＝ ${diff} ${unit}.`
    };
  },
  // 3. Εύρεση πολυγώνου από το σύνολο διαγωνίων
  () => {
    const unit = 'πλευρές';
    const correct = `8 ${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `6 ${unit}`,
      `7 ${unit}`,
      `10 ${unit}`,
      `12 ${unit}`
    ]);
    return {
      title: 'ΕΥΡΕΣΗ ΠΟΛΥΓΩΝΟΥ ΑΠΟ ΤΙΣ ΔΙΑΓΩΝΙΟΥΣ',
      prompt: `Ένα πολύγωνο έχει συνολικά 20 διαγωνίους. Πόσες πλευρές έχει αυτό το πολύγωνο;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Δεδομένο', value: 'Συνολικές διαγώνιοι ＝ 20' },
        { label: 'Τύπος', value: '[ν · (ν － 3)] : 2 ＝ 20, άρα ν · (ν － 3) ＝ 40' },
        { label: 'Δοκιμή για ν ＝ 8', value: '8 · (8 － 3) ＝ 8 · 5 ＝ 40' },
        { label: 'Αποτέλεσμα', value: 'ν ＝ 8 πλευρές (Οκτάγωνο)' }
      ],
      explanation: `Ψάχνουμε έναν αριθμό ν τέτοιο ώστε [ν · (ν － 3)] : 2 ＝ 20, δηλαδή ν · (ν － 3) ＝ 40. Δοκιμάζοντας ν ＝ 8 βρίσκουμε 8 · 5 ＝ 40. Άρα το σχήμα έχει 8 πλευρές (οκτάγωνο).`
    };
  },
  // 4. Σύνθετο πρόβλημα κόστους φωτισμού κορυφών
  () => {
    const sides = 6;
    const costPerCorner = randInt(25, 45);
    const totalCost = sides * costPerCorner;
    const unit = '€';
    const correct = `${totalCost} ${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `${totalCost + costPerCorner} ${unit}`,
      `${totalCost - costPerCorner} ${unit}`,
      `${totalCost + 50} ${unit}`,
      `${sides * (costPerCorner - 5)} ${unit}`
    ]);
    return {
      title: 'ΚΟΣΤΟΣ ΦΩΤΙΣΜΟΥ ΣΕ ΚΟΡΥΦΕΣ',
      prompt: `Σε μια πλατεία σχήματος κανονικού εξαγώνου, ο δήμος αποφάσισε να τοποθετήσει έναν διακοσμητικό προβολέα σε κάθε κορυφή της. Αν κάθε προβολέας κοστίζει ${costPerCorner} €, ποιο είναι το συνολικό κόστος;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Σχήμα', value: 'Κανονικό εξάγωνο' },
        { label: 'Κορυφές', value: '6 κορυφές' },
        { label: 'Κόστος ανά προβολέα', value: `${costPerCorner} €` },
        { label: 'Συνολικό κόστος', value: `6 · ${costPerCorner} ＝ ${totalCost} €` }
      ],
      explanation: `Το κανονικό εξάγωνο έχει 6 κορυφές. Για 6 προβολείς των ${costPerCorner} € έκαστος, το κόστος είναι 6 · ${costPerCorner} ＝ ${totalCost} €.`
    };
  },
  // 5. Διαγώνιοι δωδεκαγώνου
  () => {
    const n = 12;
    const total = (n * (n - 3)) / 2;
    const unit = 'διαγώνιοι';
    const correct = `${total} ${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `108 ${unit}`,
      `45 ${unit}`,
      `60 ${unit}`,
      `50 ${unit}`
    ]);
    return {
      title: 'ΔΙΑΓΩΝΙΟΙ ΔΩΔΕΚΑΓΩΝΟΥ',
      prompt: `Πόσες συνολικά διαγωνίους έχει ένα δωδεκάγωνο (πολύγωνο με 12 πλευρές και 12 κορυφές);`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Κορυφές (ν)', value: '12' },
        { label: 'Διαγώνιοι ανά κορυφή', value: '12 － 3 ＝ 9' },
        { label: 'Τύπος', value: '[ν · (ν － 3)] : 2' },
        { label: 'Υπολογισμός', value: `(12 · 9) : 2 ＝ 108 : 2 ＝ ${total} ${unit}` }
      ],
      explanation: `Χρησιμοποιούμε τον τύπο: [ν · (ν － 3)] : 2. Για ν ＝ 12: [12 · (12 － 3)] : 2 ＝ (12 · 9) : 2 ＝ 108 : 2 ＝ 54 διαγώνιοι.`
    };
  },
  // 6. Περίμετρος σύνθετου σχήματος από κανονικά πολύγωνα
  () => {
    const side = randInt(4, 9);
    const totalPerim = 8 * side;
    const unit = 'cm';
    const correct = `${totalPerim} ${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `${10 * side} ${unit}`,
      `${9 * side} ${unit}`,
      `${7 * side} ${unit}`,
      `${totalPerim + 4} ${unit}`
    ]);
    return {
      title: 'ΠΕΡΙΜΕΤΡΟΣ ΣΥΝΘΕΤΟΥ ΣΧΗΜΑΤΟΣ',
      prompt: `Ενώνουμε δύο ίσα κανονικά πεντάγωνα κατά μήκος μίας κοινής πλευράς τους. Αν η πλευρά κάθε πενταγώνου είναι ${side} ${unit}, πόση είναι η περίμετρος του νέου σχήματος που προκύπτει;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Αρχικές πλευρές', value: '2 πεντάγωνα · 5 ＝ 10 πλευρές' },
        { label: 'Κοινή εσωτερική πλευρά', value: '2 πλευρές ενώνονται εσωτερικά' },
        { label: 'Εξωτερικές πλευρές περιμέτρου', value: '10 － 2 ＝ 8 πλευρές' },
        { label: 'Υπολογισμός περιμέτρου', value: `8 · ${side} ${unit} ＝ ${totalPerim} ${unit}` }
      ],
      explanation: `Όταν ενώνουμε τα δύο πεντάγωνα σε μία κοινή πλευρά, η πλευρά αυτή παύει να είναι εξωτερική. Το νέο σχήμα έχει 8 εξωτερικές πλευρές: 8 · ${side} ${unit} ＝ ${totalPerim} ${unit}.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 10 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Ορισμός πολυγώνου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΟΡΙΣΜΟΣ ΠΟΛΥΓΩΝΟΥ',
    prompt: isQ1True
      ? 'Ένα πολύγωνο είναι ένα κλειστό επίπεδο γεωμετρικό σχήμα που οριοθετείται αποκλειστικά από ευθύγραμμα τμήματα.'
      : 'Ένας κύκλος είναι κανονικό πολύγωνο επειδή είναι κλειστό γεωμετρικό σχήμα.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Ιδιότητα πολυγώνου', value: 'Κλειστό επίπεδο σχήμα' },
      { label: 'Όρια', value: 'Αποκλειστικά ευθύγραμμα τμήματα' },
      { label: 'Κύκλος', value: 'Καμπύλη γραμμή (όχι πολύγωνο)' }
    ],
    explanation: isQ1True
      ? 'ΣΩΣΤΟ: Τα πολύγωνα ορίζονται αυστηρά ως κλειστά επίπεδα σχήματα των οποίων οι πλευρές είναι ευθύγραμμα τμήματα.'
      : 'ΛΑΘΟΣ: Ο κύκλος δεν αποτελείται από ευθύγραμμα τμήματα αλλά από καμπύλη γραμμή, επομένως δεν είναι πολύγωνο.'
  });

  // Q2: Διαγώνιοι τριγώνου (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΔΙΑΓΩΝΙΟΙ ΤΡΙΓΩΝΟΥ',
    prompt: 'Πόσες διαγωνίους έχει συνολικά ένα τρίγωνο;',
    options: ensureFourUniqueOptions('0 διαγώνιοι', () => [
      '1 διαγώνιος',
      '2 διαγώνιοι',
      '3 διαγώνιοι'
    ]),
    correctAnswer: '0 διαγώνιοι',
    tableData: [
      { label: 'Σχήμα', value: 'Τρίγωνο (ν ＝ 3)' },
      { label: 'Κορυφές', value: 'Όλες οι κορυφές είναι διαδοχικές' },
      { label: 'Τύπος', value: '[3 · (3 － 3)] : 2 ＝ (3 · 0) : 2 ＝ 0' }
    ],
    explanation: 'Το τρίγωνο δεν έχει καμία διαγώνιο (0), διότι όλες οι κορυφές του είναι διαδοχικές μεταξύ τους και δεν υπάρχουν μη διαδοχικές κορυφές.'
  });

  // Q3: Χαρακτηριστικά κανονικού πολυγώνου (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΚΑΝΟΝΙΚΟ ΠΟΛΥΓΩΝΟ',
    prompt: 'Πότε ένα πολύγωνο ονομάζεται κανονικό;',
    options: ensureFourUniqueOptions(
      'Όταν όλες οι πλευρές του είναι ίσες και όλες οι γωνίες του είναι ίσες',
      () => [
        'Όταν έχει μόνο ίσες πλευρές ανεξάρτητα από τις γωνίες του',
        'Όταν έχει μόνο ίσες γωνίες ανεξάρτητα από τις πλευρές του',
        'Όταν έχει περισσότερες από 6 πλευρές'
      ]
    ),
    correctAnswer: 'Όταν όλες οι πλευρές του είναι ίσες και όλες οι γωνίες του είναι ίσες',
    tableData: [
      { label: 'Προϋπόθεση 1', value: 'Ισόπλευρο (όλες οι πλευρές ίσες)' },
      { label: 'Προϋπόθεση 2', value: 'Ισογώνιο (όλες οι γωνίες ίσες)' },
      { label: 'Συμπέρασμα', value: 'Πρέπει να ισχύουν και οι δύο προϋποθέσεις ταυτόχρονα' }
    ],
    explanation: 'Ένα πολύγωνο είναι κανονικό όταν είναι ταυτόχρονα ισόπλευρο και ισογώνιο (π.χ. ισόπλευρο τρίγωνο, τετράγωνο).'
  });

  // Q4: Διαγώνιοι τετραπλεύρου (SVG Οπτικοποίηση - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΔΙΑΓΩΝΙΟΙ ΤΕΤΡΑΠΛΕΥΡΟΥ',
    prompt: 'Πόσες διαγωνίους έχει συνολικά οποιοδήποτε τετράπλευρο;',
    svg: (
      <svg viewBox="0 0 160 120" className="w-40 h-28 mx-auto my-2 drop-shadow-sm select-none">
        <polygon points="20,20 140,20 120,100 30,100" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.5" />
        <circle cx="20" cy="20" r="3.5" fill="#4f46e5" />
        <circle cx="140" cy="20" r="3.5" fill="#4f46e5" />
        <circle cx="120" cy="100" r="3.5" fill="#4f46e5" />
        <circle cx="30" cy="100" r="3.5" fill="#4f46e5" />
      </svg>
    ),
    options: ensureFourUniqueOptions('2 διαγώνιοι', () => [
      '1 διαγώνιος',
      '3 διαγώνιοι',
      '4 διαγώνιοι'
    ]),
    correctAnswer: '2 διαγώνιοι',
    tableData: [
      { label: 'Σχήμα', value: 'Τετράπλευρο (ν ＝ 4)' },
      { label: 'Τύπος', value: '[ν · (ν － 3)] : 2' },
      { label: 'Υπολογισμός', value: '[4 · (4 － 3)] : 2 ＝ (4 · 1) : 2 ＝ 2' }
    ],
    explanation: 'Κάθε τετράπλευρο έχει ακριβώς 2 διαγωνίους, οι οποίες ενώνουν τα δύο ζεύγη απέναντι (μη διαδοχικών) κορυφών.'
  });

  // Q5: Διαγώνιοι από μία κορυφή (Input αριθμού)
  const sidesQ5 = randInt(5, 8);
  const diagFromOne = sidesQ5 - 3;
  qs.push({
    id: 5,
    type: 'input',
    title: `ΔΙΑΓΩΝΙΟΙ ΑΠΟ 1 ΚΟΡΥΦΗ (${sidesQ5}-ΓΩΝΟ)`,
    prompt: `Ένα πολύγωνο έχει ${sidesQ5} κορυφές. Πόσες διαγώνιοι μπορούν να χαραχτούν από μία μόνο κορυφή του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(diagFromOne),
    tableData: [
      { label: 'Κορυφές (ν)', value: String(sidesQ5) },
      { label: 'Κανόνας', value: 'Αφαιρούμε 3 κορυφές (την ίδια και τις 2 διπλανές)' },
      { label: 'Πράξη', value: `${sidesQ5} － 3 ＝ ${diagFromOne}` }
    ],
    explanation: `Από μία κορυφή φεύγουν πάντα (ν － 3) διαγώνιοι. Εδώ: ${sidesQ5} － 3 ＝ ${diagFromOne}.`
  });

  // Q6: Περίμετρος κανονικού πενταγώνου (Input με δεκαδικό)
  const sideQ6 = randInt(3, 9) + 0.5;
  const perimQ6 = 5 * sideQ6;
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΠΕΡΙΜΕΤΡΟΣ ΚΑΝΟΝΙΚΟΥ ΠΕΝΤΑΓΩΝΟΥ',
    prompt: `Η πλευρά ενός κανονικού πενταγώνου έχει μήκος ${formatNum(sideQ6)} cm. Πόση είναι η περίμετρός του σε cm; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: formatNum(perimQ6),
    tableData: [
      { label: 'Σχήμα', value: 'Κανονικό πεντάγωνο (5 ίσες πλευρές)' },
      { label: 'Μήκος πλευράς', value: `${formatNum(sideQ6)} cm` },
      { label: 'Πράξη', value: `5 · ${formatNum(sideQ6)} cm ＝ ${formatNum(perimQ6)} cm` }
    ],
    explanation: `Το κανονικό πεντάγωνο έχει 5 ίσες πλευρές. Περίμετρος ＝ 5 · ${formatNum(sideQ6)} cm ＝ ${formatNum(perimQ6)} cm.`
  });

  // Q7: Προσδιορισμός κανονικού τετραπλεύρου (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΚΑΝΟΝΙΚΟ ΤΕΤΡΑΠΛΕΥΡΟ',
    prompt: 'Ποιο από τα παρακάτω τετράπλευρα είναι κανονικό πολύγωνο;',
    options: ensureFourUniqueOptions('Το τετράγωνο', () => [
      'Το ορθογώνιο παραλληλόγραμμο',
      'Ο ρόμβος',
      'Το τραπέζιο'
    ]),
    correctAnswer: 'Το τετράγωνο',
    tableData: [
      { label: 'Τετράγωνο', value: '4 ίσες πλευρές ΚΑΙ 4 ίσες ορθές γωνίες (Κανονικό)' },
      { label: 'Ρόμβος', value: '4 ίσες πλευρές, αλλά οι γωνίες δεν είναι κατ\' ανάγκη ίσες' },
      { label: 'Ορθογώνιο', value: '4 ίσες γωνίες (90°), αλλά οι πλευρές δεν είναι όλες ίσες' }
    ],
    explanation: 'Μόνο το τετράγωνο έχει ταυτόχρονα και τις 4 πλευρές ίσες και τις 4 γωνίες ίσες (90°), επομένως είναι το μόνο κανονικό τετράπλευρο.'
  });

  // Q8: Συνολικές διαγώνιοι πενταγώνου (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΣΥΝΟΛΙΚΕΣ ΔΙΑΓΩΝΙΟΙ ΠΕΝΤΑΓΩΝΟΥ',
    prompt: 'Πόσες είναι οι συνολικές διαγώνιοι ενός πενταγώνου;',
    options: ensureFourUniqueOptions('5 διαγώνιοι', () => [
      '2 διαγώνιοι',
      '10 διαγώνιοι',
      '8 διαγώνιοι'
    ]),
    correctAnswer: '5 διαγώνιοι',
    tableData: [
      { label: 'Κορυφές (ν)', value: '5' },
      { label: 'Τύπος', value: '[ν · (ν － 3)] : 2' },
      { label: 'Υπολογισμός', value: '[5 · (5 － 3)] : 2 ＝ (5 · 2) : 2 ＝ 10 : 2 ＝ 5' }
    ],
    explanation: 'Το πεντάγωνο έχει συνολικά 5 διαγωνίους. Είναι το μοναδικό πολύγωνο στο οποίο το πλήθος των πλευρών ισούται με το πλήθος των διαγωνίων του!'
  });

  // Q9: Πρόβλημα από STANDARD_PROBLEMS_POOL
  const stdIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Data = STANDARD_PROBLEMS_POOL[stdIndex]();
  qs.push({
    id: 9,
    type: 'mcq',
    ...q9Data
  });

  // Q10: Πρόβλημα από HARD_PROBLEMS_POOL
  const hardIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hardIndex]();
  qs.push({
    id: 10,
    type: 'mcq',
    ...q10Data
  });

  return qs;
}

// -------------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΑΣΚΗΣΕΩΝ
// -------------------------------------------------------------

export default function SximataAskiseisPage() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadNewSet();
  }, []);

  function loadNewSet() {
    const newQs = generateQuestionsSet();
    setQuestions(newQs);
    setUserAnswers({});
    setSubmitted(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleAnswerChange(id, rawValue) {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [id]: rawValue
    }));
  }

  function isQuestionCorrect(q) {
    const userAns = userAnswers[q.id];
    if (userAns === undefined || userAns === null) return false;

    if (q.type === 'boolean') {
      return userAns === q.correctAnswer;
    }

    if (q.type === 'mcq') {
      return String(userAns).trim() === String(q.correctAnswer).trim();
    }

    if (q.type === 'input') {
      const cleanUser = String(userAns).trim().replace(/\./g, ',');
      const cleanCorrect = String(q.correctAnswer).trim().replace(/\./g, ',');

      if (cleanUser === cleanCorrect) return true;

      const numUser = parseFloat(cleanUser.replace(',', '.'));
      const numCorrect = parseFloat(cleanCorrect.replace(',', '.'));
      if (!isNaN(numUser) && !isNaN(numCorrect)) {
        return Math.abs(numUser - numCorrect) <= 0.05;
      }
      return false;
    }

    return false;
  }

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] !== undefined && userAnswers[k] !== ''
  ).length;

  const score = questions.reduce((acc, q) => (isQuestionCorrect(q) ? acc + 1 : acc), 0);
  const totalCount = questions.length || 10;
  const percentage = Math.round((score / totalCount) * 100);

  return (
    <Layout
      title="Ασκήσεις: Γεωμετρικά Σχήματα &amp; Πολύγωνα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στα γεωμετρικά σχήματα, τα πολύγωνα και τις διαγωνίους με αυτόματη βαθμολόγηση για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/67-sximata"
      backText="Θεωρία Κεφ. 67"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/67-sximata"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden">

        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden mb-8 sm:mb-12">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 67 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Πολυγωνα και Διαγωνιοι')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στις ιδιότητες των πολυγώνων, τον υπολογισμό των διαγωνίων και την περίμετρο κανονικών σχημάτων μέσα από 10 δυναμικές ερωτήσεις.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>10 Δυναμικές Ασκήσεις με Άμεση Αξιολόγηση &amp; Αναλυτικές Λύσεις</span>
            </div>
            <button
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>🔄 {toCleanUppercase('Νεες Ασκησεις')}</span>
            </button>
          </div>
        </section>

        {/* ΛΙΣΤΑ ΕΡΩΤΗΣΕΩΝ */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, index) => {
            const isCorrect = isQuestionCorrect(q);
            const userAns = userAnswers[q.id];

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-5 sm:p-8 shadow-sm border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 ring-1 ring-emerald-200'
                      : 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* ΚΕΦΑΛΙΔΑ ΕΡΩΤΗΣΗΣ */}
                <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm sm:text-base border border-indigo-150">
                      {index + 1}
                    </span>
                    <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-wider">
                      {toCleanUppercase(q.title || `ΕΡΩΤΗΣΗ ${index + 1}`)}
                    </h2>
                  </div>

                  {submitted && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black tracking-wider ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? toCleanUppercase('ΣΩΣΤΟ') : toCleanUppercase('ΛΑΘΟΣ')}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ & SVG (NO-GIVEAWAY: ΟΥΔΕΙΣ ΠΙΝΑΚΑΣ ΕΔΩ) */}
                <div className="mb-6 space-y-3">
                  <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed">
                    {q.prompt}
                  </p>
                  {q.svg && <div className="py-2">{q.svg}</div>}
                </div>

                {/* ΔΙΑΔΡΑΣΤΙΚΑ ΧΕΙΡΙΣΤΗΡΙΑ ΑΠΑΝΤΗΣΗΣ */}
                <div className="mb-4">
                  {/* ΤΥΠΟΣ 1: BOOLEAN */}
                  {q.type === 'boolean' && (
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                      {[true, false].map((val) => {
                        const isSelected = userAns === val;
                        return (
                          <button
                            key={String(val)}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, val)}
                            className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all border ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {val ? toCleanUppercase('ΣΩΣΤΟ') : toCleanUppercase('ΛΑΘΟΣ')}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 2: MCQ (4 ΜΟΝΑΔΙΚΑ ΚΟΥΜΠΙΑ) */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAns === opt;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`text-left p-3.5 sm:p-4 rounded-2xl border font-semibold text-xs sm:text-sm transition-all flex items-start gap-3 ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                isSelected
                                  ? 'bg-white text-indigo-700'
                                  : 'bg-white text-slate-500 border border-slate-200'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="break-words whitespace-normal leading-snug flex-1">
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 3: INPUT */}
                  {q.type === 'input' && (
                    <div className="max-w-xs">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={submitted}
                        placeholder="Απάντηση..."
                        value={userAns || ''}
                        onChange={(e) => {
                          const cleaned = e.target.value
                            .replace(/[^0-9.,]/g, '')
                            .replace(/\./g, ',');
                          handleAnswerChange(q.id, cleaned);
                        }}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-80"
                      />
                    </div>
                  )}
                </div>

                {/* FEEDBACK & EXPLANATION (ΑΠΟΚΛΕΙΣΤΙΚΑ ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ) */}
                {submitted && (
                  <div className="mt-6 pt-5 border-t border-slate-150 space-y-4">
                    {/* ΠΙΝΑΚΑΣ ΔΕΔΟΜΕΝΩΝ (TABLEDATA) ΜΟΝΟ ΕΔΩ */}
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-1">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <tbody>
                            {q.tableData.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={rIdx !== q.tableData.length - 1 ? 'border-b border-slate-200/60' : ''}
                              >
                                <td className="py-2.5 px-3 font-bold text-slate-600 bg-slate-100/70 w-1/3">
                                  {row.label}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-800">
                                  {row.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* ΑΝΑΛΥΤΙΚΗ ΕΠΕΞΗΓΗΣΗ */}
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                          : 'bg-rose-50 text-rose-950 border border-rose-200'
                      }`}
                    >
                      <p className="font-bold mb-1">
                        {isCorrect
                          ? '✓ Μπράβο! Σωστή απάντηση.'
                          : `✗ Λάθος. Η σωστή απάντηση είναι: ${
                              q.type === 'boolean'
                                ? q.correctAnswer
                                  ? 'Σωστό'
                                  : 'Λάθος'
                                : q.correctAnswer
                            }`}
                      </p>
                      <p className="text-slate-700">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM SCORE FOOTER */}
        <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
          <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-8">
              {!submitted ? (
                <div className="text-xs sm:text-sm font-semibold text-slate-300">
                  <span>{toCleanUppercase('ΑΠΑΝΤΗΘΗΚΑΝ:')} </span>
                  <span className="font-black text-indigo-400 text-sm sm:text-base">
                    {answeredCount} / {totalCount}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span>{toCleanUppercase('ΣΚΟΡ:')} </span>
                    <span className="font-black text-emerald-400 text-sm sm:text-base">
                      {score} / {totalCount}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span>{toCleanUppercase('ΠΟΣΟΣΤΟ:')} </span>
                    <span className="font-black text-amber-400 text-sm sm:text-base">
                      {percentage}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!submitted ? (
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(true);
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-xs sm:text-sm"
                >
                  {toCleanUppercase('ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-xs sm:text-sm flex items-center gap-2"
                >
                  <span>🔄</span>
                  <span>{toCleanUppercase('ΝΕΕΣ ΑΣΚΗΣΕΙΣ')}</span>
                </button>
              )}
            </div>
          </div>
        </footer>

      </div>
    </Layout>
  );
}

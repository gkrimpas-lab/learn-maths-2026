// pages/st-dimotikou/15-kritiria-diairetotitas-ask.js
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

// Μορφοποίηση αριθμού με τελείες χιλιάδων
function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return Number(num).toLocaleString('el-GR');
}

// Άθροισμα ψηφίων
function sumDigits(numStr) {
  return String(numStr).split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
}

// Δεξαμενή θεματικών σεναρίων καθημερινότητας για την Q8
const REAL_WORLD_PROBLEMS_Q8 = [
  {
    prompt: (num) => `Έχουμε ${num} τετράδια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 377,
    correctOption: 'Δεν είναι δυνατόν χωρίς υπόλοιπο',
    wrongOptions: ['Σε ομάδες των 2', 'Σε ομάδες των 5', 'Σε ομάδες των 10'],
    explain: 'Ο αριθμός 377 δεν διαιρείται με κανέναν από τους αριθμούς 2, 5 και 10 (αφήνει πάντα υπόλοιπο).'
  },
  {
    prompt: (num) => `Έχουμε ${num} τετράδια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 284,
    correctOption: 'Σε ομάδες των 4',
    wrongOptions: ['Σε ομάδες των 5', 'Σε ομάδες των 9', 'Σε ομάδες των 10'],
    explain: 'Ο αριθμός 284 λήγει σε 84, το οποίο διαιρείται ακριβώς με το 4 (84 : 4 ＝ 21).'
  },
  {
    prompt: (num) => `Έχουμε ${num} ευρώ. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 303,
    correctOption: 'Σε μερίδια των 3',
    wrongOptions: ['Σε μερίδια των 2', 'Σε μερίδια των 5', 'Σε μερίδια των 10'],
    explain: 'Το άθροισμα των ψηφίων του 303 είναι 3 ＋ 0 ＋ 3 ＝ 6, άρα διαιρείται ακριβώς με το 3.'
  },
  {
    prompt: (num) => `Έχουμε ${num} μαθητές. Με ποιον τρόπο μπορούμε να τους χωρίσουμε σε ισοπληθείς ομάδες χωρίς να περισσέψει κανένας;`,
    total: 390,
    correctOption: 'Σε ομάδες των 10',
    wrongOptions: ['Σε ομάδες των 4', 'Σε ομάδες των 9', 'Σε ομάδες των 25'],
    explain: 'Ο αριθμός 390 λήγει σε 0, άρα διαιρείται ακριβώς με το 10.'
  },
  {
    prompt: (num) => `Έχουμε ${num} καραμέλες. Με ποιον τρόπο μπορούμε να τις μοιράσουμε ισόποσα χωρίς να περισσέψει καμία;`,
    total: 395,
    correctOption: 'Σε σακουλάκια των 5',
    wrongOptions: ['Σε σακουλάκια των 2', 'Σε σακουλάκια των 4', 'Σε σακουλάκια των 9'],
    explain: 'Ο αριθμός 395 λήγει σε 5, άρα διαιρείται ακριβώς με το 5.'
  },
  {
    prompt: (num) => `Έχουμε ${num} βιβλία. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 450,
    correctOption: 'Σε πακέτα των 25',
    wrongOptions: ['Σε πακέτα των 4', 'Σε πακέτα των 8', 'Σε πακέτα των 7'],
    explain: 'Ο αριθμός 450 τελειώνει σε 50, άρα διαιρείται ακριβώς με το 25.'
  },
  {
    prompt: (num) => `Έχουμε ${num} μήλα. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 729,
    correctOption: 'Σε καλάθια των 9',
    wrongOptions: ['Σε καλάθια των 2', 'Σε καλάθια των 5', 'Σε καλάθια των 10'],
    explain: 'Το άθροισμα των ψηφίων του 729 είναι 7 ＋ 2 ＋ 9 ＝ 18, το οποίο διαιρείται με το 9.'
  },
  {
    prompt: (num) => `Έχουμε ${num} λουλούδια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 524,
    correctOption: 'Σε ανθοδέσμες των 4',
    wrongOptions: ['Σε ανθοδέσμες των 5', 'Σε ανθοδέσμες των 9', 'Σε ανθοδέσμες των 10'],
    explain: 'Τα δύο τελευταία ψηφία του 524 σχηματίζουν το 24, που διαιρείται με το 4.'
  },
  {
    prompt: (num) => `Έχουμε ${num} σοκολατάκια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 810,
    correctOption: 'Σε κουτάκια των 10',
    wrongOptions: ['Σε κουτάκια των 4', 'Σε κουτάκια των 25', 'Σε κουτάκια των 7'],
    explain: 'Ο αριθμός 810 λήγει σε 0, άρα διαιρείται ακριβώς με το 10.'
  },
  {
    prompt: (num) => `Έχουμε ${num} μπάρες δημητριακών. Με ποιον τρόπο μπορούμε να τις μοιράσουμε ισόποσα χωρίς να περισσέψει καμία;`,
    total: 625,
    correctOption: 'Σε πακέτα των 25',
    wrongOptions: ['Σε πακέτα των 2', 'Σε πακέτα των 3', 'Σε πακέτα των 9'],
    explain: 'Ο αριθμός 625 τελειώνει σε 25, άρα διαιρείται ακριβώς με το 25.'
  }
];

// Διευρυμένη δεξαμενή προβλημάτων για την Ερώτηση 9 (MCQ)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_crit_std_1',
    generate: () => {
      const candidates = [326, 448, 514, 622];
      const validNum = 448;
      return {
        title: 'ΠΡΑΚΤΙΚΟΣ ΕΛΕΓΧΟΣ ΣΥΣΚΕΥΑΣΙΑΣ ΣΕ 4ΑΔΕΣ',
        instruction: 'Επιλέξτε τη σωστή ποσότητα:',
        text: 'Ένας αποθηκάριος θέλει να συσκευάσει αντικείμενα σε 4άδες χωρίς να περισσέψει κανένα. Ποια από τις παρακάτω ποσότητες μπορεί να συσκευαστεί ακριβώς: 326, 448, 514 ή 622;',
        tableData: { col1: 'Υποψήφιοι Αριθμοί', col2: 'Κριτήριο του 4', r1: ['326, 448, 514, 622', 'Δύο τελευταία ψηφία'], r2: ['Έλεγχος', '48 : 4 ＝ 12 ✅'] },
        optionsRaw: candidates.map(String),
        correctText: String(validNum),
        explanation: 'Τα δύο τελευταία ψηφία του 448 σχηματίζουν το 48, το οποίο διαιρείται ακριβώς με το 4 (48 : 4 ＝ 12).'
      };
    }
  },
  {
    id: 'p_crit_std_2',
    generate: () => {
      const price = 575;
      return {
        title: 'ΠΛΗΡΩΜΗ ΜΕ ΧΑΡΤΟΝΟΜΙΣΜΑΤΑ ΤΩΝ 25 €',
        instruction: 'Επιλέξτε αν είναι δυνατή η ακριβής πληρωμή:',
        text: `Ένα σχολείο αγόρασε μπάλες αξίας ${price} €. Μπορεί να πληρώσει το ποσό αυτό χρησιμοποιώντας αποκλειστικά χαρτονομίσματα των 25 € χωρίς να χρειαστούν ρέστα;`,
        tableData: { col1: 'Συνολικό Ποσό', col2: 'Χαρτονόμισμα 25 €', r1: [`${price} €`, 'Κριτήριο του 25'], r2: ['Τελευταία ψηφία: 75', '575 : 25 ＝ 23 ✅'] },
        optionsRaw: ['Ναι', 'Όχι'],
        correctText: 'Ναι',
        explanation: 'Ο αριθμός 575 τελειώνει σε 75, άρα διαιρείται ακριβώς με το 25 (575 : 25 ＝ 23).'
      };
    }
  },
  {
    id: 'p_crit_std_3',
    generate: () => {
      const candidates = [142, 235, 318, 421];
      const validNum = 235;
      return {
        title: 'ΜΟΙΡΑΣΜΑ ΚΑΡΑΜΕΛΩΝ ΣΕ 5ΑΔΕΣ',
        instruction: 'Επιλέξτε τον αριθμό που διαιρείται με το 5:',
        text: 'Μια δασκάλα θέλει να μοιράσει καραμέλες σε σακουλάκια των 5 χωρίς να περισσέψει καμία. Ποιο από τα παρακάτω πλήθη καραμελών είναι κατάλληλο: 142, 235, 318 ή 421;',
        tableData: { col1: 'Υποψήφιοι Αριθμοί', col2: 'Κριτήριο του 5', r1: ['142, 235, 318, 421', 'Λήγει σε 0 ή 5'], r2: ['Αποτέλεσμα', '235 : 5 ＝ 47 ✅'] },
        optionsRaw: candidates.map(String),
        correctText: String(validNum),
        explanation: 'Ο αριθμός 235 λήγει σε 5, επομένως διαιρείται ακριβώς με το 5.'
      };
    }
  },
  {
    id: 'p_crit_std_4',
    generate: () => {
      const candidates = [521, 633, 715, 802];
      const validNum = 633;
      return {
        title: 'ΚΑΤΑΝΟΜΗ ΜΑΘΗΤΩΝ ΣΕ 3ΑΔΕΣ',
        instruction: 'Επιλέξτε το πλήθος που διαιρείται με το 3:',
        text: 'Σε έναν διαγωνισμό οι μαθητές πρέπει να σχηματίσουν τριάδες. Ποιος από τους παρακάτω αριθμούς μαθητών επιτρέπει τον πλήρη σχηματισμό τριάδων: 521, 633, 715 ή 802;',
        tableData: { col1: 'Υποψήφιοι', col2: 'Κριτήριο του 3', r1: ['521, 633, 715, 802', 'Άθροισμα ψηφίων'], r2: ['Έλεγχος 633', '6 ＋ 3 ＋ 3 ＝ 12 (12 : 3 ＝ 4) ✅'] },
        optionsRaw: candidates.map(String),
        correctText: String(validNum),
        explanation: 'Το άθροισμα των ψηφίων του 633 είναι 6 ＋ 3 ＋ 3 ＝ 12, το οποίο διαιρείται ακριβώς με το 3.'
      };
    }
  },
  {
    id: 'p_crit_std_5',
    generate: () => {
      const candidates = [1240, 1345, 1452, 1506];
      const validNum = 1240;
      return {
        title: 'ΣΥΣΚΕΥΑΣΙΑ ΣΕ 10ΑΔΕΣ',
        instruction: 'Επιλέξτε τον αριθμό που διαιρείται με το 10:',
        text: 'Ένα εργοστάσιο συσκευάζει μολύβια σε δεκάδες. Ποιο από τα παρακάτω πλήθη μολυβιών συσκευάζεται χωρίς να περισσέψει κανένα μολύβι: 1.240, 1.345, 1.452 ή 1.506;',
        tableData: { col1: 'Ποσότητες', col2: 'Κριτήριο του 10', r1: ['1.240, 1.345, 1.452, 1.506', 'Λήγει σε 0'], r2: ['Αποτέλεσμα', '1.240 : 10 ＝ 124 ✅'] },
        optionsRaw: ['1.240', '1.345', '1.452', '1.506'],
        correctText: '1.240',
        explanation: 'Ο αριθμός 1.240 λήγει σε 0, άρα διαιρείται ακριβώς με το 10.'
      };
    }
  },
  {
    id: 'p_crit_std_6',
    generate: () => {
      const candidates = [316, 425, 513, 620];
      const validNum = 513;
      return {
        title: 'ΟΜΑΔΕΣ ΤΩΝ 9 ΑΤΟΜΩΝ',
        instruction: 'Επιλέξτε τον αριθμό που διαιρείται με το 9:',
        text: 'Σε ένα φεστιβάλ οι θεατές χωρίζονται σε ομάδες των 9. Ποιο από τα παρακάτω πλήθη θεατών μπορεί να χωριστεί χωρίς να περισσέψει κανείς: 316, 425, 513 ή 620;',
        tableData: { col1: 'Υποψήφιοι', col2: 'Κριτήριο του 9', r1: ['316, 425, 513, 620', 'Άθροισμα ψηφίων'], r2: ['Έλεγχος 513', '5 ＋ 1 ＋ 3 ＝ 9 (9 : 9 ＝ 1) ✅'] },
        optionsRaw: candidates.map(String),
        correctText: String(validNum),
        explanation: 'Το άθροισμα των ψηφίων του 513 είναι 5 ＋ 1 ＋ 3 ＝ 9, άρα διαιρείται ακριβώς με το 9.'
      };
    }
  }
];

// Διευρυμένη δεξαμενή προβλημάτων για την Ερώτηση 10 (MCQ)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_crit_hard_1',
    generate: () => {
      const explainStr = 'Ο αριθμός 1.350 λήγει σε 0 (άρα διαιρείται με το 2 και το 5) και έχει άθροισμα ψηφίων 1 ＋ 3 ＋ 5 ＋ 0 ＝ 9 (άρα διαιρείται με το 9).';
      return {
        title: 'ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ 2, 5 ΚΑΙ 9',
        instruction: 'Επιλέξτε τον σωστό αριθμό:',
        text: 'Ποιος από τους παρακάτω αριθμούς διαιρείται ταυτόχρονα με το 2, το 5 και το 9: 1.350, 2.435, 3.142 ή 4.205;',
        tableData: { col1: 'Αριθμός 1.350', col2: 'Έλεγχος Κριτηρίων', r1: ['Λήγει σε 0', 'Διαιρείται με 2 & 5 ✅'], r2: ['Άθροισμα: 1 ＋ 3 ＋ 5 ＋ 0 ＝ 9', 'Διαιρείται με 9 ✅'] },
        optionsRaw: ['1.350', '2.435', '3.142', '4.205'],
        correctText: '1.350',
        explanation: explainStr
      };
    }
  },
  {
    id: 'p_crit_hard_2',
    generate: () => {
      const explainStr = 'Ο αριθμός 2.100 λήγει σε 00, άρα διαιρείται και με το 4 και με το 25.';
      return {
        title: 'ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ 4 ΚΑΙ 25',
        instruction: 'Επιλέξτε τον αριθμό που διαιρείται ταυτόχρονα με το 4 και το 25:',
        text: 'Ποιος από τους παρακάτω αριθμούς διαιρείται ταυτόχρονα με το 4 και το 25: 1.550, 2.100, 3.225 ή 4.150;',
        tableData: { col1: 'Αριθμός 2.100', col2: 'Έλεγχος Κριτηρίων', r1: ['Τελειώνει σε 00', 'Διαιρείται με 4 ✅'], r2: ['Τελειώνει σε 00', 'Διαιρείται με 25 ✅'] },
        optionsRaw: ['1.550', '2.100', '3.225', '4.150'],
        correctText: '2.100',
        explanation: explainStr
      };
    }
  },
  {
    id: 'p_crit_hard_3',
    generate: () => {
      const explainStr = 'Ο αριθμός 720 είναι άρτιος (διαιρείται με 2), λήγει σε 0 (διαιρείται με 5 και 10) και έχει άθροισμα ψηφίων 7 ＋ 2 ＋ 0 ＝ 9 (διαιρείται με 3 και 9).';
      return {
        title: 'ΚΟΙΝΟΣ ΔΙΑΙΡΕΤΗΣ ΠΟΛΛΑΠΛΩΝ ΚΡΙΤΗΡΙΩΝ',
        instruction: 'Επιλέξτε τον αριθμό που διαιρείται με 2, 3, 5, 9 και 10:',
        text: 'Ποιος από τους παρακάτω αριθμούς διαιρείται ταυτόχρονα με το 2, το 3, το 5, το 9 και το 10: 520, 635, 720 ή 815;',
        tableData: { col1: 'Αριθμός 720', col2: 'Έλεγχος Κριτηρίων', r1: ['Λήγει σε 0', 'Διαιρείται με 2, 5, 10 ✅'], r2: ['Άθροισμα: 7 ＋ 2 ＋ 0 ＝ 9', 'Διαιρείται με 3 & 9 ✅'] },
        optionsRaw: ['520', '635', '720', '815'],
        correctText: '720',
        explanation: explainStr
      };
    }
  },
  {
    id: 'p_crit_hard_4',
    generate: () => {
      const explainStr = 'Ο αριθμός 828 είναι άρτιος (διαιρείται με 2), λήγει σε 28 (διαιρείται με 4) και έχει άθροισμα 8 ＋ 2 ＋ 8 ＝ 18 (διαιρείται με 3 και 9).';
      return {
        title: 'ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ 3, 4 ΚΑΙ 9',
        instruction: 'Επιλέξτε τον σωστό αριθμό:',
        text: 'Ποιος από τους παρακάτω αριθμούς διαιρείται ταυτόχρονα με το 3, το 4 και το 9: 614, 726, 828 ή 916;',
        tableData: { col1: 'Αριθμός 828', col2: 'Έλεγχος Κριτηρίων', r1: ['Τελειώνει σε 28', '28 : 4 ＝ 7 ✅'], r2: ['Άθροισμα: 8 ＋ 2 ＋ 8 ＝ 18', 'Διαιρείται με 3 & 9 ✅'] },
        optionsRaw: ['614', '726', '828', '916'],
        correctText: '828',
        explanation: explainStr
      };
    }
  },
  {
    id: 'p_crit_hard_5',
    generate: () => {
      const explainStr = 'Ο αριθμός 1.575 τελειώνει σε 75 (διαιρείται με 25) και έχει άθροισμα ψηφίων 1 ＋ 5 ＋ 7 ＋ 5 ＝ 18 (διαιρείται με 9).';
      return {
        title: 'ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ 9 ΚΑΙ 25',
        instruction: 'Επιλέξτε τον αριθμό που διαιρείται ταυτόχρονα με το 9 και το 25:',
        text: 'Ποιος από τους παρακάτω αριθμούς διαιρείται ταυτόχρονα με το 9 και το 25: 1.250, 1.425, 1.575 ή 1.850;',
        tableData: { col1: 'Αριθμός 1.575', col2: 'Έλεγχος Κριτηρίων', r1: ['Τελειώνει σε 75', 'Διαιρείται με 25 ✅'], r2: ['Άθροισμα: 1 ＋ 5 ＋ 7 ＋ 5 ＝ 18', 'Διαιρείται με 9 ✅'] },
        optionsRaw: ['1.250', '1.425', '1.575', '1.850'],
        correctText: '1.575',
        explanation: explainStr
      };
    }
  },
  {
    id: 'p_crit_hard_6',
    generate: () => {
      const explainStr = 'Ο αριθμός 960 λήγει σε 0 (διαιρείται με 10) και τελειώνει σε 60 (60 : 4 ＝ 15, άρα διαιρείται με 4).';
      return {
        title: 'ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ 4 ΚΑΙ 10',
        instruction: 'Επιλέξτε τον αριθμό που διαιρείται ταυτόχρονα με το 4 και το 10:',
        text: 'Ποιος από τους παρακάτω αριθμούς διαιρείται ταυτόχρονα με το 4 και το 10: 930, 950, 960 ή 970;',
        tableData: { col1: 'Αριθμός 960', col2: 'Έλεγχος Κριτηρίων', r1: ['Λήγει σε 0', 'Διαιρείται με 10 ✅'], r2: ['Τελειώνει σε 60', '60 : 4 ＝ 15 ✅'] },
        optionsRaw: ['930', '950', '960', '970'],
        correctText: '960',
        explanation: explainStr
      };
    }
  }
];

// Δημιουργία των 10 δυναμικών ερωτήσεων
function generateQuestions() {
  const qList = [];

  // Q1 (MCQ Yes/No): Διαιρετότητα με το 2, 5 ή 10
  {
    const q1Div = [2, 5, 10][randInt(0, 2)];
    const q1IsDivisible = Math.random() > 0.5;
    let q1Num = randInt(120, 980);

    if (q1IsDivisible) {
      if (q1Div === 2) {
        if (q1Num % 2 !== 0) q1Num += 1;
      } else if (q1Div === 5) {
        q1Num = Math.floor(q1Num / 5) * 5;
      } else {
        q1Num = Math.floor(q1Num / 10) * 10;
      }
    } else {
      if (q1Div === 2) {
        if (q1Num % 2 === 0) q1Num += 1;
      } else if (q1Div === 5) {
        if (q1Num % 5 === 0) q1Num += 3;
      } else {
        if (q1Num % 10 === 0) q1Num += 3;
      }
    }

    const q1Correct = q1Num % q1Div === 0 ? 'Ναι' : 'Όχι';
    const rawOptions = ['Ναι', 'Όχι'];
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === q1Correct
    }));

    qList.push({
      id: 1,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 1 • ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ 2, 5, 10',
      instruction: 'Επιλέξτε αν ο αριθμός διαιρείται ακριβώς:',
      prompt: `Διαιρείται ο αριθμός ${q1Num} ακριβώς με το ${q1Div};`,
      options,
      correctText: q1Correct,
      explanation: q1Num % q1Div === 0
        ? `Σωστά! Το τελευταίο ψηφίο είναι το ${q1Num % 10}, επομένως ο αριθμός ${q1Num} διαιρείται ακριβώς με το ${q1Div}.`
        : `Ο αριθμός ${q1Num} τελειώνει σε ${q1Num % 10}, άρα ΔΕΝ διαιρείται ακριβώς με το ${q1Div}.`
    });
  }

  // Q2 (Input): Άθροισμα ψηφίων & Διαιρετότητα με το 3 ή 9
  {
    const q2Div = [3, 9][randInt(0, 1)];
    let q2Num = randInt(110, 890);
    if (q2Div === 3) {
      while (sumDigits(String(q2Num)) % 3 !== 0) q2Num++;
    } else {
      while (sumDigits(String(q2Num)) % 9 !== 0) q2Num++;
    }
    const q2Sum = sumDigits(String(q2Num));

    qList.push({
      id: 2,
      type: 'integer_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΑΘΡΟΙΣΜΑ ΨΗΦΙΩΝ',
      instruction: 'Υπολογίστε το άθροισμα των ψηφίων του αριθμού (ακέραιος):',
      prompt: `Ποιο είναι το άθροισμα των ψηφίων του αριθμού ${q2Num};`,
      correctVal: q2Sum,
      correctStr: String(q2Sum),
      explanation: `Τα ψηφία του αριθμού ${q2Num} είναι: ${String(q2Num).split('').join(' ＋ ')} ＝ ${q2Sum}.`
    });
  }

  // Q3 (MCQ): Διαιρετότητα με το 4 ή το 25
  {
    const q3Div = [4, 25][randInt(0, 1)];
    let q3ValidNum = randInt(100, 900);
    if (q3Div === 4) {
      while (q3ValidNum % 4 !== 0) q3ValidNum++;
    } else {
      q3ValidNum = Math.floor(q3ValidNum / 25) * 25;
    }
    const q3Invalid1 = q3ValidNum + (q3Div === 4 ? 2 : 10);
    const q3Invalid2 = q3ValidNum + (q3Div === 4 ? 3 : 15);
    const q3Invalid3 = q3ValidNum + (q3Div === 4 ? 1 : 7);

    const rawOptions = [
      String(q3ValidNum),
      String(q3Invalid1),
      String(q3Invalid2),
      String(q3Invalid3)
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === String(q3ValidNum)
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ ΤΟ 4 & 25',
      instruction: 'Επιλέξτε ποιος αριθμός διαιρείται ακριβώς:',
      prompt: `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το ${q3Div};`,
      options,
      correctText: String(q3ValidNum),
      explanation: q3Div === 4
        ? `Τα δύο τελευταία ψηφία του ${q3ValidNum} (${String(q3ValidNum).slice(-2)}) διαιρούνται με το 4.`
        : `Ο αριθμός ${q3ValidNum} τελειώνει σε ${String(q3ValidNum).slice(-2)}, άρα διαιρείται με το 25.`
    });
  }

  // Q4 (MCQ): Εύρεση ψηφίου που λείπει
  {
    const q4Div = [3, 9][randInt(0, 1)];
    const d1 = randInt(1, 8);
    const d3 = randInt(1, 8);
    let correctDigit = 0;
    for (let digit = 0; digit <= 9; digit++) {
      if ((d1 + digit + d3) % q4Div === 0) {
        correctDigit = digit;
        break;
      }
    }
    const q4NumberPattern = `${d1} _ ${d3}`;
    const rawOptions = [
      String(correctDigit),
      String((correctDigit + 1) % 10),
      String((correctDigit + 2) % 10),
      String((correctDigit + 4) % 10)
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === String(correctDigit)
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΕΥΡΕΣΗ ΨΗΦΙΟΥ ΠΟΥ ΛΕΙΠΕΙ',
      instruction: 'Επιλέξτε το κατάλληλο ψηφίο:',
      prompt: `Ποιο ψηφίο πρέπει να μπει στη θέση του κενού στον αριθμό ${q4NumberPattern} ώστε να διαιρείται ακριβώς με το ${q4Div};`,
      options,
      correctText: String(correctDigit),
      explanation: `Βάζοντας το ψηφίο ${correctDigit}, το άθροισμα των ψηφίων γίνεται ${d1} ＋ ${correctDigit} ＋ ${d3} ＝ ${d1 + correctDigit + d3}, που διαιρείται με το ${q4Div}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας για το 3 και 9
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Ένας αριθμός διαιρείται με το 9 όταν το άθροισμα των ψηφίων του διαιρείται με το 9.'
      : 'Ένας αριθμός διαιρείται με το 9 όταν το τελευταίο του ψηφίο είναι το 9.';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΔΙΑΙΡΕΤΟΤΗΤΑΣ ΜΕ ΤΟ 9',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Για το 3 και το 9 αρκεί να προσθέσουμε τα ψηφία του αριθμού.'
        : 'Λάθος! Για τη διαιρετότητα με το 9 εξετάζουμε το άθροισμα των ψηφίων, όχι μόνο το τελευταίο ψηφίο.'
    });
  }

  // Q6 (MCQ): True / False - Κανόνας για το 4 και 25
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Ένας αριθμός διαιρείται με το 25 όταν τα δύο τελευταία του ψηφία είναι 00, 25, 50 ή 75.'
      : 'Ένας αριθμός διαιρείται με το 25 όταν το τελευταίο του ψηφίο είναι το 5.';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΔΙΑΙΡΕΤΟΤΗΤΑΣ ΜΕ ΤΟ 25',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Τα δύο τελευταία ψηφία πρέπει να σχηματίζουν 00, 25, 50 ή 75.'
        : 'Λάθος! Δεν αρκεί το τελευταίο ψηφίο να είναι 5 (π.χ. το 15 λήγει σε 5 αλλά ΔΕΝ διαιρείται με το 25).'
    });
  }

  // Q7 (Input): Ταυτόχρονη διαιρετότητα (με 2, 5 και 10)
  {
    const q7Options = [120, 240, 350, 480, 500, 620, 750, 900];
    const q7Num = q7Options[randInt(0, q7Options.length - 1)];
    const q7CorrectVal = 10;

    qList.push({
      id: 7,
      type: 'integer_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ',
      instruction: 'Συμπληρώστε τον αριθμό (ακέραιος):',
      prompt: `Ο αριθμός ${q7Num} διαιρείται ταυτόχρονα με το 2 και το 5. Με ποιον άλλον βασικό αριθμό διαιρείται σίγουρα;`,
      correctVal: q7CorrectVal,
      correctStr: String(q7CorrectVal),
      explanation: `Ο αριθμός ${q7Num} τελειώνει σε 0, άρα διαιρείται ταυτόχρονα με το 2, το 5 και το 10.`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας
  {
    const shuffledQ8Pool = shuffle(REAL_WORLD_PROBLEMS_Q8);
    const selectedQ8 = shuffledQ8Pool[0];
    const q8Prompt = selectedQ8.prompt(selectedQ8.total);
    const q8CorrectStr = selectedQ8.correctOption;
    const rawOptions = [selectedQ8.correctOption, ...selectedQ8.wrongOptions];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8CorrectStr
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: 'Επιλέξτε τον σωστό τρόπο ισόποσης κατανομής:',
      prompt: q8Prompt,
      options,
      correctText: q8CorrectStr,
      explanation: selectedQ8.explain
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

export default function KritiriaDiairetotitasExercisesPage() {
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
      title="Ασκήσεις: Κριτήρια Διαιρετότητας - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στα κριτήρια διαιρετότητας για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/15-kritiria-diairetotitas"
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
              <span>ΚΕΦΑΛΑΙΟ 15 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ασκήσεις &amp; Προβλήματα: Κριτήρια Διαιρετότητας
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 δυναμικές δραστηριότητες κριτηρίων διαιρετότητας με το 2, 3, 4, 5, 9, 10 και 25, ταυτόχρονης διαιρετότητας και ρεαλιστικά προβλήματα καθημερινής ζωής.
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

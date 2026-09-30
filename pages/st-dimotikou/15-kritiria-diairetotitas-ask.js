// pages/st-dimotikou/15-kritiria-diairetotitas-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

// Τυχαιος ακεραιος στο [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ανακατεμα πινακα
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Αθροισμα ψηφιων
function sumDigits(numStr) {
  return numStr.split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
}

// Δεξαμενη 10 θεματικων σεναριων καθημερινοτητας
const REAL_WORLD_PROBLEMS_Q8 = [
  {
    prompt: (num) => `Έχουμε ${num} τετράδια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 377,
    correctOption: 'Δεν είναι δυνατόν χωρίς υπόλοιπο',
    wrongOptions: ['Σε ομάδες των 2', 'Σε ομάδες των 5', 'Σε ομάδες των 10'],
    explain: 'Ο αριθμός 377 δεν διαιρείται ακριβώς με κανέναν από τους βασικούς διαιρέτες χωρίς υπόλοιπο.'
  },
  {
    prompt: (num) => `Έχουμε ${num} τετράδια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 284,
    correctOption: 'Σε ομάδες των 4',
    wrongOptions: ['Σε ομάδες των 5', 'Σε ομάδες των 9', 'Σε ομάδες των 10'],
    explain: 'Ο αριθμός 284 λήγει σε 84, άρα διαιρείται ακριβώς με το 4 (284 : 4 ＝ 71).'
  },
  {
    prompt: (num) => `Έχουμε ${num} ευρώ. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 303,
    correctOption: 'Σε μερίδια των 3',
    wrongOptions: ['Σε μερίδια των 2', 'Σε μερίδια των 5', 'Σε μερίδια των 10'],
    explain: 'Το άθροισμα των ψηφίων του 303 είναι 3 ＋ 0 ＋ 3 ＝ 6, άρα διαιρείται ακριβώς με το 3.'
  },
  {
    prompt: (num) => `Έχουμε ${num} μαθητές. Με ποιον τρόπο μπορούμε να τους μοιράσουμε ισόποσα χωρίς να περισσέψει κανένας;`,
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
    wrongOptions: ['Σε πακέτα των 4', 'Σε πακέτα των 9', 'Σε πακέτα των 3'],
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
    explain: 'Τα δύο τελευταία ψηφία του 524 είναι το 24, που διαιρείται με το 4.'
  },
  {
    prompt: (num) => `Έχουμε ${num} σοκολατάκια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 810,
    correctOption: 'Σε κουτάκια των 10',
    wrongOptions: ['Σε κουτάκια των 4', 'Σε κουτάκια των 25', 'Σε κουτάκια των 9'],
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

// Δεξαμενη προβληματων για τις ερωτησεις 9 & 10
const EXTRA_PROBLEMS_POOL = [
  {
    id: 'p_crit_std_1',
    generate: () => {
      const targetDiv = 4;
      const candidates = [326, 448, 514, 622];
      const validNum = 448;
      const explainStr = 'Τα δύο τελευταία ψηφία του 448 είναι το 48, το οποίο διαιρείται ακριβώς με το 4 (48 : 4 ＝ 12).';
      return {
        text: 'Ένας αποθηκάριος θέλει να συσκευάσει αντικείμενα σε 4άδες χωρίς να περισσέψει κανένα. Ποια από τις παρακάτω ποσότητες μπορεί να συσκευαστεί ακριβώς: 326, 448, 514 ή 622;',
        tableData: { col1: 'Υποψήφιοι Αριθμοί', col2: 'Κριτήριο του 4', r1: ['326, 448, 514, 622', 'Δύο τελευταία ψηφία'], r2: ['Έλεγχος', '48 : 4 ＝ 12 ✅'] },
        optionsRaw: candidates.map(String),
        correctText: String(validNum),
        explanation: explainStr
      };
    }
  },
  {
    id: 'p_crit_std_2',
    generate: () => {
      const candidates = [1350, 2435, 3142, 4205];
      const validNum = 1350;
      const explainStr = 'Ο αριθμός 1350 λήγει σε 0 (άρα διαιρείται με το 2, 5, 10), τελειώνει σε 50 (διαιρείται με το 25) και έχει άθροισμα ψηφίων 1 ＋ 3 ＋ 5 ＋ 0 ＝ 9 (διαιρείται με το 3 και 9).';
      return {
        text: 'Ποιος από τους παρακάτω αριθμούς διαιρείται ταυτόχρονα με το 2, το 5 και το 9: 1.350, 2.435, 3.142 ή 4.205;',
        tableData: { col1: 'Αριθμός 1.350', col2: 'Έλεγχος Κριτηρίων', r1: ['Λήγει σε 0', 'Διαιρείται με 2 & 5 ✅'], r2: ['Άθροισμα: 1＋3＋5＋0 ＝ 9', 'Διαιρείται με 9 ✅'] },
        optionsRaw: ['1.350', '2.435', '3.142', '4.205'],
        correctText: '1.350',
        explanation: explainStr
      };
    }
  },
  {
    id: 'p_crit_std_3',
    generate: () => {
      const price = 575;
      const explainStr = 'Ο αριθμός 575 τελειώνει σε 75, άρα διαιρείται ακριβώς με το 25 (575 : 25 ＝ 23).';
      return {
        text: `Ένα σχολείο αγόρασε μπάλες αξίας ${price} €. Μπορεί να πληρώσει το ποσό αυτό χρησιμοποιώντας αποκλειστικά χαρτονομίσματα των 25 € χωρίς να χρειαστούν ρέστα;`,
        tableData: { col1: 'Συνολικό Ποσό', col2: 'Χαρτονόμισμα 25 €', r1: [`${price} €`, 'Κριτήριο του 25'], r2: ['Τελευταία ψηφία: 75', '575 : 25 ＝ 23 ✅'] },
        optionsRaw: ['Ναι', 'Όχι'],
        correctText: 'Ναι',
        explanation: explainStr
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
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
        ? `Σωστά! Το τελευταίο ψηφίο είναι ${q1Num % 10}, επομένως ο αριθμός ${q1Num} διαιρείται ακριβώς με το ${q1Div}.`
        : `Ο αριθμός ${q1Num} τελειώνει σε ${q1Num % 10}, άρα ΔΕΝ διαιρείται ακριβώς με το ${q1Div}.`
    });
  }

  // Q2 (Input - Decimal): Άθροισμα ψηφίων & Διαιρετότητα με το 3 ή 9
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
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΑΘΡΟΙΣΜΑ ΨΗΦΙΩΝ',
      instruction: 'Υπολογίστε το άθροισμα των ψηφίων του αριθμού:',
      prompt: `Ποιο είναι το άθροισμα των ψηφίων του αριθμού ${q2Num};`,
      correctVal: q2Sum,
      correctStr: String(q2Sum),
      explanation: `Τα ψηφία του αριθμού ${q2Num} είναι: ${String(q2Num).split('').join(' ＋ ')} ＝ ${q2Sum}.`
    });
  }

  // Q3 (MCQ): Διαιρετότητα με το 4 ή το 25 (Εγγύηση Μοναδικότητας)
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

  // Q4 (MCQ): Εύρεση ψηφίου που λείπει (Εγγύηση Μοναδικότητας)
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
      prompt: `Ποιο ψηφίο πρέπει να μπει στο κενό του αριθμού ${q4NumberPattern} ώστε να διαιρείται ακριβώς με το ${q4Div};`,
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
        : 'Λάθος! Για τη διαιρετότητα με το 9 εξετάζουμε το ΑΘΡΟΙΣΜΑ των ψηφίων, όχι μόνο το τελευταίο ψηφίο.'
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

  // Q7 (Input - Decimal): Ταυτόχρονη διαιρετότητα (με 2, 5 και 10)
  {
    const q7Options = [120, 240, 350, 480, 500, 620, 750, 900];
    const q7Num = q7Options[randInt(0, q7Options.length - 1)];
    const q7CorrectVal = 10;

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ',
      instruction: 'Συμπληρώστε τον αριθμό:',
      prompt: `Ο αριθμός ${q7Num} διαιρείται ταυτόχρονα με το 2 και το 5. Με ποιον άλλον βασικό αριθμό διαιρείται σίγουρα;`,
      correctVal: q7CorrectVal,
      correctStr: String(q7CorrectVal),
      explanation: `Ο αριθμός ${q7Num} τελειώνει σε 0, άρα διαιρείται ταυτόχρονα με το 2, το 5 και το 10.`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας (Εγγύηση Μοναδικότητας)
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

  // Q9 & Q10: Προβλήματα από τη δεξαμενή EXTRA_PROBLEMS_POOL (1 Input, 1 MCQ)
  {
    const shuffledPool = shuffle([...EXTRA_PROBLEMS_POOL]);
    const prob9 = shuffledPool[0].generate();
    const prob10 = shuffledPool[1].generate();

    // Q9 (MCQ) - Χωρίς πίνακα στην εκφώνηση
    const optionsQ9 = shuffle([...new Set(prob9.optionsRaw)]).map((text) => ({
      text,
      isCorrect: text === prob9.correctText
    }));

    qList.push({
      id: 9,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 9 • ΠΡΑΚΤΙΚΟΣ ΕΛΕΓΧΟΣ ΣΥΣΚΕΥΑΣΙΑΣ',
      instruction: 'Επιλέξτε τη σωστή ποσότητα:',
      prompt: prob9.text,
      tableData: prob9.tableData,
      options: optionsQ9,
      correctText: prob9.correctText,
      explanation: prob9.explanation
    });

    // Q10 (MCQ) - Χωρίς πίνακα στην εκφώνηση
    const optionsQ10 = shuffle([...new Set(prob10.optionsRaw)]).map((text) => ({
      text,
      isCorrect: text === prob10.correctText
    }));

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΣΥΝΘΕΤΟΣ ΕΛΕΓΧΟΣ ΔΙΑΙΡΕΤΟΤΗΤΑΣ',
      instruction: 'Επιλέξτε τον σωστό αριθμό:',
      prompt: prob10.text,
      tableData: prob10.tableData,
      options: optionsQ10,
      correctText: prob10.correctText,
      explanation: prob10.explanation
    });
  }

  return qList;
}

export default function KritiriaDiairetotitasExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργια νεων ασκησεων
  const loadNewSet = useCallback(() => {
    const q = generateQuestions();
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμος Input με καθαρισμο χαρακτηρων (μονο 0-9 και ενα κομμα, οριο 10 χαρακτηρων)
  const handleInputChange = (qId, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/\./g, ',');
    sanitized = sanitized.replace(/[^0-9,]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: sanitized
    }));
  };

  // Χειρισμος MCQ
  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  // Ελεγχος Απαντησεων
  const handleCheckAnswers = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitted) return;

    let currentScore = 0;

    questions.forEach((q) => {
      if (q.type === 'mcq') {
        const userChoice = answers[`q_${q.id}`];
        if (userChoice === q.correctText) {
          currentScore += 1;
        }
      } else if (q.type === 'decimal_input') {
        const userValStr = (answers[`q_${q.id}`] || '').trim().replace(',', '.');
        const userVal = parseFloat(userValStr);
        if (!isNaN(userVal) && Math.abs(userVal - q.correctVal) < 0.05) {
          currentScore += 1;
        }
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

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
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      {/* Container πληρους ευρους για κινητα εως 2K, 4K & 8K */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-32 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ασκήσεις &amp; Προβλήματα: Κριτήρια Διαιρετότητας
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες κριτηρίων διαιρετότητας με το 2, 3, 4, 5, 9, 10 και 25, ταυτόχρονης διαιρετότητας και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
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
              <span>🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>
          </div>
        </section>

        {/* Λιστα 10 Ασκησεων */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q) => {
            let isCorrect = false;
            if (isSubmitted) {
              if (q.type === 'mcq') {
                isCorrect = answers[`q_${q.id}`] === q.correctText;
              } else if (q.type === 'decimal_input') {
                const uv = parseFloat((answers[`q_${q.id}`] || '').replace(',', '.'));
                isCorrect = !isNaN(uv) && Math.abs(uv - q.correctVal) < 0.05;
              }
            }

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
                {/* Επικεφαλιδα Ερωτησης (Καθαρα ατονα κεφαλαια εκτος ΣΤ') */}
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
                      {isCorrect ? '✓ ΣΩΣΤΟ' : '✗ ΛΑΘΟΣ'}
                    </span>
                  )}
                </div>

                {/* Εκφωνηση (Καθαρο κειμενο χωρις πινακες που προδιδουν τη λυση) */}
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

                {/* Περιοχη Απαντησης */}
                <div className="py-2">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500">
                        (Ακέραιος αριθμός)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) - Χωρις truncate, πληρες κειμενο break-words */}
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
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
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

                {/* Feedback μετα την υποβολη (Εδω εμφανιζεται ο αναλυτικος πινακας δεδομενων) */}
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

        {/* Κουμπι Ελεγχου στο τελος της φορμας */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleCheckAnswers}
            disabled={isSubmitted}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Απαντήσεων</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                ΣΚΟΡ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-base">/ 10</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-xs text-slate-400 font-semibold block">
                ΠΟΣΟΣΤΟ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
                {Math.round((score / 10) * 100)} %
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                ΕΛΕΓΧΟΣ
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}

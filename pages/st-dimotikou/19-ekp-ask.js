// pages/st-dimotikou/19-ekp-ask.js
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

// Μεγιστος Κοινος Διαιρετης
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

// Ελαχιστο Κοινο Πολλαπλασιο δυο αριθμων
function lcmTwo(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

// ΕΚΠ πινακα αριθμων
function lcmArray(arr) {
  return arr.reduce((acc, curr) => lcmTwo(acc, curr), arr[0]);
}

// Δεξαμενη προβληματων για τις ερωτησεις 9 & 10
const EXTRA_PROBLEMS_POOL = [
  {
    id: 'p_ekp_std_1',
    generate: () => {
      const busA = 12;
      const busB = 18;
      const l = lcmTwo(busA, busB);
      return {
        text: `Σε έναν σταθμό, το λεωφορείο Α αναχωρεί κάθε ${busA} λεπτά και το λεωφορείο Β αναχωρεί κάθε ${busB} λεπτά. Αν ξεκινήσουν ταυτόχρονα στις 08:00 το πρωί, μετά από πόσα λεπτά θα αναχωρήσουν ξανά ταυτόχρονα για πρώτη φορά;`,
        tableData: { col1: 'Δρομολόγια', col2: 'Χρόνος Αναχώρησης', r1: [`Λεωφορείο Α: ${busA} λ.`, `Λεωφορείο Β: ${busB} λ.`], r2: ['Υπολογισμός Ε.Κ.Π.', `Ε.Κ.Π.(${busA}, ${busB}) ＝ ${l} λεπτά ✅`] },
        optionsRaw: [
          `${l} λεπτά`,
          `${busA + busB} λεπτά`,
          `${l * 2} λεπτά`,
          `${busA * 2} λεπτά`
        ],
        correctText: `${l} λεπτά`,
        explanation: `Τα λεωφορεία θα συναντηθούν στο Ελάχιστο Κοινό Πολλαπλάσιο των χρόνων τους: Ε.Κ.Π.(${busA}, ${busB}) ＝ ${l} λεπτά.`
      };
    }
  },
  {
    id: 'p_ekp_std_2',
    generate: () => {
      const light1 = 15;
      const light2 = 20;
      const l = lcmTwo(light1, light2);
      return {
        text: `Σε έναν δρόμο δύο φωτεινές πινακίδες αναβοσβήνουν ρυθμικά: η πρώτη ανάβει κάθε ${light1} δευτερόλεπτα και η δεύτερη κάθε ${light2} δευτερόλεπτα. Κάθε πόσα δευτερόλεπτα θα ανάβουν ταυτόχρονα;`,
        tableData: { col1: 'Πινακίδες', col2: 'Συχνότητα', r1: [`Πινακίδα 1: ${light1} δευτ.`, `Πινακίδα 2: ${light2} δευτ.`], r2: ['Υπολογισμός Ε.Κ.Π.', `Ε.Κ.Π.(${light1}, ${light2}) ＝ ${l} δευτερόλεπτα ✅`] },
        optionsRaw: [
          `${l} δευτερόλεπτα`,
          `${light1 + light2} δευτερόλεπτα`,
          `${l * 2} δευτερόλεπτα`,
          `${light1 * 2} δευτερόλεπτα`
        ],
        correctText: `${l} δευτερόλεπτα`,
        explanation: `Οι πινακίδες ανάβουν ταυτόχρονα σε χρόνο ίσο με το Ε.Κ.Π. των δύο περιόδων: Ε.Κ.Π.(${light1}, ${light2}) ＝ ${l} δευτερόλεπτα.`
      };
    }
  },
  {
    id: 'p_ekp_std_3',
    generate: () => {
      const doctorDays = 6;
      const nurseDays = 9;
      const l = lcmTwo(doctorDays, nurseDays);
      return {
        text: `Ένας γιατρός έχει εφημερία κάθε ${doctorDays} ημέρες και μια νοσηλεύτρια έχει εφημερία κάθε ${nurseDays} ημέρες. Αν εφημερεύουν μαζί σήμερα, μετά από πόσες ημέρες θα συμπέσει ξανά η εφημερία τους;`,
        tableData: { col1: 'Εφημερίες', col2: 'Συχνότητα', r1: [`Γιατρός: ${doctorDays} ημέρες`, `Νοσηλεύτρια: ${nurseDays} ημέρες`], r2: ['Υπολογισμός Ε.Κ.Π.', `Ε.Κ.Π.(${doctorDays}, ${nurseDays}) ＝ ${l} ημέρες ✅`] },
        optionsRaw: [
          `${l} ημέρες`,
          `${doctorDays + nurseDays} ημέρες`,
          `${l + 6} ημέρες`,
          `${l * 2} ημέρες`
        ],
        correctText: `${l} ημέρες`,
        explanation: `Η κοινή εφημερία θα συμβεί ξανά σε ημέρες που ισούνται με το Ε.Κ.Π. των δύο διαστημάτων: Ε.Κ.Π.(${doctorDays}, ${nurseDays}) ＝ ${l} ημέρες.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (MCQ): Ε.Κ.Π. δύο απλών αριθμών (Εγγύηση Μοναδικότητας)
  {
    const q1Pairs = [
      [4, 6], [6, 8], [3, 5], [6, 9], [8, 12], [5, 10], [4, 10], [9, 12]
    ];
    const q1Chosen = q1Pairs[randInt(0, q1Pairs.length - 1)];
    const q1CorrectVal = lcmArray(q1Chosen);
    const q1Correct = String(q1CorrectVal);
    const q1Wrong1 = String(q1Chosen[0] * q1Chosen[1]);
    const q1Wrong2 = String(q1CorrectVal * 2);
    const q1Wrong3 = String(Math.max(...q1Chosen) + 2);

    const rawOptions = [q1Correct, q1Wrong1, q1Wrong2, q1Wrong3];
    const options = shuffle([...new Set(rawOptions)]).slice(0, 4).map((text) => ({
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
      explanation: `Π(${q1Chosen[0]}): ${q1Chosen[0]}, ${q1Chosen[0] * 2}, ${q1Chosen[0] * 3}... και Π(${q1Chosen[1]}): ${q1Chosen[1]}, ${q1Chosen[1] * 2}... Το μικρότερο θετικό κοινό είναι το ${q1Correct}.`
    });
  }

  // Q2 (Input - Decimal): Ε.Κ.Π. δύο πρώτων μεταξύ τους αριθμών
  {
    const q2Pairs = [
      [3, 4], [5, 7], [4, 9], [7, 8], [5, 9], [3, 8], [5, 6]
    ];
    const q2Chosen = q2Pairs[randInt(0, q2Pairs.length - 1)];
    const q2CorrectVal = q2Chosen[0] * q2Chosen[1];

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ',
      instruction: 'Συμπληρώστε το Ε.Κ.Π. των αριθμών:',
      prompt: `Ποιο είναι το Ε.Κ.Π. των αριθμών ${q2Chosen[0]} και ${q2Chosen[1]};`,
      correctVal: q2CorrectVal,
      correctStr: String(q2CorrectVal),
      explanation: `Επειδή οι αριθμοί ${q2Chosen[0]} και ${q2Chosen[1]} δεν έχουν κοινό διαιρέτη εκτός του 1 (είναι πρώτοι μεταξύ τους), το Ε.Κ.Π. τους ισούται με το γινόμενό τους: ${q2Chosen[0]} · ${q2Chosen[1]} ＝ ${q2CorrectVal}.`
    });
  }

  // Q3 (MCQ): Ε.Κ.Π. τριών αριθμών (Εγγύηση Μοναδικότητας)
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

  // Q4 (MCQ): Εύρεση του 2ου κοινού πολλαπλασίου (2 · ΕΚΠ) (Εγγύηση Μοναδικότητας)
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
        ? 'Σωστό! Εξ ορισμού το Ε.Κ.Π. είναι το μικρότερο ΚΟΙΝΟ ΘΕΤΙΚΟ πολλαπλάσιο (διάφορο του μηδενός).'
        : 'Λάθος! Το 0 εξαιρείται από τον ορισμό του Ε.Κ.Π., διαφορετικά το Ε.Κ.Π. κάθε ομάδας αριθμών θα ήταν πάντα 0.'
    });
  }

  // Q7 (Input - Decimal): Ε.Κ.Π. τεσσάρων αριθμών
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
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • Ε.Κ.Π. ΤΕΣΣΑΡΩΝ ΑΡΙΘΜΩΝ',
      instruction: 'Υπολογίστε το Ε.Κ.Π.:',
      prompt: `Ποιο είναι το Ε.Κ.Π. των 4 αριθμών (${q7Chosen.nums.join(', ')});`,
      correctVal: q7Chosen.val,
      correctStr: String(q7Chosen.val),
      explanation: `Ε.Κ.Π.(${q7Chosen.nums.join(', ')}) ＝ ${q7Chosen.val}.`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας (Εγγύηση Μοναδικότητας)
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

  // Q9 & Q10: Προβλήματα από τη δεξαμενή EXTRA_PROBLEMS_POOL (MCQ)
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
      title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΧΡΟΝΙΣΜΟΣ ΔΡΟΜΟΛΟΓΙΩΝ',
      instruction: 'Επιλέξτε τον σωστό χρόνο ταυτόχρονης αναχώρησης:',
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
      title: 'ΕΡΩΤΗΣΗ 10 • ΠΕΡΙΟΔΙΚΟΤΗΤΑ ΣΥΜΒΑΝΤΩΝ',
      instruction: 'Επιλέξτε το σωστό διάστημα:',
      prompt: prob10.text,
      tableData: prob10.tableData,
      options: optionsQ10,
      correctText: prob10.correctText,
      explanation: prob10.explanation
    });
  }

  return qList;
}

export default function EkpExercisesPage() {
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
              Ασκήσεις &amp; Προβλήματα: Ε.Κ.Π.
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες υπολογισμού Ε.Κ.Π. για 2, 3 ή 4 αριθμούς, πρώτων μεταξύ τους αριθμών και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
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

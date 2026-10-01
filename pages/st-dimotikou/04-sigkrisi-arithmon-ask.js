// pages/st-dimotikou/04-sigkrisi-arithmon-ask.js
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

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 3) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Δεξαμενη Κανονικων Προβληματων Συγκρισης για την Ερωτηση 9 (Input)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_cmp_std_1',
    generate: () => {
      const w1 = 14.8;
      const w2 = 14.75;
      const diff = Number((w1 - w2).toFixed(2));
      return {
        title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΓΚΡΙΣΗ ΒΑΡΟΥΣ',
        instruction: 'Λύστε το πρόβλημα και συμπληρώστε τη διαφορά σε κιλά με κόμμα:',
        text: `Δύο δέματα ζυγίζουν ${formatNum(w1)} kg και ${formatNum(w2)} kg αντίστοιχα. Πόσα κιλά (kg) παραπάνω ζυγίζει το βαρύτερο δέμα;`,
        tableData: { col1: '1ο Δέμα', col2: '2ο Δέμα', r1: [`${formatNum(w1)} kg ＝ 14,80 kg`, `${formatNum(w2)} kg`], r2: ['Διαφορά', `${formatNum(diff, 2)} kg`] },
        correctVal: diff,
        correctStr: formatNum(diff, 2),
        unit: 'kg',
        explanation: `Εξισώνουμε τα δεκαδικά ψηφία: 14,80 ＞ 14,75. Το 1ο δέμα είναι βαρύτερο κατά: 14,80 － 14,75 ＝ ${formatNum(diff, 2)} kg.`
      };
    }
  },
  {
    id: 'p_cmp_std_2',
    generate: () => {
      const p1 = 2.4;
      const p2 = 2.05;
      const p3 = 2.45;
      const maxVal = Math.max(p1, p2, p3);
      return {
        title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΓΚΡΙΣΗ ΤΙΜΩΝ',
        instruction: 'Λύστε το πρόβλημα και συμπληρώστε την ακριβότερη τιμή σε ευρώ με κόμμα:',
        text: `Τρία όμοια προϊόντα πωλούνται σε τρία διαφορετικά καταστήματα προς ${formatNum(p1)} €, ${formatNum(p2)} € και ${formatNum(p3)} €. Ποια είναι η ακριβότερη τιμή σε ευρώ (€);`,
        tableData: { col1: 'Καταστήματα Α & Β', col2: 'Κατάστημα Γ', r1: [`${formatNum(p1)} €`, `${formatNum(p3)} €`], r2: [`${formatNum(p2)} €`, `Ακριβότερη: ${formatNum(maxVal, 2)} €`] },
        correctVal: maxVal,
        correctStr: formatNum(maxVal, 2),
        unit: '€',
        explanation: `Συγκρίνουμε τα δέκατα και τα εκατοστά: 2,45 ＞ 2,40 ＞ 2,05. Η ακριβότερη τιμή είναι ${formatNum(maxVal, 2)} €.`
      };
    }
  },
  {
    id: 'p_cmp_std_3',
    generate: () => {
      const km1 = 12.35;
      const km2 = 12.5;
      const diff = Number((km2 - km1).toFixed(2));
      return {
        title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΓΚΡΙΣΗ ΑΠΟΣΤΑΣΕΩΝ',
        instruction: 'Λύστε το πρόβλημα και συμπληρώστε τη διαφορά σε χιλιόμετρα με κόμμα:',
        text: `Δύο δρομείς κάλυψαν αποστάσεις ${formatNum(km1)} km και ${formatNum(km2)} km αντίστοιχα. Πόσα χιλιόμετρα (km) περισσότερα διένυσε ο δεύτερος δρομέας;`,
        tableData: { col1: '1ος Δρομέας', col2: '2ος Δρομέας', r1: [`${formatNum(km1)} km`, `${formatNum(km2)} km ＝ 12,50 km`], r2: ['Διαφορά', `${formatNum(diff, 2)} km`] },
        correctVal: diff,
        correctStr: formatNum(diff, 2),
        unit: 'km',
        explanation: `Συμπληρώνουμε μηδενικό στο τέλος: 12,50 － 12,35 ＝ ${formatNum(diff, 2)} km.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας για την Ερωτηση 10 (MCQ)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_cmp_hard_1',
    generate: () => {
      const lengths = [3.05, 3.5, 3.45, 3.005];
      const sorted = [...lengths].sort((a, b) => a - b);
      const minVal = sorted[0];
      const correctStr = `${formatNum(minVal, 3)} m`;
      const fake1 = `${formatNum(sorted[1], 2)} m`;
      const fake2 = `${formatNum(sorted[2], 2)} m`;
      const fake3 = `${formatNum(sorted[3], 1)} m`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΕΡΩΤΗΣΗ 10 • ΣΥΓΚΡΙΣΗ ΜΗΚΩΝ',
        instruction: 'Επιλέξτε το μήκος του κοντύτερου σύρματος:',
        text: `Τέσσερα κομμάτια σύρματος έχουν μήκη ${formatNum(lengths[0])} m, ${formatNum(lengths[1])} m, ${formatNum(lengths[2])} m και ${formatNum(lengths[3])} m. Ποιο είναι το μήκος του κοντύτερου σύρματος σε μέτρα (m);`,
        tableData: { col1: 'Τέσσερα Μήκη', col2: 'Εξίσωση σε χιλιοστά', r1: ['3,050 m / 3,500 m', '3,450 m / 3,005 m'], r2: ['Μικρότερο μήκος', `${formatNum(minVal, 3)} m`] },
        options,
        correctText: correctStr,
        explanation: `Εξισώνουμε σε 3 δεκαδικά ψηφία: 3,005 ＜ 3,050 ＜ 3,450 ＜ 3,500. Το κοντύτερο σύρμα έχει μήκος ${formatNum(minVal, 3)} m.`
      };
    }
  },
  {
    id: 'p_cmp_hard_2',
    generate: () => {
      const budget = 50;
      const b1 = 18.6;
      const b2 = 18.06;
      const maxVal = Math.max(b1, b2);
      const remain = Number((budget - maxVal).toFixed(2));
      const correctStr = `${formatNum(remain, 2)} €`;
      const fake1 = `${formatNum(remain + 1.5, 2)} €`;
      const fake2 = `${formatNum(Math.max(0.5, remain - 1.2), 2)} €`;
      const fake3 = `${formatNum(remain + 3.1, 2)} €`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΕΡΩΤΗΣΗ 10 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΣΥΝΑΛΛΑΓΗΣ',
        instruction: 'Επιλέξτε το σωστό ποσό ρέστων:',
        text: `Ένα βιβλίο κοστίζει ${formatNum(b1)} € σε ένα βιβλιοπωλείο και ${formatNum(b2)} € σε ένα άλλο. Αν κάποιος αγοράσει το ακριβότερο και πληρώσει με χαρτονόμισμα των 50 €, πόσα ρέστα (€) θα πάρει;`,
        tableData: { col1: 'Τιμές Βιβλίου', col2: 'Χαρτονόμισμα 50 €', r1: [`${formatNum(b1)} € (18,60 €)`, `${formatNum(b2)} €`], r2: ['Ακριβότερο: 18,60 €', `Ρέστα: ${formatNum(remain, 2)} €`] },
        options,
        correctText: correctStr,
        explanation: `18,60 ＞ 18,06, άρα το ακριβότερο κοστίζει 18,60 €. Ρέστα από 50 €: 50,00 － 18,60 ＝ ${formatNum(remain, 2)} €.`
      };
    }
  },
  {
    id: 'p_cmp_hard_3',
    generate: () => {
      const weights = [2.45, 2.5, 2.055, 2.405];
      const sorted = [...weights].sort((a, b) => b - a);
      const maxVal = sorted[0];
      const correctStr = `${formatNum(maxVal, 2)} kg`;
      const fake1 = `${formatNum(sorted[1], 2)} kg`;
      const fake2 = `${formatNum(sorted[2], 3)} kg`;
      const fake3 = `${formatNum(sorted[3], 3)} kg`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΕΡΩΤΗΣΗ 10 • ΣΥΓΚΡΙΣΗ ΒΑΡΟΥΣ ΔΕΜΑΤΩΝ',
        instruction: 'Επιλέξτε το βάρος του βαρύτερου δέματος:',
        text: `Τέσσερα δέματα έχουν βάρη ${formatNum(weights[0])} kg, ${formatNum(weights[1])} kg, ${formatNum(weights[2])} kg και ${formatNum(weights[3])} kg. Ποιο είναι το βάρος του βαρύτερου δέματος σε κιλά (kg);`,
        tableData: { col1: 'Τέσσερα Βάρη', col2: 'Εξίσωση σε χιλιοστά', r1: ['2,450 kg / 2,500 kg', '2,055 kg / 2,405 kg'], r2: ['Βαρύτερο δέμα', `${formatNum(maxVal, 2)} kg`] },
        options,
        correctText: correctStr,
        explanation: `Εξισώνουμε σε 3 δεκαδικά ψηφία: 2,500 ＞ 2,450 ＞ 2,405 ＞ 2,055. Το βαρύτερο δέμα είναι αυτό με ${formatNum(maxVal, 2)} kg.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (MCQ): Σύμβολο Σύγκρισης Δεκαδικών (Παγίδα δεκάτων vs εκατοστών)
  {
    const q1Int = randInt(12, 45);
    const q1A = `${q1Int},8`;
    const q1B = `${q1Int},75`;
    const q1Correct = '＞';

    const rawOptions = ['＞', '＜', '＝'];
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === q1Correct
    }));

    qList.push({
      id: 1,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 1 • ΣΥΜΒΟΛΟ ΣΥΓΚΡΙΣΗΣ ΔΕΚΑΔΙΚΩΝ',
      instruction: 'Επιλέξτε το κατάλληλο σύμβολο σύγκρισης (＞, ＜, ＝):',
      prompt: `Ποιο σύμβολο συνδέει σωστά τους αριθμούς: ${q1A} ___ ${q1B};`,
      options,
      correctText: q1Correct,
      explanation: `Εξισώνουμε τα δεκαδικά ψηφία: ${q1A}0 (${q1Int},80) έναντι ${q1B}. Επειδή 80 εκατοστά ＞ 75 εκατοστά, ισχύει ${q1A} ＞ ${q1B}.`
    });
  }

  // Q2 (MCQ): Σύμβολο Σύγκρισης - Ισοδύναμοι Δεκαδικοί με Μηδενικά
  {
    const q2Int = randInt(3, 19);
    const q2Dec = randInt(2, 8);
    const q2A = `${q2Int},${q2Dec}0`;
    const q2B = `${q2Int},${q2Dec}`;
    const q2Correct = '＝';

    const rawOptions = ['＞', '＜', '＝'];
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === q2Correct
    }));

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΙΣΟΔΥΝΑΜΟΙ ΔΕΚΑΔΙΚΟΙ',
      instruction: 'Επιλέξτε το κατάλληλο σύμβολο σύγκρισης (＞, ＜, ＝):',
      prompt: `Ποιο σύμβολο συνδέει σωστά τους αριθμούς: ${q2A} ___ ${q2B};`,
      options,
      correctText: q2Correct,
      explanation: `Τα μηδενικά στο τέλος του δεκαδικού μέρους δεν αλλάζουν την αξία του αριθμού. Άρα ${q2A} ＝ ${q2B}.`
    });
  }

  // Q3 (Input - Decimal): Εύρεση του μεγαλύτερου αριθμού από λίστα
  {
    const q3Base = randInt(5, 25);
    const q3List = [
      { text: `${q3Base},65`, val: q3Base + 0.65 },
      { text: `${q3Base},7`, val: q3Base + 0.7 },
      { text: `${q3Base},095`, val: q3Base + 0.095 },
      { text: `${q3Base},608`, val: q3Base + 0.608 }
    ];
    const q3Sorted = [...q3List].sort((a, b) => b.val - a.val);
    const q3CorrectAnswer = q3Sorted[0].text;
    const q3CorrectVal = q3Sorted[0].val;
    const q3DisplayList = shuffle(q3List.map((o) => o.text)).join('  •  ');

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΕΥΡΕΣΗ ΜΕΓΑΛΥΤΕΡΟΥ ΑΡΙΘΜΟΥ',
      instruction: 'Γράψτε τον μεγαλύτερο αριθμό με κόμμα:',
      prompt: `Ποιος είναι ο μεγαλύτερος αριθμός ανάμεσα στους: ${q3DisplayList};`,
      correctVal: q3CorrectVal,
      correctStr: q3CorrectAnswer,
      explanation: `Συγκρίνοντας τα δέκατα: το ${q3CorrectAnswer} έχει 7 δέκατα (0,700), ενώ οι υπόλοιποι έχουν 6 ή 0 δέκατα. Άρα ο μεγαλύτερος είναι το ${q3CorrectAnswer}.`
    });
  }

  // Q4 (MCQ): Αύξουσα Διάταξη (Εγγύηση Μοναδικότητας Επιλογών)
  {
    const q4Base = randInt(2, 8);
    const q4A = `${q4Base},04`;
    const q4B = `${q4Base},4`;
    const q4C = `${q4Base},44`;
    const q4CorrectOrder = `${q4A} ＜ ${q4B} ＜ ${q4C}`;
    const q4Wrong1 = `${q4B} ＜ ${q4A} ＜ ${q4C}`;
    const q4Wrong2 = `${q4C} ＜ ${q4B} ＜ ${q4A}`;
    const q4Wrong3 = `${q4A} ＜ ${q4C} ＜ ${q4B}`;

    const rawOptions = [q4CorrectOrder, q4Wrong1, q4Wrong2, q4Wrong3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q4CorrectOrder
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΑΥΞΟΥΣΑ ΔΙΑΤΑΞΗ',
      instruction: 'Επιλέξτε τη σωστή διάταξη από τον μικρότερο στον μεγαλύτερο:',
      prompt: `Ποια είναι η σωστή αύξουσα σειρά των αριθμών: ${q4B} , ${q4A} , ${q4C};`,
      options,
      correctText: q4CorrectOrder,
      explanation: `Εξισώνοντας τα ψηφία: ${q4Base},04 (4 εκατοστά) ＜ ${q4Base},40 (40 εκατοστά) ＜ ${q4Base},44 (44 εκατοστά). Άρα η σωστή σειρά είναι: ${q4CorrectOrder}.`
    });
  }

  // Q5 (MCQ): True / False - Σύγκριση Φυσικών με διαφορετικό πλήθος ψηφίων
  {
    const q5Small = randInt(8500, 9999);
    const q5Big = randInt(10200, 14500);
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? `Ο φυσικός αριθμός ${formatNum(q5Big)} (5 ψηφία) είναι μεγαλύτερος από τον ${formatNum(q5Small)} (4 ψηφία).`
      : `Ο φυσικός αριθμός ${formatNum(q5Small)} είναι μεγαλύτερος από τον ${formatNum(q5Big)} επειδή ξεκινάει από το 9.`;
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΠΛΗΘΟΣ ΨΗΦΙΩΝ ΣΕ ΦΥΣΙΚΟΥΣ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? `Σωστό! Ο αριθμός ${formatNum(q5Big)} έχει 5 ψηφία (Δεκάδες Χιλιάδων), ενώ ο ${formatNum(q5Small)} έχει 4 ψηφία (Μονάδες Χιλιάδων).`
        : `Λάθος! Στους φυσικούς αριθμούς, μεγαλύτερος είναι πάντοτε εκείνος με τα περισσότερα ψηφία (${formatNum(q5Big)} ＞ ${formatNum(q5Small)}).`
    });
  }

  // Q6 (MCQ): True / False - Κανόνας Σύγκρισης Δεκαδικών
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Για να συγκρίνουμε δύο δεκαδικούς αριθμούς με ίσα ακέραια μέρη, συγκρίνουμε πρώτα τα δέκατα και μετά τα εκατοστά.'
      : 'Ο αριθμός 0,79 είναι μεγαλύτερος από τον 0,8 επειδή το 79 είναι μεγαλύτερο από το 8.';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΣΥΓΚΡΙΣΗΣ ΔΕΚΑΔΙΚΩΝ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Συγκρίνουμε διαδοχικά από τα αριστερά προς τα δεξιά (πρώτα δέκατα, μετά εκατοστά, μετά χιλιοστά).'
        : 'Λάθος! 0,8 ＝ 0,80 (80 εκατοστά), το οποίο είναι μεγαλύτερο από το 0,79 (79 εκατοστά).'
    });
  }

  // Q7 (MCQ): Οπτική Ζυγαριά Σύγκρισης (Εγγύηση Μοναδικότητας)
  {
    const q7Int = randInt(2, 9);
    const q7Left = `${q7Int},35`;
    const q7Right = `${q7Int},4`;
    const q7Correct = q7Right;

    const rawOptions = [q7Left, q7Right, 'Είναι ίσα'];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q7Correct
    }));

    qList.push({
      id: 7,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΖΥΓΑΡΙΑ ΣΥΓΚΡΙΣΗΣ',
      instruction: 'Επιλέξτε τον βαρύτερο αριθμό:',
      prompt: `Αν τοποθετήσουμε στη ζυγαριά τους αριθμούς ${q7Left} και ${q7Right}, ποιος αριθμός είναι ο μεγαλύτερος (βαρύτερος);`,
      options,
      correctText: q7Correct,
      explanation: `Συγκρίνοντας τα δέκατα: ${q7Right} ＝ ${q7Int},40 ＞ ${q7Left}. Επομένως, ο βαρύτερος αριθμός είναι το ${q7Right}.`
    });
  }

  // Q8 (MCQ): Δεκαδική Αριθμογραμμή & Θέση (Εγγύηση Μοναδικότητας)
  {
    const q8Int = randInt(5, 12);
    const q8StepA = randInt(2, 4);
    const q8StepB = randInt(6, 9);
    const q8ValA = `${q8Int},${q8StepA}`;
    const q8ValB = `${q8Int},${q8StepB}`;
    const q8Correct = q8ValB;

    const rawOptions = [q8ValA, q8ValB, 'Είναι στην ίδια θέση'];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8Correct
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΔΕΚΑΔΙΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ',
      instruction: 'Επιλέξτε τον αριθμό που βρίσκεται πιο δεξιά:',
      prompt: `Στην αριθμογραμμή ανάμεσα στους αριθμούς ${q8ValA} και ${q8ValB}, ποιος βρίσκεται πιο δεξιά (είναι μεγαλύτερος);`,
      options,
      correctText: q8Correct,
      explanation: `Στην αριθμογραμμή, μεγαλύτερος είναι ο αριθμός που βρίσκεται πιο δεξιά. Επειδή ${q8ValB} ＞ ${q8ValA}, το ${q8ValB} βρίσκεται πιο δεξιά.`
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές (1 Input, 1 MCQ)
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate();
    const hardProb = shuffledHard[0].generate();

    // Q9 (Input - Decimal) - Χωρίς πίνακα στην εκφώνηση
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: stdProb.title,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      correctVal: stdProb.correctVal,
      correctStr: stdProb.correctStr,
      explanation: stdProb.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας) - Πλήρως ευθυγραμμισμένες μονάδες μέτρησης και τίτλος
    qList.push({
      id: 10,
      type: 'mcq',
      title: hardProb.title,
      instruction: hardProb.instruction,
      prompt: hardProb.text,
      tableData: hardProb.tableData,
      options: hardProb.options,
      correctText: hardProb.correctText,
      explanation: hardProb.explanation
    });
  }

  return qList;
}

export default function SigkrisiExercisesPage() {
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
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμος Input με καθαρισμο χαρακτηρων (μονο 0-9 και ενα κομμα, οριο 10 χαρακτηρων)
  const handleInputChange = (fieldKey, rawValue) => {
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
      [fieldKey]: sanitized
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
  const handleCheckAnswers = () => {
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
      title="Ασκήσεις: Σύγκριση & Διάταξη Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στη σύγκριση και διάταξη φυσικών και δεκαδικών αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/04-sigkrisi-arithmon"
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
              Ασκήσεις &amp; Προβλήματα: Σύγκριση &amp; Διάταξη
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες σύγκρισης φυσικών και δεκαδικών αριθμών, διατάξεων σε αύξουσα σειρά, οπτικών μοντέλων και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
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
          {questions.map((q, idx) => {
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
                key={`q-${q.id}-${idx}`}
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

                {/* Εκφωνηση (Καθαρο κειμενο χωρις πινακα που προδιδει τη λυση) */}
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
                        inputMode="decimal"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500">
                        (Ακέραιος η δεκαδικός με κόμμα)
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

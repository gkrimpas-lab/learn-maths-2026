// pages/st-dimotikou/29-pollaplasiasmos-klasmaton-ask.js
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

function findGCD(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
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

// Μορφοποίηση αριθμών με ελληνικό locale
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    title: 'Μέρος ενός Μέρους (Πίτσα)',
    unit: 'της πίτσας',
    generate: () => {
      // 1/2 · 3/4 = 3/8
      const n1 = 1;
      const d1 = 2;
      const n2 = 3;
      const d2 = 4;
      const resN = 3;
      const resD = 8;
      return {
        prompt: `Στο ψυγείο υπήρχαν τα ${n2}/${d2} μιας πίτσας. Ο Νίκος έφαγε το ${n1}/${d1} από αυτό το υπόλοιπο. Ποιο μέρος ολόκληρης της πίτσας έφαγε ο Νίκος;`,
        unit: '',
        correctVal: `${resN}/${resD}`,
        correctText: `${resN}/${resD}`,
        tableData: [
          { item: 'Υπόλοιπο πίτσας', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: 'Μέρος που καταναλώθηκε', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: 'Πολλαπλασιασμός', formula: `(${n1} · ${n2}) / (${d1} · ${d2})`, val: `${resN}/${resD}` }
        ],
        explain: `Το μέρος ενός μέρους υπολογίζεται με πολλαπλασιασμό: (${n1}/${d1}) · (${n2}/${d2}) ＝ (${n1} · ${n2}) / (${d1} · ${d2}) ＝ ${resN}/${resD}.`,
        distractors: ['4/6', '2/6', '3/6']
      };
    }
  },
  {
    id: 'sp2',
    title: 'Φύτευση Οικοπέδου',
    unit: 'του οικοπέδου',
    generate: () => {
      // 2/3 · 3/5 = 6/15 = 2/5
      const n1 = 2;
      const d1 = 3;
      const n2 = 3;
      const d2 = 5;
      return {
        prompt: `Ένας κηπουρός καθάρισε τα ${n1}/${d1} ενός οικοπέδου και από αυτά φύτεψε με γκαζόν τα ${n2}/${d2}. Ποιο μέρος του οικοπέδου φυτεύτηκε με γκαζόν;`,
        unit: '',
        correctVal: '2/5',
        correctText: '2/5 (ή 6/15)',
        tableData: [
          { item: 'Καθαρισμένο μέρος', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: 'Φυτεμένο μέρος', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: 'Γινόμενο & Απλοποίηση', formula: '(2 · 3) / (3 · 5) ＝ 6/15 (: 3)', val: '2/5' }
        ],
        explain: `Πολλαπλασιάζουμε τα δύο κλάσματα: (${n1}/${d1}) · (${n2}/${d2}) ＝ 6/15. Απλοποιώντας με το 3 έχουμε 2/5 του οικοπέδου.`,
        distractors: ['5/8', '1/5', '3/5']
      };
    }
  },
  {
    id: 'sp3',
    title: 'Κατανάλωση Χυμού',
    unit: 'της κανάτας',
    generate: () => {
      // 3/4 · 2/5 = 6/20 = 3/10
      const n1 = 3;
      const d1 = 4;
      const n2 = 2;
      const d2 = 5;
      return {
        prompt: `Μία κανάτα περιείχε τα ${n1}/${d1} χυμού. Τα παιδιά ήπιαν τα ${n2}/${d2} από αυτόν τον χυμό. Ποιο μέρος της κανάτας ήπιαν συνολικά;`,
        unit: '',
        correctVal: '3/10',
        correctText: '3/10 (ή 6/20)',
        tableData: [
          { item: 'Αρχικός χυμός', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: 'Μέρος που ήπιαν', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: 'Γινόμενο & Απλοποίηση', formula: '(3 · 2) / (4 · 5) ＝ 6/20 (: 2)', val: '3/10' }
        ],
        explain: `Πολλαπλασιάζουμε: (${n1}/${d1}) · (${n2}/${d2}) ＝ 6/20 ＝ 3/10 της κανάτας.`,
        distractors: ['5/9', '1/10', '6/9']
      };
    }
  },
  {
    id: 'sp4',
    title: 'Χρήση Υφάσματος',
    unit: 'του ρολού',
    generate: () => {
      // 1/3 · 3/4 = 3/12 = 1/4
      const n1 = 1;
      const d1 = 3;
      const n2 = 3;
      const d2 = 4;
      return {
        prompt: `Μια μοδίστρα αγόρασε τα ${n2}/${d2} ενός ρολού υφάσματος και από αυτά χρησιμοποίησε το ${n1}/${d1} για μια μπλούζα. Ποιο μέρος του αρχικού ρολού χρησιμοποίησε;`,
        unit: '',
        correctVal: '1/4',
        correctText: '1/4 (ή 3/12)',
        tableData: [
          { item: 'Ύφασμα που αγοράστηκε', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: 'Μέρος για μπλούζα', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: 'Γινόμενο & Απλοποίηση', formula: '(1 · 3) / (3 · 4) ＝ 3/12 (: 3)', val: '1/4' }
        ],
        explain: `Υπολογίζουμε: (1/3) · (3/4) ＝ 3/12 ＝ 1/4 του ρολού.`,
        distractors: ['4/7', '2/4', '3/7']
      };
    }
  },
  {
    id: 'sp5',
    title: 'Σχέδιο Ζωγραφικής',
    unit: 'του σχεδίου',
    generate: () => {
      // 2/3 · 1/4 = 2/12 = 1/6
      const n1 = 2;
      const d1 = 3;
      const n2 = 1;
      const d2 = 4;
      return {
        prompt: `Η Μαρία σχεδίασε τα ${n1}/${d1} ενός πίνακα και από αυτά χρωμάτισε με μπλε το ${n2}/${d2}. Ποιο μέρος ολόκληρου του πίνακα είναι χρωματισμένο με μπλε;`,
        unit: '',
        correctVal: '1/6',
        correctText: '1/6 (ή 2/12)',
        tableData: [
          { item: 'Σχεδιασμένο μέρος', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: 'Μπλε χρώμα', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: 'Γινόμενο & Απλοποίηση', formula: '(2 · 1) / (3 · 4) ＝ 2/12 (: 2)', val: '1/6' }
        ],
        explain: `Πολλαπλασιάζουμε: (2/3) · (1/4) ＝ 2/12 ＝ 1/6 του πίνακα.`,
        distractors: ['3/7', '2/7', '1/12']
      };
    }
  },
  {
    id: 'sp6',
    title: 'Απόσταση Διαδρομής',
    unit: 'της διαδρομής',
    generate: () => {
      // 4/5 · 1/2 = 4/10 = 2/5
      const n1 = 4;
      const d1 = 5;
      const n2 = 1;
      const d2 = 2;
      return {
        prompt: `Ένας αθλητής προγραμμάτισε να τρέξει τα ${n1}/${d1} μιας διαδρομής, αλλά τελικά κατάφερε να καλύψει το ${n2}/${d2} αυτού του στόχου. Ποιο μέρος της συνολικής διαδρομής κάλυψε;`,
        unit: '',
        correctVal: '2/5',
        correctText: '2/5 (ή 4/10)',
        tableData: [
          { item: 'Στόχος διαδρομής', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: 'Επίτευξη στόχου', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: 'Γινόμενο & Απλοποίηση', formula: '(4 · 1) / (5 · 2) ＝ 4/10 (: 2)', val: '2/5' }
        ],
        explain: `Υπολογίζουμε: (4/5) · (1/2) ＝ 4/10 ＝ 2/5 της διαδρομής.`,
        distractors: ['5/7', '1/5', '4/7']
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Εμβαδόν Ορθογωνίου με Κλασματικές Πλευρές',
    unit: 'τ.μ.',
    generate: () => {
      // 3/4 m x 2/5 m = 6/20 m² = 3/10 m²
      const n1 = 3;
      const d1 = 4;
      const n2 = 2;
      const d2 = 5;
      return {
        prompt: `Ένα ορθογώνιο πλακίδιο έχει μήκος ${n1}/${d1} του μέτρου και πλάτος ${n2}/${d2} του μέτρου. Ποιο είναι το εμβαδόν του σε τετραγωνικά μέτρα;`,
        unit: 'τ.μ.',
        correctVal: '3/10',
        correctText: '3/10 τ.μ. (ή 6/20 τ.μ.)',
        tableData: [
          { item: 'Μήκος (α)', formula: `${n1}/${d1} μ.`, val: `${n1}/${d1}` },
          { item: 'Πλάτος (β)', formula: `${n2}/${d2} μ.`, val: `${n2}/${d2}` },
          { item: 'Εμβαδόν (Ε ＝ α · β)', formula: '(3 · 2) / (4 · 5) ＝ 6/20 (: 2)', val: '3/10 τ.μ.' }
        ],
        explain: `Το εμβαδόν ορθογωνίου ισούται με μήκος επί πλάτος: (${n1}/${d1}) · (${n2}/${d2}) ＝ 6/20 ＝ 3/10 τ.μ.`,
        distractors: ['5/9 τ.μ.', '6/9 τ.μ.', '1/10 τ.μ.']
      };
    }
  },
  {
    id: 'hp2',
    title: 'Πολλαπλασιασμός Τριών Κλασμάτων',
    unit: '',
    generate: () => {
      // 1/2 · 2/3 · 3/4 = 6/24 = 1/4
      return {
        prompt: 'Υπολόγισε το γινόμενο των τριών κλασμάτων: (1/2) · (2/3) · (3/4):',
        unit: '',
        correctVal: '1/4',
        correctText: '1/4 (ή 6/24)',
        tableData: [
          { item: 'Αριθμητές', formula: '1 · 2 · 3', val: '6' },
          { item: 'Παρονομαστές', formula: '2 · 3 · 4', val: '24' },
          { item: 'Απλοποίηση', formula: '6/24 (: 6)', val: '1/4' }
        ],
        explain: `Πολλαπλασιάζουμε όλους τους αριθμητές μαζί και όλους τους παρονομαστές μαζί: (1 · 2 · 3) / (2 · 3 · 4) ＝ 6/24 ＝ 1/4.`,
        distractors: ['6/9', '1/2', '3/8']
      };
    }
  },
  {
    id: 'hp3',
    title: 'Υπολογισμός Κλασματικού Μέρους Χρημάτων',
    unit: '€',
    generate: () => {
      // Τα 3/4 από 60 € = 45 €
      const whole = 60;
      const num = 3;
      const den = 4;
      const res = (whole * num) / den;
      return {
        prompt: `Ένα βιβλίο κοστίζει ${whole} €. Αν έχουμε συγκεντρώσει τα ${num}/${den} της αξίας του, πόσα ευρώ έχουμε συγκεντρώσει;`,
        unit: '€',
        correctVal: String(res),
        correctText: `${res} €`,
        tableData: [
          { item: 'Συνολικό ποσό', formula: `${whole} €`, val: `${whole}` },
          { item: 'Κλάσμα αξίας', formula: `${num}/${den}`, val: `${num}/${den}` },
          { item: 'Υπολογισμός', formula: `(${whole} · ${num}) / ${den} ＝ 180 / 4`, val: `${res} €` }
        ],
        explain: `Πολλαπλασιάζουμε τον ακέραιο με το κλάσμα: ${whole} · (3/4) ＝ (60 · 3) / 4 ＝ 180 / 4 ＝ ${res} €.`,
        distractors: [`${res - 5} €`, `${res + 5} €`, '40 €']
      };
    }
  },
  {
    id: 'hp4',
    title: 'Γινόμενο Καταχρηστικών Κλασμάτων',
    unit: '',
    generate: () => {
      // 4/3 · 3/2 = 12/6 = 2
      const n1 = 4;
      const d1 = 3;
      const n2 = 3;
      const d2 = 2;
      return {
        prompt: `Υπολόγισε το γινόμενο των καταχρηστικών κλασμάτων: (${n1}/${d1}) · (${n2}/${d2}):`,
        unit: '',
        correctVal: '2',
        correctText: '2 (ή 12/6)',
        tableData: [
          { item: 'Αριθμητές', formula: `${n1} · ${n2}`, val: '12' },
          { item: 'Παρονομαστές', formula: `${d1} · ${d2}`, val: '6' },
          { item: 'Διαίρεση / Ακέραιος', formula: '12 : 6', val: '2' }
        ],
        explain: `Πολλαπλασιάζουμε αριθμητές και παρονομαστές: (4 · 3) / (3 · 2) ＝ 12/6. Η γραμμή κλάσματος σημαίνει διαίρεση: 12 : 6 ＝ 2.`,
        distractors: ['7/5', '1', '12/5']
      };
    }
  },
  {
    id: 'hp5',
    title: 'Αντίστροφος Μικτού Αριθμού',
    unit: '',
    generate: () => {
      // 1 και 1/2 = 3/2 -> αντίστροφος = 2/3
      return {
        prompt: 'Ποιος είναι ο αντίστροφος αριθμός της ποσότητας 1 και 1/2 (δηλαδή του κλάσματος 3/2);',
        unit: '',
        correctVal: '2/3',
        correctText: '2/3',
        tableData: [
          { item: 'Κλασματική μορφή', formula: '1 ＋ 1/2 ＝ 2/2 ＋ 1/2', val: '3/2' },
          { item: 'Αντίστροφος αριθμός', formula: 'Αντιστροφή όρων', val: '2/3' },
          { item: 'Επαλήθευση', formula: '(3/2) · (2/3)', val: '6/6 ＝ 1' }
        ],
        explain: 'Γράφουμε πρώτα την ποσότητα ως κλάσμα: 1 και 1/2 ＝ 3/2. Ο αντίστροφος προκύπτει αντιστρέφοντας τους όρους: 2/3.',
        distractors: ['3/2', '1/2', '1/3']
      };
    }
  },
  {
    id: 'hp6',
    title: 'Σύνθετο Πρόβλημα Καθημερινότητας (Βάρος)',
    unit: 'κιλά',
    generate: () => {
      // 3/4 του κιλού ανά συσκευασία, αγοράσαμε 8 συσκευασίες -> 8 * 3/4 = 24/4 = 6 κιλά
      const packs = 8;
      const num = 3;
      const den = 4;
      const total = (packs * num) / den;
      return {
        prompt: `Ένα κατάστημα πουλάει πακέτα καφέ που ζυγίζουν ${num}/${den} του κιλού το καθένα. Αν αγοράσουμε ${packs} τέτοια πακέτα, πόσα ολόκληρα κιλά καφέ αγοράσαμε συνολικά;`,
        unit: 'κιλά',
        correctVal: String(total),
        correctText: `${total} κιλά (24/4)`,
        tableData: [
          { item: 'Βάρος ανά πακέτο', formula: `${num}/${den} κιλά`, val: `${num}/${den}` },
          { item: 'Πλήθος πακέτων', formula: `${packs}`, val: `${packs}` },
          { item: 'Συνολικό βάρος', formula: `(${packs} · ${num}) / ${den} ＝ 24 / 4`, val: `${total} κιλά` }
        ],
        explain: `Πολλαπλασιάζουμε τον ακέραιο με τον αριθμητή: ${packs} · (3/4) ＝ (8 · 3) / 4 ＝ 24/4 ＝ ${total} ολόκληρα κιλά.`,
        distractors: [`${total + 2} κιλά`, `${total - 2} κιλά`, '7 κιλά']
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Κλάσμα επί Κλάσμα
  const q1Num1 = randInt(1, 4);
  const q1Den1 = randInt(q1Num1 + 1, 6);
  const q1Num2 = randInt(1, 4);
  const q1Den2 = randInt(q1Num2 + 1, 6);
  const q1ProdN = q1Num1 * q1Num2;
  const q1ProdD = q1Den1 * q1Den2;
  const q1G = findGCD(q1ProdN, q1ProdD);
  const q1CorrectRaw = `${q1ProdN}/${q1ProdD}`;
  const q1CorrectSimp = `${q1ProdN / q1G}/${q1ProdD / q1G}`;

  // Q2: Input - Ακέραιος επί Κλάσμα
  const q2Whole = randInt(2, 5);
  const q2Num = randInt(1, 3);
  const q2Den = randInt(q2Num + 1, 8);
  const q2ProdN = q2Whole * q2Num;
  const q2ProdD = q2Den;
  const q2G = findGCD(q2ProdN, q2ProdD);
  const q2CorrectRaw = `${q2ProdN}/${q2ProdD}`;
  const q2CorrectSimp = `${q2ProdN / q2G}/${q2ProdD / q2G}`;

  // Q3: MCQ - Εύρεση Αντίστροφου Κλάσματος (γινόμενο = 1)
  const q3Num = randInt(2, 7);
  let q3Den = randInt(2, 8);
  while (q3Num === q3Den) q3Den++;
  const q3CorrectStr = `${q3Den}/${q3Num}`;
  const q3Wrongs = [
    `${q3Num}/${q3Den + 1}`,
    `${q3Den + 1}/${q3Num}`,
    `${q3Num + 1}/${q3Den}`
  ].filter(w => w !== q3CorrectStr);
  const q3Options = shuffle([...new Set([q3CorrectStr, ...q3Wrongs])]).slice(0, 4);

  // Q4: MCQ - Ποιο γινόμενο ισούται με 1 (Αντίστροφοι Αριθμοί)
  const q4N = randInt(3, 7);
  const q4D = randInt(2, 6);
  const q4CorrectProd = `(${q4N}/${q4D}) · (${q4D}/${q4N})`;
  const q4WrongsProd = [
    `(${q4N}/${q4D}) · (${q4N}/${q4D})`,
    `(${q4N}/${q4D}) · (${q4N - 1}/${q4D})`,
    `(${q4N}/${q4D}) · (${q4D + 1}/${q4N})`
  ];
  const q4Options = shuffle([...new Set([q4CorrectProd, ...q4WrongsProd])]);

  // Q5: True/False - Κανόνας ομωνύμων στον πολλαπλασιασμό
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στον πολλαπλασιασμό κλασμάτων ΔΕΝ χρειάζεται να κάνουμε τα κλάσματα ομώνυμα.'
    : 'Στον πολλαπλασιασμό κλασμάτων πρέπει πρώτα υποχρεωτικά να τα κάνουμε ομώνυμα βρίσκοντας το Ε.Κ.Π.';

  // Q6: True/False - Γινόμενο γνήσιων κλασμάτων
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Το γινόμενο δύο γνήσιων κλασμάτων (αριθμητής ＜ παρονομαστή) είναι πάντοτε μικρότερο και από τα δύο αρχικά κλάσματα.'
    : 'Το γινόμενο δύο γνήσιων κλασμάτων είναι πάντοτε μεγαλύτερο από τα αρχικά κλάσματα.';

  // Q7: Input - Εύρεση άγνωστου αριθμητή σε πολλαπλασιασμό
  const q7N1 = randInt(2, 4);
  const q7D1 = randInt(3, 5);
  const q7N2 = randInt(2, 4);
  const q7D2 = randInt(4, 6);
  const q7TargetN = q7N1 * q7N2;
  const q7TargetD = q7D1 * q7D2;
  const q7Correct = String(q7N2);

  // Q8: MCQ - Πράξη ακεραίου με κλάσμα
  const q8W = randInt(3, 5);
  const q8N = 2;
  const q8D = 7;
  const q8Res = `${q8W * q8N}/${q8D}`;
  const q8Wrongs = [`${q8W * q8N}/${q8W * q8D}`, `${q8W + q8N}/${q8D}`, `${q8W * q8N}/${q8D + 1}`];
  const q8Options = shuffle([...new Set([q8Res, ...q8Wrongs])]);

  // Q9: Standard Problem (Pool of 6)
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate();
  const q9Options = shuffle([
    ...new Set([q9Raw.correctText, ...q9Raw.distractors])
  ]);

  // Q10: Hard Problem (Pool of 6)
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate();
  const q10Options = shuffle([
    ...new Set([q10Raw.correctText, ...q10Raw.distractors])
  ]);

  return [
    {
      id: 'q1',
      type: 'input',
      title: 'Κλάσμα επί Κλάσμα',
      prompt: `Υπολόγισε το γινόμενο: (${q1Num1}/${q1Den1}) · (${q1Num2}/${q1Den2}) (π.χ. 6/20):`,
      correct: q1CorrectRaw,
      altCorrect: q1CorrectSimp,
      explain: `(${q1Num1}/${q1Den1}) · (${q1Num2}/${q1Den2}) ＝ (${q1Num1} · ${q1Num2})/(${q1Den1} · ${q1Den2}) ＝ ${q1CorrectRaw}${q1G > 1 ? ` (ή απλοποιημένο: ${q1CorrectSimp})` : ''}.`
    },
    {
      id: 'q2',
      type: 'input',
      title: 'Ακέραιος επί Κλάσμα',
      prompt: `Υπολόγισε το γινόμενο: ${q2Whole} · (${q2Num}/${q2Den}) (π.χ. 6/7):`,
      correct: q2CorrectRaw,
      altCorrect: q2CorrectSimp,
      explain: `${q2Whole} · (${q2Num}/${q2Den}) ＝ (${q2Whole} · ${q2Num})/${q2Den} ＝ ${q2CorrectRaw}${q2G > 1 ? ` ＝ ${q2CorrectSimp}` : ''}.`
    },
    {
      id: 'q3',
      type: 'mcq',
      title: 'Αντίστροφο Κλάσμα',
      prompt: `Ποιος είναι ο αντίστροφος αριθμός του κλάσματος ${q3Num}/${q3Den};`,
      options: q3Options,
      correct: q3CorrectStr,
      explain: `Αντιστρέφουμε τους όρους του κλάσματος: ο αριθμητής γίνεται παρονομαστής και ο παρονομαστής αριθμητής, άρα είναι το ${q3CorrectStr}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Γινόμενο Αντίστροφων',
      prompt: 'Ποιο από τα παρακάτω γινόμενα ισούται ακριβώς με το 1;',
      options: q4Options,
      correct: q4CorrectProd,
      explain: `Το γινόμενο δύο αντίστροφων αριθμών ισούται πάντοτε με 1: (${q4N}/${q4D}) · (${q4D}/${q4N}) ＝ 1.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Κανόνας Πολλαπλασιασμού',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Στον πολλαπλασιασμό πολλαπλασιάζουμε απευθείας αριθμητές και παρονομαστές χωρίς να χρειάζεται Ε.Κ.Π.'
        : 'Λάθος! Στον πολλαπλασιασμό ΔΕΝ χρειάζεται ποτέ να κάνουμε τα κλάσματα ομώνυμα.'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Ιδιότητα Γνήσιων Κλασμάτων',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Παίρνουμε μέρος ενός μέρους, επομένως το αποτέλεσμα είναι μικρότερο και από τα δύο αρχικά κλάσματα (π.χ. 1/2 · 1/2 ＝ 1/4).'
        : 'Λάθος! Το γινόμενο δύο γνήσιων κλασμάτων είναι πάντοτε μικρότερο και από τα δύο αρχικά (π.χ. 1/2 · 1/2 ＝ 1/4 ＜ 1/2).'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Εύρεση Άγνωστου Όρου',
      prompt: `Βρες τον αριθμητή x στην ισότητα: (${q7N1}/${q7D1}) · (x/${q7D2}) ＝ ${q7TargetN}/${q7TargetD}`,
      correct: q7Correct,
      explain: `Ισχύει ${q7N1} · x ＝ ${q7TargetN} ➔ x ＝ ${q7TargetN} : ${q7N1} ＝ ${q7Correct}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Ακέραιος επί Κλάσμα',
      prompt: `Ποιο είναι το αποτέλεσμα του πολλαπλασιασμού ${q8W} · (${q8N}/${q8D});`,
      options: q8Options,
      correct: q8Res,
      explain: `Πολλαπλασιάζουμε τον ακέραιο μόνο με τον αριθμητή: (${q8W} · ${q8N}) / ${q8D} ＝ ${q8Res}.`
    },
    {
      id: 'q9',
      type: 'mcq',
      title: `Πρόβλημα: ${STANDARD_PROBLEMS_POOL[spIndex].title}`,
      prompt: q9Raw.prompt,
      options: q9Options,
      correct: q9Raw.correctText,
      tableData: q9Raw.tableData,
      explain: q9Raw.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `Σύνθετο Πρόβλημα: ${HARD_PROBLEMS_POOL[hpIndex].title}`,
      prompt: q10Raw.prompt,
      options: q10Options,
      correct: q10Raw.correctText,
      tableData: q10Raw.tableData,
      explain: q10Raw.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function PollaplasiasmosKlasmatonExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions();
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach(q => {
      initialAnswers[q.id] = q.type === 'tf' ? null : '';
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

  // Χειρισμός απαντήσεων: sanitize για inputs, αυτούσιο για mcq/tf
  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      let sanitized = String(rawValue).replace(/[^0-9/]/g, '');
      const parts = sanitized.split('/');
      if (parts.length > 2) {
        sanitized = parts[0] + '/' + parts.slice(1).join('');
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
      const cleanUser = userVal.replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\s+/g, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\s+/g, '').trim().toLowerCase() : null;
      return cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt);
    }
    if (q.type === 'mcq') {
      return userVal === q.correct;
    }
    if (q.type === 'tf') {
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
      title="Ασκήσεις: Πολλαπλασιασμός Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στον πολλαπλασιασμό κλασμάτων και ακεραίων για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/29-pollaplasiasmos-klasmaton"
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
                <span>ΚΕΦΑΛΑΙΟ 29 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Πολλαπλασιασμός Κλασμάτων
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον πολλαπλασιασμό κλασμάτων, ακεραίων επί κλάσμα, στους αντίστροφους αριθμούς και στην απλοποίηση!
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
                      {q.type === 'tf' ? `«${q.text}»` : q.prompt}
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
                          type="text"
                          inputMode={q.id === 'q7' ? 'numeric' : 'text'}
                          autoComplete="off"
                          spellCheck="false"
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.id === 'q7' ? 'π.χ. 3' : 'π.χ. 6/20'}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}

                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerChange(q.id, true, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            answers[q.id] === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                          }`}
                        >
                          👍 {toCleanUppercase('Σωστό')}
                        </button>
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerChange(q.id, false, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            answers[q.id] === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          👎 {toCleanUppercase('Λάθος')}
                        </button>
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
                                <th className="p-1.5">{toCleanUppercase('Πράξη / Μέθοδος')}</th>
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

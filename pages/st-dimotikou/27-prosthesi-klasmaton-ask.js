// pages/st-dimotikou/27-prosthesi-klasmaton-ask.js
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

function findLCM(a, b) {
  if (!a || !b) return 1;
  return Math.abs(a * b) / findGCD(a, b);
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
    title: 'Κατανάλωση Πίτσας σε Πάρτι',
    unit: 'της πίτσας',
    generate: () => {
      // 1/4 + 1/2 = 1/4 + 2/4 = 3/4
      const p1 = 'Ο Νίκος';
      const p2 = 'ο Πέτρος';
      const n1 = 1;
      const d1 = 4;
      const n2 = 1;
      const d2 = 2;
      const resN = 3;
      const resD = 4;
      return {
        prompt: `${p1} έφαγε το ${n1}/${d1} μιας πίτσας και ${p2} έφαγε το ${n2}/${d2} της ίδιας πίτσας. Ποιο μέρος της πίτσας καταναλώθηκε συνολικά;`,
        unit: '',
        correctVal: `${resN}/${resD}`,
        correctText: `${resN}/${resD}`,
        tableData: [
          { item: 'Κομμάτι Νίκου', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: 'Κομμάτι Πέτρου (Ομώνυμο)', formula: `(${n2} · 2) / (${d2} · 2)`, val: `2/${resD}` },
          { item: 'Συνολικό Άθροισμα', formula: `${n1}/${resD} ＋ 2/${resD}`, val: `${resN}/${resD}` }
        ],
        explain: `Κάνουμε τα κλάσματα ομώνυμα με Ε.Κ.Π.(4, 2) ＝ 4. Το 1/2 γίνεται 2/4. Προσθέτουμε τους αριθμητές: 1/4 ＋ 2/4 ＝ ${resN}/${resD}.`,
        distractors: ['2/6', '3/8', '2/4']
      };
    }
  },
  {
    id: 'sp2',
    title: 'Χυμός Πορτοκαλιού και Μήλου',
    unit: 'του λίτρου',
    generate: () => {
      // 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2
      const p1 = 'Η Ελένη';
      const p2 = 'η Μαρία';
      const n1 = 1;
      const d1 = 3;
      const n2 = 1;
      const d2 = 6;
      return {
        prompt: `${p1} ήπιε το ${n1}/${d1} ενός λίτρου χυμού και ${p2} ήπιε το ${n2}/${d2} του ίδιου λίτρου. Ποιο μέρος του λίτρου καταναλώθηκε συνολικά;`,
        unit: '',
        correctVal: '1/2',
        correctText: '1/2 (3/6)',
        tableData: [
          { item: '1ο Μέρος (Ομώνυμο)', formula: `(${n1} · 2) / (${d1} · 2)`, val: '2/6' },
          { item: '2ο Μέρος', formula: `${n2}/${d2}`, val: '1/6' },
          { item: 'Άθροισμα & Απλοποίηση', formula: '2/6 ＋ 1/6 ＝ 3/6 (: 3)', val: '1/2' }
        ],
        explain: `Ε.Κ.Π.(3, 6) ＝ 6. Το 1/3 γίνεται 2/6. Προσθέτουμε: 2/6 ＋ 1/6 ＝ 3/6. Απλοποιώντας με το 3 παίρνουμε 1/2 του λίτρου.`,
        distractors: ['2/9', '2/6', '2/3']
      };
    }
  },
  {
    id: 'sp3',
    title: 'Φύτευση Σχολικού Κήπου',
    unit: 'του κήπου',
    generate: () => {
      // 2/5 + 3/10 = 4/10 + 3/10 = 7/10
      const p1 = 'Ο Κώστας';
      const p2 = 'ο Γιώργος';
      const n1 = 2;
      const d1 = 5;
      const n2 = 3;
      const d2 = 10;
      const resN = 7;
      const resD = 10;
      return {
        prompt: `${p1} φύτεψε τα ${n1}/${d1} ενός σχολικού κήπου και ${p2} φύτεψε τα ${n2}/${d2} του κήπου. Ποιο μέρος του κήπου φυτεύτηκε συνολικά;`,
        unit: '',
        correctVal: `${resN}/${resD}`,
        correctText: `${resN}/${resD}`,
        tableData: [
          { item: 'Μέρος Κώστα (Ομώνυμο)', formula: `(${n1} · 2) / (${d1} · 2)`, val: `4/${resD}` },
          { item: 'Μέρος Γιώργου', formula: `${n2}/${d2}`, val: `3/${resD}` },
          { item: 'Σύνολο', formula: `4/${resD} ＋ 3/${resD}`, val: `${resN}/${resD}` }
        ],
        explain: `Κάνουμε τα κλάσματα ομώνυμα με Ε.Κ.Π.(5, 10) ＝ 10. Το 2/5 γίνεται 4/10. Προσθέτουμε: 4/10 ＋ 3/10 ＝ ${resN}/${resD}.`,
        distractors: ['5/15', '5/10', '6/10']
      };
    }
  },
  {
    id: 'sp4',
    title: 'Ανάγνωση Κεφαλαίων Βιβλίου',
    unit: 'του βιβλίου',
    generate: () => {
      // 1/8 + 3/8 = 4/8 = 1/2
      const p1 = 'Η Άννα';
      const p2 = 'η Σοφία';
      const n1 = 1;
      const d1 = 8;
      const n2 = 3;
      const d2 = 8;
      return {
        prompt: `${p1} διάβασε το ${n1}/${d1} ενός βιβλίου το πρωί και ${p2} διάβασε τα ${n2}/${d2} του βιβλίου το απόγευμα. Ποιο μέρος του βιβλίου διαβάστηκε συνολικά;`,
        unit: '',
        correctVal: '1/2',
        correctText: '1/2 (4/8)',
        tableData: [
          { item: 'Πρωινό διάβασμα', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: 'Απογευματινό διάβασμα', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: 'Άθροισμα (Ομώνυμα)', formula: `(${n1} ＋ ${n2})/${d1} ＝ 4/8 (: 4)`, val: '1/2' }
        ],
        explain: `Τα κλάσματα είναι ήδη ομώνυμα: 1/8 ＋ 3/8 ＝ 4/8. Απλοποιώντας διαιρώντας με το 4 παίρνουμε 1/2 του βιβλίου.`,
        distractors: ['4/16', '3/16', '2/8']
      };
    }
  },
  {
    id: 'sp5',
    title: 'Κάλυψη Αθλητικής Διαδρομής',
    unit: 'της διαδρομής',
    generate: () => {
      // 1/4 + 3/8 = 2/8 + 3/8 = 5/8
      const p1 = 'Ο Αλέξανδρος';
      const p2 = 'ο Δημήτρης';
      const n1 = 1;
      const d1 = 4;
      const n2 = 3;
      const d2 = 8;
      const resN = 5;
      const resD = 8;
      return {
        prompt: `Σε έναν αγώνα σκυταλοδρομίας, ${p1} κάλυψε το ${n1}/${d1} της διαδρομής και ${p2} κάλυψε τα ${n2}/${d2} της διαδρομής. Ποιο μέρος της διαδρομής καλύφθηκε συνολικά;`,
        unit: '',
        correctVal: `${resN}/${resD}`,
        correctText: `${resN}/${resD}`,
        tableData: [
          { item: '1ο Τμήμα (Ομώνυμο)', formula: `(${n1} · 2) / (${d1} · 2)`, val: `2/${resD}` },
          { item: '2ο Τμήμα', formula: `${n2}/${d2}`, val: `3/${resD}` },
          { item: 'Συνολικό Μέρος', formula: `2/${resD} ＋ 3/${resD}`, val: `${resN}/${resD}` }
        ],
        explain: `Ε.Κ.Π.(4, 8) ＝ 8. Το 1/4 γίνεται 2/8. Προσθέτουμε: 2/8 ＋ 3/8 ＝ ${resN}/${resD} της διαδρομής.`,
        distractors: ['4/12', '4/8', '6/8']
      };
    }
  },
  {
    id: 'sp6',
    title: 'Χρωμάτισμα Μεγάλου Σχεδίου',
    unit: 'του σχεδίου',
    generate: () => {
      // 2/7 + 3/7 = 5/7
      const p1 = 'Η Χριστίνα';
      const p2 = 'η Κατερίνα';
      const n1 = 2;
      const d1 = 7;
      const n2 = 3;
      const d2 = 7;
      const resN = 5;
      const resD = 7;
      return {
        prompt: `Σε ένα μάθημα Εικαστικών, ${p1} χρωμάτισε τα ${n1}/${d1} ενός σχεδίου και ${p2} χρωμάτισε τα ${n2}/${d2} του σχεδίου. Ποιο μέρος του σχεδίου χρωματίστηκε συνολικά;`,
        unit: '',
        correctVal: `${resN}/${resD}`,
        correctText: `${resN}/${resD}`,
        tableData: [
          { item: 'Μέρος Χριστίνας', formula: `${n1}/${d1}`, val: `${n1}/${d1}` },
          { item: 'Μέρος Κατερίνας', formula: `${n2}/${d2}`, val: `${n2}/${d2}` },
          { item: 'Σύνολο (Ομώνυμα)', formula: `(${n1} ＋ ${n2})/${d1}`, val: `${resN}/${resD}` }
        ],
        explain: `Προσθέτουμε κατευθείαν τους αριθμητές στα ομώνυμα: 2/7 ＋ 3/7 ＝ ${resN}/${resD}.`,
        distractors: ['5/14', '6/7', '4/7']
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Άθροισμα Μεγαλύτερο από τη Μονάδα (＞ 1)',
    unit: '',
    generate: () => {
      // 1/2 + 2/3 = 3/6 + 4/6 = 7/6 (1 και 1/6)
      return {
        prompt: 'Υπολόγισε το άθροισμα 1/2 ＋ 2/3. Τι παρατηρείς για το τελικό αποτέλεσμα σε σχέση με τη μονάδα;',
        unit: '',
        correctVal: '7/6 (μεγαλύτερο από το 1)',
        correctText: '7/6 (μεγαλύτερο από το 1)',
        tableData: [
          { item: '1/2 σε έκτα', formula: '(1 · 3) / 6', val: '3/6' },
          { item: '2/3 σε έκτα', formula: '(2 · 2) / 6', val: '4/6' },
          { item: 'Άθροισμα', formula: '3/6 ＋ 4/6', val: '7/6 (＞ 1)' }
        ],
        explain: 'Ε.Κ.Π.(2, 3) ＝ 6. Μετατρέπουμε σε ομώνυμα: 3/6 ＋ 4/6 ＝ 7/6. Επειδή ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή (7 ＞ 6), το άθροισμα είναι μεγαλύτερο από το 1 (καταχρηστικό κλάσμα ＝ 1 και 1/6).',
        distractors: [
          '3/5 (μικρότερο από το 1)',
          '5/6 (μικρότερο από το 1)',
          '6/6 (ίσο με τη μονάδα)'
        ]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Πρόσθεση Τριών Κλασμάτων',
    unit: '',
    generate: () => {
      // 1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6 = 1
      return {
        prompt: 'Υπολόγισε το άθροισμα των τριών κλασμάτων: 1/2 ＋ 1/3 ＋ 1/6:',
        unit: '',
        correctVal: '1',
        correctText: '1 (ή 6/6)',
        tableData: [
          { item: 'Ε.Κ.Π.(2, 3, 6)', formula: 'Κοινός παρονομαστής', val: '6' },
          { item: 'Μετατροπή σε ομώνυμα', formula: '3/6 ＋ 2/6 ＋ 1/6', val: '(3 ＋ 2 ＋ 1)/6' },
          { item: 'Τελικό Άθροισμα', formula: '6/6', val: '1 ακέραια μονάδα' }
        ],
        explain: 'Ε.Κ.Π.(2, 3, 6) ＝ 6. Γράφουμε: 3/6 ＋ 2/6 ＋ 1/6 ＝ 6/6 ＝ 1 ολόκληρη μονάδα.',
        distractors: [
          '3/11',
          '5/6',
          '7/6'
        ]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Σύνθετη Πρόσθεση Ακέραιου με Κλάσματα',
    unit: '',
    generate: () => {
      // 2 + 1/4 + 1/2 = 2 + 3/4 = 11/4
      return {
        prompt: 'Ένας μάγειρας χρησιμοποίησε 2 ολόκληρα κιλά αλεύρι, επιπλέον 1/4 του κιλού και ακόμη 1/2 του κιλού. Πόσα κιλά αλεύρι χρησιμοποίησε συνολικά σε κλασματική μορφή;',
        unit: 'κιλά',
        correctVal: '11/4',
        correctText: '11/4 κιλά (2 και 3/4)',
        tableData: [
          { item: 'Κλάσματα αλευριού', formula: '1/4 ＋ 1/2 ＝ 1/4 ＋ 2/4', val: '3/4 κιλά' },
          { item: 'Ακέραιος σε τέταρτα', formula: '2 ＝ 8/4', val: '8/4 κιλά' },
          { item: 'Συνολικό βάρος', formula: '8/4 ＋ 3/4', val: '11/4 κιλά' }
        ],
        explain: 'Προσθέτουμε πρώτα τα κλάσματα: 1/4 ＋ 2/4 ＝ 3/4. Μαζί με τα 2 ακέραια κιλά (8/4) έχουμε 8/4 ＋ 3/4 ＝ 11/4 κιλά.',
        distractors: [
          '7/4 κιλά',
          '9/4 κιλά',
          '2/6 κιλά'
        ]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Εύρεση Άγνωστου Κλάσματος',
    unit: '',
    generate: () => {
      // 1/3 + [?] = 5/6 -> [?] = 5/6 - 2/6 = 3/6 = 1/2
      return {
        prompt: 'Ποιο κλάσμα πρέπει να προστεθεί στο 1/3 για να προκύψει άθροισμα ίσο με 5/6;',
        unit: '',
        correctVal: '1/2',
        correctText: '1/2 (ή 3/6)',
        tableData: [
          { item: '1/3 σε έκτα', formula: '(1 · 2) / 6', val: '2/6' },
          { item: 'Στόχος', formula: '5/6', val: '5/6' },
          { item: 'Άγνωστο μέρος', formula: '5/6 － 2/6 ＝ 3/6 (: 3)', val: '1/2' }
        ],
        explain: 'Το 1/3 είναι ίσο με 2/6. Για να φτάσουμε στα 5/6, χρειαζόμαστε 5/6 － 2/6 ＝ 3/6, το οποίο απλοποιείται σε 1/2.',
        distractors: [
          '2/3',
          '1/3',
          '4/6'
        ]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Διπλή Απλοποίηση σε Άθροισμα',
    unit: '',
    generate: () => {
      // 3/10 + 1/15 = 9/30 + 2/30 = 11/30
      return {
        prompt: 'Υπολόγισε το άθροισμα των ετερώνυμων κλασμάτων: 3/10 ＋ 1/15:',
        unit: '',
        correctVal: '11/30',
        correctText: '11/30',
        tableData: [
          { item: 'Ε.Κ.Π.(10, 15)', formula: '30', val: '30' },
          { item: '1ο Κλάσμα (· 3)', formula: '(3 · 3) / 30', val: '9/30' },
          { item: '2ο Κλάσμα (· 2)', formula: '(1 · 2) / 30', val: '2/30' },
          { item: 'Άθροισμα', formula: '9/30 ＋ 2/30', val: '11/30' }
        ],
        explain: 'Ε.Κ.Π.(10, 15) ＝ 30. Μετατρέπουμε σε ομώνυμα: 9/30 ＋ 2/30 ＝ 11/30.',
        distractors: [
          '4/25',
          '7/30',
          '13/30'
        ]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Συμπλήρωση ως την Ακέραια Μονάδα (1)',
    unit: '',
    generate: () => {
      // 3/8 + 1/4 = 3/8 + 2/8 = 5/8 -> απομένει 3/8
      return {
        prompt: 'Ένας μαθητής διάβασε τα 3/8 ενός βιβλίου τη Δευτέρα και το 1/4 την Τρίτη. Ποιο μέρος του βιβλίου του απομένει ακόμα να διαβάσει για να το τελειώσει ολόκληρο;',
        unit: 'του βιβλίου',
        correctVal: '3/8',
        correctText: '3/8',
        tableData: [
          { item: 'Διάβασμα Δευτέρας & Τρίτης', formula: '3/8 ＋ 2/8', val: '5/8' },
          { item: 'Ολόκληρο το βιβλίο (Μονάδα)', formula: '8/8', val: '8/8' },
          { item: 'Μέρος που απομένει', formula: '8/8 － 5/8', val: '3/8' }
        ],
        explain: 'Συνολικά διάβασε 3/8 ＋ 1/4 ＝ 3/8 ＋ 2/8 ＝ 5/8. Για να τελειώσει ολόκληρο το βιβλίο (8/8) απομένουν 8/8 － 5/8 ＝ 3/8.',
        distractors: [
          '5/8',
          '1/8',
          '1/2'
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Πρόσθεση Ομώνυμων Κλασμάτων
  const q1Den = randInt(5, 12);
  const q1Num1 = randInt(1, Math.floor((q1Den - 1) / 2));
  const q1Num2 = randInt(1, q1Den - q1Num1 - 1);
  const q1SumNum = q1Num1 + q1Num2;
  const q1Gcd = findGCD(q1SumNum, q1Den);
  const q1CorrectRaw = `${q1SumNum}/${q1Den}`;
  const q1CorrectSimp = `${q1SumNum / q1Gcd}/${q1Den / q1Gcd}`;

  // Q2: Input - Πρόσθεση Ετερώνυμων Κλασμάτων
  const q2Pairs = [
    { n1: 1, d1: 2, n2: 1, d2: 4 },
    { n1: 1, d1: 3, n2: 1, d2: 6 },
    { n1: 2, d1: 5, n2: 3, d2: 10 },
    { n1: 1, d1: 4, n2: 3, d2: 8 },
    { n1: 2, d1: 3, n2: 1, d2: 6 },
    { n1: 1, d1: 2, n2: 1, d2: 3 }
  ];
  const q2Item = q2Pairs[randInt(0, q2Pairs.length - 1)];
  const q2Lcm = findLCM(q2Item.d1, q2Item.d2);
  const q2Equiv1 = q2Item.n1 * (q2Lcm / q2Item.d1);
  const q2Equiv2 = q2Item.n2 * (q2Lcm / q2Item.d2);
  const q2SumN = q2Equiv1 + q2Equiv2;
  const q2G = findGCD(q2SumN, q2Lcm);
  const q2CorrectRaw = `${q2SumN}/${q2Lcm}`;
  const q2CorrectSimp = `${q2SumN / q2G}/${q2Lcm / q2G}`;

  // Q3: MCQ - Εύρεση του Κοινού Παρονομαστή (Ε.Κ.Π.)
  const q3D1 = [2, 3, 4, 6][randInt(0, 3)];
  let q3D2 = [3, 4, 5, 8, 9][randInt(0, 4)];
  while (q3D1 === q3D2) q3D2 += 2;
  const q3Lcm = findLCM(q3D1, q3D2);
  const q3Wrongs = [q3D1 * q3D2 + 2, Math.max(2, q3Lcm - 2), q3Lcm + q3D1].filter(w => w !== q3Lcm);
  const q3Options = shuffle([...new Set([String(q3Lcm), ...q3Wrongs.map(String)])]).slice(0, 4);

  // Q4: MCQ - Πρόσθεση Ακέραιου με Κλάσμα
  const q4Whole = randInt(1, 3);
  const q4Den = randInt(2, 5);
  const q4Num = randInt(1, q4Den - 1);
  const q4ResNum = q4Whole * q4Den + q4Num;
  const q4CorrectStr = `${q4ResNum}/${q4Den}`;
  const q4WrongsList = [
    `${q4ResNum + 1}/${q4Den}`,
    `${q4Whole + q4Num}/${q4Den}`,
    `${q4ResNum}/${q4Den + 1}`
  ];
  const q4Options = shuffle([...new Set([q4CorrectStr, ...q4WrongsList])]);

  // Q5: True/False - Κανόνας ομωνύμων
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Όταν προσθέτουμε ομώνυμα κλάσματα, προσθέτουμε μόνο τους αριθμητές και κρατάμε τον ίδιο παρονομαστή.'
    : 'Όταν προσθέτουμε ομώνυμα κλάσματα, προσθέτουμε τους αριθμητές και προσθέτουμε και τους παρονομαστές.';

  // Q6: True/False - Πρόσθεση ετερωνύμων
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Για να προσθέσουμε ετερώνυμα κλάσματα, πρέπει πρώτα οπωσδήποτε να τα μετατρέψουμε σε ομώνυμα με το Ε.Κ.Π.'
    : 'Μπορούμε να προσθέσουμε απευθείας ετερώνυμα κλάσματα χωρίς να αλλάξουμε τους παρονομαστές τους.';

  // Q7: Input - Εύρεση άγνωστου αριθμητή σε πρόσθεση
  const q7Den = randInt(6, 12);
  const q7Known = randInt(1, q7Den - 3);
  const q7Target = randInt(q7Known + 2, q7Den);
  const q7Correct = String(q7Target - q7Known);

  // Q8: MCQ - Απλοποίηση αθροίσματος
  const q8Pairs = [
    { n1: 2, d: 8, n2: 2, simp: '1/2', raw: '4/8' },
    { n1: 1, d: 9, n2: 2, simp: '1/3', raw: '3/9' },
    { n1: 3, d: 10, n2: 2, simp: '1/2', raw: '5/10' },
    { n1: 1, d: 6, n2: 3, simp: '2/3', raw: '4/6' }
  ];
  const q8Item = q8Pairs[randInt(0, q8Pairs.length - 1)];
  const q8Wrongs = ['3/4', '1/4', '2/5'].filter(w => w !== q8Item.simp);
  const q8Options = shuffle([...new Set([q8Item.simp, ...q8Wrongs])]);

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
      title: 'Ομώνυμα Κλάσματα',
      prompt: `Υπολόγισε το άθροισμα των ομώνυμων κλασμάτων: ${q1Num1}/${q1Den} ＋ ${q1Num2}/${q1Den} (π.χ. 3/7):`,
      correct: q1CorrectRaw,
      altCorrect: q1CorrectSimp,
      explain: `${q1Num1}/${q1Den} ＋ ${q1Num2}/${q1Den} ＝ (${q1Num1} ＋ ${q1Num2})/${q1Den} ＝ ${q1CorrectRaw}${q1Gcd > 1 ? ` (ή απλοποιημένο: ${q1CorrectSimp})` : ''}.`
    },
    {
      id: 'q2',
      type: 'input',
      title: 'Ετερώνυμα Κλάσματα',
      prompt: `Υπολόγισε το άθροισμα: ${q2Item.n1}/${q2Item.d1} ＋ ${q2Item.n2}/${q2Item.d2} (π.χ. 3/4):`,
      correct: q2CorrectRaw,
      altCorrect: q2CorrectSimp,
      explain: `Ε.Κ.Π.(${q2Item.d1}, ${q2Item.d2}) ＝ ${q2Lcm}. Μετατρέπουμε σε ομώνυμα: ${q2Equiv1}/${q2Lcm} ＋ ${q2Equiv2}/${q2Lcm} ＝ ${q2CorrectRaw}${q2G > 1 ? ` ＝ ${q2CorrectSimp}` : ''}.`
    },
    {
      id: 'q3',
      type: 'mcq',
      title: 'Κοινός Παρονομαστής (Ε.Κ.Π.)',
      prompt: `Ποιος είναι ο ελάχιστος κοινός παρονομαστής (Ε.Κ.Π.) για να προσθέσουμε τα κλάσματα 1/${q3D1} και 1/${q3D2};`,
      options: q3Options,
      correct: String(q3Lcm),
      explain: `Το Ε.Κ.Π. των παρονομαστών ${q3D1} και ${q3D2} είναι το ${q3Lcm}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Ακέραιος ＋ Κλάσμα',
      prompt: `Ποιο είναι το αποτέλεσμα της πράξης ${q4Whole} ＋ ${q4Num}/${q4Den};`,
      options: q4Options,
      correct: q4CorrectStr,
      explain: `Γράφουμε τον ακέραιο ως κλάσμα: ${q4Whole} ＝ ${q4Whole * q4Den}/${q4Den}. Επομένως: ${q4Whole * q4Den}/${q4Den} ＋ ${q4Num}/${q4Den} ＝ ${q4CorrectStr}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Κανόνας Ομωνύμων',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Στα ομώνυμα κλάσματα προσθέτουμε ΜΟΝΟ τους αριθμητές.'
        : 'Λάθος! ΠΟΤΕ δεν προσθέτουμε τους παρονομαστές μεταξύ τους.'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Κανόνας Ετερωνύμων',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Για να προσθέσουμε ετερώνυμα κλάσματα πρέπει πρώτα οπωσδήποτε να τα κάνουμε ομώνυμα με το Ε.Κ.Π.'
        : 'Λάθος! Δεν μπορούμε να προσθέσουμε ετερώνυμα κλάσματα χωρίς να τα μετατρέψουμε πρώτα σε ομώνυμα.'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Εύρεση Άγνωστου Αριθμητή',
      prompt: `Βρες τον αριθμητή x στην ισότητα: ${q7Known}/${q7Den} ＋ x/${q7Den} ＝ ${q7Target}/${q7Den}`,
      correct: q7Correct,
      explain: `Αφού τα κλάσματα είναι ομώνυμα, ισχύει ${q7Known} ＋ x ＝ ${q7Target} ➔ x ＝ ${q7Target} － ${q7Known} ＝ ${q7Correct}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Απλοποίηση Αθροίσματος',
      prompt: `Ποιο είναι το απλούστερο ανάγωγο κλάσμα που προκύπτει από το άθροισμα ${q8Item.n1}/${q8Item.d} ＋ ${q8Item.n2}/${q8Item.d};`,
      options: q8Options,
      correct: q8Item.simp,
      explain: `Προσθέτουμε: ${q8Item.n1}/${q8Item.d} ＋ ${q8Item.n2}/${q8Item.d} ＝ ${q8Item.raw}. Απλοποιώντας τους όρους παίρνουμε το ανάγωγο ${q8Item.simp}.`
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

export default function ProsthesiKlasmatonExercisesPage() {
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
      title="Ασκήσεις: Πρόσθεση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην πρόσθεση ομώνυμων και ετερώνυμων κλασμάτων για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/27-prosthesi-klasmaton"
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
                <span>ΚΕΦΑΛΑΙΟ 27 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Πρόσθεση Κλασμάτων
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην πρόσθεση ομώνυμων και ετερώνυμων κλασμάτων, στην εύρεση Ε.Κ.Π. και στην απλοποίηση!
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
                          placeholder={q.id === 'q7' ? 'π.χ. 3' : 'π.χ. 3/4'}
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

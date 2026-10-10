// pages/st-dimotikou/63-geometrika-motiba-ask.js
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

// Μορφοποίηση αριθμών
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  if (Number.isInteger(Number(num))) return String(num);
  return String(num).replace('.', ',');
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    title: 'Κατασκευή Τετραγώνων με Σπίρτα',
    unit: 'σπίρτα',
    generate: () => {
      const n = randInt(10, 20);
      const totalMatches = 1 + 3 * n;
      const correctText = `${totalMatches} σπίρτα`;
      return {
        prompt: `Σχηματίζουμε μια ευθεία σειρά από ${n} ενωμένα τετράγωνα με σπίρτα. Το 1ο τετράγωνο χρειάζεται 4 σπίρτα και κάθε επόμενο που κολλάει δίπλα του χρειάζεται 3 επιπλέον σπίρτα. Πόσα σπίρτα θα χρειαστούν συνολικά;`,
        correctText,
        tableData: [
          { item: '1ο τετράγωνο', formula: '4 σπίρτα', val: '4' },
          { item: 'Επιπλέον τετράγωνα', formula: `${n - 1} · 3 σπίρτα`, val: `${(n - 1) * 3}` },
          { item: 'Σύνολο για n ＝ ' + n, formula: `1 ＋ (3 · ${n})`, val: `${totalMatches} σπίρτα` }
        ],
        explain: `Ο μαθηματικός κανόνας για n ενωμένα τετράγωνα είναι: 1 ＋ 3 · n (ή 4 ＋ 3 · (n － 1)). Για n ＝ ${n}: 1 ＋ 3 · ${n} ＝ 1 ＋ ${3 * n} ＝ ${totalMatches} σπίρτα.`,
        distractors: [
          `${totalMatches + 3} σπίρτα`,
          `${n * 4} σπίρτα`,
          `${totalMatches - 3} σπίρτα`
        ]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Κατασκευή Τριγώνων με Σπίρτα',
    unit: 'σπίρτα',
    generate: () => {
      const n = randInt(12, 25);
      const totalMatches = 1 + 2 * n;
      const correctText = `${totalMatches} σπίρτα`;
      return {
        prompt: `Σχηματίζουμε μια γραμμή από ${n} ενωμένα ισόπλευρα τρίγωνα με σπίρτα. Το 1ο τρίγωνο χρειάζεται 3 σπίρτα και κάθε επόμενο χρειάζεται 2 επιπλέον σπίρτα. Πόσα σπίρτα θα χρειαστούν για τα ${n} τρίγωνα;`,
        correctText,
        tableData: [
          { item: '1ο τρίγωνο', formula: '3 σπίρτα', val: '3' },
          { item: 'Επιπλέον τρίγωνα', formula: `${n - 1} · 2 σπίρτα`, val: `${(n - 1) * 2}` },
          { item: 'Μαθηματικός τύπος', formula: `1 ＋ (2 · ${n})`, val: `${totalMatches} σπίρτα` }
        ],
        explain: `Ο κανόνας για n ενωμένα τρίγωνα είναι: 1 ＋ 2 · n. Για n ＝ ${n}: 1 ＋ 2 · ${n} ＝ 1 ＋ ${2 * n} ＝ ${totalMatches} σπίρτα.`,
        distractors: [
          `${n * 3} σπίρτα`,
          `${totalMatches + 2} σπίρτα`,
          `${totalMatches - 2} σπίρτα`
        ]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Πλακόστρωση με Τετράγωνα Πλακάκια',
    unit: 'πλακάκια',
    generate: () => {
      const side = randInt(8, 15);
      const totalTiles = side * side;
      const correctText = `${totalTiles} πλακάκια`;
      return {
        prompt: `Ένα τετράγωνο δάπεδο στρώνεται με τετράγωνα πλακάκια. Αν σε κάθε πλευρά τοποθετούνται ${side} πλακάκια, πόσα πλακάκια θα χρειαστούν συνολικά για να καλυφθεί ολόκληρο το δάπεδο χωρίς κενά;`,
        correctText,
        tableData: [
          { item: 'Πλακάκια ανά πλευρά (n)', formula: `${side}`, val: `${side}` },
          { item: 'Μοτίβο τετραγώνου', formula: `n · n ＝ ${side} · ${side}`, val: `${totalTiles}` },
          { item: 'Συνολικό πλήθος', formula: `${side}²`, val: `${totalTiles} πλακάκια` }
        ],
        explain: `Η κάλυψη τετραγώνου ακολουθεί τον κανόνα του τετραγωνικού αριθμού: n · n ＝ ${side} · ${side} ＝ ${totalTiles} πλακάκια.`,
        distractors: [
          `${side * 4} πλακάκια`,
          `${totalTiles + side} πλακάκια`,
          `${totalTiles - side} πλακάκια`
        ]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Κυκλικό Μοτίβο 4 Σχημάτων',
    unit: '',
    generate: () => {
      const shapes = ['Τρίγωνο (🔺)', 'Κύκλος (🟢)', 'Τετράγωνο (🟦)', 'Ρόμβος (🔶)'];
      const targetPos = randInt(41, 69);
      const rem = targetPos % 4;
      const shapeIdx = rem === 0 ? 3 : rem - 1;
      const correctText = shapes[shapeIdx];
      return {
        prompt: `Σε μια μπορντούρα επαναλαμβάνεται συνεχώς το μοτίβο: Τρίγωνο, Κύκλος, Τετράγωνο, Ρόμβος (πυρήνας 4 σχημάτων). Ποιο σχήμα θα βρίσκεται στην ${targetPos}η θέση;`,
        correctText,
        tableData: [
          { item: 'Μήκος πυρήνα', formula: '4 σχήματα', val: '4' },
          { item: 'Ευκλείδεια διαίρεση', formula: `${targetPos} : 4`, val: `πηλίκο ${Math.floor(targetPos / 4)}, υπόλοιπο ${rem}` },
          { item: 'Σχήμα θέσης', formula: rem === 0 ? '4ο σχήμα' : `${rem}ο σχήμα`, val: correctText }
        ],
        explain: `Διαιρούμε τη θέση με το μήκος του πυρήνα: ${targetPos} : 4 ＝ ${Math.floor(targetPos / 4)} με υπόλοιπο ${rem}. Το υπόλοιπο ${rem === 0 ? 4 : rem} δείχνει ότι το σχήμα είναι το ${correctText}.`,
        distractors: shapes.filter(s => s !== correctText).slice(0, 3)
      };
    }
  },
  {
    id: 'sp5',
    title: 'Κυκλικό Μοτίβο 5 Χρωμάτων',
    unit: '',
    generate: () => {
      const colors = ['Κόκκινη', 'Μπλε', 'Κίτρινη', 'Πράσινη', 'Πορτοκαλί'];
      const targetPos = randInt(51, 89);
      const rem = targetPos % 5;
      const colIdx = rem === 0 ? 4 : rem - 1;
      const correctText = `${colors[colIdx]} χάντρα`;
      return {
        prompt: `Σε ένα περιδέραιο περνιούνται χάντρες με τη σταθερή σειρά: Κόκκινη, Μπλε, Κίτρινη, Πράσινη, Πορτοκαλί (πυρήνας 5 χαντρών). Τι χρώμα θα έχει η ${targetPos}η χάντρα;`,
        correctText,
        tableData: [
          { item: 'Μήκος πυρήνα', formula: '5 χάντρες', val: '5' },
          { item: 'Διαίρεση θέσης', formula: `${targetPos} : 5`, val: `πηλίκο ${Math.floor(targetPos / 5)}, υπόλοιπο ${rem}` },
          { item: 'Χρώμα χάντρας', formula: rem === 0 ? '5ο χρώμα' : `${rem}ο χρώμα`, val: correctText }
        ],
        explain: `Διαιρούμε ${targetPos} : 5 ＝ ${Math.floor(targetPos / 5)} με υπόλοιπο ${rem}. Το υπόλοιπο ${rem === 0 ? 5 : rem} αντιστοιχεί στην ${correctText}.`,
        distractors: colors.filter((_, idx) => idx !== colIdx).slice(0, 3).map(c => `${c} χάντρα`)
      };
    }
  },
  {
    id: 'sp6',
    title: 'Μοτίβο Περιμέτρου με Τραπέζια',
    unit: 'καρέκλες',
    generate: () => {
      const tables = randInt(6, 15);
      const chairs = 2 * tables + 2;
      const correctText = `${chairs} καρέκλες`;
      return {
        prompt: `Σε μια αίθουσα ενώνουμε ${tables} τετράγωνα τραπέζια στη σειρά σε ένα μεγάλο ορθογώνιο τραπέζι. Σε κάθε ελεύθερη πλευρά τετραγώνου μπαίνει 1 καρέκλα. Πόσες καρέκλες χωρούν γύρω από το ενιαίο τραπέζι των ${tables} τεμαχίων;`,
        correctText,
        tableData: [
          { item: 'Καρέκλες στις 2 άκρες', formula: '1 ＋ 1', val: '2' },
          { item: 'Καρέκλες στις μακριές πλευρές', formula: `2 · ${tables}`, val: `${2 * tables}` },
          { item: 'Συνολικός κανόνας', formula: `(2 · ${tables}) ＋ 2`, val: `${chairs} καρέκλες` }
        ],
        explain: `Στις δύο στενές άκρες μπαίνουν 2 καρέκλες και στις δύο μακριές πλευρές μπαίνουν 2 · ${tables} ＝ ${2 * tables} καρέκλες. Σύνολο: ${2 * tables} ＋ 2 ＝ ${chairs} καρέκλες.`,
        distractors: [
          `${tables * 4} καρέκλες`,
          `${chairs + 2} καρέκλες`,
          `${chairs - 2} καρέκλες`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Τριγωνικοί Αριθμοί (Πλήθος Τελειών)',
    unit: 'τελείες',
    generate: () => {
      const n = randInt(8, 12);
      const totalDots = (n * (n + 1)) / 2;
      const correctText = `${totalDots} τελείες`;
      return {
        prompt: `Στο 1ο βήμα ενός τριγωνικού μοτίβου έχουμε 1 τελεία, στο 2ο βήμα 3 τελείες (1＋2), στο 3ο βήμα 6 τελείες (1＋2＋3). Πόσες τελείες θα περιέχει το ${n}ο βήμα;`,
        correctText,
        tableData: [
          { item: 'Βήμα (n)', formula: `${n}`, val: `${n}` },
          { item: 'Τύπος τριγωνικού αριθμού', formula: `[n · (n ＋ 1)] : 2`, val: `[${n} · ${n + 1}] : 2` },
          { item: 'Υπολογισμός', formula: `${n * (n + 1)} : 2`, val: `${totalDots} τελείες` }
        ],
        explain: `Το άθροισμα των πρώτων n φυσικών αριθμών δίνεται από τον τύπο [n · (n ＋ 1)] : 2. Για n ＝ ${n}: (${n} · ${n + 1}) : 2 ＝ ${n * (n + 1)} : 2 ＝ ${totalDots} τελείες.`,
        distractors: [
          `${n * n} τελείες`,
          `${totalDots + n} τελείες`,
          `${totalDots - n} τελείες`
        ]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Πλακόστρωση και Γωνίες Κορυφής (360°)',
    unit: '',
    generate: () => {
      const correctText = '3 εξάγωνα (120° · 3 ＝ 360°)';
      return {
        prompt: 'Σε μια κανονική εξαγωνική πλακόστρωση (όπως στην κηρήθρα των μελισσών), πόσα κανονικά εξάγωνα ενώνονται σε κάθε κοινή κορυφή ώστε να καλύπτουν πλήρως τις 360° χωρίς κενά;',
        correctText,
        tableData: [
          { item: 'Εσωτερική γωνία κανονικού εξαγώνου', formula: '180° · (6 － 2) : 6', val: '120°' },
          { item: 'Πλήρης γωνία κορυφής', formula: '360°', val: '360°' },
          { item: 'Πλήθος εξαγώνων ανά κορυφή', formula: '360° : 120°', val: '3 εξάγωνα' }
        ],
        explain: 'Κάθε γωνία ενός κανονικού εξαγώνου είναι 120°. Για να καλυφθούν πλήρως οι 360° γύρω από μια κορυφή, ενώνονται ακριβώς 360° : 120° ＝ 3 εξάγωνα.',
        distractors: [
          '4 εξάγωνα (90° · 4 ＝ 360°)',
          '6 εξάγωνα (60° · 6 ＝ 360°)',
          '2 εξάγωνα (180° · 2 ＝ 360°)'
        ]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Αυξανόμενο Μοτίβο με Περιθώριο (Border Tiles)',
    unit: 'πλακάκια',
    generate: () => {
      const n = randInt(6, 10);
      const borderTiles = 4 * n - 4;
      const correctText = `${borderTiles} πλακάκια`;
      return {
        prompt: `Ένα τετράγωνο πλέγμα διαστάσεων ${n} · ${n} καλύπτεται από πλακάκια. Πόσα πλακάκια βρίσκονται μόνο στο εξωτερικό του περίγραμμα (περιμετρικά);`,
        correctText,
        tableData: [
          { item: 'Συνολικά πλακάκια (n · n)', formula: `${n} · ${n}`, val: `${n * n}` },
          { item: 'Εσωτερικά πλακάκια', formula: `(${n} － 2) · (${n} － 2)`, val: `${(n - 2) * (n - 2)}` },
          { item: 'Περιμετρικά πλακάκια', formula: `${n * n} － ${(n - 2) * (n - 2)}`, val: `${borderTiles} πλακάκια` }
        ],
        explain: `Τα περιμετρικά πλακάκια υπολογίζονται αφαιρώντας το εσωτερικό τετράγωνο: ${n * n} － ${(n - 2) * (n - 2)} ＝ ${borderTiles} πλακάκια (ή με τον κανόνα 4 · n － 4 ＝ 4 · ${n} － 4 ＝ ${borderTiles}).`,
        distractors: [
          `${n * 4} πλακάκια`,
          `${borderTiles + 4} πλακάκια`,
          `${borderTiles - 4} πλακάκια`
        ]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Ακολουθία Fibonacci στη Φύση',
    unit: '',
    generate: () => {
      const nextVal = 13 + 21;
      const correctText = String(nextVal);
      return {
        prompt: 'Στη φύση (σπείρες ηλιοτροπίων, κουκουνάρια) συναντάμε την περίφημη ακολουθία Fibonacci: 1, 1, 2, 3, 5, 8, 13, 21, ... Ποιος είναι ο αμέσως επόμενος αριθμός του μοτίβου;',
        correctText,
        tableData: [
          { item: 'Κανόνας Fibonacci', formula: 'Άθροισμα των 2 προηγούμενων', val: 'α(n) ＝ α(n-1) ＋ α(n-2)' },
          { item: 'Τελευταίοι 2 όροι', formula: '13 και 21', val: '13 ＋ 21' },
          { item: 'Επόμενος όρος', formula: '13 ＋ 21', val: `${nextVal}` }
        ],
        explain: `Κάθε αριθμός στην ακολουθία Fibonacci προκύπτει προσθέτοντας τους δύο προηγούμενους: 13 ＋ 21 ＝ ${nextVal}.`,
        distractors: [
          String(nextVal - 2),
          String(nextVal + 3),
          '29'
        ]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Μοτίβο Διακοσμητικού Ψηφιδωτού',
    unit: 'ψηφίδες',
    generate: () => {
      const n = randInt(8, 16);
      const totalCross = 1 + 4 * n;
      const correctText = `${totalCross} ψηφίδες`;
      return {
        prompt: `Σε ένα σταυροειδές γεωμετρικό μοτίβο υπάρχει 1 κεντρική ψηφίδα και 4 ίσα μπράτσα. Αν κάθε μπράτσο έχει μήκος ${n} ψηφίδες, πόσες ψηφίδες χρειάζονται συνολικά για τον σχηματισμό του σταυρού;`,
        correctText,
        tableData: [
          { item: 'Κεντρική ψηφίδα', formula: '1', val: '1' },
          { item: '4 μπράτσα', formula: `4 · ${n}`, val: `${4 * n}` },
          { item: 'Συνολικός τύπος', formula: `1 ＋ (4 · ${n})`, val: `${totalCross} ψηφίδες` }
        ],
        explain: `Προσθέτουμε την κεντρική ψηφίδα με τις ψηφίδες των 4 μπράτσων: 1 ＋ 4 · ${n} ＝ 1 ＋ ${4 * n} ＝ ${totalCross} ψηφίδες.`,
        distractors: [
          `${4 * n} ψηφίδες`,
          `${totalCross + 4} ψηφίδες`,
          `${totalCross - 2} ψηφίδες`
        ]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Σύνθετη Πλακόστρωση (Οκτάγωνα & Τετράγωνα)',
    unit: '',
    generate: () => {
      const correctText = '2 κανονικά οκτάγωνα και 1 τετράγωνο (135° ＋ 135° ＋ 90° ＝ 360°)';
      return {
        prompt: 'Σε ένα παραδοσιακό δάπεδο συνδυάζονται κανονικά οκτάγωνα (γωνία 135°) και τετράγωνα (γωνία 90°). Ποιος συνδυασμός σχημάτων συναντιέται σε κάθε κορυφή ώστε να συμπληρώνονται ακριβώς οι 360°;',
        correctText,
        tableData: [
          { item: 'Γωνία οκταγώνου', formula: '135°', val: '135°' },
          { item: 'Γωνία τετραγώνου', formula: '90°', val: '90°' },
          { item: 'Άθροισμα κορυφής', formula: '135° · 2 ＋ 90° ＝ 270° ＋ 90°', val: '360°' }
        ],
        explain: 'Σε κάθε κοινή κορυφή ενώνονται 2 γωνίες οκταγώνου (135° · 2 ＝ 270°) και 1 γωνία τετραγώνου (90°): 270° ＋ 90° ＝ 360°.',
        distractors: [
          '3 κανονικά οκτάγωνα (135° · 3 ＝ 405°)',
          '1 οκτάγωνο και 2 τετράγωνα (135° ＋ 180° ＝ 315°)',
          '2 οκτάγωνα και 2 τετράγωνα (270° ＋ 180° ＝ 450°)'
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Τετραγωνικό μοτίβο τελειών
  const q1N = randInt(5, 12);
  const q1Res = q1N * q1N;

  // Q2: Input - Ακολουθία με σταθερό βήμα
  const q2Start = randInt(2, 6);
  const q2Step = randInt(3, 5);
  const q2A = q2Start;
  const q2B = q2A + q2Step;
  const q2C = q2B + q2Step;
  const q2D = q2C + q2Step;
  const q2Next = q2D + q2Step;

  // Q3: Input - Αυξανόμενο μοτίβο 2n + 1
  const q3N = randInt(6, 14);
  const q3Res = 2 * q3N + 1;

  // Q4: MCQ - Ποια κανονικά πολύγωνα πλακοστρώνουν μόνα τους το επίπεδο
  const q4Options = shuffle([
    'Ισόπλευρα τρίγωνα, τετράγωνα και κανονικά εξάγωνα',
    'Μόνο τετράγωνα και κύκλοι',
    'Κανονικά πεντάγωνα και οκτάγωνα',
    'Όλα τα κανονικά πολύγωνα χωρίς εξαίρεση'
  ]);

  // Q5: True/False - Γεωμετρική αρχή πλακόστρωσης
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Σε μια πλακόστρωση χωρίς κενά, το άθροισμα των γωνιών γύρω από κάθε κοινή κορυφή ισούται πάντα με 360°.'
    : 'Σε μια πλακόστρωση χωρίς κενά, το άθροισμα των γωνιών γύρω από κάθε κοινή κορυφή ισούται πάντα με 180°.';

  // Q6: True/False - Μοτίβα στη φύση
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Οι μέλισσες κατασκευάζουν τις κηρήθρες τους με κανονικά εξάγωνα επειδή εξασφαλίζουν τη μέγιστη χωρητικότητα με το λιγότερο κερί.'
    : 'Οι μέλισσες κατασκευάζουν τις κηρήθρες τους με κανονικά πεντάγωνα που δεν αφήνουν κενά μεταξύ τους.';

  // Q7: Input - Εύρεση του n-οστού όρου σε μοτίβο σπίρτων 3n + 1
  const q7N = randInt(6, 12);
  const q7Res = 3 * q7N + 1;

  // Q8: MCQ - Αρχαιοελληνικός Μαίανδρος
  const q8Options = shuffle([
    'Συνεχής γραμμή που διπλώνει σε ορθές γωνίες (σύμβολο αιωνιότητας)',
    'Σειρά από ομόκεντρους κύκλους',
    'Τυχαία τοποθέτηση τριγώνων χωρίς κανόνα',
    'Μοτίβο από παράλληλες ευθείες χωρίς στροφές'
  ]);

  // Q9: Standard Problem
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate();
  const q9Options = shuffle([
    ...new Set([q9Raw.correctText, ...q9Raw.distractors])
  ]);

  // Q10: Hard Problem
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate();
  const q10Options = shuffle([
    ...new Set([q10Raw.correctText, ...q10Raw.distractors])
  ]);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: 'Τετραγωνικό Μοτίβο Τελειών',
      prompt: `Σε ένα τετραγωνικό μοτίβο τελειών διαστάσεων ${q1N} επί ${q1N}, πόσες τελείες υπάρχουν συνολικά;`,
      correct: String(q1Res),
      explain: `Ο κανόνας είναι n · n: ${q1N} · ${q1N} ＝ ${q1Res} τελείες.`
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: 'Επόμενος Όρος Αριθμητικού Μοτίβου',
      prompt: `Βρες τον επόμενο αριθμό του μοτίβου: ${q2A}, ${q2B}, ${q2C}, ${q2D}, ...`,
      correct: String(q2Next),
      explain: `Σε κάθε βήμα προσθέτουμε ${q2Step} (σταθερό βήμα). Άρα: ${q2D} ＋ ${q2Step} ＝ ${q2Next}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Αυξανόμενο Μοτίβο (2n ＋ 1)',
      prompt: `Ένα γεωμετρικό μοτίβο αυξάνεται με τον κανόνα: Πλήθος ＝ 2 · n ＋ 1. Πόσα στοιχεία έχει στο βήμα n ＝ ${q3N};`,
      correct: String(q3Res),
      explain: `Αντικαθιστούμε n ＝ ${q3N}: (2 · ${q3N}) ＋ 1 ＝ ${2 * q3N} ＋ 1 ＝ ${q3Res}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Πλακόστρωση με Κανονικά Πολύγωνα',
      prompt: 'Ποια κανονικά πολύγωνα μπορούν μόνα τους να πλακοστρώσουν το επίπεδο χωρίς να αφήνουν καθόλου κενά;',
      options: q4Options,
      correct: 'Ισόπλευρα τρίγωνα, τετράγωνα και κανονικά εξάγωνα',
      explain: 'Μόνο αυτά τα 3 κανονικά πολύγωνα έχουν γωνίες που διαιρούν ακριβώς τις 360° (60° · 6 ＝ 360°, 90° · 4 ＝ 360°, 120° · 3 ＝ 360°).'
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Γωνίες Κορυφής στην Πλακόστρωση',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Γύρω από κάθε κοινή κορυφή πρέπει να συμπληρώνεται πλήρης γωνία 360°, ώστε να μην υπάρχει κενό ούτε επικάλυψη.'
        : 'Λάθος! Για να μην υπάρχει κενό, το άθροισμα των γωνιών γύρω από κάθε κορυφή πρέπει να είναι ακριβώς 360° (πλήρης γωνία).'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Γεωμετρικά Μοτίβα στη Φύση',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Η εξαγωνική κηρήθρα είναι η αποδοτικότερη γεωμετρική δομή στη φύση (ελάχιστο περίγραμμα για μέγιστο εμβαδόν).'
        : 'Λάθος! Τα κανονικά πεντάγωνα αφήνουν κενά μεταξύ τους (γωνία 108° · 3 ＝ 324° ≠ 360°). Οι μέλισσες χρησιμοποιούν κανονικά εξάγωνα.'
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: 'Κανόνας Ακολουθίας με Σπίρτα',
      prompt: `Σε μια σειρά ενωμένων τετραγώνων με σπίρτα, ο αριθμός των σπίρτων δίνεται από τον τύπο 3 · n ＋ 1. Πόσα σπίρτα χρειάζονται για n ＝ ${q7N} τετράγωνα;`,
      correct: String(q7Res),
      explain: `Εφαρμόζουμε τον τύπο: (3 · ${q7N}) ＋ 1 ＝ ${3 * q7N} ＋ 1 ＝ ${q7Res} σπίρτα.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Ο Ελληνικός Μαίανδρος στην Τέχνη',
      prompt: 'Ποιο είναι το χαρακτηριστικό γεωμετρικό γνώρισμα του αρχαιοελληνικού μαιάνδρου;',
      options: q8Options,
      correct: 'Συνεχής γραμμή που διπλώνει σε ορθές γωνίες (σύμβολο αιωνιότητας)',
      explain: 'Ο μαίανδρος είναι ένα επαναλαμβανόμενο γραμμικό μοτίβο από ευθύγραμμα τμήματα που συνδέονται σε ορθές γωνίες (90°).'
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

export default function GeometrikaMotibaExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase() : null;
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
      title="Ασκήσεις: Γεωμετρικά Μοτίβα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα γεωμετρικά μοτίβα, τις πλακοστρώσεις, τις ακολουθίες και τα μοτίβα στη φύση για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/63-geometrika-motiba"
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
                <span>ΚΕΦΑΛΑΙΟ 63 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Γεωμετρικά Μοτίβα
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην αναγνώριση κανόνων επανάληψης, στα αυξανόμενα μοτίβα, στις πλακοστρώσεις και στα μοτίβα της φύσης!
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
                          key={`input-${q.id}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode={q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder="Γράψε την απάντηση..."
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
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
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

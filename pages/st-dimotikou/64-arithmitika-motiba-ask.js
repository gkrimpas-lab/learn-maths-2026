// pages/st-dimotikou/64-arithmitika-motiba-ask.js
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
    title: 'Αποταμίευση στον Κουμπαρά',
    unit: '€',
    generate: () => {
      const initAmount = 15;
      const step = 4;
      const weeks = randInt(18, 25);
      const totalAmount = initAmount + weeks * step;
      const correctText = `${totalAmount} €`;
      return {
        prompt: `Ο Νίκος ξεκίνησε να αποταμιεύει έχοντας στον κουμπαρά του ${initAmount} €. Κάθε εβδομάδα προσθέτει σταθερά ${step} €. Πόσα χρήματα θα έχει συγκεντρώσει στο τέλος της ${weeks}ης εβδομάδας;`,
        correctText,
        tableData: [
          { item: 'Αρχικό ποσό', formula: `${initAmount} €`, val: `${initAmount} €` },
          { item: 'Εβδομαδιαίες προσθήκες', formula: `${weeks} · ${step} €`, val: `${weeks * step} €` },
          { item: 'Συνολικό ποσό', formula: `${initAmount} ＋ ${weeks * step} €`, val: `${totalAmount} €` }
        ],
        explain: `Σε ${weeks} εβδομάδες θα προσθέσει συνολικά ${weeks} · ${step} ＝ ${weeks * step} €. Μαζί με τα αρχικά χρήματα: ${initAmount} ＋ ${weeks * step} ＝ ${totalAmount} €.`,
        distractors: [
          `${totalAmount + step} €`,
          `${totalAmount - step * 2} €`,
          `${weeks * step} €`
        ]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Καθίσματα σε Σειρές Θεάτρου',
    unit: 'καθίσματα',
    generate: () => {
      const a1 = 18;
      const diff = 3;
      const rowN = randInt(10, 16);
      const chairs = a1 + (rowN - 1) * diff;
      const correctText = `${chairs} καθίσματα`;
      return {
        prompt: `Σε ένα υπαίθριο θέατρο, η 1η σειρά έχει ${a1} καθίσματα. Κάθε επόμενη σειρά έχει ${diff} περισσότερα καθίσματα από την προηγούμενη. Πόσα καθίσματα έχει η ${rowN}η σειρά;`,
        correctText,
        tableData: [
          { item: '1η σειρά (α₁)', formula: `${a1}`, val: `${a1}` },
          { item: 'Αυξήσεις μέχρι τη σειρά ' + rowN, formula: `(${rowN} － 1) · ${diff}`, val: `${(rowN - 1) * diff}` },
          { item: 'Καθίσματα σειράς ' + rowN, formula: `${a1} ＋ ${(rowN - 1) * diff}`, val: `${chairs} καθίσματα` }
        ],
        explain: `Από την 1η έως τη ${rowN}η σειρά μεσολαβούν ${rowN - 1} αυξήσεις των ${diff} καθισμάτων. Συνολική αύξηση: ${rowN - 1} · ${diff} ＝ ${(rowN - 1) * diff}. Άρα η ${rowN}η σειρά έχει: ${a1} ＋ ${(rowN - 1) * diff} ＝ ${chairs} καθίσματα.`,
        distractors: [
          `${chairs + diff} καθίσματα`,
          `${a1 + rowN * diff} καθίσματα`,
          `${chairs - diff} καθίσματα`
        ]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Κατασκευή Φράχτη με Παλούκια',
    unit: 'παλούκια',
    generate: () => {
      const sections = randInt(15, 35);
      const posts = sections + 1;
      const correctText = `${posts} παλούκια`;
      return {
        prompt: `Σε έναν ευθύγραμμο ξύλινο φράχτη, για να φτιαχτεί 1 τμήμα χρειάζονται 2 παλούκια. Για κάθε επόμενο συνεχόμενο τμήμα χρειάζεται 1 επιπλέον παλούκι. Πόσα παλούκια θα χρειαστούν για έναν φράχτη με ${sections} συνεχόμενα τμήματα;`,
        correctText,
        tableData: [
          { item: '1ο τμήμα', formula: '2 παλούκια', val: '2' },
          { item: 'Επιπλέον τμήματα', formula: `${sections - 1} · 1`, val: `${sections - 1}` },
          { item: 'Σύνολο παλουκιών', formula: `${sections} ＋ 1`, val: `${posts} παλούκια` }
        ],
        explain: `Για n συνεχόμενα τμήματα σε ευθεία γραμμή, τα παλούκια είναι πάντα n ＋ 1. Για ${sections} τμήματα: ${sections} ＋ 1 ＝ ${posts} παλούκια.`,
        distractors: [
          `${sections * 2} παλούκια`,
          `${sections} παλούκια`,
          `${posts + 2} παλούκια`
        ]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Δέντρα σε Δενδροστοιχία',
    unit: 'μέτρα',
    generate: () => {
      const trees = randInt(8, 14);
      const dist = randInt(4, 6);
      const totalDist = (trees - 1) * dist;
      const correctText = `${totalDist} μέτρα`;
      return {
        prompt: `Φυτεύονται ${trees} δέντρα σε ευθεία γραμμή. Η απόσταση ανάμεσα σε δύο διαδοχικά δέντρα είναι σταθερά ${dist} μέτρα. Πόση είναι η συνολική απόσταση από το 1ο έως το τελευταίο δέντρο;`,
        correctText,
        tableData: [
          { item: 'Πλήθος δέντρων', formula: `${trees}`, val: `${trees}` },
          { item: 'Πλήθος ενδιάμεσων διαστημάτων', formula: `${trees} － 1`, val: `${trees - 1}` },
          { item: 'Συνολικό μήκος', formula: `(${trees} － 1) · ${dist} μ.`, val: `${totalDist} μέτρα` }
        ],
        explain: `Ανάμεσα σε ${trees} δέντρα υπάρχουν ${trees - 1} διαστήματα (και όχι ${trees}!). Συνολική απόσταση: ${trees - 1} · ${dist} ＝ ${totalDist} μέτρα.`,
        distractors: [
          `${trees * dist} μέτρα`,
          `${totalDist + dist} μέτρα`,
          `${totalDist - dist} μέτρα`
        ]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Σελίδες Βιβλίου ανά Ημέρα',
    unit: 'σελίδες',
    generate: () => {
      const d = randInt(6, 10);
      const startP = 12;
      const stepP = 5;
      const pages = startP + (d - 1) * stepP;
      const correctText = `${pages} σελίδες`;
      return {
        prompt: `Ένας μαθητής διαβάζει ένα βιβλίο: την 1η ημέρα διαβάζει ${startP} σελίδες και κάθε επόμενη ημέρα διαβάζει ${stepP} σελίδες περισσότερες από την προηγούμενη. Πόσες σελίδες θα διαβάσει την ${d}η ημέρα;`,
        correctText,
        tableData: [
          { item: '1η ημέρα (α₁)', formula: `${startP}`, val: `${startP}` },
          { item: 'Αυξήσεις σε ' + d + ' ημέρες', formula: `(${d} － 1) · ${stepP}`, val: `${(d - 1) * stepP}` },
          { item: 'Σελίδες ' + d + 'ης ημέρας', formula: `${startP} ＋ ${(d - 1) * stepP}`, val: `${pages} σελίδες` }
        ],
        explain: `Την ${d}η ημέρα έχουν προστεθεί ${d - 1} αυξήσεις των ${stepP} σελίδων: (${d} － 1) · ${stepP} ＝ ${(d - 1) * stepP} σελίδες. Σύνολο: ${startP} ＋ ${(d - 1) * stepP} ＝ ${pages} σελίδες.`,
        distractors: [
          `${startP + d * stepP} σελίδες`,
          `${pages + stepP} σελίδες`,
          `${pages - stepP} σελίδες`
        ]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Βαθμίδες Σκάλας με Τούβλα',
    unit: 'τούβλα',
    generate: () => {
      const n = randInt(7, 14);
      const bricks = 3 * n;
      const correctText = `${bricks} τούβλα`;
      return {
        prompt: `Σε μια κτιστή σκάλα, το 1ο σκαλοπάτι χρειάζεται 3 τούβλα, το 2ο σκαλοπάτι 6 τούβλα, το 3ο σκαλοπάτι 9 τούβλα (πολλαπλάσια του 3). Πόσα τούβλα χρειάζονται για να κατασκευαστεί το ${n}ο σκαλοπάτι;`,
        correctText,
        tableData: [
          { item: 'Κανόνας βαθμίδας n', formula: '3 · n', val: `3 · ${n}` },
          { item: 'Τούβλα για n ＝ ' + n, formula: `3 · ${n}`, val: `${bricks} τούβλα` }
        ],
        explain: `Το μοτίβο ακολουθεί τον κανόνα των πολλαπλασίων του 3: 3 · n. Για n ＝ ${n}: 3 · ${n} ＝ ${bricks} τούβλα.`,
        distractors: [
          `${bricks + 3} τούβλα`,
          `${bricks - 3} τούβλα`,
          `${n * 4} τούβλα`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Εύρεση Αριθμού Θέσης (Ποιο ν δίνει το αποτέλεσμα;)',
    unit: '',
    generate: () => {
      const n = randInt(15, 25);
      const targetVal = 4 * n + 3;
      const correctText = `Στη θέση ν ＝ ${n}`;
      return {
        prompt: `Μια αριθμητική ακολουθία έχει γενικό τύπο: Τιμή ＝ 4 · ν ＋ 3. Σε ποια θέση (ν) της ακολουθίας βρίσκεται ο αριθμός ${targetVal};`,
        correctText,
        tableData: [
          { item: 'Εξίσωση μοτίβου', formula: `4 · ν ＋ 3 ＝ ${targetVal}`, val: `4 · ν ＝ ${targetVal} － 3` },
          { item: '1ο βήμα (αφαίρεση)', formula: `${targetVal} － 3`, val: `${targetVal - 3}` },
          { item: '2ο βήμα (διαίρεση)', formula: `${targetVal - 3} : 4`, val: `ν ＝ ${n}` }
        ],
        explain: `Λύνουμε την εξίσωση: 4 · ν ＋ 3 ＝ ${targetVal} ➔ 4 · ν ＝ ${targetVal} － 3 ＝ ${targetVal - 3} ➔ ν ＝ ${targetVal - 3} : 4 ＝ ${n}. Άρα βρίσκεται στη θέση ν ＝ ${n}.`,
        distractors: [
          `Στη θέση ν ＝ ${n + 1}`,
          `Στη θέση ν ＝ ${n - 1}`,
          `Στη θέση ν ＝ ${n + 4}`
        ]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Μοτίβο Διπλασιασμού σε Βακτήρια',
    unit: 'βακτήρια',
    generate: () => {
      const h = 4;
      const initB = 5;
      const finalB = initB * Math.pow(2, h);
      const correctText = `${finalB} βακτήρια`;
      return {
        prompt: `Σε ένα εργαστήριο υπάρχουν αρχικά ${initB} βακτήρια. Ο πληθυσμός τους διπλασιάζεται κάθε ώρα (1η ώρα: 10, 2η ώρα: 20, κ.ο.κ.). Πόσα βακτήρια θα υπάρχουν μετά από ${h} ώρες;`,
        correctText,
        tableData: [
          { item: 'Αρχικός αριθμός', formula: `${initB}`, val: `${initB}` },
          { item: 'Κανόνας ανά ώρα', formula: 'Πολλαπλασιασμός · 2', val: `5 · 2⁴` },
          { item: 'Υπολογισμός 4ης ώρας', formula: `5 · 16`, val: `${finalB} βακτήρια` }
        ],
        explain: `Σε κάθε ώρα ο πληθυσμός διπλασιάζεται: 1η ώρα: 10, 2η ώρα: 20, 3η ώρα: 40, 4η ώρα: 80 βακτήρια (5 · 2⁴ ＝ 5 · 16 ＝ ${finalB}).`,
        distractors: [
          `${finalB / 2} βακτήρια`,
          `${finalB + 20} βακτήρια`,
          `${initB + h * 2} βακτήρια`
        ]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Σύνθετος Κανόνας (2ν ＋ 5)',
    unit: '',
    generate: () => {
      const n = 50;
      const term50 = 2 * n + 5;
      const correctText = String(term50);
      return {
        prompt: `Δίνεται η αριθμητική ακολουθία: 7, 9, 11, 13, 15, ... Ποιος είναι ο 50ός όρος (ν ＝ 50) της ακολουθίας;`,
        correctText,
        tableData: [
          { item: 'Βήμα ακολουθίας', formula: '9 － 7 ＝ 2', val: '＋ 2' },
          { item: 'Γενικός τύπος', formula: '2 · ν ＋ 5', val: 'Για ν ＝ 1: 2 · 1 ＋ 5 ＝ 7' },
          { item: 'Υπολογισμός για ν ＝ 50', formula: '2 · 50 ＋ 5', val: `${term50}` }
        ],
        explain: `Το βήμα είναι ＋2. Ο γενικός κανόνας είναι 2 · ν ＋ 5. Για ν ＝ 50: (2 · 50) ＋ 5 ＝ 100 ＋ 5 ＝ ${term50}.`,
        distractors: [
          String(term50 + 2),
          String(term50 - 2),
          '100'
        ]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Εύρεση του Κρυμμένου Κανόνα από Πίνακα',
    unit: '',
    generate: () => {
      const correctText = '3 · ν ＋ 2';
      return {
        prompt: 'Παρατήρησε τις τιμές: για θέση ν ＝ 1 η τιμή είναι 5, για ν ＝ 2 είναι 8, για ν ＝ 3 είναι 11, για ν ＝ 4 είναι 14. Ποιος είναι ο μαθηματικός κανόνας που συνδέει τη θέση ν με την τιμή;',
        correctText,
        tableData: [
          { item: 'Διαφορά διαδοχικών όρων', formula: '8 － 5 ＝ 3, 11 － 8 ＝ 3', val: 'Το βήμα είναι 3 (3 · ν)' },
          { item: 'Έλεγχος για ν ＝ 1', formula: '3 · 1 ＋ ? ＝ 5', val: '? ＝ 2' },
          { item: 'Γενικός τύπος', formula: '3 · ν ＋ 2', val: 'Ισχύει για όλα τα ν' }
        ],
        explain: 'Επειδή οι τιμές αυξάνονται κατά 3 σε κάθε βήμα, ο τύπος περιέχει το 3 · ν. Για ν ＝ 1: 3 · 1 ＋ 2 ＝ 5. Άρα ο κανόνας είναι 3 · ν ＋ 2.',
        distractors: [
          '3 · ν ＋ 1',
          '2 · ν ＋ 3',
          '4 · ν ＋ 1'
        ]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Φθίνουσα Αριθμητική Ακολουθία',
    unit: '',
    generate: () => {
      const a1 = 100;
      const step = 7;
      const n = 11;
      const termN = a1 - (n - 1) * step;
      const correctText = String(termN);
      return {
        prompt: `Δίνεται η φθίνουσα ακολουθία: 100, 93, 86, 79, ... Ποιος είναι ο 11ος όρος (ν ＝ 11) της ακολουθίας;`,
        correctText,
        tableData: [
          { item: '1ος όρος (α₁)', formula: '100', val: '100' },
          { item: 'Βήμα αφαίρεσης', formula: '93 － 100', val: '－ 7' },
          { item: 'Υπολογισμός 11ου όρου', formula: '100 － (10 · 7)', val: `${termN}` }
        ],
        explain: `Σε κάθε βήμα αφαιρούμε 7. Μέχρι τον 11ο όρο θα αφαιρέσουμε 10 φορές το 7: 10 · 7 ＝ 70. Άρα: 100 － 70 ＝ ${termN}.`,
        distractors: [
          String(termN + 7),
          String(termN - 7),
          '23'
        ]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Άθροισμα των Πρώτων ν Περιττών Αριθμών (ν²)',
    unit: '',
    generate: () => {
      const n = randInt(10, 15);
      const sumOdd = n * n;
      const correctText = String(sumOdd);
      return {
        prompt: `Το άθροισμα των πρώτων ν περιττών αριθμών ισούται πάντα με ν² (π.χ. 1 ＋ 3 ＝ 4 ＝ 2², 1 ＋ 3 ＋ 5 ＝ 9 ＝ 3²). Πόσο ισούται το άθροισμα των πρώτων ${n} περιττών αριθμών;`,
        correctText,
        tableData: [
          { item: 'Πλήθος περιττών (ν)', formula: `${n}`, val: `${n}` },
          { item: 'Μαθηματικό θεώρημα', formula: 'ν · ν ＝ ν²', val: `${n} · ${n}` },
          { item: 'Άθροισμα', formula: `${n}²`, val: `${sumOdd}` }
        ],
        explain: `Το άθροισμα των πρώτων ${n} περιττών αριθμών ισούται με ${n}² ＝ ${n} · ${n} ＝ ${sumOdd}.`,
        distractors: [
          String(sumOdd + n),
          String(sumOdd - n),
          String(n * 2)
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Αύξουσα ακολουθία με σταθερό βήμα
  const q1Start = randInt(2, 7);
  const q1Step = randInt(3, 6);
  const q1A = q1Start;
  const q1B = q1A + q1Step;
  const q1C = q1B + q1Step;
  const q1D = q1C + q1Step;
  const q1Next = q1D + q1Step;

  // Q2: Input - Φθίνουσα ακολουθία με σταθερό βήμα
  const q2Start = randInt(60, 90);
  const q2Step = randInt(4, 7);
  const q2A = q2Start;
  const q2B = q2A - q2Step;
  const q2C = q2B - q2Step;
  const q2D = q2C - q2Step;
  const q2Next = q2D - q2Step;

  // Q3: Input - Υπολογισμός όρου από τύπο 5ν - 2
  const q3N = randInt(6, 12);
  const q3Res = 5 * q3N - 2;

  // Q4: MCQ - Διπλασιασμός (γεωμετρική ακολουθία)
  const q4Start = randInt(2, 4);
  const q4Terms = [q4Start, q4Start * 2, q4Start * 4, q4Start * 8];
  const q4Next = q4Start * 16;
  const q4Options = shuffle([
    String(q4Next),
    String(q4Terms[3] + q4Terms[2]),
    String(q4Next + 4),
    String(q4Terms[3] * 3)
  ]);

  // Q5: True/False - Έννοια όρου ακολουθίας
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Σε μια αριθμητική ακολουθία, κάθε αριθμός ονομάζεται όρος της ακολουθίας και η θέση του συμβολίζεται συνήθως με ν.'
    : 'Σε μια αριθμητική ακολουθία, όρος ονομάζεται μόνο το άθροισμα όλων των αριθμών μαζί.';

  // Q6: True/False - Εύρεση σταθερού βήματος
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Για να βρούμε το σταθερό βήμα σε μια αριθμητική ακολουθία, αρκεί να αφαιρέσουμε δύο διαδοχικούς όρους: (2ος όρος) － (1ος όρος).'
    : 'Σε μια αριθμητική ακολουθία, το σταθερό βήμα υπολογίζεται πάντα πολλαπλασιάζοντας τον 1ο με τον 2ο όρο.';

  // Q7: Input - Υπολογισμός 20ού όρου σε ακολουθία πολλαπλασίων
  const q7Mult = randInt(3, 7);
  const q7Res = q7Mult * 20;

  // Q8: MCQ - Ακολουθία Fibonacci
  const q8Options = shuffle([
    'Κάθε όρος προκύπτει από το άθροισμα των δύο αμέσως προηγούμενων όρων',
    'Σε κάθε βήμα προσθέτουμε σταθερά τον αριθμό 10',
    'Κάθε όρος διπλασιάζεται σε σχέση με τον προηγούμενο',
    'Όλοι οι όροι της ακολουθίας είναι πάντα ίσοι μεταξύ τους'
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
      title: 'Επόμενος Όρος Αύξουσας Ακολουθίας',
      prompt: `Βρες τον επόμενο όρο της ακολουθίας: ${q1A}, ${q1B}, ${q1C}, ${q1D}, ...`,
      correct: String(q1Next),
      explain: `Η ακολουθία έχει σταθερό βήμα ＋${q1Step}. Άρα ο επόμενος όρος είναι: ${q1D} ＋ ${q1Step} ＝ ${q1Next}.`
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: 'Επόμενος Όρος Φθίνουσας Ακολουθίας',
      prompt: `Βρες τον επόμενο όρο της ακολουθίας: ${q2A}, ${q2B}, ${q2C}, ${q2D}, ...`,
      correct: String(q2Next),
      explain: `Η ακολουθία μειώνεται κατά ${q2Step} σε κάθε βήμα (－${q2Step}). Άρα: ${q2D} － ${q2Step} ＝ ${q2Next}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Υπολογισμός Όρου από Γενικό Τύπο',
      prompt: `Ένα αριθμητικό μοτίβο έχει γενικό τύπο: Τιμή ＝ 5 · ν － 2. Ποιος είναι ο ${q3N}ος όρος (για ν ＝ ${q3N});`,
      correct: String(q3Res),
      explain: `Αντικαθιστούμε ν ＝ ${q3N}: (5 · ${q3N}) － 2 ＝ ${5 * q3N} － 2 ＝ ${q3Res}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Ακολουθία με Διπλασιασμό',
      prompt: `Ποιος είναι ο επόμενος όρος της ακολουθίας: ${q4Terms.join(', ')}, ...;`,
      options: q4Options,
      correct: String(q4Next),
      explain: `Κάθε όρος είναι διπλάσιος από τον προηγούμενο (· 2). Άρα: ${q4Terms[3]} · 2 ＝ ${q4Next}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Έννοια Όρου Ακολουθίας',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Κάθε αριθμός σε μια ακολουθία ονομάζεται όρος και η θέση του δηλώνεται με τον δείκτη ν (1ος, 2ος, ... ν-οστός).'
        : 'Λάθος! Κάθε μεμονωμένος αριθμός της ακολουθίας ονομάζεται όρος, όχι το άθροισμά τους.'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Εύρεση Σταθερού Βήματος',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Αφαιρώντας οποιονδήποτε όρο από τον επόμενό του βρίσκουμε το σταθερό βήμα της αριθμητικής ακολουθίας.'
        : 'Λάθος! Το σταθερό βήμα βρίσκεται με αφαίρεση δύο διαδοχικών όρων: (2ος όρος) － (1ος όρος).'
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: 'Υπολογισμός 20ού Όρου',
      prompt: `Στην ακολουθία των πολλαπλασίων του ${q7Mult}: ${q7Mult}, ${q7Mult * 2}, ${q7Mult * 3}, ${q7Mult * 4}, ... ποιος είναι ο 20ός όρος (ν ＝ 20);`,
      correct: String(q7Res),
      explain: `Ο κανόνας είναι ${q7Mult} · ν. Για τον 20ό όρο: ${q7Mult} · 20 ＝ ${q7Res}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Κανόνας της Ακολουθίας Fibonacci',
      prompt: 'Ποιος είναι ο χαρακτηριστικός κανόνας σχηματισμού της ακολουθίας Fibonacci (1, 1, 2, 3, 5, 8, 13, ...);',
      options: q8Options,
      correct: 'Κάθε όρος προκύπτει από το άθροισμα των δύο αμέσως προηγούμενων όρων',
      explain: 'Στην ακολουθία Fibonacci, κάθε αριθμός είναι το άθροισμα των δύο προηγούμενων: π.χ. 1 ＋ 1 ＝ 2, 1 ＋ 2 ＝ 3, 2 ＋ 3 ＝ 5, 3 ＋ 5 ＝ 8 κ.ο.κ.'
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

export default function ArithmitikaMotibaExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').trim().toLowerCase() : null;
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
      title="Ασκήσεις: Αριθμητικά Μοτίβα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα αριθμητικά μοτίβα, τις ακολουθίες, το σταθερό βήμα και τον τύπο του ν-οστού όρου για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/64-arithmitika-motiba"
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
                <span>ΚΕΦΑΛΑΙΟ 64 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Αριθμητικά Μοτίβα &amp; Ακολουθίες
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην αναγνώριση κανόνων ακολουθιών, στον υπολογισμό του ν-οστού όρου και στην επίλυση προβλημάτων καθημερινότητας!
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

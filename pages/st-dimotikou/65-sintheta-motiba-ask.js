// pages/st-dimotikou/65-sintheta-motiba-ask.js
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
    title: 'Χρέωση Διαδρομής Ταξί',
    unit: '€',
    generate: () => {
      const base = 3;
      const perKm = 2;
      const km = randInt(11, 18);
      const total = base + perKm * km;
      const correctText = `${total} €`;
      return {
        prompt: `Ένα ταξί έχει πάγιο εκκίνησης ${base} € και χρεώνει επιπλέον ${perKm} € για κάθε χιλιόμετρο της διαδρομής. Πόσο θα κοστίσει μια διαδρομή μήκους ${km} χιλιομέτρων;`,
        correctText,
        tableData: [
          { item: 'Πάγιο εκκίνησης', formula: `${base} €`, val: `${base} €` },
          { item: 'Χρέωση χιλιομέτρων', formula: `${km} · ${perKm} €`, val: `${km * perKm} €` },
          { item: 'Συνολικό κόστος', formula: `${base} ＋ (${km} · ${perKm}) €`, val: `${total} €` }
        ],
        explain: `Υπολογίζουμε τη χρέωση των χιλιομέτρων: ${km} · ${perKm} ＝ ${km * perKm} €. Προσθέτουμε το πάγιο: ${base} ＋ ${km * perKm} ＝ ${total} €. (Τύπος: ${perKm} · ν ＋ ${base}).`,
        distractors: [
          `${total + perKm} €`,
          `${km * perKm} €`,
          `${total - perKm} €`
        ]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Συνδρομή με Πάγιο & Ταινίες',
    unit: '€',
    generate: () => {
      const base = 6;
      const perItem = 2;
      const items = randInt(7, 12);
      const total = base + perItem * items;
      const correctText = `${total} €`;
      return {
        prompt: `Μια πλατφόρμα ταινιών χρεώνει μηνιαίο πάγιο ${base} € και επιπλέον ${perItem} € για κάθε ταινία που ενοικιάζει ο χρήστης. Πόσα χρήματα θα πληρώσει ένας συνδρομητής που νοίκιασε ${items} ταινίες σε έναν μήνα;`,
        correctText,
        tableData: [
          { item: 'Μηνιαίο πάγιο', formula: `${base} €`, val: `${base} €` },
          { item: 'Ενοικίαση ταινιών', formula: `${items} · ${perItem} €`, val: `${items * perItem} €` },
          { item: 'Τελικός λογαριασμός', formula: `${base} ＋ ${items * perItem} €`, val: `${total} €` }
        ],
        explain: `Κόστος ταινιών: ${items} · ${perItem} ＝ ${items * perItem} €. Προσθέτουμε το πάγιο: ${base} ＋ ${items * perItem} ＝ ${total} €.`,
        distractors: [
          `${total + 4} €`,
          `${items * perItem} €`,
          `${total - 2} €`
        ]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Ενοικίαση Ποδηλάτου',
    unit: '€',
    generate: () => {
      const base = 5;
      const perHour = 3;
      const hours = randInt(4, 8);
      const total = base + perHour * hours;
      const correctText = `${total} €`;
      return {
        prompt: `Ένα κατάστημα ενοικίασης ποδηλάτων χρεώνει 5 € βασικό ποσό ασφάλισης και επιπλέον 3 € για κάθε ώρα χρήσης. Πόσο θα πληρώσει κάποιος που νοίκιασε το ποδήλατο για ${hours} ώρες;`,
        correctText,
        tableData: [
          { item: 'Βασική ασφάλιση', formula: `${base} €`, val: `${base} €` },
          { item: 'Ώρες χρήσης', formula: `${hours} · ${perHour} €`, val: `${hours * perHour} €` },
          { item: 'Συνολικό ποσό', formula: `${base} ＋ ${hours * perHour} €`, val: `${total} €` }
        ],
        explain: `Ώρες: ${hours} · ${perHour} ＝ ${hours * perHour} €. Μαζί με την ασφάλιση: ${base} ＋ ${hours * perHour} ＝ ${total} €.`,
        distractors: [
          `${total + 3} €`,
          `${hours * perHour} €`,
          `${total - 3} €`
        ]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Εγγραφή & Μηνιαία Δίδακτρα',
    unit: '€',
    generate: () => {
      const reg = 20;
      const perMonth = 25;
      const months = randInt(5, 8);
      const total = reg + perMonth * months;
      const correctText = `${total} €`;
      return {
        prompt: `Σε ένα εργαστήριο ρομποτικής η εγγραφή κοστίζει ${reg} € (εφάπαξ) και τα δίδακτρα είναι ${perMonth} € κάθε μήνα. Πόσα χρήματα θα πληρώσει συνολικά ένας μαθητής για ${months} μήνες μαθημάτων;`,
        correctText,
        tableData: [
          { item: 'Εφάπαξ εγγραφή', formula: `${reg} €`, val: `${reg} €` },
          { item: 'Δίδακτρα μηνών', formula: `${months} · ${perMonth} €`, val: `${months * perMonth} €` },
          { item: 'Σύνολο πληρωμής', formula: `${reg} ＋ ${months * perMonth} €`, val: `${total} €` }
        ],
        explain: `Δίδακτρα: ${months} · ${perMonth} ＝ ${months * perMonth} €. Μαζί με την εγγραφή: ${reg} ＋ ${months * perMonth} ＝ ${total} €.`,
        distractors: [
          `${total + perMonth} €`,
          `${months * perMonth} €`,
          `${total - reg} €`
        ]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Κόστος Παραγγελίας με Μεταφορικά',
    unit: '€',
    generate: () => {
      const items = randInt(3, 6);
      const price = randInt(7, 11);
      const shipping = 5;
      const total = items * price + shipping;
      const correctText = `${total} €`;
      return {
        prompt: `Ένα ηλεκτρονικό βιβλιοπωλείο χρεώνει σταθερά ${shipping} € μεταφορικά έξοδα ανά παραγγελία. Αν αγοράσουμε ${items} ίδια βιβλία προς ${price} € το καθένα, ποιο θα είναι το συνολικό κόστος της παραγγελίας;`,
        correctText,
        tableData: [
          { item: 'Αξία βιβλίων', formula: `${items} · ${price} €`, val: `${items * price} €` },
          { item: 'Μεταφορικά έξοδα', formula: `${shipping} €`, val: `${shipping} €` },
          { item: 'Τελικό κόστος', formula: `${items * price} ＋ ${shipping} €`, val: `${total} €` }
        ],
        explain: `Βιβλία: ${items} · ${price} ＝ ${items * price} €. Μεταφορικά: ${items * price} ＋ ${shipping} ＝ ${total} €.`,
        distractors: [
          `${items * price} €`,
          `${total + shipping} €`,
          `${total - 2} €`
        ]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Αποταμίευση με Αρχικό Ποσό & Σταθερή Κατάθεση',
    unit: '€',
    generate: () => {
      const initP = 40;
      const perM = 15;
      const months = randInt(6, 10);
      const total = initP + months * perM;
      const correctText = `${total} €`;
      return {
        prompt: `Η Μαρία έχει ήδη ${initP} € στον τραπεζικό της λογαριασμό. Αποφασίζει να καταθέτει ${perM} € στο τέλος κάθε μήνα. Πόσα χρήματα θα έχει στον λογαριασμό της μετά από ${months} μήνες;`,
        correctText,
        tableData: [
          { item: 'Αρχικό υπόλοιπο', formula: `${initP} €`, val: `${initP} €` },
          { item: 'Μηνιαίες καταθέσεις', formula: `${months} · ${perM} €`, val: `${months * perM} €` },
          { item: 'Τελικό υπόλοιπο', formula: `${initP} ＋ ${months * perM} €`, val: `${total} €` }
        ],
        explain: `Σε ${months} μήνες καταθέτει: ${months} · ${perM} ＝ ${months * perM} €. Συνολικό ποσό: ${initP} ＋ ${months * perM} ＝ ${total} €.`,
        distractors: [
          `${months * perM} €`,
          `${total + perM} €`,
          `${total - initP} €`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Σύνθετο Μοτίβο με Μεταβαλλόμενο Βήμα (+2, +3, +4, +5...)',
    unit: '',
    generate: () => {
      const n = 8;
      const val = (n * (n + 1)) / 2;
      const correctText = String(val);
      return {
        prompt: 'Παρατήρησε την ακολουθία: 1, 3, 6, 10, 15, 21, ... (το βήμα αυξάνεται κατά 1 σε κάθε στάδιο: ＋2, ＋3, ＋4, ＋5, ＋6...). Ποιος είναι ο 8ος όρος της ακολουθίας;',
        correctText,
        tableData: [
          { item: '6ος όρος', formula: '21', val: '21' },
          { item: '7ος όρος (＋7)', formula: '21 ＋ 7', val: '28' },
          { item: '8ος όρος (＋8)', formula: '28 ＋ 8', val: `${val}` }
        ],
        explain: `Μετά το 21 προσθέτουμε 7 για τον 7ο όρο (21 ＋ 7 ＝ 28) και έπειτα προσθέτουμε 8 για τον 8ο όρο: 28 ＋ 8 ＝ ${val}. (Τύπος: [8 · 9] : 2 ＝ 36).`,
        distractors: [
          String(val - 2),
          String(val + 4),
          '30'
        ]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Εύρεση του ν σε Σύνθετο Τύπο',
    unit: '',
    generate: () => {
      const n = randInt(15, 24);
      const mult = 5;
      const add = 7;
      const target = mult * n + add;
      const correctText = `ν ＝ ${n}`;
      return {
        prompt: `Σε ένα σύνθετο αριθμητικό μοτίβο η τιμή του όρου υπολογίζεται από τον τύπο: Τιμή ＝ ${mult} · ν ＋ ${add}. Για ποια θέση ν η τιμή ισούται με ${target};`,
        correctText,
        tableData: [
          { item: 'Εξίσωση', formula: `${mult} · ν ＋ ${add} ＝ ${target}`, val: `${mult} · ν ＝ ${target} － ${add}` },
          { item: '1ο βήμα (αφαίρεση)', formula: `${target} － ${add}`, val: `${target - add}` },
          { item: '2ο βήμα (διαίρεση)', formula: `${target - add} : ${mult}`, val: `ν ＝ ${n}` }
        ],
        explain: `Σχηματίζουμε την εξίσωση: ${mult} · ν ＋ ${add} ＝ ${target} ➔ ${mult} · ν ＝ ${target - add} ➔ ν ＝ ${target - add} : ${mult} ＝ ${n}.`,
        distractors: [
          `ν ＝ ${n + 1}`,
          `ν ＝ ${n - 1}`,
          `ν ＝ ${n + 2}`
        ]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Εναλλασσόμενο Μοτίβο Δύο Πράξεων (· 2 και － 1)',
    unit: '',
    generate: () => {
      const a1 = 2;
      const a2 = a1 * 2 - 1;
      const a3 = a2 * 2 - 1;
      const a4 = a3 * 2 - 1;
      const a5 = a4 * 2 - 1;
      const a6 = a5 * 2 - 1;
      const a7 = a6 * 2 - 1;
      const correctText = String(a7);
      return {
        prompt: `Παρατήρησε την ακολουθία: ${a1}, ${a2}, ${a3}, ${a4}, ${a5}, ${a6}, ... Ποιος είναι ο αμέσως επόμενος αριθμός;`,
        correctText,
        tableData: [
          { item: 'Κανόνας', formula: '· 2 － 1', val: 'Διπλασιάζουμε και αφαιρούμε 1' },
          { item: 'Τελευταίος γνωστός όρος', formula: `${a6}`, val: `${a6}` },
          { item: 'Επόμενος όρος', formula: `(${a6} · 2) － 1 ＝ ${a6 * 2} － 1`, val: `${a7}` }
        ],
        explain: `Κάθε όρος προκύπτει διπλασιάζοντας τον προηγούμενο και αφαιρώντας 1: (${a6} · 2) － 1 ＝ ${a6 * 2} － 1 ＝ ${a7}.`,
        distractors: [
          String(a6 * 2),
          String(a7 + 2),
          String(a7 - 4)
        ]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Σύγκριση Δύο Σύνθετων Προγραμμάτων Χρέωσης',
    unit: '',
    generate: () => {
      const correctText = 'Στις 5 ώρες χρήσης (κόστος 15 € και στα δύο)';
      return {
        prompt: 'Ένα γυμναστήριο προσφέρει δύο προγράμματα: Το Πρόγραμμα Α χρεώνει 10 € πάγιο συνδρομής και 1 € για κάθε επίσκεψη. Το Πρόγραμμα Β δεν έχει πάγιο αλλά χρεώνει 3 € ανά επίσκεψη. Για πόσες επισκέψεις το κόστος είναι ακριβώς το ίδιο και στα δύο προγράμματα;',
        correctText,
        tableData: [
          { item: 'Πρόγραμμα Α (ν επισκέψεις)', formula: '1 · ν ＋ 10', val: 'ν ＋ 10' },
          { item: 'Πρόγραμμα Β (ν επισκέψεις)', formula: '3 · ν', val: '3 · ν' },
          { item: 'Εξίσωση ισότητας', formula: '3 · ν ＝ ν ＋ 10 ➔ 2 · ν ＝ 10', val: 'ν ＝ 5 επισκέψεις (5 · 3 ＝ 15 €)' }
        ],
        explain: 'Εξισώνουμε τα δύο μοτίβα: 3 · ν ＝ ν ＋ 10 ➔ 2 · ν ＝ 10 ➔ ν ＝ 5 επισκέψεις. Και στα δύο προγράμματα το κόστος για 5 επισκέψεις είναι 15 €.',
        distractors: [
          'Στις 4 ώρες χρήσης',
          'Στις 6 ώρες χρήσης',
          'Στις 10 ώρες χρήσης'
        ]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Σύνθετο Μοτίβο με Τετράγωνα & Προσθήκη (ν² ＋ 2)',
    unit: '',
    generate: () => {
      const n = 10;
      const res = n * n + 2;
      const correctText = String(res);
      return {
        prompt: `Δίνεται η ακολουθία: 3, 6, 11, 18, 27, ... που ακολουθεί τον κανόνα: Τιμή ＝ ν² ＋ 2. Ποιος είναι ο 10ος όρος (ν ＝ 10) της ακολουθίας;`,
        correctText,
        tableData: [
          { item: 'Κανόνας', formula: 'ν · ν ＋ 2', val: '10 · 10 ＋ 2' },
          { item: 'Υπολογισμός τετραγώνου', formula: '10²', val: '100' },
          { item: 'Τελική τιμή', formula: '100 ＋ 2', val: `${res}` }
        ],
        explain: `Για ν ＝ 10 εφαρμόζουμε τον κανόνα ν² ＋ 2: 10 · 10 ＋ 2 ＝ 100 ＋ 2 ＝ ${res}.`,
        distractors: [
          String(res + 2),
          String(res - 4),
          '100'
        ]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Πυραμίδα Αριθμών με Άθροισμα',
    unit: '',
    generate: () => {
      return {
        prompt: 'Παρατήρησε το σύνθετο μοτίβο των αριθμών: 4 ➔ 7 ➔ 12 ➔ 19 ➔ ... (οι διαφορές είναι: ＋3, ＋5, ＋7, ... διαδοχικοί περιττοί αριθμοί). Ποιος είναι ο αμέσως επόμενος αριθμός μετά το 19;',
        correctText: '28',
        tableData: [
          { item: 'Διαφορές', formula: '7 － 4 ＝ 3, 12 － 7 ＝ 5, 19 － 12 ＝ 7', val: '＋3, ＋5, ＋7' },
          { item: 'Επόμενη διαφορά', formula: 'Επόμενος περιττός αριθμός', val: '＋9' },
          { item: 'Επόμενος όρος', formula: '19 ＋ 9', val: '28' }
        ],
        explain: 'Οι διαφορές ανάμεσα στους όρους είναι οι περιττοί αριθμοί 3, 5, 7, 9. Μετά το 19 προσθέτουμε 9: 19 ＋ 9 ＝ 28.',
        distractors: ['26', '27', '30']
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Σύνθετο μοτίβο με διπλή πράξη (· 2 ＋ 1)
  const q1A = randInt(2, 4);
  const q1B = q1A * 2 + 1;
  const q1C = q1B * 2 + 1;
  const q1D = q1C * 2 + 1;
  const q1Next = q1D * 2 + 1;

  // Q2: Input - Εναλλασσόμενο μοτίβο (+stepAdd, -1)
  const q2Start = randInt(4, 8);
  const q2StepAdd = randInt(3, 5);
  const q2StepSub = 1;
  const q2_1 = q2Start;
  const q2_2 = q2_1 + q2StepAdd;
  const q2_3 = q2_2 - q2StepSub;
  const q2_4 = q2_3 + q2StepAdd;
  const q2_5 = q2_4 - q2StepSub;
  const q2Next = q2_5 + q2StepAdd;

  // Q3: Input - Υπολογισμός όρου από σύνθετο τύπο: 3ν + 4
  const q3N = randInt(6, 12);
  const q3Res = 3 * q3N + 4;

  // Q4: MCQ - Αναγνώριση κανόνα από ακολουθία
  const q4Options = shuffle([
    'Πολλαπλασιάζουμε επί 2 και προσθέτουμε 1 (· 2 ＋ 1)',
    'Προσθέτουμε σταθερά τον αριθμό 4',
    'Πολλαπλασιάζουμε σταθερά επί 3',
    'Διαιρούμε με το 2 και προσθέτουμε 5'
  ]);

  // Q5: True/False - Έννοια σύνθετου μοτίβου
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Σε ένα σύνθετο μοτίβο, ο κανόνας μπορεί να περιλαμβάνει περισσότερες από μία πράξεις (π.χ. πολλαπλασιασμό και πρόσθεση μαζί).'
    : 'Σε κάθε μοτίβο η διαφορά ανάμεσα σε δύο διαδοχικούς όρους είναι υποχρεωτικά ένας σταθερός αριθμός.';

  // Q6: True/False - Πίνακες δύο μεγεθών
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Ένας πίνακας τιμών δύο μεγεθών μάς βοηθά να παρατηρήσουμε πώς μεταβάλλεται ένα μέγεθος καθώς αλλάζει ένα άλλο (π.χ. χρόνος και κόστος).'
    : 'Στους πίνακες τιμών δύο μεγεθών τα δύο μεγέθη είναι πάντοτε εντελώς ανεξάρτητα και δεν συνδέονται ποτέ με μαθηματικό κανόνα.';

  // Q7: Input - Εφαρμογή τύπου κόστους (4ν + 5)
  const q7N = randInt(8, 15);
  const q7Res = 4 * q7N + 5;

  // Q8: MCQ - Εύρεση γενικού τύπου από ζεύγη τιμών
  const q8Options = shuffle([
    '4 · ν ＋ 1',
    '3 · ν ＋ 2',
    '5 · ν － 1',
    '2 · ν ＋ 3'
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
      title: 'Σύνθετο Μοτίβο (· 2 ＋ 1)',
      prompt: `Βρες τον επόμενο όρο της ακολουθίας: ${q1A}, ${q1B}, ${q1C}, ${q1D}, ...`,
      correct: String(q1Next),
      explain: `Σε κάθε βήμα διπλασιάζουμε και προσθέτουμε 1: (${q1D} · 2) ＋ 1 ＝ ${q1D * 2} ＋ 1 ＝ ${q1Next}.`
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: `Εναλλασσόμενο Μοτίβο (＋${q2StepAdd}, －1)`,
      prompt: `Βρες τον επόμενο αριθμό της ακολουθίας: ${q2_1}, ${q2_2}, ${q2_3}, ${q2_4}, ${q2_5}, ...`,
      correct: String(q2Next),
      explain: `Οι πράξεις εναλλάσσονται: ＋${q2StepAdd} και μετά －1. Μετά το ${q2_5} προσθέτουμε ${q2StepAdd}: ${q2_5} ＋ ${q2StepAdd} ＝ ${q2Next}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Υπολογισμός από Σύνθετο Τύπο',
      prompt: `Ένα σύνθετο μοτίβο έχει γενικό τύπο: Τιμή ＝ 3 · ν ＋ 4. Ποια είναι η τιμή για θέση ν ＝ ${q3N};`,
      correct: String(q3Res),
      explain: `Αντικαθιστούμε ν ＝ ${q3N}: (3 · ${q3N}) ＋ 4 ＝ ${3 * q3N} ＋ 4 ＝ ${q3Res}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Αναγνώριση Σύνθετου Κανόνα',
      prompt: 'Ποιος είναι ο κανόνας σχηματισμού της ακολουθίας: 3, 7, 15, 31, 63, ...;',
      options: q4Options,
      correct: 'Πολλαπλασιάζουμε επί 2 και προσθέτουμε 1 (· 2 ＋ 1)',
      explain: 'Παρατηρούμε: 3 · 2 ＋ 1 ＝ 7, 7 · 2 ＋ 1 ＝ 15, 15 · 2 ＋ 1 ＝ 31, 31 · 2 ＋ 1 ＝ 63. Ο κανόνας συνδυάζει πολλαπλασιασμό και πρόσθεση.'
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Χαρακτηριστικό Σύνθετων Μοτίβων',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Στα σύνθετα μοτίβα ο κανόνας μπορεί να περιλαμβάνει περισσότερες από μία πράξεις ή μεταβαλλόμενα βήματα.'
        : 'Λάθος! Υπάρχουν πολλά μοτίβα όπου η διαφορά δεν είναι σταθερή αλλά αλλάζει (π.χ. πολλαπλασιασμός, εναλλαγή πράξεων).'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Πίνακες Συσχέτισης Μεγεθών',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Ένας πίνακας τιμών δύο μεγεθών αποτυπώνει καθαρά τη μαθηματική σχέση ανάμεσα σε δύο μεταβλητές.'
        : 'Λάθος! Οι πίνακες δύο μεγεθών κατασκευάζονται ακριβώς για να ανακαλύψουμε και να μελετήσουμε τον κανόνα που συνδέει τα δύο μεγέθη.'
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: 'Εφαρμογή Κανόνα (4 · ν ＋ 5)',
      prompt: `Ένα σύστημα χρέωσης ακολουθεί τον τύπο: Κόστος ＝ 4 · ν ＋ 5. Πόσο είναι το κόστος για ν ＝ ${q7N};`,
      correct: String(q7Res),
      explain: `Εφαρμόζουμε τον τύπο για ν ＝ ${q7N}: (4 · ${q7N}) ＋ 5 ＝ ${4 * q7N} ＋ 5 ＝ ${q7Res}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Εύρεση Τύπου από Ζεύγη Τιμών',
      prompt: 'Για θέση ν ＝ 1 η τιμή είναι 5, για ν ＝ 2 είναι 9, για ν ＝ 3 είναι 13, για ν ＝ 4 είναι 17. Ποιος είναι ο γενικός τύπος;',
      options: q8Options,
      correct: '4 · ν ＋ 1',
      explain: 'Η διαφορά ανάμεσα στις τιμές είναι 4 (άρα περιέχει το 4 · ν). Για ν ＝ 1: 4 · 1 ＋ 1 ＝ 5. Άρα ο τύπος είναι 4 · ν ＋ 1.'
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

export default function SinthetaMotibaExercisesPage() {
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
      title="Ασκήσεις: Σύνθετα Μοτίβα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα σύνθετα μοτίβα, τους διπλούς κανόνες, τους πίνακες δύο μεγεθών και τα προβλήματα καθημερινότητας για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/65-sintheta-motiba"
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
                <span>ΚΕΦΑΛΑΙΟ 65 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Σύνθετα Μοτίβα &amp; Σχέσεις Μεγεθών
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στους διπλούς κανόνες, στα εναλλασσόμενα μοτίβα, στους πίνακες δύο μεγεθών και στην εύρεση του γενικού τύπου!
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

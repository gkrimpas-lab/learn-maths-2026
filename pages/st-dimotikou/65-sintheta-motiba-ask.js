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
        explain: 'Εξισώνουμε τα δύο μοτίβα: 3 · ν ＝ ν ＋ 10 ➔ 2 · ν ＝ 10 ➔ ν ＝ 5 επισκέψεις. Και στα δύο προγράμματα το κόστος για 5 επισκέψ

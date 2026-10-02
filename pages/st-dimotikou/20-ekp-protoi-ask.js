// pages/st-dimotikou/20-ekp-protoi-ask.js
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

// Αφαιρεση τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποιηση αριθμων με ελληνικο locale
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
    title: 'Φανάρια Σηματοδότησης',
    unit: 'δευτερόλεπτα',
    generate: () => {
      // 12 = 2² · 3, 18 = 2 · 3² -> ΕΚΠ = 36
      const n1 = 12;
      const n2 = 18;
      const f1 = '2² · 3';
      const f2 = '2 · 3²';
      const ekpExpr = '2² · 3²';
      const ekpVal = 36;
      return {
        prompt: `Σε μια διασταύρωση, ένα πράσινο φανάρι πεζών ανάβει κάθε ${n1} δευτερόλεπτα και ένα άλλο κάθε ${n1 + 6} δευτερόλεπτα. Αν άναψαν μαζί τώρα, μετά από πόσα δευτερόλεπτα θα ανάψουν ξανά ταυτόχρονα; (Δίνονται: ${n1} ＝ ${f1} και ${n2} ＝ ${f2})`,
        unit: 'δευτερόλεπτα',
        correctVal: ekpVal,
        correctText: `${ekpVal} δευτερόλεπτα`,
        tableData: [
          { item: '1ο Φανάρι', analysis: f1, value: `${n1} δευτ.` },
          { item: '2ο Φανάρι', analysis: f2, value: `${n2} δευτ.` },
          { item: 'Ε.Κ.Π.', analysis: `${ekpExpr} ＝ 4 · 9`, value: `${ekpVal} δευτ.` }
        ],
        explain: `Αναλύουμε σε πρώτους παράγοντες: ${n1} ＝ ${f1} και ${n2} ＝ ${f2}. Παίρνουμε τους κοινούς και μη κοινούς παράγοντες με τον μεγαλύτερο εκθέτη: Ε.Κ.Π. ＝ ${ekpExpr} ＝ 4 · 9 ＝ ${ekpVal} δευτερόλεπτα.`,
        distractors: [24, 48, 72]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Αναχώρηση Λεωφορείων',
    unit: 'λεπτά',
    generate: () => {
      // 15 = 3 · 5, 20 = 2² · 5 -> ΕΚΠ = 60
      const n1 = 15;
      const n2 = 20;
      const f1 = '3 · 5';
      const f2 = '2² · 5';
      const ekpExpr = '2² · 3 · 5';
      const ekpVal = 60;
      return {
        prompt: `Από έναν σταθμό, το λεωφορείο γραμμής Α αναχωρεί κάθε ${n1} λεπτά και το λεωφορείο γραμμής Β κάθε ${n2} λεπτά. Μετά από πόσα λεπτά θα αναχωρήσουν ξανά ταυτόχρονα; (Δίνονται: ${n1} ＝ ${f1} και ${n2} ＝ ${f2})`,
        unit: 'λεπτά',
        correctVal: ekpVal,
        correctText: `${ekpVal} λεπτά`,
        tableData: [
          { item: 'Γραμμή Α', analysis: f1, value: `${n1} λεπτά` },
          { item: 'Γραμμή Β', analysis: f2, value: `${n2} λεπτά` },
          { item: 'Ε.Κ.Π.', analysis: `${ekpExpr} ＝ 4 · 3 · 5`, value: `${ekpVal} λεπτά` }
        ],
        explain: `Εφαρμόζουμε τον κανόνα των μέγιστων εκθετών: Ε.Κ.Π.(${n1}, ${n2}) ＝ ${ekpExpr} ＝ 4 · 3 · 5 ＝ ${ekpVal} λεπτά (δηλαδή σε 1 ώρα).`,
        distractors: [30, 45, 90]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Συναγερμοί Συντήρησης',
    unit: 'ώρες',
    generate: () => {
      // 24 = 2³ · 3, 36 = 2² · 3² -> ΕΚΠ = 72
      const n1 = 24;
      const n2 = 36;
      const f1 = '2³ · 3';
      const f2 = '2² · 3²';
      const ekpExpr = '2³ · 3²';
      const ekpVal = 72;
      return {
        prompt: `Σε ένα εργοστάσιο, δύο μηχανήματα χρειάζονται περιοδικό έλεγχο. Το πρώτο ελέγχεται κάθε ${n1} ώρες και το δεύτερο κάθε ${n2} ώρες. Κάθε πόσες ώρες συμπίπτει ο έλεγχος και των δύο; (Δίνονται: ${n1} ＝ ${f1} και ${n2} ＝ ${f2})`,
        unit: 'ώρες',
        correctVal: ekpVal,
        correctText: `${ekpVal} ώρες`,
        tableData: [
          { item: 'Μηχάνημα 1', analysis: f1, value: `${n1} ώρες` },
          { item: 'Μηχάνημα 2', analysis: f2, value: `${n2} ώρες` },
          { item: 'Ε.Κ.Π.', analysis: `${ekpExpr} ＝ 8 · 9`, value: `${ekpVal} ώρες` }
        ],
        explain: `Παίρνουμε τους κοινούς παράγοντες με τον μέγιστο εκθέτη: για το 2 είναι 2³ και για το 3 είναι 3². Άρα Ε.Κ.Π. ＝ 2³ · 3² ＝ 8 · 9 ＝ ${ekpVal} ώρες.`,
        distractors: [48, 60, 96]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Πότισμα Κήπου',
    unit: 'ημέρες',
    generate: () => {
      // 8 = 2³, 12 = 2² · 3 -> ΕΚΠ = 24
      const n1 = 8;
      const n2 = 12;
      const f1 = '2³';
      const f2 = '2² · 3';
      const ekpExpr = '2³ · 3';
      const ekpVal = 24;
      return {
        prompt: `Ένας κηπουρός λιπαίνει τα τριαντάφυλλα κάθε ${n1} ημέρες και τις λεμονιές κάθε ${n2} ημέρες. Κάθε πόσες ημέρες θα συμπίπτει η λίπανση και των δύο; (Δίνονται: ${n1} ＝ ${f1} και ${n2} ＝ ${f2})`,
        unit: 'ημέρες',
        correctVal: ekpVal,
        correctText: `${ekpVal} ημέρες`,
        tableData: [
          { item: 'Τριαντάφυλλα', analysis: f1, value: `${n1} ημέρες` },
          { item: 'Λεμονιές', analysis: f2, value: `${n2} ημέρες` },
          { item: 'Ε.Κ.Π.', analysis: `${ekpExpr} ＝ 8 · 3`, value: `${ekpVal} ημέρες` }
        ],
        explain: `Επιλέγουμε κοινούς και μη κοινούς με τον μεγαλύτερο εκθέτη: Ε.Κ.Π. ＝ ${ekpExpr} ＝ 8 · 3 ＝ ${ekpVal} ημέρες.`,
        distractors: [16, 32, 40]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Κουδούνια Σχολείου',
    unit: 'λεπτά',
    generate: () => {
      // 20 = 2² · 5, 30 = 2 · 3 · 5 -> ΕΚΠ = 60
      const n1 = 20;
      const n2 = 30;
      const f1 = '2² · 5';
      const f2 = '2 · 3 · 5';
      const ekpExpr = '2² · 3 · 5';
      const ekpVal = 60;
      return {
        prompt: `Σε ένα εκπαιδευτικό κέντρο, το κουδούνι του Δημοτικού χτυπά κάθε ${n1} λεπτά και του Γυμνασίου κάθε ${n2} λεπτά. Μετά από πόσα λεπτά θα χτυπήσουν ξανά ταυτόχρονα; (Δίνονται: ${n1} ＝ ${f1} και ${n2} ＝ ${f2})`,
        unit: 'λεπτά',
        correctVal: ekpVal,
        correctText: `${ekpVal} λεπτά`,
        tableData: [
          { item: 'Δημοτικό', analysis: f1, value: `${n1} λεπτά` },
          { item: 'Γυμνάσιο', analysis: f2, value: `${n2} λεπτά` },
          { item: 'Ε.Κ.Π.', analysis: `${ekpExpr} ＝ 4 · 3 · 5`, value: `${ekpVal} λεπτά` }
        ],
        explain: `Κοινοί και μη κοινοί με μέγιστο εκθέτη: 2² · 3 · 5 ＝ 4 · 3 · 5 ＝ ${ekpVal} λεπτά.`,
        distractors: [40, 50, 80]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Συσκευασίες Προϊόντων',
    unit: 'τεμάχια',
    generate: () => {
      // 18 = 2 · 3², 24 = 2³ · 3 -> ΕΚΠ = 72
      const n1 = 18;
      const n2 = 24;
      const f1 = '2 · 3²';
      const f2 = '2³ · 3';
      const ekpExpr = '2³ · 3²';
      const ekpVal = 72;
      return {
        prompt: `Ένα κατάστημα πουλάει μαρκαδόρους σε πακέτα των ${n1} και μολύβια σε πακέτα των ${n2}. Ποιος είναι ο ελάχιστος αριθμός μαρκαδόρων και μολυβιών που πρέπει να αγοράσουμε για να έχουμε ακριβώς το ίδιο πλήθος από το καθένα; (Δίνονται: ${n1} ＝ ${f1} και ${n2} ＝ ${f2})`,
        unit: 'τεμάχια',
        correctVal: ekpVal,
        correctText: `${ekpVal} τεμάχια`,
        tableData: [
          { item: 'Μαρκαδόροι', analysis: f1, value: `πακέτα των ${n1}` },
          { item: 'Μολύβια', analysis: f2, value: `πακέτα των ${n2}` },
          { item: 'Ε.Κ.Π.', analysis: `${ekpExpr} ＝ 8 · 9`, value: `${ekpVal} τεμάχια` }
        ],
        explain: `Για να ισοσκελιστεί η ποσότητα, αναζητούμε το Ε.Κ.Π. των συσκευασιών: Ε.Κ.Π.(${n1}, ${n2}) ＝ 2³ · 3² ＝ 8 · 9 ＝ ${ekpVal} τεμάχια.`,
        distractors: [36, 48, 96]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Περιστροφή Δορυφόρων σε Τροχιά',
    unit: 'ώρες',
    generate: () => {
      // 40 = 2³ · 5, 50 = 2 · 5² -> ΕΚΠ = 2³ · 5² = 8 · 25 = 200
      const n1 = 40;
      const n2 = 50;
      const f1 = '2³ · 5';
      const f2 = '2 · 5²';
      const ekpExpr = '2³ · 5²';
      const ekpVal = 200;
      return {
        prompt: `Δύο δορυφόροι περιστρέφονται γύρω από τη Γη. Ο πρώτος ολοκληρώνει μία πλήρη περιστροφή σε ${n1} ώρες (${f1}) και ο δεύτερος σε ${n2} ώρες (${f2}). Αν συναντήθηκαν πάνω από τον ίδιο σταθμό τώρα, μετά από πόσες ώρες θα ξαναβρεθούν ταυτόχρονα πάνω από το ίδιο σημείο;`,
        unit: 'ώρες',
        correctVal: ekpVal,
        correctText: `${ekpVal} ώρες`,
        tableData: [
          { item: '1ος Δορυφόρος', analysis: f1, value: `${n1} ώρες` },
          { item: '2ος Δορυφόρος', analysis: f2, value: `${n2} ώρες` },
          { item: 'Ε.Κ.Π.(40, 50)', analysis: `${ekpExpr} ＝ 8 · 25`, value: `${ekpVal} ώρες` }
        ],
        explain: `Εφαρμόζουμε τον κανόνα των μέγιστων εκθετών: για τη βάση 2 παίρνουμε 2³ και για τη βάση 5 παίρνουμε 5². Άρα Ε.Κ.Π. ＝ 2³ · 5² ＝ 8 · 25 ＝ ${ekpVal} ώρες.`,
        distractors: [100, 150, 400]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Γραμμές Παραγωγής Εργοστασίου',
    unit: 'λεπτά',
    generate: () => {
      // 45 = 3² · 5, 60 = 2² · 3 · 5 -> ΕΚΠ = 2² · 3² · 5 = 4 · 9 · 5 = 180
      const n1 = 45;
      const n2 = 60;
      const f1 = '3² · 5';
      const f2 = '2² · 3 · 5';
      const ekpExpr = '2² · 3² · 5';
      const ekpVal = 180;
      return {
        prompt: `Δύο ρομποτικές γραμμές παραγωγής συσκευάζουν κιβώτια. Η πρώτη γραμμή ολοκληρώνει έναν κύκλο κάθε ${n1} λεπτά (${f1}) και η δεύτερη κάθε ${n2} λεπτά (${f2}). Μετά από πόσα λεπτά θα ολοκληρώσουν ταυτόχρονα τον κύκλο τους;`,
        unit: 'λεπτά',
        correctVal: ekpVal,
        correctText: `${ekpVal} λεπτά`,
        tableData: [
          { item: 'Γραμμή Α', analysis: f1, value: `${n1} λεπτά` },
          { item: 'Γραμμή Β', analysis: f2, value: `${n2} λεπτά` },
          { item: 'Ε.Κ.Π.(45, 60)', analysis: `${ekpExpr} ＝ 4 · 9 · 5`, value: `${ekpVal} λεπτά` }
        ],
        explain: `Επιλέγουμε όλους τους παράγοντες (κοινούς και μη κοινούς) με τον μεγαλύτερο εκθέτη: 2² · 3² · 5 ＝ 4 · 9 · 5 ＝ ${ekpVal} λεπτά (δηλαδή 3 ώρες).`,
        distractors: [120, 240, 360]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Συντονισμός 3 Πλοίων',
    unit: 'ημέρες',
    generate: () => {
      // 8 = 2³, 12 = 2² · 3, 15 = 3 · 5 -> ΕΚΠ = 2³ · 3 · 5 = 8 · 3 · 5 = 120
      const n1 = 8;
      const n2 = 12;
      const n3 = 15;
      const f1 = '2³';
      const f2 = '2² · 3';
      const f3 = '3 · 5';
      const ekpExpr = '2³ · 3 · 5';
      const ekpVal = 120;
      return {
        prompt: `Τρία εμπορικά πλοία εκτελούν κυκλικά δρομολόγια από το λιμάνι του Πειραιά. Το πρώτο επιστρέφει κάθε ${n1} ημέρες (${f1}), το δεύτερο κάθε ${n2} ημέρες (${f2}) και το τρίτο κάθε ${n3} ημέρες (${f3}). Κάθε πόσες ημέρες θα συναντώνται και τα τρία ταυτόχρονα στο λιμάνι;`,
        unit: 'ημέρες',
        correctVal: ekpVal,
        correctText: `${ekpVal} ημέρες`,
        tableData: [
          { item: 'Πλοίο 1', analysis: f1, value: `${n1} ημέρες` },
          { item: 'Πλοίο 2', analysis: f2, value: `${n2} ημέρες` },
          { item: 'Πλοίο 3', analysis: f3, value: `${n3} ημέρες` },
          { item: 'Ε.Κ.Π.(8, 12, 15)', analysis: `${ekpExpr} ＝ 8 · 3 · 5`, value: `${ekpVal} ημέρες` }
        ],
        explain: `Στο Ε.Κ.Π. 3 αριθμών παίρνουμε όλους τους πρώτους παράγοντες με τους μέγιστους εκθέτες: 2³ · 3 · 5 ＝ 8 · 3 · 5 ＝ ${ekpVal} ημέρες.`,
        distractors: [60, 90, 180]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Αθλητές σε Κυκλικό Στίβο',
    unit: 'δευτερόλεπτα',
    generate: () => {
      // 36 = 2² · 3², 48 = 2⁴ · 3 -> ΕΚΠ = 2⁴ · 3² = 16 · 9 = 144
      const n1 = 36;
      const n2 = 48;
      const f1 = '2² · 3²';
      const f2 = '2⁴ · 3';
      const ekpExpr = '2⁴ · 3²';
      const ekpVal = 144;
      return {
        prompt: `Δύο δρομείς ξεκινούν ταυτόχρονα από την αφετηρία ενός κυκλικού στίβου. Ο πρώτος κάνει έναν γύρο σε ${n1} δευτερόλεπτα (${f1}) και ο δεύτερος σε ${n2} δευτερόλεπτα (${f2}). Μετά από πόσα δευτερόλεπτα θα περάσουν ξανά μαζί ακριβώς από τη γραμμή εκκίνησης;`,
        unit: 'δευτερόλεπτα',
        correctVal: ekpVal,
        correctText: `${ekpVal} δευτερόλεπτα`,
        tableData: [
          { item: '1ος Δρομέας', analysis: f1, value: `${n1} δευτ.` },
          { item: '2ος Δρομέας', analysis: f2, value: `${n2} δευτ.` },
          { item: 'Ε.Κ.Π.(36, 48)', analysis: `${ekpExpr} ＝ 16 · 9`, value: `${ekpVal} δευτ.` }
        ],
        explain: `Επιλέγουμε για το 2 τον εκθέτη 4 (2⁴) και για το 3 τον εκθέτη 2 (3²). Ε.Κ.Π. ＝ 2⁴ · 3² ＝ 16 · 9 ＝ ${ekpVal} δευτερόλεπτα.`,
        distractors: [72, 96, 180]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Συναρμολόγηση Πλακετών LED',
    unit: 'εκατοστά (cm)',
    generate: () => {
      // 30 = 2 · 3 · 5, 40 = 2³ · 5 -> ΕΚΠ = 2³ · 3 · 5 = 8 · 3 · 5 = 120
      const n1 = 30;
      const n2 = 40;
      const f1 = '2 · 3 · 5';
      const f2 = '2³ · 5';
      const ekpExpr = '2³ · 3 · 5';
      const ekpVal = 120;
      return {
        prompt: `Ένας ηλεκτρονικός θέλει να κατασκευάσει ένα τετράγωνο φωτιστικό πάνελ τοποθετώντας ορθογώνιες πλακέτες LED διαστάσεων ${n1} cm (${f1}) επί ${n2} cm (${f2}). Ποιο είναι το ελάχιστο μήκος πλευράς που μπορεί να έχει το τετράγωνο πάνελ;`,
        unit: 'cm',
        correctVal: ekpVal,
        correctText: `${ekpVal} cm`,
        tableData: [
          { item: 'Πλάτος Πλακέτας', analysis: f1, value: `${n1} cm` },
          { item: 'Μήκος Πλακέτας', analysis: f2, value: `${n2} cm` },
          { item: 'Πλευρά Τετραγώνου (Ε.Κ.Π.)', analysis: `${ekpExpr} ＝ 8 · 3 · 5`, value: `${ekpVal} cm` }
        ],
        explain: `Η πλευρά του τετραγώνου πρέπει να είναι κοινό πολλαπλάσιο των δύο διαστάσεων. Ε.Κ.Π.(${n1}, ${n2}) ＝ 2³ · 3 · 5 ＝ ${ekpVal} cm (1,2 μέτρα).`,
        distractors: [60, 80, 240]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Επισκέψεις σε Παιδικό Σταθμό',
    unit: 'ημέρες',
    generate: () => {
      // 10 = 2 · 5, 15 = 3 · 5, 20 = 2² · 5 -> ΕΚΠ = 2² · 3 · 5 = 60
      const n1 = 10;
      const n2 = 15;
      const n3 = 20;
      const f1 = '2 · 5';
      const f2 = '3 · 5';
      const f3 = '2² · 5';
      const ekpExpr = '2² · 3 · 5';
      const ekpVal = 60;
      return {
        prompt: `Σε έναν παιδικό σταθμό, ο παιδίατρος έρχεται κάθε ${n1} ημέρες (${f1}), ο οδοντίατρος κάθε ${n2} ημέρες (${f2}) και ο διατροφολόγος κάθε ${n3} ημέρες (${f3}). Κάθε πόσες ημέρες θα συμπίπτει η επίσκεψη και των τριών ειδικών την ίδια ημέρα;`,
        unit: 'ημέρες',
        correctVal: ekpVal,
        correctText: `${ekpVal} ημέρες`,
        tableData: [
          { item: 'Παιδίατρος', analysis: f1, value: `${n1} ημέρες` },
          { item: 'Οδοντίατρος', analysis: f2, value: `${n2} ημέρες` },
          { item: 'Διατροφολόγος', analysis: f3, value: `${n3} ημέρες` },
          { item: 'Ε.Κ.Π.(10, 15, 20)', analysis: `${ekpExpr} ＝ 4 · 3 · 5`, value: `${ekpVal} ημέρες` }
        ],
        explain: `Συλλέγουμε τους παράγοντες με τους μεγαλύτερους εκθέτες: 2² · 3 · 5 ＝ 4 · 3 · 5 ＝ ${ekpVal} ημέρες (περίπου κάθε 2 μήνες).`,
        distractors: [30, 45, 90]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: MCQ - Επιλογή του σωστού γινομένου παραγόντων με μέγιστους εκθέτες
  const q1Pool = [
    {
      n1: '12 ＝ 2² · 3',
      n2: '18 ＝ 2 · 3²',
      correct: '2² · 3²',
      val: 36,
      wrong: ['2 · 3', '2² · 3', '2³ · 3³']
    },
    {
      n1: '20 ＝ 2² · 5',
      n2: '30 ＝ 2 · 3 · 5',
      correct: '2² · 3 · 5',
      val: 60,
      wrong: ['2 · 5', '2² · 5²', '2 · 3 · 5']
    },
    {
      n1: '24 ＝ 2³ · 3',
      n2: '36 ＝ 2² · 3²',
      correct: '2³ · 3²',
      val: 72,
      wrong: ['2² · 3', '2³ · 3', '2⁴ · 3²']
    },
    {
      n1: '15 ＝ 3 · 5',
      n2: '20 ＝ 2² · 5',
      correct: '2² · 3 · 5',
      val: 60,
      wrong: ['5', '3 · 5', '2² · 5']
    }
  ];
  const q1Data = q1Pool[randInt(0, q1Pool.length - 1)];
  const q1Raw = [q1Data.correct, ...q1Data.wrong];
  const q1Options = shuffle([...new Set(q1Raw)]);

  // Q2: Input - Υπολογισμός Ε.Κ.Π. από δοσμένες παραγοντοποιήσεις
  const q2Pool = [
    {
      expr1: '2² · 5',
      expr2: '2 · 5²',
      val: 100,
      explain: 'Ε.Κ.Π. ＝ 2² · 5² ＝ 4 · 25 ＝ 100'
    },
    {
      expr1: '2³ · 3',
      expr2: '3² · 5',
      val: 360,
      explain: 'Ε.Κ.Π. ＝ 2³ · 3² · 5 ＝ 8 · 9 · 5 ＝ 360'
    },
    {
      expr1: '2² · 3²',
      expr2: '2 · 3 · 5',
      val: 180,
      explain: 'Ε.Κ.Π. ＝ 2² · 3² · 5 ＝ 4 · 9 · 5 ＝ 180'
    },
    {
      expr1: '2⁴ · 3',
      expr2: '2² · 3²',
      val: 144,
      explain: 'Ε.Κ.Π. ＝ 2⁴ · 3² ＝ 16 · 9 ＝ 144'
    }
  ];
  const q2Data = q2Pool[randInt(0, q2Pool.length - 1)];

  // Q3: MCQ - Ποιον εκθέτη επιλέγουμε για κοινό πρώτο παράγοντα
  const q3Pool = [
    { base: 2, e1: '2²', e2: '2⁴', correct: '2⁴', wrong: ['2²', '2⁶', '2⁸'] },
    { base: 3, e1: '3³', e2: '3¹', correct: '3³', wrong: ['3', '3⁴', '3²'] },
    { base: 5, e1: '5¹', e2: '5²', correct: '5²', wrong: ['5', '5³', '5⁴'] },
    { base: 7, e1: '7²', e2: '7³', correct: '7³', wrong: ['7', '7²', '7⁵'] }
  ];
  const q3Data = q3Pool[randInt(0, q3Pool.length - 1)];
  const q3Options = shuffle([...new Set([q3Data.correct, ...q3Data.wrong])]);

  // Q4: MCQ - Ε.Κ.Π. 3 αριθμών με παραγοντοποίηση
  const q4Pool = [
    {
      n1: '8 ＝ 2³',
      n2: '12 ＝ 2² · 3',
      n3: '15 ＝ 3 · 5',
      correct: '2³ · 3 · 5 (＝ 120)',
      wrong: ['2² · 3 (＝ 12)', '2³ · 3² (＝ 72)', '2 · 3 · 5 (＝ 30)']
    },
    {
      n1: '10 ＝ 2 · 5',
      n2: '15 ＝ 3 · 5',
      n3: '20 ＝ 2² · 5',
      correct: '2² · 3 · 5 (＝ 60)',
      wrong: ['2 · 3 · 5 (＝ 30)', '5 (＝ 5)', '2² · 5 (＝ 20)']
    },
    {
      n1: '6 ＝ 2 · 3',
      n2: '9 ＝ 3²',
      n3: '12 ＝ 2² · 3',
      correct: '2² · 3² (＝ 36)',
      wrong: ['2 · 3 (＝ 6)', '2² · 3 (＝ 12)', '2³ · 3³ (＝ 216)']
    }
  ];
  const q4Data = q4Pool[randInt(0, q4Pool.length - 1)];
  const q4Options = shuffle([...new Set([q4Data.correct, ...q4Data.wrong])]);

  // Q5: True/False - Μη κοινοί παράγοντες
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στο Ε.Κ.Π. με ανάλυση σε πρώτους παράγοντες παίρνουμε και τους κοινούς ΚΑΙ τους μη κοινούς παράγοντες.'
    : 'Στο Ε.Κ.Π. με ανάλυση σε πρώτους παράγοντες παίρνουμε ΑΠΟΚΛΕΙΣΤΙΚΑ και ΜΟΝΟ τους κοινούς παράγοντες.';

  // Q6: True/False - Επιλογή εκθέτη
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Για τους κοινούς παράγοντες επιλέγουμε πάντοτε εκείνον με τον ΜΕΓΑΛΥΤΕΡΟ εκθέτη.'
    : 'Για τους κοινούς παράγοντες επιλέγουμε πάντοτε εκείνον με τον ΜΙΚΡΟΤΕΡΟ εκθέτη.';

  // Q7: Input - Εύρεση αριθμού που λείπει στο γινόμενο
  const q7Pool = [
    {
      n1: '18 ＝ 2 · 3²',
      n2: '24 ＝ 2³ · 3',
      missing: '9',
      known: '8 · ',
      target: 72,
      explain: 'Ε.Κ.Π. ＝ 2³ · 3² ＝ 8 · 9 ＝ 72'
    },
    {
      n1: '12 ＝ 2² · 3',
      n2: '20 ＝ 2² · 5',
      missing: '15',
      known: '4 · ',
      target: 60,
      explain: 'Ε.Κ.Π. ＝ 2² · 3 · 5 ＝ 4 · 15 ＝ 60'
    },
    {
      n1: '20 ＝ 2² · 5',
      n2: '50 ＝ 2 · 5²',
      missing: '25',
      known: '4 · ',
      target: 100,
      explain: 'Ε.Κ.Π. ＝ 2² · 5² ＝ 4 · 25 ＝ 100'
    }
  ];
  const q7Data = q7Pool[randInt(0, q7Pool.length - 1)];

  // Q8: MCQ - Σύγκριση Ε.Κ.Π. και Μ.Κ.Δ. εκθετών
  const q8Pool = [
    {
      prompt: 'Δίνονται οι αριθμοί Α ＝ 2² · 3³ και Β ＝ 2³ · 3². Ποια σχέση συνδέει το Ε.Κ.Π. τους;',
      correct: 'Ε.Κ.Π. ＝ 2³ · 3³ ＝ 216',
      wrong: ['Ε.Κ.Π. ＝ 2² · 3² ＝ 36', 'Ε.Κ.Π. ＝ 2 · 3 ＝ 6', 'Ε.Κ.Π. ＝ 2⁵ · 3⁵ ＝ 7.776'],
      explain: 'Για το Ε.Κ.Π. παίρνουμε πάντοτε τον μέγιστο εκθέτη για κάθε πρώτο παράγοντα: 2³ · 3³ ＝ 8 · 27 ＝ 216.'
    },
    {
      prompt: 'Αν δύο αριθμοί είναι πρώτοι μεταξύ τους (δεν έχουν κανέναν κοινό πρώτο παράγοντα, π.χ. 8 ＝ 2³ και 9 ＝ 3²), ποιο είναι το Ε.Κ.Π. τους;',
      correct: 'Το γινόμενό τους (8 · 9 ＝ 72)',
      wrong: ['Το άθροισμά τους (8 ＋ 9 ＝ 17)', 'Πάντα το 1', 'Η διαφορά τους (9 － 8 ＝ 1)'],
      explain: 'Όταν δύο αριθμοί δεν έχουν κοινούς παράγοντες, το Ε.Κ.Π. περιλαμβάνει όλους τους μη κοινούς παράγοντες, άρα ισούται με το γινόμενό τους.'
    }
  ];
  const q8Data = q8Pool[randInt(0, q8Pool.length - 1)];
  const q8Options = shuffle([...new Set([q8Data.correct, ...q8Data.wrong])]);

  // Q9: Standard Problem (Pool of 6)
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate();
  const q9Options = shuffle([
    ...new Set([
      q9Raw.correctText,
      ...q9Raw.distractors.map(d => `${d} ${q9Raw.unit}`)
    ])
  ]);

  // Q10: Hard Problem (Pool of 6)
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate();
  const q10Options = shuffle([
    ...new Set([
      q10Raw.correctText,
      ...q10Raw.distractors.map(d => `${d} ${q10Raw.unit}`)
    ])
  ]);

  return [
    {
      id: 'q1',
      type: 'mcq',
      title: 'Επιλογή Γινομένου Μέγιστων Εκθετών',
      prompt: `Δίνονται οι αναλύσεις δύο αριθμών: ${q1Data.n1} και ${q1Data.n2}. Ποιο είναι το σωστό γινόμενο δυνάμεων για τον υπολογισμό του Ε.Κ.Π.;`,
      options: q1Options,
      correct: q1Data.correct,
      explain: `Επιλέγουμε όλους τους πρώτους παράγοντες (κοινούς και μη κοινούς) με τον μεγαλύτερο εκθέτη: ${q1Data.correct} (＝ ${q1Data.val}).`
    },
    {
      id: 'q2',
      type: 'input',
      title: 'Υπολογισμός Ε.Κ.Π. από Δυνάμεις',
      prompt: `Αν Α ＝ ${q2Data.expr1} και Β ＝ ${q2Data.expr2}, υπολόγισε την τελική αριθμητική τιμή του Ε.Κ.Π.(Α, Β):`,
      correct: String(q2Data.val),
      explain: q2Data.explain
    },
    {
      id: 'q3',
      type: 'mcq',
      title: 'Επιλογή Δύναμης Κοινού Παράγοντα',
      prompt: `Στην ανάλυση δύο αριθμών εμφανίζεται ο παράγοντας ${q3Data.base} ως ${q3Data.e1} στον πρώτο και ως ${q3Data.e2} στον δεύτερο. Ποια δύναμη θα συμπεριλάβουμε στο Ε.Κ.Π.;`,
      options: q3Options,
      correct: q3Data.correct,
      explain: `Στο Ε.Κ.Π. επιλέγουμε πάντοτε τη δύναμη με τον μεγαλύτερο εκθέτη (${q3Data.correct}).`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Ε.Κ.Π. Τριών Αριθμών',
      prompt: `Ποιο είναι το Ε.Κ.Π. των αριθμών με αναλύσεις: ${q4Data.n1}, ${q4Data.n2} και ${q4Data.n3};`,
      options: q4Options,
      correct: q4Data.correct,
      explain: `Συνδυάζουμε όλους τους πρώτους παράγοντες με τους μεγαλύτερους εκθέτες: ${q4Data.correct}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Κοινοί και Μη Κοινοί Παράγοντες',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Στο Ε.Κ.Π. συμπεριλαμβάνονται ΟΛΟΙ οι πρώτοι παράγοντες (κοινοί και μη κοινοί).'
        : 'Λάθος! Στο Ε.Κ.Π. παίρνουμε ΚΑΙ τους μη κοινούς παράγοντες (μόνο στον Μ.Κ.Δ. περιοριζόμαστε αποκλειστικά στους κοινούς).'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Κανόνας Μεγαλύτερου Εκθέτη',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Για κάθε πρώτο παράγοντα επιλέγουμε πάντοτε τον μεγαλύτερο εκθέτη.'
        : 'Λάθος! Τον μικρότερο εκθέτη τον επιλέγουμε στον Μ.Κ.Δ., ενώ στο Ε.Κ.Π. παίρνουμε πάντοτε τον μεγαλύτερο.'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Συμπλήρωση Παράγοντα στο Γινόμενο',
      prompt: `Αν ${q7Data.n1} και ${q7Data.n2}, τότε Ε.Κ.Π. ＝ ${q7Data.known}[ ? ] ＝ ${q7Data.target}. Ποιος αριθμός λείπει στο [ ? ];`,
      correct: q7Data.missing,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Ιδιότητες & Σχέσεις Ε.Κ.Π.',
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correct,
      explain: q8Data.explain
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

export default function EkpProtoiExercisesPage() {
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

  const handleInputChange = (id, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\s+/g, '').replace(/,/g, '.').trim();
      const cleanTarget = q.correct.replace(/\s+/g, '').replace(/,/g, '.').trim();
      return cleanUser === cleanTarget;
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

  return (
    <Layout
      title="Ασκήσεις: Ε.Κ.Π. με Πρώτους Παράγοντες - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στο Ελάχιστο Κοινό Πολλαπλάσιο με ανάλυση σε πρώτους παράγοντες για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/20-ekp-protoi"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase('Θεωρία')}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-32 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>ΚΕΦΑΛΑΙΟ 20 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Ε.Κ.Π. με Πρώτους Παράγοντες
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα εφαρμόζοντας τον χρυσό κανόνα των κοινών και μη κοινών πρώτων παραγόντων με τον μεγαλύτερο εκθέτη!
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
                              onClick={() => handleInputChange(q.id, opt)}
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
                          inputMode="numeric"
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder="Γράψε την απάντησή σου..."
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}

                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(q.id, true)}
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
                          onClick={() => handleInputChange(q.id, false)}
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
                                <th className="p-1.5">{toCleanUppercase('Ανάλυση')}</th>
                                <th className="p-1.5">{toCleanUppercase('Τιμή')}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900">{row.item}</td>
                                  <td className="p-1.5 text-indigo-700">{row.analysis}</td>
                                  <td className="p-1.5 font-black text-emerald-700">{row.value}</td>
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
              <span>{toCleanUppercase('Σκορ')}:</span>
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

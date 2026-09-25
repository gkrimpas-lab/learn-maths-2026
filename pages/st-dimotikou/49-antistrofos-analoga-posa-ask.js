// pages/st-dimotikou/49-antistrofos-analoga-posa-ask.js
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

// Τυχαια επιλογη απο πινακα
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Μορφοποιηση αριθμου
function formatNum(val, decimals = 1) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Δεξαμενη Κανονικων Προβληματων Αντιστροφως Αναλογων Ποσων
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'inv_std_1',
    generate: () => {
      const w1 = pickRandom([3, 4, 6]);
      const d1 = pickRandom([6, 8, 12]);
      const prod = w1 * d1;
      const w2 = pickRandom([2, 4, 6, 8, 12].filter(w => w !== w1 && prod % w === 0));
      const d2 = prod / w2;
      return {
        text: `${w1} εργάτες τελειώνουν ένα έργο σε ${d1} ημέρες. Σε πόσες ημέρες θα τελειώσουν το ίδιο έργο ${w2} εργάτες, εργαζόμενοι με τον ίδιο ρυθμό;`,
        tableData: { col1: 'Εργάτες', col2: 'Ημέρες', r1: [w1, d1], r2: [w2, 'χ'] },
        correctVal: d2,
        correctStr: String(d2),
        explanation: `Τα ποσά είναι αντιστρόφως ανάλογα (σταθερό γινόμενο: ${w1} · ${d1} ＝ ${prod}). Άρα: χ ＝ ${prod} : ${w2} ＝ ${d2} ημέρες.`
      };
    }
  },
  {
    id: 'inv_std_2',
    generate: () => {
      const v1 = pickRandom([40, 50, 60, 80]);
      const t1 = pickRandom([2, 3, 4]);
      const dist = v1 * t1;
      const v2 = pickRandom([60, 80, 100, 120].filter(v => v !== v1 && dist % v === 0));
      const t2 = dist / v2;
      return {
        text: `Ένα αυτοκίνητο κινούμενο με μέση ταχύτητα ${v1} km/h διανύει μια απόσταση σε ${t1} ώρες. Πόσες ώρες θα χρειαστεί για να διανύσει την ίδια απόσταση αν τρέχει με ${v2} km/h;`,
        tableData: { col1: 'Ταχύτητα (km/h)', col2: 'Ώρες (h)', r1: [v1, t1], r2: [v2, 'χ'] },
        correctVal: t2,
        correctStr: String(t2),
        explanation: `Σταθερή απόσταση: ${v1} · ${t1} ＝ ${dist} km. Νέος χρόνος: ${dist} : ${v2} ＝ ${t2} ώρες.`
      };
    }
  },
  {
    id: 'inv_std_3',
    generate: () => {
      const b1 = pickRandom([2, 3, 4]);
      const h1 = pickRandom([6, 8, 12]);
      const prod = b1 * h1;
      const b2 = pickRandom([6, 8, 12].filter(b => b !== b1 && prod % b === 0));
      const h2 = prod / b2;
      return {
        text: `${b1} ίδιες βρύσες γεμίζουν μια πισίνα σε ${h1} ώρες. Σε πόσες ώρες θα γεμίσουν την πισίνα ${b2} ίδιες βρύσες;`,
        tableData: { col1: 'Βρύσες', col2: 'Ώρες', r1: [b1, h1], r2: [b2, 'χ'] },
        correctVal: h2,
        correctStr: String(h2),
        explanation: `Σταθερό γινόμενο: ${b1} · ${h1} ＝ ${prod}. Άρα: χ ＝ ${prod} : ${b2} ＝ ${h2} ώρες.`
      };
    }
  },
  {
    id: 'inv_std_4',
    generate: () => {
      const animal1 = pickRandom([10, 15, 20]);
      const days1 = pickRandom([12, 16, 20]);
      const foodUnits = animal1 * days1;
      const animal2 = pickRandom([20, 25, 30].filter(a => a !== animal1 && foodUnits % a === 0));
      const days2 = foodUnits / animal2;
      return {
        text: `Μια ποσότητα ζωοτροφής επαρκεί για ${animal1} ζώα για ${days1} ημέρες. Για πόσες ημέρες θα επαρκέσει η ίδια τροφή για ${animal2} ζώα;`,
        tableData: { col1: 'Ζώα', col2: 'Ημέρες', r1: [animal1, days1], r2: [animal2, 'χ'] },
        correctVal: days2,
        correctStr: String(days2),
        explanation: `Σταθερή ποσότητα τροφής: ${animal1} · ${days1} ＝ ${foodUnits}. Ημέρες: ${foodUnits} : ${animal2} ＝ ${days2} ημέρες.`
      };
    }
  },
  {
    id: 'inv_std_5',
    generate: () => {
      return {
        text: `Σε μια παιδική κατασκήνωση οι προμήθειες επαρκούν για 6 εβδομάδες για 15 παιδιά. Αν φιλοξενηθούν 9 παιδιά, για πόσες εβδομάδες θα επαρκέσουν οι ίδιες προμήθειες;`,
        tableData: { col1: 'Παιδιά', col2: 'Εβδομάδες', r1: [15, 6], r2: [9, 'χ'] },
        correctVal: 10,
        correctStr: '10',
        explanation: `Σταθερό γινόμενο: 15 · 6 ＝ 90. Εβδομάδες: 90 : 9 ＝ 10 εβδομάδες.`
      };
    }
  },
  {
    id: 'inv_std_6',
    generate: () => {
      return {
        text: `Ποιο από τα παρακάτω ζεύγη ποσών είναι ΑΝΤΙΣΤΡΟΦΩΣ ανάλογα;`,
        options: [
          { text: 'Ο αριθμός των εργατών και ο χρόνος ολοκλήρωσης ενός έργου', isCorrect: true },
          { text: 'Τα κιλά των μήλων και το κόστος αγοράς τους', isCorrect: false },
          { text: 'Ο χρόνος οδήγησης με σταθερή ταχύτητα και η απόσταση που διανύουμε', isCorrect: false },
          { text: 'Η ηλικία ενός ανθρώπου και το ύψος του', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: 'Ο αριθμός των εργατών και ο χρόνος ολοκλήρωσης ενός έργου',
        explanation: `Όσο περισσότεροι είναι οι εργάτες, τόσο λιγότερες ημέρες απαιτούνται για το έργο (σταθερό γινόμενο).`
      };
    }
  },
  {
    id: 'inv_std_7',
    generate: () => {
      return {
        text: `Μια δεξαμενή αδειάζει από 4 σωλήνες σε 18 ώρες. Σε πόσες ώρες θα αδειάσει η ίδια δεξαμενή αν χρησιμοποιηθούν 6 ίδιοι σωλήνες;`,
        tableData: { col1: 'Σωλήνες', col2: 'Ώρες', r1: [4, 18], r2: [6, 'χ'] },
        correctVal: 12,
        correctStr: '12',
        explanation: `4 · 18 ＝ 72. Ώρες: 72 : 6 ＝ 12 ώρες.`
      };
    }
  },
  {
    id: 'inv_std_8',
    generate: () => {
      return {
        text: `5 μηχανές εκτυπώνουν μια παραγγελία βιβλίων σε 20 ημέρες. Πόσες ημέρες θα χρειαστούν 10 ίδιες μηχανές;`,
        tableData: { col1: 'Μηχανές', col2: 'Ημέρες', r1: [5, 20], r2: [10, 'χ'] },
        correctVal: 10,
        correctStr: '10',
        explanation: `Διπλάσιες μηχανές ➔ Μισές ημέρες: (5 · 20) : 10 ＝ 100 : 10 ＝ 10 ημέρες.`
      };
    }
  },
  {
    id: 'inv_std_9',
    generate: () => {
      return {
        text: `Σε έναν πίνακα αντιστρόφως αναλόγων ποσών, αν x ＝ 4 και y ＝ 15, ποια είναι η τιμή του y όταν x ＝ 6;`,
        tableData: { col1: 'Ποσό x', col2: 'Ποσό y', r1: [4, 15], r2: [6, 'χ'] },
        correctVal: 10,
        correctStr: '10',
        explanation: `Σταθερό γινόμενο: 4 · 15 ＝ 60. Άρα: χ ＝ 60 : 6 ＝ 10.`
      };
    }
  },
  {
    id: 'inv_std_10',
    generate: () => {
      return {
        text: `Ένας αγωγός διοχετεύει 50 l νερό το λεπτό και γεμίζει μια δεξαμενή σε 12 ώρες. Αν διοχετεύει 75 l το λεπτό, σε πόσες ώρες θα γεμίσει η δεξαμενή;`,
        tableData: { col1: 'Παροχή (l/min)', col2: 'Ώρες', r1: [50, 12], r2: [75, 'χ'] },
        correctVal: 8,
        correctStr: '8',
        explanation: `50 · 12 ＝ 600. Ώρες: 600 : 75 ＝ 8 ώρες.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας
const HARD_PROBLEMS_POOL = [
  {
    id: 'inv_hard_1',
    generate: () => {
      return {
        text: `Ένα συνεργείο 8 εργατών μπορεί να τελειώσει ένα έργο σε 15 ημέρες. Αφού εργάστηκαν όλοι μαζί για 3 ημέρες, προστέθηκαν άλλοι 4 εργάτες. Πόσες ημέρες ακόμα θα χρειαστούν για να ολοκληρωθεί το έργο;`,
        correctVal: 8,
        correctStr: '8',
        explanation: `Απομένουν 15 － 3 ＝ 12 ημέρες για τους 8 εργάτες (8 · 12 ＝ 96 εργατοημέρες). Με 8 ＋ 4 ＝ 12 εργάτες: 96 : 12 ＝ 8 ημέρες.`
      };
    }
  },
  {
    id: 'inv_hard_2',
    generate: () => {
      return {
        text: `Ένας πεζοπόρος βαδίζοντας με ταχύτητα 4 km/h χρειάζεται 6 ώρες για μια διαδρομή. Αν θέλει να καλύψει την ίδια διαδρομή σε 4 ώρες, κατά πόσα km/h πρέπει να ΑΥΞΗΣΕΙ την ταχύτητά του;`,
        correctVal: 2,
        correctStr: '2',
        explanation: `Απόσταση: 4 · 6 ＝ 24 km. Νέα ταχύτητα: 24 : 4 ＝ 6 km/h. Αύξηση ταχύτητας: 6 － 4 ＝ 2 km/h.`
      };
    }
  },
  {
    id: 'inv_hard_3',
    generate: () => {
      return {
        text: `Μια ομάδα 12 εργατών ολοκληρώνει ένα έργο δουλεύοντας 6 ώρες την ημέρα σε 10 ημέρες. Πόσες ημέρες θα χρειάζονταν οι ίδιοι 12 εργάτες αν δούλευαν 8 ώρες την ημέρα;`,
        correctVal: 7.5,
        correctStr: '7,5',
        explanation: `Συνολικές ώρες έργου: 6 · 10 ＝ 60 ώρες. Με 8 ώρες καθημερινά: 60 : 8 ＝ 7,5 ημέρες.`
      };
    }
  },
  {
    id: 'inv_hard_4',
    generate: () => {
      return {
        text: `Μια δεξαμενή γεμίζει από 2 βρύσες σε 12 ώρες. Αν θέλουμε η δεξαμενή να γεμίσει σε μόλις 3 ώρες, πόσες τέτοιες βρύσες ΠΡΕΠΕΙ ΝΑ ΠΡΟΣΤΕΘΟΥΝ συνολικά;`,
        correctVal: 6,
        correctStr: '6',
        explanation: `Σταθερό έργο: 2 · 12 ＝ 24. Συνολικές βρύσες που χρειάζονται: 24 : 3 ＝ 8 βρύσες. Πρέπει να προστεθούν: 8 － 2 ＝ 6 βρύσες.`
      };
    }
  },
  {
    id: 'inv_hard_5',
    generate: () => {
      return {
        text: `Ένα σχολείο προγραμμάτισε εκδρομή με 4 λεωφορεία των 50 θέσεων. Τελικά χρησιμοποιήθηκαν λεωφορεία των 40 θέσεων. Πόσα τέτοια λεωφορεία χρειάστηκαν για να μεταφερθούν όλοι οι μαθητές;`,
        correctVal: 5,
        correctStr: '5',
        explanation: `Σύνολο μαθητών: 4 · 50 ＝ 200. Λεωφορεία: 200 : 40 ＝ 5 λεωφορεία.`
      };
    }
  },
  {
    id: 'inv_hard_6',
    generate: () => {
      return {
        text: `Σε ένα κατάστημα πωλούνται κουτιά συσκευασίας. Αν τοποθετηθούν 24 μπουκάλια σε κάθε κιβώτιο, χρειάζονται 15 κιβώτια. Πόσα κιβώτια θα χρειαστούν αν σε κάθε κιβώτιο τοποθετηθούν 30 μπουκάλια;`,
        correctVal: 12,
        correctStr: '12',
        explanation: `Σύνολο μπουκαλιών: 24 · 15 ＝ 360. Κιβώτια: 360 : 30 ＝ 12 κιβώτια.`
      };
    }
  },
  {
    id: 'inv_hard_7',
    generate: () => {
      return {
        text: `Ένα ποσό χρημάτων μοιράστηκε ισόποσα σε 6 φίλους και ο καθένας πήρε 45 €. Αν το ίδιο ποσό μοιραζόταν σε 9 φίλους, πόσα ευρώ (€) θα έπαιρνε ο καθένας;`,
        correctVal: 30,
        correctStr: '30',
        explanation: `Συνολικό ποσό: 6 · 45 ＝ 270 €. Μερίδιο ανά άτομο: 270 : 9 ＝ 30 €.`
      };
    }
  },
  {
    id: 'inv_hard_8',
    generate: () => {
      return {
        text: `Ένας ποδηλάτης καλύπτει μια απόσταση σε 3 ώρες με ταχύτητα 20 km/h. Αν μειώσει την ταχύτητά του στα 15 km/h, πόσες ώρες θα χρειαστεί για την ίδια διαδρομή;`,
        correctVal: 4,
        correctStr: '4',
        explanation: `Απόσταση: 3 · 20 ＝ 60 km. Ώρες: 60 : 15 ＝ 4 ώρες.`
      };
    }
  },
  {
    id: 'inv_hard_9',
    generate: () => {
      return {
        text: `Ένα συνεργείο 10 εργατών τελειώνει ένα έργο σε 18 ημέρες. Αν αποχωρήσουν 4 εργάτες, σε πόσες ημέρες θα τελειώσουν το έργο οι υπόλοιποι εργάτες;`,
        correctVal: 30,
        correctStr: '30',
        explanation: `Έργο: 10 · 18 ＝ 180 εργατοημέρες. Εργάτες που απέμειναν: 10 － 4 ＝ 6. Ημέρες: 180 : 6 ＝ 30 ημέρες.`
      };
    }
  },
  {
    id: 'inv_hard_10',
    generate: () => {
      return {
        text: `Αν 5 μηχανές καταναλώνουν μια δεξαμενή καυσίμου σε 24 ημέρες, πόσες ημέρες θα διαρκέσει το ίδιο καύσιμο αν λειτουργούν 8 τέτοιες μηχανές;`,
        correctVal: 15,
        correctStr: '15',
        explanation: `Σταθερό γινόμενο: 5 · 24 ＝ 120. Ημέρες: 120 : 8 ＝ 15 ημέρες.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Βασικό πρόβλημα εργατών
  {
    const w1 = pickRandom([3, 4, 6]);
    const d1 = pickRandom([6, 8, 12]);
    const prod = w1 * d1;
    const w2 = pickRandom([2, 4, 6, 8, 12].filter(w => w !== w1 && prod % w === 0));
    const d2 = prod / w2;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΕΡΓΑΤΕΣ ΚΑΙ ΧΡΟΝΟΣ ΟΛΟΚΛΗΡΩΣΗΣ',
      instruction: 'Υπολογίστε τον αριθμό των ημερών:',
      prompt: `${w1} εργάτες τελειώνουν ένα έργο σε ${d1} ημέρες. Σε πόσες ημέρες θα τελειώσουν το ίδιο έργο ${w2} εργάτες;`,
      correctVal: d2,
      correctStr: String(d2),
      explanation: `Σταθερό γινόμενο: ${w1} · ${d1} ＝ ${prod}. Ημέρες για ${w2} εργάτες: ${prod} : ${w2} ＝ ${d2} ημέρες.`
    });
  }

  // Q2 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE
  {
    const correctConcept = 'Το γινόμενο των αντίστοιχων τιμών τους είναι πάντοτε σταθερό (x · y ＝ σταθερό)';
    const options = [
      { text: correctConcept, isCorrect: true },
      { text: 'Το πηλίκο των αντίστοιχων τιμών τους είναι πάντοτε σταθερό', isCorrect: false },
      { text: 'Όταν αυξάνεται το ένα ποσό, αυξάνεται και το άλλο στον ίδιο ρυθμό', isCorrect: false },
      { text: 'Η διαφορά ανάμεσα στις τιμές τους είναι πάντοτε ίση με το μηδέν', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • Η ΒΑΣΙΚΗ ΙΔΙΟΤΗΤΑ',
      instruction: 'Επιλέξτε τη σωστή πρόταση για τα αντιστρόφως ανάλογα ποσά:',
      prompt: `Ποιο είναι το βασικό μαθηματικό χαρακτηριστικό που διακρίνει δύο αντιστρόφως ανάλογα ποσά;`,
      options,
      correctText: correctConcept,
      explanation: `Στα αντιστρόφως ανάλογα ποσά το γινόμενο των αντίστοιχων τιμών τους παραμένει πάντα σταθερό (x · y ＝ σταθερό).`
    });
  }

  // Q3 (Input - Decimal): Ταχύτητα και χρόνος
  {
    const v1 = pickRandom([40, 60, 80]);
    const t1 = pickRandom([2, 3, 4]);
    const dist = v1 * t1;
    const v2 = pickRandom([60, 80, 120].filter(v => v !== v1 && dist % v === 0));
    const t2 = dist / v2;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΤΑΧΥΤΗΤΑ ΚΑΙ ΧΡΟΝΟΣ',
      instruction: 'Υπολογίστε τον νέο χρόνο ταξιδιού σε ώρες:',
      prompt: `Ένα αυτοκίνητο διανύει μια διαδρομή σε ${t1} ώρες με ταχύτητα ${v1} km/h. Πόσες ώρες θα χρειαστεί με ταχύτητα ${v2} km/h;`,
      correctVal: t2,
      correctStr: String(t2),
      explanation: `Σταθερή απόσταση: ${v1} · ${t1} ＝ ${dist} km. Νέος χρόνος: ${dist} : ${v2} ＝ ${t2} ώρες.`
    });
  }

  // Q4 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE
  {
    const correctStatement = 'Όχι, στα αντιστρόφως ανάλογα ποσά πολλαπλασιάζουμε οριζόντια και διαιρούμε με τον τρίτο αριθμό';
    const options = [
      { text: correctStatement, isCorrect: true },
      { text: 'Ναι, ο χιαστί πολλαπλασιασμός εφαρμόζεται σε όλα τα είδη ποσών', isCorrect: false },
      { text: 'Ναι, αρκεί πρώτα να προσθέσουμε τους δύο αριθμούς', isCorrect: false },
      { text: 'Όχι, γιατί στα αντιστρόφως ανάλογα ποσά δεν κάνουμε ποτέ πράξεις', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΧΙΑΣΤΙ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ',
      instruction: 'Επιλέξτε τη σωστή μαθηματική κρίση:',
      prompt: `Μπορούμε να χρησιμοποιήσουμε χιαστί πολλαπλασιασμό στον πίνακα αντιστρόφως αναλόγων ποσών;`,
      options,
      correctText: correctStatement,
      explanation: `Ο χιαστί πολλαπλασιασμός ισχύει μόνο στα ανάλογα ποσά (σταθερό πηλίκο). Στα αντιστρόφως ανάλογα ποσά εξισώνουμε τα οριζόντια γινόμενα (x₁ · y₁ ＝ x₂ · y₂).`
    });
  }

  // Q5 (Input - Decimal): Βρύσες και χρόνος
  {
    const b1 = 3;
    const h1 = 8;
    const b2 = 6;
    const h2 = 4;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΒΡΥΣΕΣ ΚΑΙ ΧΡΟΝΟΣ',
      instruction: 'Υπολογίστε τις ώρες γεμίσματος:',
      prompt: `${b1} ίδιες βρύσες γεμίζουν μια δεξαμενή σε ${h1} ώρες. Σε πόσες ώρες θα γεμίσουν την ίδια δεξαμενή ${b2} ίδιες βρύσες;`,
      correctVal: h2,
      correctStr: String(h2),
      explanation: `Διπλάσιες βρύσες (${b2}) ➔ Μισός χρόνος: (${b1} · ${h1}) : ${b2} ＝ 24 : 6 ＝ ${h2} ώρες.`
    });
  }

  // Q6 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE
  {
    const correctUse = 'Ο χρόνος μειώνεται στο μισό (διαιρείται με το 2)';
    const options = [
      { text: correctUse, isCorrect: true },
      { text: 'Ο χρόνος διπλασιάζεται (πολλαπλασιάζεται με το 2)', isCorrect: false },
      { text: 'Ο χρόνος παραμένει ακριβώς ο ίδιος', isCorrect: false },
      { text: 'Ο χρόνος αυξάνεται κατά 2 ώρες', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΔΙΠΛΑΣΙΑΣΜΟΣ ΤΗΣ ΜΙΑΣ ΤΙΜΗΣ',
      instruction: 'Επιλέξτε τι συμβαίνει στο άλλο ποσό:',
      prompt: `Σε δύο αντιστρόφως ανάλογα ποσά, αν διπλασιάσουμε την τιμή του πρώτου ποσού, τι θα συμβεί στην αντίστοιχη τιμή του δεύτερου ποσού;`,
      options,
      correctText: correctUse,
      explanation: `Όταν η τιμή του ενός ποσού πολλαπλασιάζεται με το 2, η αντίστοιχη τιμή του άλλου διαιρείται με το 2.`
    });
  }

  // Q7 & Q8: Κανονικά Προβλήματα από τη δεξαμενή
  {
    const shuffledStd = [...STANDARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const stdProb1 = shuffledStd[0].generate();
    const stdProb2 = shuffledStd[1].generate();

    // Q7 (Input - Decimal)
    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: stdProb1.text,
      tableData: stdProb1.tableData,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal !== undefined ? stdProb2.correctVal : stdProb2.correctText;
    let optionsQ8 = stdProb2.options;
    if (!optionsQ8 && typeof val8 === 'number') {
      const fake8A = formatNum(val8 + randInt(2, 5));
      const fake8B = formatNum(Math.max(1, val8 - randInt(1, 3)));
      const fake8C = formatNum(val8 * 1.5);
      optionsQ8 = [
        { text: `${stdProb2.correctStr}`, isCorrect: true },
        { text: `${fake8A}`, isCorrect: false },
        { text: `${fake8B}`, isCorrect: false },
        { text: `${fake8C}`, isCorrect: false }
      ].sort(() => Math.random() - 0.5);
    }

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΗΣ ΕΦΑΡΜΟΓΗΣ',
      instruction: 'Επιλέξτε τη σωστή τιμή:',
      prompt: stdProb2.text,
      tableData: stdProb2.tableData,
      options: optionsQ8,
      correctText: stdProb2.correctText || `${stdProb2.correctStr}`,
      explanation: stdProb2.explanation
    });
  }

  // Q9 & Q10: Προβλήματα Αυξημένης Δυσκολίας
  {
    const shuffledHard = [...HARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const hardProb1 = shuffledHard[0].generate();
    const hardProb2 = shuffledHard[1].generate();

    // Q9 (Input - Decimal)
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΑΥΞΗΜΕΝΗΣ ΔΥΣΚΟΛΙΑΣ',
      instruction: 'Υπολογίστε με ακρίβεια και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: hardProb1.text,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal !== undefined ? hardProb2.correctVal : hardProb2.correctText;
    let optionsQ10 = hardProb2.options;
    if (!optionsQ10 && typeof val10 === 'number') {
      const fake10A = formatNum(val10 + randInt(2, 4));
      const fake10B = formatNum(Math.max(1, val10 - randInt(1, 2)));
      const fake10C = formatNum(val10 * 1.5);
      optionsQ10 = [
        { text: `${hardProb2.correctStr}`, isCorrect: true },
        { text: `${fake10A}`, isCorrect: false },
        { text: `${fake10B}`, isCorrect: false },
        { text: `${fake10C}`, isCorrect: false }
      ].sort(() => Math.random() - 0.5);
    }

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΣΤΑΘΕΡΟΥ ΓΙΝΟΜΕΝΟΥ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      options: optionsQ10,
      correctText: hardProb2.correctText || `${hardProb2.correctStr}`,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function AntistrofosAnalogaPosaExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

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

  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

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
      title="Ασκήσεις: Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στα αντιστρόφως ανάλογα ποσά, το σταθερό γινόμενο και την αναγωγή στη μονάδα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/49-antistrofos-analoga-posa"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 pb-32 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-14 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ασκήσεις: Αντιστρόφως Ανάλογα Ποσά
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Χρησιμοποιήστε το σταθερό γινόμενο (x · y ＝ σταθερό) και την αναγωγή στη μονάδα.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 sm:px-4 py-2 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm"
            >
              <span>🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>
          </div>
        </section>

        {/* Λιστα 10 Ασκησεων */}
        <div className="space-y-6">
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
                className={`bg-white rounded-3xl border p-4 sm:p-7 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλιδα Ερωτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
                  <span className="text-xs font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {toCleanUppercase(q.title)}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '✓ ΣΩΣΤΟ' : '✗ ΛΑΘΟΣ'}
                    </span>
                  )}
                </div>

                {/* Εκφωνηση */}
                <div className="space-y-2 mb-2">
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    {q.instruction}
                  </p>
                  <p className="text-sm sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>

                  {/* Πινακας Τιμων (Responsive Χωρις Scroll) */}
                  {q.tableData && (
                    <div className="w-full max-w-xs sm:max-w-sm bg-slate-50 border-2 border-slate-200 rounded-2xl p-2.5 my-2 shadow-inner font-mono text-xs">
                      <div className="grid grid-cols-2 gap-2 font-bold border-b border-slate-200 pb-1 text-slate-600 text-center">
                        <span className="bg-blue-100/60 px-1.5 py-0.5 rounded text-blue-900 truncate">{q.tableData.col1}</span>
                        <span className="bg-amber-100/60 px-1.5 py-0.5 rounded text-amber-900 truncate">{q.tableData.col2}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1.5 text-center font-bold text-slate-800">
                        <span>{q.tableData.r1[0]}</span>
                        <span className="text-indigo-700">{q.tableData.r1[1]}</span>
                        <span>{q.tableData.r2[0]}</span>
                        <span className="text-amber-600 font-black text-sm">{q.tableData.r2[1]}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2 pt-2.5">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-32 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs text-slate-500">
                        (Ακέραιος η δεκαδικός με κόμμα)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE / ΑΠΟΣΙΩΠΗΤΙΚΑ */}
                  {q.type === 'mcq' && (
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-3xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 sm:p-4 rounded-2xl border text-left font-semibold text-xs sm:text-sm md:text-base transition active:scale-98 touch-manipulation flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1">
                              {opt.text}
                            </span>
                            <span
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center text-[10px] sm:text-xs shrink-0 mt-0.5 ${
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

                {/* Feedback μετα την υποβολη */}
                {isSubmitted && (
                  <div
                    className={`mt-3.5 p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? '🎉 Εξαιρετικά!' : '💡 Μαθηματική Επεξήγηση:'}</span>
                    </div>
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
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Απαντήσεων</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 sm:py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-semibold block">
                ΣΚΟΡ
              </span>
              <span className="font-mono font-black text-base sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-sm sm:text-base">/ 10</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-[11px] sm:text-xs text-slate-400 font-semibold block">
                ΠΟΣΟΣΤΟ
              </span>
              <span className="font-mono font-black text-base sm:text-2xl text-emerald-400">
                {Math.round((score / 10) * 100)} %
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 touch-manipulation"
              >
                ΕΛΕΓΧΟΣ
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 touch-manipulation"
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

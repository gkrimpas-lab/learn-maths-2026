// pages/st-dimotikou/05-prosthesi-ask.js
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
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Δεξαμενη κανονικων προβληματων προσθεσης για την Ερωτηση 9 (Input)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_add_std_1',
    generate: () => {
      const p1 = 14.85;
      const p2 = 23.4;
      const p3 = 11.75;
      const sum = Number((p1 + p2 + p3).toFixed(2));
      return {
        title: 'ΑΓΟΡΑ ΣΧΟΛΙΚΩΝ ΕΙΔΩΝ',
        instruction: 'Υπολογίστε το συνολικό ποσό σε ευρώ (€) με κόμμα:',
        text: `Ένας αγοραστής αγόρασε τρία προϊόντα αξίας ${formatNum(p1)} €, ${formatNum(p2)} € και ${formatNum(p3)} €. Πόσα ευρώ (€) πλήρωσε συνολικά;`,
        tableData: { col1: 'Προϊόντα 1 & 2', col2: 'Προϊόν 3', r1: [`${formatNum(p1)} €`, `${formatNum(p3)} €`], r2: [`${formatNum(p2)} €`, `Σύνολο: ${formatNum(sum)} €`] },
        correctVal: sum,
        correctStr: formatNum(sum),
        explanation: `Προσθέτουμε στοιχίζοντας τις υποδιαστολές: ${formatNum(p1)} ＋ ${formatNum(p2)} ＋ ${formatNum(p3)} ＝ ${formatNum(sum)} €.`
      };
    }
  },
  {
    id: 'p_add_std_2',
    generate: () => {
      const w1 = 4.35;
      const w2 = 5.8;
      const w3 = 2.45;
      const sum = Number((w1 + w2 + w3).toFixed(2));
      return {
        title: 'ΣΥΝΟΛΙΚΟ ΒΑΡΟΣ ΦΡΟΥΤΩΝ',
        instruction: 'Υπολογίστε το συνολικό βάρος σε κιλά (kg) με κόμμα:',
        text: `Ένας μανάβης ζύγισε τρία τελάρα με φρούτα που είχαν βάρη ${formatNum(w1)} kg, ${formatNum(w2)} kg και ${formatNum(w3)} kg αντίστοιχα. Πόσα κιλά (kg) ζυγίζουν συνολικά;`,
        tableData: { col1: 'Τελάρα 1 & 2', col2: 'Τελάρο 3', r1: [`${formatNum(w1)} kg`, `${formatNum(w3)} kg`], r2: [`${formatNum(w2)} kg`, `Σύνολο: ${formatNum(sum)} kg`] },
        correctVal: sum,
        correctStr: formatNum(sum),
        explanation: `Προσθέτουμε τα βάρη: ${formatNum(w1)} ＋ ${formatNum(w2)} ＋ ${formatNum(w3)} ＝ ${formatNum(sum)} kg.`
      };
    }
  },
  {
    id: 'p_add_std_3',
    generate: () => {
      const d1 = 12.4;
      const d2 = 8.75;
      const d3 = 15.6;
      const sum = Number((d1 + d2 + d3).toFixed(2));
      return {
        title: 'ΣΥΝΟΛΙΚΗ ΑΠΟΣΤΑΣΗ ΠΕΖΟΠΟΡΙΑΣ',
        instruction: 'Υπολογίστε τη συνολική απόσταση σε χιλιόμετρα (km) με κόμμα:',
        text: `Μια ομάδα πεζοπόρων διένυσε ${formatNum(d1)} km την πρώτη ημέρα, ${formatNum(d2)} km τη δεύτερη και ${formatNum(d3)} km την τρίτη. Πόσα χιλιόμετρα (km) διένυσε συνολικά;`,
        tableData: { col1: '1η & 2η Ημέρα', col2: '3η Ημέρα', r1: [`${formatNum(d1)} km`, `${formatNum(d3)} km`], r2: [`${formatNum(d2)} km`, `Σύνολο: ${formatNum(sum)} km`] },
        correctVal: sum,
        correctStr: formatNum(sum),
        explanation: `Προσθέτουμε τις αποστάσεις: ${formatNum(d1)} ＋ ${formatNum(d2)} ＋ ${formatNum(d3)} ＝ ${formatNum(sum)} km.`
      };
    }
  },
  {
    id: 'p_add_std_4',
    generate: () => {
      const m1 = 3.65;
      const m2 = 4.2;
      const m3 = 2.15;
      const sum = Number((m1 + m2 + m3).toFixed(2));
      return {
        title: 'ΣΥΝΟΛΙΚΟ ΜΗΚΟΣ ΥΦΑΣΜΑΤΟΣ',
        instruction: 'Υπολογίστε το συνολικό μήκος σε μέτρα (m) με κόμμα:',
        text: `Μια μοδίστρα χρησιμοποίησε τρία κομμάτια υφάσματος με μήκη ${formatNum(m1)} m, ${formatNum(m2)} m και ${formatNum(m3)} m. Πόσα μέτρα (m) υφάσματος χρησιμοποίησε συνολικά;`,
        tableData: { col1: 'Κομμάτια 1 & 2', col2: 'Κομμάτι 3', r1: [`${formatNum(m1)} m`, `${formatNum(m3)} m`], r2: [`${formatNum(m2)} m`, `Σύνολο: ${formatNum(sum)} m`] },
        correctVal: sum,
        correctStr: formatNum(sum),
        explanation: `Στοιχίζουμε τις υποδιαστολές: ${formatNum(m1)} ＋ ${formatNum(m2)} ＋ ${formatNum(m3)} ＝ ${formatNum(sum)} m.`
      };
    }
  },
  {
    id: 'p_add_std_5',
    generate: () => {
      const v1 = 1.75;
      const v2 = 2.5;
      const v3 = 0.85;
      const sum = Number((v1 + v2 + v3).toFixed(2));
      return {
        title: 'ΣΥΝΟΛΙΚΟΣ ΟΓΚΟΣ ΥΓΡΩΝ',
        instruction: 'Υπολογίστε τον συνολικό όγκο σε λίτρα (L) με κόμμα:',
        text: `Σε ένα μεγάλο δοχείο αναμείχθηκαν ${formatNum(v1)} L χυμός πορτοκάλι, ${formatNum(v2)} L νερό και ${formatNum(v3)} L σιρόπι. Πόσα λίτρα (L) μείγματος προέκυψαν;`,
        tableData: { col1: 'Χυμός & Νερό', col2: 'Σιρόπι', r1: [`${formatNum(v1)} L`, `${formatNum(v3)} L`], r2: [`${formatNum(v2)} L`, `Σύνολο: ${formatNum(sum)} L`] },
        correctVal: sum,
        correctStr: formatNum(sum),
        explanation: `Προσθέτουμε: ${formatNum(v1)} ＋ ${formatNum(v2)} ＋ ${formatNum(v3)} ＝ ${formatNum(sum)} L.`
      };
    }
  },
  {
    id: 'p_add_std_6',
    generate: () => {
      const e1 = 35.5;
      const e2 = 18.75;
      const e3 = 24.25;
      const sum = Number((e1 + e2 + e3).toFixed(2));
      return {
        title: 'ΛΟΓΑΡΙΑΣΜΟΙ ΚΟΙΝΟΧΡΗΣΤΩΝ',
        instruction: 'Υπολογίστε το συνολικό ποσό σε ευρώ (€) με κόμμα:',
        text: `Για τα κοινόχρηστα μιας πολυκατοικίας πληρώθηκαν ${formatNum(e1)} € για καθαρισμό, ${formatNum(e2)} € για ηλεκτρικό ρεύμα και ${formatNum(e3)} € για συντήρηση ανελκυστήρα. Ποιο είναι το συνολικό ποσό σε ευρώ (€);`,
        tableData: { col1: 'Καθαρισμός & Ρεύμα', col2: 'Ανελκυστήρας', r1: [`${formatNum(e1)} €`, `${formatNum(e3)} €`], r2: [`${formatNum(e2)} €`, `Σύνολο: ${formatNum(sum)} €`] },
        correctVal: sum,
        correctStr: formatNum(sum),
        explanation: `Προσθέτουμε: ${formatNum(e1)} ＋ ${formatNum(e2)} ＋ ${formatNum(e3)} ＝ ${formatNum(sum)} €.`
      };
    }
  }
];

// Διευρυμενη Δεξαμενη Προβληματων Αυξημενης Δυσκολιας για την Ερωτηση 10 (MCQ)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_add_hard_1',
    generate: () => {
      const totalKm = 42.5;
      const part1Km = 18.25;
      const part2Km = 14.8;
      const remainKm = Number((totalKm - (part1Km + part2Km)).toFixed(2));
      const correctStr = `${formatNum(remainKm)} km`;
      const fake1 = `${formatNum(remainKm + 2.4)} km`;
      const fake2 = `${formatNum(Math.max(1, remainKm - 1.5))} km`;
      const fake3 = `${formatNum(remainKm + 5.2)} km`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΔΙΑΔΡΟΜΗΣ',
        instruction: 'Επιλέξτε την υπολειπόμενη απόσταση σε χιλιόμετρα (km):',
        text: `Μια διαδρομή ποδηλασίας έχει συνολικό μήκος ${formatNum(totalKm)} km. Ένας ποδηλάτης διένυσε ${formatNum(part1Km)} km στο 1ο τμήμα και ${formatNum(part2Km)} km στο 2ο τμήμα. Πόσα χιλιόμετρα (km) του απομένουν για τον τερματισμό;`,
        tableData: { col1: 'Συνολική Διαδρομή', col2: '1ο & 2ο Τμήμα', r1: [`${formatNum(totalKm)} km`, `${formatNum(part1Km)} km`], r2: ['Υπόλοιπο', `${formatNum(part2Km)} km`] },
        options,
        correctText: correctStr,
        explanation: `Προσθέτουμε τα δύο πρώτα τμήματα: ${formatNum(part1Km)} ＋ ${formatNum(part2Km)} ＝ ${formatNum(part1Km + part2Km)} km. Αφαιρούμε από το σύνολο: ${formatNum(totalKm)} － ${formatNum(part1Km + part2Km)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_add_hard_2',
    generate: () => {
      const rollM = 25.5;
      const usedM1 = 8.75;
      const usedM2 = 6.4;
      const usedTotal = Number((usedM1 + usedM2).toFixed(2));
      const remainM = Number((rollM - usedTotal).toFixed(2));
      const correctStr = `${formatNum(remainM)} m`;
      const fake1 = `${formatNum(remainM + 1.2)} m`;
      const fake2 = `${formatNum(Math.max(1, remainM - 2.5))} m`;
      const fake3 = `${formatNum(remainM + 3.4)} m`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΥΠΟΛΟΙΠΟ ΡΟΛΟΥ ΥΦΑΣΜΑΤΟΣ',
        instruction: 'Επιλέξτε το ύφασμα που απέμεινε σε μέτρα (m):',
        text: `Από ένα ρολό υφάσματος μήκους ${formatNum(rollM)} m κόπηκαν δύο κομμάτια: το πρώτο μήκους ${formatNum(usedM1)} m και το δεύτερο ${formatNum(usedM2)} m. Πόσα μέτρα (m) υφάσματος έμειναν στο ρολό;`,
        tableData: { col1: 'Αρχικό Ρολό', col2: 'Κομμάτια που κόπηκαν', r1: [`${formatNum(rollM)} m`, `${formatNum(usedM1)} m`], r2: ['Υπόλοιπο', `${formatNum(usedM2)} m`] },
        options,
        correctText: correctStr,
        explanation: `Συνολικό ύφασμα που κόπηκε: ${formatNum(usedM1)} ＋ ${formatNum(usedM2)} ＝ ${formatNum(usedTotal)} m. Υπόλοιπο: ${formatNum(rollM)} － ${formatNum(usedTotal)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_add_hard_3',
    generate: () => {
      const budget = 50;
      const b1 = 12.45;
      const b2 = 18.8;
      const b3 = 9.25;
      const spent = Number((b1 + b2 + b3).toFixed(2));
      const change = Number((budget - spent).toFixed(2));
      const correctStr = `${formatNum(change)} €`;
      const fake1 = `${formatNum(change + 1.5)} €`;
      const fake2 = `${formatNum(Math.max(0.5, change - 1.2))} €`;
      const fake3 = `${formatNum(change + 3)} €`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΣΥΝΑΛΛΑΓΗ ΜΕ ΡΕΣΤΑ',
        instruction: 'Επιλέξτε το σωστό ποσό ρέστων σε ευρώ (€):',
        text: `Ένας πελάτης αγόρασε τρία είδη αξίας ${formatNum(b1)} €, ${formatNum(b2)} € και ${formatNum(b3)} €. Πλήρωσε με χαρτονόμισμα των 50 €. Πόσα ρέστα (€) έλαβε;`,
        tableData: { col1: 'Τρία Είδη', col2: 'Πληρωμή 50 €', r1: [`${formatNum(b1)} € ＋ ${formatNum(b2)} €`, `＋ ${formatNum(b3)} €`], r2: [`Σύνολο: ${formatNum(spent)} €`, `Ρέστα: ${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Σύνολο αγορών: ${formatNum(b1)} ＋ ${formatNum(b2)} ＋ ${formatNum(b3)} ＝ ${formatNum(spent)} €. Ρέστα: 50,00 － ${formatNum(spent)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_add_hard_4',
    generate: () => {
      const maxLoadKg = 30;
      const b1Kg = 8.75;
      const b2Kg = 12.4;
      const currentLoad = Number((b1Kg + b2Kg).toFixed(2));
      const remainLoad = Number((maxLoadKg - currentLoad).toFixed(2));
      const correctStr = `${formatNum(remainLoad)} kg`;
      const fake1 = `${formatNum(remainLoad + 1.5)} kg`;
      const fake2 = `${formatNum(Math.max(1, remainLoad - 2))} kg`;
      const fake3 = `${formatNum(remainLoad + 3.2)} kg`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΕΠΙΤΡΕΠΟΜΕΝΟ ΒΑΡΟΣ ΦΟΡΤΙΟΥ',
        instruction: 'Επιλέξτε πόσα κιλά (kg) επιτρέπεται να προστεθούν ακόμη:',
        text: `Ένα καρότσι αντέχει μέγιστο βάρος ${maxLoadKg} kg. Τοποθετήθηκαν δύο κιβώτια με βάρη ${formatNum(b1Kg)} kg και ${formatNum(b2Kg)} kg. Πόσα κιλά (kg) επιτρέπεται να φορτωθούν ακόμη;`,
        tableData: { col1: 'Μέγιστο Βάρος', col2: 'Φορτωμένα Κιβώτια', r1: [`${maxLoadKg} kg`, `${formatNum(b1Kg)} kg ＋ ${formatNum(b2Kg)} kg`], r2: ['Περιθώριο', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Φορτωμένο βάρος: ${formatNum(b1Kg)} ＋ ${formatNum(b2Kg)} ＝ ${formatNum(currentLoad)} kg. Υπόλοιπο: ${maxLoadKg} － ${formatNum(currentLoad)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_add_hard_5',
    generate: () => {
      const capL = 100;
      const f1L = 34.6;
      const f2L = 42.85;
      const currentL = Number((f1L + f2L).toFixed(2));
      const needL = Number((capL - currentL).toFixed(2));
      const correctStr = `${formatNum(needL)} L`;
      const fake1 = `${formatNum(needL + 2.5)} L`;
      const fake2 = `${formatNum(Math.max(1, needL - 1.8))} L`;
      const fake3 = `${formatNum(needL + 4)} L`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΠΛΗΡΩΣΗ ΔΕΞΑΜΕΝΗΣ ΝΕΡΟΥ',
        instruction: 'Επιλέξτε πόσα λίτρα (L) χρειάζονται για να γεμίσει η δεξαμενή:',
        text: `Μια δεξαμενή χωρητικότητας ${capL} L περιέχει ήδη δύο ποσότητες νερού: ${formatNum(f1L)} L και ${formatNum(f2L)} L. Πόσα λίτρα (L) νερού χρειάζονται ακόμη για να γεμίσει πλήρως;`,
        tableData: { col1: 'Χωρητικότητα', col2: 'Υπάρχον Νερό', r1: [`${capL} L`, `${formatNum(f1L)} L ＋ ${formatNum(f2L)} L`], r2: ['Απομένουν', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Υπάρχον νερό: ${formatNum(f1L)} ＋ ${formatNum(f2L)} ＝ ${formatNum(currentL)} L. Χρειάζονται: 100,00 － ${formatNum(currentL)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_add_hard_6',
    generate: () => {
      const targetSavings = 80;
      const w1 = 28.5;
      const w2 = 31.75;
      const saved = Number((w1 + w2).toFixed(2));
      const remain = Number((targetSavings - saved).toFixed(2));
      const correctStr = `${formatNum(remain)} €`;
      const fake1 = `${formatNum(remain + 2.5)} €`;
      const fake2 = `${formatNum(Math.max(1, remain - 2))} €`;
      const fake3 = `${formatNum(remain + 4.5)} €`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΣΤΟΧΟΣ ΑΠΟΤΑΜΙΕΥΣΗΣ',
        instruction: 'Επιλέξτε το ποσό που απομένει για τον στόχο σε ευρώ (€):',
        text: `Ένα παιδί θέλει να συγκεντρώσει ${targetSavings} € για ένα παιχνίδι. Την 1η εβδομάδα μάζεψε ${formatNum(w1)} € και τη 2η εβδομάδα ${formatNum(w2)} €. Πόσα ευρώ (€) του λείπουν ακόμη;`,
        tableData: { col1: 'Στόχος', col2: 'Αποταμιεύσεις', r1: [`${targetSavings} €`, `${formatNum(w1)} € ＋ ${formatNum(w2)} €`], r2: ['Υπόλοιπο', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Αποταμιεύσεις: ${formatNum(w1)} ＋ ${formatNum(w2)} ＝ ${formatNum(saved)} €. Υπολείπονται: 80,00 － ${formatNum(saved)} ＝ ${correctStr}.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Κάθετη Πρόσθεση Δεκαδικών με διαφορετικά δεκαδικά ψηφία
  {
    const q1IntA = randInt(12, 65);
    const q1DecA = randInt(1, 9) * 10 + randInt(1, 9);
    const q1IntB = randInt(8, 35);
    const q1DecB = randInt(1, 9);
    const q1AStr = `${q1IntA},${q1DecA}`;
    const q1BStr = `${q1IntB},${q1DecB}`;
    const q1ValA = q1IntA + q1DecA / 100;
    const q1ValB = q1IntB + q1DecB / 10;
    const q1Correct = Number((q1ValA + q1ValB).toFixed(2));
    const q1CorrectStr = formatNum(q1Correct);

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΚΑΘΕΤΗ ΠΡΟΣΘΕΣΗ ΔΕΚΑΔΙΚΩΝ',
      instruction: 'Υπολογίστε το άθροισμα των δεκαδικών αριθμών με κόμμα:',
      prompt: `Υπολογίστε το άθροισμα: ${q1AStr} ＋ ${q1BStr};`,
      correctVal: q1Correct,
      correctStr: q1CorrectStr,
      explanation: `Συμπληρώνοντας μηδενικό στο τέλος του 2ου αριθμού: ${q1AStr} ＋ ${q1BStr}0 ＝ ${q1CorrectStr}.`
    });
  }

  // Q2 (Input - Decimal): Εύρεση άγνωστου προσθετέου μέσω αφαίρεσης (α ＋ x ＝ γ)
  {
    const q2Int = randInt(15, 80);
    const q2Dec = randInt(1, 9) * 10;
    const q2SumInt = q2Int + randInt(10, 40);
    const q2AStr = `${q2Int},${q2Dec / 10}`;
    const q2SumStr = `${q2SumInt},${q2Dec / 10 + 5 > 9 ? 8 : q2Dec / 10 + 5}`;
    const q2ValA = parseFloat(q2AStr.replace(',', '.'));
    const q2ValSum = parseFloat(q2SumStr.replace(',', '.'));
    const q2Correct = Number((q2ValSum - q2ValA).toFixed(2));
    const q2CorrectStr = formatNum(q2Correct);

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΑΓΝΩΣΤΟΣ ΠΡΟΣΘΕΤΕΟΣ',
      instruction: 'Βρείτε τον αριθμό που λείπει από την ισότητα με κόμμα:',
      prompt: `Στην ισότητα ${q2AStr} ＋ χ ＝ ${q2SumStr}, ποια είναι η τιμή του χ;`,
      correctVal: q2Correct,
      correctStr: q2CorrectStr,
      explanation: `Χρησιμοποιούμε την αφαίρεση ως αντίστροφη πράξη: χ ＝ ${q2SumStr} － ${q2AStr} ＝ ${q2CorrectStr}.`
    });
  }

  // Q3 (MCQ): Αντιμεταθετική Ιδιότητα (Εγγύηση Μοναδικότητας)
  {
    const q3A = `${randInt(10, 40)},${randInt(1, 9)}`;
    const q3B = `${randInt(10, 40)},${randInt(11, 89)}`;
    const q3CorrectOption = `${q3B} ＋ ${q3A}`;
    const q3Wrong1 = `${q3B} － ${q3A}`;
    const q3Wrong2 = `${q3A} － ${q3B}`;
    const q3Wrong3 = `${q3A} · ${q3B}`;

    const rawOptions = [q3CorrectOption, q3Wrong1, q3Wrong2, q3Wrong3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q3CorrectOption
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΑΝΤΙΜΕΤΑΘΕΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      instruction: 'Επιλέξτε την ίση παράσταση σύμφωνα με την αντιμεταθετική ιδιότητα:',
      prompt: `Σύμφωνα με την αντιμεταθετική ιδιότητα, η παράσταση ${q3A} ＋ ${q3B} είναι ίση με:`,
      options,
      correctText: q3CorrectOption,
      explanation: `Η αντιμεταθετική ιδιότητα ορίζει ότι α ＋ β ＝ β ＋ α. Άρα ${q3A} ＋ ${q3B} ＝ ${q3CorrectOption}.`
    });
  }

  // Q4 (MCQ): Προσεταιριστική Ιδιότητα (Εγγύηση Μοναδικότητας)
  {
    const q4A = `${randInt(2, 8)},25`;
    const q4B = `${randInt(10, 30)},6`;
    const q4C = `${randInt(1, 5)},75`;
    const valA = parseFloat(q4A.replace(',', '.'));
    const valB = parseFloat(q4B.replace(',', '.'));
    const valC = parseFloat(q4C.replace(',', '.'));
    const correctSumNum = Number((valA + valB + valC).toFixed(2));
    const q4CorrectSum = formatNum(correctSumNum);

    const w1 = formatNum(correctSumNum + 1);
    const w2 = formatNum(Math.max(1, correctSumNum - 0.5));
    const w3 = formatNum(correctSumNum + 0.1);

    const rawOptions = [q4CorrectSum, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q4CorrectSum
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΠΡΟΣΕΤΑΙΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      instruction: 'Υπολογίστε έξυπνα το άθροισμα ομαδοποιώντας τα συμπληρώματα:',
      prompt: `Υπολογίστε το άθροισμα: (${q4A} ＋ ${q4C}) ＋ ${q4B};`,
      options,
      correctText: q4CorrectSum,
      explanation: `Προσθέτουμε πρώτα τα συμπληρώματα: ${q4A} ＋ ${q4C} ＝ ${formatNum(valA + valC)}. Στη συνέχεια προσθέτουμε το ${q4B}: ${formatNum(valA + valC)} ＋ ${q4B} ＝ ${q4CorrectSum}.`
    });
  }

  // Q5 (MCQ): True / False - Στοίχιση υποδιαστολών
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Κατά την κάθετη πρόσθεση δεκαδικών αριθμών, τοποθετούμε τις υποδιαστολές ακριβώς στην ίδια κατακόρυφη στήλη.'
      : 'Κατά την κάθετη πρόσθεση δεκαδικών αριθμών, στοιχίζουμε πάντα το τελευταίο ψηφίο στα δεξιά ανεξάρτητα από την υποδιαστολή.';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΣΤΟΙΧΙΣΗ ΥΠΟΔΙΑΣΤΟΛΗΣ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Η στοίχιση των υποδιαστολών εξασφαλίζει ότι προσθέτουμε ομώνυμες τάξεις (δέκατα με δέκατα, μονάδες με μονάδες).'
        : 'Λάθος! Στους δεκαδικούς αριθμούς στοιχίζουμε πάντα τις υποδιαστολές, ποτέ τα τελευταία ψηφία.'
    });
  }

  // Q6 (MCQ): True / False - Αφαίρεση ως αντίθετη πράξη / Δοκιμή
  {
    const q6A = randInt(10, 50);
    const q6B = randInt(5, 25);
    const q6Sum = q6A + q6B;
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? `Αν ${q6A} ＋ ${q6B} ＝ ${q6Sum}, τότε ισχύει πάντα ότι ${q6Sum} － ${q6B} ＝ ${q6A}.`
      : `Αν ${q6A} ＋ ${q6B} ＝ ${q6Sum}, τότε η πράξη ${q6Sum} ＋ ${q6B} αποτελεί τη δοκιμή της πρόσθεσης.`;
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΑΦΑΙΡΕΣΗ ΩΣ ΔΟΚΙΜΗ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? `Σωστό! Η αφαίρεση είναι η αντίστροφη πράξη της πρόσθεσης: ${q6Sum} － ${q6B} ＝ ${q6A}.`
        : 'Λάθος! Η δοκιμή της πρόσθεσης γίνεται με αφαίρεση ενός προσθετέου από το άθροισμα, όχι με πρόσθεση.'
    });
  }

  // Q7 (Input - Decimal): Οπτική Κάθετη Στοίχιση
  {
    const q7TopInt = randInt(20, 50);
    const q7TopDec = randInt(1, 9);
    const q7BotInt = randInt(10, 30);
    const q7BotDec = randInt(11, 89);
    const q7TopStr = `${q7TopInt},${q7TopDec}`;
    const q7BotStr = `${q7BotInt},${q7BotDec}`;
    const valTop = parseFloat(q7TopStr.replace(',', '.'));
    const valBot = parseFloat(q7BotStr.replace(',', '.'));
    const q7Correct = Number((valTop + valBot).toFixed(2));
    const q7CorrectStr = formatNum(q7Correct);

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΚΑΘΕΤΗ ΣΤΟΙΧΙΣΗ',
      instruction: 'Υπολογίστε το αποτέλεσμα της κάθετης πράξης με κόμμα:',
      prompt: `Υπολογίστε: ${q7TopStr} ＋ ${q7BotStr};`,
      verticalData: {
        topInt: String(q7TopInt),
        topDec: String(q7TopDec),
        botInt: String(q7BotInt),
        botDec: String(q7BotDec)
      },
      correctVal: q7Correct,
      correctStr: q7CorrectStr,
      explanation: `Στοιχίζοντας κατακόρυφα τις υποδιαστολές και προσθέτοντας μηδενικό (${q7TopStr}0 ＋ ${q7BotStr}): βρίσκουμε ${q7CorrectStr}.`
    });
  }

  // Q8 (MCQ): Πρόσθεση στην Αριθμογραμμή (Εγγύηση Μοναδικότητας)
  {
    const q8Base = randInt(2, 6);
    const q8Step = randInt(2, 5);
    const q8StartStr = `${q8Base},0`;
    const q8AddStr = `0,${q8Step}`;
    const q8ResultNum = Number((q8Base + q8Step * 0.1).toFixed(1));
    const q8ResultStr = formatNum(q8ResultNum);

    const w1 = formatNum(q8ResultNum + 1);
    const w2 = `${q8Base},0${q8Step}`;
    const w3 = formatNum(Math.max(1, q8ResultNum - 1));

    const rawOptions = [q8ResultStr, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8ResultStr
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΣΘΕΣΗ ΣΤΗΝ ΑΡΙΘΜΟΓΡΑΜΜΗ',
      instruction: 'Επιλέξτε τον αριθμό στον οποίο καταλήγει το βέλος:',
      prompt: `Στην αριθμογραμμή ξεκινάμε από το ${q8StartStr} και μετακινούμαστε δεξιά κατά ${q8AddStr}. Σε ποιον αριθμό φτάνουμε;`,
      options,
      correctText: q8ResultStr,
      explanation: `Ξεκινώντας από το ${q8StartStr} και προσθέτοντας ${q8AddStr}, φτάνουμε στο: ${q8StartStr} ＋ ${q8AddStr} ＝ ${q8ResultStr}.`
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
      title: `ΕΡΩΤΗΣΗ 9 • ${stdProb.title}`,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      correctVal: stdProb.correctVal,
      correctStr: stdProb.correctStr,
      explanation: stdProb.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας) - Πλήρως ευθυγραμμισμένη μονάδα μέτρησης και τίτλος
    qList.push({
      id: 10,
      type: 'mcq',
      title: `ΕΡΩΤΗΣΗ 10 • ${hardProb.title}`,
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

export default function ProsthesiExercisesPage() {
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
      title="Ασκήσεις: Πρόσθεση & Ιδιότητες - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στην πρόσθεση φυσικών και δεκαδικών αριθμών, τις ιδιότητες και την αφαίρεση για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/05-prosthesi"
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
              Ασκήσεις &amp; Προβλήματα: Πρόσθεση &amp; Ιδιότητες
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με κάθετη πρόσθεση δεκαδικών, αντιμεταθετική και προσεταιριστική ιδιότητα, εύρεση άγνωστου προσθετέου και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
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

                  {/* Οπτικη Καθετη Στοιχιση για την Q7 */}
                  {q.verticalData && (
                    <div className="bg-slate-100 rounded-2xl p-4 my-3 flex justify-center overflow-x-auto">
                      <svg viewBox="0 0 200 90" className="w-48 h-24 bg-white rounded-xl border border-slate-300 shadow-sm shrink-0 select-none">
                        <text x="35" y="56" fontSize="16" fontWeight="bold" textAnchor="start" fill="#94a3b8" fontFamily="sans-serif">
                          ＋
                        </text>
                        <text x="110" y="32" fontSize="16" fontWeight="bold" textAnchor="end" fill="#059669" fontFamily="monospace">
                          {q.verticalData.topInt}
                        </text>
                        <text x="115" y="32" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#d97706" fontFamily="monospace">
                          ,
                        </text>
                        <text x="120" y="32" fontSize="16" fontWeight="bold" textAnchor="start" fill="#059669" fontFamily="monospace">
                          {q.verticalData.topDec}
                        </text>

                        <text x="110" y="56" fontSize="16" fontWeight="bold" textAnchor="end" fill="#2563eb" fontFamily="monospace">
                          {q.verticalData.botInt}
                        </text>
                        <text x="115" y="56" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#d97706" fontFamily="monospace">
                          ,
                        </text>
                        <text x="120" y="56" fontSize="16" fontWeight="bold" textAnchor="start" fill="#2563eb" fontFamily="monospace">
                          {q.verticalData.botDec}
                        </text>

                        <line x1="30" y1="66" x2="170" y2="66" stroke="#334155" strokeWidth="2" />
                      </svg>
                    </div>
                  )}
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

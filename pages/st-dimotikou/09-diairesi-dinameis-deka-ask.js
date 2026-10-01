// pages/st-dimotikou/09-diairesi-dinameis-deka-ask.js
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
  if (val === '' || val === null || val === undefined || isNaN(val)) return '0';
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Μορφοποιηση αριθμου με τελειες χιλιαδων
function formatNumber(num) {
  if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
  return Number(num).toLocaleString('el-GR');
}

// Πληρης δεξαμενη θεματικων αντικειμενων καθημερινοτητας
const REAL_WORLD_ITEMS = [
  { item: 'λίτρα νερού', total: 450, group: 10, unit: 'λίτρα ανά δοχείο' },
  { item: 'ευρώ προϋπολογισμού', total: 1250, group: 100, unit: '€ ανά μαθητή' },
  { item: 'μέτρα καλωδίου', total: 3800, group: 1000, unit: 'μέτρα ανά πηνίο' },
  { item: 'γραμμάρια αλεύρι', total: 2500, group: 100, unit: 'γραμμάρια ανά πακέτο' },
  { item: 'σελίδες φωτοτυπιών', total: 840, group: 10, unit: 'σελίδες ανά πακέτο' }
];

// Διευρυμενη δεξαμενη κανονικων προβληματων για την Ερωτηση 9 (Input)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_div10_std_1',
    generate: () => {
      const totalCost = randInt(120, 350);
      const students = 100;
      const costPerStudent = Number((totalCost / students).toFixed(2));
      return {
        title: 'ΚΑΤΑΝΟΜΗ ΚΟΣΤΟΥΣ ΒΙΒΛΙΩΝ',
        instruction: 'Υπολογίστε το ποσό ανά μαθητή σε ευρώ (€) με κόμμα:',
        text: `Μια ομάδα ${students} μαθητών συγκέντρωσε ${totalCost} € για την αγορά βιβλίων. Πόσα ευρώ (€) αντιστοιχούν σε κάθε μαθητή;`,
        tableData: { col1: 'Συνολικό Ποσό', col2: 'Μαθητές', r1: [`${totalCost} €`, `${students} μαθητές`], r2: ['Διαίρεση', `${formatNum(costPerStudent, 2)} €`] },
        correctVal: costPerStudent,
        correctStr: formatNum(costPerStudent, 2),
        explanation: `Μετακινούμε την υποδιαστολή 2 θέσεις αριστερά: ${totalCost} : ${students} ＝ ${formatNum(costPerStudent, 2)} €.`
      };
    }
  },
  {
    id: 'p_div10_std_2',
    generate: () => {
      const lengthM = randInt(12, 35) + 0.5;
      const divisor = 0.1;
      const pieces = Number((lengthM / divisor).toFixed(0));
      return {
        title: 'ΚΟΠΗ ΥΦΑΣΜΑΤΟΣ ΣΕ ΔΕΚΑΤΑ',
        instruction: 'Υπολογίστε πόσα κομμάτια προέκυψαν (ακέραιος):',
        text: `Ένα ύφασμα μήκους ${formatNum(lengthM)} m κόπηκε σε κομμάτια μήκους 0,1 m το καθένα. Πόσα κομμάτια προέκυψαν συνολικά;`,
        tableData: { col1: 'Μήκος Υφάσματος', col2: 'Μήκος Κομματιού', r1: [`${formatNum(lengthM)} m`, '0,1 m'], r2: ['Διαίρεση', `${pieces} κομμάτια`] },
        correctVal: pieces,
        correctStr: String(pieces),
        explanation: `Η διαίρεση με το 0,1 ισοδυναμεί με πολλαπλασιασμό επί 10 (μετακίνηση 1 θέση δεξιά): ${formatNum(lengthM)} : 0,1 ＝ ${pieces} κομμάτια.`
      };
    }
  },
  {
    id: 'p_div10_std_3',
    generate: () => {
      const totalG = randInt(250, 950);
      const divisor = 1000;
      const kg = Number((totalG / divisor).toFixed(3));
      return {
        title: 'ΜΕΤΑΤΡΟΠΗ ΓΡΑΜΜΑΡΙΩΝ ΣΕ ΚΙΛΑ',
        instruction: 'Υπολογίστε το βάρος σε κιλά (kg) με κόμμα:',
        text: `Ένα κουτί γλυκών ζυγίζει ${totalG} g. Πόσα κιλά (kg) είναι το βάρος του κουτιού, αν γνωρίζουμε ότι 1 kg ＝ 1.000 g;`,
        tableData: { col1: 'Βάρος σε γραμμάρια', col2: 'Αναγωγή σε κιλά', r1: [`${totalG} g`, ': 1.000'], r2: ['Υπολογισμός', `${formatNum(kg, 3)} kg`] },
        correctVal: kg,
        correctStr: formatNum(kg, 3),
        explanation: `Μετατρέπουμε τα γραμμάρια σε κιλά διαιρώντας με το 1.000 (3 θέσεις αριστερά): ${totalG} : 1.000 ＝ ${formatNum(kg, 3)} kg.`
      };
    }
  },
  {
    id: 'p_div10_std_4',
    generate: () => {
      const totalL = randInt(150, 480);
      const bottles = 10;
      const perBottle = Number((totalL / bottles).toFixed(1));
      return {
        title: 'ΙΣΟΜΟΙΡΑΣΙΑ ΧΥΜΟΥ ΣΕ ΔΟΧΕΙΑ',
        instruction: 'Υπολογίστε τον όγκο ανά δοχείο σε λίτρα (L) με κόμμα:',
        text: `Μια ποσότητα ${totalL} L χυμού μοιράστηκε εξίσου σε ${bottles} μεγάλα δοχεία. Πόσα λίτρα (L) χυμού περιέχει το κάθε δοχείο;`,
        tableData: { col1: 'Συνολικός Χυμός', col2: 'Δοχεία', r1: [`${totalL} L`, `${bottles} δοχεία`], r2: ['Διαίρεση', `${formatNum(perBottle, 1)} L`] },
        correctVal: perBottle,
        correctStr: formatNum(perBottle, 1),
        explanation: `Μετακινούμε την υποδιαστολή 1 θέση αριστερά: ${totalL} : 10 ＝ ${formatNum(perBottle, 1)} L.`
      };
    }
  },
  {
    id: 'p_div10_std_5',
    generate: () => {
      const wireM = randInt(24, 68);
      const divisor = 0.01;
      const pieces = Number((wireM / divisor).toFixed(0));
      return {
        title: 'ΚΟΠΗ ΣΥΡΜΑΤΟΣ ΣΕ ΕΚΑΤΟΣΤΑ',
        instruction: 'Υπολογίστε πόσα κομμάτια προέκυψαν (ακέραιος):',
        text: `Ένα σύρμα μήκους ${wireM} m κόπηκε σε μικρά κομματάκια μήκους 0,01 m (1 cm) το καθένα. Πόσα κομμάτια σχηματίστηκαν συνολικά;`,
        tableData: { col1: 'Συνολικό Μήκος', col2: 'Μήκος Τεμαχίου', r1: [`${wireM} m`, '0,01 m'], r2: ['Διαίρεση', `${formatNumber(pieces)} τεμάχια`] },
        correctVal: pieces,
        correctStr: String(pieces),
        explanation: `Η διαίρεση με το 0,01 ισοδυναμεί με πολλαπλασιασμό επί 100 (2 θέσεις δεξιά): ${wireM} : 0,01 ＝ ${formatNumber(pieces)} κομμάτια.`
      };
    }
  },
  {
    id: 'p_div10_std_6',
    generate: () => {
      const lengthM = randInt(4500, 8500);
      const divisor = 1000;
      const km = Number((lengthM / divisor).toFixed(2));
      return {
        title: 'ΜΕΤΑΤΡΟΠΗ ΜΕΤΡΩΝ ΣΕ ΧΙΛΙΟΜΕΤΡΑ',
        instruction: 'Υπολογίστε την απόσταση σε χιλιόμετρα (km) με κόμμα:',
        text: `Μια διαδρομή ποδηλασίας έχει μήκος ${formatNumber(lengthM)} m. Πόσα χιλιόμετρα (km) είναι η απόσταση αυτή, αν 1 km ＝ 1.000 m;`,
        tableData: { col1: 'Μέτρα', col2: 'Αναγωγή σε km', r1: [`${formatNumber(lengthM)} m`, ': 1.000'], r2: ['Αποτέλεσμα', `${formatNum(km, 2)} km`] },
        correctVal: km,
        correctStr: formatNum(km, 2),
        explanation: `Μετατρέπουμε τα μέτρα σε χιλιόμετρα διαιρώντας με το 1.000 (3 θέσεις αριστερά): ${formatNumber(lengthM)} : 1.000 ＝ ${formatNum(km, 2)} km.`
      };
    }
  }
];

// Διευρυμενη δεξαμενη προβληματων για την Ερωτηση 10 (MCQ)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_div10_hard_1',
    generate: () => {
      const totalCost = randInt(150, 480);
      const students = 100;
      const costPerStudent = Number((totalCost / students).toFixed(2));
      const correctStr = `${formatNum(costPerStudent, 2)} €`;
      const fake1 = `${formatNum(costPerStudent * 10, 2)} €`;
      const fake2 = `${formatNum(costPerStudent / 10, 3)} €`;
      const fake3 = `${formatNum(costPerStudent + 1.5, 2)} €`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΚΑΤΑΝΟΜΗ ΕΞΟΔΩΝ ΣΧΟΛΙΚΗΣ ΕΚΔΡΟΜΗΣ',
        instruction: 'Επιλέξτε το σωστό ποσό ανά μαθητή σε ευρώ (€):',
        text: `Για μια εκδρομή ${students} μαθητών συγκεντρώθηκαν συνολικά ${totalCost} € για εισιτήρια. Πόσα ευρώ (€) αντιστοιχούν σε κάθε μαθητή;`,
        tableData: { col1: 'Συνολικό Ποσό', col2: 'Μαθητές', r1: [`${totalCost} €`, `${students} μαθητές`], r2: ['Διαίρεση', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Μετακινούμε την υποδιαστολή 2 θέσεις αριστερά: ${totalCost} : ${students} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_div10_hard_2',
    generate: () => {
      const lengthM = randInt(14, 38) + 0.5;
      const divisor = 0.1;
      const pieces = Number((lengthM / divisor).toFixed(0));
      const correctStr = `${pieces} κομμάτια`;
      const fake1 = `${pieces + 10} κομμάτια`;
      const fake2 = `${Math.max(1, pieces - 15)} κομμάτια`;
      const fake3 = `${pieces * 2} κομμάτια`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΚΑΤΑΜΕΤΡΗΣΗ ΚΟΜΜΑΤΙΩΝ ΥΦΑΣΜΑΤΟΣ',
        instruction: 'Επιλέξτε το συνολικό πλήθος των κομματιών:',
        text: `Ένα ύφασμα μήκους ${formatNum(lengthM)} m κόπηκε σε κομμάτια μήκους 0,1 m το καθένα. Πόσα κομμάτια προέκυψαν συνολικά;`,
        tableData: { col1: 'Μήκος Υφάσματος', col2: 'Μήκος Κομματιού', r1: [`${formatNum(lengthM)} m`, '0,1 m'], r2: ['Διαίρεση', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Η διαίρεση με το 0,1 ισοδυναμεί με πολλαπλασιασμό επί 10: ${formatNum(lengthM)} : 0,1 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_div10_hard_3',
    generate: () => {
      const totalG = randInt(450, 950);
      const divisor = 1000;
      const kg = Number((totalG / divisor).toFixed(3));
      const correctStr = `${formatNum(kg, 3)} kg`;
      const fake1 = `${formatNum(kg * 10, 2)} kg`;
      const fake2 = `${formatNum(kg / 10, 4)} kg`;
      const fake3 = `${formatNum(kg + 0.5, 3)} kg`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΜΕΤΑΤΡΟΠΗ ΜΑΖΑΣ ΣΥΣΚΕΥΑΣΙΑΣ ΣΕ ΚΙΛΑ',
        instruction: 'Επιλέξτε το σωστό βάρος σε κιλά (kg):',
        text: `Ένα κουτί γλυκών ζυγίζει ${totalG} g. Πόσα κιλά (kg) είναι το βάρος του κουτιού, αν γνωρίζουμε ότι 1 kg ＝ 1.000 g;`,
        tableData: { col1: 'Βάρος σε γραμμάρια', col2: 'Αναγωγή σε κιλά', r1: [`${totalG} g`, ': 1.000'], r2: ['Αποτέλεσμα', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Μετατρέπουμε τα γραμμάρια σε κιλά διαιρώντας με το 1.000 (3 θέσεις αριστερά): ${totalG} : 1.000 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_div10_hard_4',
    generate: () => {
      const totalL = randInt(12, 35);
      const divisor = 0.01;
      const cups = Number((totalL / divisor).toFixed(0));
      const correctStr = `${formatNumber(cups)} φλιτζάνια`;
      const fake1 = `${formatNumber(cups + 100)} φλιτζάνια`;
      const fake2 = `${formatNumber(Math.max(50, cups - 200))} φλιτζάνια`;
      const fake3 = `${formatNumber(cups * 2)} φλιτζάνια`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΜΕΡΙΔΙΟΠΟΙΗΣΗ ΥΓΡΟΥ ΣΕ ΕΚΑΤΟΣΤΑ ΤΟΥ ΛΙΤΡΟΥ',
        instruction: 'Επιλέξτε πόσα φλιτζάνια θα γεμίσουν:',
        text: `Ένα δοχείο περιέχει ${totalL} L τσάι. Αν σερβιριστεί σε φλιτζανάκια χωρητικότητας 0,01 L (10 mL) το καθένα, πόσα τέτοια φλιτζάνια θα γεμίσουν συνολικά;`,
        tableData: { col1: 'Συνολικός Όγκος', col2: 'Χωρητικότητα Φλιτζανιού', r1: [`${totalL} L`, '0,01 L'], r2: ['Διαίρεση', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Διαιρούμε με το 0,01 (ισοδυναμεί με πολλαπλασιασμό επί 100): ${totalL} : 0,01 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_div10_hard_5',
    generate: () => {
      const lengthCm = randInt(350, 850);
      const divisor = 100;
      const m = Number((lengthCm / divisor).toFixed(2));
      const correctStr = `${formatNum(m, 2)} m`;
      const fake1 = `${formatNum(m * 10, 1)} m`;
      const fake2 = `${formatNum(m / 10, 3)} m`;
      const fake3 = `${formatNum(m + 1.2, 2)} m`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΜΕΤΑΤΡΟΠΗ ΜΗΚΟΥΣ ΣΑΝΙΔΑΣ ΣΕ ΜΕΤΡΑ',
        instruction: 'Επιλέξτε το σωστό μήκος σε μέτρα (m):',
        text: `Μια ξύλινη σανίδα έχει μήκος ${lengthCm} cm. Πόσα μέτρα (m) είναι το μήκος της, αν γνωρίζουμε ότι 1 m ＝ 100 cm;`,
        tableData: { col1: 'Μήκος σε εκατοστά', col2: 'Αναγωγή σε μέτρα', r1: [`${lengthCm} cm`, ': 100'], r2: ['Αποτέλεσμα', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Μετατρέπουμε τα εκατοστά σε μέτρα διαιρώντας με το 100 (2 θέσεις αριστερά): ${lengthCm} : 100 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_div10_hard_6',
    generate: () => {
      const budget = randInt(1500, 4500);
      const workers = 100;
      const bonus = Number((budget / workers).toFixed(2));
      const correctStr = `${formatNum(bonus, 2)} €`;
      const fake1 = `${formatNum(bonus * 10, 2)} €`;
      const fake2 = `${formatNum(bonus / 10, 3)} €`;
      const fake3 = `${formatNum(bonus + 10, 2)} €`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΔΙΑΝΟΜΗ ΕΤΑΙΡΙΚΟΥ ΕΠΙΔΟΜΑΤΟΣ',
        instruction: 'Επιλέξτε το ποσό ανά εργαζόμενο σε ευρώ (€):',
        text: `Μια εταιρεία διέθεσε ${formatNumber(budget)} € ως επίδομα που θα μοιραστεί ισόποσα σε ${workers} εργαζομένους. Πόσα ευρώ (€) θα λάβει ο καθένας;`,
        tableData: { col1: 'Συνολικό Επίδομα', col2: 'Εργαζόμενοι', r1: [`${formatNumber(budget)} €`, `${workers} άτομα`], r2: ['Διαίρεση', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Μετακινούμε την υποδιαστολή 2 θέσεις αριστερά: ${formatNumber(budget)} : 100 ＝ ${correctStr}.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];
  const shuffledItems = shuffle(REAL_WORLD_ITEMS);

  // Q1 (Input - Decimal): Διαίρεση με 10, 100, 1000
  {
    const q1Int = randInt(12, 95);
    const q1Dec = randInt(1, 9);
    const q1Div = [10, 100, 1000][randInt(0, 2)];
    const q1Val = parseFloat(`${q1Int}.${q1Dec}`);
    const q1RawAns = parseFloat((q1Val / q1Div).toFixed(5));
    const q1Correct = q1RawAns;
    const q1CorrectStr = formatNum(q1RawAns, 5);
    const q1Prompt = `${q1Int},${q1Dec} : ${formatNumber(q1Div)}`;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΔΙΑΙΡΕΣΗ ΜΕ 10, 100, 1.000',
      instruction: 'Υπολογίστε το πηλίκο μετακινώντας την υποδιαστολή (με κόμμα):',
      prompt: `Υπολογίστε: ${q1Prompt};`,
      correctVal: q1Correct,
      correctStr: q1CorrectStr,
      explanation: `Διαιρώντας με το ${formatNumber(q1Div)}, μετακινούμε την υποδιαστολή ${q1Div === 10 ? '1 θέση' : q1Div === 100 ? '2 θέσεις' : '3 θέσεις'} προς τα αριστερά: ${q1Prompt} ＝ ${q1CorrectStr}.`
    });
  }

  // Q2 (Input - Decimal): Διαίρεση με 0,1, 0,01, 0,001
  {
    const q2Int = randInt(2, 48);
    const q2Dec = randInt(1, 9);
    const q2Div = [0.1, 0.01, 0.001][randInt(0, 2)];
    const q2Val = parseFloat(`${q2Int}.${q2Dec}`);
    const q2RawAns = parseFloat((q2Val / q2Div).toFixed(2));
    const q2Correct = q2RawAns;
    const q2CorrectStr = formatNum(q2RawAns, 2);
    const q2DivStr = formatNum(q2Div);
    const q2Prompt = `${q2Int},${q2Dec} : ${q2DivStr}`;

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΔΙΑΙΡΕΣΗ ΜΕ 0,1, 0,01, 0,001',
      instruction: 'Υπολογίστε το πηλίκο μετακινώντας την υποδιαστολή (με κόμμα):',
      prompt: `Υπολογίστε: ${q2Prompt};`,
      correctVal: q2Correct,
      correctStr: q2CorrectStr,
      explanation: `Διαιρώντας με το ${q2DivStr}, μετακινούμε την υποδιαστολή ${q2Div === 0.1 ? '1 θέση' : q2Div === 0.01 ? '2 θέσεις' : '3 θέσεις'} προς τα δεξιά: ${q2Prompt} ＝ ${q2CorrectStr}.`
    });
  }

  // Q3 (MCQ): Εύρεση του διαιρέτη που λείπει (Εγγύηση Μοναδικότητας)
  {
    const q3Int = randInt(15, 85);
    const q3Dec = randInt(1, 9);
    const q3ValStr = `${q3Int},${q3Dec}`;
    const q3DivType = randInt(1, 4);
    let q3CorrectDiv = '100';
    let q3ResultStr = '';

    if (q3DivType === 1) {
      q3CorrectDiv = '10';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) / 10, 2);
    } else if (q3DivType === 2) {
      q3CorrectDiv = '100';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) / 100, 3);
    } else if (q3DivType === 3) {
      q3CorrectDiv = '1.000';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) / 1000, 4);
    } else {
      q3CorrectDiv = '0,1';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) / 0.1, 1);
    }

    const rawOptions = ['10', '100', '1.000', '0,1', '0,01'];
    const filteredOptions = rawOptions.filter((d) => d !== q3CorrectDiv).slice(0, 3).concat(q3CorrectDiv);
    const options = shuffle([...new Set(filteredOptions)]).map((text) => ({
      text,
      isCorrect: text === q3CorrectDiv
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΕΥΡΕΣΗ ΔΙΑΙΡΕΤΗ',
      instruction: 'Βρείτε τον διαιρέτη που λείπει:',
      prompt: `Στην ισότητα ${q3ValStr} : χ ＝ ${q3ResultStr}, ποιος είναι ο αριθμός χ;`,
      options,
      correctText: q3CorrectDiv,
      explanation: `Για να φτάσουμε από το ${q3ValStr} στο ${q3ResultStr}, η υποδιαστολή μετακινήθηκε κατάλληλα. Ο σωστός διαιρέτης είναι το ${q3CorrectDiv}.`
    });
  }

  // Q4 (MCQ): Πρόβλημα Καθημερινότητας (Εγγύηση Μοναδικότητας)
  {
    const q4Item = shuffledItems[0];
    const q4Val = parseFloat((q4Item.total / q4Item.group).toFixed(2));
    const q4Correct = `${formatNum(q4Val, 2)} ${q4Item.unit}`;
    const q4Wrong1 = `${formatNum(q4Val * 10, 2)} ${q4Item.unit}`;
    const q4Wrong2 = `${formatNum(q4Val / 10, 2)} ${q4Item.unit}`;
    const q4Wrong3 = `${formatNum(q4Item.total + q4Item.group, 2)} ${q4Item.unit}`;

    const rawOptions = [q4Correct, q4Wrong1, q4Wrong2, q4Wrong3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q4Correct
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: 'Υπολογίστε το αποτέλεσμα της κατανομής:',
      prompt: `Μοιράζουμε ${formatNumber(q4Item.total)} ${q4Item.item} σε ${formatNumber(q4Item.group)} ίσα μέρη. Πόσο αντιστοιχεί σε κάθε μέρος;`,
      options,
      correctText: q4Correct,
      explanation: `Υπολογίζουμε τη διαίρεση: ${formatNumber(q4Item.total)} : ${formatNumber(q4Item.group)} ＝ ${q4Correct}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας μετατόπισης αριστερά (10, 100, 1000)
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Όταν διαιρούμε έναν δεκαδικό αριθμό με το 100, μετακινούμε την υποδιαστολή 2 θέσεις προς τα αριστερά.'
      : 'Όταν διαιρούμε έναν δεκαδικό αριθμό με το 100, μετακινούμε την υποδιαστολή 2 θέσεις προς τα δεξιά.';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΜΕΤΑΤΟΠΙΣΗΣ ΑΡΙΣΤΕΡΑ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Η διαίρεση με 10, 100, 1.000 μικραίνει τον αριθμό, άρα η υποδιαστολή μετακινείται αριστερά.'
        : 'Λάθος! Η διαίρεση με το 100 μετακινεί την υποδιαστολή 2 θέσεις προς τα ΑΡΙΣΤΕΡΑ (όχι δεξιά).'
    });
  }

  // Q6 (MCQ): True / False - Κανόνας μετατόπισης δεξιά (0,1, 0,01) & Ισοδυναμία
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Η διαίρεση ενός αριθμού με το 0,1 μεγαλώνει τον αριθμό (είναι ισοδύναμη με πολλαπλασιασμό με το 10).'
      : 'Η διαίρεση ενός αριθμού με το 0,01 μικραίνει τον αριθμό κατά 100 φορές.';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΜΕΤΑΤΟΠΙΣΗΣ ΔΕΞΙΑ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Η διαίρεση με το 0,1 ισοδυναμεί με πολλαπλασιασμό επί 10, επομένως ο αριθμός μεγαλώνει.'
        : 'Λάθος! Η διαίρεση με το 0,01 ΜΕΓΑΛΩΝΕΙ τον αριθμό κατά 100 φορές.'
    });
  }

  // Q7 (Input - Decimal): Οπτική Μετατόπιση Υποδιαστολής
  {
    const q7Int = randInt(12, 85);
    const q7Dec = randInt(1, 9);
    const q7Div = [10, 100][randInt(0, 1)];
    const q7Val = parseFloat(`${q7Int}.${q7Dec}`);
    const q7Ans = q7Val / q7Div;
    const q7AnsStr = formatNum(q7Ans, 3);

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΜΕΤΑΤΟΠΙΣΗ ΥΠΟΔΙΑΣΤΟΛΗΣ',
      instruction: 'Υπολογίστε το αποτέλεσμα της μετατόπισης με κόμμα:',
      prompt: `Υπολογίστε: ${q7Int},${q7Dec} : ${formatNumber(q7Div)};`,
      startStr: `${q7Int},${q7Dec}`,
      div: q7Div,
      correctVal: q7Ans,
      correctStr: q7AnsStr,
      explanation: `Ξεκινώντας από το ${q7Int},${q7Dec} και κάνοντας ${q7Div === 10 ? '1 άλμα' : '2 άλματα'} αριστερά λόγω του : ${formatNumber(q7Div)}, βρίσκουμε ${q7AnsStr}.`
    });
  }

  // Q8 (MCQ): Αναγνώριση Πράξης από Μετατόπιση (Εγγύηση Μοναδικότητας)
  {
    const q8BaseInt = randInt(35, 95);
    const q8BaseDec = randInt(1, 9);
    const q8StartStr = `${q8BaseInt},${q8BaseDec}`;
    const q8TargetVal = parseFloat((parseFloat(`${q8BaseInt}.${q8BaseDec}`) / 0.1).toFixed(1));
    const q8TargetStr = formatNum(q8TargetVal, 1);
    const q8CorrectDiv = ': 0,1';

    const rawOptions = [': 0,1', ': 10', ': 0,01', ': 100'];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8CorrectDiv
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΑΝΑΓΝΩΡΙΣΗ ΠΡΑΞΗΣ ΑΠΟ ΜΕΤΑΤΟΠΙΣΗ',
      instruction: 'Επιλέξτε την πράξη που εκτελέστηκε:',
      prompt: `Ποια πράξη μετέτρεψε το ${q8StartStr} σε ${q8TargetStr};`,
      options,
      correctText: q8CorrectDiv,
      explanation: `Η υποδιαστολή μετακινήθηκε 1 θέση προς τα δεξιά (από ${q8StartStr} σε ${q8TargetStr}), άρα ο αριθμός μεγάλωσε κατά 10 φορές, πράγμα που σημαίνει διαίρεση με το 0,1 (${q8CorrectDiv}).`
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

export default function DiairesiDinameisDekaExercisesPage() {
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
      title="Ασκήσεις: Διαίρεση με Δυνάμεις του 10 - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στη διαίρεση με δυνάμεις του 10 για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/09-diairesi-dinameis-deka"
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
              Ασκήσεις &amp; Προβλήματα: Διαίρεση με Δυνάμεις του 10
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες μετατόπισης υποδιαστολής με 10, 100, 1.000 και 0,1, 0,01, 0,001 και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
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

                  {/* Οπτικη Μετατοπιση για την Q7 */}
                  {q.startStr && q.div && (
                    <div className="bg-slate-100 rounded-2xl p-4 my-3 flex justify-center overflow-x-auto">
                      <svg viewBox="0 0 300 70" className="w-full max-w-xs h-16 select-none shrink-0 overflow-visible">
                        <defs>
                          <marker
                            id="diairesi-ask-arrow-left"
                            viewBox="0 0 10 10"
                            refX="6"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                          >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                          </marker>
                        </defs>

                        <text x="210" y="55" fontSize="22" fontWeight="black" fill="#1e293b" fontFamily="monospace">
                          {q.startStr}
                        </text>
                        <path
                          d="M 205 35 Q 155 8 105 35"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
                          markerEnd="url(#diairesi-ask-arrow-left)"
                        />
                        <text x="155" y="16" fontSize="11" fontWeight="black" textAnchor="middle" fill="#d97706">
                          : {formatNumber(q.div)}
                        </text>
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

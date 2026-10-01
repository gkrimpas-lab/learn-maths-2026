// pages/st-dimotikou/01-fysikoi-ask.js
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

// Μορφοποιηση αριθμου με τελειες χιλιαδων
function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return Number(num).toLocaleString('el-GR');
}

// Δημιουργια 6ψηφιου αριθμου με μοναδικα ψηφια
function generateUniqueDigitsNumber() {
  const firstDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const allDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  const d0 = firstDigits[randInt(0, firstDigits.length - 1)];
  const remaining = allDigits.filter((d) => d !== d0);
  const shuffled = shuffle(remaining);
  
  const chosen = [d0, ...shuffled.slice(0, 5)];
  return Number(chosen.join(''));
}

// Διευρυμενη Δεξαμενη Κανονικων Προβληματων (για Q7 και Q8)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_fys_std_1',
    generate: () => {
      const digit = randInt(2, 8);
      const tickets = digit * 100000 + randInt(12, 85) * 1000;
      const targetPos = 'Εκατοντάδες Χιλιάδων';
      const digitVal = digit * 100000;
      const valStr = formatNumber(digitVal);
      const f1 = formatNumber(digit * 10000);
      const f2 = formatNumber(digit * 1000000);
      const f3 = formatNumber(digit * 1000);

      const rawOptions = [valStr, f1, f2, f3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === valStr
      }));

      return {
        title: 'ΑΞΙΑ ΘΕΣΗΣ ΣΕ ΕΙΣΙΤΗΡΙΑ',
        inputInstruction: 'Υπολογίστε την αριθμητική αξία του ψηφίου (ακέραιος χωρίς τελείες):',
        mcqInstruction: 'Επιλέξτε την πραγματική αριθμητική αξία του ψηφίου:',
        text: `Σε μια διεθνή συναυλία διατέθηκαν ${formatNumber(tickets)} εισιτήρια. Ποια είναι η πραγματική αριθμητική αξία του ψηφίου των ${targetPos} (${digit});`,
        tableData: { col1: 'Εισιτήρια', col2: 'Θέση', r1: [`${formatNumber(tickets)}`, `${targetPos}`], r2: [`Ψηφίο: ${digit}`, `Αξία: ${valStr}`] },
        correctVal: digitVal,
        correctStr: String(digitVal),
        options,
        correctText: valStr,
        explanation: `Το ψηφίο των ${targetPos} είναι το ${digit}, άρα η αξία του είναι ${digit} · 100.000 ＝ ${valStr}.`
      };
    }
  },
  {
    id: 'p_fys_std_2',
    generate: () => {
      const pA = randInt(35, 75) * 10000;
      const diff = randInt(12, 35) * 1000;
      const pB = pA + diff;
      const correctStr = `${formatNumber(diff)} κάτοικοι`;
      const f1 = `${formatNumber(diff + 10000)} κάτοικοι`;
      const f2 = `${formatNumber(Math.max(1000, diff - 10000))} κάτοικοι`;
      const f3 = `${formatNumber(diff + 5000)} κάτοικοι`;

      const rawOptions = [correctStr, f1, f2, f3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΣΥΓΚΡΙΣΗ ΠΛΗΘΥΣΜΟΥ ΠΕΡΙΦΕΡΕΙΩΝ',
        inputInstruction: 'Υπολογίστε τη διαφορά πληθυσμού (ακέραιος χωρίς τελείες):',
        mcqInstruction: 'Επιλέξτε πόσους περισσότερους κατοίκους έχει η μεγαλύτερη περιφέρεια:',
        text: `Δύο όμορες περιφέρειες έχουν πληθυσμούς ${formatNumber(pB)} και ${formatNumber(pA)} κατοίκους. Πόσους περισσότερους κατοίκους έχει η μεγαλύτερη περιφέρεια;`,
        tableData: { col1: 'Περιφέρεια Α', col2: 'Περιφέρεια Β', r1: [`${formatNumber(pB)} κατ.`, `${formatNumber(pA)} κατ.`], r2: ['Διαφορά', `${formatNumber(diff)} κατ.`] },
        correctVal: diff,
        correctStr: String(diff),
        options,
        correctText: correctStr,
        explanation: `Αφαιρούμε τον μικρότερο αριθμό από τον μεγαλύτερο: ${formatNumber(pB)} － ${formatNumber(pA)} ＝ ${formatNumber(diff)} κάτοικοι.`
      };
    }
  },
  {
    id: 'p_fys_std_3',
    generate: () => {
      const thousands = randInt(250, 650);
      const fullNum = thousands * 1000;
      const correctStr = `${formatNumber(thousands)} χιλιάδες`;
      const f1 = `${formatNumber(thousands * 10)} χιλιάδες`;
      const f2 = `${formatNumber(Math.floor(thousands / 10))} χιλιάδες`;
      const f3 = `${formatNumber(thousands + 100)} χιλιάδες`;

      const rawOptions = [correctStr, f1, f2, f3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΚΑΤΑΜΕΤΡΗΣΗ ΠΡΟΒΟΛΩΝ ΣΕ ΧΙΛΙΑΔΕΣ',
        inputInstruction: 'Υπολογίστε το πλήθος των χιλιάδων (ακέραιος χωρίς τελείες):',
        mcqInstruction: 'Επιλέξτε πόσες ακέραιες χιλιάδες προβολών συγκεντρώθηκαν:',
        text: `Ένα εκπαιδευτικό βίντεο συγκέντρωσε ${formatNumber(fullNum)} προβολές. Πόσες ακέραιες χιλιάδες προβολών συγκέντρωσε το βίντεο;`,
        tableData: { col1: 'Προβολές', col2: 'Μονάδα Χιλιάδων', r1: [`${formatNumber(fullNum)}`, '1 Χιλιάδα ＝ 1.000'], r2: ['Διαίρεση με 1.000', `${formatNumber(thousands)}`] },
        correctVal: thousands,
        correctStr: String(thousands),
        options,
        correctText: correctStr,
        explanation: `Διαιρούμε με το 1.000: ${formatNumber(fullNum)} : 1.000 ＝ ${formatNumber(thousands)} χιλιάδες.`
      };
    }
  },
  {
    id: 'p_fys_std_4',
    generate: () => {
      const copies = randInt(12, 45) * 10000;
      const digit = Math.floor(copies / 10000);
      const digitVal = digit * 10000;
      const valStr = formatNumber(digitVal);
      const f1 = formatNumber(digit * 1000);
      const f2 = formatNumber(digit * 100000);
      const f3 = formatNumber(digit * 100);

      const rawOptions = [valStr, f1, f2, f3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === valStr
      }));

      return {
        title: 'ΑΞΙΑ ΘΕΣΗΣ ΣΕ ΑΝΤΙΤΥΠΑ ΒΙΒΛΙΩΝ',
        inputInstruction: 'Υπολογίστε την αξία του ψηφίου των Δεκάδων Χιλιάδων:',
        mcqInstruction: 'Επιλέξτε την πραγματική αξία του ψηφίου των Δεκάδων Χιλιάδων:',
        text: `Ένας εκδοτικός οίκος τύπωσε ${formatNumber(copies)} αντίτυπα ενός λεξικού. Ποια είναι η πραγματική αξία του ψηφίου των Δεκάδων Χιλιάδων (${digit});`,
        tableData: { col1: 'Αντίτυπα', col2: 'Θέση', r1: [`${formatNumber(copies)}`, 'Δεκάδες Χιλιάδων'], r2: [`Ψηφίο: ${digit}`, `Αξία: ${valStr}`] },
        correctVal: digitVal,
        correctStr: String(digitVal),
        options,
        correctText: valStr,
        explanation: `Το ψηφίο ${digit} βρίσκεται στις Δεκάδες Χιλιάδων, άρα η αξία του είναι ${digit} · 10.000 ＝ ${valStr}.`
      };
    }
  },
  {
    id: 'p_fys_std_5',
    generate: () => {
      const year1 = randInt(110, 240) * 1000;
      const diff = randInt(15, 45) * 1000;
      const year2 = year1 + diff;
      const correctStr = `${formatNumber(diff)} kg`;
      const f1 = `${formatNumber(diff + 10000)} kg`;
      const f2 = `${formatNumber(Math.max(1000, diff - 5000))} kg`;
      const f3 = `${formatNumber(diff + 20000)} kg`;

      const rawOptions = [correctStr, f1, f2, f3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΠΑΡΑΓΩΓΗ ΕΛΑΙΟΛΑΔΟΥ',
        inputInstruction: 'Υπολογίστε την αύξηση της παραγωγής σε κιλά (kg):',
        mcqInstruction: 'Επιλέξτε πόσα κιλά παραπάνω παρήχθησαν τη δεύτερη χρονιά:',
        text: `Ένας συνεταιρισμός παρήγαγε ${formatNumber(year1)} kg ελαιόλαδο την πρώτη χρονιά και ${formatNumber(year2)} kg τη δεύτερη χρονιά. Πόσα κιλά (kg) παραπάνω παρήγαγε τη δεύτερη χρονιά;`,
        tableData: { col1: '1η Χρονιά', col2: '2η Χρονιά', r1: [`${formatNumber(year1)} kg`, `${formatNumber(year2)} kg`], r2: ['Αύξηση', `${formatNumber(diff)} kg`] },
        correctVal: diff,
        correctStr: String(diff),
        options,
        correctText: correctStr,
        explanation: `Αφαιρούμε την παραγωγή του πρώτου έτους: ${formatNumber(year2)} － ${formatNumber(year1)} ＝ ${formatNumber(diff)} kg.`
      };
    }
  },
  {
    id: 'p_fys_std_6',
    generate: () => {
      const spectators = randInt(15, 35) * 1000;
      const hundreds = Math.floor(spectators / 100);
      const correctStr = `${formatNumber(hundreds)} εκατοντάδες`;
      const f1 = `${formatNumber(hundreds * 10)} εκατοντάδες`;
      const f2 = `${formatNumber(Math.floor(hundreds / 10))} εκατοντάδες`;
      const f3 = `${formatNumber(hundreds + 50)} εκατοντάδες`;

      const rawOptions = [correctStr, f1, f2, f3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΚΑΤΑΜΕΤΡΗΣΗ ΘΕΑΤΩΝ ΣΕ ΕΚΑΤΟΝΤΑΔΕΣ',
        inputInstruction: 'Υπολογίστε το πλήθος των εκατοντάδων (ακέραιος χωρίς τελείες):',
        mcqInstruction: 'Επιλέξτε πόσες ακέραιες εκατοντάδες θεατών παρακολούθησαν τον αγώνα:',
        text: `Σε έναν τελικό ποδοσφαίρου παρευρέθηκαν ${formatNumber(spectators)} θεατές. Πόσες ακέραιες εκατοντάδες θεατών αντιστοιχούν σε αυτόν τον αριθμό;`,
        tableData: { col1: 'Συνολικοί Θεατές', col2: 'Μονάδα Εκατοντάδων', r1: [`${formatNumber(spectators)}`, '1 Εκατοντάδα ＝ 100'], r2: ['Διαίρεση με 100', `${formatNumber(hundreds)}`] },
        correctVal: hundreds,
        correctStr: String(hundreds),
        options,
        correctText: correctStr,
        explanation: `Διαιρούμε με το 100: ${formatNumber(spectators)} : 100 ＝ ${formatNumber(hundreds)} εκατοντάδες θεατών.`
      };
    }
  }
];

// Διευρυμενη Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (για Q9 και Q10)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_fys_hard_1',
    generate: () => {
      const millions = randInt(4, 9);
      const thousands = randInt(120, 850);
      const units = randInt(150, 950);
      const fullNumber = millions * 1000000 + thousands * 1000 + units;
      const targetDigit = millions;
      const powerVal = targetDigit * 1000000;
      const valStr = formatNumber(powerVal);
      const f1 = formatNumber(targetDigit * 100000);
      const f2 = formatNumber(targetDigit * 10000000);
      const f3 = formatNumber(targetDigit * 10000);

      const rawOptions = [valStr, f1, f2, f3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === valStr
      }));

      return {
        title: 'ΑΞΙΑ ΘΕΣΗΣ ΣΕ ΑΡΧΑΙΟΛΟΓΙΚΟ ΕΥΡΗΜΑ',
        inputInstruction: 'Υπολογίστε την αριθμητική αξία του ψηφίου (ακέραιος χωρίς τελείες):',
        mcqInstruction: 'Επιλέξτε πόσες μονάδες αξίζει το ψηφίο των Εκατομμυρίων:',
        text: `Η ηλικία ενός αρχαιολογικού ευρήματος εκτιμήθηκε στα ${formatNumber(fullNumber)} έτη. Πόσες μονάδες αξίζει το ψηφίο των Εκατομμυρίων (${targetDigit}) μέσα σε αυτόν τον αριθμό;`,
        tableData: { col1: 'Αριθμός Ετών', col2: 'Τάξη Εκατομμυρίων', r1: [`${formatNumber(fullNumber)}`, `Ψηφίο: ${targetDigit}`], r2: ['Αξία Θέσης', `${valStr}`] },
        correctVal: powerVal,
        correctStr: String(powerVal),
        options,
        correctText: valStr,
        explanation: `Το ψηφίο ${targetDigit} βρίσκεται στην τάξη των Μονάδων Εκατομμυρίων, άρα η αξία του είναι ${targetDigit} · 1.000.000 ＝ ${valStr}.`
      };
    }
  },
  {
    id: 'p_fys_hard_2',
    generate: () => {
      const budget1 = randInt(15, 30) * 1000000;
      const budget2 = randInt(4, 9) * 100000;
      const budget3 = randInt(2, 8) * 10000;
      const totalBudget = budget1 + budget2 + budget3;
      const correctStr = `${formatNumber(totalBudget)} €`;
      const f1 = `${formatNumber(totalBudget + 1000000)} €`;
      const f2 = `${formatNumber(Math.max(10000, totalBudget - 500000))} €`;
      const f3 = `${formatNumber(totalBudget + 200000)} €`;

      const rawOptions = [correctStr, f1, f2, f3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΣΥΝΟΛΙΚΟΣ ΣΧΟΛΙΚΟΣ ΠΡΟΫΠΟΛΟΓΙΣΜΟΣ',
        inputInstruction: 'Υπολογίστε το συνολικό ποσό σε ευρώ (€):',
        mcqInstruction: 'Επιλέξτε το σωστό συνολικό ποσό σε ευρώ (€):',
        text: `Για τη συντήρηση των σχολείων εγκρίθηκαν: ${formatNumber(budget1)} € για κτηριακά, ${formatNumber(budget2)} € για ψηφιακό εξοπλισμό και ${formatNumber(budget3)} € για βιβλιοθήκες. Ποιο είναι το συνολικό ποσό σε ευρώ (€);`,
        tableData: { col1: 'Επιμέρους Κονδύλια', col2: 'Σύνολο Προϋπολογισμού', r1: [`${formatNumber(budget1)} € ＋ ${formatNumber(budget2)} €`, `＋ ${formatNumber(budget3)} €`], r2: ['Πρόσθεση', `${correctStr}`] },
        correctVal: totalBudget,
        correctStr: String(totalBudget),
        options,
        correctText: correctStr,
        explanation: `Προσθέτουμε τα επιμέρους ποσά: ${formatNumber(budget1)} ＋ ${formatNumber(budget2)} ＋ ${formatNumber(budget3)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_fys_hard_3',
    generate: () => {
      const dEarthMoon = 384400;
      const trips = randInt(2, 5);
      const totalKm = dEarthMoon * trips;
      const correctStr = `${formatNumber(totalKm)} km`;
      const f1 = `${formatNumber(totalKm + 100000)} km`;
      const f2 = `${formatNumber(totalKm - 100000)} km`;
      const f3 = `${formatNumber(totalKm + 50000)} km`;

      const rawOptions = [correctStr, f1, f2, f3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΔΙΑΣΤΗΜΙΚΗΣ ΑΠΟΣΤΑΣΗΣ',
        inputInstruction: 'Υπολογίστε τη συνολική απόσταση σε χιλιόμετρα (km):',
        mcqInstruction: 'Επιλέξτε τη συνολική απόσταση σε χιλιόμετρα (km):',
        text: `Η μέση απόσταση Γης - Σελήνης είναι περίπου ${formatNumber(dEarthMoon)} km. Πόσα χιλιόμετρα (km) θα διανύσει ένα διαστημόπλοιο που θα εκτελέσει ${trips} φορές αυτή τη διαδρομή;`,
        tableData: { col1: 'Μονή Διαδρομή', col2: 'Πλήθος Ταξιδιών', r1: [`${formatNumber(dEarthMoon)} km`, `${trips} ταξίδια`], r2: ['Γινόμενο', `${correctStr}`] },
        correctVal: totalKm,
        correctStr: String(totalKm),
        options,
        correctText: correctStr,
        explanation: `Πολλαπλασιάζουμε την απόσταση με τα ταξίδια: ${formatNumber(dEarthMoon)} · ${trips} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_fys_hard_4',
    generate: () => {
      const dep1 = randInt(10, 25) * 1000000;
      const dep2 = randInt(300, 750) * 1000;
      const totalDep = dep1 + dep2;
      const correctStr = `${formatNumber(totalDep)} €`;
      const f1 = `${formatNumber(totalDep + 500000)} €`;
      const f2 = `${formatNumber(Math.max(100000, totalDep - 1000000))} €`;
      const f3 = `${formatNumber(totalDep + 250000)} €`;

      const rawOptions = [correctStr, f1, f2, f3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΤΡΑΠΕΖΙΚΕΣ ΚΑΤΑΘΕΣΕΙΣ ΕΤΑΙΡΕΙΑΣ',
        inputInstruction: 'Υπολογίστε τις συνολικές καταθέσεις σε ευρώ (€):',
        mcqInstruction: 'Επιλέξτε το συνολικό ποσό καταθέσεων σε ευρώ (€):',
        text: `Μια επιχείρηση διατηρεί δύο εταιρικούς λογαριασμούς με καταθέσεις ${formatNumber(dep1)} € και ${formatNumber(dep2)} € αντίστοιχα. Ποιο είναι το συνολικό ποσό των καταθέσεων της επιχείρησης σε ευρώ (€);`,
        tableData: { col1: '1ος Λογαριασμός', col2: '2ος Λογαριασμός', r1: [`${formatNumber(dep1)} €`, `${formatNumber(dep2)} €`], r2: ['Άθροισμα', `${correctStr}`] },
        correctVal: totalDep,
        correctStr: String(totalDep),
        options,
        correctText: correctStr,
        explanation: `Προσθέτουμε τους δύο λογαριασμούς: ${formatNumber(dep1)} ＋ ${formatNumber(dep2)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_fys_hard_5',
    generate: () => {
      const highwayKm = randInt(12, 28) * 1000000;
      const bridgeKm = randInt(3, 8) * 100000;
      const totalCost = highwayKm + bridgeKm;
      const correctStr = `${formatNumber(totalCost)} €`;
      const f1 = `${formatNumber(totalCost + 2000000)} €`;
      const f2 = `${formatNumber(Math.max(100000, totalCost - 1000000))} €`;
      const f3 = `${formatNumber(totalCost + 500000)} €`;

      const rawOptions = [correctStr, f1, f2, f3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΕΠΕΝΔΥΣΕΙΣ ΟΔΙΚΩΝ ΥΠΟΔΟΜΩΝ',
        inputInstruction: 'Υπολογίστε το συνολικό κόστος των έργων σε ευρώ (€):',
        mcqInstruction: 'Επιλέξτε το συνολικό κόστος των έργων υποδομής σε ευρώ (€):',
        text: `Για την κατασκευή ενός αυτοκινητοδρόμου δαπανήθηκαν ${formatNumber(highwayKm)} € και για μια γέφυρα ${formatNumber(bridgeKm)} €. Πόσα ευρώ (€) δαπανήθηκαν συνολικά για τα δύο έργα;`,
        tableData: { col1: 'Αυτοκινητόδρομος', col2: 'Γέφυρα', r1: [`${formatNumber(highwayKm)} €`, `${formatNumber(bridgeKm)} €`], r2: ['Συνολική Δαπάνη', `${correctStr}`] },
        correctVal: totalCost,
        correctStr: String(totalCost),
        options,
        correctText: correctStr,
        explanation: `Προσθέτουμε τα κόστη των έργων: ${formatNumber(highwayKm)} ＋ ${formatNumber(bridgeKm)} ＝ ${correctStr}.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Αξία Θέσης Ψηφίου
  {
    const q1NumBase = generateUniqueDigitsNumber();
    const q1Digits = q1NumBase.toString().split('');
    const q1TargetPos = randInt(0, 3);
    const q1TargetDigit = Number(q1Digits[q1TargetPos]);
    const q1Power = q1Digits.length - 1 - q1TargetPos;
    const q1Answer = q1TargetDigit * Math.pow(10, q1Power);
    const q1PositionName = [
      'Εκατοντάδων Χιλιάδων',
      'Δεκάδων Χιλιάδων',
      'Μονάδων Χιλιάδων',
      'Εκατοντάδων'
    ][q1TargetPos];

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΑΞΙΑ ΘΕΣΗΣ ΨΗΦΙΟΥ',
      instruction: 'Βρείτε την πραγματική αριθμητική αξία του ψηφίου (ακέραιος χωρίς τελείες):',
      prompt: `Στον αριθμό ${formatNumber(q1NumBase)}, ποια είναι η πραγματική αξία του ψηφίου ${q1TargetDigit};`,
      correctVal: q1Answer,
      correctStr: String(q1Answer),
      explanation: `Το ψηφίο ${q1TargetDigit} βρίσκεται στη θέση των ${q1PositionName}, άρα η αξία του είναι ${q1TargetDigit} · ${formatNumber(Math.pow(10, q1Power))} ＝ ${formatNumber(q1Answer)}.`
    });
  }

  // Q2 (Input - Decimal): Σύνθεση αριθμού από αναπτυγμένη μορφή
  {
    const q2A = randInt(2, 8);
    const q2B = randInt(1, 9);
    const q2C = randInt(3, 9);
    const q2D = randInt(1, 9);
    const q2Answer = q2A * 1000000 + q2B * 100000 + q2C * 1000 + q2D;
    const q2Prompt = `${q2A} · 1.000.000 ＋ ${q2B} · 100.000 ＋ ${q2C} · 1.000 ＋ ${q2D} · 1`;

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΣΥΝΘΕΣΗ ΑΡΙΘΜΟΥ',
      instruction: 'Συνθέστε τον φυσικό αριθμό (ακέραιος χωρίς τελείες):',
      prompt: `Ποιος φυσικός αριθμός προκύπτει από την πράξη: ${q2Prompt};`,
      correctVal: q2Answer,
      correctStr: String(q2Answer),
      explanation: `Υπολογίζοντας το άθροισμα: ${formatNumber(q2A * 1000000)} ＋ ${formatNumber(q2B * 100000)} ＋ ${formatNumber(q2C * 1000)} ＋ ${q2D} ＝ ${formatNumber(q2Answer)}.`
    });
  }

  // Q3 (MCQ): Αναγνώριση Περιόδου (Εγγύηση Μοναδικότητας)
  {
    const q3MillionPart = randInt(12, 85);
    const q3ThousandPart = randInt(100, 999);
    const q3UnitsPart = randInt(100, 999);
    const q3FullNumber = q3MillionPart * 1000000 + q3ThousandPart * 1000 + q3UnitsPart;
    const q3CorrectOption = 'Περίοδος Εκατομμυρίων';

    const rawOptions = [
      'Περίοδος Εκατομμυρίων',
      'Περίοδος Χιλιάδων',
      'Περίοδος Μονάδων',
      'Περίοδος Δισεκατομμυρίων'
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q3CorrectOption
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΑΝΑΓΝΩΡΙΣΗ ΠΕΡΙΟΔΟΥ',
      instruction: 'Επιλέξτε τη σωστή περίοδο:',
      prompt: `Στον αριθμό ${formatNumber(q3FullNumber)}, σε ποια περίοδο ανήκουν τα πρώτα ψηφία (${formatNumber(q3MillionPart)});`,
      options,
      correctText: q3CorrectOption,
      explanation: `Τα ψηφία ${formatNumber(q3MillionPart)} βρίσκονται στην 3η τριάδα από τα δεξιά, η οποία είναι η Περίοδος των Εκατομμυρίων.`
    });
  }

  // Q4 (MCQ): Σύγκριση Μεγάλων Αριθμών (Εγγύηση Μοναδικότητας)
  {
    const q4Base = randInt(450, 750) * 10000;
    const v1 = q4Base + 45000;
    const v2 = q4Base + 12000;
    const v3 = q4Base + 9500;
    const v4 = q4Base - 8000;

    const correct = formatNumber(v1);
    const rawOptions = [formatNumber(v1), formatNumber(v2), formatNumber(v3), formatNumber(v4)];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === correct
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΣΥΓΚΡΙΣΗ ΜΕΓΑΛΩΝ ΑΡΙΘΜΩΝ',
      instruction: 'Επιλέξτε τον μεγαλύτερο αριθμό:',
      prompt: 'Ποιος από τους παρακάτω αριθμούς είναι ο μεγαλύτερος;',
      options,
      correctText: correct,
      explanation: `Συγκρίνοντας τα ψηφία από τα αριστερά προς τα δεξιά, ο μεγαλύτερος αριθμός είναι το ${correct}.`
    });
  }

  // Q5 (MCQ): Σωστό ή Λάθος - Δεκαδικό Σύστημα
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Σε έναν φυσικό αριθμό, κάθε θέση προς τα αριστερά έχει 10 φορές μεγαλύτερη αξία από τη θέση που βρίσκεται αμέσως δεξιά της.'
      : 'Σε έναν φυσικό αριθμό, κάθε θέση προς τα αριστερά έχει 10 φορές μικρότερη αξία από τη θέση που βρίσκεται αμέσως δεξιά της.';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΔΕΚΑΔΙΚΟ ΣΥΣΤΗΜΑ ΑΡΙΘΜΗΣΗΣ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Το σύστημα αρίθμησης είναι δεκαδικό και θεσιακό, άρα κάθε θέση αριστερά έχει 10 φορές μεγαλύτερη αξία.'
        : 'Η πρόταση είναι λάθος, διότι κάθε θέση προς τα αριστερά έχει 10 φορές ΜΕΓΑΛΥΤΕΡΗ (και όχι μικρότερη) αξία.'
    });
  }

  // Q6 (MCQ): Σωστό ή Λάθος - Ο Ρόλος του Μηδενός
  {
    const q6IsTrue = Math.random() > 0.5;
    const numEx = randInt(20, 80) * 1000;
    const q6Text = q6IsTrue
      ? `Τα μηδενικά στο τέλος του αριθμού ${formatNumber(numEx)} κρατούν τις τάξεις ώστε τα υπόλοιπα ψηφία να έχουν τη σωστή αξία.`
      : `Αν προσθέσουμε μηδενικά στην αρχή ενός ακεραίου αριθμού (π.χ. 00${formatNumber(numEx)}), η αξία του μεγαλώνει.`;
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • Ο ΡΟΛΟΣ ΤΟΥ ΜΗΔΕΝΟΣ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Τα μηδενικά στο τέλος ενός ακεραίου καθορίζουν την τάξη των προηγούμενων ψηφίων.'
        : 'Λάθος! Τα μηδενικά στην αρχή ενός ακεραίου αριθμού δεν έχουν καμία αξία και δεν μεταβάλλουν τον αριθμό.'
    });
  }

  // Q7 & Q8: Κανονικά Προβλήματα από τη δεξαμενή STANDARD_PROBLEMS_POOL (χωρίς επανάληψη)
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const stdProb1 = shuffledStd[0].generate();
    const stdProb2 = shuffledStd[1].generate();

    // Q7 (Input - Decimal) - Χωρίς πίνακα στην εκφώνηση
    qList.push({
      id: 7,
      type: 'decimal_input',
      title: `ΕΡΩΤΗΣΗ 7 • ${stdProb1.title}`,
      instruction: stdProb1.inputInstruction,
      prompt: stdProb1.text,
      tableData: stdProb1.tableData,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ) - Χωρίς πίνακα στην εκφώνηση
    qList.push({
      id: 8,
      type: 'mcq',
      title: `ΕΡΩΤΗΣΗ 8 • ${stdProb2.title}`,
      instruction: stdProb2.mcqInstruction,
      prompt: stdProb2.text,
      tableData: stdProb2.tableData,
      options: stdProb2.options,
      correctText: stdProb2.correctText,
      explanation: stdProb2.explanation
    });
  }

  // Q9 & Q10: Προβλήματα Αυξημένης Δυσκολίας από το HARD_PROBLEMS_POOL (χωρίς επανάληψη)
  {
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const hardProb1 = shuffledHard[0].generate();
    const hardProb2 = shuffledHard[1].generate();

    // Q9 (Input - Decimal) - Χωρίς πίνακα στην εκφώνηση
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: `ΕΡΩΤΗΣΗ 9 • ${hardProb1.title}`,
      instruction: hardProb1.inputInstruction,
      prompt: hardProb1.text,
      tableData: hardProb1.tableData,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας) - Πλήρως ευθυγραμμισμένη μονάδα μέτρησης και τίτλος
    qList.push({
      id: 10,
      type: 'mcq',
      title: `ΕΡΩΤΗΣΗ 10 • ${hardProb2.title}`,
      instruction: hardProb2.mcqInstruction,
      prompt: hardProb2.text,
      tableData: hardProb2.tableData,
      options: hardProb2.options,
      correctText: hardProb2.correctText,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function FysikoiArithmoiExercisesPage() {
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

  // Χειρισμος Input με καθαρισμο χαρακτηρων (μονο 0-9, μεγιστο 10 χαρακτηρες)
  const handleInputChange = (fieldKey, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/[^0-9]/g, '');
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
        const userValStr = (answers[`q_${q.id}`] || '').trim();
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
      title="Ασκήσεις: Φυσικοί Αριθμοί - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στους φυσικούς αριθμούς, την αξία θέσης ψηφίου, τις περιόδους και την αναπτυγμένη μορφή για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/01-fysikoi"
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
              Ασκήσεις &amp; Προβλήματα: Φυσικοί Αριθμοί
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με αξία θέσης ψηφίου, περιόδους, αναπτυγμένη μορφή δυνάμεων του 10 και 4 ρεαλιστικά προβλήματα. Συμπληρώστε τις απαντήσεις σας και ελέγξτε την επίδοσή σας.
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
                const uv = parseFloat((answers[`q_${q.id}`] || '').trim());
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
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-48 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500">
                        (Αριθμός χωρίς τελείες)
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

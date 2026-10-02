// pages/st-dimotikou/18-pollaplasia-ask.js
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

// Διευρυμενη δεξαμενη κανονικων προβληματων για την Ερωτηση 9 (MCQ)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_mult_std_1',
    generate: () => {
      const perPacket = 8;
      const packets = randInt(12, 25);
      const totalCandies = perPacket * packets;
      const correctStr = `Ναι (ακριβώς ${packets} πακέτα)`;
      return {
        title: 'ΣΥΣΚΕΥΑΣΙΑ ΚΑΡΑΜΕΛΩΝ ΣΕ ΠΑΚΕΤΑ',
        instruction: 'Επιλέξτε τη σωστή απάντηση:',
        text: `Ένας ζαχαροπλάστης φτιάχνει πακέτα που περιέχουν ${perPacket} καραμέλες το καθένα. Αν έχει συνολικά ${totalCandies} καραμέλες, μπορεί να τις συσκευάσει όλες ακριβώς χωρίς να του περισσέψει καμία;`,
        tableData: { col1: 'Σύνολο Καραμελών', col2: 'Ανά Πακέτο', r1: [`${totalCandies} καραμέλες`, `${perPacket} ανά πακέτο`], r2: ['Έλεγχος Πολλαπλασίου', `${totalCandies} : ${perPacket} ＝ ${packets} πακέτα ✅`] },
        optionsRaw: [
          correctStr,
          `Όχι, περισσεύουν ${randInt(1, 3)}`,
          `Όχι, λείπουν ${randInt(2, 4)}`,
          `Ναι (ακριβώς ${packets + 2} πακέτα)`
        ],
        correctText: correctStr,
        explanation: `Ο αριθμός ${totalCandies} είναι πολλαπλάσιο του ${perPacket} (${perPacket} · ${packets} ＝ ${totalCandies}), άρα σχηματίζονται ακριβώς ${packets} πακέτα.`
      };
    }
  },
  {
    id: 'p_mult_std_2',
    generate: () => {
      const step = 6;
      const hours = randInt(5, 10);
      const totalKm = step * hours;
      const correctStr = `${totalKm} km`;
      return {
        title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΑΠΟΣΤΑΣΗΣ ΔΡΟΜΕΑ',
        instruction: 'Επιλέξτε τη συνολική απόσταση:',
        text: `Ένας δρομέας τρέχει με σταθερό ρυθμό ${step} km την ώρα. Πόσα χιλιόμετρα (km) θα διανύσει συνολικά σε ${hours} ώρες συνεχούς τρεξίματος;`,
        tableData: { col1: 'Ταχύτητα', col2: 'Χρόνος', r1: [`${step} km/h`, `${hours} ώρες`], r2: ['Υπολογισμός', `${step} · ${hours} ＝ ${totalKm} km`] },
        optionsRaw: [
          correctStr,
          `${totalKm + step} km`,
          `${totalKm - step} km`,
          `${totalKm + 10} km`
        ],
        correctText: correctStr,
        explanation: `Το ${hours}ο πολλαπλάσιο του ${step} είναι: ${step} · ${hours} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_std_3',
    generate: () => {
      const perRow = 12;
      const rows = randInt(8, 15);
      const totalChairs = perRow * rows;
      const correctStr = `${totalChairs} καρέκλες`;
      return {
        title: 'ΤΟΠΟΘΕΤΗΣΗ ΚΑΘΙΣΜΑΤΩΝ ΣΕ ΣΕΙΡΕΣ',
        instruction: 'Επιλέξτε το συνολικό πλήθος των καθισμάτων:',
        text: `Μια αίθουσα εκδηλώσεων τοποθετεί καρέκλες σε σειρές των ${perRow}. Αν τοποθετηθούν ${rows} τέτοιες σειρές, πόσες καρέκλες θα χρησιμοποιηθούν συνολικά;`,
        tableData: { col1: 'Καρέκλες ανά Σειρά', col2: 'Σειρές', r1: [`${perRow} καρέκλες`, `${rows} σειρές`], r2: ['Πολλαπλάσιο', `${perRow} · ${rows} ＝ ${totalChairs}`] },
        optionsRaw: [
          correctStr,
          `${totalChairs + perRow} καρέκλες`,
          `${totalChairs - perRow} καρέκλες`,
          `${totalChairs + 6} καρέκλες`
        ],
        correctText: correctStr,
        explanation: `Πολλαπλασιάζουμε τις καρέκλες κάθε σειράς με τον αριθμό των σειρών: ${perRow} · ${rows} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_std_4',
    generate: () => {
      const perBox = 15;
      const boxes = randInt(6, 12);
      const totalJuices = perBox * boxes;
      const correctStr = `${totalJuices} χυμοί`;
      return {
        title: 'ΚΙΒΩΤΙΑ ΜΕ ΧΥΜΟΥΣ',
        instruction: 'Επιλέξτε το συνολικό πλήθος των χυμών:',
        text: `Ένα παντοπωλείο παρέλαβε ${boxes} κιβώτια που περιέχουν ${perBox} χυμούς το καθένα. Πόσους χυμούς παρέλαβε συνολικά;`,
        tableData: { col1: 'Κιβώτια', col2: 'Χυμοί ανά Κιβώτιο', r1: [`${boxes} κιβώτια`, `${perBox} χυμοί`], r2: ['Γινόμενο', `${boxes} · ${perBox} ＝ ${totalJuices}`] },
        optionsRaw: [
          correctStr,
          `${totalJuices + 15} χυμοί`,
          `${totalJuices - 15} χυμοί`,
          `${totalJuices + 30} χυμοί`
        ],
        correctText: correctStr,
        explanation: `Υπολογίζουμε: ${boxes} · ${perBox} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_std_5',
    generate: () => {
      const perTeam = 7;
      const teams = randInt(8, 14);
      const totalPlayers = perTeam * teams;
      const correctStr = `${totalPlayers} παίκτες`;
      return {
        title: 'ΟΜΑΔΕΣ ΧΑΝΤΜΠΟΛ',
        instruction: 'Επιλέξτε το συνολικό πλήθος παικτών:',
        text: `Σε ένα τουρνουά συμμετέχουν ${teams} ομάδες των ${perTeam} παικτών. Πόσοι παίκτες συμμετέχουν συνολικά στο τουρνουά;`,
        tableData: { col1: 'Ομάδες', col2: 'Παίκτες ανά Ομάδα', r1: [`${teams} ομάδες`, `${perTeam} παίκτες`], r2: ['Πολλαπλάσιο', `${teams} · ${perTeam} ＝ ${totalPlayers}`] },
        optionsRaw: [
          correctStr,
          `${totalPlayers + 7} παίκτες`,
          `${totalPlayers - 7} παίκτες`,
          `${totalPlayers + 14} παίκτες`
        ],
        correctText: correctStr,
        explanation: `Πολλαπλασιάζουμε: ${teams} · ${perTeam} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_std_6',
    generate: () => {
      const perShelf = 20;
      const shelves = randInt(7, 15);
      const totalBooks = perShelf * shelves;
      const correctStr = `${totalBooks} βιβλία`;
      return {
        title: 'ΤΟΠΟΘΕΤΗΣΗ ΒΙΒΛΙΩΝ ΣΕ ΡΑΦΙΑ',
        instruction: 'Επιλέξτε τον συνολικό αριθμό βιβλίων:',
        text: `Μια βιβλιοθήκη έχει ${shelves} ράφια και σε κάθε ράφι χωράνε ακριβώς ${perShelf} βιβλία. Πόσα βιβλία χωράνε συνολικά σε όλα τα ράφια;`,
        tableData: { col1: 'Ράφια', col2: 'Βιβλία ανά Ράφι', r1: [`${shelves} ράφια`, `${perShelf} βιβλία`], r2: ['Πολλαπλάσιο', `${shelves} · ${perShelf} ＝ ${totalBooks}`] },
        optionsRaw: [
          correctStr,
          `${totalBooks + 20} βιβλία`,
          `${totalBooks - 20} βιβλία`,
          `${totalBooks + 10} βιβλία`
        ],
        correctText: correctStr,
        explanation: `Υπολογίζουμε: ${shelves} · ${perShelf} ＝ ${correctStr}.`
      };
    }
  }
];

// Διευρυμενη δεξαμενη προβληματων για την Ερωτηση 10 (MCQ)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_mult_hard_1',
    generate: () => {
      const perRow = 15;
      const rows = randInt(12, 20);
      const totalTiles = perRow * rows;
      const correctStr = `${totalTiles} πλακάκια`;
      return {
        title: 'ΣΥΝΘΕΤΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΠΛΑΚΙΔΙΩΝ',
        instruction: 'Επιλέξτε το συνολικό πλήθος πλακιδίων:',
        text: `Ένας τεχνίτης τοποθετεί πλακάκια σε ${rows} σειρές με ${perRow} πλακάκια η καθεμία. Πόσα πλακάκια τοποθέτησε συνολικά;`,
        tableData: { col1: 'Σειρές', col2: 'Πλακάκια ανά Σειρά', r1: [`${rows} σειρές`, `${perRow} πλακάκια`], r2: ['Γινόμενο', `${rows} · ${perRow} ＝ ${totalTiles}`] },
        optionsRaw: [
          correctStr,
          `${totalTiles + 15} πλακάκια`,
          `${totalTiles - 15} πλακάκια`,
          `${totalTiles + 30} πλακάκια`
        ],
        correctText: correctStr,
        explanation: `Πολλαπλασιάζουμε: ${rows} · ${perRow} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_hard_2',
    generate: () => {
      const perDay = 25;
      const days = randInt(14, 28);
      const totalPages = perDay * days;
      const correctStr = `${totalPages} σελίδες`;
      return {
        title: 'ΡΥΘΜΟΣ ΑΝΑΓΝΩΣΗΣ ΒΙΒΛΙΟΥ',
        instruction: 'Επιλέξτε τον συνολικό αριθμό σελίδων:',
        text: `Ένας μαθητής διαβάζει ${perDay} σελίδες την ημέρα. Πόσες σελίδες θα διαβάσει συνολικά σε ${days} ημέρες;`,
        tableData: { col1: 'Σελίδες/Ημέρα', col2: 'Ημέρες', r1: [`${perDay} σελίδες`, `${days} ημέρες`], r2: ['Πολλαπλάσιο', `${days} · ${perDay} ＝ ${totalPages}`] },
        optionsRaw: [
          correctStr,
          `${totalPages + 25} σελίδες`,
          `${totalPages - 25} σελίδες`,
          `${totalPages + 50} σελίδες`
        ],
        correctText: correctStr,
        explanation: `Υπολογίζουμε: ${days} · ${perDay} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_hard_3',
    generate: () => {
      const panelsPerRow = 18;
      const rows = randInt(10, 16);
      const totalPanels = panelsPerRow * rows;
      const correctStr = `${totalPanels} πάνελ`;
      return {
        title: 'ΦΩΤΟΒΟΛΤΑΪΚΟ ΠΑΡΚΟ',
        instruction: 'Επιλέξτε το συνολικό πλήθος ηλιακών πάνελ:',
        text: `Σε ένα πάρκο τοποθετήθηκαν φωτοβολταϊκά πάνελ σε ${rows} σειρές των ${panelsPerRow} πάνελ. Πόσα πάνελ υπάρχουν συνολικά;`,
        tableData: { col1: 'Σειρές', col2: 'Πάνελ ανά Σειρά', r1: [`${rows} σειρές`, `${panelsPerRow} πάνελ`], r2: ['Γινόμενο', `${rows} · ${panelsPerRow} ＝ ${totalPanels}`] },
        optionsRaw: [
          correctStr,
          `${totalPanels + 18} πάνελ`,
          `${totalPanels - 18} πάνελ`,
          `${totalPanels + 36} πάνελ`
        ],
        correctText: correctStr,
        explanation: `Πολλαπλασιάζουμε: ${rows} · ${panelsPerRow} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_hard_4',
    generate: () => {
      const lapsPerDay = 30;
      const days = randInt(12, 24);
      const totalLaps = lapsPerDay * days;
      const correctStr = `${totalLaps} γύροι`;
      return {
        title: 'ΠΡΟΠΟΝΗΣΗ ΣΤΟ ΚΟΛΥΜΒΗΤΗΡΙΟ',
        instruction: 'Επιλέξτε το συνολικό πλήθος γύρων:',
        text: `Μια αθλήτρια κολυμπάει ${lapsPerDay} γύρους την ημέρα. Πόσους γύρους θα κάνει συνολικά σε ${days} ημέρες προπόνησης;`,
        tableData: { col1: 'Γύροι/Ημέρα', col2: 'Ημέρες', r1: [`${lapsPerDay} γύροι`, `${days} ημέρες`], r2: ['Πολλαπλάσιο', `${days} · ${lapsPerDay} ＝ ${totalLaps}`] },
        optionsRaw: [
          correctStr,
          `${totalLaps + 30} γύροι`,
          `${totalLaps - 30} γύροι`,
          `${totalLaps + 60} γύροι`
        ],
        correctText: correctStr,
        explanation: `Υπολογίζουμε: ${days} · ${lapsPerDay} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_hard_5',
    generate: () => {
      const treesPerRow = 24;
      const rows = randInt(8, 15);
      const totalTrees = treesPerRow * rows;
      const correctStr = `${totalTrees} δέντρα`;
      return {
        title: 'ΔΕΝΔΡΟΦΥΤΕΥΣΗ ΣΤΟ ΑΛΣΟΣ',
        instruction: 'Επιλέξτε το συνολικό πλήθος δέντρων:',
        text: `Σε ένα άλσος φυτεύτηκαν ${rows} σειρές με ${treesPerRow} δέντρα σε κάθε σειρά. Πόσα δέντρα φυτεύτηκαν συνολικά;`,
        tableData: { col1: 'Σειρές', col2: 'Δέντρα ανά Σειρά', r1: [`${rows} σειρές`, `${treesPerRow} δέντρα`], r2: ['Γινόμενο', `${rows} · ${treesPerRow} ＝ ${totalTrees}`] },
        optionsRaw: [
          correctStr,
          `${totalTrees + 24} δέντρα`,
          `${totalTrees - 24} δέντρα`,
          `${totalTrees + 48} δέντρα`
        ],
        correctText: correctStr,
        explanation: `Πολλαπλασιάζουμε: ${rows} · ${treesPerRow} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mult_hard_6',
    generate: () => {
      const perBox = 16;
      const boxes = randInt(12, 25);
      const totalMarkers = perBox * boxes;
      const correctStr = `${totalMarkers} μαρκαδόροι`;
      return {
        title: 'ΠΑΚΕΤΑΡΙΣΜΑ ΜΑΡΚΑΔΟΡΩΝ',
        instruction: 'Επιλέξτε το συνολικό πλήθος μαρκαδόρων:',
        text: `Ένα εργοστάσιο συσκεύασε ${boxes} κουτιά των ${perBox} μαρκαδόρων. Πόσοι μαρκαδόροι συσκευάστηκαν συνολικά;`,
        tableData: { col1: 'Κουτιά', col2: 'Μαρκαδόροι ανά Κουτί', r1: [`${boxes} κουτιά`, `${perBox} μαρκαδόροι`], r2: ['Πολλαπλάσιο', `${boxes} · ${perBox} ＝ ${totalMarkers}`] },
        optionsRaw: [
          correctStr,
          `${totalMarkers + 16} μαρκαδόροι`,
          `${totalMarkers - 16} μαρκαδόροι`,
          `${totalMarkers + 32} μαρκαδόροι`
        ],
        correctText: correctStr,
        explanation: `Υπολογίζουμε: ${boxes} · ${perBox} ＝ ${correctStr}.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (MCQ Yes/No): Έλεγχος αν ένας αριθμός είναι πολλαπλάσιο άλλου
  {
    const q1Base = [4, 6, 7, 8, 9, 12, 15][randInt(0, 6)];
    const q1IsMult = Math.random() > 0.5;
    const q1Multiplier = randInt(4, 12);
    const q1Num = q1IsMult ? q1Base * q1Multiplier : q1Base * q1Multiplier + randInt(1, q1Base - 1);
    const q1Correct = q1Num % q1Base === 0 ? 'Ναι' : 'Όχι';
    const rawOptions = ['Ναι', 'Όχι'];
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === q1Correct
    }));

    qList.push({
      id: 1,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 1 • ΕΛΕΓΧΟΣ ΠΟΛΛΑΠΛΑΣΙΟΥ',
      instruction: 'Επιλέξτε αν ο αριθμός είναι πολλαπλάσιο:',
      prompt: `Είναι ο αριθμός ${q1Num} πολλαπλάσιο του ${q1Base};`,
      options,
      correctText: q1Correct,
      explanation: q1Num % q1Base === 0
        ? `Σωστά! ${q1Num} : ${q1Base} ＝ ${q1Num / q1Base}, επομένως το ${q1Num} είναι πολλαπλάσιο του ${q1Base}.`
        : `Το ${q1Num} δεν διαιρείται ακριβώς με το ${q1Base} (${q1Num} : ${q1Base} ＝ ${Math.floor(q1Num / q1Base)} με υπόλοιπο ${q1Num % q1Base}), άρα ΔΕΝ είναι πολλαπλάσιο.`
    });
  }

  // Q2 (Input - Decimal): Εύρεση επόμενου πολλαπλασίου
  {
    const q2Base = [6, 7, 8, 9, 12, 15, 25][randInt(0, 6)];
    const q2K = randInt(3, 8);
    const q2Given = q2Base * q2K;
    const q2Next = q2Base * (q2K + 1);

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΕΠΟΜΕΝΟ ΠΟΛΛΑΠΛΑΣΙΟ',
      instruction: 'Συμπληρώστε το αμέσως επόμενο πολλαπλάσιο (ακέραιος):',
      prompt: `Ποιο είναι το αμέσως επόμενο πολλαπλάσιο του ${q2Base} μετά το ${q2Given};`,
      correctVal: q2Next,
      correctStr: String(q2Next),
      explanation: `Προσθέτουμε το ${q2Base} στο ${q2Given}: ${q2Given} ＋ ${q2Base} ＝ ${q2Next} (${q2Base} · ${q2K + 1}).`
    });
  }

  // Q3 (MCQ): Επιλογή πολλαπλασίου ανάμεσα σε μη πολλαπλάσια (Εγγύηση Μοναδικότητας)
  {
    const q3Base = [6, 7, 8, 9, 12, 15][randInt(0, 5)];
    const q3Valid = q3Base * randInt(5, 14);
    const q3Invalid1 = q3Valid + 2;
    const q3Invalid2 = q3Valid - 3;
    const q3Invalid3 = q3Valid + (q3Base === 6 ? 1 : 4);

    const rawOptions = [
      String(q3Valid),
      String(q3Invalid1),
      String(q3Invalid2),
      String(q3Invalid3)
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === String(q3Valid)
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΑΝΑΓΝΩΡΙΣΗ ΠΟΛΛΑΠΛΑΣΙΟΥ',
      instruction: 'Επιλέξτε ποιος αριθμός είναι πολλαπλάσιο:',
      prompt: `Ποιος από τους παρακάτω αριθμούς είναι πολλαπλάσιο του ${q3Base};`,
      options,
      correctText: String(q3Valid),
      explanation: `Ο αριθμός ${q3Valid} διαιρείται ακριβώς με το ${q3Base} (${q3Base} · ${q3Valid / q3Base} ＝ ${q3Valid}).`
    });
  }

  // Q4 (MCQ): Εύρεση κοινού πολλαπλασίου (Εγγύηση Μοναδικότητας)
  {
    const q4Pair = [
      { a: 3, b: 4, correct: 24, wrong: [15, 16, 20] },
      { a: 4, b: 6, correct: 36, wrong: [16, 20, 30] },
      { a: 5, b: 6, correct: 60, wrong: [25, 40, 50] },
      { a: 6, b: 8, correct: 48, wrong: [30, 40, 54] },
      { a: 4, b: 10, correct: 40, wrong: [25, 30, 50] }
    ][randInt(0, 4)];

    const rawOptions = [
      String(q4Pair.correct),
      ...q4Pair.wrong.map(String)
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === String(q4Pair.correct)
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΚΟΙΝΟ ΠΟΛΛΑΠΛΑΣΙΟ',
      instruction: 'Επιλέξτε το κοινό πολλαπλάσιο των δύο αριθμών:',
      prompt: `Ποιος από τους παρακάτω αριθμούς είναι κοινό πολλαπλάσιο του ${q4Pair.a} και του ${q4Pair.b};`,
      options,
      correctText: String(q4Pair.correct),
      explanation: `Το ${q4Pair.correct} διαιρείται ακριβώς και με το ${q4Pair.a} (${q4Pair.correct} : ${q4Pair.a} ＝ ${q4Pair.correct / q4Pair.a}) και με το ${q4Pair.b} (${q4Pair.correct} : ${q4Pair.b} ＝ ${q4Pair.correct / q4Pair.b}).`
    });
  }

  // Q5 (MCQ): True / False - Ιδιότητα του 0
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Το 0 είναι πολλαπλάσιο κάθε φυσικού αριθμού.'
      : 'Το 0 δεν είναι πολλαπλάσιο κανενός αριθμού.';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΙΔΙΟΤΗΤΑ ΤΟΥ 0',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Για κάθε αριθμό α ισχύει α · 0 ＝ 0, άρα το 0 είναι πολλαπλάσιο όλων των αριθμών.'
        : 'Λάθος! Το 0 είναι πολλαπλάσιο κάθε αριθμού αφού α · 0 ＝ 0.'
    });
  }

  // Q6 (MCQ): True / False - Πλήθος πολλαπλασίων
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Κάθε φυσικός αριθμός (εκτός από το 0) έχει άπειρα πολλαπλάσια.'
      : 'Κάθε φυσικός αριθμός έχει το πολύ 100 πολλαπλάσια.';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΠΛΗΘΟΣ ΠΟΛΛΑΠΛΑΣΙΩΝ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Επειδή οι φυσικοί αριθμοί είναι άπειροι, τα πολλαπλάσια ενός αριθμού δεν τελειώνουν ποτέ.'
        : 'Λάθος! Τα πολλαπλάσια κάθε φυσικού αριθμού (εκτός του 0) είναι άπειρα.'
    });
  }

  // Q7 (Input - Decimal): Υπολογισμός πολλαπλασίου
  {
    const q7Base = [12, 15, 20, 25, 30, 50][randInt(0, 5)];
    const q7MultIndex = randInt(4, 9);
    const q7Ans = q7Base * q7MultIndex;

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΥΠΟΛΟΓΙΣΜΟΣ ΠΟΛΛΑΠΛΑΣΙΟΥ',
      instruction: 'Υπολογίστε το γινόμενο (ακέραιος):',
      prompt: `Πόσο κάνει το ${q7MultIndex}ο πολλαπλάσιο του αριθμού ${q7Base} (${q7Base} · ${q7MultIndex});`,
      correctVal: q7Ans,
      correctStr: String(q7Ans),
      explanation: `${q7Base} · ${q7MultIndex} ＝ ${q7Ans}.`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας (Ρυθμός / Κουτιά)
  {
    const q8Items = [
      { name: 'τετράδια', box: 6, count: 48, correct: 'Ναι (ακριβώς 8 κουτιά)', wrong: ['Όχι, περισσεύουν 2', 'Όχι, λείπουν 3', 'Ναι (ακριβώς 9 κουτιά)'] },
      { name: 'στυλό', box: 8, count: 56, correct: 'Ναι (ακριβώς 7 κουτιά)', wrong: ['Όχι, περισσεύει 1', 'Όχι, λείπουν 2', 'Ναι (ακριβώς 8 κουτιά)'] },
      { name: 'μαρκαδόρους', box: 12, count: 72, correct: 'Ναι (ακριβώς 6 κουτιά)', wrong: ['Όχι, περισσεύουν 4', 'Όχι, λείπουν 2', 'Ναι (ακριβώς 7 κουτιά)'] },
      { name: 'σοκολάτες', box: 15, count: 90, correct: 'Ναι (ακριβώς 6 κουτιά)', wrong: ['Όχι, περισσεύουν 5', 'Όχι, λείπουν 5', 'Ναι (ακριβώς 7 κουτιά)'] }
    ];
    const q8Chosen = q8Items[randInt(0, q8Items.length - 1)];
    const rawOptions = [q8Chosen.correct, ...q8Chosen.wrong];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8Chosen.correct
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: 'Επιλέξτε τη σωστή απάντηση για τη συσκευασία:',
      prompt: `Ένα βιβλιοπωλείο έχει ${q8Chosen.count} ${q8Chosen.name} και θέλει να τα βάλει σε κουτιά των ${q8Chosen.box}. Μπορούν να συσκευαστούν χωρίς να περισσέψει κανένα;`,
      options,
      correctText: q8Chosen.correct,
      explanation: `Επειδή ${q8Chosen.count} : ${q8Chosen.box} ＝ ${q8Chosen.count / q8Chosen.box}, χωράνε σε ακριβώς ${q8Chosen.count / q8Chosen.box} κουτιά!`
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές (1 Input, 1 MCQ)
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate();
    const hardProb = shuffledHard[0].generate();

    // Q9 (MCQ) - Χωρίς πίνακα στην εκφώνηση
    const optionsQ9 = shuffle([...new Set(stdProb.optionsRaw)]).map((text) => ({
      text,
      isCorrect: text === stdProb.correctText
    }));

    qList.push({
      id: 9,
      type: 'mcq',
      title: `ΕΡΩΤΗΣΗ 9 • ${stdProb.title}`,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      options: optionsQ9,
      correctText: stdProb.correctText,
      explanation: stdProb.explanation
    });

    // Q10 (MCQ) - Χωρίς πίνακα στην εκφώνηση
    const optionsQ10 = shuffle([...new Set(hardProb.optionsRaw)]).map((text) => ({
      text,
      isCorrect: text === hardProb.correctText
    }));

    qList.push({
      id: 10,
      type: 'mcq',
      title: `ΕΡΩΤΗΣΗ 10 • ${hardProb.title}`,
      instruction: hardProb.instruction,
      prompt: hardProb.text,
      tableData: hardProb.tableData,
      options: optionsQ10,
      correctText: hardProb.correctText,
      explanation: hardProb.explanation
    });
  }

  return qList;
}

export default function PollaplasiaExercisesPage() {
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
  const handleInputChange = (qId, rawValue) => {
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
      [`q_${qId}`]: sanitized
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
  const handleCheckAnswers = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitted) return;

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
      title="Ασκήσεις: Πολλαπλάσια Αριθμού - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στα πολλαπλάσια φυσικών αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/18-pollaplasia"
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
              Ασκήσεις &amp; Προβλήματα: Πολλαπλάσια Αριθμού
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες υπολογισμού πολλαπλασίων, κοινών πολλαπλασίων, ιδιοτήτων και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
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
          {questions.map((q) => {
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
                key={`q-${q.id}`}
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

                {/* Εκφωνηση (Καθαρο κειμενο χωρις πινακες που προδιδουν τη λυση) */}
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
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500">
                        (Ακέραιος αριθμός)
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

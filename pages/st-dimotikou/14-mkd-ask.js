// pages/st-dimotikou/14-mkd-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Τυχαίος ακέραιος στο [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ανακάτεμα πίνακα
function shuffle(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Μορφοποίηση αριθμού με τελείες χιλιάδων
function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return Number(num).toLocaleString('el-GR');
}

// Εύρεση όλων των διαιρετών
function getDivisors(num) {
  const divs = [];
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) divs.push(i);
  }
  return divs;
}

// Υπολογισμός Μ.Κ.Δ. με τον αλγόριθμο του Ευκλείδη
function getGCD(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

// Δεξαμενή θεματικών σεναρίων καθημερινότητας
const REAL_WORLD_PRESETS = [
  {
    profession: 'Ένας μανάβης',
    item1: 'μήλα',
    item2: 'πορτοκάλια',
    groupName: 'καλάθια',
    questionText: 'Πόσα πανομοιότυπα καλάθια μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα φρούτο;'
  },
  {
    profession: 'Ένας βιβλιοπώλης',
    item1: 'τετράδια',
    item2: 'μολύβια',
    groupName: 'σετ δώρων',
    questionText: 'Πόσα πανομοιότυπα σετ δώρων μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα είδος;'
  },
  {
    profession: 'Ένας ανθοπώλης',
    item1: 'τριαντάφυλλα',
    item2: 'μαργαρίτες',
    groupName: 'ανθοδέσμες',
    questionText: 'Πόσες πανομοιότυπες ανθοδέσμες μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα λουλούδι;'
  },
  {
    profession: 'Ένας προπονητής',
    item1: 'μπάλες ποδοσφαίρου',
    item2: 'μπάλες μπάσκετ',
    groupName: 'σάκους',
    questionText: 'Πόσους πανομοιότυπους σάκους μπορεί να φτιάξει το πολύ χωρίς να περισσέψει καμία μπάλα;'
  },
  {
    profession: 'Ένας παντοπώλης',
    item1: 'σοκολατάκια',
    item2: 'καραμέλες',
    groupName: 'πακέτα',
    questionText: 'Πόσα πανομοιότυπα πακέτα μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα γλύκισμα;'
  }
];

// Διευρυμένη δεξαμενή προβλημάτων για την Ερώτηση 9 (Input)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_mkd_std_1',
    generate: () => {
      const redRibbon = 36;
      const blueRibbon = 48;
      const maxCut = getGCD(redRibbon, blueRibbon);
      return {
        title: 'ΜΕΓΙΣΤΟ ΚΟΙΝΟ ΜΗΚΟΣ ΚΟΡΔΕΛΑΣ',
        instruction: 'Υπολογίστε το μέγιστο μήκος σε εκατοστά (εκ.):',
        text: `Μια μοδίστρα έχει δύο κορδέλες μήκους ${redRibbon} εκ. και ${blueRibbon} εκ. Θέλει να τις κόψει σε ίσα κομμάτια με το μεγαλύτερο δυνατό μήκος χωρίς να περισσέψει καθόλου ύφασμα. Ποιο είναι το μέγιστο μήκος (σε εκ.) κάθε κομματιού;`,
        tableData: { col1: 'Μήκη Κορδελών', col2: 'Μέγιστο Ίσο Μήκος', r1: [`${redRibbon} εκ. & ${blueRibbon} εκ.`, 'Μ.Κ.Δ.(36, 48)'], r2: ['Υπολογισμός', `${maxCut} εκ.`] },
        correctVal: maxCut,
        correctStr: String(maxCut),
        explanation: `Αναζητούμε το μέγιστο κοινό μέγεθος, δηλαδή τον Μ.Κ.Δ. των 36 και 48: Μ.Κ.Δ.(36, 48) ＝ ${maxCut} εκ.`
      };
    }
  },
  {
    id: 'p_mkd_std_2',
    generate: () => {
      const cheesePies = 40;
      const spinachPies = 60;
      const maxBoxes = getGCD(cheesePies, spinachPies);
      return {
        title: 'ΣΥΣΚΕΥΑΣΙΑ ΠΙΤΩΝ ΣΕ ΚΟΥΤΙΑ',
        instruction: 'Υπολογίστε το μέγιστο πλήθος συσκευασιών:',
        text: `Ένα κυλικείο έψησε ${cheesePies} τυροπιτάκια και ${spinachPies} σπανακοπιτάκια. Θέλει να τα μοιράσει σε πανομοιότυπες συσκευασίες χωρίς να περισσέψει κανένα. Πόσες τέτοιες συσκευασίες μπορεί να ετοιμάσει το πολύ;`,
        tableData: { col1: 'Προϊόντα', col2: 'Μέγιστες Συσκευασίες', r1: [`${cheesePies} τυρ. & ${spinachPies} σπαν.`, 'Μ.Κ.Δ.(40, 60)'], r2: ['Υπολογισμός', `${maxBoxes} συσκευασίες`] },
        correctVal: maxBoxes,
        correctStr: String(maxBoxes),
        explanation: `Ο μέγιστος αριθμός πανομοιότυπων συσκευασιών αντιστοιχεί στον Μ.Κ.Δ.(40, 60) ＝ ${maxBoxes} συσκευασίες.`
      };
    }
  },
  {
    id: 'p_mkd_std_3',
    generate: () => {
      const notebooks = 45;
      const pens = 75;
      const maxPacks = getGCD(notebooks, pens);
      return {
        title: 'ΠΑΚΕΤΑ ΓΡΑΦΙΚΗΣ ΥΛΗΣ',
        instruction: 'Υπολογίστε τον μέγιστο αριθμό πακέτων:',
        text: `Ένα βιβλιοπωλείο διαθέτει ${notebooks} τετράδια και ${pens} στυλό. Θέλει να φτιάξει όμοια πακέτα γραφικής ύλης για μαθητές. Πόσα τέτοια πακέτα μπορεί να δημιουργήσει το μέγιστο;`,
        tableData: { col1: 'Υλικά', col2: 'Μέγιστα Πακέτα', r1: [`${notebooks} τετράδια & ${pens} στυλό`, 'Μ.Κ.Δ.(45, 75)'], r2: ['Υπολογισμός', `${maxPacks} πακέτα`] },
        correctVal: maxPacks,
        correctStr: String(maxPacks),
        explanation: `Ο μέγιστος αριθμός πακέτων ισούται με τον Μ.Κ.Δ. των 45 και 75: Μ.Κ.Δ.(45, 75) ＝ ${maxPacks} πακέτα.`
      };
    }
  },
  {
    id: 'p_mkd_std_4',
    generate: () => {
      const roses = 32;
      const lilies = 48;
      const maxBouquets = getGCD(roses, lilies);
      return {
        title: 'ΠΑΝΟΜΟΙΟΤΥΠΕΣ ΑΝΘΟΔΕΣΜΕΣ',
        instruction: 'Υπολογίστε το μέγιστο πλήθος ανθοδεσμών:',
        text: `Ένα ανθοπωλείο έχει ${roses} τριαντάφυλλα και ${lilies} κρίνα. Θέλει να φτιάξει πανομοιότυπες ανθοδέσμες χρησιμοποιώντας όλα τα λουλούδια. Πόσες ανθοδέσμες μπορεί να φτιάξει το πολύ;`,
        tableData: { col1: 'Λουλούδια', col2: 'Μέγιστες Ανθοδέσμες', r1: [`${roses} τριαντάφυλλα & ${lilies} κρίνα`, 'Μ.Κ.Δ.(32, 48)'], r2: ['Υπολογισμός', `${maxBouquets} ανθοδέσμες`] },
        correctVal: maxBouquets,
        correctStr: String(maxBouquets),
        explanation: `Βρίσκουμε τον Μ.Κ.Δ. των 32 και 48: Μ.Κ.Δ.(32, 48) ＝ ${maxBouquets} ανθοδέσμες.`
      };
    }
  },
  {
    id: 'p_mkd_std_5',
    generate: () => {
      const ropeA = 42;
      const ropeB = 56;
      const maxPiece = getGCD(ropeA, ropeB);
      return {
        title: 'ΚΟΠΗ ΣΧΟΙΝΙΩΝ ΣΕ ΙΣΑ ΚΟΜΜΑΤΙΑ',
        instruction: 'Υπολογίστε το μέγιστο μήκος κομματιού σε μέτρα (m):',
        text: `Σε μια αποθήκη υπάρχουν δύο σχοινιά μήκους ${ropeA} m και ${ropeB} m. Θέλουμε να τα κόψουμε σε ίσα κομμάτια με το μεγαλύτερο δυνατό μήκος. Πόσα μέτρα (m) θα είναι κάθε κομμάτι;`,
        tableData: { col1: 'Μήκη Σχοινιών', col2: 'Μέγιστο Κοινό Μήκος', r1: [`${ropeA} m & ${ropeB} m`, 'Μ.Κ.Δ.(42, 56)'], r2: ['Υπολογισμός', `${maxPiece} m`] },
        correctVal: maxPiece,
        correctStr: String(maxPiece),
        explanation: `Υπολογίζουμε τον Μ.Κ.Δ.(42, 56) ＝ ${maxPiece} m.`
      };
    }
  },
  {
    id: 'p_mkd_std_6',
    generate: () => {
      const apples = 54;
      const oranges = 72;
      const maxBaskets = getGCD(apples, oranges);
      return {
        title: 'ΚΑΛΑΘΙΑ ΜΕ ΦΡΟΥΤΑ',
        instruction: 'Υπολογίστε το μέγιστο πλήθος καλαθιών:',
        text: `Ένας παραγωγός έχει ${apples} μήλα και ${oranges} πορτοκάλια. Θέλει να ετοιμάσει πανομοιότυπα καλάθια φρούτων χωρίς να περισσέψει κανένα φρούτο. Πόσα καλάθια μπορεί να ετοιμάσει το πολύ;`,
        tableData: { col1: 'Φρούτα', col2: 'Μέγιστα Καλάθια', r1: [`${apples} μήλα & ${oranges} πορτοκάλια`, 'Μ.Κ.Δ.(54, 72)'], r2: ['Υπολογισμός', `${maxBaskets} καλάθια`] },
        correctVal: maxBaskets,
        correctStr: String(maxBaskets),
        explanation: `Ο μέγιστος αριθμός καλαθιών είναι ο Μ.Κ.Δ.(54, 72) ＝ ${maxBaskets} καλάθια.`
      };
    }
  }
];

// Διευρυμένη δεξαμενή προβλημάτων για την Ερώτηση 10 (MCQ)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_mkd_hard_1',
    generate: () => {
      const redRibbon = 36;
      const blueRibbon = 48;
      const maxCut = getGCD(redRibbon, blueRibbon);
      const correctStr = `${maxCut} εκ.`;
      const fake1 = `${maxCut + 4} εκ.`;
      const fake2 = `${Math.max(2, maxCut - 4)} εκ.`;
      const fake3 = `${maxCut * 2} εκ.`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΜΕΓΙΣΤΟ ΚΟΙΝΟ ΜΗΚΟΣ ΚΟΡΔΕΛΑΣ',
        instruction: 'Επιλέξτε το μέγιστο μήκος κάθε κομματιού σε εκατοστά (εκ.):',
        text: `Μια μοδίστρα έχει δύο κορδέλες μήκους ${redRibbon} εκ. και ${blueRibbon} εκ. Θέλει να τις κόψει σε ίσα κομμάτια με το μεγαλύτερο δυνατό μήκος χωρίς να περισσέψει καθόλου ύφασμα. Ποιο είναι το μέγιστο μήκος (σε εκ.) κάθε κομματιού;`,
        tableData: { col1: 'Μήκη Κορδελών', col2: 'Μέγιστο Ίσο Μήκος', r1: [`${redRibbon} εκ. & ${blueRibbon} εκ.`, 'Μ.Κ.Δ.(36, 48)'], r2: ['Υπολογισμός', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Αναζητούμε το μέγιστο κοινό μέγεθος, δηλαδή τον Μ.Κ.Δ. των 36 και 48: Μ.Κ.Δ.(36, 48) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mkd_hard_2',
    generate: () => {
      const cheesePies = 40;
      const spinachPies = 60;
      const maxBoxes = getGCD(cheesePies, spinachPies);
      const correctStr = `${maxBoxes} συσκευασίες`;
      const fake1 = `${maxBoxes + 5} συσκευασίες`;
      const fake2 = `${Math.max(5, maxBoxes - 5)} συσκευασίες`;
      const fake3 = `${maxBoxes * 2} συσκευασίες`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΠΑΝΟΜΟΙΟΤΥΠΕΣ ΣΥΣΚΕΥΑΣΙΕΣ',
        instruction: 'Επιλέξτε τον μέγιστο αριθμό συσκευασιών:',
        text: `Ένα κυλικείο έψησε ${cheesePies} τυροπιτάκια και ${spinachPies} σπανακοπιτάκια. Θέλει να τα μοιράσει σε πανομοιότυπες συσκευασίες χωρίς να περισσέψει κανένα. Πόσες τέτοιες συσκευασίες μπορεί να ετοιμάσει το πολύ;`,
        tableData: { col1: 'Προϊόντα', col2: 'Μέγιστες Συσκευασίες', r1: [`${cheesePies} τυρ. & ${spinachPies} σπαν.`, 'Μ.Κ.Δ.(40, 60)'], r2: ['Υπολογισμός', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Ο μέγιστος αριθμός πανομοιότυπων συσκευασιών αντιστοιχεί στον Μ.Κ.Δ.(40, 60) ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mkd_hard_3',
    generate: () => {
      const candies = 72;
      const bagsPossible = [6, 8, 9, 12];
      const bag = bagsPossible[randInt(0, bagsPossible.length - 1)];
      const perBag = candies / bag;
      const correctStr = `${perBag} καραμέλες`;
      const fake1 = `${perBag + 3} καραμέλες`;
      const fake2 = `${Math.max(1, perBag - 2)} καραμέλες`;
      const fake3 = `${perBag + 5} καραμέλες`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΚΑΤΑΝΟΜΗ ΚΑΡΑΜΕΛΩΝ ΣΕ ΣΑΚΟΥΛΑΚΙΑ',
        instruction: 'Επιλέξτε πόσες καραμέλες θα περιέχει κάθε σακουλάκι:',
        text: `Ένας ζαχαροπλάστης έχει ${candies} καραμέλες και θέλει να φτιάξει ${bag} ίδια σακουλάκια. Πόσες καραμέλες πρέπει να βάλει σε κάθε σακουλάκι για να μη μείνει καμία;`,
        tableData: { col1: 'Σύνολο Καραμελών', col2: 'Σακουλάκια', r1: [`${candies} καραμέλες`, `${bag} σακουλάκια`], r2: ['Διαίρεση', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Το ${bag} είναι διαιρέτης του ${candies}: ${candies} : ${bag} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mkd_hard_4',
    generate: () => {
      const books = 84;
      const shelvesPossible = [4, 6, 7, 12];
      const shelf = shelvesPossible[randInt(0, shelvesPossible.length - 1)];
      const perShelf = books / shelf;
      const correctStr = `${perShelf} βιβλία`;
      const fake1 = `${perShelf + 2} βιβλία`;
      const fake2 = `${Math.max(1, perShelf - 3)} βιβλία`;
      const fake3 = `${perShelf + 5} βιβλία`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΚΑΤΑΝΟΜΗ ΒΙΒΛΙΩΝ ΣΕ ΡΑΦΙΑ',
        instruction: 'Επιλέξτε πόσα βιβλία θα έχει κάθε ράφι:',
        text: `Σε μια βιβλιοθήκη υπάρχουν ${books} βιβλία και θέλουμε να τα τοποθετήσουμε ισόποσα σε ${shelf} ράφια. Πόσα βιβλία θα έχει κάθε ράφι χωρίς να περισσέψει κανένα;`,
        tableData: { col1: 'Σύνολο Βιβλίων', col2: 'Ράφια', r1: [`${books} βιβλία`, `${shelf} ράφια`], r2: ['Διαίρεση', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Το ${shelf} διαιρεί ακριβώς το ${books}: ${books} : ${shelf} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mkd_hard_5',
    generate: () => {
      const sweets = 96;
      const boxesPossible = [6, 8, 12, 16];
      const box = boxesPossible[randInt(0, boxesPossible.length - 1)];
      const perBox = sweets / box;
      const correctStr = `${perBox} σοκολατάκια`;
      const fake1 = `${perBox + 2} σοκολατάκια`;
      const fake2 = `${Math.max(1, perBox - 2)} σοκολατάκια`;
      const fake3 = `${perBox + 4} σοκολατάκια`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΣΥΣΚΕΥΑΣΙΑ ΣΟΚΟΛΑΤΑΣ ΣΕ ΚΟΥΤΙΑ',
        instruction: 'Επιλέξτε πόσα σοκολατάκια περιέχει κάθε κουτί:',
        text: `Σε ένα εργαστήριο ζαχαροπλαστικής υπάρχουν ${sweets} σοκολατάκια που μοιράζονται ισόποσα σε ${box} κουτιά. Πόσα σοκολατάκια περιέχει κάθε κουτί;`,
        tableData: { col1: 'Σύνολο', col2: 'Κουτιά', r1: [`${sweets} σοκολατάκια`, `${box} κουτιά`], r2: ['Διαίρεση', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Το ${box} είναι διαιρέτης του ${sweets}: ${sweets} : ${box} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mkd_hard_6',
    generate: () => {
      const apples = 54;
      const oranges = 72;
      const maxBaskets = getGCD(apples, oranges);
      const correctStr = `${maxBaskets} καλάθια`;
      const fake1 = `${maxBaskets + 6} καλάθια`;
      const fake2 = `${Math.max(6, maxBaskets - 6)} καλάθια`;
      const fake3 = `${maxBaskets * 2} καλάθια`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΣΥΝΘΕΣΗ ΚΑΛΑΘΙΩΝ ΦΡΟΥΤΩΝ',
        instruction: 'Επιλέξτε το μέγιστο πλήθος καλαθιών:',
        text: `Ένας παραγωγός έχει ${apples} μήλα και ${oranges} πορτοκάλια. Θέλει να ετοιμάσει πανομοιότυπα καλάθια φρούτων χωρίς να περισσέψει κανένα φρούτο. Πόσα καλάθια μπορεί να ετοιμάσει το πολύ;`,
        tableData: { col1: 'Φρούτα', col2: 'Μέγιστα Καλάθια', r1: [`${apples} μήλα & ${oranges} πορτοκάλια`, 'Μ.Κ.Δ.(54, 72)'], r2: ['Υπολογισμός', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Ο μέγιστος αριθμός καλαθιών είναι ο Μ.Κ.Δ.(54, 72) ＝ ${correctStr}.`
      };
    }
  }
];

// Δημιουργία των 10 δυναμικών ερωτήσεων
function generateQuestions() {
  const qList = [];
  const shuffledPresets = shuffle(REAL_WORLD_PRESETS);

  // Q1 (Input): Μ.Κ.Δ. 2 αριθμών
  {
    const q1Pool = [
      [12, 18], [15, 20], [24, 36], [20, 30], [16, 24], [18, 27], [30, 45]
    ];
    const [q1A, q1B] = q1Pool[randInt(0, q1Pool.length - 1)];
    const q1GCD = getGCD(q1A, q1B);

    qList.push({
      id: 1,
      type: 'integer_input',
      title: 'ΕΡΩΤΗΣΗ 1 • Μ.Κ.Δ. ΔΥΟ ΑΡΙΘΜΩΝ',
      instruction: 'Υπολογίστε τον Μέγιστο Κοινό Διαιρέτη (ακέραιος):',
      prompt: `Υπολογίστε: Μ.Κ.Δ.(${q1A}, ${q1B})`,
      correctVal: q1GCD,
      correctStr: String(q1GCD),
      explanation: `Οι κοινοί διαιρέτες των ${q1A} και ${q1B} έχουν μεγαλύτερο το ${q1GCD}. Άρα: Μ.Κ.Δ.(${q1A}, ${q1B}) ＝ ${q1GCD}.`
    });
  }

  // Q2 (Input): Μ.Κ.Δ. 3 αριθμών
  {
    const q2Pool = [
      [12, 18, 24], [16, 24, 32], [20, 30, 40], [15, 30, 45], [12, 16, 20]
    ];
    const [q2A, q2B, q2C] = q2Pool[randInt(0, q2Pool.length - 1)];
    const q2GCD = getGCD(getGCD(q2A, q2B), q2C);

    qList.push({
      id: 2,
      type: 'integer_input',
      title: 'ΕΡΩΤΗΣΗ 2 • Μ.Κ.Δ. ΤΡΙΩΝ ΑΡΙΘΜΩΝ',
      instruction: 'Υπολογίστε τον Μέγιστο Κοινό Διαιρέτη (ακέραιος):',
      prompt: `Υπολογίστε: Μ.Κ.Δ.(${q2A}, ${q2B}, ${q2C})`,
      correctVal: q2GCD,
      correctStr: String(q2GCD),
      explanation: `Ο μεγαλύτερος κοινός διαιρέτης των ${q2A}, ${q2B} και ${q2C} είναι το ${q2GCD}.`
    });
  }

  // Q3 (MCQ): Σύνολο Κοινών Διαιρετών
  {
    const q3Pool = [
      [12, 18], [20, 30], [24, 36], [16, 24]
    ];
    const [q3A, q3B] = q3Pool[randInt(0, q3Pool.length - 1)];
    const q3DivsA = getDivisors(q3A);
    const q3DivsB = getDivisors(q3B);
    const q3Common = q3DivsA.filter((d) => q3DivsB.includes(d));
    const q3CorrectStr = `{ ${q3Common.join(', ')} }`;

    const q3Wrong1 = `{ ${q3Common.filter((_, i) => i !== 1).join(', ')} }`;
    const q3Wrong2 = `{ ${[...q3Common, q3Common[q3Common.length - 1] * 2].sort((a, b) => a - b).join(', ')} }`;
    const q3Wrong3 = `{ ${q3Common.map((d) => (d === 2 ? 5 : d)).sort((a, b) => a - b).join(', ')} }`;

    const rawOptions = [q3CorrectStr, q3Wrong1, q3Wrong2, q3Wrong3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q3CorrectStr
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΣΥΝΟΛΟ ΚΟΙΝΩΝ ΔΙΑΙΡΕΤΩΝ',
      instruction: 'Επιλέξτε το σύνολο των κοινών διαιρετών:',
      prompt: `Ποιο είναι το σύνολο των κοινών διαιρετών των αριθμών ${q3A} και ${q3B};`,
      options,
      correctText: q3CorrectStr,
      explanation: `Οι διαιρέτες του ${q3A} και του ${q3B} που συμπίπτουν είναι: ${q3CorrectStr}.`
    });
  }

  // Q4 (MCQ): Πρώτοι μεταξύ τους αριθμοί (Μ.Κ.Δ. = 1)
  {
    const q4CoprimePairs = [
      [8, 9], [9, 14], [15, 16], [8, 15], [21, 22], [14, 25]
    ];
    const q4NonCoprimePairs = [
      [12, 18], [14, 21], [15, 20], [16, 24], [20, 35], [18, 27]
    ];
    const q4ChosenCoprime = q4CoprimePairs[randInt(0, q4CoprimePairs.length - 1)];
    const q4ChosenNonCoprimes = shuffle(q4NonCoprimePairs).slice(0, 3);
    const q4CorrectStr = `${q4ChosenCoprime[0]} και ${q4ChosenCoprime[1]}`;

    const rawOptions = [
      q4CorrectStr,
      ...q4ChosenNonCoprimes.map((p) => `${p[0]} και ${p[1]}`)
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q4CorrectStr
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ',
      instruction: 'Επιλέξτε το ζεύγος των πρώτων μεταξύ τους αριθμών:',
      prompt: 'Ποιο από τα παρακάτω ζεύγη αποτελείται από αριθμούς που είναι πρώτοι μεταξύ τους;',
      options,
      correctText: q4CorrectStr,
      explanation: `Οι αριθμοί ${q4CorrectStr} έχουν μοναδικό κοινό διαιρέτη το 1 (Μ.Κ.Δ. ＝ 1), άρα είναι πρώτοι μεταξύ τους.`
    });
  }

  // Q5 (MCQ): True / False - Ορισμός Μ.Κ.Δ.
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Ο Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) δύο αριθμών είναι ο μεγαλύτερος αριθμός που τους διαιρεί και τους δύο ακριβώς.'
      : 'Ο Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) δύο αριθμών είναι το γινόμενο των δύο αριθμών.';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΟΡΙΣΜΟΣ Μ.Κ.Δ.',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Ο Μ.Κ.Δ. είναι ο μεγαλύτερος από όλους τους κοινούς διαιρέτες δύο ή περισσότερων αριθμών.'
        : 'Λάθος! Ο Μ.Κ.Δ. είναι ο μεγαλύτερος κοινός διαιρέτης, όχι το γινόμενο των αριθμών.'
    });
  }

  // Q6 (MCQ): True / False - Πρώτοι μεταξύ τους αριθμοί
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Όταν δύο αριθμοί έχουν Μ.Κ.Δ. ίσο με το 1, ονομάζονται πρώτοι μεταξύ τους.'
      : 'Δύο αριθμοί ονομάζονται πρώτοι μεταξύ τους μόνο αν είναι και οι δύο μονοψήφιοι.';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΙΔΙΟΤΗΤΑ ΠΡΩΤΩΝ ΜΕΤΑΞΥ ΤΟΥΣ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Δύο αριθμοί λέγονται πρώτοι μεταξύ τους όταν έχουν Μ.Κ.Δ. ίσο με 1.'
        : 'Λάθος! Δύο αριθμοί μπορεί να είναι πρώτοι μεταξύ τους ακόμη κι αν είναι μεγάλοι σύνθετοι αριθμοί (π.χ. 14 και 25).'
    });
  }

  // Q7 (Input): Οπτική Κατάτμηση
  {
    const q7A = [18, 24, 30][randInt(0, 2)];
    const q7B = [12, 16, 20][randInt(0, 2)];
    const q7Mkd = getGCD(q7A, q7B);

    qList.push({
      id: 7,
      type: 'integer_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΚΑΤΑΤΜΗΣΗ',
      instruction: 'Βρείτε το μέγιστο κοινό μήκος κομματιού σε εκατοστά (εκ.):',
      prompt: `Ποιο είναι το μεγαλύτερο κοινό μήκος κομματιού που μετράει ακριβώς δύο ράβδους μήκους ${q7A} εκ. και ${q7B} εκ.;`,
      correctVal: q7Mkd,
      correctStr: String(q7Mkd),
      explanation: `Το μεγαλύτερο μέγεθος κομματιού που μετράει ακριβώς και το ${q7A} και το ${q7B} είναι ο Μ.Κ.Δ.(${q7A}, ${q7B}) ＝ ${q7Mkd} εκ.`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας
  {
    const p = shuffledPresets[0];
    const q8Count1 = randInt(3, 6) * 6; // π.χ. 18, 24, 30, 36
    const q8Count2 = randInt(2, 5) * 6; // π.χ. 12, 18, 24
    const q8GCD = getGCD(q8Count1, q8Count2);
    const q8CorrectStr = `${q8GCD} ${p.groupName}`;

    const w1 = `${q8GCD + 2} ${p.groupName}`;
    const w2 = `${Math.max(1, q8GCD - 2)} ${p.groupName}`;
    const w3 = `${q8GCD * 2} ${p.groupName}`;

    const rawOptions = [q8CorrectStr, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8CorrectStr
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: 'Επιλέξτε το μέγιστο πλήθος όμοιων ομάδων:',
      prompt: `${p.profession} έχει ${q8Count1} ${p.item1} και ${q8Count2} ${p.item2}. ${p.questionText}`,
      options,
      correctText: q8CorrectStr,
      explanation: `Βρίσκουμε τον Μ.Κ.Δ.(${q8Count1}, ${q8Count2}) ＝ ${q8GCD}. Άρα μπορεί να φτιάξει το πολύ ${q8CorrectStr}.`
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate();
    const hardProb = shuffledHard[0].generate();

    // Q9 (Input)
    qList.push({
      id: 9,
      type: 'integer_input',
      title: `ΕΡΩΤΗΣΗ 9 • ${stdProb.title}`,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      correctVal: stdProb.correctVal,
      correctStr: stdProb.correctStr,
      explanation: stdProb.explanation
    });

    // Q10 (MCQ)
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

export default function MkdExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργία νέων ασκήσεων
  const loadNewSet = useCallback(() => {
    const q = generateQuestions();
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμός Input μόνο για ακέραιους αριθμούς (0-9)
  const handleInputChange = (qId, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/[^0-9]/g, '');
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: sanitized
    }));
  };

  // Χειρισμός MCQ
  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  const isQuestionCorrect = (q) => {
    if (q.type === 'mcq') {
      return answers[`q_${q.id}`] === q.correctText;
    }
    if (q.type === 'integer_input') {
      const userValStr = (answers[`q_${q.id}`] || '').trim();
      const userVal = parseInt(userValStr, 10);
      return !isNaN(userVal) && userVal === q.correctVal;
    }
    return false;
  };

  // Έλεγχος Απαντήσεων
  const handleCheckAnswers = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitted) return;

    let currentScore = 0;
    questions.forEach((q) => {
      if (isQuestionCorrect(q)) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== null && String(val).trim() !== '').length;

  return (
    <Layout
      title="Ασκήσεις: Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στον Μέγιστο Κοινό Διαιρέτη για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/14-mkd"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 {toCleanUppercase('Θεωρία')}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 14 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ασκήσεις &amp; Προβλήματα: Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.)
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 δυναμικές δραστηριότητες εύρεσης Μ.Κ.Δ., κοινών διαιρετών, πρώτων μεταξύ τους αριθμών και ρεαλιστικά προβλήματα καθημερινής ζωής.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίους αριθμούς.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation"
            >
              <span>🔄 {toCleanUppercase('Νέες Ασκήσεις')}</span>
            </button>
          </div>
        </section>

        {/* Λίστα 10 Ασκήσεων */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, idx) => {
            const isCorrect = isSubmitted && isQuestionCorrect(q);

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
                {/* Επικεφαλίδα Ερώτησης */}
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
                      {isCorrect ? `✓ ${toCleanUppercase('Σωστό')}` : `✗ ${toCleanUppercase('Λάθος')}`}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση */}
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

                {/* Περιοχή Απάντησης */}
                <div className="py-2">
                  {/* Integer Input */}
                  {q.type === 'integer_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck="false"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500 font-medium">
                        (Ακέραιος αριθμός)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) */}
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
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 min-h-[48px] ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-300'
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

                {/* Feedback μετά την υποβολή */}
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

        {/* Κουμπί Ελέγχου στο τέλος της φόρμας */}
        {!isSubmitted && (
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={handleCheckAnswers}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
            >
              <span>🎯 {toCleanUppercase('Έλεγχος Απαντήσεων')}</span>
            </button>
          </div>
        )}

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                {isSubmitted ? toCleanUppercase('Σκορ') : toCleanUppercase('Απαντήθηκαν')}
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {isSubmitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-8">
                <span className="text-xs text-slate-400 font-semibold block">
                  {toCleanUppercase('Ποσοστό')}
                </span>
                <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
                  {Math.round((score / 10) * 100)} %
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                {toCleanUppercase('Έλεγχος')}
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                <span>🔄 {toCleanUppercase('Νέες Ασκήσεις')}</span>
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}

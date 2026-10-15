// pages/st-dimotikou/82-ogkos-kilindrou-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// -------------------------------------------------------------
// DEFENSIVE UTILITY FUNCTIONS
// -------------------------------------------------------------

function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatNum(val) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString('el-GR');
}

// Διασφάλιση ακριβώς 4 μοναδικών επιλογών για ερωτήσεις MCQ
function ensureFourUniqueOptions(correctText, distractorsGen) {
  const optionsSet = new Set([String(correctText).trim()]);
  const candidates = distractorsGen();

  for (const c of candidates) {
    if (optionsSet.size >= 4) break;
    if (c !== undefined && c !== null && String(c).trim() !== '') {
      optionsSet.add(String(c).trim());
    }
  }

  let counter = 1;
  while (optionsSet.size < 4) {
    optionsSet.add(`${correctText} (${counter})`);
    counter++;
  }

  return shuffle([...optionsSet]);
}

// -------------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (POOLS) ΓΙΑ Q9, Q10, Q11, Q12
// -------------------------------------------------------------

// POOL ΓΙΑ Q9: Υπολογισμός Όγκου Κυλίνδρου [V ＝ π · ρ² · υ]
const PROBLEM_POOL_Q9 = [
  // 1. Κυλινδρική κατσαρόλα
  () => {
    const r = randInt(8, 14);
    const h = randInt(10, 20);
    const baseArea = 3.14 * r * r;
    const vol = baseArea * h;
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΟΓΚΟΣ ΚΥΛΙΝΔΡΙΚΗΣ ΚΑΤΣΑΡΟΛΑΣ',
      prompt: `Μια κυλινδρική κατσαρόλα έχει ακτίνα βάσης ρ ＝ ${r} cm και ύψος υ ＝ ${h} cm. Ποιος είναι ο όγκος της σε cm³; (Χρησιμοποιήστε π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(baseArea)} cm³`,
        `${formatNum(vol + 150)} cm³`,
        `${formatNum(vol - 150 > 0 ? vol - 150 : vol + 300)} cm³`,
        `${formatNum(2 * 3.14 * r * h)} cm³`
      ]),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακτίνα (ρ)', value: `${r} cm` },
        { label: 'Εμβαδόν βάσης (π · ρ²)', value: `3,14 · ${r} · ${r} ＝ ${formatNum(baseArea)} cm²` },
        { label: 'Ύψος (υ)', value: `${h} cm` },
        { label: 'Όγκος (V ＝ Εβ · υ)', value: `${formatNum(baseArea)} · ${h} ＝ ${formatNum(vol)} cm³` }
      ],
      explanation: `Υπολογίζουμε πρώτα το εμβαδόν της βάσης: Εβ ＝ π · ρ² ＝ 3,14 · ${r} · ${r} ＝ ${formatNum(baseArea)} cm². Έπειτα πολλαπλασιάζουμε με το ύψος: V ＝ ${formatNum(baseArea)} · ${h} ＝ ${formatNum(vol)} cm³.`
    };
  },
  // 2. Κυλινδρικό ποτήρι
  () => {
    const r = 4; // cm
    const h = 10; // cm
    const baseArea = 3.14 * 16; // 50.24 cm²
    const vol = baseArea * 10; // 502.4 cm³
    const correct = '502,4 cm³';
    return {
      title: 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΠΟΤΗΡΙΟΥ',
      prompt: `Ένα κυλινδρικό ποτήρι έχει ακτίνα βάσης ρ ＝ 4 cm και ύψος υ ＝ 10 cm. Πόσα cm³ νερού χωράει όταν γεμίσει μέχρι πάνω; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['251,2 cm³', '50,24 cm³', '125,6 cm³', '1.004,8 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακτίνα (ρ)', value: '4 cm' },
        { label: 'Βάση (π · ρ²)', value: '3,14 · 16 ＝ 50,24 cm²' },
        { label: 'Όγκος (V ＝ Εβ · υ)', value: '50,24 · 10 ＝ 502,4 cm³' }
      ],
      explanation: `V ＝ π · ρ² · υ ＝ 3,14 · 4 · 4 · 10 ＝ 50,24 · 10 ＝ 502,4 cm³.`
    };
  },
  // 3. Μεταλλικό κουτί αναψυκτικού
  () => {
    const r = 3; // cm
    const h = 12; // cm
    const vol = 3.14 * 9 * 12; // 339.12 cm³
    const correct = '339,12 cm³';
    return {
      title: 'ΚΟΥΤΙ ΑΝΑΨΥΚΤΙΚΟΥ',
      prompt: `Ένα κυλινδρικό κουτί αναψυκτικού έχει ακτίνα βάσης ρ ＝ 3 cm και ύψος υ ＝ 12 cm. Πόσο είναι το μέγεθος του όγκου του σε cm³; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['226,08 cm³', '113,04 cm³', '678,24 cm³', '300 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακτίνα (ρ)', value: '3 cm' },
        { label: 'Βάση (π · ρ²)', value: '3,14 · 9 ＝ 28,26 cm²' },
        { label: 'Όγκος', value: '28,26 · 12 ＝ 339,12 cm³' }
      ],
      explanation: `V ＝ 3,14 · 3 · 3 · 12 ＝ 28,26 · 12 ＝ 339,12 cm³.`
    };
  },
  // 4. Κυλινδρικό κερί
  () => {
    const r = 5; // cm
    const h = 20; // cm
    const vol = 3.14 * 25 * 20; // 1570 cm³
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΟΓΚΟΣ ΚΥΛΙΝΔΡΙΚΟΥ ΚΕΡΙΟΥ',
      prompt: `Ένα κυλινδρικό κερί έχει ακτίνα βάσης ρ ＝ 5 cm και ύψος υ ＝ 20 cm. Πόσα cm³ παραφίνης χρειάστηκαν για να κατασκευαστεί; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['785 cm³', '3.140 cm³', '628 cm³', '1.256 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακτίνα', value: '5 cm' },
        { label: 'Βάση', value: '3,14 · 25 ＝ 78,5 cm²' },
        { label: 'Όγκος', value: '78,5 · 20 ＝ 1.570 cm³' }
      ],
      explanation: `3,14 · 25 · 20 ＝ 1.570 cm³.`
    };
  },
  // 5. Κυλινδρικό δοχείο μπογιάς
  () => {
    const r = 10; // cm
    const h = 25; // cm
    const vol = 3.14 * 100 * 25; // 7850 cm³
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΔΟΧΕΙΟ ΜΠΟΓΙΑΣ',
      prompt: `Ένα κυλινδρικό δοχείο μπογιάς έχει ακτίνα βάσης ρ ＝ 10 cm και ύψος υ ＝ 25 cm. Ποιος είναι ο εσωτερικός του όγκος σε cm³; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['1.570 cm³', '3.925 cm³', '15.700 cm³', '7.500 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Βάση (π · ρ²)', value: '3,14 · 100 ＝ 314 cm²' },
        { label: 'Όγκος (Εβ · υ)', value: '314 · 25 ＝ 7.850 cm³' }
      ],
      explanation: `3,14 · 10 · 10 · 25 ＝ 314 · 25 ＝ 7.850 cm³.`
    };
  },
  // 6. Κυλινδρική κολόνα μπετόν σε m³
  () => {
    const r = 0.5; // m
    const h = 4; // m
    const vol = 3.14 * 0.25 * 4; // 3.14 m³
    const correct = '3,14 m³';
    return {
      title: 'ΚΥΛΙΝΔΡΙΚΗ ΚΟΛΟΝΑ ΜΠΕΤΟΝ',
      prompt: `Μια κυλινδρική κολόνα έχει ακτίνα ρ ＝ 0,5 m και ύψος υ ＝ 4 m. Πόσα κυβικά μέτρα (m³) μπετόν χρειάστηκαν για να κατασκευαστεί; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['6,28 m³', '1,57 m³', '12,56 m³', '4 m³']),
      correctAnswer: correct,
      unit: 'm³',
      tableData: [
        { label: 'Ακτίνα', value: '0,5 m' },
        { label: 'Βάση', value: '3,14 · 0,25 ＝ 0,785 m²' },
        { label: 'Όγκος', value: '0,785 · 4 ＝ 3,14 m³' }
      ],
      explanation: `V ＝ 3,14 · 0,5 · 0,5 · 4 ＝ 3,14 m³.`
    };
  }
];

// POOL ΓΙΑ Q10: Όγκος Κυλίνδρου όταν Δίνεται η Διάμετρος δ (ρ ＝ δ : 2)
const PROBLEM_POOL_Q10 = [
  // 1. Κυλινδρικό βαρέλι με διάμετρο
  () => {
    const d = 20; // cm => r = 10
    const h = 30; // cm
    const r = 10;
    const vol = 3.14 * 100 * 30; // 9420 cm³
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΚΥΛΙΝΔΡΙΚΟ ΒΑΡΕΛΙ ΜΕ ΔΙΑΜΕΤΡΟ',
      prompt: `Ένα κυλινδρικό βαρέλι έχει διάμετρο βάσης δ ＝ 20 cm και ύψος υ ＝ 30 cm. Πόσα cm³ είναι ο όγκος του; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(vol * 4)} cm³`,
        `${formatNum(vol / 2)} cm³`,
        '1.884 cm³',
        '6.000 cm³'
      ]),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Διάμετρος (δ)', value: '20 cm' },
        { label: 'Ακτίνα (ρ ＝ δ : 2)', value: '20 : 2 ＝ 10 cm' },
        { label: 'Βάση (π · ρ²)', value: '3,14 · 10 · 10 ＝ 314 cm²' },
        { label: 'Όγκος', value: '314 · 30 ＝ 9.420 cm³' }
      ],
      explanation: `Βρίσκουμε πρώτα την ακτίνα: ρ ＝ 20 : 2 ＝ 10 cm. Όγκος: V ＝ 3,14 · 10 · 10 · 30 ＝ 9.420 cm³.`
    };
  },
  // 2. Μεταλλικός κύλινδρος με διάμετρο 12 cm
  () => {
    const d = 12; // r = 6
    const h = 10;
    const vol = 3.14 * 36 * 10; // 1130.4
    const correct = '1.130,4 cm³';
    return {
      title: 'ΜΕΤΑΛΛΙΚΟΣ ΚΥΛΙΝΔΡΟΣ',
      prompt: `Ένας μεταλλικός κύλινδρος έχει διάμετρο δ ＝ 12 cm και ύψος υ ＝ 10 cm. Ποιος είναι ο όγκος του σε cm³; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['4.521,6 cm³', '565,2 cm³', '376,8 cm³', '1.200 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακτίνα (ρ ＝ δ : 2)', value: '12 : 2 ＝ 6 cm' },
        { label: 'Βάση (π · ρ²)', value: '3,14 · 36 ＝ 113,04 cm²' },
        { label: 'Όγκος', value: '113,04 · 10 ＝ 1.130,4 cm³' }
      ],
      explanation: `ρ ＝ 6 cm. V ＝ 3,14 · 6 · 6 · 10 ＝ 1.130,4 cm³.`
    };
  },
  // 3. Σιλό δημητριακών
  () => {
    const d = 4; // m => r = 2
    const h = 10; // m
    const vol = 3.14 * 4 * 10; // 125.6 m³
    const correct = '125,6 m³';
    return {
      title: 'ΚΥΛΙΝΔΡΙΚΟ ΣΙΛΟ',
      prompt: `Ένα σιλό αποθήκευσης σιτηρών έχει διάμετρο δ ＝ 4 m και ύψος υ ＝ 10 m. Πόσα m³ σιτηρών χωράει; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['502,4 m³', '62,8 m³', '120 m³', '251,2 m³']),
      correctAnswer: correct,
      unit: 'm³',
      tableData: [
        { label: 'Διάμετρος (δ)', value: '4 m' },
        { label: 'Ακτίνα (ρ)', value: '4 : 2 ＝ 2 m' },
        { label: 'Όγκος (V ＝ π · ρ² · υ)', value: '3,14 · 4 · 10 ＝ 125,6 m³' }
      ],
      explanation: `ρ ＝ 2 m. V ＝ 3,14 · 2 · 2 · 10 ＝ 125,6 m³.`
    };
  },
  // 4. Κυλινδρικό κουτί μπισκότων
  () => {
    const d = 16; // r = 8
    const h = 10;
    const vol = 3.14 * 64 * 10; // 2009.6
    const correct = '2.009,6 cm³';
    return {
      title: 'ΚΟΥΤΙ ΜΠΙΣΚΟΤΩΝ',
      prompt: `Ένα κουτί μπισκότων έχει διάμετρο βάσης 16 cm και ύψος 10 cm. Πόσο είναι το μέγεθος του όγκου του; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['8.038,4 cm³', '1.004,8 cm³', '502,4 cm³', '2.560 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακτίνα (ρ)', value: '16 : 2 ＝ 8 cm' },
        { label: 'Όγκος', value: '3,14 · 64 · 10 ＝ 2.009,6 cm³' }
      ],
      explanation: `ρ ＝ 8 cm. V ＝ 3,14 · 8 · 8 · 10 ＝ 2.009,6 cm³.`
    };
  },
  // 5. Πλαστικό βαρέλι με διάμετρο 60 cm
  () => {
    const d = 60; // r = 30
    const h = 50;
    const vol = 3.14 * 900 * 50; // 141300
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΠΛΑΣΤΙΚΟ ΒΑΡΕΛΙ',
      prompt: `Ένα πλαστικό βαρέλι έχει διάμετρο 60 cm και ύψος 50 cm. Ποιος είναι ο όγκος του σε cm³; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['565.200 cm³', '70.650 cm³', '282.600 cm³', '150.000 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακτίνα (ρ)', value: '60 : 2 ＝ 30 cm' },
        { label: 'Όγκος', value: '3,14 · 900 · 50 ＝ 141.300 cm³' }
      ],
      explanation: `ρ ＝ 30 cm. V ＝ 3,14 · 30 · 30 · 50 ＝ 141.300 cm³.`
    };
  },
  // 6. Σωλήνας με διάμετρο 10 cm και μήκος 20 cm
  () => {
    const d = 10; // r = 5
    const h = 20;
    const vol = 3.14 * 25 * 20; // 1570
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΟΓΚΟΣ ΣΩΛΗΝΑ',
      prompt: `Ένας σωλήνας έχει εσωτερική διάμετρο 10 cm και μήκος 20 cm. Πόσος είναι ο εσωτερικός του όγκος; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['6.280 cm³', '785 cm³', '3.140 cm³', '1.000 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακτίνα (ρ)', value: '10 : 2 ＝ 5 cm' },
        { label: 'Πράξη', value: '3,14 · 25 · 20 ＝ 1.570 cm³' }
      ],
      explanation: `ρ ＝ 5 cm. V ＝ 3,14 · 5 · 5 · 20 ＝ 1.570 cm³.`
    };
  }
];

// POOL ΓΙΑ Q11: Μετατροπή Όγκου Κυλίνδρου σε Λίτρα (1 dm³ ＝ 1 L)
const PROBLEM_POOL_Q11 = [
  // 1. Boiler θερμοσίφωνα
  () => {
    // r = 2.5 dm (25 cm), h = 10 dm (100 cm) => V = 3.14 * 6.25 * 10 = 196.25 dm³ = 196.25 L
    const liters = 3.14 * 2.5 * 2.5 * 10; // 196.25
    const correct = '196,25 L';
    return {
      title: 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΘΕΡΜΟΣΙΦΩΝΑ',
      prompt: `Το κυλινδρικό δοχείο ενός ηλιακού θερμοσίφωνα έχει ακτίνα βάσης ρ ＝ 2,5 dm και μήκος υ ＝ 10 dm. Πόσα λίτρα (L) νερού χωράει; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['19,625 L', '1.962,5 L', '392,5 L', '78,5 L']),
      correctAnswer: correct,
      unit: 'L',
      tableData: [
        { label: 'Ακτίνα σε dm', value: '2,5 dm' },
        { label: 'Ύψος σε dm', value: '10 dm' },
        { label: 'Όγκος σε dm³', value: '3,14 · 2,5 · 2,5 · 10 ＝ 196,25 dm³' },
        { label: 'Χωρητικότητα (1 dm³ ＝ 1 L)', value: '196,25 L' }
      ],
      explanation: `V ＝ 3,14 · 2,5 · 2,5 · 10 ＝ 196,25 dm³. Επειδή 1 dm³ ＝ 1 L, ο θερμοσίφωνας χωράει 196,25 L.`
    };
  },
  // 2. Μεταλλικό βαρέλι 200 L
  () => {
    // r = 1 m, h = 1 m => V = 3.14 m³ = 3140 L
    const correct = '3.140 L';
    return {
      title: 'ΚΥΛΙΝΔΡΙΚΗ ΔΕΞΑΜΕΝΗ ΣΕ ΛΙΤΡΑ',
      prompt: `Μια κυλινδρική δεξαμενή έχει ακτίνα βάσης 1 m και ύψος 1 m. Πόσα λίτρα (L) νερού περιέχει όταν είναι γεμάτη; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['314 L', '31.400 L', '3,14 L', '1.570 L']),
      correctAnswer: correct,
      unit: 'L',
      tableData: [
        { label: 'Όγκος σε m³', value: '3,14 · 1 · 1 · 1 ＝ 3,14 m³' },
        { label: 'Σχέση m³ με λίτρα', value: '1 m³ ＝ 1.000 L' },
        { label: 'Χωρητικότητα', value: '3,14 · 1.000 ＝ 3.140 L' }
      ],
      explanation: `V ＝ 3,14 m³. 3,14 · 1.000 ＝ 3.140 L.`
    };
  },
  // 3. Κυλινδρική κανάτα νερού
  () => {
    const r = 5; // cm
    const h = 20; // cm
    const cm3 = 3.14 * 25 * 20; // 1570 cm³
    const liters = cm3 / 1000; // 1.57 L
    const correct = '1,57 L';
    return {
      title: 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΚΑΝΑΤΑΣ',
      prompt: `Μια κυλινδρική κανάτα έχει ακτίνα βάσης 5 cm και ύψος 20 cm. Πόσα λίτρα (L) χυμού χωράει; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['15,7 L', '0,157 L', '3,14 L', '157 L']),
      correctAnswer: correct,
      unit: 'L',
      tableData: [
        { label: 'Όγκος σε cm³', value: '3,14 · 25 · 20 ＝ 1.570 cm³' },
        { label: 'Μετατροπή σε λίτρα (: 1.000)', value: '1.570 : 1.000 ＝ 1,57 L' }
      ],
      explanation: `V ＝ 1.570 cm³. Διαιρούμε με το 1.000: 1.570 : 1.000 ＝ 1,57 L.`
    };
  },
  // 4. Βαρέλι κρασιού
  () => {
    // r = 2 dm, h = 5 dm => V = 3.14 * 4 * 5 = 62.8 dm³ = 62.8 L
    const correct = '62,8 L';
    return {
      title: 'ΒΑΡΕΛΙ ΚΡΑΣΙΟΥ',
      prompt: `Ένα κυλινδρικό βαρέλι έχει ακτίνα βάσης 2 dm και ύψος 5 dm. Πόσα λίτρα (L) κρασί περιέχει όταν γεμίσει; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['628 L', '6,28 L', '125,6 L', '31,4 L']),
      correctAnswer: correct,
      unit: 'L',
      tableData: [
        { label: 'Όγκος σε dm³', value: '3,14 · 4 · 5 ＝ 62,8 dm³' },
        { label: 'Λίτρα (1 dm³ ＝ 1 L)', value: '62,8 L' }
      ],
      explanation: `3,14 · 2 · 2 · 5 ＝ 62,8 dm³ ＝ 62,8 L.`
    };
  },
  // 5. Κυλινδρικό βάζο μελιού
  () => {
    // r = 5 cm, h = 10 cm => 3.14 * 25 * 10 = 785 cm³ = 0.785 L
    const correct = '0,785 L';
    return {
      title: 'ΒΑΖΟ ΜΕΛΙΟΥ',
      prompt: `Ένα κυλινδρικό βάζο έχει ακτίνα βάσης 5 cm και ύψος 10 cm. Πόσα λίτρα (L) είναι η χωρητικότητά του; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['7,85 L', '78,5 L', '0,0785 L', '1,57 L']),
      correctAnswer: correct,
      unit: 'L',
      tableData: [
        { label: 'Όγκος σε cm³', value: '3,14 · 25 · 10 ＝ 785 cm³' },
        { label: 'Σε λίτρα', value: '785 : 1.000 ＝ 0,785 L' }
      ],
      explanation: `785 cm³ ＝ 0,785 L.`
    };
  },
  // 6. Δεξαμενή νερού 10 m³
  () => {
    const correct = '10.000 L';
    return {
      title: 'ΜΕΤΑΤΡΟΠΗ 10 M³ ΣΕ ΛΙΤΡΑ',
      prompt: `Μια κυλινδρική δεξαμενή έχει όγκο 10 m³. Πόσα λίτρα (L) νερού περιέχει;`,
      options: ensureFourUniqueOptions(correct, () => ['1.000 L', '100.000 L', '100 L', '5.000 L']),
      correctAnswer: correct,
      unit: 'L',
      tableData: [
        { label: 'Όγκος σε m³', value: '10 m³' },
        { label: 'Σχέση', value: '1 m³ ＝ 1.000 L' },
        { label: 'Πράξη', value: '10 · 1.000 ＝ 10.000 L' }
      ],
      explanation: `10 · 1.000 ＝ 10.000 L.`
    };
  }
];

// POOL ΓΙΑ Q12: Αντίστροφο Πρόβλημα Κυλίνδρου [υ ＝ V : (π · ρ²)] & Μεταβολές
const PROBLEM_POOL_Q12 = [
  // 1. Εύρεση ύψους κυλίνδρου
  () => {
    const r = 10; // cm => Base = 314
    const h = 8;
    const vol = 314 * h; // 2512 cm³
    const correct = `${h} cm`;
    return {
      title: 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΚΥΛΙΝΔΡΟΥ',
      prompt: `Ένα κυλινδρικό δοχείο έχει όγκο 2.512 cm³ και ακτίνα βάσης 10 cm. Πόσο είναι το ύψος (το βάθος) του δοχείου; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['10 cm', '6 cm', '12 cm', '5 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Όγκος (V)', value: '2.512 cm³' },
        { label: 'Εμβαδόν βάσης (Εβ)', value: '3,14 · 10 · 10 ＝ 314 cm²' },
        { label: 'Τύπος ύψους', value: 'υ ＝ V : Εβ' },
        { label: 'Πράξη', value: '2.512 : 314 ＝ 8 cm' }
      ],
      explanation: `Βρίσκουμε το εμβαδόν της βάσης: 3,14 · 100 ＝ 314 cm². Ύψος: υ ＝ V : Εβ ＝ 2.512 : 314 ＝ 8 cm.`
    };
  },
  // 2. Εύρεση ύψους με όγκο 628 cm³ και ακτίνα 5 cm
  () => {
    // Base = 3.14 * 25 = 78.5 => h = 628 / 78.5 = 8 cm
    const correct = '8 cm';
    return {
      title: 'ΥΨΟΣ ΑΠΟ ΤΟΝ ΟΓΚΟ',
      prompt: `Σε έναν κύλινδρο ο όγκος είναι 628 cm³ και η ακτίνα βάσης είναι 5 cm. Πόσο είναι το ύψος του; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['10 cm', '6 cm', '12 cm', '4 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν βάσης', value: '3,14 · 25 ＝ 78,5 cm²' },
        { label: 'Ύψος', value: '628 : 78,5 ＝ 8 cm' }
      ],
      explanation: `628 : (3,14 · 25) ＝ 628 : 78,5 ＝ 8 cm.`
    };
  },
  // 3. Διπλασιασμός ύψους κυλίνδρου
  () => {
    const correct = 'Ο όγκος διπλασιάζεται';
    return {
      title: 'ΜΕΤΑΒΟΛΗ ΥΨΟΥΣ ΚΥΛΙΝΔΡΟΥ',
      prompt: `Αν σε έναν κύλινδρο διπλασιάσουμε το ύψος του διατηρώντας την ακτίνα σταθερή, πώς θα αλλάξει ο όγκος του;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Ο όγκος τετραπλασιάζεται',
        'Ο όγκος παραμένει ίδιος',
        'Ο όγκος οκταπλασιάζεται'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Αρχικός όγκος', value: 'V₁ ＝ π · ρ² · υ' },
        { label: 'Νέος όγκος', value: 'V₂ ＝ π · ρ² · (2υ) ＝ 2 · (π · ρ² · υ) ＝ 2 · V₁' }
      ],
      explanation: `Ο όγκος είναι ανάλογος του ύψους. Όταν διπλασιάζεται το ύψος με σταθερή ακτίνα, ο όγκος διπλασιάζεται.`
    };
  },
  // 4. Διπλασιασμός ακτίνας κυλίνδρου (όγκος επί 4)
  () => {
    const correct = 'Ο όγκος γίνεται 4 φορές μεγαλύτερος (τετραπλασιάζεται)';
    return {
      title: 'ΔΙΠΛΑΣΙΑΣΜΟΣ ΑΚΤΙΝΑΣ ΚΥΛΙΝΔΡΟΥ',
      prompt: `Αν σε έναν κύλινδρο διπλασιάσουμε την ακτίνα της βάσης του (από ρ σε 2ρ) διατηρώντας το ύψος σταθερό, πώς θα αλλάξει ο όγκος του;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Ο όγκος διπλασιάζεται',
        'Ο όγκος παραμένει ίδιος',
        'Ο όγκος γίνεται 8 φορές μεγαλύτερος'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Αρχικός όγκος', value: 'V₁ ＝ π · ρ² · υ' },
        { label: 'Νέος όγκος', value: 'V₂ ＝ π · (2ρ)² · υ ＝ π · 4ρ² · υ ＝ 4 · V₁' }
      ],
      explanation: `Επειδή η ακτίνα είναι στο τετράγωνο (ρ²), ο διπλασιασμός της ακτίνας τετραπλασιάζει τον όγκο (2 · 2 ＝ 4).`
    };
  },
  // 5. Εύρεση εμβαδού βάσης κυλίνδρου
  () => {
    const vol = 500;
    const h = 20;
    const baseArea = vol / h; // 25
    const correct = '25 cm²';
    return {
      title: 'ΕΥΡΕΣΗ ΕΜΒΑΔΟΥ ΒΑΣΗΣ',
      prompt: `Ένας κύλινδρος έχει όγκο 500 cm³ και ύψος 20 cm. Πόσο είναι το εμβαδόν της κυκλικής βάσης του;`,
      options: ensureFourUniqueOptions(correct, () => ['50 cm²', '100 cm²', '20 cm²', '10 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Όγκος (V)', value: '500 cm³' },
        { label: 'Ύψος (υ)', value: '20 cm' },
        { label: 'Εμβαδόν βάσης (V : υ)', value: '500 : 20 ＝ 25 cm²' }
      ],
      explanation: `Εβ ＝ V : υ ＝ 500 : 20 ＝ 25 cm².`
    };
  },
  // 6. Χρόνος γεμίσματος κυλινδρικής δεξαμενής
  () => {
    // V = 6.000 L, παροχή = 100 L/min => 60 min (1 ώρα)
    const correct = '60 λεπτά (1 ώρα)';
    return {
      title: 'ΧΡΟΝΟΣ ΓΕΜΙΣΜΑΤΟΣ ΔΕΞΑΜΕΝΗΣ',
      prompt: `Μια κυλινδρική δεξαμενή χωρητικότητας 6.000 L γεμίζει από αντλία με ρυθμό 100 L το λεπτό. Σε πόση ώρα θα γεμίσει πλήρως;`,
      options: ensureFourUniqueOptions(correct, () => ['30 λεπτά', '120 λεπτά (2 ώρες)', '45 λεπτά', '10 λεπτά']),
      correctAnswer: correct,
      unit: 'λεπτά',
      tableData: [
        { label: 'Χωρητικότητα', value: '6.000 L' },
        { label: 'Ρυθμός παροχής', value: '100 L ανά λεπτό' },
        { label: 'Χρόνος (6.000 : 100)', value: '60 λεπτά (1 ώρα)' }
      ],
      explanation: `6.000 : 100 ＝ 60 λεπτά, δηλαδή ακριβώς 1 ώρα.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Τύπος όγκου κυλίνδρου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΤΥΠΟΣ ΟΓΚΟΥ ΚΥΛΙΝΔΡΟΥ',
    prompt: isQ1True
      ? 'Ο όγκος του κυλίνδρου υπολογίζεται πολλαπλασιάζοντας το εμβαδόν της βάσης του επί το ύψος: V ＝ π · ρ² · υ.'
      : 'Ο όγκος του κυλίνδρου υπολογίζεται με τον τύπο V ＝ 2 · π · ρ · υ.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Τύπος Όγκου', value: 'V ＝ π · ρ² · υ (χώρος σε cm³, m³)' },
      { label: 'Τύπος Παράπλευρης', value: 'Επ ＝ (2 · π · ρ) · υ (επιφάνεια σε cm², m²)' }
    ],
    explanation: isQ1True
      ? 'Ο όγκος του κυλίνδρου ισούται πράγματι με το εμβαδόν βάσης επί το ύψος: V ＝ π · ρ² · υ.'
      : 'Ο τύπος (2 · π · ρ) · υ δίνει την παράπλευρη επιφάνεια (εμβαδόν). Ο όγκος δίνεται από τον τύπο V ＝ π · ρ² · υ.'
  });

  // Q2: Εμβαδόν βάσης επί ύψος (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΕΜΒΑΔΟΝ ΒΑΣΗΣ ΚΑΙ ΟΓΚΟΣ',
    prompt: 'Ποια σχέση συνδέει τον όγκο (V) ενός κυλίνδρου με το εμβαδόν της κυκλικής βάσης του (Εβ);',
    options: ensureFourUniqueOptions('V ＝ Εμβαδόν Βάσης · Ύψος (V ＝ Εβ · υ)', () => [
      'V ＝ Εμβαδόν Βάσης : Ύψος',
      'V ＝ (Εμβαδόν Βάσης · Ύψος) : 2',
      'V ＝ 2 · Εμβαδόν Βάσης · Ύψος'
    ]),
    correctAnswer: 'V ＝ Εμβαδόν Βάσης · Ύψος (V ＝ Εβ · υ)',
    tableData: [
      { label: 'Εμβαδόν βάσης', value: 'Εβ ＝ π · ρ²' },
      { label: 'Όγκος κυλίνδρου', value: 'V ＝ Εβ · υ ＝ π · ρ² · υ' }
    ],
    explanation: 'Όπως σε όλα τα πρίσματα, ο όγκος είναι εμβαδόν βάσης επί ύψος: V ＝ Εβ · υ.'
  });

  // Q3: Υπολογισμός από τη διάμετρο (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΜΕ ΔΙΑΜΕΤΡΟ',
    prompt: 'Αν σε ένα πρόβλημα κυλίνδρου δίνεται η διάμετρος (δ) της βάσης, τι πρέπει να κάνουμε πρώτα για να βρούμε τον όγκο;',
    options: ensureFourUniqueOptions('Να διαιρέσουμε τη διάμετρο με το 2 για να βρούμε την ακτίνα: ρ ＝ δ : 2', () => [
      'Να βάλουμε απευθείας τη διάμετρο στον τύπο: 3,14 · δ · δ · υ',
      'Να πολλαπλασιάσουμε τη διάμετρο με το 2',
      'Να προσθέσουμε τη διάμετρο στο ύψος'
    ]),
    correctAnswer: 'Να διαιρέσουμε τη διάμετρο με το 2 για να βρούμε την ακτίνα: ρ ＝ δ : 2',
    tableData: [
      { label: 'Σχέση', value: 'δ ＝ 2 · ρ, άρα ρ ＝ δ : 2' },
      { label: 'Βήμα', value: 'Πρώτα βρίσκουμε την ακτίνα ρ και μετά εφαρμόζουμε το π · ρ² · υ' }
    ],
    explanation: 'Ο τύπος του όγκου απαιτεί την ακτίνα ρ (και όχι τη διάμετρο), επομένως διαιρούμε πάντοτε πρώτα τη διάμετρο διά 2.'
  });

  // Q4: Οπτική αναγνώριση διαστάσεων κυλίνδρου (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΑΝΑΓΝΩΡΙΣΗ ΣΤΟΙΧΕΙΩΝ ΚΥΛΙΝΔΡΟΥ',
    prompt: 'Παρατηρήστε τον παρακάτω κύλινδρο. Ποιες διαστάσεις χρειάζονται για τον υπολογισμό του όγκου του;',
    svg: (
      <svg viewBox="0 0 160 120" className="w-40 h-28 mx-auto my-2 select-none drop-shadow-sm">
        <rect x="50" y="30" width="60" height="60" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
        <ellipse cx="80" cy="90" rx="30" ry="10" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="1.5" />
        <ellipse cx="80" cy="30" rx="30" ry="10" fill="#a5b4fc" stroke="#4f46e5" strokeWidth="1.5" />
        <line x1="80" y1="30" x2="110" y2="30" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="80" cy="30" r="2.5" fill="#ffffff" />
        <text x="95" y="24" fill="#f59e0b" fontSize="10" fontWeight="bold">ρ</text>
        <line x1="120" y1="30" x2="120" y2="90" stroke="#ffffff" strokeWidth="1.5" />
        <text x="130" y="64" fill="#ffffff" fontSize="11" fontWeight="bold">υ</text>
      </svg>
    ),
    options: ensureFourUniqueOptions('Η ακτίνα της βάσης (ρ) και το ύψος (υ)', () => [
      'Μόνο το ύψος του κυλίνδρου',
      'Μόνο η περίμετρος της βάσης',
      'Το εμβαδόν του αναπτύγματος'
    ]),
    correctAnswer: 'Η ακτίνα της βάσης (ρ) και το ύψος (υ)',
    tableData: [
      { label: 'Στοιχεία', value: 'Ακτίνα βάσης (ρ) και Ύψος (υ)' },
      { label: 'Τύπος', value: 'V ＝ π · ρ² · υ' }
    ],
    explanation: 'Για τον όγκο χρειαζόμαστε την ακτίνα ρ (για να βρούμε το εμβαδόν βάσης π · ρ²) και το ύψος υ.'
  });

  // Q5: Υπολογισμός όγκου με ρ = 10 cm και υ = 5 cm (Input αριθμού)
  // Base = 314, V = 314 * 5 = 1570
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΓΚΟΥ ΚΥΛΙΝΔΡΟΥ',
    prompt: 'Ένας κύλινδρος έχει ακτίνα βάσης ρ ＝ 10 cm και ύψος υ ＝ 5 cm. Πόσα cm³ είναι ο όγκος του; (π ＝ 3,14 - Γράψτε μόνο τον αριθμό)',
    correctAnswer: '1570',
    tableData: [
      { label: 'Βάση (π · ρ²)', value: '3,14 · 10 · 10 ＝ 314 cm²' },
      { label: 'Ύψος (υ)', value: '5 cm' },
      { label: 'Όγκος (Εβ · υ)', value: '314 · 5 ＝ 1.570 cm³' }
    ],
    explanation: `V ＝ 3,14 · 10 · 10 · 5 ＝ 314 · 5 ＝ 1.570 cm³.`
  });

  // Q6: Μετατροπή dm³ σε λίτρα (Input αριθμού)
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΜΕΤΑΤΡΟΠΗ DM³ ΣΕ ΛΙΤΡΑ',
    prompt: 'Ένα κυλινδρικό δοχείο έχει όγκο 45 dm³. Πόσα λίτρα (L) νερού χωράει; (Γράψτε μόνο τον αριθμό)',
    correctAnswer: '45',
    tableData: [
      { label: 'Όγκος σε dm³', value: '45 dm³' },
      { label: 'Ισοδυναμία', value: '1 dm³ ＝ 1 L' },
      { label: 'Χωρητικότητα', value: '45 L' }
    ],
    explanation: 'Επειδή 1 dm³ ισούται ακριβώς με 1 λίτρο, τα 45 dm³ αντιστοιχούν σε 45 L.'
  });

  // Q7: Πόσα λίτρα έχει 1 m³ (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΣΧΕΣΗ ΚΥΒΙΚΟΥ ΜΕΤΡΟΥ ΚΑΙ ΛΙΤΡΩΝ',
    prompt: 'Μια κυλινδρική δεξαμενή έχει όγκο 1 m³. Πόσα λίτρα (L) νερού χωράει όταν γεμίσει;',
    options: ensureFourUniqueOptions('1.000 Λίτρα', () => [
      '100 Λίτρα',
      '10 Λίτρα',
      '10.000 Λίτρα'
    ]),
    correctAnswer: '1.000 Λίτρα',
    tableData: [
      { label: '1 m³ σε dm³', value: '1.000 dm³' },
      { label: '1 dm³ σε λίτρα', value: '1 L' },
      { label: '1 m³ σε λίτρα', value: '1.000 L' }
    ],
    explanation: '1 m³ ＝ 1.000 dm³ ＝ 1.000 L.'
  });

  // Q8: Εύρεση ύψους από τον όγκο (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΑΠΟ ΤΟΝ ΟΓΚΟ',
    prompt: 'Αν γνωρίζουμε τον όγκο (V) ενός κυλίνδρου και το εμβαδόν της βάσης του (Εβ), πώς υπολογίζουμε το ύψος του;',
    options: ensureFourUniqueOptions('υ ＝ Όγκος : Εμβαδόν Βάσης', () => [
      'υ ＝ Όγκος · Εμβαδόν Βάσης',
      'υ ＝ (Όγκος · Εμβαδόν Βάσης) : 2',
      'υ ＝ Όγκος ＋ Εμβαδόν Βάσης'
    ]),
    correctAnswer: 'υ ＝ Όγκος : Εμβαδόν Βάσης',
    tableData: [
      { label: 'Τύπος', value: 'V ＝ Εβ · υ, άρα υ ＝ V : Εβ' }
    ],
    explanation: 'Διαιρούμε τον όγκο με το εμβαδόν της βάσης: υ ＝ V : Εβ.'
  });

  // Q9: Πρόβλημα από PROBLEM_POOL_Q9
  const p9 = PROBLEM_POOL_Q9[randInt(0, PROBLEM_POOL_Q9.length - 1)]();
  qs.push({ id: 9, type: 'mcq', ...p9 });

  // Q10: Πρόβλημα από PROBLEM_POOL_Q10
  const p10 = PROBLEM_POOL_Q10[randInt(0, PROBLEM_POOL_Q10.length - 1)]();
  qs.push({ id: 10, type: 'mcq', ...p10 });

  // Q11: Πρόβλημα από PROBLEM_POOL_Q11
  const p11 = PROBLEM_POOL_Q11[randInt(0, PROBLEM_POOL_Q11.length - 1)]();
  qs.push({ id: 11, type: 'mcq', ...p11 });

  // Q12: Πρόβλημα από PROBLEM_POOL_Q12
  const p12 = PROBLEM_POOL_Q12[randInt(0, PROBLEM_POOL_Q12.length - 1)]();
  qs.push({ id: 12, type: 'mcq', ...p12 });

  return qs;
}

// -------------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΑΣΚΗΣΕΩΝ
// -------------------------------------------------------------

export default function OgkosKilindrouAskiseisPage() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadNewSet();
  }, []);

  function loadNewSet() {
    const newQs = generateQuestionsSet();
    setQuestions(newQs);
    setUserAnswers({});
    setSubmitted(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleAnswerChange(id, rawValue) {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [id]: rawValue
    }));
  }

  function isQuestionCorrect(q) {
    const userAns = userAnswers[q.id];
    if (userAns === undefined || userAns === null) return false;

    if (q.type === 'boolean') {
      return userAns === q.correctAnswer;
    }

    if (q.type === 'mcq') {
      return String(userAns).trim() === String(q.correctAnswer).trim();
    }

    if (q.type === 'input') {
      const cleanUser = String(userAns).trim().replace(/\./g, ',');
      const cleanCorrect = String(q.correctAnswer).trim().replace(/\./g, ',');

      if (cleanUser === cleanCorrect) return true;

      const numUser = parseFloat(cleanUser.replace(',', '.'));
      const numCorrect = parseFloat(cleanCorrect.replace(',', '.'));
      if (!isNaN(numUser) && !isNaN(numCorrect)) {
        return Math.abs(numUser - numCorrect) <= 0.05;
      }
      return false;
    }

    return false;
  }

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] !== undefined && userAnswers[k] !== ''
  ).length;

  const score = questions.reduce((acc, q) => (isQuestionCorrect(q) ? acc + 1 : acc), 0);
  const totalCount = questions.length || 12;
  const percentage = Math.round((score / totalCount) * 100);

  return (
    <Layout
      title="Ασκήσεις: Όγκος Κυλίνδρου &amp; Χωρητικότητα σε Λίτρα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στον υπολογισμό όγκου κυλίνδρου (V ＝ π · ρ² · υ), ακτίνα, διάμετρο, εύρεση ύψους και λίτρα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/82-ogkos-kilindrou"
      backText="Θεωρία Κεφ. 82"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/82-ogkos-kilindrou"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden">

        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden mb-8 sm:mb-12">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 82 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Ογκος Κυλινδρου και Χωρητικοτητα')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στον υπολογισμό όγκου κυλίνδρου με τον τύπο V ＝ π · ρ² · υ, στη χρήση της διαμέτρου, στην εύρεση ύψους και στις μετατροπές σε λίτρα (L) μέσα από 12 δυναμικές ερωτήσεις.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>12 Δυναμικές Ασκήσεις με Αυτόματη Αξιολόγηση &amp; Αναλυτική Επεξήγηση</span>
            </div>
            <button
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>🔄 {toCleanUppercase('Νεες Ασκησεις')}</span>
            </button>
          </div>
        </section>

        {/* ΛΙΣΤΑ ΕΡΩΤΗΣΕΩΝ (12 ΕΡΩΤΗΣΕΙΣ) */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, index) => {
            const isCorrect = isQuestionCorrect(q);
            const userAns = userAnswers[q.id];

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-5 sm:p-8 shadow-sm border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 ring-1 ring-emerald-200'
                      : 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* ΚΕΦΑΛΙΔΑ ΕΡΩΤΗΣΗΣ */}
                <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm sm:text-base border border-indigo-150">
                      {index + 1}
                    </span>
                    <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-wider">
                      {toCleanUppercase(q.title || `ΕΡΩΤΗΣΗ ${index + 1}`)}
                    </h2>
                  </div>

                  {submitted && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black tracking-wider ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? toCleanUppercase('ΣΩΣΤΟ') : toCleanUppercase('ΛΑΘΟΣ')}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ & SVG (NO-GIVEAWAY: ΟΥΔΕΙΣ ΠΙΝΑΚΑΣ ΕΔΩ) */}
                <div className="mb-6 space-y-3">
                  <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed">
                    {q.prompt}
                  </p>
                  {q.svg && <div className="py-2">{q.svg}</div>}
                </div>

                {/* ΔΙΑΔΡΑΣΤΙΚΑ ΧΕΙΡΙΣΤΗΡΙΑ ΑΠΑΝΤΗΣΗΣ */}
                <div className="mb-4">
                  {/* ΤΥΠΟΣ 1: BOOLEAN */}
                  {q.type === 'boolean' && (
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                      {[true, false].map((val) => {
                        const isSelected = userAns === val;
                        return (
                          <button
                            key={String(val)}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, val)}
                            className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all border ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {val ? toCleanUppercase('ΣΩΣΤΟ') : toCleanUppercase('ΛΑΘΟΣ')}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 2: MCQ (4 ΜΟΝΑΔΙΚΑ ΚΟΥΜΠΙΑ) */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAns === opt;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`text-left p-3.5 sm:p-4 rounded-2xl border font-semibold text-xs sm:text-sm transition-all flex items-start gap-3 ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                isSelected
                                  ? 'bg-white text-indigo-700'
                                  : 'bg-white text-slate-500 border border-slate-200'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="break-words whitespace-normal leading-snug flex-1">
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 3: INPUT */}
                  {q.type === 'input' && (
                    <div className="max-w-xs">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={submitted}
                        placeholder="Απάντηση..."
                        value={userAns || ''}
                        onChange={(e) => {
                          const cleaned = e.target.value
                            .replace(/[^0-9.,]/g, '')
                            .replace(/\./g, ',');
                          handleAnswerChange(q.id, cleaned);
                        }}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-80"
                      />
                    </div>
                  )}
                </div>

                {/* FEEDBACK & EXPLANATION (ΑΠΟΚΛΕΙΣΤΙΚΑ ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ) */}
                {submitted && (
                  <div className="mt-6 pt-5 border-t border-slate-150 space-y-4">
                    {/* ΠΙΝΑΚΑΣ ΔΕΔΟΜΕΝΩΝ (TABLEDATA) ΜΟΝΟ ΕΔΩ */}
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-1">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <tbody>
                            {q.tableData.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={rIdx !== q.tableData.length - 1 ? 'border-b border-slate-200/60' : ''}
                              >
                                <td className="py-2.5 px-3 font-bold text-slate-600 bg-slate-100/70 w-1/3">
                                  {row.label}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-800">
                                  {row.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* ΑΝΑΛΥΤΙΚΗ ΕΠΕΞΗΓΗΣΗ (ΚΑΘΑΡΟΣ ΤΙΤΛΟΣ ΧΩΡΙΣ ΠΕΡΙΤΤΑ ΛΑΘΟΣ/ΣΩΣΤΟ) */}
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                          : 'bg-rose-50 text-rose-950 border border-rose-200'
                      }`}
                    >
                      <p className="font-bold mb-1">
                        {isCorrect
                          ? 'Σωστή απάντηση!'
                          : `Η σωστή απάντηση είναι: ${
                              q.type === 'boolean'
                                ? q.correctAnswer
                                  ? 'Σωστό'
                                  : 'Λάθος'
                                : q.correctAnswer
                            }`}
                      </p>
                      <p className="text-slate-700">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM SCORE FOOTER (12 ΕΡΩΤΗΣΕΙΣ) */}
        <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
          <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-8">
              {!submitted ? (
                <div className="text-xs sm:text-sm font-semibold text-slate-300">
                  <span>{toCleanUppercase('ΑΠΑΝΤΗΘΗΚΑΝ:')} </span>
                  <span className="font-black text-indigo-400 text-sm sm:text-base">
                    {answeredCount} / {totalCount}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span>{toCleanUppercase('ΣΚΟΡ:')} </span>
                    <span className="font-black text-emerald-400 text-sm sm:text-base">
                      {score} / {totalCount}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span>{toCleanUppercase('ΠΟΣΟΣΤΟ:')} </span>
                    <span className="font-black text-amber-400 text-sm sm:text-base">
                      {percentage}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!submitted ? (
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(true);
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-xs sm:text-sm"
                >
                  {toCleanUppercase('ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-xs sm:text-sm flex items-center gap-2"
                >
                  <span>🔄</span>
                  <span>{toCleanUppercase('ΝΕΕΣ ΑΣΚΗΣΕΙΣ')}</span>
                </button>
              )}
            </div>
          </div>
        </footer>

      </div>
    </Layout>
  );
}

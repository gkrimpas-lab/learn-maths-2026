// pages/st-dimotikou/79-kilindros-ask.js
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

// POOL ΓΙΑ Q9: Παράπλευρη Επιφάνεια Κυλίνδρου [Επ ＝ (2 · π · ρ) · υ]
const PROBLEM_POOL_Q9 = [
  // 1. Ετικέτα κονσέρβας με δοσμένη διάμετρο
  () => {
    const r = randInt(3, 6);
    const d = 2 * r;
    const h = randInt(10, 15);
    const peri = 2 * 3.14 * r;
    const lat = peri * h;
    const correct = `${formatNum(lat)} cm²`;
    return {
      title: 'ΕΤΙΚΕΤΑ ΚΟΝΣΕΡΒΑΣ',
      prompt: `Μια κυλινδρική κονσέρβα έχει διάμετρο βάσης ${d} cm και ύψος ${h} cm. Πόσα cm² χαρτιού χρειάζονται για την περιμετρική ετικέτα της; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(lat + 31.4)} cm²`,
        `${formatNum(lat - 31.4 > 0 ? lat - 31.4 : lat + 62.8)} cm²`,
        `${formatNum(3.14 * d * h * 2)} cm²`,
        `${formatNum(peri)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Διάμετρος (δ)', value: `${d} cm` },
        { label: 'Ακτίνα (ρ ＝ δ : 2)', value: `${d} : 2 ＝ ${r} cm` },
        { label: 'Μήκος ετικέτας (2 · π · ρ)', value: `2 · 3,14 · ${r} ＝ ${formatNum(peri)} cm` },
        { label: 'Παράπλευρη επιφάνεια (Επ)', value: `${formatNum(peri)} · ${h} ＝ ${formatNum(lat)} cm²` }
      ],
      explanation: `Βρίσκουμε πρώτα την ακτίνα: ρ ＝ ${d} : 2 ＝ ${r} cm. Η περίμετρος της βάσης είναι 2 · 3,14 · ${r} ＝ ${formatNum(peri)} cm. Εμβαδόν ετικέτας: Επ ＝ ${formatNum(peri)} · ${h} ＝ ${formatNum(lat)} cm².`
    };
  },
  // 2. Βάψιμο κυλινδρικής κολόνας
  () => {
    const r = 0.5; // m
    const h = 4; // m
    const peri = 2 * 3.14 * 0.5; // 3.14 m
    const lat = peri * h; // 12.56 m²
    const correct = '12,56 m²';
    return {
      title: 'ΒΑΨΙΜΟ ΚΥΛΙΝΔΡΙΚΗΣ ΚΟΛΟΝΑΣ',
      prompt: `Μια κυλινδρική κολόνα έχει ακτίνα βάσης 0,5 m και ύψος 4 m. Πόσα τετραγωνικά μέτρα (m²) θα βαφτούν στην πλαϊνή της επιφάνεια; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['6,28 m²', '25,12 m²', '3,14 m²', '15,7 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Ακτίνα (ρ)', value: '0,5 m' },
        { label: 'Περίμετρος βάσης (2 · π · ρ)', value: '2 · 3,14 · 0,5 ＝ 3,14 m' },
        { label: 'Παράπλευρη επιφάνεια', value: '3,14 · 4 ＝ 12,56 m²' }
      ],
      explanation: `Επ ＝ (2 · π · ρ) · υ ＝ (2 · 3,14 · 0,5) · 4 ＝ 3,14 · 4 ＝ 12,56 m².`
    };
  },
  // 3. Μεταλλικός σωλήνας ανοιχτός στα δύο άκρα
  () => {
    const r = 10; // cm
    const h = 50; // cm
    const peri = 2 * 3.14 * 10; // 62.8 cm
    const lat = peri * h; // 3140 cm²
    const correct = `${formatNum(lat)} cm²`;
    return {
      title: 'ΜΕΤΑΛΛΙΚΟΣ ΣΩΛΗΝΑΣ',
      prompt: `Ένας ανοιχτός κυλινδρικός σωλήνας έχει ακτίνα 10 cm και μήκος (ύψος) 50 cm. Πόσο είναι το εμβαδόν της εξωτερικής παράπλευρης επιφάνειάς του; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['1.570 cm²', '6.280 cm²', '628 cm²', '314 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Περίμετρος (2 · π · ρ)', value: '2 · 3,14 · 10 ＝ 62,8 cm' },
        { label: 'Εμβαδόν σωλήνα', value: '62,8 · 50 ＝ 3.140 cm²' }
      ],
      explanation: `Ο σωλήνας είναι ανοιχτός στα άκρα, άρα υπολογίζουμε μόνο την παράπλευρη επιφάνεια: 2 · 3,14 · 10 · 50 ＝ 3.140 cm².`
    };
  },
  // 4. Κύλινδρος με ακτίνα 2 cm και ύψος 10 cm
  () => {
    const r = 2;
    const h = 10;
    const lat = 2 * 3.14 * r * h; // 125.6
    const correct = '125,6 cm²';
    return {
      title: 'ΠΑΡΑΠΛΕΥΡΗ ΕΠΙΦΑΝΕΙΑ',
      prompt: `Πόσο είναι το εμβαδόν της παράπλευρης επιφάνειας ενός κυλίνδρου με ακτίνα βάσης 2 cm και ύψος 10 cm; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['62,8 cm²', '251,2 cm²', '12,56 cm²', '40 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Περίμετρος βάσης', value: '2 · 3,14 · 2 ＝ 12,56 cm' },
        { label: 'Παράπλευρη επιφάνεια', value: '12,56 · 10 ＝ 125,6 cm²' }
      ],
      explanation: `Επ ＝ (2 · π · ρ) · υ ＝ 12,56 · 10 ＝ 125,6 cm².`
    };
  },
  // 5. Κυλινδρικό κερί
  () => {
    const r = 3;
    const h = 20;
    const lat = 2 * 3.14 * 3 * 20; // 376.8
    const correct = '376,8 cm²';
    return {
      title: 'ΕΠΙΦΑΝΕΙΑ ΚΥΛΙΝΔΡΙΚΟΥ ΚΕΡΙΟΥ',
      prompt: `Ένα κυλινδρικό κερί έχει ακτίνα 3 cm και ύψος 20 cm. Πόση είναι η πλαϊνή (παράπλευρη) επιφάνειά του; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['188,4 cm²', '753,6 cm²', '314 cm²', '60 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Περίμετρος', value: '2 · 3,14 · 3 ＝ 18,84 cm' },
        { label: 'Πλαϊνή επιφάνεια', value: '18,84 · 20 ＝ 376,8 cm²' }
      ],
      explanation: `2 · 3,14 · 3 · 20 ＝ 376,8 cm².`
    };
  },
  // 6. Κύλινδρος με ακτίνα 4 cm και ύψος 5 cm
  () => {
    const r = 4;
    const h = 5;
    const lat = 2 * 3.14 * 4 * 5; // 125.6
    const correct = '125,6 cm²';
    return {
      title: 'ΠΑΡΑΠΛΕΥΡΗ ΕΠΙΦΑΝΕΙΑ ΚΥΛΙΝΔΡΟΥ',
      prompt: `Ένας κύλινδρος έχει ακτίνα ρ ＝ 4 cm και ύψος υ ＝ 5 cm. Πόσο είναι το εμβαδόν της παράπλευρης επιφάνειάς του; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['50,24 cm²', '251,2 cm²', '100 cm²', '25,12 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Περίμετρος βάσης', value: '2 · 3,14 · 4 ＝ 25,12 cm' },
        { label: 'Παράπλευρη', value: '25,12 · 5 ＝ 125,6 cm²' }
      ],
      explanation: `Επ ＝ (2 · 3,14 · 4) · 5 ＝ 25,12 · 5 ＝ 125,6 cm².`
    };
  }
];

// POOL ΓΙΑ Q10: Ολική Επιφάνεια Κλειστού Κυλίνδρου [Εολ ＝ Επ ＋ 2 · Εβ]
const PROBLEM_POOL_Q10 = [
  // 1. Μεταλλικό κλειστό βαρέλι
  () => {
    const r = 1; // m
    const h = 2; // m
    const lat = 2 * 3.14 * 1 * 2; // 12.56 m²
    const oneBase = 3.14 * 1 * 1; // 3.14 m²
    const twoBases = 2 * oneBase; // 6.28 m²
    const total = lat + twoBases; // 18.84 m²
    const correct = '18,84 m²';
    return {
      title: 'ΒΑΨΙΜΟ ΚΛΕΙΣΤΟΥ ΒΑΡΕΛΙΟΥ',
      prompt: `Ένα κλειστό μεταλλικό βαρέλι έχει ακτίνα βάσης 1 m και ύψος 2 m. Θέλουμε να βάψουμε ολόκληρη την εξωτερική του επιφάνεια (και τα δύο καπάκια και γύρω-γύρω). Πόσα m² θα βαφτούν; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['12,56 m²', '15,7 m²', '6,28 m²', '21,98 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Παράπλευρη επιφάνεια (Επ)', value: '2 · 3,14 · 1 · 2 ＝ 12,56 m²' },
        { label: 'Εμβαδόν 2 βάσεων (2 · Εβ)', value: '2 · (3,14 · 1 · 1) ＝ 6,28 m²' },
        { label: 'Ολική επιφάνεια (Εολ)', value: '12,56 ＋ 6,28 ＝ 18,84 m²' }
      ],
      explanation: `Εολ ＝ Επ ＋ 2 · Εβ ＝ 12,56 ＋ 2 · 3,14 ＝ 12,56 ＋ 6,28 ＝ 18,84 m².`
    };
  },
  // 2. Κλειστό κυλινδρικό κουτί μπισκότων
  () => {
    const r = 5; // cm
    const h = 10; // cm
    const lat = 2 * 3.14 * 5 * 10; // 314 cm²
    const oneBase = 3.14 * 25; // 78.5 cm²
    const twoBases = 2 * 78.5; // 157 cm²
    const total = lat + twoBases; // 471 cm²
    const correct = '471 cm²';
    return {
      title: 'ΚΛΕΙΣΤΟ ΚΟΥΤΙ ΜΠΙΣΚΟΤΩΝ',
      prompt: `Ένα κυλινδρικό κουτί με καπάκι έχει ακτίνα βάσης 5 cm και ύψος 10 cm. Πόσο λευκοσίδηρο σε cm² χρειάστηκε για την κατασκευή ολόκληρου του κουτιού; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['314 cm²', '392,5 cm²', '549,5 cm²', '628 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Παράπλευρη επιφάνεια', value: '2 · 3,14 · 5 · 10 ＝ 314 cm²' },
        { label: '2 κυκλικές βάσεις', value: '2 · (3,14 · 25) ＝ 157 cm²' },
        { label: 'Ολικό εμβαδόν', value: '314 ＋ 157 ＝ 471 cm²' }
      ],
      explanation: `Εολ ＝ 314 ＋ 157 ＝ 471 cm².`
    };
  },
  // 3. Κύλινδρος με ακτίνα 10 cm και ύψος 10 cm
  () => {
    const r = 10;
    const h = 10;
    const lat = 2 * 3.14 * 10 * 10; // 628 cm²
    const twoBases = 2 * (3.14 * 100); // 628 cm²
    const total = lat + twoBases; // 1256 cm²
    const correct = `${formatNum(total)} cm²`;
    return {
      title: 'ΙΣΟΠΛΕΥΡΟΣ ΚΥΛΙΝΔΡΟΣ',
      prompt: `Ένας κλειστός κύλινδρος έχει ακτίνα βάσης 10 cm και ύψος 10 cm. Πόσο είναι το ολικό εμβαδόν του αναπτύγματός του; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['628 cm²', '942 cm²', '1.570 cm²', '314 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Παράπλευρη επιφάνεια', value: '628 cm²' },
        { label: '2 βάσεις', value: '628 cm²' },
        { label: 'Ολικό εμβαδόν', value: '628 ＋ 628 ＝ 1.256 cm²' }
      ],
      explanation: `Επ ＝ 628 cm², 2 · Εβ ＝ 628 cm². Εολ ＝ 628 ＋ 628 ＝ 1.256 cm².`
    };
  },
  // 4. Κλειστή κυλινδρική δεξαμενή
  () => {
    const r = 2; // m
    const h = 3; // m
    const lat = 2 * 3.14 * 2 * 3; // 37.68 m²
    const twoBases = 2 * (3.14 * 4); // 25.12 m²
    const total = lat + twoBases; // 62.8 m²
    const correct = '62,8 m²';
    return {
      title: 'ΚΛΕΙΣΤΗ ΔΕΞΑΜΕΝΗ',
      prompt: `Μια κλειστή κυλινδρική δεξαμενή έχει ακτίνα 2 m και ύψος 3 m. Πόσα m² λαμαρίνας απαιτούνται για την κατασκευή της; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['37,68 m²', '50,24 m²', '75,36 m²', '25,12 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Παράπλευρη', value: '2 · 3,14 · 2 · 3 ＝ 37,68 m²' },
        { label: '2 βάσεις', value: '2 · (3,14 · 4) ＝ 25,12 m²' },
        { label: 'Σύνολο', value: '37,68 ＋ 25,12 ＝ 62,8 m²' }
      ],
      explanation: `37,68 ＋ 25,12 ＝ 62,8 m².`
    };
  },
  // 5. Κύλινδρος με διάμετρο 6 cm (ακτίνα 3 cm) και ύψος 8 cm
  () => {
    const r = 3;
    const h = 8;
    const lat = 2 * 3.14 * 3 * 8; // 150.72 cm²
    const twoBases = 2 * (3.14 * 9); // 56.52 cm²
    const total = lat + twoBases; // 207.24 cm²
    const correct = '207,24 cm²';
    return {
      title: 'ΚΛΕΙΣΤΟ ΔΟΧΕΙΟ',
      prompt: `Ένα κλειστό κυλινδρικό κουτί έχει διάμετρο 6 cm και ύψος 8 cm. Πόσο είναι το ολικό εμβαδόν του; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['150,72 cm²', '178,98 cm²', '235,5 cm²', '56,52 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Ακτίνα', value: '6 : 2 ＝ 3 cm' },
        { label: 'Παράπλευρη', value: '2 · 3,14 · 3 · 8 ＝ 150,72 cm²' },
        { label: '2 βάσεις', value: '2 · (3,14 · 9) ＝ 56,52 cm²' },
        { label: 'Ολικό', value: '150,72 ＋ 56,52 ＝ 207,24 cm²' }
      ],
      explanation: `ρ ＝ 3 cm. Εολ ＝ 150,72 ＋ 56,52 ＝ 207,24 cm².`
    };
  },
  // 6. Κύλινδρος με ακτίνα 1 cm και ύψος 5 cm
  () => {
    const r = 1;
    const h = 5;
    const lat = 2 * 3.14 * 1 * 5; // 31.4 cm²
    const twoBases = 2 * (3.14 * 1); // 6.28 cm²
    const total = lat + twoBases; // 37.68 cm²
    const correct = '37,68 cm²';
    return {
      title: 'ΜΙΚΡΟΣ ΚΥΛΙΝΔΡΟΣ',
      prompt: `Ποιο είναι το ολικό εμβαδόν ενός κλειστού κυλίνδρου με ακτίνα 1 cm και ύψος 5 cm; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['31,4 cm²', '34,54 cm²', '43,96 cm²', '62,8 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Παράπλευρη', value: '2 · 3,14 · 1 · 5 ＝ 31,4 cm²' },
        { label: '2 βάσεις', value: '2 · 3,14 ＝ 6,28 cm²' },
        { label: 'Ολικό εμβαδόν', value: '31,4 ＋ 6,28 ＝ 37,68 cm²' }
      ],
      explanation: `Εολ ＝ 31,4 ＋ 6,28 ＝ 37,68 cm².`
    };
  }
];

// POOL ΓΙΑ Q11: Ανοιχτά Δοχεία (1 Μόνο Βάση: Εολ ＝ Επ ＋ Εβ)
const PROBLEM_POOL_Q11 = [
  // 1. Κυλινδρικός κουβάς (ανοιχτός από πάνω)
  () => {
    const r = 10; // cm
    const h = 20; // cm
    const lat = 2 * 3.14 * 10 * 20; // 1256 cm²
    const oneBase = 3.14 * 100; // 314 cm²
    const total = lat + oneBase; // 1570 cm²
    const correct = `${formatNum(total)} cm²`;
    return {
      title: 'ΑΝΟΙΧΤΟΣ ΚΟΥΒΑΣ',
      prompt: `Ένας πλαστικός κυλινδρικός κουβάς είναι ανοιχτός από πάνω (δεν έχει καπάκι). Έχει ακτίνα βάσης 10 cm και ύψος 20 cm. Πόση είναι η συνολική επιφάνεια του πλαστικού; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => [
        '1.256 cm²',
        '1.884 cm²',
        '1.570 cm² (2)',
        '314 cm²'
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Παράπλευρη επιφάνεια (Επ)', value: '2 · 3,14 · 10 · 20 ＝ 1.256 cm²' },
        { label: 'Εμβαδόν 1 βάσης (πάτος)', value: '3,14 · 10 · 10 ＝ 314 cm²' },
        { label: 'Σύνολο (χωρίς καπάκι)', value: '1.256 ＋ 314 ＝ 1.570 cm²' }
      ],
      explanation: `Επειδή ο κουβάς είναι ανοιχτός από πάνω, προσθέτουμε μόνο 1 βάση (τον πάτο): Εολ ＝ Επ ＋ Εβ ＝ 1.256 ＋ 314 ＝ 1.570 cm².`
    };
  },
  // 2. Κυλινδρικό ποτήρι
  () => {
    const r = 4; // cm
    const h = 10; // cm
    const lat = 2 * 3.14 * 4 * 10; // 251.2 cm²
    const oneBase = 3.14 * 16; // 50.24 cm²
    const total = lat + oneBase; // 301.44 cm²
    const correct = '301,44 cm²';
    return {
      title: 'ΓΥΑΛΙΝΟ ΠΟΤΗΡΙ',
      prompt: `Ένα κυλινδρικό ποτήρι (ανοιχτό από πάνω) έχει ακτίνα βάσης 4 cm και ύψος 10 cm. Πόση είναι η εξωτερική επιφάνεια του γυαλιού; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['251,2 cm²', '351,68 cm²', '300 cm²', '50,24 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Παράπλευρη επιφάνεια', value: '251,2 cm²' },
        { label: '1 βάση (πάτος)', value: '50,24 cm²' },
        { label: 'Σύνολο', value: '251,2 ＋ 50,24 ＝ 301,44 cm²' }
      ],
      explanation: `251,2 ＋ 50,24 ＝ 301,44 cm² (μόνο 1 βάση).`
    };
  },
  // 3. Κυλινδρικό μολυβοθήκη
  () => {
    const r = 5; // cm
    const h = 12; // cm
    const lat = 2 * 3.14 * 5 * 12; // 376.8 cm²
    const oneBase = 3.14 * 25; // 78.5 cm²
    const total = lat + oneBase; // 455.3 cm²
    const correct = '455,3 cm²';
    return {
      title: 'ΜΟΛΥΒΟΘΗΚΗ ΧΩΡΙΣ ΚΑΠΑΚΙ',
      prompt: `Μια κυλινδρική μολυβοθήκη έχει ακτίνα βάσης 5 cm και ύψος 12 cm. Πόσο χαρτόνι χρειάστηκε για την κατασκευή της (βάση και πλαϊνή επιφάνεια); (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['376,8 cm²', '533,8 cm²', '400 cm²', '78,5 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Πλαϊνή επιφάνεια', value: '376,8 cm²' },
        { label: 'Πάτος (1 βάση)', value: '78,5 cm²' },
        { label: 'Σύνολο', value: '376,8 ＋ 78,5 ＝ 455,3 cm²' }
      ],
      explanation: `376,8 ＋ 78,5 ＝ 455,3 cm².`
    };
  },
  // 4. Κυλινδρικό βάζο
  () => {
    const r = 6;
    const h = 15;
    const lat = 2 * 3.14 * 6 * 15; // 565.2 cm²
    const oneBase = 3.14 * 36; // 113.04 cm²
    const total = lat + oneBase; // 678.24 cm²
    const correct = '678,24 cm²';
    return {
      title: 'ΚΥΛΙΝΔΡΙΚΟ ΒΑΖΟ',
      prompt: `Ένα ανοιχτό κεραμικό βάζο έχει ακτίνα 6 cm και ύψος 15 cm. Πόσο είναι το συνολικό εξωτερικό του εμβαδόν; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['565,2 cm²', '791,28 cm²', '113,04 cm²', '650 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Παράπλευρη', value: '565,2 cm²' },
        { label: '1 βάση', value: '113,04 cm²' },
        { label: 'Ολικό', value: '565,2 ＋ 113,04 ＝ 678,24 cm²' }
      ],
      explanation: `565,2 ＋ 113,04 ＝ 678,24 cm².`
    };
  },
  // 5. Ανοιχτό δοχείο νερού
  () => {
    const r = 0.5; // m
    const h = 1; // m
    const lat = 2 * 3.14 * 0.5 * 1; // 3.14 m²
    const oneBase = 3.14 * 0.25; // 0.785 m²
    const total = lat + oneBase; // 3.925 m²
    const correct = '3,925 m²';
    return {
      title: 'ΑΝΟΙΧΤΟ ΔΟΧΕΙΟ ΝΕΡΟΥ',
      prompt: `Ένα ανοιχτό κυλινδρικό δοχείο νερού έχει ακτίνα 0,5 m και ύψος 1 m. Πόσα τετραγωνικά μέτρα (m²) λαμαρίνας χρειάστηκαν για την κατασκευή του (πυθμένας και πλαϊνά); (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['3,14 m²', '4,71 m²', '0,785 m²', '3,5 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Παράπλευρη', value: '3,14 m²' },
        { label: 'Πυθμένας', value: '0,785 m²' },
        { label: 'Σύνολο', value: '3,14 ＋ 0,785 ＝ 3,925 m²' }
      ],
      explanation: `3,14 ＋ 0,785 ＝ 3,925 m².`
    };
  },
  // 6. Κυλινδρικό καλάθι αχρήστων
  () => {
    const r = 10;
    const h = 30;
    const lat = 2 * 3.14 * 10 * 30; // 1884 cm²
    const oneBase = 3.14 * 100; // 314 cm²
    const total = lat + oneBase; // 2198 cm²
    const correct = `${formatNum(total)} cm²`;
    return {
      title: 'ΚΑΛΑΘΙ ΑΧΡΗΣΤΩΝ',
      prompt: `Ένα κυλινδρικό καλάθι αχρήστων χωρίς καπάκι έχει ακτίνα 10 cm και ύψος 30 cm. Πόση είναι η επιφάνειά του; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['1.884 cm²', '2.512 cm²', '314 cm²', '2.000 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Παράπλευρη', value: '1.884 cm²' },
        { label: '1 βάση', value: '314 cm²' },
        { label: 'Σύνολο', value: '1.884 ＋ 314 ＝ 2.198 cm²' }
      ],
      explanation: `1.884 ＋ 314 ＝ 2.198 cm².`
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα, Αναλογίες & Μετατροπές Μονάδων
const PROBLEM_POOL_Q12 = [
  // 1. Διπλασιασμός ύψους κυλίνδρου
  () => {
    const correct = 'Η παράπλευρη επιφάνεια διπλασιάζεται';
    return {
      title: 'ΜΕΤΑΒΟΛΗ ΥΨΟΥΣ ΚΥΛΙΝΔΡΟΥ',
      prompt: `Αν διατηρήσουμε σταθερή την ακτίνα ενός κυλίνδρου και διπλασιάσουμε μόνο το ύψος του (2 · υ), πώς θα μεταβληθεί η παράπλευρη επιφάνειά του;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Η παράπλευρη επιφάνεια τετραπλασιάζεται',
        'Η παράπλευρη επιφάνεια παραμένει η ίδια',
        'Η παράπλευρη επιφάνεια υποδιπλασιάζεται'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Αρχική παράπλευρη', value: 'Επ₁ ＝ (2 · π · ρ) · υ' },
        { label: 'Νέα παράπλευρη', value: 'Επ₂ ＝ (2 · π · ρ) · (2 · υ) ＝ 2 · Επ₁' }
      ],
      explanation: `Επειδή το ύψος δεν είναι υψωμένο σε δύναμη στον τύπο Επ ＝ (2 · π · ρ) · υ, ο διπλασιασμός του ύψους απλώς διπλασιάζει την παράπλευρη επιφάνεια.`
    };
  },
  // 2. Μετατροπή παράπλευρης επιφάνειας σε dm²
  () => {
    const correct = '12,56 dm²';
    return {
      title: 'ΜΕΤΑΤΡΟΠΗ ΣΕ DM²',
      prompt: `Η παράπλευρη επιφάνεια ενός κυλίνδρου είναι 1.256 cm². Πόσα τετραγωνικά δεκατόμετρα (dm²) είναι αυτή η επιφάνεια;`,
      options: ensureFourUniqueOptions(correct, () => ['125,6 dm²', '1,256 dm²', '1256 dm²', '0,1256 dm²']),
      correctAnswer: correct,
      unit: 'dm²',
      tableData: [
        { label: 'Επιφάνεια σε cm²', value: '1.256 cm²' },
        { label: 'Σχέση cm² με dm²', value: '1 dm² ＝ 100 cm²' },
        { label: 'Πράξη (: 100)', value: '1.256 : 100 ＝ 12,56 dm²' }
      ],
      explanation: `1.256 : 100 ＝ 12,56 dm².`
    };
  },
  // 3. Διπλασιασμός ακτίνας βάσης
  () => {
    const correct = 'Το εμβαδόν της βάσης τετραπλασιάζεται';
    return {
      title: 'ΔΙΠΛΑΣΙΑΣΜΟΣ ΑΚΤΙΝΑΣ ΒΑΣΗΣ',
      prompt: `Αν διπλασιάσουμε την ακτίνα ρ της βάσης ενός κυλίνδρου, πώς αλλάζει το εμβαδόν της κυκλικής βάσης;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Το εμβαδόν της βάσης διπλασιάζεται',
        'Το εμβαδόν της βάσης παραμένει ίδιο',
        'Το εμβαδόν της βάσης οκταπλασιάζεται'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Τύπος βάσης', value: 'Εβ ＝ π · ρ²' },
        { label: 'Νέα βάση (2ρ)', value: 'π · (2ρ)² ＝ π · 4ρ² ＝ 4 · Εβ' }
      ],
      explanation: `Αφού η ακτίνα είναι στο τετράγωνο (ρ²), ο διπλασιασμός της ακτίνας τετραπλασιάζει το εμβαδόν της βάσης (2 · 2 ＝ 4).`
    };
  },
  // 4. Κόστος βαφής παράπλευρης επιφάνειας
  () => {
    const latM2 = 10;
    const pricePerM2 = 4;
    const cost = latM2 * pricePerM2; // 40 €
    const correct = '40 €';
    return {
      title: 'ΚΟΣΤΟΣ ΒΑΦΗΣ ΣΙΛΟ',
      prompt: `Ένα κυλινδρικό σιλό έχει παράπλευρη επιφάνεια 10 m². Αν το κόστος βαφής είναι 4 € ανά τετραγωνικό μέτρο (m²), πόσο θα κοστίσει το βάψιμο της πλαϊνής επιφάνειας;`,
      options: ensureFourUniqueOptions(correct, () => ['14 €', '20 €', '400 €', '80 €']),
      correctAnswer: correct,
      unit: '€',
      tableData: [
        { label: 'Επιφάνεια προς βαφή', value: '10 m²' },
        { label: 'Τιμή ανά m²', value: '4 €' },
        { label: 'Συνολικό κόστος', value: '10 · 4 ＝ 40 €' }
      ],
      explanation: `10 · 4 € ＝ 40 €.`
    };
  },
  // 5. Σύγκριση δύο κυλίνδρων με ίδιο ύψος
  () => {
    const correct = 'Ο κύλινδρος Β έχει 2 φορές μεγαλύτερη παράπλευρη επιφάνεια';
    return {
      title: 'ΣΥΓΚΡΙΣΗ ΔΥΟ ΚΥΛΙΝΔΡΩΝ',
      prompt: `Ο κύλινδρος Α έχει ακτίνα 3 cm και ύψος 10 cm. Ο κύλινδρος Β έχει ακτίνα 6 cm και το ίδιο ύψος 10 cm. Ποια είναι η σχέση των παράπλευρων επιφανειών τους;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Ο κύλινδρος Β έχει 4 φορές μεγαλύτερη παράπλευρη επιφάνεια',
        'Έχουν ακριβώς την ίδια παράπλευρη επιφάνεια',
        'Ο κύλινδρος Α έχει μεγαλύτερη επιφάνεια'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Επ κυλίνδρου Α', value: '2 · π · 3 · 10 ＝ 60π' },
        { label: 'Επ κυλίνδρου Β', value: '2 · π · 6 · 10 ＝ 120π ＝ 2 · Επ_Α' }
      ],
      explanation: `Αφού η ακτίνα διπλασιάστηκε και το ύψος έμεινε ίδιο, η παράπλευρη επιφάνεια διπλασιάζεται.`
    };
  },
  // 6. Πόσο μήκος έχει το ορθογώνιο του αναπτύγματος όταν δίνεται η περίμετρος
  () => {
    const correct = '31,4 cm';
    return {
      title: 'ΜΗΚΟΣ ΟΡΘΟΓΩΝΙΟΥ ΑΝΑΠΤΥΓΜΑΤΟΣ',
      prompt: `Το ανάπτυγμα ενός κυλίνδρου με ακτίνα βάσης ρ ＝ 5 cm έχει ως παράπλευρη επιφάνεια ένα ορθογώνιο. Πόσο είναι το μήκος αυτού του ορθογωνίου; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['78,5 cm', '15,7 cm', '62,8 cm', '10 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Τύπος μήκους ορθογωνίου', value: 'Περίμετρος βάσης ＝ 2 · π · ρ' },
        { label: 'Υπολογισμός', value: '2 · 3,14 · 5 ＝ 31,4 cm' }
      ],
      explanation: `Το μήκος του ορθογωνίου ισούται με την περίμετρο της βάσης: 2 · 3,14 · 5 ＝ 31,4 cm.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Στοιχεία κυλίνδρου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΣΤΟΙΧΕΙΑ ΚΥΛΙΝΔΡΟΥ',
    prompt: isQ1True
      ? 'Ο κύλινδρος αποτελείται από 2 παράλληλες κυκλικές βάσεις και 1 καμπύλη παράπλευρη επιφάνεια.'
      : 'Ο κύλινδρος είναι πολύεδρο και έχει 6 επίπεδες έδρες, 12 ακμές και 8 κορυφές.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Βάσεις', value: '2 ίσοι παράλληλοι κυκλικοί δίσκοι (ακτίνας ρ)' },
      { label: 'Παράπλευρη', value: '1 καμπύλη επιφάνεια ύψους υ' }
    ],
    explanation: isQ1True
      ? 'Ο κύλινδρος έχει πράγματι 2 κυκλικές βάσεις και 1 καμπύλη παράπλευρη επιφάνεια.'
      : 'Ο κύλινδρος δεν είναι πολύεδρο (είναι σώμα εκ περιστροφής) και δεν έχει ευθύγραμμες ακμές ή κορυφές.'
  });

  // Q2: Τι σχήμα έχει η παράπλευρη επιφάνεια στο ανάπτυγμα (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΠΑΡΑΠΛΕΥΡΗ ΣΤΟ ΑΝΑΠΤΥΓΜΑ',
    prompt: 'Όταν ανοίξουμε (ξετυλίξουμε) την παράπλευρη επιφάνεια ενός κυλίνδρου, τι σχήμα παίρνει;',
    options: ensureFourUniqueOptions('Ορθογώνιο παραλληλόγραμμο', () => [
      'Τρίγωνο',
      'Κυκλικός τομέας',
      'Τραπέζιο'
    ]),
    correctAnswer: 'Ορθογώνιο παραλληλόγραμμο',
    tableData: [
      { label: 'Σχήμα παράπλευρης', value: 'Ορθογώνιο παραλληλόγραμμο' },
      { label: 'Διαστάσεις', value: 'Μήκος ＝ 2 · π · ρ &nbsp;|&nbsp; Πλάτος ＝ υ' }
    ],
    explanation: 'Όταν ξετυλίγεται η παράπλευρη επιφάνεια ενός κυλίνδρου, σχηματίζει πάντα ένα ορθογώνιο παραλληλόγραμμο.'
  });

  // Q3: Μήκος ορθογωνίου αναπτύγματος (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΜΗΚΟΣ ΟΡΘΟΓΩΝΙΟΥ',
    prompt: 'Με τι ισούται το μήκος του ορθογωνίου στο ανάπτυγμα ενός κυλίνδρου;',
    options: ensureFourUniqueOptions('Με την περίμετρο της κυκλικής βάσης: 2 · π · ρ', () => [
      'Με το εμβαδόν της βάσης: π · ρ²',
      'Με τη διάμετρο του κύκλου',
      'Με το ύψος του κυλίνδρου'
    ]),
    correctAnswer: 'Με την περίμετρο της κυκλικής βάσης: 2 · π · ρ',
    tableData: [
      { label: 'Μήκος ορθογωνίου', value: 'Περίμετρος κύκλου ＝ 2 · π · ρ' }
    ],
    explanation: 'Το μήκος του ορθογωνίου «αγκαλιάζει» ακριβώς τον κύκλο της βάσης, άρα ισούται με την περίμετρό του: 2 · π · ρ.'
  });

  // Q4: Οπτική αναγνώριση αναπτύγματος (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΑΝΑΓΝΩΡΙΣΗ ΑΝΑΠΤΥΓΜΑΤΟΣ ΚΥΛΙΝΔΡΟΥ',
    prompt: 'Παρατηρήστε το παρακάτω σχήμα. Ποιο γεωμετρικό στερεό σχηματίζεται αν το διπλώσουμε;',
    svg: (
      <svg viewBox="0 0 160 120" className="w-40 h-28 mx-auto my-2 select-none drop-shadow-sm">
        {/* Πάνω κύκλος */}
        <circle cx="80" cy="22" r="16" fill="#a7f3d0" stroke="#059669" strokeWidth="1.5" />
        {/* Ορθογώνιο */}
        <rect x="35" y="42" width="90" height="36" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" rx="2" />
        {/* Κάτω κύκλος */}
        <circle cx="80" cy="98" r="16" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="1.5" />
      </svg>
    ),
    options: ensureFourUniqueOptions('Κύλινδρος με 2 κυκλικές βάσεις', () => [
      'Κώνος',
      'Κύβος',
      'Ορθογώνιο παραλληλεπίπεδο'
    ]),
    correctAnswer: 'Κύλινδρος με 2 κυκλικές βάσεις',
    tableData: [
      { label: 'Ανάπτυγμα', value: '1 ορθογώνιο και 2 ίσοι κυκλικοί δίσκοι' },
      { label: 'Στερεό', value: 'Κύλινδρος' }
    ],
    explanation: 'Το ανάπτυγμα που αποτελείται από ένα ορθογώνιο παραλληλόγραμμο και δύο ίσους κύκλους ανήκει στον κύλινδρο.'
  });

  // Q5: Υπολογισμός εμβαδού μίας βάσης (Input αριθμού)
  // ρ = 10 cm => Εβ = 3,14 * 100 = 314
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΕΜΒΑΔΟΝ ΒΑΣΗΣ ΚΥΛΙΝΔΡΟΥ (Ρ = 10 CM)',
    prompt: 'Ένας κύλινδρος έχει ακτίνα βάσης ρ ＝ 10 cm. Πόσα cm² είναι το εμβαδόν της μίας κυκλικής βάσης του; (π ＝ 3,14 - Γράψτε μόνο τον αριθμό)',
    correctAnswer: '314',
    tableData: [
      { label: 'Ακτίνα (ρ)', value: '10 cm' },
      { label: 'Τύπος βάσης', value: 'Εβ ＝ π · ρ²' },
      { label: 'Υπολογισμός', value: '3,14 · 10 · 10 ＝ 314 cm²' }
    ],
    explanation: `Εβ ＝ 3,14 · 10 · 10 ＝ 314 cm².`
  });

  // Q6: Υπολογισμός εμβαδού 2 βάσεων (Input αριθμού)
  // ρ = 2 cm => Εβ = 3.14 * 4 = 12.56 => 2 * Εβ = 25.12
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΕΜΒΑΔΟΝ ΚΑΙ ΤΩΝ ΔΥΟ ΒΑΣΕΩΝ (Ρ = 2 CM)',
    prompt: 'Ένας κύλινδρος έχει ακτίνα βάσης ρ ＝ 2 cm. Πόσα cm² είναι συνολικά το εμβαδόν και των δύο βάσεών του μαζί; (π ＝ 3,14)',
    correctAnswer: '25,12',
    tableData: [
      { label: 'Εμβαδόν 1 βάσης', value: '3,14 · 2 · 2 ＝ 12,56 cm²' },
      { label: 'Εμβαδόν 2 βάσεων', value: '2 · 12,56 ＝ 25,12 cm²' }
    ],
    explanation: `2 · (3,14 · 2 · 2) ＝ 2 · 12,56 ＝ 25,12 cm².`
  });

  // Q7: Τύπος ολικής επιφάνειας κλειστού κυλίνδρου (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΤΥΠΟΣ ΟΛΙΚΟΥ ΕΜΒΑΔΟΥ',
    prompt: 'Πώς υπολογίζουμε το ολικό εμβαδόν (Εολ) ενός κλειστού κυλίνδρου;',
    options: ensureFourUniqueOptions('Εολ ＝ Επ ＋ 2 · Εβ (παράπλευρη επιφάνεια συν 2 βάσεις)', () => [
      'Εολ ＝ Επ ＋ Εβ (παράπλευρη συν μία μόνο βάση)',
      'Εολ ＝ Επ · Εβ',
      'Εολ ＝ 2 · π · ρ · υ'
    ]),
    correctAnswer: 'Εολ ＝ Επ ＋ 2 · Εβ (παράπλευρη επιφάνεια συν 2 βάσεις)',
    tableData: [
      { label: 'Ολικό εμβαδόν', value: 'Εολ ＝ Επ ＋ 2 · Εβ' },
      { label: 'Αναλυτικά', value: '(2 · π · ρ · υ) ＋ 2 · (π · ρ²)' }
    ],
    explanation: 'Σε έναν κλειστό κύλινδρο προσθέτουμε την παράπλευρη επιφάνεια και τις δύο κυκλικές βάσεις: Εολ ＝ Επ ＋ 2 · Εβ.'
  });

  // Q8: Τύπος παράπλευρης επιφάνειας (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΤΥΠΟΣ ΠΑΡΑΠΛΕΥΡΗΣ ΕΠΙΦΑΝΕΙΑΣ',
    prompt: 'Ποιος είναι ο τύπος για την παράπλευρη επιφάνεια (Επ) του κυλίνδρου;',
    options: ensureFourUniqueOptions('Επ ＝ (2 · π · ρ) · υ', () => [
      'Επ ＝ (π · ρ²) · υ',
      'Επ ＝ 2 · π · ρ²',
      'Επ ＝ π · ρ · υ'
    ]),
    correctAnswer: 'Επ ＝ (2 · π · ρ) · υ',
    tableData: [
      { label: 'Παράπλευρη επιφάνεια', value: 'Μήκος ορθογωνίου · Ύψος ＝ (2 · π · ρ) · υ' }
    ],
    explanation: 'Το εμβαδόν του ορθογωνίου της παράπλευρης επιφάνειας είναι βάση επί ύψος: Επ ＝ (2 · π · ρ) · υ.'
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

export default function KilindrosAskiseisPage() {
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
      title="Ασκήσεις: Κύλινδρος - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στον κύλινδρο, το ανάπτυγμά του, την παράπλευρη και την ολική επιφάνεια για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/79-kilindros"
      backText="Θεωρία Κεφ. 79"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/79-kilindros"
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
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 79 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Ο Κυλινδρος και τα Εμβαδα του')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στο ανάπτυγμα του κυλίνδρου, στον υπολογισμό εμβαδού βάσεων (π · ρ²), παράπλευρης επιφάνειας [(2 · π · ρ) · υ] και ολικού εμβαδού μέσα από 12 δυναμικές ερωτήσεις.
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

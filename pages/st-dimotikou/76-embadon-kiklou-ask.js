// pages/st-dimotikou/76-embadon-kiklou-ask.js
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

// POOL ΓΙΑ Q9: Υπολογισμός Εμβαδού από Ακτίνα ή Διάμετρο (Ε ＝ π · α²)
const PROBLEM_POOL_Q9 = [
  // 1. Στρογγυλό τραπέζι με διάμετρο
  () => {
    const r = randInt(2, 6);
    const d = 2 * r;
    const rSquared = r * r;
    const area = 3.14 * rSquared;
    const correct = `${formatNum(area)} m²`;
    return {
      title: 'ΣΤΡΟΓΓΥΛΟ ΤΡΑΠΕΖΙ',
      prompt: `Ένα στρογγυλό τραπέζι έχει διάμετρο ${d} m. Πόσο είναι το εμβαδόν της επιφάνειάς του σε m²; (Χρησιμοποιήστε π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(3.14 * d * d)} m²`,
        `${formatNum(2 * 3.14 * r)} m²`,
        `${formatNum(area + 5)} m²`,
        `${formatNum(area - 3 > 0 ? area - 3 : area + 8)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Διάμετρος (δ)', value: `${d} m` },
        { label: 'Ακτίνα (α ＝ δ : 2)', value: `${d} : 2 ＝ ${r} m` },
        { label: 'Τετράγωνο ακτίνας (α²)', value: `${r} · ${r} ＝ ${rSquared} m²` },
        { label: 'Πράξη', value: `Ε ＝ 3,14 · ${rSquared} ＝ ${formatNum(area)} m²` }
      ],
      explanation: `Βρίσκουμε πρώτα την ακτίνα: α ＝ ${d} : 2 ＝ ${r} m. Εμβαδόν: Ε ＝ π · α² ＝ 3,14 · ${r} · ${r} ＝ ${formatNum(area)} m².`
    };
  },
  // 2. Κυκλικό σιντριβάνι με ακτίνα
  () => {
    const r = randInt(3, 8);
    const rSquared = r * r;
    const area = 3.14 * rSquared;
    const correct = `${formatNum(area)} m²`;
    return {
      title: 'ΚΥΚΛΙΚΟ ΣΙΝΤΡΙΒΑΝΙ',
      prompt: `Ένα κυκλικό σιντριβάνι έχει ακτίνα ${r} m. Ποια είναι η επιφάνεια που καταλαμβάνει στην πλατεία; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(2 * 3.14 * r)} m²`,
        `${formatNum(area + 12)} m²`,
        `${formatNum(area - 10 > 0 ? area - 10 : area + 20)} m²`,
        `${formatNum(area * 2)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Ακτίνα (α)', value: `${r} m` },
        { label: 'Τετράγωνο ακτίνας', value: `${r} · ${r} ＝ ${rSquared}` },
        { label: 'Εμβαδόν', value: `3,14 · ${rSquared} ＝ ${formatNum(area)} m²` }
      ],
      explanation: `Ε ＝ π · α² ＝ 3,14 · ${r} · ${r} ＝ ${formatNum(area)} m².`
    };
  },
  // 3. Στρογγυλό ρολόι τοίχου
  () => {
    const r = 10; // cm
    const area = 3.14 * 100; // 314
    const correct = '314 cm²';
    return {
      title: 'ΡΟΛΟΙ ΤΟΙΧΟΥ',
      prompt: `Ένα στρογγυλό ρολόι τοίχου έχει ακτίνα 10 cm. Πόσο είναι το εμβαδόν του καντράν του; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['62,8 cm²', '31,4 cm²', '628 cm²', '157 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Ακτίνα', value: '10 cm' },
        { label: 'Τετράγωνο ακτίνας', value: '10 · 10 ＝ 100 cm²' },
        { label: 'Πράξη', value: '3,14 · 100 ＝ 314 cm²' }
      ],
      explanation: `Ε ＝ 3,14 · 10 · 10 ＝ 3,14 · 100 ＝ 314 cm².`
    };
  },
  // 4. Κυκλική πίτσα
  () => {
    const d = 30; // cm => r = 15
    const r = 15;
    const area = 3.14 * r * r; // 706.5
    const correct = '706,5 cm²';
    return {
      title: 'ΕΠΙΦΑΝΕΙΑ ΠΙΤΣΑΣ',
      prompt: `Μια οικογενειακή πίτσα έχει διάμετρο 30 cm. Πόσο είναι το εμβαδόν της επιφάνειάς της; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['2.826 cm²', '94,2 cm²', '353,25 cm²', '450 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Διάμετρος', value: '30 cm' },
        { label: 'Ακτίνα', value: '30 : 2 ＝ 15 cm' },
        { label: 'Πράξη', value: '3,14 · 15 · 15 ＝ 3,14 · 225 ＝ 706,5 cm²' }
      ],
      explanation: `Ακτίνα: 30 : 2 ＝ 15 cm. Ε ＝ 3,14 · 15 · 15 ＝ 706,5 cm².`
    };
  },
  // 5. Μεταλλικό καπάκι φρεατίου
  () => {
    const d = 60; // cm => r = 30
    const area = 3.14 * 30 * 30; // 2826
    const correct = `${formatNum(area)} cm²`;
    return {
      title: 'ΚΑΠΑΚΙ ΦΡΕΑΤΙΟΥ',
      prompt: `Ένα στρογγυλό καπάκι φρεατίου έχει διάμετρο 60 cm. Πόσο είναι το εμβαδόν του σε cm²; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['11.304 cm²', '188,4 cm²', '1.413 cm²', '3.600 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Διάμετρος', value: '60 cm' },
        { label: 'Ακτίνα', value: '60 : 2 ＝ 30 cm' },
        { label: 'Πράξη', value: '3,14 · 30 · 30 ＝ 3,14 · 900 ＝ 2.826 cm²' }
      ],
      explanation: `α ＝ 60 : 2 ＝ 30 cm. Ε ＝ 3,14 · 900 ＝ 2.826 cm².`
    };
  },
  // 6. Κυκλικός δίσκος κοπής
  () => {
    const r = 20; // cm
    const area = 3.14 * 20 * 20; // 1256
    const correct = `${formatNum(area)} cm²`;
    return {
      title: 'ΚΥΚΛΙΚΟΣ ΔΙΣΚΟΣ',
      prompt: `Ένας κυκλικός δίσκος έχει ακτίνα 20 cm. Ποιο είναι το εμβαδόν του σε cm²; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['125,6 cm²', '628 cm²', '2.512 cm²', '400 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Ακτίνα', value: '20 cm' },
        { label: 'Πράξη', value: '3,14 · 20 · 20 ＝ 3,14 · 400 ＝ 1.256 cm²' }
      ],
      explanation: `Ε ＝ 3,14 · 20 · 20 ＝ 1.256 cm².`
    };
  }
];

// POOL ΓΙΑ Q10: Ημικύκλιο και Τέταρτο Κύκλου
const PROBLEM_POOL_Q10 = [
  // 1. Ημικύκλιο με δοσμένη ακτίνα
  () => {
    const r = 10;
    const fullArea = 3.14 * r * r; // 314
    const semiArea = fullArea / 2; // 157
    const correct = `${formatNum(semiArea)} cm²`;
    return {
      title: 'ΕΜΒΑΔΟΝ ΗΜΙΚΥΚΛΙΟΥ',
      prompt: `Μια διακοσμητική βεντάλια έχει σχήμα ημικυκλίου με ακτίνα 10 cm. Πόσο είναι το εμβαδόν της επιφάνειάς της; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['314 cm²', '62,8 cm²', '78,5 cm²', '100 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Εμβαδόν ολόκληρου κύκλου', value: '3,14 · 10 · 10 ＝ 314 cm²' },
        { label: 'Εμβαδόν ημικυκλίου', value: '314 : 2 ＝ 157 cm²' }
      ],
      explanation: `Το ημικύκλιο είναι το μισό του κύκλου: (3,14 · 10 · 10) : 2 ＝ 314 : 2 ＝ 157 cm².`
    };
  },
  // 2. Ημικυκλική σήραγγα
  () => {
    const d = 12; // διάμετρος => r = 6
    const r = 6;
    const semiArea = (3.14 * r * r) / 2; // (3.14 * 36) / 2 = 56.52
    const correct = `${formatNum(semiArea)} m²`;
    return {
      title: 'ΗΜΙΚΥΚΛΙΚΗ ΣΗΡΑΓΓΑ',
      prompt: `Το άνοιγμα μιας σήραγγας έχει σχήμα ημικυκλίου με διάμετρο 12 m. Πόσο είναι το εμβαδόν του ανοίγματος; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => [
        '113,04 m²',
        '226,08 m²',
        '37,68 m²',
        '72 m²'
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Διάμετρος', value: '12 m' },
        { label: 'Ακτίνα', value: '12 : 2 ＝ 6 m' },
        { label: 'Εμβαδόν ημικυκλίου', value: '(3,14 · 6 · 6) : 2 ＝ 113,04 : 2 ＝ 56,52 m²' }
      ],
      explanation: `α ＝ 6 m. Εημικ ＝ (3,14 · 36) : 2 ＝ 56,52 m².`
    };
  },
  // 3. Ημικυκλικό παράθυρο
  () => {
    const d = 2; // m => r = 1 m
    const semiArea = (3.14 * 1 * 1) / 2; // 1.57 m²
    const correct = '1,57 m²';
    return {
      title: 'ΗΜΙΚΥΚΛΙΚΟ ΠΑΡΑΘΥΡΟ',
      prompt: `Ένα τοξωτό παράθυρο έχει σχήμα ημικυκλίου με διάμετρο 2 m (ακτίνα 1 m). Πόσα τετραγωνικά μέτρα (m²) τζαμιού χρειάζονται; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['3,14 m²', '6,28 m²', '0,785 m²', '2 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Ακτίνα', value: '1 m' },
        { label: 'Πράξη', value: '(3,14 · 1 · 1) : 2 ＝ 3,14 : 2 ＝ 1,57 m²' }
      ],
      explanation: `(3,14 · 1 · 1) : 2 ＝ 1,57 m².`
    };
  },
  // 4. Τέταρτο του κύκλου
  () => {
    const r = 20; // cm => full = 1256, quarter = 314
    const quarterArea = (3.14 * r * r) / 4;
    const correct = '314 cm²';
    return {
      title: 'ΤΕΤΑΡΤΟ ΚΥΚΛΟΥ',
      prompt: `Ένα κομμάτι πίτας αποτελεί το ένα τέταρτο (1/4) ενός κυκλικού δίσκου με ακτίνα 20 cm. Πόσο είναι το εμβαδόν του κομματιού; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['628 cm²', '157 cm²', '1.256 cm²', '31,4 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Ολόκληρος κύκλος', value: '3,14 · 20 · 20 ＝ 1.256 cm²' },
        { label: 'Τέταρτο κύκλου (: 4)', value: '1.256 : 4 ＝ 314 cm²' }
      ],
      explanation: `(3,14 · 20 · 20) : 4 ＝ 1.256 : 4 ＝ 314 cm².`
    };
  },
  // 5. Ημικύκλιο με ακτίνα 4 m
  () => {
    const r = 4;
    const semiArea = (3.14 * 16) / 2; // 25.12
    const correct = '25,12 m²';
    return {
      title: 'ΗΜΙΚΥΚΛΙΚΟ ΠΑΡΤΕΡΙ',
      prompt: `Ένα ημικυκλικό παρτέρι έχει ακτίνα 4 m. Ποια είναι η επιφάνειά του; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['50,24 m²', '12,56 m²', '16 m²', '24 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Ακτίνα', value: '4 m' },
        { label: 'Πράξη', value: '(3,14 · 4 · 4) : 2 ＝ 50,24 : 2 ＝ 25,12 m²' }
      ],
      explanation: `(3,14 · 16) : 2 ＝ 25,12 m².`
    };
  },
  // 6. Ημικυκλική πίστα χορού
  () => {
    const d = 10; // => r = 5
    const semiArea = (3.14 * 25) / 2; // 39.25
    const correct = '39,25 m²';
    return {
      title: 'ΗΜΙΚΥΚΛΙΚΗ ΣΚΗΝΗ',
      prompt: `Μια θεατρική σκηνή έχει σχήμα ημικυκλίου με διάμετρο 10 m. Πόσο είναι το εμβαδόν του δαπέδου της; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['78,5 m²', '157 m²', '31,4 m²', '25 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Διάμετρος', value: '10 m (ακτίνα 5 m)' },
        { label: 'Πράξη', value: '(3,14 · 5 · 5) : 2 ＝ 78,5 : 2 ＝ 39,25 m²' }
      ],
      explanation: `α ＝ 5 m. Ε ＝ (3,14 · 25) : 2 ＝ 39,25 m².`
    };
  }
];

// POOL ΓΙΑ Q11: Κυκλικός Δακτύλιος (Ροδέλα / Διάδρομος γύρω από Κύκλο)
const PROBLEM_POOL_Q11 = [
  // 1. Διάδρομος γύρω από πισίνα
  () => {
    const rSmall = 3;
    const rBig = 5;
    const areaBig = 3.14 * rBig * rBig; // 78.5
    const areaSmall = 3.14 * rSmall * rSmall; // 28.26
    const ringArea = areaBig - areaSmall; // 50.24
    const correct = `${formatNum(ringArea)} m²`;
    return {
      title: 'ΔΙΑΔΡΟΜΟΣ ΓΥΡΩ ΑΠΟ ΠΙΣΙΝΑ',
      prompt: `Γύρω από μια κυκλική πισίνα ακτίνας 3 m κατασκευάζεται διάδρομος, ώστε ο εξωτερικός κύκλος να έχει ακτίνα 5 m. Πόσο είναι το εμβαδόν μόνο του διαδρόμου; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => [
        '78,5 m²',
        '28,26 m²',
        '106,76 m²',
        '12,56 m²'
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Εμβαδόν μεγάλου κύκλου', value: '3,14 · 5 · 5 ＝ 78,5 m²' },
        { label: 'Εμβαδόν πισίνας (μικρού κύκλου)', value: '3,14 · 3 · 3 ＝ 28,26 m²' },
        { label: 'Εμβαδόν διαδρόμου (αφαίρεση)', value: '78,5 － 28,26 ＝ 50,24 m²' }
      ],
      explanation: `Αφαιρούμε το εμβαδόν του εσωτερικού κύκλου από το εμβαδόν του εξωτερικού: 78,5 － 28,26 ＝ 50,24 m².`
    };
  },
  // 2. Μεταλλική ροδέλα
  () => {
    const rBig = 10;
    const rSmall = 6;
    const areaBig = 3.14 * 100; // 314
    const areaSmall = 3.14 * 36; // 113.04
    const ringArea = areaBig - areaSmall; // 200.96
    const correct = `${formatNum(ringArea)} cm²`;
    return {
      title: 'ΜΕΤΑΛΛΙΚΗ ΡΟΔΕΛΑ',
      prompt: `Μια μεταλλική ροδέλα έχει εξωτερική ακτίνα 10 cm και μία κυκλική τρύπα στο κέντρο με ακτίνα 6 cm. Πόσο είναι το εμβαδόν της μεταλλικής επιφάνειας; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => [
        '314 cm²',
        '113,04 cm²',
        '50,24 cm²',
        '250 cm²'
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Εξωτερικός κύκλος', value: '3,14 · 10 · 10 ＝ 314 cm²' },
        { label: 'Εσωτερική τρύπα', value: '3,14 · 6 · 6 ＝ 113,04 cm²' },
        { label: 'Επιφάνεια ροδέλας', value: '314 － 113,04 ＝ 200,96 cm²' }
      ],
      explanation: `314 － 113,04 ＝ 200,96 cm².`
    };
  },
  // 3. Στίβος τρεξίματος
  () => {
    const rSmall = 20;
    const rBig = 30;
    const areaBig = 3.14 * 900; // 2826
    const areaSmall = 3.14 * 400; // 1256
    const ringArea = areaBig - areaSmall; // 1570
    const correct = `${formatNum(ringArea)} m²`;
    return {
      title: 'ΚΥΚΛΙΚΟΣ ΣΤΙΒΟΣ',
      prompt: `Ένας κυκλικός στίβος έχει εσωτερική ακτίνα 20 m και εξωτερική ακτίνα 30 m. Πόσο είναι το εμβαδόν της ζώνης του στίβου; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['2.826 m²', '1.256 m²', '3.140 m²', '1.000 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Μεγάλος κύκλος', value: '3,14 · 30 · 30 ＝ 2.826 m²' },
        { label: 'Μικρός κύκλος', value: '3,14 · 20 · 20 ＝ 1.256 m²' },
        { label: 'Δακτύλιος', value: '2.826 － 1.256 ＝ 1.570 m²' }
      ],
      explanation: `2.826 － 1.256 ＝ 1.570 m².`
    };
  },
  // 4. Κυκλικό σιντριβάνι με περιμετρικό διάδρομο
  () => {
    const rSmall = 2; // m
    const rBig = 4; // m
    const areaBig = 3.14 * 16; // 50.24
    const areaSmall = 3.14 * 4; // 12.56
    const ringArea = areaBig - areaSmall; // 37.68
    const correct = '37,68 m²';
    return {
      title: 'ΔΙΑΔΡΟΜΟΣ ΣΙΝΤΡΙΒΑΝΙΟΥ',
      prompt: `Γύρω από ένα σιντριβάνι ακτίνας 2 m κατασκευάζεται διάδρομος πλάτους 2 m (εξωτερική ακτίνα 4 m). Πόσο είναι το εμβαδόν του διαδρόμου; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['50,24 m²', '12,56 m²', '25,12 m²', '62,8 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Μεγάλος κύκλος (α ＝ 4)', value: '3,14 · 16 ＝ 50,24 m²' },
        { label: 'Μικρός κύκλος (α ＝ 2)', value: '3,14 · 4 ＝ 12,56 m²' },
        { label: 'Δακτύλιος', value: '50,24 － 12,56 ＝ 37,68 m²' }
      ],
      explanation: `50,24 － 12,56 ＝ 37,68 m².`
    };
  },
  // 5. CD / DVD δίσκος
  () => {
    const rBig = 6; // cm => area = 113.04
    const rSmall = 1; // cm => area = 3.14
    const ringArea = 3.14 * 36 - 3.14 * 1; // 113.04 - 3.14 = 109.9
    const correct = '109,9 cm²';
    return {
      title: 'ΕΠΙΦΑΝΕΙΑ ΟΠΤΙΚΟΥ ΔΙΣΚΟΥ (CD)',
      prompt: `Ένας οπτικός δίσκος CD έχει εξωτερική ακτίνα 6 cm και στο κέντρο του υπάρχει τρύπα ακτίνας 1 cm. Πόση είναι η επιφάνεια εγγραφής δεδομένων; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['113,04 cm²', '3,14 cm²', '100 cm²', '120 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Εξωτερικός κύκλος', value: '3,14 · 36 ＝ 113,04 cm²' },
        { label: 'Τρύπα', value: '3,14 · 1 ＝ 3,14 cm²' },
        { label: 'Επιφάνεια εγγραφής', value: '113,04 － 3,14 ＝ 109,9 cm²' }
      ],
      explanation: `113,04 － 3,14 ＝ 109,9 cm².`
    };
  },
  // 6. Κορνίζα κυκλικού καθρέφτη
  () => {
    const rSmall = 10;
    const rBig = 12;
    const ringArea = 3.14 * 144 - 3.14 * 100; // 452.16 - 314 = 138.16
    const correct = '138,16 cm²';
    return {
      title: 'ΚΥΚΛΙΚΗ ΚΟΡΝΙΖΑ',
      prompt: `Ένας στρογγυλός καθρέφτης έχει ακτίνα 10 cm και περιβάλλεται από ξύλινη κορνίζα, ώστε η εξωτερική ακτίνα να είναι 12 cm. Πόσο είναι το εμβαδόν μόνο της κορνίζας; (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['452,16 cm²', '314 cm²', '150 cm²', '125,6 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Μεγάλος κύκλος (α ＝ 12)', value: '3,14 · 144 ＝ 452,16 cm²' },
        { label: 'Καθρέφτης (α ＝ 10)', value: '3,14 · 100 ＝ 314 cm²' },
        { label: 'Κορνίζα', value: '452,16 － 314 ＝ 138,16 cm²' }
      ],
      explanation: `452,16 － 314 ＝ 138,16 cm².`
    };
  }
];

// POOL ΓΙΑ Q12: Σύγκριση Σχημάτων & Μεταβολή Ακτίνας
const PROBLEM_POOL_Q12 = [
  // 1. Διπλασιασμός ακτίνας (τετραπλασιασμός εμβαδού)
  () => {
    const correct = '4 φορές μεγαλύτερο (τετραπλασιάζεται)';
    return {
      title: 'ΔΙΠΛΑΣΙΑΣΜΟΣ ΑΚΤΙΝΑΣ',
      prompt: `Αν διπλασιάσουμε την ακτίνα ενός κύκλου (από α σε 2α), πόσες φορές μεγαλύτερο θα γίνει το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => [
        '2 φορές μεγαλύτερο (διπλασιάζεται)',
        '8 φορές μεγαλύτερο',
        'Παραμένει το ίδιο'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Αρχικό εμβαδόν', value: 'Ε₁ ＝ π · α²' },
        { label: 'Νέο εμβαδόν', value: 'Ε₂ ＝ π · (2α)² ＝ π · 4α² ＝ 4 · (π · α²) ＝ 4 · Ε₁' }
      ],
      explanation: `Επειδή η ακτίνα υψώνεται στο τετράγωνο (α²), ο διπλασιασμός της ακτίνας τετραπλασιάζει το εμβαδόν: 2 · 2 ＝ 4 φορές μεγαλύτερο.`
    };
  },
  // 2. Τριπλασιασμός ακτίνας
  () => {
    const correct = '9 φορές μεγαλύτερο';
    return {
      title: 'ΤΡΙΠΛΑΣΙΑΣΜΟΣ ΑΚΤΙΝΑΣ',
      prompt: `Αν τριπλασιάσουμε την ακτίνα ενός κύκλου, πόσες φορές μεγαλύτερο θα γίνει το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => [
        '3 φορές μεγαλύτερο',
        '6 φορές μεγαλύτερο',
        '27 φορές μεγαλύτερο'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Συντελεστής ακτίνας', value: '3' },
        { label: 'Συντελεστής εμβαδού', value: '3 · 3 ＝ 9 φορές μεγαλύτερο' }
      ],
      explanation: `3 · 3 ＝ 9 φορές μεγαλύτερο.`
    };
  },
  // 3. Κύκλος εγγεγραμμένος σε τετράγωνο
  () => {
    const s = 10; // πλευρά τετραγώνου => α = 5
    const squareArea = s * s; // 100
    const circleArea = 3.14 * 5 * 5; // 78.5
    const diff = squareArea - circleArea; // 21.5
    const correct = '21,5 cm²';
    return {
      title: 'ΚΥΚΛΟΣ ΜΕΣΑ ΣΕ ΤΕΤΡΑΓΩΝΟ',
      prompt: `Μέσα σε ένα τετράγωνο πλευράς 10 cm σχεδιάζουμε τον μεγαλύτερο δυνατό κύκλο (διάμετρος 10 cm, ακτίνα 5 cm). Πόσο εμβαδόν μένει έξω από τον κύκλο (στις 4 γωνίες); (π ＝ 3,14)`,
      options: ensureFourUniqueOptions(correct, () => ['78,5 cm²', '100 cm²', '31,4 cm²', '15 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Εμβαδόν τετραγώνου', value: '10 · 10 ＝ 100 cm²' },
        { label: 'Εμβαδόν κύκλου (α ＝ 5)', value: '3,14 · 25 ＝ 78,5 cm²' },
        { label: 'Εμβαδόν που περισσεύει', value: '100 － 78,5 ＝ 21,5 cm²' }
      ],
      explanation: `100 － 78,5 ＝ 21,5 cm².`
    };
  },
  // 4. Σύγκριση δύο κύκλων με ακτίνες 4 και 8
  () => {
    const correct = 'Ο κύκλος Β έχει 4 φορές μεγαλύτερο εμβαδόν';
    return {
      title: 'ΣΥΓΚΡΙΣΗ ΔΥΟ ΚΥΚΛΩΝ',
      prompt: `Ο κύκλος Α έχει ακτίνα 4 cm και ο κύκλος Β έχει ακτίνα 8 cm. Ποια είναι η σχέση των εμβαδών τους;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Ο κύκλος Β έχει 2 φορές μεγαλύτερο εμβαδόν',
        'Έχουν το ίδιο εμβαδόν',
        'Ο κύκλος Β έχει 8 φορές μεγαλύτερο εμβαδόν'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Κύκλος Α (α ＝ 4)', value: 'Ε₁ ＝ π · 16' },
        { label: 'Κύκλος Β (α ＝ 8)', value: 'Ε₂ ＝ π · 64 ＝ 4 · Ε₁' }
      ],
      explanation: `Αφού η ακτίνα διπλασιάστηκε, το εμβαδόν τετραπλασιάζεται.`
    };
  },
  // 5. Υποδιπλασιασμός ακτίνας
  () => {
    const correct = 'Γίνεται 4 φορές μικρότερο (στο 1/4)';
    return {
      title: 'ΣΜΙΚΡΥΝΣΗ ΑΚΤΙΝΑΣ',
      prompt: `Αν μειώσουμε την ακτίνα ενός κύκλου στο μισό (α : 2), πώς θα αλλάξει το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Μειώνεται στο μισό (στο 1/2)',
        'Μειώνεται στο 1/8',
        'Παραμένει το ίδιο'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Μεταβολή ακτίνας', value: ': 2' },
        { label: 'Μεταβολή εμβαδού', value: ': (2 · 2) ＝ : 4 (στο ένα τέταρτο)' }
      ],
      explanation: `Το εμβαδόν διαιρείται με το 2 · 2 ＝ 4.`
    };
  },
  // 6. Μετατροπή εμβαδού από m² σε στρέμματα
  () => {
    const r = 20; // m => area = 1256 m² = 1.256 στρέμματα
    const correct = '1,256 στρέμματα';
    return {
      title: 'ΚΥΚΛΙΚΟ ΧΩΡΑΦΙ ΣΕ ΣΤΡΕΜΜΑΤΑ',
      prompt: `Ένα κυκλικό αγρόκτημα έχει ακτίνα 20 m (εμβαδόν 1.256 m²). Πόσα στρέμματα είναι η έκτασή του;`,
      options: ensureFourUniqueOptions(correct, () => ['12,56 στρέμματα', '0,1256 στρέμματα', '125,6 στρέμματα', '1256 στρέμματα']),
      correctAnswer: correct,
      unit: 'στρέμματα',
      tableData: [
        { label: 'Εμβαδόν σε m²', value: '3,14 · 20 · 20 ＝ 1.256 m²' },
        { label: 'Μετατροπή σε στρέμματα (: 1.000)', value: '1.256 : 1.000 ＝ 1,256 στρέμματα' }
      ],
      explanation: `1.256 : 1.000 ＝ 1,256 στρέμματα.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Τύπος εμβαδού κύκλου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΤΥΠΟΣ ΕΜΒΑΔΟΥ ΚΥΚΛΟΥ',
    prompt: isQ1True
      ? 'Το εμβαδόν του κύκλου υπολογίζεται με τον τύπο Ε ＝ π · α², δηλαδή 3,14 επί την ακτίνα επί την ακτίνα.'
      : 'Το εμβαδόν του κύκλου υπολογίζεται πολλαπλασιάζοντας την ακτίνα επί 2 και μετά επί 3,14: Ε ＝ 2 · π · α.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Τύπος Εμβαδού', value: 'Ε ＝ π · α² (επιφάνεια)' },
      { label: 'Τύπος Περιφέρειας', value: 'L ＝ 2 · π · α (μήκος γραμμής)' }
    ],
    explanation: isQ1True
      ? 'Το εμβαδόν του κύκλου είναι πάντοτε Ε ＝ π · α² (3,14 · α · α).'
      : 'Ο τύπος 2 · π · α δίνει το μήκος της περιφέρειας (περίμετρο). Το εμβαδόν δίνεται από τον τύπο Ε ＝ π · α².'
  });

  // Q2: Τι σημαίνει α² (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'Η ΕΝΝΟΙΑ ΤΟΥ Α²',
    prompt: 'Τι σημαίνει το σύμβολο α² στον τύπο του εμβαδού κύκλου;',
    options: ensureFourUniqueOptions('Η ακτίνα πολλαπλασιασμένη με τον εαυτό της: α · α', () => [
      'Η ακτίνα πολλαπλασιασμένη επί 2: α · 2',
      'Η διάμετρος του κύκλου',
      'Η ακτίνα συν 2: α ＋ 2'
    ]),
    correctAnswer: 'Η ακτίνα πολλαπλασιασμένη με τον εαυτό της: α · α',
    tableData: [
      { label: 'Τετράγωνο αριθμού', value: 'α² ＝ α · α' },
      { label: 'Σύνηθες λάθος', value: 'α · 2 (αυτό είναι η διάμετρος)' }
    ],
    explanation: 'Το α² είναι δύναμη και σημαίνει α · α (π.χ. αν α ＝ 5, τότε α² ＝ 5 · 5 ＝ 25).'
  });

  // Q3: Σχέση διαμέτρου και ακτίνας (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΑΠΟ ΤΗ ΔΙΑΜΕΤΡΟ',
    prompt: 'Αν σε ένα πρόβλημα γνωρίζουμε τη διάμετρο (δ) ενός κύκλου, τι πρέπει να κάνουμε πρώτα για να βρούμε το εμβαδόν;',
    options: ensureFourUniqueOptions(
      'Να διαιρέσουμε τη διάμετρο με το 2 για να βρούμε την ακτίνα (α ＝ δ : 2)',
      () => [
        'Να βάλουμε απευθείας τη διάμετρο στον τύπο: 3,14 · δ · δ',
        'Να πολλαπλασιάσουμε τη διάμετρο με το 2',
        'Δεν μπορούμε να βρούμε το εμβαδόν από τη διάμετρο'
      ]
    ),
    correctAnswer: 'Να διαιρέσουμε τη διάμετρο με το 2 για να βρούμε την ακτίνα (α ＝ δ : 2)',
    tableData: [
      { label: 'Σχέση', value: 'δ ＝ 2 · α, άρα α ＝ δ : 2' },
      { label: 'Βήμα υπολογισμού', value: 'Πρώτα βρίσκουμε την ακτίνα και μετά υπολογίζουμε το π · α²' }
    ],
    explanation: 'Ο τύπος του εμβαδού απαιτεί την ακτίνα (α), επομένως διαιρούμε πάντοτε πρώτα τη διάμετρο διά 2.'
  });

  // Q4: Οπτική αναγνώριση εμβαδού κύκλου (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΑΝΑΓΝΩΡΙΣΗ ΣΤΟΙΧΕΙΩΝ ΚΥΚΛΟΥ',
    prompt: 'Παρατηρήστε τον παρακάτω κύκλο. Ποιο ευθύγραμμο τμήμα πρέπει να υψώσουμε στο τετράγωνο για να υπολογίσουμε το εμβαδόν του;',
    svg: (
      <svg viewBox="0 0 160 120" className="w-40 h-28 mx-auto my-2 select-none drop-shadow-sm">
        <circle cx="80" cy="60" r="45" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
        <line x1="80" y1="60" x2="125" y2="60" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="80" cy="60" r="3" fill="#ffffff" />
        <text x="102" y="52" fill="#f59e0b" fontSize="11" fontWeight="bold">α</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(
      'Την κίτρινη ακτίνα (α) από το κέντρο προς την περιφέρεια',
      () => [
        'Ολόκληρη τη διάμετρο του κύκλου',
        'Το μήκος της περιφέρειας',
        'Οποιοδήποτε σημείο του κύκλου'
      ]
    ),
    correctAnswer: 'Την κίτρινη ακτίνα (α) από το κέντρο προς την περιφέρεια',
    tableData: [
      { label: 'Κίτρινο τμήμα (α)', value: 'Ακτίνα του κύκλου' },
      { label: 'Τύπος εμβαδού', value: 'Ε ＝ π · α²' }
    ],
    explanation: 'Για το εμβαδόν υψώνουμε στο τετράγωνο την ακτίνα (α).'
  });

  // Q5: Υπολογισμός εμβαδού με α = 10 (Input αριθμού)
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΕΜΒΑΔΟΥ ΜΕ Α = 10 CM',
    prompt: 'Ένας κύκλος έχει ακτίνα 10 cm. Πόσα cm² είναι το εμβαδόν του; (Χρησιμοποιήστε π ＝ 3,14 - Γράψτε μόνο τον αριθμό)',
    correctAnswer: '314',
    tableData: [
      { label: 'Ακτίνα', value: '10 cm' },
      { label: 'Τετράγωνο ακτίνας', value: '10 · 10 ＝ 100 cm²' },
      { label: 'Πράξη', value: '3,14 · 100 ＝ 314 cm²' }
    ],
    explanation: 'Ε ＝ 3,14 · 10 · 10 ＝ 314 cm².'
  });

  // Q6: Υπολογισμός εμβαδού με α = 2 cm (Input αριθμού)
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΕΜΒΑΔΟΥ ΜΕ Α = 2 CM',
    prompt: 'Ένας κύκλος έχει ακτίνα 2 cm. Πόσα cm² είναι το εμβαδόν του; (Χρησιμοποιήστε π ＝ 3,14)',
    correctAnswer: '12,56',
    tableData: [
      { label: 'Ακτίνα', value: '2 cm' },
      { label: 'Τετράγωνο ακτίνας', value: '2 · 2 ＝ 4 cm²' },
      { label: 'Πράξη', value: '3,14 · 4 ＝ 12,56 cm²' }
    ],
    explanation: 'Ε ＝ 3,14 · 2 · 2 ＝ 3,14 · 4 ＝ 12,56 cm².'
  });

  // Q7: Εμβαδόν ημικυκλίου (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΕΜΒΑΔΟΝ ΗΜΙΚΥΚΛΙΟΥ',
    prompt: 'Πώς υπολογίζουμε το εμβαδόν ενός ημικυκλίου;',
    options: ensureFourUniqueOptions(
      'Υπολογίζουμε το εμβαδόν ολόκληρου του κύκλου και διαιρούμε με το 2: (π · α²) : 2',
      () => [
        'Πολλαπλασιάζουμε την ακτίνα με το 2',
        'Διαιρούμε την ακτίνα με το 2 και μετά πολλαπλασιάζουμε με το 3,14',
        'Έχει ακριβώς το ίδιο εμβαδόν με τον κύκλο'
      ]
    ),
    correctAnswer: 'Υπολογίζουμε το εμβαδόν ολόκληρου του κύκλου και διαιρούμε με το 2: (π · α²) : 2',
    tableData: [
      { label: 'Ολόκληρος κύκλος', value: 'Ε ＝ π · α²' },
      { label: 'Ημικύκλιο', value: 'Εημικ ＝ (π · α²) : 2' }
    ],
    explanation: 'Το ημικύκλιο είναι το μισό του κύκλου, άρα διαιρούμε το εμβαδόν με το 2.'
  });

  // Q8: Περίμετρος vs Εμβαδόν (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΠΕΡΙΜΕΤΡΟΣ ΕΝΑΝΤΙ ΕΜΒΑΔΟΥ',
    prompt: 'Ποια είναι η διαφορά ανάμεσα στην περίμετρο (μήκος κύκλου) και στο εμβαδόν του κύκλου;',
    options: ensureFourUniqueOptions(
      'Η περίμετρος είναι μήκος γραμμής (2 · π · α σε cm), ενώ το εμβαδόν είναι επιφάνεια (π · α² σε cm²)',
      () => [
        'Είναι ακριβώς το ίδιο πράγμα με άλλο όνομα',
        'Η περίμετρος μετριέται σε cm² και το εμβαδόν σε cm',
        'Το εμβαδόν είναι πάντοτε μικρότερο από την περίμετρο'
      ]
    ),
    correctAnswer: 'Η περίμετρος είναι μήκος γραμμής (2 · π · α σε cm), ενώ το εμβαδόν είναι επιφάνεια (π · α² σε cm²)',
    tableData: [
      { label: 'Περίμετρος', value: 'L ＝ 2 · π · α (μήκος σε cm, m)' },
      { label: 'Εμβαδόν', value: 'Ε ＝ π · α² (επιφάνεια σε cm², m²)' }
    ],
    explanation: 'Η περίμετρος μετράει το εξωτερικό μήκος της γραμμής, ενώ το εμβαδόν μετράει ολόκληρη την εσωτερική επιφάνεια.'
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

export default function EmbadonKiklouAskiseisPage() {
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
      title="Ασκήσεις: Εμβαδόν Κύκλου - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στον υπολογισμό εμβαδού κύκλου (Ε ＝ π · α²), διαμέτρου, ημικυκλίου και κυκλικού δακτυλίου για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/76-embadon-kiklou"
      backText="Θεωρία Κεφ. 76"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/76-embadon-kiklou"
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
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 76 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Εμβαδον Κυκλου')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στον υπολογισμό εμβαδού με τον τύπο Ε ＝ π · α², στις σχέσεις ακτίνας-διαμέτρου και στα ημικύκλια μέσα από 12 δυναμικές ερωτήσεις.
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

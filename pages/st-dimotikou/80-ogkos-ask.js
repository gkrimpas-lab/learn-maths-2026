// pages/st-dimotikou/80-ogkos-ask.js
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

// POOL ΓΙΑ Q9: Υπολογισμός Όγκου Κύβου (V ＝ α · α · α)
const PROBLEM_POOL_Q9 = [
  // 1. Κυβικό δοχείο
  () => {
    const a = randInt(3, 8);
    const vol = a * a * a;
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΟΓΚΟΣ ΚΥΒΙΚΟΥ ΔΟΧΕΙΟΥ',
      prompt: `Ένα δοχείο έχει σχήμα κύβου με ακμή ${a} cm. Ποιος είναι ο όγκος του σε cm³;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a * a)} cm³`,
        `${formatNum(vol + 20)} cm³`,
        `${formatNum(vol - 15 > 0 ? vol - 15 : vol + 35)} cm³`,
        `${formatNum(a * 3)} cm³`
      ]),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακμή κύβου (α)', value: `${a} cm` },
        { label: 'Τύπος όγκου κύβου', value: 'V ＝ α · α · α ＝ α³' },
        { label: 'Πράξη', value: `${a} · ${a} · ${a} ＝ ${formatNum(vol)} cm³` }
      ],
      explanation: `Ο όγκος του κύβου ισούται με το γινόμενο των τριών διαστάσεών του: V ＝ α · α · α ＝ ${a} · ${a} · ${a} ＝ ${formatNum(vol)} cm³.`
    };
  },
  // 2. Ξύλινο κυβικό κουτί
  () => {
    const a = randInt(10, 20);
    const vol = a * a * a;
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΞΥΛΙΝΟΣ ΚΥΒΟΣ',
      prompt: `Ένα ξύλινο συμπαγές κουτί σε σχήμα κύβου έχει ακμή ${a} cm. Πόσο είναι το μέγεθος του όγκου του σε cm³;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a * a)} cm³`,
        `${formatNum(vol + 200)} cm³`,
        `${formatNum(vol - 200 > 0 ? vol - 200 : vol + 400)} cm³`,
        `${formatNum(6 * a * a)} cm³`
      ]),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακμή (α)', value: `${a} cm` },
        { label: 'Υπολογισμός', value: `${a} · ${a} · ${a} ＝ ${formatNum(vol)} cm³` }
      ],
      explanation: `V ＝ α³ ＝ ${a} · ${a} · ${a} ＝ ${formatNum(vol)} cm³.`
    };
  },
  // 3. Μεγάλη κυβική δεξαμενή σε m³
  () => {
    const a = 2; // m
    const vol = a * a * a; // 8 m³
    const correct = '8 m³';
    return {
      title: 'ΚΥΒΙΚΗ ΔΕΞΑΜΕΝΗ ΣΕ M³',
      prompt: `Μια κυβική δεξαμενή νερού έχει ακμή 2 m. Πόσα κυβικά μέτρα (m³) νερού χωράει;`,
      options: ensureFourUniqueOptions(correct, () => ['4 m³', '6 m³', '16 m³', '12 m³']),
      correctAnswer: correct,
      unit: 'm³',
      tableData: [
        { label: 'Ακμή δεξαμενής', value: '2 m' },
        { label: 'Πράξη', value: '2 · 2 · 2 ＝ 8 m³' }
      ],
      explanation: `V ＝ 2 · 2 · 2 ＝ 8 m³.`
    };
  },
  // 4. Κύβος με ακμή 5 dm
  () => {
    const a = 5;
    const vol = a * a * a; // 125 dm³
    const correct = '125 dm³';
    return {
      title: 'ΟΓΚΟΣ ΣΕ DM³',
      prompt: `Ένας κύβος έχει ακμή 5 dm. Πόσα κυβικά δεκατόμετρα (dm³) είναι ο όγκος του;`,
      options: ensureFourUniqueOptions(correct, () => ['25 dm³', '15 dm³', '150 dm³', '75 dm³']),
      correctAnswer: correct,
      unit: 'dm³',
      tableData: [
        { label: 'Ακμή', value: '5 dm' },
        { label: 'Όγκος (5 · 5 · 5)', value: '125 dm³' }
      ],
      explanation: `5 · 5 · 5 ＝ 125 dm³.`
    };
  },
  // 5. Ζάρι με ακμή 2 cm
  () => {
    const a = 2;
    const vol = 8;
    const correct = '8 cm³';
    return {
      title: 'ΟΓΚΟΣ ΖΑΡΙΟΥ',
      prompt: `Ένα ζάρι έχει σχήμα κύβου με ακμή 2 cm. Πόσο είναι το μέγεθος του όγκου του;`,
      options: ensureFourUniqueOptions(correct, () => ['4 cm³', '6 cm³', '12 cm³', '24 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακμή', value: '2 cm' },
        { label: 'Όγκος', value: '2 · 2 · 2 ＝ 8 cm³' }
      ],
      explanation: `2 · 2 · 2 ＝ 8 cm³.`
    };
  },
  // 6. Κύβος με ακμή 10 cm
  () => {
    const a = 10;
    const vol = 1000;
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΚΥΒΟΣ 10 CM',
      prompt: `Πόσα κυβικά εκατοστόμετρα (cm³) είναι ο όγκος ενός κύβου με ακμή 10 cm;`,
      options: ensureFourUniqueOptions(correct, () => ['100 cm²', '300 cm³', '100 cm³', '600 cm²']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακμή', value: '10 cm' },
        { label: 'Πράξη', value: '10 · 10 · 10 ＝ 1.000 cm³' }
      ],
      explanation: `10 · 10 · 10 ＝ 1.000 cm³.`
    };
  }
];

// POOL ΓΙΑ Q10: Όγκος Ορθογωνίου Παραλληλεπιπέδου (V ＝ α · β · γ)
const PROBLEM_POOL_Q10 = [
  // 1. Κουτί παπουτσιών
  () => {
    const l = randInt(20, 30);
    const w = randInt(10, 16);
    const h = randInt(8, 12);
    const vol = l * w * h;
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΟΓΚΟΣ ΚΟΥΤΙΟΥ ΠΑΠΟΥΤΣΙΩΝ',
      prompt: `Ένα κουτί παπουτσιών έχει μήκος ${l} cm, πλάτος ${w} cm και ύψος ${h} cm. Πόσα cm³ είναι ο όγκος του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(l * w)} cm³`,
        `${formatNum(vol + 150)} cm³`,
        `${formatNum(vol - 150 > 0 ? vol - 150 : vol + 300)} cm³`,
        `${formatNum(2 * (l * w + w * h + l * h))} cm³`
      ]),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Μήκος (α)', value: `${l} cm` },
        { label: 'Πλάτος (β)', value: `${w} cm` },
        { label: 'Ύψος (γ)', value: `${h} cm` },
        { label: 'Υπολογισμός (α · β · γ)', value: `${l} · ${w} · ${h} ＝ ${formatNum(vol)} cm³` }
      ],
      explanation: `V ＝ Μήκος · Πλάτος · Ύψος ＝ ${l} · ${w} · ${h} ＝ ${formatNum(vol)} cm³.`
    };
  },
  // 2. Ενυδρείο
  () => {
    const l = 50;
    const w = 30;
    const h = 40;
    const vol = l * w * h; // 60.000 cm³
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΟΓΚΟΣ ΕΝΥΔΡΕΙΟΥ',
      prompt: `Ένα γυάλινο ενυδρείο έχει μήκος 50 cm, πλάτος 30 cm και ύψος 40 cm. Πόσος είναι ο όγκος του χώρου που περικλείει σε cm³;`,
      options: ensureFourUniqueOptions(correct, () => ['1.500 cm³', '12.000 cm³', '6.000 cm³', '9.400 cm²']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Διαστάσεις', value: '50 cm, 30 cm, 40 cm' },
        { label: 'Πράξη', value: '50 · 30 · 40 ＝ 60.000 cm³' }
      ],
      explanation: `50 · 30 · 40 ＝ 60.000 cm³.`
    };
  },
  // 3. Σπιρτόκουτο
  () => {
    const l = 5;
    const w = 4;
    const h = 2;
    const vol = l * w * h; // 40 cm³
    const correct = '40 cm³';
    return {
      title: 'ΟΓΚΟΣ ΣΠΙΡΤΟΚΟΥΤΟΥ',
      prompt: `Ένα σπιρτόκουτο έχει μήκος 5 cm, πλάτος 4 cm και ύψος 2 cm. Πόσο είναι το μέγεθος του όγκου του;`,
      options: ensureFourUniqueOptions(correct, () => ['20 cm³', '76 cm²', '11 cm³', '80 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Διαστάσεις', value: '5 cm, 4 cm, 2 cm' },
        { label: 'Πράξη', value: '5 · 4 · 2 ＝ 40 cm³' }
      ],
      explanation: `5 · 4 · 2 ＝ 40 cm³.`
    };
  },
  // 4. Κουτί αποθήκευσης σε dm³
  () => {
    const l = 4; // dm
    const w = 3; // dm
    const h = 2; // dm
    const vol = l * w * h; // 24 dm³
    const correct = '24 dm³';
    return {
      title: 'ΚΟΥΤΙ ΑΠΟΘΗΚΕΥΣΗΣ ΣΕ DM³',
      prompt: `Ένα πλαστικό κιβώτιο έχει διαστάσεις 4 dm, 3 dm και 2 dm. Πόσο είναι το μέγεθος του όγκου του σε dm³;`,
      options: ensureFourUniqueOptions(correct, () => ['12 dm³', '9 dm³', '52 dm²', '48 dm³']),
      correctAnswer: correct,
      unit: 'dm³',
      tableData: [
        { label: 'Διαστάσεις σε dm', value: '4 dm, 3 dm, 2 dm' },
        { label: 'Πράξη', value: '4 · 3 · 2 ＝ 24 dm³' }
      ],
      explanation: `4 · 3 · 2 ＝ 24 dm³.`
    };
  },
  // 5. Αίθουσα διδασκαλίας σε m³
  () => {
    const l = 8;
    const w = 6;
    const h = 3;
    const vol = l * w * h; // 144 m³
    const correct = '144 m³';
    return {
      title: 'ΟΓΚΟΣ ΑΙΘΟΥΣΑΣ ΔΙΔΑΣΚΑΛΙΑΣ',
      prompt: `Μια σχολική αίθουσα έχει μήκος 8 m, πλάτος 6 m και ύψος 3 m. Πόσα κυβικά μέτρα (m³) αέρα περιέχει;`,
      options: ensureFourUniqueOptions(correct, () => ['48 m³', '180 m³', '96 m³', '17 m³']),
      correctAnswer: correct,
      unit: 'm³',
      tableData: [
        { label: 'Διαστάσεις αίθουσας', value: '8 m, 6 m, 3 m' },
        { label: 'Όγκος αέρα', value: '8 · 6 · 3 ＝ 144 m³' }
      ],
      explanation: `8 · 6 · 3 ＝ 144 m³.`
    };
  },
  // 6. Τούβλο οικοδομής
  () => {
    const l = 20;
    const w = 10;
    const h = 5;
    const vol = l * w * h; // 1000 cm³
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΟΓΚΟΣ ΤΟΥΒΛΟΥ',
      prompt: `Ένα τούβλο οικοδομής έχει μήκος 20 cm, πλάτος 10 cm και πάχος 5 cm. Ποιος είναι ο όγκος του σε cm³;`,
      options: ensureFourUniqueOptions(correct, () => ['200 cm³', '100 cm³', '700 cm²', '1.500 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Διαστάσεις', value: '20 cm, 10 cm, 5 cm' },
        { label: 'Πράξη', value: '20 · 10 · 5 ＝ 1.000 cm³' }
      ],
      explanation: `20 · 10 · 5 ＝ 1.000 cm³ (ή 1 dm³).`
    };
  }
];

// POOL ΓΙΑ Q11: Μετατροπή Όγκου σε Λίτρα (1 dm³ ＝ 1 L, 1 m³ ＝ 1.000 L)
const PROBLEM_POOL_Q11 = [
  // 1. Δεξαμενή πετρελαίου σε λίτρα
  () => {
    const l = 2; // m
    const w = 1.5; // m
    const h = 1; // m
    const m3 = l * w * h; // 3 m³
    const liters = m3 * 1000; // 3000 L
    const correct = `${formatNum(liters)} L`;
    return {
      title: 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΔΕΞΑΜΕΝΗΣ ΠΕΤΡΕΛΑΙΟΥ',
      prompt: `Μια δεξαμενή πετρελαίου έχει μήκος 2 m, πλάτος 1,5 m και ύψος 1 m. Πόσα λίτρα (L) πετρελαίου χωράει όταν γεμίσει πλήρως;`,
      options: ensureFourUniqueOptions(correct, () => [
        '300 L',
        '30.000 L',
        '3 L',
        '1.500 L'
      ]),
      correctAnswer: correct,
      unit: 'L',
      tableData: [
        { label: 'Όγκος σε m³', value: '2 · 1,5 · 1 ＝ 3 m³' },
        { label: 'Σχέση m³ με λίτρα', value: '1 m³ ＝ 1.000 L' },
        { label: 'Χωρητικότητα σε λίτρα', value: '3 · 1.000 ＝ 3.000 L' }
      ],
      explanation: `Υπολογίζουμε πρώτα τον όγκο: 2 · 1,5 · 1 ＝ 3 m³. Επειδή 1 m³ ＝ 1.000 L, έχουμε: 3 · 1.000 ＝ 3.000 L.`
    };
  },
  // 2. Ενυδρείο σε λίτρα
  () => {
    const l = 60; // cm = 6 dm
    const w = 40; // cm = 4 dm
    const h = 50; // cm = 5 dm
    const liters = 6 * 4 * 5; // 120 L
    const correct = `${liters} L`;
    return {
      title: 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΕΝΥΔΡΕΙΟΥ ΣΕ ΛΙΤΡΑ',
      prompt: `Ένα ενυδρείο έχει μήκος 60 cm, πλάτος 40 cm και ύψος 50 cm. Πόσα λίτρα (L) νερού χρειάζονται για να γεμίσει μέχρι πάνω;`,
      options: ensureFourUniqueOptions(correct, () => ['12 L', '1.200 L', '120.000 L', '240 L']),
      correctAnswer: correct,
      unit: 'L',
      tableData: [
        { label: 'Μετατροπή σε dm', value: '60 cm ＝ 6 dm, 40 cm ＝ 4 dm, 50 cm ＝ 5 dm' },
        { label: 'Όγκος σε dm³', value: '6 · 4 · 5 ＝ 120 dm³' },
        { label: 'Ισοδυναμία (1 dm³ ＝ 1 L)', value: '120 L' }
      ],
      explanation: `Μετατρέπουμε σε dm: 6 dm · 4 dm · 5 dm ＝ 120 dm³. Επειδή 1 dm³ ＝ 1 L, το ενυδρείο χωράει 120 L νερού.`
    };
  },
  // 3. Κυβικό δοχείο σε λίτρα
  () => {
    const a = 30; // cm = 3 dm
    const liters = 3 * 3 * 3; // 27 L
    const correct = `${liters} L`;
    return {
      title: 'ΚΥΒΙΚΟ ΔΟΧΕΙΟ ΣΕ ΛΙΤΡΑ',
      prompt: `Ένα δοχείο έχει σχήμα κύβου με ακμή 30 cm. Πόσα λίτρα υγρού χωράει;`,
      options: ensureFourUniqueOptions(correct, () => ['27.000 L', '2,7 L', '9 L', '54 L']),
      correctAnswer: correct,
      unit: 'L',
      tableData: [
        { label: 'Ακμή σε dm', value: '30 cm ＝ 3 dm' },
        { label: 'Όγκος', value: '3 · 3 · 3 ＝ 27 dm³' },
        { label: 'Χωρητικότητα', value: '27 L' }
      ],
      explanation: `30 cm ＝ 3 dm. Όγκος: 3 · 3 · 3 ＝ 27 dm³ ＝ 27 L.`
    };
  },
  // 4. Πισίνα σε λίτρα
  () => {
    const l = 10; // m
    const w = 5; // m
    const h = 2; // m
    const m3 = l * w * h; // 100 m³
    const liters = m3 * 1000; // 100.000 L
    const correct = `${formatNum(liters)} L`;
    return {
      title: 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΠΙΣΙΝΑΣ',
      prompt: `Μια πισίνα έχει μήκος 10 m, πλάτος 5 m και βάθος 2 m. Πόσα λίτρα (L) νερού περιέχει όταν είναι γεμάτη;`,
      options: ensureFourUniqueOptions(correct, () => ['10.000 L', '1.000.000 L', '100 L', '50.000 L']),
      correctAnswer: correct,
      unit: 'L',
      tableData: [
        { label: 'Όγκος πισίνας σε m³', value: '10 · 5 · 2 ＝ 100 m³' },
        { label: 'Λίτρα (· 1.000)', value: '100 · 1.000 ＝ 100.000 L' }
      ],
      explanation: `10 · 5 · 2 ＝ 100 m³. 100 · 1.000 ＝ 100.000 L νερού.`
    };
  },
  // 5. Βαρέλι με χωρητικότητα 200 L
  () => {
    const correct = '200 dm³';
    return {
      title: 'ΜΕΤΑΤΡΟΠΗ ΛΙΤΡΩΝ ΣΕ DM³',
      prompt: `Ένα βαρέλι περιέχει 200 L λαδιού. Πόσα κυβικά δεκατόμετρα (dm³) είναι ο όγκος του λαδιού;`,
      options: ensureFourUniqueOptions(correct, () => ['20 dm³', '2.000 dm³', '0,2 dm³', '200 m³']),
      correctAnswer: correct,
      unit: 'dm³',
      tableData: [
        { label: 'Ποσότητα σε λίτρα', value: '200 L' },
        { label: 'Σχέση', value: '1 L ＝ 1 dm³' },
        { label: 'Όγκος σε dm³', value: '200 dm³' }
      ],
      explanation: `Επειδή 1 L ισούται ακριβώς με 1 dm³, τα 200 L είναι 200 dm³.`
    };
  },
  // 6. Δοχείο γάλακτος 2 L σε cm³
  () => {
    const correct = '2.000 cm³';
    return {
      title: 'ΜΕΤΑΤΡΟΠΗ ΛΙΤΡΩΝ ΣΕ CM³',
      prompt: `Πόσα κυβικά εκατοστόμετρα (cm³) είναι 2 λίτρα (2 L) γάλακτος;`,
      options: ensureFourUniqueOptions(correct, () => ['200 cm³', '20.000 cm³', '20 cm³', '2 m³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: '2 Λίτρα σε dm³', value: '2 L ＝ 2 dm³' },
        { label: 'Μετατροπή σε cm³ (· 1.000)', value: '2 · 1.000 ＝ 2.000 cm³' }
      ],
      explanation: `2 L ＝ 2 dm³ ＝ 2 · 1.000 ＝ 2.000 cm³ (ή 2.000 mL).`
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα Ρυθμού Ροής & Στάθμης
const PROBLEM_POOL_Q12 = [
  // 1. Χρόνος γεμίσματος δεξαμενής με βρύση
  () => {
    const l = 2; // m
    const w = 1; // m
    const h = 1.5; // m
    const totalLiters = l * w * h * 1000; // 3000 L
    const flowPerMin = 50; // L ανά λεπτό
    const minutes = totalLiters / flowPerMin; // 60 λεπτά
    const correct = `${minutes} λεπτά (1 ώρα)`;
    return {
      title: 'ΧΡΟΝΟΣ ΓΕΜΙΣΜΑΤΟΣ ΔΕΞΑΜΕΝΗΣ',
      prompt: `Μια δεξαμενή διαστάσεων 2 m, 1 m και 1,5 m γεμίζει από βρύση που παρέχει 50 L νερό κάθε λεπτό. Πόσα λεπτά θα χρειαστούν για να γεμίσει εντελώς η άδεια δεξαμενή;`,
      options: ensureFourUniqueOptions(correct, () => [
        '30 λεπτά',
        '120 λεπτά (2 ώρες)',
        '45 λεπτά',
        '100 λεπτά'
      ]),
      correctAnswer: correct,
      unit: 'λεπτά',
      tableData: [
        { label: 'Όγκος δεξαμενής', value: '2 · 1 · 1,5 ＝ 3 m³' },
        { label: 'Συνολικά λίτρα', value: '3 · 1.000 ＝ 3.000 L' },
        { label: 'Παροχή βρύσης', value: '50 L ανά λεπτό' },
        { label: 'Χρόνος γεμίσματος', value: '3.000 : 50 ＝ 60 λεπτά (1 ώρα)' }
      ],
      explanation: `Ο όγκος είναι 3 m³ ＝ 3.000 L. Με ρυθμό 50 L/λεπτό: 3.000 : 50 ＝ 60 λεπτά (1 ώρα).`
    };
  },
  // 2. Εύρεση ύψους δεξαμενής όταν γνωρίζουμε τον όγκο
  () => {
    const l = 4; // m
    const w = 2; // m
    const vol = 24; // m³
    const h = vol / (l * w); // 3 m
    const correct = '3 m';
    return {
      title: 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΔΕΞΑΜΕΝΗΣ',
      prompt: `Μια δεξαμενή έχει χωρητικότητα 24 m³. Αν το μήκος της βάσης της είναι 4 m και το πλάτος της είναι 2 m, πόσο είναι το ύψος της δεξαμενής;`,
      options: ensureFourUniqueOptions(correct, () => ['2 m', '4 m', '6 m', '8 m']),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Συνολικός όγκος', value: '24 m³' },
        { label: 'Εμβαδόν βάσης', value: '4 · 2 ＝ 8 m²' },
        { label: 'Ύψος (Όγκος : Βάση)', value: '24 : 8 ＝ 3 m' }
      ],
      explanation: `Το εμβαδόν της βάσης είναι 4 · 2 ＝ 8 m². Το ύψος υπολογίζεται ως: 24 : 8 ＝ 3 m.`
    };
  },
  // 3. Διπλασιασμός όλων των διαστάσεων κύβου (όγκος επί 8)
  () => {
    const correct = '8 φορές μεγαλύτερος';
    return {
      title: 'ΜΕΤΑΒΟΛΗ ΔΙΑΣΤΑΣΕΩΝ ΚΥΒΟΥ',
      prompt: `Αν διπλασιάσουμε το μήκος της ακμής ενός κύβου (από α σε 2α), πόσες φορές μεγαλύτερος θα γίνει ο όγκος του;`,
      options: ensureFourUniqueOptions(correct, () => [
        '2 φορές μεγαλύτερος',
        '4 φορές μεγαλύτερος',
        '6 φορές μεγαλύτερος'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Αρχικός όγκος', value: 'V₁ ＝ α · α · α ＝ α³' },
        { label: 'Νέος όγκος', value: 'V₂ ＝ (2α) · (2α) · (2α) ＝ 8 · α³ ＝ 8 · V₁' }
      ],
      explanation: `Επειδή πολλαπλασιάζουμε 3 διαστάσεις: 2 · 2 · 2 ＝ 8 φορές μεγαλύτερος όγκος.`
    };
  },
  // 4. Πόσα κυβάκια 1 cm³ χωράνε σε κύβο ακμής 10 cm
  () => {
    const correct = '1.000 κυβάκια';
    return {
      title: 'ΚΥΒΑΚΙΑ ΣΕ ΚΥΒΟ',
      prompt: `Πόσα μικρά κυβάκια ακμής 1 cm χωράνε ακριβώς μέσα σε έναν κύβο με ακμή 10 cm;`,
      options: ensureFourUniqueOptions(correct, () => ['100 κυβάκια', '10 κυβάκια', '600 κυβάκια', '10.000 κυβάκια']),
      correctAnswer: correct,
      unit: 'κυβάκια',
      tableData: [
        { label: 'Όγκος μεγάλου κύβου', value: '10 · 10 · 10 ＝ 1.000 cm³' },
        { label: 'Όγκος μικρού κύβου', value: '1 · 1 · 1 ＝ 1 cm³' },
        { label: 'Πλήθος', value: '1.000 : 1 ＝ 1.000 κυβάκια' }
      ],
      explanation: `Ο μεγάλος κύβος έχει όγκο 1.000 cm³, άρα χωράει ακριβώς 1.000 κυβάκια του 1 cm³.`
    };
  },
  // 5. Κατανάλωση νερού από πισίνα
  () => {
    const total = 50000; // 50.000 L = 50 m³
    const drained = 20000; // 20.000 L
    const left = 30000; // 30.000 L = 30 m³
    const correct = '30 m³';
    return {
      title: 'ΑΝΤΛΗΣΗ ΝΕΡΟΥ ΠΙΣΙΝΑΣ',
      prompt: `Μια πισίνα περιέχει 50.000 L νερό. Αν αντληθούν 20.000 L, πόσα κυβικά μέτρα (m³) νερού απομένουν στην πισίνα;`,
      options: ensureFourUniqueOptions(correct, () => ['300 m³', '3 m³', '30.000 m³', '20 m³']),
      correctAnswer: correct,
      unit: 'm³',
      tableData: [
        { label: 'Αρχικό νερό', value: '50.000 L' },
        { label: 'Νερό που αντλήθηκε', value: '20.000 L' },
        { label: 'Νερό που απέμεινε', value: '30.000 L' },
        { label: 'Μετατροπή σε m³ (: 1.000)', value: '30.000 : 1.000 ＝ 30 m³' }
      ],
      explanation: `Απομένουν 30.000 L. Επειδή 1.000 L ＝ 1 m³, έχουμε: 30.000 : 1.000 ＝ 30 m³.`
    };
  },
  // 6. Πόσα μπουκάλια των 500 mL γεμίζουν από 10 L
  () => {
    const totalL = 10;
    const totalMl = 10000;
    const count = totalMl / 500; // 20
    const correct = '20 μπουκάλια';
    return {
      title: 'ΕΜΦΙΑΛΩΣΗ ΝΕΡΟΥ',
      prompt: `Πόσα μπουκάλια των 500 mL (0,5 L) μπορούν να γεμίσουν από ένα δοχείο που περιέχει 10 λίτρα (10 dm³) νερό;`,
      options: ensureFourUniqueOptions(correct, () => ['5 μπουκάλια', '50 μπουκάλια', '10 μπουκάλια', '200 μπουκάλια']),
      correctAnswer: correct,
      unit: 'μπουκάλια',
      tableData: [
        { label: 'Συνολικό νερό σε mL', value: '10 L ＝ 10.000 mL' },
        { label: 'Μέγεθος μπουκαλιού', value: '500 mL' },
        { label: 'Πλήθος μπουκαλιών', value: '10.000 : 500 ＝ 20 μπουκάλια' }
      ],
      explanation: `Κάθε λίτρο περιέχει 2 μπουκάλια των 500 mL. Άρα: 10 · 2 ＝ 20 μπουκάλια.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Έννοια όγκου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΕΝΝΟΙΑ ΤΟΥ ΟΓΚΟΥ',
    prompt: isQ1True
      ? 'Όγκος ενός στερεού σώματος είναι ο χώρος που καταλαμβάνει, και μετριέται σε 3 διαστάσεις (μήκος, πλάτος, ύψος).'
      : 'Ο όγκος ενός στερεού είναι το εμβαδόν των εξωτερικών του επιφανειών και μετριέται σε τετραγωνικά μέτρα (m²).',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Επιφάνεια (Εμβαδόν)', value: '2 διαστάσεις (σε m², cm²)' },
      { label: 'Χώρος (Όγκος)', value: '3 διαστάσεις (σε m³, dm³, L)' }
    ],
    explanation: isQ1True
      ? 'Ο όγκος μετράει τον τρισδιάστατο χώρο που πιάνει ένα σώμα.'
      : 'Το εμβαδόν των εξωτερικών επιφανειών είναι επιφάνεια (σε m²). Ο όγκος μετράει τον εσωτερικό χώρο σε κυβικές μονάδες (m³, L).'
  });

  // Q2: Βασική ισοδυναμία 1 dm³ με λίτρα (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'Η ΜΑΓΙΚΗ ΙΣΟΔΥΝΑΜΙΑ',
    prompt: 'Με πόσα λίτρα (L) ισούται ακριβώς 1 κυβικό δεκατόμετρο (1 dm³);',
    options: ensureFourUniqueOptions('1 Λίτρο (1 L)', () => [
      '10 Λίτρα (10 L)',
      '100 Λίτρα (100 L)',
      '1.000 Λίτρα (1.000 L)'
    ]),
    correctAnswer: '1 Λίτρο (1 L)',
    tableData: [
      { label: '1 dm³', value: '10 cm · 10 cm · 10 cm ＝ 1.000 cm³' },
      { label: 'Χωρητικότητα', value: 'Ακριβώς 1 Λίτρο (1 L)' }
    ],
    explanation: '1 κυβικό δεκατόμετρο (1 dm³) είναι εξ ορισμού ίσο με 1 λίτρο (1 L).'
  });

  // Q3: Πόσα λίτρα έχει 1 κυβικό μέτρο (1 m³) (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΚΥΒΙΚΟ ΜΕΤΡΟ ΚΑΙ ΛΙΤΡΑ',
    prompt: 'Πόσα λίτρα (L) νερού χωράει ακριβώς 1 κυβικό μέτρο (1 m³);',
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
    explanation: 'Επειδή 1 m³ ＝ 1.000 dm³ και 1 dm³ ＝ 1 L, ένα κυβικό μέτρο περιέχει ακριβώς 1.000 λίτρα.'
  });

  // Q4: Οπτική αναγνώριση 1 dm³ κύβου (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΟΠΤΙΚΗ ΚΑΤΑΝΟΗΣΗ ΧΩΡΗΤΙΚΟΤΗΤΑΣ',
    prompt: 'Παρατηρήστε τον παρακάτω κύβο με ακμή 1 dm (10 cm). Αν τον γεμίσουμε με νερό μέχρι πάνω, πόσο υγρό περιέχει;',
    svg: (
      <svg viewBox="0 0 160 120" className="w-40 h-28 mx-auto my-2 select-none drop-shadow-sm">
        <polygon points="50,45 90,25 120,45 80,65" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
        <polygon points="50,45 80,65 80,105 50,85" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
        <polygon points="80,65 120,45 120,85 80,105" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
        <text x="60" y="98" fill="#0369a1" fontSize="10" fontWeight="bold">1 dm</text>
        <text x="105" y="98" fill="#0369a1" fontSize="10" fontWeight="bold">1 dm</text>
      </svg>
    ),
    options: ensureFourUniqueOptions('Ακριβώς 1 Λίτρο (1 dm³)', () => [
      '10 Λίτρα',
      '100 Λίτρα',
      '0,1 Λίτρα'
    ]),
    correctAnswer: 'Ακριβώς 1 Λίτρο (1 dm³)',
    tableData: [
      { label: 'Διαστάσεις', value: '1 dm · 1 dm · 1 dm ＝ 1 dm³' },
      { label: 'Ποσότητα', value: '1 Λίτρο (L)' }
    ],
    explanation: 'Ένας κύβος ακμής 1 dm έχει όγκο 1 dm³, που ισοδυναμεί με 1 λίτρο.'
  });

  // Q5: Υπολογισμός όγκου κύβου με ακμή 4 cm (Input αριθμού)
  const a5 = 4;
  const vol5 = a5 * a5 * a5; // 64
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΓΚΟΥ ΚΥΒΟΥ (Α = 4 CM)',
    prompt: `Πόσα cm³ είναι ο όγκος ενός κύβου με ακμή 4 cm; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(vol5),
    tableData: [
      { label: 'Ακμή', value: '4 cm' },
      { label: 'Τύπος', value: 'V ＝ 4 · 4 · 4' },
      { label: 'Όγκος', value: '64 cm³' }
    ],
    explanation: `4 · 4 · 4 ＝ 64 cm³.`
  });

  // Q6: Μετατροπή m³ σε dm³ (Input αριθμού)
  const m3Q6 = randInt(2, 6);
  const dm3Q6 = m3Q6 * 1000;
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΜΕΤΑΤΡΟΠΗ M³ ΣΕ DM³',
    prompt: `Πόσα κυβικά δεκατόμετρα (dm³) είναι τα ${m3Q6} m³; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(dm3Q6),
    tableData: [
      { label: 'Αρχική τιμή', value: `${m3Q6} m³` },
      { label: 'Κανόνας', value: 'Κατεβαίνουμε 1 σκαλοπάτι (· 1.000)' },
      { label: 'Αποτέλεσμα', value: `${m3Q6} · 1.000 ＝ ${dm3Q6} dm³` }
    ],
    explanation: `${m3Q6} · 1.000 ＝ ${dm3Q6} dm³.`
  });

  // Q7: Με ποιον αριθμό πολλαπλασιάζουμε σε κάθε σκαλοπάτι όγκου (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΣΚΑΛΑ ΜΟΝΑΔΩΝ ΟΓΚΟΥ',
    prompt: 'Με ποιον αριθμό πολλαπλασιάζουμε για κάθε σκαλοπάτι που κατεβαίνουμε στις μονάδες μέτρησης όγκου (π.χ. από m³ σε dm³);',
    options: ensureFourUniqueOptions('Με το 1.000 (γιατί είναι 3 διαστάσεις: 10 · 10 · 10)', () => [
      'Με το 100',
      'Με το 10',
      'Με το 3'
    ]),
    correctAnswer: 'Με το 1.000 (γιατί είναι 3 διαστάσεις: 10 · 10 · 10)',
    tableData: [
      { label: 'Μήκος (1D)', value: 'Βήμα ανά 10' },
      { label: 'Επιφάνεια (2D)', value: 'Βήμα ανά 100 (10 · 10)' },
      { label: 'Όγκος (3D)', value: 'Βήμα ανά 1.000 (10 · 10 · 10)' }
    ],
    explanation: 'Στον όγκο έχουμε 3 διαστάσεις, γι\' αυτό κάθε σκαλοπάτι αντιστοιχεί σε πολλαπλασιασμό ή διαίρεση με το 1.000.'
  });

  // Q8: Τύπος όγκου ορθογωνίου παραλληλεπιπέδου (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΤΥΠΟΣ ΟΓΚΟΥ ΟΡΘΟΓΩΝΙΟΥ',
    prompt: 'Πώς υπολογίζουμε τον όγκο (V) ενός ορθογωνίου παραλληλεπιπέδου;',
    options: ensureFourUniqueOptions('Μήκος · Πλάτος · Ύψος (V ＝ α · β · γ)', () => [
      '2 · (α · β ＋ β · γ ＋ α · γ)',
      'Μήκος ＋ Πλάτος ＋ Ύψος',
      '(Μήκος · Πλάτος) : Ύψος'
    ]),
    correctAnswer: 'Μήκος · Πλάτος · Ύψος (V ＝ α · β · γ)',
    tableData: [
      { label: 'Τύπος όγκου', value: 'V ＝ α · β · γ (Μήκος · Πλάτος · Ύψος)' },
      { label: 'Εναλλακτικά', value: 'V ＝ Εμβαδόν Βάσης · Ύψος' }
    ],
    explanation: 'Ο όγκος του ορθογωνίου παραλληλεπιπέδου βρίσκεται πολλαπλασιάζοντας και τις τρεις διαστάσεις του: V ＝ α · β · γ.'
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

export default function OgkosAskiseisPage() {
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
      title="Ασκήσεις: Όγκος &amp; Χωρητικότητα (m³ και Λίτρα) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στον όγκο κύβου και παραλληλεπιπέδου, μετατροπές m³ σε λίτρα (L) και χωρητικότητα δεξαμενών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/80-ogkos"
      backText="Θεωρία Κεφ. 80"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/80-ogkos"
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
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 80 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Ογκος και Χωρητικοτητα')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στον υπολογισμό όγκου κύβου και παραλληλεπιπέδου, στις μετατροπές μονάδων (m³, dm³, cm³) και στη μαγική σχέση 1 dm³ ＝ 1 L μέσα από 12 δυναμικές ερωτήσεις.
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

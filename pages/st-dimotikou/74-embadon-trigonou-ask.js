// pages/st-dimotikou/74-embadon-trigonou-ask.js
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

// POOL ΓΙΑ Q9: Υπολογισμός Εμβαδού Τριγώνου [Ε ＝ (β · υ) : 2]
const PROBLEM_POOL_Q9 = [
  // 1. Γενικό τρίγωνο με παγίδα την πλάγια πλευρά
  () => {
    const b = randInt(12, 28);
    const h = randInt(6, 16);
    const slant = h + randInt(3, 8);
    const area = (b * h) / 2;
    const correct = `${formatNum(area)} cm²`;
    return {
      title: 'ΕΜΒΑΔΟΝ ΤΡΙΓΩΝΟΥ',
      prompt: `Σε ένα τρίγωνο η βάση είναι ${b} cm, το αντίστοιχο κάθετο ύψος είναι ${h} cm και η πλάγια πλευρά είναι ${slant} cm. Πόσο είναι το εμβαδόν του τριγώνου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(b * h)} cm²`,
        `${formatNum((b * slant) / 2)} cm²`,
        `${formatNum(area + 15)} cm²`,
        `${formatNum(area - 10 > 0 ? area - 10 : area + 25)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάση (β)', value: `${b} cm` },
        { label: 'Κάθετο ύψος (υ)', value: `${h} cm` },
        { label: 'Πλάγια πλευρά', value: `${slant} cm (δεν χρειάζεται)` },
        { label: 'Πράξη', value: `(${b} · ${h}) : 2 ＝ ${b * h} : 2 ＝ ${formatNum(area)} cm²` }
      ],
      explanation: `Εφαρμόζουμε τον τύπο: Ε ＝ (β · υ) : 2 ＝ (${b} · ${h}) : 2 ＝ ${formatNum(area)} cm². Η πλάγια πλευρά δεν χρησιμοποιείται στον υπολογισμό.`
    };
  },
  // 2. Τριγωνικό πανί σκάφους
  () => {
    const b = randInt(4, 10);
    const h = randInt(8, 16);
    const area = (b * h) / 2;
    const correct = `${formatNum(area)} m²`;
    return {
      title: 'ΠΑΝΙ ΙΣΤΙΟΦΟΡΟΥ',
      prompt: `Το τριγωνικό πανί ενός ιστιοφόρου έχει βάση ${b} m και αντίστοιχο ύψος ${h} m. Πόσα τετραγωνικά μέτρα (m²) πανιού χρειάστηκαν για την κατασκευή του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(b * h)} m²`,
        `${formatNum(area + 8)} m²`,
        `${formatNum(area - 6 > 0 ? area - 6 : area + 12)} m²`,
        `${formatNum(area * 2)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Βάση (β)', value: `${b} m` },
        { label: 'Ύψος (υ)', value: `${h} m` },
        { label: 'Πράξη', value: `(${b} · ${h}) : 2 ＝ ${formatNum(area)} m²` }
      ],
      explanation: `Ε ＝ (β · υ) : 2 ＝ (${b} · ${h}) : 2 ＝ ${formatNum(area)} m².`
    };
  },
  // 3. Τριγωνικό παρτέρι
  () => {
    const b = randInt(6, 14);
    const h = randInt(4, 10);
    const area = (b * h) / 2;
    const correct = `${formatNum(area)} m²`;
    return {
      title: 'ΤΡΙΓΩΝΙΚΟ ΠΑΡΤΕΡΙ',
      prompt: `Ένα τριγωνικό παρτέρι σε ένα πάρκο έχει μήκος βάσης ${b} m και το αντίστοιχο ύψος του είναι ${h} m. Ποια είναι η επιφάνειά του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(b * h)} m²`,
        `${formatNum(area + 5)} m²`,
        `${formatNum(area - 5 > 0 ? area - 5 : area + 10)} m²`,
        `${formatNum(b + h)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Βάση', value: `${b} m` },
        { label: 'Ύψος', value: `${h} m` },
        { label: 'Εμβαδόν', value: `(${b} · ${h}) : 2 ＝ ${formatNum(area)} m²` }
      ],
      explanation: `Ε ＝ (β · υ) : 2 ＝ (${b} · ${h}) : 2 ＝ ${formatNum(area)} m².`
    };
  },
  // 4. Μεταλλικό τρίγωνο
  () => {
    const b = 18;
    const h = 10;
    const area = (b * h) / 2;
    const correct = '90 cm²';
    return {
      title: 'ΜΕΤΑΛΛΙΚΟ ΤΡΙΓΩΝΟ',
      prompt: `Ένα μεταλλικό τρίγωνο έχει βάση 18 cm και ύψος 10 cm. Πόσο είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => ['180 cm²', '45 cm²', '100 cm²', '80 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάση', value: '18 cm' },
        { label: 'Ύψος', value: '10 cm' },
        { label: 'Πράξη', value: '(18 · 10) : 2 ＝ 180 : 2 ＝ 90 cm²' }
      ],
      explanation: `(18 · 10) : 2 ＝ 90 cm².`
    };
  },
  // 5. Τριγωνική πινακίδα
  () => {
    const b = 60;
    const h = 40;
    const area = (b * h) / 2;
    const correct = `${formatNum(area)} cm²`;
    return {
      title: 'ΤΡΙΓΩΝΙΚΗ ΠΙΝΑΚΙΔΑ',
      prompt: `Μια πινακίδα σήμανσης έχει σχήμα τριγώνου με βάση 60 cm και ύψος 40 cm. Πόσο είναι το εμβαδόν της σε cm²;`,
      options: ensureFourUniqueOptions(correct, () => ['2.400 cm²', '600 cm²', '1.000 cm²', '1.800 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάση', value: '60 cm' },
        { label: 'Ύψος', value: '40 cm' },
        { label: 'Πράξη', value: '(60 · 40) : 2 ＝ 2.400 : 2 ＝ 1.200 cm²' }
      ],
      explanation: `(60 · 40) : 2 ＝ 1.200 cm².`
    };
  },
  // 6. Τριγωνική σκεπή
  () => {
    const b = 14;
    const h = 5;
    const area = (b * h) / 2;
    const correct = '35 m²';
    return {
      title: 'ΤΡΙΓΩΝΙΚΗ ΜΕΤΩΠΗ ΣΚΕΠΗΣ',
      prompt: `Η τριγωνική μετώπη μιας σοφίτας έχει βάση 14 m και ύψος στον κορφιά 5 m. Πόσα τετραγωνικά μέτρα (m²) είναι η επιφάνειά της;`,
      options: ensureFourUniqueOptions(correct, () => ['70 m²', '40 m²', '30 m²', '45 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Βάση', value: '14 m' },
        { label: 'Ύψος', value: '5 m' },
        { label: 'Πράξη', value: '(14 · 5) : 2 ＝ 70 : 2 ＝ 35 m²' }
      ],
      explanation: `(14 · 5) : 2 ＝ 35 m².`
    };
  }
];

// POOL ΓΙΑ Q10: Ορθογώνια Τρίγωνα [Ε ＝ (α · β) : 2]
const PROBLEM_POOL_Q10 = [
  // 1. Ορθογώνιο τρίγωνο με υποτείνουσα ως παγίδα
  () => {
    const a = 6;
    const b = 8;
    const c = 10; // Υποτείνουσα
    const area = (a * b) / 2; // 24
    const correct = `${area} cm²`;
    return {
      title: 'ΟΡΘΟΓΩΝΙΟ ΤΡΙΓΩΝΟ ΜΕ 3 ΠΛΕΥΡΕΣ',
      prompt: `Ένα ορθογώνιο τρίγωνο έχει πλευρές 6 cm, 8 cm και 10 cm (όπου η πλευρά των 10 cm είναι η μεγαλύτερη, απέναντι από την ορθή γωνία). Πόσο είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => [
        '48 cm²',
        '30 cm²',
        '40 cm²',
        '60 cm²'
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: '1η κάθετη πλευρά (βάση)', value: '6 cm' },
        { label: '2η κάθετη πλευρά (ύψος)', value: '8 cm' },
        { label: 'Υποτείνουσα', value: '10 cm (δεν χρειάζεται)' },
        { label: 'Πράξη', value: '(6 · 8) : 2 ＝ 48 : 2 ＝ 24 cm²' }
      ],
      explanation: `Στο ορθογώνιο τρίγωνο οι δύο κάθετες πλευρές δρουν ως βάση και ύψος: Ε ＝ (6 · 8) : 2 ＝ 24 cm². Η μεγαλύτερη πλευρά (υποτείνουσα) δεν χρησιμοποιείται.`
    };
  },
  // 2. Ορθογώνιο τρίγωνο 5, 12, 13
  () => {
    const a = 5;
    const b = 12;
    const area = (a * b) / 2; // 30
    const correct = `${area} cm²`;
    return {
      title: 'ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ',
      prompt: `Σε ένα ορθογώνιο τρίγωνο οι δύο κάθετες πλευρές του μετρούν 5 cm και 12 cm. Πόσο είναι το εμβαδόν του τριγώνου;`,
      options: ensureFourUniqueOptions(correct, () => ['60 cm²', '35 cm²', '25 cm²', '40 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Κάθετες πλευρές', value: '5 cm και 12 cm' },
        { label: 'Πράξη', value: '(5 · 12) : 2 ＝ 60 : 2 ＝ 30 cm²' }
      ],
      explanation: `Ε ＝ (5 · 12) : 2 ＝ 30 cm².`
    };
  },
  // 3. Τριγωνικό οικόπεδο σε γωνία δρόμων (ορθογώνιο)
  () => {
    const a = randInt(15, 30);
    const b = randInt(10, 25);
    const area = (a * b) / 2;
    const correct = `${formatNum(area)} m²`;
    return {
      title: 'ΓΩΝΙΑΚΟ ΟΙΚΟΠΕΔΟ',
      prompt: `Ένα γωνιακό οικόπεδο έχει σχήμα ορθογωνίου τριγώνου. Οι δύο πλευρές που σχηματίζουν την ορθή γωνία πάνω στις δύο οδούς έχουν μήκη ${a} m και ${b} m. Ποιο είναι το εμβαδόν του οικοπέδου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a * b)} m²`,
        `${formatNum(area + 25)} m²`,
        `${formatNum(area - 20 > 0 ? area - 20 : area + 40)} m²`,
        `${formatNum(area * 2)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: '1η κάθετη πλευρά', value: `${a} m` },
        { label: '2η κάθετη πλευρά', value: `${b} m` },
        { label: 'Πράξη', value: `(${a} · ${b}) : 2 ＝ ${formatNum(area)} m²` }
      ],
      explanation: `Ε ＝ (${a} · ${b}) : 2 ＝ ${formatNum(area)} m².`
    };
  },
  // 4. Ισοσκελές ορθογώνιο τρίγωνο
  () => {
    const a = randInt(6, 14);
    const area = (a * a) / 2;
    const correct = `${formatNum(area)} cm²`;
    return {
      title: 'ΙΣΟΣΚΕΛΕΣ ΟΡΘΟΓΩΝΙΟ ΤΡΙΓΩΝΟ',
      prompt: `Ένα ισοσκελές ορθογώνιο τρίγωνο έχει τις δύο κάθετες πλευρές του ίσες με ${a} cm την καθεμία. Πόσο είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a * a)} cm²`,
        `${formatNum(area + 10)} cm²`,
        `${formatNum(area - 6 > 0 ? area - 6 : area + 15)} cm²`,
        `${formatNum(a * 4)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Κάθετες πλευρές', value: `${a} cm και ${a} cm (ίσες)` },
        { label: 'Πράξη', value: `(${a} · ${a}) : 2 ＝ ${formatNum(area)} cm²` }
      ],
      explanation: `Ε ＝ (${a} · ${a}) : 2 ＝ ${formatNum(area)} cm².`
    };
  },
  // 5. Διαχωρισμός ορθογωνίου σε 2 ορθογώνια τρίγωνα
  () => {
    const l = 20;
    const w = 15;
    const rectArea = l * w; // 300
    const triangleArea = rectArea / 2; // 150
    const correct = '150 cm²';
    return {
      title: 'ΔΙΑΧΩΡΙΣΜΟΣ ΜΕ ΔΙΑΓΩΝΙΟ',
      prompt: `Χωρίζουμε ένα ορθογώνιο διαστάσεων 20 cm και 15 cm με τη διαγώνιό του σε δύο ίσα ορθογώνια τρίγωνα. Πόσο είναι το εμβαδόν καθενός από τα δύο τρίγωνα;`,
      options: ensureFourUniqueOptions(correct, () => ['300 cm²', '100 cm²', '75 cm²', '200 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Εμβαδόν ορθογωνίου', value: '20 · 15 ＝ 300 cm²' },
        { label: 'Κάθε τρίγωνο', value: '300 : 2 ＝ 150 cm²' }
      ],
      explanation: `Κάθε τρίγωνο είναι το μισό του ορθογωνίου: (20 · 15) : 2 ＝ 150 cm².`
    };
  },
  // 6. Ορθογώνιο τρίγωνο 9 και 16
  () => {
    const a = 9;
    const b = 16;
    const area = (a * b) / 2; // 72
    const correct = '72 cm²';
    return {
      title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ',
      prompt: `Σε ένα ορθογώνιο τρίγωνο οι κάθετες πλευρές είναι 9 cm και 16 cm. Πόσο είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => ['144 cm²', '64 cm²', '81 cm²', '50 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Κάθετες πλευρές', value: '9 cm και 16 cm' },
        { label: 'Πράξη', value: '(9 · 16) : 2 ＝ 144 : 2 ＝ 72 cm²' }
      ],
      explanation: `(9 · 16) : 2 ＝ 72 cm².`
    };
  }
];

// POOL ΓΙΑ Q11: Εύρεση Βάσης ή Ύψους [β ＝ (2 · Ε) : υ / υ ＝ (2 · Ε) : β]
const PROBLEM_POOL_Q11 = [
  // 1. Εύρεση ύψους όταν γνωρίζουμε το εμβαδόν
  () => {
    const b = randInt(10, 25);
    const h = randInt(6, 14);
    const area = (b * h) / 2;
    const correct = `${h} cm`;
    return {
      title: 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΤΡΙΓΩΝΟΥ',
      prompt: `Ένα τρίγωνο έχει εμβαδόν ${formatNum(area)} cm² και μήκος βάσης ${b} cm. Πόσο είναι το αντίστοιχο ύψος του τριγώνου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${h + 3} cm`,
        `${h - 2 > 0 ? h - 2 : h + 4} cm`,
        `${Math.round(area / b)} cm`,
        `${h * 2} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν (Ε)', value: `${formatNum(area)} cm²` },
        { label: 'Διπλάσιο εμβαδόν (2 · Ε)', value: `${formatNum(2 * area)} cm²` },
        { label: 'Βάση (β)', value: `${b} cm` },
        { label: 'Πράξη ύψους', value: `(2 · ${formatNum(area)}) : ${b} ＝ ${formatNum(2 * area)} : ${b} ＝ ${h} cm` }
      ],
      explanation: `Πρώτα διπλασιάζουμε το εμβαδόν: 2 · ${formatNum(area)} ＝ ${formatNum(2 * area)} cm². Έπειτα διαιρούμε με τη βάση: ${formatNum(2 * area)} : ${b} ＝ ${h} cm.`
    };
  },
  // 2. Εύρεση βάσης όταν γνωρίζουμε το εμβαδόν
  () => {
    const b = randInt(14, 28);
    const h = randInt(8, 16);
    const area = (b * h) / 2;
    const correct = `${b} m`;
    return {
      title: 'ΕΥΡΕΣΗ ΒΑΣΗΣ ΤΡΙΓΩΝΟΥ',
      prompt: `Σε ένα τριγωνικό οικόπεδο το εμβαδόν είναι ${formatNum(area)} m² και το ύψος είναι ${h} m. Πόσα μέτρα (m) είναι η αντίστοιχη βάση του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${b + 4} m`,
        `${b - 4 > 0 ? b - 4 : b + 6} m`,
        `${Math.round(area / h)} m`,
        `${b * 2} m`
      ]),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Εμβαδόν (Ε)', value: `${formatNum(area)} m²` },
        { label: 'Διπλάσιο εμβαδόν', value: `${formatNum(2 * area)} m²` },
        { label: 'Ύψος (υ)', value: `${h} m` },
        { label: 'Πράξη βάσης', value: `(2 · ${formatNum(area)}) : ${h} ＝ ${b} m` }
      ],
      explanation: `β ＝ (2 · Ε) : υ ＝ (2 · ${formatNum(area)}) : ${h} ＝ ${b} m.`
    };
  },
  // 3. Εύρεση ύψους με Ε = 60 cm² και β = 12 cm
  () => {
    const area = 60;
    const b = 12;
    const h = (2 * area) / b; // 10
    const correct = '10 cm';
    return {
      title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΥΨΟΥΣ ΑΠΟ ΕΜΒΑΔΟΝ',
      prompt: `Το εμβαδόν ενός τριγώνου είναι 60 cm² και η βάση του είναι 12 cm. Πόσο είναι το ύψος του;`,
      options: ensureFourUniqueOptions(correct, () => ['5 cm', '15 cm', '8 cm', '20 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν', value: '60 cm²' },
        { label: 'Διπλάσιο εμβαδόν', value: '2 · 60 ＝ 120 cm²' },
        { label: 'Πράξη', value: '120 : 12 ＝ 10 cm' }
      ],
      explanation: `(2 · 60) : 12 ＝ 120 : 12 ＝ 10 cm.`
    };
  },
  // 4. Εύρεση βάσης με Ε = 48 m² και υ = 8 m
  () => {
    const area = 48;
    const h = 8;
    const b = (2 * area) / h; // 12
    const correct = '12 m';
    return {
      title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΒΑΣΗΣ ΑΠΟ ΕΜΒΑΔΟΝ',
      prompt: `Ένα τρίγωνο έχει εμβαδόν 48 m² και ύψος 8 m. Πόσο είναι το μήκος της βάσης του;`,
      options: ensureFourUniqueOptions(correct, () => ['6 m', '16 m', '10 m', '14 m']),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Εμβαδόν', value: '48 m²' },
        { label: 'Διπλάσιο εμβαδόν', value: '2 · 48 ＝ 96 m²' },
        { label: 'Πράξη', value: '96 : 8 ＝ 12 m' }
      ],
      explanation: `(2 · 48) : 8 ＝ 96 : 8 ＝ 12 m.`
    };
  },
  // 5. Εύρεση κάθετης πλευράς σε ορθογώνιο τρίγωνο
  () => {
    const a = 15;
    const area = 75;
    const b = (2 * area) / a; // 10
    const correct = '10 cm';
    return {
      title: 'ΕΥΡΕΣΗ ΚΑΘΕΤΗΣ ΠΛΕΥΡΑΣ',
      prompt: `Σε ένα ορθογώνιο τρίγωνο το εμβαδόν είναι 75 cm² και η μία κάθετη πλευρά του είναι 15 cm. Πόσο είναι το μήκος της άλλης κάθετης πλευράς;`,
      options: ensureFourUniqueOptions(correct, () => ['5 cm', '12 cm', '8 cm', '20 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν', value: '75 cm²' },
        { label: 'Διπλάσιο εμβαδόν', value: '2 · 75 ＝ 150 cm²' },
        { label: 'Άλλη κάθετη', value: '150 : 15 ＝ 10 cm' }
      ],
      explanation: `(2 · 75) : 15 ＝ 150 : 15 ＝ 10 cm.`
    };
  },
  // 6. Εύρεση ύψους με Ε = 100 cm² και β = 20 cm
  () => {
    const area = 100;
    const b = 20;
    const h = (2 * area) / b; // 10
    const correct = '10 cm';
    return {
      title: 'ΥΨΟΣ ΣΕ ΤΡΙΓΩΝΟ 100 CM²',
      prompt: `Ένα τρίγωνο έχει εμβαδόν 100 cm² και βάση 20 cm. Πόσο είναι το ύψος του;`,
      options: ensureFourUniqueOptions(correct, () => ['5 cm', '15 cm', '20 cm', '8 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν', value: '100 cm²' },
        { label: 'Διπλάσιο εμβαδόν', value: '2 · 100 ＝ 200 cm²' },
        { label: 'Πράξη', value: '200 : 20 ＝ 10 cm' }
      ],
      explanation: `(2 · 100) : 20 ＝ 200 : 20 ＝ 10 cm.`
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα, Μετατροπές Μονάδων & Σύγκριση Σχημάτων
const PROBLEM_POOL_Q12 = [
  // 1. Βάση σε m και ύψος σε cm
  () => {
    const bM = 4;
    const hCm = 50;
    const bCm = bM * 100; // 400 cm
    const areaCm2 = (bCm * hCm) / 2; // 10.000 cm² = 1 m²
    const correct = `${formatNum(areaCm2)} cm²`;
    return {
      title: 'ΔΙΑΦΟΡΕΤΙΚΕΣ ΜΟΝΑΔΕΣ (M ΚΑΙ CM)',
      prompt: `Σε ένα τρίγωνο η βάση είναι ${bM} m και το αντίστοιχο ύψος είναι ${hCm} cm. Πόσο είναι το εμβαδόν του σε τετραγωνικά εκατοστόμετρα (cm²);`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum((bM * hCm) / 2)} cm²`,
        `${formatNum(areaCm2 / 10)} cm²`,
        `${formatNum(areaCm2 * 2)} cm²`,
        `${formatNum(areaCm2 + 1000)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάση σε cm (· 100)', value: `${bM} m ＝ ${bCm} cm` },
        { label: 'Ύψος σε cm', value: `${hCm} cm` },
        { label: 'Πράξη', value: `(${bCm} · ${hCm}) : 2 ＝ ${formatNum(areaCm2)} cm²` }
      ],
      explanation: `Μετατρέπουμε τα μέτρα σε εκατοστά: ${bM} m ＝ ${bCm} cm. Εμβαδόν: (${bCm} · ${hCm}) : 2 ＝ ${formatNum(areaCm2)} cm² (ή 1 m²).`
    };
  },
  // 2. Τρίγωνο και ισοδύναμο παραλληλόγραμμο
  () => {
    const b = 16;
    const hTriangle = 10;
    const areaTriangle = (b * hTriangle) / 2; // 80 cm²
    // Παραλληλόγραμμο με ίδια βάση 16 και ίσο εμβαδόν 80 => h = 80 / 16 = 5 (το μισό ύψος)
    const hParall = areaTriangle / b; // 5 cm
    const correct = `${hParall} cm`;
    return {
      title: 'ΙΣΟΔΥΝΑΜΟ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟ',
      prompt: `Ένα τρίγωνο έχει βάση 16 cm και ύψος 10 cm (εμβαδόν 80 cm²). Ένα παραλληλόγραμμο έχει την ίδια βάση 16 cm και το ίδιο εμβαδόν (80 cm²). Πόσο είναι το ύψος του παραλληλογράμμου;`,
      options: ensureFourUniqueOptions(correct, () => ['10 cm', '20 cm', '8 cm', '4 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν τριγώνου', value: '(16 · 10) : 2 ＝ 80 cm²' },
        { label: 'Εμβαδόν παραλληλογράμμου', value: '80 cm² (ίσο)' },
        { label: 'Ύψος παραλληλογράμμου', value: '80 : 16 ＝ 5 cm' }
      ],
      explanation: `Το εμβαδόν του παραλληλογράμμου είναι β · υ. Αφού έχει την ίδια βάση και το ίδιο εμβαδόν, το ύψος του είναι το μισό του τριγώνου: 80 : 16 ＝ 5 cm.`
    };
  },
  // 3. Τριγωνικό οικόπεδο σε στρέμματα
  () => {
    const b = 100;
    const h = 60;
    const areaM2 = (b * h) / 2; // 3.000 m²
    const stremmata = areaM2 / 1000; // 3 στρέμματα
    const correct = `${stremmata} στρέμματα`;
    return {
      title: 'ΤΡΙΓΩΝΙΚΟΣ ΑΓΡΟΣ ΣΕ ΣΤΡΕΜΜΑΤΑ',
      prompt: `Ένας τριγωνικός αγρός έχει βάση 100 m και αντίστοιχο ύψος 60 m. Πόσα στρέμματα είναι η έκτασή του;`,
      options: ensureFourUniqueOptions(correct, () => ['6 στρέμματα', '30 στρέμματα', '0,3 στρέμματα', '1,5 στρέμματα']),
      correctAnswer: correct,
      unit: 'στρέμματα',
      tableData: [
        { label: 'Εμβαδόν σε m²', value: '(100 · 60) : 2 ＝ 6.000 : 2 ＝ 3.000 m²' },
        { label: 'Στρέμματα (: 1.000)', value: '3.000 : 1.000 ＝ 3 στρέμματα' }
      ],
      explanation: `Ε ＝ (100 · 60) : 2 ＝ 3.000 m². Επειδή 1 στρέμμα ＝ 1.000 m², έχουμε: 3.000 : 1.000 ＝ 3 στρέμματα.`
    };
  },
  // 4. Εμβαδόν σε dm² και μετατροπή σε cm²
  () => {
    const b = 6; // dm
    const h = 4; // dm
    const areaDm2 = (b * h) / 2; // 12 dm²
    const areaCm2 = areaDm2 * 100; // 1.200 cm²
    const correct = `${formatNum(areaCm2)} cm²`;
    return {
      title: 'ΜΕΤΑΤΡΟΠΗ ΑΠΟ DM² ΣΕ CM²',
      prompt: `Ένα τρίγωνο έχει βάση 6 dm και ύψος 4 dm (εμβαδόν 12 dm²). Πόσα τετραγωνικά εκατοστόμετρα (cm²) είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => ['120 cm²', '12.000 cm²', '2.400 cm²', '600 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Εμβαδόν σε dm²', value: '(6 · 4) : 2 ＝ 12 dm²' },
        { label: 'Σχέση dm²/cm²', value: '1 dm² ＝ 100 cm²' },
        { label: 'Πράξη', value: '12 · 100 ＝ 1.200 cm²' }
      ],
      explanation: `1 dm² ＝ 100 cm². Άρα: 12 · 100 ＝ 1.200 cm².`
    };
  },
  // 5. Διπλασιασμός του ύψους
  () => {
    const correct = 'Το εμβαδόν διπλασιάζεται';
    return {
      title: 'ΜΕΤΑΒΟΛΗ ΔΙΑΣΤΑΣΕΩΝ ΤΡΙΓΩΝΟΥ',
      prompt: `Αν σε ένα τρίγωνο διπλασιάσουμε το ύψος του διατηρώντας τη βάση σταθερή, πώς θα αλλάξει το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Το εμβαδόν τετραπλασιάζεται',
        'Το εμβαδόν παραμένει το ίδιο',
        'Το εμβαδόν υποδιπλασιάζεται'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Αρχικό εμβαδόν', value: 'Ε₁ ＝ (β · υ) : 2' },
        { label: 'Νέο εμβαδόν', value: 'Ε₂ ＝ (β · 2υ) : 2 ＝ 2 · [(β · υ) : 2] ＝ 2 · Ε₁' }
      ],
      explanation: `Το εμβαδόν είναι ανάλογο του ύψους. Αν διπλασιαστεί το ύψος με σταθερή βάση, το εμβαδόν διπλασιάζεται.`
    };
  },
  // 6. Διπλασιασμός και των δύο διαστάσεων
  () => {
    const correct = 'Το εμβαδόν γίνεται 4 φορές μεγαλύτερο (τετραπλασιάζεται)';
    return {
      title: 'ΔΙΠΛΑΣΙΑΣΜΟΣ ΒΑΣΗΣ ΚΑΙ ΥΨΟΥΣ',
      prompt: `Αν σε ένα τρίγωνο διπλασιάσουμε και τη βάση και το ύψος του, πόσες φορές μεγαλύτερο θα γίνει το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => [
        '2 φορές μεγαλύτερο',
        '8 φορές μεγαλύτερο',
        'Παραμένει το ίδιο'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Συντελεστής βάσης', value: '2' },
        { label: 'Συντελεστής ύψους', value: '2' },
        { label: 'Συνολική μεταβολή', value: '2 · 2 ＝ 4 φορές μεγαλύτερο' }
      ],
      explanation: `Όταν διπλασιάζονται και οι δύο διαστάσεις, το εμβαδόν πολλαπλασιάζεται επί 2 · 2 ＝ 4 (τετραπλασιάζεται).`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Τύπος εμβαδού τριγώνου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΤΥΠΟΣ ΕΜΒΑΔΟΥ ΤΡΙΓΩΝΟΥ',
    prompt: isQ1True
      ? 'Το εμβαδόν κάθε τριγώνου ισούται με το μισό του γινομένου της βάσης του επί το αντίστοιχο ύψος: Ε ＝ (β · υ) : 2.'
      : 'Το εμβαδόν κάθε τριγώνου υπολογίζεται πολλαπλασιάζοντας απλώς τη βάση επί το ύψος (Ε ＝ β · υ), χωρίς διαίρεση με το 2.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Σωστός τύπος τριγώνου', value: 'Ε ＝ (β · υ) : 2' },
      { label: 'Τύπος παραλληλογράμμου', value: 'Ε ＝ β · υ (ολόκληρο το σχήμα)' }
    ],
    explanation: isQ1True
      ? 'Το εμβαδόν κάθε τριγώνου είναι πάντοτε το μισό του αντίστοιχου παραλληλογράμμου: Ε ＝ (β · υ) : 2.'
      : 'Ο τύπος Ε ＝ β · υ δίνει το εμβαδόν του παραλληλογράμμου. Το τρίγωνο είναι ακριβώς το μισό, άρα διαιρούμε πάντοτε με το 2: Ε ＝ (β · υ) : 2.'
  });

  // Q2: Γιατί διαιρούμε με το 2 (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΓΕΩΜΕΤΡΙΚΗ ΕΡΜΗΝΕΙΑ',
    prompt: 'Γιατί στον τύπο του εμβαδού τριγώνου διαιρούμε πάντοτε με το 2;',
    options: ensureFourUniqueOptions(
      'Επειδή δύο ολόιδια τρίγωνα ενώνονται και σχηματίζουν ένα παραλληλόγραμμο με εμβαδόν β · υ',
      () => [
        'Επειδή το τρίγωνο έχει 3 πλευρές',
        'Επειδή όλα τα τρίγωνα έχουν ορθές γωνίες',
        'Επειδή έτσι αποφασίστηκε τυχαία'
      ]
    ),
    correctAnswer: 'Επειδή δύο ολόιδια τρίγωνα ενώνονται και σχηματίζουν ένα παραλληλόγραμμο με εμβαδόν β · υ',
    tableData: [
      { label: '2 τρίγωνα', value: 'Σχηματίζουν παραλληλόγραμμο (Ε ＝ β · υ)' },
      { label: '1 τρίγωνο', value: 'Αποτελεί το μισό: (β · υ) : 2' }
    ],
    explanation: 'Κάθε τρίγωνο είναι ακριβώς το μισό ενός παραλληλογράμμου με την ίδια βάση και το ίδιο ύψος.'
  });

  // Q3: Εμβαδόν ορθογωνίου τριγώνου (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΟΡΘΟΓΩΝΙΟ ΤΡΙΓΩΝΟ',
    prompt: 'Πώς υπολογίζουμε το εμβαδόν ενός ορθογωνίου τριγώνου;',
    options: ensureFourUniqueOptions(
      'Πολλαπλασιάζουμε τις δύο κάθετες πλευρές του και διαιρούμε με το 2: Ε ＝ (α · β) : 2',
      () => [
        'Πολλαπλασιάζουμε και τις τρεις πλευρές του μαζί',
        'Προσθέτουμε τις πλευρές του και διαιρούμε με το 2',
        'Πολλαπλασιάζουμε τη μεγαλύτερη πλευρά με το 2'
      ]
    ),
    correctAnswer: 'Πολλαπλασιάζουμε τις δύο κάθετες πλευρές του και διαιρούμε με το 2: Ε ＝ (α · β) : 2',
    tableData: [
      { label: 'Ιδιότητα', value: 'Οι δύο κάθετες πλευρές είναι η μία βάση και η άλλη ύψος' },
      { label: 'Τύπος', value: 'Ε ＝ (κάθετη₁ · κάθετη₂) : 2' }
    ],
    explanation: 'Στο ορθογώνιο τρίγωνο οι δύο πλευρές που σχηματίζουν τη γωνία 90° δρουν ως βάση και ύψος: Ε ＝ (α · β) : 2.'
  });

  // Q4: Οπτική αναγνώριση ύψους τριγώνου (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΑΝΑΓΝΩΡΙΣΗ ΥΨΟΥΣ ΤΡΙΓΩΝΟΥ',
    prompt: 'Παρατηρήστε το παρακάτω τρίγωνο. Ποια γραμμή εκφράζει το πραγματικό ύψος (υ) ως προς την κάτω βάση;',
    svg: (
      <svg viewBox="0 0 160 110" className="w-40 h-28 mx-auto my-2 select-none drop-shadow-sm">
        <polygon points="30,85 130,85 60,25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
        <line x1="60" y1="25" x2="60" y2="85" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="60" y="75" width="10" height="10" fill="none" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="65" cy="80" r="1.5" fill="#f59e0b" />
        <text x="50" y="58" fill="#f59e0b" fontSize="11" fontWeight="bold">υ</text>
        <text x="98" y="50" fill="#a855f7" fontSize="10" fontWeight="bold">π</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(
      'Η κίτρινη κατακόρυφη διακεκομμένη γραμμή (υ) με τη γωνία 90°',
      () => [
        'Η μωβ πλάγια πλευρά (π) του τριγώνου',
        'Η αριστερή πλάγια πλευρά του τριγώνου',
        'Το τρίγωνο δεν έχει ύψος'
      ]
    ),
    correctAnswer: 'Η κίτρινη κατακόρυφη διακεκομμένη γραμμή (υ) με τη γωνία 90°',
    tableData: [
      { label: 'Κίτρινη γραμμή (υ)', value: 'Κάθετο ύψος (90°)' },
      { label: 'Μωβ πλευρά (π)', value: 'Πλάγια πλευρά (δεν είναι ύψος)' }
    ],
    explanation: 'Το ύψος είναι πάντοτε το ευθύγραμμο τμήμα που είναι κάθετο στη βάση (η κίτρινη γραμμή με το τετραγωνάκι της ορθής γωνίας).'
  });

  // Q5: Υπολογισμός εμβαδού (Input αριθμού)
  const b5 = randInt(6, 14);
  const h5 = randInt(4, 10);
  const area5 = (b5 * h5) / 2;
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΕΜΒΑΔΟΥ ΣΕ CM²',
    prompt: `Ένα τρίγωνο έχει βάση ${b5} cm και αντίστοιχο ύψος ${h5} cm. Πόσα cm² είναι το εμβαδόν του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: formatNum(area5),
    tableData: [
      { label: 'Βάση (β)', value: `${b5} cm` },
      { label: 'Ύψος (υ)', value: `${h5} cm` },
      { label: 'Πράξη', value: `(${b5} · ${h5}) : 2 ＝ ${b5 * h5} : 2 ＝ ${formatNum(area5)} cm²` }
    ],
    explanation: `Ε ＝ (β · υ) : 2 ＝ (${b5} · ${h5}) : 2 ＝ ${formatNum(area5)} cm².`
  });

  // Q6: Εύρεση ύψους από το εμβαδόν (Input αριθμού)
  const area6 = 36;
  const b6 = 9;
  const h6 = (2 * area6) / b6; // 8
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΑΠΟ ΤΟ ΕΜΒΑΔΟΝ',
    prompt: `Το εμβαδόν ενός τριγώνου είναι 36 m² και η βάση του είναι 9 m. Πόσα μέτρα (m) είναι το αντίστοιχο ύψος του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(h6),
    tableData: [
      { label: 'Εμβαδόν', value: '36 m²' },
      { label: 'Διπλάσιο εμβαδόν', value: '2 · 36 ＝ 72 m²' },
      { label: 'Πράξη ύψους', value: '72 : 9 ＝ 8 m' }
    ],
    explanation: `υ ＝ (2 · Ε) : β ＝ (2 · 36) : 9 ＝ 72 : 9 ＝ 8 m.`
  });

  // Q7: Σχέση τριγώνου και παραλληλογράμμου (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΣΥΓΚΡΙΣΗ ΜΕ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟ',
    prompt: 'Ένα τρίγωνο και ένα παραλληλόγραμμο έχουν την ίδια βάση (β) και το ίδιο ύψος (υ). Ποια σχέση έχουν τα εμβαδά τους;',
    options: ensureFourUniqueOptions(
      'Το εμβαδόν του τριγώνου είναι ακριβώς το μισό από το εμβαδόν του παραλληλογράμμου',
      () => [
        'Έχουν ακριβώς το ίδιο εμβαδόν',
        'Το εμβαδόν του τριγώνου είναι διπλάσιο',
        'Δεν έχουν καμία σταθερή σχέση'
      ]
    ),
    correctAnswer: 'Το εμβαδόν του τριγώνου είναι ακριβώς το μισό από το εμβαδόν του παραλληλογράμμου',
    tableData: [
      { label: 'Εμβαδόν παραλληλογράμμου', value: 'Ε ＝ β · υ' },
      { label: 'Εμβαδόν τριγώνου', value: 'Ε ＝ (β · υ) : 2 (το μισό)' }
    ],
    explanation: 'Με την ίδια βάση και το ίδιο ύψος, το τρίγωνο έχει πάντοτε ακριβώς το μισό εμβαδόν του παραλληλογράμμου.'
  });

  // Q8: Ύψος σε αμβλυγώνιο τρίγωνο (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΥΨΟΣ ΣΕ ΑΜΒΛΥΓΩΝΙΟ ΤΡΙΓΩΝΟ',
    prompt: 'Σε ένα αμβλυγώνιο τρίγωνο, πού μπορεί να «πέσει» το ύψος που φέρνουμε από μία οξεία κορυφή;',
    options: ensureFourUniqueOptions(
      'Έξω από το τρίγωνο, στην προέκταση της απέναντι βάσης',
      () => [
        'Πάντοτε αυστηρά στο κέντρο του τριγώνου',
        'Πάνω σε μία από τις πλευρές του',
        'Δεν υπάρχει ύψος στο αμβλυγώνιο τρίγωνο'
      ]
    ),
    correctAnswer: 'Έξω από το τρίγωνο, στην προέκταση της απέναντι βάσης',
    tableData: [
      { label: 'Αμβλυγώνιο τρίγωνο', value: 'Περιέχει μία αμβλεία γωνία (＞ 90°)' },
      { label: 'Θέση ύψους', value: 'Πέφτει έξω από το σχήμα, στην προέκταση της βάσης' }
    ],
    explanation: 'Στο αμβλυγώνιο τρίγωνο, δύο από τα τρία ύψη βρίσκονται έξω από το τρίγωνο, στην προέκταση της αντίστοιχης βάσης.'
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

export default function EmbadonTrigonouAskiseisPage() {
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
      title="Ασκήσεις: Εμβαδόν Τριγώνου - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στον υπολογισμό εμβαδού τριγώνου με τον τύπο Ε ＝ (β · υ) : 2, ορθογώνια τρίγωνα και εύρεση βάσης ή ύψους για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/74-embadon-trigonou"
      backText="Θεωρία Κεφ. 74"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/74-embadon-trigonou"
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
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 74 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Εμβαδον Τριγωνου')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στον υπολογισμό εμβαδού με τον τύπο Ε ＝ (β · υ) : 2, στα ορθογώνια τρίγωνα και στην εύρεση άγνωστης βάσης ή ύψους μέσα από 12 δυναμικές ερωτήσεις.
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

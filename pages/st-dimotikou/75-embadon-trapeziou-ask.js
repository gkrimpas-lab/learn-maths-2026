// pages/st-dimotikou/75-embadon-trapeziou-ask.js
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

// POOL ΓΙΑ Q9: Υπολογισμός Εμβαδού Τραπεζίου [Ε ＝ [(Β ＋ b) · υ] : 2]
const PROBLEM_POOL_Q9 = [
  // 1. Τραπέζιο οικόπεδο με παγίδα τις πλάγιες πλευρές
  () => {
    const bigB = randInt(20, 40);
    const smallB = randInt(10, bigB - 5);
    const h = randInt(12, 22);
    const slant = h + randInt(3, 7);
    const sum = bigB + smallB;
    const area = (sum * h) / 2;
    const correct = `${formatNum(area)} m²`;
    return {
      title: 'ΤΡΑΠΕΖΙΟ ΟΙΚΟΠΕΔΟ',
      prompt: `Ένα οικόπεδο σχήματος τραπεζίου έχει μεγάλη βάση ${bigB} m, μικρή βάση ${smallB} m, κάθετο ύψος ${h} m και πλάγιες πλευρές ${slant} m και ${slant + 2} m. Ποιο είναι το εμβαδόν του οικοπέδου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(sum * h)} m²`,
        `${formatNum((sum * slant) / 2)} m²`,
        `${formatNum(area + 30)} m²`,
        `${formatNum(area - 30 > 0 ? area - 30 : area + 60)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Μεγάλη βάση (Β)', value: `${bigB} m` },
        { label: 'Μικρή βάση (b)', value: `${smallB} m` },
        { label: 'Κάθετο ύψος (υ)', value: `${h} m` },
        { label: 'Πλάγιες πλευρές', value: 'Δεν χρησιμοποιούνται στον τύπο εμβαδού' },
        { label: 'Πράξη', value: `[(${bigB} ＋ ${smallB}) · ${h}] : 2 ＝ [${sum} · ${h}] : 2 ＝ ${formatNum(area)} m²` }
      ],
      explanation: `Προσθέτουμε πρώτα τις δύο βάσεις: ${bigB} ＋ ${smallB} ＝ ${sum} m. Πολλαπλασιάζουμε με το ύψος και διαιρούμε με το 2: (${sum} · ${h}) : 2 ＝ ${formatNum(area)} m². Οι πλάγιες πλευρές δεν χρειάζονται.`
    };
  },
  // 2. Μεταλλική τραπεζοειδής πλάκα
  () => {
    const bigB = randInt(16, 26);
    const smallB = randInt(8, bigB - 4);
    const h = randInt(6, 14);
    const sum = bigB + smallB;
    const area = (sum * h) / 2;
    const correct = `${formatNum(area)} cm²`;
    return {
      title: 'ΤΡΑΠΕΖΟΕΙΔΗΣ ΠΛΑΚΑ',
      prompt: `Μια μεταλλική πλάκα σε σχήμα τραπεζίου έχει βάσεις ${bigB} cm και ${smallB} cm και απόσταση ανάμεσά τους (ύψος) ${h} cm. Πόσο είναι το εμβαδόν της επιφάνειάς της;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(sum * h)} cm²`,
        `${formatNum(area + 15)} cm²`,
        `${formatNum(area - 15 > 0 ? area - 15 : area + 25)} cm²`,
        `${formatNum(area * 2)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Άθροισμα βάσεων (Β ＋ b)', value: `${bigB} ＋ ${smallB} ＝ ${sum} cm` },
        { label: 'Ύψος (υ)', value: `${h} cm` },
        { label: 'Εμβαδόν', value: `(${sum} · ${h}) : 2 ＝ ${formatNum(area)} cm²` }
      ],
      explanation: `Ε ＝ [(Β ＋ b) · υ] : 2 ＝ [(${bigB} ＋ ${smallB}) · ${h}] : 2 ＝ ${formatNum(area)} cm².`
    };
  },
  // 3. Τραπεζοειδές παρτέρι
  () => {
    const bigB = 15;
    const smallB = 9;
    const h = 6;
    const area = ((bigB + smallB) * h) / 2; // (24 * 6) / 2 = 72
    const correct = `${area} m²`;
    return {
      title: 'ΠΑΡΤΕΡΙ ΣΧΗΜΑΤΟΣ ΤΡΑΠΕΖΙΟΥ',
      prompt: `Σε έναν κήπο κατασκευάζεται παρτέρι σε σχήμα τραπεζίου με βάσεις 15 m και 9 m και ύψος 6 m. Πόσα τετραγωνικά μέτρα (m²) καλύπτει;`,
      options: ensureFourUniqueOptions(correct, () => ['144 m²', '60 m²', '80 m²', '54 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Βάσεις', value: '15 m και 9 m' },
        { label: 'Ύψος', value: '6 m' },
        { label: 'Πράξη', value: '[(15 ＋ 9) · 6] : 2 ＝ [24 · 6] : 2 ＝ 72 m²' }
      ],
      explanation: `[(15 ＋ 9) · 6] : 2 ＝ (24 · 6) : 2 ＝ 144 : 2 ＝ 72 m².`
    };
  },
  // 4. Επιφάνεια τραπεζιού γραφείου
  () => {
    const bigB = 120;
    const smallB = 80;
    const h = 60;
    const area = ((bigB + smallB) * h) / 2; // (200 * 60) / 2 = 6.000 cm²
    const correct = `${formatNum(area)} cm²`;
    return {
      title: 'ΕΠΙΦΑΝΕΙΑ ΓΡΑΦΕΙΟΥ',
      prompt: `Το καπάκι ενός γραφείου έχει σχήμα τραπεζίου με παράλληλες πλευρές 120 cm και 80 cm και ύψος 60 cm. Πόσο είναι το εμβαδόν του σε cm²;`,
      options: ensureFourUniqueOptions(correct, () => ['12.000 cm²', '4.800 cm²', '7.200 cm²', '9.600 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάσεις', value: '120 cm και 80 cm' },
        { label: 'Ύψος', value: '60 cm' },
        { label: 'Πράξη', value: '[(120 ＋ 80) · 60] : 2 ＝ [200 · 60] : 2 ＝ 6.000 cm²' }
      ],
      explanation: `[(120 ＋ 80) · 60] : 2 ＝ 6.000 cm².`
    };
  },
  // 5. Μετώπη γέφυρας
  () => {
    const bigB = 25;
    const smallB = 15;
    const h = 8;
    const area = ((bigB + smallB) * h) / 2; // (40 * 8) / 2 = 160
    const correct = `${area} m²`;
    return {
      title: 'ΜΕΤΩΠΗ ΓΕΦΥΡΑΣ',
      prompt: `Η τσιμεντένια μετώπη μιας γέφυρας έχει σχήμα τραπεζίου με βάσεις 25 m και 15 m και ύψος 8 m. Πόσο είναι το εμβαδόν της μετώπης;`,
      options: ensureFourUniqueOptions(correct, () => ['320 m²', '180 m²', '150 m²', '200 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Βάσεις', value: '25 m και 15 m' },
        { label: 'Ύψος', value: '8 m' },
        { label: 'Πράξη', value: '[(25 ＋ 15) · 8] : 2 ＝ [40 · 8] : 2 ＝ 160 m²' }
      ],
      explanation: `[(25 ＋ 15) · 8] : 2 ＝ 160 m².`
    };
  },
  // 6. Τζαμαρία στέγης
  () => {
    const bigB = 10;
    const smallB = 6;
    const h = 4;
    const area = ((bigB + smallB) * h) / 2; // (16 * 4) / 2 = 32
    const correct = '32 m²';
    return {
      title: 'ΤΖΑΜΑΡΙΑ ΣΤΕΓΗΣ',
      prompt: `Μια γυάλινη επιφάνεια στην οροφή ενός κτιρίου έχει σχήμα τραπεζίου με βάσεις 10 m και 6 m και ύψος 4 m. Πόσα τετραγωνικά μέτρα (m²) γυαλιού χρειάζονται;`,
      options: ensureFourUniqueOptions(correct, () => ['64 m²', '40 m²', '24 m²', '48 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Βάσεις', value: '10 m και 6 m' },
        { label: 'Ύψος', value: '4 m' },
        { label: 'Πράξη', value: '[(10 ＋ 6) · 4] : 2 ＝ [16 · 4] : 2 ＝ 32 m²' }
      ],
      explanation: `[(10 ＋ 6) · 4] : 2 ＝ 32 m².`
    };
  }
];

// POOL ΓΙΑ Q10: Ορθογώνια Τραπέζια (Η κάθετη πλευρά είναι το ύψος)
const PROBLEM_POOL_Q10 = [
  // 1. Ορθογώνιο τραπέζιο με 4 πλευρές
  () => {
    const bigB = 18;
    const smallB = 12;
    const h = 8; // Κάθετη πλευρά = ύψος
    const slant = 10; // Πλάγια πλευρά
    const sum = bigB + smallB; // 30
    const area = (sum * h) / 2; // 120
    const correct = `${area} cm²`;
    return {
      title: 'ΟΡΘΟΓΩΝΙΟ ΤΡΑΠΕΖΙΟ',
      prompt: `Σε ένα ορθογώνιο τραπέζιο οι παράλληλες βάσεις είναι 18 cm και 12 cm. Η πλευρά που είναι κάθετη στις βάσεις μετράει 8 cm και η άλλη πλάγια πλευρά μετράει 10 cm. Πόσο είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => [
        '240 cm²',
        '150 cm²',
        '100 cm²',
        '96 cm²'
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάσεις (Β, b)', value: '18 cm και 12 cm' },
        { label: 'Κάθετη πλευρά (ύψος υ)', value: '8 cm' },
        { label: 'Πλάγια πλευρά', value: '10 cm (δεν χρειάζεται)' },
        { label: 'Πράξη', value: '[(18 ＋ 12) · 8] : 2 ＝ [30 · 8] : 2 ＝ 120 cm²' }
      ],
      explanation: `Στο ορθογώνιο τραπέζιο η πλευρά που είναι κάθετη στις βάσεις είναι το ίδιο το ύψος (υ ＝ 8 cm). Επομένως: [(18 ＋ 12) · 8] : 2 ＝ 120 cm².`
    };
  },
  // 2. Οικόπεδο ορθογώνιο τραπέζιο
  () => {
    const bigB = randInt(25, 45);
    const smallB = randInt(15, bigB - 6);
    const h = randInt(14, 24);
    const sum = bigB + smallB;
    const area = (sum * h) / 2;
    const correct = `${formatNum(area)} m²`;
    return {
      title: 'ΟΡΘΟΓΩΝΙΟ ΤΡΑΠΕΖΟΕΙΔΕΣ ΟΙΚΟΠΕΔΟ',
      prompt: `Ένα οικόπεδο έχει σχήμα ορθογωνίου τραπεζίου με βάσεις ${bigB} m και ${smallB} m. Η πλευρά που σχηματίζει ορθές γωνίες με τις βάσεις έχει μήκος ${h} m. Πόσο είναι το εμβαδόν του οικοπέδου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(sum * h)} m²`,
        `${formatNum(area + 40)} m²`,
        `${formatNum(area - 30 > 0 ? area - 30 : area + 80)} m²`,
        `${formatNum(area * 2)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Άθροισμα βάσεων', value: `${bigB} ＋ ${smallB} ＝ ${sum} m` },
        { label: 'Ύψος (κάθετη πλευρά)', value: `${h} m` },
        { label: 'Εμβαδόν', value: `(${sum} · ${h}) : 2 ＝ ${formatNum(area)} m²` }
      ],
      explanation: `Η κάθετη πλευρά αποτελεί το ύψος του τραπεζίου. Ε ＝ [(${bigB} ＋ ${smallB}) · ${h}] : 2 ＝ ${formatNum(area)} m².`
    };
  },
  // 3. Ορθογώνιο τραπέζιο 20 και 10 με ύψος 12
  () => {
    const bigB = 20;
    const smallB = 10;
    const h = 12;
    const area = ((bigB + smallB) * h) / 2; // (30 * 12) / 2 = 180
    const correct = `${area} m²`;
    return {
      title: 'ΕΜΒΑΔΟΝ ΜΕ ΚΑΘΕΤΗ ΠΛΕΥΡΑ',
      prompt: `Ένα ορθογώνιο τραπέζιο έχει βάσεις 20 m και 10 m, ενώ η κάθετη πλευρά του είναι 12 m. Πόσο είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => ['360 m²', '120 m²', '200 m²', '150 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Βάσεις', value: '20 m και 10 m' },
        { label: 'Ύψος', value: '12 m' },
        { label: 'Πράξη', value: '[(20 ＋ 10) · 12] : 2 ＝ [30 · 12] : 2 ＝ 180 m²' }
      ],
      explanation: `[(20 ＋ 10) · 12] : 2 ＝ 180 m².`
    };
  },
  // 4. Χωρισμός ορθογωνίου τραπεζίου σε ορθογώνιο και τρίγωνο
  () => {
    const smallB = 10;
    const extra = 6;
    const bigB = smallB + extra; // 16
    const h = 8;
    // Ε_ορθογωνίου = 10 * 8 = 80, Ε_τριγώνου = (6 * 8) / 2 = 24 => Σύνολο = 104
    const area = ((bigB + smallB) * h) / 2; // (26 * 8) / 2 = 104
    const correct = '104 cm²';
    return {
      title: 'ΧΩΡΙΣΜΟΣ ΣΕ ΟΡΘΟΓΩΝΙΟ ΚΑΙ ΤΡΙΓΩΝΟ',
      prompt: `Ένα ορθογώνιο τραπέζιο έχει βάσεις 16 cm και 10 cm και κάθετη πλευρά (ύψος) 8 cm. Πόσο είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => ['208 cm²', '80 cm²', '128 cm²', '96 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάσεις', value: '16 cm και 10 cm (άθροισμα 26 cm)' },
        { label: 'Ύψος', value: '8 cm' },
        { label: 'Πράξη', value: '(26 · 8) : 2 ＝ 208 : 2 ＝ 104 cm²' }
      ],
      explanation: `(26 · 8) : 2 ＝ 104 cm². (Επίσης: ορθογώνιο 10 · 8 ＝ 80 cm² ＋ τρίγωνο (6 · 8) : 2 ＝ 24 cm², σύνολο 80 ＋ 24 ＝ 104 cm²).`
    };
  },
  // 5. Ορθογώνιο τραπέζιο 14 και 6 με ύψος 10
  () => {
    const bigB = 14;
    const smallB = 6;
    const h = 10;
    const area = ((bigB + smallB) * h) / 2; // (20 * 10) / 2 = 100
    const correct = '100 cm²';
    return {
      title: 'ΕΜΒΑΔΟΝ 100 CM²',
      prompt: `Σε ένα ορθογώνιο τραπέζιο η μεγάλη βάση είναι 14 cm, η μικρή βάση είναι 6 cm και το ύψος είναι 10 cm. Πόσο είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => ['200 cm²', '140 cm²', '60 cm²', '120 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάσεις', value: '14 cm και 6 cm' },
        { label: 'Ύψος', value: '10 cm' },
        { label: 'Πράξη', value: '[(14 ＋ 6) · 10] : 2 ＝ [20 · 10] : 2 ＝ 100 cm²' }
      ],
      explanation: `[(14 ＋ 6) · 10] : 2 ＝ 100 cm².`
    };
  },
  // 6. Πινακίδα ορθογώνιου τραπεζίου
  () => {
    const bigB = 30;
    const smallB = 20;
    const h = 15;
    const area = ((bigB + smallB) * h) / 2; // (50 * 15) / 2 = 375
    const correct = '375 cm²';
    return {
      title: 'ΤΡΑΠΕΖΟΕΙΔΗΣ ΠΙΝΑΚΙΔΑ',
      prompt: `Μια πινακίδα έχει σχήμα ορθογωνίου τραπεζίου με βάσεις 30 cm και 20 cm και κάθετη πλευρά 15 cm. Πόσο είναι το εμβαδόν της;`,
      options: ensureFourUniqueOptions(correct, () => ['750 cm²', '300 cm²', '450 cm²', '350 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάσεις', value: '30 cm και 20 cm' },
        { label: 'Ύψος', value: '15 cm' },
        { label: 'Πράξη', value: '[(30 ＋ 20) · 15] : 2 ＝ [50 · 15] : 2 ＝ 375 cm²' }
      ],
      explanation: `[(30 ＋ 20) · 15] : 2 ＝ 375 cm².`
    };
  }
];

// POOL ΓΙΑ Q11: Αντίστροφο Πρόβλημα [υ ＝ (2 · Ε) : (Β ＋ b) ή (Β ＋ b) ＝ (2 · Ε) : υ]
const PROBLEM_POOL_Q11 = [
  // 1. Εύρεση ύψους όταν δίνονται οι βάσεις και το εμβαδόν
  () => {
    const bigB = randInt(18, 30);
    const smallB = randInt(8, 16);
    const h = randInt(8, 16);
    const sum = bigB + smallB;
    const area = (sum * h) / 2;
    const correct = `${h} cm`;
    return {
      title: 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΤΡΑΠΕΖΙΟΥ',
      prompt: `Ένα τραπέζιο έχει εμβαδόν ${formatNum(area)} cm² και οι βάσεις του είναι ${bigB} cm και ${smallB} cm. Πόσο είναι το ύψος του τραπεζίου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${h + 3} cm`,
        `${h - 2 > 0 ? h - 2 : h + 4} cm`,
        `${Math.round(area / sum)} cm`,
        `${h * 2} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν (Ε)', value: `${formatNum(area)} cm²` },
        { label: 'Διπλάσιο εμβαδόν (2 · Ε)', value: `${formatNum(2 * area)} cm²` },
        { label: 'Άθροισμα βάσεων (Β ＋ b)', value: `${bigB} ＋ ${smallB} ＝ ${sum} cm` },
        { label: 'Πράξη ύψους', value: `(2 · ${formatNum(area)}) : ${sum} ＝ ${formatNum(2 * area)} : ${sum} ＝ ${h} cm` }
      ],
      explanation: `Διπλασιάζουμε πρώτα το εμβαδόν: 2 · ${formatNum(area)} ＝ ${formatNum(2 * area)} cm². Έπειτα διαιρούμε με το άθροισμα των βάσεων: ${formatNum(2 * area)} : ${sum} ＝ ${h} cm.`
    };
  },
  // 2. Εύρεση της μικρής βάσης
  () => {
    const bigB = 22;
    const smallB = 14;
    const h = 10;
    const area = ((bigB + smallB) * h) / 2; // (36 * 10) / 2 = 180
    const correct = `${smallB} cm`;
    return {
      title: 'ΕΥΡΕΣΗ ΜΙΚΡΗΣ ΒΑΣΗΣ',
      prompt: `Ένα τραπέζιο έχει εμβαδόν 180 cm² και ύψος 10 cm. Αν η μεγάλη βάση του είναι 22 cm, πόσο είναι το μήκος της μικρής βάσης;`,
      options: ensureFourUniqueOptions(correct, () => ['12 cm', '16 cm', '10 cm', '18 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Διπλάσιο εμβαδόν', value: '2 · 180 ＝ 360 cm²' },
        { label: 'Άθροισμα βάσεων (Β ＋ b)', value: '360 : 10 ＝ 36 cm' },
        { label: 'Μικρή βάση (b)', value: '36 － 22 ＝ 14 cm' }
      ],
      explanation: `Βρίσκουμε το άθροισμα των βάσεων: (2 · 180) : 10 ＝ 36 cm. Αφαιρούμε τη μεγάλη βάση: 36 － 22 ＝ 14 cm.`
    };
  },
  // 3. Εύρεση ύψους με Ε = 150 m² και βάσεις 20 και 10
  () => {
    const area = 150;
    const bigB = 20;
    const smallB = 10;
    const sum = bigB + smallB; // 30
    const h = (2 * area) / sum; // 10
    const correct = '10 m';
    return {
      title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΥΨΟΥΣ ΟΙΚΟΠΕΔΟΥ',
      prompt: `Ένα τραπεζοειδές οικόπεδο έχει εμβαδόν 150 m² και βάσεις 20 m και 10 m. Πόσο είναι το ύψος του οικοπέδου;`,
      options: ensureFourUniqueOptions(correct, () => ['5 m', '15 m', '8 m', '12 m']),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Εμβαδόν', value: '150 m²' },
        { label: 'Διπλάσιο εμβαδόν', value: '2 · 150 ＝ 300 m²' },
        { label: 'Άθροισμα βάσεων', value: '20 ＋ 10 ＝ 30 m' },
        { label: 'Πράξη', value: '300 : 30 ＝ 10 m' }
      ],
      explanation: `(2 · 150) : (20 ＋ 10) ＝ 300 : 30 ＝ 10 m.`
    };
  },
  // 4. Εύρεση μεγάλης βάσης
  () => {
    const bigB = 18;
    const smallB = 10;
    const h = 8;
    const area = ((bigB + smallB) * h) / 2; // (28 * 8) / 2 = 112
    const correct = `${bigB} cm`;
    return {
      title: 'ΕΥΡΕΣΗ ΜΕΓΑΛΗΣ ΒΑΣΗΣ',
      prompt: `Σε ένα τραπέζιο με εμβαδόν 112 cm² και ύψος 8 cm, η μικρή βάση είναι 10 cm. Πόσο είναι το μήκος της μεγάλης βάσης;`,
      options: ensureFourUniqueOptions(correct, () => ['16 cm', '20 cm', '14 cm', '22 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Άθροισμα βάσεων', value: '(2 · 112) : 8 ＝ 224 : 8 ＝ 28 cm' },
        { label: 'Μεγάλη βάση (Β)', value: '28 － 10 ＝ 18 cm' }
      ],
      explanation: `(2 · 112) : 8 ＝ 28 cm. Μεγάλη βάση: 28 － 10 ＝ 18 cm.`
    };
  },
  // 5. Εύρεση ύψους με Ε = 80 cm² και βάσεις 12 και 8
  () => {
    const area = 80;
    const sum = 20;
    const h = (2 * area) / sum; // 8
    const correct = '8 cm';
    return {
      title: 'ΥΨΟΣ ΤΡΑΠΕΖΙΟΥ',
      prompt: `Ένα τραπέζιο έχει εμβαδόν 80 cm² και το άθροισμα των βάσεών του είναι 20 cm. Πόσο είναι το ύψος του;`,
      options: ensureFourUniqueOptions(correct, () => ['4 cm', '10 cm', '16 cm', '6 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Διπλάσιο εμβαδόν', value: '2 · 80 ＝ 160 cm²' },
        { label: 'Πράξη ύψους', value: '160 : 20 ＝ 8 cm' }
      ],
      explanation: `(2 · 80) : 20 ＝ 8 cm.`
    };
  },
  // 6. Εύρεση άθροισμα βάσεων με Ε = 240 m² και υ = 12 m
  () => {
    const area = 240;
    const h = 12;
    const sum = (2 * area) / h; // 40
    const correct = '40 m';
    return {
      title: 'ΑΘΡΟΙΣΜΑ ΒΑΣΕΩΝ ΤΡΑΠΕΖΙΟΥ',
      prompt: `Σε ένα τραπεζοειδές χωράφι το εμβαδόν είναι 240 m² και το ύψος είναι 12 m. Πόσο είναι το άθροισμα των δύο παράλληλων πλευρών του (Β ＋ b);`,
      options: ensureFourUniqueOptions(correct, () => ['20 m', '30 m', '50 m', '24 m']),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Διπλάσιο εμβαδόν', value: '2 · 240 ＝ 480 m²' },
        { label: 'Άθροισμα βάσεων', value: '480 : 12 ＝ 40 m' }
      ],
      explanation: `(2 · 240) : 12 ＝ 480 : 12 ＝ 40 m.`
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα, Στρέμματα & Μετατροπές Μονάδων
const PROBLEM_POOL_Q12 = [
  // 1. Αγροτεμάχιο σε στρέμματα
  () => {
    const bigB = 80;
    const smallB = 40;
    const h = 50;
    const areaM2 = ((bigB + smallB) * h) / 2; // (120 * 50) / 2 = 3.000 m²
    const stremmata = areaM2 / 1000; // 3 στρέμματα
    const correct = `${stremmata} στρέμματα`;
    return {
      title: 'ΤΡΑΠΕΖΟΕΙΔΗΣ ΑΓΡΟΣ ΣΕ ΣΤΡΕΜΜΑΤΑ',
      prompt: `Ένας αγρός έχει σχήμα τραπεζίου με βάσεις 80 m και 40 m και κάθετη απόσταση μεταξύ τους (ύψος) 50 m. Πόσα στρέμματα είναι η έκταση του αγρού;`,
      options: ensureFourUniqueOptions(correct, () => ['6 στρέμματα', '30 στρέμματα', '1,5 στρέμματα', '0,3 στρέμματα']),
      correctAnswer: correct,
      unit: 'στρέμματα',
      tableData: [
        { label: 'Εμβαδόν σε m²', value: '[(80 ＋ 40) · 50] : 2 ＝ [120 · 50] : 2 ＝ 3.000 m²' },
        { label: 'Μετατροπή σε στρέμματα (: 1.000)', value: '3.000 : 1.000 ＝ 3 στρέμματα' }
      ],
      explanation: `Ε ＝ [(80 ＋ 40) · 50] : 2 ＝ 3.000 m². Επειδή 1 στρέμμα ＝ 1.000 m², έχουμε: 3.000 : 1.000 ＝ 3 στρέμματα.`
    };
  },
  // 2. Βάσεις σε m και ύψος σε cm
  () => {
    const bigBM = 2; // 200 cm
    const smallBM = 1; // 100 cm
    const hCm = 60;
    const sumCm = 300;
    const areaCm2 = (sumCm * hCm) / 2; // 9.000 cm²
    const correct = `${formatNum(areaCm2)} cm²`;
    return {
      title: 'ΔΙΑΦΟΡΕΤΙΚΕΣ ΜΟΝΑΔΕΣ (M ΚΑΙ CM)',
      prompt: `Σε ένα τραπέζιο η μεγάλη βάση είναι 2 m, η μικρή βάση είναι 1 m και το ύψος είναι 60 cm. Πόσο είναι το εμβαδόν του σε τετραγωνικά εκατοστόμετρα (cm²);`,
      options: ensureFourUniqueOptions(correct, () => [
        '90 cm²',
        '18.000 cm²',
        '900 cm²',
        '4.500 cm²'
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάσεις σε cm', value: '2 m ＝ 200 cm, 1 m ＝ 100 cm (άθροισμα 300 cm)' },
        { label: 'Ύψος', value: '60 cm' },
        { label: 'Πράξη', value: '(300 · 60) : 2 ＝ 18.000 : 2 ＝ 9.000 cm²' }
      ],
      explanation: `Μετατρέπουμε τα μέτρα σε εκατοστά: Β ＝ 200 cm, b ＝ 100 cm. Εμβαδόν: [(200 ＋ 100) · 60] : 2 ＝ 9.000 cm².`
    };
  },
  // 3. Εμβαδόν σε dm² και μετατροπή σε cm²
  () => {
    const bigB = 7; // dm
    const smallB = 3; // dm
    const h = 4; // dm
    const areaDm2 = ((bigB + smallB) * h) / 2; // (10 * 4) / 2 = 20 dm²
    const areaCm2 = areaDm2 * 100; // 2.000 cm²
    const correct = `${formatNum(areaCm2)} cm²`;
    return {
      title: 'ΜΕΤΑΤΡΟΠΗ ΑΠΟ DM² ΣΕ CM²',
      prompt: `Ένα τραπέζιο έχει βάσεις 7 dm και 3 dm και ύψος 4 dm (εμβαδόν 20 dm²). Πόσα τετραγωνικά εκατοστόμετρα (cm²) είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => ['200 cm²', '20.000 cm²', '4.000 cm²', '1.000 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Εμβαδόν σε dm²', value: '[(7 ＋ 3) · 4] : 2 ＝ 20 dm²' },
        { label: 'Σχέση dm²/cm²', value: '1 dm² ＝ 100 cm²' },
        { label: 'Πράξη (· 100)', value: '20 · 100 ＝ 2.000 cm²' }
      ],
      explanation: `Ε ＝ 20 dm². 1 dm² ＝ 100 cm², άρα 20 · 100 ＝ 2.000 cm².`
    };
  },
  // 4. Αξία πώλησης τραπεζοειδούς οικοπέδου
  () => {
    const bigB = 30;
    const smallB = 20;
    const h = 16;
    const areaM2 = ((bigB + smallB) * h) / 2; // (50 * 16) / 2 = 400 m²
    const pricePerM2 = 150;
    const cost = areaM2 * pricePerM2; // 60.000 €
    const correct = `${formatNum(cost)} €`;
    return {
      title: 'ΑΞΙΑ ΠΩΛΗΣΗΣ ΟΙΚΟΠΕΔΟΥ',
      prompt: `Ένα οικόπεδο σχήματος τραπεζίου με βάσεις 30 m και 20 m και ύψος 16 m πωλείται προς 150 € το τετραγωνικό μέτρο (m²). Ποια είναι η συνολική αξία πώλησης;`,
      options: ensureFourUniqueOptions(correct, () => ['120.000 €', '30.000 €', '6.000 €', '80.000 €']),
      correctAnswer: correct,
      unit: '€',
      tableData: [
        { label: 'Εμβαδόν σε m²', value: '[(30 ＋ 20) · 16] : 2 ＝ 400 m²' },
        { label: 'Τιμή ανά m²', value: '150 €' },
        { label: 'Συνολικό κόστος', value: '400 · 150 € ＝ 60.000 €' }
      ],
      explanation: `Εμβαδόν: 400 m². Συνολική αξία: 400 · 150 € ＝ 60.000 €.`
    };
  },
  // 5. Ισοδύναμο παραλληλόγραμμο και τραπέζιο
  () => {
    const correct = 'Το παραλληλόγραμμο έχει το διπλάσιο εμβαδόν';
    return {
      title: 'ΣΥΓΚΡΙΣΗ ΜΕ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟ',
      prompt: `Έχουμε ένα τραπέζιο με βάσεις Β και b και ύψος υ, και ένα παραλληλόγραμμο που έχει βάση ίση με (Β ＋ b) και το ίδιο ύψος υ. Ποια είναι η σχέση των εμβαδών τους;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Έχουν ακριβώς το ίδιο εμβαδόν',
        'Το τραπέζιο έχει μεγαλύτερο εμβαδόν',
        'Το παραλληλόγραμμο έχει το τετραπλάσιο εμβαδόν'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Εμβαδόν παραλληλογράμμου', value: 'Ε ＝ (Β ＋ b) · υ' },
        { label: 'Εμβαδόν τραπεζίου', value: 'Ε ＝ [(Β ＋ b) · υ] : 2 (το μισό)' }
      ],
      explanation: `Το τραπέζιο είναι ακριβώς το μισό του παραλληλογράμμου που έχει βάση (Β ＋ b) και το ίδιο ύψος.`
    };
  },
  // 6. Διπλασιασμός του ύψους
  () => {
    const correct = 'Το εμβαδόν διπλασιάζεται';
    return {
      title: 'ΜΕΤΑΒΟΛΗ ΔΙΑΣΤΑΣΕΩΝ ΤΡΑΠΕΖΙΟΥ',
      prompt: `Αν σε ένα τραπέζιο διπλασιάσουμε το ύψος του διατηρώντας τις δύο βάσεις σταθερές, πώς θα αλλάξει το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Το εμβαδόν τετραπλασιάζεται',
        'Το εμβαδόν παραμένει ίδιο',
        'Το εμβαδόν υποδιπλασιάζεται'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Αρχικό εμβαδόν', value: 'Ε₁ ＝ [(Β ＋ b) · υ] : 2' },
        { label: 'Νέο εμβαδόν', value: 'Ε₂ ＝ [(Β ＋ b) · 2υ] : 2 ＝ 2 · Ε₁' }
      ],
      explanation: `Το εμβαδόν είναι ανάλογο του ύψους. Όταν το ύψος διπλασιάζεται με σταθερές βάσεις, το εμβαδόν διπλασιάζεται.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Τύπος εμβαδού τραπεζίου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΤΥΠΟΣ ΕΜΒΑΔΟΥ ΤΡΑΠΕΖΙΟΥ',
    prompt: isQ1True
      ? 'Το εμβαδόν του τραπεζίου ισούται με το άθροισμα των βάσεών του επί το ύψος, διά 2: Ε ＝ [(Β ＋ b) · υ] : 2.'
      : 'Το εμβαδόν του τραπεζίου ισούται πολλαπλασιάζοντας απλώς τη μεγάλη βάση με το ύψος: Ε ＝ Β · υ.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Σωστός τύπος', value: 'Ε ＝ [(Β ＋ b) · υ] : 2' },
      { label: 'Βάσεις', value: 'Προσθέτουμε πάντα και τις δύο βάσεις (Β ＋ b)' }
    ],
    explanation: isQ1True
      ? 'Το εμβαδόν του τραπεζίου δίνεται πάντοτε από τον τύπο Ε ＝ [(Β ＋ b) · υ] : 2.'
      : 'Στο τραπέζιο πρέπει να προσθέσουμε και τις δύο βάσεις πριν πολλαπλασιάσουμε με το ύψος και διαιρέσουμε με το 2: Ε ＝ [(Β ＋ b) · υ] : 2.'
  });

  // Q2: Γιατί διαιρούμε με το 2 (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΓΕΩΜΕΤΡΙΚΗ ΕΡΜΗΝΕΙΑ',
    prompt: 'Γιατί στον τύπο του εμβαδού τραπεζίου διαιρούμε με το 2;',
    options: ensureFourUniqueOptions(
      'Επειδή δύο ίδια τραπέζια ενώνονται και σχηματίζουν ένα παραλληλόγραμμο με εμβαδόν (Β ＋ b) · υ',
      () => [
        'Επειδή το τραπέζιο έχει 4 πλευρές',
        'Επειδή έχει 2 βάσεις',
        'Επειδή είναι πάντοτε ορθογώνιο'
      ]
    ),
    correctAnswer: 'Επειδή δύο ίδια τραπέζια ενώνονται και σχηματίζουν ένα παραλληλόγραμμο με εμβαδόν (Β ＋ b) · υ',
    tableData: [
      { label: '2 τραπέζια', value: 'Φτιάχνουν παραλληλόγραμμο με βάση (Β ＋ b) και ύψος υ' },
      { label: '1 τραπέζιο', value: 'Είναι ακριβώς το μισό: [(Β ＋ b) · υ] : 2' }
    ],
    explanation: 'Δύο ολόιδια τραπέζια σχηματίζουν ένα παραλληλόγραμμο, άρα το ένα τραπέζιο έχει ακριβώς το μισό εμβαδόν.'
  });

  // Q3: Ύψος σε ορθογώνιο τραπέζιο (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΥΨΟΣ ΣΕ ΟΡΘΟΓΩΝΙΟ ΤΡΑΠΕΖΙΟ',
    prompt: 'Ποιο είναι το ύψος σε ένα ορθογώνιο τραπέζιο;',
    options: ensureFourUniqueOptions(
      'Η πλευρά του που είναι κάθετη (90°) στις δύο παράλληλες βάσεις',
      () => [
        'Η πλάγια κεκλιμένη πλευρά του',
        'Η μεγαλύτερη διαγώνιος του',
        'Το άθροισμα των δύο βάσεων'
      ]
    ),
    correctAnswer: 'Η πλευρά του που είναι κάθετη (90°) στις δύο παράλληλες βάσεις',
    tableData: [
      { label: 'Ιδιότητα ορθογωνίου τραπεζίου', value: 'Έχει μία πλευρά κάθετη στις βάσεις' },
      { label: 'Ρόλος πλευράς', value: 'Αποτελεί ταυτόχρονα και το ύψος του σχήματος' }
    ],
    explanation: 'Στο ορθογώνιο τραπέζιο η κάθετη πλευρά συνδέει τις δύο βάσεις με γωνία 90°, άρα είναι το ίδιο το ύψος.'
  });

  // Q4: Οπτική αναγνώριση διαστάσεων τραπεζίου (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΑΝΑΓΝΩΡΙΣΗ ΣΤΟΙΧΕΙΩΝ ΤΡΑΠΕΖΙΟΥ',
    prompt: 'Παρατηρήστε το παρακάτω τραπέζιο. Ποιο στοιχείο αντιστοιχεί στο κάθετο ύψος (υ);',
    svg: (
      <svg viewBox="0 0 180 110" className="w-44 h-28 mx-auto my-2 select-none drop-shadow-sm">
        <polygon points="30,85 150,85 110,25 50,25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
        <line x1="50" y1="25" x2="50" y2="85" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="50" y="75" width="10" height="10" fill="none" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="55" cy="80" r="1.5" fill="#f59e0b" />
        <text x="40" y="58" fill="#f59e0b" fontSize="11" fontWeight="bold">υ</text>
        <text x="138" y="55" fill="#a855f7" fontSize="10" fontWeight="bold">π</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(
      'Η κίτρινη κατακόρυφη διακεκομμένη γραμμή (υ) με τη γωνία 90°',
      () => [
        'Η μωβ πλάγια πλευρά (π) του τραπεζίου',
        'Η επάνω μικρή βάση',
        'Η κάτω μεγάλη βάση'
      ]
    ),
    correctAnswer: 'Η κίτρινη κατακόρυφη διακεκομμένη γραμμή (υ) με τη γωνία 90°',
    tableData: [
      { label: 'Κίτρινη γραμμή (υ)', value: 'Κάθετο ύψος ανάμεσα στις δύο βάσεις' },
      { label: 'Μωβ πλευρά (π)', value: 'Πλάγια πλευρά (δεν είναι ύψος)' }
    ],
    explanation: 'Το ύψος είναι πάντοτε η κάθετη απόσταση ανάμεσα στις δύο βάσεις (η κίτρινη διακεκομμένη γραμμή).'
  });

  // Q5: Υπολογισμός εμβαδού (Input αριθμού)
  const bigB5 = 12;
  const smallB5 = 8;
  const h5 = 5;
  const area5 = ((bigB5 + smallB5) * h5) / 2; // (20 * 5) / 2 = 50
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΕΜΒΑΔΟΥ ΣΕ CM²',
    prompt: `Ένα τραπέζιο έχει μεγάλη βάση ${bigB5} cm, μικρή βάση ${smallB5} cm και ύψος ${h5} cm. Πόσα cm² είναι το εμβαδόν του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(area5),
    tableData: [
      { label: 'Βάσεις', value: `${bigB5} cm και ${smallB5} cm (άθροισμα 20 cm)` },
      { label: 'Ύψος', value: `${h5} cm` },
      { label: 'Πράξη', value: `[(${bigB5} ＋ ${smallB5}) · ${h5}] : 2 ＝ [20 · ${h5}] : 2 ＝ ${area5} cm²` }
    ],
    explanation: `Ε ＝ [(12 ＋ 8) · 5] : 2 ＝ (20 · 5) : 2 ＝ 50 cm².`
  });

  // Q6: Εύρεση ύψους από το εμβαδόν (Input αριθμού)
  const area6 = 60;
  const sum6 = 20; // Β + b = 20
  const h6 = (2 * area6) / sum6; // 6
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΑΠΟ ΤΟ ΕΜΒΑΔΟΝ',
    prompt: `Σε ένα τραπέζιο το εμβαδόν είναι 60 m² και το άθροισμα των δύο βάσεων είναι 20 m. Πόσα μέτρα (m) είναι το ύψος του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(h6),
    tableData: [
      { label: 'Εμβαδόν', value: '60 m²' },
      { label: 'Διπλάσιο εμβαδόν', value: '2 · 60 ＝ 120 m²' },
      { label: 'Άθροισμα βάσεων', value: '20 m' },
      { label: 'Πράξη ύψους', value: '120 : 20 ＝ 6 m' }
    ],
    explanation: `υ ＝ (2 · Ε) : (Β ＋ b) ＝ (2 · 60) : 20 ＝ 120 : 20 ＝ 6 m.`
  });

  // Q7: Σειρά πράξεων στον τύπο (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΣΕΙΡΑ ΠΡΑΞΕΩΝ ΣΤΟΝ ΤΥΠΟ',
    prompt: 'Ποια είναι η σωστή σειρά των πράξεων όταν εφαρμόζουμε τον τύπο Ε ＝ [(Β ＋ b) · υ] : 2;',
    options: ensureFourUniqueOptions(
      'Πρώτα προσθέτουμε τις βάσεις (Β ＋ b), μετά πολλαπλασιάζουμε με το υ και τέλος διαιρούμε με το 2',
      () => [
        'Πρώτα πολλαπλασιάζουμε τη μεγάλη βάση με το ύψος και μετά προσθέτουμε τη μικρή',
        'Πρώτα διαιρούμε το ύψος με το 2 και μετά πολλαπλασιάζουμε μόνο με τη μεγάλη βάση',
        'Κάνουμε τις πράξεις με όποια σειρά θέλουμε χωρίς παρενθέσεις'
      ]
    ),
    correctAnswer: 'Πρώτα προσθέτουμε τις βάσεις (Β ＋ b), μετά πολλαπλασιάζουμε με το υ και τέλος διαιρούμε με το 2',
    tableData: [
      { label: '1ο βήμα', value: 'Άθροισμα των βάσεων (Β ＋ b)' },
      { label: '2ο βήμα', value: 'Πολλαπλασιασμός επί το ύψος · υ' },
      { label: '3ο βήμα', value: 'Διαίρεση με το 2 (: 2)' }
    ],
    explanation: 'Οι παρενθέσεις έχουν προτεραιότητα: πρώτα υπολογίζουμε το άθροισμα (Β ＋ b), μετά πολλαπλασιάζουμε με το ύψος και τέλος διαιρούμε διά 2.'
  });

  // Q8: Μετατροπή μονάδων dm² σε cm² (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΜΕΤΑΤΡΟΠΗ ΜΟΝΑΔΩΝ ΕΠΙΦΑΝΕΙΑΣ',
    prompt: 'Ένα τραπέζιο έχει εμβαδόν 15 dm². Πόσα τετραγωνικά εκατοστόμετρα (cm²) είναι το εμβαδόν του;',
    options: ensureFourUniqueOptions('1.500 cm²', () => ['150 cm²', '15.000 cm²', '150.000 cm²']),
    correctAnswer: '1.500 cm²',
    tableData: [
      { label: 'Αρχική τιμή', value: '15 dm²' },
      { label: 'Σχέση dm²/cm²', value: '1 dm² ＝ 100 cm²' },
      { label: 'Πράξη', value: '15 · 100 ＝ 1.500 cm²' }
    ],
    explanation: '1 dm² ＝ 100 cm², άρα: 15 · 100 ＝ 1.500 cm².'
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

export default function EmbadonTrapeziouAskiseisPage() {
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
      title="Ασκήσεις: Εμβαδόν Τραπεζίου - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στον υπολογισμό εμβαδού τραπεζίου με τον τύπο Ε ＝ [(Β ＋ b) · υ] : 2, ορθογώνια τραπέζια και εύρεση ύψους για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/75-embadon-trapeziou"
      backText="Θεωρία Κεφ. 75"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/75-embadon-trapeziou"
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
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 75 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Εμβαδον Τραπεζιου')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στον υπολογισμό εμβαδού τραπεζίου με τον τύπο Ε ＝ [(Β ＋ b) · υ] : 2, στα ορθογώνια τραπέζια και στην εύρεση άγνωστων βάσεων ή ύψους μέσα από 12 δυναμικές ερωτήσεις.
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

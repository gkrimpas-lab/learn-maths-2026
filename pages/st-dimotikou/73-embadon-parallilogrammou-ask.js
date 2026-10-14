// pages/st-dimotikou/73-embadon-parallilogrammou-ask.js
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

// POOL ΓΙΑ Q9: Υπολογισμός Εμβαδού με Παγίδα την Πλάγια Πλευρά
const PROBLEM_POOL_Q9 = [
  // 1. Παραλληλόγραμμο οικόπεδο
  () => {
    const b = randInt(15, 30);
    const h = randInt(8, 16);
    const slant = h + randInt(3, 7); // Πλάγια πλευρά (παγίδα)
    const area = b * h;
    const correct = `${formatNum(area)} m²`;
    return {
      title: 'ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟ ΟΙΚΟΠΕΔΟ',
      prompt: `Ένα οικόπεδο σχήματος παραλληλογράμμου έχει βάση ${b} m, κάθετο ύψος ${h} m και πλάγια πλευρά ${slant} m. Ποιο είναι το εμβαδόν του οικοπέδου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(b * slant)} m²`,
        `${formatNum(area + 30)} m²`,
        `${formatNum(area - 20 > 0 ? area - 20 : area + 50)} m²`,
        `${formatNum(2 * (b + slant))} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Βάση (β)', value: `${b} m` },
        { label: 'Κάθετο ύψος (υ)', value: `${h} m` },
        { label: 'Πλάγια πλευρά', value: `${slant} m (δεν χρησιμοποιείται στο εμβαδόν)` },
        { label: 'Πράξη', value: `Ε ＝ β · υ ＝ ${b} · ${h} ＝ ${formatNum(area)} m²` }
      ],
      explanation: `Στον τύπο του εμβαδού πολλαπλασιάζουμε πάντοτε τη βάση με το κάθετο ύψος: Ε ＝ β · υ ＝ ${b} · ${h} ＝ ${formatNum(area)} m². Η πλάγια πλευρά δεν χρειάζεται στον υπολογισμό του εμβαδού.`
    };
  },
  // 2. Μεταλλική πλάκα
  () => {
    const b = randInt(12, 25);
    const h = randInt(6, 12);
    const slant = h + 4;
    const area = b * h;
    const correct = `${formatNum(area)} cm²`;
    return {
      title: 'ΜΕΤΑΛΛΙΚΗ ΠΛΑΚΑ',
      prompt: `Μια παραλληλόγραμμη μεταλλική πλάκα έχει μήκος βάσης ${b} cm και αντίστοιχο ύψος ${h} cm, ενώ η πλάγια πλευρά της είναι ${slant} cm. Πόσο είναι το εμβαδόν της πλάκας;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(b * slant)} cm²`,
        `${formatNum(area + 15)} cm²`,
        `${formatNum(area - 15 > 0 ? area - 15 : area + 30)} cm²`,
        `${formatNum(b * 2 + h * 2)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάση (β)', value: `${b} cm` },
        { label: 'Ύψος (υ)', value: `${h} cm` },
        { label: 'Πράξη', value: `${b} · ${h} ＝ ${formatNum(area)} cm²` }
      ],
      explanation: `Ε ＝ β · υ ＝ ${b} · ${h} ＝ ${formatNum(area)} cm². Αγνοούμε την πλάγια πλευρά.`
    };
  },
  // 3. Ξύλινο ράφι
  () => {
    const b = randInt(40, 80);
    const h = randInt(20, 35);
    const area = b * h;
    const correct = `${formatNum(area)} cm²`;
    return {
      title: 'ΞΥΛΙΝΟ ΡΑΦΙ',
      prompt: `Ένα ξύλινο ράφι έχει σχήμα παραλληλογράμμου με βάση ${b} cm και κάθετη απόσταση ανάμεσα στις βάσεις ${h} cm. Ποιο είναι το εμβαδόν της επιφάνειάς του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(area + 100)} cm²`,
        `${formatNum(area - 100 > 0 ? area - 100 : area + 200)} cm²`,
        `${formatNum(b * 10)} cm²`,
        `${formatNum(area * 2)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάση (β)', value: `${b} cm` },
        { label: 'Ύψος (υ)', value: `${h} cm` },
        { label: 'Εμβαδόν', value: `${b} · ${h} ＝ ${formatNum(area)} cm²` }
      ],
      explanation: `Ε ＝ β · υ ＝ ${b} · ${h} ＝ ${formatNum(area)} cm².`
    };
  },
  // 4. Παρτέρι λουλουδιών
  () => {
    const b = randInt(6, 14);
    const h = randInt(3, 8);
    const area = b * h;
    const correct = `${area} m²`;
    return {
      title: 'ΠΑΡΤΕΡΙ ΛΟΥΛΟΥΔΙΩΝ',
      prompt: `Ένα παρτέρι σε σχήμα παραλληλογράμμου έχει βάση ${b} m και αντίστοιχο ύψος ${h} m. Πόσα τετραγωνικά μέτρα (m²) καλύπτει;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${area + 4} m²`,
        `${area - 4 > 0 ? area - 4 : area + 8} m²`,
        `${2 * (b + h)} m²`,
        `${area * 2} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Βάση', value: `${b} m` },
        { label: 'Ύψος', value: `${h} m` },
        { label: 'Πράξη', value: `${b} · ${h} ＝ ${area} m²` }
      ],
      explanation: `Ε ＝ β · υ ＝ ${b} · ${h} ＝ ${area} m².`
    };
  },
  // 5. Διακοσμητικό πλακάκι
  () => {
    const b = 15;
    const h = 8;
    const area = b * h;
    const correct = '120 cm²';
    return {
      title: 'ΔΙΑΚΟΣΜΗΤΙΚΟ ΠΛΑΚΑΚΙ',
      prompt: `Ένα διακοσμητικό πλακάκι έχει σχήμα παραλληλογράμμου με βάση 15 cm, ύψος 8 cm και πλάγια πλευρά 10 cm. Πόσο είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => ['150 cm²', '100 cm²', '50 cm²', '240 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάση', value: '15 cm' },
        { label: 'Ύψος', value: '8 cm' },
        { label: 'Πράξη', value: '15 · 8 ＝ 120 cm²' }
      ],
      explanation: `Ε ＝ β · υ ＝ 15 · 8 ＝ 120 cm². Η πλάγια πλευρά των 10 cm δεν χρησιμοποιείται.`
    };
  },
  // 6. Πινακίδα σήμανσης
  () => {
    const b = 50;
    const h = 24;
    const area = b * h;
    const correct = `${formatNum(area)} cm²`;
    return {
      title: 'ΠΙΝΑΚΙΔΑ ΣΗΜΑΝΣΗΣ',
      prompt: `Μια πινακίδα έχει σχήμα παραλληλογράμμου με βάση 50 cm και ύψος 24 cm. Πόσο είναι το εμβαδόν της σε cm²;`,
      options: ensureFourUniqueOptions(correct, () => ['1.500 cm²', '1.000 cm²', '600 cm²', '2.400 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάση', value: '50 cm' },
        { label: 'Ύψος', value: '24 cm' },
        { label: 'Πράξη', value: '50 · 24 ＝ 1.200 cm²' }
      ],
      explanation: `50 · 24 ＝ 1.200 cm².`
    };
  }
];

// POOL ΓΙΑ Q10: Εύρεση Ύψους ή Βάσης (Αντίστροφο Πρόβλημα: υ ＝ Ε : β)
const PROBLEM_POOL_Q10 = [
  // 1. Εύρεση ύψους σε οικόπεδο
  () => {
    const b = randInt(15, 30);
    const h = randInt(10, 20);
    const area = b * h;
    const correct = `${h} m`;
    return {
      title: 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΟΙΚΟΠΕΔΟΥ',
      prompt: `Ένα παραλληλόγραμμο οικόπεδο έχει εμβαδόν ${area} m² και μήκος βάσης ${b} m. Πόσο είναι το αντίστοιχο ύψος του οικοπέδου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${h + 3} m`,
        `${h - 2 > 0 ? h - 2 : h + 5} m`,
        `${Math.round(area / 2)} m`,
        `${h + 6} m`
      ]),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Εμβαδόν (Ε)', value: `${area} m²` },
        { label: 'Βάση (β)', value: `${b} m` },
        { label: 'Τύπος ύψους', value: 'υ ＝ Ε : β' },
        { label: 'Πράξη', value: `${area} : ${b} ＝ ${h} m` }
      ],
      explanation: `Για να βρούμε το ύψος, διαιρούμε το εμβαδόν με τη βάση: υ ＝ Ε : β ＝ ${area} : ${b} ＝ ${h} m.`
    };
  },
  // 2. Εύρεση βάσης σε πλάκα
  () => {
    const b = randInt(20, 40);
    const h = randInt(8, 15);
    const area = b * h;
    const correct = `${b} cm`;
    return {
      title: 'ΕΥΡΕΣΗ ΒΑΣΗΣ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΥ',
      prompt: `Σε ένα παραλληλόγραμμο το εμβαδόν είναι ${area} cm² και το ύψος είναι ${h} cm. Πόσο είναι το μήκος της αντίστοιχης βάσης;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${b + 4} cm`,
        `${b - 4 > 0 ? b - 4 : b + 8} cm`,
        `${Math.round(area / 4)} cm`,
        `${b * 2} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν (Ε)', value: `${area} cm²` },
        { label: 'Ύψος (υ)', value: `${h} cm` },
        { label: 'Τύπος βάσης', value: 'β ＝ Ε : υ' },
        { label: 'Πράξη', value: `${area} : ${h} ＝ ${b} cm` }
      ],
      explanation: `β ＝ Ε : υ ＝ ${area} : ${h} ＝ ${b} cm.`
    };
  },
  // 3. Εύρεση ύψους με διαίρεση
  () => {
    const area = 480;
    const b = 24;
    const h = area / b; // 20
    const correct = '20 m';
    return {
      title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΚΑΘΕΤΟΥ ΥΨΟΥΣ',
      prompt: `Το εμβαδόν ενός παραλληλογράμμου είναι 480 m² και η βάση του είναι 24 m. Πόσο είναι το ύψος του;`,
      options: ensureFourUniqueOptions(correct, () => ['25 m', '18 m', '15 m', '30 m']),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Εμβαδόν', value: '480 m²' },
        { label: 'Βάση', value: '24 m' },
        { label: 'Πράξη', value: '480 : 24 ＝ 20 m' }
      ],
      explanation: `480 : 24 ＝ 20 m.`
    };
  },
  // 4. Εύρεση βάσης με εμβαδόν 350 cm²
  () => {
    const area = 350;
    const h = 14;
    const b = area / h; // 25
    const correct = '25 cm';
    return {
      title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΜΗΚΟΥΣ ΒΑΣΗΣ',
      prompt: `Ένα παραλληλόγραμμο έχει εμβαδόν 350 cm² και ύψος 14 cm. Πόσα εκατοστόμετρα (cm) είναι η βάση του;`,
      options: ensureFourUniqueOptions(correct, () => ['20 cm', '30 cm', '28 cm', '35 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν', value: '350 cm²' },
        { label: 'Ύψος', value: '14 cm' },
        { label: 'Πράξη', value: '350 : 14 ＝ 25 cm' }
      ],
      explanation: `350 : 14 ＝ 25 cm.`
    };
  },
  // 5. Αγροτεμάχιο με στρέμματα
  () => {
    const stremmata = 3;
    const areaM2 = stremmata * 1000; // 3.000 m²
    const b = 60;
    const h = areaM2 / b; // 50 m
    const correct = '50 m';
    return {
      title: 'ΥΨΟΣ ΑΓΡΟΤΕΜΑΧΙΟΥ ΣΕ ΣΤΡΕΜΜΑΤΑ',
      prompt: `Ένα παραλληλόγραμμο χωράφι έχει έκταση 3 στρέμματα (3.000 m²) και μήκος πρόσοψης (βάση) 60 m. Πόσο είναι το βάθος (ύψος) του χωραφιού;`,
      options: ensureFourUniqueOptions(correct, () => ['40 m', '60 m', '55 m', '30 m']),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Έκταση σε m²', value: '3 στρέμματα ＝ 3.000 m²' },
        { label: 'Βάση', value: '60 m' },
        { label: 'Πράξη', value: '3.000 : 60 ＝ 50 m' }
      ],
      explanation: `3 στρέμματα ＝ 3.000 m². 3.000 : 60 ＝ 50 m.`
    };
  },
  // 6. Εύρεση ύψους σε μικρή επιφάνεια
  () => {
    const area = 72;
    const b = 9;
    const h = 8;
    const correct = '8 cm';
    return {
      title: 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΣΕ CM',
      prompt: `Ένα παραλληλόγραμμο έχει εμβαδόν 72 cm² και βάση 9 cm. Πόσο είναι το ύψος του;`,
      options: ensureFourUniqueOptions(correct, () => ['9 cm', '7 cm', '6 cm', '12 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν', value: '72 cm²' },
        { label: 'Βάση', value: '9 cm' },
        { label: 'Πράξη', value: '72 : 9 ＝ 8 cm' }
      ],
      explanation: `72 : 9 ＝ 8 cm.`
    };
  }
];

// POOL ΓΙΑ Q11: Μετατροπές Μονάδων Επιφάνειας στο Παραλληλόγραμμο (dm², cm², m²)
const PROBLEM_POOL_Q11 = [
  // 1. Βάση σε m και ύψος σε cm
  () => {
    const bM = 3;
    const hCm = 40;
    const bCm = bM * 100; // 300 cm
    const areaCm2 = bCm * hCm; // 12.000 cm²
    const correct = `${formatNum(areaCm2)} cm²`;
    return {
      title: 'ΔΙΑΦΟΡΕΤΙΚΕΣ ΜΟΝΑΔΕΣ (M ΚΑΙ CM)',
      prompt: `Σε ένα παραλληλόγραμμο η βάση είναι ${bM} m και το αντίστοιχο ύψος είναι ${hCm} cm. Πόσο είναι το εμβαδόν του σε τετραγωνικά εκατοστόμετρα (cm²);`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(bM * hCm)} cm²`,
        `${formatNum(areaCm2 / 10)} cm²`,
        `${formatNum(areaCm2 + 1000)} cm²`,
        `${formatNum(areaCm2 * 2)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάση σε cm (· 100)', value: `${bM} m ＝ ${bCm} cm` },
        { label: 'Ύψος σε cm', value: `${hCm} cm` },
        { label: 'Πράξη', value: `${bCm} · ${hCm} ＝ ${formatNum(areaCm2)} cm²` }
      ],
      explanation: `Πριν τον πολλαπλασιασμό μετατρέπουμε τα μέτρα σε εκατοστά: ${bM} m ＝ ${bCm} cm. Εμβαδόν: ${bCm} · ${hCm} ＝ ${formatNum(areaCm2)} cm².`
    };
  },
  // 2. Εμβαδόν σε dm² και μετατροπή σε cm²
  () => {
    const bDm = randInt(4, 9);
    const hDm = randInt(3, 6);
    const areaDm2 = bDm * hDm;
    const areaCm2 = areaDm2 * 100;
    const correct = `${formatNum(areaCm2)} cm²`;
    return {
      title: 'ΑΠΟ DM² ΣΕ CM²',
      prompt: `Ένα παραλληλόγραμμο έχει βάση ${bDm} dm και ύψος ${hDm} dm (εμβαδόν ${areaDm2} dm²). Πόσα τετραγωνικά εκατοστόμετρα (cm²) είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(areaDm2 * 10)} cm²`,
        `${formatNum(areaCm2 + 50)} cm²`,
        `${formatNum(areaCm2 - 50 > 0 ? areaCm2 - 50 : areaCm2 + 100)} cm²`,
        `${formatNum(areaDm2)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Εμβαδόν σε dm²', value: `${areaDm2} dm²` },
        { label: 'Σχέση dm²/cm²', value: '1 dm² ＝ 100 cm²' },
        { label: 'Πράξη (· 100)', value: `${areaDm2} · 100 ＝ ${formatNum(areaCm2)} cm²` }
      ],
      explanation: `1 dm² ＝ 100 cm². Άρα: ${areaDm2} · 100 ＝ ${formatNum(areaCm2)} cm².`
    };
  },
  // 3. Βάση σε dm και ύψος σε cm
  () => {
    const bDm = 5;
    const hCm = 20;
    const bCm = bDm * 10; // 50 cm
    const area = bCm * hCm; // 1.000 cm²
    const correct = '1.000 cm²';
    return {
      title: 'ΜΕΤΑΤΡΟΠΗ DM ΣΕ CM',
      prompt: `Ένα παραλληλόγραμμο έχει βάση 5 dm και ύψος 20 cm. Πόσα cm² είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => ['100 cm²', '10.000 cm²', '500 cm²', '200 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάση σε cm', value: '5 dm ＝ 50 cm' },
        { label: 'Ύψος σε cm', value: '20 cm' },
        { label: 'Πράξη', value: '50 · 20 ＝ 1.000 cm²' }
      ],
      explanation: `5 dm ＝ 50 cm. Ε ＝ 50 · 20 ＝ 1.000 cm².`
    };
  },
  // 4. Εμβαδόν σε cm² και ζητείται σε dm²
  () => {
    const areaCm2 = 2500;
    const areaDm2 = areaCm2 / 100; // 25 dm²
    const correct = '25 dm²';
    return {
      title: 'ΑΠΟ CM² ΣΕ DM²',
      prompt: `Το εμβαδόν ενός παραλληλογράμμου είναι 2.500 cm². Πόσα τετραγωνικά δεκατόμετρα (dm²) είναι;`,
      options: ensureFourUniqueOptions(correct, () => ['250 dm²', '2,5 dm²', '25.000 dm²', '50 dm²']),
      correctAnswer: correct,
      unit: 'dm²',
      tableData: [
        { label: 'Εμβαδόν σε cm²', value: '2.500 cm²' },
        { label: 'Πράξη (: 100)', value: '2.500 : 100 ＝ 25 dm²' }
      ],
      explanation: `Ανεβαίνουμε 1 σκαλοπάτι: 2.500 : 100 ＝ 25 dm².`
    };
  },
  // 5. Βάση σε m και αποτέλεσμα σε dm²
  () => {
    const bM = 2; // 20 dm
    const hDm = 15;
    const areaDm2 = 20 * hDm; // 300 dm²
    const correct = '300 dm²';
    return {
      title: 'ΕΜΒΑΔΟΝ ΣΕ DM²',
      prompt: `Σε ένα παραλληλόγραμμο η βάση είναι 2 m και το ύψος είναι 15 dm. Πόσα dm² είναι το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => ['30 dm²', '3.000 dm²', '150 dm²', '300 m²']),
      correctAnswer: correct,
      unit: 'dm²',
      tableData: [
        { label: 'Βάση σε dm', value: '2 m ＝ 20 dm' },
        { label: 'Ύψος σε dm', value: '15 dm' },
        { label: 'Πράξη', value: '20 · 15 ＝ 300 dm²' }
      ],
      explanation: `2 m ＝ 20 dm. Ε ＝ 20 · 15 ＝ 300 dm².`
    };
  },
  // 6. Εμβαδόν σε m² και μετατροπή σε στρέμματα
  () => {
    const b = 80;
    const h = 50;
    const areaM2 = b * h; // 4.000 m²
    const stremmata = areaM2 / 1000; // 4 στρέμματα
    const correct = '4 στρέμματα';
    return {
      title: 'ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΣ ΑΓΡΟΣ ΣΕ ΣΤΡΕΜΜΑΤΑ',
      prompt: `Ένας παραλληλόγραμμος αγρός έχει βάση 80 m και ύψος 50 m. Πόσα στρέμματα είναι η έκτασή του;`,
      options: ensureFourUniqueOptions(correct, () => ['40 στρέμματα', '0,4 στρέμματα', '400 στρέμματα', '8 στρέμματα']),
      correctAnswer: correct,
      unit: 'στρέμματα',
      tableData: [
        { label: 'Εμβαδόν σε m²', value: '80 · 50 ＝ 4.000 m²' },
        { label: 'Στρέμματα (: 1.000)', value: '4.000 : 1.000 ＝ 4 στρέμματα' }
      ],
      explanation: `80 · 50 ＝ 4.000 m². 4.000 : 1.000 ＝ 4 στρέμματα.`
    };
  }
];

// POOL ΓΙΑ Q12: Ισοδύναμα Σχήματα & Δύο Ύψη (β₁ · υ₁ ＝ β₂ · υ₂)
const PROBLEM_POOL_Q12 = [
  // 1. Εύρεση του 2ου ύψους
  () => {
    const b1 = 20;
    const h1 = 12; // Ε = 240
    const b2 = 15;
    const h2 = (b1 * h1) / b2; // 16
    const correct = `${h2} cm`;
    return {
      title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΔΕΥΤΕΡΟΥ ΥΨΟΥΣ',
      prompt: `Ένα παραλληλόγραμμο έχει πλευρές 20 cm και 15 cm. Το ύψος που αντιστοιχεί στην πλευρά των 20 cm είναι 12 cm. Πόσο είναι το ύψος που αντιστοιχεί στην άλλη πλευρά των 15 cm;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${h2 + 2} cm`,
        `${h2 - 2} cm`,
        `${h1} cm`,
        `${h2 + 4} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν (β₁ · υ₁)', value: '20 · 12 ＝ 240 cm²' },
        { label: 'Τύπος για το υ₂', value: 'υ₂ ＝ Ε : β₂' },
        { label: 'Πράξη', value: '240 : 15 ＝ 16 cm' }
      ],
      explanation: `Το εμβαδόν είναι σταθερό: Ε ＝ 20 · 12 ＝ 240 cm². Το δεύτερο ύψος υπολογίζεται ως: υ₂ ＝ 240 : 15 ＝ 16 cm.`
    };
  },
  // 2. Εύρεση 2ου ύψους με διαστάσεις 30 και 20
  () => {
    const b1 = 30;
    const h1 = 10; // Ε = 300
    const b2 = 20;
    const h2 = (b1 * h1) / b2; // 15
    const correct = '15 cm';
    return {
      title: 'ΣΧΕΣΗ ΔΥΟ ΥΨΩΝ',
      prompt: `Σε ένα παραλληλόγραμμο με πλευρές 30 cm και 20 cm, το ύψος προς τη μεγάλη πλευρά είναι 10 cm. Πόσο είναι το ύψος προς τη μικρή πλευρά;`,
      options: ensureFourUniqueOptions(correct, () => ['12 cm', '18 cm', '20 cm', '10 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν', value: '30 · 10 ＝ 300 cm²' },
        { label: 'Δεύτερο ύψος', value: '300 : 20 ＝ 15 cm' }
      ],
      explanation: `30 · 10 ＝ 300 cm². 300 : 20 ＝ 15 cm.`
    };
  },
  // 3. Ισοδύναμο ορθογώνιο και παραλληλόγραμμο
  () => {
    const l = 16;
    const w = 9;
    const area = l * w; // 144
    const b = 18;
    const h = area / b; // 8
    const correct = '8 cm';
    return {
      title: 'ΙΣΟΔΥΝΑΜΑ ΣΧΗΜΑΤΑ',
      prompt: `Ένα παραλληλόγραμμο έχει το ίδιο εμβαδόν με ένα ορθογώνιο διαστάσεων 16 cm και 9 cm. Αν η βάση του παραλληλογράμμου είναι 18 cm, πόσο είναι το ύψος του;`,
      options: ensureFourUniqueOptions(correct, () => ['10 cm', '6 cm', '9 cm', '12 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν ορθογωνίου', value: '16 · 9 ＝ 144 cm²' },
        { label: 'Εμβαδόν παραλληλογράμμου', value: '144 cm² (ίσο)' },
        { label: 'Ύψος παραλληλογράμμου', value: '144 : 18 ＝ 8 cm' }
      ],
      explanation: `Το εμβαδόν του ορθογωνίου είναι 16 · 9 ＝ 144 cm². Το ύψος του παραλληλογράμμου είναι: 144 : 18 ＝ 8 cm.`
    };
  },
  // 4. Ισοδύναμο τετράγωνο και παραλληλόγραμμο
  () => {
    const side = 12;
    const area = side * side; // 144
    const b = 24;
    const h = area / b; // 6
    const correct = '6 cm';
    return {
      title: 'ΙΣΟΔΥΝΑΜΟ ΜΕ ΤΕΤΡΑΓΩΝΟ',
      prompt: `Ένα παραλληλόγραμμο έχει ίσο εμβαδόν με ένα τετράγωνο πλευράς 12 cm. Αν η βάση του παραλληλογράμμου είναι 24 cm, πόσο είναι το ύψος του;`,
      options: ensureFourUniqueOptions(correct, () => ['8 cm', '12 cm', '4 cm', '10 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν τετραγώνου', value: '12 · 12 ＝ 144 cm²' },
        { label: 'Βάση παραλληλογράμμου', value: '24 cm' },
        { label: 'Ύψος παραλληλογράμμου', value: '144 : 24 ＝ 6 cm' }
      ],
      explanation: `Ε ＝ 12 · 12 ＝ 144 cm². υ ＝ 144 : 24 ＝ 6 cm.`
    };
  },
  // 5. Διπλασιασμός της βάσης
  () => {
    const correct = 'Το εμβαδόν διπλασιάζεται';
    return {
      title: 'ΜΕΤΑΒΟΛΗ ΔΙΑΣΤΑΣΕΩΝ',
      prompt: `Αν σε ένα παραλληλόγραμμο διπλασιάσουμε το μήκος της βάσης του κρατώντας το ύψος σταθερό, πώς θα αλλάξει το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Το εμβαδόν τετραπλασιάζεται',
        'Το εμβαδόν παραμένει το ίδιο',
        'Το εμβαδόν τριπλασιάζεται'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Αρχικό εμβαδόν', value: 'Ε₁ ＝ β · υ' },
        { label: 'Νέο εμβαδόν', value: 'Ε₂ ＝ (2 · β) · υ ＝ 2 · (β · υ) ＝ 2 · Ε₁' }
      ],
      explanation: `Το εμβαδόν είναι ανάλογο της βάσης. Αν διπλασιαστεί η βάση με σταθερό ύψος, το εμβαδόν διπλασιάζεται.`
    };
  },
  // 6. Σύγκριση δύο υψών (ποιο είναι μεγαλύτερο)
  () => {
    const correct = 'Το ύψος προς τη μικρή πλευρά είναι πάντοτε μεγαλύτερο';
    return {
      title: 'ΣΥΓΚΡΙΣΗ ΜΕΓΕΘΟΥΣ ΥΨΩΝ',
      prompt: `Σε ένα παραλληλόγραμμο με δύο άνισες πλευρές, ποιο από τα δύο ύψη είναι μεγαλύτερο;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Το ύψος προς τη μεγάλη πλευρά είναι μεγαλύτερο',
        'Και τα δύο ύψη είναι πάντα ίσα',
        'Εξαρτάται από το εμβαδόν του σχήματος'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Σχέση', value: 'β₁ · υ₁ ＝ β₂ · υ₂' },
        { label: 'Κανόνας', value: 'Στη μικρότερη βάση αντιστοιχεί το μεγαλύτερο ύψος' }
      ],
      explanation: `Επειδή το γινόμενο β · υ είναι σταθερό, στη μικρότερη πλευρά αντιστοιχεί υποχρεωτικά το μεγαλύτερο ύψος.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Τύπος εμβαδού παραλληλογράμμου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΤΥΠΟΣ ΕΜΒΑΔΟΥ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΥ',
    prompt: isQ1True
      ? 'Το εμβαδόν ενός παραλληλογράμμου ισούται με το γινόμενο της βάσης του επί το αντίστοιχο κάθετο ύψος (Ε ＝ β · υ).'
      : 'Το εμβαδόν ενός παραλληλογράμμου ισούται πάντοτε με το γινόμενο των δύο διαδοχικών πλευρών του, όπως στο ορθογώνιο.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Σωστός τύπος', value: 'Ε ＝ β · υ (Βάση · Κάθετο Ύψος)' },
      { label: 'Πλάγια πλευρά', value: 'Δεν πολλαπλασιάζεται με τη βάση γιατί είναι κεκλιμένη' }
    ],
    explanation: isQ1True
      ? 'ΣΩΣΤΟ: Το εμβαδόν κάθε παραλληλογράμμου δίνεται από τον τύπο Ε ＝ β · υ, όπου υ είναι το κάθετο ύψος στη βάση β.'
      : 'ΛΑΘΟΣ: Στο πλάγιο παραλληλόγραμμο δεν πολλαπλασιάζουμε τις δύο πλευρές, αλλά τη βάση με το κάθετο ύψος (Ε ＝ β · υ).'
  });

  // Q2: Επιλογή ύψους (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΕΝΝΟΙΑ ΤΟΥ ΥΨΟΥΣ',
    prompt: 'Τι είναι το ύψος ενός παραλληλογράμμου ως προς μία βάση του;',
    options: ensureFourUniqueOptions(
      'Το κάθετο ευθύγραμμο τμήμα (γωνία 90°) ανάμεσα στη βάση και την απέναντι πλευρά',
      () => [
        'Το μήκος της πλάγιας πλευράς του σχήματος',
        'Το μήκος της διαγωνίου του παραλληλογράμμου',
        'Το άθροισμα όλων των πλευρών του'
      ]
    ),
    correctAnswer: 'Το κάθετο ευθύγραμμο τμήμα (γωνία 90°) ανάμεσα στη βάση και την απέναντι πλευρά',
    tableData: [
      { label: 'Ορισμός ύψους', value: 'Κάθετη απόσταση (90°) μεταξύ παραλλήλων πλευρών' }
    ],
    explanation: 'Το ύψος είναι πάντοτε κάθετο (90°) στη βάση και εκφράζει την απόσταση ανάμεσα στις δύο παράλληλες πλευρές.'
  });

  // Q3: Μετατροπή σε ορθογώνιο (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΜΕΤΑΤΡΟΠΗ ΣΕ ΟΡΘΟΓΩΝΙΟ',
    prompt: 'Γιατί το εμβαδόν του παραλληλογράμμου υπολογίζεται με τον ίδιο τύπο όπως το ορθογώνιο (Ε ＝ β · υ);',
    options: ensureFourUniqueOptions(
      'Γιατί κόβοντας το ορθογώνιο τρίγωνο από τη μία πλευρά και κολλώντας το στην άλλη, σχηματίζεται τέλειο ορθογώνιο',
      () => [
        'Γιατί όλα τα παραλληλόγραμμα έχουν 4 ορθές γωνίες',
        'Γιατί έχουν πάντοτε ίσες πλευρές',
        'Επειδή έτσι συμφωνήθηκε χωρίς απόδειξη'
      ]
    ),
    correctAnswer: 'Γιατί κόβοντας το ορθογώνιο τρίγωνο από τη μία πλευρά και κολλώντας το στην άλλη, σχηματίζεται τέλειο ορθογώνιο',
    tableData: [
      { label: 'Αποκοπή', value: 'Αφαιρείται το ορθογώνιο τρίγωνο από αριστερά' },
      { label: 'Σύνθεση', value: 'Προστίθεται στα δεξιά και δημιουργεί ορθογώνιο με μήκος β και πλάτος υ' }
    ],
    explanation: 'Το παραλληλόγραμμο μετασχηματίζεται με αναδιάταξη σε ισοδύναμο ορθογώνιο με διαστάσεις β και υ.'
  });

  // Q4: Οπτική αναγνώριση ύψους (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΑΝΑΓΝΩΡΙΣΗ ΣΩΣΤΟΥ ΥΨΟΥΣ',
    prompt: 'Παρατηρήστε το παρακάτω παραλληλόγραμμο. Ποια γραμμή εκφράζει το πραγματικό ύψος (υ) που αντιστοιχεί στην κάτω βάση;',
    svg: (
      <svg viewBox="0 0 180 110" className="w-44 h-28 mx-auto my-2 select-none drop-shadow-sm">
        <polygon points="40,85 140,85 165,25 65,25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
        <line x1="65" y1="25" x2="65" y2="85" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="65" y="75" width="10" height="10" fill="none" stroke="#f59e0b" strokeWidth="1" />
        <circle cx="70" cy="80" r="1.5" fill="#f59e0b" />
        <text x="56" y="58" fill="#f59e0b" fontSize="11" fontWeight="bold">υ</text>
        <text x="25" y="55" fill="#a855f7" fontSize="10" fontWeight="bold">π</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(
      'Η κίτρινη κατακόρυφη διακεκομμένη γραμμή (υ) με τη γωνία 90°',
      () => [
        'Η μωβ πλάγια πλευρά (π) του σχήματος',
        'Η επάνω πλευρά του παραλληλογράμμου',
        'Η διαγώνιος του σχήματος'
      ]
    ),
    correctAnswer: 'Η κίτρινη κατακόρυφη διακεκομμένη γραμμή (υ) με τη γωνία 90°',
    tableData: [
      { label: 'Κίτρινη γραμμή (υ)', value: 'Κάθετο ύψος (σχηματίζει ορθή γωνία με τη βάση)' },
      { label: 'Μωβ πλευρά (π)', value: 'Πλάγια πλευρά (δεν είναι ύψος)' }
    ],
    explanation: 'Το ύψος είναι πάντοτε η κάθετη απόσταση (η κίτρινη διακεκομμένη γραμμή με το τετραγωνάκι της ορθής γωνίας).'
  });

  // Q5: Υπολογισμός εμβαδού (Input αριθμού)
  const b5 = randInt(7, 14);
  const h5 = randInt(4, 9);
  const area5 = b5 * h5;
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΕΜΒΑΔΟΥ ΣΕ CM²',
    prompt: `Ένα παραλληλόγραμμο έχει βάση ${b5} cm και αντίστοιχο ύψος ${h5} cm. Πόσα cm² είναι το εμβαδόν του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(area5),
    tableData: [
      { label: 'Βάση (β)', value: `${b5} cm` },
      { label: 'Ύψος (υ)', value: `${h5} cm` },
      { label: 'Πράξη', value: `${b5} · ${h5} ＝ ${area5} cm²` }
    ],
    explanation: `Ε ＝ β · υ ＝ ${b5} · ${h5} ＝ ${area5} cm².`
  });

  // Q6: Εύρεση ύψους (Input αριθμού)
  const area6 = 96;
  const b6 = 12;
  const h6 = area6 / b6; // 8
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΑΠΟ ΤΟ ΕΜΒΑΔΟΝ',
    prompt: `Το εμβαδόν ενός παραλληλογράμμου είναι 96 m² και η βάση του είναι 12 m. Πόσα μέτρα (m) είναι το ύψος του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(h6),
    tableData: [
      { label: 'Εμβαδόν', value: '96 m²' },
      { label: 'Βάση', value: '12 m' },
      { label: 'Πράξη (Ε : β)', value: '96 : 12 ＝ 8 m' }
    ],
    explanation: `υ ＝ Ε : β ＝ 96 : 12 ＝ 8 m.`
  });

  // Q7: Μετατροπή dm² σε cm² (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΣΧΕΣΗ DM² ΚΑΙ CM²',
    prompt: 'Πόσα τετραγωνικά εκατοστόμετρα (cm²) περιέχει 1 τετραγωνικό δεκατόμετρο (1 dm²);',
    options: ensureFourUniqueOptions('100 cm²', () => ['10 cm²', '1.000 cm²', '10.000 cm²']),
    correctAnswer: '100 cm²',
    tableData: [
      { label: '1 dm', value: '10 cm' },
      { label: '1 dm²', value: '10 cm · 10 cm ＝ 100 cm²' }
    ],
    explanation: '1 dm² ＝ 10 cm · 10 cm ＝ 100 cm².'
  });

  // Q8: Δύο βάσεις και δύο ύψη (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΣΧΕΣΗ ΔΥΟ ΥΨΩΝ',
    prompt: 'Αν σε ένα παραλληλόγραμμο γνωρίζουμε τις δύο διαφορετικές πλευρές του β₁ και β₂ και τα αντίστοιχα ύψη τους υ₁ και υ₂, ποια σχέση ισχύει πάντοτε;',
    options: ensureFourUniqueOptions('β₁ · υ₁ ＝ β₂ · υ₂ (το εμβαδόν μένει ίδιο)', () => [
      'β₁ · β₂ ＝ υ₁ · υ₂',
      'β₁ ＋ υ₁ ＝ β₂ ＋ υ₂',
      'υ₁ ＝ υ₂ πάντοτε'
    ]),
    correctAnswer: 'β₁ · υ₁ ＝ β₂ · υ₂ (το εμβαδόν μένει ίδιο)',
    tableData: [
      { label: 'Εμβαδόν με 1η βάση', value: 'Ε ＝ β₁ · υ₁' },
      { label: 'Εμβαδόν με 2η βάση', value: 'Ε ＝ β₂ · υ₂' },
      { label: 'Ισότητα', value: 'β₁ · υ₁ ＝ β₂ · υ₂' }
    ],
    explanation: 'Το εμβαδόν του σχήματος είναι μοναδικό, επομένως το γινόμενο οποιασδήποτε βάσης με το αντίστοιχο ύψος της είναι ίσο.'
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

export default function EmbadonParallilogrammouAskiseisPage() {
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
      title="Ασκήσεις: Εμβαδόν Παραλληλογράμμου - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στον υπολογισμό εμβαδού παραλληλογράμμου, εύρεση βάσης και ύψους και μετατροπές μονάδων επιφάνειας για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/73-embadon-parallilogrammou"
      backText="Θεωρία Κεφ. 73"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/73-embadon-parallilogrammou"
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
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 73 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Εμβαδον Παραλληλογραμμου')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στον υπολογισμό εμβαδού με τον τύπο Ε ＝ β · υ, στην εύρεση άγνωστης βάσης ή ύψους και στις μετατροπές μονάδων επιφάνειας μέσα από 12 δυναμικές ερωτήσεις.
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

                    {/* ΑΝΑΛΥΤΙΚΗ ΕΠΕΞΗΓΗΣΗ */}
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                          : 'bg-rose-50 text-rose-950 border border-rose-200'
                      }`}
                    >
                      <p className="font-bold mb-1">
                        {isCorrect
                          ? '✓ Μπράβο! Σωστή απάντηση.'
                          : `✗ Λάθος. Η σωστή απάντηση είναι: ${
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

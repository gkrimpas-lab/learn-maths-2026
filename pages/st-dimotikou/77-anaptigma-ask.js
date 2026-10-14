// pages/st-dimotikou/77-anaptigma-ask.js
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

// POOL ΓΙΑ Q9: Ολική Επιφάνεια Αναπτύγματος Κύβου [Ε ＝ 6 · α²]
const PROBLEM_POOL_Q9 = [
  // 1. Κατασκευή κύβου από χαρτόνι
  () => {
    const a = randInt(4, 12);
    const faceArea = a * a;
    const totalArea = 6 * faceArea;
    const correct = `${formatNum(totalArea)} cm²`;
    return {
      title: 'ΚΑΤΑΣΚΕΥΗ ΚΥΒΟΥ',
      prompt: `Ένας μαθητής σχεδιάζει το ανάπτυγμα ενός κύβου με ακμή ${a} cm. Πόσο χαρτόνι σε cm² θα καταλαμβάνει το ανάπτυγμα του κύβου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(faceArea)} cm²`,
        `${formatNum(totalArea + 24)} cm²`,
        `${formatNum(totalArea - 24 > 0 ? totalArea - 24 : totalArea + 48)} cm²`,
        `${formatNum(4 * faceArea)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Ακμή κύβου (α)', value: `${a} cm` },
        { label: 'Εμβαδόν 1 έδρας (τετράγωνο)', value: `${a} · ${a} ＝ ${faceArea} cm²` },
        { label: 'Πλήθος εδρών', value: '6 ίσες έδρες' },
        { label: 'Ολικό εμβαδόν αναπτύγματος', value: `6 · ${faceArea} ＝ ${formatNum(totalArea)} cm²` }
      ],
      explanation: `Ο κύβος έχει 6 ίσες τετράγωνες έδρες. Κάθε έδρα έχει εμβαδόν ${a} · ${a} ＝ ${faceArea} cm². Το ανάπτυγμα καλύπτει: 6 · ${faceArea} ＝ ${formatNum(totalArea)} cm².`
    };
  },
  // 2. Ξύλινο κουτί κύβος
  () => {
    const a = randInt(15, 25);
    const faceArea = a * a;
    const totalArea = 6 * faceArea;
    const correct = `${formatNum(totalArea)} cm²`;
    return {
      title: 'ΞΥΛΙΝΟ ΚΟΥΤΙ ΚΥΒΟΣ',
      prompt: `Ένα ξύλινο κουτί σε σχήμα κύβου έχει ακμή ${a} cm. Πόση είναι η συνολική επιφάνεια και των 6 εξωτερικών του εδρών;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(faceArea)} cm²`,
        `${formatNum(totalArea + 150)} cm²`,
        `${formatNum(totalArea - 150 > 0 ? totalArea - 150 : totalArea + 300)} cm²`,
        `${formatNum(a * 12)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Ακμή (α)', value: `${a} cm` },
        { label: 'Εμβαδόν 1 έδρας', value: `${faceArea} cm²` },
        { label: 'Πράξη (6 · α²)', value: `6 · ${faceArea} ＝ ${formatNum(totalArea)} cm²` }
      ],
      explanation: `Εολ ＝ 6 · α² ＝ 6 · (${a} · ${a}) ＝ 6 · ${faceArea} ＝ ${formatNum(totalArea)} cm².`
    };
  },
  // 3. Μεγάλο ζάρι
  () => {
    const a = 10;
    const faceArea = 100;
    const totalArea = 600;
    const correct = '600 cm²';
    return {
      title: 'ΜΕΓΑΛΟ ΖΑΡΙ',
      prompt: `Ένα διακοσμητικό ζάρι σε σχήμα κύβου έχει ακμή 10 cm. Πόσο είναι το συνολικό εμβαδόν των 6 εδρών του;`,
      options: ensureFourUniqueOptions(correct, () => ['100 cm²', '400 cm²', '360 cm²', '1.000 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Ακμή', value: '10 cm' },
        { label: '1 έδρα', value: '10 · 10 ＝ 100 cm²' },
        { label: '6 έδρες', value: '6 · 100 ＝ 600 cm²' }
      ],
      explanation: `6 · (10 · 10) ＝ 6 · 100 ＝ 600 cm².`
    };
  },
  // 4. Κύβος με ακμή 5 cm
  () => {
    const a = 5;
    const faceArea = 25;
    const totalArea = 150;
    const correct = '150 cm²';
    return {
      title: 'ΕΜΒΑΔΟΝ ΑΝΑΠΤΥΓΜΑΤΟΣ ΚΥΒΟΥ',
      prompt: `Πόσο είναι το εμβαδόν του αναπτύγματος ενός κύβου με ακμή 5 cm;`,
      options: ensureFourUniqueOptions(correct, () => ['25 cm²', '125 cm²', '100 cm²', '180 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Ακμή (α)', value: '5 cm' },
        { label: 'Εμβαδόν 1 έδρας', value: '5 · 5 ＝ 25 cm²' },
        { label: 'Ολικό εμβαδόν', value: '6 · 25 ＝ 150 cm²' }
      ],
      explanation: `6 · 25 ＝ 150 cm².`
    };
  },
  // 5. Κύβος σε μέτρα
  () => {
    const a = 2; // m
    const faceArea = 4;
    const totalArea = 24;
    const correct = '24 m²';
    return {
      title: 'ΚΥΒΙΚΗ ΔΕΞΑΜΕΝΗ',
      prompt: `Μια κλειστή δεξαμενή έχει σχήμα κύβου με ακμή 2 m. Πόσα τετραγωνικά μέτρα (m²) λαμαρίνας χρειάστηκαν για την κατασκευή και των 6 εδρών της;`,
      options: ensureFourUniqueOptions(correct, () => ['8 m²', '12 m²', '16 m²', '36 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Ακμή', value: '2 m' },
        { label: '1 έδρα', value: '2 · 2 ＝ 4 m²' },
        { label: '6 έδρες', value: '6 · 4 ＝ 24 m²' }
      ],
      explanation: `6 · (2 · 2) ＝ 6 · 4 ＝ 24 m².`
    };
  },
  // 6. Κύβος με ακμή 20 cm
  () => {
    const a = 20;
    const faceArea = 400;
    const totalArea = 2400;
    const correct = `${formatNum(totalArea)} cm²`;
    return {
      title: 'ΚΟΥΤΙ ΑΠΟΘΗΚΕΥΣΗΣ',
      prompt: `Ένα κουτί αποθήκευσης έχει σχήμα κύβου με ακμή 20 cm. Πόσα cm² είναι το εμβαδόν του αναπτύγματός του;`,
      options: ensureFourUniqueOptions(correct, () => ['400 cm²', '1.600 cm²', '2.000 cm²', '3.600 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Ακμή', value: '20 cm' },
        { label: '1 έδρα', value: '20 · 20 ＝ 400 cm²' },
        { label: '6 έδρες', value: '6 · 400 ＝ 2.400 cm²' }
      ],
      explanation: `6 · 400 ＝ 2.400 cm².`
    };
  }
];

// POOL ΓΙΑ Q10: Ολική Επιφάνεια Ορθογωνίου Παραλληλεπιπέδου
const PROBLEM_POOL_Q10 = [
  // 1. Κουτί δώρου
  () => {
    const l = randInt(15, 25);
    const w = randInt(10, 14);
    const h = randInt(6, 10);
    const f1 = l * w;
    const f2 = w * h;
    const f3 = l * h;
    const total = 2 * (f1 + f2 + f3);
    const correct = `${formatNum(total)} cm²`;
    return {
      title: 'ΚΟΥΤΙ ΔΩΡΟΥ',
      prompt: `Ένα κουτί δώρου σε σχήμα ορθογωνίου παραλληλεπιπέδου έχει μήκος ${l} cm, πλάτος ${w} cm και ύψος ${h} cm. Πόσο χαρτί περιτυλίγματος σε cm² απαιτείται για να καλυφθούν ακριβώς οι 6 έδρες του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(f1 + f2 + f3)} cm²`,
        `${formatNum(total + 50)} cm²`,
        `${formatNum(total - 50 > 0 ? total - 50 : total + 100)} cm²`,
        `${formatNum(l * w * h)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: '2 έδρες (μήκος · πλάτος)', value: `2 · (${l} · ${w}) ＝ ${2 * f1} cm²` },
        { label: '2 έδρες (πλάτος · ύψος)', value: `2 · (${w} · ${h}) ＝ ${2 * f2} cm²` },
        { label: '2 έδρες (μήκος · ύψος)', value: `2 · (${l} · ${h}) ＝ ${2 * f3} cm²` },
        { label: 'Ολική επιφάνεια (6 έδρες)', value: `${2 * f1} ＋ ${2 * f2} ＋ ${2 * f3} ＝ ${formatNum(total)} cm²` }
      ],
      explanation: `Υπολογίζουμε τα 3 ζεύγη ίσων εδρών: 2 · (${l} · ${w} ＋ ${w} · ${h} ＋ ${l} · ${h}) ＝ ${formatNum(total)} cm².`
    };
  },
  // 2. Κουτί παπουτσιών
  () => {
    const l = 30;
    const w = 20;
    const h = 10;
    const total = 2 * (30 * 20 + 20 * 10 + 30 * 10); // 2 * (600 + 200 + 300) = 2.200
    const correct = `${formatNum(total)} cm²`;
    return {
      title: 'ΚΟΥΤΙ ΠΑΠΟΥΤΣΙΩΝ',
      prompt: `Ένα κουτί παπουτσιών έχει διαστάσεις 30 cm, 20 cm και 10 cm. Πόσα cm² χαρτονιού χρειάστηκαν για την κατασκευή του αναπτύγματός του;`,
      options: ensureFourUniqueOptions(correct, () => ['1.100 cm²', '6.000 cm²', '2.000 cm²', '2.400 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Βάση και καπάκι', value: '2 · (30 · 20) ＝ 1.200 cm²' },
        { label: 'Πλαϊνές έδρες', value: '2 · (20 · 10) ＝ 400 cm²' },
        { label: 'Εμπρός και πίσω', value: '2 · (30 · 10) ＝ 600 cm²' },
        { label: 'Σύνολο', value: '1.200 ＋ 400 ＋ 600 ＝ 2.200 cm²' }
      ],
      explanation: `2 · (600 ＋ 200 ＋ 300) ＝ 2 · 1.100 ＝ 2.200 cm².`
    };
  },
  // 3. Σπιρτόκουτο
  () => {
    const l = 5;
    const w = 4;
    const h = 2;
    const total = 2 * (5 * 4 + 4 * 2 + 5 * 2); // 2 * (20 + 8 + 10) = 76
    const correct = `${total} cm²`;
    return {
      title: 'ΣΠΙΡΤΟΚΟΥΤΟ',
      prompt: `Ένα σπιρτόκουτο έχει μήκος 5 cm, πλάτος 4 cm και ύψος 2 cm. Πόση είναι η ολική εξωτερική επιφάνεια του κουτιού;`,
      options: ensureFourUniqueOptions(correct, () => ['38 cm²', '40 cm²', '80 cm²', '60 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Διαστάσεις', value: '5 cm, 4 cm, 2 cm' },
        { label: 'Πράξη', value: '2 · (20 ＋ 8 ＋ 10) ＝ 2 · 38 ＝ 76 cm²' }
      ],
      explanation: `2 · (5 · 4 ＋ 4 · 2 ＋ 5 · 2) ＝ 2 · 38 ＝ 76 cm².`
    };
  },
  // 4. Κουτί δημητριακών
  () => {
    const l = 20;
    const w = 8;
    const h = 25;
    const total = 2 * (20 * 8 + 8 * 25 + 20 * 25); // 2 * (160 + 200 + 500) = 2 * 860 = 1720
    const correct = `${formatNum(total)} cm²`;
    return {
      title: 'ΚΟΥΤΙ ΔΗΜΗΤΡΙΑΚΩΝ',
      prompt: `Ένα κουτί δημητριακών έχει μήκος 20 cm, πλάτος 8 cm και ύψος 25 cm. Πόσο είναι το εμβαδόν του αναπτύγματός του;`,
      options: ensureFourUniqueOptions(correct, () => ['860 cm²', '4.000 cm²', '1.500 cm²', '1.800 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: '3 επιμέρους εμβαδά', value: '160 cm², 200 cm², 500 cm² (άθροισμα 860 cm²)' },
        { label: 'Ολικό εμβαδόν', value: '2 · 860 ＝ 1.720 cm²' }
      ],
      explanation: `2 · (160 ＋ 200 ＋ 500) ＝ 2 · 860 ＝ 1.720 cm².`
    };
  },
  // 5. Ενυδρείο (κλειστό με καπάκι)
  () => {
    const l = 50;
    const w = 30;
    const h = 40;
    const total = 2 * (50 * 30 + 30 * 40 + 50 * 40); // 2 * (1500 + 1200 + 2000) = 2 * 4700 = 9400
    const correct = `${formatNum(total)} cm²`;
    return {
      title: 'ΚΛΕΙΣΤΟ ΕΝΥΔΡΕΙΟ',
      prompt: `Ένα κλειστό γυάλινο ενυδρείο έχει μήκος 50 cm, πλάτος 30 cm και ύψος 40 cm. Πόσα cm² γυαλιού χρειάστηκαν για τις 6 έδρες του;`,
      options: ensureFourUniqueOptions(correct, () => ['4.700 cm²', '60.000 cm²', '9.000 cm²', '8.400 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Ζεύγη εδρών', value: '3.000 cm² ＋ 2.400 cm² ＋ 4.000 cm²' },
        { label: 'Σύνολο', value: '9.400 cm²' }
      ],
      explanation: `2 · (1.500 ＋ 1.200 ＋ 2.000) ＝ 9.400 cm².`
    };
  },
  // 6. Κουτί συσκευασίας
  () => {
    const l = 10;
    const w = 5;
    const h = 4;
    const total = 2 * (10 * 5 + 5 * 4 + 10 * 4); // 2 * (50 + 20 + 40) = 220
    const correct = '220 cm²';
    return {
      title: 'ΜΙΚΡΟ ΚΟΥΤΙ ΣΥΣΚΕΥΑΣΙΑΣ',
      prompt: `Ένα κουτί έχει μήκος 10 cm, πλάτος 5 cm και ύψος 4 cm. Πόσο είναι το ολικό εμβαδόν των εδρών του;`,
      options: ensureFourUniqueOptions(correct, () => ['110 cm²', '200 cm²', '240 cm²', '180 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: '3 έδρες', value: '50 ＋ 20 ＋ 40 ＝ 110 cm²' },
        { label: 'Ολικό εμβαδόν', value: '2 · 110 ＝ 220 cm²' }
      ],
      explanation: `2 · (50 ＋ 20 ＋ 40) ＝ 220 cm².`
    };
  }
];

// POOL ΓΙΑ Q11: Αντίστροφο Πρόβλημα Κύβου (Εύρεση Ακμής από την Επιφάνεια)
const PROBLEM_POOL_Q11 = [
  // 1. Εύρεση ακμής κύβου με Εολ = 96 cm²
  () => {
    const a = 4; // 6 * 16 = 96
    const correct = '4 cm';
    return {
      title: 'ΕΥΡΕΣΗ ΑΚΜΗΣ ΚΥΒΟΥ',
      prompt: `Το ολικό εμβαδόν του αναπτύγματος ενός κύβου είναι 96 cm². Πόσο είναι το μήκος της ακμής του κύβου;`,
      options: ensureFourUniqueOptions(correct, () => ['16 cm', '6 cm', '8 cm', '5 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Ολικό εμβαδόν (6 έδρες)', value: '96 cm²' },
        { label: 'Εμβαδόν 1 έδρας (: 6)', value: '96 : 6 ＝ 16 cm²' },
        { label: 'Μήκος ακμής (α · α ＝ 16)', value: 'α ＝ 4 cm' }
      ],
      explanation: `Διαιρούμε το ολικό εμβαδόν με το 6 για να βρούμε την επιφάνεια της μίας έδρας: 96 : 6 ＝ 16 cm². Αφού η έδρα είναι τετράγωνο, ψάχνουμε ποιος αριθμός πολλαπλασιασμένος με τον εαυτό του δίνει 16: 4 · 4 ＝ 16, άρα η ακμή είναι 4 cm.`
    };
  },
  // 2. Εύρεση ακμής κύβου με Εολ = 150 cm²
  () => {
    const a = 5; // 6 * 25 = 150
    const correct = '5 cm';
    return {
      title: 'ΑΚΜΗ ΚΥΒΟΥ ΑΠΟ ΤΟ ΕΜΒΑΔΟΝ',
      prompt: `Το ανάπτυγμα ενός κύβου καταλαμβάνει επιφάνεια 150 cm². Πόσο μετράει η ακμή του κύβου;`,
      options: ensureFourUniqueOptions(correct, () => ['25 cm', '6 cm', '10 cm', '4 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Εμβαδόν 1 έδρας', value: '150 : 6 ＝ 25 cm²' },
        { label: 'Ακμή (α · α ＝ 25)', value: 'α ＝ 5 cm' }
      ],
      explanation: `150 : 6 ＝ 25 cm². Επειδή 5 · 5 ＝ 25, η ακμή είναι 5 cm.`
    };
  },
  // 3. Εύρεση ακμής κύβου με Εολ = 216 cm²
  () => {
    const a = 6; // 6 * 36 = 216
    const correct = '6 cm';
    return {
      title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΑΚΜΗΣ ΚΥΒΟΥ',
      prompt: `Ένας κύβος έχει ολική επιφάνεια 216 cm². Πόσο είναι το μήκος κάθε ακμής του;`,
      options: ensureFourUniqueOptions(correct, () => ['36 cm', '8 cm', '12 cm', '4 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: '1 έδρα', value: '216 : 6 ＝ 36 cm²' },
        { label: 'Ακμή', value: '6 · 6 ＝ 36, άρα α ＝ 6 cm' }
      ],
      explanation: `216 : 6 ＝ 36 cm². 6 · 6 ＝ 36, άρα α ＝ 6 cm.`
    };
  },
  // 4. Εύρεση ακμής κύβου με Εολ = 384 cm²
  () => {
    const a = 8; // 6 * 64 = 384
    const correct = '8 cm';
    return {
      title: 'ΜΗΚΟΣ ΑΚΜΗΣ ΑΠΟ ΤΗΝ ΕΠΙΦΑΝΕΙΑ',
      prompt: `Το ανάπτυγμα ενός ζαριού έχει εμβαδόν 384 cm². Πόσα εκατοστόμετρα (cm) είναι η ακμή του ζαριού;`,
      options: ensureFourUniqueOptions(correct, () => ['64 cm', '7 cm', '9 cm', '6 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: '1 έδρα', value: '384 : 6 ＝ 64 cm²' },
        { label: 'Ακμή', value: '8 · 8 ＝ 64, άρα α ＝ 8 cm' }
      ],
      explanation: `384 : 6 ＝ 64 cm². 8 · 8 ＝ 64, άρα α ＝ 8 cm.`
    };
  },
  // 5. Εύρεση ακμής κύβου με Εολ = 24 cm²
  () => {
    const a = 2; // 6 * 4 = 24
    const correct = '2 cm';
    return {
      title: 'ΜΙΚΡΟΣ ΚΥΒΟΣ',
      prompt: `Ένας μικρός κύβος έχει συνολικό εμβαδόν αναπτύγματος 24 cm². Πόσο είναι το μήκος της ακμής του;`,
      options: ensureFourUniqueOptions(correct, () => ['4 cm', '3 cm', '6 cm', '1 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: '1 έδρα', value: '24 : 6 ＝ 4 cm²' },
        { label: 'Ακμή', value: '2 · 2 ＝ 4, άρα α ＝ 2 cm' }
      ],
      explanation: `24 : 6 ＝ 4 cm². 2 · 2 ＝ 4, άρα α ＝ 2 cm.`
    };
  },
  // 6. Εύρεση ακμής κύβου με Εολ = 54 cm²
  () => {
    const a = 3; // 6 * 9 = 54
    const correct = '3 cm';
    return {
      title: 'ΑΚΜΗ ΚΥΒΟΥ 54 CM²',
      prompt: `Ένας κύβος έχει ολική επιφάνεια 54 cm². Πόσο είναι το μήκος της ακμής του;`,
      options: ensureFourUniqueOptions(correct, () => ['9 cm', '6 cm', '4 cm', '2 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: '1 έδρα', value: '54 : 6 ＝ 9 cm²' },
        { label: 'Ακμή', value: '3 · 3 ＝ 9, άρα α ＝ 3 cm' }
      ],
      explanation: `54 : 6 ＝ 9 cm². 3 · 3 ＝ 9, άρα α ＝ 3 cm.`
    };
  }
];

// POOL ΓΙΑ Q12: Συνολικό Μήκος Ακμών & Σύνθετοι Υπολογισμοί
const PROBLEM_POOL_Q12 = [
  // 1. Συρμάτινος σκελετός κύβου (12 ακμές)
  () => {
    const a = randInt(5, 15);
    const totalWire = 12 * a;
    const correct = `${totalWire} cm`;
    return {
      title: 'ΣΥΡΜΑΤΙΝΟΣ ΣΚΕΛΕΤΟΣ ΚΥΒΟΥ',
      prompt: `Θέλουμε να κατασκευάσουμε έναν σκελετό κύβου από σύρμα με μήκος ακμής ${a} cm. Πόσο σύρμα σε cm θα χρειαστεί για να φτιαχτούν όλες οι ακμές του κύβου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${6 * a} cm`,
        `${8 * a} cm`,
        `${totalWire + 12} cm`,
        `${totalWire - 12 > 0 ? totalWire - 12 : totalWire + 24} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Μήκος 1 ακμής', value: `${a} cm` },
        { label: 'Συνολικό πλήθος ακμών κύβου', value: '12 ακμές' },
        { label: 'Συνολικό μήκος σύρματος', value: `12 · ${a} ＝ ${totalWire} cm` }
      ],
      explanation: `Ο κύβος έχει 12 ίσες ακμές. Επομένως, το συνολικό μήκος του σύρματος είναι: 12 · ${a} ＝ ${totalWire} cm.`
    };
  },
  // 2. Συρμάτινος σκελετός ορθογωνίου παραλληλεπιπέδου
  () => {
    const l = 10;
    const w = 6;
    const h = 4;
    const totalWire = 4 * (l + w + h); // 4 * 20 = 80 cm
    const correct = '80 cm';
    return {
      title: 'ΣΚΕΛΕΤΟΣ ΟΡΘΟΓΩΝΙΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ',
      prompt: `Κατασκευάζουμε τον σκελετό ενός ορθογωνίου παραλληλεπιπέδου με σύρμα. Αν οι διαστάσεις του είναι 10 cm, 6 cm και 4 cm, πόσο σύρμα χρειάζεται για τις 12 ακμές του;`,
      options: ensureFourUniqueOptions(correct, () => ['20 cm', '40 cm', '100 cm', '60 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Ομάδες ακμών', value: '4 μήκη, 4 πλάτη, 4 ύψη' },
        { label: 'Πράξη', value: '4 · (10 ＋ 6 ＋ 4) ＝ 4 · 20 ＝ 80 cm' }
      ],
      explanation: `Το ορθογώνιο παραλληλεπίπεδο έχει 4 ακμές από κάθε διάσταση: 4 · (10 ＋ 6 ＋ 4) ＝ 4 · 20 ＝ 80 cm.`
    };
  },
  // 3. Μετατροπή ολικού εμβαδού σε dm²
  () => {
    const a = 10;
    const totalCm2 = 6 * 100; // 600 cm²
    const totalDm2 = 6; // 6 dm²
    const correct = '6 dm²';
    return {
      title: 'ΕΠΙΦΑΝΕΙΑ ΣΕ DM²',
      prompt: `Το ανάπτυγμα ενός κύβου με ακμή 10 cm έχει εμβαδόν 600 cm². Πόσα τετραγωνικά δεκατόμετρα (dm²) είναι το εμβαδόν του αναπτύγματος;`,
      options: ensureFourUniqueOptions(correct, () => ['60 dm²', '0,6 dm²', '600 dm²', '6.000 dm²']),
      correctAnswer: correct,
      unit: 'dm²',
      tableData: [
        { label: 'Εμβαδόν σε cm²', value: '600 cm²' },
        { label: 'Σχέση cm²/dm²', value: '1 dm² ＝ 100 cm²' },
        { label: 'Πράξη (: 100)', value: '600 : 100 ＝ 6 dm²' }
      ],
      explanation: `600 : 100 ＝ 6 dm².`
    };
  },
  // 4. Ανοιχτό κουτί (χωρίς καπάκι - 5 έδρες)
  () => {
    const a = 5;
    const face = 25;
    const openBoxArea = 5 * face; // 125 cm²
    const correct = '125 cm²';
    return {
      title: 'ΑΝΟΙΧΤΟ ΚΟΥΤΙ ΧΩΡΙΣ ΚΑΠΑΚΙ',
      prompt: `Θέλουμε να φτιάξουμε ένα ανοιχτό κυβικό κουτί (χωρίς καπάκι στο πάνω μέρος) με ακμή 5 cm. Πόσο χαρτόνι σε cm² θα χρειαστούμε για τις 5 έδρες του;`,
      options: ensureFourUniqueOptions(correct, () => ['150 cm²', '100 cm²', '75 cm²', '120 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: '1 έδρα', value: '5 · 5 ＝ 25 cm²' },
        { label: 'Πλήθος εδρών χωρίς καπάκι', value: '5 έδρες' },
        { label: 'Πράξη', value: '5 · 25 ＝ 125 cm²' }
      ],
      explanation: `Αφού το κουτί δεν έχει καπάκι, αποτελείται από 5 μόνο έδρες: 5 · 25 ＝ 125 cm² (αντί για 6 · 25 ＝ 150 cm²).`
    };
  },
  // 5. Διπλασιασμός ακμής κύβου (επιφάνεια x4)
  () => {
    const correct = '4 φορές μεγαλύτερο (τετραπλασιάζεται)';
    return {
      title: 'ΜΕΤΑΒΟΛΗ ΑΚΜΗΣ ΚΥΒΟΥ',
      prompt: `Αν διπλασιάσουμε το μήκος της ακμής ενός κύβου, πόσες φορές μεγαλύτερο θα γίνει το εμβαδόν του αναπτύγματός του;`,
      options: ensureFourUniqueOptions(correct, () => [
        '2 φορές μεγαλύτερο (διπλασιάζεται)',
        '6 φορές μεγαλύτερο',
        '8 φορές μεγαλύτερο'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Αρχική επιφάνεια', value: 'Ε₁ ＝ 6 · α²' },
        { label: 'Νέα επιφάνεια', value: 'Ε₂ ＝ 6 · (2α)² ＝ 6 · 4α² ＝ 4 · Ε₁' }
      ],
      explanation: `Επειδή η ακμή υψώνεται στο τετράγωνο (α²), ο διπλασιασμός της ακμής τετραπλασιάζει το εμβαδόν της επιφάνειας: 2 · 2 ＝ 4 φορές μεγαλύτερο.`
    };
  },
  // 6. Πόσα διαφορετικά αναπτύγματα έχει ο κύβος
  () => {
    const correct = '11 διαφορετικά αναπτύγματα';
    return {
      title: 'ΠΛΗΘΟΣ ΑΝΑΠΤΥΓΜΑΤΩΝ ΚΥΒΟΥ',
      prompt: `Πόσα διαφορετικά δυνατά επίπεδα αναπτύγματα υπάρχουν συνολικά για τον κύβο;`,
      options: ensureFourUniqueOptions(correct, () => [
        '6 διαφορετικά αναπτύγματα',
        '8 διαφορετικά αναπτύγματα',
        '12 διαφορετικά αναπτύγματα',
        'Άπειρα αναπτύγματα'
      ]),
      correctAnswer: correct,
      unit: 'αναπτύγματα',
      tableData: [
        { label: 'Σχήμα', value: 'Κύβος (6 ίσα τετράγωνα)' },
        { label: 'Μαθηματικό πλήθος', value: 'Ακριβώς 11 δυνατά αναπτύγματα' }
      ],
      explanation: `Υπάρχουν ακριβώς 11 γεωμετρικά διαφορετικά αναπτύγματα από 6 συνδεδεμένα τετράγωνα που μπορούν να διπλωθούν σχηματίζοντας κύβο.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Στοιχεία κύβου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΣΤΟΙΧΕΙΑ ΚΥΒΟΥ',
    prompt: isQ1True
      ? 'Ο κύβος και το ορθογώνιο παραλληλεπίπεδο έχουν ακριβώς 6 έδρες, 12 ακμές και 8 κορυφές.'
      : 'Ο κύβος έχει 6 έδρες, 8 ακμές και 12 κορυφές.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Έδρες', value: '6 επίπεδες επιφάνειες' },
      { label: 'Ακμές', value: '12 ευθύγραμμα τμήματα' },
      { label: 'Κορυφές', value: '8 γωνιακά σημεία' }
    ],
    explanation: isQ1True
      ? 'Τόσο ο κύβος όσο και το ορθογώνιο παραλληλεπίπεδο έχουν 6 έδρες, 12 ακμές και 8 κορυφές.'
      : 'Ο κύβος έχει 12 ακμές και 8 κορυφές (και όχι 8 ακμές και 12 κορυφές).'
  });

  // Q2: Τι είναι ανάπτυγμα (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΕΝΝΟΙΑ ΑΝΑΠΤΥΓΜΑΤΟΣ',
    prompt: 'Τι ονομάζεται ανάπτυγμα ενός γεωμετρικού στερεού;',
    options: ensureFourUniqueOptions(
      'Το επίπεδο σχήμα που προκύπτει αν ανοίξουμε όλες τις έδρες του στερεού πάνω σε μία επιφάνεια',
      () => [
        'Το βάρος του στερεού σε γραμμάρια',
        'Ο όγκος του νερού που χωράει μέσα στο κουτί',
        'Το μήκος της μεγαλύτερης ακμής του'
      ]
    ),
    correctAnswer: 'Το επίπεδο σχήμα που προκύπτει αν ανοίξουμε όλες τις έδρες του στερεού πάνω σε μία επιφάνεια',
    tableData: [
      { label: 'Ορισμός', value: 'Επίπεδη διάταξη όλων των συνδεδεμένων εδρών του στερεού' }
    ],
    explanation: 'Ανάπτυγμα είναι το επίπεδο σχήμα από χαρτόνι που αν διπλωθεί στις ακμές του, σχηματίζει το στερεό.'
  });

  // Q3: Ποιες έδρες είναι ίσες στο ορθογώνιο παραλληλεπίπεδο (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΕΔΡΕΣ ΟΡΘΟΓΩΝΙΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ',
    prompt: 'Ποιες έδρες είναι ίσες μεταξύ τους σε ένα ορθογώνιο παραλληλεπίπεδο;',
    options: ensureFourUniqueOptions('Οι απέναντι έδρες είναι ανά 2 ίσες (3 ζεύγη ίσων εδρών)', () => [
      'Και οι 6 έδρες είναι υποχρεωτικά ίσες μεταξύ τους',
      'Όλες οι έδρες έχουν διαφορετικό μέγεθος',
      'Μόνο η πάνω και η κάτω έδρα είναι ίσες'
    ]),
    correctAnswer: 'Οι απέναντι έδρες είναι ανά 2 ίσες (3 ζεύγη ίσων εδρών)',
    tableData: [
      { label: '3 ζεύγη εδρών', value: '2 βάσεις (α · β), 2 πλαϊνές (β · γ), 2 εμπρός/πίσω (α · γ)' }
    ],
    explanation: 'Στο ορθογώνιο παραλληλεπίπεδο οι απέναντι έδρες είναι παράλληλες και ίσες ανά δύο (3 ζεύγη).'
  });

  // Q4: Οπτική αναγνώριση έγκυρου αναπτύγματος κύβου (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΑΝΑΓΝΩΡΙΣΗ ΕΓΚΥΡΟΥ ΑΝΑΠΤΥΓΜΑΤΟΣ',
    prompt: 'Παρατηρήστε το παρακάτω σχήμα 6 τετραγώνων (σε μορφή σταυρού). Μπορεί να διπλωθεί σχηματίζοντας κύβο;',
    svg: (
      <svg viewBox="0 0 160 120" className="w-40 h-28 mx-auto my-2 select-none drop-shadow-sm">
        {/* Σταυρός: κεντρική στήλη 4 τετράγωνα x=60, y=10,35,60,85. Πτερύγια x=35, y=35 και x=85, y=35 */}
        <rect x="60" y="10" width="25" height="25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
        <rect x="35" y="35" width="25" height="25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
        <rect x="60" y="35" width="25" height="25" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="1.5" />
        <rect x="85" y="35" width="25" height="25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
        <rect x="60" y="60" width="25" height="25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
        <rect x="60" y="85" width="25" height="25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
      </svg>
    ),
    options: ensureFourUniqueOptions('Ναι, είναι το κλασικό έγκυρο ανάπτυγμα κύβου σε σχήμα σταυρού', () => [
      'Όχι, γιατί έχει πάρα πολλά τετράγωνα',
      'Όχι, γιατί θα επικαλυφθούν δύο έδρες',
      'Όχι, διπλώνει μόνο σε ορθογώνιο παραλληλεπίπεδο'
    ]),
    correctAnswer: 'Ναι, είναι το κλασικό έγκυρο ανάπτυγμα κύβου σε σχήμα σταυρού',
    tableData: [
      { label: 'Σχήμα σταυρού', value: '4 τετράγωνα σε στήλη και 2 πλαϊνά πτερύγια εκατέρωθεν' },
      { label: 'Αποτέλεσμα', value: 'Διπλώνει άψογα σε κύβο' }
    ],
    explanation: 'Το σχήμα του σταυρού (διάταξη 1-4-1) είναι το πιο κλασικό έγκυρο ανάπτυγμα κύβου.'
  });

  // Q5: Υπολογισμός εμβαδού αναπτύγματος κύβου με ακμή 6 cm (Input αριθμού)
  const a5 = 6;
  const area5 = 6 * a5 * a5; // 216
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΕΜΒΑΔΟΝ ΑΝΑΠΤΥΓΜΑΤΟΣ ΚΥΒΟΥ (Α = 6 CM)',
    prompt: `Πόσα cm² είναι το εμβαδόν του αναπτύγματος ενός κύβου με ακμή 6 cm; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(area5),
    tableData: [
      { label: 'Ακμή (α)', value: '6 cm' },
      { label: '1 έδρα (α²)', value: '6 · 6 ＝ 36 cm²' },
      { label: '6 έδρες (6 · α²)', value: '6 · 36 ＝ 216 cm²' }
    ],
    explanation: `Εολ ＝ 6 · α² ＝ 6 · (6 · 6) ＝ 6 · 36 ＝ 216 cm².`
  });

  // Q6: Πλήθος ακμών ορθογωνίου παραλληλεπιπέδου (Input αριθμού)
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΠΛΗΘΟΣ ΑΚΜΩΝ ΣΤΕΡΕΟΥ',
    prompt: 'Πόσες ακμές έχει συνολικά ένα ορθογώνιο παραλληλεπίπεδο; (Γράψτε μόνο τον αριθμό)',
    correctAnswer: '12',
    tableData: [
      { label: 'Στερεό', value: 'Ορθογώνιο παραλληλεπίπεδο' },
      { label: 'Πλήθος ακμών', value: '12 ακμές (4 μήκη, 4 πλάτη, 4 ύψη)' }
    ],
    explanation: 'Το ορθογώνιο παραλληλεπίπεδο έχει 12 ακμές.'
  });

  // Q7: Άκυρο ανάπτυγμα κύβου (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΚΑΝΟΝΑΣ ΑΠΟΡΡΙΨΗΣ ΑΝΑΠΤΥΓΜΑΤΟΣ',
    prompt: 'Ποια από τις παρακάτω διατάξεις 6 τετραγώνων ΔΕΝ μπορεί ποτέ να διπλωθεί σε κύβο;',
    options: ensureFourUniqueOptions('Μια διάταξη όπου 4 τετράγωνα σχηματίζουν ένα μεγάλο μπλοκ 2 × 2', () => [
      'Μια διάταξη σε σχήμα σταυρού',
      'Μια διάταξη σε σχήμα Τ',
      'Μια διάταξη με 4 τετράγωνα σε σειρά και 2 εκατέρωθεν'
    ]),
    correctAnswer: 'Μια διάταξη όπου 4 τετράγωνα σχηματίζουν ένα μεγάλο μπλοκ 2 × 2',
    tableData: [
      { label: 'Μπλοκ 2 × 2', value: 'Σχηματίζει γωνία 4 τετραγώνων όπου οι έδρες επικαλύπτονται' },
      { label: 'Κανόνας', value: 'Κανένα έγκυρο ανάπτυγμα κύβου δεν περιέχει μπλοκ 2 × 2' }
    ],
    explanation: 'Αν υπάρχουν 4 τετράγωνα σε μπλοκ 2 × 2, κάποιες έδρες θα επικαλυφθούν και το κουτί θα μείνει ανοιχτό από την άλλη πλευρά.'
  });

  // Q8: Τύπος ολικής επιφάνειας ορθογωνίου παραλληλεπιπέδου (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΤΥΠΟΣ ΕΠΙΦΑΝΕΙΑΣ ΟΡΘΟΓΩΝΙΟΥ',
    prompt: 'Πώς υπολογίζουμε το εμβαδόν του αναπτύγματος ενός ορθογωνίου παραλληλεπιπέδου με διαστάσεις α, β και γ;',
    options: ensureFourUniqueOptions('Εολ ＝ 2 · (α · β ＋ β · γ ＋ α · γ)', () => [
      'Εολ ＝ α · β · γ',
      'Εολ ＝ 6 · (α ＋ β ＋ γ)',
      'Εολ ＝ 4 · α · β'
    ]),
    correctAnswer: 'Εολ ＝ 2 · (α · β ＋ β · γ ＋ α · γ)',
    tableData: [
      { label: '3 ζεύγη εδρών', value: '2 · (α · β) ＋ 2 · (β · γ) ＋ 2 · (α · γ)' },
      { label: 'Τελικός τύπος', value: '2 · (α · β ＋ β · γ ＋ α · γ)' }
    ],
    explanation: 'Προσθέτουμε τα εμβαδά των 3 διαφορετικών εδρών και διπλασιάζουμε το αποτέλεσμα, αφού υπάρχουν 2 έδρες από κάθε είδος.'
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

export default function AnaptigmaAskiseisPage() {
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
      title="Ασκήσεις: Αναπτύγματα Στερεών &amp; Επιφάνειες - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στα αναπτύγματα κύβου και ορθογωνίου παραλληλεπιπέδου, έδρες, ακμές, κορυφές και ολική επιφάνεια για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/77-anaptigma"
      backText="Θεωρία Κεφ. 77"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/77-anaptigma"
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
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 77 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Αναπτυγματα Κυβου και Ορθογωνιου')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στα στοιχεία των στερεών (έδρες, ακμές, κορυφές), στα έγκυρα αναπτύγματα και στον υπολογισμό της ολικής επιφάνειας μέσα από 12 δυναμικές ερωτήσεις.
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

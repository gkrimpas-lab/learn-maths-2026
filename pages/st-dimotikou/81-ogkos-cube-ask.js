// pages/st-dimotikou/81-ogkos-cube-ask.js
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

// POOL ΓΙΑ Q9: Υπολογισμός Όγκου Κύβου (V ＝ α³)
const PROBLEM_POOL_Q9 = [
  // 1. Ξύλινο κυβικό κουτί
  () => {
    const a = randInt(4, 9);
    const vol = a * a * a;
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΟΓΚΟΣ ΞΥΛΙΝΟΥ ΚΥΒΟΥ',
      prompt: `Ένας συμπαγής ξύλινος κύβος έχει ακμή μήκους ${a} cm. Ποιος είναι ο όγκος του σε cm³;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a * a)} cm³`,
        `${formatNum(vol + 18)} cm³`,
        `${formatNum(vol - 12 > 0 ? vol - 12 : vol + 36)} cm³`,
        `${formatNum(6 * a * a)} cm³`
      ]),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακμή κύβου (α)', value: `${a} cm` },
        { label: 'Τύπος όγκου κύβου', value: 'V ＝ α · α · α ＝ α³' },
        { label: 'Πράξη υπολογισμού', value: `${a} · ${a} · ${a} ＝ ${formatNum(vol)} cm³` }
      ],
      explanation: `Ο όγκος του κύβου ισούται με την ακμή υψωμένη στην τρίτη δύναμη: V ＝ α³ ＝ ${a} · ${a} · ${a} ＝ ${formatNum(vol)} cm³.`
    };
  },
  // 2. Κυβικό δοχείο σε dm³
  () => {
    const a = randInt(3, 7);
    const vol = a * a * a;
    const correct = `${formatNum(vol)} dm³`;
    return {
      title: 'ΚΥΒΙΚΟ ΔΟΧΕΙΟ ΣΕ DM³',
      prompt: `Ένα μεταλλικό δοχείο έχει σχήμα κύβου με ακμή ${a} dm. Πόσα κυβικά δεκατόμετρα (dm³) είναι ο όγκος του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a * a)} dm³`,
        `${formatNum(vol + 25)} dm³`,
        `${formatNum(vol - 20 > 0 ? vol - 20 : vol + 50)} dm³`,
        `${formatNum(a * 3)} dm³`
      ]),
      correctAnswer: correct,
      unit: 'dm³',
      tableData: [
        { label: 'Ακμή κύβου (α)', value: `${a} dm` },
        { label: 'Πράξη', value: `${a} · ${a} · ${a} ＝ ${formatNum(vol)} dm³` }
      ],
      explanation: `V ＝ α · α · α ＝ ${a} · ${a} · ${a} ＝ ${formatNum(vol)} dm³.`
    };
  },
  // 3. Μεγάλη κυβική δεξαμενή σε m³
  () => {
    const a = 3;
    const vol = 27;
    const correct = '27 m³';
    return {
      title: 'ΚΥΒΙΚΗ ΔΕΞΑΜΕΝΗ ΝΕΡΟΥ',
      prompt: `Μια κυβική δεξαμενή νερού σε μια αγροτική αποθήκη έχει ακμή 3 m. Πόσα κυβικά μέτρα (m³) είναι ο όγκος της;`,
      options: ensureFourUniqueOptions(correct, () => ['9 m³', '18 m³', '54 m³', '81 m³']),
      correctAnswer: correct,
      unit: 'm³',
      tableData: [
        { label: 'Ακμή κύβου', value: '3 m' },
        { label: 'Πράξη', value: '3 · 3 · 3 ＝ 27 m³' }
      ],
      explanation: `V ＝ 3 · 3 · 3 ＝ 27 m³.`
    };
  },
  // 4. Κυβικό ζάρι
  () => {
    const a = 2;
    const vol = 8;
    const correct = '8 cm³';
    return {
      title: 'ΟΓΚΟΣ ΖΑΡΙΟΥ',
      prompt: `Ένα ζάρι σε σχήμα κύβου έχει ακμή 2 cm. Πόσο είναι το μέγεθος του όγκου του σε cm³;`,
      options: ensureFourUniqueOptions(correct, () => ['4 cm³', '6 cm³', '12 cm³', '24 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακμή (α)', value: '2 cm' },
        { label: 'Πράξη', value: '2 · 2 · 2 ＝ 8 cm³' }
      ],
      explanation: `V ＝ 2 · 2 · 2 ＝ 8 cm³.`
    };
  },
  // 5. Κύβος με ακμή 10 cm
  () => {
    const a = 10;
    const vol = 1000;
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΚΥΒΟΣ 10 CM',
      prompt: `Ποιος είναι ο όγκος ενός κύβου με ακμή 10 cm;`,
      options: ensureFourUniqueOptions(correct, () => ['100 cm³', '300 cm³', '600 cm³', '10.000 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακμή (α)', value: '10 cm' },
        { label: 'Πράξη', value: '10 · 10 · 10 ＝ 1.000 cm³' }
      ],
      explanation: `10 · 10 · 10 ＝ 1.000 cm³ (ή 1 dm³).`
    };
  },
  // 6. Κύβος με ακμή 6 cm
  () => {
    const a = 6;
    const vol = 216;
    const correct = '216 cm³';
    return {
      title: 'ΟΓΚΟΣ ΚΥΒΙΚΟΥ ΚΟΥΤΙΟΥ',
      prompt: `Ένα κουτί έχει σχήμα κύβου με ακμή 6 cm. Πόσο είναι το μέγεθος του όγκου του σε cm³;`,
      options: ensureFourUniqueOptions(correct, () => ['36 cm³', '18 cm³', '72 cm³', '144 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Ακμή', value: '6 cm' },
        { label: 'Πράξη', value: '6 · 6 · 6 ＝ 216 cm³' }
      ],
      explanation: `V ＝ 6 · 6 · 6 ＝ 216 cm³.`
    };
  }
];

// POOL ΓΙΑ Q10: Όγκος Ορθογωνίου Παραλληλεπιπέδου (V ＝ α · β · γ)
const PROBLEM_POOL_Q10 = [
  // 1. Κουτί συσκευασίας
  () => {
    const l = randInt(10, 20);
    const w = randInt(5, 10);
    const h = randInt(4, 8);
    const vol = l * w * h;
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΟΓΚΟΣ ΚΟΥΤΙΟΥ ΣΥΣΚΕΥΑΣΙΑΣ',
      prompt: `Ένα κουτί συσκευασίας έχει μήκος ${l} cm, πλάτος ${w} cm και ύψος ${h} cm. Πόσα cm³ είναι ο όγκος του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(l * w)} cm³`,
        `${formatNum(vol + 40)} cm³`,
        `${formatNum(vol - 30 > 0 ? vol - 30 : vol + 60)} cm³`,
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
      explanation: `Πολλαπλασιάζουμε τις 3 διαστάσεις: V ＝ α · β · γ ＝ ${l} · ${w} · ${h} ＝ ${formatNum(vol)} cm³.`
    };
  },
  // 2. Ενυδρείο σε dm³
  () => {
    const l = 6; // dm
    const w = 4; // dm
    const h = 5; // dm
    const vol = l * w * h; // 120 dm³
    const correct = `${vol} dm³`;
    return {
      title: 'ΟΓΚΟΣ ΕΝΥΔΡΕΙΟΥ ΣΕ DM³',
      prompt: `Ένα ενυδρείο έχει μήκος 6 dm, πλάτος 4 dm και ύψος 5 dm. Ποιος είναι ο εσωτερικός του όγκος σε dm³;`,
      options: ensureFourUniqueOptions(correct, () => ['24 dm³', '60 dm³', '240 dm³', '15 dm³']),
      correctAnswer: correct,
      unit: 'dm³',
      tableData: [
        { label: 'Διαστάσεις σε dm', value: '6 dm, 4 dm, 5 dm' },
        { label: 'Πράξη', value: '6 · 4 · 5 ＝ 120 dm³' }
      ],
      explanation: `V ＝ 6 · 4 · 5 ＝ 120 dm³.`
    };
  },
  // 3. Δωμάτιο σε m³
  () => {
    const l = 5;
    const w = 4;
    const h = 3;
    const vol = l * w * h; // 60 m³
    const correct = '60 m³';
    return {
      title: 'ΟΓΚΟΣ ΑΕΡΑ ΔΩΜΑΤΙΟΥ',
      prompt: `Ένα δωμάτιο έχει μήκος 5 m, πλάτος 4 m και ύψος 3 m. Πόσα κυβικά μέτρα (m³) αέρα περιέχει;`,
      options: ensureFourUniqueOptions(correct, () => ['20 m³', '12 m³', '120 m³', '94 m²']),
      correctAnswer: correct,
      unit: 'm³',
      tableData: [
        { label: 'Διαστάσεις δωματίου', value: '5 m, 4 m, 3 m' },
        { label: 'Υπολογισμός', value: '5 · 4 · 3 ＝ 60 m³' }
      ],
      explanation: `V ＝ 5 · 4 · 3 ＝ 60 m³.`
    };
  },
  // 4. Κουτί παπουτσιών
  () => {
    const l = 30;
    const w = 15;
    const h = 10;
    const vol = l * w * h; // 4500 cm³
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΚΟΥΤΙ ΠΑΠΟΥΤΣΙΩΝ',
      prompt: `Ένα κουτί παπουτσιών έχει διαστάσεις 30 cm, 15 cm και 10 cm. Πόσο είναι το μέγεθος του όγκου του;`,
      options: ensureFourUniqueOptions(correct, () => ['450 cm³', '9.000 cm³', '1.800 cm²', '55 cm³']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Διαστάσεις', value: '30 cm, 15 cm, 10 cm' },
        { label: 'Πράξη', value: '30 · 15 · 10 ＝ 4.500 cm³' }
      ],
      explanation: `30 · 15 · 10 ＝ 4.500 cm³.`
    };
  },
  // 5. Τούβλο
  () => {
    const l = 25;
    const w = 12;
    const h = 6;
    const vol = l * w * h; // 1800 cm³
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΟΓΚΟΣ ΤΟΥΒΛΟΥ',
      prompt: `Ένα τούβλο έχει μήκος 25 cm, πλάτος 12 cm και ύψος 6 cm. Πόσο είναι το μέγεθος του όγκου του σε cm³;`,
      options: ensureFourUniqueOptions(correct, () => ['300 cm³', '3.600 cm³', '900 cm³', '1.044 cm²']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Διαστάσεις', value: '25 cm, 12 cm, 6 cm' },
        { label: 'Πράξη', value: '25 · 12 · 6 ＝ 1.800 cm³' }
      ],
      explanation: `25 · 12 · 6 ＝ 1.800 cm³.`
    };
  },
  // 6. Κιβώτιο αποθήκευσης
  () => {
    const l = 40;
    const w = 25;
    const h = 20;
    const vol = l * w * h; // 20.000 cm³
    const correct = `${formatNum(vol)} cm³`;
    return {
      title: 'ΚΙΒΩΤΙΟ ΑΠΟΘΗΚΕΥΣΗΣ',
      prompt: `Ένα κιβώτιο αποθήκευσης έχει μήκος 40 cm, πλάτος 25 cm και ύψος 20 cm. Ποιος είναι ο όγκος του;`,
      options: ensureFourUniqueOptions(correct, () => ['1.000 cm³', '10.000 cm³', '40.000 cm³', '4.600 cm²']),
      correctAnswer: correct,
      unit: 'cm³',
      tableData: [
        { label: 'Διαστάσεις', value: '40 cm, 25 cm, 20 cm' },
        { label: 'Πράξη', value: '40 · 25 · 20 ＝ 20.000 cm³' }
      ],
      explanation: `40 · 25 · 20 ＝ 20.000 cm³.`
    };
  }
];

// POOL ΓΙΑ Q11: Αντίστροφο Πρόβλημα Όγκου (Εύρεση Ακμής, Ύψους ή Βάσης)
const PROBLEM_POOL_Q11 = [
  // 1. Εύρεση ακμής κύβου από τον όγκο
  () => {
    const a = 4;
    const vol = a * a * a; // 64 cm³
    const correct = `${a} cm`;
    return {
      title: 'ΕΥΡΕΣΗ ΑΚΜΗΣ ΚΥΒΟΥ ΑΠΟ ΤΟΝ ΟΓΚΟ',
      prompt: `Ένα κουτί σε σχήμα κύβου έχει όγκο ${vol} cm³. Πόσο είναι το μήκος της ακμής του κύβου;`,
      options: ensureFourUniqueOptions(correct, () => [
        '8 cm',
        '16 cm',
        '6 cm',
        '5 cm'
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Όγκος κύβου (V)', value: '64 cm³' },
        { label: 'Σχέση', value: 'α · α · α ＝ 64' },
        { label: 'Ακμή (α)', value: '4 cm (επειδή 4 · 4 · 4 ＝ 64)' }
      ],
      explanation: `Ψάχνουμε ποιος αριθμός πολλαπλασιασμένος με τον εαυτό του 3 φορές δίνει 64: 4 · 4 · 4 ＝ 64, άρα η ακμή είναι 4 cm.`
    };
  },
  // 2. Εύρεση ύψους ορθογωνίου παραλληλεπιπέδου από τον όγκο
  () => {
    const l = randInt(6, 12);
    const w = randInt(4, 8);
    const h = randInt(3, 6);
    const baseArea = l * w;
    const vol = baseArea * h;
    const correct = `${h} cm`;
    return {
      title: 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΑΠΟ ΤΟΝ ΟΓΚΟ',
      prompt: `Ένα ορθογώνιο παραλληλεπίπεδο έχει όγκο ${vol} cm². Η βάση του έχει μήκος ${l} cm και πλάτος ${w} cm. Πόσο είναι το ύψος του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${h + 2} cm`,
        `${h - 1 > 0 ? h - 1 : h + 3} cm`,
        `${Math.round(vol / l)} cm`,
        `${h * 2} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Συνολικός όγκος (V)', value: `${vol} cm³` },
        { label: 'Εμβαδόν βάσης (α · β)', value: `${l} · ${w} ＝ ${baseArea} cm²` },
        { label: 'Τύπος ύψους', value: 'γ ＝ V : (α · β)' },
        { label: 'Πράξη', value: `${vol} : ${baseArea} ＝ ${h} cm` }
      ],
      explanation: `Υπολογίζουμε πρώτα το εμβαδόν της βάσης: ${l} · ${w} ＝ ${baseArea} cm². Έπειτα διαιρούμε τον όγκο με το εμβαδόν της βάσης: ${vol} : ${baseArea} ＝ ${h} cm.`
    };
  },
  // 3. Εύρεση ακμής κύβου με όγκο 125 cm³
  () => {
    const a = 5;
    const correct = '5 cm';
    return {
      title: 'ΑΚΜΗ ΚΥΒΟΥ ΜΕ ΟΓΚΟ 125 CM³',
      prompt: `Ο όγκος ενός κύβου είναι 125 cm³. Πόσα εκατοστόμετρα (cm) είναι η ακμή του;`,
      options: ensureFourUniqueOptions(correct, () => ['25 cm', '15 cm', '6 cm', '4 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Όγκος (V)', value: '125 cm³' },
        { label: 'Ακμή (α)', value: '5 cm (επειδή 5 · 5 · 5 ＝ 125)' }
      ],
      explanation: `Επειδή 5 · 5 · 5 ＝ 125, η ακμή του κύβου είναι 5 cm.`
    };
  },
  // 4. Εύρεση βάθους πισίνας
  () => {
    const l = 10;
    const w = 5;
    const vol = 100; // m³
    const h = vol / (l * w); // 2 m
    const correct = '2 m';
    return {
      title: 'ΒΑΘΟΣ ΠΙΣΙΝΑΣ',
      prompt: `Μια πισίνα έχει μήκος 10 m, πλάτος 5 m και χωρητικότητα 100 m³. Πόσο είναι το βάθος (ύψος) της πισίνας;`,
      options: ensureFourUniqueOptions(correct, () => ['1,5 m', '2,5 m', '3 m', '4 m']),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Όγκος', value: '100 m³' },
        { label: 'Εμβαδόν βάσης', value: '10 · 5 ＝ 50 m²' },
        { label: 'Βάθος (ύψος)', value: '100 : 50 ＝ 2 m' }
      ],
      explanation: `Εμβαδόν βάσης: 10 · 5 ＝ 50 m². Ύψος: 100 : 50 ＝ 2 m.`
    };
  },
  // 5. Εύρεση εμβαδού βάσης
  () => {
    const vol = 240;
    const h = 8;
    const baseArea = vol / h; // 30
    const correct = '30 cm²';
    return {
      title: 'ΕΜΒΑΔΟΝ ΒΑΣΗΣ ΑΠΟ ΤΟΝ ΟΓΚΟ',
      prompt: `Ένα ορθογώνιο παραλληλεπίπεδο έχει όγκο 240 cm³ και ύψος 8 cm. Πόσο είναι το εμβαδόν της βάσης του;`,
      options: ensureFourUniqueOptions(correct, () => ['20 cm²', '40 cm²', '60 cm²', '15 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Όγκος (V)', value: '240 cm³' },
        { label: 'Ύψος (γ)', value: '8 cm' },
        { label: 'Εμβαδόν βάσης (V : γ)', value: '240 : 8 ＝ 30 cm²' }
      ],
      explanation: `Εμβαδόν Βάσης ＝ Όγκος : Ύψος ＝ 240 : 8 ＝ 30 cm².`
    };
  },
  // 6. Εύρεση ακμής κύβου με όγκο 27 cm³
  () => {
    const a = 3;
    const correct = '3 cm';
    return {
      title: 'ΑΚΜΗ ΚΥΒΟΥ ΜΕ ΟΓΚΟ 27 CM³',
      prompt: `Ένα ζάρι έχει όγκο 27 cm³. Πόσο είναι το μήκος της ακμής του;`,
      options: ensureFourUniqueOptions(correct, () => ['9 cm', '3 cm (2)', '2 cm', '4 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Όγκος', value: '27 cm³' },
        { label: 'Ακμή', value: '3 cm (επειδή 3 · 3 · 3 ＝ 27)' }
      ],
      explanation: `3 · 3 · 3 ＝ 27, επομένως η ακμή είναι 3 cm.`
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα, Δοχεία με Νερό & Μετατροπές σε Λίτρα
const PROBLEM_POOL_Q12 = [
  // 1. Γέμισμα δεξαμενής σε λίτρα
  () => {
    const l = 2; // m
    const w = 1.2; // m
    const h = 1.5; // m
    const m3 = l * w * h; // 3.6 m³
    const liters = m3 * 1000; // 3600 L
    const correct = `${formatNum(liters)} L`;
    return {
      title: 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΔΕΞΑΜΕΝΗΣ ΣΕ ΛΙΤΡΑ',
      prompt: `Μια δεξαμενή πετρελαίου έχει μήκος 2 m, πλάτος 1,2 m και ύψος 1,5 m. Πόσα λίτρα (L) πετρελαίου χωράει;`,
      options: ensureFourUniqueOptions(correct, () => [
        '360 L',
        '36.000 L',
        '3,6 L',
        '1.800 L'
      ]),
      correctAnswer: correct,
      unit: 'L',
      tableData: [
        { label: 'Όγκος σε m³', value: '2 · 1,2 · 1,5 ＝ 3,6 m³' },
        { label: 'Σχέση m³ με λίτρα', value: '1 m³ ＝ 1.000 dm³ ＝ 1.000 L' },
        { label: 'Χωρητικότητα σε λίτρα', value: '3,6 · 1.000 ＝ 3.600 L' }
      ],
      explanation: `V ＝ 2 · 1,2 · 1,5 ＝ 3,6 m³. Επειδή 1 m³ ＝ 1.000 L, η δεξαμενή χωράει 3,6 · 1.000 ＝ 3.600 L.`
    };
  },
  // 2. Ενυδρείο σε λίτρα με μετατροπή cm σε dm
  () => {
    const l = 80; // 8 dm
    const w = 40; // 4 dm
    const h = 50; // 5 dm
    const liters = 8 * 4 * 5; // 160 L
    const correct = `${liters} L`;
    return {
      title: 'ΝΕΡΟ ΣΕ ΕΝΥΔΡΕΙΟ',
      prompt: `Ένα ενυδρείο έχει μήκος 80 cm, πλάτος 40 cm και ύψος 50 cm. Πόσα λίτρα (L) νερού χρειάζονται για να γεμίσει πλήρως;`,
      options: ensureFourUniqueOptions(correct, () => ['16 L', '1.600 L', '160.000 L', '320 L']),
      correctAnswer: correct,
      unit: 'L',
      tableData: [
        { label: 'Διαστάσεις σε dm', value: '8 dm, 4 dm, 5 dm' },
        { label: 'Όγκος σε dm³', value: '8 · 4 · 5 ＝ 160 dm³' },
        { label: 'Λίτρα (1 dm³ ＝ 1 L)', value: '160 L' }
      ],
      explanation: `Μετατρέπουμε σε dm: 8 dm · 4 dm · 5 dm ＝ 160 dm³. Επειδή 1 dm³ ＝ 1 L, το ενυδρείο χωράει 160 L.`
    };
  },
  // 3. Πόσα μπουκάλια του 1 L γεμίζει ένας κύβος ακμής 20 cm
  () => {
    const a = 20; // 2 dm => 8 dm³ = 8 L
    const correct = '8 μπουκάλια';
    return {
      title: 'ΕΜΦΙΑΛΩΣΗ ΑΠΟ ΚΥΒΙΚΟ ΔΟΧΕΙΟ',
      prompt: `Ένα κυβικό δοχείο έχει ακμή 20 cm και είναι γεμάτο νερό. Πόσα μπουκάλια του 1 L μπορούν να γεμίσουν από αυτό;`,
      options: ensureFourUniqueOptions(correct, () => ['2 μπουκάλια', '4 μπουκάλια', '16 μπουκάλια', '80 μπουκάλια']),
      correctAnswer: correct,
      unit: 'μπουκάλια',
      tableData: [
        { label: 'Ακμή σε dm', value: '20 cm ＝ 2 dm' },
        { label: 'Όγκος δοχείου', value: '2 · 2 · 2 ＝ 8 dm³ ＝ 8 L' },
        { label: 'Μπουκάλια του 1 L', value: '8 : 1 ＝ 8 μπουκάλια' }
      ],
      explanation: `20 cm ＝ 2 dm. V ＝ 2 · 2 · 2 ＝ 8 dm³ ＝ 8 L. Άρα γεμίζουν 8 μπουκάλια του 1 λίτρου.`
    };
  },
  // 4. Στάθμη νερού στο μισό
  () => {
    const l = 50; // cm = 5 dm
    const w = 20; // cm = 2 dm
    const h = 40; // cm = 4 dm
    const fullLiters = 5 * 2 * 4; // 40 L
    const halfLiters = fullLiters / 2; // 20 L
    const correct = '20 L';
    return {
      title: 'ΔΟΧΕΙΟ ΓΕΜΑΤΟ ΜΕΧΡΙ ΤΗ ΜΕΣΗ',
      prompt: `Ένα δοχείο έχει διαστάσεις 50 cm, 20 cm και ύψος 40 cm. Αν είναι γεμάτο με νερό μέχρι τη μέση του ύψους του, πόσα λίτρα νερού περιέχει;`,
      options: ensureFourUniqueOptions(correct, () => ['40 L', '10 L', '30 L', '200 L']),
      correctAnswer: correct,
      unit: 'L',
      tableData: [
        { label: 'Συνολικός όγκος', value: '5 dm · 2 dm · 4 dm ＝ 40 dm³ ＝ 40 L' },
        { label: 'Μισό δοχείο', value: '40 : 2 ＝ 20 L' }
      ],
      explanation: `Ο συνολικός όγκος είναι 40 L. Αφού είναι γεμάτο μέχρι τη μέση, περιέχει 40 : 2 ＝ 20 L.`
    };
  },
  // 5. Κατανάλωση νερού από δεξαμενή
  () => {
    const totalM3 = 6;
    const totalL = totalM3 * 1000; // 6000 L
    const usedL = 2500;
    const remainingL = totalL - usedL; // 3500 L
    const correct = `${formatNum(remainingL)} L`;
    return {
      title: 'ΚΑΤΑΝΑΛΩΣΗ ΝΕΡΟΥ ΔΕΞΑΜΕΝΗΣ',
      prompt: `Μια δεξαμενή περιέχει 6 m³ νερού. Αν καταναλωθούν 2.500 L, πόσα λίτρα (L) νερού απομένουν στη δεξαμενή;`,
      options: ensureFourUniqueOptions(correct, () => ['3.000 L', '4.000 L', '1.500 L', '350 L']),
      correctAnswer: correct,
      unit: 'L',
      tableData: [
        { label: 'Αρχικό νερό σε λίτρα', value: '6 m³ ＝ 6.000 L' },
        { label: 'Νερό που καταναλώθηκε', value: '2.500 L' },
        { label: 'Υπόλοιπο', value: '6.000 － 2.500 ＝ 3.500 L' }
      ],
      explanation: `6 m³ ＝ 6.000 L. Απομένουν: 6.000 － 2.500 ＝ 3.500 L.`
    };
  },
  // 6. Κυβάκια μέσα σε κουτί
  () => {
    const l = 6;
    const w = 4;
    const h = 3;
    const totalCubes = l * w * h; // 72
    const correct = `${totalCubes} κυβάκια`;
    return {
      title: 'ΤΟΠΟΘΕΤΗΣΗ ΚΥΒΩΝ ΣΕ ΚΟΥΤΙ',
      prompt: `Ένα κουτί έχει εσωτερικές διαστάσεις 6 cm, 4 cm και 3 cm. Πόσα κυβάκια ακμής 1 cm χωράνε ακριβώς μέσα σε αυτό;`,
      options: ensureFourUniqueOptions(correct, () => ['36 κυβάκια', '24 κυβάκια', '144 κυβάκια', '48 κυβάκια']),
      correctAnswer: correct,
      unit: 'κυβάκια',
      tableData: [
        { label: 'Όγκος κουτιού', value: '6 · 4 · 3 ＝ 72 cm³' },
        { label: 'Όγκος 1 κυβιδίου', value: '1 · 1 · 1 ＝ 1 cm³' },
        { label: 'Πλήθος κυβιδίων', value: '72 : 1 ＝ 72 κυβάκια' }
      ],
      explanation: `Ο όγκος του κουτιού είναι 72 cm³, επομένως χωράει ακριβώς 72 κυβάκια του 1 cm³.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Τύπος όγκου κύβου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΤΥΠΟΣ ΟΓΚΟΥ ΚΥΒΟΥ',
    prompt: isQ1True
      ? 'Ο όγκος ενός κύβου με ακμή α υπολογίζεται με τον τύπο V ＝ α · α · α ＝ α³.'
      : 'Ο όγκος ενός κύβου με ακμή α υπολογίζεται πολλαπλασιάζοντας την ακμή επί 3: V ＝ 3 · α.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Σωστός τύπος κύβου', value: 'V ＝ α · α · α ＝ α³ (3η δύναμη)' },
      { label: 'Σύνηθες λάθος', value: '3 · α (αυτό δεν είναι όγκος)' }
    ],
    explanation: isQ1True
      ? 'Ο όγκος του κύβου ισούται με την ακμή υψωμένη στην 3η δύναμη (V ＝ α³).'
      : 'Ο τύπος 3 · α είναι λάθος. Στον όγκο πολλαπλασιάζουμε την ακμή με τον εαυτό της 3 φορές: V ＝ α · α · α ＝ α³.'
  });

  // Q2: Τύπος όγκου ορθογωνίου παραλληλεπιπέδου (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΤΥΠΟΣ ΟΓΚΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ',
    prompt: 'Πώς υπολογίζουμε τον όγκο (V) ενός ορθογωνίου παραλληλεπιπέδου με διαστάσεις α, β και γ;',
    options: ensureFourUniqueOptions('V ＝ α · β · γ (Μήκος · Πλάτος · Ύψος)', () => [
      'V ＝ α ＋ β ＋ γ',
      'V ＝ 2 · (α · β ＋ β · γ ＋ α · γ)',
      'V ＝ (α · β) : γ'
    ]),
    correctAnswer: 'V ＝ α · β · γ (Μήκος · Πλάτος · Ύψος)',
    tableData: [
      { label: '3 διαστάσεις', value: 'Μήκος (α), Πλάτος (β), Ύψος (γ)' },
      { label: 'Τύπος όγκου', value: 'V ＝ α · β · γ' }
    ],
    explanation: 'Ο όγκος του ορθογωνίου παραλληλεπιπέδου ισούται με το γινόμενο των τριών διαστάσεών του: V ＝ α · β · γ.'
  });

  // Q3: Σχέση όγκου με εμβαδόν βάσης (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΟΓΚΟΣ ΚΑΙ ΕΜΒΑΔΟΝ ΒΑΣΗΣ',
    prompt: 'Ποια σχέση συνδέει τον όγκο (V) ενός ορθογωνίου παραλληλεπιπέδου με το εμβαδόν της βάσης του (Εβ);',
    options: ensureFourUniqueOptions('V ＝ Εμβαδόν Βάσης · Ύψος (V ＝ Εβ · γ)', () => [
      'V ＝ Εμβαδόν Βάσης : Ύψος',
      'V ＝ (Εμβαδόν Βάσης · Ύψος) : 2',
      'V ＝ Εμβαδόν Βάσης ＋ Ύψος'
    ]),
    correctAnswer: 'V ＝ Εμβαδόν Βάσης · Ύψος (V ＝ Εβ · γ)',
    tableData: [
      { label: 'Εμβαδόν βάσης', value: 'Εβ ＝ α · β' },
      { label: 'Όγκος', value: 'V ＝ (α · β) · γ ＝ Εβ · γ' }
    ],
    explanation: 'Επειδή το εμβαδόν της βάσης είναι α · β, ο όγκος γράφεται ως V ＝ Εμβαδόν Βάσης · Ύψος.'
  });

  // Q4: Οπτική αναγνώριση κυβιδίων (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΚΑΤΑΜΕΤΡΗΣΗ ΚΥΒΙΚΩΝ ΕΚΑΤΟΣΤΩΝ',
    prompt: 'Παρατηρήστε το παρακάτω στερεό από κυβάκια 1 cm³. Ποιος είναι ο συνολικός όγκος του;',
    svg: (
      <svg viewBox="0 0 160 110" className="w-40 h-28 mx-auto my-2 select-none drop-shadow-sm">
        {/* Στερεό 3 x 2 x 2 = 12 κυβάκια */}
        <polygon points="50,45 80,30 130,55 100,70" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
        <polygon points="50,45 100,70 100,95 50,70" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
        <polygon points="100,70 130,55 130,80 100,95" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
        <text x="75" y="85" fill="#0f172a" fontSize="10" fontWeight="bold">3 × 2 × 2</text>
      </svg>
    ),
    options: ensureFourUniqueOptions('12 cm³ (3 · 2 · 2)', () => [
      '7 cm³ (3 ＋ 2 ＋ 2)',
      '18 cm³',
      '24 cm³'
    ]),
    correctAnswer: '12 cm³ (3 · 2 · 2)',
    tableData: [
      { label: 'Διαστάσεις', value: 'Μήκος 3 cm, Πλάτος 2 cm, Ύψος 2 cm' },
      { label: 'Υπολογισμός', value: '3 · 2 · 2 ＝ 12 cm³' }
    ],
    explanation: 'Το στερεό αποτελείται από 3 · 2 ＝ 6 κυβάκια στη βάση επί 2 στρώσεις ύψους: 6 · 2 ＝ 12 cm³.'
  });

  // Q5: Υπολογισμός όγκου κύβου με ακμή 3 cm (Input αριθμού)
  const a5 = 3;
  const vol5 = a5 * a5 * a5; // 27
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΓΚΟΥ ΚΥΒΟΥ (Α = 3 CM)',
    prompt: `Ένας κύβος έχει ακμή 3 cm. Πόσα cm³ είναι ο όγκος του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(vol5),
    tableData: [
      { label: 'Ακμή (α)', value: '3 cm' },
      { label: 'Πράξη', value: '3 · 3 · 3 ＝ 27 cm³' }
    ],
    explanation: `V ＝ 3 · 3 · 3 ＝ 27 cm³.`
  });

  // Q6: Υπολογισμός όγκου παραλληλεπιπέδου (Input αριθμού)
  const l6 = 5;
  const w6 = 4;
  const h6 = 3;
  const vol6 = l6 * w6 * h6; // 60
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΓΚΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ',
    prompt: `Ένα κουτί έχει μήκος 5 cm, πλάτος 4 cm και ύψος 3 cm. Πόσα cm³ είναι ο όγκος του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(vol6),
    tableData: [
      { label: 'Διαστάσεις', value: '5 cm, 4 cm, 3 cm' },
      { label: 'Πράξη', value: '5 · 4 · 3 ＝ 60 cm³' }
    ],
    explanation: `V ＝ 5 · 4 · 3 ＝ 60 cm³.`
  });

  // Q7: Πόσα λίτρα είναι 1 m³ (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΣΧΕΣΗ ΚΥΒΙΚΟΥ ΜΕΤΡΟΥ ΚΑΙ ΛΙΤΡΩΝ',
    prompt: 'Πόσα λίτρα (L) νερού περιέχει ακριβώς 1 κυβικό μέτρο (1 m³);',
    options: ensureFourUniqueOptions('1.000 Λίτρα', () => [
      '100 Λίτρα',
      '10 Λίτρα',
      '10.000 Λίτρα'
    ]),
    correctAnswer: '1.000 Λίτρα',
    tableData: [
      { label: '1 m³ σε dm³', value: '1.000 dm³' },
      { label: 'Ισοδυναμία', value: '1 dm³ ＝ 1 L' },
      { label: '1 m³ σε λίτρα', value: '1.000 L' }
    ],
    explanation: '1 m³ ＝ 1.000 dm³. Επειδή 1 dm³ ＝ 1 L, ένα κυβικό μέτρο ισούται με 1.000 λίτρα.'
  });

  // Q8: Εύρεση ύψους από τον όγκο (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΑΠΟ ΤΟΝ ΟΓΚΟ',
    prompt: 'Αν γνωρίζουμε τον όγκο (V) ενός ορθογωνίου παραλληλεπιπέδου και το εμβαδόν της βάσης του (Εβ), πώς βρίσκουμε το ύψος (γ);',
    options: ensureFourUniqueOptions('γ ＝ Όγκος : Εμβαδόν Βάσης', () => [
      'γ ＝ Όγκος · Εμβαδόν Βάσης',
      'γ ＝ Όγκος ＋ Εμβαδόν Βάσης',
      'γ ＝ (Όγκος : Εμβαδόν Βάσης) : 2'
    ]),
    correctAnswer: 'γ ＝ Όγκος : Εμβαδόν Βάσης',
    tableData: [
      { label: 'Τύπος', value: 'V ＝ Εβ · γ, άρα γ ＝ V : Εβ' }
    ],
    explanation: 'Διαιρούμε τον όγκο με το εμβαδόν της βάσης για να βρούμε το ύψος: γ ＝ V : Εβ.'
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

export default function OgkosCubeAskiseisPage() {
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
      title="Ασκήσεις: Όγκος Κύβου &amp; Παραλληλεπιπέδου - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στον υπολογισμό όγκου κύβου (V ＝ α³) και ορθογωνίου παραλληλεπιπέδου (V ＝ α · β · γ), χωρητικότητα και λίτρα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/81-ogkos-cube"
      backText="Θεωρία Κεφ. 81"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/81-ogkos-cube"
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
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 81 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Ογκος Κυβου και Παραλληλεπιπεδου')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στον υπολογισμό όγκου με τους τύπους V ＝ α³ και V ＝ α · β · γ, στη δόμηση με κυβάκια και στην εύρεση άγνωστων διαστάσεων μέσα από 12 δυναμικές ερωτήσεις.
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

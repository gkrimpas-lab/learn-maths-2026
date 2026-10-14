// pages/st-dimotikou/78-akmes-korifes-ask.js
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

// POOL ΓΙΑ Q9: Συνολικό Μήκος Ακμών Κύβου (12 · α)
const PROBLEM_POOL_Q9 = [
  // 1. Συρμάτινος σκελετός κύβου
  () => {
    const a = randInt(4, 15);
    const total = 12 * a;
    const correct = `${total} cm`;
    return {
      title: 'ΣΥΡΜΑΤΙΝΟΣ ΣΚΕΛΕΤΟΣ ΚΥΒΟΥ',
      prompt: `Ένας μαθητής θέλει να φτιάξει τον σκελετό ενός κύβου από σύρμα με μήκος ακμής ${a} cm. Πόσο σύρμα σε cm θα χρειαστεί για να κατασκευαστούν και οι 12 ακμές του κύβου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${6 * a} cm`,
        `${8 * a} cm`,
        `${total + 12} cm`,
        `${total - 12 > 0 ? total - 12 : total + 24} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Μήκος 1 ακμής (α)', value: `${a} cm` },
        { label: 'Πλήθος ακμών κύβου', value: '12 ίσες ακμές' },
        { label: 'Συνολικό μήκος σύρματος', value: `12 · ${a} ＝ ${total} cm` }
      ],
      explanation: `Ο κύβος έχει 12 απολύτως ίσες ακμές. Επομένως, το συνολικό μήκος του σύρματος είναι: 12 · ${a} ＝ ${total} cm.`
    };
  },
  // 2. Ξύλινο πλαίσιο κύβου
  () => {
    const a = randInt(16, 25);
    const total = 12 * a;
    const correct = `${formatNum(total)} cm`;
    return {
      title: 'ΞΥΛΙΝΟ ΠΛΑΙΣΙΟ ΚΥΒΟΥ',
      prompt: `Για να κατασκευαστεί ένα ξύλινο διακοσμητικό πλαίσιο κύβου με ακμή ${a} cm, κόβονται 12 ίσα πηχάκια. Ποιο είναι το συνολικό μήκος που έχουν όλα τα πηχάκια μαζί;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(6 * a)} cm`,
        `${formatNum(total + 24)} cm`,
        `${formatNum(total - 24 > 0 ? total - 24 : total + 48)} cm`,
        `${formatNum(total * 2)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Μήκος πηχακίου', value: `${a} cm` },
        { label: 'Πλήθος ακμών', value: '12 πηχάκια' },
        { label: 'Πράξη', value: `12 · ${a} ＝ ${formatNum(total)} cm` }
      ],
      explanation: `12 · ${a} ＝ ${formatNum(total)} cm.`
    };
  },
  // 3. Σκελετός κύβου με καλαμάκια
  () => {
    const a = 10;
    const total = 120;
    const correct = '120 cm';
    return {
      title: 'ΣΚΕΛΕΤΟΣ ΜΕ ΚΑΛΑΜΑΚΙΑ',
      prompt: `Στο μάθημα των εικαστικών, τα παιδιά κατασκευάζουν τον σκελετό ενός κύβου χρησιμοποιώντας 12 καλαμάκια των 10 cm το καθένα. Πόσα εκατοστόμετρα (cm) είναι το συνολικό μήκος όλων των ακμών του κύβου;`,
      options: ensureFourUniqueOptions(correct, () => ['60 cm', '80 cm', '100 cm', '140 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Μήκος 1 ακμής', value: '10 cm' },
        { label: 'Πλήθος ακμών', value: '12 ακμές' },
        { label: 'Πράξη', value: '12 · 10 ＝ 120 cm' }
      ],
      explanation: `12 · 10 ＝ 120 cm.`
    };
  },
  // 4. Μεγάλος κύβος σε μέτρα
  () => {
    const a = 2; // m
    const total = 24;
    const correct = '24 m';
    return {
      title: 'ΜΕΤΑΛΛΙΚΟ ΠΛΑΙΣΙΟ ΣΚΗΝΗΣ',
      prompt: `Το μεταλλικό πλαίσιο μιας σκηνής σε σχήμα κύβου έχει ακμή 2 m. Πόσα μέτρα (m) μεταλλικών σωλήνων χρειάστηκαν για να φτιαχτούν όλες οι ακμές του κύβου;`,
      options: ensureFourUniqueOptions(correct, () => ['12 m', '16 m', '20 m', '36 m']),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Ακμή', value: '2 m' },
        { label: '12 ακμές', value: '12 · 2 ＝ 24 m' }
      ],
      explanation: `12 · 2 ＝ 24 m.`
    };
  },
  // 5. Ζάρι με ακμή 8 cm
  () => {
    const a = 8;
    const total = 96;
    const correct = '96 cm';
    return {
      title: 'ΑΚΜΕΣ ΖΑΡΙΟΥ',
      prompt: `Ένα μεγάλο ζάρι σε σχήμα κύβου έχει ακμή 8 cm. Πόσο είναι το άθροισμα των μηκών και των 12 ακμών του;`,
      options: ensureFourUniqueOptions(correct, () => ['64 cm', '48 cm', '108 cm', '72 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Ακμή', value: '8 cm' },
        { label: 'Πράξη', value: '12 · 8 ＝ 96 cm' }
      ],
      explanation: `12 · 8 ＝ 96 cm.`
    };
  },
  // 6. Μικρός κύβος με ακμή 3 cm
  () => {
    const a = 3;
    const total = 36;
    const correct = '36 cm';
    return {
      title: 'ΜΙΚΡΟΣ ΣΚΕΛΕΤΟΣ',
      prompt: `Πόσο σύρμα χρειάζεται για να κατασκευαστεί ο σκελετός ενός κύβου με ακμή 3 cm;`,
      options: ensureFourUniqueOptions(correct, () => ['18 cm', '24 cm', '30 cm', '48 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Ακμή', value: '3 cm' },
        { label: 'Πράξη', value: '12 · 3 ＝ 36 cm' }
      ],
      explanation: `12 · 3 ＝ 36 cm.`
    };
  }
];

// POOL ΓΙΑ Q10: Συνολικό Μήκος Ακμών Ορθογωνίου Παραλληλεπιπέδου [4 · (α ＋ β ＋ γ)]
const PROBLEM_POOL_Q10 = [
  // 1. Σκελετός κλουβιού
  () => {
    const l = randInt(12, 24);
    const w = randInt(8, 14);
    const h = randInt(6, 12);
    const sum = l + w + h;
    const total = 4 * sum;
    const correct = `${total} cm`;
    return {
      title: 'ΣΚΕΛΕΤΟΣ ΟΡΘΟΓΩΝΙΟΥ ΚΟΥΤΙΟΥ',
      prompt: `Ένα κουτί σε σχήμα ορθογωνίου παραλληλεπιπέδου έχει μήκος ${l} cm, πλάτος ${w} cm και ύψος ${h} cm. Πόσο σύρμα σε cm απαιτείται για να κατασκευαστούν και οι 12 ακμές του σκελετού του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${sum} cm`,
        `${2 * sum} cm`,
        `${total + 16} cm`,
        `${total - 16 > 0 ? total - 16 : total + 32} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: '4 μήκη (α)', value: `4 · ${l} ＝ ${4 * l} cm` },
        { label: '4 πλάτη (β)', value: `4 · ${w} ＝ ${4 * w} cm` },
        { label: '4 ύψη (γ)', value: `4 · ${h} ＝ ${4 * h} cm` },
        { label: 'Συνολικό μήκος (12 ακμές)', value: `4 · (${l} ＋ ${w} ＋ ${h}) ＝ 4 · ${sum} ＝ ${total} cm` }
      ],
      explanation: `Το ορθογώνιο παραλληλεπίπεδο έχει 4 ακμές μήκους, 4 ακμές πλάτους και 4 ακμές ύψους: 4 · (${l} ＋ ${w} ＋ ${h}) ＝ 4 · ${sum} ＝ ${total} cm.`
    };
  },
  // 2. Ξύλινο κλουβί
  () => {
    const l = 50;
    const w = 30;
    const h = 20;
    const sum = 100;
    const total = 400; // 400 cm = 4 m
    const correct = '400 cm (4 m)';
    return {
      title: 'ΞΥΛΙΝΟΣ ΣΚΕΛΕΤΟΣ ΚΛΟΥΒΙΟΥ',
      prompt: `Ένας ξυλουργός φτιάχνει τον σκελετό ενός κλουβιού με διαστάσεις 50 cm, 30 cm και 20 cm. Πόσα εκατοστόμετρα (cm) πηχακίου χρειάζονται συνολικά για τις 12 ακμές;`,
      options: ensureFourUniqueOptions(correct, () => ['100 cm (1 m)', '200 cm (2 m)', '300 cm (3 m)', '500 cm (5 m)']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Διαστάσεις', value: '50 cm, 30 cm, 20 cm' },
        { label: 'Άθροισμα 3 ακμών', value: '50 ＋ 30 ＋ 20 ＝ 100 cm' },
        { label: 'Συνολικό μήκος (12 ακμές)', value: '4 · 100 ＝ 400 cm (4 m)' }
      ],
      explanation: `4 · (50 ＋ 30 ＋ 20) ＝ 4 · 100 ＝ 400 cm (δηλαδή 4 μέτρα).`
    };
  },
  // 3. Σκελετός ενυδρείου
  () => {
    const l = 60;
    const w = 40;
    const h = 30;
    const sum = 130;
    const total = 4 * sum; // 520
    const correct = `${total} cm`;
    return {
      title: 'ΜΕΤΑΛΛΙΚΟ ΠΛΑΙΣΙΟ ΕΝΥΔΡΕΙΟΥ',
      prompt: `Το μεταλλικό πλαίσιο ενός ενυδρείου έχει μήκος 60 cm, πλάτος 40 cm και ύψος 30 cm. Πόσα cm γωνιακού σιδήρου χρειάστηκαν για να φτιαχτούν όλες οι ακμές του;`,
      options: ensureFourUniqueOptions(correct, () => ['260 cm', '130 cm', '480 cm', '600 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Διαστάσεις', value: '60 cm, 40 cm, 30 cm' },
        { label: 'Πράξη', value: '4 · (60 ＋ 40 ＋ 30) ＝ 4 · 130 ＝ 520 cm' }
      ],
      explanation: `4 · (60 ＋ 40 ＋ 30) ＝ 4 · 130 ＝ 520 cm.`
    };
  },
  // 4. Κουτί συσκευασίας
  () => {
    const l = 15;
    const w = 10;
    const h = 5;
    const total = 4 * (15 + 10 + 5); // 4 * 30 = 120
    const correct = '120 cm';
    return {
      title: 'ΑΚΜΕΣ ΚΟΥΤΙΟΥ ΣΥΣΚΕΥΑΣΙΑΣ',
      prompt: `Ένα κουτί συσκευασίας έχει μήκος 15 cm, πλάτος 10 cm και ύψος 5 cm. Ποιο είναι το συνολικό μήκος και των 12 ακμών του;`,
      options: ensureFourUniqueOptions(correct, () => ['30 cm', '60 cm', '90 cm', '150 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: '3 διαστάσεις', value: '15 cm, 10 cm, 5 cm (άθροισμα 30 cm)' },
        { label: 'Σύνολο ακμών', value: '4 · 30 ＝ 120 cm' }
      ],
      explanation: `4 · (15 ＋ 10 ＋ 5) ＝ 4 · 30 ＝ 120 cm.`
    };
  },
  // 5. Βιτρίνα καταστήματος
  () => {
    const l = 100;
    const w = 50;
    const h = 80;
    const sum = 230;
    const total = 4 * sum; // 920
    const correct = '920 cm (9,2 m)';
    return {
      title: 'ΣΚΕΛΕΤΟΣ ΒΙΤΡΙΝΑΣ',
      prompt: `Μια γυάλινη βιτρίνα στηρίζεται σε μεταλλικό σκελετό με διαστάσεις μήκος 100 cm, πλάτος 50 cm και ύψος 80 cm. Πόσα εκατοστόμετρα είναι το συνολικό μήκος του σκελετού;`,
      options: ensureFourUniqueOptions(correct, () => ['460 cm', '230 cm', '800 cm', '1.000 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Διαστάσεις', value: '100 cm, 50 cm, 80 cm' },
        { label: 'Πράξη', value: '4 · (100 ＋ 50 ＋ 80) ＝ 4 · 230 ＝ 920 cm' }
      ],
      explanation: `4 · (100 ＋ 50 ＋ 80) ＝ 4 · 230 ＝ 920 cm (9,2 m).`
    };
  },
  // 6. Κουτί παπουτσιών
  () => {
    const l = 30;
    const w = 20;
    const h = 10;
    const total = 4 * (30 + 20 + 10); // 4 * 60 = 240
    const correct = '240 cm';
    return {
      title: 'ΑΚΜΕΣ ΚΟΥΤΙΟΥ ΠΑΠΟΥΤΣΙΩΝ',
      prompt: `Ένα κουτί παπουτσιών έχει διαστάσεις 30 cm, 20 cm και 10 cm. Αν περάσουμε κολλητική ταινία κατά μήκος και των 12 ακμών του, πόση ταινία σε cm θα χρειαστεί κατ' ελάχιστο;`,
      options: ensureFourUniqueOptions(correct, () => ['60 cm', '120 cm', '180 cm', '300 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Διαστάσεις', value: '30 cm, 20 cm, 10 cm' },
        { label: 'Πράξη', value: '4 · (30 ＋ 20 ＋ 10) ＝ 4 · 60 ＝ 240 cm' }
      ],
      explanation: `4 · (30 ＋ 20 ＋ 10) ＝ 4 · 60 ＝ 240 cm.`
    };
  }
];

// POOL ΓΙΑ Q11: Αντίστροφο Πρόβλημα (Εύρεση Ακμής από το Συνολικό Μήκος)
const PROBLEM_POOL_Q11 = [
  // 1. Εύρεση ακμής κύβου από σύρμα
  () => {
    const a = randInt(5, 14);
    const total = 12 * a;
    const correct = `${a} cm`;
    return {
      title: 'ΕΥΡΕΣΗ ΑΚΜΗΣ ΚΥΒΟΥ',
      prompt: `Χρησιμοποιήσαμε ένα σύρμα συνολικού μήκους ${total} cm για να κατασκευάσουμε τον σκελετό ενός κύβου, χωρίς να περισσέψει τίποτα. Πόσο είναι το μήκος της ακμής του κύβου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${a + 2} cm`,
        `${a - 2 > 0 ? a - 2 : a + 4} cm`,
        `${Math.round(total / 6)} cm`,
        `${Math.round(total / 8)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Συνολικό μήκος σύρματος', value: `${total} cm` },
        { label: 'Πλήθος ακμών κύβου', value: '12 ίσες ακμές' },
        { label: 'Μήκος 1 ακμής', value: `${total} : 12 ＝ ${a} cm` }
      ],
      explanation: `Ο κύβος έχει 12 ίσες ακμές, άρα διαιρούμε το συνολικό μήκος με το 12: ${total} : 12 ＝ ${a} cm.`
    };
  },
  // 2. Εύρεση ύψους σε ορθογώνιο παραλληλεπίπεδο
  () => {
    const l = 12;
    const w = 8;
    const h = 5;
    const total = 4 * (l + w + h); // 4 * 25 = 100
    const correct = `${h} cm`;
    return {
      title: 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΣΚΕΛΕΤΟΥ',
      prompt: `Ο σκελετός ενός ορθογωνίου παραλληλεπιπέδου κατασκευάστηκε με 100 cm σύρμα. Αν το μήκος είναι 12 cm και το πλάτος είναι 8 cm, πόσο είναι το ύψος του;`,
      options: ensureFourUniqueOptions(correct, () => ['10 cm', '6 cm', '4 cm', '8 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Συνολικό σύρμα', value: '100 cm' },
        { label: 'Άθροισμα 3 ακμών (μήκος ＋ πλάτος ＋ ύψος)', value: '100 : 4 ＝ 25 cm' },
        { label: 'Άθροισμα μήκους και πλάτους', value: '12 ＋ 8 ＝ 20 cm' },
        { label: 'Ύψος', value: '25 － 20 ＝ 5 cm' }
      ],
      explanation: `Διαιρούμε με το 4 για να βρούμε το άθροισμα των τριών διαστάσεων: 100 : 4 ＝ 25 cm. Αφαιρούμε το μήκος και το πλάτος: 25 － 12 － 8 ＝ 5 cm.`
    };
  },
  // 3. Εύρεση ακμής κύβου από σύρμα 72 cm
  () => {
    const total = 72;
    const a = 6;
    const correct = '6 cm';
    return {
      title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΑΚΜΗΣ ΚΥΒΟΥ',
      prompt: `Ένας σκελετός κύβου χρειάστηκε ακριβώς 72 cm σύρματος για τις 12 ακμές του. Πόσα εκατοστόμετρα (cm) είναι η ακμή του κύβου;`,
      options: ensureFourUniqueOptions(correct, () => ['12 cm', '8 cm', '9 cm', '7 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Σύνολο σύρματος', value: '72 cm' },
        { label: 'Πράξη (: 12)', value: '72 : 12 ＝ 6 cm' }
      ],
      explanation: `72 : 12 ＝ 6 cm.`
    };
  },
  // 4. Εύρεση μήκους σε παραλληλεπίπεδο
  () => {
    const l = 15;
    const w = 10;
    const h = 5;
    const total = 4 * (15 + 10 + 5); // 120
    const correct = `${l} cm`;
    return {
      title: 'ΕΥΡΕΣΗ ΜΗΚΟΥΣ ΣΚΕΛΕΤΟΥ',
      prompt: `Οι 12 ακμές ενός ορθογωνίου παραλληλεπιπέδου έχουν συνολικό μήκος 120 cm. Αν το πλάτος είναι 10 cm και το ύψος είναι 5 cm, πόσο είναι το μήκος του;`,
      options: ensureFourUniqueOptions(correct, () => ['20 cm', '12 cm', '18 cm', '10 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Άθροισμα 3 διαστάσεων', value: '120 : 4 ＝ 30 cm' },
        { label: 'Πλάτος ＋ Ύψος', value: '10 ＋ 5 ＝ 15 cm' },
        { label: 'Μήκος', value: '30 － 15 ＝ 15 cm' }
      ],
      explanation: `120 : 4 ＝ 30 cm. Μήκος: 30 － 10 － 5 ＝ 15 cm.`
    };
  },
  // 5. Εύρεση ακμής κύβου από σύρμα 144 cm
  () => {
    const total = 144;
    const a = 12;
    const correct = '12 cm';
    return {
      title: 'ΑΚΜΗ ΚΥΒΟΥ ΑΠΟ 144 CM ΣΥΡΜΑ',
      prompt: `Για να φτιαχτεί ο σκελετός ενός κύβου χρησιμοποιήθηκαν 144 cm σύρματος. Πόσο είναι το μήκος της ακμής του κύβου;`,
      options: ensureFourUniqueOptions(correct, () => ['14 cm', '10 cm', '16 cm', '24 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Συνολικό σύρμα', value: '144 cm' },
        { label: 'Πράξη', value: '144 : 12 ＝ 12 cm' }
      ],
      explanation: `144 : 12 ＝ 12 cm.`
    };
  },
  // 6. Εύρεση πλάτους σε παραλληλεπίπεδο
  () => {
    const l = 20;
    const w = 10;
    const h = 10;
    const total = 4 * 40; // 160
    const correct = '10 cm';
    return {
      title: 'ΕΥΡΕΣΗ ΠΛΑΤΟΥΣ ΚΟΥΤΙΟΥ',
      prompt: `Ο σκελετός ενός κουτιού έχει συνολικό μήκος ακμών 160 cm. Αν το μήκος είναι 20 cm και το ύψος είναι 10 cm, πόσο είναι το πλάτος του;`,
      options: ensureFourUniqueOptions(correct, () => ['15 cm', '12 cm', '8 cm', '20 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Άθροισμα 3 ακμών', value: '160 : 4 ＝ 40 cm' },
        { label: 'Πλάτος', value: '40 － (20 ＋ 10) ＝ 40 － 30 ＝ 10 cm' }
      ],
      explanation: `160 : 4 ＝ 40 cm. Πλάτος: 40 － 20 － 10 ＝ 10 cm.`
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα, Τύπος Euler & Κόστος Κατασκευής
const PROBLEM_POOL_Q12 = [
  // 1. Κόστος σύρματος για σκελετό κύβου
  () => {
    const a = 10; // cm => 12 * 10 = 120 cm = 1.2 m
    const pricePerMeter = 5;
    const cost = 1.2 * pricePerMeter; // 6 €
    const correct = '6 €';
    return {
      title: 'ΚΟΣΤΟΣ ΚΑΤΑΣΚΕΥΗΣ ΣΚΕΛΕΤΟΥ',
      prompt: `Ένας τεχνίτης φτιάχνει τον σκελετό ενός κύβου με ακμή 10 cm. Το σύρμα κοστίζει 5 € το μέτρο (m). Πόσο θα κοστίσει το σύρμα για ολόκληρο τον κύβο;`,
      options: ensureFourUniqueOptions(correct, () => ['12 €', '5 €', '60 €', '4 €']),
      correctAnswer: correct,
      unit: '€',
      tableData: [
        { label: 'Συνολικό μήκος ακμών', value: '12 · 10 cm ＝ 120 cm' },
        { label: 'Μετατροπή σε μέτρα (: 100)', value: '120 : 100 ＝ 1,2 m' },
        { label: 'Κόστος σύρματος', value: '1,2 · 5 € ＝ 6 €' }
      ],
      explanation: `Ο κύβος χρειάζεται 12 · 10 ＝ 120 cm σύρματος, δηλαδή 1,2 m. Κόστος: 1,2 · 5 € ＝ 6 €.`
    };
  },
  // 2. Επαλήθευση τύπου Euler σε πρίσμα
  () => {
    const correct = '14';
    return {
      title: 'ΤΥΠΟΣ EULER ΣΤΟΝ ΚΥΒΟ',
      prompt: `Σύμφωνα με τον τύπο του Euler, σε κάθε πολύεδρο ισχύει: Έδρες ＋ Κορυφές ＝ Ακμές ＋ 2. Πόσο ισούται το άθροισμα Έδρες ＋ Κορυφές στον κύβο;`,
      options: ensureFourUniqueOptions(correct, () => ['12', '16', '18', '20']),
      correctAnswer: correct,
      unit: 'αποτέλεσμα',
      tableData: [
        { label: 'Έδρες κύβου', value: '6' },
        { label: 'Κορυφές κύβου', value: '8' },
        { label: 'Άθροισμα', value: '6 ＋ 8 ＝ 14 (και Ακμές ＋ 2 ＝ 12 ＋ 2 ＝ 14)' }
      ],
      explanation: `Ο κύβος έχει 6 έδρες και 8 κορυφές: 6 ＋ 8 ＝ 14. Επαλήθευση: 12 ακμές ＋ 2 ＝ 14.`
    };
  },
  // 3. Σύγκριση σκελετού κύβου και παραλληλεπιπέδου
  () => {
    const correct = 'Ο κύβος χρειάζεται περισσότερο σύρμα (120 cm έναντι 100 cm)';
    return {
      title: 'ΣΥΓΚΡΙΣΗ ΔΥΟ ΣΚΕΛΕΤΩΝ',
      prompt: `Έχουμε έναν κύβο με ακμή 10 cm και ένα ορθογώνιο παραλληλεπίπεδο με διαστάσεις 12 cm, 8 cm και 5 cm. Ποιο από τα δύο στερεά χρειάζεται περισσότερο σύρμα για τον σκελετό του;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Το ορθογώνιο παραλληλεπίπεδο χρειάζεται περισσότερο σύρμα',
        'Χρειάζονται ακριβώς το ίδιο σύρμα',
        'Δεν μπορούμε να γνωρίζουμε χωρίς να ξέρουμε το βάρος'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Σύρμα κύβου', value: '12 · 10 ＝ 120 cm' },
        { label: 'Σύρμα παραλληλεπιπέδου', value: '4 · (12 ＋ 8 ＋ 5) ＝ 4 · 25 ＝ 100 cm' },
        { label: 'Σύγκριση', value: '120 cm ＞ 100 cm' }
      ],
      explanation: `Ο κύβος απαιτεί 12 · 10 ＝ 120 cm, ενώ το παραλληλεπίπεδο 4 · 25 ＝ 100 cm. Άρα ο κύβος χρειάζεται περισσότερο σύρμα.`
    };
  },
  // 4. Κόστος πηχακίων για κλουβί
  () => {
    const l = 40;
    const w = 30;
    const h = 30;
    const totalCm = 4 * (40 + 30 + 30); // 4 * 100 = 400 cm = 4 m
    const pricePerM = 3;
    const totalCost = 4 * pricePerM; // 12 €
    const correct = '12 €';
    return {
      title: 'ΚΟΣΤΟΣ ΠΗΧΑΚΙΩΝ ΓΙΑ ΚΛΟΥΒΙ',
      prompt: `Για τον σκελετό ενός ορθογωνίου παραλληλεπιπέδου με διαστάσεις 40 cm, 30 cm και 30 cm αγοράζονται ξύλινα πηχάκια προς 3 € το μέτρο. Πόσο θα κοστίσουν τα πηχάκια;`,
      options: ensureFourUniqueOptions(correct, () => ['24 €', '9 €', '15 €', '30 €']),
      correctAnswer: correct,
      unit: '€',
      tableData: [
        { label: 'Συνολικό μήκος ακμών', value: '4 · (40 ＋ 30 ＋ 30) ＝ 4 · 100 ＝ 400 cm ＝ 4 m' },
        { label: 'Κόστος ανά μέτρο', value: '3 €' },
        { label: 'Συνολικό κόστος', value: '4 · 3 € ＝ 12 €' }
      ],
      explanation: `400 cm ＝ 4 m. Κόστος: 4 · 3 € ＝ 12 €.`
    };
  },
  // 5. Πόσες γωνίες 90° σχηματίζονται στις ακμές
  () => {
    const correct = '24 ορθές γωνίες';
    return {
      title: 'ΟΡΘΕΣ ΓΩΝΙΕΣ ΣΤΙΣ ΕΔΡΕΣ',
      prompt: `Σε έναν κύβο, κάθε έδρα είναι τετράγωνο και έχει 4 ορθές γωνίες (90°). Πόσες ορθές γωνίες έχουν συνολικά και οι 6 έδρες του κύβου;`,
      options: ensureFourUniqueOptions(correct, () => ['12 ορθές γωνίες', '8 ορθές γωνίες', '36 ορθές γωνίες', '48 ορθές γωνίες']),
      correctAnswer: correct,
      unit: 'γωνίες',
      tableData: [
        { label: 'Πλήθος εδρών', value: '6 τετράγωνα' },
        { label: 'Ορθές γωνίες ανά έδρα', value: '4' },
        { label: 'Σύνολο ορθών γωνιών', value: '6 · 4 ＝ 24 ορθές γωνίες' }
      ],
      explanation: `Κάθε τετράγωνο έχει 4 ορθές γωνίες, άρα οι 6 έδρες έχουν: 6 · 4 ＝ 24 ορθές γωνίες.`
    };
  },
  // 6. Διπλασιασμός ακμών κύβου
  () => {
    const correct = 'Το μήκος του σύρματος διπλασιάζεται';
    return {
      title: 'ΜΕΤΑΒΟΛΗ ΑΚΜΩΝ ΚΥΒΟΥ',
      prompt: `Αν διπλασιάσουμε το μήκος της ακμής ενός κύβου, πώς θα αλλάξει το συνολικό μήκος του σύρματος που χρειάζεται για τον σκελετό του;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Το μήκος του σύρματος τετραπλασιάζεται',
        'Το μήκος του σύρματος παραμένει το ίδιο',
        'Το μήκος του σύρματος γίνεται 12 φορές μεγαλύτερο'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Αρχικό σύρμα', value: '12 · α' },
        { label: 'Νέο σύρμα', value: '12 · (2 · α) ＝ 2 · (12 · α)' }
      ],
      explanation: `Το μήκος είναι γραμμικό μέγεθος (δεν είναι εμβαδόν). Όταν διπλασιάζεται η ακμή, το συνολικό μήκος των 12 ακμών απλώς διπλασιάζεται.`
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
    title: 'ΣΤΟΙΧΕΙΑ ΚΥΒΟΥ ΚΑΙ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ',
    prompt: isQ1True
      ? 'Τόσο ο κύβος όσο και το ορθογώνιο παραλληλεπίπεδο έχουν ακριβώς 12 ακμές και 8 κορυφές.'
      : 'Ο κύβος έχει 8 ακμές και 12 κορυφές.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Ακμές', value: '12 ευθύγραμμα τμήματα' },
      { label: 'Κορυφές', value: '8 γωνιακά σημεία' },
      { label: 'Έδρες', value: '6 επιφάνειες' }
    ],
    explanation: isQ1True
      ? 'Τόσο ο κύβος όσο και το ορθογώνιο παραλληλεπίπεδο έχουν ακριβώς 12 ακμές και 8 κορυφές.'
      : 'Ο κύβος έχει 12 ακμές και 8 κορυφές (και όχι 8 ακμές και 12 κορυφές).'
  });

  // Q2: Τι είναι ακμή (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΕΝΝΟΙΑ ΤΗΣ ΑΚΜΗΣ',
    prompt: 'Τι είναι η ακμή ενός γεωμετρικού στερεού;',
    options: ensureFourUniqueOptions('Το ευθύγραμμο τμήμα όπου συναντώνται δύο γειτονικές έδρες', () => [
      'Το γωνιακό σημείο όπου ενώνονται 3 πλευρές',
      'Ολόκληρη η επίπεδη επιφάνεια του στερεού',
      'Η διαγώνιος που ενώνει δύο απέναντι γωνίες'
    ]),
    correctAnswer: 'Το ευθύγραμμο τμήμα όπου συναντώνται δύο γειτονικές έδρες',
    tableData: [
      { label: 'Ακμή', value: 'Ευθύγραμμο τμήμα τομής 2 εδρών' }
    ],
    explanation: 'Ακμή ονομάζεται το ευθύγραμμο τμήμα (γραμμή) όπου ενώνονται δύο έδρες του στερεού.'
  });

  // Q3: Τι είναι κορυφή (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΕΝΝΟΙΑ ΤΗΣ ΚΟΡΥΦΗΣ',
    prompt: 'Τι είναι η κορυφή σε έναν κύβο ή παραλληλεπίπεδο;',
    options: ensureFourUniqueOptions('Το σημείο όπου συναντώνται τρεις ακμές του στερεού', () => [
      'Το κέντρο της κάτω βάσης',
      'Η μεγαλύτερη πλευρά του κουτιού',
      'Το εμβαδόν της επάνω έδρας'
    ]),
    correctAnswer: 'Το σημείο όπου συναντώνται τρεις ακμές του στερεού',
    tableData: [
      { label: 'Κορυφή', value: 'Σημείο συνάντησης 3 ακμών (γωνία)' },
      { label: 'Σύνολο κορυφών', value: '8 κορυφές' }
    ],
    explanation: 'Κορυφή είναι το σημείο (η «γωνία») όπου συναντώνται 3 ακμές του στερεού.'
  });

  // Q4: Οπτική αναγνώριση στοιχείων (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΑΝΑΓΝΩΡΙΣΗ ΣΤΟΙΧΕΙΩΝ ΣΕ ΣΧΗΜΑ',
    prompt: 'Παρατηρήστε το παρακάτω στερεό. Τι παριστάνει η κόκκινη κουκκίδα;',
    svg: (
      <svg viewBox="0 0 160 120" className="w-40 h-28 mx-auto my-2 select-none drop-shadow-sm">
        {/* Απλό ισομετρικό παραλληλεπίπεδο */}
        <polygon points="50,40 100,20 130,40 80,60" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
        <polygon points="50,40 80,60 80,100 50,80" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="1.5" />
        <polygon points="80,60 130,40 130,80 80,100" fill="#a5b4fc" stroke="#4f46e5" strokeWidth="1.5" />
        <circle cx="80" cy="60" r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
        <text x="92" y="65" fill="#f43f5e" fontSize="10" fontWeight="bold">;</text>
      </svg>
    ),
    options: ensureFourUniqueOptions('Μία κορυφή του στερεού (σημείο συνάντησης 3 ακμών)', () => [
      'Μία ακμή του στερεού',
      'Μία έδρα του στερεού',
      'Το κέντρο βάρους του στερεού'
    ]),
    correctAnswer: 'Μία κορυφή του στερεού (σημείο συνάντησης 3 ακμών)',
    tableData: [
      { label: 'Κόκκινο σημείο', value: 'Κορυφή (συναντώνται 3 ακμές)' }
    ],
    explanation: 'Η κόκκινη κουκκίδα βρίσκεται σε ένα γωνιακό σημείο όπου συναντώνται τρεις ακμές, άρα είναι κορυφή.'
  });

  // Q5: Υπολογισμός μήκους ακμών κύβου με ακμή 5 cm (Input αριθμού)
  const a5 = 5;
  const total5 = 12 * a5; // 60
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΣΥΝΟΛΙΚΟ ΜΗΚΟΣ ΑΚΜΩΝ ΚΥΒΟΥ (Α = 5 CM)',
    prompt: `Πόσα cm σύρματος χρειάζονται για να κατασκευαστούν και οι 12 ακμές ενός κύβου με ακμή 5 cm; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(total5),
    tableData: [
      { label: 'Μήκος 1 ακμής', value: '5 cm' },
      { label: 'Πλήθος ακμών', value: '12 ακμές' },
      { label: 'Πράξη', value: '12 · 5 ＝ 60 cm' }
    ],
    explanation: `12 · 5 ＝ 60 cm.`
  });

  // Q6: Πλήθος κορυφών κύβου (Input αριθμού)
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΠΛΗΘΟΣ ΚΟΡΥΦΩΝ',
    prompt: 'Πόσες κορυφές έχει συνολικά ένας κύβος; (Γράψτε μόνο τον αριθμό)',
    correctAnswer: '8',
    tableData: [
      { label: 'Πάνω βάση', value: '4 κορυφές' },
      { label: 'Κάτω βάση', value: '4 κορυφές' },
      { label: 'Σύνολο', value: '8 κορυφές' }
    ],
    explanation: 'Ο κύβος έχει 8 κορυφές (4 στην επάνω βάση και 4 στην κάτω).'
  });

  // Q7: Τύπος Euler (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'Ο ΤΥΠΟΣ ΤΟΥ EULER',
    prompt: 'Ποια είναι η σωστή μαθηματική σχέση του Euler που συνδέει τις Έδρες (Ε), τις Κορυφές (Κ) και τις Ακμές (Α) ενός κυρτού πολυέδρου;',
    options: ensureFourUniqueOptions('Ε ＋ Κ ＝ Α ＋ 2', () => [
      'Ε ＋ Α ＝ Κ ＋ 2',
      'Ε · Κ ＝ Α ＋ 2',
      'Ε ＋ Κ ＋ Α ＝ 2'
    ]),
    correctAnswer: 'Ε ＋ Κ ＝ Α ＋ 2',
    tableData: [
      { label: 'Σχέση Euler', value: 'Έδρες ＋ Κορυφές ＝ Ακμές ＋ 2' },
      { label: 'Στον κύβο', value: '6 ＋ 8 ＝ 12 ＋ 2 ＝ 14' }
    ],
    explanation: 'Ο τύπος του Euler είναι: Έδρες ＋ Κορυφές ＝ Ακμές ＋ 2 (Ε ＋ Κ ＝ Α ＋ 2).'
  });

  // Q8: Ομάδες ακμών στο παραλληλεπίπεδο (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΑΚΜΕΣ ΟΡΘΟΓΩΝΙΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ',
    prompt: 'Πώς κατανέμονται οι 12 ακμές σε ένα ορθογώνιο παραλληλεπίπεδο με μήκος, πλάτος και ύψος;',
    options: ensureFourUniqueOptions('Σε 3 ομάδες των 4 ίσων ακμών (4 μήκη, 4 πλάτη, 4 ύψη)', () => [
      'Είναι και οι 12 υποχρεωτικά ίσες μεταξύ τους',
      'Σε 2 ομάδες των 6 ακμών',
      'Σε 6 ομάδες των 2 ακμών'
    ]),
    correctAnswer: 'Σε 3 ομάδες των 4 ίσων ακμών (4 μήκη, 4 πλάτη, 4 ύψη)',
    tableData: [
      { label: 'Κατανομή 12 ακμών', value: '4 μήκη (α) ＋ 4 πλάτη (β) ＋ 4 ύψη (γ)' }
    ],
    explanation: 'Το ορθογώνιο παραλληλεπίπεδο έχει 4 παράλληλες ακμές για κάθε μία από τις τρεις διαστάσεις του: 4 · (α ＋ β ＋ γ).'
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

export default function AkmesKorifesAskiseisPage() {
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
      title="Ασκήσεις: Ακμές &amp; Κορυφές - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στις ακμές, κορυφές, σκελετούς κύβου και ορθογωνίου παραλληλεπιπέδου και στον τύπο του Euler για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/78-akmes-korifes"
      backText="Θεωρία Κεφ. 78"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/78-akmes-korifes"
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
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 78 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Ακμες και Κορυφες')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στις 12 ακμές και τις 8 κορυφές, στους υπολογισμούς συρμάτινων σκελετών και στον τύπο του Euler μέσα από 12 δυναμικές ερωτήσεις.
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

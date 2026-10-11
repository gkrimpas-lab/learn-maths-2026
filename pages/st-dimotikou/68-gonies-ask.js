// pages/st-dimotikou/68-gonies-ask.js
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

// POOL ΓΙΑ Q9: Συμπληρωματικές Γωνίες (Άθροισμα 90°)
const PROBLEM_POOL_Q9 = [
  // 1. Ορθή γωνία σε 2 μέρη
  () => {
    const a = randInt(18, 72);
    const b = 90 - a;
    const correct = `${b}°`;
    return {
      title: 'ΣΥΜΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ',
      prompt: `Μια ορθή γωνία (90°) χωρίζεται από μία εσωτερική ημιευθεία σε δύο γωνίες. Αν η μία γωνία μετράει ${a}°, πόσες μοίρες είναι η άλλη;`,
      options: ensureFourUniqueOptions(correct, () => [`${b + 10}°`, `${b - 10}°`, `${180 - a}°`, `${90 + a}°`]),
      correctAnswer: correct,
      tableData: [
        { label: 'Συνολική γωνία', value: '90° (Ορθή)' },
        { label: 'Γνωστή γωνία', value: `${a}°` },
        { label: 'Πράξη', value: `90° － ${a}°` },
        { label: 'Ζητούμενη γωνία', value: `${b}°` }
      ],
      explanation: `Οι δύο γωνίες είναι συμπληρωματικές (άθροισμα 90°). Αφαιρούμε: 90° － ${a}° ＝ ${b}°.`
    };
  },
  // 2. Ράμπα skateboard
  () => {
    const slope = randInt(15, 38);
    const comp = 90 - slope;
    const correct = `${comp}°`;
    return {
      title: 'ΚΛΙΣΗ ΡΑΜΠΑΣ ΚΑΙ ΚΑΘΕΤΟΣ',
      prompt: `Μια ράμπα σχηματίζει με το έδαφος οξεία γωνία ${slope}°. Πόσες μοίρες είναι η συμπληρωματική της γωνία ως προς την κατακόρυφη κολόνα 90°;`,
      options: ensureFourUniqueOptions(correct, () => [`${comp + 12}°`, `${comp - 8}°`, `${180 - slope}°`, `${slope + 45}°`]),
      correctAnswer: correct,
      tableData: [
        { label: 'Κατακόρυφη γωνία', value: '90°' },
        { label: 'Κλίση ράμπας', value: `${slope}°` },
        { label: 'Πράξη', value: `90° － ${slope}°` },
        { label: 'Συμπλήρωμα', value: `${comp}°` }
      ],
      explanation: `Η κατακόρυφος σχηματίζει 90° με το έδαφος. Υπολογίζουμε: 90° － ${slope}° ＝ ${comp}°.`
    };
  },
  // 3. Διχοτόμηση ορθής γωνίας
  () => {
    const half = 45;
    const correct = `${half}°`;
    return {
      title: 'ΧΩΡΙΣΜΟΣ ΟΡΘΗΣ ΓΩΝΙΑΣ ΣΤΗ ΜΕΣΗ',
      prompt: `Μια ορθή γωνία (90°) χωρίζεται ακριβώς στη μέση σε δύο ίσες γωνίες. Πόσες μοίρες είναι καθεμία από τις δύο νέες γωνίες;`,
      options: ensureFourUniqueOptions(correct, () => ['30°', '60°', '50°', '40°']),
      correctAnswer: correct,
      tableData: [
        { label: 'Αρχική γωνία', value: '90°' },
        { label: 'Διαίρεση', value: 'Σε 2 ίσα μέρη' },
        { label: 'Πράξη', value: '90° : 2' },
        { label: 'Κάθε γωνία', value: `${half}°` }
      ],
      explanation: `Διαιρούμε την ορθή γωνία με το 2: 90° : 2 ＝ 45°.`
    };
  },
  // 4. Ορθή γωνία σε 3 ίσα μέρη
  () => {
    const third = 30;
    const correct = `${third}°`;
    return {
      title: 'ΤΡΙΧΟΤΟΜΗΣΗ ΟΡΘΗΣ ΓΩΝΙΑΣ',
      prompt: `Αν χωρίσουμε μια ορθή γωνία 90° σε 3 ίσα μέρη, πόσες μοίρες θα έχει το καθένα από αυτά;`,
      options: ensureFourUniqueOptions(correct, () => ['20°', '45°', '25°', '60°']),
      correctAnswer: correct,
      tableData: [
        { label: 'Αρχική γωνία', value: '90°' },
        { label: 'Διαίρεση', value: 'Σε 3 ίσα μέρη' },
        { label: 'Πράξη', value: '90° : 3' },
        { label: 'Κάθε μέρος', value: `${third}°` }
      ],
      explanation: `Διαιρούμε: 90° : 3 ＝ 30°. Κάθε γωνία είναι 30°.`
    };
  },
  // 5. Φωτοβολταϊκό πάνελ
  () => {
    const tilt = randInt(22, 48);
    const comp = 90 - tilt;
    const correct = `${comp}°`;
    return {
      title: 'ΚΛΙΣΗ ΦΩΤΟΒΟΛΤΑΙΚΟΥ ΠΑΝΕΛ',
      prompt: `Ένα φωτοβολταϊκό πλαίσιο τοποθετείται σε στέγη με κλίση ${tilt}° ως προς το οριζόντιο επίπεδο. Πόση είναι η συμπληρωματική γωνία της κλίσης του (μέχρι τις 90°);`,
      options: ensureFourUniqueOptions(correct, () => [`${comp + 15}°`, `${comp - 15}°`, `${180 - tilt}°`, `${tilt + 30}°`]),
      correctAnswer: correct,
      tableData: [
        { label: 'Ορθή γωνία αναφοράς', value: '90°' },
        { label: 'Κλίση πλαισίου', value: `${tilt}°` },
        { label: 'Πράξη', value: `90° － ${tilt}°` },
        { label: 'Συμπληρωματική', value: `${comp}°` }
      ],
      explanation: `Αφαιρούμε την κλίση από τις 90°: 90° － ${tilt}° ＝ ${comp}°.`
    };
  },
  // 6. Δύο ίσες συμπληρωματικές
  () => {
    const val = 45;
    const correct = `${val}°`;
    return {
      title: 'ΙΣΕΣ ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ ΓΩΝΙΕΣ',
      prompt: `Δύο γωνίες είναι συμπληρωματικές (άθροισμα 90°) και επιπλέον είναι ίσες μεταξύ τους. Πόσες μοίρες είναι καθεμία;`,
      options: ensureFourUniqueOptions(correct, () => ['90°', '30°', '60°', '50°']),
      correctAnswer: correct,
      tableData: [
        { label: 'Άθροισμα', value: '90°' },
        { label: 'Σχέση', value: 'Ίσες (2 μέρη)' },
        { label: 'Πράξη', value: '90° : 2' },
        { label: 'Αποτέλεσμα', value: `${val}°` }
      ],
      explanation: `Αφού είναι ίσες και έχουν άθροισμα 90°: 90° : 2 ＝ 45°.`
    };
  }
];

// POOL ΓΙΑ Q10: Παραπληρωματικές Γωνίες (Άθροισμα 180°)
const PROBLEM_POOL_Q10 = [
  // 1. Ευθεία γραμμή σε 2 γωνίες
  () => {
    const a = randInt(45, 135);
    const b = 180 - a;
    const correct = `${b}°`;
    return {
      title: 'ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ',
      prompt: `Δύο γωνίες σχηματίζουν μαζί μια ευθεία γραμμή (180°). Αν η μία γωνία είναι ${a}°, πόσες μοίρες είναι η άλλη;`,
      options: ensureFourUniqueOptions(correct, () => [`${b + 10}°`, `${b - 10}°`, `${90 - Math.min(a, 80)}°`, `${180 - b + 8}°`]),
      correctAnswer: correct,
      tableData: [
        { label: 'Συνολική γωνία', value: '180° (Ευθεία)' },
        { label: 'Γνωστή γωνία', value: `${a}°` },
        { label: 'Πράξη', value: `180° － ${a}°` },
        { label: 'Ζητούμενη γωνία', value: `${b}°` }
      ],
      explanation: `Δύο εφεξής γωνίες σε ευθεία γραμμή είναι παραπληρωματικές (άθροισμα 180°): 180° － ${a}° ＝ ${b}°.`
    };
  },
  // 2. Ευθεία γωνία σε 3 ίσα μέρη
  () => {
    const part = 60;
    const correct = `${part}°`;
    return {
      title: 'ΧΩΡΙΣΜΟΣ ΕΥΘΕΙΑΣ ΓΩΝΙΑΣ ΣΕ 3 ΜΕΡΗ',
      prompt: `Μια ευθεία γωνία 180° χωρίζεται σε 3 απολύτως ίσα μέρη. Πόσες μοίρες μετράει το καθένα;`,
      options: ensureFourUniqueOptions(correct, () => ['45°', '90°', '30°', '50°']),
      correctAnswer: correct,
      tableData: [
        { label: 'Συνολική γωνία', value: '180°' },
        { label: 'Ίσα μέρη', value: '3' },
        { label: 'Πράξη', value: '180° : 3' },
        { label: 'Κάθε μέρος', value: `${part}°` }
      ],
      explanation: `Διαιρούμε την ευθεία γωνία με το 3: 180° : 3 ＝ 60°.`
    };
  },
  // 3. Ευθεία γωνία σε 4 ίσα μέρη
  () => {
    const part = 45;
    const correct = `${part}°`;
    return {
      title: 'ΧΩΡΙΣΜΟΣ ΕΥΘΕΙΑΣ ΓΩΝΙΑΣ ΣΕ 4 ΜΕΡΗ',
      prompt: `Χωρίζουμε μια ευθεία γωνία (180°) σε 4 ίσες γωνίες. Πόσες μοίρες είναι καθεμία από τις 4 γωνίες;`,
      options: ensureFourUniqueOptions(correct, () => ['40°', '50°', '35°', '60°']),
      correctAnswer: correct,
      tableData: [
        { label: 'Συνολική γωνία', value: '180°' },
        { label: 'Ίσα μέρη', value: '4' },
        { label: 'Πράξη', value: '180° : 4' },
        { label: 'Κάθε μέρος', value: `${part}°` }
      ],
      explanation: `Διαιρούμε: 180° : 4 ＝ 45°.`
    };
  },
  // 4. Στροφή πλοίου σε ευθεία πορεία
  () => {
    const turn = randInt(35, 85);
    const rem = 180 - turn;
    const correct = `${rem}°`;
    return {
      title: 'ΣΤΡΟΦΗ ΠΛΟΙΟΥ ΑΠΟ ΕΥΘΕΙΑ ΠΟΡΕΙΑ',
      prompt: `Ένα πλοίο που κινούνταν σε ευθεία γραμμή έστριψε κατά ${turn}°. Πόσες μοίρες υπολείπονται για να ολοκληρώσει πλήρη αναστροφή πορείας 180°;`,
      options: ensureFourUniqueOptions(correct, () => [`${rem + 15}°`, `${rem - 15}°`, `${90 - turn}°`, `${turn + 60}°`]),
      correctAnswer: correct,
      tableData: [
        { label: 'Πλήρης αναστροφή', value: '180°' },
        { label: 'Πραγματοποιηθείσα στροφή', value: `${turn}°` },
        { label: 'Πράξη', value: `180° － ${turn}°` },
        { label: 'Υπόλοιπο στροφής', value: `${rem}°` }
      ],
      explanation: `Η αναστροφή αντιστοιχεί σε ευθεία γωνία (180°). Υπολογίζουμε: 180° － ${turn}° ＝ ${rem}°.`
    };
  },
  // 5. Διαφορά αμβλείας από ευθεία
  () => {
    const a = randInt(115, 165);
    const diff = 180 - a;
    const correct = `${diff}°`;
    return {
      title: 'ΔΙΑΦΟΡΑ ΑΜΒΛΕΙΑΣ ΑΠΟ ΕΥΘΕΙΑ',
      prompt: `Μια αμβλεία γωνία έχει μέτρο ${a}°. Κατά πόσες μοίρες υπολείπεται από το να γίνει ευθεία γωνία (180°);`,
      options: ensureFourUniqueOptions(correct, () => [`${diff + 10}°`, `${diff - 10}°`, `${a - 90}°`, `${diff + 20}°`]),
      correctAnswer: correct,
      tableData: [
        { label: 'Στόχος', value: '180° (Ευθεία)' },
        { label: 'Αμβλεία γωνία', value: `${a}°` },
        { label: 'Πράξη', value: `180° － ${a}°` },
        { label: 'Διαφορά', value: `${diff}°` }
      ],
      explanation: `Αφαιρούμε από το 180°: 180° － ${a}° ＝ ${diff}°.`
    };
  },
  // 6. Δύο ίσες παραπληρωματικές
  () => {
    const val = 90;
    const correct = `${val}°`;
    return {
      title: 'ΙΣΕΣ ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ ΓΩΝΙΕΣ',
      prompt: `Δύο γωνίες είναι παραπληρωματικές (άθροισμα 180°) και είναι ίσες μεταξύ τους. Τι είδους γωνία είναι καθεμία και πόσες μοίρες μετράει;`,
      options: ensureFourUniqueOptions('Ορθές γωνίες (90°)', () => [
        'Οξείες γωνίες (45°)',
        'Αμβλείες γωνίες (120°)',
        'Ευθείες γωνίες (180°)'
      ]),
      correctAnswer: 'Ορθές γωνίες (90°)',
      tableData: [
        { label: 'Άθροισμα', value: '180°' },
        { label: 'Πράξη', value: '180° : 2 ＝ 90°' },
        { label: 'Είδος', value: 'Ορθές γωνίες (κάθετες)' }
      ],
      explanation: `180° : 2 ＝ 90°. Όταν δύο παραπληρωματικές γωνίες είναι ίσες, είναι και οι δύο ορθές (90°).`
    };
  }
];

// POOL ΓΙΑ Q11: Δείκτες Ρολογιού & Κίνηση
const PROBLEM_POOL_Q11 = [
  // 1. Ρολόι σε ακέραιες ώρες
  () => {
    const h = randInt(1, 5);
    const deg = h * 30;
    const correct = `${deg}°`;
    return {
      title: 'ΓΩΝΙΑ ΔΕΙΚΤΩΝ ΡΟΛΟΓΙΟΥ',
      prompt: `Ένα αναλογικό ρολόι δείχνει ακριβώς ${h}:00. Πόσες μοίρες είναι η κυρτή γωνία που σχηματίζουν οι δείκτες του;`,
      options: ensureFourUniqueOptions(correct, () => [`${deg + 30}°`, `${deg - 30}°`, `${h * 45}°`, `${deg + 15}°`]),
      correctAnswer: correct,
      tableData: [
        { label: 'Καντράν', value: '360° : 12 ＝ 30° ανά ώρα' },
        { label: 'Απόσταση δεικτών', value: `${h} ώρες` },
        { label: 'Πράξη', value: `${h} · 30°` },
        { label: 'Γωνία', value: `${deg}°` }
      ],
      explanation: `Κάθε ώρα στο ρολόι αντιστοιχεί σε 30°. Στις ${h}:00 οι δείκτες απέχουν ${h} ώρες: ${h} · 30° ＝ ${deg}°.`
    };
  },
  // 2. Ρολόι στις 3:30
  () => {
    const correct = '75°';
    return {
      title: 'ΓΩΝΙΑ ΔΕΙΚΤΩΝ ΣΤΙΣ 3:30',
      prompt: `Ένα ρολόι δείχνει ακριβώς 3:30. Πόσες μοίρες είναι η γωνία ανάμεσα στον ωροδείκτη και τον λεπτοδείκτη;`,
      options: ensureFourUniqueOptions(correct, () => ['90°', '80°', '60°', '105°']),
      correctAnswer: correct,
      tableData: [
        { label: 'Λεπτοδείκτης', value: 'Στο 6' },
        { label: 'Ωροδείκτης', value: 'Στο 3,5 (μέσο του 3 και 4)' },
        { label: 'Διαφορά ωρών', value: '6 － 3,5 ＝ 2,5 ώρες' },
        { label: 'Πράξη', value: '2,5 · 30° ＝ 75°' }
      ],
      explanation: `Στις 3:30 ο λεπτοδείκτης είναι στο 6 και ο ωροδείκτης στο 3,5. Η απόσταση είναι 2,5 ώρες: 2,5 · 30° ＝ 75°.`
    };
  },
  // 3. Ρολόι στις 6:00
  () => {
    const correct = '180°';
    return {
      title: 'ΓΩΝΙΑ ΔΕΙΚΤΩΝ ΣΤΙΣ 6:00',
      prompt: `Πόσες μοίρες είναι η γωνία που σχηματίζουν οι δείκτες ενός ρολογιού όταν η ώρα είναι ακριβώς 6:00;`,
      options: ensureFourUniqueOptions(correct, () => ['90°', '360°', '120°', '150°']),
      correctAnswer: correct,
      tableData: [
        { label: 'Θέσεις δεικτών', value: '12 (πάνω) και 6 (κάτω)' },
        { label: 'Απόσταση', value: '6 ώρες (μισός κύκλος)' },
        { label: 'Πράξη', value: '6 · 30° ＝ 180°' },
        { label: 'Είδος', value: 'Ευθεία γωνία' }
      ],
      explanation: `Στις 6:00 οι δείκτες βρίσκονται σε ευθεία γραμμή (αντικείμενες κατευθύνσεις), άρα σχηματίζουν ευθεία γωνία 180°.`
    };
  },
  // 4. Περιστροφή λεπτοδείκτη σε 15 λεπτά
  () => {
    const correct = '90°';
    return {
      title: 'ΚΙΝΗΣΗ ΛΕΠΤΟΔΕΙΚΤΗ (15 ΛΕΠΤΑ)',
      prompt: `Όταν περνούν 15 λεπτά της ώρας, κατά πόσες μοίρες περιστρέφεται ο λεπτοδείκτης του ρολογιού;`,
      options: ensureFourUniqueOptions(correct, () => ['60°', '45°', '180°', '30°']),
      correctAnswer: correct,
      tableData: [
        { label: '1 ώρα (60 λεπτά)', value: '360° (πλήρης κύκλος)' },
        { label: '15 λεπτά', value: 'Το 1/4 της ώρας (60 : 15 ＝ 4)' },
        { label: 'Πράξη', value: '360° : 4 ＝ 90°' },
        { label: 'Είδος γωνίας', value: 'Ορθή γωνία' }
      ],
      explanation: `Σε 15 λεπτά ο λεπτοδείκτης διανύει το 1/4 του κύκλου: 360° : 4 ＝ 90° (ορθή γωνία).`
    };
  },
  // 5. Περιστροφή λεπτοδείκτη σε 20 λεπτά
  () => {
    const correct = '120°';
    return {
      title: 'ΚΙΝΗΣΗ ΛΕΠΤΟΔΕΙΚΤΗ (20 ΛΕΠΤΑ)',
      prompt: `Πόσες μοίρες περιστρέφεται ο λεπτοδείκτης σε χρονικό διάστημα 20 λεπτών;`,
      options: ensureFourUniqueOptions(correct, () => ['90°', '100°', '150°', '60°']),
      correctAnswer: correct,
      tableData: [
        { label: 'Ρυθμός ανά λεπτό', value: '360° : 60 ＝ 6°/λεπτό' },
        { label: 'Χρόνος', value: '20 λεπτά' },
        { label: 'Πράξη', value: '20 · 6° ＝ 120°' },
        { label: 'Είδος γωνίας', value: 'Αμβλεία γωνία' }
      ],
      explanation: `Κάθε λεπτό ο λεπτοδείκτης στρίβει 360° : 60 ＝ 6°. Σε 20 λεπτά: 20 · 6° ＝ 120°.`
    };
  },
  // 6. Ρολόι στις 9:00
  () => {
    const correct = '90°';
    return {
      title: 'ΓΩΝΙΑ ΔΕΙΚΤΩΝ ΣΤΙΣ 9:00',
      prompt: `Στις 9:00 ακριβώς, ποια είναι η μικρότερη (κυρτή) γωνία ανάμεσα στους δείκτες του ρολογιού;`,
      options: ensureFourUniqueOptions(correct, () => ['270°', '120°', '180°', '60°']),
      correctAnswer: correct,
      tableData: [
        { label: 'Απόσταση δεικτών', value: '3 ώρες (από 9 έως 12)' },
        { label: 'Πράξη', value: '3 · 30° ＝ 90°' },
        { label: 'Είδος', value: 'Ορθή γωνία' }
      ],
      explanation: `Από το 9 έως το 12 η απόσταση είναι 3 ώρες. Υπολογίζουμε: 3 · 30° ＝ 90° (ορθή γωνία).`
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα Γωνιών
const PROBLEM_POOL_Q12 = [
  // 1. Τρεις διαδοχικές γωνίες σε ευθεία γραμμή
  () => {
    const a1 = randInt(35, 55);
    const a2 = randInt(45, 65);
    const a3 = 180 - (a1 + a2);
    const correct = `${a3}°`;
    return {
      title: 'ΤΡΕΙΣ ΓΩΝΙΕΣ ΣΕ ΕΥΘΕΙΑ ΓΡΑΜΜΗ',
      prompt: `Πάνω σε μια ευθεία γραμμή σχηματίζονται τρεις διαδοχικές γωνίες με κοινή κορυφή. Αν οι δύο πρώτες είναι ${a1}° και ${a2}°, πόσες μοίρες είναι η τρίτη;`,
      options: ensureFourUniqueOptions(correct, () => [`${a3 + 12}°`, `${a3 - 10}°`, `${180 - a1}°`, `${90 - a2}°`]),
      correctAnswer: correct,
      tableData: [
        { label: 'Συνολικό άθροισμα', value: '180° (Ευθεία γωνία)' },
        { label: 'Άθροισμα 2 πρώτων', value: `${a1}° ＋ ${a2}° ＝ ${a1 + a2}°` },
        { label: 'Πράξη', value: `180° － ${a1 + a2}°` },
        { label: 'Τρίτη γωνία', value: `${a3}°` }
      ],
      explanation: `Το άθροισμα και των τριών είναι 180°. Προσθέτουμε: ${a1}° ＋ ${a2}° ＝ ${a1 + a2}°. Αφαιρούμε: 180° － ${a1 + a2}° ＝ ${a3}°.`
    };
  },
  // 2. Διπλάσια παραπληρωματική
  () => {
    const correct = '120°';
    return {
      title: 'ΣΧΕΣΗ ΔΙΠΛΑΣΙΑΣ ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗΣ',
      prompt: `Δύο γωνίες είναι παραπληρωματικές (άθροισμα 180°) και η μία είναι διπλάσια από την άλλη. Πόσες μοίρες είναι η μεγαλύτερη γωνία;`,
      options: ensureFourUniqueOptions(correct, () => ['60°', '90°', '135°', '100°']),
      correctAnswer: correct,
      tableData: [
        { label: 'Σχέση μερών', value: '1 μέρος (μικρή) ＋ 2 μέρη (μεγάλη) ＝ 3 μέρη' },
        { label: 'Υπολογισμός 1 μέρους', value: '180° : 3 ＝ 60° (μικρή)' },
        { label: 'Μεγαλύτερη γωνία', value: '2 · 60° ＝ 120°' }
      ],
      explanation: `Χωρίζουμε τις 180° σε 3 ίσα μέρη: 180° : 3 ＝ 60°. Η μεγαλύτερη είναι διπλάσια: 2 · 60° ＝ 120°.`
    };
  },
  // 3. Γωνίες γύρω από σημείο (360°)
  () => {
    const a1 = 110;
    const a2 = 85;
    const a3 = 70;
    const a4 = 360 - (a1 + a2 + a3); // 95
    const correct = `${a4}°`;
    return {
      title: 'ΓΩΝΙΕΣ ΓΥΡΩ ΑΠΟ ΕΝΑ ΣΗΜΕΙΟ',
      prompt: `Τέσσερις γωνίες έχουν κοινή κορυφή και καλύπτουν ολόκληρο τον κύκλο (πλήρης γωνία 360°). Αν οι τρεις είναι 110°, 85° και 70°, πόσο μετράει η τέταρτη;`,
      options: ensureFourUniqueOptions(correct, () => ['85°', '105°', '90°', '100°']),
      correctAnswer: correct,
      tableData: [
        { label: 'Πλήρης κύκλος', value: '360°' },
        { label: 'Άθροισμα 3 γωνιών', value: `110° ＋ 85° ＋ 70° ＝ 265°` },
        { label: 'Πράξη', value: `360° － 265°` },
        { label: 'Τέταρτη γωνία', value: `${a4}°` }
      ],
      explanation: `Όλες οι γωνίες γύρω από σημείο έχουν άθροισμα 360°: 360° － 265° ＝ 95°.`
    };
  },
  // 4. Συμπληρωματικές με δοσμένη διαφορά
  () => {
    const diff = 20;
    const larger = (90 + diff) / 2; // 55
    const correct = `${larger}°`;
    return {
      title: 'ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ ΜΕ ΔΙΑΦΟΡΑ',
      prompt: `Δύο γωνίες είναι συμπληρωματικές (άθροισμα 90°) και η μία είναι κατά ${diff}° μεγαλύτερη από την άλλη. Πόσες μοίρες είναι η μεγαλύτερη γωνία;`,
      options: ensureFourUniqueOptions(correct, () => ['35°', '45°', '65°', '50°']),
      correctAnswer: correct,
      tableData: [
        { label: 'Άθροισμα γωνιών', value: '90°' },
        { label: 'Διαφορά γωνιών', value: `${diff}°` },
        { label: 'Τύπος μεγαλύτερης', value: `(90° ＋ ${diff}°) : 2 ＝ 110° : 2` },
        { label: 'Μεγαλύτερη γωνία', value: `${larger}°` }
      ],
      explanation: `Όταν γνωρίζουμε άθροισμα και διαφορά: (90° ＋ 20°) : 2 ＝ 110° : 2 ＝ 55°. (Η μικρή είναι 35°).`
    };
  },
  // 5. Διαδοχικές στροφές ρομπότ
  () => {
    const turns = randInt(3, 5);
    const total = turns * 90;
    const correct = `${total}°`;
    return {
      title: 'ΣΥΝΟΛΙΚΗ ΠΕΡΙΣΤΡΟΦΗ ΡΟΜΠΟΤ',
      prompt: `Ένα ρομπότ προγραμματίζεται να στρίψει δεξιά κατά μία ορθή γωνία (90°) ακριβώς ${turns} διαδοχικές φορές. Πόσες μοίρες είναι η συνολική στροφή του;`,
      options: ensureFourUniqueOptions(correct, () => [`${total + 90}°`, `${total - 90}°`, `${turns * 45}°`, `${total + 45}°`]),
      correctAnswer: correct,
      tableData: [
        { label: 'Στροφή ανά φορά', value: '90°' },
        { label: 'Φορές', value: `${turns}` },
        { label: 'Πράξη', value: `${turns} · 90°` },
        { label: 'Συνολική περιστροφή', value: `${total}°` }
      ],
      explanation: `Κάθε ορθή γωνία είναι 90°. Για ${turns} στροφές: ${turns} · 90° ＝ ${total}°.`
    };
  },
  // 6. Τριπλάσια παραπληρωματική
  () => {
    // a + 3a = 180 => 4a = 180 => a = 45, 3a = 135
    const correct = '135°';
    return {
      title: 'ΤΡΙΠΛΑΣΙΑ ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ',
      prompt: `Δύο γωνίες είναι παραπληρωματικές (άθροισμα 180°) και η μία είναι τριπλάσια από την άλλη. Πόσες μοίρες είναι η μεγαλύτερη γωνία;`,
      options: ensureFourUniqueOptions(correct, () => ['45°', '90°', '120°', '150°']),
      correctAnswer: correct,
      tableData: [
        { label: 'Σχέση μερών', value: '1 μέρος ＋ 3 μέρη ＝ 4 μέρη' },
        { label: 'Υπολογισμός 1 μέρους', value: '180° : 4 ＝ 45° (μικρή)' },
        { label: 'Μεγαλύτερη γωνία', value: '3 · 45° ＝ 135°' }
      ],
      explanation: `Χωρίζουμε τις 180° σε 4 ίσα μέρη: 180° : 4 ＝ 45°. Η μεγαλύτερη είναι τριπλάσια: 3 · 45° ＝ 135°.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Έννοια γωνίας & μήκος πλευρών (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΜΕΓΕΘΟΣ ΓΩΝΙΑΣ ΚΑΙ ΠΛΕΥΡΕΣ',
    prompt: isQ1True
      ? 'Το μέγεθος μιας γωνίας εξαρτάται αποκλειστικά από το άνοιγμα των πλευρών της και όχι από το μήκος με το οποίο τις σχεδιάζουμε.'
      : 'Μια γωνία γίνεται μεγαλύτερη αν μεγαλώσουμε το μήκος των γραμμών που παριστάνουν τις πλευρές της.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Ιδιότητα πλευρών', value: 'Οι πλευρές είναι ημιευθείες (άπειρο μήκος)' },
      { label: 'Μέγεθος γωνίας', value: 'Καθορίζεται μόνο από το άνοιγμα (μοίρες)' },
      { label: 'Σχεδιασμός', value: 'Το μήκος των γραμμών στο χαρτί δεν αλλάζει το άνοιγμα' }
    ],
    explanation: isQ1True
      ? 'ΣΩΣΤΟ: Το μέγεθος μιας γωνίας καθορίζεται μόνο από το άνοιγμα των πλευρών της (μοίρες). Το μήκος των γραμμών δεν επηρεάζει τη γωνία.'
      : 'ΛΑΘΟΣ: Οι πλευρές μιας γωνίας είναι ημιευθείες. Το μέγεθος εξαρτάται αποκλειστικά από το άνοιγμα και όχι από το μήκος σχεδίασης.'
  });

  // Q2: Μέτρο ορθής γωνίας (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΜΕΤΡΟ ΟΡΘΗΣ ΓΩΝΙΑΣ',
    prompt: 'Πόσες μοίρες είναι ακριβώς μια ορθή γωνία;',
    options: ensureFourUniqueOptions('90°', () => ['45°', '180°', '360°', '60°']),
    correctAnswer: '90°',
    tableData: [
      { label: 'Είδος', value: 'Ορθή γωνία' },
      { label: 'Μέτρο σε μοίρες', value: '90°' },
      { label: 'Σχέση πλευρών', value: 'Κάθετες μεταξύ τους' }
    ],
    explanation: 'Μια ορθή γωνία είναι ακριβώς 90°. Οι πλευρές της είναι κάθετες μεταξύ τους.'
  });

  // Q3: Ταξινόμηση αμβλείας γωνίας (MCQ)
  const ambDeg = randInt(95, 160);
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΤΑΞΙΝΟΜΗΣΗ ΓΩΝΙΑΣ',
    prompt: `Μια γωνία μετρήθηκε με το μοιρογνωμόνιο και βρέθηκε ίση με ${ambDeg}°. Τι είδος γωνίας είναι;`,
    options: ensureFourUniqueOptions('Αμβλεία γωνία', () => [
      'Οξεία γωνία',
      'Ορθή γωνία',
      'Ευθεία γωνία'
    ]),
    correctAnswer: 'Αμβλεία γωνία',
    tableData: [
      { label: 'Μέτρο', value: `${ambDeg}°` },
      { label: 'Κανόνας', value: '90° ＜ μέτρο ＜ 180°' },
      { label: 'Κατηγορία', value: 'Αμβλεία' }
    ],
    explanation: `Επειδή ${ambDeg}° ＞ 90° και ${ambDeg}° ＜ 180°, η γωνία είναι αμβλεία.`
  });

  // Q4: Οπτική αναγνώριση γωνίας (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΑΝΑΓΝΩΡΙΣΗ ΣΧΗΜΑΤΟΣ ΓΩΝΙΑΣ',
    prompt: 'Παρατηρήστε το παρακάτω σχήμα. Τι είδος γωνίας απεικονίζεται;',
    svg: (
      <svg viewBox="0 0 180 120" className="w-44 h-28 mx-auto my-2 select-none drop-shadow-sm">
        <line x1="20" y1="100" x2="160" y2="100" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="100" x2="110" y2="25" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
        <path d="M 55 100 A 35 35 0 0 0 45 79" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="20" cy="100" r="4.5" fill="#e11d48" />
      </svg>
    ),
    options: ensureFourUniqueOptions('Οξεία γωνία', () => [
      'Ορθή γωνία',
      'Αμβλεία γωνία',
      'Ευθεία γωνία'
    ]),
    correctAnswer: 'Οξεία γωνία',
    tableData: [
      { label: 'Σχήμα', value: 'Άνοιγμα μικρότερο από ορθή γωνία (＜ 90°)' },
      { label: 'Είδος', value: 'Οξεία γωνία' }
    ],
    explanation: 'Το άνοιγμα των δύο πλευρών είναι σαφώς μικρότερο από 90° (ορθή γωνία), επομένως το σχήμα παριστάνει οξεία γωνία.'
  });

  // Q5: Υπολογισμός συμπληρώματος (Input αριθμού)
  const angleQ5 = randInt(25, 75);
  const compQ5 = 90 - angleQ5;
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΣΥΜΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ',
    prompt: `Μια γωνία είναι ${angleQ5}°. Πόσες μοίρες είναι η συμπληρωματική της γωνία; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(compQ5),
    tableData: [
      { label: 'Αρχική γωνία', value: `${angleQ5}°` },
      { label: 'Άθροισμα συμπληρωματικών', value: '90°' },
      { label: 'Πράξη', value: `90° － ${angleQ5}° ＝ ${compQ5}°` }
    ],
    explanation: `Δύο γωνίες είναι συμπληρωματικές όταν το άθροισμά τους είναι 90°. Υπολογίζουμε: 90° － ${angleQ5}° ＝ ${compQ5}°.`
  });

  // Q6: Υπολογισμός παραπληρώματος (Input αριθμού)
  const angleQ6 = randInt(50, 130);
  const suppQ6 = 180 - angleQ6;
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ',
    prompt: `Μια γωνία έχει μέτρο ${angleQ6}°. Πόσες μοίρες είναι η παραπληρωματική της γωνία; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(suppQ6),
    tableData: [
      { label: 'Αρχική γωνία', value: `${angleQ6}°` },
      { label: 'Άθροισμα παραπληρωματικών', value: '180°' },
      { label: 'Πράξη', value: `180° － ${angleQ6}° ＝ ${suppQ6}°` }
    ],
    explanation: `Δύο γωνίες είναι παραπληρωματικές όταν έχουν άθροισμα 180°. Υπολογίζουμε: 180° － ${angleQ6}° ＝ ${suppQ6}°.`
  });

  // Q7: Μέτρο ευθείας γωνίας (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΜΕΤΡΟ ΕΥΘΕΙΑΣ ΓΩΝΙΑΣ',
    prompt: 'Πόσες μοίρες ισούται μία ευθεία γωνία;',
    options: ensureFourUniqueOptions('180°', () => ['90°', '360°', '270°', '100°']),
    correctAnswer: '180°',
    tableData: [
      { label: 'Είδος', value: 'Ευθεία γωνία' },
      { label: 'Μέτρο σε μοίρες', value: '180°' },
      { label: 'Ισοδυναμία', value: '2 ορθές γωνίες (2 · 90° ＝ 180°)' }
    ],
    explanation: 'Μία ευθεία γωνία ισούται με 180°. Αποτελείται από δύο αντικείμενες ημιευθείες και ισοδυναμεί με δύο ορθές γωνίες.'
  });

  // Q8: Δείκτες ρολογιού στις 6:00 (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΔΕΙΚΤΕΣ ΡΟΛΟΓΙΟΥ ΣΤΙΣ 6:00',
    prompt: 'Όταν ένα ρολόι δείχνει ακριβώς 6:00, τι είδους γωνία σχηματίζουν οι δείκτες του;',
    options: ensureFourUniqueOptions('Ευθεία γωνία (180°)', () => [
      'Ορθή γωνία (90°)',
      'Οξεία γωνία (60°)',
      'Πλήρης γωνία (360°)'
    ]),
    correctAnswer: 'Ευθεία γωνία (180°)',
    tableData: [
      { label: 'Ώρα', value: '6:00' },
      { label: 'Θέσεις δεικτών', value: 'Ο λεπτοδείκτης στο 12, ο ωροδείκτης στο 6' },
      { label: 'Μορφή', value: 'Σχηματίζουν μία ευθεία γραμμή (180°)' }
    ],
    explanation: 'Στις 6:00 ο ωροδείκτης δείχνει προς τα κάτω (στο 6) και ο λεπτοδείκτης προς τα πάνω (στο 12). Σχηματίζουν ευθεία γραμμή, δηλαδή ευθεία γωνία 180°.'
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

export default function GoniesAskiseisPage() {
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
      title="Ασκήσεις: Μέτρηση &amp; Σύγκριση Γωνιών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στη μέτρηση και σύγκριση γωνιών, τα είδη γωνιών και τις συμπληρωματικές/παραπληρωματικές σχέσεις για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/68-gonies"
      backText="Θεωρία Κεφ. 68"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/68-gonies"
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
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 68 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Μετρηση και Συγκριση Γωνιων')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στα είδη των γωνιών, τη χρήση του μοιρογνωμονίου, τις συμπληρωματικές και τις παραπληρωματικές γωνίες μέσα από 12 δυναμικές ερωτήσεις.
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

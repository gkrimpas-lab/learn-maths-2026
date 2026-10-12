// pages/st-dimotikou/69-athroisma-gonion-ask.js
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

// POOL ΓΙΑ Q9: Τρίγωνα - Εύρεση 3ης Γωνίας
const PROBLEM_POOL_Q9 = [
  // 1. Γενικό τρίγωνο με 2 γνωστές γωνίες
  () => {
    const a = randInt(35, 75);
    const b = randInt(30, 65);
    const c = 180 - (a + b);
    const correct = `${c}°`;
    return {
      title: 'ΤΡΙΤΗ ΓΩΝΙΑ ΤΡΙΓΩΝΟΥ',
      prompt: `Σε ένα τρίγωνο ΑΒΓ γνωρίζουμε ότι η γωνία Â είναι ${a}° και η γωνία B̂ είναι ${b}°. Πόσες μοίρες είναι η τρίτη γωνία Γ̂;`,
      options: ensureFourUniqueOptions(correct, () => [`${c + 10}°`, `${c - 10}°`, `${180 - a}°`, `${90 - b}°`]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Συνολικό άθροισμα', value: '180°' },
        { label: 'Άθροισμα 2 γωνιών', value: `${a}° ＋ ${b}° ＝ ${a + b}°` },
        { label: 'Πράξη', value: `180° － ${a + b}°` },
        { label: 'Γωνία Γ̂', value: `${c}°` }
      ],
      explanation: `Σε κάθε τρίγωνο το άθροισμα των γωνιών είναι 180°. Προσθέτουμε τις δύο γνωστές: ${a}° ＋ ${b}° ＝ ${a + b}°. Αφαιρούμε: 180° － ${a + b}° ＝ ${c}°.`
    };
  },
  // 2. Ορθογώνιο τρίγωνο
  () => {
    const a = randInt(25, 68);
    const b = 90 - a;
    const correct = `${b}°`;
    return {
      title: 'ΟΞΕΙΑ ΓΩΝΙΑ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ',
      prompt: `Ένα τρίγωνο είναι ορθογώνιο (έχει μία γωνία 90°). Αν η μία οξεία γωνία του μετράει ${a}°, πόσες μοίρες είναι η άλλη οξεία γωνία του;`,
      options: ensureFourUniqueOptions(correct, () => [`${b + 12}°`, `${b - 10}°`, `${180 - a}°`, `${a + 15}°`]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Είδος τριγώνου', value: 'Ορθογώνιο (μία γωνία 90°)' },
        { label: 'Άθροισμα οξειών', value: '180° － 90° ＝ 90° (συμπληρωματικές)' },
        { label: 'Πράξη', value: `90° － ${a}°` },
        { label: 'Άλλη οξεία', value: `${b}°` }
      ],
      explanation: `Στο ορθογώνιο τρίγωνο οι δύο οξείες γωνίες έχουν άθροισμα 90° (συμπληρωματικές). Υπολογίζουμε: 90° － ${a}° ＝ ${b}°.`
    };
  },
  // 3. Τριγωνική πινακίδα
  () => {
    const a = randInt(45, 70);
    const b = randInt(50, 75);
    const c = 180 - (a + b);
    const correct = `${c}°`;
    return {
      title: 'ΓΩΝΙΑ ΤΡΙΓΩΝΙΚΗΣ ΠΙΝΑΚΙΔΑΣ',
      prompt: `Μια τριγωνική πινακίδα σήμανσης έχει δύο γωνίες με μέτρα ${a}° και ${b}°. Πόσο είναι το μέτρο της τρίτης γωνίας της πινακίδας;`,
      options: ensureFourUniqueOptions(correct, () => [`${c + 15}°`, `${c - 15}°`, `${180 - b}°`, `${a + b}°`]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Σχήμα', value: 'Τρίγωνο' },
        { label: 'Άθροισμα γωνιών', value: '180°' },
        { label: 'Πράξη', value: `180° － (${a}° ＋ ${b}°) ＝ 180° － ${a + b}°` },
        { label: 'Τρίτη γωνία', value: `${c}°` }
      ],
      explanation: `180° － (${a}° ＋ ${b}°) ＝ 180° － ${a + b}° ＝ ${c}°.`
    };
  },
  // 4. Αμβλυγώνιο τρίγωνο
  () => {
    const obtuse = randInt(100, 130);
    const acute1 = randInt(15, 35);
    const acute2 = 180 - (obtuse + acute1);
    const correct = `${acute2}°`;
    return {
      title: 'ΑΜΒΛΥΓΩΝΙΟ ΤΡΙΓΩΝΟ',
      prompt: `Ένα αμβλυγώνιο τρίγωνο έχει μια αμβλεία γωνία ${obtuse}° και μία οξεία γωνία ${acute1}°. Πόσες μοίρες είναι η άλλη οξεία γωνία;`,
      options: ensureFourUniqueOptions(correct, () => [`${acute2 + 8}°`, `${acute2 - 8}°`, `${90 - acute1}°`, `${obtuse - acute1}°`]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Αμβλεία γωνία', value: `${obtuse}°` },
        { label: 'Πρώτη οξεία', value: `${acute1}°` },
        { label: 'Πράξη', value: `180° － (${obtuse}° ＋ ${acute1}°)` },
        { label: 'Δεύτερη οξεία', value: `${acute2}°` }
      ],
      explanation: `180° － (${obtuse}° ＋ ${acute1}°) ＝ 180° － ${obtuse + acute1}° ＝ ${acute2}°.`
    };
  },
  // 5. Ισοσκελές ορθογώνιο τρίγωνο
  () => {
    const correct = '45°';
    return {
      title: 'ΙΣΟΣΚΕΛΕΣ ΟΡΘΟΓΩΝΙΟ ΤΡΙΓΩΝΟ',
      prompt: `Σε ένα ισοσκελές ορθογώνιο τρίγωνο, η ορθή γωνία είναι 90° και οι δύο άλλες γωνίες είναι ίσες μεταξύ τους. Πόσες μοίρες είναι καθεμία από αυτές;`,
      options: ensureFourUniqueOptions(correct, () => ['30°', '60°', '50°', '40°']),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Ορθή γωνία', value: '90°' },
        { label: 'Υπόλοιπο για τις 2 ίσες', value: '180° － 90° ＝ 90°' },
        { label: 'Πράξη', value: '90° : 2' },
        { label: 'Κάθε οξεία γωνία', value: '45°' }
      ],
      explanation: `Οι δύο οξείες γωνίες είναι ίσες και έχουν άθροισμα 90°: 90° : 2 ＝ 45°.`
    };
  },
  // 6. Τριγωνικό ιστίο
  () => {
    const a = randInt(40, 60);
    const b = randInt(45, 65);
    const c = 180 - (a + b);
    const correct = `${c}°`;
    return {
      title: 'ΓΩΝΙΑ ΤΡΙΓΩΝΙΚΟΥ ΙΣΤΙΟΥ',
      prompt: `Το τριγωνικό πανί ενός ιστιοφόρου έχει δύο γωνίες ${a}° και ${b}°. Πόσο μετράει η γωνία στην κορυφή του καταρτιού;`,
      options: ensureFourUniqueOptions(correct, () => [`${c + 12}°`, `${c - 10}°`, `${180 - a}°`, `${90 - b + 10}°`]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Άθροισμα γωνιών', value: '180°' },
        { label: 'Γνωστές γωνίες', value: `${a}° και ${b}°` },
        { label: 'Πράξη', value: `180° － (${a}° ＋ ${b}°)` },
        { label: 'Γωνία κορυφής', value: `${c}°` }
      ],
      explanation: `180° － (${a}° ＋ ${b}°) ＝ 180° － ${a + b}° ＝ ${c}°.`
    };
  }
];

// POOL ΓΙΑ Q10: Ισοσκελή & Ισόπλευρα Τρίγωνα
const PROBLEM_POOL_Q10 = [
  // 1. Ισοσκελές με δοσμένη γωνία κορυφής
  () => {
    const topA = randInt(40, 80);
    const baseA = (180 - topA) / 2;
    // Εξασφάλιση ακεραίου
    const actualTop = topA % 2 === 0 ? topA : topA + 1;
    const actualBase = (180 - actualTop) / 2;
    const correct = `${actualBase}°`;
    return {
      title: 'ΓΩΝΙΕΣ ΒΑΣΗΣ ΙΣΟΣΚΕΛΟΥΣ ΤΡΙΓΩΝΟΥ',
      prompt: `Σε ένα ισοσκελές τρίγωνο η γωνία της κορυφής είναι ${actualTop}°. Πόσες μοίρες είναι καθεμία από τις δύο ίσες γωνίες της βάσης του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${actualBase + 10}°`,
        `${actualBase - 10}°`,
        `${180 - actualTop}°`,
        `${actualBase + 15}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Γωνία κορυφής', value: `${actualTop}°` },
        { label: 'Άθροισμα 2 γωνιών βάσης', value: `180° － ${actualTop}° ＝ ${180 - actualTop}°` },
        { label: 'Πράξη', value: `${180 - actualTop}° : 2` },
        { label: 'Κάθε γωνία βάσης', value: `${actualBase}°` }
      ],
      explanation: `Οι γωνίες της βάσης είναι ίσες: (180° － ${actualTop}°) : 2 ＝ ${180 - actualTop}° : 2 ＝ ${actualBase}°.`
    };
  },
  // 2. Ισοσκελές με δοσμένη γωνία βάσης
  () => {
    const baseA = randInt(35, 75);
    const topA = 180 - 2 * baseA;
    const correct = `${topA}°`;
    return {
      title: 'ΓΩΝΙΑ ΚΟΡΥΦΗΣ ΙΣΟΣΚΕΛΟΥΣ ΤΡΙΓΩΝΟΥ',
      prompt: `Σε ένα ισοσκελές τρίγωνο μία από τις γωνίες της βάσης του είναι ${baseA}°. Πόσες μοίρες είναι η γωνία της κορυφής του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${topA + 15}°`,
        `${topA - 15}°`,
        `${180 - baseA}°`,
        `${2 * baseA}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Γωνίες βάσης (ίσες)', value: `2 · ${baseA}° ＝ ${2 * baseA}°` },
        { label: 'Συνολικό άθροισμα', value: '180°' },
        { label: 'Πράξη', value: `180° － ${2 * baseA}°` },
        { label: 'Γωνία κορυφής', value: `${topA}°` }
      ],
      explanation: `Οι 2 γωνίες της βάσης είναι ίσες (2 · ${baseA}° ＝ ${2 * baseA}°). Αφαιρούμε από το 180°: 180° － ${2 * baseA}° ＝ ${topA}°.`
    };
  },
  // 3. Ισόπλευρο τρίγωνο
  () => {
    const correct = '60°';
    return {
      title: 'ΓΩΝΙΕΣ ΙΣΟΠΛΕΥΡΟΥ ΤΡΙΓΩΝΟΥ',
      prompt: `Ένα τρίγωνο έχει και τις 3 πλευρές του ίσες (ισόπλευρο τρίγωνο). Πόσες μοίρες είναι καθεμία από τις γωνίες του;`,
      options: ensureFourUniqueOptions(correct, () => ['45°', '90°', '50°', '75°']),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Σχήμα', value: 'Ισόπλευρο τρίγωνο (3 ίσες γωνίες)' },
        { label: 'Άθροισμα γωνιών', value: '180°' },
        { label: 'Πράξη', value: '180° : 3' },
        { label: 'Κάθε γωνία', value: '60°' }
      ],
      explanation: `Στο ισόπλευρο τρίγωνο όλες οι γωνίες είναι ίσες: 180° : 3 ＝ 60°.`
    };
  },
  // 4. Σκεπή σπιτιού (ισοσκελές)
  () => {
    const baseA = randInt(30, 50);
    const topA = 180 - 2 * baseA;
    const correct = `${topA}°`;
    return {
      title: 'ΚΛΙΣΗ ΣΤΕΓΗΣ ΣΠΙΤΙΟΥ',
      prompt: `Μια τριγωνική ισοσκελής στέγη έχει γωνία κλίσης ${baseA}° σε καθεμία από τις δύο πλευρές της βάσης της. Πόση είναι η γωνία που σχηματίζεται στον κορφιά (στην κορυφή);`,
      options: ensureFourUniqueOptions(correct, () => [
        `${topA + 10}°`,
        `${topA - 10}°`,
        `${baseA * 2}°`,
        `${180 - baseA}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Γωνίες βάσης', value: `${baseA}° και ${baseA}°` },
        { label: 'Άθροισμα βάσης', value: `${2 * baseA}°` },
        { label: 'Πράξη', value: `180° － ${2 * baseA}°` },
        { label: 'Γωνία κορυφής', value: `${topA}°` }
      ],
      explanation: `180° － (${baseA}° ＋ ${baseA}°) ＝ 180° － ${2 * baseA}° ＝ ${topA}°.`
    };
  },
  // 5. Ισοσκελές με γωνία κορυφής 100° (αμβλυγώνιο)
  () => {
    const correct = '40°';
    return {
      title: 'ΑΜΒΛΥΓΩΝΙΟ ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ',
      prompt: `Σε ένα ισοσκελές τρίγωνο η γωνία της κορυφής είναι αμβλεία και μετράει 100°. Πόσες μοίρες είναι καθεμία από τις γωνίες της βάσης;`,
      options: ensureFourUniqueOptions(correct, () => ['50°', '35°', '45°', '80°']),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Γωνία κορυφής', value: '100°' },
        { label: 'Υπόλοιπο για τις 2 ίσες', value: '180° － 100° ＝ 80°' },
        { label: 'Πράξη', value: '80° : 2' },
        { label: 'Κάθε γωνία βάσης', value: '40°' }
      ],
      explanation: `(180° － 100°) : 2 ＝ 80° : 2 ＝ 40°.`
    };
  },
  // 6. Ισοσκελές με γωνία κορυφής 40°
  () => {
    const correct = '70°';
    return {
      title: 'ΟΞΥΓΩΝΙΟ ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ',
      prompt: `Σε ένα ισοσκελές τρίγωνο η γωνία της κορυφής είναι 40°. Πόσες μοίρες είναι καθεμία από τις δύο γωνίες της βάσης;`,
      options: ensureFourUniqueOptions(correct, () => ['60°', '80°', '75°', '65°']),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Γωνία κορυφής', value: '40°' },
        { label: 'Υπόλοιπο βάσης', value: '180° － 40° ＝ 140°' },
        { label: 'Πράξη', value: '140° : 2' },
        { label: 'Κάθε γωνία βάσης', value: '70°' }
      ],
      explanation: `(180° － 40°) : 2 ＝ 140° : 2 ＝ 70°.`
    };
  }
];

// POOL ΓΙΑ Q11: Τετράπλευρα - Εύρεση 4ης Γωνίας (Άθροισμα 360°)
const PROBLEM_POOL_Q11 = [
  // 1. Γενικό τετράπλευρο με 3 γνωστές γωνίες
  () => {
    const a = randInt(70, 110);
    const b = randInt(75, 115);
    const c = randInt(65, 105);
    const d = 360 - (a + b + c);
    const correct = `${d}°`;
    return {
      title: 'ΤΕΤΑΡΤΗ ΓΩΝΙΑ ΤΕΤΡΑΠΛΕΥΡΟΥ',
      prompt: `Ένα τετράπλευρο έχει τρεις γωνίες ίσες με ${a}°, ${b}° και ${c}°. Πόσες μοίρες είναι η τέταρτη γωνία του;`,
      options: ensureFourUniqueOptions(correct, () => [`${d + 12}°`, `${d - 10}°`, `${180 - a}°`, `${360 - a - b}°`]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Συνολικό άθροισμα', value: '360°' },
        { label: 'Άθροισμα 3 γωνιών', value: `${a}° ＋ ${b}° ＋ ${c}° ＝ ${a + b + c}°` },
        { label: 'Πράξη', value: `360° － ${a + b + c}°` },
        { label: 'Τέταρτη γωνία', value: `${d}°` }
      ],
      explanation: `Σε κάθε τετράπλευρο το άθροισμα είναι 360°. Προσθέτουμε τις τρεις γνωστές (${a + b + c}°) και αφαιρούμε: 360° － ${a + b + c}° ＝ ${d}°.`
    };
  },
  // 2. Τετράπλευρο οικόπεδο με μία ορθή
  () => {
    const b = randInt(85, 125);
    const c = randInt(70, 100);
    const d = 360 - (90 + b + c);
    const correct = `${d}°`;
    return {
      title: 'ΓΩΝΙΑ ΤΕΤΡΑΠΛΕΥΡΟΥ ΟΙΚΟΠΕΔΟΥ',
      prompt: `Ένα οικόπεδο σχήματος τετραπλεύρου έχει μία ορθή γωνία (90°) και άλλες δύο γωνίες ${b}° και ${c}°. Πόσες μοίρες είναι η τέταρτη γωνία του οικοπέδου;`,
      options: ensureFourUniqueOptions(correct, () => [`${d + 15}°`, `${d - 15}°`, `${180 - b}°`, `${d + 10}°`]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Συνολικό άθροισμα', value: '360°' },
        { label: 'Άθροισμα 3 γωνιών', value: `90° ＋ ${b}° ＋ ${c}° ＝ ${90 + b + c}°` },
        { label: 'Πράξη', value: `360° － ${90 + b + c}°` },
        { label: 'Τέταρτη γωνία', value: `${d}°` }
      ],
      explanation: `360° － (90° ＋ ${b}° ＋ ${c}°) ＝ 360° － ${90 + b + c}° ＝ ${d}°.`
    };
  },
  // 3. Ορθογώνιο τραπέζιο (2 ορθές)
  () => {
    const acute = randInt(45, 80);
    const obtuse = 180 - acute; // Σε ορθογώνιο τραπέζιο: 90 + 90 + acute + obtuse = 360 => acute + obtuse = 180
    const correct = `${obtuse}°`;
    return {
      title: 'ΟΡΘΟΓΩΝΙΟ ΤΡΑΠΕΖΙΟ',
      prompt: `Ένα ορθογώνιο τραπέζιο έχει δύο ορθές γωνίες (90° και 90°) και μία οξεία γωνία ${acute}°. Πόσες μοίρες είναι η τέταρτη (αμβλεία) γωνία του;`,
      options: ensureFourUniqueOptions(correct, () => [`${obtuse + 10}°`, `${obtuse - 10}°`, `${acute + 45}°`, `${360 - acute}°`]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Δύο ορθές γωνίες', value: '90° ＋ 90° ＝ 180°' },
        { label: 'Σύνολο τριών', value: `180° ＋ ${acute}° ＝ ${180 + acute}°` },
        { label: 'Πράξη', value: `360° － ${180 + acute}°` },
        { label: 'Τέταρτη γωνία', value: `${obtuse}°` }
      ],
      explanation: `360° － (90° ＋ 90° ＋ ${acute}°) ＝ 360° － ${180 + acute}° ＝ ${obtuse}°.`
    };
  },
  // 4. Τετράπλευρο με 2 ίσες γωνίες
  () => {
    const a = 110;
    const b = 70;
    // 360 - 180 = 180 => οι άλλες 2 έχουν άθροισμα 180. Αν είναι ίσες: 90 καθεμία
    const correct = '90°';
    return {
      title: 'ΤΕΤΡΑΠΛΕΥΡΟ ΜΕ ΙΣΕΣ ΓΩΝΙΕΣ',
      prompt: `Σε ένα τετράπλευρο οι δύο γωνίες είναι 110° και 70°, ενώ οι άλλες δύο γωνίες είναι ίσες μεταξύ τους. Πόσες μοίρες είναι καθεμία από τις δύο ίσες γωνίες;`,
      options: ensureFourUniqueOptions(correct, () => ['80°', '85°', '95°', '100°']),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Άθροισμα 2 γνωστών', value: '110° ＋ 70° ＝ 180°' },
        { label: 'Υπόλοιπο για τις άλλες 2', value: '360° － 180° ＝ 180°' },
        { label: 'Πράξη', value: '180° : 2' },
        { label: 'Κάθε ίση γωνία', value: '90°' }
      ],
      explanation: `Υπόλοιπο: 360° － 180° ＝ 180°. Αφού είναι ίσες: 180° : 2 ＝ 90°.`
    };
  },
  // 5. Τραπέζιο με τρεις γνωστές γωνίες
  () => {
    const a = 120;
    const b = 60;
    const c = 130;
    const d = 360 - (a + b + c); // 50
    const correct = `${d}°`;
    return {
      title: 'ΓΩΝΙΑ ΣΕ ΤΡΑΠΕΖΙΟ',
      prompt: `Σε ένα τραπέζιο οι τρεις γωνίες έχουν μέτρο 120°, 60° και 130°. Πόσο είναι το μέτρο της τέταρτης γωνίας του;`,
      options: ensureFourUniqueOptions(correct, () => ['60°', '45°', '70°', '55°']),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Συνολικό άθροισμα', value: '360°' },
        { label: 'Άθροισμα 3 γωνιών', value: '120° ＋ 60° ＋ 130° ＝ 310°' },
        { label: 'Πράξη', value: '360° － 310°' },
        { label: 'Τέταρτη γωνία', value: `${d}°` }
      ],
      explanation: `360° － 310° ＝ 50°.`
    };
  },
  // 6. Τετράγωνο και ορθογώνιο (4 ίσες γωνίες)
  () => {
    const correct = '90°';
    return {
      title: 'ΤΕΤΡΑΠΛΕΥΡΟ ΜΕ 4 ΙΣΕΣ ΓΩΝΙΕΣ',
      prompt: `Ένα τετράπλευρο έχει και τις 4 γωνίες του ίσες μεταξύ τους (όπως το τετράγωνο και το ορθογώνιο). Πόσες μοίρες είναι καθεμία από τις γωνίες του;`,
      options: ensureFourUniqueOptions(correct, () => ['60°', '80°', '100°', '120°']),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Άθροισμα τετραπλεύρου', value: '360°' },
        { label: 'Πλήθος ίσων γωνιών', value: '4' },
        { label: 'Πράξη', value: '360° : 4' },
        { label: 'Κάθε γωνία', value: '90° (Ορθή)' }
      ],
      explanation: `360° : 4 ＝ 90°. Σε κάθε ισογώνιο τετράπλευρο όλες οι γωνίες είναι ορθές (90°).`
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα Γεωμετρίας (Συνδυασμοί & Διαγώνιοι)
const PROBLEM_POOL_Q12 = [
  // 1. Παραλληλόγραμμο (απέναντι γωνίες ίσες)
  () => {
    const acute = randInt(40, 75);
    const obtuse = 180 - acute;
    const correct = `${obtuse}°`;
    return {
      title: 'ΓΩΝΙΕΣ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΥ',
      prompt: `Σε ένα παραλληλόγραμμο οι δύο απέναντι οξείες γωνίες είναι ίσες με ${acute}° η καθεμία. Πόσες μοίρες είναι καθεμία από τις δύο απέναντι αμβλείες γωνίες του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${obtuse + 10}°`,
        `${obtuse - 10}°`,
        `${360 - 2 * acute}°`,
        `${acute + 60}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Άθροισμα 2 οξειών', value: `2 · ${acute}° ＝ ${2 * acute}°` },
        { label: 'Υπόλοιπο για τις 2 αμβλείες', value: `360° － ${2 * acute}° ＝ ${360 - 2 * acute}°` },
        { label: 'Πράξη', value: `${360 - 2 * acute}° : 2` },
        { label: 'Κάθε αμβλεία γωνία', value: `${obtuse}°` }
      ],
      explanation: `(360° － ${2 * acute}°) : 2 ＝ ${360 - 2 * acute}° : 2 ＝ ${obtuse}°. Επίσης, δύο διαδοχικές γωνίες παραλληλογράμμου έχουν άθροισμα 180°: 180° － ${acute}° ＝ ${obtuse}°.`
    };
  },
  // 2. Ρόμβος με δοσμένη οξεία γωνία
  () => {
    const acute = randInt(45, 70);
    const obtuse = 180 - acute;
    const correct = `${obtuse}°`;
    return {
      title: 'ΓΩΝΙΕΣ ΡΟΜΒΟΥ',
      prompt: `Ένας ρόμβος έχει μία οξεία γωνία ${acute}°. Πόσες μοίρες είναι η διπλανή της (αμβλεία) γωνία;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${obtuse + 15}°`,
        `${obtuse - 15}°`,
        `${90 - acute}°`,
        `${2 * acute}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Σχήμα', value: 'Ρόμβος (παραλληλόγραμμο με 4 ίσες πλευρές)' },
        { label: 'Σχέση διαδοχικών', value: 'Παραπληρωματικές (άθροισμα 180°)' },
        { label: 'Πράξη', value: `180° － ${acute}°` },
        { label: 'Αμβλεία γωνία', value: `${obtuse}°` }
      ],
      explanation: `Στον ρόμβο δύο διαδοχικές γωνίες έχουν άθροισμα 180°: 180° － ${acute}° ＝ ${obtuse}°.`
    };
  },
  // 3. Διαχωρισμός τετραπλεύρου σε 2 τρίγωνα
  () => {
    const correct = '360°';
    return {
      title: 'ΑΠΟΔΕΙΞΗ ΑΘΡΟΙΣΜΑΤΟΣ ΤΕΤΡΑΠΛΕΥΡΟΥ',
      prompt: `Σχεδιάζουμε μία διαγώνιο σε ένα τυχαίο τετράπλευρο, χωρίζοντάς το σε δύο επιμέρους τρίγωνα. Πόσο είναι το συνολικό άθροισμα των γωνιών των δύο αυτών τριγώνων μαζί;`,
      options: ensureFourUniqueOptions(correct, () => ['180°', '270°', '540°', '720°']),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Πλήθος τριγώνων', value: '2 τρίγωνα' },
        { label: 'Άθροισμα ανά τρίγωνο', value: '180°' },
        { label: 'Πράξη', value: '2 · 180°' },
        { label: 'Συνολικό άθροισμα', value: '360°' }
      ],
      explanation: `Κάθε τρίγωνο έχει άθροισμα 180°. Τα δύο τρίγωνα μαζί έχουν: 2 · 180° ＝ 360°, που ισούται ακριβώς με το άθροισμα των γωνιών του τετραπλεύρου.`
    };
  },
  // 4. Ισοσκελές τραπέζιο
  () => {
    const baseA = randInt(55, 75);
    const topA = 180 - baseA;
    const correct = `${topA}°`;
    return {
      title: 'ΙΣΟΣΚΕΛΕΣ ΤΡΑΠΕΖΙΟ',
      prompt: `Σε ένα ισοσκελές τραπέζιο οι δύο γωνίες της κάτω βάσης είναι ίσες με ${baseA}° η καθεμία. Πόσες μοίρες είναι καθεμία από τις δύο γωνίες της επάνω βάσης;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${topA + 10}°`,
        `${topA - 10}°`,
        `${180 - 2 * baseA}°`,
        `${baseA + 40}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Κάτω γωνίες', value: `2 · ${baseA}° ＝ ${2 * baseA}°` },
        { label: 'Υπόλοιπο επάνω', value: `360° － ${2 * baseA}° ＝ ${360 - 2 * baseA}°` },
        { label: 'Πράξη', value: `${360 - 2 * baseA}° : 2` },
        { label: 'Κάθε επάνω γωνία', value: `${topA}°` }
      ],
      explanation: `Στο ισοσκελές τραπέζιο κάθε επάνω γωνία είναι παραπληρωματική της αντίστοιχης κάτω γωνίας: 180° － ${baseA}° ＝ ${topA}°.`
    };
  },
  // 5. Τρίγωνο με σχέση διπλάσιας γωνίας
  () => {
    // A = 90, B + C = 90. Αν B = 2C => 3C = 90 => C = 30, B = 60
    const correct = '60°';
    return {
      title: 'ΣΧΕΣΗ ΓΩΝΙΩΝ ΣΕ ΟΡΘΟΓΩΝΙΟ ΤΡΙΓΩΝΟ',
      prompt: `Σε ένα ορθογώνιο τρίγωνο (μία γωνία 90°), η μία οξεία γωνία είναι διπλάσια από την άλλη. Πόσες μοίρες είναι η μεγαλύτερη οξεία γωνία;`,
      options: ensureFourUniqueOptions(correct, () => ['30°', '45°', '70°', '50°']),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Άθροισμα οξειών', value: '90°' },
        { label: 'Σχέση μερών', value: '1 μέρος (μικρή) ＋ 2 μέρη (μεγάλη) ＝ 3 μέρη' },
        { label: 'Υπολογισμός 1 μέρους', value: '90° : 3 ＝ 30° (μικρή γωνία)' },
        { label: 'Μεγαλύτερη οξεία', value: '2 · 30° ＝ 60°' }
      ],
      explanation: `Οι δύο οξείες έχουν άθροισμα 90°. Χωρίζουμε σε 3 ίσα μέρη: 90° : 3 ＝ 30°. Η μεγαλύτερη είναι 2 · 30° ＝ 60°.`
    };
  },
  // 6. Πεντάγωνο (χωρισμός σε 3 τρίγωνα)
  () => {
    const correct = '540°';
    return {
      title: 'ΑΘΡΟΙΣΜΑ ΓΩΝΙΩΝ ΠΕΝΤΑΓΩΝΟΥ',
      prompt: `Αν ενώσουμε μία κορυφή ενός πενταγώνου με τις υπόλοιπες μη διαδοχικές κορυφές, το πεντάγωνο χωρίζεται σε 3 τρίγωνα. Πόσο είναι το συνολικό άθροισμα των γωνιών του πενταγώνου;`,
      options: ensureFourUniqueOptions(correct, () => ['360°', '450°', '720°', '600°']),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: 'Πλήθος τριγώνων', value: '3 τρίγωνα' },
        { label: 'Άθροισμα ανά τρίγωνο', value: '180°' },
        { label: 'Πράξη', value: '3 · 180°' },
        { label: 'Σύνολο πενταγώνου', value: '540°' }
      ],
      explanation: `Κάθε τρίγωνο έχει άθροισμα 180°. Για 3 τρίγωνα: 3 · 180° ＝ 540°. Επομένως το άθροισμα των γωνιών κάθε πενταγώνου είναι 540°.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Άθροισμα τριγώνου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΑΘΡΟΙΣΜΑ ΓΩΝΙΩΝ ΤΡΙΓΩΝΟΥ',
    prompt: isQ1True
      ? 'Το άθροισμα των τριών εσωτερικών γωνιών σε οποιοδήποτε τρίγωνο ισούται πάντοτε με 180°.'
      : 'Σε ένα μεγάλο τρίγωνο το άθροισμα των γωνιών είναι μεγαλύτερο από 180° επειδή έχει μακρύτερες πλευρές.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Κανόνας', value: 'Â ＋ B̂ ＋ Γ̂ ＝ 180°' },
      { label: 'Ισχύς', value: 'Για όλα ανεξαιρέτως τα τρίγωνα' },
      { label: 'Μήκος πλευρών', value: 'Δεν επηρεάζει το άθροισμα των γωνιών' }
    ],
    explanation: isQ1True
      ? 'ΣΩΣΤΟ: Σε οποιοδήποτε τρίγωνο (μικρό ή μεγάλο, οξυγώνιο, ορθογώνιο ή αμβλυγώνιο), το άθροισμα των γωνιών είναι πάντα αυστηρά 180°.'
      : 'ΛΑΘΟΣ: Το άθροισμα των γωνιών κάθε τριγώνου είναι πάντοτε ακριβώς 180°, ανεξάρτητα από το μέγεθος των πλευρών του.'
  });

  // Q2: Άθροισμα τετραπλεύρου (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΑΘΡΟΙΣΜΑ ΓΩΝΙΩΝ ΤΕΤΡΑΠΛΕΥΡΟΥ',
    prompt: 'Πόσο είναι πάντοτε το άθροισμα των τεσσάρων γωνιών ενός τετραπλεύρου;',
    options: ensureFourUniqueOptions('360°', () => ['180°', '270°', '540°', '400°']),
    correctAnswer: '360°',
    tableData: [
      { label: 'Σχήμα', value: 'Τετράπλευρο' },
      { label: 'Διαχωρισμός', value: 'Χωρίζεται σε 2 τρίγωνα' },
      { label: 'Υπολογισμός', value: '2 · 180° ＝ 360°' }
    ],
    explanation: 'Κάθε τετράπλευρο χωρίζεται από μία διαγώνιο σε δύο τρίγωνα, άρα το άθροισμα των γωνιών του είναι 2 · 180° ＝ 360°.'
  });

  // Q3: Δύο ορθές γωνίες σε τρίγωνο (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΟΡΘΕΣ ΓΩΝΙΕΣ ΣΕ ΤΡΙΓΩΝΟ',
    prompt: 'Μπορεί ένα τρίγωνο να έχει δύο ορθές γωνίες (90° και 90°);',
    options: ensureFourUniqueOptions(
      'Όχι, γιατί δύο ορθές δίνουν ήδη 180° και δεν μένουν μοίρες για την τρίτη γωνία',
      () => [
        'Ναι, αν το τρίγωνο είναι πολύ μεγάλο',
        'Ναι, σε κάθε ορθογώνιο τρίγωνο',
        'Ναι, μόνο αν είναι ισοσκελές'
      ]
    ),
    correctAnswer: 'Όχι, γιατί δύο ορθές δίνουν ήδη 180° και δεν μένουν μοίρες για την τρίτη γωνία',
    tableData: [
      { label: 'Υπόθεση', value: '2 ορθές γωνίες ＝ 90° ＋ 90° ＝ 180°' },
      { label: 'Τρίτη γωνία', value: '180° － 180° ＝ 0° (αδύνατο)' },
      { label: 'Συμπέρασμα', value: 'Ένα τρίγωνο έχει το πολύ μία ορθή γωνία' }
    ],
    explanation: 'Αν δύο γωνίες ήταν 90°, το άθροισμά τους θα ήταν 180°, οπότε η τρίτη γωνία θα έπρεπε να είναι 0°, πράγμα αδύνατο.'
  });

  // Q4: Οπτική αναγνώριση ορθογωνίου τριγώνου (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΑΝΑΓΝΩΡΙΣΗ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ',
    prompt: 'Παρατηρήστε το παρακάτω τρίγωνο. Τι είδους τρίγωνο είναι ως προς τις γωνίες του;',
    svg: (
      <svg viewBox="0 0 160 120" className="w-40 h-28 mx-auto my-2 select-none drop-shadow-sm">
        <polygon points="25,95 135,95 25,25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="25" y="80" width="15" height="15" fill="none" stroke="#e11d48" strokeWidth="2" />
        <circle cx="25" cy="95" r="3.5" fill="#e11d48" />
        <circle cx="135" cy="95" r="3.5" fill="#4f46e5" />
        <circle cx="25" cy="25" r="3.5" fill="#4f46e5" />
      </svg>
    ),
    options: ensureFourUniqueOptions('Ορθογώνιο τρίγωνο', () => [
      'Οξυγώνιο τρίγωνο',
      'Αμβλυγώνιο τρίγωνο',
      'Ισόπλευρο τρίγωνο'
    ]),
    correctAnswer: 'Ορθογώνιο τρίγωνο',
    tableData: [
      { label: 'Χαρακτηριστικό', value: 'Περιέχει μία ορθή γωνία 90° (κόκκινο τετραγωνάκι)' },
      { label: 'Είδος', value: 'Ορθογώνιο τρίγωνο' }
    ],
    explanation: 'Το σύμβολο του τετραγώνου στην κάτω αριστερή κορυφή υποδηλώνει ορθή γωνία (90°), άρα το τρίγωνο είναι ορθογώνιο.'
  });

  // Q5: Υπολογισμός 3ης γωνίας τριγώνου (Input αριθμού)
  const a5 = randInt(45, 65);
  const b5 = randInt(50, 70);
  const c5 = 180 - (a5 + b5);
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΤΡΙΤΗΣ ΓΩΝΙΑΣ ΤΡΙΓΩΝΟΥ',
    prompt: `Σε ένα τρίγωνο οι δύο γωνίες είναι ${a5}° και ${b5}°. Πόσες μοίρες είναι η τρίτη γωνία; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(c5),
    tableData: [
      { label: 'Άθροισμα τριγώνου', value: '180°' },
      { label: 'Άθροισμα 2 γνωστών', value: `${a5}° ＋ ${b5}° ＝ ${a5 + b5}°` },
      { label: 'Πράξη', value: `180° － ${a5 + b5}° ＝ ${c5}°` }
    ],
    explanation: `Αφαιρούμε από το 180° το άθροισμα των δύο γνωστών γωνιών: 180° － (${a5}° ＋ ${b5}°) ＝ ${c5}°.`
  });

  // Q6: Υπολογισμός 4ης γωνίας τετραπλεύρου (Input αριθμού)
  const a6 = randInt(80, 110);
  const b6 = randInt(85, 115);
  const c6 = randInt(70, 95);
  const d6 = 360 - (a6 + b6 + c6);
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΤΕΤΑΡΤΗΣ ΓΩΝΙΑΣ ΤΕΤΡΑΠΛΕΥΡΟΥ',
    prompt: `Σε ένα τετράπλευρο οι τρεις γωνίες είναι ${a6}°, ${b6}° και ${c6}°. Πόσες μοίρες είναι η τέταρτη γωνία του; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(d6),
    tableData: [
      { label: 'Άθροισμα τετραπλεύρου', value: '360°' },
      { label: 'Άθροισμα 3 γνωστών', value: `${a6}° ＋ ${b6}° ＋ ${c6}° ＝ ${a6 + b6 + c6}°` },
      { label: 'Πράξη', value: `360° － ${a6 + b6 + c6}° ＝ ${d6}°` }
    ],
    explanation: `Αφαιρούμε από το 360° το άθροισμα των τριών γνωστών γωνιών: 360° － ${a6 + b6 + c6}° ＝ ${d6}°.`
  });

  // Q7: Γωνίες ισοπλεύρου τριγώνου (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΓΩΝΙΕΣ ΙΣΟΠΛΕΥΡΟΥ ΤΡΙΓΩΝΟΥ',
    prompt: 'Πόσες μοίρες είναι καθεμία από τις τρεις γωνίες ενός ισοπλεύρου τριγώνου;',
    options: ensureFourUniqueOptions('60°', () => ['45°', '90°', '50°', '75°']),
    correctAnswer: '60°',
    tableData: [
      { label: 'Ιδιότητα', value: '3 ίσες πλευρές και 3 ίσες γωνίες' },
      { label: 'Υπολογισμός', value: '180° : 3 ＝ 60°' }
    ],
    explanation: 'Το ισόπλευρο τρίγωνο έχει 3 ίσες γωνίες: 180° : 3 ＝ 60° καθεμία.'
  });

  // Q8: Κατασκευή γωνίας με μοιρογνωμόνιο (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΚΑΤΑΣΚΕΥΗ ΓΩΝΙΑΣ',
    prompt: 'Κατά την κατασκευή μιας γωνίας με το μοιρογνωμόνιο, πού πρέπει να τοποθετήσουμε το κέντρο του οργάνου;',
    options: ensureFourUniqueOptions('Ακριβώς στην κορυφή της γωνίας', () => [
      'Στο μέσο της πρώτης πλευράς',
      'Στο τέλος της πρώτης πλευράς',
      'Σε οποιοδήποτε σημείο του χαρτιού'
    ]),
    correctAnswer: 'Ακριβώς στην κορυφή της γωνίας',
    tableData: [
      { label: 'Κέντρο μοιρογνωμονίου', value: 'Ακριβώς στην κορυφή της γωνίας' },
      { label: 'Γραμμή 0°', value: 'Ευθυγραμμισμένη με την αρχική πλευρά' }
    ],
    explanation: 'Το κέντρο του μοιρογνωμονίου τοποθετείται πάντοτε ακριβώς στην κορυφή της γωνίας, ώστε η μέτρηση των μοιρών να ξεκινήσει σωστά.'
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

export default function AthroismaGonionAskiseisPage() {
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
      title="Ασκήσεις: Άθροισμα Γωνιών Τριγώνου &amp; Τετραπλεύρου - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στην κατασκευή γωνιών και στους κανόνες των 180° και 360° για τρίγωνα και τετράπλευρα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/69-athroisma-gonion"
      backText="Θεωρία Κεφ. 69"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/69-athroisma-gonion"
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
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 69 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Αθροισμα Γωνιων Τριγωνου και Τετραπλευρου')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στην κατασκευή γωνιών και στους κανόνες των 180° και 360° μέσα από 12 δυναμικές ερωτήσεις και πλούσια προβλήματα.
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

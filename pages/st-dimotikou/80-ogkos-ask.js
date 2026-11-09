// pages/st-dimotikou/80-ogkos-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// -------------------------------------------------------------
// DEFENSIVE UTILITY FUNCTIONS & TYPOGRAPHY
// -------------------------------------------------------------

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
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

function formatNum(val, locale = 'el') {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const loc = locale === 'el' ? 'el-GR' : 'en-US';
  return Number(val).toLocaleString(loc, { maximumFractionDigits: 4 });
}

// Διασφάλιση ακριβώς 4 μοναδικών επιλογών για ερωτήσεις MCQ με μαθηματικούς fallback περισπασμούς
function ensureFourUniqueOptions(correctText, distractorsGen) {
  const candidates = distractorsGen();
  const rawList = [String(correctText).trim(), ...candidates.map((c) => String(c).trim())];
  const uniqueOptions = [...new Set(rawList.filter(Boolean))];

  const match = String(correctText).match(/^([0-9.,]+)(.*)$/);
  const baseNum = match ? parseFloat(match[1].replace(/\./g, '').replace(',', '.')) : NaN;
  const unit = match && match[2] ? match[2] : '';

  let offset = 1;
  while (uniqueOptions.length < 4) {
    let fallbackOpt;
    if (!isNaN(baseNum)) {
      const step = baseNum >= 100 ? 50 : baseNum >= 20 ? 10 : 2;
      const generatedNum = offset % 2 === 1
        ? baseNum + Math.ceil(offset / 2) * step
        : Math.max(1, baseNum - Math.ceil(offset / 2) * step);
      fallbackOpt = `${generatedNum}${unit}`;
    } else {
      fallbackOpt = `${correctText} ${offset}`;
    }

    if (!uniqueOptions.includes(fallbackOpt)) {
      uniqueOptions.push(fallbackOpt);
    }
    offset++;
  }

  return shuffle(uniqueOptions.slice(0, 4));
}

// -------------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (POOLS) ΓΙΑ Q9, Q10, Q11, Q12
// -------------------------------------------------------------

// POOL ΓΙΑ Q9: Υπολογισμός Όγκου Κύβου (V ＝ α · α · α)
const PROBLEM_POOL_Q9 = [
  // 1. Κυβικό δοχείο
  (locale) => {
    const isEl = locale === 'el';
    const a = randInt(3, 8);
    const vol = a * a * a;
    const correct = `${formatNum(vol, locale)} cm³`;
    const edgeSym = isEl ? 'α' : 'a';
    return {
      title: isEl ? 'ΟΓΚΟΣ ΚΥΒΙΚΟΥ ΔΟΧΕΙΟΥ' : 'CUBICAL CONTAINER VOLUME',
      prompt: isEl
        ? `Ένα δοχείο έχει σχήμα κύβου με ακμή ${a} cm. Ποιος είναι ο όγκος του σε cm³;`
        : `A container has the shape of a cube with edge length ${a} cm. What is its volume in cm³?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a * a, locale)} cm³`,
        `${formatNum(vol + 20, locale)} cm³`,
        `${formatNum(vol > 20 ? vol - 15 : vol + 35, locale)} cm³`,
        `${formatNum(3 * a, locale)} cm³`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Ακμή κύβου (${edgeSym})` : `Cube edge (${edgeSym})`, value: `${a} cm` },
        { label: isEl ? 'Τύπος όγκου κύβου' : 'Cube volume formula', value: `V ＝ ${edgeSym} · ${edgeSym} · ${edgeSym} ＝ ${edgeSym}³` },
        { label: isEl ? 'Πράξη' : 'Calculation', value: `${a} · ${a} · ${a} ＝ ${formatNum(vol, locale)} cm³` }
      ],
      explanation: isEl
        ? `Ο όγκος του κύβου ισούται με το γινόμενο των τριών διαστάσεών του: V ＝ ${edgeSym} · ${edgeSym} · ${edgeSym} ＝ ${a} · ${a} · ${a} ＝ ${formatNum(vol, locale)} cm³.`
        : `The volume of a cube is the product of its three dimensions: V ＝ ${edgeSym} · ${edgeSym} · ${edgeSym} ＝ ${a} · ${a} · ${a} ＝ ${formatNum(vol, locale)} cm³.`
    };
  },
  // 2. Ξύλινο κυβικό κουτί
  (locale) => {
    const isEl = locale === 'el';
    const a = randInt(10, 20);
    const vol = a * a * a;
    const correct = `${formatNum(vol, locale)} cm³`;
    const edgeSym = isEl ? 'α' : 'a';
    return {
      title: isEl ? 'ΞΥΛΙΝΟΣ ΚΥΒΟΣ' : 'WOODEN CUBE',
      prompt: isEl
        ? `Ένα ξύλινο συμπαγές κουτί σε σχήμα κύβου έχει ακμή ${a} cm. Πόσο είναι το μέγεθος του όγκου του σε cm³;`
        : `A solid wooden box in the shape of a cube has edge length ${a} cm. What is its volume in cm³?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a * a, locale)} cm³`,
        `${formatNum(vol + 200, locale)} cm³`,
        `${formatNum(vol > 200 ? vol - 200 : vol + 400, locale)} cm³`,
        `${formatNum(6 * a * a, locale)} cm³`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Ακμή (${edgeSym})` : `Edge (${edgeSym})`, value: `${a} cm` },
        { label: isEl ? 'Υπολογισμός' : 'Calculation', value: `${a} · ${a} · ${a} ＝ ${formatNum(vol, locale)} cm³` }
      ],
      explanation: isEl
        ? `V ＝ ${edgeSym}³ ＝ ${a} · ${a} · ${a} ＝ ${formatNum(vol, locale)} cm³.`
        : `V ＝ ${edgeSym}³ ＝ ${a} · ${a} · ${a} ＝ ${formatNum(vol, locale)} cm³.`
    };
  },
  // 3. Μεγάλη κυβική δεξαμενή σε m³
  (locale) => {
    const isEl = locale === 'el';
    const correct = '8 m³';
    return {
      title: isEl ? 'ΚΥΒΙΚΗ ΔΕΞΑΜΕΝΗ ΣΕ M³' : 'CUBICAL TANK IN M³',
      prompt: isEl
        ? 'Μια κυβική δεξαμενή νερού έχει ακμή 2 m. Πόσα κυβικά μέτρα (m³) νερού χωράει;'
        : 'A cubical water tank has edge length 2 m. How many cubic meters (m³) of water does it hold?',
      options: ensureFourUniqueOptions(correct, () => ['4 m³', '6 m³', '16 m³', '12 m³']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Ακμή δεξαμενής' : 'Tank edge', value: '2 m' },
        { label: isEl ? 'Πράξη' : 'Calculation', value: '2 · 2 · 2 ＝ 8 m³' }
      ],
      explanation: isEl ? 'V ＝ 2 · 2 · 2 ＝ 8 m³.' : 'V ＝ 2 · 2 · 2 ＝ 8 m³.'
    };
  },
  // 4. Κύβος με ακμή 5 dm
  (locale) => {
    const isEl = locale === 'el';
    const correct = '125 dm³';
    return {
      title: isEl ? 'ΟΓΚΟΣ ΣΕ DM³' : 'VOLUME IN DM³',
      prompt: isEl
        ? 'Ένας κύβος έχει ακμή 5 dm. Πόσα κυβικά δεκατόμετρα (dm³) είναι ο όγκος του;'
        : 'A cube has edge length 5 dm. How many cubic decimeters (dm³) is its volume?',
      options: ensureFourUniqueOptions(correct, () => ['25 dm³', '15 dm³', '150 dm³', '75 dm³']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Ακμή' : 'Edge', value: '5 dm' },
        { label: isEl ? 'Όγκος (5 · 5 · 5)' : 'Volume (5 · 5 · 5)', value: '125 dm³' }
      ],
      explanation: isEl ? '5 · 5 · 5 ＝ 125 dm³.' : '5 · 5 · 5 ＝ 125 dm³.'
    };
  }
];

// POOL ΓΙΑ Q10: Όγκος Ορθογωνίου Παραλληλεπιπέδου (V ＝ α · β · γ)
const PROBLEM_POOL_Q10 = [
  // 1. Κουτί παπουτσιών
  (locale) => {
    const isEl = locale === 'el';
    const l = randInt(20, 30);
    const w = randInt(10, 16);
    const h = randInt(8, 12);
    const vol = l * w * h;
    const correct = `${formatNum(vol, locale)} cm³`;
    const aSym = isEl ? 'α' : 'a';
    const bSym = isEl ? 'β' : 'b';
    const cSym = isEl ? 'γ' : 'c';
    return {
      title: isEl ? 'ΟΓΚΟΣ ΚΟΥΤΙΟΥ ΠΑΠΟΥΤΣΙΩΝ' : 'SHOEBOX VOLUME',
      prompt: isEl
        ? `Ένα κουτί παπουτσιών έχει μήκος ${l} cm, πλάτος ${w} cm και ύψος ${h} cm. Πόσα cm³ είναι ο όγκος του;`
        : `A shoebox has length ${l} cm, width ${w} cm, and height ${h} cm. What is its volume in cm³?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(l * w, locale)} cm³`,
        `${formatNum(vol + 150, locale)} cm³`,
        `${formatNum(vol > 150 ? vol - 150 : vol + 300, locale)} cm³`,
        `${formatNum(2 * (l * w + w * h + l * h), locale)} cm³`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Μήκος (${aSym})` : `Length (${aSym})`, value: `${l} cm` },
        { label: isEl ? `Πλάτος (${bSym})` : `Width (${bSym})`, value: `${w} cm` },
        { label: isEl ? `Ύψος (${cSym})` : `Height (${cSym})`, value: `${h} cm` },
        { label: isEl ? `Υπολογισμός (${aSym} · ${bSym} · ${cSym})` : `Calculation (${aSym} · ${bSym} · ${cSym})`, value: `${l} · ${w} · ${h} ＝ ${formatNum(vol, locale)} cm³` }
      ],
      explanation: isEl
        ? `V ＝ Μήκος · Πλάτος · Ύψος ＝ ${l} · ${w} · ${h} ＝ ${formatNum(vol, locale)} cm³.`
        : `V ＝ Length · Width · Height ＝ ${l} · ${w} · ${h} ＝ ${formatNum(vol, locale)} cm³.`
    };
  },
  // 2. Ενυδρείο
  (locale) => {
    const isEl = locale === 'el';
    const vol = 50 * 30 * 40; // 60,000 cm³
    const correct = `${formatNum(vol, locale)} cm³`;
    return {
      title: isEl ? 'ΟΓΚΟΣ ΕΝΥΔΡΕΙΟΥ' : 'AQUARIUM VOLUME',
      prompt: isEl
        ? 'Ένα γυάλινο ενυδρείο έχει μήκος 50 cm, πλάτος 30 cm και ύψος 40 cm. Πόσος είναι ο όγκος του χώρου που περικλείει σε cm³;'
        : 'A glass aquarium has length 50 cm, width 30 cm, and height 40 cm. What is the enclosed volume in cm³?',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(1500, locale)} cm³`,
        `${formatNum(12000, locale)} cm³`,
        `${formatNum(6000, locale)} cm³`,
        `${formatNum(9400, locale)} cm³`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Διαστάσεις' : 'Dimensions', value: '50 cm, 30 cm, 40 cm' },
        { label: isEl ? 'Πράξη' : 'Calculation', value: `50 · 30 · 40 ＝ ${formatNum(vol, locale)} cm³` }
      ],
      explanation: isEl
        ? '50 · 30 · 40 ＝ 60.000 cm³.'
        : '50 · 30 · 40 ＝ 60,000 cm³.'
    };
  },
  // 3. Σπιρτόκουτο
  (locale) => {
    const isEl = locale === 'el';
    const correct = '40 cm³';
    return {
      title: isEl ? 'ΟΓΚΟΣ ΣΠΙΡΤΟΚΟΥΤΟΥ' : 'MATCHBOX VOLUME',
      prompt: isEl
        ? 'Ένα σπιρτόκουτο έχει μήκος 5 cm, πλάτος 4 cm και ύψος 2 cm. Πόσο είναι το μέγεθος του όγκου του;'
        : 'A matchbox has length 5 cm, width 4 cm, and height 2 cm. What is its volume?',
      options: ensureFourUniqueOptions(correct, () => ['20 cm³', '76 cm³', '11 cm³', '80 cm³']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Διαστάσεις' : 'Dimensions', value: '5 cm, 4 cm, 2 cm' },
        { label: isEl ? 'Πράξη' : 'Calculation', value: '5 · 4 · 2 ＝ 40 cm³' }
      ],
      explanation: isEl ? '5 · 4 · 2 ＝ 40 cm³.' : '5 · 4 · 2 ＝ 40 cm³.'
    };
  }
];

// POOL ΓΙΑ Q11: Μετατροπή Όγκου σε Λίτρα (1 dm³ ＝ 1 L, 1 m³ ＝ 1.000 L)
const PROBLEM_POOL_Q11 = [
  // 1. Δεξαμενή πετρελαίου σε λίτρα
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(3000, locale)} L`;
    return {
      title: isEl ? 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΔΕΞΑΜΕΝΗΣ ΠΕΤΡΕΛΑΙΟΥ' : 'OIL TANK CAPACITY',
      prompt: isEl
        ? 'Μια δεξαμενή πετρελαίου έχει μήκος 2 m, πλάτος 1,5 m και ύψος 1 m. Πόσα λίτρα (L) πετρελαίου χωράει όταν γεμίσει πλήρως;'
        : 'An oil tank has length 2 m, width 1.5 m, and height 1 m. How many liters (L) of oil does it hold when full?',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(300, locale)} L`,
        `${formatNum(30000, locale)} L`,
        `${formatNum(3, locale)} L`,
        `${formatNum(1500, locale)} L`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Όγκος σε m³' : 'Volume in m³', value: '2 · 1,5 · 1 ＝ 3 m³' },
        { label: isEl ? 'Σχέση m³ με λίτρα' : 'Relation m³ to liters', value: '1 m³ ＝ 1.000 L' },
        { label: isEl ? 'Χωρητικότητα σε λίτρα' : 'Capacity in liters', value: `3 · 1.000 ＝ ${formatNum(3000, locale)} L` }
      ],
      explanation: isEl
        ? 'Υπολογίζουμε πρώτα τον όγκο: 2 · 1,5 · 1 ＝ 3 m³. Επειδή 1 m³ ＝ 1.000 L, έχουμε: 3 · 1.000 ＝ 3.000 L.'
        : 'First calculate the volume: 2 · 1.5 · 1 ＝ 3 m³. Since 1 m³ ＝ 1,000 L: 3 · 1,000 ＝ 3,000 L.'
    };
  },
  // 2. Ενυδρείο σε λίτρα
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(120, locale)} L`;
    return {
      title: isEl ? 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΕΝΥΔΡΕΙΟΥ ΣΕ ΛΙΤΡΑ' : 'AQUARIUM CAPACITY IN LITERS',
      prompt: isEl
        ? 'Ένα ενυδρείο έχει μήκος 60 cm, πλάτος 40 cm και ύψος 50 cm. Πόσα λίτρα (L) νερού χρειάζονται για να γεμίσει μέχρι πάνω;'
        : 'An aquarium has length 60 cm, width 40 cm, and height 50 cm. How many liters (L) of water are needed to fill it to the brim?',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(12, locale)} L`,
        `${formatNum(1200, locale)} L`,
        `${formatNum(120000, locale)} L`,
        `${formatNum(240, locale)} L`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Μετατροπή σε dm' : 'Conversion to dm', value: '60 cm ＝ 6 dm, 40 cm ＝ 4 dm, 50 cm ＝ 5 dm' },
        { label: isEl ? 'Όγκος σε dm³' : 'Volume in dm³', value: '6 · 4 · 5 ＝ 120 dm³' },
        { label: isEl ? 'Ισοδυναμία (1 dm³ ＝ 1 L)' : 'Equivalence (1 dm³ ＝ 1 L)', value: `${formatNum(120, locale)} L` }
      ],
      explanation: isEl
        ? 'Μετατρέπουμε σε dm: 6 dm · 4 dm · 5 dm ＝ 120 dm³. Επειδή 1 dm³ ＝ 1 L, το ενυδρείο χωράει 120 L νερού.'
        : 'Convert to dm: 6 dm · 4 dm · 5 dm ＝ 120 dm³. Since 1 dm³ ＝ 1 L, it holds 120 L of water.'
    };
  },
  // 3. Κυβικό δοχείο σε λίτρα
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(27, locale)} L`;
    return {
      title: isEl ? 'ΚΥΒΙΚΟ ΔΟΧΕΙΟ ΣΕ ΛΙΤΡΑ' : 'CUBICAL CONTAINER IN LITERS',
      prompt: isEl
        ? 'Ένα δοχείο έχει σχήμα κύβου με ακμή 30 cm. Πόσα λίτρα υγρού χωράει;'
        : 'A container has the shape of a cube with edge 30 cm. How many liters of liquid does it hold?',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(27000, locale)} L`,
        `${formatNum(2.7, locale)} L`,
        `${formatNum(9, locale)} L`,
        `${formatNum(54, locale)} L`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Ακμή σε dm' : 'Edge in dm', value: '30 cm ＝ 3 dm' },
        { label: isEl ? 'Όγκος' : 'Volume', value: '3 · 3 · 3 ＝ 27 dm³' },
        { label: isEl ? 'Χωρητικότητα' : 'Capacity', value: `${formatNum(27, locale)} L` }
      ],
      explanation: isEl
        ? '30 cm ＝ 3 dm. Όγκος: 3 · 3 · 3 ＝ 27 dm³ ＝ 27 L.'
        : '30 cm ＝ 3 dm. Volume: 3 · 3 · 3 ＝ 27 dm³ ＝ 27 L.'
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα Ρυθμού Ροής & Στάθμης
const PROBLEM_POOL_Q12 = [
  // 1. Χρόνος γεμίσματος δεξαμενής με βρύση
  (locale) => {
    const isEl = locale === 'el';
    const correct = isEl ? '60 λεπτά (1 ώρα)' : '60 minutes (1 hour)';
    return {
      title: isEl ? 'ΧΡΟΝΟΣ ΓΕΜΙΣΜΑΤΟΣ ΔΕΞΑΜΕΝΗΣ' : 'TANK FILLING TIME',
      prompt: isEl
        ? 'Μια δεξαμενή διαστάσεων 2 m, 1 m και 1,5 m γεμίζει από βρύση που παρέχει 50 L νερό κάθε λεπτό. Πόσα λεπτά θα χρειαστούν για να γεμίσει εντελώς η άδεια δεξαμενή;'
        : 'A tank measuring 2 m, 1 m, and 1.5 m is filled by a tap delivering 50 L of water per minute. How many minutes will it take to fill the empty tank completely?',
      options: ensureFourUniqueOptions(correct, () => [
        isEl ? '30 λεπτά' : '30 minutes',
        isEl ? '120 λεπτά (2 ώρες)' : '120 minutes (2 hours)',
        isEl ? '45 λεπτά' : '45 minutes',
        isEl ? '100 λεπτά' : '100 minutes'
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Όγκος δεξαμενής' : 'Tank volume', value: '2 · 1 · 1,5 ＝ 3 m³' },
        { label: isEl ? 'Συνολικά λίτρα' : 'Total liters', value: '3 · 1.000 ＝ 3.000 L' },
        { label: isEl ? 'Παροχή βρύσης' : 'Flow rate', value: isEl ? '50 L ανά λεπτό' : '50 L per minute' },
        { label: isEl ? 'Χρόνος γεμίσματος' : 'Filling time', value: isEl ? '3.000 : 50 ＝ 60 λεπτά (1 ώρα)' : '3,000 : 50 ＝ 60 minutes (1 hour)' }
      ],
      explanation: isEl
        ? 'Ο όγκος είναι 3 m³ ＝ 3.000 L. Με ρυθμό 50 L/λεπτό: 3.000 : 50 ＝ 60 λεπτά (1 ώρα).'
        : 'The volume is 3 m³ ＝ 3,000 L. At 50 L/min: 3,000 : 50 ＝ 60 minutes (1 hour).'
    };
  },
  // 2. Εύρεση ύψους δεξαμενής όταν γνωρίζουμε τον όγκο
  (locale) => {
    const isEl = locale === 'el';
    const correct = '3 m';
    return {
      title: isEl ? 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΔΕΞΑΜΕΝΗΣ' : 'FINDING TANK HEIGHT',
      prompt: isEl
        ? 'Μια δεξαμενή έχει χωρητικότητα 24 m³. Αν το μήκος της βάσης της είναι 4 m και το πλάτος της είναι 2 m, πόσο είναι το ύψος της δεξαμενής;'
        : 'A tank has a capacity of 24 m³. If its base length is 4 m and its width is 2 m, what is the height of the tank?',
      options: ensureFourUniqueOptions(correct, () => ['2 m', '4 m', '6 m', '8 m']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Συνολικός όγκος' : 'Total volume', value: '24 m³' },
        { label: isEl ? 'Εμβαδόν βάσης' : 'Base area', value: '4 · 2 ＝ 8 m²' },
        { label: isEl ? 'Ύψος (Όγκος : Βάση)' : 'Height (Volume : Base)', value: '24 : 8 ＝ 3 m' }
      ],
      explanation: isEl
        ? 'Το εμβαδόν της βάσης είναι 4 · 2 ＝ 8 m². Το ύψος υπολογίζεται ως: 24 : 8 ＝ 3 m.'
        : 'The base area is 4 · 2 ＝ 8 m². The height is computed as: 24 : 8 ＝ 3 m.'
    };
  },
  // 3. Διπλασιασμός ακμών κύβου
  (locale) => {
    const isEl = locale === 'el';
    const correct = isEl ? '8 φορές μεγαλύτερος' : '8 times larger';
    return {
      title: isEl ? 'ΜΕΤΑΒΟΛΗ ΔΙΑΣΤΑΣΕΩΝ ΚΥΒΟΥ' : 'SCALING CUBE DIMENSIONS',
      prompt: isEl
        ? 'Αν διπλασιάσουμε το μήκος της ακμής ενός κύβου (από α σε 2α), πόσες φορές μεγαλύτερος θα γίνει ο όγκος του;'
        : 'If we double the edge length of a cube (from a to 2a), how many times larger does its volume become?',
      options: ensureFourUniqueOptions(correct, () => [
        isEl ? '2 φορές μεγαλύτερος' : '2 times larger',
        isEl ? '4 φορές μεγαλύτερος' : '4 times larger',
        isEl ? '6 φορές μεγαλύτερος' : '6 times larger'
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Αρχικός όγκος' : 'Initial volume', value: 'V₁ ＝ α · α · α ＝ α³' },
        { label: isEl ? 'Νέος όγκος' : 'New volume', value: 'V₂ ＝ (2α) · (2α) · (2α) ＝ 8 · α³ ＝ 8 · V₁' }
      ],
      explanation: isEl
        ? 'Επειδή πολλαπλασιάζουμε 3 διαστάσεις: 2 · 2 · 2 ＝ 8 φορές μεγαλύτερος όγκος.'
        : 'Because 3 dimensions scale up: 2 · 2 · 2 ＝ 8 times larger volume.'
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet(locale = 'el') {
  const isEl = locale === 'el';
  const aSym = isEl ? 'α' : 'a';
  const bSym = isEl ? 'β' : 'b';
  const cSym = isEl ? 'γ' : 'c';
  const qs = [];

  // Q1: Έννοια όγκου (Boolean)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: isEl ? 'ΕΝΝΟΙΑ ΤΟΥ ΟΓΚΟΥ' : 'CONCEPT OF VOLUME',
    prompt: isEl
      ? (isQ1True
          ? 'Όγκος ενός στερεού σώματος είναι ο χώρος που καταλαμβάνει, και μετριέται σε 3 διαστάσεις (μήκος, πλάτος, ύψος).'
          : 'Ο όγκος ενός στερεού είναι το εμβαδόν των εξωτερικών του επιφανειών και μετριέται σε τετραγωνικά μέτρα (m²).')
      : (isQ1True
          ? 'Volume of a solid is the 3-dimensional space it occupies, measured in 3 dimensions (length, width, height).'
          : 'Volume of a solid is the surface area of its outer faces and is measured in square meters (m²).'),
    correctAnswer: isQ1True,
    tableData: [
      { label: isEl ? 'Επιφάνεια (Εμβαδόν)' : 'Surface (Area)', value: isEl ? '2 διαστάσεις (σε m², cm²)' : '2 dimensions (in m², cm²)' },
      { label: isEl ? 'Χώρος (Όγκος)' : 'Space (Volume)', value: isEl ? '3 διαστάσεις (σε m³, dm³, L)' : '3 dimensions (in m³, dm³, L)' }
    ],
    explanation: isEl
      ? (isQ1True
          ? 'Ο όγκος μετράει τον τρισδιάστατο χώρο που πιάνει ένα σώμα.'
          : 'Το εμβαδόν των εξωτερικών επιφανειών είναι επιφάνεια (σε m²). Ο όγκος μετράει τον εσωτερικό χώρο σε κυβικές μονάδες (m³, L).')
      : (isQ1True
          ? 'Volume measures the 3D space occupied by an object.'
          : 'Outer face area measures surface (in m²). Volume measures enclosed space in cubic units (m³, L).')
  });

  // Q2: Βασική ισοδυναμία 1 dm³ με λίτρα (MCQ)
  const q2Correct = isEl ? '1 Λίτρο (1 L)' : '1 Liter (1 L)';
  qs.push({
    id: 2,
    type: 'mcq',
    title: isEl ? 'Η ΜΑΓΙΚΗ ΙΣΟΔΥΝΑΜΙΑ' : 'THE CORE EQUIVALENCE',
    prompt: isEl
      ? 'Με πόσα λίτρα (L) ισούται ακριβώς 1 κυβικό δεκατόμετρο (1 dm³);'
      : 'How many liters (L) does exactly 1 cubic decimeter (1 dm³) equal?',
    options: ensureFourUniqueOptions(q2Correct, () => [
      isEl ? '10 Λίτρα (10 L)' : '10 Liters (10 L)',
      isEl ? '100 Λίτρα (100 L)' : '100 Liters (100 L)',
      isEl ? '1.000 Λίτρα (1.000 L)' : '1,000 Liters (1,000 L)'
    ]),
    correctAnswer: q2Correct,
    tableData: [
      { label: '1 dm³', value: '10 cm · 10 cm · 10 cm ＝ 1.000 cm³' },
      { label: isEl ? 'Χωρητικότητα' : 'Capacity', value: q2Correct }
    ],
    explanation: isEl
      ? '1 κυβικό δεκατόμετρο (1 dm³) είναι εξ ορισμού ίσο με 1 λίτρο (1 L).'
      : '1 cubic decimeter (1 dm³) is by definition equal to 1 liter (1 L).'
  });

  // Q3: Πόσα λίτρα έχει 1 m³ (MCQ)
  const q3Correct = isEl ? '1.000 Λίτρα' : '1,000 Liters';
  qs.push({
    id: 3,
    type: 'mcq',
    title: isEl ? 'ΚΥΒΙΚΟ ΜΕΤΡΟ ΚΑΙ ΛΙΤΡΑ' : 'CUBIC METERS AND LITERS',
    prompt: isEl
      ? 'Πόσα λίτρα (L) νερού χωράει ακριβώς 1 κυβικό μέτρο (1 m³);'
      : 'How many liters (L) of water does exactly 1 cubic meter (1 m³) hold?',
    options: ensureFourUniqueOptions(q3Correct, () => [
      isEl ? '100 Λίτρα' : '100 Liters',
      isEl ? '10 Λίτρα' : '10 Liters',
      isEl ? '10.000 Λίτρα' : '10,000 Liters'
    ]),
    correctAnswer: q3Correct,
    tableData: [
      { label: isEl ? '1 m³ σε dm³' : '1 m³ in dm³', value: '1.000 dm³' },
      { label: isEl ? '1 dm³ σε λίτρα' : '1 dm³ in liters', value: '1 L' },
      { label: isEl ? '1 m³ σε λίτρα' : '1 m³ in liters', value: '1.000 L' }
    ],
    explanation: isEl
      ? 'Επειδή 1 m³ ＝ 1.000 dm³ και 1 dm³ ＝ 1 L, ένα κυβικό μέτρο περιέχει ακριβώς 1.000 λίτρα.'
      : 'Because 1 m³ ＝ 1,000 dm³ and 1 dm³ ＝ 1 L, one cubic meter contains exactly 1,000 liters.'
  });

  // Q4: Οπτική αναγνώριση 1 dm³ κύβου (SVG - No Giveaway)
  const q4Correct = isEl ? 'Ακριβώς 1 Λίτρο (1 dm³)' : 'Exactly 1 Liter (1 dm³)';
  qs.push({
    id: 4,
    type: 'mcq',
    title: isEl ? 'ΟΠΤΙΚΗ ΚΑΤΑΝΟΗΣΗ ΧΩΡΗΤΙΚΟΤΗΤΑΣ' : 'VISUAL CAPACITY UNDERSTANDING',
    prompt: isEl
      ? 'Παρατηρήστε τον παρακάτω κύβο με ακμή 1 dm (10 cm). Αν τον γεμίσουμε με νερό μέχρι πάνω, πόσο υγρό περιέχει;'
      : 'Look at the cube below with edge 1 dm (10 cm). If filled to the top with water, how much liquid does it hold?',
    svg: (
      <svg viewBox="0 0 160 120" className="w-full max-w-[160px] h-auto mx-auto my-2 select-none drop-shadow-sm">
        <polygon points="50,45 90,25 120,45 80,65" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
        <polygon points="50,45 80,65 80,105 50,85" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
        <polygon points="80,65 120,45 120,85 80,105" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
        <text x="60" y="98" fill="#0369a1" fontSize="10" fontWeight="bold">1 dm</text>
        <text x="105" y="98" fill="#0369a1" fontSize="10" fontWeight="bold">1 dm</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => [
      isEl ? '10 Λίτρα' : '10 Liters',
      isEl ? '100 Λίτρα' : '100 Liters',
      isEl ? '0,1 Λίτρα' : '0.1 Liters'
    ]),
    correctAnswer: q4Correct,
    tableData: [
      { label: isEl ? 'Διαστάσεις' : 'Dimensions', value: '1 dm · 1 dm · 1 dm ＝ 1 dm³' },
      { label: isEl ? 'Ποσότητα' : 'Amount', value: isEl ? '1 Λίτρο (L)' : '1 Liter (L)' }
    ],
    explanation: isEl
      ? 'Ένας κύβος ακμής 1 dm έχει όγκο 1 dm³, που ισοδυναμεί με 1 λίτρο.'
      : 'A cube of edge 1 dm has a volume of 1 dm³, which equals 1 liter.'
  });

  // Q5: Υπολογισμός όγκου κύβου με ακμή 4 cm (Input)
  qs.push({
    id: 5,
    type: 'input',
    title: isEl ? `ΥΠΟΛΟΓΙΣΜΟΣ ΟΓΚΟΥ ΚΥΒΟΥ (${toCleanUppercase(aSym)} ＝ 4 CM)` : `CUBE VOLUME CALCULATION (${aSym.toUpperCase()} ＝ 4 CM)`,
    prompt: isEl
      ? 'Πόσα cm³ είναι ο όγκος ενός κύβου με ακμή 4 cm; (Γράψτε μόνο τον αριθμό)'
      : 'What is the volume in cm³ of a cube with edge 4 cm? (Enter number only)',
    correctAnswer: '64',
    tableData: [
      { label: isEl ? `Ακμή (${aSym})` : `Edge (${aSym})`, value: '4 cm' },
      { label: isEl ? 'Τύπος' : 'Formula', value: 'V ＝ 4 · 4 · 4' },
      { label: isEl ? 'Όγκος' : 'Volume', value: '64 cm³' }
    ],
    explanation: isEl ? '4 · 4 · 4 ＝ 64 cm³.' : '4 · 4 · 4 ＝ 64 cm³.'
  });

  // Q6: Μετατροπή m³ σε dm³ (Input)
  const m3Q6 = randInt(2, 6);
  const dm3Q6 = m3Q6 * 1000;
  qs.push({
    id: 6,
    type: 'input',
    title: isEl ? 'ΜΕΤΑΤΡΟΠΗ M³ ΣΕ DM³' : 'CONVERT M³ TO DM³',
    prompt: isEl
      ? `Πόσα κυβικά δεκατόμετρα (dm³) είναι τα ${m3Q6} m³; (Γράψτε μόνο τον αριθμό)`
      : `How many cubic decimeters (dm³) are in ${m3Q6} m³? (Enter number only)`,
    correctAnswer: String(dm3Q6),
    tableData: [
      { label: isEl ? 'Αρχική τιμή' : 'Initial value', value: `${m3Q6} m³` },
      { label: isEl ? 'Κανόνας' : 'Rule', value: isEl ? 'Κατεβαίνουμε 1 σκαλοπάτι (· 1.000)' : 'Step down 1 unit (· 1,000)' },
      { label: isEl ? 'Αποτέλεσμα' : 'Result', value: `${m3Q6} · 1.000 ＝ ${formatNum(dm3Q6, locale)} dm³` }
    ],
    explanation: `${m3Q6} · 1.000 ＝ ${formatNum(dm3Q6, locale)} dm³.`
  });

  // Q7: Με ποιον αριθμό πολλαπλασιάζουμε σε κάθε σκαλοπάτι όγκου (MCQ)
  const q7Correct = isEl
    ? 'Με το 1.000 (γιατί είναι 3 διαστάσεις: 10 · 10 · 10)'
    : 'By 1,000 (because of 3 dimensions: 10 · 10 · 10)';
  qs.push({
    id: 7,
    type: 'mcq',
    title: isEl ? 'ΣΚΑΛΑ ΜΟΝΑΔΩΝ ΟΓΚΟΥ' : 'VOLUME UNITS SCALE',
    prompt: isEl
      ? 'Με ποιον αριθμό πολλαπλασιάζουμε για κάθε σκαλοπάτι που κατεβαίνουμε στις μονάδες μέτρησης όγκου (π.χ. από m³ σε dm³);'
      : 'By what number do we multiply for each descending step in volume units (e.g. from m³ to dm³)?',
    options: ensureFourUniqueOptions(q7Correct, () => [
      isEl ? 'Με το 100' : 'By 100',
      isEl ? 'Με το 10' : 'By 10',
      isEl ? 'Με το 3' : 'By 3'
    ]),
    correctAnswer: q7Correct,
    tableData: [
      { label: isEl ? 'Μήκος (1D)' : 'Length (1D)', value: isEl ? 'Βήμα ανά 10' : 'Step of 10' },
      { label: isEl ? 'Επιφάνεια (2D)' : 'Area (2D)', value: isEl ? 'Βήμα ανά 100 (10 · 10)' : 'Step of 100 (10 · 10)' },
      { label: isEl ? 'Όγκος (3D)' : 'Volume (3D)', value: isEl ? 'Βήμα ανά 1.000 (10 · 10 · 10)' : 'Step of 1,000 (10 · 10 · 10)' }
    ],
    explanation: isEl
      ? "Στον όγκο έχουμε 3 διαστάσεις, γι' αυτό κάθε σκαλοπάτι αντιστοιχεί σε πολλαπλασιασμό ή διαίρεση με το 1.000."
      : 'Because volume operates in 3 dimensions, each conversion step multiplies or divides by 1,000.'
  });

  // Q8: Τύπος όγκου ορθογωνίου παραλληλεπιπέδου (MCQ)
  const q8Correct = isEl
    ? `Μήκος · Πλάτος · Ύψος (V ＝ ${aSym} · ${bSym} · ${cSym})`
    : `Length · Width · Height (V ＝ ${aSym} · ${bSym} · ${cSym})`;
  qs.push({
    id: 8,
    type: 'mcq',
    title: isEl ? 'ΤΥΠΟΣ ΟΓΚΟΥ ΟΡΘΟΓΩΝΙΟΥ' : 'PRISM VOLUME FORMULA',
    prompt: isEl
      ? 'Πώς υπολογίζουμε τον όγκο (V) ενός ορθογωνίου παραλληλεπιπέδου;'
      : 'How do we calculate the volume (V) of a rectangular prism?',
    options: ensureFourUniqueOptions(q8Correct, () => [
      isEl ? `2 · (${aSym} · ${bSym} ＋ ${bSym} · ${cSym} ＋ ${aSym} · ${cSym})` : `2 · (${aSym} · ${bSym} ＋ ${bSym} · ${cSym} ＋ ${aSym} · ${cSym})`,
      isEl ? `Μήκος ＋ Πλάτος ＋ Ύψος` : `Length ＋ Width ＋ Height`,
      isEl ? `(Μήκος · Πλάτος) : Ύψος` : `(Length · Width) : Height`
    ]),
    correctAnswer: q8Correct,
    tableData: [
      { label: isEl ? 'Τύπος όγκου' : 'Volume formula', value: `V ＝ ${aSym} · ${bSym} · ${cSym}` },
      { label: isEl ? 'Εναλλακτικά' : 'Alternatively', value: isEl ? 'V ＝ Εμβαδόν Βάσης · Ύψος' : 'V ＝ Base Area · Height' }
    ],
    explanation: isEl
      ? `Ο όγκος του ορθογωνίου παραλληλεπιπέδου βρίσκεται πολλαπλασιάζοντας και τις τρεις διαστάσεις του: V ＝ ${aSym} · ${bSym} · ${cSym}.`
      : `The volume of a rectangular prism is found by multiplying its three dimensions: V ＝ ${aSym} · ${bSym} · ${cSym}.`
  });

  // Q9: Πρόβλημα από PROBLEM_POOL_Q9
  const p9 = PROBLEM_POOL_Q9[randInt(0, PROBLEM_POOL_Q9.length - 1)](locale);
  qs.push({ id: 9, type: 'mcq', ...p9 });

  // Q10: Πρόβλημα από PROBLEM_POOL_Q10
  const p10 = PROBLEM_POOL_Q10[randInt(0, PROBLEM_POOL_Q10.length - 1)](locale);
  qs.push({ id: 10, type: 'mcq', ...p10 });

  // Q11: Πρόβλημα από PROBLEM_POOL_Q11
  const p11 = PROBLEM_POOL_Q11[randInt(0, PROBLEM_POOL_Q11.length - 1)](locale);
  qs.push({ id: 11, type: 'mcq', ...p11 });

  // Q12: Πρόβλημα από PROBLEM_POOL_Q12
  const p12 = PROBLEM_POOL_Q12[randInt(0, PROBLEM_POOL_Q12.length - 1)](locale);
  qs.push({ id: 12, type: 'mcq', ...p12 });

  return qs;
}

// -------------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΑΣΚΗΣΕΩΝ
// -------------------------------------------------------------

export default function OgkosAskiseisPage() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadNewSet();
  }, [locale]);

  function loadNewSet() {
    const newQs = generateQuestionsSet(locale);
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

  // Στατικά μεταφραστικά strings UI
  const ui = {
    metaTitle: isEl
      ? "Ασκήσεις: Όγκος & Χωρητικότητα (m³ και Λίτρα) - ΣΤ' Δημοτικού | LearnMaths.gr"
      : "Exercises: Volume & Capacity (m³ and Liters) - 6th Grade | LearnMaths.gr",
    metaDesc: isEl
      ? "Διαδραστικές ασκήσεις στον όγκο κύβου και παραλληλεπιπέδου, μετατροπές m³ σε λίτρα (L) και χωρητικότητα δεξαμενών για τη ΣΤ' Δημοτικού."
      : "Interactive exercises on cube and prism volume, m³ to liter conversions, and tank capacity for 6th Grade.",
    backText: isEl ? "Θεωρία Κεφ. 80" : "Theory Ch. 80",
    actionTheory: isEl ? "📖 Θεωρία" : "📖 Theory",
    chapterBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 80 • ΣΤ' ΔΗΜΟΤΙΚΟΥ" : "EXERCISES • CHAPTER 80 • 6TH GRADE",
    heroTitle: isEl ? "Ασκήσεις: Όγκος και Χωρητικότητα" : "Exercises: Volume and Capacity",
    heroDesc: isEl
      ? "Εξασκηθείτε στον υπολογισμό όγκου κύβου και παραλληλεπιπέδου, στις μετατροπές μονάδων (m³, dm³, cm³) και στη μαγική σχέση 1 dm³ ＝ 1 L μέσα από 12 δυναμικές ερωτήσεις."
      : "Practice volume of cubes and prisms, unit conversions (m³, dm³, cm³), and the 1 dm³ ＝ 1 L relation across 12 dynamic questions.",
    heroFeature: isEl
      ? "12 Δυναμικές Ασκήσεις με Αυτόματη Αξιολόγηση & Αναλυτική Επεξήγηση"
      : "12 Dynamic Exercises with Automatic Grading & Detailed Explanation",
    btnNewSet: isEl ? "Νέες Ασκήσεις" : "New Exercises",
    btnSubmit: isEl ? "Έλεγχος Απαντήσεων" : "Check Answers",
    lblTrue: isEl ? "ΣΩΣΤΟ" : "TRUE",
    lblFalse: isEl ? "ΛΑΘΟΣ" : "FALSE",
    lblCorrectBadge: isEl ? "ΣΩΣΤΟ" : "CORRECT",
    lblWrongBadge: isEl ? "ΛΑΘΟΣ" : "INCORRECT",
    inputPlaceholder: isEl ? "Απάντηση..." : "Answer...",
    answered: isEl ? "ΑΠΑΝΤΗΘΗΚΑΝ:" : "ANSWERED:",
    score: isEl ? "ΣΚΟΡ:" : "SCORE:",
    percentage: isEl ? "ΠΟΣΟΣΤΟ:" : "PERCENTAGE:",
    feedbackCorrect: isEl ? "Σωστή απάντηση!" : "Correct answer!",
    feedbackWrongPrefix: isEl ? "Η σωστή απάντηση είναι: " : "The correct answer is: "
  };

  return (
    <Layout
      title={ui.metaTitle}
      description={ui.metaDesc}
      backUrl="/st-dimotikou/80-ogkos"
      backText={ui.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/80-ogkos"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0"
        >
          <span>{ui.actionTheory}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden box-border">

        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden mb-8 sm:mb-12">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span className="break-words [overflow-wrap:anywhere]">{ui.chapterBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(ui.heroTitle)}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words [overflow-wrap:anywhere]">
              {ui.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="break-words [overflow-wrap:anywhere]">{ui.heroFeature}</span>
            </div>
            <button
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base shrink-0"
            >
              <span>🔄 {toCleanUppercase(ui.btnNewSet)}</span>
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
                className={`bg-white rounded-3xl p-4 sm:p-8 shadow-sm border transition-all ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 ring-1 ring-emerald-200'
                      : 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* ΚΕΦΑΛΙΔΑ ΕΡΩΤΗΣΗΣ */}
                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm sm:text-base border border-indigo-150 shrink-0">
                      {index + 1}
                    </span>
                    <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-wider break-words [overflow-wrap:anywhere] min-w-0">
                      {toCleanUppercase(q.title || `${isEl ? 'ΕΡΩΤΗΣΗ' : 'QUESTION'} ${index + 1}`)}
                    </h2>
                  </div>

                  {submitted && (
                    <span
                      className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? toCleanUppercase(ui.lblCorrectBadge) : toCleanUppercase(ui.lblWrongBadge)}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ & SVG (NO-GIVEAWAY: ΟΥΔΕΙΣ ΠΙΝΑΚΑΣ ΕΔΩ) */}
                <div className="mb-6 space-y-3">
                  <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed break-words [overflow-wrap:anywhere]">
                    {q.prompt}
                  </p>
                  {q.svg && <div className="py-2 flex justify-center">{q.svg}</div>}
                </div>

                {/* ΔΙΑΔΡΑΣΤΙΚΑ ΧΕΙΡΙΣΤΗΡΙΑ ΑΠΑΝΤΗΣΗΣ */}
                <div className="mb-4">
                  {/* ΤΥΠΟΣ 1: BOOLEAN */}
                  {q.type === 'boolean' && (
                    <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                      {[true, false].map((val) => {
                        const isSelected = userAns === val;
                        return (
                          <button
                            key={String(val)}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, val)}
                            className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all border break-words [overflow-wrap:anywhere] ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {val ? toCleanUppercase(ui.lblTrue) : toCleanUppercase(ui.lblFalse)}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 2: MCQ (4 ΜΟΝΑΔΙΚΑ ΚΟΥΜΠΙΑ ΧΩΡΙΣ TRUNCATE) */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAns === opt;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`text-left p-3.5 sm:p-4 rounded-2xl border font-semibold text-xs sm:text-sm transition-all flex items-start gap-3 w-full ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                                isSelected
                                  ? 'bg-white text-indigo-700'
                                  : 'bg-white text-slate-500 border border-slate-200'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1 min-w-0">
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 3: INPUT */}
                  {q.type === 'input' && (
                    <div className="max-w-xs w-full">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={submitted}
                        placeholder={ui.inputPlaceholder}
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
                    {/* ΠΙΝΑΚΑΣ ΔΕΔΟΜΕΝΩΝ (TABLEDATA) ΜΟΝΟ ΣΤΟ FEEDBACK */}
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-1 w-full max-w-full">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <tbody>
                            {q.tableData.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={rIdx !== q.tableData.length - 1 ? 'border-b border-slate-200/60' : ''}
                              >
                                <td className="py-2.5 px-3 font-bold text-slate-600 bg-slate-100/70 w-1/3 break-words [overflow-wrap:anywhere]">
                                  {row.label}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-800 break-words [overflow-wrap:anywhere]">
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
                      <p className="font-bold mb-1 break-words [overflow-wrap:anywhere]">
                        {isCorrect
                          ? ui.feedbackCorrect
                          : `${ui.feedbackWrongPrefix}${
                              q.type === 'boolean'
                                ? q.correctAnswer
                                  ? (isEl ? 'Σωστό' : 'True')
                                  : (isEl ? 'Λάθος' : 'False')
                                : q.correctAnswer
                            }`}
                      </p>
                      <p className="text-slate-700 break-words [overflow-wrap:anywhere]">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM SCORE FOOTER (12 ΕΡΩΤΗΣΕΙΣ) */}
        <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3 px-3 sm:px-6">
          <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-8 min-w-0">
              {!submitted ? (
                <div className="text-xs sm:text-sm font-semibold text-slate-300 truncate">
                  <span>{toCleanUppercase(ui.answered)} </span>
                  <span className="font-black text-indigo-400 text-sm sm:text-base">
                    {answeredCount} / {totalCount}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">
                    <span>{toCleanUppercase(ui.score)} </span>
                    <span className="font-black text-emerald-400 text-sm sm:text-base">
                      {score} / {totalCount}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-300 whitespace-nowrap">
                    <span>{toCleanUppercase(ui.percentage)} </span>
                    <span className="font-black text-amber-400 text-sm sm:text-base">
                      {percentage}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {!submitted ? (
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(true);
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="px-4 py-2.5 sm:px-6 sm:py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-xs sm:text-sm whitespace-nowrap"
                >
                  {toCleanUppercase(ui.btnSubmit)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-4 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                >
                  <span>🔄</span>
                  <span>{toCleanUppercase(ui.btnNewSet)}</span>
                </button>
              )}
            </div>
          </div>
        </footer>

      </div>
    </Layout>
  );
}
// pages/st-dimotikou/68-gonies-ask.js
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
    [arr[j], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatNum(val, locale = 'el') {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
}

// Component κανονικής μορφής κλάσματος (Mobile Responsive & Overflow-Safe)
function Fraction({ n, d, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      <span className="border-b border-current px-1 pb-0.5 font-bold break-all">
        {n}
      </span>
      <span className="pt-0.5 px-1 font-bold break-all">
        {d}
      </span>
    </span>
  );
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
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (POOLS) ΓΙΑ Q7, Q8, Q9, Q10
// -------------------------------------------------------------

// POOL ΓΙΑ Q7: Συμπληρωματικές Γωνίες (Άθροισμα 90°)
const PROBLEM_POOL_Q7 = [
  (loc) => {
    const a = randInt(18, 72);
    const b = 90 - a;
    const correct = `${b}°`;
    return {
      title: loc === 'el' ? 'ΣΥΜΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ' : 'COMPLEMENTARY ANGLE',
      prompt: loc === 'el'
        ? `Μια ορθή γωνία (90°) χωρίζεται από μία εσωτερική ημιευθεία σε δύο γωνίες. Αν η μία γωνία μετράει ${formatNum(a, loc)}°, πόσες μοίρες είναι η άλλη;`
        : `A 90° right angle is split by an interior ray into two angles. If one angle measures ${formatNum(a, loc)}°, how many degrees is the other?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${b + 10}°`,
        `${Math.max(5, b - 10)}°`,
        `${180 - a}°`,
        `${90 + a}°`
      ]),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Συνολική γωνία', value: '90° (Ορθή)' },
        { label: 'Γνωστή γωνία', value: `${formatNum(a, loc)}°` },
        { label: 'Πράξη', value: `90° － ${formatNum(a, loc)}°` },
        { label: 'Ζητούμενη γωνία', value: `${formatNum(b, loc)}°` }
      ] : [
        { label: 'Total angle', value: '90° (Right angle)' },
        { label: 'Given angle', value: `${formatNum(a, loc)}°` },
        { label: 'Calculation', value: `90° － ${formatNum(a, loc)}°` },
        { label: 'Required angle', value: `${formatNum(b, loc)}°` }
      ],
      explanation: loc === 'el'
        ? `Οι δύο γωνίες είναι συμπληρωματικές (άθροισμα 90°): 90° － ${formatNum(a, loc)}° ＝ ${formatNum(b, loc)}°.`
        : `The two angles are complementary (sum 90°): 90° － ${formatNum(a, loc)}° ＝ ${formatNum(b, loc)}°.`
    };
  },
  (loc) => {
    const slope = randInt(15, 38);
    const comp = 90 - slope;
    const correct = `${comp}°`;
    return {
      title: loc === 'el' ? 'ΚΛΙΣΗ ΡΑΜΠΑΣ ΚΑΙ ΚΑΘΕΤΟΣ' : 'RAMP SLOPE AND VERTICAL',
      prompt: loc === 'el'
        ? `Μια ράμπα σχηματίζει με το έδαφος οξεία γωνία ${formatNum(slope, loc)}°. Πόσες μοίρες είναι η συμπληρωματική της γωνία ως προς την κατακόρυφη κολόνα 90°;`
        : `A ramp forms an acute angle of ${formatNum(slope, loc)}° with the ground. How many degrees is its complementary angle with the vertical 90° post?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${comp + 12}°`,
        `${Math.max(5, comp - 8)}°`,
        `${180 - slope}°`,
        `${slope + 45}°`
      ]),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Κατακόρυφη γωνία', value: '90°' },
        { label: 'Κλίση ράμπας', value: `${formatNum(slope, loc)}°` },
        { label: 'Πράξη', value: `90° － ${formatNum(slope, loc)}°` },
        { label: 'Συμπλήρωμα', value: `${formatNum(comp, loc)}°` }
      ] : [
        { label: 'Vertical angle', value: '90°' },
        { label: 'Ramp slope', value: `${formatNum(slope, loc)}°` },
        { label: 'Calculation', value: `90° － ${formatNum(slope, loc)}°` },
        { label: 'Complement', value: `${formatNum(comp, loc)}°` }
      ],
      explanation: loc === 'el'
        ? `Η κατακόρυφος σχηματίζει 90° με το έδαφος: 90° － ${formatNum(slope, loc)}° ＝ ${formatNum(comp, loc)}°.`
        : `The vertical post forms 90° with ground level: 90° － ${formatNum(slope, loc)}° ＝ ${formatNum(comp, loc)}°.`
    };
  },
  (loc) => {
    const half = 45;
    const correct = `${half}°`;
    return {
      title: loc === 'el' ? 'ΧΩΡΙΣΜΟΣ ΟΡΘΗΣ ΓΩΝΙΑΣ ΣΤΗ ΜΕΣΗ' : 'BISECTION OF RIGHT ANGLE',
      prompt: loc === 'el'
        ? 'Μια ορθή γωνία (90°) χωρίζεται ακριβώς στη μέση σε δύο ίσες γωνίες. Πόσες μοίρες είναι καθεμία από τις δύο νέες γωνίες;'
        : 'A 90° right angle is bisected into two equal angles. How many degrees does each new angle measure?',
      options: ensureFourUniqueOptions(correct, () => ['30°', '60°', '50°', '40°']),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Αρχική γωνία', value: '90°' },
        { label: 'Διαίρεση', value: 'Σε 2 ίσες γωνίες' },
        { label: 'Πράξη', value: '90° : 2' },
        { label: 'Κάθε γωνία', value: `${half}°` }
      ] : [
        { label: 'Initial angle', value: '90°' },
        { label: 'Division', value: 'Into 2 equal angles' },
        { label: 'Calculation', value: '90° : 2' },
        { label: 'Each angle', value: `${half}°` }
      ],
      fractionData: { n: '90°', d: '2', res: '45°' },
      explanation: loc === 'el'
        ? 'Διαιρούμε την ορθή γωνία με το 2: 90° : 2 ＝ 45°.'
        : 'Divide the right angle by 2: 90° : 2 ＝ 45°.'
    };
  }
];

// POOL ΓΙΑ Q8: Παραπληρωματικές Γωνίες (Άθροισμα 180°)
const PROBLEM_POOL_Q8 = [
  (loc) => {
    const a = randInt(45, 135);
    const b = 180 - a;
    const correct = `${b}°`;
    return {
      title: loc === 'el' ? 'ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ' : 'SUPPLEMENTARY ANGLE',
      prompt: loc === 'el'
        ? `Δύο γωνίες σχηματίζουν μαζί μια ευθεία γραμμή (180°). Αν η μία γωνία είναι ${formatNum(a, loc)}°, πόσες μοίρες είναι η άλλη;`
        : `Two adjacent angles form a straight line (180°). If one angle is ${formatNum(a, loc)}°, how many degrees is the other?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${b + 10}°`,
        `${Math.max(5, b - 10)}°`,
        `${Math.abs(90 - a)}°`,
        `${180 - b + 8}°`
      ]),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Συνολική γωνία', value: '180° (Ευθεία)' },
        { label: 'Γνωστή γωνία', value: `${formatNum(a, loc)}°` },
        { label: 'Πράξη', value: `180° － ${formatNum(a, loc)}°` },
        { label: 'Ζητούμενη γωνία', value: `${formatNum(b, loc)}°` }
      ] : [
        { label: 'Total angle', value: '180° (Straight angle)' },
        { label: 'Given angle', value: `${formatNum(a, loc)}°` },
        { label: 'Calculation', value: `180° － ${formatNum(a, loc)}°` },
        { label: 'Required angle', value: `${formatNum(b, loc)}°` }
      ],
      explanation: loc === 'el'
        ? `Δύο εφεξής γωνίες σε ευθεία είναι παραπληρωματικές: 180° － ${formatNum(a, loc)}° ＝ ${formatNum(b, loc)}°.`
        : `Two adjacent angles on a line are supplementary: 180° － ${formatNum(a, loc)}° ＝ ${formatNum(b, loc)}°.`
    };
  },
  (loc) => {
    const part = 60;
    const correct = `${part}°`;
    return {
      title: loc === 'el' ? 'ΧΩΡΙΣΜΟΣ ΕΥΘΕΙΑΣ ΓΩΝΙΑΣ ΣΕ 3 ΜΕΡΗ' : 'DIVIDING STRAIGHT ANGLE IN 3',
      prompt: loc === 'el'
        ? 'Μια ευθεία γωνία 180° χωρίζεται σε 3 απολύτως ίσα μέρη. Πόσες μοίρες μετράει το καθένα;'
        : 'A straight angle of 180° is divided into 3 equal parts. How many degrees does each part measure?',
      options: ensureFourUniqueOptions(correct, () => ['45°', '90°', '30°', '50°']),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Συνολική γωνία', value: '180°' },
        { label: 'Ίσα μέρη', value: '3' },
        { label: 'Πράξη', value: '180° : 3' },
        { label: 'Κάθε μέρος', value: `${part}°` }
      ] : [
        { label: 'Total angle', value: '180°' },
        { label: 'Equal parts', value: '3' },
        { label: 'Calculation', value: '180° : 3' },
        { label: 'Each part', value: `${part}°` }
      ],
      fractionData: { n: '180°', d: '3', res: '60°' },
      explanation: loc === 'el'
        ? 'Διαιρούμε την ευθεία γωνία με το 3: 180° : 3 ＝ 60°.'
        : 'Divide straight angle by 3: 180° : 3 ＝ 60°.'
    };
  },
  (loc) => {
    const turn = randInt(35, 85);
    const rem = 180 - turn;
    const correct = `${rem}°`;
    return {
      title: loc === 'el' ? 'ΣΤΡΟΦΗ ΠΛΟΙΟΥ ΑΠΟ ΕΥΘΕΙΑ ΠΟΡΕΙΑ' : 'SHIP TURN FROM STRAIGHT COURSE',
      prompt: loc === 'el'
        ? `Ένα πλοίο που κινούνταν σε ευθεία γραμμή έστριψε κατά ${formatNum(turn, loc)}°. Πόσες μοίρες υπολείπονται για να ολοκληρώσει πλήρη αναστροφή πορείας 180°;`
        : `A ship sailing straight turned by ${formatNum(turn, loc)}°. How many degrees remain to complete a full 180° course reversal?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${rem + 15}°`,
        `${Math.max(5, rem - 15)}°`,
        `${Math.abs(90 - turn)}°`,
        `${turn + 60}°`
      ]),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Πλήρης αναστροφή', value: '180°' },
        { label: 'Στροφή', value: `${formatNum(turn, loc)}°` },
        { label: 'Πράξη', value: `180° － ${formatNum(turn, loc)}°` },
        { label: 'Υπόλοιπο', value: `${formatNum(rem, loc)}°` }
      ] : [
        { label: 'Full reversal', value: '180°' },
        { label: 'Turn angle', value: `${formatNum(turn, loc)}°` },
        { label: 'Calculation', value: `180° － ${formatNum(turn, loc)}°` },
        { label: 'Remaining', value: `${formatNum(rem, loc)}°` }
      ],
      explanation: loc === 'el'
        ? `Η αναστροφή αντιστοιχεί σε 180°: 180° － ${formatNum(turn, loc)}° ＝ ${formatNum(rem, loc)}°.`
        : `Reversal corresponds to 180°: 180° － ${formatNum(turn, loc)}° ＝ ${formatNum(rem, loc)}°.`
    };
  }
];

// POOL ΓΙΑ Q9: Δείκτες Ρολογιού & Κίνηση
const PROBLEM_POOL_Q9 = [
  (loc) => {
    const h = randInt(1, 5);
    const deg = h * 30;
    const correct = `${deg}°`;
    return {
      title: loc === 'el' ? 'ΓΩΝΙΑ ΔΕΙΚΤΩΝ ΡΟΛΟΓΙΟΥ' : 'CLOCK HANDS ANGLE',
      prompt: loc === 'el'
        ? `Ένα αναλογικό ρολόι δείχνει ακριβώς ${h}:00. Πόσες μοίρες είναι η κυρτή γωνία που σχηματίζουν οι δείκτες του;`
        : `An analog clock shows exactly ${h}:00. How many degrees is the angle formed by its hands?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${deg + 30}°`,
        `${Math.max(15, deg - 30)}°`,
        `${h * 45}°`,
        `${deg + 15}°`
      ]),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Καντράν', value: '360° : 12 ＝ 30° ανά ώρα' },
        { label: 'Απόσταση δεικτών', value: `${h} ώρες` },
        { label: 'Πράξη', value: `${h} · 30°` },
        { label: 'Γωνία', value: `${deg}°` }
      ] : [
        { label: 'Clock dial', value: '360° : 12 ＝ 30° per hour' },
        { label: 'Hands distance', value: `${h} hours` },
        { label: 'Calculation', value: `${h} · 30°` },
        { label: 'Angle', value: `${deg}°` }
      ],
      fractionData: { n: '360°', d: '12', res: '30°' },
      explanation: loc === 'el'
        ? `Κάθε ώρα στο ρολόι αντιστοιχεί σε 30°. Στις ${h}:00: ${h} · 30° ＝ ${deg}°.`
        : `Each hour on the clock represents 30°. At ${h}:00: ${h} · 30° ＝ ${deg}°.`
    };
  },
  (loc) => {
    const correct = '90°';
    return {
      title: loc === 'el' ? 'ΚΙΝΗΣΗ ΛΕΠΤΟΔΕΙΚΤΗ (15 ΛΕΠΤΑ)' : 'MINUTE HAND ROTATION (15 MIN)',
      prompt: loc === 'el'
        ? 'Όταν περνούν 15 λεπτά της ώρας, κατά πόσες μοίρες περιστρέφεται ο λεπτοδείκτης του ρολογιού;'
        : 'When 15 minutes pass, through how many degrees does the minute hand rotate?',
      options: ensureFourUniqueOptions(correct, () => ['60°', '45°', '180°', '30°']),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: '1 ώρα (60 λεπτά)', value: '360° (πλήρης κύκλος)' },
        { label: '15 λεπτά', value: 'Το 1/4 του κύκλου' },
        { label: 'Πράξη', value: '360° : 4 ＝ 90°' },
        { label: 'Είδος γωνίας', value: 'Ορθή γωνία' }
      ] : [
        { label: '1 hour (60 min)', value: '360° (full circle)' },
        { label: '15 minutes', value: '1/4 of full circle' },
        { label: 'Calculation', value: '360° : 4 ＝ 90°' },
        { label: 'Angle type', value: 'Right angle' }
      ],
      fractionData: { n: '360°', d: '4', res: '90°' },
      explanation: loc === 'el'
        ? 'Σε 15 λεπτά ο λεπτοδείκτης διανύει το 1/4 του κύκλου: 360° : 4 ＝ 90° (ορθή γωνία).'
        : 'In 15 minutes the minute hand traverses 1/4 of the circle: 360° : 4 ＝ 90° (right angle).'
    };
  },
  (loc) => {
    const correct = '120°';
    return {
      title: loc === 'el' ? 'ΚΙΝΗΣΗ ΛΕΠΤΟΔΕΙΚΤΗ (20 ΛΕΠΤΑ)' : 'MINUTE HAND ROTATION (20 MIN)',
      prompt: loc === 'el'
        ? 'Πόσες μοίρες περιστρέφεται ο λεπτοδείκτης σε χρονικό διάστημα 20 λεπτών;'
        : 'Through how many degrees does the minute hand rotate in 20 minutes?',
      options: ensureFourUniqueOptions(correct, () => ['90°', '100°', '150°', '60°']),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Ρυθμός ανά λεπτό', value: '360° : 60 ＝ 6°/λεπτό' },
        { label: 'Χρόνος', value: '20 λεπτά' },
        { label: 'Πράξη', value: '20 · 6° ＝ 120°' },
        { label: 'Είδος γωνίας', value: 'Αμβλεία γωνία' }
      ] : [
        { label: 'Rate per minute', value: '360° : 60 ＝ 6°/min' },
        { label: 'Time span', value: '20 minutes' },
        { label: 'Calculation', value: '20 · 6° ＝ 120°' },
        { label: 'Angle type', value: 'Obtuse angle' }
      ],
      fractionData: { n: '360°', d: '60', res: '6°' },
      explanation: loc === 'el'
        ? 'Κάθε λεπτό ο λεπτοδείκτης στρίβει κατά 6°: 20 · 6° ＝ 120° (αμβλεία γωνία).'
        : 'Every minute the hand rotates by 6°: 20 · 6° ＝ 120° (obtuse angle).'
    };
  }
];

// POOL ΓΙΑ Q10: Σύνθετα Προβλήματα Γωνιών
const PROBLEM_POOL_Q10 = [
  (loc) => {
    const a1 = randInt(35, 55);
    const a2 = randInt(45, 65);
    const a3 = 180 - (a1 + a2);
    const correct = `${a3}°`;
    return {
      title: loc === 'el' ? 'ΤΡΕΙΣ ΓΩΝΙΕΣ ΣΕ ΕΥΘΕΙΑ ΓΡΑΜΜΗ' : 'THREE ANGLES ON A LINE',
      prompt: loc === 'el'
        ? `Πάνω σε μια ευθεία γραμμή σχηματίζονται τρεις διαδοχικές γωνίες με κοινή κορυφή. Αν οι δύο πρώτες είναι ${formatNum(a1, loc)}° και ${formatNum(a2, loc)}°, πόσες μοίρες είναι η τρίτη;`
        : `Three adjacent angles on a straight line share a common vertex. If the first two are ${formatNum(a1, loc)}° and ${formatNum(a2, loc)}°, how many degrees is the third?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${a3 + 12}°`,
        `${Math.max(5, a3 - 10)}°`,
        `${180 - a1}°`,
        `${Math.abs(90 - a2)}°`
      ]),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Συνολικό άθροισμα', value: '180° (Ευθεία γωνία)' },
        { label: 'Άθροισμα 2 πρώτων', value: `${formatNum(a1, loc)}° ＋ ${formatNum(a2, loc)}° ＝ ${formatNum(a1 + a2, loc)}°` },
        { label: 'Πράξη', value: `180° － ${formatNum(a1 + a2, loc)}°` },
        { label: 'Τρίτη γωνία', value: `${formatNum(a3, loc)}°` }
      ] : [
        { label: 'Total sum', value: '180° (Straight angle)' },
        { label: 'Sum of first two', value: `${formatNum(a1, loc)}° ＋ ${formatNum(a2, loc)}° ＝ ${formatNum(a1 + a2, loc)}°` },
        { label: 'Calculation', value: `180° － ${formatNum(a1 + a2, loc)}°` },
        { label: 'Third angle', value: `${formatNum(a3, loc)}°` }
      ],
      explanation: loc === 'el'
        ? `Το άθροισμα και των τριών είναι 180°: 180° － (${formatNum(a1, loc)}° ＋ ${formatNum(a2, loc)}°) ＝ ${formatNum(a3, loc)}°.`
        : `The sum of all three is 180°: 180° － (${formatNum(a1, loc)}° ＋ ${formatNum(a2, loc)}°) ＝ ${formatNum(a3, loc)}°.`
    };
  },
  (loc) => {
    const correct = '120°';
    return {
      title: loc === 'el' ? 'ΣΧΕΣΗ ΔΙΠΛΑΣΙΑΣ ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗΣ' : 'DOUBLE SUPPLEMENTARY ANGLE',
      prompt: loc === 'el'
        ? 'Δύο γωνίες είναι παραπληρωματικές (άθροισμα 180°) και η μία είναι διπλάσια από την άλλη. Πόσες μοίρες είναι η μεγαλύτερη γωνία;'
        : 'Two angles are supplementary (sum 180°) and one is twice the other. How many degrees is the larger angle?',
      options: ensureFourUniqueOptions(correct, () => ['60°', '90°', '135°', '100°']),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Σχέση μερών', value: '1 μέρος ＋ 2 μέρη ＝ 3 μέρη' },
        { label: 'Υπολογισμός 1 μέρους', value: '180° : 3 ＝ 60° (μικρή)' },
        { label: 'Μεγαλύτερη γωνία', value: '2 · 60° ＝ 120°' }
      ] : [
        { label: 'Parts relationship', value: '1 part ＋ 2 parts ＝ 3 parts' },
        { label: '1 part calculation', value: '180° : 3 ＝ 60° (smaller)' },
        { label: 'Larger angle', value: '2 · 60° ＝ 120°' }
      ],
      fractionData: { n: '180°', d: '3', res: '60°' },
      explanation: loc === 'el'
        ? 'Χωρίζουμε τις 180° σε 3 ίσα μέρη: 180° : 3 ＝ 60°. Η μεγαλύτερη: 2 · 60° ＝ 120°.'
        : 'Divide 180° into 3 equal parts: 180° : 3 ＝ 60°. The larger angle: 2 · 60° ＝ 120°.'
    };
  },
  (loc) => {
    const turns = randInt(3, 5);
    const total = turns * 90;
    const correct = `${total}°`;
    return {
      title: loc === 'el' ? 'ΣΥΝΟΛΙΚΗ ΠΕΡΙΣΤΡΟΦΗ ΡΟΜΠΟΤ' : 'TOTAL ROBOT ROTATION',
      prompt: loc === 'el'
        ? `Ένα ρομπότ προγραμματίζεται να στρίψει δεξιά κατά μία ορθή γωνία (90°) ακριβώς ${formatNum(turns, loc)} διαδοχικές φορές. Πόσες μοίρες είναι η συνολική στροφή του;`
        : `A robot is coded to turn right by a right angle (90°) exactly ${formatNum(turns, loc)} consecutive times. How many degrees is its total rotation?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${total + 90}°`,
        `${Math.max(90, total - 90)}°`,
        `${turns * 45}°`,
        `${total + 45}°`
      ]),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Στροφή ανά φορά', value: '90°' },
        { label: 'Φορές', value: `${formatNum(turns, loc)}` },
        { label: 'Πράξη', value: `${formatNum(turns, loc)} · 90°` },
        { label: 'Συνολική περιστροφή', value: `${formatNum(total, loc)}°` }
      ] : [
        { label: 'Turn per step', value: '90°' },
        { label: 'Step count', value: `${formatNum(turns, loc)}` },
        { label: 'Calculation', value: `${formatNum(turns, loc)} · 90°` },
        { label: 'Total rotation', value: `${formatNum(total, loc)}°` }
      ],
      explanation: loc === 'el'
        ? `Κάθε ορθή γωνία είναι 90°: ${formatNum(turns, loc)} · 90° ＝ ${formatNum(total, loc)}°.`
        : `Each right angle is 90°: ${formatNum(turns, loc)} · 90° ＝ ${formatNum(total, loc)}°.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ ΑΚΡΙΒΩΣ 10 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet(locale = 'el') {
  const qs = [];

  // Q1: Έννοια γωνίας & μήκος πλευρών (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: locale === 'el' ? 'ΜΕΓΕΘΟΣ ΓΩΝΙΑΣ ΚΑΙ ΠΛΕΥΡΕΣ' : 'ANGLE SIZE AND ARMS',
    prompt: isQ1True
      ? (locale === 'el'
          ? 'Το μέγεθος μιας γωνίας εξαρτάται αποκλειστικά από το άνοιγμα των πλευρών της και όχι από το μήκος με το οποίο τις σχεδιάζουμε.'
          : 'The magnitude of an angle depends strictly on the rotation of its arms and not on the drawn length of its lines.')
      : (locale === 'el'
          ? 'Μια γωνία γίνεται μεγαλύτερη αν μεγαλώσουμε το μήκος των γραμμών που παριστάνουν τις πλευρές της.'
          : 'An angle increases in size if we extend the drawn line segments that represent its sides.'),
    correctAnswer: isQ1True,
    tableData: locale === 'el' ? [
      { label: 'Ιδιότητα πλευρών', value: 'Οι πλευρές είναι ημιευθείες (άπειρο μήκος)' },
      { label: 'Μέγεθος γωνίας', value: 'Καθορίζεται μόνο από το άνοιγμα (μοίρες)' },
      { label: 'Σχεδιασμός', value: 'Το μήκος των γραμμών δεν επηρεάζει το μέγεθος' }
    ] : [
      { label: 'Arm property', value: 'Arms are rays (infinite length)' },
      { label: 'Angle size', value: 'Determined purely by rotational opening (degrees)' },
      { label: 'Drawing', value: 'Line length on paper does not alter the angle' }
    ],
    explanation: isQ1True
      ? (locale === 'el'
          ? 'ΣΩΣΤΟ: Το μέγεθος μιας γωνίας καθορίζεται μόνο από το άνοιγμα των πλευρών της (μοίρες). Το μήκος των γραμμών δεν επηρεάζει τη γωνία.'
          : 'CORRECT: Angle magnitude is determined strictly by arm rotation. The drawn line length has zero effect.')
      : (locale === 'el'
          ? 'ΛΑΘΟΣ: Οι πλευρές μιας γωνίας είναι ημιευθείες. Το μέγεθος εξαρτάται αποκλειστικά από το άνοιγμα και όχι από το μήκος σχεδίασης.'
          : 'FALSE: The arms of an angle are rays extending infinitely. Size depends only on the opening, not line length.')
  });

  // Q2: Μέτρο ορθής γωνίας (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: locale === 'el' ? 'ΜΕΤΡΟ ΟΡΘΗΣ ΓΩΝΙΑΣ' : 'MEASURE OF RIGHT ANGLE',
    prompt: locale === 'el'
      ? 'Πόσες μοίρες είναι ακριβώς μια ορθή γωνία;'
      : 'How many degrees does a right angle measure exactly?',
    options: ensureFourUniqueOptions('90°', () => ['45°', '180°', '360°', '60°']),
    correctAnswer: '90°',
    tableData: locale === 'el' ? [
      { label: 'Είδος', value: 'Ορθή γωνία' },
      { label: 'Μέτρο σε μοίρες', value: '90°' },
      { label: 'Σχέση πλευρών', value: 'Κάθετες μεταξύ τους' }
    ] : [
      { label: 'Type', value: 'Right angle' },
      { label: 'Measure in degrees', value: '90°' },
      { label: 'Arm orientation', value: 'Perpendicular to each other' }
    ],
    explanation: locale === 'el'
      ? 'Μια ορθή γωνία ισούται ακριβώς με 90°. Οι δύο πλευρές της είναι κάθετες μεταξύ τους.'
      : 'A right angle measures exactly 90°. Its two arms are perpendicular.'
  });

  // Q3: Ταξινόμηση αμβλείας γωνίας (MCQ)
  const ambDeg = randInt(95, 160);
  const q3Correct = locale === 'el' ? 'Αμβλεία γωνία' : 'Obtuse angle';
  qs.push({
    id: 3,
    type: 'mcq',
    title: locale === 'el' ? 'ΤΑΞΙΝΟΜΗΣΗ ΓΩΝΙΑΣ' : 'ANGLE CLASSIFICATION',
    prompt: locale === 'el'
      ? `Μια γωνία μετρήθηκε με το μοιρογνωμόνιο και βρέθηκε ίση με ${formatNum(ambDeg, locale)}°. Τι είδος γωνίας είναι;`
      : `An angle was measured with a protractor and found to be ${formatNum(ambDeg, locale)}°. What type of angle is it?`,
    options: ensureFourUniqueOptions(q3Correct, () => locale === 'el'
      ? ['Οξεία γωνία', 'Ορθή γωνία', 'Ευθεία γωνία']
      : ['Acute angle', 'Right angle', 'Straight angle']
    ),
    correctAnswer: q3Correct,
    tableData: locale === 'el' ? [
      { label: 'Μέτρο', value: `${formatNum(ambDeg, locale)}°` },
      { label: 'Κανόνας', value: '90° ＜ μέτρο ＜ 180°' },
      { label: 'Κατηγορία', value: 'Αμβλεία' }
    ] : [
      { label: 'Measure', value: `${formatNum(ambDeg, locale)}°` },
      { label: 'Rule', value: '90° ＜ measure ＜ 180°' },
      { label: 'Category', value: 'Obtuse' }
    ],
    explanation: locale === 'el'
      ? `Επειδή ${formatNum(ambDeg, locale)}° ＞ 90° και ${formatNum(ambDeg, locale)}° ＜ 180°, η γωνία είναι αμβλεία.`
      : `Since ${formatNum(ambDeg, locale)}° ＞ 90° and ${formatNum(ambDeg, locale)}° ＜ 180°, the angle is obtuse.`
  });

  // Q4: Οπτική αναγνώριση γωνίας (SVG - No Giveaway)
  const q4Correct = locale === 'el' ? 'Οξεία γωνία' : 'Acute angle';
  qs.push({
    id: 4,
    type: 'mcq',
    title: locale === 'el' ? 'ΑΝΑΓΝΩΡΙΣΗ ΣΧΗΜΑΤΟΣ ΓΩΝΙΑΣ' : 'VISUAL ANGLE IDENTIFICATION',
    prompt: locale === 'el'
      ? 'Παρατηρήστε το παρακάτω σχήμα. Τι είδος γωνίας απεικονίζεται;'
      : 'Observe the diagram below. What type of angle is depicted?',
    svg: (
      <svg viewBox="0 0 180 120" className="w-44 h-28 max-w-full mx-auto my-2 select-none drop-shadow-sm">
        <line x1="20" y1="100" x2="160" y2="100" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="100" x2="110" y2="25" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
        <path d="M 55 100 A 35 35 0 0 0 45 79" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="20" cy="100" r="4.5" fill="#e11d48" />
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => locale === 'el'
      ? ['Ορθή γωνία', 'Αμβλεία γωνία', 'Ευθεία γωνία']
      : ['Right angle', 'Obtuse angle', 'Straight angle']
    ),
    correctAnswer: q4Correct,
    tableData: locale === 'el' ? [
      { label: 'Σχήμα', value: 'Άνοιγμα μικρότερο από ορθή γωνία (＜ 90°)' },
      { label: 'Είδος', value: 'Οξεία γωνία' }
    ] : [
      { label: 'Figure', value: 'Opening strictly smaller than 90°' },
      { label: 'Type', value: 'Acute angle' }
    ],
    explanation: locale === 'el'
      ? 'Το άνοιγμα των δύο πλευρών είναι μικρότερο από 90° (ορθή γωνία), επομένως το σχήμα παριστάνει οξεία γωνία.'
      : 'The opening is smaller than 90° (a right angle), which classifies it as an acute angle.'
  });

  // Q5: Υπολογισμός συμπληρώματος (Input αριθμού)
  const angleQ5 = randInt(25, 75);
  const compQ5 = 90 - angleQ5;
  qs.push({
    id: 5,
    type: 'input',
    title: locale === 'el' ? 'ΣΥΜΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ' : 'COMPLEMENTARY ANGLE',
    prompt: locale === 'el'
      ? `Μια γωνία είναι ${formatNum(angleQ5, locale)}°. Πόσες μοίρες είναι η συμπληρωματική της γωνία; (Γράψτε μόνο τον αριθμό)`
      : `An angle measures ${formatNum(angleQ5, locale)}°. How many degrees is its complementary angle? (Write number only)`,
    correctAnswer: String(compQ5),
    tableData: locale === 'el' ? [
      { label: 'Αρχική γωνία', value: `${formatNum(angleQ5, locale)}°` },
      { label: 'Άθροισμα συμπληρωματικών', value: '90°' },
      { label: 'Πράξη', value: `90° － ${formatNum(angleQ5, locale)}° ＝ ${formatNum(compQ5, locale)}°` }
    ] : [
      { label: 'Initial angle', value: `${formatNum(angleQ5, locale)}°` },
      { label: 'Sum of complementary', value: '90°' },
      { label: 'Calculation', value: `90° － ${formatNum(angleQ5, locale)}° ＝ ${formatNum(compQ5, locale)}°` }
    ],
    explanation: locale === 'el'
      ? `Δύο γωνίες είναι συμπληρωματικές όταν το άθροισμά τους είναι 90°: 90° － ${formatNum(angleQ5, locale)}° ＝ ${formatNum(compQ5, locale)}°.`
      : `Two angles are complementary when they add up to 90°: 90° － ${formatNum(angleQ5, locale)}° ＝ ${formatNum(compQ5, locale)}°.`
  });

  // Q6: Υπολογισμός παραπληρώματος (Input αριθμού)
  const angleQ6 = randInt(50, 130);
  const suppQ6 = 180 - angleQ6;
  qs.push({
    id: 6,
    type: 'input',
    title: locale === 'el' ? 'ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ' : 'SUPPLEMENTARY ANGLE',
    prompt: locale === 'el'
      ? `Μια γωνία έχει μέτρο ${formatNum(angleQ6, locale)}°. Πόσες μοίρες είναι η παραπληρωματική της γωνία; (Γράψτε μόνο τον αριθμό)`
      : `An angle measures ${formatNum(angleQ6, locale)}°. How many degrees is its supplementary angle? (Write number only)`,
    correctAnswer: String(suppQ6),
    tableData: locale === 'el' ? [
      { label: 'Αρχική γωνία', value: `${formatNum(angleQ6, locale)}°` },
      { label: 'Άθροισμα παραπληρωματικών', value: '180°' },
      { label: 'Πράξη', value: `180° － ${formatNum(angleQ6, locale)}° ＝ ${formatNum(suppQ6, locale)}°` }
    ] : [
      { label: 'Initial angle', value: `${formatNum(angleQ6, locale)}°` },
      { label: 'Sum of supplementary', value: '180°' },
      { label: 'Calculation', value: `180° － ${formatNum(angleQ6, locale)}° ＝ ${formatNum(suppQ6, locale)}°` }
    ],
    explanation: locale === 'el'
      ? `Δύο γωνίες είναι παραπληρωματικές όταν έχουν άθροισμα 180°: 180° － ${formatNum(angleQ6, locale)}° ＝ ${formatNum(suppQ6, locale)}°.`
      : `Two angles are supplementary when their sum is 180°: 180° － ${formatNum(angleQ6, locale)}° ＝ ${formatNum(suppQ6, locale)}°.`
  });

  // Q7: Πρόβλημα από PROBLEM_POOL_Q7 (Συμπληρωματικές)
  const p7 = PROBLEM_POOL_Q7[randInt(0, PROBLEM_POOL_Q7.length - 1)](locale);
  qs.push({ id: 7, type: 'mcq', ...p7 });

  // Q8: Πρόβλημα από PROBLEM_POOL_Q8 (Παραπληρωματικές)
  const p8 = PROBLEM_POOL_Q8[randInt(0, PROBLEM_POOL_Q8.length - 1)](locale);
  qs.push({ id: 8, type: 'mcq', ...p8 });

  // Q9: Πρόβλημα από PROBLEM_POOL_Q9 (Δείκτες Ρολογιού)
  const p9 = PROBLEM_POOL_Q9[randInt(0, PROBLEM_POOL_Q9.length - 1)](locale);
  qs.push({ id: 9, type: 'mcq', ...p9 });

  // Q10: Πρόβλημα από PROBLEM_POOL_Q10 (Σύνθετα Προβλήματα)
  const p10 = PROBLEM_POOL_Q10[randInt(0, PROBLEM_POOL_Q10.length - 1)](locale);
  qs.push({ id: 10, type: 'mcq', ...p10 });

  return qs;
}

// -------------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΑΣΚΗΣΕΩΝ
// -------------------------------------------------------------

export default function GoniesAskiseisPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';

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
  const totalCount = questions.length || 10;
  const percentage = Math.round((score / totalCount) * 100);

  // Μεταφράσεις UI
  const ui = {
    el: {
      headTitle: "Ασκήσεις: Μέτρηση & Σύγκριση Γωνιών - ΣΤ' Δημοτικού | LearnMaths.gr",
      headDesc: "Διαδραστικές ασκήσεις στη μέτρηση και σύγκριση γωνιών, τα είδη γωνιών και τις συμπληρωματικές/παραπληρωματικές σχέσεις για τη ΣΤ' Δημοτικού.",
      backTheory: "Θεωρία Κεφ. 68",
      btnTheory: "📖 Θεωρία",
      badge: "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 68 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Ασκήσεις: Μέτρηση και Σύγκριση Γωνιών",
      heroDesc: "Εξασκηθείτε στα είδη των γωνιών, τη χρήση του μοιρογνωμονίου, τις συμπληρωματικές και τις παραπληρωματικές γωνίες μέσα από 10 δυναμικές ερωτήσεις.",
      heroSub: "10 Δυναμικές Ασκήσεις με Αυτόματη Αξιολόγηση & Αναλυτική Επεξήγηση",
      btnNewSet: "Νέες Ασκήσεις",
      correctBadge: "ΣΩΣΤΟ",
      wrongBadge: "ΛΑΘΟΣ",
      trueBtn: "ΣΩΣΤΟ",
      falseBtn: "ΛΑΘΟΣ",
      inputPlaceholder: "Απάντηση...",
      answeredLabel: "ΑΠΑΝΤΗΘΗΚΑΝ:",
      scoreLabel: "ΣΚΟΡ:",
      percentageLabel: "ΠΟΣΟΣΤΟ:",
      btnSubmit: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
      feedbackCorrect: "✓ Μπράβο! Σωστή απάντηση.",
      feedbackWrong: "✗ Λάθος. Η σωστή απάντηση είναι: "
    },
    en: {
      headTitle: "Exercises: Measuring & Comparing Angles - 6th Grade | LearnMaths.gr",
      headDesc: "Interactive exercises on measuring and comparing angles, angle types, and complementary/supplementary pairs for 6th Grade.",
      backTheory: "Theory Chap. 68",
      btnTheory: "📖 Theory",
      badge: "EXERCISES • CHAPTER 68 • 6TH GRADE",
      heroTitle: "Exercises: Measuring and Comparing Angles",
      heroDesc: "Practice angle classifications, protractor reading, and complementary and supplementary angles through 10 dynamic questions.",
      heroSub: "10 Dynamic Exercises with Instant Evaluation & Step-by-Step Solutions",
      btnNewSet: "New Exercises",
      correctBadge: "CORRECT",
      wrongBadge: "WRONG",
      trueBtn: "TRUE",
      falseBtn: "FALSE",
      inputPlaceholder: "Answer...",
      answeredLabel: "ANSWERED:",
      scoreLabel: "SCORE:",
      percentageLabel: "PERCENTAGE:",
      btnSubmit: "CHECK ANSWERS",
      feedbackCorrect: "✓ Well done! Correct answer.",
      feedbackWrong: "✗ Incorrect. The correct answer is: "
    }
  }[locale];

  return (
    <Layout
      title={ui.headTitle}
      description={ui.headDesc}
      backUrl="/st-dimotikou/68-gonies"
      backText={ui.backTheory}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/68-gonies"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0"
        >
          <span>{ui.btnTheory}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden box-border">

        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden mb-8 sm:mb-12">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span className="break-words">{ui.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(ui.heroTitle)}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words">
              {ui.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="break-words">{ui.heroSub}</span>
            </div>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base shrink-0"
            >
              <span>🔄 {toCleanUppercase(ui.btnNewSet)}</span>
            </button>
          </div>
        </section>

        {/* ΛΙΣΤΑ ΕΡΩΤΗΣΕΩΝ (ΑΚΡΙΒΩΣ 10 ΕΡΩΤΗΣΕΙΣ) */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, index) => {
            const isCorrect = isQuestionCorrect(q);
            const userAns = userAnswers[q.id];

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-4 sm:p-8 shadow-sm border transition-all min-w-0 ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 ring-1 ring-emerald-200'
                      : 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* ΚΕΦΑΛΙΔΑ ΕΡΩΤΗΣΗΣ */}
                <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm sm:text-base border border-indigo-150 shrink-0">
                      {index + 1}
                    </span>
                    <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-wider break-words [overflow-wrap:anywhere]">
                      {toCleanUppercase(q.title || `${locale === 'el' ? 'ΕΡΩΤΗΣΗ' : 'QUESTION'} ${index + 1}`)}
                    </h2>
                  </div>

                  {submitted && (
                    <span
                      className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-black tracking-wider shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? toCleanUppercase(ui.correctBadge) : toCleanUppercase(ui.wrongBadge)}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ & SVG (NO-GIVEAWAY) */}
                <div className="mb-6 space-y-3">
                  <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed break-words [overflow-wrap:anywhere]">
                    {q.prompt}
                  </p>
                  {q.svg && <div className="py-2 flex justify-center">{q.svg}</div>}
                </div>

                {/* ΧΕΙΡΙΣΤΗΡΙΑ ΑΠΑΝΤΗΣΗΣ */}
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
                            className={`py-3 px-3 sm:px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all border break-words ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {val ? toCleanUppercase(ui.trueBtn) : toCleanUppercase(ui.falseBtn)}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 2: MCQ (4 ΜΟΝΑΔΙΚΕΣ ΕΠΙΛΟΓΕΣ ΧΩΡΙΣ LINE-CLAMP) */}
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
                            <span className="break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1">
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 3: INPUT */}
                  {q.type === 'input' && (
                    <div className="w-full max-w-xs">
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

                {/* FEEDBACK & EXPLANATION (ΜΟΝΟ ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ) */}
                {submitted && (
                  <div className="mt-6 pt-5 border-t border-slate-150 space-y-4">
                    {/* ΠΙΝΑΚΑΣ ΔΕΔΟΜΕΝΩΝ (TABLEDATA) */}
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-1">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <tbody>
                            {q.tableData.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={rIdx !== q.tableData.length - 1 ? 'border-b border-slate-200/60' : ''}
                              >
                                <td className="py-2.5 px-3 font-bold text-slate-600 bg-slate-100/70 w-1/3 min-w-[110px] break-words">
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

                    {/* ΑΝΑΛΥΤΙΚΗ ΕΠΕΞΗΓΗΣΗ ΜΕ ΚΑΝΟΝΙΚΑ ΚΛΑΣΜΑΤΑ */}
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                          : 'bg-rose-50 text-rose-950 border border-rose-200'
                      }`}
                    >
                      <p className="font-bold mb-1 break-words">
                        {isCorrect
                          ? ui.feedbackCorrect
                          : `${ui.feedbackWrong}${
                              q.type === 'boolean'
                                ? q.correctAnswer
                                  ? ui.trueBtn
                                  : ui.falseBtn
                                : q.correctAnswer
                            }`}
                      </p>
                      <div className="text-slate-700 flex flex-wrap items-center gap-1 leading-normal break-words">
                        <span>{q.explanation}</span>
                        {q.fractionData && (
                          <span className="inline-flex flex-wrap items-center gap-1 font-mono font-bold">
                            <span>(</span>
                            <Fraction n={q.fractionData.n} d={q.fractionData.d} />
                            <span>＝ {q.fractionData.res})</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM SCORE FOOTER (10 ΕΡΩΤΗΣΕΙΣ) */}
        <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
          <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-8 min-w-0">
              {!submitted ? (
                <div className="text-xs sm:text-sm font-semibold text-slate-300 truncate">
                  <span>{toCleanUppercase(ui.answeredLabel)} </span>
                  <span className="font-black text-indigo-400 text-sm sm:text-base">
                    {answeredCount} / {totalCount}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span className="hidden xs:inline">{toCleanUppercase(ui.scoreLabel)} </span>
                    <span className="font-black text-emerald-400 text-sm sm:text-base">
                      {score} / {totalCount}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span className="hidden xs:inline">{toCleanUppercase(ui.percentageLabel)} </span>
                    <span className="font-black text-amber-400 text-sm sm:text-base">
                      {percentage}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
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
                  className="px-4 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
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
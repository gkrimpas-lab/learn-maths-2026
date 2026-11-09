// pages/st-dimotikou/69-athroisma-gonion-ask.js
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
    [arr[j], arr[i]] = [arr[j], arr[i]];
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

// POOL ΓΙΑ Q7: Τρίγωνα - Εύρεση 3ης Γωνίας
const PROBLEM_POOL_Q7 = [
  (loc) => {
    const a = randInt(35, 75);
    const b = randInt(30, 65);
    const c = 180 - (a + b);
    const correct = `${c}°`;
    return {
      title: loc === 'el' ? 'ΤΡΙΤΗ ΓΩΝΙΑ ΤΡΙΓΩΝΟΥ' : 'THIRD ANGLE OF TRIANGLE',
      prompt: loc === 'el'
        ? `Σε ένα τρίγωνο γνωρίζουμε ότι η πρώτη γωνία είναι ${formatNum(a, loc)}° και η δεύτερη είναι ${formatNum(b, loc)}°. Πόσες μοίρες είναι η τρίτη γωνία;`
        : `In a triangle, the first angle is ${formatNum(a, loc)}° and the second is ${formatNum(b, loc)}°. How many degrees is the third angle?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${c + 10}°`,
        `${Math.max(5, c - 10)}°`,
        `${180 - a}°`,
        `${Math.abs(90 - b)}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: loc === 'el' ? [
        { label: 'Συνολικό άθροισμα', value: '180°' },
        { label: 'Άθροισμα 2 γωνιών', value: `${formatNum(a, loc)}° ＋ ${formatNum(b, loc)}° ＝ ${formatNum(a + b, loc)}°` },
        { label: 'Πράξη', value: `180° － ${formatNum(a + b, loc)}°` },
        { label: 'Τρίτη γωνία', value: `${formatNum(c, loc)}°` }
      ] : [
        { label: 'Total sum', value: '180°' },
        { label: 'Sum of 2 angles', value: `${formatNum(a, loc)}° ＋ ${formatNum(b, loc)}° ＝ ${formatNum(a + b, loc)}°` },
        { label: 'Calculation', value: `180° － ${formatNum(a + b, loc)}°` },
        { label: 'Third angle', value: `${formatNum(c, loc)}°` }
      ],
      explanation: loc === 'el'
        ? `Σε κάθε τρίγωνο το άθροισμα των γωνιών είναι 180°: 180° － (${formatNum(a, loc)}° ＋ ${formatNum(b, loc)}°) ＝ ${formatNum(c, loc)}°.`
        : `In every triangle the sum of angles is 180°: 180° － (${formatNum(a, loc)}° ＋ ${formatNum(b, loc)}°) ＝ ${formatNum(c, loc)}°.`
    };
  },
  (loc) => {
    const a = randInt(25, 68);
    const b = 90 - a;
    const correct = `${b}°`;
    return {
      title: loc === 'el' ? 'ΟΞΕΙΑ ΓΩΝΙΑ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ' : 'ACUTE ANGLE OF RIGHT TRIANGLE',
      prompt: loc === 'el'
        ? `Ένα τρίγωνο είναι ορθογώνιο (έχει μία γωνία 90°). Αν η μία οξεία γωνία του μετράει ${formatNum(a, loc)}°, πόσες μοίρες είναι η άλλη οξεία γωνία του;`
        : `A triangle is right-angled (one angle is 90°). If one acute angle measures ${formatNum(a, loc)}°, how many degrees is the other acute angle?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${b + 12}°`,
        `${Math.max(5, b - 10)}°`,
        `${180 - a}°`,
        `${a + 15}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: loc === 'el' ? [
        { label: 'Είδος τριγώνου', value: 'Ορθογώνιο (μία γωνία 90°)' },
        { label: 'Άθροισμα οξειών', value: '180° － 90° ＝ 90°' },
        { label: 'Πράξη', value: `90° － ${formatNum(a, loc)}°` },
        { label: 'Άλλη οξεία', value: `${formatNum(b, loc)}°` }
      ] : [
        { label: 'Triangle type', value: 'Right-angled (one 90° angle)' },
        { label: 'Acute sum', value: '180° － 90° ＝ 90°' },
        { label: 'Calculation', value: `90° － ${formatNum(a, loc)}°` },
        { label: 'Other acute angle', value: `${formatNum(b, loc)}°` }
      ],
      explanation: loc === 'el'
        ? `Στο ορθογώνιο τρίγωνο οι δύο οξείες γωνίες είναι συμπληρωματικές (άθροισμα 90°): 90° － ${formatNum(a, loc)}° ＝ ${formatNum(b, loc)}°.`
        : `In a right triangle the acute angles are complementary (sum 90°): 90° － ${formatNum(a, loc)}° ＝ ${formatNum(b, loc)}°.`
    };
  },
  (loc) => {
    const obtuse = randInt(100, 130);
    const acute1 = randInt(15, 35);
    const acute2 = 180 - (obtuse + acute1);
    const correct = `${acute2}°`;
    return {
      title: loc === 'el' ? 'ΑΜΒΛΥΓΩΝΙΟ ΤΡΙΓΩΝΟ' : 'OBTUSE TRIANGLE',
      prompt: loc === 'el'
        ? `Ένα αμβλυγώνιο τρίγωνο έχει μια αμβλεία γωνία ${formatNum(obtuse, loc)}° και μία οξεία γωνία ${formatNum(acute1, loc)}°. Πόσες μοίρες είναι η άλλη οξεία γωνία;`
        : `An obtuse triangle has one obtuse angle of ${formatNum(obtuse, loc)}° and one acute angle of ${formatNum(acute1, loc)}°. How many degrees is the remaining acute angle?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${acute2 + 8}°`,
        `${Math.max(5, acute2 - 8)}°`,
        `${Math.abs(90 - acute1)}°`,
        `${Math.abs(obtuse - acute1)}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: loc === 'el' ? [
        { label: 'Αμβλεία γωνία', value: `${formatNum(obtuse, loc)}°` },
        { label: 'Πρώτη οξεία', value: `${formatNum(acute1, loc)}°` },
        { label: 'Πράξη', value: `180° － (${formatNum(obtuse, loc)}° ＋ ${formatNum(acute1, loc)}°)` },
        { label: 'Δεύτερη οξεία', value: `${formatNum(acute2, loc)}°` }
      ] : [
        { label: 'Obtuse angle', value: `${formatNum(obtuse, loc)}°` },
        { label: 'First acute angle', value: `${formatNum(acute1, loc)}°` },
        { label: 'Calculation', value: `180° － (${formatNum(obtuse, loc)}° ＋ ${formatNum(acute1, loc)}°)` },
        { label: 'Second acute angle', value: `${formatNum(acute2, loc)}°` }
      ],
      explanation: loc === 'el'
        ? `180° － (${formatNum(obtuse, loc)}° ＋ ${formatNum(acute1, loc)}°) ＝ 180° － ${formatNum(obtuse + acute1, loc)}° ＝ ${formatNum(acute2, loc)}°.`
        : `180° － (${formatNum(obtuse, loc)}° ＋ ${formatNum(acute1, loc)}°) ＝ 180° － ${formatNum(obtuse + acute1, loc)}° ＝ ${formatNum(acute2, loc)}°.`
    };
  }
];

// POOL ΓΙΑ Q8: Ισοσκελή & Ισόπλευρα Τρίγωνα
const PROBLEM_POOL_Q8 = [
  (loc) => {
    const rawTop = randInt(40, 80);
    const topA = rawTop % 2 === 0 ? rawTop : rawTop + 1;
    const baseA = (180 - topA) / 2;
    const correct = `${baseA}°`;
    return {
      title: loc === 'el' ? 'ΓΩΝΙΕΣ ΒΑΣΗΣ ΙΣΟΣΚΕΛΟΥΣ ΤΡΙΓΩΝΟΥ' : 'BASE ANGLES OF ISOSCELES TRIANGLE',
      prompt: loc === 'el'
        ? `Σε ένα ισοσκελές τρίγωνο η γωνία της κορυφής είναι ${formatNum(topA, loc)}°. Πόσες μοίρες είναι καθεμία από τις δύο ίσες γωνίες της βάσης του;`
        : `In an isosceles triangle, the vertex angle measures ${formatNum(topA, loc)}°. How many degrees is each of the two equal base angles?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${baseA + 10}°`,
        `${Math.max(10, baseA - 10)}°`,
        `${180 - topA}°`,
        `${baseA + 15}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: loc === 'el' ? [
        { label: 'Γωνία κορυφής', value: `${formatNum(topA, loc)}°` },
        { label: 'Άθροισμα 2 γωνιών βάσης', value: `180° － ${formatNum(topA, loc)}° ＝ ${formatNum(180 - topA, loc)}°` },
        { label: 'Πράξη', value: `${formatNum(180 - topA, loc)}° : 2` },
        { label: 'Κάθε γωνία βάσης', value: `${formatNum(baseA, loc)}°` }
      ] : [
        { label: 'Apex angle', value: `${formatNum(topA, loc)}°` },
        { label: 'Sum of base angles', value: `180° － ${formatNum(topA, loc)}° ＝ ${formatNum(180 - topA, loc)}°` },
        { label: 'Calculation', value: `${formatNum(180 - topA, loc)}° : 2` },
        { label: 'Each base angle', value: `${formatNum(baseA, loc)}°` }
      ],
      fractionData: { n: `${formatNum(180 - topA, loc)}°`, d: '2', res: `${formatNum(baseA, loc)}°` },
      explanation: loc === 'el'
        ? `Οι γωνίες βάσης είναι ίσες: (180° － ${formatNum(topA, loc)}°) : 2 ＝ ${formatNum(180 - topA, loc)}° : 2 ＝ ${formatNum(baseA, loc)}°.`
        : `Base angles are equal: (180° － ${formatNum(topA, loc)}°) : 2 ＝ ${formatNum(180 - topA, loc)}° : 2 ＝ ${formatNum(baseA, loc)}°.`
    };
  },
  (loc) => {
    const baseA = randInt(35, 75);
    const topA = 180 - 2 * baseA;
    const correct = `${topA}°`;
    return {
      title: loc === 'el' ? 'ΓΩΝΙΑ ΚΟΡΥΦΗΣ ΙΣΟΣΚΕΛΟΥΣ ΤΡΙΓΩΝΟΥ' : 'VERTEX ANGLE OF ISOSCELES TRIANGLE',
      prompt: loc === 'el'
        ? `Σε ένα ισοσκελές τρίγωνο μία από τις γωνίες της βάσης του είναι ${formatNum(baseA, loc)}°. Πόσες μοίρες είναι η γωνία της κορυφής του;`
        : `In an isosceles triangle, one of the base angles is ${formatNum(baseA, loc)}°. How many degrees is the vertex angle?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${topA + 15}°`,
        `${Math.max(10, topA - 15)}°`,
        `${180 - baseA}°`,
        `${2 * baseA}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: loc === 'el' ? [
        { label: 'Γωνίες βάσης (ίσες)', value: `2 · ${formatNum(baseA, loc)}° ＝ ${formatNum(2 * baseA, loc)}°` },
        { label: 'Συνολικό άθροισμα', value: '180°' },
        { label: 'Πράξη', value: `180° － ${formatNum(2 * baseA, loc)}°` },
        { label: 'Γωνία κορυφής', value: `${formatNum(topA, loc)}°` }
      ] : [
        { label: 'Base angles (equal)', value: `2 · ${formatNum(baseA, loc)}° ＝ ${formatNum(2 * baseA, loc)}°` },
        { label: 'Total sum', value: '180°' },
        { label: 'Calculation', value: `180° － ${formatNum(2 * baseA, loc)}°` },
        { label: 'Vertex angle', value: `${formatNum(topA, loc)}°` }
      ],
      explanation: loc === 'el'
        ? `Οι 2 γωνίες βάσης είναι ίσες (2 · ${formatNum(baseA, loc)}° ＝ ${formatNum(2 * baseA, loc)}°). Αφαιρούμε: 180° － ${formatNum(2 * baseA, loc)}° ＝ ${formatNum(topA, loc)}°.`
        : `The 2 base angles are equal (2 · ${formatNum(baseA, loc)}° ＝ ${formatNum(2 * baseA, loc)}°). Subtract: 180° － ${formatNum(2 * baseA, loc)}° ＝ ${formatNum(topA, loc)}°.`
    };
  },
  (loc) => {
    const correct = '45°';
    return {
      title: loc === 'el' ? 'ΙΣΟΣΚΕΛΕΣ ΟΡΘΟΓΩΝΙΟ ΤΡΙΓΩΝΟ' : 'ISOSCELES RIGHT TRIANGLE',
      prompt: loc === 'el'
        ? 'Σε ένα ισοσκελές ορθογώνιο τρίγωνο, η ορθή γωνία είναι 90° και οι δύο άλλες γωνίες είναι ίσες μεταξύ τους. Πόσες μοίρες είναι καθεμία από αυτές;'
        : 'In an isosceles right triangle, the right angle is 90° and the other two angles are equal. How many degrees is each of them?',
      options: ensureFourUniqueOptions(correct, () => ['30°', '60°', '50°', '40°']),
      correctAnswer: correct,
      unit: '°',
      tableData: loc === 'el' ? [
        { label: 'Ορθή γωνία', value: '90°' },
        { label: 'Υπόλοιπο για τις 2 ίσες', value: '180° － 90° ＝ 90°' },
        { label: 'Πράξη', value: '90° : 2' },
        { label: 'Κάθε οξεία γωνία', value: '45°' }
      ] : [
        { label: 'Right angle', value: '90°' },
        { label: 'Remaining for 2 angles', value: '180° － 90° ＝ 90°' },
        { label: 'Calculation', value: '90° : 2' },
        { label: 'Each acute angle', value: '45°' }
      ],
      fractionData: { n: '90°', d: '2', res: '45°' },
      explanation: loc === 'el'
        ? 'Οι δύο οξείες γωνίες είναι ίσες και συμπληρωματικές: 90° : 2 ＝ 45°.'
        : 'The two acute angles are equal and complementary: 90° : 2 ＝ 45°.'
    };
  }
];

// POOL ΓΙΑ Q9: Τετράπλευρα - Εύρεση 4ης Γωνίας (Άθροισμα 360°)
const PROBLEM_POOL_Q9 = [
  (loc) => {
    const a = randInt(70, 110);
    const b = randInt(75, 115);
    const c = randInt(65, 105);
    const d = 360 - (a + b + c);
    const correct = `${d}°`;
    return {
      title: loc === 'el' ? 'ΤΕΤΑΡΤΗ ΓΩΝΙΑ ΤΕΤΡΑΠΛΕΥΡΟΥ' : 'FOURTH ANGLE OF QUADRILATERAL',
      prompt: loc === 'el'
        ? `Ένα τετράπλευρο έχει τρεις γωνίες ίσες με ${formatNum(a, loc)}°, ${formatNum(b, loc)}° και ${formatNum(c, loc)}°. Πόσες μοίρες είναι η τέταρτη γωνία του;`
        : `A quadrilateral has three angles measuring ${formatNum(a, loc)}°, ${formatNum(b, loc)}°, and ${formatNum(c, loc)}°. How many degrees is the fourth angle?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${d + 12}°`,
        `${Math.max(10, d - 10)}°`,
        `${180 - a}°`,
        `${d + 20}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: loc === 'el' ? [
        { label: 'Συνολικό άθροισμα', value: '360°' },
        { label: 'Άθροισμα 3 γωνιών', value: `${formatNum(a, loc)}° ＋ ${formatNum(b, loc)}° ＋ ${formatNum(c, loc)}° ＝ ${formatNum(a + b + c, loc)}°` },
        { label: 'Πράξη', value: `360° － ${formatNum(a + b + c, loc)}°` },
        { label: 'Τέταρτη γωνία', value: `${formatNum(d, loc)}°` }
      ] : [
        { label: 'Total sum', value: '360°' },
        { label: 'Sum of 3 angles', value: `${formatNum(a, loc)}° ＋ ${formatNum(b, loc)}° ＋ ${formatNum(c, loc)}° ＝ ${formatNum(a + b + c, loc)}°` },
        { label: 'Calculation', value: `360° － ${formatNum(a + b + c, loc)}°` },
        { label: 'Fourth angle', value: `${formatNum(d, loc)}°` }
      ],
      explanation: loc === 'el'
        ? `Σε κάθε τετράπλευρο το άθροισμα είναι 360°: 360° － ${formatNum(a + b + c, loc)}° ＝ ${formatNum(d, loc)}°.`
        : `In every quadrilateral the angle sum is 360°: 360° － ${formatNum(a + b + c, loc)}° ＝ ${formatNum(d, loc)}°.`
    };
  },
  (loc) => {
    const acute = randInt(45, 80);
    const obtuse = 180 - acute;
    const correct = `${obtuse}°`;
    return {
      title: loc === 'el' ? 'ΟΡΘΟΓΩΝΙΟ ΤΡΑΠΕΖΙΟ' : 'RIGHT TRAPEZOID',
      prompt: loc === 'el'
        ? `Ένα ορθογώνιο τραπέζιο έχει δύο ορθές γωνίες (90° και 90°) και μία οξεία γωνία ${formatNum(acute, loc)}°. Πόσες μοίρες είναι η τέταρτη (αμβλεία) γωνία του;`
        : `A right trapezoid has two right angles (90° and 90°) and one acute angle of ${formatNum(acute, loc)}°. How many degrees is the fourth (obtuse) angle?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${obtuse + 10}°`,
        `${Math.max(10, obtuse - 10)}°`,
        `${acute + 45}°`,
        `${obtuse + 20}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: loc === 'el' ? [
        { label: 'Δύο ορθές γωνίες', value: '90° ＋ 90° ＝ 180°' },
        { label: 'Σύνολο τριών', value: `180° ＋ ${formatNum(acute, loc)}° ＝ ${formatNum(180 + acute, loc)}°` },
        { label: 'Πράξη', value: `360° － ${formatNum(180 + acute, loc)}°` },
        { label: 'Τέταρτη γωνία', value: `${formatNum(obtuse, loc)}°` }
      ] : [
        { label: 'Two right angles', value: '90° ＋ 90° ＝ 180°' },
        { label: 'Sum of three', value: `180° ＋ ${formatNum(acute, loc)}° ＝ ${formatNum(180 + acute, loc)}°` },
        { label: 'Calculation', value: `360° － ${formatNum(180 + acute, loc)}°` },
        { label: 'Fourth angle', value: `${formatNum(obtuse, loc)}°` }
      ],
      explanation: loc === 'el'
        ? `360° － (90° ＋ 90° ＋ ${formatNum(acute, loc)}°) ＝ 360° － ${formatNum(180 + acute, loc)}° ＝ ${formatNum(obtuse, loc)}°.`
        : `360° － (90° ＋ 90° ＋ ${formatNum(acute, loc)}°) ＝ 360° － ${formatNum(180 + acute, loc)}° ＝ ${formatNum(obtuse, loc)}°.`
    };
  },
  (loc) => {
    const correct = '90°';
    return {
      title: loc === 'el' ? 'ΤΕΤΡΑΠΛΕΥΡΟ ΜΕ 4 ΙΣΕΣ ΓΩΝΙΕΣ' : 'EQUIANGULAR QUADRILATERAL',
      prompt: loc === 'el'
        ? 'Ένα τετράπλευρο έχει και τις 4 γωνίες του ίσες μεταξύ τους (όπως το τετράγωνο και το ορθογώνιο). Πόσες μοίρες είναι καθεμία από τις γωνίες του;'
        : 'A quadrilateral has all 4 angles equal (such as a square or rectangle). How many degrees does each angle measure?',
      options: ensureFourUniqueOptions(correct, () => ['60°', '80°', '100°', '120°']),
      correctAnswer: correct,
      unit: '°',
      tableData: loc === 'el' ? [
        { label: 'Άθροισμα τετραπλεύρου', value: '360°' },
        { label: 'Πλήθος ίσων γωνιών', value: '4' },
        { label: 'Πράξη', value: '360° : 4' },
        { label: 'Κάθε γωνία', value: '90° (Ορθή)' }
      ] : [
        { label: 'Quadrilateral sum', value: '360°' },
        { label: 'Equal angle count', value: '4' },
        { label: 'Calculation', value: '360° : 4' },
        { label: 'Each angle', value: '90° (Right angle)' }
      ],
      fractionData: { n: '360°', d: '4', res: '90°' },
      explanation: loc === 'el'
        ? '360° : 4 ＝ 90°. Σε κάθε ισογώνιο τετράπλευρο όλες οι γωνίες είναι ορθές (90°).'
        : '360° : 4 ＝ 90°. In any equiangular quadrilateral all angles are right angles (90°).'
    };
  }
];

// POOL ΓΙΑ Q10: Σύνθετα Προβλήματα Γεωμετρίας (Παραλληλόγραμμα, Ρόμβοι, Πολύγωνα)
const PROBLEM_POOL_Q10 = [
  (loc) => {
    const acute = randInt(40, 75);
    const obtuse = 180 - acute;
    const correct = `${obtuse}°`;
    return {
      title: loc === 'el' ? 'ΓΩΝΙΕΣ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΥ' : 'PARALLELOGRAM ANGLES',
      prompt: loc === 'el'
        ? `Σε ένα παραλληλόγραμμο οι δύο απέναντι οξείες γωνίες είναι ίσες με ${formatNum(acute, loc)}° η καθεμία. Πόσες μοίρες είναι καθεμία από τις δύο απέναντι αμβλείες γωνίες του;`
        : `In a parallelogram, the two opposite acute angles are ${formatNum(acute, loc)}° each. How many degrees is each of the two opposite obtuse angles?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${obtuse + 10}°`,
        `${Math.max(10, obtuse - 10)}°`,
        `${acute + 60}°`,
        `${obtuse + 20}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: loc === 'el' ? [
        { label: 'Άθροισμα 2 οξειών', value: `2 · ${formatNum(acute, loc)}° ＝ ${formatNum(2 * acute, loc)}°` },
        { label: 'Υπόλοιπο για τις 2 αμβλείες', value: `360° － ${formatNum(2 * acute, loc)}° ＝ ${formatNum(360 - 2 * acute, loc)}°` },
        { label: 'Πράξη', value: `${formatNum(360 - 2 * acute, loc)}° : 2` },
        { label: 'Κάθε αμβλεία γωνία', value: `${formatNum(obtuse, loc)}°` }
      ] : [
        { label: 'Sum of 2 acute', value: `2 · ${formatNum(acute, loc)}° ＝ ${formatNum(2 * acute, loc)}°` },
        { label: 'Remaining for 2 obtuse', value: `360° － ${formatNum(2 * acute, loc)}° ＝ ${formatNum(360 - 2 * acute, loc)}°` },
        { label: 'Calculation', value: `${formatNum(360 - 2 * acute, loc)}° : 2` },
        { label: 'Each obtuse angle', value: `${formatNum(obtuse, loc)}°` }
      ],
      fractionData: { n: `${formatNum(360 - 2 * acute, loc)}°`, d: '2', res: `${formatNum(obtuse, loc)}°` },
      explanation: loc === 'el'
        ? `Δύο διαδοχικές γωνίες παραλληλογράμμου είναι παραπληρωματικές: 180° － ${formatNum(acute, loc)}° ＝ ${formatNum(obtuse, loc)}°.`
        : `Two consecutive angles in a parallelogram are supplementary: 180° － ${formatNum(acute, loc)}° ＝ ${formatNum(obtuse, loc)}°.`
    };
  },
  (loc) => {
    const acute = randInt(45, 70);
    const obtuse = 180 - acute;
    const correct = `${obtuse}°`;
    return {
      title: loc === 'el' ? 'ΓΩΝΙΕΣ ΡΟΜΒΟΥ' : 'RHOMBUS ANGLES',
      prompt: loc === 'el'
        ? `Ένας ρόμβος έχει μία οξεία γωνία ${formatNum(acute, loc)}°. Πόσες μοίρες είναι η διπλανή της (αμβλεία) γωνία;`
        : `A rhombus has an acute angle of ${formatNum(acute, loc)}°. How many degrees is the adjacent (obtuse) angle?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${obtuse + 15}°`,
        `${Math.max(10, obtuse - 15)}°`,
        `${Math.abs(90 - acute)}°`,
        `${2 * acute}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: loc === 'el' ? [
        { label: 'Σχήμα', value: 'Ρόμβος (παραλληλόγραμμο με 4 ίσες πλευρές)' },
        { label: 'Σχέση διαδοχικών', value: 'Παραπληρωματικές (άθροισμα 180°)' },
        { label: 'Πράξη', value: `180° － ${formatNum(acute, loc)}°` },
        { label: 'Αμβλεία γωνία', value: `${formatNum(obtuse, loc)}°` }
      ] : [
        { label: 'Shape', value: 'Rhombus (parallelogram with 4 equal sides)' },
        { label: 'Adjacent relation', value: 'Supplementary (sum 180°)' },
        { label: 'Calculation', value: `180° － ${formatNum(acute, loc)}°` },
        { label: 'Obtuse angle', value: `${formatNum(obtuse, loc)}°` }
      ],
      explanation: loc === 'el'
        ? `Στον ρόμβο δύο διαδοχικές γωνίες έχουν άθροισμα 180°: 180° － ${formatNum(acute, loc)}° ＝ ${formatNum(obtuse, loc)}°.`
        : `In a rhombus consecutive angles sum to 180°: 180° － ${formatNum(acute, loc)}° ＝ ${formatNum(obtuse, loc)}°.`
    };
  },
  (loc) => {
    const correct = '540°';
    return {
      title: loc === 'el' ? 'ΑΘΡΟΙΣΜΑ ΓΩΝΙΩΝ ΠΕΝΤΑΓΩΝΟΥ' : 'PENTAGON ANGLE SUM',
      prompt: loc === 'el'
        ? 'Αν ενώσουμε μία κορυφή ενός πενταγώνου με τις υπόλοιπες μη διαδοχικές κορυφές, το πεντάγωνο χωρίζεται σε 3 τρίγωνα. Πόσο είναι το συνολικό άθροισμα των γωνιών του πενταγώνου;'
        : 'By connecting one vertex of a pentagon to the other non-adjacent vertices, it is divided into 3 triangles. What is the total sum of the interior angles of a pentagon?',
      options: ensureFourUniqueOptions(correct, () => ['360°', '450°', '720°', '600°']),
      correctAnswer: correct,
      unit: '°',
      tableData: loc === 'el' ? [
        { label: 'Πλήθος τριγώνων', value: '3 τρίγωνα' },
        { label: 'Άθροισμα ανά τρίγωνο', value: '180°' },
        { label: 'Πράξη', value: '3 · 180°' },
        { label: 'Σύνολο πενταγώνου', value: '540°' }
      ] : [
        { label: 'Number of triangles', value: '3 triangles' },
        { label: 'Sum per triangle', value: '180°' },
        { label: 'Calculation', value: '3 · 180°' },
        { label: 'Pentagon sum', value: '540°' }
      ],
      explanation: loc === 'el'
        ? 'Κάθε τρίγωνο έχει άθροισμα 180°. Για 3 τρίγωνα: 3 · 180° ＝ 540°.'
        : 'Each triangle has an angle sum of 180°. For 3 triangles: 3 · 180° ＝ 540°.'
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ ΑΚΡΙΒΩΣ 10 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet(locale = 'el') {
  const qs = [];

  // Q1: Άθροισμα τριγώνου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: locale === 'el' ? 'ΑΘΡΟΙΣΜΑ ΓΩΝΙΩΝ ΤΡΙΓΩΝΟΥ' : 'TRIANGLE ANGLE SUM',
    prompt: isQ1True
      ? (locale === 'el'
          ? 'Το άθροισμα των τριών εσωτερικών γωνιών σε οποιοδήποτε τρίγωνο ισούται πάντοτε με 180°.'
          : 'The sum of the three interior angles in any triangle always equals 180°.')
      : (locale === 'el'
          ? 'Σε ένα μεγάλο τρίγωνο το άθροισμα των γωνιών είναι μεγαλύτερο από 180° επειδή έχει μακρύτερες πλευρές.'
          : 'In a large triangle the sum of interior angles exceeds 180° because its sides are longer.'),
    correctAnswer: isQ1True,
    tableData: locale === 'el' ? [
      { label: 'Κανόνας', value: 'Â ＋ B̂ ＋ Γ̂ ＝ 180°' },
      { label: 'Ισχύς', value: 'Για όλα ανεξαιρέτως τα τρίγωνα' },
      { label: 'Μήκος πλευρών', value: 'Δεν επηρεάζει το άθροισμα των γωνιών' }
    ] : [
      { label: 'Rule', value: 'Â ＋ B̂ ＋ Ĉ ＝ 180°' },
      { label: 'Applicability', value: 'Applies to all triangles without exception' },
      { label: 'Side length', value: 'Does not affect the angle sum' }
    ],
    explanation: isQ1True
      ? (locale === 'el'
          ? 'ΣΩΣΤΟ: Σε οποιοδήποτε τρίγωνο το άθροισμα των γωνιών είναι πάντα αυστηρά 180°.'
          : 'CORRECT: In every triangle the sum of angles is always strictly 180°.')
      : (locale === 'el'
          ? 'ΛΑΘΟΣ: Το άθροισμα των γωνιών κάθε τριγώνου είναι πάντοτε ακριβώς 180°, ανεξάρτητα από το μέγεθος των πλευρών του.'
          : 'FALSE: The angle sum of any triangle is always exactly 180°, regardless of arm length.')
  });

  // Q2: Άθροισμα τετραπλεύρου (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: locale === 'el' ? 'ΑΘΡΟΙΣΜΑ ΓΩΝΙΩΝ ΤΕΤΡΑΠΛΕΥΡΟΥ' : 'QUADRILATERAL ANGLE SUM',
    prompt: locale === 'el'
      ? 'Πόσο είναι πάντοτε το άθροισμα των τεσσάρων γωνιών ενός τετραπλεύρου;'
      : 'What is always the sum of the four angles of a quadrilateral?',
    options: ensureFourUniqueOptions('360°', () => ['180°', '270°', '540°', '400°']),
    correctAnswer: '360°',
    tableData: locale === 'el' ? [
      { label: 'Σχήμα', value: 'Τετράπλευρο' },
      { label: 'Διαχωρισμός', value: 'Χωρίζεται σε 2 τρίγωνα' },
      { label: 'Υπολογισμός', value: '2 · 180° ＝ 360°' }
    ] : [
      { label: 'Shape', value: 'Quadrilateral' },
      { label: 'Division', value: 'Splits into 2 triangles' },
      { label: 'Calculation', value: '2 · 180° ＝ 360°' }
    ],
    explanation: locale === 'el'
      ? 'Κάθε τετράπλευρο χωρίζεται από μία διαγώνιο σε δύο τρίγωνα, άρα το άθροισμα των γωνιών του είναι 2 · 180° ＝ 360°.'
      : 'Any quadrilateral is divided by a diagonal into two triangles: 2 · 180° ＝ 360°.'
  });

  // Q3: Δύο ορθές γωνίες σε τρίγωνο (MCQ)
  const q3Correct = locale === 'el'
    ? 'Όχι, γιατί δύο ορθές δίνουν ήδη 180° και δεν μένουν μοίρες για την τρίτη γωνία'
    : 'No, because two right angles already equal 180°, leaving 0° for the third angle';
  qs.push({
    id: 3,
    type: 'mcq',
    title: locale === 'el' ? 'ΟΡΘΕΣ ΓΩΝΙΕΣ ΣΕ ΤΡΙΓΩΝΟ' : 'RIGHT ANGLES IN A TRIANGLE',
    prompt: locale === 'el'
      ? 'Μπορεί ένα τρίγωνο να έχει δύο ορθές γωνίες (90° και 90°);'
      : 'Can a triangle have two right angles (90° and 90°)?',
    options: ensureFourUniqueOptions(q3Correct, () => locale === 'el'
      ? [
          'Ναι, αν το τρίγωνο είναι πολύ μεγάλο',
          'Ναι, σε κάθε ορθογώνιο τρίγωνο',
          'Ναι, μόνο αν είναι ισοσκελές'
        ]
      : [
          'Yes, if the triangle is very large',
          'Yes, in every right-angled triangle',
          'Yes, only if it is isosceles'
        ]
    ),
    correctAnswer: q3Correct,
    tableData: locale === 'el' ? [
      { label: 'Υπόθεση', value: '2 ορθές ＝ 90° ＋ 90° ＝ 180°' },
      { label: 'Τρίτη γωνία', value: '180° － 180° ＝ 0° (αδύνατο)' },
      { label: 'Συμπέρασμα', value: 'Ένα τρίγωνο έχει το πολύ μία ορθή γωνία' }
    ] : [
      { label: 'Hypothesis', value: '2 right angles ＝ 90° ＋ 90° ＝ 180°' },
      { label: 'Third angle', value: '180° － 180° ＝ 0° (impossible)' },
      { label: 'Conclusion', value: 'A triangle can have at most one right angle' }
    ],
    explanation: locale === 'el'
      ? 'Αν δύο γωνίες ήταν 90°, το άθροισμά τους θα ήταν 180°, οπότε η τρίτη γωνία θα έπρεπε να είναι 0°, πράγμα αδύνατο.'
      : 'If two angles were 90°, their sum would be 180°, forcing the third angle to be 0°, which is impossible.'
  });

  // Q4: Οπτική αναγνώριση ορθογωνίου τριγώνου (SVG - No Giveaway)
  const q4Correct = locale === 'el' ? 'Ορθογώνιο τρίγωνο' : 'Right-angled triangle';
  qs.push({
    id: 4,
    type: 'mcq',
    title: locale === 'el' ? 'ΑΝΑΓΝΩΡΙΣΗ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ' : 'IDENTIFYING RIGHT TRIANGLE',
    prompt: locale === 'el'
      ? 'Παρατηρήστε το παρακάτω τρίγωνο. Τι είδους τρίγωνο είναι ως προς τις γωνίες του;'
      : 'Observe the triangle below. What type of triangle is it based on its angles?',
    svg: (
      <svg viewBox="0 0 160 120" className="w-40 h-28 max-w-full mx-auto my-2 select-none drop-shadow-sm">
        <polygon points="25,95 135,95 25,25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="25" y="80" width="15" height="15" fill="none" stroke="#e11d48" strokeWidth="2" />
        <circle cx="25" cy="95" r="3.5" fill="#e11d48" />
        <circle cx="135" cy="95" r="3.5" fill="#4f46e5" />
        <circle cx="25" cy="25" r="3.5" fill="#4f46e5" />
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => locale === 'el'
      ? ['Οξυγώνιο τρίγωνο', 'Αμβλυγώνιο τρίγωνο', 'Ισόπλευρο τρίγωνο']
      : ['Acute triangle', 'Obtuse triangle', 'Equilateral triangle']
    ),
    correctAnswer: q4Correct,
    tableData: locale === 'el' ? [
      { label: 'Χαρακτηριστικό', value: 'Περιέχει μία ορθή γωνία 90° (κόκκινο τετραγωνάκι)' },
      { label: 'Είδος', value: 'Ορθογώνιο τρίγωνο' }
    ] : [
      { label: 'Feature', value: 'Contains one 90° angle (red square symbol)' },
      { label: 'Type', value: 'Right-angled triangle' }
    ],
    explanation: locale === 'el'
      ? 'Το σύμβολο του τετραγώνου στην κορυφή υποδηλώνει ορθή γωνία (90°), άρα το τρίγωνο είναι ορθογώνιο.'
      : 'The square corner symbol indicates a right angle (90°), classifying it as a right-angled triangle.'
  });

  // Q5: Υπολογισμός 3ης γωνίας τριγώνου (Input αριθμού)
  const a5 = randInt(45, 65);
  const b5 = randInt(50, 70);
  const c5 = 180 - (a5 + b5);
  qs.push({
    id: 5,
    type: 'input',
    title: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΤΡΙΤΗΣ ΓΩΝΙΑΣ ΤΡΙΓΩΝΟΥ' : 'CALCULATING 3RD TRIANGLE ANGLE',
    prompt: locale === 'el'
      ? `Σε ένα τρίγωνο οι δύο γωνίες είναι ${formatNum(a5, locale)}° και ${formatNum(b5, locale)}°. Πόσες μοίρες είναι η τρίτη γωνία; (Γράψτε μόνο τον αριθμό)`
      : `In a triangle, two angles measure ${formatNum(a5, locale)}° and ${formatNum(b5, locale)}°. How many degrees is the third angle? (Write number only)`,
    correctAnswer: String(c5),
    tableData: locale === 'el' ? [
      { label: 'Άθροισμα τριγώνου', value: '180°' },
      { label: 'Άθροισμα 2 γνωστών', value: `${formatNum(a5, locale)}° ＋ ${formatNum(b5, locale)}° ＝ ${formatNum(a5 + b5, locale)}°` },
      { label: 'Πράξη', value: `180° － ${formatNum(a5 + b5, locale)}° ＝ ${formatNum(c5, locale)}°` }
    ] : [
      { label: 'Triangle sum', value: '180°' },
      { label: 'Sum of 2 known', value: `${formatNum(a5, locale)}° ＋ ${formatNum(b5, locale)}° ＝ ${formatNum(a5 + b5, locale)}°` },
      { label: 'Calculation', value: `180° － ${formatNum(a5 + b5, locale)}° ＝ ${formatNum(c5, locale)}°` }
    ],
    explanation: locale === 'el'
      ? `Αφαιρούμε από το 180° το άθροισμα των δύο γνωστών γωνιών: 180° － (${formatNum(a5, locale)}° ＋ ${formatNum(b5, locale)}°) ＝ ${formatNum(c5, locale)}°.`
      : `Subtract the sum of the two angles from 180°: 180° － (${formatNum(a5, locale)}° ＋ ${formatNum(b5, locale)}°) ＝ ${formatNum(c5, locale)}°.`
  });

  // Q6: Υπολογισμός 4ης γωνίας τετραπλεύρου (Input αριθμού)
  const a6 = randInt(80, 110);
  const b6 = randInt(85, 115);
  const c6 = randInt(70, 95);
  const d6 = 360 - (a6 + b6 + c6);
  qs.push({
    id: 6,
    type: 'input',
    title: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΤΕΤΑΡΤΗΣ ΓΩΝΙΑΣ ΤΕΤΡΑΠΛΕΥΡΟΥ' : 'CALCULATING 4TH QUADRILATERAL ANGLE',
    prompt: locale === 'el'
      ? `Σε ένα τετράπλευρο οι τρεις γωνίες είναι ${formatNum(a6, locale)}°, ${formatNum(b6, locale)}° και ${formatNum(c6, locale)}°. Πόσες μοίρες είναι η τέταρτη γωνία του; (Γράψτε μόνο τον αριθμό)`
      : `In a quadrilateral, three angles measure ${formatNum(a6, locale)}°, ${formatNum(b6, locale)}°, and ${formatNum(c6, locale)}°. How many degrees is the fourth angle? (Write number only)`,
    correctAnswer: String(d6),
    tableData: locale === 'el' ? [
      { label: 'Άθροισμα τετραπλεύρου', value: '360°' },
      { label: 'Άθροισμα 3 γνωστών', value: `${formatNum(a6, locale)}° ＋ ${formatNum(b6, locale)}° ＋ ${formatNum(c6, locale)}° ＝ ${formatNum(a6 + b6 + c6, locale)}°` },
      { label: 'Πράξη', value: `360° － ${formatNum(a6 + b6 + c6, locale)}° ＝ ${formatNum(d6, locale)}°` }
    ] : [
      { label: 'Quadrilateral sum', value: '360°' },
      { label: 'Sum of 3 known', value: `${formatNum(a6, locale)}° ＋ ${formatNum(b6, locale)}° ＋ ${formatNum(c6, locale)}° ＝ ${formatNum(a6 + b6 + c6, locale)}°` },
      { label: 'Calculation', value: `360° － ${formatNum(a6 + b6 + c6, locale)}° ＝ ${formatNum(d6, locale)}°` }
    ],
    explanation: locale === 'el'
      ? `Αφαιρούμε από το 360° το άθροισμα των τριών γνωστών γωνιών: 360° － ${formatNum(a6 + b6 + c6, locale)}° ＝ ${formatNum(d6, locale)}°.`
      : `Subtract the sum of the three known angles from 360°: 360° － ${formatNum(a6 + b6 + c6, locale)}° ＝ ${formatNum(d6, locale)}°.`
  });

  // Q7: Πρόβλημα από PROBLEM_POOL_Q7 (Τρίγωνα)
  const p7 = PROBLEM_POOL_Q7[randInt(0, PROBLEM_POOL_Q7.length - 1)](locale);
  qs.push({ id: 7, type: 'mcq', ...p7 });

  // Q8: Πρόβλημα από PROBLEM_POOL_Q8 (Ισοσκελή & Ισόπλευρα)
  const p8 = PROBLEM_POOL_Q8[randInt(0, PROBLEM_POOL_Q8.length - 1)](locale);
  qs.push({ id: 8, type: 'mcq', ...p8 });

  // Q9: Πρόβλημα από PROBLEM_POOL_Q9 (Τετράπλευρα)
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

export default function AthroismaGonionAskiseisPage() {
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
      headTitle: "Ασκήσεις: Άθροισμα Γωνιών Τριγώνου & Τετραπλεύρου - ΣΤ' Δημοτικού | LearnMaths.gr",
      headDesc: "Διαδραστικές ασκήσεις στην κατασκευή γωνιών και στους κανόνες των 180° και 360° για τρίγωνα και τετράπλευρα για τη ΣΤ' Δημοτικού.",
      backTheory: "Θεωρία Κεφ. 69",
      btnTheory: "📖 Θεωρία",
      badge: "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 69 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Ασκήσεις: Άθροισμα Γωνιών Τριγώνου και Τετραπλεύρου",
      heroDesc: "Εξασκηθείτε στην κατασκευή γωνιών και στους κανόνες των 180° και 360° μέσα από 10 δυναμικές ερωτήσεις και πλούσια προβλήματα.",
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
      headTitle: "Exercises: Angle Sums of Triangles & Quadrilaterals - 6th Grade | LearnMaths.gr",
      headDesc: "Interactive exercises on angle construction and 180° and 360° theorems for triangles and quadrilaterals for 6th Grade.",
      backTheory: "Theory Chap. 69",
      btnTheory: "📖 Theory",
      badge: "EXERCISES • CHAPTER 69 • 6TH GRADE",
      heroTitle: "Exercises: Angle Sums of Triangles and Quadrilaterals",
      heroDesc: "Practice angle construction and the 180° and 360° rules through 10 dynamic questions and real-world problems.",
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
      backUrl="/st-dimotikou/69-athroisma-gonion"
      backText={ui.backTheory}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/69-athroisma-gonion"
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
// pages/st-dimotikou/67-sximata-ask.js
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
    [arr[j], arr[i]] = [arr[i], arr[j]];
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

// POOL ΓΙΑ Q7: Περίμετρος Κανονικών Πολυγώνων
const PROBLEM_POOL_Q7 = [
  (loc) => {
    const side = randInt(4, 15);
    const ansVal = 8 * side;
    const correct = `${ansVal} cm`;
    return {
      title: loc === 'el' ? 'ΠΕΡΙΜΕΤΡΟΣ ΚΑΝΟΝΙΚΟΥ ΟΚΤΑΓΩΝΟΥ' : 'PERIMETER OF REGULAR OCTAGON',
      prompt: loc === 'el'
        ? `Μια διακοσμητική πινακίδα έχει σχήμα κανονικού οκταγώνου με μήκος κάθε πλευράς ${formatNum(side, loc)} cm. Πόση είναι η συνολική περίμετρος της πινακίδας;`
        : `A decorative plaque is shaped as a regular octagon with each side measuring ${formatNum(side, loc)} cm. What is the total perimeter of the plaque?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${ansVal + 8} cm`,
        `${Math.max(8, ansVal - 8)} cm`,
        `${6 * side} cm`,
        `${ansVal + 16} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: loc === 'el' ? [
        { label: 'Σχήμα', value: 'Κανονικό οκτάγωνο (8 ίσες πλευρές)' },
        { label: 'Μήκος πλευράς', value: `${formatNum(side, loc)} cm` },
        { label: 'Πράξη', value: `8 · ${formatNum(side, loc)} cm` },
        { label: 'Περίμετρος', value: `${formatNum(ansVal, loc)} cm` }
      ] : [
        { label: 'Shape', value: 'Regular octagon (8 equal sides)' },
        { label: 'Side length', value: `${formatNum(side, loc)} cm` },
        { label: 'Calculation', value: `8 · ${formatNum(side, loc)} cm` },
        { label: 'Perimeter', value: `${formatNum(ansVal, loc)} cm` }
      ],
      explanation: loc === 'el'
        ? `Σε κάθε κανονικό οκτάγωνο όλες οι 8 πλευρές είναι ίσες: 8 · ${formatNum(side, loc)} ＝ ${formatNum(ansVal, loc)} cm.`
        : `In a regular octagon all 8 sides are equal: 8 · ${formatNum(side, loc)} ＝ ${formatNum(ansVal, loc)} cm.`
    };
  },
  (loc) => {
    const side = randInt(7, 25);
    const perim = 3 * side;
    const correct = `${perim} cm`;
    return {
      title: loc === 'el' ? 'ΠΕΡΙΜΕΤΡΟΣ ΙΣΟΠΛΕΥΡΟΥ ΤΡΙΓΩΝΟΥ' : 'PERIMETER OF EQUILATERAL TRIANGLE',
      prompt: loc === 'el'
        ? `Ένα ισόπλευρο τρίγωνο έχει μήκος πλευράς ${formatNum(side, loc)} cm. Πόση είναι η περίμετρός του;`
        : `An equilateral triangle has a side length of ${formatNum(side, loc)} cm. What is its perimeter?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${perim + 3} cm`,
        `${Math.max(3, perim - 3)} cm`,
        `${4 * side} cm`,
        `${2 * side} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: loc === 'el' ? [
        { label: 'Σχήμα', value: 'Ισόπλευρο τρίγωνο (3 ίσες πλευρές)' },
        { label: 'Μήκος πλευράς', value: `${formatNum(side, loc)} cm` },
        { label: 'Πράξη', value: `3 · ${formatNum(side, loc)} cm` },
        { label: 'Περίμετρος', value: `${formatNum(perim, loc)} cm` }
      ] : [
        { label: 'Shape', value: 'Equilateral triangle (3 equal sides)' },
        { label: 'Side length', value: `${formatNum(side, loc)} cm` },
        { label: 'Calculation', value: `3 · ${formatNum(side, loc)} cm` },
        { label: 'Perimeter', value: `${formatNum(perim, loc)} cm` }
      ],
      explanation: loc === 'el'
        ? `Το ισόπλευρο τρίγωνο έχει 3 ίσες πλευρές: 3 · ${formatNum(side, loc)} cm ＝ ${formatNum(perim, loc)} cm.`
        : `An equilateral triangle has 3 equal sides: 3 · ${formatNum(side, loc)} cm ＝ ${formatNum(perim, loc)} cm.`
    };
  },
  (loc) => {
    const side = randInt(5, 14);
    const perim = 6 * side;
    const correct = `${perim} m`;
    return {
      title: loc === 'el' ? 'ΠΕΡΙΜΕΤΡΟΣ ΚΑΝΟΝΙΚΟΥ ΕΞΑΓΩΝΟΥ' : 'PERIMETER OF REGULAR HEXAGON',
      prompt: loc === 'el'
        ? `Ένας κήπος έχει σχήμα κανονικού εξαγώνου με πλευρά ${formatNum(side, loc)} m. Πόσα μέτρα περίφραξης χρειάζονται για να περιφραχτεί πλήρως;`
        : `A garden is shaped as a regular hexagon with side length ${formatNum(side, loc)} m. How many meters of fencing are needed to enclose it?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${perim + 6} m`,
        `${Math.max(6, perim - 6)} m`,
        `${5 * side} m`,
        `${perim + 12} m`
      ]),
      correctAnswer: correct,
      unit: 'm',
      tableData: loc === 'el' ? [
        { label: 'Σχήμα', value: 'Κανονικό εξάγωνο (6 ίσες πλευρές)' },
        { label: 'Μήκος πλευράς', value: `${formatNum(side, loc)} m` },
        { label: 'Πράξη', value: `6 · ${formatNum(side, loc)} m` },
        { label: 'Περίμετρος', value: `${formatNum(perim, loc)} m` }
      ] : [
        { label: 'Shape', value: 'Regular hexagon (6 equal sides)' },
        { label: 'Side length', value: `${formatNum(side, loc)} m` },
        { label: 'Calculation', value: `6 · ${formatNum(side, loc)} m` },
        { label: 'Perimeter', value: `${formatNum(perim, loc)} m` }
      ],
      explanation: loc === 'el'
        ? `Το κανονικό εξάγωνο έχει 6 ίσες πλευρές: 6 · ${formatNum(side, loc)} m ＝ ${formatNum(perim, loc)} m.`
        : `A regular hexagon has 6 equal sides: 6 · ${formatNum(side, loc)} m ＝ ${formatNum(perim, loc)} m.`
    };
  }
];

// POOL ΓΙΑ Q8: Εύρεση Πλευράς ή Κόστους από Περίμετρο
const PROBLEM_POOL_Q8 = [
  (loc) => {
    const side = randInt(6, 20);
    const perimeter = 5 * side;
    const correct = `${side} m`;
    return {
      title: loc === 'el' ? 'ΠΛΕΥΡΑ ΚΑΝΟΝΙΚΟΥ ΠΕΝΤΑΓΩΝΟΥ' : 'SIDE OF REGULAR PENTAGON',
      prompt: loc === 'el'
        ? `Ένα παρτέρι σε σχήμα κανονικού πενταγώνου έχει περίμετρο ${formatNum(perimeter, loc)} m. Ποιο είναι το μήκος κάθε πλευράς του;`
        : `A garden bed shaped as a regular pentagon has a perimeter of ${formatNum(perimeter, loc)} m. What is the length of each side?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${side + 2} m`,
        `${Math.max(1, side - 2)} m`,
        `${side + 4} m`,
        `${Math.round(perimeter / 4)} m`
      ]),
      correctAnswer: correct,
      unit: 'm',
      fractionData: { n: formatNum(perimeter, loc), d: '5', res: `${formatNum(side, loc)} m` },
      tableData: loc === 'el' ? [
        { label: 'Σχήμα', value: 'Κανονικό πεντάγωνο (5 ίσες πλευρές)' },
        { label: 'Περίμετρος', value: `${formatNum(perimeter, loc)} m` },
        { label: 'Πράξη', value: `${formatNum(perimeter, loc)} : 5` },
        { label: 'Μήκος πλευράς', value: `${formatNum(side, loc)} m` }
      ] : [
        { label: 'Shape', value: 'Regular pentagon (5 equal sides)' },
        { label: 'Perimeter', value: `${formatNum(perimeter, loc)} m` },
        { label: 'Calculation', value: `${formatNum(perimeter, loc)} : 5` },
        { label: 'Side length', value: `${formatNum(side, loc)} m` }
      ],
      explanation: loc === 'el'
        ? `Διαιρούμε την περίμετρο με το 5: ${formatNum(perimeter, loc)} : 5 ＝ ${formatNum(side, loc)} m.`
        : `Divide the perimeter by 5: ${formatNum(perimeter, loc)} : 5 ＝ ${formatNum(side, loc)} m.`
    };
  },
  (loc) => {
    const side = randInt(5, 12);
    const perim = 6 * side;
    const costPerM = randInt(8, 15);
    const totalCost = perim * costPerM;
    const correct = `${totalCost} €`;
    return {
      title: loc === 'el' ? 'ΚΟΣΤΟΣ ΠΕΡΙΦΡΑΞΗΣ ΕΞΑΓΩΝΟΥ' : 'FENCING COST OF HEXAGON',
      prompt: loc === 'el'
        ? `Ένα οικόπεδο έχει σχήμα κανονικού εξαγώνου με πλευρά ${formatNum(side, loc)} m. Θέλουμε να το περιφράξουμε με πλέγμα που κοστίζει ${formatNum(costPerM, loc)} € το μέτρο. Πόσο θα κοστίσει η περίφραξη;`
        : `A plot of land is shaped as a regular hexagon with side length ${formatNum(side, loc)} m. We want to fence it with mesh costing ${formatNum(costPerM, loc)} € per meter. What is the total cost?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${totalCost + costPerM * 2} €`,
        `${Math.max(10, totalCost - costPerM * 2)} €`,
        `${perim * (costPerM + 2)} €`,
        `${5 * side * costPerM} €`
      ]),
      correctAnswer: correct,
      unit: '€',
      tableData: loc === 'el' ? [
        { label: 'Μήκος πλευράς', value: `${formatNum(side, loc)} m` },
        { label: 'Περίμετρος', value: `6 · ${formatNum(side, loc)} ＝ ${formatNum(perim, loc)} m` },
        { label: 'Κόστος ανά μέτρο', value: `${formatNum(costPerM, loc)} €/m` },
        { label: 'Συνολικό κόστος', value: `${formatNum(perim, loc)} · ${formatNum(costPerM, loc)} ＝ ${formatNum(totalCost, loc)} €` }
      ] : [
        { label: 'Side length', value: `${formatNum(side, loc)} m` },
        { label: 'Perimeter', value: `6 · ${formatNum(side, loc)} ＝ ${formatNum(perim, loc)} m` },
        { label: 'Cost per meter', value: `${formatNum(costPerM, loc)} €/m` },
        { label: 'Total cost', value: `${formatNum(perim, loc)} · ${formatNum(costPerM, loc)} ＝ ${formatNum(totalCost, loc)} €` }
      ],
      explanation: loc === 'el'
        ? `Περίμετρος: 6 · ${formatNum(side, loc)} m ＝ ${formatNum(perim, loc)} m. Κόστος: ${formatNum(perim, loc)} · ${formatNum(costPerM, loc)} € ＝ ${formatNum(totalCost, loc)} €.`
        : `Perimeter: 6 · ${formatNum(side, loc)} m ＝ ${formatNum(perim, loc)} m. Cost: ${formatNum(perim, loc)} · ${formatNum(costPerM, loc)} € ＝ ${formatNum(totalCost, loc)} €.`
    };
  },
  (loc) => {
    const side = randInt(5, 15);
    const perimeter = 8 * side;
    const correct = `${side} cm`;
    return {
      title: loc === 'el' ? 'ΠΛΕΥΡΑ ΚΑΝΟΝΙΚΟΥ ΟΚΤΑΓΩΝΟΥ' : 'SIDE OF REGULAR OCTAGON',
      prompt: loc === 'el'
        ? `Μια οκταγωνική κορνίζα (κανονικό οκτάγωνο) έχει συνολική περίμετρο ${formatNum(perimeter, loc)} cm. Πόσο είναι το μήκος καθεμιάς από τις 8 πλευρές της;`
        : `An octagonal frame (regular octagon) has a total perimeter of ${formatNum(perimeter, loc)} cm. What is the length of each of its 8 sides?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${side + 2} cm`,
        `${Math.max(1, side - 2)} cm`,
        `${side + 4} cm`,
        `${Math.round(perimeter / 6)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      fractionData: { n: formatNum(perimeter, loc), d: '8', res: `${formatNum(side, loc)} cm` },
      tableData: loc === 'el' ? [
        { label: 'Περίμετρος', value: `${formatNum(perimeter, loc)} cm` },
        { label: 'Πλήθος ίσων πλευρών', value: '8' },
        { label: 'Πράξη', value: `${formatNum(perimeter, loc)} : 8` },
        { label: 'Μήκος πλευράς', value: `${formatNum(side, loc)} cm` }
      ] : [
        { label: 'Perimeter', value: `${formatNum(perimeter, loc)} cm` },
        { label: 'Number of equal sides', value: '8' },
        { label: 'Calculation', value: `${formatNum(perimeter, loc)} : 8` },
        { label: 'Side length', value: `${formatNum(side, loc)} cm` }
      ],
      explanation: loc === 'el'
        ? `Διαιρούμε την περίμετρο με το 8: ${formatNum(perimeter, loc)} : 8 ＝ ${formatNum(side, loc)} cm.`
        : `Divide perimeter by 8: ${formatNum(perimeter, loc)} : 8 ＝ ${formatNum(side, loc)} cm.`
    };
  }
];

// POOL ΓΙΑ Q9: Διαγώνιοι από 1 Κορυφή ή Σύνολο Διαγωνίων
const PROBLEM_POOL_Q9 = [
  (loc) => {
    const n = 6;
    const total = (n * (n - 3)) / 2;
    const correct = loc === 'el' ? `${total} διαγώνιοι` : `${total} diagonals`;
    return {
      title: loc === 'el' ? 'ΣΥΝΟΛΙΚΕΣ ΔΙΑΓΩΝΙΟΙ ΕΞΑΓΩΝΟΥ' : 'TOTAL DIAGONALS OF HEXAGON',
      prompt: loc === 'el'
        ? 'Πόσες διαγωνίους έχει συνολικά ένα εξάγωνο;'
        : 'How many diagonals does a hexagon have in total?',
      options: ensureFourUniqueOptions(correct, () => loc === 'el'
        ? ['6 διαγώνιοι', '12 διαγώνιοι', '18 διαγώνιοι', '8 διαγώνιοι']
        : ['6 diagonals', '12 diagonals', '18 diagonals', '8 diagonals']
      ),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Κορυφές (ν)', value: '6' },
        { label: 'Από μία κορυφή (ν － 3)', value: '6 － 3 ＝ 3' },
        { label: 'Τύπος', value: '[ν · (ν － 3)] : 2' },
        { label: 'Υπολογισμός', value: '(6 · 3) : 2 ＝ 18 : 2 ＝ 9' }
      ] : [
        { label: 'Vertices (n)', value: '6' },
        { label: 'From one vertex (n － 3)', value: '6 － 3 ＝ 3' },
        { label: 'Formula', value: '[n · (n － 3)] : 2' },
        { label: 'Calculation', value: '(6 · 3) : 2 ＝ 18 : 2 ＝ 9' }
      ],
      fractionData: { n: '6 · (6 － 3)', d: '2', res: '9' },
      explanation: loc === 'el'
        ? 'Εφαρμόζουμε τον τύπο διαγωνίων: [6 · (6 － 3)] : 2 ＝ (6 · 3) : 2 ＝ 18 : 2 ＝ 9 διαγώνιοι.'
        : 'Apply diagonal formula: [6 · (6 － 3)] : 2 ＝ (6 · 3) : 2 ＝ 18 : 2 ＝ 9 diagonals.'
    };
  },
  (loc) => {
    const n = 8;
    const total = (n * (n - 3)) / 2;
    const correct = loc === 'el' ? `${total} διαγώνιοι` : `${total} diagonals`;
    return {
      title: loc === 'el' ? 'ΣΥΝΟΛΙΚΕΣ ΔΙΑΓΩΝΙΟΙ ΟΚΤΑΓΩΝΟΥ' : 'TOTAL DIAGONALS OF OCTAGON',
      prompt: loc === 'el'
        ? 'Πόσες διαγωνίους έχει συνολικά ένα οκτάγωνο (8 πλευρές);'
        : 'How many diagonals does an octagon (8 sides) have in total?',
      options: ensureFourUniqueOptions(correct, () => loc === 'el'
        ? ['16 διαγώνιοι', '24 διαγώνιοι', '40 διαγώνιοι', '10 διαγώνιοι']
        : ['16 diagonals', '24 diagonals', '40 diagonals', '10 diagonals']
      ),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Κορυφές (ν)', value: '8' },
        { label: 'Από μία κορυφή (ν － 3)', value: '8 － 3 ＝ 5' },
        { label: 'Τύπος', value: '[ν · (ν － 3)] : 2' },
        { label: 'Υπολογισμός', value: '[8 · 5] : 2 ＝ 40 : 2 ＝ 20' }
      ] : [
        { label: 'Vertices (n)', value: '8' },
        { label: 'From one vertex (n － 3)', value: '8 － 3 ＝ 5' },
        { label: 'Formula', value: '[n · (n － 3)] : 2' },
        { label: 'Calculation', value: '[8 · 5] : 2 ＝ 40 : 2 ＝ 20' }
      ],
      fractionData: { n: '8 · (8 － 3)', d: '2', res: '20' },
      explanation: loc === 'el'
        ? '[8 · (8 － 3)] : 2 ＝ (8 · 5) : 2 ＝ 40 : 2 ＝ 20 διαγώνιοι.'
        : '[8 · (8 － 3)] : 2 ＝ (8 · 5) : 2 ＝ 40 : 2 ＝ 20 diagonals.'
    };
  },
  (loc) => {
    const n = 7;
    const total = (n * (n - 3)) / 2;
    const correct = loc === 'el' ? `${total} διαγώνιοι` : `${total} diagonals`;
    return {
      title: loc === 'el' ? 'ΣΥΝΟΛΙΚΕΣ ΔΙΑΓΩΝΙΟΙ ΕΠΤΑΓΩΝΟΥ' : 'TOTAL DIAGONALS OF HEPTAGON',
      prompt: loc === 'el'
        ? 'Πόσες διαγωνίους έχει συνολικά ένα επτάγωνο (7 πλευρές);'
        : 'How many diagonals does a heptagon (7 sides) have in total?',
      options: ensureFourUniqueOptions(correct, () => loc === 'el'
        ? ['7 διαγώνιοι', '21 διαγώνιοι', '28 διαγώνιοι', '10 διαγώνιοι']
        : ['7 diagonals', '21 diagonals', '28 diagonals', '10 diagonals']
      ),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Κορυφές (ν)', value: '7' },
        { label: 'Από μία κορυφή', value: '7 － 3 ＝ 4' },
        { label: 'Τύπος', value: '[ν · (ν － 3)] : 2' },
        { label: 'Υπολογισμός', value: '(7 · 4) : 2 ＝ 28 : 2 ＝ 14' }
      ] : [
        { label: 'Vertices (n)', value: '7' },
        { label: 'From one vertex', value: '7 － 3 ＝ 4' },
        { label: 'Formula', value: '[n · (n － 3)] : 2' },
        { label: 'Calculation', value: '(7 · 4) : 2 ＝ 28 : 2 ＝ 14' }
      ],
      fractionData: { n: '7 · (7 － 3)', d: '2', res: '14' },
      explanation: loc === 'el'
        ? '[7 · (7 － 3)] : 2 ＝ (7 · 4) : 2 ＝ 28 : 2 ＝ 14 διαγώνιοι.'
        : '[7 · (7 － 3)] : 2 ＝ (7 · 4) : 2 ＝ 28 : 2 ＝ 14 diagonals.'
    };
  }
];

// POOL ΓΙΑ Q10: Σύνθετα Προβλήματα Πολυγώνων
const PROBLEM_POOL_Q10 = [
  (loc) => {
    const n = 10;
    const total = (n * (n - 3)) / 2;
    const correct = loc === 'el' ? `${total} διαγώνιοι` : `${total} diagonals`;
    return {
      title: loc === 'el' ? 'ΔΙΑΓΩΝΙΟΙ ΔΕΚΑΓΩΝΟΥ' : 'DIAGONALS OF DECAGON',
      prompt: loc === 'el'
        ? 'Σε μια άσκηση γεωμετρίας μελετάμε ένα δεκάγωνο (10 κορυφές). Πόσες διαγωνίους έχει συνολικά το σχήμα αυτό;'
        : 'In a geometry task we study a decagon (10 vertices). How many diagonals does this figure have in total?',
      options: ensureFourUniqueOptions(correct, () => loc === 'el'
        ? ['70 διαγώνιοι', '30 διαγώνιοι', '25 διαγώνιοι', '40 διαγώνιοι']
        : ['70 diagonals', '30 diagonals', '25 diagonals', '40 diagonals']
      ),
      correctAnswer: correct,
      tableData: loc === 'el' ? [
        { label: 'Κορυφές (ν)', value: '10' },
        { label: 'Από 1 κορυφή', value: '10 － 3 ＝ 7' },
        { label: 'Τύπος', value: '[ν · (ν － 3)] : 2' },
        { label: 'Υπολογισμός', value: '(10 · 7) : 2 ＝ 70 : 2 ＝ 35' }
      ] : [
        { label: 'Vertices (n)', value: '10' },
        { label: 'From 1 vertex', value: '10 － 3 ＝ 7' },
        { label: 'Formula', value: '[n · (n － 3)] : 2' },
        { label: 'Calculation', value: '(10 · 7) : 2 ＝ 70 : 2 ＝ 35' }
      ],
      fractionData: { n: '10 · (10 － 3)', d: '2', res: '35' },
      explanation: loc === 'el'
        ? '[10 · (10 － 3)] : 2 ＝ (10 · 7) : 2 ＝ 70 : 2 ＝ 35 διαγώνιοι.'
        : '[10 · (10 － 3)] : 2 ＝ (10 · 7) : 2 ＝ 70 : 2 ＝ 35 diagonals.'
    };
  },
  (loc) => {
    const sideSq = randInt(10, 16);
    const perimSq = 4 * sideSq;
    const sideOct = randInt(4, 7);
    const perimOct = 8 * sideOct;
    const diff = Math.abs(perimSq - perimOct);
    const correct = `${diff} cm`;
    return {
      title: loc === 'el' ? 'ΣΥΓΚΡΙΣΗ ΠΕΡΙΜΕΤΡΩΝ ΠΟΛΥΓΩΝΩΝ' : 'PERIMETER COMPARISON',
      prompt: loc === 'el'
        ? `Ένα τετράγωνο έχει πλευρά ${formatNum(sideSq, loc)} cm και ένα κανονικό οκτάγωνο έχει πλευρά ${formatNum(sideOct, loc)} cm. Πόσο διαφέρουν οι περίμετροι των δύο σχημάτων;`
        : `A square has a side of ${formatNum(sideSq, loc)} cm and a regular octagon has a side of ${formatNum(sideOct, loc)} cm. What is the difference between their perimeters?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${diff + 4} cm`,
        `${diff + 8} cm`,
        `${Math.max(1, diff - 2)} cm`,
        `${perimSq} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: loc === 'el' ? [
        { label: 'Περίμετρος τετραγώνου', value: `4 · ${formatNum(sideSq, loc)} ＝ ${formatNum(perimSq, loc)} cm` },
        { label: 'Περίμετρος οκταγώνου', value: `8 · ${formatNum(sideOct, loc)} ＝ ${formatNum(perimOct, loc)} cm` },
        { label: 'Διαφορά', value: `${formatNum(Math.max(perimSq, perimOct), loc)} － ${formatNum(Math.min(perimSq, perimOct), loc)} ＝ ${formatNum(diff, loc)} cm` }
      ] : [
        { label: 'Square perimeter', value: `4 · ${formatNum(sideSq, loc)} ＝ ${formatNum(perimSq, loc)} cm` },
        { label: 'Octagon perimeter', value: `8 · ${formatNum(sideOct, loc)} ＝ ${formatNum(perimOct, loc)} cm` },
        { label: 'Difference', value: `${formatNum(Math.max(perimSq, perimOct), loc)} － ${formatNum(Math.min(perimSq, perimOct), loc)} ＝ ${formatNum(diff, loc)} cm` }
      ],
      explanation: loc === 'el'
        ? `Τετράγωνο: 4 · ${formatNum(sideSq, loc)} ＝ ${formatNum(perimSq, loc)} cm. Οκτάγωνο: 8 · ${formatNum(sideOct, loc)} ＝ ${formatNum(perimOct, loc)} cm. Διαφορά: ${formatNum(diff, loc)} cm.`
        : `Square: 4 · ${formatNum(sideSq, loc)} ＝ ${formatNum(perimSq, loc)} cm. Octagon: 8 · ${formatNum(sideOct, loc)} ＝ ${formatNum(perimOct, loc)} cm. Difference: ${formatNum(diff, loc)} cm.`
    };
  },
  (loc) => {
    const side = randInt(4, 9);
    const totalPerim = 8 * side;
    const correct = `${totalPerim} cm`;
    return {
      title: loc === 'el' ? 'ΠΕΡΙΜΕΤΡΟΣ ΣΥΝΘΕΤΟΥ ΣΧΗΜΑΤΟΣ' : 'COMPOSITE SHAPE PERIMETER',
      prompt: loc === 'el'
        ? `Ενώνουμε δύο ίσα κανονικά πεντάγωνα κατά μήκος μίας κοινής πλευράς τους. Αν η πλευρά κάθε πενταγώνου είναι ${formatNum(side, loc)} cm, πόση είναι η περίμετρος του νέου σχήματος που προκύπτει;`
        : `We join two identical regular pentagons along one shared side. If each side is ${formatNum(side, loc)} cm, what is the perimeter of the resulting composite shape?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${10 * side} cm`,
        `${9 * side} cm`,
        `${7 * side} cm`,
        `${totalPerim + 4} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: loc === 'el' ? [
        { label: 'Αρχικές πλευρές', value: '2 πεντάγωνα · 5 ＝ 10 πλευρές' },
        { label: 'Κοινή εσωτερική πλευρά', value: '2 πλευρές γίνονται εσωτερικές' },
        { label: 'Εξωτερικές πλευρές', value: '10 － 2 ＝ 8 πλευρές' },
        { label: 'Περίμετρος', value: `8 · ${formatNum(side, loc)} cm ＝ ${formatNum(totalPerim, loc)} cm` }
      ] : [
        { label: 'Initial sides', value: '2 pentagons · 5 ＝ 10 sides' },
        { label: 'Shared inner side', value: '2 sides become internal' },
        { label: 'Boundary sides', value: '10 － 2 ＝ 8 sides' },
        { label: 'Perimeter', value: `8 · ${formatNum(side, loc)} cm ＝ ${formatNum(totalPerim, loc)} cm` }
      ],
      explanation: loc === 'el'
        ? `Η κοινή πλευρά δεν μετριέται στην περίμετρο. Μένουν 8 εξωτερικές πλευρές: 8 · ${formatNum(side, loc)} cm ＝ ${formatNum(totalPerim, loc)} cm.`
        : `The shared side is internal and excluded from perimeter. Remaining 8 boundary sides: 8 · ${formatNum(side, loc)} cm ＝ ${formatNum(totalPerim, loc)} cm.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ ΑΚΡΙΒΩΣ 10 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet(locale = 'el') {
  const qs = [];

  // Q1: Ορισμός πολυγώνου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: locale === 'el' ? 'ΟΡΙΣΜΟΣ ΠΟΛΥΓΩΝΟΥ' : 'POLYGON DEFINITION',
    prompt: isQ1True
      ? (locale === 'el'
          ? 'Ένα πολύγωνο είναι ένα κλειστό επίπεδο γεωμετρικό σχήμα που οριοθετείται αποκλειστικά από ευθύγραμμα τμήματα.'
          : 'A polygon is a closed 2D geometric shape bounded strictly by straight line segments.')
      : (locale === 'el'
          ? 'Ένας κύκλος είναι κανονικό πολύγωνο επειδή είναι κλειστό γεωμετρικό σχήμα.'
          : 'A circle is a regular polygon because it is a closed geometric shape.'),
    correctAnswer: isQ1True,
    tableData: locale === 'el' ? [
      { label: 'Ιδιότητα πολυγώνου', value: 'Κλειστό επίπεδο σχήμα' },
      { label: 'Όρια', value: 'Αποκλειστικά ευθύγραμμα τμήματα' },
      { label: 'Κύκλος', value: 'Καμπύλη γραμμή (όχι πολύγωνο)' }
    ] : [
      { label: 'Polygon property', value: 'Closed 2D shape' },
      { label: 'Boundaries', value: 'Strictly straight line segments' },
      { label: 'Circle', value: 'Curved boundary (not a polygon)' }
    ],
    explanation: isQ1True
      ? (locale === 'el'
          ? 'ΣΩΣΤΟ: Τα πολύγωνα ορίζονται αυστηρά ως κλειστά επίπεδα σχήματα των οποίων οι πλευρές είναι ευθύγραμμα τμήματα.'
          : 'CORRECT: Polygons are strictly defined as closed plane figures bounded by straight line segments.')
      : (locale === 'el'
          ? 'ΛΑΘΟΣ: Ο κύκλος δεν αποτελείται από ευθύγραμμα τμήματα αλλά από καμπύλη γραμμή, επομένως δεν είναι πολύγωνο.'
          : 'FALSE: A circle is bounded by a curved line, not straight segments, so it is not a polygon.')
  });

  // Q2: Διαγώνιοι τριγώνου (MCQ)
  const q2Correct = locale === 'el' ? '0 διαγώνιοι' : '0 diagonals';
  qs.push({
    id: 2,
    type: 'mcq',
    title: locale === 'el' ? 'ΔΙΑΓΩΝΙΟΙ ΤΡΙΓΩΝΟΥ' : 'DIAGONALS OF TRIANGLE',
    prompt: locale === 'el'
      ? 'Πόσες διαγωνίους έχει συνολικά ένα τρίγωνο;'
      : 'How many diagonals does a triangle have in total?',
    options: ensureFourUniqueOptions(q2Correct, () => locale === 'el'
      ? ['1 διαγώνιος', '2 διαγώνιοι', '3 διαγώνιοι']
      : ['1 diagonal', '2 diagonals', '3 diagonals']
    ),
    correctAnswer: q2Correct,
    tableData: locale === 'el' ? [
      { label: 'Σχήμα', value: 'Τρίγωνο (ν ＝ 3)' },
      { label: 'Κορυφές', value: 'Όλες οι κορυφές είναι διαδοχικές' },
      { label: 'Τύπος', value: '[3 · (3 － 3)] : 2 ＝ (3 · 0) : 2 ＝ 0' }
    ] : [
      { label: 'Shape', value: 'Triangle (n ＝ 3)' },
      { label: 'Vertices', value: 'All vertices are adjacent' },
      { label: 'Formula', value: '[3 · (3 － 3)] : 2 ＝ (3 · 0) : 2 ＝ 0' }
    ],
    fractionData: { n: '3 · (3 － 3)', d: '2', res: '0' },
    explanation: locale === 'el'
      ? 'Το τρίγωνο δεν έχει καμία διαγώνιο (0), διότι όλες οι κορυφές του είναι διαδοχικές μεταξύ τους.'
      : 'A triangle has zero (0) diagonals because all its vertices are adjacent to one another.'
  });

  // Q3: Χαρακτηριστικά κανονικού πολυγώνου (MCQ)
  const q3Correct = locale === 'el'
    ? 'Όταν όλες οι πλευρές του είναι ίσες και όλες οι γωνίες του είναι ίσες'
    : 'When all its sides are equal and all its angles are equal';
  qs.push({
    id: 3,
    type: 'mcq',
    title: locale === 'el' ? 'ΚΑΝΟΝΙΚΟ ΠΟΛΥΓΩΝΟ' : 'REGULAR POLYGON',
    prompt: locale === 'el'
      ? 'Πότε ένα πολύγωνο ονομάζεται κανονικό;'
      : 'When is a polygon classified as regular?',
    options: ensureFourUniqueOptions(q3Correct, () => locale === 'el'
      ? [
          'Όταν έχει μόνο ίσες πλευρές ανεξάρτητα από τις γωνίες του',
          'Όταν έχει μόνο ίσες γωνίες ανεξάρτητα από τις πλευρές του',
          'Όταν έχει περισσότερες από 6 πλευρές'
        ]
      : [
          'When all its sides are equal regardless of angles',
          'When all its angles are equal regardless of sides',
          'When it has more than 6 sides'
        ]
    ),
    correctAnswer: q3Correct,
    tableData: locale === 'el' ? [
      { label: 'Προϋπόθεση 1', value: 'Ισόπλευρο (όλες οι πλευρές ίσες)' },
      { label: 'Προϋπόθεση 2', value: 'Ισογώνιο (όλες οι γωνίες ίσες)' },
      { label: 'Συμπέρασμα', value: 'Πρέπει να ισχύουν και τα δύο ταυτόχρονα' }
    ] : [
      { label: 'Condition 1', value: 'Equilateral (all sides equal)' },
      { label: 'Condition 2', value: 'Equiangular (all angles equal)' },
      { label: 'Conclusion', value: 'Both conditions must hold simultaneously' }
    ],
    explanation: locale === 'el'
      ? 'Ένα πολύγωνο είναι κανονικό όταν είναι ταυτόχρονα ισόπλευρο και ισογώνιο (π.χ. ισόπλευρο τρίγωνο, τετράγωνο).'
      : 'A polygon is regular when it is simultaneously equilateral and equiangular (e.g. equilateral triangle, square).'
  });

  // Q4: Διαγώνιοι τετραπλεύρου (SVG Οπτικοποίηση - No Giveaway)
  const q4Correct = locale === 'el' ? '2 διαγώνιοι' : '2 diagonals';
  qs.push({
    id: 4,
    type: 'mcq',
    title: locale === 'el' ? 'ΔΙΑΓΩΝΙΟΙ ΤΕΤΡΑΠΛΕΥΡΟΥ' : 'DIAGONALS OF QUADRILATERAL',
    prompt: locale === 'el'
      ? 'Πόσες διαγωνίους έχει συνολικά οποιοδήποτε τετράπλευρο;'
      : 'How many diagonals does any quadrilateral have in total?',
    svg: (
      <svg viewBox="0 0 160 120" className="w-40 h-28 max-w-full mx-auto my-2 drop-shadow-sm select-none">
        <polygon points="20,20 140,20 120,100 30,100" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.5" />
        <circle cx="20" cy="20" r="3.5" fill="#4f46e5" />
        <circle cx="140" cy="20" r="3.5" fill="#4f46e5" />
        <circle cx="120" cy="100" r="3.5" fill="#4f46e5" />
        <circle cx="30" cy="100" r="3.5" fill="#4f46e5" />
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => locale === 'el'
      ? ['1 διαγώνιος', '3 διαγώνιοι', '4 διαγώνιοι']
      : ['1 diagonal', '3 diagonals', '4 diagonals']
    ),
    correctAnswer: q4Correct,
    tableData: locale === 'el' ? [
      { label: 'Σχήμα', value: 'Τετράπλευρο (ν ＝ 4)' },
      { label: 'Τύπος', value: '[ν · (ν － 3)] : 2' },
      { label: 'Υπολογισμός', value: '[4 · (4 － 3)] : 2 ＝ (4 · 1) : 2 ＝ 2' }
    ] : [
      { label: 'Shape', value: 'Quadrilateral (n ＝ 4)' },
      { label: 'Formula', value: '[n · (n － 3)] : 2' },
      { label: 'Calculation', value: '[4 · (4 － 3)] : 2 ＝ (4 · 1) : 2 ＝ 2' }
    ],
    fractionData: { n: '4 · (4 － 3)', d: '2', res: '2' },
    explanation: locale === 'el'
      ? 'Κάθε τετράπλευρο έχει ακριβώς 2 διαγωνίους, οι οποίες ενώνουν τα δύο ζεύγη απέναντι κορυφών.'
      : 'Every quadrilateral has exactly 2 diagonals connecting the opposite pairs of vertices.'
  });

  // Q5: Διαγώνιοι από μία κορυφή (Input αριθμού)
  const sidesQ5 = randInt(5, 8);
  const diagFromOne = sidesQ5 - 3;
  qs.push({
    id: 5,
    type: 'input',
    title: locale === 'el' ? `ΔΙΑΓΩΝΙΟΙ ΑΠΟ 1 ΚΟΡΥΦΗ (${sidesQ5}-ΓΩΝΟ)` : `DIAGONALS FROM 1 VERTEX (${sidesQ5}-GON)`,
    prompt: locale === 'el'
      ? `Ένα πολύγωνο έχει ${sidesQ5} κορυφές. Πόσες διαγώνιοι μπορούν να χαραχτούν από μία μόνο κορυφή του; (Γράψτε μόνο τον αριθμό)`
      : `A polygon has ${sidesQ5} vertices. How many diagonals can be drawn from a single vertex? (Write number only)`,
    correctAnswer: String(diagFromOne),
    tableData: locale === 'el' ? [
      { label: 'Κορυφές (ν)', value: String(sidesQ5) },
      { label: 'Κανόνας', value: 'Αφαιρούμε 3 κορυφές (την ίδια και τις 2 διπλανές)' },
      { label: 'Πράξη', value: `${sidesQ5} － 3 ＝ ${diagFromOne}` }
    ] : [
      { label: 'Vertices (n)', value: String(sidesQ5) },
      { label: 'Rule', value: 'Subtract 3 vertices (itself and 2 adjacent)' },
      { label: 'Calculation', value: `${sidesQ5} － 3 ＝ ${diagFromOne}` }
    ],
    explanation: locale === 'el'
      ? `Από μία κορυφή φεύγουν πάντα (ν － 3) διαγώνιοι: ${sidesQ5} － 3 ＝ ${diagFromOne}.`
      : `From one vertex there are always (n － 3) diagonals: ${sidesQ5} － 3 ＝ ${diagFromOne}.`
  });

  // Q6: Περίμετρος κανονικού πενταγώνου (Input με δεκαδικό)
  const sideQ6 = randInt(3, 9) + 0.5;
  const perimQ6 = 5 * sideQ6;
  qs.push({
    id: 6,
    type: 'input',
    title: locale === 'el' ? 'ΠΕΡΙΜΕΤΡΟΣ ΚΑΝΟΝΙΚΟΥ ΠΕΝΤΑΓΩΝΟΥ' : 'PERIMETER OF REGULAR PENTAGON',
    prompt: locale === 'el'
      ? `Η πλευρά ενός κανονικού πενταγώνου έχει μήκος ${formatNum(sideQ6, locale)} cm. Πόση είναι η περίμετρός του σε cm; (Γράψτε μόνο τον αριθμό)`
      : `The side of a regular pentagon measures ${formatNum(sideQ6, locale)} cm. What is its perimeter in cm? (Write number only)`,
    correctAnswer: formatNum(perimQ6, locale),
    tableData: locale === 'el' ? [
      { label: 'Σχήμα', value: 'Κανονικό πεντάγωνο (5 ίσες πλευρές)' },
      { label: 'Μήκος πλευράς', value: `${formatNum(sideQ6, locale)} cm` },
      { label: 'Πράξη', value: `5 · ${formatNum(sideQ6, locale)} cm ＝ ${formatNum(perimQ6, locale)} cm` }
    ] : [
      { label: 'Shape', value: 'Regular pentagon (5 equal sides)' },
      { label: 'Side length', value: `${formatNum(sideQ6, locale)} cm` },
      { label: 'Calculation', value: `5 · ${formatNum(sideQ6, locale)} cm ＝ ${formatNum(perimQ6, locale)} cm` }
    ],
    explanation: locale === 'el'
      ? `Το κανονικό πεντάγωνο έχει 5 ίσες πλευρές: 5 · ${formatNum(sideQ6, locale)} cm ＝ ${formatNum(perimQ6, locale)} cm.`
      : `A regular pentagon has 5 equal sides: 5 · ${formatNum(sideQ6, locale)} cm ＝ ${formatNum(perimQ6, locale)} cm.`
  });

  // Q7: Επιλογή από POOL Q7 (Περίμετρος κανονικών πολυγώνων)
  const p7 = PROBLEM_POOL_Q7[randInt(0, PROBLEM_POOL_Q7.length - 1)](locale);
  qs.push({ id: 7, type: 'mcq', ...p7 });

  // Q8: Επιλογή από POOL Q8 (Εύρεση πλευράς ή κόστους)
  const p8 = PROBLEM_POOL_Q8[randInt(0, PROBLEM_POOL_Q8.length - 1)](locale);
  qs.push({ id: 8, type: 'mcq', ...p8 });

  // Q9: Επιλογή από POOL Q9 (Διαγώνιοι)
  const p9 = PROBLEM_POOL_Q9[randInt(0, PROBLEM_POOL_Q9.length - 1)](locale);
  qs.push({ id: 9, type: 'mcq', ...p9 });

  // Q10: Επιλογή από POOL Q10 (Σύνθετα Προβλήματα)
  const p10 = PROBLEM_POOL_Q10[randInt(0, PROBLEM_POOL_Q10.length - 1)](locale);
  qs.push({ id: 10, type: 'mcq', ...p10 });

  return qs;
}

// -------------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΑΣΚΗΣΕΩΝ
// -------------------------------------------------------------

export default function SximataAskiseisPage() {
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
      headTitle: "Ασκήσεις: Γεωμετρικά Σχήματα & Πολύγωνα - ΣΤ' Δημοτικού | LearnMaths.gr",
      headDesc: "Διαδραστικές ασκήσεις στα γεωμετρικά σχήματα, τα πολύγωνα και τις διαγωνίους με αυτόματη βαθμολόγηση για τη ΣΤ' Δημοτικού.",
      backTheory: "Θεωρία Κεφ. 67",
      btnTheory: "📖 Θεωρία",
      badge: "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 67 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Ασκήσεις: Πολύγωνα και Διαγώνιοι",
      heroDesc: "Εξασκηθείτε στις ιδιότητες των πολυγώνων, τον υπολογισμό των διαγωνίων και την περίμετρο κανονικών σχημάτων μέσα από 10 δυναμικές ερωτήσεις.",
      heroSub: "10 Δυναμικές Ασκήσεις με Άμεση Αξιολόγηση & Αναλυτικές Λύσεις",
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
      headTitle: "Exercises: Geometric Shapes & Polygons - 6th Grade | LearnMaths.gr",
      headDesc: "Interactive exercises on geometric shapes, polygons, and diagonals with automated scoring for 6th Grade.",
      backTheory: "Theory Chap. 67",
      btnTheory: "📖 Theory",
      badge: "EXERCISES • CHAPTER 67 • 6TH GRADE",
      heroTitle: "Exercises: Polygons and Diagonals",
      heroDesc: "Practice polygon properties, diagonal formulas, and regular shape perimeters through 10 dynamic questions.",
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
      backUrl="/st-dimotikou/67-sximata"
      backText={ui.backTheory}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/67-sximata"
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
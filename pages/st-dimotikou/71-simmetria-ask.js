// pages/st-dimotikou/71-simmetria-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// -------------------------------------------------------------
// DEFENSIVE UTILITY FUNCTIONS
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
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (POOLS) ΓΙΑ Q9, Q10, Q11, Q12 ME I18N
// -------------------------------------------------------------

// POOL ΓΙΑ Q9: Απόσταση Συμμετρικών Σημείων από Άξονα
const PROBLEM_POOL_Q9 = [
  // 1. Συνολική απόσταση ΑΑ'
  (locale) => {
    const isEn = locale === 'en';
    const d = randInt(3, 9) + 0.5;
    const total = 2 * d;
    const correct = `${formatNum(total, locale)} cm`;
    return {
      title: isEn ? 'DISTANCE BETWEEN SYMMETRIC POINTS' : 'ΑΠΟΣΤΑΣΗ ΣΥΜΜΕΤΡΙΚΩΝ ΣΗΜΕΙΩΝ',
      prompt: isEn
        ? `Point A is located at a distance of ${formatNum(d, locale)} cm from a vertical axis of symmetry (d). What is the total straight-line distance between point A and its symmetric point A'?`
        : `Ένα σημείο Α απέχει από έναν κατακόρυφο άξονα συμμετρίας (ε) απόσταση ${formatNum(d, locale)} cm. Πόση είναι η συνολική ευθεία απόσταση ανάμεσα στο σημείο Α και στο συμμετρικό του σημείο Α';`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(d, locale)} cm`,
        `${formatNum(total + 2, locale)} cm`,
        `${formatNum(total - 1.5 > 0 ? total - 1.5 : total + 3, locale)} cm`,
        `${formatNum(total * 2, locale)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'Distance of A from axis (d₁)' : 'Απόσταση Α από άξονα (d₁)', value: `${formatNum(d, locale)} cm` },
        { label: isEn ? "Distance of A' from axis (d₂)" : "Απόσταση Α' από άξονα (d₂)", value: `${formatNum(d, locale)} cm (${isEn ? 'equal' : 'ίση'})` },
        { label: isEn ? 'Operation' : 'Πράξη', value: `2 · ${formatNum(d, locale)} cm` },
        { label: isEn ? "Total distance AA'" : "Συνολική απόσταση ΑΑ'", value: `${formatNum(total, locale)} cm` }
      ],
      explanation: isEn
        ? `The symmetric point A' is at the same distance of ${formatNum(d, locale)} cm on the opposite side. Thus: ${formatNum(d, locale)} ＋ ${formatNum(d, locale)} ＝ ${formatNum(total, locale)} cm.`
        : `Το συμμετρικό σημείο Α' απέχει την ίδια απόσταση ${formatNum(d, locale)} cm από την άλλη πλευρά του άξονα. Άρα: ${formatNum(d, locale)} ＋ ${formatNum(d, locale)} ＝ ${formatNum(total, locale)} cm.`
    };
  },
  // 2. Εύρεση απόστασης από τον άξονα όταν δίνεται το τμήμα ΑΑ'
  (locale) => {
    const isEn = locale === 'en';
    const total = randInt(6, 18);
    const d = total / 2;
    const correct = `${formatNum(d, locale)} cm`;
    return {
      title: isEn ? 'DISTANCE FROM AXIS' : 'ΑΠΟΣΤΑΣΗ ΑΠΟ ΤΟΝ ΑΞΟΝΑ',
      prompt: isEn
        ? `Two points A and A' are symmetric across line (d) and the distance between them is ${formatNum(total, locale)} cm. How far is point A from the axis of symmetry?`
        : `Δύο σημεία Α και Α' είναι συμμετρικά ως προς ευθεία (ε) και η μεταξύ τους απόσταση είναι ${formatNum(total, locale)} cm. Πόσο απέχει το σημείο Α από τον άξονα συμμετρίας;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(total, locale)} cm`,
        `${formatNum(d + 2, locale)} cm`,
        `${formatNum(d - 1 > 0 ? d - 1 : d + 3, locale)} cm`,
        `${formatNum(total * 2, locale)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? "Total segment length AA'" : "Συνολικό μήκος ΑΑ'", value: `${formatNum(total, locale)} cm` },
        { label: isEn ? 'Axis property' : 'Ιδιότητα άξονα', value: isEn ? "Passes through the midpoint of segment AA'" : "Διέρχεται από το μέσο του τμήματος ΑΑ'" },
        { label: isEn ? 'Operation' : 'Πράξη', value: `${formatNum(total, locale)} : 2` },
        { label: isEn ? 'Distance from axis' : 'Απόσταση από τον άξονα', value: `${formatNum(d, locale)} cm` }
      ],
      fractionData: { n: `${formatNum(total, locale)} cm`, d: '2', res: `${formatNum(d, locale)} cm` },
      explanation: isEn
        ? `The axis of symmetry is the perpendicular bisector of segment AA', so point A is half of the total distance away: ${formatNum(total, locale)} : 2 ＝ ${formatNum(d, locale)} cm.`
        : `Ο άξονας συμμετρίας είναι η μεσοκάθετος του τμήματος ΑΑ', επομένως το σημείο Α απέχει το μισό της συνολικής απόστασης: ${formatNum(total, locale)} : 2 ＝ ${formatNum(d, locale)} cm.`
    };
  },
  // 3. Σημείο πάνω στον άξονα
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '0 cm (lies on the axis)' : '0 cm (βρίσκεται πάνω στον άξονα)';
    return {
      title: isEn ? 'POINT ON THE AXIS' : 'ΣΗΜΕΙΟ ΠΑΝΩ ΣΤΟΝ ΑΞΟΝΑ',
      prompt: isEn
        ? "Point B lies directly on the axis of symmetry (d). What is the distance between point B and its symmetric point B'?"
        : "Ένα σημείο Β βρίσκεται ακριβώς πάνω στον άξονα συμμετρίας (ε). Πόση είναι η απόσταση ανάμεσα στο σημείο Β και στο συμμετρικό του σημείο Β';",
      options: ensureFourUniqueOptions(correct, () => [
        '1 cm',
        '2 cm',
        isEn ? 'Infinite distance' : 'Άπειρη απόσταση',
        isEn ? 'No symmetric point exists' : 'Δεν υπάρχει συμμετρικό σημείο'
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'Position of point B' : 'Θέση σημείου Β', value: isEn ? 'On the axis' : 'Πάνω στον άξονα' },
        { label: isEn ? "Symmetric point B'" : "Συμμετρικό σημείο Β'", value: isEn ? 'Identical with point B' : 'Ταυτίζεται με το σημείο Β' },
        { label: isEn ? "Distance BB'" : "Απόσταση ΒΒ'", value: '0 cm' }
      ],
      explanation: isEn
        ? 'When a point belongs to the axis of symmetry, its reflection coincides with itself; hence the distance between them is 0 cm.'
        : 'Όταν ένα σημείο ανήκει στον άξονα συμμετρίας, το συμμετρικό του ταυτίζεται με τον εαυτό του, άρα η απόσταση μεταξύ τους είναι 0 cm.'
    };
  },
  // 4. Απόσταση σε mm
  (locale) => {
    const isEn = locale === 'en';
    const d = randInt(25, 65);
    const total = 2 * d;
    const correct = `${formatNum(total, locale)} mm`;
    return {
      title: isEn ? 'DISTANCE IN MILLIMETERS' : 'ΑΠΟΣΤΑΣΗ ΣΕ ΧΙΛΙΟΣΤΑ',
      prompt: isEn
        ? `In a technical drawing, a point is located ${formatNum(d, locale)} mm from the axis of symmetry. How many millimeters (mm) separate the two symmetric points?`
        : `Σε ένα τεχνικό σχέδιο, ένα σημείο απέχει ${formatNum(d, locale)} mm από τον άξονα συμμετρίας. Πόσα χιλιοστά (mm) απέχουν μεταξύ τους τα δύο συμμετρικά σημεία;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(d, locale)} mm`,
        `${formatNum(total + 10, locale)} mm`,
        `${formatNum(total - 10, locale)} mm`,
        `${formatNum(total * 2, locale)} mm`
      ]),
      correctAnswer: correct,
      unit: 'mm',
      tableData: [
        { label: isEn ? 'Distance from axis' : 'Απόσταση από άξονα', value: `${formatNum(d, locale)} mm` },
        { label: isEn ? 'Operation' : 'Πράξη', value: `2 · ${formatNum(d, locale)} mm` },
        { label: isEn ? 'Total distance' : 'Συνολική απόσταση', value: `${formatNum(total, locale)} mm` }
      ],
      explanation: `2 · ${formatNum(d, locale)} mm ＝ ${formatNum(total, locale)} mm.`
    };
  },
  // 5. Μετακίνηση σημείου
  (locale) => {
    const isEn = locale === 'en';
    const d1 = randInt(3, 6);
    const step = 2;
    const d2 = d1 + step;
    const total = 2 * d2;
    const correct = `${formatNum(total, locale)} cm`;
    return {
      title: isEn ? 'MOVING AWAY FROM AXIS' : 'ΑΠΟΜΑΚΡΥΝΣΗ ΑΠΟ ΤΟΝ ΑΞΟΝΑ',
      prompt: isEn
        ? `Point A initially lies ${formatNum(d1, locale)} cm from the axis. If we move it perpendicularly ${formatNum(step, locale)} cm further from the axis, what will be the new distance between the point and its reflection?`
        : `Ένα σημείο Α απέχει αρχικά ${formatNum(d1, locale)} cm από τον άξονα. Αν το μετακινήσουμε κάθετα κατά ${formatNum(step, locale)} cm πιο μακριά από τον άξονα, πόση θα είναι η νέα απόσταση ανάμεσα στο σημείο και στο συμμετρικό του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(2 * d1, locale)} cm`,
        `${formatNum(total + 2, locale)} cm`,
        `${formatNum(total - 2, locale)} cm`,
        `${formatNum(d2, locale)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'New distance from axis' : 'Νέα απόσταση από άξονα', value: `${formatNum(d1, locale)} ＋ ${formatNum(step, locale)} ＝ ${formatNum(d2, locale)} cm` },
        { label: isEn ? 'New total distance' : 'Νέα απόσταση μεταξύ τους', value: `2 · ${formatNum(d2, locale)} ＝ ${formatNum(total, locale)} cm` }
      ],
      explanation: isEn
        ? `The new distance from the axis is ${formatNum(d2, locale)} cm, so the two points are 2 · ${formatNum(d2, locale)} ＝ ${formatNum(total, locale)} cm apart.`
        : `Η νέα απόσταση από τον άξονα είναι ${formatNum(d2, locale)} cm, άρα τα δύο σημεία απέχουν 2 · ${formatNum(d2, locale)} ＝ ${formatNum(total, locale)} cm.`
    };
  },
  // 6. Πρόβλημα με δέντρα εκατέρωθεν δρόμου
  (locale) => {
    const isEn = locale === 'en';
    const d = randInt(4, 9);
    const total = 2 * d;
    const correct = `${formatNum(total, locale)} m`;
    return {
      title: isEn ? 'SYMMETRICAL TREE PLANTING' : 'ΣΥΜΜΕΤΡΙΚΗ ΔΕΝΔΡΟΦΥΤΕΥΣΗ',
      prompt: isEn
        ? `Along a straight road, trees are planted symmetrically across the road center line. If a tree is ${formatNum(d, locale)} m from the center line, what is the distance between it and the symmetric tree directly opposite?`
        : `Κατά μήκος ενός ευθύγραμμου δρόμου φυτεύονται δέντρα συμμετρικά ως προς τη μεσαία γραμμή του δρόμου. Αν ένα δέντρο απέχει ${formatNum(d, locale)} m από τη μεσαία γραμμή, πόση είναι η απόσταση ανάμεσα σε αυτό και στο απέναντι συμμετρικό του δέντρο;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(d, locale)} m`,
        `${formatNum(total + 2, locale)} m`,
        `${formatNum(total - 2, locale)} m`,
        `${formatNum(total / 2, locale)} m`
      ]),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: isEn ? 'Axis of symmetry' : 'Άξονας συμμετρίας', value: isEn ? 'Road center line' : 'Μεσαία γραμμή δρόμου' },
        { label: isEn ? 'Tree distance' : 'Απόσταση δέντρου', value: `${formatNum(d, locale)} m` },
        { label: isEn ? 'Operation' : 'Πράξη', value: `2 · ${formatNum(d, locale)} m` },
        { label: isEn ? 'Total distance' : 'Συνολική απόσταση', value: `${formatNum(total, locale)} m` }
      ],
      explanation: `2 · ${formatNum(d, locale)} m ＝ ${formatNum(total, locale)} m.`
    };
  }
];

// POOL ΓΙΑ Q10: Άξονες Συμμετρίας Κανονικών Πολυγώνων
const PROBLEM_POOL_Q10 = [
  // 1. Κανονικό οκτάγωνο
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '8 axes of symmetry' : '8 άξονες συμμετρίας';
    return {
      title: isEn ? 'AXES OF REGULAR OCTAGON' : 'ΑΞΟΝΕΣ ΚΑΝΟΝΙΚΟΥ ΟΚΤΑΓΩΝΟΥ',
      prompt: isEn
        ? 'How many axes of symmetry does a regular octagon have (all sides and interior angles equal)?'
        : 'Πόσους άξονες συμμετρίας έχει ένα κανονικό οκτάγωνο (όλες οι πλευρές και όλες οι γωνίες του είναι ίσες);',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '4 axes of symmetry' : '4 άξονες συμμετρίας',
        isEn ? '6 axes of symmetry' : '6 άξονες συμμετρίας',
        isEn ? '2 axes of symmetry' : '2 άξονες συμμετρίας',
        isEn ? 'Infinitely many axes' : 'Άπειρους άξονες'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'axes' : 'άξονες',
      tableData: [
        { label: isEn ? 'Shape' : 'Σχήμα', value: isEn ? 'Regular octagon (n ＝ 8)' : 'Κανονικό οκτάγωνο (ν ＝ 8)' },
        { label: isEn ? 'Regular polygon rule' : 'Κανόνας κανονικών πολυγώνων', value: isEn ? 'Every regular n-gon has n axes of symmetry' : 'Κάθε κανονικό ν-γωνο έχει ν άξονες συμμετρίας' },
        { label: isEn ? 'Result' : 'Αποτέλεσμα', value: isEn ? '8 axes of symmetry' : '8 άξονες συμμετρίας' }
      ],
      explanation: isEn
        ? 'Every regular polygon with n sides has exactly n axes of symmetry. For a regular octagon: 8 axes.'
        : 'Κάθε κανονικό πολύγωνο με ν πλευρές έχει ακριβώς ν άξονες συμμετρίας. Για το κανονικό οκτάγωνο: 8 άξονες.'
    };
  },
  // 2. Κανονικό δεκάγωνο
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '10 axes of symmetry' : '10 άξονες συμμετρίας';
    return {
      title: isEn ? 'AXES OF REGULAR DECAGON' : 'ΑΞΟΝΕΣ ΚΑΝΟΝΙΚΟΥ ΔΕΚΑΓΩΝΟΥ',
      prompt: isEn
        ? 'How many axes of symmetry does a regular decagon have?'
        : 'Πόσους άξονες συμμετρίας έχει ένα κανονικό δεκάγωνο;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '5 axes of symmetry' : '5 άξονες συμμετρίας',
        isEn ? '8 axes of symmetry' : '8 άξονες συμμετρίας',
        isEn ? '2 axes of symmetry' : '2 άξονες συμμετρίας',
        isEn ? '20 axes of symmetry' : '20 άξονες συμμετρίας'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'axes' : 'άξονες',
      tableData: [
        { label: isEn ? 'Shape' : 'Σχήμα', value: isEn ? 'Regular decagon (n ＝ 10)' : 'Κανονικό δεκάγωνο (ν ＝ 10)' },
        { label: isEn ? 'Number of axes' : 'Πλήθος αξόνων', value: isEn ? '10 axes' : '10 άξονες' }
      ],
      explanation: isEn
        ? 'A regular decagon has 10 equal sides and 10 equal angles, so it has exactly 10 axes of symmetry.'
        : 'Το κανονικό δεκάγωνο έχει 10 ίσες πλευρές και 10 ίσες γωνίες, άρα έχει ακριβώς 10 άξονες συμμετρίας.'
    };
  },
  // 3. Κανονικό πεντάγωνο
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '5 axes of symmetry' : '5 άξονες συμμετρίας';
    return {
      title: isEn ? 'AXES OF REGULAR PENTAGON' : 'ΑΞΟΝΕΣ ΚΑΝΟΝΙΚΟΥ ΠΕΝΤΑΓΩΝΟΥ',
      prompt: isEn
        ? 'How many axes of symmetry does a regular pentagon have?'
        : 'Πόσους άξονες συμμετρίας έχει ένα κανονικό πεντάγωνο;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '1 axis of symmetry' : '1 άξονα συμμετρίας',
        isEn ? '3 axes of symmetry' : '3 άξονες συμμετρίας',
        isEn ? '10 axes of symmetry' : '10 άξονες συμμετρίας',
        isEn ? 'No axes' : 'Κανέναν άξονα'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'axes' : 'άξονες',
      tableData: [
        { label: isEn ? 'Shape' : 'Σχήμα', value: isEn ? 'Regular pentagon (n ＝ 5)' : 'Κανονικό πεντάγωνο (ν ＝ 5)' },
        { label: isEn ? 'Number of axes' : 'Πλήθος αξόνων', value: isEn ? '5 axes (connecting each vertex to the midpoint of opposite side)' : '5 άξονες (διέρχονται από κάθε κορυφή και το μέσο της απέναντι πλευράς)' }
      ],
      explanation: isEn
        ? 'Every regular pentagon has exactly 5 axes of symmetry.'
        : 'Κάθε κανονικό πεντάγωνο έχει ακριβώς 5 άξονες συμμετρίας.'
    };
  },
  // 4. Κανονικό εξάγωνο
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '6 axes of symmetry' : '6 άξονες συμμετρίας';
    return {
      title: isEn ? 'AXES OF REGULAR HEXAGON' : 'ΑΞΟΝΕΣ ΚΑΝΟΝΙΚΟΥ ΕΞΑΓΩΝΟΥ',
      prompt: isEn
        ? 'How many axes of symmetry does a regular hexagon have?'
        : 'Πόσους άξονες συμμετρίας έχει ένα κανονικό εξάγωνο;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '3 axes of symmetry' : '3 άξονες συμμετρίας',
        isEn ? '4 axes of symmetry' : '4 άξονες συμμετρίας',
        isEn ? '12 axes of symmetry' : '12 άξονες συμμετρίας',
        isEn ? '2 axes of symmetry' : '2 άξονες συμμετρίας'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'axes' : 'άξονες',
      tableData: [
        { label: isEn ? 'Shape' : 'Σχήμα', value: isEn ? 'Regular hexagon (n ＝ 6)' : 'Κανονικό εξάγωνο (ν ＝ 6)' },
        { label: isEn ? 'Axes breakdown' : 'Ανάλυση αξόνων', value: isEn ? '3 vertex diagonals ＋ 3 side bisectors ＝ 6 axes' : '3 διαγώνιοι κορυφών ＋ 3 μεσοκάθετοι απέναντι πλευρών ＝ 6 άξονες' }
      ],
      explanation: isEn
        ? 'A regular hexagon has 6 axes of symmetry (3 joining opposite vertices and 3 joining midpoints of opposite sides).'
        : 'Το κανονικό εξάγωνο έχει 6 άξονες συμμετρίας (3 που ενώνουν απέναντι κορυφές και 3 που ενώνουν μέσα απέναντι πλευρών).'
    };
  },
  // 5. Ισόπλευρο τρίγωνο vs Ισοσκελές
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '3 axes for equilateral and 1 axis for isosceles' : '3 άξονες το ισόπλευρο και 1 άξονα το ισοσκελές';
    return {
      title: isEn ? 'COMPARING TRIANGLE AXES' : 'ΣΥΓΚΡΙΣΗ ΑΞΟΝΩΝ ΤΡΙΓΩΝΩΝ',
      prompt: isEn
        ? 'How many axes of symmetry do an equilateral triangle and an isosceles triangle (with only 2 equal sides) have, respectively?'
        : 'Πόσους άξονες συμμετρίας έχουν αντίστοιχα ένα ισόπλευρο τρίγωνο και ένα ισοσκελές τρίγωνο (με 2 μόνο ίσες πλευρές);',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '3 axes for both' : '3 άξονες και τα δύο',
        isEn ? '1 axis for equilateral and 3 for isosceles' : '1 άξονα το ισόπλευρο και 3 το ισοσκελές',
        isEn ? '2 axes for equilateral and 1 for isosceles' : '2 άξονες το ισόπλευρο και 1 το ισοσκελές',
        isEn ? 'No axes for either' : 'Κανέναν άξονα και τα δύο'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'axes' : 'άξονες',
      tableData: [
        { label: isEn ? 'Equilateral triangle' : 'Ισόπλευρο τρίγωνο', value: isEn ? '3 axes of symmetry (regular 3-gon)' : '3 άξονες συμμετρίας (κανονικό 3-γωνο)' },
        { label: isEn ? 'Isosceles triangle' : 'Ισοσκελές τρίγωνο', value: isEn ? '1 axis of symmetry (perpendicular bisector of base)' : '1 άξονας συμμετρίας (η μεσοκάθετος της βάσης)' }
      ],
      explanation: isEn
        ? 'An equilateral triangle has 3 axes of symmetry, while an ordinary isosceles triangle has only 1 axis.'
        : 'Το ισόπλευρο έχει 3 άξονες συμμετρίας, ενώ το απλό ισοσκελές τρίγωνο έχει μόνο 1 άξονα (αυτόν που ξεκινά από την κορυφή προς τη βάση).'
    };
  },
  // 6. Κύκλος
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? 'Infinitely many axes of symmetry' : 'Άπειρους άξονες συμμετρίας';
    return {
      title: isEn ? 'AXES OF SYMMETRY OF A CIRCLE' : 'ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΚΥΚΛΟΥ',
      prompt: isEn
        ? 'How many axes of symmetry does a circle have?'
        : 'Πόσους άξονες συμμετρίας έχει ένας κύκλος;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '360 axes of symmetry' : '360 άξονες συμμετρίας',
        isEn ? '4 axes of symmetry' : '4 άξονες συμμετρίας',
        isEn ? '2 axes of symmetry' : '2 άξονες συμμετρίας',
        isEn ? '1 axis of symmetry' : '1 άξονα συμμετρίας'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'axes' : 'άξονες',
      tableData: [
        { label: isEn ? 'Shape' : 'Σχήμα', value: isEn ? 'Circle' : 'Κύκλος' },
        { label: isEn ? 'Axes of symmetry' : 'Άξονες συμμετρίας', value: isEn ? 'Any straight line passing through its center (any diameter)' : 'Κάθε ευθεία που περνά από το κέντρο του (κάθε διάμετρος)' },
        { label: isEn ? 'Count' : 'Πλήθος', value: isEn ? 'Infinitely many' : 'Άπειροι' }
      ],
      explanation: isEn
        ? 'Every line passing through the center of a circle (every diameter) is an axis of symmetry, so a circle has infinitely many axes.'
        : 'Κάθε ευθεία που διέρχεται από το κέντρο του κύκλου (κάθε διάμετρος) είναι άξονας συμμετρίας, επομένως ο κύκλος έχει άπειρους άξονες.'
    };
  }
];

// POOL ΓΙΑ Q11: Διατήρηση Περιμέτρου & Εμβαδού σε Συμμετρικά Σχήματα
const PROBLEM_POOL_Q11 = [
  // 1. Περίμετρος συμμετρικού ορθογωνίου
  (locale) => {
    const isEn = locale === 'en';
    const a = randInt(4, 8);
    const b = randInt(6, 12);
    const p = 2 * (a + b);
    const correct = `${formatNum(p, locale)} cm`;
    return {
      title: isEn ? 'PERIMETER OF SYMMETRIC RECTANGLE' : 'ΠΕΡΙΜΕΤΡΟΣ ΣΥΜΜΕΤΡΙΚΟΥ ΟΡΘΟΓΩΝΙΟΥ',
      prompt: isEn
        ? `A rectangle has sides of ${formatNum(a, locale)} cm and ${formatNum(b, locale)} cm (perimeter ${formatNum(p, locale)} cm). We draw its symmetric image across line (d). What is the perimeter of the new figure?`
        : `Ένα ορθογώνιο παραλληλόγραμμο έχει πλευρές ${formatNum(a, locale)} cm και ${formatNum(b, locale)} cm (περίμετρος ${formatNum(p, locale)} cm). Σχεδιάζουμε το συμμετρικό του ως προς έναν άξονα (ε). Πόση είναι η περίμετρος του νέου σχήματος;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(2 * p, locale)} cm`,
        `${formatNum(p + 4, locale)} cm`,
        `${formatNum(p - 4 > 0 ? p - 4 : p + 8, locale)} cm`,
        `${formatNum(a * b, locale)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'Initial perimeter' : 'Αρχική περίμετρος', value: `${formatNum(p, locale)} cm` },
        { label: isEn ? 'Symmetry property' : 'Ιδιότητα αξονικής συμμετρίας', value: isEn ? 'Preservation of segment lengths' : 'Διατήρηση μηκών πλευρών' },
        { label: isEn ? 'New perimeter' : 'Νέα περίμετρος', value: `${formatNum(p, locale)} cm (${isEn ? 'strictly equal' : 'ακριβώς ίση'})` }
      ],
      explanation: isEn
        ? `Axial symmetry preserves side lengths unchanged, so the perimeter remains identical: ${formatNum(p, locale)} cm.`
        : `Η αξονική συμμετρία διατηρεί τα μήκη των πλευρών αναλλοίωτα, επομένως η περίμετρος παραμένει ακριβώς η ίδια: ${formatNum(p, locale)} cm.`
    };
  },
  // 2. Εμβαδόν συμμετρικού τριγώνου
  (locale) => {
    const isEn = locale === 'en';
    const base = randInt(6, 10);
    const height = randInt(4, 8);
    const area = (base * height) / 2;
    const correct = `${formatNum(area, locale)} cm²`;
    return {
      title: isEn ? 'AREA OF SYMMETRIC TRIANGLE' : 'ΕΜΒΑΔΟΝ ΣΥΜΜΕΤΡΙΚΟΥ ΤΡΙΓΩΝΟΥ',
      prompt: isEn
        ? `A triangle has an area of ${formatNum(area, locale)} cm². We construct its reflection across axis (d). What is the area of the reflected triangle?`
        : `Ένα τρίγωνο έχει εμβαδόν ${formatNum(area, locale)} cm². Κατασκευάζουμε το συμμετρικό του τρίγωνο ως προς έναν άξονα (ε). Πόσο είναι το εμβαδόν του νέου τριγώνου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(2 * area, locale)} cm²`,
        `${formatNum(area / 2, locale)} cm²`,
        `${formatNum(area + 4, locale)} cm²`,
        `${formatNum(area - 4 > 0 ? area - 4 : area + 8, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Initial area' : 'Αρχικό εμβαδόν', value: `${formatNum(area, locale)} cm²` },
        { label: isEn ? 'Symmetry property' : 'Ιδιότητα συμμετρίας', value: isEn ? 'Symmetric figures are strictly congruent' : 'Τα συμμετρικά σχήματα είναι απολύτως ίσα' },
        { label: isEn ? 'New area' : 'Νέο εμβαδόν', value: `${formatNum(area, locale)} cm²` }
      ],
      fractionData: { n: `${formatNum(base, locale)} · ${formatNum(height, locale)}`, d: '2', res: `${formatNum(area, locale)} cm²` },
      explanation: isEn
        ? `Two symmetric shapes have identical areas; therefore, the reflected triangle has an area of ${formatNum(area, locale)} cm².`
        : `Δύο συμμετρικά σχήματα έχουν ίσα εμβαδά, άρα το νέο τρίγωνο έχει εμβαδόν ${formatNum(area, locale)} cm².`
    };
  },
  // 3. Περίμετρος σύνθετου σχήματος από δύο συμμετρικά τρίγωνα
  (locale) => {
    const isEn = locale === 'en';
    const s1 = randInt(5, 9);
    const s2 = randInt(6, 10);
    const totalP = 2 * (s1 + s2);
    const correct = `${formatNum(totalP, locale)} cm`;
    return {
      title: isEn ? 'COMPOSITE SYMMETRIC SHAPE' : 'ΣΥΝΘΕΤΟ ΣΥΜΜΕΤΡΙΚΟ ΣΧΗΜΑ',
      prompt: isEn
        ? `We draw a triangle with outer sides of ${formatNum(s1, locale)} cm and ${formatNum(s2, locale)} cm and reflect it across its base, creating a kite (deltoid). What is the total perimeter of the resulting shape?`
        : `Σχεδιάζουμε ένα τρίγωνο με εξωτερικές πλευρές ${formatNum(s1, locale)} cm και ${formatNum(s2, locale)} cm και το συμμετρικό του ως προς τη βάση του, σχηματίζοντας έναν χαρταετό (δελτοειδές). Πόση είναι η συνολική περίμετρος του νέου σχήματος;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(s1 + s2, locale)} cm`,
        `${formatNum(totalP + 6, locale)} cm`,
        `${formatNum(totalP - 4 > 0 ? totalP - 4 : totalP + 8, locale)} cm`,
        `${formatNum(totalP / 2, locale)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEn ? 'Outer sides' : 'Εξωτερικές πλευρές', value: isEn ? `2 sides of ${formatNum(s1, locale)} cm and 2 sides of ${formatNum(s2, locale)} cm` : `2 πλευρές των ${formatNum(s1, locale)} cm και 2 πλευρές των ${formatNum(s2, locale)} cm` },
        { label: isEn ? 'Operation' : 'Πράξη', value: `2 · (${formatNum(s1, locale)} ＋ ${formatNum(s2, locale)}) ＝ 2 · ${formatNum(s1 + s2, locale)}` },
        { label: isEn ? 'Total perimeter' : 'Συνολική περίμετρος', value: `${formatNum(totalP, locale)} cm` }
      ],
      explanation: isEn
        ? `Due to axial symmetry opposite sides are equal: 2 · ${formatNum(s1, locale)} ＋ 2 · ${formatNum(s2, locale)} ＝ ${formatNum(totalP, locale)} cm.`
        : `Λόγω συμμετρίας οι απέναντι πλευρές είναι ίσες: 2 · ${formatNum(s1, locale)} ＋ 2 · ${formatNum(s2, locale)} ＝ ${formatNum(totalP, locale)} cm.`
    };
  },
  // 4. Γωνία συμμετρικού σχήματος
  (locale) => {
    const isEn = locale === 'en';
    const deg = randInt(35, 75);
    const correct = `${formatNum(deg, locale)}°`;
    return {
      title: isEn ? 'ANGLE IN A SYMMETRIC SHAPE' : 'ΓΩΝΙΑ ΣΕ ΣΥΜΜΕΤΡΙΚΟ ΣΧΗΜΑ',
      prompt: isEn
        ? `An angle Â in a geometric figure measures ${formatNum(deg, locale)}°. What is the measure of the corresponding angle Â' in the reflected figure?`
        : `Μια γωνία Â ενός σχήματος έχει μέτρο ${formatNum(deg, locale)}°. Πόσο είναι το μέτρο της αντίστοιχης γωνίας Â' στο συμμετρικό σχήμα;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(180 - deg, locale)}°`,
        `${formatNum(90 - deg > 0 ? 90 - deg : deg + 20, locale)}°`,
        `${formatNum(2 * deg, locale)}°`,
        `${formatNum(deg + 15, locale)}°`
      ]),
      correctAnswer: correct,
      unit: '°',
      tableData: [
        { label: isEn ? 'Initial angle Â' : 'Αρχική γωνία Â', value: `${formatNum(deg, locale)}°` },
        { label: isEn ? 'Symmetry property' : 'Ιδιότητα συμμετρίας', value: isEn ? 'Preservation of angle measures' : 'Διατήρηση μέτρου γωνιών' },
        { label: isEn ? "Reflected angle Â'" : "Συμμετρική γωνία Â'", value: `${formatNum(deg, locale)}° (${isEn ? 'strictly equal' : 'ακριβώς ίση'})` }
      ],
      explanation: isEn
        ? `Axial symmetry keeps all angle measures unaltered: ${formatNum(deg, locale)}°.`
        : `Η αξονική συμμετρία διατηρεί τις γωνίες απολύτως αμετάβλητες: ${formatNum(deg, locale)}°.`
    };
  },
  // 5. Εμβαδόν τετραγώνου και συμμετρικού
  (locale) => {
    const isEn = locale === 'en';
    const s = randInt(4, 8);
    const area = s * s;
    const correct = `${formatNum(area, locale)} cm²`;
    return {
      title: isEn ? 'AREA OF REFLECTED SQUARE' : 'ΕΜΒΑΔΟΝ ΣΥΜΜΕΤΡΙΚΟΥ ΤΕΤΡΑΓΩΝΟΥ',
      prompt: isEn
        ? `A square has a side of ${formatNum(s, locale)} cm (area ${formatNum(area, locale)} cm²). What is the area of its reflected square?`
        : `Ένα τετράγωνο έχει πλευρά ${formatNum(s, locale)} cm (εμβαδόν ${formatNum(area, locale)} cm²). Πόσο είναι το εμβαδόν του συμμετρικού του τετραγώνου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(2 * area, locale)} cm²`,
        `${formatNum(4 * s, locale)} cm²`,
        `${formatNum(area + 8, locale)} cm²`,
        `${formatNum(area - 4 > 0 ? area - 4 : area + 12, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Initial area' : 'Αρχικό εμβαδόν', value: `${formatNum(s, locale)} · ${formatNum(s, locale)} ＝ ${formatNum(area, locale)} cm²` },
        { label: isEn ? 'Reflected area' : 'Συμμετρικό εμβαδόν', value: `${formatNum(area, locale)} cm²` }
      ],
      explanation: isEn
        ? `Symmetric shapes have strictly identical areas: ${formatNum(area, locale)} cm².`
        : `Τα συμμετρικά σχήματα έχουν ίσα εμβαδά: ${formatNum(area, locale)} cm².`
    };
  },
  // 6. Διπλασιασμός εμβαδού από ένωση δύο συμμετρικών
  (locale) => {
    const isEn = locale === 'en';
    const a = randInt(15, 30);
    const total = 2 * a;
    const correct = `${formatNum(total, locale)} cm²`;
    return {
      title: isEn ? 'JOINING TWO SYMMETRIC HALVES' : 'ΕΝΩΣΗ ΔΥΟ ΣΥΜΜΕΤΡΙΚΩΝ ΜΙΣΩΝ',
      prompt: isEn
        ? `A butterfly design consists of two symmetric wings. If the left wing has an area of ${formatNum(a, locale)} cm², what is the total area of the entire butterfly?`
        : `Ένα σχέδιο πεταλούδας αποτελείται από δύο συμμετρικά φτερά. Αν το αριστερό φτερό έχει εμβαδόν ${formatNum(a, locale)} cm², πόσο είναι το συνολικό εμβαδόν ολόκληρης της πεταλούδας;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a, locale)} cm²`,
        `${formatNum(total + 10, locale)} cm²`,
        `${formatNum(total - 5 > 0 ? total - 5 : total + 15, locale)} cm²`,
        `${formatNum(a * a, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Left wing area' : 'Εμβαδόν αριστερού φτερού', value: `${formatNum(a, locale)} cm²` },
        { label: isEn ? 'Right wing area (symmetric)' : 'Εμβαδόν δεξιού φτερού (συμμετρικό)', value: `${formatNum(a, locale)} cm²` },
        { label: isEn ? 'Total area' : 'Συνολικό εμβαδόν', value: `2 · ${formatNum(a, locale)} ＝ ${formatNum(total, locale)} cm²` }
      ],
      explanation: isEn
        ? `Due to symmetry both wings have the same area: ${formatNum(a, locale)} ＋ ${formatNum(a, locale)} ＝ ${formatNum(total, locale)} cm².`
        : `Λόγω συμμετρίας και τα δύο φτερά είναι ίσα: ${formatNum(a, locale)} ＋ ${formatNum(a, locale)} ＝ ${formatNum(total, locale)} cm².`
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα Συμμετρίας & Γεωμετρικών Κατασκευών
const PROBLEM_POOL_Q12 = [
  // 1. Ορθογώνιο και διαγώνιος (Σύνηθες Λάθος)
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn
      ? 'No, because when folded along the diagonal the vertices do not coincide'
      : 'Όχι, γιατί αν διπλώσουμε κατά μήκος της διαγωνίου οι κορυφές δεν εφαρμόζουν';
    return {
      title: isEn ? 'RECTANGLE DIAGONAL AND SYMMETRY' : 'ΔΙΑΓΩΝΙΟΣ ΟΡΘΟΓΩΝΙΟΥ ΚΑΙ ΣΥΜΜΕΤΡΙΑ',
      prompt: isEn
        ? 'Is the diagonal of an oblong rectangle (with unequal sides) an axis of symmetry?'
        : 'Είναι η διαγώνιος ενός ορθογωνίου παραλληλογράμμου (με άνισες πλευρές) άξονας συμμετρίας του;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? 'Yes, because it divides the rectangle into 2 equal triangles' : 'Ναι, γιατί χωρίζει το ορθογώνιο σε 2 ίσα τρίγωνα',
        isEn ? 'Yes, in every parallelogram diagonals are reflection axes' : 'Ναι, σε κάθε παραλληλόγραμμο οι διαγώνιοι είναι άξονες',
        isEn ? 'Yes, only if the rectangle is very large' : 'Ναι, μόνο αν το ορθογώνιο είναι πολύ μεγάλο'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'answer' : 'απάντηση',
      tableData: [
        { label: isEn ? 'Fact 1' : 'Γεγονός 1', value: isEn ? 'The diagonal splits the rectangle into 2 congruent triangles' : 'Η διαγώνιος χωρίζει το ορθογώνιο σε 2 ίσα τρίγωνα' },
        { label: isEn ? 'Fact 2 (Folding)' : 'Γεγονός 2 (Αναδίπλωση)', value: isEn ? 'When folded, the vertices stick out and DO NOT coincide' : 'Όταν διπλωθούν, οι γωνίες εξέχουν και ΔΕΝ ταυτίζονται' },
        { label: isEn ? 'Conclusion' : 'Συμπέρασμα', value: isEn ? 'The diagonal of a rectangle is NOT an axis of symmetry' : 'Η διαγώνιος του ορθογωνίου ΔΕΝ είναι άξονας συμμετρίας' }
      ],
      explanation: isEn
        ? 'Although the diagonal divides the rectangle into 2 congruent triangles, upon folding along the diagonal they do not overlap; hence it is not an axis of symmetry.'
        : 'Παρόλο που η διαγώνιος χωρίζει το ορθογώνιο σε 2 ίσα τρίγωνα, κατά την αναδίπλωση τα τρίγωνα δεν εφαρμόζουν το ένα πάνω στο άλλο, άρα δεν είναι άξονας συμμετρίας.'
    };
  },
  // 2. Πλάγιο παραλληλόγραμμο
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '0 axes of symmetry (none)' : '0 άξονες συμμετρίας (κανέναν)';
    return {
      title: isEn ? 'AXES OF A PARALLELOGRAM' : 'ΑΞΟΝΕΣ ΠΛΑΓΙΟΥ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΥ',
      prompt: isEn
        ? 'How many reflection axes of symmetry does a general slanted parallelogram have (neither a rectangle nor a rhombus)?'
        : 'Πόσους άξονες αξονικής συμμετρίας έχει ένα γενικό πλάγιο παραλληλόγραμμο (που δεν είναι ορθογώνιο ούτε ρόμβος);',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '2 axes of symmetry' : '2 άξονες συμμετρίας',
        isEn ? '1 axis of symmetry' : '1 άξονα συμμετρίας',
        isEn ? '4 axes of symmetry' : '4 άξονες συμμετρίας',
        isEn ? 'Infinitely many axes' : 'Άπειρους άξονες'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'axes' : 'άξονες',
      tableData: [
        { label: isEn ? 'Shape' : 'Σχήμα', value: isEn ? 'Slanted parallelogram' : 'Πλάγιο παραλληλόγραμμο' },
        { label: isEn ? 'Axial symmetry' : 'Αξονική συμμετρία', value: isEn ? 'No line can fold the shape to coincide onto itself' : 'Καμία ευθεία δεν διπλώνει το σχήμα ώστε να ταυτιστεί' },
        { label: isEn ? 'Result' : 'Αποτέλεσμα', value: isEn ? '0 axes of symmetry' : '0 άξονες συμμετρίας' }
      ],
      explanation: isEn
        ? 'A general parallelogram has point (rotational) symmetry of order 2, but has zero reflection axes.'
        : 'Το πλάγιο παραλληλόγραμμο έχει κεντρική συμμετρία (ως προς το κέντρο του), αλλά δεν έχει κανέναν άξονα αξονικής συμμετρίας.'
    };
  },
  // 3. Τετράγωνο vs Ρόμβος
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '4 axes for the square and 2 axes for the rhombus' : '4 άξονες το τετράγωνο και 2 άξονες ο ρόμβος';
    return {
      title: isEn ? 'SQUARE VS RHOMBUS AXES' : 'ΣΥΓΚΡΙΣΗ ΑΞΟΝΩΝ ΤΕΤΡΑΓΩΝΟΥ ΚΑΙ ΡΟΜΒΟΥ',
      prompt: isEn
        ? 'How many axes of symmetry do a square and a non-square rhombus have, respectively?'
        : 'Πόσους άξονες συμμετρίας έχουν αντίστοιχα ένα τετράγωνο και ένας ρόμβος (μη τετράγωνος);',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '4 axes for both' : '4 άξονες και τα δύο',
        isEn ? '2 axes for both' : '2 άξονες και τα δύο',
        isEn ? '4 axes for the rhombus and 2 for the square' : '4 άξονες ο ρόμβος και 2 το τετράγωνο',
        isEn ? 'Infinitely many axes for both' : 'Άπειρους άξονες και τα δύο'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'axes' : 'άξονες',
      tableData: [
        { label: isEn ? 'Square' : 'Τετράγωνο', value: isEn ? '4 axes (2 side bisectors ＋ 2 diagonals)' : '4 άξονες (2 μεσοκάθετες ＋ 2 διαγώνιοι)' },
        { label: isEn ? 'Rhombus' : 'Ρόμβος', value: isEn ? '2 axes (only the 2 diagonals)' : '2 άξονες (μόνο οι 2 διαγώνιοι)' }
      ],
      explanation: isEn
        ? 'A square has 4 axes of symmetry, while a rhombus has only 2 axes (its two diagonals).'
        : 'Το τετράγωνο έχει 4 άξονες συμμετρίας, ενώ ο ρόμβος έχει μόνο 2 άξονες (τις δύο διαγωνίους του).'
    };
  },
  // 4. Τραπέζιο ισοσκελές
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '1 axis of symmetry (perpendicular bisector of parallel bases)' : '1 άξονα συμμετρίας (τη μεσοκάθετο των βάσεων)';
    return {
      title: isEn ? 'AXIS OF ISOSCELES TRAPEZOID' : 'ΑΞΟΝΑΣ ΙΣΟΣΚΕΛΟΥΣ ΤΡΑΠΕΖΙΟΥ',
      prompt: isEn
        ? 'How many axes of symmetry does an isosceles trapezoid have?'
        : 'Πόσους άξονες συμμετρίας έχει ένα ισοσκελές τραπέζιο;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '2 axes of symmetry' : '2 άξονες συμμετρίας',
        isEn ? '4 axes of symmetry' : '4 άξονες συμμετρίας',
        isEn ? 'No axes of symmetry' : 'Κανέναν άξονα συμμετρίας',
        isEn ? '3 axes of symmetry' : '3 άξονες συμμετρίας'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'axes' : 'άξονες',
      tableData: [
        { label: isEn ? 'Shape' : 'Σχήμα', value: isEn ? 'Isosceles trapezoid' : 'Ισοσκελές τραπέζιο' },
        { label: isEn ? 'Axis line' : 'Άξονας', value: isEn ? 'The line connecting midpoints of the two parallel bases' : 'Η ευθεία που ενώνει τα μέσα των δύο παράλληλων βάσεων' },
        { label: isEn ? 'Count' : 'Πλήθος', value: isEn ? '1 axis of symmetry' : '1 άξονας συμμετρίας' }
      ],
      explanation: isEn
        ? 'An isosceles trapezoid has exactly 1 axis of symmetry: the perpendicular bisector of its two parallel bases.'
        : 'Το ισοσκελές τραπέζιο έχει ακριβώς 1 άξονα συμμετρίας, τη μεσοκάθετο των δύο παράλληλων βάσεών του.'
    };
  },
  // 5. Συντεταγμένες συμμετρικού σημείου
  (locale) => {
    const isEn = locale === 'en';
    const x = randInt(2, 7);
    const y = randInt(3, 8);
    const correct = `(-${x}, ${y})`;
    return {
      title: isEn ? 'REFLECTION ACROSS Y-AXIS' : 'ΣΥΜΜΕΤΡΙΑ ΩΣ ΠΡΟΣ ΤΟΝ ΑΞΟΝΑ Y',
      prompt: isEn
        ? `In a coordinate system, point A has coordinates (${x}, ${y}). What are the coordinates of its symmetric point A' across the vertical y-axis?`
        : `Σε ένα σύστημα αξόνων, το σημείο Α έχει συντεταγμένες (${x}, ${y}). Ποιες είναι οι συντεταγμένες του συμμετρικού του σημείου Α' ως προς τον κατακόρυφο άξονα y;`,
      options: ensureFourUniqueOptions(correct, () => [
        `(${x}, -${y})`,
        `(-${x}, -${y})`,
        `(${y}, ${x})`,
        `(${x + 2}, ${y})`
      ]),
      correctAnswer: correct,
      unit: isEn ? 'coordinates' : 'συντεταγμένες',
      tableData: [
        { label: isEn ? 'Initial point' : 'Αρχικό σημείο', value: `(${x}, ${y})` },
        { label: isEn ? 'Axis of symmetry' : 'Άξονας συμμετρίας', value: isEn ? 'Vertical y-axis (x ＝ 0)' : 'Κατακόρυφος άξονας y (x ＝ 0)' },
        { label: isEn ? 'Coordinate change' : 'Μεταβολή συντεταγμένων', value: isEn ? 'x flips sign, y remains identical' : 'Το x αλλάζει πρόσημο, το y μένει ίδιο' },
        { label: isEn ? 'Reflected point' : 'Συμμετρικό σημείο', value: `(-${x}, ${y})` }
      ],
      explanation: isEn
        ? `When reflecting across the vertical y-axis, the x-coordinate negates while the y-coordinate stays unchanged: (-${x}, ${y}).`
        : `Στη συμμετρία ως προς τον κατακόρυφο άξονα y, η τετμημένη x αλλάζει πρόσημο ενώ η τεταγμένη y παραμένει ίδια: (-${x}, ${y}).`
    };
  },
  // 6. Γράμματα της αλφαβήτου με άξονα συμμετρίας
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? 'Letter A (has 1 vertical axis of symmetry)' : 'Το γράμμα Α (έχει 1 κατακόρυφο άξονα συμμετρίας)';
    return {
      title: isEn ? 'SYMMETRY IN CAPITAL LETTERS' : 'ΣΥΜΜΕΤΡΙΑ ΣΤΑ ΚΕΦΑΛΑΙΑ ΓΡΑΜΜΑΤΑ',
      prompt: isEn
        ? 'Which of the following capital letters has an axis of symmetry?'
        : 'Ποιο από τα παρακάτω κεφαλαία γράμματα έχει άξονα συμμετρίας;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? 'Letter F' : 'Το γράμμα Γ',
        isEn ? 'Letter R' : 'Το γράμμα Ρ',
        isEn ? 'Letter S' : 'Το γράμμα Σ',
        isEn ? 'Letter J' : 'Το γράμμα F'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'letter' : 'γράμμα',
      tableData: [
        { label: isEn ? 'Letter A' : 'Γράμμα Α', value: isEn ? 'Has a vertical axis of symmetry in its center' : 'Έχει κατακόρυφο άξονα συμμετρίας στο μέσο του' },
        { label: isEn ? 'Other options' : 'Λοιπά γράμματα', value: isEn ? 'Possess no reflection axis' : 'Δεν έχουν κανέναν άξονα συμμετρίας' }
      ],
      explanation: isEn
        ? 'The uppercase letter A is divided into two perfectly symmetric halves by a vertical axis through its apex.'
        : 'Το κεφαλαίο γράμμα Α χωρίζεται από έναν κατακόρυφο άξονα στο μέσο του σε δύο απόλυτα συμμετρικά μισά.'
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet(locale = 'el') {
  const isEn = locale === 'en';
  const qs = [];

  // Q1: Ορισμός άξονα συμμετρίας (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: isEn ? 'DEFINITION OF AXIS OF SYMMETRY' : 'ΟΡΙΣΜΟΣ ΑΞΟΝΑ ΣΥΜΜΕΤΡΙΑΣ',
    prompt: isQ1True
      ? isEn
        ? 'If we fold a shape along an axis of symmetry, the two halves overlap perfectly onto each other.'
        : 'Αν διπλώσουμε ένα σχήμα κατά μήκος ενός άξονα συμμετρίας του, τα δύο μέρη εφαρμόζουν απόλυτα το ένα πάνω στο άλλο.'
      : isEn
        ? 'Any straight line dividing a shape into two equal halves is necessarily an axis of symmetry.'
        : 'Κάθε ευθεία γραμμή που χωρίζει ένα σχήμα σε δύο ίσα μέρη είναι υποχρεωτικά και άξονας συμμετρίας του.',
    correctAnswer: isQ1True,
    tableData: [
      { label: isEn ? 'Folding rule' : 'Κανόνας αναδίπλωσης', value: isEn ? 'Both parts must coincide perfectly upon folding' : 'Τα δύο μέρη πρέπει να ταυτίζονται απόλυτα κατά το δίπλωμα' },
      { label: isEn ? 'Counterexample' : 'Αντιπαράδειγμα', value: isEn ? 'The diagonal of a rectangle creates 2 congruent triangles, but is NOT an axis of symmetry' : 'Η διαγώνιος του ορθογωνίου χωρίζει σε 2 ίσα τρίγωνα, αλλά ΔΕΝ είναι άξονας συμμετρίας' }
    ],
    explanation: isQ1True
      ? isEn
        ? 'CORRECT: This is the fundamental definition of an axis of symmetry: exact matching upon folding.'
        : 'ΣΩΣΤΟ: Αυτός είναι ο θεμελιώδης ορισμός του άξονα συμμετρίας: η τέλεια εφαρμογή κατά την αναδίπλωση.'
      : isEn
        ? 'FALSE: Having equal area is not sufficient. The two halves must coincide when folded (e.g. the diagonal of an oblong rectangle is not an axis).'
        : 'ΛΑΘΟΣ: Δεν αρκεί να έχουν ίσο εμβαδόν. Πρέπει τα δύο μέρη να ταυτίζονται ακριβώς όταν διπλωθούν (π.χ. η διαγώνιος του ορθογωνίου δεν είναι άξονας).'
  });

  // Q2: Κάθετη απόσταση συμμετρικών σημείων (MCQ)
  const q2Correct = isEn
    ? "The axis is the perpendicular bisector of segment AA' (perpendicular and through the midpoint)"
    : "Ο άξονας είναι η μεσοκάθετος του τμήματος ΑΑ' (κάθετος και περνά από το μέσο)";
  qs.push({
    id: 2,
    type: 'mcq',
    title: isEn ? 'PROPERTY OF SYMMETRIC POINTS' : 'ΙΔΙΟΤΗΤΑ ΣΥΜΜΕΤΡΙΚΩΝ ΣΗΜΕΙΩΝ',
    prompt: isEn
      ? "How are two symmetric points A and A' geometrically related to the axis of symmetry (d)?"
      : "Πώς συνδέονται δύο συμμετρικά σημεία Α και Α' με τον άξονα συμμετρίας (ε);",
    options: ensureFourUniqueOptions(q2Correct, () => [
      isEn ? "The axis forms an arbitrary angle with segment AA'" : "Ο άξονας σχηματίζει οποιαδήποτε τυχαία γωνία με το τμήμα ΑΑ'",
      isEn ? "Point A is always closer to the axis than A'" : "Το σημείο Α είναι πάντα πιο κοντά στον άξονα από το Α'",
      isEn ? 'Both points always lie directly on the axis itself' : 'Τα δύο σημεία βρίσκονται πάντα πάνω στον ίδιο τον άξονα'
    ]),
    correctAnswer: q2Correct,
    tableData: [
      { label: isEn ? 'Angle with axis' : 'Γωνία με τον άξονα', value: isEn ? 'Strictly 90° (perpendicular)' : 'Αυστηρά 90° (κάθετη)' },
      { label: isEn ? 'Distances' : 'Αποστάσεις', value: isEn ? 'd₁ ＝ d₂ (equidistant)' : 'd₁ ＝ d₂ (ισαπέχουν)' },
      { label: isEn ? 'Conclusion' : 'Συμπέρασμα', value: isEn ? 'Perpendicular bisector of the segment' : 'Μεσοκάθετος του ευθύγραμμου τμήματος' }
    ],
    explanation: isEn
      ? 'The axis of symmetry is always the perpendicular bisector of the line segment connecting the two symmetric points.'
      : 'Ο άξονας συμμετρίας είναι πάντοτε η μεσοκάθετος του τμήματος που ενώνει τα δύο συμμετρικά σημεία.'
  });

  // Q3: Άξονες συμμετρίας τετραγώνου (MCQ)
  const q3Correct = isEn ? '4 axes of symmetry' : '4 άξονες συμμετρίας';
  qs.push({
    id: 3,
    type: 'mcq',
    title: isEn ? 'AXES OF SYMMETRY OF A SQUARE' : 'ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΤΕΤΡΑΓΩΝΟΥ',
    prompt: isEn
      ? 'How many axes of symmetry does a square have in total?'
      : 'Πόσους άξονες συμμετρίας έχει συνολικά ένα τετράγωνο;',
    options: ensureFourUniqueOptions(q3Correct, () => [
      isEn ? '2 axes of symmetry' : '2 άξονες συμμετρίας',
      isEn ? '1 axis of symmetry' : '1 άξονα συμμετρίας',
      isEn ? '8 axes of symmetry' : '8 άξονες συμμετρίας'
    ]),
    correctAnswer: q3Correct,
    tableData: [
      { label: isEn ? '2 perpendicular bisectors' : '2 μεσοκάθετοι', value: isEn ? 'Vertical and horizontal bisectors of sides' : 'Κατακόρυφη και οριζόντια μεσοκάθετος πλευρών' },
      { label: isEn ? '2 diagonals' : '2 διαγώνιοι', value: isEn ? 'The two diagonals of the square' : 'Οι δύο διαγώνιοι του τετραγώνου' },
      { label: isEn ? 'Total' : 'Σύνολο', value: isEn ? '4 axes of symmetry' : '4 άξονες συμμετρίας' }
    ],
    explanation: isEn
      ? 'A square has 4 axes of symmetry: 2 perpendicular bisectors of opposite sides and 2 diagonals.'
      : 'Το τετράγωνο έχει 4 άξονες συμμετρίας: τις 2 μεσοκάθετες των απέναντι πλευρών και τις 2 διαγωνίους του.'
  });

  // Q4: Οπτική αναγνώριση άξονα συμμετρίας (SVG - No Giveaway)
  const q4Correct = isEn
    ? 'The vertical dashed line (d) from apex to base'
    : 'Η κατακόρυφη γραμμή (ε) από την κορυφή προς τη βάση';
  qs.push({
    id: 4,
    type: 'mcq',
    title: isEn ? 'AXIS IN AN ISOSCELES TRIANGLE' : 'ΑΝΑΓΝΩΡΙΣΗ ΑΞΟΝΑ ΣΕ ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ',
    prompt: isEn
      ? 'In the isosceles triangle below, which line constitutes its true axis of symmetry?'
      : 'Στο παρακάτω ισοσκελές τρίγωνο, ποια γραμμή αποτελεί τον πραγματικό άξονα συμμετρίας του;',
    svg: (
      <svg viewBox="0 0 160 120" className="w-40 h-28 max-w-full mx-auto my-2 select-none drop-shadow-sm">
        <polygon points="80,20 30,100 130,100" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.5" />
        <line x1="80" y1="10" x2="80" y2="110" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="80" cy="20" r="3" fill="#e11d48" />
        <text x="88" y="15" fill="#f59e0b" fontSize="9" fontWeight="bold">{isEn ? '(d)' : '(ε)'}</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => [
      isEn ? 'The horizontal bottom base line' : 'Η οριζόντια γραμμή της κάτω βάσης',
      isEn ? 'One of the slanted lateral sides' : 'Μία από τις πλάγιες πλευρές του τριγώνου',
      isEn ? 'The isosceles triangle has no axis' : 'Το ισοσκελές τρίγωνο δεν έχει κανέναν άξονα'
    ]),
    correctAnswer: q4Correct,
    tableData: [
      { label: isEn ? 'Shape' : 'Σχήμα', value: isEn ? 'Isosceles triangle' : 'Ισοσκελές τρίγωνο' },
      { label: isEn ? 'Axis of symmetry' : 'Άξονας συμμετρίας', value: isEn ? 'Perpendicular bisector of the base through the apex' : 'Η μεσοκάθετος της βάσης που διέρχεται από την κορυφή' }
    ],
    explanation: isEn
      ? 'In an isosceles triangle the single axis of symmetry is the perpendicular bisector passing through the top vertex and bisecting the base.'
      : 'Στο ισοσκελές τρίγωνο ο μοναδικός άξονας συμμετρίας είναι η κατακόρυφη ευθεία που ξεκινά από την κορυφή και χωρίζει τη βάση στη μέση.'
  });

  // Q5: Υπολογισμός απόστασης σημείου (Input αριθμού)
  const d5 = randInt(4, 9);
  const total5 = 2 * d5;
  qs.push({
    id: 5,
    type: 'input',
    title: isEn ? 'POINT DISTANCE FROM AXIS' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΑΠΟΣΤΑΣΗΣ ΣΗΜΕΙΟΥ ΑΠΟ ΑΞΟΝΑ',
    prompt: isEn
      ? `Two symmetric points A and A' are separated by a total distance of ${formatNum(total5, locale)} cm. How many centimeters (cm) is point A from the axis of symmetry? (Enter only the number)`
      : `Δύο συμμετρικά σημεία Α και Α' απέχουν μεταξύ τους συνολικά ${formatNum(total5, locale)} cm. Πόσα εκατοστά (cm) απέχει το σημείο Α από τον άξονα συμμετρίας; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(d5),
    tableData: [
      { label: isEn ? "Total length AA'" : "Συνολικό μήκος ΑΑ'", value: `${formatNum(total5, locale)} cm` },
      { label: isEn ? 'Operation' : 'Πράξη', value: `${formatNum(total5, locale)} : 2` },
      { label: isEn ? 'Distance from axis' : 'Απόσταση από άξονα', value: `${formatNum(d5, locale)} cm` }
    ],
    fractionData: { n: `${formatNum(total5, locale)} cm`, d: '2', res: `${formatNum(d5, locale)} cm` },
    explanation: isEn
      ? `The axis passes right through the midpoint of segment AA': ${formatNum(total5, locale)} : 2 ＝ ${formatNum(d5, locale)} cm.`
      : `Ο άξονας περνάει ακριβώς από τη μέση του τμήματος ΑΑ': ${formatNum(total5, locale)} : 2 ＝ ${formatNum(d5, locale)} cm.`
  });

  // Q6: Άξονες συμμετρίας ορθογωνίου (Input αριθμού)
  qs.push({
    id: 6,
    type: 'input',
    title: isEn ? 'NUMBER OF AXES OF A RECTANGLE' : 'ΠΛΗΘΟΣ ΑΞΟΝΩΝ ΟΡΘΟΓΩΝΙΟΥ',
    prompt: isEn
      ? 'How many axes of symmetry does an oblong rectangle have? (Enter only the number)'
      : 'Πόσους άξονες συμμετρίας έχει ένα ορθογώνιο παραλληλόγραμμο (με άνισες πλευρές); (Γράψτε μόνο τον αριθμό)',
    correctAnswer: '2',
    tableData: [
      { label: isEn ? 'Shape' : 'Σχήμα', value: isEn ? 'Oblong rectangle' : 'Ορθογώνιο παραλληλόγραμμο' },
      { label: isEn ? 'Axes' : 'Άξονες', value: isEn ? '2 (perpendicular bisectors of opposite sides)' : '2 (οι μεσοκάθετες των απέναντι πλευρών)' }
    ],
    explanation: isEn
      ? 'A rectangle has exactly 2 axes of symmetry (the vertical and horizontal perpendicular bisectors). Its diagonals are not reflection axes.'
      : 'Το ορθογώνιο έχει ακριβώς 2 άξονες συμμετρίας (την κατακόρυφη και την οριζόντια μεσοκάθετο). Οι διαγώνιοί του δεν είναι άξονες.'
  });

  // Q7: Ιδιότητες συμμετρικών σχημάτων (MCQ)
  const q7Correct = isEn
    ? 'They are congruent: equal in sides, angles, perimeter, and area'
    : 'Είναι απολύτως ίσα μεταξύ τους σε πλευρές, γωνίες, περίμετρο και εμβαδόν';
  qs.push({
    id: 7,
    type: 'mcq',
    title: isEn ? 'CONGRUENCE OF SYMMETRIC SHAPES' : 'ΙΣΟΤΗΤΑ ΣΥΜΜΕΤΡΙΚΩΝ ΣΧΗΜΑΤΩΝ',
    prompt: isEn
      ? 'Which statement holds true for two symmetric geometric shapes?'
      : 'Ποια από τις παρακάτω προτάσεις ισχύει για δύο συμμετρικά γεωμετρικά σχήματα;',
    options: ensureFourUniqueOptions(q7Correct, () => [
      isEn ? 'The symmetric shape is always twice as large' : 'Το συμμετρικό σχήμα είναι πάντα διπλάσιο σε μέγεθος',
      isEn ? 'The symmetric shape has altered angle measures' : 'Το συμμετρικό σχήμα έχει διαφορετικές γωνίες',
      isEn ? 'They have equal perimeter but different area' : 'Έχουν ίση περίμετρο αλλά διαφορετικό εμβαδόν'
    ]),
    correctAnswer: q7Correct,
    tableData: [
      { label: isEn ? 'Axial symmetry' : 'Αξονική συμμετρία', value: isEn ? 'Isometry (preserves all metrics)' : 'Ισομετρία (διατήρηση όλων των μεγεθών)' },
      { label: isEn ? 'Relationship' : 'Σχέση σχημάτων', value: isEn ? 'Strictly congruent shapes' : 'Απολύτως ίσα σχήματα' }
    ],
    explanation: isEn
      ? 'Axial symmetry preserves distances, angles, and areas; thus the two shapes are completely congruent.'
      : 'Η αξονική συμμετρία διατηρεί τα μήκη, τις γωνίες και τα εμβαδά, άρα τα δύο σχήματα είναι απολύτως ίσα.'
  });

  // Q8: Άξονες κανονικού εξαγώνου (MCQ)
  const q8Correct = isEn ? '6 axes of symmetry' : '6 άξονες συμμετρίας';
  qs.push({
    id: 8,
    type: 'mcq',
    title: isEn ? 'AXES OF REGULAR HEXAGON' : 'ΑΞΟΝΕΣ ΚΑΝΟΝΙΚΟΥ ΕΞΑΓΩΝΟΥ',
    prompt: isEn
      ? 'How many axes of symmetry does a regular hexagon have?'
      : 'Πόσους άξονες συμμετρίας έχει ένα κανονικό εξάγωνο;',
    options: ensureFourUniqueOptions(q8Correct, () => [
      isEn ? '3 axes of symmetry' : '3 άξονες συμμετρίας',
      isEn ? '4 axes of symmetry' : '4 άξονες συμμετρίας',
      isEn ? '12 axes of symmetry' : '12 άξονες συμμετρίας'
    ]),
    correctAnswer: q8Correct,
    tableData: [
      { label: isEn ? 'Rule' : 'Κανόνας', value: isEn ? 'Every regular n-gon has n axes of symmetry' : 'Κάθε κανονικό ν-γωνο έχει ν άξονες συμμετρίας' },
      { label: isEn ? 'Regular hexagon' : 'Κανονικό εξάγωνο', value: isEn ? 'n ＝ 6, hence 6 axes' : 'ν ＝ 6, άρα 6 άξονες' }
    ],
    explanation: isEn
      ? 'Every regular polygon with n sides has n axes of symmetry: a regular hexagon has 6 axes.'
      : 'Κάθε κανονικό πολύγωνο με ν πλευρές έχει ν άξονες συμμετρίας: το κανονικό εξάγωνο έχει 6 άξονες.'
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

export default function SimmetriaAskiseisPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';

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

  // Μεταφράσεις UI
  const ui = {
    el: {
      headTitle: "Ασκήσεις: Αξονική Συμμετρία & Άξονας Συμμετρίας - ΣΤ' Δημοτικού | LearnMaths.gr",
      headDesc: "Διαδραστικές ασκήσεις στην αξονική συμμετρία, τους άξονες συμμετρίας και τα συμμετρικά σχήματα για τη ΣΤ' Δημοτικού.",
      backTheory: "Θεωρία Κεφ. 71",
      btnTheory: "📖 Θεωρία",
      badge: "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 71 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Ασκήσεις: Αξονική Συμμετρία και Άξονες",
      heroDesc: "Εξασκηθείτε στους άξονες συμμετρίας των γεωμετρικών σχημάτων, τις αποστάσεις συμμετρικών σημείων και τις ιδιότητες της αναδίπλωσης μέσα από 12 δυναμικές ερωτήσεις.",
      heroSub: "12 Δυναμικές Ασκήσεις με Αυτόματη Αξιολόγηση & Αναλυτική Επεξήγηση",
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
      headTitle: "Exercises: Axial Symmetry & Axis of Symmetry - 6th Grade | LearnMaths.gr",
      headDesc: "Interactive exercises on axial symmetry, reflection axes, and symmetric shapes for 6th Grade Math.",
      backTheory: "Theory Chap. 71",
      btnTheory: "📖 Theory",
      badge: "EXERCISES • CHAPTER 71 • 6TH GRADE",
      heroTitle: "Exercises: Axial Symmetry and Axes",
      heroDesc: "Practice identifying reflection axes of geometric shapes, calculating symmetric point distances, and exploring rigid folding properties across 12 dynamic questions.",
      heroSub: "12 Dynamic Questions with Instant Feedback & Detailed Solutions",
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
      feedbackCorrect: "✓ Great job! Correct answer.",
      feedbackWrong: "✗ Incorrect. The correct answer is: "
    }
  }[locale];

  return (
    <Layout
      title={ui.headTitle}
      description={ui.headDesc}
      backUrl="/st-dimotikou/71-simmetria"
      backText={ui.backTheory}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/71-simmetria"
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

        {/* ΛΙΣΤΑ ΕΡΩΤΗΣΕΩΝ (12 ΕΡΩΤΗΣΕΙΣ) */}
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
                      {toCleanUppercase(q.title || (isEn ? `QUESTION ${index + 1}` : `ΕΡΩΤΗΣΗ ${index + 1}`))}
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

                  {/* ΤΥΠΟΣ 2: MCQ (4 ΜΟΝΑΔΙΚΑ ΚΟΥΜΠΙΑ ΧΩΡΙΣ LINE-CLAMP) */}
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
                            .replace(/[^0-9.,-]/g, '')
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

        {/* STICKY BOTTOM SCORE FOOTER (12 ΕΡΩΤΗΣΕΙΣ) */}
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
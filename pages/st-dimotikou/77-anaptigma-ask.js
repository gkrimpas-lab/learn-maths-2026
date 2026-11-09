// pages/st-dimotikou/77-anaptigma-ask.js
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

// Visual Fraction component: αριθμητής πάνω, κλασματική γραμμή, παρονομαστής κάτω
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-0.5 sm:mx-1 text-center font-mono leading-none text-[0.85em] sm:text-[0.9em] shrink-0 max-w-full ${className}`}>
      <span className="border-b border-current pb-0.5 px-0.5 sm:px-1 break-all">{num}</span>
      <span className="pt-0.5 px-0.5 sm:px-1 break-all">{den}</span>
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

  let offset = 6;
  while (optionsSet.size < 4) {
    const numPart = parseFloat(String(correctText).replace(/[^0-9.,]/g, '').replace(',', '.'));
    if (!isNaN(numPart)) {
      const unit = String(correctText).replace(/[0-9.,\s]/g, '');
      const fakeNum = Math.round(numPart + offset);
      const fakeOpt = unit ? `${fakeNum} ${unit}` : `${fakeNum}`;
      optionsSet.add(fakeOpt);
      offset += 6;
    } else {
      optionsSet.add(`${correctText} · ${optionsSet.size}`);
    }
  }

  return shuffle([...optionsSet]);
}

// -------------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (POOLS) ΓΙΑ Q9, Q10, Q11, Q12
// -------------------------------------------------------------

// POOL ΓΙΑ Q9: Ολική Επιφάνεια Αναπτύγματος Κύβου [Ε ＝ 6 · α²]
const PROBLEM_POOL_Q9 = [
  // 1. Κατασκευή κύβου από χαρτόνι
  (locale) => {
    const isEl = locale === 'el';
    const a = randInt(4, 12);
    const faceArea = a * a;
    const totalArea = 6 * faceArea;
    const correct = `${formatNum(totalArea, locale)} cm²`;
    const edgeSym = isEl ? 'α' : 'a';
    return {
      title: isEl ? 'ΚΑΤΑΣΚΕΥΗ ΚΥΒΟΥ' : 'CUBE CONSTRUCTION',
      prompt: isEl
        ? `Ένας μαθητής σχεδιάζει το ανάπτυγμα ενός κύβου με ακμή ${formatNum(a, locale)} cm. Πόσο χαρτόνι σε cm² θα καταλαμβάνει το ανάπτυγμα του κύβου;`
        : `A student designs the net of a cube with edge length ${formatNum(a, locale)} cm. How much cardboard in cm² will the net occupy?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(faceArea, locale)} cm²`,
        `${formatNum(totalArea + 24, locale)} cm²`,
        `${formatNum(totalArea > 24 ? totalArea - 24 : totalArea + 48, locale)} cm²`,
        `${formatNum(4 * faceArea, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEl ? `Ακμή κύβου (${edgeSym})` : `Cube edge (${edgeSym})`, value: `${formatNum(a, locale)} cm` },
        {
          label: isEl ? 'Εμβαδόν 1 έδρας (τετράγωνο)' : 'Area of 1 face (square)',
          valueNode: (
            <span>
              {edgeSym}<sup>2</sup> ＝ {formatNum(a, locale)} · {formatNum(a, locale)} ＝ {formatNum(faceArea, locale)} cm²
            </span>
          )
        },
        { label: isEl ? 'Πλήθος εδρών' : 'Number of faces', value: isEl ? '6 ίσες έδρες' : '6 congruent faces' },
        {
          label: isEl ? 'Ολικό εμβαδόν αναπτύγματος' : 'Total net area',
          valueNode: (
            <span>
              6 · {formatNum(faceArea, locale)} ＝ {formatNum(totalArea, locale)} cm²
            </span>
          )
        }
      ],
      explanation: isEl
        ? `Ο κύβος έχει 6 ίσες τετράγωνες έδρες. Κάθε έδρα έχει εμβαδόν ${formatNum(a, locale)} · ${formatNum(a, locale)} ＝ ${formatNum(faceArea, locale)} cm². Το ανάπτυγμα καλύπτει: 6 · ${formatNum(faceArea, locale)} ＝ ${formatNum(totalArea, locale)} cm².`
        : `The cube has 6 congruent square faces. Each face has an area of ${formatNum(a, locale)} · ${formatNum(a, locale)} ＝ ${formatNum(faceArea, locale)} cm². The net occupies: 6 · ${formatNum(faceArea, locale)} ＝ ${formatNum(totalArea, locale)} cm².`
    };
  },
  // 2. Ξύλινο κουτί κύβος
  (locale) => {
    const isEl = locale === 'el';
    const a = randInt(15, 25);
    const faceArea = a * a;
    const totalArea = 6 * faceArea;
    const correct = `${formatNum(totalArea, locale)} cm²`;
    const edgeSym = isEl ? 'α' : 'a';
    return {
      title: isEl ? 'ΞΥΛΙΝΟ ΚΟΥΤΙ ΚΥΒΟΣ' : 'WOODEN CUBE BOX',
      prompt: isEl
        ? `Ένα ξύλινο κουτί σε σχήμα κύβου έχει ακμή ${formatNum(a, locale)} cm. Πόση είναι η συνολική επιφάνεια και των 6 εξωτερικών του εδρών;`
        : `A wooden box in the shape of a cube has an edge length of ${formatNum(a, locale)} cm. What is the total surface area of all 6 outer faces?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(faceArea, locale)} cm²`,
        `${formatNum(totalArea + 150, locale)} cm²`,
        `${formatNum(totalArea > 150 ? totalArea - 150 : totalArea + 300, locale)} cm²`,
        `${formatNum(a * 12, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEl ? `Ακμή (${edgeSym})` : `Edge (${edgeSym})`, value: `${formatNum(a, locale)} cm` },
        { label: isEl ? 'Εμβαδόν 1 έδρας' : 'Area of 1 face', value: `${formatNum(faceArea, locale)} cm²` },
        {
          label: isEl ? `Πράξη (6 · ${edgeSym}²)` : `Formula (6 · ${edgeSym}²)`,
          valueNode: (
            <span>
              6 · {formatNum(faceArea, locale)} ＝ {formatNum(totalArea, locale)} cm²
            </span>
          )
        }
      ],
      explanation: isEl
        ? `Εολ ＝ 6 · ${edgeSym}² ＝ 6 · (${formatNum(a, locale)} · ${formatNum(a, locale)}) ＝ 6 · ${formatNum(faceArea, locale)} ＝ ${formatNum(totalArea, locale)} cm².`
        : `Atot ＝ 6 · ${edgeSym}² ＝ 6 · (${formatNum(a, locale)} · ${formatNum(a, locale)}) ＝ 6 · ${formatNum(faceArea, locale)} ＝ ${formatNum(totalArea, locale)} cm².`
    };
  },
  // 3. Μεγάλο διακοσμητικό ζάρι
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(600, locale)} cm²`;
    return {
      title: isEl ? 'ΜΕΓΑΛΟ ΖΑΡΙ' : 'LARGE DIE',
      prompt: isEl
        ? 'Ένα διακοσμητικό ζάρι σε σχήμα κύβου έχει ακμή 10 cm. Πόσο είναι το συνολικό εμβαδόν των 6 εδρών του;'
        : 'A decorative cube die has an edge of 10 cm. What is the total area of its 6 faces?',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(100, locale)} cm²`,
        `${formatNum(400, locale)} cm²`,
        `${formatNum(360, locale)} cm²`,
        `${formatNum(1000, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEl ? 'Ακμή' : 'Edge', value: '10 cm' },
        { label: isEl ? '1 έδρα' : '1 face', value: '10 · 10 ＝ 100 cm²' },
        { label: isEl ? '6 έδρες' : '6 faces', value: '6 · 100 ＝ 600 cm²' }
      ],
      explanation: isEl
        ? '6 · (10 · 10) ＝ 6 · 100 ＝ 600 cm².'
        : '6 · (10 · 10) ＝ 6 · 100 ＝ 600 cm².'
    };
  },
  // 4. Κυβική δεξαμενή σε μέτρα
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(24, locale)} m²`;
    return {
      title: isEl ? 'ΚΥΒΙΚΗ ΔΕΞΑΜΕΝΗ' : 'CUBICAL TANK',
      prompt: isEl
        ? 'Μια κλειστή δεξαμενή έχει σχήμα κύβου με ακμή 2 m. Πόσα τετραγωνικά μέτρα (m²) λαμαρίνας χρειάστηκαν για την κατασκευή και των 6 εδρών της;'
        : 'A closed storage tank is in the shape of a cube with an edge of 2 m. How many square meters (m²) of sheet metal were needed to construct all 6 faces?',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(8, locale)} m²`,
        `${formatNum(12, locale)} m²`,
        `${formatNum(16, locale)} m²`,
        `${formatNum(36, locale)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEl ? 'Ακμή' : 'Edge', value: '2 m' },
        { label: isEl ? '1 έδρα' : '1 face', value: '2 · 2 ＝ 4 m²' },
        { label: isEl ? '6 έδρες' : '6 faces', value: '6 · 4 ＝ 24 m²' }
      ],
      explanation: isEl
        ? '6 · (2 · 2) ＝ 6 · 4 ＝ 24 m².'
        : '6 · (2 · 2) ＝ 6 · 4 ＝ 24 m².'
    };
  }
];

// POOL ΓΙΑ Q10: Ολική Επιφάνεια Ορθογωνίου Παραλληλεπιπέδου
const PROBLEM_POOL_Q10 = [
  // 1. Κουτί δώρου
  (locale) => {
    const isEl = locale === 'el';
    const l = randInt(15, 25);
    const w = randInt(10, 14);
    const h = randInt(6, 10);
    const f1 = l * w;
    const f2 = w * h;
    const f3 = l * h;
    const total = 2 * (f1 + f2 + f3);
    const correct = `${formatNum(total, locale)} cm²`;
    return {
      title: isEl ? 'ΚΟΥΤΙ ΔΩΡΟΥ' : 'GIFT BOX',
      prompt: isEl
        ? `Ένα κουτί δώρου σε σχήμα ορθογωνίου παραλληλεπιπέδου έχει μήκος ${formatNum(l, locale)} cm, πλάτος ${formatNum(w, locale)} cm και ύψος ${formatNum(h, locale)} cm. Πόσο χαρτί περιτυλίγματος σε cm² απαιτείται για να καλυφθούν ακριβώς οι 6 έδρες του;`
        : `A gift box in the shape of a rectangular prism has length ${formatNum(l, locale)} cm, width ${formatNum(w, locale)} cm, and height ${formatNum(h, locale)} cm. How much wrapping paper in cm² is needed to cover all 6 faces?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(f1 + f2 + f3, locale)} cm²`,
        `${formatNum(total + 50, locale)} cm²`,
        `${formatNum(total > 50 ? total - 50 : total + 100, locale)} cm²`,
        `${formatNum(l * w * h, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEl ? '2 έδρες (μήκος · πλάτος)' : '2 faces (length · width)', value: `2 · (${formatNum(l, locale)} · ${formatNum(w, locale)}) ＝ ${formatNum(2 * f1, locale)} cm²` },
        { label: isEl ? '2 έδρες (πλάτος · ύψος)' : '2 faces (width · height)', value: `2 · (${formatNum(w, locale)} · ${formatNum(h, locale)}) ＝ ${formatNum(2 * f2, locale)} cm²` },
        { label: isEl ? '2 έδρες (μήκος · ύψος)' : '2 faces (length · height)', value: `2 · (${formatNum(l, locale)} · ${formatNum(h, locale)}) ＝ ${formatNum(2 * f3, locale)} cm²` },
        { label: isEl ? 'Ολική επιφάνεια (6 έδρες)' : 'Total surface area (6 faces)', value: `${formatNum(2 * f1, locale)} ＋ ${formatNum(2 * f2, locale)} ＋ ${formatNum(2 * f3, locale)} ＝ ${formatNum(total, locale)} cm²` }
      ],
      explanation: isEl
        ? `Υπολογίζουμε τα 3 ζεύγη ίσων εδρών: 2 · (${formatNum(l, locale)} · ${formatNum(w, locale)} ＋ ${formatNum(w, locale)} · ${formatNum(h, locale)} ＋ ${formatNum(l, locale)} · ${formatNum(h, locale)}) ＝ ${formatNum(total, locale)} cm².`
        : `Calculate the 3 pairs of congruent faces: 2 · (${formatNum(l, locale)} · ${formatNum(w, locale)} ＋ ${formatNum(w, locale)} · ${formatNum(h, locale)} ＋ ${formatNum(l, locale)} · ${formatNum(h, locale)}) ＝ ${formatNum(total, locale)} cm².`
    };
  },
  // 2. Κουτί παπουτσιών
  (locale) => {
    const isEl = locale === 'el';
    const total = 2 * (30 * 20 + 20 * 10 + 30 * 10); // 2.200 cm²
    const correct = `${formatNum(total, locale)} cm²`;
    const num1200 = isEl ? '1.200' : '1,200';
    const num2200 = isEl ? '2.200' : '2,200';
    return {
      title: isEl ? 'ΚΟΥΤΙ ΠΑΠΟΥΤΣΙΩΝ' : 'SHOE BOX',
      prompt: isEl
        ? 'Ένα κουτί παπουτσιών έχει διαστάσεις 30 cm, 20 cm και 10 cm. Πόσα cm² χαρτονιού χρειάστηκαν για την κατασκευή του αναπτύγματός του;'
        : 'A shoebox has dimensions 30 cm, 20 cm, and 10 cm. How many cm² of cardboard were needed to construct its net?',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(1100, locale)} cm²`,
        `${formatNum(6000, locale)} cm²`,
        `${formatNum(2000, locale)} cm²`,
        `${formatNum(2400, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEl ? 'Βάση και καπάκι' : 'Base and top lid', value: `2 · (30 · 20) ＝ ${num1200} cm²` },
        { label: isEl ? 'Πλαϊνές έδρες' : 'Side faces', value: '2 · (20 · 10) ＝ 400 cm²' },
        { label: isEl ? 'Εμπρός και πίσω' : 'Front and back', value: '2 · (30 · 10) ＝ 600 cm²' },
        { label: isEl ? 'Σύνολο' : 'Total', value: `${num1200} ＋ 400 ＋ 600 ＝ ${num2200} cm²` }
      ],
      explanation: isEl
        ? '2 · (600 ＋ 200 ＋ 300) ＝ 2 · 1.100 ＝ 2.200 cm².'
        : '2 · (600 ＋ 200 ＋ 300) ＝ 2 · 1,100 ＝ 2,200 cm².'
    };
  },
  // 3. Σπιρτόκουτο
  (locale) => {
    const isEl = locale === 'el';
    const total = 2 * (5 * 4 + 4 * 2 + 5 * 2); // 76 cm²
    const correct = `${total} cm²`;
    return {
      title: isEl ? 'ΣΠΙΡΤΟΚΟΥΤΟ' : 'MATCHBOX',
      prompt: isEl
        ? 'Ένα σπιρτόκουτο έχει μήκος 5 cm, πλάτος 4 cm και ύψος 2 cm. Πόση είναι η ολική εξωτερική επιφάνεια του κουτιού;'
        : 'A matchbox has length 5 cm, width 4 cm, and height 2 cm. What is the total external surface area of the box?',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(38, locale)} cm²`,
        `${formatNum(40, locale)} cm²`,
        `${formatNum(80, locale)} cm²`,
        `${formatNum(60, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEl ? 'Διαστάσεις' : 'Dimensions', value: '5 cm, 4 cm, 2 cm' },
        { label: isEl ? 'Πράξη' : 'Calculation', value: '2 · (20 ＋ 8 ＋ 10) ＝ 2 · 38 ＝ 76 cm²' }
      ],
      explanation: isEl
        ? '2 · (5 · 4 ＋ 4 · 2 ＋ 5 · 2) ＝ 2 · 38 ＝ 76 cm².'
        : '2 · (5 · 4 ＋ 4 · 2 ＋ 5 · 2) ＝ 2 · 38 ＝ 76 cm².'
    };
  }
];

// POOL ΓΙΑ Q11: Αντίστροφο Πρόβλημα Κύβου (Εύρεση Ακμής από την Επιφάνεια)
const PROBLEM_POOL_Q11 = [
  // 1. Εύρεση ακμής κύβου με Εολ = 96 cm²
  (locale) => {
    const isEl = locale === 'el';
    const correct = '4 cm';
    const edgeSym = isEl ? 'α' : 'a';
    return {
      title: isEl ? 'ΕΥΡΕΣΗ ΑΚΜΗΣ ΚΥΒΟΥ' : 'FINDING CUBE EDGE',
      prompt: isEl
        ? 'Το ολικό εμβαδόν του αναπτύγματος ενός κύβου είναι 96 cm². Πόσο είναι το μήκος της ακμής του κύβου;'
        : 'The total surface area of a cube net is 96 cm². What is the edge length of the cube?',
      options: ensureFourUniqueOptions(correct, () => ['16 cm', '6 cm', '8 cm', '5 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEl ? 'Ολικό εμβαδόν (6 έδρες)' : 'Total area (6 faces)', value: '96 cm²' },
        {
          label: isEl ? 'Εμβαδόν 1 έδρας' : 'Area of 1 face',
          valueNode: (
            <span className="inline-flex items-center">
              <Fraction num="96" den="6" />
              <span>＝ 16 cm²</span>
            </span>
          )
        },
        {
          label: isEl ? `Μήκος ακμής (${edgeSym} · ${edgeSym} ＝ 16)` : `Edge length (${edgeSym} · ${edgeSym} ＝ 16)`,
          value: `${edgeSym} ＝ 4 cm`
        }
      ],
      explanation: isEl
        ? 'Διαιρούμε το ολικό εμβαδόν με το 6 για να βρούμε την επιφάνεια της μίας έδρας: 96 : 6 ＝ 16 cm². Αφού η έδρα είναι τετράγωνο: 4 · 4 ＝ 16, άρα η ακμή είναι 4 cm.'
        : 'Divide total area by 6 to find one face area: 96 : 6 ＝ 16 cm². Since the face is a square: 4 · 4 ＝ 16, so edge length is 4 cm.'
    };
  },
  // 2. Εύρεση ακμής κύβου με Εολ = 150 cm²
  (locale) => {
    const isEl = locale === 'el';
    const correct = '5 cm';
    const edgeSym = isEl ? 'α' : 'a';
    return {
      title: isEl ? 'ΑΚΜΗ ΚΥΒΟΥ ΑΠΟ ΤΟ ΕΜΒΑΔΟΝ' : 'CUBE EDGE FROM AREA',
      prompt: isEl
        ? 'Το ανάπτυγμα ενός κύβου καταλαμβάνει επιφάνεια 150 cm². Πόσο μετράει η ακμή του κύβου;'
        : 'The net of a cube occupies an area of 150 cm². What is the edge length of the cube?',
      options: ensureFourUniqueOptions(correct, () => ['25 cm', '6 cm', '10 cm', '4 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        {
          label: isEl ? 'Εμβαδόν 1 έδρας' : 'Area of 1 face',
          valueNode: (
            <span className="inline-flex items-center">
              <Fraction num="150" den="6" />
              <span>＝ 25 cm²</span>
            </span>
          )
        },
        {
          label: isEl ? `Ακμή (${edgeSym} · ${edgeSym} ＝ 25)` : `Edge (${edgeSym} · ${edgeSym} ＝ 25)`,
          value: `${edgeSym} ＝ 5 cm`
        }
      ],
      explanation: isEl
        ? '150 : 6 ＝ 25 cm². Επειδή 5 · 5 ＝ 25, η ακμή είναι 5 cm.'
        : '150 : 6 ＝ 25 cm². Because 5 · 5 ＝ 25, the edge length is 5 cm.'
    };
  },
  // 3. Εύρεση ακμής κύβου με Εολ = 216 cm²
  (locale) => {
    const isEl = locale === 'el';
    const correct = '6 cm';
    const edgeSym = isEl ? 'α' : 'a';
    return {
      title: isEl ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΑΚΜΗΣ ΚΥΒΟΥ' : 'CALCULATING CUBE EDGE',
      prompt: isEl
        ? 'Ένας κύβος έχει ολική επιφάνεια 216 cm². Πόσο είναι το μήκος κάθε ακμής του;'
        : 'A cube has a total surface area of 216 cm². What is the length of each edge?',
      options: ensureFourUniqueOptions(correct, () => ['36 cm', '8 cm', '12 cm', '4 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        {
          label: isEl ? '1 έδρα' : '1 face',
          valueNode: (
            <span className="inline-flex items-center">
              <Fraction num="216" den="6" />
              <span>＝ 36 cm²</span>
            </span>
          )
        },
        {
          label: isEl ? 'Ακμή' : 'Edge',
          value: isEl ? `6 · 6 ＝ 36, άρα ${edgeSym} ＝ 6 cm` : `6 · 6 ＝ 36, so ${edgeSym} ＝ 6 cm`
        }
      ],
      explanation: isEl
        ? '216 : 6 ＝ 36 cm². 6 · 6 ＝ 36, άρα α ＝ 6 cm.'
        : '216 : 6 ＝ 36 cm². 6 · 6 ＝ 36, so a ＝ 6 cm.'
    };
  }
];

// POOL ΓΙΑ Q12: Συνολικό Μήκος Ακμών & Σύνθετοι Υπολογισμοί
const PROBLEM_POOL_Q12 = [
  // 1. Συρμάτινος σκελετός κύβου (12 ακμές)
  (locale) => {
    const isEl = locale === 'el';
    const a = randInt(5, 15);
    const totalWire = 12 * a;
    const correct = `${formatNum(totalWire, locale)} cm`;
    return {
      title: isEl ? 'ΣΥΡΜΑΤΙΝΟΣ ΣΚΕΛΕΤΟΣ ΚΥΒΟΥ' : 'WIRE CUBE FRAME',
      prompt: isEl
        ? `Θέλουμε να κατασκευάσουμε έναν σκελετό κύβου από σύρμα με μήκος ακμής ${formatNum(a, locale)} cm. Πόσο σύρμα σε cm θα χρειαστεί για να φτιαχτούν όλες οι ακμές του κύβου;`
        : `We want to construct a wire cube frame with edge length ${formatNum(a, locale)} cm. How much wire in cm will be required to form all its edges?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(6 * a, locale)} cm`,
        `${formatNum(8 * a, locale)} cm`,
        `${formatNum(totalWire + 12, locale)} cm`,
        `${formatNum(totalWire > 12 ? totalWire - 12 : totalWire + 24, locale)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEl ? 'Μήκος 1 ακμής' : 'Length of 1 edge', value: `${formatNum(a, locale)} cm` },
        { label: isEl ? 'Συνολικό πλήθος ακμών κύβου' : 'Total cube edges', value: isEl ? '12 ακμές' : '12 edges' },
        { label: isEl ? 'Συνολικό μήκος σύρματος' : 'Total wire length', value: `12 · ${formatNum(a, locale)} ＝ ${formatNum(totalWire, locale)} cm` }
      ],
      explanation: isEl
        ? `Ο κύβος έχει 12 ίσες ακμές. Επομένως, το συνολικό μήκος του σύρματος είναι: 12 · ${formatNum(a, locale)} ＝ ${formatNum(totalWire, locale)} cm.`
        : `A cube has 12 congruent edges. Thus, the total wire length required is: 12 · ${formatNum(a, locale)} ＝ ${formatNum(totalWire, locale)} cm.`
    };
  },
  // 2. Συρμάτινος σκελετός ορθογωνίου παραλληλεπιπέδου
  (locale) => {
    const isEl = locale === 'el';
    const totalWire = 4 * (10 + 6 + 4); // 80 cm
    const correct = '80 cm';
    return {
      title: isEl ? 'ΣΚΕΛΕΤΟΣ ΟΡΘΟΓΩΝΙΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ' : 'RECTANGULAR PRISM WIRE FRAME',
      prompt: isEl
        ? 'Κατασκευάζουμε τον σκελετό ενός ορθογωνίου παραλληλεπιπέδου με σύρμα. Αν οι διαστάσεις του είναι 10 cm, 6 cm και 4 cm, πόσο σύρμα χρειάζεται για τις 12 ακμές του;'
        : 'We build a wire frame for a rectangular prism. If its dimensions are 10 cm, 6 cm, and 4 cm, how much wire is needed for its 12 edges?',
      options: ensureFourUniqueOptions(correct, () => ['20 cm', '40 cm', '100 cm', '60 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: isEl ? 'Ομάδες ακμών' : 'Edge sets', value: isEl ? '4 μήκη, 4 πλάτη, 4 ύψη' : '4 lengths, 4 widths, 4 heights' },
        { label: isEl ? 'Πράξη' : 'Calculation', value: '4 · (10 ＋ 6 ＋ 4) ＝ 4 · 20 ＝ 80 cm' }
      ],
      explanation: isEl
        ? 'Το ορθογώνιο παραλληλεπίπεδο έχει 4 ακμές από κάθε διάσταση: 4 · (10 ＋ 6 ＋ 4) ＝ 4 · 20 ＝ 80 cm.'
        : 'A rectangular prism has 4 edges for each dimension: 4 · (10 ＋ 6 ＋ 4) ＝ 4 · 20 ＝ 80 cm.'
    };
  },
  // 3. Ανοιχτό κουτί (5 έδρες)
  (locale) => {
    const isEl = locale === 'el';
    const correct = '125 cm²';
    return {
      title: isEl ? 'ΑΝΟΙΧΤΟ ΚΟΥΤΙ ΧΩΡΙΣ ΚΑΠΑΚΙ' : 'OPEN BOX WITHOUT LID',
      prompt: isEl
        ? 'Θέλουμε να φτιάξουμε ένα ανοιχτό κυβικό κουτί (χωρίς καπάκι στο πάνω μέρος) με ακμή 5 cm. Πόσο χαρτόνι σε cm² θα χρειαστούμε για τις 5 έδρες του;'
        : 'We want to make an open cubical box (without a top lid) with edge 5 cm. How much cardboard in cm² will we need for its 5 faces?',
      options: ensureFourUniqueOptions(correct, () => ['150 cm²', '100 cm²', '75 cm²', '120 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEl ? '1 έδρα' : '1 face', value: '5 · 5 ＝ 25 cm²' },
        { label: isEl ? 'Πλήθος εδρών χωρίς καπάκι' : 'Faces without lid', value: isEl ? '5 έδρες' : '5 faces' },
        { label: isEl ? 'Πράξη' : 'Calculation', value: '5 · 25 ＝ 125 cm²' }
      ],
      explanation: isEl
        ? 'Αφού το κουτί δεν έχει καπάκι, αποτελείται από 5 μόνο έδρες: 5 · 25 ＝ 125 cm² (αντί για 6 · 25 ＝ 150 cm²).'
        : 'Since the box has no lid, it consists of only 5 faces: 5 · 25 ＝ 125 cm² (rather than 6 · 25 ＝ 150 cm²).'
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet(locale = 'el') {
  const isEl = locale === 'el';
  const edgeSym = isEl ? 'α' : 'a';
  const qs = [];

  // Q1: Στοιχεία κύβου (Boolean)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: isEl ? 'ΣΤΟΙΧΕΙΑ ΚΥΒΟΥ' : 'CUBE ELEMENTS',
    prompt: isEl
      ? (isQ1True
          ? 'Ο κύβος και το ορθογώνιο παραλληλεπίπεδο έχουν ακριβώς 6 έδρες, 12 ακμές και 8 κορυφές.'
          : 'Ο κύβος έχει 6 έδρες, 8 ακμές και 12 κορυφές.')
      : (isQ1True
          ? 'Both the cube and the rectangular prism have exactly 6 faces, 12 edges, and 8 vertices.'
          : 'A cube has 6 faces, 8 edges, and 12 vertices.'),
    correctAnswer: isQ1True,
    tableData: [
      { label: isEl ? 'Έδρες' : 'Faces', value: isEl ? '6 επίπεδες επιφάνειες' : '6 flat surfaces' },
      { label: isEl ? 'Ακμές' : 'Edges', value: isEl ? '12 ευθύγραμμα τμήματα' : '12 straight line segments' },
      { label: isEl ? 'Κορυφές' : 'Vertices', value: isEl ? '8 γωνιακά σημεία' : '8 corner points' }
    ],
    explanation: isEl
      ? (isQ1True
          ? 'Τόσο ο κύβος όσο και το ορθογώνιο παραλληλεπίπεδο έχουν 6 έδρες, 12 ακμές και 8 κορυφές.'
          : 'Ο κύβος έχει 12 ακμές και 8 κορυφές (και όχι 8 ακμές και 12 κορυφές).')
      : (isQ1True
          ? 'Both the cube and the rectangular prism have 6 faces, 12 edges, and 8 vertices.'
          : 'A cube has 12 edges and 8 vertices (not 8 edges and 12 vertices).')
  });

  // Q2: Τι είναι ανάπτυγμα (MCQ)
  const q2Correct = isEl
    ? 'Το επίπεδο σχήμα που προκύπτει αν ανοίξουμε όλες τις έδρες του στερεού πάνω σε μία επιφάνεια'
    : 'The flat shape obtained by opening all faces of the solid onto a single surface';
  qs.push({
    id: 2,
    type: 'mcq',
    title: isEl ? 'ΕΝΝΟΙΑ ΑΝΑΠΤΥΓΜΑΤΟΣ' : 'CONCEPT OF GEOMETRIC NET',
    prompt: isEl
      ? 'Τι ονομάζεται ανάπτυγμα ενός γεωμετρικού στερεού;'
      : 'What is meant by the net of a geometric solid?',
    options: ensureFourUniqueOptions(q2Correct, () => [
      isEl ? 'Το βάρος του στερεού σε γραμμάρια' : 'The solid weight in grams',
      isEl ? 'Ο όγκος του νερού που χωράει μέσα στο κουτί' : 'The volume of water the box holds',
      isEl ? 'Το μήκος της μεγαλύτερης ακμής του' : 'The length of its longest edge'
    ]),
    correctAnswer: q2Correct,
    tableData: [
      { label: isEl ? 'Ορισμός' : 'Definition', value: isEl ? 'Επίπεδη διάταξη όλων των συνδεδεμένων εδρών του στερεού' : 'Flat arrangement of all connected faces of the solid' }
    ],
    explanation: isEl
      ? 'Ανάπτυγμα είναι το επίπεδο σχήμα από χαρτόνι που αν διπλωθεί στις ακμές του, σχηματίζει το στερεό.'
      : 'A net is the flat cardboard pattern that folds along its edges to form the 3D solid.'
  });

  // Q3: Ποιες έδρες είναι ίσες στο ορθογώνιο παραλληλεπίπεδο (MCQ)
  const q3Correct = isEl
    ? 'Οι απέναντι έδρες είναι ανά 2 ίσες (3 ζεύγη ίσων εδρών)'
    : 'Opposite faces are congruent in pairs (3 pairs of equal faces)';
  qs.push({
    id: 3,
    type: 'mcq',
    title: isEl ? 'ΕΔΡΕΣ ΟΡΘΟΓΩΝΙΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ' : 'RECTANGULAR PRISM FACES',
    prompt: isEl
      ? 'Ποιες έδρες είναι ίσες μεταξύ τους σε ένα ορθογώνιο παραλληλεπίπεδο;'
      : 'Which faces are congruent to each other in a rectangular prism?',
    options: ensureFourUniqueOptions(q3Correct, () => [
      isEl ? 'Και οι 6 έδρες είναι υποχρεωτικά ίσες μεταξύ τους' : 'All 6 faces are necessarily identical',
      isEl ? 'Όλες οι έδρες έχουν διαφορετικό μέγεθος' : 'All faces have different dimensions',
      isEl ? 'Μόνο η πάνω και η κάτω έδρα είναι ίσες' : 'Only the top and bottom faces are equal'
    ]),
    correctAnswer: q3Correct,
    tableData: [
      { label: isEl ? '3 ζεύγη εδρών' : '3 face pairs', value: isEl ? '2 βάσεις (α · β), 2 πλαϊνές (β · γ), 2 εμπρός/πίσω (α · γ)' : '2 bases (a · b), 2 sides (b · c), 2 front/back (a · c)' }
    ],
    explanation: isEl
      ? 'Στο ορθογώνιο παραλληλεπίπεδο οι απέναντι έδρες είναι παράλληλες και ίσες ανά δύο (3 ζεύγη).'
      : 'In a rectangular prism, opposite faces are parallel and congruent in pairs (3 pairs).'
  });

  // Q4: Οπτική αναγνώριση έγκυρου αναπτύγματος κύβου (SVG - No Giveaway)
  const q4Correct = isEl
    ? 'Ναι, είναι το κλασικό έγκυρο ανάπτυγμα κύβου σε σχήμα σταυρού'
    : 'Yes, it is the classic valid cross net of a cube';
  qs.push({
    id: 4,
    type: 'mcq',
    title: isEl ? 'ΑΝΑΓΝΩΡΙΣΗ ΕΓΚΥΡΟΥ ΑΝΑΠΤΥΓΜΑΤΟΣ' : 'VALID NET IDENTIFICATION',
    prompt: isEl
      ? 'Παρατηρήστε το παρακάτω σχήμα 6 τετραγώνων (σε μορφή σταυρού). Μπορεί να διπλωθεί σχηματίζοντας κύβο;'
      : 'Look at the arrangement of 6 squares below (cross pattern). Can it fold into a complete cube?',
    svg: (
      <svg viewBox="0 0 160 120" className="w-full max-w-[160px] h-auto mx-auto my-2 select-none drop-shadow-sm">
        <rect x="60" y="10" width="25" height="25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
        <rect x="35" y="35" width="25" height="25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
        <rect x="60" y="35" width="25" height="25" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="1.5" />
        <rect x="85" y="35" width="25" height="25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
        <rect x="60" y="60" width="25" height="25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
        <rect x="60" y="85" width="25" height="25" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => [
      isEl ? 'Όχι, γιατί έχει πάρα πολλά τετράγωνα' : 'No, because it has too many squares',
      isEl ? 'Όχι, γιατί θα επικαλυφθούν δύο έδρες' : 'No, because two faces will overlap',
      isEl ? 'Όχι, διπλώνει μόνο σε ορθογώνιο παραλληλεπίπεδο' : 'No, it only folds into a prism'
    ]),
    correctAnswer: q4Correct,
    tableData: [
      { label: isEl ? 'Σχήμα σταυρού' : 'Cross shape', value: isEl ? '4 τετράγωνα σε στήλη και 2 πλαϊνά πτερύγια εκατέρωθεν' : '4 squares in a column and 2 lateral flaps on either side' },
      { label: isEl ? 'Αποτέλεσμα' : 'Result', value: isEl ? 'Διπλώνει άψογα σε κύβο' : 'Folds perfectly into a cube' }
    ],
    explanation: isEl
      ? 'Το σχήμα του σταυρού (διάταξη 1-4-1) είναι το πιο κλασικό έγκυρο ανάπτυγμα κύβου.'
      : 'The cross pattern (1-4-1 arrangement) is the most standard valid net of a cube.'
  });

  // Q5: Υπολογισμός εμβαδού αναπτύγματος κύβου με ακμή 6 cm (Input)
  qs.push({
    id: 5,
    type: 'input',
    title: isEl ? `ΕΜΒΑΔΟΝ ΑΝΑΠΤΥΓΜΑΤΟΣ ΚΥΒΟΥ (${toCleanUppercase(edgeSym)} ＝ 6 CM)` : `CUBE NET AREA (${edgeSym.toUpperCase()} ＝ 6 CM)`,
    prompt: isEl
      ? `Πόσα cm² είναι το εμβαδόν του αναπτύγματος ενός κύβου με ακμή 6 cm; (Γράψτε μόνο τον αριθμό)`
      : `What is the area in cm² of the net of a cube with edge 6 cm? (Enter number only)`,
    correctAnswer: '216',
    tableData: [
      { label: isEl ? `Ακμή (${edgeSym})` : `Edge (${edgeSym})`, value: '6 cm' },
      {
        label: isEl ? '1 έδρα' : '1 face',
        valueNode: (
          <span>
            {edgeSym}<sup>2</sup> ＝ 6 · 6 ＝ 36 cm²
          </span>
        )
      },
      {
        label: isEl ? '6 έδρες' : '6 faces',
        valueNode: (
          <span>
            6 · {edgeSym}<sup>2</sup> ＝ 6 · 36 ＝ 216 cm²
          </span>
        )
      }
    ],
    explanation: isEl
      ? `Εολ ＝ 6 · ${edgeSym}² ＝ 6 · (6 · 6) ＝ 6 · 36 ＝ 216 cm².`
      : `Atot ＝ 6 · ${edgeSym}² ＝ 6 · (6 · 6) ＝ 6 · 36 ＝ 216 cm².`
  });

  // Q6: Πλήθος ακμών ορθογωνίου παραλληλεπιπέδου (Input)
  qs.push({
    id: 6,
    type: 'input',
    title: isEl ? 'ΠΛΗΘΟΣ ΑΚΜΩΝ ΣΤΕΡΕΟΥ' : 'SOLID EDGE COUNT',
    prompt: isEl
      ? 'Πόσες ακμές έχει συνολικά ένα ορθογώνιο παραλληλεπίπεδο; (Γράψτε μόνο τον αριθμό)'
      : 'How many edges does a rectangular prism have in total? (Enter number only)',
    correctAnswer: '12',
    tableData: [
      { label: isEl ? 'Στερεό' : 'Solid', value: isEl ? 'Ορθογώνιο παραλληλεπίπεδο' : 'Rectangular prism' },
      { label: isEl ? 'Πλήθος ακμών' : 'Edge count', value: isEl ? '12 ακμές (4 μήκη, 4 πλάτη, 4 ύψη)' : '12 edges (4 lengths, 4 widths, 4 heights)' }
    ],
    explanation: isEl
      ? 'Το ορθογώνιο παραλληλεπίπεδο έχει 12 ακμές.'
      : 'A rectangular prism has 12 edges.'
  });

  // Q7: Άκυρο ανάπτυγμα κύβου (MCQ)
  const q7Correct = isEl
    ? 'Μια διάταξη όπου 4 τετράγωνα σχηματίζουν ένα μεγάλο μπλοκ 2 × 2'
    : 'An arrangement where 4 squares form a 2 × 2 block';
  qs.push({
    id: 7,
    type: 'mcq',
    title: isEl ? 'ΚΑΝΟΝΑΣ ΑΠΟΡΡΙΨΗΣ ΑΝΑΠΤΥΓΜΑΤΟΣ' : 'NET REJECTION RULE',
    prompt: isEl
      ? 'Ποια από τις παρακάτω διατάξεις 6 τετραγώνων ΔΕΝ μπορεί ποτέ να διπλωθεί σε κύβο;'
      : 'Which arrangement of 6 squares can NEVER fold into a cube?',
    options: ensureFourUniqueOptions(q7Correct, () => [
      isEl ? 'Μια διάταξη σε σχήμα σταυρού' : 'A cross pattern',
      isEl ? 'Μια διάταξη σε σχήμα Τ' : 'A T-shaped pattern',
      isEl ? 'Μια διάταξη με 4 τετράγωνα σε σειρά και 2 εκατέρωθεν' : 'A row of 4 squares with 2 flaps on opposite sides'
    ]),
    correctAnswer: q7Correct,
    tableData: [
      { label: isEl ? 'Μπλοκ 2 × 2' : '2 × 2 block', value: isEl ? 'Σχηματίζει γωνία 4 τετραγώνων όπου οι έδρες επικαλύπτονται' : 'Forms a 4-square corner where faces overlap' },
      { label: isEl ? 'Κανόνας' : 'Rule', value: isEl ? 'Κανένα έγκυρο ανάπτυγμα κύβου δεν περιέχει μπλοκ 2 × 2' : 'No valid cube net contains a 2 × 2 block' }
    ],
    explanation: isEl
      ? 'Αν υπάρχουν 4 τετράγωνα σε μπλοκ 2 × 2, κάποιες έδρες θα επικαλυφθούν και το κουτί θα μείνει ανοιχτό από την άλλη πλευρά.'
      : 'If 4 squares form a 2 × 2 block, faces will overlap upon folding, leaving the solid open on another side.'
  });

  // Q8: Τύπος ολικής επιφάνειας ορθογωνίου παραλληλεπιπέδου (MCQ)
  const q8Correct = isEl
    ? 'Εολ ＝ 2 · (α · β ＋ β · γ ＋ α · γ)'
    : 'Atot ＝ 2 · (a · b ＋ b · c ＋ a · c)';
  qs.push({
    id: 8,
    type: 'mcq',
    title: isEl ? 'ΤΥΠΟΣ ΕΠΙΦΑΝΕΙΑΣ ΟΡΘΟΓΩΝΙΟΥ' : 'PRISM SURFACE FORMULA',
    prompt: isEl
      ? 'Πώς υπολογίζουμε το εμβαδόν του αναπτύγματος ενός ορθογωνίου παραλληλεπιπέδου με διαστάσεις α, β και γ;'
      : 'How do we calculate the net area of a rectangular prism with dimensions a, b, and c?',
    options: ensureFourUniqueOptions(q8Correct, () => [
      isEl ? 'Εολ ＝ α · β · γ' : 'Atot ＝ a · b · c',
      isEl ? 'Εολ ＝ 6 · (α ＋ β ＋ γ)' : 'Atot ＝ 6 · (a ＋ b ＋ c)',
      isEl ? 'Εολ ＝ 4 · α · β' : 'Atot ＝ 4 · a · b'
    ]),
    correctAnswer: q8Correct,
    tableData: [
      { label: isEl ? '3 ζεύγη εδρών' : '3 face pairs', value: isEl ? '2 · (α · β) ＋ 2 · (β · γ) ＋ 2 · (α · γ)' : '2 · (a · b) ＋ 2 · (b · c) ＋ 2 · (a · c)' },
      { label: isEl ? 'Τελικός τύπος' : 'Final formula', value: q8Correct }
    ],
    explanation: isEl
      ? 'Προσθέτουμε τα εμβαδά των 3 διαφορετικών εδρών και διπλασιάζουμε το αποτέλεσμα, αφού υπάρχουν 2 έδρες από κάθε είδος.'
      : 'Add the areas of the 3 distinct rectangular faces and double the sum, since each face occurs in a pair.'
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

export default function AnaptigmaAskiseisPage() {
  const router = useRouter();
  const { locale = 'el' } = router;
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
      ? "Ασκήσεις: Αναπτύγματα Στερεών & Επιφάνειες - ΣΤ' Δημοτικού | LearnMaths.gr"
      : "Exercises: Solid Nets & Surfaces - 6th Grade | LearnMaths.gr",
    metaDesc: isEl
      ? "Διαδραστικές ασκήσεις στα αναπτύγματα κύβου και ορθογωνίου παραλληλεπιπέδου, έδρες, ακμές, κορυφές και ολική επιφάνεια για τη ΣΤ' Δημοτικού."
      : "Interactive exercises on cube and rectangular prism nets, faces, edges, vertices, and total surface area for 6th Grade.",
    backText: isEl ? "Θεωρία Κεφ. 77" : "Theory Ch. 77",
    actionTheory: isEl ? "📖 Θεωρία" : "📖 Theory",
    chapterBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 77 • ΣΤ' ΔΗΜΟΤΙΚΟΥ" : "EXERCISES • CHAPTER 77 • 6TH GRADE",
    heroTitle: isEl ? "Ασκήσεις: Αναπτύγματα Κύβου και Ορθογωνίου" : "Exercises: Cube & Prism Nets",
    heroDesc: isEl
      ? "Εξασκηθείτε στα στοιχεία των στερεών (έδρες, ακμές, κορυφές), στα έγκυρα αναπτύγματα και στον υπολογισμό της ολικής επιφάνειας μέσα από 12 δυναμικές ερωτήσεις."
      : "Practice solid elements (faces, edges, vertices), valid net patterns, and total surface area calculations across 12 dynamic questions.",
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
    feedbackCorrect: isEl ? "✓ Σωστή απάντηση!" : "✓ Correct answer!",
    feedbackWrongPrefix: isEl ? "✗ Λάθος. Η σωστή απάντηση είναι: " : "✗ Incorrect. The correct answer is: "
  };

  return (
    <Layout
      title={ui.metaTitle}
      description={ui.metaDesc}
      backUrl="/st-dimotikou/77-anaptigma"
      backText={ui.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/77-anaptigma"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0"
        >
          <span>{ui.actionTheory}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden">

        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden mb-8 sm:mb-12">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{ui.chapterBadge}</span>
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
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="break-words">{ui.heroFeature}</span>
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
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm sm:text-base border border-indigo-150 shrink-0">
                      {index + 1}
                    </span>
                    <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-wider truncate">
                      {toCleanUppercase(q.title || `${isEl ? 'ΕΡΩΤΗΣΗ' : 'QUESTION'} ${index + 1}`)}
                    </h2>
                  </div>

                  {submitted && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black tracking-wider shrink-0 ${
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
                  {q.svg && <div className="py-2 flex justify-center max-w-full overflow-hidden">{q.svg}</div>}
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
                            {val ? toCleanUppercase(ui.lblTrue) : toCleanUppercase(ui.lblFalse)}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 2: MCQ (4 ΜΟΝΑΔΙΚΑ ΚΟΥΜΠΙΑ ΧΩΡΙΣ TRUNCATE) */}
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
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                isSelected
                                  ? 'bg-white text-indigo-700'
                                  : 'bg-white text-slate-500 border border-slate-200'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="break-words whitespace-normal leading-snug flex-1 [overflow-wrap:anywhere]">
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
                        placeholder={ui.inputPlaceholder}
                        value={userAns || ''}
                        onChange={(e) => {
                          const cleaned = e.target.value
                            .replace(/[^0-9.,]/g, '')
                            .replace(/\./g, isEl ? ',' : '.');
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
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-1 w-full block">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <tbody>
                            {q.tableData.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={rIdx !== q.tableData.length - 1 ? 'border-b border-slate-200/60' : ''}
                              >
                                <td className="py-2.5 px-3 font-bold text-slate-600 bg-slate-100/70 w-1/3 break-words">
                                  {row.label}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-800 break-words">
                                  {row.valueNode || row.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* ΑΝΑΛΥΤΙΚΗ ΕΠΕΞΗΓΗΣΗ */}
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed break-words [overflow-wrap:anywhere] ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                          : 'bg-rose-50 text-rose-950 border border-rose-200'
                      }`}
                    >
                      <p className="font-bold mb-1">
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
                      <p className="text-slate-700">{q.explanation}</p>
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
            <div className="flex items-center gap-4 sm:gap-8">
              {!submitted ? (
                <div className="text-xs sm:text-sm font-semibold text-slate-300">
                  <span>{toCleanUppercase(ui.answered)} </span>
                  <span className="font-black text-indigo-400 text-sm sm:text-base">
                    {answeredCount} / {totalCount}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span>{toCleanUppercase(ui.score)} </span>
                    <span className="font-black text-emerald-400 text-sm sm:text-base">
                      {score} / {totalCount}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span>{toCleanUppercase(ui.percentage)} </span>
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
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-xs sm:text-sm shrink-0"
                >
                  {toCleanUppercase(ui.btnSubmit)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-xs sm:text-sm flex items-center gap-2 shrink-0"
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
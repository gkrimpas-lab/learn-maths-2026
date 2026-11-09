// pages/st-dimotikou/78-akmes-korifes-ask.js
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
  const baseNum = match ? parseFloat(match[1].replace(',', '.')) : NaN;
  const unit = match && match[2] ? match[2] : '';

  let offset = 1;
  while (uniqueOptions.length < 4) {
    let fallbackOpt;
    if (!isNaN(baseNum)) {
      const generatedNum = offset % 2 === 1 ? baseNum + Math.ceil(offset / 2) * 2 : Math.max(1, baseNum - Math.ceil(offset / 2) * 2);
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

// POOL ΓΙΑ Q9: Συνολικό Μήκος Ακμών Κύβου (12 · α)
const PROBLEM_POOL_Q9 = [
  // 1. Συρμάτινος σκελετός κύβου
  (locale) => {
    const isEl = locale === 'el';
    const a = randInt(4, 15);
    const total = 12 * a;
    const correct = `${total} cm`;
    const edgeSym = isEl ? 'α' : 'a';
    return {
      title: isEl ? 'ΣΥΡΜΑΤΙΝΟΣ ΣΚΕΛΕΤΟΣ ΚΥΒΟΥ' : 'WIRE CUBE SKELETON',
      prompt: isEl
        ? `Ένας μαθητής θέλει να φτιάξει τον σκελετό ενός κύβου από σύρμα με μήκος ακμής ${a} cm. Πόσο σύρμα σε cm θα χρειαστεί για να κατασκευαστούν και οι 12 ακμές του κύβου;`
        : `A student wants to make the wire frame of a cube with edge length ${a} cm. How much wire in cm is needed to form all 12 edges of the cube?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${6 * a} cm`,
        `${8 * a} cm`,
        `${total + 12} cm`,
        `${total > 12 ? total - 12 : total + 24} cm`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Μήκος 1 ακμής (${edgeSym})` : `Edge length (${edgeSym})`, value: `${a} cm` },
        { label: isEl ? 'Πλήθος ακμών κύβου' : 'Cube edge count', value: isEl ? '12 ίσες ακμές' : '12 equal edges' },
        { label: isEl ? 'Συνολικό μήκος σύρματος' : 'Total wire length', value: `12 · ${a} ＝ ${total} cm` }
      ],
      explanation: isEl
        ? `Ο κύβος έχει 12 απολύτως ίσες ακμές. Επομένως, το συνολικό μήκος του σύρματος είναι: 12 · ${a} ＝ ${total} cm.`
        : `A cube has 12 completely equal edges. Therefore, the total wire length is: 12 · ${a} ＝ ${total} cm.`
    };
  },
  // 2. Ξύλινο πλαίσιο κύβου
  (locale) => {
    const isEl = locale === 'el';
    const a = randInt(16, 25);
    const total = 12 * a;
    const correct = `${formatNum(total, locale)} cm`;
    return {
      title: isEl ? 'ΞΥΛΙΝΟ ΠΛΑΙΣΙΟ ΚΥΒΟΥ' : 'WOODEN CUBE FRAME',
      prompt: isEl
        ? `Για να κατασκευαστεί ένα ξύλινο διακοσμητικό πλαίσιο κύβου με ακμή ${a} cm, κόβονται 12 ίσα πηχάκια. Ποιο είναι το συνολικό μήκος που έχουν όλα τα πηχάκια μαζί;`
        : `To build a wooden decorative cube frame with edge ${a} cm, 12 equal wooden rods are cut. What is the total length of all rods combined?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(6 * a, locale)} cm`,
        `${formatNum(total + 24, locale)} cm`,
        `${formatNum(total > 24 ? total - 24 : total + 48, locale)} cm`,
        `${formatNum(Math.round(total / 2), locale)} cm`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Μήκος πηχακίου' : 'Rod length', value: `${a} cm` },
        { label: isEl ? 'Πλήθος ακμών' : 'Edge count', value: isEl ? '12 πηχάκια' : '12 rods' },
        { label: isEl ? 'Πράξη' : 'Calculation', value: `12 · ${a} ＝ ${formatNum(total, locale)} cm` }
      ],
      explanation: isEl
        ? `12 · ${a} ＝ ${formatNum(total, locale)} cm.`
        : `12 · ${a} ＝ ${formatNum(total, locale)} cm.`
    };
  },
  // 3. Σκελετός κύβου με καλαμάκια
  (locale) => {
    const isEl = locale === 'el';
    const correct = '120 cm';
    return {
      title: isEl ? 'ΣΚΕΛΕΤΟΣ ΜΕ ΚΑΛΑΜΑΚΙΑ' : 'STRAW CUBE SKELETON',
      prompt: isEl
        ? 'Στο μάθημα των εικαστικών, τα παιδιά κατασκευάζουν τον σκελετό ενός κύβου χρησιμοποιώντας 12 καλαμάκια των 10 cm το καθένα. Πόσα εκατοστόμετρα (cm) είναι το συνολικό μήκος όλων των ακμών του κύβου;'
        : 'In art class, students build a cube skeleton using 12 straws of 10 cm each. How many centimeters (cm) is the total length of all cube edges?',
      options: ensureFourUniqueOptions(correct, () => ['60 cm', '80 cm', '100 cm', '140 cm']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Μήκος 1 ακμής' : 'Length of 1 edge', value: '10 cm' },
        { label: isEl ? 'Πλήθος ακμών' : 'Edge count', value: isEl ? '12 ακμές' : '12 edges' },
        { label: isEl ? 'Πράξη' : 'Calculation', value: '12 · 10 ＝ 120 cm' }
      ],
      explanation: isEl
        ? '12 · 10 ＝ 120 cm.'
        : '12 · 10 ＝ 120 cm.'
    };
  },
  // 4. Μεταλλικό πλαίσιο σκηνής
  (locale) => {
    const isEl = locale === 'el';
    const correct = '24 m';
    return {
      title: isEl ? 'ΜΕΤΑΛΛΙΚΟ ΠΛΑΙΣΙΟ ΣΚΗΝΗΣ' : 'METAL TENT FRAME',
      prompt: isEl
        ? 'Το μεταλλικό πλαίσιο μιας σκηνής σε σχήμα κύβου έχει ακμή 2 m. Πόσα μέτρα (m) μεταλλικών σωλήνων χρειάστηκαν για να φτιαχτούν όλες οι ακμές του κύβου;'
        : 'The metal frame of a cube-shaped tent has an edge of 2 m. How many meters (m) of metal pipe were needed to build all edges of the cube?',
      options: ensureFourUniqueOptions(correct, () => ['12 m', '16 m', '20 m', '36 m']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Ακμή' : 'Edge', value: '2 m' },
        { label: isEl ? '12 ακμές' : '12 edges', value: '12 · 2 ＝ 24 m' }
      ],
      explanation: isEl
        ? '12 · 2 ＝ 24 m.'
        : '12 · 2 ＝ 24 m.'
    };
  }
];

// POOL ΓΙΑ Q10: Συνολικό Μήκος Ακμών Ορθογωνίου Παραλληλεπιπέδου [4 · (α ＋ β ＋ γ)]
const PROBLEM_POOL_Q10 = [
  // 1. Σκελετός κλουβιού
  (locale) => {
    const isEl = locale === 'el';
    const l = randInt(12, 24);
    const w = randInt(8, 14);
    const h = randInt(6, 12);
    const sum = l + w + h;
    const total = 4 * sum;
    const correct = `${total} cm`;
    return {
      title: isEl ? 'ΣΚΕΛΕΤΟΣ ΟΡΘΟΓΩΝΙΟΥ ΚΟΥΤΙΟΥ' : 'RECTANGULAR BOX FRAME',
      prompt: isEl
        ? `Ένα κουτί σε σχήμα ορθογωνίου παραλληλεπιπέδου έχει μήκος ${l} cm, πλάτος ${w} cm και ύψος ${h} cm. Πόσο σύρμα σε cm απαιτείται για να κατασκευαστούν και οι 12 ακμές του σκελετού του;`
        : `A box in the shape of a rectangular prism has length ${l} cm, width ${w} cm, and height ${h} cm. How much wire in cm is required to make all 12 edges of its frame?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${sum} cm`,
        `${2 * sum} cm`,
        `${total + 16} cm`,
        `${total > 16 ? total - 16 : total + 32} cm`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? '4 μήκη (α)' : '4 lengths (a)', value: `4 · ${l} ＝ ${4 * l} cm` },
        { label: isEl ? '4 πλάτη (β)' : '4 widths (b)', value: `4 · ${w} ＝ ${4 * w} cm` },
        { label: isEl ? '4 ύψη (γ)' : '4 heights (c)', value: `4 · ${h} ＝ ${4 * h} cm` },
        { label: isEl ? 'Συνολικό μήκος (12 ακμές)' : 'Total length (12 edges)', value: `4 · (${l} ＋ ${w} ＋ ${h}) ＝ 4 · ${sum} ＝ ${total} cm` }
      ],
      explanation: isEl
        ? `Το ορθογώνιο παραλληλεπίπεδο έχει 4 ακμές μήκους, 4 ακμές πλάτους και 4 ακμές ύψους: 4 · (${l} ＋ ${w} ＋ ${h}) ＝ 4 · ${sum} ＝ ${total} cm.`
        : `A rectangular prism has 4 length edges, 4 width edges, and 4 height edges: 4 · (${l} ＋ ${w} ＋ ${h}) ＝ 4 · ${sum} ＝ ${total} cm.`
    };
  },
  // 2. Ξύλινο κλουβί
  (locale) => {
    const isEl = locale === 'el';
    const correct = '400 cm (4 m)';
    return {
      title: isEl ? 'ΞΥΛΙΝΟΣ ΣΚΕΛΕΤΟΣ ΚΛΟΥΒΙΟΥ' : 'WOODEN CAGE SKELETON',
      prompt: isEl
        ? 'Ένας ξυλουργός φτιάχνει τον σκελετό ενός κλουβιού με διαστάσεις 50 cm, 30 cm και 20 cm. Πόσα εκατοστόμετρα (cm) πηχακίου χρειάζονται συνολικά για τις 12 ακμές;'
        : 'A carpenter makes a cage frame with dimensions 50 cm, 30 cm, and 20 cm. How many centimeters (cm) of wooden strips are needed in total for all 12 edges?',
      options: ensureFourUniqueOptions(correct, () => [
        '100 cm (1 m)',
        '200 cm (2 m)',
        '300 cm (3 m)',
        '500 cm (5 m)'
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Διαστάσεις' : 'Dimensions', value: '50 cm, 30 cm, 20 cm' },
        { label: isEl ? 'Άθροισμα 3 ακμών' : 'Sum of 3 edges', value: '50 ＋ 30 ＋ 20 ＝ 100 cm' },
        { label: isEl ? 'Συνολικό μήκος (12 ακμές)' : 'Total length (12 edges)', value: '4 · 100 ＝ 400 cm (4 m)' }
      ],
      explanation: isEl
        ? '4 · (50 ＋ 30 ＋ 20) ＝ 4 · 100 ＝ 400 cm (δηλαδή 4 μέτρα).'
        : '4 · (50 ＋ 30 ＋ 20) ＝ 4 · 100 ＝ 400 cm (i.e., 4 meters).'
    };
  },
  // 3. Σκελετός ενυδρείου
  (locale) => {
    const isEl = locale === 'el';
    const correct = '520 cm';
    return {
      title: isEl ? 'ΜΕΤΑΛΛΙΚΟ ΠΛΑΙΣΙΟ ΕΝΥΔΡΕΙΟΥ' : 'AQUARIUM METAL FRAME',
      prompt: isEl
        ? 'Το μεταλλικό πλαίσιο ενός ενυδρείου έχει μήκος 60 cm, πλάτος 40 cm και ύψος 30 cm. Πόσα cm γωνιακού σιδήρου χρειάστηκαν για να φτιαχτούν όλες οι ακμές του;'
        : 'The metal frame of an aquarium has length 60 cm, width 40 cm, and height 30 cm. How many cm of angle iron were needed to build all its edges?',
      options: ensureFourUniqueOptions(correct, () => ['260 cm', '130 cm', '480 cm', '600 cm']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Διαστάσεις' : 'Dimensions', value: '60 cm, 40 cm, 30 cm' },
        { label: isEl ? 'Πράξη' : 'Calculation', value: '4 · (60 ＋ 40 ＋ 30) ＝ 4 · 130 ＝ 520 cm' }
      ],
      explanation: isEl
        ? '4 · (60 ＋ 40 ＋ 30) ＝ 4 · 130 ＝ 520 cm.'
        : '4 · (60 ＋ 40 ＋ 30) ＝ 4 · 130 ＝ 520 cm.'
    };
  }
];

// POOL ΓΙΑ Q11: Αντίστροφο Πρόβλημα (Εύρεση Ακμής από το Συνολικό Μήκος)
const PROBLEM_POOL_Q11 = [
  // 1. Εύρεση ακμής κύβου από σύρμα
  (locale) => {
    const isEl = locale === 'el';
    const a = randInt(5, 14);
    const total = 12 * a;
    const correct = `${a} cm`;
    return {
      title: isEl ? 'ΕΥΡΕΣΗ ΑΚΜΗΣ ΚΥΒΟΥ' : 'FINDING CUBE EDGE',
      prompt: isEl
        ? `Χρησιμοποιήσαμε ένα σύρμα συνολικού μήκους ${total} cm για να κατασκευάσουμε τον σκελετό ενός κύβου, χωρίς να περισσέψει τίποτα. Πόσο είναι το μήκος της ακμής του κύβου;`
        : `We used a wire with a total length of ${total} cm to build a cube frame with nothing left over. What is the edge length of the cube?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${a + 2} cm`,
        `${a > 2 ? a - 2 : a + 4} cm`,
        `${Math.round(total / 6)} cm`,
        `${Math.round(total / 8)} cm`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Συνολικό μήκος σύρματος' : 'Total wire length', value: `${total} cm` },
        { label: isEl ? 'Πλήθος ακμών κύβου' : 'Cube edge count', value: isEl ? '12 ίσες ακμές' : '12 equal edges' },
        { label: isEl ? 'Μήκος 1 ακμής' : 'Length of 1 edge', value: `${total} : 12 ＝ ${a} cm` }
      ],
      explanation: isEl
        ? `Ο κύβος έχει 12 ίσες ακμές, άρα διαιρούμε το συνολικό μήκος με το 12: ${total} : 12 ＝ ${a} cm.`
        : `A cube has 12 equal edges, so divide total length by 12: ${total} : 12 ＝ ${a} cm.`
    };
  },
  // 2. Εύρεση ύψους σε ορθογώνιο παραλληλεπίπεδο
  (locale) => {
    const isEl = locale === 'el';
    const correct = '5 cm';
    return {
      title: isEl ? 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΣΚΕΛΕΤΟΥ' : 'FINDING PRISM HEIGHT',
      prompt: isEl
        ? 'Ο σκελετός ενός ορθογωνίου παραλληλεπιπέδου κατασκευάστηκε με 100 cm σύρμα. Αν το μήκος είναι 12 cm και το πλάτος είναι 8 cm, πόσο είναι το ύψος του;'
        : 'The frame of a rectangular prism was built using 100 cm of wire. If the length is 12 cm and the width is 8 cm, what is its height?',
      options: ensureFourUniqueOptions(correct, () => ['10 cm', '6 cm', '4 cm', '8 cm']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Συνολικό σύρμα' : 'Total wire', value: '100 cm' },
        { label: isEl ? 'Άθροισμα 3 ακμών (μήκος ＋ πλάτος ＋ ύψος)' : 'Sum of 3 edges (length ＋ width ＋ height)', value: '100 : 4 ＝ 25 cm' },
        { label: isEl ? 'Άθροισμα μήκους και πλάτους' : 'Sum of length and width', value: '12 ＋ 8 ＝ 20 cm' },
        { label: isEl ? 'Ύψος' : 'Height', value: '25 － 20 ＝ 5 cm' }
      ],
      explanation: isEl
        ? 'Διαιρούμε με το 4 για να βρούμε το άθροισμα των τριών διαστάσεων: 100 : 4 ＝ 25 cm. Αφαιρούμε το μήκος και το πλάτος: 25 － 12 － 8 ＝ 5 cm.'
        : 'Divide by 4 to find the sum of the three dimensions: 100 : 4 ＝ 25 cm. Subtract length and width: 25 － 12 － 8 ＝ 5 cm.'
    };
  },
  // 3. Εύρεση ακμής κύβου από σύρμα 72 cm
  (locale) => {
    const isEl = locale === 'el';
    const correct = '6 cm';
    return {
      title: isEl ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΑΚΜΗΣ ΚΥΒΟΥ' : 'CALCULATING CUBE EDGE',
      prompt: isEl
        ? 'Ένας σκελετός κύβου χρειάστηκε ακριβώς 72 cm σύρματος για τις 12 ακμές του. Πόσα εκατοστόμετρα (cm) είναι η ακμή του κύβου;'
        : 'A cube frame required exactly 72 cm of wire for its 12 edges. How many centimeters (cm) is the edge of the cube?',
      options: ensureFourUniqueOptions(correct, () => ['12 cm', '8 cm', '9 cm', '7 cm']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Σύνολο σύρματος' : 'Total wire', value: '72 cm' },
        { label: isEl ? 'Πράξη (: 12)' : 'Calculation (: 12)', value: '72 : 12 ＝ 6 cm' }
      ],
      explanation: isEl
        ? '72 : 12 ＝ 6 cm.'
        : '72 : 12 ＝ 6 cm.'
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα, Τύπος Euler & Κόστος Κατασκευής
const PROBLEM_POOL_Q12 = [
  // 1. Κόστος σύρματος για σκελετό κύβου
  (locale) => {
    const isEl = locale === 'el';
    const correct = '6 €';
    return {
      title: isEl ? 'ΚΟΣΤΟΣ ΚΑΤΑΣΚΕΥΗΣ ΣΚΕΛΕΤΟΥ' : 'FRAME CONSTRUCTION COST',
      prompt: isEl
        ? 'Ένας τεχνίτης φτιάχνει τον σκελετό ενός κύβου με ακμή 10 cm. Το σύρμα κοστίζει 5 € το μέτρο (m). Πόσο θα κοστίσει το σύρμα για ολόκληρο τον κύβο;'
        : 'A craftsman builds the frame of a cube with edge 10 cm. The wire costs 5 € per meter (m). How much will the wire cost for the entire cube?',
      options: ensureFourUniqueOptions(correct, () => ['12 €', '5 €', '60 €', '4 €']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Συνολικό μήκος ακμών' : 'Total edge length', value: '12 · 10 cm ＝ 120 cm' },
        { label: isEl ? 'Μετατροπή σε μέτρα (: 100)' : 'Conversion to meters (: 100)', value: '120 : 100 ＝ 1,2 m' },
        { label: isEl ? 'Κόστος σύρματος' : 'Wire cost', value: '1,2 · 5 € ＝ 6 €' }
      ],
      explanation: isEl
        ? 'Ο κύβος χρειάζεται 12 · 10 ＝ 120 cm σύρματος, δηλαδή 1,2 m. Κόστος: 1,2 · 5 € ＝ 6 €.'
        : 'The cube needs 12 · 10 ＝ 120 cm of wire, which is 1.2 m. Cost: 1.2 · 5 € ＝ 6 €.'
    };
  },
  // 2. Επαλήθευση τύπου Euler σε κύβο
  (locale) => {
    const isEl = locale === 'el';
    const correct = '14';
    return {
      title: isEl ? 'ΤΥΠΟΣ EULER ΣΤΟΝ ΚΥΒΟ' : 'EULER FORMULA ON CUBE',
      prompt: isEl
        ? 'Σύμφωνα με τον τύπο του Euler, σε κάθε πολύεδρο ισχύει: Έδρες ＋ Κορυφές ＝ Ακμές ＋ 2. Πόσο ισούται το άθροισμα Έδρες ＋ Κορυφές στον κύβο;'
        : "According to Euler's formula, in every polyhedron: Faces ＋ Vertices ＝ Edges ＋ 2. What does the sum Faces ＋ Vertices equal for a cube?",
      options: ensureFourUniqueOptions(correct, () => ['12', '16', '18', '20']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Έδρες κύβου' : 'Cube faces', value: '6' },
        { label: isEl ? 'Κορυφές κύβου' : 'Cube vertices', value: '8' },
        { label: isEl ? 'Άθροισμα' : 'Sum', value: isEl ? '6 ＋ 8 ＝ 14 (και Ακμές ＋ 2 ＝ 12 ＋ 2 ＝ 14)' : '6 ＋ 8 ＝ 14 (and Edges ＋ 2 ＝ 12 ＋ 2 ＝ 14)' }
      ],
      explanation: isEl
        ? 'Ο κύβος έχει 6 έδρες και 8 κορυφές: 6 ＋ 8 ＝ 14. Επαλήθευση: 12 ακμές ＋ 2 ＝ 14.'
        : "A cube has 6 faces and 8 vertices: 6 ＋ 8 ＝ 14. Check: 12 edges ＋ 2 ＝ 14."
    };
  },
  // 3. Σύγκριση σκελετού κύβου και παραλληλεπιπέδου
  (locale) => {
    const isEl = locale === 'el';
    const correct = isEl
      ? 'Ο κύβος χρειάζεται περισσότερο σύρμα (120 cm έναντι 100 cm)'
      : 'The cube requires more wire (120 cm vs 100 cm)';
    return {
      title: isEl ? 'ΣΥΓΚΡΙΣΗ ΔΥΟ ΣΚΕΛΕΤΩΝ' : 'COMPARING TWO FRAMES',
      prompt: isEl
        ? 'Έχουμε έναν κύβο με ακμή 10 cm και ένα ορθογώνιο παραλληλεπίπεδο με διαστάσεις 12 cm, 8 cm και 5 cm. Ποιο από τα δύο στερεά χρειάζεται περισσότερο σύρμα για τον σκελετό του;'
        : 'We have a cube with edge 10 cm and a rectangular prism with dimensions 12 cm, 8 cm, and 5 cm. Which solid requires more wire for its frame?',
      options: ensureFourUniqueOptions(correct, () => [
        isEl ? 'Το ορθογώνιο παραλληλεπίπεδο χρειάζεται περισσότερο σύρμα' : 'The rectangular prism requires more wire',
        isEl ? 'Χρειάζονται ακριβώς το ίδιο σύρμα' : 'They require the exact same amount of wire',
        isEl ? 'Δεν μπορούμε να γνωρίζουμε χωρίς να ξέρουμε το βάρος' : 'Cannot determine without knowing their weight'
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Σύρμα κύβου' : 'Cube wire', value: '12 · 10 ＝ 120 cm' },
        { label: isEl ? 'Σύρμα παραλληλεπιπέδου' : 'Prism wire', value: '4 · (12 ＋ 8 ＋ 5) ＝ 4 · 25 ＝ 100 cm' },
        { label: isEl ? 'Σύγκριση' : 'Comparison', value: '120 cm ＞ 100 cm' }
      ],
      explanation: isEl
        ? 'Ο κύβος απαιτεί 12 · 10 ＝ 120 cm, ενώ το παραλληλεπίπεδο 4 · 25 ＝ 100 cm. Άρα ο κύβος χρειάζεται περισσότερο σύρμα.'
        : 'The cube requires 12 · 10 ＝ 120 cm, while the prism requires 4 · 25 ＝ 100 cm. Hence, the cube needs more wire.'
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
    title: isEl ? 'ΣΤΟΙΧΕΙΑ ΚΥΒΟΥ ΚΑΙ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ' : 'CUBE AND PRISM ELEMENTS',
    prompt: isEl
      ? (isQ1True
          ? 'Τόσο ο κύβος όσο και το ορθογώνιο παραλληλεπίπεδο έχουν ακριβώς 12 ακμές και 8 κορυφές.'
          : 'Ο κύβος έχει 8 ακμές και 12 κορυφές.')
      : (isQ1True
          ? 'Both the cube and the rectangular prism have exactly 12 edges and 8 vertices.'
          : 'A cube has 8 edges and 12 vertices.'),
    correctAnswer: isQ1True,
    tableData: [
      { label: isEl ? 'Ακμές' : 'Edges', value: isEl ? '12 ευθύγραμμα τμήματα' : '12 line segments' },
      { label: isEl ? 'Κορυφές' : 'Vertices', value: isEl ? '8 γωνιακά σημεία' : '8 corner points' },
      { label: isEl ? 'Έδρες' : 'Faces', value: isEl ? '6 επιφάνειες' : '6 surfaces' }
    ],
    explanation: isEl
      ? (isQ1True
          ? 'Τόσο ο κύβος όσο και το ορθογώνιο παραλληλεπίπεδο έχουν ακριβώς 12 ακμές και 8 κορυφές.'
          : 'Ο κύβος έχει 12 ακμές και 8 κορυφές (και όχι 8 ακμές και 12 κορυφές).')
      : (isQ1True
          ? 'Both the cube and the rectangular prism have exactly 12 edges and 8 vertices.'
          : 'A cube has 12 edges and 8 vertices (not 8 edges and 12 vertices).')
  });

  // Q2: Τι είναι ακμή (MCQ)
  const q2Correct = isEl
    ? 'Το ευθύγραμμο τμήμα όπου συναντώνται δύο γειτονικές έδρες'
    : 'The line segment where two adjacent faces meet';
  qs.push({
    id: 2,
    type: 'mcq',
    title: isEl ? 'ΕΝΝΟΙΑ ΤΗΣ ΑΚΜΗΣ' : 'CONCEPT OF AN EDGE',
    prompt: isEl
      ? 'Τι είναι η ακμή ενός γεωμετρικού στερεού;'
      : 'What is an edge of a geometric solid?',
    options: ensureFourUniqueOptions(q2Correct, () => [
      isEl ? 'Το γωνιακό σημείο όπου ενώνονται 3 πλευρές' : 'The corner point where 3 sides meet',
      isEl ? 'Ολόκληρη η επίπεδη επιφάνεια του στερεού' : 'The entire flat surface of the solid',
      isEl ? 'Η διαγώνιος που ενώνει δύο απέναντι γωνίες' : 'The diagonal connecting two opposite corners'
    ]),
    correctAnswer: q2Correct,
    tableData: [
      { label: isEl ? 'Ακμή' : 'Edge', value: isEl ? 'Ευθύγραμμο τμήμα τομής 2 εδρών' : 'Line segment intersection of 2 faces' }
    ],
    explanation: isEl
      ? 'Ακμή ονομάζεται το ευθύγραμμο τμήμα (γραμμή) όπου ενώνονται δύο έδρες του στερεού.'
      : 'An edge is the line segment where two faces of the solid meet.'
  });

  // Q3: Τι είναι κορυφή (MCQ)
  const q3Correct = isEl
    ? 'Το σημείο όπου συναντώνται τρεις ακμές του στερεού'
    : 'The point where three edges of the solid meet';
  qs.push({
    id: 3,
    type: 'mcq',
    title: isEl ? 'ΕΝΝΟΙΑ ΤΗΣ ΚΟΡΥΦΗΣ' : 'CONCEPT OF A VERTEX',
    prompt: isEl
      ? 'Τι είναι η κορυφή σε έναν κύβο ή παραλληλεπίπεδο;'
      : 'What is a vertex in a cube or rectangular prism?',
    options: ensureFourUniqueOptions(q3Correct, () => [
      isEl ? 'Το κέντρο της κάτω βάσης' : 'The center of the bottom base',
      isEl ? 'Η μεγαλύτερη πλευρά του κουτιού' : 'The longest side of the box',
      isEl ? 'Το εμβαδόν της επάνω έδρας' : 'The area of the top face'
    ]),
    correctAnswer: q3Correct,
    tableData: [
      { label: isEl ? 'Κορυφή' : 'Vertex', value: isEl ? 'Σημείο συνάντησης 3 ακμών (γωνία)' : 'Meeting point of 3 edges (corner)' },
      { label: isEl ? 'Σύνολο κορυφών' : 'Total vertices', value: isEl ? '8 κορυφές' : '8 vertices' }
    ],
    explanation: isEl
      ? 'Κορυφή είναι το σημείο (η «γωνία») όπου συναντώνται 3 ακμές του στερεού.'
      : 'A vertex is the point (the "corner") where 3 edges of the solid meet.'
  });

  // Q4: Οπτική αναγνώριση στοιχείων (SVG - No Giveaway)
  const q4Correct = isEl
    ? 'Μία κορυφή του στερεού (σημείο συνάντησης 3 ακμών)'
    : 'A vertex of the solid (meeting point of 3 edges)';
  qs.push({
    id: 4,
    type: 'mcq',
    title: isEl ? 'ΑΝΑΓΝΩΡΙΣΗ ΣΤΟΙΧΕΙΩΝ ΣΕ ΣΧΗΜΑ' : 'IDENTIFYING ELEMENTS IN DIAGRAM',
    prompt: isEl
      ? 'Παρατηρήστε το παρακάτω στερεό. Τι παριστάνει η κόκκινη κουκκίδα;'
      : 'Look at the solid below. What does the red dot represent?',
    svg: (
      <svg viewBox="0 0 160 120" className="w-full max-w-[160px] h-auto mx-auto my-2 select-none drop-shadow-sm">
        <polygon points="50,40 100,20 130,40 80,60" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
        <polygon points="50,40 80,60 80,100 50,80" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="1.5" />
        <polygon points="80,60 130,40 130,80 80,100" fill="#a5b4fc" stroke="#4f46e5" strokeWidth="1.5" />
        <circle cx="80" cy="60" r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
        <text x="92" y="65" fill="#f43f5e" fontSize="10" fontWeight="bold">;</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => [
      isEl ? 'Μία ακμή του στερεού' : 'An edge of the solid',
      isEl ? 'Μία έδρα του στερεού' : 'A face of the solid',
      isEl ? 'Το κέντρο βάρους του στερεού' : 'The center of mass of the solid'
    ]),
    correctAnswer: q4Correct,
    tableData: [
      { label: isEl ? 'Κόκκινο σημείο' : 'Red dot', value: isEl ? 'Κορυφή (συναντώνται 3 ακμές)' : 'Vertex (3 edges meet)' }
    ],
    explanation: isEl
      ? 'Η κόκκινη κουκκίδα βρίσκεται σε ένα γωνιακό σημείο όπου συναντώνται τρεις ακμές, άρα είναι κορυφή.'
      : 'The red dot is located at a corner point where three edges meet, so it is a vertex.'
  });

  // Q5: Υπολογισμός μήκους ακμών κύβου με ακμή 5 cm (Input)
  qs.push({
    id: 5,
    type: 'input',
    title: isEl ? `ΣΥΝΟΛΙΚΟ ΜΗΚΟΣ ΑΚΜΩΝ ΚΥΒΟΥ (${toCleanUppercase(edgeSym)} ＝ 5 CM)` : `TOTAL CUBE EDGE LENGTH (${edgeSym.toUpperCase()} ＝ 5 CM)`,
    prompt: isEl
      ? 'Πόσα cm σύρματος χρειάζονται για να κατασκευαστούν και οι 12 ακμές ενός κύβου με ακμή 5 cm; (Γράψτε μόνο τον αριθμό)'
      : 'How many cm of wire are needed to make all 12 edges of a cube with edge 5 cm? (Enter number only)',
    correctAnswer: '60',
    tableData: [
      { label: isEl ? `Μήκος 1 ακμής (${edgeSym})` : `Length of 1 edge (${edgeSym})`, value: '5 cm' },
      { label: isEl ? 'Πλήθος ακμών' : 'Edge count', value: isEl ? '12 ακμές' : '12 edges' },
      { label: isEl ? 'Πράξη' : 'Calculation', value: '12 · 5 ＝ 60 cm' }
    ],
    explanation: isEl ? '12 · 5 ＝ 60 cm.' : '12 · 5 ＝ 60 cm.'
  });

  // Q6: Πλήθος κορυφών κύβου (Input)
  qs.push({
    id: 6,
    type: 'input',
    title: isEl ? 'ΠΛΗΘΟΣ ΚΟΡΥΦΩΝ' : 'VERTEX COUNT',
    prompt: isEl
      ? 'Πόσες κορυφές έχει συνολικά ένας κύβος; (Γράψτε μόνο τον αριθμό)'
      : 'How many vertices does a cube have in total? (Enter number only)',
    correctAnswer: '8',
    tableData: [
      { label: isEl ? 'Πάνω βάση' : 'Top base', value: isEl ? '4 κορυφές' : '4 vertices' },
      { label: isEl ? 'Κάτω βάση' : 'Bottom base', value: isEl ? '4 κορυφές' : '4 vertices' },
      { label: isEl ? 'Σύνολο' : 'Total', value: isEl ? '8 κορυφές' : '8 vertices' }
    ],
    explanation: isEl
      ? 'Ο κύβος έχει 8 κορυφές (4 στην επάνω βάση και 4 στην κάτω).'
      : 'A cube has 8 vertices (4 on top base and 4 on bottom base).'
  });

  // Q7: Τύπος Euler (MCQ)
  const q7Correct = isEl ? 'Ε ＋ Κ ＝ Α ＋ 2' : 'F ＋ V ＝ E ＋ 2';
  qs.push({
    id: 7,
    type: 'mcq',
    title: isEl ? 'Ο ΤΥΠΟΣ ΤΟΥ EULER' : "EULER'S FORMULA",
    prompt: isEl
      ? 'Ποια είναι η σωστή μαθηματική σχέση του Euler που συνδέει τις Έδρες (Ε), τις Κορυφές (Κ) και τις Ακμές (Α) ενός κυρτού πολυέδρου;'
      : "What is the correct mathematical relation of Euler connecting Faces (F), Vertices (V), and Edges (E) of a convex polyhedron?",
    options: ensureFourUniqueOptions(q7Correct, () => [
      isEl ? 'Ε ＋ Α ＝ Κ ＋ 2' : 'F ＋ E ＝ V ＋ 2',
      isEl ? 'Ε · Κ ＝ Α ＋ 2' : 'F · V ＝ E ＋ 2',
      isEl ? 'Ε ＋ Κ ＋ Α ＝ 2' : 'F ＋ V ＋ E ＝ 2'
    ]),
    correctAnswer: q7Correct,
    tableData: [
      { label: isEl ? 'Σχέση Euler' : "Euler's relation", value: isEl ? 'Έδρες ＋ Κορυφές ＝ Ακμές ＋ 2' : 'Faces ＋ Vertices ＝ Edges ＋ 2' },
      { label: isEl ? 'Στον κύβο' : 'On a cube', value: isEl ? '6 ＋ 8 ＝ 12 ＋ 2 ＝ 14' : '6 ＋ 8 ＝ 12 ＋ 2 ＝ 14' }
    ],
    explanation: isEl
      ? 'Ο τύπος του Euler είναι: Έδρες ＋ Κορυφές ＝ Ακμές ＋ 2 (Ε ＋ Κ ＝ Α ＋ 2).'
      : "Euler's formula is: Faces ＋ Vertices ＝ Edges ＋ 2 (F ＋ V ＝ E ＋ 2)."
  });

  // Q8: Ομάδες ακμών στο παραλληλεπίπεδο (MCQ)
  const q8Correct = isEl
    ? 'Σε 3 ομάδες των 4 ίσων ακμών (4 μήκη, 4 πλάτη, 4 ύψη)'
    : 'Into 3 groups of 4 equal edges (4 lengths, 4 widths, 4 heights)';
  qs.push({
    id: 8,
    type: 'mcq',
    title: isEl ? 'ΑΚΜΕΣ ΟΡΘΟΓΩΝΙΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ' : 'RECTANGULAR PRISM EDGES',
    prompt: isEl
      ? 'Πώς κατανέμονται οι 12 ακμές σε ένα ορθογώνιο παραλληλεπίπεδο με μήκος, πλάτος και ύψος;'
      : 'How are the 12 edges distributed in a rectangular prism with length, width, and height?',
    options: ensureFourUniqueOptions(q8Correct, () => [
      isEl ? 'Είναι και οι 12 υποχρεωτικά ίσες μεταξύ τους' : 'All 12 edges are necessarily equal to each other',
      isEl ? 'Σε 2 ομάδες των 6 ακμών' : 'Into 2 groups of 6 edges',
      isEl ? 'Σε 6 ομάδες των 2 ακμών' : 'Into 6 groups of 2 edges'
    ]),
    correctAnswer: q8Correct,
    tableData: [
      { label: isEl ? 'Κατανομή 12 ακμών' : 'Distribution of 12 edges', value: isEl ? '4 μήκη (α) ＋ 4 πλάτη (β) ＋ 4 ύψη (γ)' : '4 lengths (a) ＋ 4 widths (b) ＋ 4 heights (c)' }
    ],
    explanation: isEl
      ? 'Το ορθογώνιο παραλληλεπίπεδο έχει 4 παράλληλες ακμές για κάθε μία από τις τρεις διαστάσεις του: 4 · (α ＋ β ＋ γ).'
      : 'A rectangular prism has 4 parallel edges for each of its three dimensions: 4 · (a ＋ b ＋ c).'
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

export default function AkmesKorifesAskiseisPage() {
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
      ? "Ασκήσεις: Ακμές & Κορυφές - ΣΤ' Δημοτικού | LearnMaths.gr"
      : "Exercises: Edges & Vertices - 6th Grade | LearnMaths.gr",
    metaDesc: isEl
      ? "Διαδραστικές ασκήσεις στις ακμές, κορυφές, σκελετούς κύβου και ορθογωνίου παραλληλεπιπέδου και στον τύπο του Euler για τη ΣΤ' Δημοτικού."
      : "Interactive exercises on edges, vertices, cube and prism wireframes, and Euler's formula for 6th Grade.",
    backText: isEl ? "Θεωρία Κεφ. 78" : "Theory Ch. 78",
    actionTheory: isEl ? "📖 Θεωρία" : "📖 Theory",
    chapterBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 78 • ΣΤ' ΔΗΜΟΤΙΚΟΥ" : "EXERCISES • CHAPTER 78 • 6TH GRADE",
    heroTitle: isEl ? "Ασκήσεις: Ακμές και Κορυφές" : "Exercises: Edges and Vertices",
    heroDesc: isEl
      ? "Εξασκηθείτε στις 12 ακμές και τις 8 κορυφές, στους υπολογισμούς συρμάτινων σκελετών και στον τύπο του Euler μέσα από 12 δυναμικές ερωτήσεις."
      : "Practice with 12 edges and 8 vertices, wireframe perimeter calculations, and Euler's formula through 12 dynamic questions.",
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
      backUrl="/st-dimotikou/78-akmes-korifes"
      backText={ui.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/78-akmes-korifes"
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
// pages/st-dimotikou/81-ogkos-cube-ask.js
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
  // 1. Ξύλινο κυβικό κουτί
  (locale) => {
    const isEl = locale === 'el';
    const a = randInt(4, 9);
    const vol = a * a * a;
    const correct = `${formatNum(vol, locale)} cm³`;
    const edgeSym = isEl ? 'α' : 'a';
    return {
      title: isEl ? 'ΟΓΚΟΣ ΞΥΛΙΝΟΥ ΚΥΒΟΥ' : 'WOODEN CUBE VOLUME',
      prompt: isEl
        ? `Ένας συμπαγής ξύλινος κύβος έχει ακμή μήκους ${a} cm. Ποιος είναι ο όγκος του σε cm³;`
        : `A solid wooden cube has an edge length of ${a} cm. What is its volume in cm³?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a * a, locale)} cm³`,
        `${formatNum(vol + 18, locale)} cm³`,
        `${formatNum(vol > 15 ? vol - 12 : vol + 36, locale)} cm³`,
        `${formatNum(6 * a * a, locale)} cm³`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Ακμή κύβου (${edgeSym})` : `Cube edge (${edgeSym})`, value: `${a} cm` },
        { label: isEl ? 'Τύπος όγκου κύβου' : 'Cube volume formula', value: `V ＝ ${edgeSym} · ${edgeSym} · ${edgeSym} ＝ ${edgeSym}³` },
        { label: isEl ? 'Πράξη υπολογισμού' : 'Calculation', value: `${a} · ${a} · ${a} ＝ ${formatNum(vol, locale)} cm³` }
      ],
      explanation: isEl
        ? `Ο όγκος του κύβου ισούται με την ακμή υψωμένη στην τρίτη δύναμη: V ＝ ${edgeSym}³ ＝ ${a} · ${a} · ${a} ＝ ${formatNum(vol, locale)} cm³.`
        : `The volume of the cube equals the edge raised to the third power: V ＝ ${edgeSym}³ ＝ ${a} · ${a} · ${a} ＝ ${formatNum(vol, locale)} cm³.`
    };
  },
  // 2. Κυβικό δοχείο σε dm³
  (locale) => {
    const isEl = locale === 'el';
    const a = randInt(3, 7);
    const vol = a * a * a;
    const correct = `${formatNum(vol, locale)} dm³`;
    const edgeSym = isEl ? 'α' : 'a';
    return {
      title: isEl ? 'ΚΥΒΙΚΟ ΔΟΧΕΙΟ ΣΕ DM³' : 'CUBICAL CONTAINER IN DM³',
      prompt: isEl
        ? `Ένα μεταλλικό δοχείο έχει σχήμα κύβου με ακμή ${a} dm. Πόσα κυβικά δεκατόμετρα (dm³) είναι ο όγκος του;`
        : `A metal container has the shape of a cube with edge ${a} dm. How many cubic decimeters (dm³) is its volume?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a * a, locale)} dm³`,
        `${formatNum(vol + 25, locale)} dm³`,
        `${formatNum(vol > 20 ? vol - 20 : vol + 50, locale)} dm³`,
        `${formatNum(a * 3, locale)} dm³`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Ακμή κύβου (${edgeSym})` : `Cube edge (${edgeSym})`, value: `${a} dm` },
        { label: isEl ? 'Πράξη' : 'Calculation', value: `${a} · ${a} · ${a} ＝ ${formatNum(vol, locale)} dm³` }
      ],
      explanation: isEl
        ? `V ＝ ${edgeSym} · ${edgeSym} · ${edgeSym} ＝ ${a} · ${a} · ${a} ＝ ${formatNum(vol, locale)} dm³.`
        : `V ＝ ${edgeSym} · ${edgeSym} · ${edgeSym} ＝ ${a} · ${a} · ${a} ＝ ${formatNum(vol, locale)} dm³.`
    };
  },
  // 3. Μεγάλη κυβική δεξαμενή σε m³
  (locale) => {
    const isEl = locale === 'el';
    const correct = '27 m³';
    return {
      title: isEl ? 'ΚΥΒΙΚΗ ΔΕΞΑΜΕΝΗ ΝΕΡΟΥ' : 'CUBICAL WATER TANK',
      prompt: isEl
        ? 'Μια κυβική δεξαμενή νερού σε μια αγροτική αποθήκη έχει ακμή 3 m. Πόσα κυβικά μέτρα (m³) είναι ο όγκος της;'
        : 'A cubical water tank in a farm warehouse has edge length 3 m. What is its volume in cubic meters (m³)?',
      options: ensureFourUniqueOptions(correct, () => ['9 m³', '18 m³', '54 m³', '81 m³']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Ακμή κύβου' : 'Cube edge', value: '3 m' },
        { label: isEl ? 'Πράξη' : 'Calculation', value: '3 · 3 · 3 ＝ 27 m³' }
      ],
      explanation: isEl ? 'V ＝ 3 · 3 · 3 ＝ 27 m³.' : 'V ＝ 3 · 3 · 3 ＝ 27 m³.'
    };
  },
  // 4. Κυβικό ζάρι
  (locale) => {
    const isEl = locale === 'el';
    const correct = '8 cm³';
    return {
      title: isEl ? 'ΟΓΚΟΣ ΖΑΡΙΟΥ' : 'DIE VOLUME',
      prompt: isEl
        ? 'Ένα ζάρι σε σχήμα κύβου έχει ακμή 2 cm. Πόσο είναι το μέγεθος του όγκου του σε cm³;'
        : 'A cube die has an edge of 2 cm. What is its volume in cm³?',
      options: ensureFourUniqueOptions(correct, () => ['4 cm³', '6 cm³', '12 cm³', '24 cm³']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Ακμή (α)' : 'Edge (a)', value: '2 cm' },
        { label: isEl ? 'Πράξη' : 'Calculation', value: '2 · 2 · 2 ＝ 8 cm³' }
      ],
      explanation: isEl ? 'V ＝ 2 · 2 · 2 ＝ 8 cm³.' : 'V ＝ 2 · 2 · 2 ＝ 8 cm³.'
    };
  }
];

// POOL ΓΙΑ Q10: Όγκος Ορθογωνίου Παραλληλεπιπέδου (V ＝ α · β · γ)
const PROBLEM_POOL_Q10 = [
  // 1. Κουτί συσκευασίας
  (locale) => {
    const isEl = locale === 'el';
    const l = randInt(10, 20);
    const w = randInt(5, 10);
    const h = randInt(4, 8);
    const vol = l * w * h;
    const correct = `${formatNum(vol, locale)} cm³`;
    const aSym = isEl ? 'α' : 'a';
    const bSym = isEl ? 'β' : 'b';
    const cSym = isEl ? 'γ' : 'c';
    return {
      title: isEl ? 'ΟΓΚΟΣ ΚΟΥΤΙΟΥ ΣΥΣΚΕΥΑΣΙΑΣ' : 'PACKING BOX VOLUME',
      prompt: isEl
        ? `Ένα κουτί συσκευασίας έχει μήκος ${l} cm, πλάτος ${w} cm και ύψος ${h} cm. Πόσα cm³ είναι ο όγκος του;`
        : `A packing box has length ${l} cm, width ${w} cm, and height ${h} cm. How many cm³ is its volume?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(l * w, locale)} cm³`,
        `${formatNum(vol + 40, locale)} cm³`,
        `${formatNum(vol > 30 ? vol - 30 : vol + 60, locale)} cm³`,
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
        ? `Πολλαπλασιάζουμε τις 3 διαστάσεις: V ＝ ${aSym} · ${bSym} · ${cSym} ＝ ${l} · ${w} · ${h} ＝ ${formatNum(vol, locale)} cm³.`
        : `Multiply the 3 dimensions: V ＝ ${aSym} · ${bSym} · ${cSym} ＝ ${l} · ${w} · ${h} ＝ ${formatNum(vol, locale)} cm³.`
    };
  },
  // 2. Ενυδρείο σε dm³
  (locale) => {
    const isEl = locale === 'el';
    const correct = '120 dm³';
    return {
      title: isEl ? 'ΟΓΚΟΣ ΕΝΥΔΡΕΙΟΥ ΣΕ DM³' : 'AQUARIUM VOLUME IN DM³',
      prompt: isEl
        ? 'Ένα ενυδρείο έχει μήκος 6 dm, πλάτος 4 dm και ύψος 5 dm. Ποιος είναι ο εσωτερικός του όγκος σε dm³;'
        : 'An aquarium has length 6 dm, width 4 dm, and height 5 dm. What is its interior volume in dm³?',
      options: ensureFourUniqueOptions(correct, () => ['24 dm³', '60 dm³', '240 dm³', '15 dm³']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Διαστάσεις σε dm' : 'Dimensions in dm', value: '6 dm, 4 dm, 5 dm' },
        { label: isEl ? 'Πράξη' : 'Calculation', value: '6 · 4 · 5 ＝ 120 dm³' }
      ],
      explanation: isEl ? 'V ＝ 6 · 4 · 5 ＝ 120 dm³.' : 'V ＝ 6 · 4 · 5 ＝ 120 dm³.'
    };
  },
  // 3. Δωμάτιο σε m³
  (locale) => {
    const isEl = locale === 'el';
    const correct = '60 m³';
    return {
      title: isEl ? 'ΟΓΚΟΣ ΑΕΡΑ ΔΩΜΑΤΙΟΥ' : 'ROOM AIR VOLUME',
      prompt: isEl
        ? 'Ένα δωμάτιο έχει μήκος 5 m, πλάτος 4 m και ύψος 3 m. Πόσα κυβικά μέτρα (m³) αέρα περιέχει;'
        : 'A room has length 5 m, width 4 m, and height 3 m. How many cubic meters (m³) of air does it contain?',
      options: ensureFourUniqueOptions(correct, () => ['20 m³', '12 m³', '120 m³', '94 m³']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Διαστάσεις δωματίου' : 'Room dimensions', value: '5 m, 4 m, 3 m' },
        { label: isEl ? 'Υπολογισμός' : 'Calculation', value: '5 · 4 · 3 ＝ 60 m³' }
      ],
      explanation: isEl ? 'V ＝ 5 · 4 · 3 ＝ 60 m³.' : 'V ＝ 5 · 4 · 3 ＝ 60 m³.'
    };
  }
];

// POOL ΓΙΑ Q11: Αντίστροφο Πρόβλημα Όγκου (Εύρεση Ακμής, Ύψους ή Βάσης)
const PROBLEM_POOL_Q11 = [
  // 1. Εύρεση ακμής κύβου από τον όγκο
  (locale) => {
    const isEl = locale === 'el';
    const correct = '4 cm';
    return {
      title: isEl ? 'ΕΥΡΕΣΗ ΑΚΜΗΣ ΚΥΒΟΥ ΑΠΟ ΤΟΝ ΟΓΚΟ' : 'CUBE EDGE FROM VOLUME',
      prompt: isEl
        ? 'Ένα κουτί σε σχήμα κύβου έχει όγκο 64 cm³. Πόσο είναι το μήκος της ακμής του κύβου;'
        : 'A cube-shaped box has a volume of 64 cm³. What is the length of the edge of the cube?',
      options: ensureFourUniqueOptions(correct, () => ['8 cm', '16 cm', '6 cm', '5 cm']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Όγκος κύβου (V)' : 'Cube volume (V)', value: '64 cm³' },
        { label: isEl ? 'Σχέση' : 'Equation', value: isEl ? 'α · α · α ＝ 64' : 'a · a · a ＝ 64' },
        { label: isEl ? 'Ακμή (α)' : 'Edge (a)', value: isEl ? '4 cm (επειδή 4 · 4 · 4 ＝ 64)' : '4 cm (since 4 · 4 · 4 ＝ 64)' }
      ],
      explanation: isEl
        ? 'Ψάχνουμε ποιος αριθμός πολλαπλασιασμένος με τον εαυτό του 3 φορές δίνει 64: 4 · 4 · 4 ＝ 64, άρα η ακμή είναι 4 cm.'
        : 'We find which number multiplied by itself 3 times yields 64: 4 · 4 · 4 ＝ 64, so the edge length is 4 cm.'
    };
  },
  // 2. Εύρεση ύψους ορθογωνίου παραλληλεπιπέδου από τον όγκο
  (locale) => {
    const isEl = locale === 'el';
    const l = randInt(6, 12);
    const w = randInt(4, 8);
    const h = randInt(3, 6);
    const baseArea = l * w;
    const vol = baseArea * h;
    const correct = `${h} cm`;
    const cSym = isEl ? 'γ' : 'c';
    return {
      title: isEl ? 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΑΠΟ ΤΟΝ ΟΓΚΟ' : 'FINDING HEIGHT FROM VOLUME',
      prompt: isEl
        ? `Ένα ορθογώνιο παραλληλεπίπεδο έχει όγκο ${vol} cm³. Η βάση του έχει μήκος ${l} cm και πλάτος ${w} cm. Πόσο είναι το ύψος του;`
        : `A rectangular prism has volume ${vol} cm³. Its base has length ${l} cm and width ${w} cm. What is its height?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${h + 2} cm`,
        `${h > 1 ? h - 1 : h + 3} cm`,
        `${Math.round(vol / l)} cm`,
        `${h * 2} cm`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Συνολικός όγκος (V)' : 'Total volume (V)', value: `${vol} cm³` },
        { label: isEl ? 'Εμβαδόν βάσης (α · β)' : 'Base area (a · b)', value: `${l} · ${w} ＝ ${baseArea} cm²` },
        { label: isEl ? 'Τύπος ύψους' : 'Height formula', value: `${cSym} ＝ V : (α · β)` },
        { label: isEl ? 'Πράξη' : 'Calculation', value: `${vol} : ${baseArea} ＝ ${h} cm` }
      ],
      explanation: isEl
        ? `Υπολογίζουμε πρώτα το εμβαδόν της βάσης: ${l} · ${w} ＝ ${baseArea} cm². Έπειτα διαιρούμε τον όγκο με το εμβαδόν της βάσης: ${vol} : ${baseArea} ＝ ${h} cm.`
        : `First compute the base area: ${l} · ${w} ＝ ${baseArea} cm². Then divide volume by base area: ${vol} : ${baseArea} ＝ ${h} cm.`
    };
  },
  // 3. Εύρεση ακμής κύβου με όγκο 125 cm³
  (locale) => {
    const isEl = locale === 'el';
    const correct = '5 cm';
    return {
      title: isEl ? 'ΑΚΜΗ ΚΥΒΟΥ ΜΕ ΟΓΚΟ 125 CM³' : 'CUBE EDGE FOR VOLUME 125 CM³',
      prompt: isEl
        ? 'Ο όγκος ενός κύβου είναι 125 cm³. Πόσα εκατοστόμετρα (cm) είναι η ακμή του;'
        : 'The volume of a cube is 125 cm³. How many centimeters (cm) is its edge?',
      options: ensureFourUniqueOptions(correct, () => ['25 cm', '15 cm', '6 cm', '4 cm']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Όγκος (V)' : 'Volume (V)', value: '125 cm³' },
        { label: isEl ? 'Ακμή (α)' : 'Edge (a)', value: isEl ? '5 cm (επειδή 5 · 5 · 5 ＝ 125)' : '5 cm (since 5 · 5 · 5 ＝ 125)' }
      ],
      explanation: isEl
        ? 'Επειδή 5 · 5 · 5 ＝ 125, η ακμή του κύβου είναι 5 cm.'
        : 'Because 5 · 5 · 5 ＝ 125, the edge of the cube is 5 cm.'
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα, Δοχεία με Νερό & Μετατροπές σε Λίτρα
const PROBLEM_POOL_Q12 = [
  // 1. Γέμισμα δεξαμενής σε λίτρα
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(3600, locale)} L`;
    return {
      title: isEl ? 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΔΕΞΑΜΕΝΗΣ ΣΕ ΛΙΤΡΑ' : 'TANK CAPACITY IN LITERS',
      prompt: isEl
        ? 'Μια δεξαμενή πετρελαίου έχει μήκος 2 m, πλάτος 1,2 m και ύψος 1,5 m. Πόσα λίτρα (L) πετρελαίου χωράει;'
        : 'An oil tank has length 2 m, width 1.2 m, and height 1.5 m. How many liters (L) of oil does it hold?',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(360, locale)} L`,
        `${formatNum(36000, locale)} L`,
        `${formatNum(3.6, locale)} L`,
        `${formatNum(1800, locale)} L`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Όγκος σε m³' : 'Volume in m³', value: '2 · 1,2 · 1,5 ＝ 3,6 m³' },
        { label: isEl ? 'Σχέση m³ με λίτρα' : 'Relation m³ to liters', value: '1 m³ ＝ 1.000 dm³ ＝ 1.000 L' },
        { label: isEl ? 'Χωρητικότητα σε λίτρα' : 'Capacity in liters', value: `3,6 · 1.000 ＝ ${formatNum(3600, locale)} L` }
      ],
      explanation: isEl
        ? 'V ＝ 2 · 1,2 · 1,5 ＝ 3,6 m³. Επειδή 1 m³ ＝ 1.000 L, η δεξαμενή χωράει 3,6 · 1.000 ＝ 3.600 L.'
        : 'V ＝ 2 · 1.2 · 1.5 ＝ 3.6 m³. Since 1 m³ ＝ 1,000 L, the tank holds 3.6 · 1,000 ＝ 3,600 L.'
    };
  },
  // 2. Ενυδρείο σε λίτρα με μετατροπή cm σε dm
  (locale) => {
    const isEl = locale === 'el';
    const correct = '160 L';
    return {
      title: isEl ? 'ΝΕΡΟ ΣΕ ΕΝΥΔΡΕΙΟ' : 'AQUARIUM WATER CAPACITY',
      prompt: isEl
        ? 'Ένα ενυδρείο έχει μήκος 80 cm, πλάτος 40 cm και ύψος 50 cm. Πόσα λίτρα (L) νερού χρειάζονται για να γεμίσει πλήρως;'
        : 'An aquarium has length 80 cm, width 40 cm, and height 50 cm. How many liters (L) of water are needed to fill it completely?',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(16, locale)} L`,
        `${formatNum(1600, locale)} L`,
        `${formatNum(160000, locale)} L`,
        `${formatNum(320, locale)} L`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Διαστάσεις σε dm' : 'Dimensions in dm', value: '8 dm, 4 dm, 5 dm' },
        { label: isEl ? 'Όγκος σε dm³' : 'Volume in dm³', value: '8 · 4 · 5 ＝ 160 dm³' },
        { label: isEl ? 'Λίτρα (1 dm³ ＝ 1 L)' : 'Liters (1 dm³ ＝ 1 L)', value: '160 L' }
      ],
      explanation: isEl
        ? 'Μετατρέπουμε σε dm: 8 dm · 4 dm · 5 dm ＝ 160 dm³. Επειδή 1 dm³ ＝ 1 L, το ενυδρείο χωράει 160 L.'
        : 'Convert to dm: 8 dm · 4 dm · 5 dm ＝ 160 dm³. Since 1 dm³ ＝ 1 L, the aquarium holds 160 L.'
    };
  },
  // 3. Πόσα μπουκάλια του 1 L γεμίζει ένας κύβος ακμής 20 cm
  (locale) => {
    const isEl = locale === 'el';
    const correct = isEl ? '8 μπουκάλια' : '8 bottles';
    return {
      title: isEl ? 'ΕΜΦΙΑΛΩΣΗ ΑΠΟ ΚΥΒΙΚΟ ΔΟΧΕΙΟ' : 'BOTTLING FROM CUBICAL TANK',
      prompt: isEl
        ? 'Ένα κυβικό δοχείο έχει ακμή 20 cm και είναι γεμάτο νερό. Πόσα μπουκάλια του 1 L μπορούν να γεμίσουν από αυτό;'
        : 'A cubical tank has an edge of 20 cm and is full of water. How many 1 L bottles can be filled from it?',
      options: ensureFourUniqueOptions(correct, () => [
        isEl ? '2 μπουκάλια' : '2 bottles',
        isEl ? '4 μπουκάλια' : '4 bottles',
        isEl ? '16 μπουκάλια' : '16 bottles',
        isEl ? '80 μπουκάλια' : '80 bottles'
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Ακμή σε dm' : 'Edge in dm', value: '20 cm ＝ 2 dm' },
        { label: isEl ? 'Όγκος δοχείου' : 'Container volume', value: '2 · 2 · 2 ＝ 8 dm³ ＝ 8 L' },
        { label: isEl ? 'Μπουκάλια του 1 L' : '1 L bottles', value: isEl ? '8 : 1 ＝ 8 μπουκάλια' : '8 : 1 ＝ 8 bottles' }
      ],
      explanation: isEl
        ? '20 cm ＝ 2 dm. V ＝ 2 · 2 · 2 ＝ 8 dm³ ＝ 8 L. Άρα γεμίζουν 8 μπουκάλια του 1 λίτρου.'
        : '20 cm ＝ 2 dm. V ＝ 2 · 2 · 2 ＝ 8 dm³ ＝ 8 L. Thus, exactly 8 one-liter bottles are filled.'
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

  // Q1: Τύπος όγκου κύβου (Boolean)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: isEl ? 'ΤΥΠΟΣ ΟΓΚΟΥ ΚΥΒΟΥ' : 'CUBE VOLUME FORMULA',
    prompt: isEl
      ? (isQ1True
          ? `Ο όγκος ενός κύβου με ακμή ${aSym} υπολογίζεται με τον τύπο V ＝ ${aSym} · ${aSym} · ${aSym} ＝ ${aSym}³.`
          : `Ο όγκος ενός κύβου με ακμή ${aSym} υπολογίζεται πολλαπλασιάζοντας την ακμή επί 3: V ＝ 3 · ${aSym}.`)
      : (isQ1True
          ? `The volume of a cube with edge ${aSym} is calculated with the formula V ＝ ${aSym} · ${aSym} · ${aSym} ＝ ${aSym}³.`
          : `The volume of a cube with edge ${aSym} is calculated by multiplying edge by 3: V ＝ 3 · ${aSym}.`),
    correctAnswer: isQ1True,
    tableData: [
      { label: isEl ? 'Σωστός τύπος κύβου' : 'Correct cube formula', value: `V ＝ ${aSym} · ${aSym} · ${aSym} ＝ ${aSym}³` },
      { label: isEl ? 'Σύνηθες λάθος' : 'Common misconception', value: `3 · ${aSym}` }
    ],
    explanation: isEl
      ? (isQ1True
          ? `Ο όγκος του κύβου ισούται με την ακμή υψωμένη στην 3η δύναμη (V ＝ ${aSym}³).`
          : `Ο τύπος 3 · ${aSym} είναι λάθος. Στον όγκο πολλαπλασιάζουμε την ακμή με τον εαυτό της 3 φορές: V ＝ ${aSym} · ${aSym} · ${aSym} ＝ ${aSym}³.`)
      : (isQ1True
          ? `The volume of a cube equals edge cubed (V ＝ ${aSym}³).`
          : `The formula 3 · ${aSym} is incorrect. For volume, we multiply the edge by itself 3 times: V ＝ ${aSym} · ${aSym} · ${aSym} ＝ ${aSym}³.`)
  });

  // Q2: Τύπος όγκου ορθογωνίου παραλληλεπιπέδου (MCQ)
  const q2Correct = isEl
    ? `V ＝ ${aSym} · ${bSym} · ${cSym} (Μήκος · Πλάτος · Ύψος)`
    : `V ＝ ${aSym} · ${bSym} · ${cSym} (Length · Width · Height)`;
  qs.push({
    id: 2,
    type: 'mcq',
    title: isEl ? 'ΤΥΠΟΣ ΟΓΚΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ' : 'RECTANGULAR PRISM VOLUME FORMULA',
    prompt: isEl
      ? `Πώς υπολογίζουμε τον όγκο (V) ενός ορθογωνίου παραλληλεπιπέδου με διαστάσεις ${aSym}, ${bSym} και ${cSym};`
      : `How do we calculate the volume (V) of a rectangular prism with dimensions ${aSym}, ${bSym}, and ${cSym}?`,
    options: ensureFourUniqueOptions(q2Correct, () => [
      `V ＝ ${aSym} ＋ ${bSym} ＋ ${cSym}`,
      `V ＝ 2 · (${aSym} · ${bSym} ＋ ${bSym} · ${cSym} ＋ ${aSym} · ${cSym})`,
      `V ＝ (${aSym} · ${bSym}) : ${cSym}`
    ]),
    correctAnswer: q2Correct,
    tableData: [
      { label: isEl ? '3 διαστάσεις' : '3 dimensions', value: isEl ? `Μήκος (${aSym}), Πλάτος (${bSym}), Ύψος (${cSym})` : `Length (${aSym}), Width (${bSym}), Height (${cSym})` },
      { label: isEl ? 'Τύπος όγκου' : 'Volume formula', value: `V ＝ ${aSym} · ${bSym} · ${cSym}` }
    ],
    explanation: isEl
      ? `Ο όγκος του ορθογωνίου παραλληλεπιπέδου ισούται με το γινόμενο των τριών διαστάσεών του: V ＝ ${aSym} · ${bSym} · ${cSym}.`
      : `The volume of a rectangular prism is the product of its three dimensions: V ＝ ${aSym} · ${bSym} · ${cSym}.`
  });

  // Q3: Σχέση όγκου με εμβαδόν βάσης (MCQ)
  const q3Correct = isEl
    ? `V ＝ Εμβαδόν Βάσης · Ύψος (V ＝ Εβ · ${cSym})`
    : `V ＝ Base Area · Height (V ＝ Abase · ${cSym})`;
  qs.push({
    id: 3,
    type: 'mcq',
    title: isEl ? 'ΟΓΚΟΣ ΚΑΙ ΕΜΒΑΔΟΝ ΒΑΣΗΣ' : 'VOLUME AND BASE AREA',
    prompt: isEl
      ? 'Ποια σχέση συνδέει τον όγκο (V) ενός ορθογωνίου παραλληλεπιπέδου με το εμβαδόν της βάσης του (Εβ);'
      : 'Which formula connects the volume (V) of a rectangular prism with its base area (Abase)?',
    options: ensureFourUniqueOptions(q3Correct, () => [
      isEl ? 'V ＝ Εμβαδόν Βάσης : Ύψος' : 'V ＝ Base Area : Height',
      isEl ? 'V ＝ (Εμβαδόν Βάσης · Ύψος) : 2' : 'V ＝ (Base Area · Height) : 2',
      isEl ? 'V ＝ Εμβαδόν Βάσης ＋ Ύψος' : 'V ＝ Base Area ＋ Height'
    ]),
    correctAnswer: q3Correct,
    tableData: [
      { label: isEl ? 'Εμβαδόν βάσης' : 'Base area', value: `Εβ ＝ ${aSym} · ${bSym}` },
      { label: isEl ? 'Όγκος' : 'Volume', value: `V ＝ (${aSym} · ${bSym}) · ${cSym} ＝ Εβ · ${cSym}` }
    ],
    explanation: isEl
      ? `Επειδή το εμβαδόν της βάσης είναι ${aSym} · ${bSym}, ο όγκος γράφεται ως V ＝ Εμβαδόν Βάσης · Ύψος.`
      : `Because base area is ${aSym} · ${bSym}, volume can be stated as V ＝ Base Area · Height.`
  });

  // Q4: Οπτική αναγνώριση κυβιδίων (SVG - No Giveaway)
  const q4Correct = isEl ? '12 cm³ (3 · 2 · 2)' : '12 cm³ (3 · 2 · 2)';
  qs.push({
    id: 4,
    type: 'mcq',
    title: isEl ? 'ΚΑΤΑΜΕΤΡΗΣΗ ΚΥΒΙΚΩΝ ΕΚΑΤΟΣΤΩΝ' : 'COUNTING CUBIC CENTIMETERS',
    prompt: isEl
      ? 'Παρατηρήστε το παρακάτω στερεό από κυβάκια 1 cm³. Ποιος είναι ο συνολικός όγκος του;'
      : 'Look at the 3D solid of 1 cm³ unit cubes below. What is its total volume?',
    svg: (
      <svg viewBox="0 0 160 110" className="w-full max-w-[160px] h-auto mx-auto my-2 select-none drop-shadow-sm">
        <polygon points="50,45 80,30 130,55 100,70" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
        <polygon points="50,45 100,70 100,95 50,70" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
        <polygon points="100,70 130,55 130,80 100,95" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
        <text x="75" y="85" fill="#0f172a" fontSize="10" fontWeight="bold">3 × 2 × 2</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => [
      isEl ? '7 cm³ (3 ＋ 2 ＋ 2)' : '7 cm³ (3 ＋ 2 ＋ 2)',
      '18 cm³',
      '24 cm³'
    ]),
    correctAnswer: q4Correct,
    tableData: [
      { label: isEl ? 'Διαστάσεις' : 'Dimensions', value: isEl ? 'Μήκος 3 cm, Πλάτος 2 cm, Ύψος 2 cm' : 'Length 3 cm, Width 2 cm, Height 2 cm' },
      { label: isEl ? 'Υπολογισμός' : 'Calculation', value: '3 · 2 · 2 ＝ 12 cm³' }
    ],
    explanation: isEl
      ? 'Το στερεό αποτελείται από 3 · 2 ＝ 6 κυβάκια στη βάση επί 2 στρώσεις ύψους: 6 · 2 ＝ 12 cm³.'
      : 'The solid has 3 · 2 ＝ 6 cubes in the base layer by 2 vertical layers: 6 · 2 ＝ 12 cm³.'
  });

  // Q5: Υπολογισμός όγκου κύβου με ακμή 3 cm (Input)
  qs.push({
    id: 5,
    type: 'input',
    title: isEl ? `ΥΠΟΛΟΓΙΣΜΟΣ ΟΓΚΟΥ ΚΥΒΟΥ (${toCleanUppercase(aSym)} ＝ 3 CM)` : `CUBE VOLUME (${aSym.toUpperCase()} ＝ 3 CM)`,
    prompt: isEl
      ? 'Ένας κύβος έχει ακμή 3 cm. Πόσα cm³ είναι ο όγκος του; (Γράψτε μόνο τον αριθμό)'
      : 'A cube has edge 3 cm. What is its volume in cm³? (Enter number only)',
    correctAnswer: '27',
    tableData: [
      { label: isEl ? `Ακμή (${aSym})` : `Edge (${aSym})`, value: '3 cm' },
      { label: isEl ? 'Πράξη' : 'Calculation', value: '3 · 3 · 3 ＝ 27 cm³' }
    ],
    explanation: isEl ? 'V ＝ 3 · 3 · 3 ＝ 27 cm³.' : 'V ＝ 3 · 3 · 3 ＝ 27 cm³.'
  });

  // Q6: Υπολογισμός όγκου παραλληλεπιπέδου (Input)
  qs.push({
    id: 6,
    type: 'input',
    title: isEl ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΓΚΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ' : 'PRISM VOLUME CALCULATION',
    prompt: isEl
      ? 'Ένα κουτί έχει μήκος 5 cm, πλάτος 4 cm και ύψος 3 cm. Πόσα cm³ είναι ο όγκος του; (Γράψτε μόνο τον αριθμό)'
      : 'A box has length 5 cm, width 4 cm, and height 3 cm. What is its volume in cm³? (Enter number only)',
    correctAnswer: '60',
    tableData: [
      { label: isEl ? 'Διαστάσεις' : 'Dimensions', value: '5 cm, 4 cm, 3 cm' },
      { label: isEl ? 'Πράξη' : 'Calculation', value: '5 · 4 · 3 ＝ 60 cm³' }
    ],
    explanation: isEl ? 'V ＝ 5 · 4 · 3 ＝ 60 cm³.' : 'V ＝ 5 · 4 · 3 ＝ 60 cm³.'
  });

  // Q7: Πόσα λίτρα είναι 1 m³ (MCQ)
  const q7Correct = isEl ? '1.000 Λίτρα' : '1,000 Liters';
  qs.push({
    id: 7,
    type: 'mcq',
    title: isEl ? 'ΣΧΕΣΗ ΚΥΒΙΚΟΥ ΜΕΤΡΟΥ ΚΑΙ ΛΙΤΡΩΝ' : 'CUBIC METERS AND LITERS',
    prompt: isEl
      ? 'Πόσα λίτρα (L) νερού περιέχει ακριβώς 1 κυβικό μέτρο (1 m³);'
      : 'How many liters (L) of water does exactly 1 cubic meter (1 m³) contain?',
    options: ensureFourUniqueOptions(q7Correct, () => [
      isEl ? '100 Λίτρα' : '100 Liters',
      isEl ? '10 Λίτρα' : '10 Liters',
      isEl ? '10.000 Λίτρα' : '10,000 Liters'
    ]),
    correctAnswer: q7Correct,
    tableData: [
      { label: isEl ? '1 m³ σε dm³' : '1 m³ in dm³', value: '1.000 dm³' },
      { label: isEl ? 'Ισοδυναμία' : 'Equivalence', value: '1 dm³ ＝ 1 L' },
      { label: isEl ? '1 m³ σε λίτρα' : '1 m³ in liters', value: '1.000 L' }
    ],
    explanation: isEl
      ? '1 m³ ＝ 1.000 dm³. Επειδή 1 dm³ ＝ 1 L, ένα κυβικό μέτρο ισούται με 1.000 λίτρα.'
      : '1 m³ ＝ 1,000 dm³. Because 1 dm³ ＝ 1 L, 1 cubic meter equals 1,000 liters.'
  });

  // Q8: Εύρεση ύψους από τον όγκο (MCQ)
  const q8Correct = isEl
    ? 'γ ＝ Όγκος : Εμβαδόν Βάσης'
    : 'c ＝ Volume : Base Area';
  qs.push({
    id: 8,
    type: 'mcq',
    title: isEl ? 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΑΠΟ ΤΟΝ ΟΓΚΟ' : 'HEIGHT FROM VOLUME',
    prompt: isEl
      ? `Αν γνωρίζουμε τον όγκο (V) ενός ορθογωνίου παραλληλεπιπέδου και το εμβαδόν της βάσης του (Εβ), πώς βρίσκουμε το ύψος (${cSym});`
      : `If we know the volume (V) of a rectangular prism and its base area (Abase), how do we find height (${cSym})?`,
    options: ensureFourUniqueOptions(q8Correct, () => [
      isEl ? `${cSym} ＝ Όγκος · Εμβαδόν Βάσης` : `${cSym} ＝ Volume · Base Area`,
      isEl ? `${cSym} ＝ Όγκος ＋ Εμβαδόν Βάσης` : `${cSym} ＝ Volume ＋ Base Area`,
      isEl ? `${cSym} ＝ (Όγκος : Εμβαδόν Βάσης) : 2` : `${cSym} ＝ (Volume : Base Area) : 2`
    ]),
    correctAnswer: q8Correct,
    tableData: [
      { label: isEl ? 'Τύπος' : 'Formula', value: isEl ? `V ＝ Εβ · ${cSym}, άρα ${cSym} ＝ V : Εβ` : `V ＝ Abase · ${cSym}, so ${cSym} ＝ V : Abase` }
    ],
    explanation: isEl
      ? `Διαιρούμε τον όγκο με το εμβαδόν της βάσης για να βρούμε το ύψος: ${cSym} ＝ V : Εβ.`
      : `Divide volume by base area to calculate height: ${cSym} ＝ V : Abase.`
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

export default function OgkosCubeAskiseisPage() {
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
      ? "Ασκήσεις: Όγκος Κύβου & Παραλληλεπιπέδου - ΣΤ' Δημοτικού | LearnMaths.gr"
      : "Exercises: Volume of Cube & Prism - 6th Grade | LearnMaths.gr",
    metaDesc: isEl
      ? "Διαδραστικές ασκήσεις στον υπολογισμό όγκου κύβου (V ＝ α³) και ορθογωνίου παραλληλεπιπέδου (V ＝ α · β · γ), χωρητικότητα και λίτρα για τη ΣΤ' Δημοτικού."
      : "Interactive exercises on cube volume (V ＝ a³) and rectangular prism volume (V ＝ a · b · c), capacity and liters for 6th Grade.",
    backText: isEl ? "Θεωρία Κεφ. 81" : "Theory Ch. 81",
    actionTheory: isEl ? "📖 Θεωρία" : "📖 Theory",
    chapterBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 81 • ΣΤ' ΔΗΜΟΤΙΚΟΥ" : "EXERCISES • CHAPTER 81 • 6TH GRADE",
    heroTitle: isEl ? "Ασκήσεις: Όγκος Κύβου και Παραλληλεπιπέδου" : "Exercises: Cube & Prism Volume",
    heroDesc: isEl
      ? "Εξασκηθείτε στον υπολογισμό όγκου με τους τύπους V ＝ α³ και V ＝ α · β · γ, στη δόμηση με κυβάκια και στην εύρεση άγνωστων διαστάσεων μέσα από 12 δυναμικές ερωτήσεις."
      : "Practice volume calculations with V ＝ a³ and V ＝ a · b · c, unit cube counting, and finding missing dimensions across 12 dynamic questions.",
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
      backUrl="/st-dimotikou/81-ogkos-cube"
      backText={ui.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/81-ogkos-cube"
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
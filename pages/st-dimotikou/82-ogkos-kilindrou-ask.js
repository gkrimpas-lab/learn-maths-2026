// pages/st-dimotikou/82-ogkos-kilindrou-ask.js
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

// POOL ΓΙΑ Q9: Υπολογισμός Όγκου Κυλίνδρου [V ＝ π · ρ² · υ]
const PROBLEM_POOL_Q9 = [
  // 1. Κυλινδρική κατσαρόλα
  (locale) => {
    const isEl = locale === 'el';
    const r = randInt(8, 14);
    const h = randInt(10, 20);
    const baseArea = 3.14 * r * r;
    const vol = baseArea * h;
    const correct = `${formatNum(vol, locale)} cm³`;
    const rSym = isEl ? 'ρ' : 'r';
    const hSym = isEl ? 'υ' : 'h';
    return {
      title: isEl ? 'ΟΓΚΟΣ ΚΥΛΙΝΔΡΙΚΗΣ ΚΑΤΣΑΡΟΛΑΣ' : 'CYLINDRICAL POT VOLUME',
      prompt: isEl
        ? `Μια κυλινδρική κατσαρόλα έχει ακτίνα βάσης ${rSym} ＝ ${r} cm και ύψος ${hSym} ＝ ${h} cm. Ποιος είναι ο όγκος της σε cm³; (Χρησιμοποιήστε π ＝ 3,14)`
        : `A cylindrical pot has base radius ${rSym} ＝ ${r} cm and height ${hSym} ＝ ${h} cm. What is its volume in cm³? (Use π ＝ 3.14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(baseArea, locale)} cm³`,
        `${formatNum(vol + 150, locale)} cm³`,
        `${formatNum(vol > 150 ? vol - 150 : vol + 300, locale)} cm³`,
        `${formatNum(2 * 3.14 * r * h, locale)} cm³`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Ακτίνα (${rSym})` : `Radius (${rSym})`, value: `${r} cm` },
        { label: isEl ? `Εμβαδόν βάσης (π · ${rSym}²)` : `Base area (π · ${rSym}²)`, value: `3,14 · ${r} · ${r} ＝ ${formatNum(baseArea, locale)} cm²` },
        { label: isEl ? `Ύψος (${hSym})` : `Height (${hSym})`, value: `${h} cm` },
        { label: isEl ? 'Όγκος (V ＝ Εβ · υ)' : 'Volume (V ＝ Abase · h)', value: `${formatNum(baseArea, locale)} · ${h} ＝ ${formatNum(vol, locale)} cm³` }
      ],
      explanation: isEl
        ? `Υπολογίζουμε πρώτα το εμβαδόν της βάσης: Εβ ＝ π · ${rSym}² ＝ 3,14 · ${r} · ${r} ＝ ${formatNum(baseArea, locale)} cm². Έπειτα πολλαπλασιάζουμε με το ύψος: V ＝ ${formatNum(baseArea, locale)} · ${h} ＝ ${formatNum(vol, locale)} cm³.`
        : `First compute base area: Abase ＝ π · ${rSym}² ＝ 3.14 · ${r} · ${r} ＝ ${formatNum(baseArea, locale)} cm². Then multiply by height: V ＝ ${formatNum(baseArea, locale)} · ${h} ＝ ${formatNum(vol, locale)} cm³.`
    };
  },
  // 2. Κυλινδρικό ποτήρι
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(502.4, locale)} cm³`;
    const rSym = isEl ? 'ρ' : 'r';
    const hSym = isEl ? 'υ' : 'h';
    return {
      title: isEl ? 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΠΟΤΗΡΙΟΥ' : 'GLASS CUP CAPACITY',
      prompt: isEl
        ? `Ένα κυλινδρικό ποτήρι έχει ακτίνα βάσης ${rSym} ＝ 4 cm και ύψος ${hSym} ＝ 10 cm. Πόσα cm³ νερού χωράει όταν γεμίσει μέχρι πάνω; (π ＝ 3,14)`
        : `A cylindrical drinking glass has base radius ${rSym} ＝ 4 cm and height ${hSym} ＝ 10 cm. How many cm³ of water does it hold when completely full? (π ＝ 3.14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(251.2, locale)} cm³`,
        `${formatNum(50.24, locale)} cm³`,
        `${formatNum(125.6, locale)} cm³`,
        `${formatNum(1004.8, locale)} cm³`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Ακτίνα (${rSym})` : `Radius (${rSym})`, value: '4 cm' },
        { label: isEl ? `Βάση (π · ${rSym}²)` : `Base (π · ${rSym}²)`, value: '3,14 · 16 ＝ 50,24 cm²' },
        { label: isEl ? 'Όγκος (V ＝ Εβ · υ)' : 'Volume (V ＝ Abase · h)', value: `50,24 · 10 ＝ ${formatNum(502.4, locale)} cm³` }
      ],
      explanation: isEl
        ? 'V ＝ π · ρ² · υ ＝ 3,14 · 4 · 4 · 10 ＝ 50,24 · 10 ＝ 502,4 cm³.'
        : 'V ＝ π · r² · h ＝ 3.14 · 4 · 4 · 10 ＝ 50.24 · 10 ＝ 502.4 cm³.'
    };
  },
  // 3. Μεταλλικό κουτί αναψυκτικού
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(339.12, locale)} cm³`;
    const rSym = isEl ? 'ρ' : 'r';
    const hSym = isEl ? 'υ' : 'h';
    return {
      title: isEl ? 'ΚΟΥΤΙ ΑΝΑΨΥΚΤΙΚΟΥ' : 'SODA CAN',
      prompt: isEl
        ? `Ένα κυλινδρικό κουτί αναψυκτικού έχει ακτίνα βάσης ${rSym} ＝ 3 cm και ύψος ${hSym} ＝ 12 cm. Πόσο είναι το μέγεθος του όγκου του σε cm³; (π ＝ 3,14)`
        : `A cylindrical soda can has base radius ${rSym} ＝ 3 cm and height ${hSym} ＝ 12 cm. What is its volume in cm³? (π ＝ 3.14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(226.08, locale)} cm³`,
        `${formatNum(113.04, locale)} cm³`,
        `${formatNum(678.24, locale)} cm³`,
        `${formatNum(300, locale)} cm³`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Ακτίνα (${rSym})` : `Radius (${rSym})`, value: '3 cm' },
        { label: isEl ? `Βάση (π · ${rSym}²)` : `Base (π · ${rSym}²)`, value: '3,14 · 9 ＝ 28,26 cm²' },
        { label: isEl ? 'Όγκος' : 'Volume', value: `28,26 · 12 ＝ ${formatNum(339.12, locale)} cm³` }
      ],
      explanation: isEl
        ? 'V ＝ 3,14 · 3 · 3 · 12 ＝ 28,26 · 12 ＝ 339,12 cm³.'
        : 'V ＝ 3.14 · 3 · 3 · 12 ＝ 28.26 · 12 ＝ 339.12 cm³.'
    };
  },
  // 4. Κυλινδρικό κερί
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(1570, locale)} cm³`;
    const rSym = isEl ? 'ρ' : 'r';
    const hSym = isEl ? 'υ' : 'h';
    return {
      title: isEl ? 'ΟΓΚΟΣ ΚΥΛΙΝΔΡΙΚΟΥ ΚΕΡΙΟΥ' : 'CYLINDRICAL CANDLE VOLUME',
      prompt: isEl
        ? `Ένα κυλινδρικό κερί έχει ακτίνα βάσης ${rSym} ＝ 5 cm και ύψος ${hSym} ＝ 20 cm. Πόσα cm³ παραφίνης χρειάστηκαν για να κατασκευαστεί; (π ＝ 3,14)`
        : `A cylindrical candle has base radius ${rSym} ＝ 5 cm and height ${hSym} ＝ 20 cm. How many cm³ of wax were needed to make it? (π ＝ 3.14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(785, locale)} cm³`,
        `${formatNum(3140, locale)} cm³`,
        `${formatNum(628, locale)} cm³`,
        `${formatNum(1256, locale)} cm³`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Ακτίνα' : 'Radius', value: '5 cm' },
        { label: isEl ? 'Βάση' : 'Base', value: '3,14 · 25 ＝ 78,5 cm²' },
        { label: isEl ? 'Όγκος' : 'Volume', value: `78,5 · 20 ＝ ${formatNum(1570, locale)} cm³` }
      ],
      explanation: isEl
        ? '3,14 · 25 · 20 ＝ 1.570 cm³.'
        : '3.14 · 25 · 20 ＝ 1,570 cm³.'
    };
  }
];

// POOL ΓΙΑ Q10: Όγκος Κυλίνδρου όταν Δίνεται η Διάμετρος δ (ρ ＝ δ : 2)
const PROBLEM_POOL_Q10 = [
  // 1. Κυλινδρικό βαρέλι με διάμετρο
  (locale) => {
    const isEl = locale === 'el';
    const vol = 3.14 * 100 * 30; // 9420 cm³
    const correct = `${formatNum(vol, locale)} cm³`;
    const dSym = isEl ? 'δ' : 'd';
    const hSym = isEl ? 'υ' : 'h';
    const rSym = isEl ? 'ρ' : 'r';
    return {
      title: isEl ? 'ΚΥΛΙΝΔΡΙΚΟ ΒΑΡΕΛΙ ΜΕ ΔΙΑΜΕΤΡΟ' : 'CYLINDER BARREL WITH DIAMETER',
      prompt: isEl
        ? `Ένα κυλινδρικό βαρέλι έχει διάμετρο βάσης ${dSym} ＝ 20 cm και ύψος ${hSym} ＝ 30 cm. Πόσα cm³ είναι ο όγκος του; (π ＝ 3,14)`
        : `A cylindrical barrel has base diameter ${dSym} ＝ 20 cm and height ${hSym} ＝ 30 cm. What is its volume in cm³? (π ＝ 3.14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(vol / 4, locale)} cm³`,
        `${formatNum(vol / 2, locale)} cm³`,
        `${formatNum(1884, locale)} cm³`,
        `${formatNum(6000, locale)} cm³`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Διάμετρος (${dSym})` : `Diameter (${dSym})`, value: '20 cm' },
        { label: isEl ? `Ακτίνα (${rSym} ＝ ${dSym} : 2)` : `Radius (${rSym} ＝ ${dSym} : 2)`, value: '20 : 2 ＝ 10 cm' },
        { label: isEl ? `Βάση (π · ${rSym}²)` : `Base (π · ${rSym}²)`, value: '3,14 · 10 · 10 ＝ 314 cm²' },
        { label: isEl ? 'Όγκος' : 'Volume', value: `314 · 30 ＝ ${formatNum(vol, locale)} cm³` }
      ],
      explanation: isEl
        ? 'Βρίσκουμε πρώτα την ακτίνα: ρ ＝ 20 : 2 ＝ 10 cm. Όγκος: V ＝ 3,14 · 10 · 10 · 30 ＝ 9.420 cm³.'
        : 'First find radius: r ＝ 20 : 2 ＝ 10 cm. Volume: V ＝ 3.14 · 10 · 10 · 30 ＝ 9,420 cm³.'
    };
  },
  // 2. Μεταλλικός κύλινδρος με διάμετρο 12 cm
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(1130.4, locale)} cm³`;
    const dSym = isEl ? 'δ' : 'd';
    const hSym = isEl ? 'υ' : 'h';
    return {
      title: isEl ? 'ΜΕΤΑΛΛΙΚΟΣ ΚΥΛΙΝΔΡΟΣ' : 'METAL CYLINDER',
      prompt: isEl
        ? `Ένας μεταλλικός κύλινδρος έχει διάμετρο ${dSym} ＝ 12 cm και ύψος ${hSym} ＝ 10 cm. Ποιος είναι ο όγκος του σε cm³; (π ＝ 3,14)`
        : `A metal cylinder has diameter ${dSym} ＝ 12 cm and height ${hSym} ＝ 10 cm. What is its volume in cm³? (π ＝ 3.14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(4521.6, locale)} cm³`,
        `${formatNum(565.2, locale)} cm³`,
        `${formatNum(376.8, locale)} cm³`,
        `${formatNum(1200, locale)} cm³`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Ακτίνα (ρ ＝ δ : 2)' : 'Radius (r ＝ d : 2)', value: '12 : 2 ＝ 6 cm' },
        { label: isEl ? 'Βάση (π · ρ²)' : 'Base (π · r²)', value: '3,14 · 36 ＝ 113,04 cm²' },
        { label: isEl ? 'Όγκος' : 'Volume', value: `113,04 · 10 ＝ ${formatNum(1130.4, locale)} cm³` }
      ],
      explanation: isEl
        ? 'ρ ＝ 6 cm. V ＝ 3,14 · 6 · 6 · 10 ＝ 1.130,4 cm³.'
        : 'r ＝ 6 cm. V ＝ 3.14 · 6 · 6 · 10 ＝ 1,130.4 cm³.'
    };
  },
  // 3. Σιλό δημητριακών
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(125.6, locale)} m³`;
    const dSym = isEl ? 'δ' : 'd';
    const hSym = isEl ? 'υ' : 'h';
    return {
      title: isEl ? 'ΚΥΛΙΝΔΡΙΚΟ ΣΙΛΟ' : 'GRAIN SILO',
      prompt: isEl
        ? `Ένα σιλό αποθήκευσης σιτηρών έχει διάμετρο ${dSym} ＝ 4 m και ύψος ${hSym} ＝ 10 m. Πόσα m³ σιτηρών χωράει; (π ＝ 3,14)`
        : `A grain silo has base diameter ${dSym} ＝ 4 m and height ${hSym} ＝ 10 m. How many m³ of grain does it hold? (π ＝ 3.14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(502.4, locale)} m³`,
        `${formatNum(62.8, locale)} m³`,
        `${formatNum(120, locale)} m³`,
        `${formatNum(251.2, locale)} m³`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Διάμετρος (δ)' : 'Diameter (d)', value: '4 m' },
        { label: isEl ? 'Ακτίνα (ρ)' : 'Radius (r)', value: '4 : 2 ＝ 2 m' },
        { label: isEl ? 'Όγκος (V ＝ π · ρ² · υ)' : 'Volume (V ＝ π · r² · h)', value: `3,14 · 4 · 10 ＝ ${formatNum(125.6, locale)} m³` }
      ],
      explanation: isEl
        ? 'ρ ＝ 2 m. V ＝ 3,14 · 2 · 2 · 10 ＝ 125,6 m³.'
        : 'r ＝ 2 m. V ＝ 3.14 · 2 · 2 · 10 ＝ 125.6 m³.'
    };
  }
];

// POOL ΓΙΑ Q11: Μετατροπή Όγκου Κυλίνδρου σε Λίτρα (1 dm³ ＝ 1 L)
const PROBLEM_POOL_Q11 = [
  // 1. Boiler θερμοσίφωνα
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(196.25, locale)} L`;
    const rSym = isEl ? 'ρ' : 'r';
    const hSym = isEl ? 'υ' : 'h';
    return {
      title: isEl ? 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΘΕΡΜΟΣΙΦΩΝΑ' : 'WATER HEATER CAPACITY',
      prompt: isEl
        ? `Το κυλινδρικό δοχείο ενός ηλιακού θερμοσίφωνα έχει ακτίνα βάσης ${rSym} ＝ 2,5 dm και μήκος ${hSym} ＝ 10 dm. Πόσα λίτρα (L) νερού χωράει; (π ＝ 3,14)`
        : `The cylindrical tank of a solar water heater has base radius ${rSym} ＝ 2.5 dm and length ${hSym} ＝ 10 dm. How many liters (L) of water does it hold? (π ＝ 3.14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(19.625, locale)} L`,
        `${formatNum(1962.5, locale)} L`,
        `${formatNum(392.5, locale)} L`,
        `${formatNum(78.5, locale)} L`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Ακτίνα σε dm' : 'Radius in dm', value: '2,5 dm' },
        { label: isEl ? 'Ύψος σε dm' : 'Height in dm', value: '10 dm' },
        { label: isEl ? 'Όγκος σε dm³' : 'Volume in dm³', value: `3,14 · 2,5 · 2,5 · 10 ＝ ${formatNum(196.25, locale)} dm³` },
        { label: isEl ? 'Χωρητικότητα (1 dm³ ＝ 1 L)' : 'Capacity (1 dm³ ＝ 1 L)', value: `${formatNum(196.25, locale)} L` }
      ],
      explanation: isEl
        ? 'V ＝ 3,14 · 2,5 · 2,5 · 10 ＝ 196,25 dm³. Επειδή 1 dm³ ＝ 1 L, ο θερμοσίφωνας χωράει 196,25 L.'
        : 'V ＝ 3.14 · 2.5 · 2.5 · 10 ＝ 196.25 dm³. Since 1 dm³ ＝ 1 L, the water heater holds 196.25 L.'
    };
  },
  // 2. Μεταλλικό βαρέλι 1 m³ σε L
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(3140, locale)} L`;
    return {
      title: isEl ? 'ΚΥΛΙΝΔΡΙΚΗ ΔΕΞΑΜΕΝΗ ΣΕ ΛΙΤΡΑ' : 'CYLINDRICAL TANK IN LITERS',
      prompt: isEl
        ? 'Μια κυλινδρική δεξαμενή έχει ακτίνα βάσης 1 m και ύψος 1 m. Πόσα λίτρα (L) νερού περιέχει όταν είναι γεμάτη; (π ＝ 3,14)'
        : 'A cylindrical tank has base radius 1 m and height 1 m. How many liters (L) of water does it hold when completely full? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(314, locale)} L`,
        `${formatNum(31400, locale)} L`,
        `${formatNum(3.14, locale)} L`,
        `${formatNum(1570, locale)} L`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Όγκος σε m³' : 'Volume in m³', value: '3,14 · 1 · 1 · 1 ＝ 3,14 m³' },
        { label: isEl ? 'Σχέση m³ με λίτρα' : 'Relation m³ to liters', value: '1 m³ ＝ 1.000 L' },
        { label: isEl ? 'Χωρητικότητα' : 'Capacity', value: `3,14 · 1.000 ＝ ${formatNum(3140, locale)} L` }
      ],
      explanation: isEl
        ? 'V ＝ 3,14 m³. 3,14 · 1.000 ＝ 3.140 L.'
        : 'V ＝ 3.14 m³. 3.14 · 1,000 ＝ 3,140 L.'
    };
  },
  // 3. Κυλινδρική κανάτα νερού
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(1.57, locale)} L`;
    return {
      title: isEl ? 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΚΑΝΑΤΑΣ' : 'PITCHER CAPACITY',
      prompt: isEl
        ? 'Μια κυλινδρική κανάτα έχει ακτίνα βάσης 5 cm και ύψος 20 cm. Πόσα λίτρα (L) χυμού χωράει; (π ＝ 3,14)'
        : 'A cylindrical pitcher has base radius 5 cm and height 20 cm. How many liters (L) of juice does it hold? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(15.7, locale)} L`,
        `${formatNum(0.157, locale)} L`,
        `${formatNum(3.14, locale)} L`,
        `${formatNum(157, locale)} L`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Όγκος σε cm³' : 'Volume in cm³', value: '3,14 · 25 · 20 ＝ 1.570 cm³' },
        { label: isEl ? 'Μετατροπή σε λίτρα (: 1.000)' : 'Convert to liters (: 1,000)', value: `1.570 : 1.000 ＝ ${formatNum(1.57, locale)} L` }
      ],
      explanation: isEl
        ? 'V ＝ 1.570 cm³. Διαιρούμε με το 1.000: 1.570 : 1.000 ＝ 1,57 L.'
        : 'V ＝ 1,570 cm³. Divide by 1,000: 1,570 : 1,000 ＝ 1.57 L.'
    };
  }
];

// POOL ΓΙΑ Q12: Αντίστροφο Πρόβλημα Κυλίνδρου [υ ＝ V : (π · ρ²)] & Μεταβολές
const PROBLEM_POOL_Q12 = [
  // 1. Εύρεση ύψους κυλίνδρου
  (locale) => {
    const isEl = locale === 'el';
    const correct = '8 cm';
    const hSym = isEl ? 'υ' : 'h';
    return {
      title: isEl ? 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΚΥΛΙΝΔΡΟΥ' : 'FINDING CYLINDER HEIGHT',
      prompt: isEl
        ? 'Ένα κυλινδρικό δοχείο έχει όγκο 2.512 cm³ και ακτίνα βάσης 10 cm. Πόσο είναι το ύψος (το βάθος) του δοχείου; (π ＝ 3,14)'
        : 'A cylindrical vessel has volume 2,512 cm³ and base radius 10 cm. What is the height (depth) of the vessel? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => ['10 cm', '6 cm', '12 cm', '5 cm']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Όγκος (V)' : 'Volume (V)', value: '2.512 cm³' },
        { label: isEl ? 'Εμβαδόν βάσης (Εβ)' : 'Base area (Abase)', value: '3,14 · 10 · 10 ＝ 314 cm²' },
        { label: isEl ? 'Τύπος ύψους' : 'Height formula', value: `${hSym} ＝ V : Εβ` },
        { label: isEl ? 'Πράξη' : 'Calculation', value: '2.512 : 314 ＝ 8 cm' }
      ],
      explanation: isEl
        ? 'Βρίσκουμε το εμβαδόν της βάσης: 3,14 · 100 ＝ 314 cm². Ύψος: υ ＝ V : Εβ ＝ 2.512 : 314 ＝ 8 cm.'
        : 'Compute base area: 3.14 · 100 ＝ 314 cm². Height: h ＝ V : Abase ＝ 2,512 : 314 ＝ 8 cm.'
    };
  },
  // 2. Εύρεση ύψους με όγκο 628 cm³ και ακτίνα 5 cm
  (locale) => {
    const isEl = locale === 'el';
    const correct = '8 cm';
    return {
      title: isEl ? 'ΥΨΟΣ ΑΠΟ ΤΟΝ ΟΓΚΟ' : 'HEIGHT FROM VOLUME',
      prompt: isEl
        ? 'Σε έναν κύλινδρο ο όγκος είναι 628 cm³ και η ακτίνα βάσης είναι 5 cm. Πόσο είναι το ύψος του; (π ＝ 3,14)'
        : 'In a cylinder, the volume is 628 cm³ and the base radius is 5 cm. What is its height? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => ['10 cm', '6 cm', '12 cm', '4 cm']),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Εμβαδόν βάσης' : 'Base area', value: '3,14 · 25 ＝ 78,5 cm²' },
        { label: isEl ? 'Ύψος' : 'Height', value: '628 : 78,5 ＝ 8 cm' }
      ],
      explanation: isEl
        ? '628 : (3,14 · 25) ＝ 628 : 78,5 ＝ 8 cm.'
        : '628 : (3.14 · 25) ＝ 628 : 78.5 ＝ 8 cm.'
    };
  },
  // 3. Διπλασιασμός ακτίνας κυλίνδρου (όγκος επί 4)
  (locale) => {
    const isEl = locale === 'el';
    const correct = isEl
      ? 'Ο όγκος γίνεται 4 φορές μεγαλύτερος (τετραπλασιάζεται)'
      : 'The volume becomes 4 times larger (quadruples)';
    const rSym = isEl ? 'ρ' : 'r';
    const hSym = isEl ? 'υ' : 'h';
    return {
      title: isEl ? 'ΔΙΠΛΑΣΙΑΣΜΟΣ ΑΚΤΙΝΑΣ ΚΥΛΙΝΔΡΟΥ' : 'DOUBLING CYLINDER RADIUS',
      prompt: isEl
        ? `Αν σε έναν κύλινδρο διπλασιάσουμε την ακτίνα της βάσης του (από ${rSym} σε 2${rSym}) διατηρώντας το ύψος σταθερό, πώς θα αλλάξει ο όγκος του;`
        : `If we double the base radius of a cylinder (from ${rSym} to 2${rSym}) keeping height constant, how does its volume change?`,
      options: ensureFourUniqueOptions(correct, () => [
        isEl ? 'Ο όγκος διπλασιάζεται' : 'The volume doubles',
        isEl ? 'Ο όγκος παραμένει ίδιος' : 'The volume remains the same',
        isEl ? 'Ο όγκος γίνεται 8 φορές μεγαλύτερος' : 'The volume becomes 8 times larger'
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Αρχικός όγκος' : 'Initial volume', value: `V₁ ＝ π · ${rSym}² · ${hSym}` },
        { label: isEl ? 'Νέος όγκος' : 'New volume', value: `V₂ ＝ π · (2${rSym})² · ${hSym} ＝ π · 4${rSym}² · ${hSym} ＝ 4 · V₁` }
      ],
      explanation: isEl
        ? `Επειδή η ακτίνα είναι στο τετράγωνο (${rSym}²), ο διπλασιασμός της ακτίνας τετραπλασιάζει τον όγκο (2 · 2 ＝ 4).`
        : `Because radius is squared (${rSym}²), doubling the radius quadruples the volume (2 · 2 ＝ 4).`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet(locale = 'el') {
  const isEl = locale === 'el';
  const rSym = isEl ? 'ρ' : 'r';
  const hSym = isEl ? 'υ' : 'h';
  const dSym = isEl ? 'δ' : 'd';
  const qs = [];

  // Q1: Τύπος όγκου κυλίνδρου (Boolean)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: isEl ? 'ΤΥΠΟΣ ΟΓΚΟΥ ΚΥΛΙΝΔΡΟΥ' : 'CYLINDER VOLUME FORMULA',
    prompt: isEl
      ? (isQ1True
          ? `Ο όγκος του κυλίνδρου υπολογίζεται πολλαπλασιάζοντας το εμβαδόν της βάσης του επί το ύψος: V ＝ π · ${rSym}² · ${hSym}.`
          : `Ο όγκος του κυλίνδρου υπολογίζεται με τον τύπο V ＝ 2 · π · ${rSym} · ${hSym}.`)
      : (isQ1True
          ? `The volume of a cylinder is computed by multiplying its base area by height: V ＝ π · ${rSym}² · ${hSym}.`
          : `The volume of a cylinder is calculated with the formula V ＝ 2 · π · ${rSym} · ${hSym}.`),
    correctAnswer: isQ1True,
    tableData: [
      { label: isEl ? 'Τύπος Όγκου' : 'Volume Formula', value: `V ＝ π · ${rSym}² · ${hSym} (${isEl ? 'χώρος σε cm³, m³' : 'space in cm³, m³'})` },
      { label: isEl ? 'Τύπος Παράπλευρης' : 'Lateral Area Formula', value: `Επ ＝ (2 · π · ${rSym}) · ${hSym} (${isEl ? 'επιφάνεια σε cm², m²' : 'area in cm², m²'})` }
    ],
    explanation: isEl
      ? (isQ1True
          ? `Ο όγκος του κυλίνδρου ισούται πράγματι με το εμβαδόν βάσης επί το ύψος: V ＝ π · ${rSym}² · ${hSym}.`
          : `Ο τύπος (2 · π · ${rSym}) · ${hSym} δίνει την παράπλευρη επιφάνεια (εμβαδόν). Ο όγκος δίνεται από τον τύπο V ＝ π · ${rSym}² · ${hSym}.`)
      : (isQ1True
          ? `Cylinder volume equals base area multiplied by height: V ＝ π · ${rSym}² · ${hSym}.`
          : `The formula (2 · π · ${rSym}) · ${hSym} gives lateral surface area. Volume is given by V ＝ π · ${rSym}² · ${hSym}.`)
  });

  // Q2: Εμβαδόν βάσης επί ύψος (MCQ)
  const q2Correct = isEl
    ? `V ＝ Εμβαδόν Βάσης · Ύψος (V ＝ Εβ · ${hSym})`
    : `V ＝ Base Area · Height (V ＝ Abase · ${hSym})`;
  qs.push({
    id: 2,
    type: 'mcq',
    title: isEl ? 'ΕΜΒΑΔΟΝ ΒΑΣΗΣ ΚΑΙ ΟΓΚΟΣ' : 'BASE AREA AND VOLUME',
    prompt: isEl
      ? 'Ποια σχέση συνδέει τον όγκο (V) ενός κυλίνδρου με το εμβαδόν της κυκλικής βάσης του (Εβ);'
      : 'Which formula connects the volume (V) of a cylinder with its circular base area (Abase)?',
    options: ensureFourUniqueOptions(q2Correct, () => [
      isEl ? `V ＝ Εμβαδόν Βάσης : Ύψος` : `V ＝ Base Area : Height`,
      isEl ? `V ＝ (Εμβαδόν Βάσης · Ύψος) : 2` : `V ＝ (Base Area · Height) : 2`,
      isEl ? `V ＝ 2 · Εμβαδόν Βάσης · Ύψος` : `V ＝ 2 · Base Area · Height`
    ]),
    correctAnswer: q2Correct,
    tableData: [
      { label: isEl ? 'Εμβαδόν βάσης' : 'Base area', value: `Εβ ＝ π · ${rSym}²` },
      { label: isEl ? 'Όγκος κυλίνδρου' : 'Cylinder volume', value: `V ＝ Εβ · ${hSym} ＝ π · ${rSym}² · ${hSym}` }
    ],
    explanation: isEl
      ? `Όπως σε όλα τα πρίσματα, ο όγκος είναι εμβαδόν βάσης επί ύψος: V ＝ Εβ · ${hSym}.`
      : `As in all prisms, volume equals base area times height: V ＝ Abase · ${hSym}.`
  });

  // Q3: Υπολογισμός από τη διάμετρο (MCQ)
  const q3Correct = isEl
    ? `Να διαιρέσουμε τη διάμετρο με το 2 για να βρούμε την ακτίνα: ${rSym} ＝ ${dSym} : 2`
    : `Divide diameter by 2 to find radius: ${rSym} ＝ ${dSym} : 2`;
  qs.push({
    id: 3,
    type: 'mcq',
    title: isEl ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΜΕ ΔΙΑΜΕΤΡΟ' : 'CALCULATION WITH DIAMETER',
    prompt: isEl
      ? `Αν σε ένα πρόβλημα κυλίνδρου δίνεται η διάμετρος (${dSym}) της βάσης, τι πρέπει να κάνουμε πρώτα για να βρούμε τον όγκο;`
      : `If a problem gives the base diameter (${dSym}) of a cylinder, what must we do first to find its volume?`,
    options: ensureFourUniqueOptions(q3Correct, () => [
      isEl ? `Να βάλουμε απευθείας τη διάμετρο στον τύπο: 3,14 · ${dSym} · ${dSym} · ${hSym}` : `Plug diameter directly into formula: 3.14 · ${dSym} · ${dSym} · ${hSym}`,
      isEl ? 'Να πολλαπλασιάσουμε τη διάμετρο με το 2' : 'Multiply diameter by 2',
      isEl ? 'Να προσθέσουμε τη διάμετρο στο ύψος' : 'Add diameter to height'
    ]),
    correctAnswer: q3Correct,
    tableData: [
      { label: isEl ? 'Σχέση' : 'Relation', value: `${dSym} ＝ 2 · ${rSym}, άρα ${rSym} ＝ ${dSym} : 2` },
      { label: isEl ? 'Βήμα' : 'Procedure', value: `Πρώτα βρίσκουμε την ακτίνα ${rSym} και μετά εφαρμόζουμε το π · ${rSym}² · ${hSym}` }
    ],
    explanation: isEl
      ? `Ο τύπος του όγκου απαιτεί την ακτίνα ${rSym} (και όχι τη διάμετρο), επομένως διαιρούμε πάντοτε πρώτα τη διάμετρο διά 2.`
      : `The volume formula requires radius ${rSym} (not diameter), so we always divide diameter by 2 first.`
  });

  // Q4: Οπτική αναγνώριση διαστάσεων κυλίνδρου (SVG - No Giveaway)
  const q4Correct = isEl
    ? `Η ακτίνα της βάσης (${rSym}) και το ύψος (${hSym})`
    : `The base radius (${rSym}) and height (${hSym})`;
  qs.push({
    id: 4,
    type: 'mcq',
    title: isEl ? 'ΑΝΑΓΝΩΡΙΣΗ ΣΤΟΙΧΕΙΩΝ ΚΥΛΙΝΔΡΟΥ' : 'IDENTIFYING CYLINDER ELEMENTS',
    prompt: isEl
      ? 'Παρατηρήστε τον παρακάτω κύλινδρο. Ποιες διαστάσεις χρειάζονται για τον υπολογισμό του όγκου του;'
      : 'Observe the cylinder below. Which dimensions are needed to calculate its volume?',
    svg: (
      <svg viewBox="0 0 160 120" className="w-full max-w-[160px] h-auto mx-auto my-2 select-none drop-shadow-sm">
        <rect x="50" y="30" width="60" height="60" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
        <ellipse cx="80" cy="90" rx="30" ry="10" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="1.5" />
        <ellipse cx="80" cy="30" rx="30" ry="10" fill="#a5b4fc" stroke="#4f46e5" strokeWidth="1.5" />
        <line x1="80" y1="30" x2="110" y2="30" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="80" cy="30" r="2.5" fill="#ffffff" />
        <text x="95" y="24" fill="#f59e0b" fontSize="10" fontWeight="bold">{rSym}</text>
        <line x1="120" y1="30" x2="120" y2="90" stroke="#4f46e5" strokeWidth="1.5" />
        <text x="130" y="64" fill="#4f46e5" fontSize="11" fontWeight="bold">{hSym}</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => [
      isEl ? 'Μόνο το ύψος του κυλίνδρου' : 'Only the cylinder height',
      isEl ? 'Μόνο η περίμετρος της βάσης' : 'Only the base perimeter',
      isEl ? 'Το εμβαδόν του αναπτύγματος' : 'The net surface area'
    ]),
    correctAnswer: q4Correct,
    tableData: [
      { label: isEl ? 'Στοιχεία' : 'Elements', value: isEl ? `Ακτίνα βάσης (${rSym}) και Ύψος (${hSym})` : `Base radius (${rSym}) and Height (${hSym})` },
      { label: isEl ? 'Τύπος' : 'Formula', value: `V ＝ π · ${rSym}² · ${hSym}` }
    ],
    explanation: isEl
      ? `Για τον όγκο χρειαζόμαστε την ακτίνα ${rSym} (για να βρούμε το εμβαδόν βάσης π · ${rSym}²) και το ύψος ${hSym}.`
      : `For volume we need radius ${rSym} (to determine base area π · ${rSym}²) and height ${hSym}.`
  });

  // Q5: Υπολογισμός όγκου με ρ = 10 cm και υ = 5 cm (Input)
  qs.push({
    id: 5,
    type: 'input',
    title: isEl ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΟΓΚΟΥ ΚΥΛΙΝΔΡΟΥ' : 'CYLINDER VOLUME CALCULATION',
    prompt: isEl
      ? `Ένας κύλινδρος έχει ακτίνα βάσης ${rSym} ＝ 10 cm και ύψος ${hSym} ＝ 5 cm. Πόσα cm³ είναι ο όγκος του; (π ＝ 3,14 - Γράψτε μόνο τον αριθμό)`
      : `A cylinder has base radius ${rSym} ＝ 10 cm and height ${hSym} ＝ 5 cm. What is its volume in cm³? (π ＝ 3.14 - Enter number only)`,
    correctAnswer: '1570',
    tableData: [
      { label: isEl ? `Βάση (π · ${rSym}²)` : `Base (π · ${rSym}²)`, value: '3,14 · 10 · 10 ＝ 314 cm²' },
      { label: isEl ? `Ύψος (${hSym})` : `Height (${hSym})`, value: '5 cm' },
      { label: isEl ? 'Όγκος (Εβ · υ)' : 'Volume (Abase · h)', value: '314 · 5 ＝ 1.570 cm³' }
    ],
    explanation: isEl ? 'V ＝ 3,14 · 10 · 10 · 5 ＝ 314 · 5 ＝ 1.570 cm³.' : 'V ＝ 3.14 · 10 · 10 · 5 ＝ 314 · 5 ＝ 1,570 cm³.'
  });

  // Q6: Μετατροπή dm³ σε λίτρα (Input)
  qs.push({
    id: 6,
    type: 'input',
    title: isEl ? 'ΜΕΤΑΤΡΟΠΗ DM³ ΣΕ ΛΙΤΡΑ' : 'CONVERT DM³ TO LITERS',
    prompt: isEl
      ? 'Ένα κυλινδρικό δοχείο έχει όγκο 45 dm³. Πόσα λίτρα (L) νερού χωράει; (Γράψτε μόνο τον αριθμό)'
      : 'A cylindrical container has volume 45 dm³. How many liters (L) of water does it hold? (Enter number only)',
    correctAnswer: '45',
    tableData: [
      { label: isEl ? 'Όγκος σε dm³' : 'Volume in dm³', value: '45 dm³' },
      { label: isEl ? 'Ισοδυναμία' : 'Equivalence', value: '1 dm³ ＝ 1 L' },
      { label: isEl ? 'Χωρητικότητα' : 'Capacity', value: '45 L' }
    ],
    explanation: isEl
      ? 'Επειδή 1 dm³ ισούται ακριβώς με 1 λίτρο, τα 45 dm³ αντιστοιχούν σε 45 L.'
      : 'Because 1 dm³ equals exactly 1 liter, 45 dm³ equals 45 L.'
  });

  // Q7: Πόσα λίτρα έχει 1 m³ (MCQ)
  const q7Correct = isEl ? '1.000 Λίτρα' : '1,000 Liters';
  qs.push({
    id: 7,
    type: 'mcq',
    title: isEl ? 'ΣΧΕΣΗ ΚΥΒΙΚΟΥ ΜΕΤΡΟΥ ΚΑΙ ΛΙΤΡΩΝ' : 'CUBIC METER TO LITERS',
    prompt: isEl
      ? 'Μια κυλινδρική δεξαμενή έχει όγκο 1 m³. Πόσα λίτρα (L) νερού χωράει όταν γεμίσει;'
      : 'A cylindrical tank has volume 1 m³. How many liters (L) of water does it hold when full?',
    options: ensureFourUniqueOptions(q7Correct, () => [
      isEl ? '100 Λίτρα' : '100 Liters',
      isEl ? '10 Λίτρα' : '10 Liters',
      isEl ? '10.000 Λίτρα' : '10,000 Liters'
    ]),
    correctAnswer: q7Correct,
    tableData: [
      { label: isEl ? '1 m³ σε dm³' : '1 m³ in dm³', value: '1.000 dm³' },
      { label: isEl ? '1 dm³ σε λίτρα' : '1 dm³ in liters', value: '1 L' },
      { label: isEl ? '1 m³ σε λίτρα' : '1 m³ in liters', value: '1.000 L' }
    ],
    explanation: isEl ? '1 m³ ＝ 1.000 dm³ ＝ 1.000 L.' : '1 m³ ＝ 1,000 dm³ ＝ 1,000 L.'
  });

  // Q8: Εύρεση ύψους από τον όγκο (MCQ)
  const q8Correct = isEl
    ? 'υ ＝ Όγκος : Εμβαδόν Βάσης'
    : 'h ＝ Volume : Base Area';
  qs.push({
    id: 8,
    type: 'mcq',
    title: isEl ? 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΑΠΟ ΤΟΝ ΟΓΚΟ' : 'HEIGHT FROM VOLUME',
    prompt: isEl
      ? 'Αν γνωρίζουμε τον όγκο (V) ενός κυλίνδρου και το εμβαδόν της βάσης του (Εβ), πώς υπολογίζουμε το ύψος του;'
      : 'If we know the volume (V) of a cylinder and its base area (Abase), how do we compute height?',
    options: ensureFourUniqueOptions(q8Correct, () => [
      isEl ? `${hSym} ＝ Όγκος · Εμβαδόν Βάσης` : `${hSym} ＝ Volume · Base Area`,
      isEl ? `${hSym} ＝ (Όγκος · Εμβαδόν Βάσης) : 2` : `${hSym} ＝ (Volume · Base Area) : 2`,
      isEl ? `${hSym} ＝ Όγκος ＋ Εμβαδόν Βάσης` : `${hSym} ＝ Volume ＋ Base Area`
    ]),
    correctAnswer: q8Correct,
    tableData: [
      { label: isEl ? 'Τύπος' : 'Formula', value: isEl ? `V ＝ Εβ · ${hSym}, άρα ${hSym} ＝ V : Εβ` : `V ＝ Abase · ${hSym}, so ${hSym} ＝ V : Abase` }
    ],
    explanation: isEl
      ? `Διαιρούμε τον όγκο με το εμβαδόν της βάσης: ${hSym} ＝ V : Εβ.`
      : `Divide volume by base area: ${hSym} ＝ V : Abase.`
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

export default function OgkosKilindrouAskiseisPage() {
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
      ? "Ασκήσεις: Όγκος Κυλίνδρου & Χωρητικότητα σε Λίτρα - ΣΤ' Δημοτικού | LearnMaths.gr"
      : "Exercises: Cylinder Volume & Capacity in Liters - 6th Grade | LearnMaths.gr",
    metaDesc: isEl
      ? "Διαδραστικές ασκήσεις στον υπολογισμό όγκου κυλίνδρου (V ＝ π · ρ² · υ), ακτίνα, διάμετρο, εύρεση ύψους και λίτρα για τη ΣΤ' Δημοτικού."
      : "Interactive exercises on cylinder volume (V ＝ π · r² · h), radius, diameter, finding height, and liters for 6th Grade.",
    backText: isEl ? "Θεωρία Κεφ. 82" : "Theory Ch. 82",
    actionTheory: isEl ? "📖 Θεωρία" : "📖 Theory",
    chapterBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 82 • ΣΤ' ΔΗΜΟΤΙΚΟΥ" : "EXERCISES • CHAPTER 82 • 6TH GRADE",
    heroTitle: isEl ? "Ασκήσεις: Όγκος Κυλίνδρου και Χωρητικότητα" : "Exercises: Cylinder Volume and Capacity",
    heroDesc: isEl
      ? "Εξασκηθείτε στον υπολογισμό όγκου κυλίνδρου με τον τύπο V ＝ π · ρ² · υ, στη χρήση της διαμέτρου, στην εύρεση ύψους και στις μετατροπές σε λίτρα (L) μέσα από 12 δυναμικές ερωτήσεις."
      : "Practice cylinder volume with V ＝ π · r² · h, diameter usage, finding height, and converting to liters (L) across 12 dynamic questions.",
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
      backUrl="/st-dimotikou/82-ogkos-kilindrou"
      backText={ui.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/82-ogkos-kilindrou"
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
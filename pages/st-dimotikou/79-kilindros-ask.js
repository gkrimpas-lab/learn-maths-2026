// pages/st-dimotikou/79-kilindros-ask.js
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
      const generatedNum = offset % 2 === 1 
        ? baseNum + Math.ceil(offset / 2) * 5 
        : Math.max(1, baseNum - Math.ceil(offset / 2) * 5);
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

// POOL ΓΙΑ Q9: Παράπλευρη Επιφάνεια Κυλίνδρου [Επ ＝ (2 · π · ρ) · υ]
const PROBLEM_POOL_Q9 = [
  // 1. Ετικέτα κονσέρβας με δοσμένη διάμετρο
  (locale) => {
    const isEl = locale === 'el';
    const r = randInt(3, 6);
    const d = 2 * r;
    const h = randInt(10, 15);
    const peri = 2 * 3.14 * r;
    const lat = peri * h;
    const correct = `${formatNum(lat, locale)} cm²`;
    const rSym = isEl ? 'ρ' : 'r';
    const dSym = isEl ? 'δ' : 'd';
    return {
      title: isEl ? 'ΕΤΙΚΕΤΑ ΚΟΝΣΕΡΒΑΣ' : 'CAN LABEL',
      prompt: isEl
        ? `Μια κυλινδρική κονσέρβα έχει διάμετρο βάσης ${d} cm και ύψος ${h} cm. Πόσα cm² χαρτιού χρειάζονται για την περιμετρική ετικέτα της; (π ＝ 3,14)`
        : `A cylindrical can has a base diameter of ${d} cm and height ${h} cm. How many cm² of paper are required for its perimeter label? (π ＝ 3.14)`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(lat + 31.4, locale)} cm²`,
        `${formatNum(lat > 31.4 ? lat - 31.4 : lat + 62.8, locale)} cm²`,
        `${formatNum((3.14 * d * h) / 2, locale)} cm²`,
        `${formatNum(peri, locale)} cm²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Διάμετρος (${dSym})` : `Diameter (${dSym})`, value: `${d} cm` },
        { label: isEl ? `Ακτίνα (${rSym} ＝ ${dSym} : 2)` : `Radius (${rSym} ＝ ${dSym} : 2)`, value: `${d} : 2 ＝ ${r} cm` },
        { label: isEl ? `Μήκος ετικέτας (2 · π · ${rSym})` : `Label length (2 · π · ${rSym})`, value: `2 · 3,14 · ${r} ＝ ${formatNum(peri, locale)} cm` },
        { label: isEl ? 'Παράπλευρη επιφάνεια (Επ)' : 'Lateral surface (Alat)', value: `${formatNum(peri, locale)} · ${h} ＝ ${formatNum(lat, locale)} cm²` }
      ],
      explanation: isEl
        ? `Βρίσκουμε πρώτα την ακτίνα: ${rSym} ＝ ${d} : 2 ＝ ${r} cm. Η περίμετρος της βάσης είναι 2 · 3,14 · ${r} ＝ ${formatNum(peri, locale)} cm. Εμβαδόν ετικέτας: Επ ＝ ${formatNum(peri, locale)} · ${h} ＝ ${formatNum(lat, locale)} cm².`
        : `First find the radius: ${rSym} ＝ ${d} : 2 ＝ ${r} cm. Base perimeter is 2 · 3.14 · ${r} ＝ ${formatNum(peri, locale)} cm. Label area: Alat ＝ ${formatNum(peri, locale)} · ${h} ＝ ${formatNum(lat, locale)} cm².`
    };
  },
  // 2. Βάψιμο κυλινδρικής κολόνας
  (locale) => {
    const isEl = locale === 'el';
    const r = 0.5; // m
    const h = 4; // m
    const peri = 2 * 3.14 * 0.5; // 3.14 m
    const lat = peri * h; // 12.56 m²
    const correct = `${formatNum(lat, locale)} m²`;
    const rSym = isEl ? 'ρ' : 'r';
    const hSym = isEl ? 'υ' : 'h';
    return {
      title: isEl ? 'ΒΑΨΙΜΟ ΚΥΛΙΝΔΡΙΚΗΣ ΚΟΛΟΝΑΣ' : 'PAINTING CYLINDRICAL PILLAR',
      prompt: isEl
        ? 'Μια κυλινδρική κολόνα έχει ακτίνα βάσης 0,5 m και ύψος 4 m. Πόσα τετραγωνικά μέτρα (m²) θα βαφτούν στην πλαϊνή της επιφάνεια; (π ＝ 3,14)'
        : 'A cylindrical pillar has a base radius of 0.5 m and height 4 m. How many square meters (m²) will be painted on its side surface? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(6.28, locale)} m²`,
        `${formatNum(25.12, locale)} m²`,
        `${formatNum(3.14, locale)} m²`,
        `${formatNum(15.7, locale)} m²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? `Ακτίνα (${rSym})` : `Radius (${rSym})`, value: '0,5 m' },
        { label: isEl ? `Περίμετρος βάσης (2 · π · ${rSym})` : `Base perimeter (2 · π · ${rSym})`, value: '2 · 3,14 · 0,5 ＝ 3,14 m' },
        { label: isEl ? 'Παράπλευρη επιφάνεια' : 'Lateral surface', value: `3,14 · 4 ＝ ${formatNum(lat, locale)} m²` }
      ],
      explanation: isEl
        ? `Επ ＝ (2 · π · ${rSym}) · ${hSym} ＝ (2 · 3,14 · 0,5) · 4 ＝ 3,14 · 4 ＝ 12,56 m².`
        : `Alat ＝ (2 · π · ${rSym}) · ${hSym} ＝ (2 · 3.14 · 0.5) · 4 ＝ 3.14 · 4 ＝ 12.56 m².`
    };
  },
  // 3. Μεταλλικός σωλήνας ανοιχτός στα δύο άκρα
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(3140, locale)} cm²`;
    return {
      title: isEl ? 'ΜΕΤΑΛΛΙΚΟΣ ΣΩΛΗΝΑΣ' : 'METAL PIPE',
      prompt: isEl
        ? 'Ένας ανοιχτός κυλινδρικός σωλήνας έχει ακτίνα 10 cm και μήκος (ύψος) 50 cm. Πόσο είναι το εμβαδόν της εξωτερικής παράπλευρης επιφάνειάς του; (π ＝ 3,14)'
        : 'An open cylindrical pipe has radius 10 cm and length (height) 50 cm. What is the area of its outer lateral surface? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(1570, locale)} cm²`,
        `${formatNum(6280, locale)} cm²`,
        `${formatNum(628, locale)} cm²`,
        `${formatNum(314, locale)} cm²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Περίμετρος (2 · π · ρ)' : 'Perimeter (2 · π · r)', value: '2 · 3,14 · 10 ＝ 62,8 cm' },
        { label: isEl ? 'Εμβαδόν σωλήνα' : 'Pipe lateral area', value: `62,8 · 50 ＝ ${formatNum(3140, locale)} cm²` }
      ],
      explanation: isEl
        ? 'Ο σωλήνας είναι ανοιχτός στα άκρα, άρα υπολογίζουμε μόνο την παράπλευρη επιφάνεια: 2 · 3,14 · 10 · 50 ＝ 3.140 cm².'
        : 'The pipe is open at both ends, so we compute strictly the lateral surface: 2 · 3.14 · 10 · 50 ＝ 3,140 cm².'
    };
  },
  // 4. Κύλινδρος με ακτίνα 2 cm και ύψος 10 cm
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(125.6, locale)} cm²`;
    return {
      title: isEl ? 'ΠΑΡΑΠΛΕΥΡΗ ΕΠΙΦΑΝΕΙΑ' : 'LATERAL SURFACE',
      prompt: isEl
        ? 'Πόσο είναι το εμβαδόν της παράπλευρης επιφάνειας ενός κυλίνδρου με ακτίνα βάσης 2 cm και ύψος 10 cm; (π ＝ 3,14)'
        : 'What is the lateral surface area of a cylinder with base radius 2 cm and height 10 cm? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(62.8, locale)} cm²`,
        `${formatNum(251.2, locale)} cm²`,
        `${formatNum(12.56, locale)} cm²`,
        `${formatNum(40, locale)} cm²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Περίμετρος βάσης' : 'Base perimeter', value: '2 · 3,14 · 2 ＝ 12,56 cm' },
        { label: isEl ? 'Παράπλευρη επιφάνεια' : 'Lateral surface', value: `12,56 · 10 ＝ ${formatNum(125.6, locale)} cm²` }
      ],
      explanation: isEl
        ? 'Επ ＝ (2 · π · ρ) · υ ＝ 12,56 · 10 ＝ 125,6 cm².'
        : 'Alat ＝ (2 · π · r) · h ＝ 12.56 · 10 ＝ 125.6 cm².'
    };
  }
];

// POOL ΓΙΑ Q10: Ολική Επιφάνεια Κλειστού Κυλίνδρου [Εολ ＝ Επ ＋ 2 · Εβ]
const PROBLEM_POOL_Q10 = [
  // 1. Μεταλλικό κλειστό βαρέλι
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(18.84, locale)} m²`;
    return {
      title: isEl ? 'ΒΑΨΙΜΟ ΚΛΕΙΣΤΟΥ ΒΑΡΕΛΙΟΥ' : 'PAINTING CLOSED BARREL',
      prompt: isEl
        ? 'Ένα κλειστό μεταλλικό βαρέλι έχει ακτίνα βάσης 1 m και ύψος 2 m. Θέλουμε να βάψουμε ολόκληρη την εξωτερική του επιφάνεια (και τα δύο καπάκια και γύρω-γύρω). Πόσα m² θα βαφτούν; (π ＝ 3,14)'
        : 'A closed metal barrel has base radius 1 m and height 2 m. We want to paint its entire exterior surface (both lids and side). How many m² will be painted? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(12.56, locale)} m²`,
        `${formatNum(15.7, locale)} m²`,
        `${formatNum(6.28, locale)} m²`,
        `${formatNum(21.98, locale)} m²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Παράπλευρη επιφάνεια (Επ)' : 'Lateral surface (Alat)', value: '2 · 3,14 · 1 · 2 ＝ 12,56 m²' },
        { label: isEl ? 'Εμβαδόν 2 βάσεων (2 · Εβ)' : 'Area of 2 bases (2 · Abase)', value: '2 · (3,14 · 1 · 1) ＝ 6,28 m²' },
        { label: isEl ? 'Ολική επιφάνεια (Εολ)' : 'Total surface area (Atot)', value: `12,56 ＋ 6,28 ＝ ${formatNum(18.84, locale)} m²` }
      ],
      explanation: isEl
        ? 'Εολ ＝ Επ ＋ 2 · Εβ ＝ 12,56 ＋ 2 · 3,14 ＝ 12,56 ＋ 6,28 ＝ 18,84 m².'
        : 'Atot ＝ Alat ＋ 2 · Abase ＝ 12.56 ＋ 2 · 3.14 ＝ 12.56 ＋ 6.28 ＝ 18.84 m².'
    };
  },
  // 2. Κλειστό κυλινδρικό κουτί μπισκότων
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(471, locale)} cm²`;
    return {
      title: isEl ? 'ΚΛΕΙΣΤΟ ΚΟΥΤΙ ΜΠΙΣΚΟΤΩΝ' : 'CLOSED BISCUIT TIN',
      prompt: isEl
        ? 'Ένα κυλινδρικό κουτί με καπάκι έχει ακτίνα βάσης 5 cm και ύψος 10 cm. Πόσο λευκοσίδηρο σε cm² χρειάστηκε για την κατασκευή ολόκληρου του κουτιού; (π ＝ 3,14)'
        : 'A cylindrical tin with lid has base radius 5 cm and height 10 cm. How much tinplate in cm² was needed to manufacture the whole container? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(314, locale)} cm²`,
        `${formatNum(392.5, locale)} cm²`,
        `${formatNum(549.5, locale)} cm²`,
        `${formatNum(628, locale)} cm²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Παράπλευρη επιφάνεια' : 'Lateral surface', value: '2 · 3,14 · 5 · 10 ＝ 314 cm²' },
        { label: isEl ? '2 κυκλικές βάσεις' : '2 circular bases', value: '2 · (3,14 · 25) ＝ 157 cm²' },
        { label: isEl ? 'Ολικό εμβαδόν' : 'Total area', value: `314 ＋ 157 ＝ ${formatNum(471, locale)} cm²` }
      ],
      explanation: isEl
        ? 'Εολ ＝ 314 ＋ 157 ＝ 471 cm².'
        : 'Atot ＝ 314 ＋ 157 ＝ 471 cm².'
    };
  },
  // 3. Ισόπλευρος κύλινδρος
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(1256, locale)} cm²`;
    return {
      title: isEl ? 'ΙΣΟΠΛΕΥΡΟΣ ΚΥΛΙΝΔΡΟΣ' : 'EQUILATERAL CYLINDER',
      prompt: isEl
        ? 'Ένας κλειστός κύλινδρος έχει ακτίνα βάσης 10 cm και ύψος 10 cm. Πόσο είναι το ολικό εμβαδόν του αναπτύγματός του; (π ＝ 3,14)'
        : 'A closed cylinder has base radius 10 cm and height 10 cm. What is the total area of its net? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(628, locale)} cm²`,
        `${formatNum(942, locale)} cm²`,
        `${formatNum(1570, locale)} cm²`,
        `${formatNum(314, locale)} cm²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Παράπλευρη επιφάνεια' : 'Lateral surface', value: '628 cm²' },
        { label: isEl ? '2 βάσεις' : '2 bases', value: '628 cm²' },
        { label: isEl ? 'Ολικό εμβαδόν' : 'Total area', value: `628 ＋ 628 ＝ ${formatNum(1256, locale)} cm²` }
      ],
      explanation: isEl
        ? 'Επ ＝ 628 cm², 2 · Εβ ＝ 628 cm². Εολ ＝ 628 ＋ 628 ＝ 1.256 cm².'
        : 'Alat ＝ 628 cm², 2 · Abase ＝ 628 cm². Atot ＝ 628 ＋ 628 ＝ 1,256 cm².'
    };
  }
];

// POOL ΓΙΑ Q11: Ανοιχτά Δοχεία (1 Μόνο Βάση: Εολ ＝ Επ ＋ Εβ)
const PROBLEM_POOL_Q11 = [
  // 1. Κυλινδρικός κουβάς (ανοιχτός από πάνω)
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(1570, locale)} cm²`;
    return {
      title: isEl ? 'ΑΝΟΙΧΤΟΣ ΚΟΥΒΑΣ' : 'OPEN BUCKET',
      prompt: isEl
        ? 'Ένας πλαστικός κυλινδρικός κουβάς είναι ανοιχτός από πάνω (δεν έχει καπάκι). Έχει ακτίνα βάσης 10 cm και ύψος 20 cm. Πόση είναι η συνολική επιφάνεια του πλαστικού; (π ＝ 3,14)'
        : 'A plastic cylindrical bucket is open at the top (no lid). It has base radius 10 cm and height 20 cm. What is the total plastic surface area? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(1256, locale)} cm²`,
        `${formatNum(1884, locale)} cm²`,
        `${formatNum(157, locale)} cm²`,
        `${formatNum(314, locale)} cm²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Παράπλευρη επιφάνεια (Επ)' : 'Lateral surface (Alat)', value: '2 · 3,14 · 10 · 20 ＝ 1.256 cm²' },
        { label: isEl ? 'Εμβαδόν 1 βάσης (πάτος)' : '1 base area (bottom)', value: '3,14 · 10 · 10 ＝ 314 cm²' },
        { label: isEl ? 'Σύνολο (χωρίς καπάκι)' : 'Total (no lid)', value: `1.256 ＋ 314 ＝ ${formatNum(1570, locale)} cm²` }
      ],
      explanation: isEl
        ? 'Επειδή ο κουβάς είναι ανοιχτός από πάνω, προσθέτουμε μόνο 1 βάση (τον πάτο): Εολ ＝ Επ ＋ Εβ ＝ 1.256 ＋ 314 ＝ 1.570 cm².'
        : 'Since the bucket is open at top, we include only 1 base (the bottom): Atot ＝ Alat ＋ Abase ＝ 1,256 ＋ 314 ＝ 1,570 cm².'
    };
  },
  // 2. Κυλινδρικό ποτήρι
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(301.44, locale)} cm²`;
    return {
      title: isEl ? 'ΓΥΑΛΙΝΟ ΠΟΤΗΡΙ' : 'GLASS CUP',
      prompt: isEl
        ? 'Ένα κυλινδρικό ποτήρι (ανοιχτό από πάνω) έχει ακτίνα βάσης 4 cm και ύψος 10 cm. Πόση είναι η εξωτερική επιφάνεια του γυαλιού; (π ＝ 3,14)'
        : 'A cylindrical drinking glass (open at top) has base radius 4 cm and height 10 cm. What is the outer surface area of the glass? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(251.2, locale)} cm²`,
        `${formatNum(351.68, locale)} cm²`,
        `${formatNum(300, locale)} cm²`,
        `${formatNum(50.24, locale)} cm²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Παράπλευρη επιφάνεια' : 'Lateral surface', value: '251,2 cm²' },
        { label: isEl ? '1 βάση (πάτος)' : '1 base (bottom)', value: '50,24 cm²' },
        { label: isEl ? 'Σύνολο' : 'Total', value: `251,2 ＋ 50,24 ＝ ${formatNum(301.44, locale)} cm²` }
      ],
      explanation: isEl
        ? '251,2 ＋ 50,24 ＝ 301,44 cm² (μόνο 1 βάση).'
        : '251.2 ＋ 50.24 ＝ 301.44 cm² (1 base only).'
    };
  },
  // 3. Κυλινδρική μολυβοθήκη
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(455.3, locale)} cm²`;
    return {
      title: isEl ? 'ΜΟΛΥΒΟΘΗΚΗ ΧΩΡΙΣ ΚΑΠΑΚΙ' : 'PENCIL HOLDER NO LID',
      prompt: isEl
        ? 'Μια κυλινδρική μολυβοθήκη έχει ακτίνα βάσης 5 cm και ύψος 12 cm. Πόσο χαρτόνι χρειάστηκε για την κατασκευή της (βάση και πλαϊνή επιφάνεια); (π ＝ 3,14)'
        : 'A cylindrical pencil holder has base radius 5 cm and height 12 cm. How much cardboard was needed for its construction (base and side surface)? (π ＝ 3.14)',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(376.8, locale)} cm²`,
        `${formatNum(533.8, locale)} cm²`,
        `${formatNum(400, locale)} cm²`,
        `${formatNum(78.5, locale)} cm²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Πλαϊνή επιφάνεια' : 'Side surface', value: '376,8 cm²' },
        { label: isEl ? 'Πάτος (1 βάση)' : 'Bottom (1 base)', value: '78,5 cm²' },
        { label: isEl ? 'Σύνολο' : 'Total', value: `376,8 ＋ 78,5 ＝ ${formatNum(455.3, locale)} cm²` }
      ],
      explanation: isEl
        ? '376,8 ＋ 78,5 ＝ 455,3 cm².'
        : '376.8 ＋ 78.5 ＝ 455.3 cm².'
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα, Αναλογίες & Μετατροπές Μονάδων
const PROBLEM_POOL_Q12 = [
  // 1. Διπλασιασμός ύψους κυλίνδρου
  (locale) => {
    const isEl = locale === 'el';
    const correct = isEl
      ? 'Η παράπλευρη επιφάνεια διπλασιάζεται'
      : 'The lateral surface area doubles';
    return {
      title: isEl ? 'ΜΕΤΑΒΟΛΗ ΥΨΟΥΣ ΚΥΛΙΝΔΡΟΥ' : 'CHANGE IN CYLINDER HEIGHT',
      prompt: isEl
        ? 'Αν διατηρήσουμε σταθερή την ακτίνα ενός κυλίνδρου και διπλασιάσουμε μόνο το ύψος του (2 · υ), πώς θα μεταβληθεί η παράπλευρη επιφάνειά του;'
        : 'If we keep the radius of a cylinder constant and only double its height (2 · h), how does its lateral surface area change?',
      options: ensureFourUniqueOptions(correct, () => [
        isEl ? 'Η παράπλευρη επιφάνεια τετραπλασιάζεται' : 'The lateral surface quadruples',
        isEl ? 'Η παράπλευρη επιφάνεια παραμένει η ίδια' : 'The lateral surface remains the same',
        isEl ? 'Η παράπλευρη επιφάνεια υποδιπλασιάζεται' : 'The lateral surface is halved'
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Αρχική παράπλευρη' : 'Initial lateral', value: 'Επ₁ ＝ (2 · π · ρ) · υ' },
        { label: isEl ? 'Νέα παράπλευρη' : 'New lateral', value: 'Επ₂ ＝ (2 · π · ρ) · (2 · υ) ＝ 2 · Επ₁' }
      ],
      explanation: isEl
        ? 'Επειδή το ύψος δεν είναι υψωμένο σε δύναμη στον τύπο Επ ＝ (2 · π · ρ) · υ, ο διπλασιασμός του ύψους απλώς διπλασιάζει την παράπλευρη επιφάνεια.'
        : 'Because height is to the first power in Alat ＝ (2 · π · r) · h, doubling height simply doubles the lateral area.'
    };
  },
  // 2. Μετατροπή παράπλευρης επιφάνειας σε dm²
  (locale) => {
    const isEl = locale === 'el';
    const correct = `${formatNum(12.56, locale)} dm²`;
    return {
      title: isEl ? 'ΜΕΤΑΤΡΟΠΗ ΣΕ DM²' : 'CONVERSION TO DM²',
      prompt: isEl
        ? 'Η παράπλευρη επιφάνεια ενός κυλίνδρου είναι 1.256 cm². Πόσα τετραγωνικά δεκατόμετρα (dm²) είναι αυτή η επιφάνεια;'
        : 'The lateral surface area of a cylinder is 1,256 cm². How many square decimeters (dm²) is this surface?',
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(125.6, locale)} dm²`,
        `${formatNum(1.256, locale)} dm²`,
        `${formatNum(1256, locale)} dm²`,
        `${formatNum(0.1256, locale)} dm²`
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Επιφάνεια σε cm²' : 'Area in cm²', value: '1.256 cm²' },
        { label: isEl ? 'Σχέση cm² με dm²' : 'Conversion factor', value: '1 dm² ＝ 100 cm²' },
        { label: isEl ? 'Πράξη (: 100)' : 'Calculation (: 100)', value: `1.256 : 100 ＝ ${formatNum(12.56, locale)} dm²` }
      ],
      explanation: isEl ? '1.256 : 100 ＝ 12,56 dm².' : '1,256 : 100 ＝ 12.56 dm².'
    };
  },
  // 3. Διπλασιασμός ακτίνας βάσης
  (locale) => {
    const isEl = locale === 'el';
    const correct = isEl
      ? 'Το εμβαδόν της βάσης τετραπλασιάζεται'
      : 'The base area quadruples';
    return {
      title: isEl ? 'ΔΙΠΛΑΣΙΑΣΜΟΣ ΑΚΤΙΝΑΣ ΒΑΣΗΣ' : 'DOUBLING BASE RADIUS',
      prompt: isEl
        ? 'Αν διπλασιάσουμε την ακτίνα ρ της βάσης ενός κυλίνδρου, πώς αλλάζει το εμβαδόν της κυκλικής βάσης;'
        : 'If we double the base radius r of a cylinder, how does the circular base area change?',
      options: ensureFourUniqueOptions(correct, () => [
        isEl ? 'Το εμβαδόν της βάσης διπλασιάζεται' : 'The base area doubles',
        isEl ? 'Το εμβαδόν της βάσης παραμένει ίδιο' : 'The base area remains the same',
        isEl ? 'Το εμβαδόν της βάσης οκταπλασιάζεται' : 'The base area octuples'
      ]),
      correctAnswer: correct,
      tableData: [
        { label: isEl ? 'Τύπος βάσης' : 'Base formula', value: 'Εβ ＝ π · ρ²' },
        { label: isEl ? 'Νέα βάση (2ρ)' : 'New base (2r)', value: 'π · (2ρ)² ＝ π · 4ρ² ＝ 4 · Εβ' }
      ],
      explanation: isEl
        ? 'Αφού η ακτίνα είναι στο τετράγωνο (ρ²), ο διπλασιασμός της ακτίνας τετραπλασιάζει το εμβαδόν της βάσης (2 · 2 ＝ 4).'
        : 'Since radius is squared (r²), doubling the radius quadruples the base area (2 · 2 ＝ 4).'
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
  const qs = [];

  // Q1: Στοιχεία κυλίνδρου (Boolean)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: isEl ? 'ΣΤΟΙΧΕΙΑ ΚΥΛΙΝΔΡΟΥ' : 'CYLINDER ELEMENTS',
    prompt: isEl
      ? (isQ1True
          ? 'Ο κύλινδρος αποτελείται από 2 παράλληλες κυκλικές βάσεις και 1 καμπύλη παράπλευρη επιφάνεια.'
          : 'Ο κύλινδρος είναι πολύεδρο και έχει 6 επίπεδες έδρες, 12 ακμές και 8 κορυφές.')
      : (isQ1True
          ? 'A cylinder consists of 2 parallel circular bases and 1 curved lateral surface.'
          : 'A cylinder is a polyhedron with 6 flat faces, 12 edges, and 8 vertices.'),
    correctAnswer: isQ1True,
    tableData: [
      { label: isEl ? 'Βάσεις' : 'Bases', value: isEl ? `2 ίσοι παράλληλοι κυκλικοί δίσκοι (ακτίνας ${rSym})` : `2 identical parallel circular discs (radius ${rSym})` },
      { label: isEl ? 'Παράπλευρη' : 'Lateral', value: isEl ? `1 καμπύλη επιφάνεια ύψους ${hSym}` : `1 curved surface of height ${hSym}` }
    ],
    explanation: isEl
      ? (isQ1True
          ? 'Ο κύλινδρος έχει πράγματι 2 κυκλικές βάσεις και 1 καμπύλη παράπλευρη επιφάνεια.'
          : 'Ο κύλινδρος δεν είναι πολύεδρο (είναι σώμα εκ περιστροφής) και δεν έχει ευθύγραμμες ακμές ή κορυφές.')
      : (isQ1True
          ? 'A cylinder indeed has 2 circular bases and 1 curved lateral surface.'
          : 'A cylinder is not a polyhedron (it is a solid of revolution) and has no straight edges or vertices.')
  });

  // Q2: Τι σχήμα έχει η παράπλευρη επιφάνεια στο ανάπτυγμα (MCQ)
  const q2Correct = isEl ? 'Ορθογώνιο παραλληλόγραμμο' : 'Rectangle';
  qs.push({
    id: 2,
    type: 'mcq',
    title: isEl ? 'ΠΑΡΑΠΛΕΥΡΗ ΣΤΟ ΑΝΑΠΤΥΓΜΑ' : 'LATERAL NET SHAPE',
    prompt: isEl
      ? 'Όταν ανοίξουμε (ξετυλίξουμε) την παράπλευρη επιφάνεια ενός κυλίνδρου, τι σχήμα παίρνει;'
      : 'When we unroll the lateral surface of a cylinder onto a flat plane, what shape does it form?',
    options: ensureFourUniqueOptions(q2Correct, () => [
      isEl ? 'Τρίγωνο' : 'Triangle',
      isEl ? 'Κυκλικός τομέας' : 'Circular sector',
      isEl ? 'Τραπέζιο' : 'Trapezoid'
    ]),
    correctAnswer: q2Correct,
    tableData: [
      { label: isEl ? 'Σχήμα παράπλευρης' : 'Lateral shape', value: q2Correct },
      { label: isEl ? 'Διαστάσεις' : 'Dimensions', value: isEl ? `Μήκος ＝ 2 · π · ${rSym} | Πλάτος ＝ ${hSym}` : `Length ＝ 2 · π · ${rSym} | Width ＝ ${hSym}` }
    ],
    explanation: isEl
      ? 'Όταν ξετυλίγεται η παράπλευρη επιφάνεια ενός κυλίνδρου, σχηματίζει πάντα ένα ορθογώνιο παραλληλόγραμμο.'
      : 'When the lateral surface of a cylinder is unrolled, it always forms a flat rectangle.'
  });

  // Q3: Μήκος ορθογωνίου αναπτύγματος (MCQ)
  const q3Correct = isEl
    ? `Με την περίμετρο της κυκλικής βάσης: 2 · π · ${rSym}`
    : `With the perimeter of the circular base: 2 · π · ${rSym}`;
  qs.push({
    id: 3,
    type: 'mcq',
    title: isEl ? 'ΜΗΚΟΣ ΟΡΘΟΓΩΝΙΟΥ' : 'RECTANGLE LENGTH',
    prompt: isEl
      ? 'Με τι ισούται το μήκος του ορθογωνίου στο ανάπτυγμα ενός κυλίνδρου;'
      : 'What is the length of the rectangle in a cylinder net equal to?',
    options: ensureFourUniqueOptions(q3Correct, () => [
      isEl ? `Με το εμβαδόν της βάσης: π · ${rSym}²` : `With the base area: π · ${rSym}²`,
      isEl ? 'Με τη διάμετρο του κύκλου' : 'With the circle diameter',
      isEl ? 'Με το ύψος του κυλίνδρου' : 'With the cylinder height'
    ]),
    correctAnswer: q3Correct,
    tableData: [
      { label: isEl ? 'Μήκος ορθογωνίου' : 'Rectangle length', value: `Περίμετρος κύκλου ＝ 2 · π · ${rSym}` }
    ],
    explanation: isEl
      ? `Το μήκος του ορθογωνίου «αγκαλιάζει» ακριβώς τον κύκλο της βάσης, άρα ισούται με την περίμετρό του: 2 · π · ${rSym}.`
      : `The rectangle length wraps exactly around the base circle, so it equals its perimeter: 2 · π · ${rSym}.`
  });

  // Q4: Οπτική αναγνώριση αναπτύγματος (SVG - No Giveaway)
  const q4Correct = isEl
    ? 'Κύλινδρος με 2 κυκλικές βάσεις'
    : 'Cylinder with 2 circular bases';
  qs.push({
    id: 4,
    type: 'mcq',
    title: isEl ? 'ΑΝΑΓΝΩΡΙΣΗ ΑΝΑΠΤΥΓΜΑΤΟΣ ΚΥΛΙΝΔΡΟΥ' : 'CYLINDER NET IDENTIFICATION',
    prompt: isEl
      ? 'Παρατηρήστε το παρακάτω σχήμα. Ποιο γεωμετρικό στερεό σχηματίζεται αν το διπλώσουμε;'
      : 'Look at the shape below. Which geometric solid is formed when folded?',
    svg: (
      <svg viewBox="0 0 160 120" className="w-full max-w-[160px] h-auto mx-auto my-2 select-none drop-shadow-sm">
        <circle cx="80" cy="22" r="16" fill="#a7f3d0" stroke="#059669" strokeWidth="1.5" />
        <rect x="35" y="42" width="90" height="36" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" rx="2" />
        <circle cx="80" cy="98" r="16" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="1.5" />
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => [
      isEl ? 'Κώνος' : 'Cone',
      isEl ? 'Κύβος' : 'Cube',
      isEl ? 'Ορθογώνιο παραλληλεπίπεδο' : 'Rectangular prism'
    ]),
    correctAnswer: q4Correct,
    tableData: [
      { label: isEl ? 'Ανάπτυγμα' : 'Net pattern', value: isEl ? '1 ορθογώνιο και 2 ίσοι κυκλικοί δίσκοι' : '1 rectangle and 2 congruent circular discs' },
      { label: isEl ? 'Στερεό' : 'Solid', value: isEl ? 'Κύλινδρος' : 'Cylinder' }
    ],
    explanation: isEl
      ? 'Το ανάπτυγμα που αποτελείται από ένα ορθογώνιο παραλληλόγραμμο και δύο ίσους κύκλους ανήκει στον κύλινδρο.'
      : 'A net consisting of one rectangle and two congruent circles belongs to a cylinder.'
  });

  // Q5: Υπολογισμός εμβαδού μίας βάσης (Input)
  qs.push({
    id: 5,
    type: 'input',
    title: isEl ? `ΕΜΒΑΔΟΝ ΒΑΣΗΣ ΚΥΛΙΝΔΡΟΥ (${toCleanUppercase(rSym)} ＝ 10 CM)` : `CYLINDER BASE AREA (${rSym.toUpperCase()} ＝ 10 CM)`,
    prompt: isEl
      ? `Ένας κύλινδρος έχει ακτίνα βάσης ${rSym} ＝ 10 cm. Πόσα cm² είναι το εμβαδόν της μίας κυκλικής βάσης του; (π ＝ 3,14 - Γράψτε μόνο τον αριθμό)`
      : `A cylinder has base radius ${rSym} ＝ 10 cm. What is the area of one of its circular bases in cm²? (π ＝ 3.14 - Enter number only)`,
    correctAnswer: '314',
    tableData: [
      { label: isEl ? `Ακτίνα (${rSym})` : `Radius (${rSym})`, value: '10 cm' },
      { label: isEl ? 'Τύπος βάσης' : 'Base formula', value: `Εβ ＝ π · ${rSym}²` },
      { label: isEl ? 'Υπολογισμός' : 'Calculation', value: '3,14 · 10 · 10 ＝ 314 cm²' }
    ],
    explanation: isEl ? 'Εβ ＝ 3,14 · 10 · 10 ＝ 314 cm².' : 'Abase ＝ 3.14 · 10 · 10 ＝ 314 cm².'
  });

  // Q6: Υπολογισμός εμβαδού 2 βάσεων (Input)
  qs.push({
    id: 6,
    type: 'input',
    title: isEl ? `ΕΜΒΑΔΟΝ ΚΑΙ ΤΩΝ ΔΥΟ ΒΑΣΕΩΝ (${toCleanUppercase(rSym)} ＝ 2 CM)` : `AREA OF BOTH BASES (${rSym.toUpperCase()} ＝ 2 CM)`,
    prompt: isEl
      ? `Ένας κύλινδρος έχει ακτίνα βάσης ${rSym} ＝ 2 cm. Πόσα cm² είναι συνολικά το εμβαδόν και των δύο βάσεών του μαζί; (π ＝ 3,14)`
      : `A cylinder has base radius ${rSym} ＝ 2 cm. What is the total area of both of its bases together in cm²? (π ＝ 3.14)`,
    correctAnswer: isEl ? '25,12' : '25.12',
    tableData: [
      { label: isEl ? 'Εμβαδόν 1 βάσης' : '1 Base area', value: '3,14 · 2 · 2 ＝ 12,56 cm²' },
      { label: isEl ? 'Εμβαδόν 2 βάσεων' : '2 Bases area', value: isEl ? '2 · 12,56 ＝ 25,12 cm²' : '2 · 12.56 ＝ 25.12 cm²' }
    ],
    explanation: isEl ? '2 · (3,14 · 2 · 2) ＝ 2 · 12,56 ＝ 25,12 cm².' : '2 · (3.14 · 2 · 2) ＝ 2 · 12.56 ＝ 25.12 cm².'
  });

  // Q7: Τύπος ολικής επιφάνειας κλειστού κυλίνδρου (MCQ)
  const q7Correct = isEl
    ? 'Εολ ＝ Επ ＋ 2 · Εβ (παράπλευρη επιφάνεια συν 2 βάσεις)'
    : 'Atot ＝ Alat ＋ 2 · Abase (lateral surface plus 2 bases)';
  qs.push({
    id: 7,
    type: 'mcq',
    title: isEl ? 'ΤΥΠΟΣ ΟΛΙΚΟΥ ΕΜΒΑΔΟΥ' : 'TOTAL AREA FORMULA',
    prompt: isEl
      ? 'Πώς υπολογίζουμε το ολικό εμβαδόν (Εολ) ενός κλειστού κυλίνδρου;'
      : 'How do we calculate the total surface area of a closed cylinder?',
    options: ensureFourUniqueOptions(q7Correct, () => [
      isEl ? 'Εολ ＝ Επ ＋ Εβ (παράπλευρη συν μία μόνο βάση)' : 'Atot ＝ Alat ＋ Abase (lateral plus one base only)',
      isEl ? 'Εολ ＝ Επ · Εβ' : 'Atot ＝ Alat · Abase',
      isEl ? `Εολ ＝ 2 · π · ${rSym} · ${hSym}` : `Atot ＝ 2 · π · ${rSym} · ${hSym}`
    ]),
    correctAnswer: q7Correct,
    tableData: [
      { label: isEl ? 'Ολικό εμβαδόν' : 'Total area', value: isEl ? 'Εολ ＝ Επ ＋ 2 · Εβ' : 'Atot ＝ Alat ＋ 2 · Abase' },
      { label: isEl ? 'Αναλυτικά' : 'Expanded', value: `(2 · π · ${rSym} · ${hSym}) ＋ 2 · (π · ${rSym}²)` }
    ],
    explanation: isEl
      ? 'Σε έναν κλειστό κύλινδρο προσθέτουμε την παράπλευρη επιφάνεια και τις δύο κυκλικές βάσεις: Εολ ＝ Επ ＋ 2 · Εβ.'
      : 'In a closed cylinder, we sum the lateral area and both circular bases: Atot ＝ Alat ＋ 2 · Abase.'
  });

  // Q8: Τύπος παράπλευρης επιφάνειας (MCQ)
  const q8Correct = isEl ? `Επ ＝ (2 · π · ${rSym}) · ${hSym}` : `Alat ＝ (2 · π · ${rSym}) · ${hSym}`;
  qs.push({
    id: 8,
    type: 'mcq',
    title: isEl ? 'ΤΥΠΟΣ ΠΑΡΑΠΛΕΥΡΗΣ ΕΠΙΦΑΝΕΙΑΣ' : 'LATERAL AREA FORMULA',
    prompt: isEl
      ? 'Ποιος είναι ο τύπος για την παράπλευρη επιφάνεια (Επ) του κυλίνδρου;'
      : 'What is the formula for the lateral surface area of a cylinder?',
    options: ensureFourUniqueOptions(q8Correct, () => [
      isEl ? `Επ ＝ (π · ${rSym}²) · ${hSym}` : `Alat ＝ (π · ${rSym}²) · ${hSym}`,
      isEl ? `Επ ＝ 2 · π · ${rSym}²` : `Alat ＝ 2 · π · ${rSym}²`,
      isEl ? `Επ ＝ π · ${rSym} · ${hSym}` : `Alat ＝ π · ${rSym} · ${hSym}`
    ]),
    correctAnswer: q8Correct,
    tableData: [
      { label: isEl ? 'Παράπλευρη επιφάνεια' : 'Lateral area', value: isEl ? `Μήκος ορθογωνίου · Ύψος ＝ (2 · π · ${rSym}) · ${hSym}` : `Rectangle length · Height ＝ (2 · π · ${rSym}) · ${hSym}` }
    ],
    explanation: isEl
      ? `Το εμβαδόν του ορθογωνίου της παράπλευρης επιφάνειας είναι βάση επί ύψος: Επ ＝ (2 · π · ${rSym}) · ${hSym}.`
      : `The rectangle area of the lateral surface is base times height: Alat ＝ (2 · π · ${rSym}) · ${hSym}.`
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

export default function KilindrosAskiseisPage() {
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
      ? "Ασκήσεις: Κύλινδρος - ΣΤ' Δημοτικού | LearnMaths.gr"
      : "Exercises: Cylinder - 6th Grade | LearnMaths.gr",
    metaDesc: isEl
      ? "Διαδραστικές ασκήσεις στον κύλινδρο, το ανάπτυγμά του, την παράπλευρη και την ολική επιφάνεια για τη ΣΤ' Δημοτικού."
      : "Interactive exercises on cylinder nets, lateral area, and total surface area for 6th Grade.",
    backText: isEl ? "Θεωρία Κεφ. 79" : "Theory Ch. 79",
    actionTheory: isEl ? "📖 Θεωρία" : "📖 Theory",
    chapterBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 79 • ΣΤ' ΔΗΜΟΤΙΚΟΥ" : "EXERCISES • CHAPTER 79 • 6TH GRADE",
    heroTitle: isEl ? "Ασκήσεις: Ο Κύλινδρος και τα Εμβαδά του" : "Exercises: The Cylinder and its Areas",
    heroDesc: isEl
      ? "Εξασκηθείτε στο ανάπτυγμα του κυλίνδρου, στον υπολογισμό εμβαδού βάσεων (π · ρ²), παράπλευρης επιφάνειας [(2 · π · ρ) · υ] και ολικού εμβαδού μέσα από 12 δυναμικές ερωτήσεις."
      : "Practice cylinder nets, base area (π · r²), lateral area [(2 · π · r) · h], and total area across 12 dynamic questions.",
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
      backUrl="/st-dimotikou/79-kilindros"
      backText={ui.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/79-kilindros"
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
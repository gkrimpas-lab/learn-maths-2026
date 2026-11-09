// pages/st-dimotikou/70-megethinsi-smikrinsi-ask.js
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

// POOL ΓΙΑ Q7: Κλίμακα Χάρτη & Πραγματικές Αποστάσεις σε km
const PROBLEM_POOL_Q7 = [
  (loc) => {
    const cm = randInt(3, 8);
    const scale = 200000;
    const km = (cm * scale) / 100000;
    const correct = `${formatNum(km, loc)} km`;
    return {
      title: loc === 'el' ? 'ΑΠΟΣΤΑΣΗ ΣΕ ΧΑΡΤΗ 1 : 200.000' : 'DISTANCE ON MAP 1 : 200,000',
      prompt: loc === 'el'
        ? `Σε έναν οδικό χάρτη με κλίμακα 1 : 200.000, η απόσταση ανάμεσα σε δύο χωριά είναι ${formatNum(cm, loc)} cm. Πόσα χιλιόμετρα (km) απέχουν τα δύο χωριά στην πραγματικότητα;`
        : `On a road map with scale 1 : 200,000, the distance between two villages is ${formatNum(cm, loc)} cm. How many kilometers (km) apart are they in reality?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(km + 4, loc)} km`,
        `${formatNum(km - 2 > 0 ? km - 2 : km + 8, loc)} km`,
        `${formatNum(km * 2, loc)} km`,
        `${formatNum(km / 2, loc)} km`
      ]),
      correctAnswer: correct,
      unit: 'km',
      tableData: loc === 'el' ? [
        { label: 'Απόσταση στον χάρτη', value: `${formatNum(cm, loc)} cm` },
        { label: 'Κλίμακα', value: '1 : 200.000' },
        { label: 'Πραγματική απόσταση σε cm', value: `${formatNum(cm, loc)} · 200.000 ＝ ${formatNum(cm * scale, loc)} cm` },
        { label: 'Μετατροπή σε km (: 100.000)', value: `${formatNum(km, loc)} km` }
      ] : [
        { label: 'Map distance', value: `${formatNum(cm, loc)} cm` },
        { label: 'Scale', value: '1 : 200,000' },
        { label: 'Actual distance in cm', value: `${formatNum(cm, loc)} · 200,000 ＝ ${formatNum(cm * scale, loc)} cm` },
        { label: 'Converted to km (: 100,000)', value: `${formatNum(km, loc)} km` }
      ],
      fractionData: { n: `${formatNum(cm * scale, loc)} cm`, d: loc === 'el' ? '100.000' : '100,000', res: `${formatNum(km, loc)} km` },
      explanation: loc === 'el'
        ? `Πολλαπλασιάζουμε με την κλίμακα: ${formatNum(cm, loc)} · 200.000 ＝ ${formatNum(cm * scale, loc)} cm. Διαιρούμε με το 100.000: ${formatNum(km, loc)} km.`
        : `Multiply by scale: ${formatNum(cm, loc)} · 200,000 ＝ ${formatNum(cm * scale, loc)} cm. Divide by 100,000: ${formatNum(km, loc)} km.`
    };
  },
  (loc) => {
    const cm = randInt(4, 12);
    const scale = 50000;
    const km = (cm * scale) / 100000;
    const correct = `${formatNum(km, loc)} km`;
    return {
      title: loc === 'el' ? 'ΑΠΟΣΤΑΣΗ ΣΕ ΠΕΖΟΠΟΡΙΚΟ ΧΑΡΤΗ 1 : 50.000' : 'DISTANCE ON HIKING MAP 1 : 50,000',
      prompt: loc === 'el'
        ? `Σε έναν πεζοπορικό χάρτη με κλίμακα 1 : 50.000, ένα μονοπάτι έχει μήκος ${formatNum(cm, loc)} cm. Πόσα χιλιόμετρα είναι το πραγματικό μήκος του μονοπατιού;`
        : `On a hiking map with scale 1 : 50,000, a trail measures ${formatNum(cm, loc)} cm. How many kilometers long is the trail in reality?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(km + 1, loc)} km`,
        `${formatNum(km - 1 > 0 ? km - 1 : km + 3, loc)} km`,
        `${formatNum(km * 2, loc)} km`,
        `${formatNum(km + 2.5, loc)} km`
      ]),
      correctAnswer: correct,
      unit: 'km',
      tableData: loc === 'el' ? [
        { label: 'Μήκος στον χάρτη', value: `${formatNum(cm, loc)} cm` },
        { label: 'Κλίμακα', value: '1 : 50.000' },
        { label: 'Πραγματικό μήκος σε cm', value: `${formatNum(cm, loc)} · 50.000 ＝ ${formatNum(cm * scale, loc)} cm` },
        { label: 'Μετατροπή σε km (: 100.000)', value: `${formatNum(km, loc)} km` }
      ] : [
        { label: 'Map length', value: `${formatNum(cm, loc)} cm` },
        { label: 'Scale', value: '1 : 50,000' },
        { label: 'Actual length in cm', value: `${formatNum(cm, loc)} · 50,000 ＝ ${formatNum(cm * scale, loc)} cm` },
        { label: 'Converted to km (: 100,000)', value: `${formatNum(km, loc)} km` }
      ],
      fractionData: { n: `${formatNum(cm * scale, loc)} cm`, d: loc === 'el' ? '100.000' : '100,000', res: `${formatNum(km, loc)} km` },
      explanation: loc === 'el'
        ? `${formatNum(cm, loc)} · 50.000 ＝ ${formatNum(cm * scale, loc)} cm ＝ ${formatNum(km, loc)} km.`
        : `${formatNum(cm, loc)} · 50,000 ＝ ${formatNum(cm * scale, loc)} cm ＝ ${formatNum(km, loc)} km.`
    };
  },
  (loc) => {
    const cm = randInt(3, 9);
    const km = cm * 10;
    const correct = `${formatNum(km, loc)} km`;
    return {
      title: loc === 'el' ? 'ΑΠΟΣΤΑΣΗ ΣΕ ΓΕΩΓΡΑΦΙΚΟ ΧΑΡΤΗ 1 : 1.000.000' : 'DISTANCE ON MAP 1 : 1,000,000',
      prompt: loc === 'el'
        ? `Σε έναν γεωγραφικό χάρτη με κλίμακα 1 : 1.000.000, δύο πόλεις απέχουν ${formatNum(cm, loc)} cm. Πόση είναι η πραγματική τους απόσταση σε km;`
        : `On a geographic map with scale 1 : 1,000,000, two cities are ${formatNum(cm, loc)} cm apart. What is their real distance in km?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(km + 20, loc)} km`,
        `${formatNum(km - 10 > 0 ? km - 10 : km + 30, loc)} km`,
        `${formatNum(km * 2, loc)} km`,
        `${formatNum(cm, loc)} km`
      ]),
      correctAnswer: correct,
      unit: 'km',
      tableData: loc === 'el' ? [
        { label: 'Απόσταση στον χάρτη', value: `${formatNum(cm, loc)} cm` },
        { label: 'Κλίμακα', value: '1 : 1.000.000 (1 cm ＝ 10 km)' },
        { label: 'Πράξη', value: `${formatNum(cm, loc)} · 10 km` },
        { label: 'Πραγματική απόσταση', value: `${formatNum(km, loc)} km` }
      ] : [
        { label: 'Map distance', value: `${formatNum(cm, loc)} cm` },
        { label: 'Scale', value: '1 : 1,000,000 (1 cm ＝ 10 km)' },
        { label: 'Calculation', value: `${formatNum(cm, loc)} · 10 km` },
        { label: 'Actual distance', value: `${formatNum(km, loc)} km` }
      ],
      explanation: loc === 'el'
        ? `Στην κλίμακα 1 : 1.000.000, κάθε 1 cm στον χάρτη αντιστοιχεί σε 10 km: ${formatNum(cm, loc)} · 10 ＝ ${formatNum(km, loc)} km.`
        : `At scale 1 : 1,000,000, every 1 cm on the map equals 10 km: ${formatNum(cm, loc)} · 10 ＝ ${formatNum(km, loc)} km.`
    };
  }
];

// POOL ΓΙΑ Q8: Αρχιτεκτονικά Σχέδια & Κάτοψη Κατοικίας σε m
const PROBLEM_POOL_Q8 = [
  (loc) => {
    const wCm = randInt(6, 12);
    const realM = (wCm * 50) / 100;
    const correct = `${formatNum(realM, loc)} m`;
    return {
      title: loc === 'el' ? 'ΜΗΚΟΣ ΤΟΙΧΟΥ ΣΕ ΚΑΤΟΨΗ 1 : 50' : 'WALL LENGTH IN FLOOR PLAN 1 : 50',
      prompt: loc === 'el'
        ? `Στο αρχιτεκτονικό σχέδιο ενός σπιτιού με κλίμακα 1 : 50, ένας τοίχος έχει μήκος ${formatNum(wCm, loc)} cm. Πόσα μέτρα (m) είναι το πραγματικό μήκος του τοίχου;`
        : `On an architectural floor plan with scale 1 : 50, a wall measures ${formatNum(wCm, loc)} cm. How many meters (m) long is the wall in reality?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(realM + 1.5, loc)} m`,
        `${formatNum(realM - 1 > 0 ? realM - 1 : realM + 3, loc)} m`,
        `${formatNum(realM * 2, loc)} m`,
        `${formatNum(wCm, loc)} m`
      ]),
      correctAnswer: correct,
      unit: 'm',
      tableData: loc === 'el' ? [
        { label: 'Μήκος στο σχέδιο', value: `${formatNum(wCm, loc)} cm` },
        { label: 'Κλίμακα', value: '1 : 50' },
        { label: 'Πραγματικό μήκος σε cm', value: `${formatNum(wCm, loc)} · 50 ＝ ${formatNum(wCm * 50, loc)} cm` },
        { label: 'Μετατροπή σε m (: 100)', value: `${formatNum(realM, loc)} m` }
      ] : [
        { label: 'Plan length', value: `${formatNum(wCm, loc)} cm` },
        { label: 'Scale', value: '1 : 50' },
        { label: 'Actual length in cm', value: `${formatNum(wCm, loc)} · 50 ＝ ${formatNum(wCm * 50, loc)} cm` },
        { label: 'Converted to m (: 100)', value: `${formatNum(realM, loc)} m` }
      ],
      fractionData: { n: `${formatNum(wCm * 50, loc)} cm`, d: '100', res: `${formatNum(realM, loc)} m` },
      explanation: loc === 'el'
        ? `${formatNum(wCm, loc)} · 50 ＝ ${formatNum(wCm * 50, loc)} cm ＝ ${formatNum(realM, loc)} m.`
        : `${formatNum(wCm, loc)} · 50 ＝ ${formatNum(wCm * 50, loc)} cm ＝ ${formatNum(realM, loc)} m.`
    };
  },
  (loc) => {
    const wCm = randInt(5, 14);
    const realM = wCm;
    const correct = `${formatNum(realM, loc)} m`;
    return {
      title: loc === 'el' ? 'ΔΙΑΣΤΑΣΗ ΣΕ ΚΑΤΟΨΗ 1 : 100' : 'DIMENSION IN FLOOR PLAN 1 : 100',
      prompt: loc === 'el'
        ? `Στην κάτοψη ενός οικοπέδου με κλίμακα 1 : 100, η πρόσοψη σχεδιάστηκε με μήκος ${formatNum(wCm, loc)} cm. Πόσα μέτρα (m) είναι η πραγματική πρόσοψη;`
        : `On a site plan with scale 1 : 100, the frontage is drawn as ${formatNum(wCm, loc)} cm. How many meters (m) is the real frontage?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(realM * 2, loc)} m`,
        `${formatNum(realM + 4, loc)} m`,
        `${formatNum(realM - 2 > 0 ? realM - 2 : realM + 6, loc)} m`,
        `${formatNum(realM / 10, loc)} m`
      ]),
      correctAnswer: correct,
      unit: 'm',
      tableData: loc === 'el' ? [
        { label: 'Μήκος στο σχέδιο', value: `${formatNum(wCm, loc)} cm` },
        { label: 'Κλίμακα', value: '1 : 100 (1 cm ＝ 1 m)' },
        { label: 'Πράξη', value: `${formatNum(wCm, loc)} · 1 m` },
        { label: 'Πραγματικό μήκος', value: `${formatNum(realM, loc)} m` }
      ] : [
        { label: 'Plan length', value: `${formatNum(wCm, loc)} cm` },
        { label: 'Scale', value: '1 : 100 (1 cm ＝ 1 m)' },
        { label: 'Calculation', value: `${formatNum(wCm, loc)} · 1 m` },
        { label: 'Actual length', value: `${formatNum(realM, loc)} m` }
      ],
      explanation: loc === 'el'
        ? `Στην κλίμακα 1 : 100, κάθε 1 cm στο σχέδιο ισούται με 1 m: ${formatNum(realM, loc)} m.`
        : `At scale 1 : 100, every 1 cm on the drawing represents 1 m: ${formatNum(realM, loc)} m.`
    };
  },
  (loc) => {
    const lCm = 8;
    const wCm = 6;
    const realL = (lCm * 50) / 100;
    const realW = (wCm * 50) / 100;
    const area = realL * realW;
    const correct = `${formatNum(area, loc)} m²`;
    return {
      title: loc === 'el' ? 'ΕΜΒΑΔΟΝ ΔΩΜΑΤΙΟΥ ΑΠΟ ΚΑΤΟΨΗ 1 : 50' : 'ROOM AREA FROM PLAN 1 : 50',
      prompt: loc === 'el'
        ? `Στην κάτοψη με κλίμακα 1 : 50, ένα δωμάτιο έχει διαστάσεις ${formatNum(lCm, loc)} cm και ${formatNum(wCm, loc)} cm. Πόσο είναι το πραγματικό εμβαδόν του δωματίου σε m²;`
        : `On a floor plan with scale 1 : 50, a room measures ${formatNum(lCm, loc)} cm by ${formatNum(wCm, loc)} cm. What is the real area of the room in m²?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(area * 2, loc)} m²`,
        `${formatNum(area * 4, loc)} m²`,
        `${formatNum(area + 4, loc)} m²`,
        `${formatNum(Math.max(2, area - 4), loc)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: loc === 'el' ? [
        { label: 'Πραγματικό μήκος', value: `${formatNum(lCm, loc)} cm · 50 ＝ 400 cm ＝ 4 m` },
        { label: 'Πραγματικό πλάτος', value: `${formatNum(wCm, loc)} cm · 50 ＝ 300 cm ＝ 3 m` },
        { label: 'Πράξη εμβαδού', value: '4 m · 3 m' },
        { label: 'Πραγματικό εμβαδόν', value: `${formatNum(area, loc)} m²` }
      ] : [
        { label: 'Actual length', value: `${formatNum(lCm, loc)} cm · 50 ＝ 400 cm ＝ 4 m` },
        { label: 'Actual width', value: `${formatNum(wCm, loc)} cm · 50 ＝ 300 cm ＝ 3 m` },
        { label: 'Area calculation', value: '4 m · 3 m' },
        { label: 'Actual area', value: `${formatNum(area, loc)} m²` }
      ],
      explanation: loc === 'el'
        ? `Βρίσκουμε πρώτα τις πραγματικές διαστάσεις (4 m και 3 m). Εμβαδόν: 4 · 3 ＝ ${formatNum(area, loc)} m².`
        : `First calculate real dimensions (4 m and 3 m). Area: 4 · 3 ＝ ${formatNum(area, loc)} m².`
    };
  }
];

// POOL ΓΙΑ Q9: Μεταβολή Περιμέτρου & Διαστάσεων Σχημάτων
const PROBLEM_POOL_Q9 = [
  (loc) => {
    const s = randInt(4, 9);
    const p1 = 4 * s;
    const p2 = 3 * p1;
    const correct = `${formatNum(p2, loc)} cm`;
    return {
      title: loc === 'el' ? 'ΤΡΙΠΛΑΣΙΑΣΜΟΣ ΠΕΡΙΜΕΤΡΟΥ ΤΕΤΡΑΓΩΝΟΥ' : 'TRIPLING SQUARE PERIMETER',
      prompt: loc === 'el'
        ? `Ένα τετράγωνο έχει πλευρά ${formatNum(s, loc)} cm. Αν τριπλασιάσουμε το μήκος της πλευράς του (μεγέθυνση με συντελεστή 3), πόση θα γίνει η νέα περίμετρος;`
        : `A square has a side of ${formatNum(s, loc)} cm. If we triple its side length (scale factor 3), what will the new perimeter be?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(p1, loc)} cm`,
        `${formatNum(p2 + 12, loc)} cm`,
        `${formatNum(p2 - 12 > 0 ? p2 - 12 : p2 + 24, loc)} cm`,
        `${formatNum(p1 * 4, loc)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: loc === 'el' ? [
        { label: 'Αρχική περίμετρος', value: `4 · ${formatNum(s, loc)} ＝ ${formatNum(p1, loc)} cm` },
        { label: 'Συντελεστής μεγέθυνσης', value: '3' },
        { label: 'Νέα περίμετρος', value: `3 · ${formatNum(p1, loc)} ＝ ${formatNum(p2, loc)} cm` }
      ] : [
        { label: 'Initial perimeter', value: `4 · ${formatNum(s, loc)} ＝ ${formatNum(p1, loc)} cm` },
        { label: 'Scale factor', value: '3' },
        { label: 'New perimeter', value: `3 · ${formatNum(p1, loc)} ＝ ${formatNum(p2, loc)} cm` }
      ],
      explanation: loc === 'el'
        ? `Όταν τριπλασιάζεται η πλευρά, τριπλασιάζεται και η περίμετρος: 3 · ${formatNum(p1, loc)} cm ＝ ${formatNum(p2, loc)} cm.`
        : `When side length triples, perimeter also triples: 3 · ${formatNum(p1, loc)} cm ＝ ${formatNum(p2, loc)} cm.`
    };
  },
  (loc) => {
    const w = randInt(3, 6);
    const l = randInt(7, 10);
    const p1 = 2 * (w + l);
    const p2 = 2 * p1;
    const correct = `${formatNum(p2, loc)} cm`;
    return {
      title: loc === 'el' ? 'ΔΙΠΛΑΣΙΑΣΜΟΣ ΠΕΡΙΜΕΤΡΟΥ ΟΡΘΟΓΩΝΙΟΥ' : 'DOUBLING RECTANGLE PERIMETER',
      prompt: loc === 'el'
        ? `Ένα ορθογώνιο έχει διαστάσεις ${formatNum(w, loc)} cm και ${formatNum(l, loc)} cm. Αν διπλασιάσουμε όλες τις πλευρές του, πόση θα είναι η περίμετρος του νέου ορθογωνίου;`
        : `A rectangle has dimensions ${formatNum(w, loc)} cm by ${formatNum(l, loc)} cm. If we double all its sides, what will the perimeter of the new rectangle be?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(p1, loc)} cm`,
        `${formatNum(p2 + 8, loc)} cm`,
        `${formatNum(p2 - 6 > 0 ? p2 - 6 : p2 + 16, loc)} cm`,
        `${formatNum(p1 * 4, loc)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: loc === 'el' ? [
        { label: 'Αρχική περίμετρος', value: `2 · (${formatNum(w, loc)} ＋ ${formatNum(l, loc)}) ＝ ${formatNum(p1, loc)} cm` },
        { label: 'Συντελεστής', value: '2' },
        { label: 'Νέα περίμετρος', value: `2 · ${formatNum(p1, loc)} ＝ ${formatNum(p2, loc)} cm` }
      ] : [
        { label: 'Initial perimeter', value: `2 · (${formatNum(w, loc)} ＋ ${formatNum(l, loc)}) ＝ ${formatNum(p1, loc)} cm` },
        { label: 'Scale factor', value: '2' },
        { label: 'New perimeter', value: `2 · ${formatNum(p1, loc)} ＝ ${formatNum(p2, loc)} cm` }
      ],
      explanation: loc === 'el'
        ? `Όταν διπλασιάζονται οι πλευρές, η περίμετρος διπλασιάζεται: 2 · ${formatNum(p1, loc)} ＝ ${formatNum(p2, loc)} cm.`
        : `When sides are doubled, perimeter doubles: 2 · ${formatNum(p1, loc)} ＝ ${formatNum(p2, loc)} cm.`
    };
  },
  (loc) => {
    const s = randInt(10, 20) * 2;
    const newS = s / 2;
    const correct = `${formatNum(newS, loc)} cm`;
    return {
      title: loc === 'el' ? 'ΣΜΙΚΡΥΝΣΗ ΠΛΕΥΡΑΣ ΣΤΟ ΜΙΣΟ' : 'HALVING SIDE LENGTH',
      prompt: loc === 'el'
        ? `Ένα κανονικό εξάγωνο έχει πλευρά ${formatNum(s, loc)} cm. Αν το σμικρύνουμε στο μισό (συντελεστής 0,5), πόσο θα είναι το μήκος της πλευράς του νέου εξαγώνου;`
        : `A regular hexagon has a side of ${formatNum(s, loc)} cm. If we scale it down by half (factor 0.5), what will the side length of the new hexagon be?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(newS + 4, loc)} cm`,
        `${formatNum(newS - 3 > 0 ? newS - 3 : newS + 6, loc)} cm`,
        `${formatNum(s, loc)} cm`,
        `${formatNum(s * 2, loc)} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: loc === 'el' ? [
        { label: 'Αρχική πλευρά', value: `${formatNum(s, loc)} cm` },
        { label: 'Σμίκρυνση', value: 'Στο μισό (: 2)' },
        { label: 'Νέα πλευρά', value: `${formatNum(s, loc)} : 2 ＝ ${formatNum(newS, loc)} cm` }
      ] : [
        { label: 'Initial side', value: `${formatNum(s, loc)} cm` },
        { label: 'Reduction', value: 'By half (: 2)' },
        { label: 'New side', value: `${formatNum(s, loc)} : 2 ＝ ${formatNum(newS, loc)} cm` }
      ],
      fractionData: { n: `${formatNum(s, loc)} cm`, d: '2', res: `${formatNum(newS, loc)} cm` },
      explanation: loc === 'el'
        ? `Διαιρούμε την αρχική πλευρά με το 2: ${formatNum(s, loc)} : 2 ＝ ${formatNum(newS, loc)} cm.`
        : `Divide initial side length by 2: ${formatNum(s, loc)} : 2 ＝ ${formatNum(newS, loc)} cm.`
    };
  }
];

// POOL ΓΙΑ Q10: Μεταβολή Εμβαδού σε Μεγέθυνση / Σμίκρυνση (λ²)
const PROBLEM_POOL_Q10 = [
  (loc) => {
    const a1 = randInt(12, 35);
    const a2 = a1 * 4;
    const correct = `${formatNum(a2, loc)} cm²`;
    return {
      title: loc === 'el' ? 'ΔΙΠΛΑΣΙΑΣΜΟΣ ΠΛΕΥΡΩΝ ΚΑΙ ΕΜΒΑΔΟΝ' : 'DOUBLING SIDES AND AREA',
      prompt: loc === 'el'
        ? `Ένα γεωμετρικό σχήμα έχει εμβαδόν ${formatNum(a1, loc)} cm². Αν διπλασιάσουμε όλες τις διαστάσεις του (συντελεστής λ ＝ 2), πόσο θα γίνει το εμβαδόν του νέου σχήματος;`
        : `A geometric figure has an area of ${formatNum(a1, loc)} cm². If we double all its dimensions (scale factor k ＝ 2), what will the area of the new figure be?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a1 * 2, loc)} cm²`,
        `${formatNum(a2 + 8, loc)} cm²`,
        `${formatNum(a2 - 8 > 0 ? a2 - 8 : a2 + 16, loc)} cm²`,
        `${formatNum(a1 * 8, loc)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: loc === 'el' ? [
        { label: 'Αρχικό εμβαδόν', value: `${formatNum(a1, loc)} cm²` },
        { label: 'Συντελεστής διαστάσεων (λ)', value: '2' },
        { label: 'Συντελεστής εμβαδού (λ²)', value: '2 · 2 ＝ 4' },
        { label: 'Νέο εμβαδόν', value: `4 · ${formatNum(a1, loc)} ＝ ${formatNum(a2, loc)} cm²` }
      ] : [
        { label: 'Initial area', value: `${formatNum(a1, loc)} cm²` },
        { label: 'Linear factor (k)', value: '2' },
        { label: 'Area factor (k²)', value: '2 · 2 ＝ 4' },
        { label: 'New area', value: `4 · ${formatNum(a1, loc)} ＝ ${formatNum(a2, loc)} cm²` }
      ],
      explanation: loc === 'el'
        ? `Όταν οι διαστάσεις διπλασιάζονται, το εμβαδόν τετραπλασιάζεται (2 · 2 ＝ 4): 4 · ${formatNum(a1, loc)} ＝ ${formatNum(a2, loc)} cm².`
        : `When linear dimensions double, area quadruples (2 · 2 ＝ 4): 4 · ${formatNum(a1, loc)} ＝ ${formatNum(a2, loc)} cm².`
    };
  },
  (loc) => {
    const a1 = randInt(6, 15);
    const a2 = a1 * 9;
    const correct = `${formatNum(a2, loc)} cm²`;
    return {
      title: loc === 'el' ? 'ΤΡΙΠΛΑΣΙΑΣΜΟΣ ΠΛΕΥΡΩΝ ΚΑΙ ΕΜΒΑΔΟΝ' : 'TRIPLING SIDES AND AREA',
      prompt: loc === 'el'
        ? `Ένα ορθογώνιο έχει εμβαδόν ${formatNum(a1, loc)} cm². Αν τριπλασιάσουμε και το μήκος και το πλάτος του (συντελεστής λ ＝ 3), ποιο θα είναι το εμβαδόν του νέου ορθογωνίου;`
        : `A rectangle has an area of ${formatNum(a1, loc)} cm². If we triple both its length and width (scale factor k ＝ 3), what will the area of the new rectangle be?`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(a1 * 3, loc)} cm²`,
        `${formatNum(a1 * 6, loc)} cm²`,
        `${formatNum(a2 + 18, loc)} cm²`,
        `${formatNum(a2 - 18 > 0 ? a2 - 18 : a2 + 36, loc)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: loc === 'el' ? [
        { label: 'Αρχικό εμβαδόν', value: `${formatNum(a1, loc)} cm²` },
        { label: 'Συντελεστής διαστάσεων (λ)', value: '3' },
        { label: 'Συντελεστής εμβαδού (λ²)', value: '3 · 3 ＝ 9' },
        { label: 'Νέο εμβαδόν', value: `9 · ${formatNum(a1, loc)} ＝ ${formatNum(a2, loc)} cm²` }
      ] : [
        { label: 'Initial area', value: `${formatNum(a1, loc)} cm²` },
        { label: 'Linear factor (k)', value: '3' },
        { label: 'Area factor (k²)', value: '3 · 3 ＝ 9' },
        { label: 'New area', value: `9 · ${formatNum(a1, loc)} ＝ ${formatNum(a2, loc)} cm²` }
      ],
      explanation: loc === 'el'
        ? `Όταν οι διαστάσεις τριπλασιάζονται, το εμβαδόν εννεαπλασιάζεται (3 · 3 ＝ 9): 9 · ${formatNum(a1, loc)} ＝ ${formatNum(a2, loc)} cm².`
        : `When dimensions triple, area increases by 3 · 3 ＝ 9 times: 9 · ${formatNum(a1, loc)} ＝ ${formatNum(a2, loc)} cm².`
    };
  },
  (loc) => {
    const correct = loc === 'el' ? '25 φορές' : '25 times';
    return {
      title: loc === 'el' ? 'ΣΥΝΤΕΛΕΣΤΗΣ ΜΕΤΑΒΟΛΗΣ ΕΜΒΑΔΟΥ' : 'AREA SCALING FACTOR',
      prompt: loc === 'el'
        ? 'Αν πενταπλασιάσουμε όλες τις πλευρές ενός γεωμετρικού σχήματος (συντελεστής λ ＝ 5), πόσες φορές μεγαλύτερο θα γίνει το εμβαδόν του;'
        : 'If we multiply all sides of a geometric figure by 5 (scale factor k ＝ 5), how many times larger does its area become?',
      options: ensureFourUniqueOptions(correct, () => loc === 'el'
        ? ['5 φορές', '10 φορές', '20 φορές', '50 φορές']
        : ['5 times', '10 times', '20 times', '50 times']
      ),
      correctAnswer: correct,
      unit: 'φορές',
      tableData: loc === 'el' ? [
        { label: 'Συντελεστής πλευρών (λ)', value: '5' },
        { label: 'Κανόνας μεταβολής εμβαδού', value: 'λ · λ ＝ λ²' },
        { label: 'Υπολογισμός', value: '5 · 5 ＝ 25 φορές' }
      ] : [
        { label: 'Side scale factor (k)', value: '5' },
        { label: 'Area scaling rule', value: 'k · k ＝ k²' },
        { label: 'Calculation', value: '5 · 5 ＝ 25 times' }
      ],
      explanation: loc === 'el'
        ? 'Το εμβαδόν μεταβάλλεται κατά το τετράγωνο του συντελεστή: 5 · 5 ＝ 25 φορές μεγαλύτερο.'
        : 'Area scales quadratically by the square of the factor: 5 · 5 ＝ 25 times larger.'
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ ΑΚΡΙΒΩΣ 10 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet(locale = 'el') {
  const qs = [];

  // Q1: Διατήρηση γωνιών στη μεγέθυνση (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: locale === 'el' ? 'ΓΩΝΙΕΣ ΚΑΙ ΜΕΓΕΘΥΝΣΗ' : 'ANGLES AND SCALING',
    prompt: isQ1True
      ? (locale === 'el'
          ? 'Όταν μεγεθύνουμε ή σμικρύνουμε ένα γεωμετρικό σχήμα, όλες οι γωνίες του παραμένουν απολύτως ίδιες (δεν αλλάζουν).'
          : 'When we enlarge or reduce a geometric shape, all its angles remain completely unchanged.')
      : (locale === 'el'
          ? 'Όταν διπλασιάζουμε τις πλευρές ενός τριγώνου, διπλασιάζονται και οι μοίρες των γωνιών του.'
          : 'When we double the side lengths of a triangle, the degree measures of its angles also double.'),
    correctAnswer: isQ1True,
    tableData: locale === 'el' ? [
      { label: 'Μήκος πλευρών', value: 'Μεταβάλλεται αναλογικά (· λ)' },
      { label: 'Μέτρο γωνιών', value: 'Παραμένει απολύτως σταθερό' },
      { label: 'Μορφή σχήματος', value: 'Διατηρείται απαράλλαχτη (όμοια σχήματα)' }
    ] : [
      { label: 'Side length', value: 'Scales proportionally (· k)' },
      { label: 'Angle measure', value: 'Remains strictly invariant' },
      { label: 'Shape geometry', value: 'Preserved completely (similar shapes)' }
    ],
    explanation: isQ1True
      ? (locale === 'el'
          ? 'ΣΩΣΤΟ: Στη μεγέθυνση και τη σμίκρυνση οι γωνίες δεν αλλάζουν ποτέ, διατηρώντας ακέραια τη γεωμετρική μορφή του σχήματος.'
          : 'CORRECT: In scaling, all angles remain invariant, preserving the geometric similarity of the figure.')
      : (locale === 'el'
          ? 'ΛΑΘΟΣ: Οι γωνίες δεν διπλασιάζονται ποτέ! Αν διπλασιάζονταν, το άθροισμα των γωνιών ενός τριγώνου θα γινόταν 360°, πράγμα αδύνατο.'
          : 'FALSE: Angles never scale! If they doubled, the triangle sum would become 360°, which is impossible.')
  });

  // Q2: Ορισμός της κλίμακας (MCQ)
  const q2Correct = locale === 'el'
    ? 'Τον λόγο του μήκους στο σχέδιο προς το πραγματικό μήκος'
    : 'The ratio of drawing length to actual real-world length';
  qs.push({
    id: 2,
    type: 'mcq',
    title: locale === 'el' ? 'ΟΡΙΣΜΟΣ ΚΛΙΜΑΚΑΣ' : 'SCALE DEFINITION',
    prompt: locale === 'el'
      ? 'Τι εκφράζει η κλίμακα σε ένα σχέδιο ή σε έναν χάρτη;'
      : 'What does scale express on a blueprint or map?',
    options: ensureFourUniqueOptions(q2Correct, () => locale === 'el'
      ? [
          'Το συνολικό βάρος του χάρτη σε γραμμάρια',
          'Τη διαφορά ανάμεσα στο μήκος και στο πλάτος',
          'Το εμβαδόν του χαρτιού σχεδίασης'
        ]
      : [
          'The total physical weight of the paper map',
          'The difference between length and width',
          'The area of the drawing paper'
        ]
    ),
    correctAnswer: q2Correct,
    tableData: locale === 'el' ? [
      { label: 'Ορισμός', value: 'Κλίμακα ＝ Μήκος στο σχέδιο : Πραγματικό μήκος' },
      { label: 'Μονάδες μέτρησης', value: 'Εκφράζονται στην ίδια μονάδα (συνήθως cm)' }
    ] : [
      { label: 'Definition', value: 'Scale ＝ Drawing length : Actual length' },
      { label: 'Units', value: 'Must be expressed in identical units (typically cm)' }
    ],
    explanation: locale === 'el'
      ? 'Η κλίμακα είναι ο μαθηματικός λόγος (διαίρεση) του μήκους στο σχέδιο προς το αντίστοιχο πραγματικό μήκος.'
      : 'Scale is the mathematical ratio of drawing length to corresponding real-world length.'
  });

  // Q3: Ερμηνεία κλίμακας 1 : 100 (MCQ)
  const q3Correct = locale === 'el'
    ? 'Ότι 1 cm στο σχέδιο αντιστοιχεί σε 100 cm (1 m) στην πραγματικότητα'
    : 'That 1 cm on the plan corresponds to 100 cm (1 m) in reality';
  qs.push({
    id: 3,
    type: 'mcq',
    title: locale === 'el' ? 'ΕΡΜΗΝΕΙΑ ΚΛΙΜΑΚΑΣ 1 : 100' : 'INTERPRETING SCALE 1 : 100',
    prompt: locale === 'el'
      ? 'Τι σημαίνει η κλίμακα 1 : 100 στην κάτοψη ενός σπιτιού;'
      : 'What does scale 1 : 100 signify on a house floor plan?',
    options: ensureFourUniqueOptions(q3Correct, () => locale === 'el'
      ? [
          'Ότι το σπίτι είναι 100 φορές μικρότερο από το σχέδιο',
          'Ότι 1 cm στο σχέδιο αντιστοιχεί σε 100 μέτρα',
          'Ότι το σχέδιο περιλαμβάνει 100 δωμάτια'
        ]
      : [
          'That the actual house is 100 times smaller than the drawing',
          'That 1 cm on the drawing equals 100 meters',
          'That the floor plan contains 100 rooms'
        ]
    ),
    correctAnswer: q3Correct,
    tableData: locale === 'el' ? [
      { label: 'Κλίμακα', value: '1 : 100' },
      { label: 'Σχέση μεγεθών', value: '1 cm στο σχέδιο ＝ 100 cm (1 m) στην πραγματικότητα' }
    ] : [
      { label: 'Scale', value: '1 : 100' },
      { label: 'Ratio equivalence', value: '1 cm on plan ＝ 100 cm (1 m) in reality' }
    ],
    explanation: locale === 'el'
      ? 'Κλίμακα 1 : 100 σημαίνει ότι κάθε 1 cm στο σχέδιο αντιστοιχεί σε 100 cm, δηλαδή ακριβώς 1 μέτρο στην πραγματικότητα.'
      : 'Scale 1 : 100 means that 1 cm on the drawing equals 100 cm (exactly 1 meter) in reality.'
  });

  // Q4: Οπτική αναγνώριση σωστής μεγέθυνσης (SVG - No Giveaway)
  const q4Correct = locale === 'el'
    ? '4 × 2 (διπλασιασμός και των δύο πλευρών)'
    : '4 × 2 (doubling both length and width)';
  qs.push({
    id: 4,
    type: 'mcq',
    title: locale === 'el' ? 'ΑΝΑΓΝΩΡΙΣΗ ΣΩΣΤΗΣ ΜΕΓΕΘΥΝΣΗΣ' : 'IDENTIFYING PROPORTIONAL SCALING',
    prompt: locale === 'el'
      ? 'Παρατηρήστε τα δύο ορθογώνια. Το αρχικό είναι 2 × 1. Ποιες διαστάσεις πρέπει να έχει το νέο ορθογώνιο ώστε να αποτελεί πραγματική μεγέθυνση (όμοιο σχήμα);'
      : 'Observe the rectangles below. The initial rectangle is 2 × 1. What dimensions must the new rectangle have to be a true geometric enlargement?',
    svg: (
      <svg viewBox="0 0 200 90" className="w-52 h-24 max-w-full mx-auto my-2 select-none drop-shadow-sm">
        <rect x="20" y="30" width="40" height="20" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
        <text x="40" y="24" fill="#4f46e5" fontSize="10" fontWeight="bold" textAnchor="middle">2 × 1</text>
        <text x="40" y="44" fill="#64748b" fontSize="9" textAnchor="middle">{locale === 'el' ? 'Αρχικό' : 'Initial'}</text>

        <rect x="100" y="15" width="80" height="40" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.5" />
        <text x="140" y="40" fill="#15803d" fontSize="11" fontWeight="black" textAnchor="middle">{locale === 'el' ? 'Νέο (?)' : 'New (?)'}</text>
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => locale === 'el'
      ? [
          '4 × 1 (διπλασιασμός μόνο του μήκους)',
          '2 × 3 (αύξηση μόνο του πλάτους)',
          '5 × 1 (επιμήκυνση)'
        ]
      : [
          '4 × 1 (doubling length only)',
          '2 × 3 (increasing width only)',
          '5 × 1 (elongation)'
        ]
    ),
    correctAnswer: q4Correct,
    tableData: locale === 'el' ? [
      { label: 'Αρχικός λόγος', value: '2 : 1 ＝ 2' },
      { label: 'Σωστή μεγέθυνση', value: 'Πολλαπλασιασμός και των δύο διαστάσεων με τον ίδιο αριθμό (2 · 2 ＝ 4 και 1 · 2 ＝ 2)' },
      { label: 'Έλεγχος λόγου', value: '4 : 2 ＝ 2 (ίδια αναλογία)' }
    ] : [
      { label: 'Initial ratio', value: '2 : 1 ＝ 2' },
      { label: 'Proper scaling', value: 'Multiplying both dimensions by the same factor (2 · 2 ＝ 4 and 1 · 2 ＝ 2)' },
      { label: 'Ratio verification', value: '4 : 2 ＝ 2 (identical proportion)' }
    ],
    explanation: locale === 'el'
      ? 'Για να είναι το σχήμα όμοιο, πρέπει να πολλαπλασιαστούν και οι δύο διαστάσεις με τον ίδιο αριθμό: 2 · 2 ＝ 4 και 1 · 2 ＝ 2.'
      : 'For shapes to remain similar, both dimensions must be multiplied by the exact same scale factor: 4 × 2.'
  });

  // Q5: Υπολογισμός πραγματικού μήκους σε κάτοψη 1 : 50 (Input αριθμού)
  const cmQ5 = randInt(4, 12);
  const realMQ5 = (cmQ5 * 50) / 100;
  qs.push({
    id: 5,
    type: 'input',
    title: locale === 'el' ? 'ΥΠΟΛΟΓΙΣΜΟΣ ΠΡΑΓΜΑΤΙΚΟΥ ΜΗΚΟΥΣ (1 : 50)' : 'CALCULATING ACTUAL LENGTH (1 : 50)',
    prompt: locale === 'el'
      ? `Σε ένα σχέδιο με κλίμακα 1 : 50, ένα έπιπλο έχει μήκος ${formatNum(cmQ5, locale)} cm. Πόσα μέτρα (m) είναι το πραγματικό του μήκος; (Γράψτε μόνο τον αριθμό)`
      : `On a drawing with scale 1 : 50, a piece of furniture measures ${formatNum(cmQ5, locale)} cm. How many meters (m) long is it in reality? (Write number only)`,
    correctAnswer: formatNum(realMQ5, locale),
    tableData: locale === 'el' ? [
      { label: 'Μήκος σχεδίου', value: `${formatNum(cmQ5, locale)} cm` },
      { label: 'Κλίμακα', value: '1 : 50' },
      { label: 'Σε εκατοστά', value: `${formatNum(cmQ5, locale)} · 50 ＝ ${formatNum(cmQ5 * 50, locale)} cm` },
      { label: 'Σε μέτρα', value: `${formatNum(realMQ5, locale)} m` }
    ] : [
      { label: 'Drawing length', value: `${formatNum(cmQ5, locale)} cm` },
      { label: 'Scale', value: '1 : 50' },
      { label: 'In centimeters', value: `${formatNum(cmQ5, locale)} · 50 ＝ ${formatNum(cmQ5 * 50, locale)} cm` },
      { label: 'In meters', value: `${formatNum(realMQ5, locale)} m` }
    ],
    fractionData: { n: `${formatNum(cmQ5 * 50, locale)} cm`, d: '100', res: `${formatNum(realMQ5, locale)} m` },
    explanation: locale === 'el'
      ? `${formatNum(cmQ5, locale)} · 50 cm ＝ ${formatNum(cmQ5 * 50, locale)} cm ＝ ${formatNum(realMQ5, locale)} m.`
      : `${formatNum(cmQ5, locale)} · 50 cm ＝ ${formatNum(cmQ5 * 50, locale)} cm ＝ ${formatNum(realMQ5, locale)} m.`
  });

  // Q6: Μεταβολή εμβαδού όταν διπλασιάζονται οι πλευρές (MCQ)
  const q6Correct = locale === 'el' ? '4 φορές (τετραπλασιάζεται)' : '4 times (quadrupled)';
  qs.push({
    id: 6,
    type: 'mcq',
    title: locale === 'el' ? 'ΜΕΤΑΒΟΛΗ ΕΜΒΑΔΟΥ ΣΕ ΜΕΓΕΘΥΝΣΗ' : 'AREA CHANGE IN ENLARGEMENT',
    prompt: locale === 'el'
      ? 'Αν διπλασιάσουμε όλες τις πλευρές ενός τετραγώνου, πόσες φορές μεγαλύτερο θα γίνει το εμβαδόν του;'
      : 'If we double all side lengths of a square, how many times larger does its area become?',
    options: ensureFourUniqueOptions(q6Correct, () => locale === 'el'
      ? ['2 φορές (διπλασιάζεται)', '8 φορές', '16 φορές']
      : ['2 times (doubled)', '8 times', '16 times']
    ),
    correctAnswer: q6Correct,
    tableData: locale === 'el' ? [
      { label: 'Συντελεστής πλευρών (λ)', value: '2' },
      { label: 'Κανόνας εμβαδού', value: 'λ · λ ＝ 2 · 2 ＝ 4' },
      { label: 'Αποτέλεσμα', value: 'Τετραπλασιάζεται' }
    ] : [
      { label: 'Side scale factor (k)', value: '2' },
      { label: 'Area scaling rule', value: 'k · k ＝ 2 · 2 ＝ 4' },
      { label: 'Result', value: 'Quadruples' }
    ],
    explanation: locale === 'el'
      ? 'Το εμβαδόν εξαρτάται από το γινόμενο δύο διαστάσεων. Αν διπλασιαστούν και οι δύο: 2 · 2 ＝ 4 φορές μεγαλύτερο.'
      : 'Area depends on two linear dimensions. Doubling both yields: 2 · 2 ＝ 4 times larger.'
  });

  // Q7: Πρόβλημα από PROBLEM_POOL_Q7 (Κλίμακες Χαρτών)
  const p7 = PROBLEM_POOL_Q7[randInt(0, PROBLEM_POOL_Q7.length - 1)](locale);
  qs.push({ id: 7, type: 'mcq', ...p7 });

  // Q8: Πρόβλημα από PROBLEM_POOL_Q8 (Κατόψεις σε m)
  const p8 = PROBLEM_POOL_Q8[randInt(0, PROBLEM_POOL_Q8.length - 1)](locale);
  qs.push({ id: 8, type: 'mcq', ...p8 });

  // Q9: Πρόβλημα από PROBLEM_POOL_Q9 (Μεταβολή Περιμέτρου)
  const p9 = PROBLEM_POOL_Q9[randInt(0, PROBLEM_POOL_Q9.length - 1)](locale);
  qs.push({ id: 9, type: 'mcq', ...p9 });

  // Q10: Πρόβλημα από PROBLEM_POOL_Q10 (Μεταβολή Εμβαδού)
  const p10 = PROBLEM_POOL_Q10[randInt(0, PROBLEM_POOL_Q10.length - 1)](locale);
  qs.push({ id: 10, type: 'mcq', ...p10 });

  return qs;
}

// -------------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΑΣΚΗΣΕΩΝ
// -------------------------------------------------------------

export default function MegethinsiSmikrinsiAskiseisPage() {
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
      headTitle: "Ασκήσεις: Μεγέθυνση, Σμίκρυνση & Κλίμακα - ΣΤ' Δημοτικού | LearnMaths.gr",
      headDesc: "Διαδραστικές ασκήσεις στην κλίμακα, τους χάρτες, τη μεγέθυνση και τη σμίκρυνση σχημάτων για τη ΣΤ' Δημοτικού.",
      backTheory: "Θεωρία Κεφ. 70",
      btnTheory: "📖 Θεωρία",
      badge: "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 70 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Ασκήσεις: Μεγέθυνση, Σμίκρυνση και Κλίμακα",
      heroDesc: "Εξασκηθείτε στους υπολογισμούς κλίμακας σε χάρτες και κατόψεις, καθώς και στη μεταβολή περιμέτρου και εμβαδού μέσα από 10 δυναμικές ερωτήσεις.",
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
      headTitle: "Exercises: Scaling & Map Scale - 6th Grade | LearnMaths.gr",
      headDesc: "Interactive exercises on map scale, blueprints, enlargements, and reductions for 6th Grade.",
      backTheory: "Theory Chap. 70",
      btnTheory: "📖 Theory",
      badge: "EXERCISES • CHAPTER 70 • 6TH GRADE",
      heroTitle: "Exercises: Enlargement, Reduction and Scale",
      heroDesc: "Practice scale calculations on maps and architectural plans, as well as perimeter and area scaling through 10 dynamic questions.",
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
      backUrl="/st-dimotikou/70-megethinsi-smikrinsi"
      backText={ui.backTheory}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/70-megethinsi-smikrinsi"
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
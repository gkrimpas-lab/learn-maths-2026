// pages/st-dimotikou/70-megethinsi-smikrinsi-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// -------------------------------------------------------------
// DEFENSIVE UTILITY FUNCTIONS
// -------------------------------------------------------------

function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
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

function formatNum(val) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString('el-GR');
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
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (POOLS) ΓΙΑ Q9, Q10, Q11, Q12
// -------------------------------------------------------------

// POOL ΓΙΑ Q9: Κλίμακα Χάρτη & Πραγματικές Αποστάσεις σε km
const PROBLEM_POOL_Q9 = [
  // 1. Κλίμακα 1 : 200.000
  () => {
    const cm = randInt(3, 8);
    const scale = 200000;
    const km = (cm * scale) / 100000;
    const correct = `${formatNum(km)} km`;
    return {
      title: 'ΑΠΟΣΤΑΣΗ ΣΕ ΧΑΡΤΗ 1 : 200.000',
      prompt: `Σε έναν οδικό χάρτη με κλίμακα 1 : 200.000, η απόσταση ανάμεσα σε δύο χωριά είναι ${cm} cm. Πόσα χιλιόμετρα (km) απέχουν τα δύο χωριά στην πραγματικότητα;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(km + 4)} km`,
        `${formatNum(km - 2 > 0 ? km - 2 : km + 8)} km`,
        `${formatNum(km * 2)} km`,
        `${formatNum(km / 2)} km`
      ]),
      correctAnswer: correct,
      unit: 'km',
      tableData: [
        { label: 'Απόσταση στον χάρτη', value: `${cm} cm` },
        { label: 'Κλίμακα', value: '1 : 200.000' },
        { label: 'Πραγματική απόσταση σε cm', value: `${cm} · 200.000 ＝ ${formatNum(cm * scale)} cm` },
        { label: 'Μετατροπή σε km (: 100.000)', value: `${formatNum(km)} km` }
      ],
      explanation: `Πολλαπλασιάζουμε με την κλίμακα: ${cm} · 200.000 ＝ ${formatNum(cm * scale)} cm. Διαιρούμε με το 100.000 για να βρούμε τα χιλιόμετρα: ${formatNum(km)} km.`
    };
  },
  // 2. Κλίμακα 1 : 50.000
  () => {
    const cm = randInt(4, 12);
    const scale = 50000;
    const km = (cm * scale) / 100000;
    const correct = `${formatNum(km)} km`;
    return {
      title: 'ΑΠΟΣΤΑΣΗ ΣΕ ΠΕΖΟΠΟΡΙΚΟ ΧΑΡΤΗ 1 : 50.000',
      prompt: `Σε έναν πεζοπορικό χάρτη με κλίμακα 1 : 50.000, ένα μονοπάτι έχει μήκος ${cm} cm. Πόσα χιλιόμετρα είναι το πραγματικό μήκος του μονοπατιού;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(km + 1)} km`,
        `${formatNum(km - 1 > 0 ? km - 1 : km + 3)} km`,
        `${formatNum(km * 10)} km`,
        `${formatNum(km + 2.5)} km`
      ]),
      correctAnswer: correct,
      unit: 'km',
      tableData: [
        { label: 'Μήκος στον χάρτη', value: `${cm} cm` },
        { label: 'Κλίμακα', value: '1 : 50.000' },
        { label: 'Πραγματικό μήκος σε cm', value: `${cm} · 50.000 ＝ ${formatNum(cm * scale)} cm` },
        { label: 'Μετατροπή σε km (: 100.000)', value: `${formatNum(km)} km` }
      ],
      explanation: `${cm} · 50.000 ＝ ${formatNum(cm * scale)} cm ＝ ${formatNum(km)} km.`
    };
  },
  // 3. Κλίμακα 1 : 1.000.000
  () => {
    const cm = randInt(3, 9);
    const km = cm * 10;
    const correct = `${km} km`;
    return {
      title: 'ΑΠΟΣΤΑΣΗ ΣΕ ΓΕΩΓΡΑΦΙΚΟ ΧΑΡΤΗ 1 : 1.000.000',
      prompt: `Σε έναν γεωγραφικό χάρτη της Ελλάδας με κλίμακα 1 : 1.000.000, δύο πόλεις απέχουν ${cm} cm. Πόση είναι η πραγματική τους απόσταση σε km;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${km + 20} km`,
        `${km - 10 > 0 ? km - 10 : km + 30} km`,
        `${km * 2} km`,
        `${cm} km`
      ]),
      correctAnswer: correct,
      unit: 'km',
      tableData: [
        { label: 'Απόσταση στον χάρτη', value: `${cm} cm` },
        { label: 'Κλίμακα', value: '1 : 1.000.000 (1 cm ＝ 10 km)' },
        { label: 'Πράξη', value: `${cm} · 10 km` },
        { label: 'Πραγματική απόσταση', value: `${km} km` }
      ],
      explanation: `Στην κλίμακα 1 : 1.000.000, κάθε 1 cm στον χάρτη αντιστοιχεί σε 10 km. Επομένως: ${cm} · 10 ＝ ${km} km.`
    };
  },
  // 4. Κλίμακα 1 : 100.000
  () => {
    const cm = randInt(5, 15);
    const km = cm;
    const correct = `${km} km`;
    return {
      title: 'ΑΠΟΣΤΑΣΗ ΣΕ ΧΑΡΤΗ 1 : 100.000',
      prompt: `Σε έναν χάρτη με κλίμακα 1 : 100.000, η ευθεία απόσταση ανάμεσα σε δύο λιμάνια είναι ${cm} cm. Πόσα km απέχουν στην πραγματικότητα;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${km * 10} km`,
        `${km + 5} km`,
        `${km - 3 > 0 ? km - 3 : km + 8} km`,
        `${formatNum(km / 10)} km`
      ]),
      correctAnswer: correct,
      unit: 'km',
      tableData: [
        { label: 'Απόσταση στον χάρτη', value: `${cm} cm` },
        { label: 'Κλίμακα', value: '1 : 100.000 (1 cm ＝ 1 km)' },
        { label: 'Πράξη', value: `${cm} · 1 km` },
        { label: 'Πραγματική απόσταση', value: `${km} km` }
      ],
      explanation: `Επειδή 100.000 cm ＝ 1 km, κάθε 1 cm στον χάρτη ισοδυναμεί ακριβώς με 1 km: ${km} km.`
    };
  },
  // 5. Κλίμακα 1 : 400.000
  () => {
    const cm = randInt(2, 6);
    const scale = 400000;
    const km = (cm * scale) / 100000;
    const correct = `${km} km`;
    return {
      title: 'ΑΠΟΣΤΑΣΗ ΣΕ ΧΑΡΤΗ 1 : 400.000',
      prompt: `Σε έναν χάρτη με κλίμακα 1 : 400.000, η απόσταση ανάμεσα σε δύο νησιά είναι ${cm} cm. Πόση είναι η πραγματική τους απόσταση σε km;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${km + 8} km`,
        `${km - 4 > 0 ? km - 4 : km + 12} km`,
        `${km * 2} km`,
        `${cm * 10} km`
      ]),
      correctAnswer: correct,
      unit: 'km',
      tableData: [
        { label: 'Απόσταση στον χάρτη', value: `${cm} cm` },
        { label: 'Κλίμακα', value: '1 : 400.000' },
        { label: 'Πράξη σε cm', value: `${cm} · 400.000 ＝ ${formatNum(cm * scale)} cm` },
        { label: 'Σε χιλιόμετρα', value: `${km} km` }
      ],
      explanation: `${cm} · 400.000 cm ＝ ${formatNum(cm * scale)} cm ＝ ${km} km.`
    };
  },
  // 6. Κλίμακα 1 : 25.000
  () => {
    const cm = randInt(4, 16);
    const scale = 25000;
    const km = (cm * scale) / 100000;
    const correct = `${formatNum(km)} km`;
    return {
      title: 'ΑΠΟΣΤΑΣΗ ΣΕ ΤΟΠΟΓΡΑΦΙΚΟ ΧΑΡΤΗ 1 : 25.000',
      prompt: `Σε έναν τοπογραφικό χάρτη με κλίμακα 1 : 25.000, η απόσταση δύο καταφυγίων είναι ${cm} cm. Πόσα χιλιόμετρα είναι η πραγματική απόσταση;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(km + 1.5)} km`,
        `${formatNum(km - 0.5 > 0 ? km - 0.5 : km + 2.5)} km`,
        `${formatNum(km * 4)} km`,
        `${formatNum(km / 2)} km`
      ]),
      correctAnswer: correct,
      unit: 'km',
      tableData: [
        { label: 'Απόσταση στον χάρτη', value: `${cm} cm` },
        { label: 'Κλίμακα', value: '1 : 25.000' },
        { label: 'Πράξη σε cm', value: `${cm} · 25.000 ＝ ${formatNum(cm * scale)} cm` },
        { label: 'Σε χιλιόμετρα', value: `${formatNum(km)} km` }
      ],
      explanation: `${cm} · 25.000 cm ＝ ${formatNum(cm * scale)} cm ＝ ${formatNum(km)} km.`
    };
  }
];

// POOL ΓΙΑ Q10: Αρχιτεκτονικά Σχέδια & Κάτοψη Κατοικίας σε m
const PROBLEM_POOL_Q10 = [
  // 1. Κάτοψη 1 : 50
  () => {
    const wCm = randInt(6, 12);
    const realM = (wCm * 50) / 100;
    const correct = `${formatNum(realM)} m`;
    return {
      title: 'ΜΗΚΟΣ ΤΟΙΧΟΥ ΣΕ ΚΑΤΟΨΗ 1 : 50',
      prompt: `Στο αρχιτεκτονικό σχέδιο ενός σπιτιού με κλίμακα 1 : 50, ένας τοίχος έχει μήκος ${wCm} cm. Πόσα μέτρα (m) είναι το πραγματικό μήκος του τοίχου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(realM + 1.5)} m`,
        `${formatNum(realM - 1 > 0 ? realM - 1 : realM + 3)} m`,
        `${formatNum(realM * 2)} m`,
        `${formatNum(wCm)} m`
      ]),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Μήκος στο σχέδιο', value: `${wCm} cm` },
        { label: 'Κλίμακα', value: '1 : 50' },
        { label: 'Πραγματικό μήκος σε cm', value: `${wCm} · 50 ＝ ${wCm * 50} cm` },
        { label: 'Μετατροπή σε m (: 100)', value: `${formatNum(realM)} m` }
      ],
      explanation: `${wCm} · 50 ＝ ${wCm * 50} cm ＝ ${formatNum(realM)} m.`
    };
  },
  // 2. Κάτοψη 1 : 100
  () => {
    const wCm = randInt(5, 14);
    const realM = wCm;
    const correct = `${realM} m`;
    return {
      title: 'ΔΙΑΣΤΑΣΗ ΣΕ ΚΑΤΟΨΗ 1 : 100',
      prompt: `Στην κάτοψη ενός οικοπέδου με κλίμακα 1 : 100, η πρόσοψη σχεδιάστηκε με μήκος ${wCm} cm. Πόσα μέτρα (m) είναι η πραγματική πρόσοψη;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${realM * 10} m`,
        `${realM + 4} m`,
        `${realM - 2 > 0 ? realM - 2 : realM + 6} m`,
        `${formatNum(realM / 10)} m`
      ]),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Μήκος στο σχέδιο', value: `${wCm} cm` },
        { label: 'Κλίμακα', value: '1 : 100 (1 cm ＝ 1 m)' },
        { label: 'Πράξη', value: `${wCm} · 1 m` },
        { label: 'Πραγματικό μήκος', value: `${realM} m` }
      ],
      explanation: `Στην κλίμακα 1 : 100, κάθε 1 cm στο χαρτί αντιστοιχεί σε 100 cm (1 m). Άρα: ${realM} m.`
    };
  },
  // 3. Εμβαδόν δωματίου από σχέδιο 1 : 50
  () => {
    const lCm = 8;
    const wCm = 6;
    const realL = (lCm * 50) / 100;
    const realW = (wCm * 50) / 100;
    const area = realL * realW;
    const correct = `${area} m²`;
    return {
      title: 'ΕΜΒΑΔΟΝ ΔΩΜΑΤΙΟΥ ΑΠΟ ΚΑΤΟΨΗ 1 : 50',
      prompt: `Στην κάτοψη με κλίμακα 1 : 50, ένα δωμάτιο έχει διαστάσεις 8 cm και 6 cm. Πόσο είναι το πραγματικό εμβαδόν του δωματίου σε m²;`,
      options: ensureFourUniqueOptions(correct, () => ['24 m²', '48 m²', '16 m²', '10 m²']),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Πραγματικό μήκος', value: '8 cm · 50 ＝ 400 cm ＝ 4 m' },
        { label: 'Πραγματικό πλάτος', value: '6 cm · 50 ＝ 300 cm ＝ 3 m' },
        { label: 'Πράξη εμβαδού', value: '4 m · 3 m' },
        { label: 'Πραγματικό εμβαδόν', value: `${area} m²` }
      ],
      explanation: `Βρίσκουμε πρώτα τις πραγματικές διαστάσεις: 4 m και 3 m. Εμβαδόν: 4 · 3 ＝ 12 m².`
    };
  },
  // 4. Σχέδιο σχολικής αίθουσας 1 : 200
  () => {
    const cm = randInt(3, 7);
    const realM = (cm * 200) / 100;
    const correct = `${formatNum(realM)} m`;
    return {
      title: 'ΣΧΕΔΙΟ ΣΧΟΛΙΚΗΣ ΑΙΘΟΥΣΑΣ 1 : 200',
      prompt: `Στο γενικό σχέδιο ενός σχολείου με κλίμακα 1 : 200, το πλάτος μιας αίθουσας είναι ${cm} cm. Πόσα μέτρα (m) είναι το πραγματικό της πλάτος;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(realM + 2)} m`,
        `${formatNum(realM - 2 > 0 ? realM - 2 : realM + 4)} m`,
        `${formatNum(realM * 2)} m`,
        `${formatNum(cm)} m`
      ]),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Πλάτος σχεδίου', value: `${cm} cm` },
        { label: 'Κλίμακα', value: '1 : 200' },
        { label: 'Σε εκατοστά', value: `${cm} · 200 ＝ ${cm * 200} cm` },
        { label: 'Σε μέτρα', value: `${formatNum(realM)} m` }
      ],
      explanation: `${cm} · 200 cm ＝ ${cm * 200} cm ＝ ${formatNum(realM)} m.`
    };
  },
  // 5. Ύψος κτιρίου σε σχέδιο 1 : 100
  () => {
    const cm = randInt(8, 16);
    const realM = cm;
    const correct = `${realM} m`;
    return {
      title: 'ΥΨΟΣ ΚΤΙΡΙΟΥ ΣΕ ΤΟΜΗ 1 : 100',
      prompt: `Στην κατακόρυφη τομή μιας πολυκατοικίας με κλίμακα 1 : 100, το συνολικό ύψος σχεδιάστηκε ίσο με ${cm} cm. Πόσα μέτρα (m) είναι το πραγματικό ύψος του κτιρίου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${realM * 10} m`,
        `${realM + 5} m`,
        `${realM - 3 > 0 ? realM - 3 : realM + 6} m`,
        `${formatNum(realM / 10)} m`
      ]),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Ύψος σχεδίου', value: `${cm} cm` },
        { label: 'Κλίμακα', value: '1 : 100' },
        { label: 'Πραγματικό ύψος', value: `${cm} · 1 m ＝ ${realM} m` }
      ],
      explanation: `1 cm στο σχέδιο ισούται με 1 m στην πραγματικότητα: ${realM} m.`
    };
  },
  // 6. Πισίνα σε σχέδιο 1 : 50
  () => {
    const cm = 16;
    const realM = (cm * 50) / 100;
    const correct = `${realM} m`;
    return {
      title: 'ΜΗΚΟΣ ΠΙΣΙΝΑΣ ΣΕ ΣΧΕΔΙΟ 1 : 50',
      prompt: `Το μήκος μιας πισίνας σε σχέδιο με κλίμακα 1 : 50 είναι 16 cm. Πόσα μέτρα είναι το πραγματικό μήκος της πισίνας;`,
      options: ensureFourUniqueOptions(correct, () => ['12 m', '10 m', '6 m', '16 m']),
      correctAnswer: correct,
      unit: 'm',
      tableData: [
        { label: 'Μήκος σχεδίου', value: '16 cm' },
        { label: 'Κλίμακα', value: '1 : 50' },
        { label: 'Πράξη', value: '16 · 50 ＝ 800 cm ＝ 8 m' }
      ],
      explanation: `16 · 50 cm ＝ 800 cm ＝ 8 m.`
    };
  }
];

// POOL ΓΙΑ Q11: Μεταβολή Περιμέτρου & Διαστάσεων Σχημάτων
const PROBLEM_POOL_Q11 = [
  // 1. Τριπλασιασμός πλευράς τετραγώνου
  () => {
    const s = randInt(4, 9);
    const p1 = 4 * s;
    const p2 = 3 * p1;
    const correct = `${p2} cm`;
    return {
      title: 'ΤΡΙΠΛΑΣΙΑΣΜΟΣ ΠΕΡΙΜΕΤΡΟΥ ΤΕΤΡΑΓΩΝΟΥ',
      prompt: `Ένα τετράγωνο έχει πλευρά ${s} cm. Αν τριπλασιάσουμε το μήκος της πλευράς του (μεγέθυνση με συντελεστή 3), πόση θα γίνει η νέα περίμετρος;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${p1} cm`,
        `${p2 + 12} cm`,
        `${p2 - 12} cm`,
        `${4 * s * 9} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Αρχική περίμετρος', value: `4 · ${s} ＝ ${p1} cm` },
        { label: 'Συντελεστής μεγέθυνσης', value: '3' },
        { label: 'Νέα περίμετρος', value: `3 · ${p1} ＝ ${p2} cm (ή 4 · ${3 * s} ＝ ${p2} cm)` }
      ],
      explanation: `Όταν τριπλασιάζεται η πλευρά, τριπλασιάζεται και η περίμετρος: 3 · ${p1} cm ＝ ${p2} cm.`
    };
  },
  // 2. Διπλασιασμός διαστάσεων ορθογωνίου
  () => {
    const w = randInt(3, 6);
    const l = randInt(7, 10);
    const p1 = 2 * (w + l);
    const p2 = 2 * p1;
    const correct = `${p2} cm`;
    return {
      title: 'ΔΙΠΛΑΣΙΑΣΜΟΣ ΠΕΡΙΜΕΤΡΟΥ ΟΡΘΟΓΩΝΙΟΥ',
      prompt: `Ένα ορθογώνιο έχει διαστάσεις ${w} cm και ${l} cm. Αν διπλασιάσουμε όλες τις πλευρές του, πόση θα είναι η περίμετρος του νέου ορθογωνίου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${p1} cm`,
        `${p2 + 8} cm`,
        `${p2 - 6} cm`,
        `${4 * p1} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Αρχική περίμετρος', value: `2 · (${w} ＋ ${l}) ＝ ${p1} cm` },
        { label: 'Συντελεστής', value: '2' },
        { label: 'Νέα περίμετρος', value: `2 · ${p1} ＝ ${p2} cm` }
      ],
      explanation: `Όταν διπλασιάζονται οι πλευρές, η περίμετρος διπλασιάζεται: 2 · ${p1} ＝ ${p2} cm.`
    };
  },
  // 3. Σμίκρυνση στο 1/2
  () => {
    const s = randInt(10, 20) * 2;
    const newS = s / 2;
    const correct = `${newS} cm`;
    return {
      title: 'ΣΜΙΚΡΥΝΣΗ ΠΛΕΥΡΑΣ ΣΤΟ ΜΙΣΟ',
      prompt: `Ένα κανονικό εξάγωνο έχει πλευρά ${s} cm. Αν το σμικρύνουμε στο μισό (συντελεστής 0,5), πόσο θα είναι το μήκος της πλευράς του νέου εξαγώνου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${newS + 4} cm`,
        `${newS - 3 > 0 ? newS - 3 : newS + 6} cm`,
        `${s} cm`,
        `${s * 2} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Αρχική πλευρά', value: `${s} cm` },
        { label: 'Σμίκρυνση', value: 'Στο μισό (: 2)' },
        { label: 'Νέα πλευρά', value: `${s} : 2 ＝ ${newS} cm` }
      ],
      explanation: `Διαιρούμε την αρχική πλευρά με το 2: ${s} : 2 ＝ ${newS} cm.`
    };
  },
  // 4. Περίμετρος ισοπλεύρου τριγώνου επί 4
  () => {
    const s = randInt(3, 7);
    const p1 = 3 * s;
    const p2 = 4 * p1;
    const correct = `${p2} cm`;
    return {
      title: 'ΤΕΤΡΑΠΛΑΣΙΑΣΜΟΣ ΠΕΡΙΜΕΤΡΟΥ ΤΡΙΓΩΝΟΥ',
      prompt: `Ένα ισόπλευρο τρίγωνο έχει πλευρά ${s} cm (περίμετρος ${p1} cm). Αν τετραπλασιάσουμε το μήκος των πλευρών του, πόση θα γίνει η νέα του περίμετρος;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${p2 + 12} cm`,
        `${p2 - 12} cm`,
        `${p1 * 2} cm`,
        `${p1 * 16} cm`
      ]),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Αρχική περίμετρος', value: `${p1} cm` },
        { label: 'Συντελεστής μεγέθυνσης', value: '4' },
        { label: 'Νέα περίμετρος', value: `4 · ${p1} ＝ ${p2} cm` }
      ],
      explanation: `Η νέα περίμετρος τετραπλασιάζεται: 4 · ${p1} ＝ ${p2} cm.`
    };
  },
  // 5. Σμίκρυνση στο ένα τρίτο (1/3)
  () => {
    const p = 36;
    const newP = p / 3;
    const correct = `${newP} cm`;
    return {
      title: 'ΣΜΙΚΡΥΝΣΗ ΠΕΡΙΜΕΤΡΟΥ ΣΤΟ ΕΝΑ ΤΡΙΤΟ',
      prompt: `Ένα σχήμα έχει περίμετρο 36 cm. Αν το σμικρύνουμε ώστε όλες οι πλευρές του να γίνουν 3 φορές μικρότερες, πόση θα είναι η νέα του περίμετρος;`,
      options: ensureFourUniqueOptions(correct, () => ['9 cm', '18 cm', '4 cm', '24 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Αρχική περίμετρος', value: '36 cm' },
        { label: 'Σμίκρυνση', value: '3 φορές μικρότερη (: 3)' },
        { label: 'Νέα περίμετρος', value: '36 : 3 ＝ 12 cm' }
      ],
      explanation: `36 : 3 ＝ 12 cm.`
    };
  },
  // 6. Μεγέθυνση επί 5
  () => {
    const s = 4;
    const newS = s * 5;
    const correct = `${newS} cm`;
    return {
      title: 'ΜΕΓΕΘΥΝΣΗ ΠΛΕΥΡΑΣ ΕΠΙ 5',
      prompt: `Ένα κανονικό οκτάγωνο έχει πλευρά 4 cm. Αν μεγεθυνθεί με κλίμακα 5 : 1, πόσο θα είναι το μήκος της πλευράς του στο νέο σχήμα;`,
      options: ensureFourUniqueOptions(correct, () => ['15 cm', '25 cm', '16 cm', '40 cm']),
      correctAnswer: correct,
      unit: 'cm',
      tableData: [
        { label: 'Αρχική πλευρά', value: '4 cm' },
        { label: 'Κλίμακα μεγέθυνσης', value: '5 : 1 (· 5)' },
        { label: 'Νέα πλευρά', value: '4 · 5 ＝ 20 cm' }
      ],
      explanation: `4 · 5 ＝ 20 cm.`
    };
  }
];

// POOL ΓΙΑ Q12: Μεταβολή Εμβαδού σε Μεγέθυνση / Σμίκρυνση (λ²)
const PROBLEM_POOL_Q12 = [
  // 1. Διπλασιασμός πλευράς (τετραπλασιασμός εμβαδού)
  () => {
    const a1 = randInt(12, 35);
    const a2 = a1 * 4;
    const correct = `${a2} cm²`;
    return {
      title: 'ΔΙΠΛΑΣΙΑΣΜΟΣ ΠΛΕΥΡΩΝ ΚΑΙ ΕΜΒΑΔΟΝ',
      prompt: `Ένα γεωμετρικό σχήμα έχει εμβαδόν ${a1} cm². Αν διπλασιάσουμε όλες τις διαστάσεις του (συντελεστής λ ＝ 2), πόσο θα γίνει το εμβαδόν του νέου σχήματος;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${a1 * 2} cm²`,
        `${a2 + 8} cm²`,
        `${a2 - 8} cm²`,
        `${a1 * 8} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Αρχικό εμβαδόν', value: `${a1} cm²` },
        { label: 'Συντελεστής διαστάσεων (λ)', value: '2' },
        { label: 'Συντελεστής εμβαδού (λ²)', value: '2 · 2 ＝ 4' },
        { label: 'Νέο εμβαδόν', value: `4 · ${a1} ＝ ${a2} cm²` }
      ],
      explanation: `Όταν οι διαστάσεις διπλασιάζονται, το εμβαδόν τετραπλασιάζεται (2 · 2 ＝ 4): 4 · ${a1} ＝ ${a2} cm².`
    };
  },
  // 2. Τριπλασιασμός πλευράς (εννεαπλασιασμός εμβαδού)
  () => {
    const a1 = randInt(6, 15);
    const a2 = a1 * 9;
    const correct = `${a2} cm²`;
    return {
      title: 'ΤΡΙΠΛΑΣΙΑΣΜΟΣ ΠΛΕΥΡΩΝ ΚΑΙ ΕΜΒΑΔΟΝ',
      prompt: `Ένα ορθογώνιο έχει εμβαδόν ${a1} cm². Αν τριπλασιάσουμε και το μήκος και το πλάτος του (συντελεστής λ ＝ 3), ποιο θα είναι το εμβαδόν του νέου ορθογωνίου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${a1 * 3} cm²`,
        `${a1 * 6} cm²`,
        `${a2 + 18} cm²`,
        `${a2 - 18} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Αρχικό εμβαδόν', value: `${a1} cm²` },
        { label: 'Συντελεστής διαστάσεων (λ)', value: '3' },
        { label: 'Συντελεστής εμβαδού (λ²)', value: '3 · 3 ＝ 9' },
        { label: 'Νέο εμβαδόν', value: `9 · ${a1} ＝ ${a2} cm²` }
      ],
      explanation: `Όταν οι διαστάσεις τριπλασιάζονται, το εμβαδόν γίνεται 3 · 3 ＝ 9 φορές μεγαλύτερο: 9 · ${a1} ＝ ${a2} cm².`
    };
  },
  // 3. Σμίκρυνση στο 1/2 (εμβαδόν στο 1/4)
  () => {
    const a1 = randInt(10, 25) * 4;
    const a2 = a1 / 4;
    const correct = `${a2} cm²`;
    return {
      title: 'ΣΜΙΚΡΥΝΣΗ ΣΤΟ ΜΙΣΟ ΚΑΙ ΕΜΒΑΔΟΝ',
      prompt: `Ένα τετράγωνο έχει εμβαδόν ${a1} cm². Αν υποδιπλασιάσουμε την πλευρά του (σμίκρυνση στο μισό, συντελεστής 0,5), πόσο θα γίνει το εμβαδόν του νέου τετραγώνου;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${a1 / 2} cm²`,
        `${a2 + 6} cm²`,
        `${a2 - 4 > 0 ? a2 - 4 : a2 + 8} cm²`,
        `${a1 / 8} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Αρχικό εμβαδόν', value: `${a1} cm²` },
        { label: 'Σμίκρυνση πλευράς', value: 'Στο μισό (: 2)' },
        { label: 'Μεταβολή εμβαδού', value: 'Στο ένα τέταρτο (: 4)' },
        { label: 'Νέο εμβαδόν', value: `${a1} : 4 ＝ ${a2} cm²` }
      ],
      explanation: `Όταν η πλευρά υποδιπλασιάζεται, το εμβαδόν διαιρείται με το 2 · 2 ＝ 4: ${a1} : 4 ＝ ${a2} cm².`
    };
  },
  // 4. Τετραπλασιασμός πλευράς (εμβαδόν επί 16)
  () => {
    const a1 = 5;
    const a2 = a1 * 16;
    const correct = `${a2} cm²`;
    return {
      title: 'ΤΕΤΡΑΠΛΑΣΙΑΣΜΟΣ ΠΛΕΥΡΩΝ ΚΑΙ ΕΜΒΑΔΟΝ',
      prompt: `Ένα μικρό παραλληλόγραμμο έχει εμβαδόν 5 cm². Αν τετραπλασιάσουμε όλες τις διαστάσεις του (συντελεστής λ ＝ 4), πόσο θα είναι το εμβαδόν του νέου σχήματος;`,
      options: ensureFourUniqueOptions(correct, () => ['20 cm²', '40 cm²', '100 cm²', '64 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Αρχικό εμβαδόν', value: '5 cm²' },
        { label: 'Συντελεστής διαστάσεων (λ)', value: '4' },
        { label: 'Συντελεστής εμβαδού (λ²)', value: '4 · 4 ＝ 16' },
        { label: 'Νέο εμβαδόν', value: '5 · 16 ＝ 80 cm²' }
      ],
      explanation: `Το εμβαδόν πολλαπλασιάζεται επί 4 · 4 ＝ 16: 5 · 16 ＝ 80 cm².`
    };
  },
  // 5. Φωτοτυπία μεγέθυνσης 200%
  () => {
    const a1 = 50;
    const a2 = a1 * 4;
    const correct = `${a2} cm²`;
    return {
      title: 'ΜΕΓΕΘΥΝΣΗ ΦΩΤΟΤΥΠΙΑΣ 200%',
      prompt: `Μια φωτογραφία με εμβαδόν 50 cm² μεγεθύνεται σε φωτοτυπικό μηχάνημα σε ποσοστό 200% (διπλασιασμός μήκους και πλάτους, συντελεστής λ ＝ 2). Ποιο θα είναι το εμβαδόν της νέας φωτογραφίας;`,
      options: ensureFourUniqueOptions(correct, () => ['100 cm²', '150 cm²', '250 cm²', '400 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Αρχικό εμβαδόν', value: '50 cm²' },
        { label: 'Ποσοστό μεγέθυνσης 200%', value: 'Διπλασιασμός διαστάσεων (λ ＝ 2)' },
        { label: 'Μεταβολή εμβαδού', value: '2 · 2 ＝ 4 φορές μεγαλύτερο' },
        { label: 'Νέο εμβαδόν', value: '50 · 4 ＝ 200 cm²' }
      ],
      explanation: `Ο διπλασιασμός των διαστάσεων τετραπλασιάζει το εμβαδόν: 50 · 4 ＝ 200 cm².`
    };
  },
  // 6. Πόσες φορές μεγαλώνει το εμβαδόν αν λ ＝ 5
  () => {
    const correct = '25 φορές';
    return {
      title: 'ΣΥΝΤΕΛΕΣΤΗΣ ΜΕΤΑΒΟΛΗΣ ΕΜΒΑΔΟΥ',
      prompt: `Αν πενταπλασιάσουμε όλες τις πλευρές ενός γεωμετρικού σχήματος (συντελεστής λ ＝ 5), πόσες φορές μεγαλύτερο θα γίνει το εμβαδόν του;`,
      options: ensureFourUniqueOptions(correct, () => ['5 φορές', '10 φορές', '20 φορές', '50 φορές']),
      correctAnswer: correct,
      unit: 'φορές',
      tableData: [
        { label: 'Συντελεστής πλευρών (λ)', value: '5' },
        { label: 'Κανόνας μεταβολής εμβαδού', value: 'λ · λ ＝ λ²' },
        { label: 'Υπολογισμός', value: '5 · 5 ＝ 25 φορές' }
      ],
      explanation: `Το εμβαδόν μεταβάλλεται κατά το τετράγωνο του συντελεστή: 5 · 5 ＝ 25 φορές μεγαλύτερο.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Διατήρηση γωνιών στη μεγέθυνση (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΓΩΝΙΕΣ ΚΑΙ ΜΕΓΕΘΥΝΣΗ',
    prompt: isQ1True
      ? 'Όταν μεγεθύνουμε ή σμικρύνουμε ένα γεωμετρικό σχήμα, όλες οι γωνίες του παραμένουν απολύτως ίδιες (δεν αλλάζουν).'
      : 'Όταν διπλασιάζουμε τις πλευρές ενός τριγώνου, διπλασιάζονται και οι μοίρες των γωνιών του.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Μήκος πλευρών', value: 'Μεταβάλλεται αναλογικά (· λ)' },
      { label: 'Μέτρο γωνιών', value: 'Παραμένει απολύτως σταθερό' },
      { label: 'Μορφή σχήματος', value: 'Διατηρείται απαράλλαχτη (όμοια σχήματα)' }
    ],
    explanation: isQ1True
      ? 'ΣΩΣΤΟ: Στη μεγέθυνση και τη σμίκρυνση οι γωνίες δεν αλλάζουν ποτέ, διατηρώντας ακέραια τη γεωμετρική μορφή του σχήματος.'
      : 'ΛΑΘΟΣ: Οι γωνίες δεν διπλασιάζονται ποτέ! Αν διπλασιάζονταν, το άθροισμα των γωνιών ενός τριγώνου θα γινόταν 360°, πράγμα αδύνατο.'
  });

  // Q2: Ορισμός της κλίμακας (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΟΡΙΣΜΟΣ ΚΛΙΜΑΚΑΣ',
    prompt: 'Τι εκφράζει η κλίμακα σε ένα σχέδιο ή σε έναν χάρτη;',
    options: ensureFourUniqueOptions(
      'Τον λόγο του μήκους στο σχέδιο προς το πραγματικό μήκος',
      () => [
        'Το συνολικό βάρος του χάρτη σε γραμμάρια',
        'Τη διαφορά ανάμεσα στο μήκος και στο πλάτος',
        'Το εμβαδόν του χαρτιού σχεδίασης'
      ]
    ),
    correctAnswer: 'Τον λόγο του μήκους στο σχέδιο προς το πραγματικό μήκος',
    tableData: [
      { label: 'Ορισμός', value: 'Κλίμακα ＝ Μήκος στο σχέδιο : Πραγματικό μήκος' },
      { label: 'Μονάδες μέτρησης', value: 'Εκφράζονται στην ίδια μονάδα (συνήθως cm)' }
    ],
    explanation: 'Η κλίμακα είναι ο μαθηματικός λόγος (διαίρεση) του μήκους στο σχέδιο προς το αντίστοιχο πραγματικό μήκος.'
  });

  // Q3: Ερμηνεία κλίμακας 1 : 100 (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΕΡΜΗΝΕΙΑ ΚΛΙΜΑΚΑΣ 1 : 100',
    prompt: 'Τι σημαίνει η κλίμακα 1 : 100 στην κάτοψη ενός σπιτιού;',
    options: ensureFourUniqueOptions(
      'Ότι 1 cm στο σχέδιο αντιστοιχεί σε 100 cm (1 m) στην πραγματικότητα',
      () => [
        'Ότι το σπίτι είναι 100 φορές μικρότερο από το σχέδιο',
        'Ότι 1 cm στο σχέδιο αντιστοιχεί σε 100 μέτρα',
        'Ότι το σχέδιο περιλαμβάνει 100 δωμάτια'
      ]
    ),
    correctAnswer: 'Ότι 1 cm στο σχέδιο αντιστοιχεί σε 100 cm (1 m) στην πραγματικότητα',
    tableData: [
      { label: 'Κλίμακα', value: '1 : 100' },
      { label: 'Σχέση μεγεθών', value: '1 cm στο σχέδιο ＝ 100 cm (1 m) στην πραγματικότητα' }
    ],
    explanation: 'Κλίμακα 1 : 100 σημαίνει ότι κάθε 1 cm στο σχέδιο αντιστοιχεί σε 100 cm, δηλαδή ακριβώς 1 μέτρο στην πραγματικότητα.'
  });

  // Q4: Οπτική αναγνώριση σωστής μεγέθυνσης (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΑΝΑΓΝΩΡΙΣΗ ΣΩΣΤΗΣ ΜΕΓΕΘΥΝΣΗΣ',
    prompt: 'Παρατηρήστε τα δύο ορθογώνια. Το αρχικό είναι 2 × 1. Ποιες διαστάσεις πρέπει να έχει το νέο ορθογώνιο ώστε να αποτελεί πραγματική μεγέθυνση (όμοιο σχήμα);',
    svg: (
      <svg viewBox="0 0 200 90" className="w-52 h-24 mx-auto my-2 select-none drop-shadow-sm">
        <rect x="20" y="30" width="40" height="20" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
        <text x="40" y="24" fill="#4f46e5" fontSize="10" fontWeight="bold" textAnchor="middle">2 × 1</text>
        <text x="40" y="44" fill="#64748b" fontSize="9" textAnchor="middle">Αρχικό</text>

        <rect x="100" y="15" width="80" height="40" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.5" />
        <text x="140" y="40" fill="#15803d" fontSize="11" fontWeight="black" textAnchor="middle">Νέο (?)</text>
      </svg>
    ),
    options: ensureFourUniqueOptions('4 × 2 (διπλασιασμός και των δύο πλευρών)', () => [
      '4 × 1 (διπλασιασμός μόνο του μήκους)',
      '2 × 3 (αύξηση μόνο του πλάτους)',
      '5 × 1 (επιμήκυνση)'
    ]),
    correctAnswer: '4 × 2 (διπλασιασμός και των δύο πλευρών)',
    tableData: [
      { label: 'Αρχικός λόγος', value: '2 : 1 ＝ 2' },
      { label: 'Σωστή μεγέθυνση', value: 'Πολλαπλασιασμός και των δύο διαστάσεων με τον ίδιο αριθμό (2 · 2 ＝ 4 και 1 · 2 ＝ 2)' },
      { label: 'Έλεγχος λόγου', value: '4 : 2 ＝ 2 (ίδια αναλογία)' }
    ],
    explanation: 'Για να είναι το σχήμα όμοιο και να μην παραμορφωθεί, πρέπει να πολλαπλασιαστούν και οι δύο διαστάσεις με τον ίδιο συντελεστή (2 · 2 ＝ 4 και 1 · 2 ＝ 2).'
  });

  // Q5: Υπολογισμός πραγματικού μήκους σε κάτοψη 1 : 50 (Input αριθμού)
  const cmQ5 = randInt(4, 12);
  const realMQ5 = (cmQ5 * 50) / 100;
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΠΡΑΓΜΑΤΙΚΟΥ ΜΗΚΟΥΣ (1 : 50)',
    prompt: `Σε ένα σχέδιο με κλίμακα 1 : 50, ένα έπιπλο έχει μήκος ${cmQ5} cm. Πόσα μέτρα (m) είναι το πραγματικό του μήκος; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: formatNum(realMQ5),
    tableData: [
      { label: 'Μήκος σχεδίου', value: `${cmQ5} cm` },
      { label: 'Κλίμακα', value: '1 : 50' },
      { label: 'Σε εκατοστά', value: `${cmQ5} · 50 ＝ ${cmQ5 * 50} cm` },
      { label: 'Σε μέτρα', value: `${formatNum(realMQ5)} m` }
    ],
    explanation: `${cmQ5} · 50 cm ＝ ${cmQ5 * 50} cm ＝ ${formatNum(realMQ5)} m.`
  });

  // Q6: Υπολογισμός πραγματικής απόστασης σε χάρτη 1 : 100.000 (Input αριθμού)
  const cmQ6 = randInt(4, 15);
  const kmQ6 = cmQ6;
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΥΠΟΛΟΓΙΣΜΟΣ ΑΠΟΣΤΑΣΗΣ ΣΕ KM (1 : 100.000)',
    prompt: `Σε έναν χάρτη με κλίμακα 1 : 100.000, η απόσταση δύο σταθμών μετρήθηκε ${cmQ6} cm. Πόσα χιλιόμετρα (km) είναι η πραγματική απόσταση; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(kmQ6),
    tableData: [
      { label: 'Απόσταση χάρτη', value: `${cmQ6} cm` },
      { label: 'Κλίμακα', value: '1 : 100.000 (1 cm ＝ 1 km)' },
      { label: 'Πραγματική απόσταση', value: `${kmQ6} km` }
    ],
    explanation: `Επειδή 100.000 cm ＝ 1 km, κάθε 1 cm στον χάρτη αντιστοιχεί σε 1 km. Άρα η απόσταση είναι ${kmQ6} km.`
  });

  // Q7: Μεταβολή περιμέτρου όταν διπλασιάζονται οι πλευ

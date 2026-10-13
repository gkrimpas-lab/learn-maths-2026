// pages/st-dimotikou/72-embadon-ask.js
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

// POOL ΓΙΑ Q9: Μετατροπές από m² σε cm² και Πλακόστρωση
const PROBLEM_POOL_Q9 = [
  // 1. Πλακάκια δαπέδου κουζίνας
  () => {
    const areaM2 = randInt(12, 24);
    const tileCm2 = 500;
    const totalCm2 = areaM2 * 10000;
    const tilesCount = totalCm2 / tileCm2;
    const correct = `${formatNum(tilesCount)} πλακάκια`;
    return {
      title: 'ΠΛΑΚΑΚΙΑ ΔΑΠΕΔΟΥ',
      prompt: `Το δάπεδο ενός δωματίου έχει εμβαδόν ${areaM2} m². Θέλουμε να το καλύψουμε με πλακάκια που έχουν εμβαδόν ${tileCm2} cm² το καθένα. Πόσα πλακάκια θα χρειαστούν;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(tilesCount + 50)} πλακάκια`,
        `${formatNum(tilesCount - 50 > 0 ? tilesCount - 50 : tilesCount + 100)} πλακάκια`,
        `${formatNum(areaM2 * 10)} πλακάκια`,
        `${formatNum(tilesCount * 2)} πλακάκια`
      ]),
      correctAnswer: correct,
      unit: 'πλακάκια',
      tableData: [
        { label: 'Εμβαδόν δαπέδου', value: `${areaM2} m²` },
        { label: 'Μετατροπή σε cm² (· 10.000)', value: `${formatNum(totalCm2)} cm²` },
        { label: 'Εμβαδόν πλακιδίου', value: `${tileCm2} cm²` },
        { label: 'Πράξη διαίρεσης', value: `${formatNum(totalCm2)} : ${tileCm2} ＝ ${formatNum(tilesCount)} πλακάκια` }
      ],
      explanation: `Μετατρέπουμε πρώτα τα m² σε cm² πολλαπλασιάζοντας με το 10.000: ${areaM2} · 10.000 ＝ ${formatNum(totalCm2)} cm². Έπειτα διαιρούμε με το εμβαδόν του πλακιδίου: ${formatNum(totalCm2)} : ${tileCm2} ＝ ${formatNum(tilesCount)} πλακάκια.`
    };
  },
  // 2. Πλακάκια μπάνιου
  () => {
    const areaM2 = randInt(6, 15);
    const tileCm2 = 400;
    const totalCm2 = areaM2 * 10000;
    const tilesCount = totalCm2 / tileCm2;
    const correct = `${formatNum(tilesCount)} πλακάκια`;
    return {
      title: 'ΠΛΑΚΑΚΙΑ ΜΠΑΝΙΟΥ',
      prompt: `Το πάτωμα ενός μπάνιου έχει επιφάνεια ${areaM2} m². Πόσα τετράγωνα πλακάκια των ${tileCm2} cm² χρειάζονται για να στρωθεί ολόκληρο;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(tilesCount + 25)} πλακάκια`,
        `${formatNum(tilesCount - 25 > 0 ? tilesCount - 25 : tilesCount + 60)} πλακάκια`,
        `${formatNum(areaM2 * 100)} πλακάκια`,
        `${formatNum(tilesCount / 2)} πλακάκια`
      ]),
      correctAnswer: correct,
      unit: 'πλακάκια',
      tableData: [
        { label: 'Εμβαδόν μπάνιου σε cm²', value: `${areaM2} · 10.000 ＝ ${formatNum(totalCm2)} cm²` },
        { label: 'Πράξη', value: `${formatNum(totalCm2)} : ${tileCm2}` },
        { label: 'Αποτέλεσμα', value: `${formatNum(tilesCount)} πλακάκια` }
      ],
      explanation: `${areaM2} m² ＝ ${formatNum(totalCm2)} cm². Διαιρούμε: ${formatNum(totalCm2)} : ${tileCm2} ＝ ${formatNum(tilesCount)} πλακάκια.`
    };
  },
  // 3. Ψηφίδες πισίνας
  () => {
    const areaM2 = 2;
    const tileCm2 = 100;
    const correct = '200 ψηφίδες';
    return {
      title: 'ΨΗΦΙΔΕΣ ΠΙΣΙΝΑΣ',
      prompt: `Για να επισκευαστεί ένα τμήμα πισίνας εμβαδού 2 m², χρησιμοποιούνται διακοσμητικές ψηφίδες των 100 cm² η καθεμία. Πόσες τέτοιες ψηφίδες απαιτούνται;`,
      options: ensureFourUniqueOptions(correct, () => ['20 ψηφίδες', '2.000 ψηφίδες', '100 ψηφίδες', '400 ψηφίδες']),
      correctAnswer: correct,
      unit: 'ψηφίδες',
      tableData: [
        { label: 'Εμβαδόν σε cm²', value: '2 · 10.000 ＝ 20.000 cm²' },
        { label: 'Εμβαδόν ψηφίδας', value: '100 cm²' },
        { label: 'Πράξη', value: '20.000 : 100 ＝ 200' }
      ],
      explanation: `2 m² ＝ 20.000 cm². Διαιρούμε με το 100 cm²: 20.000 : 100 ＝ 200 ψηφίδες.`
    };
  },
  // 4. Μάρμαρα σαλονιού
  () => {
    const areaM2 = randInt(30, 60);
    const tileCm2 = 2500; // 50cm x 50cm
    const totalCm2 = areaM2 * 10000;
    const tilesCount = totalCm2 / tileCm2;
    const correct = `${formatNum(tilesCount)} πλάκες`;
    return {
      title: 'ΜΑΡΜΑΡΙΝΕΣ ΠΛΑΚΕΣ',
      prompt: `Σε ένα σαλόνι εμβαδού ${areaM2} m² τοποθετούνται μαρμάρινες πλάκες εμβαδού ${tileCm2} cm² η καθεμία. Πόσες πλάκες θα τοποθετηθούν;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(tilesCount + 20)} πλάκες`,
        `${formatNum(tilesCount - 20 > 0 ? tilesCount - 20 : tilesCount + 40)} πλάκες`,
        `${formatNum(tilesCount * 2)} πλάκες`,
        `${formatNum(areaM2)} πλάκες`
      ]),
      correctAnswer: correct,
      unit: 'πλάκες',
      tableData: [
        { label: 'Εμβαδόν σαλονιού σε cm²', value: `${areaM2} · 10.000 ＝ ${formatNum(totalCm2)} cm²` },
        { label: 'Πράξη', value: `${formatNum(totalCm2)} : ${tileCm2}` },
        { label: 'Πλήθος πλακών', value: `${formatNum(tilesCount)} πλάκες` }
      ],
      explanation: `${areaM2} m² ＝ ${formatNum(totalCm2)} cm². Διαιρούμε: ${formatNum(totalCm2)} : ${tileCm2} ＝ ${formatNum(tilesCount)} πλάκες.`
    };
  },
  // 5. Πλακάκια βεράντας
  () => {
    const areaM2 = 18;
    const tileCm2 = 900; // 30cm x 30cm
    const correct = '200 πλακάκια';
    return {
      title: 'ΠΛΑΚΟΣΤΡΩΣΗ ΒΕΡΑΝΤΑΣ',
      prompt: `Μια βεράντα έχει εμβαδόν 18 m². Αν στρωθεί με πλακάκια των 900 cm², πόσα πλακάκια θα χρησιμοποιηθούν;`,
      options: ensureFourUniqueOptions(correct, () => ['180 πλακάκια', '250 πλακάκια', '20 πλακάκια', '300 πλακάκια']),
      correctAnswer: correct,
      unit: 'πλακάκια',
      tableData: [
        { label: 'Εμβαδόν βεράντας', value: '18 m² ＝ 180.000 cm²' },
        { label: 'Πράξη', value: '180.000 : 900 ＝ 200 πλακάκια' }
      ],
      explanation: `18 m² ＝ 180.000 cm². 180.000 : 900 ＝ 200 πλακάκια.`
    };
  },
  // 6. Πέτρινες πλάκες αυλής
  () => {
    const areaM2 = 40;
    const tileCm2 = 1000;
    const correct = '400 πλάκες';
    return {
      title: 'ΠΕΤΡΙΝΕΣ ΠΛΑΚΕΣ ΑΥΛΗΣ',
      prompt: `Μια αυλή έχει εμβαδόν 40 m². Θα στρωθεί με πέτρινες πλάκες των 1.000 cm² η καθεμία. Πόσες πλάκες χρειάζονται;`,
      options: ensureFourUniqueOptions(correct, () => ['40 πλάκες', '4.000 πλάκες', '200 πλάκες', '500 πλάκες']),
      correctAnswer: correct,
      unit: 'πλάκες',
      tableData: [
        { label: 'Εμβαδόν αυλής', value: '40 m² ＝ 400.000 cm²' },
        { label: 'Πράξη', value: '400.000 : 1.000 ＝ 400 πλάκες' }
      ],
      explanation: `40 m² ＝ 400.000 cm². 400.000 : 1.000 ＝ 400 πλάκες.`
    };
  }
];

// POOL ΓΙΑ Q10: Υπολογισμοί με Στρέμματα & m² (Αγροτεμάχια)
const PROBLEM_POOL_Q10 = [
  // 1. Αξία ελαιώνα
  () => {
    const stremmata = randInt(5, 18);
    const pricePerStremma = randInt(3, 7) * 1000;
    const totalAreaM2 = stremmata * 1000;
    const totalPrice = stremmata * pricePerStremma;
    const correct = `${formatNum(totalPrice)} €`;
    return {
      title: 'ΑΞΙΑ ΑΓΡΟΤΕΜΑΧΙΟΥ',
      prompt: `Ένα αγρόκτημα έχει εμβαδόν ${formatNum(totalAreaM2)} m². Πωλείται προς ${formatNum(pricePerStremma)} € το στρέμμα. Πόσα χρήματα θα εισπράξει ο ιδιοκτήτης;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(totalPrice + 5000)} €`,
        `${formatNum(totalPrice - 5000 > 0 ? totalPrice - 5000 : totalPrice + 10000)} €`,
        `${formatNum(stremmata * 1000)} €`,
        `${formatNum(totalPrice * 2)} €`
      ]),
      correctAnswer: correct,
      unit: '€',
      tableData: [
        { label: 'Εμβαδόν σε m²', value: `${formatNum(totalAreaM2)} m²` },
        { label: 'Στρέμματα (: 1.000)', value: `${stremmata} στρέμματα` },
        { label: 'Τιμή ανά στρέμμα', value: `${formatNum(pricePerStremma)} €` },
        { label: 'Συνολική αξία', value: `${stremmata} · ${formatNum(pricePerStremma)} € ＝ ${formatNum(totalPrice)} €` }
      ],
      explanation: `Μετατρέπουμε τα m² σε στρέμματα διαιρώντας με το 1.000: ${formatNum(totalAreaM2)} : 1.000 ＝ ${stremmata} στρέμματα. Πολλαπλασιάζουμε με την τιμή: ${stremmata} · ${formatNum(pricePerStremma)} € ＝ ${formatNum(totalPrice)} €.`
    };
  },
  // 2. Χωρισμός οικοπέδου σε ίσα οικόπεδα
  () => {
    const stremmata = 6; // 6.000 m²
    const plotM2 = 500;
    const plotsCount = (stremmata * 1000) / plotM2;
    const correct = `${plotsCount} οικόπεδα`;
    return {
      title: 'ΚΑΤΑΤΜΗΣΗ ΟΙΚΟΠΕΔΟΥ',
      prompt: `Ένα οικόπεδο έχει έκταση 6 στρέμματα. Χωρίζεται σε μικρότερα οικόπεδα των 500 m² το καθένα. Πόσα οικόπεδα προκύπτουν;`,
      options: ensureFourUniqueOptions(correct, () => ['10 οικόπεδα', '8 οικόπεδα', '15 οικόπεδα', '20 οικόπεδα']),
      correctAnswer: correct,
      unit: 'οικόπεδα',
      tableData: [
        { label: 'Έκταση σε m²', value: '6 · 1.000 ＝ 6.000 m²' },
        { label: 'Μέγεθος οικοπέδου', value: '500 m²' },
        { label: 'Πράξη', value: '6.000 : 500 ＝ 12 οικόπεδα' }
      ],
      explanation: `6 στρέμματα ＝ 6.000 m². Διαιρούμε: 6.000 : 500 ＝ 12 οικόπεδα.`
    };
  },
  // 3. Παραγωγή σιταριού ανά στρέμμα
  () => {
    const stremmata = randInt(10, 30);
    const kgPerStremma = 350;
    const totalKg = stremmata * kgPerStremma;
    const correct = `${formatNum(totalKg)} kg`;
    return {
      title: 'ΑΓΡΟΤΙΚΗ ΠΑΡΑΓΩΓΗ',
      prompt: `Ένα χωράφι ${stremmata} στρεμμάτων παράγει κατά μέσο όρο ${kgPerStremma} kg σιτάρι ανά στρέμμα. Πόσα κιλά (kg) σιτάρι θα παραχθούν συνολικά;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(totalKg + 500)} kg`,
        `${formatNum(totalKg - 500 > 0 ? totalKg - 500 : totalKg + 1000)} kg`,
        `${formatNum(stremmata * 100)} kg`,
        `${formatNum(totalKg * 2)} kg`
      ]),
      correctAnswer: correct,
      unit: 'kg',
      tableData: [
        { label: 'Έκταση', value: `${stremmata} στρέμματα` },
        { label: 'Απόδοση ανά στρέμμα', value: `${kgPerStremma} kg` },
        { label: 'Πράξη', value: `${stremmata} · ${kgPerStremma} ＝ ${formatNum(totalKg)} kg` }
      ],
      explanation: `${stremmata} · ${kgPerStremma} kg ＝ ${formatNum(totalKg)} kg.`
    };
  },
  // 4. Πότισμα αγροκτήματος
  () => {
    const totalM2 = 8500;
    const stremmata = 8.5;
    const correct = '8,5 στρέμματα';
    return {
      title: 'ΜΕΤΑΤΡΟΠΗ ΣΕ ΣΤΡΕΜΜΑΤΑ',
      prompt: `Ένας αγρότης πότισε ένα περιβόλι με συνολική επιφάνεια 8.500 m². Πόσα στρέμματα πότισε;`,
      options: ensureFourUniqueOptions(correct, () => ['85 στρέμματα', '0,85 στρέμματα', '850 στρέμματα', '8 στρέμματα']),
      correctAnswer: correct,
      unit: 'στρέμματα',
      tableData: [
        { label: 'Επιφάνεια σε m²', value: '8.500 m²' },
        { label: 'Πράξη (: 1.000)', value: '8.500 : 1.000 ＝ 8,5 στρέμματα' }
      ],
      explanation: `8.500 : 1.000 ＝ 8,5 στρέμματα.`
    };
  },
  // 5. Κόστος περίφραξης ανά στρέμμα
  () => {
    const stremmata = 4;
    const costPerM2 = 12;
    const totalM2 = stremmata * 1000;
    const cost = totalM2 * costPerM2;
    const correct = `${formatNum(cost)} €`;
    return {
      title: 'ΚΟΣΤΟΣ ΔΙΑΜΟΡΦΩΣΗΣ ΕΔΑΦΟΥΣ',
      prompt: `Η διαμόρφωση ενός οικοπέδου 4 στρεμμάτων κοστίζει 12 € ανά m². Πόσο θα κοστίσει συνολικά η διαμόρφωση του οικοπέδου;`,
      options: ensureFourUniqueOptions(correct, () => ['4.800 €', '480.000 €', '40.000 €', '36.000 €']),
      correctAnswer: correct,
      unit: '€',
      tableData: [
        { label: 'Έκταση σε m²', value: '4 · 1.000 ＝ 4.000 m²' },
        { label: 'Κόστος ανά m²', value: '12 €' },
        { label: 'Συνολικό κόστος', value: '4.000 · 12 € ＝ 48.000 €' }
      ],
      explanation: `4 στρέμματα ＝ 4.000 m². 4.000 · 12 € ＝ 48.000 €.`
    };
  },
  // 6. Στρέμματα σε m²
  () => {
    const stremmata = randInt(3, 9) + 0.5; // π.χ. 3.5, 4.5
    const m2 = stremmata * 1000;
    const correct = `${formatNum(m2)} m²`;
    return {
      title: 'ΜΕΤΑΤΡΟΠΗ ΣΤΡΕΜΜΑΤΩΝ ΣΕ M²',
      prompt: `Ένα αγρόκτημα έχει επιφάνεια ${formatNum(stremmata)} στρέμματα. Πόσα τετραγωνικά μέτρα (m²) είναι η επιφάνειά του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(m2 / 10)} m²`,
        `${formatNum(m2 + 500)} m²`,
        `${formatNum(m2 * 10)} m²`,
        `${formatNum(stremmata * 100)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Στρέμματα', value: `${formatNum(stremmata)} στρέμματα` },
        { label: 'Πράξη (· 1.000)', value: `${formatNum(stremmata)} · 1.000 ＝ ${formatNum(m2)} m²` }
      ],
      explanation: `Πολλαπλασιάζουμε με το 1.000: ${formatNum(stremmata)} · 1.000 ＝ ${formatNum(m2)} m².`
    };
  }
];

// POOL ΓΙΑ Q11: Μετατροπές στη Σκάλα Επιφάνειας (dm², cm², mm²)
const PROBLEM_POOL_Q11 = [
  // 1. Από dm² σε cm²
  () => {
    const dm2 = randInt(5, 18);
    const cm2 = dm2 * 100;
    const correct = `${formatNum(cm2)} cm²`;
    return {
      title: 'ΜΕΤΑΤΡΟΠΗ DM² ΣΕ CM²',
      prompt: `Ένα χαρτόνι έχει επιφάνεια ${dm2} dm². Πόσα τετραγωνικά εκατοστόμετρα (cm²) είναι η επιφάνειά του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${dm2 * 10} cm²`,
        `${dm2 * 1000} cm²`,
        `${formatNum(cm2 + 50)} cm²`,
        `${formatNum(dm2)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Αρχική τιμή', value: `${dm2} dm²` },
        { label: 'Σχέση dm²/cm²', value: '1 dm² ＝ 100 cm² (1 σκαλοπάτι κάτω)' },
        { label: 'Πράξη', value: `${dm2} · 100 ＝ ${formatNum(cm2)} cm²` }
      ],
      explanation: `Κατεβαίνουμε ένα σκαλοπάτι, άρα πολλαπλασιάζουμε με το 100: ${dm2} · 100 ＝ ${formatNum(cm2)} cm².`
    };
  },
  // 2. Από cm² σε mm²
  () => {
    const cm2 = randInt(12, 45);
    const mm2 = cm2 * 100;
    const correct = `${formatNum(mm2)} mm²`;
    return {
      title: 'ΜΕΤΑΤΡΟΠΗ CM² ΣΕ MM²',
      prompt: `Μια μεταλλική πλάκα έχει εμβαδόν ${cm2} cm². Πόσα τετραγωνικά χιλιοστόμετρα (mm²) είναι το εμβαδόν της;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${cm2 * 10} mm²`,
        `${formatNum(mm2 + 100)} mm²`,
        `${cm2 * 1000} mm²`,
        `${formatNum(mm2 / 10)} mm²`
      ]),
      correctAnswer: correct,
      unit: 'mm²',
      tableData: [
        { label: 'Αρχική τιμή', value: `${cm2} cm²` },
        { label: 'Σχέση cm²/mm²', value: '1 cm² ＝ 100 mm²' },
        { label: 'Πράξη', value: `${cm2} · 100 ＝ ${formatNum(mm2)} mm²` }
      ],
      explanation: `${cm2} · 100 ＝ ${formatNum(mm2)} mm².`
    };
  },
  // 3. Από cm² σε dm² (ανέβασμα)
  () => {
    const cm2 = 4500;
    const dm2 = cm2 / 100;
    const correct = `${dm2} dm²`;
    return {
      title: 'ΜΕΤΑΤΡΟΠΗ CM² ΣΕ DM²',
      prompt: `Μια επιφάνεια έχει εμβαδόν 4.500 cm². Πόσα τετραγωνικά δεκατόμετρα (dm²) είναι;`,
      options: ensureFourUniqueOptions(correct, () => ['450 dm²', '4,5 dm²', '45.000 dm²', '0,45 dm²']),
      correctAnswer: correct,
      unit: 'dm²',
      tableData: [
        { label: 'Αρχική τιμή', value: '4.500 cm²' },
        { label: 'Κανόνας', value: 'Ανεβαίνουμε 1 σκαλοπάτι (: 100)' },
        { label: 'Πράξη', value: '4.500 : 100 ＝ 45 dm²' }
      ],
      explanation: `Ανεβαίνουμε 1 σκαλοπάτι στη σκάλα επιφάνειας, άρα διαιρούμε με το 100: 4.500 : 100 ＝ 45 dm².`
    };
  },
  // 4. Από m² σε dm²
  () => {
    const m2 = randInt(4, 15);
    const dm2 = m2 * 100;
    const correct = `${formatNum(dm2)} dm²`;
    return {
      title: 'ΜΕΤΑΤΡΟΠΗ M² ΣΕ DM²',
      prompt: `Ένα τραπέζι έχει επιφάνεια ${m2} m². Πόσα τετραγωνικά δεκατόμετρα (dm²) είναι η επιφάνειά του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${m2 * 10} dm²`,
        `${formatNum(dm2 + 50)} dm²`,
        `${m2 * 1000} dm²`,
        `${formatNum(dm2 / 10)} dm²`
      ]),
      correctAnswer: correct,
      unit: 'dm²',
      tableData: [
        { label: 'Αρχική τιμή', value: `${m2} m²` },
        { label: 'Σχέση m²/dm²', value: '1 m² ＝ 100 dm²' },
        { label: 'Πράξη', value: `${m2} · 100 ＝ ${formatNum(dm2)} dm²` }
      ],
      explanation: `${m2} · 100 ＝ ${formatNum(dm2)} dm².`
    };
  },
  // 5. Από mm² σε cm²
  () => {
    const mm2 = 8200;
    const cm2 = mm2 / 100;
    const correct = '82 cm²';
    return {
      title: 'ΜΕΤΑΤΡΟΠΗ MM² ΣΕ CM²',
      prompt: `Μια μικρή επιφάνεια μετρήθηκε 8.200 mm². Πόσα τετραγωνικά εκατοστόμετρα (cm²) είναι;`,
      options: ensureFourUniqueOptions(correct, () => ['820 cm²', '8,2 cm²', '82.000 cm²', '0,82 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: 'Αρχική τιμή', value: '8.200 mm²' },
        { label: 'Πράξη (: 100)', value: '8.200 : 100 ＝ 82 cm²' }
      ],
      explanation: `8.200 : 100 ＝ 82 cm².`
    };
  },
  // 6. Δύο σκαλοπάτια: dm² σε mm²
  () => {
    const dm2 = 2;
    const mm2 = dm2 * 10000;
    const correct = '20.000 mm²';
    return {
      title: 'ΜΕΤΑΒΑΣΗ 2 ΣΚΑΛΟΠΑΤΙΩΝ (DM² ΣΕ MM²)',
      prompt: `Πόσα τετραγωνικά χιλιοστόμετρα (mm²) είναι τα 2 dm²;`,
      options: ensureFourUniqueOptions(correct, () => ['200 mm²', '2.000 mm²', '200.000 mm²', '20 mm²']),
      correctAnswer: correct,
      unit: 'mm²',
      tableData: [
        { label: 'Από dm² σε mm²', value: '2 σκαλοπάτια κάτω (· 100 · 100 ＝ · 10.000)' },
        { label: 'Πράξη', value: '2 · 10.000 ＝ 20.000 mm²' }
      ],
      explanation: `Κατεβαίνουμε 2 σκαλοπάτια (από dm² σε cm² και μετά σε mm²), άρα πολλαπλασιάζουμε με το 10.000: 2 · 10.000 ＝ 20.000 mm².`
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα Επιφάνειας & km²
const PROBLEM_POOL_Q12 = [
  // 1. Δάσος σε km² και στρέμματα
  () => {
    const km2 = randInt(3, 8);
    const stremmata = km2 * 1000;
    const correct = `${formatNum(stremmata)} στρέμματα`;
    return {
      title: 'ΕΚΤΑΣΗ ΔΑΣΟΥΣ ΣΕ ΣΤΡΕΜΜΑΤΑ',
      prompt: `Ένας εθνικός δρυμός καλύπτει έκταση ${km2} km². Πόσα στρέμματα είναι η έκταση του δρυμού;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(km2 * 100)} στρέμματα`,
        `${formatNum(stremmata + 500)} στρέμματα`,
        `${formatNum(km2 * 10000)} στρέμματα`,
        `${formatNum(stremmata * 2)} στρέμματα`
      ]),
      correctAnswer: correct,
      unit: 'στρέμματα',
      tableData: [
        { label: 'Έκταση σε km²', value: `${km2} km²` },
        { label: 'Σχέση km²/στρεμμάτων', value: '1 km² ＝ 1.000 στρέμματα (1.000.000 m²)' },
        { label: 'Πράξη', value: `${km2} · 1.000 ＝ ${formatNum(stremmata)} στρέμματα` }
      ],
      explanation: `Επειδή 1 km² ισούται με 1.000 στρέμματα, πολλαπλασιάζουμε: ${km2} · 1.000 ＝ ${formatNum(stremmata)} στρέμματα.`
    };
  },
  // 2. Λίμνη σε m² και km²
  () => {
    const m2 = 5000000;
    const km2 = 5;
    const correct = '5 km²';
    return {
      title: 'ΕΠΙΦΑΝΕΙΑ ΛΙΜΝΗΣ ΣΕ KM²',
      prompt: `Η επιφάνεια μιας λίμνης είναι 5.000.000 m². Πόσα τετραγωνικά χιλιόμετρα (km²) είναι η επιφάνειά της;`,
      options: ensureFourUniqueOptions(correct, () => ['50 km²', '0,5 km²', '500 km²', '5.000 km²']),
      correctAnswer: correct,
      unit: 'km²',
      tableData: [
        { label: 'Επιφάνεια σε m²', value: '5.000.000 m²' },
        { label: 'Σχέση km²/m²', value: '1 km² ＝ 1.000.000 m²' },
        { label: 'Πράξη', value: '5.000.000 : 1.000.000 ＝ 5 km²' }
      ],
      explanation: `5.000.000 : 1.000.000 ＝ 5 km².`
    };
  },
  // 3. Σύγκριση εμβαδών διαφορετικών μονάδων
  () => {
    const correct = 'Το χωράφι Β (5 στρέμματα ＝ 5.000 m²)';
    return {
      title: 'ΣΥΓΚΡΙΣΗ ΕΠΙΦΑΝΕΙΩΝ',
      prompt: `Έχουμε δύο χωράφια: Το χωράφι Α έχει εμβαδόν 4.200 m² και το χωράφι Β έχει εμβαδόν 5 στρέμματα. Ποιο χωράφι είναι μεγαλύτερο;`,
      options: ensureFourUniqueOptions(correct, () => [
        'Το χωράφι Α (4.200 m²)',
        'Είναι απολύτως ίσα',
        'Δεν μπορούμε να τα συγκρίνουμε'
      ]),
      correctAnswer: correct,
      unit: 'απάντηση',
      tableData: [
        { label: 'Χωράφι Α', value: '4.200 m²' },
        { label: 'Χωράφι Β', value: '5 στρέμματα ＝ 5.000 m²' },
        { label: 'Σύγκριση', value: '5.000 m² ＞ 4.200 m²' }
      ],
      explanation: `Τα 5 στρέμματα είναι 5.000 m², επομένως το χωράφι Β είναι μεγαλύτερο από το χωράφι Α (5.000 m² ＞ 4.200 m²).`
    };
  },
  // 4. Αγορά οικοπέδου ανά m²
  () => {
    const stremmata = 2; // 2.000 m²
    const pricePerM2 = 80;
    const totalCost = 2000 * pricePerM2;
    const correct = '160.000 €';
    return {
      title: 'ΑΞΙΑ ΟΙΚΟΠΕΔΟΥ ΑΝΑ M²',
      prompt: `Ένα οικόπεδο 2 στρεμμάτων πωλείται προς 80 € το τετραγωνικό μέτρο (m²). Ποια είναι η συνολική τιμή πώλησης;`,
      options: ensureFourUniqueOptions(correct, () => ['16.000 €', '160 €', '1.600.000 €', '80.000 €']),
      correctAnswer: correct,
      unit: '€',
      tableData: [
        { label: 'Έκταση σε m²', value: '2 · 1.000 ＝ 2.000 m²' },
        { label: 'Τιμή ανά m²', value: '80 €' },
        { label: 'Συνολικό κόστος', value: '2.000 · 80 € ＝ 160.000 €' }
      ],
      explanation: `2 στρέμματα ＝ 2.000 m². 2.000 · 80 € ＝ 160.000 €.`
    };
  },
  // 5. Νησί σε km² και m²
  () => {
    const km2 = 12;
    const m2 = km2 * 1000000;
    const correct = `${formatNum(m2)} m²`;
    return {
      title: 'ΕΠΙΦΑΝΕΙΑ ΝΗΣΙΟΥ ΣΕ M²',
      prompt: `Μια βραχονησίδα έχει έκταση 12 km². Πόσα τετραγωνικά μέτρα (m²) είναι η έκτασή της;`,
      options: ensureFourUniqueOptions(correct, () => [
        '120.000 m²',
        '1.200.000 m²',
        '12.000 m²',
        '120.000.000 m²'
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: 'Έκταση σε km²', value: '12 km²' },
        { label: 'Πράξη (· 1.000.000)', value: '12 · 1.000.000 ＝ 12.000.000 m²' }
      ],
      explanation: `12 · 1.000.000 ＝ 12.000.000 m².`
    };
  },
  // 6. Πόσα στρέμματα είναι 1 km²
  () => {
    const correct = '1.000 στρέμματα';
    return {
      title: 'ΙΣΟΔΥΝΑΜΙΑ KM² ΚΑΙ ΣΤΡΕΜΜΑΤΩΝ',
      prompt: `Πόσα στρέμματα περιέχει ακριβώς 1 τετραγωνικό χιλιόμετρο (1 km²);`,
      options: ensureFourUniqueOptions(correct, () => ['100 στρέμματα', '10.000 στρέμματα', '10 στρέμματα', '1.000.000 στρέμματα']),
      correctAnswer: correct,
      unit: 'στρέμματα',
      tableData: [
        { label: '1 km² σε m²', value: '1.000.000 m²' },
        { label: '1 στρέμμα σε m²', value: '1.000 m²' },
        { label: 'Πράξη', value: '1.000.000 : 1.000 ＝ 1.000 στρέμματα' }
      ],
      explanation: `1 km² ＝ 1.000.000 m². Επειδή 1 στρέμμα ＝ 1.000 m², έχουμε: 1.000.000 : 1.000 ＝ 1.000 στρέμματα.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Ορισμός εμβαδού vs περιμέτρου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΕΝΝΟΙΑ ΕΜΒΑΔΟΥ',
    prompt: isQ1True
      ? 'Το εμβαδόν εκφράζει το μέγεθος της επιφάνειας που καλύπτει ένα σχήμα, ενώ η περίμετρος είναι το μήκος του εξωτερικού του ορίου.'
      : 'Το εμβαδόν και η περίμετρος ενός σχήματος μετριούνται πάντα με τις ίδιες μονάδες μέτρησης (σε απλά μέτρα m).',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Περίμετρος', value: 'Μήκος γραμμής (σε m, cm κ.λπ.)' },
      { label: 'Εμβαδόν', value: 'Επιφάνεια χώρου (σε m², cm² κ.λπ.)' }
    ],
    explanation: isQ1True
      ? 'ΣΩΣΤΟ: Η περίμετρος μετράει το περίγραμμα (μήκος), ενώ το εμβαδόν μετράει ολόκληρη την εσωτερική επιφάνεια.'
      : 'ΛΑΘΟΣ: Η περίμετρος μετριέται σε μονάδες μήκους (m), ενώ το εμβαδόν σε μονάδες επιφάνειας (τετραγωνικά μέτρα m²).'
  });

  // Q2: Βασική μονάδα μέτρησης επιφάνειας (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΒΑΣΙΚΗ ΜΟΝΑΔΑ ΕΠΙΦΑΝΕΙΑΣ',
    prompt: 'Ποια είναι η βασική μονάδα μέτρησης επιφάνειας στο διεθνές σύστημα μονάδων;',
    options: ensureFourUniqueOptions('Το τετραγωνικό μέτρο (1 m²)', () => [
      'Το απλό μέτρο (1 m)',
      'Το στρέμμα',
      'Το τετραγωνικό χιλιόμετρο (1 km²)'
    ]),
    correctAnswer: 'Το τετραγωνικό μέτρο (1 m²)',
    tableData: [
      { label: 'Βασική μονάδα', value: 'Τετραγωνικό μέτρο (1 m²)' },
      { label: 'Ορισμός', value: 'Τετράγωνο με πλευρά μήκους 1 m' }
    ],
    explanation: 'Η θεμελιώδης μονάδα μέτρησης επιφάνειας είναι το τετραγωνικό μέτρο (1 m²).'
  });

  // Q3: Γιατί αλλάζουν ανά 100 οι μονάδες επιφάνειας (MCQ)
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΣΧΕΣΗ ΜΟΝΑΔΩΝ ΣΤΗ ΣΚΑΛΑ ΕΠΙΦΑΝΕΙΑΣ',
    prompt: 'Γιατί κάθε σκαλοπάτι στη σκάλα των μονάδων επιφάνειας αλλάζει κατά 100 και όχι κατά 10;',
    options: ensureFourUniqueOptions(
      'Επειδή η επιφάνεια έχει 2 διαστάσεις (μήκος · πλάτος) και 10 · 10 ＝ 100',
      () => [
        'Επειδή έτσι αποφασίστηκε τυχαία',
        'Επειδή το 100 είναι μεγαλύτερος αριθμός',
        'Επειδή όλα τα σχήματα είναι τετράγωνα'
      ]
    ),
    correctAnswer: 'Επειδή η επιφάνεια έχει 2 διαστάσεις (μήκος · πλάτος) και 10 · 10 ＝ 100',
    tableData: [
      { label: '1 διάσταση (μήκος)', value: '1 m ＝ 10 dm' },
      { label: '2 διαστάσεις (επιφάνεια)', value: '1 m² ＝ 10 dm · 10 dm ＝ 100 dm²' }
    ],
    explanation: 'Η επιφάνεια είναι γινόμενο δύο διαστάσεων (10 · 10 ＝ 100), γι\' αυτό κάθε σκαλοπάτι ισοδυναμεί με 100.'
  });

  // Q4: Οπτική αναγνώριση 1 m² (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΟΠΤΙΚΗ ΚΑΤΑΝΟΗΣΗ 1 M²',
    prompt: 'Ένα τετράγωνο έχει πλευρά 1 m (δηλαδή 10 dm). Σε πόσα μικρά τετραγωνάκια του 1 dm² χωρίζεται;',
    svg: (
      <svg viewBox="0 0 120 120" className="w-32 h-32 mx-auto my-2 select-none drop-shadow-sm">
        <rect x="10" y="10" width="100" height="100" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i}>
            <line x1={10 + (i + 1) * 10} y1="10" x2={10 + (i + 1) * 10} y2="110" stroke="#818cf8" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="10" y1={10 + (i + 1) * 10} x2="110" y2={10 + (i + 1) * 10} stroke="#818cf8" strokeWidth="0.8" strokeDasharray="2 2" />
          </g>
        ))}
      </svg>
    ),
    options: ensureFourUniqueOptions('Σε 100 τετραγωνικά δεκατόμετρα (100 dm²)', () => [
      'Σε 10 τετραγωνικά δεκατόμετρα (10 dm²)',
      'Σε 1.000 τετραγωνικά δεκατόμετρα (1.000 dm²)',
      'Σε 20 τετραγωνικά δεκατόμετρα (20 dm²)'
    ]),
    correctAnswer: 'Σε 100 τετραγωνικά δεκατόμετρα (100 dm²)',
    tableData: [
      { label: 'Γραμμές και στήλες', value: '10 γραμμές · 10 στήλες ＝ 100 τετραγωνάκια' },
      { label: 'Σχέση', value: '1 m² ＝ 100 dm²' }
    ],
    explanation: 'Το πλέγμα 10 × 10 περιέχει ακριβώς 100 τετραγωνικά δεκατόμετρα (100 dm²).'
  });

  // Q5: Πόσα m² είναι 1 στρέμμα (Input αριθμού)
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΤΟ ΣΤΡΕΜΜΑ ΣΕ ΤΕΤΡΑΓΩΝΙΚΑ ΜΕΤΡΑ',
    prompt: 'Πόσα τετραγωνικά μέτρα (m²) ισούνται με 1 στρέμμα; (Γράψτε μόνο τον αριθμό)',
    correctAnswer: '1000',
    tableData: [
      { label: 'Μονάδα', value: '1 Στρέμμα' },
      { label: 'Ισοδυναμία σε m²', value: '1.000 m²' }
    ],
    explanation: '1 στρέμμα ισούται ακριβώς με 1.000 τετραγωνικά μέτρα (m²).'
  });

  // Q6: Μετατροπή m² σε dm² (Input αριθμού)
  const m2Q6 = randInt(2, 8);
  const dm2Q6 = m2Q6 * 100;
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΜΕΤΑΤΡΟΠΗ M² ΣΕ DM²',
    prompt: `Πόσα τετραγωνικά δεκατόμετρα (dm²) είναι τα ${m2Q6} m²; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(dm2Q6),
    tableData: [
      { label: 'Αρχική τιμή', value: `${m2Q6} m²` },
      { label: 'Πράξη (· 100)', value: `${m2Q6} · 100 ＝ ${dm2Q6} dm²` }
    ],
    explanation: `Κατεβαίνουμε 1 σκαλοπάτι, άρα πολλαπλασιάζουμε με το 100: ${m2Q6} · 100 ＝ ${dm2Q6} dm².`
  });

  // Q7: Από m² σε cm² (2 σκαλοπάτια) (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΜΕΤΑΒΑΣΗ ΑΠΟ M² ΣΕ CM²',
    prompt: 'Με ποιον αριθμό πρέπει να πολλαπλασιάσουμε για να μετατρέψουμε τα τετραγωνικά μέτρα (m²) σε τετραγωνικά εκατοστόμετρα (cm²);',
    options: ensureFourUniqueOptions('Με το 10.000 (100 · 100)', () => [
      'Με το 100',
      'Με το 1.000',
      'Με το 200'
    ]),
    correctAnswer: 'Με το 10.000 (100 · 100)',
    tableData: [
      { label: 'Από m² σε dm²', value: '· 100' },
      { label: 'Από dm² σε cm²', value: '· 100' },
      { label: 'Συνολικός πολλαπλασιασμός', value: '100 · 100 ＝ 10.000' }
    ],
    explanation: 'Κατεβαίνουμε 2 σκαλοπάτια στην επιφάνεια, άρα πολλαπλασιάζουμε με το 10.000 (1 m² ＝ 10.000 cm²).'
  });

  // Q8: Από μικρότερη μονάδα σε μεγαλύτερη (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΚΑΝΟΝΑΣ ΜΕΤΑΤΡΟΠΗΣ ΣΤΗ ΣΚΑΛΑ',
    prompt: 'Όταν μετατρέπουμε μια επιφάνεια από μικρότερη μονάδα σε μεγαλύτερη (ανεβαίνουμε σκαλοπάτι, π.χ. από cm² σε dm²), τι πράξη κάνουμε;',
    options: ensureFourUniqueOptions('Διαιρούμε με το 100 για κάθε σκαλοπάτι', () => [
      'Πολλαπλασιάζουμε με το 100 για κάθε σκαλοπάτι',
      'Προσθέτουμε 100',
      'Διαιρούμε με το 10'
    ]),
    correctAnswer: 'Διαιρούμε με το 100 για κάθε σκαλοπάτι',
    tableData: [
      { label: 'Ανέβασμα σκάλας', value: 'Διαίρεση με το 100 ανά σκαλοπάτι' },
      { label: 'Κατέβασμα σκάλας', value: 'Πολλαπλασιασμός με το 100 ανά σκαλοπάτι' }
    ],
    explanation: 'Όταν ανεβαίνουμε σε μεγαλύτερη μονάδα, ο αριθμός μικραίνει, άρα διαιρούμε με το 100 για κάθε σκαλοπάτι.'
  });

  // Q9: Πρόβλημα από PROBLEM_POOL_Q9
  const p9 = PROBLEM_POOL_Q9[randInt(0, PROBLEM_POOL_Q9.length - 1)]();
  qs.push({ id: 9, type: 'mcq', ...p9 });

  // Q10: Πρόβλημα από PROBLEM_POOL_Q10
  const p10 = PROBLEM_POOL_Q10[randInt(0, PROBLEM_POOL_Q10.length - 1)]();
  qs.push({ id: 10, type: 'mcq', ...p10 });

  // Q11: Πρόβλημα από PROBLEM_POOL_Q11
  const p11 = PROBLEM_POOL_Q11[randInt(0, PROBLEM_POOL_Q11.length - 1)]();
  qs.push({ id: 11, type: 'mcq', ...p11 });

  // Q12: Πρόβλημα από PROBLEM_POOL_Q12
  const p12 = PROBLEM_POOL_Q12[randInt(0, PROBLEM_POOL_Q12.length - 1)]();
  qs.push({ id: 12, type: 'mcq', ...p12 });

  return qs;
}

// -------------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΑΣΚΗΣΕΩΝ
// -------------------------------------------------------------

export default function EmbadonAskiseisPage() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadNewSet();
  }, []);

  function loadNewSet() {
    const newQs = generateQuestionsSet();
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

  return (
    <Layout
      title="Ασκήσεις: Μέτρηση Επιφάνειας &amp; Εμβαδόν - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στις μονάδες μέτρησης επιφάνειας, τη σκάλα μετατροπών ανά 100 και τα στρέμματα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/72-embadon"
      backText="Θεωρία Κεφ. 72"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/72-embadon"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden">

        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden mb-8 sm:mb-12">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 72 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Μετρηση Επιφανειας και Εμβαδον')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στις μετατροπές τετραγωνικών μέτρων, δεκατομέτρων, εκατοστομέτρων και στρεμμάτων μέσα από 12 δυναμικές ερωτήσεις και ρεαλιστικά προβλήματα.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>12 Δυναμικές Ασκήσεις με Αυτόματη Αξιολόγηση &amp; Αναλυτική Επεξήγηση</span>
            </div>
            <button
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>🔄 {toCleanUppercase('Νεες Ασκησεις')}</span>
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
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm sm:text-base border border-indigo-150">
                      {index + 1}
                    </span>
                    <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-wider">
                      {toCleanUppercase(q.title || `ΕΡΩΤΗΣΗ ${index + 1}`)}
                    </h2>
                  </div>

                  {submitted && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black tracking-wider ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? toCleanUppercase('ΣΩΣΤΟ') : toCleanUppercase('ΛΑΘΟΣ')}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ & SVG (NO-GIVEAWAY: ΟΥΔΕΙΣ ΠΙΝΑΚΑΣ ΕΔΩ) */}
                <div className="mb-6 space-y-3">
                  <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed">
                    {q.prompt}
                  </p>
                  {q.svg && <div className="py-2">{q.svg}</div>}
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
                            {val ? toCleanUppercase('ΣΩΣΤΟ') : toCleanUppercase('ΛΑΘΟΣ')}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 2: MCQ (4 ΜΟΝΑΔΙΚΑ ΚΟΥΜΠΙΑ) */}
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
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                isSelected
                                  ? 'bg-white text-indigo-700'
                                  : 'bg-white text-slate-500 border border-slate-200'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="break-words whitespace-normal leading-snug flex-1">
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
                        placeholder="Απάντηση..."
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
                    {/* ΠΙΝΑΚΑΣ ΔΕΔΟΜΕΝΩΝ (TABLEDATA) ΜΟΝΟ ΕΔΩ */}
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-1">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <tbody>
                            {q.tableData.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={rIdx !== q.tableData.length - 1 ? 'border-b border-slate-200/60' : ''}
                              >
                                <td className="py-2.5 px-3 font-bold text-slate-600 bg-slate-100/70 w-1/3">
                                  {row.label}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-800">
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
                      <p className="font-bold mb-1">
                        {isCorrect
                          ? '✓ Μπράβο! Σωστή απάντηση.'
                          : `✗ Λάθος. Η σωστή απάντηση είναι: ${
                              q.type === 'boolean'
                                ? q.correctAnswer
                                  ? 'Σωστό'
                                  : 'Λάθος'
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
        <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
          <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-8">
              {!submitted ? (
                <div className="text-xs sm:text-sm font-semibold text-slate-300">
                  <span>{toCleanUppercase('ΑΠΑΝΤΗΘΗΚΑΝ:')} </span>
                  <span className="font-black text-indigo-400 text-sm sm:text-base">
                    {answeredCount} / {totalCount}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span>{toCleanUppercase('ΣΚΟΡ:')} </span>
                    <span className="font-black text-emerald-400 text-sm sm:text-base">
                      {score} / {totalCount}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span>{toCleanUppercase('ΠΟΣΟΣΤΟ:')} </span>
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
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-xs sm:text-sm"
                >
                  {toCleanUppercase('ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-xs sm:text-sm flex items-center gap-2"
                >
                  <span>🔄</span>
                  <span>{toCleanUppercase('ΝΕΕΣ ΑΣΚΗΣΕΙΣ')}</span>
                </button>
              )}
            </div>
          </div>
        </footer>

      </div>
    </Layout>
  );
}

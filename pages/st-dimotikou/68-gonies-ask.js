// pages/st-dimotikou/68-gonies-ask.js
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
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (POOLS) ΓΙΑ Q9 & Q10
// -------------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  // 1. Συμπληρωματικές γωνίες σε ορθή γωνία
  () => {
    const angleA = randInt(20, 65);
    const angleB = 90 - angleA;
    const unit = '°';
    const correct = `${angleB}${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `${angleB + 10}${unit}`,
      `${angleB - 10}${unit}`,
      `${180 - angleA}${unit}`,
      `${90 + angleA}${unit}`
    ]);
    return {
      title: 'ΣΥΜΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ',
      prompt: `Μια ορθή γωνία 90° χωρίζεται σε δύο επιμέρους γωνίες. Αν η μία γωνία έχει μέτρο ${angleA}°, ποιο είναι το μέτρο της άλλης γωνίας;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Συνολική γωνία', value: '90° (Ορθή)' },
        { label: 'Γνωστή γωνία', value: `${angleA}°` },
        { label: 'Πράξη', value: `90° － ${angleA}°` },
        { label: 'Ζητούμενη γωνία', value: `${angleB}°` }
      ],
      explanation: `Οι δύο γωνίες είναι συμπληρωματικές, άρα το άθροισμά τους είναι 90°. Αφαιρούμε: 90° － ${angleA}° ＝ ${angleB}°.`
    };
  },
  // 2. Παραπληρωματικές γωνίες σε ευθεία γωνία
  () => {
    const angleA = randInt(40, 140);
    const angleB = 180 - angleA;
    const unit = '°';
    const correct = `${angleB}${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `${angleB + 15}${unit}`,
      `${angleB - 15}${unit}`,
      `${90 - Math.min(angleA, 80)}${unit}`,
      `${180 - angleB + 5}${unit}`
    ]);
    return {
      title: 'ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ',
      prompt: `Δύο γωνίες βρίσκονται πάνω στην ίδια ευθεία γραμμή και σχηματίζουν ευθεία γωνία (180°). Αν η μία γωνία είναι ${angleA}°, πόσες μοίρες είναι η άλλη;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Συνολική γωνία', value: '180° (Ευθεία)' },
        { label: 'Γνωστή γωνία', value: `${angleA}°` },
        { label: 'Πράξη', value: `180° － ${angleA}°` },
        { label: 'Ζητούμενη γωνία', value: `${angleB}°` }
      ],
      explanation: `Δύο γωνίες που σχηματίζουν ευθεία γραμμή είναι παραπληρωματικές (άθροισμα 180°). Επομένως: 180° － ${angleA}° ＝ ${angleB}°.`
    };
  },
  // 3. Γωνία δεικτών ρολογιού σε ακέραιες ώρες
  () => {
    const hours = randInt(1, 5); // π.χ. 1:00, 2:00, 4:00, 5:00
    const angle = hours * 30;
    const unit = '°';
    const correct = `${angle}${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `${angle + 30}${unit}`,
      `${angle - 30}${unit}`,
      `${hours * 45}${unit}`,
      `${angle + 15}${unit}`
    ]);
    return {
      title: 'ΓΩΝΙΑ ΔΕΙΚΤΩΝ ΡΟΛΟΓΙΟΥ',
      prompt: `Ένα αναλογικό ρολόι δείχνει ακριβώς ${hours}:00. Πόσες μοίρες είναι η γωνία που σχηματίζει ο ωροδείκτης με τον λεπτοδείκτη;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Πλήρης κύκλος', value: '360° : 12 ＝ 30° ανά ώρα' },
        { label: 'Απόσταση δεικτών', value: `${hours} ώρες` },
        { label: 'Πράξη', value: `${hours} · 30°` },
        { label: 'Γωνία', value: `${angle}°` }
      ],
      explanation: `Κάθε ώρα στο καντράν του ρολογιού αντιστοιχεί σε 360° : 12 ＝ 30°. Στις ${hours}:00 οι δείκτες απέχουν ${hours} θέσεις: ${hours} · 30° ＝ ${angle}°.`
    };
  },
  // 4. Διχοτόμηση ορθής γωνίας
  () => {
    const half = 45;
    const unit = '°';
    const correct = `${half}${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `30${unit}`,
      `60${unit}`,
      `90${unit}`,
      `50${unit}`
    ]);
    return {
      title: 'ΧΩΡΙΣΜΟΣ ΟΡΘΗΣ ΓΩΝΙΑΣ ΣΕ 2 ΙΣΑ ΜΕΡΗ',
      prompt: `Μια ορθή γωνία (90°) χωρίζεται ακριβώς στη μέση σε δύο ίσες γωνίες. Πόσες μοίρες είναι καθεμία από τις δύο νέες γωνίες;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Αρχική γωνία', value: '90° (Ορθή)' },
        { label: 'Διαίρεση', value: 'Σε 2 ίσα μέρη' },
        { label: 'Πράξη', value: '90° : 2' },
        { label: 'Κάθε γωνία', value: `${half}°` }
      ],
      explanation: `Διαιρούμε την ορθή γωνία με το 2: 90° : 2 ＝ 45°. Καθεμία από τις δύο νέες γωνίες είναι οξεία και μετρά 45°.`
    };
  },
  // 5. Τριχοτόμηση ευθείας γωνίας
  () => {
    const third = 60;
    const unit = '°';
    const correct = `${third}${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `45${unit}`,
      `90${unit}`,
      `30${unit}`,
      `50${unit}`
    ]);
    return {
      title: 'ΧΩΡΙΣΜΟΣ ΕΥΘΕΙΑΣ ΓΩΝΙΑΣ ΣΕ 3 ΙΣΑ ΜΕΡΗ',
      prompt: `Μια ευθεία γωνία (180°) χωρίζεται σε 3 ίσες γωνίες. Πόσες μοίρες είναι καθεμία από αυτές;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Αρχική γωνία', value: '180° (Ευθεία)' },
        { label: 'Διαίρεση', value: 'Σε 3 ίσα μέρη' },
        { label: 'Πράξη', value: '180° : 3' },
        { label: 'Κάθε γωνία', value: `${third}°` }
      ],
      explanation: `Διαιρούμε την ευθεία γωνία με το 3: 180° : 3 ＝ 60°. Καθεμία από τις 3 ίσες γωνίες μετρά 60°.`
    };
  },
  // 6. Διαφορά γωνιών
  () => {
    const angleA = randInt(110, 150);
    const angleB = randInt(30, 70);
    const diff = angleA - angleB;
    const unit = '°';
    const correct = `${diff}${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `${diff + 10}${unit}`,
      `${diff - 10}${unit}`,
      `${diff + 20}${unit}`,
      `${angleA - angleB + 5}${unit}`
    ]);
    return {
      title: 'ΔΙΑΦΟΡΑ ΑΜΒΛΕΙΑΣ ΚΑΙ ΟΞΕΙΑΣ ΓΩΝΙΑΣ',
      prompt: `Μια αμβλεία γωνία είναι ${angleA}° και μια οξεία γωνία είναι ${angleB}°. Κατά πόσες μοίρες είναι μεγαλύτερη η αμβλεία γωνία από την οξεία;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Αμβλεία γωνία', value: `${angleA}°` },
        { label: 'Οξεία γωνία', value: `${angleB}°` },
        { label: 'Πράξη', value: `${angleA}° － ${angleB}°` },
        { label: 'Διαφορά', value: `${diff}°` }
      ],
      explanation: `Αφαιρούμε το μέτρο της οξείας γωνίας από το μέτρο της αμβλείας: ${angleA}° － ${angleB}° ＝ ${diff}°.`
    };
  }
];

const HARD_PROBLEMS_POOL = [
  // 1. Τρεις διαδοχικές γωνίες σε ευθεία γραμμή
  () => {
    const a1 = randInt(35, 60);
    const a2 = randInt(40, 70);
    const a3 = 180 - (a1 + a2);
    const unit = '°';
    const correct = `${a3}${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `${a3 + 10}${unit}`,
      `${a3 - 10}${unit}`,
      `${90 - a1}${unit}`,
      `${180 - a1}${unit}`
    ]);
    return {
      title: 'ΤΡΕΙΣ ΓΩΝΙΕΣ ΣΕ ΕΥΘΕΙΑ ΓΡΑΜΜΗ',
      prompt: `Πάνω σε μια ευθεία γραμμή σχηματίζονται τρεις διαδοχικές γωνίες που έχουν κοινή κορυφή. Αν οι δύο πρώτες είναι ${a1}° και ${a2}°, πόσες μοίρες είναι η τρίτη γωνία;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Συνολικό άθροισμα', value: '180° (Ευθεία γωνία)' },
        { label: 'Άθροισμα 2 πρώτων', value: `${a1}° ＋ ${a2}° ＝ ${a1 + a2}°` },
        { label: 'Πράξη', value: `180° － ${a1 + a2}°` },
        { label: 'Τρίτη γωνία', value: `${a3}°` }
      ],
      explanation: `Οι τρεις γωνίες σχηματίζουν μαζί ευθεία γωνία (180°). Προσθέτουμε τις δύο γνωστές: ${a1}° ＋ ${a2}° ＝ ${a1 + a2}°. Αφαιρούμε από το 180°: 180° － ${a1 + a2}° ＝ ${a3}°.`
    };
  },
  // 2. Διπλάσια παραπληρωματική γωνία
  () => {
    // α + 2α = 180 => 3α = 180 => α = 60, άρα 2α = 120
    const unit = '°';
    const correct = `120${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `60${unit}`,
      `90${unit}`,
      `135${unit}`,
      `100${unit}`
    ]);
    return {
      title: 'ΣΧΕΣΗ ΔΙΠΛΑΣΙΑΣ ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗΣ',
      prompt: `Δύο γωνίες είναι παραπληρωματικές (άθροισμα 180°) και η μία είναι διπλάσια από την άλλη. Πόσες μοίρες είναι η μεγαλύτερη γωνία;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Σχέση', value: 'Μικρή: 1 μέρος | Μεγάλη: 2 μέρη' },
        { label: 'Συνολικά μέρη', value: '1 ＋ 2 ＝ 3 ίσα μέρη' },
        { label: 'Υπολογισμός 1 μέρους', value: '180° : 3 ＝ 60° (μικρή γωνία)' },
        { label: 'Μεγαλύτερη γωνία', value: '2 · 60° ＝ 120°' }
      ],
      explanation: `Χωρίζουμε τις 180° σε 1 ＋ 2 ＝ 3 ίσα μέρη. Το ένα μέρος είναι 180° : 3 ＝ 60° (η μικρή γωνία). Η μεγαλύτερη είναι διπλάσια: 2 · 60° ＝ 120°.`
    };
  },
  // 3. Γωνία δεικτών στις 3:30
  () => {
    // Στις 3:30: ο λεπτοδείκτης στο 6, ο ωροδείκτης στα μισά ανάμεσα στο 3 και το 4 (3.5).
    // Απόσταση = 2.5 ώρες. 2.5 * 30° = 75°
    const unit = '°';
    const correct = `75${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `90${unit}`,
      `80${unit}`,
      `60${unit}`,
      `105${unit}`
    ]);
    return {
      title: 'ΓΩΝΙΑ ΔΕΙΚΤΩΝ ΣΤΙΣ 3:30',
      prompt: `Ένα αναλογικό ρολόι δείχνει ακριβώς 3:30. Πόσες μοίρες είναι η γωνία που σχηματίζουν οι δείκτες του ρολογιού;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Θέση λεπτοδείκτη', value: 'Ακριβώς στο 6' },
        { label: 'Θέση ωροδείκτη', value: 'Ακριβώς στη μέση μεταξύ 3 και 4 (3,5)' },
        { label: 'Διαφορά θέσεων', value: '6 － 3,5 ＝ 2,5 ώρες' },
        { label: 'Υπολογισμός μοιρών', value: `2,5 · 30° ＝ 75°` }
      ],
      explanation: `Στις 3:30 ο λεπτοδείκτης είναι στο 6, ενώ ο ωροδείκτης έχει προχωρήσει ακριβώς στο μέσο ανάμεσα στο 3 και το 4. Η απόστασή τους είναι 2,5 ώρες: 2,5 · 30° ＝ 75°.`
    };
  },
  // 4. Άθροισμα 4 γωνιών γύρω από κοινό σημείο
  () => {
    const a1 = 110;
    const a2 = 85;
    const a3 = 70;
    const a4 = 360 - (a1 + a2 + a3); // 360 - 265 = 95
    const unit = '°';
    const correct = `${a4}${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `85${unit}`,
      `105${unit}`,
      `90${unit}`,
      `100${unit}`
    ]);
    return {
      title: 'ΓΩΝΙΕΣ ΓΥΡΩ ΑΠΟ ΕΝΑ ΣΗΜΕΙΟ',
      prompt: `Τέσσερις γωνίες έχουν κοινή κορυφή και καλύπτουν ολόκληρο τον κύκλο (πλήρης γωνία 360°). Αν οι τρεις γωνίες είναι 110°, 85° και 70°, πόσο είναι το μέτρο της τέταρτης γωνίας;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Πλήρης κύκλος', value: '360°' },
        { label: 'Άθροισμα 3 γωνιών', value: `110° ＋ 85° ＋ 70° ＝ 265°` },
        { label: 'Πράξη', value: `360° － 265°` },
        { label: 'Τέταρτη γωνία', value: `${a4}°` }
      ],
      explanation: `Όλες οι γωνίες γύρω από ένα σημείο έχουν άθροισμα 360°. Προσθέτουμε τις τρεις: 110° ＋ 85° ＋ 70° ＝ 265°. Αφαιρούμε: 360° － 265° ＝ 95°.`
    };
  },
  // 5. Συμπληρωματικές με δοσμένη διαφορά
  () => {
    // α + β = 90, α - β = 20 => 2α = 110 => α = 55, β = 35
    const diff = 20;
    const larger = (90 + diff) / 2; // 55
    const unit = '°';
    const correct = `${larger}${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `35${unit}`,
      `45${unit}`,
      `65${unit}`,
      `50${unit}`
    ]);
    return {
      title: 'ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ ΜΕ ΔΙΑΦΟΡΑ',
      prompt: `Δύο γωνίες είναι συμπληρωματικές (άθροισμα 90°) και η μία είναι κατά ${diff}° μεγαλύτερη από την άλλη. Πόσες μοίρες είναι η μεγαλύτερη γωνία;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Άθροισμα γωνιών', value: '90°' },
        { label: 'Διαφορά γωνιών', value: `${diff}°` },
        { label: 'Τύπος μεγαλύτερης', value: `(90° ＋ ${diff}°) : 2 ＝ 110° : 2` },
        { label: 'Μεγαλύτερη γωνία', value: `${larger}°` }
      ],
      explanation: `Όταν γνωρίζουμε το άθροισμα (90°) και τη διαφορά (20°), η μεγαλύτερη γωνία ισούται με: (Άθροισμα ＋ Διαφορά) : 2 ＝ (90° ＋ 20°) : 2 ＝ 110° : 2 ＝ 55°. (Η μικρή είναι 55° － 20° ＝ 35°).`
    };
  },
  // 6. Περιστροφή ρομπότ σε ορθές γωνίες
  () => {
    const turns = randInt(3, 5);
    const totalDeg = turns * 90;
    const unit = '°';
    const correct = `${totalDeg}${unit}`;
    const options = ensureFourUniqueOptions(correct, () => [
      `${totalDeg + 90}${unit}`,
      `${totalDeg - 90}${unit}`,
      `${turns * 45}${unit}`,
      `${totalDeg + 45}${unit}`
    ]);
    return {
      title: 'ΣΥΝΟΛΙΚΗ ΣΤΡΟΦΗ ΡΟΜΠΟΤ',
      prompt: `Ένα ρομπότ προγραμματίζεται να στρίψει δεξιά κατά μία ορθή γωνία (90°) ακριβώς ${turns} διαδοχικές φορές. Πόσες μοίρες είναι η συνολική γωνία περιστροφής του ρομπότ;`,
      options,
      correctAnswer: correct,
      unit,
      tableData: [
        { label: 'Στροφή ανά φορά', value: '90° (Ορθή γωνία)' },
        { label: 'Πλήθος στροφών', value: `${turns}` },
        { label: 'Πράξη', value: `${turns} · 90°` },
        { label: 'Συνολική περιστροφή', value: `${totalDeg}°` }
      ],
      explanation: `Κάθε ορθή γωνία ισούται με 90°. Για ${turns} στροφές πολλαπλασιάζουμε: ${turns} · 90° ＝ ${totalDeg}°.`
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 10 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet() {
  const qs = [];

  // Q1: Έννοια γωνίας & μήκος πλευρών (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: 'ΜΕΓΕΘΟΣ ΓΩΝΙΑΣ ΚΑΙ ΠΛΕΥΡΕΣ',
    prompt: isQ1True
      ? 'Το μέγεθος μιας γωνίας εξαρτάται αποκλειστικά από το άνοιγμα των πλευρών της και όχι από το μήκος με το οποίο τις σχεδιάζουμε.'
      : 'Μια γωνία γίνεται μεγαλύτερη αν μεγαλώσουμε το μήκος των γραμμών που παριστάνουν τις πλευρές της.',
    correctAnswer: isQ1True,
    tableData: [
      { label: 'Ιδιότητα πλευρών', value: 'Οι πλευρές είναι ημιευθείες (άπειρο μήκος)' },
      { label: 'Μέγεθος γωνίας', value: 'Καθορίζεται μόνο από το άνοιγμα (μοίρες)' },
      { label: 'Σχεδιασμός', value: 'Το μήκος των γραμμών στο χαρτί δεν αλλάζει το άνοιγμα' }
    ],
    explanation: isQ1True
      ? 'ΣΩΣΤΟ: Το μέγεθος μιας γωνίας καθορίζεται μόνο από το άνοιγμα των πλευρών της (μοίρες). Το μήκος των γραμμών δεν επηρεάζει τη γωνία.'
      : 'ΛΑΘΟΣ: Οι πλευρές μιας γωνίας είναι ημιευθείες. Το μέγεθος εξαρτάται αποκλειστικά από το άνοιγμα και όχι από το μήκος σχεδίασης.'
  });

  // Q2: Μέτρο ορθής γωνίας (MCQ)
  qs.push({
    id: 2,
    type: 'mcq',
    title: 'ΜΕΤΡΟ ΟΡΘΗΣ ΓΩΝΙΑΣ',
    prompt: 'Πόσες μοίρες είναι ακριβώς μια ορθή γωνία;',
    options: ensureFourUniqueOptions('90°', () => ['45°', '180°', '360°', '60°']),
    correctAnswer: '90°',
    tableData: [
      { label: 'Είδος', value: 'Ορθή γωνία' },
      { label: 'Μέτρο σε μοίρες', value: '90°' },
      { label: 'Σχέση πλευρών', value: 'Κάθετες μεταξύ τους' }
    ],
    explanation: 'Μια ορθή γωνία είναι ακριβώς 90°. Οι πλευρές της είναι κάθετες μεταξύ τους.'
  });

  // Q3: Ταξινόμηση αμβλείας γωνίας (MCQ)
  const ambDeg = randInt(95, 160);
  qs.push({
    id: 3,
    type: 'mcq',
    title: 'ΤΑΞΙΝΟΜΗΣΗ ΓΩΝΙΑΣ',
    prompt: `Μια γωνία μετρήθηκε με το μοιρογνωμόνιο και βρέθηκε ίση με ${ambDeg}°. Τι είδος γωνίας είναι;`,
    options: ensureFourUniqueOptions('Αμβλεία γωνία', () => [
      'Οξεία γωνία',
      'Ορθή γωνία',
      'Ευθεία γωνία'
    ]),
    correctAnswer: 'Αμβλεία γωνία',
    tableData: [
      { label: 'Μέτρο', value: `${ambDeg}°` },
      { label: 'Κανόνας', value: '90° ＜ μέτρο ＜ 180°' },
      { label: 'Κατηγορία', value: 'Αμβλεία' }
    ],
    explanation: `Επειδή ${ambDeg}° ＞ 90° και ${ambDeg}° ＜ 180°, η γωνία είναι αμβλεία.`
  });

  // Q4: Οπτική αναγνώριση γωνίας (SVG - No Giveaway)
  qs.push({
    id: 4,
    type: 'mcq',
    title: 'ΑΝΑΓΝΩΡΙΣΗ ΣΧΗΜΑΤΟΣ ΓΩΝΙΑΣ',
    prompt: 'Παρατηρήστε το παρακάτω σχήμα. Τι είδος γωνίας απεικονίζεται;',
    svg: (
      <svg viewBox="0 0 180 120" className="w-44 h-28 mx-auto my-2 select-none drop-shadow-sm">
        <line x1="20" y1="100" x2="160" y2="100" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
        <line x1="20" y1="100" x2="110" y2="25" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
        <path d="M 55 100 A 35 35 0 0 0 45 79" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="20" cy="100" r="4.5" fill="#e11d48" />
      </svg>
    ),
    options: ensureFourUniqueOptions('Οξεία γωνία', () => [
      'Ορθή γωνία',
      'Αμβλεία γωνία',
      'Ευθεία γωνία'
    ]),
    correctAnswer: 'Οξεία γωνία',
    tableData: [
      { label: 'Σχήμα', value: 'Άνοιγμα μικρότερο από ορθή γωνία (＜ 90°)' },
      { label: 'Είδος', value: 'Οξεία γωνία' }
    ],
    explanation: 'Το άνοιγμα των δύο πλευρών είναι σαφώς μικρότερο από 90° (ορθή γωνία), επομένως το σχήμα παριστάνει οξεία γωνία.'
  });

  // Q5: Υπολογισμός συμπληρώματος (Input αριθμού)
  const angleQ5 = randInt(25, 75);
  const compQ5 = 90 - angleQ5;
  qs.push({
    id: 5,
    type: 'input',
    title: 'ΣΥΜΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ',
    prompt: `Μια γωνία είναι ${angleQ5}°. Πόσες μοίρες είναι η συμπληρωματική της γωνία; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(compQ5),
    tableData: [
      { label: 'Αρχική γωνία', value: `${angleQ5}°` },
      { label: 'Άθροισμα συμπληρωματικών', value: '90°' },
      { label: 'Πράξη', value: `90° － ${angleQ5}° ＝ ${compQ5}°` }
    ],
    explanation: `Δύο γωνίες είναι συμπληρωματικές όταν το άθροισμά τους είναι 90°. Υπολογίζουμε: 90° － ${angleQ5}° ＝ ${compQ5}°.`
  });

  // Q6: Υπολογισμός παραπληρώματος (Input αριθμού)
  const angleQ6 = randInt(50, 130);
  const suppQ6 = 180 - angleQ6;
  qs.push({
    id: 6,
    type: 'input',
    title: 'ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ',
    prompt: `Μια γωνία έχει μέτρο ${angleQ6}°. Πόσες μοίρες είναι η παραπληρωματική της γωνία; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(suppQ6),
    tableData: [
      { label: 'Αρχική γωνία', value: `${angleQ6}°` },
      { label: 'Άθροισμα παραπληρωματικών', value: '180°' },
      { label: 'Πράξη', value: `180° － ${angleQ6}° ＝ ${suppQ6}°` }
    ],
    explanation: `Δύο γωνίες είναι παραπληρωματικές όταν έχουν άθροισμα 180°. Υπολογίζουμε: 180° － ${angleQ6}° ＝ ${suppQ6}°.`
  });

  // Q7: Μέτρο ευθείας γωνίας (MCQ)
  qs.push({
    id: 7,
    type: 'mcq',
    title: 'ΜΕΤΡΟ ΕΥΘΕΙΑΣ ΓΩΝΙΑΣ',
    prompt: 'Πόσες μοίρες ισούται μία ευθεία γωνία;',
    options: ensureFourUniqueOptions('180°', () => ['90°', '360°', '270°', '100°']),
    correctAnswer: '180°',
    tableData: [
      { label: 'Είδος', value: 'Ευθεία γωνία' },
      { label: 'Μέτρο σε μοίρες', value: '180°' },
      { label: 'Ισοδυναμία', value: '2 ορθές γωνίες (2 · 90° ＝ 180°)' }
    ],
    explanation: 'Μία ευθεία γωνία ισούται με 180°. Αποτελείται από δύο αντικείμενες ημιευθείες και ισοδυναμεί με δύο ορθές γωνίες.'
  });

  // Q8: Δείκτες ρολογιού στις 6:00 (MCQ)
  qs.push({
    id: 8,
    type: 'mcq',
    title: 'ΔΕΙΚΤΕΣ ΡΟΛΟΓΙΟΥ ΣΤΙΣ 6:00',
    prompt: 'Όταν ένα ρολόι δείχνει ακριβώς 6:00, τι είδους γωνία σχηματίζουν οι δείκτες του;',
    options: ensureFourUniqueOptions('Ευθεία γωνία (180°)', () => [
      'Ορθή γωνία (90°)',
      'Οξεία γωνία (60°)',
      'Πλήρης γωνία (360°)'
    ]),
    correctAnswer: 'Ευθεία γωνία (180°)',
    tableData: [
      { label: 'Ώρα', value: '6:00' },
      { label: 'Θέσεις δεικτών', value: 'Ο λεπτοδείκτης στο 12, ο ωροδείκτης στο 6' },
      { label: 'Μορφή', value: 'Σχηματίζουν μία ευθεία γραμμή (180°)' }
    ],
    explanation: 'Στις 6:00 ο ωροδείκτης δείχνει προς τα κάτω (στο 6) και ο λεπτοδείκτης προς τα πάνω (στο 12). Σχηματίζουν ευθεία γραμμή, δηλαδή ευθεία γωνία 180°.'
  });

  // Q9: Πρόβλημα από STANDARD_PROBLEMS_POOL
  const stdIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Data = STANDARD_PROBLEMS_POOL[stdIndex]();
  qs.push({
    id: 9,
    type: 'mcq',
    ...q9Data
  });

  // Q10: Πρόβλημα από HARD_PROBLEMS_POOL
  const hardIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hardIndex]();
  qs.push({
    id: 10,
    type: 'mcq',
    ...q10Data
  });

  return qs;
}

// -------------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΑΣΚΗΣΕΩΝ
// -------------------------------------------------------------

export default function GoniesAskiseisPage() {
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
  const totalCount = questions.length || 10;
  const percentage = Math.round((score / totalCount) * 100);

  return (
    <Layout
      title="Ασκήσεις: Μέτρηση &amp; Σύγκριση Γωνιών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις στη μέτρηση και σύγκριση γωνιών, τα είδη γωνιών και τις συμπληρωματικές/παραπληρωματικές σχέσεις για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou/68-gonies"
      backText="Θεωρία Κεφ. 68"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/68-gonies"
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
              <span>ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 68 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {toCleanUppercase('Ασκησεις: Μετρηση και Συγκριση Γωνιων')}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξασκηθείτε στα είδη των γωνιών, τη χρήση του μοιρογνωμονίου, τις συμπληρωματικές και τις παραπληρωματικές γωνίες μέσα από 10 δυναμικές ερωτήσεις.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>10 Δυναμικές Ασκήσεις με Αυτόματη Αξιολόγηση &amp; Αναλυτική Επεξήγηση</span>
            </div>
            <button
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>🔄 {toCleanUppercase('Νεες Ασκησεις')}</span>
            </button>
          </div>
        </section>

        {/* ΛΙΣΤΑ ΕΡΩΤΗΣΕΩΝ */}
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

        {/* STICKY BOTTOM SCORE FOOTER */}
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

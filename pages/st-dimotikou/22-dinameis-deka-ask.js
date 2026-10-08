// pages/st-dimotikou/22-dinameis-deka-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ & DEFENSIVE CHECKS
// ---------------------------------------------------------

function randInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function shuffle(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποίηση αριθμών με ελληνικό locale
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

const EXPONENTS_UNICODE = {
  0: '⁰',
  1: '¹',
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
  6: '⁶',
  7: '⁷',
  8: '⁸',
  9: '⁹',
  10: '¹⁰'
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    title: 'Εισιτήρια Συναυλίας',
    unit: 'ευρώ (€)',
    generate: () => {
      const coeff = randInt(3, 8);
      const exp = randInt(4, 5); // 10^4 = 10.000 ή 10^5 = 100.000
      const total = coeff * Math.pow(10, exp);
      return {
        prompt: `Τα συνολικά έσοδα από μία μεγάλη φιλανθρωπική συναυλία έφτασαν τα ${formatNum(total)} €. Πώς γράφεται σύντομα αυτό το ποσό με χρήση δύναμης του 10;`,
        unit: '€',
        correctVal: total,
        correctText: `${coeff} · 10${EXPONENTS_UNICODE[exp]} €`,
        tableData: [
          { item: 'Συνολικό Ποσό', formula: `${formatNum(total)} €`, val: `${formatNum(total)} €` },
          { item: 'Πλήθος Μηδενικών', formula: `${exp} μηδενικά`, val: `10${EXPONENTS_UNICODE[exp]}` },
          { item: 'Σύντομη Γραφή', formula: `${coeff} · 10${EXPONENTS_UNICODE[exp]}`, val: `${coeff} · 10${EXPONENTS_UNICODE[exp]} €` }
        ],
        explain: `Ο αριθμός ${formatNum(total)} έχει ${exp} μηδενικά, άρα ισούται με ${coeff} · ${formatNum(Math.pow(10, exp))} ＝ ${coeff} · 10${EXPONENTS_UNICODE[exp]} €.`,
        distractors: [
          `${coeff} · 10${EXPONENTS_UNICODE[exp - 1]} €`,
          `${coeff} · 10${EXPONENTS_UNICODE[exp + 1]} €`,
          `${coeff + 1} · 10${EXPONENTS_UNICODE[exp]} €`
        ]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Συσκευασίες Καρφιών σε Εργοστάσιο',
    unit: 'καρφιά',
    generate: () => {
      const boxes = randInt(4, 9);
      const perBoxExp = 3; // 10^3 = 1.000
      const total = boxes * 1000;
      return {
        prompt: `Ένα εργοστάσιο παρήγαγε ${boxes} κιβώτια με καρφιά. Κάθε κιβώτιο περιέχει ακριβώς 10³ καρφιά. Πόσα καρφιά παρήχθησαν συνολικά;`,
        unit: 'καρφιά',
        correctVal: total,
        correctText: `${formatNum(total)} καρφιά`,
        tableData: [
          { item: 'Πλήθος Κιβωτίων', formula: `${boxes}`, val: `${boxes}` },
          { item: 'Καρφιά ανά Κιβώτιο', formula: '10³ ＝ 1.000', val: '1.000' },
          { item: 'Συνολικό Πλήθος', formula: `${boxes} · 1.000`, val: `${formatNum(total)} καρφιά` }
        ],
        explain: `Η δύναμη 10³ ισούται με 1.000 (1 ακολουθούμενο από 3 μηδενικά). Άρα: ${boxes} · 1.000 ＝ ${formatNum(total)} καρφιά.`,
        distractors: [
          `${formatNum(boxes * 100)} καρφιά`,
          `${formatNum(boxes * 10000)} καρφιά`,
          `${formatNum(boxes * 30)} καρφιά`
        ]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Μικροοργανισμοί σε Δεξαμενή',
    unit: 'μικροοργανισμοί',
    generate: () => {
      const coeff = randInt(2, 7);
      const exp = 6; // 10^6 = 1.000.000
      const total = coeff * 1000000;
      return {
        prompt: `Σε έναν βιολογικό καθαρισμό μετρήθηκαν ${coeff} · 10⁶ μικροοργανισμοί ανά κυβικό μέτρο νερού. Ποιος είναι ο ακριβής αριθμός των μικροοργανισμών σε κανονική αριθμητική γραφή;`,
        unit: 'μικροοργανισμοί',
        correctVal: total,
        correctText: `${formatNum(total)} μικροοργανισμοί`,
        tableData: [
          { item: 'Δύναμη του 10', formula: '10⁶ (6 μηδενικά)', val: '1.000.000' },
          { item: 'Συντελεστής', formula: `${coeff}`, val: `${coeff}` },
          { item: 'Αριθμητική Τιμή', formula: `${coeff} · 1.000.000`, val: `${formatNum(total)}` }
        ],
        explain: `Η δύναμη 10⁶ ισούται με 1.000.000 (ένα εκατομμύριο). Επομένως: ${coeff} · 10⁶ ＝ ${formatNum(total)} μικροοργανισμοί.`,
        distractors: [
          `${formatNum(coeff * 100000)} μικροοργανισμοί`,
          `${formatNum(coeff * 10000000)} μικροοργανισμοί`,
          `${formatNum(coeff * 60)} μικροοργανισμοί`
        ]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Σελίδες σε Ψηφιακή Βιβλιοθήκη',
    unit: 'σελίδες',
    generate: () => {
      const coeff = randInt(3, 9);
      const exp = 4; // 10^4 = 10.000
      const total = coeff * 10000;
      return {
        prompt: `Μία ψηφιακή εκπαιδευτική πλατφόρμα περιέχει ${formatNum(total)} σελίδες ασκήσεων. Πώς γράφεται σύντομα αυτό το νούμερο ως γινόμενο μονοψήφιου αριθμού με δύναμη του 10;`,
        unit: 'σελίδες',
        correctVal: total,
        correctText: `${coeff} · 10⁴ σελίδες`,
        tableData: [
          { item: 'Αριθμός Σελίδων', formula: `${formatNum(total)}`, val: `${formatNum(total)}` },
          { item: 'Ανάλυση', formula: `${coeff} · 10.000`, val: `${coeff} · 10⁴` }
        ],
        explain: `Ο αριθμός ${formatNum(total)} αποτελείται από το ψηφίο ${coeff} ακολουθούμενο από 4 μηδενικά, δηλαδή ${coeff} · 10⁴ σελίδες.`,
        distractors: [
          `${coeff} · 10³ σελίδες`,
          `${coeff} · 10⁵ σελίδες`,
          `${coeff + 1} · 10⁴ σελίδες`
        ]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Απόσταση Αστεροειδούς στο Διάστημα',
    unit: 'χλμ.',
    generate: () => {
      const coeff = randInt(2, 6);
      const exp = 5; // 10^5 = 100.000
      const total = coeff * 100000;
      return {
        prompt: `Ένα τηλεσκόπιο κατέγραψε έναν αστεροειδή που απέχει ${coeff} · 10⁵ χιλιόμετρα από τη Γη. Πόσα χιλιόμετρα είναι αυτή η απόσταση;`,
        unit: 'χλμ.',
        correctVal: total,
        correctText: `${formatNum(total)} χλμ.`,
        tableData: [
          { item: 'Εκθέτης', formula: '5 μηδενικά', val: '100.000' },
          { item: 'Υπολογισμός', formula: `${coeff} · 100.000`, val: `${formatNum(total)} χλμ.` }
        ],
        explain: `Το 10⁵ ισούται με το 1 ακολουθούμενο από 5 μηδενικά (100.000). Έτσι: ${coeff} · 100.000 ＝ ${formatNum(total)} χλμ.`,
        distractors: [
          `${formatNum(coeff * 10000)} χλμ.`,
          `${formatNum(coeff * 1000000)} χλμ.`,
          `${formatNum(coeff * 50)} χλμ.`
        ]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Αποθήκευση Δεδομένων σε Bytes',
    unit: 'bytes',
    generate: () => {
      const coeff = randInt(5, 9);
      const exp = 3; // 10^3 = 1.000
      const total = coeff * 1000;
      return {
        prompt: `Ένα ψηφιακό αρχείο κειμένου καταλαμβάνει ${coeff} · 10³ bytes στη μνήμη. Πόσα bytes καταλαμβάνει το αρχείο;`,
        unit: 'bytes',
        correctVal: total,
        correctText: `${formatNum(total)} bytes`,
        tableData: [
          { item: 'Δύναμη 10³', formula: '1.000 bytes', val: '1.000' },
          { item: 'Συνολικό Μέγεθος', formula: `${coeff} · 1.000`, val: `${formatNum(total)} bytes` }
        ],
        explain: `10³ ＝ 1.000 bytes. Επομένως: ${coeff} · 10³ ＝ ${formatNum(total)} bytes.`,
        distractors: [
          `${formatNum(coeff * 100)} bytes`,
          `${formatNum(coeff * 10000)} bytes`,
          `${formatNum(coeff * 300)} bytes`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Η Ταχύτητα του Φωτός',
    unit: 'm/s',
    generate: () => {
      const coeff = 3;
      const exp = 8;
      const total = 300000000;
      return {
        prompt: `Η ταχύτητα του φωτός στο κενό είναι περίπου 3 · 10⁸ μέτρα ανά δευτερόλεπτο. Πόσα μέτρα ανά δευτερόλεπτο διανύει το φως σε κανονική αναπτυγμένη μορφή;`,
        unit: 'm/s',
        correctVal: total,
        correctText: '300.000.000 m/s (300 εκατομμύρια)',
        tableData: [
          { item: 'Δύναμη 10⁸', formula: '1 με 8 μηδενικά', val: '100.000.000' },
          { item: 'Ταχύτητα', formula: '3 · 100.000.000', val: '300.000.000 m/s' }
        ],
        explain: `10⁸ ＝ 100.000.000 (8 μηδενικά). Πολλαπλασιάζοντας με το 3 έχουμε 300.000.000 μέτρα ανά δευτερόλεπτο (300 εκατομμύρια m/s).`,
        distractors: [
          '30.000.000 m/s',
          '3.000.000.000 m/s',
          '24.000.000 m/s'
        ]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Αστέρια στον Γαλαξία',
    unit: 'αστέρια',
    generate: () => {
      const coeff = randInt(2, 4);
      const exp = 11;
      const valText = `${coeff * 100} δισεκατομμύρια`;
      return {
        prompt: `Οι αστρονόμοι εκτιμούν ότι ένας σπειροειδής γαλαξίας περιέχει περίπου ${coeff} · 10¹¹ αστέρια. Πόσα αστέρια εκφράζει αυτός ο αριθμός με λόγια;`,
        unit: 'αστέρια',
        correctVal: coeff * 100,
        correctText: `${valText} αστέρια`,
        tableData: [
          { item: '10⁹', formula: '1 δισεκατομμύριο (9 μηδενικά)', val: '1.000.000.000' },
          { item: '10¹¹', formula: '100 δισεκατομμύρια (11 μηδενικά)', val: '100.000.000.000' },
          { item: `${coeff} · 10¹¹`, formula: `${coeff} · 100 δισεκατομμύρια`, val: `${valText}` }
        ],
        explain: `Ο εκθέτης 9 δηλώνει τα δισεκατομμύρια (10⁹). Ο εκθέτης 11 έχει 2 επιπλέον μηδενικά (100 δισεκατομμύρια). Άρα: ${coeff} · 10¹¹ ＝ ${valText} αστέρια.`,
        distractors: [
          `${coeff * 10} δισεκατομμύρια αστέρια`,
          `${coeff} τρισεκατομμύρια αστέρια`,
          `${coeff * 100} εκατομμύρια αστέρια`
        ]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Πληθυσμός Κυττάρων στον Ανθρώπινο Εγκέφαλο',
    unit: 'συνάψεις',
    generate: () => {
      return {
        prompt: `Ο ανθρώπινος εγκέφαλος περιέχει περίπου 10¹¹ νευρώνες (νευρικά κύτταρα). Αν κάθε νευρώνας κάνει κατά μέσο όρο 10³ συνάψεις, ποια δύναμη του 10 εκφράζει το συνολικό πλήθος των συνάψεων; (Χρησιμοποίησε τον κανόνα: 10¹¹ · 10³ ＝ 10¹¹⁺³)`,
        unit: 'συνάψεις',
        correctVal: 14,
        correctText: `10¹⁴ συνάψεις (100 τρισεκατομμύρια)`,
        tableData: [
          { item: 'Νευρώνες', formula: '10¹¹', val: '100 δισεκατομμύρια' },
          { item: 'Συνάψεις ανά νευρώνα', formula: '10³', val: '1.000' },
          { item: 'Σύνολο Συνάψεων', formula: '10¹¹ · 10³ ＝ 10¹¹⁺³', val: '10¹⁴' }
        ],
        explain: `Όταν πολλαπλασιάζουμε δυνάμεις με την ίδια βάση (το 10), προσθέτουμε τους εκθέτες: 11 ＋ 3 ＝ 14. Άρα έχουμε 10¹⁴ συνάψεις.`,
        distractors: [
          '10³³ συνάψεις',
          '10⁸ συνάψεις',
          '10¹² συνάψεις'
        ]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Σύγκριση Μεγάλων Μεγεθών',
    unit: 'φορές',
    generate: () => {
      const exp1 = randInt(6, 8);
      const exp2 = exp1 - randInt(2, 3);
      const diff = exp1 - exp2;
      const times = Math.pow(10, diff);
      return {
        prompt: `Πόσες φορές μεγαλύτερο είναι ένα κονδύλι 10${EXPONENTS_UNICODE[exp1]} € από ένα κονδύλι 10${EXPONENTS_UNICODE[exp2]} €;`,
        unit: 'φορές',
        correctVal: times,
        correctText: `${formatNum(times)} φορές (10${EXPONENTS_UNICODE[diff]})`,
        tableData: [
          { item: 'Μεγαλύτερο Ποσό', formula: `10${EXPONENTS_UNICODE[exp1]}`, val: `${exp1} μηδενικά` },
          { item: 'Μικρότερο Ποσό', formula: `10${EXPONENTS_UNICODE[exp2]}`, val: `${exp2} μηδενικά` },
          { item: 'Λόγος Μεγεθών', formula: `10${EXPONENTS_UNICODE[exp1]} : 10${EXPONENTS_UNICODE[exp2]} ＝ 10${EXPONENTS_UNICODE[diff]}`, val: `${formatNum(times)} φορές` }
        ],
        explain: `Η διαφορά των εκθετών είναι ${exp1} － ${exp2} ＝ ${diff}. Επομένως, το πρώτο ποσό έχει ${diff} επιπλέον μηδενικά, δηλαδή είναι 10${EXPONENTS_UNICODE[diff]} ＝ ${formatNum(times)} φορές μεγαλύτερο!`,
        distractors: [
          `${diff} φορές`,
          `${formatNum(times * 10)} φορές`,
          `${formatNum(Math.max(10, times / 10))} φορές`
        ]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Χρηματικός Προϋπολογισμός Κράτους',
    unit: 'ευρώ (€)',
    generate: () => {
      const coeff = randInt(4, 9);
      const exp = 10;
      const valText = `${coeff * 10} δισεκατομμύρια €`;
      return {
        prompt: `Τα ετήσια κρατικά έσοδα μιας ευρωπαϊκής χώρας ανέρχονται σε ${coeff} · 10¹⁰ €. Ποιο είναι το ποσό αυτό διατυπωμένο με λόγια;`,
        unit: '€',
        correctVal: coeff * 10,
        correctText: valText,
        tableData: [
          { item: '10⁹ €', formula: '1 δισεκατομμύριο €', val: '1.000.000.000 €' },
          { item: '10¹⁰ €', formula: '10 δισεκατομμύρια €', val: '10.000.000.000 €' },
          { item: `${coeff} · 10¹⁰ €`, formula: `${coeff} · 10 δισεκατομμύρια €`, val: valText }
        ],
        explain: `10¹⁰ ＝ 10.000.000.000 (10 δισεκατομμύρια). Πολλαπλασιάζοντας με το ${coeff}, προκύπτουν ακριβώς ${valText}.`,
        distractors: [
          `${coeff} δισεκατομμύρια €`,
          `${coeff * 100} εκατομμύρια €`,
          `${coeff} τρισεκατομμύρια €`
        ]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Κύτταρα στο Ανθρώπινο Σώμα',
    unit: 'μηδενικά',
    generate: () => {
      const coeff = 3;
      const exp = 13;
      return {
        prompt: `Το ανθρώπινο σώμα αποτελείται από περίπου 3 · 10¹³ κύτταρα. Πόσα μηδενικά έχει αυτός ο αριθμός όταν γραφτεί ολόκληρος με ψηφία μετά το 3;`,
        unit: 'μηδενικά',
        correctVal: exp,
        correctText: `${exp} μηδενικά (30 τρισεκατομμύρια)`,
        tableData: [
          { item: 'Μορφή', formula: `3 · 10¹³`, val: `Εκθέτης ${exp}` },
          { item: 'Πλήθος Μηδενικών', formula: 'Ίσο με τον εκθέτη της δύναμης του 10', val: `${exp} μηδενικά` }
        ],
        explain: `Στη δύναμη 10¹³, ο εκθέτης 13 δείχνει ότι μετά το ψηφίο 3 ακολουθούν ακριβώς 13 μηδενικά (δηλαδή 30.000.000.000.000 κύτταρα).`,
        distractors: [
          '12 μηδενικά',
          '14 μηδενικά',
          '10 μηδενικά'
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Υπολογισμός δύναμης του 10
  const q1Exp = randInt(2, 6);
  const q1Val = Math.pow(10, q1Exp);
  const q1Correct = String(q1Val);

  // Q2: Input - Πλήθος μηδενικών σε μια δύναμη του 10
  const q2Exp = randInt(3, 8);
  const q2Correct = String(q2Exp);

  // Q3: MCQ - Σύντομη γραφή μεγάλου αριθμού σε δύναμη του 10
  const q3Exp = randInt(3, 7);
  const q3Val = Math.pow(10, q3Exp);
  const q3CorrectStr = `10${EXPONENTS_UNICODE[q3Exp]}`;
  const q3Wrongs = [
    `10${EXPONENTS_UNICODE[q3Exp - 1]}`,
    `10${EXPONENTS_UNICODE[q3Exp + 1]}`,
    `10${EXPONENTS_UNICODE[q3Exp + 2]}`
  ];
  const q3Options = shuffle([...new Set([q3CorrectStr, ...q3Wrongs])]);

  // Q4: MCQ - Εύρεση αριθμού από ανάπτυγμα με δύναμη του 10
  const q4Digit = randInt(2, 9);
  const q4Exp = randInt(2, 5);
  const q4Result = q4Digit * Math.pow(10, q4Exp);
  const q4CorrectStr = formatNum(q4Result);
  const q4Wrongs = [
    formatNum(q4Digit * Math.pow(10, q4Exp - 1)),
    formatNum(q4Digit * Math.pow(10, q4Exp + 1)),
    formatNum(q4Digit * 10 + q4Exp)
  ];
  const q4Options = shuffle([...new Set([q4CorrectStr, ...q4Wrongs])]);

  // Q5: True/False - Η ειδική περίπτωση 10^0 = 1
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Η δύναμη 10⁰ ισούται με 1.'
    : 'Η δύναμη 10⁰ ισούται με 0.';

  // Q6: True/False - Κανόνας για τα μηδενικά
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Σε μία δύναμη του 10, ο εκθέτης δείχνει ακριβώς πόσα μηδενικά ακολουθούν μετά το 1.'
    : 'Σε μία δύναμη του 10, ο εκθέτης δείχνει με πόσα μηδενικά πολλαπλασιάζουμε το 10.';

  // Q7: Input - Εύρεση εκθέτη: 10^x = τιμή
  const q7Exp = [2, 3, 4, 5, 6, 7][randInt(0, 5)];
  const q7Val = Math.pow(10, q7Exp);
  const q7Correct = String(q7Exp);

  // Q8: MCQ - Πράξεις με δυνάμεις του 10
  const q8Pool = [
    {
      prompt: 'Ποιο είναι το αποτέλεσμα της πρόσθεσης 10³ ＋ 10²;',
      correct: '1.100',
      wrong: ['2.000', '10⁵', '10.000'],
      explain: '10³ ＝ 1.000 και 10² ＝ 100. Επομένως, 1.000 ＋ 100 ＝ 1.100.'
    },
    {
      prompt: 'Ποιο είναι το αποτέλεσμα της αφαίρεσης 10⁴ － 10³;',
      correct: '9.000',
      wrong: ['10', '1.000', '9.900'],
      explain: '10⁴ ＝ 10.000 και 10³ ＝ 1.000. Επομένως, 10.000 － 1.000 ＝ 9.000.'
    },
    {
      prompt: 'Ποιο είναι το αποτέλεσμα της παράστασης 5 · 10³ ＋ 3 · 10²;',
      correct: '5.300',
      wrong: ['5.030', '8.000', '53.000'],
      explain: '5 · 1.000 ＝ 5.000 και 3 · 100 ＝ 300. Άρα: 5.000 ＋ 300 ＝ 5.300.'
    }
  ];
  const q8Data = q8Pool[randInt(0, q8Pool.length - 1)];
  const q8Options = shuffle([...new Set([q8Data.correct, ...q8Data.wrong])]);

  // Q9: Standard Problem (Pool of 6)
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate();
  const q9Options = shuffle([
    ...new Set([q9Raw.correctText, ...q9Raw.distractors])
  ]);

  // Q10: Hard Problem (Pool of 6)
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate();
  const q10Options = shuffle([
    ...new Set([q10Raw.correctText, ...q10Raw.distractors])
  ]);

  return [
    {
      id: 'q1',
      type: 'input',
      title: 'Υπολογισμός Δύναμης του 10',
      prompt: `Ποια είναι η αριθμητική τιμή της δύναμης 10${EXPONENTS_UNICODE[q1Exp]};`,
      correct: q1Correct,
      explain: `10${EXPONENTS_UNICODE[q1Exp]} ＝ 1 ακολουθούμενο από ${q1Exp} μηδενικά ＝ ${formatNum(q1Val)}.`
    },
    {
      id: 'q2',
      type: 'input',
      title: 'Πλήθος Μηδενικών',
      prompt: `Πόσα μηδενικά ακολουθούν μετά το 1 όταν αναπτύξουμε τη δύναμη 10${EXPONENTS_UNICODE[q2Exp]};`,
      correct: q2Correct,
      explain: `Στη δύναμη 10${EXPONENTS_UNICODE[q2Exp]}, ο εκθέτης είναι το ${q2Exp}, άρα το 1 ακολουθείται από ${q2Exp} μηδενικά.`
    },
    {
      id: 'q3',
      type: 'mcq',
      title: 'Σύντομη Μορφή Δύναμης',
      prompt: `Πώς γράφεται ο αριθμός ${formatNum(q3Val)} ως δύναμη με βάση το 10;`,
      options: q3Options,
      correct: q3CorrectStr,
      explain: `Ο αριθμός ${formatNum(q3Val)} έχει ${q3Exp} μηδενικά, άρα γράφεται 10${EXPONENTS_UNICODE[q3Exp]}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Ανάπτυγμα με Δύναμη του 10',
      prompt: `Ποια είναι η τελική τιμή της παράστασης ${q4Digit} · 10${EXPONENTS_UNICODE[q4Exp]};`,
      options: q4Options,
      correct: q4CorrectStr,
      explain: `10${EXPONENTS_UNICODE[q4Exp]} ＝ ${formatNum(Math.pow(10, q4Exp))}. Επομένως: ${q4Digit} · ${formatNum(Math.pow(10, q4Exp))} ＝ ${formatNum(q4Result)}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Η Δύναμη 10⁰',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Κάθε μη μηδενικός αριθμός στον εκθέτη 0 ισούται με 1 (10⁰ ＝ 1).'
        : 'Λάθος! 10⁰ ＝ 1 (το 1 χωρίς κανένα μηδενικό, δηλαδή 1 μονάδα, όχι 0).'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Κανόνας των Μηδενικών',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Ο εκθέτης στις δυνάμεις του 10 ισούται ακριβώς με το πλήθος των μηδενικών μετά το 1.'
        : 'Λάθος! Ο εκθέτης δείχνει το πλήθος των μηδενικών που τοποθετούνται μετά το 1.'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Εύρεση Εκθέτη',
      prompt: `Ποιος είναι ο εκθέτης x στην ισότητα 10ˣ ＝ ${formatNum(q7Val)};`,
      correct: q7Correct,
      explain: `Ο αριθμός ${formatNum(q7Val)} έχει ${q7Exp} μηδενικά, επομένως 10${EXPONENTS_UNICODE[q7Exp]} ＝ ${formatNum(q7Val)} (εκθέτης: ${q7Exp}).`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Πράξεις με Δυνάμεις του 10',
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correct,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'mcq',
      title: `Πρόβλημα: ${STANDARD_PROBLEMS_POOL[spIndex].title}`,
      prompt: q9Raw.prompt,
      options: q9Options,
      correct: q9Raw.correctText,
      tableData: q9Raw.tableData,
      explain: q9Raw.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `Σύνθετο Πρόβλημα: ${HARD_PROBLEMS_POOL[hpIndex].title}`,
      prompt: q10Raw.prompt,
      options: q10Options,
      correct: q10Raw.correctText,
      tableData: q10Raw.tableData,
      explain: q10Raw.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function DinameisDekaExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions();
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach(q => {
      initialAnswers[q.id] = q.type === 'tf' ? null : '';
    });
    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμός Input μόνο για ακέραιους αριθμούς (0-9)
  const handleInputChange = (id, val) => {
    if (submitted) return;
    let sanitized = String(val).replace(/[^0-9]/g, '');
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers(prev => ({ ...prev, [id]: sanitized }));
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\s+/g, '').replace(/\./g, '').trim();
      const cleanTarget = q.correct.replace(/\s+/g, '').replace(/\./g, '').trim();
      return cleanUser === cleanTarget;
    }
    if (q.type === 'mcq') {
      return userVal === q.correct;
    }
    if (q.type === 'tf') {
      return userVal === q.correct;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || questions.length === 0) return;

    let total = 0;
    questions.forEach(q => {
      if (isQuestionCorrect(q)) total += 1;
    });

    setScore(total);
    setSubmitted(true);
  };

  const getCardStyle = (q) => {
    if (!submitted) return 'bg-white border-slate-200 shadow-sm';
    return isQuestionCorrect(q)
      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-1 ring-emerald-400'
      : 'bg-rose-50/70 border-rose-400 shadow-md ring-1 ring-rose-400';
  };

  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== null && String(val).trim() !== '').length;

  return (
    <Layout
      title="Ασκήσεις: Οι Δυνάμεις του 10 - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στις δυνάμεις του 10 και τη σύντομη γραφή μεγάλων αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/22-dinameis-deka"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase('Θεωρία')}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>ΚΕΦΑΛΑΙΟ 22 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Οι Δυνάμεις του 10
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον υπολογισμό δυνάμεων του 10, στην καταμέτρηση μηδενικών και στη σύντομη γραφή μεγάλων αριθμών!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase('Νέες Ασκήσεις')}</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΙΣ 10 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all ${getCardStyle(q)}`}
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider">
                        {toCleanUppercase(`Άσκηση ${qNum}`)} • {toCleanUppercase(q.title)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4">
                      {q.type === 'tf' ? `«${q.text}»` : q.prompt}
                    </p>

                    {/* INPUTS / OPTIONS */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleInputChange(q.id, opt)}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words whitespace-normal leading-snug flex items-center justify-center min-h-[48px] ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'input' && (
                      <div className="space-y-2 mb-3">
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          spellCheck="false"
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder="Γράψε την απάντησή σου..."
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}

                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(q.id, true)}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            answers[q.id] === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                          }`}
                        >
                          👍 {toCleanUppercase('Σωστό')}
                        </button>
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(q.id, false)}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            answers[q.id] === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          👎 {toCleanUppercase('Λάθος')}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          <table className="w-full text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase('Στοιχείο')}</th>
                                <th className="p-1.5">{toCleanUppercase('Ανάλυση / Τύπος')}</th>
                                <th className="p-1.5">{toCleanUppercase('Τιμή')}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900">{row.item}</td>
                                  <td className="p-1.5 text-indigo-700">{row.formula}</td>
                                  <td className="p-1.5 font-black text-emerald-700">{row.val}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? '🎯 Εξαιρετικά!' : '💡 Επεξήγηση:'}
                        </p>
                        <p>{q.explain}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation"
              >
                <span className="text-xl">🎯</span>
                <span>{toCleanUppercase('Έλεγχος Απαντήσεων')}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase('Σκορ') : toCleanUppercase('Απαντήθηκαν')}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase('Ποσοστό')}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 10) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* GUIDANCE OR RESTART */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase('Νέες Ασκήσεις')}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Απάντησε και στις 10 ερωτήσεις και πάτησε «{toCleanUppercase('Έλεγχος Απαντήσεων')}»!
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}

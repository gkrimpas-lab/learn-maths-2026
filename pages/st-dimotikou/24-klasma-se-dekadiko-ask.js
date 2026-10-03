// pages/st-dimotikou/24-klasma-se-dekadiko-ask.js
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

// Αφαιρεση τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποιηση αριθμων με ελληνικο locale
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    title: 'Μοίρασμα Πίτσας',
    unit: '',
    generate: () => {
      const parts = 4;
      const eaten = 3;
      const dec = '0,75';
      return {
        prompt: `Μία παρέα παρήγγειλε μία πίτσα χωρισμένη σε ${parts} ίσα κομμάτια και κατανάλωσε τα ${eaten} από αυτά (${eaten}/${parts}). Ποιος δεκαδικός αριθμός εκφράζει την ποσότητα πίτσας που καταναλώθηκε;`,
        unit: '',
        correctVal: dec,
        correctText: `${dec}`,
        tableData: [
          { item: 'Κλάσμα κατανάλωσης', formula: `${eaten}/${parts}`, val: `${eaten}/${parts}` },
          { item: 'Πράξη διαίρεσης', formula: `${eaten} : ${parts}`, val: `${dec}` }
        ],
        explain: `Για να βρούμε τον δεκαδικό αριθμό, εκτελούμε τη διαίρεση: ${eaten} : ${parts} ＝ ${dec}.`,
        distractors: ['0,5', '0,25', '0,8']
      };
    }
  },
  {
    id: 'sp2',
    title: 'Σοκολάτα σε Ίσα Μέρη',
    unit: '',
    generate: () => {
      const parts = 5;
      const eaten = 2;
      const dec = '0,4';
      return {
        prompt: `Ο Γιώργος μοίρασε τα ${eaten}/${parts} μιας σοκολάτας στους φίλους του. Ποιος δεκαδικός αριθμός αντιπροσωπεύει το μέρος της σοκολάτας που μοιράστηκε;`,
        unit: '',
        correctVal: dec,
        correctText: `${dec}`,
        tableData: [
          { item: 'Κλάσμα σοκολάτας', formula: `${eaten}/${parts}`, val: `${eaten}/${parts}` },
          { item: 'Πράξη διαίρεσης', formula: `${eaten} : ${parts}`, val: `${dec}` }
        ],
        explain: `Διαιρούμε τον αριθμητή με τον παρονομαστή: ${eaten} : ${parts} ＝ ${dec}.`,
        distractors: ['0,2', '0,5', '0,25']
      };
    }
  },
  {
    id: 'sp3',
    title: 'Δεξαμενή Νερού',
    unit: '',
    generate: () => {
      const parts = 8;
      const filled = 6;
      const dec = '0,75';
      return {
        prompt: `Μία δεξαμενή νερού είναι γεμάτη κατά τα ${filled}/${parts} της χωρητικότητάς της. Ποια είναι η δεκαδική τιμή αυτού του μέρους;`,
        unit: '',
        correctVal: dec,
        correctText: `${dec}`,
        tableData: [
          { item: 'Κλάσμα πλήρωσης', formula: `${filled}/${parts}`, val: `${filled}/${parts}` },
          { item: 'Πράξη διαίρεσης', formula: `${filled} : ${parts}`, val: `${dec}` }
        ],
        explain: `Εκτελούμε τη διαίρεση του κλάσματος: ${filled} : ${parts} ＝ ${dec}.`,
        distractors: ['0,6', '0,85', '0,7']
      };
    }
  },
  {
    id: 'sp4',
    title: 'Πακέτο Μπισκότων',
    unit: '',
    generate: () => {
      const parts = 10;
      const eaten = 7;
      const dec = '0,7';
      return {
        prompt: `Από ένα πακέτο με 10 μπισκότα φαγώθηκαν τα 7 (${eaten}/${parts}). Ποιος δεκαδικός αριθμός αντιστοιχεί στα μπισκότα που φαγώθηκαν;`,
        unit: '',
        correctVal: dec,
        correctText: `${dec}`,
        tableData: [
          { item: 'Δεκαδικό κλάσμα', formula: `${eaten}/${parts}`, val: `${eaten}/${parts}` },
          { item: 'Δεκαδικός αριθμός', formula: `${eaten} : ${parts}`, val: `${dec}` }
        ],
        explain: `Το δεκαδικό κλάσμα ${eaten}/${parts} ισούται άμεσα με τον δεκαδικό αριθμό ${dec}.`,
        distractors: ['0,07', '0,77', '0,17']
      };
    }
  },
  {
    id: 'sp5',
    title: 'Κέικ Γενεθλίων',
    unit: '',
    generate: () => {
      const parts = 2;
      const eaten = 1;
      const dec = '0,5';
      return {
        prompt: `Σε ένα πάρτι καταναλώθηκε το ${eaten}/${parts} (το μισό) ενός μεγάλου κέικ. Πώς εκφράζεται το μισό με δεκαδικό αριθμό;`,
        unit: '',
        correctVal: dec,
        correctText: `${dec}`,
        tableData: [
          { item: 'Κλασματική μονάδα', formula: `${eaten}/${parts}`, val: `${eaten}/${parts}` },
          { item: 'Δεκαδική τιμή', formula: `${eaten} : ${parts}`, val: `${dec}` }
        ],
        explain: `Η κλασματική μονάδα ${eaten}/${parts} ισούται με 1 : 2 ＝ ${dec}.`,
        distractors: ['0,2', '0,05', '1,5']
      };
    }
  },
  {
    id: 'sp6',
    title: 'Χυμός Πορτοκαλιού',
    unit: '',
    generate: () => {
      const parts = 4;
      const drank = 1;
      const dec = '0,25';
      return {
        prompt: `Ένα μπουκάλι χυμού περιείχε 1 λίτρο και ήπιαμε το ${drank}/${parts} (ένα τέταρτο) του λίτρου. Ποιος δεκαδικός αριθμός αντιστοιχεί στο τέταρτο;`,
        unit: '',
        correctVal: dec,
        correctText: `${dec}`,
        tableData: [
          { item: 'Κλασματική μονάδα', formula: `${drank}/${parts}`, val: `${drank}/${parts}` },
          { item: 'Διαίρεση', formula: `${drank} : ${parts}`, val: `${dec}` }
        ],
        explain: `Το ένα τέταρτο (${drank}/${parts}) αντιστοιχεί στη διαίρεση 1 : 4 ＝ ${dec}.`,
        distractors: ['0,4', '0,2', '0,75']
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Καταχρηστικό Κλάσμα σε Πίτσες',
    unit: 'πίτσες',
    generate: () => {
      // 5/2 = 2,5
      const num = 5;
      const den = 2;
      const dec = '2,5';
      return {
        prompt: `Σε μια εκδήλωση παραγγέλθηκαν πίτσες κομμένες στη μέση (ανά 2 ίσα μέρη). Συνολικά φαγώθηκαν 5 τέτοια κομμάτια (${num}/${den}). Πόσες ολόκληρες πίτσες καταναλώθηκαν σε δεκαδική μορφή;`,
        unit: 'πίτσες',
        correctVal: dec,
        correctText: `${dec} πίτσες`,
        tableData: [
          { item: 'Καταχρηστικό κλάσμα', formula: `${num}/${den}`, val: `${num}/${den}` },
          { item: 'Πράξη διαίρεσης', formula: `${num} : ${den}`, val: `${dec}` }
        ],
        explain: `Εκτελούμε τη διαίρεση: ${num} : ${den} ＝ ${dec} πίτσες (2 ολόκληρες και μισή πίτσα).`,
        distractors: ['2,2 πίτσες', '3,5 πίτσες', '1,5 πίτσες']
      };
    }
  },
  {
    id: 'hp2',
    title: 'Υφάσματα για Κουρτίνες',
    unit: 'μέτρα',
    generate: () => {
      // 7/4 = 1,75
      const num = 7;
      const den = 4;
      const dec = '1,75';
      return {
        prompt: `Μια μοδίστρα χρησιμοποίησε ${num}/${den} του μέτρου ύφασμα για ένα μαξιλάρι. Πόσα μέτρα υφάσματος χρησιμοποίησε σε δεκαδική μορφή;`,
        unit: 'μέτρα',
        correctVal: dec,
        correctText: `${dec} μέτρα`,
        tableData: [
          { item: 'Κλάσμα μήκους', formula: `${num}/${den}`, val: `${num}/${den}` },
          { item: 'Διαίρεση', formula: `${num} : ${den}`, val: `${dec}` }
        ],
        explain: `Διαιρούμε τον αριθμητή με τον παρονομαστή: ${num} : ${den} ＝ ${dec} μέτρα.`,
        distractors: ['1,25 μέτρα', '1,5 μέτρα', '2,25 μέτρα']
      };
    }
  },
  {
    id: 'hp3',
    title: 'Βάρος Φρούτων σε Κιλά',
    unit: 'κιλά',
    generate: () => {
      // 6/5 = 1,2
      const num = 6;
      const den = 5;
      const dec = '1,2';
      return {
        prompt: `Μία σακούλα με μήλα ζυγίζει ${num}/${den} του κιλού. Πόσα κιλά ζυγίζει η σακούλα εκφρασμένη σε δεκαδικό αριθμό;`,
        unit: 'κιλά',
        correctVal: dec,
        correctText: `${dec} κιλά`,
        tableData: [
          { item: 'Κλάσμα βάρους', formula: `${num}/${den}`, val: `${num}/${den}` },
          { item: 'Διαίρεση', formula: `${num} : ${den}`, val: `${dec}` }
        ],
        explain: `${num} : ${den} ＝ ${dec} κιλά (δηλαδή 1 κιλό και 200 γραμμάρια).`,
        distractors: ['1,4 κιλά', '1,6 κιλά', '1,5 κιλά']
      };
    }
  },
  {
    id: 'hp4',
    title: 'Περιοδικός Αριθμός σε Ώρες',
    unit: '',
    generate: () => {
      const frac = '1/3';
      const dec = '0,333...';
      return {
        prompt: `Ο Ανδρέας μελέτησε για το ${frac} της ώρας. Αν μετατρέψουμε το κλάσμα σε δεκαδικό, ποιο είναι το αποτέλεσμα και τι είδους αριθμός προκύπτει;`,
        unit: '',
        correctVal: dec,
        correctText: `${dec} (Περιοδικός)`,
        tableData: [
          { item: 'Κλάσμα χρόνου', formula: `${frac}`, val: `${frac}` },
          { item: 'Διαίρεση', formula: '1 : 3', val: `${dec}` },
          { item: 'Είδος δεκαδικού', formula: 'Άπειρα ψηφία 3', val: 'Περιοδικός' }
        ],
        explain: `Η διαίρεση 1 : 3 δεν τελειώνει ποτέ και δίνει ${dec}, ο οποίος είναι περιοδικός δεκαδικός αριθμός.`,
        distractors: ['0,3 (Μη περιοδικός)', '0,35 (Περιοδικός)', '0,25 (Μη περιοδικός)']
      };
    }
  },
  {
    id: 'hp5',
    title: 'Χρηματικό Ποσό σε Ευρώ',
    unit: '€',
    generate: () => {
      // 9/4 = 2,25
      const num = 9;
      const den = 4;
      const dec = '2,25';
      return {
        prompt: `Ένα παιχνίδι κοστίζει ${num}/${den} του ευρώ ανά τεμάχιο. Πόσα ευρώ κοστίζει γραμμένο με δεκαδικό αριθμό;`,
        unit: '€',
        correctVal: dec,
        correctText: `${dec} €`,
        tableData: [
          { item: 'Κλάσμα τιμής', formula: `${num}/${den} €`, val: `${num}/${den} €` },
          { item: 'Διαίρεση', formula: `${num} : ${den}`, val: `${dec} €` }
        ],
        explain: `Εκτελούμε τη διαίρεση: ${num} : ${den} ＝ ${dec} € (δηλαδή 2 ευρώ και 25 λεπτά).`,
        distractors: ['2,5 €', '2,75 €', '1,75 €']
      };
    }
  },
  {
    id: 'hp6',
    title: 'Απόσταση Αγώνα Δρόμου',
    unit: 'χλμ.',
    generate: () => {
      // 8/5 = 1,6
      const num = 8;
      const den = 5;
      const dec = '1,6';
      return {
        prompt: `Ένας αθλητής διένυσε απόσταση ίση με ${num}/${den} του χιλιομέτρου. Πόσα χιλιόμετρα διένυσε σε δεκαδική μορφή;`,
        unit: 'χλμ.',
        correctVal: dec,
        correctText: `${dec} χλμ.`,
        tableData: [
          { item: 'Κλάσμα απόστασης', formula: `${num}/${den} χλμ.`, val: `${num}/${den} χλμ.` },
          { item: 'Διαίρεση', formula: `${num} : ${den}`, val: `${dec} χλμ.` }
        ],
        explain: `Υπολογίζουμε: ${num} : ${den} ＝ ${dec} χλμ. (1 χιλιόμετρο και 600 μέτρα).`,
        distractors: ['1,8 χλμ.', '1,4 χλμ.', '1,5 χλμ']
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Μετατροπή απλού κλάσματος σε δεκαδικό (π.χ. 1/2, 1/4, 3/4, 2/5, 4/5)
  const q1List = [
    { num: 1, den: 2, dec: '0,5' },
    { num: 1, den: 4, dec: '0,25' },
    { num: 3, den: 4, dec: '0,75' },
    { num: 1, den: 5, dec: '0,2' },
    { num: 2, den: 5, dec: '0,4' },
    { num: 3, den: 5, dec: '0,6' },
    { num: 4, den: 5, dec: '0,8' }
  ];
  const q1Selected = q1List[randInt(0, q1List.length - 1)];

  // Q2: MCQ - Αναγνώριση Κλασματικής Μονάδας (1/ν)
  const q2Den = randInt(3, 12);
  const q2CorrectStr = `1/${q2Den}`;
  const q2Wrongs = [
    `2/${q2Den}`,
    `${q2Den}/1`,
    `${q2Den}/${q2Den}`
  ];
  const q2Options = shuffle([...new Set([q2CorrectStr, ...q2Wrongs])]);

  // Q3: MCQ - Ποιο κλάσμα παράγει Περιοδικό Δεκαδικό Αριθμό
  const q3PeriodicFractions = [
    { frac: '1/3', dec: '0,333...' },
    { frac: '2/3', dec: '0,666...' },
    { frac: '1/6', dec: '0,166...' },
    { frac: '1/7', dec: '0,142...' },
    { frac: '1/9', dec: '0,111...' }
  ];
  const q3NonPeriodicFractions = ['1/2', '1/4', '3/4', '2/5', '3/10', '7/10', '1/8'];
  const q3Chosen = q3PeriodicFractions[randInt(0, q3PeriodicFractions.length - 1)];
  const q3WrongsList = shuffle(q3NonPeriodicFractions).slice(0, 3);
  const q3Options = shuffle([...new Set([q3Chosen.frac, ...q3WrongsList])]);

  // Q4: Input - Μετατροπή καταχρηστικού κλάσματος σε δεκαδικό (> 1)
  const q4List = [
    { num: 3, den: 2, dec: '1,5' },
    { num: 5, den: 2, dec: '2,5' },
    { num: 5, den: 4, dec: '1,25' },
    { num: 7, den: 4, dec: '1,75' },
    { num: 6, den: 5, dec: '1,2' },
    { num: 8, den: 5, dec: '1,6' }
  ];
  const q4Selected = q4List[randInt(0, q4List.length - 1)];

  // Q5: True/False - Κλασματική μονάδα σημαίνει αριθμητής = 1
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Κλασματική μονάδα ονομάζεται κάθε κλάσμα που έχει ως αριθμητή τον αριθμό 1.'
    : 'Κλασματική μονάδα ονομάζεται κάθε κλάσμα που έχει ως παρονομαστή τον αριθμό 1.';

  // Q6: True/False - Η γραμμή κλάσματος σημαίνει διαίρεση
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Για να μετατρέψουμε ένα κλάσμα σε δεκαδικό, διαιρούμε τον αριθμητή με τον παρονομαστή.'
    : 'Για να μετατρέψουμε ένα κλάσμα σε δεκαδικό, διαιρούμε τον παρονομαστή με τον αριθμητή.';

  // Q7: Input - Εύρεση δεκαδικού κλάσματος (με παρονομαστή 10 ή 100)
  const q7List = [
    { num: 7, den: 10, dec: '0,7' },
    { num: 9, den: 10, dec: '0,9' },
    { num: 13, den: 10, dec: '1,3' },
    { num: 25, den: 100, dec: '0,25' },
    { num: 45, den: 100, dec: '0,45' },
    { num: 8, den: 100, dec: '0,08' }
  ];
  const q7Selected = q7List[randInt(0, q7List.length - 1)];

  // Q8: MCQ - Σύγκριση κλασματικών μονάδων
  const q8Pool = [
    {
      prompt: 'Ποια από τις παρακάτω κλασματικές μονάδες εκφράζει το ΜΕΓΑΛΥΤΕΡΟ μέρος;',
      correct: '1/2',
      wrong: ['1/4', '1/8', '1/10'],
      explain: 'Όσο μικρότερος είναι ο παρονομαστής σε μια κλασματική μονάδα, τόσο μεγαλύτερο είναι το κομμάτι: 1/2 ＝ 0,5, ενώ 1/4 ＝ 0,25.'
    },
    {
      prompt: 'Ποια σχέση σύγκρισης είναι ΣΩΣΤΗ;',
      correct: '1/2 ＞ 1/5',
      wrong: ['1/2 ＜ 1/5', '1/2 ＝ 1/5', '1/5 ＞ 1/3'],
      explain: '1/2 ＝ 0,5 και 1/5 ＝ 0,2. Επομένως, 0,5 ＞ 0,2 (1/2 ＞ 1/5).'
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
      title: 'Κλάσμα ➔ Δεκαδικός',
      prompt: `Μετάτρεψε το κλάσμα ${q1Selected.num}/${q1Selected.den} σε δεκαδικό αριθμό (π.χ. 0,5):`,
      correct: q1Selected.dec,
      explain: `${q1Selected.num}/${q1Selected.den} ＝ ${q1Selected.num} : ${q1Selected.den} ＝ ${q1Selected.dec}.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Κλασματική Μονάδα',
      prompt: `Ποιο από τα παρακάτω κλάσματα είναι η κλασματική μονάδα με παρονομαστή το ${q2Den};`,
      options: q2Options,
      correct: q2CorrectStr,
      explain: `Η κλασματική μονάδα έχει πάντοτε αριθμητή το 1, άρα είναι το ${q2CorrectStr}.`
    },
    {
      id: 'q3',
      type: 'mcq',
      title: 'Περιοδικός Δεκαδικός',
      prompt: `Ποιο από τα παρακάτω κλάσματα δίνει περιοδικό δεκαδικό αριθμό όταν κάνουμε τη διαίρεση;`,
      options: q3Options,
      correct: q3Chosen.frac,
      explain: `Το κλάσμα ${q3Chosen.frac} ισούται με ${q3Chosen.frac.split('/')[0]} : ${q3Chosen.frac.split('/')[1]} ＝ ${q3Chosen.dec}, η διαίρεση δεν τελειώνει και άρα είναι περιοδικός αριθμός.`
    },
    {
      id: 'q4',
      type: 'input',
      title: 'Καταχρηστικό Κλάσμα',
      prompt: `Ποια είναι η δεκαδική τιμή του κλάσματος ${q4Selected.num}/${q4Selected.den} (π.χ. 1,5);`,
      correct: q4Selected.dec,
      explain: `${q4Selected.num}/${q4Selected.den} ＝ ${q4Selected.num} : ${q4Selected.den} ＝ ${q4Selected.dec}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Ορισμός Κλασματικής Μονάδας',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Κλασματική μονάδα είναι κάθε κλάσμα της μορφής 1/ν (Αριθμητής ＝ 1).'
        : 'Λάθος! Η κλασματική μονάδα έχει αριθμητή το 1, όχι παρονομαστή.'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Τρόπος Μετατροπής',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Διαιρούμε πάντα τον Αριθμητή (πάνω) με τον Παρονομαστή (κάτω).'
        : 'Λάθος! Διαιρούμε τον αριθμητή με τον παρονομαστή (Αριθμητής : Παρονομαστής).'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Δεκαδικό Κλάσμα',
      prompt: `Γράψε τη δεκαδική τιμή του κλάσματος ${q7Selected.num}/${q7Selected.den} (π.χ. 0,7):`,
      correct: q7Selected.dec,
      explain: `${q7Selected.num}/${q7Selected.den} ＝ ${q7Selected.num} : ${q7Selected.den} ＝ ${q7Selected.dec}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Σύγκριση Κλασματικών Μονάδων',
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

export default function KlasmaSeDekadikoExercisesPage() {
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

  const handleInputChange = (id, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
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

  return (
    <Layout
      title="Ασκήσεις: Κλάσμα σε Δεκαδικό - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην κλασματική μονάδα και τη μετατροπή κλάσματος σε δεκαδικό αριθμό για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/24-klasma-se-dekadiko"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase('Θεωρία')}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-32 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>ΚΕΦΑΛΑΙΟ 24 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Κλασματική Μονάδα & Δεκαδικοί
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στις κλασματικές μονάδες, στη μετατροπή κλασμάτων σε δεκαδικούς και στους περιοδικούς αριθμούς!
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
                          inputMode="decimal"
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder="π.χ. 0,5"
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
              <span>{toCleanUppercase('Σκορ')}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">{score} / 10</span>
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

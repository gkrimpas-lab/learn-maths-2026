// pages/st-dimotikou/52-brisko-arxiki-timi-ask.js
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

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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

// Μορφοποίηση αριθμού (ακέραιος ή δεκαδικός με κόμμα)
function formatNum(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  if (Number.isInteger(Number(val))) return String(val);
  const rounded = Number(Number(val).toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'arx_std_1',
    title: 'Αρχική Τιμή Παπουτσιών μετά από Έκπτωση',
    unit: '€',
    generate: () => {
      const origPrice = pickRandom([50, 60, 80, 100, 120, 150]);
      const discPct = pickRandom([10, 20, 25, 30, 40]);
      const finalPrice = origPrice * (1 - discPct / 100);
      return {
        prompt: `Στις εκπτώσεις ένα ζευγάρι παπούτσια πωλήθηκε προς ${formatNum(finalPrice)} € με έκπτωση ${discPct} %. Ποια ήταν η αρχική τιμή των παπουτσιών σε €;`,
        unit: '€',
        correctVal: String(origPrice),
        correctText: `${origPrice} €`,
        tableData: [
          { item: 'Ποσοστό τελικής τιμής', formula: `100 % － ${discPct} %`, val: `${100 - discPct} %` },
          { item: 'Τελική τιμή πληρωμής', formula: `${formatNum(finalPrice)} €`, val: `${formatNum(finalPrice)} €` },
          { item: 'Υπολογισμός αρχικής τιμής (100%)', formula: `(${formatNum(finalPrice)} · 100) : ${100 - discPct}`, val: `${origPrice} €` }
        ],
        explain: `Η τελική τιμή (${formatNum(finalPrice)} €) αντιστοιχεί στο ${100 - discPct} % της αρχικής αξίας. Με σταυρωτό γινόμενο: x ＝ (${formatNum(finalPrice)} · 100) : ${100 - discPct} ＝ ${origPrice} €.`,
        distractors: [`${origPrice + 20} €`, `${origPrice - 15} €`, `${origPrice + 30} €`]
      };
    }
  },
  {
    id: 'arx_std_2',
    title: 'Καθαρή Αξία Υπολογιστή προ Φ.Π.Α.',
    unit: '€',
    generate: () => {
      const cleanPrice = pickRandom([200, 300, 400, 500, 600]);
      const vatPct = 24;
      const finalPrice = cleanPrice * 1.24;
      return {
        prompt: `Η τελική τιμή ενός φορητού υπολογιστή μαζί με τον φόρο Φ.Π.Α. ${vatPct} % είναι ${formatNum(finalPrice)} €. Ποια ήταν η καθαρή αρχική αξία του υπολογιστή χωρίς τον φόρο σε €;`,
        unit: '€',
        correctVal: String(cleanPrice),
        correctText: `${cleanPrice} €`,
        tableData: [
          { item: 'Ποσοστό τελικής τιμής', formula: `100 % ＋ 24 %`, val: '124 %' },
          { item: 'Τελική τιμή με φόρο', formula: `${formatNum(finalPrice)} €`, val: `${formatNum(finalPrice)} €` },
          { item: 'Καθαρή αξία (100%)', formula: `(${formatNum(finalPrice)} · 100) : 124`, val: `${cleanPrice} €` }
        ],
        explain: `Η τελική τιμή αντιστοιχεί στο 124 % της καθαρής αξίας. Με σταυρωτό γινόμενο: x ＝ (${formatNum(finalPrice)} · 100) : 124 ＝ ${cleanPrice} €.`,
        distractors: [`${cleanPrice + 50} €`, `${cleanPrice - 40} €`, `${cleanPrice + 80} €`]
      };
    }
  },
  {
    id: 'arx_std_3',
    title: 'Αρχικός Λογαριασμός Αγορών',
    unit: '€',
    generate: () => {
      const origBill = pickRandom([40, 50, 70, 80, 100]);
      const discPct = pickRandom([15, 20, 25, 30]);
      const finalBill = origBill * (1 - discPct / 100);
      return {
        prompt: `Ένας πελάτης πλήρωσε στο ταμείο ενός καταστήματος ${formatNum(finalBill)} €, αφού του έγινε έκπτωση ${discPct} %. Πόσο κόστιζαν αρχικά τα προϊόντα που αγόρασε σε €;`,
        unit: '€',
        correctVal: String(origBill),
        correctText: `${origBill} €`,
        tableData: [
          { item: 'Ποσοστό πληρωμής', formula: `100 % － ${discPct} %`, val: `${100 - discPct} %` },
          { item: 'Ποσό πληρωμής', formula: `${formatNum(finalBill)} €`, val: `${formatNum(finalBill)} €` },
          { item: 'Αρχικό ποσό', formula: `(${formatNum(finalBill)} · 100) : ${100 - discPct}`, val: `${origBill} €` }
        ],
        explain: `Τα ${formatNum(finalBill)} € είναι το ${100 - discPct} % της αρχικής τιμής. Άρα: x ＝ (${formatNum(finalBill)} · 100) : ${100 - discPct} ＝ ${origBill} €.`,
        distractors: [`${origBill + 15} €`, `${origBill - 10} €`, `${origBill + 20} €`]
      };
    }
  },
  {
    id: 'arx_std_4',
    title: 'Ενοίκιο Καταστήματος προ Αύξησης',
    unit: '€',
    generate: () => {
      const origRent = pickRandom([300, 350, 400, 450, 500]);
      const incPct = 10;
      const newRent = origRent * 1.1;
      return {
        prompt: `Το ενοίκιο ενός καταστήματος αυξήθηκε κατά ${incPct} % και διαμορφώθηκε στα ${formatNum(newRent)} €. Ποιο ήταν το ενοίκιο πριν από την αύξηση σε €;`,
        unit: '€',
        correctVal: String(origRent),
        correctText: `${origRent} €`,
        tableData: [
          { item: 'Ποσοστό νέου ενοικίου', formula: `100 % ＋ ${incPct} %`, val: '110 %' },
          { item: 'Νέο ενοίκιο', formula: `${formatNum(newRent)} €`, val: `${formatNum(newRent)} €` },
          { item: 'Αρχικό ενοίκιο προ αύξησης', formula: `${formatNum(newRent)} : 1,10`, val: `${origRent} €` }
        ],
        explain: `Το νέο ενοίκιο αντιστοιχεί στο 110 % του παλαιού. Με διαίρεση: ${formatNum(newRent)} : 1,10 ＝ ${origRent} €.`,
        distractors: [`${origRent + 30} €`, `${origRent - 25} €`, `${origRent + 50} €`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'arx_hard_1',
    title: 'Αρχική Καθαρή Αξία με Έκπτωση και Φ.Π.Α.',
    unit: '€',
    generate: () => {
      return {
        prompt: 'Ένα προϊόν πωλήθηκε τελικά προς 148,80 € συμπεριλαμβανομένου Φ.Π.Α. 24 %, αφού προηγουμένως είχε γίνει έκπτωση 20 % επί της αρχικής καθαρής αξίας του. Ποια ήταν η αρχική καθαρή αξία του προϊόντος σε €;',
        unit: '€',
        correctVal: '150',
        correctText: '150 €',
        tableData: [
          { item: '1ο Βήμα: Τιμή μετά την έκπτωση (προ Φ.Π.Α.)', formula: '148,80 : 1,24', val: '120 €' },
          { item: '2ο Βήμα: Αρχική καθαρή αξία (100%)', formula: '(120 · 100) : 80', val: '150 €' }
        ],
        explain: '1ο Βήμα: Τιμή μετά την έκπτωση (προ Φ.Π.Α.): 148,80 : 1,24 ＝ 120 €. 2ο Βήμα: Τα 120 € αντιστοιχούν στο 80 % της αρχικής καθαρής αξίας: (120 · 100) : 80 ＝ 150 €.',
        distractors: ['140 €', '160 €', '155 €']
      };
    }
  },
  {
    id: 'arx_hard_2',
    title: 'Υπολογισμός Ποσοστού Έκπτωσης από Όφελος',
    unit: '%',
    generate: () => {
      return {
        prompt: 'Σε ένα κατάστημα ρούχων, ένας αγοραστής πλήρωσε 90 € για ένα σακάκι και διαπίστωσε ότι εξοικονόμησε 30 € λόγω της έκπτωσης. Ποιο ήταν το ποσοστό (%) της έκπτωσης που του έγινε;',
        unit: '%',
        correctVal: '25',
        correctText: '25 %',
        tableData: [
          { item: 'Αρχική τιμή καταλόγου', formula: '90 ＋ 30', val: '120 €' },
          { item: 'Υπολογισμός ποσοστού έκπτωσης', formula: '(30 : 120) · 100', val: '25 %' }
        ],
        explain: 'Αρχική τιμή: 90 ＋ 30 ＝ 120 €. Ποσοστό έκπτωσης ως προς την αρχική τιμή: (30 : 120) · 100 ＝ 25 %.',
        distractors: ['30 %', '20 %', '33 %']
      };
    }
  },
  {
    id: 'arx_hard_3',
    title: 'Αρχικός Μισθός μετά από Διαδοχικές Μεταβολές',
    unit: '€',
    generate: () => {
      return {
        prompt: 'Ο μισθός ενός εργαζομένου αυξήθηκε κατά 10 % και στη συνέχεια ο νέος μισθός μειώθηκε κατά 10 %, φτάνοντας τα 990 €. Ποιος ήταν ο αρχικός μισθός του εργαζομένου σε €;',
        unit: '€',
        correctVal: '1000',
        correctText: '1.000 €',
        tableData: [
          { item: '1ο Βήμα: Προ μείωσης 10%', formula: '990 : 0,90', val: '1.100 €' },
          { item: '2ο Βήμα: Προ αύξησης 10%', formula: '1.100 : 1,10', val: '1.000 €' }
        ],
        explain: '1ο Βήμα: Πριν από τη μείωση 10%: 990 : 0,90 ＝ 1.100 €. 2ο Βήμα: Πριν από την αύξηση 10%: 1.100 : 1,10 ＝ 1.000 €.',
        distractors: ['990 €', '1.050 €', '980 €']
      };
    }
  },
  {
    id: 'arx_hard_4',
    title: 'Αρχικές Αποταμιεύσεις από Υπόλοιπο Χρημάτων',
    unit: '€',
    generate: () => {
      return {
        prompt: 'Μια μαθήτρια ξόδεψε το 35 % των αποταμιεύσεών της και της απέμειναν 325 €. Πόσα ευρώ (€) είχε συνολικά αποταμιεύσει αρχικά;',
        unit: '€',
        correctVal: '500',
        correctText: '500 €',
        tableData: [
          { item: 'Ποσοστό χρημάτων που απέμειναν', formula: '100 % － 35 %', val: '65 %' },
          { item: 'Συνολικό αρχικό ποσό (100%)', formula: '(325 · 100) : 65', val: '500 €' }
        ],
        explain: 'Τα χρήματα που απέμειναν αντιστοιχούν στο: 100 % － 35 % ＝ 65 %. Αρχικό ποσό: (325 · 100) : 65 ＝ 500 €.',
        distractors: ['450 €', '550 €', '480 €']
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Εύρεση αρχικής τιμής μετά από έκπτωση 20%
  const q1Orig = pickRandom([50, 80, 100, 120]);
  const q1Final = q1Orig * 0.8;

  // Q2: MCQ - Αντιστοίχιση ποσοστού τελικής τιμής
  const q2Disc = pickRandom([15, 25, 30, 40]);
  const q2CorrectPct = 100 - q2Disc;
  const q2Options = shuffle([
    `${q2CorrectPct} %`,
    `${q2Disc} %`,
    `${100 + q2Disc} %`,
    '100 %'
  ]);

  // Q3: Input - Εύρεση αρχικής αξίας προ φόρου
  const q3Clean = pickRandom([100, 200, 250, 400]);
  const q3Final = q3Clean * 1.24;

  // Q4: MCQ - Η μεγάλη παγίδα
  const q4CorrectStatement = 'Όχι, γιατί το 20% υπολογίστηκε στην αρχική τιμή (που ήταν μεγαλύτερη) και όχι στα 80 €';
  const q4Options = shuffle([
    q4CorrectStatement,
    'Ναι, γιατί 80 ＋ 20% ισούται πάντα με την αρχική τιμή',
    'Ναι, αρκεί να προσθέσουμε και 20 € επιπλέον',
    'Όχι, γιατί στις εκπτώσεις κάνουμε μόνο πολλαπλασιασμό με το 100'
  ]);

  // Q5: Input - Διαίρεση με δεκαδικό συντελεστή
  const q5Orig = pickRandom([40, 60, 90, 110]);
  const q5Final = q5Orig * 1.1;

  // Q6: MCQ - Ο μαθηματικός τύπος
  const q6CorrectFormula = 'Αρχική Τιμή ＝ (Τελική Τιμή · 100) : (100 － Έκπτωση %)';
  const q6Options = shuffle([
    q6CorrectFormula,
    'Αρχική Τιμή ＝ Τελική Τιμή ＋ (Τελική Τιμή · Έκπτωση %)',
    'Αρχική Τιμή ＝ (Τελική Τιμή · Έκπτωση %) : 100',
    'Αρχική Τιμή ＝ (Τελική Τιμή · 100) : Έκπτωση %'
  ]);

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate();

  // Q8: Standard Problem (MCQ)
  let spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  while (spIndex2 === spIndex1) spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q8Data = STANDARD_PROBLEMS_POOL[spIndex2].generate();
  const q8Options = shuffle([
    ...new Set([
      q8Data.correctText,
      ...q8Data.distractors
    ])
  ]);

  // Q9: Hard Problem (Input)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate();

  // Q10: Hard Problem (MCQ)
  let hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  while (hpIndex2 === hpIndex1) hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hpIndex2].generate();
  const q10Options = shuffle([
    ...new Set([
      q10Data.correctText,
      ...q10Data.distractors
    ])
  ]);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: 'Εύρεση Αρχικής Τιμής μετά από Έκπτωση',
      prompt: `Ένα παντελόνι πωλείται στις εκπτώσεις προς ${formatNum(q1Final)} € με έκπτωση 20 %. Ποια ήταν η αρχική τιμή του σε €;`,
      correct: String(q1Orig),
      explain: `Η τελική τιμή (${formatNum(q1Final)} €) αντιστοιχεί στο 80 % της αρχικής (100 － 20). Αρχική τιμή: (${formatNum(q1Final)} · 100) : 80 ＝ ${q1Orig} €.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Αντιστοίχιση Ποσοστού Τελικής Τιμής',
      prompt: `Αν ένα προϊόν έχει έκπτωση ${q2Disc} %, σε ποιο ποσοστό (%) της αρχικής τιμής αντιστοιχεί η τελική τιμή που πληρώνουμε;`,
      options: q2Options,
      correct: `${q2CorrectPct} %`,
      explain: `Αφού αφαιρείται έκπτωση ${q2Disc} % από το αρχικό 100 %, πληρώνουμε το υπόλοιπο: 100 % － ${q2Disc} % ＝ ${q2CorrectPct} %.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Εύρεση Αρχικής Αξίας προ Φόρου',
      prompt: `Η τελική τιμή ενός προϊόντος μαζί με Φ.Π.Α. 24 % είναι ${formatNum(q3Final)} €. Ποια ήταν η καθαρή αρχική τιμή του χωρίς τον φόρο σε €;`,
      correct: String(q3Clean),
      explain: `Η τελική τιμή αντιστοιχεί στο 124 % της καθαρής αξίας. Καθαρή αξία: (${formatNum(q3Final)} · 100) : 124 ＝ ${q3Clean} €.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Η Μεγάλη Παγίδα των Ποσοστών',
      prompt: 'Αν πληρώσαμε 80 € για ένα προϊόν μετά από έκπτωση 20 %, είναι σωστό να πούμε ότι η αρχική τιμή ήταν 80 ＋ 20 % των 80 ＝ 96 €;',
      options: q4Options,
      correct: q4CorrectStatement,
      explain: 'Είναι λάθος! Η έκπτωση 20% αφαιρέθηκε από την αρχική τιμή (το 100%), άρα τα 80 € αντιστοιχούν στο 80%. Η πραγματική αρχική τιμή ήταν 100 €.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Διαίρεση με Δεκαδικό Συντελεστή',
      prompt: `Ένα ποσό μετά από αύξηση 10 % διαμορφώθηκε στα ${formatNum(q5Final)} €. Διαιρώντας με τον συντελεστή 1,10, ποια ήταν η αρχική τιμή σε €;`,
      correct: String(q5Orig),
      explain: `Διαιρούμε την τελική τιμή με τον συντελεστή: ${formatNum(q5Final)} : 1,10 ＝ ${q5Orig} €.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Ο Μαθηματικός Τύπος',
      prompt: 'Ποιος είναι ο σωστός τύπος για να βρούμε την αρχική τιμή όταν γνωρίζουμε την τελική τιμή και το ποσοστό έκπτωσης;',
      options: q6Options,
      correct: q6CorrectFormula,
      explain: `Από τον πίνακα ποσών με χιαστί προκύπτει: ${q6CorrectFormula}.`
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: `Πρόβλημα: ${q7Data.title}`,
      prompt: q7Data.prompt,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: `Πρόβλημα: ${q8Data.title}`,
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correctText,
      tableData: q8Data.tableData,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'input',
      inputType: 'decimal',
      title: `Σύνθετο Πρόβλημα: ${q9Data.title}`,
      prompt: q9Data.prompt,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `Σύνθετο Πρόβλημα: ${q10Data.title}`,
      prompt: q10Data.prompt,
      options: q10Options,
      correct: q10Data.correctText,
      tableData: q10Data.tableData,
      explain: q10Data.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function BriskoArxikiTimiExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions();
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach(q => {
      initialAnswers[q.id] = '';
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

  // Χειρισμός απαντήσεων: sanitize για inputs, αυτούσιο για mcq
  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      const q = questions.find(item => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        sanitized = sanitized.replace(/\./g, ',').replace(/[^0-9,]/g, '');
        const parts = sanitized.split(',');
        if (parts.length > 2) sanitized = parts[0] + ',' + parts.slice(1).join('');
      }
      if (sanitized.length > 10) {
        sanitized = sanitized.slice(0, 10);
      }
      setAnswers(prev => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers(prev => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').trim().toLowerCase();

      if (cleanUser === cleanTarget) return true;

      if (q.inputType === 'decimal') {
        const numUser = parseFloat(cleanUser.replace(',', '.'));
        const numTarget = parseFloat(cleanTarget.replace(',', '.'));
        return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) < 0.05;
      }
      return false;
    }
    if (q.type === 'mcq') {
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
      title="Ασκήσεις: Εύρεση Αρχικής Τιμής στα Ποσοστά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην εύρεση αρχικής τιμής και αποφυγή της παγίδας των ποσοστών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/52-brisko-arxiki-timi"
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
                <span>ΚΕΦΑΛΑΙΟ 52 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Εύρεση της Αρχικής Τιμής
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον υπολογισμό της αρχικής αξίας προ έκπτωσης ή προ φόρου και στην αποφυγή της μεγάλης παγίδας των ποσοστών!
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
                      {q.prompt}
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
                              onClick={() => handleAnswerChange(q.id, opt, 'mcq')}
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
                          key={`input-${q.id}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode={q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.inputType === 'decimal' ? 'π.χ. 45,5' : 'Απάντηση...'}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                      {q.tableData && (
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

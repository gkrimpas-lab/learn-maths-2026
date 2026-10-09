// pages/st-dimotikou/51-problimata-me-pososta-ask.js
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
    id: 'pos_std_1',
    title: 'Υπολογισμός Έκπτωσης σε Παντελόνι',
    unit: '€',
    generate: () => {
      const origPrice = pickRandom([50, 60, 80, 100, 120, 150]);
      const discPct = pickRandom([10, 15, 20, 25, 30]);
      const discount = (origPrice * discPct) / 100;
      const finalPrice = origPrice - discount;
      return {
        prompt: `Ένα παντελόνι κοστίζει ${origPrice} € και προσφέρεται στις εκπτώσεις με μείωση ${discPct} %. Πόσα ευρώ (€) θα πληρώσει τελικά ο αγοραστής;`,
        unit: '€',
        correctVal: String(finalPrice),
        correctText: `${finalPrice} €`,
        tableData: [
          { item: 'Αρχική τιμή', formula: `${origPrice} €`, val: `${origPrice} €` },
          { item: 'Ποσό έκπτωσης', formula: `(${origPrice} · ${discPct}) : 100`, val: `${discount} €` },
          { item: 'Τελική τιμή πληρωμής', formula: `${origPrice} － ${discount}`, val: `${finalPrice} €` }
        ],
        explain: `Έκπτωση: (${origPrice} · ${discPct}) : 100 ＝ ${discount} €. Τελική τιμή: ${origPrice} － ${discount} ＝ ${finalPrice} €.`,
        distractors: [`${finalPrice + 10} €`, `${finalPrice - 10} €`, `${finalPrice + 15} €`]
      };
    }
  },
  {
    id: 'pos_std_2',
    title: 'Υπολογισμός Τελικής Τιμής με Φ.Π.Α.',
    unit: '€',
    generate: () => {
      const origPrice = pickRandom([100, 200, 300, 400, 500]);
      const vatPct = 24;
      const vatAmount = (origPrice * vatPct) / 100;
      const finalPrice = origPrice + vatAmount;
      return {
        prompt: `Ένα ηλεκτρικό ποδήλατο έχει καθαρή αξία ${origPrice} € και επιβαρύνεται με Φ.Π.Α. ${vatPct} %. Ποια είναι η τελική τιμή πώλησής του σε €;`,
        unit: '€',
        correctVal: String(finalPrice),
        correctText: `${finalPrice} €`,
        tableData: [
          { item: 'Καθαρή αξία', formula: `${origPrice} €`, val: `${origPrice} €` },
          { item: 'Φόρος Φ.Π.Α. (24%)', formula: `(${origPrice} · 24) : 100`, val: `${vatAmount} €` },
          { item: 'Τελική τιμή με φόρο', formula: `${origPrice} ＋ ${vatAmount}`, val: `${finalPrice} €` }
        ],
        explain: `Φόρος Φ.Π.Α.: (${origPrice} · 24) : 100 ＝ ${vatAmount} €. Τελική τιμή: ${origPrice} ＋ ${vatAmount} ＝ ${finalPrice} €.`,
        distractors: [`${finalPrice + 24} €`, `${finalPrice - 24} €`, `${finalPrice + 48} €`]
      };
    }
  },
  {
    id: 'pos_std_3',
    title: 'Πώληση Προϊόντος με Κέρδος',
    unit: '€',
    generate: () => {
      const costPrice = pickRandom([40, 50, 60, 80]);
      const profitPct = 20;
      const profit = (costPrice * profitPct) / 100;
      const sellingPrice = costPrice + profit;
      return {
        prompt: `Ένας έμπορος αγόρασε ένα προϊόν προς ${costPrice} € και το πουλάει με κέρδος ${profitPct} %. Σε ποια τιμή (€) θα το πουλήσει;`,
        unit: '€',
        correctVal: String(sellingPrice),
        correctText: `${sellingPrice} €`,
        tableData: [
          { item: 'Τιμή αγοράς', formula: `${costPrice} €`, val: `${costPrice} €` },
          { item: 'Ποσό κέρδους (20%)', formula: `(${costPrice} · 20) : 100`, val: `${profit} €` },
          { item: 'Τιμή πώλησης', formula: `${costPrice} ＋ ${profit}`, val: `${sellingPrice} €` }
        ],
        explain: `Κέρδος: (${costPrice} · 20) : 100 ＝ ${profit} €. Τιμή πώλησης: ${costPrice} ＋ ${profit} ＝ ${sellingPrice} €.`,
        distractors: [`${sellingPrice + 10} €`, `${sellingPrice - 10} €`, `${sellingPrice + 15} €`]
      };
    }
  },
  {
    id: 'pos_std_4',
    title: 'Ποσοστό Απουσιών σε Σχολείο',
    unit: 'μαθητές',
    generate: () => {
      const origStudents = pickRandom([200, 250, 400, 500]);
      const absPct = 12;
      const absStudents = (origStudents * absPct) / 100;
      return {
        prompt: `Σε ένα σχολείο φοιτούν ${origStudents} μαθητές. Σήμερα απουσιάζει το ${absPct} % των μαθητών. Πόσοι μαθητές απουσιάζουν σήμερα;`,
        unit: 'μαθητές',
        correctVal: String(absStudents),
        correctText: `${absStudents} μαθητές`,
        tableData: [
          { item: 'Σύνολο μαθητών', formula: `${origStudents}`, val: `${origStudents}` },
          { item: 'Ποσοστό απουσιών', formula: `${absPct} %`, val: `${absPct} %` },
          { item: 'Απόντες μαθητές', formula: `(${origStudents} · 12) : 100`, val: `${absStudents}` }
        ],
        explain: `Απόντες: (${origStudents} · 12) : 100 ＝ ${absStudents} μαθητές.`,
        distractors: [`${absStudents + 6} μαθητές`, `${absStudents - 6} μαθητές`, `${absStudents + 12} μαθητές`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'pos_hard_1',
    title: 'Διαδοχικές Εκπτώσεις',
    unit: '€',
    generate: () => {
      return {
        prompt: 'Ένα προϊόν αρχικής αξίας 200 € έχει διαδοχικές εκπτώσεις: αρχικά 20 % και στη συνέχεια επιπλέον έκπτωση 10 % επί της νέας μειωμένης τιμής. Ποια είναι η τελική τιμή πώλησης σε €;',
        unit: '€',
        correctVal: '144',
        correctText: '144 €',
        tableData: [
          { item: '1η Έκπτωση (20% στα 200 €)', formula: '200 － (200 · 0,20)', val: '160 €' },
          { item: '2η Έκπτωση (10% στα 160 €)', formula: '160 · 0,10', val: '16 €' },
          { item: 'Τελική τιμή', formula: '160 － 16', val: '144 €' }
        ],
        explain: '1η Έκπτωση 20%: 200 － 40 ＝ 160 €. 2η Έκπτωση 10% στα 160 €: 160 · 0,10 ＝ 16 €. Τελική τιμή: 160 － 16 ＝ 144 €.',
        distractors: ['140 €', '150 €', '148 €']
      };
    }
  },
  {
    id: 'pos_hard_2',
    title: 'Κέρδος και Ζημία επί Νέου Κεφαλαίου',
    unit: '€',
    generate: () => {
      return {
        prompt: 'Ένας επενδυτής είχε κεφάλαιο 1.000 €. Τον πρώτο χρόνο κέρδισε 10 % και τον δεύτερο χρόνο έχασε 10 % επί του νέου κεφαλαίου. Πόσα ευρώ (€) έχει στο τέλος;',
        unit: '€',
        correctVal: '990',
        correctText: '990 €',
        tableData: [
          { item: '1ος χρόνος (+10%)', formula: '1.000 ＋ (1.000 · 0,10)', val: '1.100 €' },
          { item: '2ος χρόνος (-10% στα 1.100 €)', formula: '1.100 · 0,10', val: '110 € ζημία' },
          { item: 'Τελικό κεφάλαιο', formula: '1.100 － 110', val: '990 €' }
        ],
        explain: '1ος χρόνος (+10%): 1.000 ＋ 100 ＝ 1.100 €. 2ος χρόνος (-10% στα 1.100 €): 1.100 － 110 ＝ 990 €.',
        distractors: ['1.000 €', '980 €', '995 €']
      };
    }
  },
  {
    id: 'pos_hard_3',
    title: 'Κέρδος και Φ.Π.Α. Διαδοχικά',
    unit: '€',
    generate: () => {
      return {
        prompt: 'Ένα κατάστημα αγοράζει ένα είδος προς 80 € και το πουλάει με κέρδος 25 %. Αν ο πελάτης πληρώσει επιπλέον Φ.Π.Α. 24 % επί της τιμής πώλησης, ποια είναι η τελική τιμή σε €;',
        unit: '€',
        correctVal: '124',
        correctText: '124 €',
        tableData: [
          { item: 'Τιμή πώλησης με κέρδος 25%', formula: '80 ＋ (80 · 0,25)', val: '100 €' },
          { item: 'Φ.Π.Α. 24% επί των 100 €', formula: '100 · 0,24', val: '24 €' },
          { item: 'Τελική τιμή με φόρο', formula: '100 ＋ 24', val: '124 €' }
        ],
        explain: 'Τιμή πώλησης με κέρδος 25%: 80 ＋ (80 · 0,25) ＝ 100 €. Τελική τιμή με Φ.Π.Α. 24%: 100 ＋ 24 ＝ 124 €.',
        distractors: ['120 €', '128 €', '118 €']
      };
    }
  },
  {
    id: 'pos_hard_4',
    title: 'Καθαρός Μισθός μετά από Κρατήσεις',
    unit: '€',
    generate: () => {
      return {
        prompt: 'Ένας εργαζόμενος έχει μηνιαίο μισθό 1.200 €. Του γίνεται κράτηση 15 % για ασφαλιστικές εισφορές. Πόσα ευρώ (€) είναι ο καθαρός μισθός που λαμβάνει;',
        unit: '€',
        correctVal: '1020',
        correctText: '1.020 €',
        tableData: [
          { item: 'Αρχικός μισθός', formula: '1.200 €', val: '1.200 €' },
          { item: 'Κράτηση 15%', formula: '(1.200 · 15) : 100', val: '180 €' },
          { item: 'Καθαρός μισθός', formula: '1.200 － 180', val: '1.020 €' }
        ],
        explain: 'Κράτηση: (1.200 · 15) : 100 ＝ 180 €. Καθαρός μισθός: 1.200 － 180 ＝ 1.020 €.',
        distractors: ['1.050 €', '980 €', '1.040 €']
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Υπολογισμός ποσού έκπτωσης
  const q1Orig = pickRandom([60, 80, 100, 120]);
  const q1Pct = 20;
  const q1DiscAmount = (q1Orig * q1Pct) / 100;

  // Q2: MCQ - Εύρεση τελικής τιμής σε έκπτωση
  const q2CorrectStatement = 'Αφαιρούμε το ποσό της έκπτωσης από την αρχική τιμή';
  const q2Options = shuffle([
    q2CorrectStatement,
    'Προσθέτουμε το ποσό της έκπτωσης στην αρχική τιμή',
    'Διαιρούμε την αρχική τιμή με το ποσό της έκπτωσης',
    'Η τελική τιμή είναι πάντοτε ίση με το ποσό της έκπτωσης'
  ]);

  // Q3: Input - Υπολογισμός τελικής τιμής με έκπτωση
  const q3Orig = pickRandom([50, 70, 90, 110]);
  const q3Pct = 10;
  const q3FinalP = q3Orig * 0.9;

  // Q4: MCQ - Επιβάρυνση φόρου Φ.Π.Α.
  const q4CorrectStatement = 'Προσθέτουμε τον φόρο Φ.Π.Α. στην καθαρή αρχική αξία του προϊόντος';
  const q4Options = shuffle([
    q4CorrectStatement,
    'Αφαιρούμε τον φόρο Φ.Π.Α. από την καθαρή αρχική αξία',
    'Ο φόρος Φ.Π.Α. δεν αλλάζει καθόλου την τελική τιμή',
    'Διαιρούμε την αρχική τιμή με το 24'
  ]);

  // Q5: Input - Υπολογισμός τελικής τιμής με Φ.Π.Α. 24%
  const q5Clean = pickRandom([50, 100, 150, 200]);
  const q5FinalVal = q5Clean * 1.24;

  // Q6: MCQ - Απευθείας υπολογισμός τελικής τιμής
  const q6CorrectConcept = 'Πολλαπλασιάζουμε την αρχική τιμή με 0,75 (καθώς 100% － 25% ＝ 75%)';
  const q6Options = shuffle([
    q6CorrectConcept,
    'Πολλαπλασιάζουμε την αρχική τιμή με 0,25 και αυτό είναι η τελική τιμή',
    'Διαιρούμε την αρχική τιμή με το 75',
    'Προσθέτουμε 25 € στην αρχική τιμή'
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
      title: 'Υπολογισμός Ποσού Έκπτωσης',
      prompt: `Σε ένα προϊόν αξίας ${q1Orig} € γίνεται έκπτωση 20 %. Πόσα ευρώ (€) είναι η έκπτωση;`,
      correct: String(q1DiscAmount),
      explain: `Έκπτωση: (${q1Orig} · 20) : 100 ＝ ${q1DiscAmount} €.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Εύρεση Τελικής Τιμής σε Έκπτωση',
      prompt: 'Πώς υπολογίζουμε την τελική τιμή πληρωμής ενός προϊόντος όταν γνωρίζουμε την αρχική τιμή και το ποσό της έκπτωσης;',
      options: q2Options,
      correct: q2CorrectStatement,
      explain: 'Στις εκπτώσεις η τιμή μειώνεται, επομένως αφαιρούμε την έκπτωση από την αρχική τιμή: Τελική Τιμή ＝ Αρχική Τιμή － Έκπτωση.'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: 'Τελική Τιμή μετά από Έκπτωση',
      prompt: `Ένα ρούχο κοστίζει ${q3Orig} € και έχει έκπτωση 10 %. Πόσα ευρώ (€) θα πληρώσει ο πελάτης;`,
      correct: formatNum(q3FinalP),
      explain: `Έκπτωση: (${q3Orig} · 10) : 100 ＝ ${formatNum(q3Orig * 0.1)} €. Τελική τιμή: ${q3Orig} － ${formatNum(q3Orig * 0.1)} ＝ ${formatNum(q3FinalP)} €.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Επιβάρυνση Φόρου Φ.Π.Α.',
      prompt: 'Πώς επηρεάζει ο φόρος προστιθέμενης αξίας (Φ.Π.Α.) την τελική τιμή που πληρώνει ο καταναλωτής;',
      options: q4Options,
      correct: q4CorrectStatement,
      explain: 'Ο φόρος Φ.Π.Α. αποτελεί επιβάρυνση, επομένως προστίθεται στην καθαρή αξία του προϊόντος.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'decimal',
      title: 'Τελική Τιμή με Φ.Π.Α.',
      prompt: `Ένα προϊόν έχει καθαρή αξία ${q5Clean} € και επιβαρύνεται με Φ.Π.Α. 24 %. Ποια είναι η τελική τιμή σε €;`,
      correct: formatNum(q5FinalVal),
      explain: `Φόρος: (${q5Clean} · 24) : 100 ＝ ${formatNum(q5Clean * 0.24)} €. Τελική τιμή: ${q5Clean} ＋ ${formatNum(q5Clean * 0.24)} ＝ ${formatNum(q5FinalVal)} €.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Απευθείας Υπολογισμός Τελικής Τιμής',
      prompt: 'Πώς μπορούμε να βρούμε απευθείας την τελική τιμή ενός προϊόντος μετά από έκπτωση 25 % σε ένα μόνο βήμα;',
      options: q6Options,
      correct: q6CorrectConcept,
      explain: 'Εφόσον αφαιρείται το 25%, πληρώνουμε το υπόλοιπο 75% της αξίας, δηλαδή πολλαπλασιάζουμε απευθείας με 0,75.'
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

export default function ProblimataMePosostaExercisesPage() {
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
      title="Ασκήσεις: Προβλήματα με Ποσοστά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα προβλήματα με εκπτώσεις, αυξήσεις, Φ.Π.Α. και τελικές τιμές για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/51-problimata-me-pososta"
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
                <span>ΚΕΦΑΛΑΙΟ 51 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Προβλήματα με Ποσοστά
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον υπολογισμό εκπτώσεων, αυξήσεων, φόρου Φ.Π.Α. και τελικής τιμής πληρωμής σε ρεαλιστικά σενάρια!
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

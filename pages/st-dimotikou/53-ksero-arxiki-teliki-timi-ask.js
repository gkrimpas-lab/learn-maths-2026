// pages/st-dimotikou/53-ksero-arxiki-teliki-timi-ask.js
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
    id: 'k_std_1',
    title: 'Υπολογισμός Ποσοστού Έκπτωσης',
    unit: '%',
    generate: () => {
      const origPrice = pickRandom([50, 60, 80, 100, 120, 150]);
      const discPct = pickRandom([10, 20, 25, 30, 40]);
      const discount = (origPrice * discPct) / 100;
      const finalPrice = origPrice - discount;
      return {
        prompt: `Ένα παντελόνι κόστιζε αρχικά ${origPrice} € και στις εκπτώσεις πωλήθηκε προς ${finalPrice} €. Ποιο ήταν το ποσοστό έκπτωσης (%) που έγινε στην τιμή του;`,
        unit: '%',
        correctVal: String(discPct),
        correctText: `${discPct} %`,
        tableData: [
          { item: 'Ποσό έκπτωσης (διαφορά)', formula: `${origPrice} － ${finalPrice}`, val: `${discount} €` },
          { item: 'Αρχική τιμή (βάση 100%)', formula: `${origPrice} €`, val: `${origPrice} €` },
          { item: 'Ποσοστό έκπτωσης', formula: `(${discount} : ${origPrice}) · 100`, val: `${discPct} %` }
        ],
        explain: `1ο Βήμα: Διαφορά (έκπτωση): ${origPrice} － ${finalPrice} ＝ ${discount} €. 2ο Βήμα: Ποσοστό επί της αρχικής: (${discount} : ${origPrice}) · 100 ＝ ${discPct} %.`,
        distractors: [`${discPct + 10} %`, `${Math.max(5, discPct - 5)} %`, `${discPct + 15} %`]
      };
    }
  },
  {
    id: 'k_std_2',
    title: 'Υπολογισμός Ποσοστού Αύξησης Ενοικίου',
    unit: '%',
    generate: () => {
      const origRent = pickRandom([300, 400, 500]);
      const incPct = pickRandom([5, 10, 15, 20]);
      const increase = (origRent * incPct) / 100;
      const finalRent = origRent + increase;
      return {
        prompt: `Το μηνιαίο ενοίκιο ενός γραφείου ήταν ${origRent} € και μετά από αναπροσαρμογή έγινε ${finalRent} €. Ποιο ήταν το ποσοστό αύξησης (%) του ενοικίου;`,
        unit: '%',
        correctVal: String(incPct),
        correctText: `${incPct} %`,
        tableData: [
          { item: 'Ποσό αύξησης (διαφορά)', formula: `${finalRent} － ${origRent}`, val: `${increase} €` },
          { item: 'Αρχικό ενοίκιο', formula: `${origRent} €`, val: `${origRent} €` },
          { item: 'Ποσοστό αύξησης', formula: `(${increase} : ${origRent}) · 100`, val: `${incPct} %` }
        ],
        explain: `Αύξηση σε ευρώ: ${finalRent} － ${origRent} ＝ ${increase} €. Ποσοστό επί του αρχικού: (${increase} : ${origRent}) · 100 ＝ ${incPct} %.`,
        distractors: [`${incPct + 5} %`, `${Math.max(2, incPct - 5)} %`, `${incPct + 8} %`]
      };
    }
  },
  {
    id: 'k_std_3',
    title: 'Ποσοστό Έκπτωσης σε Φωτιστικό',
    unit: '%',
    generate: () => {
      const origPrice = pickRandom([40, 50, 80, 100]);
      const discPct = 25;
      const discount = (origPrice * discPct) / 100;
      const finalPrice = origPrice - discount;
      return {
        prompt: `Ένα φωτιστικό είχε αρχική τιμή ${origPrice} € και διατέθηκε σε προσφορά προς ${finalPrice} €. Ποιο ποσοστό έκπτωσης (%) προσέφερε το κατάστημα;`,
        unit: '%',
        correctVal: String(discPct),
        correctText: `${discPct} %`,
        tableData: [
          { item: 'Ποσό έκπτωσης', formula: `${origPrice} － ${finalPrice}`, val: `${discount} €` },
          { item: 'Αρχική τιμή καταλόγου', formula: `${origPrice} €`, val: `${origPrice} €` },
          { item: 'Ποσοστό έκπτωσης', formula: `(${discount} : ${origPrice}) · 100`, val: `${discPct} %` }
        ],
        explain: `Διαφορά: ${origPrice} － ${finalPrice} ＝ ${discount} €. Ποσοστό: (${discount} : ${origPrice}) · 100 ＝ ${discPct} %.`,
        distractors: [`${discPct + 5} %`, `${discPct - 5} %`, `${discPct + 10} %`]
      };
    }
  },
  {
    id: 'k_std_4',
    title: 'Αύξηση Τιμής Εισιτηρίου',
    unit: '%',
    generate: () => {
      return {
        prompt: 'Η τιμή του εισιτηρίου λεωφορείου αυξήθηκε από 1,20 € σε 1,50 €. Ποιο ήταν το ποσοστό αύξησης (%) στην τιμή του εισιτηρίου;',
        unit: '%',
        correctVal: '25',
        correctText: '25 %',
        tableData: [
          { item: 'Αύξηση τιμής', formula: '1,50 － 1,20', val: '0,30 €' },
          { item: 'Αρχική τιμή', formula: '1,20 €', val: '1,20 €' },
          { item: 'Ποσοστό αύξησης', formula: '(0,30 : 1,20) · 100', val: '25 %' }
        ],
        explain: 'Αύξηση: 1,50 － 1,20 ＝ 0,30 €. Ποσοστό αύξησης: (0,30 : 1,20) · 100 ＝ 25 %.',
        distractors: ['30 %', '20 %', '15 %']
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'k_hard_1',
    title: 'Υπολογισμός Συντελεστή Φ.Π.Α.',
    unit: '%',
    generate: () => {
      return {
        prompt: 'Ένα κατάστημα τιμολογεί έναν εκτυπωτή με αρχική καθαρή αξία 250 €. Ο πελάτης πλήρωσε τελικά 310 € μαζί με τον φόρο. Ποιο ήταν το ποσοστό (%) του Φ.Π.Α. με το οποίο επιβαρύνθηκε ο εκτυπωτής;',
        unit: '%',
        correctVal: '24',
        correctText: '24 %',
        tableData: [
          { item: 'Ποσό φόρου (διαφορά)', formula: '310 － 250', val: '60 €' },
          { item: 'Καθαρή αρχική αξία', formula: '250 €', val: '250 €' },
          { item: 'Ποσοστό Φ.Π.Α.', formula: '(60 : 250) · 100', val: '24 %' }
        ],
        explain: 'Φόρος: 310 － 250 ＝ 60 €. Ποσοστό Φ.Π.Α. επί της αρχικής καθαρής αξίας: (60 : 250) · 100 ＝ 24 %.',
        distractors: ['13 %', '20 %', '25 %']
      };
    }
  },
  {
    id: 'k_hard_2',
    title: 'Υπολογισμός Ποσοστού Έκπτωσης από Όφελος',
    unit: '%',
    generate: () => {
      return {
        prompt: 'Ένας αγοραστής αγόρασε ένα μπουφάν πληρώνοντας 60 € και υπολόγισε ότι εξοικονόμησε 20 € σε σχέση με την αρχική τιμή της ετικέτας. Ποιο ήταν το ποσοστό έκπτωσης (%);',
        unit: '%',
        correctVal: '25',
        correctText: '25 %',
        tableData: [
          { item: 'Αρχική τιμή ετικέτας', formula: '60 ＋ 20', val: '80 €' },
          { item: 'Όφελος (έκπτωση)', formula: '20 €', val: '20 €' },
          { item: 'Ποσοστό έκπτωσης', formula: '(20 : 80) · 100', val: '25 %' }
        ],
        explain: 'Αρχική τιμή: 60 ＋ 20 ＝ 80 €. Ποσοστό έκπτωσης επί της αρχικής τιμής: (20 : 80) · 100 ＝ 25 %.',
        distractors: ['33 %', '20 %', '30 %']
      };
    }
  },
  {
    id: 'k_hard_3',
    title: 'Ποσοστό Κέρδους επί της Τιμής Αγοράς',
    unit: '%',
    generate: () => {
      return {
        prompt: 'Ένας έμπορος αγόρασε ένα εμπόρευμα προς 50 € και το πούλησε προς 65 €. Ποιο ήταν το ποσοστό κέρδους (%) του εμπόρου επί της τιμής αγοράς;',
        unit: '%',
        correctVal: '30',
        correctText: '30 %',
        tableData: [
          { item: 'Καθαρό κέρδος', formula: '65 － 50', val: '15 €' },
          { item: 'Τιμή αγοράς (βάση)', formula: '50 €', val: '50 €' },
          { item: 'Ποσοστό κέρδους', formula: '(15 : 50) · 100', val: '30 %' }
        ],
        explain: 'Κέρδος: 65 － 50 ＝ 15 €. Ποσοστό κέρδους επί της τιμής αγοράς: (15 : 50) · 100 ＝ 30 %.',
        distractors: ['25 %', '35 %', '20 %']
      };
    }
  },
  {
    id: 'k_hard_4',
    title: 'Ποσοστό Κατανάλωσης Νερού σε Δεξαμενή',
    unit: '%',
    generate: () => {
      return {
        prompt: 'Μια δεξαμενή είχε αρχικά 500 l νερό. Μετά από κατανάλωση, έχουν απομείνει στη δεξαμενή 325 l νερό. Ποιο ποσοστό (%) του αρχικού νερού καταναλώθηκε;',
        unit: '%',
        correctVal: '35',
        correctText: '35 %',
        tableData: [
          { item: 'Νερό που καταναλώθηκε', formula: '500 － 325', val: '175 l' },
          { item: 'Αρχικός όγκος δεξαμενής', formula: '500 l', val: '500 l' },
          { item: 'Ποσοστό κατανάλωσης', formula: '(175 : 500) · 100', val: '35 %' }
        ],
        explain: 'Νερό που καταναλώθηκε: 500 － 325 ＝ 175 l. Ποσοστό: (175 : 500) · 100 ＝ 35 %.',
        distractors: ['40 %', '30 %', '45 %']
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Εύρεση ποσοστού έκπτωσης
  const q1Orig = pickRandom([50, 80, 100, 120]);
  const q1DiscPct = 25;
  const q1Final = q1Orig * 0.75;
  const q1Diff = q1Orig - q1Final;

  // Q2: MCQ - Βάση υπολογισμού ποσοστού
  const q2Correct = 'Πάντοτε στην αρχική τιμή, γιατί αυτή αποτελεί το 100 % της σύγκρισης';
  const q2Options = shuffle([
    q2Correct,
    'Πάντοτε στην τελική τιμή, γιατί αυτή πληρώνουμε στο ταμείο',
    'Στο άθροισμα της αρχικής και της τελικής τιμής',
    'Δεν έχει σημασία σε ποια τιμή θα το υπολογίσουμε'
  ]);

  // Q3: Input - Εύρεση ποσοστού αύξησης
  const q3Orig = pickRandom([40, 50, 80]);
  const q3IncPct = 20;
  const q3Final = q3Orig * 1.2;
  const q3Diff = q3Final - q3Orig;

  // Q4: MCQ - Ο μαθηματικός τύπος
  const q4Correct = 'Ποσοστό % ＝ (Διαφορά Τιμών : Αρχική Τιμή) · 100';
  const q4Options = shuffle([
    q4Correct,
    'Ποσοστό % ＝ (Διαφορά Τιμών : Τελική Τιμή) · 100',
    'Ποσοστό % ＝ (Αρχική Τιμή : Τελική Τιμή) · 100',
    'Ποσοστό % ＝ (Τελική Τιμή － 100) : Αρχική Τιμή'
  ]);

  // Q5: Input - Ποσοστό κέρδους
  const q5Cost = pickRandom([20, 25, 40, 50]);
  const q5ProfitPct = pickRandom([10, 15, 25, 50]);
  const q5ProfitEur = (q5Cost * q5ProfitPct) / 100;
  const q5Sell = q5Cost + q5ProfitEur;

  // Q6: MCQ - Αναγνώριση είδους μεταβολής
  const q6Correct = 'Έχουμε μείωση (έκπτωση) 20 %, επειδή η τελική τιμή είναι μικρότερη από την αρχική';
  const q6Options = shuffle([
    q6Correct,
    'Έχουμε αύξηση 20 %, επειδή αφαιρέσαμε 20 €',
    'Έχουμε μείωση 25 %, επειδή διαιρούμε με το 80',
    'Δεν υπάρχει καμία ποσοστιαία μεταβολή'
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
      title: 'Εύρεση Ποσοστού Έκπτωσης',
      prompt: `Ένα προϊόν κόστιζε αρχικά ${q1Orig} € και πωλείται τώρα προς ${q1Final} €. Ποιο είναι το ποσοστό έκπτωσης (%) που έγινε; (γράψε μόνο τον αριθμό)`,
      correct: String(q1DiscPct),
      explain: `Διαφορά: ${q1Orig} － ${q1Final} ＝ ${q1Diff} €. Ποσοστό επί της αρχικής τιμής: (${q1Diff} : ${q1Orig}) · 100 ＝ ${q1DiscPct} %.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Βάση Υπολογισμού Ποσοστού',
      prompt: 'Σε ποια τιμή υπολογίζουμε το ποσοστό αύξησης ή έκπτωσης όταν γνωρίζουμε την αρχική και την τελική τιμή;',
      options: q2Options,
      correct: q2Correct,
      explain: 'Το ποσοστό μεταβολής υπολογίζεται πάντοτε πάνω στην αρχική τιμή, επειδή αυτή είναι το σημείο εκκίνησης και αντιστοιχεί στο 100%.'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Εύρεση Ποσοστού Αύξησης',
      prompt: `Η τιμή ενός προϊόντος ανέβηκε από τα ${q3Orig} € στα ${q3Final} €. Ποιο ήταν το ποσοστό αύξησης (%) της τιμής; (γράψε μόνο τον αριθμό)`,
      correct: String(q3IncPct),
      explain: `Διαφορά: ${q3Final} － ${q3Orig} ＝ ${q3Diff} €. Ποσοστό αύξησης επί της αρχικής τιμής: (${q3Diff} : ${q3Orig}) · 100 ＝ ${q3IncPct} %.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Ο Μαθηματικός Τύπος Μεταβολής',
      prompt: 'Ποιος είναι ο σωστός τύπος για τον υπολογισμό του ποσοστού μεταβολής όταν γνωρίζουμε την αρχική και την τελική τιμή;',
      options: q4Options,
      correct: q4Correct,
      explain: `Διαιρούμε τη διαφορά των δύο τιμών με την αρχική τιμή και πολλαπλασιάζουμε με το 100: ${q4Correct}.`
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Ποσοστό Κέρδους επί της Αγοράς',
      prompt: `Ένας καταστηματάρχης αγόρασε ένα είδος προς ${q5Cost} € και το πούλησε προς ${q5Sell} €. Ποιο ήταν το ποσοστό κέρδους (%) επί της τιμής αγοράς; (γράψε μόνο τον αριθμό)`,
      correct: String(q5ProfitPct),
      explain: `Κέρδος: ${q5Sell} － ${q5Cost} ＝ ${q5ProfitEur} €. Ποσοστό κέρδους: (${q5ProfitEur} : ${q5Cost}) · 100 ＝ ${q5ProfitPct} %.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Αναγνώριση Είδους Μεταβολής',
      prompt: 'Αν ένα προϊόν από 100 € πωληθεί τελικά προς 80 €, τι είδους μεταβολή έχουμε;',
      options: q6Options,
      correct: q6Correct,
      explain: 'Η τιμή μειώθηκε από 100 € σε 80 €, επομένως έχουμε μείωση (έκπτωση) κατά: (20 : 100) · 100 ＝ 20 %.'
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
      inputType: 'number',
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

export default function KseroArxikiTelikiTimiExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/%/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/%/g, '').trim().toLowerCase();

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
      title="Ασκήσεις: Εύρεση Ποσοστού από Αρχική και Τελική Τιμή - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην εύρεση του ποσοστού έκπτωσης ή αύξησης για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/53-ksero-arxiki-teliki-timi"
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
                <span>ΚΕΦΑΛΑΙΟ 53 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Εύρεση Ποσοστού από Αρχική και Τελική Τιμή
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον υπολογισμό της διαφοράς τιμών και στην αναγωγή της μεταβολής σε ποσοστό επί της αρχικής τιμής!
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
                          placeholder={q.inputType === 'decimal' ? 'π.χ. 12,5' : 'Απάντηση...'}
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

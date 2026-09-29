// pages/st-dimotikou/08-diairesi-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

// Τυχαιος ακεραιος στο [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ανακατεμα πινακα
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Μορφοποιηση αριθμου με τελειες χιλιαδων
function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return Number(num).toLocaleString('el-GR');
}

// Πληρης δεξαμενη θεματικων αντικειμενων καθημερινοτητας
const REAL_WORLD_DIVISIONS = [
  { item: 'καραμέλες', group: 'παιδιά', unit: 'καραμέλες' },
  { item: 'βιβλία', group: 'ράφια', unit: 'βιβλία' },
  { item: 'ευρώ', group: 'κουμπαράδες', unit: '€' },
  { item: 'κιλά αλεύρι', group: 'σακούλες', unit: 'κιλά' },
  { item: 'μήλα', group: 'τελάρα', unit: 'μήλα' },
  { item: 'τετράδια', group: 'μαθητές', unit: 'τετράδια' },
  { item: 'λίτρα χυμού', group: 'μπουκάλια', unit: 'λίτρα' },
  { item: 'μπάλες', group: 'κουτιά', unit: 'μπάλες' },
  { item: 'αυγά', group: 'θήκες', unit: 'αυγά' },
  { item: 'σοκολάτες', group: 'πακέτα', unit: 'σοκολάτες' }
];

// Δεξαμενη προβληματων για τις ερωτησεις 9 & 10
const EXTRA_PROBLEMS_POOL = [
  {
    id: 'p_div_std_1',
    generate: () => {
      const totalStudents = randInt(120, 240);
      const perBus = 45;
      const fullBuses = Math.floor(totalStudents / perBus);
      const remaining = totalStudents % perBus;
      const totalBuses = remaining > 0 ? fullBuses + 1 : fullBuses;
      return {
        text: `Σε μια σχολική εκδρομή συμμετέχουν ${totalStudents} μαθητές. Κάθε λεωφορείο χωράει ${perBus} μαθητές. Πόσα λεωφορεία χρειάζονται τουλάχιστον ώστε να μεταφερθούν όλοι οι μαθητές;`,
        tableData: { col1: 'Σύνολο Μαθητών', col2: 'Χωρητικότητα Λεωφορείου', r1: [`${totalStudents} μαθητές`, `${perBus} θέσεις`], r2: [`Διαίρεση: ${fullBuses} (υπόλ. ${remaining})`, `Σύνολο: ${totalBuses} λεωφορεία`] },
        correctVal: totalBuses,
        correctStr: String(totalBuses),
        explanation: `Εκτελούμε τη διαίρεση: ${totalStudents} : ${perBus} ＝ ${fullBuses} με υπόλοιπο ${remaining}. Επειδή οι ${remaining} μαθητές που περισσεύουν χρειάζονται άλλο ένα λεωφορείο, θα χρειαστούν ${totalBuses} λεωφορεία συνολικά.`
      };
    }
  },
  {
    id: 'p_div_std_2',
    generate: () => {
      const money = randInt(150, 450);
      const ticketPrice = 12;
      const tickets = Math.floor(money / ticketPrice);
      const change = money % ticketPrice;
      return {
        text: `Μια ομάδα παιδιών συγκέντρωσε ${money} € για εισιτήρια συναυλίας. Αν κάθε εισιτήριο κοστίζει ${ticketPrice} €, πόσα εισιτήρια μπορούν να αγοράσουν το πολύ;`,
        tableData: { col1: 'Συνολικό Ποσό', col2: 'Τιμή Εισιτηρίου', r1: [`${money} €`, `${ticketPrice} €`], r2: ['Διαίρεση', 'χ εισιτήρια'] },
        correctVal: tickets,
        correctStr: String(tickets),
        explanation: `Εκτελούμε τη διαίρεση: ${money} : ${ticketPrice} ＝ ${tickets} με υπόλοιπο ${change} €. Άρα μπορούν να αγοράσουν ${tickets} εισιτήρια και θα περισσέψουν ${change} €.`
      };
    }
  },
  {
    id: 'p_div_std_3',
    generate: () => {
      const oilKg = randInt(180, 360);
      const canKg = 5;
      const cans = Math.floor(oilKg / canKg);
      const rem = oilKg % canKg;
      return {
        text: `Ένας παραγωγός έχει ${oilKg} kg ελαιόλαδο και θέλει να το βάλει σε δοχεία των ${canKg} kg. Πόσα τέτοια δοχεία θα γεμίσει πλήρως;`,
        tableData: { col1: 'Συνολικό Λάδι', col2: 'Χωρητικότητα Δοχείου', r1: [`${oilKg} kg`, `${canKg} kg`], r2: ['Διαίρεση', 'χ δοχεία'] },
        correctVal: cans,
        correctStr: String(cans),
        explanation: `Εκτελούμε τη διαίρεση: ${oilKg} : ${canKg} ＝ ${cans} με υπόλοιπο ${rem} kg. Θα γεμίσουν πλήρως ${cans} δοχεία.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];
  const shuffledItems = shuffle(REAL_WORLD_DIVISIONS);

  // Q1 (Input - Decimal): Υπολογισμός Πηλίκου σε Τέλεια Διαίρεση
  {
    const q1Divisor = randInt(4, 12);
    const q1Quotient = randInt(12, 85);
    const q1Dividend = q1Divisor * q1Quotient;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΤΕΛΕΙΑ ΔΙΑΙΡΕΣΗ (ΠΗΛΙΚΟ)',
      instruction: 'Υπολογίστε το πηλίκο της τέλειας διαίρεσης:',
      prompt: `Υπολογίστε: ${formatNumber(q1Dividend)} : ${q1Divisor};`,
      correctVal: q1Quotient,
      correctStr: String(q1Quotient),
      explanation: `Η διαίρεση είναι τέλεια (υπόλοιπο 0): ${formatNumber(q1Dividend)} : ${q1Divisor} ＝ ${q1Quotient}.`
    });
  }

  // Q2 (Input - Decimal): Εύρεση Διαιρετέου (Δ ＝ δ · π ＋ υ)
  {
    const q2Divisor = randInt(6, 15);
    const q2Quotient = randInt(14, 45);
    const q2Remainder = randInt(1, q2Divisor - 1);
    const q2Dividend = q2Divisor * q2Quotient + q2Remainder;

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΕΥΡΕΣΗ ΔΙΑΙΡΕΤΕΟΥ (Δ)',
      instruction: 'Βρείτε τον Διαιρετέο εφαρμόζοντας τη μαθηματική ταυτότητα:',
      prompt: `Βρείτε τον Διαιρετέο (Δ) όταν: διαιρέτης (δ) ＝ ${q2Divisor}, πηλίκο (π) ＝ ${q2Quotient} και υπόλοιπο (υ) ＝ ${q2Remainder}.`,
      correctVal: q2Dividend,
      correctStr: String(q2Dividend),
      explanation: `Εφαρμόζουμε την ταυτότητα Δ ＝ δ · π ＋ υ: Δ ＝ (${q2Divisor} · ${q2Quotient}) ＋ ${q2Remainder} ＝ ${q2Divisor * q2Quotient} ＋ ${q2Remainder} ＝ ${formatNumber(q2Dividend)}.`
    });
  }

  // Q3 (MCQ): Χαρακτηρισμός Τέλειας / Ατελούς Διαίρεσης
  {
    const q3IsPerfect = Math.random() > 0.5;
    const q3Divisor = randInt(4, 9);
    const q3Quotient = randInt(10, 30);
    const q3Remainder = q3IsPerfect ? 0 : randInt(1, q3Divisor - 1);
    const q3Dividend = q3Divisor * q3Quotient + q3Remainder;
    const q3Correct = q3IsPerfect ? 'Τέλεια Διαίρεση' : 'Ατελής Διαίρεση';

    const rawOptions = ['Τέλεια Διαίρεση', 'Ατελής Διαίρεση'];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q3Correct
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΧΑΡΑΚΤΗΡΙΣΜΟΣ ΠΡΑΞΗΣ',
      instruction: 'Επιλέξτε το είδος της διαίρεσης:',
      prompt: `Ποιο είναι το είδος της διαίρεσης ${formatNumber(q3Dividend)} : ${q3Divisor};`,
      options,
      correctText: q3Correct,
      explanation: q3IsPerfect
        ? `Επειδή ${formatNumber(q3Dividend)} ＝ ${q3Divisor} · ${q3Quotient} (υπόλοιπο 0), η διαίρεση είναι Τέλεια.`
        : `Επειδή ${formatNumber(q3Dividend)} ＝ (${q3Divisor} · ${q3Quotient}) ＋ ${q3Remainder} (υπόλοιπο ${q3Remainder} ＞ 0), η διαίρεση είναι Ατελής.`
    });
  }

  // Q4 (MCQ): Πρόβλημα Καθημερινότητας με Υπόλοιπο (Εγγύηση Μοναδικότητας)
  {
    const q4Item = shuffledItems[0];
    const q4Divisor = randInt(5, 9);
    const q4Quotient = randInt(8, 25);
    const q4Remainder = randInt(1, q4Divisor - 1);
    const q4Dividend = q4Divisor * q4Quotient + q4Remainder;
    const q4Correct = `${q4Quotient} ${q4Item.unit} (περίσσεψαν ${q4Remainder})`;

    const w1 = `${q4Quotient + 1} ${q4Item.unit} (περίσσεψαν 0)`;
    const w2 = `${q4Quotient} ${q4Item.unit} (περίσσεψαν 0)`;
    const w3 = `${q4Quotient - 1} ${q4Item.unit} (περίσσεψαν ${q4Remainder + 1})`;

    const rawOptions = [q4Correct, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q4Correct
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: 'Επιλέξτε τη σωστή κατανομή και το υπόλοιπο:',
      prompt: `Μοιράζουμε ${q4Dividend} ${q4Item.item} σε ${q4Divisor} ${q4Item.group}. Πόσα ${q4Item.unit} θα πάρει το καθένα και πόσα θα περισσέψουν;`,
      options,
      correctText: q4Correct,
      explanation: `Κάνουμε τη διαίρεση ${q4Dividend} : ${q4Divisor}: Πηλίκο ＝ ${q4Quotient}, Υπόλοιπο ＝ ${q4Remainder}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας Υπολοίπου (υ ＜ δ)
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Div = randInt(6, 12);
    const q5Text = q5IsTrue
      ? `Σε μια ατελή διαίρεση με διαιρέτη το ${q5Div}, το υπόλοιπο μπορεί να είναι οποιοσδήποτε αριθμός από το 1 έως το ${q5Div - 1}.`
      : `Σε μια ατελή διαίρεση με διαιρέτη το ${q5Div}, το υπόλοιπο μπορεί να είναι ίσο με ${q5Div} ή μεγαλύτερο.`;
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΥΠΟΛΟΙΠΟΥ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Το υπόλοιπο (υ) είναι πάντοτε αυστηρά μικρότερο από τον διαιρέτη (υ ＜ δ).'
        : 'Λάθος! Το υπόλοιπο δεν μπορεί ποτέ να είναι ίσο ή μεγαλύτερο από τον διαιρέτη.'
    });
  }

  // Q6 (MCQ): True / False - Μαθηματική Ταυτότητα (Δ ＝ δ · π ＋ υ)
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Η μαθηματική ταυτότητα της διαίρεσης εκφράζεται ως: Διαιρετέος ＝ (Διαιρέτης · Πηλίκο) ＋ Υπόλοιπο.'
      : 'Η μαθηματική ταυτότητα της διαίρεσης εκφράζεται ως: Διαιρετέος ＝ (Διαιρέτης ＋ Πηλίκο) · Υπόλοιπο.';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΜΑΘΗΜΑΤΙΚΗ ΤΑΥΤΟΤΗΤΑ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Ο Διαιρετέος ισούται πάντα με το γινόμενο του Διαιρέτη επί το Πηλίκο συν το Υπόλοιπο.'
        : 'Λάθος! Ο σωστός τύπος είναι: Δ ＝ (δ · π) ＋ υ.'
    });
  }

  // Q7 (Input - Decimal): Οπτικό Μοίρασμα σε Ομάδες
  {
    const q7Divisor = randInt(3, 6);
    const q7Quotient = randInt(4, 8);
    const q7Remainder = randInt(1, q7Divisor - 1);
    const q7Dividend = q7Divisor * q7Quotient + q7Remainder;

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΟ ΜΟΙΡΑΣΜΑ',
      instruction: 'Βρείτε πόσα στοιχεία παίρνει κάθε ομάδα:',
      prompt: `Μοιράζουμε ${q7Dividend} στοιχεία σε ${q7Divisor} ίσες ομάδες. Πόσα στοιχεία παίρνει η κάθε ομάδα;`,
      correctVal: q7Quotient,
      correctStr: String(q7Quotient),
      explanation: `Μοιράζοντας ${q7Dividend} στοιχεία σε ${q7Divisor} ομάδες: ${q7Dividend} : ${q7Divisor} ＝ ${q7Quotient} και περισσεύουν ${q7Remainder} (υπόλοιπο).`
    });
  }

  // Q8 (MCQ): Εύρεση Υπολοίπου (Εγγύηση Μοναδικότητας)
  {
    const q8Divisor = randInt(7, 12);
    const q8Quotient = randInt(15, 35);
    const q8Remainder = randInt(2, q8Divisor - 1);
    const q8Dividend = q8Divisor * q8Quotient + q8Remainder;
    const correctStr = String(q8Remainder);

    const w1 = String(q8Remainder + 1);
    const w2 = '0';
    const w3 = String(q8Divisor);

    const rawOptions = [correctStr, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text: `υ ＝ ${text}`,
      isCorrect: text === correctStr
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΕΥΡΕΣΗ ΥΠΟΛΟΙΠΟΥ',
      instruction: 'Επιλέξτε το σωστό υπόλοιπο της διαίρεσης:',
      prompt: `Στη διαίρεση ${formatNumber(q8Dividend)} : ${q8Divisor} ＝ ${q8Quotient}, ποιο είναι το υπόλοιπο (υ);`,
      options,
      correctText: `υ ＝ ${correctStr}`,
      explanation: `Υπολογίζουμε: ${formatNumber(q8Dividend)} － (${q8Divisor} · ${q8Quotient}) ＝ ${formatNumber(q8Dividend)} － ${formatNumber(q8Divisor * q8Quotient)} ＝ ${q8Remainder}.`
    });
  }

  // Q9 & Q10: Προβλήματα από τη δεξαμενή EXTRA_PROBLEMS_POOL (1 Input, 1 MCQ)
  {
    const shuffledPool = shuffle([...EXTRA_PROBLEMS_POOL]);
    const prob9 = shuffledPool[0].generate();
    const prob10 = shuffledPool[1].generate();

    // Q9 (Input - Decimal)
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 9 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΔΙΑΙΡΕΣΗΣ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: prob9.text,
      tableData: prob9.tableData,
      correctVal: prob9.correctVal,
      correctStr: prob9.correctStr,
      explanation: prob9.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας - Εγγύηση Μοναδικότητας)
    const val10 = prob10.correctVal;
    const correctStr10 = `${prob10.correctStr} εισιτήρια`;
    const fake10A = `${val10 + 2} εισιτήρια`;
    const fake10B = `${Math.max(1, val10 - 2)} εισιτήρια`;
    const fake10C = `${val10 + 5} εισιτήρια`;

    const rawOptionsQ10 = [correctStr10, fake10A, fake10B, fake10C];
    const optionsQ10 = shuffle([...new Set(rawOptionsQ10)]).map((text) => ({
      text,
      isCorrect: text === correctStr10
    }));

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΚΑΤΑΝΟΜΗΣ',
      instruction: 'Επιλέξτε τη σωστή τιμή για το πρόβλημα:',
      prompt: prob10.text,
      tableData: prob10.tableData,
      options: optionsQ10,
      correctText: correctStr10,
      explanation: prob10.explanation
    });
  }

  return qList;
}

export default function DiairesiExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργια νεων ασκησεων
  const loadNewSet = useCallback(() => {
    const q = generateQuestions();
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμος Input με καθαρισμο χαρακτηρων (μονο 0-9 και ενα κομμα, οριο 10 χαρακτηρων)
  const handleInputChange = (fieldKey, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/\./g, '');
    sanitized = sanitized.replace(/[^0-9,]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [fieldKey]: sanitized
    }));
  };

  // Χειρισμος MCQ
  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  // Ελεγχος Απαντησεων
  const handleCheckAnswers = () => {
    let currentScore = 0;

    questions.forEach((q) => {
      if (q.type === 'mcq') {
        const userChoice = answers[`q_${q.id}`];
        if (userChoice === q.correctText) {
          currentScore += 1;
        }
      } else if (q.type === 'decimal_input') {
        const userValStr = (answers[`q_${q.id}`] || '').trim().replace(',', '.');
        const userVal = parseFloat(userValStr);
        if (!isNaN(userVal) && Math.abs(userVal - q.correctVal) < 0.05) {
          currentScore += 1;
        }
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  return (
    <Layout
      title="Ασκήσεις: Τέλεια και Ατελής Διαίρεση - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στη διαίρεση φυσικών αριθμών, την τέλεια και ατελή διαίρεση και τη μαθηματική ταυτότητα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/08-diairesi"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      {/* Container πληρους ευρους για κινητα εως 2K, 4K & 8K */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-32 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ασκήσεις &amp; Προβλήματα: Τέλεια &amp; Ατελής Διαίρεση
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με τέλειες και ατελείς διαιρέσεις, υπολογισμό πηλίκου και υπολοίπου, εφαρμογή της μαθηματικής ταυτότητας και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation"
            >
              <span>🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>
          </div>
        </section>

        {/* Λιστα 10 Ασκησεων */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (isSubmitted) {
              if (q.type === 'mcq') {
                isCorrect = answers[`q_${q.id}`] === q.correctText;
              } else if (q.type === 'decimal_input') {
                const uv = parseFloat((answers[`q_${q.id}`] || '').replace(',', '.'));
                isCorrect = !isNaN(uv) && Math.abs(uv - q.correctVal) < 0.05;
              }
            }

            return (
              <article
                key={`q-${q.id}-${idx}`}
                className={`bg-white rounded-3xl border p-5 sm:p-8 2xl:p-10 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλιδα Ερωτησης (Καθαρα ατονα κεφαλαια εκτος ΣΤ') */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {toCleanUppercase(q.title)}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs 2xl:text-sm font-bold px-3 py-1 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '✓ ΣΩΣΤΟ' : '✗ ΛΑΘΟΣ'}
                    </span>
                  )}
                </div>

                {/* Εκφωνηση */}
                <div className="space-y-3 mb-5">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>

                  {/* Πινακας Δεδομενων (αν υπαρχει) */}
                  {q.tableData && (
                    <div className="inline-block max-w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 shadow-inner my-2 font-mono text-xs sm:text-sm 2xl:text-base">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                        <span className="bg-blue-100/60 px-2 py-0.5 rounded-lg text-blue-900 break-words">{q.tableData.col1}</span>
                        <span className="bg-emerald-100/60 px-2 py-0.5 rounded-lg text-emerald-900 break-words">{q.tableData.col2}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                        <span>{q.tableData.r1[0]}</span>
                        <span className="text-indigo-700 font-bold">{q.tableData.r1[1]}</span>
                        <span>{q.tableData.r2[0]}</span>
                        <span className="text-amber-600 font-black">{q.tableData.r2[1]}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500">
                        (Ακέραιος αριθμός)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) - Χωρις truncate, πληρες κειμενο break-words */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1">
                              {opt.text}
                            </span>
                            <span
                              className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-xs ${
                                isSelected
                                  ? 'border-white bg-white text-blue-600 font-bold'
                                  : 'border-slate-400 bg-transparent'
                              }`}
                            >
                              {isSelected ? '●' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>

                {/* Feedback μετα την υποβολη */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-1.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? '🎉 Εξαιρετικά!' : '💡 Μαθηματική Επεξήγηση:'}</span>
                    </div>
                    <div>{q.explanation}</div>
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800">
                        Σωστή απάντηση:{' '}
                        <span className="font-mono font-bold text-blue-900">
                          {q.correctStr || q.correctText}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Κουμπι Ελεγχου στο τελος της φορμας */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleCheckAnswers}
            disabled={isSubmitted}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Απαντήσεων</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                ΣΚΟΡ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-base">/ 10</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-xs text-slate-400 font-semibold block">
                ΠΟΣΟΣΤΟ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
                {Math.round((score / 10) * 100)} %
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                ΕΛΕΓΧΟΣ
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}

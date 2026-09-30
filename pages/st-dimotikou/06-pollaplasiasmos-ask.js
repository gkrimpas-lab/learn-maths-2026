// pages/st-dimotikou/06-pollaplasiasmos-ask.js
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

// Πληρης δεξαμενη 21 θεματικων αντικειμενων καθημερινοτητας
const REAL_WORLD_MULTIPLICATIONS = [
  { item: 'κουτιά με μαρκαδόρους', unit: 'μαρκαδόροι' },
  { item: 'πακέτα με τετράδια', unit: 'τετράδια' },
  { item: 'κιβώτια με χυμούς', unit: 'μπουκάλια' },
  { item: 'σειρές καθισμάτων στο θέατρο', unit: 'θέσεις' },
  { item: 'δίσκοι με φρέσκα αυγά', unit: 'αυγά' },
  { item: 'σακούλες με καραμέλες', unit: 'καραμέλες' },
  { item: 'ράφια με βιβλία στη βιβλιοθήκη', unit: 'βιβλία' },
  { item: 'παλέτες με τούβλα', unit: 'τούβλα' },
  { item: 'κούτες με μπάλες μπάσκετ', unit: 'μπάλες' },
  { item: 'δοχεία με ελιές', unit: 'κιλά' },
  { item: 'κουτιά με σοκολατάκια', unit: 'σοκολατάκια' },
  { item: 'παρτέρια με τριαντάφυλλα', unit: 'λουλούδια' },
  { item: 'δεμάτια με σανό', unit: 'κιλά' },
  { item: 'κιβώτια με μήλα', unit: 'μήλα' },
  { item: 'πακέτα με αυτοκόλλητα', unit: 'αυτοκόλλητα' },
  { item: 'σειρές με ηλιακά πάνελ', unit: 'πάνελ' },
  { item: 'κιβώτια με αναψυκτικά', unit: 'κουτάκια' },
  { item: 'σακιά με αλεύρι', unit: 'κιλά' },
  { item: 'κουτιά με ξυλομπογιές', unit: 'ξυλομπογιές' },
  { item: 'τελάρα με πορτοκάλια', unit: 'πορτοκάλια' },
  { item: 'πακέτα με σελιδοδείκτες', unit: 'σελιδοδείκτες' }
];

// Δεξαμενη προβληματων για τις ερωτησεις 9 & 10
const EXTRA_PROBLEMS_POOL = [
  {
    id: 'p_mul_std_1',
    generate: () => {
      const boxes = randInt(15, 35);
      const itemsPerBox = 24;
      const total = boxes * itemsPerBox;
      return {
        text: `Σε μια αποθήκη έφτασαν ${boxes} κιβώτια με χυμούς. Αν κάθε κιβώτιο περιέχει ${itemsPerBox} μπουκάλια, πόσα μπουκάλια χυμού έφτασαν συνολικά;`,
        tableData: { col1: 'Κιβώτια', col2: 'Μπουκάλια ανά κιβώτιο', r1: [`${boxes} κιβώτια`, `${itemsPerBox} μπουκάλια`], r2: ['Πολλαπλασιασμός', 'χ μπουκάλια'] },
        correctVal: total,
        correctStr: String(total),
        explanation: `Πολλαπλασιάζουμε: ${boxes} · ${itemsPerBox} ＝ ${formatNumber(total)} μπουκάλια.`
      };
    }
  },
  {
    id: 'p_mul_std_2',
    generate: () => {
      const rows = randInt(18, 30);
      const seatsPerRow = 25;
      const total = rows * seatsPerRow;
      return {
        text: `Ένα θέατρο έχει ${rows} σειρές καθισμάτων και κάθε σειρά έχει ${seatsPerRow} θέσεις. Πόσες θέσεις έχει συνολικά το θέατρο;`,
        tableData: { col1: 'Σειρές', col2: 'Θέσεις ανά σειρά', r1: [`${rows} σειρές`, `${seatsPerRow} θέσεις`], r2: ['Πολλαπλασιασμός', 'χ θέσεις'] },
        correctVal: total,
        correctStr: String(total),
        explanation: `Υπολογίζουμε έξυπνα: ${rows} · 25 ＝ (${rows} · 100) : 4 ＝ ${formatNumber(total)} θέσεις.`
      };
    }
  },
  {
    id: 'p_mul_std_3',
    generate: () => {
      const price = 45;
      const quantity = randInt(12, 28);
      const total = price * quantity;
      return {
        text: `Ένα σχολείο αγόρασε ${quantity} μπάλες μπάσκετ προς ${price} € τη μία. Πόσα ευρώ (€) πλήρωσε συνολικά;`,
        tableData: { col1: 'Τιμή ανά μπάλα', col2: 'Πλήθος μπαλών', r1: [`${price} €`, `${quantity} μπάλες`], r2: ['Πολλαπλασιασμός', 'χ €'] },
        correctVal: total,
        correctStr: String(total),
        explanation: `Πολλαπλασιάζουμε: ${quantity} · ${price} ＝ ${formatNumber(total)} €.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];
  const shuffledItems = shuffle(REAL_WORLD_MULTIPLICATIONS);

  // Q1 (Input - Decimal): Υπολογισμός Γινομένου (με πολλαπλάσιο του 10)
  {
    const q1A = randInt(15, 85);
    const q1Mult = [10, 20, 30, 100, 200][randInt(0, 4)];
    const q1Answer = q1A * q1Mult;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΥΠΟΛΟΓΙΣΜΟΣ ΓΙΝΟΜΕΝΟΥ',
      instruction: 'Υπολογίστε το γινόμενο:',
      prompt: `Υπολογίστε: ${q1A} · ${q1Mult};`,
      itemContext: shuffledItems[0].item,
      correctVal: q1Answer,
      correctStr: String(q1Answer),
      explanation: `Πολλαπλασιάζουμε: ${q1A} · ${q1Mult} ＝ ${formatNumber(q1Answer)}.`
    });
  }

  // Q2 (Input - Decimal): Επιμεριστική Ιδιότητα [α · (β ＋ γ)]
  {
    const q2A = randInt(4, 9);
    const q2Tens = randInt(1, 5) * 10;
    const q2Units = randInt(1, 9);
    const q2Total = q2Tens + q2Units;
    const q2Answer = q2A * q2Total;
    const q2Prompt = `${q2A} · (${q2Tens} ＋ ${q2Units})`;

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      instruction: 'Υπολογίστε το αποτέλεσμα της επιμεριστικής παράστασης:',
      prompt: `Υπολογίστε: ${q2Prompt};`,
      correctVal: q2Answer,
      correctStr: String(q2Answer),
      explanation: `Εφαρμόζουμε την επιμεριστική: (${q2A} · ${q2Tens}) ＋ (${q2A} · ${q2Units}) ＝ ${q2A * q2Tens} ＋ ${q2A * q2Units} ＝ ${formatNumber(q2Answer)}.`
    });
  }

  // Q3 (MCQ): Αντιμεταθετική Ιδιότητα
  {
    const q3A = randInt(25, 95);
    const q3B = randInt(12, 48);
    const q3CorrectStr = `${q3B} · ${q3A}`;
    const q3Wrong1 = `${q3B} ＋ ${q3A}`;
    const q3Wrong2 = `${q3A} ＋ ${q3B}`;
    const q3Wrong3 = `${q3A} － ${q3B}`;

    const rawOptions = [q3CorrectStr, q3Wrong1, q3Wrong2, q3Wrong3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q3CorrectStr
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΑΝΤΙΜΕΤΑΘΕΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      instruction: 'Επιλέξτε την ίση παράσταση σύμφωνα με την αντιμεταθετική ιδιότητα:',
      prompt: `Σύμφωνα με την αντιμεταθετική ιδιότητα, η παράσταση ${q3A} · ${q3B} είναι ίση με:`,
      options,
      correctText: q3CorrectStr,
      explanation: `Η αντιμεταθετική ιδιότητα ορίζει ότι α · β ＝ β · α. Άρα ${q3A} · ${q3B} ＝ ${q3CorrectStr}.`
    });
  }

  // Q4 (MCQ): Προσεταιριστική Ιδιότητα (Έξυπνη ομαδοποίηση)
  {
    const q4PairType = randInt(1, 3);
    let q4A = 25;
    let q4B = 14;
    let q4C = 4;
    if (q4PairType === 1) {
      q4A = 25;
      q4B = randInt(11, 39);
      q4C = 4; // 25 · 4 = 100
    } else if (q4PairType === 2) {
      q4A = 50;
      q4B = randInt(11, 29);
      q4C = 2; // 50 · 2 = 100
    } else {
      q4A = 125;
      q4B = randInt(3, 15);
      q4C = 8; // 125 · 8 = 1000
    }
    const q4Answer = q4A * q4B * q4C;
    const correctStr = formatNumber(q4Answer);

    const rawOptions = [
      correctStr,
      formatNumber(q4Answer + 100),
      formatNumber(Math.max(10, q4Answer - 50)),
      formatNumber(q4Answer * 2)
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === correctStr
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΠΡΟΣΕΤΑΙΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      instruction: 'Υπολογίστε έξυπνα το γινόμενο ομαδοποιώντας κατάλληλα:',
      prompt: `Υπολογίστε: (${q4A} · ${q4B}) · ${q4C};`,
      options,
      correctText: correctStr,
      explanation: `Ομαδοποιούμε πρώτα το (${q4A} · ${q4C}) ＝ ${q4A * q4C}. Στη συνέχεια: ${q4A * q4C} · ${q4B} ＝ ${formatNumber(q4Answer)}.`
    });
  }

  // Q5 (MCQ): True / False - Ουδέτερο και Απορροφητικό Στοιχείο
  {
    const q5Number = randInt(350, 9500);
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? `Ισχύει ότι ${formatNumber(q5Number)} · 1 ＝ ${formatNumber(q5Number)} και ${formatNumber(q5Number)} · 0 ＝ 0.`
      : `Ισχύει ότι ${formatNumber(q5Number)} · 0 ＝ ${formatNumber(q5Number)} επειδή το 0 είναι το ουδέτερο στοιχείο.`;
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΟΥΔΕΤΕΡΟ & ΑΠΟΡΡΟΦΗΤΙΚΟ ΣΤΟΙΧΕΙΟ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Το 1 είναι το ουδέτερο στοιχείο του πολλαπλασιασμού και το 0 είναι το απορροφητικό στοιχείο.'
        : `Λάθος! Το 0 μηδενίζει κάθε αριθμό (${formatNumber(q5Number)} · 0 ＝ 0), ενώ το 1 διατηρεί την αξία του.`
    });
  }

  // Q6 (MCQ): True / False - Επιμεριστική Ιδιότητα
  {
    const q6A = randInt(5, 9);
    const q6B = randInt(10, 30);
    const q6C = randInt(2, 8);
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? `Η έκφραση ${q6A} · (${q6B} ＋ ${q6C}) ισούται πάντα με (${q6A} · ${q6B}) ＋ (${q6A} · ${q6C}).`
      : `Η έκφραση ${q6A} · (${q6B} ＋ ${q6C}) ισούται με (${q6A} ＋ ${q6B}) · (${q6A} ＋ ${q6C}).`;
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΕΠΙΜΕΡΙΣΤΙΚΗΣ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Ο παράγοντας έξω από την παρένθεση πολλαπλασιάζεται ξεχωριστά με κάθε προσθετέο μέσα σε αυτή.'
        : 'Λάθος! Ο σωστός τύπος είναι: α · (β ＋ γ) ＝ (α · β) ＋ (α · γ).'
    });
  }

  // Q7 (Input - Decimal): Οπτικό Πλέγμα Τετραγώνων
  {
    const q7Rows = randInt(3, 7);
    const q7Cols = randInt(4, 9);
    const q7Val = q7Rows * q7Cols;

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΟ ΠΛΕΓΜΑ ΤΕΤΡΑΓΩΝΩΝ',
      instruction: 'Βρείτε το πλήθος των τετραγώνων:',
      prompt: `Πόσα τετραγωνάκια περιέχει ένα πλέγμα με ${q7Rows} γραμμές και ${q7Cols} στήλες;`,
      gridData: { rows: q7Rows, cols: q7Cols },
      correctVal: q7Val,
      correctStr: String(q7Val),
      explanation: `Το πλέγμα έχει ${q7Rows} γραμμές και ${q7Cols} στήλες, άρα περιέχει ${q7Rows} · ${q7Cols} ＝ ${q7Val} τετραγωνάκια.`
    });
  }

  // Q8 (MCQ): Γεωμετρική Επιμεριστική (Εγγύηση Μοναδικότητας)
  {
    const q8H = randInt(3, 6);
    const q8W1 = randInt(4, 8);
    const q8W2 = randInt(2, 5);
    const q8CorrectArea = q8H * (q8W1 + q8W2);
    const correctStr = String(q8CorrectArea);

    const w1 = String(q8H * q8W1 + q8W2);
    const w2 = String((q8H + q8W1) * q8W2);
    const w3 = String(q8CorrectArea + 10);

    const rawOptions = [correctStr, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === correctStr
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΓΕΩΜΕΤΡΙΚΗ ΕΠΙΜΕΡΙΣΤΙΚΗ',
      instruction: 'Επιλέξτε το συνολικό εμβαδόν του ορθογωνίου:',
      prompt: `Ποιο είναι το συνολικό εμβαδόν του ορθογωνίου: ${q8H} · (${q8W1} ＋ ${q8W2});`,
      options,
      correctText: correctStr,
      explanation: `Το συνολικό εμβαδόν είναι ${q8H} · (${q8W1} ＋ ${q8W2}) ＝ (${q8H} · ${q8W1}) ＋ (${q8H} · ${q8W2}) ＝ ${q8H * q8W1} ＋ ${q8H * q8W2} ＝ ${q8CorrectArea}.`
    });
  }

  // Q9 & Q10: Προβλήματα από τη δεξαμενή EXTRA_PROBLEMS_POOL (1 Input, 1 MCQ)
  {
    const shuffledPool = shuffle([...EXTRA_PROBLEMS_POOL]);
    const prob9 = shuffledPool[0].generate();
    const prob10 = shuffledPool[1].generate();

    // Q9 (Input - Decimal) - Χωρίς πίνακα στην εκφώνηση
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 9 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: prob9.text,
      tableData: prob9.tableData,
      correctVal: prob9.correctVal,
      correctStr: prob9.correctStr,
      explanation: prob9.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας - Εγγύηση Μοναδικότητας) - Χωρίς πίνακα στην εκφώνηση
    const val10 = prob10.correctVal;
    const correctStr10 = `${prob10.correctStr} θέσεις`;
    const fake10A = `${formatNumber(val10 + 50)} θέσεις`;
    const fake10B = `${formatNumber(Math.max(10, val10 - 25))} θέσεις`;
    const fake10C = `${formatNumber(val10 + 100)} θέσεις`;

    const rawOptionsQ10 = [correctStr10, fake10A, fake10B, fake10C];
    const optionsQ10 = shuffle([...new Set(rawOptionsQ10)]).map((text) => ({
      text,
      isCorrect: text === correctStr10
    }));

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΥΠΟΛΟΓΙΣΜΟΥ',
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

export default function PollaplasiasmosExercisesPage() {
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
      title="Ασκήσεις: Πολλαπλασιασμός & Ιδιότητες - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στον πολλαπλασιασμό φυσικών αριθμών και τις ιδιότητες για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/06-pollaplasiasmos"
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
              Ασκήσεις &amp; Προβλήματα: Πολλαπλασιασμός &amp; Ιδιότητες
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με πολλαπλασιασμό φυσικών αριθμών, αντιμεταθετική, προσεταιριστική και επιμεριστική ιδιότητα και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
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

                {/* Εκφωνηση (Καθαρο κειμενο χωρις πινακα που προδιδει τη λυση) */}
                <div className="space-y-3 mb-5">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>

                  {/* Οπτικο Πλεγμα για την Q7 */}
                  {q.gridData && (
                    <div className="bg-slate-100 rounded-2xl p-4 my-3 flex justify-center overflow-x-auto">
                      <svg 
                        viewBox={`0 0 ${q.gridData.cols * 22} ${q.gridData.rows * 22}`} 
                        className="w-full max-w-[260px] sm:max-w-xs h-auto bg-white rounded-lg border border-slate-300 shadow-sm p-1 shrink-0 select-none"
                      >
                        {[...Array(q.gridData.rows)].map((_, r) => (
                          <g key={r}>
                            {[...Array(q.gridData.cols)].map((_, c) => (
                              <rect
                                key={c}
                                x={c * 22}
                                y={r * 22}
                                width="20"
                                height="20"
                                rx="3"
                                fill="#f59e0b"
                                stroke="#d97706"
                                strokeWidth="1"
                              />
                            ))}
                          </g>
                        ))}
                      </svg>
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

                {/* Feedback μετα την υποβολη (Εδω εμφανιζεται ο αναλυτικος πινακας δεδομενων) */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-2.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? '🎉 Εξαιρετικά!' : '💡 Μαθηματική Επεξήγηση:'}</span>
                    </div>

                    {/* Οργανωτικός Πίνακας Δεδομένων στην Επεξήγηση */}
                    {q.tableData && (
                      <div className="inline-block max-w-full bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-inner my-1 font-mono text-xs sm:text-sm">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                          <span className="bg-blue-100/70 px-2 py-0.5 rounded-lg text-blue-900 break-words">{q.tableData.col1}</span>
                          <span className="bg-emerald-100/70 px-2 py-0.5 rounded-lg text-emerald-900 break-words">{q.tableData.col2}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                          <span>{q.tableData.r1[0]}</span>
                          <span className="text-indigo-700 font-bold">{q.tableData.r1[1]}</span>
                          <span>{q.tableData.r2[0]}</span>
                          <span className="text-amber-600 font-black">{q.tableData.r2[1]}</span>
                        </div>
                      </div>
                    )}

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

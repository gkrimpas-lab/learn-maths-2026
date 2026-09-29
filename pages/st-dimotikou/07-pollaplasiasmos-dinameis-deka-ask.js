// pages/st-dimotikou/07-pollaplasiasmos-dinameis-deka-ask.js
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

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 3) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Πληρης δεξαμενη θεματικων αντικειμενων καθημερινοτητας
const REAL_WORLD_ITEMS = [
  { item: 'τετράδια για το σχολείο', price: 2.45, unit: '€' },
  { item: 'μπουκάλια νερό', price: 0.50, unit: '€' },
  { item: 'στυλό διαρκείας', price: 1.20, unit: '€' },
  { item: 'πακέτα χαρτί A4', price: 4.85, unit: '€' },
  { item: 'μέτρα ύφασμα', price: 8.50, unit: '€' },
  { item: 'σάντουιτς για το κυλικείο', price: 2.30, unit: '€' },
  { item: 'εισιτήρια λεωφορείου', price: 1.10, unit: '€' },
  { item: 'βιβλία μαθηματικών', price: 9.75, unit: '€' }
];

// Δεξαμενη προβληματων για τις ερωτησεις 9 & 10
const EXTRA_PROBLEMS_POOL = [
  {
    id: 'p_pow10_std_1',
    generate: () => {
      const pricePerItem = 1.45;
      const count = 100;
      const total = Number((pricePerItem * count).toFixed(2));
      return {
        text: `Μια τάξη αγόρασε ${count} εισιτήρια μουσείου προς ${formatNum(pricePerItem)} € το καθένα. Πόσα ευρώ (€) πλήρωσε συνολικά;`,
        tableData: { col1: 'Εισιτήρια', col2: 'Τιμή ανά τεμάχιο', r1: [`${count} τεμάχια`, `${formatNum(pricePerItem)} €`], r2: ['Πολλαπλασιασμός', 'χ €'] },
        correctVal: total,
        correctStr: formatNum(total, 2),
        explanation: `Μετακινούμε την υποδιαστολή 2 θέσεις δεξιά (λόγω των 2 μηδενικών του 100): ${formatNum(pricePerItem)} · 100 ＝ ${formatNum(total, 2)} €.`
      };
    }
  },
  {
    id: 'p_pow10_std_2',
    generate: () => {
      const weightKg = 3450;
      const mult = 0.001; // τόνοι
      const totalT = Number((weightKg * mult).toFixed(3));
      return {
        text: `Ένα φορτηγό μεταφέρει φορτίο ${weightKg} kg. Πόσους τόνους (t) ζυγίζει το φορτίο, αν γνωρίζουμε ότι 1 kg ＝ 0,001 t;`,
        tableData: { col1: 'Βάρος σε κιλά', col2: 'Σχέση σε τόνους', r1: [`${weightKg} kg`, '1 kg ＝ 0,001 t'], r2: ['Πολλαπλασιασμός', 'χ t'] },
        correctVal: totalT,
        correctStr: formatNum(totalT, 3),
        explanation: `Μετακινούμε την υποδιαστολή 3 θέσεις αριστερά: ${weightKg} · 0,001 ＝ ${formatNum(totalT, 3)} t.`
      };
    }
  },
  {
    id: 'p_pow10_std_3',
    generate: () => {
      const rollCm = 850;
      const mult = 0.01; // μέτρα
      const totalM = Number((rollCm * mult).toFixed(2));
      return {
        text: `Μια κορδέλα έχει μήκος ${rollCm} cm. Πόσα μέτρα (m) είναι το μήκος της, αν 1 cm ＝ 0,01 m;`,
        tableData: { col1: 'Μήκος σε εκατοστά', col2: 'Σχέση σε μέτρα', r1: [`${rollCm} cm`, '1 cm ＝ 0,01 m'], r2: ['Πολλαπλασιασμός', 'χ m'] },
        correctVal: totalM,
        correctStr: formatNum(totalM, 2),
        explanation: `Μετακινούμε την υποδιαστολή 2 θέσεις αριστερά: ${rollCm} · 0,01 ＝ ${formatNum(totalM, 2)} m.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];
  const shuffledItems = shuffle(REAL_WORLD_ITEMS);

  // Q1 (Input - Decimal): Πολλαπλασιασμός με 10, 100, 1000
  {
    const q1Int = randInt(3, 85);
    const q1Dec = randInt(1, 9) * 10 + randInt(1, 9);
    const q1Mult = [10, 100, 1000][randInt(0, 2)];
    const q1Val = parseFloat(`${q1Int}.${q1Dec}`);
    const q1RawAns = q1Val * q1Mult;
    const q1Correct = Number(q1RawAns.toFixed(2));
    const q1CorrectStr = formatNum(q1Correct);
    const q1Prompt = `${q1Int},${q1Dec} · ${q1Mult}`;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ 10, 100, 1.000',
      instruction: 'Υπολογίστε το γινόμενο μετακινώντας την υποδιαστολή:',
      prompt: `Υπολογίστε: ${q1Prompt};`,
      correctVal: q1Correct,
      correctStr: q1CorrectStr,
      explanation: `Πολλαπλασιάζοντας με το ${q1Mult}, μετακινούμε την υποδιαστολή ${q1Mult === 10 ? '1 θέση' : q1Mult === 100 ? '2 θέσεις' : '3 θέσεις'} προς τα δεξιά: ${q1Prompt} ＝ ${q1CorrectStr}.`
    });
  }

  // Q2 (Input - Decimal): Πολλαπλασιασμός με 0,1, 0,01, 0,001
  {
    const q2Int = randInt(12, 95);
    const q2Dec = randInt(1, 9);
    const q2Mult = [0.1, 0.01, 0.001][randInt(0, 2)];
    const q2Val = parseFloat(`${q2Int}.${q2Dec}`);
    const q2RawAns = parseFloat((q2Val * q2Mult).toFixed(4));
    const q2Correct = q2RawAns;
    const q2CorrectStr = formatNum(q2RawAns, 4);
    const q2MultStr = formatNum(q2Mult);
    const q2Prompt = `${q2Int},${q2Dec} · ${q2MultStr}`;

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ 0,1, 0,01, 0,001',
      instruction: 'Υπολογίστε το γινόμενο μετακινώντας την υποδιαστολή:',
      prompt: `Υπολογίστε: ${q2Prompt};`,
      correctVal: q2Correct,
      correctStr: q2CorrectStr,
      explanation: `Πολλαπλασιάζοντας με το ${q2MultStr}, μετακινούμε την υποδιαστολή ${q2Mult === 0.1 ? '1 θέση' : q2Mult === 0.01 ? '2 θέσεις' : '3 θέσεις'} προς τα αριστερά: ${q2Prompt} ＝ ${q2CorrectStr}.`
    });
  }

  // Q3 (MCQ): Εύρεση του πολλαπλασιαστή που λείπει
  {
    const q3Int = randInt(2, 65);
    const q3Dec = randInt(1, 9) * 10 + randInt(1, 9);
    const q3ValStr = `${q3Int},${q3Dec}`;
    const q3MultType = randInt(1, 4);
    let q3CorrectMult = '100';
    let q3ResultStr = '';

    if (q3MultType === 1) {
      q3CorrectMult = '10';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) * 10);
    } else if (q3MultType === 2) {
      q3CorrectMult = '100';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) * 100);
    } else if (q3MultType === 3) {
      q3CorrectMult = '1.000';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) * 1000);
    } else {
      q3CorrectMult = '0,1';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) * 0.1, 3);
    }

    const rawOptions = ['10', '100', '1.000', '0,1', '0,01'];
    const filteredOptions = rawOptions.filter((m) => m !== q3CorrectMult).slice(0, 3).concat(q3CorrectMult);
    const options = shuffle([...new Set(filteredOptions)]).map((text) => ({
      text,
      isCorrect: text === q3CorrectMult
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΕΥΡΕΣΗ ΠΟΛΛΑΠΛΑΣΙΑΣΤΗ',
      instruction: 'Βρείτε τον πολλαπλασιαστή που λείπει:',
      prompt: `Στην ισότητα ${q3ValStr} · χ ＝ ${q3ResultStr}, ποιος είναι ο αριθμός χ;`,
      options,
      correctText: q3CorrectMult,
      explanation: `Για να φτάσουμε από το ${q3ValStr} στο ${q3ResultStr}, η υποδιαστολή μετακινήθηκε κατάλληλα. Ο σωστός πολλαπλασιαστής είναι το ${q3CorrectMult}.`
    });
  }

  // Q4 (MCQ): Πρόβλημα Καθημερινότητας (10, 100, 1000 τεμάχια)
  {
    const q4Item = shuffledItems[0];
    const q4Count = [10, 100, 1000][randInt(0, 2)];
    const q4Cost = parseFloat((q4Item.price * q4Count).toFixed(2));
    const q4Correct = `${formatNum(q4Cost, 2)} €`;
    const q4Wrong1 = `${formatNum(q4Cost / 10, 2)} €`;
    const q4Wrong2 = `${formatNum(q4Cost * 10, 2)} €`;
    const q4Wrong3 = `${formatNum(q4Item.price + q4Count, 2)} €`;

    const rawOptions = [q4Correct, q4Wrong1, q4Wrong2, q4Wrong3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q4Correct
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: 'Υπολογίστε το συνολικό κόστος:',
      prompt: `Ένα σχολείο αγόρασε ${q4Count} ${q4Item.item} που κοστίζουν ${formatNum(q4Item.price, 2)} € το καθένα. Πόσο κόστισαν όλα μαζί;`,
      options,
      correctText: q4Correct,
      explanation: `Υπολογίζουμε το συνολικό κόστος: ${q4Count} · ${formatNum(q4Item.price, 2)} € ＝ ${q4Correct}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας μετατόπισης δεξιά (10, 100, 1000)
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Όταν πολλαπλασιάζουμε έναν δεκαδικό αριθμό με το 100, μετακινούμε την υποδιαστολή 2 θέσεις προς τα δεξιά.'
      : 'Όταν πολλαπλασιάζουμε έναν δεκαδικό αριθμό με το 100, μετακινούμε την υποδιαστολή 2 θέσεις προς τα αριστερά.';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΜΕΤΑΤΟΠΙΣΗΣ ΔΕΞΙΑ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Ο πολλαπλασιασμός με 10, 100, 1.000 μεγαλώνει τον αριθμό, άρα η υποδιαστολή μετακινείται δεξιά.'
        : 'Λάθος! Ο πολλαπλασιασμός με το 100 μετακινεί την υποδιαστολή 2 θέσεις προς τα ΔΕΞΙΑ (όχι αριστερά).'
    });
  }

  // Q6 (MCQ): True / False - Κανόνας μετατόπισης αριστερά (0,1, 0,01)
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Ο πολλαπλασιασμός ενός αριθμού με το 0,1 μικραίνει τον αριθμό (είναι ισοδύναμος με διαίρεση διά 10).'
      : 'Ο πολλαπλασιασμός ενός αριθμού με το 0,01 μεγαλώνει τον αριθμό κατά 100 φορές.';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΜΕΤΑΤΟΠΙΣΗΣ ΑΡΙΣΤΕΡΑ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Ο πολλαπλασιασμός με το 0,1 ισοδυναμεί με διαίρεση διά 10, επομένως ο αριθμός μικραίνει.'
        : 'Λάθος! Ο πολλαπλασιασμός με το 0,01 ΜΙΚΡΑΙΝΕΙ τον αριθμό κατά 100 φορές.'
    });
  }

  // Q7 (Input - Decimal): Οπτική Μετατόπιση Υποδιαστολής
  {
    const q7Int = randInt(4, 38);
    const q7Dec = randInt(1, 9);
    const q7Mult = [10, 100][randInt(0, 1)];
    const q7Val = parseFloat(`${q7Int}.${q7Dec}`);
    const q7Ans = q7Val * q7Mult;
    const q7AnsStr = formatNum(q7Ans);

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΜΕΤΑΤΟΠΙΣΗ ΥΠΟΔΙΑΣΤΟΛΗΣ',
      instruction: 'Υπολογίστε το αποτέλεσμα της μετατόπισης με κόμμα:',
      prompt: `Υπολογίστε: ${q7Int},${q7Dec} · ${q7Mult};`,
      startStr: `${q7Int},${q7Dec}`,
      mult: q7Mult,
      correctVal: q7Ans,
      correctStr: q7AnsStr,
      explanation: `Ξεκινώντας από το ${q7Int},${q7Dec} και κάνοντας ${q7Mult === 10 ? '1 άλμα' : '2 άλματα'} δεξιά λόγω του · ${q7Mult}, βρίσκουμε ${q7AnsStr}.`
    });
  }

  // Q8 (MCQ): Αναγνώριση Πράξης από Μετατόπιση (Εγγύηση Μοναδικότητας)
  {
    const q8BaseInt = randInt(25, 85);
    const q8BaseDec = randInt(1, 9);
    const q8StartStr = `${q8BaseInt},${q8BaseDec}`;
    const q8TargetVal = parseFloat((parseFloat(`${q8BaseInt}.${q8BaseDec}`) * 0.01).toFixed(4));
    const q8TargetStr = formatNum(q8TargetVal, 4);
    const q8CorrectMult = '· 0,01';

    const rawOptions = ['· 0,01', '· 100', '· 0,1', '· 1.000'];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8CorrectMult
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΑΝΑΓΝΩΡΙΣΗ ΠΡΑΞΗΣ ΑΠΟ ΜΕΤΑΤΟΠΙΣΗ',
      instruction: 'Επιλέξτε την πράξη που εκτελέστηκε:',
      prompt: `Ποια πράξη μετέτρεψε το ${q8StartStr} σε ${q8TargetStr};`,
      options,
      correctText: q8CorrectMult,
      explanation: `Η υποδιαστολή μετακινήθηκε 2 θέσεις προς τα αριστερά (από ${q8StartStr} σε ${q8TargetStr}), άρα η πράξη είναι ${q8CorrectMult}.`
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
      title: 'ΕΡΩΤΗΣΗ 9 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΜΕ ΔΥΝΑΜΕΙΣ ΤΟΥ 10',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα με κόμμα:',
      prompt: prob9.text,
      tableData: prob9.tableData,
      correctVal: prob9.correctVal,
      correctStr: prob9.correctStr,
      explanation: prob9.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας - Εγγύηση Μοναδικότητας)
    const val10 = prob10.correctVal;
    const correctStr10 = `${prob10.correctStr} t`;
    const fake10A = `${formatNum(val10 * 10, 3)} t`;
    const fake10B = `${formatNum(val10 / 10, 4)} t`;
    const fake10C = `${formatNum(val10 + 1, 3)} t`;

    const rawOptionsQ10 = [correctStr10, fake10A, fake10B, fake10C];
    const optionsQ10 = shuffle([...new Set(rawOptionsQ10)]).map((text) => ({
      text,
      isCorrect: text === correctStr10
    }));

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΜΕΤΑΤΡΟΠΗΣ ΒΑΡΟΥΣ',
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

export default function DinameisDekaExercisesPage() {
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
    let sanitized = rawValue.replace(/\./g, ',');
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
      title="Ασκήσεις: Δυνάμεις του 10 - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στον πολλαπλασιασμό με δυνάμεις του 10 για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/07-pollaplasiasmos-dinameis-deka"
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
              Ασκήσεις &amp; Προβλήματα: Δυνάμεις του 10
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες μετατόπισης υποδιαστολής με 10, 100, 1.000 και 0,1, 0,01, 0,001 και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
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

                  {/* Οπτικη Μετατοπιση για την Q7 */}
                  {q.startStr && q.mult && (
                    <div className="bg-slate-100 rounded-2xl p-4 my-3 flex justify-center overflow-x-auto">
                      <svg viewBox="0 0 300 70" className="w-full max-w-xs h-16 select-none shrink-0 overflow-visible">
                        <defs>
                          <marker
                            id="ask-arrow-right"
                            viewBox="0 0 10 10"
                            refX="6"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                          >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                          </marker>
                        </defs>

                        <text x="50" y="55" fontSize="22" fontWeight="black" fill="#1e293b" fontFamily="monospace">
                          {q.startStr}
                        </text>
                        <path
                          d="M 105 35 Q 165 8 225 35"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
                          markerEnd="url(#ask-arrow-right)"
                        />
                        <text x="165" y="16" fontSize="11" fontWeight="black" textAnchor="middle" fill="#d97706">
                          · {q.mult}
                        </text>
                      </svg>
                    </div>
                  )}

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
                        inputMode="decimal"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500">
                        (Ακέραιος η δεκαδικός με κόμμα)
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

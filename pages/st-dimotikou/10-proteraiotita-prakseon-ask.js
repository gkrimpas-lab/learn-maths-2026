// pages/st-dimotikou/10-proteraiotita-prakseon-ask.js
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

// Πληρης δεξαμενη θεματικων σεναριων καθημερινοτητας
const REAL_WORLD_PROBLEMS = [
  { name: 'Ο Νίκος', item: 'βιβλία', price: 12, wallet: 50, count: 3, unit: '€' },
  { name: 'Η Μαρία', item: 'τετράδια', price: 4, wallet: 30, count: 5, unit: '€' },
  { name: 'Ο Γιώργος', item: 'εισιτήρια', price: 6, wallet: 40, count: 4, unit: '€' },
  { name: 'Η Ελένη', item: 'χυμούς', price: 2, wallet: 20, count: 6, unit: '€' }
];

// Δεξαμενη προβληματων για τις ερωτησεις 9 & 10
const EXTRA_PROBLEMS_POOL = [
  {
    id: 'p_prio_std_1',
    generate: () => {
      const tickets = 4;
      const ticketPrice = 8;
      const popcorn = 3;
      const popcornPrice = 4;
      const wallet = 50;
      const totalCost = tickets * ticketPrice + popcorn * popcornPrice;
      const change = wallet - totalCost;
      return {
        text: `Μια παρέα αγόρασε ${tickets} εισιτήρια σινεμά προς ${ticketPrice} € το καθένα και ${popcorn} ποπ κορν προς ${popcornPrice} € το καθένα. Πλήρωσαν με χαρτονόμισμα των ${wallet} €. Πόσα ρέστα (€) έλαβαν;`,
        tableData: { col1: 'Αγορές', col2: 'Κόστος & Ρέστα', r1: [`${tickets} · ${ticketPrice} € ＋ ${popcorn} · ${popcornPrice} €`, `Σύνολο: ${totalCost} €`], r2: [`Χαρτονόμισμα: ${wallet} €`, `Ρέστα: ${change} €`] },
        correctVal: change,
        correctStr: String(change),
        explanation: `Γράφουμε την αριθμητική παράσταση: ${wallet} － (${tickets} · ${ticketPrice} ＋ ${popcorn} · ${popcornPrice}) ＝ ${wallet} － (${tickets * ticketPrice} ＋ ${popcorn * popcornPrice}) ＝ ${wallet} － ${totalCost} ＝ ${change} €.`
      };
    }
  },
  {
    id: 'p_prio_std_2',
    generate: () => {
      const crates = 5;
      const applesPerCrate = 20;
      const rotten = 8;
      const bags = 6;
      const goodApples = crates * applesPerCrate - rotten;
      const applesPerBag = goodApples / bags;
      return {
        text: `Ένας μανάβης είχε ${crates} τελάρα με ${applesPerCrate} μήλα το καθένα. Αφαίρεσε ${rotten} χαλασμένα μήλα και τα υπόλοιπα τα μοίρασε εξίσου σε ${bags} σακούλες. Πόσα μήλα έβαλε σε κάθε σακούλα;`,
        tableData: { col1: 'Συνολικά & Χαλασμένα', col2: 'Μοίρασμα', r1: [`(${crates} · ${applesPerCrate}) － ${rotten}`, `${goodApples} καλά μήλα`], r2: [`: ${bags} σακούλες`, `${applesPerBag} μήλα / σακούλα`] },
        correctVal: applesPerBag,
        correctStr: String(applesPerBag),
        explanation: `Φτιάχνουμε την παράσταση: (${crates} · ${applesPerCrate} － ${rotten}) : ${bags} ＝ (${crates * applesPerCrate} － ${rotten}) : ${bags} ＝ ${goodApples} : ${bags} ＝ ${applesPerBag} μήλα.`
      };
    }
  },
  {
    id: 'p_prio_std_3',
    generate: () => {
      const initial = 100;
      const b1 = 15;
      const count1 = 2;
      const b2 = 8;
      const count2 = 4;
      const totalCost = b1 * count1 + b2 * count2;
      const remain = initial - totalCost;
      return {
        text: `Από αρχικό ποσό ${initial} € αγοράστηκαν ${count1} μπλούζες προς ${b1} € η καθεμία και ${count2} καπέλα προς ${b2} € το καθένα. Πόσα ευρώ (€) περίσσεψαν;`,
        tableData: { col1: 'Αγορές', col2: 'Υπόλοιπο', r1: [`${count1} · ${b1} € ＋ ${count2} · ${b2} €`, `Σύνολο: ${totalCost} €`], r2: [`Αρχικά: ${initial} €`, `Περίσσεψαν: ${remain} €`] },
        correctVal: remain,
        correctStr: String(remain),
        explanation: `Παράσταση: ${initial} － (${count1} · ${b1} ＋ ${count2} · ${b2}) ＝ ${initial} － (${count1 * b1} ＋ ${count2 * b2}) ＝ ${initial} － ${totalCost} ＝ ${remain} €.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];
  const shuffledProblems = shuffle(REAL_WORLD_PROBLEMS);

  // Q1 (Input - Decimal): Απλή παράσταση χωρίς παρενθέσεις (α ＋ β · γ)
  {
    const q1A = randInt(10, 30);
    const q1B = randInt(2, 6);
    const q1C = randInt(3, 8);
    const q1Answer = q1A + q1B * q1C;
    const q1Prompt = `${q1A} ＋ ${q1B} · ${q1C}`;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΑΠΛΗ ΠΑΡΑΣΤΑΣΗ',
      instruction: 'Υπολογίστε την τιμή της παράστασης τηρώντας την προτεραιότητα:',
      prompt: `Υπολογίστε: ${q1Prompt};`,
      correctVal: q1Answer,
      correctStr: String(q1Answer),
      explanation: `Πρώτα κάνουμε τον πολλαπλασιασμό: ${q1B} · ${q1C} ＝ ${q1B * q1C}. Στη συνέχεια την πρόσθεση: ${q1A} ＋ ${q1B * q1C} ＝ ${q1Answer}.`
    });
  }

  // Q2 (Input - Decimal): Παράσταση με παρενθέσεις (α － β) · γ
  {
    const q2A = randInt(15, 30);
    const q2B = randInt(2, q2A - 5);
    const q2C = randInt(2, 6);
    const q2Answer = (q2A - q2B) * q2C;
    const q2Prompt = `(${q2A} － ${q2B}) · ${q2C}`;

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΠΑΡΑΣΤΑΣΗ ΜΕ ΠΑΡΕΝΘΕΣΗ',
      instruction: 'Υπολογίστε πρώτα την παρένθεση:',
      prompt: `Υπολογίστε: ${q2Prompt};`,
      correctVal: q2Answer,
      correctStr: String(q2Answer),
      explanation: `Πρώτα υπολογίζουμε την παρένθεση: (${q2A} － ${q2B}) ＝ ${q2A - q2B}. Μετά τον πολλαπλασιασμό: ${q2A - q2B} · ${q2C} ＝ ${q2Answer}.`
    });
  }

  // Q3 (MCQ): Αναγνώριση πρώτης πράξης
  {
    const q3A = randInt(20, 50);
    const q3B = randInt(3, 8);
    const q3C = randInt(2, 5);
    const q3D = randInt(1, 10);
    const q3ExprStr = `${q3A} － ${q3B} · ${q3C} ＋ ${q3D}`;
    const q3Correct = `Ο πολλαπλασιασμός (${q3B} · ${q3C})`;

    const rawOptions = [
      `Ο πολλαπλασιασμός (${q3B} · ${q3C})`,
      `Η αφαίρεση (${q3A} － ${q3B})`,
      `Η πρόσθεση (${q3C} ＋ ${q3D})`,
      'Όλες οι πράξεις μαζί'
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q3Correct
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΑΝΑΓΝΩΡΙΣΗ ΠΡΩΤΗΣ ΠΡΑΞΗΣ',
      instruction: 'Επιλέξτε ποια πράξη πρέπει να εκτελεστεί πρώτη:',
      prompt: `Ποια πράξη πρέπει να εκτελέσουμε ΠΡΩΤΑ στην παράσταση: ${q3ExprStr};`,
      options,
      correctText: q3Correct,
      explanation: `Ο πολλαπλασιασμός έχει προτεραιότητα έναντι της πρόσθεσης και της αφαίρεσης. Άρα ξεκινάμε με το ${q3B} · ${q3C}.`
    });
  }

  // Q4 (MCQ): Τιμή παράστασης με πολλαπλές πράξεις: α － β · (γ ＋ δ) (Εγγύηση Μοναδικότητας)
  {
    const q4B = randInt(2, 5);
    const q4C = randInt(3, 7);
    const q4D = randInt(2, 6);
    const q4SubTotal = q4C + q4D;
    const q4Prod = q4B * q4SubTotal;
    const q4A = q4Prod + randInt(5, 20);
    const q4Answer = q4A - q4Prod;
    const q4ExprStr = `${q4A} － ${q4B} · (${q4C} ＋ ${q4D})`;
    const correctStr = String(q4Answer);

    const w1 = String(q4Answer + 10);
    const w2 = String((q4A - q4B) * q4SubTotal);
    const w3 = String(Math.max(1, q4Answer - 4));

    const rawOptions = [correctStr, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === correctStr
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΠΟΛΛΑΠΛΕΣ ΠΡΑΞΕΙΣ',
      instruction: 'Υπολογίστε την τελική τιμή της παράστασης:',
      prompt: `Υπολογίστε: ${q4ExprStr};`,
      options,
      correctText: correctStr,
      explanation: `1) Παρένθεση: ${q4C} ＋ ${q4D} ＝ ${q4SubTotal}. 2) Πολλαπλασιασμός: ${q4B} · ${q4SubTotal} ＝ ${q4Prod}. 3) Αφαίρεση: ${q4A} － ${q4Prod} ＝ ${q4Answer}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας Προτεραιότητας
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Σε μια αριθμητική παράσταση χωρίς παρενθέσεις, εκτελούμε τους πολλαπλασιασμούς και τις διαιρέσεις πριν από τις προσθέσεις και τις αφαιρέσεις.'
      : 'Σε μια αριθμητική παράσταση χωρίς παρενθέσεις, εκτελούμε πάντα τις προσθέσεις και τις αφαιρέσεις πρώτα.';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Οι πολλαπλασιασμοί και οι διαιρέσεις προηγούνται πάντα των προσθέσεων και αφαιρέσεων.'
        : 'Λάθος! Οι προσθέσεις και οι αφαιρέσεις γίνονται ΤΕΛΕΥΤΑΙΕΣ, εκτός αν βρίσκονται μέσα σε παρενθέσεις.'
    });
  }

  // Q6 (MCQ): True / False - Κανόνας Αριστερά ➔ Δεξιά
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Όταν σε μια παράσταση υπάρχουν μόνο προσθέσεις και αφαιρέσεις, τις εκτελούμε με τη σειρά από αριστερά προς τα δεξιά.'
      : 'Όταν σε μια παράσταση υπάρχουν μόνο προσθέσεις και αφαιρέσεις, κάνουμε πάντα πρώτα τις προσθέσεις.';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΑΡΙΣΤΕΡΑ ΠΡΟΣ ΔΕΞΙΑ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Πράξεις με την ίδια προτεραιότητα εκτελούνται διαδοχικά από αριστερά προς τα δεξιά.'
        : 'Λάθος! Δεν προηγείται η πρόσθεση της αφαίρεσης. Εκτελούνται με τη σειρά που εμφανίζονται από αριστερά προς τα δεξιά.'
    });
  }

  // Q7 (Input - Decimal): Πρόβλημα Καθημερινότητας (α － β · γ)
  {
    const p = shuffledProblems[0];
    const q7Answer = p.wallet - p.count * p.price;
    const q7Prompt = `${p.name} είχε ${p.wallet} €. Αγόρασε ${p.count} ${p.item} που κοστίζουν ${p.price} € το καθένα. Πόσα ρέστα πήρε;`;

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: 'Υπολογίστε τα ρέστα εφαρμόζοντας τη σωστή σειρά πράξεων:',
      prompt: q7Prompt,
      correctVal: q7Answer,
      correctStr: String(q7Answer),
      explanation: `Φτιάχνουμε την παράσταση: ${p.wallet} － ${p.count} · ${p.price} ＝ ${p.wallet} － ${p.count * p.price} ＝ ${q7Answer} €.`
    });
  }

  // Q8 (MCQ): Αναγνώριση 1ου σωστού βήματος (Εγγύηση Μοναδικότητας)
  {
    const q8A = randInt(30, 60);
    const q8B = randInt(2, 5);
    const q8C = randInt(3, 8);
    const q8D = randInt(2, 4);
    const q8ExprStr = `${q8A} － (${q8B} ＋ ${q8C}) · ${q8D}`;
    const q8CorrectStep = `${q8A} － ${q8B + q8C} · ${q8D}`;

    const w1 = `${q8A - q8B} ＋ ${q8C} · ${q8D}`;
    const w2 = `${q8A} － (${q8B} ＋ ${q8C * q8D})`;
    const w3 = `${q8A} － ${q8B} ＋ ${q8C * q8D}`;

    const rawOptions = [q8CorrectStep, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8CorrectStep
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΑΝΑΓΝΩΡΙΣΗ 1ΟΥ ΒΗΜΑΤΟΣ',
      instruction: 'Επιλέξτε τη σωστή μορφή της παράστασης μετά το 1ο βήμα:',
      prompt: `Ποιο είναι το σωστό 1ο βήμα για τη λύση της παράστασης: ${q8ExprStr};`,
      options,
      correctText: q8CorrectStep,
      explanation: `Υπολογίζουμε πρώτα την παρένθεση (${q8B} ＋ ${q8C} ＝ ${q8B + q8C}), οπότε η νέα μορφή είναι: ${q8CorrectStep}.`
    });
  }

  // Q9 & Q10: Προβλήματα από τη δεξαμενή EXTRA_PROBLEMS_POOL (1 Input, 1 MCQ)
  {
    const shuffledPool = shuffle([...EXTRA_PROBLEMS_POOL]);
    const prob9 = shuffledPool[0].generate();
    const prob10 = shuffledPool[1].generate();

    // Q9 (Input - Decimal) - Ο πίνακας tableData εμφανίζεται μόνο στο feedback
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΑΓΟΡΑΣ',
      instruction: 'Λύστε το πρόβλημα σχηματίζοντας μία αριθμητική παράσταση:',
      prompt: prob9.text,
      tableData: prob9.tableData,
      correctVal: prob9.correctVal,
      correctStr: prob9.correctStr,
      explanation: prob9.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας) - Ο πίνακας tableData εμφανίζεται μόνο στο feedback
    const val10 = prob10.correctVal;
    const correctStr10 = `${prob10.correctStr} μήλα`;
    const fake10A = `${val10 + 4} μήλα`;
    const fake10B = `${Math.max(1, val10 - 3)} μήλα`;
    const fake10C = `${val10 * 2} μήλα`;

    const rawOptionsQ10 = [correctStr10, fake10A, fake10B, fake10C];
    const optionsQ10 = shuffle([...new Set(rawOptionsQ10)]).map((text) => ({
      text,
      isCorrect: text === correctStr10
    }));

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΚΑΤΑΝΟΜΗΣ & ΠΡΑΞΕΩΝ',
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

export default function ProteraiotitaPrakseonExercisesPage() {
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
      title="Ασκήσεις: Προτεραιότητα Πράξεων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στην προτεραιότητα των πράξεων και τις αριθμητικές παραστάσεις για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/10-proteraiotita-prakseon"
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
              Ασκήσεις &amp; Προβλήματα: Προτεραιότητα Πράξεων
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με αριθμητικές παραστάσεις, παρενθέσεις, αναγνώριση πρώτης πράξης και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
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

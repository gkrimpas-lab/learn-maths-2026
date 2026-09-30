// pages/st-dimotikou/03-arithmoi-dekadika-klasmata-ask.js
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

// Βοηθητικο component κλασματος
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono ${className}`}>
      <span className="border-b-2 border-current px-1 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Δεξαμενη Κανονικων Προβληματων
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_klasm_std_1',
    generate: () => {
      const parts = 100;
      const shaded = randInt(25, 75);
      const decVal = Number((shaded / parts).toFixed(2));
      return {
        text: `Σε ένα τετράγωνο χωρισμένο σε 100 ίσα τετραγωνάκια, χρωματίστηκαν τα ${shaded}. Ποιος δεκαδικός αριθμός εκφράζει το χρωματισμένο μέρος της μονάδας;`,
        tableData: { col1: 'Χρωματισμένα', col2: 'Συνολικά', r1: [`${shaded}`, `${parts}`], r2: ['Δεκαδικό Κλάσμα', `${shaded}/${parts}`] },
        correctVal: decVal,
        correctStr: formatNum(decVal, 2),
        explanation: `Το χρωματισμένο μέρος είναι ${shaded}/100 ＝ ${formatNum(decVal, 2)}.`
      };
    }
  },
  {
    id: 'p_klasm_std_2',
    generate: () => {
      const bottles = 10;
      const capacityL = 0.7; // 7/10
      const totalL = Number((bottles * capacityL).toFixed(1));
      return {
        text: `Γεμίσαμε ${bottles} μπουκάλια με χυμό. Κάθε μπουκάλι χωράει 7/10 του λίτρου. Πόσα λίτρα (λ.) χυμού χρησιμοποιήσαμε συνολικά;`,
        tableData: { col1: 'Μπουκάλια', col2: 'Χωρητικότητα', r1: [`${bottles} μπουκάλια`, '7/10 λ. ＝ 0,7 λ.'], r2: ['Πολλαπλασιασμός', 'χ λ.'] },
        correctVal: totalL,
        correctStr: formatNum(totalL, 1),
        explanation: `7/10 του λίτρου ισούται με 0,7 λ. Για 10 μπουκάλια: 10 · 0,7 ＝ ${formatNum(totalL, 1)} λ.`
      };
    }
  },
  {
    id: 'p_klasm_std_3',
    generate: () => {
      const ribbonM = 1.25;
      const fracNum = 125;
      const fracDen = 100;
      return {
        text: `Μια κορδέλα έχει μήκος ${formatNum(ribbonM)} m. Ποιος είναι ο αριθμητής του δεκαδικού κλάσματος με παρονομαστή το 100 που ισούται με το μήκος της κορδέλας;`,
        tableData: { col1: 'Μήκος', col2: 'Παρονομαστής', r1: [`${formatNum(ribbonM)} m`, `${fracDen}`], r2: ['Αριθμητής', 'χ'] },
        correctVal: fracNum,
        correctStr: String(fracNum),
        explanation: `Ο αριθμός ${formatNum(ribbonM)} έχει 2 δεκαδικά ψηφία, άρα γράφεται ως ${fracNum}/${fracDen}. Ο αριθμητής είναι ${fracNum}.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_klasm_hard_1',
    generate: () => {
      const a = 3;
      const bTenths = 4;
      const cHundr = 5;
      const totalDec = Number((a + bTenths * 0.1 + cHundr * 0.01).toFixed(2));
      const totalNum = a * 100 + bTenths * 10 + cHundr; // 345
      return {
        text: `Ένα μείγμα περιέχει ${a} ακέραιες μονάδες, ${bTenths}/10 της μονάδας και ${cHundr}/100 της μονάδας. Ποιος είναι ο αριθμητής αν γράψουμε όλη την ποσότητα ως δεκαδικό κλάσμα με παρονομαστή το 100;`,
        tableData: { col1: 'Μείγμα', col2: 'Αναγωγή σε εκατοστά', r1: [`${a} μον. ＝ ${a * 100}/100`, `${bTenths}/10 ＝ ${bTenths * 10}/100`], r2: [`${cHundr}/100`, 'Συνολικός Αριθμητής'] },
        correctVal: totalNum,
        correctStr: String(totalNum),
        explanation: `Μετατρέπουμε όλα τα μέρη σε εκατοστά: ${a * 100}/100 ＋ ${bTenths * 10}/100 ＋ ${cHundr}/100 ＝ ${totalNum}/100. Ο αριθμητής είναι το ${totalNum} (που αντιστοιχεί στο ${formatNum(totalDec, 2)}).`
      };
    }
  },
  {
    id: 'p_klasm_hard_2',
    generate: () => {
      const f1Numer = 35; // 35/100 = 0.35
      const f2Dec = 0.4;   // 4/10 = 0.40
      const sum = Number((f1Numer / 100 + f2Dec).toFixed(2));
      return {
        text: `Από ένα ύφασμα χρησιμοποιήθηκαν τα 35/100 του μέτρου το πρωί και άλλα 4/10 του μέτρου το απόγευμα. Πόσα μέτρα (m) υφάσματος χρησιμοποιήθηκαν συνολικά;`,
        tableData: { col1: 'Πρωί', col2: 'Απόγευμα', r1: ['35/100 m ＝ 0,35 m', '4/10 m ＝ 0,40 m'], r2: ['Πρόσθεση', 'χ m'] },
        correctVal: sum,
        correctStr: formatNum(sum, 2),
        explanation: `35/100 ＝ 0,35 m και 4/10 ＝ 40/100 ＝ 0,40 m. Συνολικά: 0,35 ＋ 0,40 ＝ ${formatNum(sum, 2)} m (ή 75/100 m).`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Δεκαδικός σε Δεκαδικό Κλάσμα (Εύρεση Αριθμητή)
  {
    const denomPool = [10, 100, 1000];
    const denom = denomPool[randInt(0, 2)];
    let numer = 0;
    let decStr = '';

    if (denom === 10) {
      numer = randInt(1, 9);
      decStr = `0,${numer}`;
    } else if (denom === 100) {
      numer = randInt(11, 89);
      decStr = `0,${numer}`;
    } else {
      numer = randInt(105, 750);
      decStr = `0,${numer}`;
    }

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΣΕ ΔΕΚΑΔΙΚΟ ΚΛΑΣΜΑ (ΑΡΙΘΜΗΤΗΣ)',
      instruction: 'Συμπληρώστε τον αριθμητή ώστε να ισχύει η ισότητα:',
      prompt: `Στην ισότητα ${decStr} ＝ χ / ${denom}, ποιος είναι ο αριθμητής χ;`,
      correctVal: numer,
      correctStr: String(numer),
      explanation: `Ο αριθμός ${decStr} έχει ${denom === 10 ? '1 δεκαδικό ψηφίο' : denom === 100 ? '2 δεκαδικά ψηφία' : '3 δεκαδικά ψηφία'}, άρα ${decStr} ＝ ${numer} / ${denom}. Ο αριθμητής είναι το ${numer}.`
    });
  }

  // Q2 (Input - Decimal): Μετατροπή Δεκαδικού Κλάσματος σε Δεκαδικό Αριθμό
  {
    const denomType = randInt(1, 3);
    let numer = 0;
    let denom = 10;
    let decAnswer = 0;

    if (denomType === 1) {
      numer = randInt(3, 9);
      denom = 10;
      decAnswer = numer / 10;
    } else if (denomType === 2) {
      numer = randInt(5, 95);
      denom = 100;
      decAnswer = numer / 100;
    } else {
      numer = randInt(12, 650);
      denom = 1000;
      decAnswer = numer / 1000;
    }

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΚΛΑΣΜΑ ΣΕ ΔΕΚΑΔΙΚΟ ΑΡΙΘΜΟ',
      instruction: 'Γράψτε το κλάσμα ως δεκαδικό αριθμό με κόμμα:',
      prompt: `Ποιος δεκαδικός αριθμός ισούται με το δεκαδικό κλάσμα ${numer} / ${denom};`,
      correctVal: decAnswer,
      correctStr: formatNum(decAnswer, denom === 10 ? 1 : denom === 100 ? 2 : 3),
      explanation: `Διαιρώντας το ${numer} με το ${denom} μετακινούμε την υποδιαστολή ${denom === 10 ? '1 θέση' : denom === 100 ? '2 θέσεις' : '3 θέσεις'} αριστερά: ${numer} : ${denom} ＝ ${formatNum(decAnswer, denom === 10 ? 1 : denom === 100 ? 2 : 3)}.`
    });
  }

  // Q3 (MCQ): Επιλογή ισοδύναμου δεκαδικού κλάσματος
  {
    const tenthsDigit = randInt(2, 8);
    const decVal = tenthsDigit / 10;
    const decStr = formatNum(decVal, 1);
    const correctFrac = `${tenthsDigit * 10}/100`;

    const rawOptions = [
      correctFrac,
      `${tenthsDigit}/100`,
      `${tenthsDigit * 10}/10`,
      `${tenthsDigit * 100}/100`
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === correctFrac
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΙΣΟΔΥΝΑΜΑ ΔΕΚΑΔΙΚΑ ΚΛΑΣΜΑΤΑ',
      instruction: 'Επιλέξτε το σωστό ισοδύναμο κλάσμα:',
      prompt: `Ποιο από τα παρακάτω δεκαδικά κλάσματα είναι ίσο με τον αριθμό ${decStr};`,
      options,
      correctText: correctFrac,
      explanation: `Το ${decStr} ισούται με ${tenthsDigit}/10. Πολλαπλασιάζοντας αριθμητή και παρονομαστή με το 10, προκύπτει το ισοδύναμο κλάσμα ${correctFrac}.`
    });
  }

  // Q4 (MCQ): Σύγκριση Δεκαδικού με Δεκαδικό Κλάσμα (Εγγύηση Μοναδικότητας)
  {
    const tenths = randInt(4, 8);
    const fracStr = `${tenths * 10}/100`;
    const correctDec = (tenths / 10).toFixed(2).replace('.', ',');
    const w1 = ((tenths + 1) / 10).toFixed(1).replace('.', ',');
    const w2 = ((tenths - 2) / 10).toFixed(1).replace('.', ',');
    const w3 = `0,0${tenths}`;

    const rawOptions = [correctDec, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === correctDec
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΣΥΓΚΡΙΣΗ & ΙΣΟΔΥΝΑΜΙΑ',
      instruction: 'Επιλέξτε τον ίσο δεκαδικό αριθμό:',
      prompt: `Ποιος δεκαδικός αριθμός είναι ίσος με το δεκαδικό κλάσμα ${fracStr};`,
      options,
      correctText: correctDec,
      explanation: `Το κλάσμα ${fracStr} απλοποιείται σε ${tenths}/10 ＝ ${correctDec}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας των Μηδενικών
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Στο κλάσμα 45/100, ο παρονομαστής έχει 2 μηδενικά, άρα ο δεκαδικός αριθμός (0,45) έχει ακριβώς 2 δεκαδικά ψηφία.'
      : 'Στο κλάσμα 45/100, ο παρονομαστής έχει 2 μηδενικά, άρα ο δεκαδικός αριθμός θα είναι το 4,5 (1 δεκαδικό ψηφίο).';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΤΩΝ ΜΗΔΕΝΙΚΩΝ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Το πλήθος των μηδενικών στον δεκαδικό παρονομαστή καθορίζει ακριβώς το πλήθος των δεκαδικών ψηφίων.'
        : 'Λάθος! 45/100 σημαίνει 2 μηδενικά στον παρονομαστή, άρα 2 δεκαδικά ψηφία: 0,45.'
    });
  }

  // Q6 (MCQ): True / False - Ισοδυναμία Μορφών
  {
    const num = randInt(2, 7);
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? `Τα κλάσματα ${num}/10 και ${num * 10}/100 εκφράζουν ακριβώς την ίδια ποσότητα (0,${num}).`
      : `Το κλάσμα ${num * 10}/100 είναι 10 φορές μεγαλύτερο από το κλάσμα ${num}/10.`;
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΙΣΟΔΥΝΑΜΙΑ ΜΟΡΦΩΝ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Προσθέτοντας ένα μηδενικό στον αριθμητή και στον παρονομαστή η αξία παραμένει ακριβώς η ίδια.'
        : `Λάθος! ${num}/10 και ${num * 10}/100 είναι ισοδύναμα κλάσματα (εκφράζουν και τα δύο το 0,${num}).`
    });
  }

  // Q7 (Input - Decimal): Οπτική Λωρίδα Δεκάτων
  {
    const count = randInt(2, 8);
    const decVal = count / 10;
    const decStr = formatNum(decVal, 1);

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΛΩΡΙΔΑ ΔΕΚΑΤΩΝ',
      instruction: 'Γράψτε τον δεκαδικό αριθμό με κόμμα:',
      prompt: `Σε μια λωρίδα χωρισμένη σε 10 ίσα μέρη, έχουν χρωματιστεί τα ${count}. Ποιον δεκαδικό αριθμό εκφράζει το χρωματισμένο μέρος;`,
      correctVal: decVal,
      correctStr: decStr,
      explanation: `Έχουν χρωματιστεί ${count} από τα 10 ίσα μέρη, δηλαδή ${count}/10 ＝ ${decStr}.`
    });
  }

  // Q8 (MCQ): Οπτικό Πλέγμα Εκατοστών (Εγγύηση Μοναδικότητας)
  {
    const tens = randInt(2, 6);
    const units = randInt(1, 8);
    const totalSquares = tens * 10 + units;
    const decCorrect = (totalSquares / 100).toFixed(2).replace('.', ',');
    const w1 = (totalSquares / 10).toFixed(1).replace('.', ',');
    const w2 = `0,0${totalSquares}`;
    const w3 = ((totalSquares + 10) / 100).toFixed(2).replace('.', ',');

    const rawOptions = [decCorrect, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === decCorrect
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΟΠΤΙΚΟ ΠΛΕΓΜΑ ΕΚΑΤΟΣΤΩΝ',
      instruction: 'Επιλέξτε τον σωστό δεκαδικό αριθμό:',
      prompt: `Σε ένα πλέγμα 100 τετραγώνων έχουν χρωματιστεί ${totalSquares} τετραγωνάκια. Ποιον δεκαδικό αριθμό δείχνει το πλέγμα;`,
      options,
      correctText: decCorrect,
      explanation: `Στο πλέγμα 100 κουτιών έχουν χρωματιστεί ${totalSquares} κουτάκια, άρα ${totalSquares}/100 ＝ ${decCorrect}.`
    });
  }

  // Q9 & Q10: Προβλήματα από τη δεξαμενή (1 Input, 1 MCQ)
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate();
    const hardProb = shuffledHard[0].generate();

    // Q9 (Input - Decimal) - Χωρίς πίνακα στην εκφώνηση
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 9 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΚΛΑΣΜΑΤΩΝ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      correctVal: stdProb.correctVal,
      correctStr: stdProb.correctStr,
      explanation: stdProb.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας) - Χωρίς πίνακα στην εκφώνηση
    const val10 = hardProb.correctVal;
    const correctStr10 = `${hardProb.correctStr} m`;
    const fake10A = `${formatNum(val10 + 0.2, 2)} m`;
    const fake10B = `${formatNum(Math.max(0.1, val10 - 0.2), 2)} m`;
    const fake10C = `${formatNum(val10 + 0.45, 2)} m`;

    const rawOptionsQ10 = [correctStr10, fake10A, fake10B, fake10C];
    const optionsQ10 = shuffle([...new Set(rawOptionsQ10)]).map((text) => ({
      text,
      isCorrect: text === correctStr10
    }));

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΜΕΤΑΤΡΟΠΗΣ & ΠΡΟΣΘΕΣΗΣ',
      instruction: 'Επιλέξτε το σωστό συνολικό μήκος:',
      prompt: hardProb.text,
      tableData: hardProb.tableData,
      options: optionsQ10,
      correctText: correctStr10,
      explanation: hardProb.explanation
    });
  }

  return qList;
}

export default function MetatropiExercisesPage() {
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
      title="Ασκήσεις: Δεκαδικοί & Κλάσματα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στη μετατροπή δεκαδικών αριθμών σε δεκαδικά κλάσματα και το αντίστροφο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/03-arithmoi-dekadika-klasmata"
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
              Ασκήσεις &amp; Προβλήματα: Δεκαδικοί &amp; Κλάσματα
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες μετατροπής δεκαδικών αριθμών σε δεκαδικά κλάσματα και το αντίστροφο, οπτικές αναπαραστάσεις μονάδας και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
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

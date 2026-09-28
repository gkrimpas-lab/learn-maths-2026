// pages/st-dimotikou/02-dekadikoi-ask.js
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

// Δεξαμενη Κανονικων Προβληματων Δεκαδικων
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_dec_std_1',
    generate: () => {
      const p1 = 2.45;
      const p2 = 3.8;
      const sum = Number((p1 + p2).toFixed(2));
      return {
        text: `Ένα παντοπωλείο πούλησε ${formatNum(p1)} kg μήλα και ${formatNum(p2)} kg πορτοκάλια. Πόσα κιλά (kg) φρούτων πούλησε συνολικά;`,
        tableData: { col1: 'Μήλα', col2: 'Πορτοκάλια', r1: [`${formatNum(p1)} kg`, `${formatNum(p2)} kg`], r2: ['Πρόσθεση', 'χ kg'] },
        correctVal: sum,
        correctStr: formatNum(sum),
        explanation: `Προσθέτουμε ευθυγραμμίζοντας τις υποδιαστολές: ${formatNum(p1)} ＋ ${formatNum(p2)} ＝ ${formatNum(sum)} kg.`
      };
    }
  },
  {
    id: 'p_dec_std_2',
    generate: () => {
      const initialM = 10;
      const usedM = 3.65;
      const remain = Number((initialM - usedM).toFixed(2));
      return {
        text: `Από ένα ύφασμα μήκους ${initialM} m, κόπηκε ένα κομμάτι μήκους ${formatNum(usedM)} m. Πόσα μέτρα (m) υφάσματος έμειναν;`,
        tableData: { col1: 'Αρχικό Μήκος', col2: 'Κομμάτι που κόπηκε', r1: [`${initialM} m`, `${formatNum(usedM)} m`], r2: ['Αφαίρεση', 'χ m'] },
        correctVal: remain,
        correctStr: formatNum(remain),
        explanation: `Συμπληρώνουμε μηδενικά στο ακέραιο μέρος: 10,00 － ${formatNum(usedM)} ＝ ${formatNum(remain)} m.`
      };
    }
  },
  {
    id: 'p_dec_std_3',
    generate: () => {
      const pricePerL = 1.85;
      const liters = 4;
      const totalCost = Number((pricePerL * liters).toFixed(2));
      return {
        text: `Αγοράσαμε ${liters} λίτρα γάλα προς ${formatNum(pricePerL)} € το λίτρο. Πόσα ευρώ (€) πληρώσαμε;`,
        tableData: { col1: 'Λίτρα Γάλακτος', col2: 'Τιμή ανά λίτρο', r1: [`${liters} λ.`, `${formatNum(pricePerL)} €`], r2: ['Πολλαπλασιασμός', 'χ €'] },
        correctVal: totalCost,
        correctStr: formatNum(totalCost),
        explanation: `Πολλαπλασιάζουμε: ${liters} · ${formatNum(pricePerL)} ＝ ${formatNum(totalCost)} €.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_dec_hard_1',
    generate: () => {
      const note50 = 50;
      const b1 = 14.85;
      const b2 = 18.40;
      const b3 = 6.25;
      const totalSpent = Number((b1 + b2 + b3).toFixed(2));
      const change = Number((note50 - totalSpent).toFixed(2));
      return {
        text: `Ένας πελάτης αγόρασε τρία είδη αξίας ${formatNum(b1)} €, ${formatNum(b2)} € και ${formatNum(b3)} €. Πλήρωσε με χαρτονόμισμα των 50 €. Πόσα ρέστα (€) έλαβε;`,
        tableData: { col1: 'Τρία Είδη', col2: 'Πληρωμή & Ρέστα', r1: [`${formatNum(b1)} € ＋ ${formatNum(b2)} €`, `＋ ${formatNum(b3)} €`], r2: [`Σύνολο: ${formatNum(totalSpent)} €`, 'Ρέστα από 50 €'] },
        correctVal: change,
        correctStr: formatNum(change),
        explanation: `Υπολογίζουμε το συνολικό κόστος: ${formatNum(b1)} ＋ ${formatNum(b2)} ＋ ${formatNum(b3)} ＝ ${formatNum(totalSpent)} €. Αφαιρούμε από τα 50 €: 50,00 － ${formatNum(totalSpent)} ＝ ${formatNum(change)} €.`
      };
    }
  },
  {
    id: 'p_dec_hard_2',
    generate: () => {
      const lengthM = 8.4;
      const widthM = 5.25;
      const perim = Number((2 * (lengthM + widthM)).toFixed(2));
      return {
        text: `Ένα ορθογώνιο δωμάτιο έχει μήκος ${formatNum(lengthM)} m και πλάτος ${formatNum(widthM)} m. Πόσα μέτρα (m) είναι η περίμετρος του δωματίου;`,
        tableData: { col1: 'Διαστάσεις', col2: 'Περίμετρος', r1: [`Μήκος: ${formatNum(lengthM)} m`, `Πλάτος: ${formatNum(widthM)} m`], r2: ['2 · (μήκος ＋ πλάτος)', 'χ m'] },
        correctVal: perim,
        correctStr: formatNum(perim),
        explanation: `Υπολογίζουμε: 2 · (${formatNum(lengthM)} ＋ ${formatNum(widthM)}) ＝ 2 · ${formatNum(lengthM + widthM)} ＝ ${formatNum(perim)} m.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Αξία δεκαδικού ψηφίου (δέκατα, εκατοστά, χιλιοστά)
  {
    const q1Int = randInt(12, 85);
    const q1D = randInt(1, 9);
    const q1E = randInt(1, 9);
    const q1X = randInt(1, 9);
    const q1DecPositions = [
      { name: 'δεκάτων', digit: q1D, valStr: `0,${q1D}`, valNum: q1D / 10 },
      { name: 'εκατοστών', digit: q1E, valStr: `0,0${q1E}`, valNum: q1E / 100 },
      { name: 'χιλιοστών', digit: q1X, valStr: `0,00${q1X}`, valNum: q1X / 1000 }
    ];
    const q1Choice = q1DecPositions[randInt(0, 2)];
    const q1FullNumStr = `${q1Int},${q1D}${q1E}${q1X}`;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΑΞΙΑ ΔΕΚΑΔΙΚΟΥ ΨΗΦΙΟΥ',
      instruction: 'Γράψτε την αριθμητική αξία του ψηφίου σε δεκαδική μορφή (π.χ. 0,5 ή 0,05):',
      prompt: `Στον δεκαδικό αριθμό ${q1FullNumStr}, ποια είναι η αξία του ψηφίου των ${q1Choice.name} (${q1Choice.digit});`,
      correctVal: q1Choice.valNum,
      correctStr: q1Choice.valStr,
      explanation: `Το ψηφίο ${q1Choice.digit} βρίσκεται στη θέση των ${q1Choice.name}, άρα η αξία του είναι ${q1Choice.valStr}.`
    });
  }

  // Q2 (Input - Decimal): Μετατροπή Δεκαδικού Κλάσματος σε Δεκαδικό Αριθμό
  {
    const q2DenomType = randInt(1, 3);
    let q2Numer = 0;
    let q2AnswerStr = '';
    let q2Denom = 10;
    let q2Val = 0;

    if (q2DenomType === 1) {
      q2Numer = randInt(15, 95);
      q2Denom = 10;
      q2Val = q2Numer / 10;
      q2AnswerStr = formatNum(q2Val, 1);
    } else if (q2DenomType === 2) {
      q2Numer = randInt(105, 995);
      q2Denom = 100;
      q2Val = q2Numer / 100;
      q2AnswerStr = formatNum(q2Val, 2);
    } else {
      q2Numer = randInt(1025, 9850);
      q2Denom = 1000;
      q2Val = q2Numer / 1000;
      q2AnswerStr = formatNum(q2Val, 3);
    }

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΔΕΚΑΔΙΚΟ ΚΛΑΣΜΑ ΣΕ ΔΕΚΑΔΙΚΟ',
      instruction: 'Γράψτε το κλάσμα ως δεκαδικό αριθμό με κόμμα:',
      prompt: `Ποιος δεκαδικός αριθμός ισούται με το κλάσμα ${q2Numer} / ${q2Denom};`,
      correctVal: q2Val,
      correctStr: q2AnswerStr,
      explanation: `Διαιρώντας τον αριθμητή με το ${q2Denom}, μετακινούμε την υποδιαστολή ${q2Denom === 10 ? '1 θέση' : q2Denom === 100 ? '2 θέσεις' : '3 θέσεις'} αριστερά: ${q2Numer} : ${q2Denom} ＝ ${q2AnswerStr}.`
    });
  }

  // Q3 (MCQ): Σύνθεση δεκαδικού από αναπτυγμένη μορφή
  {
    const q3M = randInt(2, 9);
    const q3D = randInt(1, 9);
    const q3E = randInt(1, 9);
    const q3CorrectStr = `${q3M * 10},${q3D}${q3E}`;
    const q3Wrong1 = `${q3M},${q3D}${q3E}`;
    const q3Wrong2 = `${q3M * 10},0${q3D}${q3E}`;
    const q3Wrong3 = `${q3M * 100},${q3D}${q3E}`;

    const rawOptions = [q3CorrectStr, q3Wrong1, q3Wrong2, q3Wrong3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q3CorrectStr
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΣΥΝΘΕΣΗ ΔΕΚΑΔΙΚΟΥ ΑΡΙΘΜΟΥ',
      instruction: 'Επιλέξτε τον σωστό δεκαδικό αριθμό:',
      prompt: `Ποιος δεκαδικός προκύπτει από την πράξη: (${q3M} · 10) ＋ (${q3D} · 0,1) ＋ (${q3E} · 0,01);`,
      options,
      correctText: q3CorrectStr,
      explanation: `Υπολογίζοντας τα επιμέρους γινόμενα: ${q3M * 10} ＋ 0,${q3D} ＋ 0,0${q3E} ＝ ${q3CorrectStr}.`
    });
  }

  // Q4 (MCQ): Σύγκριση / Διάταξη δεκαδικών αριθμών
  {
    const q4BaseInt = randInt(14, 48);
    const o1 = `${q4BaseInt},8`;
    const o2 = `${q4BaseInt},75`;
    const o3 = `${q4BaseInt},095`;
    const o4 = `${q4BaseInt},705`;

    const rawOptions = [o1, o2, o3, o4];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === o1
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΣΥΓΚΡΙΣΗ ΔΕΚΑΔΙΚΩΝ',
      instruction: 'Επιλέξτε τον μεγαλύτερο αριθμό:',
      prompt: 'Ποιος από τους παρακάτω δεκαδικούς αριθμούς είναι ο μεγαλύτερος;',
      options,
      correctText: o1,
      explanation: `Συγκρίνοντας πρώτα τα δέκατα και μετά τα εκατοστά, ο μεγαλύτερος αριθμός είναι το ${o1} (αφού 8 δέκατα ＝ 0,800 > 0,750 > 0,705 > 0,095).`
    });
  }

  // Q5 (MCQ): True / False - Μηδενικά στο τέλος του δεκαδικού μέρους
  {
    const q5Int = randInt(3, 18);
    const q5Dec = randInt(2, 8);
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? `Οι δεκαδικοί αριθμοί ${q5Int},${q5Dec} και ${q5Int},${q5Dec}00 έχουν ακριβώς την ίδια αξία.`
      : `Ο αριθμός ${q5Int},${q5Dec}00 είναι 100 φορές μεγαλύτερος από τον αριθμό ${q5Int},${q5Dec}.`;
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΙΣΟΔΥΝΑΜΟΙ ΔΕΚΑΔΙΚΟΙ & ΜΗΔΕΝΙΚΑ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Η προσθήκη ή αφαίρεση μηδενικών στο τέλος του δεκαδικού μέρους δεν αλλάζει την αξία του αριθμού.'
        : 'Λάθος! Τα τελικά μηδενικά στο δεκαδικό μέρος δεν μεταβάλλουν την αξία (π.χ. 5,4 ＝ 5,40 ＝ 5,400).'
    });
  }

  // Q6 (MCQ): True / False - Σχέση δεκάτων και εκατοστών
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? '1 δέκατο (0,1) ισοδυναμεί με 10 εκατοστά (0,10) και με 100 χιλιοστά (0,100).'
      : '1 εκατοστό (0,01) είναι 10 φορές μεγαλύτερο από 1 δέκατο (0,1).';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΣΧΕΣΕΙΣ ΔΕΚΑΔΙΚΩΝ ΜΟΝΑΔΩΝ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Κάθε δεκαδική μονάδα είναι 10 φορές μεγαλύτερη από την αμέσως δεξιά της (1 δέκατο ＝ 10 εκατοστά ＝ 100 χιλιοστά).'
        : 'Λάθος! Το 1 δέκατο (0,1) είναι 10 φορές ΜΕΓΑΛΥΤΕΡΟ (και όχι μικρότερο) από το 1 εκατοστό (0,01).'
    });
  }

  // Q7 & Q8: Κανονικά Προβλήματα από τη δεξαμενή (1 Input, 1 MCQ)
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const stdProb1 = shuffledStd[0].generate();
    const stdProb2 = shuffledStd[1].generate();

    // Q7 (Input - Decimal)
    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΔΕΚΑΔΙΚΩΝ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα με κόμμα:',
      prompt: stdProb1.text,
      tableData: stdProb1.tableData,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ - Αριθμογραμμή με Εγγύηση Μοναδικότητας Επιλογών)
    const q8Step = randInt(1, 9);
    const q8CorrectVal = (3 + q8Step * 0.1).toFixed(1).replace('.', ',');
    const w1 = (3 + (q8Step === 9 ? 7 : q8Step + 1) * 0.1).toFixed(1).replace('.', ',');
    const w2 = (3 + (q8Step === 1 ? 3 : q8Step - 1) * 0.1).toFixed(1).replace('.', ',');
    const w3 = `3,0${q8Step}`;

    const rawOptionsQ8 = [q8CorrectVal, w1, w2, w3];
    const optionsQ8 = shuffle([...new Set(rawOptionsQ8)]).map((text) => ({
      text,
      isCorrect: text === q8CorrectVal
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΔΕΚΑΔΙΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ',
      instruction: 'Επιλέξτε τον δεκαδικό αριθμό που δείχνει ο κόκκινος δείκτης:',
      prompt: `Στην αριθμογραμμή μεταξύ του 3,0 και του 4,0, ποιος αριθμός βρίσκεται ${q8Step} δέκατα μετά το 3,0;`,
      options: optionsQ8,
      correctText: q8CorrectVal,
      explanation: `Ο δείκτης βρίσκεται ${q8Step} υποδιαιρέσεις (δέκατα) μετά το 3,0, άρα αντιστοιχεί στο ${q8CorrectVal}.`
    });
  }

  // Q9 & Q10: Προβλήματα Αυξημένης Δυσκολίας (1 Input, 1 MCQ)
  {
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const hardProb1 = shuffledHard[0].generate();
    const hardProb2 = shuffledHard[1].generate();

    // Q9 (Input - Decimal)
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΣΥΝΑΛΛΑΓΗΣ',
      instruction: 'Υπολογίστε τα ρέστα σε ευρώ (€) με κόμμα:',
      prompt: hardProb1.text,
      tableData: hardProb1.tableData,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal;
    const fake10A = formatNum(val10 + 2.5);
    const fake10B = formatNum(Math.max(1, val10 - 1.5));
    const fake10C = formatNum(val10 * 1.2);

    const rawOptionsQ10 = [
      `${formatNum(val10)} m`,
      `${fake10A} m`,
      `${fake10B} m`,
      `${fake10C} m`
    ];
    const optionsQ10 = shuffle([...new Set(rawOptionsQ10)]).map((text) => ({
      text,
      isCorrect: text === `${formatNum(val10)} m`
    }));

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΠΕΡΙΜΕΤΡΟΣ ΜΕ ΔΕΚΑΔΙΚΟΥΣ ΑΡΙΘΜΟΥΣ',
      instruction: 'Επιλέξτε τη σωστή τιμή περιμέτρου:',
      prompt: hardProb2.text,
      tableData: hardProb2.tableData,
      options: optionsQ10,
      correctText: `${formatNum(val10)} m`,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function DekadikoiExercisesPage() {
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
      title="Ασκήσεις: Δεκαδικοί Αριθμοί - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στους δεκαδικούς αριθμούς, τα δεκαδικά κλάσματα, τη σύγκριση και την αξία θέσης για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/02-dekadikoi"
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
              Ασκήσεις &amp; Προβλήματα: Δεκαδικοί Αριθμοί
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με δέκατα, εκατοστά, χιλιοστά, μετατροπές δεκαδικών κλασμάτων και 4 ρεαλιστικά προβλήματα συναλλαγών και περιμέτρων. Συμπληρώστε τις απαντήσεις σας και ελέγξτε την επίδοσή σας.
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

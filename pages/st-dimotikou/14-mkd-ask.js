// pages/st-dimotikou/14-mkd-ask.js
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

// Ευρεση ολων των διαιρετων
function getDivisors(num) {
  const divs = [];
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) divs.push(i);
  }
  return divs;
}

// Υπολογισμος Μ.Κ.Δ. με τον αλγοριθμο του Ευκλειδη
function getGCD(a, b) {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Δεξαμενη θεματικων σεναριων καθημερινοτητας με πληρη γραμματικη και συντακτικη ακριβεια
const REAL_WORLD_PRESETS = [
  {
    profession: 'Ένας μανάβης',
    item1: 'μήλα',
    item2: 'πορτοκάλια',
    groupName: 'καλάθια',
    questionText: 'Πόσα πανομοιότυπα καλάθια μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα;'
  },
  {
    profession: 'Ένας βιβλιοπώλης',
    item1: 'τετράδια',
    item2: 'μολύβια',
    groupName: 'σετ δώρων',
    questionText: 'Πόσα πανομοιότυπα σετ δώρων μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα;'
  },
  {
    profession: 'Ένας ανθοπώλης',
    item1: 'τριαντάφυλλα',
    item2: 'μαργαρίτες',
    groupName: 'ανθοδέσμες',
    questionText: 'Πόσες πανομοιότυπες ανθοδέσμες μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα;'
  },
  {
    profession: 'Ένας προπονητής',
    item1: 'μπάλες ποδοσφαίρου',
    item2: 'μπάλες μπάσκετ',
    groupName: 'σάκους',
    questionText: 'Πόσους πανομοιότυπους σάκους μπορεί να φτιάξει το πολύ χωρίς να περισσέψει καμία μπάλα;'
  },
  {
    profession: 'Ένας παντοπώλης',
    item1: 'σοκολατάκια',
    item2: 'καραμέλες',
    groupName: 'πακέτα',
    questionText: 'Πόσα πανομοιότυπα πακέτα μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα;'
  }
];

// Δεξαμενη προβληματων για τις ερωτησεις 9 & 10
const EXTRA_PROBLEMS_POOL = [
  {
    id: 'p_mkd_std_1',
    generate: () => {
      const redRibbon = 36;
      const blueRibbon = 48;
      const maxCut = getGCD(redRibbon, blueRibbon);
      return {
        text: `Μια μοδίστρα έχει δύο κορδέλες μήκους ${redRibbon} εκ. και ${blueRibbon} εκ. Θέλει να τις κόψει σε ίσα κομμάτια με το μεγαλύτερο δυνατό μήκος χωρίς να περισσέψει καθόλου ύφασμα. Ποιο είναι το μέγιστο μήκος (σε εκ.) κάθε κομματιού;`,
        tableData: { col1: 'Μήκη Κορδελών', col2: 'Μέγιστο Ίσο Μήκος', r1: [`${redRibbon} εκ. & ${blueRibbon} εκ.`, 'Μ.Κ.Δ.(36, 48)'], r2: ['Υπολογισμός', `${maxCut} εκ.`] },
        correctVal: maxCut,
        correctStr: String(maxCut),
        explanation: `Αναζητούμε το μέγιστο κοινό μέγεθος, δηλαδή τον Μ.Κ.Δ. των 36 και 48: Μ.Κ.Δ.(36, 48) ＝ ${maxCut} εκ.`
      };
    }
  },
  {
    id: 'p_mkd_std_2',
    generate: () => {
      const cheesePies = 40;
      const spinachPies = 60;
      const maxBoxes = getGCD(cheesePies, spinachPies);
      return {
        text: `Ένα κυλικείο έψησε ${cheesePies} τυροπιτάκια και ${spinachPies} σπανακοπιτάκια. Θέλει να τα μοιράσει σε πανομοιότυπες συσκευασίες χωρίς να περισσέψει κανένα. Πόσες τέτοιες συσκευασίες μπορεί να ετοιμάσει το πολύ;`,
        tableData: { col1: 'Προϊόντα', col2: 'Μέγιστες Συσκευασίες', r1: [`${cheesePies} τυρ. & ${spinachPies} σπαν.`, 'Μ.Κ.Δ.(40, 60)'], r2: ['Υπολογισμός', `${maxBoxes} συσκευασίες`] },
        correctVal: maxBoxes,
        correctStr: String(maxBoxes),
        explanation: `Ο μέγιστος αριθμός πανομοιότυπων συσκευασιών αντιστοιχεί στον Μ.Κ.Δ.(40, 60) ＝ ${maxBoxes} συσκευασίες.`
      };
    }
  },
  {
    id: 'p_mkd_std_3',
    generate: () => {
      const notebooks = 45;
      const pens = 75;
      const maxPacks = getGCD(notebooks, pens);
      return {
        text: `Ένα βιβλιοπωλείο διαθέτει ${notebooks} τετράδια και ${pens} στυλό. Θέλει να φτιάξει όμοια πακέτα γραφικής ύλης για μαθητές. Πόσα τέτοια πακέτα μπορεί να δημιουργήσει το μέγιστο;`,
        tableData: { col1: 'Υλικά', col2: 'Μέγιστα Πακέτα', r1: [`${notebooks} τετράδια & ${pens} στυλό`, 'Μ.Κ.Δ.(45, 75)'], r2: ['Υπολογισμός', `${maxPacks} πακέτα`] },
        correctVal: maxPacks,
        correctStr: String(maxPacks),
        explanation: `Ο μέγιστος αριθμός πακέτων ισούται με τον Μ.Κ.Δ. των 45 και 75: Μ.Κ.Δ.(45, 75) ＝ ${maxPacks} πακέτα.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];
  const shuffledPresets = shuffle(REAL_WORLD_PRESETS);

  // Q1 (Input - Decimal): Μ.Κ.Δ. 2 αριθμών
  {
    const q1Pool = [
      [12, 18], [15, 20], [24, 36], [20, 30], [16, 24], [18, 27], [30, 45]
    ];
    const [q1A, q1B] = q1Pool[randInt(0, q1Pool.length - 1)];
    const q1GCD = getGCD(q1A, q1B);

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • Μ.Κ.Δ. ΔΥΟ ΑΡΙΘΜΩΝ',
      instruction: 'Υπολογίστε τον Μέγιστο Κοινό Διαιρέτη:',
      prompt: `Υπολογίστε: Μ.Κ.Δ.(${q1A}, ${q1B});`,
      correctVal: q1GCD,
      correctStr: String(q1GCD),
      explanation: `Οι κοινοί διαιρέτες των ${q1A} και ${q1B} έχουν μεγαλύτερο το ${q1GCD}. Άρα Μ.Κ.Δ.(${q1A}, ${q1B}) ＝ ${q1GCD}.`
    });
  }

  // Q2 (Input - Decimal): Μ.Κ.Δ. 3 αριθμών
  {
    const q2Pool = [
      [12, 18, 24], [16, 24, 32], [20, 30, 40], [15, 30, 45], [12, 16, 20]
    ];
    const [q2A, q2B, q2C] = q2Pool[randInt(0, q2Pool.length - 1)];
    const q2GCD = getGCD(getGCD(q2A, q2B), q2C);

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • Μ.Κ.Δ. ΤΡΙΩΝ ΑΡΙΘΜΩΝ',
      instruction: 'Υπολογίστε τον Μέγιστο Κοινό Διαιρέτη:',
      prompt: `Υπολογίστε: Μ.Κ.Δ.(${q2A}, ${q2B}, ${q2C});`,
      correctVal: q2GCD,
      correctStr: String(q2GCD),
      explanation: `Ο μεγαλύτερος κοινός διαιρέτης των ${q2A}, ${q2B} και ${q2C} είναι το ${q2GCD}.`
    });
  }

  // Q3 (MCQ): Σύνολο Κοινών Διαιρετών (Εγγύηση Μοναδικότητας)
  {
    const q3Pool = [
      [12, 18], [20, 30], [24, 36], [16, 24]
    ];
    const [q3A, q3B] = q3Pool[randInt(0, q3Pool.length - 1)];
    const q3DivsA = getDivisors(q3A);
    const q3DivsB = getDivisors(q3B);
    const q3Common = q3DivsA.filter((d) => q3DivsB.includes(d));
    const q3CorrectStr = `{ ${q3Common.join(', ')} }`;

    const q3Wrong1 = `{ ${q3Common.filter((_, i) => i !== 1).join(', ')} }`;
    const q3Wrong2 = `{ ${[...q3Common, q3Common[q3Common.length - 1] * 2].sort((a, b) => a - b).join(', ')} }`;
    const q3Wrong3 = `{ ${q3Common.map((d) => (d === 2 ? 5 : d)).sort((a, b) => a - b).join(', ')} }`;

    const rawOptions = [q3CorrectStr, q3Wrong1, q3Wrong2, q3Wrong3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q3CorrectStr
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΣΥΝΟΛΟ ΚΟΙΝΩΝ ΔΙΑΙΡΕΤΩΝ',
      instruction: 'Επιλέξτε το σύνολο των κοινών διαιρετών:',
      prompt: `Ποιο είναι το σύνολο των κοινών διαιρετών των αριθμών ${q3A} και ${q3B};`,
      options,
      correctText: q3CorrectStr,
      explanation: `Οι διαιρέτες του ${q3A} και του ${q3B} που συμπίπτουν είναι: ${q3CorrectStr}.`
    });
  }

  // Q4 (MCQ): Πρώτοι μεταξύ τους αριθμοί (Μ.Κ.Δ. = 1) (Εγγύηση Μοναδικότητας)
  {
    const q4CoprimePairs = [
      [8, 9], [9, 14], [15, 16], [8, 15], [21, 22], [14, 25]
    ];
    const q4NonCoprimePairs = [
      [12, 18], [14, 21], [15, 20], [16, 24], [20, 35], [18, 27]
    ];
    const q4ChosenCoprime = q4CoprimePairs[randInt(0, q4CoprimePairs.length - 1)];
    const q4ChosenNonCoprimes = shuffle(q4NonCoprimePairs).slice(0, 3);
    const q4CorrectStr = `${q4ChosenCoprime[0]} και ${q4ChosenCoprime[1]}`;

    const rawOptions = [
      q4CorrectStr,
      ...q4ChosenNonCoprimes.map((p) => `${p[0]} και ${p[1]}`)
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q4CorrectStr
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ',
      instruction: 'Επιλέξτε το ζεύγος των πρώτων μεταξύ τους αριθμών:',
      prompt: 'Ποιο από τα παρακάτω ζεύγη αποτελείται από αριθμούς που είναι πρώτοι μεταξύ τους;',
      options,
      correctText: q4CorrectStr,
      explanation: `Οι αριθμοί ${q4CorrectStr} έχουν μοναδικό κοινό διαιρέτη το 1 (Μ.Κ.Δ. ＝ 1), άρα είναι πρώτοι μεταξύ τους.`
    });
  }

  // Q5 (MCQ): True / False - Ορισμός Μ.Κ.Δ.
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Ο Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) δύο αριθμών είναι ο μεγαλύτερος αριθμός που τους διαιρεί και τους δύο ακριβώς.'
      : 'Ο Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) δύο αριθμών είναι το γινόμενο των δύο αριθμών.';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΟΡΙΣΜΟΣ Μ.Κ.Δ.',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Ο Μ.Κ.Δ. είναι ο μεγαλύτερος από όλους τους κοινούς διαιρέτες δύο ή περισσότερων αριθμών.'
        : 'Λάθος! Ο Μ.Κ.Δ. είναι ο μεγαλύτερος κοινός διαιρέτης, όχι το γινόμενο των αριθμών.'
    });
  }

  // Q6 (MCQ): True / False - Πρώτοι μεταξύ τους αριθμοί
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Όταν δύο αριθμοί έχουν Μ.Κ.Δ. ίσο με το 1, ονομάζονται πρώτοι μεταξύ τους.'
      : 'Δύο αριθμοί ονομάζονται πρώτοι μεταξύ τους μόνο αν είναι και οι δύο μονοψήφιοι.';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΙΔΙΟΤΗΤΑ ΠΡΩΤΩΝ ΜΕΤΑΞΥ ΤΟΥΣ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Δύο αριθμοί λέγονται πρώτοι μεταξύ τους όταν έχουν Μ.Κ.Δ. ίσο με 1.'
        : 'Λάθος! Δύο αριθμοί μπορεί να είναι πρώτοι μεταξύ τους ακόμη κι αν είναι μεγάλοι σύνθετοι αριθμοί (π.χ. 14 και 25).'
    });
  }

  // Q7 (Input - Decimal): Οπτική Κατάτμηση
  {
    const q7A = [18, 24, 30][randInt(0, 2)];
    const q7B = [12, 16, 20][randInt(0, 2)];
    const q7Mkd = getGCD(q7A, q7B);

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΚΑΤΑΤΜΗΣΗ',
      instruction: 'Βρείτε το μέγιστο κοινό μήκος κομματιού:',
      prompt: `Ποιο είναι το μεγαλύτερο κοινό μήκος κομματιού που μετράει ακριβώς δύο ράβδους μήκους ${q7A} εκ. και ${q7B} εκ.;`,
      correctVal: q7Mkd,
      correctStr: String(q7Mkd),
      explanation: `Το μεγαλύτερο μέγεθος κομματιού που μετράει ακριβώς και το ${q7A} και το ${q7B} είναι ο Μ.Κ.Δ.(${q7A}, ${q7B}) ＝ ${q7Mkd} εκ.`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας (Εγγύηση Μοναδικότητας)
  {
    const p = shuffledPresets[0];
    const q8Count1 = randInt(3, 6) * 6; // π.χ. 18, 24, 30, 36
    const q8Count2 = randInt(2, 5) * 6; // π.χ. 12, 18, 24
    const q8GCD = getGCD(q8Count1, q8Count2);
    const q8CorrectStr = `${q8GCD} ${p.groupName}`;

    const w1 = `${q8GCD + 2} ${p.groupName}`;
    const w2 = `${Math.max(1, q8GCD - 2)} ${p.groupName}`;
    const w3 = `${q8GCD * 2} ${p.groupName}`;

    const rawOptions = [q8CorrectStr, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8CorrectStr
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: 'Επιλέξτε το μέγιστο πλήθος όμοιων ομάδων:',
      prompt: `${p.profession} έχει ${q8Count1} ${p.item1} και ${q8Count2} ${p.item2}. ${p.questionText}`,
      options,
      correctText: q8CorrectStr,
      explanation: `Βρίσκουμε τον Μ.Κ.Δ.(${q8Count1}, ${q8Count2}) ＝ ${q8GCD}. Άρα μπορεί να φτιάξει το πολύ ${q8CorrectStr}.`
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
      title: 'ΕΡΩΤΗΣΗ 9 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΜΕΓΙΣΤΟΥ ΚΟΙΝΟΥ ΜΗΚΟΥΣ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: prob9.text,
      tableData: prob9.tableData,
      correctVal: prob9.correctVal,
      correctStr: prob9.correctStr,
      explanation: prob9.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας - Εγγύηση Μοναδικότητας) - Χωρίς πίνακα στην εκφώνηση
    const val10 = prob10.correctVal;
    const correctStr10 = `${prob10.correctStr} συσκευασίες`;
    const fake10A = `${val10 + 5} συσκευασίες`;
    const fake10B = `${Math.max(2, val10 - 5)} συσκευασίες`;
    const fake10C = `${val10 * 2} συσκευασίες`;

    const rawOptionsQ10 = [correctStr10, fake10A, fake10B, fake10C];
    const optionsQ10 = shuffle([...new Set(rawOptionsQ10)]).map((text) => ({
      text,
      isCorrect: text === correctStr10
    }));

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΙΣΟΤΙΜΟΥ ΜΟΙΡΑΣΜΑΤΟΣ',
      instruction: 'Επιλέξτε τον σωστό αριθμό συσκευασιών:',
      prompt: prob10.text,
      tableData: prob10.tableData,
      options: optionsQ10,
      correctText: correctStr10,
      explanation: prob10.explanation
    });
  }

  return qList;
}

export default function MkdExercisesPage() {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμος Input με καθαρισμο χαρακτηρων (μονο 0-9 και ενα κομμα, οριο 10 χαρακτηρων)
  const handleInputChange = (qId, rawValue) => {
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
      [`q_${qId}`]: sanitized
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
  const handleCheckAnswers = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitted) return;

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
      title="Ασκήσεις: Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στον Μέγιστο Κοινό Διαιρέτη για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/14-mkd"
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
              Ασκήσεις &amp; Προβλήματα: Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.)
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες εύρεσης Μ.Κ.Δ., κοινών διαιρετών, πρώτων μεταξύ τους αριθμών και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
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
          {questions.map((q) => {
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
                key={`q-${q.id}`}
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

                {/* Εκφωνηση (Καθαρο κειμενο χωρις πινακες που προδιδουν τη λυση) */}
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
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
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

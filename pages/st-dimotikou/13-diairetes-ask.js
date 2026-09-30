// pages/st-dimotikou/13-diairetes-ask.js
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

// Δεξαμενη θεματικων σεναριων καθημερινοτητας με σωστη γραμματικη διατυπωση ερωτησης
const REAL_WORLD_PRESETS = [
  { item: 'μαθητές', unit: 'ισοπληθείς ομάδες', questionPrefix: 'Σε πόσες' },
  { item: 'καραμέλες', unit: 'σακουλάκια', questionPrefix: 'Σε πόσα' },
  { item: 'βιβλία', unit: 'ράφια', questionPrefix: 'Σε πόσα' },
  { item: 'λουλούδια', unit: 'ανθοδέσμες', questionPrefix: 'Σε πόσες' },
  { item: 'σοκολατάκια', unit: 'κουτάκια', questionPrefix: 'Σε πόσα' }
];

// Δεξαμενη προβληματων για τις ερωτησεις 9 & 10
const EXTRA_PROBLEMS_POOL = [
  {
    id: 'p_div_std_1',
    generate: () => {
      const flowers = 48;
      const vasesPossible = [3, 4, 6, 8];
      const vase = vasesPossible[randInt(0, vasesPossible.length - 1)];
      const perVase = flowers / vase;
      return {
        text: `Ένα ανθοπωλείο έχει ${flowers} τριαντάφυλλα και θέλει να τα μοιράσει ισόποσα σε ${vase} βάζα χωρίς να περισσέψει κανένα. Πόσα τριαντάφυλλα θα βάλει σε κάθε βάζο;`,
        tableData: { col1: 'Σύνολο Τριαντάφυλλων', col2: 'Πλήθος Βάζων', r1: [`${flowers} τριαντάφυλλα`, `${vase} βάζα`], r2: ['Διαίρεση', `${perVase} τριαντάφυλλα / βάζο`] },
        correctVal: perVase,
        correctStr: String(perVase),
        explanation: `Επειδή το ${vase} είναι διαιρέτης του ${flowers}, η διαίρεση είναι τέλεια: ${flowers} : ${vase} ＝ ${perVase} τριαντάφυλλα σε κάθε βάζο.`
      };
    }
  },
  {
    id: 'p_div_std_2',
    generate: () => {
      const students = 60;
      const teamSizes = [4, 5, 6, 10];
      const size = teamSizes[randInt(0, teamSizes.length - 1)];
      const teams = students / size;
      return {
        text: `Σε μια αθλητική εκδήλωση συμμετέχουν ${students} μαθητές. Ο γυμναστής θέλει να σχηματίσει ομάδες των ${size} ατόμων. Πόσες ακριβώς ισοπληθείς ομάδες θα δημιουργηθούν;`,
        tableData: { col1: 'Συνολικοί Μαθητές', col2: 'Άτομα ανά Ομάδα', r1: [`${students} μαθητές`, `${size} άτομα`], r2: ['Διαίρεση', `${teams} ομάδες`] },
        correctVal: teams,
        correctStr: String(teams),
        explanation: `Το ${size} είναι διαιρέτης του ${students}, άρα: ${students} : ${size} ＝ ${teams} ισοπληθείς ομάδες.`
      };
    }
  },
  {
    id: 'p_div_std_3',
    generate: () => {
      const candies = 72;
      const bagsPossible = [6, 8, 9, 12];
      const bag = bagsPossible[randInt(0, bagsPossible.length - 1)];
      const perBag = candies / bag;
      return {
        text: `Μια ζαχαροπλάστης έχει ${candies} καραμέλες και θέλει να φτιάξει ${bag} ίδια σακουλάκια. Πόσες καραμέλες πρέπει να βάλει σε κάθε σακουλάκι για να μη μείνει καμία;`,
        tableData: { col1: 'Σύνολο Καραμελών', col2: 'Σακουλάκια', r1: [`${candies} καραμέλες`, `${bag} σακουλάκια`], r2: ['Διαίρεση', `${perBag} καραμέλες / σακουλάκι`] },
        correctVal: perBag,
        correctStr: String(perBag),
        explanation: `Το ${bag} είναι διαιρέτης του ${candies}, επομένως: ${candies} : ${bag} ＝ ${perBag} καραμέλες ανά σακουλάκι.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];
  const shuffledItems = shuffle(REAL_WORLD_PRESETS);

  // Q1 (Input - Decimal): Πλήθος διαιρετών ενός αριθμού
  {
    const q1Pool = [12, 16, 18, 20, 24, 28, 30, 36];
    const q1Num = q1Pool[randInt(0, q1Pool.length - 1)];
    const q1Divs = getDivisors(q1Num);
    const q1Correct = q1Divs.length;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΠΛΗΘΟΣ ΔΙΑΙΡΕΤΩΝ',
      instruction: 'Βρείτε το πλήθος όλων των διαιρετών του αριθμού:',
      prompt: `Πόσους συνολικά διαιρέτες έχει ο αριθμός ${q1Num};`,
      correctVal: q1Correct,
      correctStr: String(q1Correct),
      explanation: `Οι διαιρέτες του ${q1Num} είναι οι: ${q1Divs.join(', ')} (συνολικά ${q1Correct} διαιρέτες).`
    });
  }

  // Q2 (Input - Decimal): Εύρεση του μεγαλύτερου διαιρέτη (εκτός του εαυτού του)
  {
    const q2Pool = [14, 18, 20, 22, 26, 28, 32, 34, 38, 40];
    const q2Num = q2Pool[randInt(0, q2Pool.length - 1)];
    const q2Divs = getDivisors(q2Num);
    const q2CorrectVal = q2Divs[q2Divs.length - 2];

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΜΕΓΑΛΥΤΕΡΟΣ ΓΝΗΣΙΟΣ ΔΙΑΙΡΕΤΗΣ',
      instruction: 'Βρείτε τον μεγαλύτερο διαιρέτη εκτός από τον ίδιο τον αριθμό:',
      prompt: `Ποιος είναι ο μεγαλύτερος διαιρέτης του ${q2Num} (εκτός από τον ίδιο τον αριθμό);`,
      correctVal: q2CorrectVal,
      correctStr: String(q2CorrectVal),
      explanation: `Οι διαιρέτες του ${q2Num} είναι: ${q2Divs.join(', ')}. Ο μεγαλύτερος διαιρέτης εκτός του ${q2Num} είναι το ${q2CorrectVal}.`
    });
  }

  // Q3 (MCQ): Έλεγχος αν ένας αριθμός είναι διαιρέτης (Εγγύηση Μοναδικότητας)
  {
    const q3Base = randInt(4, 9) * randInt(3, 8);
    const q3Divs = getDivisors(q3Base);
    const q3ValidDiv = q3Divs[randInt(1, q3Divs.length - 2)];
    const q3NonDivs = [2, 3, 4, 5, 6, 7, 8, 9, 11, 13].filter((d) => q3Base % d !== 0);
    const q3Wrongs = shuffle(q3NonDivs).slice(0, 3);

    const rawOptions = [String(q3ValidDiv), ...q3Wrongs.map(String)];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === String(q3ValidDiv)
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΑΝΑΓΝΩΡΙΣΗ ΔΙΑΙΡΕΤΗ',
      instruction: 'Επιλέξτε ποιος από τους παρακάτω αριθμούς είναι διαιρέτης:',
      prompt: `Ποιος από τους παρακάτω αριθμούς είναι διαιρέτης του ${q3Base};`,
      options,
      correctText: String(q3ValidDiv),
      explanation: `Το ${q3ValidDiv} διαιρεί ακριβώς το ${q3Base} (${q3Base} : ${q3ValidDiv} ＝ ${q3Base / q3ValidDiv}), άρα είναι διαιρέτης του.`
    });
  }

  // Q4 (MCQ): Ποιο από τα σύνολα περιέχει ΟΛΟΥΣ τους διαιρέτες (Εγγύηση Μοναδικότητας)
  {
    const q4Pool = [12, 18, 20, 24, 30];
    const q4Num = q4Pool[randInt(0, q4Pool.length - 1)];
    const q4CorrectDivs = getDivisors(q4Num);
    const q4CorrectStr = `{ ${q4CorrectDivs.join(', ')} }`;

    // 1ο Λάθος: Λείπει ένας ενδιάμεσος διαιρέτης
    const q4MissingOne = q4CorrectDivs.filter((_, i) => i !== 1);
    const q4Wrong1 = `{ ${q4MissingOne.join(', ')} }`;

    // 2ο Λάθος: Έχει έναν επιπλέον αριθμό που ΔΕΝ είναι διαιρέτης
    const nonDivCandidate1 = [7, 8, 9, 11, 13, 14].find((x) => q4Num % x !== 0 && !q4CorrectDivs.includes(x)) || (q4Num + 2);
    const q4WithExtra = [...q4CorrectDivs, nonDivCandidate1].sort((a, b) => a - b);
    const q4Wrong2 = `{ ${q4WithExtra.join(', ')} }`;

    // 3ο Λάθος: Έχει αντικατασταθεί ένας διαιρέτης με άλλον μη-διαιρέτη
    const nonDivCandidate2 = [7, 8, 9, 11, 13, 14, 15].filter((x) => q4Num % x !== 0 && !q4CorrectDivs.includes(x))[0] || (q4Num - 1);
    const q4Replaced = q4CorrectDivs.map((d, i) => (i === 1 ? nonDivCandidate2 : d)).sort((a, b) => a - b);
    const q4Wrong3 = `{ ${q4Replaced.join(', ')} }`;

    const rawOptions = [q4CorrectStr, q4Wrong1, q4Wrong2, q4Wrong3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q4CorrectStr
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΣΥΝΟΛΟ ΔΙΑΙΡΕΤΩΝ',
      instruction: 'Επιλέξτε το σύνολο που περιέχει όλους τους διαιρέτες:',
      prompt: `Ποιο σύνολο περιέχει ΟΛΟΥΣ τους διαιρέτες του αριθμού ${q4Num};`,
      options,
      correctText: q4CorrectStr,
      explanation: `Όλοι οι αριθμοί που διαιρούν ακριβώς το ${q4Num} είναι: ${q4CorrectStr}.`
    });
  }

  // Q5 (MCQ): True / False - Ο αριθμός 1 είναι διαιρέτης όλων των φυσικών
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Ο αριθμός 1 είναι διαιρέτης κάθε φυσικού αριθμού.'
      : 'Ο αριθμός 1 είναι διαιρέτης μόνο των περιττών αριθμών.';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • Η ΜΟΝΑΔΑ ΩΣ ΔΙΑΙΡΕΤΗΣ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Ο αριθμός 1 διαιρεί όλους ανεξαιρέτως τους φυσικούς αριθμούς.'
        : 'Λάθος! Ο αριθμός 1 διαιρεί όλους τους φυσικούς αριθμούς (τόσο τους άρτιους όσο και τους περιττούς).'
    });
  }

  // Q6 (MCQ): True / False - Το πλήθος των διαιρετών είναι πεπερασμένο
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Κάθε φυσικός αριθμός έχει συγκεκριμένο (πεπερασμένο) πλήθος διαιρετών.'
      : 'Κάθε φυσικός αριθμός έχει άπειρους διαιρέτες.';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΠΛΗΘΟΣ ΔΙΑΙΡΕΤΩΝ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Οι διαιρέτες ενός αριθμού είναι πεπερασμένοι (δεν μπορεί να είναι μεγαλύτεροι από τον ίδιο τον αριθμό).'
        : 'Λάθος! Οι διαιρέτες είναι πεπερασμένοι, σε αντίθεση με τα πολλαπλάσια που είναι άπειρα.'
    });
  }

  // Q7 (Input - Decimal): Οπτικό μοίρασμα σε ισόποσες ομάδες
  {
    const q7ItemsCount = [12, 16, 18, 20, 24][randInt(0, 4)];
    const q7Divs = getDivisors(q7ItemsCount).filter((d) => d > 1 && d < q7ItemsCount);
    const q7ChosenDiv = q7Divs[randInt(0, q7Divs.length - 1)];
    const q7CorrectGroups = q7ItemsCount / q7ChosenDiv;

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΚΑΤΑΝΟΜΗ',
      instruction: 'Υπολογίστε τον αριθμό των ισοπληθών ομάδων:',
      prompt: `Αν μοιράσουμε ${q7ItemsCount} στοιχεία σε ομάδες των ${q7ChosenDiv}, πόσες πλήρεις ομάδες σχηματίζονται;`,
      correctVal: q7CorrectGroups,
      correctStr: String(q7CorrectGroups),
      explanation: `Μοιράζοντας τα ${q7ItemsCount} στοιχεία σε ομάδες των ${q7ChosenDiv}, σχηματίζονται ακριβώς ${q7ItemsCount} : ${q7ChosenDiv} ＝ ${q7CorrectGroups} ισοπληθείς ομάδες.`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας (Ισόποσο μοίρασμα χωρίς υπόλοιπο) (Εγγύηση Μοναδικότητας)
  {
    const q8Preset = shuffledItems[0];
    const q8Total = [24, 30, 36, 40][randInt(0, 3)];
    const q8AllDivs = getDivisors(q8Total).filter((d) => d > 2 && d < 12);
    const q8Possible = q8AllDivs[randInt(0, q8AllDivs.length - 1)];
    const q8Impossible = [7, 8, 9, 11, 13, 14].filter((d) => q8Total % d !== 0);
    const q8Wrongs = shuffle(q8Impossible).slice(0, 3);

    const rawOptions = [
      `${q8Possible} ${q8Preset.unit}`,
      ...q8Wrongs.map((w) => `${w} ${q8Preset.unit}`)
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === `${q8Possible} ${q8Preset.unit}`
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: 'Επιλέξτε τη σωστή ισόποση κατανομή χωρίς υπόλοιπο:',
      prompt: `Έχουμε ${q8Total} ${q8Preset.item}. ${q8Preset.questionPrefix} ${q8Preset.unit} μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
      options,
      correctText: `${q8Possible} ${q8Preset.unit}`,
      explanation: `Το ${q8Possible} είναι διαιρέτης του ${q8Total} (${q8Total} : ${q8Possible} ＝ ${q8Total / q8Possible}), επομένως το μοίρασμα γίνεται χωρίς υπόλοιπο.`
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
      title: 'ΕΡΩΤΗΣΗ 9 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΔΙΑΙΡΕΤΩΝ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: prob9.text,
      tableData: prob9.tableData,
      correctVal: prob9.correctVal,
      correctStr: prob9.correctStr,
      explanation: prob9.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας - Εγγύηση Μοναδικότητας) - Χωρίς πίνακα στην εκφώνηση
    const val10 = prob10.correctVal;
    const correctStr10 = `${prob10.correctStr} ομάδες`;
    const fake10A = `${val10 + 2} ομάδες`;
    const fake10B = `${Math.max(1, val10 - 2)} ομάδες`;
    const fake10C = `${val10 + 4} ομάδες`;

    const rawOptionsQ10 = [correctStr10, fake10A, fake10B, fake10C];
    const optionsQ10 = shuffle([...new Set(rawOptionsQ10)]).map((text) => ({
      text,
      isCorrect: text === correctStr10
    }));

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΟΜΑΔΟΠΟΙΗΣΗΣ',
      instruction: 'Επιλέξτε τον σωστό αριθμό ομάδων για το πρόβλημα:',
      prompt: prob10.text,
      tableData: prob10.tableData,
      options: optionsQ10,
      correctText: correctStr10,
      explanation: prob10.explanation
    });
  }

  return qList;
}

export default function DiairetesExercisesPage() {
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
      title="Ασκήσεις: Οι Διαιρέτες ενός Αριθμού - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στους διαιρέτες φυσικών αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/13-diairetes"
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
              Ασκήσεις &amp; Προβλήματα: Οι Διαιρέτες ενός Αριθμού
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες εύρεσης διαιρετών, συνόλων διαίρεσης, ισόποσης κατανομής και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
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

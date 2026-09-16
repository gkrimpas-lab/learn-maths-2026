import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση τυχαίου ακέραιου [min, max]
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Βοηθητική συνάρτηση ανακατέματος πίνακα (Fisher-Yates)
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
};

// Εξασφάλιση μοναδικών επιλογών σε MCQ χωρίς διπλότυπα
const makeUniqueOptions = (correct, wrongCandidates) => {
  const unique = new Set([correct]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  return shuffleArray(Array.from(unique));
};

// Υπολογισμός ΜΚΔ 2 αριθμών (Ευκλείδης)
const gcd2 = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
};

// Υπολογισμός ΜΚΔ πίνακα αριθμών
const gcdArray = (arr) => arr.reduce((acc, curr) => gcd2(acc, curr), arr[0]);

// ========================================================
// ΔΕΞΑΜΕΝΗ 20 ΔΙΑΦΟΡΕΤΙΚΩΝ ΤΥΠΩΝ ΑΣΚΗΣΕΩΝ ΜΚΔ
// ========================================================
const EXERCISE_GENERATORS = [
  // 1. ΜΚΔ δύο απλών αριθμών (Input)
  () => {
    const g = randInt(2, 6);
    const m1 = [3, 4, 5, 7][randInt(0, 3)];
    let m2 = [3, 4, 5, 7][randInt(0, 3)];
    while (gcd2(m1, m2) !== 1) {
      m2 = randInt(2, 9);
    }
    const a = g * m1;
    const b = g * m2;
    const ans = gcd2(a, b);
    return {
      type: 'input',
      topic: 'ΜΚΔ ΔΥΟ ΑΡΙΘΜΩΝ',
      question: `Υπολόγισε τον Μέγιστο Κοινό Διαιρέτη των αριθμών ${a} και ${b}: ΜΚΔ(${a}, ${b})`,
      correctAnswer: ans.toString(),
      solution: `Οι κοινοί διαιρέτες των αριθμών ${a} και ${b} έχουν ως μεγαλύτερο αριθμό το ${ans}. Επομένως ΜΚΔ(${a}, ${b}) ＝ ${ans}.`,
    };
  },

  // 2. ΜΚΔ τριών αριθμών (Input)
  () => {
    const g = [2, 3, 4, 5, 6][randInt(0, 4)];
    const m = [2, 3, 5];
    const a = g * m[0];
    const b = g * m[1];
    const c = g * m[2];
    const ans = gcdArray([a, b, c]);
    return {
      type: 'input',
      topic: 'ΜΚΔ ΤΡΙΩΝ ΑΡΙΘΜΩΝ',
      question: `Υπολόγισε τον Μέγιστο Κοινό Διαιρέτη: ΜΚΔ(${a}, ${b}, ${c})`,
      correctAnswer: ans.toString(),
      solution: `Βρίσκουμε τους κοινούς διαιρέτες και των τριών αριθμών ή αναλύουμε σε πρώτους παράγοντες. Ο ΜΚΔ(${a}, ${b}, ${c}) ＝ ${ans}.`,
    };
  },

  // 3. ΜΚΔ τεσσάρων αριθμών (Input)
  () => {
    const g = [2, 4, 5, 6][randInt(0, 3)];
    const a = g * 2;
    const b = g * 3;
    const c = g * 4;
    const d = g * 5;
    const ans = gcdArray([a, b, c, d]);
    return {
      type: 'input',
      topic: 'ΜΚΔ ΤΕΣΣΑΡΩΝ ΑΡΙΘΜΩΝ',
      question: `Υπολόγισε τον Μέγιστο Κοινό Διαιρέτη των 4 αριθμών: ΜΚΔ(${a}, ${b}, ${c}, ${d})`,
      correctAnswer: ans.toString(),
      solution: `Ο μεγαλύτερος φυσικός αριθμός που διαιρεί ταυτόχρονα και τους τέσσερις αριθμούς (${a}, ${b}, ${c}, ${d}) είναι το ${ans}.`,
    };
  },

  // 4. Εύρεση ΜΚΔ από έτοιμη ανάλυση πρώτων παραγόντων (MCQ)
  () => {
    // a = 2^3 * 3^2 * 5, b = 2^2 * 3^3 * 7
    // ΜΚΔ = 2^2 * 3^2 = 4 * 9 = 36
    const correct = '2² · 3²';
    const candidates = ['2³ · 3³', '2² · 3 · 5', '2 · 3', '2³ · 3² · 5 · 7'];
    return {
      type: 'mcq',
      topic: 'ΑΝΑΛΥΣΗ ΣΕ ΠΡΩΤΟΥΣ',
      question: `Αν α ＝ 2<sup>3</sup> · 3<sup>2</sup> · 5 και β ＝ 2<sup>2</sup> · 3<sup>3</sup> · 7, ποιος είναι ο ΜΚΔ(α, β) σε μορφή γινομένου πρώτων παραγόντων;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Επιλέγουμε μόνο τους κοινούς πρώτους παράγοντες (το 2 και το 3) με τον μικρότερο εκθέτη: για το 2 είναι το 2 (2<sup>2</sup>) και για το 3 είναι το 2 (3<sup>2</sup>). Άρα ΜΚΔ ＝ 2<sup>2</sup> · 3<sup>2</sup>.`,
    };
  },

  // 5. Υπολογισμός τιμής από ανάλυση πρώτων παραγόντων (Input)
  () => {
    // 2^2 * 5 = 20
    return {
      type: 'input',
      topic: 'ΑΝΑΛΥΣΗ ΣΕ ΠΡΩΤΟΥΣ',
      question: `Αν ο ΜΚΔ τριών αριθμών προκύπτει από το γινόμενο 2<sup>2</sup> · 5, ποια είναι η τελική αριθμητική τιμή του ΜΚΔ;`,
      correctAnswer: '20',
      solution: `Υπολογίζουμε τις δυνάμεις και το γινόμενο: 2<sup>2</sup> · 5 ＝ 4 · 5 ＝ 20.`,
    };
  },

  // 6. Πρώτοι μεταξύ τους αριθμοί (MCQ)
  () => {
    const correct = 'ΜΚΔ(α, β) ＝ 1';
    const candidates = [
      'ΜΚΔ(α, β) ＝ 0',
      'α ＋ β ＝ 1',
      'α · β ＝ 1',
    ];
    return {
      type: 'mcq',
      topic: 'ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ',
      question: `Πότε δύο φυσικοί αριθμοί α και β ονομάζονται πρώτοι μεταξύ τους;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Δύο αριθμοί λέγονται πρώτοι μεταξύ τους όταν ο μόνος κοινός διαιρέτης τους είναι η μονάδα, δηλαδή όταν ΜΚΔ(α, β) ＝ 1.`,
    };
  },

  // 7. Αναγνώριση ζεύγους πρώτων μεταξύ τους αριθμών (MCQ)
  () => {
    const pairs = [
      { p: '8 και 9', valid: true },
      { p: '6 και 9', valid: false },
      { p: '10 και 15', valid: false },
      { p: '14 και 21', valid: false },
    ];
    const correct = '8 και 9';
    const candidates = ['6 και 9', '10 και 15', '14 και 21'];
    return {
      type: 'mcq',
      topic: 'ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ',
      question: `Ποιο από τα παρακάτω ζεύγη αριθμών αποτελείται από αριθμούς πρώτους μεταξύ τους;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Για το 8 και το 9 έχουμε ΜΚΔ(8, 9) ＝ 1 (δεν έχουν κανέναν κοινό πρώτο παράγοντα). Τα υπόλοιπα ζεύγη έχουν κοινό διαιρέτη το 3, το 5 ή το 7.`,
    };
  },

  // 8. Ιδιότητα: Ο ένας αριθμός διαιρεί τον άλλον (MCQ)
  () => {
    const small = randInt(4, 9);
    const mult = randInt(3, 6);
    const big = small * mult;
    const correct = small.toString();
    const candidates = [big.toString(), '1', (small * 2).toString()];
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΜΚΔ',
      question: `Αν ο αριθμός ${small} διαιρεί ακριβώς τον αριθμό ${big}, ποιος είναι ο ΜΚΔ(${small}, ${big});`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Όταν ένας φυσικός αριθμός διαιρεί έναν άλλον, ο Μέγιστος Κοινός Διαιρέτης τους είναι ο μικρότερος από τους δύο αριθμούς. Άρα ΜΚΔ(${small}, ${big}) ＝ ${small}.`,
    };
  },

  // 9. Πρακτικό πρόβλημα: Ισοδύναμα πακέτα (Input)
  () => {
    const g = [4, 6, 8, 10][randInt(0, 3)];
    const apples = g * randInt(2, 5);
    const oranges = g * 7;
    const ans = gcd2(apples, oranges);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ ΜΚΔ',
      question: `Ένας οπωροπώλης έχει ${apples} μήλα και ${oranges} πορτοκάλια. Θέλει να φτιάξει τον μέγιστο δυνατό αριθμό ομοιόμορφων καλαθιών χωρίς να περισσέψει κανένα φρούτο. Πόσα καλάθια θα φτιάξει;`,
      correctAnswer: ans.toString(),
      solution: `Το πλήθος των καλαθιών πρέπει να διαιρεί ακριβώς και τα μήλα και τα πορτοκάλια, και να είναι το μέγιστο δυνατό. Άρα ισούται με ΜΚΔ(${apples}, ${oranges}) ＝ ${ans} καλάθια.`,
    };
  },

  // 10. Πρακτικό πρόβλημα: Κοπή κορδελών σε μέγιστα ίσα τμήματα (Input)
  () => {
    const g = [3, 5, 7, 9][randInt(0, 3)];
    const r1 = g * 4;
    const r2 = g * 6;
    const ans = gcd2(r1, r2);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ ΜΚΔ',
      question: `Έχουμε δύο κορδέλες με μήκη ${r1} cm και ${r2} cm. Θέλουμε να τις κόψουμε σε ίσα κομμάτια με το μεγαλύτερο δυνατό μήκος χωρίς να περισσέψει τίποτα. Πόσα cm θα είναι το κάθε κομμάτι;`,
      correctAnswer: ans.toString(),
      solution: `Το μέγιστο μήκος κάθε κομματιού είναι ο ΜΚΔ των μηκών: ΜΚΔ(${r1}, ${r2}) ＝ ${ans} cm.`,
    };
  },

  // 11. ΜΚΔ διαδοχικών φυσικών αριθμών (MCQ)
  () => {
    const n = randInt(15, 80);
    const nextN = n + 1;
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΜΚΔ',
      question: `Πόσο ισούται πάντοτε ο ΜΚΔ δύο διαδοχικών φυσικών αριθμών, όπως ΜΚΔ(${n}, ${nextN});`,
      options: makeUniqueOptions('1', ['2', `${n}`, '0']),
      correctAnswer: '1',
      solution: `Δύο διαδοχικοί φυσικοί αριθμοί είναι πάντοτε πρώτοι μεταξύ τους, επομένως ο ΜΚΔ τους ισούται πάντα με 1.`,
    };
  },

  // 12. ΜΚΔ δύο πρώτων αριθμών (Input)
  () => {
    const primes = [13, 17, 19, 23, 29, 31];
    const p1 = primes[randInt(0, 2)];
    const p2 = primes[randInt(3, 5)];
    return {
      type: 'input',
      topic: 'ΠΡΩΤΟΙ ΑΡΙΘΜΟΙ',
      question: `Ποιος είναι ο ΜΚΔ των δύο πρώτων αριθμών ${p1} και ${p2};`,
      correctAnswer: '1',
      solution: `Επειδή οι αριθμοί ${p1} και ${p2} είναι πρώτοι, οι μόνοι θετικοί διαιρέτες τους είναι η μονάδα και ο εαυτός τους. Άρα ο μόνος κοινός τους διαιρέτης είναι το 1: ΜΚΔ(${p1}, ${p2}) ＝ 1.`,
    };
  },

  // 13. ΜΚΔ τριών αριθμών με κοινό παράγοντα το 10 (Input)
  () => {
    const a = 20;
    const b = 50;
    const c = 70;
    const ans = gcdArray([a, b, c]);
    return {
      type: 'input',
      topic: 'ΜΚΔ ΤΡΙΩΝ ΑΡΙΘΜΩΝ',
      question: `Υπολόγισε τον ΜΚΔ των αριθμών: ΜΚΔ(${a}, ${b}, ${c})`,
      correctAnswer: ans.toString(),
      solution: `Και οι τρεις αριθμοί λήγουν σε 0 και οι παράγοντες 2, 5, 7 δεν έχουν άλλο κοινό διαιρέτη εκτός του 1. Άρα ΜΚΔ(${a}, ${b}, ${c}) ＝ ${ans}.`,
    };
  },

  // 14. Εύρεση εκθέτη στον κανόνα του ΜΚΔ (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΚΑΝΟΝΑΣ ΜΚΔ',
      question: `Στον κανόνα εύρεσης του ΜΚΔ με ανάλυση σε πρώτους παράγοντες, ποιον εκθέτη επιλέγουμε για κάθε κοινό παράγοντα;`,
      options: makeUniqueOptions(
        'Τον μικρότερο εκθέτη',
        ['Τον μεγαλύτερο εκθέτη', 'Το άθροισμα των εκθετών', 'Το γινόμενο των εκθετών']
      ),
      correctAnswer: 'Τον μικρότερο εκθέτη',
      solution: `Για τον Μέγιστο Κοινό Διαιρέτη παίρνουμε μόνο τους κοινούς πρώτους παράγοντες με τον μικρότερο εκθέτη.`,
    };
  },

  // 15. Μη κοινός παράγοντας στην ανάλυση (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΚΑΝΟΝΑΣ ΜΚΔ',
      question: `Αν ένας πρώτος παράγοντας δεν εμφανίζεται σε όλους τους αριθμούς, τι κάνουμε κατά τον υπολογισμό του ΜΚΔ;`,
      options: makeUniqueOptions(
        'Τον αγνοούμε (δεν τον συμπεριλαμβάνουμε)',
        [
          'Τον βάζουμε με εκθέτη 1',
          'Τον πολλαπλασιάζουμε στο τέλος',
          'Τον προσθέτουμε στο γινόμενο',
        ]
      ),
      correctAnswer: 'Τον αγνοούμε (δεν τον συμπεριλαμβάνουμε)',
      solution: `Στον ΜΚΔ συμπεριλαμβάνουμε αποκλειστικά και μόνο τους παράγοντες που είναι κοινοί σε όλους τους αριθμούς. Κάθε μη κοινός παράγοντας αγνοείται.`,
    };
  },

  // 16. ΜΚΔ 4 αριθμών όπου όλοι διαιρούνται με το 3 (Input)
  () => {
    const a = 12;
    const b = 18;
    const c = 24;
    const d = 30;
    const ans = gcdArray([a, b, c, d]);
    return {
      type: 'input',
      topic: 'ΜΚΔ ΤΕΣΣΑΡΩΝ ΑΡΙΘΜΩΝ',
      question: `Υπολόγισε τον Μέγιστο Κοινό Διαιρέτη: ΜΚΔ(${a}, ${b}, ${c}, ${d})`,
      correctAnswer: ans.toString(),
      solution: `Οι κοινοί διαιρέτες των 12, 18, 24, 30 είναι το 1, το 2, το 3 και το 6. Ο μέγιστος είναι το ${ans}.`,
    };
  },

  // 17. Πρόβλημα διαμοιρασμού μαθητών σε ομάδες (Input)
  () => {
    const boys = 36;
    const girls = 48;
    const ans = gcd2(boys, girls);
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ ΜΚΔ',
      question: `Σε μια εκδήλωση συμμετέχουν ${boys} αγόρια και ${girls} κορίτσια. Θέλουμε να χωριστούν στον μεγαλύτερο δυνατό αριθμό όμοιων ομάδων. Πόσες ομάδες θα δημιουργηθούν;`,
      correctAnswer: ans.toString(),
      solution: `Ο μέγιστος αριθμός όμοιων ομάδων ισούται με τον ΜΚΔ(${boys}, ${girls}) ＝ ${ans}. Κάθε ομάδα θα έχει 3 αγόρια και 4 κορίτσια.`,
    };
  },

  // 18. Υπολογισμός ΜΚΔ με αριθμό 1 (MCQ)
  () => {
    const n = randInt(15, 95);
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΜΚΔ',
      question: `Ποιος είναι ο ΜΚΔ(${n}, 1);`,
      options: makeUniqueOptions('1', [`${n}`, '0', 'Δεν ορίζεται']),
      correctAnswer: '1',
      solution: `Ο αριθμός 1 έχει μοναδικό διαιρέτη το 1. Επομένως ο μοναδικός κοινός διαιρέτης του 1 με οποιονδήποτε φυσικό αριθμό είναι το 1: ΜΚΔ(${n}, 1) ＝ 1.`,
    };
  },

  // 19. ΜΚΔ τριών αριθμών με κοινό το 7 (Input)
  () => {
    const a = 14;
    const b = 28;
    const c = 35;
    const ans = gcdArray([a, b, c]);
    return {
      type: 'input',
      topic: 'ΜΚΔ ΤΡΙΩΝ ΑΡΙΘΜΩΝ',
      question: `Υπολόγισε τον ΜΚΔ(${a}, ${b}, ${c})`,
      correctAnswer: ans.toString(),
      solution: `14 ＝ 2 · 7, 28 ＝ 2<sup>2</sup> · 7, 35 ＝ 5 · 7. Ο μόνος κοινός πρώτος παράγοντας είναι το 7 με εκθέτη 1. Άρα ΜΚΔ ＝ ${ans}.`,
    };
  },

  // 20. ΜΚΔ ίσων αριθμών (Input)
  () => {
    const n = randInt(12, 45);
    return {
      type: 'input',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΜΚΔ',
      question: `Ποιος είναι ο Μέγιστος Κοινός Διαιρέτης δύο ίσων αριθμών: ΜΚΔ(${n}, ${n});`,
      correctAnswer: n.toString(),
      solution: `Ο μεγαλύτερος διαιρέτης ενός αριθμού είναι ο ίδιος ο εαυτός του. Επομένως ΜΚΔ(${n}, ${n}) ＝ ${n}.`,
    };
  },
];

export default function MKDAsk() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργία 10 τυχαίων ερωτήσεων
  const generateQuestions = () => {
    const shuffledGen = shuffleArray(EXERCISE_GENERATORS);
    const selected = shuffledGen.slice(0, 10).map((gen, idx) => ({
      id: idx + 1,
      ...gen(),
    }));
    setQuestions(selected);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  // Αυστηρός έλεγχος εισαγωγής input
  const handleInputChange = (id, val) => {
    if (isSubmitted) return;
    let clean = val.replace('.', ',');
    clean = clean.replace(/[^0-9,]/g, '');
    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) return;
    if (clean.length > 10) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  // Υποβολή και έλεγχος απαντήσεων
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      const userAns = (userAnswers[q.id] || '').trim().replace(/\s+/g, '');
      const correctAns = q.correctAnswer.trim().replace(/\s+/g, '');
      if (userAns === correctAns) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && userAnswers[k].trim() !== ''
  ).length;

  const scorePercentage = Math.round((score / 10) * 100);

  return (
    <Layout
      title="Ασκήσεις: Μέγιστος Κοινός Διαιρέτης (ΜΚΔ) | Α' Γυμνασίου"
      description="Εξάσκηση σε 10 δυναμικές ασκήσεις στον Μέγιστο Κοινό Διαιρέτη (ΜΚΔ) για 2, 3 ή 4 αριθμούς και προβλήματα."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/03-MKD"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
        >
          <span>📖</span>
          <span>ΘΕΩΡΙΑ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 pb-32 sm:pb-36 space-y-8">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 10 ασκήσεις στον ΜΚΔ δύο, τριών και τεσσάρων αριθμών. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const isCorrect =
                isSubmitted &&
                userAns.trim().replace(/\s+/g, '') ===
                  q.correctAnswer.trim().replace(/\s+/g, '');

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-xs sm:text-sm">
                        {q.id}
                      </span>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md">
                        {q.topic}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ */}
                  <div className="space-y-2 pt-2">
                    {q.type === 'input' ? (
                      <div className="relative max-w-xs">
                        <input
                          type="text"
                          inputMode="decimal"
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder="Απάντηση..."
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-base font-bold rounded-xl border transition-all outline-none ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                                : 'bg-rose-50 border-rose-500 text-rose-950'
                              : 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAns === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleMCQSelect(q.id, opt)}
                              className={`h-11 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between transition-all touch-manipulation active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span dangerouslySetInnerHTML={{ __html: opt }} />
                              {isSelected && <span>✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση - Σαφής διαχωρισμός χωρίς συγχώνευση */}
                    {isSubmitted && (
                      <div
                        className={`p-4 rounded-xl text-xs sm:text-sm space-y-2.5 mt-3 border ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-sm sm:text-base">
                            <span>✅</span>
                            <span>ΣΩΣΤΟ</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>ΛΑΘΟΣ</span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/80 py-1.5 px-3 rounded-lg border border-rose-200 inline-block">
                              ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ: <span className="text-emerald-700 font-black ml-1" dangerouslySetInnerHTML={{ __html: q.correctAnswer }} />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-relaxed font-normal pt-1.5 border-t border-slate-200/60"
                          dangerouslySetInnerHTML={{ __html: q.solution }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Κουμπί Ελέγχου / Ανανέωσης εντός σελίδας */}
          <div className="flex justify-center pt-4">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount === 0}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {isSubmitted ? 'ΤΕΛΙΚΟ ΣΚΟΡ' : 'ΠΡΟΟΔΟΣ'}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 10` : `${answeredCount} / 10`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  ΕΠΙΤΥΧΙΑ
                </div>
                <div
                  className={`text-base sm:text-xl font-black font-mono ${
                    scorePercentage >= 80
                      ? 'text-emerald-400'
                      : scorePercentage >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {scorePercentage}%
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={generateQuestions}
              className="px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                ΕΠΑΝΑΛΗΨΗ
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

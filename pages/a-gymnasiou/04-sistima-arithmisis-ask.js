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
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Εξασφάλιση 4 μοναδικών επιλογών σε MCQ χωρίς διπλότυπα
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

// ========================================================
// ΔΕΞΑΜΕΝΗ 20 ΔΙΑΦΟΡΕΤΙΚΩΝ ΤΥΠΩΝ ΑΣΚΗΣΕΩΝ ΣΥΣΤΗΜΑΤΩΝ
// ========================================================
const EXERCISE_GENERATORS = [
  // 1. Μετατροπή απλού δυαδικού (4-bit) σε δεκαδικό (Input)
  () => {
    const dec = randInt(5, 15);
    const bin = dec.toString(2);
    return {
      type: 'input',
      topic: 'ΔΥΑΔΙΚΟ ΣΕ ΔΕΚΑΔΙΚΟ',
      question: `Μετάτρεψε τον δυαδικό αριθμό ${bin}<sub>(2)</sub> στο δεκαδικό σύστημα:`,
      correctAnswer: dec.toString(),
      solution: `Αναλύουμε σε δυνάμεις του 2: ${bin
        .split('')
        .map((b, i) => `${b} · 2<sup>${bin.length - 1 - i}</sup>`)
        .join(' ＋ ')} ＝ ${dec}.`,
    };
  },

  // 2. Μετατροπή 5-bit δυαδικού σε δεκαδικό (Input)
  () => {
    const dec = randInt(17, 31);
    const bin = dec.toString(2);
    return {
      type: 'input',
      topic: 'ΔΥΑΔΙΚΟ ΣΕ ΔΕΚΑΔΙΚΟ',
      question: `Ποιος είναι ο δεκαδικός αριθμός που αντιστοιχεί στον δυαδικό ${bin}<sub>(2)</sub> ;`,
      correctAnswer: dec.toString(),
      solution: `Αναλύουμε: ${bin
        .split('')
        .map((b, i) => `${b} · 2<sup>${bin.length - 1 - i}</sup>`)
        .join(' ＋ ')} ＝ ${dec}.`,
    };
  },

  // 3. Μετατροπή δεκαδικού σε δυαδικό (MCQ)
  () => {
    const dec = randInt(10, 26);
    const correct = `${dec.toString(2)}₍₂₎`;
    const candidates = [
      `${(dec + 1).toString(2)}₍₂₎`,
      `${(dec - 1).toString(2)}₍₂₎`,
      `${(dec + 2).toString(2)}₍₂₎`,
      `${(dec - 2).toString(2)}₍₂₎`,
    ];
    return {
      type: 'mcq',
      topic: 'ΔΕΚΑΔΙΚΟ ΣΕ ΔΥΑΔΙΚΟ',
      question: `Πώς γράφεται ο δεκαδικός αριθμός ${dec} στο δυαδικό σύστημα;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Διαιρούμε διαδοχικά με το 2 ή αναλύουμε σε άθροισμα δυνάμεων του 2. Ο αριθμός ${dec} ισούται με ${correct}.`,
    };
  },

  // 4. Μετατροπή οκταδικού σε δεκαδικό (Input)
  () => {
    const d1 = randInt(1, 5);
    const d0 = randInt(0, 7);
    const oct = `${d1}${d0}`;
    const dec = d1 * 8 + d0;
    return {
      type: 'input',
      topic: 'ΟΚΤΑΔΙΚΟ ΣΕ ΔΕΚΑΔΙΚΟ',
      question: `Υπολόγισε τη δεκαδική τιμή του οκταδικού αριθμού ${oct}<sub>(8)</sub> :`,
      correctAnswer: dec.toString(),
      solution: `${oct}<sub>(8)</sub> ＝ ${d1} · 8<sup>1</sup> ＋ ${d0} · 8<sup>0</sup> ＝ ${d1 * 8} ＋ ${d0} ＝ ${dec}.`,
    };
  },

  // 5. Μετατροπή 3ψήφιου οκταδικού σε δεκαδικό (Input)
  () => {
    const d2 = randInt(1, 3);
    const d1 = randInt(0, 5);
    const d0 = randInt(0, 7);
    const oct = `${d2}${d1}${d0}`;
    const dec = d2 * 64 + d1 * 8 + d0;
    return {
      type: 'input',
      topic: 'ΟΚΤΑΔΙΚΟ ΣΕ ΔΕΚΑΔΙΚΟ',
      question: `Μετάτρεψε τον οκταδικό αριθμό ${oct}<sub>(8)</sub> στο δεκαδικό σύστημα:`,
      correctAnswer: dec.toString(),
      solution: `${oct}<sub>(8)</sub> ＝ ${d2} · 8<sup>2</sup> ＋ ${d1} · 8<sup>1</sup> ＋ ${d0} · 8<sup>0</sup> ＝ ${d2 * 64} ＋ ${d1 * 8} ＋ ${d0} ＝ ${dec}.`,
    };
  },

  // 6. Αναγνώριση μη έγκυρου ψηφίου στο οκταδικό (MCQ)
  () => {
    const invalidDigits = ['8', '9'];
    const badDigit = invalidDigits[randInt(0, 1)];
    const correct = `Περιέχει το ψηφίο ${badDigit}`;
    const candidates = [
      'Είναι άρτιος αριθμός',
      'Είναι περιττός αριθμός',
      'Έχει πάνω από 2 ψηφία',
    ];
    return {
      type: 'mcq',
      topic: 'ΟΚΤΑΔΙΚΟ ΣΥΣΤΗΜΑ',
      question: `Γιατί η γραφή 3${badDigit}5<sub>(8)</sub> ΔΕΝ είναι αποδεκτή στο οκταδικό σύστημα;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Στο οκταδικό σύστημα (βάση 8) τα μόνα επιτρεπόμενα ψηφία είναι τα 0, 1, 2, 3, 4, 5, 6, 7. Το ψηφίο ${badDigit} δεν υπάρχει στο σύστημα αυτό.`,
    };
  },

  // 7. Πλήθος ψηφίων στο δυαδικό σύστημα (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΔΥΑΔΙΚΟ ΣΥΣΤΗΜΑ',
      question: `Ποια ψηφία χρησιμοποιούνται αποκλειστικά στο δυαδικό σύστημα αρίθμησης;`,
      options: makeUniqueOptions('Μόνο το 0 και το 1', [
        'Όλα τα ψηφία από 0 έως 2',
        'Μόνο το 1 και το 2',
        'Όλα τα ψηφία από 0 έως 9',
      ]),
      correctAnswer: 'Μόνο το 0 και το 1',
      solution: `Το δυαδικό σύστημα έχει βάση το 2 και χρησιμοποιεί ακριβώς δύο ψηφία: το 0 και το 1 (δυαδικά ψηφία ή bits).`,
    };
  },

  // 8. Θεσιακή αξία ψηφίου στο δεκαδικό (Input)
  () => {
    const d3 = randInt(1, 9);
    const d2 = randInt(0, 9);
    const d1 = randInt(0, 9);
    const d0 = randInt(0, 9);
    const num = `${d3}${d2}${d1}${d0}`;
    const value = d2 * 100;
    return {
      type: 'input',
      topic: 'ΘΕΣΙΑΚΗ ΑΞΙΑ',
      question: `Ποια είναι η θεσιακή αξία του ψηφίου ${d2} στον δεκαδικό αριθμό ${num};`,
      correctAnswer: value.toString(),
      solution: `Το ψηφίο ${d2} βρίσκεται στη θέση των εκατοντάδων (10<sup>2</sup> ＝ 100), επομένως η θεσιακή του αξία είναι ${d2} · 100 ＝ ${value}.`,
    };
  },

  // 9. Δύναμη του 2 ως δυαδικός αριθμός (MCQ)
  () => {
    const p = randInt(2, 5);
    const dec = Math.pow(2, p);
    const bin = `1${'0'.repeat(p)}₍₂₎`;
    const candidates = [
      `1${'1'.repeat(p)}₍₂₎`,
      `1${'0'.repeat(p - 1)}₍₂₎`,
      `1${'0'.repeat(p + 1)}₍₂₎`,
    ];
    return {
      type: 'mcq',
      topic: 'ΔΥΑΔΙΚΟ ΣΥΣΤΗΜΑ',
      question: `Πώς γράφεται ο αριθμός ${dec} (δηλαδή το 2<sup>${p}</sup>) στο δυαδικό σύστημα;`,
      options: makeUniqueOptions(bin, candidates),
      correctAnswer: bin,
      solution: `Κάθε δύναμη 2<sup>ν</sup> στο δυαδικό σύστημα γράφεται ως το 1 ακολουθούμενο από ν μηδενικά. Άρα το 2<sup>${p}</sup> γράφεται ως ${bin}.`,
    };
  },

  // 10. Μετατροπή δεκαδικού σε οκταδικό (MCQ)
  () => {
    const dec = randInt(18, 55);
    const correct = `${dec.toString(8)}₍₈₎`;
    const candidates = [
      `${(dec + 2).toString(8)}₍₈₎`,
      `${(dec - 2).toString(8)}₍₈₎`,
      `${(dec + 8).toString(8)}₍₈₎`,
    ];
    return {
      type: 'mcq',
      topic: 'ΔΕΚΑΔΙΚΟ ΣΕ ΟΚΤΑΔΙΚΟ',
      question: `Πώς γράφεται ο δεκαδικός αριθμός ${dec} στο οκταδικό σύστημα;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Εκτελούμε διαδοχικές διαιρέσεις με το 8. Ο δεκαδικός αριθμός ${dec} ισούται με ${correct}.`,
    };
  },

  // 11. Πρόσθεση στο δυαδικό σύστημα: 1 + 1 (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΔΥΑΔΙΚΕΣ ΠΡΑΞΕΙΣ',
      question: `Πόσο κάνει 1<sub>(2)</sub> ＋ 1<sub>(2)</sub> στο δυαδικό σύστημα αρίθμησης;`,
      options: makeUniqueOptions('10₍₂₎', ['2₍₂₎', '11₍₂₎', '0₍₂₎']),
      correctAnswer: '10₍₂₎',
      solution: `Στο δυαδικό σύστημα 1 ＋ 1 ＝ 2 στο δεκαδικό, το οποίο γράφεται ως 10<sub>(2)</sub> (0 και κρατούμενο 1 στην επόμενη θέση).`,
    };
  },

  // 12. Πολυωνυμική ανάλυση σε δυνάμεις του 10 (Input)
  () => {
    const a = randInt(2, 8);
    const b = randInt(1, 9);
    const c = randInt(1, 9);
    const num = a * 100 + b * 10 + c;
    return {
      type: 'input',
      topic: 'ΠΟΛΥΩΝΥΜΙΚΗ ΑΝΑΛΥΣΗ',
      question: `Στην ανάλυση ${num} ＝ ${a} · 10<sup>x</sup> ＋ ${b} · 10<sup>1</sup> ＋ ${c} · 10<sup>0</sup>, ποιος είναι ο εκθέτης x;`,
      correctAnswer: '2',
      solution: `Το ψηφίο ${a} είναι στις εκατοντάδες, άρα πολλαπλασιάζεται με το 10<sup>2</sup> ＝ 100. Επομένως x ＝ 2.`,
    };
  },

  // 13. Μέγιστος αριθμός με 3 bits (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΔΥΑΔΙΚΟ ΣΥΣΤΗΜΑ',
      question: `Ποιος είναι ο μεγαλύτερος δεκαδικός αριθμός που μπορεί να παρασταθεί με 3 δυαδικά ψηφία (bits), δηλαδή ο 111<sub>(2)</sub> ;`,
      correctAnswer: '7',
      solution: `111<sub>(2)</sub> ＝ 1 · 2<sup>2</sup> ＋ 1 · 2<sup>1</sup> ＋ 1 · 2<sup>0</sup> ＝ 4 ＋ 2 ＋ 1 ＝ 7 (ή 2<sup>3</sup> － 1 ＝ 8 － 1 ＝ 7).`,
    };
  },

  // 14. Μέγιστος αριθμός με 4 bits (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΔΥΑΔΙΚΟ ΣΥΣΤΗΜΑ',
      question: `Ποια είναι η δεκαδική τιμή του δυαδικού αριθμού 1111<sub>(2)</sub> ;`,
      correctAnswer: '15',
      solution: `1111<sub>(2)</sub> ＝ 8 ＋ 4 ＋ 2 ＋ 1 ＝ 15 (δηλαδή 2<sup>4</sup> － 1 ＝ 16 － 1 ＝ 15).`,
    };
  },

  // 15. Βάση του δεκαδικού συστήματος (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΘΕΩΡΙΑ ΣΥΣΤΗΜΑΤΩΝ',
      question: `Ποια είναι η βάση του συστήματος αρίθμησης που χρησιμοποιούμε στην καθημερινότητά μας;`,
      options: makeUniqueOptions('Το 10', ['Το 2', 'Το 8', 'Το 12']),
      correctAnswer: 'Το 10',
      solution: `Το σύστημα της καθημερινότητάς μας είναι το δεκαδικό, επειδή έχει βάση το 10 και χρησιμοποιεί 10 ψηφία (0 έως 9).`,
    };
  },

  // 16. Ισοδυναμία δυαδικού και οκταδικού (MCQ)
  () => {
    // 7 in bin is 111, in oct is 7
    return {
      type: 'mcq',
      topic: 'ΜΕΤΑΤΡΟΠΕΣ ΣΥΣΤΗΜΑΤΩΝ',
      question: `Ποιος αριθμός στο οκταδικό σύστημα ισούται με τον δυαδικό 111<sub>(2)</sub> ;`,
      options: makeUniqueOptions('7₍₈₎', ['11₍₈₎', '6₍₈₎', '10₍₈₎']),
      correctAnswer: '7₍₈₎',
      solution: `Ο δυαδικός αριθμός 111<sub>(2)</sub> ισούται με 4 ＋ 2 ＋ 1 ＝ 7 στο δεκαδικό, που γράφεται ακριβώς ως 7<sub>(8)</sub> στο οκταδικό σύστημα.`,
    };
  },

  // 17. Θεσιακή αξία στο οκταδικό σύστημα (Input)
  () => {
    const d = randInt(2, 6);
    const ans = d * 64;
    return {
      type: 'input',
      topic: 'ΟΚΤΑΔΙΚΟ ΣΥΣΤΗΜΑ',
      question: `Ποια είναι η δεκαδική αξία του ψηφίου ${d} όταν βρίσκεται στην 3η θέση (θέση του 8<sup>2</sup>) ενός οκταδικού αριθμού;`,
      correctAnswer: ans.toString(),
      solution: `Η θέση 8<sup>2</sup> έχει αξία 64. Άρα το ψηφίο ${d} έχει αξία ${d} · 64 ＝ ${ans}.`,
    };
  },

  // 18. Σύγκριση αριθμών σε διαφορετικά συστήματα (MCQ)
  () => {
    // 1010_(2) = 10, 12_(8) = 10
    return {
      type: 'mcq',
      topic: 'ΣΥΓΚΡΙΣΗ ΣΥΣΤΗΜΑΤΩΝ',
      question: `Ποια σχέση ισχύει μεταξύ του 1010<sub>(2)</sub> και του 12<sub>(8)</sub> ;`,
      options: makeUniqueOptions(
        '1010₍₂₎ ＝ 12₍₈₎',
        ['1010₍₂₎ ＞ 12₍₈₎', '1010₍₂₎ ＜ 12₍₈₎']
      ),
      correctAnswer: '1010₍₂₎ ＝ 12₍₈₎',
      solution: `1010<sub>(2)</sub> ＝ 8 ＋ 2 ＝ 10<sub>(10)</sub>. Επίσης 12<sub>(8)</sub> ＝ 1 · 8 ＋ 2 ＝ 10<sub>(10)</sub>. Άρα είναι ίσοι.`,
    };
  },

  // 19. Δυαδικός αριθμός που λήγει σε 0 (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΔΥΑΔΙΚΟ ΣΥΣΤΗΜΑ',
      question: `Ένας δυαδικός αριθμός που το τελευταίο του ψηφίο είναι 0, τι είδους δεκαδικό αριθμό παριστάνει πάντοτε;`,
      options: makeUniqueOptions('Άρτιο αριθμό', [
        'Περιττό αριθμό',
        'Πρώτο αριθμό',
        'Αριθμό που διαιρείται με το 10',
      ]),
      correctAnswer: 'Άρτιο αριθμό',
      solution: `Το τελευταίο ψηφίο αντιστοιχεί στο 2<sup>0</sup> ＝ 1. Αν είναι 0, ο αριθμός δεν περιέχει περιττή μονάδα, άρα είναι πάντοτε άρτιος.`,
    };
  },

  // 20. Υπολογισμός δεκαδικής τιμής από ανάλυση (Input)
  () => {
    const a = randInt(1, 1);
    const b = randInt(1, 1);
    const c = randInt(1, 1);
    // 1 * 2^4 + 1 * 2^2 + 1 * 2^0 = 16 + 4 + 1 = 21
    const ans = 16 + 4 + 1;
    return {
      type: 'input',
      topic: 'ΔΥΑΔΙΚΟ ΣΕ ΔΕΚΑΔΙΚΟ',
      question: `Υπολόγισε το δεκαδικό αποτέλεσμα του αθροίσματος: 1 · 2<sup>4</sup> ＋ 1 · 2<sup>2</sup> ＋ 1 · 2<sup>0</sup>`,
      correctAnswer: ans.toString(),
      solution: `1 · 16 ＋ 1 · 4 ＋ 1 · 1 ＝ 16 ＋ 4 ＋ 1 ＝ ${ans}.`,
    };
  },
];

export default function SistimaArithmisisAsk() {
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
      title="Ασκήσεις: Συστήματα Αρίθμησης | Α' Γυμνασίου"
      description="Εξάσκηση σε 10 δυναμικές ασκήσεις στο Δεκαδικό, Δυαδικό και Οκταδικό σύστημα αρίθμησης."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/04-sistima-arithmisis"
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
              Συστήματα Αρίθμησης
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 10 επιλεγμένες ασκήσεις στα συστήματα αρίθμησης (Δεκαδικό, Δυαδικό, Οκταδικό). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία και αναλυτικές λύσεις.
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

                    {/* Feedback & Λύση - Σαφής διαχωρισμός χωρίς σύγχυση */}
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

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

// ========================================================
// ΔΕΞΑΜΕΝΗ 20 ΔΙΑΦΟΡΕΤΙΚΩΝ ΤΥΠΩΝ ΑΣΚΗΣΕΩΝ ΑΚΕΡΑΙΩΝ
// ========================================================
const EXERCISE_GENERATORS = [
  // 1. Απόλυτη τιμή αρνητικού ακέραιου (Input)
  () => {
    const n = randInt(3, 45);
    return {
      type: 'input',
      topic: 'ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question: `Υπολόγισε την απόλυτη τιμή: |－${n}|`,
      correctAnswer: n.toString(),
      solution: `Η απόλυτη τιμή ενός αρνητικού αριθμού ισούται με τον αντίθετό του, δηλαδή είναι πάντοτε θετική. Άρα |－${n}| ＝ ${n}.`,
    };
  },

  // 2. Απόλυτη τιμή θετικού ακέραιου (Input)
  () => {
    const n = randInt(12, 60);
    return {
      type: 'input',
      topic: 'ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question: `Υπολόγισε την απόλυτη τιμή: |＋${n}|`,
      correctAnswer: n.toString(),
      solution: `Η απόλυτη τιμή ενός θετικού αριθμού είναι ο ίδιος ο αριθμός. Επομένως |＋${n}| ＝ ${n}.`,
    };
  },

  // 3. Αντίθετος αρνητικού αριθμού (Input)
  () => {
    const n = randInt(5, 50);
    return {
      type: 'input',
      topic: 'ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ',
      question: `Ποιος είναι ο αντίθετος αριθμός του －${n};`,
      correctAnswer: n.toString(),
      solution: `Ο αντίθετος ενός αρνητικού αριθμού έχει το αντίθετο πρόσημο (θετικό) και την ίδια απόλυτη τιμή. Άρα ο αντίθετος του －${n} είναι το ＋${n} (ή ${n}).`,
    };
  },

  // 4. Αντίθετος θετικού αριθμού (Input)
  () => {
    const n = randInt(7, 40);
    return {
      type: 'input',
      topic: 'ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ',
      question: `Ποιος είναι ο αντίθετος αριθμός του ＋${n}; (πληκτρολόγησε με το πρόσημο －)`,
      correctAnswer: `-${n}`,
      solution: `Ο αντίθετος του ＋${n} είναι ο αριθμός με το ίδιο μέτρο αλλά αντίθετο πρόσημο, δηλαδή ο －${n}.`,
    };
  },

  // 5. Σύγκριση δύο αρνητικών ακεραίων (MCQ)
  () => {
    const val1 = randInt(2, 10);
    const val2 = randInt(12, 25);
    // π.χ. -val1 > -val2 (αφού val1 < val2)
    const correct = `－${val1} ＞ －${val2}`;
    const candidates = [
      `－${val1} ＜ －${val2}`,
      `－${val1} ＝ －${val2}`,
    ];
    return {
      type: 'mcq',
      topic: 'ΣΥΓΚΡΙΣΗ ΑΚΕΡΑΙΩΝ',
      question: `Ποια σχέση ισχύει μεταξύ των αριθμών －${val1} και －${val2};`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Μεταξύ δύο αρνητικών αριθμών μεγαλύτερος είναι εκείνος που έχει τη μικρότερη απόλυτη τιμή (βρίσκεται πιο κοντά στο 0 στον άξονα). Επειδή |－${val1}| ＝ ${val1} ＜ ${val2} ＝ |－${val2}|, ισχύει －${val1} ＞ －${val2}.`,
    };
  },

  // 6. Σύγκριση θετικού και αρνητικού (MCQ)
  () => {
    const pos = randInt(1, 8);
    const neg = randInt(10, 30);
    const correct = `＋${pos} ＞ －${neg}`;
    const candidates = [
      `＋${pos} ＜ －${neg}`,
      `＋${pos} ＝ －${neg}`,
    ];
    return {
      type: 'mcq',
      topic: 'ΣΥΓΚΡΙΣΗ ΑΚΕΡΑΙΩΝ',
      question: `Ποια σχέση ισχύει μεταξύ των αριθμών ＋${pos} και －${neg};`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Κάθε θετικός αριθμός είναι πάντοτε μεγαλύτερος από οποιονδήποτε αρνητικό αριθμό, ανεξάρτητα από τις απόλυτες τιμές τους. Άρα ＋${pos} ＞ －${neg}.`,
    };
  },

  // 7. Απόσταση δύο σημείων στον άξονα (Input)
  () => {
    const a = randInt(2, 8);
    const b = randInt(1, 7);
    // Απόσταση μεταξύ -a και +b είναι a + b
    const dist = a + b;
    return {
      type: 'input',
      topic: 'ΑΠΟΣΤΑΣΗ ΣΤΟΝ ΑΞΟΝΑ',
      question: `Πόσες μονάδες απέχουν μεταξύ τους στον άξονα τα σημεία Α(－${a}) και Β(＋${b});`,
      correctAnswer: dist.toString(),
      solution: `Η απόσταση δύο σημείων στον άξονα ισούται με τη διαφορά της μεγαλύτερης τετμημένης από τη μικρότερη: d ＝ ＋${b} － (－${a}) ＝ ${b} ＋ ${a} ＝ ${dist} μονάδες.`,
    };
  },

  // 8. Άθροισμα απολύτων τιμών (Input)
  () => {
    const a = randInt(4, 15);
    const b = randInt(5, 15);
    const ans = a + b;
    return {
      type: 'input',
      topic: 'ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question: `Υπολόγισε την τιμή της παράστασης: |－${a}| ＋ |＋${b}|`,
      correctAnswer: ans.toString(),
      solution: `|－${a}| ＝ ${a} και |＋${b}| ＝ ${b}. Επομένως ${a} ＋ ${b} ＝ ${ans}.`,
    };
  },

  // 9. Διαφορά απολύτων τιμών (Input)
  () => {
    const a = randInt(15, 30);
    const b = randInt(2, 10);
    const ans = a - b;
    return {
      type: 'input',
      topic: 'ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question: `Υπολόγισε την τιμή της παράστασης: |－${a}| － |－${b}|`,
      correctAnswer: ans.toString(),
      solution: `|－${a}| ＝ ${a} και |－${b}| ＝ ${b}. Άρα ${a} － ${b} ＝ ${ans}.`,
    };
  },

  // 10. Το μηδέν ως ακέραιος (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΜΗΔΕΝΟΣ',
      question: `Ποιος από τους παρακάτω χαρακτηρισμούς ισχύει για τον αριθμό 0;`,
      options: makeUniqueOptions(
        'Δεν είναι ούτε θετικός ούτε αρνητικός',
        ['Είναι θετικός αριθμός', 'Είναι αρνητικός αριθμός', 'Είναι πρώτος αριθμός']
      ),
      correctAnswer: 'Δεν είναι ούτε θετικός ούτε αρνητικός',
      solution: `Το μηδέν (0) είναι το ουδέτερο σημείο αναφοράς στον άξονα των αριθμών και δεν ανήκει ούτε στους θετικούς ούτε στους αρνητικούς αριθμούς.`,
    };
  },

  // 11. Αντίθετος του μηδενός (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ',
      question: `Ποιος είναι ο αντίθετος αριθμός του 0;`,
      correctAnswer: '0',
      solution: `Ο μοναδικός αριθμός που είναι ίσος με τον αντίθετό του είναι το 0, επειδή －0 ＝ 0.`,
    };
  },

  // 12. Εξίσωση με απόλυτη τιμή |x| = k (MCQ)
  () => {
    const k = randInt(3, 12);
    const correct = `x ＝ ＋${k} ή x ＝ －${k}`;
    const candidates = [
      `Μόνο x ＝ ＋${k}`,
      `Μόνο x ＝ －${k}`,
      `x ＝ 0`,
    ];
    return {
      type: 'mcq',
      topic: 'ΕΞΙΣΩΣΕΙΣ ΜΕ ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question: `Αν |x| ＝ ${k}, ποιες είναι οι δυνατές τιμές του x;`,
      options: makeUniqueOptions(correct, candidates),
      correctAnswer: correct,
      solution: `Υπάρχουν ακριβώς δύο αντίθετοι αριθμοί που απέχουν απόσταση ${k} από το 0: ο ＋${k} και ο －${k}.`,
    };
  },

  // 13. Αδύνατη απόλυτη τιμή (MCQ)
  () => {
    const neg = randInt(2, 9);
    return {
      type: 'mcq',
      topic: 'ΙΔΙΟΤΗΤΕΣ ΑΠΟΛΥΤΗΣ ΤΙΜΗΣ',
      question: `Πόσες λύσεις έχει η εξίσωση |x| ＝ －${neg};`,
      options: makeUniqueOptions('Καμία (είναι αδύνατη)', ['Μία λύση', 'Δύο λύσεις', 'Άπειρες λύσεις']),
      correctAnswer: 'Καμία (είναι αδύνατη)',
      solution: `Η απόλυτη τιμή εκφράζει γεωμετρική απόσταση και είναι πάντοτε θετική ή μηδέν (|x| ≥ 0). Δεν μπορεί ποτέ να ισούται με αρνητικό αριθμό.`,
    };
  },

  // 14. Πρακτικό πρόβλημα: Μεταβολή θερμοκρασίας (Input)
  () => {
    const initialTemp = randInt(2, 7);
    const drop = randInt(initialTemp + 2, initialTemp + 8);
    const finalTemp = initialTemp - drop;
    return {
      type: 'input',
      topic: 'ΠΡΑΚΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ',
      question: `Το πρωί η θερμοκρασία ήταν ＋${initialTemp} °C και το βράδυ έπεσε κατά ${drop} °C. Ποια είναι η νέα θερμοκρασία σε °C; (πληκτρολόγησε το πρόσημο －)`,
      correctAnswer: `${finalTemp}`,
      solution: `Ξεκινάμε από το ＋${initialTemp} και κινούμαστε αριστερά κατά ${drop} μονάδες: ${initialTemp} － ${drop} ＝ ${finalTemp} °C.`,
    };
  },

  // 15. Πρακτικό πρόβλημα: Υψόμετρο (Input)
  () => {
    const depth = randInt(40, 120);
    return {
      type: 'input',
      topic: 'ΠΡΑΚΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ',
      question: `Ένα υποβρύχιο βρίσκεται ${depth} μέτρα κάτω από την επιφάνεια της θάλασσας. Με ποιον ακέραιο αριθμό εκφράζεται το βάθος του σε μέτρα;`,
      correctAnswer: `-${depth}`,
      solution: `Επειδή βρίσκεται κάτω από την επιφάνεια της θάλασσας (σημείο 0), το υψόμετρο εκφράζεται με αρνητικό πρόσημο: －${depth} m.`,
    };
  },

  // 16. Σύνολο ακεραίων ανάμεσα σε δύο τιμές (Input)
  () => {
    const k = randInt(2, 4);
    // ακέραιοι μεταξύ -k και +k: από -(k-1) έως (k-1), πλήθος = 2*(k-1) + 1 = 2k - 1
    const count = 2 * k - 1;
    return {
      type: 'input',
      topic: 'ΔΙΑΤΑΞΗ ΑΚΕΡΑΙΩΝ',
      question: `Πόσοι ακέραιοι αριθμοί x ικανοποιούν τη σχέση: －${k} ＜ x ＜ ＋${k};`,
      correctAnswer: count.toString(),
      solution: `Οι ακέραιοι που βρίσκονται αυστηρά ανάμεσα στο －${k} και το ＋${k} είναι οι: ${Array.from(
        { length: count },
        (_, i) => i - (k - 1)
      ).join(', ')}. Συνολικά είναι ${count} αριθμοί.`,
    };
  },

  // 17. Μέγιστος αρνητικός ακέραιος (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΔΙΑΤΑΞΗ ΑΚΕΡΑΙΩΝ',
      question: `Ποιος είναι ο μεγαλύτερος αρνητικός ακέραιος αριθμός;`,
      options: makeUniqueOptions('－1', ['0', '－10', 'Δεν υπάρχει']),
      correctAnswer: '－1',
      solution: `Ο αριθμός －1 είναι ο αρνητικός ακέραιος που βρίσκεται πιο κοντά στο 0 (έχει τη μικρότερη απόλυτη τιμή ανάμεσα στους αρνητικούς), επομένως είναι ο μεγαλύτερος όλων των αρνητικών ακεραίων.`,
    };
  },

  // 18. Ελάχιστος θετικός ακέραιος (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΔΙΑΤΑΞΗ ΑΚΕΡΑΙΩΝ',
      question: `Ποιος είναι ο μικρότερος θετικός ακέραιος αριθμός;`,
      correctAnswer: '1',
      solution: `Οι θετικοί ακέραιοι ξεκινούν από το ＋1 (ή 1), καθώς το 0 δεν είναι θετικός.`,
    };
  },

  // 19. Άθροισμα αντιθέτων αριθμών (Input)
  () => {
    const n = randInt(14, 85);
    return {
      type: 'input',
      topic: 'ΑΝΤΙΘΕΤΟΙ ΑΡΙΘΜΟΙ',
      question: `Υπολόγισε το άθροισμα των αντιθέτων αριθμών: (＋${n}) ＋ (－${n})`,
      correctAnswer: '0',
      solution: `Το άθροισμα δύο αντίθετων αριθμών ισούται πάντοτε με το μηδέν (α ＋ (－α) ＝ 0).`,
    };
  },

  // 20. Σύγκριση απολύτων τιμών (MCQ)
  () => {
    const a = 12;
    const b = -12;
    return {
      type: 'mcq',
      topic: 'ΑΠΟΛΥΤΗ ΤΙΜΗ',
      question: `Ποια σχέση ισχύει μεταξύ των απολύτων τιμών |＋${a}| και |－${a}|;`,
      options: makeUniqueOptions(
        `|＋${a}| ＝ |－${a}|`,
        [`|＋${a}| ＞ |－${a}|`, `|＋${a}| ＜ |－${a}|`]
      ),
      correctAnswer: `|＋${a}| ＝ |－${a}|`,
      solution: `Δύο αντίθετοι αριθμοί απέχουν την ίδια απόσταση από το μηδέν, επομένως έχουν ίσες απόλυτες τιμές: |＋${a}| ＝ ${a} και |－${a}| ＝ ${a}.`,
    };
  },
];

export default function AkeraioiAsk() {
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

  // Έλεγχος εισαγωγής input: ψηφία, προαιρετικό αρχικό πρόσημο μείον '-' και έως ένα κόμμα ','
  const handleInputChange = (id, val) => {
    if (isSubmitted) return;
    let clean = val.replace('.', ',');
    // Επιτρέπουμε μόνο αριθμούς, κόμμα και πρόσημο μείον
    clean = clean.replace(/[^0-9,-]/g, '');

    // Το μείον επιτρέπεται μόνο στην αρχή
    if (clean.includes('-')) {
      const parts = clean.split('-');
      clean = '-' + parts.join('').replace(/-/g, '');
    }

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
      let userAns = (userAnswers[q.id] || '').trim().replace(/\s+/g, '');
      let correctAns = q.correctAnswer.trim().replace(/\s+/g, '');

      // Απαλοιφή προαιρετικού αρχικού '+' αν πληκτρολογηθεί
      userAns = userAns.replace(/^\+/, '');
      correctAns = correctAns.replace(/^\+/, '');

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
      title="Ασκήσεις: Ακέραιοι Αριθμοί | Α' Γυμνασίου"
      description="Εξάσκηση σε 10 δυναμικές ασκήσεις στους ακέραιους αριθμούς, την απόλυτη τιμή, τους αντίθετους και τη διάταξη."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/05-akeraioi"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
        >
          <span>📖</span>
          <span>ΘΕΩΡΙΑ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 pb-32 sm:pb-36 space-y-8">
        {/* Banner Header - Ενιαίο Indigo Theme χωρίς τόνους στα κεφαλαία */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Ακέραιοι Αριθμοί
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 10 επιλεγμένες ασκήσεις στους ακέραιους αριθμούς, τις απόλυτες τιμές και τους αντίθετους. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία και αναλυτικές λύσεις.
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns.trim().replace(/\s+/g, '').replace(/^\+/, '');
              const cleanCorrect = q.correctAnswer.trim().replace(/\s+/g, '').replace(/^\+/, '');
              const isCorrect = isSubmitted && cleanUser === cleanCorrect;

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
                          inputMode="text"
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

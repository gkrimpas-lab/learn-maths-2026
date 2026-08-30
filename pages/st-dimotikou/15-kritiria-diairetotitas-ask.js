import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// Βοηθητικές συναρτήσεις
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sumDigits(numStr) {
  return numStr.split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
}

// Δεξαμενή 10 θεματικών σεναρίων καθημερινότητας με σωστή σύνταξη και τυχαία/συγκεκριμένα πλήθη
const REAL_WORLD_PROBLEMS_Q8 = [
  {
    prompt: (num) => `Έχουμε ${num} τετράδια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 377,
    correctOption: 'Δεν είναι δυνατόν χωρίς υπόλοιπο',
    wrongOptions: ['Σε ομάδες των 2', 'Σε ομάδες των 5', 'Σε ομάδες των 10'],
    explain: 'Ο αριθμός 377 δεν διαιρείται ακριβώς με κανέναν από τους βασικούς διαιρέτες χωρίς υπόλοιπο.'
  },
  {
    prompt: (num) => `Έχουμε ${num} τετράδια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 284,
    correctOption: 'Σε ομάδες των 4',
    wrongOptions: ['Σε ομάδες των 5', 'Σε ομάδες των 9', 'Σε ομάδες των 10'],
    explain: 'Ο αριθμός 284 λήγει σε 84, άρα διαιρείται ακριβώς με το 4 (284 : 4 ＝ 71).'
  },
  {
    prompt: (num) => `Έχουμε ${num} ευρώ. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 303,
    correctOption: 'Σε μερίδια των 3',
    wrongOptions: ['Σε μερίδια των 2', 'Σε μερίδια των 5', 'Σε μερίδια των 10'],
    explain: 'Το άθροισμα των ψηφίων του 303 είναι 3＋0＋3 ＝ 6, άρα διαιρείται ακριβώς με το 3.'
  },
  {
    prompt: (num) => `Έχουμε ${num} μαθητές. Με ποιον τρόπο μπορούμε να τους μοιράσουμε ισόποσα χωρίς να περισσέψει κανένας;`,
    total: 390,
    correctOption: 'Σε ομάδες των 10',
    wrongOptions: ['Σε ομάδες των 4', 'Σε ομάδες των 9', 'Σε ομάδες των 25'],
    explain: 'Ο αριθμός 390 λήγει σε 0, άρα διαιρείται ακριβώς με το 10.'
  },
  {
    prompt: (num) => `Έχουμε ${num} καραμέλες. Με ποιον τρόπο μπορούμε να τις μοιράσουμε ισόποσα χωρίς να περισσέψει καμία;`,
    total: 395,
    correctOption: 'Σε σακουλάκια των 5',
    wrongOptions: ['Σε σακουλάκια των 2', 'Σε σακουλάκια των 4', 'Σε σακουλάκια των 9'],
    explain: 'Ο αριθμός 395 λήγει σε 5, άρα διαιρείται ακριβώς με το 5.'
  },
  {
    prompt: (num) => `Έχουμε ${num} βιβλία. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 450,
    correctOption: 'Σε πακέτα των 25',
    wrongOptions: ['Σε πακέτα των 4', 'Σε πακέτα των 9', 'Σε πακέτα των 3'],
    explain: 'Ο αριθμός 450 τελειώνει σε 50, άρα διαιρείται ακριβώς με το 25.'
  },
  {
    prompt: (num) => `Έχουμε ${num} μήλα. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 729,
    correctOption: 'Σε καλάθια των 9',
    wrongOptions: ['Σε καλάθια των 2', 'Σε καλάθια των 5', 'Σε καλάθια των 10'],
    explain: 'Το άθροισμα των ψηφίων του 729 είναι 7＋2＋9 ＝ 18, το οποίο διαιρείται με το 9.'
  },
  {
    prompt: (num) => `Έχουμε ${num} λουλούδια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 524,
    correctOption: 'Σε ανθοδέσμες των 4',
    wrongOptions: ['Σε ανθοδέσμες των 5', 'Σε ανθοδέσμες των 9', 'Σε ανθοδέσμες των 10'],
    explain: 'Τα δύο τελευταία ψηφία του 524 είναι το 24, που διαιρείται με το 4.'
  },
  {
    prompt: (num) => `Έχουμε ${num} σοκολατάκια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
    total: 810,
    correctOption: 'Σε κουτάκια των 10',
    wrongOptions: ['Σε κουτάκια των 4', 'Σε κουτάκια των 25', 'Σε κουτάκια των 9'],
    explain: 'Ο αριθμός 810 λήγει σε 0, άρα διαιρείται ακριβώς με το 10.'
  },
  {
    prompt: (num) => `Έχουμε ${num} μπάρες δημητριακών. Με ποιον τρόπο μπορούμε να τις μοιράσουμε ισόποσα χωρίς να περισσέψει καμία;`,
    total: 625,
    correctOption: 'Σε πακέτα των 25',
    wrongOptions: ['Σε πακέτα των 2', 'Σε πακέτα των 3', 'Σε πακέτα των 9'],
    explain: 'Ο αριθμός 625 τελειώνει σε 25, άρα διαιρείται ακριβώς με το 25.'
  }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  // Q1: Interactive Yes/No Buttons - Διαιρετότητα με το 2, 5 ή 10
  const q1Div = [2, 5, 10][getRandomInt(0, 2)];
  const q1IsDivisible = Math.random() > 0.5;
  let q1Num = getRandomInt(120, 980);

  if (q1IsDivisible) {
    if (q1Div === 2) {
      if (q1Num % 2 !== 0) q1Num += 1;
    } else if (q1Div === 5) {
      q1Num = Math.floor(q1Num / 5) * 5;
    } else {
      q1Num = Math.floor(q1Num / 10) * 10;
    }
  } else {
    if (q1Div === 2) {
      if (q1Num % 2 === 0) q1Num += 1;
    } else if (q1Div === 5) {
      if (q1Num % 5 === 0) q1Num += 3;
    } else {
      if (q1Num % 10 === 0) q1Num += 3;
    }
  }

  const q1Correct = q1Num % q1Div === 0 ? 'Ναι' : 'Όχι';
  const q1Prompt = `Διαιρείται ο αριθμός ${q1Num} ακριβώς με το ${q1Div};`;

  // Q2: Input - Άθροισμα ψηφίων & Διαιρετότητα με το 3 ή 9
  const q2Div = [3, 9][getRandomInt(0, 1)];
  let q2Num = getRandomInt(110, 890);
  if (q2Div === 3) {
    while (sumDigits(String(q2Num)) % 3 !== 0) q2Num++;
  } else {
    while (sumDigits(String(q2Num)) % 9 !== 0) q2Num++;
  }
  const q2Sum = sumDigits(String(q2Num));
  const q2Prompt = `Ποιο είναι το άθροισμα των ψηφίων του αριθμού ${q2Num};`;
  const q2Correct = String(q2Sum);

  // Q3: MCQ - Διαιρετότητα με το 4 ή το 25
  const q3Div = [4, 25][getRandomInt(0, 1)];
  let q3ValidNum = getRandomInt(100, 900);
  if (q3Div === 4) {
    while (q3ValidNum % 4 !== 0) q3ValidNum++;
  } else {
    q3ValidNum = Math.floor(q3ValidNum / 25) * 25;
  }
  const q3Invalid1 = q3ValidNum + (q3Div === 4 ? 2 : 10);
  const q3Invalid2 = q3ValidNum + (q3Div === 4 ? 3 : 15);
  const q3Invalid3 = q3ValidNum + (q3Div === 4 ? 1 : 7);
  const q3Options = shuffle([
    String(q3ValidNum),
    String(q3Invalid1),
    String(q3Invalid2),
    String(q3Invalid3)
  ]);

  // Q4: MCQ - Εύρεση ψηφίου που λείπει
  const q4Div = [3, 9][getRandomInt(0, 1)];
  const d1 = getRandomInt(1, 8);
  const d3 = getRandomInt(1, 8);
  let correctDigit = 0;
  for (let digit = 0; digit <= 9; digit++) {
    if ((d1 + digit + d3) % q4Div === 0) {
      correctDigit = digit;
      break;
    }
  }
  const q4NumberPattern = `${d1} _ ${d3}`;
  const q4Options = shuffle([
    String(correctDigit),
    String((correctDigit + 1) % 10),
    String((correctDigit + 2) % 10),
    String((correctDigit + 4) % 10)
  ]);

  // Q5: True / False - Κανόνας για το 3 και 9
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Ένας αριθμός διαιρείται με το 9 όταν το άθροισμα των ψηφίων του διαιρείται με το 9.'
    : 'Ένας αριθμός διαιρείται με το 9 όταν το τελευταίο του ψηφίο είναι το 9.';

  // Q6: True / False - Κανόνας για το 4 και 25
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Ένας αριθμός διαιρείται με το 25 όταν τα δύο τελευταία του ψηφία είναι 00, 25, 50 ή 75.'
    : 'Ένας αριθμός διαιρείται με το 25 όταν το τελευταίο του ψηφίο είναι το 5.';

  // Q7: Input - Ταυτόχρονη διαιρετότητα (με 2, 5 και 10)
  const q7Options = [120, 240, 350, 480, 500, 620, 750, 900];
  const q7Num = q7Options[getRandomInt(0, q7Options.length - 1)];
  const q7Correct = '10';

  // Q8: MCQ - Τυχαία επιλογή από τη δεξαμενή των 10 προβλημάτων
  const shuffledQ8Pool = shuffle(REAL_WORLD_PROBLEMS_Q8);
  const selectedQ8 = shuffledQ8Pool[0];
  const q8Prompt = selectedQ8.prompt(selectedQ8.total);
  const q8CorrectStr = selectedQ8.correctOption;
  const q8Options = shuffle([selectedQ8.correctOption, ...selectedQ8.wrongOptions]);
  const q8Explain = selectedQ8.explain;

  return {
    q1: {
      type: 'yesno',
      title: 'Διαιρετότητα με 2, 5, 10',
      prompt: q1Prompt,
      number: String(q1Num),
      divisor: q1Div,
      correct: q1Correct,
      explain: q1Num % q1Div === 0
        ? `Σωστά! Το τελευταίο ψηφίο είναι ${q1Num % 10}, επομένως ο αριθμός ${q1Num} διαιρείται ακριβώς με το ${q1Div}.`
        : `Ο αριθμός ${q1Num} τελειώνει σε ${q1Num % 10}, άρα ΔΕΝ διαιρείται ακριβώς με το ${q1Div}.`
    },
    q2: {
      type: 'input',
      title: 'Άθροισμα Ψηφίων',
      prompt: q2Prompt,
      number: String(q2Num),
      correct: q2Correct,
      explain: `Τα ψηφία του αριθμού ${q2Num} είναι: ${String(q2Num).split('').join(' ＋ ')} ＝ ${q2Sum}.`
    },
    q3: {
      type: 'mcq',
      title: 'Διαιρετότητα με το 4 & 25',
      prompt: `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το ${q3Div};`,
      options: q3Options,
      correct: String(q3ValidNum),
      explain: q3Div === 4
        ? `Τα δύο τελευταία ψηφία του ${q3ValidNum} (${String(q3ValidNum).slice(-2)}) διαιρούνται με το 4.`
        : `Ο αριθμός ${q3ValidNum} τελειώνει σε ${String(q3ValidNum).slice(-2)}, άρα διαιρείται με το 25.`
    },
    q4: {
      type: 'mcq',
      title: 'Εύρεση Ψηφίου που Λείπει',
      prompt: `Ποιο ψηφίο πρέπει να μπει στο κενό του αριθμού ${q4NumberPattern} ώστε να διαιρείται ακριβώς με το ${q4Div};`,
      options: q4Options,
      correct: String(correctDigit),
      explain: `Βάζοντας το ψηφίο ${correctDigit}, το άθροισμα των ψηφίων γίνεται ${d1} ＋ ${correctDigit} ＋ ${d3} ＝ ${d1 + correctDigit + d3}, που διαιρείται με το ${q4Div}.`
    },
    q5: {
      type: 'tf',
      title: 'Κανόνας Διαιρετότητας με το 9',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Για το 3 και το 9 αρκεί να προσθέσουμε τα ψηφία του αριθμού.'
        : 'Λάθος! Για τη διαιρετότητα με το 9 εξετάζουμε το ΑΘΡΟΙΣΜΑ των ψηφίων, όχι μόνο το τελευταίο ψηφίο.'
    },
    q6: {
      type: 'tf',
      title: 'Κανόνας Διαιρετότητας με το 25',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Τα δύο τελευταία ψηφία πρέπει να σχηματίζουν 00, 25, 50 ή 75.'
        : 'Λάθος! Δεν αρκεί το τελευταίο ψηφίο να είναι 5 (π.χ. το 15 λήγει σε 5 αλλά ΔΕΝ διαιρείται με το 25).'
    },
    q7: {
      type: 'input',
      title: 'Ταυτόχρονη Διαιρετότητα',
      number: String(q7Num),
      correct: q7Correct,
      explain: `Ο αριθμός ${q7Num} τελειώνει σε 0, άρα διαιρείται ταυτόχρονα με το 2, το 5 και το 10.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: q8Prompt,
      options: q8Options,
      correct: q8CorrectStr,
      explain: q8Explain
    }
  };
}

export default function KritiriaDiairetotitasExercisesPage() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: null, q6: null, q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions());
    setAnswers({
      q1: '', q2: '', q3: '', q4: '', q5: null, q6: null, q7: '', q8: ''
    });
    setSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    loadNewQuestions();
  }, []);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const isCorrect = (key) => {
    const q = questions[key];
    const a = answers[key];

    if (q.type === 'yesno') {
      return a === q.correct;
    }
    if (q.type === 'input') {
      if (typeof a !== 'string' || !a.trim()) return false;
      const cleanAns = a.replace(/\s+/g, '').trim().toLowerCase();
      const cleanCorrect = q.correct.replace(/\s+/g, '').trim().toLowerCase();
      return cleanAns === cleanCorrect;
    }
    if (q.type === 'mcq') {
      return a === q.correct;
    }
    if (q.type === 'tf') {
      return a === q.correct;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let s = 0;
    ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'].forEach(k => {
      if (isCorrect(k)) s += 1;
    });

    setScore(s);
    setSubmitted(true);
  };

  const getCardStyle = (key) => {
    if (!submitted) return 'bg-white border-slate-200 shadow-sm';
    return isCorrect(key)
      ? 'bg-emerald-50/60 border-emerald-400 shadow-md ring-1 ring-emerald-400'
      : 'bg-rose-50/60 border-rose-400 shadow-md ring-1 ring-rose-400';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between pb-32">
      <Head>
        <title>🎯 Ασκήσεις: Κριτήρια Διαιρετότητας - ΣΤ' Δημοτικού | LearnMaths.gr</title>
        <meta name="description" content="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στα κριτήρια διαιρετότητας για τη ΣΤ' Δημοτικού." />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className={`${LAYOUT.CONTAINER} py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight flex items-center">
              <span>LearnMaths</span><span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link 
                href="/st-dimotikou/15-kritiria-diairetotitas" 
                className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-200 transition"
              >
                <span>📖</span> <span>Θεωρία</span>
              </Link>
              <Link 
                href="/st-dimotikou" 
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition"
              >
                <span>🔙</span> <span>Πίσω</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* 2. HEADER HERO BANNER */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white py-10 px-4 shadow-inner">
          <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-6`}>
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-100 border border-white/20">
                <span>🎯 ΣΤ' Δημοτικου • Εξασκηση</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Διαδραστικές Ασκήσεις: Κριτήρια Διαιρετότητας
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-xl">
                Λύσε τα 8 δυναμικά προβλήματα κριτηρίων διαιρετότητας με το 2, 3, 4, 5, 9, 10 και 25!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewQuestions}
              className="px-5 py-3 bg-white text-blue-800 hover:bg-blue-50 rounded-2xl font-extrabold shadow-md transition transform active:scale-95 text-sm flex items-center gap-2 shrink-0"
            >
              <span>🔄</span> <span>Νέες Ασκήσεις</span>
            </button>
          </div>
        </section>

        {/* 3. ΦΟΡΜΑ ΜΕ ΤΙΣ 8 ΕΡΩΤΗΣΕΙΣ */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* ΕΡΩΤΗΣΗ 1 */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q1')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Άσκηση 1 • Διαιρετότητα με 2, 5, 10
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-6 leading-relaxed font-medium">
                  {questions.q1.prompt}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q1', 'Ναι')}
                    className={`py-3 rounded-xl font-black text-sm border transition ${
                      answers.q1 === 'Ναι'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    👍 Ναι
                  </button>
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q1', 'Όχι')}
                    className={`py-3 rounded-xl font-black text-sm border transition ${
                      answers.q1 === 'Όχι'
                        ? 'bg-rose-600 text-white border-rose-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                    }`}
                  >
                    👎 Όχι
                  </button>
                </div>
                {submitted && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q1') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                    💡 {questions.q1.explain}
                  </div>
                )}
              </div>

              {/* ΕΡΩΤΗΣΗ 2 */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q2')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                    Άσκηση 2 • Άθροισμα Ψηφίων
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q2.prompt}
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q2}
                    onChange={(e) => handleInputChange('q2', e.target.value)}
                    placeholder="Γράψε το άθροισμα..."
                    className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono"
                  />
                  {submitted && (
                    <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q2') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                      💡 {questions.q2.explain}
                    </div>
                  )}
                </div>
              </div>

              {/* ΕΡΩΤΗΣΗ 3 */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q3')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                    Άσκηση 3 • Διαιρετότητα με 4 & 25
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q3') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q3.prompt}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {questions.q3.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleInputChange('q3', opt)}
                      className={`p-3 rounded-xl text-sm font-mono font-bold border text-center transition ${
                        answers.q3 === opt
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {submitted && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q3') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                    💡 {questions.q3.explain}
                  </div>
                )}
              </div>

              {/* ΕΡΩΤΗΣΗ 4 */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q4')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                    Άσκηση 4 • Ψηφίο που Λείπει
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q4') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q4.prompt}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {questions.q4.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleInputChange('q4', opt)}
                      className={`p-3 rounded-xl text-sm font-mono font-black border text-center transition ${
                        answers.q4 === opt
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {submitted && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q4') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                    💡 {questions.q4.explain}
                  </div>
                )}
              </div>

              {/* ΕΡΩΤΗΣΗ 5 */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q5')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                    Άσκηση 5 • Σωστό ή Λάθος
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q5') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-6 leading-relaxed font-medium">
                  «{questions.q5.text}»
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q5', true)}
                    className={`py-3 rounded-xl font-black text-sm border transition ${
                      answers.q5 === true
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    👍 Σωστό
                  </button>
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q5', false)}
                    className={`py-3 rounded-xl font-black text-sm border transition ${
                      answers.q5 === false
                        ? 'bg-rose-600 text-white border-rose-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                    }`}
                  >
                    👎 Λάθος
                  </button>
                </div>
                {submitted && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q5') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                    💡 {questions.q5.explain}
                  </div>
                )}
              </div>

              {/* ΕΡΩΤΗΣΗ 6 */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q6')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full">
                    Άσκηση 6 • Σωστό ή Λάθος
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q6') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-6 leading-relaxed font-medium">
                  «{questions.q6.text}»
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q6', true)}
                    className={`py-3 rounded-xl font-black text-sm border transition ${
                      answers.q6 === true
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    👍 Σωστό
                  </button>
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q6', false)}
                    className={`py-3 rounded-xl font-black text-sm border transition ${
                      answers.q6 === false
                        ? 'bg-rose-600 text-white border-rose-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                    }`}
                  >
                    👎 Λάθος
                  </button>
                </div>
                {submitted && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q6') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                    💡 {questions.q6.explain}
                  </div>
                )}
              </div>

              {/* ΕΡΩΤΗΣΗ 7 */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q7')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-rose-100 text-rose-800 rounded-full">
                    Άσκηση 7 • Ταυτόχρονη Διαιρετότητα
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 font-medium">
                  Ο αριθμός <strong className="text-rose-700 font-mono text-base">{questions.q7.number}</strong> διαιρείται ταυτόχρονα με το 2 και το 5. Με ποιον άλλον αριθμό διαιρείται σίγουρα;
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q7}
                    onChange={(e) => handleInputChange('q7', e.target.value)}
                    placeholder="Γράψε τον αριθμό..."
                    className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-rose-500 outline-none disabled:bg-slate-100 font-mono"
                  />
                  {submitted && (
                    <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q7') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                      💡 {questions.q7.explain}
                    </div>
                  )}
                </div>
              </div>

              {/* ΕΡΩΤΗΣΗ 8 */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q8')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-teal-100 text-teal-800 rounded-full">
                    Άσκηση 8 • Πρόβλημα Καθημερινότητας
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q8') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 font-medium">
                  {questions.q8.prompt}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {questions.q8.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleInputChange('q8', opt)}
                      className={`w-full p-2.5 rounded-xl text-xs font-bold border text-center transition ${
                        answers.q8 === opt
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {submitted && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q8') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                    💡 {questions.q8.explain}
                  </div>
                )}
              </div>

            </div>

            {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
            {!submitted && (
              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  className="bg-[#10b981] hover:bg-[#059669] text-white text-base md:text-lg font-black px-8 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5"
                >
                  <span className="text-xl">🎯</span>
                  <span>Έλεγχος Απαντήσεων</span>
                </button>
              </div>
            )}
          </form>
        </main>
      </div>

      {/* 4. FIXED STICKY BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-4 px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-3`}>
          
          {/* ΑΡΙΣΤΕΡΑ: SCORE BADGE & PERCENTAGE */}
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>Σκορ:</span>
              <span className="font-mono text-xl md:text-2xl">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-sm font-bold text-slate-300">
                Ποσοστό Επιτυχίας: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          {/* ΔΕΞΙΑ: GUIDANCE TEXT OR RETRY BUTTON */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                <span>🔄</span>
                <span>Παίξε ξανά με νέες ασκήσεις!</span>
              </button>
            ) : (
              <p className="text-xs md:text-sm text-slate-400 hidden sm:block">
                Συμπλήρωσε όλες τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

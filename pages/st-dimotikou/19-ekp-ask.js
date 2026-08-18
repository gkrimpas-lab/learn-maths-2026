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

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function lcmTwo(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function lcmArray(arr) {
  return arr.reduce((acc, curr) => lcmTwo(acc, curr), arr[0]);
}

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  // Q1: MCQ - Ε.Κ.Π. δύο απλών αριθμών
  const q1Pairs = [
    [4, 6], [6, 8], [3, 5], [6, 9], [8, 12], [5, 10], [4, 10], [9, 12]
  ];
  const q1Chosen = q1Pairs[getRandomInt(0, q1Pairs.length - 1)];
  const q1CorrectVal = lcmArray(q1Chosen);
  const q1Correct = String(q1CorrectVal);
  const q1Wrong1 = String(q1Chosen[0] * q1Chosen[1]); // Γινόμενο αν διαφέρει από το ΕΚΠ
  const q1Wrong2 = String(q1CorrectVal * 2);
  const q1Wrong3 = String(Math.max(...q1Chosen) + 2);
  const q1Options = shuffle(Array.from(new Set([q1Correct, q1Wrong1, q1Wrong2, q1Wrong3])).slice(0, 4));

  // Q2: Input - Ε.Κ.Π. δύο πρώτων μεταξύ τους αριθμών
  const q2Pairs = [
    [3, 4], [5, 7], [4, 9], [7, 8], [5, 9], [3, 8], [5, 6]
  ];
  const q2Chosen = q2Pairs[getRandomInt(0, q2Pairs.length - 1)];
  const q2CorrectVal = q2Chosen[0] * q2Chosen[1];
  const q2Prompt = `Ποιο είναι το Ε.Κ.Π. των αριθμών ${q2Chosen[0]} και ${q2Chosen[1]};`;
  const q2Correct = String(q2CorrectVal);

  // Q3: MCQ - Ε.Κ.Π. τριών αριθμών
  const q3Triplets = [
    { nums: [2, 3, 4], val: 12 },
    { nums: [3, 4, 6], val: 12 },
    { nums: [4, 6, 8], val: 24 },
    { nums: [6, 8, 12], val: 24 },
    { nums: [4, 5, 10], val: 20 },
    { nums: [3, 5, 15], val: 15 },
    { nums: [6, 10, 15], val: 30 }
  ];
  const q3Chosen = q3Triplets[getRandomInt(0, q3Triplets.length - 1)];
  const q3CorrectStr = String(q3Chosen.val);
  const q3Options = shuffle([
    q3CorrectStr,
    String(q3Chosen.val * 2),
    String(q3Chosen.nums[0] * q3Chosen.nums[1] * q3Chosen.nums[2]),
    String(q3Chosen.val + 6)
  ]);

  // Q4: MCQ - Εύρεση του 2ου κοινού πολλαπλασίου (2 * ΕΚΠ)
  const q4Pairs = [
    { nums: [4, 6], ekp: 12, second: 24 },
    { nums: [6, 8], ekp: 24, second: 48 },
    { nums: [5, 6], ekp: 30, second: 60 },
    { nums: [8, 12], ekp: 24, second: 48 },
    { nums: [10, 15], ekp: 30, second: 60 }
  ];
  const q4Chosen = q4Pairs[getRandomInt(0, q4Pairs.length - 1)];
  const q4Options = shuffle([
    String(q4Chosen.second),
    String(q4Chosen.ekp),
    String(q4Chosen.ekp * 3),
    String(q4Chosen.second + 10)
  ]);

  // Q5: True / False - Περίπτωση όπου ένας αριθμός είναι πολλαπλάσιο του άλλου
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Αν ένας αριθμός διαιρείται ακριβώς με έναν άλλον (π.χ. 12 και 4), τότε το Ε.Κ.Π. τους είναι ο μεγαλύτερος αριθμός (το 12).'
    : 'Αν ένας αριθμός διαιρείται ακριβώς με έναν άλλον (π.χ. 12 και 4), τότε το Ε.Κ.Π. τους είναι πάντα το γινόμενό τους (48).';

  // Q6: True / False - Σχέση ΕΚΠ με το 0
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Το Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.) είναι πάντα ένας θετικός αριθμός (δεν παίρνουμε ποτέ ως Ε.Κ.Π. το 0).'
    : 'Το Ε.Κ.Π. οποιωνδήποτε φυσικών αριθμών είναι πάντα το 0, επειδή το 0 είναι κοινό πολλαπλάσιο όλων.';

  // Q7: Input - Ε.Κ.Π. τεσσάρων αριθμών
  const q7Quads = [
    { nums: [2, 3, 4, 6], val: 12 },
    { nums: [2, 4, 6, 8], val: 24 },
    { nums: [3, 4, 6, 12], val: 12 },
    { nums: [2, 5, 10, 20], val: 20 },
    { nums: [3, 5, 6, 10], val: 30 }
  ];
  const q7Chosen = q7Quads[getRandomInt(0, q7Quads.length - 1)];
  const q7Prompt = `Ποιο είναι το Ε.Κ.Π. των 4 αριθμών (${q7Chosen.nums.join(', ')});`;
  const q7Correct = String(q7Chosen.val);

  // Q8: MCQ - Πρόβλημα Καθημερινότητας (Ταυτόχρονη συνάντηση / φανάρια / δρομολόγια)
  const q8Scenarios = [
    {
      itemA: 'Το πλοίο Α αναχωρεί κάθε 6 ώρες',
      itemB: 'το πλοίο Β κάθε 8 ώρες',
      q: 'Αν αναχωρήσουν ταυτόχρονα, μετά από πόσες ώρες θα αναχωρήσουν ξανά μαζί;',
      val: 24,
      unit: 'ώρες',
      wrong: [14, 48, 16]
    },
    {
      itemA: 'Ένα φανάρι ανάβει πράσινο κάθε 12 δευτερόλεπτα',
      itemB: 'ένα άλλο κάθε 15 δευτερόλεπτα',
      q: 'Κάθε πόσα δευτερόλεπτα θα ανάβουν πράσινο ταυτόχρονα;',
      val: 60,
      unit: 'δευτερόλεπτα',
      wrong: [27, 30, 180]
    },
    {
      itemA: 'Ο Νίκος επισκέπτεται τη γιαγιά του κάθε 4 ημέρες',
      itemB: 'η Ελένη κάθε 6 ημέρες',
      q: 'Αν συναντήθηκαν σήμερα, μετά από πόσες ημέρες θα ξανασυναντηθούν;',
      val: 12,
      unit: 'ημέρες',
      wrong: [10, 24, 18]
    }
  ];
  const q8Chosen = q8Scenarios[getRandomInt(0, q8Scenarios.length - 1)];
  const q8CorrectStr = `${q8Chosen.val} ${q8Chosen.unit}`;
  const q8Options = shuffle([
    q8CorrectStr,
    ...q8Chosen.wrong.map(w => `${w} ${q8Chosen.unit}`)
  ]);

  return {
    q1: {
      type: 'mcq',
      title: 'Ε.Κ.Π. Δύο Αριθμών',
      prompt: `Ποιο είναι το Ε.Κ.Π. των αριθμών ${q1Chosen[0]} και ${q1Chosen[1]};`,
      options: q1Options,
      correct: q1Correct,
      explain: `Π(${q1Chosen[0]}): ${q1Chosen[0]}, ${q1Chosen[0]*2}, ${q1Chosen[0]*3}... και Π(${q1Chosen[1]}): ${q1Chosen[1]}, ${q1Chosen[1]*2}... Το μικρότερο κοινό είναι το ${q1Correct}.`
    },
    q2: {
      type: 'input',
      title: 'Πρώτοι μεταξύ τους',
      prompt: q2Prompt,
      correct: q2Correct,
      explain: `Επειδή οι αριθμοί ${q2Chosen[0]} και ${q2Chosen[1]} δεν έχουν κοινό διαιρέτη εκτός του 1, το Ε.Κ.Π. τους ισούται με το γινόμενό τους: ${q2Chosen[0]} × ${q2Chosen[1]} ＝ ${q2Correct}.`
    },
    q3: {
      type: 'mcq',
      title: 'Ε.Κ.Π. Τριών Αριθμών',
      prompt: `Ποιο είναι το Ε.Κ.Π. των αριθμών (${q3Chosen.nums.join(', ')});`,
      options: q3Options,
      correct: q3CorrectStr,
      explain: `Ο αριθμός ${q3CorrectStr} είναι ο μικρότερος θετικός αριθμός που διαιρείται ακριβώς με το ${q3Chosen.nums[0]}, το ${q3Chosen.nums[1]} και το ${q3Chosen.nums[2]}.`
    },
    q4: {
      type: 'mcq',
      title: 'Επόμενο Κοινό Πολλαπλάσιο',
      prompt: `Το Ε.Κ.Π. των αριθμών ${q4Chosen.nums[0]} και ${q4Chosen.nums[1]} είναι το ${q4Chosen.ekp}. Ποιο είναι το αμέσως επόμενο (2ο) κοινό πολλαπλάσιό τους;`,
      options: q4Options,
      correct: String(q4Chosen.second),
      explain: `Τα κοινά πολλαπλάσια είναι τα πολλαπλάσια του Ε.Κ.Π.: 1ο ＝ ${q4Chosen.ekp}, 2ο ＝ ${q4Chosen.ekp} × 2 ＝ ${q4Chosen.second}.`
    },
    q5: {
      type: 'tf',
      title: 'Ειδική Περίπτωση Διαιρετότητας',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Όταν ένας αριθμός είναι πολλαπλάσιο ενός άλλου, το Ε.Κ.Π. τους είναι πάντα ο μεγαλύτερος αριθμός.'
        : 'Λάθος! Όταν ένας αριθμός διαιρείται από τον άλλον, το Ε.Κ.Π. είναι ο μεγαλύτερος αριθμός, όχι το γινόμενό τους.'
    },
    q6: {
      type: 'tf',
      title: 'Το 0 και το Ε.Κ.Π.',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Εξ ορισμού το Ε.Κ.Π. είναι το μικρότερο ΚΟΙΝΟ ΘΕΤΙΚΟ πολλαπλάσιο (διάφορο του μηδενός).'
        : 'Λάθος! Το 0 εξαιρείται από τον ορισμό του Ε.Κ.Π. γιατί διαφορετικά το Ε.Κ.Π. κάθε ομάδας αριθμών θα ήταν πάντα 0.'
    },
    q7: {
      type: 'input',
      title: 'Ε.Κ.Π. Τεσσάρων Αριθμών',
      prompt: q7Prompt,
      correct: q7Correct,
      explain: `Ε.Κ.Π.(${q7Chosen.nums.join(', ')}) ＝ ${q7Correct}.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: `${q8Chosen.itemA} και ${q8Chosen.itemB}. ${q8Chosen.q}`,
      options: q8Options,
      correct: q8CorrectStr,
      explain: `Βρίσκουμε το Ε.Κ.Π. των δύο χρόνων: Ε.Κ.Π. ＝ ${q8CorrectStr}.`
    }
  };
}

export default function EkpExercisesPage() {
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

    if (q.type === 'input') {
      if (typeof a !== 'string' || !a.trim()) return false;
      const cleanAns = a.replace(/\s+/g, '').trim();
      return cleanAns === q.correct;
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
        <title>🎯 Ασκήσεις: Ε.Κ.Π. - ΣΤ' Δημοτικού | LearnMaths.gr</title>
        <meta name="description" content="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στο Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.) για τη ΣΤ' Δημοτικού." />
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
                href="/st-dimotikou/19-ekp" 
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
                <span>🎯 ΣΤ' Δημοτικού • Εξάσκηση</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Διαδραστικές Ασκήσεις: Ε.Κ.Π.
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-xl">
                Λύσε τα 8 δυναμικά προβλήματα υπολογισμού του Ελάχιστου Κοινού Πολλαπλασίου για 2, 3 ή 4 αριθμούς!
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
                    Άσκηση 1 • Ε.Κ.Π. 2 Αριθμών
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q1.prompt}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {questions.q1.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleInputChange('q1', opt)}
                      className={`p-3 rounded-xl text-sm font-mono font-bold border text-center transition ${
                        answers.q1 === opt
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
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
                    Άσκηση 2 • Πρώτοι μεταξύ τους
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
                    placeholder="Γράψε το Ε.Κ.Π...."
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
                    Άσκηση 3 • Ε.Κ.Π. 3 Αριθμών
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
                    Άσκηση 4 • 2ο Κοινό Πολλαπλάσιο
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q4') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q4.prompt}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {questions.q4.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleInputChange('q4', opt)}
                      className={`p-3 rounded-xl text-sm font-mono font-bold border text-center transition ${
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
                    Άσκηση 5 • Σωστό ή Λάθος (Διαιρετότητα)
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
                    Άσκηση 6 • Σωστό ή Λάθος (Το 0)
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
                    Άσκηση 7 • Ε.Κ.Π. 4 Αριθμών
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 font-medium">
                  {questions.q7.prompt}
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q7}
                    onChange={(e) => handleInputChange('q7', e.target.value)}
                    placeholder="Γράψε το Ε.Κ.Π...."
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
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

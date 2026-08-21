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

function checkIsPrime(n) {
  if (n <= 1) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function getDivisors(n) {
  const divs = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) divs.push(i);
  }
  return divs;
}

// Δεξαμενή πρώτων και σύνθετων αριθμών
const PRIMES_UNDER_50 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
const COMPOSITES_UNDER_50 = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45, 46, 48, 49, 50];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  // Q1: MCQ - Κατηγοριοποίηση Αριθμού (Πρώτος ή Σύνθετος)
  const q1IsPrime = Math.random() > 0.5;
  const q1Num = q1IsPrime 
    ? PRIMES_UNDER_50[getRandomInt(2, PRIMES_UNDER_50.length - 1)] 
    : COMPOSITES_UNDER_50[getRandomInt(2, COMPOSITES_UNDER_50.length - 1)];
  const q1Correct = q1IsPrime ? 'Πρώτος' : 'Σύνθετος';
  const q1Options = shuffle(['Πρώτος', 'Σύνθετος']);

  // Q2: Input - Εύρεση του αμέσως επόμενου πρώτου αριθμού
  const baseQ2 = [10, 14, 20, 24, 30, 32, 38, 44][getRandomInt(0, 7)];
  let nextPrime = baseQ2 + 1;
  while (!checkIsPrime(nextPrime)) {
    nextPrime++;
  }
  const q2Prompt = `Ποιος είναι ο αμέσως επόμενος πρώτος αριθμός μετά το ${baseQ2};`;
  const q2Correct = String(nextPrime);

  // Q3: MCQ - Επιλογή Πρώτου Αριθμού ανάμεσα σε Σύνθετους
  const q3CorrectPrime = PRIMES_UNDER_50[getRandomInt(3, PRIMES_UNDER_50.length - 1)];
  const q3Composites = shuffle(COMPOSITES_UNDER_50).slice(0, 3);
  const q3Options = shuffle([String(q3CorrectPrime), ...q3Composites.map(String)]);

  // Q4: MCQ - Επιλογή Σύνθετου Αριθμού ανάμεσα σε Πρώτους
  const q4CorrectComp = COMPOSITES_UNDER_50[getRandomInt(3, COMPOSITES_UNDER_50.length - 1)];
  const q4Primes = shuffle(PRIMES_UNDER_50).slice(0, 3);
  const q4Options = shuffle([String(q4CorrectComp), ...q4Primes.map(String)]);

  // Q5: True / False - Κανόνας για το 0 και το 1
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Οι αριθμοί 0 και 1 δεν είναι ούτε πρώτοι ούτε σύνθετοι.'
    : 'Ο αριθμός 1 είναι ο μικρότερος πρώτος αριθμός.';

  // Q6: True / False - Κανόνας για τους ζυγούς αριθμούς
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Ο αριθμός 2 είναι ο μοναδικός ζυγός (άρτιος) πρώτος αριθμός.'
    : 'Όλοι οι ζυγοί (άρτιοι) αριθμοί είναι σύνθετοι.';

  // Q7: Input - Οπτικό Πλέγμα / Αριθμός Σχηματισμών
  const q7Num = [6, 7, 8, 11, 12, 13, 15, 17][getRandomInt(0, 7)];
  const q7Divs = getDivisors(q7Num);
  const q7IsPrime = checkIsPrime(q7Num);
  const q7Correct = q7IsPrime ? '2' : String(q7Divs.length);

  // Q8: MCQ - Πρόβλημα Καθημερινότητας (Ισόποσο μοίρασμα σε ομάδες)
  const q8Students = [17, 19, 23, 29, 31][getRandomInt(0, 4)];
  const q8CorrectStr = 'Όχι, γιατί ο αριθμός είναι πρώτος και διαιρείται μόνο με το 1 και τον εαυτό του';
  const q8Wrong1 = 'Ναι, σε 2 ίσες ομάδες';
  const q8Wrong2 = 'Ναι, σε 3 ίσες ομάδες';
  const q8Wrong3 = 'Ναι, σε 5 ίσες ομάδες';
  const q8Options = shuffle([q8CorrectStr, q8Wrong1, q8Wrong2, q8Wrong3]);

  return {
    q1: {
      type: 'mcq',
      title: 'Κατηγοριοποίηση Αριθμού',
      prompt: `Ο αριθμός ${q1Num} είναι Πρώτος ή Σύνθετος;`,
      options: q1Options,
      correct: q1Correct,
      explain: q1IsPrime
        ? `Ο αριθμός ${q1Num} έχει μόνο 2 διαιρέτες (το 1 και το ${q1Num}), επομένως είναι Πρώτος.`
        : `Ο αριθμός ${q1Num} έχει διαιρέτες τους: ${getDivisors(q1Num).join(', ')} (περισσότερους από 2), επομένως είναι Σύνθετος.`
    },
    q2: {
      type: 'input',
      title: 'Εύρεση Επόμενου Πρώτου',
      prompt: q2Prompt,
      correct: q2Correct,
      explain: `Ο αμέσως επόμενος πρώτος αριθμός μετά το ${baseQ2} είναι το ${nextPrime}.`
    },
    q3: {
      type: 'mcq',
      title: 'Αναγνώριση Πρώτου Αριθμού',
      prompt: 'Ποιος από τους παρακάτω αριθμούς είναι Πρώτος;',
      options: q3Options,
      correct: String(q3CorrectPrime),
      explain: `Το ${q3CorrectPrime} διαιρείται μόνο με το 1 και τον εαυτό του, άρα είναι Πρώτος.`
    },
    q4: {
      type: 'mcq',
      title: 'Αναγνώριση Σύνθετου Αριθμού',
      prompt: 'Ποιος από τους παρακάτω αριθμούς είναι Σύνθετος;',
      options: q4Options,
      correct: String(q4CorrectComp),
      explain: `Το ${q4CorrectComp} έχει διαιρέτες τους: ${getDivisors(q4CorrectComp).join(', ')}, άρα είναι Σύνθετος.`
    },
    q5: {
      type: 'tf',
      title: 'Ειδικές Περιπτώσεις (0 & 1)',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Το 0 και το 1 δεν ανήκουν ούτε στους πρώτους ούτε στους σύνθετους αριθμούς.'
        : 'Λάθος! Ο μικρότερος πρώτος αριθμός είναι το 2. Το 1 δεν είναι πρώτος αριθμός.'
    },
    q6: {
      type: 'tf',
      title: 'Ζυγοί Πρώτοι Αριθμοί',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Το 2 είναι ο μοναδικός ζυγός πρώτος. Όλοι οι άλλοι ζυγοί διαιρούνται και με το 2, άρα είναι σύνθετοι.'
        : 'Λάθος! Ο αριθμός 2 είναι ζυγός αλλά είναι πρώτος (έχει διαιρέτες μόνο το 1 και το 2).'
    },
    q7: {
      type: 'input',
      title: 'Ορθογώνιοι Σχηματισμοί',
      number: String(q7Num),
      isPrime: q7IsPrime,
      correct: q7Correct,
      explain: q7IsPrime
        ? `Επειδή το ${q7Num} είναι Πρώτος αριθμός, μπορεί να σχηματίσει μόνο 2 διατάξεις (1 × ${q7Num} και ${q7Num} × 1).`
        : `Το ${q7Num} έχει ${q7Divs.length} διαιρέτες (${q7Divs.join(', ')}), επομένως σχηματίζει ${q7Correct} διαφορετικές ορθογώνιες διατάξεις.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: `Μια δασκάλα θέλει να μοιράσει ${q8Students} μαθητές σε ισόποσες ομάδες με περισσότερους από 1 μαθητή. Μπορεί να το κάνει;`,
      options: q8Options,
      correct: q8CorrectStr,
      explain: `Ο αριθμός ${q8Students} είναι πρώτος αριθμός, επομένως δεν μπορεί να χωριστεί σε ισόποσες ομάδες περισσότερων των 1 ατόμων.`
    }
  };
}

export default function ProtoiExercisesPage() {
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
        <title>🎯 Ασκήσεις: Πρώτοι και Σύνθετοι Αριθμοί - ΣΤ' Δημοτικού | LearnMaths.gr</title>
        <meta name="description" content="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στους πρώτους και σύνθετους αριθμούς για τη ΣΤ' Δημοτικού." />
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
                href="/st-dimotikou/16-protoi" 
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
                Διαδραστικές Ασκήσεις: Πρώτοι & Σύνθετοι Αριθμοί
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-xl">
                Λύσε τα 8 δυναμικά προβλήματα αναγνώρισης πρώτων αριθμών, διατάξεων και ιδιοτήτων!
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
                    Άσκηση 1 • Κατηγοριοποίηση
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q1.prompt}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {questions.q1.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleInputChange('q1', opt)}
                      className={`p-3 rounded-xl text-sm font-bold border text-center transition ${
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
                    Άσκηση 2 • Επόμενος Πρώτος
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
                    placeholder="Γράψε τον πρώτο αριθμό..."
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
                    Άσκηση 3 • Αναγνώριση Πρώτου
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q3') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q3.prompt}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
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
                    Άσκηση 4 • Αναγνώριση Σύνθετου
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
                    Άσκηση 5 • Σωστό ή Λάθος (0 & 1)
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
                    Άσκηση 6 • Σωστό ή Λάθος (Ζυγοί)
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
                    Άσκηση 7 • Ορθογώνιες Διατάξεις
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 font-medium">
                  Πόσους διαφορετικούς ορθογώνιους σχηματισμούς μπορείς να φτιάξεις με <strong className="text-rose-700 font-mono text-base">{questions.q7.number}</strong> τετράγωνα κουτάκια;
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q7}
                    onChange={(e) => handleInputChange('q7', e.target.value)}
                    placeholder="Γράψε το πλήθος των διατάξεων..."
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
                <div className="space-y-2 mb-3">
                  {questions.q8.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleInputChange('q8', opt)}
                      className={`w-full p-2.5 rounded-xl text-xs font-bold border text-left transition ${
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

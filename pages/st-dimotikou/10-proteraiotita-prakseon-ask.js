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

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return Number(num).toLocaleString('el-GR');
}

// Δεξαμενή θεματικών σεναρίων καθημερινότητας
const REAL_WORLD_PROBLEMS = [
  { name: 'Ο Νίκος', item: 'βιβλία', price: 12, wallet: 50, count: 3, unit: '€' },
  { name: 'Η Μαρία', item: 'τετράδια', price: 4, wallet: 30, count: 5, unit: '€' },
  { name: 'Ο Γιώργος', item: 'εισιτήρια', price: 6, wallet: 40, count: 4, unit: '€' },
  { name: 'Η Ελένη', item: 'χυμούς', price: 2, wallet: 20, count: 6, unit: '€' }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledProblems = shuffle(REAL_WORLD_PROBLEMS);

  // Q1: Input - Απλή παράσταση χωρίς παρενθέσεις (α + β × γ)
  const q1A = getRandomInt(10, 30);
  const q1B = getRandomInt(2, 6);
  const q1C = getRandomInt(3, 8);
  const q1Answer = q1A + q1B * q1C;
  const q1Prompt = `${q1A} ＋ ${q1B} × ${q1C}`;

  // Q2: Input - Παράσταση με παρενθέσεις (α - β) × γ
  const q2A = getRandomInt(15, 30);
  const q2B = getRandomInt(2, q2A - 5);
  const q2C = getRandomInt(2, 6);
  const q2Answer = (q2A - q2B) * q2C;
  const q2Prompt = `(${q2A} － ${q2B}) × ${q2C}`;

  // Q3: MCQ - Αναγνώριση πρώτης πράξης
  const q3A = getRandomInt(20, 50);
  const q3B = getRandomInt(3, 8);
  const q3C = getRandomInt(2, 5);
  const q3D = getRandomInt(1, 10);
  const q3ExprStr = `${q3A} － ${q3B} × ${q3C} ＋ ${q3D}`;
  const q3Correct = `Ο πολλαπλασιασμός (${q3B} × ${q3C})`;
  const q3Options = shuffle([
    `Ο πολλαπλασιασμός (${q3B} × ${q3C})`,
    `Η αφαίρεση (${q3A} － ${q3B})`,
    `Η πρόσθεση (${q3C} ＋ ${q3D})`,
    `Όλες οι πράξεις μαζί`
  ]);

  // Q4: MCQ - Τιμή παράστασης με πολλαπλές πράξεις: α － β × (γ ＋ δ)
  const q4B = getRandomInt(2, 5);
  const q4C = getRandomInt(3, 7);
  const q4D = getRandomInt(2, 6);
  const q4SubTotal = q4C + q4D;
  const q4Prod = q4B * q4SubTotal;
  const q4A = q4Prod + getRandomInt(5, 20);
  const q4Answer = q4A - q4Prod;
  const q4ExprStr = `${q4A} － ${q4B} × (${q4C} ＋ ${q4D})`;
  const q4Options = shuffle([
    String(q4Answer),
    String(q4Answer + 10),
    String((q4A - q4B) * q4SubTotal),
    String(q4Answer - 4)
  ]);

  // Q5: True / False - Κανόνας Προτεραιότητας
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Σε μια αριθμητική παράσταση χωρίς παρενθέσεις, εκτελούμε τους πολλαπλασιασμούς και τις διαιρέσεις πριν από τις προσθέσεις και τις αφαιρέσεις.'
    : 'Σε μια αριθμητική παράσταση χωρίς παρενθέσεις, εκτελούμε πάντα τις προσθέσεις και τις αφαιρέσεις πρώτα.';

  // Q6: True / False - Κανόνας Αριστερά ➔ Δεξιά
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Όταν σε μια παράσταση υπάρχουν μόνο προσθέσεις και αφαιρέσεις, τις εκτελούμε με τη σειρά από αριστερά προς τα δεξιά.'
    : 'Όταν σε μια παράσταση υπάρχουν μόνο προσθέσεις και αφαιρέσεις, κάνουμε πάντα πρώτα τις προσθέσεις.';

  // Q7: Input - Πρόβλημα Καθημερινότητας (α - β × γ)
  const p = shuffledProblems[0];
  const q7Answer = p.wallet - p.count * p.price;
  const q7Prompt = `${p.name} είχε ${p.wallet} €. Αγόρασε ${p.count} ${p.item} που κοστίζουν ${p.price} € το καθένα. Πόσα ρέστα πήρε;`;

  // Q8: MCQ - Αναγνώριση 1ου σωστού βήματος
  const q8A = getRandomInt(30, 60);
  const q8B = getRandomInt(2, 5);
  const q8C = getRandomInt(3, 8);
  const q8D = getRandomInt(2, 4);
  const q8ExprStr = `${q8A} － (${q8B} ＋ ${q8C}) × ${q8D}`;
  const q8CorrectStep = `${q8A} － ${q8B + q8C} × ${q8D}`;
  const q8Wrong1 = `${q8A - q8B} ＋ ${q8C} × ${q8D}`;
  const q8Wrong2 = `${q8A} － (${q8B} ＋ ${q8C * q8D})`;
  const q8Wrong3 = `${q8A} － ${q8B} ＋ ${q8C * q8D}`;
  const q8Options = shuffle([q8CorrectStep, q8Wrong1, q8Wrong2, q8Wrong3]);

  return {
    q1: {
      type: 'input',
      title: 'Απλή Παράσταση',
      prompt: q1Prompt,
      correct: String(q1Answer),
      explain: `Πρώτα κάνουμε τον πολλαπλασιασμό: ${q1B} × ${q1C} ＝ ${q1B * q1C}. Στη συνέχεια την πρόσθεση: ${q1A} ＋ ${q1B * q1C} ＝ ${q1Answer}.`
    },
    q2: {
      type: 'input',
      title: 'Παράσταση με Παρένθεση',
      prompt: q2Prompt,
      correct: String(q2Answer),
      explain: `Πρώτα υπολογίζουμε την παρένθεση: (${q2A} － ${q2B}) ＝ ${q2A - q2B}. Μετά τον πολλαπλασιασμό: ${q2A - q2B} × ${q2C} ＝ ${q2Answer}.`
    },
    q3: {
      type: 'mcq',
      title: 'Αναγνώριση Πρώτης Πράξης',
      prompt: `Ποια πράξη πρέπει να εκτελέσουμε ΠΡΩΤΑ στην παράσταση: ${q3ExprStr};`,
      options: q3Options,
      correct: q3Correct,
      explain: `Ο πολλαπλασιασμός έχει προτεραιότητα έναντι της πρόσθεσης και της αφαίρεσης. Άρα ξεκινάμε με το ${q3B} × ${q3C}.`
    },
    q4: {
      type: 'mcq',
      title: 'Υπολογισμός Τιμής Παράστασης',
      prompt: `Υπολόγισε την τιμή της παράστασης: ${q4ExprStr}`,
      options: q4Options,
      correct: String(q4Answer),
      explain: `1) Παρένθεση: ${q4C} ＋ ${q4D} ＝ ${q4SubTotal}. 2) Πολλαπλασιασμός: ${q4B} × ${q4SubTotal} ＝ ${q4Prod}. 3) Αφαίρεση: ${q4A} － ${q4Prod} ＝ ${q4Answer}.`
    },
    q5: {
      type: 'tf',
      title: 'Κανόνας Προτεραιότητας',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Οι πολλαπλασιασμοί και οι διαιρέσεις προηγούνται πάντα των προσθέσεων και αφαιρέσεων.'
        : 'Λάθος! Οι προσθέσεις και οι αφαιρέσεις γίνονται ΤΕΛΕΥΤΑΙΕΣ, εκτός αν βρίσκονται μέσα σε παρενθέσεις.'
    },
    q6: {
      type: 'tf',
      title: 'Κανόνας Αριστερά ➔ Δεξιά',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Πράξεις με την ίδια προτεραιότητα εκτελούνται διαδοχικά από αριστερά προς τα δεξιά.'
        : 'Λάθος! Δεν προηγείται η πρόσθεση της αφαίρεσης. Εκτελούνται με τη σειρά που εμφανίζονται από αριστερά προς τα δεξιά.'
    },
    q7: {
      type: 'input',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: q7Prompt,
      correct: String(q7Answer),
      explain: `Φτιάχνουμε την παράσταση: ${p.wallet} － ${p.count} × ${p.price} ＝ ${p.wallet} － ${p.count * p.price} ＝ ${q7Answer} €.`
    },
    q8: {
      type: 'mcq',
      title: 'Αναγνώριση 1ου Σωστού Βήματος',
      prompt: `Ποιο είναι το σωστό 1ο βήμα για τη λύση της παράστασης: ${q8ExprStr};`,
      options: q8Options,
      correct: q8CorrectStep,
      explain: `Υπολογίζουμε πρώτα την παρένθεση (${q8B} ＋ ${q8C} ＝ ${q8B + q8C}), οπότε η νέα μορφή είναι: ${q8CorrectStep}.`
    }
  };
}

export default function ProteraiotitaPrakseonExercisesPage() {
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
      const cleanAns = a.replace(/\./g, '').replace(/\s+/g, '');
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
        <title>🎯 Ασκήσεις: Προτεραιότητα Πράξεων - ΣΤ' Δημοτικού | LearnMaths.gr</title>
        <meta name="description" content="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στην προτεραιότητα των πράξεων για τη ΣΤ' Δημοτικού." />
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
                href="/st-dimotikou/10-proteraiotita-prakseon" 
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
                Διαδραστικές Ασκήσεις: Προτεραιότητα Πράξεων
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-xl">
                Λύσε τα 8 δυναμικά προβλήματα αριθμητικών παραστάσεων, παρενθέσεων και προτεραιότητας πράξεων!
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
                    Άσκηση 1 • Απλή Παράσταση
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  Υπολόγισε την τιμή της παράστασης:
                </p>
                <div className="p-3 bg-slate-100 rounded-2xl font-mono text-xl text-center font-black text-slate-800 mb-4">
                  <span>{questions.q1.prompt}</span>
                  <span className="text-slate-400 mx-2">＝</span>
                  <span className="text-amber-600">;</span>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q1}
                    onChange={(e) => handleInputChange('q1', e.target.value)}
                    placeholder="Γράψε την τελική τιμή..."
                    className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-blue-500 outline-none disabled:bg-slate-100 font-mono"
                  />
                  {submitted && (
                    <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q1') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                      💡 {questions.q1.explain}
                    </div>
                  )}
                </div>
              </div>

              {/* ΕΡΩΤΗΣΗ 2 */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q2')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                    Άσκηση 2 • Παράσταση με Παραιτέρωση
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  Υπολόγισε την τιμή της παράστασης:
                </p>
                <div className="p-3 bg-slate-100 rounded-2xl font-mono text-xl text-center font-black text-slate-800 mb-4">
                  <span>{questions.q2.prompt}</span>
                  <span className="text-slate-400 mx-2">＝</span>
                  <span className="text-amber-600">;</span>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q2}
                    onChange={(e) => handleInputChange('q2', e.target.value)}
                    placeholder="Γράψε την τελική τιμή..."
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
                    Άσκηση 3 • Πρώτη Πράξη
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q3') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q3.prompt}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {questions.q3.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleInputChange('q3', opt)}
                      className={`p-3 rounded-xl text-xs font-bold border text-left transition ${
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
                    Άσκηση 4 • Πολλαπλές Πράξεις
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
                    Άσκηση 7 • Πρόβλημα
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q7.prompt}
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q7}
                    onChange={(e) => handleInputChange('q7', e.target.value)}
                    placeholder="Γράψε τα ρέστα σε €..."
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
                    Άσκηση 8 • Αναγνώριση 1ου Βήματος
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
                      className={`w-full p-2.5 rounded-xl text-xs font-mono font-bold border text-center transition ${
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

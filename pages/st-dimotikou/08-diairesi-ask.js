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

// Δεξαμενή 20+ θεματικών αντικειμένων καθημερινότητας
const REAL_WORLD_DIVISIONS = [
  { item: 'καραμέλες', group: 'παιδιά', unit: 'καραμέλες' },
  { item: 'βιβλία', group: 'ράφια', unit: 'βιβλία' },
  { item: 'ευρώ', group: 'κουμπαράδες', unit: '€' },
  { item: 'κιλά αλεύρι', group: 'σακούλες', unit: 'κιλά' },
  { item: 'μήλα', group: 'τελάρα', unit: 'μήλα' },
  { item: 'τετράδια', group: 'μαθητές', unit: 'τετράδια' },
  { item: 'λίτρα χυμού', group: 'μπουκάλια', unit: 'λίτρα' },
  { item: 'μπάλες', group: 'κουτιά', unit: 'μπάλες' },
  { item: 'αυγά', group: 'θήκες', unit: 'αυγά' },
  { item: 'σοκολάτες', group: 'πακέτα', unit: 'σοκολάτες' }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledItems = shuffle(REAL_WORLD_DIVISIONS);

  // Q1: Input - Υπολογισμός Πηλίκου σε Τέλεια Διαίρεση
  const q1Divisor = getRandomInt(4, 12);
  const q1Quotient = getRandomInt(12, 85);
  const q1Dividend = q1Divisor * q1Quotient;
  const q1Correct = String(q1Quotient);

  // Q2: Input - Εύρεση Διαιρετέου (Δ = δ × π + υ)
  const q2Divisor = getRandomInt(6, 15);
  const q2Quotient = getRandomInt(14, 45);
  const q2Remainder = getRandomInt(1, q2Divisor - 1);
  const q2Dividend = q2Divisor * q2Quotient + q2Remainder;
  const q2Correct = String(q2Dividend);

  // Q3: MCQ - Χαρακτηρισμός Τέλειας / Ατελούς Διαίρεσης
  const q3IsPerfect = Math.random() > 0.5;
  const q3Divisor = getRandomInt(4, 9);
  const q3Quotient = getRandomInt(10, 30);
  const q3Remainder = q3IsPerfect ? 0 : getRandomInt(1, q3Divisor - 1);
  const q3Dividend = q3Divisor * q3Quotient + q3Remainder;
  const q3Correct = q3IsPerfect ? 'Τέλεια Διαίρεση' : 'Ατελής Διαίρεση';
  const q3Options = shuffle(['Τέλεια Διαίρεση', 'Ατελής Διαίρεση']);

  // Q4: MCQ - Πρόβλημα Καθημερινότητας με Υπόλοιπο
  const q4Item = shuffledItems[0];
  const q4Divisor = getRandomInt(5, 9);
  const q4Quotient = getRandomInt(8, 25);
  const q4Remainder = getRandomInt(1, q4Divisor - 1);
  const q4Dividend = q4Divisor * q4Quotient + q4Remainder;
  const q4Correct = `${q4Quotient} ${q4Item.unit} (περίσσεψαν ${q4Remainder})`;
  const q4Wrong1 = `${q4Quotient + 1} ${q4Item.unit} (περίσσεψαν 0)`;
  const q4Wrong2 = `${q4Quotient} ${q4Item.unit} (περίσσεψαν 0)`;
  const q4Wrong3 = `${q4Quotient - 1} ${q4Item.unit} (περίσσεψαν ${q4Remainder + 1})`;
  const q4Options = shuffle([q4Correct, q4Wrong1, q4Wrong2, q4Wrong3]);

  // Q5: True / False - Κανόνας Υπολοίπου (υ < δ)
  const q5IsTrue = Math.random() > 0.5;
  const q5Div = getRandomInt(6, 12);
  const q5Text = q5IsTrue
    ? `Σε μια ατελή διαίρεση με διαιρέτη το ${q5Div}, το υπόλοιπο μπορεί να είναι οποιοσδήποτε αριθμός από το 1 έως το ${q5Div - 1}.`
    : `Σε μια ατελή διαίρεση με διαιρέτη το ${q5Div}, το υπόλοιπο μπορεί να είναι ίσο με ${q5Div} ή μεγαλύτερο.`;

  // Q6: True / False - Μαθηματική Ταυτότητα (Δ = δ × π + υ)
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Η μαθηματική ταυτότητα της διαίρεσης εκφράζεται ως: Διαιρετέος = (Διαιρέτης × Πηλίκο) + Υπόλοιπο.'
    : 'Η μαθηματική ταυτότητα της διαίρεσης εκφράζεται ως: Διαιρετέος = (Διαιρέτης + Πηλίκο) × Υπόλοιπο.';

  // Q7: Input - Οπτικό Μοίρασμα σε Ομάδες
  const q7Divisor = getRandomInt(3, 6);
  const q7Quotient = getRandomInt(4, 8);
  const q7Remainder = getRandomInt(1, q7Divisor - 1);
  const q7Dividend = q7Divisor * q7Quotient + q7Remainder;
  const q7Correct = String(q7Quotient);

  // Q8: MCQ - Εύρεση Υπολοίπου από Διαγράμματα/Πράξεις
  const q8Divisor = getRandomInt(7, 12);
  const q8Quotient = getRandomInt(15, 35);
  const q8Remainder = getRandomInt(2, q8Divisor - 1);
  const q8Dividend = q8Divisor * q8Quotient + q8Remainder;
  const q8Correct = String(q8Remainder);
  const q8Options = shuffle([
    String(q8Remainder),
    String(q8Remainder + 1),
    '0',
    String(q8Divisor)
  ]);

  return {
    q1: {
      type: 'input',
      title: 'Τέλεια Διαίρεση',
      prompt: `${formatNumber(q1Dividend)} : ${q1Divisor}`,
      correct: q1Correct,
      explain: `Η διαίρεση είναι τέλεια (υπόλοιπο 0): ${formatNumber(q1Dividend)} : ${q1Divisor} = ${q1Quotient}.`
    },
    q2: {
      type: 'input',
      title: 'Εύρεση Διαιρετέου (Δ)',
      divisor: q2Divisor,
      quotient: q2Quotient,
      remainder: q2Remainder,
      correct: q2Correct,
      explain: `Εφαρμόζουμε τον τύπο Δ = δ × π + υ: Δ = (${q2Divisor} × ${q2Quotient}) + ${q2Remainder} = ${q2Divisor * q2Quotient} + ${q2Remainder} = ${formatNumber(q2Dividend)}.`
    },
    q3: {
      type: 'mcq',
      title: 'Είδος Διαίρεσης',
      prompt: `Ποιο είναι το είδος της διαίρεσης ${formatNumber(q3Dividend)} : ${q3Divisor};`,
      options: q3Options,
      correct: q3Correct,
      explain: q3IsPerfect
        ? `Επειδή ${formatNumber(q3Dividend)} = ${q3Divisor} × ${q3Quotient} (υπόλοιπο 0), η διαίρεση είναι Τέλεια.`
        : `Επειδή ${formatNumber(q3Dividend)} = (${q3Divisor} × ${q3Quotient}) + ${q3Remainder} (υπόλοιπο ${q3Remainder}), η διαίρεση είναι Ατελής.`
    },
    q4: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: `Μοιράζουμε ${q4Dividend} ${q4Item.item} σε ${q4Divisor} ${q4Item.group}. Πόσα ${q4Item.unit} θα πάρει το καθένα και πόσα θα περισσέψουν;`,
      options: q4Options,
      correct: q4Correct,
      explain: `Κάνουμε τη διαίρεση ${q4Dividend} : ${q4Divisor}: Πηλίκο = ${q4Quotient}, Υπόλοιπο = ${q4Remainder}.`
    },
    q5: {
      type: 'tf',
      title: 'Κανόνας Υπολοίπου',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? `Σωστά! Το υπόλοιπο (υ) είναι πάντα αυστηρά μικρότερο από τον διαιρέτη (υ < δ).`
        : `Λάθος! Το υπόλοιπο ΔΕΝ μπορεί να είναι ίσο ή μεγαλύτερο από τον διαιρέτη.`
    },
    q6: {
      type: 'tf',
      title: 'Μαθηματική Ταυτότητα',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Ο Διαιρετέος ισούται πάντα με το γινόμενο του Διαιρέτη επί το Πηλίκο συν το Υπόλοιπο.'
        : 'Λάθος! Ο σωστός τύπος είναι: Δ = (δ × π) + υ.'
    },
    q7: {
      type: 'input',
      title: 'Οπτικό Μοίρασμα',
      dividend: q7Dividend,
      divisor: q7Divisor,
      remainder: q7Remainder,
      correct: q7Correct,
      explain: `Μοιράζοντας ${q7Dividend} στοιχεία σε ${q7Divisor} ομάδες, κάθε ομάδα παίρνει από ${q7Quotient} στοιχεία και περισσεύουν ${q7Remainder}.`
    },
    q8: {
      type: 'mcq',
      title: 'Εύρεση Υπολοίπου',
      prompt: `Στη διαίρεση ${formatNumber(q8Dividend)} : ${q8Divisor} = ${q8Quotient}, ποιο είναι το υπόλοιπο;`,
      options: q8Options,
      correct: q8Correct,
      explain: `Υπολογίζουμε: ${formatNumber(q8Dividend)} - (${q8Divisor} × ${q8Quotient}) = ${formatNumber(q8Dividend)} - ${formatNumber(q8Divisor * q8Quotient)} = ${q8Remainder}.`
    }
  };
}

export default function DiairesiExercisesPage() {
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
        <title>🎯 Ασκήσεις: Τέλεια & Ατελής Διαίρεση - ΣΤ' Δημοτικού | LearnMaths.gr</title>
        <meta name="description" content="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στη διαίρεση φυσικών αριθμών για τη ΣΤ' Δημοτικού." />
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
                href="/st-dimotikou/08-diairesi" 
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
                Διαδραστικές Ασκήσεις: Τέλεια & Ατελής Διαίρεση
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-xl">
                Λύσε τα 8 δυναμικά προβλήματα διαίρεσης, υπολογισμού πηλίκου, υπολοίπου και επαλήθευσης!
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
                    Άσκηση 1 • Υπολογισμός Πηλίκου
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  Υπολόγισε το πηλίκο της τέλειας διαίρεσης:
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
                    placeholder="Γράψε το πηλίκο..."
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
                    Άσκηση 2 • Εύρεση Διαιρετέου (Δ)
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  Βρες τον Διαιρετέο (Δ) όταν: <strong>διαιρέτης (δ) = {questions.q2.divisor}</strong>, <strong>πηλίκο (π) = {questions.q2.quotient}</strong> και <strong>υπόλοιπο (υ) = {questions.q2.remainder}</strong>.
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q2}
                    onChange={(e) => handleInputChange('q2', e.target.value)}
                    placeholder="Γράψε τον Διαιρετέο..."
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
                    Άσκηση 3 • Χαρακτηρισμός Πράξης
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
                      className={`p-3 rounded-xl text-xs font-bold border text-center transition ${
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
                    Άσκηση 4 • Πρόβλημα
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q4') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q4.prompt}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {questions.q4.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleInputChange('q4', opt)}
                      className={`p-3 rounded-xl text-xs font-bold border text-center transition ${
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
                    Άσκηση 7 • Οπτικό Μοίρασμα
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 font-medium">
                  Μοιράζουμε <strong className="text-blue-700">{questions.q7.dividend}</strong> στοιχεία σε <strong className="text-emerald-700">{questions.q7.divisor}</strong> ίσες ομάδες. Πόσα στοιχεία παίρνει η κάθε ομάδα;
                </p>
                
                {/* SVG Visual Representation */}
                <div className="bg-slate-100 rounded-2xl p-3 mb-4 flex justify-center">
                  <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                    {[...Array(questions.q7.divisor)].map((_, i) => (
                      <div key={i} className="bg-white border-2 border-emerald-300 p-2 rounded-xl flex items-center justify-center min-w-[45px]">
                        <span className="text-xs font-bold text-slate-700 font-mono">?</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q7}
                    onChange={(e) => handleInputChange('q7', e.target.value)}
                    placeholder="Γράψε τον αριθμό στοιχείων ανά ομάδα..."
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
                    Άσκηση 8 • Εύρεση Υπολοίπου
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
                      className={`w-full p-2.5 rounded-xl text-xs font-mono font-bold border text-center transition ${
                        answers.q8 === opt
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50'
                      }`}
                    >
                      υ = {opt}
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

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

// Δεξαμενή σεναρίων καθημερινότητας με σωστές πτώσεις
const REAL_WORLD_SCENARIOS = [
  { item: 'πίτσες', totalParts: 4, eaten: 3, unitName: 'τέταρτα', dec: '0,75' },
  { item: 'σοκολάτες', totalParts: 5, eaten: 2, unitName: 'πέμπτα', dec: '0,4' },
  { item: 'κέικ', totalParts: 2, eaten: 1, unitName: 'μισό', dec: '0,5' },
  { item: 'πίτες', totalParts: 8, eaten: 6, unitName: 'όγδοα', dec: '0,75' },
  { item: 'μέτρα υφάσματος', totalParts: 10, eaten: 7, unitName: 'δέκατα', dec: '0,7' }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledScenarios = shuffle(REAL_WORLD_SCENARIOS);

  // Q1: Input - Μετατροπή απλού κλάσματος σε δεκαδικό (π.χ. 1/2, 1/4, 3/4, 2/5, 4/5)
  const q1List = [
    { num: 1, den: 2, dec: '0,5' },
    { num: 1, den: 4, dec: '0,25' },
    { num: 3, den: 4, dec: '0,75' },
    { num: 1, den: 5, dec: '0,2' },
    { num: 2, den: 5, dec: '0,4' },
    { num: 3, den: 5, dec: '0,6' },
    { num: 4, den: 5, dec: '0,8' }
  ];
  const q1Selected = q1List[getRandomInt(0, q1List.length - 1)];
  const q1Correct = q1Selected.dec;

  // Q2: MCQ - Αναγνώριση Κλασματικής Μονάδας (1/ν)
  const q2Den = getRandomInt(3, 12);
  const q2CorrectStr = `1/${q2Den}`;
  const q2Wrongs = [
    `2/${q2Den}`,
    `${q2Den}/1`,
    `${q2Den}/${q2Den}`
  ];
  const q2Options = shuffle([q2CorrectStr, ...q2Wrongs]);

  // Q3: MCQ - Ποιο κλάσμα παράγει Περιοδικό Δεκαδικό Αριθμό
  const q3PeriodicFractions = [
    { frac: '1/3', dec: '0,333...' },
    { frac: '2/3', dec: '0,666...' },
    { frac: '1/6', dec: '0,166...' },
    { frac: '1/7', dec: '0,142...' },
    { frac: '1/9', dec: '0,111...' }
  ];
  const q3NonPeriodicFractions = ['1/2', '1/4', '3/4', '2/5', '3/10', '7/10', '1/8'];
  const q3Chosen = q3PeriodicFractions[getRandomInt(0, q3PeriodicFractions.length - 1)];
  const q3WrongsList = shuffle(q3NonPeriodicFractions).slice(0, 3);
  const q3Options = shuffle([q3Chosen.frac, ...q3WrongsList]);

  // Q4: Input - Μετατροπή καταχρηστικού κλάσματος σε δεκαδικό (> 1)
  const q4List = [
    { num: 3, den: 2, dec: '1,5' },
    { num: 5, den: 2, dec: '2,5' },
    { num: 5, den: 4, dec: '1,25' },
    { num: 7, den: 4, dec: '1,75' },
    { num: 6, den: 5, dec: '1,2' },
    { num: 8, den: 5, dec: '1,6' }
  ];
  const q4Selected = q4List[getRandomInt(0, q4List.length - 1)];
  const q4Correct = q4Selected.dec;

  // Q5: True / False - Κλασματική μονάδα σημαίνει αριθμητής = 1
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Κλασματική μονάδα ονομάζεται κάθε κλάσμα που έχει ως αριθμητή τον αριθμό 1.'
    : 'Κλασματική μονάδα ονομάζεται κάθε κλάσμα που έχει ως παρονομαστή τον αριθμό 1.';

  // Q6: True / False - Η γραμμή κλάσματος σημαίνει διαίρεση
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Για να μετατρέψουμε ένα κλάσμα σε δεκαδικό, διαιρούμε τον αριθμητή με τον παρονομαστή.'
    : 'Για να μετατρέψουμε ένα κλάσμα σε δεκαδικό, διαιρούμε τον παρονομαστή με τον αριθμητή.';

  // Q7: Input - Εύρεση δεκαδικού κλάσματος (με παρονομαστή 10 ή 100)
  const q7List = [
    { num: 7, den: 10, dec: '0,7' },
    { num: 9, den: 10, dec: '0,9' },
    { num: 13, den: 10, dec: '1,3' },
    { num: 25, den: 100, dec: '0,25' },
    { num: 45, den: 100, dec: '0,45' },
    { num: 8, den: 100, dec: '0,08' }
  ];
  const q7Selected = q7List[getRandomInt(0, q7List.length - 1)];
  const q7Correct = q7Selected.dec;

  // Q8: MCQ - Πρόβλημα Καθημερινότητας
  const sc = shuffledScenarios[0];
  const q8CorrectStr = sc.dec;
  const q8WrongDecs = [
    (parseFloat(sc.dec.replace(',', '.')) + 0.1).toFixed(2).replace('.', ','),
    (parseFloat(sc.dec.replace(',', '.')) - 0.15).toFixed(2).replace('.', ','),
    (parseFloat(sc.dec.replace(',', '.')) + 0.25).toFixed(2).replace('.', ',')
  ];
  const q8Options = shuffle([q8CorrectStr, ...q8WrongDecs]);

  return {
    q1: {
      type: 'input',
      title: 'Κλάσμα ➔ Δεκαδικός',
      prompt: `Μετάτρεψε το κλάσμα ${q1Selected.num}/${q1Selected.den} σε δεκαδικό αριθμό (π.χ. 0,5):`,
      correct: q1Correct,
      explain: `${q1Selected.num}/${q1Selected.den} ＝ ${q1Selected.num} ÷ ${q1Selected.den} ＝ ${q1Correct}.`
    },
    q2: {
      type: 'mcq',
      title: 'Κλασματική Μονάδα',
      prompt: `Ποιο από τα παρακάτω κλάσματα είναι η κλασματική μονάδα με παρονομαστή το ${q2Den};`,
      options: q2Options,
      correct: q2CorrectStr,
      explain: `Η κλασματική μονάδα έχει πάντοτε αριθμητή το 1, άρα είναι το ${q2CorrectStr}.`
    },
    q3: {
      type: 'mcq',
      title: 'Περιοδικός Δεκαδικός',
      prompt: `Ποιο από τα παρακάτω κλάσματα δίνει περιοδικό δεκαδικό αριθμό όταν κάνουμε τη διαίρεση;`,
      options: q3Options,
      correct: q3Chosen.frac,
      explain: `Το κλάσμα ${q3Chosen.frac} ισούται με ${q3Chosen.frac.split('/')[0]} ÷ ${q3Chosen.frac.split('/')[1]} ＝ ${q3Chosen.dec}, η διαίρεση δεν τελειώνει και άρα είναι περιοδικός αριθμός.`
    },
    q4: {
      type: 'input',
      title: 'Καταχρηστικό Κλάσμα',
      prompt: `Ποια είναι η δεκαδική τιμή του κλάσματος ${q4Selected.num}/${q4Selected.den} (π.χ. 1,5);`,
      correct: q4Correct,
      explain: `${q4Selected.num}/${q4Selected.den} ＝ ${q4Selected.num} ÷ ${q4Selected.den} ＝ ${q4Correct}.`
    },
    q5: {
      type: 'tf',
      title: 'Ορισμός Κλασματικής Μονάδας',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Κλασματική μονάδα είναι κάθε κλάσμα της μορφής 1/ν (Αριθμητής = 1).'
        : 'Λάθος! Η κλασματική μονάδα έχει αριθμητή το 1, όχι παρονομαστή.'
    },
    q6: {
      type: 'tf',
      title: 'Τρόπος Μετατροπής',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Διαιρούμε πάντα τον Αριθμητή (πάνω) με τον Παρονομαστή (κάτω).'
        : 'Λάθος! Διαιρούμε τον αριθμητή με τον παρονομαστή (Αριθμητής ÷ Παρονομαστής).'
    },
    q7: {
      type: 'input',
      title: 'Δεκαδικό Κλάσμα',
      prompt: `Γράψε τη δεκαδική τιμή του κλάσματος ${q7Selected.num}/${q7Selected.den} (π.χ. 0,7):`,
      correct: q7Correct,
      explain: `${q7Selected.num}/${q7Selected.den} ＝ ${q7Selected.num} ÷ ${q7Selected.den} ＝ ${q7Correct}.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: `Χρησιμοποιήθηκαν τα ${sc.eaten}/${sc.totalParts} από ${sc.item}. Ποιος δεκαδικός αριθμός εκφράζει την ποσότητα αυτή;`,
      options: q8Options,
      correct: q8CorrectStr,
      explain: `Τα ${sc.eaten}/${sc.totalParts} ισούνται με ${sc.eaten} ÷ ${sc.totalParts} ＝ ${sc.dec}.`
    }
  };
}

export default function KlasmaSeDekadikoExercisesPage() {
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
      const cleanAns = a.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanCorrect = q.correct.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
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
        <title>🎯 Ασκήσεις: Κλάσμα σε Δεκαδικό - ΣΤ' Δημοτικού | LearnMaths.gr</title>
        <meta name="description" content="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στην κλασματική μονάδα και τη μετατροπή κλάσματος σε δεκαδικό αριθμό για τη ΣΤ' Δημοτικού." />
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
                href="/st-dimotikou/24-klasma-se-dekadiko" 
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
                Διαδραστικές Ασκήσεις: Κλασματική Μονάδα & Δεκαδικοί
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-xl">
                Λύσε τα 8 δυναμικά προβλήματα αναγνώρισης κλασματικών μονάδων, μετατροπής κλασμάτων σε δεκαδικούς και περιοδικών αριθμών!
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
                    Άσκηση 1 • Κλάσμα ➔ Δεκαδικός
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q1.prompt}
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q1}
                    onChange={(e) => handleInputChange('q1', e.target.value)}
                    placeholder="π.χ. 0,5"
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
                    Άσκηση 2 • Κλασματική Μονάδα
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q2.prompt}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {questions.q2.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleInputChange('q2', opt)}
                      className={`p-3 rounded-xl text-base font-mono font-black border text-center transition ${
                        answers.q2 === opt
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {submitted && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q2') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                    💡 {questions.q2.explain}
                  </div>
                )}
              </div>

              {/* ΕΡΩΤΗΣΗ 3 */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q3')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                    Άσκηση 3 • Περιοδικός Αριθμός
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
                      className={`p-3 rounded-xl text-base font-mono font-black border text-center transition ${
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
                    Άσκηση 4 • Καταχρηστικό Κλάσμα
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q4') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q4.prompt}
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q4}
                    onChange={(e) => handleInputChange('q4', e.target.value)}
                    placeholder="π.χ. 1,5"
                    className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-amber-500 outline-none disabled:bg-slate-100 font-mono"
                  />
                  {submitted && (
                    <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q4') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                      💡 {questions.q4.explain}
                    </div>
                  )}
                </div>
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
                    Άσκηση 7 • Δεκαδικό Κλάσμα
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
                    placeholder="π.χ. 0,7"
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
                      className={`w-full p-2.5 rounded-xl text-base font-mono font-black border text-center transition ${
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

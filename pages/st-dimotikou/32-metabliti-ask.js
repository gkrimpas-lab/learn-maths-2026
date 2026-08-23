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

// Δεξαμενή σεναρίων καθημερινότητας με μεταβλητές
const REAL_WORLD_SCENARIOS = [
  { 
    context: 'Σε ένα ταξί η πάγια χρέωση (ταρίφα) είναι 3€ και για κάθε χιλιόμετρο (x) χρεώνει 2€.', 
    expr: '2x ＋ 3',
    qKm: 5,
    calcText: '2 × 5 ＋ 3'
  },
  { 
    context: 'Σε έναν κινηματογράφο το εισιτήριο κοστίζει 7€ και κάθε ποπ κορν (x) κοστίζει 3€.', 
    expr: '3x ＋ 7',
    qKm: 4,
    calcText: '3 × 4 ＋ 7'
  },
  { 
    context: 'Μια συνδρομή στο γυμναστήριο έχει πάγιο 10€ και 4€ για κάθε επιπλέον μάθημα (x).', 
    expr: '4x ＋ 10',
    qKm: 6,
    calcText: '4 × 6 ＋ 10'
  }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledScenarios = shuffle(REAL_WORLD_SCENARIOS);

  // Q1: Input - Υπολογισμός Αριθμητικής Τιμής (2x + b)
  const q1A = getRandomInt(2, 5);
  const q1B = getRandomInt(3, 8);
  const q1X = getRandomInt(2, 6);
  const q1Res = q1A * q1X + q1B;

  // Q2: Input - Υπολογισμός Αριθμητικής Τιμής με αφαίρεση (ax - b)
  const q2A = getRandomInt(3, 6);
  const q2X = getRandomInt(4, 7);
  const q2B = getRandomInt(2, q2A * q2X - 5);
  const q2Res = q2A * q2X - q2B;

  // Q3: MCQ - Μετάφραση λεκτικής φράσης σε μαθηματική έκφραση με x
  const q3Pool = [
    { text: 'Το τριπλάσιο ενός αριθμού αυξημένο κατά 5', expr: '3x ＋ 5', wrongs: ['x/3 ＋ 5', '3(x － 5)', '3x － 5'] },
    { text: 'Το διπλάσιο ενός αριθμού ελαττωμένο κατά 4', expr: '2x － 4', wrongs: ['2x ＋ 4', 'x/2 － 4', '2(x ＋ 4)'] },
    { text: 'Το μισό ενός αριθμού αυξημένο κατά 7', expr: 'x/2 ＋ 7', wrongs: ['2x ＋ 7', 'x/7 ＋ 2', '2(x － 7)'] },
    { text: 'Το τετραπλάσιο ενός αριθμού αυξημένο κατά 2', expr: '4x ＋ 2', wrongs: ['4x － 2', 'x/4 ＋ 2', '4(x ＋ 2)'] }
  ];
  const q3Item = q3Pool[getRandomInt(0, q3Pool.length - 1)];
  const q3Options = shuffle([q3Item.expr, ...q3Item.wrongs]);

  // Q4: MCQ - Εύρεση της τιμής του x ώστε η παράσταση να έχει συγκεκριμένο αποτέλεσμα
  const q4A = getRandomInt(2, 4);
  const q4B = getRandomInt(1, 6);
  const q4X = getRandomInt(2, 6);
  const q4Target = q4A * q4X + q4B;
  const q4Wrongs = [String(q4X + 1), String(Math.max(1, q4X - 1)), String(q4X + 2)];
  const q4Options = shuffle([String(q4X), ...q4Wrongs]);

  // Q5: True / False - Η έννοια της παράλειψης του συμβόλου του πολλαπλασιασμού
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στην άλγεβρα, η έκφραση 3x σημαίνει 3 × x (δηλαδή 3 φορές το x).'
    : 'Στην άλγεβρα, η έκφραση 3x σημαίνει 3 ＋ x.';

  // Q6: True / False - Η έννοια της μεταβλητής
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Μια μεταβλητή (όπως το x) μπορεί να πάρει διάφορες αριθμητικές τιμές.'
    : 'Μια μεταβλητή (όπως το x) έχει πάντοτε την ίδια ακριβώς σταθερή τιμή και δεν αλλάζει ποτέ.';

  // Q7: Input - Παράσταση με δύο μεταβλητές: 2x + 3y
  const q7X = getRandomInt(2, 5);
  const q7Y = getRandomInt(1, 4);
  const q7Res = 2 * q7X + 3 * q7Y;

  // Q8: MCQ - Πρόβλημα Καθημερινότητας
  const sc = shuffledScenarios[0];
  const scRes = (sc.expr.startsWith('2x') ? 2 : sc.expr.startsWith('3x') ? 3 : 4) * sc.qKm + (sc.expr.includes('3') ? 3 : sc.expr.includes('7') ? 7 : 10);
  const scWrongs = [
    String(scRes + 2),
    String(Math.max(1, scRes - 4)),
    String(scRes + 6)
  ];
  const q8Options = shuffle([`${scRes}€`, ...scWrongs.map(w => `${w}€`)]);

  return {
    q1: {
      type: 'input',
      title: 'Υπολογισμός Τιμής',
      prompt: `Υπολόγισε την αριθμητική τιμή της παράστασης ${q1A}x ＋ ${q1B} για x ＝ ${q1X}:`,
      correct: String(q1Res),
      explain: `Αντικαθιστούμε το x με το ${q1X}: ${q1A} × ${q1X} ＋ ${q1B} ＝ ${q1A * q1X} ＋ ${q1B} ＝ ${q1Res}.`
    },
    q2: {
      type: 'input',
      title: 'Παράσταση με Αφαίρεση',
      prompt: `Υπολόγισε την τιμή της παράστασης ${q2A}x － ${q2B} για x ＝ ${q2X}:`,
      correct: String(q2Res),
      explain: `Αντικαθιστούμε το x με το ${q2X}: ${q2A} × ${q2X} － ${q2B} ＝ ${q2A * q2X} － ${q2B} ＝ ${q2Res}.`
    },
    q3: {
      type: 'mcq',
      title: 'Λεκτική σε Αλγεβρική Έκφραση',
      prompt: `Ποια αλγεβρική παράσταση εκφράζει τη φράση: «${q3Item.text}»;`,
      options: q3Options,
      correct: q3Item.expr,
      explain: `Η φράση «${q3Item.text}» αντιστοιχεί ακριβώς στην παράσταση ${q3Item.expr}.`
    },
    q4: {
      type: 'mcq',
      title: 'Εύρεση Μεταβλητής',
      prompt: `Για ποια τιμή του x η παράσταση ${q4A}x ＋ ${q4B} ισούται με ${q4Target};`,
      options: q4Options,
      correct: String(q4X),
      explain: `Για x ＝ ${q4X}, έχουμε: ${q4A} × ${q4X} ＋ ${q4B} ＝ ${q4A * q4X} ＋ ${q4B} ＝ ${q4Target}.`
    },
    q5: {
      type: 'tf',
      title: 'Συμβολισμός Πολλαπλασιασμού',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Όταν ένας αριθμός βρίσκεται ακριβώς δίπλα σε ένα γράμμα (π.χ. 3x), εννοείται πολλαπλασιασμός.'
        : 'Λάθος! Το 3x σημαίνει 3 × x (πολλαπλασιασμός), όχι πρόσθεση.'
    },
    q6: {
      type: 'tf',
      title: 'Ορισμός Μεταβλητής',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Η μεταβλητή ονομάζεται έτσι επειδή η τιμή της μπορεί να μεταβάλλεται (να αλλάζει).'
        : 'Λάθος! Μια μεταβλητή μπορεί να πάρει πολλές διαφορετικές τιμές.'
    },
    q7: {
      type: 'input',
      title: 'Δύο Μεταβλητές',
      prompt: `Υπολόγισε την τιμή της παράστασης 2x ＋ 3y όταν x ＝ ${q7X} και y ＝ ${q7Y}:`,
      correct: String(q7Res),
      explain: `Αντικαθιστούμε: 2 × ${q7X} ＋ 3 × ${q7Y} ＝ ${2 * q7X} ＋ ${3 * q7Y} ＝ ${q7Res}.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: `${sc.context} Πόσο θα πληρώσουμε αν x ＝ ${sc.qKm};`,
      options: q8Options,
      correct: `${scRes}€`,
      explain: `Υπολογίζουμε: ${sc.calcText} ＝ ${scRes}€.`
    }
  };
}

export default function MetablitiExercisesPage() {
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
        <title>🎯 Ασκήσεις: Η Έννοια της Μεταβλητής - ΣΤ' Δημοτικού | LearnMaths.gr</title>
        <meta name="description" content="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στην έννοια της μεταβλητής και τις αλγεβρικές παραστάσεις για τη ΣΤ' Δημοτικού." />
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
                href="/st-dimotikou/32-metabliti" 
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
                Διαδραστικές Ασκήσεις: Η Έννοια της Μεταβλητής
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-xl">
                Λύσε τα 8 δυναμικά προβλήματα υπολογισμού αριθμητικής τιμής, μετάφρασης εκφράσεων σε x και αλγεβρικών παραστάσεων!
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
                    Άσκηση 1 • Αριθμητική Τιμή
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
                    placeholder="Γράψε το αποτέλεσμα..."
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
                    Άσκηση 2 • Παράσταση με Αφαίρεση
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
                    placeholder="Γράψε το αποτέλεσμα..."
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
                    Άσκηση 3 • Λεκτική σε Έκφραση
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
                    Άσκηση 4 • Εύρεση Μεταβλητής
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
                      className={`p-3 rounded-xl text-base font-mono font-black border text-center transition ${
                        answers.q4 === opt
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                      }`}
                    >
                      x = {opt}
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
                    Άσκηση 7 • Δύο Μεταβλητές
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
                    placeholder="Γράψε το αποτέλεσμα..."
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

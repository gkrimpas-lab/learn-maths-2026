import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
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
const REAL_WORLD_COMPARISONS = [
  { item: 'το βάρος της βαλίτσας', unit: 'κιλά' },
  { item: 'το μήκος του υφάσματος', unit: 'μ.' },
  { item: 'η τιμή του ελαιόλαδου', unit: '€' },
  { item: 'η ποσότητα νερού στο παγούρι', unit: 'λ.' },
  { item: 'η θερμοκρασία του ασθενούς', unit: '°C' },
  { item: 'το πάχος του ξύλινου ραφιού', unit: 'εκ.' },
  { item: 'η διάρκεια της διαδρομής', unit: 'ώρες' },
  { item: 'το βάρος του δέματος', unit: 'κιλά' },
  { item: 'η τιμή των βιβλίων', unit: '€' },
  { item: 'το μήκος του καλωδίου', unit: 'μ.' },
  { item: 'η ποσότητα χυμού', unit: 'λ.' },
  { item: 'το βάρος του τυριού', unit: 'κιλά' },
  { item: 'η απόσταση της πεζοπορίας', unit: 'χλμ.' },
  { item: 'το ύψος του φυτού', unit: 'μ.' },
  { item: 'η κατανάλωση ρεύματος', unit: 'kWh' },
  { item: 'το βάρος του μελιού', unit: 'κιλά' },
  { item: 'η τιμή των εισιτηρίων', unit: '€' },
  { item: 'το μήκος της κορδέλας', unit: 'μ.' },
  { item: 'η ποσότητα γάλακτος', unit: 'λ.' },
  { item: 'το βάρος του αλευριού', unit: 'κιλά' },
  { item: 'η χωρητικότητα του δοχείου', unit: 'λ.' }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledItems = shuffle(REAL_WORLD_COMPARISONS);

  // Q1: MCQ (Σύμβολο Σύγκρισης Δεκαδικών - Παγίδα Δεκάτων vs Εκατοστών)
  const q1Int = getRandomInt(12, 45);
  const q1A = `${q1Int},8`;
  const q1B = `${q1Int},75`;
  const q1Correct = '＞';
  const q1Options = ['＞', '＜', '＝'];

  // Q2: MCQ (Σύμβολο Σύγκρισης - Ισοδύναμοι Δεκαδικοί με Μηδενικά)
  const q2Int = getRandomInt(3, 19);
  const q2Dec = getRandomInt(2, 8);
  const q2A = `${q2Int},${q2Dec}0`;
  const q2B = `${q2Int},${q2Dec}`;
  const q2Correct = '＝';
  const q2Options = ['＞', '＜', '＝'];

  // Q3: Input - Εύρεση του μεγαλύτερου αριθμού από λίστα δεκαδικών
  const q3Base = getRandomInt(5, 25);
  const q3List = [
    { text: `${q3Base},65`, val: q3Base + 0.65 },
    { text: `${q3Base},7`, val: q3Base + 0.7 },
    { text: `${q3Base},095`, val: q3Base + 0.095 },
    { text: `${q3Base},608`, val: q3Base + 0.608 }
  ];
  const q3Sorted = [...q3List].sort((a, b) => b.val - a.val);
  const q3CorrectAnswer = q3Sorted[0].text;
  const q3DisplayList = shuffle(q3List.map(o => o.text));

  // Q4: MCQ - Διάταξη από τον μικρότερο στον μεγαλύτερο (Αύξουσα σειρά)
  const q4Base = getRandomInt(2, 8);
  const q4A = `${q4Base},04`;
  const q4B = `${q4Base},4`;
  const q4C = `${q4Base},44`;
  const q4CorrectOrder = `${q4A} ＜ ${q4B} ＜ ${q4C}`;
  const q4Wrong1 = `${q4B} ＜ ${q4A} ＜ ${q4C}`;
  const q4Wrong2 = `${q4C} ＜ ${q4B} ＜ ${q4A}`;
  const q4Wrong3 = `${q4A} ＜ ${q4C} ＜ ${q4B}`;
  const q4Options = shuffle([q4CorrectOrder, q4Wrong1, q4Wrong2, q4Wrong3]);

  // Q5: True / False - Σύγκριση Φυσικών με διαφορετικό πλήθος ψηφίων
  const q5Small = getRandomInt(8500, 9999);
  const q5Big = getRandomInt(10200, 14500);
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? `Ο φυσικός αριθμός ${formatNumber(q5Big)} (5 ψηφία) είναι μεγαλύτερος από τον ${formatNumber(q5Small)} (4 ψηφία).`
    : `Ο φυσικός αριθμός ${formatNumber(q5Small)} είναι μεγαλύτερος από τον ${formatNumber(q5Big)} επειδή ξεκινάει από το 9.`;

  // Q6: True / False - Σύγκριση δεκαδικών ψηφίων (δέκατα έναντι εκατοστών)
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Για να συγκρίνουμε δύο δεκαδικούς αριθμούς με ίσα ακέραια μέρη, συγκρίνουμε πρώτα τα δέκατα και μετά τα εκατοστά.'
    : 'Ο αριθμός 0,79 είναι μεγαλύτερος από τον 0,8 επειδή το 79 είναι μεγαλύτερο από το 8.';

  // Q7: SVG Visual - Ζυγαριά Σύγκρισης (Εύρεση του βαρύτερου)
  const q7Int = getRandomInt(2, 9);
  const q7Left = `${q7Int},35`;
  const q7Right = `${q7Int},4`;
  const q7Correct = q7Right;
  const q7Options = shuffle([q7Left, q7Right, 'Είναι ίσα']);

  // Q8: SVG Visual - Δεκαδική Αριθμογραμμή (Ποιος αριθμός βρίσκεται πιο δεξιά)
  const q8Int = getRandomInt(5, 12);
  const q8StepA = getRandomInt(2, 4);
  const q8StepB = getRandomInt(6, 9);
  const q8ValA = `${q8Int},${q8StepA}`;
  const q8ValB = `${q8Int},${q8StepB}`;
  const q8Correct = q8ValB;
  const q8Options = shuffle([q8ValA, q8ValB, 'Είναι στην ίδια θέση']);

  return {
    q1: {
      type: 'mcq',
      title: 'Σύγκριση Δεκαδικών Αριθμών',
      numA: q1A,
      numB: q1B,
      options: q1Options,
      correct: q1Correct,
      explain: `Εξισώνοντας τα δεκαδικά ψηφία: ${q1A}0 (${q1Int},80) και ${q1B}. Επειδή 80 εκατοστά ＞ 75 εκατοστά, ισχύει ${q1A} ＞ ${q1B}.`
    },
    q2: {
      type: 'mcq',
      title: 'Ισοδύναμοι Δεκαδικοί & Μηδενικά',
      numA: q2A,
      numB: q2B,
      options: q2Options,
      correct: q2Correct,
      explain: `Τα μηδενικά στο τέλος του δεκαδικού μέρους δεν αλλάζουν την αξία του αριθμού. Άρα ${q2A} ＝ ${q2B}.`
    },
    q3: {
      type: 'input',
      title: 'Εύρεση Μεγαλύτερου Αριθμού',
      list: q3DisplayList.join('  •  '),
      correct: q3CorrectAnswer,
      explain: `Συγκρίνοντας τα δέκατα: το ${q3CorrectAnswer} έχει 7 δέκατα (0,700), ενώ οι υπόλοιποι έχουν 6 ή 0 δέκατα. Άρα ο μεγαλύτερος είναι το ${q3CorrectAnswer}.`
    },
    q4: {
      type: 'mcq',
      title: 'Αύξουσα Διάταξη (Μικρότερος ➔ Μεγαλύτερος)',
      prompt: `Διάταξε σε αύξουσα σειρά τους αριθμούς: ${q4B} , ${q4A} , ${q4C}`,
      options: q4Options,
      correct: q4CorrectOrder,
      explain: `Εξισώνοντας τα ψηφία: ${q4Base},04 (4 εκατοστά) ＜ ${q4Base},40 (40 εκατοστά) ＜ ${q4Base},44 (44 εκατοστά). Άρα η σωστή σειρά είναι: ${q4CorrectOrder}.`
    },
    q5: {
      type: 'tf',
      title: 'Πλήθος Ψηφίων σε Φυσικούς',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? `Σωστά! Ο αριθμός ${formatNumber(q5Big)} έχει 5 ψηφία (Δεκάδες Χιλιάδων), ενώ ο ${formatNumber(q5Small)} έχει 4 ψηφία (Μονάδες Χιλιάδων).`
        : `Λάθος! Στους φυσικούς αριθμούς, μεγαλύτερος είναι πάντα εκείνος με τα περισσότερα ψηφία (${formatNumber(q5Big)} ＞ ${formatNumber(q5Small)}).`
    },
    q6: {
      type: 'tf',
      title: 'Κανόνας Σύγκρισης Δεκαδικών',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Συγκρίνουμε διαδοχικά από τα αριστερά προς τα δεξιά (πρώτα δέκατα, μετά εκατοστά, μετά χιλιοστά).'
        : 'Λάθος! 0,8 = 0,80 (80 εκατοστά), το οποίο είναι μεγαλύτερο από το 0,79 (79 εκατοστά).'
    },
    q7: {
      type: 'mcq',
      title: 'Οπτική Ζυγαριά Σύγκρισης',
      leftVal: q7Left,
      rightVal: q7Right,
      options: q7Options,
      correct: q7Correct,
      explain: `Συγκρίνοντας τα δέκατα: ${q7Right} = ${q7Int},40 ＞ ${q7Left}. Επομένως, ο βαρύτερος αριθμός είναι το ${q7Right}.`
    },
    q8: {
      type: 'mcq',
      title: 'Δεκαδική Αριθμογραμμή & Θέση',
      valA: q8ValA,
      valB: q8ValB,
      base: q8Int,
      options: q8Options,
      correct: q8Correct,
      explain: `Στην αριθμογραμμή, μεγαλύτερος είναι ο αριθμός που βρίσκεται πιο δεξιά. Επειδή ${q8ValB} ＞ ${q8ValA}, το ${q8ValB} βρίσκεται πιο δεξιά.`
    }
  };
}

export default function SigkrisiExercisesPage() {
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
      const cleanAns = a.replace(/\s+/g, '').replace('.', ',');
      return cleanAns === q.correct.replace(/\s+/g, '').replace('.', ',');
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
    <Layout
      title="🎯 Ασκήσεις: Σύγκριση & Διάταξη Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στη σύγκριση φυσικών και δεκαδικών αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/04-sigkrisi-arithmon" 
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span> <span>Θεωρία</span>
        </Link>
      }
    >
      <div className="pb-28">
        {/* HEADER HERO BANNER */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white py-8 sm:py-10 px-4 sm:px-6 rounded-3xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-100 border border-white/20">
                <span>🎯 ΣΤ' Δημοτικού • Εξάσκηση</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Σύγκριση & Διάταξη
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα σύγκρισης φυσικών και δεκαδικών και δες την αναλυτική εξήγηση σε κάθε απάντηση!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewQuestions}
              className="px-5 py-3 bg-white text-blue-800 hover:bg-blue-50 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm flex items-center gap-2 shrink-0"
            >
              <span>🔄</span> <span>Νέες Ασκήσεις</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΙΣ 8 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ΕΡΩΤΗΣΗ 1 */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q1')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Άσκηση 1 • Σύμβολο Σύγκρισης
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">
                Επίλεξε το κατάλληλο σύμβολο σύγκρισης (<strong>＞</strong> , <strong>＜</strong> , <strong>＝</strong>):
              </p>
              <div className="p-3.5 bg-slate-100 rounded-2xl font-mono text-lg sm:text-xl text-center font-black text-slate-800 mb-4 flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto">
                <span className="text-emerald-700">{questions.q1.numA}</span>
                <span className="bg-white border border-slate-300 px-3 py-1 rounded-xl text-blue-600 shadow-xs min-w-[44px]">
                  {answers.q1 || '?'}
                </span>
                <span className="text-blue-700">{questions.q1.numB}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {questions.q1.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q1', opt)}
                    className={`p-3 rounded-xl text-base sm:text-lg font-black border text-center transition ${
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
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q2')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                  Άσκηση 2 • Ισοδυναμία
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">
                Επίλεξε το κατάλληλο σύμβολο για τους αριθμούς:
              </p>
              <div className="p-3.5 bg-slate-100 rounded-2xl font-mono text-lg sm:text-xl text-center font-black text-slate-800 mb-4 flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto">
                <span className="text-indigo-700">{questions.q2.numA}</span>
                <span className="bg-white border border-slate-300 px-3 py-1 rounded-xl text-indigo-600 shadow-xs min-w-[44px]">
                  {answers.q2 || '?'}
                </span>
                <span className="text-teal-700">{questions.q2.numB}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {questions.q2.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q2', opt)}
                    className={`p-3 rounded-xl text-base sm:text-lg font-black border text-center transition ${
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
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q3')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                  Άσκηση 3 • Εύρεση Μεγαλύτερου
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q3') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-2 leading-relaxed font-medium">
                Ποιος από τους παρακάτω αριθμούς είναι ο <strong>μεγαλύτερος</strong>;
              </p>
              <div className="p-3 bg-slate-100 rounded-xl font-mono text-xs sm:text-sm text-center font-black text-slate-800 mb-4 overflow-x-auto">
                {questions.q3.list}
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q3}
                  onChange={(e) => handleInputChange('q3', e.target.value.replace(/\./g, ','))}
                  placeholder="Γράψε τον μεγαλύτερο αριθμό (π.χ. 14,8)..."
                  className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-purple-500 outline-none disabled:bg-slate-100 font-mono"
                />
                {submitted && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q3') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                    💡 {questions.q3.explain}
                  </div>
                )}
              </div>
            </div>

            {/* ΕΡΩΤΗΣΗ 4 */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q4')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                  Άσκηση 4 • Διάταξη
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q4') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                {questions.q4.prompt}
              </p>
              <div className="space-y-2 mb-3">
                {questions.q4.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q4', opt)}
                    className={`w-full p-3 rounded-xl text-xs sm:text-sm font-mono font-bold border text-center transition ${
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
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q5')}`}>
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
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q6')}`}>
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
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q7')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-rose-100 text-rose-800 rounded-full">
                  Άσκηση 7 • Οπτική Ζυγαριά
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 font-medium">
                Ποιος από τους δύο αριθμούς είναι ο <strong>μεγαλύτερος (βαρύτερος)</strong>;
              </p>
              
              <div className="bg-slate-100 rounded-2xl p-4 mb-4 flex justify-center overflow-x-auto">
                <svg viewBox="0 0 300 120" className="w-full max-w-xs h-24 shrink-0 select-none">
                  <line x1="40" y1="50" x2="260" y2="70" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                  <polygon points="150,55 140,110 160,110" fill="#475569" />
                  <rect x="110" y="105" width="80" height="10" rx="4" fill="#1e293b" />
                  
                  {/* Left Box */}
                  <rect x="30" y="25" width="55" height="25" rx="5" fill="#059669" />
                  <text x="57" y="42" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                    {questions.q7.leftVal}
                  </text>

                  {/* Right Box (Heavier/Lower) */}
                  <rect x="215" y="45" width="55" height="25" rx="5" fill="#2563eb" />
                  <text x="242" y="62" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#ffffff" fontFamily="monospace">
                    {questions.q7.rightVal}
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {questions.q7.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q7', opt)}
                    className={`p-3 rounded-xl text-xs font-mono font-bold border text-center transition ${
                      answers.q7 === opt
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {submitted && (
                <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q7') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                  💡 {questions.q7.explain}
                </div>
              )}
            </div>

            {/* ΕΡΩΤΗΣΗ 8 */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q8')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-teal-100 text-teal-800 rounded-full">
                  Άσκηση 8 • Αριθμογραμμή
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q8') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 font-medium">
                Ποιος από τους δύο αριθμούς βρίσκεται <strong>πιο δεξιά (είναι μεγαλύτερος)</strong> στην αριθμογραμμή;
              </p>

              <div className="bg-slate-100 p-3 rounded-2xl mb-3 flex items-center justify-center overflow-x-auto">
                <svg viewBox="0 0 300 70" className="w-full max-w-sm h-18 shrink-0 select-none">
                  <line x1="20" y1="40" x2="280" y2="40" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Ticks */}
                  <line x1="30" y1="30" x2="30" y2="50" stroke="#475569" strokeWidth="2" />
                  <text x="30" y="62" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">{questions.q8.base},0</text>
                  
                  <line x1="270" y1="30" x2="270" y2="50" stroke="#475569" strokeWidth="2" />
                  <text x="270" y="62" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0f172a">{questions.q8.base + 1},0</text>

                  {/* Point A */}
                  <circle cx="100" cy="40" r="5.5" fill="#059669" />
                  <text x="100" y="24" fontSize="10" fontWeight="black" textAnchor="middle" fill="#059669" fontFamily="monospace">
                    {questions.q8.valA}
                  </text>

                  {/* Point B */}
                  <circle cx="210" cy="40" r="5.5" fill="#2563eb" />
                  <text x="210" y="24" fontSize="10" fontWeight="black" textAnchor="middle" fill="#2563eb" fontFamily="monospace">
                    {questions.q8.valB}
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {questions.q8.options.slice(0, 2).map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q8', opt)}
                    className={`w-full p-3 rounded-xl text-xs font-mono font-bold border text-center transition ${
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
            <div className="flex justify-center pt-6">
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
      </div>

      {/* FIXED STICKY BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-3`}>
          
          {/* SCORE BADGE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>Σκορ:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                Ποσοστό: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          {/* GUIDANCE TEXT OR RETRY BUTTON */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span>
                <span>Νέες ασκήσεις!</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden md:block">
                Συμπλήρωσε όλες τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}

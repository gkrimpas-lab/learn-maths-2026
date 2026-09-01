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
const REAL_WORLD_MULTIPLICATIONS = [
  { item: 'κουτιά με μαρκαδόρους', unit: 'μαρκαδόροι' },
  { item: 'πακέτα με τετράδια', unit: 'τετράδια' },
  { item: 'κιβώτια με χυμούς', unit: 'μπουκάλια' },
  { item: 'σειρές καθισμάτων στο θέατρο', unit: 'θέσεις' },
  { item: 'δίσκοι με φρέσκα αυγά', unit: 'αυγά' },
  { item: 'σακούλες με καραμέλες', unit: 'καραμέλες' },
  { item: 'ράφια με βιβλία στη βιβλιοθήκη', unit: 'βιβλία' },
  { item: 'παλέτες με τούβλα', unit: 'τούβλα' },
  { item: 'κούτες με μπάλες μπάσκετ', unit: 'μπάλες' },
  { item: 'δοχεία με ελιές', unit: 'κιλά' },
  { item: 'κουτιά με σοκολατάκια', unit: 'σοκολατάκια' },
  { item: 'παρτέρια με τριαντάφυλλα', unit: 'λουλούδια' },
  { item: 'δεμάτια με σανό', unit: 'κιλά' },
  { item: 'κιβώτια με μήλα', unit: 'μήλα' },
  { item: 'πακέτα με αυτοκόλλητα', unit: 'αυτοκόλλητα' },
  { item: 'σειρές με ηλιακά πάνελ', unit: 'πάνελ' },
  { item: 'κιβώτια με αναψυκτικά', unit: 'κουτάκια' },
  { item: 'σακιά με αλεύρι', unit: 'κιλά' },
  { item: 'κουτιά με ξυλομπογιές', unit: 'ξυλομπογιές' },
  { item: 'τελάρα με πορτοκάλια', unit: 'πορτοκάλια' },
  { item: 'πακέτα με σελιδοδείκτες', unit: 'σελιδοδείκτες' }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledItems = shuffle(REAL_WORLD_MULTIPLICATIONS);

  // Q1: Input - Υπολογισμός Γινομένου (με πολλαπλάσιο του 10)
  const q1A = getRandomInt(15, 85);
  const q1Mult = [10, 20, 30, 100, 200][getRandomInt(0, 4)];
  const q1Answer = q1A * q1Mult;

  // Q2: Input - Επιμεριστική Ιδιότητα [α × (β ＋ γ)]
  const q2A = getRandomInt(4, 9);
  const q2Tens = getRandomInt(1, 5) * 10; // π.χ. 20
  const q2Units = getRandomInt(1, 9); // π.χ. 3 -> 23 = 20 + 3
  const q2Total = q2Tens + q2Units;
  const q2Answer = q2A * q2Total;
  const q2Prompt = `${q2A} × (${q2Tens} ＋ ${q2Units})`;

  // Q3: MCQ - Αντιμεταθετική Ιδιότητα
  const q3A = getRandomInt(25, 95);
  const q3B = getRandomInt(12, 48);
  const q3CorrectStr = `${q3B} × ${q3A}`;
  const q3Wrong1 = `${q3B} ＋ ${q3A}`;
  const q3Wrong2 = `${q3A} ＋ ${q3B}`;
  const q3Wrong3 = `${q3A} － ${q3B}`;
  const q3Options = shuffle([q3CorrectStr, q3Wrong1, q3Wrong2, q3Wrong3]);

  // Q4: MCQ - Προσεταιριστική Ιδιότητα (Έξυπνη ομαδοποίηση: π.χ. 25 × 4 = 100)
  const q4PairType = getRandomInt(1, 3);
  let q4A = 25;
  let q4B = 14;
  let q4C = 4;
  if (q4PairType === 1) {
    q4A = 25;
    q4B = getRandomInt(11, 39);
    q4C = 4; // 25 × 4 = 100
  } else if (q4PairType === 2) {
    q4A = 50;
    q4B = getRandomInt(11, 29);
    q4C = 2; // 50 × 2 = 100
  } else {
    q4A = 125;
    q4B = getRandomInt(3, 15);
    q4C = 8; // 125 × 8 = 1000
  }
  const q4Answer = q4A * q4B * q4C;
  const q4Options = shuffle([
    formatNumber(q4Answer),
    formatNumber(q4Answer + 100),
    formatNumber(q4Answer - 50),
    formatNumber(q4Answer * 2)
  ]);

  // Q5: True / False - Ουδέτερο και Απορροφητικό Στοιχείο
  const q5Number = getRandomInt(350, 9500);
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? `Ισχύει ότι ${formatNumber(q5Number)} × 1 ＝ ${formatNumber(q5Number)} και ${formatNumber(q5Number)} × 0 ＝ 0.`
    : `Ισχύει ότι ${formatNumber(q5Number)} × 0 ＝ ${formatNumber(q5Number)} επειδή το 0 είναι το ουδέτερο στοιχείο.`;

  // Q6: True / False - Επιμεριστική Ιδιότητα ως προς την πρόσθεση
  const q6A = getRandomInt(5, 9);
  const q6B = getRandomInt(10, 30);
  const q6C = getRandomInt(2, 8);
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? `Η έκφραση ${q6A} × (${q6B} ＋ ${q6C}) ισούται πάντα με (${q6A} × ${q6B}) ＋ (${q6A} × ${q6C}).`
    : `Η έκφραση ${q6A} × (${q6B} ＋ ${q6C}) ισούται με (${q6A} ＋ ${q6B}) × (${q6A} ＋ ${q6C}).`;

  // Q7: SVG Visual - Ορθογώνιο Πλέγμα (Σειρές × Στήλες)
  const q7Rows = getRandomInt(3, 7);
  const q7Cols = getRandomInt(4, 9);
  const q7Val = q7Rows * q7Cols;

  // Q8: SVG Visual - Επιμεριστικό Εμβαδόν [α × (β ＋ γ)]
  const q8H = getRandomInt(3, 6);
  const q8W1 = getRandomInt(4, 8);
  const q8W2 = getRandomInt(2, 5);
  const q8CorrectArea = q8H * (q8W1 + q8W2);
  const q8Options = shuffle([
    `${q8CorrectArea}`,
    `${q8H * q8W1 + q8W2}`,
    `${(q8H + q8W1) * q8W2}`,
    `${q8CorrectArea + 10}`
  ]);

  return {
    q1: {
      type: 'input',
      title: 'Υπολογισμός Γινομένου',
      prompt: `${q1A} × ${q1Mult}`,
      numA: q1A,
      numB: q1Mult,
      correct: q1Answer,
      itemContext: shuffledItems[0].item,
      explain: `Πολλαπλασιάζουμε: ${q1A} × ${q1Mult} ＝ ${formatNumber(q1Answer)}.`
    },
    q2: {
      type: 'input',
      title: 'Επιμεριστική Ιδιότητα',
      prompt: q2Prompt,
      a: q2A,
      tens: q2Tens,
      units: q2Units,
      correct: q2Answer,
      explain: `Εφαρμόζουμε την επιμεριστική: (${q2A} × ${q2Tens}) ＋ (${q2A} × ${q2Units}) ＝ ${q2A * q2Tens} ＋ ${q2A * q2Units} ＝ ${formatNumber(q2Answer)}.`
    },
    q3: {
      type: 'mcq',
      title: 'Αντιμεταθετική Ιδιότητα',
      prompt: `Σύμφωνα με την αντιμεταθετική ιδιότητα, η παράσταση ${q3A} × ${q3B} είναι ίση με:`,
      options: q3Options,
      correct: q3CorrectStr,
      explain: `Η αντιμεταθετική ιδιότητα ορίζει ότι α × β ＝ β × α. Άρα ${q3A} × ${q3B} ＝ ${q3CorrectStr}.`
    },
    q4: {
      type: 'mcq',
      title: 'Προσεταιριστική Ιδιότητα (Έξυπνοι Υπολογισμοί)',
      prompt: `Υπολόγισε έξυπνα το γινόμενο: (${q4A} × ${q4B}) × ${q4C}`,
      options: q4Options,
      correct: formatNumber(q4Answer),
      explain: `Ομαδοποιούμε πρώτα το (${q4A} × ${q4C}) ＝ ${q4A * q4C}. Στη συνέχεια: ${q4A * q4C} × ${q4B} ＝ ${formatNumber(q4Answer)}.`
    },
    q5: {
      type: 'tf',
      title: 'Ουδέτερο & Απορροφητικό Στοιχείο',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Το 1 είναι το ουδέτερο στοιχείο του πολλαπλασιασμού και το 0 είναι το απορροφητικό στοιχείο.'
        : `Το 0 μηδενίζει κάθε αριθμό (${formatNumber(q5Number)} × 0 ＝ 0), ενώ το 1 διατηρεί την αξία του.`
    },
    q6: {
      type: 'tf',
      title: 'Κανόνας Επιμεριστικής',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Ο παράγοντας έξω από την παρένθεση πολλαπλασιάζεται ξεχωριστά με κάθε προσθετέο μέσα σε αυτή.'
        : 'Ο σωστός τύπος είναι: α × (β ＋ γ) ＝ (α × β) ＋ (α × γ).'
    },
    q7: {
      type: 'input',
      title: 'Οπτικό Πλέγμα Τετραγώνων',
      rows: q7Rows,
      cols: q7Cols,
      correct: q7Val,
      explain: `Το πλέγμα έχει ${q7Rows} γραμμές και ${q7Cols} στήλες, άρα περιέχει ${q7Rows} × ${q7Cols} ＝ ${q7Val} τετραγωνάκια.`
    },
    q8: {
      type: 'mcq',
      title: 'Γεωμετρική Επιμεριστική',
      h: q8H,
      w1: q8W1,
      w2: q8W2,
      options: q8Options,
      correct: `${q8CorrectArea}`,
      explain: `Το συνολικό εμβαδόν είναι ${q8H} × (${q8W1} ＋ ${q8W2}) ＝ (${q8H} × ${q8W1}) ＋ (${q8H} × ${q8W2}) ＝ ${q8H * q8W1} ＋ ${q8H * q8W2} ＝ ${q8CorrectArea}.`
    }
  };
}

export default function PollaplasiasmosExercisesPage() {
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
      return Number(cleanAns) === q.correct;
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
      title="🎯 Ασκήσεις: Πολλαπλασιασμός & Ιδιότητες - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στον πολλαπλασιασμό φυσικών αριθμών και τις ιδιότητες για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/06-pollaplasiasmos" 
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
                <span>🎯 ΣΤ' Δημοτικου • Εξασκηση</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Πολλαπλασιασμός και Ιδιότητες
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα πολλαπλασιασμού, αντιμεταθετικής, προσεταιριστικής και επιμεριστικής ιδιότητας!
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
                  Άσκηση 1 • Υπολογισμός Γινομένου
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                Υπολόγισε το γινόμενο:
              </p>
              <div className="p-3 bg-slate-100 rounded-2xl font-mono text-lg sm:text-xl text-center font-black text-slate-800 mb-4 overflow-x-auto flex items-center justify-center gap-2">
                <span className="text-emerald-700">{questions.q1.numA}</span>
                <span className="text-slate-400">×</span>
                <span className="text-blue-700">{questions.q1.numB}</span>
                <span className="text-slate-400">＝</span>
                <span className="text-amber-600">;</span>
              </div>
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
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q2')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                  Άσκηση 2 • Επιμεριστική Ιδιότητα
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                Υπολόγισε το αποτέλεσμα της επιμεριστικής παράστασης:
              </p>
              <div className="p-3 bg-slate-100 rounded-2xl font-mono text-base sm:text-lg md:text-xl text-center font-black text-slate-800 mb-4 overflow-x-auto flex items-center justify-center gap-2">
                <span className="text-indigo-700">{questions.q2.prompt}</span>
                <span className="text-slate-400">＝</span>
                <span className="text-amber-600">;</span>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q2}
                  onChange={(e) => handleInputChange('q2', e.target.value)}
                  placeholder="Γράψε το τελικό άθροισμα..."
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
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q3')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                  Άσκηση 3 • Αντιμεταθετική
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
                    className={`p-3 rounded-xl text-xs sm:text-sm font-mono font-bold border text-center transition ${
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
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q4')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                  Άσκηση 4 • Προσεταιριστική
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
                    className={`p-3 rounded-xl text-xs sm:text-sm font-mono font-bold border text-center transition ${
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

            {/* ΕΡΩΤΗΣΗ 7: Οπτικό SVG (Πλέγμα Τετραγώνων) */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q7')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-rose-100 text-rose-800 rounded-full">
                  Άσκηση 7 • Οπτικό Πλέγμα
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 font-medium">
                Πόσα τετραγωνάκια περιέχει το πλέγμα (<strong className="text-emerald-700">{questions.q7.rows} γραμμές</strong> × <strong className="text-blue-700">{questions.q7.cols} στήλες</strong>);
              </p>
              
              <div className="bg-slate-100 rounded-2xl p-4 mb-4 flex justify-center overflow-x-auto">
                <svg 
                  viewBox={`0 0 ${questions.q7.cols * 22} ${questions.q7.rows * 22}`} 
                  className="w-full max-w-[260px] sm:max-w-xs h-auto bg-white rounded-lg border border-slate-300 shadow-sm p-1 shrink-0 select-none"
                >
                  {[...Array(questions.q7.rows)].map((_, r) => (
                    <g key={r}>
                      {[...Array(questions.q7.cols)].map((_, c) => (
                        <rect
                          key={c}
                          x={c * 22}
                          y={r * 22}
                          width="20"
                          height="20"
                          rx="3"
                          fill="#f59e0b"
                          stroke="#d97706"
                          strokeWidth="1"
                        />
                      ))}
                    </g>
                  ))}
                </svg>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q7}
                  onChange={(e) => handleInputChange('q7', e.target.value)}
                  placeholder="Γράψε τον συνολικό αριθμό..."
                  className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-rose-500 outline-none disabled:bg-slate-100 font-mono"
                />
                {submitted && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q7') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                    💡 {questions.q7.explain}
                  </div>
                )}
              </div>
            </div>

            {/* ΕΡΩΤΗΣΗ 8: Οπτικό SVG (Επιμεριστικό Εμβαδόν) */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q8')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-teal-100 text-teal-800 rounded-full">
                  Άσκηση 8 • Γεωμετρική Επιμεριστική
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q8') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 font-medium">
                Ποιο είναι το συνολικό εμβαδόν του ορθογωνίου: <strong className="text-teal-700 font-mono">{questions.q8.h} × ({questions.q8.w1} ＋ {questions.q8.w2})</strong>;
              </p>

              <div className="bg-slate-100 p-3 rounded-2xl mb-3 flex items-center justify-center overflow-x-auto">
                <div className="flex w-full max-w-[260px] sm:max-w-xs h-20 rounded-xl overflow-hidden border-2 border-slate-700 shadow-sm text-white font-mono font-bold text-xs shrink-0 select-none">
                  <div 
                    className="bg-emerald-500 flex flex-col items-center justify-center transition-all p-1 text-center"
                    style={{ flexGrow: questions.q8.w1 }}
                  >
                    <span>{questions.q8.h} × {questions.q8.w1}</span>
                    <span className="text-[10px] opacity-80">({questions.q8.h * questions.q8.w1})</span>
                  </div>
                  <div 
                    className="bg-cyan-500 flex flex-col items-center justify-center transition-all border-l-2 border-dashed border-white/60 p-1 text-center"
                    style={{ flexGrow: questions.q8.w2 }}
                  >
                    <span>{questions.q8.h} × {questions.q8.w2}</span>
                    <span className="text-[10px] opacity-80">({questions.q8.h * questions.q8.w2})</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {questions.q8.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q8', opt)}
                    className={`w-full p-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold border text-center transition ${
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

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
const REAL_WORLD_ADDITIONS = [
  { item: 'το βάρος της τσάντας', unit: 'κιλά' },
  { item: 'η τιμή των σχολικών ειδών', unit: '€' },
  { item: 'το μήκος του υφάσματος', unit: 'μ.' },
  { item: 'η ποσότητα χυμού', unit: 'λ.' },
  { item: 'το βάρος του μελιού', unit: 'κιλά' },
  { item: 'η απόσταση της διαδρομής', unit: 'χλμ.' },
  { item: 'η τιμή των εισιτηρίων', unit: '€' },
  { item: 'η διάρκεια της προπόνησης', unit: 'ώρες' },
  { item: 'το πάχος του βιβλίου', unit: 'εκ.' },
  { item: 'η κατανάλωση νερού', unit: 'λ.' },
  { item: 'το βάρος των φρούτων', unit: 'κιλά' },
  { item: 'η τιμή του γεύματος', unit: '€' },
  { item: 'το μήκος της κορδέλας', unit: 'μ.' },
  { item: 'το βάρος της ζύμης', unit: 'κιλά' },
  { item: 'η ποσότητα γάλακτος', unit: 'λ.' },
  { item: 'το μήκος του καλωδίου', unit: 'μ.' },
  { item: 'η τιμή του βιβλίου', unit: '€' },
  { item: 'το βάρος του δέματος', unit: 'κιλά' },
  { item: 'η ποσότητα ελαιόλαδου', unit: 'λ.' },
  { item: 'το ύψος του ξύλινου ραφιού', unit: 'εκ.' },
  { item: 'η κατανάλωση ρεύματος', unit: 'kWh' }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledItems = shuffle(REAL_WORLD_ADDITIONS);

  // Q1: Input - Κάθετη Πρόσθεση Δεκαδικών με διαφορετικά δεκαδικά ψηφία
  const q1IntA = getRandomInt(12, 65);
  const q1DecA = getRandomInt(1, 9) * 10 + getRandomInt(1, 9);
  const q1IntB = getRandomInt(8, 35);
  const q1DecB = getRandomInt(1, 9);
  const q1AStr = `${q1IntA},${q1DecA}`;
  const q1BStr = `${q1IntB},${q1DecB}`;
  const q1ValA = q1IntA + q1DecA / 100;
  const q1ValB = q1IntB + q1DecB / 10;
  const q1Correct = (q1ValA + q1ValB).toFixed(2).replace('.', ',');

  // Q2: Input - Εύρεση άγνωστου προσθετέου μέσω αφαίρεσης (α ＋ x ＝ γ)
  const q2Int = getRandomInt(15, 80);
  const q2Dec = getRandomInt(1, 9) * 10;
  const q2SumInt = q2Int + getRandomInt(10, 40);
  const q2AStr = `${q2Int},${q2Dec / 10}`;
  const q2SumStr = `${q2SumInt},${q2Dec / 10 + 5 > 9 ? 8 : q2Dec / 10 + 5}`;
  const q2ValA = parseFloat(q2AStr.replace(',', '.'));
  const q2ValSum = parseFloat(q2SumStr.replace(',', '.'));
  const q2Correct = (q2ValSum - q2ValA).toFixed(2).replace(/\.?0+$/, '').replace('.', ',');

  // Q3: MCQ - Αντιμεταθετική Ιδιότητα
  const q3A = `${getRandomInt(10, 40)},${getRandomInt(1, 9)}`;
  const q3B = `${getRandomInt(10, 40)},${getRandomInt(11, 89)}`;
  const q3CorrectOption = `${q3B} ＋ ${q3A}`;
  const q3Wrong1 = `${q3B} － ${q3A}`;
  const q3Wrong2 = `${q3A} － ${q3B}`;
  const q3Wrong3 = `${q3A} × ${q3B}`;
  const q3Options = shuffle([q3CorrectOption, q3Wrong1, q3Wrong2, q3Wrong3]);

  // Q4: MCQ - Προσεταιριστική Ιδιότητα
  const q4A = `${getRandomInt(2, 8)},25`;
  const q4B = `${getRandomInt(10, 30)},6`;
  const q4C = `${getRandomInt(1, 5)},75`;
  const q4CorrectSum = (
    parseFloat(q4A.replace(',', '.')) +
    parseFloat(q4B.replace(',', '.')) +
    parseFloat(q4C.replace(',', '.'))
  ).toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
  const q4Wrong1 = (parseFloat(q4CorrectSum.replace(',', '.')) + 1).toFixed(1).replace('.', ',');
  const q4Wrong2 = (parseFloat(q4CorrectSum.replace(',', '.')) - 0.5).toFixed(1).replace('.', ',');
  const q4Wrong3 = (parseFloat(q4CorrectSum.replace(',', '.')) + 0.1).toFixed(2).replace('.', ',');
  const q4Options = shuffle([q4CorrectSum, q4Wrong1, q4Wrong2, q4Wrong3]);

  // Q5: True / False - Στοίχιση υποδιαστολών
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Κατά την κάθετη πρόσθεση δεκαδικών αριθμών, τοποθετούμε τις υποδιαστολές ακριβώς στην ίδια κατακόρυφη στήλη.'
    : 'Κατά την κάθετη πρόσθεση δεκαδικών αριθμών, στοιχίζουμε πάντα το τελευταίο ψηφίο στα δεξιά ανεξάρτητα από την υποδιαστολή.';

  // Q6: True / False - Αφαίρεση ως αντίθετη πράξη / Δοκιμή
  const q6A = getRandomInt(10, 50);
  const q6B = getRandomInt(5, 25);
  const q6Sum = q6A + q6B;
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? `Αν ${q6A} ＋ ${q6B} ＝ ${q6Sum}, τότε ισχύει πάντα ότι ${q6Sum} － ${q6B} ＝ ${q6A}.`
    : `Αν ${q6A} ＋ ${q6B} ＝ ${q6Sum}, τότε η πράξη ${q6Sum} ＋ ${q6B} αποτελεί τη δοκιμή της πρόσθεσης.`;

  // Q7: SVG Visual - Κάθετη Πρόσθεση με τέλεια στοίχιση
  const q7TopInt = getRandomInt(20, 50);
  const q7TopDec = getRandomInt(1, 9); // 1 ψηφίο
  const q7BotInt = getRandomInt(10, 30);
  const q7BotDec = getRandomInt(11, 89); // 2 ψηφία
  const q7TopStr = `${q7TopInt},${q7TopDec}`;
  const q7BotStr = `${q7BotInt},${q7BotDec}`;
  const q7CorrectVal = (
    parseFloat(q7TopStr.replace(',', '.')) +
    parseFloat(q7BotStr.replace(',', '.'))
  ).toFixed(2).replace('.', ',');

  // Q8: SVG Visual - Αριθμογραμμή Μετακίνησης
  const q8Base = getRandomInt(2, 6);
  const q8Step = getRandomInt(2, 5);
  const q8StartStr = `${q8Base},0`;
  const q8AddStr = `0,${q8Step}`;
  const q8ResultStr = `${q8Base},${q8Step}`;
  const q8Options = shuffle([
    q8ResultStr,
    `${q8Base + 1},${q8Step}`,
    `${q8Base},0${q8Step}`,
    `${q8Base - 1},${q8Step}`
  ]);

  return {
    q1: {
      type: 'input',
      title: 'Κάθετη Πρόσθεση Δεκαδικών',
      prompt: `${q1AStr} ＋ ${q1BStr}`,
      numA: q1AStr,
      numB: q1BStr,
      correct: q1Correct,
      explain: `Συμπληρώνοντας μηδενικό: ${q1AStr} ＋ ${q1BStr}0 ＝ ${q1Correct}.`
    },
    q2: {
      type: 'input',
      title: 'Εύρεση Άγνωστου Προσθετέου',
      numA: q2AStr,
      sumStr: q2SumStr,
      correct: q2Correct,
      explain: `Χρησιμοποιούμε την αφαίρεση ως αντίθετη πράξη: ${q2SumStr} － ${q2AStr} ＝ ${q2Correct}.`
    },
    q3: {
      type: 'mcq',
      title: 'Αντιμεταθετική Ιδιότητα',
      prompt: `Σύμφωνα με την αντιμεταθετική ιδιότητα, η παράσταση ${q3A} ＋ ${q3B} είναι ίση με:`,
      options: q3Options,
      correct: q3CorrectOption,
      explain: `Η αντιμεταθετική ιδιότητα ορίζει ότι α ＋ β ＝ β ＋ α. Άρα ${q3A} ＋ ${q3B} ＝ ${q3CorrectOption}.`
    },
    q4: {
      type: 'mcq',
      title: 'Προσεταιριστική Ιδιότητα',
      prompt: `Υπολόγισε έξυπνα το άθροισμα: (${q4A} ＋ ${q4C}) ＋ ${q4B}`,
      options: q4Options,
      correct: q4CorrectSum,
      explain: `Προσθέτουμε πρώτα τα συμπληρώματα: ${q4A} ＋ ${q4C} ＝ ${(parseFloat(q4A.replace(',', '.')) + parseFloat(q4C.replace(',', '.'))).toFixed(2).replace(/\.?0+$/, '').replace('.', ',')}. Στη συνέχεια προσθέτουμε το ${q4B} και βρίσκουμε ${q4CorrectSum}.`
    },
    q5: {
      type: 'tf',
      title: 'Στοίχιση Υποδιαστολής',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Η στοίχιση των υποδιαστολών εξασφαλίζει ότι προσθέτουμε ομώνυμες τάξεις (δέκατα με δέκατα, μονάδες με μονάδες).'
        : 'Λάθος! Στους δεκαδικούς αριθμούς στοιχίζουμε πάντα τις υποδιαστολές, όχι τα τελευταία ψηφία.'
    },
    q6: {
      type: 'tf',
      title: 'Αφαίρεση ως Δοκιμή',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? `Σωστά! Η αφαίρεση είναι η αντίστροφη πράξη της πρόσθεσης: ${q6Sum} － ${q6B} ＝ ${q6A}.`
        : 'Λάθος! Η δοκιμή της πρόσθεσης γίνεται με αφαίρεση ενός προσθετέου από το άθροισμα.'
    },
    q7: {
      type: 'input',
      title: 'Οπτική Κάθετη Στοίχιση',
      topInt: String(q7TopInt),
      topDec: String(q7TopDec),
      botInt: String(q7BotInt),
      botDec: String(q7BotDec),
      topStr: q7TopStr,
      botStr: q7BotStr,
      correct: q7CorrectVal,
      explain: `Στοιχίζοντας κατακόρυφα τις υποδιαστολές και προσθέτοντας μηδενικό (${q7TopStr}0 ＋ ${q7BotStr}): βρίσκουμε ${q7CorrectVal}.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόσθεση στην Αριθμογραμμή',
      startStr: q8StartStr,
      addStr: q8AddStr,
      base: q8Base,
      step: q8Step,
      options: q8Options,
      correct: q8ResultStr,
      explain: `Ξεκινώντας από το ${q8StartStr} και μετακινούμενοι δεξιά κατά ${q8AddStr}, φτάνουμε στο ${q8ResultStr}.`
    }
  };
}

export default function ProsthesiExercisesPage() {
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
      const cleanCorrect = q.correct.replace(/\s+/g, '').replace('.', ',');
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
    <Layout
      title="🎯 Ασκήσεις: Πρόσθεση & Ιδιότητες - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στην πρόσθεση φυσικών και δεκαδικών αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/05-prosthesi" 
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
                Διαδραστικές Ασκήσεις: Πρόσθεση & Ιδιότητες
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα πρόσθεσης, ιδιοτήτων και αφαίρεσης και δες την αναλυτική εξήγηση σε κάθε απάντηση!
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
                  Άσκηση 1 • Πρόσθεση Δεκαδικών
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                Υπολόγισε το άθροισμα των δεκαδικών αριθμών:
              </p>
              <div className="p-3 bg-slate-100 rounded-2xl font-mono text-lg sm:text-xl text-center font-black text-slate-800 mb-4 overflow-x-auto flex items-center justify-center gap-2">
                <span className="text-emerald-700">{questions.q1.numA}</span>
                <span className="text-slate-400">＋</span>
                <span className="text-blue-700">{questions.q1.numB}</span>
                <span className="text-slate-400">＝</span>
                <span className="text-amber-600">;</span>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q1}
                  onChange={(e) => handleInputChange('q1', e.target.value.replace(/\./g, ','))}
                  placeholder="π.χ. 53,25"
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
                  Άσκηση 2 • Άγνωστος Προσθετέος
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                Βρες τον αριθμό που λείπει από την ισότητα:
              </p>
              <div className="p-3 bg-slate-100 rounded-2xl font-mono text-lg sm:text-xl text-center font-black text-slate-800 mb-4 overflow-x-auto flex items-center justify-center gap-2">
                <span className="text-emerald-700">{questions.q2.numA}</span>
                <span className="text-slate-400">＋</span>
                <span className="text-amber-600 bg-white px-2.5 py-0.5 rounded-lg border border-slate-300">?</span>
                <span className="text-slate-400">＝</span>
                <span className="text-indigo-700">{questions.q2.sumStr}</span>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q2}
                  onChange={(e) => handleInputChange('q2', e.target.value.replace(/\./g, ','))}
                  placeholder="Γράψε τον αριθμό που λείπει..."
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

            {/* ΕΡΩΤΗΣΗ 7: Οπτικό SVG */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q7')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-rose-100 text-rose-800 rounded-full">
                  Άσκηση 7 • Κάθετη Στοίχιση
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 font-medium">
                Υπολόγισε το αποτέλεσμα της κάθετης πράξης:
              </p>
              
              <div className="bg-slate-100 rounded-2xl p-4 mb-4 flex justify-center overflow-x-auto">
                <svg viewBox="0 0 200 90" className="w-48 h-24 bg-white rounded-xl border border-slate-300 shadow-sm shrink-0 select-none">
                  {/* Plus sign */}
                  <text x="35" y="56" fontSize="16" fontWeight="bold" textAnchor="start" fill="#94a3b8" fontFamily="sans-serif">
                    ＋
                  </text>

                  {/* Top Number: Int - Comma - Dec */}
                  <text x="110" y="32" fontSize="16" fontWeight="bold" textAnchor="end" fill="#059669" fontFamily="monospace">
                    {questions.q7.topInt}
                  </text>
                  <text x="115" y="32" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#d97706" fontFamily="monospace">
                    ,
                  </text>
                  <text x="120" y="32" fontSize="16" fontWeight="bold" textAnchor="start" fill="#059669" fontFamily="monospace">
                    {questions.q7.topDec}
                  </text>

                  {/* Bottom Number: Int - Comma - Dec */}
                  <text x="110" y="56" fontSize="16" fontWeight="bold" textAnchor="end" fill="#2563eb" fontFamily="monospace">
                    {questions.q7.botInt}
                  </text>
                  <text x="115" y="56" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#d97706" fontFamily="monospace">
                    ,
                  </text>
                  <text x="120" y="56" fontSize="16" fontWeight="bold" textAnchor="start" fill="#2563eb" fontFamily="monospace">
                    {questions.q7.botDec}
                  </text>

                  {/* Horizontal Line */}
                  <line x1="30" y1="66" x2="170" y2="66" stroke="#334155" strokeWidth="2" />
                </svg>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q7}
                  onChange={(e) => handleInputChange('q7', e.target.value.replace(/\./g, ','))}
                  placeholder="Γράψε το τελικό αποτέλεσμα..."
                  className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-rose-500 outline-none disabled:bg-slate-100 font-mono"
                />
                {submitted && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q7') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                    💡 {questions.q7.explain}
                  </div>
                )}
              </div>
            </div>

            {/* ΕΡΩΤΗΣΗ 8: SVG Αριθμογραμμή */}
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
                Σε ποιον αριθμό καταλήγει το βέλος πρόσθεσης (<strong className="text-emerald-700">{questions.q8.startStr}</strong> ＋ <strong className="text-blue-700">{questions.q8.addStr}</strong>);
              </p>

              <div className="bg-slate-100 p-3 rounded-2xl mb-3 flex items-center justify-center overflow-x-auto">
                <svg viewBox="0 0 300 80" className="w-full max-w-sm h-20 shrink-0 select-none">
                  <line x1="20" y1="55" x2="280" y2="55" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Start Tick */}
                  <line x1="50" y1="45" x2="50" y2="65" stroke="#475569" strokeWidth="2" />
                  <text x="50" y="75" fontSize="11" fontWeight="black" textAnchor="middle" fill="#0f172a">
                    {questions.q8.startStr}
                  </text>

                  {/* End Tick */}
                  <line x1={50 + questions.q8.step * 25} y1="45" x2={50 + questions.q8.step * 25} y2="65" stroke="#475569" strokeWidth="2" />
                  <text x={50 + questions.q8.step * 25} y="75" fontSize="11" fontWeight="black" textAnchor="middle" fill="#2563eb">
                    ?
                  </text>

                  {/* Arc Arrow */}
                  <path
                    d={`M 50 45 Q ${50 + (questions.q8.step * 25) / 2} 15 ${50 + questions.q8.step * 25} 45`}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                  <text x={50 + (questions.q8.step * 25) / 2} y="22" fontSize="10" fontWeight="black" textAnchor="middle" fill="#2563eb">
                    ＋{questions.q8.addStr}
                  </text>
                </svg>
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

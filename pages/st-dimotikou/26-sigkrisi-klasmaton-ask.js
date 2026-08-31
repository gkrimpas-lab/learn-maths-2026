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

// Δεξαμενή σεναρίων καθημερινότητας
const REAL_WORLD_SCENARIOS = [
  { item: 'της διαδρομής', p1: 'Ο Νίκος', p2: 'Η Ελένη', n1: 3, d1: 4, n2: 5, d2: 8 },
  { item: 'του βιβλίου', p1: 'Ο Γιώργος', p2: 'Η Μαρία', n1: 2, d1: 3, n2: 3, d2: 5 },
  { item: 'της πίτσας', p1: 'Ο Πέτρος', p2: 'Η Άννα', n1: 5, d1: 6, n2: 7, d2: 8 },
  { item: 'του κήπου', p1: 'Ο Κώστας', p2: 'Η Σοφία', n1: 3, d1: 5, n2: 4, d2: 10 }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledScenarios = shuffle(REAL_WORLD_SCENARIOS);

  // Q1: Interactive Comparison Buttons (>, <, =) - Ομώνυμα κλάσματα
  const q1Den = getRandomInt(4, 12);
  const q1Num1 = getRandomInt(1, q1Den - 1);
  let q1Num2 = getRandomInt(1, q1Den - 1);
  if (q1Num1 === q1Num2) q1Num2 = (q1Num1 % (q1Den - 1)) + 1;
  const q1Correct = q1Num1 > q1Num2 ? '>' : '<';

  // Q2: Interactive Comparison Buttons (>, <, =) - Ίδιοι Αριθμητές
  const q2Num = getRandomInt(2, 6);
  const q2Den1 = getRandomInt(q2Num + 1, 10);
  let q2Den2 = getRandomInt(q2Num + 1, 10);
  if (q2Den1 === q2Den2) q2Den2 = q2Den1 + 1;
  const q2Correct = q2Den1 < q2Den2 ? '>' : '<'; // Μικρότερος παρονομαστής = μεγαλύτερο κλάσμα

  // Q3: Interactive Comparison Buttons (>, <, =) - Ετερώνυμα κλάσματα (Χιαστί)
  const q3Num1 = getRandomInt(2, 5);
  const q3Den1 = getRandomInt(q3Num1 + 1, 8);
  const q3Num2 = getRandomInt(2, 5);
  const q3Den2 = getRandomInt(q3Num2 + 1, 8);
  const cross1 = q3Num1 * q3Den2;
  const cross2 = q3Num2 * q3Den1;
  const q3Correct = cross1 > cross2 ? '>' : cross1 < cross2 ? '<' : '=';

  // Q4: MCQ - Ποιο κλάσμα είναι το ΜΕΓΑΛΥΤΕΡΟ
  const q4List = [
    { n: 1, d: 2, val: 0.5, str: '1/2' },
    { n: 3, d: 4, val: 0.75, str: '3/4' },
    { n: 2, d: 5, val: 0.4, str: '2/5' },
    { n: 5, d: 8, val: 0.625, str: '5/8' }
  ];
  const q4Shuffled = shuffle(q4List);
  const q4MaxItem = q4Shuffled.reduce((max, item) => item.val > max.val ? item : max, q4Shuffled[0]);
  const q4Options = q4Shuffled.map(item => item.str);
  const q4Correct = q4MaxItem.str;

  // Q5: True / False - Σύγκριση κλασμάτων με ίδιο αριθμητή
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Ανάμεσα σε δύο κλάσματα με τον ίδιο αριθμητή, μεγαλύτερο είναι εκείνο με τον μικρότερο παρονομαστή.'
    : 'Ανάμεσα σε δύο κλάσματα με τον ίδιο αριθμητή, μεγαλύτερο είναι εκείνο με τον μεγαλύτερο παρονομαστή.';

  // Q6: True / False - Σύγκριση με τη μονάδα (Γνήσια vs Καταχρηστικά)
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Κάθε καταχρηστικό κλάσμα (αριθμητής > παρονομαστής) είναι μεγαλύτερο από οποιοδήποτε γνήσιο κλάσμα (αριθμητής < παρονομαστής).'
    : 'Ένα γνήσιο κλάσμα μπορεί να είναι μεγαλύτερο από ένα καταχρηστικό κλάσμα.';

  // Q7: Input - Χιαστί γινόμενο
  const q7Num1 = getRandomInt(2, 4);
  const q7Den1 = getRandomInt(5, 7);
  const q7Num2 = getRandomInt(3, 5);
  const q7Den2 = getRandomInt(6, 9);
  const q7CrossLeft = q7Num1 * q7Den2;
  const q7Correct = String(q7CrossLeft);

  // Q8: MCQ - Πρόβλημα Καθημερινότητας
  const sc = shuffledScenarios[0];
  const v1 = sc.n1 / sc.d1;
  const v2 = sc.n2 / sc.d2;
  const q8WhoMore = v1 > v2 ? sc.p1 : v1 < v2 ? sc.p2 : 'Και οι δύο το ίδιο';
  const q8Prompt = `${sc.p1} διάβασε τα ${sc.n1}/${sc.d1} ${sc.item}, ενώ ${sc.p2} διάβασε τα ${sc.n2}/${sc.d2} ${sc.item}. Ποιος διάβασε το μεγαλύτερο μέρος;`;
  const q8Options = shuffle([sc.p1, sc.p2, 'Και οι δύο το ίδιο']);

  return {
    q1: {
      type: 'compare',
      title: 'Ομώνυμα Κλάσματα',
      f1: `${q1Num1}/${q1Den}`,
      f2: `${q1Num2}/${q1Den}`,
      correct: q1Correct,
      explain: `Τα κλάσματα έχουν τον ίδιο παρονομαστή (${q1Den}). Επειδή ${q1Num1} ${q1Correct} ${q1Num2}, ισχύει ${q1Num1}/${q1Den} ${q1Correct} ${q1Num2}/${q1Den}.`
    },
    q2: {
      type: 'compare',
      title: 'Ίδιοι Αριθμητές',
      f1: `${q2Num}/${q2Den1}`,
      f2: `${q2Num}/${q2Den2}`,
      correct: q2Correct,
      explain: `Τα κλάσματα έχουν τον ίδιο αριθμητή (${q2Num}). Μεγαλύτερο είναι εκείνο με τον μικρότερο παρονομαστή, άρα ${q2Num}/${q2Den1} ${q2Correct} ${q2Num}/${q2Den2}.`
    },
    q3: {
      type: 'compare',
      title: 'Ετερώνυμα Κλάσματα',
      f1: `${q3Num1}/${q3Den1}`,
      f2: `${q3Num2}/${q3Den2}`,
      correct: q3Correct,
      explain: `Με πολλαπλασιασμό χιαστί: ${q3Num1} × ${q3Den2} ＝ ${cross1} και ${q3Num2} × ${q3Den1} ＝ ${cross2}. Επειδή ${cross1} ${q3Correct} ${cross2}, ισχύει ${q3Num1}/${q3Den1} ${q3Correct} ${q3Num2}/${q3Den2}.`
    },
    q4: {
      type: 'mcq',
      title: 'Εύρεση Μεγαλύτερου',
      prompt: 'Ποιο από τα παρακάτω κλάσματα είναι το μεγαλύτερο;',
      options: q4Options,
      correct: q4Correct,
      explain: `Μετατρέποντας σε ομώνυμα (ή σε δεκαδικούς), το ${q4Correct} (${q4MaxItem.val.toFixed(3).replace('.', ',')}) είναι το μεγαλύτερο.`
    },
    q5: {
      type: 'tf',
      title: 'Κανόνας Ίδιων Αριθμητών',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Όσο μικρότερος είναι ο παρονομαστής, σε τόσο λιγότερα και άρα μεγαλύτερα κομμάτια χωρίζεται η μονάδα.'
        : 'Μεγαλύτερο είναι εκείνο με τον ΜΙΚΡΟΤΕΡΟ παρονομαστή.'
    },
    q6: {
      type: 'tf',
      title: 'Σύγκριση με τη Μονάδα',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Τα γνήσια κλάσματα είναι < 1, ενώ τα καταχρηστικά είναι > 1. Επομένως κάθε καταχρηστικό είναι μεγαλύτερο από κάθε γνήσιο.'
        : 'Κανένα γνήσιο κλάσμα (< 1) δεν μπορεί να ξεπεράσει ένα καταχρηστικό κλάσμα (> 1).'
    },
    q7: {
      type: 'input',
      title: 'Υπολογισμός Χιαστί',
      prompt: `Στη σύγκριση ${q7Num1}/${q7Den1} και ${q7Num2}/${q7Den2}, ποιο είναι το αριστερό χιαστί γινόμενο (${q7Num1} × ${q7Den2});`,
      correct: q7Correct,
      explain: `Το αριστερό χιαστί γινόμενο είναι: ${q7Num1} × ${q7Den2} ＝ ${q7Correct}.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: q8Prompt,
      options: q8Options,
      correct: q8WhoMore,
      explain: `Συγκρίνουμε ${sc.n1}/${sc.d1} (${(v1).toFixed(2).replace('.', ',')}) και ${sc.n2}/${sc.d2} (${(v2).toFixed(2).replace('.', ',')}). Μεγαλύτερο μέρος διάβασε: ${q8WhoMore}.`
    }
  };
}

export default function SigkrisiKlasmatonExercisesPage() {
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

    if (q.type === 'compare') {
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

  const actionButton = (
    <Link
      href="/st-dimotikou/26-sigkrisi-klasmaton"
      className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
    >
      <span>📖</span>
      <span>Θεωρία</span>
    </Link>
  );

  return (
    <Layout
      title="🎯 Ασκήσεις: 26. Σύγκριση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στη σύγκριση ομώνυμων, ετερώνυμων και ισοδύναμων κλασμάτων για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      actionButton={actionButton}
      hideFooter={true}
    >
      <div className="py-6 md:py-10 space-y-8 pb-28 sm:pb-32">

        {/* 1. HEADER HERO BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-100 border border-white/20">
                <span>🎯 ΣΤ' Δημοτικού • Εξάσκηση</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Σύγκριση Κλασμάτων
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα σύγκρισης ομώνυμων, ετερώνυμων κλασμάτων, μεθόδου χιαστί και σύγκρισης με τη μονάδα!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewQuestions}
              className="px-5 py-3 bg-white text-blue-800 hover:bg-blue-50 rounded-2xl font-extrabold shadow-md transition transform active:scale-95 text-xs sm:text-sm flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-center"
            >
              <span>🔄</span>
              <span>Νέες Ασκήσεις</span>
            </button>
          </div>
        </div>

        {/* 2. ΦΟΡΜΑ ΜΕ ΤΙΣ 8 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ΕΡΩΤΗΣΗ 1: ΟΜΩΝΥΜΑ ΚΛΑΣΜΑΤΑ */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q1')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Άσκηση 1 • Ομώνυμα Κλάσματα
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-4 font-medium text-center">
                Σύγκρινε τα κλάσματα επιλέγοντας το σωστό σύμβολο:
              </p>
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 font-mono text-lg sm:text-xl font-black">
                <span className="text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                  {questions.q1.f1}
                </span>
                <span className="text-amber-500 text-2xl font-bold min-w-[24px] text-center">
                  {answers.q1 || '?'}
                </span>
                <span className="text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                  {questions.q1.f2}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {['>', '<', '='].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q1', sym)}
                    className={`py-3 rounded-xl font-mono font-black text-xl border transition ${
                      answers.q1 === sym
                        ? 'bg-blue-600 text-white border-blue-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
              {submitted && (
                <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q1') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                  💡 {questions.q1.explain}
                </div>
              )}
            </div>

            {/* ΕΡΩΤΗΣΗ 2: ΙΔΙΟΙ ΑΡΙΘΜΗΤΕΣ */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q2')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                  Άσκηση 2 • Ίδιοι Αριθμητές
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-4 font-medium text-center">
                Σύγκρινε τα κλάσματα επιλέγοντας το σωστό σύμβολο:
              </p>
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 font-mono text-lg sm:text-xl font-black">
                <span className="text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                  {questions.q2.f1}
                </span>
                <span className="text-amber-500 text-2xl font-bold min-w-[24px] text-center">
                  {answers.q2 || '?'}
                </span>
                <span className="text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                  {questions.q2.f2}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {['>', '<', '='].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q2', sym)}
                    className={`py-3 rounded-xl font-mono font-black text-xl border transition ${
                      answers.q2 === sym
                        ? 'bg-purple-600 text-white border-purple-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
              {submitted && (
                <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q2') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                  💡 {questions.q2.explain}
                </div>
              )}
            </div>

            {/* ΕΡΩΤΗΣΗ 3: ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ (ΧΙΑΣΤΙ) */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q3')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                  Άσκηση 3 • Ετερώνυμα Κλάσματα
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q3') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-4 font-medium text-center">
                Σύγκρινε τα κλάσματα επιλέγοντας το σωστό σύμβολο:
              </p>
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 font-mono text-lg sm:text-xl font-black">
                <span className="text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  {questions.q3.f1}
                </span>
                <span className="text-amber-500 text-2xl font-bold min-w-[24px] text-center">
                  {answers.q3 || '?'}
                </span>
                <span className="text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  {questions.q3.f2}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {['>', '<', '='].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q3', sym)}
                    className={`py-3 rounded-xl font-mono font-black text-xl border transition ${
                      answers.q3 === sym
                        ? 'bg-amber-500 text-white border-amber-500 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                    }`}
                  >
                    {sym}
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
                <span className="text-xs font-black px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                  Άσκηση 4 • Εύρεση Μεγαλύτερου
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
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
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
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-cyan-50'
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
                  Άσκηση 7 • Χιαστί Πολλαπλασιασμός
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
                  placeholder="Γράψε το γινόμενο..."
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
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q8')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-teal-100 text-teal-800 rounded-full">
                  Άσκηση 8 • Πρόβλημα Καθημερινότητας
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q8') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 font-medium leading-relaxed">
                {questions.q8.prompt}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
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
            <div className="flex justify-center pt-4 sm:pt-6">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#10b981] hover:bg-[#059669] text-white text-base md:text-lg font-black px-8 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <span className="text-xl">🎯</span>
                <span>Έλεγχος Απαντήσεων</span>
              </button>
            </div>
          )}
        </form>

      </div>

      {/* 3. FIXED STICKY BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 sm:py-4 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* ΑΡΙΣΤΕΡΑ: SCORE BADGE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>Σκορ:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
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
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
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
    </Layout>
  );
}

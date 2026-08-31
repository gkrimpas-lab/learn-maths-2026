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

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  // Q1: MCQ - Επιλογή του σωστού γινομένου παραγόντων με μέγιστους εκθέτες
  const q1Items = [
    {
      n1: '12 = 2² × 3',
      n2: '18 = 2 × 3²',
      correct: '2² × 3²',
      val: 36,
      wrong: ['2 × 3', '2² × 3', '2³ × 3³']
    },
    {
      n1: '20 = 2² × 5',
      n2: '30 = 2 × 3 × 5',
      correct: '2² × 3 × 5',
      val: 60,
      wrong: ['2 × 5', '2² × 5²', '2 × 3 × 5']
    },
    {
      n1: '24 = 2³ × 3',
      n2: '36 = 2² × 3²',
      correct: '2³ × 3²',
      val: 72,
      wrong: ['2² × 3', '2³ × 3', '2⁴ × 3²']
    },
    {
      n1: '15 = 3 × 5',
      n2: '20 = 2² × 5',
      correct: '2² × 3 × 5',
      val: 60,
      wrong: ['5', '3 × 5', '2² × 5']
    }
  ];
  const q1Chosen = q1Items[getRandomInt(0, q1Items.length - 1)];
  const q1Options = shuffle([q1Chosen.correct, ...q1Chosen.wrong]);

  // Q2: Input - Υπολογισμός Ε.Κ.Π. από δοσμένες παραγοντοποιήσεις
  const q2Items = [
    {
      expr1: '2² × 5',
      expr2: '2 × 5²',
      correctVal: 100,
      explain: 'Ε.Κ.Π. ＝ 2² × 5² ＝ 4 × 25 ＝ 100'
    },
    {
      expr1: '2³ × 3',
      expr2: '3² × 5',
      correctVal: 360,
      explain: 'Ε.Κ.Π. ＝ 2³ × 3² × 5 ＝ 8 × 9 × 5 ＝ 360'
    },
    {
      expr1: '2² × 3²',
      expr2: '2 × 3 × 5',
      correctVal: 180,
      explain: 'Ε.Κ.Π. ＝ 2² × 3² × 5 ＝ 4 × 9 × 5 ＝ 180'
    },
    {
      expr1: '2⁴ × 3',
      expr2: '2² × 3²',
      correctVal: 144,
      explain: 'Ε.Κ.Π. ＝ 2⁴ × 3² ＝ 16 × 9 ＝ 144'
    }
  ];
  const q2Chosen = q2Items[getRandomInt(0, q2Items.length - 1)];
  const q2Prompt = `Αν Α ＝ ${q2Chosen.expr1} και Β ＝ ${q2Chosen.expr2}, ποιο είναι το Ε.Κ.Π.(Α, Β);`;
  const q2Correct = String(q2Chosen.correctVal);

  // Q3: MCQ - Ποιον εκθέτη επιλέγουμε για κοινό παράγοντα
  const q3Exponents = [
    { base: 2, e1: 2, e2: 4, correct: '2⁴', wrong: ['2²', '2⁶', '2⁸'] },
    { base: 3, e1: 3, e2: 1, correct: '3³', wrong: ['3', '3⁴', '3²'] },
    { base: 5, e1: 1, e2: 2, correct: '5²', wrong: ['5', '5³', '5⁴'] }
  ];
  const q3Chosen = q3Exponents[getRandomInt(0, q3Exponents.length - 1)];
  const q3Prompt = `Αν στην ανάλυση δύο αριθμών εμφανίζεται ο παράγοντας ${q3Chosen.base} ως ${q3Chosen.base}${q3Chosen.e1 === 1 ? '' : q3Chosen.e1 === 2 ? '²' : '³'} και ${q3Chosen.base}${q3Chosen.e2 === 1 ? '' : q3Chosen.e2 === 2 ? '²' : q3Chosen.e2 === 4 ? '⁴' : '³'}, ποια δύναμη θα συμπεριλάβουμε στο Ε.Κ.Π.;`;
  const q3Options = shuffle([q3Chosen.correct, ...q3Chosen.wrong]);

  // Q4: MCQ - Ε.Κ.Π. 3 αριθμών με παραγοντοποίηση
  const q4Items = [
    {
      n1: '8 = 2³',
      n2: '12 = 2² × 3',
      n3: '15 = 3 × 5',
      correct: '2³ × 3 × 5 (＝ 120)',
      wrong: ['2² × 3 (＝ 12)', '2³ × 3² (＝ 72)', '2 × 3 × 5 (＝ 30)']
    },
    {
      n1: '10 = 2 × 5',
      n2: '15 = 3 × 5',
      n3: '20 = 2² × 5',
      correct: '2² × 3 × 5 (＝ 60)',
      wrong: ['2 × 3 × 5 (＝ 30)', '5 (＝ 5)', '2² × 5 (＝ 20)']
    },
    {
      n1: '6 = 2 × 3',
      n2: '9 = 3²',
      n3: '12 = 2² × 3',
      correct: '2² × 3² (＝ 36)',
      wrong: ['2 × 3 (＝ 6)', '2² × 3 (＝ 12)', '2³ × 3³ (＝ 216)']
    }
  ];
  const q4Chosen = q4Items[getRandomInt(0, q4Items.length - 1)];
  const q4Prompt = `Ποιο είναι το Ε.Κ.Π. των αριθμών: ${q4Chosen.n1}, ${q4Chosen.n2}, ${q4Chosen.n3};`;
  const q4Options = shuffle([q4Chosen.correct, ...q4Chosen.wrong]);

  // Q5: True / False - Μη κοινοί παράγοντες
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στο Ε.Κ.Π. με ανάλυση σε πρώτους παράγοντες παίρνουμε και τους κοινούς ΚΑΙ τους μη κοινούς παράγοντες.'
    : 'Στο Ε.Κ.Π. με ανάλυση σε πρώτους παράγοντες παίρνουμε ΜΟΝΟ τους κοινούς παράγοντες.';

  // Q6: True / False - Επιλογή εκθέτη
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Για τους κοινούς παράγοντες παίρνουμε πάντα εκείνον με τον ΜΕΓΑΛΥΤΕΡΟ εκθέτη.'
    : 'Για τους κοινούς παράγοντες παίρνουμε πάντα εκείνον με τον ΜΙΚΡΟΤΕΡΟ εκθέτη.';

  // Q7: Input - Εύρεση αριθμού που λείπει στο γινόμενο ΕΚΠ
  const q7Items = [
    {
      n1: '18 = 2 × 3²',
      n2: '24 = 2³ × 3',
      missing: '9',
      known: '8 × ',
      target: 72,
      explain: 'Ε.Κ.Π. ＝ 2³ × 3² ＝ 8 × 9 ＝ 72'
    },
    {
      n1: '12 = 2² × 3',
      n2: '20 = 2² × 5',
      missing: '15',
      known: '4 × ',
      target: 60,
      explain: 'Ε.Κ.Π. ＝ 2² × 3 × 5 ＝ 4 × 15 ＝ 60'
    },
    {
      n1: '20 = 2² × 5',
      n2: '50 = 2 × 5²',
      missing: '25',
      known: '4 × ',
      target: 100,
      explain: 'Ε.Κ.Π. ＝ 2² × 5² ＝ 4 × 25 ＝ 100'
    }
  ];
  const q7Chosen = q7Items[getRandomInt(0, q7Items.length - 1)];
  const q7Prompt = `Αν ${q7Chosen.n1} και ${q7Chosen.n2}, τότε Ε.Κ.Π. ＝ ${q7Chosen.known} [ ? ] ＝ ${q7Chosen.target}. Ποιος αριθμός λείπει στο [ ? ];`;
  const q7Correct = q7Chosen.missing;

  // Q8: MCQ - Πρόβλημα Καθημερινότητας (Μεγάλοι Αριθμοί)
  const q8Items = [
    {
      title: 'Δύο εργοστάσια παράγουν εξαρτήματα',
      detail: 'Το Α παράγει κάθε 45 λεπτά (3² × 5) και το Β κάθε 60 λεπτά (2² × 3 × 5).',
      q: 'Μετά από πόσα λεπτά θα ολοκληρώσουν ταυτόχρονα την παραγωγή τους;',
      correct: '180 λεπτά (2² × 3² × 5)',
      wrong: ['120 λεπτά', '60 λεπτά', '240 λεπτά']
    },
    {
      title: 'Δύο δορυφόροι περιστρέφονται γύρω από τη Γη',
      detail: 'Ο πρώτος ολοκληρώνει τροχιά σε 40 ώρες (2³ × 5) και ο δεύτερος σε 50 ώρες (2 × 5²).',
      q: 'Κάθε πόσες ώρες θα ευθυγραμμίζονται ξανά πάνω από το ίδιο σημείο;',
      correct: '200 ώρες (2³ × 5²)',
      wrong: ['100 ώρες', '80 ώρες', '400 ώρες']
    }
  ];
  const q8Chosen = q8Items[getRandomInt(0, q8Items.length - 1)];
  const q8Prompt = `${q8Chosen.title}. ${q8Chosen.detail} ${q8Chosen.q}`;
  const q8Options = shuffle([q8Chosen.correct, ...q8Chosen.wrong]);

  return {
    q1: {
      type: 'mcq',
      title: 'Εφαρμογή Κανόνα Μεγίστων Εκθετών',
      prompt: `Δίνονται οι αναλύσεις: ${q1Chosen.n1} και ${q1Chosen.n2}. Ποιο είναι το σωστό γινόμενο για το Ε.Κ.Π.;`,
      options: q1Options,
      correct: q1Chosen.correct,
      explain: `Παίρνουμε τους κοινούς και μη κοινούς παράγοντες με τον μεγαλύτερο εκθέτη: ${q1Chosen.correct} (＝ ${q1Chosen.val}).`
    },
    q2: {
      type: 'input',
      title: 'Υπολογισμός Ε.Κ.Π. από Δυνάμεις',
      prompt: q2Prompt,
      correct: q2Correct,
      explain: q2Chosen.explain
    },
    q3: {
      type: 'mcq',
      title: 'Επιλογή Δύναμης',
      prompt: q3Prompt,
      options: q3Options,
      correct: q3Chosen.correct,
      explain: `Στο Ε.Κ.Π. επιλέγουμε πάντα τη δύναμη με τον μεγαλύτερο εκθέτη (${q3Chosen.correct}).`
    },
    q4: {
      type: 'mcq',
      title: 'Ε.Κ.Π. Τριών Αριθμών',
      prompt: q4Prompt,
      options: q4Options,
      correct: q4Chosen.correct,
      explain: `Συνδυάζουμε όλους τους πρώτους παράγοντες με τους μεγαλύτερους εκθέτες: ${q4Chosen.correct}.`
    },
    q5: {
      type: 'tf',
      title: 'Κοινοί και Μη Κοινοί Παράγοντες',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Στο Ε.Κ.Π. συμπεριλαμβάνονται ΟΛΟΙ οι πρώτοι παράγοντες (κοινοί και μη κοινοί).'
        : 'Λάθος! Στο Ε.Κ.Π. παίρνουμε και τους μη κοινούς παράγοντες (μόνο στο Μ.Κ.Δ. παίρνουμε αποκλειστικά τους κοινούς).'
    },
    q6: {
      type: 'tf',
      title: 'Κανόνας Εκθετών',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Για κάθε πρώτο παράγοντα επιλέγουμε πάντα τον μεγαλύτερο εκθέτη.'
        : 'Λάθος! Τον μικρότερο εκθέτη τον επιλέγουμε στον Μ.Κ.Δ., όχι στο Ε.Κ.Π.'
    },
    q7: {
      type: 'input',
      title: 'Συμπλήρωση Παράγοντα',
      prompt: q7Prompt,
      correct: q7Correct,
      explain: q7Chosen.explain
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: q8Prompt,
      options: q8Options,
      correct: q8Chosen.correct,
      explain: `Υπολογίζουμε το Ε.Κ.Π. επιλέγοντας τους πρώτους παράγοντες με τους μέγιστους εκθέτες: ${q8Chosen.correct}.`
    }
  };
}

export default function EkpProtoiExercisesPage() {
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
    <Layout
      title="🎯 Ασκήσεις: Ε.Κ.Π. με Πρώτους Παράγοντες - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στο Ε.Κ.Π. με ανάλυση σε γινόμενο πρώτων παραγόντων για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/20-ekp-protoi" 
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
                Διαδραστικές Ασκήσεις: Ε.Κ.Π. με Πρώτους Παράγοντες
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα εύρεσης Ε.Κ.Π. χρησιμοποιώντας αναλύσεις σε γινόμενα πρώτων παραγόντων!
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
                  Άσκηση 1 • Επιλογή Γινομένου
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
                    className={`p-3 rounded-xl text-xs sm:text-sm font-mono font-bold border text-center transition ${
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
                  Άσκηση 2 • Υπολογισμός Ε.Κ.Π.
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
                  placeholder="Γράψε την τιμή του Ε.Κ.Π...."
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
                  Άσκηση 3 • Επιλογή Δύναμης
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
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q4')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                  Άσκηση 4 • Ε.Κ.Π. 3 Αριθμών
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
                  Άσκηση 5 • Σωστό ή Λάθος (Μη Κοινοί)
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
                  Άσκηση 6 • Σωστό ή Λάθος (Εκθέτες)
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
                  Άσκηση 7 • Συμπλήρωση Παράγοντα
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
                  placeholder="Γράψε τον αριθμό που λείπει..."
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

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
  // Q1: Interactive Yes/No Buttons - Έλεγχος αν ένας αριθμός είναι πολλαπλάσιο άλλου
  const q1Base = [4, 6, 7, 8, 9, 12, 15][getRandomInt(0, 6)];
  const q1IsMult = Math.random() > 0.5;
  const q1Multiplier = getRandomInt(4, 12);
  const q1Num = q1IsMult ? q1Base * q1Multiplier : q1Base * q1Multiplier + getRandomInt(1, q1Base - 1);
  const q1Correct = q1Num % q1Base === 0 ? 'Ναι' : 'Όχι';
  const q1Prompt = `Είναι ο αριθμός ${q1Num} πολλαπλάσιο του ${q1Base};`;

  // Q2: Input - Εύρεση επόμενου πολλαπλασίου
  const q2Base = [6, 7, 8, 9, 12, 15, 25][getRandomInt(0, 6)];
  const q2K = getRandomInt(3, 8);
  const q2Given = q2Base * q2K;
  const q2Next = q2Base * (q2K + 1);
  const q2Prompt = `Ποιο είναι το αμέσως επόμενο πολλαπλάσιο του ${q2Base} μετά το ${q2Given};`;
  const q2Correct = String(q2Next);

  // Q3: MCQ - Επιλογή πολλαπλασίου ανάμεσα σε μη πολλαπλάσια
  const q3Base = [6, 7, 8, 9, 12, 15][getRandomInt(0, 5)];
  const q3Valid = q3Base * getRandomInt(5, 14);
  const q3Invalid1 = q3Valid + 2;
  const q3Invalid2 = q3Valid - 3;
  const q3Invalid3 = q3Valid + (q3Base === 6 ? 1 : 4);
  const q3Options = shuffle([
    String(q3Valid),
    String(q3Invalid1),
    String(q3Invalid2),
    String(q3Invalid3)
  ]);

  // Q4: MCQ - Εύρεση του κοινού πολλαπλασίου
  const q4Pair = [
    { a: 3, b: 4, correct: 24, wrong: [15, 16, 20] },
    { a: 4, b: 6, correct: 36, wrong: [16, 20, 30] },
    { a: 5, b: 6, correct: 60, wrong: [25, 40, 50] },
    { a: 6, b: 8, correct: 48, wrong: [30, 40, 54] },
    { a: 4, b: 10, correct: 40, wrong: [25, 30, 50] }
  ][getRandomInt(0, 4)];
  const q4Options = shuffle([
    String(q4Pair.correct),
    ...q4Pair.wrong.map(String)
  ]);

  // Q5: True / False - Ιδιότητα του 0
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Το 0 είναι πολλαπλάσιο κάθε φυσικού αριθμού.'
    : 'Το 0 δεν είναι πολλαπλάσιο κανενός αριθμού.';

  // Q6: True / False - Πλήθος πολλαπλασίων
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Κάθε φυσικός αριθμός (εκτός από το 0) έχει άπειρα πολλαπλάσια.'
    : 'Κάθε φυσικός αριθμός έχει το πολύ 100 πολλαπλάσια.';

  // Q7: Input - Υπολογισμός 8ου πολλαπλασίου (μη μηδενικού)
  const q7Base = [12, 15, 20, 25, 30, 50][getRandomInt(0, 5)];
  const q7MultIndex = getRandomInt(4, 9);
  const q7Correct = String(q7Base * q7MultIndex);

  // Q8: MCQ - Πρόβλημα Καθημερινότητας (Ρυθμός / Κουτιά)
  const q8Items = [
    { name: 'τετράδια', box: 6, count: 48, correct: 'Ναι (ακριβώς 8 κουτιά)', wrong: ['Όχι, περισσεύουν 2', 'Όχι, λείπουν 3', 'Ναι (ακριβώς 9 κουτιά)'] },
    { name: 'στυλό', box: 8, count: 56, correct: 'Ναι (ακριβώς 7 κουτιά)', wrong: ['Όχι, περισσεύει 1', 'Όχι, λείπουν 2', 'Ναι (ακριβώς 8 κουτιά)'] },
    { name: 'μαρκαδόρους', box: 12, count: 72, correct: 'Ναι (ακριβώς 6 κουτιά)', wrong: ['Όχι, περισσεύουν 4', 'Όχι, λείπουν 2', 'Ναι (ακριβώς 7 κουτιά)'] },
    { name: 'σοκολάτες', box: 15, count: 90, correct: 'Ναι (ακριβώς 6 κουτιά)', wrong: ['Όχι, περισσεύουν 5', 'Όχι, λείπουν 5', 'Ναι (ακριβώς 7 κουτιά)'] }
  ];
  const q8Chosen = q8Items[getRandomInt(0, q8Items.length - 1)];
  const q8Options = shuffle([q8Chosen.correct, ...q8Chosen.wrong]);

  return {
    q1: {
      type: 'yesno',
      title: 'Έλεγχος Πολλαπλασίου',
      prompt: q1Prompt,
      number: String(q1Num),
      base: q1Base,
      correct: q1Correct,
      explain: q1Num % q1Base === 0
        ? `Σωστά! ${q1Num} : ${q1Base} ＝ ${q1Num / q1Base}, επομένως το ${q1Num} είναι πολλαπλάσιο του ${q1Base}.`
        : `Το ${q1Num} δεν διαιρείται ακριβώς με το ${q1Base} (${q1Num} : ${q1Base} ＝ ${Math.floor(q1Num / q1Base)} με υπόλοιπο ${q1Num % q1Base}), άρα ΔΕΝ είναι πολλαπλάσιο.`
    },
    q2: {
      type: 'input',
      title: 'Επόμενο Πολλαπλάσιο',
      prompt: q2Prompt,
      correct: q2Correct,
      explain: `Προσθέτουμε το ${q2Base} στο ${q2Given}: ${q2Given} ＋ ${q2Base} ＝ ${q2Next} (${q2Base} × ${q2K + 1}).`
    },
    q3: {
      type: 'mcq',
      title: 'Αναγνώριση Πολλαπλασίου',
      prompt: `Ποιος από τους παρακάτω αριθμούς είναι πολλαπλάσιο του ${q3Base};`,
      options: q3Options,
      correct: String(q3Valid),
      explain: `Ο αριθμός ${q3Valid} διαιρείται ακριβώς με το ${q3Base} (${q3Base} × ${q3Valid / q3Base} ＝ ${q3Valid}).`
    },
    q4: {
      type: 'mcq',
      title: 'Κοινό Πολλαπλάσιο',
      prompt: `Ποιος από τους παρακάτω αριθμούς είναι κοινό πολλαπλάσιο του ${q4Pair.a} και του ${q4Pair.b};`,
      options: q4Options,
      correct: String(q4Pair.correct),
      explain: `Το ${q4Pair.correct} διαιρείται ακριβώς και με το ${q4Pair.a} (${q4Pair.correct} : ${q4Pair.a} ＝ ${q4Pair.correct / q4Pair.a}) και με το ${q4Pair.b} (${q4Pair.correct} : ${q4Pair.b} ＝ ${q4Pair.correct / q4Pair.b}).`
    },
    q5: {
      type: 'tf',
      title: 'Ιδιότητα του 0',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Για κάθε αριθμό α ισχύει α × 0 ＝ 0, άρα το 0 είναι πολλαπλάσιο όλων των αριθμών.'
        : 'Το 0 είναι πολλαπλάσιο κάθε αριθμού αφού α × 0 ＝ 0.'
    },
    q6: {
      type: 'tf',
      title: 'Πλήθος Πολλαπλασίων',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Επειδή οι φυσικοί αριθμοί είναι άπειροι, τα πολλαπλάσια ενός αριθμού δεν τελειώνουν ποτέ.'
        : 'Τα πολλαπλάσια κάθε φυσικού αριθμού (εκτός του 0) είναι άπειρα.'
    },
    q7: {
      type: 'input',
      title: 'Υπολογισμός Πολλαπλασίου',
      prompt: `Πόσο κάνει το ${q7MultIndex}ο πολλαπλάσιο του αριθμού ${q7Base} (${q7Base} × ${q7MultIndex});`,
      correct: q7Correct,
      explain: `${q7Base} × ${q7MultIndex} ＝ ${q7Correct}.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: `Ένα βιβλιοπωλείο έχει ${q8Chosen.count} ${q8Chosen.name} και θέλει να τα βάλει σε κουτιά των ${q8Chosen.box}. Μπορούν να συσκευαστούν χωρίς να περισσέψει κανένα;`,
      options: q8Options,
      correct: q8Chosen.correct,
      explain: `Επειδή ${q8Chosen.count} : ${q8Chosen.box} ＝ ${q8Chosen.count / q8Chosen.box}, χωράνε σε ακριβώς ${q8Chosen.count / q8Chosen.box} κουτιά!`
    }
  };
}

export default function PollaplasiaExercisesPage() {
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

    if (q.type === 'yesno') {
      return a === q.correct;
    }
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
      title="🎯 Ασκήσεις: Πολλαπλάσια Αριθμού - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στα πολλαπλάσια φυσικών αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/18-pollaplasia" 
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
                Διαδραστικές Ασκήσεις: Πολλαπλάσια Αριθμού
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα υπολογισμού, αναγνώρισης και ιδιοτήτων των πολλαπλασίων!
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
                  Άσκηση 1 • Έλεγχος Πολλαπλασίου
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-6 leading-relaxed font-medium">
                {questions.q1.prompt}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <button
                  type="button"
                  disabled={submitted}
                  onClick={() => handleInputChange('q1', 'Ναι')}
                  className={`py-3 rounded-xl font-black text-sm border transition ${
                    answers.q1 === 'Ναι'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                  }`}
                >
                  👍 Ναι
                </button>
                <button
                  type="button"
                  disabled={submitted}
                  onClick={() => handleInputChange('q1', 'Όχι')}
                  className={`py-3 rounded-xl font-black text-sm border transition ${
                    answers.q1 === 'Όχι'
                      ? 'bg-rose-600 text-white border-rose-600 shadow'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                  }`}
                >
                  👎 Όχι
                </button>
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
                  Άσκηση 2 • Επόμενο Πολλαπλάσιο
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
                  placeholder="Γράψε τον αριθμό..."
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
                  Άσκηση 3 • Αναγνώριση
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
                  Άσκηση 4 • Κοινό Πολλαπλάσιο
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
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q5')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                  Άσκηση 5 • Σωστό ή Λάθος (Το 0)
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
                  Άσκηση 6 • Σωστό ή Λάθος (Πλήθος)
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
                  Άσκηση 7 • Υπολογισμός Πολλαπλασίου
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
                    className={`w-full p-2.5 rounded-xl text-xs sm:text-sm font-bold border text-center transition ${
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

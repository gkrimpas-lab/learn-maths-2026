import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// Βοηθητικες συναρτησεις
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

// Υπολογισμος πρωτων παραγοντων
function getPrimeFactors(n) {
  if (!n || n < 2) return [];
  let num = n;
  const factors = [];
  let divisor = 2;

  while (num >= 2) {
    if (num % divisor === 0) {
      factors.push(divisor);
      num = num / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}

// Υπολογισμος μορφης δυναμεων (π.χ. [2,2,3,5] => "2² × 3 × 5")
function getPowerRepresentation(factors) {
  if (!factors || factors.length === 0) return '';
  const counts = {};
  factors.forEach(f => {
    counts[f] = (counts[f] || 0) + 1;
  });

  const exponentsUnicode = { 1: '', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶' };

  return Object.keys(counts)
    .map(factor => {
      const count = counts[factor];
      const exponent = count > 1 ? (exponentsUnicode[count] || `^${count}`) : '';
      return `${factor}${exponent}`;
    })
    .join(' × ');
}

// Δημιουργια 8 μοναδικων ερωτησεων
function generateQuestions() {
  // Q1: MCQ - Σωστη παραγοντοποιηση ενος αριθμου σε μορφη δυναμεων
  const q1Pool = [24, 36, 40, 48, 60, 72, 90, 100, 120];
  const q1Num = q1Pool[getRandomInt(0, q1Pool.length - 1)];
  const q1Factors = getPrimeFactors(q1Num);
  const q1Correct = getPowerRepresentation(q1Factors);

  // Δημιουργια λανθασμενων επιλογων
  const q1Wrong1 = q1Factors.join(' × '); // Χωρις εκθετες (απλο γινομενο αν εχει επαναληψεις)
  const q1Wrong2 = getPowerRepresentation(getPrimeFactors(q1Num + 6)) || '2³ × 5';
  const q1Wrong3 = `${q1Factors[0]} × ${q1Num / q1Factors[0]}`; // Οχι πληρης αναλυση
  const q1Options = shuffle(Array.from(new Set([q1Correct, q1Wrong1, q1Wrong2, q1Wrong3])).slice(0, 4));

  // Q2: Input - Μικροτερος πρωτος διαιρετης μιας περιττης συνθετης τιμης
  const q2Pool = [27, 35, 45, 63, 75, 105, 135];
  const q2Num = q2Pool[getRandomInt(0, q2Pool.length - 1)];
  const q2Factors = getPrimeFactors(q2Num);
  const q2Correct = String(q2Factors[0]);

  // Q3: MCQ - Ευρεση αριθμου απο τη μορφη δυναμεων του
  const q3Presets = [
    { expr: '2² × 3 × 5', val: 60 },
    { expr: '2³ × 3²', val: 72 },
    { expr: '2 × 3² × 5', val: 90 },
    { expr: '2² × 5²', val: 100 },
    { expr: '2³ × 3 × 5', val: 120 },
    { expr: '3² × 5²', val: 225 }
  ];
  const q3Chosen = q3Presets[getRandomInt(0, q3Presets.length - 1)];
  const q3CorrectStr = String(q3Chosen.val);
  const q3Options = shuffle([
    q3CorrectStr,
    String(q3Chosen.val - 10),
    String(q3Chosen.val + 12),
    String(q3Chosen.val / 2)
  ]);

  // Q4: MCQ - Ευρεση παραγοντα/εκθετη που λειπει (π.χ. 72 = 2³ × _)
  const q4Presets = [
    { num: 72, known: '2³ × ', missing: '3²', explain: '72 ＝ 8 × 9 ＝ 2³ × 3²' },
    { num: 60, known: '2² × ', missing: '3 × 5', explain: '60 ＝ 4 × 15 ＝ 2² × 3 × 5' },
    { num: 100, known: '2² × ', missing: '5²', explain: '100 ＝ 4 × 25 ＝ 2² × 5²' },
    { num: 120, known: '2³ × ', missing: '3 × 5', explain: '120 ＝ 8 × 15 ＝ 2³ × 3 × 5' },
    { num: 90, known: '2 × ', missing: '3² × 5', explain: '90 ＝ 2 × 45 ＝ 2 × 3² × 5' }
  ];
  const q4Chosen = q4Presets[getRandomInt(0, q4Presets.length - 1)];
  const q4Options = shuffle([
    q4Chosen.missing,
    '3',
    '5',
    '2²'
  ]);

  // Q5: True / False - Μοναδικοτητα παραγοντοποιησης
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Κάθε σύνθετος αριθμός αναλύεται κατά έναν και μοναδικό τρόπο σε γινόμενο πρώτων παραγόντων.'
    : 'Ένας σύνθετος αριθμός μπορεί να έχει πολλές διαφορετικές αναλύσεις σε πρώτους παράγοντες.';

  // Q6: True / False - Κανονας κατακορυφης γραμμης
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Στη μέθοδο των διαδοχικών διαιρέσεων, δεξιά από την κατακόρυφη γραμμή γράφουμε μόνο πρώτους αριθμούς.'
    : 'Στη μέθοδο των διαδοχικών διαιρέσεων, δεξιά από την κατακόρυφη γραμμή μπορούμε να γράψουμε και σύνθετους αριθμούς (π.χ. 4 ή 6).';

  // Q7: Input - Πληθος πρωτων παραγοντων (με επαναληψεις)
  const q7Pool = [18, 24, 30, 36, 40, 48, 60, 72];
  const q7Num = q7Pool[getRandomInt(0, q7Pool.length - 1)];
  const q7Factors = getPrimeFactors(q7Num);
  const q7Correct = String(q7Factors.length);

  // Q8: MCQ - Προβλημα Καθημερινοτητας
  const q8Presets = [
    { num: 36, item: 'κουτάκια', explain: '36 ＝ 2² × 3² (2×2×3×3)' },
    { num: 48, item: 'καραμέλες', explain: '48 ＝ 2⁴ × 3 (2×2×2×2×3)' },
    { num: 60, item: 'βιβλία', explain: '60 ＝ 2² × 3 × 5 (2×2×3×5)' },
    { num: 90, item: 'σοκολάτες', explain: '90 ＝ 2 × 3² × 5 (2×3×3×5)' }
  ];
  const q8Chosen = q8Presets[getRandomInt(0, q8Presets.length - 1)];
  const q8CorrectStr = getPowerRepresentation(getPrimeFactors(q8Chosen.num));
  const q8Wrong1 = `${q8Chosen.num / 2} × 2`;
  const q8Wrong2 = `6 × ${q8Chosen.num / 6}`;
  const q8Wrong3 = `10 × ${q8Chosen.num / 10}`;
  const q8Options = shuffle([q8CorrectStr, q8Wrong1, q8Wrong2, q8Wrong3]);

  return {
    q1: {
      type: 'mcq',
      title: 'Ανάλυση σε Πρώτους Παράγοντες',
      prompt: `Ποια είναι η σωστή παραγοντοποίηση του αριθμού ${q1Num} σε μορφή δυνάμεων;`,
      options: q1Options,
      correct: q1Correct,
      explain: `Η ανάλυση του ${q1Num} είναι: ${q1Factors.join(' × ')} ＝ ${q1Correct}.`
    },
    q2: {
      type: 'input',
      title: 'Μικρότερος Πρώτος Διαιρέτης',
      prompt: `Ποιος είναι ο μικρότερος πρώτος διαιρέτης του αριθμού ${q2Num};`,
      correct: q2Correct,
      explain: `Οι πρώτοι παράγοντες του ${q2Num} είναι: ${q2Factors.join(', ')}. Ο μικρότερος είναι το ${q2Correct}.`
    },
    q3: {
      type: 'mcq',
      title: 'Εύρεση Αριθμού από Δυνάμεις',
      prompt: `Ποιος αριθμός έχει παραγοντοποίηση ${q3Chosen.expr};`,
      options: q3Options,
      correct: q3CorrectStr,
      explain: `Υπολογίζουμε τις δυνάμεις και το γινόμενο: ${q3Chosen.expr} ＝ ${q3Chosen.val}.`
    },
    q4: {
      type: 'mcq',
      title: 'Συμπλήρωση Παράγοντα',
      prompt: `Συμπλήρωσε το κενό: ${q4Chosen.num} ＝ ${q4Chosen.known} [ ? ]`,
      options: q4Options,
      correct: q4Chosen.missing,
      explain: q4Chosen.explain
    },
    q5: {
      type: 'tf',
      title: 'Μοναδικότητα Αναλύσεως',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Η ανάλυση κάθε σύνθετου αριθμού σε γινόμενο πρώτων παραγόντων είναι μοναδική (Θεμελιώδες Θεώρημα Αριθμητικής).'
        : 'Κάθε σύνθετος αριθμός έχει μία και μοναδική παραγοντοποίηση σε πρώτους αριθμούς.'
    },
    q6: {
      type: 'tf',
      title: 'Κανόνας Διαδοχικών Διαιρέσεων',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Δεξιά από τη γραμμή γράφουμε αποκλειστικά πρώτους αριθμούς (2, 3, 5, 7...).'
        : 'Δεν επιτρέπεται να γράψουμε σύνθετους αριθμούς δεξιά από τη γραμμή.'
    },
    q7: {
      type: 'input',
      title: 'Πλήθος Πρώτων Παραγόντων',
      prompt: `Πόσους πρώτους παράγοντες συνολικά (μαζί με τις επαναλήψεις) έχει ο αριθμός ${q7Num};`,
      correct: q7Correct,
      explain: `${q7Num} ＝ ${q7Factors.join(' × ')} (συνολικά ${q7Correct} πρώτοι παράγοντες).`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: `Ένα εργαστήριο συσκευάζει ${q8Chosen.num} ${q8Chosen.item}. Ποια έκφραση αντιπροσωπεύει την πλήρη ανάλυση σε πρώτους παράγοντες;`,
      options: q8Options,
      correct: q8CorrectStr,
      explain: `Η πλήρης ανάλυση του ${q8Chosen.num} σε πρώτους παράγοντες είναι: ${q8Chosen.explain}.`
    }
  };
}

export default function ParagontopoiisiExercisesPage() {
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
      title="🎯 Ασκήσεις: Παραγοντοποίηση Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στην παραγοντοποίηση αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/17-paragontopoiisi" 
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
                Διαδραστικές Ασκήσεις: Παραγοντοποίηση Αριθμών
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα ανάλυσης σύνθετων αριθμών σε πρώτους παράγοντες!
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
                  Άσκηση 1 • Ανάλυση σε Πρώτους
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
                  Άσκηση 2 • Μικρότερος Πρώτος Διαιρέτης
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
                  placeholder="Γράψε τον πρώτο διαιρέτη..."
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
                  Άσκηση 3 • Υπολογισμός Αριθμού
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
                  Άσκηση 4 • Συμπλήρωση Παράγοντα
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
                  Άσκηση 7 • Πλήθος Παραγόντων
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
                  placeholder="Γράψε το πλήθος των παραγόντων..."
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

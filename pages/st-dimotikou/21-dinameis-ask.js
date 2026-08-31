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

const exponentsUnicode = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', 10: '¹⁰' };

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  // Q1: MCQ - Μετατροπή γινομένου ίσων παραγόντων σε δύναμη
  const q1Pool = [
    { base: 3, count: 4, expr: '3 × 3 × 3 × 3', correct: '3⁴', wrong: ['3 × 4', '4³', '3⁵'] },
    { base: 5, count: 3, expr: '5 × 5 × 5', correct: '5³', wrong: ['5 × 3', '3⁵', '5⁴'] },
    { base: 2, count: 5, expr: '2 × 2 × 2 × 2 × 2', correct: '2⁵', wrong: ['2 × 5', '5²', '2⁶'] },
    { base: 7, count: 2, expr: '7 × 7', correct: '7²', wrong: ['7 × 2', '2⁷', '7³'] },
    { base: 4, count: 3, expr: '4 × 4 × 4', correct: '4³', wrong: ['4 × 3', '3⁴', '4⁴'] }
  ];
  const q1Chosen = q1Pool[getRandomInt(0, q1Pool.length - 1)];
  const q1Options = shuffle([q1Chosen.correct, ...q1Chosen.wrong]);

  // Q2: Input - Υπολογισμός τετραγώνου ή κύβου απλού αριθμού
  const q2Pool = [
    { base: 4, exp: 2, val: 16, explain: '4² ＝ 4 × 4 ＝ 16' },
    { base: 6, exp: 2, val: 36, explain: '6² ＝ 6 × 6 ＝ 36' },
    { base: 7, exp: 2, val: 49, explain: '7² ＝ 7 × 7 ＝ 49' },
    { base: 8, exp: 2, val: 64, explain: '8² ＝ 8 × 8 ＝ 64' },
    { base: 9, exp: 2, val: 81, explain: '9² ＝ 9 × 9 ＝ 81' },
    { base: 2, exp: 3, val: 8, explain: '2³ ＝ 2 × 2 × 2 ＝ 8' },
    { base: 3, exp: 3, val: 27, explain: '3³ ＝ 3 × 3 × 3 ＝ 27' },
    { base: 4, exp: 3, val: 64, explain: '4³ ＝ 4 × 4 × 4 ＝ 64' },
    { base: 5, exp: 3, val: 125, explain: '5³ ＝ 5 × 5 × 5 ＝ 125' }
  ];
  const q2Chosen = q2Pool[getRandomInt(0, q2Pool.length - 1)];
  const q2Prompt = `Ποια είναι η τιμή της δύναμης ${q2Chosen.base}${exponentsUnicode[q2Chosen.exp]};`;
  const q2Correct = String(q2Chosen.val);

  // Q3: MCQ - Αναγνώριση Βάσης και Εκθέτη
  const q3Pool = [
    { base: 8, exp: 5, qType: 'base', prompt: 'Στη δύναμη 8⁵, ποια είναι η βάση;', correct: '8', wrong: ['5', '40', '13'] },
    { base: 6, exp: 4, qType: 'exp', prompt: 'Στη δύναμη 6⁴, ποιος είναι ο εκθέτης;', correct: '4', wrong: ['6', '24', '10'] },
    { base: 9, exp: 3, qType: 'exp', prompt: 'Στη δύναμη 9³, ποιος είναι ο εκθέτης;', correct: '3', wrong: ['9', '27', '12'] },
    { base: 7, exp: 6, qType: 'base', prompt: 'Στη δύναμη 7⁶, ποια είναι η βάση;', correct: '7', wrong: ['6', '42', '13'] }
  ];
  const q3Chosen = q3Pool[getRandomInt(0, q3Pool.length - 1)];
  const q3Options = shuffle([q3Chosen.correct, ...q3Chosen.wrong]);

  // Q4: MCQ - Ειδικές περιπτώσεις (εκθέτης 0 και 1)
  const q4Pool = [
    { base: 15, exp: 0, val: 1, explain: 'Κάθε μη μηδενικός αριθμός στη μηδενική δύναμη ισούται με 1 (15⁰ ＝ 1).' },
    { base: 28, exp: 1, val: 28, explain: 'Κάθε αριθμός στην 1η δύναμη ισούται με τον εαυτό του (28¹ ＝ 28).' },
    { base: 100, exp: 0, val: 1, explain: 'Κάθε μη μηδενικός αριθμός στη μηδενική δύναμη ισούται με 1 (100⁰ ＝ 1).' },
    { base: 54, exp: 1, val: 54, explain: 'Κάθε αριθμός στην 1η δύναμη ισούται με τον εαυτό του (54¹ ＝ 54).' }
  ];
  const q4Chosen = q4Pool[getRandomInt(0, q4Pool.length - 1)];
  const q4Prompt = `Πόσο κάνει ${q4Chosen.base}${exponentsUnicode[q4Chosen.exp]};`;
  const q4Correct = String(q4Chosen.val);
  const q4Options = shuffle(Array.from(new Set([
    q4Correct,
    '0',
    String(q4Chosen.base),
    String(q4Chosen.base + 1),
    '1'
  ])).slice(0, 4));

  // Q5: True / False - Συχνό λάθος (α^ν != α * ν)
  const q5Base = [2, 3, 4, 5][getRandomInt(0, 3)];
  const q5Exp = [3, 4][getRandomInt(0, 1)];
  const q5Product = q5Base * q5Exp;
  const q5Actual = Math.pow(q5Base, q5Exp);
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? `Η δύναμη ${q5Base}${exponentsUnicode[q5Exp]} ισούται με ${q5Actual} (δηλαδή ${Array(q5Exp).fill(q5Base).join(' × ')}).`
    : `Η δύναμη ${q5Base}${exponentsUnicode[q5Exp]} ισούται με ${q5Product} (δηλαδή ${q5Base} × ${q5Exp}).`;

  // Q6: True / False - Ορισμός Βάσης & Εκθέτη
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Σε μία δύναμη, ο εκθέτης δείχνει πόσες φορές πολλαπλασιάζεται η βάση με τον εαυτό της.'
    : 'Σε μία δύναμη, ο εκθέτης πολλαπλασιάζεται απλώς με τη βάση μία φορά.';

  // Q7: Input - Σύγκριση / Υπολογισμός δύναμης με βάση το 2 ή το 10
  const q7Pool = [
    { base: 2, exp: 4, val: 16, explain: '2⁴ ＝ 2 × 2 × 2 × 2 ＝ 16' },
    { base: 2, exp: 5, val: 32, explain: '2⁵ ＝ 2 × 2 × 2 × 2 × 2 ＝ 32' },
    { base: 10, exp: 2, val: 100, explain: '10² ＝ 10 × 10 ＝ 100' },
    { base: 10, exp: 3, val: 1000, explain: '10³ ＝ 10 × 10 × 10 ＝ 1.000' },
    { base: 10, exp: 4, val: 10000, explain: '10⁴ ＝ 10.000 (το 1 ακολουθούμενο από 4 μηδενικά)' }
  ];
  const q7Chosen = q7Pool[getRandomInt(0, q7Pool.length - 1)];
  const q7Prompt = `Υπολόγισε την τιμή της δύναμης ${q7Chosen.base}${exponentsUnicode[q7Chosen.exp]}:`;
  const q7Correct = String(q7Chosen.val);

  // Q8: MCQ - Πρόβλημα Καθημερινότητας / Γεωμετρίας (Εμβαδόν ή Όγκος)
  const q8Pool = [
    {
      q: 'Ένα τετράγωνο παρτέρι έχει πλευρά 6 μέτρα. Ποια δύναμη εκφράζει το εμβαδόν του και ποιο είναι το αποτέλεσμα;',
      correct: '6² ＝ 36 τ.μ.',
      wrong: ['6 × 2 ＝ 12 τ.μ.', '2⁶ ＝ 64 τ.μ.', '6³ ＝ 216 τ.μ.']
    },
    {
      q: 'Ένα κυβικό κουτί έχει ακμή 3 μέτρα. Ποια δύναμη εκφράζει τον όγκο του και ποιο είναι το αποτέλεσμα;',
      correct: '3³ ＝ 27 κ.μ.',
      wrong: ['3 × 3 ＝ 9 κ.μ.', '3² ＝ 9 κ.μ.', '3 × 4 ＝ 12 κ.μ.']
    },
    {
      q: 'Μία αποθήκη σε σχήμα κύβου έχει ακμή 5 μέτρα. Ποιος είναι ο όγκος της σε κυβικά μέτρα;',
      correct: '5³ ＝ 125 κ.μ.',
      wrong: ['5 × 3 ＝ 15 κ.μ.', '5² ＝ 25 κ.μ.', '3⁵ ＝ 243 κ.μ.']
    },
    {
      q: 'Μία ψηφιδωτή επιφάνεια σε σχήμα τετραγώνου έχει 8 σειρές με 8 ψηφίδες η καθεμία. Πόσες είναι όλες οι ψηφίδες;',
      correct: '8² ＝ 64 ψηφίδες',
      wrong: ['8 × 2 ＝ 16 ψηφίδες', '2⁸ ＝ 256 ψηφίδες', '8³ ＝ 512 ψηφίδες']
    }
  ];
  const q8Chosen = q8Pool[getRandomInt(0, q8Pool.length - 1)];
  const q8Options = shuffle([q8Chosen.correct, ...q8Chosen.wrong]);

  return {
    q1: {
      type: 'mcq',
      title: 'Γραφή ως Δύναμη',
      prompt: `Πώς γράφεται σύντομα με τη μορφή δύναμης το γινόμενο: ${q1Chosen.expr};`,
      options: q1Options,
      correct: q1Chosen.correct,
      explain: `Επειδή ο παράγοντας ${q1Chosen.base} πολλαπλασιάζεται ${q1Chosen.count} φορές με τον εαυτό του, γράφεται ${q1Chosen.correct}.`
    },
    q2: {
      type: 'input',
      title: 'Υπολογισμός Τιμής',
      prompt: q2Prompt,
      correct: q2Correct,
      explain: q2Chosen.explain
    },
    q3: {
      type: 'mcq',
      title: 'Βάση & Εκθέτης',
      prompt: q3Chosen.prompt,
      options: q3Options,
      correct: q3Chosen.correct,
      explain: q3Chosen.qType === 'base'
        ? `Η βάση είναι ο αριθμός που βρίσκεται κάτω και πολλαπλασιάζεται (${q3Chosen.correct}).`
        : `Ο εκθέτης είναι ο μικρός αριθμός πάνω δεξιά που δείχνει το πλήθος των παραγόντων (${q3Chosen.correct}).`
    },
    q4: {
      type: 'mcq',
      title: 'Ειδικές Περιπτώσεις (0 & 1)',
      prompt: q4Prompt,
      options: q4Options,
      correct: q4Correct,
      explain: q4Chosen.explain
    },
    q5: {
      type: 'tf',
      title: 'Σωστό ή Λάθος (Δύναμη vs Πολλαπλασιασμός)',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? `Σωστά! ${q5Base}${exponentsUnicode[q5Exp]} σημαίνει ${Array(q5Exp).fill(q5Base).join(' × ')} ＝ ${q5Actual}.`
        : `Λάθος! Η δύναμη ${q5Base}${exponentsUnicode[q5Exp]} ΔΕΝ είναι ${q5Base} × ${q5Exp} ＝ ${q5Product}, αλλά ${Array(q5Exp).fill(q5Base).join(' × ')} ＝ ${q5Actual}!`
    },
    q6: {
      type: 'tf',
      title: 'Σωστό ή Λάθος (Έννοια Εκθέτη)',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Ο εκθέτης ορίζει πόσες φορές θα γραφτεί η βάση ως παράγοντας γινομένου.'
        : 'Λάθος! Ο εκθέτης δεν είναι απλός πολλαπλασιαστής, αλλά δείχνει το πλήθος των ίσων παραγόντων.'
    },
    q7: {
      type: 'input',
      title: 'Υπολογισμός Δυνάμεων',
      prompt: q7Prompt,
      correct: q7Correct,
      explain: q7Chosen.explain
    },
    q8: {
      type: 'mcq',
      title: 'Γεωμετρικό Πρόβλημα',
      prompt: q8Chosen.q,
      options: q8Options,
      correct: q8Chosen.correct,
      explain: `Εφαρμόζουμε τον τύπο της αντίστοιχης δύναμης: ${q8Chosen.correct}.`
    }
  };
}

export default function DinameisExercisesPage() {
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
      const cleanAns = a.replace(/\s+/g, '').replace(/\./g, '').trim();
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
      title="🎯 Ασκήσεις: Δυνάμεις Φυσικών Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στις δυνάμεις φυσικών αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/21-dinameis" 
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
                Διαδραστικές Ασκήσεις: Δυνάμεις Φυσικών Αριθμών
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα υπολογισμού δυνάμεων, βάσεων, εκθετών, τετραγώνων και κύβων!
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
                  Άσκηση 1 • Γραφή ως Δύναμη
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
                  Άσκηση 2 • Υπολογισμός Τιμής
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
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q3')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                  Άσκηση 3 • Βάση & Εκθέτης
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
                  Άσκηση 4 • Εκθέτες 0 και 1
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
                  Άσκηση 5 • Σωστό ή Λάθος (Δύναμη vs Πολλαπλασιασμός)
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
                  Άσκηση 6 • Σωστό ή Λάθος (Έννοια Εκθέτη)
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
                  Άσκηση 7 • Υπολογισμός Δυνάμεων (Βάση 2 & 10)
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
                  placeholder="Γράψε τον αριθμό..."
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
                  Άσκηση 8 • Γεωμετρικό Πρόβλημα
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

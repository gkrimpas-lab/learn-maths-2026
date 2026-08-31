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

// Θεματικά σενάρια καθημερινότητας & επιστήμης
const REAL_WORLD_CONTEXTS = [
  { item: 'αστέρια στον γαλαξία', exp: 9, unit: 'δισεκατομμύριο', pronoun: 'τα' },
  { item: 'κύτταρα στο σώμα', exp: 6, unit: 'εκατομμύριο', pronoun: 'τα' },
  { item: 'ευρώ στον προϋπολογισμό', exp: 6, unit: 'εκατομμύριο', pronoun: 'τα' },
  { item: 'σταγόνες νερού σε δεξαμενή', exp: 4, unit: 'χιλιάδες', pronoun: 'τις' },
  { item: 'κόκκοι άμμου', exp: 5, unit: 'χιλιάδες', pronoun: 'τους' }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledContexts = shuffle(REAL_WORLD_CONTEXTS);

  // Q1: Input - Υπολογισμός δύναμης του 10 (π.χ. 10^3, 10^4, 10^5)
  const q1Exp = getRandomInt(2, 6);
  const q1Val = Math.pow(10, q1Exp);
  const q1Correct = String(q1Val);

  // Q2: Input - Πλήθος μηδενικών σε μια δύναμη του 10
  const q2Exp = getRandomInt(3, 8);
  const q2Correct = String(q2Exp);

  // Q3: MCQ - Σύντομη γραφή μεγάλου αριθμού σε δύναμη του 10
  const q3Exp = getRandomInt(3, 7);
  const q3Val = Math.pow(10, q3Exp);
  const q3CorrectStr = `10${exponentsUnicode[q3Exp]}`;
  const q3Wrongs = [
    `10${exponentsUnicode[q3Exp - 1]}`,
    `10${exponentsUnicode[q3Exp + 1]}`,
    `10${exponentsUnicode[q3Exp + 2]}`
  ];
  const q3Options = shuffle([q3CorrectStr, ...q3Wrongs]);

  // Q4: MCQ - Εύρεση του αριθμού από ανάπτυγμα με δύναμη του 10 (π.χ. 7 × 10^4 = 70.000)
  const q4Digit = getRandomInt(2, 9);
  const q4Exp = getRandomInt(2, 5);
  const q4Result = q4Digit * Math.pow(10, q4Exp);
  const q4CorrectStr = q4Result.toLocaleString('el-GR');
  const q4Wrongs = [
    (q4Digit * Math.pow(10, q4Exp - 1)).toLocaleString('el-GR'),
    (q4Digit * Math.pow(10, q4Exp + 1)).toLocaleString('el-GR'),
    (q4Digit * 10 + q4Exp).toLocaleString('el-GR')
  ];
  const q4Options = shuffle([q4CorrectStr, ...q4Wrongs]);

  // Q5: True / False - Η ειδική περίπτωση 10^0 = 1
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Η δύναμη 10⁰ ισούται με 1.'
    : 'Η δύναμη 10⁰ ισούται με 0.';

  // Q6: True / False - Κανόνας για τα μηδενικά
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Σε μια δύναμη του 10, ο εκθέτης δείχνει πόσα μηδενικά ακολουθούν μετά το 1.'
    : 'Σε μια δύναμη του 10, ο εκθέτης δείχνει με πόσα μηδενικά πολλαπλασιάζουμε το 10.';

  // Q7: Input - Εύρεση εκθέτη: 10^x = 1.000.000
  const q7Exp = [2, 3, 4, 5, 6, 7][getRandomInt(0, 5)];
  const q7Val = Math.pow(10, q7Exp);
  const q7Correct = String(q7Exp);

  // Q8: MCQ - Πρόβλημα Καθημερινότητας / Επιστήμης
  const ctx = shuffledContexts[0];
  const q8Coeff = getRandomInt(2, 8);
  const q8Total = q8Coeff * Math.pow(10, ctx.exp);
  const q8CorrectStr = `${q8Coeff} × 10${exponentsUnicode[ctx.exp]}`;
  const q8Wrongs = [
    `${q8Coeff} × 10${exponentsUnicode[ctx.exp - 1]}`,
    `${q8Coeff} × 10${exponentsUnicode[ctx.exp + 1]}`,
    `${q8Coeff * 10}${exponentsUnicode[ctx.exp]}`
  ];
  const q8Options = shuffle([q8CorrectStr, ...q8Wrongs]);

  return {
    q1: {
      type: 'input',
      title: 'Υπολογισμός Δύναμης',
      exp: q1Exp,
      correct: q1Correct,
      explain: `10${exponentsUnicode[q1Exp]} ＝ 1 ακολουθούμενο από ${q1Exp} μηδενικά ＝ ${q1Val.toLocaleString('el-GR')}.`
    },
    q2: {
      type: 'input',
      title: 'Πλήθος Μηδενικών',
      exp: q2Exp,
      correct: q2Correct,
      explain: `Στη δύναμη 10${exponentsUnicode[q2Exp]}, ο εκθέτης είναι το ${q2Exp}, άρα το 1 ακολουθείται από ${q2Exp} μηδενικά.`
    },
    q3: {
      type: 'mcq',
      title: 'Σύντομη Μορφή Δύναμης',
      prompt: `Πώς γράφεται ο αριθμός ${q3Val.toLocaleString('el-GR')} ως δύναμη με βάση το 10;`,
      options: q3Options,
      correct: q3CorrectStr,
      explain: `Ο αριθμός ${q3Val.toLocaleString('el-GR')} έχει ${q3Exp} μηδενικά, άρα γράφεται 10${exponentsUnicode[q3Exp]}.`
    },
    q4: {
      type: 'mcq',
      title: 'Ανάπτυγμα με Δυνάμεις του 10',
      prompt: `Ποια είναι η τιμή της παράστασης ${q4Digit} × 10${exponentsUnicode[q4Exp]};`,
      options: q4Options,
      correct: q4CorrectStr,
      explain: `10${exponentsUnicode[q4Exp]} ＝ ${Math.pow(10, q4Exp).toLocaleString('el-GR')}. Επομένως, ${q4Digit} × ${Math.pow(10, q4Exp).toLocaleString('el-GR')} ＝ ${q4Result.toLocaleString('el-GR')}.`
    },
    q5: {
      type: 'tf',
      title: 'Η Δύναμη 10⁰',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Κάθε μη μηδενικός αριθμός στον εκθέτη 0 ισούται με 1 (10⁰ ＝ 1).'
        : 'Λάθος! 10⁰ ＝ 1 (το 1 χωρίς κανένα μηδενικό, όχι 0).'
    },
    q6: {
      type: 'tf',
      title: 'Κανόνας Εκθέτη',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Ο εκθέτης στις δυνάμεις του 10 ισούται ακριβώς με το πλήθος των μηδενικών.'
        : 'Λάθος! Ο εκθέτης δείχνει το πλήθος των μηδενικών μετά το 1.'
    },
    q7: {
      type: 'input',
      title: 'Εύρεση Εκθέτη',
      val: q7Val.toLocaleString('el-GR'),
      correct: q7Correct,
      explain: `Ο αριθμός ${q7Val.toLocaleString('el-GR')} έχει ${q7Exp} μηδενικά, επομένως 10${exponentsUnicode[q7Exp]} ＝ ${q7Val.toLocaleString('el-GR')} (εκθέτης: ${q7Exp}).`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: `Σε ένα επιστημονικό πείραμα καταγράφηκαν ${q8Total.toLocaleString('el-GR')} ${ctx.item}. Πώς γράφεται σύντομα αυτό το πλήθος με δύναμη του 10;`,
      options: q8Options,
      correct: q8CorrectStr,
      explain: `${q8Total.toLocaleString('el-GR')} ＝ ${q8Coeff} × ${Math.pow(10, ctx.exp).toLocaleString('el-GR')} ＝ ${q8Coeff} × 10${exponentsUnicode[ctx.exp]}.`
    }
  };
}

export default function DinameisDekaExercisesPage() {
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
      const cleanAns = a.replace(/\./g, '').replace(/\s+/g, '').trim();
      const cleanCorrect = q.correct.replace(/\./g, '').replace(/\s+/g, '').trim();
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
      title="🎯 Ασκήσεις: Οι Δυνάμεις του 10 - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στις δυνάμεις του 10 και τη σύντομη γραφή μεγάλων αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/22-dinameis-deka" 
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
                Διαδραστικές Ασκήσεις: Οι Δυνάμεις του 10
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα υπολογισμού δυνάμεων του 10, καταμέτρησης μηδενικών και σύντομης γραφής μεγάλων αριθμών!
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
                  Άσκηση 1 • Υπολογισμός Δύναμης
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                Ποια είναι η αριθμητική τιμή της δύναμης <strong className="text-blue-700 font-mono text-base">10{exponentsUnicode[questions.q1.exp]}</strong>;
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q1}
                  onChange={(e) => handleInputChange('q1', e.target.value)}
                  placeholder="π.χ. 1000"
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
                  Άσκηση 2 • Πλήθος Μηδενικών
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                Πόσα μηδενικά ακολουθούν μετά το 1 όταν αναπτύξουμε τη δύναμη <strong className="text-indigo-700 font-mono text-base">10{exponentsUnicode[questions.q2.exp]}</strong>;
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q2}
                  onChange={(e) => handleInputChange('q2', e.target.value)}
                  placeholder="Γράψε το πλήθος των μηδενικών..."
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
                  Άσκηση 3 • Σύντομη Γραφή Δύναμης
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
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q4')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                  Άσκηση 4 • Ανάπτυγμα με Δύναμη
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
                    className={`w-full p-2.5 rounded-xl text-xs font-mono font-bold border text-center transition ${
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
                  Άσκηση 7 • Εύρεση Εκθέτη
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 font-medium">
                Ποιος είναι ο εκθέτης <strong className="text-rose-700 font-mono text-base">x</strong> στην ισότητα <strong className="text-blue-700 font-mono text-base">10<sup>x</sup> ＝ {questions.q7.val}</strong>;
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q7}
                  onChange={(e) => handleInputChange('q7', e.target.value)}
                  placeholder="Γράψε τον εκθέτη x..."
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
                  Άσκηση 8 • Πρόβλημα & Επιστήμη
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
                    className={`w-full p-2.5 rounded-xl text-xs font-mono font-bold border text-center transition ${
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

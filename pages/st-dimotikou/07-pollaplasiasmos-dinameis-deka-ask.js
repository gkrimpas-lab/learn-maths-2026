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

// Δεξαμενή θεματικών αντικειμένων καθημερινότητας
const REAL_WORLD_ITEMS = [
  { item: 'τετράδια για το σχολείο', price: 2.45, unit: '€' },
  { item: 'μπουκάλια νερό', price: 0.50, unit: '€' },
  { item: 'στυλό διαρκείας', price: 1.20, unit: '€' },
  { item: 'πακέτα χαρτί A4', price: 4.85, unit: '€' },
  { item: 'μέτρα ύφασμα', price: 8.50, unit: '€' },
  { item: 'σάντουιτς για το κυλικείο', price: 2.30, unit: '€' },
  { item: 'εισιτήρια λεωφορείου', price: 1.10, unit: '€' },
  { item: 'βιβλία μαθηματικών', price: 9.75, unit: '€' }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledItems = shuffle(REAL_WORLD_ITEMS);

  // Q1: Input - Πολλαπλασιασμός με 10, 100, 1000
  const q1Int = getRandomInt(3, 85);
  const q1Dec = getRandomInt(1, 9) * 10 + getRandomInt(1, 9); // π.χ. 45 -> 3,45
  const q1Mult = [10, 100, 1000][getRandomInt(0, 2)];
  const q1Val = parseFloat(`${q1Int}.${q1Dec}`);
  const q1RawAns = q1Val * q1Mult;
  const q1Correct = q1RawAns.toString().replace('.', ',');
  const q1Prompt = `${q1Int},${q1Dec} × ${q1Mult}`;

  // Q2: Input - Πολλαπλασιασμός με 0,1, 0,01, 0,001
  const q2Int = getRandomInt(12, 95);
  const q2Dec = getRandomInt(1, 9); // π.χ. 4 -> 12,4
  const q2Mult = [0.1, 0.01, 0.001][getRandomInt(0, 2)];
  const q2Val = parseFloat(`${q2Int}.${q2Dec}`);
  const q2RawAns = parseFloat((q2Val * q2Mult).toFixed(4));
  const q2Correct = q2RawAns.toString().replace('.', ',');
  const q2MultStr = q2Mult.toString().replace('.', ',');
  const q2Prompt = `${q2Int},${q2Dec} × ${q2MultStr}`;

  // Q3: MCQ - Εύρεση του πολλαπλασιαστή που λείπει (π.χ. 4,25 × ? = 425)
  const q3Int = getRandomInt(2, 65);
  const q3Dec = getRandomInt(1, 9) * 10 + getRandomInt(1, 9);
  const q3ValStr = `${q3Int},${q3Dec}`;
  const q3MultType = getRandomInt(1, 4); // 1: x10, 2: x100, 3: x1000, 4: x0.1
  let q3CorrectMult = "100";
  let q3ResultStr = "";

  if (q3MultType === 1) {
    q3CorrectMult = "10";
    q3ResultStr = (parseFloat(`${q3Int}.${q3Dec}`) * 10).toString().replace('.', ',');
  } else if (q3MultType === 2) {
    q3CorrectMult = "100";
    q3ResultStr = (parseFloat(`${q3Int}.${q3Dec}`) * 100).toString().replace('.', ',');
  } else if (q3MultType === 3) {
    q3CorrectMult = "1000";
    q3ResultStr = (parseFloat(`${q3Int}.${q3Dec}`) * 1000).toString().replace('.', ',');
  } else {
    q3CorrectMult = "0,1";
    q3ResultStr = (parseFloat(`${q3Int}.${q3Dec}`) * 0.1).toFixed(3).replace(/\.?0+$/, '').replace('.', ',');
  }
  const q3Options = shuffle(["10", "100", "1000", "0,1", "0,01"].filter(m => m !== q3CorrectMult).slice(0, 3).concat(q3CorrectMult));

  // Q4: MCQ - Πρόβλημα Καθημερινότητας (π.χ. 100 τεμάχια)
  const q4Item = shuffledItems[0];
  const q4Count = [10, 100, 1000][getRandomInt(0, 2)];
  const q4Cost = parseFloat((q4Item.price * q4Count).toFixed(2));
  const q4Correct = `${q4Cost.toString().replace('.', ',')} €`;
  const q4Wrong1 = `${(q4Cost / 10).toString().replace('.', ',')} €`;
  const q4Wrong2 = `${(q4Cost * 10).toString().replace('.', ',')} €`;
  const q4Wrong3 = `${(q4Item.price + q4Count).toString().replace('.', ',')} €`;
  const q4Options = shuffle([q4Correct, q4Wrong1, q4Wrong2, q4Wrong3]);

  // Q5: True / False - Κανόνας μετατόπισης δεξιά (10, 100, 1000)
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Όταν πολλαπλασιάζουμε έναν δεκαδικό αριθμό με το 100, μετακινούμε την υποδιαστολή 2 θέσεις προς τα δεξιά.'
    : 'Όταν πολλαπλασιάζουμε έναν δεκαδικό αριθμό με το 100, μετακινούμε την υποδιαστολή 2 θέσεις προς τα αριστερά.';

  // Q6: True / False - Κανόνας μετατόπισης αριστερά (0,1, 0,01)
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Ο πολλαπλασιασμός ενός αριθμού με το 0,1 μικραίνει τον αριθμό (είναι ισοδύναμος με διαίρεση με το 10).'
    : 'Ο πολλαπλασιασμός ενός αριθμού με το 0,01 μεγαλώνει τον αριθμό κατά 100 φορές.';

  // Q7: SVG Visual - Μετατόπιση Υποδιαστολής (Input)
  const q7Int = getRandomInt(4, 38);
  const q7Dec = getRandomInt(1, 9);
  const q7Mult = [10, 100][getRandomInt(0, 1)];
  const q7Val = parseFloat(`${q7Int}.${q7Dec}`);
  const q7Ans = (q7Val * q7Mult).toString().replace('.', ',');

  // Q8: SVG Visual - Αναγνώριση Πράξης από Μετατόπιση (MCQ)
  const q8BaseInt = getRandomInt(25, 85);
  const q8BaseDec = getRandomInt(1, 9);
  const q8StartStr = `${q8BaseInt},${q8BaseDec}`;
  const q8TargetVal = parseFloat((parseFloat(`${q8BaseInt}.${q8BaseDec}`) * 0.01).toFixed(4));
  const q8TargetStr = q8TargetVal.toString().replace('.', ',');
  const q8CorrectMult = "× 0,01";
  const q8Options = shuffle(["× 0,01", "× 100", "× 0,1", "× 1000"]);

  return {
    q1: {
      type: 'input',
      title: 'Πολλαπλασιασμός με 10, 100, 1000',
      prompt: q1Prompt,
      correct: q1Correct,
      explain: `Πολλαπλασιάζοντας με το ${q1Mult}, μετακινούμε την υποδιαστολή ${q1Mult === 10 ? '1 θέση' : q1Mult === 100 ? '2 θέσεις' : '3 θέσεις'} προς τα δεξιά: ${q1Prompt} ＝ ${q1Correct}.`
    },
    q2: {
      type: 'input',
      title: 'Πολλαπλασιασμός με 0,1, 0,01, 0,001',
      prompt: q2Prompt,
      correct: q2Correct,
      explain: `Πολλαπλασιάζοντας με το ${q2MultStr}, μετακινούμε την υποδιαστολή ${q2Mult === 0.1 ? '1 θέση' : q2Mult === 0.01 ? '2 θέσεις' : '3 θέσεις'} προς τα αριστερά: ${q2Prompt} ＝ ${q2Correct}.`
    },
    q3: {
      type: 'mcq',
      title: 'Εύρεση Πολλαπλασιαστή',
      prompt: `Βρες τον αριθμό που λείπει: ${q3ValStr} × ? ＝ ${q3ResultStr}`,
      options: q3Options,
      correct: q3CorrectMult,
      explain: `Για να φτάσουμε από το ${q3ValStr} στο ${q3ResultStr}, η υποδιαστολή μετακινήθηκε κατάλληλα. Ο σωστός πολλαπλασιαστής είναι το ${q3CorrectMult}.`
    },
    q4: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: `Ένα σχολείο αγόρασε ${q4Count} ${q4Item.item} που κοστίζουν ${q4Item.price.toString().replace('.', ',')} € το καθένα. Πόσο κόστισαν όλα μαζί;`,
      options: q4Options,
      correct: q4Correct,
      explain: `Υπολογίζουμε το συνολικό κόστος: ${q4Count} × ${q4Item.price.toString().replace('.', ',')} € ＝ ${q4Correct}.`
    },
    q5: {
      type: 'tf',
      title: 'Κανόνας Μετατόπισης Δεξιά',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Ο πολλαπλασιασμός με 10, 100, 1000 μεγαλώνει τον αριθμό, άρα η υποδιαστολή μετακινείται δεξιά.'
        : 'Λάθος! Ο πολλαπλασιασμός με το 100 μετακινεί την υποδιαστολή 2 θέσεις προς τα ΔΕΞΙΑ (όχι αριστερά).'
    },
    q6: {
      type: 'tf',
      title: 'Κανόνας Μετατόπισης Αριστερά',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Ο πολλαπλασιασμός με το 0,1 ισοδυναμεί με διαίρεση δια 10, επομένως ο αριθμός μικραίνει.'
        : 'Λάθος! Ο πολλαπλασιασμός με το 0,01 ΜΙΚΡΑΙΝΕΙ τον αριθμό κατά 100 φορές.'
    },
    q7: {
      type: 'input',
      title: 'Οπτική Μετατόπιση Υποδιαστολής',
      startStr: `${q7Int},${q7Dec}`,
      mult: q7Mult,
      correct: q7Ans,
      explain: `Ξεκινώντας από το ${q7Int},${q7Dec} και κάνοντας ${q7Mult === 10 ? '1 άλμα' : '2 άλματα'} δεξιά λόγω του ×${q7Mult}, βρίσκουμε ${q7Ans}.`
    },
    q8: {
      type: 'mcq',
      title: 'Αναγνώριση Πράξης από Μετατόπιση',
      startStr: q8StartStr,
      targetStr: q8TargetStr,
      options: q8Options,
      correct: q8CorrectMult,
      explain: `Η υποδιαστολή μετακινήθηκε 2 θέσεις προς τα αριστερά (από ${q8StartStr} σε ${q8TargetStr}), άρα η πράξη είναι ${q8CorrectMult}.`
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
      title="🎯 Ασκήσεις: Δυνάμεις του 10 - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στον πολλαπλασιασμό με δυνάμεις του 10 για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/07-pollaplasiasmos-dinameis-deka" 
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
                Διαδραστικές Ασκήσεις: Δυνάμεις του 10
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα μετατόπισης υποδιαστολής με 10, 100, 1000 και 0,1, 0,01, 0,001!
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
                  Άσκηση 1 • × 10, 100, 1000
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                Υπολόγισε το γινόμενο:
              </p>
              <div className="p-3 bg-slate-100 rounded-2xl font-mono text-lg sm:text-xl text-center font-black text-slate-800 mb-4 overflow-x-auto flex items-center justify-center gap-2">
                <span>{questions.q1.prompt}</span>
                <span className="text-slate-400 mx-2">＝</span>
                <span className="text-amber-600">;</span>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q1}
                  onChange={(e) => handleInputChange('q1', e.target.value.replace(/\./g, ','))}
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
                  Άσκηση 2 • × 0,1, 0,01, 0,001
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                Υπολόγισε το γινόμενο:
              </p>
              <div className="p-3 bg-slate-100 rounded-2xl font-mono text-lg sm:text-xl text-center font-black text-slate-800 mb-4 overflow-x-auto flex items-center justify-center gap-2">
                <span>{questions.q2.prompt}</span>
                <span className="text-slate-400 mx-2">＝</span>
                <span className="text-amber-600">;</span>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q2}
                  onChange={(e) => handleInputChange('q2', e.target.value.replace(/\./g, ','))}
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
                  Άσκηση 3 • Εύρεση Πολλαπλασιαστή
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
                    × {opt}
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
                  Άσκηση 4 • Πρόβλημα
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

            {/* ΕΡΩΤΗΣΗ 7: Οπτικό SVG (Μετατόπιση Υποδιαστολής) */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q7')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-rose-100 text-rose-800 rounded-full">
                  Άσκηση 7 • Οπτική Μετατόπιση
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 font-medium">
                Υπολόγισε το αποτέλεσμα της μετατόπισης: <strong className="text-rose-700 font-mono">{questions.q7.startStr} × {questions.q7.mult}</strong>
              </p>
              
              <div className="bg-slate-100 rounded-2xl p-4 mb-4 flex justify-center overflow-x-auto">
                <svg viewBox="0 0 300 70" className="w-full max-w-xs h-16 select-none shrink-0 overflow-visible">
                  <defs>
                    <marker
                      id="ask-arrow-right"
                      viewBox="0 0 10 10"
                      refX="6"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto"
                    >
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                    </marker>
                  </defs>

                  <text x="50" y="55" fontSize="22" fontWeight="black" fill="#1e293b" fontFamily="monospace">
                    {questions.q7.startStr}
                  </text>
                  <path
                    d="M 105 35 Q 165 8 225 35"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    markerEnd="url(#ask-arrow-right)"
                  />
                  <text x="165" y="16" fontSize="11" fontWeight="black" textAnchor="middle" fill="#d97706">
                    × {questions.q7.mult}
                  </text>
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

            {/* ΕΡΩΤΗΣΗ 8: Οπτικό SVG (Αναγνώριση Πράξης) */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q8')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-teal-100 text-teal-800 rounded-full">
                  Άσκηση 8 • Αναγνώριση Πράξης
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q8') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 font-medium">
                Ποια πράξη μετέτρεψε το <strong className="text-slate-900 font-mono">{questions.q8.startStr}</strong> σε <strong className="text-teal-700 font-mono">{questions.q8.targetStr}</strong>;
              </p>

              <div className="bg-slate-100 p-3 rounded-2xl mb-3 flex items-center justify-center overflow-x-auto">
                <div className="flex items-center gap-3 font-mono font-black text-base sm:text-lg flex-wrap justify-center">
                  <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-slate-800 shadow-xs">{questions.q8.startStr}</span>
                  <span className="text-amber-500 font-sans text-xl">➔</span>
                  <span className="bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-300 text-teal-800 shadow-xs">{questions.q8.targetStr}</span>
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

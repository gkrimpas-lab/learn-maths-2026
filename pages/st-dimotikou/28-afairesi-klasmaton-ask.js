import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
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

function findGCD(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function findLCM(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / findGCD(a, b);
}

// Δεξαμενή σεναρίων καθημερινότητας
const REAL_WORLD_SCENARIOS = [
  { item: 'της πίτσας', initialText: 'Είχαμε τα', n1: 7, d1: 8, usedText: 'και φάγαμε τα', n2: 3, d2: 8, remText: 'περίσσεψε' },
  { item: 'του χυμού', initialText: 'Το μπουκάλι είχε τα', n1: 3, d1: 4, usedText: 'και ήπιαμε το', n2: 1, d2: 2, remText: 'έμεινε' },
  { item: 'του υφάσματος', initialText: 'Το τόπι είχε τα', n1: 5, d1: 6, usedText: 'και κόψαμε το', n2: 1, d2: 3, remText: 'περίσσεψε' },
  { item: 'του κήπου', initialText: 'Είχαμε σκάψει τα', n1: 4, d1: 5, usedText: 'και φυτέψαμε τα', n2: 3, d2: 10, remText: 'έμεινε άσκαφτο' }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledScenarios = shuffle(REAL_WORLD_SCENARIOS);

  // Q1: Input - Αφαίρεση Ομώνυμων Κλασμάτων
  const q1Den = getRandomInt(5, 12);
  const q1Num1 = getRandomInt(3, q1Den);
  const q1Num2 = getRandomInt(1, q1Num1 - 1);
  const q1DiffNum = q1Num1 - q1Num2;
  const q1Gcd = findGCD(q1DiffNum, q1Den);
  const q1CorrectRaw = `${q1DiffNum}/${q1Den}`;
  const q1CorrectSimp = `${q1DiffNum / q1Gcd}/${q1Den / q1Gcd}`;

  // Q2: Input - Αφαίρεση Ετερώνυμων Κλασμάτων
  const q2Pairs = [
    { n1: 3, d1: 4, n2: 1, d2: 2 },
    { n1: 5, d1: 6, n2: 1, d2: 3 },
    { n1: 4, d1: 5, n2: 3, d2: 10 },
    { n1: 7, d1: 8, n2: 1, d2: 4 },
    { n1: 2, d1: 3, n2: 1, d2: 6 },
    { n1: 5, d1: 6, n2: 1, d2: 2 }
  ];
  const q2Item = q2Pairs[getRandomInt(0, q2Pairs.length - 1)];
  const q2Lcm = findLCM(q2Item.d1, q2Item.d2);
  const q2Equiv1 = q2Item.n1 * (q2Lcm / q2Item.d1);
  const q2Equiv2 = q2Item.n2 * (q2Lcm / q2Item.d2);
  const q2DiffN = q2Equiv1 - q2Equiv2;
  const q2G = findGCD(q2DiffN, q2Lcm);
  const q2CorrectRaw = `${q2DiffN}/${q2Lcm}`;
  const q2CorrectSimp = `${q2DiffN / q2G}/${q2Lcm / q2G}`;

  // Q3: MCQ - Αφαίρεση από τη Μονάδα (1 － κλάσμα)
  const q3Den = getRandomInt(3, 8);
  const q3Num = getRandomInt(1, q3Den - 1);
  const q3DiffNum = q3Den - q3Num;
  const q3CorrectStr = `${q3DiffNum}/${q3Den}`;
  const q3Wrongs = [
    `${q3DiffNum + 1}/${q3Den}`,
    `${q3Num}/${q3Den}`,
    `${q3DiffNum}/${q3Den + 1}`
  ];
  const q3Options = shuffle([q3CorrectStr, ...q3Wrongs]);

  // Q4: MCQ - Αφαίρεση Ακέραιου από Κλάσμα ή Κλάσματος από Ακέραιο (π.χ. 2 － 3/4 = 5/4)
  const q4Whole = getRandomInt(2, 3);
  const q4Den = getRandomInt(3, 5);
  const q4Num = getRandomInt(1, q4Den - 1);
  const q4ResNum = q4Whole * q4Den - q4Num;
  const q4CorrectStr = `${q4ResNum}/${q4Den}`;
  const q4WrongsList = [
    `${q4ResNum + 1}/${q4Den}`,
    `${q4Whole * q4Den}/${q4Den}`,
    `${q4Whole - q4Num}/${q4Den}`
  ];
  const q4Options = shuffle([q4CorrectStr, ...q4WrongsList]);

  // Q5: True / False - Κανόνας ομωνύμων στην αφαίρεση
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στην αφαίρεση ομώνυμων κλασμάτων, αφαιρούμε μόνο τους αριθμητές και αφήνουμε τον ίδιο παρονομαστή.'
    : 'Στην αφαίρεση ομώνυμων κλασμάτων, αφαιρούμε και τους αριθμητές και τους παρονομαστές μεταξύ τους.';

  // Q6: True / False - Αφαίρεση ετερωνύμων
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Για να αφαιρέσουμε ετερώνυμα κλάσματα, πρέπει πρώτα οπωσδήποτε να τα μετατρέψουμε σε ομώνυμα βρίσκοντας το Ε.Κ.Π.'
    : 'Μπορούμε να αφαιρέσουμε ετερώνυμα κλάσματα αφαιρώντας απευθείας τους αριθμητές και τους παρονομαστές.';

  // Q7: Input - Εύρεση άγνωστου όρου: 8/9 － x/9 = 5/9
  const q7Den = getRandomInt(6, 12);
  const q7Target = getRandomInt(1, q7Den - 3);
  const q7Start = getRandomInt(q7Target + 2, q7Den);
  const q7Correct = String(q7Start - q7Target);

  // Q8: MCQ - Πρόβλημα Καθημερινότητας
  const sc = shuffledScenarios[0];
  const scLcm = findLCM(sc.d1, sc.d2);
  const scN1 = sc.n1 * (scLcm / sc.d1);
  const scN2 = sc.n2 * (scLcm / sc.d2);
  const scDiffN = scN1 - scN2;
  const scG = findGCD(scDiffN, scLcm);
  const scCorrectStr = scG > 1 && (scDiffN / scG !== scDiffN)
    ? `${scDiffN / scG}/${scLcm / scG}`
    : `${scDiffN}/${scLcm}`;
  const scWrongs = [
    `${scDiffN + 1}/${scLcm}`,
    `${sc.n1 - sc.n2}/${sc.d1 - sc.d2 || scLcm}`,
    `${Math.max(1, scDiffN - 1)}/${scLcm}`
  ].filter(w => w !== scCorrectStr);
  const q8Options = shuffle([scCorrectStr, ...scWrongs.slice(0, 3)]);

  return {
    q1: {
      type: 'input',
      title: 'Ομώνυμα Κλάσματα',
      prompt: `Υπολόγισε τη διαφορά των κλασμάτων: ${q1Num1}/${q1Den} － ${q1Num2}/${q1Den} (π.χ. 2/7):`,
      correct: q1CorrectRaw,
      altCorrect: q1CorrectSimp,
      explain: `${q1Num1}/${q1Den} － ${q1Num2}/${q1Den} ＝ (${q1Num1} － ${q1Num2})/${q1Den} ＝ ${q1CorrectRaw}${q1Gcd > 1 ? ` (ή απλοποιημένο: ${q1CorrectSimp})` : ''}.`
    },
    q2: {
      type: 'input',
      title: 'Ετερώνυμα Κλάσματα',
      prompt: `Υπολόγισε τη διαφορά: ${q2Item.n1}/${q2Item.d1} － ${q2Item.n2}/${q2Item.d2} (π.χ. 1/4):`,
      correct: q2CorrectRaw,
      altCorrect: q2CorrectSimp,
      explain: `Ε.Κ.Π.(${q2Item.d1}, ${q2Item.d2}) ＝ ${q2Lcm}. Μετατρέπουμε σε ομώνυμα: ${q2Equiv1}/${q2Lcm} － ${q2Equiv2}/${q2Lcm} ＝ ${q2CorrectRaw}${q2G > 1 ? ` ＝ ${q2CorrectSimp}` : ''}.`
    },
    q3: {
      type: 'mcq',
      title: 'Αφαίρεση από τη Μονάδα',
      prompt: `Ποιο είναι το αποτέλεσμα της πράξης 1 － ${q3Num}/${q3Den};`,
      options: q3Options,
      correct: q3CorrectStr,
      explain: `Γράφουμε τη μονάδα ως κλάσμα: 1 ＝ ${q3Den}/${q3Den}. Επομένως: ${q3Den}/${q3Den} － ${q3Num}/${q3Den} ＝ ${q3CorrectStr}.`
    },
    q4: {
      type: 'mcq',
      title: 'Ακέραιος － Κλάσμα',
      prompt: `Ποιο είναι το αποτέλεσμα της πράξης ${q4Whole} － ${q4Num}/${q4Den};`,
      options: q4Options,
      correct: q4CorrectStr,
      explain: `Γράφουμε τον ακέραιο ως κλάσμα: ${q4Whole} ＝ ${q4Whole * q4Den}/${q4Den}. Επομένως: ${q4Whole * q4Den}/${q4Den} － ${q4Num}/${q4Den} ＝ ${q4CorrectStr}.`
    },
    q5: {
      type: 'tf',
      title: 'Κανόνας Ομωνύμων',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Στα ομώνυμα κλάσματα αφαιρούμε ΜΟΝΟ τους αριθμητές και κρατάμε τον ίδιο παρονομαστή.'
        : 'Λάθος! ΠΟΤΕ δεν αφαιρούμε τους παρονομαστές μεταξύ τους.'
    },
    q6: {
      type: 'tf',
      title: 'Κανόνας Ετερωνύμων',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Για να αφαιρέσουμε ετερώνυμα κλάσματα πρέπει πρώτα να τα κάνουμε ομώνυμα με το Ε.Κ.Π.'
        : 'Λάθος! Δεν μπορούμε να αφαιρέσουμε ετερώνυμα κλάσματα χωρίς να τα μετατρέψουμε πρώτα σε ομώνυμα.'
    },
    q7: {
      type: 'input',
      title: 'Εύρεση Άγνωστου Αριθμητή',
      prompt: `Βρες τον αριθμητή x στην ισότητα: ${q7Start}/${q7Den} － x/${q7Den} ＝ ${q7Target}/${q7Den}`,
      correct: q7Correct,
      explain: `Αφού τα κλάσματα είναι ομώνυμα, ισχύει ${q7Start} － x ＝ ${q7Target} ➔ x ＝ ${q7Start} － ${q7Target} ＝ ${q7Correct}.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: `${sc.initialText} ${sc.n1}/${sc.d1} ${sc.item} ${sc.usedText} ${sc.n2}/${sc.d2} ${sc.item}. Ποιο μέρος ${sc.remText};`,
      options: q8Options,
      correct: scCorrectStr,
      explain: `Κάνουμε ομώνυμα και αφαιρούμε: ${scN1}/${scLcm} － ${scN2}/${scLcm} ＝ ${scDiffN}/${scLcm}${scG > 1 ? ` ＝ ${scCorrectStr}` : ''}.`
    }
  };
}

export default function AfairesiKlasmatonExercisesPage() {
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
      const cleanAns = a.replace(/\s+/g, '').trim().toLowerCase();
      const cleanCorrect = q.correct.replace(/\s+/g, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\s+/g, '').trim().toLowerCase() : null;
      return cleanAns === cleanCorrect || (cleanAlt && cleanAns === cleanAlt);
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between pb-32">
      <Head>
        <title>🎯 Ασκήσεις: Αφαίρεση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr</title>
        <meta name="description" content="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στην αφαίρεση ομώνυμων και ετερώνυμων κλασμάτων για τη ΣΤ' Δημοτικού." />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className={`${LAYOUT.CONTAINER} py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight flex items-center">
              <span>LearnMaths</span><span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link 
                href="/st-dimotikou/28-afairesi-klasmaton" 
                className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-200 transition"
              >
                <span>📖</span> <span>Θεωρία</span>
              </Link>
              <Link 
                href="/st-dimotikou" 
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition"
              >
                <span>🔙</span> <span>Πίσω</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* 2. HEADER HERO BANNER */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white py-10 px-4 shadow-inner">
          <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-6`}>
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-100 border border-white/20">
                <span>🎯 ΣΤ' Δημοτικού • Εξάσκηση</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Διαδραστικές Ασκήσεις: Αφαίρεση Κλασμάτων
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-xl">
                Λύσε τα 8 δυναμικά προβλήματα αφαίρεσης ομώνυμων & ετερώνυμων κλασμάτων, αφαίρεσης από ακέραιο και απλοποίησης!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewQuestions}
              className="px-5 py-3 bg-white text-blue-800 hover:bg-blue-50 rounded-2xl font-extrabold shadow-md transition transform active:scale-95 text-sm flex items-center gap-2 shrink-0"
            >
              <span>🔄</span> <span>Νέες Ασκήσεις</span>
            </button>
          </div>
        </section>

        {/* 3. ΦΟΡΜΑ ΜΕ ΤΙΣ 8 ΕΡΩΤΗΣΕΙΣ */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* ΕΡΩΤΗΣΗ 1 */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q1')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Άσκηση 1 • Ομώνυμα Κλάσματα
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q1.prompt}
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q1}
                    onChange={(e) => handleInputChange('q1', e.target.value)}
                    placeholder="π.χ. 2/7"
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
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q2')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                    Άσκηση 2 • Ετερώνυμα Κλάσματα
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
                    placeholder="π.χ. 1/4"
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
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q3')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                    Άσκηση 3 • Αφαίρεση από τη Μονάδα
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
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q4')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                    Άσκηση 4 • Ακέραιος － Κλάσμα
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q4') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  {questions.q4.prompt}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {questions.q4.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleInputChange('q4', opt)}
                      className={`p-3 rounded-xl text-base font-mono font-black border text-center transition ${
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
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q5')}`}>
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
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q6')}`}>
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
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q7')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-rose-100 text-rose-800 rounded-full">
                    Άσκηση 7 • Άγνωστος Αριθμητής
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
                    placeholder="Γράψε την τιμή του x..."
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
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q8')}`}>
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
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {questions.q8.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleInputChange('q8', opt)}
                      className={`w-full p-2.5 rounded-xl text-base font-mono font-black border text-center transition ${
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
              <div className="flex justify-center pt-8">
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
        </main>
      </div>

      {/* 4. FIXED STICKY BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-4 px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-3`}>
          
          {/* ΑΡΙΣΤΕΡΑ: SCORE BADGE & PERCENTAGE */}
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>Σκορ:</span>
              <span className="font-mono text-xl md:text-2xl">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-sm font-bold text-slate-300">
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
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
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
    </div>
  );
}

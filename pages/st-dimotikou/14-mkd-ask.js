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

function getDivisors(num) {
  const divs = [];
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) divs.push(i);
  }
  return divs;
}

function getGCD(a, b) {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Δεξαμενή θεματικών σεναρίων καθημερινότητας με πλήρη γραμματική και συντακτική ακρίβεια
const REAL_WORLD_PRESETS = [
  {
    profession: 'Ένας μανάβης',
    item1: 'μήλα',
    item2: 'πορτοκάλια',
    groupName: 'καλάθια',
    questionText: 'Πόσα πανομοιότυπα καλάθια μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα;'
  },
  {
    profession: 'Ένας βιβλιοπώλης',
    item1: 'τετράδια',
    item2: 'μολύβια',
    groupName: 'σετ δώρων',
    questionText: 'Πόσα πανομοιότυπα σετ δώρων μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα;'
  },
  {
    profession: 'Ένας ανθοπώλης',
    item1: 'τριαντάφυλλα',
    item2: 'μαργαρίτες',
    groupName: 'ανθοδέσμες',
    questionText: 'Πόσες πανομοιότυπες ανθοδέσμες μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα;'
  },
  {
    profession: 'Ένας προπονητής',
    item1: 'μπάλες ποδοσφαίρου',
    item2: 'μπάλες μπάσκετ',
    groupName: 'σάκους',
    questionText: 'Πόσους πανομοιότυπους σάκους μπορεί να φτιάξει το πολύ χωρίς να περισσέψει καμία μπάλα;'
  },
  {
    profession: 'Ένας παντοπώλης',
    item1: 'σοκολατάκια',
    item2: 'καραμέλες',
    groupName: 'πακέτα',
    questionText: 'Πόσα πανομοιότυπα πακέτα μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα;'
  }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledPresets = shuffle(REAL_WORLD_PRESETS);

  // Q1: Input - Μ.Κ.Δ. 2 αριθμών
  const q1Pool = [
    [12, 18], [15, 20], [24, 36], [20, 30], [16, 24], [18, 27], [30, 45]
  ];
  const [q1A, q1B] = q1Pool[getRandomInt(0, q1Pool.length - 1)];
  const q1GCD = getGCD(q1A, q1B);
  const q1Correct = String(q1GCD);

  // Q2: Input - Μ.Κ.Δ. 3 αριθμών
  const q2Pool = [
    [12, 18, 24], [16, 24, 32], [20, 30, 40], [15, 30, 45], [12, 16, 20]
  ];
  const [q2A, q2B, q2C] = q2Pool[getRandomInt(0, q2Pool.length - 1)];
  const q2GCD = getGCD(getGCD(q2A, q2B), q2C);
  const q2Correct = String(q2GCD);

  // Q3: MCQ - Σύνολο Κοινών Διαιρετών
  const q3Pool = [
    [12, 18], [20, 30], [24, 36], [16, 24]
  ];
  const [q3A, q3B] = q3Pool[getRandomInt(0, q3Pool.length - 1)];
  const q3DivsA = getDivisors(q3A);
  const q3DivsB = getDivisors(q3B);
  const q3Common = q3DivsA.filter(d => q3DivsB.includes(d));
  const q3CorrectStr = `{ ${q3Common.join(', ')} }`;
  const q3Wrong1 = `{ ${q3Common.filter((_, i) => i !== 1).join(', ')} }`;
  const q3Wrong2 = `{ ${[...q3Common, q3Common[q3Common.length - 1] * 2].sort((a, b) => a - b).join(', ')} }`;
  const q3Wrong3 = `{ ${q3Common.map(d => d === 2 ? 5 : d).sort((a, b) => a - b).join(', ')} }`;
  const q3Options = shuffle([q3CorrectStr, q3Wrong1, q3Wrong2, q3Wrong3]);

  // Q4: MCQ - Πρώτοι μεταξύ τους αριθμοί (Μ.Κ.Δ. = 1)
  const q4CoprimePairs = [
    [8, 9], [9, 14], [15, 16], [8, 15], [21, 22], [14, 25]
  ];
  const q4NonCoprimePairs = [
    [12, 18], [14, 21], [15, 20], [16, 24], [20, 35], [18, 27]
  ];
  const q4ChosenCoprime = q4CoprimePairs[getRandomInt(0, q4CoprimePairs.length - 1)];
  const q4ChosenNonCoprimes = shuffle(q4NonCoprimePairs).slice(0, 3);
  const q4CorrectStr = `${q4ChosenCoprime[0]} και ${q4ChosenCoprime[1]}`;
  const q4Options = shuffle([
    q4CorrectStr,
    ...q4ChosenNonCoprimes.map(p => `${p[0]} και ${p[1]}`)
  ]);

  // Q5: True / False - Ορισμός Μ.Κ.Δ.
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Ο Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) δύο αριθμών είναι ο μεγαλύτερος αριθμός που τους διαιρεί και τους δύο ακριβώς.'
    : 'Ο Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) δύο αριθμών είναι το γινόμενο των δύο αριθμών.';

  // Q6: True / False - Πρώτοι μεταξύ τους αριθμοί
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Όταν δύο αριθμοί έχουν Μ.Κ.Δ. ίσο με το 1, ονομάζονται πρώτοι μεταξύ τους.'
    : 'Δύο αριθμοί ονομάζονται πρώτοι μεταξύ τους μόνο αν είναι και οι δύο μονοψήφιοι.';

  // Q7: Input - Οπτικό μοίρασμα σε κομμάτια Μ.Κ.Δ.
  const q7A = [18, 24, 30][getRandomInt(0, 2)];
  const q7B = [12, 16, 20][getRandomInt(0, 2)];
  const q7Mkd = getGCD(q7A, q7B);
  const q7Correct = String(q7Mkd);

  // Q8: MCQ - Πρόβλημα Καθημερινότητας (Με σωστή σύνταξη)
  const p = shuffledPresets[0];
  const q8Count1 = getRandomInt(3, 6) * 6; // π.χ. 18, 24, 30, 36
  const q8Count2 = getRandomInt(2, 5) * 6; // π.χ. 12, 18, 24
  const q8GCD = getGCD(q8Count1, q8Count2);
  const q8CorrectStr = `${q8GCD} ${p.groupName}`;
  const q8Wrong1 = `${q8GCD + 2} ${p.groupName}`;
  const q8Wrong2 = `${Math.max(1, q8GCD - 2)} ${p.groupName}`;
  const q8Wrong3 = `${q8GCD * 2} ${p.groupName}`;
  const q8Options = shuffle([q8CorrectStr, q8Wrong1, q8Wrong2, q8Wrong3]);

  return {
    q1: {
      type: 'input',
      title: 'Μ.Κ.Δ. Δύο Αριθμών',
      prompt: `Μ.Κ.Δ.(${q1A}, ${q1B})`,
      correct: q1Correct,
      explain: `Οι κοινοί διαιρέτες των ${q1A} και ${q1B} έχουν μεγαλύτερο το ${q1Correct}. Άρα Μ.Κ.Δ.(${q1A}, ${q1B}) ＝ ${q1Correct}.`
    },
    q2: {
      type: 'input',
      title: 'Μ.Κ.Δ. Τριών Αριθμών',
      prompt: `Μ.Κ.Δ.(${q2A}, ${q2B}, ${q2C})`,
      correct: q2Correct,
      explain: `Ο μεγαλύτερος κοινός διαιρέτης των ${q2A}, ${q2B} και ${q2C} είναι το ${q2Correct}.`
    },
    q3: {
      type: 'mcq',
      title: 'Σύνολο Κοινών Διαιρετών',
      prompt: `Ποιο είναι το σύνολο των κοινών διαιρετών των αριθμών ${q3A} και ${q3B};`,
      options: q3Options,
      correct: q3CorrectStr,
      explain: `Οι διαιρέτες του ${q3A} και του ${q3B} που συμπίπτουν είναι: ${q3CorrectStr}.`
    },
    q4: {
      type: 'mcq',
      title: 'Πρώτοι Μεταξύ Τους',
      prompt: 'Ποιο από τα παρακάτω ζεύγη αποτελείται από αριθμούς που είναι πρώτοι μεταξύ τους;',
      options: q4Options,
      correct: q4CorrectStr,
      explain: `Οι αριθμοί ${q4CorrectStr} έχουν μοναδικό κοινό διαιρέτη το 1 (Μ.Κ.Δ. = 1), άρα είναι πρώτοι μεταξύ τους.`
    },
    q5: {
      type: 'tf',
      title: 'Ορισμός Μ.Κ.Δ.',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Ο Μ.Κ.Δ. είναι ο μεγαλύτερος από όλους τους κοινούς διαιρέτες δύο ή περισσότερων αριθμών.'
        : 'Ο Μ.Κ.Δ. είναι ο μεγαλύτερος κοινός διαιρέτης, όχι το γινόμενο.'
    },
    q6: {
      type: 'tf',
      title: 'Ιδιότητα Πρώτων Μεταξύ Τους',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Δύο αριθμοί λέγονται πρώτοι μεταξύ τους όταν έχουν Μ.Κ.Δ. ίσο με 1.'
        : 'Δύο αριθμοί μπορεί να είναι πρώτοι μεταξύ τους ακόμη κι αν είναι μεγάλοι σύνθετοι αριθμοί (π.χ. 14 και 25).'
    },
    q7: {
      type: 'input',
      title: 'Οπτική Κατάτμηση',
      numA: q7A,
      numB: q7B,
      correct: q7Correct,
      explain: `Το μεγαλύτερο μέγεθος κομματιού που μετράει ακριβώς και το ${q7A} και το ${q7B} είναι το ${q7Correct}.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: `${p.profession} έχει ${q8Count1} ${p.item1} και ${q8Count2} ${p.item2}. ${p.questionText}`,
      options: q8Options,
      correct: q8CorrectStr,
      explain: `Βρίσκουμε τον Μ.Κ.Δ.(${q8Count1}, ${q8Count2}) ＝ ${q8GCD}. Άρα μπορεί να φτιάξει το πολύ ${q8CorrectStr}.`
    }
  };
}

export default function MkdExercisesPage() {
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
      title="🎯 Ασκήσεις: Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στον Μέγιστο Κοινό Διαιρέτη για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/14-mkd" 
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
                Διαδραστικές Ασκήσεις: Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.)
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα εύρεσης Μ.Κ.Δ., κοινών διαιρετών και πρώτων μεταξύ τους αριθμών!
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
                  Άσκηση 1 • Μ.Κ.Δ. Δύο Αριθμών
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                Υπολόγισε τον Μέγιστο Κοινό Διαιρέτη:
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
                  onChange={(e) => handleInputChange('q1', e.target.value)}
                  placeholder="Γράψε τον Μ.Κ.Δ...."
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
                  Άσκηση 2 • Μ.Κ.Δ. Τριών Αριθμών
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                Υπολόγισε τον Μέγιστο Κοινό Διαιρέτη:
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
                  onChange={(e) => handleInputChange('q2', e.target.value)}
                  placeholder="Γράψε τον Μ.Κ.Δ...."
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
                  Άσκηση 3 • Κοινοί Διαιρέτες
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q3') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                {questions.q3.prompt}
              </p>
              <div className="space-y-2 mb-3">
                {questions.q3.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q3', opt)}
                    className={`w-full p-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold border text-left transition ${
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
                  Άσκηση 4 • Πρώτοι Μεταξύ Τους
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
                    className={`p-3 rounded-xl text-xs sm:text-sm font-bold border text-center transition ${
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
                  Άσκηση 7 • Οπτική Κατάτμηση
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 font-medium">
                Ποιο είναι το μεγαλύτερο κοινό μήκος κομματιού που μετράει ακριβώς δύο ράβδους μήκους <strong className="text-rose-700 font-mono">{questions.q7.numA} εκ.</strong> και <strong className="text-blue-700 font-mono">{questions.q7.numB} εκ.</strong>;
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q7}
                  onChange={(e) => handleInputChange('q7', e.target.value)}
                  placeholder="Γράψε το μέγιστο μήκος σε εκ...."
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
              <div className="grid grid-cols-2 gap-2 mb-3">
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

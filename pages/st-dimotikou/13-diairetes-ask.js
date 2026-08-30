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

// Δεξαμενή θεματικών σεναρίων καθημερινότητας με σωστή γραμματική διατύπωση ερώτησης
const REAL_WORLD_PRESETS = [
  { item: 'μαθητές', unit: 'ισοπληθείς ομάδες', questionPrefix: 'Σε πόσες' },
  { item: 'καραμέλες', unit: 'σακουλάκια', questionPrefix: 'Σε πόσα' },
  { item: 'βιβλία', unit: 'ράφια', questionPrefix: 'Σε πόσα' },
  { item: 'λουλούδια', unit: 'ανθοδέσμες', questionPrefix: 'Σε πόσες' },
  { item: 'σοκολατάκια', unit: 'κουτάκια', questionPrefix: 'Σε πόσα' }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledItems = shuffle(REAL_WORLD_PRESETS);

  // Q1: Input - Πλήθος διαιρετών ενός αριθμού
  const q1Pool = [12, 16, 18, 20, 24, 28, 30, 36];
  const q1Num = q1Pool[getRandomInt(0, q1Pool.length - 1)];
  const q1Divs = getDivisors(q1Num);
  const q1Correct = String(q1Divs.length);

  // Q2: Input - Εύρεση του μεγαλύτερου διαιρέτη (εκτός του εαυτού του)
  const q2Pool = [14, 18, 20, 22, 26, 28, 32, 34, 38, 40];
  const q2Num = q2Pool[getRandomInt(0, q2Pool.length - 1)];
  const q2Divs = getDivisors(q2Num);
  const q2Correct = String(q2Divs[q2Divs.length - 2]);

  // Q3: MCQ - Έλεγχος αν ένας αριθμός είναι διαιρέτης
  const q3Base = getRandomInt(4, 9) * getRandomInt(3, 8);
  const q3Divs = getDivisors(q3Base);
  const q3ValidDiv = q3Divs[getRandomInt(1, q3Divs.length - 2)];
  const q3NonDivs = [2, 3, 4, 5, 6, 7, 8, 9, 11, 13].filter(d => q3Base % d !== 0);
  const q3Wrongs = shuffle(q3NonDivs).slice(0, 3);
  const q3Options = shuffle([String(q3ValidDiv), ...q3Wrongs.map(String)]);

  // Q4: MCQ - Ποιο από τα σύνολα περιέχει ΟΛΟΥΣ τους διαιρέτες (χωρίς διπλότυπα)
  const q4Pool = [12, 18, 20, 24, 30];
  const q4Num = q4Pool[getRandomInt(0, q4Pool.length - 1)];
  const q4CorrectDivs = getDivisors(q4Num);
  const q4CorrectStr = `{ ${q4CorrectDivs.join(', ')} }`;

  // 1ο Λάθος: Λείπει ένας ενδιάμεσος διαιρέτης (π.χ. το 2 ή το 3)
  const q4MissingOne = q4CorrectDivs.filter((_, i) => i !== 1);
  const q4Wrong1 = `{ ${q4MissingOne.join(', ')} }`;

  // 2ο Λάθος: Έχει έναν επιπλέον αριθμό που ΔΕΝ είναι διαιρέτης
  const nonDivCandidate1 = [7, 8, 9, 11, 13, 14].find(x => q4Num % x !== 0 && !q4CorrectDivs.includes(x)) || (q4Num + 2);
  const q4WithExtra = [...q4CorrectDivs, nonDivCandidate1].sort((a, b) => a - b);
  const q4Wrong2 = `{ ${q4WithExtra.join(', ')} }`;

  // 3ο Λάθος: Έχει αντικατασταθεί ένας διαιρέτης με άλλον μη-διαιρέτη
  const nonDivCandidate2 = [7, 8, 9, 11, 13, 14, 15].filter(x => q4Num % x !== 0 && !q4CorrectDivs.includes(x))[0] || (q4Num - 1);
  const q4Replaced = q4CorrectDivs.map((d, i) => (i === 1 ? nonDivCandidate2 : d)).sort((a, b) => a - b);
  const q4Wrong3 = `{ ${q4Replaced.join(', ')} }`;

  const q4Options = shuffle([q4CorrectStr, q4Wrong1, q4Wrong2, q4Wrong3]);

  // Q5: True / False - Ο αριθμός 1 είναι διαιρέτης όλων των φυσικών
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Ο αριθμός 1 είναι διαιρέτης κάθε φυσικού αριθμού.'
    : 'Ο αριθμός 1 είναι διαιρέτης μόνο των περιττών αριθμών.';

  // Q6: True / False - Το πλήθος των διαιρετών είναι πεπερασμένο
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Κάθε φυσικός αριθμός έχει συγκεκριμένο (πεπερασμένο) πλήθος διαιρετών.'
    : 'Κάθε φυσικός αριθμός έχει άπειρους διαιρέτες.';

  // Q7: Input - Οπτικό μοίρασμα σε ισόποσες ομάδες
  const q7ItemsCount = [12, 16, 18, 20, 24][getRandomInt(0, 4)];
  const q7Divs = getDivisors(q7ItemsCount).filter(d => d > 1 && d < q7ItemsCount);
  const q7ChosenDiv = q7Divs[getRandomInt(0, q7Divs.length - 1)];
  const q7CorrectGroups = String(q7ItemsCount / q7ChosenDiv);

  // Q8: MCQ - Πρόβλημα Καθημερινότητας (Ισόποσο μοίρασμα χωρίς υπόλοιπο)
  const q8Preset = shuffledItems[0];
  const q8Total = [24, 30, 36, 40][getRandomInt(0, 3)];
  const q8AllDivs = getDivisors(q8Total).filter(d => d > 2 && d < 12);
  const q8Possible = q8AllDivs[getRandomInt(0, q8AllDivs.length - 1)];
  const q8Impossible = [7, 8, 9, 11, 13, 14].filter(d => q8Total % d !== 0);
  const q8Wrongs = shuffle(q8Impossible).slice(0, 3);
  const q8Options = shuffle([`${q8Possible} ${q8Preset.unit}`, ...q8Wrongs.map(w => `${w} ${q8Preset.unit}`)]);

  return {
    q1: {
      type: 'input',
      title: 'Πλήθος Διαιρετών',
      number: String(q1Num),
      correct: q1Correct,
      explain: `Οι διαιρέτες του ${q1Num} είναι οι: ${q1Divs.join(', ')} (συνολικά ${q1Correct} διαιρέτες).`
    },
    q2: {
      type: 'input',
      title: 'Μεγαλύτερος Γνήσιος Διαιρέτης',
      number: String(q2Num),
      correct: q2Correct,
      explain: `Οι διαιρέτες του ${q2Num} είναι: ${q2Divs.join(', ')}. Ο μεγαλύτερος διαιρέτης εκτός του ${q2Num} είναι το ${q2Correct}.`
    },
    q3: {
      type: 'mcq',
      title: 'Αναγνώριση Διαιρέτη',
      prompt: `Ποιος από τους παρακάτω αριθμούς είναι διαιρέτης του ${q3Base};`,
      options: q3Options,
      correct: String(q3ValidDiv),
      explain: `Το ${q3ValidDiv} διαιρεί ακριβώς το ${q3Base} (${q3Base} : ${q3ValidDiv} ＝ ${q3Base / q3ValidDiv}), άρα είναι διαιρέτης του.`
    },
    q4: {
      type: 'mcq',
      title: 'Σύνολο Διαιρετών',
      prompt: `Ποιο σύνολο περιέχει ΟΛΟΥΣ τους διαιρέτες του αριθμού ${q4Num};`,
      options: q4Options,
      correct: q4CorrectStr,
      explain: `Όλοι οι αριθμοί που διαιρούν ακριβώς το ${q4Num} είναι: ${q4CorrectStr}.`
    },
    q5: {
      type: 'tf',
      title: 'Η Μονάδα ως Διαιρέτης',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Ο αριθμός 1 διαιρεί όλους ανεξαιρέτως τους φυσικούς αριθμούς.'
        : 'Λάθος! Ο αριθμός 1 διαιρεί όλους τους φυσικούς αριθμούς (άρτιους και περιττούς).'
    },
    q6: {
      type: 'tf',
      title: 'Πλήθος Διαιρετών',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Οι διαιρέτες ενός αριθμού είναι πεπερασμένοι (δεν μπορεί να είναι μεγαλύτεροι από τον ίδιο τον αριθμό).'
        : 'Λάθος! Οι διαιρέτες είναι πεπερασμένοι, σε αντίθεση με τα πολλαπλάσια που είναι άπειρα.'
    },
    q7: {
      type: 'input',
      title: 'Οπτική Κατανομή',
      total: q7ItemsCount,
      perGroup: q7ChosenDiv,
      correct: q7CorrectGroups,
      explain: `Μοιράζοντας τα ${q7ItemsCount} στοιχεία σε ομάδες των ${q7ChosenDiv}, σχηματίζονται ακριβώς ${q7ItemsCount} : ${q7ChosenDiv} ＝ ${q7CorrectGroups} ισοπληθείς ομάδες.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: `Έχουμε ${q8Total} ${q8Preset.item}. ${q8Preset.questionPrefix} ${q8Preset.unit} μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
      options: q8Options,
      correct: `${q8Possible} ${q8Preset.unit}`,
      explain: `Το ${q8Possible} είναι διαιρέτης του ${q8Total} (${q8Total} : ${q8Possible} ＝ ${q8Total / q8Possible}), επομένως το μοίρασμα γίνεται χωρίς υπόλοιπο.`
    }
  };
}

export default function DiairetesExercisesPage() {
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
      title="🎯 Ασκήσεις: Οι Διαιρέτες ενός Αριθμού - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στους διαιρέτες φυσικών αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/13-diairetes" 
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
                Διαδραστικές Ασκήσεις: Οι Διαιρέτες ενός Αριθμού
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα εύρεσης διαιρετών, συνόλων διαίρεσης και ισόποσης κατανομής!
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
                  Άσκηση 1 • Πλήθος Διαιρετών
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                Πόσους συνολικά διαιρέτες έχει ο αριθμός <strong className="text-blue-700 font-mono text-base">{questions.q1.number}</strong>;
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q1}
                  onChange={(e) => handleInputChange('q1', e.target.value)}
                  placeholder="Γράψε το πλήθος των διαιρετών..."
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
                  Άσκηση 2 • Μεγαλύτερος Διαιρέτης
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                Ποιος είναι ο μεγαλύτερος διαιρέτης του <strong className="text-indigo-700 font-mono text-base">{questions.q2.number}</strong> (εκτός από τον ίδιο τον αριθμό);
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q2}
                  onChange={(e) => handleInputChange('q2', e.target.value)}
                  placeholder="Γράψε τον διαιρέτη..."
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
                  Άσκηση 3 • Αναγνώριση Διαιρέτη
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
                  Άσκηση 4 • Σύνολο Διαιρετών
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q4') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                {questions.q4.prompt}
              </p>
              <div className="space-y-2 mb-3">
                {questions.q4.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q4', opt)}
                    className={`w-full p-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold border text-left transition ${
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
                  Άσκηση 7 • Οπτική Κατανομή
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 font-medium">
                Αν μοιράσουμε <strong className="text-rose-700 font-mono">{questions.q7.total}</strong> στοιχεία σε ομάδες των <strong className="text-blue-700 font-mono">{questions.q7.perGroup}</strong>, πόσες πλήρεις ομάδες σχηματίζονται;
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q7}
                  onChange={(e) => handleInputChange('q7', e.target.value)}
                  placeholder="Γράψε τον αριθμό των ομάδων..."
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

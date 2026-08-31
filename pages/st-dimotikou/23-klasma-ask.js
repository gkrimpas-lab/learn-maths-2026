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

// Δεξαμενή σεναρίων καθημερινότητας με σωστές πτώσεις
const REAL_WORLD_SCENARIOS = [
  { item: 'την πίτσα', parts: 8, eatenText: 'έφαγε', remainingText: 'περίσσεψαν' },
  { item: 'τη σοκολάτα', parts: 12, eatenText: 'μοίρασε', remainingText: 'έμειναν' },
  { item: 'το κέικ', parts: 10, eatenText: 'σέρβιρε', remainingText: 'έμειναν' },
  { item: 'την πίτα', parts: 6, eatenText: 'κατανάλωσε', remainingText: 'περίσσεψαν' }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledScenarios = shuffle(REAL_WORLD_SCENARIOS);

  // Q1: Input - Αναγνώριση όρων κλάσματος (Αριθμητής ή Παρονομαστής)
  const q1Num = getRandomInt(2, 9);
  const q1Den = getRandomInt(q1Num + 1, 15);
  const q1AskNumerator = Math.random() > 0.5;
  const q1Prompt = q1AskNumerator
    ? `Ποιος είναι ο αριθμητής του κλάσματος ${q1Num}/${q1Den};`
    : `Ποιος είναι ο παρονομαστής του κλάσματος ${q1Num}/${q1Den};`;
  const q1Correct = String(q1AskNumerator ? q1Num : q1Den);

  // Q2: MCQ - Κατηγορία κλάσματος (Γνήσιο, Καταχρηστικό, Ίσο με τη μονάδα)
  const q2Type = ['proper', 'improper', 'unit'][getRandomInt(0, 2)];
  let q2Num, q2Den, q2CorrectType;
  if (q2Type === 'proper') {
    q2Den = getRandomInt(4, 12);
    q2Num = getRandomInt(1, q2Den - 1);
    q2CorrectType = 'Γνήσιο κλάσμα (< 1)';
  } else if (q2Type === 'improper') {
    q2Den = getRandomInt(3, 8);
    q2Num = getRandomInt(q2Den + 1, 15);
    q2CorrectType = 'Καταχρηστικό κλάσμα (> 1)';
  } else {
    q2Den = getRandomInt(3, 10);
    q2Num = q2Den;
    q2CorrectType = 'Ίσο με τη μονάδα (= 1)';
  }
  const q2Options = shuffle(['Γνήσιο κλάσμα (< 1)', 'Καταχρηστικό κλάσμα (> 1)', 'Ίσο με τη μονάδα (= 1)']);

  // Q3: Input - Οπτικό μοντέλο (SVG μπάρα/ορθογώνιο): Πόσα είναι τα χρωματισμένα μέρη
  const q3Total = [4, 5, 6, 8, 10][getRandomInt(0, 4)];
  const q3Filled = getRandomInt(1, q3Total - 1);
  const q3Correct = `${q3Filled}/${q3Total}`;

  // Q4: MCQ - Ποιο κλάσμα είναι ίσο με ακέραιο αριθμό
  const q4Whole = getRandomInt(2, 5);
  const q4Den = getRandomInt(2, 6);
  const q4Num = q4Whole * q4Den;
  const q4CorrectStr = `${q4Num}/${q4Den}`;
  const q4Wrongs = [
    `${q4Num + 1}/${q4Den}`,
    `${q4Num - 1}/${q4Den}`,
    `${q4Num}/${q4Den + 1}`
  ];
  const q4Options = shuffle([q4CorrectStr, ...q4Wrongs]);

  // Q5: True / False - Ο παρονομαστής δεν μπορεί να είναι 0
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Ο παρονομαστής ενός κλάσματος δεν μπορεί ποτέ να είναι ίσος με το μηδέν (0).'
    : 'Ο αριθμητής ενός κλάσματος δεν μπορεί ποτέ να είναι ίσος με το μηδέν (0).';

  // Q6: True / False - Σχέση αριθμητή και παρονομαστή στα γνήσια κλάσματα
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Σε ένα γνήσιο κλάσμα, ο αριθμητής είναι πάντοτε μικρότερος από τον παρονομαστή.'
    : 'Σε ένα γνήσιο κλάσμα, ο αριθμητής είναι πάντοτε μεγαλύτερος από τον παρονομαστή.';

  // Q7: Input - Δεκαδική τιμή απλού δεκαδικού κλάσματος (π.χ. 3/10, 7/100, 1/2, 1/4)
  const q7Pairs = [
    { num: 1, den: 2, dec: '0,5' },
    { num: 1, den: 4, dec: '0,25' },
    { num: 3, den: 4, dec: '0,75' },
    { num: 3, den: 10, dec: '0,3' },
    { num: 7, den: 10, dec: '0,7' },
    { num: 9, den: 100, dec: '0,09' }
  ];
  const q7Selected = q7Pairs[getRandomInt(0, q7Pairs.length - 1)];
  const q7Correct = q7Selected.dec;

  // Q8: MCQ - Πρόβλημα Καθημερινότητας
  const sc = shuffledScenarios[0];
  const eatenParts = getRandomInt(2, sc.parts - 2);
  const remainingParts = sc.parts - eatenParts;
  const askEaten = Math.random() > 0.5;
  const q8Prompt = askEaten
    ? `Χωρίσαμε ${sc.item} σε ${sc.parts} ίσα κομμάτια και κάποιος ${sc.eatenText} τα ${eatenParts}. Ποιο κλάσμα αντιπροσωπεύει το μέρος που καταναλώθηκε;`
    : `Χωρίσαμε ${sc.item} σε ${sc.parts} ίσα κομμάτια και φαγώθηκαν τα ${eatenParts}. Ποιο κλάσμα αντιπροσωπεύει τα κομμάτια που ${sc.remainingText};`;
  const q8CorrectNumerator = askEaten ? eatenParts : remainingParts;
  const q8CorrectStr = `${q8CorrectNumerator}/${sc.parts}`;
  const q8Wrongs = [
    `${sc.parts}/${q8CorrectNumerator}`,
    `${Math.max(1, q8CorrectNumerator - 1)}/${sc.parts}`,
    `${q8CorrectNumerator}/${sc.parts + 1}`
  ].filter(w => w !== q8CorrectStr);
  const q8Options = shuffle([q8CorrectStr, ...q8Wrongs.slice(0, 3)]);

  return {
    q1: {
      type: 'input',
      title: 'Αναγνώριση Όρων',
      prompt: q1Prompt,
      fraction: `${q1Num}/${q1Den}`,
      correct: q1Correct,
      explain: q1AskNumerator
        ? `Στο κλάσμα ${q1Num}/${q1Den}, ο αριθμητής (ο πάνω αριθμός) είναι το ${q1Num}.`
        : `Στο κλάσμα ${q1Num}/${q1Den}, ο παρονομαστής (ο κάτω αριθμός) είναι το ${q1Den}.`
    },
    q2: {
      type: 'mcq',
      title: 'Κατηγορία Κλάσματος',
      prompt: `Τι είδους κλάσμα είναι το ${q2Num}/${q2Den};`,
      options: q2Options,
      correct: q2CorrectType,
      explain: q2Type === 'proper'
        ? `Είναι γνήσιο κλάσμα επειδή ο αριθμητής (${q2Num}) είναι μικρότερος από τον παρονομαστή (${q2Den}).`
        : q2Type === 'improper'
        ? `Είναι καταχρηστικό κλάσμα επειδή ο αριθμητής (${q2Num}) είναι μεγαλύτερος από τον παρονομαστή (${q2Den}).`
        : `Είναι ίσο με τη μονάδα (= 1) επειδή ο αριθμητής και ο παρονομαστής είναι ίσοι (${q2Num}/${q2Den} ＝ 1).`
    },
    q3: {
      type: 'input',
      title: 'Οπτικό Μοντέλο',
      total: q3Total,
      filled: q3Filled,
      prompt: `Γράψε το κλάσμα που αντιστοιχεί στα χρωματισμένα μέρη του παρακάτω σχήματος (π.χ. 3/5):`,
      correct: q3Correct,
      explain: `Έχουν χρωματιστεί ${q3Filled} από τα ${q3Total} ίσα μέρη, άρα το κλάσμα είναι ${q3Filled}/${q3Total}.`
    },
    q4: {
      type: 'mcq',
      title: 'Κλάσμα & Ακέραιος',
      prompt: `Ποιο από τα παρακάτω κλάσματα ισούται ακριβώς με τον ακέραιο αριθμό ${q4Whole};`,
      options: q4Options,
      correct: q4CorrectStr,
      explain: `Η γραμμή του κλάσματος σημαίνει διαίρεση: ${q4Num} : ${q4Den} ＝ ${q4Whole}.`
    },
    q5: {
      type: 'tf',
      title: 'Ιδιότητα Παρονομαστή',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Η διαίρεση με το μηδέν δεν ορίζεται στα μαθηματικά, άρα ο παρονομαστής δεν μπορεί ποτέ να είναι 0.'
        : 'Λάθος! Ο αριθμητής ΜΠΟΡΕΙ να είναι 0 (π.χ. 0/5 ＝ 0). Ο παρονομαστής είναι αυτός που δεν μπορεί να είναι 0.'
    },
    q6: {
      type: 'tf',
      title: 'Γνήσια Κλάσματα',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Στα γνήσια κλάσματα παίρνουμε λιγότερα μέρη από όσα χωρίσαμε τη μονάδα (Αριθμητής < Παρονομαστής).'
        : 'Λάθος! Όταν ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή, το κλάσμα ονομάζεται καταχρηστικό (μη γνήσιο).'
    },
    q7: {
      type: 'input',
      title: 'Δεκαδική Αξία',
      num: q7Selected.num,
      den: q7Selected.den,
      prompt: `Γράψε τη δεκαδική τιμή του κλάσματος ${q7Selected.num}/${q7Selected.den} (π.χ. 0,5):`,
      correct: q7Correct,
      explain: `${q7Selected.num}/${q7Selected.den} ＝ ${q7Selected.num} : ${q7Selected.den} ＝ ${q7Selected.dec}.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: q8Prompt,
      options: q8Options,
      correct: q8CorrectStr,
      explain: `Το σύνολο των ίσων μερών είναι ${sc.parts} (παρονομαστής) και τα σχετικά μέρη είναι ${q8CorrectNumerator} (αριθμητής), άρα το κλάσμα είναι ${q8CorrectStr}.`
    }
  };
}

export default function KlasmaExercisesPage() {
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
      const cleanAns = a.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanCorrect = q.correct.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
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
      title="🎯 Ασκήσεις: Η Έννοια του Κλάσματος - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στην έννοια του κλάσματος για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/23-klasma" 
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
                Διαδραστικές Ασκήσεις: Η Έννοια του Κλάσματος
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα αναγνώρισης όρων, κατηγοριών κλασμάτων και οπτικών μοντέλων!
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
                  Άσκηση 1 • Αναγνώριση Όρων
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
                  placeholder="Γράψε τον αριθμό..."
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
                  Άσκηση 2 • Κατηγορία Κλάσματος
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                {questions.q2.prompt}
              </p>
              <div className="space-y-2 mb-3">
                {questions.q2.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q2', opt)}
                    className={`w-full p-2.5 rounded-xl text-xs sm:text-sm font-bold border text-left transition ${
                      answers.q2 === opt
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {submitted && (
                <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q2') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                  💡 {questions.q2.explain}
                </div>
              )}
            </div>

            {/* ΕΡΩΤΗΣΗ 3: ΟΠΤΙΚΟ ΜΟΝΤΕΛΟ */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q3')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                  Άσκηση 3 • Οπτικό Μοντέλο
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q3') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 font-medium">
                {questions.q3.prompt}
              </p>

              {/* SVG ΟΡΘΟΓΩΝΙΟ ΜΟΝΤΕΛΟ */}
              <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-3 flex gap-1 shadow-inner overflow-hidden">
                {Array.from({ length: questions.q3.total }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-10 rounded-md border border-slate-300 transition-all ${
                      i < questions.q3.filled ? 'bg-amber-500 shadow-xs' : 'bg-white'
                    }`}
                  />
                ))}
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q3}
                  onChange={(e) => handleInputChange('q3', e.target.value)}
                  placeholder="π.χ. 3/4"
                  className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-amber-500 outline-none disabled:bg-slate-100 font-mono"
                />
                {submitted && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q3') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                    💡 {questions.q3.explain}
                  </div>
                )}
              </div>
            </div>

            {/* ΕΡΩΤΗΣΗ 4 */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q4')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                  Άσκηση 4 • Κλάσμα & Ακέραιος
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
                    className={`p-3 rounded-xl text-base font-mono font-black border text-center transition ${
                      answers.q4 === opt
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
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
                  Άσκηση 7 • Δεκαδική Τιμή
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
                  placeholder="π.χ. 0,5"
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
                    className={`w-full p-2.5 rounded-xl text-sm font-mono font-black border text-center transition ${
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

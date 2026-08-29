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

// Δεξαμενή 20+ ρεαλιστικών αντικειμένων καθημερινότητας με σωστό άρθρο και γένος
const REAL_WORLD_DECIMALS = [
  { item: 'το γάλα σε λίτρα', unit: 'λ.', min: 1, max: 5 },
  { item: 'το μέλι σε κιλά', unit: 'κιλά', min: 1, max: 4 },
  { item: 'το ελαιόλαδο σε λίτρα', unit: 'λ.', min: 2, max: 10 },
  { item: 'το ύφασμα σε μέτρα', unit: 'μ.', min: 3, max: 15 },
  { item: 'το τυρί σε κιλά', unit: 'κιλά', min: 1, max: 6 },
  { item: 'η θερμοκρασία ασθενούς', unit: '°C', min: 36, max: 39 },
  { item: 'η τιμή του βιβλίου σε ευρώ', unit: '€', min: 10, max: 35 },
  { item: 'το μήκος της κορδέλας', unit: 'μ.', min: 2, max: 8 },
  { item: 'το βάρος της βαλίτσας', unit: 'κιλά', min: 12, max: 28 },
  { item: 'η απόσταση της διαδρομής', unit: 'χλμ.', min: 5, max: 45 },
  { item: 'η βενζίνη σε λίτρα', unit: 'λ.', min: 20, max: 55 },
  { item: 'το πάχος του μετάλλου σε χιλιοστά', unit: 'χιλ.', min: 1, max: 9 },
  { item: 'η τιμή του εισιτηρίου σε ευρώ', unit: '€', min: 8, max: 25 },
  { item: 'το βάρος του καρπουζιού', unit: 'κιλά', min: 4, max: 12 },
  { item: 'η διάρκεια της πτήσης σε ώρες', unit: 'ώρες', min: 1, max: 6 },
  { item: 'το ύψος του φυτού σε μέτρα', unit: 'μ.', min: 1, max: 3 },
  { item: 'η ποσότητα χυμού σε λίτρα', unit: 'λ.', min: 1, max: 4 },
  { item: 'η τιμή των φρούτων σε ευρώ', unit: '€', min: 3, max: 14 },
  { item: 'το βάρος του δέματος σε κιλά', unit: 'κιλά', min: 2, max: 9 },
  { item: 'το μήκος του καλωδίου σε μέτρα', unit: 'μ.', min: 4, max: 20 },
  { item: 'η κατανάλωση ρεύματος σε κιλοβατώρες', unit: 'kWh', min: 15, max: 60 }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledItems = shuffle(REAL_WORLD_DECIMALS);

  // Q1: Αριθμητικό Input - Αξία δεκαδικού ψηφίου (δέκατα, εκατοστά, χιλιοστά)
  const q1Int = getRandomInt(12, 85);
  const q1D = getRandomInt(1, 9);
  const q1E = getRandomInt(1, 9);
  const q1X = getRandomInt(1, 9);
  const q1DecPositions = [
    { name: 'δεκάτων', digit: q1D, valStr: `0,${q1D}`, valNum: q1D / 10, frac: `${q1D}/10` },
    { name: 'εκατοστών', digit: q1E, valStr: `0,0${q1E}`, valNum: q1E / 100, frac: `${q1E}/100` },
    { name: 'χιλιοστών', digit: q1X, valStr: `0,00${q1X}`, valNum: q1X / 1000, frac: `${q1X}/1000` }
  ];
  const q1Choice = q1DecPositions[getRandomInt(0, 2)];
  const q1FullNumStr = `${q1Int},${q1D}${q1E}${q1X}`;

  // Q2: Αριθμητικό Input - Μετατροπή Δεκαδικού Κλάσματος σε Δεκαδικό Αριθμό
  const q2DenomType = getRandomInt(1, 3); // 1: /10, 2: /100, 3: /1000
  let q2Numer = 0;
  let q2AnswerStr = '';
  let q2Denom = 10;
  if (q2DenomType === 1) {
    q2Numer = getRandomInt(15, 95);
    q2Denom = 10;
    q2AnswerStr = (q2Numer / 10).toString().replace('.', ',');
  } else if (q2DenomType === 2) {
    q2Numer = getRandomInt(105, 995);
    q2Denom = 100;
    q2AnswerStr = (q2Numer / 100).toString().replace('.', ',');
  } else {
    q2Numer = getRandomInt(1025, 9850);
    q2Denom = 1000;
    q2AnswerStr = (q2Numer / 1000).toString().replace('.', ',');
  }

  // Q3: MCQ - Σύνθεση δεκαδικού από αναπτυγμένη μορφή
  const q3M = getRandomInt(2, 9);
  const q3D = getRandomInt(1, 9);
  const q3E = getRandomInt(1, 9);
  const q3CorrectStr = `${q3M * 10},${q3D}${q3E}`;
  const q3Wrong1 = `${q3M},${q3D}${q3E}`;
  const q3Wrong2 = `${q3M * 10},0${q3D}${q3E}`;
  const q3Wrong3 = `${q3M * 100},${q3D}${q3E}`;
  const q3Options = shuffle([q3CorrectStr, q3Wrong1, q3Wrong2, q3Wrong3]);

  // Q4: MCQ - Σύγκριση / Διάταξη δεκαδικών αριθμών
  const q4BaseInt = getRandomInt(14, 48);
  const q4Opts = [
    { text: `${q4BaseInt},8`, val: q4BaseInt + 0.8 },
    { text: `${q4BaseInt},75`, val: q4BaseInt + 0.75 },
    { text: `${q4BaseInt},095`, val: q4BaseInt + 0.095 },
    { text: `${q4BaseInt},705`, val: q4BaseInt + 0.705 }
  ];
  const q4Sorted = [...q4Opts].sort((a, b) => b.val - a.val);
  const q4Correct = q4Sorted[0].text;
  const q4Options = shuffle(q4Opts.map(o => o.text));

  // Q5: True / False - Μηδενικά στο τέλος του δεκαδικού μέρους
  const q5Int = getRandomInt(3, 18);
  const q5Dec = getRandomInt(2, 8);
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? `Οι δεκαδικοί αριθμοί ${q5Int},${q5Dec} και ${q5Int},${q5Dec}00 έχουν ακριβώς την ίδια αξία.`
    : `Ο αριθμός ${q5Int},${q5Dec}00 είναι 100 φορές μεγαλύτερος από τον αριθμό ${q5Int},${q5Dec}.`;

  // Q6: True / False - Σχέση δεκάτων και εκατοστών
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? '1 δέκατο (0,1) ισοδυναμεί με 10 εκατοστά (0,10) και με 100 χιλιοστά (0,100).'
    : '1 εκατοστό (0,01) είναι 10 φορές μεγαλύτερο από 1 δέκατο (0,1).';

  // Q7: SVG Visual - Δεκαδικός Άβακας / Πίνακας Θέσεων
  const q7Units = getRandomInt(1, 4);
  const q7Tenths = getRandomInt(1, 5);
  const q7Hundr = getRandomInt(1, 6);
  const q7CorrectStr = `${q7Units},${q7Tenths}${q7Hundr}`;
  const q7Columns = [
    { label: 'Μονάδες (Μ)', count: q7Units, color: '#059669' },
    { label: 'Δέκατα (δ)', count: q7Tenths, color: '#2563eb' },
    { label: 'Εκατοστά (ε)', count: q7Hundr, color: '#9333ea' }
  ];

  // Q8: SVG Visual - Δεκαδική Αριθμογραμμή (Αναγνώριση σημείου)
  const q8Step = getRandomInt(1, 9);
  const q8CorrectVal = (3 + q8Step * 0.1).toFixed(1).replace('.', ',');
  const q8Options = shuffle([
    q8CorrectVal,
    (3 + (q8Step + 1 > 9 ? q8Step - 1 : q8Step + 1) * 0.1).toFixed(1).replace('.', ','),
    (3 + (q8Step - 1 < 1 ? q8Step + 2 : q8Step - 1) * 0.1).toFixed(1).replace('.', ','),
    `3,0${q8Step}`
  ]);

  return {
    q1: {
      type: 'input',
      title: 'Αξία Δεκαδικού Ψηφίου',
      number: q1FullNumStr,
      posName: q1Choice.name,
      digit: q1Choice.digit,
      correctStr: q1Choice.valStr,
      correctFraction: q1Choice.frac,
      correctNum: q1Choice.valNum,
      itemContext: shuffledItems[0].item,
      explain: `Το ψηφίο ${q1Choice.digit} βρίσκεται στη θέση των ${q1Choice.name}, άρα η αξία του είναι ${q1Choice.valStr} (ή ${q1Choice.frac}).`
    },
    q2: {
      type: 'input',
      title: 'Δεκαδικό Κλάσμα σε Δεκαδικό',
      numer: q2Numer,
      denom: q2Denom,
      correctStr: q2AnswerStr,
      explain: `Διαιρώντας τον αριθμητή με το ${q2Denom}, μετακινούμε την υποδιαστολή ${q2Denom === 10 ? '1 θέση' : q2Denom === 100 ? '2 θέσεις' : '3 θέσεις'} αριστερά: ${q2Numer}/${q2Denom} = ${q2AnswerStr}.`
    },
    q3: {
      type: 'mcq',
      title: 'Σύνθεση Δεκαδικού Αριθμού',
      prompt: `(${q3M} × 10) + (${q3D} × 0,1) + (${q3E} × 0,01)`,
      options: q3Options,
      correct: q3CorrectStr,
      explain: `Υπολογίζοντας τα γινόμενα: ${q3M * 10} + 0,${q3D} + 0,0${q3E} = ${q3CorrectStr}.`
    },
    q4: {
      type: 'mcq',
      title: 'Σύγκριση Δεκαδικών',
      question: 'Ποιος από τους παρακάτω δεκαδικούς αριθμούς είναι ο μεγαλύτερος;',
      options: q4Options,
      correct: q4Correct,
      explain: `Συγκρίνοντας πρώτα τα δέκατα και μετά τα εκατοστά, ο μεγαλύτερος αριθμός είναι το ${q4Correct} (αφού 8 δέκατα = 0,800 > 0,750 > 0,705).`
    },
    q5: {
      type: 'tf',
      title: 'Ισοδύναμοι Δεκαδικοί & Μηδενικά',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Η προσθήκη μηδενικών στο τέλος του δεκαδικού μέρους δεν αλλάζει την αξία του αριθμού.'
        : 'Λάθος! Τα μηδενικά στο τέλος του δεκαδικού μέρους δεν αλλάζουν την αξία (π.χ. 5,4 = 5,40 = 5,400).'
    },
    q6: {
      type: 'tf',
      title: 'Σχέσεις Δεκαδικών Μονάδων',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Κάθε δεκαδική μονάδα είναι 10 φορές μεγαλύτερη από την αμέσως δεξιά της (1 δέκατο = 10 εκατοστά = 100 χιλιοστά).'
        : 'Λάθος! Το 1 δέκατο (0,1) είναι 10 φορές ΜΕΓΑΛΥΤΕΡΟ από το 1 εκατοστό (0,01).'
    },
    q7: {
      type: 'input',
      title: 'Δεκαδικός Άβακας',
      columns: q7Columns,
      correctStr: q7CorrectStr,
      explain: `Μετρώντας τις χάντρες: ${q7Units} Μονάδες , ${q7Tenths} Δέκατα και ${q7Hundr} Εκατοστά = ${q7CorrectStr}.`
    },
    q8: {
      type: 'mcq',
      title: 'Δεκαδική Αριθμογραμμή',
      step: q8Step,
      options: q8Options,
      correct: q8CorrectVal,
      explain: `Το κόκκινο σημείο βρίσκεται ${q8Step} υποδιαιρέσεις (δέκατα) μετά το 3, άρα αντιστοιχεί στο ${q8CorrectVal}.`
    }
  };
}

export default function DekadikoiExercisesPage() {
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

      if (key === 'q1') {
        return cleanAns === q.correctStr || cleanAns === q.correctFraction;
      }
      return cleanAns === q.correctStr;
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
      title="🎯 Ασκήσεις: Δεκαδικοί Αριθμοί - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με άμεση βαθμολόγηση στους δεκαδικούς αριθμούς και τα δεκαδικά κλάσματα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/02-dekadikoi" 
          className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-emerald-200 transition shrink-0"
        >
          <span>📖</span> <span>Θεωρία</span>
        </Link>
      }
    >
      <div className="pb-28">
        {/* HEADER HERO BANNER */}
        <section className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white py-8 sm:py-10 px-4 sm:px-6 rounded-3xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-teal-100 border border-white/20">
                <span>🎯 ΣΤ' Δημοτικου • Εξασκηση</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Δεκαδικοί Αριθμοί
              </h1>
              <p className="text-teal-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα στα δέκατα, εκατοστά και χιλιοστά και δες αναλυτική εξήγηση για κάθε ερώτηση!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewQuestions}
              className="px-5 py-3 bg-white text-teal-800 hover:bg-teal-50 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm flex items-center gap-2 shrink-0"
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
                <span className="text-xs font-black px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                  Άσκηση 1 • Αξία Θέσης
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">
                Στον δεκαδικό αριθμό <strong className="text-emerald-700 text-base font-black tracking-wider">{questions.q1.number}</strong>, ποια είναι η αξία του ψηφίου των <strong className="text-slate-900 font-black">{questions.q1.posName}</strong> ({questions.q1.digit});
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q1}
                  onChange={(e) => handleInputChange('q1', e.target.value)}
                  placeholder="π.χ. 0,05 ή 5/100"
                  className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-emerald-500 outline-none disabled:bg-slate-100 font-mono"
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
                <span className="text-xs font-black px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Άσκηση 2 • Δεκαδικό Κλάσμα
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">
                Γράψε το δεκαδικό κλάσμα ως δεκαδικό αριθμό:
              </p>
              <div className="p-3 bg-slate-100 rounded-xl font-mono text-base text-center font-black text-slate-800 mb-4 flex items-center justify-center gap-2">
                <div className="inline-flex flex-col items-center leading-none">
                  <span>{questions.q2.numer}</span>
                  <div className="w-12 h-[2px] bg-slate-700 my-1"></div>
                  <span>{questions.q2.denom}</span>
                </div>
                <span className="text-slate-400 font-normal">=</span>
                <span className="text-blue-600">;</span>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q2}
                  onChange={(e) => handleInputChange('q2', e.target.value)}
                  placeholder="π.χ. 3,45"
                  className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-blue-500 outline-none disabled:bg-slate-100 font-mono"
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
                  Άσκηση 3 • Σύνθεση
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q3') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-2 leading-relaxed font-medium">
                Ποιος δεκαδικός αριθμός προκύπτει από την παρακάτω αναπτυγμένη μορφή;
              </p>
              <div className="p-2.5 bg-slate-100 rounded-xl font-mono text-xs text-center font-bold text-slate-800 mb-3 overflow-x-auto">
                {questions.q3.prompt}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {questions.q3.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q3', opt)}
                    className={`p-3 rounded-xl text-xs font-mono font-bold border text-center transition ${
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
                  Άσκηση 4 • Σύγκριση
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q4') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">
                {questions.q4.question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {questions.q4.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q4', opt)}
                    className={`p-3 rounded-xl text-xs font-mono font-bold border text-center transition ${
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
                  Άσκηση 7 • Δεκαδικός Άβακας
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-2 font-medium">
                Ποιον δεκαδικό αριθμό δείχνει ο άβακας;
              </p>
              
              <div className="bg-slate-100 rounded-2xl p-3 mb-4 flex justify-center overflow-x-auto">
                <svg viewBox="0 0 300 120" className="w-full max-w-xs h-28 shrink-0 select-none">
                  <line x1="20" y1="105" x2="280" y2="105" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
                  {questions.q7.columns.map((col, idx) => {
                    const x = 55 + idx * 95;
                    return (
                      <g key={idx}>
                        <line x1={x} y1="20" x2={x} y2="105" stroke="#94a3b8" strokeWidth="2" />
                        {[...Array(col.count)].map((_, beadIdx) => (
                          <circle
                            key={beadIdx}
                            cx={x}
                            cy={100 - beadIdx * 12}
                            r="5.5"
                            fill={col.color}
                          />
                        ))}
                        <text x={x} y="118" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#334155">
                          {col.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q7}
                  onChange={(e) => handleInputChange('q7', e.target.value)}
                  placeholder="π.χ. 3,45"
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
                  Άσκηση 8 • Αριθμογραμμή
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q8') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-2 font-medium">
                Ποιο είναι το δεκαδικό νούμερο στη θέση του κόκκινου δείκτη;
              </p>

              <div className="bg-slate-100 p-3 rounded-xl mb-3 flex items-center justify-center overflow-x-auto">
                <svg viewBox="0 0 320 80" className="w-full max-w-sm h-20 shrink-0 select-none">
                  <line x1="20" y1="45" x2="300" y2="45" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Tick marks 3.0 to 4.0 */}
                  {[...Array(11)].map((_, idx) => {
                    const x = 30 + idx * 26;
                    const isMain = idx === 0 || idx === 10;
                    return (
                      <g key={idx}>
                        <line
                          x1={x}
                          y1={isMain ? 32 : 38}
                          x2={x}
                          y2={isMain ? 58 : 52}
                          stroke="#475569"
                          strokeWidth={isMain ? "2.5" : "1.5"}
                        />
                        {isMain && (
                          <text x={x} y="72" fontSize="11" fontWeight="black" textAnchor="middle" fill="#0f172a">
                            {idx === 0 ? '3,0' : '4,0'}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Red Target Marker */}
                  <g>
                    <circle cx={30 + questions.q8.step * 26} cy="45" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                    <text x={30 + questions.q8.step * 26} y="22" fontSize="11" fontWeight="black" textAnchor="middle" fill="#dc2626">
                      ▼
                    </text>
                  </g>
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
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

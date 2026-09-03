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

// Δημιουργία 6ψήφιου αριθμού με μοναδικά ψηφία ώστε κάθε ψηφίο να εμφανίζεται μόνο 1 φορά
function generateUniqueDigitsNumber() {
  const firstDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const allDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  const d0 = firstDigits[getRandomInt(0, firstDigits.length - 1)];
  const remaining = allDigits.filter(d => d !== d0);
  const shuffled = shuffle(remaining);
  
  const chosen = [d0, ...shuffled.slice(0, 5)];
  return Number(chosen.join(''));
}

// Δεξαμενή θεματικών σεναρίων καθημερινότητας
const REAL_WORLD_POOLS = [
  { item: 'εισιτήρια συναυλιών', val: 125000, desc: 'πωλήθηκαν σε όλο τον κόσμο' },
  { item: 'βιβλία της βιβλιοθήκης', val: 340500, desc: 'καταγράφηκαν στο σύστημα' },
  { item: 'δέντρα στο δάσος', val: 7890000, desc: 'φυτεύτηκαν στο πρόγραμμα αναδάσωσης' },
  { item: 'κάτοικοι της περιφέρειας', val: 2450000, desc: 'απογράφηκαν φέτος' },
  { item: 'χιλιόμετρα ταξιδιού', val: 384400, desc: 'είναι η απόσταση Γης - Σελήνης' },
  { item: 'ευρώ προϋπολογισμού', val: 15400000, desc: 'εγκρίθηκαν για νέα σχολεία' },
  { item: 'επισκέπτες του μουσείου', val: 620000, desc: 'ξεναγήθηκαν τη φετινή χρονιά' },
  { item: 'προβολές βίντεο', val: 89300000, desc: 'έγιναν στην εκπαιδευτική πλατφόρμα' }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  // Q1: Αριθμητικό Input - Εξασφάλιση ότι το ψηφίο υπάρχει ΜΟΝΟ μία φορά
  const q1NumBase = generateUniqueDigitsNumber();
  const q1Digits = q1NumBase.toString().split('');
  const q1TargetPos = getRandomInt(0, 3);
  const q1TargetDigit = Number(q1Digits[q1TargetPos]);
  const q1Power = q1Digits.length - 1 - q1TargetPos;
  const q1Answer = q1TargetDigit * Math.pow(10, q1Power);
  const q1PositionName = [
    'Εκατοντάδων Χιλιάδων',
    'Δεκάδων Χιλιάδων',
    'Μονάδων Χιλιάδων',
    'Εκατοντάδων'
  ][q1TargetPos];

  // Q2: Αριθμητικό Input - Σύνθεση αριθμού από αναπτυγμένη μορφή
  const q2A = getRandomInt(2, 8);
  const q2B = getRandomInt(1, 9);
  const q2C = getRandomInt(3, 9);
  const q2D = getRandomInt(1, 9);
  const q2Answer = q2A * 1000000 + q2B * 100000 + q2C * 1000 + q2D;
  const q2Prompt = `${q2A} × 1.000.000 + ${q2B} × 100.000 + ${q2C} × 1.000 + ${q2D} × 1`;

  // Q3: MCQ - Σε ποια περίοδο ανήκει η συγκεκριμένη ομάδα ψηφίων
  const q3MillionPart = getRandomInt(12, 85);
  const q3ThousandPart = getRandomInt(100, 999);
  const q3UnitsPart = getRandomInt(100, 999);
  const q3FullNumber = q3MillionPart * 1000000 + q3ThousandPart * 1000 + q3UnitsPart;
  const q3CorrectOption = "Περίοδος Εκατομμυρίων";
  const q3Options = shuffle([
    "Περίοδος Εκατομμυρίων",
    "Περίοδος Χιλιάδων",
    "Περίοδος Μονάδων",
    "Περίοδος Δισεκατομμυρίων"
  ]);

  // Q4: MCQ - Σύγκριση / Διάταξη μεγάλων αριθμών
  const q4Base = getRandomInt(450, 750) * 10000;
  const q4OptsList = [
    { text: formatNumber(q4Base + 12000), val: q4Base + 12000 },
    { text: formatNumber(q4Base + 9500), val: q4Base + 9500 },
    { text: formatNumber(q4Base + 45000), val: q4Base + 45000 },
    { text: formatNumber(q4Base - 8000), val: q4Base - 8000 }
  ];
  const q4Sorted = [...q4OptsList].sort((a, b) => b.val - a.val);
  const q4Correct = q4Sorted[0].text;
  const q4Options = shuffle(q4OptsList.map(o => o.text));

  // Q5: True / False - Αξία θέσης & πολλαπλασιασμός με το 10
  const q5Mult = 10;
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? `Σε έναν φυσικό αριθμό, κάθε ψηφίο έχει ${q5Mult} φορές μεγαλύτερη αξία από το ίδιο ψηφίο που βρίσκεται ακριβώς στα δεξιά του.`
    : `Σε έναν φυσικό αριθμό, κάθε ψηφίο έχει ${q5Mult} φορές ΜΙΚΡΟΤΕΡΗ αξία από το ίδιο ψηφίο που βρίσκεται ακριβώς στα δεξιά του.`;

  // Q6: True / False - Μηδενικά και αξία
  const q6IsTrue = Math.random() > 0.5;
  const q6NumberExample = getRandomInt(20, 80) * 1000;
  const q6Text = q6IsTrue
    ? `Τα μηδενικά στο τέλος του αριθμού ${formatNumber(q6NumberExample)} καθορίζουν την αξία θέσης των προηγούμενων ψηφίων.`
    : `Τα μηδενικά στην αρχή ενός φυσικού αριθμού (π.χ. 00${formatNumber(q6NumberExample)}) αλλάζουν και μεγαλώνουν την αξία του.`;

  // Q7: SVG Visual - Πλήρης Άβακας 7 Θέσεων
  const q7M = getRandomInt(1, 4);
  const q7EX = getRandomInt(0, 5);
  const q7DX = getRandomInt(0, 6);
  const q7MX = getRandomInt(0, 7);
  const q7E = getRandomInt(0, 8);
  const q7D = getRandomInt(0, 8);
  const q7Units = getRandomInt(1, 9);

  const q7Val = q7M * 1000000 + q7EX * 100000 + q7DX * 10000 + q7MX * 1000 + q7E * 100 + q7D * 10 + q7Units;
  
  const q7Columns = [
    { label: 'Εκ.', count: q7M, color: '#e11d48', name: 'Εκατομμύρια' },
    { label: 'Ε.Χ.', count: q7EX, color: '#2563eb', name: 'Εκατοντάδες Χιλιάδων' },
    { label: 'Δ.Χ.', count: q7DX, color: '#0284c7', name: 'Δεκάδες Χιλιάδων' },
    { label: 'Μ.Χ.', count: q7MX, color: '#06b6d4', name: 'Μονάδες Χιλιάδων' },
    { label: 'Ε.', count: q7E, color: '#059669', name: 'Εκατοντάδες' },
    { label: 'Δ.', count: q7D, color: '#d97706', name: 'Δεκάδες' },
    { label: 'Μ.', count: q7Units, color: '#7c3aed', name: 'Μονάδες' }
  ];

  // Q8: MCQ - Επιλογή σωστής ανάλυσης από τον αριθμό (χωρίς το προδοτικό πλαίσιο)
  const q8Millions = getRandomInt(3, 9);
  const q8Thousands = getRandomInt(120, 850);
  const q8Number = q8Millions * 1000000 + q8Thousands * 1000;
  const q8CorrectAnswer = `${q8Millions} εκατομμύρια και ${q8Thousands} χιλιάδες`;
  const q8Options = shuffle([
    `${q8Millions} εκατομμύρια και ${q8Thousands} χιλιάδες`,
    `${q8Millions * 10} εκατομμύρια και ${q8Thousands} μονάδες`,
    `${q8Millions} δισεκατομμύρια και ${q8Thousands} χιλιάδες`,
    `${q8Millions} εκατομμύρια και ${q8Thousands * 10} χιλιάδες`
  ]);

  return {
    q1: {
      type: 'input',
      title: 'Αξία Θέσης Ψηφίου',
      number: formatNumber(q1NumBase),
      digit: q1TargetDigit,
      posName: q1PositionName,
      correct: q1Answer,
      explain: `Το ψηφίο ${q1TargetDigit} βρίσκεται στη θέση των ${q1PositionName}, άρα η αξία του είναι ${q1TargetDigit} × ${formatNumber(Math.pow(10, q1Power))} = ${formatNumber(q1Answer)}.`
    },
    q2: {
      type: 'input',
      title: 'Σύνθεση Αριθμού',
      prompt: q2Prompt,
      correct: q2Answer,
      explain: `Υπολογίζοντας το άθροισμα: ${formatNumber(q2A * 1000000)} + ${formatNumber(q2B * 100000)} + ${formatNumber(q2C * 1000)} + ${formatNumber(q2D * 1)} = ${formatNumber(q2Answer)}.`
    },
    q3: {
      type: 'mcq',
      title: 'Αναγνώριση Περιόδου',
      number: formatNumber(q3FullNumber),
      targetDigits: formatNumber(q3MillionPart),
      options: q3Options,
      correct: q3CorrectOption,
      explain: `Τα ψηφία ${formatNumber(q3MillionPart)} βρίσκονται στην 3η τριάδα από τα δεξιά, η οποία είναι η Περίοδος των Εκατομμυρίων.`
    },
    q4: {
      type: 'mcq',
      title: 'Σύγκριση Μεγάλων Αριθμών',
      question: 'Ποιος από τους παρακάτω αριθμούς είναι ο μεγαλύτερος;',
      options: q4Options,
      correct: q4Correct,
      explain: `Συγκρίνοντας τα ψηφία από τα αριστερά προς τα δεξιά, ο μεγαλύτερος αριθμός είναι το ${q4Correct}.`
    },
    q5: {
      type: 'tf',
      title: 'Δεκαδικό Σύστημα Αρίθμησης',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue 
        ? 'Το σύστημα αρίθμησης είναι δεκαδικό, άρα κάθε θέση αριστερά έχει 10πλάσια αξία.'
        : 'Κάθε θέση προς τα αριστερά έχει 10 φορές ΜΕΓΑΛΥΤΕΡΗ (και όχι μικρότερη) αξία.'
    },
    q6: {
      type: 'tf',
      title: 'Ο Ρόλος του Μηδενός',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Τα μηδενικά στο τέλος κρατούν τις θέσεις (τάξεις) ώστε τα υπόλοιπα ψηφία να έχουν τη σωστή αξία.'
        : 'Τα μηδενικά στην αρχή ενός ακεραίου αριθμού (leading zeros) δεν έχουν καμία αξία και δεν τον αλλάζουν.'
    },
    q7: {
      type: 'input',
      title: 'Οπτικός Άβακας Αξίας Θέσης',
      columns: q7Columns,
      correct: q7Val,
      explain: `Διαβάζοντας τις χάντρες από αριστερά προς τα δεξιά (βάζοντας 0 στις κενές θέσεις): ${formatNumber(q7Val)}.`
    },
    q8: {
      type: 'mcq',
      title: 'Ανάλυση Περιόδων',
      number: formatNumber(q8Number),
      millions: q8Millions,
      thousands: q8Thousands,
      options: q8Options,
      correct: q8CorrectAnswer,
      explain: `Ο αριθμός ${formatNumber(q8Number)} αποτελείται ακριβώς από ${q8Millions} εκατομμύρια και ${q8Thousands} χιλιάδες.`
    }
  };
}

export default function FysikoiArithmoiExercisesPage() {
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
      const cleanAns = String(a).replace(/\./g, '').trim();
      return cleanAns !== '' && Number(cleanAns) === q.correct;
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
      title="🎯 Ασκήσεις: Φυσικοί Αριθμοί - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στους φυσικούς αριθμούς για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/01-fysikoi" 
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span> <span>Θεωρία</span>
        </Link>
      }
    >
      <div className="pb-28">
        {/* HEADER HERO BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-8 sm:py-10 px-4 sm:px-6 rounded-3xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-emerald-100 border border-white/20">
                <span>🎯 ΣΤ' Δημοτικου • Εξασκηση</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Φυσικοί Αριθμοί
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα, έλεγξε τις γνώσεις σου και δες την αναλυτική εξήγηση σε κάθε απάντηση!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewQuestions}
              className="px-5 py-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm flex items-center gap-2 shrink-0"
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
                  Άσκηση 1 • Αξία Θέσης
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">
                Στον αριθμό <strong className="text-blue-700 text-base font-black tracking-wider">{questions.q1.number}</strong>, ποια είναι η πραγματική αριθμητική αξία του ψηφίου <strong className="text-emerald-700 text-base font-black">{questions.q1.digit}</strong>;
              </p>
              <div className="space-y-3">
                <input
                  id="ex-fysikoi-q1"
                  name="exFysikoiQ1"
                  autoComplete="off"
                  type="text"
                  inputMode="numeric"
                  disabled={submitted}
                  value={answers.q1}
                  onChange={(e) => handleInputChange('q1', e.target.value)}
                  placeholder="π.χ. 70000"
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
                  Άσκηση 2 • Σύνθεση Αριθμού
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">
                Ποιος φυσικός αριθμός προκύπτει από την παρακάτω αναπτυγμένη μορφή;
              </p>
              <div className="p-3 bg-slate-100 rounded-xl font-mono text-xs text-center font-bold text-slate-800 mb-4 overflow-x-auto">
                {questions.q2.prompt}
              </div>
              <div className="space-y-3">
                <input
                  id="ex-fysikoi-q2"
                  name="exFysikoiQ2"
                  autoComplete="off"
                  type="text"
                  inputMode="numeric"
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
                  Άσκηση 3 • Περίοδοι
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q3') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">
                Στον αριθμό <strong className="text-purple-700 text-base font-black">{questions.q3.number}</strong>, σε ποια περίοδο ανήκουν τα ψηφία <strong className="text-slate-900 font-black underline">{questions.q3.targetDigits}</strong>;
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {questions.q3.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q3', opt)}
                    className={`p-3 rounded-xl text-xs font-bold border text-left transition ${
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
                    className={`p-3 rounded-xl text-xs font-bold border text-center transition ${
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

            {/* ΕΡΩΤΗΣΗ 7: Οπτικός Άβακας */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q7')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-rose-100 text-rose-800 rounded-full">
                  Άσκηση 7 • Οπτικός Άβακας
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-2 font-medium">
                Ποιον φυσικό αριθμό αναπαριστά ο παρακάτω άβακας;
              </p>
              
              <div className="bg-slate-100 rounded-2xl p-3 mb-4 flex justify-center overflow-x-auto">
                <svg viewBox="0 0 350 130" className="w-full max-w-sm h-32 shrink-0 select-none">
                  {/* Base */}
                  <line x1="15" y1="110" x2="335" y2="110" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                  
                  {questions.q7.columns.map((col, idx) => {
                    const x = 32 + idx * 48;
                    return (
                      <g key={idx}>
                        {/* Rod */}
                        <line x1={x} y1="20" x2={x} y2="110" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                        
                        {/* Beads */}
                        {[...Array(col.count)].map((_, beadIdx) => (
                          <circle
                            key={beadIdx}
                            cx={x}
                            cy={104 - beadIdx * 9.5}
                            r="4.2"
                            fill={col.color}
                            stroke="#ffffff"
                            strokeWidth="0.8"
                          />
                        ))}

                        {/* Class Label */}
                        <text x={x} y="124" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#334155">
                          {col.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="space-y-3">
                <input
                  id="ex-fysikoi-q7"
                  name="exFysikoiQ7"
                  autoComplete="off"
                  type="text"
                  inputMode="numeric"
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

            {/* ΕΡΩΤΗΣΗ 8: Ανάλυση Περιόδων (χωρίς το ενδιάμεσο πλαίσιο) */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q8')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-teal-100 text-teal-800 rounded-full">
                  Άσκηση 8 • Ανάλυση Περιόδων
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q8') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-4 font-medium leading-relaxed">
                Ποια είναι η σωστή περιγραφή του αριθμού <strong className="text-teal-700 text-base font-black">{questions.q8.number}</strong>;
              </p>

              <div className="space-y-2 mb-3">
                {questions.q8.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q8', opt)}
                    className={`w-full p-3 rounded-xl text-xs sm:text-sm font-bold border text-left transition ${
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
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
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

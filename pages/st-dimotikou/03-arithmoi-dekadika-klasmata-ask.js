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

// Δεξαμενή 20+ θεματικών αντικειμένων καθημερινότητας με σωστά άρθρα και μονάδες
const REAL_WORLD_FRACTIONS = [
  { item: 'η πορτοκαλάδα στο μπουκάλι', unit: 'λ.' },
  { item: 'το αλεύρι για το κέικ', unit: 'κιλά' },
  { item: 'η κορδέλα της συσκευασίας', unit: 'μ.' },
  { item: 'το ελαιόλαδο στη σαλάτα', unit: 'λ.' },
  { item: 'το τυρί φέτα', unit: 'κιλά' },
  { item: 'το ύφασμα για την κουρτίνα', unit: 'μ.' },
  { item: 'η ποσότητα μελιού', unit: 'κιλά' },
  { item: 'το νερό στο παγούρι', unit: 'λ.' },
  { item: 'το πάχος του ξύλου', unit: 'μ.' },
  { item: 'το βάρος της ζύμης', unit: 'κιλά' },
  { item: 'το γάλα στο ποτήρι', unit: 'λ.' },
  { item: 'το καλώδιο φόρτισης', unit: 'μ.' },
  { item: 'η ποσότητα κακάο', unit: 'κιλά' },
  { item: 'ο φρεσκοστυμμένος χυμός', unit: 'λ.' },
  { item: 'το βάρος του μήλου', unit: 'κιλά' },
  { item: 'το μήκος του σύρματος', unit: 'μ.' },
  { item: 'το σιρόπι σοκολάτας', unit: 'λ.' },
  { item: 'το βούτυρο για τα μπισκότα', unit: 'κιλά' },
  { item: 'το λάστιχο ποτίσματος', unit: 'μ.' },
  { item: 'το ρόφημα βοτάνων', unit: 'λ.' },
  { item: 'η ποσότητα ρυζιού', unit: 'κιλά' }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledItems = shuffle(REAL_WORLD_FRACTIONS);

  // Q1: Input - Μετατροπή Δεκαδικού σε Δεκαδικό Κλάσμα (Εύρεση Αριθμητή)
  const q1DenomPool = [10, 100, 1000];
  const q1Denom = q1DenomPool[getRandomInt(0, 2)];
  let q1Numer = 0;
  let q1DecStr = '';

  if (q1Denom === 10) {
    q1Numer = getRandomInt(1, 9);
    q1DecStr = `0,${q1Numer}`;
  } else if (q1Denom === 100) {
    q1Numer = getRandomInt(11, 89);
    q1DecStr = `0,${q1Numer}`;
  } else {
    q1Numer = getRandomInt(105, 750);
    q1DecStr = `0,${q1Numer}`;
  }

  // Q2: Input - Μετατροπή Δεκαδικού Κλάσματος σε Δεκαδικό Αριθμό
  const q2DenomType = getRandomInt(1, 3);
  let q2Numer = 0;
  let q2Denom = 10;
  let q2DecAnswer = '';

  if (q2DenomType === 1) {
    q2Numer = getRandomInt(3, 9);
    q2Denom = 10;
    q2DecAnswer = `0,${q2Numer}`;
  } else if (q2DenomType === 2) {
    q2Numer = getRandomInt(5, 95);
    q2Denom = 100;
    q2DecAnswer = (q2Numer / 100).toFixed(2).replace('.', ',');
  } else {
    q2Numer = getRandomInt(12, 650);
    q2Denom = 1000;
    q2DecAnswer = (q2Numer / 1000).toFixed(3).replace('.', ',');
  }

  // Q3: MCQ - Επιλογή ισοδύναμου δεκαδικού κλάσματος
  const q3DecVal = getRandomInt(1, 9) / 10;
  const q3DecStr = q3DecVal.toFixed(1).replace('.', ',');
  const q3CorrectFrac = `${Math.round(q3DecVal * 100)}/100`;
  const q3Wrong1 = `${Math.round(q3DecVal * 10)}/100`;
  const q3Wrong2 = `${Math.round(q3DecVal * 100)}/10`;
  const q3Wrong3 = `${Math.round(q3DecVal * 1000)}/100`;
  const q3Options = shuffle([q3CorrectFrac, q3Wrong1, q3Wrong2, q3Wrong3]);

  // Q4: MCQ - Σύγκριση Δεκαδικού με Δεκαδικό Κλάσμα
  const q4Tenths = getRandomInt(4, 8);
  const q4FracVal = q4Tenths / 10;
  const q4DecMore = ((q4Tenths + 1) / 10).toFixed(1).replace('.', ',');
  const q4DecEqual = (q4Tenths / 10).toFixed(2).replace('.', ',');
  const q4DecLess = ((q4Tenths - 2) / 10).toFixed(1).replace('.', ',');
  const q4Question = `Ποιος δεκαδικός αριθμός είναι ΊΣΟΣ με το δεκαδικό κλάσμα ${q4Tenths * 10}/100;`;
  const q4Options = shuffle([q4DecEqual, q4DecMore, q4DecLess, `0,0${q4Tenths}`]);

  // Q5: True / False - Κανόνας μετατροπής και πλήθος μηδενικών
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στο κλάσμα 45/100, ο παρονομαστής έχει 2 μηδενικά, άρα ο δεκαδικός αριθμός (0,45) έχει ακριβώς 2 δεκαδικά ψηφία.'
    : 'Στο κλάσμα 45/100, ο παρονομαστής έχει 2 μηδενικά, άρα ο δεκαδικός αριθμός θα είναι το 4,5 (1 δεκαδικό ψηφίο).';

  // Q6: True / False - Ισοδυναμία κλασμάτων με διαφορετικούς παρονομαστές
  const q6Num = getRandomInt(2, 7);
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? `Τα κλάσματα ${q6Num}/10 και ${q6Num * 10}/100 εκφράζουν ακριβώς την ίδια ποσότητα (0,${q6Num}).`
    : `Το κλάσμα ${q6Num * 10}/100 είναι 10 φορές μεγαλύτερο από το κλάσμα ${q6Num}/10.`;

  // Q7: SVG Visual - Λωρίδα δεκάτων (Οπτικό Κλάσμα)
  const q7Count = getRandomInt(2, 8);
  const q7DecAns = `0,${q7Count}`;

  // Q8: SVG Visual - Πλέγμα 100 τετραγώνων (Εκατοστά)
  const q8Tens = getRandomInt(2, 6);
  const q8Units = getRandomInt(1, 8);
  const q8TotalSquares = q8Tens * 10 + q8Units;
  const q8DecCorrect = (q8TotalSquares / 100).toFixed(2).replace('.', ',');
  const q8FracCorrect = `${q8TotalSquares}/100`;
  const q8Options = shuffle([
    q8DecCorrect,
    (q8TotalSquares / 10).toFixed(1).replace('.', ','),
    `0,0${q8TotalSquares}`,
    ((q8TotalSquares + 10) / 100).toFixed(2).replace('.', ',')
  ]);

  return {
    q1: {
      type: 'input',
      title: 'Δεκαδικός σε Κλάσμα',
      decStr: q1DecStr,
      denom: q1Denom,
      correctNumer: q1Numer,
      itemContext: shuffledItems[0].item,
      explain: `Ο αριθμός ${q1DecStr} έχει ${q1Denom === 10 ? '1 δεκαδικό ψηφίο' : q1Denom === 100 ? '2 δεκαδικά ψηφία' : '3 δεκαδικά ψηφία'}, άρα ${q1DecStr} = ${q1Numer}/${q1Denom}. Ο αριθμητής είναι το ${q1Numer}.`
    },
    q2: {
      type: 'input',
      title: 'Κλάσμα σε Δεκαδικό',
      numer: q2Numer,
      denom: q2Denom,
      correctStr: q2DecAnswer,
      explain: `Διαιρώντας το ${q2Numer} με το ${q2Denom} (${q2Denom === 10 ? '1 μηδενικό' : q2Denom === 100 ? '2 μηδενικά' : '3 μηδενικά'}), βρίσκουμε ${q2Numer}/${q2Denom} = ${q2DecAnswer}.`
    },
    q3: {
      type: 'mcq',
      title: 'Ισοδύναμα Δεκαδικά Κλάσματα',
      decStr: q3DecStr,
      options: q3Options,
      correct: q3CorrectFrac,
      explain: `Το ${q3DecStr} ισούται με ${Math.round(q3DecVal * 10)}/10. Πολλαπλασιάζοντας αριθμητή και παρονομαστή με το 10, προκύπτει το ισοδύναμο κλάσμα ${q3CorrectFrac}.`
    },
    q4: {
      type: 'mcq',
      title: 'Σύγκριση & Ισοδυναμία',
      question: q4Question,
      options: q4Options,
      correct: q4DecEqual,
      explain: `Το κλάσμα ${q4Tenths * 10}/100 ισούται με ${q4Tenths}/10 = ${q4DecEqual}.`
    },
    q5: {
      type: 'tf',
      title: 'Κανόνας των Μηδενικών',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Το πλήθος των μηδενικών στον δεκαδικό παρονομαστή καθορίζει ακριβώς το πλήθος των δεκαδικών ψηφίων.'
        : 'Λάθος! 45/100 σημαίνει 2 μηδενικά στον παρονομαστή, άρα 2 δεκαδικά ψηφία: 0,45.'
    },
    q6: {
      type: 'tf',
      title: 'Ισοδυναμία Μορφών',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Προσθέτοντας ένα μηδενικό στον αριθμητή και στον παρονομαστή (ή στο τέλος του δεκαδικού) η αξία παραμένει ακριβώς η ίδια.'
        : `Λάθος! ${q6Num}/10 και ${q6Num * 10}/100 είναι ισοδύναμα κλάσματα (εκφράζουν και τα δύο το 0,${q6Num}).`
    },
    q7: {
      type: 'input',
      title: 'Οπτική Λωρίδα Δεκάτων',
      count: q7Count,
      correctStr: q7DecAns,
      explain: `Στη λωρίδα έχουν χρωματιστεί ${q7Count} από τα 10 ίσα μέρη, δηλαδή ${q7Count}/10 = ${q7DecAns}.`
    },
    q8: {
      type: 'mcq',
      title: 'Οπτικό Πλέγμα Εκατοστών',
      count: q8TotalSquares,
      options: q8Options,
      correct: q8DecCorrect,
      explain: `Στο πλέγμα 10x10 (100 κουτάκια) έχουν χρωματιστεί ${q8TotalSquares} κουτάκια, άρα ${q8FracCorrect} = ${q8DecCorrect}.`
    }
  };
}

export default function MetatropiExercisesPage() {
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
        return cleanAns === String(q.correctNumer);
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between pb-32">
      <Head>
        <title>🎯 Ασκήσεις: Δεκαδικοί & Κλάσματα - ΣΤ' Δημοτικού | LearnMaths.gr</title>
        <meta name="description" content="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στη μετατροπή δεκαδικών αριθμών σε δεκαδικά κλάσματα για τη ΣΤ' Δημοτικού." />
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
                href="/st-dimotikou/03-arithmoi-dekadika-klasmata" 
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
                Διαδραστικές Ασκήσεις: Δεκαδικοί & Κλάσματα
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-xl">
                Λύσε τα 8 δυναμικά προβλήματα μετατροπής και οπτικών μοντέλων και δες την αναλυτική εξήγηση σε κάθε απάντηση!
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

              {/* ΕΡΩΤΗΣΗ 1: Αριθμητικό Input (Δεκαδικός σε Κλάσμα - Εύρεση Αριθμητή) */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q1')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Άσκηση 1 • Σε Δεκαδικό Κλάσμα
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  Συμπλήρωσε τον <strong>αριθμητή</strong> ώστε να ισχύει η ισότητα:
                </p>
                <div className="p-3 bg-slate-100 rounded-xl font-mono text-lg text-center font-black text-slate-800 mb-4 flex items-center justify-center gap-3">
                  <span className="text-blue-700">{questions.q1.decStr}</span>
                  <span className="text-slate-400">=</span>
                  <div className="inline-flex flex-col items-center leading-none">
                    <span className="text-emerald-600">;</span>
                    <div className="w-12 h-[2px] bg-slate-700 my-1"></div>
                    <span className="text-slate-700">{questions.q1.denom}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q1}
                    onChange={(e) => handleInputChange('q1', e.target.value)}
                    placeholder="Γράψε τον αριθμητή..."
                    className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-blue-500 outline-none disabled:bg-slate-100 font-mono"
                  />
                  {submitted && (
                    <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q1') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                      💡 {questions.q1.explain}
                    </div>
                  )}
                </div>
              </div>

              {/* ΕΡΩΤΗΣΗ 2: Αριθμητικό Input (Κλάσμα σε Δεκαδικό) */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q2')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                    Άσκηση 2 • Σε Δεκαδικό Αριθμό
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                  Γράψε το δεκαδικό κλάσμα ως δεκαδικό αριθμό:
                </p>
                <div className="p-3 bg-slate-100 rounded-xl font-mono text-lg text-center font-black text-slate-800 mb-4 flex items-center justify-center gap-3">
                  <div className="inline-flex flex-col items-center leading-none">
                    <span className="text-emerald-700">{questions.q2.numer}</span>
                    <div className="w-12 h-[2px] bg-slate-700 my-1"></div>
                    <span className="text-slate-700">{questions.q2.denom}</span>
                  </div>
                  <span className="text-slate-400">=</span>
                  <span className="text-indigo-600">;</span>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q2}
                    onChange={(e) => handleInputChange('q2', e.target.value)}
                    placeholder="π.χ. 0,45"
                    className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono"
                  />
                  {submitted && (
                    <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q2') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                      💡 {questions.q2.explain}
                    </div>
                  )}
                </div>
              </div>

              {/* ΕΡΩΤΗΣΗ 3: MCQ (Ισοδύναμα Κλάσματα) */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q3')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                    Άσκηση 3 • Ισοδυναμία
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q3') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">
                  Ποιο από τα παρακάτω δεκαδικά κλάσματα είναι ΊΣΟ με τον αριθμό <strong className="text-purple-700 font-black font-mono text-base">{questions.q3.decStr}</strong>;
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

              {/* ΕΡΩΤΗΣΗ 4: MCQ (Σύγκριση Μορφών) */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q4')}`}>
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

              {/* ΕΡΩΤΗΣΗ 5: True/False (Κανόνας Μηδενικών) */}
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

              {/* ΕΡΩΤΗΣΗ 6: True/False (Ισοδυναμία) */}
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

              {/* ΕΡΩΤΗΣΗ 7: Οπτικό SVG (Λωρίδα Δεκάτων) */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q7')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-rose-100 text-rose-800 rounded-full">
                    Άσκηση 7 • Οπτική Λωρίδα
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 font-medium">
                  Ποιον δεκαδικό αριθμό εκφράζει το χρωματισμένο μέρος της μονάδας;
                </p>
                
                {/* SVG 10 Strips Bar */}
                <div className="bg-slate-100 rounded-2xl p-4 mb-4 flex justify-center">
                  <svg viewBox="0 0 300 40" className="w-full max-w-xs h-12">
                    <rect x="0" y="0" width="300" height="40" rx="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
                    {[...Array(10)].map((_, i) => (
                      <rect
                        key={i}
                        x={i * 30}
                        y="0"
                        width="30"
                        height="40"
                        fill={i < questions.q7.count ? '#f59e0b' : 'transparent'}
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={submitted}
                    value={answers.q7}
                    onChange={(e) => handleInputChange('q7', e.target.value)}
                    placeholder="π.χ. 0,4"
                    className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-rose-500 outline-none disabled:bg-slate-100 font-mono"
                  />
                  {submitted && (
                    <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q7') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                      💡 {questions.q7.explain}
                    </div>
                  )}
                </div>
              </div>

              {/* ΕΡΩΤΗΣΗ 8: Οπτικό SVG (Πλέγμα 100 Εκατοστών) */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q8')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-teal-100 text-teal-800 rounded-full">
                    Άσκηση 8 • Πλέγμα Εκατοστών
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q8') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-3 font-medium">
                  Ποιον δεκαδικό αριθμό δείχνει το παρακάτω πλέγμα 100 τετραγώνων;
                </p>

                {/* SVG 100 Grid */}
                <div className="bg-slate-100 p-3 rounded-2xl mb-3 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-28 h-28 bg-white border border-slate-300 rounded shadow-sm">
                    {[...Array(100)].map((_, idx) => {
                      const r = Math.floor(idx / 10);
                      const c = idx % 10;
                      const isFilled = idx < questions.q8.count;
                      return (
                        <rect
                          key={idx}
                          x={c * 10}
                          y={r * 10}
                          width="10"
                          height="10"
                          fill={isFilled ? '#059669' : '#ffffff'}
                          stroke="#e2e8f0"
                          strokeWidth="0.5"
                        />
                      );
                    })}
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

            {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ (ΜΕΣΑ ΣΤΟ MAIN) */}
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

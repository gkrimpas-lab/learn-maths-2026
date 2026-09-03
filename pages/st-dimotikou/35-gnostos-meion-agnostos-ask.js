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

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Δεξαμενή σεναρίων καθημερινότητας με δυναμική παραγωγή τυχαίων αριθμών
const SCENARIO_TEMPLATES = [
  {
    generate: () => {
      const a = getRandomInt(45, 95);
      const b = getRandomInt(15, a - 15);
      const x = a - b;
      return {
        prompt: `Ο Γιώργος είχε ${a} ευρώ. Αγόρασε ένα παιχνίδι που κόστιζε x ευρώ και του έμειναν ${b} ευρώ. Πόσο κόστιζε το παιχνίδι (x);`,
        correct: `${x} ευρώ`,
        a,
        b,
        x,
        unit: 'ευρώ'
      };
    }
  },
  {
    generate: () => {
      const a = getRandomInt(40, 80);
      const b = getRandomInt(12, a - 15);
      const x = a - b;
      return {
        prompt: `Ένα δοχείο περιείχε ${a} λίτρα λάδι. Χρησιμοποιήσαμε x λίτρα και στο δοχείο έμειναν ${b} λίτρα. Πόσα λίτρα λάδι χρησιμοποιήσαμε;`,
        correct: `${x} λίτρα`,
        a,
        b,
        x,
        unit: 'λίτρα'
      };
    }
  },
  {
    generate: () => {
      const a = getRandomInt(120, 250);
      const b = getRandomInt(40, a - 30);
      const x = a - b;
      return {
        prompt: `Ένα βιβλίο έχει ${a} σελίδες. Η Άννα διάβασε x σελίδες και της απομένουν ακόμα ${b} σελίδες για να το τελειώσει. Πόσες σελίδες διάβασε;`,
        correct: `${x} σελίδες`,
        a,
        b,
        x,
        unit: 'σελίδες'
      };
    }
  },
  {
    generate: () => {
      const a = getRandomInt(30, 60);
      const b = getRandomInt(8, a - 10);
      const x = a - b;
      return {
        prompt: `Σε ένα κατάστημα υπήρχαν ${a} μπάλες. Πουλήθηκαν x μπάλες και στο κατάστημα έμειναν ${b} μπάλες. Πόσες μπάλες πουλήθηκαν;`,
        correct: `${x} μπάλες`,
        a,
        b,
        x,
        unit: 'μπάλες'
      };
    }
  }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const template = shuffle(SCENARIO_TEMPLATES)[0];
  const sc = template.generate();

  // Q1: Input - Βασική εξίσωση a - x = b με φυσικούς αριθμούς
  const q1A = getRandomInt(25, 75);
  const q1B = getRandomInt(8, q1A - 8);
  const q1X = q1A - q1B;

  // Q2: Input - Εξίσωση a - x = b με μεγαλύτερους φυσικούς αριθμούς
  const q2A = getRandomInt(110, 350);
  const q2B = getRandomInt(35, q2A - 40);
  const q2X = q2A - q2B;

  // Q3: Input - Εξίσωση με δεκαδικούς αριθμούς: a - x = b
  const q3A_raw = getRandomInt(45, 95) / 10;
  const q3B_raw = getRandomInt(12, Math.floor(q3A_raw * 10) - 10) / 10;
  const q3X_raw = Number((q3A_raw - q3B_raw).toFixed(1));
  const q3A = q3A_raw.toFixed(1).replace('.', ',');
  const q3B = q3B_raw.toFixed(1).replace('.', ',');
  const q3Correct = q3X_raw.toFixed(1).replace('.', ',');

  // Q4: MCQ - Επιλογή του σωστού βήματος επίλυσης για την εξίσωση a - x = b
  const q4A = getRandomInt(30, 80);
  const q4B = getRandomInt(10, q4A - 10);
  const q4CorrectStep = `x ＝ ${q4A} － ${q4B}`;
  const q4Wrongs = [
    `x ＝ ${q4A} ＋ ${q4B}`,
    `x ＝ ${q4B} － ${q4A}`,
    `x ＝ ${q4A} : ${q4B}`
  ];
  const q4Options = shuffle([q4CorrectStep, ...q4Wrongs]);

  // Q5: True / False - Κανόνας εύρεσης άγνωστου αφαιρετέου
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στην εξίσωση α － x ＝ β, ο άγνωστος x είναι ο αφαιρετέος και υπολογίζεται με αφαίρεση: x ＝ α － β.'
    : 'Στην εξίσωση α － x ＝ β, ο άγνωστος x υπολογίζεται με πρόσθεση: x ＝ α ＋ β.';

  // Q6: True / False - Σχέση μεγέθους όρων στην αφαίρεση
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Στην εξίσωση α － x ＝ β, ο μειωτέος (α) είναι πάντοτε μεγαλύτερος τόσο από τον αφαιρετέο (x) όσο και από τη διαφορά (β).'
    : 'Στην εξίσωση α － x ＝ β, ο άγνωστος αφαιρετέος (x) είναι πάντοτε μεγαλύτερος από τον μειωτέο (α).';

  // Q7: Input - Εξίσωση με ομώνυμα κλάσματα: n1/d - x = n2/d
  const q7Den = getRandomInt(6, 15);
  const q7N1 = getRandomInt(5, q7Den - 1);
  const q7N2 = getRandomInt(1, q7N1 - 2);
  const q7DiffN = q7N1 - q7N2;
  const q7G = gcd(q7DiffN, q7Den);
  const q7CorrectRaw = `${q7DiffN}/${q7Den}`;
  const q7CorrectSimp = q7G > 1 ? `${q7DiffN / q7G}/${q7Den / q7G}` : q7CorrectRaw;

  // Q8: MCQ - Πρόβλημα καθημερινότητας (με τυχαίους αριθμούς)
  const scWrongs = [
    String(sc.a + sc.b),
    String(sc.x + 10),
    String(Math.max(1, sc.x - 8))
  ];
  const q8Options = shuffle([sc.correct, ...scWrongs.map(w => `${w} ${sc.unit}`)]);

  return {
    q1: {
      type: 'input',
      title: 'Εξίσωση: α － x ＝ β',
      prompt: `Λύσε την εξίσωση: ${q1A} － x ＝ ${q1B}`,
      correct: String(q1X),
      explain: `x ＝ ${q1A} － ${q1B} ＝ ${q1X}.`
    },
    q2: {
      type: 'input',
      title: 'Μεγαλύτεροι Αριθμοί',
      prompt: `Λύσε την εξίσωση: ${q2A} － x ＝ ${q2B}`,
      correct: String(q2X),
      explain: `x ＝ ${q2A} － ${q2B} ＝ ${q2X}.`
    },
    q3: {
      type: 'input',
      title: 'Δεκαδικοί Αριθμοί',
      prompt: `Λύσε την εξίσωση: ${q3A} － x ＝ ${q3B}`,
      correct: q3Correct,
      explain: `x ＝ ${q3A} － ${q3B} ＝ ${q3Correct}.`
    },
    q4: {
      type: 'mcq',
      title: 'Σωστό Βήμα Επίλυσης',
      prompt: `Ποιο είναι το σωστό βήμα για να λύσουμε την εξίσωση ${q4A} － x ＝ ${q4B};`,
      options: q4Options,
      correct: q4CorrectStep,
      explain: `Για να βρούμε τον άγνωστο αφαιρετέο x, αφαιρούμε τη διαφορά από τον μειωτέο: ${q4CorrectStep}.`
    },
    q5: {
      type: 'tf',
      title: 'Κανόνας Αφαιρετέου',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Για να βρούμε τι αφαιρέθηκε από το αρχικό ποσό (αφαιρετέος), αφαιρούμε τη διαφορά από τον μειωτέο: x ＝ α － β.'
        : 'Για να βρούμε τον αφαιρετέο κάνουμε αφαίρεση: x ＝ α － β.'
    },
    q6: {
      type: 'tf',
      title: 'Σχέση Όρων Αφαίρεσης',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Ο μειωτέος (α) είναι το αρχικό ολικό μέγεθος, επομένως είναι μεγαλύτερος από το x και από το β.'
        : 'Ο μειωτέος (α) είναι το μεγαλύτερο μέγεθος στην αφαίρεση (α > x και α > β).'
    },
    q7: {
      type: 'input',
      title: 'Εξίσωση με Κλάσματα',
      prompt: `Λύσε την εξίσωση: ${q7N1}/${q7Den} － x ＝ ${q7N2}/${q7Den} (π.χ. 3/8):`,
      correct: q7CorrectRaw,
      altCorrect: q7CorrectSimp,
      explain: `x ＝ ${q7N1}/${q7Den} － ${q7N2}/${q7Den} ＝ (${q7N1} － ${q7N2})/${q7Den} ＝ ${q7CorrectRaw}${q7G > 1 ? ` (ή ανάγωγο: ${q7CorrectSimp})` : ''}.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: sc.prompt,
      options: q8Options,
      correct: sc.correct,
      explain: `Σχηματίζουμε την εξίσωση ${sc.a} － x ＝ ${sc.b} ➔ x ＝ ${sc.a} － ${sc.b} ＝ ${sc.correct}.`
    }
  };
}

export default function GnostosMeionAgnostosExercisesPage() {
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
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase() : null;
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

  const actionButton = (
    <Link
      href="/st-dimotikou/35-gnostos-meion-agnostos"
      className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
    >
      <span>📖</span>
      <span>Θεωρία</span>
    </Link>
  );

  return (
    <Layout
      title="🎯 Ασκήσεις: 35. Άγνωστος Αφαιρετέος (α - x = β) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στην επίλυση εξισώσεων με άγνωστο αφαιρετέο (α - x = β) για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      actionButton={actionButton}
      hideFooter={true}
    >
      <div className="py-6 md:py-10 space-y-8 pb-28 sm:pb-32">

        {/* 1. HEADER HERO BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-100 border border-white/20">
                <span>🎯 ΣΤ' Δημοτικου • Εξασκηση</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Άγνωστος Αφαιρετέος (α － x ＝ β)
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα εξισώσεων αφαίρεσης με φυσικούς, δεκαδικούς και κλάσματα!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewQuestions}
              className="px-5 py-3 bg-white text-blue-800 hover:bg-blue-50 rounded-2xl font-extrabold shadow-md transition transform active:scale-95 text-xs sm:text-sm flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-center"
            >
              <span>🔄</span>
              <span>Νέες Ασκήσεις</span>
            </button>
          </div>
        </div>

        {/* 2. ΦΟΡΜΑ ΜΕ ΤΙΣ 8 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ΕΡΩΤΗΣΗ 1 */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q1')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Άσκηση 1 • Εξίσωση α － x ＝ β
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
                  id="ex-input-subtr-q1"
                  name="exInputSubtrQ1"
                  autoComplete="off"
                  type="text"
                  inputMode="numeric"
                  disabled={submitted}
                  value={answers.q1}
                  onChange={(e) => handleInputChange('q1', e.target.value)}
                  placeholder="x ＝ ..."
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
                  Άσκηση 2 • Μεγαλύτεροι Αριθμοί
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
                  id="ex-input-subtr-q2"
                  name="exInputSubtrQ2"
                  autoComplete="off"
                  type="text"
                  inputMode="numeric"
                  disabled={submitted}
                  value={answers.q2}
                  onChange={(e) => handleInputChange('q2', e.target.value)}
                  placeholder="x ＝ ..."
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
                  Άσκηση 3 • Δεκαδικοί Αριθμοί
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q3') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                {questions.q3.prompt}
              </p>
              <div className="space-y-3">
                <input
                  id="ex-input-subtr-q3"
                  name="exInputSubtrQ3"
                  autoComplete="off"
                  type="text"
                  inputMode="numeric"
                  disabled={submitted}
                  value={answers.q3}
                  onChange={(e) => handleInputChange('q3', e.target.value)}
                  placeholder="π.χ. 3,2"
                  className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-purple-500 outline-none disabled:bg-slate-100 font-mono"
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
                <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                  Άσκηση 4 • Επιλογή Βήματος
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
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-cyan-50'
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
                  Άσκηση 7 • Εξίσωση με Κλάσματα
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
                  id="ex-input-subtr-q7"
                  name="exInputSubtrQ7"
                  autoComplete="off"
                  type="text"
                  disabled={submitted}
                  value={answers.q7}
                  onChange={(e) => handleInputChange('q7', e.target.value)}
                  placeholder="π.χ. 3/8"
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
              <p className="text-sm text-slate-700 mb-3 font-medium leading-relaxed">
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
            <div className="flex justify-center pt-4 sm:pt-6">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#10b981] hover:bg-[#059669] text-white text-base md:text-lg font-black px-8 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <span className="text-xl">🎯</span>
                <span>Έλεγχος Απαντήσεων</span>
              </button>
            </div>
          )}
        </form>

      </div>

      {/* 3. FIXED STICKY BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 sm:py-4 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* ΑΡΙΣΤΕΡΑ: SCORE BADGE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>Σκορ:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
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
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
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
    </Layout>
  );
}

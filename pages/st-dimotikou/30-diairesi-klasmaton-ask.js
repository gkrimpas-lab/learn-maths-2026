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

// Πλούσια δεξαμενή σεναρίων καθημερινότητας με σωστή γραμματική συμφωνία
const REAL_WORLD_SCENARIOS = [
  { 
    item: 'κιλά αλεύρι', 
    genitiveItem: 'κιλών αλευριού',
    action: 'χωρίζονται σε σακουλάκια των', 
    questionText: 'Πόσα σακουλάκια θα γεμίσουν συνολικά;',
    resultText: 'σακουλάκια' 
  },
  { 
    item: 'λίτρα χυμού', 
    genitiveItem: 'λίτρων χυμού',
    action: 'μοιράζονται σε μπουκαλάκια των', 
    questionText: 'Πόσα μπουκαλάκια θα γεμίσουν συνολικά;',
    resultText: 'μπουκαλάκια' 
  },
  { 
    item: 'λίτρα γάλακτος', 
    genitiveItem: 'λίτρων γάλακτος',
    action: 'σερβίρονται σε ποτήρια των', 
    questionText: 'Πόσα ποτήρια θα γεμίσουν συνολικά;',
    resultText: 'ποτήρια' 
  },
  { 
    item: 'μέτρα κορδέλας', 
    genitiveItem: 'μέτρων κορδέλας',
    action: 'κόβονται σε κομμάτια των', 
    questionText: 'Πόσα κομμάτια θα έχουμε συνολικά;',
    resultText: 'κομμάτια' 
  },
  { 
    item: 'κιλά ζάχαρης', 
    genitiveItem: 'κιλών ζάχαρης',
    action: 'συσκευάζονται σε βαζάκια των', 
    questionText: 'Πόσα βαζάκια θα γεμίσουν συνολικά;',
    resultText: 'βαζάκια' 
  },
  { 
    item: 'λίτρα λαδιού', 
    genitiveItem: 'λίτρων λαδιού',
    action: 'μοιράζονται σε δοχεία των', 
    questionText: 'Πόσα δοχεία θα γεμίσουν συνολικά;',
    resultText: 'δοχεία' 
  },
  { 
    item: 'μέτρα υφάσματος', 
    genitiveItem: 'μέτρων υφάσματος',
    action: 'κόβονται σε λωρίδες των', 
    questionText: 'Πόσες λωρίδες θα έχουμε συνολικά;',
    resultText: 'λωρίδες' 
  },
  { 
    item: 'κιλά καφέ', 
    genitiveItem: 'κιλών καφέ',
    action: 'χωρίζονται σε κουτάκια των', 
    questionText: 'Πόσα κουτάκια θα γεμίσουν συνολικά;',
    resultText: 'κουτάκια' 
  }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledScenarios = shuffle(REAL_WORLD_SCENARIOS);

  // Q1: Input - Διαίρεση Κλάσματος με Κλάσμα
  const q1Num1 = getRandomInt(1, 4);
  const q1Den1 = getRandomInt(q1Num1 + 1, 6);
  const q1Num2 = getRandomInt(1, 3);
  const q1Den2 = getRandomInt(q1Num2 + 1, 5);
  const q1ResN = q1Num1 * q1Den2;
  const q1ResD = q1Den1 * q1Num2;
  const q1G = findGCD(q1ResN, q1ResD);
  const q1CorrectRaw = `${q1ResN}/${q1ResD}`;
  const q1CorrectSimp = q1ResD / q1G === 1 ? String(q1ResN / q1G) : `${q1ResN / q1G}/${q1ResD / q1G}`;

  // Q2: Input - Διαίρεση Κλάσματος με Ακέραιο
  const q2Num = getRandomInt(2, 6);
  const q2Den = getRandomInt(3, 7);
  const q2Whole = getRandomInt(2, 4);
  const q2ResN = q2Num;
  const q2ResD = q2Den * q2Whole;
  const q2G = findGCD(q2ResN, q2ResD);
  const q2CorrectRaw = `${q2ResN}/${q2ResD}`;
  const q2CorrectSimp = q2ResD / q2G === 1 ? String(q2ResN / q2G) : `${q2ResN / q2G}/${q2ResD / q2G}`;

  // Q3: MCQ - Διαίρεση Ακέραιου με Κλάσμα (π.χ. 3 : 1/2 = 6)
  const q3Whole = getRandomInt(2, 4);
  const q3Den = getRandomInt(2, 4);
  const q3Num = 1;
  const q3Res = q3Whole * q3Den;
  const q3CorrectStr = String(q3Res);
  const q3Wrongs = [
    String(q3Whole + q3Den),
    `${q3Whole}/${q3Den}`,
    String(Math.max(1, q3Res - 2))
  ];
  const q3Options = shuffle([q3CorrectStr, ...q3Wrongs]);

  // Q4: MCQ - Μετατροπή σε Πολλαπλασιασμό (Εύρεση του σωστού αντίστροφου)
  const q4N1 = getRandomInt(2, 5);
  const q4D1 = getRandomInt(3, 7);
  const q4N2 = getRandomInt(1, 4);
  const q4D2 = getRandomInt(2, 6);
  const q4CorrectStr = `(${q4N1}/${q4D1}) × (${q4D2}/${q4N2})`;
  const q4Wrongs = [
    `(${q4D1}/${q4N1}) × (${q4N2}/${q4D2})`,
    `(${q4N1}/${q4D1}) × (${q4N2}/${q4D2})`,
    `(${q4D1}/${q4N1}) × (${q4D2}/${q4N2})`
  ];
  const q4Options = shuffle([q4CorrectStr, ...q4Wrongs]);

  // Q5: True / False - Κανόνας αντιστροφής
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Στη διαίρεση κλασμάτων αντιστρέφουμε πάντοτε τους όρους του δεύτερου κλάσματος (διαιρέτη) και κάνουμε πολλαπλασιασμό.'
    : 'Στη διαίρεση κλασμάτων αντιστρέφουμε τους όρους του πρώτου κλάσματος (διαιρετέου) και κάνουμε πολλαπλασιασμό.';

  // Q6: True / False - Διαίρεση με κλάσμα < 1
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Όταν διαιρούμε έναν αριθμό με ένα γνήσιο κλάσμα (μικρότερο του 1), το πηλίκο είναι μεγαλύτερο από τον αρχικό αριθμό.'
    : 'Όταν διαιρούμε έναν αριθμό με ένα γνήσιο κλάσμα (μικρότερο του 1), το πηλίκο είναι πάντοτε μικρότερο από τον αρχικό αριθμό.';

  // Q7: Input - Σύνθετο Κλάσμα (Άκροι / Μέσοι)
  const q7A = getRandomInt(1, 3);
  const q7B = getRandomInt(2, 4);
  const q7C = getRandomInt(1, 3);
  const q7D = getRandomInt(2, 5);
  const q7Top = q7A * q7D;
  const q7Bot = q7B * q7C;
  const q7G = findGCD(q7Top, q7Bot);
  const q7CorrectRaw = `${q7Top}/${q7Bot}`;
  const q7CorrectSimp = q7Bot / q7G === 1 ? String(q7Top / q7G) : `${q7Top / q7G}/${q7Bot / q7G}`;

  // Q8: MCQ - Πρόβλημα Καθημερινότητας (Με δυναμικά κλάσματα και σωστή γραμματική)
  const sc = shuffledScenarios[0];
  const scTotalD = [2, 3, 4, 5, 6][getRandomInt(0, 4)];
  const scTotalN = getRandomInt(2, scTotalD);
  const scPortionD = scTotalD * getRandomInt(2, 3);
  const scPortionN = 1;

  const scResN = scTotalN * scPortionD;
  const scResD = scTotalD * scPortionN;
  const scG = findGCD(scResN, scResD);
  const scQuotient = scResN / scResD;
  const scCorrectStr = Number.isInteger(scQuotient) 
    ? `${scQuotient} ${sc.resultText}` 
    : `${scResN / scG}/${scResD / scG} ${sc.resultText}`;
  const scWrongs = [
    `${Math.max(1, Math.round(scQuotient) + 2)} ${sc.resultText}`,
    `${scTotalN * scPortionN}/${scTotalD * scPortionD} ${sc.resultText}`,
    `${Math.max(1, Math.round(scQuotient) - 1)} ${sc.resultText}`
  ].filter(w => w !== scCorrectStr);
  const q8Options = shuffle([scCorrectStr, ...scWrongs.slice(0, 3)]);

  return {
    q1: {
      type: 'input',
      title: 'Κλάσμα : Κλάσμα',
      prompt: `Υπολόγισε το πηλίκο: (${q1Num1}/${q1Den1}) : (${q1Num2}/${q1Den2}) (π.χ. 3/2):`,
      correct: q1CorrectRaw,
      altCorrect: q1CorrectSimp,
      explain: `(${q1Num1}/${q1Den1}) : (${q1Num2}/${q1Den2}) ＝ (${q1Num1}/${q1Den1}) × (${q1Den2}/${q1Num2}) ＝ ${q1CorrectRaw}${q1G > 1 ? ` (ή απλοποιημένο: ${q1CorrectSimp})` : ''}.`
    },
    q2: {
      type: 'input',
      title: 'Κλάσμα : Ακέραιο',
      prompt: `Υπολόγισε το πηλίκο: (${q2Num}/${q2Den}) : ${q2Whole} (π.χ. 3/8):`,
      correct: q2CorrectRaw,
      altCorrect: q2CorrectSimp,
      explain: `(${q2Num}/${q2Den}) : ${q2Whole} ＝ (${q2Num}/${q2Den}) × (1/${q2Whole}) ＝ ${q2CorrectRaw}${q2G > 1 ? ` ＝ ${q2CorrectSimp}` : ''}.`
    },
    q3: {
      type: 'mcq',
      title: 'Ακέραιος : Κλάσμα',
      prompt: `Ποιο είναι το αποτέλεσμα της διαίρεσης ${q3Whole} : (1/${q3Den});`,
      options: q3Options,
      correct: q3CorrectStr,
      explain: `${q3Whole} : (1/${q3Den}) ＝ ${q3Whole} × (${q3Den}/1) ＝ ${q3Whole * q3Den} ＝ ${q3CorrectStr}.`
    },
    q4: {
      type: 'mcq',
      title: 'Κανόνας Αντιστροφής',
      prompt: `Πώς μετατρέπεται σε πολλαπλασιασμό η διαίρεση (${q4N1}/${q4D1}) : (${q4N2}/${q4D2});`,
      options: q4Options,
      correct: q4CorrectStr,
      explain: `Κρατάμε το 1ο κλάσμα όπως είναι και πολλαπλασιάζουμε με το αντίστροφο του 2ου: ${q4CorrectStr}.`
    },
    q5: {
      type: 'tf',
      title: 'Χρυσός Κανόνας Διαίρεσης',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Αντιστρέφουμε πάντοτε το 2ο κλάσμα (διαιρέτη) και κάνουμε πολλαπλασιασμό.'
        : 'Το 1ο κλάσμα (διαιρετέος) παραμένει ΑΜΕΤΑΒΛΗΤΟ. Αντιστρέφουμε μόνο το 2ο κλάσμα.'
    },
    q6: {
      type: 'tf',
      title: 'Διαίρεση με Κλάσμα < 1',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Επειδή ένα μικρό κομμάτι χωράει πολλές φορές, το πηλίκο είναι μεγαλύτερο από τον διαιρετέο (π.χ. 2 : 1/2 = 4 > 2).'
        : 'Όταν διαιρούμε με κλάσμα < 1, το αποτέλεσμα μεγαλώνει (π.χ. 3 : 1/2 = 6).'
    },
    q7: {
      type: 'input',
      title: 'Σύνθετο Κλάσμα',
      prompt: `Υπολόγισε την τιμή του σύνθετου κλάσματος (${q7A}/${q7B}) / (${q7C}/${q7D}) (π.χ. 6/5):`,
      correct: q7CorrectRaw,
      altCorrect: q7CorrectSimp,
      explain: `Γινόμενο άκρων προς γινόμενο μέσων: (${q7A} × ${q7D})/(${q7B} × ${q7C}) ＝ ${q7CorrectRaw}${q7G > 1 ? ` (ή απλοποιημένο: ${q7CorrectSimp})` : ''}.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: `Έχουμε ${scTotalN}/${scTotalD} ${sc.item} και ${sc.action} ${scPortionN}/${scPortionD} ${sc.genitiveItem}. ${sc.questionText}`,
      options: q8Options,
      correct: scCorrectStr,
      explain: `Διαιρούμε τη συνολική ποσότητα με το μέγεθος της μερίδας: (${scTotalN}/${scTotalD}) : (${scPortionN}/${scPortionD}) ＝ (${scTotalN}/${scTotalD}) × (${scPortionD}/${scPortionN}) ＝ ${scCorrectStr}.`
    }
  };
}

export default function DiairesiKlasmatonExercisesPage() {
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

  const actionButton = (
    <Link
      href="/st-dimotikou/30-diairesi-klasmaton"
      className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
    >
      <span>📖</span>
      <span>Θεωρία</span>
    </Link>
  );

  return (
    <Layout
      title="🎯 Ασκήσεις: 30. Διαίρεση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στη διαίρεση κλασμάτων, ακεραίων και σύνθετων κλασμάτων για τη ΣΤ' Δημοτικού."
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
                <span>🎯 ΣΤ' Δημοτικού • Εξάσκηση</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Διαίρεση Κλασμάτων
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα διαίρεσης κλασμάτων, διαίρεσης με ακέραιο, σύνθετων κλασμάτων και προβλημάτων καθημερινότητας!
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
                  Άσκηση 1 • Κλάσμα : Κλάσμα
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
                  placeholder="π.χ. 3/2"
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
                  Άσκηση 2 • Κλάσμα : Ακέραιο
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
                  placeholder="π.χ. 3/8"
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
                  Άσκηση 3 • Ακέραιος : Κλάσμα
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
                  Άσκηση 4 • Κανόνας Αντιστροφής
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
                  Άσκηση 7 • Σύνθετο Κλάσμα
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
                  placeholder="π.χ. 6/5"
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
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

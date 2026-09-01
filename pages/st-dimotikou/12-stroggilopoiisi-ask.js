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

// Δεξαμενή θεματικών σεναρίων καθημερινότητας
const REAL_WORLD_PRESETS = [
  { item: 'το μήκος της διαδρομής', unit: 'μ.' },
  { item: 'το βάρος του κιβωτίου', unit: 'κιλά' },
  { item: 'την τιμή του ηλεκτρονικού υπολογιστή', unit: '€' },
  { item: 'την απόσταση μεταξύ των δύο πόλεων', unit: 'χλμ.' },
  { item: 'την ποσότητα του ελαιολάδου', unit: 'λίτρα' },
  { item: 'το εμβαδόν του οικοπέδου', unit: 'τ.μ.' }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledItems = shuffle(REAL_WORLD_PRESETS);

  // Q1: Input - Στρογγυλοποίηση φυσικού αριθμού στις Δεκάδες ή Εκατοντάδες
  const q1Int = getRandomInt(125, 985);
  const q1TargetHundreds = Math.random() > 0.5;
  const q1PlaceName = q1TargetHundreds ? 'πλησιέστερη εκατοντάδα' : 'πλησιέστερη δεκάδα';
  const q1CorrectVal = q1TargetHundreds
    ? Math.round(q1Int / 100) * 100
    : Math.round(q1Int / 10) * 10;

  // Q2: Input - Στρογγυλοποίηση δεκαδικού αριθμού στα Δέκατα (0,1)
  const q2Int = getRandomInt(12, 85);
  const q2Dec1 = getRandomInt(1, 9);
  const q2Dec2 = getRandomInt(1, 9);
  const q2NumberStr = `${q2Int},${q2Dec1}${q2Dec2}`;
  const q2Float = parseFloat(`${q2Int}.${q2Dec1}${q2Dec2}`);
  const q2CorrectVal = (Math.round(q2Float * 10) / 10).toFixed(1).replace('.', ',');

  // Q3: MCQ - Στρογγυλοποίηση δεκαδικού στα Εκατοστά (0,01)
  const q3Int = getRandomInt(3, 45);
  const q3Dec1 = getRandomInt(1, 9);
  const q3Dec2 = getRandomInt(1, 9);
  const q3Dec3 = getRandomInt(1, 9);
  const q3NumberStr = `${q3Int},${q3Dec1}${q3Dec2}${q3Dec3}`;
  const q3Float = parseFloat(`${q3Int}.${q3Dec1}${q3Dec2}${q3Dec3}`);
  const q3CorrectVal = (Math.round(q3Float * 100) / 100).toFixed(2).replace('.', ',');
  const q3Wrong1 = (parseFloat(q3CorrectVal.replace(',', '.')) + 0.01).toFixed(2).replace('.', ',');
  const q3Wrong2 = (parseFloat(q3CorrectVal.replace(',', '.')) - 0.01).toFixed(2).replace('.', ',');
  const q3Wrong3 = (parseFloat(q3CorrectVal.replace(',', '.')) + 0.1).toFixed(2).replace('.', ',');
  const q3Options = shuffle([q3CorrectVal, q3Wrong1, q3Wrong2, q3Wrong3]);

  // Q4: MCQ - Εντοπισμός του «ψηφίου-κλειδιού»
  const q4Int = getRandomInt(120, 850);
  const q4Dec = getRandomInt(125, 875);
  const q4NumberStr = `${q4Int},${q4Dec}`;
  const q4TargetOptions = [
    { place: 'στις δεκάδες', keyName: 'των μονάδων', digit: String(q4Int % 10) },
    { place: 'στις εκατοντάδες', keyName: 'των δεκάδων', digit: String(Math.floor((q4Int % 100) / 10)) },
    { place: 'στις ακέραιες μονάδες', keyName: 'των δεκάτων', digit: String(Math.floor(q4Dec / 100)) },
    { place: 'στα δέκατα (0,1)', keyName: 'των εκατοστών', digit: String(Math.floor((q4Dec % 100) / 10)) }
  ];
  const q4Selected = q4TargetOptions[getRandomInt(0, 3)];
  const q4Correct = q4Selected.digit;
  const q4Options = shuffle([
    q4Correct,
    String((parseInt(q4Correct, 10) + 1) % 10),
    String((parseInt(q4Correct, 10) + 2) % 10),
    String((parseInt(q4Correct, 10) + 8) % 10)
  ]);

  // Q5: True / False - Κανόνας για τα ψηφία 5, 6, 7, 8, 9
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Όταν το αμέσως επόμενο ψηφίο από τη θέση στρογγυλοποίησης είναι 5, 6, 7, 8 ή 9, το ψηφίο της θέσης αυξάνεται κατά 1 (στρογγυλοποίηση προς τα πάνω).'
    : 'Όταν το αμέσως επόμενο ψηφίο από τη θέση στρογγυλοποίησης είναι 5, 6, 7, 8 ή 9, το ψηφίο της θέσης παραμένει ακριβώς το ίδιο.';

  // Q6: True / False - Μηδενισμός των δεξιών ψηφίων
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Όταν στρογγυλοποιούμε έναν αριθμό, όλα τα ψηφία που βρίσκονται δεξιά από τη θέση στρογγυλοποίησης μηδενίζονται ή παραλείπονται.'
    : 'Όταν στρογγυλοποιούμε έναν αριθμό, τα ψηφία που βρίσκονται δεξιά από τη θέση στρογγυλοποίησης παραμένουν αναλλοίωτα.';

  // Q7: SVG Visual - Αριθμογραμμή Στρογγυλοποίησης (Input)
  const q7Base = getRandomInt(10, 80) * 10;
  const q7Offset = getRandomInt(1, 9);
  const q7Val = q7Base + q7Offset;
  const q7Correct = String(Math.round(q7Val / 10) * 10);

  // Q8: MCQ - Πρόβλημα Καθημερινότητας / Εκτίμηση Κόστους
  const q8Item = shuffledItems[0];
  const q8PriceFloat = parseFloat(`${getRandomInt(15, 85)}.${getRandomInt(1, 9)}${getRandomInt(1, 9)}`);
  const q8PriceStr = q8PriceFloat.toFixed(2).replace('.', ',');
  const q8RoundedUnits = Math.round(q8PriceFloat);
  const q8Correct = `${q8RoundedUnits} ${q8Item.unit}`;
  const q8Options = shuffle([
    `${q8RoundedUnits} ${q8Item.unit}`,
    `${q8RoundedUnits + 1} ${q8Item.unit}`,
    `${q8RoundedUnits - 1} ${q8Item.unit}`,
    `${Math.floor(q8PriceFloat / 10) * 10} ${q8Item.unit}`
  ]);

  return {
    q1: {
      type: 'input',
      title: 'Στρογγυλοποίηση Φυσικού',
      number: String(q1Int),
      placeName: q1PlaceName,
      correct: String(q1CorrectVal),
      explain: `Στον αριθμό ${q1Int}, εξετάζουμε το ψηφίο-κλειδί. Η στρογγυλοποίηση στην ${q1PlaceName} δίνει ${q1CorrectVal}.`
    },
    q2: {
      type: 'input',
      title: 'Στρογγυλοποίηση στα Δέκατα',
      number: q2NumberStr,
      correct: q2CorrectVal,
      explain: `Στο ${q2NumberStr}, το ψηφίο των εκατοστών είναι το ${q2Dec2}. ${q2Dec2 >= 5 ? 'Επειδή είναι ≥ 5, στρογγυλοποιούμε προς τα πάνω' : 'Επειδή είναι < 5, στρογγυλοποιούμε προς τα κάτω'} σε ${q2CorrectVal}.`
    },
    q3: {
      type: 'mcq',
      title: 'Στρογγυλοποίηση στα Εκατοστά',
      prompt: `Στρογγυλοποίησε τον αριθμό ${q3NumberStr} στα πλησιέστερα εκατοστά (0,01):`,
      options: q3Options,
      correct: q3CorrectVal,
      explain: `Το ψηφίο των χιλιοστών είναι το ${q3Dec3}. Επομένως, το ${q3NumberStr} στρογγυλοποιείται στο ${q3CorrectVal}.`
    },
    q4: {
      type: 'mcq',
      title: 'Εντοπισμός Ψηφίου-Κλειδιού',
      prompt: `Για να στρογγυλοποιήσουμε τον αριθμό ${q4NumberStr} ${q4Selected.place}, ποιο ψηφίο εξετάζουμε;`,
      options: q4Options,
      correct: q4Correct,
      explain: `Εξετάζουμε το αμέσως επόμενο ψηφίο στα δεξιά (τη θέση ${q4Selected.keyName}), δηλαδή το ψηφίο ${q4Correct}.`
    },
    q5: {
      type: 'tf',
      title: 'Κανόνας Ψηφίων 5-9',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Όταν το επόμενο ψηφίο είναι 5, 6, 7, 8 ή 9, αυξάνουμε το ψηφίο της επιθυμητής τάξης κατά 1.'
        : 'Όταν το επόμενο ψηφίο είναι 5, 6, 7, 8 ή 9, το ψηφίο αυξάνεται κατά 1.'
    },
    q6: {
      type: 'tf',
      title: 'Μηδενισμός Δεξιών Ψηφίων',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Μετά τη στρογγυλοποίηση, όλα τα ψηφία στα δεξιά μηδενίζονται (ή παραλείπονται στα δεκαδικά).'
        : 'Όλα τα ψηφία στα δεξιά της θέσης στρογγυλοποίησης γίνονται μηδενικά ή διαγράφονται.'
    },
    q7: {
      type: 'input',
      title: 'Αριθμογραμμή Στρογγυλοποίησης',
      val: q7Val,
      base: q7Base,
      nextBase: q7Base + 10,
      correct: q7Correct,
      explain: `Ο αριθμός ${q7Val} βρίσκεται πιο κοντά στο ${q7Correct} πάνω στην αριθμογραμμή.`
    },
    q8: {
      type: 'mcq',
      title: 'Εκτίμηση στην Καθημερινότητα',
      prompt: `Αν μετρήσαμε ${q8Item.item} ίσο με ${q8PriceStr} ${q8Item.unit}, ποια είναι η στρογγυλοποιημένη τιμή στις πλησιέστερες ακέραιες μονάδες;`,
      options: q8Options,
      correct: q8Correct,
      explain: `Κοιτάζοντας τα δέκατα του αριθμού ${q8PriceStr}, στρογγυλοποιούμε στις πλησιέστερες ακέραιες μονάδες σε ${q8Correct}.`
    }
  };
}

export default function StroggilopoiisiExercisesPage() {
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
      title="🎯 Ασκήσεις: Στρογγυλοποίηση Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στη στρογγυλοποίηση φυσικών και δεκαδικών αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/12-stroggilopoiisi" 
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
                Διαδραστικές Ασκήσεις: Στρογγυλοποίηση Αριθμών
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα στρογγυλοποίησης σε δεκάδες, εκατοντάδες, δέκατα και εκατοστά!
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
                  Άσκηση 1 • Φυσικοί Αριθμοί
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                Στρογγυλοποίησε τον αριθμό <strong className="text-blue-700 text-base font-black font-mono">{questions.q1.number}</strong> στην {questions.q1.placeName}:
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q1}
                  onChange={(e) => handleInputChange('q1', e.target.value)}
                  placeholder="Γράψε τον στρογγυλοποιημένο αριθμό..."
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
                  Άσκηση 2 • Στρογγυλοποίηση στα Δέκατα
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q2') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                Στρογγυλοποίησε τον αριθμό <strong className="text-indigo-700 text-base font-black font-mono">{questions.q2.number}</strong> στα πλησιέστερα δέκατα (0,1):
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q2}
                  onChange={(e) => handleInputChange('q2', e.target.value.replace(/\./g, ','))}
                  placeholder="π.χ. 34,5"
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
                  Άσκηση 3 • Στα Εκατοστά (0,01)
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
                  Άσκηση 4 • Ψηφίο-Κλειδί
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q4') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 leading-relaxed font-medium">
                {questions.q4.prompt}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {questions.q4.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q4', opt)}
                    className={`p-3 rounded-xl text-sm font-mono font-black border text-center transition ${
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

            {/* ΕΡΩΤΗΣΗ 7: Οπτικό SVG (Αριθμογραμμή) */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${getCardStyle('q7')}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black px-3 py-1 bg-rose-100 text-rose-800 rounded-full">
                  Άσκηση 7 • Οπτική Αριθμογραμμή
                </span>
                {submitted && (
                  <span className="text-lg">{isCorrect('q7') ? '✅' : '❌'}</span>
                )}
              </div>
              <p className="text-sm text-slate-700 mb-3 font-medium">
                Σε ποια πλησιέστερη δεκάδα στρογγυλοποιείται ο αριθμός <strong className="text-rose-700 font-mono">{questions.q7.val}</strong>;
              </p>
              
              <div className="bg-slate-100 rounded-2xl p-4 mb-4 flex justify-center overflow-x-auto">
                <svg viewBox="0 0 300 70" className="w-full max-w-xs h-16 shrink-0 select-none">
                  <line x1="30" y1="40" x2="270" y2="40" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Left Bound Tick */}
                  <line x1="40" y1="30" x2="40" y2="50" stroke="#334155" strokeWidth="2.5" />
                  <text x="40" y="62" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#334155">
                    {questions.q7.base}
                  </text>

                  {/* Right Bound Tick */}
                  <line x1="260" y1="30" x2="260" y2="50" stroke="#334155" strokeWidth="2.5" />
                  <text x="260" y="62" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#334155">
                    {questions.q7.nextBase}
                  </text>

                  {/* Mid Tick */}
                  <line x1="150" y1="35" x2="150" y2="45" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
                  <text x="150" y="25" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#94a3b8">
                    {questions.q7.base + 5}
                  </text>

                  {/* Value Pointer */}
                  <circle cx={40 + ((questions.q7.val - questions.q7.base) / 10) * 220} cy="40" r="5" fill="#2563eb" />
                  <text x={40 + ((questions.q7.val - questions.q7.base) / 10) * 220} y="18" fontSize="11" fontWeight="black" textAnchor="middle" fill="#2563eb">
                    {questions.q7.val}
                  </text>
                </svg>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  disabled={submitted}
                  value={answers.q7}
                  onChange={(e) => handleInputChange('q7', e.target.value)}
                  placeholder="Γράψε τη δεκάδα..."
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
                  Άσκηση 8 • Εκτίμηση στην Πράξη
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

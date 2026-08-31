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
  return x;
}

// Πλούσια δεξαμενή σεναρίων καθημερινότητας με σωστή σύνταξη και ρήματα
const REAL_WORLD_SCENARIOS = [
  { item: 'την πίτσα', verb: 'έφαγε', origN: 4, origD: 8, redN: 1, redD: 2 },
  { item: 'τη σοκολάτα', verb: 'μοίρασε', origN: 6, origD: 9, redN: 2, redD: 3 },
  { item: 'το κέικ', verb: 'σέρβιρε', origN: 3, origD: 12, redN: 1, redD: 4 },
  { item: 'το χυμό', verb: 'ήπιε', origN: 5, origD: 10, redN: 1, redD: 2 },
  { item: 'το βιβλίο', verb: 'διάβασε', origN: 8, origD: 12, redN: 2, redD: 3 },
  { item: 'τον κήπο', verb: 'φύτεψε', origN: 6, origD: 10, redN: 3, redD: 5 },
  { item: 'το παζλ', verb: 'συμπλήρωσε', origN: 9, origD: 12, redN: 3, redD: 4 },
  { item: 'τη διαδρομή', verb: 'διάνυσε', origN: 4, origD: 16, redN: 1, redD: 4 }
];

// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledScenarios = shuffle(REAL_WORLD_SCENARIOS);

  // Q1: Input - Εύρεση άγνωστου αριθμητή σε ισοδύναμα κλάσματα (π.χ. 2/3 = x/12)
  const q1BaseNum = getRandomInt(1, 4);
  const q1BaseDen = getRandomInt(q1BaseNum + 1, 6);
  const q1Mult = getRandomInt(2, 5);
  const q1TargetDen = q1BaseDen * q1Mult;
  const q1Correct = String(q1BaseNum * q1Mult);

  // Q2: Input - Μετατροπή κλάσματος σε ανάγωγο (π.χ. 6/8 -> 3/4)
  const q2RedNum = getRandomInt(1, 4);
  let q2RedDen = getRandomInt(q2RedNum + 1, 6);
  while (gcd(q2RedNum, q2RedDen) !== 1) {
    q2RedDen++;
  }
  const q2CommonFactor = [2, 3, 4, 5][getRandomInt(0, 3)];
  const q2OrigNum = q2RedNum * q2CommonFactor;
  const q2OrigDen = q2RedDen * q2CommonFactor;
  const q2Correct = `${q2RedNum}/${q2RedDen}`;

  // Q3: MCQ - Ποιο από τα παρακάτω κλάσματα είναι ισοδύναμο με το δοθέν
  const q3BaseN = getRandomInt(1, 3);
  const q3BaseD = getRandomInt(q3BaseN + 1, 5);
  const q3GoodMult = getRandomInt(2, 4);
  const q3CorrectStr = `${q3BaseN * q3GoodMult}/${q3BaseD * q3GoodMult}`;
  const q3Wrongs = [
    `${q3BaseN * q3GoodMult + 1}/${q3BaseD * q3GoodMult}`,
    `${q3BaseN * q3GoodMult}/${q3BaseD * q3GoodMult + 1}`,
    `${q3BaseN + 2}/${q3BaseD + 2}`
  ];
  const q3Options = shuffle([q3CorrectStr, ...q3Wrongs]);

  // Q4: MCQ - Ποιο κλάσμα είναι ήδη ανάγωγο (δεν απλοποιείται άλλο)
  const irreducibleList = [
    { num: 3, den: 5 },
    { num: 2, den: 7 },
    { num: 4, den: 9 },
    { num: 5, den: 8 },
    { num: 7, den: 10 }
  ];
  const reducibleList = [
    { num: 4, den: 6 },
    { num: 6, den: 9 },
    { num: 10, den: 15 },
    { num: 8, den: 12 },
    { num: 14, den: 21 }
  ];
  const q4ChosenIrred = irreducibleList[getRandomInt(0, irreducibleList.length - 1)];
  const q4WrongsRed = shuffle(reducibleList).slice(0, 3);
  const q4CorrectStr = `${q4ChosenIrred.num}/${q4ChosenIrred.den}`;
  const q4Options = shuffle([
    q4CorrectStr,
    ...q4WrongsRed.map(r => `${r.num}/${r.den}`)
  ]);

  // Q5: True / False - Ορισμός ισοδύναμων κλασμάτων
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Δύο ισοδύναμα κλάσματα εκφράζουν την ίδια ακριβώς ποσότητα ή αξία.'
    : 'Δύο ισοδύναμα κλάσματα έχουν υποχρεωτικά τον ίδιο αριθμητή και τον ίδιο παρονομαστή.';

  // Q6: True / False - Κανόνας δημιουργίας ισοδυνάμων (πολλαπλασιασμός και των δύο όρων)
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Αν πολλαπλασιάσουμε και τον αριθμητή και τον παρονομαστή με τον ίδιο φυσικό αριθμό (≠ 0), προκύπτει ισοδύναμο κλάσμα.'
    : 'Αν προσθέσουμε τον ίδιο αριθμό στον αριθμητή και στον παρονομαστή, προκύπτει πάντοτε ισοδύναμο κλάσμα.';

  // Q7: Input - Με ποιον αριθμό πρέπει να διαιρέσουμε (Μ.Κ.Δ.) για να γίνει ανάγωγο
  const q7Common = [2, 3, 4, 5, 6][getRandomInt(0, 4)];
  const q7SimpleN = getRandomInt(1, 3);
  let q7SimpleD = getRandomInt(q7SimpleN + 1, 5);
  while (gcd(q7SimpleN, q7SimpleD) !== 1) {
    q7SimpleD++;
  }
  const q7Num = q7SimpleN * q7Common;
  const q7Den = q7SimpleD * q7Common;
  const q7Correct = String(q7Common);

  // Q8: MCQ - Πρόβλημα Καθημερινότητας
  const sc = shuffledScenarios[0];
  const q8CorrectStr = `${sc.redN}/${sc.redD}`;
  const q8Wrongs = [
    `${sc.redN + 1}/${sc.redD}`,
    `${sc.redN}/${sc.redD + 1}`,
    `${sc.origN}/${sc.redD}`
  ].filter(w => w !== q8CorrectStr);
  const q8Options = shuffle([q8CorrectStr, ...q8Wrongs.slice(0, 3)]);

  return {
    q1: {
      type: 'input',
      title: 'Εύρεση Άγνωστου Όρου',
      prompt: `Βρες τον αριθμητή x ώστε τα κλάσματα να είναι ισοδύναμα: ${q1BaseNum}/${q1BaseDen} ＝ x/${q1TargetDen}`,
      correct: q1Correct,
      explain: `Ο παρονομαστής πολλαπλασιάστηκε επί ${q1Mult} (${q1BaseDen} × ${q1Mult} ＝ ${q1TargetDen}), άρα και ο αριθμητής γίνεται ${q1BaseNum} × ${q1Mult} ＝ ${q1Correct}.`
    },
    q2: {
      type: 'input',
      title: 'Απλοποίηση σε Ανάγωγο',
      prompt: `Απλοποίησε το κλάσμα ${q2OrigNum}/${q2OrigDen} στην ανάγωγη μορφή του (π.χ. 3/4):`,
      correct: q2Correct,
      explain: `Διαιρούμε και τους δύο όρους με το ${q2CommonFactor} (Μ.Κ.Δ.): (${q2OrigNum} ÷ ${q2CommonFactor}) / (${q2OrigDen} ÷ ${q2CommonFactor}) ＝ ${q2Correct}.`
    },
    q3: {
      type: 'mcq',
      title: 'Αναγνώριση Ισοδύναμου',
      prompt: `Ποιο από τα παρακάτω κλάσματα είναι ισοδύναμο με το ${q3BaseN}/${q3BaseD};`,
      options: q3Options,
      correct: q3CorrectStr,
      explain: `Πολλαπλασιάζοντας τους όρους του ${q3BaseN}/${q3BaseD} επί ${q3GoodMult} προκύπτει το ${q3CorrectStr}.`
    },
    q4: {
      type: 'mcq',
      title: 'Εντοπισμός Ανάγωγου Κλάσματος',
      prompt: `Ποιο από τα παρακάτω κλάσματα είναι ανάγωγο (δεν μπορεί να απλοποιηθεί άλλο);`,
      options: q4Options,
      correct: q4CorrectStr,
      explain: `Στο κλάσμα ${q4CorrectStr}, ο αριθμητής και ο παρονομαστής έχουν Μ.Κ.Δ. το 1 (είναι πρώτοι μεταξύ τους), άρα είναι ανάγωγο.`
    },
    q5: {
      type: 'tf',
      title: 'Έννοια Ισοδυναμίας',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Τα ισοδύναμα κλάσματα εκφράζουν ακριβώς την ίδια ποσότητα.'
        : 'Τα ισοδύναμα κλάσματα έχουν συνήθως διαφορετικούς όρους (π.χ. 1/2 ＝ 2/4 ＝ 4/8).'
    },
    q6: {
      type: 'tf',
      title: 'Κανόνας Ισοδυναμίας',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Δημιουργούμε ισοδύναμα κλάσματα πολλαπλασιάζοντας ή διαιρώντας και τους δύο όρους με τον ίδιο αριθμό.'
        : 'Με την πρόσθεση ΔΕΝ διατηρείται η ισοδυναμία (π.χ. 1/2 ≠ (1+2)/(2+2) = 3/4).'
    },
    q7: {
      type: 'input',
      title: 'Εύρεση Διαιρέτη Απλοποίησης',
      prompt: `Με ποιον αριθμό (Μ.Κ.Δ.) πρέπει να διαιρέσουμε τους όρους του κλάσματος ${q7Num}/${q7Den} ώστε να γίνει αμέσως ανάγωγο;`,
      correct: q7Correct,
      explain: `Ο Μέγιστος Κοινός Διαιρέτης του ${q7Num} και του ${q7Den} είναι το ${q7Correct}.`
    },
    q8: {
      type: 'mcq',
      title: 'Πρόβλημα Καθημερινότητας',
      prompt: `Ένας μαθητής ${sc.verb} τα ${sc.origN}/${sc.origD} από ${sc.item}. Ποιο είναι το απλούστερο (ανάγωγο) κλάσμα που αντιπροσωπεύει αυτή την ποσότητα;`,
      options: q8Options,
      correct: q8CorrectStr,
      explain: `Το κλάσμα ${sc.origN}/${sc.origD} απλοποιείται διαιρώντας με τον Μ.Κ.Δ. και γίνεται ${q8CorrectStr}.`
    }
  };
}

export default function IsodinamaKlasmataExercisesPage() {
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

  const actionButton = (
    <Link
      href="/st-dimotikou/25-isodinama-klasmata"
      className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
    >
      <span>📖</span>
      <span>Θεωρία</span>
    </Link>
  );

  return (
    <Layout
      title="🎯 Ασκήσεις: 25. Ισοδύναμα & Ανάγωγα Κλάσματα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση στα ισοδύναμα και ανάγωγα κλάσματα για τη ΣΤ' Δημοτικού."
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
                Διαδραστικές Ασκήσεις: Ισοδύναμα & Ανάγωγα Κλάσματα
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
                Λύσε τα 8 δυναμικά προβλήματα δημιουργίας ισοδυνάμων, απλοποίησης με Μ.Κ.Δ. και αναγωγής κλασμάτων!
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
                  Άσκηση 1 • Εύρεση Άγνωστου Όρου
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
                  placeholder="Γράψε την τιμή του x..."
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
                  Άσκηση 2 • Απλοποίηση σε Ανάγωγο
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
                  placeholder="π.χ. 3/4"
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
                  Άσκηση 3 • Αναγνώριση Ισοδύναμου
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
                  Άσκηση 4 • Εντοπισμός Ανάγωγου
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
                    className={`w-full p-2.5 rounded-xl text-sm font-mono font-bold border text-center transition ${
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
                  Άσκηση 7 • Μ.Κ.Δ. Απλοποίησης
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
                  placeholder="Γράψε τον διαιρέτη..."
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

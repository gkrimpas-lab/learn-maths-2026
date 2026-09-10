// pages/d-dimotikou/14-apostasi-simeiou-eutheia-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΕΡΩΤΗΣΕΩΝ (POOLS)
// ----------------------------------------------------

// Pool Κατηγορίας 1: Σχήματα SVG (Ποιο τμήμα είναι η απόσταση;) - 4 Επιλογές (ΟΜΑΔΑ Α)
const SHAPE_POOL = [
  {
    q: 'Ποιο από τα παρακάτω ευθύγραμμα τμήματα εκφράζει την ΑΠΟΣΤΑΣΗ του σημείου Α από την ευθεία (ε);',
    correct: 'Το κάθετο τμήμα ΑΗ',
    wrongs: ['Το πλάγιο τμήμα ΑΖ', 'Το πλάγιο τμήμα ΑΚ', 'Κανένα από τα τρία'],
    explainText: 'Η απόσταση ορίζεται αποκλειστικά από το κάθετο ευθύγραμμο τμήμα ΑΗ, το οποίο σχηματίζει ορθή γωνία (90°) με την ευθεία.',
    svg: (
      <svg className="w-56 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 240 120">
        <line x1="20" y1="90" x2="220" y2="90" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
        <text x="205" y="82" fill="#60a5fa" fontWeight="900" fontSize="13" fontFamily="sans-serif">ε</text>

        {/* Κάθετος ΑΗ */}
        <line x1="120" y1="20" x2="120" y2="90" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
        {/* Καθαρό γωνιακό σύμβολο L */}
        <path d="M 120 76 L 132 76 L 132 90" fill="none" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="120" cy="90" r="3.5" fill="#10b981" />
        <text x="125" y="106" fill="#34d399" fontWeight="900" fontSize="12" fontFamily="sans-serif">Η</text>

        {/* Πλάγιες ΑΖ, ΑΚ */}
        <line x1="120" y1="20" x2="60" y2="90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        <circle cx="60" cy="90" r="3" fill="#94a3b8" />
        <text x="54" y="106" fill="#94a3b8" fontWeight="700" fontSize="12" fontFamily="sans-serif">Ζ</text>

        <line x1="120" y1="20" x2="180" y2="90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        <circle cx="180" cy="90" r="3" fill="#94a3b8" />
        <text x="178" y="106" fill="#94a3b8" fontWeight="700" fontSize="12" fontFamily="sans-serif">Κ</text>

        {/* Σημείο Α */}
        <circle cx="120" cy="20" r="5" fill="#f43f5e" />
        <text x="114" y="12" fill="#f43f5e" fontWeight="900" fontSize="15" fontFamily="sans-serif">Α</text>
      </svg>
    )
  },
  {
    q: 'Στο παρακάτω σχήμα, το τμήμα ΑΗ είναι κάθετο στην ευθεία (ε). Ποιο τμήμα είναι το πιο ΣΥΝΤΟΜΟ (μικρότερο σε μήκος);',
    correct: 'Το κάθετο τμήμα ΑΗ',
    wrongs: ['Το πλάγιο τμήμα ΑΜ', 'Το πλάγιο τμήμα ΑΝ', 'Όλα έχουν ακριβώς το ίδιο μήκος'],
    explainText: 'Το κάθετο ευθύγραμμο τμήμα ΑΗ αποτελεί πάντοτε τη συντομότερη διαδρομή από το σημείο προς την ευθεία.',
    svg: (
      <svg className="w-56 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 240 120">
        <line x1="20" y1="90" x2="220" y2="90" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
        <text x="205" y="82" fill="#60a5fa" fontWeight="900" fontSize="13" fontFamily="sans-serif">ε</text>

        {/* Κάθετος ΑΗ */}
        <line x1="80" y1="20" x2="80" y2="90" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 80 76 L 92 76 L 92 90" fill="none" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="80" cy="90" r="3.5" fill="#10b981" />
        <text x="74" y="106" fill="#34d399" fontWeight="900" fontSize="12" fontFamily="sans-serif">Η</text>

        {/* Πλάγιες ΑΜ, ΑΝ */}
        <line x1="80" y1="20" x2="140" y2="90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        <circle cx="140" cy="90" r="3" fill="#94a3b8" />
        <text x="138" y="106" fill="#94a3b8" fontWeight="700" fontSize="12" fontFamily="sans-serif">Μ</text>

        <line x1="80" y1="20" x2="190" y2="90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        <circle cx="190" cy="90" r="3" fill="#94a3b8" />
        <text x="188" y="106" fill="#94a3b8" fontWeight="700" fontSize="12" fontFamily="sans-serif">Ν</text>

        {/* Σημείο Α */}
        <circle cx="80" cy="20" r="5" fill="#f43f5e" />
        <text x="74" y="12" fill="#f43f5e" fontWeight="900" fontSize="15" fontFamily="sans-serif">Α</text>
      </svg>
    )
  }
];

// Pool Κατηγορίας 2: Θεωρητικές Ιδιότητες - 4 Επιλογές (ΟΜΑΔΑ Α)
const PROPERTIES_POOL = [
  {
    q: 'Τι είδους γωνία σχηματίζει το ευθύγραμμο τμήμα της απόστασης ενός σημείου με την ευθεία;',
    correct: 'Ορθή γωνία (90°)',
    wrongs: ['Οξεία γωνία (λιγότερο από 90°)', 'Αμβλεία γωνία (περισσότερο από 90°)', 'Ευθεία γωνία (180°)'],
    explainText: 'Το τμήμα της απόστασης είναι πάντοτε κάθετο στην ευθεία, άρα σχηματίζει γωνία ακριβώς 90°.'
  },
  {
    q: 'Ποιο γεωμετρικό όργανο χρησιμοποιούμε απαραίτητα για να φέρουμε την κάθετη γραμμή από ένα σημείο σε μια ευθεία;',
    correct: 'Τον γνώμονα',
    wrongs: ['Μόνο τον χάρακα', 'Μόνο τον διαβήτη', 'Το μοιρογνωμόνιο'],
    explainText: 'Ο γνώμονας μας εξασφαλίζει τη σχεδίαση ορθής γωνίας (90°) ανάμεσα στο σημείο και την ευθεία.'
  },
  {
    q: 'Αν φέρουμε από ένα σημείο Α προς μια ευθεία 5 διαφορετικά ευθύγραμμα τμήματα, ποιο θα έχει πάντοτε το ΜΙΚΡΟΤΕΡΟ μήκος;',
    correct: 'Το κάθετο τμήμα',
    wrongs: ['Το πιο πλάγιο τμήμα', 'Το τμήμα που καταλήγει πιο δεξιά', 'Όλα θα έχουν ακριβώς το ίδιο μήκος'],
    explainText: 'Στη γεωμετρία, το κάθετο τμήμα είναι αυστηρά η συντομότερη διαδρομή από ένα σημείο προς μια ευθεία.'
  },
  {
    q: 'Πώς ονομάζεται το σημείο Η στο οποίο η κάθετος από το σημείο Α συναντά την ευθεία;',
    correct: 'Ίχνος της καθέτου',
    wrongs: ['Κορυφή της ευθείας', 'Κέντρο απόστασης', 'Σημείο τομής πλάγιων'],
    explainText: 'Το σημείο επαφής της καθέτου πάνω στην ευθεία ονομάζεται ίχνος της καθέτου.'
  }
];

// Pool Κατηγορίας 3: Σύγκριση Μηκών
function makeComparisonQuestion(prevQuestion = null) {
  let ah, az;
  while (true) {
    ah = getRandomInt(3, 12); // Κάθετο (πάντα μικρότερο)
    az = ah + getRandomInt(2, 6); // Πλάγιο (πάντα μεγαλύτερο)

    if (!prevQuestion || prevQuestion.ah !== ah) break;
  }

  return {
    ah,
    az,
    exprA: `Κάθετο (ΑΗ) ＝ ${ah} cm`,
    exprB: `Πλάγιο (ΑΖ) ＝ ${az} cm`,
    correct: '＜',
    explainText: `Το κάθετο ευθύγραμμο τμήμα είναι πάντοτε μικρότερο από οποιοδήποτε πλάγιο τμήμα: ${ah} cm ＜ ${az} cm.`
  };
}

// Pool Κατηγορίας 4: Σωστό / Λάθος
const TRUE_FALSE_POOL = [
  {
    q: 'Η απόσταση ενός σημείου από μια ευθεία είναι η συντομότερη δυνατή διαδρομή ανάμεσά τους.',
    correct: 'Σωστό',
    explain: 'Το κάθετο ευθύγραμμο τμήμα έχει πάντοτε το μικρότερο δυνατό μήκος.'
  },
  {
    q: 'Μπορούμε να μετρήσουμε την απόσταση ενός σημείου από μια ευθεία φέρνοντας μια οποιαδήποτε πλάγια γραμμή.',
    correct: 'Λάθος',
    explain: 'Η απόσταση μετριέται αποκλειστικά και μόνο κατά μήκος του κάθετου ευθύγραμμου τμήματος.'
  },
  {
    q: 'Όλα τα πλάγια ευθύγραμμα τμήματα που ξεκινούν από το σημείο Α προς την ευθεία είναι μεγαλύτερα από το κάθετο τμήμα.',
    correct: 'Σωστό',
    explain: 'Κάθε πλάγιο τμήμα αποτελεί υποτείνουσα σε ορθογώνιο τρίγωνο, άρα είναι πάντα μεγαλύτερο από την κάθετη απόσταση.'
  },
  {
    q: 'Αν ένα σημείο Α βρίσκεται ήδη πάνω στην ευθεία (ε), τότε η απόστασή του από την ευθεία είναι 0 cm.',
    correct: 'Σωστό',
    explain: 'Όταν το σημείο ανήκει στην ευθεία, η απόστασή του από αυτήν ισούται ακριβώς με μηδέν.'
  }
];

// ----------------------------------------------------
// GENERATOR 8 ΑΣΚΗΣΕΩΝ ΜΕ ΕΓΓΥΗΜΕΝΗ ΜΟΝΑΔΙΚΟΤΗΤΑ
// ----------------------------------------------------
function generateQuestions() {
  const prepareMcq = (item) => {
    const options = [
      { text: item.correct, isCorrect: true },
      ...item.wrongs.slice(0, 3).map((w) => ({ text: w, isCorrect: false }))
    ];
    return { ...item, options: options.sort(() => Math.random() - 0.5) };
  };

  // Q1 & Q2: Σχήματα
  const q1 = prepareMcq(SHAPE_POOL[0]);
  const q2 = prepareMcq(SHAPE_POOL[1]);

  // Q3 & Q4: Ιδιότητες
  const p1 = PROPERTIES_POOL[getRandomInt(0, PROPERTIES_POOL.length - 1)];
  let p2;
  while (true) {
    p2 = PROPERTIES_POOL[getRandomInt(0, PROPERTIES_POOL.length - 1)];
    if (p2.q !== p1.q) break;
  }

  // Q5 & Q6: Σύγκριση Μηκών
  const q5 = makeComparisonQuestion();
  const q6 = makeComparisonQuestion(q5);

  // Q7 & Q8: Σωστό / Λάθος
  const tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return {
    q1,
    q2,
    q3: prepareMcq(p1),
    q4: prepareMcq(p2),
    q5,
    q6,
    q7: tf1,
    q8: tf2
  };
}

export default function ApostasiAskPage() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions());
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, []);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    if (answers.q1 === questions.q1.correct) currentScore += 1;
    if (answers.q2 === questions.q2.correct) currentScore += 1;
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render MCQ (Q1 - Q4, 4 Επιλογές)
  const renderMcqQuestion = (qKey, qData, numLabel, colorClass) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className={`${colorClass} text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}>
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        {qData.svg && <div className="mb-4">{qData.svg}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt.text;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/80 font-bold text-teal-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${qKey}-opt-${idx}`}
                  name={qKey}
                  value={opt.text}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt.text)}
                  disabled={submitted}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500 shrink-0"
                />
                <span className="leading-snug">{opt.text}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η σωστή απάντηση είναι: <strong className="font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Σύγκριση Μηκών (Q5 & Q6)
  const renderComparison = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-indigo-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            Σύγκρινε το μήκος του κάθετου τμήματος με το πλάγιο τμήμα ( ＜ , ＝ , ＞ ):
          </h3>
        </div>

        <div className="sm:pl-11 space-y-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-base sm:text-xl font-mono font-black text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-emerald-700">{qData.exprA}</span>

            <div className="flex gap-2">
              {['＜', '＝', '＞'].map((sym) => (
                <button
                  type="button"
                  key={sym}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleInputChange(qKey, sym);
                  }}
                  disabled={submitted}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-lg sm:text-xl font-black border transition active:scale-95 touch-manipulation select-none flex items-center justify-center ${
                    answers[qKey] === sym
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>

            <span className="text-slate-600">{qData.exprB}</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Το ορθό σύμβολο είναι το «{qData.correct}». {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Σωστό / Λάθος (Q7 & Q8)
  const renderTrueFalse = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-amber-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        <div className="flex gap-3 sm:pl-11">
          {['Σωστό', 'Λάθος'].map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => handleInputChange(qKey, opt)}
              disabled={submitted}
              className={`px-6 sm:px-8 py-3 rounded-2xl font-black text-sm sm:text-base border transition active:scale-95 touch-manipulation select-none ${
                answers[qKey] === opt
                  ? (opt === 'Σωστό' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-rose-600 text-white border-rose-700 shadow-md')
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explain}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η ορθή απάντηση είναι «{qData.correct}». {qData.explain}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Απόσταση Σημείου από Ευθεία | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στην απόσταση σημείου από ευθεία: αναγνώριση κάθετου τμήματος, σύγκριση με πλάγια τμήματα και θεωρητικές ιδιότητες."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/14-apostasi-simeiou-eutheia"
          className="bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Απόσταση Σημείου από Ευθεία
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», τα σχήματα και οι αριθμοί ανανεώνονται αυτόματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-teal-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderMcqQuestion('q1', questions.q1, 1, 'bg-teal-600')}
          {renderMcqQuestion('q2', questions.q2, 2, 'bg-teal-600')}

          {renderMcqQuestion('q3', questions.q3, 3, 'bg-emerald-600')}
          {renderMcqQuestion('q4', questions.q4, 4, 'bg-emerald-600')}

          {renderComparison('q5', questions.q5, 5)}
          {renderComparison('q6', questions.q6, 6)}

          {renderTrueFalse('q7', questions.q7, 7)}
          {renderTrueFalse('q8', questions.q8, 8)}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 Έλεγχος Απαντήσεων
              </button>
            </div>
          )}
        </form>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                Επιτυχία: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

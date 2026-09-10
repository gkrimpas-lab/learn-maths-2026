// pages/d-dimotikou/13-paralliles-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΕΡΩΤΗΣΕΩΝ (POOLS)
// ----------------------------------------------------

// Pool Κατηγορίας 1: Αναγνώριση από Σχήμα (SVG) - 4 Επιλογές (ΟΜΑΔΑ Α)
const SHAPE_POOL = [
  {
    type: 'parallel',
    question: 'Τι είδος ευθειών απεικονίζεται στο παρακάτω γεωμετρικό σχήμα;',
    correct: 'Παράλληλες ευθείες',
    wrongs: ['Τεμνόμενες μη κάθετες ευθείες', 'Κάθετες ευθείες', 'Συμπίπτουσες ευθείες'],
    explainText: 'Οι δύο ευθείες διατηρούν σταθερή απόσταση σε όλο το μήκος τους και δεν συναντιούνται ποτέ (ε₁ ∥ ε₂).',
    svg: (
      <svg className="w-56 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
        <line x1="20" y1="30" x2="180" y2="30" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
        <line x1="20" y1="70" x2="180" y2="70" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
        <text x="185" y="34" fill="#93c5fd" fontSize="12" fontWeight="900" fontFamily="sans-serif">ε₁</text>
        <text x="185" y="74" fill="#93c5fd" fontSize="12" fontWeight="900" fontFamily="sans-serif">ε₂</text>
      </svg>
    )
  },
  {
    type: 'intersecting',
    question: 'Τι είδος ευθειών απεικονίζεται στο παρακάτω γεωμετρικό σχήμα;',
    correct: 'Τεμνόμενες ευθείες',
    wrongs: ['Παράλληλες ευθείες', 'Κάθετες ευθείες (90°)', 'Ευθείες που δεν τέμνονται'],
    explainText: 'Οι δύο ευθείες διασταυρώνονται και συναντιούνται σε ένα ακριβώς κοινό σημείο, το σημείο τομής Σ.',
    svg: (
      <svg className="w-56 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
        <line x1="30" y1="20" x2="170" y2="80" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
        <line x1="30" y1="80" x2="170" y2="20" stroke="#e879f9" strokeWidth="4" strokeLinecap="round" />
        <circle cx="100" cy="50" r="5" fill="#f43f5e" />
        <text x="108" y="46" fill="#f43f5e" fontSize="14" fontWeight="900" fontFamily="sans-serif">Σ</text>
        <text x="175" y="85" fill="#c084fc" fontSize="12" fontWeight="900" fontFamily="sans-serif">ε₁</text>
        <text x="175" y="24" fill="#f0abfc" fontSize="12" fontWeight="900" fontFamily="sans-serif">ε₂</text>
      </svg>
    )
  },
  {
    type: 'perpendicular',
    question: 'Τι είδος ευθειών απεικονίζεται στο παρακάτω γεωμετρικό σχήμα;',
    correct: 'Κάθετες ευθείες',
    wrongs: ['Παράλληλες ευθείες', 'Τεμνόμενες μη κάθετες ευθείες', 'Ευθείες σταθερής απόστασης'],
    explainText: 'Οι δύο ευθείες τέμνονται σχηματίζοντας ορθή γωνία 90° στο σημείο τομής τους (ε₁ ⊥ ε₂).',
    svg: (
      <svg className="w-56 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
        <line x1="20" y1="50" x2="180" y2="50" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
        <line x1="100" y1="12" x2="100" y2="88" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
        {/* Καθαρό γωνιακό σύμβολο L */}
        <path d="M 100 36 L 114 36 L 114 50" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="100" cy="50" r="4.5" fill="#f43f5e" />
        <text x="86" y="66" fill="#f43f5e" fontSize="13" fontWeight="900" fontFamily="sans-serif">Σ</text>
        <text x="184" y="54" fill="#34d399" fontSize="12" fontWeight="900" fontFamily="sans-serif">ε₁</text>
        <text x="105" y="22" fill="#6ee7b7" fontSize="12" fontWeight="900" fontFamily="sans-serif">ε₂</text>
      </svg>
    )
  }
];

// Pool Κατηγορίας 2: Σύμβολα & Ορολογία - 4 Επιλογές (ΟΜΑΔΑ Α)
const SYMBOLS_POOL = [
  {
    q: 'Ποιο μαθηματικό σύμβολο χρησιμοποιούμε για να δηλώσουμε ότι δύο ευθείες είναι παράλληλες;',
    correct: '∥',
    wrongs: ['⊥', '＝', '≠'],
    explainText: 'Το σύμβολο των παράλληλων ευθειών είναι το «∥» (γράφουμε ε₁ ∥ ε₂).'
  },
  {
    q: 'Ποιο μαθηματικό σύμβολο χρησιμοποιούμε για να δηλώσουμε ότι δύο ευθείες είναι κάθετες μεταξύ τους;',
    correct: '⊥',
    wrongs: ['∥', 'Δ', '×'],
    explainText: 'Το σύμβολο της καθετότητας είναι το «⊥» (γράφουμε ε₁ ⊥ ε₂).'
  },
  {
    q: 'Πώς ονομάζεται το μοναδικό κοινό σημείο στο οποίο συναντιούνται δύο τεμνόμενες ευθείες;',
    correct: 'Σημείο τομής',
    wrongs: ['Σημείο επαφής', 'Κορυφή γωνίας', 'Μέσο ευθείας'],
    explainText: 'Το σημείο διασταύρωσης δύο τεμνόμενων ευθειών ονομάζεται σημείο τομής (συμβολίζεται συνήθως με Σ).'
  },
  {
    q: 'Τι είδους γωνία σχηματίζουν μεταξύ τους δύο κάθετες ευθείες στο σημείο τομής;',
    correct: 'Ορθή γωνία (90°)',
    wrongs: ['Οξεία γωνία (κάτω από 90°)', 'Αμβλεία γωνία (πάνω από 90°)', 'Ευθεία γωνία (180°)'],
    explainText: 'Δύο ευθείες είναι κάθετες όταν τέμνονται σχηματίζοντας ακριβώς ορθές γωνίες 90°.'
  }
];

// Pool Κατηγορίας 3: Καθημερινή Ζωή - 4 Επιλογές (ΟΜΑΔΑ Α)
const REAL_LIFE_POOL = [
  {
    q: 'Οι οριζόντιες γραμμές ενός ριγέ σχολικού τετραδίου είναι χαρακτηριστικό παράδειγμα:',
    correct: 'Παράλληλων ευθειών',
    wrongs: ['Τεμνόμενων μη κάθετων ευθειών', 'Κάθετων ευθειών', 'Τεθλασμένων γραμμών'],
    explainText: 'Οι γραμμές του τετραδίου διατηρούν ίση απόσταση και δεν τέμνονται ποτέ, άρα είναι παράλληλες.'
  },
  {
    q: 'Οι δύο σιδηροτροχιές (ράγες) στις οποίες κινείται ένα τρένο αποτελούν παράδειγμα:',
    correct: 'Παράλληλων ευθειών',
    wrongs: ['Τεμνόμενων ευθειών', 'Κάθετων ευθειών', 'Καμπύλων γραμμών'],
    explainText: 'Οι ράγες του τρένου έχουν πάντοτε σταθερή απόσταση μεταξύ τους ώστε να κινείται με ασφάλεια ο συρμός.'
  },
  {
    q: 'Οι δύο δείκτες ενός αναλογικού ρολογιού όταν η ώρα δείχνει ακριβώς 3:00 είναι:',
    correct: 'Κάθετες ευθείες',
    wrongs: ['Παράλληλες ευθείες', 'Τεμνόμενες μη κάθετες ευθείες', 'Συμπίπτουσες ευθείες'],
    explainText: 'Στις 3:00 ο ωροδείκτης και ο λεπτοδείκτης σχηματίζουν ακριβώς ορθή γωνία 90°, άρα είναι κάθετοι.'
  },
  {
    q: 'Η διασταύρωση δύο δρόμων σε ένα σταυροδρόμι θυμίζει γεωμετρικά:',
    correct: 'Τεμνόμενες ευθείες',
    wrongs: ['Παράλληλες ευθείες', 'Ευθείες που δεν συναντιούνται', 'Κυκλικές τροχιές'],
    explainText: 'Δύο δρόμοι που διασταυρώνονται συναντιούνται σε κοινό σημείο, ακριβώς όπως οι τεμνόμενες ευθείες.'
  },
  {
    q: 'Οι απέναντι πλευρές ενός ορθογώνιου πίνακα στην τάξη είναι μεταξύ τους:',
    correct: 'Παράλληλες ευθείες',
    wrongs: ['Κάθετες ευθείες', 'Τεμνόμενες σε μία γωνία', 'Τυχαίες ευθείες'],
    explainText: 'Σε κάθε ορθογώνιο, οι απέναντι πλευρές είναι παράλληλες και ίσες μεταξύ τους.'
  },
  {
    q: 'Οι δύο διπλανές (διαδοχικές) πλευρές μιας πόρτας που ενώνονται σε μια γωνία είναι:',
    correct: 'Κάθετες ευθείες',
    wrongs: ['Παράλληλες ευθείες', 'Ευθείες που δεν τέμνονται', 'Ευθείες με οξεία γωνία'],
    explainText: 'Οι διαδοχικές πλευρές μιας πόρτας σχηματίζουν ορθή γωνία 90°, συνεπώς είναι κάθετες.'
  }
];

// Pool Κατηγορίας 4: Σωστό / Λάθος
const TRUE_FALSE_POOL = [
  {
    q: 'Δύο παράλληλες ευθείες θα συναντηθούν σε κάποιο σημείο αν τις προεκτείνουμε πάρα πολύ.',
    correct: 'Λάθος',
    explain: 'Οι παράλληλες ευθείες δεν συναντιούνται ποτέ, ανεξάρτητα από το πόσο μακριά τις προεκτείνουμε.'
  },
  {
    q: 'Οι κάθετες ευθείες αποτελούν μια ειδική κατηγορία τεμνόμενων ευθειών.',
    correct: 'Σωστό',
    explain: 'Οι κάθετες ευθείες τέμνονται σε ένα σημείο και σχηματίζουν ορθή γωνία (90°).'
  },
  {
    q: 'Δύο τεμνόμενες ευθείες μπορούν να συναντηθούν σε 2 ή περισσότερα διαφορετικά σημεία.',
    correct: 'Λάθος',
    explain: 'Δύο ευθείες στο επίπεδο μπορούν να συναντηθούν το πολύ σε ένα μοναδικό σημείο τομής.'
  },
  {
    q: 'Η απόσταση ανάμεσα σε δύο παράλληλες ευθείες παραμένει πάντοτε η ίδια σε όλα τα σημεία.',
    correct: 'Σωστό',
    explain: 'Η σταθερή απόσταση είναι η βασική ιδιότητα που διακρίνει τις παράλληλες ευθείες.'
  }
];

// ----------------------------------------------------
// GENERATOR 8 ΑΣΚΗΣΕΩΝ ΜΕ ΕΓΓΥΗΜΕΝΗ ΜΟΝΑΔΙΚΟΤΗΤΑ
// ----------------------------------------------------
function generateQuestions() {
  // Q1 & Q2: Σχήματα (SVG)
  const s1 = SHAPE_POOL[getRandomInt(0, SHAPE_POOL.length - 1)];
  let s2;
  while (true) {
    s2 = SHAPE_POOL[getRandomInt(0, SHAPE_POOL.length - 1)];
    if (s2.type !== s1.type) break;
  }

  // Q3 & Q4: Σύμβολα
  const sym1 = SYMBOLS_POOL[getRandomInt(0, SYMBOLS_POOL.length - 1)];
  let sym2;
  while (true) {
    sym2 = SYMBOLS_POOL[getRandomInt(0, SYMBOLS_POOL.length - 1)];
    if (sym2.q !== sym1.q) break;
  }

  // Q5 & Q6: Καθημερινή ζωή
  const r1 = REAL_LIFE_POOL[getRandomInt(0, REAL_LIFE_POOL.length - 1)];
  let r2;
  while (true) {
    r2 = REAL_LIFE_POOL[getRandomInt(0, REAL_LIFE_POOL.length - 1)];
    if (r2.q !== r1.q) break;
  }

  // Q7 & Q8: Σωστό / Λάθος
  const tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  const prepareMcq = (item) => {
    const options = [
      { text: item.correct, isCorrect: true },
      ...item.wrongs.slice(0, 3).map((w) => ({ text: w, isCorrect: false }))
    ];
    return { ...item, options: options.sort(() => Math.random() - 0.5) };
  };

  return {
    q1: prepareMcq(s1),
    q2: prepareMcq(s2),
    q3: prepareMcq(sym1),
    q4: prepareMcq(sym2),
    q5: prepareMcq(r1),
    q6: prepareMcq(r2),
    q7: tf1,
    q8: tf2
  };
}

export default function ParallilesAskPage() {
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

  // Render MCQ Ασκήσεων (Q1 - Q6, 4 Επιλογές)
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
            {qData.question || qData.q}
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
                    ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-sm'
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
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0"
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
      title="Ασκήσεις: Παράλληλες & Τεμνόμενες Ευθείες | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στις παράλληλες, τεμνόμενες και κάθετες ευθείες: αναγνώριση σχημάτων, σύμβολα και εφαρμογές στην καθημερινότητα."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/13-paralliles"
          className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Παράλληλες και Τεμνόμενες Ευθείες
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», τα σχήματα και οι ερωτήσεις ανανεώνονται αυτόματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-blue-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderMcqQuestion('q1', questions.q1, 1, 'bg-blue-600')}
          {renderMcqQuestion('q2', questions.q2, 2, 'bg-blue-600')}

          {renderMcqQuestion('q3', questions.q3, 3, 'bg-indigo-600')}
          {renderMcqQuestion('q4', questions.q4, 4, 'bg-indigo-600')}

          {renderMcqQuestion('q5', questions.q5, 5, 'bg-purple-600')}
          {renderMcqQuestion('q6', questions.q6, 6, 'bg-purple-600')}

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

// pages/d-dimotikou/18-simmetria-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΗ 1: ΣΧΗΜΑΤΑ ΘΕΩΡΙΑΣ ΜΕ ΚΑΘΑΡΑ SVG (ΧΩΡΙΣ ΑΞΟΝΕΣ)
// ----------------------------------------------------
const THEORY_SHAPES_POOL = [
  {
    name: 'Τετράγωνο',
    correct: 4,
    explainText: 'Το τετράγωνο έχει ακριβώς 4 άξονες συμμετρίας: 1 κατακόρυφο, 1 οριζόντιο και 2 διαγώνιους.',
    svg: (
      <svg className="w-52 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 120">
        <rect x="65" y="25" width="70" height="70" rx="3" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" />
      </svg>
    )
  },
  {
    name: 'Ορθογώνιο Παραλληλόγραμμο',
    correct: 2,
    explainText: 'Το ορθογώνιο έχει 2 άξονες συμμετρίας (1 κατακόρυφο και 1 οριζόντιο). Οι διαγώνιοί του δεν είναι άξονες συμμετρίας.',
    svg: (
      <svg className="w-56 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 220 120">
        <rect x="40" y="30" width="140" height="60" rx="3" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" />
      </svg>
    )
  },
  {
    name: 'Ισοσκελές Τρίγωνο',
    correct: 1,
    explainText: 'Το ισοσκελές τρίγωνο (με 2 ίσες πλευρές) έχει μόνο 1 κατακόρυφο άξονα συμμετρίας που διέρχεται από την κορυφή του.',
    svg: (
      <svg className="w-52 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 120">
        <polygon points="100,20 45,95 155,95" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Ρόμβος',
    correct: 2,
    explainText: 'Ο ρόμβος έχει 2 άξονες συμμετρίας, οι οποίοι συμπίπτουν ακριβώς με τις δύο διαγώνιές του.',
    svg: (
      <svg className="w-52 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 120">
        <polygon points="100,15 155,60 100,105 45,60" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Ισόπλευρο Τρίγωνο',
    correct: 3,
    explainText: 'Το ισόπλευρο τρίγωνο (με 3 ίσες πλευρές) έχει 3 άξονες συμμετρίας, έναν από κάθε κορυφή του.',
    svg: (
      <svg className="w-52 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 120">
        <polygon points="100,20 50,100 150,100" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Σκαληνό Τρίγωνο',
    correct: 0,
    explainText: 'Το σκαληνό τρίγωνο (με όλες τις πλευρές και γωνίες άνισες) δεν έχει κανέναν άξονα συμμετρίας (0).',
    svg: (
      <svg className="w-52 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 120">
        <polygon points="60,25 40,95 170,95" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" strokeLinejoin="round" />
      </svg>
    )
  }
];

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΗ 2: ΥΠΟΛΟΓΙΣΜΟΙ ΠΕΡΙΜΕΤΡΟΥ & ΕΜΒΑΔΟΥ
// ----------------------------------------------------
function makeMathSymmetryQuestion(isArea = true) {
  if (isArea) {
    const halfArea = getRandomInt(12, 45);
    const totalArea = halfArea * 2;
    const mode = Math.random() > 0.5 ? 'findTotal' : 'findHalf';

    if (mode === 'findTotal') {
      return {
        q: `Ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο ίσα μέρη. Αν το ένα μέρος έχει εμβαδόν ${halfArea} cm², πόσο είναι το συνολικό εμβαδόν του σχήματος;`,
        correct: totalArea,
        unit: 'cm²',
        explainText: `Επειδή τα δύο μέρη είναι απολύτως ίσα, το συνολικό εμβαδόν είναι: ${halfArea} ＋ ${halfArea} ＝ ${totalArea} cm² (ή 2 · ${halfArea} ＝ ${totalArea} cm²).`
      };
    } else {
      return {
        q: `Ένα σχήμα έχει συνολικό εμβαδόν ${totalArea} cm². Ένας άξονας συμμετρίας το χωρίζει σε δύο ίσα μέρη. Πόσο εμβαδόν έχει το κάθε μέρος;`,
        correct: halfArea,
        unit: 'cm²',
        explainText: `Ο άξονας συμμετρίας χωρίζει το εμβαδόν σε δύο ίσα μέρη: ${totalArea} ： 2 ＝ ${halfArea} cm².`
      };
    }
  } else {
    const halfPerimeter = getRandomInt(14, 38);
    return {
      q: `Ένας άξονας συμμετρίας χωρίζει ένα γεωμετρικό σχήμα σε δύο συμμετρικά μέρη. Αν το πρώτο μέρος έχει περίμετρο ${halfPerimeter} cm, πόση είναι η περίμετρος του δεύτερου μέρους;`,
      correct: halfPerimeter,
      unit: 'cm',
      explainText: `Τα συμμετρικά μέρη ως προς άξονα είναι ίσα μεταξύ τους, επομένως έχουν ακριβώς την ίδια περίμετρο: ${halfPerimeter} cm.`
    };
  }
}

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΗ 3: 30+ ΠΡΟΤΑΣΕΙΣ ΣΩΣΤΟΥ / ΛΑΘΟΥΣ
// (Χωρίς «Σωστά!» ή «Λάθος!» στο κείμενο explain)
// ----------------------------------------------------
const TRUE_FALSE_POOL = [
  {
    q: 'Ο άξονας συμμετρίας χωρίζει ένα γεωμετρικό σχήμα σε δύο ακριβώς ίδια μέρη.',
    correct: 'Σωστό',
    explain: 'Αν διπλώσουμε το σχήμα κατά μήκος του άξονα συμμετρίας, τα δύο μέρη ταυτίζονται απόλυτα.'
  },
  {
    q: 'Τα δύο συμμετρικά μέρη ενός σχήματος έχουν πάντοτε ακριβώς την ίδια περίμετρο.',
    correct: 'Σωστό',
    explain: 'Επειδή τα δύο μέρη είναι γεωμετρικά ίσα, τα περιγράμματά τους έχουν το ίδιο συνολικό μήκος.'
  },
  {
    q: 'Τα δύο συμμετρικά μέρη ενός σχήματος καλύπτουν πάντοτε ακριβώς το ίδιο εμβαδόν.',
    correct: 'Σωστό',
    explain: 'Η συμμετρία ως προς άξονα διατηρεί αναλλοίωτη την επιφάνεια των δύο τμημάτων.'
  },
  {
    q: 'Το τετράγωνο έχει συνολικά 4 άξονες συμμετρίας.',
    correct: 'Σωστό',
    explain: 'Το τετράγωνο έχει 1 κατακόρυφο, 1 οριζόντιο και 2 διαγώνιους άξονες συμμετρίας.'
  },
  {
    q: 'Οι διαγώνιοι ενός ορθογωνίου παραλληλογράμμου είναι άξονες συμμετρίας του.',
    correct: 'Λάθος',
    explain: 'Αν διπλώσουμε ένα ορθογώνιο κατά μήκος της διαγωνίου του, τα δύο μέρη δεν ταυτίζονται.'
  },
  {
    q: 'Ο κύκλος έχει συνολικά μόνο 2 άξονες συμμετρίας.',
    correct: 'Λάθος',
    explain: 'Ο κύκλος έχει άπειρους (αμέτρητους) άξονες συμμετρίας, αφού κάθε διάμετρός του είναι άξονας συμμετρίας.'
  },
  {
    q: 'Υπάρχουν επίπεδα σχήματα που δεν έχουν κανέναν άξονα συμμετρίας.',
    correct: 'Σωστό',
    explain: 'Χαρακτηριστικό παράδειγμα είναι το σκαληνό τρίγωνο, το οποίο έχει 0 άξονες συμμετρίας.'
  },
  {
    q: 'Το ισοσκελές τρίγωνο έχει συνολικά 3 άξονες συμμετρίας.',
    correct: 'Λάθος',
    explain: 'Το ισοσκελές τρίγωνο έχει μόνο 1 άξονα συμμετρίας, ενώ 3 άξονες έχει μόνο το ισόπλευρο τρίγωνο.'
  },
  {
    q: 'Ο ρόμβος έχει 2 άξονες συμμετρίας που συμπίπτουν με τις διαγώνιές του.',
    correct: 'Σωστό',
    explain: 'Οι δύο διαγώνιοι του ρόμβου χωρίζουν το σχήμα σε συμμετρικά μέρη που ταυτίζονται κατά την αναδίπλωση.'
  },
  {
    q: 'Αν διπλώσουμε ένα σχήμα στον άξονα συμμετρίας του, τα δύο μέρη θα περισσεύουν το ένα από το άλλο.',
    correct: 'Λάθος',
    explain: 'Στον άξονα συμμετρίας τα δύο τμήματα εφαρμόζουν ακριβώς και ταυτίζονται τέλεια.'
  },
  {
    q: 'Το κεφαλαίο γράμμα «Α» έχει έναν κατακόρυφο άξονα συμμετρίας.',
    correct: 'Σωστό',
    explain: 'Μια κατακόρυφη ευθεία στη μέση χωρίζει το γράμμα «Α» σε δύο πανομοιότυπα συμμετρικά μισά.'
  },
  {
    q: 'Το κεφαλαίο γράμμα «Ο» έχει περισσότερους από έναν άξονες συμμετρίας.',
    correct: 'Σωστό',
    explain: 'Το γράμμα «Ο» διαθέτει τόσο κατακόρυφο όσο και οριζόντιο άξονα συμμετρίας.'
  },
  {
    q: 'Το κεφαλαίο γράμμα «F» έχει έναν οριζόντιο άξονα συμμετρίας.',
    correct: 'Λάθος',
    explain: 'Το γράμμα «F» είναι ασύμμετρο και δεν διαθέτει κανέναν άξονα συμμετρίας.'
  },
  {
    q: 'Μια πεταλούδα με ανοιγμένα τα φτερά της παρουσιάζει κατακόρυφο άξονα συμμετρίας.',
    correct: 'Σωστό',
    explain: 'Το αριστερό και το δεξί φτερό της πεταλούδας είναι συμμετρικά ως προς τον κατακόρυφο άξονα του σώματός της.'
  },
  {
    q: 'Όλα τα είδη τριγώνων έχουν οπωσδήποτε τουλάχιστον 1 άξονα συμμετρίας.',
    correct: 'Λάθος',
    explain: 'Τα σκαληνά τρίγωνα έχουν όλες τις πλευρές και γωνίες τους άνισες και έχουν 0 άξονες συμμετρίας.'
  },
  {
    q: 'Αν δύο γεωμετρικά σχήματα είναι συμμετρικά ως προς άξονα, τότε είναι οπωσδήποτε ίσα μεταξύ τους.',
    correct: 'Σωστό',
    explain: 'Η αξονική συμμετρία διατηρεί αναλλοίωτα όλα τα μήκη των πλευρών, τις γωνίες και τα εμβαδά.'
  },
  {
    q: 'Η τσάκιση σε ένα φύλλο χαρτιού που το χωρίζει ακριβώς στη μέση λειτουργεί ως άξονας συμμετρίας.',
    correct: 'Σωστό',
    explain: 'Η γραμμή αναδίπλωσης όπου τα δύο μέρη εφαρμόζουν τέλεια αποτελεί την πρακτική απόδειξη του άξονα συμμετρίας.'
  }
];

// ----------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 8 ΕΡΩΤΗΣΕΩΝ
// ----------------------------------------------------
function generateQuestions() {
  // Q1 & Q2: Πλήθος αξόνων με SVG Σχήμα
  const item1 = THEORY_SHAPES_POOL[getRandomInt(0, THEORY_SHAPES_POOL.length - 1)];
  let item2;
  while (true) {
    item2 = THEORY_SHAPES_POOL[getRandomInt(0, THEORY_SHAPES_POOL.length - 1)];
    if (item2.name !== item1.name) break;
  }

  const q1 = {
    q: `Πόσους άξονες συμμετρίας έχει το παρακάτω σχήμα («${item1.name}»);`,
    correct: item1.correct,
    unit: 'άξονες',
    explainText: item1.explainText,
    svg: item1.svg
  };

  const q2 = {
    q: `Πόσους άξονες συμμετρίας έχει το παρακάτω σχήμα («${item2.name}»);`,
    correct: item2.correct,
    unit: 'άξονες',
    explainText: item2.explainText,
    svg: item2.svg
  };

  // Q3 & Q4: Υπολογισμοί Εμβαδού & Περιμέτρου
  const q3 = makeMathSymmetryQuestion(true);
  const q4 = makeMathSymmetryQuestion(false);

  // Q5 & Q6: MCQ Αναγνώριση & Ιδιότητες (ΟΜΑΔΑ Α - 4 Επιλογές)
  const mcqOptions1 = [
    { text: 'Έχουν ακριβώς ίδια περίμετρο και ίδιο εμβαδόν', isCorrect: true },
    { text: 'Έχουν ίδια περίμετρο αλλά διαφορετικό εμβαδόν', isCorrect: false },
    { text: 'Έχουν ίδιο εμβαδόν αλλά διαφορετική περίμετρο', isCorrect: false },
    { text: 'Δεν έχουν καμία κοινή γεωμετρική σχέση', isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  const q5 = {
    q: 'Όταν ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο μέρη, ποια σχέση ισχύει για τα δύο αυτά μέρη;',
    correct: 'Έχουν ακριβώς ίδια περίμετρο και ίδιο εμβαδόν',
    options: mcqOptions1,
    explainText: 'Επειδή τα συμμετρικά μέρη ταυτίζονται τέλεια κατά την αναδίπλωση, έχουν υποχρεωτικά ίση περίμετρο και ίσο εμβαδόν.'
  };

  const mcqOptions2 = [
    { text: 'Το Τετράγωνο (4 άξονες)', isCorrect: true },
    { text: 'Το Ορθογώνιο (2 άξονες)', isCorrect: false },
    { text: 'Το Ισοσκελές Τρίγωνο (1 άξονας)', isCorrect: false },
    { text: 'Το Σκαληνό Τρίγωνο (0 άξονες)', isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  const q6 = {
    q: 'Ποιο από τα παρακάτω γεωμετρικά σχήματα διαθέτει τους ΠΕΡΙΣΣΟΤΕΡΟΥΣ άξονες συμμετρίας;',
    correct: 'Το Τετράγωνο (4 άξονες)',
    options: mcqOptions2,
    explainText: 'Το τετράγωνο έχει 4 άξονες συμμετρίας, το ορθογώνιο 2, το ισοσκελές 1 και το σκαληνό 0.'
  };

  // Q7 & Q8: Σωστό / Λάθος
  const tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return { q1, q2, q3, q4, q5, q6, q7: tf1, q8: tf2 };
}

export default function SimmetriaAskPage() {
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

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/\D/g, '');
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    if (parseInt(answers.q1, 10) === questions.q1.correct) currentScore += 1;
    if (parseInt(answers.q2, 10) === questions.q2.correct) currentScore += 1;
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Αριθμητικών Inputs (Q1 - Q4)
  const renderInputNumber = (qKey, qData, numLabel, colorClass) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
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

        {/* SVG Εικόνα Σχήματος (αν υπάρχει) */}
        {qData.svg && <div className="mb-4">{qData.svg}</div>}

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">Αποτέλεσμα:</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="Αριθμός"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-28 sm:w-36 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-purple-900 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
            />
            <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">{qData.unit}</span>
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
                Η σωστή απάντηση είναι <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)} {qData.unit}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render MCQ (Q5 & Q6, 4 Επιλογές)
  const renderMcqQuestion = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-pink-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt.text;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/80 font-bold text-purple-950 shadow-sm'
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
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 shrink-0"
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
          <span className="bg-indigo-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
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
                Η πρόταση είναι <strong className="font-bold text-rose-900">«{qData.correct}»</strong>: {qData.explain}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Συμμετρία και Άξονες | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στη συμμετρία: αναγνώριση πλήθους αξόνων από σχήμα, υπολογισμός περιμέτρου και εμβαδού συμμετρικών μερών."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/18-simmetria"
          className="bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Η Έννοια της Συμμετρίας
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», τα σχήματα και οι αριθμοί ανανεώνονται αυτόματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-purple-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderInputNumber('q1', questions.q1, 1, 'bg-purple-600')}
          {renderInputNumber('q2', questions.q2, 2, 'bg-purple-600')}

          {renderInputNumber('q3', questions.q3, 3, 'bg-pink-600')}
          {renderInputNumber('q4', questions.q4, 4, 'bg-pink-600')}

          {renderMcqQuestion('q5', questions.q5, 5)}
          {renderMcqQuestion('q6', questions.q6, 6)}

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

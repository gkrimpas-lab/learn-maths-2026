import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΗ 1: ΣΧΗΜΑΤΑ ΘΕΩΡΙΑΣ ΜΕ SVG ΟΠΤΙΚΟΠΟΙΗΣΗ
// ----------------------------------------------------
const THEORY_SHAPES_POOL = [
  {
    name: 'Τετράγωνο',
    correct: 4,
    explain: 'Το τετράγωνο έχει 4 άξονες συμμετρίας (1 κατακόρυφο, 1 οριζόντιο, 2 διαγώνιους).',
    svg: (
      <svg className="w-48 h-32 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 120">
        <rect x="65" y="25" width="70" height="70" fill="#a855f7" fillOpacity="0.3" stroke="#c084fc" strokeWidth="3" />
        {/* Διακεκομμένοι Άξονες */}
        <line x1="100" y1="15" x2="100" y2="105" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" />
        <line x1="55" y1="60" x2="145" y2="60" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,4" />
        <line x1="65" y1="25" x2="135" y2="95" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,4" />
        <line x1="135" y1="25" x2="65" y2="95" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,4" />
      </svg>
    )
  },
  {
    name: 'Ορθογώνιο Παραλληλόγραμμο',
    correct: 2,
    explain: 'Το ορθογώνιο έχει 2 άξονες συμμετρίας (1 κατακόρυφο και 1 οριζόντιο).',
    svg: (
      <svg className="w-52 h-32 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 220 120">
        <rect x="40" y="30" width="140" height="60" fill="#a855f7" fillOpacity="0.3" stroke="#c084fc" strokeWidth="3" />
        {/* Άξονες */}
        <line x1="110" y1="15" x2="110" y2="105" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" />
        <line x1="25" y1="60" x2="195" y2="60" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,4" />
      </svg>
    )
  },
  {
    name: 'Ισοσκελές Τρίγωνο',
    correct: 1,
    explain: 'Το ισοσκελές τρίγωνο έχει μόνο 1 κατακόρυφο άξονα συμμετρίας.',
    svg: (
      <svg className="w-48 h-32 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 120">
        <polygon points="100,20 45,95 155,95" fill="#a855f7" fillOpacity="0.3" stroke="#c084fc" strokeWidth="3" />
        {/* Άξονας */}
        <line x1="100" y1="10" x2="100" y2="105" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" />
      </svg>
    )
  },
  {
    name: 'Ρόμβος',
    correct: 2,
    explain: 'Ο ρόμβος έχει 2 άξονες συμμετρίας (τις 2 διαγώνιους του).',
    svg: (
      <svg className="w-48 h-32 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 120">
        <polygon points="100,15 155,60 100,105 45,60" fill="#a855f7" fillOpacity="0.3" stroke="#c084fc" strokeWidth="3" />
        {/* Άξονες */}
        <line x1="100" y1="5" x2="100" y2="115" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" />
        <line x1="30" y1="60" x2="170" y2="60" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,4" />
      </svg>
    )
  },
  {
    name: 'Ισόπλευρο Τρίγωνο',
    correct: 3,
    explain: 'Το ισόπλευρο τρίγωνο έχει 3 άξονες συμμετρίας.',
    svg: (
      <svg className="w-48 h-32 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 120">
        <polygon points="100,20 50,100 150,100" fill="#a855f7" fillOpacity="0.3" stroke="#c084fc" strokeWidth="3" />
        <line x1="100" y1="10" x2="100" y2="105" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" />
        <line x1="50" y1="100" x2="125" y2="60" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,4" />
        <line x1="150" y1="100" x2="75" y2="60" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,4" />
      </svg>
    )
  },
  {
    name: 'Σκαληνό Τρίγωνο',
    correct: 0,
    explain: 'Το σκαληνό τρίγωνο (με όλες τις πλευρές άνισες) έχει 0 άξονες συμμετρίας.',
    svg: (
      <svg className="w-48 h-32 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 120">
        <polygon points="60,25 40,95 170,95" fill="#a855f7" fillOpacity="0.3" stroke="#c084fc" strokeWidth="3" />
      </svg>
    )
  }
];

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΗ 2: ΥΠΟΛΟΓΙΣΜΟΙ ΠΕΡΙΜΕΤΡΟΥ & ΕΜΒΑΔΟΥ
// ----------------------------------------------------
function makeMathSymmetryQuestion(isArea = true) {
  if (isArea) {
    const halfArea = getRandomInt(10, 45);
    const totalArea = halfArea * 2;
    const mode = Math.random() > 0.5 ? 'findTotal' : 'findHalf';

    if (mode === 'findTotal') {
      return {
        q: `Ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο ίσα μέρη. Αν το ένα μέρος έχει εμβαδόν ${halfArea} cm², πόσο είναι το συνολικό εμβαδόν του σχήματος;`,
        correct: totalArea,
        unit: 'cm²',
        explain: `Αφού τα δύο μέρη είναι ίσα, το συνολικό εμβαδόν είναι ${halfArea} + ${halfArea} = ${totalArea} cm².`
      };
    } else {
      return {
        q: `Ένα σχήμα έχει συνολικό εμβαδόν ${totalArea} cm². Ένας άξονας συμμετρίας το χωρίζει σε δύο ίσα μέρη. Πόσο εμβαδόν έχει το κάθε μέρος;`,
        correct: halfArea,
        unit: 'cm²',
        explain: `Αφού τα δύο μέρη είναι ίσα: ${totalArea} : 2 = ${halfArea} cm².`
      };
    }
  } else {
    const halfPerimeter = getRandomInt(12, 35);
    return {
      q: `Ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο συμμετρικά μέρη. Αν το πρώτο μέρος έχει περίμετρο ${halfPerimeter} cm, πόση είναι η περίμετρος του δεύτερου μέρους;`,
      correct: halfPerimeter,
      unit: 'cm',
      explain: `Τα συμμετρικά μέρη είναι ακριβώς ίσα, οπότε έχουν την ίδια περίμετρο: ${halfPerimeter} cm.`
    };
  }
}

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΗ 3: 30+ ΠΡΟΤΑΣΕΙΣ ΣΩΣΤΟΥ / ΛΑΘΟΥΣ
// ----------------------------------------------------
const TRUE_FALSE_POOL = [
  { q: 'Ο άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο ακριβώς ίδια μέρη.', correct: 'Σωστό', explain: 'Σωστά! Αν διπλώσουμε το σχήμα πάνω στον άξονα, τα δύο μέρη ταυτίζονται.' },
  { q: 'Τα δύο συμμετρικά μέρη ενός σχήματος έχουν πάντα την ίδια περίμετρο.', correct: 'Σωστό', explain: 'Σωστά! Αφού είναι ίσα, έχουν ακριβώς την ίδια περίμετρο.' },
  { q: 'Τα δύο συμμετρικά μέρη ενός σχήματος έχουν πάντα το ίδιο εμβαδόν.', correct: 'Σωστό', explain: 'Σωστά! Αφού είναι ίσα, καλύπτουν την ίδια επιφάνεια.' },
  { q: 'Το τετράγωνο έχει 4 άξονες συμμετρίας.', correct: 'Σωστό', explain: 'Σωστά! Έχει 1 κατακόρυφο, 1 οριζόντιο και 2 διαγώνιους.' },
  { q: 'Οι διαγώνιοι ενός ορθογωνίου παραλληλογράμμου είναι άξονες συμμετρίας του.', correct: 'Λάθος', explain: 'Λάθος! Αν διπλώσουμε το ορθογώνιο στη διαγώνιο, τα δύο μέρη ΔΕΝ ταυτίζονται.' },
  { q: 'Ο κύκλος έχει μόνο 2 άξονες συμμετρίας.', correct: 'Λάθος', explain: 'Λάθος! Ο κύκλος έχει αμέτρητους (άπειρους) άξονες συμμετρίας.' },
  { q: 'Ένα σχήμα μπορεί να μην έχει κανέναν άξονα συμμετρίας.', correct: 'Σωστό', explain: 'Σωστά! Π.χ. το σκαληνό τρίγωνο.' },
  { q: 'Το ισοσκελές τρίγωνο έχει 3 άξονες συμμετρίας.', correct: 'Λάθος', explain: 'Λάθος! Το ισοσκελές τρίγωνο έχει μόνο 1 άξονα συμμετρίας (το ισόπλευρο έχει 3).' },
  { q: 'Ο ρόμβος έχει 2 άξονες συμμετρίας (τις διαγώνιούς του).', correct: 'Σωστό', explain: 'Σωστά! Οι δύο διαγώνιοι του ρόμβου είναι άξονες συμμετρίας.' },
  { q: 'Αν διπλώσουμε ένα σχήμα στον άξονα συμμετρίας του, τα δύο μέρη θα περισσεύουν το ένα από το άλλο.', correct: 'Λάθος', explain: 'Λάθος! Τα δύο μέρη θα ταυτιστούν τέλεια.' },
  { q: 'Το γράμμα «A» της αλφαβήτου έχει έναν κατακόρυφο άξονα συμμετρίας.', correct: 'Σωστό', explain: 'Σωστά! Χωρίζεται σε δύο ίσα μισά με κατακόρυφη γραμμή στη μέση.' },
  { q: 'Το γράμμα «O» έχει περισσότερους από έναν άξονες συμμετρίας.', correct: 'Σωστό', explain: 'Σωστά! Έχει κατακόρυφο, οριζόντιο και διαγώνιους άξονες.' },
  { q: 'Το γράμμα «F» έχει έναν οριζόντιο άξονα συμμετρίας.', correct: 'Λάθος', explain: 'Λάθος! Το γράμμα F δεν έχει κανέναν άξονα συμμετρίας.' },
  { q: 'Μια πεταλούδα με ανοιχτά φτερά έχει έναν κατακόρυφο άξονα συμμετρίας.', correct: 'Σωστό', explain: 'Σωστά! Το αριστερό φτερό είναι συμμετρικό με το δεξί.' },
  { q: 'Όλα τα τρίγωνα έχουν υποχρεωτικά τουλάχιστον 1 άξονα συμμετρίας.', correct: 'Λάθος', explain: 'Λάθος! Το σκαληνό τρίγωνο δεν έχει κανέναν άξονα συμμετρίας.' },
  { q: 'Αν δύο σχήματα είναι συμμετρικά ως προς άξονα, τότε είναι οπωσδήποτε ίσα μεταξύ τους.', correct: 'Σωστό', explain: 'Σωστά! Η συμμετρία διατηρεί τα μήκη, τις γωνίες και τα εμβαδά.' },
  { q: 'Η γραμμή δίπλωσης σε ένα φύλλο χαρτιού που χωρίζει το χαρτί ακριβώς στη μέση είναι άξονας συμμετρίας.', correct: 'Σωστό', explain: 'Σωστά! Αυτός είναι ο πρακτικός τρόπος δημιουργίας άξονα συμμετρίας.' }
];

// ----------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 8 ΑΣΚΗΣΕΙΣ
// ----------------------------------------------------
function generateQuestions() {
  // Q1 & Q2: Πλήθος αξόνων με SVG Σχήμα
  let item1 = THEORY_SHAPES_POOL[getRandomInt(0, THEORY_SHAPES_POOL.length - 1)];
  let item2;
  while (true) {
    item2 = THEORY_SHAPES_POOL[getRandomInt(0, THEORY_SHAPES_POOL.length - 1)];
    if (item2.name !== item1.name) break;
  }

  const q1 = {
    q: `Πόσους άξονες συμμετρίας έχει το παρακάτω σχήμα («${item1.name}»);`,
    correct: item1.correct,
    unit: 'άξονες',
    explain: item1.explain,
    svg: item1.svg
  };

  const q2 = {
    q: `Πόσους άξονες συμμετρίας έχει το παρακάτω σχήμα («${item2.name}»);`,
    correct: item2.correct,
    unit: 'άξονες',
    explain: item2.explain,
    svg: item2.svg
  };

  // Q3 & Q4: Υπολογισμοί Εμβαδού & Περιμέτρου
  const q3 = makeMathSymmetryQuestion(true);
  const q4 = makeMathSymmetryQuestion(false);

  // Q5 & Q6: MCQ Αναγνώριση & Ιδιότητες
  const mcqOptions1 = [
    { text: 'Έχουν ίδια περίμετρο και ίδιο εμβαδόν', isCorrect: true },
    { text: 'Έχουν διαφορετική περίμετρο', isCorrect: false },
    { text: 'Έχουν διαφορετικό εμβαδόν', isCorrect: false },
    { text: 'Δεν έχουν καμία σχέση μεταξύ τους', isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  const q5 = {
    q: 'Όταν ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο μέρη, τι ισχύει για τα δύο αυτά μέρη;',
    correct: 'Έχουν ίδια περίμετρο και ίδιο εμβαδόν',
    options: mcqOptions1
  };

  const mcqOptions2 = [
    { text: 'Το Τετράγωνο (4)', isCorrect: true },
    { text: 'Το Ορθογώνιο (2)', isCorrect: false },
    { text: 'Το Ισοσκελές Τρίγωνο (1)', isCorrect: false },
    { text: 'Το Σκαληνό Τρίγωνο (0)', isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  const q6 = {
    q: 'Ποιο από τα παρακάτω γεωμετρικά σχήματα έχει τους ΠΕΡΙΣΣΟΤΕΡΟΥΣ άξονες συμμετρίας;',
    correct: 'Το Τετράγωνο (4)',
    options: mcqOptions2
  };

  // Q7 & Q8: Σωστό / Λάθος
  let tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return { q1, q2, q3, q4, q5, q6, q7: tf1, q8: tf2 };
}

export default function SimmetriaAskPage() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
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
    setAnswers(prev => ({ ...prev, [key]: val }));
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

  // Render Input Number Ασκήσεων (Q1 - Q4)
  const renderInputNumber = (qKey, qData, numLabel, colorClass) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`${colorClass} text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center`}>{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">{qData.q}</h3>
      </div>

      {/* SVG Εικόνα Σχήματος */}
      {qData.svg && <div className="mb-4">{qData.svg}</div>}

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2">
          <input 
            type="number"
            placeholder="Γράψε τον αριθμό"
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <span className="font-bold text-gray-600">{qData.unit}</span>
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. {qData.explain || `Η σωστή απάντηση είναι: ${qData.correct} ${qData.unit}`}</p>
          )}
        </div>
      )}
    </div>
  );

  // Render MCQ (Q5 & Q6)
  const renderMcqQuestion = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-pink-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">{qData.q}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt.text 
                ? 'border-purple-600 bg-purple-50/80 font-bold text-purple-900' 
                : 'border-gray-200 hover:bg-gray-50 text-gray-800'
            }`}
          >
            <input 
              type="radio" 
              name={qKey} 
              value={opt.text}
              checked={answers[qKey] === opt.text}
              onChange={() => handleInputChange(qKey, opt.text)}
              disabled={submitted}
              className="w-5 h-5 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm md:text-base font-bold">{opt.text}</span>
          </label>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Η σωστή απάντηση είναι: <span className="font-black">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Σωστό / Λάθος (Q7 & Q8)
  const renderTrueFalse = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">{qData.q}</h3>
      </div>

      <div className="flex gap-4 pl-0 md:pl-11">
        {['Σωστό', 'Λάθος'].map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => handleInputChange(qKey, opt)}
            disabled={submitted}
            className={`px-8 py-3 rounded-2xl font-black text-base border transition ${
              answers[qKey] === opt
                ? (opt === 'Σωστό' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-rose-600 text-white border-rose-700 shadow-md')
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. {qData.explain}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>🦋 Ασκήσεις: Συμμετρία & Άξονες - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/d-dimotikou/18-simmetria" className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
                <span>📖</span> Θεωρία
              </Link>
              <button 
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10 space-y-8`}>
          
          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Η Έννοια της Συμμετρίας
              </h1>
              <p className="text-purple-100 text-sm md:text-base mt-1">
                8 Δυναμικές ασκήσεις! Πατώντας **«Νέες Ασκήσεις»** οι ερωτήσεις και τα σχήματα αλλάζουν.
              </p>
            </div>

            <button
              onClick={loadNewQuestions}
              className="bg-white text-gray-900 font-black px-5 py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition transform active:scale-95 text-sm whitespace-nowrap"
            >
              🔄 Αλλαγή Ασκήσεων
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

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
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
                >
                  🎯 Έλεγχος Απαντήσεων
                </button>
              </div>
            )}

          </form>

        </main>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-4 px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-3`}>
          
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-sm font-bold text-slate-300">
                Ποσοστό Επιτυχίας: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                <span>🔄</span> Παίξε ξανά με νέες ερωτήσεις!
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden md:block">
                Συμπλήρωσε όλες τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

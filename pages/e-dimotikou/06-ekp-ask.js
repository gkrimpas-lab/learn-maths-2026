// pages/e-dimotikou/06-ekp-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return (a * b) / gcd(a, b);
}

function lcmThree(a, b, c) {
  return lcm(lcm(a, b), c);
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Υπολογισμός ΕΚΠ 2 Αριθμών (Input)
function makeLcmTwoQuestion(isSpecialCase = false) {
  if (!isSpecialCase) {
    // q1: Αριθμοί με κοινό διαιρέτη (π.χ. 6 και 8, 8 και 12, 9 και 12, 12 και 15, 12 και 18)
    const pairs = [
      [6, 8], [8, 12], [9, 12], [12, 15], [12, 18], [10, 15], [14, 21], [15, 20]
    ];
    const [a, b] = pairs[getRandomInt(0, pairs.length - 1)];
    const correctVal = lcm(a, b);

    return {
      type: 'input',
      correct: correctVal,
      unit: 'αριθμος',
      prompt: `Υπολόγισε το Ελάχιστο Κοινό Πολλαπλάσιο των αριθμών ${a} και ${b}, δηλαδή το ΕΚΠ(${a}, ${b}):`,
      explanation: `Γράφουμε τα πρώτα πολλαπλάσια: Π(${a}) ＝ {${a}, ${a * 2}, ${a * 3}, ...} και Π(${b}) ＝ {${b}, ${b * 2}, ${b * 3}, ...}. Το μικρότερο κοινό θετικό πολλαπλάσιο είναι το ${correctVal}. Επομένως ΕΚΠ(${a}, ${b}) ＝ ${correctVal}.`
    };
  } else {
    // q2: Αριθμοί όπου ο ένας είναι πολλαπλάσιο του άλλου ή πρώτοι μεταξύ τους
    const isMultipleCase = getRandomInt(1, 2) === 1;
    let a, b, correctVal, reasonText;

    if (isMultipleCase) {
      // Περίπτωση: ο μεγαλύτερος είναι πολλαπλάσιο του μικρότερου (π.χ. 6 και 24, 7 και 21)
      a = [4, 5, 6, 7, 8][getRandomInt(0, 4)];
      b = a * getRandomInt(3, 5);
      correctVal = b;
      reasonText = `Επειδή ο αριθμός ${b} είναι πολλαπλάσιο του ${a} (${a} · ${b / a} ＝ ${b}), το ΕΚΠ(${a}, ${b}) ισούται άμεσα με τον μεγαλύτερο αριθμό, δηλαδή το ${correctVal}.`;
    } else {
      // Περίπτωση: πρώτοι μεταξύ τους (ΜΚΔ = 1, π.χ. 5 και 9, 7 και 8, 8 και 9)
      const primePairs = [[5, 8], [7, 8], [5, 9], [7, 9], [8, 9], [7, 10]];
      [a, b] = primePairs[getRandomInt(0, primePairs.length - 1)];
      correctVal = a * b;
      reasonText = `Οι αριθμοί ${a} και ${b} είναι πρώτοι μεταξύ τους (δεν έχουν κοινό διαιρέτη εκτός από το 1). Επομένως το ΕΚΠ είναι το γινόμενό τους: ${a} · ${b} ＝ ${correctVal}.`;
    }

    return {
      type: 'input',
      correct: correctVal,
      unit: 'αριθμος',
      prompt: `Βρες το ΕΚΠ(${a}, ${b}):`,
      explanation: reasonText
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Υπολογισμός ΕΚΠ 3 Αριθμών (MCQ)
function makeLcmThreeQuestion(isDistinct = false) {
  const triplets = isDistinct
    ? [
        [3, 4, 6, 12],
        [4, 6, 8, 24],
        [6, 8, 12, 24],
        [4, 5, 10, 20]
      ]
    : [
        [3, 5, 6, 30],
        [4, 6, 9, 36],
        [6, 9, 12, 36],
        [5, 6, 10, 30]
      ];

  const [a, b, c, correctVal] = triplets[getRandomInt(0, triplets.length - 1)];

  const distractors = [
    correctVal / 2,
    correctVal * 2,
    correctVal + a,
    (a * b) / gcd(a, b) === correctVal ? correctVal + b : (a * b) / gcd(a, b)
  ].filter((v) => v !== correctVal && v > 0);

  const options = shuffleArray([correctVal, ...distractors.slice(0, 3)]).map(String);

  return {
    type: 'mcq',
    correct: String(correctVal),
    options,
    prompt: `Ποιο είναι το Ελάχιστο Κοινό Πολλαπλάσιο των τριών αριθμών ${a}, ${b} και ${c}, δηλαδή το ΕΚΠ(${a}, ${b}, ${c});`,
    explanation: `Βρίσκουμε πρώτα το ΕΚΠ των δύο πρώτων αριθμών: ΕΚΠ(${a}, ${b}) ＝ ${lcm(a, b)}. Στη συνέχεια βρίσκουμε το ΕΚΠ του αποτελέσματος με τον τρίτο αριθμό: ΕΚΠ(${lcm(a, b)}, ${c}) ＝ ${correctVal}.`
  };
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Εφαρμογή ΕΚΠ σε Ομώνυμα Κλάσματα (Input & MCQ)
function makeFractionDenominatorQuestion(isMCQ = false) {
  const denominators = [
    [4, 6, 12], [6, 8, 24], [6, 9, 18], [8, 12, 24], [10, 15, 30], [9, 12, 36]
  ];
  const [den1, den2, targetLcm] = denominators[getRandomInt(0, denominators.length - 1)];
  const num1 = getRandomInt(1, den1 - 1);
  const num2 = getRandomInt(1, den2 - 1);

  if (!isMCQ) {
    // q5: Input
    return {
      type: 'input',
      correct: targetLcm,
      unit: 'κοινος παρονομαστης',
      prompt: `Θέλουμε να προσθέσουμε τα ετερώνυμα κλάσματα ${num1}/${den1} και ${num2}/${den2}. Ποιος είναι ο μικρότερος κοινός παρονομαστής (ΕΚΠ) στον οποίο πρέπει να τα μετατρέψουμε;`,
      explanation: `Ο μικρότερος κοινός παρονομαστής δύο ετερώνυμων κλασμάτων είναι το ΕΚΠ των παρονομαστών τους. Υπολογίζουμε ΕΚΠ(${den1}, ${den2}) ＝ ${targetLcm}.`
    };
  } else {
    // q6: MCQ με 3 κλάσματα
    const threeDens = [
      [3, 4, 6, 12],
      [4, 6, 8, 24],
      [2, 5, 10, 10],
      [3, 6, 9, 18]
    ];
    const [d1, d2, d3, lcm3] = threeDens[getRandomInt(0, threeDens.length - 1)];
    const nA = 1;
    const nB = 1;
    const nC = 1;

    const distractors = [
      lcm3 * 2,
      lcm3 + d2,
      lcm3 === 10 ? 20 : lcm3 - 4
    ].filter((v) => v !== lcm3 && v > 0);

    const options = shuffleArray([lcm3, ...distractors.slice(0, 3)]).map(String);

    return {
      type: 'mcq',
      correct: String(lcm3),
      options,
      prompt: `Για να συγκρίνουμε τα κλάσματα ${nA}/${d1}, ${nB}/${d2} και ${nC}/${d3}, ποιος είναι ο ελάχιστος κοινός παρονομαστής τους;`,
      explanation: `Βρίσκουμε το ΕΚΠ και των τριών παρονομαστών: ΕΚΠ(${d1}, ${d2}, ${d3}) ＝ ${lcm3}. Αυτός είναι ο μικρότερος αριθμός που διαιρείται ταυτόχρονα με το ${d1}, το ${d2} και το ${d3}.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Συγχρονισμού & Περιοδικότητας (MCQ & Input)
function makeSyncWordProblem(isInput = false) {
  if (!isInput) {
    // q7: Δρομολόγια πλοίων ή λεωφορείων (MCQ)
    const cases = [
      { a: 12, b: 18, nameA: 'Γραμμή Α', nameB: 'Γραμμή Β', unit: 'min', correct: 36 },
      { a: 15, b: 20, nameA: 'Λεωφορείο 1', nameB: 'Λεωφορείο 2', unit: 'min', correct: 60 },
      { a: 8, b: 14, nameA: 'Πλοίο Α', nameB: 'Πλοίο Β', unit: 'ημέρες', correct: 56 },
      { a: 10, b: 25, nameA: 'Συρμός Α', nameB: 'Συρμός Β', unit: 'min', correct: 50 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    const distractors = [
      c.correct + c.a,
      c.correct - c.b / 2,
      c.correct * 2
    ].filter((v) => v !== c.correct && v > 0);

    const options = shuffleArray([c.correct, ...distractors.slice(0, 3)]).map((v) => `${v} ${c.unit}`);

    return {
      type: 'mcq',
      correct: `${c.correct} ${c.unit}`,
      options,
      prompt: `Το ${c.nameA} αναχωρεί από την αφετηρία κάθε ${c.a} ${c.unit}, ενώ το ${c.nameB} αναχωρεί κάθε ${c.b} ${c.unit}. Αν ξεκινήσουν ταυτόχρονα τώρα, μετά από πόσα ${c.unit} θα αναχωρήσουν ξανά μαζί για πρώτη φορά;`,
      explanation: `Η ταυτόχρονη αναχώρηση θα πραγματοποιηθεί σε χρόνο που είναι κοινό πολλαπλάσιο του ${c.a} και του ${c.b}. Το συντομότερο χρονικό διάστημα είναι το ΕΚΠ(${c.a}, ${c.b}) ＝ ${c.correct} ${c.unit}.`
    };
  } else {
    // q8: Πρόβλημα συσκευασίας κουτιών σε ισοϋψείς στοίβες (Input)
    const h1 = [6, 8, 9, 10][getRandomInt(0, 3)];
    let h2 = [8, 12, 15, 16][getRandomInt(0, 3)];
    if (h1 === h2) h2 = h1 + 4;

    const correctH = lcm(h1, h2);

    return {
      type: 'input',
      correct: correctH,
      unit: 'cm',
      prompt: `Έχουμε κουτιά τύπου Α με ύψος ${h1} cm και κουτιά τύπου Β με ύψος ${h2} cm. Τοποθετούμε τα κουτιά σε δύο ξεχωριστές κατακόρυφες στοίβες. Ποιο είναι το ελάχιστο κοινό ύψος (σε cm) στο οποίο οι δύο στοίβες θα ισοϋψωθούν απόλυτα;`,
      explanation: `Το ύψος της πρώτης στοίβας αυξάνεται κατά ${h1} cm (πολλαπλάσια του ${h1}) και της δεύτερης κατά ${h2} cm (πολλαπλάσια του ${h2}). Οι δύο στοίβες θα έχουν ακριβώς το ίδιο ύψος στο ΕΚΠ(${h1}, ${h2}) ＝ ${correctH} cm.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeLcmTwoQuestion(false),
    q2: makeLcmTwoQuestion(true),
    q3: makeLcmThreeQuestion(false),
    q4: makeLcmThreeQuestion(true),
    q5: makeFractionDenominatorQuestion(false),
    q6: makeFractionDenominatorQuestion(true),
    q7: makeSyncWordProblem(false),
    q8: makeSyncWordProblem(true)
  };
}

export default function EkpAskPage() {
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
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (parseInt(answers.q8, 10) === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Component για Ερωτήσεις MCQ
  const renderMCQ = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span
            className={`${accentColor} text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}
          >
            {numLabel}
          </span>
          <div className="space-y-1">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400">
              {badgeTitle}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.prompt}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11 2xl:pl-13">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition select-none text-sm sm:text-base 2xl:text-lg font-mono font-bold ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${qKey}-opt-${idx}`}
                  name={qKey}
                  value={opt}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt)}
                  disabled={submitted}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0"
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </p>
            ) : (
              <p className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                Η σωστή απάντηση είναι: <strong className="font-bold text-rose-950">{qData.correct}</strong>. {qData.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Component για Ερωτήσεις Input
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span
            className={`${accentColor} text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}
          >
            {numLabel}
          </span>
          <div className="space-y-1">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400">
              {badgeTitle}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.prompt}
            </h3>
          </div>
        </div>

        <div className="sm:pl-11 2xl:pl-13 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-40 h-12 sm:h-14 p-3 text-center rounded-2xl border-2 border-slate-300 font-mono text-lg sm:text-xl 2xl:text-2xl font-black focus:border-indigo-600 focus:outline-none bg-slate-50/60 focus:bg-white text-slate-900 disabled:opacity-75"
            />
            <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-600">
              {qData.unit}
            </span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </p>
            ) : (
              <p className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                Η σωστή απάντηση είναι: <strong className="font-bold text-rose-950">{qData.correct} {qData.unit}</strong>. {qData.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ) - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στο ΕΚΠ: υπολογισμός 2 και 3 αριθμών, κοινοί παρονομαστές κλασμάτων και προβλήματα συγχρονισμού."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/06-ekp"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K / 4K και responsive για κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8">
        
        {/* HEADER BANNER - Ίδια χρωματική παλέτα με τη θεωρία */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ & PB SAFE AREA */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderInput('q1', questions.q1, 1, 'ΕΚΠ ΔΥΟ ΑΡΙΘΜΩΝ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΕΙΔΙΚΕΣ ΠΕΡΙΠΤΩΣΕΙΣ ΕΚΠ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΕΚΠ ΤΡΙΩΝ ΑΡΙΘΜΩΝ ( ΟΜΑΔΑ Α )', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΕΚΠ ΤΡΙΩΝ ΑΡΙΘΜΩΝ ( ΟΜΑΔΑ Β )', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΕΛΑΧΙΣΤΟΣ ΚΟΙΝΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΚΟΙΝΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ ΤΡΙΩΝ ΚΛΑΣΜΑΤΩΝ', 'bg-teal-600')}

          {renderMCQ('q7', questions.q7, 7, 'ΠΡΟΒΛΗΜΑ ΣΥΓΧΡΟΝΙΣΜΟΥ ΔΡΟΜΟΛΟΓΙΩΝ', 'bg-purple-600')}
          {renderInput('q8', questions.q8, 8, 'ΠΡΟΒΛΗΜΑ ΚΑΤΑΣΚΕΥΗΣ ΙΣΟΫΨΩΝ ΣΤΗΛΩΝ', 'bg-purple-600')}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 Έλεγχος Απαντήσεων
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5 z-50">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                Επιτυχία: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 2xl:px-7 2xl:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm 2xl:text-base flex items-center gap-2 active:scale-95"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

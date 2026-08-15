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

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return Number(num).toLocaleString('el-GR');
}

// 1. Αξία Θέσης Ψηφίου (Input)
function makePlaceValueQuestion(prevQuestion = null) {
  let numBase, digits, targetPos, targetDigit, power, answer, posName;
  const posNames = ['Εκατοντάδων Χιλιάδων', 'Δεκάδων Χιλιάδων', 'Μονάδων Χιλιάδων', 'Εκατοντάδων'];

  while (true) {
    numBase = getRandomInt(120, 980) * 1000 + getRandomInt(100, 999);
    digits = numBase.toString().split('');
    targetPos = getRandomInt(0, 3);
    targetDigit = Number(digits[targetPos]);
    power = digits.length - 1 - targetPos;
    answer = targetDigit * Math.pow(10, power);
    posName = posNames[targetPos];

    if (!prevQuestion || prevQuestion.numBase !== numBase) {
      break;
    }
  }

  return {
    numBase,
    numberStr: formatNumber(numBase),
    digit: targetDigit,
    posName,
    correct: answer,
    explain: `Το ψηφίο ${targetDigit} βρίσκεται στη θέση των ${posName}, άρα η αξία του είναι ${targetDigit} × ${formatNumber(Math.pow(10, power))} = ${formatNumber(answer)}.`
  };
}

// 2. Σύνθεση Αριθμού (Input)
function makeCompositionQuestion(prevQuestion = null) {
  let a, b, c, d, answer, promptStr;

  while (true) {
    a = getRandomInt(2, 8);
    b = getRandomInt(1, 9);
    c = getRandomInt(3, 9);
    d = getRandomInt(1, 9);
    answer = a * 1000000 + b * 100000 + c * 1000 + d;
    promptStr = `${a} × 1.000.000 + ${b} × 100.000 + ${c} × 1.000 + ${d}`;

    if (!prevQuestion || prevQuestion.answer !== answer) {
      break;
    }
  }

  return {
    prompt: promptStr,
    correct: answer,
    explain: `Υπολογίζοντας το άθροισμα: ${formatNumber(a * 1000000)} + ${formatNumber(b * 100000)} + ${formatNumber(c * 1000)} + ${d} = ${formatNumber(answer)}.`
  };
}

// 3. Αναγνώριση Περιόδου (MCQ)
function makePeriodQuestion(prevQuestion = null) {
  let milPart, thPart, unPart, fullNum, correctChoice;

  while (true) {
    milPart = getRandomInt(12, 85);
    thPart = getRandomInt(100, 999);
    unPart = getRandomInt(100, 999);
    fullNum = milPart * 1000000 + thPart * 1000 + unPart;
    correctChoice = "Περίοδος Εκατομμυρίων";

    if (!prevQuestion || prevQuestion.fullNum !== fullNum) {
      break;
    }
  }

  const options = shuffle([
    "Περίοδος Εκατομμυρίων",
    "Περίοδος Χιλιάδων",
    "Περίοδος Μονάδων",
    "Περίοδος Δισεκατομμυρίων"
  ]);

  return {
    fullNum,
    numberStr: formatNumber(fullNum),
    targetDigits: formatNumber(milPart),
    options,
    correct: correctChoice,
    explain: `Τα ψηφία ${formatNumber(milPart)} βρίσκονται στην 3η τριάδα από τα δεξιά, η οποία είναι η Περίοδος των Εκατομμυρίων.`
  };
}

// 4. Σύγκριση Μεγάλων Αριθμών (MCQ)
function makeComparisonQuestion(prevQuestion = null) {
  let base, optsList, sorted, correct;

  while (true) {
    base = getRandomInt(450, 750) * 10000;
    optsList = [
      { text: formatNumber(base + 12000), val: base + 12000 },
      { text: formatNumber(base + 9500), val: base + 9500 },
      { text: formatNumber(base + 45000), val: base + 45000 },
      { text: formatNumber(base - 8000), val: base - 8000 }
    ];
    sorted = [...optsList].sort((a, b) => b.val - a.val);
    correct = sorted[0].text;

    if (!prevQuestion || prevQuestion.correct !== correct) {
      break;
    }
  }

  return {
    options: shuffle(optsList.map(o => o.text)),
    correct,
    explain: `Συγκρίνοντας τα ψηφία από τα αριστερά προς τα δεξιά, ο μεγαλύτερος αριθμός είναι το ${correct}.`
  };
}

// 5. Σωστό / Λάθος
function makeTrueFalseQuestion(idx, prevQuestion = null) {
  let isTrue, text, explain;

  if (idx === 1) {
    isTrue = Math.random() > 0.5;
    text = isTrue
      ? `Σε έναν φυσικό αριθμό, κάθε ψηφίο έχει 10 φορές μεγαλύτερη αξία από το ίδιο ψηφίο που βρίσκεται ακριβώς στα δεξιά του.`
      : `Σε έναν φυσικό αριθμό, κάθε ψηφίο έχει 10 φορές ΜΙΚΡΟΤΕΡΗ αξία από το ίδιο ψηφίο που βρίσκεται ακριβώς στα δεξιά του.`;
    explain = isTrue 
      ? 'Σωστά! Το σύστημα αρίθμησης είναι δεκαδικό, άρα κάθε θέση αριστερά έχει 10πλάσια αξία.' 
      : 'Λάθος! Κάθε θέση προς τα αριστερά έχει 10 φορές ΜΕΓΑΛΥΤΕΡΗ (και όχι μικρότερη) αξία.';
  } else {
    isTrue = Math.random() > 0.5;
    const exNum = getRandomInt(20, 80) * 1000;
    text = isTrue
      ? `Τα μηδενικά στο τέλος του αριθμού ${formatNumber(exNum)} καθορίζουν την αξία θέσης των προηγούμενων ψηφίων.`
      : `Τα μηδενικά στην αρχή ενός φυσικού αριθμού (π.χ. 00${formatNumber(exNum)}) αλλάζουν και μεγαλώνουν την αξία του.`;
    explain = isTrue
      ? 'Σωστά! Τα μηδενικά στο τέλος κρατούν τις τάξεις ώστε τα υπόλοιπα ψηφία να έχουν τη σωστή αξία.'
      : 'Λάθος! Τα μηδενικά στην αρχή ενός ακεραίου δεν έχουν καμία αξία και δεν τον αλλάζουν.';
  }

  return { text, correct: isTrue, explain };
}

// 6. SVG Άβακας (Input)
function makeAbacusQuestion(prevQuestion = null) {
  let m, x, e, d, u, val, columns;

  while (true) {
    m = getRandomInt(1, 4);
    x = getRandomInt(1, 5);
    e = getRandomInt(1, 6);
    d = getRandomInt(1, 7);
    u = getRandomInt(1, 8);
    val = m * 1000000 + x * 100000 + e * 100 + d * 10 + u;

    if (!prevQuestion || prevQuestion.correct !== val) {
      break;
    }
  }

  columns = [
    { label: 'Εκ.', count: m, color: '#e11d48' },
    { label: 'Ε.Χ.', count: x, color: '#2563eb' },
    { label: 'Ε.', count: e, color: '#059669' },
    { label: 'Δ.', count: d, color: '#d97706' },
    { label: 'Μ.', count: u, color: '#7c3aed' }
  ];

  return {
    columns,
    correct: val,
    explain: `Μετρώντας τις χάντρες: ${m} Εκ. + ${x} Ε.Χ. + ${e} Ε. + ${d} Δ. + ${u} Μ. = ${formatNumber(val)}.`
  };
}

// 7. Ανάλυση Περιόδων (MCQ)
function makePeriodBlocksQuestion(prevQuestion = null) {
  let mil, thou, fullNum, correctText;

  while (true) {
    mil = getRandomInt(3, 9);
    thou = getRandomInt(120, 850);
    fullNum = mil * 1000000 + thou * 1000;
    correctText = `${mil} εκατομμύρια και ${thou} χιλιάδες`;

    if (!prevQuestion || prevQuestion.fullNum !== fullNum) {
      break;
    }
  }

  const options = shuffle([
    `${mil} εκατομμύρια και ${thou} χιλιάδες`,
    `${mil * 10} εκατομμύρια και ${thou} μονάδες`,
    `${mil} δισεκατομμύρια και ${thou} χιλιάδες`,
    `${mil} εκατομμύρια και ${thou * 10} χιλιάδες`
  ]);

  return {
    fullNum,
    numberStr: formatNumber(fullNum),
    mil,
    thou,
    options,
    correct: correctText,
    explain: `Ο αριθμός ${formatNumber(fullNum)} αποτελείται από ${mil} εκατομμύρια και ${thou} χιλιάδες.`
  };
}

// Παραγωγή 8 Ερωτήσεων
function generateQuestions() {
  const q1 = makePlaceValueQuestion();
  const q2 = makeCompositionQuestion();
  const q3 = makePeriodQuestion();
  const q4 = makeComparisonQuestion();
  const q5 = makeTrueFalseQuestion(1);
  const q6 = makeTrueFalseQuestion(2);
  const q7 = makeAbacusQuestion();
  const q8 = makePeriodBlocksQuestion();

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function FysikoiArithmoiAskPage() {
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
    if (q.type === 'input' || key === 'q1' || key === 'q2' || key === 'q7') {
      const clean = String(a).replace(/\./g, '').trim();
      return clean !== '' && Number(clean) === q.correct;
    }
    if (key === 'q3' || key === 'q4' || key === 'q8') {
      return a === q.correct;
    }
    if (key === 'q5' || key === 'q6') {
      return a === q.correct;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'].forEach(k => {
      if (isCorrect(k)) currentScore += 1;
    });

    setScore(currentScore);
    setSubmitted(true);
  };

  const getCardBorder = (key) => {
    if (!submitted) return 'border-gray-100 bg-white';
    return isCorrect(key)
      ? 'border-emerald-500 bg-emerald-50/20 shadow-md'
      : 'border-red-400 bg-red-50/20 shadow-md';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>🔢 Ασκήσεις: Φυσικοί Αριθμοί - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link 
                href="/st-dimotikou/01-fysikoi" 
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
              >
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
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Φυσικοί Αριθμοί & Αξία Θέσης
              </h1>
              <p className="text-blue-100 text-sm md:text-base mt-1">
                Πατώντας «Νέες Ασκήσεις» οι αριθμοί αλλάζουν αυτόματα.
              </p>
            </div>

            <button
              onClick={loadNewQuestions}
              className="bg-white text-gray-900 font-black px-5 py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition transform active:scale-95 text-sm whitespace-nowrap"
            >
              🔄 Αλλαγή Αριθμών
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Q1: Αξία Θέσης */}
            <div className={`p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${getCardBorder('q1')}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">1</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Στον αριθμό <strong className="text-blue-600 font-mono text-xl">{questions.q1.numberStr}</strong>, ποια είναι η αριθμητική αξία του ψηφίου <strong className="text-emerald-600 text-xl">{questions.q1.digit}</strong>;
                </h3>
              </div>
              <div className="pl-0 md:pl-11 space-y-3">
                <input
                  type="text"
                  placeholder="π.χ. 70000"
                  value={answers.q1}
                  onChange={(e) => handleInputChange('q1', e.target.value)}
                  disabled={submitted}
                  className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>
              {submitted && (
                <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                  {isCorrect('q1') ? (
                    <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                  ) : (
                    <p className="text-red-600">❌ Λάθος. {questions.q1.explain}</p>
                  )}
                </div>
              )}
            </div>

            {/* Q2: Σύνθεση Αριθμού */}
            <div className={`p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${getCardBorder('q2')}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">2</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Ποιος φυσικός αριθμός προκύπτει από: <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200">{questions.q2.prompt}</span>;
                </h3>
              </div>
              <div className="pl-0 md:pl-11 space-y-3">
                <input
                  type="text"
                  placeholder="Γράψε τον αριθμό..."
                  value={answers.q2}
                  onChange={(e) => handleInputChange('q2', e.target.value)}
                  disabled={submitted}
                  className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>
              {submitted && (
                <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                  {isCorrect('q2') ? (
                    <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                  ) : (
                    <p className="text-red-600">❌ Λάθος. {questions.q2.explain}</p>
                  )}
                </div>
              )}
            </div>

            {/* Q3: Περίοδος (MCQ) */}
            <div className={`p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${getCardBorder('q3')}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-purple-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">3</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Στον αριθμό <strong className="text-purple-700 font-mono text-xl">{questions.q3.numberStr}</strong>, σε ποια περίοδο ανήκουν τα ψηφία <span className="underline font-black">{questions.q3.targetDigits}</span>;
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-0 md:pl-11">
                {questions.q3.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center justify-center p-3.5 rounded-2xl border cursor-pointer text-xs md:text-sm font-bold transition text-center ${
                      answers.q3 === opt
                        ? 'border-purple-600 bg-purple-50/80 text-purple-900'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="q3"
                      value={opt}
                      checked={answers.q3 === opt}
                      onChange={() => handleInputChange('q3', opt)}
                      disabled={submitted}
                      className="hidden"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {submitted && (
                <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                  {isCorrect('q3') ? (
                    <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                  ) : (
                    <p className="text-red-600">❌ Λάθος. {questions.q3.explain}</p>
                  )}
                </div>
              )}
            </div>

            {/* Q4: Σύγκριση Μεγάλων (MCQ) */}
            <div className={`p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${getCardBorder('q4')}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-amber-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">4</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Ποιος από τους παρακάτω αριθμούς είναι ο μεγαλύτερος;
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-0 md:pl-11">
                {questions.q4.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center justify-center p-3.5 rounded-2xl border cursor-pointer font-mono text-base font-bold transition ${
                      answers.q4 === opt
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="q4"
                      value={opt}
                      checked={answers.q4 === opt}
                      onChange={() => handleInputChange('q4', opt)}
                      disabled={submitted}
                      className="hidden"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {submitted && (
                <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                  {isCorrect('q4') ? (
                    <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                  ) : (
                    <p className="text-red-600">❌ Λάθος. {questions.q4.explain}</p>
                  )}
                </div>
              )}
            </div>

            {/* Q5: True / False */}
            <div className={`p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${getCardBorder('q5')}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-teal-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">5</span>
                <h3 className="text-lg font-bold text-gray-900">
                  «{questions.q5.text}»
                </h3>
              </div>
              <div className="flex gap-4 pl-0 md:pl-11">
                <button
                  type="button"
                  disabled={submitted}
                  onClick={() => handleInputChange('q5', true)}
                  className={`px-8 py-3 rounded-2xl font-black text-sm border transition ${
                    answers.q5 === true
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                  }`}
                >
                  👍 Σωστό
                </button>
                <button
                  type="button"
                  disabled={submitted}
                  onClick={() => handleInputChange('q5', false)}
                  className={`px-8 py-3 rounded-2xl font-black text-sm border transition ${
                    answers.q5 === false
                      ? 'bg-rose-600 text-white border-rose-600 shadow'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                  }`}
                >
                  👎 Λάθος
                </button>
              </div>
              {submitted && (
                <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                  {isCorrect('q5') ? (
                    <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                  ) : (
                    <p className="text-red-600">❌ {questions.q5.explain}</p>
                  )}
                </div>
              )}
            </div>

            {/* Q6: True / False */}
            <div className={`p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${getCardBorder('q6')}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-cyan-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">6</span>
                <h3 className="text-lg font-bold text-gray-900">
                  «{questions.q6.text}»
                </h3>
              </div>
              <div className="flex gap-4 pl-0 md:pl-11">
                <button
                  type="button"
                  disabled={submitted}
                  onClick={() => handleInputChange('q6', true)}
                  className={`px-8 py-3 rounded-2xl font-black text-sm border transition ${
                    answers.q6 === true
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                  }`}
                >
                  👍 Σωστό
                </button>
                <button
                  type="button"
                  disabled={submitted}
                  onClick={() => handleInputChange('q6', false)}
                  className={`px-8 py-3 rounded-2xl font-black text-sm border transition ${
                    answers.q6 === false
                      ? 'bg-rose-600 text-white border-rose-600 shadow'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                  }`}
                >
                  👎 Λάθος
                </button>
              </div>
              {submitted && (
                <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                  {isCorrect('q6') ? (
                    <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                  ) : (
                    <p className="text-red-600">❌ {questions.q6.explain}</p>
                  )}
                </div>
              )}
            </div>

            {/* Q7: Άβακας (SVG) */}
            <div className={`p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${getCardBorder('q7')}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-rose-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">7</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Ποιον φυσικό αριθμό αναπαριστά ο παρακάτω άβακας;
                </h3>
              </div>
              <div className="pl-0 md:pl-11 space-y-4">
                <div className="bg-slate-100 rounded-2xl p-4 max-w-sm flex justify-center">
                  <svg viewBox="0 0 320 120" className="w-full h-28">
                    <line x1="20" y1="105" x2="300" y2="105" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
                    {questions.q7.columns.map((col, idx) => {
                      const x = 45 + idx * 58;
                      return (
                        <g key={idx}>
                          <line x1={x} y1="20" x2={x} y2="105" stroke="#94a3b8" strokeWidth="2" />
                          {[...Array(col.count)].map((_, bIdx) => (
                            <circle
                              key={bIdx}
                              cx={x}
                              cy={100 - bIdx * 10}
                              r="4.5"
                              fill={col.color}
                            />
                          ))}
                          <text x={x} y="118" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#334155">
                            {col.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Γράψε τον αριθμό..."
                  value={answers.q7}
                  onChange={(e) => handleInputChange('q7', e.target.value)}
                  disabled={submitted}
                  className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-rose-500 focus:outline-none disabled:bg-gray-100"
                />
              </div>
              {submitted && (
                <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                  {isCorrect('q7') ? (
                    <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                  ) : (
                    <p className="text-red-600">❌ Λάθος. {questions.q7.explain}</p>
                  )}
                </div>
              )}
            </div>

            {/* Q8: Ανάλυση Περιόδων (MCQ) */}
            <div className={`p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${getCardBorder('q8')}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">8</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Ποια είναι η σωστή ανάλυση του αριθμού <strong className="text-emerald-700 font-mono text-xl">{questions.q8.numberStr}</strong>;
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
                {questions.q8.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center p-3.5 rounded-2xl border cursor-pointer text-xs md:text-sm font-bold transition ${
                      answers.q8 === opt
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="q8"
                      value={opt}
                      checked={answers.q8 === opt}
                      onChange={() => handleInputChange('q8', opt)}
                      disabled={submitted}
                      className="hidden"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {submitted && (
                <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                  {isCorrect('q8') ? (
                    <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                  ) : (
                    <p className="text-red-600">❌ Λάθος. {questions.q8.explain}</p>
                  )}
                </div>
              )}
            </div>

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
                <span>🔄</span> Παίξε ξανά με νέους αριθμούς!
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

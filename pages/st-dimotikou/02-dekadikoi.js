import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

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

// 1. Δεκαδικό Κλάσμα σε Δεκαδικό Αριθμό (Input)
function makeFractionToDecimal(prevQuestion = null) {
  let num, val;
  const den = 1000;

  while (true) {
    num = getRandomInt(15, 4850);
    val = (num / den).toFixed(3).replace('.', ',');

    if (!prevQuestion || prevQuestion.num !== num) {
      break;
    }
  }

  return {
    num,
    den,
    correct: val,
    explain: `Διαιρώντας με το 1.000, μετακινούμε την υποδιαστολή 3 θέσεις αριστερά: ${num} / 1.000 = ${val}.`
  };
}

// 2. Δεκαδικός Αριθμός σε Δεκαδικό Κλάσμα (MCQ)
function makeDecimalToFraction(prevQuestion = null) {
  let num, decVal;
  const den = 1000;

  while (true) {
    num = getRandomInt(12, 999);
    decVal = (num / den).toFixed(3).replace('.', ',');

    if (!prevQuestion || prevQuestion.decVal !== decVal) {
      break;
    }
  }

  const correctText = `${num}/${den}`;
  const options = shuffle([
    correctText,
    `${num}/100`,
    `${num}/10`,
    `${num + 10}/${den}`
  ]);

  return {
    decVal,
    options,
    correct: correctText,
    explain: `Ο αριθμός ${decVal} έχει 3 δεκαδικά ψηφία (χιλιοστά), άρα ισούται με το κλάσμα ${correctText}.`
  };
}

// 3. Αξία Θέσης Δεκαδικού Ψηφίου (Input)
function makePlaceValue(prevQuestion = null) {
  let intPart, tenths, hundredths, thousandths, placeType, decStr, correctDigit;
  const places = ['δέκατα', 'εκατοστά', 'χιλιοστά'];

  while (true) {
    intPart = getRandomInt(0, 9);
    tenths = getRandomInt(1, 9);
    hundredths = getRandomInt(1, 9);
    thousandths = getRandomInt(1, 9);

    placeType = places[getRandomInt(0, places.length - 1)];
    decStr = `${intPart},${tenths}${hundredths}${thousandths}`;

    if (placeType === 'δέκατα') correctDigit = tenths;
    if (placeType === 'εκατοστά') correctDigit = hundredths;
    if (placeType === 'χιλιοστά') correctDigit = thousandths;

    if (!prevQuestion || prevQuestion.decStr !== decStr || prevQuestion.placeType !== placeType) {
      break;
    }
  }

  return {
    decStr,
    placeType,
    correct: correctDigit,
    explain: `Στον αριθμό ${decStr}, το ψηφίο στη θέση των ${placeType} είναι το ${correctDigit}.`
  };
}

// 4. Σύγκριση Δεκαδικών Αριθμών (< , = , >)
function makeComparison(prevQuestion = null) {
  let valA, valB, strA, strB, correctSym;

  while (true) {
    const intPart = getRandomInt(0, 9);
    const decA = getRandomInt(1, 999);
    let decB = getRandomInt(1, 999);

    valA = parseFloat(`${intPart}.${decA.toString().padStart(3, '0')}`);
    valB = parseFloat(`${intPart}.${decB.toString().padStart(3, '0')}`);

    if (Math.random() > 0.75) valB = valA;

    correctSym = '=';
    if (valA > valB) correctSym = '>';
    if (valA < valB) correctSym = '<';

    strA = valA.toFixed(3).replace('.', ',');
    strB = valB.toFixed(3).replace('.', ',');

    if (!prevQuestion || prevQuestion.strA !== strA || prevQuestion.strB !== strB) {
      break;
    }
  }

  return {
    strA,
    strB,
    correct: correctSym,
    explain: `Συγκρίνοντας τα μέρη: ${strA} ${correctSym} ${strB}.`
  };
}

// 5. True / False: Ισοδύναμα Μηδενικά
function makeEquivalentDecimalsTF() {
  const isTrue = Math.random() > 0.5;
  const num = (getRandomInt(1, 9) + getRandomInt(1, 9) / 10).toFixed(1).replace('.', ',');
  const text = isTrue
    ? `Οι δεκαδικοί αριθμοί ${num} και ${num}00 έχουν ακριβώς την ίδια μαθηματική αξία.`
    : `Ο αριθμός ${num}00 είναι 100 φορές μεγαλύτερος από τον αριθμό ${num}.`;

  return {
    text,
    correct: isTrue,
    explain: isTrue
      ? 'Σωστά! Τα μηδενικά στο τέλος του δεκαδικού μέρους δεν μεταβάλλουν την αξία του αριθμού.'
      : 'Λάθος! Η προσθήκη μηδενικών στο τέλος του δεκαδικού μέρους δεν αλλάζει την αξία του.'
  };
}

// 6. True / False: Αξία Υποδιαστολής
function makeDecimalPointTF() {
  const isTrue = Math.random() > 0.5;
  const text = isTrue
    ? `Η υποδιαστολή διαχωρίζει τις ακέραιες μονάδες από τα μέρη που είναι μικρότερα της μίας μονάδας.`
    : `Το πρώτο ψηφίο δεξιά από την υποδιαστολή δείχνει πάντα τα εκατοστά (1/100).`;

  return {
    text,
    correct: isTrue,
    explain: isTrue
      ? 'Σωστά! Αριστερά είναι το ακέραιο μέρος και δεξιά το δεκαδικό μέρος.'
      : 'Λάθος! Το 1ο ψηφίο δεξιά από την υποδιαστολή είναι τα δέκατα (1/10) και το 2ο τα εκατοστά (1/100).'
  };
}

// 7. Οπτική Ερώτηση (SVG Πίνακας Δεκαδικών)
function makeVisualDecTable() {
  const e = getRandomInt(1, 4);
  const d = getRandomInt(0, 9);
  const m = getRandomInt(1, 9);
  const dek = getRandomInt(1, 9);
  const ek = getRandomInt(0, 9);
  const xil = getRandomInt(1, 9);

  const decStr = `${e}${d}${m},${dek}${ek}${xil}`;

  return {
    digits: [e, d, m, dek, ek, xil],
    correct: decStr,
    explain: `Συνδυάζοντας ακέραιο και δεκαδικό μέρος με υποδιαστολή: ${decStr}.`
  };
}

// 8. Ανάλυση σε Άθροισμα (MCQ)
function makeExpandedDecimalQuestion() {
  const a = getRandomInt(1, 9);
  const b = getRandomInt(1, 9);
  const c = getRandomInt(1, 9);

  const decVal = `${a},${b}${c}`;
  const correctText = `${a} + ${b}/10 + ${c}/100`;

  const options = shuffle([
    correctText,
    `${a} + ${b}/100 + ${c}/1000`,
    `${a * 10} + ${b}/10 + ${c}/100`,
    `${a} + ${b}/10 + ${c}/10`
  ]);

  return {
    decVal,
    options,
    correct: correctText,
    explain: `Ο αριθμός ${decVal} αναλύεται σε ${a} μονάδες + ${b} δέκατα (${b}/10) + ${c} εκατοστά (${c}/100).`
  };
}

function generateQuestions() {
  return {
    q1: makeFractionToDecimal(),
    q2: makeDecimalToFraction(),
    q3: makePlaceValue(),
    q4: makeComparison(),
    q5: makeEquivalentDecimalsTF(),
    q6: makeDecimalPointTF(),
    q7: makeVisualDecTable(),
    q8: makeExpandedDecimalQuestion()
  };
}

export default function DekadikoiArithmoiAskPage() {
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

  const normalize = (str) => String(str || '').trim().replace('.', ',');

  const isCorrect = (key) => {
    const q = questions[key];
    const a = answers[key];
    if (key === 'q1' || key === 'q7') {
      return normalize(a) === q.correct;
    }
    if (key === 'q3') {
      return parseInt(a, 10) === q.correct;
    }
    if (key === 'q2' || key === 'q4' || key === 'q8') {
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
        <title>🔢 Ασκήσεις: Δεκαδικοί Αριθμοί - LearnMaths.gr</title>
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
                href="/st-dimotikou/02-dekadikoi" 
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
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
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Δεκαδικοί Αριθμοί & Κλάσματα
              </h1>
              <p className="text-emerald-100 text-sm md:text-base mt-1">
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

            {/* Q1: Κλάσμα -> Δεκαδικός */}
            <div className={`p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${getCardBorder('q1')}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">1</span>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Γράψε το δεκαδικό κλάσμα 
                  <span className="inline-flex flex-col items-center leading-none text-base font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                    <span>{questions.q1.num}</span>
                    <span className="border-b-2 border-emerald-800 w-full"></span>
                    <span>1.000</span>
                  </span> 
                  ως δεκαδικό αριθμό:
                </h3>
              </div>
              <div className="pl-0 md:pl-11 space-y-3">
                <input
                  type="text"
                  placeholder="π.χ. 0,245"
                  value={answers.q1}
                  onChange={(e) => handleInputChange('q1', e.target.value)}
                  disabled={submitted}
                  className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-gray-100"
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

            {/* Q2: Δεκαδικός -> Κλάσμα (MCQ) */}
            <div className={`p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${getCardBorder('q2')}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">2</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Ποιο δεκαδικό κλάσμα είναι ίσο με τον αριθμό <span className="text-blue-600 font-mono font-black text-xl">{questions.q2.decVal}</span>;
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-0 md:pl-11">
                {questions.q2.options.map((opt, idx) => {
                  const [n, d] = opt.split('/');
                  return (
                    <label
                      key={idx}
                      className={`flex items-center justify-center p-3.5 rounded-2xl border cursor-pointer transition ${
                        answers.q2 === opt
                          ? 'border-blue-600 bg-blue-50 font-bold'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="q2"
                        value={opt}
                        checked={answers.q2 === opt}
                        onChange={() => handleInputChange('q2', opt)}
                        disabled={submitted}
                        className="hidden"
                      />
                      <span className="inline-flex flex-col items-center leading-none text-base font-mono font-black text-gray-800">
                        <span>{n}</span>
                        <span className="border-b-2 border-gray-800 w-full my-0.5"></span>
                        <span>{d}</span>
                      </span>
                    </label>
                  );
                })}
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

            {/* Q3: Αξία Θέσης */}
            <div className={`p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${getCardBorder('q3')}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-teal-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">3</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Ποιο ψηφίο βρίσκεται στη θέση <span className="text-teal-600 font-extrabold">{questions.q3.placeType}</span> στον αριθμό <span className="text-teal-600 font-mono font-black text-xl">{questions.q3.decStr}</span>;
                </h3>
              </div>
              <div className="pl-0 md:pl-11 space-y-3">
                <input
                  type="number"
                  placeholder="Γράψε το ψηφίο"
                  value={answers.q3}
                  onChange={(e) => handleInputChange('q3', e.target.value)}
                  disabled={submitted}
                  className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:bg-gray-100"
                />
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

            {/* Q4: Σύγκριση (<, =, >) */}
            <div className={`p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${getCardBorder('q4')}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-amber-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">4</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Επίλεξε το σωστό σύμβολο σύγκρισης ( &lt; , = , &gt; ):
                </h3>
              </div>
              <div className="pl-0 md:pl-11 space-y-4">
                <div className="flex items-center gap-4 text-xl md:text-2xl font-mono font-black text-gray-800">
                  <span>{questions.q4.strA}</span>
                  <div className="flex gap-2">
                    {['<', '=', '>'].map((sym) => (
                      <button
                        type="button"
                        key={sym}
                        onClick={() => handleInputChange('q4', sym)}
                        disabled={submitted}
                        className={`w-12 h-12 rounded-xl text-xl font-black border transition ${
                          answers.q4 === sym
                            ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                  <span>{questions.q4.strB}</span>
                </div>
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
                <span className="bg-purple-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">5</span>
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
                <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">6</span>
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

            {/* Q7: SVG Πίνακας */}
            <div className={`p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${getCardBorder('q7')}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-rose-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">7</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Ποιος δεκαδικός αριθμός προκύπτει από τον παρακάτω πίνακα θέσεων;
                </h3>
              </div>
              <div className="pl-0 md:pl-11 space-y-4">
                <div className="max-w-md bg-slate-100 p-3 rounded-2xl border border-slate-200 overflow-x-auto">
                  <div className="grid grid-cols-7 text-center font-bold text-xs bg-white rounded-xl overflow-hidden border border-slate-200">
                    <div className="bg-emerald-600 text-white py-1">Ε</div>
                    <div className="bg-emerald-600 text-white py-1">Δ</div>
                    <div className="bg-emerald-600 text-white py-1">Μ</div>
                    <div className="bg-amber-500 text-white py-1">,</div>
                    <div className="bg-blue-600 text-white py-1">δ</div>
                    <div className="bg-blue-600 text-white py-1">ε</div>
                    <div className="bg-blue-600 text-white py-1">χ</div>

                    <div className="py-2 border-r">{questions.q7.digits[0]}</div>
                    <div className="py-2 border-r">{questions.q7.digits[1]}</div>
                    <div className="py-2 border-r">{questions.q7.digits[2]}</div>
                    <div className="py-2 border-r text-amber-600 font-black">,</div>
                    <div className="py-2 border-r">{questions.q7.digits[3]}</div>
                    <div className="py-2 border-r">{questions.q7.digits[4]}</div>
                    <div className="py-2">{questions.q7.digits[5]}</div>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="π.χ. 123,456"
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

            {/* Q8: Ανάλυση σε Άθροισμα (MCQ) */}
            <div className={`p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${getCardBorder('q8')}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-teal-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">8</span>
                <h3 className="text-lg font-bold text-gray-900">
                  Ποια είναι η σωστή ανάλυση σε κλάσματα για τον αριθμό <strong className="text-teal-700 font-mono text-xl">{questions.q8.decVal}</strong>;
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
                {questions.q8.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center p-3.5 rounded-2xl border cursor-pointer font-mono text-sm font-bold transition ${
                      answers.q8 === opt
                        ? 'border-teal-600 bg-teal-50 text-teal-900'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-800'
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

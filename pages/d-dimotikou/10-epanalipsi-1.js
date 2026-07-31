import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ GENERATORS --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// 1. ΑΡΙΘΜΟΙ ΕΩΣ 20.000 (3 ΑΣΚΗΣΕΙΣ)
function genNumbersQuestion(type) {
  if (type === 1) {
    // Αξία θέσης ψηφίου
    const num = getRandomInt(1001, 19999);
    const numStr = num.toString();
    const posIdx = getRandomInt(0, numStr.length - 1);
    const names = ['Μονάδες', 'Δεκάδες', 'Εκατοντάδες', 'Χιλιάδες', 'Δεκάδες Χιλιάδες'];
    const actualPosName = names[numStr.length - 1 - posIdx];
    const digit = parseInt(numStr[posIdx], 10);

    return {
      category: '🔢 Αριθμοί έως το 20.000',
      question: `Ποιο ψηφίο βρίσκεται στη θέση **${actualPosName}** στον αριθμό **${formatNumber(num)}**;`,
      inputType: 'number',
      correct: digit,
      explain: `Στον αριθμό ${formatNumber(num)}, στη θέση ${actualPosName} είναι το ${digit}.`
    };
  } else if (type === 2) {
    // Σύγκριση αριθμών
    const num1 = getRandomInt(5000, 19999);
    let num2 = num1 + getRandomInt(-500, 500);
    if (num1 === num2) num2 += 10;

    const correctSym = num1 > num2 ? '>' : '<';
    return {
      category: '🔢 Αριθμοί έως το 20.000',
      question: `Επίλεξε το σωστό σύμβολο σύγκρισης: **${formatNumber(num1)} [ ? ] ${formatNumber(num2)}**`,
      inputType: 'sym',
      valA: formatNumber(num1),
      valB: formatNumber(num2),
      correct: correctSym,
      explain: `${formatNumber(num1)} ${correctSym} ${formatNumber(num2)}`
    };
  } else {
    // Επόμενος / Προηγούμενος
    const num = getRandomInt(2000, 19998);
    const isNext = Math.random() > 0.5;
    const target = isNext ? num + 1 : num - 1;

    return {
      category: '🔢 Αριθμοί έως το 20.000',
      question: `Ποιος είναι ο **${isNext ? 'επόμενος' : 'προηγούμενος'}** αριθμός του **${formatNumber(num)}**;`,
      inputType: 'number',
      correct: target,
      explain: `Ο ${isNext ? 'επόμενος' : 'προηγούμενος'} του ${formatNumber(num)} είναι ο ${formatNumber(target)}.`
    };
  }
}

// 2. ΠΟΛΥΓΩΝΑ ΕΩΣ 8 ΠΛΕΥΡΕΣ (3 ΑΣΚΗΣΕΙΣ)
function genPolygonsQuestion() {
  const polygons = [
    { name: 'Τρίγωνο', sides: 3 },
    { name: 'Τετράπλευρο', sides: 4 },
    { name: 'Πεντάγωνο', sides: 5 },
    { name: 'Εξάγωνο', sides: 6 },
    { name: 'Επτάγωνο', sides: 7 },
    { name: 'Οκτάγωνο', sides: 8 }
  ];

  const mode = getRandomInt(1, 2);
  const selected = polygons[getRandomInt(0, polygons.length - 1)];

  if (mode === 1) {
    return {
      category: '📐 Πολύγωνα',
      question: `Πόσες πλευρές έχει ένα **${selected.name}**;`,
      inputType: 'number',
      correct: selected.sides,
      explain: `Το ${selected.name} έχει ${selected.sides} πλευρές.`
    };
  } else {
    return {
      category: '📐 Πολύγωνα',
      question: `Πώς ονομάζεται το πολύγωνο που έχει ακριβώς **${selected.sides}** πλευρές;`,
      inputType: 'mcq',
      options: polygons.map(p => ({ text: p.name, isCorrect: p.name === selected.name })).sort(() => Math.random() - 0.5),
      correct: selected.name,
      explain: `Το πολύγωνο με ${selected.sides} πλευρές ονομάζεται ${selected.name}.`
    };
  }
}

// 3. ΠΡΟΣΘΕΣΗ ΚΑΙ ΑΦΑΙΡΕΣΗ (4 ΑΣΚΗΣΕΙΣ)
function genAddSubQuestion() {
  const isAdd = Math.random() > 0.5;
  if (isAdd) {
    const a = getRandomInt(1200, 8500);
    const b = getRandomInt(1100, 8500);
    const sum = a + b;
    return {
      category: '➕ Πρόσθεση & Αφαίρεση',
      question: `Υπολόγισε το άθροισμα: **${formatNumber(a)} + ${formatNumber(b)} = ?**`,
      inputType: 'number',
      correct: sum,
      explain: `${formatNumber(a)} + ${formatNumber(b)} = ${formatNumber(sum)}`
    };
  } else {
    const a = getRandomInt(5000, 18000);
    const b = getRandomInt(1000, a - 500);
    const diff = a - b;
    return {
      category: '➕ Πρόσθεση & Αφαίρεση',
      question: `Υπολόγισε τη διαφορά: **${formatNumber(a)} - ${formatNumber(b)} = ?**`,
      inputType: 'number',
      correct: diff,
      explain: `${formatNumber(a)} - ${formatNumber(b)} = ${formatNumber(diff)}`
    };
  }
}

// 4. ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ (4 ΑΣΚΗΣΕΙΣ)
function genMultiplicationQuestion() {
  const isTwoDigit = Math.random() > 0.4;
  const a = getRandomInt(12, 180);
  const b = isTwoDigit ? getRandomInt(11, 45) : getRandomInt(3, 9);
  const prod = a * b;

  return {
    category: '✖️ Πολλαπλασιασμός',
    question: `Υπολόγισε το γινόμενο: **${formatNumber(a)} × ${b} = ?**`,
    inputType: 'number',
    correct: prod,
    explain: `${formatNumber(a)} × ${b} = ${formatNumber(prod)}`
  };
}

// 5. ΔΙΑΙΡΕΣΗ (4 ΑΣΚΗΣΕΙΣ)
function genDivisionQuestion() {
  const isExact = Math.random() > 0.5;
  const divisor = getRandomInt(2, 9);
  const quotient = getRandomInt(12, 150);

  if (isExact) {
    const dividend = divisor * quotient;
    return {
      category: '➗ Διαίρεση',
      question: `Υπολόγισε το πηλίκο της διαίρεσης: **${formatNumber(dividend)} : ${divisor} = ?**`,
      inputType: 'number',
      correct: quotient,
      explain: `${formatNumber(dividend)} : ${divisor} = ${formatNumber(quotient)}`
    };
  } else {
    const remainder = getRandomInt(1, divisor - 1);
    const dividend = (divisor * quotient) + remainder;
    return {
      category: '➗ Διαίρεση',
      question: `Πόσο είναι το **υπόλοιπο** (υ) της διαίρεσης **${formatNumber(dividend)} : ${divisor}**;`,
      inputType: 'number',
      correct: remainder,
      explain: `${formatNumber(dividend)} : ${divisor} = ${formatNumber(quotient)} με υπόλοιπο ${remainder}.`
    };
  }
}

// 6. ΔΕΚΑΔΙΚΑ ΚΛΑΣΜΑΤΑ & ΔΕΚΑΔΙΚΟΙ (4 ΑΣΚΗΣΕΙΣ)
function genDecimalsQuestion() {
  const mode = getRandomInt(1, 2);
  const den = Math.random() > 0.5 ? 10 : 100;
  const num = den === 10 ? getRandomInt(1, 99) : getRandomInt(1, 499);
  const decStr = (num / den).toFixed(den === 10 ? 1 : 2).replace('.', ',');

  if (mode === 1) {
    return {
      category: '🔢 Δεκαδικά Κλάσματα & Δεκαδικοί',
      question: `Γράψε το κλάσμα **${num}/${den}** ως δεκαδικό αριθμό:`,
      inputType: 'text',
      correct: decStr,
      explain: `${num}/${den} = ${decStr}`
    };
  } else {
    return {
      category: '🔢 Δεκαδικά Κλάσματα & Δεκαδικοί',
      question: `Ποιο δεκαδικό κλάσμα είναι ίσο με τον αριθμό **${decStr}**;`,
      inputType: 'mcq',
      options: [
        { text: `${num}/${den}`, isCorrect: true },
        { text: `${num}/${den === 10 ? 100 : 10}`, isCorrect: false },
        { text: `${num + 5}/${den}`, isCorrect: false },
        { text: `${den}/${num}`, isCorrect: false }
      ].sort(() => Math.random() - 0.5),
      correct: `${num}/${den}`,
      explain: `${decStr} = ${num}/${den}`
    };
  }
}

// 7. ΜΟΝΑΔΕΣ ΜΗΚΟΥΣ (4 ΑΣΚΗΣΕΙΣ)
function genLengthQuestion() {
  const types = [
    { from: 'm', to: 'cm', factor: 100 },
    { from: 'km', to: 'm', factor: 1000 },
    { from: 'cm', to: 'm', factor: 0.01 },
    { from: 'dm', to: 'cm', factor: 10 }
  ];

  const selected = types[getRandomInt(0, types.length - 1)];
  if (selected.factor >= 1) {
    const val = getRandomInt(2, 25);
    const correct = val * selected.factor;
    return {
      category: '📏 Μονάδες Μήκους',
      question: `Μετάτρεψε τη μονάδα: **${val} ${selected.from} = ? ${selected.to}**`,
      inputType: 'number',
      correct: correct,
      explain: `${val} ${selected.from} = ${formatNumber(correct)} ${selected.to}`
    };
  } else {
    const correct = getRandomInt(2, 15);
    const val = correct * 100; // cm -> m
    return {
      category: '📏 Μονάδες Μήκους',
      question: `Μετάτρεψε τη μονάδα: **${val} cm = ? m**`,
      inputType: 'number',
      correct: correct,
      explain: `${val} cm = ${correct} m`
    };
  }
}

// 8. ΜΟΝΑΔΕΣ ΒΑΡΟΥΣ (4 ΑΣΚΗΣΕΙΣ)
function genWeightQuestion() {
  const isBigToSmall = Math.random() > 0.5;
  if (isBigToSmall) {
    const val = getRandomInt(2, 12);
    const unit = Math.random() > 0.5 ? 'kg' : 't';
    const targetUnit = unit === 'kg' ? 'g' : 'kg';
    const correct = val * 1000;

    return {
      category: '⚖️ Μονάδες Βάρους',
      question: `Μετάτρεψε τη μονάδα: **${val} ${unit} = ? ${targetUnit}**`,
      inputType: 'number',
      correct: correct,
      explain: `${val} ${unit} = ${formatNumber(correct)} ${targetUnit}`
    };
  } else {
    const correct = getRandomInt(2, 15);
    const val = correct * 1000;
    const unit = Math.random() > 0.5 ? 'g' : 'kg';
    const targetUnit = unit === 'g' ? 'kg' : 't';

    return {
      category: '⚖️ Μονάδες Βάρους',
      question: `Μετάτρεψε τη μονάδα: **${formatNumber(val)} ${unit} = ? ${targetUnit}**`,
      inputType: 'number',
      correct: correct,
      explain: `${formatNumber(val)} ${unit} = ${correct} ${targetUnit}`
    };
  }
}

// ΓΕΝΝΗΤΡΙΑ 30 ΑΣΚΗΣΕΩΝ
function generateAllQuestions() {
  const qList = [
    genNumbersQuestion(1), genNumbersQuestion(2), genNumbersQuestion(3),
    genPolygonsQuestion(), genPolygonsQuestion(), genPolygonsQuestion(),
    genAddSubQuestion(), genAddSubQuestion(), genAddSubQuestion(), genAddSubQuestion(),
    genMultiplicationQuestion(), genMultiplicationQuestion(), genMultiplicationQuestion(), genMultiplicationQuestion(),
    genDivisionQuestion(), genDivisionQuestion(), genDivisionQuestion(), genDivisionQuestion(),
    genDecimalsQuestion(), genDecimalsQuestion(), genDecimalsQuestion(), genDecimalsQuestion(),
    genLengthQuestion(), genLengthQuestion(), genLengthQuestion(), genLengthQuestion(),
    genWeightQuestion(), genWeightQuestion(), genWeightQuestion(), genWeightQuestion()
  ];

  // Ανακάτεμα της σειράς των ερωτήσεων
  return qList.sort(() => Math.random() - 0.5);
}

export default function EpanalipsiPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    const q = generateAllQuestions();
    setQuestions(q);
    const initialAns = {};
    q.forEach((_, idx) => { initialAns[`q${idx}`] = ''; });
    setAnswers(initialAns);
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, []);

  if (questions.length === 0) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    questions.forEach((q, idx) => {
      const userAns = answers[`q${idx}`]?.toString().trim().replace('.', ',');
      const correctAns = q.correct.toString().trim().replace('.', ',');

      if (userAns === correctAns) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-28">
      <Head>
        <title>🏆 Επανάληψη Ενοτήτων 1 έως 9 (30 Ερωτήσεις) - LearnMaths.gr</title>
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
              <button 
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες 30 Ερωτήσεις
              </button>
              <Link href="/d-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
                🔙 Επιστροφή
              </Link>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10 space-y-8`}>
          
          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΠΑΝΑΛΗΨΗ 1 ΕΩΣ 9
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                🏆 Επανάληψη Ενοτήτων 1 έως 9 (30 Ερωτήσεις)
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-2xl">
                Δοκίμασε τις γνώσεις σου σε όλα όσα μάθαμε: Αριθμοί έως 20.000, πολύγωνα, πράξεις, διαίρεση, δεκαδικά κλάσματα, μήκος & βάρος!
              </p>
            </div>

            <button
              onClick={loadNewQuestions}
              className="bg-white text-gray-900 font-black px-6 py-3.5 rounded-2xl shadow-xl hover:bg-amber-50 transition transform active:scale-95 text-sm whitespace-nowrap"
            >
              🔄 Αλλαγή Όλων των Ερωτήσεων
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {questions.map((q, idx) => {
              const qKey = `q${idx}`;
              const userAns = answers[qKey]?.toString().trim().replace('.', ',');
              const correctAns = q.correct.toString().trim().replace('.', ',');
              const isCorrect = userAns === correctAns;

              return (
                <div 
                  key={idx}
                  className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
                    submitted 
                      ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                        {q.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-gray-900 pl-0 md:pl-11 mb-4">
                    {q.question.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-indigo-700 font-mono text-xl px-1">{part}</strong> : part)}
                  </h3>

                  <div className="pl-0 md:pl-11 space-y-3">
                    {q.inputType === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {q.options.map((opt, oIdx) => (
                          <label 
                            key={oIdx}
                            className={`flex items-center justify-center p-3.5 rounded-2xl border cursor-pointer transition text-sm font-bold ${
                              answers[qKey] === opt.text
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name={qKey} 
                              value={opt.text}
                              checked={answers[qKey] === opt.text}
                              onChange={() => handleInputChange(qKey, opt.text)}
                              disabled={submitted}
                              className="hidden"
                            />
                            <span>{opt.text}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.inputType === 'sym' && (
                      <div className="flex items-center gap-4 text-xl font-mono font-black text-gray-800">
                        <span>{q.valA}</span>
                        <div className="flex gap-2">
                          {['<', '=', '>'].map((sym) => (
                            <button
                              type="button"
                              key={sym}
                              onClick={() => handleInputChange(qKey, sym)}
                              disabled={submitted}
                              className={`w-12 h-12 rounded-xl text-xl font-black border transition ${
                                answers[qKey] === sym 
                                  ? 'bg-amber-500 text-white border-amber-600 shadow-md' 
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                              }`}
                            >
                              {sym}
                            </button>
                          ))}
                        </div>
                        <span>{q.valB}</span>
                      </div>
                    )}

                    {(q.inputType === 'number' || q.inputType === 'text') && (
                      <input 
                        type={q.inputType === 'number' ? 'number' : 'text'}
                        placeholder="Γράψε την απάντησή σου..."
                        value={answers[qKey]}
                        onChange={(e) => handleInputChange(qKey, e.target.value)}
                        disabled={submitted}
                        className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    )}
                  </div>

                  {submitted && (
                    <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                      {isCorrect ? (
                        <p className="text-emerald-700 flex items-center gap-1">✅ Σωστό! (+1 πόντος)</p>
                      ) : (
                        <p className="text-red-600">
                          ❌ Λάθος. {q.explain}
                        </p>
                      )}
                    </div>
                  )}

                </div>
              );
            })}

            {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
            {!submitted && (
              <div className="text-center pt-6">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-black px-12 py-5 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95"
                >
                  🎯 Έλεγχος Απαντήσεων (30 Ερωτήσεις)
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
            <div className="bg-amber-400 text-slate-900 font-black px-5 py-2.5 rounded-xl text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Τελικό Σκορ:</span>
              <span className="text-2xl font-mono">{score} / 30</span>
            </div>
            {submitted && (
              <span className="text-sm font-bold text-slate-300">
                Ποσοστό Επιτυχίας: <span className="text-emerald-400 font-black">{Math.round((score / 30) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                <span>🔄</span> Παίξε ξανά με νέες 30 Ερωτήσεις!
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden md:block">
                Συμπλήρωσε όσο περισσότερες μπορείς και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

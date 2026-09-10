// pages/d-dimotikou/10-epanalipsi.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Component για μαθηματική γραφή κλασμάτων
const Fraction = ({ num, den }) => (
  <span className="inline-flex flex-col items-center align-middle mx-1 text-center font-serif leading-none">
    <span className="border-b border-current px-1 pb-0.5 text-[0.95em]">{num}</span>
    <span className="px-1 pt-0.5 text-[0.95em]">{den}</span>
  </span>
);

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ GENERATORS --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// 1. ΑΡΙΘΜΟΙ ΕΩΣ 20.000 (3 ΑΣΚΗΣΕΙΣ)
function genNumbersQuestion(type) {
  if (type === 1) {
    // Αξία θέσης ψηφίου με αυστηρή εξασφάλιση μοναδικότητας
    const places = [
      { name: 'Μονάδων', mult: 1 },
      { name: 'Δεκάδων', mult: 10 },
      { name: 'Εκατοντάδων', mult: 100 },
      { name: 'Μονάδων Χιλιάδων', mult: 1000 },
      { name: 'Δεκάδων Χιλιάδων', mult: 10000 }
    ];

    let num = 0;
    let chosenPlace = places[1];
    let digit = 0;

    while (true) {
      num = getRandomInt(1001, 19999);
      const validPlaces = places.filter((p) => Math.floor(num / p.mult) % 10 > 0);
      chosenPlace = validPlaces[getRandomInt(0, validPlaces.length - 1)];
      digit = Math.floor(num / chosenPlace.mult) % 10;
      const count = num.toString().split('').filter((ch) => ch === digit.toString()).length;
      if (count === 1) break;
    }

    return {
      category: '🔢 Αριθμοί έως το 20.000',
      question: `Ποιο ψηφίο βρίσκεται στη θέση των ${chosenPlace.name} στον αριθμό ${formatNumber(num)};`,
      inputType: 'number',
      correct: digit.toString(),
      explain: `Στον αριθμό ${formatNumber(num)}, στη θέση των ${chosenPlace.name} βρίσκεται το ψηφίο ${digit}.`
    };
  } else if (type === 2) {
    // Σύγκριση αριθμών
    const num1 = getRandomInt(5000, 19999);
    let num2 = num1 + getRandomInt(-400, 400);
    if (num1 === num2) num2 += 10;

    const correctSym = num1 > num2 ? '＞' : '＜';
    return {
      category: '🔢 Αριθμοί έως το 20.000',
      question: `Επίλεξε το σωστό σύμβολο σύγκρισης για τους αριθμούς:`,
      inputType: 'sym',
      valA: formatNumber(num1),
      valB: formatNumber(num2),
      correct: correctSym,
      explain: `Συγκρίνοντας τα ψηφία από τα αριστερά προς τα δεξιά, ισχύει ${formatNumber(num1)} ${correctSym} ${formatNumber(num2)}.`
    };
  } else {
    // Επόμενος / Προηγούμενος
    const num = getRandomInt(2000, 19998);
    const isNext = Math.random() > 0.5;
    const target = isNext ? num + 1 : num - 1;

    return {
      category: '🔢 Αριθμοί έως το 20.000',
      question: `Ποιος είναι ο ${isNext ? 'επόμενος' : 'προηγούμενος'} αριθμός του ${formatNumber(num)};`,
      inputType: 'number',
      correct: target.toString(),
      explain: `Ο ${isNext ? 'επόμενος' : 'προηγούμενος'} αριθμός του ${formatNumber(num)} είναι ο ${formatNumber(target)}.`
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
      question: `Πόσες πλευρές έχει συνολικά ένα ${selected.name.toLowerCase()};`,
      inputType: 'number',
      correct: selected.sides.toString(),
      explain: `Ένα ${selected.name.toLowerCase()} έχει ακριβώς ${selected.sides} πλευρές, ${selected.sides} κορυφές και ${selected.sides} γωνίες.`
    };
  } else {
    // 4 Επιλογές (ΟΜΑΔΑ Α)
    const wrongs = polygons.filter((p) => p.name !== selected.name).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [
      { text: selected.name, isCorrect: true },
      { text: wrongs[0].name, isCorrect: false },
      { text: wrongs[1].name, isCorrect: false },
      { text: wrongs[2].name, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    return {
      category: '📐 Πολύγωνα',
      question: `Πώς ονομάζεται το κανονικό πολύγωνο που έχει ακριβώς ${selected.sides} πλευρές;`,
      inputType: 'mcq',
      options,
      correct: selected.name,
      explain: `Το επίπεδο γεωμετρικό σχήμα με ${selected.sides} πλευρές ονομάζεται ${selected.name.toLowerCase()}.`
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
      question: `Υπολόγισε το αποτέλεσμα της πρόσθεσης: ${formatNumber(a)} ＋ ${formatNumber(b)}`,
      inputType: 'number',
      correct: sum.toString(),
      explain: `${formatNumber(a)} ＋ ${formatNumber(b)} ＝ ${formatNumber(sum)}.`
    };
  } else {
    const a = getRandomInt(5000, 18000);
    const b = getRandomInt(1000, a - 500);
    const diff = a - b;
    return {
      category: '➕ Πρόσθεση & Αφαίρεση',
      question: `Υπολόγισε το αποτέλεσμα της αφαίρεσης: ${formatNumber(a)} － ${formatNumber(b)}`,
      inputType: 'number',
      correct: diff.toString(),
      explain: `${formatNumber(a)} － ${formatNumber(b)} ＝ ${formatNumber(diff)} (επαλήθευση: ${formatNumber(diff)} ＋ ${formatNumber(b)} ＝ ${formatNumber(a)}).`
    };
  }
}

// 4. ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ (4 ΑΣΚΗΣΕΙΣ)
function genMultiplicationQuestion() {
  const isTwoDigit = Math.random() > 0.4;
  const a = getRandomInt(14, 150);
  const b = isTwoDigit ? getRandomInt(12, 35) : getRandomInt(4, 9);
  const prod = a * b;

  return {
    category: '✖️ Πολλαπλασιασμός',
    question: `Υπολόγισε το γινόμενο: ${formatNumber(a)} · ${b}`,
    inputType: 'number',
    correct: prod.toString(),
    explain: `Το γινόμενο των δύο παραγόντων είναι ${formatNumber(a)} · ${b} ＝ ${formatNumber(prod)}.`
  };
}

// 5. ΔΙΑΙΡΕΣΗ (4 ΑΣΚΗΣΕΙΣ)
function genDivisionQuestion() {
  const isExact = Math.random() > 0.5;
  const divisor = getRandomInt(3, 9);
  const quotient = getRandomInt(14, 120);

  if (isExact) {
    const dividend = divisor * quotient;
    return {
      category: '➗ Διαίρεση',
      question: `Υπολόγισε το πηλίκο της τέλειας διαίρεσης: ${formatNumber(dividend)} ： ${divisor}`,
      inputType: 'number',
      correct: quotient.toString(),
      explain: `${formatNumber(dividend)} ： ${divisor} ＝ ${formatNumber(quotient)}.`
    };
  } else {
    const remainder = getRandomInt(1, divisor - 1);
    const dividend = divisor * quotient + remainder;
    return {
      category: '➗ Διαίρεση',
      question: `Πόσο είναι το υπόλοιπο (υ) της διαίρεσης ${formatNumber(dividend)} ： ${divisor};`,
      inputType: 'number',
      correct: remainder.toString(),
      explain: `${formatNumber(dividend)} ＝ (${divisor} · ${formatNumber(quotient)}) ＋ ${remainder}, άρα το υπόλοιπο είναι ${remainder}.`
    };
  }
}

// 6. ΔΕΚΑΔΙΚΑ ΚΛΑΣΜΑΤΑ & ΔΕΚΑΔΙΚΟΙ (4 ΑΣΚΗΣΕΙΣ)
function genDecimalsQuestion() {
  const mode = getRandomInt(1, 2);
  const den = Math.random() > 0.5 ? 10 : 100;
  const num = den === 10 ? getRandomInt(1, 95) : getRandomInt(5, 480);
  const decStr = (num / den).toFixed(den === 10 ? 1 : 2).replace('.', ',');

  if (mode === 1) {
    return {
      category: '🔢 Δεκαδικά Κλάσματα & Δεκαδικοί',
      question: `Γράψε το δεκαδικό κλάσμα ${num}/${den} ως δεκαδικό αριθμό με υποδιαστολή:`,
      isFractionHeader: true,
      fractionNum: num,
      fractionDen: den,
      inputType: 'decimal',
      correct: decStr,
      explain: `${num}/${den} ＝ ${decStr}.`
    };
  } else {
    // 4 Επιλογές (ΟΜΑΔΑ Α)
    const options = [
      { text: `${num}/${den}`, num, den, isCorrect: true },
      { text: `${num}/${den === 10 ? 100 : 10}`, num, den: den === 10 ? 100 : 10, isCorrect: false },
      { text: `${num + 5}/${den}`, num: num + 5, den, isCorrect: false },
      { text: `${den}/${num}`, num: den, den: num, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    return {
      category: '🔢 Δεκαδικά Κλάσματα & Δεκαδικοί',
      question: `Ποιο δεκαδικό κλάσμα ισούται με τον αριθμό ${decStr};`,
      inputType: 'mcq-fraction',
      options,
      correct: `${num}/${den}`,
      explain: `Ο δεκαδικός αριθμός ${decStr} ισοδυναμεί με το δεκαδικό κλάσμα ${num}/${den}.`
    };
  }
}

// 7. ΜΟΝΑΔΕΣ ΜΗΚΟΥΣ (4 ΑΣΚΗΣΕΙΣ)
function genLengthQuestion() {
  const types = [
    { from: 'm', to: 'cm', factor: 100 },
    { from: 'km', to: 'm', factor: 1000 },
    { from: 'dm', to: 'cm', factor: 10 },
    { from: 'cm', to: 'mm', factor: 10 }
  ];

  const isBigToSmall = Math.random() > 0.4;
  const selected = types[getRandomInt(0, types.length - 1)];

  if (isBigToSmall) {
    const val = getRandomInt(2, 20);
    const correct = val * selected.factor;
    return {
      category: '📏 Μονάδες Μήκους',
      question: `Μετάτρεψε τη μονάδα μέτρησης μήκους: ${val} ${selected.from} ＝ ? ${selected.to}`,
      inputType: 'number',
      unitTo: selected.to,
      correct: correct.toString(),
      explain: `${val} ${selected.from} · ${formatNumber(selected.factor)} ＝ ${formatNumber(correct)} ${selected.to}.`
    };
  } else {
    const correct = getRandomInt(2, 15);
    const val = correct * selected.factor;
    return {
      category: '📏 Μονάδες Μήκους',
      question: `Μετάτρεψε τη μονάδα μέτρησης μήκους: ${formatNumber(val)} ${selected.to} ＝ ? ${selected.from}`,
      inputType: 'number',
      unitTo: selected.from,
      correct: correct.toString(),
      explain: `${formatNumber(val)} ${selected.to} ： ${formatNumber(selected.factor)} ＝ ${correct} ${selected.from}.`
    };
  }
}

// 8. ΜΟΝΑΔΕΣ ΒΑΡΟΥΣ (4 ΑΣΚΗΣΕΙΣ)
function genWeightQuestion() {
  const isBigToSmall = Math.random() > 0.5;
  if (isBigToSmall) {
    const val = getRandomInt(2, 14);
    const unit = Math.random() > 0.5 ? 'kg' : 't';
    const targetUnit = unit === 'kg' ? 'g' : 'kg';
    const correct = val * 1000;

    return {
      category: '⚖️ Μονάδες Βάρους',
      question: `Μετάτρεψε τη μονάδα μέτρησης βάρους: ${val} ${unit} ＝ ? ${targetUnit}`,
      inputType: 'number',
      unitTo: targetUnit,
      correct: correct.toString(),
      explain: `${val} ${unit} · 1.000 ＝ ${formatNumber(correct)} ${targetUnit}.`
    };
  } else {
    const correct = getRandomInt(2, 15);
    const val = correct * 1000;
    const unit = Math.random() > 0.5 ? 'g' : 'kg';
    const targetUnit = unit === 'g' ? 'kg' : 't';

    return {
      category: '⚖️ Μονάδες Βάρους',
      question: `Μετάτρεψε τη μονάδα μέτρησης βάρους: ${formatNumber(val)} ${unit} ＝ ? ${targetUnit}`,
      inputType: 'number',
      unitTo: targetUnit,
      correct: correct.toString(),
      explain: `${formatNumber(val)} ${unit} ： 1.000 ＝ ${correct} ${targetUnit}.`
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
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleNumericInput = (key, rawVal, isDecimal = false) => {
    if (submitted) return;
    const clean = isDecimal
      ? rawVal.replace('.', ',').replace(/[^0-9,]/g, '')
      : rawVal.replace(/\D/g, '');
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    questions.forEach((q, idx) => {
      const userAns = (answers[`q${idx}`] || '').toString().trim().replace('.', ',');
      const correctAns = q.correct.toString().trim().replace('.', ',');

      if (userAns === correctAns) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setSubmitted(true);
  };

  return (
    <Layout
      title="Επανάληψη Ενοτήτων 1 έως 9 | LearnMaths.gr"
      description="Μεγάλη επαναληπτική εξάσκηση 30 ερωτήσεων στα μαθηματικά Δ' Δημοτικού: αριθμοί έως 20.000, πολύγωνα, πράξεις, διαίρεση, δεκαδικοί, μήκος και βάρος."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Μαθήματα Δ'
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΠΑΝΑΛΗΨΗ 1 ΕΩΣ 9
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              🏆 Επανάληψη Ενοτήτων 1 έως 9 (30 Ερωτήσεις)
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-2xl">
              Δοκίμασε τις γνώσεις σου σε όλα όσα μάθαμε: Αριθμοί έως 20.000, πολύγωνα, πράξεις, διαίρεση, δεκαδικοί, μήκος & βάρος!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-xl hover:bg-amber-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες 30 Ερωτήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ 30 ΕΡΩΤΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {questions.map((q, idx) => {
            const qKey = `q${idx}`;
            const userAns = (answers[qKey] || '').toString().trim().replace('.', ',');
            const correctAns = q.correct.toString().trim().replace('.', ',');
            const isCorrect = userAns === correctAns;

            return (
              <div
                key={idx}
                className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
                  submitted
                    ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
                    : 'border-slate-100'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-blue-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-black tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    {q.category}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 sm:pl-10 mb-4 leading-snug">
                  {q.isFractionHeader ? (
                    <span className="inline-flex flex-wrap items-center gap-1.5">
                      <span>Γράψε το δεκαδικό κλάσμα</span>
                      <Fraction num={q.fractionNum} den={q.fractionDen} />
                      <span>ως δεκαδικό αριθμό με υποδιαστολή:</span>
                    </span>
                  ) : (
                    q.question
                  )}
                </h3>

                <div className="sm:pl-10 space-y-3">
                  {/* Τύπος: MCQ (Κείμενο) */}
                  {q.inputType === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[qKey] === opt.text;
                        return (
                          <label
                            key={oIdx}
                            className={`flex items-center justify-center p-3 rounded-2xl border cursor-pointer transition text-xs sm:text-sm font-bold select-none ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-sm'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                            } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
                          >
                            <input
                              type="radio"
                              id={`${qKey}-opt-${oIdx}`}
                              name={qKey}
                              value={opt.text}
                              checked={isSelected}
                              onChange={() => handleInputChange(qKey, opt.text)}
                              disabled={submitted}
                              className="hidden"
                            />
                            <span>{opt.text}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Τύπος: MCQ με Κλάσματα */}
                  {q.inputType === 'mcq-fraction' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[qKey] === opt.text;
                        return (
                          <label
                            key={oIdx}
                            className={`flex items-center justify-center p-3 rounded-2xl border cursor-pointer transition select-none ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-sm'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                            } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
                          >
                            <input
                              type="radio"
                              id={`${qKey}-opt-${oIdx}`}
                              name={qKey}
                              value={opt.text}
                              checked={isSelected}
                              onChange={() => handleInputChange(qKey, opt.text)}
                              disabled={submitted}
                              className="hidden"
                            />
                            <Fraction num={opt.num} den={opt.den} />
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Τύπος: Σύγκριση (Σύμβολα) */}
                  {q.inputType === 'sym' && (
                    <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-3 text-lg sm:text-xl font-mono font-black text-slate-800 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span>{q.valA}</span>
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
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-base sm:text-lg font-black border transition active:scale-95 touch-manipulation select-none flex items-center justify-center ${
                              answers[qKey] === sym
                                ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {sym}
                          </button>
                        ))}
                      </div>
                      <span>{q.valB}</span>
                    </div>
                  )}

                  {/* Τύπος: Αριθμητικό ή Δεκαδικό Input */}
                  {(q.inputType === 'number' || q.inputType === 'decimal') && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        inputMode={q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                        autoComplete="off"
                        id={`input-${qKey}`}
                        name={`input-${qKey}`}
                        placeholder="Γράψε την απάντησή σου..."
                        value={answers[qKey]}
                        onChange={(e) => handleNumericInput(qKey, e.target.value, q.inputType === 'decimal')}
                        disabled={submitted}
                        className="w-full sm:w-80 p-3 rounded-2xl border border-slate-300 font-mono text-base sm:text-lg font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-xs placeholder:font-normal placeholder:text-slate-400 bg-slate-50/50"
                      />
                      {q.unitTo && (
                        <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">
                          {q.unitTo}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {submitted && (
                  <div className="mt-4 sm:pl-10 text-xs sm:text-sm leading-relaxed">
                    {isCorrect ? (
                      <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                        {q.explain}
                      </p>
                    ) : (
                      <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                        {q.explain}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 Έλεγχος Απαντήσεων (30 Ερωτήσεις)
              </button>
            </div>
          )}
        </form>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Τελικό Σκορ:</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 30</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                Επιτυχία: <span className="text-emerald-400 font-black">{Math.round((score / 30) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες 30 Ερωτήσεις!
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Συμπλήρωσε όσο περισσότερες μπορείς και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

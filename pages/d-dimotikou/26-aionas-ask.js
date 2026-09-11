// pages/d-dimotikou/26-aionas-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function toRoman(num) {
  const romanMap = [
    { val: 21, str: 'XXI' },
    { val: 20, str: 'XX' },
    { val: 19, str: 'XIX' },
    { val: 18, str: 'XVIII' },
    { val: 17, str: 'XVII' },
    { val: 16, str: 'XVI' },
    { val: 15, str: 'XV' },
    { val: 14, str: 'XIV' },
    { val: 13, str: 'XIII' },
    { val: 12, str: 'XII' },
    { val: 11, str: 'XI' },
    { val: 10, str: 'X' },
    { val: 9, str: 'IX' },
    { val: 8, str: 'VIII' },
    { val: 7, str: 'VII' },
    { val: 6, str: 'VI' },
    { val: 5, str: 'V' },
    { val: 4, str: 'IV' },
    { val: 3, str: 'III' },
    { val: 2, str: 'II' },
    { val: 1, str: 'I' }
  ];
  const found = romanMap.find((item) => item.val === num);
  return found ? found.str : `${num}ος`;
}

// 1. Άσκηση: Εύρεση Αιώνα από Έτος (Input)
function makeCenturyQuestion(prevQ = null) {
  let isRound, year, century;

  while (true) {
    isRound = Math.random() > 0.6;
    year = isRound ? getRandomInt(10, 20) * 100 : getRandomInt(1001, 2030);
    century = Math.floor((year - 1) / 100) + 1;

    if (!prevQ || prevQ.year !== year) break;
  }

  return {
    q: `Σε ποιον αιώνα ανήκει το έτος ${formatNumber(year)}; (Γράψε μόνο τον αριθμό του αιώνα):`,
    year,
    correct: century,
    explainText:
      year % 100 === 0
        ? `Επειδή το έτος ${formatNumber(year)} τελειώνει σε 00, ανήκει ακριβώς στον ${century}ο αιώνα (${toRoman(century)}).`
        : `Κοιτάμε τις εκατοντάδες και προσθέτουμε 1: το ${formatNumber(year)} ανήκει στον ${century}ο αιώνα (${toRoman(century)}).`
  };
}

// 2. Άσκηση: Μετατροπές Μονάδων Χρόνου (Input)
function makeUnitConversionQuestion(prevQ = null) {
  let type, resultObj;

  while (true) {
    type = getRandomInt(1, 3);

    if (type === 1) {
      const years = getRandomInt(2, 8);
      const correct = years * 12;
      resultObj = {
        q: `Πόσους μήνες περιέχουν τα ${years} χρόνια (έτη);`,
        correct,
        unit: 'μήνες',
        explainText: `Επειδή 1 έτος ＝ 12 μήνες, τα ${years} χρόνια έχουν: ${years} · 12 ＝ ${correct} μήνες.`
      };
    } else if (type === 2) {
      const weeks = getRandomInt(3, 9);
      const correct = weeks * 7;
      resultObj = {
        q: `Πόσες ημέρες διαρκούν οι ${weeks} εβδομάδες;`,
        correct,
        unit: 'ημέρες',
        explainText: `Επειδή 1 εβδομάδα ＝ 7 ημέρες, οι ${weeks} εβδομάδες είναι: ${weeks} · 7 ＝ ${correct} ημέρες.`
      };
    } else {
      const centuries = getRandomInt(2, 6);
      const correct = centuries * 100;
      resultObj = {
        q: `Πόσα χρόνια (έτη) διαρκούν οι ${centuries} αιώνες;`,
        correct,
        unit: 'χρόνια',
        explainText: `Επειδή 1 αιώνας ＝ 100 χρόνια, οι ${centuries} αιώνες είναι: ${centuries} · 100 ＝ ${correct} χρόνια.`
      };
    }

    if (!prevQ || prevQ.correct !== resultObj.correct) break;
  }

  return resultObj;
}

// 3. Άσκηση: Πολλαπλή Επιλογή (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeCenturyRangeMCQQuestion(prevQ = null) {
  let c, startYear, endYear, roman, correctText;

  while (true) {
    c = getRandomInt(14, 21);
    startYear = (c - 1) * 100 + 1;
    endYear = c * 100;
    roman = toRoman(c);
    correctText = `Από το ${formatNumber(startYear)} έως και το ${formatNumber(endYear)}`;

    if (!prevQ || prevQ.correct !== correctText) break;
  }

  const wrong1 = `Από το ${formatNumber(startYear - 1)} έως και το ${formatNumber(endYear - 1)}`;
  const wrong2 = `Από το ${formatNumber(startYear + 100)} έως και το ${formatNumber(endYear + 100)}`;
  const wrong3 = `Από το ${formatNumber(startYear - 100)} έως και το ${formatNumber(endYear - 100)}`;

  const rawOptions = [correctText, wrong1, wrong2, wrong3];
  const uniqueOptions = Array.from(new Set(rawOptions));

  const choices = uniqueOptions
    .map((opt) => ({
      text: opt,
      isCorrect: opt === correctText
    }))
    .sort(() => Math.random() - 0.5);

  return {
    q: `Ποια είναι η ακριβής διάρκεια του ${c}ου αιώνα (${roman});`,
    options: choices,
    correct: correctText,
    explainText: `Ο ${c}ος αιώνας ξεκινά την 1η Ιανουαρίου του έτους ${formatNumber(startYear)} και ολοκληρώνεται την 31η Δεκεμβρίου του έτους ${formatNumber(endYear)}.`
  };
}

// 4. Άσκηση: Σωστό / Λάθος για Δίσεκτα Έτη & Αιώνες
// (Χωρίς «Σωστά!» ή «Λάθος!» στο κείμενο εξήγησης)
const TRUE_FALSE_POOL = [
  {
    q: 'Ένα δίσεκτο έτος έχει 366 ημέρες επειδή ο Φεβρουάριος έχει 29 ημέρες.',
    correct: 'Σωστό',
    explain: 'Στα δίσεκτα έτη προστίθεται μία επιπλέον ημέρα στο τέλος του Φεβρουαρίου (29 ημέρες).'
  },
  {
    q: 'Το ιστορικό έτος 1821 ανήκει στον 18ο αιώνα.',
    correct: 'Λάθος',
    explain: 'Επειδή το 1821 δεν τελειώνει σε 00, ανήκει στον 19ο αιώνα (18 ＋ 1 ＝ 19).'
  },
  {
    q: 'Το έτος 2000 ήταν δίσεκτο έτος και ανήκει στον 20ό αιώνα.',
    correct: 'Σωστό',
    explain: 'Το 2000 ήταν το τελευταίο έτος του 20ού αιώνα και διαίρεται ακριβώς με το 400, άρα ήταν δίσεκτο.'
  },
  {
    q: 'Μία δεκαετία αποτελείται από 100 χρόνια.',
    correct: 'Λάθος',
    explain: 'Μία δεκαετία αποτελείται από 10 χρόνια, ενώ από 100 χρόνια αποτελείται ο αιώνας.'
  },
  {
    q: 'Μία χιλιετία αποτελείται από 10 αιώνες (δηλαδή 1.000 χρόνια).',
    correct: 'Σωστό',
    explain: 'Ισχύει η ισότητα 10 αιώνες · 100 χρόνια ＝ 1.000 χρόνια ＝ 1 χιλιετία.'
  },
  {
    q: 'Τα δίσεκτα έτη συμβαίνουν κάθε 2 χρόνια.',
    correct: 'Λάθος',
    explain: 'Τα δίσεκτα έτη συμβαίνουν κάθε 4 χρόνια (με εξαίρεση ορισμένα έτη αιώνων που δεν διαιρούνται με το 400).'
  },
  {
    q: 'Το έτος 2024 ήταν δίσεκτο έτος (αφού διαιρείται ακριβώς με το 4).',
    correct: 'Σωστό',
    explain: 'Υπολογίζουμε 2024 ： 4 ＝ 506 (τέλεια διαίρεση με υπόλοιπο 0), επομένως το 2024 ήταν δίσεκτο.'
  }
];

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  const tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return {
    q1: makeCenturyQuestion(),
    q2: makeCenturyQuestion(),
    q3: makeUnitConversionQuestion(),
    q4: makeUnitConversionQuestion(),
    q5: makeCenturyRangeMCQQuestion(),
    q6: makeCenturyRangeMCQQuestion(),
    q7: tf1,
    q8: tf2
  };
}

export default function AionasAskPage() {
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

  // Render Input Number Ασκήσεων (Q1, Q2, Q3, Q4)
  const renderInputNumber = (qKey, qData, numLabel, colorClass, placeholderText, suffixUnit) => {
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
              placeholder={placeholderText}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
            />
            {suffixUnit && (
              <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">
                {suffixUnit}
              </span>
            )}
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
                Η σωστή απάντηση είναι <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)} {suffixUnit || ''}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render MCQ (Q5 & Q6, 4 Επιλογές)
  const renderMCQQuestion = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-purple-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
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
                <span className="leading-snug font-bold text-sm sm:text-base">{opt.text}</span>
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
          <span className="bg-indigo-700 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
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
      title="Ασκήσεις: Αιώνες & Δίσεκτα Έτη | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στους αιώνες, τα δίσεκτα έτη και τις μετατροπές μονάδων χρόνου."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/26-aionas"
          className="bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Αιώνες & Δίσεκτα Έτη
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», τα έτη και οι υπολογισμοί ανανεώνονται αυτόματα από τη δεξαμενή!
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
          {renderInputNumber('q1', questions.q1, 1, 'bg-purple-600', 'Αιώνας', 'ος αιώνας')}
          {renderInputNumber('q2', questions.q2, 2, 'bg-purple-600', 'Αιώνας', 'ος αιώνας')}

          {renderInputNumber('q3', questions.q3, 3, 'bg-indigo-600', 'Αποτέλεσμα', questions.q3.unit)}
          {renderInputNumber('q4', questions.q4, 4, 'bg-indigo-600', 'Αποτέλεσμα', questions.q4.unit)}

          {renderMCQQuestion('q5', questions.q5, 5)}
          {renderMCQQuestion('q6', questions.q6, 6)}

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

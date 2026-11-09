// pages/d-dimotikou/26-aionas-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Δ')/g);
  return parts
    .map((part) => {
      if (part === "Δ'") return "Δ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

export function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="text-[0.9em] px-1 pb-0.5 border-b border-current font-bold">{num}</span>
      <span className="text-[0.9em] px-1 pt-0.5 font-bold">{den}</span>
    </span>
  );
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
  return found ? found.str : `${num}`;
}

const translations = {
  el: {
    pageTitle: "Ασκήσεις: Αιώνες & Δίσεκτα Έτη | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στους αιώνες, τα δίσεκτα έτη και τις μετατροπές μονάδων χρόνου.",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "📝 Ασκήσεις: Αιώνες & Δίσεκτα Έτη",
    subtitle: "Πατώντας «Νέες Ασκήσεις», τα έτη και οι υπολογισμοί ανανεώνονται αυτόματα από τη δεξαμενή!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    fillReminder: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    resultLabel: "Αποτέλεσμα:",
    correctAnswerIs: "Η σωστή απάντηση είναι",
    correctRelationIs: "Η σωστή απάντηση είναι:",
    statementIs: "Η πρόταση είναι",
    trueLabel: "Σωστό",
    falseLabel: "Λάθος",
    placeholderCentury: "Αιώνας",
    suffixCentury: "ος αιώνας",
    placeholderResult: "Αποτέλεσμα",
    unitMonths: "μήνες",
    unitDays: "ημέρες",
    unitYears: "χρόνια",
    q1Prompt: (year) => `Σε ποιον αιώνα ανήκει το έτος ${year}; (Γράψε μόνο τον αριθμό του αιώνα):`,
    q1ExplainEndsIn00: (year, century, roman) => `Επειδή το έτος ${year} τελειώνει σε 00, ανήκει ακριβώς στον ${century}ο αιώνα (${roman}).`,
    q1ExplainRegular: (year, century, roman) => `Κοιτάμε τις εκατοντάδες και προσθέτουμε 1: το ${year} ανήκει στον ${century}ο αιώνα (${roman}).`,
    q2MonthsPrompt: (years) => `Πόσους μήνες περιέχουν τα ${years} χρόνια (έτη);`,
    q2MonthsExplain: (years, correct) => `Επειδή 1 έτος ＝ 12 μήνες, τα ${years} χρόνια έχουν: ${years} · 12 ＝ ${correct} μήνες.`,
    q2WeeksPrompt: (weeks) => `Πόσες ημέρες διαρκούν οι ${weeks} εβδομάδες;`,
    q2WeeksExplain: (weeks, correct) => `Επειδή 1 εβδομάδα ＝ 7 ημέρες, οι ${weeks} εβδομάδες είναι: ${weeks} · 7 ＝ ${correct} ημέρες.`,
    q2CenturiesPrompt: (centuries) => `Πόσα χρόνια (έτη) διαρκούν οι ${centuries} αιώνες;`,
    q2CenturiesExplain: (centuries, correct) => `Επειδή 1 αιώνας ＝ 100 χρόνια, οι ${centuries} αιώνες είναι: ${centuries} · 100 ＝ ${correct} χρόνια.`,
    q3Prompt: (c, roman) => `Ποια είναι η ακριβής διάρκεια του ${c}ου αιώνα (${roman});`,
    q3RangeTemplate: (start, end) => `Από το ${start} έως και το ${end}`,
    q3Explain: (c, start, end) => `Ο ${c}ος αιώνας ξεκινά την 1η Ιανουαρίου του έτους ${start} και ολοκληρώνεται την 31η Δεκεμβρίου του έτους ${end}.`,
    tfPool: [
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
    ]
  },
  en: {
    pageTitle: "Exercises: Centuries & Leap Years | LearnMaths.gr",
    pageDesc: "Interactive Grade 4 math exercises on centuries, leap years, and time unit conversions.",
    backText: "Grade 4",
    theoryBtn: "Theory",
    badge: "GRADE 4 • PRACTICE",
    title: "📝 Exercises: Centuries & Leap Years",
    subtitle: "Click «New Exercises» to dynamically refresh the years and questions from the pool!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "🎯 Check Answers",
    scoreLabel: "Score:",
    successRate: "Accuracy:",
    fillReminder: "Complete all questions and click «Check Answers»!",
    resultLabel: "Result:",
    correctAnswerIs: "The correct answer is",
    correctOptionIs: "The correct answer is:",
    statementIs: "The statement is",
    trueLabel: "True",
    falseLabel: "False",
    placeholderCentury: "Century",
    suffixCentury: "th century",
    placeholderResult: "Result",
    unitMonths: "months",
    unitDays: "days",
    unitYears: "years",
    q1Prompt: (year) => `Which century does the year ${year} belong to? (Enter only the century number):`,
    q1ExplainEndsIn00: (year, century, roman) => `Because year ${year} ends in 00, it belongs strictly to the ${century}th century (${roman}).`,
    q1ExplainRegular: (year, century, roman) => `We inspect the hundreds digits and add 1: year ${year} belongs to the ${century}th century (${roman}).`,
    q2MonthsPrompt: (years) => `How many months are there in ${years} years?`,
    q2MonthsExplain: (years, correct) => `Since 1 year ＝ 12 months, ${years} years are: ${years} · 12 ＝ ${correct} months.`,
    q2WeeksPrompt: (weeks) => `How many days do ${weeks} weeks last?`,
    q2WeeksExplain: (weeks, correct) => `Since 1 week ＝ 7 days, ${weeks} weeks are: ${weeks} · 7 ＝ ${correct} days.`,
    q2CenturiesPrompt: (centuries) => `How many years are there in ${centuries} centuries?`,
    q2CenturiesExplain: (centuries, correct) => `Since 1 century ＝ 100 years, ${centuries} centuries are: ${centuries} · 100 ＝ ${correct} years.`,
    q3Prompt: (c, roman) => `What is the exact span of the ${c}th century (${roman})?`,
    q3RangeTemplate: (start, end) => `From year ${start} up to and including ${end}`,
    q3Explain: (c, start, end) => `The ${c}th century begins on January 1st of year ${start} and ends on December 31st of year ${end}.`,
    tfPool: [
      {
        q: 'A leap year has 366 days because February has 29 days.',
        correct: 'True',
        explain: 'In leap years, an additional day is appended to the end of February (29 days).'
      },
      {
        q: 'The historic year 1821 belongs to the 18th century.',
        correct: 'False',
        explain: 'Because 1821 does not end in 00, it belongs to the 19th century (18 ＋ 1 ＝ 19).'
      },
      {
        q: 'The year 2000 was a leap year and belongs to the 20th century.',
        correct: 'True',
        explain: 'The year 2000 was the final year of the 20th century and is divisible by 400, making it a leap year.'
      },
      {
        q: 'A decade consists of 100 years.',
        correct: 'False',
        explain: 'A decade consists of 10 years, whereas a century consists of 100 years.'
      },
      {
        q: 'A millennium consists of 10 centuries (meaning 1,000 years).',
        correct: 'True',
        explain: 'The identity holds: 10 centuries · 100 years ＝ 1,000 years ＝ 1 millennium.'
      },
      {
        q: 'Leap years occur once every 2 years.',
        correct: 'False',
        explain: 'Leap years occur once every 4 years (with specific exceptions for century years not divisible by 400).'
      },
      {
        q: 'The year 2024 was a leap year (since it is divisible by 4).',
        correct: 'True',
        explain: 'We calculate 2024 ： 4 ＝ 506 (exact division with remainder 0), so 2024 was a leap year.'
      }
    ]
  }
};

// 1. Άσκηση: Εύρεση Αιώνα από Έτος (Input)
function makeCenturyQuestion(locale, t, formatNum, prevQ = null) {
  let isRound, year, century;

  while (true) {
    isRound = Math.random() > 0.6;
    year = isRound ? getRandomInt(10, 20) * 100 : getRandomInt(1001, 2030);
    century = Math.floor((year - 1) / 100) + 1;

    if (!prevQ || prevQ.year !== year) break;
  }

  const roman = toRoman(century);
  const formattedY = formatNum(year);

  return {
    q: t.q1Prompt(formattedY),
    year,
    correct: century,
    explainText:
      year % 100 === 0
        ? t.q1ExplainEndsIn00(formattedY, century, roman)
        : t.q1ExplainRegular(formattedY, century, roman)
  };
}

// 2. Άσκηση: Μετατροπές Μονάδων Χρόνου (Input)
function makeUnitConversionQuestion(locale, t, formatNum, prevQ = null) {
  let type, resultObj;

  while (true) {
    type = getRandomInt(1, 3);

    if (type === 1) {
      const years = getRandomInt(2, 8);
      const correct = years * 12;
      resultObj = {
        q: t.q2MonthsPrompt(formatNum(years)),
        correct,
        unit: t.unitMonths,
        explainText: t.q2MonthsExplain(formatNum(years), formatNum(correct))
      };
    } else if (type === 2) {
      const weeks = getRandomInt(3, 9);
      const correct = weeks * 7;
      resultObj = {
        q: t.q2WeeksPrompt(formatNum(weeks)),
        correct,
        unit: t.unitDays,
        explainText: t.q2WeeksExplain(formatNum(weeks), formatNum(correct))
      };
    } else {
      const centuries = getRandomInt(2, 6);
      const correct = centuries * 100;
      resultObj = {
        q: t.q2CenturiesPrompt(formatNum(centuries)),
        correct,
        unit: t.unitYears,
        explainText: t.q2CenturiesExplain(formatNum(centuries), formatNum(correct))
      };
    }

    if (!prevQ || prevQ.correct !== resultObj.correct) break;
  }

  return resultObj;
}

// 3. Άσκηση: Πολλαπλή Επιλογή (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeCenturyRangeMCQQuestion(locale, t, formatNum, prevQ = null) {
  let c, startYear, endYear, roman, correctText;

  while (true) {
    c = getRandomInt(14, 21);
    startYear = (c - 1) * 100 + 1;
    endYear = c * 100;
    roman = toRoman(c);
    correctText = t.q3RangeTemplate(formatNum(startYear), formatNum(endYear));

    if (!prevQ || prevQ.correct !== correctText) break;
  }

  const wrong1 = t.q3RangeTemplate(formatNum(startYear - 1), formatNum(endYear - 1));
  const wrong2 = t.q3RangeTemplate(formatNum(startYear + 100), formatNum(endYear + 100));
  const wrong3 = t.q3RangeTemplate(formatNum(startYear - 100), formatNum(endYear - 100));

  const rawOptions = [correctText, wrong1, wrong2, wrong3];
  const uniqueOptions = [...new Set(rawOptions)];

  while (uniqueOptions.length < 4) {
    const dummy = t.q3RangeTemplate(formatNum(startYear + getRandomInt(10, 50)), formatNum(endYear + getRandomInt(10, 50)));
    if (!uniqueOptions.includes(dummy)) {
      uniqueOptions.push(dummy);
    }
  }

  const choices = uniqueOptions
    .map((opt) => ({
      text: opt,
      isCorrect: opt === correctText
    }))
    .sort(() => Math.random() - 0.5);

  return {
    q: t.q3Prompt(c, roman),
    options: choices,
    correct: correctText,
    explainText: t.q3Explain(c, formatNum(startYear), formatNum(endYear))
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions(locale) {
  const t = translations[locale] || translations.el;
  const formatNum = (num) => num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');

  const q1 = makeCenturyQuestion(locale, t, formatNum);
  const q2 = makeCenturyQuestion(locale, t, formatNum, q1);

  const q3 = makeUnitConversionQuestion(locale, t, formatNum);
  const q4 = makeUnitConversionQuestion(locale, t, formatNum, q3);

  const q5 = makeCenturyRangeMCQQuestion(locale, t, formatNum);
  const q6 = makeCenturyRangeMCQQuestion(locale, t, formatNum, q5);

  const tf1 = t.tfPool[getRandomInt(0, t.tfPool.length - 1)];
  let tf2;
  while (true) {
    tf2 = t.tfPool[getRandomInt(0, t.tfPool.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return {
    q1,
    q2,
    q3,
    q4,
    q5,
    q6,
    q7: tf1,
    q8: tf2
  };
}

export default function AionasAskPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const formatNumber = (num) => {
    if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
  };

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(locale));
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, [locale]);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9]/g, '');
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
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">{t.resultLabel}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
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
                {t.correctAnswerIs} <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)} {suffixUnit || ''}</span>. {qData.explainText}
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
                <span className="break-words whitespace-normal leading-snug flex-1 font-bold text-sm sm:text-base">
                  {opt.text}
                </span>
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
                {t.correctRelationIs} <strong className="font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
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
    const trueVal = t.trueLabel;
    const falseVal = t.falseLabel;

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
          {[trueVal, falseVal].map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => handleInputChange(qKey, opt)}
              disabled={submitted}
              className={`px-6 sm:px-8 py-3 rounded-2xl font-black text-sm sm:text-base border transition active:scale-95 touch-manipulation select-none ${
                answers[qKey] === opt
                  ? (opt === trueVal ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-rose-600 text-white border-rose-700 shadow-md')
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
                {t.statementIs} <strong className="font-bold text-rose-900">«{qData.correct}»</strong>: {qData.explain}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/26-aionas"
          className="bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.title}
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-purple-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInputNumber('q1', questions.q1, 1, 'bg-purple-600', t.placeholderCentury, t.suffixCentury)}
          {renderInputNumber('q2', questions.q2, 2, 'bg-purple-600', t.placeholderCentury, t.suffixCentury)}

          {renderInputNumber('q3', questions.q3, 3, 'bg-indigo-600', t.placeholderResult, questions.q3.unit)}
          {renderInputNumber('q4', questions.q4, 4, 'bg-indigo-600', t.placeholderResult, questions.q4.unit)}

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
                {t.submitBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ΣΤΑΘΕΡΟ FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> {t.newQuestionsBtn}
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.fillReminder}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
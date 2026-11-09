// pages/d-dimotikou/25-ora-ask.js
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

const translations = {
  el: {
    pageTitle: "Ασκήσεις: Η Μέτρηση του Χρόνου και το Ρολόι | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στον χρόνο και το ρολόι: ανάγνωση αναλογικού ρολογιού, μετατροπές μονάδων και υπολογισμός διάρκειας.",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "📝 Ασκήσεις: Η Μέτρηση του Χρόνου και το Ρολόι",
    subtitle: "Πατώντας «Νέες Ασκήσεις», τα ρολόγια, οι ώρες και οι υπολογισμοί ανανεώνονται αυτόματα!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    fillReminder: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    resultLabel: "Αποτέλεσμα:",
    correctAnswerIs: "Η σωστή απάντηση είναι",
    correctOptionIs: "Η σωστή απάντηση είναι:",
    placeholderMinutes: "Λεπτά (min)",
    placeholderNumber: "Αριθμός",
    placeholderEndMinutes: "Λεπτά λήξης",
    unitMin: "min",
    unitSec: "s",
    q1Prompt: "Παρατήρησε το αναλογικό ρολόι και συμπλήρωσε πόσα λεπτά δείχνει ο μεγάλος (κόκκινος) δείκτης:",
    q1Explain: (m) => `Ο μεγάλος δείκτης ολοκληρώνει 60 λεπτά σε έναν πλήρη κύκλο. Στη συγκεκριμένη θέση αντιστοιχεί σε ${m} λεπτά.`,
    q2HoursPrompt: (val) => `Πόσα λεπτά (min) διαρκούν οι ${val} ώρες;`,
    q2HoursExplain: (val, correct) => `Επειδή 1 ώρα ＝ 60 λεπτά, οι ${val} ώρες είναι: ${val} · 60 ＝ ${correct} min.`,
    q2MinsPrompt: (val) => `Πόσα δευτερόλεπτα (s) διαρκούν τα ${val} λεπτά;`,
    q2MinsExplain: (val, correct) => `Επειδή 1 λεπτό ＝ 60 δευτερόλεπτα, τα ${val} λεπτά είναι: ${val} · 60 ＝ ${correct} s.`,
    q3Prompt: (formattedDigital) => `Το ψηφιακό ρολόι δείχνει ${formattedDigital}. Πώς εκφράζουμε αυτή την ώρα με απλά λόγια;`,
    q3Explain: (h, h12, formattedDigital, correctText) => `Αφαιρώντας 12 από το 24ωρο σύστημα (${h} － 12 ＝ ${h12}), η ώρα ${formattedDigital} αποδίδεται ως «${correctText}».`,
    q3Exact: (h12) => `${h12} ακριβώς το απόγευμα/βράδυ`,
    q3QuarterPast: (h12) => `${h12} και τέταρτο μ.μ.`,
    q3HalfPast: (h12) => `${h12} και μισή μ.μ.`,
    q3QuarterTo: (nextH12) => `${nextH12} παρά τέταρτο μ.μ.`,
    q3WrongHalfPast: (h12) => `${h12 + 1} και μισή μ.μ.`,
    q3WrongQuarterAm: (h12) => `${h12} και τέταρτο π.μ.`,
    q3WrongMorning: (h) => `${h} ακριβώς το πρωί`,
    q3WrongQuarterTo: (h12) => `${h12} παρά τέταρτο μ.μ.`,
    q3WrongNextHalf: (nextH12) => `${nextH12} και μισή μ.μ.`,
    q4Prompt: (startFormatted, duration) => `Μια προπόνηση ξεκίνησε στις ${startFormatted} και διήρκεσε ${duration} λεπτά. Πόσα είναι τα λεπτά της ώρας κατά την οποία ολοκληρώθηκε;`,
    q4Explain: (duration, startFormatted, endFormatted, endM) => `Προσθέτοντας ${duration} λεπτά στην ώρα εκκίνησης (${startFormatted}), η δραστηριότητα ολοκληρώθηκε στις ${endFormatted}, επομένως τα λεπτά είναι ${endM}.`
  },
  en: {
    pageTitle: "Exercises: Time Measurement & Clocks | LearnMaths.gr",
    pageDesc: "Interactive Grade 4 math exercises on time and clocks: reading analog clocks, unit conversions, and calculating duration.",
    backText: "Grade 4",
    theoryBtn: "Theory",
    badge: "GRADE 4 • PRACTICE",
    title: "📝 Exercises: Time Measurement & Clocks",
    subtitle: "Click «New Exercises» to dynamically refresh the clocks, times, and calculations!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "🎯 Check Answers",
    scoreLabel: "Score:",
    successRate: "Accuracy:",
    fillReminder: "Complete all questions and click «Check Answers»!",
    resultLabel: "Result:",
    correctAnswerIs: "The correct answer is",
    correctOptionIs: "The correct answer is:",
    placeholderMinutes: "Minutes (min)",
    placeholderNumber: "Number",
    placeholderEndMinutes: "End minutes",
    unitMin: "min",
    unitSec: "s",
    q1Prompt: "Look at the analog clock and enter how many minutes the long (red) hand points to:",
    q1Explain: (m) => `The long minute hand completes 60 minutes in a full circle. At this position, it indicates ${m} minutes.`,
    q2HoursPrompt: (val) => `How many minutes (min) are there in ${val} hours?`,
    q2HoursExplain: (val, correct) => `Since 1 hour ＝ 60 minutes, ${val} hours are: ${val} · 60 ＝ ${correct} min.`,
    q2MinsPrompt: (val) => `How many seconds (s) are there in ${val} minutes?`,
    q2MinsExplain: (val, correct) => `Since 1 minute ＝ 60 seconds, ${val} minutes are: ${val} · 60 ＝ ${correct} s.`,
    q3Prompt: (formattedDigital) => `The digital clock displays ${formattedDigital}. How do we state this time in spoken words?`,
    q3Explain: (h, h12, formattedDigital, correctText) => `Subtracting 12 from the 24-hour time (${h} － 12 ＝ ${h12}), ${formattedDigital} is read as "${correctText}".`,
    q3Exact: (h12) => `${h12} o'clock in the afternoon/evening`,
    q3QuarterPast: (h12) => `quarter past ${h12} PM`,
    q3HalfPast: (h12) => `half past ${h12} PM`,
    q3QuarterTo: (nextH12) => `quarter to ${nextH12} PM`,
    q3WrongHalfPast: (h12) => `half past ${h12 + 1} PM`,
    q3WrongQuarterAm: (h12) => `quarter past ${h12} AM`,
    q3WrongMorning: (h) => `${h} o'clock in the morning`,
    q3WrongQuarterTo: (h12) => `quarter to ${h12} PM`,
    q3WrongNextHalf: (nextH12) => `half past ${nextH12} PM`,
    q4Prompt: (startFormatted, duration) => `A practice session started at ${startFormatted} and lasted ${duration} minutes. How many are the minutes digits of the completion time?`,
    q4Explain: (duration, startFormatted, endFormatted, endM) => `Adding ${duration} minutes to the start time (${startFormatted}), the activity concluded at ${endFormatted}, so the minutes value is ${endM}.`
  }
};

// 1. Άσκηση: Ανάγνωση Αναλογικού Ρολογιού (SVG)
function makeClockReadingQuestion(locale, t, formatNum, prevQ = null) {
  let h, m;
  const minutesOptions = [0, 15, 30, 45, 10, 20, 40, 50];

  while (true) {
    h = getRandomInt(1, 12);
    m = minutesOptions[getRandomInt(0, minutesOptions.length - 1)];
    if (!prevQ || prevQ.h !== h || prevQ.m !== m) break;
  }

  const hourAngle = (h * 30) + (m * 0.5);
  const minuteAngle = m * 6;

  const clockSvg = (
    <div className="w-40 h-40 sm:w-44 sm:h-44 mx-auto my-2">
      <svg className="w-full h-full block select-none" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="#0f172a" stroke="#38bdf8" strokeWidth="5.5" />
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
          const angle = (num * 30) * (Math.PI / 180);
          const x = 100 + 70 * Math.sin(angle);
          const y = 100 - 70 * Math.cos(angle);
          return (
            <text
              key={num}
              x={x}
              y={y + 5}
              textAnchor="middle"
              fill="#f8fafc"
              fontSize="13"
              fontWeight="900"
              fontFamily="monospace"
            >
              {num}
            </text>
          );
        })}
        {/* Δείκτης Ώρας (Μπλε) */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="55"
          stroke="#38bdf8"
          strokeWidth="5.5"
          strokeLinecap="round"
          transform={`rotate(${hourAngle}, 100, 100)`}
        />
        {/* Δείκτης Λεπτών (Ροζ/Κόκκινο) */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="32"
          stroke="#f43f5e"
          strokeWidth="3.5"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle}, 100, 100)`}
        />
        <circle cx="100" cy="100" r="5" fill="#fbbf24" />
      </svg>
    </div>
  );

  return {
    q: t.q1Prompt,
    h,
    m,
    svg: clockSvg,
    correct: m,
    explainText: t.q1Explain(formatNum(m))
  };
}

// 2. Άσκηση: Μετατροπή Μονάδων Χρόνου (Input)
function makeTimeConversionQuestion(locale, t, formatNum, prevQ = null) {
  let isHoursToMinutes, val, correct, resultObj;

  while (true) {
    isHoursToMinutes = Math.random() > 0.5;
    val = getRandomInt(2, 6);

    if (isHoursToMinutes) {
      correct = val * 60;
      resultObj = {
        q: t.q2HoursPrompt(formatNum(val)),
        correct,
        unit: t.unitMin,
        explainText: t.q2HoursExplain(formatNum(val), formatNum(correct))
      };
    } else {
      correct = val * 60;
      resultObj = {
        q: t.q2MinsPrompt(formatNum(val)),
        correct,
        unit: t.unitSec,
        explainText: t.q2MinsExplain(formatNum(val), formatNum(correct))
      };
    }

    if (!prevQ || prevQ.correct !== resultObj.correct) break;
  }

  return resultObj;
}

// 3. Άσκηση: Μετατροπή 24ωρου σε Λεκτικό 12ωρο (MCQ)
function makeDigitalToSpokenMCQQuestion(locale, t, formatNum, prevQ = null) {
  let h, m, correctText, formattedDigital;
  const pmHours = [13, 14, 15, 16, 17, 18, 19, 20, 21];

  while (true) {
    h = pmHours[getRandomInt(0, pmHours.length - 1)];
    m = [0, 15, 30, 45][getRandomInt(0, 3)];

    const h12 = h - 12;
    const nextH12 = h12 + 1;

    if (m === 0) correctText = t.q3Exact(h12);
    else if (m === 15) correctText = t.q3QuarterPast(h12);
    else if (m === 30) correctText = t.q3HalfPast(h12);
    else if (m === 45) correctText = t.q3QuarterTo(nextH12);

    formattedDigital = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    if (!prevQ || prevQ.correct !== correctText) break;
  }

  const h12 = h - 12;
  const nextH12 = h12 + 1;

  const rawWrongs = [
    t.q3WrongHalfPast(h12),
    t.q3WrongQuarterAm(h12),
    t.q3WrongMorning(h),
    t.q3WrongQuarterTo(h12),
    t.q3WrongNextHalf(nextH12)
  ].filter((w) => w !== correctText);

  const rawOptions = [correctText, ...rawWrongs.slice(0, 3)];
  const options = [...new Set(rawOptions)].sort(() => Math.random() - 0.5);

  return {
    q: t.q3Prompt(formattedDigital),
    options,
    correct: correctText,
    explainText: t.q3Explain(formatNum(h), formatNum(h12), formattedDigital, correctText)
  };
}

// 4. Άσκηση: Υπολογισμός Χρονικής Διάρκειας Προβλήματος (Input)
function makeDurationProblemQuestion(locale, t, formatNum, prevQ = null) {
  let startH, startM, duration, endH, endM, startFormatted, endFormatted;

  while (true) {
    startH = getRandomInt(14, 19);
    startM = [0, 10, 15, 20, 30][getRandomInt(0, 4)];
    duration = [15, 20, 30, 40, 45][getRandomInt(0, 4)];

    const totalStartMin = startH * 60 + startM;
    const totalEndMin = totalStartMin + duration;

    endH = Math.floor(totalEndMin / 60);
    endM = totalEndMin % 60;

    startFormatted = `${startH}:${startM.toString().padStart(2, '0')}`;
    endFormatted = `${endH}:${endM.toString().padStart(2, '0')}`;

    if (!prevQ || prevQ.endFormatted !== endFormatted) break;
  }

  return {
    q: t.q4Prompt(startFormatted, formatNum(duration)),
    correct: endM,
    endFormatted,
    explainText: t.q4Explain(formatNum(duration), startFormatted, endFormatted, formatNum(endM))
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions(locale) {
  const t = translations[locale] || translations.el;
  const formatNum = (num) => num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');

  const q1 = makeClockReadingQuestion(locale, t, formatNum);
  const q2 = makeClockReadingQuestion(locale, t, formatNum, q1);

  const q3 = makeTimeConversionQuestion(locale, t, formatNum);
  const q4 = makeTimeConversionQuestion(locale, t, formatNum, q3);

  const q5 = makeDigitalToSpokenMCQQuestion(locale, t, formatNum);
  const q6 = makeDigitalToSpokenMCQQuestion(locale, t, formatNum, q5);

  const q7 = makeDurationProblemQuestion(locale, t, formatNum);
  const q8 = makeDurationProblemQuestion(locale, t, formatNum, q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function OraAskPage() {
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
    if (parseInt(answers.q7, 10) === questions.q7.correct) currentScore += 1;
    if (parseInt(answers.q8, 10) === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Input Number Ασκήσεων (Q1, Q2, Q3, Q4, Q7, Q8)
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

        {qData.svg && <div className="mb-4">{qData.svg}</div>}

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
              className="w-40 sm:w-52 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
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
            const isSelected = answers[qKey] === opt;
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
                  value={opt}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt)}
                  disabled={submitted}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 shrink-0"
                />
                <span className="break-words whitespace-normal leading-snug flex-1 font-bold text-sm sm:text-base">
                  {opt}
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
                {t.correctOptionIs} <strong className="font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
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
          href="/d-dimotikou/25-ora"
          className="bg-blue-100 hover:bg-blue-200 text-blue-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.title}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-blue-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInputNumber('q1', questions.q1, 1, 'bg-blue-600', t.placeholderMinutes, t.unitMin)}
          {renderInputNumber('q2', questions.q2, 2, 'bg-blue-600', t.placeholderMinutes, t.unitMin)}

          {renderInputNumber('q3', questions.q3, 3, 'bg-cyan-600', t.placeholderNumber, questions.q3.unit)}
          {renderInputNumber('q4', questions.q4, 4, 'bg-cyan-600', t.placeholderNumber, questions.q4.unit)}

          {renderMCQQuestion('q5', questions.q5, 5)}
          {renderMCQQuestion('q6', questions.q6, 6)}

          {renderInputNumber('q7', questions.q7, 7, 'bg-indigo-600', t.placeholderEndMinutes, t.unitMin)}
          {renderInputNumber('q8', questions.q8, 8, 'bg-indigo-600', t.placeholderEndMinutes, t.unitMin)}

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
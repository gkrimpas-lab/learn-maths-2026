// pages/d-dimotikou/25-ora-ask.js
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

// 1. Άσκηση: Ανάγνωση Αναλογικού Ρολογιού (SVG)
function makeClockReadingQuestion(prevQ = null) {
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
    q: 'Παρατήρησε το αναλογικό ρολόι και συμπλήρωσε πόσα λεπτά δείχνει ο μεγάλος (κόκκινος) δείκτης:',
    h,
    m,
    svg: clockSvg,
    correct: m,
    explainText: `Ο μεγάλος δείκτης ολοκληρώνει 60 λεπτά σε έναν πλήρη κύκλο. Στη συγκεκριμένη θέση αντιστοιχεί σε ${m} λεπτά.`
  };
}

// 2. Άσκηση: Μετατροπή Μονάδων Χρόνου (Input)
function makeTimeConversionQuestion(prevQ = null) {
  let isHoursToMinutes, val, correct, resultObj;

  while (true) {
    isHoursToMinutes = Math.random() > 0.5;
    val = getRandomInt(2, 6);

    if (isHoursToMinutes) {
      correct = val * 60;
      resultObj = {
        q: `Πόσα λεπτά (min) διαρκούν οι ${val} ώρες;`,
        correct,
        unit: 'min',
        explainText: `Επειδή 1 ώρα ＝ 60 λεπτά, οι ${val} ώρες είναι: ${val} · 60 ＝ ${formatNumber(correct)} min.`
      };
    } else {
      correct = val * 60;
      resultObj = {
        q: `Πόσα δευτερόλεπτα (s) διαρκούν τα ${val} λεπτά;`,
        correct,
        unit: 's',
        explainText: `Επειδή 1 λεπτό ＝ 60 δευτερόλεπτα, τα ${val} λεπτά είναι: ${val} · 60 ＝ ${formatNumber(correct)} s.`
      };
    }

    if (!prevQ || prevQ.correct !== resultObj.correct) break;
  }

  return resultObj;
}

// 3. Άσκηση: Μετατροπή 24ωρου σε Λεκτικό 12ωρο (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeDigitalToSpokenMCQQuestion(prevQ = null) {
  let h, m, correctText, formattedDigital;
  const pmHours = [13, 14, 15, 16, 17, 18, 19, 20, 21];

  while (true) {
    h = pmHours[getRandomInt(0, pmHours.length - 1)];
    m = [0, 15, 30, 45][getRandomInt(0, 3)];

    const h12 = h - 12;
    const nextH12 = h12 + 1;

    if (m === 0) correctText = `${h12} ακριβώς το απόγευμα/βράδυ`;
    else if (m === 15) correctText = `${h12} και τέταρτο μ.μ.`;
    else if (m === 30) correctText = `${h12} και μισή μ.μ.`;
    else if (m === 45) correctText = `${nextH12} παρά τέταρτο μ.μ.`;

    formattedDigital = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    if (!prevQ || prevQ.correct !== correctText) break;
  }

  const h12 = h - 12;
  const nextH12 = h12 + 1;

  const wrongs = [
    `${h12 + 1} και μισή μ.μ.`,
    `${h12} και τέταρτο π.μ.`,
    `${h} ακριβώς το πρωί`,
    `${h12} παρά τέταρτο μ.μ.`,
    `${nextH12} και μισή μ.μ.`
  ].filter((w) => w !== correctText);

  const options = [correctText, ...wrongs.slice(0, 3)].sort(() => Math.random() - 0.5);

  return {
    q: `Το ψηφιακό ρολόι δείχνει ${formattedDigital}. Πώς εκφράζουμε αυτή την ώρα με απλά λόγια;`,
    options,
    correct: correctText,
    explainText: `Αφαιρώντας 12 από το 24ωρο σύστημα (${h} － 12 ＝ ${h12}), η ώρα ${formattedDigital} αποδίδεται ως «${correctText}».`
  };
}

// 4. Άσκηση: Υπολογισμός Χρονικής Διάρκειας Προβλήματος (Input)
function makeDurationProblemQuestion(prevQ = null) {
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
    q: `Μια προπόνηση ξεκίνησε στις ${startFormatted} και διήρκεσε ${duration} λεπτά. Πόσα είναι τα λεπτά της ώρας κατά την οποία ολοκληρώθηκε;`,
    correct: endM,
    endFormatted,
    explainText: `Προσθέτοντας ${duration} λεπτά στην ώρα εκκίνησης (${startFormatted}), η δραστηριότητα ολοκληρώθηκε στις ${endFormatted}, επομένως τα λεπτά είναι ${endM}.`
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  const q1 = makeClockReadingQuestion();
  const q2 = makeClockReadingQuestion(q1);

  const q3 = makeTimeConversionQuestion();
  const q4 = makeTimeConversionQuestion(q3);

  const q5 = makeDigitalToSpokenMCQQuestion();
  const q6 = makeDigitalToSpokenMCQQuestion(q5);

  const q7 = makeDurationProblemQuestion();
  const q8 = makeDurationProblemQuestion(q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function OraAskPage() {
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
                <span className="leading-snug font-bold text-sm sm:text-base">{opt}</span>
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

  return (
    <Layout
      title="Ασκήσεις: Η Μέτρηση του Χρόνου και το Ρολόι | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στον χρόνο και το ρολόι: ανάγνωση αναλογικού ρολογιού, μετατροπές μονάδων και υπολογισμός διάρκειας."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/25-ora"
          className="bg-blue-100 hover:bg-blue-200 text-blue-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Η Μέτρηση του Χρόνου και το Ρολόι
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», τα ρολόγια, οι ώρες και οι υπολογισμοί ανανεώνονται αυτόματα!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-blue-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderInputNumber('q1', questions.q1, 1, 'bg-blue-600', 'Λεπτά (min)', 'min')}
          {renderInputNumber('q2', questions.q2, 2, 'bg-blue-600', 'Λεπτά (min)', 'min')}

          {renderInputNumber('q3', questions.q3, 3, 'bg-cyan-600', 'Αριθμός', questions.q3.unit)}
          {renderInputNumber('q4', questions.q4, 4, 'bg-cyan-600', 'Αριθμός', questions.q4.unit)}

          {renderMCQQuestion('q5', questions.q5, 5)}
          {renderMCQQuestion('q6', questions.q6, 6)}

          {renderInputNumber('q7', questions.q7, 7, 'bg-indigo-600', 'Λεπτά λήξης', 'min')}
          {renderInputNumber('q8', questions.q8, 8, 'bg-indigo-600', 'Λεπτά λήξης', 'min')}

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

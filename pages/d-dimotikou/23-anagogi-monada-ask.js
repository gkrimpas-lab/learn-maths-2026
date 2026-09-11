// pages/d-dimotikou/23-anagogi-monada-ask.js
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

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΗ 20+ ΑΝΤΙΚΕΙΜΕΝΩΝ ΜΕ ΠΛΗΡΗ ΓΡΑΜΜΑΤΙΚΗ ΔΟΜΗ
// ----------------------------------------------------
const ITEMS_POOL = [
  // Ουδέτερα
  { name: 'μολύβια', single: 'μολύβι', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '✏️' },
  { name: 'τετράδια', single: 'τετράδιο', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '📓' },
  { name: 'βιβλία', single: 'βιβλίο', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '📚' },
  { name: 'παγωτά', single: 'παγωτό', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '🍦' },
  { name: 'εισιτήρια', single: 'εισιτήριο', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '🎟️' },
  { name: 'μπλουζάκια', single: 'μπλουζάκι', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '👕' },
  { name: 'κρουασάν', single: 'κρουασάν', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '🥐' },
  { name: 'παιχνίδια', single: 'παιχνίδι', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '🧸' },
  { name: 'κουτιά μαρκαδόροι', single: 'κουτί μαρκαδόροι', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '🎨' },
  { name: 'πακέτα αυτοκόλλητα', single: 'πακέτο αυτοκόλλητα', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '📦' },
  { name: 'σάντουιτς', single: 'σάντουιτς', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '🥪' },
  { name: 'ρολόγια', single: 'ρολόι', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '⌚' },

  // Θηλυκά
  { name: 'μπάλες', single: 'μπάλα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '⚽' },
  { name: 'σοκολάτες', single: 'σοκολάτα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '🍫' },
  { name: 'τυρόπιτες', single: 'τυρόπιτα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '🥧' },
  { name: 'τσάντες', single: 'τσάντα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '🎒' },
  { name: 'γόμες', single: 'γόμα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '🧼' },
  { name: 'ξύστρες', single: 'ξύστρα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '✂️' },
  { name: 'πίτσες', single: 'πίτσα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '🍕' },
  { name: 'κούπες', single: 'κούπα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '☕' },

  // Αρσενικά
  { name: 'χυμοί', single: 'χυμός', artPlural: 'οι', artSingle: 'ο', howMany: 'πόσους', emoji: '🧃' },
  { name: 'χάρακες', single: 'χάρακας', artPlural: 'οι', artSingle: 'ο', howMany: 'πόσους', emoji: '📏' },
  { name: 'φάκελοι', single: 'φάκελος', artPlural: 'οι', artSingle: 'ο', howMany: 'πόσους', emoji: '✉️' },
  { name: 'πίνακες', single: 'πίνακας', artPlural: 'οι', artSingle: 'ο', howMany: 'πόσους', emoji: '🖼️' }
];

// 1. Άσκηση: Εύρεση της Μονάδας (Βήμα 1 - Input)
function makeUnitOnlyQuestion(prevQ = null) {
  let item, qty, costPerUnit, totalCost;

  while (true) {
    item = ITEMS_POOL[getRandomInt(0, ITEMS_POOL.length - 1)];
    qty = getRandomInt(3, 8);
    costPerUnit = getRandomInt(2, 7);
    totalCost = qty * costPerUnit;

    if (!prevQ || prevQ.item !== item.name) break;
  }

  return {
    item: item.name,
    q: `Αν ${item.artPlural} ${qty} ${item.name} ${item.emoji} κοστίζουν ${totalCost} €, πόσο κοστίζει ${item.artSingle} 1 ${item.single};`,
    correct: costPerUnit,
    unit: '€',
    explainText: `Διαιρούμε το συνολικό κόστος με το πλήθος: ${totalCost} ： ${qty} ＝ ${costPerUnit} € για ${item.artSingle} 1 ${item.single}.`
  };
}

// 2. Άσκηση: Πλήρης Αναγωγή στη Μονάδα (Βήμα 1 & 2 - Input)
function makeFullAnagogiQuestion(prevQ = null) {
  let item, q1, costPerUnit, total1, q2, total2;

  while (true) {
    item = ITEMS_POOL[getRandomInt(0, ITEMS_POOL.length - 1)];
    q1 = getRandomInt(2, 5);
    costPerUnit = getRandomInt(2, 8);
    total1 = q1 * costPerUnit;

    q2 = getRandomInt(4, 9);
    while (q2 === q1) {
      q2 = getRandomInt(4, 9);
    }
    total2 = q2 * costPerUnit;

    if (!prevQ || prevQ.item !== item.name) break;
  }

  return {
    item: item.name,
    q: `Αν ${item.artPlural} ${q1} ${item.name} ${item.emoji} κοστίζουν ${total1} €, πόσο κοστίζουν ${item.artPlural} ${q2} ${item.name};`,
    correct: total2,
    unit: '€',
    explainText: `Βήμα 1: ${item.artSingle} 1 ${item.single} κοστίζει ${total1} ： ${q1} ＝ ${costPerUnit} €. Βήμα 2: ${item.artPlural} ${q2} ${item.name} κοστίζουν ${q2} · ${costPerUnit} ＝ ${total2} €.`
  };
}

// 3. Άσκηση: Πολλαπλή Επιλογή με 4 Επιλογές (ΟΜΑΔΑ Α - MCQ)
function makeMCQAnagogiQuestion(prevQ = null) {
  let item, q1, unitCost, total1, q2, correct, correctText;

  while (true) {
    item = ITEMS_POOL[getRandomInt(0, ITEMS_POOL.length - 1)];
    q1 = getRandomInt(2, 5);
    unitCost = getRandomInt(2, 6);
    total1 = q1 * unitCost;

    q2 = getRandomInt(4, 9);
    while (q2 === q1) {
      q2 = getRandomInt(4, 9);
    }
    correct = q2 * unitCost;
    correctText = `${correct} €`;

    if (!prevQ || prevQ.correct !== correctText) break;
  }

  const wrong1 = `${correct + unitCost} €`;
  const wrong2 = `${correct - unitCost} €`;
  const wrong3 = `${correct + 2 * unitCost} €`;

  const rawOptions = [correctText, wrong1, wrong2, wrong3];
  const uniqueOptions = Array.from(new Set(rawOptions));

  while (uniqueOptions.length < 4) {
    const dummy = `${correct + getRandomInt(3, 15)} €`;
    if (!uniqueOptions.includes(dummy)) {
      uniqueOptions.push(dummy);
    }
  }

  const choices = uniqueOptions.map((opt) => ({
    text: opt,
    isCorrect: opt === correctText
  })).sort(() => Math.random() - 0.5);

  return {
    q: `Αν ${item.artPlural} ${q1} ${item.name} ${item.emoji} κοστίζουν ${total1} €, πόσο θα πληρώσουμε για ${q2} ${item.name};`,
    options: choices,
    correct: correctText,
    explainText: `Βήμα 1: ${item.artSingle} 1 ${item.single} κοστίζει ${total1} ： ${q1} ＝ ${unitCost} €. Βήμα 2: ${item.artPlural} ${q2} κοστίζουν ${q2} · ${unitCost} ＝ ${correct} €.`
  };
}

// 4. Άσκηση: Αντίστροφη Αναγωγή στη Μονάδα (Input - Εύρεση Ποσότητας)
function makeReverseAnagogiQuestion(prevQ = null) {
  let item, q1, costPerUnit, total1, targetQty, totalAvailable;

  while (true) {
    item = ITEMS_POOL[getRandomInt(0, ITEMS_POOL.length - 1)];
    q1 = getRandomInt(2, 4);
    costPerUnit = getRandomInt(2, 5);
    total1 = q1 * costPerUnit;

    targetQty = getRandomInt(5, 10);
    totalAvailable = targetQty * costPerUnit;

    if (!prevQ || prevQ.item !== item.name) break;
  }

  return {
    item: item.name,
    q: `Αν ${item.artPlural} ${q1} ${item.name} ${item.emoji} κοστίζουν ${total1} €, ${item.howMany} ${item.name} μπορούμε να αγοράσουμε με ${totalAvailable} €;`,
    correct: targetQty,
    unit: item.name,
    explainText: `Βήμα 1: ${item.artSingle} 1 ${item.single} κοστίζει ${total1} ： ${q1} ＝ ${costPerUnit} €. Βήμα 2: Με ${totalAvailable} € αγοράζουμε ${totalAvailable} ： ${costPerUnit} ＝ ${targetQty} ${item.name}.`
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  const q1 = makeUnitOnlyQuestion();
  const q2 = makeUnitOnlyQuestion(q1);

  const q3 = makeFullAnagogiQuestion();
  const q4 = makeFullAnagogiQuestion(q3);

  const q5 = makeMCQAnagogiQuestion();
  const q6 = makeMCQAnagogiQuestion(q5);

  const q7 = makeReverseAnagogiQuestion();
  const q8 = makeReverseAnagogiQuestion(q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function AnagogiMonadaAskPage() {
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
              className="w-40 sm:w-52 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-slate-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
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
                <span className="leading-snug font-mono font-bold text-sm sm:text-base">{opt.text}</span>
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
                Η σωστή απάντηση είναι: <strong className="font-mono font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Αναγωγή στη Μονάδα | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στη μέθοδο της αναγωγής στη μονάδα: εύρεση τιμής μονάδας, υπολογισμός νέου κόστους και αντίστροφη εύρεση ποσότητας."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/23-anagogi-monada"
          className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Αναγωγή στη Μονάδα
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», τα προβλήματα, τα αντικείμενα και τα ποσά ανανεώνονται αυτόματα!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderInputNumber('q1', questions.q1, 1, 'bg-blue-600', 'Τιμή για το 1', '€')}
          {renderInputNumber('q2', questions.q2, 2, 'bg-blue-600', 'Τιμή για το 1', '€')}

          {renderInputNumber('q3', questions.q3, 3, 'bg-emerald-600', 'Τελικό κόστος', '€')}
          {renderInputNumber('q4', questions.q4, 4, 'bg-emerald-600', 'Τελικό κόστος', '€')}

          {renderMCQQuestion('q5', questions.q5, 5)}
          {renderMCQQuestion('q6', questions.q6, 6)}

          {renderInputNumber('q7', questions.q7, 7, 'bg-amber-600', 'Πλήθος', questions.q7.unit)}
          {renderInputNumber('q8', questions.q8, 8, 'bg-amber-600', 'Πλήθος', questions.q8.unit)}

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

// pages/e-dimotikou/04-anagogi-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Υπολογισμός Κλασματικής Μονάδας ( 1/β ) & Ολόκληρου Ποσού (Input)
function makeUnitAndTotalQuestion(findTotal = false) {
  const denList = [4, 5, 6, 7, 8, 9, 10];
  const den = denList[getRandomInt(0, denList.length - 1)];
  const num = getRandomInt(2, den - 1);
  const unitVal = getRandomInt(12, 35) * 5; // Στρογγυλοποιημένες ρεαλιστικές τιμές
  const knownVal = num * unitVal;
  const totalVal = den * unitVal;

  if (!findTotal) {
    // q1: Εύρεση της κλασματικής μονάδας 1/β
    return {
      type: 'input',
      correct: unitVal,
      unit: '€',
      prompt: `Τα ${num}/${den} ενός ηλεκτρονικού υπολογιστή κοστίζουν ${knownVal} €. Πόσο κοστίζει η κλασματική μονάδα (το 1/${den}) του υπολογιστή;`,
      explanation: `Για να βρούμε την αξία του 1/${den}, διαιρούμε τη γνωστή τιμή με τον αριθμητή: ${knownVal} ： ${num} ＝ ${unitVal} €.`
    };
  } else {
    // q2: Εύρεση ολόκληρου του ποσού
    return {
      type: 'input',
      correct: totalVal,
      unit: '€',
      prompt: `Αν τα ${num}/${den} ενός ποδηλάτου κοστίζουν ${knownVal} €, ποια είναι η συνολική τιμή ολόκληρου του ποδηλάτου;`,
      explanation: `Πρώτα βρίσκουμε το 1/${den}: ${knownVal} ： ${num} ＝ ${unitVal} €. Στη συνέχεια πολλαπλασιάζουμε με τον παρονομαστή για να βρούμε το όλο (${den}/${den}): ${unitVal} · ${den} ＝ ${totalVal} €.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Μεταβάσεις Μήκους & Βάρους (MCQ)
function makeQuantityProblem(isWeight = false) {
  if (!isWeight) {
    // q3: Μήκος διαδρομής σε km
    const den = [5, 6, 8, 10][getRandomInt(0, 3)];
    const num = getRandomInt(2, den - 1);
    const unitKm = getRandomInt(8, 25);
    const knownKm = num * unitKm;
    const totalKm = den * unitKm;

    const distractors = [
      totalKm + unitKm,
      Math.max(10, totalKm - unitKm),
      totalKm + 2 * unitKm
    ].filter((v) => v !== totalKm);

    const options = shuffleArray([totalKm, ...distractors.slice(0, 3)]).map((v) => `${v} km`);

    return {
      type: 'mcq',
      correct: `${totalKm} km`,
      options,
      prompt: `Ένας ποδηλάτης διένυσε τα ${num}/${den} μιας διαδρομής, δηλαδή ${knownKm} km. Πόσα χιλιόμετρα είναι ολόκληρη η διαδρομή;`,
      explanation: `Το 1/${den} της διαδρομής είναι: ${knownKm} ： ${num} ＝ ${unitKm} km. Ολόκληρη η διαδρομή (${den}/${den}) είναι: ${unitKm} · ${den} ＝ ${totalKm} km.`
    };
  } else {
    // q4: Βάρος φορτίου σε kg
    const den = [4, 6, 7, 9][getRandomInt(0, 3)];
    const num = getRandomInt(2, den - 1);
    const unitKg = getRandomInt(15, 40);
    const knownKg = num * unitKg;
    const totalKg = den * unitKg;

    const distractors = [
      totalKg + unitKg,
      Math.max(20, totalKg - unitKg),
      totalKg + unitKg * 2
    ].filter((v) => v !== totalKg);

    const options = shuffleArray([totalKg, ...distractors.slice(0, 3)]).map((v) => `${v} kg`);

    return {
      type: 'mcq',
      correct: `${totalKg} kg`,
      options,
      prompt: `Ένα φορτηγό ξεφόρτωσε τα ${num}/${den} ενός φορτίου σιταριού, δηλαδή ${knownKg} kg. Πόσα κιλά ζύγιζε αρχικά ολόκληρο το φορτίο;`,
      explanation: `Το 1/${den} του φορτίου ζυγίζει: ${knownKg} ： ${num} ＝ ${unitKg} kg. Ολόκληρο το φορτίο (${den}/${den}) ζυγίζει: ${unitKg} · ${den} ＝ ${totalKg} kg.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Από το Μέρος στο... Άλλο Μέρος (Input & MCQ)
function makePartToPartQuestion(isMCQ = false) {
  const den = [6, 7, 8, 9, 10, 12][getRandomInt(0, 5)];
  const num1 = getRandomInt(2, 4);
  let num2 = getRandomInt(3, den - 1);
  if (num2 === num1) num2 = num1 + 1;

  const unitVal = getRandomInt(12, 30);
  const knownVal = num1 * unitVal;
  const targetVal = num2 * unitVal;

  if (!isMCQ) {
    // q5: Input
    return {
      type: 'input',
      correct: targetVal,
      unit: 'σελιδες',
      prompt: `Αν τα ${num1}/${den} ενός παραμυθιού είναι ${knownVal} σελίδες, πόσες σελίδες είναι τα ${num2}/${den} του ίδιου παραμυθιού;`,
      explanation: `Βρίσκουμε πρώτα την κλασματική μονάδα 1/${den}: ${knownVal} ： ${num1} ＝ ${unitVal} σελίδες. Στη συνέχεια υπολογίζουμε τα ${num2}/${den}: ${unitVal} · ${num2} ＝ ${targetVal} σελίδες.`
    };
  } else {
    // q6: MCQ
    const distractors = [
      targetVal + unitVal,
      Math.max(10, targetVal - unitVal),
      targetVal + 2 * unitVal
    ].filter((v) => v !== targetVal);

    const options = shuffleArray([targetVal, ...distractors.slice(0, 3)]).map((v) => `${v} €`);

    return {
      type: 'mcq',
      correct: `${targetVal} €`,
      options,
      prompt: `Τα ${num1}/${den} ενός χρηματικού επάθλου ισούνται με ${knownVal} €. Πόσα ευρώ αντιστοιχούν στα ${num2}/${den} του ίδιου επάθλου;`,
      explanation: `Το 1/${den} του επάθλου είναι: ${knownVal} ： ${num1} ＝ ${unitVal} €. Επομένως τα ${num2}/${den} ισούνται με: ${unitVal} · ${num2} ＝ ${targetVal} €.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα με Υπόλοιπο (MCQ & Input)
function makeComplexWordProblem(isInput = false) {
  if (!isInput) {
    // q7: Υπολογισμός υπολοίπου από γνωστό μέρος (MCQ)
    const den = [5, 6, 8, 10][getRandomInt(0, 3)];
    const num = getRandomInt(2, den - 2);
    const remParts = den - num;
    const unitEuro = getRandomInt(15, 45);
    const spentVal = num * unitEuro;
    const remainingVal = remParts * unitEuro;

    const distractors = [
      remainingVal + unitEuro,
      Math.max(20, remainingVal - unitEuro),
      spentVal
    ].filter((v) => v !== remainingVal);

    const options = shuffleArray([remainingVal, ...distractors.slice(0, 3)]).map((v) => `${v} €`);

    return {
      type: 'mcq',
      correct: `${remainingVal} €`,
      options,
      prompt: `Η Μαρία ξόδεψε τα ${num}/${den} των χρημάτων της για να αγοράσει μια τσάντα που κόστιζε ${spentVal} €. Πόσα χρήματα της περίσσεψαν;`,
      explanation: `Το 1/${den} των χρημάτων της είναι: ${spentVal} ： ${num} ＝ ${unitEuro} €. Τα χρήματα που της περίσσεψαν αντιστοιχούν στα υπόλοιπα ${remParts}/${den}: ${unitEuro} · ${remParts} ＝ ${remainingVal} €.`
    };
  } else {
    // q8: Σύνθετη δεξαμενή νερού (Input)
    const den = [6, 7, 8, 9, 12][getRandomInt(0, 4)];
    const filledParts = getRandomInt(3, den - 2);
    const missingParts = den - filledParts;
    const unitLiters = getRandomInt(20, 60);
    const currentLiters = filledParts * unitLiters;
    const litersNeeded = missingParts * unitLiters;

    return {
      type: 'input',
      correct: litersNeeded,
      unit: 'L',
      prompt: `Μια δεξαμενή περιέχει ${currentLiters} L νερού, τα οποία αντιστοιχούν ακριβώς στα ${filledParts}/${den} της συνολικής χωρητικότητάς της. Πόσα επιπλέον λίτρα (L) νερού απαιτούνται για να γεμίσει πλήρως η δεξαμενή;`,
      explanation: `Το 1/${den} της δεξαμενής χωράει: ${currentLiters} ： ${filledParts} ＝ ${unitLiters} L. Για να γεμίσει απομένουν ${den} － ${filledParts} ＝ ${missingParts}/${den}. Επομένως χρειάζονται ακόμη: ${unitLiters} · ${missingParts} ＝ ${litersNeeded} L.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeUnitAndTotalQuestion(false),
    q2: makeUnitAndTotalQuestion(true),
    q3: makeQuantityProblem(false),
    q4: makeQuantityProblem(true),
    q5: makePartToPartQuestion(false),
    q6: makePartToPartQuestion(true),
    q7: makeComplexWordProblem(false),
    q8: makeComplexWordProblem(true)
  };
}

export default function AnagogiAskPage() {
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
      title="Ασκήσεις: Αναγωγή στην Κλασματική Μονάδα - Έ Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Έ Δημοτικού στην αναγωγή στην κλασματική μονάδα: εύρεση συνολικού ποσού, μεταβάσεις μερών και προβλήματα υπολοίπου."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/04-anagogi"
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
              📝 Ασκήσεις: Αναγωγή στην Κλασματική Μονάδα
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
          {renderInput('q1', questions.q1, 1, 'ΥΠΟΛΟΓΙΣΜΟΣ ΚΛΑΣΜΑΤΙΚΗΣ ΜΟΝΑΔΑΣ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΕΥΡΕΣΗ ΣΥΝΟΛΙΚΗΣ ΤΙΜΗΣ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΣΥΝΟΛΙΚΟ ΜΗΚΟΣ ΔΙΑΔΡΟΜΗΣ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΣΥΝΟΛΙΚΟ ΒΑΡΟΣ ΦΟΡΤΙΟΥ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΑΠΟ ΤΟ ΜΕΡΟΣ ΣΤΟ ΑΛΛΟ ΜΕΡΟΣ ( ΣΕΛΙΔΕΣ )', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΑΠΟ ΤΟ ΜΕΡΟΣ ΣΤΟ ΑΛΛΟ ΜΕΡΟΣ ( ΧΡΗΜΑΤΑ )', 'bg-teal-600')}

          {renderMCQ('q7', questions.q7, 7, 'ΠΡΟΒΛΗΜΑ ΥΠΟΛΟΙΠΟΥ ΧΡΗΜΑΤΩΝ', 'bg-purple-600')}
          {renderInput('q8', questions.q8, 8, 'ΠΛΗΡΩΣΗ ΔΕΞΑΜΕΝΗΣ ΝΕΡΟΥ', 'bg-purple-600')}

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

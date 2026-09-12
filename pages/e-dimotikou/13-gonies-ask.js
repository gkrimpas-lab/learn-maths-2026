// pages/e-dimotikou/13-gonies-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Συμπληρωματικές & Παραπληρωματικές Γωνίες (Input)
function makeComplementarySupplementaryQuestion(isSupplementary = false) {
  if (!isSupplementary) {
    // q1: Συμπληρωματική γωνία (άθροισμα = 90°)
    const deg = [25, 32, 45, 54, 63, 68, 72, 77][getRandomInt(0, 7)];
    const comp = 90 - deg;

    return {
      type: 'input',
      correct: comp,
      unit: 'μοίρες ( ° )',
      prompt: `Μια γωνία έχει μέτρο ${deg}°. Πόσες μοίρες ( ° ) είναι η ΣΥΜΠΛΗΡΩΜΑΤΙΚΗ της γωνία;`,
      explanation: `Δύο γωνίες λέγονται συμπληρωματικές όταν το άθροισμά τους είναι ακριβώς 90° (σχηματίζουν ορθή γωνία). Επομένως: 90° － ${deg}° ＝ ${comp}°.`
    };
  } else {
    // q2: Παραπληρωματική γωνία (άθροισμα = 180°)
    const deg = [45, 60, 75, 110, 125, 135, 142, 155][getRandomInt(0, 7)];
    const supp = 180 - deg;

    return {
      type: 'input',
      correct: supp,
      unit: 'μοίρες ( ° )',
      prompt: `Μια γωνία έχει μέτρο ${deg}°. Πόσες μοίρες ( ° ) είναι η ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ της γωνία;`,
      explanation: `Δύο γωνίες λέγονται παραπληρωματικές όταν το άθροισμά τους είναι ακριβώς 180° (σχηματίζουν ευθεία γωνία). Επομένως: 180° － ${deg}° ＝ ${supp}°.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Αναγνώριση & Κατάταξη Είδους Γωνίας (MCQ)
function makeAngleTypeClassificationQuestion(isIdentifyFromDegrees = false) {
  if (!isIdentifyFromDegrees) {
    // q3: Δίνεται μέτρο σε μοίρες και ζητείται το είδος
    const cases = [
      { deg: 38, type: 'Οξεία γωνία', reason: 'είναι μικρότερη από 90° ( 0° ＜ 38° ＜ 90° )' },
      { deg: 90, type: 'Ορθή γωνία', reason: 'είναι ακριβώς ίση με 90°' },
      { deg: 124, type: 'Αμβλεία γωνία', reason: 'είναι μεγαλύτερη από 90° και μικρότερη από 180° ( 90° ＜ 124° ＜ 180° )' },
      { deg: 180, type: 'Ευθεία γωνία', reason: 'είναι ακριβώς ίση με 180°' },
      { deg: 67, type: 'Οξεία γωνία', reason: 'είναι μικρότερη από 90° ( 0° ＜ 67° ＜ 90° )' },
      { deg: 145, type: 'Αμβλεία γωνία', reason: 'είναι μεγαλύτερη από 90° και μικρότερη από 180° ( 90° ＜ 145° ＜ 180° )' }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const allTypes = ['Οξεία γωνία', 'Ορθή γωνία', 'Αμβλεία γωνία', 'Ευθεία γωνία'];

    return {
      type: 'mcq',
      correct: c.type,
      options: allTypes,
      prompt: `Πώς χαρακτηρίζεται μια γωνία που έχει μέτρο ακριβώς ${c.deg}°;`,
      explanation: `Η γωνία ${c.deg}° είναι ${c.type}, επειδή ${c.reason}.`
    };
  } else {
    // q4: Ποιο μέτρο αντιστοιχεί σε συγκεκριμένο είδος γωνίας
    const questionTypes = [
      {
        typeStr: 'ΑΜΒΛΕΙΑ',
        correctDeg: '135°',
        distractors: ['45°', '90°', '180°'],
        expl: 'Η αμβλεία γωνία βρίσκεται ανάμεσα στις 90° και 180°. Η μόνη τέτοια τιμή είναι οι 135°.'
      },
      {
        typeStr: 'ΟΞΕΙΑ',
        correctDeg: '64°',
        distractors: ['90°', '115°', '180°'],
        expl: 'Η οξεία γωνία είναι μικρότερη από 90°. Η μόνη τέτοια τιμή είναι οι 64°.'
      }
    ];
    const chosen = questionTypes[getRandomInt(0, questionTypes.length - 1)];
    const options = shuffleArray([chosen.correctDeg, ...chosen.distractors]);

    return {
      type: 'mcq',
      correct: chosen.correctDeg,
      options,
      prompt: `Ποιο από τα παρακάτω μέτρα γωνιών αντιστοιχεί σε ${chosen.typeStr} γωνία;`,
      explanation: chosen.expl
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Διχοτόμος & Ισομοιρασιά Μοιρών (Input & MCQ)
function makeBisectorQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q5: Υπολογισμός μισής γωνίας από διχοτόμο (Input)
    const totalAngle = [64, 78, 86, 110, 128, 146][getRandomInt(0, 5)];
    const halfAngle = totalAngle / 2;

    return {
      type: 'input',
      correct: halfAngle,
      unit: 'μοίρες ( ° )',
      prompt: `Η ημιευθεία Οδ είναι η διχοτόμος μιας γωνίας ${totalAngle}° (τη χωρίζει δηλαδή σε δύο απολύτως ίσες γωνίες). Πόσες μοίρες ( ° ) είναι καθεμία από τις δύο νέες γωνίες;`,
      explanation: `Η διχοτόμος χωρίζει τη γωνία σε δύο ίσα μέρη: ${totalAngle}° ： 2 ＝ ${halfAngle}°.`
    };
  } else {
    // q6: Σύνθετη γωνία από 3 ίσα μέρη (MCQ)
    const singleAngle = [15, 20, 25, 30][getRandomInt(0, 3)];
    const totalAngle = singleAngle * 3;
    const distractors = [totalAngle + 10, totalAngle - 15, totalAngle * 2].filter((v) => v !== totalAngle && v <= 180);

    const options = shuffleArray([`${totalAngle}°`, ...distractors.map((d) => `${d}°`)]);

    return {
      type: 'mcq',
      correct: `${totalAngle}°`,
      options,
      prompt: `Μια μεγάλη γωνία χωρίζεται με δύο ημιευθείες σε τρεις ίσες διαδοχικές γωνίες των ${singleAngle}° η καθεμία. Πόσο είναι το συνολικό μέτρο της μεγάλης γωνίας;`,
      explanation: `Πολλαπλασιάζουμε το μέτρο κάθε μέρους επί 3: ${singleAngle}° · 3 ＝ ${totalAngle}°.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Γωνιών & Ωρολογίου (Input & MCQ)
function makeComplexAngleProblem(isClock = false) {
  if (!isClock) {
    // q7: Άθροισμα γωνιών τριγώνου = 180° (Input)
    const g1 = [40, 50, 60, 65, 70][getRandomInt(0, 4)];
    const g2 = [45, 55, 60, 70, 75][getRandomInt(0, 4)];
    const sumKnown = g1 + g2;
    const g3 = 180 - sumKnown;

    return {
      type: 'input',
      correct: g3,
      unit: 'μοίρες ( ° )',
      prompt: `Σε ένα τρίγωνο, το άθροισμα και των τριών γωνιών του ισούται πάντα με 180°. Αν οι δύο γωνίες του είναι ${g1}° και ${g2}°, πόσες μοίρες ( ° ) είναι η 3η γωνία του τριγώνου;`,
      explanation: `Το άθροισμα των δύο γνωστών γωνιών είναι: ${g1}° ＋ ${g2}° ＝ ${sumKnown}°. Η τρίτη γωνία ισούται με: 180° － ${sumKnown}° ＝ ${g3}°.`
    };
  } else {
    // q8: Γωνία δεικτών ρολογιού (MCQ)
    // Κάθε ώρα στο ρολόι αντιστοιχεί σε 360° : 12 = 30°
    const clockCases = [
      { time: '3:00', deg: 90, type: 'Ορθή ( 90° )' },
      { time: '2:00', deg: 60, type: 'Οξεία ( 60° )' },
      { time: '4:00', deg: 120, type: 'Αμβλεία ( 120° )' },
      { time: '6:00', deg: 180, type: 'Ευθεία ( 180° )' }
    ];
    const c = clockCases[getRandomInt(0, clockCases.length - 1)];
    const distractors = ['30°', '45°', '90°', '120°', '180°'].filter((d) => d !== `${c.deg}°`);

    const options = shuffleArray([`${c.deg}°`, ...distractors.slice(0, 3)]);

    return {
      type: 'mcq',
      correct: `${c.deg}°`,
      options,
      prompt: `Όταν ένα ρολόι δείχνει ακριβώς ${c.time}, τι μέτρο (σε μοίρες) σχηματίζουν μεταξύ τους ο ωροδείκτης και ο λεπτοδείκτης;`,
      explanation: `Ο κύκλος του ρολογιού είναι 360°. Κάθε ώρα αντιστοιχεί σε 360° ： 12 ＝ 30°. Στις ${c.time}, οι δείκτες απέχουν τόσες θέσεις ώστε σχηματίζουν γωνία ${c.deg}°.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeComplementarySupplementaryQuestion(false),
    q2: makeComplementarySupplementaryQuestion(true),
    q3: makeAngleTypeClassificationQuestion(false),
    q4: makeAngleTypeClassificationQuestion(true),
    q5: makeBisectorQuestion(false),
    q6: makeBisectorQuestion(true),
    q7: makeComplexAngleProblem(false),
    q8: makeComplexAngleProblem(true)
  };
}

export default function GoniesAskPage() {
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
    if (parseInt(answers.q7, 10) === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

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
      title="Ασκήσεις: Τα Είδη των Γωνιών - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στις γωνίες: συμπληρωματικές, παραπληρωματικές, κατάταξη ειδών, διχοτόμοι και γωνίες τριγώνων."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/13-gonies"
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
              📝 Ασκήσεις: Τα Είδη των Γωνιών
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
          {renderInput('q1', questions.q1, 1, 'ΣΥΜΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΚΑΤΑΤΑΞΗ ΕΙΔΟΥΣ ΓΩΝΙΑΣ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΕΝΤΟΠΙΣΜΟΣ ΜΕΤΡΟΥ ΓΩΝΙΑΣ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΔΙΧΟΤΟΜΟΣ ΓΩΝΙΑΣ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΣΥΝΘΕΣΗ ΓΩΝΙΩΝ ΑΠΟ ΙΣΑ ΜΕΡΗ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΤΡΙΤΗ ΓΩΝΙΑ ΤΡΙΓΩΝΟΥ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΓΩΝΙΑ ΔΕΙΚΤΩΝ ΩΡΟΛΟΓΙΟΥ', 'bg-purple-600')}

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

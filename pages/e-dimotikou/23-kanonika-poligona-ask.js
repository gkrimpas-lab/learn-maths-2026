// pages/e-dimotikou/23-kanonika-poligona-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Κεντρική Γωνία & Εύρεση Πλευρών (Input)
function makeCentralAngleQuestion(isReverse = false) {
  if (!isReverse) {
    // q1: Υπολογισμός κεντρικής γωνίας (360° : ν)
    const cases = [
      { name: 'κανονικού εξαγώνου (6 πλευρές)', sides: 6, angle: 60 },
      { name: 'κανονικού οκταγώνου (8 πλευρές)', sides: 8, angle: 45 },
      { name: 'κανονικού πενταγώνου (5 πλευρές)', sides: 5, angle: 72 },
      { name: 'κανονικού δεκαγώνου (10 πλευρές)', sides: 10, angle: 36 },
      { name: 'τετραγώνου (4 πλευρές)', sides: 4, angle: 90 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    return {
      type: 'input',
      correct: c.angle,
      unit: 'μοίρες ( ° )',
      prompt: `Πόσες μοίρες ( ° ) είναι η ΚΕΝΤΡΙΚΗ γωνία ενός ${c.name};`,
      explanation: `Η κεντρική γωνία κάθε κανονικού πολυγώνου με ν πλευρές προκύπτει διαιρώντας τον πλήρη κύκλο των 360° με το ν: 360° ： ${c.sides} ＝ ${c.angle}°.`
    };
  } else {
    // q2: Ανάστροφη εύρεση αριθμού πλευρών από γνωστή κεντρική γωνία
    const cases = [
      { angle: 60, sides: 6, name: 'εξάγωνο' },
      { angle: 45, sides: 8, name: 'οκτάγωνο' },
      { angle: 72, sides: 5, name: 'πεντάγωνο' },
      { angle: 36, sides: 10, name: 'δεκάγωνο' },
      { angle: 30, sides: 12, name: 'δωδεκάγωνο' }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    return {
      type: 'input',
      correct: c.sides,
      unit: 'πλευρές',
      prompt: `Η κεντρική γωνία ενός κανονικού πολυγώνου είναι ${c.angle}°. Πόσες πλευρές έχει το πολύγωνο αυτό;`,
      explanation: `Διαιρούμε τις 360° με το μέτρο της κεντρικής γωνίας: 360° ： ${c.angle}° ＝ ${c.sides} πλευρές (κανονικό ${c.name}).`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Εσωτερικές Γωνίες & Κριτήρια Κανονικότητας (MCQ)
function makeInteriorAnglesQuestion(isCriteria = false) {
  if (!isCriteria) {
    // q3: Εσωτερική γωνία βασικών κανονικών πολυγώνων
    const cases = [
      {
        poly: 'κανονικού εξαγώνου',
        correct: '120°',
        distractors: ['60°', '90°', '108°'],
        expl: 'Στο κανονικό εξάγωνο κάθε εσωτερική γωνία είναι ίση με 120°.'
      },
      {
        poly: 'κανονικού πενταγώνου',
        correct: '108°',
        distractors: ['72°', '90°', '120°'],
        expl: 'Στο κανονικό πεντάγωνο κάθε εσωτερική γωνία είναι ίση με 108°.'
      },
      {
        poly: 'ισόπλευρου τριγώνου',
        correct: '60°',
        distractors: ['45°', '90°', '120°'],
        expl: 'Στο ισόπλευρο τρίγωνο και οι τρεις γωνίες είναι ίσες με 180° ： 3 ＝ 60°.'
      },
      {
        poly: 'τετραγώνου',
        correct: '90°',
        distractors: ['60°', '120°', '180°'],
        expl: 'Στο τετράγωνο και οι τέσσερις γωνίες είναι ορθές (90°).'
      }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const options = shuffleArray([c.correct, ...c.distractors]);

    return {
      type: 'mcq',
      correct: c.correct,
      options,
      prompt: `Πόσες μοίρες είναι καθεμία από τις εσωτερικές γωνίες ενός ${c.poly};`,
      explanation: c.expl
    };
  } else {
    // q4: Γιατί ο ρόμβος δεν είναι πάντα κανονικό πολύγωνο
    const options = [
      'Επειδή, παρότι έχει όλες τις πλευρές ίσες, δεν έχει όλες τις γωνίες του ίσες',
      'Επειδή έχει 4 πλευρές αντί για 6',
      'Επειδή δεν έχει διαγωνίους',
      'Επειδή οι πλευρές του δεν είναι ευθύγραμμα τμήματα'
    ];

    return {
      type: 'mcq',
      correct: 'Επειδή, παρότι έχει όλες τις πλευρές ίσες, δεν έχει όλες τις γωνίες του ίσες',
      options,
      prompt: `Ένας ρόμβος έχει και τις τέσσερις πλευρές του ίσες. Γιατί ΔΕΝ είναι υποχρεωτικά κανονικό πολύγωνο;`,
      explanation: `Για να είναι ένα πολύγωνο κανονικό πρέπει να είναι ΚΑΙ ισόπλευρο ΚΑΙ ισογώνιο. Ο ρόμβος έχει ίσες πλευρές, αλλά οι απέναντι γωνίες του είναι οξείες και αμβλείες (δεν είναι όλες ίσες με 90° εκτός αν γίνει τετράγωνο).`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Περίμετρος & Ανάστροφοι Υπολογισμοί (Input & MCQ)
function makePerimeterAndSideQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q5: Περίμετρος κανονικού δωδεκαγώνου ή δεκαγώνου (Input)
    const polygonTypes = [
      { name: 'κανονικού δεκαγώνου (10 πλευρές)', sides: 10, side: 6 },
      { name: 'κανονικού εξαγώνου (6 πλευρές)', sides: 6, side: 14 },
      { name: 'κανονικού οκταγώνου (8 πλευρές)', sides: 8, side: 12 },
      { name: 'κανονικού πενταγώνου (5 πλευρές)', sides: 5, side: 18 }
    ];
    const poly = polygonTypes[getRandomInt(0, polygonTypes.length - 1)];
    const perimeter = poly.sides * poly.side;

    return {
      type: 'input',
      correct: perimeter,
      unit: 'cm (περίμετρος)',
      prompt: `Κάθε πλευρά ενός ${poly.name} έχει μήκος ${poly.side} cm. Πόσα cm είναι η περίμετρός του;`,
      explanation: `Σε κάθε κανονικό πολύγωνο με ν πλευρές: Περίμετρος ＝ ν · πλευρά. Άρα: ${poly.sides} · ${poly.side} ＝ ${perimeter} cm.`
    };
  } else {
    // q6: Εύρεση πλευράς από γνωστή περίμετρο (MCQ)
    const cases = [
      { name: 'κανονικού οκταγώνου', sides: 8, side: 9, perimeter: 72 },
      { name: 'κανονικού εξαγώνου', sides: 6, side: 15, perimeter: 90 },
      { name: 'κανονικού πενταγώνου', sides: 5, side: 16, perimeter: 80 },
      { name: 'κανονικού δεκαγώνου', sides: 10, side: 12, perimeter: 120 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const distractors = [c.side + 3, Math.max(2, c.side - 3), c.side * 2];
    const options = shuffleArray([`${c.side} cm`, ...distractors.map((v) => `${v} cm`)]);

    return {
      type: 'mcq',
      correct: `${c.side} cm`,
      options,
      prompt: `Η περίμετρος ενός ${c.name} είναι ${c.perimeter} cm. Πόσα cm είναι το μήκος της κάθε πλευράς του;`,
      explanation: `Διαιρούμε την περίμετρο με το πλήθος των πλευρών: ${c.perimeter} ： ${c.sides} ＝ ${c.side} cm.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Άξονες Συμμετρίας & Προσέγγιση Κύκλου (Input & MCQ)
function makeSymmetryAndCircleConvergenceQuestion(isCircleQuestion = false) {
  if (!isCircleQuestion) {
    // q7: Άξονες συμμετρίας κανονικού πολυγώνου (Input)
    // Σε κάθε κανονικό πολύγωνο: άξονες συμμετρίας = ν
    const sidesList = [6, 8, 10, 12, 16];
    const n = sidesList[getRandomInt(0, sidesList.length - 1)];

    return {
      type: 'input',
      correct: n,
      unit: 'άξονες συμμετρίας',
      prompt: `Πόσους άξονες συμμετρίας έχει συνολικά ένα κανονικό πολύγωνο με ${n} πλευρές;`,
      explanation: `Σε ΚΑΘΕ κανονικό πολύγωνο, το πλήθος των αξόνων συμμετρίας ισούται ακριβώς με τον αριθμό των πλευρών του. Άρα έχει ακριβώς ${n} άξονες συμμετρίας.`
    };
  } else {
    // q8: Γεωμετρική συμπεριφορά όταν ν -> μεγάλο (MCQ)
    const options = [
      'Το πολύγωνο αρχίζει να μοιάζει ολοένα και περισσότερο με κύκλο',
      'Το πολύγωνο μετατρέπεται σε τρίγωνο',
      'Η περίμετρός του μηδενίζεται',
      'Οι γωνίες του γίνονται όλες ίσες με 90°'
    ];

    return {
      type: 'mcq',
      correct: 'Το πολύγωνο αρχίζει να μοιάζει ολοένα και περισσότερο με κύκλο',
      options,
      prompt: `Τι συμβαίνει στο σχήμα ενός κανονικού πολυγώνου καθώς αυξάνουμε διαρκώς τον αριθμό των πλευρών του (π.χ. 20, 50, 100 πλευρές);`,
      explanation: `Καθώς αυξάνεται ο αριθμός των πλευρών σε ένα κανονικό πολύγωνο, οι γωνίες ανοίγουν, οι πλευρές μικραίνουν και το περίγραμμα προσεγγίζει σχεδόν τέλεια έναν κύκλο!`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeCentralAngleQuestion(false),
    q2: makeCentralAngleQuestion(true),
    q3: makeInteriorAnglesQuestion(false),
    q4: makeInteriorAnglesQuestion(true),
    q5: makePerimeterAndSideQuestion(false),
    q6: makePerimeterAndSideQuestion(true),
    q7: makeSymmetryAndCircleConvergenceQuestion(false),
    q8: makeSymmetryAndCircleConvergenceQuestion(true)
  };
}

export default function KanonikaPoligonaAskPage() {
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

  // Αυστηρός έλεγχος εισόδου: μόνο αριθμοί 0-9, το πολύ ένα κόμμα, όριο 10 ψηφία
  const handleStrictNumberInput = (key, rawVal) => {
    if (submitted) return;
    let clean = rawVal.replace('.', ',').replace(/[^0-9,]/g, '');
    const parts = clean.split(',');
    if (parts.length > 2) {
      clean = parts[0] + ',' + parts.slice(1).join('');
    }
    if (clean.length > 10) {
      clean = clean.slice(0, 10);
    }
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const parseUserFloat = (val) => {
    if (!val || val === ',') return NaN;
    return parseFloat(val.replace(',', '.'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    // q1
    if (Math.abs(parseUserFloat(answers.q1) - questions.q1.correct) < 0.01) currentScore += 1;
    // q2
    if (Math.abs(parseUserFloat(answers.q2) - questions.q2.correct) < 0.01) currentScore += 1;
    // q3
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    // q4
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    // q5
    if (Math.abs(parseUserFloat(answers.q5) - questions.q5.correct) < 0.01) currentScore += 1;
    // q6
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    // q7
    if (Math.abs(parseUserFloat(answers.q7) - questions.q7.correct) < 0.01) currentScore += 1;
    // q8
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

  // Render Component για Ερωτήσεις Input (αυστηρός περιορισμός 10 ψηφίων)
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const userVal = parseUserFloat(answers[qKey]);
    const isCorrect = !isNaN(userVal) && Math.abs(userVal - qData.correct) < 0.01;
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
              inputMode="decimal"
              autoComplete="off"
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              value={answers[qKey]}
              onChange={(e) => handleStrictNumberInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 h-12 sm:h-14 p-3 text-center rounded-2xl border-2 border-slate-300 font-mono text-lg sm:text-xl 2xl:text-2xl font-black focus:border-indigo-600 focus:outline-none bg-slate-50/60 focus:bg-white text-slate-900 disabled:opacity-75"
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
                Η σωστή απάντηση είναι: <strong className="font-bold text-rose-950">{qData.correct.toLocaleString('el-GR')} {qData.unit}</strong>. {qData.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Κανονικά Πολύγωνα - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα κανονικά πολύγωνα: κεντρική και εσωτερική γωνία, περίμετρος, άξονες συμμετρίας και σύγκλιση στον κύκλο."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/23-kanonika-poligona"
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
              📝 Ασκήσεις: Κανονικά Πολύγωνα
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
          {renderInput('q1', questions.q1, 1, 'ΚΕΝΤΡΙΚΗ ΓΩΝΙΑ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΕΥΡΕΣΗ ΠΛΕΥΡΩΝ ΑΠΟ ΚΕΝΤΡΙΚΗ ΓΩΝΙΑ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΕΣΩΤΕΡΙΚΗ ΓΩΝΙΑ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΚΡΙΤΗΡΙΑ ΚΑΝΟΝΙΚΟΤΗΤΑΣ ΠΟΛΥΓΩΝΟΥ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΠΕΡΙΜΕΤΡΟΣ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΕΥΡΕΣΗ ΠΛΕΥΡΑΣ ΑΠΟ ΠΕΡΙΜΕΤΡΟ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΠΡΟΣΕΓΓΙΣΗ ΤΟΥ ΚΥΚΛΟΥ', 'bg-purple-600')}

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

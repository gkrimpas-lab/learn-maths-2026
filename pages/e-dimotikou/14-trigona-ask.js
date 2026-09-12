// pages/e-dimotikou/14-trigona-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εύρεση 3ης Άγνωστης Γωνίας (Input)
function makeMissingAngleQuestion(isRightTriangle = false) {
  if (!isRightTriangle) {
    // q1: Γενικό τρίγωνο με δύο γνωστές γωνίες
    const a = [35, 42, 50, 55, 62, 68, 74][getRandomInt(0, 6)];
    const b = [40, 48, 52, 58, 64, 70][getRandomInt(0, 5)];
    const knownSum = a + b;
    const c = 180 - knownSum;

    return {
      type: 'input',
      correct: c,
      unit: 'μοίρες ( ° )',
      prompt: `Σε ένα τρίγωνο ΑΒΓ, η γωνία Α είναι ${a}° και η γωνία Β είναι ${b}°. Πόσες μοίρες ( ° ) είναι η γωνία Γ;`,
      explanation: `Το άθροισμα των γωνιών κάθε τριγώνου είναι 180°. Αθροίζουμε τις γνωστές γωνίες: ${a}° ＋ ${b}° ＝ ${knownSum}°. Η τρίτη γωνία ισούται με: 180° － ${knownSum}° ＝ ${c}°.`
    };
  } else {
    // q2: Ορθογώνιο τρίγωνο (μία γωνία είναι 90°, ζητείται η άλλη οξεία)
    const acute1 = [24, 32, 38, 46, 54, 62, 71][getRandomInt(0, 6)];
    const acute2 = 90 - acute1;

    return {
      type: 'input',
      correct: acute2,
      unit: 'μοίρες ( ° )',
      prompt: `Σε ένα ορθογώνιο τρίγωνο, η μία οξεία γωνία του έχει μέτρο ${acute1}°. Πόσες μοίρες ( ° ) είναι η άλλη οξεία γωνία του;`,
      explanation: `Σε κάθε ορθογώνιο τρίγωνο, οι δύο οξείες γωνίες είναι συμπληρωματικές (έχουν άθροισμα 90°). Επομένως: 90° － ${acute1}° ＝ ${acute2}°.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Κατάταξη Τριγώνου ως προς τις Γωνίες (MCQ)
function makeTriangleClassificationQuestion(isIdentifyFromDegrees = false) {
  if (!isIdentifyFromDegrees) {
    // q3: Δίνονται δύο γωνίες, υπολογίζεται η τρίτη και ζητείται το είδος του τριγώνου
    const cases = [
      { a: 30, b: 60, c: 90, type: 'Ορθογώνιο τρίγωνο', reason: 'έχει μία ορθή γωνία ( 90° )' },
      { a: 25, b: 35, c: 120, type: 'Αμβλυγώνιο τρίγωνο', reason: 'έχει μία αμβλεία γωνία 120° ( ＞ 90° )' },
      { a: 55, b: 65, c: 60, type: 'Οξυγώνιο τρίγωνο', reason: 'όλες οι γωνίες του είναι οξείες ( ＜ 90° )' },
      { a: 45, b: 45, c: 90, type: 'Ορθογώνιο τρίγωνο', reason: 'έχει μία ορθή γωνία ( 90° )' },
      { a: 20, b: 40, c: 120, type: 'Αμβλυγώνιο τρίγωνο', reason: 'έχει μία αμβλεία γωνία 120° ( ＞ 90° )' },
      { a: 70, b: 50, c: 60, type: 'Οξυγώνιο τρίγωνο', reason: 'και οι τρεις γωνίες του είναι μικρότερες από 90°' }
    ];
    const item = cases[getRandomInt(0, cases.length - 1)];
    const options = ['Οξυγώνιο τρίγωνο', 'Ορθογώνιο τρίγωνο', 'Αμβλυγώνιο τρίγωνο', 'Ισόπλευρο τρίγωνο'];

    return {
      type: 'mcq',
      correct: item.type,
      options,
      prompt: `Ένα τρίγωνο έχει δύο γωνίες με μέτρα ${item.a}° και ${item.b}°. Πώς κατατάσσεται το τρίγωνο αυτό ως προς τις γωνίες του;`,
      explanation: `Η τρίτη γωνία είναι 180° － (${item.a}° ＋ ${item.b}°) ＝ ${item.c}°. Επειδή το τρίγωνο ${item.reason}, είναι ${item.type}.`
    };
  } else {
    // q4: Ποια τριάδα γωνιών μπορεί να ανήκει σε οξυγώνιο τρίγωνο
    const validOxy = ['50°, 60°, 70°', '45°, 65°, 70°', '55°, 55°, 70°'][getRandomInt(0, 2)];
    const distractors = [
      '30°, 60°, 90°',   // ορθογώνιο
      '20°, 40°, 120°',  // αμβλυγώνιο
      '40°, 50°, 100°'   // άθροισμα 190 (άκυρο)
    ];
    const options = shuffleArray([validOxy, ...distractors]);

    return {
      type: 'mcq',
      correct: validOxy,
      options,
      prompt: `Ποια από τις παρακάτω τριάδες γωνιών αντιστοιχεί σε ΟΞΥΓΩΝΙΟ τρίγωνο;`,
      explanation: `Στο οξυγώνιο τρίγωνο, το άθροισμα των γωνιών πρέπει να είναι ακριβώς 180° ΚΑΙ καμία γωνία να μην είναι ίση ή μεγαλύτερη από 90°. Η μόνη σωστή τριάδα είναι: ${validOxy}.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Ισοσκελή & Ισόπλευρα Τρίγωνα (Input & MCQ)
function makeIsoscelesEquilateralQuestion(isEquilateral = false) {
  if (!isEquilateral) {
    // q5: Ισοσκελές τρίγωνο (δίνεται η γωνία κορυφής, ζητείται η γωνία βάσης)
    const vertexAngle = [30, 40, 50, 70, 80, 100][getRandomInt(0, 5)];
    const baseAngle = (180 - vertexAngle) / 2;

    return {
      type: 'input',
      correct: baseAngle,
      unit: 'μοίρες ( ° )',
      prompt: `Σε ένα ισοσκελές τρίγωνο, η γωνία της κορυφής είναι ${vertexAngle}°. Πόσες μοίρες ( ° ) είναι καθεμία από τις δύο ίσες γωνίες της βάσης του;`,
      explanation: `Στο ισοσκελές τρίγωνο, οι γωνίες της βάσης είναι απολύτως ίσες. Αφαιρούμε τη γωνία κορυφής από το 180°: 180° － ${vertexAngle}° ＝ ${180 - vertexAngle}°. Διαιρούμε διά 2: ${180 - vertexAngle}° ： 2 ＝ ${baseAngle}°.`
    };
  } else {
    // q6: Ισόπλευρο τρίγωνο (MCQ)
    const options = shuffleArray(['45°', '60°', '90°', '120°']);

    return {
      type: 'mcq',
      correct: '60°',
      options,
      prompt: `Πόσες μοίρες είναι κάθε εσωτερική γωνία ενός ΙΣΟΠΛΕΥΡΟΥ τριγώνου;`,
      explanation: `Στο ισόπλευρο τρίγωνο και οι τρεις πλευρές είναι ίσες, άρα και οι τρεις γωνίες είναι ίσες μεταξύ τους: 180° ： 3 ＝ 60°.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Γωνιών & Απέναντι Πλευρών (Input & MCQ)
function makeComplexTriangleQuestion(isSideRelation = false) {
  if (!isSideRelation) {
    // q7: Παραπληρωματική εξωτερική γωνία και εύρεση εσωτερικής (Input)
    const extAngle = [110, 120, 130, 140, 150][getRandomInt(0, 4)];
    const intAngleA = 180 - extAngle;
    const intAngleB = [35, 45, 55, 65][getRandomInt(0, 3)];
    const intAngleC = 180 - (intAngleA + intAngleB);

    return {
      type: 'input',
      correct: intAngleC,
      unit: 'μοίρες ( ° )',
      prompt: `Σε ένα τρίγωνο ΑΒΓ, η εξωτερική γωνία της κορυφής Α είναι ${extAngle}°, άρα η εσωτερική γωνία Α είναι παραπληρωματική της. Αν η γωνία Β είναι ${intAngleB}°, πόσες μοίρες ( ° ) είναι η γωνία Γ;`,
      explanation: `Η εσωτερική γωνία Α ισούται με 180° － ${extAngle}° ＝ ${intAngleA}°. Το άθροισμα των γωνιών Α και Β είναι ${intAngleA}° ＋ ${intAngleB}° ＝ ${intAngleA + intAngleB}°. Άρα η γωνία Γ είναι: 180° － ${intAngleA + intAngleB}° ＝ ${intAngleC}°.`
    };
  } else {
    // q8: Συσχέτιση απέναντι πλευράς και μεγαλύτερης γωνίας (MCQ)
    const options = [
      'Η υποτείνουσα (απέναντι από την ορθή γωνία των 90°)',
      'Η μικρότερη κάθετη πλευρά',
      'Οποιαδήποτε από τις δύο κάθετες πλευρές',
      'Όλες οι πλευρές είναι πάντα ίσες'
    ];

    return {
      type: 'mcq',
      correct: 'Η υποτείνουσα (απέναντι από την ορθή γωνία των 90°)',
      options,
      prompt: `Σε ένα ορθογώνιο τρίγωνο, ποια πλευρά είναι ΠΑΝΤΑ η μεγαλύτερη σε μήκος;`,
      explanation: `Σε κάθε τρίγωνο, απέναντι από τη μεγαλύτερη γωνία βρίσκεται πάντοτε η μεγαλύτερη πλευρά. Στο ορθογώνιο τρίγωνο, η μεγαλύτερη γωνία είναι η ορθή (90°), άρα η μεγαλύτερη πλευρά είναι η υποτείνουσα.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeMissingAngleQuestion(false),
    q2: makeMissingAngleQuestion(true),
    q3: makeTriangleClassificationQuestion(false),
    q4: makeTriangleClassificationQuestion(true),
    q5: makeIsoscelesEquilateralQuestion(false),
    q6: makeIsoscelesEquilateralQuestion(true),
    q7: makeComplexTriangleQuestion(false),
    q8: makeComplexTriangleQuestion(true)
  };
}

export default function TrigonaAskPage() {
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
      title="Ασκήσεις: Τρίγωνα ως προς τις Γωνίες - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα τρίγωνα: εύρεση άγνωστης γωνίας, κατάταξη τριγώνων, ισοσκελή, ισόπλευρα και σχέσεις πλευρών-γωνιών."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/14-trigona"
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
              📝 Ασκήσεις: Τρίγωνα ως προς τις Γωνίες
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
          {renderInput('q1', questions.q1, 1, 'ΤΡΙΤΗ ΓΩΝΙΑ ΤΡΙΓΩΝΟΥ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΟΞΕΙΑ ΓΩΝΙΑ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΚΑΤΑΤΑΞΗ ΤΡΙΓΩΝΟΥ ΩΣ ΠΡΟΣ ΤΙΣ ΓΩΝΙΕΣ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΕΝΤΟΠΙΣΜΟΣ ΟΞΥΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΓΩΝΙΑ ΒΑΣΗΣ ΙΣΟΣΚΕΛΟΥΣ ΤΡΙΓΩΝΟΥ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΓΩΝΙΕΣ ΙΣΟΠΛΕΥΡΟΥ ΤΡΙΓΩΝΟΥ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΕΞΩΤΕΡΙΚΗ ΚΑΙ ΕΣΩΤΕΡΙΚΗ ΓΩΝΙΑ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΥΠΟΤΕΙΝΟΥΣΑ & ΜΕΓΙΣΤΗ ΠΛΕΥΡΑ', 'bg-purple-600')}

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

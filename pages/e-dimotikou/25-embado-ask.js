// pages/e-dimotikou/25-embado-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εμβαδόν Ορθογωνίου & Ανάστροφος Υπολογισμός (Input)
function makeRectangleAreaQuestion(isFindDimension = false) {
  if (!isFindDimension) {
    // q1: Ε = Μήκος · Πλάτος
    const length = [8, 12, 15, 16, 20][getRandomInt(0, 4)];
    const width = [5, 6, 7, 9, 10][getRandomInt(0, 4)];
    const area = length * width;

    return {
      type: 'input',
      correct: area,
      unit: 'cm² (εμβαδόν)',
      prompt: `Ένα ορθογώνιο παραλληλόγραμμο έχει μήκος ${length} cm και πλάτος ${width} cm. Πόσα cm² είναι το εμβαδόν του;`,
      explanation: `Ο τύπος του εμβαδού ορθογωνίου είναι: Ε ＝ Μήκος · Πλάτος. Επομένως: ${length} · ${width} ＝ ${area} cm².`
    };
  } else {
    // q2: Εύρεση πλάτους από γνωστό εμβαδόν και μήκος (Πλάτος = Ε : Μήκος)
    const length = [12, 15, 18, 20][getRandomInt(0, 3)];
    const width = [6, 7, 8, 9][getRandomInt(0, 3)];
    const area = length * width;

    return {
      type: 'input',
      correct: width,
      unit: 'cm (πλάτος)',
      prompt: `Το εμβαδόν ενός ορθογωνίου είναι ${area} cm² και το μήκος του είναι ${length} cm. Πόσα cm είναι το πλάτος του;`,
      explanation: `Για να βρούμε την άγνωστη διάσταση, διαιρούμε το εμβαδόν με τη γνωστή πλευρά: Πλάτος ＝ Εμβαδόν ： Μήκος ＝ ${area} ： ${length} ＝ ${width} cm.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Έννοια Εμβαδού & Τετραγωνικό Εκατοστό (MCQ)
function makeAreaConceptQuestion(isSquareCm = false) {
  if (!isSquareCm) {
    // q3: Τι εκφράζει το εμβαδόν
    const options = [
      'Το μέγεθος της επίπεδης επιφάνειας που περικλείεται μέσα στο σχήμα',
      'Το συνολικό μήκος του περιγράμματος γύρω-γύρω από το σχήμα',
      'Το βάρος του γεωμετρικού σχήματος',
      'Τον αριθμό των κορυφών του πολυγώνου'
    ];

    return {
      type: 'mcq',
      correct: 'Το μέγεθος της επίπεδης επιφάνειας που περικλείεται μέσα στο σχήμα',
      options,
      prompt: `Τι μετράμε όταν υπολογίζουμε το ΕΜΒΑΔΟΝ ενός γεωμετρικού σχήματος;`,
      explanation: `Το εμβαδόν μετράει το μέγεθος της εσωτερικής επίπεδης επιφάνειας που κλείνεται μέσα στα όρια του σχήματος (σε αντίθεση με την περίμετρο που μετράει το μήκος του περιγράμματος).`
    };
  } else {
    // q4: Τι είναι το 1 τετραγωνικό εκατοστό (1 cm²)
    const options = shuffleArray([
      'Η επιφάνεια ενός τετραγώνου με πλευρά 1 cm',
      'Ένα ευθύγραμμο τμήμα μήκους 1 cm',
      'Ένας κύκλος με διάμετρο 1 cm',
      'Η περίμετρος ενός τετραγώνου με πλευρά 4 cm'
    ]);

    return {
      type: 'mcq',
      correct: 'Η επιφάνεια ενός τετραγώνου με πλευρά 1 cm',
      options,
      prompt: `Τι ορίζεται στη γεωμετρία ως « 1 τετραγωνικό εκατοστό ( 1 cm² ) »;`,
      explanation: `Ένα τετραγωνικό εκατοστό (1 cm²) είναι η μονάδα μέτρησης επιφάνειας που ισούται με την επιφάνεια ενός τετραγώνου του οποίου κάθε πλευρά έχει μήκος ακριβώς 1 cm.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Εμβαδόν Τετραγώνου & Ανάστροφη Εύρεση Πλευράς (Input & MCQ)
function makeSquareAreaQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q5: Ε = α · α
    const side = [7, 8, 9, 11, 12, 15][getRandomInt(0, 5)];
    const area = side * side;

    return {
      type: 'input',
      correct: area,
      unit: 'cm² (εμβαδόν)',
      prompt: `Ένα τετράγωνο έχει πλευρά ${side} cm. Πόσα cm² είναι το εμβαδόν του;`,
      explanation: `Ο τύπος του εμβαδού τετραγώνου είναι: Ε ＝ Πλευρά · Πλευρά ( α · α ). Επομένως: ${side} · ${side} ＝ ${area} cm².`
    };
  } else {
    // q6: Εύρεση πλευράς τετραγώνου από γνωστό εμβαδόν
    const cases = [
      { area: 36, side: 6 },
      { area: 49, side: 7 },
      { area: 64, side: 8 },
      { area: 81, side: 9 },
      { area: 100, side: 10 },
      { area: 144, side: 12 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const distractors = [c.side + 2, Math.max(2, c.side - 2), c.area / 2];
    const options = shuffleArray([`${c.side} cm`, ...distractors.map((d) => `${d} cm`)]);

    return {
      type: 'mcq',
      correct: `${c.side} cm`,
      options,
      prompt: `Το εμβαδόν ενός τετραγώνου είναι ${c.area} cm². Πόσο είναι το μήκος της πλευράς του;`,
      explanation: `Ψάχνουμε ποιος αριθμός πολλαπλασιαζόμενος με τον εαυτό του δίνει ${c.area}. Επειδή ${c.side} · ${c.side} ＝ ${c.area}, η πλευρά του τετραγώνου είναι ${c.side} cm.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Πλακόστρωση & Περίμετρος vs Εμβαδόν (Input & MCQ)
function makeTilingAndComparisonProblem(isComparisonMCQ = false) {
  if (!isComparisonMCQ) {
    // q7: Πλακόστρωση δαπέδου με πλακάκια (Input)
    // Δάπεδο π.χ. 4 m x 3 m = 12 m² = 120.000 cm², ή σε μικρή κλίμακα:
    // Ορθογώνιο 30 cm x 20 cm = 600 cm². Πλακάκια 5 cm x 5 cm = 25 cm² -> 600 : 25 = 24 πλακάκια.
    const roomL = 60; // cm
    const roomW = 40; // cm
    const tileSide = 10; // cm
    const roomArea = roomL * roomW; // 2400 cm²
    const tileArea = tileSide * tileSide; // 100 cm²
    const tilesCount = roomArea / tileArea; // 24

    return {
      type: 'input',
      correct: tilesCount,
      unit: 'πλακάκια',
      prompt: `Θέλουμε να καλύψουμε πλήρως ένα ορθογώνιο δίσκο διαστάσεων ${roomL} cm επί ${roomW} cm με τετράγωνα πλακάκια πλευράς ${tileSide} cm. Πόσα τέτοια πλακάκια θα χρειαστούμε συνολικά;`,
      explanation: `Εμβαδόν δίσκου: ${roomL} · ${roomW} ＝ ${roomArea} cm². Εμβαδόν ενός πλακιδίου: ${tileSide} · ${tileSide} ＝ ${tileArea} cm². Αριθμός πλακιδίων: ${roomArea} ： ${tileArea} ＝ ${tilesCount} πλακάκια.`
    };
  } else {
    // q8: Ίδια περίμετρος αλλά διαφορετικό εμβαδόν (MCQ)
    const options = [
      'Μπορεί να έχουν την ίδια περίμετρο αλλά διαφορετικό εμβαδόν',
      'Έχουν υποχρεωτικά και το ίδιο εμβαδόν',
      'Το εμβαδόν τους είναι πάντα ίσο με το μισό της περιμέτρου',
      'Δεν μπορούμε να υπολογίσουμε το εμβαδόν τους'
    ];

    return {
      type: 'mcq',
      correct: 'Μπορεί να έχουν την ίδια περίμετρο αλλά διαφορετικό εμβαδόν',
      options,
      prompt: `Αν δύο διαφορετικά ορθογώνια παραλληλόγραμμα έχουν ακριβώς την ίδια περίμετρο (π.χ. 20 cm), τι ισχύει για το εμβαδόν τους;`,
      explanation: `Δύο σχήματα με την ίδια περίμετρο μπορούν να έχουν εντελώς διαφορετικό εμβαδόν! Π.χ. ορθογώνιο 9x1 έχει Π ＝ 20 cm και Ε ＝ 9 cm², ενώ ορθογώνιο 6x4 έχει Π ＝ 20 cm και Ε ＝ 24 cm²!`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeRectangleAreaQuestion(false),
    q2: makeRectangleAreaQuestion(true),
    q3: makeAreaConceptQuestion(false),
    q4: makeAreaConceptQuestion(true),
    q5: makeSquareAreaQuestion(false),
    q6: makeSquareAreaQuestion(true),
    q7: makeTilingAndComparisonProblem(false),
    q8: makeTilingAndComparisonProblem(true)
  };
}

export default function EmbadoAskPage() {
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
      title="Ασκήσεις: Η Έννοια του Εμβαδού - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στο εμβαδόν: ορθογώνια, τετράγωνα, πλακόστρωση επιφανειών και διάκριση περιμέτρου από εμβαδόν."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/25-embado"
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
              📝 Ασκήσεις: Η Έννοια του Εμβαδού
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
          {renderInput('q1', questions.q1, 1, 'ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ( ΜΗΚΟΣ · ΠΛΑΤΟΣ )', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΕΥΡΕΣΗ ΠΛΑΤΟΥΣ ΑΠΟ ΕΜΒΑΔΟΝ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΕΝΝΟΙΑ ΤΟΥ ΕΜΒΑΔΟΥ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΤΟ ΤΕΤΡΑΓΩΝΙΚΟ ΕΚΑΤΟΣΤΟ ( 1 cm² )', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΕΜΒΑΔΟΝ ΤΕΤΡΑΓΩΝΟΥ ( α · α )', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΕΥΡΕΣΗ ΠΛΕΥΡΑΣ ΤΕΤΡΑΓΩΝΟΥ ΑΠΟ ΕΜΒΑΔΟΝ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΠΛΑΚΟΣΤΡΩΣΗ ΕΠΙΦΑΝΕΙΑΣ ΜΕ ΠΛΑΚΑΚΙΑ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΙΔΙΑ ΠΕΡΙΜΕΤΡΟΣ - ΔΙΑΦΟΡΕΤΙΚΟ ΕΜΒΑΔΟΝ', 'bg-purple-600')}

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

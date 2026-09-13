// pages/e-dimotikou/22-poligona-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Περίμετρος Κανονικού Πολυγώνου & Εύρεση Πλευράς (Input)
function makeRegularPolygonPerimeterQuestion(isSideFromPerimeter = false) {
  if (!isSideFromPerimeter) {
    // q1: Υπολογισμός περιμέτρου κανονικού πολυγώνου (Π = ν · α)
    const polygonTypes = [
      { name: 'κανονικού πενταγώνου', sides: 5 },
      { name: 'κανονικού εξαγώνου', sides: 6 },
      { name: 'κανονικού οκταγώνου', sides: 8 },
      { name: 'κανονικού επταγώνου', sides: 7 }
    ];
    const poly = polygonTypes[getRandomInt(0, polygonTypes.length - 1)];
    const side = [6, 8, 9, 12, 15][getRandomInt(0, 4)];
    const perimeter = poly.sides * side;

    return {
      type: 'input',
      correct: perimeter,
      unit: 'cm (περίμετρος)',
      prompt: `Κάθε πλευρά ενός ${poly.name} έχει μήκος ${side} cm. Πόσα cm είναι η περίμετρός του;`,
      explanation: `Σε ένα κανονικό πολύγωνο όλες οι πλευρές είναι απολύτως ίσες. Πολλαπλασιάζουμε το πλήθος των πλευρών με το μήκος της μίας πλευράς: ${poly.sides} · ${side} ＝ ${perimeter} cm.`
    };
  } else {
    // q2: Εύρεση μήκους πλευράς από γνωστή περίμετρο
    const polygonTypes = [
      { name: 'κανονικού εξαγώνου', sides: 6 },
      { name: 'κανονικού οκταγώνου', sides: 8 },
      { name: 'κανονικού πενταγώνου', sides: 5 }
    ];
    const poly = polygonTypes[getRandomInt(0, polygonTypes.length - 1)];
    const side = [7, 8, 11, 14, 16][getRandomInt(0, 4)];
    const perimeter = poly.sides * side;

    return {
      type: 'input',
      correct: side,
      unit: 'cm (μήκος πλευράς)',
      prompt: `Η περίμετρος ενός ${poly.name} είναι ${perimeter} cm. Πόσα cm είναι το μήκος της κάθε πλευράς του;`,
      explanation: `Επειδή το πολύγωνο είναι κανονικό, όλες οι ${poly.sides} πλευρές του είναι ίσες. Διαιρούμε την περίμετρο με το πλήθος των πλευρών: ${perimeter} ： ${poly.sides} ＝ ${side} cm.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Ονοματολογία & Αναγνώριση Πολυγώνων (MCQ)
function makePolygonClassificationQuestion(isNonPolygon = false) {
  if (!isNonPolygon) {
    // q3: Ονοματολογία ανάλογα με τον αριθμό πλευρών
    const cases = [
      { sides: 5, name: 'Πεντάγωνο', distractors: ['Εξάγωνο', 'Τετράπλευρο', 'Επτάγωνο'] },
      { sides: 6, name: 'Εξάγωνο', distractors: ['Πεντάγωνο', 'Οκτάγωνο', 'Επτάγωνο'] },
      { sides: 7, name: 'Επτάγωνο', distractors: ['Εξάγωνο', 'Οκτάγωνο', 'Εννεάγωνο'] },
      { sides: 8, name: 'Οκτάγωνο', distractors: ['Εξάγωνο', 'Δεκάγωνο', 'Επτάγωνο'] }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const options = shuffleArray([c.name, ...c.distractors]);

    return {
      type: 'mcq',
      correct: c.name,
      options,
      prompt: `Πώς ονομάζεται το πολύγωνο που αποτελείται από ακριβώς ${c.sides} πλευρές και ${c.sides} γωνίες;`,
      explanation: `Το πολύγωνο με ${c.sides} πλευρές και ${c.sides} γωνίες ονομάζεται ${c.name}.`
    };
  } else {
    // q4: Ποιο σχήμα ΔΕΝ είναι πολύγωνο
    const options = [
      'Ο κύκλος (αποτελείται από καμπύλη γραμμή και όχι ευθύγραμμα τμήματα)',
      'Το τρίγωνο (3 πλευρές)',
      'Το κανονικό εξάγωνο (6 πλευρές)',
      'Το τραπέζιο (4 πλευρές)'
    ];

    return {
      type: 'mcq',
      correct: 'Ο κύκλος (αποτελείται από καμπύλη γραμμή και όχι ευθύγραμμα τμήματα)',
      options,
      prompt: `Ποιο από τα παρακάτω γεωμετρικά σχήματα ΔΕΝ είναι πολύγωνο;`,
      explanation: `Τα πολύγωνα αποτελούνται αποκλειστικά από ευθύγραμμα τμήματα και δεν έχουν ποτέ καμπύλες γραμμές. Επομένως, ο κύκλος δεν είναι πολύγωνο.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Πλήθος Διαγωνίων Πολυγώνου (Input & MCQ)
function makeDiagonalsQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q5: Πλήθος διαγωνίων τετραπλεύρου (2) ή πενταγώνου (5) (Input)
    // Τύπος διαγωνίων: d = [n · (n - 3)] : 2
    const cases = [
      { name: 'τετράπλευρο (4 πλευρές)', sides: 4, diagonals: 2 },
      { name: 'πεντάγωνο (5 πλευρές)', sides: 5, diagonals: 5 },
      { name: 'τρίγωνο (3 πλευρές)', sides: 3, diagonals: 0 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    return {
      type: 'input',
      correct: c.diagonals,
      unit: 'διαγώνιοι',
      prompt: `Πόσες διαγωνίους (ευθύγραμμα τμήματα που ενώνουν μη διαδοχικές κορυφές) έχει συνολικά ένα ${c.name};`,
      explanation: `Ο αριθμός των διαγωνίων δίνεται από τον τύπο d ＝ [ ν · ( ν － 3 ) ] ： 2. Για ν ＝ ${c.sides}: [ ${c.sides} · ( ${c.sides} － 3 ) ] ： 2 ＝ ${c.diagonals} διαγώνιοι.`
    };
  } else {
    // q6: Διαγώνιοι εξαγώνου (MCQ)
    // d = 6 · 3 : 2 = 9
    const options = shuffleArray(['9 διαγώνιους', '6 διαγώνιους', '12 διαγώνιους', '3 διαγώνιους']);

    return {
      type: 'mcq',
      correct: '9 διαγώνιους',
      options,
      prompt: `Πόσες διαγώνιους έχει συνολικά ένα εξάγωνο (πολύγωνο με 6 πλευρές);`,
      explanation: `Εφαρμόζουμε τον μαθηματικό τύπο για ν ＝ 6: d ＝ [ 6 · ( 6 － 3 ) ] ： 2 ＝ ( 6 · 3 ) ： 2 ＝ 18 ： 2 ＝ 9 διαγώνιους.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Ανώμαλα Πολύγωνα & Ορισμός Κανονικού (Input & MCQ)
function makeComplexPolygonQuestion(isRegularDefinition = false) {
  if (!isRegularDefinition) {
    // q7: Περίμετρος ανώμαλου πενταγώνου με γνωστές πλευρές (Input)
    const s1 = 8;
    const s2 = 12;
    const s3 = 10;
    const s4 = 14;
    const s5 = 11;
    const totalP = s1 + s2 + s3 + s4 + s5;

    return {
      type: 'input',
      correct: totalP,
      unit: 'cm (περίμετρος)',
      prompt: `Ένα ανώμαλο πεντάγωνο έχει πλευρές με μήκη ${s1} cm, ${s2} cm, ${s3} cm, ${s4} cm και ${s5} cm. Πόσα cm είναι η περίμετρός του;`,
      explanation: `Η περίμετρος οποιουδήποτε πολυγώνου ισούται με το άθροισμα όλων των πλευρών του: ${s1} ＋ ${s2} ＋ ${s3} ＋ ${s4} ＋ ${s5} ＝ ${totalP} cm.`
    };
  } else {
    // q8: Πότε ένα πολύγωνο ονομάζεται κανονικό (MCQ)
    const options = [
      'Όταν έχει όλες τις πλευρές του ίσες ΚΑΙ όλες τις γωνίες του ίσες',
      'Όταν έχει μόνο όλες τις γωνίες του ίσες (π.χ. ορθογώνιο)',
      'Όταν έχει περισσότερες από 10 πλευρές',
      'Όταν δεν έχει καμία διαγώνιο'
    ];

    return {
      type: 'mcq',
      correct: 'Όταν έχει όλες τις πλευρές του ίσες ΚΑΙ όλες τις γωνίες του ίσες',
      options,
      prompt: `Πότε ένα πολύγωνο χαρακτηρίζεται ως ΚΑΝΟΝΙΚΟ πολύγωνο στη Γεωμετρία;`,
      explanation: `Ένα πολύγωνο ονομάζεται κανονικό ΜΟΝΟ όταν ισχύουν ταυτόχρονα και οι δύο προϋποθέσεις: έχει όλες τις πλευρές του ίσες (ισόπλευρο) ΚΑΙ όλες τις γωνίες του ίσες (ισογώνιο).`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeRegularPolygonPerimeterQuestion(false),
    q2: makeRegularPolygonPerimeterQuestion(true),
    q3: makePolygonClassificationQuestion(false),
    q4: makePolygonClassificationQuestion(true),
    q5: makeDiagonalsQuestion(false),
    q6: makeDiagonalsQuestion(true),
    q7: makeComplexPolygonQuestion(false),
    q8: makeComplexPolygonQuestion(true)
  };
}

export default function PoligonaAskPage() {
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
      title="Ασκήσεις: Πολύγωνα - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα πολύγωνα: περίμετρος κανονικών πολυγώνων, ονοματολογία, πλήθος διαγωνίων και αναγνώριση σχημάτων."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/22-poligona"
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
              📝 Ασκήσεις: Τι είναι τα Πολύγωνα
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
          {renderInput('q1', questions.q1, 1, 'ΠΕΡΙΜΕΤΡΟΣ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΕΥΡΕΣΗ ΠΛΕΥΡΑΣ ΑΠΟ ΠΕΡΙΜΕΤΡΟ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΟΝΟΜΑΤΟΛΟΓΙΑ ΠΟΛΥΓΩΝΩΝ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΣΧΗΜΑΤΑ ΠΟΥ ΔΕΝ ΕΙΝΑΙ ΠΟΛΥΓΩΝΑ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΠΛΗΘΟΣ ΔΙΑΓΩΝΙΩΝ ΠΟΛΥΓΩΝΟΥ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΔΙΑΓΩΝΙΟΙ ΕΞΑΓΩΝΟΥ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΠΕΡΙΜΕΤΡΟΣ ΑΝΩΜΑΛΟΥ ΠΟΛΥΓΩΝΟΥ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΟΡΙΣΜΟΣ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ', 'bg-purple-600')}

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

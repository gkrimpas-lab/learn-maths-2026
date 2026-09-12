// pages/e-dimotikou/15-trigona-pleures-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Περίμετρος & Εύρεση Άγνωστης Πλευράς (Input)
function makePerimeterQuestion(isSideFromPerimeter = false) {
  if (!isSideFromPerimeter) {
    // q1: Υπολογισμός περιμέτρου ισοσκελούς τριγώνου
    const equalSide = [12, 14, 16, 18, 22, 25][getRandomInt(0, 5)];
    const base = [10, 15, 20, 24][getRandomInt(0, 3)];
    const perimeter = equalSide * 2 + base;

    return {
      type: 'input',
      correct: perimeter,
      unit: 'cm (περίμετρος)',
      prompt: `Ένα ισοσκελές τρίγωνο έχει βάση ${base} cm και καθεμία από τις δύο ίσες πλευρές του είναι ${equalSide} cm. Πόσα cm είναι η περίμετρός του;`,
      explanation: `Η περίμετρος ισούται με το άθροισμα όλων των πλευρών: (2 · ${equalSide}) ＋ ${base} ＝ ${equalSide * 2} ＋ ${base} ＝ ${perimeter} cm.`
    };
  } else {
    // q2: Εύρεση μήκους πλευράς ισόπλευρου τριγώνου από γνωστή περίμετρο
    const side = [9, 12, 15, 18, 21, 24, 27][getRandomInt(0, 6)];
    const perimeter = side * 3;

    return {
      type: 'input',
      correct: side,
      unit: 'cm (μήκος πλευράς)',
      prompt: `Η περίμετρος ενός ισόπλευρου τριγώνου είναι ${perimeter} cm. Πόσα cm είναι το μήκος της κάθε πλευράς του;`,
      explanation: `Στο ισόπλευρο τρίγωνο και οι τρεις πλευρές είναι απολύτως ίσες. Διαιρούμε την περίμετρο διά 3: ${perimeter} ： 3 ＝ ${side} cm.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Κατάταξη ως προς τις Πλευρές (MCQ)
function makeSideClassificationQuestion(isIdentifyFromSides = false) {
  if (!isIdentifyFromSides) {
    // q3: Δίνονται 3 πλευρές και ζητείται η ονομασία του τριγώνου
    const cases = [
      { a: 14, b: 14, c: 14, type: 'Ισόπλευρο τρίγωνο', expl: 'και οι 3 πλευρές είναι ίσες ( 14 cm )' },
      { a: 16, b: 16, c: 10, type: 'Ισοσκελές τρίγωνο', expl: 'έχει 2 πλευρές ίσες ( 16 cm ) και 1 διαφορετική' },
      { a: 12, b: 15, c: 19, type: 'Σκαληνό τρίγωνο', expl: 'και οι 3 πλευρές του έχουν διαφορετικό μήκος' },
      { a: 20, b: 20, c: 12, type: 'Ισοσκελές τρίγωνο', expl: 'έχει 2 πλευρές ίσες ( 20 cm )' },
      { a: 9, b: 12, c: 15, type: 'Σκαληνό τρίγωνο', expl: 'όλες οι πλευρές είναι άνισες μεταξύ τους' }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const options = ['Ισόπλευρο τρίγωνο', 'Ισοσκελές τρίγωνο', 'Σκαληνό τρίγωνο'];

    return {
      type: 'mcq',
      correct: c.type,
      options,
      prompt: `Ένα τρίγωνο έχει μήκη πλευρών ${c.a} cm, ${c.b} cm και ${c.c} cm. Πώς χαρακτηρίζεται ως προς τις πλευρές του;`,
      explanation: `Το τρίγωνο είναι ${c.type}, επειδή ${c.expl}.`
    };
  } else {
    // q4: Ποια τριάδα πλευρών αντιστοιχεί σε ισοσκελές τρίγωνο
    const validIsosceles = [
      '15 cm, 15 cm, 22 cm',
      '18 cm, 18 cm, 10 cm',
      '24 cm, 24 cm, 14 cm'
    ][getRandomInt(0, 2)];

    const distractors = [
      '15 cm, 15 cm, 15 cm', // ισόπλευρο
      '10 cm, 14 cm, 18 cm', // σκαληνό
      '8 cm, 10 cm, 22 cm'   // αδύνατο (8+10 < 22)
    ];

    const options = shuffleArray([validIsosceles, ...distractors]);

    return {
      type: 'mcq',
      correct: validIsosceles,
      options,
      prompt: `Ποια από τις παρακάτω τριάδες πλευρών αντιστοιχεί σε ΙΣΟΣΚΕΛΕΣ τρίγωνο (και ικανοποιεί την τριγωνική ανισότητα);`,
      explanation: `Στο ισοσκελές τρίγωνο ακριβώς 2 πλευρές είναι ίσες μεταξύ τους και ισχύει η τριγωνική ανισότητα. Η σωστή τριάδα είναι: ${validIsosceles}.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Τριγωνική Ανισότητα & Ύπαρξη Τριγώνου (Input & MCQ)
function makeTriangleInequalityQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q5: Εύρεση ελάχιστου ακέραιου μήκους 3ης πλευράς (Input)
    // Αν δύο πλευρές είναι 7 και 10, η τρίτη πλευρά c πρέπει να είναι c > 10 - 7 = 3, άρα min c = 4
    const a = [5, 6, 7, 8][getRandomInt(0, 3)];
    const b = [9, 10, 11, 12][getRandomInt(0, 3)];
    const minSide = b - a + 1;

    return {
      type: 'input',
      correct: minSide,
      unit: 'cm (ελάχιστο μήκος)',
      prompt: `Δύο πλευρές ενός τριγώνου έχουν μήκη ${a} cm και ${b} cm. Ποιο είναι το ΜΙΚΡΟΤΕΡΟ ακέραιο μήκος (σε cm) που μπορεί να έχει η τρίτη πλευρά ώστε να σχηματίζεται τρίγωνο;`,
      explanation: `Σύμφωνα με την τριγωνική ανισότητα, κάθε πλευρά πρέπει να είναι αυστηρά μεγαλύτερη από τη διαφορά των άλλων δύο: c ＞ ${b} － ${a} ＝ ${b - a} cm. Το αμέσως επόμενο ακέραιο μήκος είναι ${minSide} cm.`
    };
  } else {
    // q6: Ποια τριάδα πλευρών ΔΕΝ μπορεί να σχηματίσει τρίγωνο (MCQ)
    const invalidTriplets = [
      { triplet: '4 cm, 6 cm, 11 cm', reason: '4 ＋ 6 ＝ 10 ＜ 11' },
      { triplet: '3 cm, 5 cm, 9 cm', reason: '3 ＋ 5 ＝ 8 ＜ 9' },
      { triplet: '5 cm, 7 cm, 13 cm', reason: '5 ＋ 7 ＝ 12 ＜ 13' },
      { triplet: '2 cm, 8 cm, 10 cm', reason: '2 ＋ 8 ＝ 10 (δεν είναι αυστηρά μεγαλύτερο από 10)' }
    ];
    const invalid = invalidTriplets[getRandomInt(0, invalidTriplets.length - 1)];

    const validTriplets = [
      '6 cm, 8 cm, 10 cm',
      '7 cm, 9 cm, 12 cm',
      '8 cm, 8 cm, 11 cm'
    ];

    const options = shuffleArray([invalid.triplet, ...validTriplets]);

    return {
      type: 'mcq',
      correct: invalid.triplet,
      options,
      prompt: `Με ποια από τις παρακάτω τριάδες ευθύγραμμων τμημάτων ΔΕΝ είναι δυνατόν να κατασκευαστεί τρίγωνο;`,
      explanation: `Στην τριάδα ${invalid.triplet} παραβιάζεται η τριγωνική ανισότητα, καθώς το άθροισμα των δύο μικρότερων πλευρών δεν ξεπερνά τη μεγαλύτερη: ${invalid.reason}.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Περιμέτρου & Συνδυαστικής Ονοματολογίας (Input & MCQ)
function makeComplexPerimeterAndProperties(isMCQ = false) {
  if (!isMCQ) {
    // q7: Ισοσκελές με γνωστή περίμετρο και βάση, ζητείται η ίση πλευρά (Input)
    const base = [14, 18, 20, 24][getRandomInt(0, 3)];
    const equalSide = [15, 17, 21, 25][getRandomInt(0, 3)];
    const perimeter = equalSide * 2 + base;

    return {
      type: 'input',
      correct: equalSide,
      unit: 'cm (ίση πλευρά)',
      prompt: `Η περίμετρος ενός ισοσκελούς τριγώνου είναι ${perimeter} cm και η βάση του είναι ${base} cm. Πόσα cm είναι καθεμία από τις δύο ίσες πλευρές του;`,
      explanation: `Αφαιρούμε τη βάση από την περίμετρο για να βρούμε το άθροισμα των δύο ίσων πλευρών: ${perimeter} － ${base} ＝ ${perimeter - base} cm. Διαιρούμε διά 2: ${perimeter - base} ： 2 ＝ ${equalSide} cm.`
    };
  } else {
    // q8: Συνδυαστική ταυτότητα (πλευρές και γωνίες) (MCQ)
    const options = [
      'Ορθογώνιο και Ισοσκελές',
      'Ορθογώνιο και Ισόπλευρο',
      'Αμβλυγώνιο και Ισόπλευρο',
      'Ευθύγραμμο και Ισοσκελές'
    ];

    return {
      type: 'mcq',
      correct: 'Ορθογώνιο και Ισοσκελές',
      options,
      prompt: `Ένα τρίγωνο έχει μία ορθή γωνία (90°) και οι δύο κάθετες πλευρές του είναι ίσες μεταξύ τους (π.χ. 8 cm και 8 cm). Πώς χαρακτηρίζεται πλήρως το τρίγωνο αυτό;`,
      explanation: `Επειδή έχει ορθή γωνία (90°) λέγεται ορθογώνιο. Επειδή έχει δύο πλευρές ίσες λέγεται ισοσκελές. Άρα η πλήρης ονομασία του είναι: Ορθογώνιο και Ισοσκελές (οι οξείες γωνίες του είναι υποχρεωτικά 45° η καθεμία).`
    };
  }
}

function generateQuestions() {
  return {
    q1: makePerimeterQuestion(false),
    q2: makePerimeterQuestion(true),
    q3: makeSideClassificationQuestion(false),
    q4: makeSideClassificationQuestion(true),
    q5: makeTriangleInequalityQuestion(false),
    q6: makeTriangleInequalityQuestion(true),
    q7: makeComplexPerimeterAndProperties(false),
    q8: makeComplexPerimeterAndProperties(true)
  };
}

export default function TrigonaPleuresAskPage() {
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
      title="Ασκήσεις: Τρίγωνα ως προς τις Πλευρές - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα τρίγωνα ως προς τις πλευρές: ισόπλευρα, ισοσκελή, σκαληνά, τριγωνική ανισότητα και περίμετρος."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/15-trigona-pleures"
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
              📝 Ασκήσεις: Τρίγωνα ως προς τις Πλευρές
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
          {renderInput('q1', questions.q1, 1, 'ΠΕΡΙΜΕΤΡΟΣ ΙΣΟΣΚΕΛΟΥΣ ΤΡΙΓΩΝΟΥ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΠΛΕΥΡΑ ΙΣΟΠΛΕΥΡΟΥ ΑΠΟ ΠΕΡΙΜΕΤΡΟ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΚΑΤΑΤΑΞΗ ΤΡΙΓΩΝΟΥ ΩΣ ΠΡΟΣ ΤΙΣ ΠΛΕΥΡΕΣ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΕΝΤΟΠΙΣΜΟΣ ΙΣΟΣΚΕΛΟΥΣ ΤΡΙΓΩΝΟΥ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΤΡΙΓΩΝΙΚΗ ΑΝΙΣΟΤΗΤΑ ( ΕΛΑΧΙΣΤΗ ΠΛΕΥΡΑ )', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΕΛΕΓΧΟΣ ΔΥΝΑΤΟΤΗΤΑΣ ΚΑΤΑΣΚΕΥΗΣ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΕΥΡΕΣΗ ΙΣΗΣ ΠΛΕΥΡΑΣ ΑΠΟ ΠΕΡΙΜΕΤΡΟ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΣΥΝΔΥΑΣΤΙΚΗ ΟΝΟΜΑΤΟΛΟΓΙΑ ΤΡΙΓΩΝΟΥ', 'bg-purple-600')}

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

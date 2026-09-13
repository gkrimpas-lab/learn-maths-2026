// pages/e-dimotikou/21-monades-mikous-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Μετατροπές Υποδιαιρέσεων (m <-> cm / mm <-> m) (Input)
function makeSubdivisionConversionQuestion(isAscending = false) {
  if (!isAscending) {
    // q1: Κατεβαίνω τη σκάλα (m -> cm, πολλαπλασιασμός με 100)
    const metersOptions = [2.5, 3.75, 4.2, 0.8, 1.45, 5.6];
    const mVal = metersOptions[getRandomInt(0, metersOptions.length - 1)];
    const correctCm = Math.round(mVal * 100);
    const mStr = mVal.toLocaleString('el-GR');

    return {
      type: 'input',
      correct: correctCm,
      unit: 'cm',
      prompt: `Μετάτρεψε το μήκος ${mStr} m σε εκατοστά ( cm ):`,
      explanation: `Για να πάμε από μέτρα ( m ) σε εκατοστά ( cm ), κατεβαίνουμε 2 σκαλοπάτια (πολλαπλασιάζουμε με το 100): ${mStr} · 100 ＝ ${correctCm} cm.`
    };
  } else {
    // q2: Ανεβαίνω τη σκάλα (mm -> m, διαίρεση με 1.000)
    const mmOptions = [1500, 2400, 3800, 4500, 750, 6200];
    const mmVal = mmOptions[getRandomInt(0, mmOptions.length - 1)];
    const correctM = parseFloat((mmVal / 1000).toFixed(3));
    const mStr = correctM.toLocaleString('el-GR');

    return {
      type: 'input',
      correct: correctM,
      unit: 'm',
      prompt: `Μετάτρεψε το μήκος ${mmVal.toLocaleString('el-GR')} mm σε μέτρα ( m ):`,
      explanation: `Για να πάμε από χιλιοστά ( mm ) σε μέτρα ( m ), ανεβαίνουμε 3 σκαλοπάτια (διαιρούμε με το 1.000): ${mmVal.toLocaleString('el-GR')} ： 1.000 ＝ ${mStr} m.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Σύγκριση Ανομοιογενών Μηκών & Κανόνας Σκάλας (MCQ)
function makeComparisonAndRuleQuestion(isRule = false) {
  if (!isRule) {
    // q3: Ποιο μήκος είναι το μεγαλύτερο
    const cases = [
      {
        correct: '3,2 m',
        options: ['3,2 m', '290 cm', '3.100 mm', '28 dm'],
        expl: 'Μετατρέπουμε όλα σε cm: 3,2 m ＝ 320 cm, 290 cm, 3.100 mm ＝ 310 cm, 28 dm ＝ 280 cm. Το μεγαλύτερο είναι τα 3,2 m (320 cm).'
      },
      {
        correct: '0,55 m',
        options: ['0,55 m', '52 cm', '480 mm', '4,9 dm'],
        expl: 'Μετατρέπουμε όλα σε cm: 0,55 m ＝ 55 cm, 52 cm, 480 mm ＝ 48 cm, 4,9 dm ＝ 49 cm. Το μεγαλύτερο είναι τα 0,55 m (55 cm).'
      },
      {
        correct: '45 dm',
        options: ['45 dm', '4,2 m', '410 cm', '3.900 mm'],
        expl: 'Μετατρέπουμε όλα σε μέτρα: 45 dm ＝ 4,5 m, 4,2 m, 410 cm ＝ 4,1 m, 3.900 mm ＝ 3,9 m. Το μεγαλύτερο είναι τα 45 dm (4,5 m).'
      }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    return {
      type: 'mcq',
      correct: c.correct,
      options: shuffleArray(c.options),
      prompt: `Ποιο από τα παρακάτω μήκη είναι το ΜΕΓΑΛΥΤΕΡΟ;`,
      explanation: c.expl
    };
  } else {
    // q4: Κανόνας της σκάλας μετατροπών
    const options = shuffleArray([
      'Όταν ανεβαίνουμε τη σκάλα (μικρότερη σε μεγαλύτερη μονάδα) διαιρούμε με 10, 100 ή 1.000',
      'Όταν ανεβαίνουμε τη σκάλα πολλαπλασιάζουμε πάντα με το 10',
      'Όταν κατεβαίνουμε τη σκάλα διαιρούμε με το 100',
      'Το άλμα από μέτρο σε χιλιόμετρο γίνεται πολλαπλασιάζοντας με το 10'
    ]);

    return {
      type: 'mcq',
      correct: 'Όταν ανεβαίνουμε τη σκάλα (μικρότερη σε μεγαλύτερη μονάδα) διαιρούμε με 10, 100 ή 1.000',
      options,
      prompt: `Ποιος κανόνας ισχύει πάντοτε για τις μετατροπές μονάδων μέτρησης μήκους;`,
      explanation: `Όταν μετατρέπουμε από μικρότερη σε μεγαλύτερη μονάδα (ανεβαίνουμε τη σκάλα) κάνουμε ΔΙΑΙΡΕΣΗ (: 10, : 100, : 1.000). Όταν πάμε από μεγαλύτερη σε μικρότερη (κατεβαίνουμε τη σκάλα) κάνουμε ΠΟΛΛΑΠΛΑΣΙΑΣΜΟ (· 10, · 100, · 1.000).`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Μετατροπές Χιλιομέτρου (km <-> m) (Input & MCQ)
function makeKilometerConversionQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q5: Μετατροπή km σε m (πολλαπλασιασμός με 1.000)
    const kmOptions = [2.4, 3.75, 0.85, 1.25, 4.05, 5.5];
    const kmVal = kmOptions[getRandomInt(0, kmOptions.length - 1)];
    const correctMeters = Math.round(kmVal * 1000);
    const kmStr = kmVal.toLocaleString('el-GR');

    return {
      type: 'input',
      correct: correctMeters,
      unit: 'm',
      prompt: `Μια διαδρομή έχει μήκος ${kmStr} km. Πόσα μέτρα ( m ) είναι η διαδρομή αυτή;`,
      explanation: `Επειδή 1 km ＝ 1.000 m, πολλαπλασιάζουμε με το 1.000: ${kmStr} · 1.000 ＝ ${correctMeters.toLocaleString('el-GR')} m.`
    };
  } else {
    // q6: Μετατροπή m σε km (διαίρεση με 1.000)
    const mCases = [
      { meters: 4500, km: '4,5 km', distractors: ['45 km', '0,45 km', '450 km'] },
      { meters: 750, km: '0,75 km', distractors: ['7,5 km', '0,075 km', '75 km'] },
      { meters: 12800, km: '12,8 km', distractors: ['128 km', '1,28 km', '0,128 km'] },
      { meters: 320, km: '0,32 km', distractors: ['3,2 km', '0,032 km', '32 km'] }
    ];
    const c = mCases[getRandomInt(0, mCases.length - 1)];
    const options = shuffleArray([c.km, ...c.distractors]);

    return {
      type: 'mcq',
      correct: c.km,
      options,
      prompt: `Πόσα χιλιόμετρα ( km ) είναι η απόσταση των ${c.meters.toLocaleString('el-GR')} m;`,
      explanation: `Για να μετατρέψουμε μέτρα σε χιλιόμετρα, διαιρούμε με το 1.000: ${c.meters.toLocaleString('el-GR')} ： 1.000 ＝ ${c.km}.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Περιμέτρου & Ανομοιογενών Μονάδων (Input & MCQ)
function makeComplexLengthProblem(isMCQ = false) {
  if (!isMCQ) {
    // q7: Περίμετρος ορθογωνίου με μήκη σε διαφορετικές μονάδες (σε m και cm, ζητείται σε m)
    const lengthM = [1.2, 1.5, 2.4, 3.5][getRandomInt(0, 3)];
    const widthCm = [80, 50, 60, 150][getRandomInt(0, 3)];
    const widthM = widthCm / 100;
    const perimeterM = parseFloat((2 * (lengthM + widthM)).toFixed(2));

    return {
      type: 'input',
      correct: perimeterM,
      unit: 'm (περίμετρος)',
      prompt: `Ένα ορθογώνιο παρτέρι έχει μήκος ${lengthM.toLocaleString('el-GR')} m και πλάτος ${widthCm} cm. Πόσα μέτρα ( m ) είναι η περίμετρός του;`,
      explanation: `Μετατρέπουμε το πλάτος σε μέτρα: ${widthCm} cm ＝ ${widthM.toLocaleString('el-GR')} m. Υπολογίζουμε την περίμετρο: 2 · (${lengthM.toLocaleString('el-GR')} ＋ ${widthM.toLocaleString('el-GR')}) ＝ 2 · ${(lengthM + widthM).toLocaleString('el-GR')} ＝ ${perimeterM.toLocaleString('el-GR')} m.`
    };
  } else {
    // q8: Αφαίρεση κομματιών από συνολικό ύφασμα/σχοινί
    const totalM = 5;
    const cut1Cm = 180; // 1,8 m
    const cut2Dm = 14;  // 1,4 m
    const cutTotalM = cut1Cm / 100 + cut2Dm / 10; // 3,2 m
    const remainM = parseFloat((totalM - cutTotalM).toFixed(1)); // 1,8 m
    const remainCm = Math.round(remainM * 100); // 180 cm

    const distractors = [remainCm + 40, remainCm - 30, remainCm + 100];
    const options = shuffleArray([`${remainCm} cm`, ...distractors.map((d) => `${d} cm`)]);

    return {
      type: 'mcq',
      correct: `${remainCm} cm`,
      options,
      prompt: `Ένα σχοινί έχει αρχικό μήκος ${totalM} m. Κόβουμε ένα κομμάτι ${cut1Cm} cm και ένα δεύτερο κομμάτι ${cut2Dm} dm. Πόσα εκατοστά ( cm ) σχοινιού περίσσεψαν;`,
      explanation: `Μετατρέπουμε τα πάντα σε εκατοστά: Αρχικό ＝ ${totalM} m ＝ 500 cm. Πρώτο κομμάτι ＝ ${cut1Cm} cm. Δεύτερο κομμάτι ＝ ${cut2Dm} dm ＝ ${cut2Dm * 10} cm. Συνολικό κόψιμο: ${cut1Cm} ＋ ${cut2Dm * 10} ＝ ${cut1Cm + cut2Dm * 10} cm. Περίσσεψαν: 500 － ${cut1Cm + cut2Dm * 10} ＝ ${remainCm} cm.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeSubdivisionConversionQuestion(false),
    q2: makeSubdivisionConversionQuestion(true),
    q3: makeComparisonAndRuleQuestion(false),
    q4: makeComparisonAndRuleQuestion(true),
    q5: makeKilometerConversionQuestion(false),
    q6: makeKilometerConversionQuestion(true),
    q7: makeComplexLengthProblem(false),
    q8: makeComplexLengthProblem(true)
  };
}

export default function MonadesMikousAskPage() {
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

  // Αυστηρό φιλτράρισμα: μόνο ψηφία 0-9, το πολύ ένα κόμμα, όριο 10 χαρακτήρες
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

  // Render Component για Ερωτήσεις Input (αυστηρά φιλτραρισμένο έως 10 ψηφία)
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
      title="Ασκήσεις: Μονάδες Μέτρησης Μήκους - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στις μονάδες μέτρησης μήκους: μετατροπές σκάλας, χιλιόμετρα, μέτρα, δεκαδικοί υπολογισμοί και προβλήματα περιμέτρου."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/21-monades-mikous"
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
              📝 Ασκήσεις: Μονάδες Μέτρησης Μήκους
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
          {renderInput('q1', questions.q1, 1, 'ΚΑΤΕΒΑΙΝΩ ΤΗ ΣΚΑΛΑ ( m ➔ cm )', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΑΝΕΒΑΙΝΩ ΤΗ ΣΚΑΛΑ ( mm ➔ m )', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΣΥΓΚΡΙΣΗ ΑΝΟΜΟΙΟΓΕΝΩΝ ΜΗΚΩΝ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΚΑΝΟΝΑΣ ΤΗΣ ΣΚΑΛΑΣ ΜΕΤΑΤΡΟΠΩΝ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΜΕΤΑΤΡΟΠΗ ΧΙΛΙΟΜΕΤΡΩΝ ΣΕ ΜΕΤΡΑ ( km ➔ m )', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΜΕΤΑΤΡΟΠΗ ΜΕΤΡΩΝ ΣΕ ΧΙΛΙΟΜΕΤΡΑ ( m ➔ km )', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΠΕΡΙΜΕΤΡΟΣ ΜΕ ΑΝΟΜΟΙΟΓΕΝΕΙΣ ΜΟΝΑΔΕΣ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΑΦΑΙΡΕΣΗ ΚΑΙ ΥΠΟΛΟΙΠΟ ΜΗΚΟΥΣ ( cm )', 'bg-purple-600')}

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

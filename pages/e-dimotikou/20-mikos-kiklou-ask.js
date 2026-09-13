// pages/e-dimotikou/20-mikos-kiklou-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Υπολογισμός Μήκους Κύκλου από Διάμετρο & Ακτίνα (Input)
function makeCircumferenceCalculationQuestion(isFromRadius = false) {
  if (!isFromRadius) {
    // q1: Υπολογισμός από διάμετρο (L = 3,14 · δ)
    // Επιλέγουμε διαμέτρους όπως 10, 20, 30, 40, 50 για καθαρά δεκαδικά
    const diameters = [10, 20, 30, 40, 50, 100];
    const d = diameters[getRandomInt(0, diameters.length - 1)];
    const length = parseFloat((3.14 * d).toFixed(2));
    const formattedLength = length.toLocaleString('el-GR');

    return {
      type: 'input',
      correct: length,
      unit: 'cm (μήκος κύκλου)',
      prompt: `Ένας κύκλος έχει διάμετρο δ ＝ ${d} cm. Υπολόγισε το μήκος του κύκλου (χρησιμοποίησε π ＝ 3,14):`,
      explanation: `Ο τύπος του μήκους κύκλου είναι: Μ ＝ π · δ. Επομένως: 3,14 · ${d} ＝ ${formattedLength} cm.`
    };
  } else {
    // q2: Υπολογισμός από ακτίνα (L = 2 · 3,14 · α)
    const radii = [5, 10, 15, 20, 25];
    const r = radii[getRandomInt(0, radii.length - 1)];
    const d = r * 2;
    const length = parseFloat((2 * 3.14 * r).toFixed(2));
    const formattedLength = length.toLocaleString('el-GR');

    return {
      type: 'input',
      correct: length,
      unit: 'cm (μήκος κύκλου)',
      prompt: `Ένας κύκλος έχει ακτίνα α ＝ ${r} cm. Υπολόγισε το μήκος του κύκλου (χρησιμοποίησε π ＝ 3,14):`,
      explanation: `Πρώτα βρίσκουμε τη διάμετρο: δ ＝ 2 · ${r} ＝ ${d} cm. Έπειτα υπολογίζουμε το μήκος: Μ ＝ 2 · π · α ＝ 2 · 3,14 · ${r} ＝ 3,14 · ${d} ＝ ${formattedLength} cm.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Θεωρία Αριθμού π & Λόγος Μήκους προς Διάμετρο (MCQ)
function makePiTheoryQuestion(isRatioQuestion = false) {
  if (!isRatioQuestion) {
    // q3: Τι εκφράζει ο αριθμός π
    const options = [
      'Πόσες φορές χωράει η διάμετρος στο μήκος του κύκλου (περίπου 3,14)',
      'Πόσες φορές χωράει η ακτίνα στη διάμετρο',
      'Το άθροισμα των γωνιών ενός τριγώνου',
      'Τον αριθμό των αξόνων συμμετρίας ενός κύκλου'
    ];

    return {
      type: 'mcq',
      correct: 'Πόσες φορές χωράει η διάμετρος στο μήκος του κύκλου (περίπου 3,14)',
      options,
      prompt: `Τι εκφράζει ο μαθηματικός αριθμός π (περίπου 3,14) σε οποιονδήποτε κύκλο;`,
      explanation: `Ο αριθμός π εκφράζει τον σταθερό λόγο του μήκους της περιφέρειας προς τη διάμετρο του κύκλου (Μήκος ： Διάμετρος ＝ π ≈ 3,14). Δηλαδή η διάμετρος χωράει στο μήκος περίπου 3,14 φορές.`
    };
  } else {
    // q4: Ποια σχέση ισχύει για το πηλίκο Μήκος : Διάμετρος
    const options = shuffleArray([
      'Είναι πάντα ίσο με 3,14 για όλους τους κύκλους ανεξαρτήτως μεγέθους',
      'Εξαρτάται από το πόσο μεγάλος είναι ο κύκλος',
      'Είναι πάντα ίσο με 2 για όλους τους κύκλους',
      'Είναι ίσο με το εμβαδόν του τετραγώνου'
    ]);

    return {
      type: 'mcq',
      correct: 'Είναι πάντα ίσο με 3,14 για όλους τους κύκλους ανεξαρτήτως μεγέθους',
      options,
      prompt: `Αν διαιρέσουμε το μήκος ενός μικρού νομίσματος με τη διάμετρό του και το μήκος της ρόδας ενός φορτηγού με τη δική της διάμετρο, τι θα παρατηρήσουμε;`,
      explanation: `Σε ΟΛΟΥΣ τους κύκλους του σύμπαντος, το πηλίκο Μήκος ： Διάμετρος παραμένει αυστηρά σταθερό και ισούται πάντα με τον αριθμό π ≈ 3,14.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Ανάστροφος Υπολογισμός Διαμέτρου/Ακτίνας (Input & MCQ)
function makeReverseCircumferenceQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q5: Εύρεση διαμέτρου από γνωστό μήκος (Input)
    // δ = Μ : 3,14
    const d = [10, 20, 30, 40, 50][getRandomInt(0, 4)];
    const circumference = parseFloat((3.14 * d).toFixed(2));
    const formattedCirc = circumference.toLocaleString('el-GR');

    return {
      type: 'input',
      correct: d,
      unit: 'cm (διάμετρος)',
      prompt: `Το μήκος ενός κυκλικού στεφανιού είναι ${formattedCirc} cm. Πόσα cm είναι η ΔΙΑΜΕΤΡΟΣ του (χρησιμοποίησε π ＝ 3,14);`,
      explanation: `Χρησιμοποιούμε τον αντίστροφο τύπο: Διάμετρος ＝ Μήκος ： π ＝ ${formattedCirc} ： 3,14 ＝ ${d} cm.`
    };
  } else {
    // q6: Εύρεση ακτίνας από γνωστό μήκος (MCQ)
    // α = (Μ : 3,14) : 2
    const r = [5, 10, 15, 20][getRandomInt(0, 3)];
    const d = r * 2;
    const circumference = parseFloat((3.14 * d).toFixed(2));
    const formattedCirc = circumference.toLocaleString('el-GR');

    const distractors = [d, r * 3, Math.max(2, r - 3)];
    const options = shuffleArray([`${r} cm`, ...distractors.map((v) => `${v} cm`)]);

    return {
      type: 'mcq',
      correct: `${r} cm`,
      options,
      prompt: `Ένας κυκλικός δίσκος έχει μήκος περιφέρειας ${formattedCirc} cm. Πόσο είναι το μήκος της ΑΚΤΙΝΑΣ του (π ＝ 3,14);`,
      explanation: `Πρώτα βρίσκουμε τη διάμετρο: δ ＝ ${formattedCirc} ： 3,14 ＝ ${d} cm. Η ακτίνα είναι το μισό της διαμέτρου: α ＝ ${d} ： 2 ＝ ${r} cm.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Στροφές Τροχού & Συνολική Απόσταση (Input & MCQ)
function makeWheelRotationsProblem(isTurnsCount = false) {
  if (!isTurnsCount) {
    // q7: Υπολογισμός συνολικής απόστασης από στροφές (Input)
    // π.χ. τροχός διαμέτρου 50 cm -> Μήκος = 3,14 * 50 = 157 cm = 1,57 m.
    // Σε 100 στροφές διανύει 157 m.
    const d = [50, 100][getRandomInt(0, 1)]; // cm
    const turns = [10, 20, 50, 100][getRandomInt(0, 3)];
    const lengthCm = 3.14 * d;
    const totalDistanceM = Math.round((lengthCm * turns) / 100);

    return {
      type: 'input',
      correct: totalDistanceM,
      unit: 'μέτρα ( m )',
      prompt: `Η ρόδα ενός ποδηλάτου έχει διάμετρο ${d} cm (άρα μήκος 3,14 · ${d} ＝ ${lengthCm.toLocaleString('el-GR')} cm). Πόσα ΜΕΤΡΑ ( m ) θα διανύσει το ποδήλατο αν η ρόδα κάνει ακριβώς ${turns} πλήρεις στροφές;`,
      explanation: `Σε κάθε στροφή, η ρόδα διανύει απόσταση ίση με το μήκος της (${lengthCm} cm). Σε ${turns} στροφές διανύει: ${turns} · ${lengthCm} ＝ ${turns * lengthCm} cm. Μετατρέπουμε σε μέτρα διαιρώντας με το 100: ${turns * lengthCm} ： 100 ＝ ${totalDistanceM} m.`
    };
  } else {
    // q8: Εύρεση αριθμού στροφών από απόσταση και μήκος τροχού (MCQ)
    const turnCases = [
      { lengthM: 2, distanceM: 100, turns: 50 },
      { lengthM: 2.5, distanceM: 250, turns: 100 },
      { lengthM: 1.5, distanceM: 300, turns: 200 },
      { lengthM: 2, distanceM: 400, turns: 200 }
    ];
    const c = turnCases[getRandomInt(0, turnCases.length - 1)];
    const distractors = [c.turns + 20, c.turns - 25, c.turns * 2].filter((v) => v > 0 && v !== c.turns);
    const options = shuffleArray([`${c.turns} στροφές`, ...distractors.slice(0, 3).map((v) => `${v} στροφές`)]);

    return {
      type: 'mcq',
      correct: `${c.turns} στροφές`,
      options,
      prompt: `Ο τροχός ενός αυτοκινήτου έχει μήκος περιφέρειας ${c.lengthM.toLocaleString('el-GR')} m. Πόσες πλήρεις στροφές πρέπει να εκτελέσει ο τροχός για να καλύψει απόσταση ${c.distanceM} m;`,
      explanation: `Διαιρούμε τη συνολική απόσταση με το μήκος μιας πλήρους περιστροφής: Στροφές ＝ Απόσταση ： Μήκος ＝ ${c.distanceM} ： ${c.lengthM.toLocaleString('el-GR')} ＝ ${c.turns} στροφές.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeCircumferenceCalculationQuestion(false),
    q2: makeCircumferenceCalculationQuestion(true),
    q3: makePiTheoryQuestion(false),
    q4: makePiTheoryQuestion(true),
    q5: makeReverseCircumferenceQuestion(false),
    q6: makeReverseCircumferenceQuestion(true),
    q7: makeWheelRotationsProblem(false),
    q8: makeWheelRotationsProblem(true)
  };
}

export default function MikosKiklouAskPage() {
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

  const handleDecimalInput = (key, rawVal) => {
    if (submitted) return;
    // Αποδοχή ψηφίων και υποδιαστολής (κόμμα ή τελεία)
    const clean = rawVal.replace(/[^0-9,.]/g, '').replace('.', ',');
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const parseUserFloat = (val) => {
    if (!val) return NaN;
    return parseFloat(val.replace(',', '.'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    // q1
    if (Math.abs(parseUserFloat(answers.q1) - questions.q1.correct) < 0.05) currentScore += 1;
    // q2
    if (Math.abs(parseUserFloat(answers.q2) - questions.q2.correct) < 0.05) currentScore += 1;
    // q3
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    // q4
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    // q5
    if (Math.abs(parseUserFloat(answers.q5) - questions.q5.correct) < 0.05) currentScore += 1;
    // q6
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    // q7
    if (Math.abs(parseUserFloat(answers.q7) - questions.q7.correct) < 0.05) currentScore += 1;
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

  // Render Component για Ερωτήσεις Input (αριθμητικό/δεκαδικό)
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const userVal = parseUserFloat(answers[qKey]);
    const isCorrect = !isNaN(userVal) && Math.abs(userVal - qData.correct) < 0.05;
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
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              value={answers[qKey]}
              onChange={(e) => handleDecimalInput(qKey, e.target.value)}
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
      title="Ασκήσεις: Μήκος Κύκλου - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στο μήκος του κύκλου: τύποι L = π · δ, L = 2 · π · α, ανάστροφη εύρεση διαμέτρου/ακτίνας και στροφές τροχών."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/20-mikos-kiklou"
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
              📝 Ασκήσεις: Το Μήκος του Κύκλου
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
          {renderInput('q1', questions.q1, 1, 'ΜΗΚΟΣ ΚΥΚΛΟΥ ΑΠΟ ΔΙΑΜΕΤΡΟ ( π ＝ 3,14 )', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΜΗΚΟΣ ΚΥΚΛΟΥ ΑΠΟ ΑΚΤΙΝΑ ( 2 · π · α )', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'Η ΣΗΜΑΣΙΑ ΤΟΥ ΑΡΙΘΜΟΥ π ≈ 3,14', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΣΤΑΘΕΡΟΤΗΤΑ ΠΗΛΙΚΟΥ ΜΗΚΟΥΣ ΠΡΟΣ ΔΙΑΜΕΤΡΟ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΑΝΑΣΤΡΟΦΗ ΕΥΡΕΣΗ ΔΙΑΜΕΤΡΟΥ ( δ ＝ Μ ： 3,14 )', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΑΝΑΣΤΡΟΦΗ ΕΥΡΕΣΗ ΑΚΤΙΝΑΣ ΑΠΟ ΜΗΚΟΣ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΑΠΟΣΤΑΣΗ ΑΠΟ ΣΤΡΟΦΕΣ ΤΡΟΧΟΥ ( ΣΕ ΜΕΤΡΑ )', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΥΠΟΛΟΓΙΣΜΟΣ ΠΛΗΘΟΥΣ ΣΤΡΟΦΩΝ ΤΡΟΧΟΥ', 'bg-purple-600')}

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

// pages/e-dimotikou/18-ipsos-trigonou-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Υπολογισμός Εμβαδού από Βάση & Ύψος (Input)
function makeAreaFromBaseHeightQuestion(isRightTriangle = false) {
  if (!isRightTriangle) {
    // q1: Γενικό τρίγωνο (Ε = (β · υ) : 2)
    const base = [10, 12, 14, 16, 18, 20][getRandomInt(0, 5)];
    const height = [6, 8, 10, 12, 14][getRandomInt(0, 4)];
    const area = (base * height) / 2;

    return {
      type: 'input',
      correct: area,
      unit: 'cm² (εμβαδόν)',
      prompt: `Σε ένα τρίγωνο, η βάση έχει μήκος ${base} cm και το αντίστοιχο ύψος προς αυτήν είναι ${height} cm. Πόσα cm² είναι το εμβαδόν του τριγώνου;`,
      explanation: `Ο τύπος του εμβαδού τριγώνου είναι: Ε ＝ ( Βάση · Ύψος ) ： 2. Επομένως: (${base} · ${height}) ： 2 ＝ ${base * height} ： 2 ＝ ${area} cm².`
    };
  } else {
    // q2: Ορθογώνιο τρίγωνο (οι δύο κάθετες πλευρές δρουν ως βάση και ύψος)
    const side1 = [8, 10, 12, 14, 16][getRandomInt(0, 4)];
    const side2 = [6, 8, 10, 12][getRandomInt(0, 3)];
    const hypotenuse = side1 + getRandomInt(3, 6);
    const area = (side1 * side2) / 2;

    return {
      type: 'input',
      correct: area,
      unit: 'cm² (εμβαδόν)',
      prompt: `Ένα ορθογώνιο τρίγωνο έχει κάθετες πλευρές μήκους ${side1} cm και ${side2} cm, και υποτείνουσα ${hypotenuse} cm. Πόσα cm² είναι το εμβαδόν του;`,
      explanation: `Στο ορθογώνιο τρίγωνο, οι δύο κάθετες πλευρές λειτουργούν ως βάση και αντίστοιχο ύψος. Αγνοούμε την υποτείνουσα για το εμβαδόν: Ε ＝ (${side1} · ${side2}) ： 2 ＝ ${side1 * side2} ： 2 ＝ ${area} cm².`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Θέση του Ύψους & Είδος Τριγώνου (MCQ)
function makeHeightPositionQuestion(isIdentifyTriangle = false) {
  if (!isIdentifyTriangle) {
    // q3: Πού πέφτει το ύψος σε αμβλυγώνιο τρίγωνο
    const options = [
      'Έξω από το τρίγωνο, στην προέκταση της βάσης',
      'Πάντα μέσα στο τρίγωνο',
      'Συμπίπτει υποχρεωτικά με τη μεγαλύτερη πλευρά',
      'Πέφτει ακριβώς στη μέση της βάσης'
    ];

    return {
      type: 'mcq',
      correct: 'Έξω από το τρίγωνο, στην προέκταση της βάσης',
      options,
      prompt: `Σε ένα ΑΜΒΛΥΓΩΝΙΟ τρίγωνο, πού πέφτει το ύψος που ξεκινά από μία από τις οξείες κορυφές του προς την απέναντι πλευρά;`,
      explanation: `Στα αμβλυγώνια τρίγωνα, τα ύψη που ξεκινούν από τις οξείες γωνίες πέφτουν έξω από το τρίγωνο, πάνω στην προέκταση της αντίστοιχης βάσης.`
    };
  } else {
    // q4: Σε ποιο τρίγωνο δύο από τα ύψη συμπίπτουν με πλευρές
    const options = [
      'Στο ορθογώνιο τρίγωνο',
      'Στο οξυγώνιο τρίγωνο',
      'Στο ισόπλευρο τρίγωνο',
      'Στο αμβλυγώνιο σκαληνό τρίγωνο'
    ];

    return {
      type: 'mcq',
      correct: 'Στο ορθογώνιο τρίγωνο',
      options,
      prompt: `Σε ποιο είδος τριγώνου δύο από τα τρία ύψη του συμπίπτουν με δύο πλευρές του τριγώνου;`,
      explanation: `Στο ορθογώνιο τρίγωνο, επειδή οι δύο κάθετες πλευρές σχηματίζουν γωνία 90°, η καθεμία αποτελεί ταυτόχρονα και το ύψος προς την άλλη.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Ανάστροφος Υπολογισμός Ύψους ή Βάσης (Input & MCQ)
function makeReverseHeightQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q5: Εύρεση ύψους από γνωστό εμβαδόν και βάση (Input)
    // Ε = (β · υ) : 2 => υ = (2 · Ε) : β
    const base = [8, 10, 12, 14, 16][getRandomInt(0, 4)];
    const height = [5, 6, 7, 8, 9, 10][getRandomInt(0, 5)];
    const area = (base * height) / 2;

    return {
      type: 'input',
      correct: height,
      unit: 'cm (ύψος)',
      prompt: `Το εμβαδόν ενός τριγώνου είναι ${area} cm² και η βάση του είναι ${base} cm. Πόσα cm είναι το αντίστοιχο ύψος του τριγώνου;`,
      explanation: `Διπλασιάζουμε το εμβαδόν και διαιρούμε με τη βάση: υ ＝ ( 2 · Ε ) ： Βάση ＝ ( 2 · ${area} ) ： ${base} ＝ ${2 * area} ： ${base} ＝ ${height} cm.`
    };
  } else {
    // q6: Εύρεση βάσης από γνωστό εμβαδόν και ύψος (MCQ)
    const height = [6, 8, 10, 12][getRandomInt(0, 3)];
    const base = [12, 15, 18, 20][getRandomInt(0, 3)];
    const area = (base * height) / 2;

    const distractors = [base + 4, Math.max(4, base - 4), base * 2];
    const options = shuffleArray([`${base} cm`, ...distractors.map((d) => `${d} cm`)]);

    return {
      type: 'mcq',
      correct: `${base} cm`,
      options,
      prompt: `Ένα τρίγωνο έχει εμβαδόν ${area} cm² και το ύψος του είναι ${height} cm. Πόσο είναι το μήκος της αντίστοιχης βάσης;`,
      explanation: `Βάση ＝ ( 2 · Ε ) ： Ύψος ＝ ( 2 · ${area} ) ： ${height} ＝ ${2 * area} ： ${height} ＝ ${base} cm.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετες Ιδιότητες, 3 Ύψη & Ορθόκεντρο (Input & MCQ)
function makeComplexHeightProblem(isOrthocenter = false) {
  if (!isOrthocenter) {
    // q7: Πόσα ύψη έχει συνολικά κάθε τρίγωνο (Input)
    return {
      type: 'input',
      correct: 3,
      unit: 'ύψη',
      prompt: `Πόσα ύψη έχει συνολικά ΚΑΘΕ τρίγωνο (ένα αντίστοιχο για κάθε κορυφή και βάση);`,
      explanation: `Κάθε τρίγωνο έχει ακριβώς 3 κορυφές και 3 πλευρές, επομένως διαθέτει ακριβώς 3 ύψη (υα, υβ, υγ).`
    };
  } else {
    // q8: Κοινό σημείο τομής των 3 υψών (Ορθόκεντρο) (MCQ)
    const options = shuffleArray([
      'Ορθόκεντρο',
      'Βαρύκεντρο',
      'Έκκεντρο',
      'Περίκεντρο'
    ]);

    return {
      type: 'mcq',
      correct: 'Ορθόκεντρο',
      options,
      prompt: `Πώς ονομάζεται στη γεωμετρία το κοινό σημείο στο οποίο συναντιούνται (τέμνονται) και τα τρία ύψη ενός τριγώνου;`,
      explanation: `Το σημείο τομής των τριών υψών ενός τριγώνου ονομάζεται Ορθόκεντρο.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeAreaFromBaseHeightQuestion(false),
    q2: makeAreaFromBaseHeightQuestion(true),
    q3: makeHeightPositionQuestion(false),
    q4: makeHeightPositionQuestion(true),
    q5: makeReverseHeightQuestion(false),
    q6: makeReverseHeightQuestion(true),
    q7: makeComplexHeightProblem(false),
    q8: makeComplexHeightProblem(true)
  };
}

export default function IpsosTrigonouAskPage() {
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
      title="Ασκήσεις: Ύψος Τριγώνου - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στο ύψος του τριγώνου: υπολογισμός εμβαδού, ανάστροφος υπολογισμός βάσης/ύψους, θέση ύψους και ορθόκεντρο."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/18-ipsos-trigonou"
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
              📝 Ασκήσεις: Το Ύψος του Τριγώνου
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
          {renderInput('q1', questions.q1, 1, 'ΕΜΒΑΔΟΝ ΤΡΙΓΩΝΟΥ ΑΠΟ ΒΑΣΗ ΚΑΙ ΥΨΟΣ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΘΕΣΗ ΥΨΟΥΣ ΣΕ ΑΜΒΛΥΓΩΝΙΟ ΤΡΙΓΩΝΟ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΥΨΗ ΠΟΥ ΣΥΜΠΙΠΤΟΥΝ ΜΕ ΠΛΕΥΡΕΣ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΑΝΑΣΤΡΟΦΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΥΨΟΥΣ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΑΝΑΣΤΡΟΦΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΒΑΣΗΣ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΠΛΗΘΟΣ ΥΨΩΝ ΚΑΘΕ ΤΡΙΓΩΝΟΥ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΣΗΜΕΙΟ ΤΟΜΗΣ ΥΨΩΝ ( ΟΡΘΟΚΕΝΤΡΟ )', 'bg-purple-600')}

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

// pages/e-dimotikou/16-kathetes-eutheies-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Υπολογισμός Γωνιών Τομής Τεμνόμενων Ευθειών (Input)
function makeIntersectionAnglesQuestion(isOpposite = false) {
  if (!isOpposite) {
    // q1: Δίνεται μία οξεία γωνία τομής, ζητείται η παραπληρωματική της αμβλεία
    const acuteAngle = [28, 35, 42, 48, 56, 64, 72][getRandomInt(0, 6)];
    const obtuseAngle = 180 - acuteAngle;

    return {
      type: 'input',
      correct: obtuseAngle,
      unit: 'μοίρες ( ° )',
      prompt: `Δύο ευθείες τέμνονται και σχηματίζουν μία οξεία γωνία ${acuteAngle}°. Πόσες μοίρες ( ° ) είναι η διπλανή (παραπληρωματική) αμβλεία γωνία τους;`,
      explanation: `Οι δύο διπλανές γωνίες που σχηματίζονται από δύο τεμνόμενες ευθείες είναι παραπληρωματικές (έχουν άθροισμα 180°). Επομένως: 180° － ${acuteAngle}° ＝ ${obtuseAngle}°.`
    };
  } else {
    // q2: Άθροισμα των 4 γωνιών ή υπολογισμός υπολοίπων
    const acute = [30, 45, 50, 65, 70][getRandomInt(0, 4)];
    const obtuse = 180 - acute;
    const sumTwoObtuse = obtuse * 2;

    return {
      type: 'input',
      correct: sumTwoObtuse,
      unit: 'μοίρες ( ° )',
      prompt: `Δύο τεμνόμενες ευθείες σχηματίζουν μία οξεία γωνία ${acute}°. Πόσο είναι το άθροισμα των δύο αμβλειών (κατά κορυφή) γωνιών που δημιουργούνται;`,
      explanation: `Κάθε αμβλεία γωνία είναι 180° － ${acute}° ＝ ${obtuse}°. Επειδή οι δύο αμβλείες είναι κατά κορυφή (ίσες), το άθροισμά τους είναι: ${obtuse}° ＋ ${obtuse}° ＝ ${sumTwoObtuse}°.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Αναγνώριση Κάθετων Ευθειών & Ιδιότητες 4 Ορθών Γωνιών (MCQ)
function makePerpendicularPropertiesQuestion(isSymbolQuestion = false) {
  if (!isSymbolQuestion) {
    // q3: Πόσες ορθές γωνίες σχηματίζονται
    const options = ['Ακριβώς 4 ορθές γωνίες των 90°', 'Μόνο 1 ορθή γωνία των 90°', '2 ορθές και 2 οξείες γωνίες', '4 γωνίες των 45°'];

    return {
      type: 'mcq',
      correct: 'Ακριβώς 4 ορθές γωνίες των 90°',
      options,
      prompt: `Όταν δύο ευθείες είναι κάθετες μεταξύ τους, πόσες ορθές γωνίες σχηματίζονται συνολικά γύρω από το σημείο τομής τους;`,
      explanation: `Όταν δύο ευθείες είναι κάθετες, σχηματίζουν υποχρεωτικά 4 ορθές γωνίες των 90° ( 4 · 90° ＝ 360° ).`
    };
  } else {
    // q4: Σύμβολο καθετότητας και έννοια
    const options = shuffleArray(['ε1 ⊥ ε2', 'ε1 // ε2', 'ε1 ＝ ε2', 'ε1 ＋ ε2']);

    return {
      type: 'mcq',
      correct: 'ε1 ⊥ ε2',
      options,
      prompt: `Ποιος είναι ο σωστός μαθηματικός συμβολισμός για να δηλώσουμε ότι η ευθεία ε1 είναι κάθετη στην ευθεία ε2;`,
      explanation: `Το σύμβολο της καθετότητας είναι το « ⊥ ». Γράφουμε λοιπόν ε1 ⊥ ε2.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Απόσταση Σημείου από Ευθεία (Input & MCQ)
function makePointLineDistanceQuestion(isComparison = false) {
  if (!isComparison) {
    // q5: Μήκος απόστασης σημείου από ευθεία
    const dist = [6, 8, 10, 12, 15][getRandomInt(0, 4)];
    const oblique = dist + getRandomInt(3, 6);

    return {
      type: 'input',
      correct: dist,
      unit: 'cm',
      prompt: `Από ένα σημείο Α φέρνουμε ένα κάθετο τμήμα ΑΗ μήκους ${dist} cm προς την ευθεία ε και ένα πλάγιο τμήμα ΑΒ μήκους ${oblique} cm. Πόση είναι η ΑΠΟΣΤΑΣΗ του σημείου Α από την ευθεία ε;`,
      explanation: `Απόσταση ενός σημείου από μια ευθεία ονομάζεται πάντοτε το μήκος του ΚΑΘΕΤΟΥ ευθύγραμμου τμήματος προς αυτήν. Επομένως, η απόσταση είναι ακριβώς ${dist} cm.`
    };
  } else {
    // q6: Σύγκριση κάθετου και πλάγιου τμήματος (MCQ)
    const options = [
      'Το κάθετο τμήμα είναι πάντοτε το συντομότερο (μικρότερο σε μήκος)',
      'Το πλάγιο τμήμα είναι πάντοτε μικρότερο από το κάθετο',
      'Το κάθετο και το πλάγιο τμήμα έχουν πάντα το ίδιο μήκος',
      'Εξαρτάται από το πάχος της ευθείας'
    ];

    return {
      type: 'mcq',
      correct: 'Το κάθετο τμήμα είναι πάντοτε το συντομότερο (μικρότερο σε μήκος)',
      options,
      prompt: `Ποια πρόταση είναι μαθηματικά σωστή σχετικά με την απόσταση σημείου από ευθεία;`,
      explanation: `Η συντομότερη διαδρομή από ένα σημείο προς μία ευθεία είναι η κάθετη. Οποιοδήποτε πλάγιο τμήμα είναι αυστηρά μεγαλύτερο από το κάθετο τμήμα.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Καθετότητας & Σχημάτων (Input & MCQ)
function makeComplexPerpendicularProblem(isParallelTransitive = false) {
  if (!isParallelTransitive) {
    // q7: Πλήθος ορθών γωνιών σε ορθογώνιο παραλληλόγραμμο (Input)
    return {
      type: 'input',
      correct: 4,
      unit: 'ορθές γωνίες',
      prompt: `Σε ένα ορθογώνιο παραλληλόγραμμο ΑΒΓΔ, οι διαδοχικές πλευρές είναι κάθετες μεταξύ τους (ΑΒ ⊥ ΒΓ, ΒΓ ⊥ ΓΔ, ΓΔ ⊥ ΔΑ, ΔΑ ⊥ ΑΒ). Πόσες ορθές γωνίες (των 90°) έχει συνολικά το σχήμα;`,
      explanation: `Σε κάθε ορθογώνιο παραλληλόγραμμο (και στο τετράγωνο), όλες οι διαδοχικές πλευρές τέμνονται κάθετα, σχηματίζοντας ακριβώς 4 ορθές γωνίες.`
    };
  } else {
    // q8: Δύο ευθείες κάθετες στην ίδια ευθεία είναι παράλληλες μεταξύ τους (MCQ)
    const options = [
      'Είναι παράλληλες μεταξύ τους ( ε1 // ε2 )',
      'Είναι και αυτές κάθετες μεταξύ τους ( ε1 ⊥ ε2 )',
      'Τέμνονται υπό γωνία 45°',
      'Συμπίπτουν σε μία μόνο ευθεία'
    ];

    return {
      type: 'mcq',
      correct: 'Είναι παράλληλες μεταξύ τους ( ε1 // ε2 )',
      options,
      prompt: `Αν δύο ευθείες ε1 και ε2 είναι και οι δύο κάθετες στην ίδια τρίτη ευθεία ε3 (ε1 ⊥ ε3 και ε2 ⊥ ε3), ποια σχέση έχουν μεταξύ τους οι ε1 και ε2;`,
      explanation: `Δύο ευθείες του ίδιου επιπέδου που είναι κάθετες στην ίδια ευθεία δεν πρόκειται ποτέ να συναντηθούν, άρα είναι ΠΑΡΑΛΛΗΛΕΣ μεταξύ τους ( ε1 // ε2 ).`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeIntersectionAnglesQuestion(false),
    q2: makeIntersectionAnglesQuestion(true),
    q3: makePerpendicularPropertiesQuestion(false),
    q4: makePerpendicularPropertiesQuestion(true),
    q5: makePointLineDistanceQuestion(false),
    q6: makePointLineDistanceQuestion(true),
    q7: makeComplexPerpendicularProblem(false),
    q8: makeComplexPerpendicularProblem(true)
  };
}

export default function KathetesEutheiesAskPage() {
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
      title="Ασκήσεις: Κάθετες Ευθείες - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στις κάθετες ευθείες: γωνίες τομής, σύμβολο καθετότητας, απόσταση σημείου από ευθεία και ορθές γωνίες."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/16-kathetes-eutheies"
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
              📝 Ασκήσεις: Τεμνόμενες &amp; Κάθετες Ευθείες
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
          {renderInput('q1', questions.q1, 1, 'ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ ΤΟΜΗΣ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΑΘΡΟΙΣΜΑ ΚΑΤΑ ΚΟΡΥΦΗ ΓΩΝΙΩΝ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΠΛΗΘΟΣ ΟΡΘΩΝ ΓΩΝΙΩΝ ΣΤΗΝ ΚΑΘΕΤΟΤΗΤΑ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΜΑΘΗΜΑΤΙΚΟ ΣΥΜΒΟΛΟ ΚΑΘΕΤΟΤΗΤΑΣ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΟΥ ΑΠΟ ΕΥΘΕΙΑ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΣΥΓΚΡΙΣΗ ΚΑΘΕΤΟΥ & ΠΛΑΓΙΟΥ ΤΜΗΜΑΤΟΣ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΚΑΘΕΤΕΣ ΠΛΕΥΡΕΣ ΣΕ ΟΡΘΟΓΩΝΙΟ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΔΙΑΔΟΧΙΚΕΣ ΚΑΘΕΤΕΣ ΕΥΘΕΙΕΣ', 'bg-purple-600')}

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

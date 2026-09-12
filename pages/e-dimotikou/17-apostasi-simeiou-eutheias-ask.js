// pages/e-dimotikou/17-apostasi-simeiou-eutheias-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εύρεση Πραγματικής Απόστασης (Input)
function makeDistanceIdentificationQuestion(isMultipleSegments = false) {
  if (!isMultipleSegments) {
    // q1: Δίνεται κάθετο τμήμα και πλάγιο τμήμα με τις γωνίες τους
    const perpLength = [5, 6, 8, 9, 12, 15][getRandomInt(0, 5)];
    const obliqueLength = perpLength + getRandomInt(2, 5);

    return {
      type: 'input',
      correct: perpLength,
      unit: 'cm (απόσταση)',
      prompt: `Από το σημείο Α φέρνουμε προς την ευθεία ε δύο τμήματα: το ΑΗ μήκους ${perpLength} cm που σχηματίζει γωνία 90° με την ευθεία, και το ΑΒ μήκους ${obliqueLength} cm που σχηματίζει γωνία 48°. Πόσα cm είναι η ΑΠΟΣΤΑΣΗ του σημείου Α από την ευθεία ε;`,
      explanation: `Απόσταση σημείου από ευθεία ονομάζεται πάντοτε το μήκος του ΚΑΘΕΤΟΥ ευθύγραμμου τμήματος (αυτού που σχηματίζει γωνία 90°). Άρα η απόσταση είναι ακριβώς ${perpLength} cm.`
    };
  } else {
    // q2: Επιλογή του ελάχιστου μήκους ανάμεσα σε τρία τμήματα
    const p = [7, 8, 10, 11, 14][getRandomInt(0, 4)];
    const ob1 = p + getRandomInt(2, 4);
    const ob2 = p + getRandomInt(5, 8);
    const lengths = shuffleArray([p, ob1, ob2]);

    return {
      type: 'input',
      correct: p,
      unit: 'cm (απόσταση)',
      prompt: `Από ένα σημείο Σ σχεδιάστηκαν τρία ευθύγραμμα τμήματα προς την ευθεία ε με μήκη ${lengths[0]} cm, ${lengths[1]} cm και ${lengths[2]} cm. Γνωρίζοντας ότι ένα από αυτά είναι το κάθετο τμήμα, πόσα cm είναι η απόσταση του σημείου Σ από την ευθεία;`,
      explanation: `Η απόσταση είναι πάντοτε το ΣΥΝΤΟΜΟΤΕΡΟ (μικρότερο σε μήκος) ευθύγραμμο τμήμα από όλα. Επομένως, η απόσταση είναι το ελάχιστο μήκος: ${p} cm.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Θεμελιώδεις Ιδιότητες & Ορολογία (MCQ)
function makeDistanceTheoryPropertiesQuestion(isPointOnLine = false) {
  if (!isPointOnLine) {
    // q3: Ποιο τμήμα εκφράζει την απόσταση
    const options = [
      'Το κάθετο ευθύγραμμο τμήμα προς την ευθεία',
      'Οποιοδήποτε πλάγιο ευθύγραμμο τμήμα',
      'Το μεγαλύτερο σε μήκος ευθύγραμμο τμήμα',
      'Το ευθύγραμμο τμήμα που σχηματίζει γωνία 45°'
    ];

    return {
      type: 'mcq',
      correct: 'Το κάθετο ευθύγραμμο τμήμα προς την ευθεία',
      options,
      prompt: `Τι ονομάζουμε απόσταση ενός σημείου από μια ευθεία στη γεωμετρία;`,
      explanation: `Απόσταση σημείου από ευθεία ονομάζεται το μήκος του ΚΑΘΕΤΟΥ ευθύγραμμου τμήματος που άγεται από το σημείο προς την ευθεία (και σχηματίζει γωνία 90°).`
    };
  } else {
    // q4: Απόσταση σημείου που βρίσκεται ήδη πάνω στην ευθεία
    const options = shuffleArray(['0 cm', '1 cm', 'Δεν ορίζεται', 'Άπειρη']);

    return {
      type: 'mcq',
      correct: '0 cm',
      options,
      prompt: `Αν ένα σημείο Α ανήκει (βρίσκεται ήδη) πάνω σε μία ευθεία ε, πόση είναι η απόστασή του από την ευθεία αυτή;`,
      explanation: `Όταν το σημείο ανήκει στην ευθεία, συμπίπτει με το ίχνος της κάθετης, επομένως η απόστασή του από αυτήν είναι ακριβώς 0 cm.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Απόσταση Παράλληλων Ευθειών (Input & MCQ)
function makeParallelDistanceQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q5: Σταθερότητα απόστασης παραλλήλων (Input)
    const dist = [4, 6, 8, 10, 15, 20][getRandomInt(0, 5)];

    return {
      type: 'input',
      correct: dist,
      unit: 'cm (απόσταση)',
      prompt: `Δύο ευθείες ε1 και ε2 είναι παράλληλες μεταξύ τους (ε1 // ε2). Σε ένα σημείο Α της ε1, η κάθετη απόστασή του από την ε2 μετρήθηκε ίση με ${dist} cm. Πόσα cm θα είναι η κάθετη απόσταση από ένα άλλο σημείο Β της ε1 προς την ε2;`,
      explanation: `Δύο παράλληλες ευθείες έχουν ΠΑΝΤΟΥ σταθερή και ίση απόσταση σε όλα τα σημεία τους. Άρα η απόσταση είναι και πάλι ακριβώς ${dist} cm.`
    };
  } else {
    // q6: Ιδιότητα απόστασης παράλληλων ευθειών (MCQ)
    const options = [
      'Παραμένει παντού σταθερή και ίση σε όλα τα σημεία τους',
      'Όσο προεκτείνουμε τις ευθείες, η απόστασή τους μικραίνει',
      'Όσο προεκτείνουμε τις ευθείες, η απόστασή τους μεγαλώνει',
      'Εξαρτάται από το πάχος της γραμμίδας'
    ];

    return {
      type: 'mcq',
      correct: 'Παραμένει παντού σταθερή και ίση σε όλα τα σημεία τους',
      options,
      prompt: `Ποια πρόταση είναι μαθηματικά ορθή για την απόσταση δύο παράλληλων ευθειών;`,
      explanation: `Η απόσταση δύο παράλληλων ευθειών παραμένει αυστηρά σταθερή και αμετάβλητη σε οποιοδήποτε σημείο τους κι αν τη μετρήσουμε κάθετα.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετες Εφαρμογές: Ύψος Σχημάτων & Ορθογώνιο (Input & MCQ)
function makeComplexDistanceGeometricProblem(isMCQ = false) {
  if (!isMCQ) {
    // q7: Ύψος τριγώνου ως απόσταση κορυφής από βάση (Input)
    const height = [8, 9, 12, 14, 16][getRandomInt(0, 4)];
    const side1 = height + getRandomInt(2, 4);
    const side2 = height + getRandomInt(5, 7);

    return {
      type: 'input',
      correct: height,
      unit: 'cm (ύψος)',
      prompt: `Σε ένα τρίγωνο ΑΒΓ, οι πλευρές ΑΒ και ΑΓ έχουν μήκη ${side1} cm και ${side2} cm αντίστοιχα. Αν η κάθετη απόσταση της κορυφής Α από την ευθεία της βάσης ΒΓ είναι ${height} cm, πόσο είναι το αντίστοιχο ΥΨΟΣ του τριγώνου;`,
      explanation: `Το ύψος ενός τριγώνου ορίζεται ακριβώς ως η απόσταση (το κάθετο ευθύγραμμο τμήμα) της κορυφής από την ευθεία της απέναντι πλευράς. Άρα το ύψος είναι ${height} cm.`
    };
  } else {
    // q8: Απόσταση απέναντι πλευρών σε ορθογώνιο παραλληλόγραμμο (MCQ)
    const length = 18;
    const width = 10;
    const distractors = [`${length} cm`, `${length + width} cm`, `${Math.round(Math.sqrt(length * length + width * width))} cm`];
    const options = shuffleArray([`${width} cm`, ...distractors]);

    return {
      type: 'mcq',
      correct: `${width} cm`,
      options,
      prompt: `Σε ένα ορθογώνιο παραλληλόγραμμο ΑΒΓΔ με μήκος ΑΒ ＝ ${length} cm και πλάτος ΒΓ ＝ ${width} cm, ποια είναι η απόσταση ανάμεσα στις δύο μεγάλες παράλληλες πλευρές (ΑΒ και ΓΔ);`,
      explanation: `Επειδή οι πλευρές του ορθογωνίου είναι κάθετες μεταξύ τους, η απόσταση ανάμεσα στις πλευρές ΑΒ και ΓΔ ισούται με το μήκος της κάθετης πλευράς (του πλάτους), δηλαδή ακριβώς ${width} cm.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeDistanceIdentificationQuestion(false),
    q2: makeDistanceIdentificationQuestion(true),
    q3: makeDistanceTheoryPropertiesQuestion(false),
    q4: makeDistanceTheoryPropertiesQuestion(true),
    q5: makeParallelDistanceQuestion(false),
    q6: makeParallelDistanceQuestion(true),
    q7: makeComplexDistanceGeometricProblem(false),
    q8: makeComplexDistanceGeometricProblem(true)
  };
}

export default function ApostasiSimeiouEutheiasAskPage() {
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
      title="Ασκήσεις: Απόσταση Σημείου από Ευθεία - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στην απόσταση σημείου από ευθεία: σύγκριση με πλάγια τμήματα, απόσταση παραλλήλων και ύψος γεωμετρικών σχημάτων."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/17-apostasi-simeiou-eutheias"
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
              📝 Ασκήσεις: Απόσταση Σημείου από Ευθεία
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
          {renderInput('q1', questions.q1, 1, 'ΕΝΤΟΠΙΣΜΟΣ ΠΡΑΓΜΑΤΙΚΗΣ ΑΠΟΣΤΑΣΗΣ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΕΛΑΧΙΣΤΟ ΜΗΚΟΣ ΕΥΘΥΓΡΑΜΜΟΥ ΤΜΗΜΑΤΟΣ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΟΡΙΣΜΟΣ ΑΠΟΣΤΑΣΗΣ ΣΗΜΕΙΟΥ ΑΠΟ ΕΥΘΕΙΑ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΣΗΜΕΙΟ ΠΑΝΩ ΣΤΗΝ ΕΥΘΕΙΑ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΑΠΟΣΤΑΣΗ ΠΑΡΑΛΛΗΛΩΝ ΕΥΘΕΙΩΝ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΣΤΑΘΕΡΟΤΗΤΑ ΑΠΟΣΤΑΣΗΣ ΠΑΡΑΛΛΗΛΩΝ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΥΨΟΣ ΤΡΙΓΩΝΟΥ ΩΣ ΚΑΘΕΤΗ ΑΠΟΣΤΑΣΗ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΑΠΟΣΤΑΣΗ ΠΛΕΥΡΩΝ ΣΕ ΟΡΘΟΓΩΝΙΟ', 'bg-purple-600')}

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

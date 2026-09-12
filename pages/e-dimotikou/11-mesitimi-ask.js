// pages/e-dimotikou/11-mesitimi-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Άμεσος Υπολογισμός Μέσης Τιμής (Input)
function makeDirectAverageQuestion(isFourValues = false) {
  if (!isFourValues) {
    // q1: 5 τιμές με ακέραιο μέσο όρο (π.χ. βαθμοί μαθητή)
    const targetAvg = getRandomInt(14, 19);
    const deltas = [-3, -1, 0, 1, 3]; // άθροισμα = 0
    const shuffledDeltas = shuffleArray(deltas);
    const scores = shuffledDeltas.map((d) => targetAvg + d);
    const sum = scores.reduce((a, b) => a + b, 0);

    return {
      type: 'input',
      correct: targetAvg,
      unit: 'βαθμοί',
      prompt: `Ένας μαθητής έγραψε στα 5 διαγωνίσματα του τριμήνου τους εξής βαθμούς: ${scores.join(', ')}. Ποια είναι η μέση τιμή (μέσος όρος) της βαθμολογίας του;`,
      explanation: `Βρίσκουμε το συνολικό άθροισμα: ${scores.join(' ＋ ')} ＝ ${sum}. Διαιρούμε με το πλήθος των διαγωνισμάτων: ${sum} ： 5 ＝ ${targetAvg} βαθμοί.`
    };
  } else {
    // q2: 4 τιμές θερμοκρασίας με ακέραιο μέσο όρο
    const targetAvg = getRandomInt(16, 26);
    const deltas = [-4, -2, 2, 4];
    const shuffledDeltas = shuffleArray(deltas);
    const temps = shuffledDeltas.map((d) => targetAvg + d);
    const sum = temps.reduce((a, b) => a + b, 0);

    return {
      type: 'input',
      correct: targetAvg,
      unit: '°C',
      prompt: `Οι θερμοκρασίες που καταγράφηκαν για 4 διαδοχικές ημέρες ήταν: ${temps.map((t) => `${t}°C`).join(', ')}. Ποια ήταν η μέση θερμοκρασία του τετραημέρου;`,
      explanation: `Αθροίζουμε τις θερμοκρασίες: ${temps.join(' ＋ ')} ＝ ${sum}°C. Διαιρούμε με τις 4 ημέρες: ${sum} ： 4 ＝ ${targetAvg}°C.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Ανάστροφος Υπολογισμός Αθροίσματος & Ιδιότητες Ορίων (MCQ)
function makeReverseAndPropertiesQuestion(isProperties = false) {
  if (!isProperties) {
    // q3: Εύρεση συνολικού ποσού από γνωστό μέσο όρο
    const count = [4, 5, 6, 7][getRandomInt(0, 3)];
    const avgVal = getRandomInt(15, 35) * 2; // π.χ. 40 €
    const totalVal = count * avgVal;

    const distractors = [
      totalVal + avgVal,
      totalVal - avgVal,
      count * (avgVal + 5)
    ].filter((v) => v !== totalVal);

    const options = shuffleArray([totalVal, ...distractors.slice(0, 3)]).map((v) => `${v} €`);

    return {
      type: 'mcq',
      correct: `${totalVal} €`,
      options,
      prompt: `Σε μια παρέα ${count} φίλων, ο μέσος όρος των χρημάτων που ξόδεψε κάθε παιδί είναι ${avgVal} €. Πόσα χρήματα ξόδεψαν συνολικά όλοι μαζί;`,
      explanation: `Το συνολικό άθροισμα προκύπτει πολλαπλασιάζοντας τη μέση τιμή με το πλήθος των παιδιών: ${avgVal} · ${count} ＝ ${totalVal} €.`
    };
  } else {
    // q4: Έλεγχος ορίων μέσης τιμής (πρέπει να βρίσκεται μεταξύ ελαχίστου και μεγίστου)
    const minVal = 12;
    const maxVal = 20;
    const validAvg = 16;
    const invalidOptions = [
      11, // μικρότερο από το min
      21, // μεγαλύτερο από το max
      24  // πολύ μεγαλύτερο
    ];

    const options = shuffleArray([validAvg, ...invalidOptions]).map((v) => `${v} kg`);

    return {
      type: 'mcq',
      correct: `${validAvg} kg`,
      options,
      prompt: `Σε μια αποθήκη, τα βάρη τεσσάρων δεμάτων είναι 12 kg, 15 kg, 17 kg και 20 kg. Χωρίς να κάνεις όλες τις πράξεις, ποια από τις παρακάτω τιμές θα μπορούσε να είναι η μέση τιμή των βαρών;`,
      explanation: `Η μέση τιμή βρίσκεται ΠΑΝΤΑ ανάμεσα στη μικρότερη τιμή (12 kg) και τη μεγαλύτερη τιμή (20 kg). Η μόνη τιμή ανάμεσα στα όρια 12 kg και 20 kg είναι τα ${validAvg} kg.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Εύρεση Άγνωστης Τιμής με Δεδομένο Μέσο Όρο (Input & MCQ)
function makeMissingValueAverageQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q5: Εύρεση βαθμού 4ου μαθήματος (Input)
    const targetAvg = getRandomInt(16, 19);
    const totalNeeded = targetAvg * 4;
    const g1 = getRandomInt(14, targetAvg + 1);
    const g2 = getRandomInt(15, targetAvg + 2);
    const g3 = getRandomInt(14, targetAvg + 1);
    const currentSum = g1 + g2 + g3;
    const neededGrade = totalNeeded - currentSum;

    return {
      type: 'input',
      correct: neededGrade,
      unit: 'βαθμοί',
      prompt: `Η Ελένη έχει βαθμούς ${g1}, ${g2} και ${g3} σε τρία μαθήματα. Τι βαθμό πρέπει να πάρει στο 4ο μάθημα ώστε ο γενικός μέσος όρος της να είναι ακριβώς ${targetAvg};`,
      explanation: `Για μέσο όρο ${targetAvg} σε 4 μαθήματα, το συνολικό άθροισμα πρέπει να είναι: ${targetAvg} · 4 ＝ ${totalNeeded} βαθμοί. Το άθροισμα των 3 πρώτων είναι: ${g1} ＋ ${g2} ＋ ${g3} ＝ ${currentSum}. Άρα στο 4ο μάθημα χρειάζεται: ${totalNeeded} － ${currentSum} ＝ ${neededGrade} βαθμούς.`
    };
  } else {
    // q6: Εύρεση άγνωστης ποσότητας με δοσμένο μέσο όρο 3 ημερών (MCQ)
    const targetAvg = getRandomInt(25, 45);
    const totalNeeded = targetAvg * 3;
    const v1 = targetAvg - getRandomInt(3, 7);
    const v2 = targetAvg + getRandomInt(2, 6);
    const v3 = totalNeeded - (v1 + v2);

    const distractors = [v3 + 3, Math.max(5, v3 - 3), v3 + 6].filter((v) => v !== v3);
    const options = shuffleArray([v3, ...distractors.slice(0, 3)]).map((v) => `${v} σελίδες`);

    return {
      type: 'mcq',
      correct: `${v3} σελίδες`,
      options,
      prompt: `Ένας μαθητής διάβασε ${v1} σελίδες τη Δευτέρα και ${v2} σελίδες την Τρίτη. Πόσες σελίδες διάβασε την Τετάρτη, αν ο μέσος όρος των τριών ημερών ήταν ${targetAvg} σελίδες την ημέρα;`,
      explanation: `Συνολικές σελίδες του τριημέρου: ${targetAvg} · 3 ＝ ${totalNeeded}. Τις δύο πρώτες ημέρες διάβασε: ${v1} ＋ ${v2} ＝ ${v1 + v2}. Άρα την Τετάρτη διάβασε: ${totalNeeded} － ${v1 + v2} ＝ ${v3} σελίδες.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Μέσης Τιμής Πραγματικής Ζωής (Input & MCQ)
function makeComplexAverageWordProblem(isMCQ = false) {
  if (!isMCQ) {
    // q7: Μέση απόσταση / χιλιόμετρα ταξιδιού ανά ημέρα (Input)
    const days = 5;
    const dailyKm = [120, 140, 110, 150, 130];
    const totalKm = dailyKm.reduce((a, b) => a + b, 0);
    const avgKm = totalKm / days;

    return {
      type: 'input',
      correct: avgKm,
      unit: 'km την ημέρα',
      prompt: `Μια οικογένεια σε ένα οδικό ταξίδι ${days} ημερών διένυσε: 1η μέρα ${dailyKm[0]} km, 2η μέρα ${dailyKm[1]} km, 3η μέρα ${dailyKm[2]} km, 4η μέρα ${dailyKm[3]} km και 5η μέρα ${dailyKm[4]} km. Πόσα χιλιόμετρα διένυε κατά μέσο όρο κάθε ημέρα;`,
      explanation: `Συνολικά χιλιόμετρα: ${dailyKm.join(' ＋ ')} ＝ ${totalKm} km. Διαιρούμε με τις ${days} ημέρες: ${totalKm} ： ${days} ＝ ${avgKm} km την ημέρα.`
    };
  } else {
    // q8: Μέσος όρος εισπράξεων καταστήματος (MCQ)
    const count = 4;
    const amounts = [240, 310, 190, 260];
    const total = amounts.reduce((a, b) => a + b, 0); // 1000
    const avg = total / count; // 250

    const distractors = [avg + 20, avg - 25, avg + 50];
    const options = shuffleArray([avg, ...distractors]).map((v) => `${v} €`);

    return {
      type: 'mcq',
      correct: `${avg} €`,
      options,
      prompt: `Ένα μικρό κατάστημα είχε τις εξής εισπράξεις σε 4 ημέρες: ${amounts.map((a) => `${a} €`).join(', ')}. Ποια ήταν η μέση ημερήσια είσπραξη;`,
      explanation: `Συνολικές εισπράξεις: ${amounts.join(' ＋ ')} ＝ ${total} €. Διαιρούμε με τις ${count} ημέρες: ${total} ： ${count} ＝ ${avg} €.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeDirectAverageQuestion(false),
    q2: makeDirectAverageQuestion(true),
    q3: makeReverseAndPropertiesQuestion(false),
    q4: makeReverseAndPropertiesQuestion(true),
    q5: makeMissingValueAverageQuestion(false),
    q6: makeMissingValueAverageQuestion(true),
    q7: makeComplexAverageWordProblem(false),
    q8: makeComplexAverageWordProblem(true)
  };
}

export default function MesiTimiAskPage() {
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
      title="Ασκήσεις: Μέση Τιμή (Μέσος Όρος) - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στη μέση τιμή: υπολογισμός μέσου όρου, εύρεση άγνωστης τιμής και σύνθετα προβλήματα καθημερινής ζωής."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/11-mesitimi"
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
              📝 Ασκήσεις: Μέση Τιμή (Μέσος Όρος)
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
          {renderInput('q1', questions.q1, 1, 'ΜΕΣΟΣ ΟΡΟΣ ΒΑΘΜΟΛΟΓΙΑΣ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΜΕΣΗ ΘΕΡΜΟΚΡΑΣΙΑ ΤΕΤΡΑΗΜΕΡΟΥ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΕΥΡΕΣΗ ΣΥΝΟΛΙΚΟΥ ΠΟΣΟΥ ΑΠΟ ΜΕΣΟ ΟΡΟ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΕΛΕΓΧΟΣ ΟΡΙΩΝ ΜΕΣΗΣ ΤΙΜΗΣ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ ΒΑΘΜΟΥ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΕΥΡΕΣΗ ΑΓΝΩΣΤΗΣ ΠΟΣΟΤΗΤΑΣ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΠΡΟΒΛΗΜΑ ΜΕΣΗΣ ΗΜΕΡΗΣΙΑΣ ΑΠΟΣΤΑΣΗΣ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΠΡΟΒΛΗΜΑ ΜΕΣΩΝ ΕΙΣΠΡΑΞΕΩΝ', 'bg-purple-600')}

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

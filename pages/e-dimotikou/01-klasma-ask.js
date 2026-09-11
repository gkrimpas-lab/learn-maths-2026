// pages/e-dimotikou/01-klasma-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Μέρος Συνόλου & Αντίστροφος Υπολογισμός
function makeSetFractionQuestion(isReverse = false) {
  if (!isReverse) {
    // q1: Υπολογισμός υπολοίπου
    const den = [5, 6, 8, 10][getRandomInt(0, 3)];
    const num = getRandomInt(2, den - 1);
    const multiplier = getRandomInt(6, 12);
    const total = den * multiplier;
    const spent = (total / den) * num;
    const remaining = total - spent;

    return {
      type: 'input',
      total,
      num,
      den,
      correct: remaining,
      unit: 'τριαντάφυλλα',
      prompt: `Ένα ανθοπωλείο παρέλαβε ${total} τριαντάφυλλα. Το πρωί πούλησε τα ${num}/${den} των τριαντάφυλλων. Πόσα τριαντάφυλλα έμειναν απούλητα;`,
      explanation: `Το 1/${den} των ${total} είναι ${total} ： ${den} ＝ ${multiplier}. Τα ${num}/${den} είναι ${multiplier} · ${num} ＝ ${spent} τριαντάφυλλα. Επομένως περίσσεψαν: ${total} － ${spent} ＝ ${remaining} τριαντάφυλλα.`
    };
  } else {
    // q2: Εύρεση αρχικού συνόλου από γνωστό μέρος
    const den = [4, 7, 9, 12][getRandomInt(0, 3)];
    const num = getRandomInt(2, den - 1);
    const step = getRandomInt(8, 16);
    const partValue = num * step;
    const totalValue = den * step;

    return {
      type: 'input',
      num,
      den,
      partValue,
      correct: totalValue,
      unit: 'σελίδες',
      prompt: `Ο Νίκος διάβασε τα ${num}/${den} ενός βιβλίου, δηλαδή ακριβώς ${partValue} σελίδες. Πόσες σελίδες έχει συνολικά ολόκληρο το βιβλίο;`,
      explanation: `Αν τα ${num}/${den} ισούνται με ${partValue} σελίδες, τότε το 1/${den} ισούται με: ${partValue} ： ${num} ＝ ${step} σελίδες. Ολόκληρο το βιβλίο (${den}/${den}) έχει: ${step} · ${den} ＝ ${totalValue} σελίδες.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Καταχρηστικά Κλάσματα, Μεικτοί Αριθμοί & Ακέραιοι
function makeImproperFractionQuestion(isMissingToWhole = false) {
  if (!isMissingToWhole) {
    // q3: Μετατροπή καταχρηστικού σε μεικτό
    const den = [3, 4, 5, 7, 8][getRandomInt(0, 4)];
    const whole = getRandomInt(3, 6);
    const rem = getRandomInt(1, den - 1);
    const num = whole * den + rem;

    return {
      type: 'input',
      num,
      den,
      correct: whole,
      unit: 'ακέραιες μονάδες',
      prompt: `Γράψε το καταχρηστικό κλάσμα ${num}/${den} ως μεικτό αριθμό. Πόσες είναι οι ακέραιες μονάδες του;`,
      explanation: `Εκτελούμε τη διαίρεση ${num} ： ${den} ＝ ${whole} με υπόλοιπο ${rem}. Άρα: ${num}/${den} ＝ ${whole} ＋ ${rem}/${den} (δηλαδή ${whole} ακέραιες μονάδες).`
    };
  } else {
    // q4: Πόσα μέρη λείπουν για τον επόμενο ακέραιο (MCQ)
    const den = [6, 8, 9, 11][getRandomInt(0, 3)];
    const targetWhole = getRandomInt(2, 4);
    const missing = getRandomInt(2, den - 2);
    const currentNum = targetWhole * den - missing;

    const distractors = [
      missing + 1,
      Math.max(1, missing - 1),
      den - missing
    ].filter((d) => d !== missing);

    const options = shuffleArray(
      Array.from(new Set([missing, ...distractors])).slice(0, 4)
    ).map(String);

    return {
      type: 'mcq',
      currentNum,
      den,
      targetWhole,
      correct: String(missing),
      options,
      prompt: `Έχουμε το κλάσμα ${currentNum}/${den}. Πόσα ίσα μέρη (κλάσματα 1/${den}) χρειάζεται να προσθέσουμε για να συμπληρωθεί ακριβώς ο ακέραιος αριθμός ${targetWhole};`,
      explanation: `Ο ακέραιος ${targetWhole} γράφεται ως κλάσμα με παρονομαστή ${den}: ${targetWhole} · ${den} ＝ ${targetWhole * den}/${den}. Επομένως λείπουν: ${targetWhole * den} － ${currentNum} ＝ ${missing} μέρη.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Κλάσμα ως Πηλίκο Διαίρεσης & Ισοδυναμία
function makeQuotientAndEquivQuestion(isEquiv = false) {
  if (!isEquiv) {
    // q5: Μοίρασμα ποσότητας σε δοχεία (MCQ)
    const liters = getRandomInt(5, 11);
    let bottles = getRandomInt(3, 8);
    if (bottles === liters) bottles += 1;

    const correct = `${liters}/${bottles}`;
    const options = shuffleArray([
      `${liters}/${bottles}`,
      `${bottles}/${liters}`,
      `${liters + 1}/${bottles}`,
      `${liters}/${bottles + 1}`
    ]);

    return {
      type: 'mcq',
      liters,
      bottles,
      correct,
      options,
      prompt: `Μοιράζουμε ισότιμα ${liters} L ελαιόλαδου σε ${bottles} ίδια δοχεία. Ποιο κλάσμα εκφράζει την ακριβή ποσότητα λαδιού (σε L) που θα περιέχει κάθε δοχείο;`,
      explanation: `Το κλάσμα εκφράζει το ακριβές πηλίκο της διαίρεσης του αριθμητή διά του παρονομαστή: ${liters} ： ${bottles} ＝ ${liters}/${bottles} L.`
    };
  } else {
    // q6: Εύρεση αγνώστου όρου x
    const baseNum = getRandomInt(2, 5);
    const baseDen = baseNum + getRandomInt(1, 4);
    const factor = getRandomInt(3, 7);
    const targetDen = baseDen * factor;
    const correctX = baseNum * factor;

    return {
      type: 'input',
      baseNum,
      baseDen,
      targetDen,
      correct: correctX,
      unit: 'τιμή του x',
      prompt: `Αν ισχύει η ισότητα κλασμάτων ${baseNum}/${baseDen} ＝ x/${targetDen}, ποιος αριθμός είναι το x;`,
      explanation: `Ο παρονομαστής ${baseDen} πολλαπλασιάστηκε με το ${factor} για να γίνει ${targetDen} (${baseDen} · ${factor} ＝ ${targetDen}). Πολλαπλασιάζουμε και τον αριθμητή: ${baseNum} · ${factor} ＝ ${correctX}.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύγκριση Κλασμάτων με το 1/2 & Σύνθετο Πρόβλημα
function makeComparisonQuestion(isWordProblem = false) {
  if (!isWordProblem) {
    // q7: Σύγκριση με το σημείο αναφοράς 1/2 (MCQ)
    const candidates = [
      { text: '3/8', val: 3 / 8 },
      { text: '4/10', val: 4 / 10 },
      { text: '5/12', val: 5 / 12 },
      { text: '5/8', val: 5 / 8 },
      { text: '2/5', val: 2 / 5 },
      { text: '7/12', val: 7 / 12 }
    ];
    const greater = candidates.filter((c) => c.val > 0.5);
    const lesser = candidates.filter((c) => c.val < 0.5);
    const chosenGreater = greater[getRandomInt(0, greater.length - 1)];
    const chosenLessers = shuffleArray(lesser).slice(0, 3);
    const options = shuffleArray([chosenGreater.text, ...chosenLessers.map((c) => c.text)]);

    return {
      type: 'mcq',
      correct: chosenGreater.text,
      options,
      prompt: `Ποιο από τα παρακάτω κλάσματα είναι μεγαλύτερο από το μισό ( ＞ 1/2 );`,
      explanation: `Ένα κλάσμα είναι μεγαλύτερο από το 1/2 όταν ο αριθμητής του είναι μεγαλύτερος από το μισό του παρονομαστή. Στο ${chosenGreater.text}, ο αριθμητής ξεπερνά το μισό του παρονομαστή.`
    };
  } else {
    // q8: Σύνθετο πρόβλημα σύγκρισης διαδρομών
    const totalKm = 120;
    const kmA = (totalKm / 4) * 3; // 90 km
    const kmB = (totalKm / 5) * 4; // 96 km
    const diff = kmB - kmA; // 6 km

    const options = shuffleArray([
      `${diff} km`,
      `${diff + 4} km`,
      `${diff + 6} km`,
      `${Math.max(2, diff - 2)} km`
    ]);

    return {
      type: 'mcq',
      correct: `${diff} km`,
      options,
      prompt: `Μια διαδρομή έχει μήκος ${totalKm} km. Το πράσινο αυτοκίνητο διένυσε τα 3/4 της διαδρομής, ενώ το μπλε αυτοκίνητο διένυσε τα 4/5 της ίδιας διαδρομής. Πόσα χιλιόμετρα παραπάνω διένυσε το μπλε αυτοκίνητο;`,
      explanation: `Το πράσινο αυτοκίνητο διένυσε: (${totalKm} ： 4) · 3 ＝ 30 · 3 ＝ 90 km. Το μπλε αυτοκίνητο διένυσε: (${totalKm} ： 5) · 4 ＝ 24 · 4 ＝ 96 km. Διαφορά: 96 － 90 ＝ ${diff} km.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeSetFractionQuestion(false),
    q2: makeSetFractionQuestion(true),
    q3: makeImproperFractionQuestion(false),
    q4: makeImproperFractionQuestion(true),
    q5: makeQuotientAndEquivQuestion(false),
    q6: makeQuotientAndEquivQuestion(true),
    q7: makeComparisonQuestion(false),
    q8: makeComparisonQuestion(true)
  };
}

export default function KlasmaAskPage() {
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
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (parseInt(answers.q6, 10) === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
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
      title="Ασκήσεις: Η Έννοια του Κλάσματος - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές διαδραστικές ασκήσεις μαθηματικών Ε' Δημοτικού: μέρος συνόλου, ανάστροφοι υπολογισμοί, μεικτοί αριθμοί και προβλήματα."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/01-klasma"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      {/* Full-width container για 2K / 4K και responsive σε κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8">
        {/* HEADER BANNER - Ίδια χρωματική παλέτα με τη θεωρία */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              Ε΄ ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Η Έννοια του Κλάσματος
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
          {renderInput('q1', questions.q1, 1, 'ΜΕΡΟΣ ΣΥΝΟΛΟΥ ΚΑΙ ΥΠΟΛΟΙΠΟ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΑΝΑΣΤΡΟΦΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΣΥΝΟΛΟΥ', 'bg-blue-600')}

          {renderInput('q3', questions.q3, 3, 'ΚΑΤΑΧΡΗΣΤΙΚΟ ΚΛΑΣΜΑ ΣΕ ΜΕΙΚΤΟ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΣΥΜΠΛΗΡΩΣΗ ΣΤΟΝ ΕΠΟΜΕΝΟ ΑΚΕΡΑΙΟ', 'bg-indigo-600')}

          {renderMCQ('q5', questions.q5, 5, 'ΚΛΑΣΜΑ ΩΣ ΠΗΛΙΚΟ ΔΙΑΙΡΕΣΗΣ', 'bg-teal-600')}
          {renderInput('q6', questions.q6, 6, 'ΕΥΡΕΣΗ ΟΡΟΥ ΙΣΟΔΥΝΑΜΟΥ ΚΛΑΣΜΑΤΟΣ', 'bg-teal-600')}

          {renderMCQ('q7', questions.q7, 7, 'ΣΥΓΚΡΙΣΗ ΜΕ ΤΟ ΜΙΣΟ ( 1/2 )', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΔΙΑΔΡΟΜΩΝ', 'bg-purple-600')}

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

// pages/d-dimotikou/29-posotita-igrou-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// 1. Άσκηση: Ανάγνωση Ογκομετρικού Δοχείου (SVG)
function makeBeakerReadingQuestion(targetML) {
  const maxCapacity = 2000;
  const fillHeight = Math.min(128, (targetML / maxCapacity) * 128);
  const liquidY = 158 - fillHeight;

  const svgBeaker = (
    <div className="w-40 h-40 sm:w-44 sm:h-44 mx-auto my-2">
      <svg className="w-full h-full block select-none" viewBox="0 0 160 180">
        {/* Υγρό */}
        {targetML > 0 && (
          <rect
            x="42"
            y={liquidY}
            width="76"
            height={fillHeight}
            fill="#06b6d4"
            fillOpacity="0.8"
            rx="4"
          />
        )}
        {/* Περίγραμμα Δοχείου */}
        <path
          d="M 40,25 L 40,150 A 10,10 0 0,0 50,160 L 110,160 A 10,10 0 0,0 120,150 L 120,25"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="4"
        />
        <path d="M 35,25 L 125,25" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
        <path d="M 35,25 L 25,20 L 40,35" fill="none" stroke="#38bdf8" strokeWidth="3" />

        {/* Γραμμές διαβάθμισης */}
        <line x1="105" y1="30" x2="118" y2="30" stroke="#f8fafc" strokeWidth="2" />
        <text x="98" y="33" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">
          2.000
        </text>

        <line x1="105" y1="62" x2="118" y2="62" stroke="#f8fafc" strokeWidth="2" />
        <text x="98" y="65" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">
          1.500
        </text>

        <line x1="100" y1="94" x2="118" y2="94" stroke="#fbbf24" strokeWidth="2.5" />
        <text x="95" y="97" textAnchor="end" fill="#fbbf24" fontSize="9" fontWeight="900">
          1 L
        </text>

        <line x1="105" y1="126" x2="118" y2="126" stroke="#f8fafc" strokeWidth="2" />
        <text x="98" y="129" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">
          500
        </text>
      </svg>
    </div>
  );

  return {
    q: 'Παρατήρησε τη στάθμη του υγρού στο ογκομετρικό δοχείο και συμπλήρωσε πόσα χιλιοστόλιτρα (mL) περιέχει:',
    svg: svgBeaker,
    correct: targetML,
    unit: 'mL',
    explainText: `Η στάθμη του υγρού φτάνει ακριβώς στην ένδειξη των ${formatNumber(targetML)} mL.`
  };
}

// 2. Άσκηση: Μετατροπές Μονάδων (L <-> mL)
function makeConversionQuestion(isLtoML) {
  const liters = getRandomInt(2, 9);
  if (isLtoML) {
    const correct = liters * 1000;
    return {
      q: `Πόσα χιλιοστόλιτρα (mL) ισοδυναμούν με ${liters} λίτρα (L);`,
      correct,
      unit: 'mL',
      explainText: `Επειδή 1 L ＝ 1.000 mL, τα ${liters} L είναι: ${liters} · 1.000 ＝ ${formatNumber(correct)} mL.`
    };
  } else {
    const ml = liters * 1000;
    return {
      q: `Πόσα λίτρα (L) ισοδυναμούν με ${formatNumber(ml)} χιλιοστόλιτρα (mL);`,
      correct: liters,
      unit: 'L',
      explainText: `Επειδή 1.000 mL ＝ 1 L, διαιρούμε με το 1.000: ${formatNumber(ml)} ： 1.000 ＝ ${liters} L.`
    };
  }
}

// 3. Άσκηση: Κλασματικά Μέρη του Λίτρου (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
const FRACTION_POOL = [
  {
    q: 'Πόσα χιλιοστόλιτρα (mL) περιέχει το μισό λίτρο (1/2 L);',
    correct: '500 mL',
    wrongs: ['250 mL', '100 mL', '750 mL'],
    explainText: 'Το μισό λίτρο ισούται με 1.000 ： 2 ＝ 500 mL.'
  },
  {
    q: 'Πόσα χιλιοστόλιτρα (mL) περιέχει το ένα τέταρτο του λίτρου (1/4 L);',
    correct: '250 mL',
    wrongs: ['500 mL', '400 mL', '750 mL'],
    explainText: 'Το ένα τέταρτο του λίτρου ισούται με 1.000 ： 4 ＝ 250 mL.'
  },
  {
    q: 'Πόσα χιλιοστόλιτρα (mL) περιέχουν τα τρία τέταρτα του λίτρου (3/4 L);',
    correct: '750 mL',
    wrongs: ['500 mL', '250 mL', '800 mL'],
    explainText: 'Τα τρία τέταρτα του λίτρου είναι: 3 · 250 mL ＝ 750 mL.'
  },
  {
    q: 'Πόσα χιλιοστόλιτρα (mL) αντιστοιχούν σε 1,5 λίτρο (ένα και μισό λίτρο);',
    correct: '1.500 mL',
    wrongs: ['1.050 mL', '1.250 mL', '2.000 mL'],
    explainText: 'Έχουμε 1 L ＝ 1.000 mL και μισό λίτρο ＝ 500 mL, άρα 1.000 ＋ 500 ＝ 1.500 mL.'
  }
];

// 4. Άσκηση: Προβλήματα Καθημερινότητας (Input)
const WORD_PROBLEMS_POOL = [
  () => {
    const cans = getRandomInt(2, 5);
    const capacity = 250;
    const total = cans * capacity;
    return {
      q: `Ένα παιδί ήπιε ${cans} ποτήρια χυμό των ${capacity} mL το καθένα. Πόσα χιλιοστόλιτρα (mL) χυμό ήπιε συνολικά;`,
      correct: total,
      unit: 'mL',
      explainText: `Υπολογίζουμε: ${cans} · ${capacity} mL ＝ ${formatNumber(total)} mL συνολικά.`
    };
  },
  () => {
    const bottles = getRandomInt(2, 6);
    const bottleCap = 500;
    const totalML = bottles * bottleCap;
    const totalL = totalML / 1000;
    return {
      q: `Αν γεμίσουμε ${bottles} μπουκαλάκια νερό των ${bottleCap} mL (μισού λίτρου) το καθένα, πόσα χιλιοστόλιτρα (mL) νερό έχουμε συνολικά;`,
      correct: totalML,
      unit: 'mL',
      explainText: `Υπολογίζουμε: ${bottles} · ${bottleCap} mL ＝ ${formatNumber(totalML)} mL (δηλαδή ${totalL} λίτρα).`
    };
  },
  () => {
    const liters = getRandomInt(2, 5);
    const totalML = liters * 1000;
    const glass = 250;
    const totalGlasses = totalML / glass;
    return {
      q: `Έχουμε μια κανάτα με ${liters} λίτρα πορτοκαλάδα. Πόσα ποτήρια των ${glass} mL (1/4 L) μπορούμε να γεμίσουμε;`,
      correct: totalGlasses,
      unit: 'ποτήρια',
      explainText: `Μετατρέπουμε τα λίτρα σε mL: ${liters} L ＝ ${formatNumber(totalML)} mL. Στη συνέχεια διαιρούμε: ${formatNumber(totalML)} ： ${glass} ＝ ${totalGlasses} ποτήρια.`
    };
  },
  () => {
    const count = getRandomInt(2, 4);
    const canML = 330;
    const total = count * canML;
    return {
      q: `Αγοράσαμε ${count} κουτάκια αναψυκτικού των ${canML} mL το καθένα. Πόσα χιλιοστόλιτρα (mL) αναψυκτικού περιέχουν όλα μαζί;`,
      correct: total,
      unit: 'mL',
      explainText: `Υπολογίζουμε: ${count} · ${canML} mL ＝ ${formatNumber(total)} mL συνολικά.`
    };
  }
];

// Δημιουργία 8 Μοναδικών Ερωτήσεων
function generateQuestions() {
  const beakerLevels = [500, 1000, 1500, 2000].sort(() => Math.random() - 0.5);
  const q1 = makeBeakerReadingQuestion(beakerLevels[0]);
  const q2 = makeBeakerReadingQuestion(beakerLevels[1]);

  const q3 = makeConversionQuestion(true);
  const q4 = makeConversionQuestion(false);

  const shuffledFractions = [...FRACTION_POOL].sort(() => Math.random() - 0.5);
  const makeFractionMCQ = (item) => {
    const options = [item.correct, ...item.wrongs].sort(() => Math.random() - 0.5);
    return {
      q: item.q,
      options,
      correct: item.correct,
      explainText: item.explainText
    };
  };
  const q5 = makeFractionMCQ(shuffledFractions[0]);
  const q6 = makeFractionMCQ(shuffledFractions[1]);

  const shuffledProblems = [...WORD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
  const q7 = shuffledProblems[0]();
  const q8 = shuffledProblems[1]();

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function PosotitaIgrouAskPage() {
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
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (parseInt(answers.q7, 10) === questions.q7.correct) currentScore += 1;
    if (parseInt(answers.q8, 10) === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Input Number Ασκήσεων (Q1, Q2, Q3, Q4, Q7, Q8)
  const renderInputNumber = (qKey, qData, numLabel, colorClass, placeholderText, suffixUnit) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className={`${colorClass} text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}>
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        {qData.svg && (
          <div className="bg-slate-950 p-4 rounded-2xl w-fit mx-auto mb-4 border border-slate-800 shadow-inner">
            {qData.svg}
          </div>
        )}

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">Αποτέλεσμα:</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={placeholderText}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-cyan-950 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none shadow-sm"
            />
            {suffixUnit && (
              <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">
                {suffixUnit}
              </span>
            )}
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η σωστή απάντηση είναι <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)} {suffixUnit || ''}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render MCQ (Q5 & Q6, 4 Επιλογές)
  const renderMCQQuestion = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-teal-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/80 font-bold text-teal-950 shadow-sm'
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
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500 shrink-0"
                />
                <span className="leading-snug font-bold text-sm sm:text-base font-mono">{opt}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η σωστή απάντηση είναι: <strong className="font-mono font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Μέτρηση Ποσότητας Υγρού (L & mL) | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στη χωρητικότητα και τη μέτρηση υγρών: ανάγνωση ογκομετρικού δοχείου, μετατροπές λίτρων και χιλιοστολίτρων και κλασματικά μέρη."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/29-posotita-igrou"
          className="bg-cyan-100 hover:bg-cyan-200 text-cyan-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Μέτρηση Ποσότητας Υγρού (L & mL)
            </h1>
            <p className="text-cyan-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», τα ογκομετρικά δοχεία, οι μετατροπές και τα προβλήματα ανανεώνονται αυτόματα!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-cyan-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderInputNumber('q1', questions.q1, 1, 'bg-cyan-600', 'mL', questions.q1.unit)}
          {renderInputNumber('q2', questions.q2, 2, 'bg-cyan-600', 'mL', questions.q2.unit)}

          {renderInputNumber('q3', questions.q3, 3, 'bg-blue-600', 'Αποτέλεσμα', questions.q3.unit)}
          {renderInputNumber('q4', questions.q4, 4, 'bg-blue-600', 'Αποτέλεσμα', questions.q4.unit)}

          {renderMCQQuestion('q5', questions.q5, 5)}
          {renderMCQQuestion('q6', questions.q6, 6)}

          {renderInputNumber('q7', questions.q7, 7, 'bg-emerald-600', 'Αποτέλεσμα', questions.q7.unit)}
          {renderInputNumber('q8', questions.q8, 8, 'bg-emerald-600', 'Αποτέλεσμα', questions.q8.unit)}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 Έλεγχος Απαντήσεων
              </button>
            </div>
          )}
        </form>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                Επιτυχία: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

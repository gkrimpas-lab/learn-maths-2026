import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ & ΔΕΔΟΜΕΝΑ --- //

const POLYGON_DATA = {
  3: { name: 'Τρίγωνο', singularAcc: 'τρίγωνο', desc: '3 πλευρές, 3 κορυφές και 3 γωνίες' },
  4: { name: 'Τετράπλευρο (Τετράγωνο)', singularAcc: 'τετράπλευρο', desc: '4 πλευρές, 4 κορυφές και 4 γωνίες' },
  5: { name: 'Πεντάγωνο', singularAcc: 'πεντάγωνο', desc: '5 πλευρές, 5 κορυφές και 5 γωνίες' },
  6: { name: 'Εξάγωνο', singularAcc: 'εξάγωνο', desc: '6 πλευρές, 6 κορυφές και 6 γωνίες' },
  7: { name: 'Επτάγωνο', singularAcc: 'επτάγωνο', desc: '7 πλευρές, 7 κορυφές και 7 γωνίες' },
  8: { name: 'Οκτάγωνο', singularAcc: 'οκτάγωνο', desc: '8 πλευρές, 8 κορυφές και 8 γωνίες' }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Παραγωγή σημείων SVG για κανονικό πολύγωνο
function generateSvgPoints(sides, radius = 54, centerX = 75, centerY = 75) {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = Math.round((centerX + radius * Math.cos(angle)) * 10) / 10;
    const y = Math.round((centerY + radius * Math.sin(angle)) * 10) / 10;
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

// 1. Άσκηση MCQ: Αναγνώριση Πολυγώνου από SVG (ΟΜΑΔΑ Α - 4 Επιλογές)
function makeIdentifyQuestion() {
  const sides = getRandomInt(3, 8);
  const correctName = POLYGON_DATA[sides].name;

  const candidateSides = [3, 4, 5, 6, 7, 8].filter((s) => s !== sides);
  candidateSides.sort(() => Math.random() - 0.5);

  const wrongSides = candidateSides.slice(0, 3);
  const options = [
    { text: correctName, isCorrect: true },
    { text: POLYGON_DATA[wrongSides[0]].name, isCorrect: false },
    { text: POLYGON_DATA[wrongSides[1]].name, isCorrect: false },
    { text: POLYGON_DATA[wrongSides[2]].name, isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  return {
    sides,
    options,
    correct: correctName,
    desc: POLYGON_DATA[sides].desc
  };
}

// 2. Άσκηση: Πλήθος Στοιχείων Πολυγώνου (Πλευρές / Κορυφές / Γωνίες)
function makeCountQuestion() {
  const sides = getRandomInt(3, 8);
  const polyObj = POLYGON_DATA[sides];
  const features = [
    { label: 'πλευρές', singular: 'πλευρά' },
    { label: 'κορυφές', singular: 'κορυφή' },
    { label: 'γωνίες', singular: 'γωνία' }
  ];
  const chosenFeature = features[getRandomInt(0, features.length - 1)];

  return {
    sides,
    polyName: polyObj.name,
    featureLabel: chosenFeature.label,
    correct: sides
  };
}

// 3. Άσκηση: Υπολογισμός Περιμέτρου
function makePerimeterQuestion() {
  const sides = getRandomInt(3, 8);
  const sideLength = getRandomInt(3, 15);
  const polyName = POLYGON_DATA[sides].name;

  return {
    sides,
    sideLength,
    polyName,
    correct: sides * sideLength
  };
}

// 4. Άσκηση: Εύρεση Μήκους Πλευράς από την Περίμετρο
function makeSideFromPerimeterQuestion() {
  const sides = getRandomInt(3, 8);
  const sideLength = getRandomInt(4, 16);
  const perimeter = sides * sideLength;
  const polyName = POLYGON_DATA[sides].name;

  return {
    sides,
    perimeter,
    polyName,
    correct: sideLength
  };
}

// Δημιουργία των 8 Ερωτήσεων της ενότητας
function generateQuestions() {
  return {
    q1: makeIdentifyQuestion(),
    q2: makeIdentifyQuestion(),
    q3: makeCountQuestion(),
    q4: makeCountQuestion(),
    q5: makePerimeterQuestion(),
    q6: makePerimeterQuestion(),
    q7: makeSideFromPerimeterQuestion(),
    q8: makeSideFromPerimeterQuestion()
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

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/\D/g, '');
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    if (answers.q1 === questions.q1.correct) currentScore += 1;
    if (answers.q2 === questions.q2.correct) currentScore += 1;
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (parseInt(answers.q6, 10) === questions.q6.correct) currentScore += 1;
    if (parseInt(answers.q7, 10) === questions.q7.correct) currentScore += 1;
    if (parseInt(answers.q8, 10) === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Q1 & Q2: Αναγνώριση Πολυγώνου
  const renderIdentify = (qKey, qData, numLabel) => {
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
            Πώς ονομάζεται το παρακάτω κανονικό πολύγωνο με βάση το πλήθος των πλευρών του;
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5 sm:pl-11">
          {/* SVG Container με ασφαλές scaling */}
          <div className="bg-slate-950 p-3 rounded-2xl shadow-inner flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36 shrink-0 border border-slate-800">
            <svg className="w-full h-full block select-none" viewBox="0 0 150 150">
              <polygon
                points={generateSvgPoints(qData.sides)}
                fill="rgba(20, 184, 166, 0.25)"
                stroke="#2dd4bf"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* 4 Επιλογές (ΟΜΑΔΑ Α) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
            {qData.options.map((opt, idx) => {
              const isSelected = answers[qKey] === opt.text;
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
                    value={opt.text}
                    checked={isSelected}
                    onChange={() => handleInputChange(qKey, opt.text)}
                    disabled={submitted}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 shrink-0"
                  />
                  <span className="leading-snug">{opt.text}</span>
                </label>
              );
            })}
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                Το γεωμετρικό σχήμα διαθέτει ακριβώς {qData.sides} πλευρές, συνεπώς είναι ένα {qData.correct.toLowerCase()} ({qData.desc}).
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Μετρώντας προσεκτικά τις πλευρές διαπιστώνουμε ότι είναι {qData.sides}, επομένως το σωστό όνομα είναι «<strong className="font-bold text-rose-900">{qData.correct}</strong>».
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Πλήθος Στοιχείων
  const renderCount = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-indigo-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            Πόσες <span className="text-indigo-600 font-extrabold">{qData.featureLabel}</span> έχει συνολικά ένα κανονικό <span className="text-indigo-600 font-extrabold">{qData.polyName}</span>;
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            id={`input-${qKey}`}
            name={`input-${qKey}`}
            placeholder="Γράψε τον αριθμό (π.χ. 5)"
            value={answers[qKey]}
            onChange={(e) => handleNumericInput(qKey, e.target.value)}
            disabled={submitted}
            className="w-full sm:w-80 p-3 rounded-2xl border border-slate-300 font-mono text-base sm:text-lg font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-xs placeholder:font-normal placeholder:text-slate-400 bg-slate-50/50"
          />
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                Σε κάθε πολύγωνο, το πλήθος των πλευρών, των κορυφών και των γωνιών είναι πάντοτε ίσο μεταξύ του (εδώ: {qData.correct}).
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Ένα {qData.polyName} έχει ακριβώς <span className="font-mono font-bold text-rose-900">{qData.correct}</span> {qData.featureLabel}.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Περίμετρος
  const renderPerimeter = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-amber-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            Ένα κανονικό <span className="text-amber-600 font-extrabold">{qData.polyName}</span> έχει κάθε πλευρά του ίση με <span className="text-amber-600 font-mono font-black text-lg">{qData.sideLength} εκ.</span> Πόση είναι η περίμετρός του;
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="Γράψε την περίμετρο"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-full sm:w-80 p-3 rounded-2xl border border-slate-300 font-mono text-base sm:text-lg font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-xs placeholder:font-normal placeholder:text-slate-400 bg-slate-50/50"
            />
            <span className="font-bold text-slate-600 text-sm sm:text-base">εκ.</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                Η περίμετρος προκύπτει πολλαπλασιάζοντας το πλήθος των ίσων πλευρών με το μήκος της καθεμίας: {qData.sides} · {qData.sideLength} εκ. ＝ <span className="font-mono font-bold">{qData.correct} εκ.</span>
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Εφόσον όλες οι πλευρές είναι ίσες, η περίμετρος ισούται με {qData.sides} · {qData.sideLength} εκ. ＝ <span className="font-mono font-bold text-rose-900">{qData.correct} εκ.</span>
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Εύρεση Μήκους Πλευράς
  const renderSideFromPerimeter = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-purple-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            Η περίμετρος ενός κανονικού <span className="text-purple-600 font-extrabold">{qData.polyName}</span> είναι <span className="text-purple-600 font-mono font-black text-lg">{qData.perimeter} εκ.</span> Πόσο είναι το μήκος κάθε πλευράς του;
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="Γράψε το μήκος της πλευράς"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-full sm:w-80 p-3 rounded-2xl border border-slate-300 font-mono text-base sm:text-lg font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-xs placeholder:font-normal placeholder:text-slate-400 bg-slate-50/50"
            />
            <span className="font-bold text-slate-600 text-sm sm:text-base">εκ.</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                Διαιρώντας τη συνολική περίμετρο με το πλήθος των ίσων πλευρών βρίσκουμε το μήκος της πλευράς: {qData.perimeter} ÷ {qData.sides} ＝ <span className="font-mono font-bold">{qData.correct} εκ.</span>
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Κάθε πλευρά υπολογίζεται από τη διαίρεση της περιμέτρου δια του αριθμού των πλευρών: {qData.perimeter} ÷ {qData.sides} ＝ <span className="font-mono font-bold text-rose-900">{qData.correct} εκ.</span>
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Τα Πολύγωνα | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στα πολύγωνα: αναγνώριση σχημάτων, πλήθος πλευρών και υπολογισμός περιμέτρου."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/2-poligona"
          className="bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-teal-500 via-emerald-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📐 Ασκήσεις: Τα Πολύγωνα
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», τα σχήματα και οι αριθμοί ανανεώνονται αυτόματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-teal-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderIdentify('q1', questions.q1, 1)}
          {renderIdentify('q2', questions.q2, 2)}

          {renderCount('q3', questions.q3, 3)}
          {renderCount('q4', questions.q4, 4)}

          {renderPerimeter('q5', questions.q5, 5)}
          {renderPerimeter('q6', questions.q6, 6)}

          {renderSideFromPerimeter('q7', questions.q7, 7)}
          {renderSideFromPerimeter('q8', questions.q8, 8)}

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

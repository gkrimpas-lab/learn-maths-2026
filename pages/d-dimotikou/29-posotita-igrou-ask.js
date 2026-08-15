import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// 1. Άσκηση: Ανάγνωση Ογκομετρικού Δοχείου (SVG)
function makeBeakerReadingQuestion(targetML) {
  const maxCapacity = 2000;
  const fillHeight = Math.min(128, (targetML / maxCapacity) * 128);
  const liquidY = 158 - fillHeight;

  const svgBeaker = (
    <div className="w-44 h-44 mx-auto my-2">
      <svg className="w-full h-full" viewBox="0 0 160 180">
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
        <path d="M 40,25 L 40,150 A 10,10 0 0,0 50,160 L 110,160 A 10,10 0 0,0 120,150 L 120,25" fill="none" stroke="#38bdf8" strokeWidth="4" />
        <path d="M 35,25 L 125,25" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
        <path d="M 35,25 L 25,20 L 40,35" fill="none" stroke="#38bdf8" strokeWidth="3" />

        {/* Γραμμές διαβάθμισης */}
        <line x1="105" y1="30" x2="118" y2="30" stroke="#f8fafc" strokeWidth="2" />
        <text x="98" y="33" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">2.000</text>

        <line x1="105" y1="62" x2="118" y2="62" stroke="#f8fafc" strokeWidth="2" />
        <text x="98" y="65" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">1.500</text>

        <line x1="100" y1="94" x2="118" y2="94" stroke="#fbbf24" strokeWidth="2.5" />
        <text x="95" y="97" textAnchor="end" fill="#fbbf24" fontSize="9" fontWeight="900">1 L</text>

        <line x1="105" y1="126" x2="118" y2="126" stroke="#f8fafc" strokeWidth="2" />
        <text x="98" y="129" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">500</text>
      </svg>
    </div>
  );

  return {
    q: 'Κοίταξε τη στάθμη του υγρού στο ογκομετρικό δοχείο και γράψε πόσα χιλιοστόλιτρα (mL) περιέχει:',
    svg: svgBeaker,
    correct: targetML,
    explain: `Η στάθμη του υγρού φτάνει ακριβώς στα ${formatNumber(targetML)} mL.`
  };
}

// 2. Άσκηση: Μετατροπές Μονάδων (L <-> mL)
function makeConversionQuestion(isLtoML) {
  if (isLtoML) {
    const liters = getRandomInt(2, 9);
    const correct = liters * 1000;
    return {
      q: `Πόσα χιλιοστόλιτρα (mL) είναι τα ${liters} λίτρα (L);`,
      correct,
      explain: `1 L = 1.000 mL, επομένως τα ${liters} L είναι ${liters} × 1.000 = ${formatNumber(correct)} mL.`
    };
  } else {
    const liters = getRandomInt(2, 9);
    const ml = liters * 1000;
    return {
      q: `Πόσα λίτρα (L) είναι τα ${formatNumber(ml)} χιλιοστόλιτρα (mL);`,
      correct: liters,
      explain: `${formatNumber(ml)} mL : 1.000 = ${liters} L.`
    };
  }
}

// 3. Άσκηση: Κλασματικά Μέρη του Λίτρου (MCQ)
const FRACTION_POOL = [
  {
    q: 'Πόσα χιλιοστόλιτρα (mL) είναι το μισό λίτρο (1/2 L);',
    correct: '500 mL',
    wrongs: ['250 mL', '100 mL', '750 mL'],
    explain: 'Το μισό λίτρο είναι 1.000 : 2 = 500 mL.'
  },
  {
    q: 'Πόσα χιλιοστόλιτρα (mL) είναι το ένα τέταρτο του λίτρου (1/4 L);',
    correct: '250 mL',
    wrongs: ['500 mL', '400 mL', '750 mL'],
    explain: 'Το ένα τέταρτο του λίτρου είναι 1.000 : 4 = 250 mL.'
  },
  {
    q: 'Πόσα χιλιοστόλιτρα (mL) είναι τα τρία τέταρτα του λίτρου (3/4 L);',
    correct: '750 mL',
    wrongs: ['500 mL', '250 mL', '800 mL'],
    explain: 'Τα τρία τέταρτα του λίτρου είναι 3 × 250 mL = 750 mL.'
  },
  {
    q: 'Πόσα χιλιοστόλιτρα (mL) είναι το 1,5 λίτρο (ένα και μισό λίτρο);',
    correct: '1.500 mL',
    wrongs: ['1.050 mL', '1.250 mL', '2.000 mL'],
    explain: '1 L = 1.000 mL και μισό L = 500 mL, άρα 1.000 + 500 = 1.500 mL.'
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
      explain: `${cans} × ${capacity} mL = ${formatNumber(total)} mL συνολικά.`
    };
  },
  () => {
    const bottles = getRandomInt(2, 6);
    const bottleCap = 500;
    const totalML = bottles * bottleCap;
    const totalL = totalML / 1000;
    return {
      q: `Αν γεμίσουμε ${bottles} μπουκαλάκια νερό των ${bottleCap} mL (μισού λίτρου), πόσα χιλιοστόλιτρα (mL) νερό έχουμε συνολικά;`,
      correct: totalML,
      explain: `${bottles} × ${bottleCap} mL = ${formatNumber(totalML)} mL (δηλαδή ${totalL} λίτρα).`
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
      explain: `${liters} L = ${formatNumber(totalML)} mL. ${formatNumber(totalML)} : ${glass} = ${totalGlasses} ποτήρια.`
    };
  },
  () => {
    const count = getRandomInt(2, 4);
    const canML = 330;
    const total = count * canML;
    return {
      q: `Αγοράσαμε ${count} κουτάκια αναψυκτικού των ${canML} mL. Πόσα χιλιοστόλιτρα (mL) αναψυκτικού περιέχουν όλα μαζί;`,
      correct: total,
      explain: `${count} × ${canML} mL = ${formatNumber(total)} mL.`
    };
  }
];

// Δημιουργία 8 Μοναδικών Ερωτήσεων
function generateQuestions() {
  // 1. Q1 & Q2: Διαφορετικά Beakers (π.χ. 500, 1000, 1500, 2000)
  const beakerLevels = [500, 1000, 1500, 2000].sort(() => Math.random() - 0.5);
  const q1 = makeBeakerReadingQuestion(beakerLevels[0]);
  const q2 = makeBeakerReadingQuestion(beakerLevels[1]);

  // 2. Q3 & Q4: Μετατροπές (1 L->mL και 1 mL->L)
  const q3 = makeConversionQuestion(true);
  const q4 = makeConversionQuestion(false);

  // 3. Q5 & Q6: Κλασματικά Μέρη (MCQ χωρίς επανάληψη)
  const shuffledFractions = [...FRACTION_POOL].sort(() => Math.random() - 0.5);
  const makeFractionMCQ = (item) => {
    const options = [item.correct, ...item.wrongs].sort(() => Math.random() - 0.5);
    return {
      q: item.q,
      options,
      correct: item.correct,
      explain: item.explain
    };
  };
  const q5 = makeFractionMCQ(shuffledFractions[0]);
  const q6 = makeFractionMCQ(shuffledFractions[1]);

  // 4. Q7 & Q8: Προβλήματα Καθημερινότητας (Input χωρίς επανάληψη)
  const shuffledProblems = [...WORD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
  const q7 = shuffledProblems[0]();
  const q8 = shuffledProblems[1]();

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function PosotitaIgrouAskPage() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
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
    setAnswers(prev => ({ ...prev, [key]: val }));
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
  const renderInputNumber = (qKey, qData, numLabel, colorClass, placeholderText) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`${colorClass} text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center`}>{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">{qData.q}</h3>
      </div>

      {qData.svg && (
        <div className="bg-slate-900 p-4 rounded-2xl w-fit mx-auto mb-5 shadow-inner border border-slate-700">
          {qData.svg}
        </div>
      )}

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2">
          <input 
            type="number"
            placeholder={placeholderText}
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. {qData.explain}</p>
          )}
        </div>
      )}
    </div>
  );

  // Render MCQ (Q5 & Q6)
  const renderMCQQuestion = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-teal-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">{qData.q}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt 
                ? 'border-teal-600 bg-teal-50/80 font-bold text-teal-900' 
                : 'border-gray-200 hover:bg-gray-50 text-gray-800'
            }`}
          >
            <input 
              type="radio" 
              name={qKey} 
              value={opt}
              checked={answers[qKey] === opt}
              onChange={() => handleInputChange(qKey, opt)}
              disabled={submitted}
              className="w-5 h-5 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm md:text-base font-bold font-mono">{opt}</span>
          </label>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. {qData.explain}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>🥛 Ασκήσεις: Μέτρηση Ποσότητας Υγρού - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/d-dimotikou/29-posotita-igrou" className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
                <span>📖</span> Θεωρία
              </Link>
              <button 
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10 space-y-8`}>
          
          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Μέτρηση Ποσότητας Υγρού (L & mL)
              </h1>
              <p className="text-cyan-100 text-sm md:text-base mt-1">
                8 Μοναδικές ασκήσεις με ογκομετρικά δοχεία και μετατροπές! Πατώντας **«Νέες Ασκήσεις»** τα δεδομένα αλλάζουν αυτόματα.
              </p>
            </div>

            <button
              onClick={loadNewQuestions}
              className="bg-white text-gray-900 font-black px-5 py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition transform active:scale-95 text-sm whitespace-nowrap"
            >
              🔄 Αλλαγή Αριθμών
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {renderInputNumber('q1', questions.q1, 1, 'bg-cyan-600', 'Γράψε τα mL')}
            {renderInputNumber('q2', questions.q2, 2, 'bg-cyan-600', 'Γράψε τα mL')}

            {renderInputNumber('q3', questions.q3, 3, 'bg-blue-600', 'Γράψε τον αριθμό')}
            {renderInputNumber('q4', questions.q4, 4, 'bg-blue-600', 'Γράψε τον αριθμό')}

            {renderMCQQuestion('q5', questions.q5, 5)}
            {renderMCQQuestion('q6', questions.q6, 6)}

            {renderInputNumber('q7', questions.q7, 7, 'bg-emerald-600', 'Γράψε το αποτέλεσμα')}
            {renderInputNumber('q8', questions.q8, 8, 'bg-emerald-600', 'Γράψε το αποτέλεσμα')}

            {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
            {!submitted && (
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
                >
                  🎯 Έλεγχος Απαντήσεων
                </button>
              </div>
            )}

          </form>

        </main>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-4 px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-3`}>
          
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-sm font-bold text-slate-300">
                Ποσοστό Επιτυχίας: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                <span>🔄</span> Παίξε ξανά με νέες ασκήσεις!
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden md:block">
                Συμπλήρωσε όλες τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

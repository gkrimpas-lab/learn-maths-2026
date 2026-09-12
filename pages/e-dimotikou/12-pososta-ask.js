// pages/e-dimotikou/12-pososta-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Υπολογισμός Ποσοστού επί Ποσού & Μετατροπή Κλάσματος σε Ποσοστό (Input)
function makeDirectCalculationQuestion(isFractionToPct = false) {
  if (!isFractionToPct) {
    // q1: Υπολογισμός ποσοστού επί ποσού (π.χ. 25% των 360 €)
    const pcts = [15, 20, 25, 30, 35, 40, 50];
    const pct = pcts[getRandomInt(0, pcts.length - 1)];
    const baseAmounts = [120, 160, 200, 240, 280, 320, 360, 400, 500];
    const amount = baseAmounts[getRandomInt(0, baseAmounts.length - 1)];
    const correctVal = Math.round((amount * pct) / 100);

    return {
      type: 'input',
      correct: correctVal,
      unit: '€',
      prompt: `Υπολόγισε το ${pct}% του χρηματικού ποσού των ${amount} €:`,
      explanation: `Πολλαπλασιάζουμε το ποσό με το ποσοστό και διαιρούμε με το 100: (${amount} · ${pct}) ： 100 ＝ ${amount * pct} ： 100 ＝ ${correctVal} €.`
    };
  } else {
    // q2: Μετατροπή κλάσματος σε ποσοστό (π.χ. 3/20 -> 15%)
    const fractionBases = [
      { num: 3, den: 20, mult: 5, pct: 15 },
      { num: 7, den: 20, mult: 5, pct: 35 },
      { num: 9, den: 20, mult: 5, pct: 45 },
      { num: 7, den: 25, mult: 4, pct: 28 },
      { num: 12, den: 25, mult: 4, pct: 48 },
      { num: 18, den: 25, mult: 4, pct: 72 },
      { num: 13, den: 50, mult: 2, pct: 26 },
      { num: 27, den: 50, mult: 2, pct: 54 }
    ];
    const item = fractionBases[getRandomInt(0, fractionBases.length - 1)];

    return {
      type: 'input',
      correct: item.pct,
      unit: '%',
      prompt: `Γράψε το κλάσμα ${item.num}/${item.den} ως ποσοστό στα εκατό ( % ):`,
      explanation: `Διαπλατύνουμε το κλάσμα ώστε να αποκτήσει παρονομαστή το 100: (${item.num} · ${item.mult}) / (${item.den} · ${item.mult}) ＝ ${item.pct}/100 ＝ ${item.pct}%.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Μετατροπές Τριπλής Μορφής (MCQ)
function makeTripleFormQuestion(isPctToFraction = false) {
  if (!isPctToFraction) {
    // q3: Ποσοστό σε δεκαδικό αριθμό
    const pairs = [
      { pct: 8, dec: '0,08', fake: ['0,8', '0,008', '8,0'] },
      { pct: 14, dec: '0,14', fake: ['1,4', '0,014', '0,41'] },
      { pct: 35, dec: '0,35', fake: ['3,5', '0,035', '0,53'] },
      { pct: 75, dec: '0,75', fake: ['7,5', '0,075', '0,57'] },
      { pct: 5, dec: '0,05', fake: ['0,5', '0,005', '5,0'] }
    ];
    const item = pairs[getRandomInt(0, pairs.length - 1)];
    const options = shuffleArray([item.dec, ...item.fake]);

    return {
      type: 'mcq',
      correct: item.dec,
      options,
      prompt: `Ποιος δεκαδικός αριθμός αντιστοιχεί ακριβώς στο ποσοστό ${item.pct}%;`,
      explanation: `Για να μετατρέψουμε ποσοστό σε δεκαδικό αριθμό, διαιρούμε με το 100 (μετακινούμε την υποδιαστολή δύο θέσεις αριστερά): ${item.pct}% ＝ ${item.pct} ： 100 ＝ ${item.dec}.`
    };
  } else {
    // q4: Ποσοστό σε ανάγωγο κλάσμα
    const fractions = [
      { pct: 20, frac: '1/5', fake: ['2/5', '1/4', '1/10'] },
      { pct: 25, frac: '1/4', fake: ['2/5', '1/5', '3/8'] },
      { pct: 40, frac: '2/5', fake: ['4/5', '1/4', '3/10'] },
      { pct: 60, frac: '3/5', fake: ['2/3', '4/5', '3/4'] },
      { pct: 75, frac: '3/4', fake: ['7/10', '4/5', '5/8'] },
      { pct: 80, frac: '4/5', fake: ['3/4', '5/6', '7/8'] }
    ];
    const item = fractions[getRandomInt(0, fractions.length - 1)];
    const options = shuffleArray([item.frac, ...item.fake]);

    return {
      type: 'mcq',
      correct: item.frac,
      options,
      prompt: `Ποιο ανάγωγο κλάσμα ισούται ακριβώς με το ποσοστό ${item.pct}%;`,
      explanation: `Γράφουμε το ποσοστό ως κλάσμα με παρονομαστή το 100 και απλοποιούμε με τον ΜΚΔ: ${item.pct}/100 ＝ ${item.frac}.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Έκπτωση & Τελική Τιμή / Αντίστροφο Ποσοστό (Input & MCQ)
function makeDiscountAndReverseQuestion(isReverse = false) {
  if (!isReverse) {
    // q5: Υπολογισμός τελικής τιμής μετά από έκπτωση (Input)
    const initialPrices = [60, 80, 120, 150, 160, 200, 240];
    const pcts = [15, 20, 25, 30, 40];
    const initialPrice = initialPrices[getRandomInt(0, initialPrices.length - 1)];
    const pct = pcts[getRandomInt(0, pcts.length - 1)];
    const discount = Math.round((initialPrice * pct) / 100);
    const finalPrice = initialPrice - discount;

    return {
      type: 'input',
      correct: finalPrice,
      unit: '€ (τελική τιμή)',
      prompt: `Ένα παντελόνι κοστίζει αρχικά ${initialPrice} € και πωλείται με έκπτωση ${pct}%. Ποια είναι η τελική τιμή του μετά την έκπτωση;`,
      explanation: `Υπολογίζουμε την έκπτωση: (${initialPrice} · ${pct}) ： 100 ＝ ${discount} €. Αφαιρούμε την έκπτωση από την αρχική τιμή: ${initialPrice} － ${discount} ＝ ${finalPrice} €.`
    };
  } else {
    // q6: Εύρεση αρχικού ποσού όταν γνωρίζουμε το μέρος και το ποσοστό (MCQ)
    const cases = [
      { pct: 20, part: 40, total: 200 },
      { pct: 25, part: 60, total: 240 },
      { pct: 30, part: 90, total: 300 },
      { pct: 40, part: 120, total: 300 },
      { pct: 50, part: 140, total: 280 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    const distractors = [c.total + 50, c.total - 40, c.total + 100];
    const options = shuffleArray([c.total, ...distractors]).map((v) => `${v} €`);

    return {
      type: 'mcq',
      correct: `${c.total} €`,
      options,
      prompt: `Αν το ${c.pct}% ενός χρηματικού ποσού είναι ${c.part} €, ποιο είναι ολόκληρο το αρχικό ποσό (το 100%);`,
      explanation: `Αν το ${c.pct}% είναι ${c.part} €, τότε το 1% είναι: ${c.part} ： ${c.pct} ＝ ${c.part / c.pct} €. Ολόκληρο το ποσό (100%) είναι: ${c.part / c.pct} · 100 ＝ ${c.total} €.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Αύξησης/ΦΠΑ & Ποσοστού επί του Συνόλου (Input & MCQ)
function makeComplexPercentageProblem(isMCQ = false) {
  if (!isMCQ) {
    // q7: Υπολογισμός τελικής τιμής με αύξηση / επιβάρυνση (Input)
    const initialPrice = [50, 100, 150, 200, 250][getRandomInt(0, 4)];
    const pctIncrease = [10, 12, 16, 20, 24][getRandomInt(0, 4)];
    const increaseAmount = Math.round((initialPrice * pctIncrease) / 100);
    const finalPrice = initialPrice + increaseAmount;

    return {
      type: 'input',
      correct: finalPrice,
      unit: '€ (με αύξηση)',
      prompt: `Η τιμή ενός ηλεκτρικού εργαλείου ήταν ${initialPrice} € και αυξήθηκε κατά ${pctIncrease}%. Ποια είναι η νέα τιμή του εργαλείου;`,
      explanation: `Υπολογίζουμε την αύξηση: (${initialPrice} · ${pctIncrease}) ： 100 ＝ ${increaseAmount} €. Προσθέτουμε στην αρχική τιμή: ${initialPrice} ＋ ${increaseAmount} ＝ ${finalPrice} €.`
    };
  } else {
    // q8: Εύρεση ποσοστού από γνωστό πλήθος επί συνόλου (MCQ)
    const cases = [
      { total: 50, part: 18, pct: 36 },
      { total: 50, part: 24, pct: 48 },
      { total: 25, part: 9, pct: 36 },
      { total: 25, part: 14, pct: 56 },
      { total: 20, part: 7, pct: 35 },
      { total: 20, part: 11, pct: 55 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    const distractors = [c.pct + 10, c.pct - 8, c.pct + 5].filter((v) => v !== c.pct);
    const options = shuffleArray([c.pct, ...distractors.slice(0, 3)]).map((v) => `${v}%`);

    return {
      type: 'mcq',
      correct: `${c.pct}%`,
      options,
      prompt: `Σε έναν όμιλο ${c.total} μαθητών, τα ${c.part} παιδιά μαθαίνουν σκάκι. Τι ποσοστό στα εκατό ( % ) των μαθητών του ομίλου μαθαίνει σκάκι;`,
      explanation: `Σχηματίζουμε το κλάσμα ${c.part}/${c.total} και το μετατρέπουμε σε ισοδύναμο με παρονομαστή το 100: (${c.part} · ${100 / c.total}) / (${c.total} · ${100 / c.total}) ＝ ${c.pct}/100 ＝ ${c.pct}%.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeDirectCalculationQuestion(false),
    q2: makeDirectCalculationQuestion(true),
    q3: makeTripleFormQuestion(false),
    q4: makeTripleFormQuestion(true),
    q5: makeDiscountAndReverseQuestion(false),
    q6: makeDiscountAndReverseQuestion(true),
    q7: makeComplexPercentageProblem(false),
    q8: makeComplexPercentageProblem(true)
  };
}

export default function PosostaAskPage() {
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
      title="Ασκήσεις: Ποσοστά - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα ποσοστά: υπολογισμός ποσοστού επί ποσού, μετατροπές τριπλής μορφής, προβλήματα έκπτωσης και αύξησης."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/12-pososta"
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
              📝 Ασκήσεις: Ποσοστά
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
          {renderInput('q1', questions.q1, 1, 'ΥΠΟΛΟΓΙΣΜΟΣ ΠΟΣΟΣΤΟΥ ΕΠΙ ΠΟΣΟΥ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΜΕΤΑΤΡΟΠΗ ΚΛΑΣΜΑΤΟΣ ΣΕ ΠΟΣΟΣΤΟ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΠΟΣΟΣΤΟ ΣΕ ΔΕΚΑΔΙΚΟ ΑΡΙΘΜΟ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΠΟΣΟΣΤΟ ΣΕ ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΠΡΟΒΛΗΜΑ ΕΚΠΤΩΣΗΣ & ΤΕΛΙΚΗΣ ΤΙΜΗΣ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΕΥΡΕΣΗ ΑΡΧΙΚΟΥ ΠΟΣΟΥ ΑΠΟ ΠΟΣΟΣΤΟ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΠΡΟΒΛΗΜΑ ΑΥΞΗΣΗΣ ΤΙΜΗΣ', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΥΠΟΛΟΓΙΣΜΟΣ ΠΟΣΟΣΤΟΥ ΕΠΙ ΤΟΥ ΣΥΝΟΛΟΥ', 'bg-purple-600')}

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

// pages/e-dimotikou/27-monades-epifaneias-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Μετατροπές Υποδιαιρέσεων με τον Κανόνα του 100 (Input)
function makeSubdivisionAreaQuestion(isAscending = false) {
  if (!isAscending) {
    // q1: Κατεβαίνω τη σκάλα: m² -> dm² (πολλαπλασιασμός με 100)
    const m2Options = [3.5, 4.25, 6.8, 2.75, 5.4, 8.5];
    const m2Val = m2Options[getRandomInt(0, m2Options.length - 1)];
    const correctDm2 = Math.round(m2Val * 100);
    const m2Str = m2Val.toLocaleString('el-GR');

    return {
      type: 'input',
      correct: correctDm2,
      unit: 'dm²',
      prompt: `Μετάτρεψε την επιφάνεια των ${m2Str} m² σε τετραγωνικά δεκατόμετρα ( dm² ):`,
      explanation: `Για να πάμε από m² σε dm², κατεβαίνουμε 1 σκαλοπάτι (πολλαπλασιάζουμε με το 100): ${m2Str} · 100 ＝ ${correctDm2} dm².`
    };
  } else {
    // q2: Ανεβαίνω τη σκάλα: cm² -> dm² (διαίρεση με 100)
    const cm2Options = [1500, 2400, 3800, 4500, 7200, 9600];
    const cm2Val = cm2Options[getRandomInt(0, cm2Options.length - 1)];
    const correctDm2 = cm2Val / 100;

    return {
      type: 'input',
      correct: correctDm2,
      unit: 'dm²',
      prompt: `Μετάτρεψε την επιφάνεια των ${cm2Val.toLocaleString('el-GR')} cm² σε τετραγωνικά δεκατόμετρα ( dm² ):`,
      explanation: `Για να πάμε από cm² σε dm², ανεβαίνουμε 1 σκαλοπάτι (διαιρούμε με το 100): ${cm2Val.toLocaleString('el-GR')} ： 100 ＝ ${correctDm2} dm².`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Θεωρία Κανόνα του 100 & Σύγκριση Επιφανειών (MCQ)
function makeAreaTheoryAndComparisonQuestion(isComparison = false) {
  if (!isComparison) {
    // q3: Γιατί κάθε σκαλοπάτι στην επιφάνεια είναι 100
    const options = [
      'Επειδή στην επιφάνεια μετράμε δύο διαστάσεις και πολλαπλασιάζουμε 10 σειρές επί 10 στήλες ( 10 · 10 ＝ 100 )',
      'Επειδή το μέτρο έχει 100 εκατοστά',
      'Επειδή ο κύκλος έχει 100 μοίρες',
      'Επειδή η περίμετρος ενός τετραγώνου είναι 100'
    ];

    return {
      type: 'mcq',
      correct: 'Επειδή στην επιφάνεια μετράμε δύο διαστάσεις και πολλαπλασιάζουμε 10 σειρές επί 10 στήλες ( 10 · 10 ＝ 100 )',
      options,
      prompt: `Για ποιον λόγο στις μετατροπές μονάδων επιφάνειας κάθε σκαλοπάτι αξίζει 100 (και όχι 10 όπως στο μήκος);`,
      explanation: `Στις μονάδες επιφάνειας έχουμε τετράγωνο με 2 διαστάσεις (μήκος και πλάτος). Επειδή κάθε διάσταση υποδιαιρείται σε 10 ίσα μέρη, ολόκληρο το τετράγωνο περιέχει: 10 · 10 ＝ 100 μικρότερα τετραγωνάκια!`
    };
  } else {
    // q4: Σύγκριση επιφανειών
    const cases = [
      {
        correct: '0,5 m²',
        options: ['0,5 m²', '45 dm²', '4.200 cm²', '450.000 mm²'],
        expl: 'Μετατρέπουμε όλα σε dm²: 0,5 m² ＝ 50 dm², 45 dm², 4.200 cm² ＝ 42 dm², 450.000 mm² ＝ 45 dm². Το μεγαλύτερο είναι τα 0,5 m² (50 dm²).'
      },
      {
        correct: '80 dm²',
        options: ['80 dm²', '0,75 m²', '7.200 cm²', '700.000 mm²'],
        expl: 'Μετατρέπουμε όλα σε dm²: 80 dm², 0,75 m² ＝ 75 dm², 7.200 cm² ＝ 72 dm², 700.000 mm² ＝ 70 dm². Το μεγαλύτερο είναι τα 80 dm².'
      }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    return {
      type: 'mcq',
      correct: c.correct,
      options: shuffleArray(c.options),
      prompt: `Ποια από τις παρακάτω επιφάνειες είναι η ΜΕΓΑΛΥΤΕΡΗ;`,
      explanation: c.expl
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Στρέμματα & Τετραγωνικά Χιλιόμετρα (Input & MCQ)
function makeLargeAreaUnitsQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q5: Μετατροπή στρεμμάτων σε m² (1 στρέμμα = 1.000 m²)
    const stremmata = [2.5, 3.8, 4.5, 7.2, 8.5][getRandomInt(0, 4)];
    const correctM2 = Math.round(stremmata * 1000);
    const strStr = stremmata.toLocaleString('el-GR');

    return {
      type: 'input',
      correct: correctM2,
      unit: 'm²',
      prompt: `Ένα αγρόκτημα έχει έκταση ${strStr} στρέμματα. Πόσα τετραγωνικά μέτρα ( m² ) είναι η επιφάνειά του;`,
      explanation: `Γνωρίζουμε ότι 1 στρέμμα ＝ 1.000 m². Επομένως: ${strStr} · 1.000 ＝ ${correctM2.toLocaleString('el-GR')} m².`
    };
  } else {
    // q6: Πόσα στρέμματα είναι το 1 τετραγωνικό χιλιόμετρο (km²)
    const options = shuffleArray([
      '1.000 στρέμματα',
      '100 στρέμματα',
      '10.000 στρέμματα',
      '10 στρέμματα'
    ]);

    return {
      type: 'mcq',
      correct: '1.000 στρέμματα',
      options,
      prompt: `Σε πόσα στρέμματα ισοδυναμεί ακριβώς 1 τετραγωνικό χιλιόμετρο ( 1 km² );`,
      explanation: `1 km² ＝ 1.000.000 m². Επειδή 1 στρέμμα ＝ 1.000 m², έχουμε: 1.000.000 ： 1.000 ＝ 1.000 στρέμματα!`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Πλακόστρωση Δαπέδου & Κόστος (Input & MCQ)
function makeFloorTilingQuestion(isCostMCQ = false) {
  if (!isCostMCQ) {
    // q7: Πλακόστρωση δωματίου με πλακάκια σε cm²
    // Δωμάτιο: π.χ. 12 m² = 120.000 cm². Κάθε πλακάκι 20x20 = 400 cm².
    // Πλακάκια = 120.000 : 400 = 300 πλακάκια.
    const roomM2 = [12, 16, 20, 24][getRandomInt(0, 3)];
    const tileSide = 20; // cm
    const tileAreaCm2 = tileSide * tileSide; // 400 cm²
    const roomAreaCm2 = roomM2 * 10000;
    const tilesCount = roomAreaCm2 / tileAreaCm2;

    return {
      type: 'input',
      correct: tilesCount,
      unit: 'πλακάκια',
      prompt: `Ένα δωμάτιο έχει εμβαδόν ${roomM2} m². Θέλουμε να το στρώσουμε με τετράγωνα πλακάκια πλευράς ${tileSide} cm (εμβαδού 400 cm²). Πόσα τέτοια πλακάκια θα χρειαστούμε;`,
      explanation: `Μετατρέπουμε το εμβαδόν του δωματίου σε cm²: ${roomM2} m² ＝ ${roomM2} · 10.000 ＝ ${roomAreaCm2.toLocaleString('el-GR')} cm². Διαιρούμε με το εμβαδόν ενός πλακιδίου: ${roomAreaCm2.toLocaleString('el-GR')} ： 400 ＝ ${tilesCount} πλακάκια.`
    };
  } else {
    // q8: Κόστος στρωσίματος ανά m²
    const areaM2 = [30, 40, 50, 60][getRandomInt(0, 3)];
    const costPerM2 = [15, 20, 25][getRandomInt(0, 2)];
    const totalCost = areaM2 * costPerM2;

    const distractors = [totalCost + 150, totalCost - 100, areaM2 * 10];
    const options = shuffleArray([`${totalCost} €`, ...distractors.map((d) => `${d} €`)]);

    return {
      type: 'mcq',
      correct: `${totalCost} €`,
      options,
      prompt: `Για την ανακαίνιση ενός δαπέδου επιφάνειας ${areaM2} m², το κόστος αγοράς των πλακιδίων ανέρχεται σε ${costPerM2} € ανά τετραγωνικό μέτρο ( m² ). Πόσο θα κοστίσουν συνολικά τα πλακάκια;`,
      explanation: `Πολλαπλασιάζουμε τη συνολική επιφάνεια με την τιμή ανά m²: ${areaM2} · ${costPerM2} € ＝ ${totalCost} €.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeSubdivisionAreaQuestion(false),
    q2: makeSubdivisionAreaQuestion(true),
    q3: makeAreaTheoryAndComparisonQuestion(false),
    q4: makeAreaTheoryAndComparisonQuestion(true),
    q5: makeLargeAreaUnitsQuestion(false),
    q6: makeLargeAreaUnitsQuestion(true),
    q7: makeFloorTilingQuestion(false),
    q8: makeFloorTilingQuestion(true)
  };
}

export default function MonadesEpifaneiasAskPage() {
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

  // Αυστηρός έλεγχος εισόδου: μόνο αριθμοί 0-9, το πολύ ένα κόμμα, όριο 10 ψηφία
  const handleStrictNumberInput = (key, rawVal) => {
    if (submitted) return;
    let clean = rawVal.replace('.', ',').replace(/[^0-9,]/g, '');
    const parts = clean.split(',');
    if (parts.length > 2) {
      clean = parts[0] + ',' + parts.slice(1).join('');
    }
    if (clean.length > 10) {
      clean = clean.slice(0, 10);
    }
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const parseUserFloat = (val) => {
    if (!val || val === ',') return NaN;
    return parseFloat(val.replace(',', '.'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    // q1
    if (Math.abs(parseUserFloat(answers.q1) - questions.q1.correct) < 0.01) currentScore += 1;
    // q2
    if (Math.abs(parseUserFloat(answers.q2) - questions.q2.correct) < 0.01) currentScore += 1;
    // q3
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    // q4
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    // q5
    if (Math.abs(parseUserFloat(answers.q5) - questions.q5.correct) < 0.01) currentScore += 1;
    // q6
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    // q7
    if (Math.abs(parseUserFloat(answers.q7) - questions.q7.correct) < 0.01) currentScore += 1;
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

  // Render Component για Ερωτήσεις Input (αυστηρός περιορισμός 10 ψηφίων)
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const userVal = parseUserFloat(answers[qKey]);
    const isCorrect = !isNaN(userVal) && Math.abs(userVal - qData.correct) < 0.01;
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
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              value={answers[qKey]}
              onChange={(e) => handleStrictNumberInput(qKey, e.target.value)}
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
      title="Ασκήσεις: Μονάδες Επιφάνειας - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στις μονάδες μέτρησης επιφάνειας: κανόνας του 100, τετραγωνικά μέτρα, δεκατόμετρα, εκατοστά, στρέμματα και πλακόστρωση."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/27-monades-epifaneias"
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
              📝 Ασκήσεις: Μονάδες Μέτρησης Επιφάνειας
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
          {renderInput('q1', questions.q1, 1, 'ΚΑΤΕΒΑΙΝΩ ΤΗ ΣΚΑΛΑ ΕΠΙΦΑΝΕΙΑΣ ( m² ➔ dm² )', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΑΝΕΒΑΙΝΩ ΤΗ ΣΚΑΛΑ ΕΠΙΦΑΝΕΙΑΣ ( cm² ➔ dm² )', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'Ο ΚΑΝΟΝΑΣ ΤΟΥ 100 ΣΤΗΝ ΕΠΙΦΑΝΕΙΑ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΣΥΓΚΡΙΣΗ ΑΝΟΜΟΙΩΝ ΕΠΙΦΑΝΕΙΩΝ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΜΕΤΑΤΡΟΠΗ ΣΤΡΕΜΜΑΤΩΝ ΣΕ m²', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΣΤΡΕΜΜΑΤΑ ΚΑΙ ΤΕΤΡΑΓΩΝΙΚΟ ΧΙΛΙΟΜΕΤΡΟ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΠΛΑΚΟΣΤΡΩΣΗ ΔΑΠΕΔΟΥ ΜΕ ΠΛΑΚΑΚΙΑ ( m² ➔ cm² )', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΥΠΟΛΟΓΙΣΜΟΣ ΣΥΝΟΛΙΚΟΥ ΚΟΣΤΟΥΣ ΕΠΙΦΑΝΕΙΑΣ', 'bg-purple-600')}

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

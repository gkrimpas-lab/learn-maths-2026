// pages/e-dimotikou/26-embado-sximaton-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εμβαδόν Ορθογώνιου Τριγώνου & Ανάστροφος Υπολογισμός (Input)
function makeRightTriangleAreaQuestion(isReverse = false) {
  if (!isReverse) {
    // q1: Ε = (α · β) : 2
    const side1 = [6, 8, 10, 12, 14, 16][getRandomInt(0, 5)];
    const side2 = [5, 7, 9, 11, 15][getRandomInt(0, 4)];
    const area = (side1 * side2) / 2;

    return {
      type: 'input',
      correct: area,
      unit: 'cm² (εμβαδόν)',
      prompt: `Ένα ορθογώνιο τρίγωνο έχει κάθετες πλευρές μήκους ${side1} cm και ${side2} cm. Πόσα cm² είναι το εμβαδόν του;`,
      explanation: `Ο τύπος του εμβαδού ορθογώνιου τριγώνου είναι: Ε ＝ ( Βάση · Ύψος ) ： 2. Επομένως: (${side1} · ${side2}) ： 2 ＝ ${side1 * side2} ： 2 ＝ ${area} cm².`
    };
  } else {
    // q2: Εύρεση δεύτερης κάθετης πλευράς όταν δίνεται το εμβαδόν και η μία πλευρά
    // β = (2 · Ε) : α
    const side1 = [8, 10, 12, 16][getRandomInt(0, 3)];
    const side2 = [6, 7, 9, 11][getRandomInt(0, 3)];
    const area = (side1 * side2) / 2;

    return {
      type: 'input',
      correct: side2,
      unit: 'cm (μήκος κάθετης πλευράς)',
      prompt: `Το εμβαδόν ενός ορθογώνιου τριγώνου είναι ${area} cm² και η μία κάθετη πλευρά του έχει μήκος ${side1} cm. Πόσα cm είναι η άλλη κάθετη πλευρά του;`,
      explanation: `Διπλασιάζουμε το εμβαδόν και διαιρούμε με τη γνωστή πλευρά: ( 2 · ${area} ) ： ${side1} ＝ ${2 * area} ： ${side1} ＝ ${side2} cm.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Σχέση Ορθογωνίου με Τρίγωνο & Σύγκριση Σχημάτων (MCQ)
function makeShapeRelationshipQuestion(isComparison = false) {
  if (!isComparison) {
    // q3: Γιατί διαιρούμε με το 2 στον τύπο του τριγώνου
    const options = [
      'Επειδή η διαγώνιος χωρίζει το ορθογώνιο σε δύο απολύτως ίσα ορθογώνια τρίγωνα',
      'Επειδή το τρίγωνο έχει 3 κορυφές',
      'Επειδή οι πλευρές του τριγώνου είναι πάντοτε ζυγοί αριθμοί',
      'Επειδή το εμβαδόν του είναι ίσο με την περίμετρο'
    ];

    return {
      type: 'mcq',
      correct: 'Επειδή η διαγώνιος χωρίζει το ορθογώνιο σε δύο απολύτως ίσα ορθογώνια τρίγωνα',
      options,
      prompt: `Για ποιον λόγο στον μαθηματικό τύπο του εμβαδού ορθογώνιου τριγώνου διαιρούμε πάντα διά 2 [ ( α · β ) ： 2 ];`,
      explanation: `Κάθε ορθογώνιο τρίγωνο αποτελεί ακριβώς το μισό ενός ορθογωνίου με τις ίδιες διαστάσεις, καθώς η διαγώνιος του ορθογωνίου το κόβει σε δύο πανομοιότυπα τρίγωνα.`
    };
  } else {
    // q4: Σύγκριση εμβαδού τετραγώνου και ορθογωνίου
    const sqSide = 6;
    const sqArea = sqSide * sqSide; // 36 cm²
    const rectL = 9;
    const rectW = 4;
    const rectArea = rectL * rectW; // 36 cm²

    const options = [
      'Έχουν ακριβώς το ίδιο εμβαδόν ( 36 cm² )',
      'Το τετράγωνο έχει μεγαλύτερο εμβαδόν',
      'Το ορθογώνιο έχει μεγαλύτερο εμβαδόν',
      'Δεν μπορούμε να συγκρίνουμε τετράγωνο με ορθογώνιο'
    ];

    return {
      type: 'mcq',
      correct: 'Έχουν ακριβώς το ίδιο εμβαδόν ( 36 cm² )',
      options,
      prompt: `Ένα τετράγωνο έχει πλευρά ${sqSide} cm και ένα ορθογώνιο έχει μήκος ${rectL} cm και πλάτος ${rectW} cm. Ποια σχέση έχουν τα εμβαδά τους;`,
      explanation: `Εμβαδόν τετραγώνου: ${sqSide} · ${sqSide} ＝ ${sqArea} cm². Εμβαδόν ορθογωνίου: ${rectL} · ${rectW} ＝ ${rectArea} cm². Άρα τα δύο σχήματα είναι ισεμβαδικά (έχουν ακριβώς το ίδιο εμβαδόν 36 cm²)!`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Εμβαδόν Τετραγώνου & Ορθογωνίου με Εφαρμογές (Input & MCQ)
function makeSquareAndRectangleQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q5: Εμβαδόν τετραγώνου από γνωστή περίμετρο (Input)
    // Π = 4 · α => α = Π : 4 => Ε = α · α
    const side = [5, 6, 8, 9, 11][getRandomInt(0, 4)];
    const perimeter = 4 * side;
    const area = side * side;

    return {
      type: 'input',
      correct: area,
      unit: 'cm² (εμβαδόν)',
      prompt: `Η περίμετρος ενός τετραγώνου είναι ${perimeter} cm. Πόσα cm² είναι το εμβαδόν του;`,
      explanation: `Πρώτα βρίσκουμε την πλευρά του τετραγώνου διαιρώντας την περίμετρο με το 4: ${perimeter} ： 4 ＝ ${side} cm. Στη συνέχεια υπολογίζουμε το εμβαδόν: ${side} · ${side} ＝ ${area} cm².`
    };
  } else {
    // q6: Ορθογώνιο με μήκος διπλάσιο του πλάτους (MCQ)
    const width = [4, 5, 6, 7][getRandomInt(0, 3)];
    const length = width * 2;
    const area = length * width;

    const distractors = [area + 12, area - 8, length + width, 2 * (length + width)];
    const options = shuffleArray([`${area} cm²`, ...distractors.slice(0, 3).map((d) => `${d} cm²`)]);

    return {
      type: 'mcq',
      correct: `${area} cm²`,
      options,
      prompt: `Ένα ορθογώνιο έχει πλάτος ${width} cm και το μήκος του είναι διπλάσιο από το πλάτος. Πόσο είναι το εμβαδόν του;`,
      explanation: `Το μήκος είναι: 2 · ${width} ＝ ${length} cm. Το εμβαδόν είναι: Μήκος · Πλάτος ＝ ${length} · ${width} ＝ ${area} cm².`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετο Σχήμα & Τεμαχισμός Επιφάνειας (Input & MCQ)
function makeCompositeShapeQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q7: Σχήμα αποτελούμενο από ένα ορθογώνιο και ένα ορθογώνιο τρίγωνο (Input)
    // Ορθογώνιο: 10 x 6 = 60 cm²
    // Τρίγωνο προσαρτημένο: βάση 4 cm, ύψος 6 cm => (4 x 6) : 2 = 12 cm²
    // Συνολικό εμβαδόν: 60 + 12 = 72 cm²
    const rectL = 10;
    const commonH = [6, 8][getRandomInt(0, 1)];
    const triBase = [4, 6][getRandomInt(0, 1)];
    const rectArea = rectL * commonH;
    const triArea = (triBase * commonH) / 2;
    const totalArea = rectArea + triArea;

    return {
      type: 'input',
      correct: totalArea,
      unit: 'cm² (συνολικό εμβαδόν)',
      prompt: `Ένα γεωμετρικό σχήμα αποτελείται από ένα ορθογώνιο διαστάσεων ${rectL} cm × ${commonH} cm και ένα ορθογώνιο τρίγωνο κολλημένο στην πλευρά του, με βάση ${triBase} cm και ύψος ${commonH} cm. Πόσα cm² είναι το συνολικό εμβαδόν του σύνθετου σχήματος;`,
      explanation: `Υπολογίζουμε τα επιμέρους εμβαδά: Εμβαδόν ορθογωνίου ＝ ${rectL} · ${commonH} ＝ ${rectArea} cm². Εμβαδόν τριγώνου ＝ ( ${triBase} · ${commonH} ) ： 2 ＝ ${triBase * commonH} ： 2 ＝ ${triArea} cm². Συνολικό εμβαδόν: ${rectArea} ＋ ${triArea} ＝ ${totalArea} cm².`
    };
  } else {
    // q8: Αφαίρεση επιφάνειας (τετράγωνο μέσα σε ορθογώνιο) (MCQ)
    const rectL = 12;
    const rectW = 8;
    const rectArea = rectL * rectW; // 96 cm²
    const holeSide = 4;
    const holeArea = holeSide * holeSide; // 16 cm²
    const remainingArea = rectArea - holeArea; // 80 cm²

    const distractors = [remainingArea + 16, remainingArea - 10, rectArea / 2];
    const options = shuffleArray([`${remainingArea} cm²`, ...distractors.map((d) => `${d} cm²`)]);

    return {
      type: 'mcq',
      correct: `${remainingArea} cm²`,
      options,
      prompt: `Από ένα ορθογώνιο χαρτόνι διαστάσεων ${rectL} cm × ${rectW} cm κόβουμε και αφαιρούμε ένα τετράγωνο κομμάτι με πλευρά ${holeSide} cm. Πόσο είναι το εμβαδόν του χαρτονιού που απομένει;`,
      explanation: `Αρχικό εμβαδόν: ${rectL} · ${rectW} ＝ ${rectArea} cm². Εμβαδόν κομματιού που κόπηκε: ${holeSide} · ${holeSide} ＝ ${holeArea} cm². Εμβαδόν που απέμεινε: ${rectArea} － ${holeArea} ＝ ${remainingArea} cm².`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeRightTriangleAreaQuestion(false),
    q2: makeRightTriangleAreaQuestion(true),
    q3: makeShapeRelationshipQuestion(false),
    q4: makeShapeRelationshipQuestion(true),
    q5: makeSquareAndRectangleQuestion(false),
    q6: makeSquareAndRectangleQuestion(true),
    q7: makeCompositeShapeQuestion(false),
    q8: makeCompositeShapeQuestion(true)
  };
}

export default function EmbadoSximatonAskPage() {
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
      title="Ασκήσεις: Εμβαδόν Βασικών Σχημάτων - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στο εμβαδόν σχημάτων: τετράγωνο, ορθογώνιο, ορθογώνιο τρίγωνο και σύνθετες επιφάνειες."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/26-embado-sximaton"
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
              📝 Ασκήσεις: Εμβαδόν Βασικών Σχημάτων
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
          {renderInput('q1', questions.q1, 1, 'ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΕΥΡΕΣΗ ΚΑΘΕΤΗΣ ΠΛΕΥΡΑΣ ΑΠΟ ΕΜΒΑΔΟΝ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΣΧΕΣΗ ΟΡΘΟΓΩΝΙΟΥ ΜΕ ΟΡΘΟΓΩΝΙΟ ΤΡΙΓΩΝΟ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΣΥΓΚΡΙΣΗ ΕΜΒΑΔΟΥ ΤΕΤΡΑΓΩΝΟΥ ΚΑΙ ΟΡΘΟΓΩΝΙΟΥ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΕΜΒΑΔΟΝ ΤΕΤΡΑΓΩΝΟΥ ΑΠΟ ΠΕΡΙΜΕΤΡΟ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ΜΕ ΣΧΕΣΗ ΔΙΑΣΤΑΣΕΩΝ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΕΜΒΑΔΟΝ ΣΥΝΘΕΤΟΥ ΣΧΗΜΑΤΟΣ ( ΟΡΘΟΓΩΝΙΟ ＋ ΤΡΙΓΩΝΟ )', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΑΦΑΙΡΕΣΗ ΕΠΙΦΑΝΕΙΑΣ ΑΠΟ ΟΡΘΟΓΩΝΙΟ', 'bg-purple-600')}

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

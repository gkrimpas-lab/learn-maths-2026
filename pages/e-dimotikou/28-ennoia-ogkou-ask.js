// pages/e-dimotikou/28-ennoia-ogkou-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Όγκος Ορθογωνίου Παραλληλεπιπέδου & Ανάστροφος Υπολογισμός (Input)
function makeCuboidVolumeQuestion(isReverse = false) {
  if (!isReverse) {
    // q1: V = Μήκος · Πλάτος · Ύψος
    const length = [5, 6, 8, 10][getRandomInt(0, 3)];
    const width = [3, 4, 5][getRandomInt(0, 2)];
    const height = [2, 3, 4][getRandomInt(0, 2)];
    const volume = length * width * height;

    return {
      type: 'input',
      correct: volume,
      unit: 'cm³ (όγκος)',
      prompt: `Ένα κουτί έχει μήκος ${length} cm, πλάτος ${width} cm και ύψος ${height} cm. Πόσα cm³ είναι ο όγκος του;`,
      explanation: `Ο τύπος του όγκου ορθογωνίου παραλληλεπιπέδου είναι: V ＝ Μήκος · Πλάτος · Ύψος. Επομένως: ${length} · ${width} · ${height} ＝ ${length * width} · ${height} ＝ ${volume} cm³.`
    };
  } else {
    // q2: Εύρεση ύψους από γνωστό όγκο, μήκος και πλάτος: Ύψος = V : (Μήκος · Πλάτος)
    const length = [6, 8, 10][getRandomInt(0, 2)];
    const width = [4, 5][getRandomInt(0, 1)];
    const height = [3, 4, 6][getRandomInt(0, 2)];
    const baseArea = length * width;
    const volume = baseArea * height;

    return {
      type: 'input',
      correct: height,
      unit: 'cm (ύψος)',
      prompt: `Ο όγκος ενός ορθογωνίου παραλληλεπιπέδου είναι ${volume} cm³. Αν το μήκος του είναι ${length} cm και το πλάτος του είναι ${width} cm, πόσα cm είναι το ύψος του;`,
      explanation: `Πρώτα υπολογίζουμε το εμβαδόν της βάσης: ${length} · ${width} ＝ ${baseArea} cm². Στη συνέχεια διαιρούμε τον όγκο με το εμβαδόν της βάσης: ${volume} ： ${baseArea} ＝ ${height} cm.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Θεωρία Όγκου & Σύγκριση Στερεών (MCQ)
function makeVolumeTheoryAndComparisonQuestion(isComparison = false) {
  if (!isComparison) {
    // q3: Τι εκφράζει ο όγκος και γιατί έχει εκθέτη 3
    const options = [
      'Τον τρισδιάστατο χώρο που καταλαμβάνει ένα σώμα, πολλαπλασιάζοντας 3 διαστάσεις ( μήκος · πλάτος · ύψος )',
      'Την επιφάνεια του περιγράμματος ενός σχήματος σε 2 διαστάσεις',
      'Το συνολικό μήκος όλων των ακμών του κουτιού',
      'Το βάρος του αντικειμένου σε κιλά'
    ];

    return {
      type: 'mcq',
      correct: 'Τον τρισδιάστατο χώρο που καταλαμβάνει ένα σώμα, πολλαπλασιάζοντας 3 διαστάσεις ( μήκος · πλάτος · ύψος )',
      options,
      prompt: `Τι εκφράζει ο ΌΓΚΟΣ ενός γεωμετρικού στερεού και γιατί γράφεται με μονάδα cm³ (κυβικά εκατοστά);`,
      explanation: `Ο όγκος εκφράζει το μέγεθος του τρισδιάστατου χώρου που καταλαμβάνει ένα στερεό. Η μονάδα cm³ έχει εκθέτη 3 επειδή πολλαπλασιάζουμε 3 διαστάσεις: μήκος, πλάτος και ύψος!`
    };
  } else {
    // q4: Σύγκριση όγκου στερεών
    const cases = [
      {
        textA: 'Στερεό Α ( 4 cm × 3 cm × 5 cm ＝ 60 cm³ )',
        textB: 'Στερεό Β ( 6 cm × 2 cm × 6 cm ＝ 72 cm³ )',
        correct: 'Το Στερεό Β έχει μεγαλύτερο όγκο ( 72 cm³ έναντι 60 cm³ )',
        options: [
          'Το Στερεό Β έχει μεγαλύτερο όγκο ( 72 cm³ έναντι 60 cm³ )',
          'Το Στερεό Α έχει μεγαλύτερο όγκο ( 60 cm³ έναντι 48 cm³ )',
          'Έχουν ακριβώς τον ίδιο όγκο',
          'Δεν μπορούμε να συγκρίνουμε στερεά με διαφορετικές διαστάσεις'
        ],
        expl: 'Υπολογίζουμε τους όγκους: Στερεό Α ＝ 4 · 3 · 5 ＝ 60 cm³. Στερεό Β ＝ 6 · 2 · 6 ＝ 72 cm³. Επομένως, το Στερεό Β έχει μεγαλύτερο όγκο.'
      }
    ];
    const c = cases[0];

    return {
      type: 'mcq',
      correct: c.correct,
      options: shuffleArray(c.options),
      prompt: `Ποιο από τα δύο κουτιά καταλαμβάνει μεγαλύτερο χώρο: ${c.textA} ή ${c.textB};`,
      explanation: c.expl
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Όγκος Κύβου & Ανάστροφη Εύρεση Ακμής (Input & MCQ)
function makeCubeVolumeQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q5: V = α · α · α
    const edge = [3, 4, 5, 6][getRandomInt(0, 3)];
    const volume = edge * edge * edge;

    return {
      type: 'input',
      correct: volume,
      unit: 'cm³ (όγκος κύβου)',
      prompt: `Ένας κύβος έχει ακμή (πλευρά) ${edge} cm. Πόσα cm³ είναι ο όγκος του;`,
      explanation: `Στον κύβο όλες οι διαστάσεις είναι ίσες (α). Ο τύπος του όγκου είναι: V ＝ α · α · α. Επομένως: ${edge} · ${edge} · ${edge} ＝ ${edge * edge} · ${edge} ＝ ${volume} cm³.`
    };
  } else {
    // q6: Εύρεση ακμής κύβου από γνωστό όγκο
    const cases = [
      { vol: 27, edge: 3 },
      { vol: 64, edge: 4 },
      { vol: 125, edge: 5 },
      { vol: 216, edge: 6 },
      { vol: 1000, edge: 10 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const distractors = [c.edge + 2, Math.max(2, c.edge - 1), Math.round(c.vol / 3)];
    const options = shuffleArray([`${c.edge} cm`, ...distractors.map((d) => `${d} cm`)]);

    return {
      type: 'mcq',
      correct: `${c.edge} cm`,
      options,
      prompt: `Ο όγκος ενός κύβου είναι ${c.vol} cm³. Πόσο είναι το μήκος της ακμής (πλευράς) του;`,
      explanation: `Αναζητούμε ποιος αριθμός όταν πολλαπλασιαστεί τρεις φορές με τον εαυτό του δίνει ${c.vol}. Επειδή ${c.edge} · ${c.edge} · ${c.edge} ＝ ${c.vol}, η ακμή του κύβου είναι ${c.edge} cm.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Χωρητικότητα σε Λίτρα & Πρακτικά Προβλήματα (Input & MCQ)
function makeCapacityProblem(isMCQ = false) {
  if (!isMCQ) {
    // q7: Μετατροπή dm³ σε λίτρα και υπολογισμός χωρητικότητας ενυδρείου
    // Ενυδρείο: μήκος 6 dm, πλάτος 4 dm, ύψος 5 dm => V = 120 dm³ = 120 λίτρα
    const lengthDm = [5, 6, 8][getRandomInt(0, 2)];
    const widthDm = [3, 4, 5][getRandomInt(0, 2)];
    const heightDm = [4, 5][getRandomInt(0, 1)];
    const volumeDm3 = lengthDm * widthDm * heightDm; // 1 dm³ = 1 λίτρο

    return {
      type: 'input',
      correct: volumeDm3,
      unit: 'λίτρα ( l )',
      prompt: `Ένα ενυδρείο έχει εσωτερικές διαστάσεις: μήκος ${lengthDm} dm, πλάτος ${widthDm} dm και ύψος ${heightDm} dm. Πόσα λίτρα ( l ) νερού χωράει όταν γεμίσει πλήρως;`,
      explanation: `Υπολογίζουμε τον όγκο σε dm³: ${lengthDm} · ${widthDm} · ${heightDm} ＝ ${volumeDm3} dm³. Επειδή 1 dm³ ＝ 1 λίτρο, το ενυδρείο χωράει ακριβώς ${volumeDm3} λίτρα νερό!`
    };
  } else {
    // q8: Πόσα κυβικά εκατοστά (cm³) περιέχει 1 λίτρο νερού
    const options = shuffleArray([
      '1.000 cm³',
      '100 cm³',
      '10.000 cm³',
      '10 cm³'
    ]);

    return {
      type: 'mcq',
      correct: '1.000 cm³',
      options,
      prompt: `Σε πόσα κυβικά εκατοστά ( cm³ ) ισοδυναμεί ακριβώς 1 λίτρο ( 1 l ) υγρού;`,
      explanation: `1 λίτρο ισούται με 1 dm³. Επειδή 1 dm ＝ 10 cm, έχουμε: 1 dm³ ＝ 10 · 10 · 10 ＝ 1.000 cm³. Άρα 1 λίτρο ＝ 1.000 cm³!`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeCuboidVolumeQuestion(false),
    q2: makeCuboidVolumeQuestion(true),
    q3: makeVolumeTheoryAndComparisonQuestion(false),
    q4: makeVolumeTheoryAndComparisonQuestion(true),
    q5: makeCubeVolumeQuestion(false),
    q6: makeCubeVolumeQuestion(true),
    q7: makeCapacityProblem(false),
    q8: makeCapacityProblem(true)
  };
}

export default function EnnoiaOgkouAskPage() {
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
      title="Ασκήσεις: Η Έννοια του Όγκου - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στον όγκο: ορθογώνιο παραλληλεπίπεδο, κύβος, χωρητικότητα σε λίτρα και προβλήματα καθημερινής ζωής."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/28-ennoia-ogkou"
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
              📝 Ασκήσεις: Η Έννοια του Όγκου
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
          {renderInput('q1', questions.q1, 1, 'ΟΓΚΟΣ ΟΡΘΟΓΩΝΙΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΕΥΡΕΣΗ ΥΨΟΥΣ ΑΠΟ ΓΝΩΣΤΟ ΟΓΚΟ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΤΙ ΕΚΦΡΑΖΕΙ Ο ΟΓΚΟΣ & ΤΟ cm³', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΣΥΓΚΡΙΣΗ ΟΓΚΟΥ ΣΤΕΡΕΩΝ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΟΓΚΟΣ ΚΥΒΟΥ ( α · α · α )', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΕΥΡΕΣΗ ΑΚΜΗΣ ΚΥΒΟΥ ΑΠΟ ΟΓΚΟ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΕΝΥΔΡΕΙΟΥ ΣΕ ΛΙΤΡΑ ( l )', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΣΧΕΣΗ ΛΙΤΡΟΥ ΜΕ ΚΥΒΙΚΑ ΕΚΑΤΟΣΤΑ', 'bg-purple-600')}

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

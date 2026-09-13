// pages/e-dimotikou/24-perimetros-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Περίμετρος Ορθογωνίου & Ανάστροφος Υπολογισμός (Input)
function makeRectanglePerimeterQuestion(isFindSide = false) {
  if (!isFindSide) {
    // q1: Υπολογισμός περιμέτρου ορθογωνίου: Π = 2 · (μήκος + πλάτος)
    const length = [12, 15, 18, 24, 25][getRandomInt(0, 4)];
    const width = [6, 8, 10, 12, 14][getRandomInt(0, 4)];
    const perimeter = 2 * (length + width);

    return {
      type: 'input',
      correct: perimeter,
      unit: 'm (περίμετρος)',
      prompt: `Ένα ορθογώνιο οικόπεδο έχει μήκος ${length} m και πλάτος ${width} m. Πόσα μέτρα ( m ) είναι η περίμετρός του;`,
      explanation: `Ο τύπος της περιμέτρου ορθογωνίου είναι: Π ＝ 2 · ( Μήκος ＋ Πλάτος ). Επομένως: 2 · ( ${length} ＋ ${width} ) ＝ 2 · ${length + width} ＝ ${perimeter} m.`
    };
  } else {
    // q2: Εύρεση πλάτους από γνωστή περίμετρο και μήκος
    // Ημιπερίμετρος = Π : 2, Πλάτος = Ημιπερίμετρος - Μήκος
    const length = [16, 20, 25, 30][getRandomInt(0, 3)];
    const width = [8, 12, 14, 15][getRandomInt(0, 3)];
    const perimeter = 2 * (length + width);

    return {
      type: 'input',
      correct: width,
      unit: 'm (πλάτος)',
      prompt: `Η περίμετρος ενός ορθογώνιου αγροτεμαχίου είναι ${perimeter} m και το μήκος του είναι ${length} m. Πόσα μέτρα ( m ) είναι το πλάτος του;`,
      explanation: `Πρώτα βρίσκουμε το άθροισμα μήκους και πλάτους (ημιπερίμετρος): ${perimeter} ： 2 ＝ ${perimeter / 2} m. Έπειτα αφαιρούμε το μήκος για να βρούμε το πλάτος: ${perimeter / 2} － ${length} ＝ ${width} m.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Περίμετρος Τριγώνων & Σύγκριση Σχημάτων (MCQ)
function makeTriangleAndComparisonQuestion(isComparison = false) {
  if (!isComparison) {
    // q3: Περίμετρος ισοσκελούς τριγώνου
    const equalSide = [14, 16, 18, 20][getRandomInt(0, 3)];
    const base = [10, 12, 15, 22][getRandomInt(0, 3)];
    const perimeter = 2 * equalSide + base;
    const distractors = [perimeter + 4, perimeter - 6, equalSide + base];
    const options = shuffleArray([`${perimeter} cm`, ...distractors.map((d) => `${d} cm`)]);

    return {
      type: 'mcq',
      correct: `${perimeter} cm`,
      options,
      prompt: `Ένα ισοσκελές τρίγωνο έχει βάση ${base} cm και καθεμία από τις δύο ίσες πλευρές του έχει μήκος ${equalSide} cm. Πόση είναι η περίμετρός του;`,
      explanation: `Προσθέτουμε και τις τρεις πλευρές: ${equalSide} ＋ ${equalSide} ＋ ${base} ＝ ${2 * equalSide} ＋ ${base} ＝ ${perimeter} cm.`
    };
  } else {
    // q4: Σύγκριση περιμέτρων (π.χ. τετράγωνο πλευράς 8 cm vs ορθογώνιο 10x6 cm)
    const side = 8;
    const sqP = 4 * side; // 32 cm
    const rectL = 10;
    const rectW = 6;
    const rectP = 2 * (rectL + rectW); // 32 cm

    const options = [
      'Έχουν ακριβώς την ίδια περίμετρο ( 32 cm )',
      'Το τετράγωνο έχει μεγαλύτερη περίμετρο',
      'Το ορθογώνιο έχει μεγαλύτερη περίμετρο',
      'Δεν μπορούμε να τις συγκρίνουμε'
    ];

    return {
      type: 'mcq',
      correct: 'Έχουν ακριβώς την ίδια περίμετρο ( 32 cm )',
      options,
      prompt: `Ένα τετράγωνο έχει πλευρά ${side} cm και ένα ορθογώνιο έχει διαστάσεις ${rectL} cm και ${rectW} cm. Ποια σχέση έχουν οι περιμέτροί τους;`,
      explanation: `Περίμετρος τετραγώνου: 4 · ${side} ＝ ${sqP} cm. Περίμετρος ορθογωνίου: 2 · ( ${rectL} ＋ ${rectW} ) ＝ 2 · 16 ＝ ${rectP} cm. Άρα έχουν ακριβώς την ίδια περίμετρο!`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Περίφραξη με Πόρτα & Κόστος ανά Μέτρο (Input & MCQ)
function makeFencingProblem(isCostMCQ = false) {
  if (!isCostMCQ) {
    // q5: Περίφραξη οικοπέδου με αφαίρεση πόρτας εισόδου (Input)
    const length = [20, 25, 30][getRandomInt(0, 2)];
    const width = [12, 15, 18][getRandomInt(0, 2)];
    const gate = [3, 4, 5][getRandomInt(0, 2)];
    const fullPerimeter = 2 * (length + width);
    const wireNeeded = fullPerimeter - gate;

    return {
      type: 'input',
      correct: wireNeeded,
      unit: 'm (συρματόπλεγμα)',
      prompt: `Ένα ορθογώνιο οικόπεδο έχει μήκος ${length} m και πλάτος ${width} m. Θέλουμε να το περιφράξουμε ολόγυρα με συρματόπλεγμα, αφήνοντας μια πόρτα εισόδου πλάτους ${gate} m χωρίς σύρμα. Πόσα μέτρα ( m ) συρματόπλεγμα θα χρειαστούμε;`,
      explanation: `Υπολογίζουμε τη συνολική περίμετρο: 2 · ( ${length} ＋ ${width} ) ＝ 2 · ${length + width} ＝ ${fullPerimeter} m. Αφαιρούμε το άνοιγμα της πόρτας: ${fullPerimeter} － ${gate} ＝ ${wireNeeded} m.`
    };
  } else {
    // q6: Υπολογισμός συνολικού κόστους περίφραξης
    const side = 15; // Τετράγωνο 15x15 -> Π = 60 m
    const perimeter = 4 * side; // 60 m
    const costPerMeter = [4, 5, 6][getRandomInt(0, 2)];
    const totalCost = perimeter * costPerMeter;

    const distractors = [totalCost + 60, totalCost - 40, side * costPerMeter];
    const options = shuffleArray([`${totalCost} €`, ...distractors.map((d) => `${d} €`)]);

    return {
      type: 'mcq',
      correct: `${totalCost} €`,
      options,
      prompt: `Ένα τετράγωνο χωράφι έχει πλευρά ${side} m. Αν το σύρμα περίφραξης κοστίζει ${costPerMeter} € το μέτρο, ποιο είναι το συνολικό κόστος για να περιφραχτεί ολόκληρο το χωράφι;`,
      explanation: `Βρίσκουμε την περίμετρο του τετραγώνου: 4 · ${side} ＝ ${perimeter} m. Πολλαπλασιάζουμε με την τιμή ανά μέτρο: ${perimeter} · ${costPerMeter} € ＝ ${totalCost} €.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετο Σχήμα & Έννοια Περιμέτρου vs Εμβαδού (Input & MCQ)
function makeComplexShapePerimeterQuestion(isConceptMCQ = false) {
  if (!isConceptMCQ) {
    // q7: Περίμετρος σχήματος L (κλιμακωτού)
    // Σε σχήμα L με εξωτερικό μήκος L και ύψος H, η περίμετρος ισούται με 2 · (L + H)
    const totalW = [14, 16, 18][getRandomInt(0, 2)];
    const totalH = [10, 12, 15][getRandomInt(0, 2)];
    const perimeter = 2 * (totalW + totalH);

    return {
      type: 'input',
      correct: perimeter,
      unit: 'cm (περίμετρος)',
      prompt: `Ένα κλιμακωτό πολύγωνο σχήματος «L» έχει μέγιστο εξωτερικό μήκος ${totalW} cm και μέγιστο εξωτερικό ύψος ${totalH} cm. Πόσα cm είναι η συνολική περίμετρός του;`,
      explanation: `Σε ένα σχήμα «L», τα εσωτερικά «σκαλοπάτια» όταν μετατοπιστούν προς τα έξω ισούνται ακριβώς με το μέγιστο μήκος και ύψος. Επομένως, η περίμετρος ισούται με εκείνη του περιγεγραμμένου ορθογωνίου: 2 · ( ${totalW} ＋ ${totalH} ) ＝ 2 · ${totalW + totalH} ＝ ${perimeter} cm.`
    };
  } else {
    // q8: Θεμελιώδης διάκριση Περιμέτρου από Εμβαδόν
    const options = [
      'Η περίμετρος μετράει το μήκος του περιγράμματος (σε m/cm), ενώ το εμβαδόν μετράει την επιφάνεια (σε m²/cm²)',
      'Η περίμετρος και το εμβαδόν μετριούνται και τα δύο σε τετραγωνικά μέτρα',
      'Η περίμετρος ισούται πάντα με το γινόμενο των πλευρών',
      'Δύο σχήματα με την ίδια περίμετρο έχουν υποχρεωτικά και το ίδιο εμβαδόν'
    ];

    return {
      type: 'mcq',
      correct: 'Η περίμετρος μετράει το μήκος του περιγράμματος (σε m/cm), ενώ το εμβαδόν μετράει την επιφάνεια (σε m²/cm²)',
      options,
      prompt: `Ποια είναι η βασική μαθηματική διαφορά μεταξύ Περιμέτρου και Εμβαδού;`,
      explanation: `Η περίμετρος είναι μονοδιάστατο μέγεθος (μήκος περιγράμματος γύρω-γύρω) και εκφράζεται σε m ή cm. Το εμβαδόν είναι δισδιάστατο μέγεθος (μέγεθος καλυπτόμενης επιφάνειας) και εκφράζεται σε m² ή cm².`
    };
  }
}

function generateQuestions() {
  return {
    q1: makeRectanglePerimeterQuestion(false),
    q2: makeRectanglePerimeterQuestion(true),
    q3: makeTriangleAndComparisonQuestion(false),
    q4: makeTriangleAndComparisonQuestion(true),
    q5: makeFencingProblem(false),
    q6: makeFencingProblem(true),
    q7: makeComplexShapePerimeterQuestion(false),
    q8: makeComplexShapePerimeterQuestion(true)
  };
}

export default function PerimetrosAskPage() {
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

  // Αυστηρό φιλτράρισμα: μόνο αριθμοί 0-9, το πολύ ένα κόμμα, όριο 10 χαρακτήρες
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
      title="Ασκήσεις: Περίμετρος Σχημάτων - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στην περίμετρο: ορθογώνια, τρίγωνα, σύνθετα σχήματα και πρακτικά προβλήματα περίφραξης οικοπέδων."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/24-perimetros"
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
              📝 Ασκήσεις: Η Περίμετρος των Σχημάτων
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
          {renderInput('q1', questions.q1, 1, 'ΠΕΡΙΜΕΤΡΟΣ ΟΡΘΟΓΩΝΙΟΥ ΟΙΚΟΠΕΔΟΥ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΕΥΡΕΣΗ ΠΛΑΤΟΥΣ ΑΠΟ ΠΕΡΙΜΕΤΡΟ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΠΕΡΙΜΕΤΡΟΣ ΙΣΟΣΚΕΛΟΥΣ ΤΡΙΓΩΝΟΥ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΣΥΓΚΡΙΣΗ ΠΕΡΙΜΕΤΡΩΝ ΣΧΗΜΑΤΩΝ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΠΕΡΙΦΡΑΞΗ ΜΕ ΑΦΑΙΡΕΣΗ ΠΟΡΤΑΣ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΥΠΟΛΟΓΙΣΜΟΣ ΚΟΣΤΟΥΣ ΠΕΡΙΦΡΑΞΗΣ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΠΕΡΙΜΕΤΡΟΣ ΣΥΝΘΕΤΟΥ ΣΧΗΜΑΤΟΣ L', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΔΙΑΦΟΡΑ ΠΕΡΙΜΕΤΡΟΥ ΚΑΙ ΕΜΒΑΔΟΥ', 'bg-purple-600')}

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

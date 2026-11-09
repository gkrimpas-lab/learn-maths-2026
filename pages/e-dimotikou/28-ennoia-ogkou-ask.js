// pages/e-dimotikou/28-ennoia-ogkou-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Ε')/g);
  return parts
    .map((part) => {
      if (part === "Ε'") return "Ε'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function Fraction({ numerator, denominator, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-mono leading-none ${className}`}>
      <span className="px-1 text-[0.9em] border-b-2 border-current pb-0.5 w-full block">
        {numerator}
      </span>
      <span className="px-1 text-[0.9em] pt-0.5 w-full block">
        {denominator}
      </span>
    </span>
  );
}

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

const translations = {
  el: {
    pageTitle: "Ασκήσεις: Η Έννοια του Όγκου - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στον όγκο: ορθογώνιο παραλληλεπίπεδο, κύβος, χωρητικότητα σε λίτρα και προβλήματα καθημερινής ζωής.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeHeader: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "📝 Ασκήσεις: Η Έννοια του Όγκου",
    subtitle: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    footerPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctFeedbackPrefix: "Η σωστή απάντηση είναι:",
    q1Badge: "ΟΓΚΟΣ ΟΡΘΟΓΩΝΙΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ",
    q2Badge: "ΕΥΡΕΣΗ ΥΨΟΥΣ ΑΠΟ ΓΝΩΣΤΟ ΟΓΚΟ",
    q3Badge: "ΤΙ ΕΚΦΡΑΖΕΙ Ο ΟΓΚΟΣ & ΤΟ cm³",
    q4Badge: "ΣΥΓΚΡΙΣΗ ΟΓΚΟΥ ΣΤΕΡΕΩΝ",
    q5Badge: "ΟΓΚΟΣ ΚΥΒΟΥ ( α · α · α )",
    q6Badge: "ΕΥΡΕΣΗ ΑΚΜΗΣ ΚΥΒΟΥ ΑΠΟ ΟΓΚΟ",
    q7Badge: "ΧΩΡΗΤΙΚΟΤΗΤΑ ΕΝΥΔΡΕΙΟΥ ΣΕ ΛΙΤΡΑ ( l )",
    q8Badge: "ΣΧΕΣΗ ΛΙΤΡΟΥ ΜΕ ΚΥΒΙΚΑ ΕΚΑΤΟΣΤΑ"
  },
  en: {
    pageTitle: "Exercises: Concept of Volume - 5th Grade | LearnMaths.gr",
    pageDescription: "Challenging 5th Grade math exercises on volume: rectangular prisms, cubes, liquid capacity in liters, and practical applications.",
    backText: "5th Grade",
    theoryBtn: "Theory",
    badgeHeader: "5TH GRADE • PRACTICE",
    mainTitle: "📝 Exercises: The Concept of Volume",
    subtitle: "Every time you click 'New Exercises', fresh problems are generated from the pool!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success:",
    footerPrompt: "Fill in your answers and click 'Check Answers'!",
    correctFeedbackPrefix: "The correct answer is:",
    q1Badge: "RECTANGULAR PRISM VOLUME",
    q2Badge: "FIND HEIGHT FROM KNOWN VOLUME",
    q3Badge: "WHAT VOLUME & cm³ REPRESENT",
    q4Badge: "COMPARING SOLID VOLUMES",
    q5Badge: "VOLUME OF A CUBE ( a · a · a )",
    q6Badge: "FIND CUBE EDGE FROM VOLUME",
    q7Badge: "AQUARIUM CAPACITY IN LITERS ( l )",
    q8Badge: "RELATION OF LITERS TO CUBIC CENTIMETERS"
  }
};

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Όγκος Ορθογωνίου Παραλληλεπιπέδου & Ανάστροφος Υπολογισμός (Input)
function makeCuboidVolumeQuestion(isReverse, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isReverse) {
    const length = [5, 6, 8, 10][getRandomInt(0, 3)];
    const width = [3, 4, 5][getRandomInt(0, 2)];
    const height = [2, 3, 4][getRandomInt(0, 2)];
    const volume = length * width * height;

    const unit = isEn ? 'cm³ (volume)' : 'cm³ (όγκος)';
    const prompt = isEn
      ? `A box has a length of ${formatNum(length)} cm, a width of ${formatNum(width)} cm, and a height of ${formatNum(height)} cm. How many cm³ is its volume?`
      : `Ένα κουτί έχει μήκος ${formatNum(length)} cm, πλάτος ${formatNum(width)} cm και ύψος ${formatNum(height)} cm. Πόσα cm³ είναι ο όγκος του;`;

    const explanation = isEn ? (
      <span>
        The volume formula for a rectangular prism is: V ＝ Length · Width · Height. Therefore: {formatNum(length)} · {formatNum(width)} · {formatNum(height)} ＝ {formatNum(length * width)} · {formatNum(height)} ＝ {formatNum(volume)} cm³.
      </span>
    ) : (
      <span>
        Ο τύπος του όγκου ορθογωνίου παραλληλεπιπέδου είναι: V ＝ Μήκος · Πλάτος · Ύψος. Επομένως: {formatNum(length)} · {formatNum(width)} · {formatNum(height)} ＝ {formatNum(length * width)} · {formatNum(height)} ＝ {formatNum(volume)} cm³.
      </span>
    );

    return {
      type: 'input',
      correct: volume,
      unit,
      prompt,
      explanation
    };
  } else {
    const length = [6, 8, 10][getRandomInt(0, 2)];
    const width = [4, 5][getRandomInt(0, 1)];
    const height = [3, 4, 6][getRandomInt(0, 2)];
    const baseArea = length * width;
    const volume = baseArea * height;

    const unit = isEn ? 'cm (height)' : 'cm (ύψος)';
    const prompt = isEn
      ? `The volume of a rectangular prism is ${formatNum(volume)} cm³. If its length is ${formatNum(length)} cm and its width is ${formatNum(width)} cm, how many cm is its height?`
      : `Ο όγκος ενός ορθογωνίου παραλληλεπιπέδου είναι ${formatNum(volume)} cm³. Αν το μήκος του είναι ${formatNum(length)} cm και το πλάτος του είναι ${formatNum(width)} cm, πόσα cm είναι το ύψος του;`;

    const explanation = isEn ? (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>First calculate base area: {formatNum(length)} · {formatNum(width)} ＝ ${formatNum(baseArea)} cm². Then divide volume by base area:</span>
        <Fraction numerator={formatNum(volume)} denominator={formatNum(baseArea)} />
        <span>＝ {formatNum(height)} cm.</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>Πρώτα υπολογίζουμε το εμβαδόν της βάσης: {formatNum(length)} · {formatNum(width)} ＝ ${formatNum(baseArea)} cm². Στη συνέχεια διαιρούμε τον όγκο με το εμβαδόν της βάσης:</span>
        <Fraction numerator={formatNum(volume)} denominator={formatNum(baseArea)} />
        <span>＝ {formatNum(height)} cm.</span>
      </span>
    );

    return {
      type: 'input',
      correct: height,
      unit,
      prompt,
      explanation
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Θεωρία Όγκου & Σύγκριση Στερεών (MCQ)
function makeVolumeTheoryAndComparisonQuestion(isComparison, isEn) {
  if (!isComparison) {
    const correctEl = 'Τον τρισδιάστατο χώρο που καταλαμβάνει ένα σώμα, πολλαπλασιάζοντας 3 διαστάσεις ( μήκος · πλάτος · ύψος )';
    const correctEn = 'The 3-dimensional space occupied by a body, multiplying 3 dimensions ( length · width · height )';

    const rawOptions = isEn
      ? [
          correctEn,
          'The 2-dimensional boundary surface of a geometric shape',
          'The total linear length of all edges of the box',
          'The physical weight of the solid in kilograms'
        ]
      : [
          correctEl,
          'Την επιφάνεια του περιγράμματος ενός σχήματος σε 2 διαστάσεις',
          'Το συνολικό μήκος όλων των ακμών του κουτιού',
          'Το βάρος του αντικειμένου σε κιλά'
        ];

    const prompt = isEn
      ? 'What does the VOLUME of a geometric solid represent, and why is it expressed in cm³ (cubic centimeters)?'
      : 'Τι εκφράζει ο ΌΓΚΟΣ ενός γεωμετρικού στερεού και γιατί γράφεται με μονάδα cm³ (κυβικά εκατοστά);';

    const explanation = isEn
      ? 'Volume measures the extent of 3-dimensional space occupied by a solid object. The unit cm³ has an exponent of 3 because we multiply 3 dimensions: length, width, and height!'
      : 'Ο όγκος εκφράζει το μέγεθος του τρισδιάστατου χώρου που καταλαμβάνει ένα στερεό. Η μονάδα cm³ έχει εκθέτη 3 επειδή πολλαπλασιάζουμε 3 διαστάσεις: μήκος, πλάτος και ύψος!';

    return {
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt,
      explanation
    };
  } else {
    const cases = [
      {
        textAEl: 'Στερεό Α ( 4 cm × 3 cm × 5 cm ＝ 60 cm³ )',
        textBEl: 'Στερεό Β ( 6 cm × 2 cm × 6 cm ＝ 72 cm³ )',
        textAEn: 'Solid A ( 4 cm × 3 cm × 5 cm ＝ 60 cm³ )',
        textBEn: 'Solid B ( 6 cm × 2 cm × 6 cm ＝ 72 cm³ )',
        correctEl: 'Το Στερεό Β έχει μεγαλύτερο όγκο ( 72 cm³ έναντι 60 cm³ )',
        correctEn: 'Solid B has a larger volume ( 72 cm³ vs 60 cm³ )',
        optionsEl: [
          'Το Στερεό Β έχει μεγαλύτερο όγκο ( 72 cm³ έναντι 60 cm³ )',
          'Το Στερεό Α έχει μεγαλύτερο όγκο ( 60 cm³ έναντι 48 cm³ )',
          'Έχουν ακριβώς τον ίδιο όγκο',
          'Δεν μπορούμε να συγκρίνουμε στερεά με διαφορετικές διαστάσεις'
        ],
        optionsEn: [
          'Solid B has a larger volume ( 72 cm³ vs 60 cm³ )',
          'Solid A has a larger volume ( 60 cm³ vs 48 cm³ )',
          'They have exactly the same volume',
          'Solids with different dimensions cannot be compared'
        ],
        explEl: 'Υπολογίζουμε τους όγκους: Στερεό Α ＝ 4 · 3 · 5 ＝ 60 cm³. Στερεό Β ＝ 6 · 2 · 6 ＝ 72 cm³. Επομένως, το Στερεό Β έχει μεγαλύτερο όγκο.',
        explEn: 'Calculate the volumes: Solid A ＝ 4 · 3 · 5 ＝ 60 cm³. Solid B ＝ 6 · 2 · 6 ＝ 72 cm³. Therefore, Solid B has a larger volume.'
      }
    ];

    const c = cases[0];

    return {
      type: 'mcq',
      correct: isEn ? c.correctEn : c.correctEl,
      options: shuffleArray([...new Set(isEn ? c.optionsEn : c.optionsEl)]),
      prompt: isEn
        ? `Which of the two boxes occupies more 3D space: ${c.textAEn} or ${c.textBEn}?`
        : `Ποιο από τα δύο κουτιά καταλαμβάνει μεγαλύτερο χώρο: ${c.textAEl} ή ${c.textBEl};`,
      explanation: isEn ? c.explEn : c.explEl
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Όγκος Κύβου & Ανάστροφη Εύρεση Ακμής (Input & MCQ)
function makeCubeVolumeQuestion(isMCQ, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isMCQ) {
    const edge = [3, 4, 5, 6][getRandomInt(0, 3)];
    const volume = edge * edge * edge;

    const unit = isEn ? 'cm³ (cube volume)' : 'cm³ (όγκος κύβου)';
    const prompt = isEn
      ? `A cube has an edge length of ${formatNum(edge)} cm. How many cm³ is its volume?`
      : `Ένας κύβος έχει ακμή (πλευρά) ${formatNum(edge)} cm. Πόσα cm³ είναι ο όγκος του;`;

    const explanation = isEn ? (
      <span>
        In a cube, all dimensions are equal (a). The volume formula is: V ＝ a · a · a. Therefore: {formatNum(edge)} · {formatNum(edge)} · {formatNum(edge)} ＝ {formatNum(edge * edge)} · {formatNum(edge)} ＝ {formatNum(volume)} cm³.
      </span>
    ) : (
      <span>
        Στον κύβο όλες οι διαστάσεις είναι ίσες (α). Ο τύπος του όγκου είναι: V ＝ α · α · α. Επομένως: {formatNum(edge)} · {formatNum(edge)} · {formatNum(edge)} ＝ {formatNum(edge * edge)} · {formatNum(edge)} ＝ {formatNum(volume)} cm³.
      </span>
    );

    return {
      type: 'input',
      correct: volume,
      unit,
      prompt,
      explanation
    };
  } else {
    const cases = [
      { vol: 27, edge: 3 },
      { vol: 64, edge: 4 },
      { vol: 125, edge: 5 },
      { vol: 216, edge: 6 },
      { vol: 1000, edge: 10 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const distractors = [c.edge + 2, Math.max(2, c.edge - 1), Math.round(c.vol / 3)];
    const rawOptions = [c.edge, ...distractors].map((d) => `${formatNum(d)} cm`);

    const prompt = isEn
      ? `The volume of a cube is ${formatNum(c.vol)} cm³. What is the length of its edge?`
      : `Ο όγκος ενός κύβου είναι ${formatNum(c.vol)} cm³. Πόσο είναι το μήκος της ακμής (πλευράς) του;`;

    const explanation = isEn
      ? `We determine which number multiplied by itself three times gives ${formatNum(c.vol)}. Since ${formatNum(c.edge)} · ${formatNum(c.edge)} · ${formatNum(c.edge)} ＝ ${formatNum(c.vol)}, the cube edge is ${formatNum(c.edge)} cm.`
      : `Αναζητούμε ποιος αριθμός όταν πολλαπλασιαστεί τρεις φορές με τον εαυτό του δίνει ${formatNum(c.vol)}. Επειδή ${formatNum(c.edge)} · ${formatNum(c.edge)} · ${formatNum(c.edge)} ＝ ${formatNum(c.vol)}, η ακμή του κύβου είναι ${formatNum(c.edge)} cm.`;

    return {
      type: 'mcq',
      correct: `${formatNum(c.edge)} cm`,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt,
      explanation
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Χωρητικότητα σε Λίτρα & Πρακτικά Προβλήματα (Input & MCQ)
function makeCapacityProblem(isMCQ, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isMCQ) {
    const lengthDm = [5, 6, 8][getRandomInt(0, 2)];
    const widthDm = [3, 4, 5][getRandomInt(0, 2)];
    const heightDm = [4, 5][getRandomInt(0, 1)];
    const volumeDm3 = lengthDm * widthDm * heightDm;

    const unit = isEn ? 'liters ( l )' : 'λίτρα ( l )';
    const prompt = isEn
      ? `An aquarium has inner dimensions: length ${formatNum(lengthDm)} dm, width ${formatNum(widthDm)} dm, and height ${formatNum(heightDm)} dm. How many liters ( l ) of water does it hold when completely full?`
      : `Ένα ενυδρείο έχει εσωτερικές διαστάσεις: μήκος ${formatNum(lengthDm)} dm, πλάτος ${formatNum(widthDm)} dm και ύψος ${formatNum(heightDm)} dm. Πόσα λίτρα ( l ) νερού χωράει όταν γεμίσει πλήρως;`;

    const explanation = isEn ? (
      <span>
        Calculate volume in dm³: {formatNum(lengthDm)} · {formatNum(widthDm)} · {formatNum(heightDm)} ＝ {formatNum(volumeDm3)} dm³. Since 1 dm³ ＝ 1 liter, the aquarium holds exactly {formatNum(volumeDm3)} liters of water!
      </span>
    ) : (
      <span>
        Υπολογίζουμε τον όγκο σε dm³: {formatNum(lengthDm)} · {formatNum(widthDm)} · {formatNum(heightDm)} ＝ {formatNum(volumeDm3)} dm³. Επειδή 1 dm³ ＝ 1 λίτρο, το ενυδρείο χωράει ακριβώς {formatNum(volumeDm3)} λίτρα νερό!
      </span>
    );

    return {
      type: 'input',
      correct: volumeDm3,
      unit,
      prompt,
      explanation
    };
  } else {
    const correctEl = '1.000 cm³';
    const correctEn = '1,000 cm³';

    const rawOptions = isEn
      ? [correctEn, '100 cm³', '10,000 cm³', '10 cm³']
      : [correctEl, '100 cm³', '10.000 cm³', '10 cm³'];

    const prompt = isEn
      ? 'How many cubic centimeters ( cm³ ) are there in exactly 1 liter ( 1 l ) of liquid?'
      : 'Σε πόσα κυβικά εκατοστά ( cm³ ) ισοδυναμεί ακριβώς 1 λίτρο ( 1 l ) υγρού;';

    const explanation = isEn ? (
      <span>
        1 liter equals 1 dm³. Since 1 dm ＝ 10 cm, we have: 1 dm³ ＝ 10 · 10 · 10 ＝ 1,000 cm³. Thus 1 liter ＝ 1,000 cm³!
      </span>
    ) : (
      <span>
        1 λίτρο ισούται με 1 dm³. Επειδή 1 dm ＝ 10 cm, έχουμε: 1 dm³ ＝ 10 · 10 · 10 ＝ 1.000 cm³. Άρα 1 λίτρο ＝ 1.000 cm³!
      </span>
    );

    return {
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt,
      explanation
    };
  }
}

function generateQuestions(isEn) {
  return {
    q1: makeCuboidVolumeQuestion(false, isEn),
    q2: makeCuboidVolumeQuestion(true, isEn),
    q3: makeVolumeTheoryAndComparisonQuestion(false, isEn),
    q4: makeVolumeTheoryAndComparisonQuestion(true, isEn),
    q5: makeCubeVolumeQuestion(false, isEn),
    q6: makeCubeVolumeQuestion(true, isEn),
    q7: makeCapacityProblem(false, isEn),
    q8: makeCapacityProblem(true, isEn)
  };
}

export default function EnnoiaOgkouAskPage() {
  const router = useRouter();
  const currentLocale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = currentLocale === 'en';
  const t = translations[currentLocale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(isEn));
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, [currentLocale]);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleStrictNumberInput = (key, rawVal) => {
    if (submitted) return;
    let clean = rawVal.replace(/\./g, ',').replace(/[^0-9,]/g, '');
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

    if (Math.abs(parseUserFloat(answers.q1) - questions.q1.correct) < 0.05) currentScore += 1;
    if (Math.abs(parseUserFloat(answers.q2) - questions.q2.correct) < 0.05) currentScore += 1;
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (Math.abs(parseUserFloat(answers.q5) - questions.q5.correct) < 0.05) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (Math.abs(parseUserFloat(answers.q7) - questions.q7.correct) < 0.05) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

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
              {toCleanUppercase(badgeTitle)}
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
                <span className="break-words whitespace-normal leading-snug flex-1">{opt}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                {t.correctFeedbackPrefix} <strong className="font-bold text-rose-950">{qData.correct}</strong>. {qData.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const userVal = parseUserFloat(answers[qKey]);
    const isCorrect = !isNaN(userVal) && Math.abs(userVal - qData.correct) < 0.05;
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
              {toCleanUppercase(badgeTitle)}
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
              <div className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                {t.correctFeedbackPrefix}{' '}
                <strong className="font-bold text-rose-950">
                  {qData.correct.toLocaleString(isEn ? 'en-US' : 'el-GR')} {qData.unit}
                </strong>
                . {qData.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/e-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/28-ennoia-ogkou"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              {toCleanUppercase(t.badgeHeader)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              {t.mainTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              {t.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newExercisesBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInput('q1', questions.q1, 1, t.q1Badge, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.q2Badge, 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, t.q3Badge, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.q4Badge, 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, t.q5Badge, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.q6Badge, 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, t.q7Badge, 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, t.q8Badge, 'bg-purple-600')}

          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 {t.submitBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
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
                <span>🔄</span> {t.newExercisesBtn}
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                {t.footerPrompt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
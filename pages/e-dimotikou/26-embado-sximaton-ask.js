// pages/e-dimotikou/26-embado-sximaton-ask.js
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
    pageTitle: "Ασκήσεις: Εμβαδόν Βασικών Σχημάτων - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στο εμβαδόν σχημάτων: τετράγωνο, ορθογώνιο, ορθογώνιο τρίγωνο και σύνθετες επιφάνειες.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeHeader: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "📝 Ασκήσεις: Εμβαδόν Βασικών Σχημάτων",
    subtitle: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    footerPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctFeedbackPrefix: "Η σωστή απάντηση είναι:",
    q1Badge: "ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ",
    q2Badge: "ΕΥΡΕΣΗ ΚΑΘΕΤΗΣ ΠΛΕΥΡΑΣ ΑΠΟ ΕΜΒΑΔΟΝ",
    q3Badge: "ΣΧΕΣΗ ΟΡΘΟΓΩΝΙΟΥ ΜΕ ΟΡΘΟΓΩΝΙΟ ΤΡΙΓΩΝΟ",
    q4Badge: "ΣΥΓΚΡΙΣΗ ΕΜΒΑΔΟΥ ΤΕΤΡΑΓΩΝΟΥ ΚΑΙ ΟΡΘΟΓΩΝΙΟΥ",
    q5Badge: "ΕΜΒΑΔΟΝ ΤΕΤΡΑΓΩΝΟΥ ΑΠΟ ΠΕΡΙΜΕΤΡΟ",
    q6Badge: "ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ΜΕ ΣΧΕΣΗ ΔΙΑΣΤΑΣΕΩΝ",
    q7Badge: "ΕΜΒΑΔΟΝ ΣΥΝΘΕΤΟΥ ΣΧΗΜΑΤΟΣ ( ΟΡΘΟΓΩΝΙΟ ＋ ΤΡΙΓΩΝΟ )",
    q8Badge: "ΑΦΑΙΡΕΣΗ ΕΠΙΦΑΝΕΙΑΣ ΑΠΟ ΟΡΘΟΓΩΝΙΟ"
  },
  en: {
    pageTitle: "Exercises: Area of Basic Shapes - 5th Grade | LearnMaths.gr",
    pageDescription: "Challenging 5th Grade math exercises on the area of plane figures: square, rectangle, right triangle, and composite shapes.",
    backText: "5th Grade",
    theoryBtn: "Theory",
    badgeHeader: "5TH GRADE • PRACTICE",
    mainTitle: "📝 Exercises: Area of Basic Geometric Shapes",
    subtitle: "Every time you click 'New Exercises', fresh problems are generated from the pool!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success:",
    footerPrompt: "Fill in your answers and click 'Check Answers'!",
    correctFeedbackPrefix: "The correct answer is:",
    q1Badge: "AREA OF RIGHT TRIANGLE",
    q2Badge: "FIND LEG LENGTH FROM AREA",
    q3Badge: "RELATION OF RECTANGLE TO RIGHT TRIANGLE",
    q4Badge: "COMPARING AREA OF SQUARE AND RECTANGLE",
    q5Badge: "SQUARE AREA FROM PERIMETER",
    q6Badge: "RECTANGLE AREA WITH PROPORTIONAL SIDES",
    q7Badge: "COMPOSITE SHAPE AREA ( RECTANGLE ＋ TRIANGLE )",
    q8Badge: "AREA SUBTRACTION FROM RECTANGLE"
  }
};

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εμβαδόν Ορθογώνιου Τριγώνου & Ανάστροφος Υπολογισμός (Input)
function makeRightTriangleAreaQuestion(isReverse, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isReverse) {
    const side1 = [6, 8, 10, 12, 14, 16][getRandomInt(0, 5)];
    const side2 = [5, 7, 9, 11, 15][getRandomInt(0, 4)];
    const area = (side1 * side2) / 2;

    const unit = isEn ? 'cm² (area)' : 'cm² (εμβαδόν)';
    const prompt = isEn
      ? `A right triangle has perpendicular legs with lengths of ${formatNum(side1)} cm and ${formatNum(side2)} cm. How many cm² is its area?`
      : `Ένα ορθογώνιο τρίγωνο έχει κάθετες πλευρές μήκους ${formatNum(side1)} cm και ${formatNum(side2)} cm. Πόσα cm² είναι το εμβαδόν του;`;

    const explanation = isEn ? (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>The right triangle area formula is: A ＝</span>
        <Fraction numerator="Base · Height" denominator="2" />
        <span>. Therefore:</span>
        <Fraction numerator={`${formatNum(side1)} · ${formatNum(side2)}`} denominator="2" />
        <span>＝</span>
        <Fraction numerator={formatNum(side1 * side2)} denominator="2" />
        <span>＝ {formatNum(area)} cm².</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>Ο τύπος του εμβαδού ορθογώνιου τριγώνου είναι: Ε ＝</span>
        <Fraction numerator="Βάση · Ύψος" denominator="2" />
        <span>. Επομένως:</span>
        <Fraction numerator={`${formatNum(side1)} · ${formatNum(side2)}`} denominator="2" />
        <span>＝</span>
        <Fraction numerator={formatNum(side1 * side2)} denominator="2" />
        <span>＝ {formatNum(area)} cm².</span>
      </span>
    );

    return {
      type: 'input',
      correct: area,
      unit,
      prompt,
      explanation
    };
  } else {
    const side1 = [8, 10, 12, 16][getRandomInt(0, 3)];
    const side2 = [6, 7, 9, 11][getRandomInt(0, 3)];
    const area = (side1 * side2) / 2;

    const unit = isEn ? 'cm (leg length)' : 'cm (μήκος κάθετης πλευράς)';
    const prompt = isEn
      ? `The area of a right triangle is ${formatNum(area)} cm² and one of its perpendicular legs measures ${formatNum(side1)} cm. How many cm is the other perpendicular leg?`
      : `Το εμβαδόν ενός ορθογώνιου τριγώνου είναι ${formatNum(area)} cm² και η μία κάθετη πλευρά του έχει μήκος ${formatNum(side1)} cm. Πόσα cm είναι η άλλη κάθετη πλευρά του;`;

    const explanation = isEn ? (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>Double the area and divide by the known leg:</span>
        <Fraction numerator={`2 · ${formatNum(area)}`} denominator={formatNum(side1)} />
        <span>＝</span>
        <Fraction numerator={formatNum(2 * area)} denominator={formatNum(side1)} />
        <span>＝ {formatNum(side2)} cm.</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>Διπλασιάζουμε το εμβαδόν και διαιρούμε με τη γνωστή πλευρά:</span>
        <Fraction numerator={`2 · ${formatNum(area)}`} denominator={formatNum(side1)} />
        <span>＝</span>
        <Fraction numerator={formatNum(2 * area)} denominator={formatNum(side1)} />
        <span>＝ {formatNum(side2)} cm.</span>
      </span>
    );

    return {
      type: 'input',
      correct: side2,
      unit,
      prompt,
      explanation
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Σχέση Ορθογωνίου με Τρίγωνο & Σύγκριση Σχημάτων (MCQ)
function makeShapeRelationshipQuestion(isComparison, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isComparison) {
    const correctEl = 'Επειδή η διαγώνιος χωρίζει το ορθογώνιο σε δύο απολύτως ίσα ορθογώνια τρίγωνα';
    const correctEn = 'Because the diagonal divides the rectangle into two congruent right triangles';

    const rawOptions = isEn
      ? [
          correctEn,
          'Because the triangle has 3 vertices',
          'Because the side lengths of a triangle are always even numbers',
          'Because its area is always equal to its perimeter'
        ]
      : [
          correctEl,
          'Επειδή το τρίγωνο έχει 3 κορυφές',
          'Επειδή οι πλευρές του τριγώνου είναι πάντοτε ζυγοί αριθμοί',
          'Επειδή το εμβαδόν του είναι ίσο με την περίμετρο'
        ];

    const prompt = isEn
      ? 'Why do we always divide by 2 in the right triangle area formula [ ( a · b ) : 2 ]?'
      : 'Για ποιον λόγο στον μαθηματικό τύπο του εμβαδού ορθογώνιου τριγώνου διαιρούμε πάντα διά 2 [ ( α · β ) ： 2 ];';

    const explanation = isEn
      ? 'Every right triangle is exactly half of a rectangle with the same dimensions, because the diagonal splits the rectangle into two identical triangles.'
      : 'Κάθε ορθογώνιο τρίγωνο αποτελεί ακριβώς το μισό ενός ορθογωνίου με τις ίδιες διαστάσεις, καθώς η διαγώνιος του ορθογωνίου το κόβει σε δύο πανομοιότυπα τρίγωνα.';

    return {
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt,
      explanation
    };
  } else {
    const sqSide = 6;
    const sqArea = sqSide * sqSide;
    const rectL = 9;
    const rectW = 4;
    const rectArea = rectL * rectW;

    const correctEl = `Έχουν ακριβώς το ίδιο εμβαδόν ( ${formatNum(sqArea)} cm² )`;
    const correctEn = `They have exactly the same area ( ${formatNum(sqArea)} cm² )`;

    const rawOptions = isEn
      ? [
          correctEn,
          'The square has a larger area',
          'The rectangle has a larger area',
          'A square cannot be compared with a rectangle'
        ]
      : [
          correctEl,
          'Το τετράγωνο έχει μεγαλύτερο εμβαδόν',
          'Το ορθογώνιο έχει μεγαλύτερο εμβαδόν',
          'Δεν μπορούμε να συγκρίνουμε τετράγωνο με ορθογώνιο'
        ];

    const prompt = isEn
      ? `A square has a side length of ${formatNum(sqSide)} cm and a rectangle has a length of ${formatNum(rectL)} cm and a width of ${formatNum(rectW)} cm. What is the relation between their areas?`
      : `Ένα τετράγωνο έχει πλευρά ${formatNum(sqSide)} cm και ένα ορθογώνιο έχει μήκος ${formatNum(rectL)} cm και πλάτος ${formatNum(rectW)} cm. Ποια σχέση έχουν τα εμβαδά τους;`;

    const explanation = isEn
      ? `Square area: ${formatNum(sqSide)} · ${formatNum(sqSide)} ＝ ${formatNum(sqArea)} cm². Rectangle area: ${formatNum(rectL)} · ${formatNum(rectW)} ＝ ${formatNum(rectArea)} cm². Both figures have identical areas (${formatNum(sqArea)} cm²)!`
      : `Εμβαδόν τετραγώνου: ${formatNum(sqSide)} · ${formatNum(sqSide)} ＝ ${formatNum(sqArea)} cm². Εμβαδόν ορθογωνίου: ${formatNum(rectL)} · ${formatNum(rectW)} ＝ ${formatNum(rectArea)} cm². Άρα τα δύο σχήματα είναι ισεμβαδικά (έχουν ακριβώς το ίδιο εμβαδόν ${formatNum(sqArea)} cm²)!`;

    return {
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt,
      explanation
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Εμβαδόν Τετραγώνου & Ορθογωνίου με Εφαρμογές (Input & MCQ)
function makeSquareAndRectangleQuestion(isMCQ, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isMCQ) {
    const side = [5, 6, 8, 9, 11][getRandomInt(0, 4)];
    const perimeter = 4 * side;
    const area = side * side;

    const unit = isEn ? 'cm² (area)' : 'cm² (εμβαδόν)';
    const prompt = isEn
      ? `The perimeter of a square is ${formatNum(perimeter)} cm. How many cm² is its area?`
      : `Η περίμετρος ενός τετραγώνου είναι ${formatNum(perimeter)} cm. Πόσα cm² είναι το εμβαδόν του;`;

    const explanation = isEn
      ? `First find the side length by dividing perimeter by 4: ${formatNum(perimeter)} ： 4 ＝ ${formatNum(side)} cm. Then calculate area: ${formatNum(side)} · ${formatNum(side)} ＝ ${formatNum(area)} cm².`
      : `Πρώτα βρίσκουμε την πλευρά του τετραγώνου διαιρώντας την περίμετρο με το 4: ${formatNum(perimeter)} ： 4 ＝ ${formatNum(side)} cm. Στη συνέχεια υπολογίζουμε το εμβαδόν: ${formatNum(side)} · ${formatNum(side)} ＝ ${formatNum(area)} cm².`;

    return {
      type: 'input',
      correct: area,
      unit,
      prompt,
      explanation
    };
  } else {
    const width = [4, 5, 6, 7][getRandomInt(0, 3)];
    const length = width * 2;
    const area = length * width;

    const distractors = [area + 12, area - 8, length + width, 2 * (length + width)];
    const rawOptions = [area, ...distractors.slice(0, 3)].map((val) => `${formatNum(val)} cm²`);

    const prompt = isEn
      ? `A rectangle has a width of ${formatNum(width)} cm and its length is double its width. What is its area?`
      : `Ένα ορθογώνιο έχει πλάτος ${formatNum(width)} cm και το μήκος του είναι διπλάσιο από το πλάτος. Πόσο είναι το εμβαδόν του;`;

    const explanation = isEn
      ? `Length is: 2 · ${formatNum(width)} ＝ ${formatNum(length)} cm. Area is: Length · Width ＝ ${formatNum(length)} · ${formatNum(width)} ＝ ${formatNum(area)} cm².`
      : `Το μήκος είναι: 2 · ${formatNum(width)} ＝ ${formatNum(length)} cm. Το εμβαδόν είναι: Μήκος · Πλάτος ＝ ${formatNum(length)} · ${formatNum(width)} ＝ ${formatNum(area)} cm².`;

    return {
      type: 'mcq',
      correct: `${formatNum(area)} cm²`,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt,
      explanation
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετο Σχήμα & Τεμαχισμός Επιφάνειας (Input & MCQ)
function makeCompositeShapeQuestion(isMCQ, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isMCQ) {
    const rectL = 10;
    const commonH = [6, 8][getRandomInt(0, 1)];
    const triBase = [4, 6][getRandomInt(0, 1)];
    const rectArea = rectL * commonH;
    const triArea = (triBase * commonH) / 2;
    const totalArea = rectArea + triArea;

    const unit = isEn ? 'cm² (total area)' : 'cm² (συνολικό εμβαδόν)';
    const prompt = isEn
      ? `A composite shape consists of a rectangle with dimensions ${formatNum(rectL)} cm × ${formatNum(commonH)} cm and an adjacent right triangle with base ${formatNum(triBase)} cm and height ${formatNum(commonH)} cm. How many cm² is the total area of the shape?`
      : `Ένα γεωμετρικό σχήμα αποτελείται από ένα ορθογώνιο διαστάσεων ${formatNum(rectL)} cm × ${formatNum(commonH)} cm και ένα ορθογώνιο τρίγωνο κολλημένο στην πλευρά του, με βάση ${formatNum(triBase)} cm και ύψος ${formatNum(commonH)} cm. Πόσα cm² είναι το συνολικό εμβαδόν του σύνθετου σχήματος;`;

    const explanation = isEn ? (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>Rectangle area ＝ {formatNum(rectL)} · ${formatNum(commonH)} ＝ {formatNum(rectArea)} cm².</span>
        <span>Triangle area ＝</span>
        <Fraction numerator={`${formatNum(triBase)} · ${formatNum(commonH)}`} denominator="2" />
        <span>＝</span>
        <Fraction numerator={formatNum(triBase * commonH)} denominator="2" />
        <span>＝ {formatNum(triArea)} cm². Total area: {formatNum(rectArea)} ＋ {formatNum(triArea)} ＝ {formatNum(totalArea)} cm².</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>Εμβαδόν ορθογωνίου ＝ {formatNum(rectL)} · ${formatNum(commonH)} ＝ {formatNum(rectArea)} cm².</span>
        <span>Εμβαδόν τριγώνου ＝</span>
        <Fraction numerator={`${formatNum(triBase)} · ${formatNum(commonH)}`} denominator="2" />
        <span>＝</span>
        <Fraction numerator={formatNum(triBase * commonH)} denominator="2" />
        <span>＝ {formatNum(triArea)} cm². Συνολικό εμβαδόν: {formatNum(rectArea)} ＋ {formatNum(triArea)} ＝ {formatNum(totalArea)} cm².</span>
      </span>
    );

    return {
      type: 'input',
      correct: totalArea,
      unit,
      prompt,
      explanation
    };
  } else {
    const rectL = 12;
    const rectW = 8;
    const rectArea = rectL * rectW;
    const holeSide = 4;
    const holeArea = holeSide * holeSide;
    const remainingArea = rectArea - holeArea;

    const distractors = [remainingArea + 16, remainingArea - 10, rectArea / 2];
    const rawOptions = [remainingArea, ...distractors].map((val) => `${formatNum(val)} cm²`);

    const prompt = isEn
      ? `From a rectangular sheet of cardboard with dimensions ${formatNum(rectL)} cm × ${formatNum(rectW)} cm, a square piece with side ${formatNum(holeSide)} cm is cut out and removed. What is the remaining area?`
      : `Από ένα ορθογώνιο χαρτόνι διαστάσεων ${formatNum(rectL)} cm × ${formatNum(rectW)} cm κόβουμε και αφαιρούμε ένα τετράγωνο κομμάτι με πλευρά ${formatNum(holeSide)} cm. Πόσο είναι το εμβαδόν του χαρτονιού που απομένει;`;

    const explanation = isEn
      ? `Initial area: ${formatNum(rectL)} · ${formatNum(rectW)} ＝ ${formatNum(rectArea)} cm². Removed square area: ${formatNum(holeSide)} · ${formatNum(holeSide)} ＝ ${formatNum(holeArea)} cm². Remaining area: ${formatNum(rectArea)} － ${formatNum(holeArea)} ＝ ${formatNum(remainingArea)} cm².`
      : `Αρχικό εμβαδόν: ${formatNum(rectL)} · ${formatNum(rectW)} ＝ ${formatNum(rectArea)} cm². Εμβαδόν κομματιού που κόπηκε: ${formatNum(holeSide)} · ${formatNum(holeSide)} ＝ ${formatNum(holeArea)} cm². Εμβαδόν που απέμεινε: ${formatNum(rectArea)} － ${formatNum(holeArea)} ＝ ${formatNum(remainingArea)} cm².`;

    return {
      type: 'mcq',
      correct: `${formatNum(remainingArea)} cm²`,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt,
      explanation
    };
  }
}

function generateQuestions(isEn) {
  return {
    q1: makeRightTriangleAreaQuestion(false, isEn),
    q2: makeRightTriangleAreaQuestion(true, isEn),
    q3: makeShapeRelationshipQuestion(false, isEn),
    q4: makeShapeRelationshipQuestion(true, isEn),
    q5: makeSquareAndRectangleQuestion(false, isEn),
    q6: makeSquareAndRectangleQuestion(true, isEn),
    q7: makeCompositeShapeQuestion(false, isEn),
    q8: makeCompositeShapeQuestion(true, isEn)
  };
}

export default function EmbadoSximatonAskPage() {
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
          href="/e-dimotikou/26-embado-sximaton"
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
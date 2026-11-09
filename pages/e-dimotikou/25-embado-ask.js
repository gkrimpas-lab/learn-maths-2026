// pages/e-dimotikou/25-embado-ask.js
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

const dictionary = {
  el: {
    pageTitle: "Ασκήσεις: Η Έννοια του Εμβαδού - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στο εμβαδόν: ορθογώνια, τετράγωνα, πλακόστρωση επιφανειών και διάκριση περιμέτρου από εμβαδόν.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badge: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Ασκήσεις: Η Έννοια του Εμβαδού",
    mainSubtitle: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreText: "Σκορ:",
    successText: "Επιτυχία:",
    bottomPromptText: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctAnswerPrefix: "Η σωστή απάντηση είναι:",
    rectAreaBadge: "ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ( ΜΗΚΟΣ · ΠΛΑΤΟΣ )",
    findWidthBadge: "ΕΥΡΕΣΗ ΠΛΑΤΟΥΣ ΑΠΟ ΕΜΒΑΔΟΝ",
    areaConceptBadge: "ΕΝΝΟΙΑ ΤΟΥ ΕΜΒΑΔΟΥ",
    squareCmBadge: "ΤΟ ΤΕΤΡΑΓΩΝΙΚΟ ΕΚΑΤΟΣΤΟ ( 1 cm² )",
    squareAreaBadge: "ΕΜΒΑΔΟΝ ΤΕΤΡΑΓΩΝΟΥ ( α · α )",
    squareSideBadge: "ΕΥΡΕΣΗ ΠΛΕΥΡΑΣ ΤΕΤΡΑΓΩΝΟΥ ΑΠΟ ΕΜΒΑΔΟΝ",
    tilingBadge: "ΠΛΑΚΟΣΤΡΩΣΗ ΕΠΙΦΑΝΕΙΑΣ ΜΕ ΠΛΑΚΑΚΙΑ",
    perimeterVsAreaBadge: "ΙΔΙΑ ΠΕΡΙΜΕΤΡΟΣ - ΔΙΑΦΟΡΕΤΙΚΟ ΕΜΒΑΔΟΝ"
  },
  en: {
    pageTitle: "Exercises: Concept of Area - Grade 5 | LearnMaths.gr",
    pageDesc: "Grade 5 math exercises on area: rectangles, squares, surface tiling, and distinguishing perimeter from area.",
    backText: "Grade 5",
    theoryBtn: "Theory",
    badge: "GRADE 5 • PRACTICE",
    mainTitle: "Exercises: The Concept of Area",
    mainSubtitle: "Each time you click \"New Exercises\", a fresh set of problems is generated!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreText: "Score:",
    successText: "Success:",
    bottomPromptText: "Complete the exercises and click \"Check Answers\"!",
    correctAnswerPrefix: "The correct answer is:",
    rectAreaBadge: "AREA OF RECTANGLE ( LENGTH · WIDTH )",
    findWidthBadge: "FINDING WIDTH FROM AREA",
    areaConceptBadge: "CONCEPT OF AREA",
    squareCmBadge: "THE SQUARE CENTIMETER ( 1 cm² )",
    squareAreaBadge: "AREA OF SQUARE ( a · a )",
    squareSideBadge: "FINDING SQUARE SIDE FROM AREA",
    tilingBadge: "SURFACE TILING WITH TILES",
    perimeterVsAreaBadge: "SAME PERIMETER - DIFFERENT AREA"
  }
};

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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εμβαδόν Ορθογωνίου & Ανάστροφος Υπολογισμός (Input)
function makeRectangleAreaQuestion(isFindDimension = false, locale = 'el') {
  const isEl = locale === 'el';
  const numLoc = isEl ? 'el-GR' : 'en-US';

  if (!isFindDimension) {
    const length = [8, 12, 15, 16, 20][getRandomInt(0, 4)];
    const width = [5, 6, 7, 9, 10][getRandomInt(0, 4)];
    const area = length * width;

    return {
      type: 'input',
      correct: area,
      unit: isEl ? 'cm² (εμβαδόν)' : 'cm² (area)',
      prompt: isEl
        ? `Ένα ορθογώνιο παραλληλόγραμμο έχει μήκος ${length.toLocaleString(numLoc)} cm και πλάτος ${width.toLocaleString(numLoc)} cm. Πόσα cm² είναι το εμβαδόν του;`
        : `A rectangle has a length of ${length.toLocaleString(numLoc)} cm and a width of ${width.toLocaleString(numLoc)} cm. How many cm² is its area?`,
      explanation: isEl ? (
        <span>
          Ο τύπος του εμβαδού ορθογωνίου είναι: Ε ＝ Μήκος · Πλάτος. Επομένως: {length.toLocaleString(numLoc)} · {width.toLocaleString(numLoc)} ＝ {area.toLocaleString(numLoc)} cm².
        </span>
      ) : (
        <span>
          The formula for the area of a rectangle is: A ＝ Length · Width. Therefore: {length.toLocaleString(numLoc)} · {width.toLocaleString(numLoc)} ＝ {area.toLocaleString(numLoc)} cm².
        </span>
      )
    };
  } else {
    const length = [12, 15, 18, 20][getRandomInt(0, 3)];
    const width = [6, 7, 8, 9][getRandomInt(0, 3)];
    const area = length * width;

    return {
      type: 'input',
      correct: width,
      unit: isEl ? 'cm (πλάτος)' : 'cm (width)',
      prompt: isEl
        ? `Το εμβαδόν ενός ορθογωνίου είναι ${area.toLocaleString(numLoc)} cm² και το μήκος του είναι ${length.toLocaleString(numLoc)} cm. Πόσα cm είναι το πλάτος του;`
        : `The area of a rectangle is ${area.toLocaleString(numLoc)} cm² and its length is ${length.toLocaleString(numLoc)} cm. How many cm is its width?`,
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>Για να βρούμε την άγνωστη διάσταση, διαιρούμε το εμβαδόν με τη γνωστή πλευρά:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold">
            <span>Πλάτος ＝</span>
            <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
              <span className="border-b border-slate-700 w-full text-center pb-0.5">Εμβαδόν</span>
              <span className="pt-0.5">Μήκος</span>
            </span>
            <span>＝</span>
            <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
              <span className="border-b border-slate-700 w-full text-center pb-0.5">{area.toLocaleString(numLoc)}</span>
              <span className="pt-0.5">{length.toLocaleString(numLoc)}</span>
            </span>
            <span>＝ {width.toLocaleString(numLoc)} cm.</span>
          </span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>To find the missing dimension, we divide the area by the known side:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold">
            <span>Width ＝</span>
            <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
              <span className="border-b border-slate-700 w-full text-center pb-0.5">Area</span>
              <span className="pt-0.5">Length</span>
            </span>
            <span>＝</span>
            <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
              <span className="border-b border-slate-700 w-full text-center pb-0.5">{area.toLocaleString(numLoc)}</span>
              <span className="pt-0.5">{length.toLocaleString(numLoc)}</span>
            </span>
            <span>＝ {width.toLocaleString(numLoc)} cm.</span>
          </span>
        </span>
      )
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Έννοια Εμβαδού & Τετραγωνικό Εκατοστό (MCQ)
function makeAreaConceptQuestion(isSquareCm = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isSquareCm) {
    const rawOptions = isEl
      ? [
          'Το μέγεθος της επίπεδης επιφάνειας που περικλείεται μέσα στο σχήμα',
          'Το συνολικό μήκος του περιγράμματος γύρω-γύρω από το σχήμα',
          'Το βάρος του γεωμετρικού σχήματος',
          'Τον αριθμό των κορυφών του πολυγώνου'
        ]
      : [
          'The size of the flat surface region enclosed within the figure',
          'The total boundary length wrapping around the figure',
          'The weight of the geometric shape',
          'The number of vertices of the polygon'
        ];

    const correct = rawOptions[0];

    return {
      type: 'mcq',
      correct,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? 'Τι μετράμε όταν υπολογίζουμε το ΕΜΒΑΔΟΝ ενός γεωμετρικού σχήματος;'
        : 'What are we measuring when calculating the AREA of a geometric figure?',
      explanation: isEl
        ? 'Το εμβαδόν μετράει το μέγεθος της εσωτερικής επίπεδης επιφάνειας που κλείνεται μέσα στα όρια του σχήματος (σε αντίθεση με την περίμετρο που μετράει το μήκος του περιγράμματος).'
        : 'Area measures the size of the internal flat surface enclosed within the boundary of a shape (unlike perimeter, which measures the boundary length).'
    };
  } else {
    const rawOptions = isEl
      ? [
          'Η επιφάνεια ενός τετραγώνου με πλευρά 1 cm',
          'Ένα ευθύγραμμο τμήμα μήκους 1 cm',
          'Ένας κύκλος με διάμετρο 1 cm',
          'Η περίμετρος ενός τετραγώνου με πλευρά 4 cm'
        ]
      : [
          'The surface area of a square with a side length of 1 cm',
          'A straight line segment with a length of 1 cm',
          'A circle with a diameter of 1 cm',
          'The perimeter of a square with a side length of 4 cm'
        ];

    const correct = rawOptions[0];

    return {
      type: 'mcq',
      correct,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? 'Τι ορίζεται στη γεωμετρία ως « 1 τετραγωνικό εκατοστό ( 1 cm² ) »;'
        : 'What is defined in geometry as \" 1 square centimeter ( 1 cm² ) \"?',
      explanation: isEl
        ? 'Ένα τετραγωνικό εκατοστό (1 cm²) είναι η μονάδα μέτρησης επιφάνειας που ισούται με την επιφάνεια ενός τετραγώνου του οποίου κάθε πλευρά έχει μήκος ακριβώς 1 cm.'
        : 'One square centimeter (1 cm²) is the unit of area equal to the surface of a square whose side measures exactly 1 cm.'
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Εμβαδόν Τετραγώνου & Ανάστροφη Εύρεση Πλευράς (Input & MCQ)
function makeSquareAreaQuestion(isMCQ = false, locale = 'el') {
  const isEl = locale === 'el';
  const numLoc = isEl ? 'el-GR' : 'en-US';

  if (!isMCQ) {
    const side = [7, 8, 9, 11, 12, 15][getRandomInt(0, 5)];
    const area = side * side;

    return {
      type: 'input',
      correct: area,
      unit: isEl ? 'cm² (εμβαδόν)' : 'cm² (area)',
      prompt: isEl
        ? `Ένα τετράγωνο έχει πλευρά ${side.toLocaleString(numLoc)} cm. Πόσα cm² είναι το εμβαδόν του;`
        : `A square has a side length of ${side.toLocaleString(numLoc)} cm. How many cm² is its area?`,
      explanation: isEl ? (
        <span>
          Ο τύπος του εμβαδού τετραγώνου είναι: Ε ＝ Πλευρά · Πλευρά ( α · α ). Επομένως: {side.toLocaleString(numLoc)} · {side.toLocaleString(numLoc)} ＝ {area.toLocaleString(numLoc)} cm².
        </span>
      ) : (
        <span>
          The formula for the area of a square is: A ＝ Side · Side ( a · a ). Therefore: {side.toLocaleString(numLoc)} · {side.toLocaleString(numLoc)} ＝ {area.toLocaleString(numLoc)} cm².
        </span>
      )
    };
  } else {
    const cases = [
      { area: 36, side: 6 },
      { area: 49, side: 7 },
      { area: 64, side: 8 },
      { area: 81, side: 9 },
      { area: 100, side: 10 },
      { area: 144, side: 12 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const distractors = [c.side + 2, Math.max(2, c.side - 2), Math.round(c.area / 2)];
    const rawOptions = [`${c.side.toLocaleString(numLoc)} cm`, ...distractors.map((d) => `${d.toLocaleString(numLoc)} cm`)];

    return {
      type: 'mcq',
      correct: `${c.side.toLocaleString(numLoc)} cm`,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? `Το εμβαδόν ενός τετραγώνου είναι ${c.area.toLocaleString(numLoc)} cm². Πόσο είναι το μήκος της πλευράς του;`
        : `The area of a square is ${c.area.toLocaleString(numLoc)} cm². What is the length of its side?`,
      explanation: isEl
        ? `Ψάχνουμε ποιος αριθμός πολλαπλασιαζόμενος με τον εαυτό του δίνει ${c.area.toLocaleString(numLoc)}. Επειδή ${c.side.toLocaleString(numLoc)} · ${c.side.toLocaleString(numLoc)} ＝ ${c.area.toLocaleString(numLoc)}, η πλευρά του τετραγώνου είναι ${c.side.toLocaleString(numLoc)} cm.`
        : `We look for the number that multiplied by itself equals ${c.area.toLocaleString(numLoc)}. Since ${c.side.toLocaleString(numLoc)} · ${c.side.toLocaleString(numLoc)} ＝ ${c.area.toLocaleString(numLoc)}, the side of the square is ${c.side.toLocaleString(numLoc)} cm.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Πλακόστρωση & Περίμετρος vs Εμβαδόν (Input & MCQ)
function makeTilingAndComparisonProblem(isComparisonMCQ = false, locale = 'el') {
  const isEl = locale === 'el';
  const numLoc = isEl ? 'el-GR' : 'en-US';

  if (!isComparisonMCQ) {
    const roomL = 60;
    const roomW = 40;
    const tileSide = 10;
    const roomArea = roomL * roomW;
    const tileArea = tileSide * tileSide;
    const tilesCount = roomArea / tileArea;

    return {
      type: 'input',
      correct: tilesCount,
      unit: isEl ? 'πλακάκια' : 'tiles',
      prompt: isEl
        ? `Θέλουμε να καλύψουμε πλήρως έναν ορθογώνιο δίσκο διαστάσεων ${roomL.toLocaleString(numLoc)} cm επί ${roomW.toLocaleString(numLoc)} cm με τετράγωνα πλακάκια πλευράς ${tileSide.toLocaleString(numLoc)} cm. Πόσα τέτοια πλακάκια θα χρειαστούμε συνολικά;`
        : `We want to completely tile a rectangular tray measuring ${roomL.toLocaleString(numLoc)} cm by ${roomW.toLocaleString(numLoc)} cm with square tiles of side ${tileSide.toLocaleString(numLoc)} cm. How many such tiles will we need in total?`,
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>Εμβαδόν δίσκου: {roomL.toLocaleString(numLoc)} · {roomW.toLocaleString(numLoc)} ＝ {roomArea.toLocaleString(numLoc)} cm².</span>
          <span>Εμβαδόν ενός πλακιδίου: {tileSide.toLocaleString(numLoc)} · {tileSide.toLocaleString(numLoc)} ＝ {tileArea.toLocaleString(numLoc)} cm².</span>
          <span>Αριθμός πλακιδίων:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold">
            <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
              <span className="border-b border-slate-700 w-full text-center pb-0.5">{roomArea.toLocaleString(numLoc)}</span>
              <span className="pt-0.5">{tileArea.toLocaleString(numLoc)}</span>
            </span>
            <span>＝ {tilesCount.toLocaleString(numLoc)} πλακάκια.</span>
          </span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>Tray area: {roomL.toLocaleString(numLoc)} · {roomW.toLocaleString(numLoc)} ＝ {roomArea.toLocaleString(numLoc)} cm².</span>
          <span>Single tile area: {tileSide.toLocaleString(numLoc)} · {tileSide.toLocaleString(numLoc)} ＝ {tileArea.toLocaleString(numLoc)} cm².</span>
          <span>Number of tiles:</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold">
            <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
              <span className="border-b border-slate-700 w-full text-center pb-0.5">{roomArea.toLocaleString(numLoc)}</span>
              <span className="pt-0.5">{tileArea.toLocaleString(numLoc)}</span>
            </span>
            <span>＝ {tilesCount.toLocaleString(numLoc)} tiles.</span>
          </span>
        </span>
      )
    };
  } else {
    const rawOptions = isEl
      ? [
          'Μπορεί να έχουν την ίδια περίμετρο αλλά διαφορετικό εμβαδόν',
          'Έχουν υποχρεωτικά και το ίδιο εμβαδόν',
          'Το εμβαδόν τους είναι πάντα ίσο με το μισό της περιμέτρου',
          'Δεν μπορούμε να υπολογίσουμε το εμβαδόν τους'
        ]
      : [
          'They can have the same perimeter but different areas',
          'They must necessarily have the same area',
          'Their area is always equal to half of the perimeter',
          'Their area cannot be determined'
        ];

    const correct = rawOptions[0];

    return {
      type: 'mcq',
      correct,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? 'Αν δύο διαφορετικά ορθογώνια παραλληλόγραμμα έχουν ακριβώς την ίδια περίμετρο (π.χ. 20 cm), τι ισχύει για το εμβαδόν τους;'
        : 'If two different rectangles have the exact same perimeter (e.g. 20 cm), what is true about their area?',
      explanation: isEl
        ? 'Δύο σχήματα με την ίδια περίμετρο μπορούν να έχουν εντελώς διαφορετικό εμβαδόν! Π.χ. ορθογώνιο 9 cm × 1 cm έχει Π ＝ 20 cm και Ε ＝ 9 cm², ενώ ορθογώνιο 6 cm × 4 cm έχει Π ＝ 20 cm και Ε ＝ 24 cm²!'
        : 'Two shapes with the same perimeter can have completely different areas! E.g. a rectangle of 9 cm × 1 cm has P ＝ 20 cm and A ＝ 9 cm², while a rectangle of 6 cm × 4 cm has P ＝ 20 cm and A ＝ 24 cm²!'
    };
  }
}

function generateQuestions(locale = 'el') {
  return {
    q1: makeRectangleAreaQuestion(false, locale),
    q2: makeRectangleAreaQuestion(true, locale),
    q3: makeAreaConceptQuestion(false, locale),
    q4: makeAreaConceptQuestion(true, locale),
    q5: makeSquareAreaQuestion(false, locale),
    q6: makeSquareAreaQuestion(true, locale),
    q7: makeTilingAndComparisonProblem(false, locale),
    q8: makeTilingAndComparisonProblem(true, locale)
  };
}

export default function EmbadoAskPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = dictionary[locale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(locale));
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, [locale]);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleStrictNumberInput = (key, rawVal) => {
    if (submitted) return;
    let clean = '';
    if (locale === 'el') {
      clean = rawVal.replace(/\./g, ',').replace(/[^0-9,]/g, '');
      const parts = clean.split(',');
      if (parts.length > 2) {
        clean = parts[0] + ',' + parts.slice(1).join('');
      }
    } else {
      clean = rawVal.replace(/,/g, '.').replace(/[^0-9.]/g, '');
      const parts = clean.split('.');
      if (parts.length > 2) {
        clean = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    if (clean.length > 10) {
      clean = clean.slice(0, 10);
    }
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const parseUserFloat = (val) => {
    if (!val || val === ',' || val === '.') return NaN;
    return parseFloat(val.replace(',', '.'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    // q1
    if (Math.abs(parseUserFloat(answers.q1) - questions.q1.correct) <= 0.05) currentScore += 1;
    // q2
    if (Math.abs(parseUserFloat(answers.q2) - questions.q2.correct) <= 0.05) currentScore += 1;
    // q3
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    // q4
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    // q5
    if (Math.abs(parseUserFloat(answers.q5) - questions.q5.correct) <= 0.05) currentScore += 1;
    // q6
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    // q7
    if (Math.abs(parseUserFloat(answers.q7) - questions.q7.correct) <= 0.05) currentScore += 1;
    // q8
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render MCQ Question
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
                className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition select-none text-sm sm:text-base 2xl:text-lg font-mono font-bold ${
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
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0 mt-0.5"
                />
                <span className="break-words whitespace-normal leading-snug flex-1">
                  {opt}
                </span>
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
                {t.correctAnswerPrefix} <strong className="font-bold text-rose-950">{qData.correct}</strong>. {qData.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Input Question
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const userVal = parseUserFloat(answers[qKey]);
    const isCorrect = !isNaN(userVal) && Math.abs(userVal - qData.correct) <= 0.05;
    const numLoc = locale === 'el' ? 'el-GR' : 'en-US';

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
                {t.correctAnswerPrefix} <strong className="font-bold text-rose-950">{qData.correct.toLocaleString(numLoc)} {qData.unit}</strong>. {qData.explanation}
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
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/25-embado"
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
              {t.badge}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              📝 {t.mainTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              {t.mainSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center cursor-pointer"
          >
            🔄 {t.newExercisesBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInput('q1', questions.q1, 1, t.rectAreaBadge, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.findWidthBadge, 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, t.areaConceptBadge, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.squareCmBadge, 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, t.squareAreaBadge, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.squareSideBadge, 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, t.tilingBadge, 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, t.perimeterVsAreaBadge, 'bg-purple-600')}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                🎯 {t.submitBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ΣΤΑΘΕΡΟ ΚΑΤΩ FOOTER (SCORE BAR) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreText}</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                {t.successText} <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 2xl:px-7 2xl:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm 2xl:text-base flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>🔄</span> {t.newExercisesBtn}
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                {t.bottomPromptText}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
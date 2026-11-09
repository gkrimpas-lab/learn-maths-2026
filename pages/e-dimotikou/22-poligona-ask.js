// pages/e-dimotikou/22-poligona-ask.js
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

// Επαναχρησιμοποιήσιμο component για κανονική κατακόρυφη μορφή κλάσματος
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none select-none ${className}`}>
      <span className="text-center px-1 pb-0.5 border-b-2 border-current w-full block text-[0.9em]">
        {num}
      </span>
      <span className="text-center px-1 pt-0.5 w-full block text-[0.9em]">
        {den}
      </span>
    </span>
  );
}

const dictionary = {
  el: {
    pageTitle: "Ασκήσεις: Πολύγωνα - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα πολύγωνα: περίμετρος κανονικών πολυγώνων, ονοματολογία, πλήθος διαγωνίων και αναγνώριση σχημάτων.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badge: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Ασκήσεις: Τι είναι τα Πολύγωνα",
    mainSubtitle: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreText: "Σκορ:",
    successText: "Επιτυχία:",
    bottomPromptText: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctAnswerPrefix: "Η σωστή απάντηση είναι:",
    regularPerimeterBadge: "ΠΕΡΙΜΕΤΡΟΣ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ",
    findSideBadge: "ΕΥΡΕΣΗ ΠΛΕΥΡΑΣ ΑΠΟ ΠΕΡΙΜΕΤΡΟ",
    namingBadge: "ΟΝΟΜΑΤΟΛΟΓΙΑ ΠΟΛΥΓΩΝΩΝ",
    nonPolygonsBadge: "ΣΧΗΜΑΤΑ ΠΟΥ ΔΕΝ ΕΙΝΑΙ ΠΟΛΥΓΩΝΑ",
    diagonalsCountBadge: "ΠΛΗΘΟΣ ΔΙΑΓΩΝΙΩΝ ΠΟΛΥΓΩΝΟΥ",
    hexagonDiagonalsBadge: "ΔΙΑΓΩΝΙΟΙ ΕΞΑΓΩΝΟΥ",
    irregularPerimeterBadge: "ΠΕΡΙΜΕΤΡΟΣ ΑΝΩΜΑΛΟΥ ΠΟΛΥΓΩΝΟΥ",
    regularDefinitionBadge: "ΟΡΙΣΜΟΣ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ"
  },
  en: {
    pageTitle: "Exercises: Polygons - Grade 5 | LearnMaths.gr",
    pageDesc: "Grade 5 math exercises on polygons: perimeter of regular polygons, naming conventions, number of diagonals, and shape identification.",
    backText: "Grade 5",
    theoryBtn: "Theory",
    badge: "GRADE 5 • PRACTICE",
    mainTitle: "Exercises: What Polygons Are",
    mainSubtitle: "Each time you click \"New Exercises\", a fresh set of problems is generated!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreText: "Score:",
    successText: "Success:",
    bottomPromptText: "Complete the exercises and click \"Check Answers\"!",
    correctAnswerPrefix: "The correct answer is:",
    regularPerimeterBadge: "PERIMETER OF REGULAR POLYGON",
    findSideBadge: "FINDING SIDE FROM PERIMETER",
    namingBadge: "POLYGON NOMENCLATURE",
    nonPolygonsBadge: "NON-POLYGON SHAPES",
    diagonalsCountBadge: "NUMBER OF POLYGON DIAGONALS",
    hexagonDiagonalsBadge: "HEXAGON DIAGONALS",
    irregularPerimeterBadge: "PERIMETER OF IRREGULAR POLYGON",
    regularDefinitionBadge: "DEFINITION OF REGULAR POLYGON"
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Περίμετρος Κανονικού Πολυγώνου & Εύρεση Πλευράς (Input)
function makeRegularPolygonPerimeterQuestion(isSideFromPerimeter = false, locale = 'el') {
  const isEl = locale === 'el';
  const numLoc = isEl ? 'el-GR' : 'en-US';

  if (!isSideFromPerimeter) {
    const polygonTypes = isEl
      ? [
          { name: 'κανονικού πενταγώνου', sides: 5 },
          { name: 'κανονικού εξαγώνου', sides: 6 },
          { name: 'κανονικού οκταγώνου', sides: 8 },
          { name: 'κανονικού επταγώνου', sides: 7 }
        ]
      : [
          { name: 'regular pentagon', sides: 5 },
          { name: 'regular hexagon', sides: 6 },
          { name: 'regular octagon', sides: 8 },
          { name: 'regular heptagon', sides: 7 }
        ];

    const poly = polygonTypes[getRandomInt(0, polygonTypes.length - 1)];
    const side = [6, 8, 9, 12, 15][getRandomInt(0, 4)];
    const perimeter = poly.sides * side;

    return {
      type: 'input',
      correct: perimeter,
      unit: isEl ? 'cm (περίμετρος)' : 'cm (perimeter)',
      prompt: isEl
        ? `Κάθε πλευρά ενός ${poly.name} έχει μήκος ${side.toLocaleString(numLoc)} cm. Πόσα cm είναι η περίμετρός του;`
        : `Each side of a ${poly.name} has a length of ${side.toLocaleString(numLoc)} cm. How many cm is its perimeter?`,
      explanation: isEl ? (
        <span className="inline leading-relaxed">
          Σε ένα κανονικό πολύγωνο όλες οι πλευρές είναι απολύτως ίσες. Πολλαπλασιάζουμε το πλήθος των πλευρών με το μήκος της μίας πλευράς:{' '}
          <span className="whitespace-nowrap font-bold text-emerald-950">
            {poly.sides} · {side.toLocaleString(numLoc)} ＝ {perimeter.toLocaleString(numLoc)} cm
          </span>.
        </span>
      ) : (
        <span className="inline leading-relaxed">
          In a regular polygon, all sides are congruent. We multiply the number of sides by the side length:{' '}
          <span className="whitespace-nowrap font-bold text-emerald-950">
            {poly.sides} · {side.toLocaleString(numLoc)} ＝ {perimeter.toLocaleString(numLoc)} cm
          </span>.
        </span>
      )
    };
  } else {
    const polygonTypes = isEl
      ? [
          { name: 'κανονικού εξαγώνου', sides: 6 },
          { name: 'κανονικού οκταγώνου', sides: 8 },
          { name: 'κανονικού πενταγώνου', sides: 5 }
        ]
      : [
          { name: 'regular hexagon', sides: 6 },
          { name: 'regular octagon', sides: 8 },
          { name: 'regular pentagon', sides: 5 }
        ];

    const poly = polygonTypes[getRandomInt(0, polygonTypes.length - 1)];
    const side = [7, 8, 11, 14, 16][getRandomInt(0, 4)];
    const perimeter = poly.sides * side;

    return {
      type: 'input',
      correct: side,
      unit: isEl ? 'cm (μήκος πλευράς)' : 'cm (side length)',
      prompt: isEl
        ? `Η περίμετρος ενός ${poly.name} είναι ${perimeter.toLocaleString(numLoc)} cm. Πόσα cm είναι το μήκος της κάθε πλευράς του;`
        : `The perimeter of a ${poly.name} is ${perimeter.toLocaleString(numLoc)} cm. How many cm is the length of each side?`,
      explanation: isEl ? (
        <span className="inline leading-relaxed">
          Επειδή το πολύγωνο είναι κανονικό, όλες οι {poly.sides} πλευρές του είναι ίσες. Διαιρούμε την περίμετρο με το πλήθος των πλευρών:{' '}
          <span className="whitespace-nowrap inline-flex items-center gap-1 font-mono font-bold">
            <Fraction num={perimeter.toLocaleString(numLoc)} den={poly.sides} /> ＝ {side.toLocaleString(numLoc)} cm
          </span>.
        </span>
      ) : (
        <span className="inline leading-relaxed">
          Since the polygon is regular, all its {poly.sides} sides are equal. We divide the perimeter by the number of sides:{' '}
          <span className="whitespace-nowrap inline-flex items-center gap-1 font-mono font-bold">
            <Fraction num={perimeter.toLocaleString(numLoc)} den={poly.sides} /> ＝ {side.toLocaleString(numLoc)} cm
          </span>.
        </span>
      )
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Ονοματολογία & Αναγνώριση Πολυγώνων (MCQ)
function makePolygonClassificationQuestion(isNonPolygon = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isNonPolygon) {
    const cases = isEl
      ? [
          { sides: 5, name: 'Πεντάγωνο', distractors: ['Εξάγωνο', 'Τετράπλευρο', 'Επτάγωνο'] },
          { sides: 6, name: 'Εξάγωνο', distractors: ['Πεντάγωνο', 'Οκτάγωνο', 'Επτάγωνο'] },
          { sides: 7, name: 'Επτάγωνο', distractors: ['Εξάγωνο', 'Οκτάγωνο', 'Εννεάγωνο'] },
          { sides: 8, name: 'Οκτάγωνο', distractors: ['Εξάγωνο', 'Δεκάγωνο', 'Επτάγωνο'] }
        ]
      : [
          { sides: 5, name: 'Pentagon', distractors: ['Hexagon', 'Quadrilateral', 'Heptagon'] },
          { sides: 6, name: 'Hexagon', distractors: ['Pentagon', 'Octagon', 'Heptagon'] },
          { sides: 7, name: 'Heptagon', distractors: ['Hexagon', 'Octagon', 'Nonagon'] },
          { sides: 8, name: 'Octagon', distractors: ['Hexagon', 'Decagon', 'Heptagon'] }
        ];

    const c = cases[getRandomInt(0, cases.length - 1)];
    const rawOptions = [c.name, ...c.distractors];

    return {
      type: 'mcq',
      correct: c.name,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? `Πώς ονομάζεται το πολύγωνο που αποτελείται από ακριβώς ${c.sides} πλευρές και ${c.sides} γωνίες;`
        : `What is the name of the polygon that consists of exactly ${c.sides} sides and ${c.sides} angles?`,
      explanation: isEl
        ? `Το πολύγωνο με ${c.sides} πλευρές και ${c.sides} γωνίες ονομάζεται ${c.name}.`
        : `A polygon with ${c.sides} sides and ${c.sides} angles is called a ${c.name}.`
    };
  } else {
    const rawOptions = isEl
      ? [
          'Ο κύκλος (αποτελείται από καμπύλη γραμμή και όχι ευθύγραμμα τμήματα)',
          'Το τρίγωνο (3 πλευρές)',
          'Το κανονικό εξάγωνο (6 πλευρές)',
          'Το τραπέζιο (4 πλευρές)'
        ]
      : [
          'The circle (consists of a curved boundary and not straight line segments)',
          'The triangle (3 sides)',
          'The regular hexagon (6 sides)',
          'The trapezoid (4 sides)'
        ];

    const correct = rawOptions[0];

    return {
      type: 'mcq',
      correct,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? 'Ποιο από τα παρακάτω γεωμετρικά σχήματα ΔΕΝ είναι πολύγωνο;'
        : 'Which of the following geometric figures is NOT a polygon?',
      explanation: isEl
        ? 'Τα πολύγωνα αποτελούνται αποκλειστικά από ευθύγραμμα τμήματα και δεν έχουν ποτέ καμπύλες γραμμές. Επομένως, ο κύκλος δεν είναι πολύγωνο.'
        : 'Polygons are bounded strictly by straight line segments and never have curves. Therefore, a circle is not a polygon.'
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Πλήθος Διαγωνίων Πολυγώνου (Input & MCQ)
function makeDiagonalsQuestion(isMCQ = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isMCQ) {
    const cases = isEl
      ? [
          { name: 'τετράπλευρο (4 πλευρές)', sides: 4, diagonals: 2 },
          { name: 'πεντάγωνο (5 πλευρές)', sides: 5, diagonals: 5 },
          { name: 'τρίγωνο (3 πλευρές)', sides: 3, diagonals: 0 }
        ]
      : [
          { name: 'quadrilateral (4 sides)', sides: 4, diagonals: 2 },
          { name: 'pentagon (5 sides)', sides: 5, diagonals: 5 },
          { name: 'triangle (3 sides)', sides: 3, diagonals: 0 }
        ];

    const c = cases[getRandomInt(0, cases.length - 1)];

    return {
      type: 'input',
      correct: c.diagonals,
      unit: isEl ? 'διαγώνιοι' : 'diagonals',
      prompt: isEl
        ? `Πόσες διαγωνίους (ευθύγραμμα τμήματα που ενώνουν μη διαδοχικές κορυφές) έχει συνολικά ένα ${c.name};`
        : `How many diagonals (line segments connecting non-consecutive vertices) does a ${c.name} have in total?`,
      explanation: isEl ? (
        <span className="inline leading-relaxed">
          Ο αριθμός των διαγωνίων δίνεται από τον τύπο:{' '}
          <span className="whitespace-nowrap inline-flex items-center gap-1 font-mono font-bold">
            <span>δ ＝</span>
            <Fraction num="ν · (ν － 3)" den="2" />
          </span>
          . Για ν ＝ {c.sides}:{' '}
          <span className="whitespace-nowrap inline-flex items-center gap-1 font-mono font-bold">
            <Fraction num={`${c.sides} · (${c.sides} － 3)`} den="2" /> ＝ {c.diagonals} διαγώνιοι
          </span>.
        </span>
      ) : (
        <span className="inline leading-relaxed">
          The number of diagonals is given by the formula:{' '}
          <span className="whitespace-nowrap inline-flex items-center gap-1 font-mono font-bold">
            <span>d ＝</span>
            <Fraction num="n · (n － 3)" den="2" />
          </span>
          . For n ＝ {c.sides}:{' '}
          <span className="whitespace-nowrap inline-flex items-center gap-1 font-mono font-bold">
            <Fraction num={`${c.sides} · (${c.sides} － 3)`} den="2" /> ＝ {c.diagonals} diagonals
          </span>.
        </span>
      )
    };
  } else {
    const rawOptions = isEl
      ? ['9 διαγώνιους', '6 διαγώνιους', '12 διαγώνιους', '3 διαγώνιους']
      : ['9 diagonals', '6 diagonals', '12 diagonals', '3 diagonals'];

    const correct = rawOptions[0];

    return {
      type: 'mcq',
      correct,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? 'Πόσες διαγώνιους έχει συνολικά ένα εξάγωνο (πολύγωνο με 6 πλευρές);'
        : 'How many diagonals does a hexagon (polygon with 6 sides) have in total?',
      explanation: isEl ? (
        <span className="inline leading-relaxed">
          Εφαρμόζουμε τον μαθηματικό τύπο για ν ＝ 6:{' '}
          <span className="whitespace-nowrap inline-flex items-center gap-1 font-mono font-bold">
            <span>δ ＝</span>
            <Fraction num="6 · (6 － 3)" den="2" />
            <span>＝</span>
            <Fraction num="6 · 3" den="2" />
            <span>＝</span>
            <Fraction num="18" den="2" />
            <span>＝ 9 διαγώνιους</span>
          </span>.
        </span>
      ) : (
        <span className="inline leading-relaxed">
          Applying the formula for n ＝ 6:{' '}
          <span className="whitespace-nowrap inline-flex items-center gap-1 font-mono font-bold">
            <span>d ＝</span>
            <Fraction num="6 · (6 － 3)" den="2" />
            <span>＝</span>
            <Fraction num="6 · 3" den="2" />
            <span>＝</span>
            <Fraction num="18" den="2" />
            <span>＝ 9 diagonals</span>
          </span>.
        </span>
      )
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Ανώμαλα Πολύγωνα & Ορισμός Κανονικού (Input & MCQ)
function makeComplexPolygonQuestion(isRegularDefinition = false, locale = 'el') {
  const isEl = locale === 'el';
  const numLoc = isEl ? 'el-GR' : 'en-US';

  if (!isRegularDefinition) {
    const s1 = 8;
    const s2 = 12;
    const s3 = 10;
    const s4 = 14;
    const s5 = 11;
    const totalP = s1 + s2 + s3 + s4 + s5;

    return {
      type: 'input',
      correct: totalP,
      unit: isEl ? 'cm (περίμετρος)' : 'cm (perimeter)',
      prompt: isEl
        ? `Ένα ανώμαλο πεντάγωνο έχει πλευρές με μήκη ${s1.toLocaleString(numLoc)} cm, ${s2.toLocaleString(numLoc)} cm, ${s3.toLocaleString(numLoc)} cm, ${s4.toLocaleString(numLoc)} cm και ${s5.toLocaleString(numLoc)} cm. Πόσα cm είναι η περίμετρός του;`
        : `An irregular pentagon has sides measuring ${s1.toLocaleString(numLoc)} cm, ${s2.toLocaleString(numLoc)} cm, ${s3.toLocaleString(numLoc)} cm, ${s4.toLocaleString(numLoc)} cm, and ${s5.toLocaleString(numLoc)} cm. How many cm is its perimeter?`,
      explanation: isEl ? (
        <span className="inline leading-relaxed">
          Η περίμετρος οποιουδήποτε πολυγώνου ισούται με το άθροισμα όλων των πλευρών του:{' '}
          <span className="whitespace-nowrap font-bold text-emerald-950">
            {s1.toLocaleString(numLoc)} ＋ {s2.toLocaleString(numLoc)} ＋ {s3.toLocaleString(numLoc)} ＋ {s4.toLocaleString(numLoc)} ＋ {s5.toLocaleString(numLoc)} ＝ {totalP.toLocaleString(numLoc)} cm
          </span>.
        </span>
      ) : (
        <span className="inline leading-relaxed">
          The perimeter of any polygon equals the sum of all its side lengths:{' '}
          <span className="whitespace-nowrap font-bold text-emerald-950">
            {s1.toLocaleString(numLoc)} ＋ {s2.toLocaleString(numLoc)} ＋ {s3.toLocaleString(numLoc)} ＋ {s4.toLocaleString(numLoc)} ＋ {s5.toLocaleString(numLoc)} ＝ {totalP.toLocaleString(numLoc)} cm
          </span>.
        </span>
      )
    };
  } else {
    const rawOptions = isEl
      ? [
          'Όταν έχει όλες τις πλευρές του ίσες ΚΑΙ όλες τις γωνίες του ίσες',
          'Όταν έχει μόνο όλες τις γωνίες του ίσες (π.χ. ορθογώνιο)',
          'Όταν έχει περισσότερες από 10 πλευρές',
          'Όταν δεν έχει καμία διαγώνιο'
        ]
      : [
          'When all its sides are equal AND all its angles are equal',
          'When only its angles are equal (e.g. rectangle)',
          'When it has more than 10 sides',
          'When it has no diagonals'
        ];

    const correct = rawOptions[0];

    return {
      type: 'mcq',
      correct,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? 'Πότε ένα πολύγωνο χαρακτηρίζεται ως ΚΑΝΟΝΙΚΟ πολύγωνο στη Γεωμετρία;'
        : 'When is a polygon classified as a REGULAR polygon in Geometry?',
      explanation: isEl
        ? 'Ένα πολύγωνο ονομάζεται κανονικό ΜΟΝΟ όταν ισχύουν ταυτόχρονα και οι δύο προϋποθέσεις: έχει όλες τις πλευρές του ίσες (ισόπλευρο) ΚΑΙ όλες τις γωνίες του ίσες (ισογώνιο).'
        : 'A polygon is called regular ONLY when both criteria are met simultaneously: all sides are congruent (equilateral) AND all angles are congruent (equiangular).'
    };
  }
}

function generateQuestions(locale = 'el') {
  return {
    q1: makeRegularPolygonPerimeterQuestion(false, locale),
    q2: makeRegularPolygonPerimeterQuestion(true, locale),
    q3: makePolygonClassificationQuestion(false, locale),
    q4: makePolygonClassificationQuestion(true, locale),
    q5: makeDiagonalsQuestion(false, locale),
    q6: makeDiagonalsQuestion(true, locale),
    q7: makeComplexPolygonQuestion(false, locale),
    q8: makeComplexPolygonQuestion(true, locale)
  };
}

export default function PoligonaAskPage() {
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
          href="/e-dimotikou/22-poligona"
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
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1 break-words [overflow-wrap:anywhere]">
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
          {renderInput('q1', questions.q1, 1, t.regularPerimeterBadge, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.findSideBadge, 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, t.namingBadge, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.nonPolygonsBadge, 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, t.diagonalsCountBadge, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.hexagonDiagonalsBadge, 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, t.irregularPerimeterBadge, 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, t.regularDefinitionBadge, 'bg-purple-600')}

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
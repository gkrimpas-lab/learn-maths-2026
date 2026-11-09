// pages/e-dimotikou/24-perimetros-ask.js
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
    pageTitle: "Ασκήσεις: Περίμετρος Σχημάτων - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στην περίμετρο: ορθογώνια, τρίγωνα, σύνθετα σχήματα και πρακτικά προβλήματα περίφραξης οικοπέδων.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badge: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Ασκήσεις: Η Περίμετρος των Σχημάτων",
    mainSubtitle: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreText: "Σκορ:",
    successText: "Επιτυχία:",
    bottomPromptText: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctAnswerPrefix: "Η σωστή απάντηση είναι:",
    rectPerimeterBadge: "ΠΕΡΙΜΕΤΡΟΣ ΟΡΘΟΓΩΝΙΟΥ ΟΙΚΟΠΕΔΟΥ",
    findWidthBadge: "ΕΥΡΕΣΗ ΠΛΑΤΟΥΣ ΑΠΟ ΠΕΡΙΜΕΤΡΟ",
    isoscelesBadge: "ΠΕΡΙΜΕΤΡΟΣ ΙΣΟΣΚΕΛΟΥΣ ΤΡΙΓΩΝΟΥ",
    comparePerimetersBadge: "ΣΥΓΚΡΙΣΗ ΠΕΡΙΜΕΤΡΩΝ ΣΧΗΜΑΤΩΝ",
    fencingGateBadge: "ΠΕΡΙΦΡΑΞΗ ΜΕ ΑΦΑΙΡΕΣΗ ΠΟΡΤΑΣ",
    fencingCostBadge: "ΥΠΟΛΟΓΙΣΜΟΣ ΚΟΣΤΟΥΣ ΠΕΡΙΦΡΑΞΗΣ",
    lShapeBadge: "ΠΕΡΙΜΕΤΡΟΣ ΣΥΝΘΕΤΟΥ ΣΧΗΜΑΤΟΣ L",
    perimeterVsAreaBadge: "ΔΙΑΦΟΡΑ ΠΕΡΙΜΕΤΡΟΥ ΚΑΙ ΕΜΒΑΔΟΥ"
  },
  en: {
    pageTitle: "Exercises: Perimeter of Shapes - Grade 5 | LearnMaths.gr",
    pageDesc: "Grade 5 math exercises on perimeter: rectangles, triangles, composite figures, and real-life fencing word problems.",
    backText: "Grade 5",
    theoryBtn: "Theory",
    badge: "GRADE 5 • PRACTICE",
    mainTitle: "Exercises: The Perimeter of Shapes",
    mainSubtitle: "Each time you click \"New Exercises\", a fresh set of problems is generated!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreText: "Score:",
    successText: "Success:",
    bottomPromptText: "Complete the exercises and click \"Check Answers\"!",
    correctAnswerPrefix: "The correct answer is:",
    rectPerimeterBadge: "PERIMETER OF RECTANGULAR PLOT",
    findWidthBadge: "FINDING WIDTH FROM PERIMETER",
    isoscelesBadge: "PERIMETER OF ISOSCELES TRIANGLE",
    comparePerimetersBadge: "COMPARING SHAPE PERIMETERS",
    fencingGateBadge: "FENCING WITH GATE SUBTRACTION",
    fencingCostBadge: "CALCULATING FENCING COST",
    lShapeBadge: "PERIMETER OF COMPOSITE L-SHAPE",
    perimeterVsAreaBadge: "PERIMETER VS AREA DIFFERENCE"
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Περίμετρος Ορθογωνίου & Ανάστροφος Υπολογισμός (Input)
function makeRectanglePerimeterQuestion(isFindSide = false, locale = 'el') {
  const isEl = locale === 'el';
  const numLoc = isEl ? 'el-GR' : 'en-US';

  if (!isFindSide) {
    const length = [12, 15, 18, 24, 25][getRandomInt(0, 4)];
    const width = [6, 8, 10, 12, 14][getRandomInt(0, 4)];
    const sum = length + width;
    const perimeter = 2 * sum;

    return {
      type: 'input',
      correct: perimeter,
      unit: isEl ? 'm (περίμετρος)' : 'm (perimeter)',
      prompt: isEl
        ? `Ένα ορθογώνιο οικόπεδο έχει μήκος ${length.toLocaleString(numLoc)} m και πλάτος ${width.toLocaleString(numLoc)} m. Πόσα μέτρα ( m ) είναι η περίμετρός του;`
        : `A rectangular plot is ${length.toLocaleString(numLoc)} m long and ${width.toLocaleString(numLoc)} m wide. How many meters ( m ) is its perimeter?`,
      explanation: isEl ? (
        <span>
          Ο τύπος της περιμέτρου ορθογωνίου είναι: Π ＝ 2 · ( Μήκος ＋ Πλάτος ). Επομένως: 2 · ( {length.toLocaleString(numLoc)} ＋ {width.toLocaleString(numLoc)} ) ＝ 2 · {sum.toLocaleString(numLoc)} ＝ {perimeter.toLocaleString(numLoc)} m.
        </span>
      ) : (
        <span>
          The formula for the perimeter of a rectangle is: P ＝ 2 · ( Length ＋ Width ). Therefore: 2 · ( {length.toLocaleString(numLoc)} ＋ {width.toLocaleString(numLoc)} ) ＝ 2 · {sum.toLocaleString(numLoc)} ＝ {perimeter.toLocaleString(numLoc)} m.
        </span>
      )
    };
  } else {
    const length = [16, 20, 25, 30][getRandomInt(0, 3)];
    const width = [8, 12, 14, 15][getRandomInt(0, 3)];
    const perimeter = 2 * (length + width);
    const semiPerimeter = perimeter / 2;

    return {
      type: 'input',
      correct: width,
      unit: isEl ? 'm (πλάτος)' : 'm (width)',
      prompt: isEl
        ? `Η περίμετρος ενός ορθογώνιου αγροτεμαχίου είναι ${perimeter.toLocaleString(numLoc)} m και το μήκος του είναι ${length.toLocaleString(numLoc)} m. Πόσα μέτρα ( m ) είναι το πλάτος του;`
        : `The perimeter of a rectangular farmland is ${perimeter.toLocaleString(numLoc)} m and its length is ${length.toLocaleString(numLoc)} m. How many meters ( m ) is its width?`,
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>Πρώτα βρίσκουμε το άθροισμα μήκους και πλάτους (ημιπερίμετρος):</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold">
            <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
              <span className="border-b border-slate-700 w-full text-center pb-0.5">{perimeter.toLocaleString(numLoc)}</span>
              <span className="pt-0.5">2</span>
            </span>
            <span>＝ {semiPerimeter.toLocaleString(numLoc)} m.</span>
          </span>
          <span>Έπειτα αφαιρούμε το μήκος για να βρούμε το πλάτος: {semiPerimeter.toLocaleString(numLoc)} － {length.toLocaleString(numLoc)} ＝ {width.toLocaleString(numLoc)} m.</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>First we determine the sum of length and width (semi-perimeter):</span>
          <span className="inline-flex items-center gap-1 font-mono font-bold">
            <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1">
              <span className="border-b border-slate-700 w-full text-center pb-0.5">{perimeter.toLocaleString(numLoc)}</span>
              <span className="pt-0.5">2</span>
            </span>
            <span>＝ {semiPerimeter.toLocaleString(numLoc)} m.</span>
          </span>
          <span>Then we subtract the length to find the width: {semiPerimeter.toLocaleString(numLoc)} － {length.toLocaleString(numLoc)} ＝ {width.toLocaleString(numLoc)} m.</span>
        </span>
      )
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Περίμετρος Τριγώνων & Σύγκριση Σχημάτων (MCQ)
function makeTriangleAndComparisonQuestion(isComparison = false, locale = 'el') {
  const isEl = locale === 'el';
  const numLoc = isEl ? 'el-GR' : 'en-US';

  if (!isComparison) {
    const equalSide = [14, 16, 18, 20][getRandomInt(0, 3)];
    const base = [10, 12, 15, 22][getRandomInt(0, 3)];
    const perimeter = 2 * equalSide + base;
    const distractors = [perimeter + 4, Math.max(10, perimeter - 6), equalSide + base];
    const rawOptions = [`${perimeter.toLocaleString(numLoc)} cm`, ...distractors.map((d) => `${d.toLocaleString(numLoc)} cm`)];

    return {
      type: 'mcq',
      correct: `${perimeter.toLocaleString(numLoc)} cm`,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? `Ένα ισοσκελές τρίγωνο έχει βάση ${base.toLocaleString(numLoc)} cm και καθεμία από τις δύο ίσες πλευρές του έχει μήκος ${equalSide.toLocaleString(numLoc)} cm. Πόση είναι η περίμετρός του;`
        : `An isosceles triangle has a base of ${base.toLocaleString(numLoc)} cm and each of its two equal sides measures ${equalSide.toLocaleString(numLoc)} cm. What is its perimeter?`,
      explanation: isEl
        ? `Προσθέτουμε και τις τρεις πλευρές: ${equalSide.toLocaleString(numLoc)} ＋ ${equalSide.toLocaleString(numLoc)} ＋ ${base.toLocaleString(numLoc)} ＝ ${(2 * equalSide).toLocaleString(numLoc)} ＋ ${base.toLocaleString(numLoc)} ＝ ${perimeter.toLocaleString(numLoc)} cm.`
        : `Add all three side lengths: ${equalSide.toLocaleString(numLoc)} ＋ ${equalSide.toLocaleString(numLoc)} ＋ ${base.toLocaleString(numLoc)} ＝ ${(2 * equalSide).toLocaleString(numLoc)} ＋ ${base.toLocaleString(numLoc)} ＝ ${perimeter.toLocaleString(numLoc)} cm.`
    };
  } else {
    const side = 8;
    const sqP = 4 * side;
    const rectL = 10;
    const rectW = 6;
    const rectP = 2 * (rectL + rectW);

    const rawOptions = isEl
      ? [
          `Έχουν ακριβώς την ίδια περίμετρο ( ${sqP} cm )`,
          'Το τετράγωνο έχει μεγαλύτερη περίμετρο',
          'Το ορθογώνιο έχει μεγαλύτερη περίμετρο',
          'Δεν μπορούμε να τις συγκρίνουμε'
        ]
      : [
          `They have exactly the same perimeter ( ${sqP} cm )`,
          'The square has a greater perimeter',
          'The rectangle has a greater perimeter',
          'They cannot be compared'
        ];

    const correct = rawOptions[0];

    return {
      type: 'mcq',
      correct,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? `Ένα τετράγωνο έχει πλευρά ${side} cm και ένα ορθογώνιο έχει διαστάσεις ${rectL} cm και ${rectW} cm. Ποια σχέση έχουν οι περιμέτροί τους;`
        : `A square has a side length of ${side} cm and a rectangle has dimensions ${rectL} cm by ${rectW} cm. How do their perimeters compare?`,
      explanation: isEl
        ? `Περίμετρος τετραγώνου: 4 · ${side} ＝ ${sqP} cm. Περίμετρος ορθογωνίου: 2 · ( ${rectL} ＋ ${rectW} ) ＝ 2 · ${rectL + rectW} ＝ ${rectP} cm. Άρα έχουν ακριβώς την ίδια περίμετρο!`
        : `Perimeter of square: 4 · ${side} ＝ ${sqP} cm. Perimeter of rectangle: 2 · ( ${rectL} ＋ ${rectW} ) ＝ 2 · ${rectL + rectW} ＝ ${rectP} cm. Thus, they have the exact same perimeter!`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Περίφραξη με Πόρτα & Κόστος ανά Μέτρο (Input & MCQ)
function makeFencingProblem(isCostMCQ = false, locale = 'el') {
  const isEl = locale === 'el';
  const numLoc = isEl ? 'el-GR' : 'en-US';

  if (!isCostMCQ) {
    const length = [20, 25, 30][getRandomInt(0, 2)];
    const width = [12, 15, 18][getRandomInt(0, 2)];
    const gate = [3, 4, 5][getRandomInt(0, 2)];
    const sum = length + width;
    const fullPerimeter = 2 * sum;
    const wireNeeded = fullPerimeter - gate;

    return {
      type: 'input',
      correct: wireNeeded,
      unit: isEl ? 'm (συρματόπλεγμα)' : 'm (wire fencing)',
      prompt: isEl
        ? `Ένα ορθογώνιο οικόπεδο έχει μήκος ${length.toLocaleString(numLoc)} m και πλάτος ${width.toLocaleString(numLoc)} m. Θέλουμε να το περιφράξουμε ολόγυρα με συρματόπλεγμα, αφήνοντας μια πόρτα εισόδου πλάτους ${gate.toLocaleString(numLoc)} m χωρίς σύρμα. Πόσα μέτρα ( m ) συρματόπλεγμα θα χρειαστούμε;`
        : `A rectangular plot is ${length.toLocaleString(numLoc)} m long and ${width.toLocaleString(numLoc)} m wide. We want to fence it completely with wire, leaving an entrance gate ${gate.toLocaleString(numLoc)} m wide unfenced. How many meters ( m ) of fencing wire will we need?`,
      explanation: isEl
        ? `Υπολογίζουμε τη συνολική περίμετρο: 2 · ( ${length.toLocaleString(numLoc)} ＋ ${width.toLocaleString(numLoc)} ) ＝ 2 · ${sum.toLocaleString(numLoc)} ＝ ${fullPerimeter.toLocaleString(numLoc)} m. Αφαιρούμε το άνοιγμα της πόρτας: ${fullPerimeter.toLocaleString(numLoc)} － ${gate.toLocaleString(numLoc)} ＝ ${wireNeeded.toLocaleString(numLoc)} m.`
        : `Calculate total perimeter: 2 · ( ${length.toLocaleString(numLoc)} ＋ ${width.toLocaleString(numLoc)} ) ＝ 2 · ${sum.toLocaleString(numLoc)} ＝ ${fullPerimeter.toLocaleString(numLoc)} m. Subtract the gate opening: ${fullPerimeter.toLocaleString(numLoc)} － ${gate.toLocaleString(numLoc)} ＝ ${wireNeeded.toLocaleString(numLoc)} m.`
    };
  } else {
    const side = 15;
    const perimeter = 4 * side;
    const costPerMeter = [4, 5, 6][getRandomInt(0, 2)];
    const totalCost = perimeter * costPerMeter;

    const distractors = [totalCost + 60, Math.max(20, totalCost - 40), side * costPerMeter];
    const rawOptions = [`${totalCost.toLocaleString(numLoc)} €`, ...distractors.map((d) => `${d.toLocaleString(numLoc)} €`)];

    return {
      type: 'mcq',
      correct: `${totalCost.toLocaleString(numLoc)} €`,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? `Ένα τετράγωνο χωράφι έχει πλευρά ${side.toLocaleString(numLoc)} m. Αν το σύρμα περίφραξης κοστίζει ${costPerMeter.toLocaleString(numLoc)} € το μέτρο, ποιο είναι το συνολικό κόστος για να περιφραχτεί ολόκληρο το χωράφι;`
        : `A square farmland has a side length of ${side.toLocaleString(numLoc)} m. If fencing wire costs ${costPerMeter.toLocaleString(numLoc)} € per meter, what is the total cost to fence the entire field?`,
      explanation: isEl
        ? `Βρίσκουμε την περίμετρο του τετραγώνου: 4 · ${side.toLocaleString(numLoc)} ＝ ${perimeter.toLocaleString(numLoc)} m. Πολλαπλασιάζουμε με την τιμή ανά μέτρο: ${perimeter.toLocaleString(numLoc)} · ${costPerMeter.toLocaleString(numLoc)} € ＝ ${totalCost.toLocaleString(numLoc)} €.`
        : `Find the perimeter of the square: 4 · ${side.toLocaleString(numLoc)} ＝ ${perimeter.toLocaleString(numLoc)} m. Multiply by the cost per meter: ${perimeter.toLocaleString(numLoc)} · ${costPerMeter.toLocaleString(numLoc)} € ＝ ${totalCost.toLocaleString(numLoc)} €.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετο Σχήμα & Έννοια Περιμέτρου vs Εμβαδού (Input & MCQ)
function makeComplexShapePerimeterQuestion(isConceptMCQ = false, locale = 'el') {
  const isEl = locale === 'el';
  const numLoc = isEl ? 'el-GR' : 'en-US';

  if (!isConceptMCQ) {
    const totalW = [14, 16, 18][getRandomInt(0, 2)];
    const totalH = [10, 12, 15][getRandomInt(0, 2)];
    const sum = totalW + totalH;
    const perimeter = 2 * sum;

    return {
      type: 'input',
      correct: perimeter,
      unit: isEl ? 'cm (περίμετρος)' : 'cm (perimeter)',
      prompt: isEl
        ? `Ένα κλιμακωτό πολύγωνο σχήματος «L» έχει μέγιστο εξωτερικό μήκος ${totalW.toLocaleString(numLoc)} cm και μέγιστο εξωτερικό ύψος ${totalH.toLocaleString(numLoc)} cm. Πόσα cm είναι η συνολική περίμετρός του;`
        : `A stepped \"L\"-shaped polygon has a maximum outer width of ${totalW.toLocaleString(numLoc)} cm and a maximum outer height of ${totalH.toLocaleString(numLoc)} cm. How many cm is its total perimeter?`,
      explanation: isEl
        ? `Σε ένα σχήμα «L», τα εσωτερικά «σκαλοπάτια» όταν μετατοπιστούν προς τα έξω ισούνται ακριβώς με το μέγιστο μήκος και ύψος. Επομένως, η περίμετρος ισούται με εκείνη του περιγεγραμμένου ορθογωνίου: 2 · ( ${totalW.toLocaleString(numLoc)} ＋ ${totalH.toLocaleString(numLoc)} ) ＝ 2 · ${sum.toLocaleString(numLoc)} ＝ ${perimeter.toLocaleString(numLoc)} cm.`
        : `In an \"L\"-shaped figure, pushing the inner steps outward reconstitutes the bounding rectangle. Thus, its perimeter equals that of the enclosing rectangle: 2 · ( ${totalW.toLocaleString(numLoc)} ＋ ${totalH.toLocaleString(numLoc)} ) ＝ 2 · ${sum.toLocaleString(numLoc)} ＝ ${perimeter.toLocaleString(numLoc)} cm.`
    };
  } else {
    const rawOptions = isEl
      ? [
          'Η περίμετρος μετράει το μήκος του περιγράμματος (σε m/cm), ενώ το εμβαδόν μετράει την επιφάνεια (σε m²/cm²)',
          'Η περίμετρος και το εμβαδόν μετριούνται και τα δύο σε τετραγωνικά μέτρα',
          'Η περίμετρος ισούται πάντα με το γινόμενο των πλευρών',
          'Δύο σχήματα με την ίδια περίμετρο έχουν υποχρεωτικά και το ίδιο εμβαδόν'
        ]
      : [
          'Perimeter measures boundary length (in m/cm), whereas area measures surface coverage (in m²/cm²)',
          'Perimeter and area are both measured in square meters',
          'Perimeter is always equal to the product of side lengths',
          'Two figures with the same perimeter must have the exact same area'
        ];

    const correct = rawOptions[0];

    return {
      type: 'mcq',
      correct,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? 'Ποια είναι η βασική μαθηματική διαφορά μεταξύ Περιμέτρου και Εμβαδού;'
        : 'What is the fundamental mathematical difference between Perimeter and Area?',
      explanation: isEl
        ? 'Η περίμετρος είναι μονοδιάστατο μέγεθος (μήκος περιγράμματος γύρω-γύρω) και εκφράζεται σε m ή cm. Το εμβαδόν είναι δισδιάστατο μέγεθος (μέγεθος καλυπτόμενης επιφάνειας) και εκφράζεται σε m² ή cm².'
        : 'Perimeter is a one-dimensional measure (outer boundary length) expressed in m or cm. Area is a two-dimensional measure (enclosed surface region) expressed in m² or cm².'
    };
  }
}

function generateQuestions(locale = 'el') {
  return {
    q1: makeRectanglePerimeterQuestion(false, locale),
    q2: makeRectanglePerimeterQuestion(true, locale),
    q3: makeTriangleAndComparisonQuestion(false, locale),
    q4: makeTriangleAndComparisonQuestion(true, locale),
    q5: makeFencingProblem(false, locale),
    q6: makeFencingProblem(true, locale),
    q7: makeComplexShapePerimeterQuestion(false, locale),
    q8: makeComplexShapePerimeterQuestion(true, locale)
  };
}

export default function PerimetrosAskPage() {
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
          href="/e-dimotikou/24-perimetros"
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
          {renderInput('q1', questions.q1, 1, t.rectPerimeterBadge, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.findWidthBadge, 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, t.isoscelesBadge, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.comparePerimetersBadge, 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, t.fencingGateBadge, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.fencingCostBadge, 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, t.lShapeBadge, 'bg-purple-600')}
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
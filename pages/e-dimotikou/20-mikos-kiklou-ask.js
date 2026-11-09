// pages/e-dimotikou/20-mikos-kiklou-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ & COMPONENTS --- //

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

// Component για εμφάνιση κλασμάτων σε κανονική κατακόρυφη μορφή
function Fraction({ num, den }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle mx-1 font-mono text-sm sm:text-base leading-none">
      <span className="border-b-2 border-current px-1 pb-0.5 text-center font-bold">
        {num}
      </span>
      <span className="px-1 pt-0.5 text-center font-bold">
        {den}
      </span>
    </span>
  );
}

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Υπολογισμός Μήκους Κύκλου από Διάμετρο & Ακτίνα (Input)
function makeCircumferenceCalculationQuestion(isFromRadius = false, locale = 'el') {
  const isEn = locale === 'en';
  const numLocale = isEn ? 'en-US' : 'el-GR';
  const format = (n) => n.toLocaleString(numLocale);

  if (!isFromRadius) {
    // q1: Υπολογισμός από διάμετρο (L = 3,14 · δ)
    const diameters = [10, 20, 30, 40, 50, 100];
    const d = diameters[getRandomInt(0, diameters.length - 1)];
    const length = parseFloat((3.14 * d).toFixed(2));
    const formattedLength = length.toLocaleString(numLocale, { minimumFractionDigits: 1, maximumFractionDigits: 2 });

    return {
      type: 'input',
      correct: length,
      unit: isEn ? 'cm (circumference)' : 'cm (μήκος κύκλου)',
      prompt: isEn
        ? `A circle has a diameter d ＝ ${format(d)} cm. Calculate the circumference of the circle (use π ＝ 3.14):`
        : `Ένας κύκλος έχει διάμετρο δ ＝ ${format(d)} cm. Υπολόγισε το μήκος του κύκλου (χρησιμοποίησε π ＝ 3,14):`,
      explanation: isEn ? (
        <span>
          The formula for circle circumference is: C ＝ π · d. Therefore: 3.14 · {format(d)} ＝ {formattedLength} cm.
        </span>
      ) : (
        <span>
          Ο τύπος του μήκους κύκλου είναι: Μ ＝ π · δ. Επομένως: 3,14 · {format(d)} ＝ {formattedLength} cm.
        </span>
      )
    };
  } else {
    // q2: Υπολογισμός από ακτίνα ρ / r (L = 2 · 3,14 · ρ)
    const radii = [5, 10, 15, 20, 25];
    const r = radii[getRandomInt(0, radii.length - 1)];
    const d = r * 2;
    const length = parseFloat((2 * 3.14 * r).toFixed(2));
    const formattedLength = length.toLocaleString(numLocale, { minimumFractionDigits: 1, maximumFractionDigits: 2 });

    return {
      type: 'input',
      correct: length,
      unit: isEn ? 'cm (circumference)' : 'cm (μήκος κύκλου)',
      prompt: isEn
        ? `A circle has a radius r ＝ ${format(r)} cm. Calculate the circumference of the circle (use π ＝ 3.14):`
        : `Ένας κύκλος έχει ακτίνα ρ ＝ ${format(r)} cm. Υπολόγισε το μήκος του κύκλου (χρησιμοποίησε π ＝ 3,14):`,
      explanation: isEn ? (
        <span>
          First, find the diameter: d ＝ 2 · {format(r)} ＝ {format(d)} cm. Then calculate the circumference: C ＝ 2 · π · r ＝ 2 · 3.14 · {format(r)} ＝ 3.14 · {format(d)} ＝ {formattedLength} cm.
        </span>
      ) : (
        <span>
          Πρώτα βρίσκουμε τη διάμετρο: δ ＝ 2 · {format(r)} ＝ {format(d)} cm. Έπειτα υπολογίζουμε το μήκος: Μ ＝ 2 · π · ρ ＝ 2 · 3,14 · {format(r)} ＝ 3,14 · {format(d)} ＝ {formattedLength} cm.
        </span>
      )
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Θεωρία Αριθμού π & Λόγος Μήκους προς Διάμετρο (MCQ)
function makePiTheoryQuestion(isRatioQuestion = false, locale = 'el') {
  const isEn = locale === 'en';

  if (!isRatioQuestion) {
    // q3: Τι εκφράζει ο αριθμός π
    const correct = isEn
      ? 'How many times the diameter fits into the circumference of the circle (approx. 3.14)'
      : 'Πόσες φορές χωράει η διάμετρος στο μήκος του κύκλου (περίπου 3,14)';
    const rawOptions = isEn
      ? [
          'How many times the diameter fits into the circumference of the circle (approx. 3.14)',
          'How many times the radius fits into the diameter',
          'The sum of angles in a triangle',
          'The number of symmetry lines in a circle'
        ]
      : [
          'Πόσες φορές χωράει η διάμετρος στο μήκος του κύκλου (περίπου 3,14)',
          'Πόσες φορές χωράει η ακτίνα στη διάμετρο',
          'Το άθροισμα των γωνιών ενός τριγώνου',
          'Τον αριθμό των αξόνων συμμετρίας ενός κύκλου'
        ];

    return {
      type: 'mcq',
      correct,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt: isEn
        ? 'What does the mathematical number π (approx. 3.14) express in any circle?'
        : 'Τι εκφράζει ο μαθηματικός αριθμός π (περίπου 3,14) σε οποιονδήποτε κύκλο;',
      explanation: isEn ? (
        <span className="inline-flex items-center flex-wrap gap-1">
          The number π represents the constant ratio of circumference to diameter:
          <Fraction num="Circumference" den="Diameter" /> ＝ π ≈ 3.14. That is, the diameter fits into the circumference approximately 3.14 times.
        </span>
      ) : (
        <span className="inline-flex items-center flex-wrap gap-1">
          Ο αριθμός π εκφράζει τον σταθερό λόγο του μήκους της περιφέρειας προς τη διάμετρο του κύκλου:
          <Fraction num="Μήκος Κύκλου" den="Διάμετρος" /> ＝ π ≈ 3,14. Δηλαδή η διάμετρος χωράει στο μήκος περίπου 3,14 φορές.
        </span>
      )
    };
  } else {
    // q4: Ποια σχέση ισχύει για το πηλίκο Μήκος / Διάμετρος
    const correct = isEn
      ? 'It is always equal to 3.14 for all circles regardless of their size'
      : 'Είναι πάντα ίσο με 3,14 για όλους τους κύκλους ανεξαρτήτως μεγέθους';
    const rawOptions = isEn
      ? [
          'It is always equal to 3.14 for all circles regardless of their size',
          'It depends on how large the circle is',
          'It is always equal to 2 for all circles',
          'It equals the area of a square'
        ]
      : [
          'Είναι πάντα ίσο με 3,14 για όλους τους κύκλους ανεξαρτήτως μεγέθους',
          'Εξαρτάται από το πόσο μεγάλος είναι ο κύκλος',
          'Είναι πάντα ίσο με 2 για όλους τους κύκλους',
          'Είναι ίσο με το εμβαδόν του τετραγώνου'
        ];

    return {
      type: 'mcq',
      correct,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt: isEn
        ? 'If we divide the circumference of a small coin by its diameter and the circumference of a truck wheel by its own diameter, what will we observe?'
        : 'Αν διαιρέσουμε το μήκος ενός μικρού νομίσματος με τη διάμετρό του και το μήκος της ρόδας ενός φορτηγού με τη δική της διάμετρο, τι θα παρατηρήσουμε;',
      explanation: isEn ? (
        <span className="inline-flex items-center flex-wrap gap-1">
          In ALL circles in the universe, the ratio
          <Fraction num="Circumference" den="Diameter" />
          remains strictly constant and always equals the number π ≈ 3.14.
        </span>
      ) : (
        <span className="inline-flex items-center flex-wrap gap-1">
          Σε ΟΛΟΥΣ τους κύκλους του σύμπαντος, το πηλίκο
          <Fraction num="Μήκος" den="Διάμετρος" />
          παραμένει αυστηρά σταθερό και ισούται πάντα με τον αριθμό π ≈ 3,14.
        </span>
      )
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Ανάστροφος Υπολογισμός Διαμέτρου/Ακτίνας (Input & MCQ)
function makeReverseCircumferenceQuestion(isMCQ = false, locale = 'el') {
  const isEn = locale === 'en';
  const numLocale = isEn ? 'en-US' : 'el-GR';
  const format = (n) => n.toLocaleString(numLocale);

  if (!isMCQ) {
    // q5: Εύρεση διαμέτρου από γνωστό μήκος (Input)
    const d = [10, 20, 30, 40, 50][getRandomInt(0, 4)];
    const circumference = parseFloat((3.14 * d).toFixed(2));
    const formattedCirc = circumference.toLocaleString(numLocale, { minimumFractionDigits: 1, maximumFractionDigits: 2 });

    return {
      type: 'input',
      correct: d,
      unit: isEn ? 'cm (diameter)' : 'cm (διάμετρος)',
      prompt: isEn
        ? `The circumference of a circular hoop is ${formattedCirc} cm. How many cm is its DIAMETER (use π ＝ 3.14)?`
        : `Το μήκος ενός κυκλικού στεφανιού είναι ${formattedCirc} cm. Πόσα cm είναι η ΔΙΑΜΕΤΡΟΣ του (χρησιμοποίησε π ＝ 3,14);`,
      explanation: isEn ? (
        <span className="inline-flex items-center flex-wrap gap-1">
          We use the inverse formula: Diameter ＝
          <Fraction num="Circumference" den="π" /> ＝
          <Fraction num={formattedCirc} den="3.14" /> ＝ {format(d)} cm.
        </span>
      ) : (
        <span className="inline-flex items-center flex-wrap gap-1">
          Χρησιμοποιούμε τον αντίστροφο τύπο: Διάμετρος ＝
          <Fraction num="Μήκος" den="π" /> ＝
          <Fraction num={formattedCirc} den="3,14" /> ＝ {format(d)} cm.
        </span>
      )
    };
  } else {
    // q6: Εύρεση ακτίνας ρ / r από γνωστό μήκος (MCQ)
    const r = [5, 10, 15, 20][getRandomInt(0, 3)];
    const d = r * 2;
    const circumference = parseFloat((3.14 * d).toFixed(2));
    const formattedCirc = circumference.toLocaleString(numLocale, { minimumFractionDigits: 1, maximumFractionDigits: 2 });

    const distractors = [d, r * 3, Math.max(2, r - 3)];
    const rawOptions = [`${format(r)} cm`, ...distractors.map((v) => `${format(v)} cm`)];

    return {
      type: 'mcq',
      correct: `${format(r)} cm`,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt: isEn
        ? `A circular disc has a circumference of ${formattedCirc} cm. What is the length of its RADIUS (π ＝ 3.14)?`
        : `Ένας κυκλικός δίσκος έχει μήκος περιφέρειας ${formattedCirc} cm. Πόσο είναι το μήκος της ΑΚΤΙΝΑΣ του (π ＝ 3,14);`,
      explanation: isEn ? (
        <span className="inline-flex items-center flex-wrap gap-1">
          First find the diameter: d ＝
          <Fraction num={formattedCirc} den="3.14" /> ＝ {format(d)} cm.
          The radius is half the diameter: r ＝
          <Fraction num={format(d)} den="2" /> ＝ {format(r)} cm.
        </span>
      ) : (
        <span className="inline-flex items-center flex-wrap gap-1">
          Πρώτα βρίσκουμε τη διάμετρο: δ ＝
          <Fraction num={formattedCirc} den="3,14" /> ＝ {format(d)} cm.
          Η ακτίνα είναι το μισό της διαμέτρου: ρ ＝
          <Fraction num={format(d)} den="2" /> ＝ {format(r)} cm.
        </span>
      )
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Στροφές Τροχού & Συνολική Απόσταση (Input & MCQ)
function makeWheelRotationsProblem(isTurnsCount = false, locale = 'el') {
  const isEn = locale === 'en';
  const numLocale = isEn ? 'en-US' : 'el-GR';
  const format = (n) => n.toLocaleString(numLocale);

  if (!isTurnsCount) {
    // q7: Υπολογισμός συνολικής απόστασης από στροφές (Input)
    const d = [50, 100][getRandomInt(0, 1)]; // cm
    const turns = [10, 20, 50, 100][getRandomInt(0, 3)];
    const lengthCm = 3.14 * d;
    const totalDistanceCm = turns * lengthCm;
    const totalDistanceM = Math.round(totalDistanceCm / 100);

    return {
      type: 'input',
      correct: totalDistanceM,
      unit: isEn ? 'meters ( m )' : 'μέτρα ( m )',
      prompt: isEn
        ? `A bicycle wheel has a diameter of ${format(d)} cm (circumference: 3.14 · ${format(d)} ＝ ${format(lengthCm)} cm). How many METERS ( m ) will the bicycle travel if the wheel makes exactly ${format(turns)} full rotations?`
        : `Η ρόδα ενός ποδηλάτου έχει διάμετρο ${format(d)} cm (άρα μήκος 3,14 · ${format(d)} ＝ ${format(lengthCm)} cm). Πόσα ΜΕΤΡΑ ( m ) θα διανύσει το ποδήλατο αν η ρόδα κάνει ακριβώς ${format(turns)} πλήρεις στροφές;`,
      explanation: isEn ? (
        <span className="inline-flex items-center flex-wrap gap-1">
          In each rotation, the wheel covers a distance equal to its circumference ({format(lengthCm)} cm). In {format(turns)} rotations: {format(turns)} · {format(lengthCm)} ＝ {format(totalDistanceCm)} cm. We convert to meters:
          <Fraction num={format(totalDistanceCm)} den="100" /> ＝ {format(totalDistanceM)} m.
        </span>
      ) : (
        <span className="inline-flex items-center flex-wrap gap-1">
          Σε κάθε στροφή, η ρόδα διανύει απόσταση ίση με το μήκος της ({format(lengthCm)} cm). Σε {format(turns)} στροφές διανύει: {format(turns)} · {format(lengthCm)} ＝ {format(totalDistanceCm)} cm. Μετατρέπουμε σε μέτρα:
          <Fraction num={format(totalDistanceCm)} den="100" /> ＝ {format(totalDistanceM)} m.
        </span>
      )
    };
  } else {
    // q8: Εύρεση αριθμού στροφών από απόσταση και μήκος τροχού (MCQ)
    const turnCases = [
      { lengthM: 2, distanceM: 100, turns: 50 },
      { lengthM: 2.5, distanceM: 250, turns: 100 },
      { lengthM: 1.5, distanceM: 300, turns: 200 },
      { lengthM: 2, distanceM: 400, turns: 200 }
    ];
    const c = turnCases[getRandomInt(0, turnCases.length - 1)];
    const distractors = [c.turns + 20, c.turns - 25, c.turns * 2].filter((v) => v > 0 && v !== c.turns);
    const suffix = isEn ? 'rotations' : 'στροφές';
    const rawOptions = [`${format(c.turns)} ${suffix}`, ...distractors.slice(0, 3).map((v) => `${format(v)} ${suffix}`)];

    return {
      type: 'mcq',
      correct: `${format(c.turns)} ${suffix}`,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt: isEn
        ? `A car wheel has a circumference of ${format(c.lengthM)} m. How many full rotations must the wheel make to cover a distance of ${format(c.distanceM)} m?`
        : `Ο τροχός ενός αυτοκινήτου έχει μήκος περιφέρειας ${format(c.lengthM)} m. Πόσες πλήρεις στροφές πρέπει να εκτελέσει ο τροχός για να καλύψει απόσταση ${format(c.distanceM)} m;`,
      explanation: isEn ? (
        <span className="inline-flex items-center flex-wrap gap-1">
          Divide total distance by circumference per rotation: Rotations ＝
          <Fraction num="Distance" den="Circumference" /> ＝
          <Fraction num={format(c.distanceM)} den={format(c.lengthM)} /> ＝ {format(c.turns)} rotations.
        </span>
      ) : (
        <span className="inline-flex items-center flex-wrap gap-1">
          Διαιρούμε τη συνολική απόσταση με το μήκος μιας πλήρους περιστροφής: Στροφές ＝
          <Fraction num="Απόσταση" den="Μήκος" /> ＝
          <Fraction num={format(c.distanceM)} den={format(c.lengthM)} /> ＝ {format(c.turns)} στροφές.
        </span>
      )
    };
  }
}

function generateQuestions(locale) {
  return {
    q1: makeCircumferenceCalculationQuestion(false, locale),
    q2: makeCircumferenceCalculationQuestion(true, locale),
    q3: makePiTheoryQuestion(false, locale),
    q4: makePiTheoryQuestion(true, locale),
    q5: makeReverseCircumferenceQuestion(false, locale),
    q6: makeReverseCircumferenceQuestion(true, locale),
    q7: makeWheelRotationsProblem(false, locale),
    q8: makeWheelRotationsProblem(true, locale)
  };
}

const translations = {
  el: {
    pageTitle: "Ασκήσεις: Μήκος Κύκλου - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στο μήκος του κύκλου: τύποι Μ = π · δ, Μ = 2 · π · ρ, ανάστροφη εύρεση διαμέτρου/ακτίνας και στροφές τροχών.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeChapter: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    mainHeading: "📝 Ασκήσεις: Το Μήκος του Κύκλου",
    mainSubheading: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "🔄 Νέες Ασκήσεις",
    checkAnswersBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "🏆 Σκορ:",
    successRate: "Επιτυχία:",
    scorePrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctAnswerIs: "Η σωστή απάντηση είναι:",
    q1Badge: "ΜΗΚΟΣ ΚΥΚΛΟΥ ΑΠΟ ΔΙΑΜΕΤΡΟ ( π ＝ 3,14 )",
    q2Badge: "ΜΗΚΟΣ ΚΥΚΛΟΥ ΑΠΟ ΑΚΤΙΝΑ ( 2 · π · ρ )",
    q3Badge: "Η ΣΗΜΑΣΙΑ ΤΟΥ ΑΡΙΘΜΟΥ π ≈ 3,14",
    q4Badge: "ΣΤΑΘΕΡΟΤΗΤΑ ΠΗΛΙΚΟΥ ΜΗΚΟΥΣ ΠΡΟΣ ΔΙΑΜΕΤΡΟ",
    q5Badge: "ΑΝΑΣΤΡΟΦΗ ΕΥΡΕΣΗ ΔΙΑΜΕΤΡΟΥ ( δ ＝ Μ ： 3,14 )",
    q6Badge: "ΑΝΑΣΤΡΟΦΗ ΕΥΡΕΣΗ ΑΚΤΙΝΑΣ ΑΠΟ ΜΗΚΟΣ",
    q7Badge: "ΑΠΟΣΤΑΣΗ ΑΠΟ ΣΤΡΟΦΕΣ ΤΡΟΧΟΥ ( ΣΕ ΜΕΤΡΑ )",
    q8Badge: "ΥΠΟΛΟΓΙΣΜΟΣ ΠΛΗΘΟΥΣ ΣΤΡΟΦΩΝ ΤΡΟΧΟΥ",
  },
  en: {
    pageTitle: "Exercises: Circumference of Circle - 5th Grade | LearnMaths.gr",
    pageDesc: "Challenging 5th Grade math exercises on circumference: formulas C = π · d, C = 2 · π · r, reverse diameter/radius calculation, and wheel rotations.",
    backText: "5th Grade",
    theoryBtn: "Theory",
    badgeChapter: "5TH GRADE • PRACTICE",
    mainHeading: "📝 Exercises: Circumference of the Circle",
    mainSubheading: "Every time you click \"New Exercises\", fresh examples are generated from the pool!",
    newExercisesBtn: "🔄 New Exercises",
    checkAnswersBtn: "🎯 Check Answers",
    scoreLabel: "🏆 Score:",
    successRate: "Success:",
    scorePrompt: "Complete all questions and click \"Check Answers\"!",
    correctAnswerIs: "The correct answer is:",
    q1Badge: "CIRCUMFERENCE FROM DIAMETER ( π ＝ 3.14 )",
    q2Badge: "CIRCUMFERENCE FROM RADIUS ( 2 · π · r )",
    q3Badge: "THE MEANING OF NUMBER π ≈ 3.14",
    q4Badge: "INVARIANCE OF CIRCUMFERENCE TO DIAMETER RATIO",
    q5Badge: "INVERSE DIAMETER CALCULATION ( d ＝ C ： 3.14 )",
    q6Badge: "INVERSE RADIUS CALCULATION FROM CIRCUMFERENCE",
    q7Badge: "DISTANCE FROM WHEEL ROTATIONS ( IN METERS )",
    q8Badge: "WHEEL ROTATION COUNT CALCULATION",
  }
};

export default function MikosKiklouAskPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

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

  const handleDecimalInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9,.]/g, '').replace('.', ',');
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const parseUserFloat = (val) => {
    if (!val) return NaN;
    return parseFloat(val.replace(',', '.'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    // q1
    if (Math.abs(parseUserFloat(answers.q1) - questions.q1.correct) < 0.05) currentScore += 1;
    // q2
    if (Math.abs(parseUserFloat(answers.q2) - questions.q2.correct) < 0.05) currentScore += 1;
    // q3
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    // q4
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    // q5
    if (Math.abs(parseUserFloat(answers.q5) - questions.q5.correct) < 0.05) currentScore += 1;
    // q6
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    // q7
    if (Math.abs(parseUserFloat(answers.q7) - questions.q7.correct) < 0.05) currentScore += 1;
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
                {t.correctAnswerIs} <strong className="font-bold text-rose-950">{qData.correct}</strong>. {qData.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Component για Ερωτήσεις Input (αριθμητικό/δεκαδικό)
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const userVal = parseUserFloat(answers[qKey]);
    const isCorrect = !isNaN(userVal) && Math.abs(userVal - qData.correct) < 0.05;
    const numLocale = locale === 'en' ? 'en-US' : 'el-GR';
    const formattedCorrect = qData.correct.toLocaleString(numLocale, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

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
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              maxLength={10}
              value={answers[qKey]}
              onChange={(e) => handleDecimalInput(qKey, e.target.value)}
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
                {t.correctAnswerIs} <strong className="font-bold text-rose-950">{formattedCorrect} {qData.unit}</strong>. {qData.explanation}
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
          href="/e-dimotikou/20-mikos-kiklou"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 overflow-x-hidden">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              {toCleanUppercase(t.badgeChapter)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              {t.mainHeading}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              {t.mainSubheading}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center cursor-pointer"
          >
            {t.newExercisesBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ & PB SAFE AREA */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-36">
          {renderInput('q1', questions.q1, 1, t.q1Badge, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.q2Badge, 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, t.q3Badge, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.q4Badge, 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, t.q5Badge, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.q6Badge, 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, t.q7Badge, 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, t.q8Badge, 'bg-purple-600')}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                {t.checkAnswersBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-6 2xl:py-5 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>{t.scoreLabel}</span>
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
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 2xl:px-7 2xl:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm 2xl:text-base flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                {t.newExercisesBtn}
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                {t.scorePrompt}
              </p>
            )}
          </div>
        </div>
      </footer>
    </Layout>
  );
}
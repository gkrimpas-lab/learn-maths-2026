// pages/e-dimotikou/18-ipsos-trigonou-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Υπολογισμός Εμβαδού από Βάση & Ύψος (Input)
function makeAreaFromBaseHeightQuestion(isRightTriangle = false, locale = 'el') {
  const isEn = locale === 'en';
  const format = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isRightTriangle) {
    // q1: Γενικό τρίγωνο (Ε = (β · υ) / 2)
    const base = [10, 12, 14, 16, 18, 20][getRandomInt(0, 5)];
    const height = [6, 8, 10, 12, 14][getRandomInt(0, 4)];
    const product = base * height;
    const area = product / 2;

    return {
      type: 'input',
      correct: area,
      unit: isEn ? 'cm² (area)' : 'cm² (εμβαδόν)',
      prompt: isEn
        ? `In a triangle, the base has length ${format(base)} cm and the corresponding height to it is ${format(height)} cm. What is the area of the triangle in cm²?`
        : `Σε ένα τρίγωνο, η βάση έχει μήκος ${format(base)} cm και το αντίστοιχο ύψος προς αυτήν είναι ${format(height)} cm. Πόσα cm² είναι το εμβαδόν του τριγώνου;`,
      explanation: isEn ? (
        <span className="inline-flex items-center flex-wrap gap-1">
          The formula for triangle area is: Area ＝
          <Fraction num="Base · Height" den="2" />.
          Therefore:
          <Fraction num={`${format(base)} · ${format(height)}`} den="2" /> ＝
          <Fraction num={format(product)} den="2" /> ＝ {format(area)} cm².
        </span>
      ) : (
        <span className="inline-flex items-center flex-wrap gap-1">
          Ο τύπος του εμβαδού τριγώνου είναι: Ε ＝
          <Fraction num="Βάση · Ύψος" den="2" />.
          Επομένως:
          <Fraction num={`${format(base)} · ${format(height)}`} den="2" /> ＝
          <Fraction num={format(product)} den="2" /> ＝ {format(area)} cm².
        </span>
      )
    };
  } else {
    // q2: Ορθογώνιο τρίγωνο (οι δύο κάθετες πλευρές δρουν ως βάση και ύψος)
    const side1 = [8, 10, 12, 14, 16][getRandomInt(0, 4)];
    const side2 = [6, 8, 10, 12][getRandomInt(0, 3)];
    const hypotenuse = side1 + getRandomInt(3, 6);
    const product = side1 * side2;
    const area = product / 2;

    return {
      type: 'input',
      correct: area,
      unit: isEn ? 'cm² (area)' : 'cm² (εμβαδόν)',
      prompt: isEn
        ? `A right-angled triangle has legs of length ${format(side1)} cm and ${format(side2)} cm, and a hypotenuse of ${format(hypotenuse)} cm. What is its area in cm²?`
        : `Ένα ορθογώνιο τρίγωνο έχει κάθετες πλευρές μήκους ${format(side1)} cm και ${format(side2)} cm, και υποτείνουσα ${format(hypotenuse)} cm. Πόσα cm² είναι το εμβαδόν του;`,
      explanation: isEn ? (
        <span className="inline-flex items-center flex-wrap gap-1">
          In a right-angled triangle, the two perpendicular legs serve as the base and corresponding height. We disregard the hypotenuse for area: Area ＝
          <Fraction num="side1 · side2" den="2" /> ＝
          <Fraction num={`${format(side1)} · ${format(side2)}`} den="2" /> ＝
          <Fraction num={format(product)} den="2" /> ＝ {format(area)} cm².
        </span>
      ) : (
        <span className="inline-flex items-center flex-wrap gap-1">
          Στο ορθογώνιο τρίγωνο, οι δύο κάθετες πλευρές λειτουργούν ως βάση και αντίστοιχο ύψος. Αγνοούμε την υποτείνουσα για το εμβαδόν: Ε ＝
          <Fraction num="πλευρά1 · πλευρά2" den="2" /> ＝
          <Fraction num={`${format(side1)} · ${format(side2)}`} den="2" /> ＝
          <Fraction num={format(product)} den="2" /> ＝ {format(area)} cm².
        </span>
      )
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Θέση του Ύψους & Είδος Τριγώνου (MCQ)
function makeHeightPositionQuestion(isIdentifyTriangle = false, locale = 'el') {
  const isEn = locale === 'en';

  if (!isIdentifyTriangle) {
    // q3: Πού πέφτει το ύψος σε αμβλυγώνιο τρίγωνο
    const correct = isEn
      ? 'Outside the triangle, on the extension of the base'
      : 'Έξω από το τρίγωνο, στην προέκταση της βάσης';
    const rawOptions = isEn
      ? [
          'Outside the triangle, on the extension of the base',
          'Always inside the triangle',
          'Coincides strictly with the longest side',
          'Falls exactly in the midpoint of the base'
        ]
      : [
          'Έξω από το τρίγωνο, στην προέκταση της βάσης',
          'Πάντα μέσα στο τρίγωνο',
          'Συμπίπτει υποχρεωτικά με τη μεγαλύτερη πλευρά',
          'Πέφτει ακριβώς στη μέση της βάσης'
        ];

    return {
      type: 'mcq',
      correct,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt: isEn
        ? 'In an OBTUSE triangle, where does the altitude drawn from an acute vertex to the opposite side land?'
        : 'Σε ένα ΑΜΒΛΥΓΩΝΙΟ τρίγωνο, πού πέφτει το ύψος που ξεκινά από μία από τις οξείες κορυφές του προς την απέναντι πλευρά;',
      explanation: isEn
        ? 'In obtuse triangles, altitudes originating from acute vertices fall outside the triangle, directly onto the extension of the opposite base.'
        : 'Στα αμβλυγώνια τρίγωνα, τα ύψη που ξεκινούν από τις οξείες γωνίες πέφτουν έξω από το τρίγωνο, πάνω στην προέκταση της αντίστοιχης βάσης.'
    };
  } else {
    // q4: Σε ποιο τρίγωνο δύο από τα ύψη συμπίπτουν με πλευρές
    const correct = isEn ? 'In the right-angled triangle' : 'Στο ορθογώνιο τρίγωνο';
    const rawOptions = isEn
      ? [
          'In the right-angled triangle',
          'In the acute triangle',
          'In the equilateral triangle',
          'In the obtuse scalene triangle'
        ]
      : [
          'Στο ορθογώνιο τρίγωνο',
          'Στο οξυγώνιο τρίγωνο',
          'Στο ισόπλευρο τρίγωνο',
          'Στο αμβλυγώνιο σκαληνό τρίγωνο'
        ];

    return {
      type: 'mcq',
      correct,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt: isEn
        ? 'In which type of triangle do two of its three altitudes coincide with two of its sides?'
        : 'Σε ποιο είδος τριγώνου δύο από τα τρία ύψη του συμπίπτουν με δύο πλευρές του τριγώνου;',
      explanation: isEn
        ? 'In a right-angled triangle, because the two perpendicular legs meet at 90°, each leg serves simultaneously as the altitude to the other.'
        : 'Στο ορθογώνιο τρίγωνο, επειδή οι δύο κάθετες πλευρές σχηματίζουν γωνία 90°, η καθεμία αποτελεί ταυτόχρονα και το ύψος προς την άλλη.'
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Ανάστροφος Υπολογισμός Ύψους ή Βάσης (Input & MCQ)
function makeReverseHeightQuestion(isMCQ = false, locale = 'el') {
  const isEn = locale === 'en';
  const format = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isMCQ) {
    // q5: Εύρεση ύψους από γνωστό εμβαδόν και βάση (Input)
    const base = [8, 10, 12, 14, 16][getRandomInt(0, 4)];
    const height = [5, 6, 7, 8, 9, 10][getRandomInt(0, 5)];
    const area = (base * height) / 2;
    const doubleArea = 2 * area;

    return {
      type: 'input',
      correct: height,
      unit: isEn ? 'cm (height)' : 'cm (ύψος)',
      prompt: isEn
        ? `The area of a triangle is ${format(area)} cm² and its base is ${format(base)} cm. How many cm is the corresponding height of the triangle?`
        : `Το εμβαδόν ενός τριγώνου είναι ${format(area)} cm² και η βάση του είναι ${format(base)} cm. Πόσα cm είναι το αντίστοιχο ύψος του τριγώνου;`,
      explanation: isEn ? (
        <span className="inline-flex items-center flex-wrap gap-1">
          We double the area and divide by the base: Height ＝
          <Fraction num="2 · Area" den="Base" /> ＝
          <Fraction num={`2 · ${format(area)}`} den={format(base)} /> ＝
          <Fraction num={format(doubleArea)} den={format(base)} /> ＝ {format(height)} cm.
        </span>
      ) : (
        <span className="inline-flex items-center flex-wrap gap-1">
          Διπλασιάζουμε το εμβαδόν και διαιρούμε με τη βάση: υ ＝
          <Fraction num="2 · Ε" den="Βάση" /> ＝
          <Fraction num={`2 · ${format(area)}`} den={format(base)} /> ＝
          <Fraction num={format(doubleArea)} den={format(base)} /> ＝ {format(height)} cm.
        </span>
      )
    };
  } else {
    // q6: Εύρεση βάσης από γνωστό εμβαδόν και ύψος (MCQ)
    const height = [6, 8, 10, 12][getRandomInt(0, 3)];
    const base = [12, 15, 18, 20][getRandomInt(0, 3)];
    const area = (base * height) / 2;
    const doubleArea = 2 * area;

    const distractors = [base + 4, Math.max(4, base - 4), base * 2];
    const rawOptions = [`${format(base)} cm`, ...distractors.map((d) => `${format(d)} cm`)];

    return {
      type: 'mcq',
      correct: `${format(base)} cm`,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt: isEn
        ? `A triangle has an area of ${format(area)} cm² and its height is ${format(height)} cm. What is the length of its corresponding base?`
        : `Ένα τρίγωνο έχει εμβαδόν ${format(area)} cm² και το ύψος του είναι ${format(height)} cm. Πόσο είναι το μήκος της αντίστοιχης βάσης;`,
      explanation: isEn ? (
        <span className="inline-flex items-center flex-wrap gap-1">
          Base ＝
          <Fraction num="2 · Area" den="Height" /> ＝
          <Fraction num={`2 · ${format(area)}`} den={format(height)} /> ＝
          <Fraction num={format(doubleArea)} den={format(height)} /> ＝ {format(base)} cm.
        </span>
      ) : (
        <span className="inline-flex items-center flex-wrap gap-1">
          Βάση ＝
          <Fraction num="2 · Ε" den="Ύψος" /> ＝
          <Fraction num={`2 · ${format(area)}`} den={format(height)} /> ＝
          <Fraction num={format(doubleArea)} den={format(height)} /> ＝ {format(base)} cm.
        </span>
      )
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετες Ιδιότητες, 3 Ύψη & Ορθόκεντρο (Input & MCQ)
function makeComplexHeightProblem(isOrthocenter = false, locale = 'el') {
  const isEn = locale === 'en';

  if (!isOrthocenter) {
    // q7: Πόσα ύψη έχει συνολικά κάθε τρίγωνο (Input)
    return {
      type: 'input',
      correct: 3,
      unit: isEn ? 'altitudes' : 'ύψη',
      prompt: isEn
        ? 'How many altitudes in total does EVERY triangle have (one corresponding to each vertex and base)?'
        : 'Πόσα ύψη έχει συνολικά ΚΑΘΕ τρίγωνο (ένα αντίστοιχο για κάθε κορυφή και βάση);',
      explanation: isEn
        ? 'Every triangle has exactly 3 vertices and 3 sides, therefore it possesses exactly 3 altitudes.'
        : 'Κάθε τρίγωνο έχει ακριβώς 3 κορυφές και 3 πλευρές, επομένως διαθέτει ακριβώς 3 ύψη (υα, υβ, υγ).'
    };
  } else {
    // q8: Κοινό σημείο τομής των 3 υψών (Ορθόκεντρο) (MCQ)
    const correct = isEn ? 'Orthocenter' : 'Ορθόκεντρο';
    const rawOptions = isEn
      ? ['Orthocenter', 'Centroid', 'Incenter', 'Circumcenter']
      : ['Ορθόκεντρο', 'Βαρύκεντρο', 'Έκκεντρο', 'Περίκεντρο'];

    return {
      type: 'mcq',
      correct,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt: isEn
        ? 'What is the geometric term for the common intersection point where all three altitudes of a triangle meet?'
        : 'Πώς ονομάζεται στη γεωμετρία το κοινό σημείο στο οποίο συναντιούνται (τέμνονται) και τα τρία ύψη ενός τριγώνου;',
      explanation: isEn
        ? 'The point where the three altitudes of a triangle intersect is called the Orthocenter.'
        : 'Το σημείο τομής των τριών υψών ενός τριγώνου ονομάζεται Ορθόκεντρο.'
    };
  }
}

function generateQuestions(locale) {
  return {
    q1: makeAreaFromBaseHeightQuestion(false, locale),
    q2: makeAreaFromBaseHeightQuestion(true, locale),
    q3: makeHeightPositionQuestion(false, locale),
    q4: makeHeightPositionQuestion(true, locale),
    q5: makeReverseHeightQuestion(false, locale),
    q6: makeReverseHeightQuestion(true, locale),
    q7: makeComplexHeightProblem(false, locale),
    q8: makeComplexHeightProblem(true, locale)
  };
}

const translations = {
  el: {
    pageTitle: "Ασκήσεις: Το Ύψος του Τριγώνου - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στο ύψος του τριγώνου: υπολογισμός εμβαδού, ανάστροφος υπολογισμός βάσης/ύψους, θέση ύψους και ορθόκεντρο.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeChapter: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    mainHeading: "📝 Ασκήσεις: Το Ύψος του Τριγώνου",
    mainSubheading: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "🔄 Νέες Ασκήσεις",
    checkAnswersBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "🏆 Σκορ:",
    successRate: "Επιτυχία:",
    scorePrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctAnswerIs: "Η σωστή απάντηση είναι:",
    q1Badge: "ΕΜΒΑΔΟΝ ΤΡΙΓΩΝΟΥ ΑΠΟ ΒΑΣΗ ΚΑΙ ΥΨΟΣ",
    q2Badge: "ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ",
    q3Badge: "ΘΕΣΗ ΥΨΟΥΣ ΣΕ ΑΜΒΛΥΓΩΝΙΟ ΤΡΙΓΩΝΟ",
    q4Badge: "ΥΨΗ ΠΟΥ ΣΥΜΠΙΠΤΟΥΝ ΜΕ ΠΛΕΥΡΕΣ",
    q5Badge: "ΑΝΑΣΤΡΟΦΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΥΨΟΥΣ",
    q6Badge: "ΑΝΑΣΤΡΟΦΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΒΑΣΗΣ",
    q7Badge: "ΠΛΗΘΟΣ ΥΨΩΝ ΚΑΘΕ ΤΡΙΓΩΝΟΥ",
    q8Badge: "ΣΗΜΕΙΟ ΤΟΜΗΣ ΥΨΩΝ ( ΟΡΘΟΚΕΝΤΡΟ )",
  },
  en: {
    pageTitle: "Exercises: Triangle Altitude - 5th Grade | LearnMaths.gr",
    pageDesc: "Challenging 5th Grade math exercises on triangle altitudes: area calculation, reverse base/height calculation, altitude position, and orthocenter.",
    backText: "5th Grade",
    theoryBtn: "Theory",
    badgeChapter: "5TH GRADE • PRACTICE",
    mainHeading: "📝 Exercises: Triangle Altitude & Area",
    mainSubheading: "Every time you click \"New Exercises\", fresh examples are generated from the pool!",
    newExercisesBtn: "🔄 New Exercises",
    checkAnswersBtn: "🎯 Check Answers",
    scoreLabel: "🏆 Score:",
    successRate: "Success:",
    scorePrompt: "Complete all questions and click \"Check Answers\"!",
    correctAnswerIs: "The correct answer is:",
    q1Badge: "TRIANGLE AREA FROM BASE AND HEIGHT",
    q2Badge: "RIGHT-ANGLED TRIANGLE AREA",
    q3Badge: "ALTITUDE POSITION IN OBTUSE TRIANGLE",
    q4Badge: "ALTITUDES COINCIDING WITH SIDES",
    q5Badge: "REVERSE CALCULATION OF HEIGHT",
    q6Badge: "REVERSE CALCULATION OF BASE",
    q7Badge: "TOTAL ALTITUDES PER TRIANGLE",
    q8Badge: "ALTITUDE INTERSECTION ( ORTHOCENTER )",
  }
};

export default function IpsosTrigonouAskPage() {
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

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9]/g, '');
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    if (parseInt(answers.q1, 10) === questions.q1.correct) currentScore += 1;
    if (parseInt(answers.q2, 10) === questions.q2.correct) currentScore += 1;
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (parseInt(answers.q7, 10) === questions.q7.correct) currentScore += 1;
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

  // Render Component για Ερωτήσεις Input
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    const format = (n) => n.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');

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
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              maxLength={10}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-40 h-12 sm:h-14 p-3 text-center rounded-2xl border-2 border-slate-300 font-mono text-lg sm:text-xl 2xl:text-2xl font-black focus:border-indigo-600 focus:outline-none bg-slate-50/60 focus:bg-white text-slate-900 disabled:opacity-75"
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
                {t.correctAnswerIs} <strong className="font-bold text-rose-950">{format(qData.correct)} {qData.unit}</strong>. {qData.explanation}
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
          href="/e-dimotikou/18-ipsos-trigonou"
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
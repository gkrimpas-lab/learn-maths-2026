// pages/e-dimotikou/13-gonies-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Συνάρτηση για άτονα κεφαλαία με εξαίρεση το Ε'
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

// Οπτική απόδοση κλάσματος (αριθμητής πάνω, κλασματική γραμμή, παρονομαστής κάτω)
function MathFraction({ numerator, denominator, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none ${className}`}>
      <span className="px-1 text-center border-b-[1.5px] border-current w-full pb-0.5">
        {numerator}
      </span>
      <span className="px-1 text-center pt-0.5 w-full">
        {denominator}
      </span>
    </span>
  );
}

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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Συμπληρωματικές & Παραπληρωματικές Γωνίες (Input)
function makeComplementarySupplementaryQuestion(isSupplementary = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isSupplementary) {
    // q1: Συμπληρωματική γωνία (άθροισμα = 90°)
    const deg = [25, 32, 45, 54, 63, 68, 72, 77][getRandomInt(0, 7)];
    const comp = 90 - deg;
    const degFmt = deg.toLocaleString(numberLocale);
    const compFmt = comp.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: comp,
      unit: isEn ? 'degrees ( ° )' : 'μοίρες ( ° )',
      prompt: isEn
        ? `An angle measures ${degFmt}°. How many degrees ( ° ) is its COMPLEMENTARY angle?`
        : `Μια γωνία έχει μέτρο ${degFmt}°. Πόσες μοίρες ( ° ) είναι η ΣΥΜΠΛΗΡΩΜΑΤΙΚΗ της γωνία;`,
      explanation: isEn
        ? `Two angles are called complementary when their sum is exactly 90° (forming a right angle). Therefore: 90° － ${degFmt}° ＝ ${compFmt}°.`
        : `Δύο γωνίες λέγονται συμπληρωματικές όταν το άθροισμά τους είναι ακριβώς 90° (σχηματίζουν ορθή γωνία). Επομένως: 90° － ${degFmt}° ＝ ${compFmt}°.`
    };
  } else {
    // q2: Παραπληρωματική γωνία (άθροισμα = 180°)
    const deg = [45, 60, 75, 110, 125, 135, 142, 155][getRandomInt(0, 7)];
    const supp = 180 - deg;
    const degFmt = deg.toLocaleString(numberLocale);
    const suppFmt = supp.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: supp,
      unit: isEn ? 'degrees ( ° )' : 'μοίρες ( ° )',
      prompt: isEn
        ? `An angle measures ${degFmt}°. How many degrees ( ° ) is its SUPPLEMENTARY angle?`
        : `Μια γωνία έχει μέτρο ${degFmt}°. Πόσες μοίρες ( ° ) είναι η ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ της γωνία;`,
      explanation: isEn
        ? `Two angles are called supplementary when their sum is exactly 180° (forming a straight angle). Therefore: 180° － ${degFmt}° ＝ ${suppFmt}°.`
        : `Δύο γωνίες λέγονται παραπληρωματικές όταν το άθροισμά τους είναι ακριβώς 180° (σχηματίζουν ευθεία γωνία). Επομένως: 180° － ${degFmt}° ＝ ${suppFmt}°.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Αναγνώριση & Κατάταξη Είδους Γωνίας (MCQ)
function makeAngleTypeClassificationQuestion(isIdentifyFromDegrees = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isIdentifyFromDegrees) {
    // q3: Δίνεται μέτρο σε μοίρες και ζητείται το είδος
    const cases = [
      {
        deg: 38,
        typeEl: 'Οξεία γωνία',
        typeEn: 'Acute angle',
        reasonEl: 'είναι μικρότερη από 90° ( 0° ＜ 38° ＜ 90° )',
        reasonEn: 'it is less than 90° ( 0° ＜ 38° ＜ 90° )'
      },
      {
        deg: 90,
        typeEl: 'Ορθή γωνία',
        typeEn: 'Right angle',
        reasonEl: 'είναι ακριβώς ίση με 90°',
        reasonEn: 'it is exactly equal to 90°'
      },
      {
        deg: 124,
        typeEl: 'Αμβλεία γωνία',
        typeEn: 'Obtuse angle',
        reasonEl: 'είναι μεγαλύτερη από 90° και μικρότερη από 180° ( 90° ＜ 124° ＜ 180° )',
        reasonEn: 'it is greater than 90° and less than 180° ( 90° ＜ 124° ＜ 180° )'
      },
      {
        deg: 180,
        typeEl: 'Ευθεία γωνία',
        typeEn: 'Straight angle',
        reasonEl: 'είναι ακριβώς ίση με 180°',
        reasonEn: 'it is exactly equal to 180°'
      },
      {
        deg: 67,
        typeEl: 'Οξεία γωνία',
        typeEn: 'Acute angle',
        reasonEl: 'είναι μικρότερη από 90° ( 0° ＜ 67° ＜ 90° )',
        reasonEn: 'it is less than 90° ( 0° ＜ 67° ＜ 90° )'
      },
      {
        deg: 145,
        typeEl: 'Αμβλεία γωνία',
        typeEn: 'Obtuse angle',
        reasonEl: 'είναι μεγαλύτερη από 90° και μικρότερη από 180° ( 90° ＜ 145° ＜ 180° )',
        reasonEn: 'it is greater than 90° and less than 180° ( 90° ＜ 145° ＜ 180° )'
      }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const allTypes = isEn
      ? ['Acute angle', 'Right angle', 'Obtuse angle', 'Straight angle']
      : ['Οξεία γωνία', 'Ορθή γωνία', 'Αμβλεία γωνία', 'Ευθεία γωνία'];

    const correct = isEn ? c.typeEn : c.typeEl;
    const reason = isEn ? c.reasonEn : c.reasonEl;
    const degFmt = c.deg.toLocaleString(numberLocale);

    return {
      type: 'mcq',
      correct,
      options: allTypes,
      prompt: isEn
        ? `How is an angle measuring exactly ${degFmt}° classified?`
        : `Πώς χαρακτηρίζεται μια γωνία που έχει μέτρο ακριβώς ${degFmt}°;`,
      explanation: isEn
        ? `An angle of ${degFmt}° is an ${correct}, because ${reason}.`
        : `Η γωνία ${degFmt}° είναι ${correct}, επειδή ${reason}.`
    };
  } else {
    // q4: Ποιο μέτρο αντιστοιχεί σε συγκεκριμένο είδος γωνίας
    const questionTypes = [
      {
        typeStrEl: 'ΑΜΒΛΕΙΑ',
        typeStrEn: 'OBTUSE',
        correctDeg: 135,
        distractors: [45, 90, 180],
        explEl: 'Η αμβλεία γωνία βρίσκεται ανάμεσα στις 90° και 180°. Η μόνη τέτοια τιμή είναι οι 135°.',
        explEn: 'An obtuse angle lies between 90° and 180°. The only such value is 135°.'
      },
      {
        typeStrEl: 'ΟΞΕΙΑ',
        typeStrEn: 'ACUTE',
        correctDeg: 64,
        distractors: [90, 115, 180],
        explEl: 'Η οξεία γωνία είναι μικρότερη από 90°. Η μόνη τέτοια τιμή είναι οι 64°.',
        explEn: 'An acute angle is less than 90°. The only such value is 64°.'
      }
    ];
    const chosen = questionTypes[getRandomInt(0, questionTypes.length - 1)];
    const correctDegStr = `${chosen.correctDeg.toLocaleString(numberLocale)}°`;
    const rawOptions = [chosen.correctDeg, ...chosen.distractors];
    const uniqueOptions = [...new Set(rawOptions)];
    const options = shuffleArray(uniqueOptions).map((d) => `${d.toLocaleString(numberLocale)}°`);

    return {
      type: 'mcq',
      correct: correctDegStr,
      options,
      prompt: isEn
        ? `Which of the following angle measures corresponds to an ${chosen.typeStrEn} angle?`
        : `Ποιο από τα παρακάτω μέτρα γωνιών αντιστοιχεί σε ${chosen.typeStrEl} γωνία;`,
      explanation: isEn ? chosen.explEn : chosen.explEl
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Διχοτόμος & Ισομοιρασιά Μοιρών (Input & MCQ)
function makeBisectorQuestion(isMCQ = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isMCQ) {
    // q5: Υπολογισμός μισής γωνίας από διχοτόμο (Input)
    const totalAngle = [64, 78, 86, 110, 128, 146][getRandomInt(0, 5)];
    const halfAngle = totalAngle / 2;

    const totalFmt = totalAngle.toLocaleString(numberLocale);
    const halfFmt = halfAngle.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: halfAngle,
      unit: isEn ? 'degrees ( ° )' : 'μοίρες ( ° )',
      prompt: isEn
        ? `The ray Od is the bisector of an angle measuring ${totalFmt}° (it divides it into two congruent angles). How many degrees ( ° ) does each of the two resulting angles measure?`
        : `Η ημιευθεία Οδ είναι η διχοτόμος μιας γωνίας ${totalFmt}° (τη χωρίζει δηλαδή σε δύο απολύτως ίσες γωνίες). Πόσες μοίρες ( ° ) είναι καθεμία από τις δύο νέες γωνίες;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>The bisector divides the angle into two equal parts:</span>
          <MathFraction numerator={`${totalFmt}°`} denominator="2" />
          <span>＝ {halfFmt}°.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Η διχοτόμος χωρίζει τη γωνία σε δύο ίσα μέρη:</span>
          <MathFraction numerator={`${totalFmt}°`} denominator="2" />
          <span>＝ {halfFmt}°.</span>
        </span>
      )
    };
  } else {
    // q6: Σύνθετη γωνία από 3 ίσα μέρη (MCQ)
    const singleAngle = [15, 20, 25, 30][getRandomInt(0, 3)];
    const totalAngle = singleAngle * 3;
    const rawDistractors = [totalAngle + 10, totalAngle - 15, totalAngle * 2, totalAngle + 20].filter(
      (v) => v !== totalAngle && v <= 180 && v > 0
    );
    const uniqueRawOptions = [...new Set([totalAngle, ...rawDistractors])].slice(0, 4);
    const options = shuffleArray(uniqueRawOptions).map((d) => `${d.toLocaleString(numberLocale)}°`);

    const singleFmt = singleAngle.toLocaleString(numberLocale);
    const totalFmt = totalAngle.toLocaleString(numberLocale);

    return {
      type: 'mcq',
      correct: `${totalFmt}°`,
      options,
      prompt: isEn
        ? `A large angle is divided by two rays into three equal adjacent angles of ${singleFmt}° each. What is the total measure of the large angle?`
        : `Μια μεγάλη γωνία χωρίζεται με δύο ημιευθείες σε τρεις ίσες διαδοχικές γωνίες των ${singleFmt}° η καθεμία. Πόσο είναι το συνολικό μέτρο της μεγάλης γωνίας;`,
      explanation: isEn
        ? `Multiply the measure of each part by 3: ${singleFmt}° · 3 ＝ ${totalFmt}°.`
        : `Πολλαπλασιάζουμε το μέτρο κάθε μέρους επί 3: ${singleFmt}° · 3 ＝ ${totalFmt}°.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Γωνιών & Ωρολογίου (Input & MCQ)
function makeComplexAngleProblem(isClock = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isClock) {
    // q7: Άθροισμα γωνιών τριγώνου = 180° (Input)
    const g1 = [40, 50, 60, 65, 70][getRandomInt(0, 4)];
    const g2 = [45, 55, 60, 70, 75][getRandomInt(0, 4)];
    const sumKnown = g1 + g2;
    const g3 = 180 - sumKnown;

    const g1Fmt = g1.toLocaleString(numberLocale);
    const g2Fmt = g2.toLocaleString(numberLocale);
    const sumFmt = sumKnown.toLocaleString(numberLocale);
    const g3Fmt = g3.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: g3,
      unit: isEn ? 'degrees ( ° )' : 'μοίρες ( ° )',
      prompt: isEn
        ? `In a triangle, the sum of all three interior angles is always 180°. If two of its angles measure ${g1Fmt}° and ${g2Fmt}°, how many degrees ( ° ) is the 3rd angle?`
        : `Σε ένα τρίγωνο, το άθροισμα και των τριών γωνιών του ισούται πάντα με 180°. Αν οι δύο γωνίες του είναι ${g1Fmt}° και ${g2Fmt}°, πόσες μοίρες ( ° ) είναι η 3η γωνία του τριγώνου;`,
      explanation: isEn
        ? `The sum of the two known angles is: ${g1Fmt}° ＋ ${g2Fmt}° ＝ ${sumFmt}°. The third angle equals: 180° － ${sumFmt}° ＝ ${g3Fmt}°.`
        : `Το άθροισμα των δύο γνωστών γωνιών είναι: ${g1Fmt}° ＋ ${g2Fmt}° ＝ ${sumFmt}°. Η τρίτη γωνία ισούται με: 180° － ${sumFmt}° ＝ ${g3Fmt}°.`
    };
  } else {
    // q8: Γωνία δεικτών ρολογιού (MCQ)
    const clockCases = [
      { time: '3:00', deg: 90 },
      { time: '2:00', deg: 60 },
      { time: '4:00', deg: 120 },
      { time: '6:00', deg: 180 }
    ];
    const c = clockCases[getRandomInt(0, clockCases.length - 1)];
    const rawDistractors = [30, 45, 90, 120, 180].filter((d) => d !== c.deg);
    const uniqueRawOptions = [...new Set([c.deg, ...rawDistractors])].slice(0, 4);
    const options = shuffleArray(uniqueRawOptions).map((d) => `${d.toLocaleString(numberLocale)}°`);

    const degFmt = c.deg.toLocaleString(numberLocale);

    return {
      type: 'mcq',
      correct: `${degFmt}°`,
      options,
      prompt: isEn
        ? `When a clock shows exactly ${c.time}, what angle measure (in degrees) is formed between the hour hand and the minute hand?`
        : `Όταν ένα ρολόι δείχνει ακριβώς ${c.time}, τι μέτρο (σε μοίρες) σχηματίζουν μεταξύ τους ο ωροδείκτης και ο λεπτοδείκτης;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>The full clock circle is 360°. Each hour corresponds to:</span>
          <MathFraction numerator="360°" denominator="12" />
          <span>＝ 30°. At {c.time}, the hands are separated by enough positions to form an angle of {degFmt}°.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Ο κύκλος του ρολογιού είναι 360°. Κάθε ώρα αντιστοιχεί σε:</span>
          <MathFraction numerator="360°" denominator="12" />
          <span>＝ 30°. Στις {c.time}, οι δείκτες απέχουν τόσες θέσεις ώστε σχηματίζουν γωνία {degFmt}°.</span>
        </span>
      )
    };
  }
}

function generateQuestions(isEn = false) {
  return {
    q1: makeComplementarySupplementaryQuestion(false, isEn),
    q2: makeComplementarySupplementaryQuestion(true, isEn),
    q3: makeAngleTypeClassificationQuestion(false, isEn),
    q4: makeAngleTypeClassificationQuestion(true, isEn),
    q5: makeBisectorQuestion(false, isEn),
    q6: makeBisectorQuestion(true, isEn),
    q7: makeComplexAngleProblem(false, isEn),
    q8: makeComplexAngleProblem(true, isEn)
  };
}

const I18N = {
  el: {
    pageTitle: "Ασκήσεις: Τα Είδη των Γωνιών - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στις γωνίες: συμπληρωματικές, παραπληρωματικές, κατάταξη ειδών, διχοτόμοι και γωνίες τριγώνων.",
    backText: "Ε' Δημοτικού",
    theoryButton: "Θεωρία",
    badgeChapter: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    pageHeader: "📝 Ασκήσεις: Τα Είδη των Γωνιών",
    pageSubheader: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreBadge: "Σκορ:",
    successRate: "Επιτυχία:",
    bottomPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctFeedbackPrefix: "Η σωστή απάντηση είναι:",
    qTitles: {
      q1: "ΣΥΜΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ",
      q2: "ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ",
      q3: "ΚΑΤΑΤΑΞΗ ΕΙΔΟΥΣ ΓΩΝΙΑΣ",
      q4: "ΕΝΤΟΠΙΣΜΟΣ ΜΕΤΡΟΥ ΓΩΝΙΑΣ",
      q5: "ΔΙΧΟΤΟΜΟΣ ΓΩΝΙΑΣ",
      q6: "ΣΥΝΘΕΣΗ ΓΩΝΙΩΝ ΑΠΟ ΙΣΑ ΜΕΡΗ",
      q7: "ΤΡΙΤΗ ΓΩΝΙΑ ΤΡΙΓΩΝΟΥ",
      q8: "ΓΩΝΙΑ ΔΕΙΚΤΩΝ ΩΡΟΛΟΓΙΟΥ"
    }
  },
  en: {
    pageTitle: "Exercises: Types of Angles - 5th Grade | LearnMaths.gr",
    pageDescription: "Challenging 5th Grade math exercises on angles: complementary, supplementary, angle types, bisectors, and triangle angles.",
    backText: "5th Grade",
    theoryButton: "Theory",
    badgeChapter: "5TH GRADE • PRACTICE",
    pageHeader: "📝 Exercises: Types of Angles",
    pageSubheader: "Every time you click \"New Exercises\", a fresh randomized problem set is generated!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreBadge: "Score:",
    successRate: "Success:",
    bottomPrompt: "Complete all questions and click \"Check Answers\"!",
    correctFeedbackPrefix: "The correct answer is:",
    qTitles: {
      q1: "COMPLEMENTARY ANGLE",
      q2: "SUPPLEMENTARY ANGLE",
      q3: "ANGLE CLASSIFICATION",
      q4: "IDENTIFY ANGLE MEASURE",
      q5: "ANGLE BISECTOR",
      q6: "COMPOSED ANGLE FROM EQUAL PARTS",
      q7: "THIRD TRIANGLE ANGLE",
      q8: "CLOCK HANDS ANGLE"
    }
  }
};

export default function GoniesAskPage() {
  const router = useRouter();
  const { locale } = router;
  const isEn = locale === 'en';
  const t = isEn ? I18N.en : I18N.el;
  const numberLocale = isEn ? 'en-US' : 'el-GR';

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
  }, [locale]);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9]/g, '').slice(0, 10);
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
            <div className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.prompt}
            </div>
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
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono flex flex-wrap items-center gap-1.5">
                <span>{t.correctFeedbackPrefix}</span>
                <strong className="font-bold text-rose-950">{qData.correct}</strong>.
                <span>{qData.explanation}</span>
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
            <div className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.prompt}
            </div>
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
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono flex flex-wrap items-center gap-1.5">
                <span>{t.correctFeedbackPrefix}</span>
                <strong className="font-bold text-rose-950">
                  {qData.correct.toLocaleString(numberLocale)} {qData.unit}
                </strong>.
                <span>{qData.explanation}</span>
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
          href="/e-dimotikou/13-gonies"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryButton}
        </Link>
      }
    >
      {/* Container πλήρους εύρους σύμφωνα με τις προδιαγραφές */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              {toCleanUppercase(t.badgeChapter)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              {t.pageHeader}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              {t.pageSubheader}
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
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderInput('q1', questions.q1, 1, t.qTitles.q1, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.qTitles.q2, 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, t.qTitles.q3, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.qTitles.q4, 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, t.qTitles.q5, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.qTitles.q6, 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, t.qTitles.q7, 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, t.qTitles.q8, 'bg-purple-600')}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
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

      {/* ΣΤΑΘΕΡΟ BOTTOM FOOTER */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreBadge}</span>
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
                {t.bottomPrompt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
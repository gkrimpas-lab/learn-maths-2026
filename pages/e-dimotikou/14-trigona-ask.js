// pages/e-dimotikou/14-trigona-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εύρεση 3ης Άγνωστης Γωνίας (Input)
function makeMissingAngleQuestion(isRightTriangle = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isRightTriangle) {
    // q1: Γενικό τρίγωνο με δύο γνωστές γωνίες
    const a = [35, 42, 50, 55, 62, 68, 74][getRandomInt(0, 6)];
    const b = [40, 48, 52, 58, 64, 70][getRandomInt(0, 5)];
    const knownSum = a + b;
    const c = 180 - knownSum;

    const aFmt = a.toLocaleString(numberLocale);
    const bFmt = b.toLocaleString(numberLocale);
    const sumFmt = knownSum.toLocaleString(numberLocale);
    const cFmt = c.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: c,
      unit: isEn ? 'degrees ( ° )' : 'μοίρες ( ° )',
      prompt: isEn
        ? `In a triangle ABC, angle A measures ${aFmt}° and angle B measures ${bFmt}°. How many degrees ( ° ) is angle C?`
        : `Σε ένα τρίγωνο ΑΒΓ, η γωνία Α είναι ${aFmt}° και η γωνία Β είναι ${bFmt}°. Πόσες μοίρες ( ° ) είναι η γωνία Γ;`,
      explanation: isEn
        ? `The sum of the angles in any triangle is 180°. Add the known angles: ${aFmt}° ＋ ${bFmt}° ＝ ${sumFmt}°. The third angle is: 180° － ${sumFmt}° ＝ ${cFmt}°.`
        : `Το άθροισμα των γωνιών κάθε τριγώνου είναι 180°. Αθροίζουμε τις γνωστές γωνίες: ${aFmt}° ＋ ${bFmt}° ＝ ${sumFmt}°. Η τρίτη γωνία ισούται με: 180° － ${sumFmt}° ＝ ${cFmt}°.`
    };
  } else {
    // q2: Ορθογώνιο τρίγωνο (μία γωνία είναι 90°, ζητείται η άλλη οξεία)
    const acute1 = [24, 32, 38, 46, 54, 62, 71][getRandomInt(0, 6)];
    const acute2 = 90 - acute1;

    const acute1Fmt = acute1.toLocaleString(numberLocale);
    const acute2Fmt = acute2.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: acute2,
      unit: isEn ? 'degrees ( ° )' : 'μοίρες ( ° )',
      prompt: isEn
        ? `In a right triangle, one acute angle measures ${acute1Fmt}°. How many degrees ( ° ) is the other acute angle?`
        : `Σε ένα ορθογώνιο τρίγωνο, η μία οξεία γωνία του έχει μέτρο ${acute1Fmt}°. Πόσες μοίρες ( ° ) είναι η άλλη οξεία γωνία του;`,
      explanation: isEn
        ? `In any right triangle, the two acute angles are complementary (their sum is 90°). Therefore: 90° － ${acute1Fmt}° ＝ ${acute2Fmt}°.`
        : `Σε κάθε ορθογώνιο τρίγωνο, οι δύο οξείες γωνίες είναι συμπληρωματικές (έχουν άθροισμα 90°). Επομένως: 90° － ${acute1Fmt}° ＝ ${acute2Fmt}°.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Κατάταξη Τριγώνου ως προς τις Γωνίες (MCQ)
function makeTriangleClassificationQuestion(isIdentifyFromDegrees = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isIdentifyFromDegrees) {
    // q3: Δίνονται δύο γωνίες, υπολογίζεται η τρίτη και ζητείται το είδος του τριγώνου
    const cases = [
      {
        a: 30, b: 60, c: 90,
        typeEl: 'Ορθογώνιο τρίγωνο', typeEn: 'Right triangle',
        reasonEl: 'έχει μία ορθή γωνία ( 90° )', reasonEn: 'it has one right angle ( 90° )'
      },
      {
        a: 25, b: 35, c: 120,
        typeEl: 'Αμβλυγώνιο τρίγωνο', typeEn: 'Obtuse triangle',
        reasonEl: 'έχει μία αμβλεία γωνία 120° ( ＞ 90° )', reasonEn: 'it has one obtuse angle of 120° ( ＞ 90° )'
      },
      {
        a: 55, b: 65, c: 60,
        typeEl: 'Οξυγώνιο τρίγωνο', typeEn: 'Acute triangle',
        reasonEl: 'όλες οι γωνίες του είναι οξείες ( ＜ 90° )', reasonEn: 'all of its angles are acute ( ＜ 90° )'
      },
      {
        a: 45, b: 45, c: 90,
        typeEl: 'Ορθογώνιο τρίγωνο', typeEn: 'Right triangle',
        reasonEl: 'έχει μία ορθή γωνία ( 90° )', reasonEn: 'it has one right angle ( 90° )'
      },
      {
        a: 20, b: 40, c: 120,
        typeEl: 'Αμβλυγώνιο τρίγωνο', typeEn: 'Obtuse triangle',
        reasonEl: 'έχει μία αμβλεία γωνία 120° ( ＞ 90° )', reasonEn: 'it has one obtuse angle of 120° ( ＞ 90° )'
      },
      {
        a: 70, b: 50, c: 60,
        typeEl: 'Οξυγώνιο τρίγωνο', typeEn: 'Acute triangle',
        reasonEl: 'και οι τρεις γωνίες του είναι μικρότερες από 90°', reasonEn: 'all three of its angles are less than 90°'
      }
    ];
    const item = cases[getRandomInt(0, cases.length - 1)];
    const options = isEn
      ? ['Acute triangle', 'Right triangle', 'Obtuse triangle', 'Equilateral triangle']
      : ['Οξυγώνιο τρίγωνο', 'Ορθογώνιο τρίγωνο', 'Αμβλυγώνιο τρίγωνο', 'Ισόπλευρο τρίγωνο'];

    const correct = isEn ? item.typeEn : item.typeEl;
    const reason = isEn ? item.reasonEn : item.reasonEl;
    const aFmt = item.a.toLocaleString(numberLocale);
    const bFmt = item.b.toLocaleString(numberLocale);
    const cFmt = item.c.toLocaleString(numberLocale);

    return {
      type: 'mcq',
      correct,
      options,
      prompt: isEn
        ? `A triangle has two angles measuring ${aFmt}° and ${bFmt}°. How is this triangle classified by its angles?`
        : `Ένα τρίγωνο έχει δύο γωνίες με μέτρα ${aFmt}° και ${bFmt}°. Πώς κατατάσσεται το τρίγωνο αυτό ως προς τις γωνίες του;`,
      explanation: isEn
        ? `The third angle is 180° － (${aFmt}° ＋ ${bFmt}°) ＝ ${cFmt}°. Because ${reason}, it is an ${correct}.`
        : `Η τρίτη γωνία είναι 180° － (${aFmt}° ＋ ${bFmt}°) ＝ ${cFmt}°. Επειδή το τρίγωνο ${reason}, είναι ${correct}.`
    };
  } else {
    // q4: Ποια τριάδα γωνιών μπορεί να ανήκει σε οξυγώνιο τρίγωνο
    const validOxy = ['50°, 60°, 70°', '45°, 65°, 70°', '55°, 55°, 70°'][getRandomInt(0, 2)];
    const distractors = [
      '30°, 60°, 90°',   // ορθογώνιο
      '20°, 40°, 120°',  // αμβλυγώνιο
      '40°, 50°, 100°'   // άθροισμα 190
    ];
    const options = shuffleArray([validOxy, ...distractors]);

    return {
      type: 'mcq',
      correct: validOxy,
      options,
      prompt: isEn
        ? `Which of the following triplets of angles corresponds to an ACUTE triangle?`
        : `Ποια από τις παρακάτω τριάδες γωνιών αντιστοιχεί σε ΟΞΥΓΩΝΙΟ τρίγωνο;`,
      explanation: isEn
        ? `In an acute triangle, the sum of angles must equal exactly 180° AND every angle must be strictly less than 90°. The only valid triplet is: ${validOxy}.`
        : `Στο οξυγώνιο τρίγωνο, το άθροισμα των γωνιών πρέπει να είναι ακριβώς 180° ΚΑΙ καμία γωνία να μην είναι ίση ή μεγαλύτερη από 90°. Η μόνη σωστή τριάδα είναι: ${validOxy}.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Ισοσκελή & Ισόπλευρα Τρίγωνα (Input & MCQ)
function makeIsoscelesEquilateralQuestion(isEquilateral = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isEquilateral) {
    // q5: Ισοσκελές τρίγωνο (δίνεται η γωνία κορυφής, ζητείται η γωνία βάσης)
    const vertexAngle = [30, 40, 50, 70, 80, 100][getRandomInt(0, 5)];
    const diff = 180 - vertexAngle;
    const baseAngle = diff / 2;

    const vertFmt = vertexAngle.toLocaleString(numberLocale);
    const diffFmt = diff.toLocaleString(numberLocale);
    const baseFmt = baseAngle.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: baseAngle,
      unit: isEn ? 'degrees ( ° )' : 'μοίρες ( ° )',
      prompt: isEn
        ? `In an isosceles triangle, the vertex angle measures ${vertFmt}°. How many degrees ( ° ) does each of the two equal base angles measure?`
        : `Σε ένα ισοσκελές τρίγωνο, η γωνία της κορυφής είναι ${vertFmt}°. Πόσες μοίρες ( ° ) είναι καθεμία από τις δύο ίσες γωνίες της βάσης του;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>In an isosceles triangle, the base angles are equal. Subtract the vertex angle from 180°: 180° － {vertFmt}° ＝ {diffFmt}°. Divide by 2:</span>
          <MathFraction numerator={`${diffFmt}°`} denominator="2" />
          <span>＝ {baseFmt}°.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Στο ισοσκελές τρίγωνο, οι γωνίες της βάσης είναι απολύτως ίσες. Αφαιρούμε τη γωνία κορυφής από το 180°: 180° － {vertFmt}° ＝ {diffFmt}°. Διαιρούμε διά 2:</span>
          <MathFraction numerator={`${diffFmt}°`} denominator="2" />
          <span>＝ {baseFmt}°.</span>
        </span>
      )
    };
  } else {
    // q6: Ισόπλευρο τρίγωνο (MCQ)
    const options = shuffleArray(['45°', '60°', '90°', '120°']);

    return {
      type: 'mcq',
      correct: '60°',
      options,
      prompt: isEn
        ? `How many degrees does each interior angle of an EQUILATERAL triangle measure?`
        : `Πόσες μοίρες είναι κάθε εσωτερική γωνία ενός ΙΣΟΠΛΕΥΡΟΥ τριγώνου;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>In an equilateral triangle all three sides are equal, so all three angles are equal:</span>
          <MathFraction numerator="180°" denominator="3" />
          <span>＝ 60°.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Στο ισόπλευρο τρίγωνο και οι τρεις πλευρές είναι ίσες, άρα και οι τρεις γωνίες είναι ίσες μεταξύ τους:</span>
          <MathFraction numerator="180°" denominator="3" />
          <span>＝ 60°.</span>
        </span>
      )
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Γωνιών & Απέναντι Πλευρών (Input & MCQ)
function makeComplexTriangleQuestion(isSideRelation = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isSideRelation) {
    // q7: Παραπληρωματική εξωτερική γωνία και εύρεση εσωτερικής (Input)
    const extAngle = [110, 120, 130, 140, 150][getRandomInt(0, 4)];
    const intAngleA = 180 - extAngle;
    const intAngleB = [35, 45, 55, 65][getRandomInt(0, 3)];
    const sumAB = intAngleA + intAngleB;
    const intAngleC = 180 - sumAB;

    const extFmt = extAngle.toLocaleString(numberLocale);
    const intAFmt = intAngleA.toLocaleString(numberLocale);
    const intBFmt = intAngleB.toLocaleString(numberLocale);
    const sumABFmt = sumAB.toLocaleString(numberLocale);
    const intCFmt = intAngleC.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: intAngleC,
      unit: isEn ? 'degrees ( ° )' : 'μοίρες ( ° )',
      prompt: isEn
        ? `In a triangle ABC, the exterior angle at vertex A is ${extFmt}°, meaning interior angle A is its supplement. If angle B is ${intBFmt}°, how many degrees ( ° ) is angle C?`
        : `Σε ένα τρίγωνο ΑΒΓ, η εξωτερική γωνία της κορυφής Α είναι ${extFmt}°, άρα η εσωτερική γωνία Α είναι παραπληρωματική της. Αν η γωνία Β είναι ${intBFmt}°, πόσες μοίρες ( ° ) είναι η γωνία Γ;`,
      explanation: isEn
        ? `Interior angle A equals 180° － ${extFmt}° ＝ ${intAFmt}°. The sum of angles A and B is ${intAFmt}° ＋ ${intBFmt}° ＝ ${sumABFmt}°. Therefore angle C is: 180° － ${sumABFmt}° ＝ ${intCFmt}°.`
        : `Η εσωτερική γωνία Α ισούται με 180° － ${extFmt}° ＝ ${intAFmt}°. Το άθροισμα των γωνιών Α και Β είναι ${intAFmt}° ＋ ${intBFmt}° ＝ ${sumABFmt}°. Άρα η γωνία Γ είναι: 180° － ${sumABFmt}° ＝ ${intCFmt}°.`
    };
  } else {
    // q8: Συσχέτιση απέναντι πλευράς και μεγαλύτερης γωνίας (MCQ)
    const options = isEn
      ? [
          'The hypotenuse (opposite the 90° right angle)',
          'The shorter leg',
          'Either of the two legs',
          'All sides are always equal'
        ]
      : [
          'Η υποτείνουσα (απέναντι από την ορθή γωνία των 90°)',
          'Η μικρότερη κάθετη πλευρά',
          'Οποιαδήποτε από τις δύο κάθετες πλευρές',
          'Όλες οι πλευρές είναι πάντα ίσες'
        ];

    const correct = isEn
      ? 'The hypotenuse (opposite the 90° right angle)'
      : 'Η υποτείνουσα (απέναντι από την ορθή γωνία των 90°)';

    return {
      type: 'mcq',
      correct,
      options,
      prompt: isEn
        ? `In a right triangle, which side is ALWAYS the longest in length?`
        : `Σε ένα ορθογώνιο τρίγωνο, ποια πλευρά είναι ΠΑΝΤΑ η μεγαλύτερη σε μήκος;`,
      explanation: isEn
        ? `In every triangle, opposite the largest angle always lies the longest side. In a right triangle, the largest angle is the right angle (90°), so the longest side is the hypotenuse.`
        : `Σε κάθε τρίγωνο, απέναντι από τη μεγαλύτερη γωνία βρίσκεται πάντοτε η μεγαλύτερη πλευρά. Στο ορθογώνιο τρίγωνο, η μεγαλύτερη γωνία είναι η ορθή (90°), άρα η μεγαλύτερη πλευρά είναι η υποτείνουσα.`
    };
  }
}

function generateQuestions(isEn = false) {
  return {
    q1: makeMissingAngleQuestion(false, isEn),
    q2: makeMissingAngleQuestion(true, isEn),
    q3: makeTriangleClassificationQuestion(false, isEn),
    q4: makeTriangleClassificationQuestion(true, isEn),
    q5: makeIsoscelesEquilateralQuestion(false, isEn),
    q6: makeIsoscelesEquilateralQuestion(true, isEn),
    q7: makeComplexTriangleQuestion(false, isEn),
    q8: makeComplexTriangleQuestion(true, isEn)
  };
}

const I18N = {
  el: {
    pageTitle: "Ασκήσεις: Τρίγωνα ως προς τις Γωνίες - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα τρίγωνα: εύρεση άγνωστης γωνίας, κατάταξη τριγώνων, ισοσκελή, ισόπλευρα και σχέσεις πλευρών-γωνιών.",
    backText: "Ε' Δημοτικού",
    theoryButton: "Θεωρία",
    badgeChapter: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    pageHeader: "📝 Ασκήσεις: Τρίγωνα ως προς τις Γωνίες",
    pageSubheader: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreBadge: "Σκορ:",
    successRate: "Επιτυχία:",
    bottomPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctFeedbackPrefix: "Η σωστή απάντηση είναι:",
    qTitles: {
      q1: "ΤΡΙΤΗ ΓΩΝΙΑ ΤΡΙΓΩΝΟΥ",
      q2: "ΟΞΕΙΑ ΓΩΝΙΑ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ",
      q3: "ΚΑΤΑΤΑΞΗ ΤΡΙΓΩΝΟΥ ΩΣ ΠΡΟΣ ΤΙΣ ΓΩΝΙΕΣ",
      q4: "ΕΝΤΟΠΙΣΜΟΣ ΟΞΥΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ",
      q5: "ΓΩΝΙΑ ΒΑΣΗΣ ΙΣΟΣΚΕΛΟΥΣ ΤΡΙΓΩΝΟΥ",
      q6: "ΓΩΝΙΕΣ ΙΣΟΠΛΕΥΡΟΥ ΤΡΙΓΩΝΟΥ",
      q7: "ΕΞΩΤΕΡΙΚΗ ΚΑΙ ΕΣΩΤΕΡΙΚΗ ΓΩΝΙΑ",
      q8: "ΥΠΟΤΕΙΝΟΥΣΑ & ΜΕΓΙΣΤΗ ΠΛΕΥΡΑ"
    }
  },
  en: {
    pageTitle: "Exercises: Triangles by Angles - 5th Grade | LearnMaths.gr",
    pageDescription: "Challenging 5th Grade math exercises on triangles: unknown angles, classification, isosceles and equilateral properties, and angle-side relationships.",
    backText: "5th Grade",
    theoryButton: "Theory",
    badgeChapter: "5TH GRADE • PRACTICE",
    pageHeader: "📝 Exercises: Triangles by Angles",
    pageSubheader: "Every time you click \"New Exercises\", a fresh randomized problem set is generated!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreBadge: "Score:",
    successRate: "Success:",
    bottomPrompt: "Complete all questions and click \"Check Answers\"!",
    correctFeedbackPrefix: "The correct answer is:",
    qTitles: {
      q1: "THIRD TRIANGLE ANGLE",
      q2: "ACUTE ANGLE OF RIGHT TRIANGLE",
      q3: "CLASSIFY TRIANGLE BY ANGLES",
      q4: "IDENTIFY ACUTE TRIANGLE",
      q5: "BASE ANGLE OF ISOSCELES TRIANGLE",
      q6: "EQUILATERAL TRIANGLE ANGLES",
      q7: "EXTERIOR & INTERIOR ANGLES",
      q8: "HYPOTENUSE & LONGEST SIDE"
    }
  }
};

export default function TrigonaAskPage() {
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
          href="/e-dimotikou/14-trigona"
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
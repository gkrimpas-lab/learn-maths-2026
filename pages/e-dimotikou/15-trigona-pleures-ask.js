// pages/e-dimotikou/15-trigona-pleures-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Περίμετρος & Εύρεση Άγνωστης Πλευράς (Input)
function makePerimeterQuestion(isSideFromPerimeter = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isSideFromPerimeter) {
    // q1: Υπολογισμός περιμέτρου ισοσκελούς τριγώνου
    const equalSide = [12, 14, 16, 18, 22, 25][getRandomInt(0, 5)];
    const base = [10, 15, 20, 24][getRandomInt(0, 3)];
    const twoSides = equalSide * 2;
    const perimeter = twoSides + base;

    const equalSideFmt = equalSide.toLocaleString(numberLocale);
    const baseFmt = base.toLocaleString(numberLocale);
    const twoSidesFmt = twoSides.toLocaleString(numberLocale);
    const perimeterFmt = perimeter.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: perimeter,
      unit: isEn ? 'cm (perimeter)' : 'cm (περίμετρος)',
      prompt: isEn
        ? `An isosceles triangle has a base of ${baseFmt} cm and each of its two equal sides is ${equalSideFmt} cm. What is its perimeter in cm?`
        : `Ένα ισοσκελές τρίγωνο έχει βάση ${baseFmt} cm και καθεμία από τις δύο ίσες πλευρές του είναι ${equalSideFmt} cm. Πόσα cm είναι η περίμετρός του;`,
      explanation: isEn
        ? `The perimeter equals the sum of all sides: (2 · ${equalSideFmt}) ＋ ${baseFmt} ＝ ${twoSidesFmt} ＋ ${baseFmt} ＝ ${perimeterFmt} cm.`
        : `Η περίμετρος ισούται με το άθροισμα όλων των πλευρών: (2 · ${equalSideFmt}) ＋ ${baseFmt} ＝ ${twoSidesFmt} ＋ ${baseFmt} ＝ ${perimeterFmt} cm.`
    };
  } else {
    // q2: Εύρεση μήκους πλευράς ισόπλευρου τριγώνου από γνωστή περίμετρο
    const side = [9, 12, 15, 18, 21, 24, 27][getRandomInt(0, 6)];
    const perimeter = side * 3;

    const sideFmt = side.toLocaleString(numberLocale);
    const perimeterFmt = perimeter.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: side,
      unit: isEn ? 'cm (side length)' : 'cm (μήκος πλευράς)',
      prompt: isEn
        ? `The perimeter of an equilateral triangle is ${perimeterFmt} cm. What is the length of each of its sides in cm?`
        : `Η περίμετρος ενός ισόπλευρου τριγώνου είναι ${perimeterFmt} cm. Πόσα cm είναι το μήκος της κάθε πλευράς του;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>In an equilateral triangle all three sides are equal. Divide the perimeter by 3:</span>
          <MathFraction numerator={`${perimeterFmt} cm`} denominator="3" />
          <span>＝ {sideFmt} cm.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Στο ισόπλευρο τρίγωνο και οι τρεις πλευρές είναι απολύτως ίσες. Διαιρούμε την περίμετρο διά 3:</span>
          <MathFraction numerator={`${perimeterFmt} cm`} denominator="3" />
          <span>＝ {sideFmt} cm.</span>
        </span>
      )
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Κατάταξη ως προς τις Πλευρές (MCQ)
function makeSideClassificationQuestion(isIdentifyFromSides = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isIdentifyFromSides) {
    // q3: Δίνονται 3 πλευρές και ζητείται η ονομασία του τριγώνου
    const cases = [
      {
        a: 14, b: 14, c: 14,
        typeEl: 'Ισόπλευρο τρίγωνο', typeEn: 'Equilateral triangle',
        explEl: 'και οι 3 πλευρές είναι ίσες ( 14 cm )', explEn: 'all 3 sides are equal ( 14 cm )'
      },
      {
        a: 16, b: 16, c: 10,
        typeEl: 'Ισοσκελές τρίγωνο', typeEn: 'Isosceles triangle',
        explEl: 'έχει 2 πλευρές ίσες ( 16 cm ) και 1 διαφορετική', explEn: 'it has 2 equal sides ( 16 cm ) and 1 different'
      },
      {
        a: 12, b: 15, c: 19,
        typeEl: 'Σκαληνό τρίγωνο', typeEn: 'Scalene triangle',
        explEl: 'και οι 3 πλευρές του έχουν διαφορετικό μήκος', explEn: 'all 3 of its sides have different lengths'
      },
      {
        a: 20, b: 20, c: 12,
        typeEl: 'Ισοσκελές τρίγωνο', typeEn: 'Isosceles triangle',
        explEl: 'έχει 2 πλευρές ίσες ( 20 cm )', explEn: 'it has 2 equal sides ( 20 cm )'
      },
      {
        a: 9, b: 12, c: 15,
        typeEl: 'Σκαληνό τρίγωνο', typeEn: 'Scalene triangle',
        explEl: 'όλες οι πλευρές είναι άνισες μεταξύ τους', explEn: 'all sides are unequal to each other'
      }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const options = isEn
      ? ['Equilateral triangle', 'Isosceles triangle', 'Scalene triangle']
      : ['Ισόπλευρο τρίγωνο', 'Ισοσκελές τρίγωνο', 'Σκαληνό τρίγωνο'];

    const correct = isEn ? c.typeEn : c.typeEl;
    const expl = isEn ? c.explEn : c.explEl;
    const aFmt = c.a.toLocaleString(numberLocale);
    const bFmt = c.b.toLocaleString(numberLocale);
    const cFmt = c.c.toLocaleString(numberLocale);

    return {
      type: 'mcq',
      correct,
      options,
      prompt: isEn
        ? `A triangle has side lengths of ${aFmt} cm, ${bFmt} cm, and ${cFmt} cm. How is it classified by its sides?`
        : `Ένα τρίγωνο έχει μήκη πλευρών ${aFmt} cm, ${bFmt} cm και ${cFmt} cm. Πώς χαρακτηρίζεται ως προς τις πλευρές του;`,
      explanation: isEn
        ? `The triangle is an ${correct}, because ${expl}.`
        : `Το τρίγωνο είναι ${correct}, επειδή ${expl}.`
    };
  } else {
    // q4: Ποια τριάδα πλευρών αντιστοιχεί σε ισοσκελές τρίγωνο
    const validIsosceles = [
      '15 cm, 15 cm, 22 cm',
      '18 cm, 18 cm, 10 cm',
      '24 cm, 24 cm, 14 cm'
    ][getRandomInt(0, 2)];

    const distractors = [
      '15 cm, 15 cm, 15 cm', // ισόπλευρο
      '10 cm, 14 cm, 18 cm', // σκαληνό
      '8 cm, 10 cm, 22 cm'   // παραβίαση τριγωνικής ανισότητας (8 + 10 < 22)
    ];

    const uniqueRawOptions = [...new Set([validIsosceles, ...distractors])];
    const options = shuffleArray(uniqueRawOptions);

    return {
      type: 'mcq',
      correct: validIsosceles,
      options,
      prompt: isEn
        ? `Which of the following triplets of side lengths corresponds to an ISOSCELES triangle (and satisfies the triangle inequality)?`
        : `Ποια από τις παρακάτω τριάδες πλευρών αντιστοιχεί σε ΙΣΟΣΚΕΛΕΣ τρίγωνο (και ικανοποιεί την τριγωνική ανισότητα);`,
      explanation: isEn
        ? `In an isosceles triangle, exactly 2 sides are equal to each other and the triangle inequality must be satisfied. The correct triplet is: ${validIsosceles}.`
        : `Στο ισοσκελές τρίγωνο ακριβώς 2 πλευρές είναι ίσες μεταξύ τους και ισχύει η τριγωνική ανισότητα. Η σωστή τριάδα είναι: ${validIsosceles}.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Τριγωνική Ανισότητα & Ύπαρξη Τριγώνου (Input & MCQ)
function makeTriangleInequalityQuestion(isMCQ = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isMCQ) {
    // q5: Εύρεση ελάχιστου ακέραιου μήκους 3ης πλευράς (Input)
    const a = [5, 6, 7, 8][getRandomInt(0, 3)];
    const b = [9, 10, 11, 12][getRandomInt(0, 3)];
    const diff = b - a;
    const minSide = diff + 1;

    const aFmt = a.toLocaleString(numberLocale);
    const bFmt = b.toLocaleString(numberLocale);
    const diffFmt = diff.toLocaleString(numberLocale);
    const minSideFmt = minSide.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: minSide,
      unit: isEn ? 'cm (minimum length)' : 'cm (ελάχιστο μήκος)',
      prompt: isEn
        ? `Two sides of a triangle have lengths of ${aFmt} cm and ${bFmt} cm. What is the SMALLEST whole-number length (in cm) that the third side can have so that a triangle can be formed?`
        : `Δύο πλευρές ενός τριγώνου έχουν μήκη ${aFmt} cm και ${bFmt} cm. Ποιο είναι το ΜΙΚΡΟΤΕΡΟ ακέραιο μήκος (σε cm) που μπορεί να έχει η τρίτη πλευρά ώστε να σχηματίζεται τρίγωνο;`,
      explanation: isEn
        ? `According to the triangle inequality, every side must be strictly greater than the difference of the other two: c ＞ ${bFmt} － ${aFmt} ＝ ${diffFmt} cm. The next whole-number length is ${minSideFmt} cm.`
        : `Σύμφωνα με την τριγωνική ανισότητα, κάθε πλευρά πρέπει να είναι αυστηρά μεγαλύτερη από τη διαφορά των άλλων δύο: c ＞ ${bFmt} － ${aFmt} ＝ ${diffFmt} cm. Το αμέσως επόμενο ακέραιο μήκος είναι ${minSideFmt} cm.`
    };
  } else {
    // q6: Ποια τριάδα πλευρών ΔΕΝ μπορεί να σχηματίσει τρίγωνο (MCQ)
    const invalidTriplets = [
      { triplet: '4 cm, 6 cm, 11 cm', reasonEl: '4 ＋ 6 ＝ 10 ＜ 11', reasonEn: '4 ＋ 6 ＝ 10 ＜ 11' },
      { triplet: '3 cm, 5 cm, 9 cm', reasonEl: '3 ＋ 5 ＝ 8 ＜ 9', reasonEn: '3 ＋ 5 ＝ 8 ＜ 9' },
      { triplet: '5 cm, 7 cm, 13 cm', reasonEl: '5 ＋ 7 ＝ 12 ＜ 13', reasonEn: '5 ＋ 7 ＝ 12 ＜ 13' },
      {
        triplet: '2 cm, 8 cm, 10 cm',
        reasonEl: '2 ＋ 8 ＝ 10 (δεν είναι αυστηρά μεγαλύτερο από 10)',
        reasonEn: '2 ＋ 8 ＝ 10 (not strictly greater than 10)'
      }
    ];
    const invalid = invalidTriplets[getRandomInt(0, invalidTriplets.length - 1)];

    const validTriplets = [
      '6 cm, 8 cm, 10 cm',
      '7 cm, 9 cm, 12 cm',
      '8 cm, 8 cm, 11 cm'
    ];

    const uniqueRawOptions = [...new Set([invalid.triplet, ...validTriplets])];
    const options = shuffleArray(uniqueRawOptions);
    const reason = isEn ? invalid.reasonEn : invalid.reasonEl;

    return {
      type: 'mcq',
      correct: invalid.triplet,
      options,
      prompt: isEn
        ? `With which of the following triplets of line segments is it IMPOSSIBLE to construct a triangle?`
        : `Με ποια από τις παρακάτω τριάδες ευθύγραμμων τμημάτων ΔΕΝ είναι δυνατόν να κατασκευαστεί τρίγωνο;`,
      explanation: isEn
        ? `In the triplet ${invalid.triplet}, the triangle inequality is violated because the sum of the two shorter sides does not exceed the longest: ${reason}.`
        : `Στην τριάδα ${invalid.triplet} παραβιάζεται η τριγωνική ανισότητα, καθώς το άθροισμα των δύο μικρότερων πλευρών δεν ξεπερνά τη μεγαλύτερη: ${reason}.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Περιμέτρου & Συνδυαστικής Ονοματολογίας (Input & MCQ)
function makeComplexPerimeterAndProperties(isMCQ = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isMCQ) {
    // q7: Ισοσκελές με γνωστή περίμετρο και βάση, ζητείται η ίση πλευρά (Input)
    const base = [14, 18, 20, 24][getRandomInt(0, 3)];
    const equalSide = [15, 17, 21, 25][getRandomInt(0, 3)];
    const perimeter = equalSide * 2 + base;
    const diff = perimeter - base;

    const baseFmt = base.toLocaleString(numberLocale);
    const perimeterFmt = perimeter.toLocaleString(numberLocale);
    const diffFmt = diff.toLocaleString(numberLocale);
    const equalSideFmt = equalSide.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: equalSide,
      unit: isEn ? 'cm (equal side)' : 'cm (ίση πλευρά)',
      prompt: isEn
        ? `The perimeter of an isosceles triangle is ${perimeterFmt} cm and its base is ${baseFmt} cm. How many cm is each of its two equal sides?`
        : `Η περίμετρος ενός ισοσκελούς τριγώνου είναι ${perimeterFmt} cm και η βάση του είναι ${baseFmt} cm. Πόσα cm είναι καθεμία από τις δύο ίσες πλευρές του;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>Subtract the base from the perimeter to find the sum of the two equal sides: {perimeterFmt} － {baseFmt} ＝ {diffFmt} cm. Divide by 2:</span>
          <MathFraction numerator={`${diffFmt} cm`} denominator="2" />
          <span>＝ {equalSideFmt} cm.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Αφαιρούμε τη βάση από την περίμετρο για να βρούμε το άθροισμα των δύο ίσων πλευρών: {perimeterFmt} － {baseFmt} ＝ {diffFmt} cm. Διαιρούμε διά 2:</span>
          <MathFraction numerator={`${diffFmt} cm`} denominator="2" />
          <span>＝ {equalSideFmt} cm.</span>
        </span>
      )
    };
  } else {
    // q8: Συνδυαστική ταυτότητα (πλευρές και γωνίες) (MCQ)
    const options = isEn
      ? [
          'Right & Isosceles',
          'Right & Equilateral',
          'Obtuse & Equilateral',
          'Straight & Isosceles'
        ]
      : [
          'Ορθογώνιο και Ισοσκελές',
          'Ορθογώνιο και Ισόπλευρο',
          'Αμβλυγώνιο και Ισόπλευρο',
          'Ευθύγραμμο και Ισοσκελές'
        ];

    const correct = isEn ? 'Right & Isosceles' : 'Ορθογώνιο και Ισοσκελές';

    return {
      type: 'mcq',
      correct,
      options,
      prompt: isEn
        ? `A triangle has one right angle (90°) and its two perpendicular legs are equal to each other (e.g. 8 cm and 8 cm). How is this triangle fully classified?`
        : `Ένα τρίγωνο έχει μία ορθή γωνία (90°) και οι δύο κάθετες πλευρές του είναι ίσες μεταξύ τους (π.χ. 8 cm και 8 cm). Πώς χαρακτηρίζεται πλήρως το τρίγωνο αυτό;`,
      explanation: isEn
        ? `Because it has a right angle (90°), it is called right. Because it has two equal sides, it is called isosceles. Therefore, its full classification is: Right & Isosceles (its acute angles are strictly 45° each).`
        : `Επειδή έχει ορθή γωνία (90°) λέγεται ορθογώνιο. Επειδή έχει δύο πλευρές ίσες λέγεται ισοσκελές. Άρα η πλήρης ονομασία του είναι: Ορθογώνιο και Ισοσκελές (οι οξείες γωνίες του είναι υποχρεωτικά 45° η καθεμία).`
    };
  }
}

function generateQuestions(isEn = false) {
  return {
    q1: makePerimeterQuestion(false, isEn),
    q2: makePerimeterQuestion(true, isEn),
    q3: makeSideClassificationQuestion(false, isEn),
    q4: makeSideClassificationQuestion(true, isEn),
    q5: makeTriangleInequalityQuestion(false, isEn),
    q6: makeTriangleInequalityQuestion(true, isEn),
    q7: makeComplexPerimeterAndProperties(false, isEn),
    q8: makeComplexPerimeterAndProperties(true, isEn)
  };
}

const I18N = {
  el: {
    pageTitle: "Ασκήσεις: Τρίγωνα ως προς τις Πλευρές - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα τρίγωνα ως προς τις πλευρές: ισόπλευρα, ισοσκελή, σκαληνά, τριγωνική ανισότητα και περίμετρος.",
    backText: "Ε' Δημοτικού",
    theoryButton: "Θεωρία",
    badgeChapter: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    pageHeader: "📝 Ασκήσεις: Τρίγωνα ως προς τις Πλευρές",
    pageSubheader: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreBadge: "Σκορ:",
    successRate: "Επιτυχία:",
    bottomPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctFeedbackPrefix: "Η σωστή απάντηση είναι:",
    qTitles: {
      q1: "ΠΕΡΙΜΕΤΡΟΣ ΙΣΟΣΚΕΛΟΥΣ ΤΡΙΓΩΝΟΥ",
      q2: "ΠΛΕΥΡΑ ΙΣΟΠΛΕΥΡΟΥ ΑΠΟ ΠΕΡΙΜΕΤΡΟ",
      q3: "ΚΑΤΑΤΑΞΗ ΤΡΙΓΩΝΟΥ ΩΣ ΠΡΟΣ ΤΙΣ ΠΛΕΥΡΕΣ",
      q4: "ΕΝΤΟΠΙΣΜΟΣ ΙΣΟΣΚΕΛΟΥΣ ΤΡΙΓΩΝΟΥ",
      q5: "ΤΡΙΓΩΝΙΚΗ ΑΝΙΣΟΤΗΤΑ ( ΕΛΑΧΙΣΤΗ ΠΛΕΥΡΑ )",
      q6: "ΕΛΕΓΧΟΣ ΔΥΝΑΤΟΤΗΤΑΣ ΚΑΤΑΣΚΕΥΗΣ",
      q7: "ΕΥΡΕΣΗ ΙΣΗΣ ΠΛΕΥΡΑΣ ΑΠΟ ΠΕΡΙΜΕΤΡΟ",
      q8: "ΣΥΝΔΥΑΣΤΙΚΗ ΟΝΟΜΑΤΟΛΟΓΙΑ ΤΡΙΓΩΝΟΥ"
    }
  },
  en: {
    pageTitle: "Exercises: Triangles by Sides - 5th Grade | LearnMaths.gr",
    pageDescription: "Challenging 5th Grade math exercises on triangles by sides: equilateral, isosceles, scalene, triangle inequality, and perimeter.",
    backText: "5th Grade",
    theoryButton: "Theory",
    badgeChapter: "5TH GRADE • PRACTICE",
    pageHeader: "📝 Exercises: Triangles by Sides",
    pageSubheader: "Every time you click \"New Exercises\", a fresh randomized problem set is generated!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreBadge: "Score:",
    successRate: "Success:",
    bottomPrompt: "Complete all questions and click \"Check Answers\"!",
    correctFeedbackPrefix: "The correct answer is:",
    qTitles: {
      q1: "ISOSCELES TRIANGLE PERIMETER",
      q2: "EQUILATERAL SIDE FROM PERIMETER",
      q3: "CLASSIFY TRIANGLE BY SIDES",
      q4: "IDENTIFY ISOSCELES TRIANGLE",
      q5: "TRIANGLE INEQUALITY ( MINIMUM SIDE )",
      q6: "TRIANGLE EXISTENCE CHECK",
      q7: "FIND EQUAL SIDE FROM PERIMETER",
      q8: "COMBINED TRIANGLE CLASSIFICATION"
    }
  }
};

export default function TrigonaPleuresAskPage() {
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
          href="/e-dimotikou/15-trigona-pleures"
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
// pages/e-dimotikou/29-ogkoi-sximaton-ask.js
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
    pageTitle: "Ασκήσεις: Γεωμετρικά Στερεά & Όγκοι - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα γεωμετρικά στερεά: όγκος ορθογωνίου παραλληλεπιπέδου, κύβου, πυραμίδας, κυλίνδρου και χωρητικότητα δεξαμενών σε λίτρα.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeHeader: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "📝 Ασκήσεις: Γεωμετρικά Στερεά & Όγκοι",
    subtitle: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    footerPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctFeedbackPrefix: "Η σωστή απάντηση είναι:",
    q1Badge: "ΟΓΚΟΣ ΟΡΘΟΓΩΝΙΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ",
    q2Badge: "ΕΥΡΕΣΗ ΑΚΜΗΣ ΚΥΒΟΥ ΑΠΟ ΟΓΚΟ",
    q3Badge: "ΠΟΛΥΕΔΡΑ VS ΣΤΕΡΕΑ ΕΚ ΠΕΡΙΣΤΡΟΦΗΣ",
    q4Badge: "ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ ΤΗΣ ΣΦΑΙΡΑΣ",
    q5Badge: "ΣΧΕΣΗ ΟΓΚΟΥ ΠΡΙΣΜΑΤΟΣ ΚΑΙ ΠΥΡΑΜΙΔΑΣ",
    q6Badge: "ΣΧΕΣΗ ΟΓΚΟΥ ΚΥΛΙΝΔΡΟΥ ΚΑΙ ΚΩΝΟΥ",
    q7Badge: "ΧΩΡΗΤΙΚΟΤΗΤΑ ΔΕΞΑΜΕΝΗΣ ΣΕ ΛΙΤΡΑ ( l )",
    q8Badge: "ΑΝΑΓΝΩΡΙΣΗ ΣΤΕΡΕΟΥ ΣΤΗΝ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑ"
  },
  en: {
    pageTitle: "Exercises: Geometric Solids & Volumes - 5th Grade | LearnMaths.gr",
    pageDescription: "Challenging 5th Grade math exercises on 3D geometric solids: rectangular prism, cube, pyramid, cylinder volumes, and tank capacity in liters.",
    backText: "5th Grade",
    theoryBtn: "Theory",
    badgeHeader: "5TH GRADE • PRACTICE",
    mainTitle: "📝 Exercises: Geometric Solids & Volumes",
    subtitle: "Every time you click 'New Exercises', fresh problems are generated from the pool!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success:",
    footerPrompt: "Fill in your answers and click 'Check Answers'!",
    correctFeedbackPrefix: "The correct answer is:",
    q1Badge: "RECTANGULAR PRISM VOLUME",
    q2Badge: "FIND CUBE EDGE FROM VOLUME",
    q3Badge: "POLYHEDRA VS SOLIDS OF REVOLUTION",
    q4Badge: "PROPERTIES OF A SPHERE",
    q5Badge: "PRISM AND PYRAMID VOLUME RELATION",
    q6Badge: "CYLINDER AND CONE VOLUME RELATION",
    q7Badge: "TANK CAPACITY IN LITERS ( l )",
    q8Badge: "IDENTIFYING EVERYDAY 3D SOLIDS"
  }
};

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Όγκος Παραλληλεπιπέδου & Ακμή Κύβου (Input)
function makePrismAndCubeVolumeQuestion(isCube, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isCube) {
    const length = [8, 10, 12, 15][getRandomInt(0, 3)];
    const width = [4, 5, 6][getRandomInt(0, 2)];
    const height = [3, 4, 5][getRandomInt(0, 2)];
    const volume = length * width * height;

    const unit = isEn ? 'cm³ (volume)' : 'cm³ (όγκος)';
    const prompt = isEn
      ? `A rectangular prism has a length of ${formatNum(length)} cm, a width of ${formatNum(width)} cm, and a height of ${formatNum(height)} cm. How many cm³ is its volume?`
      : `Ένα ορθογώνιο παραλληλεπίπεδο έχει μήκος ${formatNum(length)} cm, πλάτος ${formatNum(width)} cm και ύψος ${formatNum(height)} cm. Πόσα cm³ είναι ο όγκος του;`;

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
    const cases = [
      { vol: 27, edge: 3 },
      { vol: 64, edge: 4 },
      { vol: 125, edge: 5 },
      { vol: 216, edge: 6 },
      { vol: 343, edge: 7 },
      { vol: 1000, edge: 10 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    const unit = isEn ? 'cm (cube edge)' : 'cm (ακμή κύβου)';
    const prompt = isEn
      ? `A cube has a volume of ${formatNum(c.vol)} cm³. How many cm is the length of each edge?`
      : `Ένας κύβος έχει όγκο ${formatNum(c.vol)} cm³. Πόσα cm είναι το μήκος της κάθε ακμής (πλευράς) του;`;

    const explanation = isEn ? (
      <span>
        For a cube, volume is calculated by V ＝ a · a · a. We seek the number that multiplied by itself 3 times gives {formatNum(c.vol)}: since {formatNum(c.edge)} · {formatNum(c.edge)} · {formatNum(c.edge)} ＝ {formatNum(c.vol)}, the edge is {formatNum(c.edge)} cm.
      </span>
    ) : (
      <span>
        Στον κύβο ο όγκος υπολογίζεται από τον τύπο V ＝ α · α · α. Αναζητούμε τον αριθμό που αν πολλαπλασιαστεί 3 φορές με τον εαυτό του δίνει {formatNum(c.vol)}: επειδή {formatNum(c.edge)} · {formatNum(c.edge)} · {formatNum(c.edge)} ＝ {formatNum(c.vol)}, η ακμή είναι {formatNum(c.edge)} cm.
      </span>
    );

    return {
      type: 'input',
      correct: c.edge,
      unit,
      prompt,
      explanation
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Ταξινόμηση Στερεών Σωμάτων (MCQ)
function makeSolidClassificationQuestion(isRotational, isEn) {
  if (!isRotational) {
    const correctEl = 'Το ορθογώνιο παραλληλεπίπεδο (περικλείεται μόνο από επίπεδα πολύγωνα)';
    const correctEn = 'The rectangular prism (bounded strictly by flat polygons)';

    const rawOptions = isEn
      ? [
          correctEn,
          'The cylinder',
          'The cone',
          'The sphere'
        ]
      : [
          correctEl,
          'Ο κύλινδρος',
          'Ο κώνος',
          'Η σφαίρα'
        ];

    const prompt = isEn
      ? 'Which of the following geometric solids belongs to the category of POLYHEDRA?'
      : 'Ποιο από τα παρακάτω γεωμετρικά στερεά ανήκει στην κατηγορία των ΠΟΛΥΕΔΡΩΝ;';

    const explanation = isEn
      ? 'Polyhedra are geometric solids bounded exclusively by flat polygonal faces. The rectangular prism (as well as the cube and pyramid) is a polyhedron, whereas the cylinder, cone, and sphere have curved rolling surfaces (solids of revolution).'
      : 'Πολύεδρα ονομάζονται τα στερεά που περικλείονται αποκλειστικά από επίπεδες πολυγωνικές έδρες. Το ορθογώνιο παραλληλεπίπεδο (όπως και ο κύβος και η πυραμίδα) είναι πολύεδρο, ενώ ο κύλινδρος, ο κώνος και η σφαίρα έχουν καμπύλες επιφάνειες (στερεά εκ περιστροφής).';

    return {
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt,
      explanation
    };
  } else {
    const correctEl = 'Δεν έχει καμία επίπεδη έδρα, καμία ακμή και καμία κορυφή';
    const correctEn = 'It has no flat faces, no straight edges, and no vertices';

    const rawOptions = isEn
      ? [
          correctEn,
          'It has 2 circular bases and 1 vertex',
          'It has 6 square faces and 8 vertices',
          'It has 1 circular base and 1 pointed apex'
        ]
      : [
          correctEl,
          'Έχει 2 κυκλικές βάσεις και 1 κορυφή',
          'Έχει 6 τετράγωνες έδρες και 8 κορυφές',
          'Έχει 1 κυκλική βάση και 1 μυτερή κορυφή'
        ];

    const prompt = isEn
      ? 'Which of the following statements correctly describes a SPHERE?'
      : 'Ποια από τις παρακάτω προτάσεις περιγράφει σωστά τη ΣΦΑΙΡΑ;';

    const explanation = isEn
      ? 'A sphere is a perfectly round solid of revolution. It has no flat faces, no straight edges, and no vertices, and every point on its surface is equidistant from its center.'
      : 'Η σφαίρα είναι ένα απόλυτα στρογγυλό στερεό εκ περιστροφής. Δεν διαθέτει καμία ίσια έδρα, καμία ακμή και καμία κορυφή, και όλα τα σημεία της επιφάνειάς της ισαπέχουν από το κέντρο της.';

    return {
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt,
      explanation
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Συσχέτιση Πρίσματος με Πυραμίδα / Κυλίνδρου με Κώνο (Input & MCQ)
function makePyramidPrismRelationQuestion(isMCQ, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isMCQ) {
    const prismVol = [45, 60, 90, 120, 180, 240][getRandomInt(0, 5)];
    const pyramidVol = prismVol / 3;

    const unit = isEn ? 'cm³ (pyramid volume)' : 'cm³ (όγκος πυραμίδας)';
    const prompt = isEn
      ? `A prism has a volume of ${formatNum(prismVol)} cm³. A pyramid sharing the exact same base and identical height as the prism, how many cm³ is its volume?`
      : `Ένα πρίσμα έχει όγκο ${formatNum(prismVol)} cm³. Μια πυραμίδα που έχει ακριβώς την ίδια βάση και το ίδιο ύψος με το πρίσμα, πόσα cm³ όγκο έχει;`;

    const explanation = isEn ? (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>The volume of the pyramid equals one third of the corresponding prism:</span>
        <Fraction numerator={formatNum(prismVol)} denominator="3" />
        <span>＝ {formatNum(pyramidVol)} cm³.</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>Ο όγκος της πυραμίδας ισούται με το ένα τρίτο του όγκου του αντίστοιχου πρίσματος:</span>
        <Fraction numerator={formatNum(prismVol)} denominator="3" />
        <span>＝ {formatNum(pyramidVol)} cm³.</span>
      </span>
    );

    return {
      type: 'input',
      correct: pyramidVol,
      unit,
      prompt,
      explanation
    };
  } else {
    const correctEl = 'Χρειάζονται ακριβώς 3 γεμάτοι κώνοι νερό για να γεμίσει ο κύλινδρος';
    const correctEn = 'Exactly 3 full cones of water are needed to fill the cylinder';

    const rawOptions = isEn
      ? [
          correctEn,
          'Exactly 2 full cones of water are needed',
          'Half a cone of water is needed',
          'The cone and the cylinder have the exact same volume'
        ]
      : [
          correctEl,
          'Χρειάζονται ακριβώς 2 γεμάτοι κώνοι νερό',
          'Χρειάζεται μισός κώνος νερό',
          'Ο κώνος και ο κύλινδρος έχουν ακριβώς τον ίδιο όγκο'
        ];

    const prompt = isEn
      ? 'A cylinder and a cone have identical circular bases and the same height. How many full cones of water are needed to completely fill the cylinder?'
      : 'Ένας κύλινδρος και ένας κώνος έχουν ακριβώς την ίδια κυκλική βάση και το ίδιο ύψος. Πόσοι γεμάτοι κώνοι νερό χρειάζονται για να γεμίσει πλήρως ο κύλινδρος;';

    const explanation = isEn ? (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>Because the volume of the cone equals</span>
        <Fraction numerator="1" denominator="3" />
        <span>of the cylinder with identical base and height, it takes exactly 3 full cones to fill the cylinder!</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>Επειδή ο όγκος του κώνου ισούται με το</span>
        <Fraction numerator="1" denominator="3" />
        <span>του όγκου του κυλίνδρου με την ίδια βάση και ύψος, χρειάζονται ακριβώς 3 γεμάτοι κώνοι για να γεμίσει ο κύλινδρος!</span>
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

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Χωρητικότητα Δεξαμενής & Καθημερινά Στερεά (Input & MCQ)
function makeRealWorldCapacityQuestion(isMCQ, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isMCQ) {
    const lengthM = [2, 3, 4][getRandomInt(0, 2)];
    const widthM = [2, 2.5, 3][getRandomInt(0, 2)];
    const heightM = [1, 2][getRandomInt(0, 1)];
    const volumeM3 = parseFloat((lengthM * widthM * heightM).toFixed(1));
    const liters = Math.round(volumeM3 * 1000);

    const unit = isEn ? 'liters ( l )' : 'λίτρα ( l )';
    const prompt = isEn
      ? `A rectangular water reservoir has dimensions: length ${formatNum(lengthM)} m, width ${formatNum(widthM)} m, and depth (height) ${formatNum(heightM)} m. How many liters ( l ) of water does it hold when completely full?`
      : `Μια ορθογώνια δεξαμενή νερού έχει διαστάσεις: μήκος ${formatNum(lengthM)} m, πλάτος ${formatNum(widthM)} m και βάθος (ύψος) ${formatNum(heightM)} m. Πόσα λίτρα ( l ) νερού χωράει όταν γεμίσει εντελώς;`;

    const explanation = isEn ? (
      <span>
        First calculate volume in cubic meters: {formatNum(lengthM)} · {formatNum(widthM)} · {formatNum(heightM)} ＝ {formatNum(volumeM3)} m³. Since 1 m³ ＝ 1,000 liters, the reservoir holds: {formatNum(volumeM3)} · 1,000 ＝ {formatNum(liters)} liters.
      </span>
    ) : (
      <span>
        Υπολογίζουμε πρώτα τον όγκο σε κυβικά μέτρα: {formatNum(lengthM)} · {formatNum(widthM)} · {formatNum(heightM)} ＝ {formatNum(volumeM3)} m³. Επειδή 1 m³ ＝ 1.000 λίτρα, η δεξαμενή χωράει: {formatNum(volumeM3)} · 1.000 ＝ {formatNum(liters)} λίτρα.
      </span>
    );

    return {
      type: 'input',
      correct: liters,
      unit,
      prompt,
      explanation
    };
  } else {
    const cases = [
      {
        itemEl: 'ένα κουτάκι αναψυκτικού',
        solidEl: 'Κύλινδρος',
        distractorsEl: ['Κώνος', 'Σφαίρα', 'Κύβος'],
        itemEn: 'a soda can',
        solidEn: 'Cylinder',
        distractorsEn: ['Cone', 'Sphere', 'Cube']
      },
      {
        itemEl: 'ένα χωνάκι παγωτού',
        solidEl: 'Κώνος',
        distractorsEl: ['Κύλινδρος', 'Πυραμίδα', 'Ορθογώνιο παραλληλεπίπεδο'],
        itemEn: 'an ice cream cone',
        solidEn: 'Cone',
        distractorsEn: ['Cylinder', 'Pyramid', 'Rectangular prism']
      },
      {
        itemEl: 'ένα κουτί παπουτσιών',
        solidEl: 'Ορθογώνιο παραλληλεπίπεδο',
        distractorsEl: ['Κύλινδρος', 'Σφαίρα', 'Πυραμίδα'],
        itemEn: 'a shoebox',
        solidEn: 'Rectangular prism',
        distractorsEn: ['Cylinder', 'Sphere', 'Pyramid']
      },
      {
        itemEl: 'ένα ζάρι επιτραπέζιου παιχνιδιού',
        solidEl: 'Κύβος',
        distractorsEl: ['Κώνος', 'Κύλινδρος', 'Σφαίρα'],
        itemEn: 'a playing die',
        solidEn: 'Cube',
        distractorsEn: ['Cone', 'Cylinder', 'Sphere']
      }
    ];

    const c = cases[getRandomInt(0, cases.length - 1)];
    const correct = isEn ? c.solidEn : c.solidEl;
    const rawOptions = isEn ? [c.solidEn, ...c.distractorsEn] : [c.solidEl, ...c.distractorsEl];

    const prompt = isEn
      ? `Which 3D geometric solid best represents ${c.itemEn}?`
      : `Ποιο γεωμετρικό στερεό αναπαριστά καλύτερα ${c.itemEl};`;

    const explanation = isEn
      ? `${c.itemEn.charAt(0).toUpperCase() + c.itemEn.slice(1)} features the form and geometric properties of: ${c.solidEn}.`
      : `${c.itemEl.charAt(0).toUpperCase() + c.itemEl.slice(1)} έχει τη μορφή και τις ιδιότητες του στερεού: ${c.solidEl}.`;

    return {
      type: 'mcq',
      correct,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt,
      explanation
    };
  }
}

function generateQuestions(isEn) {
  return {
    q1: makePrismAndCubeVolumeQuestion(false, isEn),
    q2: makePrismAndCubeVolumeQuestion(true, isEn),
    q3: makeSolidClassificationQuestion(false, isEn),
    q4: makeSolidClassificationQuestion(true, isEn),
    q5: makePyramidPrismRelationQuestion(false, isEn),
    q6: makePyramidPrismRelationQuestion(true, isEn),
    q7: makeRealWorldCapacityQuestion(false, isEn),
    q8: makeRealWorldCapacityQuestion(true, isEn)
  };
}

export default function OgkoiSximatonAskPage() {
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
          href="/e-dimotikou/29-ogkoi-sximaton"
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
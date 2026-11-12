import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Α')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Α')/g);
  return parts
    .map((part) => {
      if (part === "Α'") return "Α'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Επαναχρησιμοποιήσιμο Component Γωνίας (Το γράμμα μένει στη γραμμή, το ^ τοποθετείται από πάνω)
function Angle({ children, className = "" }) {
  return (
    <span className={`relative inline-block leading-none mx-[1px] ${className}`}>
      <svg
        viewBox="0 0 12 6"
        className="w-[0.75em] h-[0.36em] absolute -top-[0.38em] left-1/2 -translate-x-1/2 text-current overflow-visible pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 5 L6 1 L11 5" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 select-none mx-0.5 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.52em] h-[1.12em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.8px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive
function Frac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="pt-0.5 break-all">
        {den}
      </span>
    </span>
  );
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ensureFourUniqueOptions(correct, distractorsGen) {
  const set = new Set([String(correct).trim()]);
  let attempts = 0;
  while (set.size < 4 && attempts < 100) {
    attempts++;
    const cand = distractorsGen();
    if (cand !== undefined && cand !== null && cand !== '') {
      set.add(String(cand).trim());
    }
  }
  let fallbackCount = 1;
  while (set.size < 4) {
    set.add(`${correct} (${fallbackCount++})`);
  }
  return shuffle(Array.from(set));
}

export default function TrigonaExercises() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const locCode = isEl ? 'el-GR' : 'en-US';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Συγκεντρωτικό Λεξικό i18n
  const t = {
    pageTitle: isEl ? "Ασκήσεις: Τα Τρίγωνα | Α' Γυμνασίου" : "Exercises: Triangles | Grade 7",
    pageDesc: isEl ? "Διαδραστικές ασκήσεις στα τρίγωνα της Α' Γυμνασίου: πρωτεύοντα στοιχεία, κατηγορίες ως προς τις πλευρές και τις γωνίες, υπολογισμοί και προβλήματα." : "Interactive Grade 7 geometry exercises on triangles: primary elements, classification by sides and angles, and applied problems.",
    backNav: isEl ? "Θεωρία Κεφ. 05" : "Theory Ch. 05",
    theoryBtn: isEl ? "ΘΕΩΡΙΑ" : "THEORY",
    heroBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 05 • Α' ΓΥΜΝΑΣΙΟΥ" : "EXERCISES • CHAPTER 05 • GRADE 7",
    heroTitle: isEl ? "Τα Τρίγωνα: Εξάσκηση" : "Triangles: Practice",
    heroDesc: isEl ? "12 δυναμικές ερωτήσεις και προβλήματα στα πρωτεύοντα στοιχεία και τις κατηγορίες τριγώνων. Απαντήστε και πατήστε «Έλεγχος»." : "12 dynamic questions and problems on primary elements and triangle classification. Answer and press 'Check'.",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl ? "Εξαιρετική επίδοση! Κατέχετε πλήρως τα πρωτεύοντα στοιχεία και την ταξινόμηση των τριγώνων." : "Outstanding performance! You have mastered the primary elements and classification of triangles.",
    scoreGood: isEl ? "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε." : "Very good effort! Review the detailed steps below for any questions you missed.",
    scoreNeedWork: isEl ? "Χρειάζεται λίγη επανάληψη ακόμα στα πρωτεύοντα στοιχεία και τις κατηγορίες τριγώνων!" : "Needs a bit more review on primary elements and triangle categories!",
    correctBadge: isEl ? "✓ Σωστό" : "✓ Correct",
    wrongBadge: isEl ? "✗ Λάθος" : "✗ Wrong",
    answeredLabel: isEl ? "ΑΠΑΝΤΗΘΗΚΑΝ" : "ANSWERED",
    checkBtn: isEl ? "ΕΛΕΓΧΟΣ" : "CHECK",
    correctAnswerTitle: isEl ? "Σωστή Απάντηση:" : "Correct Answer:",
    tableStep: isEl ? "Στοιχείο / Βήμα" : "Element / Step",
    tableAnalysis: isEl ? "Ανάλυση Δεδομένων" : "Data Analysis"
  };

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False - Πρωτεύοντα στοιχεία τριγώνου
    const q1Variant = randInt(0, 1);
    const q1IsCorrect = Math.random() < 0.5;
    let q1Prompt = '';
    let q1Expl = '';
    if (q1Variant === 0) {
      q1Prompt = q1IsCorrect
        ? (isEl
            ? 'Τα πρωτεύοντα στοιχεία ενός τριγώνου είναι συνολικά 6: οι 3 πλευρές και οι 3 εσωτερικές γωνίες του (μαζί με τις 3 κορυφές).'
            : 'A triangle is defined by 3 non-collinear vertices, 3 sides, and 3 interior angles.')
        : (isEl
            ? 'Οποιαδήποτε τρία σημεία του επιπέδου, ακόμη κι αν βρίσκονται πάνω στην ίδια ευθεία, σχηματίζουν πάντοτε ένα τρίγωνο.'
            : 'Any three points on a plane, even if they lie on the same straight line, always form a triangle.');
      q1Expl = isEl
        ? 'Για να σχηματιστεί τρίγωνο, τα τρία σημεία (κορυφές) πρέπει να είναι μη συνευθειακά (να μην ανήκουν στην ίδια ευθεία).'
        : 'To form a triangle, the three vertices must be non-collinear (not lying on the same line).';
    } else {
      q1Prompt = q1IsCorrect
        ? (isEl
            ? 'Σε κάθε τρίγωνο ΑΒΓ, η πλευρά α βρίσκεται απέναντι από την κορυφή Α και ταυτίζεται με το ευθύγραμμο τμήμα ΒΓ.'
            : 'In any triangle ABC, side a lies opposite to vertex A and corresponds to segment BC.')
        : (isEl
            ? 'Σε ένα τρίγωνο ΑΒΓ, η πλευρά α είναι η πλευρά ΑΒ.'
            : 'In triangle ABC, side a is segment AB.');
      q1Expl = isEl
        ? 'Η πλευρά α συμβολίζει πάντα την πλευρά που βρίσκεται απέναντι από την κορυφή Α, δηλαδή την πλευρά ΒΓ.'
        : 'Side a always denotes the side opposite vertex A, which is segment BC.';
    }

    qList.push({
      id: 1,
      title: isEl ? 'Ορισμός & Πρωτεύοντα Στοιχεία' : 'Definition & Primary Elements',
      prompt: q1Prompt,
      type: 'tf',
      correct: q1IsCorrect ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: q1Expl
    });

    // Q2: MCQ - Απέναντι πλευρά / γωνία σε τρίγωνο
    const triNamesEl = [
      { name: 'ΔΕΖ', v: ['Δ', 'Ε', 'Ζ'], sides: ['ΕΖ', 'ΔΖ', 'ΔΕ'] },
      { name: 'ΚΛΜ', v: ['Κ', 'Λ', 'Μ'], sides: ['ΛΜ', 'ΚΜ', 'ΚΛ'] },
      { name: 'ΠΡΣ', v: ['Π', 'Ρ', 'Σ'], sides: ['ΡΣ', 'ΠΣ', 'ΠΡ'] }
    ];
    const triNamesEn = [
      { name: 'DEF', v: ['D', 'E', 'F'], sides: ['EF', 'DF', 'DE'] },
      { name: 'KLM', v: ['K', 'L', 'M'], sides: ['LM', 'KM', 'KL'] },
      { name: 'PRS', v: ['P', 'R', 'S'], sides: ['RS', 'PS', 'PR'] }
    ];
    const triObj = isEl ? triNamesEl[randInt(0, 2)] : triNamesEn[randInt(0, 2)];
    const targetIdx = randInt(0, 2);
    const targetVertex = triObj.v[targetIdx];
    const oppSide = triObj.sides[targetIdx];
    const q2Distractors = [
      ...triObj.sides,
      `${targetVertex}${triObj.v[(targetIdx + 1) % 3]}`,
      `${triObj.v[(targetIdx + 2) % 3]}${targetVertex}`,
      isEl ? `Η γωνία ${targetVertex}` : `Angle ∠${targetVertex}`
    ];

    qList.push({
      id: 2,
      title: isEl ? 'Απέναντι Στοιχεία Τριγώνου' : 'Opposite Elements of a Triangle',
      prompt: isEl
        ? `Στο τρίγωνο ${triObj.name}, ποια πλευρά βρίσκεται απέναντι από την κορυφή ${targetVertex};`
        : `In triangle ${triObj.name}, which side lies opposite to vertex ${targetVertex}?`,
      type: 'mcq',
      correct: oppSide,
      options: ensureFourUniqueOptions(oppSide, () => q2Distractors[randInt(0, q2Distractors.length - 1)]),
      renderOption: (opt) => {
        if (isEl && opt.startsWith('Η γωνία ')) {
          const letter = opt.replace('Η γωνία ', '');
          return <span>Η γωνία <Angle>{letter}</Angle></span>;
        }
        return opt;
      },
      explanation: isEl
        ? `Η απέναντι πλευρά της κορυφής ${targetVertex} σχηματίζεται από τις άλλες δύο κορυφές του τριγώνου, άρα είναι η πλευρά ${oppSide}.`
        : `The side opposite vertex ${targetVertex} connects the other two vertices, which gives side ${oppSide}.`
    });

    // Q3: MCQ - Κατηγορία ως προς τις πλευρές
    const sideCase = randInt(0, 2); // 0: Σκαληνό, 1: Ισοσκελές, 2: Ισόπλευρο
    let s1, s2, s3, correctSideCat;
    const sideCatsEl = ['Σκαληνό τρίγωνο', 'Ισοσκελές τρίγωνο', 'Ισόπλευρο τρίγωνο'];
    const sideCatsEn = ['Scalene triangle', 'Isosceles triangle', 'Equilateral triangle'];

    if (sideCase === 0) {
      s1 = randInt(4, 6);
      s2 = s1 + randInt(1, 2);
      s3 = s2 + 1;
      correctSideCat = isEl ? sideCatsEl[0] : sideCatsEn[0];
    } else if (sideCase === 1) {
      const leg = randInt(5, 9);
      const base = randInt(3, 7);
      s1 = leg;
      s2 = leg;
      s3 = base === leg ? base + 1 : base;
      correctSideCat = isEl ? sideCatsEl[1] : sideCatsEn[1];
    } else {
      const eq = randInt(4, 9);
      s1 = eq;
      s2 = eq;
      s3 = eq;
      correctSideCat = isEl ? sideCatsEl[2] : sideCatsEn[2];
    }

    const q3Distractors = isEl
      ? [...sideCatsEl, 'Ορθογώνιο τρίγωνο', 'Αμβλυγώνιο τρίγωνο']
      : [...sideCatsEn, 'Right triangle', 'Obtuse triangle'];

    qList.push({
      id: 3,
      title: isEl ? 'Κατηγορία ως προς τις Πλευρές' : 'Classification by Side Lengths',
      prompt: isEl
        ? `Ένα τρίγωνο έχει πλευρές μήκους ${s1} cm, ${s2} cm και ${s3} cm. Πώς χαρακτηρίζεται ως προς τις πλευρές του;`
        : `A triangle has side lengths ${s1} cm, ${s2} cm, and ${s3} cm. How is it classified by its sides?`,
      type: 'mcq',
      correct: correctSideCat,
      options: ensureFourUniqueOptions(correctSideCat, () => q3Distractors[randInt(0, q3Distractors.length - 1)]),
      explanation: sideCase === 0
        ? (isEl ? `Οι πλευρές ${s1} cm, ${s2} cm και ${s3} cm είναι όλες άνισες μεταξύ τους, άρα το τρίγωνο είναι σκαληνό.` : `All three sides (${s1} cm, ${s2} cm, ${s3} cm) have different lengths, so it is a scalene triangle.`)
        : sideCase === 1
        ? (isEl ? `Το τρίγωνο έχει δύο ίσες πλευρές (${s1} cm και ${s2} cm), άρα είναι ισοσκελές.` : `The triangle has two equal sides (${s1} cm and ${s2} cm), so it is an isosceles triangle.`)
        : (isEl ? `Και οι τρεις πλευρές είναι ίσες με ${s1} cm, άρα το τρίγωνο είναι ισόπλευρο.` : `All three sides are equal to ${s1} cm, so it is an equilateral triangle.`)
    });

    // Q4: MCQ - Κατηγορία ως προς τις γωνίες
    const angleCase = randInt(0, 2); // 0: Οξυγώνιο, 1: Ορθογώνιο, 2: Αμβλυγώνιο
    let g1, g2, g3, correctAngleCat;
    const angleCatsEl = ['Οξυγώνιο τρίγωνο', 'Ορθογώνιο τρίγωνο', 'Αμβλυγώνιο τρίγωνο'];
    const angleCatsEn = ['Acute triangle', 'Right triangle', 'Obtuse triangle'];

    if (angleCase === 0) {
      g1 = randInt(50, 70);
      g2 = randInt(55, 75);
      g3 = 180 - g1 - g2;
      correctAngleCat = isEl ? angleCatsEl[0] : angleCatsEn[0];
    } else if (angleCase === 1) {
      g1 = 90;
      g2 = randInt(25, 65);
      g3 = 90 - g2;
      correctAngleCat = isEl ? angleCatsEl[1] : angleCatsEn[1];
    } else {
      g1 = randInt(100, 130);
      g2 = randInt(20, 40);
      g3 = 180 - g1 - g2;
      correctAngleCat = isEl ? angleCatsEl[2] : angleCatsEn[2];
    }

    const q4Distractors = isEl
      ? [...angleCatsEl, 'Ισόπλευρο τρίγωνο', 'Σκαληνό τρίγωνο']
      : [...angleCatsEn, 'Equilateral triangle', 'Scalene triangle'];

    qList.push({
      id: 4,
      title: isEl ? 'Κατηγορία ως προς τις Γωνίες' : 'Classification by Angle Measures',
      prompt: isEl
        ? `Οι γωνίες ενός τριγώνου έχουν μέτρα ${g1}°, ${g2}° και ${g3}°. Πώς χαρακτηρίζεται το τρίγωνο ως προς τις γωνίες του;`
        : `The interior angles of a triangle measure ${g1}°, ${g2}°, and ${g3}°. How is the triangle classified by its angles?`,
      type: 'mcq',
      correct: correctAngleCat,
      options: ensureFourUniqueOptions(correctAngleCat, () => q4Distractors[randInt(0, q4Distractors.length - 1)]),
      explanation: angleCase === 0
        ? (isEl ? `Και οι τρεις γωνίες (${g1}°, ${g2}°, ${g3}°) είναι μικρότερες από 90° (οξείες), άρα είναι οξυγώνιο.` : `All three angles (${g1}°, ${g2}°, ${g3}°) are less than 90° (acute), so it is an acute triangle.`)
        : angleCase === 1
        ? (isEl ? `Το τρίγωνο έχει μία ορθή γωνία (90°), άρα είναι ορθογώνιο.` : `The triangle contains a 90° right angle, so it is a right triangle.`)
        : (isEl ? `Η γωνία ${g1}° είναι μεγαλύτερη από 90° (αμβλεία), άρα το τρίγωνο είναι αμβλυγώνιο.` : `The angle ${g1}° is greater than 90° (obtuse), so it is an obtuse triangle.`)
    });

    // Q5: True / False - Ιδιότητες τριγώνων
    const q5Variant = randInt(0, 1);
    const q5IsCorrect = Math.random() < 0.5;
    let q5Prompt = '';
    let q5Expl = '';
    if (q5Variant === 0) {
      q5Prompt = q5IsCorrect
        ? (isEl
            ? 'Κάθε ισόπλευρο τρίγωνο είναι ταυτόχρονα και ισοσκελές, ενώ όλες οι γωνίες του είναι ίσες με 60°.'
            : 'Every equilateral triangle is also isosceles, and each of its angles measures 60°.')
        : (isEl
            ? 'Ένα τρίγωνο μπορεί να έχει δύο ορθές γωνίες (90° και 90°).'
            : 'A triangle can have two right angles (90° and 90°).');
      q5Expl = isEl
        ? 'Το άθροισμα των γωνιών κάθε τριγώνου είναι 180°, οπότε δεν μπορεί να έχει δύο ορθές γωνίες. Αντίθετα, το ισόπλευρο έχει 3 ίσες πλευρές (άρα και τουλάχιστον 2 ίσες) και γωνίες 60°.'
        : 'Since the angles of a triangle sum to 180°, it can have at most one right angle. An equilateral triangle has 3 equal sides and 60° angles.';
    } else {
      q5Prompt = q5IsCorrect
        ? (isEl
            ? 'Σε κάθε ισοσκελές τρίγωνο, οι προσκείμενες γωνίες στη βάση είναι ίσες μεταξύ τους.'
            : 'In every isosceles triangle, the base angles are equal to each other.')
        : (isEl
            ? 'Ένα ισοσκελές τρίγωνο είναι υποχρεωτικά πάντα οξυγώνιο.'
            : 'An isosceles triangle is necessarily always acute.');
      q5Expl = isEl
        ? 'Στο ισοσκελές τρίγωνο οι γωνίες της βάσης είναι ίσες, αλλά η γωνία κορυφής μπορεί να είναι οξεία, ορθή (90°) ή αμβλεία (π.χ. 110°).'
        : 'In an isosceles triangle the base angles are equal, while the vertex angle can be acute, right (90°), or obtuse.';
    }

    qList.push({
      id: 5,
      title: isEl ? 'Ιδιότητες Ισοσκελούς & Ισόπλευρου' : 'Properties of Isosceles & Equilateral Triangles',
      prompt: q5Prompt,
      type: 'tf',
      correct: q5IsCorrect ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: q5Expl
    });

    // Q6: MCQ - Υποτείνουσα & Κάθετες Πλευρές Ορθογωνίου Τριγώνου
    const rightConfigsEl = [
      { tri: 'ΑΒΓ', rightLetter: 'Α', hyp: 'ΒΓ', legs: 'ΑΒ και ΑΓ' },
      { tri: 'ΑΒΓ', rightLetter: 'Β', hyp: 'ΑΓ', legs: 'ΑΒ και ΒΓ' },
      { tri: 'ΔΕΖ', rightLetter: 'Ε', hyp: 'ΔΖ', legs: 'ΔΕ και ΕΖ' },
      { tri: 'ΚΛΜ', rightLetter: 'Μ', hyp: 'ΚΛ', legs: 'ΚΜ και ΛΜ' }
    ];
    const rightConfigsEn = [
      { tri: 'ABC', rightLetter: 'A', hyp: 'BC', legs: 'AB and AC' },
      { tri: 'ABC', rightLetter: 'B', hyp: 'AC', legs: 'AB and BC' },
      { tri: 'DEF', rightLetter: 'E', hyp: 'DF', legs: 'DE and EF' },
      { tri: 'KLM', rightLetter: 'M', hyp: 'KL', legs: 'KM and LM' }
    ];
    const rCfg = isEl ? rightConfigsEl[randInt(0, 3)] : rightConfigsEn[randInt(0, 3)];
    const q6Distractors = isEl
      ? ['ΑΒ', 'ΑΓ', 'ΒΓ', 'ΔΕ', 'ΕΖ', 'ΔΖ', 'ΚΜ', 'ΛΜ', 'ΚΛ']
      : ['AB', 'AC', 'BC', 'DE', 'EF', 'DF', 'KM', 'LM', 'KL'];

    qList.push({
      id: 6,
      title: isEl ? 'Υποτείνουσα Ορθογωνίου Τριγώνου' : 'Hypotenuse of a Right Triangle',
      prompt: isEl ? (
        <span>
          Το τρίγωνο {rCfg.tri} είναι ορθογώνιο με ορθή γωνία <Angle>{rCfg.rightLetter}</Angle> ＝ 90°. Ποια είναι η υποτείνουσά του;
        </span>
      ) : (
        <span>
          Triangle {rCfg.tri} is a right triangle with right angle ∠{rCfg.rightLetter} ＝ 90°. Which side is its hypotenuse?
        </span>
      ),
      type: 'mcq',
      correct: rCfg.hyp,
      options: ensureFourUniqueOptions(rCfg.hyp, () => q6Distractors[randInt(0, q6Distractors.length - 1)]),
      explanation: isEl ? (
        <span>
          Η υποτείνουσα βρίσκεται πάντα απέναντι από την ορθή γωνία <Angle>{rCfg.rightLetter}</Angle>, άρα είναι η πλευρά {rCfg.hyp} (ενώ κάθετες πλευρές είναι οι {rCfg.legs}).
        </span>
      ) : (
        <span>
          The hypotenuse always lies opposite the right angle ∠{rCfg.rightLetter}, so it is side {rCfg.hyp} (while {rCfg.legs} are the legs).
        </span>
      )
    });

    // Q7: MCQ - Διπλή Ταξινόμηση (Εφικτοί & Αδύνατοι Συνδυασμοί)
    const q7Correct = isEl ? 'Ορθογώνιο ισόπλευρο τρίγωνο' : 'Right equilateral triangle';
    const q7Distractors = isEl
      ? [
          'Ορθογώνιο ισοσκελές τρίγωνο',
          'Αμβλυγώνιο ισοσκελές τρίγωνο',
          'Οξυγώνιο σκαληνό τρίγωνο',
          'Ορθογώνιο σκαληνό τρίγωνο',
          'Οξυγώνιο ισόπλευρο τρίγωνο'
        ]
      : [
          'Right isosceles triangle',
          'Obtuse isosceles triangle',
          'Acute scalene triangle',
          'Right scalene triangle',
          'Acute equilateral triangle'
        ];

    qList.push({
      id: 7,
      title: isEl ? 'Διπλή Ταξινόμηση Τριγώνων' : 'Dual Classification of Triangles',
      prompt: isEl
        ? 'Ποιο από τα παρακάτω είδη τριγώνων είναι ΑΔΥΝΑΤΟ να υπάρξει στην Ευκλείδεια Γεωμετρία;'
        : 'Which of the following types of triangles is IMPOSSIBLE to exist in Euclidean geometry?',
      type: 'mcq',
      correct: q7Correct,
      options: ensureFourUniqueOptions(q7Correct, () => q7Distractors[randInt(0, q7Distractors.length - 1)]),
      explanation: isEl
        ? 'Κάθε ισόπλευρο τρίγωνο έχει υποχρεωτικά όλες τις γωνίες του ίσες με 60°, επομένως είναι ΠΑΝΤΑ οξυγώνιο και ποτέ ορθογώνιο ή αμβλυγώνιο.'
        : 'Every equilateral triangle must have all three angles equal to 60°, so it is ALWAYS acute and never right or obtuse.'
    });

    // Q8: Input - Υπολογισμός γωνίας βάσης σε ισοσκελές τρίγωνο
    const vertexAngle = randInt(20, 50) * 2; // άρτιος αριθμός 40°..100°
    const baseAngle = (180 - vertexAngle) / 2;
    qList.push({
      id: 8,
      title: isEl ? 'Γωνίες Ισοσκελούς Τριγώνου' : 'Angles of an Isosceles Triangle',
      prompt: isEl ? (
        <span>
          Ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) έχει γωνία κορυφής <Angle>Α</Angle> ＝ {vertexAngle}°. Πόσες μοίρες είναι καθεμία από τις γωνίες της βάσης του (<Angle>Β</Angle> και <Angle>Γ</Angle>);
        </span>
      ) : (
        <span>
          An isosceles triangle ABC (AB ＝ AC) has vertex angle ∠A ＝ {vertexAngle}°. How many degrees is each base angle (∠B and ∠C)?
        </span>
      ),
      type: 'input',
      correct: baseAngle,
      unit: '°',
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>
            {isEl ? (
              <>
                Το άθροισμα των γωνιών είναι 180° και οι γωνίες της βάσης είναι ίσες (<Angle>Β</Angle> ＝ <Angle>Γ</Angle>):
              </>
            ) : (
              'The angle sum is 180° and the base angles are equal (∠B ＝ ∠C):'
            )}
          </span>
          <span className="inline-flex items-center gap-1 font-mono">
            (180° － {vertexAngle}°) ＝ {180 - vertexAngle}° ⇒{' '}
            <Frac num={`${180 - vertexAngle}°`} den="2" /> ＝ {baseAngle}°.
          </span>
        </span>
      )
    });

    // Q9: Input + tableData - Υπολογισμός σκέλους ισοσκελούς από περίμετρο
    const baseLen = randInt(4, 10) * 2; // άρτιος 8..20
    const legLen = randInt(6, 15);
    const perimIso = baseLen + 2 * legLen;
    qList.push({
      id: 9,
      title: isEl ? 'Περίμετρος & Πλευρές Ισοσκελούς' : 'Perimeter & Sides of Isosceles Triangle',
      prompt: isEl
        ? `Ένα ισοσκελές τρίγωνο έχει περίμετρο ${perimIso} cm και βάση μήκους ${baseLen} cm. Πόσα εκατοστά (cm) είναι το μήκος καθενός από τα δύο ίσα σκέλη του;`
        : `An isosceles triangle has perimeter ${perimIso} cm and base length ${baseLen} cm. What is the length in cm of each of its two equal legs?`,
      type: 'input',
      correct: legLen,
      unit: 'cm',
      tableData: [
        {
          label: isEl ? 'Τύπος περιμέτρου' : 'Perimeter formula',
          details: isEl ? `Π ＝ 2 · σκέλος ＋ βάση ＝ ${perimIso} cm` : `P ＝ 2 · leg ＋ base ＝ ${perimIso} cm`
        },
        {
          label: isEl ? 'Άθροισμα δύο σκελών' : 'Sum of two legs',
          details: `${perimIso} － ${baseLen} ＝ ${2 * legLen} cm`
        },
        {
          label: isEl ? 'Μήκος ενός σκέλους' : 'Length of one leg',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num={2 * legLen} den={2} /> ＝ {legLen} cm
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>
            {isEl
              ? `Αφαιρούμε τη βάση από την περίμετρο και διαιρούμε διά 2:`
              : `Subtract the base from the perimeter and divide by 2:`}
          </span>
          <span className="inline-flex items-center gap-1 font-mono">
            <Frac num={`${perimIso} － ${baseLen}`} den="2" /> ＝ <Frac num={2 * legLen} den="2" /> ＝ {legLen} cm.
          </span>
        </span>
      )
    });

    // Q10: Input + tableData - Εύρεση τρίτης γωνίας σε ορθογώνιο τρίγωνο
    const acuteAng1 = randInt(22, 68);
    const acuteAng2 = 90 - acuteAng1;
    qList.push({
      id: 10,
      title: isEl ? 'Οξείες Γωνίες Ορθογωνίου Τριγώνου' : 'Acute Angles of a Right Triangle',
      prompt: isEl
        ? `Σε ένα ορθογώνιο τρίγωνο, η μία οξεία γωνία είναι ${acuteAng1}°. Πόσες μοίρες είναι η άλλη οξεία γωνία του;`
        : `In a right triangle, one acute angle measures ${acuteAng1}°. How many degrees is the other acute angle?`,
      type: 'input',
      correct: acuteAng2,
      unit: '°',
      tableData: [
        {
          label: isEl ? 'Γνωστές γωνίες' : 'Known angles',
          details: isEl ? `90° (ορθή) και ${acuteAng1}° (οξεία)` : `90° (right) and ${acuteAng1}° (acute)`
        },
        {
          label: isEl ? 'Άθροισμα οξειών' : 'Sum of acute angles',
          details: '180° － 90° ＝ 90°'
        },
        {
          label: isEl ? 'Ζητούμενη γωνία' : 'Missing angle',
          details: `90° － ${acuteAng1}° ＝ ${acuteAng2}°`
        }
      ],
      explanation: isEl
        ? `Σε κάθε ορθογώνιο τρίγωνο οι δύο οξείες γωνίες έχουν άθροισμα 90°. Άρα η άλλη οξεία γωνία είναι 90° － ${acuteAng1}° ＝ ${acuteAng2}°.`
        : `In any right triangle the two acute angles sum to 90°. Therefore, the other acute angle is 90° － ${acuteAng1}° ＝ ${acuteAng2}°.`
    });

    // Q11: MCQ + tableData - Υπολογισμός γωνιών και κατηγοριοποίηση τριγώνου
    const kAngle = randInt(25, 42);
    const lAngle = randInt(25, 42);
    const adjK = kAngle === lAngle ? kAngle + 1 : kAngle;
    const adjM = 180 - adjK - lAngle; // πάντα > 90° (αμβλεία!)
    const q11Correct = isEl ? 'Αμβλυγώνιο σκαληνό τρίγωνο' : 'Obtuse scalene triangle';
    const q11Distractors = isEl
      ? [
          'Οξυγώνιο σκαληνό τρίγωνο',
          'Ορθογώνιο σκαληνό τρίγωνο',
          'Αμβλυγώνιο ισοσκελές τρίγωνο',
          'Οξυγώνιο ισοσκελές τρίγωνο',
          'Ορθογώνιο ισοσκελές τρίγωνο'
        ]
      : [
          'Acute scalene triangle',
          'Right scalene triangle',
          'Obtuse isosceles triangle',
          'Acute isosceles triangle',
          'Right isosceles triangle'
        ];

    qList.push({
      id: 11,
      title: isEl ? 'Υπολογισμός 3ης Γωνίας & Χαρακτηρισμός' : 'Finding 3rd Angle & Classification',
      prompt: isEl
        ? `Δύο γωνίες ενός τριγώνου είναι ${adjK}° και ${lAngle}°. Αν υπολογίσετε την τρίτη γωνία, πώς χαρακτηρίζεται πλήρως το τρίγωνο;`
        : `Two angles of a triangle measure ${adjK}° and ${lAngle}°. After finding the third angle, how is the triangle fully classified?`,
      type: 'mcq',
      correct: q11Correct,
      options: ensureFourUniqueOptions(q11Correct, () => q11Distractors[randInt(0, q11Distractors.length - 1)]),
      tableData: [
        {
          label: isEl ? 'Υπολογισμός 3ης γωνίας' : '3rd angle calculation',
          details: `180° － (${adjK}° ＋ ${lAngle}°) ＝ 180° － ${adjK + lAngle}° ＝ ${adjM}°`
        },
        {
          label: isEl ? 'Είδος ως προς γωνίες' : 'Type by angles',
          details: isEl ? `${adjM}° ＞ 90° ⇒ Αμβλυγώνιο` : `${adjM}° ＞ 90° ⇒ Obtuse`
        },
        {
          label: isEl ? 'Είδος ως προς πλευρές' : 'Type by sides',
          details: isEl ? `${adjK}° ≠ ${lAngle}° ≠ ${adjM}° (άνισες γωνίες ⇒ άνισες πλευρές ⇒ Σκαληνό)` : `${adjK}° ≠ ${lAngle}° ≠ ${adjM}° (all unequal ⇒ Scalene)`
        }
      ],
      explanation: isEl
        ? `Η τρίτη γωνία είναι 180° － (${adjK}° ＋ ${lAngle}°) ＝ ${adjM}° ＞ 90° (αμβλεία), ενώ και οι τρεις γωνίες είναι άνισες, άρα το τρίγωνο είναι αμβλυγώνιο σκαληνό.`
        : `The third angle is 180° － (${adjK}° ＋ ${lAngle}°) ＝ ${adjM}° ＞ 90° (obtuse), and all three angles are distinct, making it an obtuse scalene triangle.`
    });

    // Q12: Input + tableData - Εφαρμογή καθημερινής ζωής (Ισόπλευρο τρίγωνο / περίφραξη)
    const signSide = randInt(15, 45);
    const totalFence = 3 * signSide;
    qList.push({
      id: 12,
      title: isEl ? 'Εφαρμογή: Περίμετρος Ισόπλευρου Τριγώνου' : 'Application: Perimeter of an Equilateral Triangle',
      prompt: isEl
        ? `Μια τριγωνική πινακίδα οδικής σήμανσης έχει σχήμα ισόπλευρου τριγώνου με πλευρά ${signSide.toLocaleString(locCode)} cm. Πόσα εκατοστά (cm) είναι η περίμετρος της πινακίδας;`
        : `A triangular road warning sign has the shape of an equilateral triangle with side length ${signSide.toLocaleString(locCode)} cm. What is the perimeter of the sign in cm?`,
      type: 'input',
      correct: totalFence,
      unit: 'cm',
      tableData: [
        {
          label: isEl ? 'Ιδιότητα ισόπλευρου' : 'Equilateral property',
          details: isEl ? 'Και οι 3 πλευρές είναι ίσες μεταξύ τους' : 'All 3 sides have equal length'
        },
        {
          label: isEl ? 'Υπολογισμός περιμέτρου' : 'Perimeter calculation',
          details: `Π ＝ 3 · ${signSide.toLocaleString(locCode)} ＝ ${totalFence.toLocaleString(locCode)} cm`
        }
      ],
      explanation: isEl
        ? `Επειδή το τρίγωνο είναι ισόπλευρο, έχει και τις τρεις πλευρές ίσες με ${signSide.toLocaleString(locCode)} cm. Άρα η περίμετρος είναι 3 · ${signSide.toLocaleString(locCode)} ＝ ${totalFence.toLocaleString(locCode)} cm.`
        : `Since the triangle is equilateral, all three sides measure ${signSide.toLocaleString(locCode)} cm. Thus, the perimeter is 3 · ${signSide.toLocaleString(locCode)} ＝ ${totalFence.toLocaleString(locCode)} cm.`
    });

    setQuestions(qList);
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    loadNewSet();
  }, [locale]);

  const handleAnswerChange = (qId, rawVal) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: rawVal }));
  };

  const sanitizeInput = (val) => {
    let sanitized = val.replace('.', ',').replace(/[^0-9,]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    return sanitized.slice(0, 10);
  };

  const handleSubmit = () => {
    let s = 0;
    questions.forEach(q => {
      const uAns = userAnswers[q.id];
      if (uAns === undefined || uAns === null || uAns === '') return;

      if (q.type === 'input') {
        const parsedUser = parseFloat(String(uAns).replace(',', '.').trim());
        const parsedCorrect = parseFloat(String(q.correct).replace(',', '.').trim());
        if (!isNaN(parsedUser) && Math.abs(parsedUser - parsedCorrect) <= 0.05) {
          s += 1;
        }
      } else {
        if (String(uAns).trim() === String(q.correct).trim()) {
          s += 1;
        }
      }
    });

    setScore(s);
    setSubmitted(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== '' && userAnswers[k] !== undefined).length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou/40-trigona"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/40-trigona"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>📖 {toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        
        {/* Header Banner */}
        <section className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/10">
                {toCleanUppercase(t.heroBadge)}
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black mt-2 leading-tight break-words [overflow-wrap:anywhere]">
                {t.heroTitle}
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                {t.heroDesc}
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={loadNewSet}
                className="w-full sm:w-auto px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl shadow transition-all duration-150 text-xs sm:text-sm whitespace-nowrap"
              >
                🔄 {toCleanUppercase(t.btnNewSet)}
              </button>
            </div>
          </div>
        </section>

        {/* Results Banner */}
        {submitted && (
          <section className="p-5 sm:p-8 bg-white border-2 border-indigo-200 rounded-2xl sm:rounded-3xl shadow-lg mb-6 sm:mb-8 text-center animate-fade-in">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
              {t.scoreLabel}: {score} / 12 ({Math.round((score / 12) * 100)}%)
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-4">
              {score >= 10 ? t.scoreGreat : score >= 6 ? t.scoreGood : t.scoreNeedWork}
            </p>
            <button
              type="button"
              onClick={loadNewSet}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl sm:rounded-2xl shadow transition text-xs sm:text-sm"
            >
              🔄 {toCleanUppercase(t.btnTryNewSet)}
            </button>
          </section>
        )}

        {/* Λίστα Ερωτήσεων */}
        <div className="space-y-4 sm:space-y-6">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (submitted) {
              if (q.type === 'input') {
                const u = parseFloat(String(userAnswers[q.id]).replace(',', '.').trim());
                const c = parseFloat(String(q.correct).replace(',', '.').trim());
                isCorrect = !isNaN(u) && Math.abs(u - c) <= 0.05;
              } else {
                isCorrect = String(userAnswers[q.id]).trim() === String(q.correct).trim();
              }
            }

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border transition-all min-w-0 ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Header Ερώτησης */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm sm:text-lg text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                      {q.title}
                    </h3>
                  </div>
                  {submitted && (
                    <span
                      className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? t.correctBadge : t.wrongBadge}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση */}
                <div className="text-slate-800 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-medium break-words [overflow-wrap:anywhere]">
                  {q.prompt}
                </div>

                {/* Πεδία Απάντησης */}
                <div className="mb-2">
                  {q.type === 'tf' && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-md">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border flex items-center gap-2.5 transition-all min-h-[48px] sm:min-h-[56px] min-w-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-white bg-white' : 'border-slate-400'
                              }`}
                            >
                              {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                            </span>
                            <span className="break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1 font-semibold text-xs sm:text-sm">
                              {q.renderOption ? q.renderOption(opt) : opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'input' && (
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:max-w-xs">
                      <input
                        type="text"
                        disabled={submitted}
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => {
                          const sanitized = sanitizeInput(e.target.value);
                          handleAnswerChange(q.id, sanitized);
                        }}
                        placeholder={isEl ? "Απάντηση..." : "Answer..."}
                        className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-900 text-xs sm:text-sm"
                      />
                      {q.unit && (
                        <span className="text-xs sm:text-sm font-bold text-slate-500 whitespace-nowrap">
                          {q.unit}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* FEEDBACK SECTION (No-Giveaway: εμφανίζεται μόνο μετά το submit) */}
                {submitted && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 space-y-3 animate-fade-in">
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-100 text-slate-700 font-bold">
                            <tr>
                              <th className="p-2 sm:p-2.5 border-b w-1/3">{t.tableStep}</th>
                              <th className="p-2 sm:p-2.5 border-b w-2/3">{t.tableAnalysis}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {q.tableData.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <td className="p-2 sm:p-2.5 font-semibold text-slate-800 align-top">{row.label}</td>
                                <td className="p-2 sm:p-2.5 font-mono text-indigo-900 break-words [overflow-wrap:anywhere] align-top">{row.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                      <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
                        <span>{t.correctAnswerTitle}</span>
                        <span className="font-mono text-emerald-700 font-bold inline-flex items-center whitespace-nowrap gap-1">
                          {q.renderOption ? q.renderOption(q.correct) : (typeof q.correct === 'number' ? q.correct.toLocaleString(locCode) : q.correct)} {q.unit || ''}
                        </span>
                      </div>
                      <div className="mt-1 break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM SCORE BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              {!submitted ? (
                <div className="text-[11px] sm:text-sm font-bold text-slate-300 truncate">
                  {toCleanUppercase(t.answeredLabel)}: <span className="text-indigo-400 font-black">{answeredCount}</span> / 12
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-400">{toCleanUppercase(isEl ? 'ΣΚΟΡ' : 'SCORE')}: {score} / 12</span>
                  <span className="hidden xs:inline text-slate-500">|</span>
                  <span className="text-indigo-300">{Math.round((score / 12) * 100)}%</span>
                </div>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {!submitted ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className={`px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                    answeredCount > 0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {toCleanUppercase(t.checkBtn)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-3.5 py-2 sm:px-6 sm:py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition whitespace-nowrap"
                >
                  {toCleanUppercase(t.btnNewSet)}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
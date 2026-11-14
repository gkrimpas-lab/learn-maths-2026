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

export default function StoixeiaTrigononExercises() {
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
    pageTitle: isEl ? "Ασκήσεις: Δευτερεύοντα Στοιχεία Τριγώνων | Α' Γυμνασίου" : "Exercises: Secondary Elements of Triangles | Grade 7",
    pageDesc: isEl ? "Διαδραστικές ασκήσεις Α' Γυμνασίου στα δευτερεύοντα στοιχεία των τριγώνων: διάμεσος, διχοτόμος, έγκεντρο, ύψος και ορθόκεντρο με αναλυτικά βήματα." : "Interactive Grade 7 geometry exercises on secondary elements of triangles: medians, bisectors, incenter, altitudes, and orthocenter.",
    backNav: isEl ? "Θεωρία Κεφ. 06" : "Theory Ch. 06",
    theoryBtn: isEl ? "ΘΕΩΡΙΑ" : "THEORY",
    heroBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 06 • Α' ΓΥΜΝΑΣΙΟΥ" : "EXERCISES • CHAPTER 06 • GRADE 7",
    heroTitle: isEl ? "Δευτερεύοντα Στοιχεία Τριγώνων: Εξάσκηση" : "Secondary Elements of Triangles: Practice",
    heroDesc: isEl ? "12 δυναμικές ερωτήσεις και προβλήματα σε διαμέσους, διχοτόμους, έγκεντρο, ύψη και ορθόκεντρο. Απαντήστε και πατήστε «Έλεγχος»." : "12 dynamic questions and problems on medians, angle bisectors, incenter, altitudes, and orthocenter. Answer and press 'Check'.",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl ? "Εξαιρετική επίδοση! Κατέχετε πλήρως τις διαμέσους, τις διχοτόμους, το έγκεντρο, τα ύψη και το ορθόκεντρο." : "Outstanding performance! You have mastered medians, angle bisectors, incenter, altitudes, and orthocenter.",
    scoreGood: isEl ? "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε." : "Very good effort! Review the detailed steps below for any questions you missed.",
    scoreNeedWork: isEl ? "Χρειάζεται λίγη επανάληψη ακόμα στη διάκριση διαμέσου, διχοτόμου και ύψους!" : "Needs a bit more review on distinguishing medians, angle bisectors, and altitudes!",
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

    // Q1: True / False - Ορισμός Διαμέσου vs Ύψους
    const q1Variant = randInt(0, 1);
    const q1IsCorrect = Math.random() < 0.5;
    let q1Prompt = '';
    let q1Expl = '';

    if (q1Variant === 0) {
      q1Prompt = q1IsCorrect
        ? (isEl
            ? 'Διάμεσος ενός τριγώνου ονομάζεται το ευθύγραμμο τμήμα που ενώνει μια κορυφή του με το μέσο της απέναντι πλευράς.'
            : 'A median of a triangle is the line segment joining a vertex to the midpoint of the opposite side.')
        : (isEl
            ? 'Διάμεσος ενός τριγώνου ονομάζεται το κάθετο ευθύγραμμο τμήμα από μια κορυφή προς την απέναντι πλευρά.'
            : 'A median of a triangle is the perpendicular line segment drawn from a vertex to the opposite side.');
      q1Expl = isEl
        ? 'Η διάμεσος ενώνει την κορυφή με το μέσο της απέναντι πλευράς (χωρίς να είναι υποχρεωτικά κάθετη), ενώ το κάθετο τμήμα ονομάζεται ύψος.'
        : 'A median connects a vertex to the midpoint of the opposite side (not necessarily at 90°), whereas the perpendicular segment is called an altitude.';
    } else {
      q1Prompt = q1IsCorrect
        ? (isEl
            ? 'Οι τρεις διάμεσοι κάθε τριγώνου βρίσκονται πάντοτε στο εσωτερικό του τριγώνου.'
            : 'All three medians of any triangle always lie strictly inside the triangle.')
        : (isEl
            ? 'Σε ένα αμβλυγώνιο τρίγωνο, οι δύο διάμεσοι πέφτουν έξω από το τρίγωνο.'
            : 'In an obtuse triangle, two medians fall outside the triangle.');
      q1Expl = isEl
        ? 'Το μέσο κάθε πλευράς ανήκει πάντοτε στην ίδια την πλευρά, οπότε και οι 3 διάμεσοι βρίσκονται πάντα μέσα στο τρίγωνο (σε αντίθεση με τα ύψη στα αμβλυγώνια τρίγωνα).'
        : 'The midpoint of each side always lies on the side itself, so all 3 medians are always inside the triangle (unlike altitudes in obtuse triangles).';
    }

    qList.push({
      id: 1,
      title: isEl ? 'Ορισμός & Ιδιότητες Διαμέσου' : 'Definition & Properties of a Median',
      prompt: q1Prompt,
      type: 'tf',
      correct: q1IsCorrect ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: q1Expl
    });

    // Q2: MCQ - Αναγνώριση δευτερεύοντος στοιχείου από γεωμετρική συνθήκη
    const q2Case = randInt(0, 2); // 0: Διάμεσος, 1: Διχοτόμος, 2: Ύψος
    const q2Correct = isEl
      ? ['Διάμεσος', 'Διχοτόμος', 'Ύψος'][q2Case]
      : ['Median', 'Angle bisector', 'Altitude'][q2Case];
    const q2Distractors = isEl
      ? ['Διάμεσος', 'Διχοτόμος', 'Ύψος', 'Υποτείνουσα', 'Μεσοκάθετος', 'Βάση']
      : ['Median', 'Angle bisector', 'Altitude', 'Hypotenuse', 'Perpendicular bisector', 'Base'];

    let q2PromptJSX;
    let q2ExplJSX;

    if (q2Case === 0) {
      q2PromptJSX = isEl ? (
        <span>
          Σε ένα τρίγωνο ΑΒΓ, το σημείο Μ ανήκει στην πλευρά ΒΓ έτσι ώστε ΒΜ ＝ ΜΓ. Τι είναι το ευθύγραμμο τμήμα ΑΜ για το τρίγωνο;
        </span>
      ) : (
        <span>
          In triangle ABC, point M lies on side BC such that BM ＝ MC. What is segment AM for the triangle?
        </span>
      );
      q2ExplJSX = isEl
        ? 'Αφού ΒΜ ＝ ΜΓ, το Μ είναι το μέσο της απέναντι πλευράς ΒΓ, άρα το ΑΜ είναι διάμεσος του τριγώνου.'
        : 'Since BM ＝ MC, point M is the midpoint of opposite side BC, making segment AM a median.';
    } else if (q2Case === 1) {
      q2PromptJSX = isEl ? (
        <span>
          Σε ένα τρίγωνο ΑΒΓ, το σημείο Δ ανήκει στην πλευρά ΒΓ έτσι ώστε Β<Angle>Α</Angle>Δ ＝ Δ<Angle>Α</Angle>Γ. Τι είναι το ευθύγραμμο τμήμα ΑΔ;
        </span>
      ) : (
        <span>
          In triangle ABC, point D lies on side BC such that ∠BAD ＝ ∠DAC. What is segment AD?
        </span>
      );
      q2ExplJSX = isEl ? (
        <span>
          Το τμήμα ΑΔ χωρίζει τη γωνία <Angle>Α</Angle> σε δύο ίσες γωνίες (Β<Angle>Α</Angle>Δ ＝ Δ<Angle>Α</Angle>Γ), άρα είναι διχοτόμος του τριγώνου.
        </span>
      ) : (
        <span>
          Segment AD divides ∠A into two equal angles (∠BAD ＝ ∠DAC), so it is an angle bisector.
        </span>
      );
    } else {
      q2PromptJSX = isEl ? (
        <span>
          Σε ένα τρίγωνο ΑΒΓ, φέρνουμε από την κορυφή Α ευθύγραμμο τμήμα ΑΥ κάθετο στην ευθεία της απέναντι πλευράς ΒΓ (ΑΥ ⊥ ΒΓ). Τι είναι το ΑΥ;
        </span>
      ) : (
        <span>
          In triangle ABC, we draw segment AH from vertex A perpendicular to the line containing side BC (AH ⊥ BC). What is AH?
        </span>
      );
      q2ExplJSX = isEl
        ? 'Το κάθετο ευθύγραμμο τμήμα από μια κορυφή προς την ευθεία της απέναντι πλευράς (ΑΥ ⊥ ΒΓ) ονομάζεται ύψος του τριγώνου.'
        : 'The perpendicular segment drawn from a vertex to the line containing the opposite side (AH ⊥ BC) is called an altitude.';
    }

    qList.push({
      id: 2,
      title: isEl ? 'Αναγνώριση Δευτερεύοντος Στοιχείου' : 'Identifying a Secondary Element',
      prompt: q2PromptJSX,
      type: 'mcq',
      correct: q2Correct,
      options: ensureFourUniqueOptions(q2Correct, () => q2Distractors[randInt(0, q2Distractors.length - 1)]),
      explanation: q2ExplJSX
    });

    // Q3: MCQ - Σημεία τομής: Έγκεντρο, Ορθόκεντρο, Βαρύκεντρο
    const q3Case = randInt(0, 2); // 0: Έγκεντρο, 1: Ορθόκεντρο, 2: Βαρύκεντρο
    const q3Correct = isEl
      ? ['Έγκεντρο', 'Ορθόκεντρο', 'Βαρύκεντρο'][q3Case]
      : ['Incenter', 'Orthocenter', 'Centroid'][q3Case];
    const q3Distractors = isEl
      ? ['Έγκεντρο', 'Ορθόκεντρο', 'Βαρύκεντρο', 'Περίκεντρο', 'Κορυφή', 'Μέσο πλευράς']
      : ['Incenter', 'Orthocenter', 'Centroid', 'Circumcenter', 'Vertex', 'Midpoint'];

    const q3PromptsEl = [
      'Πώς ονομάζεται το κοινό σημείο τομής των τριών διχοτόμων ενός τριγώνου;',
      'Πώς ονομάζεται το κοινό σημείο από το οποίο διέρχονται οι ευθείες των τριών υψών ενός τριγώνου;',
      'Πώς ονομάζεται το κοινό σημείο τομής των τριών διαμέσων ενός τριγώνου;'
    ];
    const q3PromptsEn = [
      'What is the common point of intersection of the three angle bisectors of a triangle called?',
      'What is the common point through which the lines containing the three altitudes of a triangle pass?',
      'What is the common point of intersection of the three medians of a triangle called?'
    ];
    const q3ExplsEl = [
      'Οι τρεις διχοτόμοι ενός τριγώνου τέμνονται πάντοτε στο εσωτερικό του, σε ένα σημείο που ονομάζεται έγκεντρο (Ι).',
      'Οι ευθείες των τριών υψών ενός τριγώνου διέρχονται από το ίδιο σημείο, το οποίο ονομάζεται ορθόκεντρο (Η).',
      'Οι τρεις διάμεσοι ενός τριγώνου τέμνονται στο βαρύκεντρο (G), που αποτελεί το κέντρο βάρους του τριγώνου.'
    ];
    const q3ExplsEn = [
      'The three angle bisectors of a triangle always intersect inside the triangle at the incenter (I).',
      'The lines containing the three altitudes of a triangle intersect at a single point called the orthocenter (H).',
      'The three medians of a triangle intersect at the centroid (G), which is the triangle’s center of mass.'
    ];

    qList.push({
      id: 3,
      title: isEl ? 'Αξιόλογα Σημεία Τριγώνου' : 'Notable Points of a Triangle',
      prompt: isEl ? q3PromptsEl[q3Case] : q3PromptsEn[q3Case],
      type: 'mcq',
      correct: q3Correct,
      options: ensureFourUniqueOptions(q3Correct, () => q3Distractors[randInt(0, q3Distractors.length - 1)]),
      explanation: isEl ? q3ExplsEl[q3Case] : q3ExplsEn[q3Case]
    });

    // Q4: MCQ - Θέση Ορθοκέντρου ανά είδος τριγώνου
    const q4Case = randInt(0, 2); // 0: Οξυγώνιο, 1: Ορθογώνιο, 2: Αμβλυγώνιο
    const q4Correct = isEl
      ? [
          'Στο εσωτερικό του τριγώνου',
          'Στην κορυφή της ορθής γωνίας',
          'Στο εξωτερικό του τριγώνου'
        ][q4Case]
      : [
          'Strictly inside the triangle',
          'At the vertex of the right angle',
          'Strictly outside the triangle'
        ][q4Case];

    const q4Distractors = isEl
      ? [
          'Στο εσωτερικό του τριγώνου',
          'Στην κορυφή της ορθής γωνίας',
          'Στο εξωτερικό του τριγώνου',
          'Στο μέσο της υποτείνουσας',
          'Στο μέσο της μεγαλύτερης πλευράς'
        ]
      : [
          'Strictly inside the triangle',
          'At the vertex of the right angle',
          'Strictly outside the triangle',
          'At the midpoint of the hypotenuse',
          'At the midpoint of the longest side'
        ];

    const q4PromptsEl = [
      'Πού βρίσκεται το ορθόκεντρο ενός οξυγώνιου τριγώνου;',
      'Πού βρίσκεται το ορθόκεντρο ενός ορθογώνιου τριγώνου;',
      'Πού βρίσκεται το ορθόκεντρο ενός αμβλυγώνιου τριγώνου;'
    ];
    const q4PromptsEn = [
      'Where is the orthocenter of an acute triangle located?',
      'Where is the orthocenter of a right triangle located?',
      'Where is the orthocenter of an obtuse triangle located?'
    ];
    const q4ExplsEl = [
      'Σε κάθε οξυγώνιο τρίγωνο, και τα 3 ύψη πέφτουν πάνω στις πλευρές και το ορθόκεντρο βρίσκεται στο εσωτερικό του τριγώνου.',
      'Σε ένα ορθογώνιο τρίγωνο, οι δύο κάθετες πλευρές ταυτίζονται με δύο ύψη του, οπότε το ορθόκεντρο είναι η κορυφή της ορθής γωνίας.',
      'Σε ένα αμβλυγώνιο τρίγωνο, τα δύο ύψη πέφτουν στις προεκτάσεις των πλευρών και οι ευθείες των υψών τέμνονται στο εξωτερικό του τριγώνου.'
    ];
    const q4ExplsEn = [
      'In every acute triangle, all three altitudes lie inside and the orthocenter is strictly inside the triangle.',
      'In a right triangle, the two legs serve as altitudes, so the orthocenter coincides with the right-angle vertex.',
      'In an obtuse triangle, two altitudes fall on the extensions of the sides and their lines intersect outside the triangle.'
    ];

    qList.push({
      id: 4,
      title: isEl ? 'Θέση του Ορθοκέντρου' : 'Location of the Orthocenter',
      prompt: isEl ? q4PromptsEl[q4Case] : q4PromptsEn[q4Case],
      type: 'mcq',
      correct: q4Correct,
      options: ensureFourUniqueOptions(q4Correct, () => q4Distractors[randInt(0, q4Distractors.length - 1)]),
      explanation: isEl ? q4ExplsEl[q4Case] : q4ExplsEn[q4Case]
    });

    // Q5: True / False - Ιδιότητα Εγκέντρου & Εγγεγραμμένου κύκλου
    const q5IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 5,
      title: isEl ? 'Ιδιότητα Εγκέντρου' : 'Property of the Incenter',
      prompt: q5IsCorrect
        ? (isEl
            ? 'Το έγκεντρο ενός τριγώνου ισαπέχει από τις τρεις πλευρές του και είναι το κέντρο του εγγεγραμμένου κύκλου του.'
            : 'The incenter of a triangle is equidistant from all three sides and is the center of the inscribed circle.')
        : (isEl
            ? 'Σε ένα αμβλυγώνιο τρίγωνο, το έγκεντρο βρίσκεται έξω από το τρίγωνο.'
            : 'In an obtuse triangle, the incenter lies outside the triangle.'),
      type: 'tf',
      correct: q5IsCorrect ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: isEl
        ? 'Το έγκεντρο Ι (σημείο τομής των διχοτόμων) βρίσκεται ΠΑΝΤΟΤΕ στο εσωτερικό κάθε τριγώνου, ισαπέχει από τις τρεις πλευρές του και αποτελεί το κέντρο του εγγεγραμμένου κύκλου.'
        : 'The incenter I (intersection of angle bisectors) ALWAYS lies inside any triangle, is equidistant from all three sides, and is the center of the incircle.'
    });

    // Q6: Input - Υπολογισμός τμήματος με διάμεσο
    const halfSide = randInt(5, 14);
    const fullSide = halfSide * 2;
    const askHalf = Math.random() < 0.5;

    qList.push({
      id: 6,
      title: isEl ? 'Υπολογισμός Μήκους με Διάμεσο' : 'Calculating Length Using a Median',
      prompt: askHalf
        ? (isEl
            ? `Σε τρίγωνο ΑΒΓ, η πλευρά ΒΓ έχει μήκος ${fullSide} cm. Αν ΑΜ είναι η διάμεσος που αντιστοιχεί στην πλευρά ΒΓ, πόσα εκατοστά (cm) είναι το μήκος ΒΜ;`
            : `In triangle ABC, side BC has length ${fullSide} cm. If AM is the median to side BC, what is the length of BM in cm?`)
        : (isEl
            ? `Σε τρίγωνο ΑΒΓ, η ΑΜ είναι διάμεσος και το τμήμα ΒΜ έχει μήκος ${halfSide} cm. Πόσα εκατοστά (cm) είναι το μήκος ολόκληρης της πλευράς ΒΓ;`
            : `In triangle ABC, AM is a median and segment BM measures ${halfSide} cm. What is the length of the entire side BC in cm?`),
      type: 'input',
      correct: askHalf ? halfSide : fullSide,
      unit: 'cm',
      explanation: askHalf ? (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>{isEl ? 'Η διάμεσος ΑΜ τέμνει τη ΒΓ στο μέσο της:' : 'Median AM bisects side BC:'}</span>
          <span className="inline-flex items-center gap-1 font-mono">
            ΒΜ ＝ <Frac num={fullSide} den="2" /> ＝ {halfSide} cm.
          </span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>{isEl ? 'Αφού το Μ είναι το μέσο της ΒΓ, ισχύει ΒΓ ＝ 2 · ΒΜ:' : 'Since M is the midpoint of BC, BC ＝ 2 · BM:'}</span>
          <span className="font-mono">
            ΒΓ ＝ 2 · {halfSide} ＝ {fullSide} cm.
          </span>
        </span>
      )
    });

    // Q7: Input - Υπολογισμός γωνίας με διχοτόμο
    const halfAngle = randInt(18, 44);
    const fullAngle = halfAngle * 2;
    const askHalfAngle = Math.random() < 0.5;

    qList.push({
      id: 7,
      title: isEl ? 'Υπολογισμός Γωνίας με Διχοτόμο' : 'Calculating Angle Using a Bisector',
      prompt: askHalfAngle ? (
        isEl ? (
          <span>
            Σε τρίγωνο ΑΒΓ, η γωνία <Angle>Α</Angle> είναι {fullAngle}°. Αν ΑΔ είναι η διχοτόμος της γωνίας <Angle>Α</Angle>, πόσες μοίρες είναι η γωνία Β<Angle>Α</Angle>Δ;
          </span>
        ) : (
          <span>
            In triangle ABC, angle ∠A measures {fullAngle}°. If AD is the angle bisector of ∠A, how many degrees is angle ∠BAD?
          </span>
        )
      ) : isEl ? (
        <span>
          Σε τρίγωνο ΑΒΓ, η ΑΔ είναι διχοτόμος της γωνίας <Angle>Α</Angle>. Αν η γωνία Β<Angle>Α</Angle>Δ είναι {halfAngle}°, πόσες μοίρες είναι ολόκληρη η γωνία <Angle>Α</Angle>;
        </span>
      ) : (
        <span>
          In triangle ABC, AD is the bisector of angle ∠A. If angle ∠BAD measures {halfAngle}°, how many degrees is the whole angle ∠A?
        </span>
      ),
      type: 'input',
      correct: askHalfAngle ? halfAngle : fullAngle,
      unit: '°',
      explanation: askHalfAngle ? (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>{isEl ? 'Η διχοτόμος χωρίζει τη γωνία σε δύο ίσα μέρη:' : 'The angle bisector divides the angle into two equal halves:'}</span>
          <span className="inline-flex items-center gap-1 font-mono">
            Β<Angle>Α</Angle>Δ ＝ <Frac num={`${fullAngle}°`} den="2" /> ＝ {halfAngle}°.
          </span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>{isEl ? 'Η γωνία Α είναι διπλάσια της ΒΑΔ:' : 'Angle ∠A is twice ∠BAD:'}</span>
          <span className="font-mono">
            <Angle>Α</Angle> ＝ 2 · {halfAngle}° ＝ {fullAngle}°.
          </span>
        </span>
      )
    });

    // Q8: MCQ - Ειδική ιδιότητα ισοσκελούς & ισόπλευρου
    const q8Correct = isEl
      ? 'Ταυτίζονται σε ένα ενιαίο ευθύγραμμο τμήμα'
      : 'They coincide into a single line segment';
    const q8Distractors = isEl
      ? [
          'Ταυτίζονται σε ένα ενιαίο ευθύγραμμο τμήμα',
          'Είναι πάντα τρία διαφορετικά τμήματα',
          'Τέμνονται έξω από το τρίγωνο',
          'Είναι παράλληλα μεταξύ τους',
          'Έχουν άθροισμα ίσο με τη βάση'
        ]
      : [
          'They coincide into a single line segment',
          'They are always three distinct segments',
          'They intersect outside the triangle',
          'They are parallel to each other',
          'Their sum equals the base length'
        ];

    qList.push({
      id: 8,
      title: isEl ? 'Ιδιότητα Ισοσκελούς Τριγώνου' : 'Isosceles Triangle Property',
      prompt: isEl ? (
        <span>
          Σε ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ), τι ισχύει για το ύψος ΑΥ, τη διάμεσο ΑΜ και τη διχοτόμο ΑΔ που ξεκινούν από την κορυφή Α προς τη βάση ΒΓ;
        </span>
      ) : (
        <span>
          In an isosceles triangle ABC (AB ＝ AC), what is true about the altitude AH, the median AM, and the angle bisector AD drawn from vertex A to base BC?
        </span>
      ),
      type: 'mcq',
      correct: q8Correct,
      options: ensureFourUniqueOptions(q8Correct, () => q8Distractors[randInt(0, q8Distractors.length - 1)]),
      explanation: isEl
        ? 'Σε κάθε ισοσκελές τρίγωνο, το ύψος προς τη βάση είναι ταυτόχρονα και διάμεσος της βάσης και διχοτόμος της γωνίας κορυφής!'
        : 'In every isosceles triangle, the altitude to the base is simultaneously the median to the base and the bisector of the vertex angle!'
    });

    // Q9: Input + tableData - Ισοσκελές τρίγωνο: ύψος προς τη βάση & γωνία κορυφής
    const halfVertex = randInt(18, 38);
    const fullVertex = halfVertex * 2;
    qList.push({
      id: 9,
      title: isEl ? 'Ύψος & Γωνία Κορυφής Ισοσκελούς' : 'Altitude & Vertex Angle of Isosceles Triangle',
      prompt: isEl ? (
        <span>
          Σε ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ), φέρνουμε το ύψος ΑΥ προς τη βάση ΒΓ. Αν η γωνία Β<Angle>Α</Angle>Υ είναι {halfVertex}°, πόσες μοίρες είναι ολόκληρη η γωνία κορυφής <Angle>Α</Angle>;
        </span>
      ) : (
        <span>
          In an isosceles triangle ABC (AB ＝ AC), we draw altitude AH to base BC. If angle ∠BAH measures {halfVertex}°, how many degrees is the full vertex angle ∠A?
        </span>
      ),
      type: 'input',
      correct: fullVertex,
      unit: '°',
      tableData: [
        {
          label: isEl ? 'Ιδιότητα ισοσκελούς' : 'Isosceles property',
          details: isEl
            ? 'Το ύψος ΑΥ προς τη βάση ΒΓ είναι και διχοτόμος της γωνίας κορυφής'
            : 'Altitude AH to base BC also bisects the vertex angle'
        },
        {
          label: isEl ? 'Σχέση γωνιών' : 'Angle relation',
          details: isEl ? (
            <span>
              <Angle>Α</Angle> ＝ 2 · Β<Angle>Α</Angle>Υ
            </span>
          ) : (
            '∠A ＝ 2 · ∠BAH'
          )
        },
        {
          label: isEl ? 'Υπολογισμός' : 'Calculation',
          details: `2 · ${halfVertex}° ＝ ${fullVertex}°`
        }
      ],
      explanation: isEl ? (
        <span>
          Επειδή το τρίγωνο είναι ισοσκελές, το ύψος ΑΥ προς τη βάση είναι και διχοτόμος της <Angle>Α</Angle>. Άρα <Angle>Α</Angle> ＝ 2 · {halfVertex}° ＝ {fullVertex}°.
        </span>
      ) : (
        <span>
          Since the triangle is isosceles, altitude AH to the base also bisects ∠A. Therefore, ∠A ＝ 2 · {halfVertex}° ＝ {fullVertex}°.
        </span>
      )
    });

    // Q10: Input + tableData - Υπολογισμός γωνίας σε ορθογώνιο τρίγωνο που σχηματίζει το ύψος
    const angleB = randInt(32, 74);
    const angleBAH = 90 - angleB;
    qList.push({
      id: 10,
      title: isEl ? 'Υπολογισμός Γωνίας με Ύψος Τριγώνου' : 'Finding an Angle Using an Altitude',
      prompt: isEl ? (
        <span>
          Σε οξυγώνιο τρίγωνο ΑΒΓ, η γωνία <Angle>Β</Angle> είναι {angleB}° και φέρνουμε το ύψος ΑΥ (ΑΥ ⊥ ΒΓ). Πόσες μοίρες είναι η γωνία Β<Angle>Α</Angle>Υ;
        </span>
      ) : (
        <span>
          In acute triangle ABC, angle ∠B measures {angleB}° and we draw altitude AH (AH ⊥ BC). How many degrees is angle ∠BAH?
        </span>
      ),
      type: 'input',
      correct: angleBAH,
      unit: '°',
      tableData: [
        {
          label: isEl ? 'Ορθογώνιο τρίγωνο ΑΒΥ' : 'Right triangle ABH',
          details: isEl ? (
            <span>
              Επειδή ΑΥ ⊥ ΒΓ, η γωνία Α<Angle>Υ</Angle>Β ＝ 90°
            </span>
          ) : (
            'Since AH ⊥ BC, angle ∠AHB ＝ 90°'
          )
        },
        {
          label: isEl ? 'Άθροισμα οξειών γωνιών' : 'Sum of acute angles',
          details: isEl ? (
            <span>
              <Angle>Β</Angle> ＋ Β<Angle>Α</Angle>Υ ＝ 90°
            </span>
          ) : (
            '∠B ＋ ∠BAH ＝ 90°'
          )
        },
        {
          label: isEl ? 'Υπολογισμός' : 'Calculation',
          details: `90° － ${angleB}° ＝ ${angleBAH}°`
        }
      ],
      explanation: isEl ? (
        <span>
          Στο ορθογώνιο τρίγωνο ΑΒΥ (<Angle>Υ</Angle> ＝ 90°), οι δύο οξείες γωνίες έχουν άθροισμα 90°. Άρα Β<Angle>Α</Angle>Υ ＝ 90° － {angleB}° ＝ {angleBAH}°.
        </span>
      ) : (
        <span>
          In right triangle ABH (∠H ＝ 90°), the two acute angles sum to 90°. Hence, ∠BAH ＝ 90° － {angleB}° ＝ {angleBAH}°.
        </span>
      )
    });

    // Q11: MCQ + tableData - Συνδυαστικό πρόβλημα διχοτόμου & αθροίσματος γωνιών
    const angB11 = randInt(48, 72);
    const angC11 = randInt(36, 62);
    const sumBC = angB11 + angC11;
    // Διασφαλίζουμε άρτια γωνία Α ώστε η διχοτόμος να δίνει ακέραιες μοίρες
    const adjC11 = (180 - sumBC) % 2 === 0 ? angC11 : angC11 + 1;
    const angA11 = 180 - angB11 - adjC11;
    const halfA11 = angA11 / 2;

    const q11Correct = `${halfA11}°`;
    const q11Distractors = [
      `${angA11}°`,
      `${90 - halfA11}°`,
      `${halfA11 + 10}°`,
      `${Math.abs(angB11 - adjC11)}°`,
      `${halfA11 - 5}°`
    ];

    qList.push({
      id: 11,
      title: isEl ? 'Συνδυασμός Διχοτόμου & Αθροίσματος Γωνιών' : 'Angle Bisector & Angle Sum Combined',
      prompt: isEl ? (
        <span>
          Σε τρίγωνο ΑΒΓ δίνονται <Angle>Β</Angle> ＝ {angB11}° και <Angle>Γ</Angle> ＝ {adjC11}°. Αν ΑΔ είναι η διχοτόμος της γωνίας <Angle>Α</Angle>, πόσο είναι το μέτρο της γωνίας Γ<Angle>Α</Angle>Δ;
        </span>
      ) : (
        <span>
          In triangle ABC, ∠B ＝ {angB11}° and ∠C ＝ {adjC11}°. If AD is the bisector of angle ∠A, what is the measure of angle ∠CAD?
        </span>
      ),
      type: 'mcq',
      correct: q11Correct,
      options: ensureFourUniqueOptions(q11Correct, () => q11Distractors[randInt(0, q11Distractors.length - 1)]),
      tableData: [
        {
          label: isEl ? '1. Εύρεση γωνίας Α' : '1. Finding angle ∠A',
          details: `180° － (${angB11}° ＋ ${adjC11}°) ＝ 180° － ${angB11 + adjC11}° ＝ ${angA11}°`
        },
        {
          label: isEl ? '2. Εφαρμογή διχοτόμου ΑΔ' : '2. Applying bisector AD',
          details: (
            <span className="inline-flex items-center gap-1">
              {isEl ? <>Γ<Angle>Α</Angle>Δ ＝</> : '∠CAD ＝'} <Frac num={`${angA11}°`} den="2" /> ＝ {halfA11}°
            </span>
          )
        }
      ],
      explanation: isEl ? (
        <span>
          Πρώτα βρίσκουμε τη γωνία <Angle>Α</Angle> ＝ 180° － ({angB11}° ＋ {adjC11}°) ＝ {angA11}°. Επειδή η ΑΔ είναι διχοτόμος, η γωνία Γ<Angle>Α</Angle>Δ είναι το μισό της, δηλαδή {halfA11}°.
        </span>
      ) : (
        <span>
          First, we find ∠A ＝ 180° － ({angB11}° ＋ {adjC11}°) ＝ {angA11}°. Since AD bisects ∠A, angle ∠CAD is half of it, which is {halfA11}°.
        </span>
      )
    });

    // Q12: Input + tableData - Εφαρμογή: Περίμετρος ισοσκελούς με διάμεσο
    const legAB = randInt(8, 16);
    const halfBaseBM = randInt(4, 9);
    const fullBaseBC = 2 * halfBaseBM;
    const totalPerim = 2 * legAB + fullBaseBC;

    qList.push({
      id: 12,
      title: isEl ? 'Εφαρμογή: Περίμετρος Ισοσκελούς με Διάμεσο' : 'Application: Isosceles Perimeter with Median',
      prompt: isEl ? (
        <span>
          Ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) έχει πλευρά ΑΒ ＝ {legAB} cm. Αν ΑΜ είναι η διάμεσος προς τη βάση ΒΓ και ισχύει ΒΜ ＝ {halfBaseBM} cm, πόσα εκατοστά (cm) είναι η περίμετρος του τριγώνου ΑΒΓ;
        </span>
      ) : (
        <span>
          An isosceles triangle ABC (AB ＝ AC) has side AB ＝ {legAB} cm. If AM is the median to base BC and BM ＝ {halfBaseBM} cm, what is the perimeter of triangle ABC in cm?
        </span>
      ),
      type: 'input',
      correct: totalPerim,
      unit: 'cm',
      tableData: [
        {
          label: isEl ? 'Μήκος βάσης ΒΓ' : 'Base length BC',
          details: `ΒΓ ＝ 2 · ΒΜ ＝ 2 · ${halfBaseBM} ＝ ${fullBaseBC} cm`
        },
        {
          label: isEl ? 'Μήκη σκελών' : 'Equal legs',
          details: `ΑΒ ＝ ΑΓ ＝ ${legAB} cm`
        },
        {
          label: isEl ? 'Περίμετρος Π' : 'Perimeter P',
          details: `Π ＝ ${legAB} ＋ ${legAB} ＋ ${fullBaseBC} ＝ ${totalPerim} cm`
        }
      ],
      explanation: isEl
        ? `Από τη διάμεσο ΑΜ βρίσκουμε τη βάση ΒΓ ＝ 2 · ${halfBaseBM} ＝ ${fullBaseBC} cm. Επειδή ΑΒ ＝ ΑΓ ＝ ${legAB} cm, η περίμετρος είναι ${legAB} ＋ ${legAB} ＋ ${fullBaseBC} ＝ ${totalPerim} cm.`
        : `From median AM, base BC ＝ 2 · ${halfBaseBM} ＝ ${fullBaseBC} cm. Since AB ＝ AC ＝ ${legAB} cm, the perimeter is ${legAB} ＋ ${legAB} ＋ ${fullBaseBC} ＝ ${totalPerim} cm.`
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
      backUrl="/a-gymnasiou/41-stoixeia-trigonon"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/41-stoixeia-trigonon"
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
// pages/d-dimotikou/27-sterea-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Δ')/g);
  return parts
    .map((part) => {
      if (part === "Δ'") return "Δ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Λεξικό Μεταφράσεων
const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Γεωμετρικά Στερεά Σώματα | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στα γεωμετρικά στερεά: αναγνώριση 3D σχημάτων, καταμέτρηση εδρών, ακμών και κορυφών και αντικείμενα καθημερινότητας.",
    backText: "Δ' Δημοτικού",
    badgeHeader: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    theoryBtn: "Θεωρία",
    headerTitle: "Ασκήσεις: Γεωμετρικά Στερεά Σώματα",
    headerDesc: "Πατώντας «Νέες Ασκήσεις», τα στερεά, οι ερωτήσεις και οι μετρήσεις ανανεώνονται αυτόματα από τη δεξαμενή!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    footerPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    resultLabel: "Αποτέλεσμα:",
    inputPlaceholder: "Αριθμός",
    correctAnswerIs: "Η σωστή απάντηση είναι:",
    theStatementIs: "Η πρόταση είναι",
    qRecognitionTitle: "Ποιο γεωμετρικό στερεό απεικονίζεται στο παρακάτω σχήμα;",
    qRecognitionExplain: (name) => `Το συγκεκριμένο τρισδιάστατο γεωμετρικό σώμα είναι ${name}.`,
    qFaces: (solidName) => `Πόσες έδρες έχει συνολικά το στερεό: «${solidName}»;`,
    qEdges: (solidName) => `Πόσες ακμές έχει συνολικά το στερεό: «${solidName}»;`,
    qVertices: (solidName) => `Πόσες κορυφές έχει συνολικά το στερεό: «${solidName}»;`,
    unitFaces: "έδρες",
    unitEdges: "ακμές",
    unitVertices: "κορυφές",
    countExplain: (solidName, val, unit) => `${solidName} έχει ακριβώς ${val} ${unit}.`,
    qRealLife: (item) => `${item} έχει το σχήμα ποιου γεωμετρικού στερεού;`,
    realLifeExplain: (item, solidName) => `${item} προσομοιάζει το γεωμετρικό σχήμα: ${solidName}.`,
    trueLabel: "Σωστό",
    falseLabel: "Λάθος",
    solids: {
      cube: "Κύβος",
      cuboid: "Ορθογώνιο Παραλληλεπίπεδο",
      sqPyramid: "Τετραγωνική Πυραμίδα",
      triPyramid: "Τριγωνική Πυραμίδα (Τετράεδρο)",
      cylinder: "Κύλινδρος",
      cone: "Κώνος",
      sphere: "Σφαίρα"
    },
    realLifeItems: {
      dice: "Ένα ζάρι 🎲",
      soda: "Ένα κουτάκι αναψυκτικού 🥤",
      ball: "Μία μπάλα ποδοσφαίρου ⚽",
      iceCream: "Ένα χωνάκι παγωτού 🍦",
      shoeBox: "Ένα κουτί παπουτσιών 📦",
      tent: "Μία σκηνή κάμπινγκ τύπου πυραμίδας ⛺"
    },
    trueFalsePool: [
      {
        q: "Ο κύβος έχει 6 ίσες τετράγωνες έδρες, 12 ακμές και 8 κορυφές.",
        correct: "Σωστό",
        explain: "Ο κύβος αποτελείται από 6 ίσα τετράγωνα, έχει 12 ακμές και 8 κορυφές."
      },
      {
        q: "Η σφαίρα διαθέτει 6 επίπεδες έδρες και 8 κορυφές.",
        correct: "Λάθος",
        explain: "Η σφαίρα είναι σώμα εκ περιστροφής με 1 ενιαία καμπύλη επιφάνεια και δεν έχει καθόλου ακμές ή κορυφές."
      },
      {
        q: "Ο κύλινδρος έχει 2 ίσες κυκλικές βάσεις και 1 καμπύλη επιφάνεια.",
        correct: "Σωστό",
        explain: "Οι δύο βάσεις του κυλίνδρου είναι ίσοι κυκλικοί δίσκοι ενωμένοι με καμπύλη παράπλευρη επιφάνεια."
      },
      {
        q: "Η τετραγωνική πυραμίδα έχει συνολικά 8 κορυφές.",
        correct: "Λάθος",
        explain: "Η τετραγωνική πυραμίδα έχει 5 κορυφές (4 στη βάση ＋ 1 στην κορυφή), ενώ 8 είναι οι ακμές της."
      },
      {
        q: "Το ορθογώνιο παραλληλεπίπεδο έχει 12 ακμές και 8 κορυφές.",
        correct: "Σωστό",
        explain: "Το ορθογώνιο παραλληλεπίπεδο αποτελείται από 6 ορθογώνιες έδρες, 12 ακμές και 8 κορυφές."
      },
      {
        q: "Ο κώνος διαθέτει 1 κυκλική βάση και 1 κορυφή.",
        correct: "Σωστό",
        explain: "Ο κώνος έχει μία επίπεδη κυκλική βάση και μία μυτερή κορυφή."
      }
    ]
  },
  en: {
    pageTitle: "Exercises: 3D Geometric Solids | LearnMaths.gr",
    pageDesc: "Interactive 4th Grade math exercises on 3D geometric solids: identifying shapes, counting faces, edges, and vertices, and real-world objects.",
    backText: "4th Grade",
    badgeHeader: "GRADE 4 • PRACTICE",
    theoryBtn: "Theory",
    headerTitle: "Exercises: 3D Geometric Solids",
    headerDesc: "Clicking «New Exercises» automatically regenerates the solids, questions, and counts from the database!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success:",
    footerPrompt: "Complete all questions and click «Check Answers»!",
    resultLabel: "Result:",
    inputPlaceholder: "Number",
    correctAnswerIs: "The correct answer is:",
    theStatementIs: "The statement is",
    qRecognitionTitle: "Which 3D solid is depicted in the figure below?",
    qRecognitionExplain: (name) => `This 3D geometric shape is a ${name}.`,
    qFaces: (solidName) => `How many faces does the solid «${solidName}» have in total?`,
    qEdges: (solidName) => `How many edges does the solid «${solidName}» have in total?`,
    qVertices: (solidName) => `How many vertices does the solid «${solidName}» have in total?`,
    unitFaces: "faces",
    unitEdges: "edges",
    unitVertices: "vertices",
    countExplain: (solidName, val, unit) => `${solidName} has exactly ${val} ${unit}.`,
    qRealLife: (item) => `${item} has the shape of which 3D geometric solid?`,
    realLifeExplain: (item, solidName) => `${item} resembles the geometric solid: ${solidName}.`,
    trueLabel: "True",
    falseLabel: "False",
    solids: {
      cube: "Cube",
      cuboid: "Rectangular Prism (Cuboid)",
      sqPyramid: "Square Pyramid",
      triPyramid: "Triangular Pyramid (Tetrahedron)",
      cylinder: "Cylinder",
      cone: "Cone",
      sphere: "Sphere"
    },
    realLifeItems: {
      dice: "A die 🎲",
      soda: "A soda can 🥤",
      ball: "A soccer ball ⚽",
      iceCream: "An ice cream cone 🍦",
      shoeBox: "A shoe box 📦",
      tent: "A pyramid camping tent ⛺"
    },
    trueFalsePool: [
      {
        q: "A cube has 6 equal square faces, 12 edges, and 8 vertices.",
        correct: "True",
        explain: "A cube consists of 6 congruent squares, with 12 edges and 8 vertices."
      },
      {
        q: "A sphere has 6 flat faces and 8 vertices.",
        correct: "False",
        explain: "A sphere is a solid of revolution with 1 continuous curved surface and no edges or vertices."
      },
      {
        q: "A cylinder has 2 identical circular bases and 1 curved lateral surface.",
        correct: "True",
        explain: "The two bases of a cylinder are congruent circular disks joined by a curved surface."
      },
      {
        q: "A square pyramid has a total of 8 vertices.",
        correct: "False",
        explain: "A square pyramid has 5 vertices (4 at the base ＋ 1 apex), whereas 8 is the number of its edges."
      },
      {
        q: "A rectangular prism has 12 edges and 8 vertices.",
        correct: "True",
        explain: "A rectangular prism consists of 6 rectangular faces, 12 edges, and 8 vertices."
      },
      {
        q: "A cone has 1 circular base and 1 apex vertex.",
        correct: "True",
        explain: "A cone consists of a flat circular base and a single sharp apex vertex."
      }
    ]
  }
};

// SVG Γραφικά
const SOLIDS_SVGS = {
  cube: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <line x1="50" y1="130" x2="50" y2="70" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="50" y1="130" x2="110" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="50" y1="130" x2="90" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <polygon points="90,100 150,100 150,160 90,160" fill="#3b82f6" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="3" />
      <polygon points="90,100 150,100 110,70 50,70" fill="#60a5fa" fillOpacity="0.45" stroke="#1d4ed8" strokeWidth="3" />
      <polygon points="150,100 150,160 110,130 110,70" fill="#2563eb" fillOpacity="0.55" stroke="#1d4ed8" strokeWidth="3" />
    </svg>
  ),
  cuboid: (
    <svg className="w-40 h-36 mx-auto block select-none" viewBox="0 0 220 200">
      <line x1="40" y1="130" x2="40" y2="70" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="40" y1="130" x2="130" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="40" y1="130" x2="80" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <polygon points="80,100 170,100 170,160 80,160" fill="#14b8a6" fillOpacity="0.35" stroke="#0f766e" strokeWidth="3" />
      <polygon points="80,100 170,100 130,70 40,70" fill="#2dd4bf" fillOpacity="0.45" stroke="#0f766e" strokeWidth="3" />
      <polygon points="170,100 170,160 130,130 130,70" fill="#0d9488" fillOpacity="0.55" stroke="#0f766e" strokeWidth="3" />
    </svg>
  ),
  sqPyramid: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <line x1="40" y1="130" x2="130" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="40" y1="130" x2="70" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="40" y1="130" x2="100" y2="40" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <polygon points="70,160 160,160 100,40" fill="#f59e0b" fillOpacity="0.35" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="160,160 130,130 100,40" fill="#d97706" fillOpacity="0.55" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="70,160 100,40 40,130" fill="#fbbf24" fillOpacity="0.25" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  ),
  triPyramid: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <line x1="90" y1="120" x2="100" y2="40" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="40" y1="150" x2="90" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <line x1="160" y1="150" x2="90" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <polygon points="40,150 160,150 100,40" fill="#f43f5e" fillOpacity="0.4" stroke="#be123c" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  ),
  cylinder: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <path d="M 50,60 L 50,150 A 50,15 0 0,0 150,150 L 150,60 Z" fill="#8b5cf6" fillOpacity="0.35" stroke="#6d28d9" strokeWidth="3" />
      <ellipse cx="100" cy="60" rx="50" ry="15" fill="#a78bfa" fillOpacity="0.65" stroke="#6d28d9" strokeWidth="3" />
    </svg>
  ),
  cone: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <path d="M 50,150 L 100,40 L 150,150 A 50,15 0 0,1 50,150 Z" fill="#06b6d4" fillOpacity="0.35" stroke="#0e7490" strokeWidth="3" />
      <circle cx="100" cy="40" r="4.5" fill="#fbbf24" />
    </svg>
  ),
  sphere: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="65" fill="#10b981" fillOpacity="0.35" stroke="#047857" strokeWidth="3" />
      <path d="M 35,100 A 65,20 0 0,1 165,100" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
      <path d="M 35,100 A 65,20 0 0,0 165,100" fill="none" stroke="#047857" strokeWidth="2.5" />
      <ellipse cx="80" cy="75" rx="15" ry="8" fill="#ffffff" fillOpacity="0.6" transform="rotate(-30, 80, 75)" />
    </svg>
  )
};

const RAW_SOLIDS = [
  { key: 'cube', faces: 6, edges: 12, vertices: 8 },
  { key: 'cuboid', faces: 6, edges: 12, vertices: 8 },
  { key: 'sqPyramid', faces: 5, edges: 8, vertices: 5 },
  { key: 'triPyramid', faces: 4, edges: 6, vertices: 4 },
  { key: 'cylinder', faces: 3, edges: 0, vertices: 0 },
  { key: 'cone', faces: 2, edges: 0, vertices: 1 },
  { key: 'sphere', faces: 1, edges: 0, vertices: 0 }
];

// 1. Άσκηση: Αναγνώριση Στερεού από SVG (4 Επιλογές MCQ)
function makeSolidRecognitionQuestion(t, prevQ = null) {
  let solid, correctName;

  while (true) {
    solid = RAW_SOLIDS[getRandomInt(0, RAW_SOLIDS.length - 1)];
    correctName = t.solids[solid.key];
    if (!prevQ || prevQ.correct !== correctName) break;
  }

  const allNames = RAW_SOLIDS.map((s) => t.solids[s.key]);
  const wrongs = allNames.filter((n) => n !== correctName);
  const shuffledWrongs = [...new Set(wrongs)].sort(() => Math.random() - 0.5).slice(0, 3);
  const rawOptions = [correctName, ...shuffledWrongs].sort(() => Math.random() - 0.5);
  const options = [...new Set(rawOptions)];

  return {
    q: t.qRecognitionTitle,
    svg: SOLIDS_SVGS[solid.key],
    options,
    correct: correctName,
    explainText: t.qRecognitionExplain(correctName)
  };
}

// 2. Άσκηση: Καταμέτρηση Εδρών, Ακμών ή Κορυφών (Input)
function makeCountFeatureQuestion(t, prevQ = null) {
  const polyhedra = RAW_SOLIDS.slice(0, 4);
  let solid, featureType, qText, correctVal, featureName, solidName;

  while (true) {
    solid = polyhedra[getRandomInt(0, polyhedra.length - 1)];
    solidName = t.solids[solid.key];
    featureType = getRandomInt(1, 3); // 1 = Έδρες, 2 = Ακμές, 3 = Κορυφές

    if (featureType === 1) {
      qText = t.qFaces(solidName);
      correctVal = solid.faces;
      featureName = t.unitFaces;
    } else if (featureType === 2) {
      qText = t.qEdges(solidName);
      correctVal = solid.edges;
      featureName = t.unitEdges;
    } else {
      qText = t.qVertices(solidName);
      correctVal = solid.vertices;
      featureName = t.unitVertices;
    }

    if (!prevQ || prevQ.q !== qText) break;
  }

  return {
    q: qText,
    correct: correctVal,
    unit: featureName,
    explainText: t.countExplain(solidName, correctVal, featureName)
  };
}

// 3. Άσκηση: Αντικείμενα Καθημερινότητας (4 Επιλογές MCQ)
function makeRealLifeMatchingQuestion(t, prevQ = null) {
  const examples = [
    { itemKey: 'dice', solidKey: 'cube', wrongKeys: ['sphere', 'cone', 'cylinder'] },
    { itemKey: 'soda', solidKey: 'cylinder', wrongKeys: ['cube', 'sqPyramid', 'cone'] },
    { itemKey: 'ball', solidKey: 'sphere', wrongKeys: ['cube', 'cylinder', 'cuboid'] },
    { itemKey: 'iceCream', solidKey: 'cone', wrongKeys: ['sphere', 'cube', 'cuboid'] },
    { itemKey: 'shoeBox', solidKey: 'cuboid', wrongKeys: ['cylinder', 'sphere', 'cone'] },
    { itemKey: 'tent', solidKey: 'sqPyramid', wrongKeys: ['cylinder', 'cube', 'sphere'] }
  ];

  let ex;
  while (true) {
    ex = examples[getRandomInt(0, examples.length - 1)];
    if (!prevQ || prevQ.itemKey !== ex.itemKey) break;
  }

  const itemName = t.realLifeItems[ex.itemKey];
  const correct = t.solids[ex.solidKey];
  const wrongs = ex.wrongKeys.map((k) => t.solids[k]);
  const rawOptions = [correct, ...wrongs].sort(() => Math.random() - 0.5);
  const options = [...new Set(rawOptions)];

  return {
    itemKey: ex.itemKey,
    q: t.qRealLife(itemName),
    options,
    correct,
    explainText: t.realLifeExplain(itemName, correct)
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions(t) {
  const q1 = makeSolidRecognitionQuestion(t);
  const q2 = makeSolidRecognitionQuestion(t, q1);

  const q3 = makeCountFeatureQuestion(t);
  const q4 = makeCountFeatureQuestion(t, q3);

  const q5 = makeRealLifeMatchingQuestion(t);
  const q6 = makeRealLifeMatchingQuestion(t, q5);

  const tf1 = t.trueFalsePool[getRandomInt(0, t.trueFalsePool.length - 1)];
  let tf2;
  while (true) {
    tf2 = t.trueFalsePool[getRandomInt(0, t.trueFalsePool.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return { q1, q2, q3, q4, q5, q6, q7: tf1, q8: tf2 };
}

export default function StereaAskPage() {
  const router = useRouter();
  const rawLocale = router?.locale || 'el';
  const locale = TRANSLATIONS[rawLocale] ? rawLocale : 'el';
  const t = TRANSLATIONS[locale];

  const formatNumber = (num) => {
    if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
  };

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(t));
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

    if (answers.q1 === questions.q1.correct) currentScore += 1;
    if (answers.q2 === questions.q2.correct) currentScore += 1;
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render MCQ Ασκήσεων (Q1, Q2, Q5, Q6)
  const renderMCQQuestion = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-indigo-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {formatNumber(numLabel)}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h2>
        </div>

        {qData.svg && (
          <div className="bg-slate-950 p-4 rounded-2xl w-fit mx-auto mb-4 border border-slate-800 shadow-inner">
            {qData.svg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-sm'
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
                <span className="break-words whitespace-normal leading-snug flex-1 font-bold text-sm sm:text-base">
                  {opt}
                </span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctAnswerIs} <strong className="font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Input Number Ασκήσεων (Q3 & Q4)
  const renderInputNumber = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-purple-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {formatNumber(numLabel)}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h2>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">
              {t.resultLabel}
            </span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.inputPlaceholder}
              maxLength={10}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-purple-950 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
            />
            <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">
              {qData.unit}
            </span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctAnswerIs} <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)} {qData.unit}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Σωστό / Λάθος (Q7 & Q8)
  const renderTrueFalse = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    const tfOptions = [t.trueLabel, t.falseLabel];

    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-teal-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {formatNumber(numLabel)}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h2>
        </div>

        <div className="flex gap-3 sm:pl-11">
          {tfOptions.map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => handleInputChange(qKey, opt)}
              disabled={submitted}
              className={`px-6 sm:px-8 py-3 rounded-2xl font-black text-sm sm:text-base border transition active:scale-95 touch-manipulation select-none ${
                answers[qKey] === opt
                  ? (opt === t.trueLabel ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-rose-600 text-white border-rose-700 shadow-md')
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explain}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.theStatementIs} <strong className="font-bold text-rose-900">«{qData.correct}»</strong>: {qData.explain}
              </p>
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
      backUrl="/d-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/27-sterea"
          className="bg-blue-100 hover:bg-blue-200 text-blue-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badgeHeader)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 {t.headerTitle}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              {t.headerDesc}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-blue-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderMCQQuestion('q1', questions.q1, 1)}
          {renderMCQQuestion('q2', questions.q2, 2)}

          {renderInputNumber('q3', questions.q3, 3)}
          {renderInputNumber('q4', questions.q4, 4)}

          {renderMCQQuestion('q5', questions.q5, 5)}
          {renderMCQQuestion('q6', questions.q6, 6)}

          {renderTrueFalse('q7', questions.q7, 7)}
          {renderTrueFalse('q8', questions.q8, 8)}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 {t.submitBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ΣΤΑΘΕΡΟ BOTTOM FOOTER: SCORES & FEEDBACK BAR */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-6 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl font-mono">{formatNumber(score)} / {formatNumber(8)}</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{formatNumber(Math.round((score / 8) * 100))}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> {t.newQuestionsBtn}
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.footerPrompt}
              </p>
            )}
          </div>
        </div>
      </footer>
    </Layout>
  );
}
// pages/d-dimotikou/28-sterea-anoigma-ask.js
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
    pageTitle: "Ασκήσεις: Αναπτύγματα Στερεών Σωμάτων | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στα αναπτύγματα των γεωμετρικών στερεών: αναγνώριση 2D σχεδίων, καταμέτρηση επιφανειών και σύνδεση με το 3D στερεό.",
    backText: "Δ' Δημοτικού",
    badgeHeader: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    theoryBtn: "Θεωρία",
    headerTitle: "Ασκήσεις: Αναπτύγματα Στερεών Σωμάτων",
    headerDesc: "Πατώντας «Νέες Ασκήσεις», τα αναπτύγματα, οι ερωτήσεις και οι επιλογές ανανεώνονται αυτόματα από τη δεξαμενή!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    footerPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    resultLabel: "Αποτέλεσμα:",
    inputPlaceholder: "Αριθμός",
    correctAnswerIs: "Η σωστή απάντηση είναι:",
    theStatementIs: "Η πρόταση είναι",
    qNetRecognitionTitle: "Αν διπλώσουμε το παρακάτω ανάπτυγμα, ποιο γεωμετρικό στερεό θα σχηματιστεί;",
    qNetRecognitionExplain: (shapes, name) => `Το συγκεκριμένο επίπεδο ανάπτυγμα αποτελείται από ${shapes} και σχηματίζει: ${name}.`,
    qDescTitle: (desc) => `Ποιο στερεό έχει ανάπτυγμα που αποτελείται από: «${desc}»;`,
    qDescExplain: (name) => `Αυτό είναι το ανάπτυγμα για το στερεό: ${name}.`,
    trueLabel: "Σωστό",
    falseLabel: "Λάθος",
    solids: {
      cube: "Κύβος",
      cuboid: "Ορθογώνιο Παραλληλεπίπεδο",
      sqPyramid: "Τετραγωνική Πυραμίδα",
      triPyramid: "Τριγωνική Πυραμίδα",
      triPyramidAlt: "Τριγωνική Πυραμίδα (Τετράεδρο)",
      cylinder: "Κύλινδρος",
      cone: "Κώνος",
      sphere: "Σφαίρα"
    },
    netsShapes: {
      cube: "6 ίσα τετράγωνα",
      cuboid: "6 ορθογώνια παραλληλόγραμμα",
      sqPyramid: "1 τετράγωνο και 4 τρίγωνα",
      triPyramid: "4 τρίγωνα",
      cylinder: "1 ορθογώνιο και 2 ίσοι κύκλοι",
      cone: "1 κυκλικός τομέας και 1 κύκλος"
    },
    countQuestions: [
      {
        q: "Από πόσα ίσα τετράγωνα αποτελείται το επίπεδο ανάπτυγμα ενός Κύβου;",
        correct: 6,
        unit: "τετράγωνα",
        explainText: "Ο κύβος διαθέτει 6 ίσες τετράγωνες έδρες, επομένως το ανάπτυγμά του αποτελείται από 6 τετράγωνα."
      },
      {
        q: "Πόσα τρίγωνα έχει συνολικά το ανάπτυγμα μιας Τετραγωνικής Πυραμίδας;",
        correct: 4,
        unit: "τρίγωνα",
        explainText: "Η τετραγωνική πυραμίδα έχει 1 τετράγωνη βάση και 4 τριγωνικές παράπλευρες έδρες."
      },
      {
        q: "Από πόσα τρίγωνα αποτελείται συνολικά το ανάπτυγμα μιας Τριγωνικής Πυραμίδας (Τετραέδρου);",
        correct: 4,
        unit: "τρίγωνα",
        explainText: "Η τριγωνική πυραμίδα αποτελείται από 4 τρίγωνα (1 τριγωνική βάση ＋ 3 πλαϊνές έδρες)."
      },
      {
        q: "Πόσους κυκλικούς δίσκους (βάσεις) έχει το ανάπτυγμα ενός Κυλίνδρου;",
        correct: 2,
        unit: "κύκλους",
        explainText: "Ο κύλινδρος έχει 2 ίσους κυκλικούς δίσκους (την πάνω και την κάτω βάση)."
      },
      {
        q: "Από πόσα ορθογώνια παραλληλόγραμμα αποτελείται το ανάπτυγμα ενός Ορθογωνίου Παραλληλεπιπέδου;",
        correct: 6,
        unit: "ορθογώνια",
        explainText: "Το ορθογώνιο παραλληλεπίπεδο αποτελείται από 6 ορθογώνιες έδρες (ανά 2 απέναντι είναι ίσα)."
      }
    ],
    descPool: [
      {
        desc: "1 ορθογώνιο παραλληλόγραμμο και 2 ίσοι κυκλικοί δίσκοι",
        correctKey: "cylinder",
        wrongKeys: ["cone", "cube", "sphere"]
      },
      {
        desc: "1 κυκλικός τομέας (τμήμα κύκλου) και 1 κυκλικός δίσκος",
        correctKey: "cone",
        wrongKeys: ["cylinder", "sqPyramid", "sphere"]
      },
      {
        desc: "1 τετράγωνο και 4 ισοσκελή τρίγωνα",
        correctKey: "sqPyramid",
        wrongKeys: ["triPyramid", "cube", "cuboid"]
      },
      {
        desc: "4 ισόπλευρα τρίγωνα",
        correctKey: "triPyramidAlt",
        wrongKeys: ["sqPyramid", "cube", "cone"]
      },
      {
        desc: "6 ίσα τετράγωνα τοποθετημένα κατάλληλα",
        correctKey: "cube",
        wrongKeys: ["cuboid", "sqPyramid", "cylinder"]
      }
    ],
    trueFalsePool: [
      {
        q: "Η σφαίρα διαθέτει ένα επίπεδο ανάπτυγμα που αποτελείται από 2 κύκλους.",
        correct: "Λάθος",
        explain: "Η σφαίρα δεν διαθέτει επίπεδο ανάπτυγμα επειδή η επιφάνειά της καμπυλώνεται προς όλες τις κατευθύνσεις."
      },
      {
        q: "Το ανάπτυγμα του κυλίνδρου αποτελείται από 1 ορθογώνιο και 2 κύκλους.",
        correct: "Σωστό",
        explain: "Το ορθογώνιο παραλληλόγραμμο τυλίγεται και σχηματίζει το σώμα του κυλίνδρου ανάμεσα στις 2 κυκλικές βάσεις."
      },
      {
        q: "Όλα τα έγκυρα αναπτύγματα του κύβου έχουν ακριβώς 6 τετράγωνα.",
        correct: "Σωστό",
        explain: "Ο κύβος έχει 6 τετράγωνες έδρες, επομένως κάθε σωστό ανάπτυγμά του αποτελείται από 6 τετράγωνα."
      },
      {
        q: "Στα αναπτύγματα, οι διακεκομμένες γραμμές δείχνουν πού πρέπει να κόψουμε με το ψαλίδι.",
        correct: "Λάθος",
        explain: "Οι διακεκομμένες γραμμές δείχνουν τα σημεία όπου διπλώνουμε το χαρτί, ενώ οι συνεχόμενες είναι οι γραμμές κοπής."
      },
      {
        q: "Το ανάπτυγμα του κώνου αποτελείται από έναν κυκλικό τομέα και έναν κύκλο.",
        correct: "Σωστό",
        explain: "Ο κυκλικός τομέας («βεντάλια») σχηματίζει την παράπλευρη καμπύλη επιφάνεια και ο κύκλος τη βάση."
      },
      {
        q: "Το ανάπτυγμα της τετραγωνικής πυραμίδας έχει 5 τρίγωνα.",
        correct: "Λάθος",
        explain: "Το ανάπτυγμα της τετραγωνικής πυραμίδας έχει 1 τετράγωνο (βάση) και 4 τρίγωνα (παράπλευρες έδρες)."
      }
    ]
  },
  en: {
    pageTitle: "Exercises: Nets of 3D Solids | LearnMaths.gr",
    pageDesc: "Interactive 4th Grade math exercises on 2D nets of 3D geometric solids: recognizing flat patterns, counting faces, and connecting to 3D shapes.",
    backText: "4th Grade",
    badgeHeader: "GRADE 4 • PRACTICE",
    theoryBtn: "Theory",
    headerTitle: "Exercises: Nets of 3D Solids",
    headerDesc: "Clicking «New Exercises» automatically regenerates the nets, questions, and options from the database!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success:",
    footerPrompt: "Complete all questions and click «Check Answers»!",
    resultLabel: "Result:",
    inputPlaceholder: "Number",
    correctAnswerIs: "The correct answer is:",
    theStatementIs: "The statement is",
    qNetRecognitionTitle: "If we fold the net below, which 3D geometric solid will be formed?",
    qNetRecognitionExplain: (shapes, name) => `This 2D net consists of ${shapes} and folds into a: ${name}.`,
    qDescTitle: (desc) => `Which solid has a net consisting of: «${desc}»?`,
    qDescExplain: (name) => `This is the net for the solid: ${name}.`,
    trueLabel: "True",
    falseLabel: "False",
    solids: {
      cube: "Cube",
      cuboid: "Rectangular Prism (Cuboid)",
      sqPyramid: "Square Pyramid",
      triPyramid: "Triangular Pyramid",
      triPyramidAlt: "Triangular Pyramid (Tetrahedron)",
      cylinder: "Cylinder",
      cone: "Cone",
      sphere: "Sphere"
    },
    netsShapes: {
      cube: "6 equal squares",
      cuboid: "6 rectangles",
      sqPyramid: "1 square and 4 triangles",
      triPyramid: "4 triangles",
      cylinder: "1 rectangle and 2 congruent circles",
      cone: "1 circular sector and 1 circle"
    },
    countQuestions: [
      {
        q: "How many equal squares make up the flat net of a Cube?",
        correct: 6,
        unit: "squares",
        explainText: "A cube has 6 congruent square faces, so its net consists of 6 squares."
      },
      {
        q: "How many triangles are there in total in the net of a Square Pyramid?",
        correct: 4,
        unit: "triangles",
        explainText: "A square pyramid has 1 square base and 4 triangular lateral faces."
      },
      {
        q: "How many triangles make up the net of a Triangular Pyramid (Tetrahedron)?",
        correct: 4,
        unit: "triangles",
        explainText: "A triangular pyramid consists of 4 triangles (1 triangular base ＋ 3 lateral faces)."
      },
      {
        q: "How many circular disks (bases) does the net of a Cylinder have?",
        correct: 2,
        unit: "circles",
        explainText: "A cylinder has 2 identical circular disks (top and bottom bases)."
      },
      {
        q: "How many rectangles make up the net of a Rectangular Prism?",
        correct: 6,
        unit: "rectangles",
        explainText: "A rectangular prism consists of 6 rectangular faces (opposite pairs are equal)."
      }
    ],
    descPool: [
      {
        desc: "1 rectangle and 2 congruent circular disks",
        correctKey: "cylinder",
        wrongKeys: ["cone", "cube", "sphere"]
      },
      {
        desc: "1 circular sector (fan shape) and 1 circular disk",
        correctKey: "cone",
        wrongKeys: ["cylinder", "sqPyramid", "sphere"]
      },
      {
        desc: "1 square and 4 isosceles triangles",
        correctKey: "sqPyramid",
        wrongKeys: ["triPyramid", "cube", "cuboid"]
      },
      {
        desc: "4 equilateral triangles",
        correctKey: "triPyramidAlt",
        wrongKeys: ["sqPyramid", "cube", "cone"]
      },
      {
        desc: "6 congruent squares arranged appropriately",
        correctKey: "cube",
        wrongKeys: ["cuboid", "sqPyramid", "cylinder"]
      }
    ],
    trueFalsePool: [
      {
        q: "A sphere has a 2D net consisting of 2 circles.",
        correct: "False",
        explain: "A sphere has no flat 2D net because its surface curves simultaneously in all directions."
      },
      {
        q: "The net of a cylinder consists of 1 rectangle and 2 circles.",
        correct: "True",
        explain: "The rectangle wraps around to form the lateral body between the 2 circular bases."
      },
      {
        q: "All valid nets of a cube contain exactly 6 squares.",
        correct: "True",
        explain: "A cube has 6 square faces, so every valid net consists of 6 squares."
      },
      {
        q: "On 2D nets, dashed lines show where we must cut with scissors.",
        correct: "False",
        explain: "Dashed lines indicate folding creases, whereas solid lines are cutting outlines."
      },
      {
        q: "The net of a cone consists of a circular sector and a circle.",
        correct: "True",
        explain: "The circular sector forms the lateral curved surface and the circle forms the base."
      },
      {
        q: "The net of a square pyramid contains 5 triangles.",
        correct: "False",
        explain: "The net of a square pyramid has 1 square (base) and 4 triangles (lateral faces)."
      }
    ]
  }
};

// SVG Αναπτύγματα
const NETS_SVGS = {
  cube: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <rect x="75" y="20" width="40" height="40" fill="#60a5fa" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="2" />
      <rect x="75" y="60" width="40" height="40" fill="#3b82f6" fillOpacity="0.45" stroke="#1d4ed8" strokeWidth="2" />
      <rect x="35" y="60" width="40" height="40" fill="#93c5fd" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="2" />
      <rect x="115" y="60" width="40" height="40" fill="#93c5fd" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="2" />
      <rect x="75" y="100" width="40" height="40" fill="#2563eb" fillOpacity="0.45" stroke="#1d4ed8" strokeWidth="2" />
      <rect x="75" y="140" width="40" height="40" fill="#1d4ed8" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="2" />
      <line x1="75" y1="60" x2="115" y2="60" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      <line x1="75" y1="100" x2="115" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      <line x1="75" y1="140" x2="115" y2="140" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      <line x1="75" y1="60" x2="75" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      <line x1="115" y1="60" x2="115" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
    </svg>
  ),
  cuboid: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <rect x="63" y="16" width="74" height="26" fill="#2dd4bf" fillOpacity="0.45" stroke="#0f766e" strokeWidth="2" />
      <rect x="63" y="42" width="74" height="38" fill="#14b8a6" fillOpacity="0.55" stroke="#0f766e" strokeWidth="2" />
      <rect x="37" y="42" width="26" height="38" fill="#5eead4" fillOpacity="0.35" stroke="#0f766e" strokeWidth="2" />
      <rect x="137" y="42" width="26" height="38" fill="#5eead4" fillOpacity="0.35" stroke="#0f766e" strokeWidth="2" />
      <rect x="63" y="80" width="74" height="26" fill="#0d9488" fillOpacity="0.55" stroke="#0f766e" strokeWidth="2" />
      <rect x="63" y="106" width="74" height="38" fill="#0f766e" fillOpacity="0.45" stroke="#0f766e" strokeWidth="2" />
      <line x1="63" y1="42" x2="137" y2="42" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      <line x1="63" y1="80" x2="137" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      <line x1="63" y1="106" x2="137" y2="106" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      <line x1="63" y1="42" x2="63" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      <line x1="137" y1="42" x2="137" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
    </svg>
  ),
  sqPyramid: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <rect x="75" y="75" width="50" height="50" fill="#fbbf24" fillOpacity="0.45" stroke="#b45309" strokeWidth="2" />
      <polygon points="75,75 125,75 100,25" fill="#f59e0b" fillOpacity="0.35" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="75,125 125,125 100,175" fill="#f59e0b" fillOpacity="0.35" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="75,75 75,125 25,100" fill="#d97706" fillOpacity="0.35" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="125,75 125,125 175,100" fill="#d97706" fillOpacity="0.35" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
      <rect x="75" y="75" width="50" height="50" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
    </svg>
  ),
  triPyramid: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <polygon points="100,30 35,145 165,145" fill="#fda4af" fillOpacity="0.25" stroke="#be123c" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="67.5,87.5 132.5,87.5 100,145" fill="#f43f5e" fillOpacity="0.5" stroke="#be123c" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="67.5,87.5 132.5,87.5 100,145" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
    </svg>
  ),
  cylinder: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <circle cx="100" cy="38" r="22" fill="#a78bfa" fillOpacity="0.5" stroke="#6d28d9" strokeWidth="2" />
      <rect x="40" y="65" width="120" height="70" rx="2" fill="#8b5cf6" fillOpacity="0.35" stroke="#6d28d9" strokeWidth="2" />
      <circle cx="100" cy="162" r="22" fill="#a78bfa" fillOpacity="0.5" stroke="#6d28d9" strokeWidth="2" />
      <circle cx="100" cy="65" r="3" fill="#f59e0b" />
      <circle cx="100" cy="135" r="3" fill="#f59e0b" />
    </svg>
  ),
  cone: (
    <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
      <path d="M 100,25 L 35,95 A 95,95 0 0,0 165,95 Z" fill="#06b6d4" fillOpacity="0.35" stroke="#0e7490" strokeWidth="2.5" />
      <circle cx="100" cy="144" r="24" fill="#67e8f9" fillOpacity="0.55" stroke="#0e7490" strokeWidth="2.5" />
      <circle cx="100" cy="25" r="3.5" fill="#fbbf24" />
      <circle cx="100" cy="120" r="3" fill="#f59e0b" />
    </svg>
  )
};

const BASE_NETS = [
  { key: 'cube' },
  { key: 'cuboid' },
  { key: 'sqPyramid' },
  { key: 'triPyramid' },
  { key: 'cylinder' },
  { key: 'cone' }
];

function makeRecognitionForSolid(solidKey, t) {
  const correctName = t.solids[solidKey];
  const allKeys = ['cube', 'cuboid', 'sqPyramid', 'triPyramid', 'cylinder', 'cone', 'sphere'];
  const wrongKeys = allKeys.filter((k) => k !== solidKey);
  const shuffledWrongKeys = [...wrongKeys].sort(() => Math.random() - 0.5).slice(0, 3);
  const shuffledWrongs = shuffledWrongKeys.map((k) => t.solids[k]);
  const rawOptions = [correctName, ...shuffledWrongs].sort(() => Math.random() - 0.5);
  const options = [...new Set(rawOptions)];

  return {
    q: t.qNetRecognitionTitle,
    svg: NETS_SVGS[solidKey],
    options,
    correct: correctName,
    explainText: t.qNetRecognitionExplain(t.netsShapes[solidKey], correctName)
  };
}

// Δημιουργία 8 Ερωτήσεων ΧΩΡΙΣ ΕΠΑΝΑΛΗΨΕΙΣ
function generateQuestions(t) {
  // 1. Επιλογή 2 διαφορετικών στερεών για Q1 και Q2
  const shuffledNets = [...BASE_NETS].sort(() => Math.random() - 0.5);
  const q1 = makeRecognitionForSolid(shuffledNets[0].key, t);
  const q2 = makeRecognitionForSolid(shuffledNets[1].key, t);

  // 2. Επιλογή 2 διαφορετικών ερωτήσεων καταμέτρησης για Q3 και Q4
  const shuffledCounts = [...t.countQuestions].sort(() => Math.random() - 0.5);
  const q3 = shuffledCounts[0];
  const q4 = shuffledCounts[1];

  // 3. Επιλογή 2 διαφορετικών ερωτήσεων περιγραφής για Q5 και Q6
  const shuffledDesc = [...t.descPool].sort(() => Math.random() - 0.5);
  const makeDescQuestion = (item) => {
    const correct = t.solids[item.correctKey];
    const wrongs = item.wrongKeys.map((k) => t.solids[k]);
    const rawOptions = [correct, ...wrongs].sort(() => Math.random() - 0.5);
    const options = [...new Set(rawOptions)];
    return {
      q: t.qDescTitle(item.desc),
      options,
      correct,
      explainText: t.qDescExplain(correct)
    };
  };
  const q5 = makeDescQuestion(shuffledDesc[0]);
  const q6 = makeDescQuestion(shuffledDesc[1]);

  // 4. Επιλογή 2 διαφορετικών ερωτήσεων Σωστό/Λάθος για Q7 και Q8
  const shuffledTF = [...t.trueFalsePool].sort(() => Math.random() - 0.5);
  const q7 = shuffledTF[0];
  const q8 = shuffledTF[1];

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function StereaAnoigmaAskPage() {
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

  // Render MCQ Ασκήσεων με SVG (Q1 & Q2)
  const renderSvgMCQQuestion = (qKey, qData, numLabel) => {
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

  // Render MCQ Λεκτικών Ασκήσεων (Q5 & Q6)
  const renderTextMCQQuestion = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-amber-500 text-slate-950 font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {formatNumber(numLabel)}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/80 font-bold text-amber-950 shadow-sm'
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
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500 shrink-0"
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
          href="/d-dimotikou/28-sterea-anoigma"
          className="bg-teal-100 hover:bg-teal-200 text-teal-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badgeHeader)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 {t.headerTitle}
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm md:text-base">
              {t.headerDesc}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-teal-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderSvgMCQQuestion('q1', questions.q1, 1)}
          {renderSvgMCQQuestion('q2', questions.q2, 2)}

          {renderInputNumber('q3', questions.q3, 3)}
          {renderInputNumber('q4', questions.q4, 4)}

          {renderTextMCQQuestion('q5', questions.q5, 5)}
          {renderTextMCQQuestion('q6', questions.q6, 6)}

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
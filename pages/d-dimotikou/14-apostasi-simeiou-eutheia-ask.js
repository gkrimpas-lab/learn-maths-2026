// pages/d-dimotikou/14-apostasi-simeiou-eutheia-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Συνάρτηση μετατροπής σε άτονα ελληνικά κεφαλαία με εξαίρεση το "Δ'"
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

// ----------------------------------------------------
// ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ ΜΕΤΑΦΡΑΣΕΩΝ i18n
// ----------------------------------------------------
const TRANSLATIONS = {
  el: {
    metaTitle: "Ασκήσεις: Απόσταση Σημείου από Ευθεία | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στην απόσταση σημείου από ευθεία: αναγνώριση κάθετου τμήματος, σύγκριση με πλάγια τμήματα και θεωρητικές ιδιότητες.",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "📝 Ασκήσεις: Απόσταση Σημείου από Ευθεία",
    heroDesc: "Πατώντας «Νέες Ασκήσεις», τα σχήματα και οι αριθμοί ανανεώνονται αυτόματα από τη δεξαμενή!",
    newExercisesBtn: "🔄 Νέες Ασκήσεις",
    checkAnswersBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "🏆 Σκορ:",
    successRate: "Επιτυχία:",
    footerPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctAnswerIs: "Η σωστή απάντηση είναι:",
    correctSymbolIs: "Το ορθό σύμβολο είναι το",
    correctAnswerIsShort: "Η ορθή απάντηση είναι",
    comparePrompt: "Σύγκρινε το μήκος του κάθετου τμήματος με το πλάγιο τμήμα ( ＜ , ＝ , ＞ ):",
    perpLabel: "Κάθετο (ΑΗ)",
    obliqueLabel: "Πλάγιο (ΑΖ)",
    trueOption: "Σωστό",
    falseOption: "Λάθος",
    lineLabel: "ε",
    pointA_Label: "Α",
    pointH_Label: "Η",
    pointZ_Label: "Ζ",
    pointK_Label: "Κ",
    pointM_Label: "Μ",
    pointN_Label: "Ν"
  },
  en: {
    metaTitle: "Exercises: Distance from a Point to a Line | LearnMaths.gr",
    metaDesc: "Interactive 4th-grade math exercises on the distance of a point to a line: recognizing perpendicular segments, comparing with oblique segments, and key properties.",
    backText: "Grade 4",
    theoryBtn: "Theory",
    gradeBadge: "GRADE 4 • PRACTICE",
    heroTitle: "📝 Exercises: Distance of a Point to a Line",
    heroDesc: "By clicking \"New Exercises\", geometric figures and numbers regenerate dynamically from the pool!",
    newExercisesBtn: "🔄 New Exercises",
    checkAnswersBtn: "🎯 Check Answers",
    scoreLabel: "🏆 Score:",
    successRate: "Score:",
    footerPrompt: "Answer the questions and click \"Check Answers\"!",
    correctAnswerIs: "The correct answer is:",
    correctSymbolIs: "The correct symbol is",
    correctAnswerIsShort: "The correct answer is",
    comparePrompt: "Compare the length of the perpendicular segment with the oblique segment ( ＜ , ＝ , ＞ ):",
    perpLabel: "Perpendicular (AH)",
    obliqueLabel: "Oblique (AZ)",
    trueOption: "True",
    falseOption: "False",
    lineLabel: "L",
    pointA_Label: "A",
    pointH_Label: "H",
    pointZ_Label: "Z",
    pointK_Label: "K",
    pointM_Label: "M",
    pointN_Label: "N"
  }
};

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΕΡΩΤΗΣΕΩΝ (POOLS)
// ----------------------------------------------------

// Pool Κατηγορίας 1: Σχήματα SVG
const SHAPE_POOL = [
  {
    id: 'shape_distance_segment',
    q: {
      el: 'Ποιο από τα παρακάτω ευθύγραμμα τμήματα εκφράζει την ΑΠΟΣΤΑΣΗ του σημείου Α από την ευθεία (ε);',
      en: 'Which of the following line segments represents the DISTANCE from point A to line (L)?'
    },
    correct: {
      el: 'Το κάθετο τμήμα ΑΗ',
      en: 'The perpendicular segment AH'
    },
    wrongs: {
      el: ['Το πλάγιο τμήμα ΑΖ', 'Το πλάγιο τμήμα ΑΚ', 'Κανένα από τα τρία'],
      en: ['The oblique segment AZ', 'The oblique segment AK', 'None of the three']
    },
    explainText: {
      el: 'Η απόσταση ορίζεται αποκλειστικά από το κάθετο ευθύγραμμο τμήμα ΑΗ, το οποίο σχηματίζει ορθή γωνία (90°) με την ευθεία.',
      en: 'The distance is defined strictly by the perpendicular line segment AH, which forms a 90° right angle with the line.'
    },
    renderSvg: (t) => (
      <svg className="w-56 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 240 120">
        <line x1="20" y1="90" x2="220" y2="90" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
        <text x="205" y="82" fill="#60a5fa" fontWeight="900" fontSize="13" fontFamily="sans-serif">{t.lineLabel}</text>

        {/* Κάθετος ΑΗ */}
        <line x1="120" y1="20" x2="120" y2="90" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 120 76 L 132 76 L 132 90" fill="none" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="120" cy="90" r="3.5" fill="#10b981" />
        <text x="125" y="106" fill="#34d399" fontWeight="900" fontSize="12" fontFamily="sans-serif">{t.pointH_Label}</text>

        {/* Πλάγιες ΑΖ, ΑΚ */}
        <line x1="120" y1="20" x2="60" y2="90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        <circle cx="60" cy="90" r="3" fill="#94a3b8" />
        <text x="54" y="106" fill="#94a3b8" fontWeight="700" fontSize="12" fontFamily="sans-serif">{t.pointZ_Label}</text>

        <line x1="120" y1="20" x2="180" y2="90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        <circle cx="180" cy="90" r="3" fill="#94a3b8" />
        <text x="178" y="106" fill="#94a3b8" fontWeight="700" fontSize="12" fontFamily="sans-serif">{t.pointK_Label}</text>

        {/* Σημείο Α */}
        <circle cx="120" cy="20" r="5" fill="#f43f5e" />
        <text x="114" y="12" fill="#f43f5e" fontWeight="900" fontSize="15" fontFamily="sans-serif">{t.pointA_Label}</text>
      </svg>
    )
  },
  {
    id: 'shape_shortest_segment',
    q: {
      el: 'Στο παρακάτω σχήμα, το τμήμα ΑΗ είναι κάθετο στην ευθεία (ε). Ποιο τμήμα είναι το πιο ΣΥΝΤΟΜΟ (μικρότερο σε μήκος);',
      en: 'In the figure below, segment AH is perpendicular to line (L). Which segment is the SHORTEST in length?'
    },
    correct: {
      el: 'Το κάθετο τμήμα ΑΗ',
      en: 'The perpendicular segment AH'
    },
    wrongs: {
      el: ['Το πλάγιο τμήμα ΑΜ', 'Το πλάγιο τμήμα ΑΝ', 'Όλα έχουν ακριβώς το ίδιο μήκος'],
      en: ['The oblique segment AM', 'The oblique segment AN', 'All have the exact same length']
    },
    explainText: {
      el: 'Το κάθετο ευθύγραμμο τμήμα ΑΗ αποτελεί πάντοτε τη συντομότερη διαδρομή από το σημείο προς την ευθεία.',
      en: 'The perpendicular line segment AH is always the shortest route from the point to the line.'
    },
    renderSvg: (t) => (
      <svg className="w-56 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 240 120">
        <line x1="20" y1="90" x2="220" y2="90" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
        <text x="205" y="82" fill="#60a5fa" fontWeight="900" fontSize="13" fontFamily="sans-serif">{t.lineLabel}</text>

        {/* Κάθετος ΑΗ */}
        <line x1="80" y1="20" x2="80" y2="90" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 80 76 L 92 76 L 92 90" fill="none" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="80" cy="90" r="3.5" fill="#10b981" />
        <text x="74" y="106" fill="#34d399" fontWeight="900" fontSize="12" fontFamily="sans-serif">{t.pointH_Label}</text>

        {/* Πλάγιες ΑΜ, ΑΝ */}
        <line x1="80" y1="20" x2="140" y2="90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        <circle cx="140" cy="90" r="3" fill="#94a3b8" />
        <text x="138" y="106" fill="#94a3b8" fontWeight="700" fontSize="12" fontFamily="sans-serif">{t.pointM_Label}</text>

        <line x1="80" y1="20" x2="190" y2="90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
        <circle cx="190" cy="90" r="3" fill="#94a3b8" />
        <text x="188" y="106" fill="#94a3b8" fontWeight="700" fontSize="12" fontFamily="sans-serif">{t.pointN_Label}</text>

        {/* Σημείο Α */}
        <circle cx="80" cy="20" r="5" fill="#f43f5e" />
        <text x="74" y="12" fill="#f43f5e" fontWeight="900" fontSize="15" fontFamily="sans-serif">{t.pointA_Label}</text>
      </svg>
    )
  }
];

// Pool Κατηγορίας 2: Θεωρητικές Ιδιότητες
const PROPERTIES_POOL = [
  {
    id: 'prop_angle_type',
    q: {
      el: 'Τι είδους γωνία σχηματίζει το ευθύγραμμο τμήμα της απόστασης ενός σημείου με την ευθεία;',
      en: 'What type of angle does the distance line segment form with the line?'
    },
    correct: {
      el: 'Ορθή γωνία (90°)',
      en: 'Right angle (90°)'
    },
    wrongs: {
      el: ['Οξεία γωνία (λιγότερο από 90°)', 'Αμβλεία γωνία (περισσότερο από 90°)', 'Ευθεία γωνία (180°)'],
      en: ['Acute angle (less than 90°)', 'Obtuse angle (greater than 90°)', 'Straight angle (180°)']
    },
    explainText: {
      el: 'Το τμήμα της απόστασης είναι πάντοτε κάθετο στην ευθεία, άρα σχηματίζει γωνία ακριβώς 90°.',
      en: 'The distance segment is always perpendicular to the line, forming an exact 90° angle.'
    }
  },
  {
    id: 'prop_instrument',
    q: {
      el: 'Ποιο γεωμετρικό όργανο χρησιμοποιούμε απαραίτητα για να φέρουμε την κάθετη γραμμή από ένα σημείο σε μια ευθεία;',
      en: 'Which drawing tool is essential to construct the perpendicular line from a point to a line?'
    },
    correct: {
      el: 'Τον γνώμονα',
      en: 'The set square'
    },
    wrongs: {
      el: ['Μόνο τον χάρακα', 'Μόνο τον διαβήτη', 'Το μοιρογνωμόνιο'],
      en: ['Only the straightedge ruler', 'Only the compass', 'The protractor']
    },
    explainText: {
      el: 'Ο γνώμονας μας εξασφαλίζει τη σχεδίαση ορθής γωνίας (90°) ανάμεσα στο σημείο και την ευθεία.',
      en: 'The set square guarantees drawing an accurate 90° right angle between the point and the line.'
    }
  },
  {
    id: 'prop_shortest_among_5',
    q: {
      el: 'Αν φέρουμε από ένα σημείο Α προς μια ευθεία 5 διαφορετικά ευθύγραμμα τμήματα, ποιο θα έχει πάντοτε το ΜΙΚΡΟΤΕΡΟ μήκος;',
      en: 'If we draw 5 different line segments from point A to a line, which one will always have the SHORTEST length?'
    },
    correct: {
      el: 'Το κάθετο τμήμα',
      en: 'The perpendicular segment'
    },
    wrongs: {
      el: ['Το πιο πλάγιο τμήμα', 'Το τμήμα που καταλήγει πιο δεξιά', 'Όλα θα έχουν ακριβώς το ίδιο μήκος'],
      en: ['The most oblique segment', 'The segment ending furthest to the right', 'All will have the exact same length']
    },
    explainText: {
      el: 'Στη γεωμετρία, το κάθετο τμήμα είναι αυστηρά η συντομότερη διαδρομή από ένα σημείο προς μια ευθεία.',
      en: 'In geometry, the perpendicular segment is strictly the shortest path from a point to a line.'
    }
  },
  {
    id: 'prop_foot_point',
    q: {
      el: 'Πώς ονομάζεται το σημείο Η στο οποίο η κάθετος από το σημείο Α συναντά την ευθεία;',
      en: 'What is the name of point H where the perpendicular from point A meets the line?'
    },
    correct: {
      el: 'Ίχνος της καθέτου',
      en: 'Foot of the perpendicular'
    },
    wrongs: {
      el: ['Κορυφή της ευθείας', 'Κέντρο απόστασης', 'Σημείο τομής πλάγιων'],
      en: ['Vertex of the line', 'Distance center', 'Oblique intersection point']
    },
    explainText: {
      el: 'Το σημείο επαφής της καθέτου πάνω στην ευθεία ονομάζεται ίχνος της καθέτου.',
      en: 'The point where the perpendicular meets the line is called the foot of the perpendicular.'
    }
  }
];

// Pool Κατηγορίας 3: Σύγκριση Μηκών
function makeComparisonQuestion(prevQuestion = null) {
  let ah, az;
  while (true) {
    ah = getRandomInt(3, 12);
    az = ah + getRandomInt(2, 6);
    if (!prevQuestion || prevQuestion.ah !== ah) break;
  }

  return {
    ah,
    az,
    correct: '＜',
    getRenderData: (t) => ({
      exprA: `${t.perpLabel} ＝ ${ah} cm`,
      exprB: `${t.obliqueLabel} ＝ ${az} cm`,
      explainText: `${t.perpLabel} ${ah} cm ＜ ${az} cm.`
    })
  };
}

// Pool Κατηγορίας 4: Σωστό / Λάθος
const TRUE_FALSE_POOL = [
  {
    id: 'tf_shortest_path',
    q: {
      el: 'Η απόσταση ενός σημείου από μια ευθεία είναι η συντομότερη δυνατή διαδρομή ανάμεσά τους.',
      en: 'The distance from a point to a line is the shortest possible path between them.'
    },
    correctBoolean: true,
    explain: {
      el: 'Το κάθετο ευθύγραμμο τμήμα έχει πάντοτε το μικρότερο δυνατό μήκος.',
      en: 'The perpendicular line segment always has the smallest possible length.'
    }
  },
  {
    id: 'tf_oblique_measurement',
    q: {
      el: 'Μπορούμε να μετρήσουμε την απόσταση ενός σημείου από μια ευθεία φέρνοντας μια οποιαδήποτε πλάγια γραμμή.',
      en: 'We can measure the distance from a point to a line by drawing any oblique line.'
    },
    correctBoolean: false,
    explain: {
      el: 'Η απόσταση μετριέται αποκλειστικά και μόνο κατά μήκος του κάθετου ευθύγραμμου τμήματος.',
      en: 'Distance is measured exclusively along the perpendicular line segment.'
    }
  },
  {
    id: 'tf_oblique_always_greater',
    q: {
      el: 'Όλα τα πλάγια ευθύγραμμα τμήματα που ξεκινούν από το σημείο Α προς την ευθεία είναι μεγαλύτερα από το κάθετο τμήμα.',
      en: 'All oblique line segments drawn from point A to the line are strictly longer than the perpendicular segment.'
    },
    correctBoolean: true,
    explain: {
      el: 'Κάθε πλάγιο τμήμα αποτελεί υποτείνουσα σε ορθογώνιο τρίγωνο, άρα είναι πάντα μεγαλύτερο από την κάθετη απόσταση.',
      en: 'Every oblique segment forms the hypotenuse of a right triangle, so it is always longer than the perpendicular distance.'
    }
  },
  {
    id: 'tf_point_on_line',
    q: {
      el: 'Αν ένα σημείο Α βρίσκεται ήδη πάνω στην ευθεία (ε), τότε η απόστασή του από την ευθεία είναι 0 cm.',
      en: 'If a point A already lies on line (L), then its distance from the line is 0 cm.'
    },
    correctBoolean: true,
    explain: {
      el: 'Όταν το σημείο ανήκει στην ευθεία, η απόστασή του από αυτήν ισούται ακριβώς με μηδέν.',
      en: 'When a point belongs to the line, its distance from the line equals exactly zero.'
    }
  }
];

// ----------------------------------------------------
// GENERATOR 8 ΑΣΚΗΣΕΩΝ ΜΕ ΕΓΓΥΗΜΕΝΗ ΜΟΝΑΔΙΚΟΤΗΤΑ
// ----------------------------------------------------
function generateQuestions() {
  const prepareMcq = (item, isShape = false) => {
    const rawOptions = [
      { key: 'correct', isCorrect: true },
      { key: 'wrong_0', isCorrect: false },
      { key: 'wrong_1', isCorrect: false },
      { key: 'wrong_2', isCorrect: false }
    ];
    const shuffledKeys = rawOptions.sort(() => Math.random() - 0.5);

    return {
      rawItem: item,
      isShape,
      shuffledKeys,
      getRenderData: (locale, t) => {
        const questionText = item.q[locale];
        const correctText = item.correct[locale];
        const wrongList = item.wrongs[locale];
        const explain = item.explainText[locale];

        const options = shuffledKeys.map((k) => {
          if (k.key === 'correct') {
            return { id: 'correct', text: correctText, isCorrect: true };
          }
          const idx = parseInt(k.key.split('_')[1], 10);
          return { id: k.key, text: wrongList[idx], isCorrect: false };
        });

        const uniqueOptions = [...new Set(options.map((o) => o.text))].map((txt) =>
          options.find((o) => o.text === txt)
        );

        return {
          questionText,
          correctText,
          options: uniqueOptions,
          explain,
          svg: isShape ? item.renderSvg(t) : null
        };
      }
    };
  };

  // Q1 & Q2: Σχήματα
  const q1 = prepareMcq(SHAPE_POOL[0], true);
  const q2 = prepareMcq(SHAPE_POOL[1], true);

  // Q3 & Q4: Ιδιότητες
  const p1 = PROPERTIES_POOL[getRandomInt(0, PROPERTIES_POOL.length - 1)];
  let p2;
  while (true) {
    p2 = PROPERTIES_POOL[getRandomInt(0, PROPERTIES_POOL.length - 1)];
    if (p2.id !== p1.id) break;
  }

  // Q5 & Q6: Σύγκριση Μηκών
  const q5 = makeComparisonQuestion();
  const q6 = makeComparisonQuestion(q5);

  // Q7 & Q8: Σωστό / Λάθος
  const tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.id !== tf1.id) break;
  }

  return {
    q1,
    q2,
    q3: prepareMcq(p1, false),
    q4: prepareMcq(p2, false),
    q5,
    q6,
    q7: {
      rawItem: tf1,
      getRenderData: (locale) => ({
        questionText: tf1.q[locale],
        correctBoolean: tf1.correctBoolean,
        explain: tf1.explain[locale]
      })
    },
    q8: {
      rawItem: tf2,
      getRenderData: (locale) => ({
        questionText: tf2.q[locale],
        correctBoolean: tf2.correctBoolean,
        explain: tf2.explain[locale]
      })
    }
  };
}

export default function ApostasiAskPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: null, q8: null
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions());
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: null, q8: null });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, []);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    if (answers.q1 === 'correct') currentScore += 1;
    if (answers.q2 === 'correct') currentScore += 1;
    if (answers.q3 === 'correct') currentScore += 1;
    if (answers.q4 === 'correct') currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.rawItem.correctBoolean) currentScore += 1;
    if (answers.q8 === questions.q8.rawItem.correctBoolean) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render MCQ (Q1 - Q4, 4 Επιλογές)
  const renderMcqQuestion = (qKey, qObj, numLabel, colorClass) => {
    const renderData = qObj.getRenderData(locale, t);
    const isCorrect = answers[qKey] === 'correct';

    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className={`${colorClass} text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}>
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {renderData.questionText}
          </h3>
        </div>

        {renderData.svg && <div className="mb-4">{renderData.svg}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {renderData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt.id;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/80 font-bold text-teal-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${qKey}-opt-${idx}`}
                  name={qKey}
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt.id)}
                  disabled={submitted}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500 shrink-0"
                />
                <span className="break-words whitespace-normal leading-snug flex-1">{opt.text}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {renderData.explain}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctAnswerIs} <strong className="font-bold text-rose-900">{renderData.correctText}</strong>. {renderData.explain}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Σύγκριση Μηκών (Q5 & Q6)
  const renderComparison = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    const renderData = qData.getRenderData(t);

    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-indigo-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.comparePrompt}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-base sm:text-xl font-mono font-black text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-emerald-700">{renderData.exprA}</span>

            <div className="flex gap-2">
              {['＜', '＝', '＞'].map((sym) => (
                <button
                  type="button"
                  key={sym}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleInputChange(qKey, sym);
                  }}
                  disabled={submitted}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-lg sm:text-xl font-black border transition active:scale-95 touch-manipulation select-none flex items-center justify-center ${
                    answers[qKey] === sym
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>

            <span className="text-slate-600">{renderData.exprB}</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {renderData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctSymbolIs} «{qData.correct}». {renderData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Σωστό / Λάθος (Q7 & Q8)
  const renderTrueFalse = (qKey, qObj, numLabel) => {
    const renderData = qObj.getRenderData(locale);
    const isCorrect = answers[qKey] === renderData.correctBoolean;
    const correctLabel = renderData.correctBoolean ? t.trueOption : t.falseOption;

    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-amber-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {renderData.questionText}
          </h3>
        </div>

        <div className="flex gap-3 sm:pl-11">
          {[
            { val: true, label: t.trueOption },
            { val: false, label: t.falseOption }
          ].map((btn) => (
            <button
              type="button"
              key={btn.label}
              onClick={() => handleInputChange(qKey, btn.val)}
              disabled={submitted}
              className={`px-6 sm:px-8 py-3 rounded-2xl font-black text-sm sm:text-base border transition active:scale-95 touch-manipulation select-none ${
                answers[qKey] === btn.val
                  ? (btn.val ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-rose-600 text-white border-rose-700 shadow-md')
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {renderData.explain}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctAnswerIsShort} «{correctLabel}». {renderData.explain}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/14-apostasi-simeiou-eutheia"
          className="bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.gradeBadge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.heroTitle}
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm md:text-base">
              {t.heroDesc}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-teal-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {t.newExercisesBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderMcqQuestion('q1', questions.q1, 1, 'bg-teal-600')}
          {renderMcqQuestion('q2', questions.q2, 2, 'bg-teal-600')}

          {renderMcqQuestion('q3', questions.q3, 3, 'bg-emerald-600')}
          {renderMcqQuestion('q4', questions.q4, 4, 'bg-emerald-600')}

          {renderComparison('q5', questions.q5, 5)}
          {renderComparison('q6', questions.q6, 6)}

          {renderTrueFalse('q7', questions.q7, 7)}
          {renderTrueFalse('q8', questions.q8, 8)}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                {t.checkAnswersBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ΣΤΑΘΕΡΟ ΚΑΤΩ FOOTER (STICKY FOOTER BAR) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>{t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                {t.newExercisesBtn}
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.footerPrompt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
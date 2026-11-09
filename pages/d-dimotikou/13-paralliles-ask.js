// pages/d-dimotikou/13-paralliles-ask.js
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
    metaTitle: "Ασκήσεις: Παράλληλες & Τεμνόμενες Ευθείες | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στις παράλληλες, τεμνόμενες και κάθετες ευθείες: αναγνώριση σχημάτων, σύμβολα και εφαρμογές στην καθημερινότητα.",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "📝 Ασκήσεις: Παράλληλες και Τεμνόμενες Ευθείες",
    heroDesc: "Πατώντας «Νέες Ασκήσεις», τα σχήματα και οι ερωτήσεις ανανεώνονται αυτόματα από τη δεξαμενή!",
    newExercisesBtn: "🔄 Νέες Ασκήσεις",
    checkAnswersBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "🏆 Σκορ:",
    successRate: "Επιτυχία:",
    footerPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctAnswerIs: "Η σωστή απάντηση είναι:",
    correctAnswerIsShort: "Η ορθή απάντηση είναι",
    trueOption: "Σωστό",
    falseOption: "Λάθος",
    lineLabel1: "ε₁",
    lineLabel2: "ε₂",
    pointLabel: "Σ"
  },
  en: {
    metaTitle: "Exercises: Parallel & Intersecting Lines | LearnMaths.gr",
    metaDesc: "Interactive 4th-grade math exercises on parallel, intersecting, and perpendicular lines: shape recognition, symbols, and everyday real-world examples.",
    backText: "Grade 4",
    theoryBtn: "Theory",
    gradeBadge: "GRADE 4 • PRACTICE",
    heroTitle: "📝 Exercises: Parallel and Intersecting Lines",
    heroDesc: "By clicking \"New Exercises\", geometric figures and questions regenerate dynamically from the pool!",
    newExercisesBtn: "🔄 New Exercises",
    checkAnswersBtn: "🎯 Check Answers",
    scoreLabel: "🏆 Score:",
    successRate: "Score:",
    footerPrompt: "Answer the questions and click \"Check Answers\"!",
    correctAnswerIs: "The correct answer is:",
    correctAnswerIsShort: "The correct answer is",
    trueOption: "True",
    falseOption: "False",
    lineLabel1: "L₁",
    lineLabel2: "L₂",
    pointLabel: "P"
  }
};

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΕΡΩΤΗΣΕΩΝ (POOLS)
// ----------------------------------------------------

// Pool Κατηγορίας 1: Αναγνώριση από Σχήμα (SVG)
const SHAPE_POOL = [
  {
    type: 'parallel',
    question: {
      el: 'Τι είδος ευθειών απεικονίζεται στο παρακάτω γεωμετρικό σχήμα;',
      en: 'What type of lines is shown in the geometric diagram below?'
    },
    correct: {
      el: 'Παράλληλες ευθείες',
      en: 'Parallel lines'
    },
    wrongs: {
      el: ['Τεμνόμενες μη κάθετες ευθείες', 'Κάθετες ευθείες', 'Συμπίπτουσες ευθείες'],
      en: ['Intersecting non-perpendicular lines', 'Perpendicular lines', 'Coincident lines']
    },
    explainText: {
      el: 'Οι δύο ευθείες διατηρούν σταθερή απόσταση σε όλο το μήκος τους και δεν συναντιούνται ποτέ (ε₁ ∥ ε₂).',
      en: 'The two lines maintain a constant distance everywhere and never meet (L₁ ∥ L₂).'
    },
    renderSvg: (t) => (
      <svg className="w-56 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
        <line x1="20" y1="30" x2="180" y2="30" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
        <line x1="20" y1="70" x2="180" y2="70" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
        <text x="185" y="34" fill="#93c5fd" fontSize="12" fontWeight="900" fontFamily="sans-serif">{t.lineLabel1}</text>
        <text x="185" y="74" fill="#93c5fd" fontSize="12" fontWeight="900" fontFamily="sans-serif">{t.lineLabel2}</text>
      </svg>
    )
  },
  {
    type: 'intersecting',
    question: {
      el: 'Τι είδος ευθειών απεικονίζεται στο παρακάτω γεωμετρικό σχήμα;',
      en: 'What type of lines is shown in the geometric diagram below?'
    },
    correct: {
      el: 'Τεμνόμενες ευθείες',
      en: 'Intersecting lines'
    },
    wrongs: {
      el: ['Παράλληλες ευθείες', 'Κάθετες ευθείες (90°)', 'Ευθείες που δεν τέμνονται'],
      en: ['Parallel lines', 'Perpendicular lines (90°)', 'Lines that never meet']
    },
    explainText: {
      el: 'Οι δύο ευθείες διασταυρώνονται και συναντιούνται σε ένα ακριβώς κοινό σημείο, το σημείο τομής Σ.',
      en: 'The two lines cross each other and meet at exactly one common point, the intersection point P.'
    },
    renderSvg: (t) => (
      <svg className="w-56 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
        <line x1="30" y1="20" x2="170" y2="80" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
        <line x1="30" y1="80" x2="170" y2="20" stroke="#e879f9" strokeWidth="4" strokeLinecap="round" />
        <circle cx="100" cy="50" r="5" fill="#f43f5e" />
        <text x="108" y="46" fill="#f43f5e" fontSize="14" fontWeight="900" fontFamily="sans-serif">{t.pointLabel}</text>
        <text x="175" y="85" fill="#c084fc" fontSize="12" fontWeight="900" fontFamily="sans-serif">{t.lineLabel1}</text>
        <text x="175" y="24" fill="#f0abfc" fontSize="12" fontWeight="900" fontFamily="sans-serif">{t.lineLabel2}</text>
      </svg>
    )
  },
  {
    type: 'perpendicular',
    question: {
      el: 'Τι είδος ευθειών απεικονίζεται στο παρακάτω γεωμετρικό σχήμα;',
      en: 'What type of lines is shown in the geometric diagram below?'
    },
    correct: {
      el: 'Κάθετες ευθείες',
      en: 'Perpendicular lines'
    },
    wrongs: {
      el: ['Παράλληλες ευθείες', 'Τεμνόμενες μη κάθετες ευθείες', 'Ευθείες σταθερής απόστασης'],
      en: ['Parallel lines', 'Intersecting non-perpendicular lines', 'Lines of constant distance']
    },
    explainText: {
      el: 'Οι δύο ευθείες τέμνονται σχηματίζοντας ορθή γωνία 90° στο σημείο τομής τους (ε₁ ⊥ ε₂).',
      en: 'The two lines intersect forming a 90° right angle at their intersection point (L₁ ⊥ L₂).'
    },
    renderSvg: (t) => (
      <svg className="w-56 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
        <line x1="20" y1="50" x2="180" y2="50" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
        <line x1="100" y1="12" x2="100" y2="88" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
        <path d="M 100 36 L 114 36 L 114 50" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="100" cy="50" r="4.5" fill="#f43f5e" />
        <text x="86" y="66" fill="#f43f5e" fontSize="13" fontWeight="900" fontFamily="sans-serif">{t.pointLabel}</text>
        <text x="184" y="54" fill="#34d399" fontSize="12" fontWeight="900" fontFamily="sans-serif">{t.lineLabel1}</text>
        <text x="105" y="22" fill="#6ee7b7" fontSize="12" fontWeight="900" fontFamily="sans-serif">{t.lineLabel2}</text>
      </svg>
    )
  }
];

// Pool Κατηγορίας 2: Σύμβολα & Ορολογία
const SYMBOLS_POOL = [
  {
    id: 'sym_parallel',
    q: {
      el: 'Ποιο μαθηματικό σύμβολο χρησιμοποιούμε για να δηλώσουμε ότι δύο ευθείες είναι παράλληλες;',
      en: 'Which mathematical symbol do we use to state that two lines are parallel?'
    },
    correct: '∥',
    wrongs: ['⊥', '＝', '≠'],
    explainText: {
      el: 'Το σύμβολο των παράλληλων ευθειών είναι το «∥» (γράφουμε ε₁ ∥ ε₂).',
      en: 'The symbol for parallel lines is "∥" (we write L₁ ∥ L₂).'
    }
  },
  {
    id: 'sym_perp',
    q: {
      el: 'Ποιο μαθηματικό σύμβολο χρησιμοποιούμε για να δηλώσουμε ότι δύο ευθείες είναι κάθετες μεταξύ τους;',
      en: 'Which mathematical symbol do we use to state that two lines are perpendicular?'
    },
    correct: '⊥',
    wrongs: ['∥', 'Δ', '·'],
    explainText: {
      el: 'Το σύμβολο της καθετότητας είναι το «⊥» (γράφουμε ε₁ ⊥ ε₂).',
      en: 'The symbol for perpendicularity is "⊥" (we write L₁ ⊥ L₂).'
    }
  },
  {
    id: 'term_intersection_point',
    q: {
      el: 'Πώς ονομάζεται το μοναδικό κοινό σημείο στο οποίο συναντιούνται δύο τεμνόμενες ευθείες;',
      en: 'What is the name of the single common point where two intersecting lines meet?'
    },
    correct: {
      el: 'Σημείο τομής',
      en: 'Intersection point'
    },
    wrongs: {
      el: ['Σημείο επαφής', 'Κορυφή γωνίας', 'Μέσο ευθείας'],
      en: ['Point of tangency', 'Angle vertex', 'Midpoint of a line']
    },
    explainText: {
      el: 'Το σημείο διασταύρωσης δύο τεμνόμενων ευθειών ονομάζεται σημείο τομής (συμβολίζεται συνήθως με Σ).',
      en: 'The crossing point of two intersecting lines is called the intersection point (usually denoted by P).'
    }
  },
  {
    id: 'term_right_angle',
    q: {
      el: 'Τι είδους γωνία σχηματίζουν μεταξύ τους δύο κάθετες ευθείες στο σημείο τομής;',
      en: 'What type of angle do two perpendicular lines form at their point of intersection?'
    },
    correct: {
      el: 'Ορθή γωνία (90°)',
      en: 'Right angle (90°)'
    },
    wrongs: {
      el: ['Οξεία γωνία (κάτω από 90°)', 'Αμβλεία γωνία (πάνω από 90°)', 'Ευθεία γωνία (180°)'],
      en: ['Acute angle (less than 90°)', 'Obtuse angle (greater than 90°)', 'Straight angle (180°)']
    },
    explainText: {
      el: 'Δύο ευθείες είναι κάθετες όταν τέμνονται σχηματίζοντας ακριβώς ορθές γωνίες 90°.',
      en: 'Two lines are perpendicular when they intersect forming exact 90° right angles.'
    }
  }
];

// Pool Κατηγορίας 3: Καθημερινή Ζωή
const REAL_LIFE_POOL = [
  {
    id: 'notebook_lines',
    q: {
      el: 'Οι οριζόντιες γραμμές ενός ριγέ σχολικού τετραδίου είναι χαρακτηριστικό παράδειγμα:',
      en: 'The horizontal lines of a lined school notebook are a classic example of:'
    },
    correct: {
      el: 'Παράλληλων ευθειών',
      en: 'Parallel lines'
    },
    wrongs: {
      el: ['Τεμνόμενων μη κάθετων ευθειών', 'Κάθετων ευθειών', 'Τεθλασμένων γραμμών'],
      en: ['Intersecting non-perpendicular lines', 'Perpendicular lines', 'Broken zigzag lines']
    },
    explainText: {
      el: 'Οι γραμμές του τετραδίου διατηρούν ίση απόσταση και δεν τέμνονται ποτέ, άρα είναι παράλληλες.',
      en: 'The lines of the notebook maintain equal distance and never cross, so they are parallel.'
    }
  },
  {
    id: 'train_rails',
    q: {
      el: 'Οι δύο σιδηροτροχιές (ράγες) στις οποίες κινείται ένα τρένο αποτελούν παράδειγμα:',
      en: 'The two railway rails on which a train runs are an example of:'
    },
    correct: {
      el: 'Παράλληλων ευθειών',
      en: 'Parallel lines'
    },
    wrongs: {
      el: ['Τεμνόμενων ευθειών', 'Κάθετων ευθειών', 'Καμπύλων γραμμών'],
      en: ['Intersecting lines', 'Perpendicular lines', 'Curved lines']
    },
    explainText: {
      el: 'Οι ράγες του τρένου έχουν πάντοτε σταθερή απόσταση μεταξύ τους ώστε να κινείται με ασφάλεια ο συρμός.',
      en: 'Train tracks maintain a constant distance between them so the train can travel safely.'
    }
  },
  {
    id: 'clock_hands_3',
    q: {
      el: 'Οι δύο δείκτες ενός αναλογικού ρολογιού όταν η ώρα δείχνει ακριβώς 3:00 είναι:',
      en: 'The two hands of an analog clock when the time is exactly 3:00 are:'
    },
    correct: {
      el: 'Κάθετες ευθείες',
      en: 'Perpendicular lines'
    },
    wrongs: {
      el: ['Παράλληλες ευθείες', 'Τεμνόμενες μη κάθετες ευθείες', 'Συμπίπτουσες ευθείες'],
      en: ['Parallel lines', 'Intersecting non-perpendicular lines', 'Coincident lines']
    },
    explainText: {
      el: 'Στις 3:00 ο ωροδείκτης και ο λεπτοδείκτης σχηματίζουν ακριβώς ορθή γωνία 90°, άρα είναι κάθετοι.',
      en: 'At 3:00, the hour hand and minute hand form an exact 90° right angle, so they are perpendicular.'
    }
  },
  {
    id: 'crossroads',
    q: {
      el: 'Η διασταύρωση δύο δρόμων σε ένα σταυροδρόμι θυμίζει γεωμετρικά:',
      en: 'The junction of two roads at an intersection resembles geometrically:'
    },
    correct: {
      el: 'Τεμνόμενες ευθείες',
      en: 'Intersecting lines'
    },
    wrongs: {
      el: ['Παράλληλες ευθείες', 'Ευθείες που δεν συναντιούνται', 'Κυκλικές τροχιές'],
      en: ['Parallel lines', 'Lines that never meet', 'Circular paths']
    },
    explainText: {
      el: 'Δύο δρόμοι που διασταυρώνονται συναντιούνται σε κοινό σημείο, ακριβώς όπως οι τεμνόμενες ευθείες.',
      en: 'Two crossing roads meet at a shared point, just like intersecting lines.'
    }
  },
  {
    id: 'blackboard_opposite_sides',
    q: {
      el: 'Οι απέναντι πλευρές ενός ορθογώνιου πίνακα στην τάξη είναι μεταξύ τους:',
      en: 'The opposite sides of a rectangular classroom whiteboard are:'
    },
    correct: {
      el: 'Παράλληλες ευθείες',
      en: 'Parallel lines'
    },
    wrongs: {
      el: ['Κάθετες ευθείες', 'Τεμνόμενες σε μία γωνία', 'Τυχαίες ευθείες'],
      en: ['Perpendicular lines', 'Intersecting at a corner', 'Random skew lines']
    },
    explainText: {
      el: 'Σε κάθε ορθογώνιο, οι απέναντι πλευρές είναι παράλληλες και ίσες μεταξύ τους.',
      en: 'In every rectangle, the opposite sides are parallel and equal in length.'
    }
  },
  {
    id: 'door_adjacent_sides',
    q: {
      el: 'Οι δύο διπλανές (διαδοχικές) πλευρές μιας πόρτας που ενώνονται σε μια γωνία είναι:',
      en: 'The two adjacent sides of a rectangular door meeting at a corner are:'
    },
    correct: {
      el: 'Κάθετες ευθείες',
      en: 'Perpendicular lines'
    },
    wrongs: {
      el: ['Παράλληλες ευθείες', 'Ευθείες που δεν τέμνονται', 'Ευθείες με οξεία γωνία'],
      en: ['Parallel lines', 'Lines that never intersect', 'Lines with an acute angle']
    },
    explainText: {
      el: 'Οι διαδοχικές πλευρές μιας πόρτας σχηματίζουν ορθή γωνία 90°, συνεπώς είναι κάθετες.',
      en: 'The adjacent sides of a door form a 90° right angle, hence they are perpendicular.'
    }
  }
];

// Pool Κατηγορίας 4: Σωστό / Λάθος
const TRUE_FALSE_POOL = [
  {
    id: 'tf_parallel_infinity',
    q: {
      el: 'Δύο παράλληλες ευθείες θα συναντηθούν σε κάποιο σημείο αν τις προεκτείνουμε πάρα πολύ.',
      en: 'Two parallel lines will eventually meet at some point if extended far enough.'
    },
    correctBoolean: false,
    explain: {
      el: 'Οι παράλληλες ευθείες δεν συναντιούνται ποτέ, ανεξάρτητα από το πόσο μακριά τις προεκτείνουμε.',
      en: 'Parallel lines never meet, no matter how far they are extended.'
    }
  },
  {
    id: 'tf_perp_special_case',
    q: {
      el: 'Οι κάθετες ευθείες αποτελούν μια ειδική κατηγορία τεμνόμενων ευθειών.',
      en: 'Perpendicular lines are a special case of intersecting lines.'
    },
    correctBoolean: true,
    explain: {
      el: 'Οι κάθετες ευθείες τέμνονται σε ένα σημείο και σχηματίζουν ορθή γωνία (90°).',
      en: 'Perpendicular lines intersect at one point and form a 90° right angle.'
    }
  },
  {
    id: 'tf_intersecting_multiple_points',
    q: {
      el: 'Δύο τεμνόμενες ευθείες μπορούν να συναντηθούν σε 2 ή περισσότερα διαφορετικά σημεία.',
      en: 'Two intersecting lines can meet at 2 or more different points.'
    },
    correctBoolean: false,
    explain: {
      el: 'Δύο ευθείες στο επίπεδο μπορούν να συναντηθούν το πολύ σε ένα μοναδικό σημείο τομής.',
      en: 'Two distinct straight lines in a plane can meet at at most one single point of intersection.'
    }
  },
  {
    id: 'tf_parallel_distance',
    q: {
      el: 'Η απόσταση ανάμεσα σε δύο παράλληλες ευθείες παραμένει πάντοτε η ίδια σε όλα τα σημεία.',
      en: 'The distance between two parallel lines always remains constant at all points.'
    },
    correctBoolean: true,
    explain: {
      el: 'Η σταθερή απόσταση είναι η βασική ιδιότητα που διακρίνει τις παράλληλες ευθείες.',
      en: 'Constant distance is the defining property that characterizes parallel lines.'
    }
  }
];

// ----------------------------------------------------
// GENERATOR 8 ΑΣΚΗΣΕΩΝ ΜΕ ΕΓΓΥΗΜΕΝΗ ΜΟΝΑΔΙΚΟΤΗΤΑ
// ----------------------------------------------------
function generateQuestions() {
  // Q1 & Q2: Σχήματα (SVG)
  const s1 = SHAPE_POOL[getRandomInt(0, SHAPE_POOL.length - 1)];
  let s2;
  while (true) {
    s2 = SHAPE_POOL[getRandomInt(0, SHAPE_POOL.length - 1)];
    if (s2.type !== s1.type) break;
  }

  // Q3 & Q4: Σύμβολα
  const sym1 = SYMBOLS_POOL[getRandomInt(0, SYMBOLS_POOL.length - 1)];
  let sym2;
  while (true) {
    sym2 = SYMBOLS_POOL[getRandomInt(0, SYMBOLS_POOL.length - 1)];
    if (sym2.id !== sym1.id) break;
  }

  // Q5 & Q6: Καθημερινή ζωή
  const r1 = REAL_LIFE_POOL[getRandomInt(0, REAL_LIFE_POOL.length - 1)];
  let r2;
  while (true) {
    r2 = REAL_LIFE_POOL[getRandomInt(0, REAL_LIFE_POOL.length - 1)];
    if (r2.id !== r1.id) break;
  }

  // Q7 & Q8: Σωστό / Λάθος
  const tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.id !== tf1.id) break;
  }

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
        const questionText = item.question ? item.question[locale] : item.q[locale];
        const correctText = typeof item.correct === 'object' ? item.correct[locale] : item.correct;
        const wrongList = typeof item.wrongs === 'object' && !Array.isArray(item.wrongs)
          ? item.wrongs[locale]
          : item.wrongs;
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

  return {
    q1: prepareMcq(s1, true),
    q2: prepareMcq(s2, true),
    q3: prepareMcq(sym1, false),
    q4: prepareMcq(sym2, false),
    q5: prepareMcq(r1, false),
    q6: prepareMcq(r2, false),
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

export default function ParallilesAskPage() {
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
    if (answers.q5 === 'correct') currentScore += 1;
    if (answers.q6 === 'correct') currentScore += 1;
    if (answers.q7 === questions.q7.rawItem.correctBoolean) currentScore += 1;
    if (answers.q8 === questions.q8.rawItem.correctBoolean) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render MCQ Ασκήσεων (Q1 - Q6, 4 Επιλογές)
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
                    ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-sm'
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
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0"
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
          href="/d-dimotikou/13-paralliles"
          className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
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
              {toCleanUppercase(t.gradeBadge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.heroTitle}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              {t.heroDesc}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-blue-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {t.newExercisesBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderMcqQuestion('q1', questions.q1, 1, 'bg-blue-600')}
          {renderMcqQuestion('q2', questions.q2, 2, 'bg-blue-600')}

          {renderMcqQuestion('q3', questions.q3, 3, 'bg-indigo-600')}
          {renderMcqQuestion('q4', questions.q4, 4, 'bg-indigo-600')}

          {renderMcqQuestion('q5', questions.q5, 5, 'bg-purple-600')}
          {renderMcqQuestion('q6', questions.q6, 6, 'bg-purple-600')}

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
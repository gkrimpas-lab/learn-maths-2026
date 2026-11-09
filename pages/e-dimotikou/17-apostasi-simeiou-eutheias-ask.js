// pages/e-dimotikou/17-apostasi-simeiou-eutheias-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εύρεση Πραγματικής Απόστασης (Input)
function makeDistanceIdentificationQuestion(isMultipleSegments = false, locale = 'el') {
  const isEn = locale === 'en';
  const format = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isMultipleSegments) {
    // q1: Δίνεται κάθετο τμήμα και πλάγιο τμήμα με τις γωνίες τους
    const perpLength = [5, 6, 8, 9, 12, 15][getRandomInt(0, 5)];
    const obliqueLength = perpLength + getRandomInt(2, 5);

    return {
      type: 'input',
      correct: perpLength,
      unit: isEn ? 'cm (distance)' : 'cm (απόσταση)',
      prompt: isEn
        ? `From point A, we draw two segments to line L: AH with length ${format(perpLength)} cm forming a 90° angle with the line, and AB with length ${format(obliqueLength)} cm forming a 48° angle. How many cm is the DISTANCE from point A to line L?`
        : `Από το σημείο Α φέρνουμε προς την ευθεία ε δύο τμήματα: το ΑΗ μήκους ${format(perpLength)} cm που σχηματίζει γωνία 90° με την ευθεία, και το ΑΒ μήκους ${format(obliqueLength)} cm που σχηματίζει γωνία 48°. Πόσα cm είναι η ΑΠΟΣΤΑΣΗ του σημείου Α από την ευθεία ε;`,
      explanation: isEn
        ? `Distance from a point to a line is strictly defined as the length of the PERPENDICULAR line segment (the one forming a 90° angle). Thus, the distance is exactly ${format(perpLength)} cm.`
        : `Απόσταση σημείου από ευθεία ονομάζεται πάντοτε το μήκος του ΚΑΘΕΤΟΥ ευθύγραμμου τμήματος (αυτού που σχηματίζει γωνία 90°). Άρα η απόσταση είναι ακριβώς ${format(perpLength)} cm.`
    };
  } else {
    // q2: Επιλογή του ελάχιστου μήκους ανάμεσα σε τρία τμήματα
    const p = [7, 8, 10, 11, 14][getRandomInt(0, 4)];
    const ob1 = p + getRandomInt(2, 4);
    const ob2 = p + getRandomInt(5, 8);
    const lengths = shuffleArray([p, ob1, ob2]);

    return {
      type: 'input',
      correct: p,
      unit: isEn ? 'cm (distance)' : 'cm (απόσταση)',
      prompt: isEn
        ? `From a point S, three line segments are drawn to line L with lengths ${format(lengths[0])} cm, ${format(lengths[1])} cm, and ${format(lengths[2])} cm. Knowing that one of them is the perpendicular segment, how many cm is the distance from point S to the line?`
        : `Από ένα σημείο Σ σχεδιάστηκαν τρία ευθύγραμμα τμήματα προς την ευθεία ε με μήκη ${format(lengths[0])} cm, ${format(lengths[1])} cm και ${format(lengths[2])} cm. Γνωρίζοντας ότι ένα από αυτά είναι το κάθετο τμήμα, πόσα cm είναι η απόσταση του σημείου Σ από την ευθεία;`,
      explanation: isEn
        ? `The distance is always the SHORTEST (smallest in length) segment of all. Therefore, the distance is the minimum length: ${format(p)} cm.`
        : `Η απόσταση είναι πάντοτε το ΣΥΝΤΟΜΟΤΕΡΟ (μικρότερο σε μήκος) ευθύγραμμο τμήμα από όλα. Επομένως, η απόσταση είναι το ελάχιστο μήκος: ${format(p)} cm.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Θεμελιώδεις Ιδιότητες & Ορολογία (MCQ)
function makeDistanceTheoryPropertiesQuestion(isPointOnLine = false, locale = 'el') {
  const isEn = locale === 'en';

  if (!isPointOnLine) {
    // q3: Ποιο τμήμα εκφράζει την απόσταση
    const correct = isEn
      ? 'The perpendicular line segment to the line'
      : 'Το κάθετο ευθύγραμμο τμήμα προς την ευθεία';
    const rawOptions = isEn
      ? [
          'The perpendicular line segment to the line',
          'Any oblique line segment',
          'The longest line segment',
          'The line segment that forms a 45° angle'
        ]
      : [
          'Το κάθετο ευθύγραμμο τμήμα προς την ευθεία',
          'Οποιοδήποτε πλάγιο ευθύγραμμο τμήμα',
          'Το μεγαλύτερο σε μήκος ευθύγραμμο τμήμα',
          'Το ευθύγραμμο τμήμα που σχηματίζει γωνία 45°'
        ];

    return {
      type: 'mcq',
      correct,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt: isEn
        ? 'What do we call the distance from a point to a line in geometry?'
        : 'Τι ονομάζουμε απόσταση ενός σημείου από μια ευθεία στη γεωμετρία;',
      explanation: isEn
        ? 'The distance of a point from a line is the length of the PERPENDICULAR segment drawn from the point to the line (forming a 90° angle).'
        : 'Απόσταση σημείου από ευθεία ονομάζεται το μήκος του ΚΑΘΕΤΟΥ ευθύγραμμου τμήματος που άγεται από το σημείο προς την ευθεία (και σχηματίζει γωνία 90°).'
    };
  } else {
    // q4: Απόσταση σημείου που βρίσκεται ήδη πάνω στην ευθεία
    const correct = '0 cm';
    const rawOptions = isEn
      ? ['0 cm', '1 cm', 'Undefined', 'Infinite']
      : ['0 cm', '1 cm', 'Δεν ορίζεται', 'Άπειρη'];

    return {
      type: 'mcq',
      correct,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt: isEn
        ? 'If a point A lies directly on a line L, what is its distance from the line?'
        : 'Αν ένα σημείο Α ανήκει (βρίσκεται ήδη) πάνω σε μία ευθεία ε, πόση είναι η απόστασή του από την ευθεία αυτή;',
      explanation: isEn
        ? 'When a point belongs to the line, it coincides with the foot of the perpendicular, so its distance from it is exactly 0 cm.'
        : 'Όταν το σημείο ανήκει στην ευθεία, συμπίπτει με το ίχνος της κάθετης, επομένως η απόστασή του από αυτήν είναι ακριβώς 0 cm.'
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Απόσταση Παράλληλων Ευθειών (Input & MCQ)
function makeParallelDistanceQuestion(isMCQ = false, locale = 'el') {
  const isEn = locale === 'en';
  const format = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isMCQ) {
    // q5: Σταθερότητα απόστασης παραλλήλων (Input)
    const dist = [4, 6, 8, 10, 15, 20][getRandomInt(0, 5)];

    return {
      type: 'input',
      correct: dist,
      unit: isEn ? 'cm (distance)' : 'cm (απόσταση)',
      prompt: isEn
        ? `Two lines L1 and L2 are parallel (L1 // L2). At a point A on L1, its perpendicular distance to L2 was measured to be ${format(dist)} cm. How many cm will the perpendicular distance be from another point B on L1 to L2?`
        : `Δύο ευθείες ε1 και ε2 είναι παράλληλες μεταξύ τους (ε1 // ε2). Σε ένα σημείο Α της ε1, η κάθετη απόστασή του από την ε2 μετρήθηκε ίση με ${format(dist)} cm. Πόσα cm θα είναι η κάθετη απόσταση από ένα άλλο σημείο Β της ε1 προς την ε2;`,
      explanation: isEn
        ? `Two parallel lines have a CONSTANT and equal distance everywhere along them. Therefore, the distance is once again exactly ${format(dist)} cm.`
        : `Δύο παράλληλες ευθείες έχουν ΠΑΝΤΟΥ σταθερή και ίση απόσταση σε όλα τα σημεία τους. Άρα η απόσταση είναι και πάλι ακριβώς ${format(dist)} cm.`
    };
  } else {
    // q6: Ιδιότητα απόστασης παράλληλων ευθειών (MCQ)
    const correct = isEn
      ? 'It remains constant and equal at all points along them'
      : 'Παραμένει παντού σταθερή και ίση σε όλα τα σημεία τους';
    const rawOptions = isEn
      ? [
          'It remains constant and equal at all points along them',
          'As we extend the lines, their distance decreases',
          'As we extend the lines, their distance increases',
          'It depends on the line stroke thickness'
        ]
      : [
          'Παραμένει παντού σταθερή και ίση σε όλα τα σημεία τους',
          'Όσο προεκτείνουμε τις ευθείες, η απόστασή τους μικραίνει',
          'Όσο προεκτείνουμε τις ευθείες, η απόστασή τους μεγαλώνει',
          'Εξαρτάται από το πάχος της γραμμίδας'
        ];

    return {
      type: 'mcq',
      correct,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt: isEn
        ? 'Which statement is mathematically correct regarding the distance between two parallel lines?'
        : 'Ποια πρόταση είναι μαθηματικά ορθή για την απόσταση δύο παράλληλων ευθειών;',
      explanation: isEn
        ? 'The distance between two parallel lines remains strictly constant and invariable at whatever point we measure it perpendicularly.'
        : 'Η απόσταση δύο παράλληλων ευθειών παραμένει αυστηρά σταθερή και αμετάβλητη σε οποιοδήποτε σημείο τους κι αν τη μετρήσουμε κάθετα.'
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετες Εφαρμογές: Ύψος Σχημάτων & Ορθογώνιο (Input & MCQ)
function makeComplexDistanceGeometricProblem(isMCQ = false, locale = 'el') {
  const isEn = locale === 'en';
  const format = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isMCQ) {
    // q7: Ύψος τριγώνου ως απόσταση κορυφής από βάση (Input)
    const height = [8, 9, 12, 14, 16][getRandomInt(0, 4)];
    const side1 = height + getRandomInt(2, 4);
    const side2 = height + getRandomInt(5, 7);

    return {
      type: 'input',
      correct: height,
      unit: isEn ? 'cm (height)' : 'cm (ύψος)',
      prompt: isEn
        ? `In a triangle ABC, sides AB and AC measure ${format(side1)} cm and ${format(side2)} cm respectively. If the perpendicular distance of vertex A from the line containing base BC is ${format(height)} cm, what is the corresponding ALTITUDE of the triangle?`
        : `Σε ένα τρίγωνο ΑΒΓ, οι πλευρές ΑΒ και ΑΓ έχουν μήκη ${format(side1)} cm και ${format(side2)} cm αντίστοιχα. Αν η κάθετη απόσταση της κορυφής Α από την ευθεία της βάσης ΒΓ είναι ${format(height)} cm, πόσο είναι το αντίστοιχο ΥΨΟΣ του τριγώνου;`,
      explanation: isEn
        ? `The altitude of a triangle is defined specifically as the perpendicular distance from a vertex to the line containing the opposite side. Therefore, the altitude is ${format(height)} cm.`
        : `Το ύψος ενός τριγώνου ορίζεται ακριβώς ως η απόσταση (το κάθετο ευθύγραμμο τμήμα) της κορυφής από την ευθεία της απέναντι πλευράς. Άρα το ύψος είναι ${format(height)} cm.`
    };
  } else {
    // q8: Απόσταση απέναντι πλευρών σε ορθογώνιο παραλληλόγραμμο (MCQ)
    const length = 18;
    const width = 10;
    const diagonalApprox = Math.round(Math.sqrt(length * length + width * width));
    const distractors = [
      `${format(length)} cm`,
      `${format(length + width)} cm`,
      `${format(diagonalApprox)} cm`
    ];
    const rawOptions = [`${format(width)} cm`, ...distractors];

    return {
      type: 'mcq',
      correct: `${format(width)} cm`,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt: isEn
        ? `In a rectangle ABCD with length AB ＝ ${format(length)} cm and width BC ＝ ${format(width)} cm, what is the distance between the two longer parallel sides (AB and CD)?`
        : `Σε ένα ορθογώνιο παραλληλόγραμμο ΑΒΓΔ με μήκος ΑΒ ＝ ${format(length)} cm και πλάτος ΒΓ ＝ ${format(width)} cm, ποια είναι η απόσταση ανάμεσα στις δύο μεγάλες παράλληλες πλευρές (ΑΒ και ΓΔ);`,
      explanation: isEn
        ? `Because the sides of a rectangle are perpendicular to each other, the distance between sides AB and CD equals the length of the perpendicular side (the width), exactly ${format(width)} cm.`
        : `Επειδή οι πλευρές του ορθογωνίου είναι κάθετες μεταξύ τους, η απόσταση ανάμεσα στις πλευρές ΑΒ και ΓΔ ισούται με το μήκος της κάθετης πλευράς (του πλάτους), δηλαδή ακριβώς ${format(width)} cm.`
    };
  }
}

function generateQuestions(locale) {
  return {
    q1: makeDistanceIdentificationQuestion(false, locale),
    q2: makeDistanceIdentificationQuestion(true, locale),
    q3: makeDistanceTheoryPropertiesQuestion(false, locale),
    q4: makeDistanceTheoryPropertiesQuestion(true, locale),
    q5: makeParallelDistanceQuestion(false, locale),
    q6: makeParallelDistanceQuestion(true, locale),
    q7: makeComplexDistanceGeometricProblem(false, locale),
    q8: makeComplexDistanceGeometricProblem(true, locale)
  };
}

const translations = {
  el: {
    pageTitle: "Ασκήσεις: Απόσταση Σημείου από Ευθεία - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στην απόσταση σημείου από ευθεία: σύγκριση με πλάγια τμήματα, απόσταση παραλλήλων και ύψος γεωμετρικών σχημάτων.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeChapter: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    mainHeading: "📝 Ασκήσεις: Απόσταση Σημείου από Ευθεία",
    mainSubheading: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "🔄 Νέες Ασκήσεις",
    checkAnswersBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "🏆 Σκορ:",
    successRate: "Επιτυχία:",
    scorePrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctAnswerIs: "Η σωστή απάντηση είναι:",
    q1Badge: "ΕΝΤΟΠΙΣΜΟΣ ΠΡΑΓΜΑΤΙΚΗΣ ΑΠΟΣΤΑΣΗΣ",
    q2Badge: "ΕΛΑΧΙΣΤΟ ΜΗΚΟΣ ΕΥΘΥΓΡΑΜΜΟΥ ΤΜΗΜΑΤΟΣ",
    q3Badge: "ΟΡΙΣΜΟΣ ΑΠΟΣΤΑΣΗΣ ΣΗΜΕΙΟΥ ΑΠΟ ΕΥΘΕΙΑ",
    q4Badge: "ΣΗΜΕΙΟ ΠΑΝΩ ΣΤΗΝ ΕΥΘΕΙΑ",
    q5Badge: "ΑΠΟΣΤΑΣΗ ΠΑΡΑΛΛΗΛΩΝ ΕΥΘΕΙΩΝ",
    q6Badge: "ΣΤΑΘΕΡΟΤΗΤΑ ΑΠΟΣΤΑΣΗΣ ΠΑΡΑΛΛΗΛΩΝ",
    q7Badge: "ΥΨΟΣ ΤΡΙΓΩΝΟΥ ΩΣ ΚΑΘΕΤΗ ΑΠΟΣΤΑΣΗ",
    q8Badge: "ΑΠΟΣΤΑΣΗ ΠΛΕΥΡΩΝ ΣΕ ΟΡΘΟΓΩΝΙΟ",
  },
  en: {
    pageTitle: "Exercises: Distance from a Point to a Line - 5th Grade | LearnMaths.gr",
    pageDesc: "Challenging 5th Grade math exercises on distance from a point to a line: comparing with oblique segments, parallel line distance, and geometric shape heights.",
    backText: "5th Grade",
    theoryBtn: "Theory",
    badgeChapter: "5TH GRADE • PRACTICE",
    mainHeading: "📝 Exercises: Distance from Point to Line",
    mainSubheading: "Every time you click \"New Exercises\", fresh examples are generated from the pool!",
    newExercisesBtn: "🔄 New Exercises",
    checkAnswersBtn: "🎯 Check Answers",
    scoreLabel: "🏆 Score:",
    successRate: "Success:",
    scorePrompt: "Complete all questions and click \"Check Answers\"!",
    correctAnswerIs: "The correct answer is:",
    q1Badge: "IDENTIFYING ACTUAL DISTANCE",
    q2Badge: "MINIMUM LINE SEGMENT LENGTH",
    q3Badge: "DEFINITION OF POINT-LINE DISTANCE",
    q4Badge: "POINT ON THE LINE",
    q5Badge: "DISTANCE BETWEEN PARALLEL LINES",
    q6Badge: "INVARIANCE OF PARALLEL DISTANCE",
    q7Badge: "TRIANGLE ALTITUDE AS PERPENDICULAR DISTANCE",
    q8Badge: "DISTANCE BETWEEN RECTANGLE SIDES",
  }
};

export default function ApostasiSimeiouEutheiasAskPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(locale));
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
                <span className="break-words whitespace-normal leading-snug flex-1">
                  {opt}
                </span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </p>
            ) : (
              <p className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                {t.correctAnswerIs} <strong className="font-bold text-rose-950">{qData.correct}</strong>. {qData.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Component για Ερωτήσεις Input
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    const format = (n) => n.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');

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
              <p className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </p>
            ) : (
              <p className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                {t.correctAnswerIs} <strong className="font-bold text-rose-950">{format(qData.correct)} {qData.unit}</strong>. {qData.explanation}
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
      backUrl="/e-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/17-apostasi-simeiou-eutheias"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 overflow-x-hidden">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              {toCleanUppercase(t.badgeChapter)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              {t.mainHeading}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              {t.mainSubheading}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center cursor-pointer"
          >
            {t.newExercisesBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ & PB SAFE AREA */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-36">
          {renderInput('q1', questions.q1, 1, t.q1Badge, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.q2Badge, 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, t.q3Badge, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.q4Badge, 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, t.q5Badge, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.q6Badge, 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, t.q7Badge, 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, t.q8Badge, 'bg-purple-600')}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                {t.checkAnswersBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-6 2xl:py-5 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>{t.scoreLabel}</span>
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
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 2xl:px-7 2xl:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm 2xl:text-base flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                {t.newExercisesBtn}
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                {t.scorePrompt}
              </p>
            )}
          </div>
        </div>
      </footer>
    </Layout>
  );
}
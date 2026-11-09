// pages/e-dimotikou/21-monades-mikous-ask.js
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

const dictionary = {
  el: {
    pageTitle: "Ασκήσεις: Μονάδες Μέτρησης Μήκους - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στις μονάδες μέτρησης μήκους: μετατροπές σκάλας, χιλιόμετρα, μέτρα, δεκαδικοί υπολογισμοί και προβλήματα περιμέτρου.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badge: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "Ασκήσεις: Μονάδες Μέτρησης Μήκους",
    mainSubtitle: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreText: "Σκορ:",
    successText: "Επιτυχία:",
    bottomPromptText: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctAnswerPrefix: "Η σωστή απάντηση είναι:",
    stepDownBadge: "ΚΑΤΕΒΑΙΝΩ ΤΗ ΣΚΑΛΑ ( m ➔ cm )",
    stepUpBadge: "ΑΝΕΒΑΙΝΩ ΤΗ ΣΚΑΛΑ ( mm ➔ m )",
    compareBadge: "ΣΥΓΚΡΙΣΗ ΑΝΟΜΟΙΟΓΕΝΩΝ ΜΗΚΩΝ",
    ruleBadge: "ΚΑΝΟΝΑΣ ΤΗΣ ΣΚΑΛΑΣ ΜΕΤΑΤΡΟΠΩΝ",
    kmToMBadge: "ΜΕΤΑΤΡΟΠΗ ΧΙΛΙΟΜΕΤΡΩΝ ΣΕ ΜΕΤΡΑ ( km ➔ m )",
    mToKmBadge: "ΜΕΤΑΤΡΟΠΗ ΜΕΤΡΩΝ ΣΕ ΧΙΛΙΟΜΕΤΡΑ ( m ➔ km )",
    perimeterBadge: "ΠΕΡΙΜΕΤΡΟΣ ΜΕ ΑΝΟΜΟΙΟΓΕΝΕΙΣ ΜΟΝΑΔΕΣ",
    ropeBadge: "ΑΦΑΙΡΕΣΗ ΚΑΙ ΥΠΟΛΟΙΠΟ ΜΗΚΟΥΣ ( cm )"
  },
  en: {
    pageTitle: "Exercises: Units of Length - Grade 5 | LearnMaths.gr",
    pageDesc: "Grade 5 math practice on length measurement units: ladder conversions, kilometers, meters, decimal calculations, and perimeter problems.",
    backText: "Grade 5",
    theoryBtn: "Theory",
    badge: "GRADE 5 • PRACTICE",
    mainTitle: "Exercises: Units of Length Measurement",
    mainSubtitle: "Each time you click \"New Exercises\", a fresh set of problems is generated!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreText: "Score:",
    successText: "Success:",
    bottomPromptText: "Complete the exercises and click \"Check Answers\"!",
    correctAnswerPrefix: "The correct answer is:",
    stepDownBadge: "GOING DOWN THE LADDER ( m ➔ cm )",
    stepUpBadge: "GOING UP THE LADDER ( mm ➔ m )",
    compareBadge: "COMPARING DIFFERENT UNITS OF LENGTH",
    ruleBadge: "CONVERSION LADDER RULE",
    kmToMBadge: "CONVERTING KILOMETERS TO METERS ( km ➔ m )",
    mToKmBadge: "CONVERTING METERS TO KILOMETERS ( m ➔ km )",
    perimeterBadge: "PERIMETER WITH MIXED UNITS",
    ropeBadge: "SUBTRACTION AND REMAINING LENGTH ( cm )"
  }
};

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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Μετατροπές Υποδιαιρέσεων (m <-> cm / mm <-> m) (Input)
function makeSubdivisionConversionQuestion(isAscending = false, locale = 'el') {
  const isEl = locale === 'el';
  const numLoc = isEl ? 'el-GR' : 'en-US';

  if (!isAscending) {
    const metersOptions = [2.5, 3.75, 4.2, 0.8, 1.45, 5.6];
    const mVal = metersOptions[getRandomInt(0, metersOptions.length - 1)];
    const correctCm = Math.round(mVal * 100);
    const mStr = mVal.toLocaleString(numLoc);
    const correctCmStr = correctCm.toLocaleString(numLoc);

    return {
      type: 'input',
      correct: correctCm,
      unit: 'cm',
      prompt: isEl
        ? `Μετάτρεψε το μήκος ${mStr} m σε εκατοστά ( cm ):`
        : `Convert the length ${mStr} m to centimeters ( cm ):`,
      explanation: isEl
        ? `Για να πάμε από μέτρα ( m ) σε εκατοστά ( cm ), κατεβαίνουμε 2 σκαλοπάτια (πολλαπλασιάζουμε με το 100): ${mStr} · 100 ＝ ${correctCmStr} cm.`
        : `To convert from meters ( m ) to centimeters ( cm ), we step down 2 steps (multiply by 100): ${mStr} · 100 ＝ ${correctCmStr} cm.`
    };
  } else {
    const mmOptions = [1500, 2400, 3800, 4500, 750, 6200];
    const mmVal = mmOptions[getRandomInt(0, mmOptions.length - 1)];
    const correctM = parseFloat((mmVal / 1000).toFixed(3));
    const mStr = correctM.toLocaleString(numLoc);
    const mmStr = mmVal.toLocaleString(numLoc);

    return {
      type: 'input',
      correct: correctM,
      unit: 'm',
      prompt: isEl
        ? `Μετάτρεψε το μήκος ${mmStr} mm σε μέτρα ( m ):`
        : `Convert the length ${mmStr} mm to meters ( m ):`,
      explanation: isEl
        ? `Για να πάμε από χιλιοστά ( mm ) σε μέτρα ( m ), ανεβαίνουμε 3 σκαλοπάτια (διαιρούμε με το 1.000): ${mmStr} : 1.000 ＝ ${mStr} m.`
        : `To convert from millimeters ( mm ) to meters ( m ), we step up 3 steps (divide by 1,000): ${mmStr} : 1,000 ＝ ${mStr} m.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Σύγκριση Ανομοιογενών Μηκών & Κανόνας Σκάλας (MCQ)
function makeComparisonAndRuleQuestion(isRule = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isRule) {
    const cases = isEl
      ? [
          {
            correct: '3,2 m',
            options: ['3,2 m', '290 cm', '3.100 mm', '28 dm'],
            expl: 'Μετατρέπουμε όλα σε cm: 3,2 m ＝ 320 cm, 290 cm, 3.100 mm ＝ 310 cm, 28 dm ＝ 280 cm. Το μεγαλύτερο είναι τα 3,2 m (320 cm).'
          },
          {
            correct: '0,55 m',
            options: ['0,55 m', '52 cm', '480 mm', '4,9 dm'],
            expl: 'Μετατρέπουμε όλα σε cm: 0,55 m ＝ 55 cm, 52 cm, 480 mm ＝ 48 cm, 4,9 dm ＝ 49 cm. Το μεγαλύτερο είναι τα 0,55 m (55 cm).'
          },
          {
            correct: '45 dm',
            options: ['45 dm', '4,2 m', '410 cm', '3.900 mm'],
            expl: 'Μετατρέπουμε όλα σε μέτρα: 45 dm ＝ 4,5 m, 4,2 m, 410 cm ＝ 4,1 m, 3.900 mm ＝ 3,9 m. Το μεγαλύτερο είναι τα 45 dm (4,5 m).'
          }
        ]
      : [
          {
            correct: '3.2 m',
            options: ['3.2 m', '290 cm', '3,100 mm', '28 dm'],
            expl: 'Converting all to cm: 3.2 m ＝ 320 cm, 290 cm, 3,100 mm ＝ 310 cm, 28 dm ＝ 280 cm. The greatest length is 3.2 m (320 cm).'
          },
          {
            correct: '0.55 m',
            options: ['0.55 m', '52 cm', '480 mm', '4.9 dm'],
            expl: 'Converting all to cm: 0.55 m ＝ 55 cm, 52 cm, 480 mm ＝ 48 cm, 4.9 dm ＝ 49 cm. The greatest length is 0.55 m (55 cm).'
          },
          {
            correct: '45 dm',
            options: ['45 dm', '4.2 m', '410 cm', '3,900 mm'],
            expl: 'Converting all to meters: 45 dm ＝ 4.5 m, 4.2 m, 410 cm ＝ 4.1 m, 3,900 mm ＝ 3.9 m. The greatest length is 45 dm (4.5 m).'
          }
        ];

    const c = cases[getRandomInt(0, cases.length - 1)];

    return {
      type: 'mcq',
      correct: c.correct,
      options: [...new Set(shuffleArray(c.options))],
      prompt: isEl
        ? 'Ποιο από τα παρακάτω μήκη είναι το ΜΕΓΑΛΥΤΕΡΟ;'
        : 'Which of the following lengths is the GREATEST?',
      explanation: c.expl
    };
  } else {
    const rawOptions = isEl
      ? [
          'Όταν ανεβαίνουμε τη σκάλα (μικρότερη σε μεγαλύτερη μονάδα) διαιρούμε με 10, 100 ή 1.000',
          'Όταν ανεβαίνουμε τη σκάλα πολλαπλασιάζουμε πάντα με το 10',
          'Όταν κατεβαίνουμε τη σκάλα διαιρούμε με το 100',
          'Το άλμα από μέτρο σε χιλιόμετρο γίνεται πολλαπλασιάζοντας με το 10'
        ]
      : [
          'When stepping up the ladder (smaller to larger unit), we divide by 10, 100, or 1,000',
          'When stepping up the ladder, we always multiply by 10',
          'When stepping down the ladder, we divide by 100',
          'The step from meter to kilometer is performed by multiplying by 10'
        ];

    const correct = rawOptions[0];

    return {
      type: 'mcq',
      correct,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? 'Ποιος κανόνας ισχύει πάντοτε για τις μετατροπές μονάδων μέτρησης μήκους;'
        : 'Which rule is always valid for unit conversions of length?',
      explanation: isEl
        ? 'Όταν μετατρέπουμε από μικρότερη σε μεγαλύτερη μονάδα (ανεβαίνουμε τη σκάλα) κάνουμε ΔΙΑΙΡΕΣΗ (: 10, : 100, : 1.000). Όταν πάμε από μεγαλύτερη σε μικρότερη (κατεβαίνουμε τη σκάλα) κάνουμε ΠΟΛΛΑΠΛΑΣΙΑΣΜΟ (· 10, · 100, · 1.000).'
        : 'When converting from a smaller to a larger unit (going up the ladder), we DIVIDE (: 10, : 100, : 1,000). When going from larger to smaller (going down), we MULTIPLY (· 10, · 100, · 1,000).'
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Μετατροπές Χιλιομέτρου (km <-> m) (Input & MCQ)
function makeKilometerConversionQuestion(isMCQ = false, locale = 'el') {
  const isEl = locale === 'el';
  const numLoc = isEl ? 'el-GR' : 'en-US';

  if (!isMCQ) {
    const kmOptions = [2.4, 3.75, 0.85, 1.25, 4.05, 5.5];
    const kmVal = kmOptions[getRandomInt(0, kmOptions.length - 1)];
    const correctMeters = Math.round(kmVal * 1000);
    const kmStr = kmVal.toLocaleString(numLoc);
    const mStr = correctMeters.toLocaleString(numLoc);

    return {
      type: 'input',
      correct: correctMeters,
      unit: 'm',
      prompt: isEl
        ? `Μια διαδρομή έχει μήκος ${kmStr} km. Πόσα μέτρα ( m ) είναι η διαδρομή αυτή;`
        : `A route has a length of ${kmStr} km. How many meters ( m ) is this route?`,
      explanation: isEl
        ? `Επειδή 1 km ＝ 1.000 m, πολλαπλασιάζουμε με το 1.000: ${kmStr} · 1.000 ＝ ${mStr} m.`
        : `Since 1 km ＝ 1,000 m, we multiply by 1,000: ${kmStr} · 1,000 ＝ ${mStr} m.`
    };
  } else {
    const mCases = [
      { meters: 4500, kmEl: '4,5 km', kmEn: '4.5 km', distEl: ['45 km', '0,45 km', '450 km'], distEn: ['45 km', '0.45 km', '450 km'] },
      { meters: 750, kmEl: '0,75 km', kmEn: '0.75 km', distEl: ['7,5 km', '0,075 km', '75 km'], distEn: ['7.5 km', '0.075 km', '75 km'] },
      { meters: 12800, kmEl: '12,8 km', kmEn: '12.8 km', distEl: ['128 km', '1,28 km', '0,128 km'], distEn: ['128 km', '1.28 km', '0.128 km'] },
      { meters: 320, kmEl: '0,32 km', kmEn: '0.32 km', distEl: ['3,2 km', '0,032 km', '32 km'], distEn: ['3.2 km', '0.032 km', '32 km'] }
    ];
    const c = mCases[getRandomInt(0, mCases.length - 1)];
    const correct = isEl ? c.kmEl : c.kmEn;
    const rawOptions = isEl ? [c.kmEl, ...c.distEl] : [c.kmEn, ...c.distEn];
    const mStr = c.meters.toLocaleString(numLoc);

    return {
      type: 'mcq',
      correct,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? `Πόσα χιλιόμετρα ( km ) είναι η απόσταση των ${mStr} m;`
        : `How many kilometers ( km ) is a distance of ${mStr} m?`,
      explanation: isEl
        ? `Για να μετατρέψουμε μέτρα σε χιλιόμετρα, διαιρούμε με το 1.000: ${mStr} : 1.000 ＝ ${correct}.`
        : `To convert meters to kilometers, we divide by 1,000: ${mStr} : 1,000 ＝ ${correct}.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Περιμέτρου & Ανομοιογενών Μονάδων (Input & MCQ)
function makeComplexLengthProblem(isMCQ = false, locale = 'el') {
  const isEl = locale === 'el';
  const numLoc = isEl ? 'el-GR' : 'en-US';

  if (!isMCQ) {
    const lengthM = [1.2, 1.5, 2.4, 3.5][getRandomInt(0, 3)];
    const widthCm = [80, 50, 60, 150][getRandomInt(0, 3)];
    const widthM = widthCm / 100;
    const perimeterM = parseFloat((2 * (lengthM + widthM)).toFixed(2));

    const lStr = lengthM.toLocaleString(numLoc);
    const wCmStr = widthCm.toLocaleString(numLoc);
    const wMStr = widthM.toLocaleString(numLoc);
    const sumStr = (lengthM + widthM).toLocaleString(numLoc);
    const perimStr = perimeterM.toLocaleString(numLoc);

    return {
      type: 'input',
      correct: perimeterM,
      unit: isEl ? 'm (περίμετρος)' : 'm (perimeter)',
      prompt: isEl
        ? `Ένα ορθογώνιο παρτέρι έχει μήκος ${lStr} m και πλάτος ${wCmStr} cm. Πόσα μέτρα ( m ) είναι η περίμετρός του;`
        : `A rectangular flowerbed is ${lStr} m long and ${wCmStr} cm wide. How many meters ( m ) is its perimeter?`,
      explanation: isEl
        ? `Μετατρέπουμε το πλάτος σε μέτρα: ${wCmStr} cm ＝ ${wMStr} m. Υπολογίζουμε την περίμετρο: 2 · (${lStr} ＋ ${wMStr}) ＝ 2 · ${sumStr} ＝ ${perimStr} m.`
        : `Convert width to meters: ${wCmStr} cm ＝ ${wMStr} m. Calculate perimeter: 2 · (${lStr} ＋ ${wMStr}) ＝ 2 · ${sumStr} ＝ ${perimStr} m.`
    };
  } else {
    const totalM = 5;
    const cut1Cm = 180;
    const cut2Dm = 14;
    const cut2Cm = cut2Dm * 10;
    const totalCutCm = cut1Cm + cut2Cm;
    const totalCm = totalM * 100;
    const remainCm = totalCm - totalCutCm;

    const distractors = [remainCm + 40, Math.max(10, remainCm - 30), remainCm + 100];
    const rawOptions = [`${remainCm} cm`, ...distractors.map((d) => `${d} cm`)];

    return {
      type: 'mcq',
      correct: `${remainCm} cm`,
      options: [...new Set(shuffleArray(rawOptions))],
      prompt: isEl
        ? `Ένα σχοινί έχει αρχικό μήκος ${totalM} m. Κόβουμε ένα κομμάτι ${cut1Cm} cm και ένα δεύτερο κομμάτι ${cut2Dm} dm. Πόσα εκατοστά ( cm ) σχοινιού περίσσεψαν;`
        : `A rope has an initial length of ${totalM} m. We cut a piece of ${cut1Cm} cm and a second piece of ${cut2Dm} dm. How many centimeters ( cm ) of rope remain?`,
      explanation: isEl
        ? `Μετατρέπουμε τα πάντα σε εκατοστά: Αρχικό μήκος ＝ ${totalM} m ＝ ${totalCm} cm. Πρώτο κομμάτι ＝ ${cut1Cm} cm. Δεύτερο κομμάτι ＝ ${cut2Dm} dm ＝ ${cut2Dm} · 10 ＝ ${cut2Cm} cm. Συνολικό κόψιμο: ${cut1Cm} ＋ ${cut2Cm} ＝ ${totalCutCm} cm. Περίσσεψαν: ${totalCm} － ${totalCutCm} ＝ ${remainCm} cm.`
        : `Convert everything to centimeters: Initial length ＝ ${totalM} m ＝ ${totalCm} cm. First piece ＝ ${cut1Cm} cm. Second piece ＝ ${cut2Dm} dm ＝ ${cut2Dm} · 10 ＝ ${cut2Cm} cm. Total cut: ${cut1Cm} ＋ ${cut2Cm} ＝ ${totalCutCm} cm. Remaining: ${totalCm} － ${totalCutCm} ＝ ${remainCm} cm.`
    };
  }
}

function generateQuestions(locale = 'el') {
  return {
    q1: makeSubdivisionConversionQuestion(false, locale),
    q2: makeSubdivisionConversionQuestion(true, locale),
    q3: makeComparisonAndRuleQuestion(false, locale),
    q4: makeComparisonAndRuleQuestion(true, locale),
    q5: makeKilometerConversionQuestion(false, locale),
    q6: makeKilometerConversionQuestion(true, locale),
    q7: makeComplexLengthProblem(false, locale),
    q8: makeComplexLengthProblem(true, locale)
  };
}

export default function MonadesMikousAskPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = dictionary[locale];

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

  const handleStrictNumberInput = (key, rawVal) => {
    if (submitted) return;
    let clean = '';
    if (locale === 'el') {
      clean = rawVal.replace(/\./g, ',').replace(/[^0-9,]/g, '');
      const parts = clean.split(',');
      if (parts.length > 2) {
        clean = parts[0] + ',' + parts.slice(1).join('');
      }
    } else {
      clean = rawVal.replace(/,/g, '.').replace(/[^0-9.]/g, '');
      const parts = clean.split('.');
      if (parts.length > 2) {
        clean = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    if (clean.length > 10) {
      clean = clean.slice(0, 10);
    }
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const parseUserFloat = (val) => {
    if (!val || val === ',' || val === '.') return NaN;
    return parseFloat(val.replace(',', '.'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    // q1
    if (Math.abs(parseUserFloat(answers.q1) - questions.q1.correct) <= 0.05) currentScore += 1;
    // q2
    if (Math.abs(parseUserFloat(answers.q2) - questions.q2.correct) <= 0.05) currentScore += 1;
    // q3
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    // q4
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    // q5
    if (Math.abs(parseUserFloat(answers.q5) - questions.q5.correct) <= 0.05) currentScore += 1;
    // q6
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    // q7
    if (Math.abs(parseUserFloat(answers.q7) - questions.q7.correct) <= 0.05) currentScore += 1;
    // q8
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render MCQ Question
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
                className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition select-none text-sm sm:text-base 2xl:text-lg font-mono font-bold ${
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
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0 mt-0.5"
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
                {t.correctAnswerPrefix} <strong className="font-bold text-rose-950">{qData.correct}</strong>. {qData.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Input Question
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const userVal = parseUserFloat(answers[qKey]);
    const isCorrect = !isNaN(userVal) && Math.abs(userVal - qData.correct) <= 0.05;
    const numLoc = locale === 'el' ? 'el-GR' : 'en-US';

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
              <p className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </p>
            ) : (
              <p className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                {t.correctAnswerPrefix} <strong className="font-bold text-rose-950">{qData.correct.toLocaleString(numLoc)} {qData.unit}</strong>. {qData.explanation}
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
          href="/e-dimotikou/21-monades-mikous"
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
              {t.badge}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              📝 {t.mainTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              {t.mainSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center cursor-pointer"
          >
            🔄 {t.newExercisesBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInput('q1', questions.q1, 1, t.stepDownBadge, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.stepUpBadge, 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, t.compareBadge, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.ruleBadge, 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, t.kmToMBadge, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.mToKmBadge, 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, t.perimeterBadge, 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, t.ropeBadge, 'bg-purple-600')}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                🎯 {t.submitBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ΣΤΑΘΕΡΟ ΚΑΤΩ FOOTER (SCORE BAR) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreText}</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                {t.successText} <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
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
                <span>🔄</span> {t.newExercisesBtn}
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                {t.bottomPromptText}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
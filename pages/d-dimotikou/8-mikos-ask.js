// pages/d-dimotikou/8-mikos-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ ΚΑΘΑΡΙΣΜΟΥ & ΤΥΠΟΓΡΑΦΙΑΣ --- //

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

function formatNumberLocale(num, locale = 'el', options = {}) {
  if (num === null || num === undefined || isNaN(num)) return '';
  return num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR', options);
}

// Component για κανονική μαθηματική γραφή κλασμάτων (κατακόρυφη διάταξη)
const Fraction = ({ num, den, inline = false }) => (
  <span
    className={`${
      inline ? 'inline-flex' : 'flex'
    } flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none select-none`}
  >
    <span className="px-1.5 pb-0.5 text-center text-xs sm:text-sm border-b-2 border-current">
      {num}
    </span>
    <span className="px-1.5 pt-0.5 text-center text-xs sm:text-sm">
      {den}
    </span>
  </span>
);

// --- ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n --- //
const translations = {
  el: {
    metaTitle: "Ασκήσεις: Μέτρηση Μήκους & Μετατροπές | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στις μονάδες μήκους: μετατροπές από μέτρα σε εκατοστά, χιλιόμετρα, επιλογή κατάλληλης μονάδας και σύγκριση.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    theoryUrl: "/d-dimotikou/8-mikos",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Ασκήσεις: Μέτρηση Μήκους",
    subtitle: "Πατώντας «Νέες Ασκήσεις», οι τιμές και τα ερωτήματα ανανεώνονται αυτόματα από τη δεξαμενή!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    bottomPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    // Q1 & Q2
    q1Prompt: "Μετάτρεψε τη μονάδα μέτρησης:",
    q1FbSuccess: "Για να μετατρέψουμε από {from} σε {to}, πολλαπλασιάζουμε με το {factor}: {val} · {factor} ＝ {correct} {to}.",
    q1FbErrorLead: "Η σωστή απάντηση είναι",
    // Q3 & Q4
    q3Prompt: "Μετάτρεψε τη μονάδα μέτρησης:",
    q3FbSuccessLead: "Για να μετατρέψουμε από {from} σε {to}, διαιρούμε με το {factor}:",
    q3FbErrorLead: "Η σωστή απάντηση είναι",
    // Q5 & Q6
    q5PromptPrefix: "Με ποια μονάδα μέτρησης είναι πιο κατάλληλο να εκφράσουμε",
    q5FbSuccess: "Για να μετρήσουμε {factorDesc}, η πλέον κατάλληλη μονάδα είναι τα {correct}.",
    q5FbErrorLead: "Η πλέον κατάλληλη μονάδα είναι:",
    // Q7 & Q8
    q7Prompt: "Επίλεξε το κατάλληλο σύμβολο σύγκρισης ( ＜ , ＝ , ＞ ):",
    q7FbEqual: "Μετατρέποντας στην ίδια μονάδα: {valA} {unitA} ＝ {valAConverted} {unitB}, επομένως ισχύει {valA} {unitA} {sym} {valB} {unitB}.",
    q7FbDiff: "Μετατρέποντας στην ίδια μονάδα: {valA} {unitA} ＝ {valAConverted} {unitB}, επομένως ισχύει {valA} {unitA} {sym} {valB} {unitB}.",
    q7FbErrorLead: "Η ορθή σχέση είναι"
  },
  en: {
    metaTitle: "Exercises: Length Measurement & Conversions | LearnMaths.gr",
    metaDesc: "Interactive math exercises for 4th Grade on units of length: converting metres to centimetres, kilometres, selecting suitable units, and comparing lengths.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    theoryBtn: "Theory",
    theoryUrl: "/en/d-dimotikou/8-mikos",
    badge: "4TH GRADE • PRACTICE",
    title: "Exercises: Length Measurement",
    subtitle: "Clicking 'New Exercises' generates new values and questions automatically from the pool!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success Rate:",
    bottomPrompt: "Complete all questions and click 'Check Answers'!",
    // Q1 & Q2
    q1Prompt: "Convert the unit of measurement:",
    q1FbSuccess: "To convert from {from} to {to}, we multiply by {factor}: {val} · {factor} ＝ {correct} {to}.",
    q1FbErrorLead: "The correct answer is",
    // Q3 & Q4
    q3Prompt: "Convert the unit of measurement:",
    q3FbSuccessLead: "To convert from {from} to {to}, we divide by {factor}:",
    q3FbErrorLead: "The correct answer is",
    // Q5 & Q6
    q5PromptPrefix: "Which measurement unit is most suitable to express",
    q5FbSuccess: "To measure {factorDesc}, the most suitable unit is {correct}.",
    q5FbErrorLead: "The most suitable unit is:",
    // Q7 & Q8
    q7Prompt: "Select the appropriate comparison sign ( ＜ , ＝ , ＞ ):",
    q7FbEqual: "Converting to the same unit: {valA} {unitA} ＝ {valAConverted} {unitB}, therefore {valA} {unitA} {sym} {valB} {unitB}.",
    q7FbDiff: "Converting to the same unit: {valA} {unitA} ＝ {valAConverted} {unitB}, therefore {valA} {unitA} {sym} {valB} {unitB}.",
    q7FbErrorLead: "The correct comparison is"
  }
};

// Δεξαμενή κατάλληλων μονάδων μέτρησης (el / en)
const SUITABLE_UNITS_POOL = [
  // Κm
  {
    qEl: 'την απόσταση μεταξύ δύο πόλεων (π.χ. Αθήνα – Θεσσαλονίκη)',
    qEn: 'the distance between two cities (e.g. Athens – Thessaloniki)',
    correctEl: 'Χιλιόμετρα (km)',
    correctEn: 'Kilometres (km)',
    descEl: 'μεγάλες γεωγραφικές αποστάσεις',
    descEn: 'large geographical distances'
  },
  {
    qEl: 'το συνολικό μήκος ενός αυτοκινητοδρόμου',
    qEn: 'the total length of a highway',
    correctEl: 'Χιλιόμετρα (km)',
    correctEn: 'Kilometres (km)',
    descEl: 'μεγάλες οδικές αποστάσεις',
    descEn: 'long roadway distances'
  },
  {
    qEl: 'την απόσταση που διανύει ένα αεροπλάνο σε μια πτήση',
    qEn: 'the distance an airplane travels during a flight',
    correctEl: 'Χιλιόμετρα (km)',
    correctEn: 'Kilometres (km)',
    descEl: 'μεγάλες αποστάσεις πτήσεων',
    descEn: 'long flight distances'
  },
  {
    qEl: 'το μήκος μιας διαδρομής μαραθωνίου δρόμου (42 km)',
    qEn: 'the length of a marathon route (42 km)',
    correctEl: 'Χιλιόμετρα (km)',
    correctEn: 'Kilometres (km)',
    descEl: 'μεγάλες αθλητικές διαδρομές',
    descEn: 'long athletic routes'
  },
  {
    qEl: 'την απόσταση ενός χωριού από την πλησιέστερη πόλη',
    qEn: 'the distance from a village to the nearest town',
    correctEl: 'Χιλιόμετρα (km)',
    correctEn: 'Kilometres (km)',
    descEl: 'μεγάλες αποστάσεις μεταξύ οικισμών',
    descEn: 'large distances between towns'
  },

  // m
  {
    qEl: 'το μήκος μιας πισίνας ολυμπιακών διαστάσεων',
    qEn: 'the length of an Olympic-size swimming pool',
    correctEl: 'Μέτρα (m)',
    correctEn: 'Metres (m)',
    descEl: 'διαστάσεις αθλητικών εγκαταστάσεων',
    descEn: 'dimensions of athletic facilities'
  },
  {
    qEl: 'το ύψος ενός πολυώροφου κτιρίου',
    qEn: 'the height of a multi-storey building',
    correctEl: 'Μέτρα (m)',
    correctEn: 'Metres (m)',
    descEl: 'ύψη κτιρίων',
    descEn: 'building heights'
  },
  {
    qEl: 'το μήκος ενός γηπέδου ποδοσφαίρου',
    qEn: 'the length of a football pitch',
    correctEl: 'Μέτρα (m)',
    correctEn: 'Metres (m)',
    descEl: 'αθλητικούς χώρους',
    descEn: 'sports fields'
  },
  {
    qEl: 'το ύψος μιας σχολικής αίθουσας',
    qEn: 'the height of a school classroom',
    correctEl: 'Μέτρα (m)',
    correctEn: 'Metres (m)',
    descEl: 'διαστάσεις δωματίων',
    descEn: 'room dimensions'
  },
  {
    qEl: 'το μήκος ενός αστικού λεωφορείου',
    qEn: 'the length of a city bus',
    correctEl: 'Μέτρα (m)',
    correctEn: 'Metres (m)',
    descEl: 'διαστάσεις μεγάλων οχημάτων',
    descEn: 'large vehicle lengths'
  },

  // cm
  {
    qEl: 'το μήκος ενός μολυβιού ή ενός στυλό',
    qEn: 'the length of a pencil or pen',
    correctEl: 'Εκατοστά (cm)',
    correctEn: 'Centimetres (cm)',
    descEl: 'αντικείμενα καθημερινής χρήσης',
    descEn: 'everyday small objects'
  },
  {
    qEl: 'το πλάτος ενός σχολικού βιβλίου ή τετραδίου',
    qEn: 'the width of a school textbook or notebook',
    correctEl: 'Εκατοστά (cm)',
    correctEn: 'Centimetres (cm)',
    descEl: 'διαστάσεις εντύπων',
    descEn: 'book dimensions'
  },
  {
    qEl: 'το μήκος της οθόνης ενός κινητού τηλεφώνου',
    qEn: 'the length of a mobile phone screen',
    correctEl: 'Εκατοστά (cm)',
    correctEn: 'Centimetres (cm)',
    descEl: 'διαστάσεις ηλεκτρονικών συσκευών',
    descEn: 'device screen dimensions'
  },
  {
    qEl: 'το μήκος του πέλματος ενός παπουτσιού',
    qEn: 'the length of a shoe sole',
    correctEl: 'Εκατοστά (cm)',
    correctEn: 'Centimetres (cm)',
    descEl: 'διαστάσεις ένδυσης/υπόδησης',
    descEn: 'footwear sizes'
  },
  {
    qEl: 'το μήκος ενός συνηθισμένου σχολικού χάρακα',
    qEn: 'the length of a standard school ruler',
    correctEl: 'Εκατοστά (cm)',
    correctEn: 'Centimetres (cm)',
    descEl: 'όργανα σχεδίασης',
    descEn: 'drawing rulers'
  },
  {
    qEl: 'το πλάτος μιας τραπεζικής κάρτας',
    qEn: 'the width of a bank credit card',
    correctEl: 'Εκατοστά (cm)',
    correctEn: 'Centimetres (cm)',
    descEl: 'μικρά επίπεδα αντικείμενα',
    descEn: 'flat cards'
  },

  // mm
  {
    qEl: 'το πάχος ενός νομίσματος των 2 ευρώ',
    qEn: 'the thickness of a 2-euro coin',
    correctEl: 'Χιλιοστά (mm)',
    correctEn: 'Millimetres (mm)',
    descEl: 'πολύ μικρά πάχη αντικειμένων',
    descEn: 'very thin object thickness'
  },
  {
    qEl: 'το πάχος μιας πιστωτικής κάρτας',
    qEn: 'the thickness of a plastic card',
    correctEl: 'Χιλιοστά (mm)',
    correctEn: 'Millimetres (mm)',
    descEl: 'πολύ λεπτά πάχη',
    descEn: 'extremely thin surfaces'
  },
  {
    qEl: 'το μήκος ενός μικρού μυρμηγκιού',
    qEn: 'the length of a small ant',
    correctEl: 'Χιλιοστά (mm)',
    correctEn: 'Millimetres (mm)',
    descEl: 'πολύ μικρά έντομα',
    descEn: 'tiny insects'
  },
  {
    qEl: 'το πάχος του τζαμιού ενός παραθύρου',
    qEn: 'the thickness of window glass',
    correctEl: 'Χιλιοστά (mm)',
    correctEn: 'Millimetres (mm)',
    descEl: 'πάχη υλικών',
    descEn: 'glass thickness'
  },
  {
    qEl: 'τη διάμετρο της μύτης ενός μηχανικού μολυβιού (π.χ. 0,5 ή 0,7)',
    qEn: 'the lead diameter of a mechanical pencil (e.g. 0.5 or 0.7)',
    correctEl: 'Χιλιοστά (mm)',
    correctEn: 'Millimetres (mm)',
    descEl: 'λεπτές ακίδες',
    descEn: 'pencil lead tips'
  },
  {
    qEl: 'το πάχος ενός φύλλου χαρτιού σχεδίασης',
    qEn: 'the thickness of a sheet of paper',
    correctEl: 'Χιλιοστά (mm)',
    correctEn: 'Millimetres (mm)',
    descEl: 'ελάχιστα πάχη επιφανειών',
    descEn: 'minimal sheet thickness'
  }
];

// --- ΓΕΝΝΗΤΡΙΕΣ ΕΡΩΤΗΣΕΩΝ --- //

function makeBigToSmallQuestion(prevQuestion = null) {
  const types = [
    { from: 'm', to: 'cm', factor: 100, min: 1, max: 15 },
    { from: 'km', to: 'm', factor: 1000, min: 1, max: 10 },
    { from: 'm', to: 'mm', factor: 1000, min: 1, max: 8 },
    { from: 'dm', to: 'cm', factor: 10, min: 2, max: 30 },
    { from: 'cm', to: 'mm', factor: 10, min: 3, max: 40 }
  ];

  let chosen, val, correct;

  while (true) {
    chosen = types[getRandomInt(0, types.length - 1)];
    val = getRandomInt(chosen.min, chosen.max);
    correct = val * chosen.factor;

    if (!prevQuestion || prevQuestion.from !== chosen.from || prevQuestion.val !== val) {
      break;
    }
  }

  return {
    val,
    from: chosen.from,
    to: chosen.to,
    factor: chosen.factor,
    correct
  };
}

function makeSmallToBigQuestion(prevQuestion = null) {
  const types = [
    { from: 'cm', to: 'm', factor: 100, min: 1, max: 12 },
    { from: 'm', to: 'km', factor: 1000, min: 1, max: 9 },
    { from: 'mm', to: 'cm', factor: 10, min: 2, max: 25 },
    { from: 'cm', to: 'dm', factor: 10, min: 2, max: 30 },
    { from: 'mm', to: 'm', factor: 1000, min: 1, max: 6 }
  ];

  let chosen, correct, val;

  while (true) {
    chosen = types[getRandomInt(0, types.length - 1)];
    correct = getRandomInt(chosen.min, chosen.max);
    val = correct * chosen.factor;

    if (!prevQuestion || prevQuestion.from !== chosen.from || prevQuestion.val !== val) {
      break;
    }
  }

  return {
    val,
    from: chosen.from,
    to: chosen.to,
    factor: chosen.factor,
    correct
  };
}

function makeSuitableUnitQuestion(locale, prevQuestion = null) {
  let selected;

  while (true) {
    selected = SUITABLE_UNITS_POOL[getRandomInt(0, SUITABLE_UNITS_POOL.length - 1)];
    const qText = locale === 'en' ? selected.qEn : selected.qEl;
    if (!prevQuestion || prevQuestion.qText !== qText) {
      break;
    }
  }

  const allUnitsEl = ['Χιλιόμετρα (km)', 'Μέτρα (m)', 'Εκατοστά (cm)', 'Χιλιοστά (mm)'];
  const allUnitsEn = ['Kilometres (km)', 'Metres (m)', 'Centimetres (cm)', 'Millimetres (mm)'];

  const allUnits = locale === 'en' ? allUnitsEn : allUnitsEl;
  const correctText = locale === 'en' ? selected.correctEn : selected.correctEl;
  const factorDesc = locale === 'en' ? selected.descEn : selected.descEl;
  const qText = locale === 'en' ? selected.qEn : selected.qEl;

  const wrongs = allUnits.filter((u) => u !== correctText);

  const rawOptions = [correctText, wrongs[0], wrongs[1], wrongs[2]];
  const uniqueOptions = [...new Set(rawOptions)].sort(() => Math.random() - 0.5);

  return {
    qText,
    options: uniqueOptions,
    correct: correctText,
    factorDesc
  };
}

function makeComparisonQuestion(prevQuestion = null) {
  const pairs = [
    { unitA: 'm', unitB: 'cm', factorA: 100 },
    { unitA: 'km', unitB: 'm', factorA: 1000 },
    { unitA: 'dm', unitB: 'cm', factorA: 10 },
    { unitA: 'cm', unitB: 'mm', factorA: 10 }
  ];

  let pair, valA, valB, correctSym;

  while (true) {
    pair = pairs[getRandomInt(0, pairs.length - 1)];
    valA = getRandomInt(2, 12);

    valB = valA * pair.factorA;
    if (Math.random() > 0.35) {
      valB = (valA + getRandomInt(-2, 2)) * pair.factorA;
      if (valB <= 0 || valB === valA * pair.factorA) {
        valB = valA * pair.factorA + (pair.factorA >= 100 ? 50 : 5);
      }
    }

    const realBInAUnit = valB / pair.factorA;
    correctSym = '＝';
    if (valA > realBInAUnit) correctSym = '＞';
    if (valA < realBInAUnit) correctSym = '＜';

    if (!prevQuestion || prevQuestion.valA !== valA || prevQuestion.valB !== valB || prevQuestion.unitA !== pair.unitA) {
      break;
    }
  }

  return {
    valA,
    unitA: pair.unitA,
    valB,
    unitB: pair.unitB,
    factorA: pair.factorA,
    valAConverted: valA * pair.factorA,
    correct: correctSym
  };
}

function generateQuestions(locale) {
  const q1 = makeBigToSmallQuestion();
  const q2 = makeBigToSmallQuestion(q1);

  const q3 = makeSmallToBigQuestion();
  const q4 = makeSmallToBigQuestion(q3);

  const q5 = makeSuitableUnitQuestion(locale);
  const q6 = makeSuitableUnitQuestion(locale, q5);

  const q7 = makeComparisonQuestion();
  const q8 = makeComparisonQuestion(q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function MikosAskPage() {
  const router = useRouter();
  const rawLocale = router.locale || router.query.locale;
  const currentLocale = rawLocale === 'en' ? 'en' : 'el';
  const t = translations[currentLocale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(currentLocale));
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
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  const totalQuestions = 8;

  // Render Q1 & Q2: Μεγάλη ➔ Μικρή Μονάδα (Input)
  const renderBigToSmall = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-cyan-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.q1Prompt}{' '}
            <span className="text-cyan-600 font-mono font-black text-lg sm:text-xl">
              {formatNumberLocale(qData.val, currentLocale)} {qData.from}
            </span>{' '}
            ＝{' '}
            <span className="text-cyan-600 font-mono font-black text-lg sm:text-xl">
              ? {qData.to}
            </span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{formatNumberLocale(qData.val, currentLocale)} {qData.from}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-cyan-900 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none shadow-sm"
            />
            <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">{qData.to}</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {t.q1FbSuccess
                  .replace(/\{from\}/g, qData.from)
                  .replace(/\{to\}/g, qData.to)
                  .replace(/\{factor\}/g, formatNumberLocale(qData.factor, currentLocale))
                  .replace(/\{val\}/g, formatNumberLocale(qData.val, currentLocale))
                  .replace(/\{correct\}/g, formatNumberLocale(qData.correct, currentLocale))}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q1FbErrorLead}{' '}
                <span className="font-mono font-bold text-rose-900">
                  {formatNumberLocale(qData.correct, currentLocale)} {qData.to}
                </span>.{' '}
                {t.q1FbSuccess
                  .replace(/\{from\}/g, qData.from)
                  .replace(/\{to\}/g, qData.to)
                  .replace(/\{factor\}/g, formatNumberLocale(qData.factor, currentLocale))
                  .replace(/\{val\}/g, formatNumberLocale(qData.val, currentLocale))
                  .replace(/\{correct\}/g, formatNumberLocale(qData.correct, currentLocale))}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Μικρή ➔ Μεγάλη Μονάδα (Input με Fraction)
  const renderSmallToBig = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-teal-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.q3Prompt}{' '}
            <span className="text-teal-600 font-mono font-black text-lg sm:text-xl">
              {formatNumberLocale(qData.val, currentLocale)} {qData.from}
            </span>{' '}
            ＝{' '}
            <span className="text-teal-600 font-mono font-black text-lg sm:text-xl">
              ? {qData.to}
            </span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{formatNumberLocale(qData.val, currentLocale)} {qData.from}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-teal-900 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
            />
            <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">{qData.to}</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60 flex flex-wrap items-center gap-1.5">
                <span>
                  {t.q3FbSuccessLead
                    .replace('{from}', qData.from)
                    .replace('{to}', qData.to)
                    .replace('{factor}', formatNumberLocale(qData.factor, currentLocale))}
                </span>
                <Fraction
                  num={formatNumberLocale(qData.val, currentLocale)}
                  den={formatNumberLocale(qData.factor, currentLocale)}
                  inline={true}
                />
                <span>＝</span>
                <span className="font-mono font-bold">
                  {formatNumberLocale(qData.correct, currentLocale)} {qData.to}
                </span>.
              </div>
            ) : (
              <div className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60 flex flex-wrap items-center gap-1.5">
                <span>{t.q3FbErrorLead}</span>
                <span className="font-mono font-bold text-rose-900">
                  {formatNumberLocale(qData.correct, currentLocale)} {qData.to}
                </span>.
                <span>
                  {t.q3FbSuccessLead
                    .replace('{from}', qData.from)
                    .replace('{to}', qData.to)
                    .replace('{factor}', formatNumberLocale(qData.factor, currentLocale))}
                </span>
                <Fraction
                  num={formatNumberLocale(qData.val, currentLocale)}
                  den={formatNumberLocale(qData.factor, currentLocale)}
                  inline={true}
                />
                <span>＝</span>
                <span className="font-mono font-bold">
                  {formatNumberLocale(qData.correct, currentLocale)} {qData.to}
                </span>.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Κατάλληλη Μονάδα (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
  const renderSuitableUnit = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
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
            {t.q5PromptPrefix} <span className="text-indigo-600 font-extrabold">{qData.qText}</span>;
          </h3>
        </div>

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
                <span className="leading-snug break-words whitespace-normal flex-1">
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
                {t.q5FbSuccess
                  .replace('{factorDesc}', qData.factorDesc)
                  .replace('{correct}', qData.correct)}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q5FbErrorLead} <strong className="font-bold text-rose-900">{qData.correct}</strong>.{' '}
                {t.q5FbSuccess
                  .replace('{factorDesc}', qData.factorDesc)
                  .replace('{correct}', qData.correct)}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Σύγκριση (Buttons)
  const renderComparison = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    const fbText = qData.valAConverted === qData.valB
      ? t.q7FbEqual
          .replace('{valA}', formatNumberLocale(qData.valA, currentLocale))
          .replace('{unitA}', qData.unitA)
          .replace('{valAConverted}', formatNumberLocale(qData.valAConverted, currentLocale))
          .replace('{unitB}', qData.unitB)
          .replace('{sym}', qData.correct)
          .replace('{valB}', formatNumberLocale(qData.valB, currentLocale))
      : t.q7FbDiff
          .replace('{valA}', formatNumberLocale(qData.valA, currentLocale))
          .replace('{unitA}', qData.unitA)
          .replace('{valAConverted}', formatNumberLocale(qData.valAConverted, currentLocale))
          .replace('{unitB}', qData.unitB)
          .replace('{sym}', qData.correct)
          .replace('{valB}', formatNumberLocale(qData.valB, currentLocale));

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
            {t.q7Prompt}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-lg sm:text-2xl font-mono font-black text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span>{formatNumberLocale(qData.valA, currentLocale)} {qData.unitA}</span>

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
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>

            <span>{formatNumberLocale(qData.valB, currentLocale)} {qData.unitB}</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {fbText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q7FbErrorLead}{' '}
                <span className="font-mono font-bold text-rose-900">
                  {formatNumberLocale(qData.valA, currentLocale)} {qData.unitA} {qData.correct} {formatNumberLocale(qData.valB, currentLocale)} {qData.unitB}
                </span>.{' '}
                {fbText}
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
      backUrl={t.backUrl}
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href={t.theoryUrl}
          className="bg-cyan-100 hover:bg-cyan-200 text-cyan-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 {t.title}
            </h1>
            <p className="text-cyan-100 text-xs sm:text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-cyan-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderBigToSmall('q1', questions.q1, 1)}
          {renderBigToSmall('q2', questions.q2, 2)}

          {renderSmallToBig('q3', questions.q3, 3)}
          {renderSmallToBig('q4', questions.q4, 4)}

          {renderSuitableUnit('q5', questions.q5, 5)}
          {renderSuitableUnit('q6', questions.q6, 6)}

          {renderComparison('q7', questions.q7, 7)}
          {renderComparison('q8', questions.q8, 8)}

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

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / {totalQuestions}</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{Math.round((score / totalQuestions) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> {t.newQuestionsBtn}
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.bottomPrompt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
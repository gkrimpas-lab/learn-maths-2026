// pages/d-dimotikou/9-baros-ask.js
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

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumberByLocale(num, isEn) {
  if (num === null || num === undefined || isNaN(num)) return '';
  return Number(num).toLocaleString(isEn ? 'en-US' : 'el-GR');
}

// Δεξαμενή κατάλληλων μονάδων μέτρησης με πλήρη δίγλωσση υποστήριξη
const SUITABLE_UNITS_DATA = [
  // ΤΟΝΟΙ (t)
  {
    q: { el: 'το βάρος ενός ενήλικου αφρικανικού ελέφαντα', en: 'the weight of an adult African elephant' },
    correctKey: 't',
    contextDesc: { el: 'πολύ μεγάλα ζώα της ξηράς', en: 'very large land animals' }
  },
  {
    q: { el: 'το βάρος ενός φορτηγού αυτοκινήτου με το φορτίο του', en: 'the weight of a loaded cargo truck' },
    correctKey: 't',
    contextDesc: { el: 'βαριά οχήματα μεταφορών', en: 'heavy freight vehicles' }
  },
  {
    q: { el: 'το βάρος ενός επιβατηγού πλοίου', en: 'the weight of a passenger cruise ship' },
    correctKey: 't',
    contextDesc: { el: 'πλοία και ναυπηγήματα', en: 'ships and sea vessels' }
  },
  {
    q: { el: 'τη συνολική ετήσια σοδειά σιταριού ενός μεγάλου αγροκτήματος', en: 'the annual wheat harvest of a large commercial farm' },
    correctKey: 't',
    contextDesc: { el: 'μεγάλες αγροτικές παραγωγές', en: 'large agricultural harvests' }
  },
  {
    q: { el: 'το βάρος μιας γαλάζιας φάλαινας στον ωκεανό', en: 'the weight of a blue whale in the ocean' },
    correctKey: 't',
    contextDesc: { el: 'τα μεγαλύτερα θηλαστικά του πλανήτη', en: 'the largest marine mammals on Earth' }
  },
  {
    q: { el: 'το βάρος ενός αεροπλάνου τύπου Boeing', en: 'the weight of a Boeing commercial airplane' },
    correctKey: 't',
    contextDesc: { el: 'μεγάλα αεροσκάφη', en: 'large commercial aircraft' }
  },

  // ΚΙΛΑ (kg)
  {
    q: { el: "το βάρος ενός μαθητή της Δ' Δημοτικού", en: 'the weight of a 4th-grade student' },
    correctKey: 'kg',
    contextDesc: { el: 'το ανθρώπινο σωματικό βάρος', en: 'human body weight' }
  },
  {
    q: { el: 'το βάρος μιας σακούλας με φρέσκα πορτοκάλια και μήλα', en: 'the weight of a grocery bag filled with fresh oranges and apples' },
    correctKey: 'kg',
    contextDesc: { el: 'αγορές φρούτων στη λαϊκή', en: 'grocery purchases of fresh fruit' }
  },
  {
    q: { el: 'το βάρος ενός σκύλου ράτσας λαμπραντόρ', en: 'the weight of a Labrador retriever dog' },
    correctKey: 'kg',
    contextDesc: { el: 'κατοικίδια ζώα μεσαίου μεγέθους', en: 'medium-sized pets' }
  },
  {
    q: { el: 'το βάρος ενός ποδηλάτου βουνού', en: 'the weight of a mountain bike' },
    correctKey: 'kg',
    contextDesc: { el: 'αθλητικό εξοπλισμό', en: 'sports equipment' }
  },
  {
    q: { el: 'το βάρος ενός σακιού με πατάτες', en: 'the weight of a sack of potatoes' },
    correctKey: 'kg',
    contextDesc: { el: 'συσκευασμένα τρόφιμα', en: 'bulk staple foods' }
  },
  {
    q: { el: 'το βάρος ενός σχολικού γραφείου', en: 'the weight of a school desk' },
    correctKey: 'kg',
    contextDesc: { el: 'σχολικά έπιπλα', en: 'classroom furniture' }
  },

  // ΓΡΑΜΜΑΡΙΑ (g)
  {
    q: { el: 'το βάρος μιας πλάκας σοκολάτας', en: 'the weight of a chocolate bar' },
    correctKey: 'g',
    contextDesc: { el: 'τυποποιημένα γλυκίσματα', en: 'packaged confectionery items' }
  },
  {
    q: { el: 'το βάρος ενός χρυσού δαχτυλιδιού', en: 'the weight of a gold ring' },
    correctKey: 'g',
    contextDesc: { el: 'κοσμήματα και πολύτιμα μέταλλα', en: 'jewelry and precious metals' }
  },
  {
    q: { el: 'το βάρος ενός αυγού κότας', en: 'the weight of a chicken egg' },
    correctKey: 'g',
    contextDesc: { el: 'μικρά μεμονωμένα τρόφιμα', en: 'individual small food items' }
  },
  {
    q: { el: 'το βάρος ενός ταχυδρομικού φακέλου με μια κάρτα', en: 'the weight of a postal envelope with a greeting card' },
    correctKey: 'g',
    contextDesc: { el: 'αλληλογραφία και επιστολές', en: 'letters and postal mail' }
  },
  {
    q: { el: 'το βάρος μιας κουταλιάς μαγειρικού αλατιού', en: 'the weight of a spoonful of table salt' },
    correctKey: 'g',
    contextDesc: { el: 'μικρές δόσεις μπαχαρικών', en: 'small servings of cooking ingredients' }
  },
  {
    q: { el: 'το βάρος μιας γόμας σχεδίασης', en: 'the weight of a pencil eraser' },
    correctKey: 'g',
    contextDesc: { el: 'μικρά σχολικά είδη', en: 'small stationery supplies' }
  }
];

// Συγκεντρωτικό λεξικό μεταφράσεων i18n
const TRANSLATIONS = {
  el: {
    metaTitle: 'Ασκήσεις: Μέτρηση Βάρους & Μετατροπές | LearnMaths.gr',
    metaDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στις μονάδες βάρους: μετατροπές τόνων, κιλών και γραμμαρίων, επιλογή κατάλληλης μονάδας και σύγκριση.",
    backText: "Δ' Δημοτικού",
    theoryBtn: 'Θεωρία',
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: '📝 Ασκήσεις: Μέτρηση Βάρους',
    heroDesc: 'Πατώντας «Νέες Ασκήσεις», οι τιμές και τα ερωτήματα ανανεώνονται αυτόματα από τη δεξαμενή!',
    newExercisesBtn: '🔄 Νέες Ασκήσεις',
    checkAnswersBtn: '🎯 Έλεγχος Απαντήσεων',
    convertPrompt: 'Μετάτρεψε τη μονάδα μέτρησης βάρους:',
    suitableUnitPromptPre: 'Με ποια μονάδα μέτρησης είναι πιο κατάλληλο να εκφράσουμε',
    suitableUnitPromptPost: ';',
    comparePrompt: 'Επίλεξε το κατάλληλο σύμβολο σύγκρισης ( ＜ , ＝ , ＞ ):',
    scoreLabel: '🏆 Σκορ:',
    successRate: 'Επιτυχία:',
    footerPrompt: 'Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!',
    correctAnswerIs: 'Η σωστή απάντηση είναι',
    correctRelationIs: 'Η ορθή σχέση είναι',
    unitLabels: {
      t: 'Τόνοι (t)',
      kg: 'Κιλά (kg)',
      g: 'Γραμμάρια (g)',
      mg: 'Χιλιοστόγραμμα (mg)'
    },
    explainBigToSmall: (val, from, to, correctFormatted) =>
      `Για να μετατρέψουμε από ${from} σε ${to}, πολλαπλασιάζουμε με το 1.000: ${val} · 1.000 ＝ ${correctFormatted} ${to}.`,
    explainSmallToBig: (valFormatted, from, to, correctFormatted) =>
      `Για να μετατρέψουμε από ${from} σε ${to}, διαιρούμε με το 1.000: ${valFormatted} : 1.000 ＝ ${correctFormatted} ${to}.`,
    explainSuitable: (context, correctUnitName) =>
      `Για να μετρήσουμε ${context}, η καταλληλότερη μονάδα μέτρησης είναι τα ${correctUnitName}.`,
    explainComparison: (valA, unitA, convertedAFormatted, unitB, correctSym, valBFormatted) =>
      `Μετατρέποντας στην ίδια μονάδα: ${valA} ${unitA} ＝ ${convertedAFormatted} ${unitB}, επομένως ισχύει ${valA} ${unitA} ${correctSym} ${valBFormatted} ${unitB}.`
  },
  en: {
    metaTitle: 'Exercises: Weight Measurement & Conversions | LearnMaths.gr',
    metaDesc: 'Interactive 4th-grade math exercises on weight units: conversions between metric tons, kilograms, and grams, choosing the appropriate unit, and comparisons.',
    backText: 'Grade 4',
    theoryBtn: 'Theory',
    gradeBadge: 'GRADE 4 • PRACTICE',
    heroTitle: '📝 Exercises: Weight Measurement',
    heroDesc: 'By clicking "New Exercises", values and questions regenerate dynamically from the pool!',
    newExercisesBtn: '🔄 New Exercises',
    checkAnswersBtn: '🎯 Check Answers',
    convertPrompt: 'Convert the weight measurement unit:',
    suitableUnitPromptPre: 'Which unit of measurement is most appropriate to express',
    suitableUnitPromptPost: '?',
    comparePrompt: 'Select the appropriate comparison symbol ( ＜ , ＝ , ＞ ):',
    scoreLabel: '🏆 Score:',
    successRate: 'Score:',
    footerPrompt: 'Fill in your answers and click "Check Answers"!',
    correctAnswerIs: 'The correct answer is',
    correctRelationIs: 'The correct statement is',
    unitLabels: {
      t: 'Metric Tons (t)',
      kg: 'Kilograms (kg)',
      g: 'Grams (g)',
      mg: 'Milligrams (mg)'
    },
    explainBigToSmall: (val, from, to, correctFormatted) =>
      `To convert from ${from} to ${to}, multiply by 1,000: ${val} · 1,000 ＝ ${correctFormatted} ${to}.`,
    explainSmallToBig: (valFormatted, from, to, correctFormatted) =>
      `To convert from ${from} to ${to}, divide by 1,000: ${valFormatted} : 1,000 ＝ ${correctFormatted} ${to}.`,
    explainSuitable: (context, correctUnitName) =>
      `To measure ${context}, the most appropriate unit of measurement is ${correctUnitName}.`,
    explainComparison: (valA, unitA, convertedAFormatted, unitB, correctSym, valBFormatted) =>
      `Converting to the same unit: ${valA} ${unitA} ＝ ${convertedAFormatted} ${unitB}, hence ${valA} ${unitA} ${correctSym} ${valBFormatted} ${unitB}.`
  }
};

// 1. Άσκηση: Μετατροπή από Μεγαλύτερη σε Μικρότερη Μονάδα (Input)
function makeBigToSmallQuestion(prevQuestion = null) {
  const types = [
    { from: 'kg', to: 'g', factor: 1000, min: 2, max: 25 },
    { from: 't', to: 'kg', factor: 1000, min: 2, max: 15 }
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

// 2. Άσκηση: Μετατροπή από Μικρότερη σε Μεγαλύτερη Μονάδα (Input)
function makeSmallToBigQuestion(prevQuestion = null) {
  const types = [
    { from: 'g', to: 'kg', factor: 1000, min: 2, max: 20 },
    { from: 'kg', to: 't', factor: 1000, min: 2, max: 12 }
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

// 3. Άσκηση: Επιλογή Κατάλληλης Μονάδας Βάρους (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeSuitableUnitQuestion(prevQuestion = null) {
  let selected;

  while (true) {
    selected = SUITABLE_UNITS_DATA[getRandomInt(0, SUITABLE_UNITS_DATA.length - 1)];
    if (!prevQuestion || prevQuestion.selectedItem !== selected) {
      break;
    }
  }

  const allKeys = ['t', 'kg', 'g', 'mg'];
  const wrongKeys = allKeys.filter((k) => k !== selected.correctKey);
  const shuffledKeys = [...new Set([selected.correctKey, ...wrongKeys])].sort(() => Math.random() - 0.5);

  return {
    selectedItem: selected,
    correctKey: selected.correctKey,
    optionKeys: shuffledKeys
  };
}

// 4. Άσκηση: Σύγκριση Βαρών (＜, ＝, ＞)
function makeComparisonQuestion(prevQuestion = null) {
  const pairs = [
    { unitA: 'kg', unitB: 'g', factorA: 1000 },
    { unitA: 't', unitB: 'kg', factorA: 1000 }
  ];

  let pair, valA, valB, correctSym;

  while (true) {
    pair = pairs[getRandomInt(0, pairs.length - 1)];
    valA = getRandomInt(2, 12);

    valB = valA * pair.factorA;
    if (Math.random() > 0.35) {
      valB = (valA + getRandomInt(-2, 2)) * pair.factorA;
      if (valB <= 0 || valB === valA * pair.factorA) {
        valB = valA * pair.factorA + (Math.random() > 0.5 ? 500 : -500);
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
    correct: correctSym
  };
}

// Δημιουργία των 8 Ερωτήσεων
function generateQuestions() {
  const q1 = makeBigToSmallQuestion();
  const q2 = makeBigToSmallQuestion(q1);

  const q3 = makeSmallToBigQuestion();
  const q4 = makeSmallToBigQuestion(q3);

  const q5 = makeSuitableUnitQuestion();
  const q6 = makeSuitableUnitQuestion(q5);

  const q7 = makeComparisonQuestion();
  const q8 = makeComparisonQuestion(q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function BarosAskPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];
  const isEn = locale === 'en';

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions());
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
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
    if (answers.q5 === questions.q5.correctKey) currentScore += 1;
    if (answers.q6 === questions.q6.correctKey) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Q1 & Q2: Μεγάλη ➔ Μικρή Μονάδα (Input)
  const renderBigToSmall = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    const correctFormatted = formatNumberByLocale(qData.correct, isEn);
    const explainText = t.explainBigToSmall(qData.val, qData.from, qData.to, correctFormatted);

    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-emerald-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.convertPrompt} <span className="text-emerald-600 font-mono font-black text-lg sm:text-xl">{qData.val} {qData.from}</span> ＝ <span className="text-emerald-600 font-mono font-black text-lg sm:text-xl">? {qData.to}</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{qData.val} {qData.from}</span>
            <span>＝</span>
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
              className="w-32 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-emerald-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
            />
            <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">{qData.to}</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctAnswerIs} <span className="font-mono font-bold text-rose-900">{correctFormatted} {qData.to}</span>. {explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Μικρή ➔ Μεγάλη Μονάδα (Input)
  const renderSmallToBig = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    const valFormatted = formatNumberByLocale(qData.val, isEn);
    const correctFormatted = formatNumberByLocale(qData.correct, isEn);
    const explainText = t.explainSmallToBig(valFormatted, qData.from, qData.to, correctFormatted);

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
            {t.convertPrompt} <span className="text-teal-600 font-mono font-black text-lg sm:text-xl">{valFormatted} {qData.from}</span> ＝ <span className="text-teal-600 font-mono font-black text-lg sm:text-xl">? {qData.to}</span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{valFormatted} {qData.from}</span>
            <span>＝</span>
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
              className="w-32 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-teal-900 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
            />
            <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">{qData.to}</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctAnswerIs} <span className="font-mono font-bold text-rose-900">{correctFormatted} {qData.to}</span>. {explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Κατάλληλη Μονάδα (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
  const renderSuitableUnit = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correctKey;
    const questionText = qData.selectedItem.q[locale];
    const contextText = qData.selectedItem.contextDesc[locale];
    const correctUnitName = t.unitLabels[qData.correctKey];
    const explainText = t.explainSuitable(contextText, correctUnitName);

    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-sky-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.suitableUnitPromptPre} <span className="text-sky-600 font-extrabold">{questionText}</span>{t.suitableUnitPromptPost}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.optionKeys.map((key) => {
            const isSelected = answers[qKey] === key;
            const labelText = t.unitLabels[key];

            return (
              <label
                key={key}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-sky-600 bg-sky-50/80 font-bold text-sky-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${qKey}-opt-${key}`}
                  name={qKey}
                  value={key}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, key)}
                  disabled={submitted}
                  className="w-4 h-4 text-sky-600 focus:ring-sky-500 shrink-0"
                />
                <span className="break-words whitespace-normal leading-snug flex-1">{labelText}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctAnswerIs}: <strong className="font-bold text-rose-900">{correctUnitName}</strong>. {explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Σύγκριση Βαρών (Buttons)
  const renderComparison = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    const convertedAVal = qData.valA * qData.factorA;
    const convertedAFormatted = formatNumberByLocale(convertedAVal, isEn);
    const valBFormatted = formatNumberByLocale(qData.valB, isEn);
    const explainText = t.explainComparison(
      qData.valA,
      qData.unitA,
      convertedAFormatted,
      qData.unitB,
      qData.correct,
      valBFormatted
    );

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
            {t.comparePrompt}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-lg sm:text-2xl font-mono font-black text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span>{qData.valA} {qData.unitA}</span>

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

            <span>{valBFormatted} {qData.unitB}</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctRelationIs} <span className="font-mono font-bold text-rose-900">{qData.valA} {qData.unitA} {qData.correct} {valBFormatted} {qData.unitB}</span>. {explainText}
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
          href="/d-dimotikou/9-baros"
          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.gradeBadge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.heroTitle}
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm md:text-base">
              {t.heroDesc}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-emerald-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {t.newExercisesBtn}
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
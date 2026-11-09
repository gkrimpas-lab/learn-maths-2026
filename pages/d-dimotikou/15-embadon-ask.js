// pages/d-dimotikou/15-embadon-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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

const translations = {
  el: {
    metaTitle: 'Ασκήσεις: Εμβαδόν & Μονάδες Μέτρησης | LearnMaths.gr',
    metaDesc:
      "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στο εμβαδόν: μετατροπές τ.μ., τ.δ. και τ.εκ., επιλογή κατάλληλης μονάδας επιφάνειας και σύγκριση.",
    backText: "Δ' Δημοτικού",
    theoryBtn: 'Θεωρία',
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: '📝 Ασκήσεις: Μέτρηση Εμβαδού',
    subtitle: 'Πατώντας «Νέες Ασκήσεις», οι αριθμοί και οι μονάδες ανανεώνονται αυτόματα από τη δεξαμενή!',
    newQuestionsBtn: '🔄 Νέες Ασκήσεις',
    checkBtn: '🎯 Έλεγχος Απαντήσεων',
    scoreLabel: '🏆 Σκορ:',
    successRate: 'Επιτυχία:',
    footerPrompt: 'Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!',
    qConvertLabel: 'Μετάτρεψε τη μονάδα εμβαδού:',
    qSuitableLabel: 'Με ποια μονάδα μέτρησης είναι πιο κατάλληλο να εκφράσουμε',
    qCompareLabel: 'Επίλεξε το κατάλληλο σύμβολο σύγκρισης ( ＜ , ＝ , ＞ ):',
    correctAnswerIs: 'Η σωστή απάντηση είναι',
    correctUnitIs: 'Η καταλληλότερη μονάδα είναι:',
    correctRelationIs: 'Η σωστή σχέση είναι',
    units: {
      m2: 'τ.μ.',
      dm2: 'τ.δ.',
      cm2: 'τ.εκ.',
      km2: 'τ.χλμ.',
    },
    suitableUnits: {
      m2: 'Τετραγωνικά μέτρα (τ.μ.)',
      cm2: 'Τετραγωνικά εκατοστά (τ.εκ.)',
      dm2: 'Τετραγωνικά δεκατόμετρα (τ.δ.)',
      km2: 'Τετραγωνικά χιλιόμετρα (τ.χλμ.)',
    },
    explainBigToSmall: (val, from, to, factor, correct, fmt) =>
      `Για να μετατρέψουμε από ${from} σε ${to}, πολλαπλασιάζουμε με το ${fmt(factor)}: ${fmt(val)} · ${fmt(factor)} ＝ ${fmt(correct)} ${to}.`,
    explainSmallToBig: (val, from, to, factor, correct, fmt) =>
      `Για να μετατρέψουμε από ${from} σε ${to}, διαιρούμε με το ${fmt(factor)}: ${fmt(val)} : ${fmt(factor)} ＝ ${fmt(correct)} ${to}.`,
    explainSuitable: (contextDesc, unitName) =>
      `Για να μετρήσουμε ${contextDesc}, η πλέον κατάλληλη μονάδα μέτρησης είναι τα ${unitName}.`,
    explainCompare: (valA, unitA, valB, unitB, factorA, correctSym, fmt) =>
      `Μετατρέποντας στην ίδια μονάδα: ${fmt(valA)} ${unitA} ＝ ${fmt(valA * factorA)} ${unitB}, επομένως ισχύει ${fmt(valA)} ${unitA} ${correctSym} ${fmt(valB)} ${unitB}.`,
    suitableContexts: [
      { id: 'c1', q: 'το εμβαδόν του δαπέδου μιας σχολικής αίθουσας', correctUnitKey: 'm2', contextDesc: 'επιφάνειες δωματίων' },
      { id: 'c2', q: 'το εμβαδόν μιας σελίδας ενός σχολικού τετραδίου', correctUnitKey: 'cm2', contextDesc: 'επιφάνειες βιβλίων και χαρτιών' },
      { id: 'c3', q: 'το εμβαδόν ενός γηπέδου ποδοσφαίρου', correctUnitKey: 'm2', contextDesc: 'μεγάλους αθλητικούς χώρους' },
      { id: 'c4', q: 'το εμβαδόν της επιφάνειας μιας τραπεζικής κάρτας', correctUnitKey: 'cm2', contextDesc: 'μικρά επίπεδα αντικείμενα' },
      { id: 'c5', q: 'το εμβαδόν της αυλής ενός σχολείου ή σπιτιού', correctUnitKey: 'm2', contextDesc: 'οικόπεδα και αυλές' },
      { id: 'c6', q: 'το εμβαδόν μιας τυπωμένης φωτογραφίας διάστασης 10 × 15 cm', correctUnitKey: 'cm2', contextDesc: 'μικρές φωτογραφικές επιφάνειες' },
      { id: 'c7', q: 'το εμβαδόν της οθόνης ενός κινητού τηλεφώνου smartphone', correctUnitKey: 'cm2', contextDesc: 'επιφάνειες φορητών συσκευών' },
      { id: 'c8', q: 'το εμβαδόν μιας πόλης ή ενός μεγάλου δάσους', correctUnitKey: 'km2', contextDesc: 'τεράστιες γεωγραφικές εκτάσεις' },
    ],
  },
  en: {
    metaTitle: 'Exercises: Area & Measurement Units | LearnMaths.gr',
    metaDesc:
      'Interactive Grade 4 math exercises on area: conversions between sq.m, sq.dm, and sq.cm, selecting the appropriate unit of area, and comparison.',
    backText: 'Grade 4',
    theoryBtn: 'Theory',
    badge: 'GRADE 4 • PRACTICE',
    title: '📝 Exercises: Area Measurement',
    subtitle: 'Click "New Exercises" to automatically refresh numbers and units from the pool!',
    newQuestionsBtn: '🔄 New Exercises',
    checkBtn: '🎯 Check Answers',
    scoreLabel: '🏆 Score:',
    successRate: 'Success:',
    footerPrompt: 'Fill in your answers and click "Check Answers"!',
    qConvertLabel: 'Convert the unit of area:',
    qSuitableLabel: 'Which unit of measurement is most appropriate to express',
    qCompareLabel: 'Select the appropriate comparison symbol ( ＜ , ＝ , ＞ ):',
    correctAnswerIs: 'The correct answer is',
    correctUnitIs: 'The most appropriate unit is:',
    correctRelationIs: 'The correct relationship is',
    units: {
      m2: 'sq.m',
      dm2: 'sq.dm',
      cm2: 'sq.cm',
      km2: 'sq.km',
    },
    suitableUnits: {
      m2: 'Square meters (sq.m)',
      cm2: 'Square centimeters (sq.cm)',
      dm2: 'Square decimeters (sq.dm)',
      km2: 'Square kilometers (sq.km)',
    },
    explainBigToSmall: (val, from, to, factor, correct, fmt) =>
      `To convert from ${from} to ${to}, we multiply by ${fmt(factor)}: ${fmt(val)} · ${fmt(factor)} ＝ ${fmt(correct)} ${to}.`,
    explainSmallToBig: (val, from, to, factor, correct, fmt) =>
      `To convert from ${from} to ${to}, we divide by ${fmt(factor)}: ${fmt(val)} : ${fmt(factor)} ＝ ${fmt(correct)} ${to}.`,
    explainSuitable: (contextDesc, unitName) =>
      `To measure ${contextDesc}, the most suitable unit is ${unitName}.`,
    explainCompare: (valA, unitA, valB, unitB, factorA, correctSym, fmt) =>
      `Converting to the same unit: ${fmt(valA)} ${unitA} ＝ ${fmt(valA * factorA)} ${unitB}, so ${fmt(valA)} ${unitA} ${correctSym} ${fmt(valB)} ${unitB}.`,
    suitableContexts: [
      { id: 'c1', q: 'the floor area of a school classroom', correctUnitKey: 'm2', contextDesc: 'room floor surfaces' },
      { id: 'c2', q: 'the surface area of a school notebook page', correctUnitKey: 'cm2', contextDesc: 'book and paper surfaces' },
      { id: 'c3', q: 'the area of a soccer field', correctUnitKey: 'm2', contextDesc: 'large sports fields' },
      { id: 'c4', q: 'the surface area of a bank credit card', correctUnitKey: 'cm2', contextDesc: 'small flat items' },
      { id: 'c5', q: 'the area of a schoolyard or backyard', correctUnitKey: 'm2', contextDesc: 'yards and plots' },
      { id: 'c6', q: 'the area of a printed photograph sized 10 × 15 cm', correctUnitKey: 'cm2', contextDesc: 'small photo surfaces' },
      { id: 'c7', q: 'the screen area of a smartphone', correctUnitKey: 'cm2', contextDesc: 'portable device screens' },
      { id: 'c8', q: 'the area of a city or a large forest', correctUnitKey: 'km2', contextDesc: 'vast geographical regions' },
    ],
  },
};

function formatNum(num, locale) {
  if (typeof num !== 'number') return num;
  return locale === 'en' ? num.toLocaleString('en-US') : num.toLocaleString('el-GR');
}

// 1. Μετατροπή από Μεγάλη σε Μικρότερη Μονάδα (Input)
function makeBigToSmallQuestion(t, locale, prevQuestion = null) {
  const types = [
    { fromKey: 'm2', toKey: 'dm2', factor: 100, min: 2, max: 25 },
    { fromKey: 'dm2', toKey: 'cm2', factor: 100, min: 2, max: 30 },
    { fromKey: 'm2', toKey: 'cm2', factor: 10000, min: 1, max: 8 },
  ];

  let chosen, val, correct;
  while (true) {
    chosen = types[getRandomInt(0, types.length - 1)];
    val = getRandomInt(chosen.min, chosen.max);
    correct = val * chosen.factor;

    if (!prevQuestion || prevQuestion.fromKey !== chosen.fromKey || prevQuestion.val !== val) {
      break;
    }
  }

  const from = t.units[chosen.fromKey];
  const to = t.units[chosen.toKey];

  return {
    val,
    fromKey: chosen.fromKey,
    toKey: chosen.toKey,
    from,
    to,
    factor: chosen.factor,
    correct,
    explainText: t.explainBigToSmall(val, from, to, chosen.factor, correct, (n) => formatNum(n, locale)),
  };
}

// 2. Μετατροπή από Μικρή σε Μεγαλύτερη Μονάδα (Input)
function makeSmallToBigQuestion(t, locale, prevQuestion = null) {
  const types = [
    { fromKey: 'dm2', toKey: 'm2', factor: 100, min: 2, max: 20 },
    { fromKey: 'cm2', toKey: 'dm2', factor: 100, min: 2, max: 30 },
    { fromKey: 'cm2', toKey: 'm2', factor: 10000, min: 1, max: 8 },
  ];

  let chosen, correct, val;
  while (true) {
    chosen = types[getRandomInt(0, types.length - 1)];
    correct = getRandomInt(chosen.min, chosen.max);
    val = correct * chosen.factor;

    if (!prevQuestion || prevQuestion.fromKey !== chosen.fromKey || prevQuestion.val !== val) {
      break;
    }
  }

  const from = t.units[chosen.fromKey];
  const to = t.units[chosen.toKey];

  return {
    val,
    fromKey: chosen.fromKey,
    toKey: chosen.toKey,
    from,
    to,
    factor: chosen.factor,
    correct,
    explainText: t.explainSmallToBig(val, from, to, chosen.factor, correct, (n) => formatNum(n, locale)),
  };
}

// 3. Κατάλληλη Μονάδα Εμβαδού (MCQ)
function makeSuitableUnitQuestion(t, prevQuestion = null) {
  let selected;
  while (true) {
    selected = t.suitableContexts[getRandomInt(0, t.suitableContexts.length - 1)];
    if (!prevQuestion || prevQuestion.id !== selected.id) {
      break;
    }
  }

  const correctUnitText = t.suitableUnits[selected.correctUnitKey];
  const allUnitKeys = ['m2', 'cm2', 'dm2', 'km2'];
  const rawChoices = allUnitKeys.map((k) => t.suitableUnits[k]);
  const uniqueChoices = [...new Set(rawChoices)];
  const wrongChoices = uniqueChoices.filter((u) => u !== correctUnitText);

  const options = [
    { text: correctUnitText, isCorrect: true },
    { text: wrongChoices[0], isCorrect: false },
    { text: wrongChoices[1], isCorrect: false },
    { text: wrongChoices[2], isCorrect: false },
  ].sort(() => Math.random() - 0.5);

  return {
    id: selected.id,
    qText: selected.q,
    options,
    correct: correctUnitText,
    explainText: t.explainSuitable(selected.contextDesc, correctUnitText),
  };
}

// 4. Σύγκριση Εμβαδών (＜, ＝, ＞)
function makeComparisonQuestion(t, locale, prevQuestion = null) {
  const pairs = [
    { unitAKey: 'm2', unitBKey: 'dm2', factorA: 100 },
    { unitAKey: 'dm2', unitBKey: 'cm2', factorA: 100 },
    { unitAKey: 'm2', unitBKey: 'cm2', factorA: 10000 },
  ];

  let pair, valA, valB, correctSym;
  while (true) {
    pair = pairs[getRandomInt(0, pairs.length - 1)];
    valA = getRandomInt(2, 12);

    valB = valA * pair.factorA;
    if (Math.random() > 0.35) {
      valB = (valA + getRandomInt(-2, 2)) * pair.factorA;
      if (valB <= 0 || valB === valA * pair.factorA) {
        valB = valA * pair.factorA + (pair.factorA >= 1000 ? 500 : 50);
      }
    }

    const realBInAUnit = valB / pair.factorA;
    correctSym = '＝';
    if (valA > realBInAUnit) correctSym = '＞';
    if (valA < realBInAUnit) correctSym = '＜';

    if (
      !prevQuestion ||
      prevQuestion.valA !== valA ||
      prevQuestion.valB !== valB ||
      prevQuestion.unitAKey !== pair.unitAKey
    ) {
      break;
    }
  }

  const unitA = t.units[pair.unitAKey];
  const unitB = t.units[pair.unitBKey];

  return {
    valA,
    valB,
    unitAKey: pair.unitAKey,
    unitBKey: pair.unitBKey,
    unitA,
    unitB,
    factorA: pair.factorA,
    correct: correctSym,
    explainText: t.explainCompare(valA, unitA, valB, unitB, pair.factorA, correctSym, (n) =>
      formatNum(n, locale)
    ),
  };
}

function generateQuestions(t, locale) {
  const q1 = makeBigToSmallQuestion(t, locale);
  const q2 = makeBigToSmallQuestion(t, locale, q1);

  const q3 = makeSmallToBigQuestion(t, locale);
  const q4 = makeSmallToBigQuestion(t, locale, q3);

  const q5 = makeSuitableUnitQuestion(t);
  const q6 = makeSuitableUnitQuestion(t, q5);

  const q7 = makeComparisonQuestion(t, locale);
  const q8 = makeComparisonQuestion(t, locale, q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function EmbadonAskPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(t, locale));
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
    if (clean.length <= 10) {
      setAnswers((prev) => ({ ...prev, [key]: clean }));
    }
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

  // Render Q1 & Q2: Μεγάλη ➔ Μικρή (Input)
  const renderBigToSmall = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-100'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-emerald-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.qConvertLabel}{' '}
            <span className="text-emerald-600 font-mono font-black text-lg sm:text-xl">
              {formatNum(qData.val, locale)} {qData.from}
            </span>{' '}
            ＝{' '}
            <span className="text-emerald-600 font-mono font-black text-lg sm:text-xl">
              ? {qData.to}
            </span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>
              {formatNum(qData.val, locale)} {qData.from}
            </span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              maxLength={10}
              placeholder="?"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-emerald-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
            />
            <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">
              {qData.to}
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
                {t.correctAnswerIs}{' '}
                <span className="font-mono font-bold text-rose-900">
                  {formatNum(qData.correct, locale)} {qData.to}
                </span>
                . {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Μικρή ➔ Μεγάλη (Input)
  const renderSmallToBig = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-100'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-teal-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.qConvertLabel}{' '}
            <span className="text-teal-600 font-mono font-black text-lg sm:text-xl">
              {formatNum(qData.val, locale)} {qData.from}
            </span>{' '}
            ＝{' '}
            <span className="text-teal-600 font-mono font-black text-lg sm:text-xl">
              ? {qData.to}
            </span>
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>
              {formatNum(qData.val, locale)} {qData.from}
            </span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              maxLength={10}
              placeholder="?"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-teal-900 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
            />
            <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">
              {qData.to}
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
                {t.correctAnswerIs}{' '}
                <span className="font-mono font-bold text-rose-900">
                  {formatNum(qData.correct, locale)} {qData.to}
                </span>
                . {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Κατάλληλη Μονάδα (MCQ)
  const renderSuitableUnit = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-100'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-indigo-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.qSuitableLabel} <span className="text-indigo-600 font-extrabold">{qData.qText}</span>;
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt.text;
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
                  value={opt.text}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt.text)}
                  disabled={submitted}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0"
                />
                <span className="break-words whitespace-normal leading-snug flex-1">
                  {opt.text}
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
                {t.correctUnitIs} <strong className="font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
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
    return (
      <div
        className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-100'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-amber-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.qCompareLabel}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-lg sm:text-2xl font-mono font-black text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span>
              {formatNum(qData.valA, locale)} {qData.unitA}
            </span>

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

            <span>
              {formatNum(qData.valB, locale)} {qData.unitB}
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
                {t.correctRelationIs}{' '}
                <span className="font-mono font-bold text-rose-900">
                  {formatNum(qData.valA, locale)} {qData.unitA} {qData.correct}{' '}
                  {formatNum(qData.valB, locale)} {qData.unitB}
                </span>
                . {qData.explainText}
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
          href="/d-dimotikou/15-embadon"
          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.title}
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm md:text-base">{t.subtitle}</p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-emerald-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {t.newQuestionsBtn}
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
                {t.checkBtn}
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
              <span>{t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {t.successRate}{' '}
                <span className="text-emerald-400 font-black">
                  {Math.round((score / 8) * 100)}%
                </span>
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
              <p className="text-xs text-slate-400 hidden sm:block">{t.footerPrompt}</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
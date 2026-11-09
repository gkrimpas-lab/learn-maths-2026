// pages/d-dimotikou/29-posotita-igrou-ask.js
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

// Επαναχρησιμοποιήσιμο component για κανονική κατακόρυφη εμφάνιση κλάσματος
function Fraction({ num, den }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-bold leading-none select-none text-[0.95em]">
      <span className="px-1 border-b border-current pb-[1px]">{num}</span>
      <span className="px-1 pt-[1px]">{den}</span>
    </span>
  );
}

// Λεξικό Μεταφράσεων
const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Μέτρηση Ποσότητας Υγρού (L & mL) | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στη χωρητικότητα και τη μέτρηση υγρών: ανάγνωση ογκομετρικού δοχείου, μετατροπές λίτρων και χιλιοστολίτρων και κλασματικά μέρη.",
    backText: "Δ' Δημοτικού",
    badgeHeader: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    theoryBtn: "Θεωρία",
    headerTitle: "Ασκήσεις: Μέτρηση Ποσότητας Υγρού (L & mL)",
    headerDesc: "Πατώντας «Νέες Ασκήσεις», τα ογκομετρικά δοχεία, οι μετατροπές και τα προβλήματα ανανεώνονται αυτόματα!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    footerPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    resultLabel: "Αποτέλεσμα:",
    inputResultPlaceholder: "Αποτέλεσμα",
    correctAnswerIs: "Η σωστή απάντηση είναι:",
    beakerQ: "Παρατήρησε τη στάθμη του υγρού στο ογκομετρικό δοχείο και συμπλήρωσε πόσα χιλιοστόλιτρα (mL) περιέχει:",
    beakerExplain: (targetMLStr) => `Η στάθμη του υγρού φτάνει ακριβώς στην ένδειξη των ${targetMLStr} mL.`,
    convLtoMLQ: (liters) => `Πόσα χιλιοστόλιτρα (mL) ισοδυναμούν με ${liters} λίτρα (L);`,
    convLtoMLExplain: (liters, correctStr) => `Επειδή 1 L ＝ 1.000 mL, τα ${liters} L είναι: ${liters} · 1.000 ＝ ${correctStr} mL.`,
    convMLtoLQ: (mlStr) => `Πόσα λίτρα (L) ισοδυναμούν με ${mlStr} χιλιοστόλιτρα (mL);`,
    convMLtoLExplain: (mlStr, liters) => `Επειδή 1.000 mL ＝ 1 L, διαιρούμε με το 1.000: ${mlStr} ： 1.000 ＝ ${liters} L.`,
    unitML: "mL",
    unitL: "L",
    unitGlasses: "ποτήρια",
    fractions: [
      {
        q: (
          <span>
            Πόσα χιλιοστόλιτρα (mL) περιέχει το μισό λίτρο (<Fraction num="1" den="2" /> L);
          </span>
        ),
        correct: "500 mL",
        wrongs: ["250 mL", "100 mL", "750 mL"],
        explainText: "Το μισό λίτρο ισούται με 1.000 ： 2 ＝ 500 mL."
      },
      {
        q: (
          <span>
            Πόσα χιλιοστόλιτρα (mL) περιέχει το ένα τέταρτο του λίτρου (<Fraction num="1" den="4" /> L);
          </span>
        ),
        correct: "250 mL",
        wrongs: ["500 mL", "400 mL", "750 mL"],
        explainText: "Το ένα τέταρτο του λίτρου ισούται με 1.000 ： 4 ＝ 250 mL."
      },
      {
        q: (
          <span>
            Πόσα χιλιοστόλιτρα (mL) περιέχουν τα τρία τέταρτα του λίτρου (<Fraction num="3" den="4" /> L);
          </span>
        ),
        correct: "750 mL",
        wrongs: ["500 mL", "250 mL", "800 mL"],
        explainText: "Τα τρία τέταρτα του λίτρου είναι: 3 · 250 mL ＝ 750 mL."
      },
      {
        q: (
          <span>
            Πόσα χιλιοστόλιτρα (mL) αντιστοιχούν σε 1,5 λίτρο (ένα και μισό λίτρο);
          </span>
        ),
        correct: "1.500 mL",
        wrongs: ["1.050 mL", "1.250 mL", "2.000 mL"],
        explainText: "Έχουμε 1 L ＝ 1.000 mL και μισό λίτρο ＝ 500 mL, άρα 1.000 ＋ 500 ＝ 1.500 mL."
      }
    ],
    wordProblem1: (cans, capacity, totalStr) => ({
      q: `Ένα παιδί ήπιε ${cans} ποτήρια χυμό των ${capacity} mL το καθένα. Πόσα χιλιοστόλιτρα (mL) χυμό ήπιε συνολικά;`,
      explainText: `Υπολογίζουμε: ${cans} · ${capacity} mL ＝ ${totalStr} mL συνολικά.`
    }),
    wordProblem2: (bottles, bottleCap, totalMLStr, totalLStr) => ({
      q: `Αν γεμίσουμε ${bottles} μπουκαλάκια νερό των ${bottleCap} mL (μισού λίτρου) το καθένα, πόσα χιλιοστόλιτρα (mL) νερό έχουμε συνολικά;`,
      explainText: `Υπολογίζουμε: ${bottles} · ${bottleCap} mL ＝ ${totalMLStr} mL (δηλαδή ${totalLStr} λίτρα).`
    }),
    wordProblem3: (liters, totalMLStr, glass, totalGlasses) => ({
      q: (
        <span>
          Έχουμε μια κανάτα με {liters} λίτρα πορτοκαλάδα. Πόσα ποτήρια των {glass} mL (<Fraction num="1" den="4" /> L) μπορούμε να γεμίσουμε;
        </span>
      ),
      explainText: `Μετατρέπουμε τα λίτρα σε mL: ${liters} L ＝ ${totalMLStr} mL. Στη συνέχεια διαιρούμε: ${totalMLStr} ： ${glass} ＝ ${totalGlasses} ποτήρια.`
    }),
    wordProblem4: (count, canML, totalStr) => ({
      q: `Αγοράσαμε ${count} κουτάκια αναψυκτικού των ${canML} mL το καθένα. Πόσα χιλιοστόλιτρα (mL) αναψυκτικού περιέχουν όλα μαζί;`,
      explainText: `Υπολογίζουμε: ${count} · ${canML} mL ＝ ${totalStr} mL συνολικά.`
    })
  },
  en: {
    pageTitle: "Exercises: Measuring Liquid Volume (L & mL) | LearnMaths.gr",
    pageDesc: "Interactive 4th Grade math exercises on capacity and liquid measurement: reading measuring beakers, conversions between liters and milliliters, and fractional parts.",
    backText: "4th Grade",
    badgeHeader: "GRADE 4 • PRACTICE",
    theoryBtn: "Theory",
    headerTitle: "Exercises: Measuring Liquid Volume (L & mL)",
    headerDesc: "Clicking «New Exercises» automatically regenerates the beakers, conversions, and word problems from the pool!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success:",
    footerPrompt: "Complete all questions and click «Check Answers»!",
    resultLabel: "Result:",
    inputResultPlaceholder: "Result",
    correctAnswerIs: "The correct answer is:",
    beakerQ: "Observe the liquid level in the measuring beaker and write how many milliliters (mL) it contains:",
    beakerExplain: (targetMLStr) => `The liquid level reaches exactly the ${targetMLStr} mL mark.`,
    convLtoMLQ: (liters) => `How many milliliters (mL) are equivalent to ${liters} liters (L)?`,
    convLtoMLExplain: (liters, correctStr) => `Since 1 L ＝ 1,000 mL, ${liters} L is: ${liters} · 1,000 ＝ ${correctStr} mL.`,
    convMLtoLQ: (mlStr) => `How many liters (L) are equivalent to ${mlStr} milliliters (mL)?`,
    convMLtoLExplain: (mlStr, liters) => `Since 1,000 mL ＝ 1 L, we divide by 1,000: ${mlStr} ： 1,000 ＝ ${liters} L.`,
    unitML: "mL",
    unitL: "L",
    unitGlasses: "glasses",
    fractions: [
      {
        q: (
          <span>
            How many milliliters (mL) are in half a liter (<Fraction num="1" den="2" /> L)?
          </span>
        ),
        correct: "500 mL",
        wrongs: ["250 mL", "100 mL", "750 mL"],
        explainText: "Half a liter is equal to 1,000 ： 2 ＝ 500 mL."
      },
      {
        q: (
          <span>
            How many milliliters (mL) are in one quarter of a liter (<Fraction num="1" den="4" /> L)?
          </span>
        ),
        correct: "250 mL",
        wrongs: ["500 mL", "400 mL", "750 mL"],
        explainText: "One quarter of a liter is equal to 1,000 ： 4 ＝ 250 mL."
      },
      {
        q: (
          <span>
            How many milliliters (mL) are in three quarters of a liter (<Fraction num="3" den="4" /> L)?
          </span>
        ),
        correct: "750 mL",
        wrongs: ["500 mL", "250 mL", "800 mL"],
        explainText: "Three quarters of a liter is: 3 · 250 mL ＝ 750 mL."
      },
      {
        q: (
          <span>
            How many milliliters (mL) correspond to 1.5 liters (one and a half liters)?
          </span>
        ),
        correct: "1,500 mL",
        wrongs: ["1,050 mL", "1,250 mL", "2,000 mL"],
        explainText: "We have 1 L ＝ 1,000 mL and half a liter ＝ 500 mL, so 1,000 ＋ 500 ＝ 1,500 mL."
      }
    ],
    wordProblem1: (cans, capacity, totalStr) => ({
      q: `A child drank ${cans} glasses of juice with ${capacity} mL each. How many milliliters (mL) of juice did they drink in total?`,
      explainText: `We calculate: ${cans} · ${capacity} mL ＝ ${totalStr} mL in total.`
    }),
    wordProblem2: (bottles, bottleCap, totalMLStr, totalLStr) => ({
      q: `If we fill ${bottles} water bottles of ${bottleCap} mL (half a liter) each, how many milliliters (mL) of water do we have in total?`,
      explainText: `We calculate: ${bottles} · ${bottleCap} mL ＝ ${totalMLStr} mL (which is ${totalLStr} liters).`
    }),
    wordProblem3: (liters, totalMLStr, glass, totalGlasses) => ({
      q: (
        <span>
          We have a pitcher with {liters} liters of orange juice. How many glasses of {glass} mL (<Fraction num="1" den="4" /> L) can we fill?
        </span>
      ),
      explainText: `We convert liters to mL: ${liters} L ＝ ${totalMLStr} mL. Then we divide: ${totalMLStr} ： ${glass} ＝ ${totalGlasses} glasses.`
    }),
    wordProblem4: (count, canML, totalStr) => ({
      q: `We bought ${count} soda cans of ${canML} mL each. How many milliliters (mL) of soda do they contain all together?`,
      explainText: `We calculate: ${count} · ${canML} mL ＝ ${totalStr} mL in total.`
    })
  }
};

// 1. Άσκηση: Ανάγνωση Ογκομετρικού Δοχείου (SVG)
function makeBeakerReadingQuestion(targetML, t, formatNum) {
  const maxCapacity = 2000;
  const fillHeight = Math.min(128, (targetML / maxCapacity) * 128);
  const liquidY = 158 - fillHeight;

  const svgBeaker = (
    <div className="w-40 h-40 sm:w-44 sm:h-44 mx-auto my-2">
      <svg className="w-full h-full block select-none" viewBox="0 0 160 180">
        {/* Υγρό */}
        {targetML > 0 && (
          <rect
            x="42"
            y={liquidY}
            width="76"
            height={fillHeight}
            fill="#06b6d4"
            fillOpacity="0.8"
            rx="4"
          />
        )}
        {/* Περίγραμμα Δοχείου */}
        <path
          d="M 40,25 L 40,150 A 10,10 0 0,0 50,160 L 110,160 A 10,10 0 0,0 120,150 L 120,25"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="4"
        />
        <path d="M 35,25 L 125,25" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
        <path d="M 35,25 L 25,20 L 40,35" fill="none" stroke="#38bdf8" strokeWidth="3" />

        {/* Γραμμές διαβάθμισης */}
        <line x1="105" y1="30" x2="118" y2="30" stroke="#f8fafc" strokeWidth="2" />
        <text x="98" y="33" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">
          {formatNum(2000)}
        </text>

        <line x1="105" y1="62" x2="118" y2="62" stroke="#f8fafc" strokeWidth="2" />
        <text x="98" y="65" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">
          {formatNum(1500)}
        </text>

        <line x1="100" y1="94" x2="118" y2="94" stroke="#fbbf24" strokeWidth="2.5" />
        <text x="95" y="97" textAnchor="end" fill="#fbbf24" fontSize="9" fontWeight="900">
          1 L
        </text>

        <line x1="105" y1="126" x2="118" y2="126" stroke="#f8fafc" strokeWidth="2" />
        <text x="98" y="129" textAnchor="end" fill="#94a3b8" fontSize="8" fontWeight="bold">
          {formatNum(500)}
        </text>
      </svg>
    </div>
  );

  return {
    q: t.beakerQ,
    svg: svgBeaker,
    correct: targetML,
    unit: t.unitML,
    explainText: t.beakerExplain(formatNum(targetML))
  };
}

// 2. Άσκηση: Μετατροπές Μονάδων (L <-> mL)
function makeConversionQuestion(isLtoML, t, formatNum) {
  const liters = getRandomInt(2, 9);
  if (isLtoML) {
    const correct = liters * 1000;
    return {
      q: t.convLtoMLQ(liters),
      correct,
      unit: t.unitML,
      explainText: t.convLtoMLExplain(liters, formatNum(correct))
    };
  } else {
    const ml = liters * 1000;
    return {
      q: t.convMLtoLQ(formatNum(ml)),
      correct: liters,
      unit: t.unitL,
      explainText: t.convMLtoLExplain(formatNum(ml), liters)
    };
  }
}

// Δημιουργία 8 Μοναδικών Ερωτήσεων
function generateQuestions(t, formatNum, formatDec) {
  const beakerLevels = [500, 1000, 1500, 2000].sort(() => Math.random() - 0.5);
  const q1 = makeBeakerReadingQuestion(beakerLevels[0], t, formatNum);
  const q2 = makeBeakerReadingQuestion(beakerLevels[1], t, formatNum);

  const q3 = makeConversionQuestion(true, t, formatNum);
  const q4 = makeConversionQuestion(false, t, formatNum);

  const shuffledFractions = [...t.fractions].sort(() => Math.random() - 0.5);
  const makeFractionMCQ = (item) => {
    const rawOptions = [item.correct, ...item.wrongs].sort(() => Math.random() - 0.5);
    const options = [...new Set(rawOptions)];
    return {
      q: item.q,
      options,
      correct: item.correct,
      explainText: item.explainText
    };
  };
  const q5 = makeFractionMCQ(shuffledFractions[0]);
  const q6 = makeFractionMCQ(shuffledFractions[1]);

  const problemGenerators = [
    () => {
      const cans = getRandomInt(2, 5);
      const capacity = 250;
      const total = cans * capacity;
      const data = t.wordProblem1(cans, capacity, formatNum(total));
      return {
        q: data.q,
        correct: total,
        unit: t.unitML,
        explainText: data.explainText
      };
    },
    () => {
      const bottles = getRandomInt(2, 6);
      const bottleCap = 500;
      const totalML = bottles * bottleCap;
      const totalL = totalML / 1000;
      const data = t.wordProblem2(bottles, bottleCap, formatNum(totalML), formatDec(totalL));
      return {
        q: data.q,
        correct: totalML,
        unit: t.unitML,
        explainText: data.explainText
      };
    },
    () => {
      const liters = getRandomInt(2, 5);
      const totalML = liters * 1000;
      const glass = 250;
      const totalGlasses = totalML / glass;
      const data = t.wordProblem3(liters, formatNum(totalML), glass, totalGlasses);
      return {
        q: data.q,
        correct: totalGlasses,
        unit: t.unitGlasses,
        explainText: data.explainText
      };
    },
    () => {
      const count = getRandomInt(2, 4);
      const canML = 330;
      const total = count * canML;
      const data = t.wordProblem4(count, canML, formatNum(total));
      return {
        q: data.q,
        correct: total,
        unit: t.unitML,
        explainText: data.explainText
      };
    }
  ];

  const shuffledProblems = [...problemGenerators].sort(() => Math.random() - 0.5);
  const q7 = shuffledProblems[0]();
  const q8 = shuffledProblems[1]();

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function PosotitaIgrouAskPage() {
  const router = useRouter();
  const rawLocale = router?.locale || 'el';
  const locale = TRANSLATIONS[rawLocale] ? rawLocale : 'el';
  const t = TRANSLATIONS[locale];

  const formatNumber = (num) => {
    if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
  };

  const formatDecimal = (num) => {
    if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3
    });
  };

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(t, formatNumber, formatDecimal));
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
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (parseInt(answers.q7, 10) === questions.q7.correct) currentScore += 1;
    if (parseInt(answers.q8, 10) === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Input Number Ασκήσεων (Q1, Q2, Q3, Q4, Q7, Q8)
  const renderInputNumber = (qKey, qData, numLabel, colorClass, placeholderText, suffixUnit) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className={`${colorClass} text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}>
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
              placeholder={placeholderText}
              maxLength={10}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-cyan-950 bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none shadow-sm"
            />
            {suffixUnit && (
              <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">
                {suffixUnit}
              </span>
            )}
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
                {t.correctAnswerIs} <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)} {suffixUnit || ''}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render MCQ (Q5 & Q6)
  const renderMCQQuestion = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
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
                  value={opt}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt)}
                  disabled={submitted}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500 shrink-0"
                />
                <span className="break-words whitespace-normal leading-snug flex-1 font-bold text-sm sm:text-base font-mono">
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
                {t.correctAnswerIs} <strong className="font-mono font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
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
          href="/d-dimotikou/29-posotita-igrou"
          className="bg-cyan-100 hover:bg-cyan-200 text-cyan-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badgeHeader)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 {t.headerTitle}
            </h1>
            <p className="text-cyan-100 text-xs sm:text-sm md:text-base">
              {t.headerDesc}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-cyan-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInputNumber('q1', questions.q1, 1, 'bg-cyan-600', t.unitML, questions.q1.unit)}
          {renderInputNumber('q2', questions.q2, 2, 'bg-cyan-600', t.unitML, questions.q2.unit)}

          {renderInputNumber('q3', questions.q3, 3, 'bg-blue-600', t.inputResultPlaceholder, questions.q3.unit)}
          {renderInputNumber('q4', questions.q4, 4, 'bg-blue-600', t.inputResultPlaceholder, questions.q4.unit)}

          {renderMCQQuestion('q5', questions.q5, 5)}
          {renderMCQQuestion('q6', questions.q6, 6)}

          {renderInputNumber('q7', questions.q7, 7, 'bg-emerald-600', t.inputResultPlaceholder, questions.q7.unit)}
          {renderInputNumber('q8', questions.q8, 8, 'bg-emerald-600', t.inputResultPlaceholder, questions.q8.unit)}

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
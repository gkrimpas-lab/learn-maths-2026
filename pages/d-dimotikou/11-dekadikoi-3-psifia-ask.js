// pages/d-dimotikou/11-dekadikoi-3-psifia-ask.js
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

// Component για μαθηματική γραφή κλασμάτων (κατακόρυφη μορφή)
const Fraction = ({ num, den }) => (
  <span className="inline-flex flex-col items-center align-middle mx-1 text-center font-serif leading-none">
    <span className="border-b border-current px-1 pb-0.5 text-[0.95em]">{num}</span>
    <span className="px-1 pt-0.5 text-[0.95em]">{den}</span>
  </span>
);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumberByLocale(num, isEn) {
  if (num === null || num === undefined || isNaN(num)) return '';
  return Number(num).toLocaleString(isEn ? 'en-US' : 'el-GR');
}

// Συγκεντρωτικό λεξικό μεταφράσεων i18n
const TRANSLATIONS = {
  el: {
    metaTitle: "Ασκήσεις: Δεκαδικοί Αριθμοί με 3 Ψηφία | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στους δεκαδικούς με 3 ψηφία (χιλιοστά): μετατροπή κλασμάτων με παρονομαστή 1.000, αξία θέσης και σύγκριση.",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "📝 Ασκήσεις: Δεκαδικοί με 3 Ψηφία (Χιλιοστά)",
    heroDesc: "Πατώντας «Νέες Ασκήσεις», οι αριθμοί και τα κλάσματα ανανεώνονται αυτόματα από τη δεξαμενή!",
    newExercisesBtn: "🔄 Νέες Ασκήσεις",
    checkAnswersBtn: "🎯 Έλεγχος Απαντήσεων",
    placeholderDecimal: "π.χ. 0,245",
    q1PromptPre: "Γράψε το δεκαδικό κλάσμα",
    q1PromptPost: "ως δεκαδικό αριθμό με υποδιαστολή:",
    q2Prompt: "Ποιο δεκαδικό κλάσμα ισούται με τον αριθμό",
    q3PromptPre: "Ποιο ψηφίο βρίσκεται στη θέση των",
    q3PromptMid: "στον αριθμό",
    q3PromptPost: ";",
    digitLabelPrefix: "Ψηφίο",
    comparePrompt: "Επίλεξε το κατάλληλο σύμβολο σύγκρισης ( ＜ , ＝ , ＞ ):",
    correctAnswerIs: "Ο σωστός δεκαδικός αριθμός είναι",
    correctFractionIs: "Το ορθό δεκαδικό κλάσμα είναι το",
    correctDigitIs: "Το ψηφίο είναι το",
    correctRelationIs: "Η σωστή σχέση είναι",
    scoreLabel: "🏆 Σκορ:",
    successRate: "Επιτυχία:",
    footerPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    places: {
      tenths: "δέκατα",
      hundredths: "εκατοστά",
      thousandths: "χιλιοστά"
    },
    explainFractionToDecimal: (numStr, val) =>
      `Διαιρώντας με το 1.000, η υποδιαστολή μετακινείται 3 θέσεις προς τα αριστερά: ${numStr}/1.000 ＝ ${val}.`,
    explainDecimalToFraction: (decVal, numStr) =>
      `Ο αριθμός ${decVal} έχει 3 δεκαδικά ψηφία (χιλιοστά), επομένως ισούται ακριβώς με το δεκαδικό κλάσμα ${numStr}/1.000.`,
    explainPlaceTenths: (digit) =>
      `Το ψηφίο των δεκάτων είναι το 1ο ψηφίο μετά την υποδιαστολή, δηλαδή το ${digit}.`,
    explainPlaceHundredths: (digit) =>
      `Το ψηφίο των εκατοστών είναι το 2ο ψηφίο μετά την υποδιαστολή, δηλαδή το ${digit}.`,
    explainPlaceThousandths: (digit) =>
      `Το ψηφίο των χιλιοστών είναι το 3ο ψηφίο μετά την υποδιαστολή, δηλαδή το ${digit}.`,
    explainCompareEqual: (strA, strB) =>
      `Οι αριθμοί ${strA} και ${strB} είναι ίσοι, αφού τα μηδενικά στο τέλος του δεκαδικού μέρους δεν αλλάζουν την αξία.`,
    explainCompareDiff: (strA, sym, strB) =>
      `Συγκρίνοντας τα ψηφία από τα αριστερά προς τα δεξιά, προκύπτει ${strA} ${sym} ${strB}.`
  },
  en: {
    metaTitle: "Exercises: Decimal Numbers with 3 Decimal Places | LearnMaths.gr",
    metaDesc: "Interactive 4th-grade math exercises on 3-decimal-place numbers (thousandths): converting fractions with denominator 1,000, place value, and comparisons.",
    backText: "Grade 4",
    theoryBtn: "Theory",
    gradeBadge: "GRADE 4 • PRACTICE",
    heroTitle: "📝 Exercises: Decimals with 3 Places (Thousandths)",
    heroDesc: "By clicking \"New Exercises\", the numbers and fractions regenerate automatically from the pool!",
    newExercisesBtn: "🔄 New Exercises",
    checkAnswersBtn: "🎯 Check Answers",
    placeholderDecimal: "e.g. 0.245",
    q1PromptPre: "Write the decimal fraction",
    q1PromptPost: "as a decimal number:",
    q2Prompt: "Which decimal fraction equals the number",
    q3PromptPre: "Which digit is in the",
    q3PromptMid: "place in the number",
    q3PromptPost: "?",
    digitLabelPrefix: "Digit",
    comparePrompt: "Select the appropriate comparison symbol ( ＜ , ＝ , ＞ ):",
    correctAnswerIs: "The correct decimal number is",
    correctFractionIs: "The correct decimal fraction is",
    correctDigitIs: "The digit is",
    correctRelationIs: "The correct relation is",
    scoreLabel: "🏆 Score:",
    successRate: "Score:",
    footerPrompt: "Complete all questions and click \"Check Answers\"!",
    places: {
      tenths: "tenths",
      hundredths: "hundredths",
      thousandths: "thousandths"
    },
    explainFractionToDecimal: (numStr, val) =>
      `Dividing by 1,000 moves the decimal point 3 places to the left: ${numStr}/1,000 ＝ ${val}.`,
    explainDecimalToFraction: (decVal, numStr) =>
      `The number ${decVal} has 3 decimal places (thousandths), so it equals exactly the decimal fraction ${numStr}/1,000.`,
    explainPlaceTenths: (digit) =>
      `The tenths digit is the 1st digit after the decimal point, which is ${digit}.`,
    explainPlaceHundredths: (digit) =>
      `The hundredths digit is the 2nd digit after the decimal point, which is ${digit}.`,
    explainPlaceThousandths: (digit) =>
      `The thousandths digit is the 3rd digit after the decimal point, which is ${digit}.`,
    explainCompareEqual: (strA, strB) =>
      `The numbers ${strA} and ${strB} are equal, because trailing zeros at the end of the decimal part do not change the value.`,
    explainCompareDiff: (strA, sym, strB) =>
      `Comparing the digits from left to right, we find ${strA} ${sym} ${strB}.`
  }
};

// 1. Άσκηση: Μετατροπή Κλάσματος σε Δεκαδικό με 3 ψηφία (Input)
function makeFractionToDecimalQuestion(prevQuestion = null) {
  let num;
  const den = 1000;

  while (true) {
    const category = getRandomInt(1, 4);
    if (category === 1) num = getRandomInt(3, 9);
    else if (category === 2) num = getRandomInt(12, 85);
    else if (category === 3) num = getRandomInt(105, 995);
    else num = getRandomInt(1005, 4995);

    if (!prevQuestion || prevQuestion.num !== num) {
      break;
    }
  }

  const numericVal = num / den;

  return {
    num,
    den,
    numericVal
  };
}

// 2. Άσκηση: Μετατροπή Δεκαδικού σε Κλάσμα (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeDecimalToFractionQuestion(prevQuestion = null) {
  let num;
  const den = 1000;

  while (true) {
    num = getRandomInt(15, 985);
    if (!prevQuestion || prevQuestion.num !== num) {
      break;
    }
  }

  const numericVal = num / den;
  const correctText = `${num}/${den}`;

  const wrongCandidates = new Set();
  wrongCandidates.add(`${num}/100`);
  wrongCandidates.add(`${num}/10`);
  wrongCandidates.add(`${num + (num > 10 ? 10 : 2)}/${den}`);
  wrongCandidates.add(`${den}/${num}`);

  while (wrongCandidates.size < 3) {
    wrongCandidates.add(`${num + getRandomInt(3, 20)}/${den}`);
  }

  const wrongArr = Array.from(wrongCandidates).slice(0, 3);
  const rawOptions = [
    { num, den, text: correctText, isCorrect: true },
    { num: parseInt(wrongArr[0].split('/')[0], 10), den: parseInt(wrongArr[0].split('/')[1], 10), text: wrongArr[0], isCorrect: false },
    { num: parseInt(wrongArr[1].split('/')[0], 10), den: parseInt(wrongArr[1].split('/')[1], 10), text: wrongArr[1], isCorrect: false },
    { num: parseInt(wrongArr[2].split('/')[0], 10), den: parseInt(wrongArr[2].split('/')[1], 10), text: wrongArr[2], isCorrect: false }
  ];

  const uniqueOptions = [...new Set(rawOptions.map((o) => o.text))].map((t) =>
    rawOptions.find((o) => o.text === t)
  ).sort(() => Math.random() - 0.5);

  return {
    num,
    den,
    numericVal,
    options: uniqueOptions,
    correct: correctText
  };
}

// 3. Άσκηση: Αξία Θέσης Ψηφίου (με εγγύηση μοναδικότητας)
function makePlaceValueQuestion(prevQuestion = null) {
  let intPart, tenths, hundredths, thousandths, placeKey, correctDigit;
  const placeKeys = ['tenths', 'hundredths', 'thousandths'];

  while (true) {
    intPart = getRandomInt(0, 9);
    tenths = getRandomInt(1, 9);
    hundredths = getRandomInt(1, 9);
    thousandths = getRandomInt(1, 9);

    if (
      intPart !== tenths &&
      intPart !== hundredths &&
      intPart !== thousandths &&
      tenths !== hundredths &&
      tenths !== thousandths &&
      hundredths !== thousandths
    ) {
      placeKey = placeKeys[getRandomInt(0, placeKeys.length - 1)];

      if (placeKey === 'tenths') correctDigit = tenths;
      if (placeKey === 'hundredths') correctDigit = hundredths;
      if (placeKey === 'thousandths') correctDigit = thousandths;

      if (!prevQuestion || prevQuestion.intPart !== intPart || prevQuestion.placeKey !== placeKey) {
        break;
      }
    }
  }

  return {
    intPart,
    tenths,
    hundredths,
    thousandths,
    placeKey,
    correct: correctDigit.toString()
  };
}

// 4. Άσκηση: Σύγκριση Δεκαδικών με 3 ψηφία (＜, ＝, ＞)
function makeComparisonQuestion(prevQuestion = null) {
  let valA, valB, rawStrA, rawStrB, correctSym, isTrailingZero;

  while (true) {
    const intPart = getRandomInt(0, 9);
    const type = getRandomInt(1, 3);
    isTrailingZero = false;

    if (type === 1) {
      const d = getRandomInt(1, 9);
      valA = intPart + d / 10;
      valB = valA;
      rawStrA = `${intPart}.${d}00`;
      rawStrB = `${intPart}.${d}`;
      isTrailingZero = true;
    } else if (type === 2) {
      const d = getRandomInt(1, 8);
      const decA = d * 100 + getRandomInt(10, 80);
      const decB = decA + getRandomInt(-15, 25);
      valA = intPart + decA / 1000;
      valB = intPart + decB / 1000;
      rawStrA = `${intPart}.${decA.toString().padStart(3, '0')}`;
      rawStrB = `${intPart}.${decB.toString().padStart(3, '0')}`;
    } else {
      const decA = getRandomInt(15, 950);
      const decB = getRandomInt(15, 950);
      valA = intPart + decA / 1000;
      valB = intPart + (Math.random() > 0.5 ? 1 : 0) + decB / 1000;
      rawStrA = (intPart + decA / 1000).toFixed(3);
      rawStrB = valB.toFixed(3);
    }

    correctSym = '＝';
    if (valA > valB) correctSym = '＞';
    if (valA < valB) correctSym = '＜';

    if (!prevQuestion || prevQuestion.rawStrA !== rawStrA || prevQuestion.rawStrB !== rawStrB) {
      break;
    }
  }

  return {
    valA,
    valB,
    rawStrA,
    rawStrB,
    correct: correctSym,
    isTrailingZero
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  const q1 = makeFractionToDecimalQuestion();
  const q2 = makeFractionToDecimalQuestion(q1);

  const q3 = makeDecimalToFractionQuestion();
  const q4 = makeDecimalToFractionQuestion(q3);

  const q5 = makePlaceValueQuestion();
  const q6 = makePlaceValueQuestion(q5);

  const q7 = makeComparisonQuestion();
  const q8 = makeComparisonQuestion(q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function Dekadikoi3PsifiaAskPage() {
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

  const handleDecimalInput = (key, rawVal) => {
    if (submitted) return;
    const clean = isEn
      ? rawVal.replace(/[^0-9.]/g, '').slice(0, 10)
      : rawVal.replace(/\./g, ',').replace(/[^0-9,]/g, '').slice(0, 10);
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const handleIntegerInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9]/g, '').slice(0, 10);
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const checkDecimalEqual = (userStr, targetNumeric) => {
    if (!userStr) return false;
    const parsed = parseFloat(userStr.replace(',', '.'));
    if (isNaN(parsed)) return false;
    return Math.abs(parsed - targetNumeric) <= 0.05;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    if (checkDecimalEqual(answers.q1, questions.q1.numericVal)) currentScore += 1;
    if (checkDecimalEqual(answers.q2, questions.q2.numericVal)) currentScore += 1;
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (parseInt(answers.q5, 10) === parseInt(questions.q5.correct, 10)) currentScore += 1;
    if (parseInt(answers.q6, 10) === parseInt(questions.q6.correct, 10)) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Q1 & Q2: Κλάσμα ➔ Δεκαδικός (Input)
  const renderFractionToDecimal = (qKey, qData, numLabel) => {
    const isCorrect = checkDecimalEqual(answers[qKey], qData.numericVal);
    const numFormatted = formatNumberByLocale(qData.num, isEn);
    const denFormatted = formatNumberByLocale(qData.den, isEn);
    const correctValFormatted = qData.numericVal.toLocaleString(isEn ? 'en-US' : 'el-GR', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
    const explainText = t.explainFractionToDecimal(numFormatted, correctValFormatted);

    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-purple-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.q1PromptPre} <Fraction num={numFormatted} den={denFormatted} /> {t.q1PromptPost}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <Fraction num={numFormatted} den={denFormatted} />
            <span>＝</span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.placeholderDecimal}
              maxLength={10}
              value={answers[qKey]}
              onChange={(e) => handleDecimalInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-purple-900 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
            />
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
                {t.correctAnswerIs} <span className="font-mono font-bold text-rose-900">{correctValFormatted}</span>. {explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Δεκαδικός ➔ Κλάσμα (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
  const renderDecimalToFraction = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    const decFormatted = qData.numericVal.toLocaleString(isEn ? 'en-US' : 'el-GR', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
    const numFormatted = formatNumberByLocale(qData.num, isEn);
    const denFormatted = formatNumberByLocale(qData.den, isEn);
    const explainText = t.explainDecimalToFraction(decFormatted, numFormatted);

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
            {t.q2Prompt} <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{decFormatted}</span>?
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt.text;
            return (
              <label
                key={idx}
                className={`flex items-center justify-center p-3.5 rounded-2xl border cursor-pointer transition select-none ${
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
                  className="hidden"
                />
                <span className="break-words whitespace-normal leading-snug flex-1 text-center">
                  <Fraction num={formatNumberByLocale(opt.num, isEn)} den={formatNumberByLocale(opt.den, isEn)} />
                </span>
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
                {t.correctFractionIs} <Fraction num={numFormatted} den={denFormatted} />. {explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Αξία Θέσης (Input)
  const renderPlaceValue = (qKey, qData, numLabel) => {
    const isCorrect = (answers[qKey] || '').toString().trim() === qData.correct;
    const decSep = isEn ? '.' : ',';
    const decStr = `${qData.intPart}${decSep}${qData.tenths}${qData.hundredths}${qData.thousandths}`;
    const placeName = t.places[qData.placeKey];

    let explainText = '';
    if (qData.placeKey === 'tenths') explainText = t.explainPlaceTenths(qData.correct);
    else if (qData.placeKey === 'hundredths') explainText = t.explainPlaceHundredths(qData.correct);
    else explainText = t.explainPlaceThousandths(qData.correct);

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
            {t.q3PromptPre} <span className="text-teal-600 font-extrabold">{placeName}</span> {t.q3PromptMid} <span className="text-teal-600 font-mono font-black text-lg sm:text-xl">{decStr}</span>{t.q3PromptPost}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">
              {t.digitLabelPrefix} ({placeName}):
            </span>
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
              onChange={(e) => handleIntegerInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-28 sm:w-36 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-teal-900 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
            />
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
                {t.correctDigitIs} <span className="font-mono font-bold text-rose-900">{qData.correct}</span>. {explainText}
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
    const decSep = isEn ? '.' : ',';
    const strA = qData.rawStrA.replace('.', decSep);
    const strB = qData.rawStrB.replace('.', decSep);

    const explainText = qData.isTrailingZero
      ? t.explainCompareEqual(strA, strB)
      : t.explainCompareDiff(strA, qData.correct, strB);

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
            <span>{strA}</span>

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

            <span>{strB}</span>
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
                {t.correctRelationIs} <span className="font-mono font-bold text-rose-900">{strA} {qData.correct} {strB}</span>. {explainText}
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
          href="/d-dimotikou/11-dekadikoi-3-psifia"
          className="bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.gradeBadge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.heroTitle}
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm md:text-base">
              {t.heroDesc}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-purple-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {t.newExercisesBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderFractionToDecimal('q1', questions.q1, 1)}
          {renderFractionToDecimal('q2', questions.q2, 2)}

          {renderDecimalToFraction('q3', questions.q3, 3)}
          {renderDecimalToFraction('q4', questions.q4, 4)}

          {renderPlaceValue('q5', questions.q5, 5)}
          {renderPlaceValue('q6', questions.q6, 6)}

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
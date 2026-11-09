// pages/d-dimotikou/6-dekadikoi-ask.js
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
    metaTitle: "Ασκήσεις: Δεκαδικοί Αριθμοί & Κλάσματα | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στους δεκαδικούς αριθμούς: μετατροπή δεκαδικών κλασμάτων, αξία θέσης και σύγκριση δεκαδικών.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    theoryUrl: "/d-dimotikou/6-dekadikoi",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Ασκήσεις: Δεκαδικοί Αριθμοί",
    subtitle: "Πατώντας «Νέες Ασκήσεις», τα κλάσματα και οι δεκαδικοί αριθμοί ανανεώνονται αυτόματα από τη δεξαμενή!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    bottomPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    // Q1 & Q2
    q1Prompt: "Γράψε το δεκαδικό κλάσμα ως δεκαδικό αριθμό με υποδιαστολή:",
    q1Placeholder: "π.χ. 0,4",
    q1FbTenths: "Το κλάσμα έχει παρονομαστή το 10 (δέκατα), επομένως γράφεται με ένα δεκαδικό ψηφίο: {ans}.",
    q1FbHundredths: "Το κλάσμα έχει παρονομαστή το 100 (εκατοστά), επομένως γράφεται με δύο δεκαδικά ψηφία: {ans}.",
    q1FbErrorLead: "Η σωστή δεκαδική μορφή είναι",
    // Q3 & Q4
    q3PromptPrefix: "Στον αριθμό",
    q3PromptMiddle: "ποια είναι η πραγματική αξία του ψηφίου",
    q3InputLabel: "Αξία ψηφίου:",
    q3Placeholder: "π.χ. 0,4 ή 0,05",
    q3FbTenths: "Το ψηφίο {digit} βρίσκεται στην πρώτη θέση μετά την υποδιαστολή, άρα εκφράζει {digit} δέκατα ({ans}).",
    q3FbHundredths: "Το ψηφίο {digit} βρίσκεται στη δεύτερη θέση μετά την υποδιαστολή, άρα εκφράζει {digit} εκατοστά ({ans}).",
    q3FbErrorLead: "Η πραγματική αξία του ψηφίου {digit} είναι",
    // Q5 & Q6
    q5Prompt: "Επίλεξε το κατάλληλο σύμβολο σύγκρισης ( ＜ , ＝ , ＞ ):",
    q5FbEqual: "Οι αριθμοί {numA} και {numB} είναι ίσοι, καθώς το μηδενικό στο τέλος ενός δεκαδικού δεν αλλάζει την αξία του.",
    q5FbDiff: "Συγκρίνοντας τα δέκατα και έπειτα τα εκατοστά, ισχύει {numA} {sym} {numB}.",
    q5FbErrorLead: "Η ορθή σύγκριση είναι",
    // Q7 & Q8
    q7Prompt: "Ποιος δεκαδικός αριθμός αντιστοιχεί ακριβώς στο παρακάτω κλάσμα;",
    q7FbTenths: "Το κλάσμα εκφράζει {num} δέκατα και γράφεται ακριβώς ως {ans}.",
    q7FbHundredths: "Το κλάσμα εκφράζει {num} εκατοστά, άρα το ψηφίο {num} τοποθετείται στη 2η δεκαδική θέση: {ans}.",
    q7FbErrorLead: "Η σωστή επιλογή είναι το"
  },
  en: {
    metaTitle: "Exercises: Decimal Numbers & Fractions | LearnMaths.gr",
    metaDesc: "Interactive math exercises for 4th Grade on decimals: converting decimal fractions, place value, and comparing decimals.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    theoryBtn: "Theory",
    theoryUrl: "/en/d-dimotikou/6-dekadikoi",
    badge: "4TH GRADE • PRACTICE",
    title: "Exercises: Decimal Numbers",
    subtitle: "Clicking 'New Exercises' generates new fractions and decimals automatically from the pool!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success Rate:",
    bottomPrompt: "Complete all questions and click 'Check Answers'!",
    // Q1 & Q2
    q1Prompt: "Write the decimal fraction as a decimal number:",
    q1Placeholder: "e.g. 0.4",
    q1FbTenths: "The fraction has a denominator of 10 (tenths), so it is written with one decimal place: {ans}.",
    q1FbHundredths: "The fraction has a denominator of 100 (hundredths), so it is written with two decimal places: {ans}.",
    q1FbErrorLead: "The correct decimal form is",
    // Q3 & Q4
    q3PromptPrefix: "In the number",
    q3PromptMiddle: "what is the place value of the digit",
    q3InputLabel: "Place value:",
    q3Placeholder: "e.g. 0.4 or 0.05",
    q3FbTenths: "Digit {digit} is in the first place after the decimal point, representing {digit} tenths ({ans}).",
    q3FbHundredths: "Digit {digit} is in the second place after the decimal point, representing {digit} hundredths ({ans}).",
    q3FbErrorLead: "The actual place value of digit {digit} is",
    // Q5 & Q6
    q5Prompt: "Select the appropriate comparison sign ( ＜ , ＝ , ＞ ):",
    q5FbEqual: "The numbers {numA} and {numB} are equal, as a trailing zero after the decimal point does not change the number's value.",
    q5FbDiff: "Comparing tenths and then hundredths, we get {numA} {sym} {numB}.",
    q5FbErrorLead: "The correct comparison is",
    // Q7 & Q8
    q7Prompt: "Which decimal number corresponds exactly to the fraction below?",
    q7FbTenths: "The fraction represents {num} tenths and is written exactly as {ans}.",
    q7FbHundredths: "The fraction represents {num} hundredths, so digit {num} is placed in the 2nd decimal place: {ans}.",
    q7FbErrorLead: "The correct choice is"
  }
};

// --- ΓΕΝΝΗΤΡΙΕΣ ΕΡΩΤΗΣΕΩΝ --- //

function makeFractionToDecimalQuestion(locale) {
  const isTenths = Math.random() > 0.5;
  const sep = locale === 'en' ? '.' : ',';

  if (isTenths) {
    const num = getRandomInt(1, 9);
    const correct = `0${sep}${num}`;
    const correctVal = num / 10;
    return {
      num,
      den: 10,
      isTenths: true,
      correct,
      correctVal
    };
  } else {
    const num = getRandomInt(1, 99);
    const correct = num < 10 ? `0${sep}0${num}` : `0${sep}${num}`;
    const correctVal = num / 100;
    return {
      num,
      den: 100,
      isTenths: false,
      correct,
      correctVal
    };
  }
}

function makePlaceValueQuestion(locale) {
  const isTenthsTarget = Math.random() > 0.5;
  const sep = locale === 'en' ? '.' : ',';
  let d1 = getRandomInt(1, 9);
  let d2 = getRandomInt(1, 9);
  while (d1 === d2) {
    d2 = getRandomInt(1, 9);
  }

  const numStr = `0${sep}${d1}${d2}`;
  if (isTenthsTarget) {
    const correct = `0${sep}${d1}`;
    const correctVal = d1 / 10;
    return {
      numStr,
      digit: d1,
      isTenths: true,
      correct,
      correctVal
    };
  } else {
    const correct = `0${sep}0${d2}`;
    const correctVal = d2 / 100;
    return {
      numStr,
      digit: d2,
      isTenths: false,
      correct,
      correctVal
    };
  }
}

function makeComparisonQuestion(locale) {
  const type = getRandomInt(1, 3);
  const sep = locale === 'en' ? '.' : ',';
  let numAVal = 0;
  let numBVal = 0;
  let numAStr = '';
  let numBStr = '';

  if (type === 1) {
    const d = getRandomInt(1, 9);
    numAVal = d / 10;
    numBVal = d / 10;
    numAStr = `0${sep}${d}`;
    numBStr = `0${sep}${d}0`;
  } else if (type === 2) {
    const d = getRandomInt(2, 8);
    numAVal = d / 10;
    const offset = getRandomInt(2, 6);
    const bInt = d * 10 - offset;
    numBVal = bInt / 100;
    numAStr = `0${sep}${d}`;
    numBStr = `0${sep}${bInt}`;
  } else {
    const v1 = getRandomInt(11, 89);
    let v2 = getRandomInt(11, 89);
    while (v2 === v1) {
      v2 = getRandomInt(11, 89);
    }
    numAVal = v1 / 100;
    numBVal = v2 / 100;
    numAStr = `0${sep}${v1}`;
    numBStr = `0${sep}${v2}`;
  }

  let correctSym = '＝';
  if (numAVal > numBVal) correctSym = '＞';
  if (numAVal < numBVal) correctSym = '＜';

  return {
    numAStr,
    numBStr,
    numAVal,
    numBVal,
    correct: correctSym
  };
}

function makeMCQQuestion(locale) {
  const isTenths = Math.random() > 0.5;
  const sep = locale === 'en' ? '.' : ',';

  if (isTenths) {
    const num = getRandomInt(1, 9);
    const correct = `0${sep}${num}`;
    const wrong1 = `0${sep}0${num}`;
    const wrong2 = `${num}${sep}0`;
    const wrong3 = `0${sep}${num}0`;

    const rawOptions = [correct, wrong1, wrong2, wrong3];
    const uniqueOptions = [...new Set(rawOptions)].sort(() => Math.random() - 0.5);

    return {
      num,
      den: 10,
      isTenths: true,
      options: uniqueOptions,
      correct
    };
  } else {
    const num = getRandomInt(3, 9);
    const correct = `0${sep}0${num}`;
    const wrong1 = `0${sep}${num}`;
    const wrong2 = `0${sep}${num}0`;
    const wrong3 = `${num}${sep}00`;

    const rawOptions = [correct, wrong1, wrong2, wrong3];
    const uniqueOptions = [...new Set(rawOptions)].sort(() => Math.random() - 0.5);

    return {
      num,
      den: 100,
      isTenths: false,
      options: uniqueOptions,
      correct
    };
  }
}

function generateQuestions(locale) {
  return {
    q1: makeFractionToDecimalQuestion(locale),
    q2: makeFractionToDecimalQuestion(locale),
    q3: makePlaceValueQuestion(locale),
    q4: makePlaceValueQuestion(locale),
    q5: makeComparisonQuestion(locale),
    q6: makeComparisonQuestion(locale),
    q7: makeMCQQuestion(locale),
    q8: makeMCQQuestion(locale)
  };
}

export default function DekadikoiAskPage() {
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

  const handleDecimalInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/\./g, ',').replace(/[^0-9,]/g, '').slice(0, 10);
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const checkDecimalMatch = (userAns, targetVal, targetFormatted) => {
    if (!userAns) return false;
    const normalized = userAns.trim().replace(',', '.');
    const parsed = parseFloat(normalized);
    if (!isNaN(parsed) && Math.abs(parsed - targetVal) <= 0.05) {
      return true;
    }
    const cleanUser = userAns.trim().replace('.', ',');
    const cleanTarget = (targetFormatted || '').trim().replace('.', ',');
    return cleanUser === cleanTarget;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    if (checkDecimalMatch(answers.q1, questions.q1.correctVal, questions.q1.correct)) currentScore += 1;
    if (checkDecimalMatch(answers.q2, questions.q2.correctVal, questions.q2.correct)) currentScore += 1;
    if (checkDecimalMatch(answers.q3, questions.q3.correctVal, questions.q3.correct)) currentScore += 1;
    if (checkDecimalMatch(answers.q4, questions.q4.correctVal, questions.q4.correct)) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  const totalQuestions = 8;

  // Render Q1 & Q2: Κλάσμα σε Δεκαδικό (Input)
  const renderFractionToDecimal = (qKey, qData, numLabel) => {
    const isCorrect = checkDecimalMatch(answers[qKey], qData.correctVal, qData.correct);
    const fbText = qData.isTenths
      ? t.q1FbTenths.replace('{ans}', qData.correct)
      : t.q1FbHundredths.replace('{ans}', qData.correct);

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
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {t.q1Prompt}
            </h3>
            <Fraction num={qData.num} den={qData.den} inline={true} />
          </div>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <Fraction num={qData.num} den={qData.den} inline={true} />
            <span>＝</span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.q1Placeholder}
              value={answers[qKey]}
              onChange={(e) => handleDecimalInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-40 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-amber-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
            />
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
                {t.q1FbErrorLead} <span className="font-mono font-bold text-rose-900">{qData.correct}</span>. {fbText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Αξία Θέσης Ψηφίου (Input)
  const renderPlaceValue = (qKey, qData, numLabel) => {
    const isCorrect = checkDecimalMatch(answers[qKey], qData.correctVal, qData.correct);
    const fbText = qData.isTenths
      ? t.q3FbTenths.replace(/\{digit\}/g, qData.digit).replace('{ans}', qData.correct)
      : t.q3FbHundredths.replace(/\{digit\}/g, qData.digit).replace('{ans}', qData.correct);

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
            {t.q3PromptPrefix} <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{qData.numStr}</span>, {t.q3PromptMiddle} <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{qData.digit}</span>;
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">
              {t.q3InputLabel}
            </span>
            <span>＝</span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.q3Placeholder}
              value={answers[qKey]}
              onChange={(e) => handleDecimalInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-indigo-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
            />
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
                {t.q3FbErrorLead.replace('{digit}', qData.digit)} <span className="font-mono font-bold text-rose-900">{qData.correct}</span>. {fbText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Σύγκριση Δεκαδικών
  const renderComparison = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    const fbText = qData.numAVal === qData.numBVal
      ? t.q5FbEqual.replace('{numA}', qData.numAStr).replace('{numB}', qData.numBStr)
      : t.q5FbDiff.replace('{numA}', qData.numAStr).replace('{numB}', qData.numBStr).replace('{sym}', qData.correct);

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
            {t.q5Prompt}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-lg sm:text-2xl font-mono font-black text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span>{qData.numAStr}</span>

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
                      ? 'bg-purple-600 text-white border-purple-700 shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>

            <span>{qData.numBStr}</span>
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
                {t.q5FbErrorLead} <span className="font-mono font-bold text-rose-900">{qData.numAStr} {qData.correct} {qData.numBStr}</span>. {fbText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Πολλαπλή Επιλογή (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
  const renderMCQ = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    const fbText = qData.isTenths
      ? t.q7FbTenths.replace(/\{num\}/g, qData.num).replace('{ans}', qData.correct)
      : t.q7FbHundredths.replace(/\{num\}/g, qData.num).replace('{ans}', qData.correct);

    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-rose-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {t.q7Prompt}
            </h3>
            <Fraction num={qData.num} den={qData.den} inline={true} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/80 font-bold text-rose-950 shadow-sm'
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
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500 shrink-0"
                />
                <span className="font-mono font-bold text-base leading-snug break-words whitespace-normal flex-1">
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
                {fbText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q7FbErrorLead} <span className="font-mono font-bold text-rose-900">{qData.correct}</span>. {fbText}
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
          className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 {t.title}
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderFractionToDecimal('q1', questions.q1, 1)}
          {renderFractionToDecimal('q2', questions.q2, 2)}

          {renderPlaceValue('q3', questions.q3, 3)}
          {renderPlaceValue('q4', questions.q4, 4)}

          {renderComparison('q5', questions.q5, 5)}
          {renderComparison('q6', questions.q6, 6)}

          {renderMCQ('q7', questions.q7, 7)}
          {renderMCQ('q8', questions.q8, 8)}

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
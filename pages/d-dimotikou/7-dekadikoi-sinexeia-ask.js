// pages/d-dimotikou/7-dekadikoi-sinexeia-ask.js
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
    metaDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στους δεκαδικούς αριθμούς: μετατροπή κλασμάτων, αξία θέσης δεκάτων/εκατοστών και σύγκριση.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    theoryUrl: "/d-dimotikou/7-dekadikoi-sinexeia",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Ασκήσεις: Δεκαδικοί Αριθμοί και Κλάσματα",
    subtitle: "Πατώντας «Νέες Ασκήσεις», τα κλάσματα και οι δεκαδικοί αριθμοί ανανεώνονται αυτόματα από τη δεξαμενή!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    bottomPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    // Q1 & Q2
    q1Prompt: "Γράψε το δεκαδικό κλάσμα ως δεκαδικό αριθμό με υποδιαστολή:",
    q1Placeholder: "π.χ. 3,5",
    q1FbTenths: "Διαιρώντας με το 10, η υποδιαστολή μετακινείται 1 θέση αριστερά:",
    q1FbHundredths: "Διαιρώντας με το 100, η υποδιαστολή μετακινείται 2 θέσεις αριστερά:",
    q1FbErrorLead: "Η σωστή δεκαδική μορφή είναι",
    // Q3 & Q4
    q3PromptPrefix: "Ποιο δεκαδικό κλάσμα ισούται με τον δεκαδικό αριθμό",
    q3FbTenths: "Ο αριθμός {decVal} έχει 1 δεκαδικό ψηφίο (δέκατα), άρα ισούται με το κλάσμα",
    q3FbHundredths: "Ο αριθμός {decVal} έχει 2 δεκαδικά ψηφία (εκατοστά), άρα ισούται με το κλάσμα",
    q3FbErrorLead: "Το ορθό δεκαδικό κλάσμα είναι το",
    // Q5 & Q6
    q5PromptPrefix: "Ποιο ψηφίο βρίσκεται στη θέση των",
    q5PromptMiddle: "στον αριθμό",
    q5InputLabel: "Ψηφίο ({place}):",
    q5Placeholder: "?",
    q5PlaceTenths: "δέκατα",
    q5PlaceHundredths: "εκατοστά",
    q5FbTenths: "Το ψηφίο των δεκάτων είναι το πρώτο ψηφίο αμέσως μετά την υποδιαστολή, δηλαδή το {digit}.",
    q5FbHundredths: "Το ψηφίο των εκατοστών είναι το δεύτερο ψηφίο μετά την υποδιαστολή, δηλαδή το {digit}.",
    q5FbErrorLead: "Το ψηφίο είναι το",
    // Q7 & Q8
    q7Prompt: "Επίλεξε το κατάλληλο σύμβολο σύγκρισης ( ＜ , ＝ , ＞ ):",
    q7FbEqual: "Οι αριθμοί {strA} και {strB} είναι ίσοι, αφού το μηδενικό στο τέλος του δεκαδικού μέρους δεν μεταβάλλει την αξία.",
    q7FbDiff: "Συγκρίνοντας πρώτα τα ακέραια μέρη και έπειτα τα δέκατα, προκύπτει {strA} {sym} {strB}.",
    q7FbErrorLead: "Η σωστή σύγκριση είναι"
  },
  en: {
    metaTitle: "Exercises: Decimal Numbers & Fractions | LearnMaths.gr",
    metaDesc: "Interactive math exercises for 4th Grade on decimals: fraction conversion, place value of tenths/hundredths, and comparison.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    theoryBtn: "Theory",
    theoryUrl: "/en/d-dimotikou/7-dekadikoi-sinexeia",
    badge: "4TH GRADE • PRACTICE",
    title: "Exercises: Decimal Numbers and Fractions",
    subtitle: "Clicking 'New Exercises' generates new fractions and decimals automatically from the pool!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success Rate:",
    bottomPrompt: "Complete all questions and click 'Check Answers'!",
    // Q1 & Q2
    q1Prompt: "Write the decimal fraction as a decimal number:",
    q1Placeholder: "e.g. 3.5",
    q1FbTenths: "Dividing by 10 shifts the decimal point 1 place to the left:",
    q1FbHundredths: "Dividing by 100 shifts the decimal point 2 places to the left:",
    q1FbErrorLead: "The correct decimal form is",
    // Q3 & Q4
    q3PromptPrefix: "Which decimal fraction equals the decimal number",
    q3FbTenths: "The number {decVal} has 1 decimal place (tenths), so it equals the fraction",
    q3FbHundredths: "The number {decVal} has 2 decimal places (hundredths), so it equals the fraction",
    q3FbErrorLead: "The correct decimal fraction is",
    // Q5 & Q6
    q5PromptPrefix: "Which digit is in the position of",
    q5PromptMiddle: "in the number",
    q5InputLabel: "Digit ({place}):",
    q5Placeholder: "?",
    q5PlaceTenths: "tenths",
    q5PlaceHundredths: "hundredths",
    q5FbTenths: "The tenths digit is the first digit immediately after the decimal point, which is {digit}.",
    q5FbHundredths: "The hundredths digit is the second digit after the decimal point, which is {digit}.",
    q5FbErrorLead: "The digit is",
    // Q7 & Q8
    q7Prompt: "Select the appropriate comparison sign ( ＜ , ＝ , ＞ ):",
    q7FbEqual: "The numbers {strA} and {strB} are equal, because a trailing zero in the decimal part does not alter value.",
    q7FbDiff: "Comparing whole parts first and then tenths, we get {strA} {sym} {strB}.",
    q7FbErrorLead: "The correct comparison is"
  }
};

// --- ΓΕΝΝΗΤΡΙΕΣ ΕΡΩΤΗΣΕΩΝ --- //

function makeFractionToDecimalQuestion(locale) {
  const isTenths = Math.random() > 0.5;
  const den = isTenths ? 10 : 100;
  const num = isTenths ? getRandomInt(12, 98) : getRandomInt(105, 495);
  const correctVal = num / den;
  const correct = formatNumberLocale(correctVal, locale, {
    minimumFractionDigits: isTenths ? 1 : 2,
    maximumFractionDigits: 2
  });

  return {
    num,
    den,
    isTenths,
    correct,
    correctVal
  };
}

function makeDecimalToFractionQuestion(locale) {
  const isTenths = Math.random() > 0.5;
  const den = isTenths ? 10 : 100;
  const num = isTenths ? getRandomInt(3, 39) : getRandomInt(15, 185);
  const decValNum = num / den;
  const decVal = formatNumberLocale(decValNum, locale, {
    minimumFractionDigits: isTenths ? 1 : 2,
    maximumFractionDigits: 2
  });

  const correctText = `${num}/${den}`;

  const wrongCandidates = new Set();
  wrongCandidates.add(`${num}/${den === 10 ? 100 : 10}`);
  wrongCandidates.add(`${num + (num > 10 ? 5 : 2)}/${den}`);
  wrongCandidates.add(`${den}/${num}`);

  while (wrongCandidates.size < 3) {
    wrongCandidates.add(`${num + getRandomInt(1, 9)}/${den}`);
  }

  const wrongArr = Array.from(wrongCandidates).slice(0, 3);
  const rawOptions = [
    { num, den, text: correctText },
    { num: parseInt(wrongArr[0].split('/')[0], 10), den: parseInt(wrongArr[0].split('/')[1], 10), text: wrongArr[0] },
    { num: parseInt(wrongArr[1].split('/')[0], 10), den: parseInt(wrongArr[1].split('/')[1], 10), text: wrongArr[1] },
    { num: parseInt(wrongArr[2].split('/')[0], 10), den: parseInt(wrongArr[2].split('/')[1], 10), text: wrongArr[2] }
  ];

  const uniqueOptions = Array.from(
    new Map(rawOptions.map((item) => [item.text, item])).values()
  ).sort(() => Math.random() - 0.5);

  return {
    decVal,
    num,
    den,
    isTenths,
    options: uniqueOptions,
    correct: correctText
  };
}

function makePlaceValueQuestion(locale) {
  let intPart = 0;
  let tenths = 0;
  let hundredths = 0;

  while (true) {
    intPart = getRandomInt(1, 9);
    tenths = getRandomInt(1, 9);
    hundredths = getRandomInt(1, 9);
    if (intPart !== tenths && intPart !== hundredths && tenths !== hundredths) break;
  }

  const isTenthsTarget = Math.random() > 0.5;
  const sep = locale === 'en' ? '.' : ',';
  const decStr = `${intPart}${sep}${tenths}${hundredths}`;
  const correctDigit = isTenthsTarget ? tenths : hundredths;

  return {
    decStr,
    isTenthsTarget,
    correct: correctDigit
  };
}

function makeComparisonQuestion(locale) {
  const type = getRandomInt(1, 3);
  const sep = locale === 'en' ? '.' : ',';
  let valA = 0;
  let valB = 0;
  let strA = '';
  let strB = '';

  if (type === 1) {
    const intP = getRandomInt(1, 12);
    const d = getRandomInt(1, 9);
    valA = intP + d / 10;
    valB = valA;
    strA = `${intP}${sep}${d}`;
    strB = `${intP}${sep}${d}0`;
  } else if (type === 2) {
    const intP = getRandomInt(1, 12);
    const d = getRandomInt(3, 8);
    valA = intP + d / 10;
    const diff = getRandomInt(2, 8);
    const bPart = d * 10 - diff;
    valB = intP + bPart / 100;
    strA = `${intP}${sep}${d}`;
    strB = `${intP}${sep}${bPart}`;
  } else {
    const intP1 = getRandomInt(3, 14);
    const intP2 = intP1 - 1;
    const d1 = getRandomInt(10, 40);
    const d2 = getRandomInt(60, 95);
    valA = intP1 + d1 / 100;
    valB = intP2 + d2 / 100;
    strA = `${intP1}${sep}${d1}`;
    strB = `${intP2}${sep}${d2}`;
  }

  let correctSym = '＝';
  if (valA > valB) correctSym = '＞';
  if (valA < valB) correctSym = '＜';

  return {
    strA,
    strB,
    valA,
    valB,
    correct: correctSym
  };
}

function generateQuestions(locale) {
  return {
    q1: makeFractionToDecimalQuestion(locale),
    q2: makeFractionToDecimalQuestion(locale),
    q3: makeDecimalToFractionQuestion(locale),
    q4: makeDecimalToFractionQuestion(locale),
    q5: makePlaceValueQuestion(locale),
    q6: makePlaceValueQuestion(locale),
    q7: makeComparisonQuestion(locale),
    q8: makeComparisonQuestion(locale)
  };
}

export default function DekadikoiSinexeiaAskPage() {
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

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9]/g, '').slice(0, 10);
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
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (parseInt(answers.q6, 10) === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  const totalQuestions = 8;

  // Render Q1 & Q2: Κλάσμα ➔ Δεκαδικός (Input)
  const renderFractionToDecimal = (qKey, qData, numLabel) => {
    const isCorrect = checkDecimalMatch(answers[qKey], qData.correctVal, qData.correct);
    const leadText = qData.isTenths ? t.q1FbTenths : t.q1FbHundredths;

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
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {t.q1Prompt}
            </h3>
            <Fraction num={formatNumberLocale(qData.num, currentLocale)} den={formatNumberLocale(qData.den, currentLocale)} inline={true} />
          </div>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <Fraction num={formatNumberLocale(qData.num, currentLocale)} den={formatNumberLocale(qData.den, currentLocale)} inline={true} />
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
              className="w-32 sm:w-40 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-teal-900 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60 flex flex-wrap items-center gap-1.5">
                <span>{leadText}</span>
                <Fraction num={formatNumberLocale(qData.num, currentLocale)} den={formatNumberLocale(qData.den, currentLocale)} inline={true} />
                <span>＝</span>
                <span className="font-mono font-bold">{qData.correct}</span>.
              </div>
            ) : (
              <div className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60 flex flex-wrap items-center gap-1.5">
                <span>{t.q1FbErrorLead}</span>
                <span className="font-mono font-bold text-rose-900">{qData.correct}</span>.
                <span>{leadText}</span>
                <Fraction num={formatNumberLocale(qData.num, currentLocale)} den={formatNumberLocale(qData.den, currentLocale)} inline={true} />
                <span>＝</span>
                <span className="font-mono font-bold">{qData.correct}</span>.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Δεκαδικός ➔ Κλάσμα (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
  const renderDecimalToFraction = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    const fbDetail = qData.isTenths
      ? t.q3FbTenths.replace('{decVal}', qData.decVal)
      : t.q3FbHundredths.replace('{decVal}', qData.decVal);

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
            {t.q3PromptPrefix} <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{qData.decVal}</span>;
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
                <Fraction num={formatNumberLocale(opt.num, currentLocale)} den={formatNumberLocale(opt.den, currentLocale)} inline={true} />
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60 flex flex-wrap items-center gap-1.5">
                <span>{fbDetail}</span>
                <Fraction num={formatNumberLocale(qData.num, currentLocale)} den={formatNumberLocale(qData.den, currentLocale)} inline={true} />.
              </div>
            ) : (
              <div className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60 flex flex-wrap items-center gap-1.5">
                <span>{t.q3FbErrorLead}</span>
                <Fraction num={formatNumberLocale(qData.num, currentLocale)} den={formatNumberLocale(qData.den, currentLocale)} inline={true} />.
                <span>{fbDetail}</span>
                <Fraction num={formatNumberLocale(qData.num, currentLocale)} den={formatNumberLocale(qData.den, currentLocale)} inline={true} />.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Αξία Θέσης (Input)
  const renderPlaceValue = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    const placeName = qData.isTenthsTarget ? t.q5PlaceTenths : t.q5PlaceHundredths;
    const fbText = qData.isTenthsTarget
      ? t.q5FbTenths.replace('{digit}', qData.correct)
      : t.q5FbHundredths.replace('{digit}', qData.correct);

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
            {t.q5PromptPrefix} <span className="text-purple-600 font-extrabold">{placeName}</span> {t.q5PromptMiddle} <span className="text-purple-600 font-mono font-black text-lg sm:text-xl">{qData.decStr}</span>;
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">
              {t.q5InputLabel.replace('{place}', placeName)}
            </span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.q5Placeholder}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-28 sm:w-36 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-purple-900 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
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
                {t.q5FbErrorLead} <span className="font-mono font-bold text-rose-900">{qData.correct}</span>. {fbText}
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
    const fbText = qData.valA === qData.valB
      ? t.q7FbEqual.replace('{strA}', qData.strA).replace('{strB}', qData.strB)
      : t.q7FbDiff.replace('{strA}', qData.strA).replace('{strB}', qData.strB).replace('{sym}', qData.correct);

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
            <span>{qData.strA}</span>

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

            <span>{qData.strB}</span>
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
                {t.q7FbErrorLead} <span className="font-mono font-bold text-rose-900">{qData.strA} {qData.correct} {qData.strB}</span>. {fbText}
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
          className="bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 {t.title}
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-teal-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
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
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

function getRandomIntEndingInZero(min, max, step = 10) {
  const raw = Math.floor(Math.random() * (max - min + 1)) + min;
  return Math.round(raw / step) * step;
}

function formatNumberLocale(num, locale = 'el') {
  if (num === null || num === undefined || isNaN(num)) return '';
  return num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
}

// --- ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n --- //
const translations = {
  el: {
    metaTitle: "Ασκήσεις: Πρόσθεση και Αφαίρεση | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού: αντίστροφες πράξεις, δοκιμή πρόσθεσης και αφαίρεσης, εύρεση άγνωστου αριθμού και ορολογία.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    theoryUrl: "/d-dimotikou/3-prosthesi-afairesi",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Ασκήσεις: Πρόσθεση και Αφαίρεση",
    subtitle: "Πατώντας «Νέες Ασκήσεις», οι αριθμοί και οι ερωτήσεις ανανεώνονται αυτόματα από τη δεξαμενή!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    bottomPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    // Q1 & Q2
    q1PromptPrefix: "Γνωρίζουμε ότι",
    q1PromptSuffix: "Συμπλήρωσε την αντίστροφη αφαίρεση:",
    q1FbSuccess: "Αφαιρώντας έναν προσθετέο από το άθροισμα βρίσκουμε τον άλλον: {sum} － {sub} ＝ {correct}.",
    q1FbError: "Η σωστή διαφορά ισούται με τον άλλον προσθετέο: {sum} － {sub} ＝ {correct}.",
    // Q3 & Q4
    q3PromptPrefix: "Κάνε τη δοκιμή της αφαίρεσης",
    q3FbSuccess: "Στη δοκιμή της αφαίρεσης, το άθροισμα της διαφοράς και του αφαιρετέου δίνει τον αρχικό μειωτέο: {diff} ＋ {sub} ＝ {correct}.",
    q3FbError: "Το αποτέλεσμα της δοκιμής πρέπει να ταυτίζεται με τον μειωτέο: {diff} ＋ {sub} ＝ {correct}.",
    // Q5 & Q6
    q5Prompt: "Βρες τον αριθμό που λείπει εφαρμόζοντας την κατάλληλη αντίστροφη πράξη:",
    q5FbSuccessAdd: "Υπολογίστηκε σωστά με την αντίστροφη πράξη (αφαίρεση): {correct}.",
    q5FbSuccessSub: "Υπολογίστηκε σωστά με την αντίστροφη πράξη (πρόσθεση): {correct}.",
    q5FbErrorAdd: "Ο αριθμός που λείπει υπολογίζεται ως εξής: {target} － {known} ＝ {correct}.",
    q5FbErrorSub: "Ο αριθμός που λείπει υπολογίζεται ως εξής: {diff} ＋ {sub} ＝ {correct}."
  },
  en: {
    metaTitle: "Exercises: Addition and Subtraction | LearnMaths.gr",
    metaDesc: "Interactive math exercises for 4th Grade: inverse operations, checking addition and subtraction, missing number problems, and terminology.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    theoryBtn: "Theory",
    theoryUrl: "/en/d-dimotikou/3-prosthesi-afairesi",
    badge: "4TH GRADE • PRACTICE",
    title: "Exercises: Addition and Subtraction",
    subtitle: "Clicking 'New Exercises' generates new numbers and questions from the pool!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success Rate:",
    bottomPrompt: "Complete all questions and click 'Check Answers'!",
    // Q1 & Q2
    q1PromptPrefix: "We know that",
    q1PromptSuffix: "Fill in the inverse subtraction:",
    q1FbSuccess: "Subtracting one addend from the sum gives the other addend: {sum} － {sub} ＝ {correct}.",
    q1FbError: "The correct difference equals the other addend: {sum} － {sub} ＝ {correct}.",
    // Q3 & Q4
    q3PromptPrefix: "Check the subtraction by performing the inverse addition for",
    q3FbSuccess: "When checking subtraction, the sum of difference and subtrahend gives the original minuend: {diff} ＋ {sub} ＝ {correct}.",
    q3FbError: "The check result must equal the minuend: {diff} ＋ {sub} ＝ {correct}.",
    // Q5 & Q6
    q5Prompt: "Find the missing number by applying the appropriate inverse operation:",
    q5FbSuccessAdd: "Correctly calculated using the inverse operation (subtraction): {correct}.",
    q5FbSuccessSub: "Correctly calculated using the inverse operation (addition): {correct}.",
    q5FbErrorAdd: "The missing number is found by: {target} － {known} ＝ {correct}.",
    q5FbErrorSub: "The missing number is found by: {diff} ＋ {sub} ＝ {correct}."
  }
};

// Δεξαμενή ορολογίας με πλήρη υποστήριξη el/en
const TERMINOLOGY_POOL = [
  {
    qEl: 'Πώς ονομάζεται το αποτέλεσμα της πράξης της αφαίρεσης;',
    qEn: 'What is the result of a subtraction operation called?',
    correctEl: 'Διαφορά',
    correctEn: 'Difference',
    wrongsEl: ['Άθροισμα', 'Μειωτέος', 'Προσθετέος'],
    wrongsEn: ['Sum', 'Minuend', 'Addend']
  },
  {
    qEl: 'Πώς ονομάζονται οι δύο αριθμοί που προσθέτουμε σε μια πρόσθεση;',
    qEn: 'What are the numbers added together in an addition called?',
    correctEl: 'Προσθετέοι',
    correctEn: 'Addends',
    wrongsEl: ['Αφαιρετέοι', 'Διαφορές', 'Μειωτέοι'],
    wrongsEn: ['Subtrahends', 'Differences', 'Minuends']
  },
  {
    qEl: 'Πώς ονομάζεται το τελικό αποτέλεσμα της πράξης της πρόσθεσης;',
    qEn: 'What is the final result of an addition operation called?',
    correctEl: 'Άθροισμα',
    correctEn: 'Sum',
    wrongsEl: ['Διαφορά', 'Μειωτέος', 'Αφαιρετέος'],
    wrongsEn: ['Difference', 'Minuend', 'Subtrahend']
  },
  {
    qEl: 'Στην αφαίρεση 8.500 － 2.300 ＝ 6.200, ο αριθμός 8.500 ονομάζεται:',
    qEn: 'In the subtraction 8,500 － 2,300 ＝ 6,200, the number 8,500 is called:',
    correctEl: 'Μειωτέος',
    correctEn: 'Minuend',
    wrongsEl: ['Αφαιρετέος', 'Διαφορά', 'Άθροισμα'],
    wrongsEn: ['Subtrahend', 'Difference', 'Sum']
  },
  {
    qEl: 'Στην αφαίρεση 9.000 － 3.400 ＝ 5.600, ο αριθμός 3.400 ονομάζεται:',
    qEn: 'In the subtraction 9,000 － 3,400 ＝ 5,600, the number 3,400 is called:',
    correctEl: 'Αφαιρετέος',
    correctEn: 'Subtrahend',
    wrongsEl: ['Μειωτέος', 'Διαφορά', 'Προσθετέος'],
    wrongsEn: ['Minuend', 'Difference', 'Addend']
  },
  {
    qEl: 'Ποια πράξη αποτελεί την αντίστροφη πράξη της πρόσθεσης;',
    qEn: 'Which operation is the inverse of addition?',
    correctEl: 'Η αφαίρεση',
    correctEn: 'Subtraction',
    wrongsEl: ['Ο πολλαπλασιασμός', 'Η διαίρεση', 'Η στρογγυλοποίηση'],
    wrongsEn: ['Multiplication', 'Division', 'Rounding']
  },
  {
    qEl: 'Για να κάνουμε δοκιμή (επαλήθευση) σε μια αφαίρεση, υπολογίζουμε:',
    qEn: 'To check (verify) a subtraction, we calculate:',
    correctEl: 'Διαφορά ＋ Αφαιρετέος',
    correctEn: 'Difference ＋ Subtrahend',
    wrongsEl: ['Μειωτέος ＋ Διαφορά', 'Μειωτέος ＋ Αφαιρετέος', 'Διαφορά － Αφαιρετέος'],
    wrongsEn: ['Minuend ＋ Difference', 'Minuend ＋ Subtrahend', 'Difference － Subtrahend']
  }
];

// --- ΓΕΝΝΗΤΡΙΕΣ ΕΡΩΤΗΣΕΩΝ --- //

function makeAdditionCheckQuestion() {
  const a = getRandomIntEndingInZero(1200, 9500, 50);
  const b = getRandomIntEndingInZero(800, 4800, 50);
  const sum = a + b;

  const subtractA = Math.random() > 0.5;
  const subNum = subtractA ? a : b;
  const correctResult = subtractA ? b : a;

  return {
    a,
    b,
    sum,
    subNum,
    correct: correctResult
  };
}

function makeSubtractionCheckQuestion() {
  const diff = getRandomIntEndingInZero(1500, 8500, 50);
  const sub = getRandomIntEndingInZero(600, 4500, 50);
  const min = diff + sub;

  return {
    min,
    sub,
    diff,
    correct: min
  };
}

function makeMissingNumberQuestion() {
  const typeChoice = getRandomInt(1, 3);
  const a = getRandomIntEndingInZero(1500, 8500, 50);
  const b = getRandomIntEndingInZero(600, 4200, 50);

  if (typeChoice === 1) {
    const sum = a + b;
    return {
      type: 'add-second',
      knownA: a,
      target: sum,
      correct: b
    };
  } else if (typeChoice === 2) {
    const sum = a + b;
    return {
      type: 'add-first',
      knownB: b,
      target: sum,
      correct: a
    };
  } else {
    const min = a + b;
    return {
      type: 'sub-min',
      knownSub: b,
      knownDiff: a,
      correct: min
    };
  }
}

function makeTerminologyQuestion(locale) {
  const item = TERMINOLOGY_POOL[getRandomInt(0, TERMINOLOGY_POOL.length - 1)];
  const qText = locale === 'en' ? item.qEn : item.qEl;
  const correctText = locale === 'en' ? item.correctEn : item.correctEl;
  const wrongs = locale === 'en' ? item.wrongsEn : item.wrongsEl;

  const shuffledWrongs = [...wrongs].sort(() => Math.random() - 0.5).slice(0, 3);
  const rawOptions = [correctText, ...shuffledWrongs];
  const uniqueOptions = [...new Set(rawOptions)].sort(() => Math.random() - 0.5);

  return {
    questionText: qText,
    options: uniqueOptions,
    correct: correctText
  };
}

function generateQuestions(locale) {
  return {
    q1: makeAdditionCheckQuestion(),
    q2: makeAdditionCheckQuestion(),
    q3: makeSubtractionCheckQuestion(),
    q4: makeSubtractionCheckQuestion(),
    q5: makeMissingNumberQuestion(),
    q6: makeMissingNumberQuestion(),
    q7: makeTerminologyQuestion(locale),
    q8: makeTerminologyQuestion(locale)
  };
}

export default function ProsthesiAfairesiAskPage() {
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
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (parseInt(answers.q6, 10) === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  const totalQuestions = 8;

  // Render Q1 & Q2: Επαλήθευση Πρόσθεσης
  const renderAdditionCheck = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-blue-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.q1PromptPrefix}{' '}
            <span className="text-blue-600 font-mono font-black text-lg">
              {formatNumberLocale(qData.a, currentLocale)} ＋ {formatNumberLocale(qData.b, currentLocale)} ＝ {formatNumberLocale(qData.sum, currentLocale)}
            </span>.{' '}
            {t.q1PromptSuffix}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{formatNumberLocale(qData.sum, currentLocale)}</span>
            <span>－</span>
            <span>{formatNumberLocale(qData.subNum, currentLocale)}</span>
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
              className="w-32 sm:w-36 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-blue-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {t.q1FbSuccess
                  .replace('{sum}', formatNumberLocale(qData.sum, currentLocale))
                  .replace('{sub}', formatNumberLocale(qData.subNum, currentLocale))
                  .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q1FbError
                  .replace('{sum}', formatNumberLocale(qData.sum, currentLocale))
                  .replace('{sub}', formatNumberLocale(qData.subNum, currentLocale))
                  .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Επαλήθευση Αφαίρεσης (Δοκιμή)
  const renderSubtractionCheck = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
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
            {t.q3PromptPrefix}{' '}
            <span className="text-purple-600 font-mono font-black text-lg">
              {formatNumberLocale(qData.min, currentLocale)} － {formatNumberLocale(qData.sub, currentLocale)} ＝ {formatNumberLocale(qData.diff, currentLocale)}
            </span>:
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{formatNumberLocale(qData.diff, currentLocale)}</span>
            <span>＋</span>
            <span>{formatNumberLocale(qData.sub, currentLocale)}</span>
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
              className="w-32 sm:w-36 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-purple-900 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {t.q3FbSuccess
                  .replace('{diff}', formatNumberLocale(qData.diff, currentLocale))
                  .replace('{sub}', formatNumberLocale(qData.sub, currentLocale))
                  .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q3FbError
                  .replace('{diff}', formatNumberLocale(qData.diff, currentLocale))
                  .replace('{sub}', formatNumberLocale(qData.sub, currentLocale))
                  .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Εύρεση Άγνωστου Αριθμού
  const renderMissingNumber = (qKey, qData, numLabel) => {
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
            {t.q5Prompt}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            {qData.type === 'add-second' && (
              <>
                <span>{formatNumberLocale(qData.knownA, currentLocale)}</span>
                <span>＋</span>
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
                  className="w-32 sm:w-36 p-2 rounded-xl border-2 border-amber-400 bg-amber-50 text-amber-900 font-mono text-base sm:text-xl font-black text-center focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
                />
                <span>＝</span>
                <span>{formatNumberLocale(qData.target, currentLocale)}</span>
              </>
            )}

            {qData.type === 'add-first' && (
              <>
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
                  className="w-32 sm:w-36 p-2 rounded-xl border-2 border-amber-400 bg-amber-50 text-amber-900 font-mono text-base sm:text-xl font-black text-center focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
                />
                <span>＋</span>
                <span>{formatNumberLocale(qData.knownB, currentLocale)}</span>
                <span>＝</span>
                <span>{formatNumberLocale(qData.target, currentLocale)}</span>
              </>
            )}

            {qData.type === 'sub-min' && (
              <>
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
                  className="w-32 sm:w-36 p-2 rounded-xl border-2 border-amber-400 bg-amber-50 text-amber-900 font-mono text-base sm:text-xl font-black text-center focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
                />
                <span>－</span>
                <span>{formatNumberLocale(qData.knownSub, currentLocale)}</span>
                <span>＝</span>
                <span>{formatNumberLocale(qData.knownDiff, currentLocale)}</span>
              </>
            )}
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.type.startsWith('add')
                  ? t.q5FbSuccessAdd.replace('{correct}', formatNumberLocale(qData.correct, currentLocale))
                  : t.q5FbSuccessSub.replace('{correct}', formatNumberLocale(qData.correct, currentLocale))}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {qData.type.startsWith('add')
                  ? t.q5FbErrorAdd
                      .replace('{target}', formatNumberLocale(qData.target, currentLocale))
                      .replace('{known}', formatNumberLocale(qData.knownA || qData.knownB, currentLocale))
                      .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))
                  : t.q5FbErrorSub
                      .replace('{diff}', formatNumberLocale(qData.knownDiff, currentLocale))
                      .replace('{sub}', formatNumberLocale(qData.knownSub, currentLocale))
                      .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Ορολογία (ΟΜΑΔΑ Α - 4 Επιλογές)
  const renderTerminology = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
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
            {qData.questionText}
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
                    ? 'border-amber-500 bg-amber-50/80 font-bold text-amber-950 shadow-sm'
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
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500 shrink-0"
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
                {currentLocale === 'en'
                  ? `The mathematical term is indeed "${qData.correct}".`
                  : `Ο μαθηματικός όρος είναι πράγματι «${qData.correct}».`}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {currentLocale === 'en'
                  ? `The correct mathematical term is "${qData.correct}".`
                  : `Ο ορθός μαθηματικός όρος είναι «${qData.correct}».`}
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
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
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
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 {t.title}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-blue-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderAdditionCheck('q1', questions.q1, 1)}
          {renderAdditionCheck('q2', questions.q2, 2)}

          {renderSubtractionCheck('q3', questions.q3, 3)}
          {renderSubtractionCheck('q4', questions.q4, 4)}

          {renderMissingNumber('q5', questions.q5, 5)}
          {renderMissingNumber('q6', questions.q6, 6)}

          {renderTerminology('q7', questions.q7, 7)}
          {renderTerminology('q8', questions.q8, 8)}

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
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ ΚΑΘΑΡΙΣΜΟΥ ΚΑΙ ΤΥΠΟΓΡΑΦΙΑΣ --- //

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

function formatNumberLocale(num, locale = 'el') {
  if (num === null || num === undefined || isNaN(num)) return '';
  return num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
}

// Μετατροπή ακεραίου σε λεκτικό στα Ελληνικά (έως 20.000)
function numberToGreekWords(num) {
  if (num === 0) return 'μηδέν';
  if (num === 20000) return 'είκοσι χιλιάδες';

  const units = ['', 'ένα', 'δύο', 'τρία', 'τέσσερα', 'πέντε', 'έξι', 'επτά', 'οκτώ', 'εννέα'];
  const tens = ['', 'δέκα', 'είκοσι', 'τριάντα', 'σαράντα', 'πενήντα', 'εξήντα', 'εβδομήντα', 'ογδόντα', 'εννενήντα'];
  const hundreds = ['', 'εκατό', 'διακόσια', 'τριακόσια', 'τετρακόσια', 'πεντακόσια', 'εξακόσια', 'επτακόσια', 'οκτακόσια', 'εννιακόσια'];

  const thousandWords = [
    '', 'χίλια', 'δύο χιλιάδες', 'τρεις χιλιάδες', 'τέσσερις χιλιάδες',
    'πέντε χιλιάδες', 'έξι χιλιάδες', 'επτά χιλιάδες', 'οκτώ χιλιάδες', 'εννέα χιλιάδες',
    'δέκα χιλιάδες', 'έντεκα χιλιάδες', 'δώδεκα χιλιάδες', 'δεκατρείς χιλιάδες',
    'δεκατέσσερις χιλιάδες', 'δεκαπέντε χιλιάδες', 'δεκαέξι χιλιάδες', 'δεκαεπτά χιλιάδες',
    'δεκαοκτώ χιλιάδες', 'δεκαεννέα χιλιάδες', 'είκοσι χιλιάδες'
  ];

  const th = Math.floor(num / 1000);
  const rem = num % 1000;

  let res = '';
  if (th > 0 && th <= 20) {
    res += thousandWords[th] + ' ';
  }

  if (rem > 0) {
    const e = Math.floor(rem / 100);
    const d = Math.floor((rem % 100) / 10);
    const m = rem % 10;

    if (e > 0) {
      if (e === 1 && (d > 0 || m > 0)) res += 'εκατόν ';
      else res += hundreds[e] + ' ';
    }

    if (d === 1) {
      if (m === 0) res += 'δέκα';
      else if (m === 1) res += 'έντεκα';
      else if (m === 2) res += 'δώδεκα';
      else if (m === 3) res += 'δεκατρία';
      else if (m === 4) res += 'δεκατέσσερα';
      else res += 'δέκα ' + units[m];
    } else {
      if (d > 1) res += tens[d] + ' ';
      if (m > 0) res += units[m];
    }
  }

  return res.trim().replace(/\s+/g, ' ');
}

// Μετατροπή ακεραίου σε λεκτικό στα Αγγλικά (έως 20.000)
function numberToEnglishWords(num) {
  if (num === 0) return 'zero';
  if (num === 20000) return 'twenty thousand';

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const convertBelowThousand = (n) => {
    let s = '';
    const h = Math.floor(n / 100);
    const rem = n % 100;

    if (h > 0) {
      s += ones[h] + ' hundred';
      if (rem > 0) s += ' and ';
    }

    if (rem > 0) {
      if (rem < 10) {
        s += ones[rem];
      } else if (rem < 20) {
        s += teens[rem - 10];
      } else {
        const t = Math.floor(rem / 10);
        const u = rem % 10;
        s += tens[t];
        if (u > 0) s += '-' + ones[u];
      }
    }
    return s.trim();
  };

  const thousands = Math.floor(num / 1000);
  const remainder = num % 1000;

  let result = '';
  if (thousands > 0) {
    result += convertBelowThousand(thousands) + ' thousand';
    if (remainder > 0) {
      result += remainder < 100 ? ' and ' : ' ';
    }
  }

  if (remainder > 0) {
    result += convertBelowThousand(remainder);
  }

  return result.trim().replace(/\s+/g, ' ');
}

// --- ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n --- //
const translations = {
  el: {
    metaTitle: "Ασκήσεις: Αριθμοί έως το 20.000 | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού: ανάγνωση, γραφή, αξία θέσης ψηφίου και σύγκριση αριθμών έως το 20.000.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Ασκήσεις: Αριθμοί έως το 20.000",
    subtitle: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    bottomPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    // Q1 & Q2
    mcqPrompt: "Πώς διαβάζεται σωστά ο αριθμός",
    mcqFbSuccess: "Ο αριθμός {num} διαβάζεται αναλύοντας πρώτα τις χιλιάδες και έπειτα τις μονάδες: «{ans}».",
    mcqFbError: "Η ορθή ανάγνωση του αριθμού {num} είναι: «{ans}».",
    // Q3 & Q4
    pvPrompt: "Ποια είναι η πραγματική αξία του ψηφίου",
    pvInNumber: "στον αριθμό",
    pvParenthesis: "Το ψηφίο βρίσκεται στη θέση των {place}",
    pvPlaceholder: "Γράψε την αξία (π.χ. 4000)",
    pvFbSuccess: "Το ψηφίο {digit} εκφράζει {digit} {place}, δηλαδή {digit} · {mult} ＝ {ans}.",
    pvFbError: "Το ψηφίο {digit} βρίσκεται στη θέση των {place}, άρα η πραγματική του αξία είναι {digit} · {mult} ＝ {ans}.",
    // Q5 & Q6
    decPrompt: "Συμπλήρωσε τον αριθμό που λείπει από την ανάλυση:",
    decFbSuccess: "Η σωστή ανάλυση του αριθμού προκύπτει από το άθροισμα των επιμέρους αξιών των ψηφίων του.",
    decFbError: "Ο όρος που έλειπε είναι ο {correct}, ώστε το συνολικό άθροισμα να ισούται με {num}.",
    // Q7 & Q8
    compPrompt: "Επίλεξε το κατάλληλο σύμβολο σύγκρισης ( ＜ , ＝ , ＞ ):",
    compFbSame: "Οι δύο αριθμοί έχουν ακριβώς την ίδια αξία σε όλες τις τάξεις μεγέθους.",
    compFbDiff: "Συγκρίνοντας από τα αριστερά προς τα δεξιά, ισχύει {a} {sym} {b}.",
    compFbError: "Η ορθή σύγκριση είναι {a} {sym} {b}."
  },
  en: {
    metaTitle: "Exercises: Numbers up to 20,000 | LearnMaths.gr",
    metaDesc: "Interactive math exercises for 4th Grade: reading, writing, place value, and comparing numbers up to 20,000.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    theoryBtn: "Theory",
    badge: "4TH GRADE • PRACTICE",
    title: "Exercises: Numbers up to 20,000",
    subtitle: "Every time you click 'New Exercises', new dynamic problems are generated from the pool!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success Rate:",
    bottomPrompt: "Complete all questions and click 'Check Answers'!",
    // Q1 & Q2
    mcqPrompt: "How is the number correctly read:",
    mcqFbSuccess: "The number {num} is read by breaking down thousands and units: \"{ans}\".",
    mcqFbError: "The correct reading of {num} is: \"{ans}\".",
    // Q3 & Q4
    pvPrompt: "What is the place value of the digit",
    pvInNumber: "in the number",
    pvParenthesis: "The digit is in the position of {place}",
    pvPlaceholder: "Enter the value (e.g. 4000)",
    pvFbSuccess: "Digit {digit} represents {digit} {place}, meaning {digit} · {mult} ＝ {ans}.",
    pvFbError: "Digit {digit} is in the position of {place}, so its place value is {digit} · {mult} ＝ {ans}.",
    // Q5 & Q6
    decPrompt: "Fill in the missing number in the decomposition:",
    decFbSuccess: "The correct decomposition is formed by adding the place value of each digit.",
    decFbError: "The missing term is {correct}, making the total sum equal to {num}.",
    // Q7 & Q8
    compPrompt: "Select the appropriate comparison sign ( ＜ , ＝ , ＞ ):",
    compFbSame: "Both numbers have identical value across all place values.",
    compFbDiff: "Comparing digits from left to right, we get {a} {sym} {b}.",
    compFbError: "The correct comparison is {a} {sym} {b}."
  }
};

// --- ΓΕΝΝΗΤΡΙΕΣ ΕΡΩΤΗΣΕΩΝ --- //

function makeMCQQuestion(locale) {
  const num = getRandomInt(1000, 19999);
  const toWords = locale === 'en' ? numberToEnglishWords : numberToGreekWords;
  const correctText = toWords(num);

  const wrongCandidates = new Set();

  const diffK = (num >= 10000 ? -1 : 1) * (getRandomInt(1, 3) * 1000);
  const w1 = Math.max(1000, Math.min(20000, num + diffK));
  if (w1 !== num) wrongCandidates.add(toWords(w1));

  const diffH = (num % 1000 >= 500 ? -1 : 1) * 200;
  const w2 = Math.max(1000, Math.min(20000, num + diffH));
  if (w2 !== num) wrongCandidates.add(toWords(w2));

  const lastTwo = num % 100;
  const d = Math.floor(lastTwo / 10);
  const m = lastTwo % 10;
  let w3 = num - lastTwo + (m * 10 + d);
  if (w3 === num || w3 > 20000) w3 = num > 1500 ? num - 50 : num + 50;
  wrongCandidates.add(toWords(w3));

  let step = 100;
  while (wrongCandidates.size < 3) {
    const candidate = Math.max(1000, Math.min(19999, num + step));
    if (candidate !== num) wrongCandidates.add(toWords(candidate));
    step += 150;
  }

  const rawOptions = [
    correctText,
    ...Array.from(wrongCandidates).slice(0, 3)
  ];
  const uniqueOptions = [...new Set(rawOptions)].sort(() => Math.random() - 0.5);

  return { number: num, options: uniqueOptions, correct: correctText };
}

function makePlaceValueQuestion(locale) {
  const places = [
    { nameEl: 'Δεκάδων Χιλιάδων', nameEn: 'Ten Thousands', short: 'ΔΧ', multiplier: 10000 },
    { nameEl: 'Μονάδων Χιλιάδων', nameEn: 'Thousands', short: 'Χ', multiplier: 1000 },
    { nameEl: 'Εκατοντάδων', nameEn: 'Hundreds', short: 'Ε', multiplier: 100 },
    { nameEl: 'Δεκάδων', nameEn: 'Tens', short: 'Δ', multiplier: 10 },
    { nameEl: 'Μονάδων', nameEn: 'Units', short: 'Μ', multiplier: 1 }
  ];

  let num = 0;
  let chosenPlace = places[0];
  let digit = 0;

  while (true) {
    num = getRandomInt(1000, 19999);
    const validPlaces = places.filter(p => Math.floor(num / p.multiplier) % 10 > 0);
    chosenPlace = validPlaces[getRandomInt(0, validPlaces.length - 1)];
    digit = Math.floor(num / chosenPlace.multiplier) % 10;

    const count = num.toString().split('').filter(c => c === digit.toString()).length;
    if (count === 1) break;
  }

  return {
    number: num,
    digit,
    placeName: locale === 'en' ? chosenPlace.nameEn : chosenPlace.nameEl,
    multiplier: chosenPlace.multiplier,
    correct: digit * chosenPlace.multiplier
  };
}

function makeDecompositionQuestion() {
  const num = getRandomInt(2500, 19999);
  const dx = Math.floor(num / 10000) * 10000;
  const x = Math.floor((num % 10000) / 1000) * 1000;
  const e = Math.floor((num % 1000) / 100) * 100;
  const d = Math.floor((num % 100) / 10) * 10;
  const m = num % 10;

  const components = [
    { name: 'dx', val: dx },
    { name: 'x', val: x },
    { name: 'e', val: e },
    { name: 'd', val: d },
    { name: 'm', val: m }
  ].filter(c => c.val > 0);

  const missingComp = components[getRandomInt(0, components.length - 1)];

  return {
    number: num,
    parts: { dx, x, e, d, m },
    missingKey: missingComp.name,
    correct: missingComp.val
  };
}

function makeComparisonQuestion() {
  const type = getRandomInt(1, 4);
  let numA = getRandomInt(1000, 20000);
  let numB = getRandomInt(1000, 20000);

  if (type === 1) {
    numB = numA;
  } else if (type === 2) {
    const base = getRandomInt(1000, 1990) * 10;
    numA = base + getRandomInt(1, 9);
    numB = base + getRandomInt(1, 9);
  } else if (type === 3) {
    const th = getRandomInt(1, 19);
    const d1 = getRandomInt(2, 9);
    numA = th * 1000 + d1 * 100;
    numB = th * 1000 + d1 * 10;
  }

  let correctSym = '＝';
  if (numA > numB) correctSym = '＞';
  if (numA < numB) correctSym = '＜';

  return { numA, numB, correct: correctSym };
}

function generateQuestions(locale) {
  return {
    q1: makeMCQQuestion(locale),
    q2: makeMCQQuestion(locale),
    q3: makePlaceValueQuestion(locale),
    q4: makePlaceValueQuestion(locale),
    q5: makeDecompositionQuestion(),
    q6: makeDecompositionQuestion(),
    q7: makeComparisonQuestion(),
    q8: makeComparisonQuestion()
  };
}

export default function ArithmoiEos20XiliadesAskPage() {
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
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9]/g, '').slice(0, 10);
    setAnswers(prev => ({ ...prev, [key]: clean }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    if (answers.q1 === questions.q1.correct) currentScore += 1;
    if (answers.q2 === questions.q2.correct) currentScore += 1;
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (parseInt(answers.q6, 10) === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render MCQ (Q1 & Q2)
  const renderMCQ = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
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
            {t.mcqPrompt} <span className="text-blue-600 font-mono font-black text-lg sm:text-xl">{formatNumberLocale(qData.number, currentLocale)}</span>;
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-950 shadow-sm'
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
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 shrink-0"
                />
                <span className="capitalize leading-snug break-words whitespace-normal flex-1">
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
                {t.mcqFbSuccess
                  .replace('{num}', formatNumberLocale(qData.number, currentLocale))
                  .replace('{ans}', qData.correct)}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.mcqFbError
                  .replace('{num}', formatNumberLocale(qData.number, currentLocale))
                  .replace('{ans}', qData.correct)}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Place Value (Q3 & Q4)
  const renderPlaceValue = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
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
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {t.pvPrompt} <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{qData.digit}</span> {t.pvInNumber} <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{formatNumberLocale(qData.number, currentLocale)}</span>;
            </h3>
            <p className="text-xs text-slate-500">
              ({t.pvParenthesis.replace('{place}', qData.placeName)})
            </p>
          </div>
        </div>

        <div className="sm:pl-11 space-y-3">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={10}
            id={`input-${qKey}`}
            name={`input-${qKey}`}
            placeholder={t.pvPlaceholder}
            value={answers[qKey]}
            onChange={(e) => handleNumericInput(qKey, e.target.value)}
            disabled={submitted}
            className="w-full sm:w-80 p-3 rounded-2xl border border-slate-300 font-mono text-base sm:text-lg font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-xs placeholder:font-normal placeholder:text-slate-400 bg-slate-50/50"
          />
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {t.pvFbSuccess
                  .replace(/\{digit\}/g, qData.digit)
                  .replace(/\{place\}/g, qData.placeName)
                  .replace(/\{mult\}/g, formatNumberLocale(qData.multiplier, currentLocale))
                  .replace(/\{ans\}/g, formatNumberLocale(qData.correct, currentLocale))}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.pvFbError
                  .replace(/\{digit\}/g, qData.digit)
                  .replace(/\{place\}/g, qData.placeName)
                  .replace(/\{mult\}/g, formatNumberLocale(qData.multiplier, currentLocale))
                  .replace(/\{ans\}/g, formatNumberLocale(qData.correct, currentLocale))}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Decomposition (Q5 & Q6)
  const renderDecomposition = (qKey, qData, numLabel) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    const partsArray = [
      { key: 'dx', val: qData.parts.dx },
      { key: 'x', val: qData.parts.x },
      { key: 'e', val: qData.parts.e },
      { key: 'd', val: qData.parts.d },
      { key: 'm', val: qData.parts.m }
    ].filter(p => p.val > 0);

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
            {t.decPrompt}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-1.5 leading-relaxed break-words px-3.5 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-sm sm:text-base font-bold text-slate-800 w-full">
            <span className="text-teal-700 font-black">{formatNumberLocale(qData.number, currentLocale)}</span>
            <span>＝</span>

            {partsArray.map((part, idx) => (
              <span key={part.key} className="inline-flex items-center gap-1.5">
                {qData.missingKey === part.key ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={10}
                    id={`input-${qKey}-${part.key}`}
                    name={`input-${qKey}-${part.key}`}
                    value={answers[qKey]}
                    onChange={(e) => handleNumericInput(qKey, e.target.value)}
                    disabled={submitted}
                    className="w-24 sm:w-28 p-1.5 bg-amber-50 border-2 border-amber-400 rounded-xl text-center text-amber-900 font-mono font-black focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="?"
                  />
                ) : (
                  <span>{formatNumberLocale(part.val, currentLocale)}</span>
                )}
                {idx < partsArray.length - 1 && <span>＋</span>}
              </span>
            ))}
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {t.decFbSuccess}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.decFbError
                  .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))
                  .replace('{num}', formatNumberLocale(qData.number, currentLocale))}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Comparison (Q7 & Q8)
  const renderComparison = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
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
            {t.compPrompt}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-lg sm:text-2xl font-mono font-black text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span>{formatNumberLocale(qData.numA, currentLocale)}</span>

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

            <span>{formatNumberLocale(qData.numB, currentLocale)}</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.numA === qData.numB
                  ? t.compFbSame
                  : t.compFbDiff
                      .replace('{a}', formatNumberLocale(qData.numA, currentLocale))
                      .replace('{sym}', qData.correct)
                      .replace('{b}', formatNumberLocale(qData.numB, currentLocale))}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.compFbError
                  .replace('{a}', formatNumberLocale(qData.numA, currentLocale))
                  .replace('{sym}', qData.correct)
                  .replace('{b}', formatNumberLocale(qData.numB, currentLocale))}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const totalQuestions = 8;

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl={t.backUrl}
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/1-arithmoi-eos-20-xiliades"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
          </button>
        </div>

        {/* FORM ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderMCQ('q1', questions.q1, 1)}
          {renderMCQ('q2', questions.q2, 2)}

          {renderPlaceValue('q3', questions.q3, 3)}
          {renderPlaceValue('q4', questions.q4, 4)}

          {renderDecomposition('q5', questions.q5, 5)}
          {renderDecomposition('q6', questions.q6, 6)}

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
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ & ΤΥΠΟΓΡΑΦΙΑ --- //

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

// Οπτικό στοιχείο κλάσματος (κατακόρυφη διάταξη)
function Fraction({ num, den, inline = false }) {
  return (
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
}

const POLYGON_DATA = {
  3: {
    nameEl: 'Τρίγωνο',
    nameEn: 'Triangle',
    descEl: '3 πλευρές, 3 κορυφές και 3 γωνίες',
    descEn: '3 sides, 3 vertices, and 3 angles',
  },
  4: {
    nameEl: 'Τετράπλευρο (Τετράγωνο)',
    nameEn: 'Quadrilateral (Square)',
    descEl: '4 πλευρές, 4 κορυφές και 4 γωνίες',
    descEn: '4 sides, 4 vertices, and 4 angles',
  },
  5: {
    nameEl: 'Πεντάγωνο',
    nameEn: 'Pentagon',
    descEl: '5 πλευρές, 5 κορυφές και 5 γωνίες',
    descEn: '5 sides, 5 vertices, and 5 angles',
  },
  6: {
    nameEl: 'Εξάγωνο',
    nameEn: 'Hexagon',
    descEl: '6 πλευρές, 6 κορυφές και 6 γωνίες',
    descEn: '6 sides, 6 vertices, and 6 angles',
  },
  7: {
    nameEl: 'Επτάγωνο',
    nameEn: 'Heptagon',
    descEl: '7 πλευρές, 7 κορυφές και 7 γωνίες',
    descEn: '7 sides, 7 vertices, and 7 angles',
  },
  8: {
    nameEl: 'Οκτάγωνο',
    nameEn: 'Octagon',
    descEl: '8 πλευρές, 8 κορυφές και 8 γωνίες',
    descEn: '8 sides, 8 vertices, and 8 angles',
  },
};

function generateSvgPoints(sides, radius = 54, centerX = 75, centerY = 75) {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = Math.round((centerX + radius * Math.cos(angle)) * 10) / 10;
    const y = Math.round((centerY + radius * Math.sin(angle)) * 10) / 10;
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

// --- ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n --- //
const translations = {
  el: {
    metaTitle: "Ασκήσεις: Τα Πολύγωνα | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στα πολύγωνα: αναγνώριση σχημάτων, πλήθος πλευρών και υπολογισμός περιμέτρου.",
    backUrl: "/d-dimotikou",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    theoryUrl: "/d-dimotikou/2-poligona",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Ασκήσεις: Τα Πολύγωνα",
    subtitle: "Πατώντας «Νέες Ασκήσεις», τα σχήματα και οι αριθμοί ανανεώνονται αυτόματα από τη δεξαμενή!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    bottomPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    unitCm: "εκ.",
    // Q1 & Q2
    q1Prompt: "Πώς ονομάζεται το παρακάτω κανονικό πολύγωνο με βάση το πλήθος των πλευρών του;",
    q1FbSuccess: "Το γεωμετρικό σχήμα διαθέτει ακριβώς {sides} πλευρές, συνεπώς είναι ένα {poly} ({desc}).",
    q1FbError: "Μετρώντας προσεκτικά τις πλευρές διαπιστώνουμε ότι είναι {sides}, επομένως το σωστό όνομα είναι «{correct}».",
    // Q3 & Q4
    q3PromptPrefix: "Πόσες",
    q3PromptMiddle: "έχει συνολικά ένα κανονικό",
    q3Placeholder: "Γράψε τον αριθμό (π.χ. 5)",
    q3FbSuccess: "Σε κάθε πολύγωνο, το πλήθος των πλευρών, των κορυφών και των γωνιών είναι πάντοτε ίσο μεταξύ του (εδώ: {correct}).",
    q3FbError: "Ένα {poly} έχει ακριβώς {correct} {feat}.",
    featSides: "πλευρές",
    featVertices: "κορυφές",
    featAngles: "γωνίες",
    // Q5 & Q6
    q5PromptPrefix: "Ένα κανονικό",
    q5PromptMiddle: "έχει κάθε πλευρά του ίση με",
    q5PromptSuffix: "Πόση είναι η περίμετρός του;",
    q5Placeholder: "Γράψε την περίμετρο",
    q5FbSuccess: "Η περίμετρος προκύπτει πολλαπλασιάζοντας το πλήθος των ίσων πλευρών με το μήκος της καθεμίας: {sides} · {len} {unit} ＝ {correct} {unit}.",
    q5FbError: "Εφόσον όλες οι πλευρές είναι ίσες, η περίμετρος ισούται με {sides} · {len} {unit} ＝ {correct} {unit}.",
    // Q7 & Q8
    q7PromptPrefix: "Η περίμετρος ενός κανονικού",
    q7PromptMiddle: "είναι",
    q7PromptSuffix: "Πόσο είναι το μήκος κάθε πλευράς του;",
    q7Placeholder: "Γράψε το μήκος της πλευράς",
    q7FbSuccessText: "Διαιρώντας τη συνολική περίμετρο με το πλήθος των ίσων πλευρών βρίσκουμε το μήκος της πλευράς:",
    q7FbErrorText: "Κάθε πλευρά υπολογίζεται από τη διαίρεση της περιμέτρου δια του αριθμού των πλευρών:",
  },
  en: {
    metaTitle: "Exercises: Polygons | LearnMaths.gr",
    metaDesc: "Interactive math exercises for 4th Grade on polygons: shape recognition, counting sides, and perimeter calculations.",
    backUrl: "/en/d-dimotikou",
    backText: "4th Grade",
    theoryBtn: "Theory",
    theoryUrl: "/en/d-dimotikou/2-poligona",
    badge: "4TH GRADE • PRACTICE",
    title: "Exercises: Polygons",
    subtitle: "Clicking 'New Exercises' generates brand new shapes and numbers from the pool!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success Rate:",
    bottomPrompt: "Complete all questions and click 'Check Answers'!",
    unitCm: "cm",
    // Q1 & Q2
    q1Prompt: "What is the name of the following regular polygon based on the number of its sides?",
    q1FbSuccess: "This geometric shape has exactly {sides} sides, so it is a {poly} ({desc}).",
    q1FbError: "Counting the sides carefully reveals there are {sides}, so the correct name is \"{correct}\".",
    // Q3 & Q4
    q3PromptPrefix: "How many",
    q3PromptMiddle: "does a regular",
    q3Placeholder: "Enter the number (e.g. 5)",
    q3FbSuccess: "In every polygon, the number of sides, vertices, and angles is always equal (here: {correct}).",
    q3FbError: "A regular {poly} has exactly {correct} {feat}.",
    featSides: "sides",
    featVertices: "vertices",
    featAngles: "angles",
    // Q5 & Q6
    q5PromptPrefix: "A regular",
    q5PromptMiddle: "has each side measuring",
    q5PromptSuffix: "What is its perimeter?",
    q5Placeholder: "Enter the perimeter",
    q5FbSuccess: "The perimeter is found by multiplying the number of equal sides by the length of each side: {sides} · {len} {unit} ＝ {correct} {unit}.",
    q5FbError: "Since all sides are equal, the perimeter is {sides} · {len} {unit} ＝ {correct} {unit}.",
    // Q7 & Q8
    q7PromptPrefix: "The perimeter of a regular",
    q7PromptMiddle: "is",
    q7PromptSuffix: "What is the length of each of its sides?",
    q7Placeholder: "Enter side length",
    q7FbSuccessText: "Dividing the total perimeter by the number of equal sides gives the side length:",
    q7FbErrorText: "Each side is calculated by dividing the perimeter by the number of sides:",
  },
};

// --- ΓΕΝΝΗΤΡΙΕΣ ΕΡΩΤΗΣΕΩΝ --- //

function makeIdentifyQuestion(locale) {
  const sides = getRandomInt(3, 8);
  const polyData = POLYGON_DATA[sides];
  const correctName = locale === 'en' ? polyData.nameEn : polyData.nameEl;

  const candidateSides = [3, 4, 5, 6, 7, 8].filter((s) => s !== sides);
  candidateSides.sort(() => Math.random() - 0.5);

  const wrongSides = candidateSides.slice(0, 3);
  const rawOptions = [
    correctName,
    locale === 'en' ? POLYGON_DATA[wrongSides[0]].nameEn : POLYGON_DATA[wrongSides[0]].nameEl,
    locale === 'en' ? POLYGON_DATA[wrongSides[1]].nameEn : POLYGON_DATA[wrongSides[1]].nameEl,
    locale === 'en' ? POLYGON_DATA[wrongSides[2]].nameEn : POLYGON_DATA[wrongSides[2]].nameEl,
  ];

  const uniqueOptions = [...new Set(rawOptions)].sort(() => Math.random() - 0.5);

  return {
    sides,
    options: uniqueOptions,
    correct: correctName,
    desc: locale === 'en' ? polyData.descEn : polyData.descEl,
  };
}

function makeCountQuestion(locale) {
  const sides = getRandomInt(3, 8);
  const polyObj = POLYGON_DATA[sides];
  const polyName = locale === 'en' ? polyObj.nameEn : polyObj.nameEl;

  const features = [
    { key: 'sides', labelEl: 'πλευρές', labelEn: 'sides' },
    { key: 'vertices', labelEl: 'κορυφές', labelEn: 'vertices' },
    { key: 'angles', labelEl: 'γωνίες', labelEn: 'angles' },
  ];
  const chosenFeature = features[getRandomInt(0, features.length - 1)];

  return {
    sides,
    polyName,
    featureLabel: locale === 'en' ? chosenFeature.labelEn : chosenFeature.labelEl,
    correct: sides,
  };
}

function makePerimeterQuestion(locale) {
  const sides = getRandomInt(3, 8);
  const sideLength = getRandomInt(3, 15);
  const polyName = locale === 'en' ? POLYGON_DATA[sides].nameEn : POLYGON_DATA[sides].nameEl;

  return {
    sides,
    sideLength,
    polyName,
    correct: sides * sideLength,
  };
}

function makeSideFromPerimeterQuestion(locale) {
  const sides = getRandomInt(3, 8);
  const sideLength = getRandomInt(4, 16);
  const perimeter = sides * sideLength;
  const polyName = locale === 'en' ? POLYGON_DATA[sides].nameEn : POLYGON_DATA[sides].nameEl;

  return {
    sides,
    perimeter,
    polyName,
    correct: sideLength,
  };
}

function generateQuestions(locale) {
  return {
    q1: makeIdentifyQuestion(locale),
    q2: makeIdentifyQuestion(locale),
    q3: makeCountQuestion(locale),
    q4: makeCountQuestion(locale),
    q5: makePerimeterQuestion(locale),
    q6: makePerimeterQuestion(locale),
    q7: makeSideFromPerimeterQuestion(locale),
    q8: makeSideFromPerimeterQuestion(locale),
  };
}

export default function PoligonaAskPage() {
  const router = useRouter();
  const rawLocale = router.locale || router.query.locale;
  const currentLocale = rawLocale === 'en' ? 'en' : 'el';
  const t = translations[currentLocale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '',
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

    if (answers.q1 === questions.q1.correct) currentScore += 1;
    if (answers.q2 === questions.q2.correct) currentScore += 1;
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (parseInt(answers.q6, 10) === questions.q6.correct) currentScore += 1;
    if (parseInt(answers.q7, 10) === questions.q7.correct) currentScore += 1;
    if (parseInt(answers.q8, 10) === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  const totalQuestions = 8;

  // Render Q1 & Q2: Αναγνώριση Πολυγώνου
  const renderIdentify = (qKey, qData, numLabel) => {
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
          <span className="bg-teal-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.q1Prompt}
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5 sm:pl-11">
          <div className="bg-slate-950 p-3 rounded-2xl shadow-inner flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36 shrink-0 border border-slate-800">
            <svg className="w-full h-full block select-none" viewBox="0 0 150 150">
              <polygon
                points={generateSvgPoints(qData.sides)}
                fill="rgba(20, 184, 166, 0.25)"
                stroke="#2dd4bf"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
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
                  <span className="leading-snug break-words whitespace-normal flex-1">
                    {opt}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {t.q1FbSuccess
                  .replace('{sides}', qData.sides)
                  .replace('{poly}', qData.correct.toLowerCase())
                  .replace('{desc}', qData.desc)}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q1FbError
                  .replace('{sides}', qData.sides)
                  .replace('{correct}', qData.correct)}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q3 & Q4: Πλήθος Στοιχείων
  const renderCount = (qKey, qData, numLabel) => {
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
          <span className="bg-indigo-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.q3PromptPrefix}{' '}
            <span className="text-indigo-600 font-extrabold">{qData.featureLabel}</span>{' '}
            {t.q3PromptMiddle}{' '}
            <span className="text-indigo-600 font-extrabold">{qData.polyName}</span>;
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={10}
            id={`input-${qKey}`}
            name={`input-${qKey}`}
            placeholder={t.q3Placeholder}
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
                {t.q3FbSuccess.replace('{correct}', qData.correct)}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q3FbError
                  .replace('{poly}', qData.polyName)
                  .replace('{correct}', qData.correct)
                  .replace('{feat}', qData.featureLabel)}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q5 & Q6: Περίμετρος
  const renderPerimeter = (qKey, qData, numLabel) => {
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
          <span className="bg-amber-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.q5PromptPrefix}{' '}
            <span className="text-amber-600 font-extrabold">{qData.polyName}</span>{' '}
            {t.q5PromptMiddle}{' '}
            <span className="text-amber-600 font-mono font-black text-lg">
              {formatNumberLocale(qData.sideLength, currentLocale)} {t.unitCm}
            </span>.{' '}
            {t.q5PromptSuffix}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="flex items-center gap-2">
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
              className="w-full sm:w-80 p-3 rounded-2xl border border-slate-300 font-mono text-base sm:text-lg font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-xs placeholder:font-normal placeholder:text-slate-400 bg-slate-50/50"
            />
            <span className="font-bold text-slate-600 text-sm sm:text-base">{t.unitCm}</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {t.q5FbSuccess
                  .replace('{sides}', qData.sides)
                  .replace('{len}', formatNumberLocale(qData.sideLength, currentLocale))
                  .replace(/\{unit\}/g, t.unitCm)
                  .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.q5FbError
                  .replace('{sides}', qData.sides)
                  .replace('{len}', formatNumberLocale(qData.sideLength, currentLocale))
                  .replace(/\{unit\}/g, t.unitCm)
                  .replace('{correct}', formatNumberLocale(qData.correct, currentLocale))}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Q7 & Q8: Εύρεση Μήκους Πλευράς (με κλάσμα αντί διαίρεσης)
  const renderSideFromPerimeter = (qKey, qData, numLabel) => {
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
          <span className="bg-purple-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {t.q7PromptPrefix}{' '}
            <span className="text-purple-600 font-extrabold">{qData.polyName}</span>{' '}
            {t.q7PromptMiddle}{' '}
            <span className="text-purple-600 font-mono font-black text-lg">
              {formatNumberLocale(qData.perimeter, currentLocale)} {t.unitCm}
            </span>.{' '}
            {t.q7PromptSuffix}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={t.q7Placeholder}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-full sm:w-80 p-3 rounded-2xl border border-slate-300 font-mono text-base sm:text-lg font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-xs placeholder:font-normal placeholder:text-slate-400 bg-slate-50/50"
            />
            <span className="font-bold text-slate-600 text-sm sm:text-base">{t.unitCm}</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60 flex flex-wrap items-center gap-1.5">
                <span>{t.q7FbSuccessText}</span>
                <Fraction
                  num={formatNumberLocale(qData.perimeter, currentLocale)}
                  den={qData.sides}
                  inline={true}
                />
                <span>＝</span>
                <span className="font-mono font-bold">
                  {formatNumberLocale(qData.correct, currentLocale)} {t.unitCm}
                </span>.
              </div>
            ) : (
              <div className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60 flex flex-wrap items-center gap-1.5">
                <span>{t.q7FbErrorText}</span>
                <Fraction
                  num={formatNumberLocale(qData.perimeter, currentLocale)}
                  den={qData.sides}
                  inline={true}
                />
                <span>＝</span>
                <span className="font-mono font-bold text-rose-900">
                  {formatNumberLocale(qData.correct, currentLocale)} {t.unitCm}
                </span>.
              </div>
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
        <div className="bg-gradient-to-r from-teal-500 via-emerald-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📐 {t.title}
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-teal-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderIdentify('q1', questions.q1, 1)}
          {renderIdentify('q2', questions.q2, 2)}

          {renderCount('q3', questions.q3, 3)}
          {renderCount('q4', questions.q4, 4)}

          {renderPerimeter('q5', questions.q5, 5)}
          {renderPerimeter('q6', questions.q6, 6)}

          {renderSideFromPerimeter('q7', questions.q7, 7)}
          {renderSideFromPerimeter('q8', questions.q8, 8)}

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
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function numberToGreekWords(num) {
  if (num === 0) return 'μηδέν';
  if (num >= 20000) return 'είκοσι χιλιάδες';

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

// 1. Ερώτηση Πολλαπλής Επιλογής (ΟΜΑΔΑ Α - 4 επιλογές με αυξημένη δεξαμενή)
function makeMCQQuestion() {
  const num = getRandomInt(1000, 19999);
  const correctText = numberToGreekWords(num);

  const wrongCandidates = new Set();

  // Distractor 1: Παραλλαγή χιλιάδων
  const diffK = (num >= 10000 ? -1 : 1) * (getRandomInt(1, 3) * 1000);
  const w1 = Math.max(1000, Math.min(20000, num + diffK));
  if (w1 !== num) wrongCandidates.add(numberToGreekWords(w1));

  // Distractor 2: Παραλλαγή εκατοντάδων
  const diffH = (num % 1000 >= 500 ? -1 : 1) * 200;
  const w2 = Math.max(1000, Math.min(20000, num + diffH));
  if (w2 !== num) wrongCandidates.add(numberToGreekWords(w2));

  // Distractor 3: Αντιστροφή δεκάδων/μονάδων
  const lastTwo = num % 100;
  const d = Math.floor(lastTwo / 10);
  const m = lastTwo % 10;
  let w3 = num - lastTwo + (m * 10 + d);
  if (w3 === num || w3 > 20000) w3 = num > 1500 ? num - 50 : num + 50;
  wrongCandidates.add(numberToGreekWords(w3));

  // Συμπλήρωση αν χρειάζεται μέχρι να έχουμε 3 διακριτές λάθος επιλογές
  let step = 100;
  while (wrongCandidates.size < 3) {
    const candidate = Math.max(1000, Math.min(19999, num + step));
    if (candidate !== num) wrongCandidates.add(numberToGreekWords(candidate));
    step += 150;
  }

  const wrongArr = Array.from(wrongCandidates).slice(0, 3);
  const options = [
    { text: correctText, isCorrect: true },
    { text: wrongArr[0], isCorrect: false },
    { text: wrongArr[1], isCorrect: false },
    { text: wrongArr[2], isCorrect: false },
  ].sort(() => Math.random() - 0.5);

  return { number: num, options, correct: correctText };
}

// 2. Ερώτηση Αξίας Θέσης (Μοναδικότητα ψηφίου στον αριθμό)
function makePlaceValueQuestion() {
  const places = [
    { name: 'Δεκάδων Χιλιάδων', short: 'ΔΧ', multiplier: 10000 },
    { name: 'Μονάδων Χιλιάδων', short: 'Χ', multiplier: 1000 },
    { name: 'Εκατοντάδων', short: 'Ε', multiplier: 100 },
    { name: 'Δεκάδων', short: 'Δ', multiplier: 10 },
    { name: 'Μονάδων', short: 'Μ', multiplier: 1 }
  ];

  let num = 0;
  let chosenPlace = places[0];
  let digit = 0;

  // Εγγύηση: το επιλεγμένο ψηφίο υπάρχει ΑΚΡΙΒΩΣ μία φορά στον αριθμό
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
    placeName: chosenPlace.name,
    placeShort: chosenPlace.short,
    multiplier: chosenPlace.multiplier,
    correct: digit * chosenPlace.multiplier
  };
}

// 3. Ερώτηση Ανάλυσης Αριθμού
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

// 4. Ερώτηση Σύγκρισης με παγίδες δεξαμενής
function makeComparisonQuestion() {
  const type = getRandomInt(1, 4);
  let numA = getRandomInt(1000, 20000);
  let numB = getRandomInt(1000, 20000);

  if (type === 1) {
    // Ίδιοι αριθμοί
    numB = numA;
  } else if (type === 2) {
    // Παραπλήσιοι αριθμοί (διαφορά μόνο σε δεκάδες/μονάδες)
    const base = getRandomInt(1000, 1990) * 10;
    numA = base + getRandomInt(1, 9);
    numB = base + getRandomInt(1, 9);
  } else if (type === 3) {
    // Ίδια ψηφία σε άλλη θέση (π.χ. 14.050 vs 14.500)
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

// Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  return {
    q1: makeMCQQuestion(),
    q2: makeMCQQuestion(),
    q3: makePlaceValueQuestion(),
    q4: makePlaceValueQuestion(),
    q5: makeDecompositionQuestion(),
    q6: makeDecompositionQuestion(),
    q7: makeComparisonQuestion(),
    q8: makeComparisonQuestion()
  };
}

export default function ArithmoiEos20XiliadesAskPage() {
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
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/\D/g, '');
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

  // Component για Ασκήσεις MCQ (1 & 2)
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
            Πώς διαβάζεται σωστά ο αριθμός <span className="text-blue-600 font-mono font-black text-lg sm:text-xl">{formatNumber(qData.number)}</span>;
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt.text;
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
                  value={opt.text}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt.text)}
                  disabled={submitted}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 shrink-0"
                />
                <span className="capitalize leading-relaxed">{opt.text}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                Ο αριθμός <span className="font-mono font-bold">{formatNumber(qData.number)}</span> διαβάζεται αναλύοντας πρώτα τις χιλιάδες και έπειτα τις μονάδες: «{qData.correct}».
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η ορθή ανάγνωση του αριθμού <span className="font-mono font-bold">{formatNumber(qData.number)}</span> είναι: «<strong className="font-bold text-rose-900 capitalize">{qData.correct}</strong>».
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Component για Ασκήσεις Αξίας Θέσης (3 & 4)
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
              Ποια είναι η πραγματική αξία του ψηφίου <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{qData.digit}</span> στον αριθμό <span className="text-indigo-600 font-mono font-black text-lg sm:text-xl">{formatNumber(qData.number)}</span>;
            </h3>
            <p className="text-xs text-slate-500">
              (Το ψηφίο βρίσκεται στη θέση των {qData.placeName})
            </p>
          </div>
        </div>

        <div className="sm:pl-11 space-y-3">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            id={`input-${qKey}`}
            name={`input-${qKey}`}
            placeholder="Γράψε την αξία (π.χ. 4000)"
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
                Το ψηφίο {qData.digit} εκφράζει {qData.digit} {qData.placeName}, δηλαδή {qData.digit} · {formatNumber(qData.multiplier)} ＝ <span className="font-mono font-bold">{formatNumber(qData.correct)}</span>.
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Το ψηφίο {qData.digit} βρίσκεται στη θέση των {qData.placeName}, άρα η πραγματική του αξία είναι {qData.digit} · {formatNumber(qData.multiplier)} ＝ <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Component για Ασκήσεις Ανάλυσης (5 & 6)
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
            Συμπλήρωσε τον αριθμό που λείπει από την ανάλυση:
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-1.5 leading-relaxed break-words px-3.5 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-sm sm:text-base font-bold text-slate-800 w-full">
            <span className="text-teal-700 font-black">{formatNumber(qData.number)}</span>
            <span>＝</span>

            {partsArray.map((part, idx) => (
              <span key={part.key} className="inline-flex items-center gap-1.5">
                {qData.missingKey === part.key ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    id={`input-${qKey}-${part.key}`}
                    name={`input-${qKey}-${part.key}`}
                    value={answers[qKey]}
                    onChange={(e) => handleNumericInput(qKey, e.target.value)}
                    disabled={submitted}
                    className="w-24 sm:w-28 p-1.5 bg-amber-50 border-2 border-amber-400 rounded-xl text-center text-amber-900 font-mono font-black focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="?"
                  />
                ) : (
                  <span>{formatNumber(part.val)}</span>
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
                Η σωστή ανάλυση του αριθμού προκύπτει από το άθροισμα των επιμέρους αξιών των ψηφίων του.
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Ο όρος που έλειπε είναι ο <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>, ώστε το συνολικό άθροισμα να ισούται με {formatNumber(qData.number)}.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Component για Ασκήσεις Σύγκρισης (7 & 8)
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
            Επίλεξε το κατάλληλο σύμβολο σύγκρισης ( ＜ , ＝ , ＞ ):
          </h3>
        </div>

        <div className="sm:pl-11 space-y-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-lg sm:text-2xl font-mono font-black text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span>{formatNumber(qData.numA)}</span>

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

            <span>{formatNumber(qData.numB)}</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.numA === qData.numB
                  ? 'Οι δύο αριθμοί έχουν ακριβώς την ίδια αξία σε όλες τις τάξεις μεγέθους.'
                  : `Συγκρίνοντας από τα αριστερά προς τα δεξιά, ισχύει ${formatNumber(qData.numA)} ${qData.correct} ${formatNumber(qData.numB)}.`}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η ορθή σύγκριση είναι <span className="font-mono font-bold text-rose-900">{formatNumber(qData.numA)} {qData.correct} {formatNumber(qData.numB)}</span>.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Αριθμοί έως το 20.000 | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού: ανάγνωση, γραφή, αξία θέσης ψηφίου και σύγκριση αριθμών έως το 20.000."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/1-arithmoi-eos-20-xiliades"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Αριθμοί έως το 20.000
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm md:text-base">
              Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* FORM ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
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
                🎯 Έλεγχος Απαντήσεων
              </button>
            </div>
          )}
        </form>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                Επιτυχία: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

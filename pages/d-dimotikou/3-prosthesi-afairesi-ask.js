import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Παραγωγή τυχαίου πολλαπλάσιου του 10 ή 50 (για ρεαλιστικές πράξεις νοερών υπολογισμών)
function getRandomIntEndingInZero(min, max, step = 10) {
  const raw = Math.floor(Math.random() * (max - min + 1)) + min;
  return Math.round(raw / step) * step;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// 1. Άσκηση: Επαλήθευση Πρόσθεσης με Αφαίρεση
function makeAdditionCheckQuestion() {
  const a = getRandomIntEndingInZero(1200, 9500, 50);
  const b = getRandomIntEndingInZero(800, 4800, 50);
  const sum = a + b;

  // Επιλέγουμε τυχαία ποιος προσθετέος θα αφαιρεθεί
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

// 2. Άσκηση: Επαλήθευση Αφαίρεσης με Πρόσθεση (Δοκιμή)
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

// 3. Άσκηση: Εύρεση Άγνωστου Αριθμού (Πρόσθεση ή Αφαίρεση)
function makeMissingNumberQuestion() {
  const typeChoice = getRandomInt(1, 3);
  const a = getRandomIntEndingInZero(1500, 8500, 50);
  const b = getRandomIntEndingInZero(600, 4200, 50);

  if (typeChoice === 1) {
    // α + [ ? ] = άθροισμα
    const sum = a + b;
    return {
      type: 'add-second',
      knownA: a,
      target: sum,
      correct: b
    };
  } else if (typeChoice === 2) {
    // [ ? ] + β = άθροισμα
    const sum = a + b;
    return {
      type: 'add-first',
      knownB: b,
      target: sum,
      correct: a
    };
  } else {
    // [ ? ] - β = διαφορά
    const min = a + b;
    return {
      type: 'sub-min',
      knownSub: b,
      knownDiff: a,
      correct: min
    };
  }
}

// 4. Άσκηση: Ορολογία & Κανόνες (ΟΜΑΔΑ Α - 4 Επιλογές)
function makeTerminologyQuestion() {
  const termsPool = [
    {
      q: 'Πώς ονομάζεται το αποτέλεσμα της πράξης της αφαίρεσης;',
      correct: 'Διαφορά',
      wrongs: ['Άθροισμα', 'Μειωτέος', 'Προσθετέος']
    },
    {
      q: 'Πώς ονομάζονται οι δύο αριθμοί που προσθέτουμε σε μια πρόσθεση;',
      correct: 'Προσθετέοι',
      wrongs: ['Αφαιρετέοι', 'Διαφορές', 'Μειωτέοι']
    },
    {
      q: 'Πώς ονομάζεται το τελικό αποτέλεσμα της πράξης της πρόσθεσης;',
      correct: 'Άθροισμα',
      wrongs: ['Διαφορά', 'Μειωτέος', 'Αφαιρετέος']
    },
    {
      q: 'Στην αφαίρεση 8.500 － 2.300 ＝ 6.200, ο αριθμός 8.500 ονομάζεται:',
      correct: 'Μειωτέος',
      wrongs: ['Αφαιρετέος', 'Διαφορά', 'Άθροισμα']
    },
    {
      q: 'Στην αφαίρεση 9.000 － 3.400 ＝ 5.600, ο αριθμός 3.400 ονομάζεται:',
      correct: 'Αφαιρετέος',
      wrongs: ['Μειωτέος', 'Διαφορά', 'Προσθετέος']
    },
    {
      q: 'Ποια πράξη αποτελεί την αντίστροφη πράξη της πρόσθεσης;',
      correct: 'Η αφαίρεση',
      wrongs: ['Ο πολλαπλασιασμός', 'Η διαίρεση', 'Η στρογγυλοποίηση']
    },
    {
      q: 'Για να κάνουμε δοκιμή (επαλήθευση) σε μια αφαίρεση, υπολογίζουμε:',
      correct: 'Διαφορά ＋ Αφαιρετέος',
      wrongs: ['Μειωτέος ＋ Διαφορά', 'Μειωτέος ＋ Αφαιρετέος', 'Διαφορά － Αφαιρετέος']
    }
  ];

  const selected = termsPool[getRandomInt(0, termsPool.length - 1)];
  const shuffledWrongs = [...selected.wrongs].sort(() => Math.random() - 0.5).slice(0, 3);

  const options = [
    { text: selected.correct, isCorrect: true },
    { text: shuffledWrongs[0], isCorrect: false },
    { text: shuffledWrongs[1], isCorrect: false },
    { text: shuffledWrongs[2], isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  return {
    questionText: selected.q,
    options,
    correct: selected.correct
  };
}

// Δημιουργία των 8 Ερωτήσεων
function generateQuestions() {
  return {
    q1: makeAdditionCheckQuestion(),
    q2: makeAdditionCheckQuestion(),
    q3: makeSubtractionCheckQuestion(),
    q4: makeSubtractionCheckQuestion(),
    q5: makeMissingNumberQuestion(),
    q6: makeMissingNumberQuestion(),
    q7: makeTerminologyQuestion(),
    q8: makeTerminologyQuestion()
  };
}

export default function ProsthesiAfairesiAskPage() {
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
    const clean = rawVal.replace(/\D/g, '');
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
            Γνωρίζουμε ότι <span className="text-blue-600 font-mono font-black text-lg">{formatNumber(qData.a)} ＋ {formatNumber(qData.b)} ＝ {formatNumber(qData.sum)}</span>. Συμπλήρωσε την αντίστροφη αφαίρεση:
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{formatNumber(qData.sum)}</span>
            <span>－</span>
            <span>{formatNumber(qData.subNum)}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
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
                Αφαιρώντας έναν προσθετέο από το άθροισμα βρίσκουμε τον άλλον: {formatNumber(qData.sum)} － {formatNumber(qData.subNum)} ＝ <span className="font-mono font-bold">{formatNumber(qData.correct)}</span>.
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η σωστή διαφορά ισούται με τον άλλον προσθετέο: {formatNumber(qData.sum)} － {formatNumber(qData.subNum)} ＝ <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>.
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
            Κάνε τη δοκιμή της αφαίρεσης <span className="text-purple-600 font-mono font-black text-lg">{formatNumber(qData.min)} － {formatNumber(qData.sub)} ＝ {formatNumber(qData.diff)}</span>:
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span>{formatNumber(qData.diff)}</span>
            <span>＋</span>
            <span>{formatNumber(qData.sub)}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
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
                Στη δοκιμή της αφαίρεσης, το άθροισμα της διαφοράς και του αφαιρετέου δίνει τον αρχικό μειωτέο: {formatNumber(qData.diff)} ＋ {formatNumber(qData.sub)} ＝ <span className="font-mono font-bold">{formatNumber(qData.correct)}</span>.
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Το αποτέλεσμα της δοκιμής πρέπει να ταυτίζεται με τον μειωτέο: {formatNumber(qData.diff)} ＋ {formatNumber(qData.sub)} ＝ <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>.
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
            Βρες τον αριθμό που λείπει εφαρμόζοντας την κατάλληλη αντίστροφη πράξη:
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            {qData.type === 'add-second' && (
              <>
                <span>{formatNumber(qData.knownA)}</span>
                <span>＋</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  id={`input-${qKey}`}
                  name={`input-${qKey}`}
                  placeholder="?"
                  value={answers[qKey]}
                  onChange={(e) => handleNumericInput(qKey, e.target.value)}
                  disabled={submitted}
                  className="w-32 sm:w-36 p-2 rounded-xl border-2 border-amber-400 bg-amber-50 text-amber-900 font-mono text-base sm:text-xl font-black text-center focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
                />
                <span>＝</span>
                <span>{formatNumber(qData.target)}</span>
              </>
            )}

            {qData.type === 'add-first' && (
              <>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  id={`input-${qKey}`}
                  name={`input-${qKey}`}
                  placeholder="?"
                  value={answers[qKey]}
                  onChange={(e) => handleNumericInput(qKey, e.target.value)}
                  disabled={submitted}
                  className="w-32 sm:w-36 p-2 rounded-xl border-2 border-amber-400 bg-amber-50 text-amber-900 font-mono text-base sm:text-xl font-black text-center focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
                />
                <span>＋</span>
                <span>{formatNumber(qData.knownB)}</span>
                <span>＝</span>
                <span>{formatNumber(qData.target)}</span>
              </>
            )}

            {qData.type === 'sub-min' && (
              <>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  id={`input-${qKey}`}
                  name={`input-${qKey}`}
                  placeholder="?"
                  value={answers[qKey]}
                  onChange={(e) => handleNumericInput(qKey, e.target.value)}
                  disabled={submitted}
                  className="w-32 sm:w-36 p-2 rounded-xl border-2 border-amber-400 bg-amber-50 text-amber-900 font-mono text-base sm:text-xl font-black text-center focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
                />
                <span>－</span>
                <span>{formatNumber(qData.knownSub)}</span>
                <span>＝</span>
                <span>{formatNumber(qData.knownDiff)}</span>
              </>
            )}
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                Υπολογίστηκε σωστά με την αντίστροφη πράξη ({qData.type.startsWith('add') ? 'αφαίρεση' : 'πρόσθεση'}): <span className="font-mono font-bold">{formatNumber(qData.correct)}</span>.
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Ο αριθμός που λείπει υπολογίζεται ως εξής: {qData.type.startsWith('add') ? `${formatNumber(qData.target)} － ${formatNumber(qData.knownA || qData.knownB)}` : `${formatNumber(qData.knownDiff)} ＋ ${formatNumber(qData.knownSub)}`} ＝ <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)}</span>.
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
            const isSelected = answers[qKey] === opt.text;
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
                  value={opt.text}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt.text)}
                  disabled={submitted}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500 shrink-0"
                />
                <span className="leading-snug">{opt.text}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                Ο μαθηματικός όρος είναι πράγματι «{qData.correct}».
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Ο ορθός μαθηματικός όρος είναι «<strong className="font-bold text-rose-900">{qData.correct}</strong>».
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Πρόσθεση και Αφαίρεση | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού: αντίστροφες πράξεις, δοκιμή πρόσθεσης και αφαίρεσης, εύρεση άγνωστου αριθμού και ορολογία."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/3-prosthesi-afairesi"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Πρόσθεση και Αφαίρεση
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», οι αριθμοί και οι ερωτήσεις ανανεώνονται αυτόματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-blue-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
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

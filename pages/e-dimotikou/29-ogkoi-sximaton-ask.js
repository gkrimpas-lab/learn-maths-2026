// pages/e-dimotikou/29-ogkoi-sximaton-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Όγκος Παραλληλεπιπέδου & Ακμή Κύβου (Input)
function makePrismAndCubeVolumeQuestion(isCube = false) {
  if (!isCube) {
    // q1: Όγκος ορθογωνίου παραλληλεπιπέδου V = α · β · γ
    const length = [8, 10, 12, 15][getRandomInt(0, 3)];
    const width = [4, 5, 6][getRandomInt(0, 2)];
    const height = [3, 4, 5][getRandomInt(0, 2)];
    const volume = length * width * height;

    return {
      type: 'input',
      correct: volume,
      unit: 'cm³ (όγκος)',
      prompt: `Ένα ορθογώνιο παραλληλεπίπεδο έχει μήκος ${length} cm, πλάτος ${width} cm και ύψος ${height} cm. Πόσα cm³ είναι ο όγκος του;`,
      explanation: `Ο τύπος του όγκου ορθογωνίου παραλληλεπιπέδου είναι: V ＝ Μήκος · Πλάτος · Ύψος. Επομένως: ${length} · ${width} · ${height} ＝ ${length * width} · ${height} ＝ ${volume} cm³.`
    };
  } else {
    // q2: Εύρεση ακμής κύβου από γνωστό όγκο
    const cases = [
      { vol: 27, edge: 3 },
      { vol: 64, edge: 4 },
      { vol: 125, edge: 5 },
      { vol: 216, edge: 6 },
      { vol: 343, edge: 7 },
      { vol: 1000, edge: 10 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    return {
      type: 'input',
      correct: c.edge,
      unit: 'cm (ακμή κύβου)',
      prompt: `Ένας κύβος έχει όγκο ${c.vol} cm³. Πόσα cm είναι το μήκος της κάθε ακμής (πλευράς) του;`,
      explanation: `Στον κύβο ο όγκος υπολογίζεται από τον τύπο V ＝ α · α · α. Αναζητούμε τον αριθμό που αν πολλαπλασιαστεί 3 φορές με τον εαυτό του δίνει ${c.vol}: επειδή ${c.edge} · ${c.edge} · ${c.edge} ＝ ${c.vol}, η ακμή είναι ${c.edge} cm.`
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Ταξινόμηση Στερεών Σωμάτων (MCQ)
function makeSolidClassificationQuestion(isRotational = false) {
  if (!isRotational) {
    // q3: Ποιο στερεό είναι πολύεδρο
    const options = shuffleArray([
      'Το ορθογώνιο παραλληλεπίπεδο (περικλείεται μόνο από επίπεδα πολύγωνα)',
      'Ο κύλινδρος',
      'Ο κώνος',
      'Η σφαίρα'
    ]);

    return {
      type: 'mcq',
      correct: 'Το ορθογώνιο παραλληλεπίπεδο (περικλείεται μόνο από επίπεδα πολύγωνα)',
      options,
      prompt: `Ποιο από τα παρακάτω γεωμετρικά στερεά ανήκει στην κατηγορία των ΠΟΛΥΕΔΡΩΝ;`,
      explanation: `Πολύεδρα ονομάζονται τα στερεά που περικλείονται αποκλειστικά από επίπεδες πολυγωνικές έδρες. Το ορθογώνιο παραλληλεπίπεδο (όπως και ο κύβος και η πυραμίδα) είναι πολύεδρο, ενώ ο κύλινδρος, ο κώνος και η σφαίρα έχουν καμπύλες επιφάνειες (στερεά εκ περιστροφής).`
    };
  } else {
    // q4: Χαρακτηριστικά σφαίρας
    const options = [
      'Δεν έχει καμία επίπεδη έδρα, καμία ακμή και καμία κορυφή',
      'Έχει 2 κυκλικές βάσεις και 1 κορυφή',
      'Έχει 6 τετράγωνες έδρες και 8 κορυφές',
      'Έχει 1 κυκλική βάση και 1 μυτερή κορυφή'
    ];

    return {
      type: 'mcq',
      correct: 'Δεν έχει καμία επίπεδη έδρα, καμία ακμή και καμία κορυφή',
      options,
      prompt: `Ποια από τις παρακάτω προτάσεις περιγράφει σωστά τη ΣΦΑΙΡΑ;`,
      explanation: `Η σφαίρα είναι ένα απόλυτα στρογγυλό στερεό εκ περιστροφής. Δεν διαθέτει καμία ίσια έδρα, καμία ακμή και καμία κορυφή, και όλα τα σημεία της επιφάνειάς της ισαπέχουν από το κέντρο της.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Συσχέτιση Πρίσματος με Πυραμίδα / Κυλίνδρου με Κώνο (Input & MCQ)
function makePyramidPrismRelationQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q5: Εύρεση όγκου πυραμίδας όταν είναι γνωστός ο όγκος του αντίστοιχου πρίσματος (V : 3)
    const prismVol = [45, 60, 90, 120, 180, 240][getRandomInt(0, 5)];
    const pyramidVol = prismVol / 3;

    return {
      type: 'input',
      correct: pyramidVol,
      unit: 'cm³ (όγκος πυραμίδας)',
      prompt: `Ένα πρίσμα έχει όγκο ${prismVol} cm³. Μια πυραμίδα που έχει ακριβώς την ίδια βάση και το ίδιο ύψος με το πρίσμα, πόσα cm³ όγκο έχει;`,
      explanation: `Ο όγκος της πυραμίδας ισούται με το ένα τρίτο του όγκου του αντίστοιχου πρίσματος: ${prismVol} ： 3 ＝ ${pyramidVol} cm³.`
    };
  } else {
    // q6: Σχέση κώνου με κύλινδρο (MCQ)
    const options = [
      'Χρειάζονται ακριβώς 3 γεμάτοι κώνοι νερό για να γεμίσει ο κύλινδρος',
      'Χρειάζονται ακριβώς 2 γεμάτοι κώνοι νερό',
      'Χρειάζεται μισός κώνος νερό',
      'Ο κώνος και ο κύλινδρος έχουν ακριβώς τον ίδιο όγκο'
    ];

    return {
      type: 'mcq',
      correct: 'Χρειάζονται ακριβώς 3 γεμάτοι κώνοι νερό για να γεμίσει ο κύλινδρος',
      options,
      prompt: `Ένας κύλινδρος και ένας κώνος έχουν ακριβώς την ίδια κυκλική βάση και το ίδιο ύψος. Πόσοι γεμάτοι κώνοι νερό χρειάζονται για να γεμίσει πλήρως ο κύλινδρος;`,
      explanation: `Επειδή ο όγκος του κώνου ισούται με το ένα τρίτο (: 3) του όγκου του κυλίνδρου με την ίδια βάση και ύψος, χρειάζονται ακριβώς 3 γεμάτοι κώνοι για να γεμίσει ο κύλινδρος!`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Χωρητικότητα Δεξαμενής & Καθημερινά Στερεά (Input & MCQ)
function makeRealWorldCapacityQuestion(isMCQ = false) {
  if (!isMCQ) {
    // q7: Χωρητικότητα ορθογώνιας δεξαμενής σε λίτρα (m³ -> λίτρα)
    // Δεξαμενή: 3 m x 2 m x 1.5 m = 9 m³ = 9.000 λίτρα
    const lengthM = [2, 3, 4][getRandomInt(0, 2)];
    const widthM = [2, 2.5, 3][getRandomInt(0, 2)];
    const heightM = [1, 2][getRandomInt(0, 1)];
    const volumeM3 = parseFloat((lengthM * widthM * heightM).toFixed(1));
    const liters = Math.round(volumeM3 * 1000);

    return {
      type: 'input',
      correct: liters,
      unit: 'λίτρα ( l )',
      prompt: `Μια ορθογώνια δεξαμενή νερού έχει διαστάσεις: μήκος ${lengthM.toLocaleString('el-GR')} m, πλάτος ${widthM.toLocaleString('el-GR')} m και βάθος (ύψος) ${heightM} m. Πόσα λίτρα ( l ) νερού χωράει όταν γεμίσει εντελώς;`,
      explanation: `Υπολογίζουμε πρώτα τον όγκο σε κυβικά μέτρα: ${lengthM.toLocaleString('el-GR')} · ${widthM.toLocaleString('el-GR')} · ${heightM} ＝ ${volumeM3.toLocaleString('el-GR')} m³. Επειδή 1 m³ ＝ 1.000 λίτρα, η δεξαμενή χωράει: ${volumeM3.toLocaleString('el-GR')} · 1.000 ＝ ${liters.toLocaleString('el-GR')} λίτρα.`
    };
  } else {
    // q8: Αναγνώριση γεωμετρικού στερεού από αντικείμενο της καθημερινότητας
    const cases = [
      { item: 'ένα κουτάκι αναψυκτικού', solid: 'Κύλινδρος', distractors: ['Κώνος', 'Σφαίρα', 'Κύβος'] },
      { item: 'ένα χωνάκι παγωτού', solid: 'Κώνος', distractors: ['Κύλινδρος', 'Πυραμίδα', 'Ορθογώνιο παραλληλεπίπεδο'] },
      { item: 'ένα κουτί παπουτσιών', solid: 'Ορθογώνιο παραλληλεπίπεδο', distractors: ['Κύλινδρος', 'Σφαίρα', 'Πυραμίδα'] },
      { item: 'ένα ζάρι επιτραπέζιου παιχνιδιού', solid: 'Κύβος', distractors: ['Κώνος', 'Κύλινδρος', 'Σφαίρα'] }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const options = shuffleArray([c.solid, ...c.distractors]);

    return {
      type: 'mcq',
      correct: c.solid,
      options,
      prompt: `Ποιο γεωμετρικό στερεό αναπαριστά καλύτερα ${c.item};`,
      explanation: `${c.item.charAt(0).toUpperCase() + c.item.slice(1)} έχει τη μορφή και τις ιδιότητες του στερεού: ${c.solid}.`
    };
  }
}

function generateQuestions() {
  return {
    q1: makePrismAndCubeVolumeQuestion(false),
    q2: makePrismAndCubeVolumeQuestion(true),
    q3: makeSolidClassificationQuestion(false),
    q4: makeSolidClassificationQuestion(true),
    q5: makePyramidPrismRelationQuestion(false),
    q6: makePyramidPrismRelationQuestion(true),
    q7: makeRealWorldCapacityQuestion(false),
    q8: makeRealWorldCapacityQuestion(true)
  };
}

export default function OgkoiSximatonAskPage() {
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

  // Αυστηρός έλεγχος εισόδου: μόνο αριθμοί 0-9, το πολύ ένα κόμμα, όριο 10 ψηφία
  const handleStrictNumberInput = (key, rawVal) => {
    if (submitted) return;
    let clean = rawVal.replace('.', ',').replace(/[^0-9,]/g, '');
    const parts = clean.split(',');
    if (parts.length > 2) {
      clean = parts[0] + ',' + parts.slice(1).join('');
    }
    if (clean.length > 10) {
      clean = clean.slice(0, 10);
    }
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const parseUserFloat = (val) => {
    if (!val || val === ',') return NaN;
    return parseFloat(val.replace(',', '.'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    // q1
    if (Math.abs(parseUserFloat(answers.q1) - questions.q1.correct) < 0.01) currentScore += 1;
    // q2
    if (Math.abs(parseUserFloat(answers.q2) - questions.q2.correct) < 0.01) currentScore += 1;
    // q3
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    // q4
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    // q5
    if (Math.abs(parseUserFloat(answers.q5) - questions.q5.correct) < 0.01) currentScore += 1;
    // q6
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    // q7
    if (Math.abs(parseUserFloat(answers.q7) - questions.q7.correct) < 0.01) currentScore += 1;
    // q8
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Component για Ερωτήσεις MCQ
  const renderMCQ = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span
            className={`${accentColor} text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}
          >
            {numLabel}
          </span>
          <div className="space-y-1">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400">
              {badgeTitle}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.prompt}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11 2xl:pl-13">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition select-none text-sm sm:text-base 2xl:text-lg font-mono font-bold ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 shadow-sm'
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
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0"
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </p>
            ) : (
              <p className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                Η σωστή απάντηση είναι: <strong className="font-bold text-rose-950">{qData.correct}</strong>. {qData.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Component για Ερωτήσεις Input (αυστηρός περιορισμός 10 ψηφίων)
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const userVal = parseUserFloat(answers[qKey]);
    const isCorrect = !isNaN(userVal) && Math.abs(userVal - qData.correct) < 0.01;
    return (
      <div
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span
            className={`${accentColor} text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}
          >
            {numLabel}
          </span>
          <div className="space-y-1">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400">
              {badgeTitle}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.prompt}
            </h3>
          </div>
        </div>

        <div className="sm:pl-11 2xl:pl-13 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              maxLength={10}
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              value={answers[qKey]}
              onChange={(e) => handleStrictNumberInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-36 sm:w-44 h-12 sm:h-14 p-3 text-center rounded-2xl border-2 border-slate-300 font-mono text-lg sm:text-xl 2xl:text-2xl font-black focus:border-indigo-600 focus:outline-none bg-slate-50/60 focus:bg-white text-slate-900 disabled:opacity-75"
            />
            <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-600">
              {qData.unit}
            </span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </p>
            ) : (
              <p className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                Η σωστή απάντηση είναι: <strong className="font-bold text-rose-950">{qData.correct.toLocaleString('el-GR')} {qData.unit}</strong>. {qData.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Γεωμετρικά Στερεά & Όγκοι - Ε' Δημοτικού | LearnMaths.gr"
      description="Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα γεωμετρικά στερεά: όγκος ορθογωνίου παραλληλεπιπέδου, κύβου, πυραμίδας, κυλίνδρου και χωρητικότητα δεξαμενών σε λίτρα."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/29-ogkoi-sximaton"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K / 4K και responsive για κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8">
        
        {/* HEADER BANNER - Ίδια χρωματική παλέτα με τη θεωρία */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Γεωμετρικά Στερεά &amp; Όγκοι
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ & PB SAFE AREA */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderInput('q1', questions.q1, 1, 'ΟΓΚΟΣ ΟΡΘΟΓΩΝΙΟΥ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟΥ', 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, 'ΕΥΡΕΣΗ ΑΚΜΗΣ ΚΥΒΟΥ ΑΠΟ ΟΓΚΟ', 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, 'ΠΟΛΥΕΔΡΑ VS ΣΤΕΡΕΑ ΕΚ ΠΕΡΙΣΤΡΟΦΗΣ', 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, 'ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ ΤΗΣ ΣΦΑΙΡΑΣ', 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, 'ΣΧΕΣΗ ΟΓΚΟΥ ΠΡΙΣΜΑΤΟΣ ΚΑΙ ΠΥΡΑΜΙΔΑΣ', 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, 'ΣΧΕΣΗ ΟΓΚΟΥ ΚΥΛΙΝΔΡΟΥ ΚΑΙ ΚΩΝΟΥ', 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΔΕΞΑΜΕΝΗΣ ΣΕ ΛΙΤΡΑ ( l )', 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, 'ΑΝΑΓΝΩΡΙΣΗ ΣΤΕΡΕΟΥ ΣΤΗΝ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑ', 'bg-purple-600')}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 Έλεγχος Απαντήσεων
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5 z-50">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                Επιτυχία: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 2xl:px-7 2xl:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm 2xl:text-base flex items-center gap-2 active:scale-95"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

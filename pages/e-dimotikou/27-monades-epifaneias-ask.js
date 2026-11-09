// pages/e-dimotikou/27-monades-epifaneias-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Ε')/g);
  return parts
    .map((part) => {
      if (part === "Ε'") return "Ε'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function Fraction({ numerator, denominator, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-mono leading-none ${className}`}>
      <span className="px-1 text-[0.9em] border-b-2 border-current pb-0.5 w-full block">
        {numerator}
      </span>
      <span className="px-1 text-[0.9em] pt-0.5 w-full block">
        {denominator}
      </span>
    </span>
  );
}

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

const translations = {
  el: {
    pageTitle: "Ασκήσεις: Μονάδες Επιφάνειας - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στις μονάδες μέτρησης επιφάνειας: κανόνας του 100, τετραγωνικά μέτρα, δεκατόμετρα, εκατοστά, στρέμματα και πλακόστρωση.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeHeader: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    mainTitle: "📝 Ασκήσεις: Μονάδες Μέτρησης Επιφάνειας",
    subtitle: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    footerPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctFeedbackPrefix: "Η σωστή απάντηση είναι:",
    q1Badge: "ΚΑΤΕΒΑΙΝΩ ΤΗ ΣΚΑΛΑ ΕΠΙΦΑΝΕΙΑΣ ( m² ➔ dm² )",
    q2Badge: "ΑΝΕΒΑΙΝΩ ΤΗ ΣΚΑΛΑ ΕΠΙΦΑΝΕΙΑΣ ( cm² ➔ dm² )",
    q3Badge: "Ο ΚΑΝΟΝΑΣ ΤΟΥ 100 ΣΤΗΝ ΕΠΙΦΑΝΕΙΑ",
    q4Badge: "ΣΥΓΚΡΙΣΗ ΑΝΟΜΟΙΩΝ ΕΠΙΦΑΝΕΙΩΝ",
    q5Badge: "ΜΕΤΑΤΡΟΠΗ ΣΤΡΕΜΜΑΤΩΝ ΣΕ m²",
    q6Badge: "ΣΤΡΕΜΜΑΤΑ ΚΑΙ ΤΕΤΡΑΓΩΝΙΚΟ ΧΙΛΙΟΜΕΤΡΟ",
    q7Badge: "ΠΛΑΚΟΣΤΡΩΣΗ ΔΑΠΕΔΟΥ ΜΕ ΠΛΑΚΑΚΙΑ ( m² ➔ cm² )",
    q8Badge: "ΥΠΟΛΟΓΙΣΜΟΣ ΣΥΝΟΛΙΚΟΥ ΚΟΣΤΟΥΣ ΕΠΙΦΑΝΕΙΑΣ"
  },
  en: {
    pageTitle: "Exercises: Units of Area - 5th Grade | LearnMaths.gr",
    pageDescription: "Challenging 5th Grade math exercises on surface area units: the rule of 100, square meters, decimeters, centimeters, stremmata, and tiling.",
    backText: "5th Grade",
    theoryBtn: "Theory",
    badgeHeader: "5TH GRADE • PRACTICE",
    mainTitle: "📝 Exercises: Units of Surface Area Measurement",
    subtitle: "Every time you click 'New Exercises', fresh problems are generated from the pool!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreLabel: "Score:",
    successRate: "Success:",
    footerPrompt: "Fill in your answers and click 'Check Answers'!",
    correctFeedbackPrefix: "The correct answer is:",
    q1Badge: "STEPPING DOWN AREA SCALE ( m² ➔ dm² )",
    q2Badge: "STEPPING UP AREA SCALE ( cm² ➔ dm² )",
    q3Badge: "THE RULE OF 100 IN AREA UNITS",
    q4Badge: "COMPARING DIFFERENT AREA UNITS",
    q5Badge: "CONVERTING STREMMATA TO m²",
    q6Badge: "STREMMATA AND SQUARE KILOMETERS",
    q7Badge: "FLOOR TILING WITH SQUARES ( m² ➔ cm² )",
    q8Badge: "TOTAL SURFACE AREA COST CALCULATION"
  }
};

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Μετατροπές Υποδιαιρέσεων με τον Κανόνα του 100 (Input)
function makeSubdivisionAreaQuestion(isAscending, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isAscending) {
    const m2Options = [3.5, 4.25, 6.8, 2.75, 5.4, 8.5];
    const m2Val = m2Options[getRandomInt(0, m2Options.length - 1)];
    const correctDm2 = Math.round(m2Val * 100);
    const m2Str = formatNum(m2Val);

    const prompt = isEn
      ? `Convert the surface area of ${m2Str} m² to square decimeters ( dm² ):`
      : `Μετάτρεψε την επιφάνεια των ${m2Str} m² σε τετραγωνικά δεκατόμετρα ( dm² ):`;

    const explanation = isEn ? (
      <span>
        To go from m² to dm², we move down 1 step (multiply by 100): {m2Str} · 100 ＝ {formatNum(correctDm2)} dm².
      </span>
    ) : (
      <span>
        Για να πάμε από m² σε dm², κατεβαίνουμε 1 σκαλοπάτι (πολλαπλασιάζουμε με το 100): {m2Str} · 100 ＝ {formatNum(correctDm2)} dm².
      </span>
    );

    return {
      type: 'input',
      correct: correctDm2,
      unit: 'dm²',
      prompt,
      explanation
    };
  } else {
    const cm2Options = [1500, 2400, 3800, 4500, 7200, 9600];
    const cm2Val = cm2Options[getRandomInt(0, cm2Options.length - 1)];
    const correctDm2 = cm2Val / 100;

    const prompt = isEn
      ? `Convert the surface area of ${formatNum(cm2Val)} cm² to square decimeters ( dm² ):`
      : `Μετάτρεψε την επιφάνεια των ${formatNum(cm2Val)} cm² σε τετραγωνικά δεκατόμετρα ( dm² ):`;

    const explanation = isEn ? (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>To go from cm² to dm², we move up 1 step (divide by 100):</span>
        <Fraction numerator={formatNum(cm2Val)} denominator="100" />
        <span>＝ {formatNum(correctDm2)} dm².</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>Για να πάμε από cm² σε dm², ανεβαίνουμε 1 σκαλοπάτι (διαιρούμε με το 100):</span>
        <Fraction numerator={formatNum(cm2Val)} denominator="100" />
        <span>＝ {formatNum(correctDm2)} dm².</span>
      </span>
    );

    return {
      type: 'input',
      correct: correctDm2,
      unit: 'dm²',
      prompt,
      explanation
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Θεωρία Κανόνα του 100 & Σύγκριση Επιφανειών (MCQ)
function makeAreaTheoryAndComparisonQuestion(isComparison, isEn) {
  if (!isComparison) {
    const correctEl = 'Επειδή στην επιφάνεια μετράμε δύο διαστάσεις και πολλαπλασιάζουμε 10 σειρές επί 10 στήλες ( 10 · 10 ＝ 100 )';
    const correctEn = 'Because in surface area we measure two dimensions and multiply 10 rows by 10 columns ( 10 · 10 ＝ 100 )';

    const rawOptions = isEn
      ? [
          correctEn,
          'Because a meter has 100 centimeters',
          'Because a full circle contains 100 degrees',
          'Because the perimeter of a square is 100'
        ]
      : [
          correctEl,
          'Επειδή το μέτρο έχει 100 εκατοστά',
          'Επειδή ο κύκλος έχει 100 μοίρες',
          'Επειδή η περίμετρος ενός τετραγώνου είναι 100'
        ];

    const prompt = isEn
      ? 'Why does each step equal 100 in surface area unit conversions (and not 10 as in linear length)?'
      : 'Για ποιον λόγο στις μετατροπές μονάδων επιφάνειας κάθε σκαλοπάτι αξίζει 100 (και όχι 10 όπως στο μήκος);';

    const explanation = isEn
      ? 'In surface area units, we consider a square with 2 dimensions (length and width). Since each dimension subdivides into 10 equal parts, the entire square contains: 10 · 10 ＝ 100 smaller square units!'
      : 'Στις μονάδες επιφάνειας έχουμε τετράγωνο με 2 διαστάσεις (μήκος και πλάτος). Επειδή κάθε διάσταση υποδιαιρείται σε 10 ίσα μέρη, ολόκληρο το τετράγωνο περιέχει: 10 · 10 ＝ 100 μικρότερα τετραγωνάκια!';

    return {
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt,
      explanation
    };
  } else {
    const cases = [
      {
        correctEl: '0,5 m²',
        correctEn: '0.5 m²',
        optionsEl: ['0,5 m²', '45 dm²', '4.200 cm²', '450.000 mm²'],
        optionsEn: ['0.5 m²', '45 dm²', '4,200 cm²', '450,000 mm²'],
        explEl: 'Μετατρέπουμε όλα σε dm²: 0,5 m² ＝ 50 dm², 45 dm², 4.200 cm² ＝ 42 dm², 450.000 mm² ＝ 45 dm². Το μεγαλύτερο είναι τα 0,5 m² (50 dm²).',
        explEn: 'Convert all into dm²: 0.5 m² ＝ 50 dm², 45 dm², 4,200 cm² ＝ 42 dm², 450,000 mm² ＝ 45 dm². The largest is 0.5 m² (50 dm²).'
      },
      {
        correctEl: '80 dm²',
        correctEn: '80 dm²',
        optionsEl: ['80 dm²', '0,75 m²', '7.200 cm²', '700.000 mm²'],
        optionsEn: ['80 dm²', '0.75 m²', '7,200 cm²', '700,000 mm²'],
        explEl: 'Μετατρέπουμε όλα σε dm²: 80 dm², 0,75 m² ＝ 75 dm², 7.200 cm² ＝ 72 dm², 700.000 mm² ＝ 70 dm². Το μεγαλύτερο είναι τα 80 dm².',
        explEn: 'Convert all into dm²: 80 dm², 0.75 m² ＝ 75 dm², 7,200 cm² ＝ 72 dm², 700,000 mm² ＝ 70 dm². The largest is 80 dm².'
      }
    ];

    const c = cases[getRandomInt(0, cases.length - 1)];

    return {
      type: 'mcq',
      correct: isEn ? c.correctEn : c.correctEl,
      options: shuffleArray([...new Set(isEn ? c.optionsEn : c.optionsEl)]),
      prompt: isEn ? 'Which of the following surface areas is the LARGEST?' : 'Ποια από τις παρακάτω επιφάνειες είναι η ΜΕΓΑΛΥΤΕΡΗ;',
      explanation: isEn ? c.explEn : c.explEl
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Στρέμματα & Τετραγωνικά Χιλιόμετρα (Input & MCQ)
function makeLargeAreaUnitsQuestion(isMCQ, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isMCQ) {
    const stremmata = [2.5, 3.8, 4.5, 7.2, 8.5][getRandomInt(0, 4)];
    const correctM2 = Math.round(stremmata * 1000);
    const strStr = formatNum(stremmata);

    const prompt = isEn
      ? `A farm has an area of ${strStr} stremmata (decares). How many square meters ( m² ) is its area?`
      : `Ένα αγρόκτημα έχει έκταση ${strStr} στρέμματα. Πόσα τετραγωνικά μέτρα ( m² ) είναι η επιφάνειά του;`;

    const explanation = isEn
      ? `We know that 1 stremma ＝ 1,000 m². Therefore: ${strStr} · 1,000 ＝ ${formatNum(correctM2)} m².`
      : `Γνωρίζουμε ότι 1 στρέμμα ＝ 1.000 m². Επομένως: ${strStr} · 1.000 ＝ ${formatNum(correctM2)} m².`;

    return {
      type: 'input',
      correct: correctM2,
      unit: 'm²',
      prompt,
      explanation
    };
  } else {
    const correctEl = '1.000 στρέμματα';
    const correctEn = '1,000 stremmata (decares)';

    const rawOptions = isEn
      ? [
          correctEn,
          '100 stremmata (decares)',
          '10,000 stremmata (decares)',
          '10 stremmata (decares)'
        ]
      : [
          correctEl,
          '100 στρέμματα',
          '10.000 στρέμματα',
          '10 στρέμματα'
        ];

    const prompt = isEn
      ? 'How many stremmata (decares) are there in exactly 1 square kilometer ( 1 km² )?'
      : 'Σε πόσα στρέμματα ισοδυναμεί ακριβώς 1 τετραγωνικό χιλιόμετρο ( 1 km² );';

    const explanation = isEn ? (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>1 km² ＝ 1,000,000 m². Since 1 stremma ＝ 1,000 m², we have:</span>
        <Fraction numerator="1,000,000" denominator="1,000" />
        <span>＝ 1,000 stremmata!</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>1 km² ＝ 1.000.000 m². Επειδή 1 στρέμμα ＝ 1.000 m², έχουμε:</span>
        <Fraction numerator="1.000.000" denominator="1.000" />
        <span>＝ 1.000 στρέμματα!</span>
      </span>
    );

    return {
      type: 'mcq',
      correct: isEn ? correctEn : correctEl,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt,
      explanation
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Πλακόστρωση Δαπέδου & Κόστος (Input & MCQ)
function makeFloorTilingQuestion(isCostMCQ, isEn) {
  const formatNum = (n) => n.toLocaleString(isEn ? 'en-US' : 'el-GR');

  if (!isCostMCQ) {
    const roomM2 = [12, 16, 20, 24][getRandomInt(0, 3)];
    const tileSide = 20;
    const tileAreaCm2 = tileSide * tileSide;
    const roomAreaCm2 = roomM2 * 10000;
    const tilesCount = roomAreaCm2 / tileAreaCm2;

    const unit = isEn ? 'tiles' : 'πλακάκια';
    const prompt = isEn
      ? `A room has an area of ${formatNum(roomM2)} m². We want to tile it using square tiles with side length ${formatNum(tileSide)} cm (area of 400 cm²). How many such tiles will be needed?`
      : `Ένα δωμάτιο έχει εμβαδόν ${formatNum(roomM2)} m². Θέλουμε να το στρώσουμε με τετράγωνα πλακάκια πλευράς ${formatNum(tileSide)} cm (εμβαδού 400 cm²). Πόσα τέτοια πλακάκια θα χρειαστούμε;`;

    const explanation = isEn ? (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>Convert room area to cm²: {formatNum(roomM2)} m² ＝ {formatNum(roomM2)} · 10,000 ＝ {formatNum(roomAreaCm2)} cm². Divide by the area of one tile:</span>
        <Fraction numerator={formatNum(roomAreaCm2)} denominator="400" />
        <span>＝ {formatNum(tilesCount)} tiles.</span>
      </span>
    ) : (
      <span className="inline-flex items-center flex-wrap gap-1">
        <span>Μετατρέπουμε το εμβαδόν του δωματίου σε cm²: ${formatNum(roomM2)} m² ＝ ${formatNum(roomM2)} · 10.000 ＝ ${formatNum(roomAreaCm2)} cm². Διαιρούμε με το εμβαδόν ενός πλακιδίου:</span>
        <Fraction numerator={formatNum(roomAreaCm2)} denominator="400" />
        <span>＝ {formatNum(tilesCount)} πλακάκια.</span>
      </span>
    );

    return {
      type: 'input',
      correct: tilesCount,
      unit,
      prompt,
      explanation
    };
  } else {
    const areaM2 = [30, 40, 50, 60][getRandomInt(0, 3)];
    const costPerM2 = [15, 20, 25][getRandomInt(0, 2)];
    const totalCost = areaM2 * costPerM2;

    const distractors = [totalCost + 150, totalCost - 100, areaM2 * 10];
    const rawOptions = [totalCost, ...distractors].map((d) => `${formatNum(d)} €`);

    const prompt = isEn
      ? `To renovate a floor surface of ${formatNum(areaM2)} m², the tiles cost ${formatNum(costPerM2)} € per square meter ( m² ). What is the total cost for the tiles?`
      : `Για την ανακαίνιση ενός δαπέδου επιφάνειας ${formatNum(areaM2)} m², το κόστος αγοράς των πλακιδίων ανέρχεται σε ${formatNum(costPerM2)} € ανά τετραγωνικό μέτρο ( m² ). Πόσο θα κοστίσουν συνολικά τα πλακάκια;`;

    const explanation = isEn
      ? `Multiply total surface area by price per m²: ${formatNum(areaM2)} · ${formatNum(costPerM2)} € ＝ ${formatNum(totalCost)} €.`
      : `Πολλαπλασιάζουμε τη συνολική επιφάνεια με την τιμή ανά m²: ${formatNum(areaM2)} · ${formatNum(costPerM2)} € ＝ ${formatNum(totalCost)} €.`;

    return {
      type: 'mcq',
      correct: `${formatNum(totalCost)} €`,
      options: shuffleArray([...new Set(rawOptions)]),
      prompt,
      explanation
    };
  }
}

function generateQuestions(isEn) {
  return {
    q1: makeSubdivisionAreaQuestion(false, isEn),
    q2: makeSubdivisionAreaQuestion(true, isEn),
    q3: makeAreaTheoryAndComparisonQuestion(false, isEn),
    q4: makeAreaTheoryAndComparisonQuestion(true, isEn),
    q5: makeLargeAreaUnitsQuestion(false, isEn),
    q6: makeLargeAreaUnitsQuestion(true, isEn),
    q7: makeFloorTilingQuestion(false, isEn),
    q8: makeFloorTilingQuestion(true, isEn)
  };
}

export default function MonadesEpifaneiasAskPage() {
  const router = useRouter();
  const currentLocale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = currentLocale === 'en';
  const t = translations[currentLocale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(isEn));
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

  const handleStrictNumberInput = (key, rawVal) => {
    if (submitted) return;
    let clean = rawVal.replace(/\./g, ',').replace(/[^0-9,]/g, '');
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

    if (Math.abs(parseUserFloat(answers.q1) - questions.q1.correct) < 0.05) currentScore += 1;
    if (Math.abs(parseUserFloat(answers.q2) - questions.q2.correct) < 0.05) currentScore += 1;
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (Math.abs(parseUserFloat(answers.q5) - questions.q5.correct) < 0.05) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (Math.abs(parseUserFloat(answers.q7) - questions.q7.correct) < 0.05) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

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
              {toCleanUppercase(badgeTitle)}
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
                <span className="break-words whitespace-normal leading-snug flex-1">{opt}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                {t.correctFeedbackPrefix} <strong className="font-bold text-rose-950">{qData.correct}</strong>. {qData.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const userVal = parseUserFloat(answers[qKey]);
    const isCorrect = !isNaN(userVal) && Math.abs(userVal - qData.correct) < 0.05;
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
              {toCleanUppercase(badgeTitle)}
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
              <div className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                {t.correctFeedbackPrefix}{' '}
                <strong className="font-bold text-rose-950">
                  {qData.correct.toLocaleString(isEn ? 'en-US' : 'el-GR')} {qData.unit}
                </strong>
                . {qData.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/e-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/27-monades-epifaneias"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              {toCleanUppercase(t.badgeHeader)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              {t.mainTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              {t.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newExercisesBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInput('q1', questions.q1, 1, t.q1Badge, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.q2Badge, 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, t.q3Badge, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.q4Badge, 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, t.q5Badge, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.q6Badge, 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, t.q7Badge, 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, t.q8Badge, 'bg-purple-600')}

          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 {t.submitBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
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
                <span>🔄</span> {t.newExercisesBtn}
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                {t.footerPrompt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
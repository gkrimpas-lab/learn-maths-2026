// pages/e-dimotikou/03-aplopoiisi-ask.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

// --- ΤΥΠΟΓΡΑΦΙΑ & ΣΥΜΒΟΛΑ --- //

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

// Επαναχρησιμοποιήσιμο component για κανονική κατακόρυφη μορφή κλάσματος
function Fraction({ num, den, className = '', size = 'md' }) {
  const sizeClasses = {
    xs: 'text-[11px] 2xl:text-xs',
    sm: 'text-xs 2xl:text-sm',
    md: 'text-sm sm:text-base 2xl:text-lg',
    lg: 'text-base sm:text-lg 2xl:text-xl'
  };

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <span className="px-1 text-center leading-tight">{num}</span>
      <span className="w-full min-w-[0.85em] h-[1.5px] bg-current my-[1px] rounded-full"></span>
      <span className="px-1 text-center leading-tight">{den}</span>
    </span>
  );
}

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- ΔΗΜΙΟΥΡΓΙΑ ΕΡΩΤΗΣΕΩΝ ΜΕ i18n (8 ΕΡΩΤΗΣΕΙΣ) --- //

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Εύρεση ΜΚΔ για Απλοποίηση με 1 Κίνηση (MCQ & Input)
function makeGCDQuestion(isInput = false, locale = 'el') {
  const isEl = locale === 'el';
  const basePairs = [
    [18, 24], [24, 36], [30, 45], [28, 42], [36, 48], [40, 60], [32, 48], [42, 56]
  ];
  const [num, den] = basePairs[getRandomInt(0, basePairs.length - 1)];
  const correctGCD = gcd(num, den);

  if (!isInput) {
    // q1: MCQ
    const distractors = [
      Math.floor(correctGCD / 2),
      correctGCD === 12 ? 8 : correctGCD + 2,
      correctGCD === 6 ? 4 : correctGCD - 2
    ].filter((val) => val > 1 && val !== correctGCD);

    const rawOptions = [correctGCD, ...distractors];
    const options = shuffleArray([...new Set(rawOptions)].slice(0, 4)).map(String);

    return {
      type: 'mcq',
      correct: String(correctGCD),
      options,
      renderPrompt: () => (
        <span className="flex flex-wrap items-center gap-1">
          {isEl ? (
            <>
              Με ποιον αριθμό (τον Μ.Κ.Δ.) πρέπει να διαιρέσουμε ταυτόχρονα τους όρους του κλάσματος <Fraction num={num} den={den} size="md" /> ώστε να γίνει ανάγωγο με μία μόνο πράξη;
            </>
          ) : (
            <>
              By what number (the GCD) must we divide both terms of the fraction <Fraction num={num} den={den} size="md" /> to reach its irreducible form in a single step?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          {isEl ? (
            <>
              Ο Μέγιστος Κοινός Διαιρέτης των {num} και {den} είναι το {correctGCD}. Διαιρώντας με το {correctGCD} προκύπτει αμέσως το ανάγωγο κλάσμα <Fraction num={num / correctGCD} den={den / correctGCD} size="sm" />.
            </>
          ) : (
            <>
              The Greatest Common Divisor of {num} and {den} is {correctGCD}. Dividing by {correctGCD} immediately yields the irreducible fraction <Fraction num={num / correctGCD} den={den / correctGCD} size="sm" />.
            </>
          )}
        </span>
      )
    };
  } else {
    // q2: Input
    return {
      type: 'input',
      correct: correctGCD,
      unit: isEl ? 'τιμή του Μ.Κ.Δ.' : 'value of GCD',
      renderPrompt: () => (
        <span className="flex flex-wrap items-center gap-1">
          {isEl ? (
            <>
              Βρες τον Μέγιστο Κοινό Διαιρέτη (Μ.Κ.Δ.) των αριθμών {num} και {den} για να απλοποιηθεί πλήρως το κλάσμα <Fraction num={num} den={den} size="md" />:
            </>
          ) : (
            <>
              Find the Greatest Common Divisor (GCD) of numbers {num} and {den} to completely reduce the fraction <Fraction num={num} den={den} size="md" />:
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          {isEl ? (
            <>
              Ο Μ.Κ.Δ.({num}, {den}) είναι το {correctGCD}. Διαιρώντας αριθμητή και παρονομαστή με το {correctGCD}, το κλάσμα γίνεται ανάγωγο: <Fraction num={num / correctGCD} den={den / correctGCD} size="sm" />.
            </>
          ) : (
            <>
              The GCD({num}, {den}) is {correctGCD}. Dividing both numerator and denominator by {correctGCD} gives the irreducible fraction: <Fraction num={num / correctGCD} den={den / correctGCD} size="sm" />.
            </>
          )}
        </span>
      )
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Πλήρης Απλοποίηση σε Ανάγωγο Κλάσμα (Input Αριθμητή & Παρονομαστή)
function makeIrreducibleInputQuestion(askForNumerator = true, locale = 'el') {
  const isEl = locale === 'el';
  const basePairs = [
    [3, 7], [4, 9], [5, 8], [7, 11], [5, 12], [8, 15], [9, 14], [7, 16]
  ];
  const [irrNum, irrDen] = basePairs[getRandomInt(0, basePairs.length - 1)];
  const mult = [4, 6, 7, 8, 9][getRandomInt(0, 4)];
  const num = irrNum * mult;
  const den = irrDen * mult;

  if (askForNumerator) {
    // q3: Ζητείται ο αριθμητής
    return {
      type: 'input',
      correct: irrNum,
      unit: isEl ? 'αριθμητής' : 'numerator',
      renderPrompt: () => (
        <span className="flex flex-wrap items-center gap-1">
          {isEl ? (
            <>
              Απλοποίησε το κλάσμα <Fraction num={num} den={den} size="md" /> στην ανάγωγη μορφή του. Ποιος είναι ο νέος αριθμητής;
            </>
          ) : (
            <>
              Simplify the fraction <Fraction num={num} den={den} size="md" /> to its irreducible form. What is the new numerator?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          {isEl ? (
            <>
              Ο Μ.Κ.Δ.({num}, {den}) είναι το {mult}. Διαιρούμε και τους δύο όρους: {num} : {mult} ＝ {irrNum} και {den} : {mult} ＝ {irrDen}. Άρα ο αριθμητής του ανάγωγου κλάσματος <Fraction num={irrNum} den={irrDen} size="sm" /> είναι {irrNum}.
            </>
          ) : (
            <>
              The GCD({num}, {den}) is {mult}. Dividing both terms: {num} : {mult} ＝ {irrNum} and {den} : {mult} ＝ {irrDen}. Thus, the numerator of the irreducible fraction <Fraction num={irrNum} den={irrDen} size="sm" /> is {irrNum}.
            </>
          )}
        </span>
      )
    };
  } else {
    // q4: Ζητείται ο παρονομαστής
    return {
      type: 'input',
      correct: irrDen,
      unit: isEl ? 'παρονομαστής' : 'denominator',
      renderPrompt: () => (
        <span className="flex flex-wrap items-center gap-1">
          {isEl ? (
            <>
              Απλοποίησε το κλάσμα <Fraction num={num} den={den} size="md" /> στην ανάγωγη μορφή του. Ποιος είναι ο νέος παρονομαστής;
            </>
          ) : (
            <>
              Simplify the fraction <Fraction num={num} den={den} size="md" /> to its irreducible form. What is the new denominator?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          {isEl ? (
            <>
              Ο Μ.Κ.Δ.({num}, {den}) είναι το {mult}. Διαιρούμε και τους δύο όρους: {num} : {mult} ＝ {irrNum} και {den} : {mult} ＝ {irrDen}. Άρα ο παρονομαστής του ανάγωγου κλάσματος <Fraction num={irrNum} den={irrDen} size="sm" /> είναι {irrDen}.
            </>
          ) : (
            <>
              The GCD({num}, {den}) is {mult}. Dividing both terms: {num} : {mult} ＝ {irrNum} and {den} : {mult} ＝ {irrDen}. Thus, the denominator of the irreducible fraction <Fraction num={irrNum} den={irrDen} size="sm" /> is {irrDen}.
            </>
          )}
        </span>
      )
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Αναγνώριση Ανάγωγων Κλασμάτων (MCQ)
function makeIdentifyIrreducibleQuestion(isIdentifyNotIrreducible = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isIdentifyNotIrreducible) {
    // q5: Ποιο από τα 4 είναι ανάγωγο
    const irreducibles = ['5/12', '7/15', '8/21', '11/24', '9/20', '13/18'];
    const reducibles = ['6/18', '14/21', '15/25', '12/28', '20/35', '18/30'];

    const chosenIrreducible = irreducibles[getRandomInt(0, irreducibles.length - 1)];
    const chosenReducibles = shuffleArray(reducibles).slice(0, 3);
    const rawOptions = [chosenIrreducible, ...chosenReducibles];
    const options = shuffleArray([...new Set(rawOptions)]);

    return {
      type: 'mcq',
      correct: chosenIrreducible,
      options,
      isFractionOptions: true,
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>Ποιο από τα παρακάτω κλάσματα είναι ΑΝΑΓΩΓΟ (δεν μπορεί να απλοποιηθεί άλλο);</>
          ) : (
            <>Which of the following fractions is IRREDUCIBLE (cannot be simplified further)?</>
          )}
        </span>
      ),
      renderExplanation: () => {
        const [iNum, iDen] = chosenIrreducible.split('/');
        return (
          <span className="flex flex-wrap items-center gap-1 font-mono">
            {isEl ? (
              <>
                Το κλάσμα <Fraction num={iNum} den={iDen} size="sm" /> είναι ανάγωγο, διότι ο αριθμητής και ο παρονομαστής του είναι πρώτοι μεταξύ τους (ο Μ.Κ.Δ. τους ισούται με 1). Τα υπόλοιπα έχουν κοινούς διαιρέτες μεγαλύτερους του 1.
              </>
            ) : (
              <>
                The fraction <Fraction num={iNum} den={iDen} size="sm" /> is irreducible because its numerator and denominator are coprime (their GCD equals 1). The other fractions have common factors greater than 1.
              </>
            )}
          </span>
        );
      }
    };
  } else {
    // q6: Ποιο από τα 4 ΔΕΝ είναι ανάγωγο
    const irreducibles = ['4/15', '7/16', '9/22', '11/30', '13/24'];
    const reducibles = ['9/21', '14/35', '16/28', '15/36', '18/42'];

    const chosenReducible = reducibles[getRandomInt(0, reducibles.length - 1)];
    const chosenIrreducibles = shuffleArray(irreducibles).slice(0, 3);
    const rawOptions = [chosenReducible, ...chosenIrreducibles];
    const options = shuffleArray([...new Set(rawOptions)]);

    return {
      type: 'mcq',
      correct: chosenReducible,
      options,
      isFractionOptions: true,
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>Ποιο από τα παρακάτω κλάσματα ΔΕΝ είναι ανάγωγο (δηλαδή επιδέχεται απλοποίηση);</>
          ) : (
            <>Which of the following fractions is NOT irreducible (can still be simplified)?</>
          )}
        </span>
      ),
      renderExplanation: () => {
        const [rNum, rDen] = chosenReducible.split('/');
        return (
          <span className="flex flex-wrap items-center gap-1 font-mono">
            {isEl ? (
              <>
                Το κλάσμα <Fraction num={rNum} den={rDen} size="sm" /> δεν είναι ανάγωγο, γιατί ο αριθμητής και ο παρονομαστής έχουν κοινό διαιρέτη μεγαλύτερο του 1 και μπορούν να απλοποιηθούν περαιτέρω.
              </>
            ) : (
              <>
                The fraction <Fraction num={rNum} den={rDen} size="sm" /> is not irreducible because numerator and denominator share a common factor greater than 1 and can be simplified further.
              </>
            )}
          </span>
        );
      }
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα με Απλοποίηση σε Πραγματικά Σενάρια
function makeWordProblemQuestion(isPercentageStyle = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isPercentageStyle) {
    // q7: Μαθητές σχολείου
    const totalStudents = [24, 28, 30, 36, 40][getRandomInt(0, 4)];
    const divisor = [4, 6][getRandomInt(0, 1)];
    const unitPart = totalStudents / (divisor === 4 ? 4 : 6);
    const girlsCount = unitPart * (divisor === 4 ? 3 : 5);
    const d = gcd(girlsCount, totalStudents);
    const irrNum = girlsCount / d;
    const irrDen = totalStudents / d;

    return {
      type: 'input',
      correct: irrNum,
      unit: isEl ? 'αριθμητής' : 'numerator',
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>
              Σε ένα σχολείο υπάρχουν {totalStudents} παιδιά, από τα οποία τα {girlsCount} είναι κορίτσια. Γράψε το κλάσμα των κοριτσιών ως προς το σύνολο των παιδιών στην ανάγωγη μορφή του. Ποιος είναι ο αριθμητής του;
            </>
          ) : (
            <>
              In a school there are {totalStudents} children, of whom {girlsCount} are girls. Express the fraction of girls to the total number of children in simplest (irreducible) form. What is its numerator?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          {isEl ? (
            <>
              Το αρχικό κλάσμα είναι <Fraction num={girlsCount} den={totalStudents} size="sm" />. Ο Μ.Κ.Δ.({girlsCount}, {totalStudents}) είναι το {d}. Διαιρούμε και τους δύο όρους: ({girlsCount} : {d}) / ({totalStudents} : {d}) ＝ <Fraction num={irrNum} den={irrDen} size="sm" />. Επομένως ο αριθμητής του ανάγωγου κλάσματος είναι {irrNum}.
            </>
          ) : (
            <>
              The initial fraction is <Fraction num={girlsCount} den={totalStudents} size="sm" />. The GCD({girlsCount}, {totalStudents}) is {d}. Dividing both terms gives: <Fraction num={irrNum} den={irrDen} size="sm" />. Therefore, the numerator of the irreducible fraction is {irrNum}.
            </>
          )}
        </span>
      )
    };
  } else {
    // q8: Μέρος της ώρας σε ανάγωγο κλάσμα (MCQ)
    const minutesList = [
      { min: 40, frac: '2/3', num: 2, den: 3, d: 20 },
      { min: 45, frac: '3/4', num: 3, den: 4, d: 15 },
      { min: 48, frac: '4/5', num: 4, den: 5, d: 12 },
      { min: 50, frac: '5/6', num: 5, den: 6, d: 10 }
    ];
    const chosen = minutesList[getRandomInt(0, minutesList.length - 1)];

    const distractors = ['1/2', '2/5', '3/5', '5/8'].filter((f) => f !== chosen.frac);
    const rawOptions = [chosen.frac, ...distractors.slice(0, 3)];
    const options = shuffleArray([...new Set(rawOptions)]);

    return {
      type: 'mcq',
      correct: chosen.frac,
      options,
      isFractionOptions: true,
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>
              Ο χρόνος των {chosen.min} min ποιο ανάγωγο κλάσμα της 1 ώρας (60 min) εκφράζει;
            </>
          ) : (
            <>
              What irreducible fraction of 1 hour (60 min) does {chosen.min} min represent?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          {isEl ? (
            <>
              Μία ώρα έχει 60 min, άρα σχηματίζουμε το κλάσμα <Fraction num={chosen.min} den={60} size="sm" />. Ο Μ.Κ.Δ.({chosen.min}, 60) είναι το {chosen.d}. Διαιρούμε και τους δύο όρους: ({chosen.min} : {chosen.d}) / (60 : {chosen.d}) ＝ <Fraction num={chosen.num} den={chosen.den} size="sm" />.
            </>
          ) : (
            <>
              One hour has 60 min, giving the fraction <Fraction num={chosen.min} den={60} size="sm" />. The GCD({chosen.min}, 60) is {chosen.d}. Dividing both terms: ({chosen.min} : {chosen.d}) / (60 : {chosen.d}) ＝ <Fraction num={chosen.num} den={chosen.den} size="sm" />.
            </>
          )}
        </span>
      )
    };
  }
}

function generateQuestions(locale) {
  return {
    q1: makeGCDQuestion(false, locale),
    q2: makeGCDQuestion(true, locale),
    q3: makeIrreducibleInputQuestion(true, locale),
    q4: makeIrreducibleInputQuestion(false, locale),
    q5: makeIdentifyIrreducibleQuestion(false, locale),
    q6: makeIdentifyIrreducibleQuestion(true, locale),
    q7: makeWordProblemQuestion(false, locale),
    q8: makeWordProblemQuestion(true, locale)
  };
}

const translations = {
  el: {
    pageTitle: "Ασκήσεις: Απλοποίηση Κλάσματος - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στην απλοποίηση κλασμάτων: υπολογισμός Μ.Κ.Δ., αναγωγή στην απλούστερη μορφή και σύνθετα προβλήματα.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeChapter: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    headerTitle: "📝 Ασκήσεις: Απλοποίηση Κλάσματος",
    headerDesc: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα τυχαιοποιημένα δεδομένα από τη δεξαμενή προβλημάτων!",
    newQuestionsBtn: "🔄 Νέες Ασκήσεις",
    checkBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreText: "Σκορ:",
    successRate: "Επιτυχία:",
    fillPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctLabel: "Η σωστή απάντηση είναι:",
    titles: {
      q1: "ΕΥΡΕΣΗ Μ.Κ.Δ. ΓΙΑ ΑΠΛΟΠΟΙΗΣΗ",
      q2: "ΥΠΟΛΟΓΙΣΜΟΣ ΜΕΓΙΣΤΟΥ ΚΟΙΝΟΥ ΔΙΑΙΡΕΤΗ",
      q3: "ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ ( ΑΡΙΘΜΗΤΗΣ )",
      q4: "ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ ( ΠΑΡΟΝΟΜΑΣΤΗΣ )",
      q5: "ΕΝΤΟΠΙΣΜΟΣ ΑΝΑΓΩΓΟΥ ΚΛΑΣΜΑΤΟΣ",
      q6: "ΕΝΤΟΠΙΣΜΟΣ ΜΗ ΑΝΑΓΩΓΟΥ ΚΛΑΣΜΑΤΟΣ",
      q7: "ΠΡΟΒΛΗΜΑ ΜΕ ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ",
      q8: "ΥΠΟΛΟΓΙΣΜΟΣ ΜΕΡΟΥΣ ΧΡΟΝΟΥ"
    }
  },
  en: {
    pageTitle: "Exercises: Fraction Simplification - Grade 5 | LearnMaths.gr",
    pageDesc: "Challenging Grade 5 math practice on fraction simplification: GCD calculations, reducing to irreducible forms, and real-world problems.",
    backText: "Grade 5",
    theoryBtn: "Theory",
    badgeChapter: "GRADE 5 • PRACTICE",
    headerTitle: "📝 Exercises: Fraction Simplification",
    headerDesc: "Every time you click 'New Exercises', fresh randomized numbers are generated from our problem bank!",
    newQuestionsBtn: "🔄 New Exercises",
    checkBtn: "🎯 Check Answers",
    scoreText: "Score:",
    successRate: "Success Rate:",
    fillPrompt: "Complete all questions and click 'Check Answers'!",
    correctLabel: "The correct answer is:",
    titles: {
      q1: "FINDING GCD FOR SIMPLIFICATION",
      q2: "CALCULATING GREATEST COMMON DIVISOR",
      q3: "IRREDUCIBLE FRACTION ( NUMERATOR )",
      q4: "IRREDUCIBLE FRACTION ( DENOMINATOR )",
      q5: "IDENTIFYING IRREDUCIBLE FRACTION",
      q6: "IDENTIFYING NON-IRREDUCIBLE FRACTION",
      q7: "WORD PROBLEM WITH IRREDUCIBLE FRACTION",
      q8: "FRACTION OF TIME CALCULATION"
    }
  }
};

export default function AplopoiisiAskPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(locale));
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, [locale]);

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
    if (parseInt(answers.q2, 10) === questions.q2.correct) currentScore += 1;
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (parseInt(answers.q7, 10) === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Βοηθητική μέθοδος για εμφάνιση επιλογής με κατακόρυφο κλάσμα
  const renderOptionContent = (opt, isFractionOptions) => {
    if (isFractionOptions && typeof opt === 'string' && opt.includes('/')) {
      const [n, d] = opt.split('/');
      return <Fraction num={n} den={d} size="md" />;
    }
    return <span>{opt}</span>;
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
              {toCleanUppercase(badgeTitle)}
            </span>
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.renderPrompt()}
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
                <span className="break-words whitespace-normal leading-snug flex-1">
                  {renderOptionContent(opt, qData.isFractionOptions)}
                </span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.renderExplanation()}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                <div className="mb-1 flex items-center gap-1.5 flex-wrap">
                  <span>{t.correctLabel}</span>
                  <strong className="font-bold text-rose-950 inline-flex items-center">
                    {renderOptionContent(qData.correct, qData.isFractionOptions)}
                  </strong>
                </div>
                {qData.renderExplanation()}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Component για Ερωτήσεις Input
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
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
              {qData.renderPrompt()}
            </h3>
          </div>
        </div>

        <div className="sm:pl-11 2xl:pl-13 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              maxLength={10}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-40 h-12 sm:h-14 p-3 text-center rounded-2xl border-2 border-slate-300 font-mono text-lg sm:text-xl 2xl:text-2xl font-black focus:border-indigo-600 focus:outline-none bg-slate-50/60 focus:bg-white text-slate-900 disabled:opacity-75"
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
                {qData.renderExplanation()}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono">
                <div className="mb-1">
                  {t.correctLabel} <strong className="font-bold text-rose-950">{qData.correct} {qData.unit}</strong>.
                </div>
                {qData.renderExplanation()}
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
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/03-aplopoiisi"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      {/* Full-width container για 2K / 4K */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 space-y-8 overflow-x-hidden">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              {toCleanUppercase(t.badgeChapter)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              {t.headerTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              {t.headerDesc}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ (8 ΕΡΩΤΗΣΕΙΣ) */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderMCQ('q1', questions.q1, 1, t.titles.q1, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.titles.q2, 'bg-blue-600')}

          {renderInput('q3', questions.q3, 3, t.titles.q3, 'bg-indigo-600')}
          {renderInput('q4', questions.q4, 4, t.titles.q4, 'bg-indigo-600')}

          {renderMCQ('q5', questions.q5, 5, t.titles.q5, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.titles.q6, 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, t.titles.q7, 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, t.titles.q8, 'bg-purple-600')}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                {t.checkBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <footer className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5 z-50">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreText}</span>
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
                {t.newQuestionsBtn}
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                {t.fillPrompt}
              </p>
            )}
          </div>
        </div>
      </footer>
    </Layout>
  );
}
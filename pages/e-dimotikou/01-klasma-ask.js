// pages/e-dimotikou/01-klasma-ask.js
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

// Επαναχρησιμοποιήσιμο εξάρτημα για κανονική μορφή κλάσματος
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

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- ΔΗΜΙΟΥΡΓΙΑ ΕΡΩΤΗΣΕΩΝ ΜΕ i18n (8 ΕΡΩΤΗΣΕΙΣ) --- //

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Μέρος Συνόλου & Αντίστροφος Υπολογισμός
function makeSetFractionQuestion(isReverse = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isReverse) {
    // q1: Υπολογισμός υπολοίπου
    const den = [5, 6, 8, 10][getRandomInt(0, 3)];
    const num = getRandomInt(2, den - 1);
    const multiplier = getRandomInt(6, 12);
    const total = den * multiplier;
    const spent = (total / den) * num;
    const remaining = total - spent;

    return {
      type: 'input',
      total,
      num,
      den,
      correct: remaining,
      unit: isEl ? 'τριαντάφυλλα' : 'roses',
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>
              Ένα ανθοπωλείο παρέλαβε {total} τριαντάφυλλα. Το πρωί πούλησε τα <Fraction num={num} den={den} size="md" /> των τριαντάφυλλων. Πόσα τριαντάφυλλα έμειναν απούλητα;
            </>
          ) : (
            <>
              A florist received {total} roses. In the morning, they sold <Fraction num={num} den={den} size="md" /> of the roses. How many roses remained unsold?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          {isEl ? (
            <>
              Το <Fraction num={1} den={den} size="sm" /> των {total} είναι {total} : {den} ＝ {multiplier}. Τα <Fraction num={num} den={den} size="sm" /> είναι {multiplier} · {num} ＝ {spent} τριαντάφυλλα. Επομένως περίσσεψαν: {total} － {spent} ＝ {remaining} τριαντάφυλλα.
            </>
          ) : (
            <>
              1/{den} of {total} is {total} : {den} ＝ {multiplier}. Then <Fraction num={num} den={den} size="sm" /> is {multiplier} · {num} ＝ {spent} roses. Therefore remaining: {total} － {spent} ＝ {remaining} roses.
            </>
          )}
        </span>
      )
    };
  } else {
    // q2: Εύρεση αρχικού συνόλου από γνωστό μέρος
    const den = [4, 7, 9, 12][getRandomInt(0, 3)];
    const num = getRandomInt(2, den - 1);
    const step = getRandomInt(8, 16);
    const partValue = num * step;
    const totalValue = den * step;

    return {
      type: 'input',
      num,
      den,
      partValue,
      correct: totalValue,
      unit: isEl ? 'σελίδες' : 'pages',
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>
              Ο Νίκος διάβασε τα <Fraction num={num} den={den} size="md" /> ενός βιβλίου, δηλαδή ακριβώς {partValue} σελίδες. Πόσες σελίδες έχει συνολικά ολόκληρο το βιβλίο;
            </>
          ) : (
            <>
              Nick read <Fraction num={num} den={den} size="md" /> of a book, which is exactly {partValue} pages. How many pages does the entire book have in total?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          {isEl ? (
            <>
              Αν τα <Fraction num={num} den={den} size="sm" /> ισούνται με {partValue} σελίδες, τότε το <Fraction num={1} den={den} size="sm" /> ισούται με: {partValue} : {num} ＝ {step} σελίδες. Ολόκληρο το βιβλίο (<Fraction num={den} den={den} size="sm" />) έχει: {step} · {den} ＝ {totalValue} σελίδες.
            </>
          ) : (
            <>
              If <Fraction num={num} den={den} size="sm" /> equals {partValue} pages, then <Fraction num={1} den={den} size="sm" /> equals: {partValue} : {num} ＝ {step} pages. The entire book (<Fraction num={den} den={den} size="sm" />) has: {step} · {den} ＝ {totalValue} pages.
            </>
          )}
        </span>
      )
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Καταχρηστικά Κλάσματα, Μεικτοί Αριθμοί & Ακέραιοι
function makeImproperFractionQuestion(isMissingToWhole = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isMissingToWhole) {
    // q3: Μετατροπή καταχρηστικού σε μεικτό
    const den = [3, 4, 5, 7, 8][getRandomInt(0, 4)];
    const whole = getRandomInt(3, 6);
    const rem = getRandomInt(1, den - 1);
    const num = whole * den + rem;

    return {
      type: 'input',
      num,
      den,
      correct: whole,
      unit: isEl ? 'ακέραιες μονάδες' : 'whole units',
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>
              Γράψε το καταχρηστικό κλάσμα <Fraction num={num} den={den} size="md" /> ως μεικτό αριθμό. Πόσες είναι οι ακέραιες μονάδες του;
            </>
          ) : (
            <>
              Write the improper fraction <Fraction num={num} den={den} size="md" /> as a mixed number. How many whole units does it contain?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          {isEl ? (
            <>
              Εκτελούμε τη διαίρεση {num} : {den} ＝ {whole} με υπόλοιπο {rem}. Άρα: <Fraction num={num} den={den} size="sm" /> ＝ {whole} ＋ <Fraction num={rem} den={den} size="sm" /> (δηλαδή {whole} ακέραιες μονάδες).
            </>
          ) : (
            <>
              We perform the division {num} : {den} ＝ {whole} with remainder {rem}. Thus: <Fraction num={num} den={den} size="sm" /> ＝ {whole} ＋ <Fraction num={rem} den={den} size="sm" /> (meaning {whole} whole units).
            </>
          )}
        </span>
      )
    };
  } else {
    // q4: Πόσα μέρη λείπουν για τον επόμενο ακέραιο (MCQ)
    const den = [6, 8, 9, 11][getRandomInt(0, 3)];
    const targetWhole = getRandomInt(2, 4);
    const missing = getRandomInt(2, den - 2);
    const currentNum = targetWhole * den - missing;

    const distractors = [
      missing + 1,
      Math.max(1, missing - 1),
      den - missing
    ].filter((d) => d !== missing);

    const rawOptions = [missing, ...distractors];
    const uniqueOptions = [...new Set(rawOptions)].slice(0, 4);
    const options = shuffleArray(uniqueOptions).map(String);

    return {
      type: 'mcq',
      currentNum,
      den,
      targetWhole,
      correct: String(missing),
      options,
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>
              Έχουμε το κλάσμα <Fraction num={currentNum} den={den} size="md" />. Πόσα ίσα μέρη (κλάσματα <Fraction num={1} den={den} size="md" />) χρειάζεται να προσθέσουμε για να συμπληρωθεί ακριβώς ο ακέραιος αριθμός {targetWhole};
            </>
          ) : (
            <>
              Given the fraction <Fraction num={currentNum} den={den} size="md" />, how many unit parts (fractions <Fraction num={1} den={den} size="md" />) must be added to reach exactly the integer {targetWhole}?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          {isEl ? (
            <>
              Ο ακέραιος {targetWhole} γράφεται ως κλάσμα με παρονομαστή {den}: {targetWhole} · {den} ＝ {targetWhole * den}, άρα <Fraction num={targetWhole * den} den={den} size="sm" />. Επομένως λείπουν: {targetWhole * den} － {currentNum} ＝ {missing} μέρη.
            </>
          ) : (
            <>
              The integer {targetWhole} can be written with denominator {den}: {targetWhole} · {den} ＝ {targetWhole * den}, so <Fraction num={targetWhole * den} den={den} size="sm" />. Therefore missing: {targetWhole * den} － {currentNum} ＝ {missing} parts.
            </>
          )}
        </span>
      )
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Κλάσμα ως Πηλίκο Διαίρεσης & Ισοδυναμία
function makeQuotientAndEquivQuestion(isEquiv = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isEquiv) {
    // q5: Μοίρασμα ποσότητας σε δοχεία (MCQ)
    const liters = getRandomInt(5, 11);
    let bottles = getRandomInt(3, 8);
    if (bottles === liters) bottles += 1;

    const correct = `${liters}/${bottles}`;
    const rawOptions = [
      `${liters}/${bottles}`,
      `${bottles}/${liters}`,
      `${liters + 1}/${bottles}`,
      `${liters}/${bottles + 1}`
    ];
    const uniqueOptions = [...new Set(rawOptions)];
    const options = shuffleArray(uniqueOptions);

    return {
      type: 'mcq',
      liters,
      bottles,
      correct,
      options,
      isFractionOptions: true,
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>
              Μοιράζουμε ισότιμα {liters} L ελαιόλαδου σε {bottles} ίδια δοχεία. Ποιο κλάσμα εκφράζει την ακριβή ποσότητα λαδιού (σε L) που θα περιέχει κάθε δοχείο;
            </>
          ) : (
            <>
              We divide {liters} L of olive oil equally into {bottles} identical containers. Which fraction expresses the exact amount of oil (in L) each container will hold?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          {isEl ? (
            <>
              Το κλάσμα εκφράζει το ακριβές πηλίκο της διαίρεσης του αριθμητή διά του παρονομαστή: {liters} : {bottles} ＝ <Fraction num={liters} den={bottles} size="sm" /> L.
            </>
          ) : (
            <>
              The fraction represents the exact division quotient of numerator divided by denominator: {liters} : {bottles} ＝ <Fraction num={liters} den={bottles} size="sm" /> L.
            </>
          )}
        </span>
      )
    };
  } else {
    // q6: Εύρεση αγνώστου όρου x
    const baseNum = getRandomInt(2, 5);
    const baseDen = baseNum + getRandomInt(1, 4);
    const factor = getRandomInt(3, 7);
    const targetDen = baseDen * factor;
    const correctX = baseNum * factor;

    return {
      type: 'input',
      baseNum,
      baseDen,
      targetDen,
      correct: correctX,
      unit: isEl ? 'τιμή του x' : 'value of x',
      renderPrompt: () => (
        <span className="flex flex-wrap items-center gap-1">
          {isEl ? (
            <>
              Αν ισχύει η ισότητα κλασμάτων <Fraction num={baseNum} den={baseDen} size="md" /> ＝ <Fraction num="x" den={targetDen} size="md" />, ποιος αριθμός είναι το x;
            </>
          ) : (
            <>
              If the fraction equivalence holds: <Fraction num={baseNum} den={baseDen} size="md" /> ＝ <Fraction num="x" den={targetDen} size="md" />, what number is x?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          {isEl ? (
            <>
              Ο παρονομαστής {baseDen} πολλαπλασιάστηκε με το {factor} για να γίνει {targetDen} ({baseDen} · {factor} ＝ {targetDen}). Πολλαπλασιάζουμε και τον αριθμητή: {baseNum} · {factor} ＝ {correctX}.
            </>
          ) : (
            <>
              The denominator {baseDen} was multiplied by {factor} to become {targetDen} ({baseDen} · {factor} ＝ {targetDen}). We multiply the numerator too: {baseNum} · {factor} ＝ {correctX}.
            </>
          )}
        </span>
      )
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύγκριση Κλασμάτων με το 1/2 & Σύνθετο Πρόβλημα
function makeComparisonQuestion(isWordProblem = false, locale = 'el') {
  const isEl = locale === 'el';

  if (!isWordProblem) {
    // q7: Σύγκριση με το σημείο αναφοράς 1/2 (MCQ)
    const candidates = [
      { text: '3/8', num: 3, den: 8, val: 3 / 8 },
      { text: '4/10', num: 4, den: 10, val: 4 / 10 },
      { text: '5/12', num: 5, den: 12, val: 5 / 12 },
      { text: '5/8', num: 5, den: 8, val: 5 / 8 },
      { text: '2/5', num: 2, den: 5, val: 2 / 5 },
      { text: '7/12', num: 7, den: 12, val: 7 / 12 }
    ];
    const greater = candidates.filter((c) => c.val > 0.5);
    const lesser = candidates.filter((c) => c.val < 0.5);
    const chosenGreater = greater[getRandomInt(0, greater.length - 1)];
    const chosenLessers = shuffleArray(lesser).slice(0, 3);
    const rawOptions = [chosenGreater.text, ...chosenLessers.map((c) => c.text)];
    const options = shuffleArray([...new Set(rawOptions)]);

    return {
      type: 'mcq',
      correct: chosenGreater.text,
      options,
      isFractionOptions: true,
      renderPrompt: () => (
        <span className="flex flex-wrap items-center gap-1">
          {isEl ? (
            <>
              Ποιο από τα παρακάτω κλάσματα είναι μεγαλύτερο από το μισό ( ＞ <Fraction num={1} den={2} size="md" /> );
            </>
          ) : (
            <>
              Which of the following fractions is greater than one half ( ＞ <Fraction num={1} den={2} size="md" /> )?
            </>
          )}
        </span>
      ),
      renderExplanation: () => {
        const [gNum, gDen] = chosenGreater.text.split('/');
        return (
          <span className="flex flex-wrap items-center gap-1 font-mono">
            {isEl ? (
              <>
                Ένα κλάσμα είναι μεγαλύτερο από το <Fraction num={1} den={2} size="sm" /> όταν ο αριθμητής του είναι μεγαλύτερος από το μισό του παρονομαστή. Στο <Fraction num={gNum} den={gDen} size="sm" />, ο αριθμητής {gNum} ξεπερνά το μισό του παρονομαστή ({gDen / 2}).
              </>
            ) : (
              <>
                A fraction is greater than <Fraction num={1} den={2} size="sm" /> when its numerator exceeds half of its denominator. In <Fraction num={gNum} den={gDen} size="sm" />, the numerator {gNum} is greater than half the denominator ({gDen / 2}).
              </>
            )}
          </span>
        );
      }
    };
  } else {
    // q8: Σύνθετο πρόβλημα σύγκρισης διαδρομών
    const totalKm = 120;
    const kmA = (totalKm / 4) * 3; // 90 km
    const kmB = (totalKm / 5) * 4; // 96 km
    const diff = kmB - kmA; // 6 km

    const rawOptions = [
      `${diff} km`,
      `${diff + 4} km`,
      `${diff + 6} km`,
      `${Math.max(2, diff - 2)} km`
    ];
    const options = shuffleArray([...new Set(rawOptions)]);

    return {
      type: 'mcq',
      correct: `${diff} km`,
      options,
      renderPrompt: () => (
        <span>
          {isEl ? (
            <>
              Μια διαδρομή έχει μήκος {totalKm} km. Το πράσινο αυτοκίνητο διένυσε τα <Fraction num={3} den={4} size="md" /> της διαδρομής, ενώ το μπλε αυτοκίνητο διένυσε τα <Fraction num={4} den={5} size="md" /> της ίδιας διαδρομής. Πόσα χιλιόμετρα παραπάνω διένυσε το μπλε αυτοκίνητο;
            </>
          ) : (
            <>
              A journey is {totalKm} km long. The green car covered <Fraction num={3} den={4} size="md" /> of the journey, while the blue car covered <Fraction num={4} den={5} size="md" /> of the same journey. How many more kilometers did the blue car cover?
            </>
          )}
        </span>
      ),
      renderExplanation: () => (
        <span className="flex flex-wrap items-center gap-1 font-mono">
          {isEl ? (
            <>
              Πράσινο αυτοκίνητο: ({totalKm} : 4) · 3 ＝ 30 · 3 ＝ {kmA} km. Μπλε αυτοκίνητο: ({totalKm} : 5) · 4 ＝ 24 · 4 ＝ {kmB} km. Διαφορά: {kmB} － {kmA} ＝ {diff} km.
            </>
          ) : (
            <>
              Green car: ({totalKm} : 4) · 3 ＝ 30 · 3 ＝ {kmA} km. Blue car: ({totalKm} : 5) · 4 ＝ 24 · 4 ＝ {kmB} km. Difference: {kmB} － {kmA} ＝ {diff} km.
            </>
          )}
        </span>
      )
    };
  }
}

function generateQuestions(locale) {
  return {
    q1: makeSetFractionQuestion(false, locale),
    q2: makeSetFractionQuestion(true, locale),
    q3: makeImproperFractionQuestion(false, locale),
    q4: makeImproperFractionQuestion(true, locale),
    q5: makeQuotientAndEquivQuestion(false, locale),
    q6: makeQuotientAndEquivQuestion(true, locale),
    q7: makeComparisonQuestion(false, locale),
    q8: makeComparisonQuestion(true, locale)
  };
}

const translations = {
  el: {
    pageTitle: "Ασκήσεις: Η Έννοια του Κλάσματος - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Απαιτητικές διαδραστικές ασκήσεις μαθηματικών Ε' Δημοτικού: μέρος συνόλου, ανάστροφοι υπολογισμοί, μεικτοί αριθμοί και προβλήματα.",
    backText: "Ε' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeChapter: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    headerTitle: "📝 Ασκήσεις: Η Έννοια του Κλάσματος",
    headerDesc: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα τυχαιοποιημένα δεδομένα από τη δεξαμενή προβλημάτων!",
    newQuestionsBtn: "🔄 Νέες Ασκήσεις",
    checkBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreText: "Σκορ:",
    successRate: "Επιτυχία:",
    fillPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctLabel: "Η σωστή απάντηση είναι:",
    titles: {
      q1: "ΜΕΡΟΣ ΣΥΝΟΛΟΥ ΚΑΙ ΥΠΟΛΟΙΠΟ",
      q2: "ΑΝΑΣΤΡΟΦΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΣΥΝΟΛΟΥ",
      q3: "ΚΑΤΑΧΡΗΣΤΙΚΟ ΚΛΑΣΜΑ ΣΕ ΜΕΙΚΤΟ",
      q4: "ΣΥΜΠΛΗΡΩΣΗ ΣΤΟΝ ΕΠΟΜΕΝΟ ΑΚΕΡΑΙΟ",
      q5: "ΚΛΑΣΜΑ ΩΣ ΠΗΛΙΚΟ ΔΙΑΙΡΕΣΗΣ",
      q6: "ΕΥΡΕΣΗ ΟΡΟΥ ΙΣΟΔΥΝΑΜΟΥ ΚΛΑΣΜΑΤΟΣ",
      q7: "ΣΥΓΚΡΙΣΗ ΜΕ ΤΟ ΜΙΣΟ",
      q8: "ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΔΙΑΔΡΟΜΩΝ"
    }
  },
  en: {
    pageTitle: "Exercises: The Concept of Fractions - Grade 5 | LearnMaths.gr",
    pageDesc: "Challenging interactive Grade 5 math practice: part of a set, reverse calculations, mixed numbers, and multi-step word problems.",
    backText: "Grade 5",
    theoryBtn: "Theory",
    badgeChapter: "GRADE 5 • PRACTICE",
    headerTitle: "📝 Exercises: The Concept of Fractions",
    headerDesc: "Every time you click 'New Exercises', fresh randomized numbers are generated from our problem bank!",
    newQuestionsBtn: "🔄 New Exercises",
    checkBtn: "🎯 Check Answers",
    scoreText: "Score:",
    successRate: "Success Rate:",
    fillPrompt: "Complete all questions and click 'Check Answers'!",
    correctLabel: "The correct answer is:",
    titles: {
      q1: "PART OF A SET & REMAINDER",
      q2: "REVERSE TOTAL CALCULATION",
      q3: "IMPROPER FRACTION TO MIXED NUMBER",
      q4: "COMPLETING TO THE NEXT INTEGER",
      q5: "FRACTION AS A DIVISION QUOTIENT",
      q6: "FINDING UNKNOWN TERM IN EQUIVALENCE",
      q7: "COMPARISON WITH ONE HALF",
      q8: "MULTI-STEP ROUTE PROBLEM"
    }
  }
};

export default function KlasmaAskPage() {
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

    if (parseInt(answers.q1, 10) === questions.q1.correct) currentScore += 1;
    if (parseInt(answers.q2, 10) === questions.q2.correct) currentScore += 1;
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (parseInt(answers.q6, 10) === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Βοηθητική μέθοδος για εμφάνιση τιμής επιλογής (με κανονικό κλάσμα αν χρειάζεται)
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
          href="/e-dimotikou/01-klasma"
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
          {renderInput('q1', questions.q1, 1, t.titles.q1, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.titles.q2, 'bg-blue-600')}

          {renderInput('q3', questions.q3, 3, t.titles.q3, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.titles.q4, 'bg-indigo-600')}

          {renderMCQ('q5', questions.q5, 5, t.titles.q5, 'bg-teal-600')}
          {renderInput('q6', questions.q6, 6, t.titles.q6, 'bg-teal-600')}

          {renderMCQ('q7', questions.q7, 7, t.titles.q7, 'bg-purple-600')}
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
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Γ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Γ')/g);
  return parts
    .map((part) => {
      if (part === "Γ'") return "Γ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 select-none mx-0.5 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.55em] h-[1.18em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.9px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive
function Frac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="pt-0.5 break-all">
        {den}
      </span>
    </span>
  );
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ensureFourUniqueOptions(correct, distractorsGen) {
  const set = new Set([String(correct).trim()]);
  let attempts = 0;
  while (set.size < 4 && attempts < 100) {
    attempts++;
    const cand = distractorsGen();
    if (cand !== undefined && cand !== null && cand !== '') {
      set.add(String(cand).trim());
    }
  }
  let fallbackCount = 1;
  while (set.size < 4) {
    set.add(`${correct} (${fallbackCount++})`);
  }
  return shuffle(Array.from(set));
}

export default function ProsthesiAfairesiPolionimonExercises() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEl = locale === 'el';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Συγκεντρωτικό Λεξικό i18n
  const t = {
    pageTitle: isEl ? "Ασκήσεις: Πρόσθεση & Αφαίρεση Πολυωνύμων | Γ' Γυμνασίου" : "Exercises: Addition & Subtraction of Polynomials | Grade 9",
    pageDesc: isEl ? "Διαδραστικές ασκήσεις στην πρόσθεση και αφαίρεση μονωνύμων και πολυωνύμων με αναλυτικά βήματα και βαθμολόγηση για τη Γ' Γυμνασίου." : "Interactive exercises on adding and subtracting polynomials with full feedback for Grade 9.",
    backNav: isEl ? "Θεωρία Κεφ. 11" : "Theory Ch. 11",
    theoryBtn: isEl ? "ΘΕΩΡΙΑ" : "THEORY",
    heroBadge: isEl ? "ΑΣΚΗΣΕΙΣ • Γ' ΓΥΜΝΑΣΙΟΥ" : "EXERCISES • GRADE 9",
    heroTitle: isEl ? "Πρόσθεση & Αφαίρεση Πολυωνύμων: Εξάσκηση" : "Polynomial Addition & Subtraction: Practice",
    heroDesc: isEl ? "12 δυναμικές ερωτήσεις και αυτούσια προβλήματα. Απαντήστε και πατήστε «Έλεγχος Απαντήσεων»." : "12 dynamic problems. Answer all and press 'Check Answers'.",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl ? "Εξαιρετική επίδοση! Κατέχετε πλήρως τους κανόνες απαλοιφής παρενθέσεων και αναγωγής ομοίων όρων." : "Outstanding performance! You have mastered parenthesis removal and combining like terms.",
    scoreGood: isEl ? "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε." : "Very good effort! Review the detailed steps below for any questions you missed.",
    scoreNeedWork: isEl ? "Χρειάζεται λίγη εξάσκηση ακόμα, ειδικά στον κανόνα του μείον έξω από την παρένθεση!" : "Needs a bit more practice, especially with the minus sign in front of parentheses!",
    correctBadge: isEl ? "✓ Σωστό" : "✓ Correct",
    wrongBadge: isEl ? "✗ Λάθος" : "✗ Wrong",
    answeredLabel: isEl ? "ΑΠΑΝΤΗΘΗΚΑΝ" : "ANSWERED",
    checkBtn: isEl ? "ΕΛΕΓΧΟΣ" : "CHECK",
    correctAnswerTitle: isEl ? "Σωστή Απάντηση:" : "Correct Answer:",
    tableStep: isEl ? "Στοιχείο / Βήμα" : "Element / Step",
    tableAnalysis: isEl ? "Ανάλυση Δεδομένων" : "Data Analysis"
  };

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False - Αναγωγή ομοίων όρων
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: isEl ? 'Κανόνας Πρόσθεσης Μονωνύμων' : 'Rule for Adding Monomials',
      prompt: q1IsCorrect
        ? (isEl ? 'Μπορούμε να προσθέσουμε δύο μονώνυμα σε ένα νέο μονώνυμο ΜΟΝΟ όταν αυτά είναι όμοια.' : 'We can add two monomials into a single monomial ONLY when they are like terms.')
        : (isEl ? 'Μπορούμε να προσθέσουμε οποιαδήποτε δύο μονώνυμα σε ένα ενιαίο μονώνυμο, ακόμη κι αν έχουν διαφορετικό κύριο μέρος.' : 'We can add any two monomials into a single monomial, even if they have different literal parts.'),
      type: 'tf',
      correct: q1IsCorrect ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: isEl
        ? 'Η πρόσθεση μονωνύμων επιτρέπεται μόνο όταν τα μονώνυμα είναι όμοια (έχουν το ίδιο κύριο μέρος). Διαφορετικά, το άθροισμά τους παραμένει πολυώνυμο.'
        : 'Monomial addition is only possible when monomials are like terms (identical literal part). Otherwise, their sum remains a polynomial.'
    });

    // Q2: MCQ - Άθροισμα Μονωνύμων
    const cA = randInt(3, 7);
    const cB = randInt(2, 6);
    const sumC = cA + cB;
    const q2Distractors = [
      `${sumC} · x⁴`,
      `${cA * cB} · x²`,
      `${sumC} · x`,
      `${sumC + 1} · x²`,
      `${sumC} · x³`
    ];
    qList.push({
      id: 2,
      title: isEl ? 'Πρόσθεση Ομοίων Μονωνύμων' : 'Adding Like Monomials',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {isEl ? (
            <>Ποιο είναι το αποτέλεσμα της πρόσθεσης: {cA} · x<sup>2</sup> ＋ {cB} · x<sup>2</sup>；</>
          ) : (
            <>What is the result of adding: {cA} · x<sup>2</sup> ＋ {cB} · x<sup>2</sup>?</>
          )}
        </span>
      ),
      type: 'mcq',
      correct: `${sumC} · x²`,
      options: ensureFourUniqueOptions(`${sumC} · x²`, () => q2Distractors[randInt(0, q2Distractors.length - 1)]),
      renderOption: (opt) => {
        if (opt.includes('x⁴')) return <span>{opt.split(' · ')[0]} · x<sup>4</sup></span>;
        if (opt.includes('x²')) return <span>{opt.split(' · ')[0]} · x<sup>2</sup></span>;
        if (opt.includes('x³')) return <span>{opt.split(' · ')[0]} · x<sup>3</sup></span>;
        if (opt.includes(' · x')) return <span>{opt}</span>;
        return opt;
      },
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>{isEl ? 'Προσθέτουμε μόνο τους συντελεστές και διατηρούμε το ίδιο κύριο μέρος:' : 'We only add coefficients and retain the literal part:'}</span>
          <span className="inline-flex items-center gap-1">({cA} ＋ {cB}) · x<sup>2</sup> ＝ {sumC} · x<sup>2</sup>.</span>
          <span>{isEl ? 'Οι εκθέτες ΔΕΝ προστίθενται!' : 'Exponents are NOT added!'}</span>
        </span>
      )
    });

    // Q3: Input - Αφαίρεση Μονωνύμων
    const subA = randInt(7, 12);
    const subB = randInt(2, 6);
    const subRes = subA - subB;
    qList.push({
      id: 3,
      title: isEl ? 'Αφαίρεση Μονωνύμων' : 'Subtracting Monomials',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {isEl ? (
            <>Ποιος είναι ο συντελεστής του x<sup>3</sup> στην πράξη: {subA} · x<sup>3</sup> － {subB} · x<sup>3</sup>；</>
          ) : (
            <>What is the coefficient of x<sup>3</sup> in: {subA} · x<sup>3</sup> － {subB} · x<sup>3</sup>?</>
          )}
        </span>
      ),
      type: 'input',
      correct: subRes,
      explanation: (
        <span className="inline-flex items-center gap-1">
          {subA} － {subB} ＝ {subRes}.
        </span>
      )
    });

    // Q4: MCQ - Αντίθετο Πολυώνυμο
    const aCo = randInt(2, 5);
    const bCo = randInt(3, 7);
    const cCo = randInt(1, 8);
    const oppStr = `－${aCo} · x² ＋ ${bCo} · x － ${cCo}`;
    const q4Distractors = [
      `－${aCo} · x² － ${bCo} · x ＋ ${cCo}`,
      `${aCo} · x² ＋ ${bCo} · x － ${cCo}`,
      `－${aCo} · x² ＋ ${bCo} · x ＋ ${cCo}`,
      `${aCo} · x² － ${bCo} · x － ${cCo}`,
      `－${aCo} · x² － ${bCo} · x － ${cCo}`
    ];
    qList.push({
      id: 4,
      title: isEl ? 'Εύρεση Αντίθετου Πολυωνύμου' : 'Finding Opposite Polynomial',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {isEl ? (
            <>Ποιο είναι το αντίθετο του πολυωνύμου P(x) ＝ {aCo} · x<sup>2</sup> － {bCo} · x ＋ {cCo}；</>
          ) : (
            <>What is the opposite of polynomial P(x) ＝ {aCo} · x<sup>2</sup> － {bCo} · x ＋ {cCo}?</>
          )}
        </span>
      ),
      type: 'mcq',
      correct: oppStr,
      options: ensureFourUniqueOptions(oppStr, () => q4Distractors[randInt(0, q4Distractors.length - 1)]),
      renderOption: (opt) => {
        const parts = opt.split(' · x² ');
        const first = parts[0];
        const rest = parts[1];
        return (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            {first} · x<sup>2</sup> {rest}
          </span>
        );
      },
      explanation: isEl
        ? `Το αντίθετο πολυώνυμο προκύπτει αλλάζοντας τα πρόσημα ΟΛΩΝ των όρων: ＋${aCo} σε －${aCo}, －${bCo} σε ＋${bCo}, και ＋${cCo} σε －${cCo}.`
        : `The opposite polynomial is obtained by reversing the signs of ALL terms: ＋${aCo} to －${aCo}, －${bCo} to ＋${bCo}, and ＋${cCo} to －${cCo}.`
    });

    // Q5: True / False - Απαλοιφή Παρενθέσεων
    const q5IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 5,
      title: isEl ? 'Κανόνας Προσήμων στην Απαλοιφή' : 'Sign Rule for Removing Parentheses',
      prompt: q5IsCorrect
        ? (isEl ? 'Όταν μπροστά από μια παρένθεση υπάρχει πρόσημο « － », αλλάζουμε τα πρόσημα όλων των όρων που βρίσκονται μέσα στην παρένθεση.' : 'When a minus sign precedes a parenthesis, we reverse the signs of all terms enclosed within.')
        : (isEl ? 'Όταν μπροστά από μια παρένθεση υπάρχει πρόσημο « － », αλλάζουμε μόνο το πρόσημο του πρώτου όρου μέσα στην παρένθεση.' : 'When a minus sign precedes a parenthesis, we only change the sign of the very first term inside.'),
      type: 'tf',
      correct: q5IsCorrect ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: isEl
        ? 'Το πρόσημο πλην έξω από παρένθεση επηρεάζει εξίσου όλους ανεξαιρέτως τους όρους της παρένθεσης, αντιστρέφοντας τα πρόσημά τους.'
        : 'The minus sign outside a parenthesis affects every term inside equally, reversing each sign.'
    });

    // Q6: MCQ - Άθροισμα Αντιθέτων Μονωνύμων
    const kM = randInt(3, 9);
    const zeroMonStr = isEl ? '0 (Μηδενικό Μονώνυμο)' : '0 (Zero Monomial)';
    const q6Distractors = [
      `${2 * kM} · x² · y`,
      `x² · y`,
      `－${kM} · x² · y`,
      `${kM} · x² · y`,
      `－${2 * kM} · x² · y`
    ];
    qList.push({
      id: 6,
      title: isEl ? 'Άθροισμα Αντιθέτων Μονωνύμων' : 'Sum of Opposite Monomials',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {isEl ? (
            <>Ποιο είναι το αποτέλεσμα της παράστασης: {kM} · x<sup>2</sup> · y ＋ (－{kM} · x<sup>2</sup> · y)；</>
          ) : (
            <>What is the result of: {kM} · x<sup>2</sup> · y ＋ (－{kM} · x<sup>2</sup> · y)?</>
          )}
        </span>
      ),
      type: 'mcq',
      correct: zeroMonStr,
      options: ensureFourUniqueOptions(zeroMonStr, () => q6Distractors[randInt(0, q6Distractors.length - 1)]),
      renderOption: (opt) => {
        if (opt.includes('x² · y')) {
          const c = opt.split(' · ')[0];
          return <span>{c} · x<sup>2</sup> · y</span>;
        }
        return opt;
      },
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>{isEl ? 'Δύο αντίθετα μονώνυμα έχουν αντίθετους συντελεστές:' : 'Two opposite monomials have opposite coefficients:'}</span>
          <span className="inline-flex items-center gap-1">({kM} － {kM}) · x<sup>2</sup> · y ＝ 0.</span>
        </span>
      )
    });

    // Q7: MCQ - Βαθμός Αθροίσματος Πολυωνύμων
    const deg3Str = isEl ? '3ος βαθμός' : '3rd degree';
    const q7Distractors = isEl
      ? ['5ος βαθμός', '2ος βαθμός', '6ος βαθμός', '1ος βαθμός', '0ός βαθμός']
      : ['5th degree', '2nd degree', '6th degree', '1st degree', '0 degree'];
    qList.push({
      id: 7,
      title: isEl ? 'Βαθμός Αθροίσματος' : 'Degree of Sum',
      prompt: isEl
        ? 'Αν προσθέσουμε ένα πολυώνυμο 3ου βαθμού και ένα πολυώνυμο 2ου βαθμού, ποιος θα είναι ο βαθμός του αθροίσματος;'
        : 'If we add a 3rd degree polynomial and a 2nd degree polynomial, what will be the degree of the sum?',
      type: 'mcq',
      correct: deg3Str,
      options: ensureFourUniqueOptions(deg3Str, () => q7Distractors[randInt(0, q7Distractors.length - 1)]),
      explanation: isEl
        ? 'Ο όρος 3ου βαθμού δεν έχει όμοιο όρο στο δεύτερο πολυώνυμο για να εξουδετερωθεί. Επομένως παραμένει ο μεγαλύτερος βαθμός, άρα το άθροισμα είναι 3ου βαθμού.'
        : 'The 3rd degree term has no like term in the second polynomial to cancel out. Thus the maximum degree remains 3.'
    });

    // Q8: Input - Απλοποίηση με απαλοιφή
    const valConst = randInt(4, 9);
    qList.push({
      id: 8,
      title: isEl ? 'Υπολογισμός μετά από Απαλοιφή' : 'Evaluation after Parenthesis Removal',
      prompt: isEl
        ? `Στην παράσταση: (5 · x ＋ ${valConst}) － (5 · x － 2), ποιος είναι ο τελικός αριθμός που προκύπτει;`
        : `In the expression: (5 · x ＋ ${valConst}) － (5 · x － 2), what final number is obtained?`,
      correct: valConst + 2,
      type: 'input',
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>{isEl ? 'Απαλείφουμε τις παρενθέσεις:' : 'Remove parentheses:'}</span>
          <span className="inline-flex items-center gap-1">5 · x ＋ {valConst} － 5 · x ＋ 2.</span>
          <span>{isEl ? 'Οι όροι 5 · x εξουδετερώνονται:' : '5 · x cancels out:'}</span>
          <span className="inline-flex items-center gap-1">{valConst} ＋ 2 ＝ {valConst + 2}.</span>
        </span>
      )
    });

    // Q9: Προβλήματα από τη δεξαμενή Q9
    const p9Gen = [
      () => {
        const a1 = randInt(5, 9);
        const a2 = randInt(2, 4);
        const b = randInt(2, 6);
        const c = randInt(3, 8);
        const diff = a1 - a2;
        return {
          title: isEl ? 'Αφαίρεση Τριωνύμων και Συντελεστής x²' : 'Trinomial Subtraction and x² Coefficient',
          prompt: (
            <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
              {isEl ? (
                <>Δίνονται P(x) ＝ {a1} · x<sup>2</sup> － {b} · x ＋ {c} και Q(x) ＝ {a2} · x<sup>2</sup> ＋ 3 · x － 2. Ποιος είναι ο συντελεστής του x<sup>2</sup> στο πολυώνυμο P(x) － Q(x)；</>
              ) : (
                <>Given P(x) ＝ {a1} · x<sup>2</sup> － {b} · x ＋ {c} and Q(x) ＝ {a2} · x<sup>2</sup> ＋ 3 · x － 2. What is the coefficient of x<sup>2</sup> in P(x) － Q(x)?</>
              )}
            </span>
          ),
          correct: diff,
          type: 'input',
          tableData: [
            { 
              label: isEl ? 'Όροι με x²' : 'x² terms', 
              details: <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">{a1} · x<sup>2</sup> － {a2} · x<sup>2</sup></span> 
            },
            { 
              label: isEl ? 'Πράξη συντελεστών' : 'Coefficient subtraction', 
              details: <span className="inline-flex items-center gap-1">{a1} － {a2} ＝ {diff}</span> 
            },
            { 
              label: isEl ? 'Τελικός όρος x²' : 'Final x² term', 
              details: <span className="inline-flex items-center gap-1">{diff} · x<sup>2</sup></span> 
            }
          ],
          explanation: (
            <span className="inline-flex items-center gap-1">
              {a1} － {a2} ＝ {diff}.
            </span>
          )
        };
      },
      () => {
        const k = randInt(4, 9);
        const constRes = k - 3;
        return {
          title: isEl ? 'Απαλοιφή Παρενθέσεων με Αρνητικό Πρόσημο' : 'Parenthesis Removal with Minus Sign',
          prompt: (
            <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
              {isEl ? (
                <>Δίνεται η παράσταση: A(x) ＝ 4 · x － (3 · x － {k}) － 3. Ποιος είναι ο τελικός σταθερός όρος στην ανηγμένη μορφή；</>
              ) : (
                <>Given A(x) ＝ 4 · x － (3 · x － {k}) － 3. What is the constant term in simplified form?</>
              )}
            </span>
          ),
          correct: constRes,
          type: 'input',
          tableData: [
            { 
              label: isEl ? 'Απαλοιφή παρένθεσης' : 'Parenthesis removal', 
              details: <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">－(3 · x － {k}) ＝ －3 · x ＋ {k}</span> 
            },
            { 
              label: isEl ? 'Σταθεροί όροι' : 'Constant terms', 
              details: <span className="inline-flex items-center gap-1">＋{k} － 3</span> 
            },
            { 
              label: isEl ? 'Τελικό αποτέλεσμα' : 'Result', 
              details: <span className="inline-flex items-center gap-1">{k} － 3 ＝ {constRes}</span> 
            }
          ],
          explanation: (
            <span className="inline-flex items-center gap-1">
              {k} － 3 ＝ {constRes}.
            </span>
          )
        };
      }
    ];

    // Q10: Γεωμετρικές Περίμετροι (Καθαρισμός $ και no-scroll)
    const p10Gen = [
      () => {
        const a = randInt(2, 4);
        const b = randInt(3, 6);
        const c = randInt(1, 5);
        const d = randInt(2, 4);
        const totalX = 2 * (a + c);
        const totalConst = 2 * (b + d);
        const corr = `${totalX} · x ＋ ${totalConst}`;
        const p10Distractors = [
          `${totalX} · x ＋ ${b + d}`,
          `${a + c} · x ＋ ${totalConst}`,
          `${totalX + 2} · x ＋ ${totalConst}`,
          `${totalX} · x － ${totalConst}`,
          `${totalX * 2} · x ＋ ${totalConst}`
        ];
        return {
          title: isEl ? 'Περίμετρος Ορθογωνίου με Πολυωνυμικές Διαστάσεις' : 'Rectangle Perimeter with Polynomial Dimensions',
          prompt: (
            <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
              {isEl ? (
                <>Ένα ορθογώνιο έχει μήκος L ＝ {a} · x ＋ {b} και πλάτος W ＝ {c} · x ＋ {d}. Ποιο είναι το πολυώνυμο της περιμέτρου Π(x)；</>
              ) : (
                <>A rectangle has length L ＝ {a} · x ＋ {b} and width W ＝ {c} · x ＋ {d}. What polynomial represents perimeter P(x)?</>
              )}
            </span>
          ),
          correct: corr,
          type: 'mcq',
          options: ensureFourUniqueOptions(corr, () => p10Distractors[randInt(0, p10Distractors.length - 1)]),
          tableData: [
            { label: isEl ? 'Τύπος περιμέτρου' : 'Perimeter formula', details: 'Π ＝ 2 · (L ＋ W)' },
            { 
              label: isEl ? 'Άθροισμα διαστάσεων' : 'Sum of sides', 
              details: <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">({a + c}) · x ＋ ({b + d})</span> 
            },
            { 
              label: isEl ? 'Διπλασιασμός' : 'Double sum', 
              details: <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">2 · [({a + c}) · x ＋ ({b + d})] ＝ {totalX} · x ＋ {totalConst}</span> 
            }
          ],
          explanation: (
            <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
              Π(x) ＝ 2 · [({a} · x ＋ {b}) ＋ ({c} · x ＋ {d})] ＝ {totalX} · x ＋ {totalConst}.
            </span>
          )
        };
      },
      () => {
        const side1 = randInt(2, 5);
        const side2 = randInt(1, side1 - 1);
        const diff = 4 * (side1 - side2);
        return {
          title: isEl ? 'Διαφορά Περιμέτρων Δύο Τετραγώνων' : 'Difference of Perimeters of Two Squares',
          prompt: isEl
            ? `Δύο τετράγωνα έχουν πλευρές x ＋ ${side1} και x ＋ ${side2} αντίστοιχα. Πόσο μεγαλύτερη είναι η περίμετρος του πρώτου τετραγώνου;`
            : `Two squares have sides x ＋ ${side1} and x ＋ ${side2} respectively. How much larger is the perimeter of the first square?`,
          correct: diff,
          type: 'input',
          unit: isEl ? 'μονάδες' : 'units',
          tableData: [
            { 
              label: isEl ? 'Περίμετρος 1ου (Π₁)' : '1st perimeter', 
              details: <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">4 · (x ＋ {side1}) ＝ 4 · x ＋ {4 * side1}</span> 
            },
            { 
              label: isEl ? 'Περίμετρος 2ου (Π₂)' : '2nd perimeter', 
              details: <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">4 · (x ＋ {side2}) ＝ 4 · x ＋ {4 * side2}</span> 
            },
            { 
              label: isEl ? 'Διαφορά (Π₁ － Π₂)' : 'Difference', 
              details: <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">(4 · x ＋ {4 * side1}) － (4 · x ＋ {4 * side2}) ＝ {diff}</span> 
            }
          ],
          explanation: (
            <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
              Π₁ － Π₂ ＝ (4 · x ＋ {4 * side1}) － (4 · x ＋ {4 * side2}) ＝ {diff}.
            </span>
          )
        };
      }
    ];

    // Q11: Αριθμητική Τιμή
    const p11Gen = [
      () => {
        const xVal = randInt(2, 3);
        const a = randInt(2, 4);
        const b = randInt(1, 5);
        const c = randInt(2, 4);
        const d = randInt(1, 3);
        const val = (a + c) * xVal + (b - d);
        const netConst = b - d;
        const netConstSign = netConst >= 0 ? `＋ ${netConst}` : `－ ${Math.abs(netConst)}`;
        return {
          title: isEl ? 'Αριθμητική Τιμή Αθροίσματος Πολυωνύμων' : 'Numerical Value of Polynomial Sum',
          prompt: isEl
            ? `Αν P(x) ＝ ${a} · x ＋ ${b} και Q(x) ＝ ${c} · x － ${d}, να βρείτε την αριθμητική τιμή της παράστασης P(${xVal}) ＋ Q(${xVal}).`
            : `If P(x) ＝ ${a} · x ＋ ${b} and Q(x) ＝ ${c} · x － ${d}, find the numerical value of P(${xVal}) ＋ Q(${xVal}).`,
          correct: val,
          type: 'input',
          tableData: [
            { 
              label: isEl ? 'Άθροισμα P(x) ＋ Q(x)' : 'Sum P(x) ＋ Q(x)', 
              details: <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">{a + c} · x {netConstSign}</span> 
            },
            { 
              label: `x ＝ ${xVal}`, 
              details: <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">{a + c} · {xVal} {netConstSign} ＝ {val}</span> 
            }
          ],
          explanation: (
            <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
              (P ＋ Q)({xVal}) ＝ {a + c} · {xVal} {netConstSign} ＝ {val}.
            </span>
          )
        };
      }
    ];

    // Q12: Εφαρμογές Καθημερινής Ζωής & Οικονομικών
    const p12Gen = [
      () => {
        const priceA = randInt(4, 7);
        const priceB = randInt(3, 5);
        const discount = randInt(2, 4);
        const totalX = priceA + priceB;
        const totalConst = 15 - discount;
        const corr = `${totalX} · x ＋ ${totalConst}`;
        const p12Distractors = [
          `${totalX} · x ＋ 15`,
          `${totalX} · x ＋ ${15 + discount}`,
          `${priceA} · x ＋ ${totalConst}`,
          `${totalX} · x － ${totalConst}`,
          `${totalX + 2} · x ＋ ${totalConst}`
        ];
        return {
          title: isEl ? 'Συνολικό Κόστος Αγορών με Έκπτωση' : 'Total Shopping Cost with Discount',
          prompt: isEl
            ? `Ένας πελάτης αγοράζει προϊόντα αξίας A(x) ＝ ${priceA} · x ＋ 10 (€) και B(x) ＝ ${priceB} · x ＋ 5 (€). Αν το κατάστημα προσφέρει έκπτωση ${discount} €, ποιο είναι το πολυώνυμο του τελικού λογαριασμού A(x) ＋ B(x) － ${discount};`
            : `A customer buys items valued at A(x) ＝ ${priceA} · x ＋ 10 (€) and B(x) ＝ ${priceB} · x ＋ 5 (€). With a discount of ${discount} €, what polynomial represents A(x) ＋ B(x) － ${discount}?`,
          correct: corr,
          type: 'mcq',
          options: ensureFourUniqueOptions(corr, () => p12Distractors[randInt(0, p12Distractors.length - 1)]),
          tableData: [
            { 
              label: isEl ? 'Άθροισμα A ＋ B' : 'Sum A ＋ B', 
              details: <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">{totalX} · x ＋ 15</span> 
            },
            { 
              label: isEl ? 'Αφαίρεση έκπτωσης' : 'Subtract discount', 
              details: <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">{totalX} · x ＋ 15 － {discount} ＝ {totalX} · x ＋ {totalConst}</span> 
            }
          ],
          explanation: (
            <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
              ({priceA} · x ＋ 10) ＋ ({priceB} · x ＋ 5) － {discount} ＝ {totalX} · x ＋ {totalConst}.
            </span>
          )
        };
      }
    ];

    qList.push({ id: 9, ...p9Gen[randInt(0, p9Gen.length - 1)]() });
    qList.push({ id: 10, ...p10Gen[randInt(0, p10Gen.length - 1)]() });
    qList.push({ id: 11, ...p11Gen[randInt(0, p11Gen.length - 1)]() });
    qList.push({ id: 12, ...p12Gen[randInt(0, p12Gen.length - 1)]() });

    setQuestions(qList);
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    loadNewSet();
  }, [locale]);

  const handleAnswerChange = (qId, rawVal) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: rawVal }));
  };

  const sanitizeInput = (val) => {
    let sanitized = val.replace('.', ',').replace(/[^0-9,-]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    return sanitized.slice(0, 10);
  };

  const handleSubmit = () => {
    let s = 0;
    questions.forEach(q => {
      const uAns = userAnswers[q.id];
      if (uAns === undefined || uAns === null || uAns === '') return;

      if (q.type === 'input') {
        const parsedUser = parseFloat(String(uAns).replace(',', '.').trim());
        const parsedCorrect = parseFloat(String(q.correct).replace(',', '.').trim());
        if (!isNaN(parsedUser) && Math.abs(parsedUser - parsedCorrect) <= 0.05) {
          s += 1;
        }
      } else {
        if (String(uAns).trim() === String(q.correct).trim()) {
          s += 1;
        }
      }
    });

    setScore(s);
    setSubmitted(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== '' && userAnswers[k] !== undefined).length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/g-gymnasiou/11-prosthesi-afairesi-polionimon"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/11-prosthesi-afairesi-polionimon"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>📖 {toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        
        {/* Header Banner */}
        <section className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/10">
                {toCleanUppercase(t.heroBadge)}
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black mt-2 leading-tight break-words [overflow-wrap:anywhere]">
                {t.heroTitle}
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                {t.heroDesc}
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={loadNewSet}
                className="w-full sm:w-auto px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl shadow transition-all duration-150 text-xs sm:text-sm whitespace-nowrap"
              >
                🔄 {toCleanUppercase(t.btnNewSet)}
              </button>
            </div>
          </div>
        </section>

        {/* Results Banner */}
        {submitted && (
          <section className="p-5 sm:p-8 bg-white border-2 border-indigo-200 rounded-2xl sm:rounded-3xl shadow-lg mb-6 sm:mb-8 text-center animate-fade-in">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
              {t.scoreLabel}: {score} / 12 ({Math.round((score / 12) * 100)}%)
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-4">
              {score >= 10 ? t.scoreGreat : score >= 6 ? t.scoreGood : t.scoreNeedWork}
            </p>
            <button
              type="button"
              onClick={loadNewSet}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl sm:rounded-2xl shadow transition text-xs sm:text-sm"
            >
              🔄 {toCleanUppercase(t.btnTryNewSet)}
            </button>
          </section>
        )}

        {/* Λίστα Ερωτήσεων */}
        <div className="space-y-4 sm:space-y-6">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (submitted) {
              if (q.type === 'input') {
                const u = parseFloat(String(userAnswers[q.id]).replace(',', '.').trim());
                const c = parseFloat(String(q.correct).replace(',', '.').trim());
                isCorrect = !isNaN(u) && Math.abs(u - c) <= 0.05;
              } else {
                isCorrect = String(userAnswers[q.id]).trim() === String(q.correct).trim();
              }
            }

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border transition-all min-w-0 ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Header Ερώτησης */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm sm:text-lg text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                      {q.title}
                    </h3>
                  </div>
                  {submitted && (
                    <span
                      className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? t.correctBadge : t.wrongBadge}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση */}
                <div className="text-slate-800 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-medium break-words [overflow-wrap:anywhere]">
                  {q.prompt}
                </div>

                {/* Πεδία Απάντησης */}
                <div className="mb-2">
                  {q.type === 'tf' && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-md">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border flex items-center gap-2.5 transition-all min-h-[48px] sm:min-h-[56px] min-w-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-white bg-white' : 'border-slate-400'
                              }`}
                            >
                              {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                            </span>
                            <span className="break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1 font-semibold text-xs sm:text-sm">
                              {q.renderOption ? q.renderOption(opt) : opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'input' && (
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:max-w-xs">
                      <input
                        type="text"
                        disabled={submitted}
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => {
                          const sanitized = sanitizeInput(e.target.value);
                          handleAnswerChange(q.id, sanitized);
                        }}
                        placeholder={isEl ? "Απάντηση..." : "Answer..."}
                        className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-900 text-xs sm:text-sm"
                      />
                      {q.unit && (
                        <span className="text-xs sm:text-sm font-bold text-slate-500 whitespace-nowrap">
                          {q.unit}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* FEEDBACK SECTION */}
                {submitted && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 space-y-3 animate-fade-in">
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="w-full rounded-xl border border-slate-200 bg-white p-2 sm:p-3">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-100 text-slate-700 font-bold">
                            <tr>
                              <th className="p-2 sm:p-2.5 border-b w-1/3">{t.tableStep}</th>
                              <th className="p-2 sm:p-2.5 border-b w-2/3">{t.tableAnalysis}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {q.tableData.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <td className="p-2 sm:p-2.5 font-semibold text-slate-800 align-top">{row.label}</td>
                                <td className="p-2 sm:p-2.5 font-mono text-indigo-900 break-words [overflow-wrap:anywhere] align-top">{row.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                      <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
                        <span>{t.correctAnswerTitle}</span>
                        <span className="font-mono text-emerald-700 font-bold inline-flex items-center whitespace-nowrap gap-1">
                          {q.renderOption ? q.renderOption(q.correct) : q.correct} {q.unit || ''}
                        </span>
                      </div>
                      <div className="mt-1 break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM SCORE BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              {!submitted ? (
                <div className="text-[11px] sm:text-sm font-bold text-slate-300 truncate">
                  {toCleanUppercase(t.answeredLabel)}: <span className="text-indigo-400 font-black">{answeredCount}</span> / 12
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-400">{toCleanUppercase(isEl ? 'ΣΚΟΡ' : 'SCORE')}: {score} / 12</span>
                  <span className="hidden xs:inline text-slate-500">|</span>
                  <span className="text-indigo-300">{Math.round((score / 12) * 100)}%</span>
                </div>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {!submitted ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className={`px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                    answeredCount > 0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {toCleanUppercase(t.checkBtn)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-3.5 py-2 sm:px-6 sm:py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition whitespace-nowrap"
                >
                  {toCleanUppercase(t.btnNewSet)}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
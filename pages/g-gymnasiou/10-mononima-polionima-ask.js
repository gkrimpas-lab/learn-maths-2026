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
    <span className={`inline-flex items-center align-middle font-mono shrink-0 mx-0.5 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.52em] h-[1.12em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.8px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive
function Frac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">{num}</span>
      <span className="pt-0.5 break-all">{den}</span>
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

// Συγκεντρωτικό Λεξικό i18n
const translations = {
  el: {
    pageTitle: "Ασκήσεις: Μονώνυμα & Πολυώνυμα | Γ' Γυμνασίου",
    pageDesc: "Διαδραστικές ασκήσεις και προβλήματα στα μονώνυμα, πολυώνυμα, βαθμό και πράξεις για τη Γ' Γυμνασίου με αναλυτική βαθμολόγηση.",
    backNav: "Θεωρία Κεφ. 10",
    navTheoryBtn: "ΘΕΩΡΙΑ",
    headerBadge: "ΑΣΚΗΣΕΙΣ • Γ' ΓΥΜΝΑΣΙΟΥ",
    headerTitle: "Μονώνυμα & Πολυώνυμα: Εξάσκηση",
    headerDesc: "12 δυναμικές ερωτήσεις και αυτούσια προβλήματα. Απαντήστε και πατήστε «Έλεγχος Απαντήσεων».",
    btnNewSet: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    resultTitle: "Αποτέλεσμα:",
    feedbackHigh: "Εξαιρετική επίδοση! Κατανοείτε σε βάθος τα μονώνυμα και τις αλγεβρικές πράξεις.",
    feedbackMid: "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.",
    feedbackLow: "Χρειάζεται λίγη ακόμη εξάσκηση. Ελέγξτε τη θεωρία και τα συνήθη λάθη πριν ξαναδοκιμάσετε!",
    btnRetry: "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ",
    badgeCorrect: "✓ Σωστό",
    badgeIncorrect: "✗ Λάθος",
    placeholderInput: "Απάντηση...",
    tableColStep: "Στοιχείο / Βήμα",
    tableColDetails: "Ανάλυση Δεδομένων",
    correctAnswerLabel: "Σωστή Απάντηση:",
    footerAnswered: "ΑΠΑΝΤΗΘΗΚΑΝ",
    footerScore: "ΣΚΟΡ",
    btnCheck: "ΕΛΕΓΧΟΣ",
    trueLabel: "Σωστό",
    falseLabel: "Λάθος",
    degreeSuffix: "ος βαθμός"
  },
  en: {
    pageTitle: "Exercises: Monomials & Polynomials | Grade 9",
    pageDesc: "Interactive exercises and authentic problems on monomials, polynomials, degree, and operations for Grade 9 with detailed evaluation.",
    backNav: "Theory Ch. 10",
    navTheoryBtn: "THEORY",
    headerBadge: "EXERCISES • GRADE 9",
    headerTitle: "Monomials & Polynomials: Practice",
    headerDesc: "12 dynamic questions and authentic problems. Answer and click 'Check Answers'.",
    btnNewSet: "NEW EXERCISES",
    resultTitle: "Result:",
    feedbackHigh: "Outstanding performance! You thoroughly understand monomials and algebraic operations.",
    feedbackMid: "Great effort! Review the detailed steps below for the questions you found challenging.",
    feedbackLow: "Needs a bit more practice. Review the theory and common mistakes before trying again!",
    btnRetry: "TRY NEW SET",
    badgeCorrect: "✓ Correct",
    badgeIncorrect: "✗ Incorrect",
    placeholderInput: "Answer...",
    tableColStep: "Element / Step",
    tableColDetails: "Data Breakdown",
    correctAnswerLabel: "Correct Answer:",
    footerAnswered: "ANSWERED",
    footerScore: "SCORE",
    btnCheck: "CHECK",
    trueLabel: "True",
    falseLabel: "False",
    degreeSuffix: "th degree"
  }
};

// ==================== ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 - Q12) ====================

const PROBLEM_POOL_Q9 = [
  (locale) => {
    const a1 = randInt(2, 5);
    const a2 = randInt(1, 4);
    const b = randInt(2, 6);
    const c = randInt(1, 9);
    const totalA = a1 + a2;
    return {
      title: locale === 'el' ? 'Αναγωγή Ομοίων Όρων σε Δευτεροβάθμιο Πολυώνυμο' : 'Combining Like Terms in a Quadratic Polynomial',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>
              Δίνεται το πολυώνυμο: P(x) ＝ {a1} · x<sup>2</sup> ＋ {b} · x ＋ {a2} · x<sup>2</sup> － {c}. Ποιος είναι ο συντελεστής του x<sup>2</sup> μετά την αναγωγή των ομοίων όρων；
            </>
          ) : (
            <>
              Given the polynomial: P(x) ＝ {a1} · x<sup>2</sup> ＋ {b} · x ＋ {a2} · x<sup>2</sup> － {c}. What is the coefficient of x<sup>2</sup> after combining like terms?
            </>
          )}
        </span>
      ),
      correct: totalA,
      type: 'input',
      tableData: [
        { 
          label: locale === 'el' ? 'Όροι με x²' : 'Terms with x²', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{a1} · x<sup>2</sup> ＋ {a2} · x<sup>2</sup></span> 
        },
        { 
          label: locale === 'el' ? 'Άθροισμα συντελεστών' : 'Sum of coefficients', 
          details: <span className="inline-flex items-center whitespace-nowrap">({a1} ＋ {a2}) ＝ {totalA}</span> 
        },
        { 
          label: locale === 'el' ? 'Τελικός όρος x²' : 'Final x² term', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{totalA} · x<sup>2</sup></span> 
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Εντοπίζουμε τους ομοίους όρους' : 'We identify like terms'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">{a1} · x<sup>2</sup> {locale === 'el' ? 'και' : 'and'} {a2} · x<sup>2</sup>.</span>
          <span>{locale === 'el' ? 'Προσθέτουμε τους συντελεστές:' : 'Add their coefficients:'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">{a1} ＋ {a2} ＝ {totalA}.</span>
          <span>{locale === 'el' ? `Άρα ο τελικός συντελεστής του x² είναι ${totalA}.` : `Thus the coefficient of x² is ${totalA}.`}</span>
        </span>
      )
    };
  },
  (locale) => {
    const a1 = randInt(6, 10);
    const a2 = randInt(2, 5);
    const diff = a1 - a2;
    return {
      title: locale === 'el' ? 'Αφαίρεση Ομοίων Όρων' : 'Subtraction of Like Terms',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>
              Στο πολυώνυμο Q(y) ＝ {a1} · y<sup>3</sup> ＋ 4 · y － {a2} · y<sup>3</sup> ＋ 7, ποιος είναι ο συντελεστής του y<sup>3</sup> στην ανηγμένη μορφή；
            </>
          ) : (
            <>
              In polynomial Q(y) ＝ {a1} · y<sup>3</sup> ＋ 4 · y － {a2} · y<sup>3</sup> ＋ 7, what is the coefficient of y<sup>3</sup> in reduced form?
            </>
          )}
        </span>
      ),
      correct: diff,
      type: 'input',
      tableData: [
        { 
          label: locale === 'el' ? 'Όροι με y³' : 'Terms with y³', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{a1} · y<sup>3</sup> － {a2} · y<sup>3</sup></span> 
        },
        { 
          label: locale === 'el' ? 'Πράξη συντελεστών' : 'Coefficients operation', 
          details: <span className="inline-flex items-center whitespace-nowrap">{a1} － {a2} ＝ {diff}</span> 
        },
        { 
          label: locale === 'el' ? 'Τελικός όρος y³' : 'Final y³ term', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{diff} · y<sup>3</sup></span> 
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Συγκεντρώνουμε τους όρους 3ου βαθμού:' : 'We collect 3rd degree terms:'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            {a1} · y<sup>3</sup> － {a2} · y<sup>3</sup> ＝ ({a1} － {a2}) · y<sup>3</sup> ＝ {diff} · y<sup>3</sup>.
          </span>
          <span>{locale === 'el' ? `Ο ζητούμενος συντελεστής είναι ${diff}.` : `The required coefficient is ${diff}.`}</span>
        </span>
      )
    };
  },
  (locale) => {
    const a = randInt(3, 7);
    const b = randInt(2, 5);
    const c = randInt(1, 8);
    const distractorsList = locale === 'el'
      ? ['3ος βαθμός', '1ος βαθμός', '0ός βαθμός', '4ος βαθμός', '5ος βαθμός']
      : ['3rd degree', '1st degree', '0 degree', '4th degree', '5th degree'];
    return {
      title: locale === 'el' ? 'Βαθμός μετά την Ακύρωση Μεγιστοβάθμιων Όρων' : 'Degree after Cancellation of Highest Degree Terms',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>
              Δίνεται το πολυώνυμο: A(x) ＝ {a} · x<sup>3</sup> ＋ {b} · x<sup>2</sup> － {a} · x<sup>3</sup> ＋ {c}. Ποιος είναι ο βαθμός του πολυωνύμου μετά την αναγωγή；
            </>
          ) : (
            <>
              Given the polynomial: A(x) ＝ {a} · x<sup>3</sup> ＋ {b} · x<sup>2</sup> － {a} · x<sup>3</sup> ＋ {c}. What is the degree of the polynomial after combining terms?
            </>
          )}
        </span>
      ),
      correct: locale === 'el' ? '2ος βαθμός' : '2nd degree',
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      tableData: [
        { 
          label: locale === 'el' ? 'Όροι x³' : 'x³ terms', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{a} · x<sup>3</sup> － {a} · x<sup>3</sup> ＝ 0 · x<sup>3</sup></span> 
        },
        { 
          label: locale === 'el' ? 'Εναπομείναντες όροι' : 'Remaining terms', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{b} · x<sup>2</sup> ＋ {c}</span> 
        },
        { 
          label: locale === 'el' ? 'Μεγαλύτερος εκθέτης' : 'Highest exponent', 
          details: '2' 
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Οι όροι 3ου βαθμού είναι αντίθετοι και το άθροισμά τους μηδενίζεται. Το ανηγμένο πολυώνυμο είναι' : 'The 3rd degree terms cancel out. The simplified polynomial is'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">{b} · x<sup>2</sup> ＋ {c},</span>
          <span>{locale === 'el' ? 'το οποίο είναι 2ου βαθμού.' : 'which is of the 2nd degree.'}</span>
        </span>
      )
    };
  },
  (locale) => {
    const c1 = randInt(5, 12);
    const c2 = randInt(1, 4);
    const diff = c1 - c2;
    return {
      title: locale === 'el' ? 'Υπολογισμός Σταθερού Όρου' : 'Evaluating the Constant Term',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>
              Στο πολυώνυμο P(x) ＝ 3 · x<sup>2</sup> ＋ {c1} － 2 · x － {c2}, ποιος είναι ο τελικός σταθερός όρος μετά την αναγωγή；
            </>
          ) : (
            <>
              In polynomial P(x) ＝ 3 · x<sup>2</sup> ＋ {c1} － 2 · x － {c2}, what is the final constant term after combining like terms?
            </>
          )}
        </span>
      ),
      correct: diff,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Σταθεροί όροι' : 'Constant terms', details: `${c1} ${locale === 'el' ? 'και' : 'and'} －${c2}` },
        { label: locale === 'el' ? 'Πράξη' : 'Operation', details: <span className="inline-flex items-center whitespace-nowrap">{c1} － {c2} ＝ {diff}</span> },
        { label: locale === 'el' ? 'Τελικός σταθερός όρος' : 'Final constant term', details: `${diff}` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Ο σταθερός όρος προκύπτει από την πρόσθεση των όρων χωρίς μεταβλητή:' : 'The constant term is obtained by adding constant terms:'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">{c1} － {c2} ＝ {diff}.</span>
        </span>
      )
    };
  },
  (locale) => {
    const m = randInt(2, 6);
    const n = randInt(1, 4);
    const total = m + n;
    return {
      title: locale === 'el' ? 'Αναγωγή Μονωνύμων Δύο Μεταβλητών' : 'Combining Monomials of Two Variables',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>
              Στην παράσταση: B(x, y) ＝ {m} · x<sup>2</sup> · y ＋ 3 · x · y<sup>2</sup> ＋ {n} · x<sup>2</sup> · y, ποιος είναι ο συντελεστής του όρου x<sup>2</sup> · y；
            </>
          ) : (
            <>
              In expression: B(x, y) ＝ {m} · x<sup>2</sup> · y ＋ 3 · x · y<sup>2</sup> ＋ {n} · x<sup>2</sup> · y, what is the coefficient of term x<sup>2</sup> · y?
            </>
          )}
        </span>
      ),
      correct: total,
      type: 'input',
      tableData: [
        { 
          label: locale === 'el' ? 'Όμοιοι όροι με x² · y' : 'Like terms with x² · y', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{m} · x<sup>2</sup> · y ＋ {n} · x<sup>2</sup> · y</span> 
        },
        { 
          label: locale === 'el' ? 'Άθροισμα συντελεστών' : 'Sum of coefficients', 
          details: <span className="inline-flex items-center whitespace-nowrap">{m} ＋ {n} ＝ {total}</span> 
        },
        { 
          label: locale === 'el' ? 'Τελικός όρος' : 'Final term', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{total} · x<sup>2</sup> · y</span> 
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Οι όροι' : 'Terms'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">{m} · x<sup>2</sup> · y {locale === 'el' ? 'και' : 'and'} {n} · x<sup>2</sup> · y</span>
          <span>{locale === 'el' ? 'έχουν το ίδιο κύριο μέρος. Άρα:' : 'share the same literal part. So:'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">({m} ＋ {n}) · x<sup>2</sup> · y ＝ {total} · x<sup>2</sup> · y.</span>
        </span>
      )
    };
  },
  (locale) => {
    const a = randInt(2, 5);
    const b = randInt(3, 7);
    const distractorsList = locale === 'el'
      ? ['Τριώνυμο', 'Μονώνυμο', 'Μηδενικό', 'Τετραώνυμο', 'Σταθερό']
      : ['Trinomial', 'Monomial', 'Zero', 'Quadrinomial', 'Constant'];
    return {
      title: locale === 'el' ? 'Είδος Πολυωνύμου μετά την Αναγωγή' : 'Type of Polynomial after Combining Terms',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>
              Δίνεται το πολυώνυμο P(x) ＝ {a} · x<sup>2</sup> ＋ {b} · x － {a} · x<sup>2</sup> ＋ 8. Πώς χαρακτηρίζεται το πολυώνυμο στην ανηγμένη του μορφή；
            </>
          ) : (
            <>
              Given polynomial P(x) ＝ {a} · x<sup>2</sup> ＋ {b} · x － {a} · x<sup>2</sup> ＋ 8. How is the polynomial classified in its reduced form?
            </>
          )}
        </span>
      ),
      correct: locale === 'el' ? 'Διώνυμο' : 'Binomial',
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      tableData: [
        { label: locale === 'el' ? 'Αρχικοί όροι' : 'Initial terms', details: '4' },
        { 
          label: locale === 'el' ? 'Αναγωγή' : 'Cancellation', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{a} · x<sup>2</sup> － {a} · x<sup>2</sup> ＝ 0</span> 
        },
        { 
          label: locale === 'el' ? 'Ανηγμένη μορφή' : 'Reduced form', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{b} · x ＋ 8</span> 
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Μετά την αναγωγή απομένει η έκφραση' : 'After simplification, what remains is'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">{b} · x ＋ 8.</span>
          <span>{locale === 'el' ? 'Εφόσον έχει ακριβώς δύο όρους, είναι Διώνυμο.' : 'Since it has exactly two terms, it is a Binomial.'}</span>
        </span>
      )
    };
  }
];

const PROBLEM_POOL_Q10 = [
  (locale) => {
    const a = randInt(1, 3);
    const b = randInt(2, 4);
    const c = randInt(1, 5);
    const val = a * 4 + b * 2 + c;
    return {
      title: locale === 'el' ? 'Αριθμητική Τιμή Τριωνύμου για Θετικό Αριθμό' : 'Numerical Value of Trinomial for a Positive Number',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Αν P(x) ＝ {a} · x<sup>2</sup> ＋ {b} · x ＋ {c}, να υπολογίσετε την αριθμητική τιμή P(2).</>
          ) : (
            <>If P(x) ＝ {a} · x<sup>2</sup> ＋ {b} · x ＋ {c}, evaluate the numerical value P(2).</>
          )}
        </span>
      ),
      correct: val,
      type: 'input',
      tableData: [
        { 
          label: 'x ＝ 2', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">P(2) ＝ {a} · (2)<sup>2</sup> ＋ {b} · (2) ＋ {c}</span> 
        },
        { 
          label: '(2)²', 
          details: '4' 
        },
        { 
          label: locale === 'el' ? 'Γινόμενα' : 'Products', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{a * 4} ＋ {b * 2} ＋ {c}</span> 
        },
        { 
          label: locale === 'el' ? 'Τελικό άθροισμα' : 'Final sum', 
          details: `${val}` 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          P(2) ＝ {a} · 4 ＋ {b} · 2 ＋ {c} ＝ {a * 4} ＋ {b * 2} ＋ {c} ＝ {val}.
        </span>
      )
    };
  },
  (locale) => {
    const a = randInt(3, 8);
    const b = randInt(2, 6);
    const c = randInt(5, 15);
    return {
      title: locale === 'el' ? 'Αριθμητική Τιμή για x ＝ 0' : 'Numerical Value for x ＝ 0',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Για το πολυώνυμο P(x) ＝ {a} · x<sup>3</sup> － {b} · x ＋ {c}, ποια είναι η τιμή του P(0)；</>
          ) : (
            <>For polynomial P(x) ＝ {a} · x<sup>3</sup> － {b} · x ＋ {c}, what is the value of P(0)?</>
          )}
        </span>
      ),
      correct: c,
      type: 'input',
      tableData: [
        { 
          label: 'x ＝ 0', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">P(0) ＝ {a} · (0)<sup>3</sup> － {b} · (0) ＋ {c}</span> 
        },
        { label: locale === 'el' ? 'Αποτέλεσμα' : 'Result', details: `${c}` }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Όταν x ＝ 0, όλοι οι όροι με μεταβλητή μηδενίζονται και απομένει ο σταθερός όρος:' : 'When x ＝ 0, all variable terms vanish, leaving the constant:'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">P(0) ＝ {c}.</span>
        </span>
      )
    };
  },
  (locale) => {
    const a = randInt(2, 5);
    const b = randInt(3, 6);
    const c = randInt(1, 4);
    const sum = a + b + c;
    return {
      title: locale === 'el' ? 'Αριθμητική Τιμή για x ＝ 1' : 'Numerical Value for x ＝ 1',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Να βρείτε την τιμή P(1) για το πολυώνυμο P(x) ＝ {a} · x<sup>2</sup> ＋ {b} · x ＋ {c}.</>
          ) : (
            <>Find the value P(1) for polynomial P(x) ＝ ${a} · x<sup>2</sup> ＋ {b} · x ＋ {c}.</>
          )}
        </span>
      ),
      correct: sum,
      type: 'input',
      tableData: [
        { 
          label: 'x ＝ 1', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">P(1) ＝ {a} · (1)<sup>2</sup> ＋ {b} · (1) ＋ {c}</span> 
        },
        { 
          label: locale === 'el' ? 'Υπολογισμός' : 'Calculation', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{a} ＋ {b} ＋ {c} ＝ {sum}</span> 
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Για x ＝ 1, το P(1) ισούται ακριβώς με το άθροισμα των συντελεστών:' : 'For x ＝ 1, P(1) equals the sum of coefficients:'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">{a} ＋ {b} ＋ {c} ＝ {sum}.</span>
        </span>
      )
    };
  },
  (locale) => {
    const a = randInt(2, 4);
    const b = randInt(3, 5);
    const c = randInt(1, 6);
    const val = a - b + c;
    return {
      title: locale === 'el' ? 'Αριθμητική Τιμή για Αρνητικό Αριθμό x ＝ －1' : 'Numerical Value for Negative Number x ＝ －1',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Αν Q(x) ＝ {a} · x<sup>2</sup> ＋ {b} · x ＋ {c}, ποια είναι η τιμή Q(－1)；</>
          ) : (
            <>If Q(x) ＝ {a} · x<sup>2</sup> ＋ {b} · x ＋ {c}, what is the value Q(－1)?</>
          )}
        </span>
      ),
      correct: val,
      type: 'input',
      tableData: [
        { 
          label: 'x ＝ －1', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">Q(－1) ＝ {a} · (－1)<sup>2</sup> ＋ {b} · (－1) ＋ {c}</span> 
        },
        { label: '(－1)²', details: '1' },
        { 
          label: locale === 'el' ? 'Υπολογισμός' : 'Evaluation', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{a} － {b} ＋ {c} ＝ {val}</span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          Q(－1) ＝ {a} · (1) － {b} ＋ {c} ＝ {val}.
        </span>
      )
    };
  },
  (locale) => {
    const m = randInt(3, 7);
    const k = randInt(4, 9);
    const x = randInt(2, 4);
    const res = m * x - k;
    return {
      title: locale === 'el' ? 'Υπολογισμός Τιμής Διωνύμου' : 'Evaluating Binomial Value',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Για το διώνυμο D(x) ＝ {m} · x － {k}, να υπολογίσετε την τιμή D({x}).</>
          ) : (
            <>For binomial D(x) ＝ {m} · x － {k}, evaluate value D({x}).</>
          )}
        </span>
      ),
      correct: res,
      type: 'input',
      tableData: [
        { 
          label: `x ＝ ${x}`, 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">D({x}) ＝ {m} · ({x}) － {k}</span> 
        },
        { 
          label: locale === 'el' ? 'Γινόμενο' : 'Product', 
          details: <span className="inline-flex items-center whitespace-nowrap">{m * x}</span> 
        },
        { 
          label: locale === 'el' ? 'Αφαίρεση' : 'Subtraction', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{m * x} － {k} ＝ {res}</span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          D({x}) ＝ {m} · {x} － {k} ＝ {m * x} － {k} ＝ {res}.
        </span>
      )
    };
  },
  (locale) => {
    const coef = randInt(2, 5);
    const x = 2;
    const y = 3;
    const res = coef * (x * x) * y;
    return {
      title: locale === 'el' ? 'Αριθμητική Τιμή Μονωνύμου Δύο Μεταβλητών' : 'Evaluating Monomial of Two Variables',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Δίνεται το μονώνυμο M(x, y) ＝ {coef} · x<sup>2</sup> · y. Ποια είναι η τιμή του για x ＝ 2 και y ＝ 3；</>
          ) : (
            <>Given monomial M(x, y) ＝ {coef} · x<sup>2</sup> · y. What is its value for x ＝ 2 and y ＝ 3?</>
          )}
        </span>
      ),
      correct: res,
      type: 'input',
      tableData: [
        { 
          label: 'x ＝ 2, y ＝ 3', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">M(2, 3) ＝ {coef} · (2)<sup>2</sup> · 3</span> 
        },
        { label: '2²', details: '4' },
        { 
          label: locale === 'el' ? 'Πολλαπλασιασμός' : 'Multiplication', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{coef} · 4 · 3 ＝ {res}</span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          M(2, 3) ＝ {coef} · 4 · 3 ＝ {res}.
        </span>
      )
    };
  }
];

const PROBLEM_POOL_Q11 = [
  (locale) => {
    const a = randInt(2, 5);
    const b = randInt(1, 6);
    const coef = 3 * a;
    const constTerm = 3 * b;
    const distractorsList = [
      `${coef} · x ＋ ${b}`,
      `${a} · x ＋ ${constTerm}`,
      `${coef * 2} · x ＋ ${constTerm}`,
      `${coef} · x － ${constTerm}`,
      `${3 * a + 1} · x ＋ ${constTerm}`
    ];
    return {
      title: locale === 'el' ? 'Περίμετρος Ισοπλεύρου Τριγώνου' : 'Perimeter of an Equilateral Triangle',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένα ισόπλευρο τρίγωνο έχει πλευρά μήκους α ＝ {a} · x ＋ ${b}. Ποιο είναι το πολυώνυμο της περιμέτρου Π(x)；</>
          ) : (
            <>An equilateral triangle has side length a ＝ {a} · x ＋ ${b}. What polynomial expresses perimeter P(x)?</>
          )}
        </span>
      ),
      correct: `${coef} · x ＋ ${constTerm}`,
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      tableData: [
        { label: locale === 'el' ? 'Πλευρά' : 'Side', details: <span className="inline-flex items-center whitespace-nowrap gap-1">{a} · x ＋ {b}</span> },
        { label: locale === 'el' ? 'Τύπος' : 'Formula', details: 'P ＝ 3 · a' },
        { 
          label: locale === 'el' ? 'Ανάπτυγμα' : 'Expansion', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">3 · ({a} · x ＋ {b}) ＝ {coef} · x ＋ {constTerm}</span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          P(x) ＝ 3 · ({a} · x ＋ {b}) ＝ {coef} · x ＋ {constTerm}.
        </span>
      )
    };
  },
  (locale) => {
    const k = randInt(3, 8);
    const distractorsList = [
      `2 · x ＋ ${k}`,
      `x² ＋ ${k}`,
      `2 · x² ＋ ${k} · x`,
      `x² － ${k} · x`,
      `${k} · x² ＋ x`
    ];
    return {
      title: locale === 'el' ? 'Εμβαδόν Ορθογωνίου Παραλληλογράμμου' : 'Area of a Rectangle',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένα ορθογώνιο έχει μήκος x ＋ {k} και πλάτος x. Ποιο πολυώνυμο εκφράζει το εμβαδόν του E(x)；</>
          ) : (
            <>A rectangle has length x ＋ {k} and width x. Which polynomial expresses its area A(x)?</>
          )}
        </span>
      ),
      correct: `x² ＋ ${k} · x`,
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      renderOption: (opt) => {
        if (opt === `x² ＋ ${k} · x`) return <span>x<sup>2</sup> ＋ {k} · x</span>;
        if (opt === `2 · x² ＋ ${k} · x`) return <span>2 · x<sup>2</sup> ＋ {k} · x</span>;
        if (opt === `x² ＋ ${k}`) return <span>x<sup>2</sup> ＋ {k}</span>;
        if (opt === `x² － ${k} · x`) return <span>x<sup>2</sup> － {k} · x</span>;
        if (opt === `${k} · x² ＋ x`) return <span>{k} · x<sup>2</sup> ＋ x</span>;
        return opt;
      },
      tableData: [
        { label: locale === 'el' ? 'Διαστάσεις' : 'Dimensions', details: `x ＋ ${k}, x` },
        { label: locale === 'el' ? 'Τύπος' : 'Formula', details: 'Area ＝ Length · Width' },
        { 
          label: locale === 'el' ? 'Ανάπτυγμα' : 'Expansion', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">(x ＋ {k}) · x ＝ x<sup>2</sup> ＋ {k} · x</span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          (x ＋ {k}) · x ＝ x<sup>2</sup> ＋ {k} · x.
        </span>
      )
    };
  },
  (locale) => {
    const a = randInt(2, 4);
    const b = randInt(3, 7);
    const totalX = 2 * (a + 1);
    const totalConst = 2 * b;
    const distractorsList = [
      `${totalX} · x ＋ ${b}`,
      `${a + 1} · x ＋ ${b}`,
      `${totalX * 2} · x ＋ ${totalConst}`,
      `${totalX} · x － ${totalConst}`,
      `${a + 1} · x ＋ ${totalConst}`
    ];
    return {
      title: locale === 'el' ? 'Περίμετρος Ορθογωνίου' : 'Perimeter of a Rectangle',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ορθογώνιο έχει μήκος {a} · x ＋ {b} και πλάτος x. Ποιο είναι το πολυώνυμο της περιμέτρου Π(x)；</>
          ) : (
            <>A rectangle has length {a} · x ＋ {b} and width x. What polynomial represents perimeter P(x)?</>
          )}
        </span>
      ),
      correct: `${totalX} · x ＋ ${totalConst}`,
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      tableData: [
        { label: locale === 'el' ? 'Διαστάσεις' : 'Dimensions', details: `L ＝ ${a} · x ＋ ${b}, W ＝ x` },
        { 
          label: locale === 'el' ? 'Περίμετρος' : 'Perimeter', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">2 · (${a} · x ＋ {b} ＋ x) ＝ {totalX} · x ＋ ${totalConst}</span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          P(x) ＝ 2 · ({a} · x ＋ {b} ＋ x) ＝ {totalX} · x ＋ {totalConst}.
        </span>
      )
    };
  },
  (locale) => {
    const side = randInt(2, 5);
    const sqSide = side * side;
    const distractorsList = [
      `${side * 2} · x⁴`,
      `${sqSide} · x²`,
      `${side} · x⁴`,
      `${sqSide * 2} · x⁴`,
      `${sqSide} · x³`
    ];
    return {
      title: locale === 'el' ? 'Εμβαδόν Τετραγώνου με Πλευρά Μονώνυμο' : 'Square Area with Monomial Side',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένα τετράγωνο έχει πλευρά s ＝ {side} · x<sup>2</sup>. Ποιο μονώνυμο εκφράζει το εμβαδόν του；</>
          ) : (
            <>A square has side s ＝ {side} · x<sup>2</sup>. Which monomial expresses its area?</>
          )}
        </span>
      ),
      correct: `${sqSide} · x⁴`,
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      renderOption: (opt) => {
        if (opt.includes('x⁴')) {
          const c = opt.split(' · ')[0];
          return <span>{c} · x<sup>4</sup></span>;
        }
        if (opt.includes('x²')) {
          const c = opt.split(' · ')[0];
          return <span>{c} · x<sup>2</sup></span>;
        }
        if (opt.includes('x³')) {
          const c = opt.split(' · ')[0];
          return <span>{c} · x<sup>3</sup></span>;
        }
        return opt;
      },
      tableData: [
        { label: 's', details: <span className="inline-flex items-center whitespace-nowrap gap-1">{side} · x<sup>2</sup></span> },
        { 
          label: 's²', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">({side} · x<sup>2</sup>)<sup>2</sup> ＝ {sqSide} · x<sup>4</sup></span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          ({side} · x<sup>2</sup>)<sup>2</sup> ＝ {sqSide} · x<sup>4</sup>.
        </span>
      )
    };
  },
  (locale) => {
    const h = randInt(2, 5);
    const prod = 3 * h;
    const distractorsList = [
      `${prod} · x²`,
      `${3 + h} · x³`,
      `${prod} · x⁴`,
      `${3 * h} · x`,
      `${prod * 2} · x³`
    ];
    return {
      title: locale === 'el' ? 'Όγκος Παραλληλεπιπέδου' : 'Volume of Rectangular Solid',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ορθογώνιο παραλληλεπίπεδο έχει βάση με εμβαδόν B(x) ＝ 3 · x<sup>2</sup> και ύψος h ＝ {h} · x. Ποιο είναι το μονώνυμο του όγκου V(x)；</>
          ) : (
            <>A rectangular solid has base area B(x) ＝ 3 · x<sup>2</sup> and height h ＝ {h} · x. What monomial represents volume V(x)?</>
          )}
        </span>
      ),
      correct: `${prod} · x³`,
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      renderOption: (opt) => {
        if (opt.includes('x³')) return <span>{opt.split(' · ')[0]} · x<sup>3</sup></span>;
        if (opt.includes('x²')) return <span>{opt.split(' · ')[0]} · x<sup>2</sup></span>;
        if (opt.includes('x⁴')) return <span>{opt.split(' · ')[0]} · x<sup>4</sup></span>;
        return opt;
      },
      tableData: [
        { label: 'B(x), h', details: <span className="inline-flex items-center whitespace-nowrap gap-1">3 · x<sup>2</sup>, {h} · x</span> },
        { 
          label: 'V ＝ B · h', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">(3 · x<sup>2</sup>) · (${h} · x) ＝ {prod} · x<sup>3</sup></span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          V(x) ＝ (3 · x<sup>2</sup>) · ({h} · x) ＝ {prod} · x<sup>3</sup>.
        </span>
      )
    };
  },
  (locale) => {
    const c = randInt(2, 4);
    const d = randInt(1, 3);
    const termC = 6 * c;
    const termD = 6 * d;
    const distractorsList = [
      `${termC} · x － ${d}`,
      `${c} · x － ${termD}`,
      `${5 * c} · x － ${5 * d}`,
      `${termC} · x ＋ ${termD}`,
      `${termC * 2} · x － ${termD}`
    ];
    return {
      title: locale === 'el' ? 'Περίμετρος Κανονικού Εξαγώνου' : 'Perimeter of a Regular Hexagon',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Κανονικό εξάγωνο έχει πλευρά μήκους α ＝ {c} · x － {d}. Ποιο είναι το πολυώνυμο της περιμέτρου του；</>
          ) : (
            <>A regular hexagon has side length a ＝ {c} · x － {d}. What is its perimeter polynomial?</>
          )}
        </span>
      ),
      correct: `${termC} · x － ${termD}`,
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      tableData: [
        { label: 'Side', details: <span className="inline-flex items-center whitespace-nowrap gap-1">{c} · x － {d}</span> },
        { 
          label: 'P ＝ 6 · a', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">6 · ({c} · x － {d}) ＝ {termC} · x － ${termD}</span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          6 · ({c} · x － {d}) ＝ {termC} · x － {termD}.
        </span>
      )
    };
  }
];

const PROBLEM_POOL_Q12 = [
  (locale) => {
    const base = randInt(3, 5);
    const perKm = randInt(1, 2);
    const km = randInt(10, 25);
    const total = base + perKm * km;
    return {
      title: locale === 'el' ? 'Συνάρτηση Κόστους Διαδρομής Ταξί' : 'Taxi Ride Cost Function',
      prompt: locale === 'el'
        ? `Το κόστος μίσθωσης ταξί εκφράζεται από το πολυώνυμο K(x) ＝ ${perKm} · x ＋ ${base} (σε €), όπου x τα διανυθέντα χιλιόμετρα. Πόσα ευρώ (€) θα πληρώσει ένας επιβάτης για διαδρομή ${km} km;`
        : `A taxi ride cost is modeled by polynomial C(x) ＝ ${perKm} · x ＋ ${base} (in €), where x is kilometers traveled. How much (€) will a passenger pay for a ride of ${km} km?`,
      correct: total,
      type: 'input',
      unit: '€',
      tableData: [
        { label: 'K(x)', details: `${perKm} · x ＋ ${base}` },
        { label: 'x', details: `${km} km` },
        { 
          label: 'K(x)', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{perKm} · {km} ＋ {base} ＝ {perKm * km} ＋ {base} ＝ {total} €</span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          {perKm} · {km} ＋ {base} ＝ {total} €.
        </span>
      )
    };
  },
  (locale) => {
    const priceAdult = randInt(8, 12);
    const priceChild = randInt(4, 6);
    const adults = randInt(15, 30);
    const children = randInt(20, 40);
    const total = priceAdult * adults + priceChild * children;
    return {
      title: locale === 'el' ? 'Συνολικό Κόστος Εισιτηρίων Παράστασης' : 'Total Performance Ticket Revenue',
      prompt: locale === 'el'
        ? `Η συνολική είσπραξη ενός θεάτρου δίνεται από το πολυώνυμο E(x, y) ＝ ${priceAdult} · x ＋ ${priceChild} · y (σε €), όπου x ο αριθμός των ενηλίκων και y ο αριθμός των παιδιών. Ποια είναι η είσπραξη για ${adults} ενήλικες και ${children} παιδιά;`
        : `Total theater revenue is modeled by E(x, y) ＝ ${priceAdult} · x ＋ ${priceChild} · y (in €), where x is adults and y is children. What is the revenue for ${adults} adults and ${children} children?`,
      correct: total,
      type: 'input',
      unit: '€',
      tableData: [
        { label: 'x, y', details: `${adults}, ${children}` },
        { 
          label: 'Evaluation', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{priceAdult} · {adults} ＋ {priceChild} · {children} ＝ {priceAdult * adults} ＋ {priceChild * children} ＝ {total} €</span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          {priceAdult} · {adults} ＋ {priceChild} · {children} ＝ {total} €.
        </span>
      )
    };
  },
  (locale) => {
    const fixed = randInt(50, 100);
    const rate = randInt(15, 25);
    const hours = randInt(4, 8);
    const total = fixed + rate * hours;
    return {
      title: locale === 'el' ? 'Ημερήσια Παραγωγή Μονάδας' : 'Daily Factory Production',
      prompt: locale === 'el'
        ? `Ο αριθμός τεμαχίων που παράγει μία γραμμή παραγωγής δίνεται από το πολυώνυμο Π(t) ＝ ${rate} · t ＋ ${fixed}, όπου t οι ώρες λειτουργίας. Πόσα τεμάχια θα παραχθούν σε ${hours} ώρες;`
        : `Number of items produced by a plant is given by P(t) ＝ ${rate} · t ＋ ${fixed}, where t is operating hours. How many items will be produced in ${hours} hours?`,
      correct: total,
      type: 'input',
      tableData: [
        { label: 'P(t)', details: `${rate} · t ＋ ${fixed}` },
        { label: 't', details: `${hours}` },
        { 
          label: 'Evaluation', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{rate} · {hours} ＋ ${fixed} ＝ {rate * hours} ＋ {fixed} ＝ {total}</span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          {rate} · {hours} ＋ {fixed} ＝ {total}.
        </span>
      )
    };
  },
  (locale) => {
    const fee = randInt(10, 20);
    const costPerGb = randInt(2, 4);
    const gb = randInt(5, 12);
    const total = fee + costPerGb * gb;
    return {
      title: locale === 'el' ? 'Λογαριασμός Προγράμματος Κινητής' : 'Mobile Plan Bill',
      prompt: locale === 'el'
        ? `Ο μηνιαίος λογαριασμός ενός συμβολαίου υπολογίζεται από τον τύπο Λ(g) ＝ ${costPerGb} · g ＋ ${fee} (σε €), όπου g τα επιπλέον gigabytes. Αν καταναλωθούν ${gb} επιπλέον GB, ποιος είναι ο τελικός λογαριασμός σε €;`
        : `A monthly mobile bill is calculated as B(g) ＝ ${costPerGb} · g ＋ ${fee} (in €), where g is extra gigabytes. If ${gb} extra GB are used, what is the bill in €?`,
      correct: total,
      type: 'input',
      unit: '€',
      tableData: [
        { label: 'Base fee', details: `${fee} €` },
        { label: 'g', details: `${gb} GB` },
        { 
          label: 'Total', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{costPerGb} · {gb} ＋ ${fee} ＝ {costPerGb * gb} ＋ {fee} ＝ {total} €</span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          {costPerGb} · {gb} ＋ {fee} ＝ {total} €.
        </span>
      )
    };
  },
  (locale) => {
    const initial = randInt(20, 50);
    const weekly = randInt(5, 15);
    const weeks = randInt(6, 10);
    const total = initial + weekly * weeks;
    return {
      title: locale === 'el' ? 'Εξέλιξη Αποταμίευσης Μαθητή' : 'Student Savings Progress',
      prompt: locale === 'el'
        ? `Ένας μαθητής έχει αρχικά ${initial} € και αποταμιεύει ${weekly} € κάθε εβδομάδα. Το συνολικό ποσό εκφράζεται από το πολυώνυμο A(w) ＝ ${weekly} · w ＋ ${initial}. Πόσα ευρώ (€) θα έχει συγκεντρώσει μετά από ${weeks} εβδομάδες;`
        : `A student has initially ${initial} € and saves ${weekly} € each week. Total amount is S(w) ＝ ${weekly} · w ＋ ${initial}. How much money (€) will be accumulated after ${weeks} weeks?`,
      correct: total,
      type: 'input',
      unit: '€',
      tableData: [
        { label: 'S(w)', details: `${weekly} · w ＋ ${initial}` },
        { label: 'w', details: `${weeks}` },
        { 
          label: 'Total', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{weekly} · {weeks} ＋ ${initial} ＝ {weekly * weeks} ＋ {initial} ＝ {total} €</span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          {weekly} · {weeks} ＋ {initial} ＝ {total} €.
        </span>
      )
    };
  },
  (locale) => {
    const tank = randInt(45, 60);
    const burn = randInt(5, 8);
    const hours = randInt(3, 5);
    const remaining = tank - burn * hours;
    return {
      title: locale === 'el' ? 'Υπόλοιπο Καυσίμου σε Δεξαμενή' : 'Remaining Fuel in Tank',
      prompt: locale === 'el'
        ? `Το υπόλοιπο καυσίμου σε δεξαμενή εκφράζεται από το πολυώνυμο Y(t) ＝ ${tank} － ${burn} · t (σε λίτρα), όπου t οι ώρες λειτουργίας της μηχανής. Πόσα λίτρα καυσίμου θα απομένουν μετά από ${hours} ώρες;`
        : `Remaining fuel in a tank is modeled by R(t) ＝ ${tank} － ${burn} · t (in liters), where t is operating hours. How many liters of fuel remain after ${hours} hours?`,
      correct: remaining,
      type: 'input',
      unit: locale === 'el' ? 'λίτρα' : 'liters',
      tableData: [
        { label: 'Initial', details: `${tank}` },
        { 
          label: 'Burned', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{burn} · {hours} ＝ {burn * hours}</span> 
        },
        { 
          label: 'Remaining', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">{tank} － {burn * hours} ＝ {remaining}</span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          {tank} － {burn * hours} ＝ {remaining}.
        </span>
      )
    };
  }
];

export default function MononimaPolionimaExercises() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: locale === 'el' ? 'Ορισμός Μονωνύμου' : 'Definition of Monomial',
      prompt: locale === 'el'
        ? (q1IsCorrect
            ? 'Σε ένα μονώνυμο, όλοι οι εκθέτες των μεταβλητών του είναι υποχρεωτικά φυσικοί αριθμοί.'
            : 'Μία αλγεβρική παράσταση μπορεί να είναι μονώνυμο ακόμα κι αν περιέχει αρνητικό ακέραιο εκθέτη σε μεταβλητή.')
        : (q1IsCorrect
            ? 'In a monomial, all variable exponents are strictly natural numbers.'
            : 'An algebraic expression can be a monomial even if it contains a negative integer variable exponent.'),
      type: 'tf',
      correct: q1IsCorrect ? t.trueLabel : t.falseLabel,
      options: [t.trueLabel, t.falseLabel],
      explanation: locale === 'el'
        ? 'Σύμφωνα με τον ορισμό, στα μονώνυμα οι εκθέτες των μεταβλητών είναι αποκλειστικά μη αρνητικοί ακέραιοι (φυσικοί αριθμοί: 0, 1, 2, ...).'
        : 'By definition, in monomials variable exponents must strictly be non-negative integers (natural numbers: 0, 1, 2, ...).'
    });

    // Q2: MCQ - Αναγνώριση Μονωνύμου
    const validTerms = ['－5·x²·y', '3/4·a·b³', '7·x⁴'];
    const invalidTerms = ['3/x', 'x＋y', '2·x⁻³', '4·√x', '5/y²', 'x⁻¹'];
    const q2Correct = validTerms[randInt(0, validTerms.length - 1)];
    qList.push({
      id: 2,
      title: locale === 'el' ? 'Αναγνώριση Μονωνύμου' : 'Identifying Monomials',
      prompt: locale === 'el'
        ? 'Ποια από τις παρακάτω αλγεβρικές παραστάσεις ΕΙΝΑΙ μονώνυμο;'
        : 'Which of the following algebraic expressions IS a monomial?',
      type: 'mcq',
      correct: q2Correct,
      options: ensureFourUniqueOptions(q2Correct, () => invalidTerms[randInt(0, invalidTerms.length - 1)]),
      renderOption: (opt) => {
        if (opt === '－5·x²·y') return <span className="inline-flex items-center gap-1">－5 · x<sup>2</sup> · y</span>;
        if (opt === '3/4·a·b³') return <span className="inline-flex items-center gap-1"><Frac num="3" den="4" /> · a · b<sup>3</sup></span>;
        if (opt === '7·x⁴') return <span className="inline-flex items-center gap-1">7 · x<sup>4</sup></span>;
        if (opt === '3/x') return <Frac num="3" den="x" />;
        if (opt === 'x＋y') return <span>x ＋ y</span>;
        if (opt === '2·x⁻³') return <span className="inline-flex items-center gap-1">2 · x<sup>－3</sup></span>;
        if (opt === '4·√x') return <span className="inline-flex items-center gap-0.5">4 · <Radical>x</Radical></span>;
        if (opt === '5/y²') return <Frac num="5" den={<>y<sup>2</sup></>} />;
        if (opt === 'x⁻¹') return <span>x<sup>－1</sup></span>;
        return opt;
      },
      explanation: locale === 'el'
        ? 'Μονώνυμο είναι μόνο η ακέραια αλγεβρική παράσταση στην οποία μεταξύ των μεταβλητών σημειώνεται μόνο πολλαπλασιασμός με φυσικούς εκθέτες.'
        : 'A monomial is an integer algebraic expression with only multiplication between variables and natural number exponents.'
    });

    // Q3: Input - Συντελεστής μονωνύμου
    const q3Coef = randInt(-9, -2);
    qList.push({
      id: 3,
      title: locale === 'el' ? 'Συντελεστής Μονωνύμου' : 'Monomial Coefficient',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποιος είναι ο συντελεστής του μονωνύμου {q3Coef} · x<sup>3</sup> · y<sup>2</sup>；</>
          ) : (
            <>What is the coefficient of monomial {q3Coef} · x<sup>3</sup> · y<sup>2</sup>?</>
          )}
        </span>
      ),
      type: 'input',
      correct: q3Coef,
      explanation: locale === 'el'
        ? `Ο συντελεστής είναι ο αριθμητικός παράγοντας του μονωνύμου, δηλαδή το ${q3Coef}.`
        : `The coefficient is the numerical factor of the monomial, which is ${q3Coef}.`
    });

    // Q4: MCQ - Βαθμός μονωνύμου
    const degX = randInt(2, 4);
    const degY = randInt(1, 3);
    const totalDeg = degX + degY;
    qList.push({
      id: 4,
      title: locale === 'el' ? 'Βαθμός Μονωνύμου' : 'Degree of Monomial',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποιος είναι ο βαθμός του μονωνύμου 8 · x<sup>{degX}</sup> · y<sup>{degY}</sup> ως προς ΟΛΕΣ τις μεταβλητές του；</>
          ) : (
            <>What is the degree of monomial 8 · x<sup>{degX}</sup> · y<sup>{degY}</sup> with respect to ALL variables?</>
          )}
        </span>
      ),
      type: 'mcq',
      correct: `${totalDeg}${t.degreeSuffix}`,
      options: ensureFourUniqueOptions(`${totalDeg}${t.degreeSuffix}`, () => `${randInt(2, 9)}${t.degreeSuffix}`),
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          {locale === 'el' ? 'Ο συνολικός βαθμός είναι το άθροισμα των εκθετών:' : 'The total degree is the sum of exponents:'} {degX} ＋ {degY} ＝ {totalDeg}.
        </span>
      )
    });

    // Q5: True / False
    const q5Choice = Math.random() < 0.5;
    qList.push({
      id: 5,
      title: locale === 'el' ? 'Βαθμός Μηδενικού Μονωνύμου' : 'Degree of Zero Monomial',
      prompt: locale === 'el'
        ? (q5Choice
            ? 'Το μηδενικό μονώνυμο (ο αριθμός 0) δεν έχει βαθμό.'
            : 'Ο βαθμός του μηδενικού μονωνύμου (0) είναι ίσος με 0.')
        : (q5Choice
            ? 'The zero monomial (number 0) has no degree.'
            : 'The degree of the zero monomial (0) is 0.'),
      type: 'tf',
      correct: q5Choice ? t.trueLabel : t.falseLabel,
      options: [t.trueLabel, t.falseLabel],
      explanation: locale === 'el'
        ? 'Το μηδενικό μονώνυμο (0) αποτελεί ειδική περίπτωση και ΔΕΝ έχει βαθμό (δεν ορίζεται βαθμός). Ο βαθμός 0 ανήκει σε κάθε μη μηδενικό σταθερό αριθμό (π.χ. το 5 είναι 0ού βαθμού).'
        : 'The zero monomial (0) is a special case and has NO degree (undefined). Degree 0 belongs to any non-zero constant.'
    });

    // Q6: MCQ - Όμοια Μονώνυμα
    const similarTerms = ['4 · x² · y', '－7 · x² · y', '1/2 · x² · y', '9 · x² · y', '－x² · y'];
    const nonSimilar = ['4 · x · y²', '3 · x²', '5 · x³ · y', '－2 · x · y', '6 · y³'];
    const q6Correct = similarTerms[randInt(0, similarTerms.length - 1)];
    qList.push({
      id: 6,
      title: locale === 'el' ? 'Αναγνώριση Ομοίων Μονωνύμων' : 'Identifying Like Monomials',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποιο από τα παρακάτω μονώνυμα είναι ΟΜΟΙΟ με το 3 · x<sup>2</sup> · y；</>
          ) : (
            <>Which of the following monomials is LIKE 3 · x<sup>2</sup> · y?</>
          )}
        </span>
      ),
      type: 'mcq',
      correct: q6Correct,
      options: ensureFourUniqueOptions(q6Correct, () => nonSimilar[randInt(0, nonSimilar.length - 1)]),
      renderOption: (opt) => {
        if (opt.includes('1/2')) {
          return <span className="inline-flex items-center gap-1"><Frac num="1" den="2" /> · x<sup>2</sup> · y</span>;
        }
        if (opt.includes('x² · y')) {
          const c = opt.split(' · ')[0];
          return <span>{c} · x<sup>2</sup> · y</span>;
        }
        if (opt.includes('x · y²')) {
          const c = opt.split(' · ')[0];
          return <span>{c} · x · y<sup>2</sup></span>;
        }
        if (opt.includes('x²')) {
          const c = opt.split(' · ')[0];
          return <span>{c} · x<sup>2</sup></span>;
        }
        if (opt.includes('x³ · y')) {
          const c = opt.split(' · ')[0];
          return <span>{c} · x<sup>3</sup> · y</span>;
        }
        return opt;
      },
      explanation: locale === 'el'
        ? 'Όμοια λέγονται τα μονώνυμα που έχουν ακριβώς το ίδιο κύριο μέρος (τις ίδιες μεταβλητές με τους ίδιους εκθέτες).'
        : 'Like monomials share the exact same literal part (identical variables and exponents).'
    });

    // Q7: MCQ - Διώνυμο ή Τριώνυμο
    const q7PolyType = Math.random() < 0.5
      ? (locale === 'el' ? 'Διώνυμο' : 'Binomial')
      : (locale === 'el' ? 'Τριώνυμο' : 'Trinomial');
    const isBinomial = q7PolyType === 'Διώνυμο' || q7PolyType === 'Binomial';
    const q7DistractorsList = locale === 'el'
      ? ['Μονώνυμο', 'Διώνυμο', 'Τριώνυμο', 'Τετραώνυμο', 'Μηδενικό']
      : ['Monomial', 'Binomial', 'Trinomial', 'Quadrinomial', 'Zero'];
    qList.push({
      id: 7,
      title: locale === 'el' ? 'Κατάταξη Πολυωνύμου' : 'Polynomial Classification',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Πώς ονομάζεται το ανηγμένο πολυώνυμο P(x) ＝' : 'How is simplified polynomial P(x) ＝'}
          {isBinomial ? (
            <span className="inline-flex items-center whitespace-nowrap gap-1">4 · x<sup>2</sup> － 9；</span>
          ) : (
            <span className="inline-flex items-center whitespace-nowrap gap-1">2 · x<sup>2</sup> ＋ 5 · x － 7；</span>
          )}
        </span>
      ),
      type: 'mcq',
      correct: q7PolyType,
      options: ensureFourUniqueOptions(q7PolyType, () => q7DistractorsList[randInt(0, q7DistractorsList.length - 1)]),
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? `Η παράσταση έχει ${isBinomial ? '2' : '3'} μη όμοιους όρους, συνεπώς είναι` : `The expression has ${isBinomial ? '2' : '3'} non-like terms, hence it is a`}</span>
          <span className="font-semibold">{q7PolyType}.</span>
        </span>
      )
    });

    // Q8: Input - Βαθμός ανηγμένου πολυωνύμου
    const maxDegree = randInt(3, 5);
    const lowDegree = randInt(1, 2);
    qList.push({
      id: 8,
      title: locale === 'el' ? 'Βαθμός Πολυωνύμου' : 'Polynomial Degree',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? 'Ποιος είναι ο βαθμός του πολυωνύμου P(x) ＝' : 'What is the degree of polynomial P(x) ＝'}
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            7 · x{lowDegree === 2 ? <sup>2</sup> : ''} － 3 · x<sup>{maxDegree}</sup> ＋ 12；
          </span>
        </span>
      ),
      type: 'input',
      correct: maxDegree,
      explanation: locale === 'el'
        ? `Ο βαθμός του πολυωνύμου καθορίζεται από τον όρο με τον μεγαλύτερο εκθέτη, ο οποίος εδώ είναι ο ${maxDegree}.`
        : `The degree is determined by the term with the highest exponent, which here is ${maxDegree}.`
    });

    // Q9 - Q12
    const p9 = PROBLEM_POOL_Q9[randInt(0, PROBLEM_POOL_Q9.length - 1)](locale);
    const p10 = PROBLEM_POOL_Q10[randInt(0, PROBLEM_POOL_Q10.length - 1)](locale);
    const p11 = PROBLEM_POOL_Q11[randInt(0, PROBLEM_POOL_Q11.length - 1)](locale);
    const p12 = PROBLEM_POOL_Q12[randInt(0, PROBLEM_POOL_Q12.length - 1)](locale);

    const formatPoolItem = (item, id) => {
      let options = undefined;
      if (item.type === 'mcq') {
        options = ensureFourUniqueOptions(item.correct, item.distractors);
      }
      return {
        id,
        title: item.title,
        prompt: item.prompt,
        type: item.type,
        correct: item.correct,
        options,
        renderOption: item.renderOption,
        unit: item.unit,
        tableData: item.tableData,
        explanation: item.explanation
      };
    };

    qList.push(formatPoolItem(p9, 9));
    qList.push(formatPoolItem(p10, 10));
    qList.push(formatPoolItem(p11, 11));
    qList.push(formatPoolItem(p12, 12));

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
      backUrl="/g-gymnasiou/10-mononima-polionima"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/10-mononima-polionima"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>📖 {toCleanUppercase(t.navTheoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        
        {/* Header Banner - Responsive */}
        <section className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/10">
                {toCleanUppercase(t.headerBadge)}
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black mt-2 leading-tight break-words [overflow-wrap:anywhere]">
                {t.headerTitle}
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                {t.headerDesc}
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
              {t.resultTitle} {score} / 12 ({Math.round((score / 12) * 100)}%)
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-4">
              {score >= 10
                ? t.feedbackHigh
                : score >= 6
                ? t.feedbackMid
                : t.feedbackLow}
            </p>
            <button
              type="button"
              onClick={loadNewSet}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl sm:rounded-2xl shadow transition text-xs sm:text-sm"
            >
              🔄 {toCleanUppercase(t.btnRetry)}
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
                    <h3 className="font-bold text-sm sm:text-lg text-slate-900 leading-snug">
                      {q.title}
                    </h3>
                  </div>
                  {submitted && (
                    <span
                      className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? t.badgeCorrect : t.badgeIncorrect}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση - No Giveaway */}
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
                        placeholder={t.placeholderInput}
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

                {/* FEEDBACK SECTION - SAFE SCROLL TABLES */}
                {submitted && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 space-y-3 animate-fade-in">
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="w-full overflow-x-auto block -mx-1 sm:mx-0 rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-xs text-left min-w-[280px]">
                          <thead className="bg-slate-100 text-slate-700 font-bold">
                            <tr>
                              <th className="p-2 border-b">{t.tableColStep}</th>
                              <th className="p-2 border-b">{t.tableColDetails}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[11px] sm:text-xs">
                            {q.tableData.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <td className="p-2 font-semibold text-slate-800">{row.label}</td>
                                <td className="p-2 font-mono text-indigo-900 break-words [overflow-wrap:anywhere]">{row.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                      <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
                        <span>{t.correctAnswerLabel}</span>
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
                  {toCleanUppercase(t.footerAnswered)}: <span className="text-indigo-400 font-black">{answeredCount}</span> / 12
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-400">{toCleanUppercase(t.footerScore)}: {score} / 12</span>
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
                  {toCleanUppercase(t.btnCheck)}
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
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
    pageTitle: "Ασκήσεις: Ιδιότητες Τετραγωνικών Ριζών | Γ' Γυμνασίου",
    pageDesc: "Διαδραστικές ασκήσεις στις ιδιότητες των τετραγωνικών ριζών, γινόμενο, πηλίκο, απλοποίηση και ρητοποίηση με αναλυτικά βήματα για τη Γ' Γυμνασίου.",
    backNav: "Θεωρία Κεφ. 6",
    navTheoryBtn: "ΘΕΩΡΙΑ",
    headerBadge: "ΑΣΚΗΣΕΙΣ • Γ' ΓΥΜΝΑΣΙΟΥ",
    headerTitle: "Ιδιότητες Τετραγωνικών Ριζών: Εξάσκηση",
    headerDesc: "12 δυναμικές ερωτήσεις και αυτούσια προβλήματα απλοποίησης, γινομένου, πηλίκου και ρητοποίησης.",
    btnNewSet: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    resultTitle: "Αποτέλεσμα:",
    feedbackHigh: "Εξαιρετική επίδοση! Κατανοείτε σε βάθος τις ιδιότητες των τετραγωνικών ριζών και τις τεχνικές ρητοποίησης.",
    feedbackMid: "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.",
    feedbackLow: "Χρειάζεται λίγη εξάσκηση ακόμα. Συμβουλευτείτε τη θεωρία για την εξαγωγή παραγόντων από τη ρίζα!",
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
    falseLabel: "Λάθος"
  },
  en: {
    pageTitle: "Exercises: Properties of Square Roots | Grade 9",
    pageDesc: "Interactive exercises on square root properties, product, quotient, simplification, and rationalization with detailed steps for Grade 9.",
    backNav: "Theory Ch. 6",
    navTheoryBtn: "THEORY",
    headerBadge: "EXERCISES • GRADE 9",
    headerTitle: "Square Root Properties: Practice",
    headerDesc: "12 dynamic questions and authentic problems on simplification, product, quotient, and rationalization.",
    btnNewSet: "NEW EXERCISES",
    resultTitle: "Result:",
    feedbackHigh: "Excellent performance! You thoroughly understand square root properties and rationalization techniques.",
    feedbackMid: "Great effort! Review the detailed steps below for the questions you found challenging.",
    feedbackLow: "Keep practicing! Consult the theory on extracting factors from square roots.",
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
    falseLabel: "False"
  }
};

// ==================== ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 - Q12) ====================

const PROBLEM_POOL_Q9 = [
  (locale) => {
    const pairs = [
      { a: 5, b: 20, res: 10 },
      { a: 8, b: 18, res: 12 },
      { a: 3, b: 27, res: 9 },
      { a: 2, b: 50, res: 10 },
      { a: 6, b: 24, res: 12 },
      { a: 7, b: 28, res: 14 }
    ];
    const picked = pairs[randInt(0, pairs.length - 1)];
    const prod = picked.a * picked.b;
    const charA = locale === 'el' ? 'α' : 'a';
    const charB = locale === 'el' ? 'β' : 'b';

    return {
      title: locale === 'el' ? 'Γινόμενο Ριζών με Ρητό Αποτέλεσμα' : 'Product of Roots with Rational Result',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Πόσο ισούται η αριθμητική τιμή του γινομένου <Radical>{picked.a}</Radical> · <Radical>{picked.b}</Radical>；</>
          ) : (
            <>What is the numerical value of the product <Radical>{picked.a}</Radical> · <Radical>{picked.b}</Radical>?</>
          )}
        </span>
      ),
      correct: picked.res,
      type: 'input',
      tableData: [
        { 
          label: locale === 'el' ? 'Ιδιότητα γινομένου' : 'Product rule', 
          details: (
            <span className="inline-flex items-center whitespace-nowrap gap-1">
              <Radical>{picked.a}</Radical> · <Radical>{picked.b}</Radical> ＝ <Radical>{picked.a} · {picked.b}</Radical>
            </span>
          )
        },
        { 
          label: locale === 'el' ? 'Γινόμενο υπόριζων' : 'Radicand product', 
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <Radical>{prod}</Radical>
            </span>
          )
        },
        { 
          label: locale === 'el' ? 'Τελική τιμή' : 'Final value', 
          details: `${picked.res}` 
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Εφαρμόζουμε την ιδιότητα' : 'Applying the rule'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Radical>{charA}</Radical> · <Radical>{charB}</Radical> ＝ <Radical>{charA} · {charB}</Radical>:
          </span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Radical>{picked.a}</Radical> · <Radical>{picked.b}</Radical> ＝ <Radical>{prod}</Radical> ＝ {picked.res}.
          </span>
        </span>
      )
    };
  },
  (locale) => {
    const pairs = [
      { a: 75, b: 3, res: 5 },
      { a: 98, b: 2, res: 7 },
      { a: 112, b: 7, res: 4 },
      { a: 108, b: 3, res: 6 },
      { a: 80, b: 5, res: 4 },
      { a: 150, b: 6, res: 5 }
    ];
    const picked = pairs[randInt(0, pairs.length - 1)];
    const quot = picked.a / picked.b;
    const charA = locale === 'el' ? 'α' : 'a';
    const charB = locale === 'el' ? 'β' : 'b';

    return {
      title: locale === 'el' ? 'Πηλίκο Ριζών με Ρητό Αποτέλεσμα' : 'Quotient of Roots with Rational Result',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Πόσο ισούται η τιμή του κλάσματος <Frac num={<Radical>{picked.a}</Radical>} den={<Radical>{picked.b}</Radical>} />；</>
          ) : (
            <>What is the value of the fraction <Frac num={<Radical>{picked.a}</Radical>} den={<Radical>{picked.b}</Radical>} />?</>
          )}
        </span>
      ),
      correct: picked.res,
      type: 'input',
      tableData: [
        { 
          label: locale === 'el' ? 'Ιδιότητα πηλίκου' : 'Quotient rule', 
          details: (
            <span className="inline-flex items-center whitespace-nowrap gap-1">
              <Frac num={<Radical>{picked.a}</Radical>} den={<Radical>{picked.b}</Radical>} /> ＝ <Radical><Frac num={picked.a} den={picked.b} /></Radical>
            </span>
          )
        },
        { 
          label: locale === 'el' ? 'Διαίρεση' : 'Division', 
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <Radical>{quot}</Radical>
            </span>
          )
        },
        { 
          label: locale === 'el' ? 'Τελική τιμή' : 'Final value', 
          details: `${picked.res}` 
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Εφαρμόζουμε την ιδιότητα' : 'Applying the rule'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Frac num={<Radical>{charA}</Radical>} den={<Radical>{charB}</Radical>} /> ＝ <Radical><Frac num={charA} den={charB} /></Radical>:
          </span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Frac num={<Radical>{picked.a}</Radical>} den={<Radical>{picked.b}</Radical>} /> ＝ <Radical>{quot}</Radical> ＝ {picked.res}.
          </span>
        </span>
      )
    };
  },
  (locale) => {
    const sets = [
      { a: 2, b: 3, c: 6, res: 6 },
      { a: 2, b: 5, c: 10, res: 10 },
      { a: 3, b: 5, c: 15, res: 15 },
      { a: 2, b: 7, c: 14, res: 14 }
    ];
    const picked = sets[randInt(0, sets.length - 1)];
    const square = picked.res * picked.res;

    return {
      title: locale === 'el' ? 'Γινόμενο Τριών Ριζών' : 'Product of Three Roots',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Πόσο ισούται το γινόμενο <Radical>{picked.a}</Radical> · <Radical>{picked.b}</Radical> · <Radical>{picked.c}</Radical>；</>
          ) : (
            <>What is the product <Radical>{picked.a}</Radical> · <Radical>{picked.b}</Radical> · <Radical>{picked.c}</Radical>?</>
          )}
        </span>
      ),
      correct: picked.res,
      type: 'input',
      tableData: [
        { 
          label: locale === 'el' ? 'Συνένωση ριζών' : 'Combining roots', 
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <Radical>{picked.a} · {picked.b} · {picked.c}</Radical>
            </span>
          )
        },
        { 
          label: locale === 'el' ? 'Γινόμενο' : 'Product', 
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <Radical>{square}</Radical>
            </span>
          )
        },
        { 
          label: locale === 'el' ? 'Αποτέλεσμα' : 'Result', 
          details: `${picked.res}` 
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Συνενώνουμε όλες τις ρίζες σε μία:' : 'Combining all roots into one:'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Radical>{picked.a} · {picked.b} · {picked.c}</Radical> ＝ <Radical>{square}</Radical> ＝ {picked.res}.
          </span>
        </span>
      )
    };
  },
  (locale) => {
    const k = randInt(2, 4);
    const res = k * 3;
    const numeratorCoeff = 2 * k;

    return {
      title: locale === 'el' ? 'Απλοποίηση Κλάσματος με Συντελεστές και Ρίζες' : 'Simplifying Fraction with Coefficients and Radicals',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Πόσο ισούται η παράσταση <Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">{numeratorCoeff} · <Radical>45</Radical></span>} den={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">2 · <Radical>5</Radical></span>} />；</>
          ) : (
            <>What does the expression <Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">{numeratorCoeff} · <Radical>45</Radical></span>} den={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">2 · <Radical>5</Radical></span>} /> evaluate to?</>
          )}
        </span>
      ),
      correct: res,
      type: 'input',
      tableData: [
        { 
          label: locale === 'el' ? 'Διαίρεση συντελεστών' : 'Coefficient division', 
          details: <span className="inline-flex items-center whitespace-nowrap">{numeratorCoeff} : 2 ＝ {k}</span>
        },
        { 
          label: locale === 'el' ? 'Πηλίκο ριζών' : 'Quotient of radicals', 
          details: (
            <span className="inline-flex items-center whitespace-nowrap gap-1">
              <Frac num={<Radical>45</Radical>} den={<Radical>5</Radical>} /> ＝ <Radical><Frac num="45" den="5" /></Radical> ＝ <Radical>9</Radical> ＝ 3
            </span>
          )
        },
        { 
          label: locale === 'el' ? 'Τελικό γινόμενο' : 'Final product', 
          details: <span className="inline-flex items-center whitespace-nowrap">{k} · 3 ＝ {res}</span>
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Διαιρούμε τους εξωτερικούς συντελεστές' : 'Divide coefficients'}</span>
          <span className="inline-flex items-center whitespace-nowrap">({numeratorCoeff} : 2 ＝ {k})</span>
          <span>{locale === 'el' ? 'και τις ρίζες' : 'and roots'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            (<Frac num={<Radical>45</Radical>} den={<Radical>5</Radical>} /> ＝ 3):
          </span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            {k} · 3 ＝ {res}.
          </span>
        </span>
      )
    };
  },
  (locale) => {
    return {
      title: locale === 'el' ? 'Πηλίκο Δεκαδικών Ριζών' : 'Quotient of Decimal Radicals',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Πόσο ισούται η τιμή του κλάσματος <Frac num={<Radical>0,72</Radical>} den={<Radical>0,02</Radical>} />；</>
          ) : (
            <>What is the value of the fraction <Frac num={<Radical>0.72</Radical>} den={<Radical>0.02</Radical>} />?</>
          )}
        </span>
      ),
      correct: 6,
      type: 'input',
      tableData: [
        { 
          label: locale === 'el' ? 'Ιδιότητα πηλίκου' : 'Quotient rule', 
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              {locale === 'el' ? <Radical>0,72 : 0,02</Radical> : <Radical>0.72 : 0.02</Radical>}
            </span>
          )
        },
        { 
          label: locale === 'el' ? 'Διαίρεση δεκαδικών' : 'Decimal division', 
          details: <span className="inline-flex items-center whitespace-nowrap">{locale === 'el' ? '0,72 : 0,02 ＝ 72 : 2 ＝ 36' : '0.72 : 0.02 ＝ 72 : 2 ＝ 36'}</span>
        },
        { 
          label: locale === 'el' ? 'Τελική τιμή' : 'Final value', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>36</Radical> ＝ 6</span>
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            {locale === 'el' ? (
              <><Radical>0,72 : 0,02</Radical> ＝ <Radical>36</Radical> ＝ 6.</>
            ) : (
              <><Radical>0.72 : 0.02</Radical> ＝ <Radical>36</Radical> ＝ 6.</>
            )}
          </span>
        </span>
      )
    };
  },
  (locale) => {
    return {
      title: locale === 'el' ? 'Γινόμενο Δεκαδικών Ριζών' : 'Product of Decimal Radicals',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποια είναι η δεκαδική τιμή του γινομένου <Radical>0,3</Radical> · <Radical>1,2</Radical>；</>
          ) : (
            <>What is the decimal value of the product <Radical>0.3</Radical> · <Radical>1.2</Radical>?</>
          )}
        </span>
      ),
      correct: locale === 'el' ? '0,6' : '0.6',
      type: 'input',
      tableData: [
        { 
          label: locale === 'el' ? 'Γινόμενο υπόριζων' : 'Product of radicands', 
          details: <span className="inline-flex items-center whitespace-nowrap">{locale === 'el' ? '0,3 · 1,2 ＝ 0,36' : '0.3 · 1.2 ＝ 0.36'}</span>
        },
        { 
          label: locale === 'el' ? 'Τετραγωνική ρίζα' : 'Square root', 
          details: (
            <span className="inline-flex items-center whitespace-nowrap gap-1">
              {locale === 'el' ? <><Radical>0,36</Radical> ＝ 0,6</> : <><Radical>0.36</Radical> ＝ 0.6</>}
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            {locale === 'el' ? (
              <><Radical>0,3 · 1,2</Radical> ＝ <Radical>0,36</Radical> ＝ 0,6.</>
            ) : (
              <><Radical>0.3 · 1.2</Radical> ＝ <Radical>0.36</Radical> ＝ 0.6.</>
            )}
          </span>
        </span>
      )
    };
  }
];

const PROBLEM_POOL_Q10 = [
  (locale) => {
    return {
      title: locale === 'el' ? 'Εξαγωγή Παράγοντα από το √12' : 'Extracting Factor from √12',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Γράφοντας τη ρίζα <Radical>12</Radical> στην απλούστερη μορφή α · <Radical>β</Radical>, ποιος είναι ο ακέραιος συντελεστής α；</>
          ) : (
            <>Writing <Radical>12</Radical> in simplest form a · <Radical>b</Radical>, what is the integer coefficient a?</>
          )}
        </span>
      ),
      correct: 2,
      type: 'input',
      tableData: [
        { 
          label: locale === 'el' ? 'Ανάλυση σε τέλειο τετράγωνο' : 'Decomposition into perfect square', 
          details: <span className="inline-flex items-center whitespace-nowrap">12 ＝ 4 · 3 ＝ 2<sup>2</sup> · 3</span>
        },
        { 
          label: locale === 'el' ? 'Εξαγωγή παράγοντα' : 'Factor extraction', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>12</Radical> ＝ <Radical>4</Radical> · <Radical>3</Radical> ＝ 2 · <Radical>3</Radical></span>
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Radical>12</Radical> ＝ <Radical>4 · 3</Radical> ＝ 2 · <Radical>3</Radical>.
          </span>
          <span>{locale === 'el' ? 'Άρα ο συντελεστής α είναι 2.' : 'Thus coefficient a is 2.'}</span>
        </span>
      )
    };
  },
  (locale) => {
    const distractorsList = ['3·√5', '25·√3', '15·√5', '5·√5', '15·√3'];
    return {
      title: locale === 'el' ? 'Εξαγωγή Παράγοντα από το √75' : 'Extracting Factor from √75',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποια είναι η απλοποιημένη μορφή του άρρητου αριθμού <Radical>75</Radical>；</>
          ) : (
            <>What is the simplified form of the irrational number <Radical>75</Radical>?</>
          )}
        </span>
      ),
      correct: '5·√3',
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      renderOption: (opt) => {
        if (opt === '5·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">5 · <Radical>3</Radical></span>;
        if (opt === '3·√5') return <span className="inline-flex items-center whitespace-nowrap gap-1">3 · <Radical>5</Radical></span>;
        if (opt === '25·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">25 · <Radical>3</Radical></span>;
        if (opt === '15·√5') return <span className="inline-flex items-center whitespace-nowrap gap-1">15 · <Radical>5</Radical></span>;
        if (opt === '5·√5') return <span className="inline-flex items-center whitespace-nowrap gap-1">5 · <Radical>5</Radical></span>;
        if (opt === '15·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">15 · <Radical>3</Radical></span>;
        return opt;
      },
      tableData: [
        { label: locale === 'el' ? 'Ανάλυση' : 'Decomposition', details: <span className="inline-flex items-center whitespace-nowrap">75 ＝ 25 · 3</span> },
        { label: locale === 'el' ? 'Εξαγωγή ρίζας' : 'Root extraction', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>75</Radical> ＝ <Radical>25</Radical> · <Radical>3</Radical> ＝ 5 · <Radical>3</Radical></span> }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          <Radical>75</Radical> ＝ <Radical>25 · 3</Radical> ＝ 5 · <Radical>3</Radical>.
        </span>
      )
    };
  },
  (locale) => {
    return {
      title: locale === 'el' ? 'Εξαγωγή Παράγοντα από το √32' : 'Extracting Factor from √32',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποιος είναι ο συντελεστής α αν γράψουμε το <Radical>32</Radical> στη μορφή α · <Radical>2</Radical>；</>
          ) : (
            <>What is the coefficient a if we write <Radical>32</Radical> in the form a · <Radical>2</Radical>?</>
          )}
        </span>
      ),
      correct: 4,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Ανάλυση' : 'Decomposition', details: <span className="inline-flex items-center whitespace-nowrap">32 ＝ 16 · 2</span> },
        { label: locale === 'el' ? 'Εξαγωγή' : 'Extraction', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>32</Radical> ＝ <Radical>16</Radical> · <Radical>2</Radical> ＝ 4 · <Radical>2</Radical></span> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Radical>32</Radical> ＝ <Radical>16 · 2</Radical> ＝ 4 · <Radical>2</Radical>.
          </span>
          <span>{locale === 'el' ? 'Άρα α ＝ 4.' : 'Thus a ＝ 4.'}</span>
        </span>
      )
    };
  },
  (locale) => {
    const distractorsList = ['2·√3', '9·√2', '6·√3', '6·√2', '2·√6'];
    return {
      title: locale === 'el' ? 'Εξαγωγή Παράγοντα από το √18' : 'Extracting Factor from √18',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποια είναι η απλοποιημένη μορφή του αριθμού <Radical>18</Radical>；</>
          ) : (
            <>What is the simplified form of <Radical>18</Radical>?</>
          )}
        </span>
      ),
      correct: '3·√2',
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      renderOption: (opt) => {
        if (opt === '3·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">3 · <Radical>2</Radical></span>;
        if (opt === '2·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>3</Radical></span>;
        if (opt === '9·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">9 · <Radical>2</Radical></span>;
        if (opt === '6·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">6 · <Radical>3</Radical></span>;
        if (opt === '6·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">6 · <Radical>2</Radical></span>;
        if (opt === '2·√6') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>6</Radical></span>;
        return opt;
      },
      tableData: [
        { label: locale === 'el' ? 'Ανάλυση' : 'Decomposition', details: <span className="inline-flex items-center whitespace-nowrap">18 ＝ 9 · 2</span> },
        { label: locale === 'el' ? 'Μορφή' : 'Form', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>18</Radical> ＝ <Radical>9</Radical> · <Radical>2</Radical> ＝ 3 · <Radical>2</Radical></span> }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          <Radical>18</Radical> ＝ <Radical>9 · 2</Radical> ＝ 3 · <Radical>2</Radical>.
        </span>
      )
    };
  },
  (locale) => {
    return {
      title: locale === 'el' ? 'Εξαγωγή Παράγοντα από το √45' : 'Extracting Factor from √45',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Αν <Radical>45</Radical> ＝ α · <Radical>5</Radical>, ποια είναι η τιμή του α；</>
          ) : (
            <>If <Radical>45</Radical> ＝ a · <Radical>5</Radical>, what is the value of a?</>
          )}
        </span>
      ),
      correct: 3,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Ανάλυση' : 'Decomposition', details: <span className="inline-flex items-center whitespace-nowrap">45 ＝ 9 · 5</span> },
        { label: locale === 'el' ? 'Εξαγωγή' : 'Extraction', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>45</Radical> ＝ 3 · <Radical>5</Radical></span> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Radical>45</Radical> ＝ <Radical>9 · 5</Radical> ＝ 3 · <Radical>5</Radical>,
          </span>
          <span>{locale === 'el' ? 'επομένως α ＝ 3.' : 'therefore a ＝ 3.'}</span>
        </span>
      )
    };
  },
  (locale) => {
    const distractorsList = ['2·√7', '49·√2', '14·√7', '14·√2', '7·√7'];
    return {
      title: locale === 'el' ? 'Εξαγωγή Παράγοντα από το √98' : 'Extracting Factor from √98',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποια είναι η απλούστερη μορφή του αριθμού <Radical>98</Radical>；</>
          ) : (
            <>What is the simplest form of <Radical>98</Radical>?</>
          )}
        </span>
      ),
      correct: '7·√2',
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      renderOption: (opt) => {
        if (opt === '7·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">7 · <Radical>2</Radical></span>;
        if (opt === '2·√7') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>7</Radical></span>;
        if (opt === '49·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">49 · <Radical>2</Radical></span>;
        if (opt === '14·√7') return <span className="inline-flex items-center whitespace-nowrap gap-1">14 · <Radical>7</Radical></span>;
        if (opt === '14·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">14 · <Radical>2</Radical></span>;
        if (opt === '7·√7') return <span className="inline-flex items-center whitespace-nowrap gap-1">7 · <Radical>7</Radical></span>;
        return opt;
      },
      tableData: [
        { label: locale === 'el' ? 'Ανάλυση' : 'Decomposition', details: <span className="inline-flex items-center whitespace-nowrap">98 ＝ 49 · 2</span> },
        { label: locale === 'el' ? 'Μορφή' : 'Form', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>98</Radical> ＝ <Radical>49</Radical> · <Radical>2</Radical> ＝ 7 · <Radical>2</Radical></span> }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          <Radical>98</Radical> ＝ <Radical>49 · 2</Radical> ＝ 7 · <Radical>2</Radical>.
        </span>
      )
    };
  }
];

const PROBLEM_POOL_Q11 = [
  (locale) => {
    const distractorsList = ['3/√3', '1/3', '√3/9', '3/9', '1/√3'];
    return {
      title: locale === 'el' ? 'Ρητοποίηση Παρονομαστή με √3' : 'Rationalizing Denominator with √3',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Μετατρέποντας το κλάσμα <Frac num="1" den={<Radical>3</Radical>} /> σε ισοδύναμο με ρητό παρονομαστή, ποιο αποτέλεσμα προκύπτει；</>
          ) : (
            <>Transforming <Frac num="1" den={<Radical>3</Radical>} /> into an equivalent fraction with a rational denominator gives:</>
          )}
        </span>
      ),
      correct: '√3/3',
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      renderOption: (opt) => {
        if (opt === '√3/3') return <Frac num={<Radical>3</Radical>} den="3" />;
        if (opt === '3/√3') return <Frac num="3" den={<Radical>3</Radical>} />;
        if (opt === '1/3') return <Frac num="1" den="3" />;
        if (opt === '√3/9') return <Frac num={<Radical>3</Radical>} den="9" />;
        if (opt === '3/9') return <Frac num="3" den="9" />;
        if (opt === '1/√3') return <Frac num="1" den={<Radical>3</Radical>} />;
        return opt;
      },
      tableData: [
        { 
          label: locale === 'el' ? 'Πολλαπλασιασμός με √3' : 'Multiplication by √3', 
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">1 · <Radical>3</Radical></span>} den={<span className="inline-flex items-center gap-0.5 whitespace-nowrap"><Radical>3</Radical> · <Radical>3</Radical></span>} />
            </span>
          )
        },
        { 
          label: locale === 'el' ? 'Υπολογισμός παρονομαστή' : 'Denominator evaluation', 
          details: <span className="inline-flex items-center whitespace-nowrap">(<Radical>3</Radical>)<sup>2</sup> ＝ 3</span>
        },
        { 
          label: locale === 'el' ? 'Τελικό κλάσμα' : 'Final fraction', 
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <Frac num={<Radical>3</Radical>} den="3" />
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Πολλαπλασιάζουμε αριθμητή και παρονομαστή επί' : 'Multiply numerator and denominator by'}</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>3</Radical>:</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">1 · <Radical>3</Radical></span>} den="3" /> ＝ <Frac num={<Radical>3</Radical>} den="3" />.
          </span>
        </span>
      )
    };
  },
  (locale) => {
    return {
      title: locale === 'el' ? 'Ρητοποίηση και Απλοποίηση με √5' : 'Rationalization and Simplification with √5',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποιος είναι ο ακέραιος συντελεστής στην απλοποιημένη μορφή του κλάσματος <Frac num="10" den={<Radical>5</Radical>} /> (στη μορφή α · <Radical>5</Radical>)；</>
          ) : (
            <>What is the integer coefficient in simplified form of <Frac num="10" den={<Radical>5</Radical>} /> (as a · <Radical>5</Radical>)?</>
          )}
        </span>
      ),
      correct: 2,
      type: 'input',
      tableData: [
        { 
          label: locale === 'el' ? 'Ρητοποίηση' : 'Rationalization', 
          details: (
            <span className="inline-flex items-center whitespace-nowrap gap-1">
              <Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">10 · <Radical>5</Radical></span>} den={<span className="inline-flex items-center gap-0.5 whitespace-nowrap"><Radical>5</Radical> · <Radical>5</Radical></span>} /> ＝ <Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">10 · <Radical>5</Radical></span>} den="5" />
            </span>
          )
        },
        { 
          label: locale === 'el' ? 'Απλοποίηση' : 'Simplification', 
          details: <span className="inline-flex items-center whitespace-nowrap">10 : 5 ＝ 2</span>
        },
        { 
          label: locale === 'el' ? 'Αποτέλεσμα' : 'Result', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>5</Radical></span>
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">10 · <Radical>5</Radical></span>} den="5" /> ＝ 2 · <Radical>5</Radical>.
          </span>
        </span>
      )
    };
  },
  (locale) => {
    const distractorsList = ['7·√2', '2', '14·√7', '7·√7', '2·√2', '14'];
    return {
      title: locale === 'el' ? 'Ρητοποίηση με √7' : 'Rationalization with √7',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Πόσο ισούται η απλοποιημένη μορφή του κλάσματος <Frac num="14" den={<Radical>7</Radical>} />；</>
          ) : (
            <>What is the simplified form of the fraction <Frac num="14" den={<Radical>7</Radical>} />?</>
          )}
        </span>
      ),
      correct: '2·√7',
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      renderOption: (opt) => {
        if (opt === '2·√7') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>7</Radical></span>;
        if (opt === '7·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">7 · <Radical>2</Radical></span>;
        if (opt === '14·√7') return <span className="inline-flex items-center whitespace-nowrap gap-1">14 · <Radical>7</Radical></span>;
        if (opt === '7·√7') return <span className="inline-flex items-center whitespace-nowrap gap-1">7 · <Radical>7</Radical></span>;
        if (opt === '2·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>2</Radical></span>;
        return opt;
      },
      tableData: [
        { 
          label: locale === 'el' ? 'Ρητοποίηση' : 'Rationalization', 
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">14 · <Radical>7</Radical></span>} den="7" />
            </span>
          ) 
        },
        { 
          label: locale === 'el' ? 'Αποτέλεσμα' : 'Result', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>7</Radical></span> 
        }
      ],
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          <Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">14 · <Radical>7</Radical></span>} den="7" /> ＝ 2 · <Radical>7</Radical>.
        </span>
      )
    };
  },
  (locale) => {
    const distractorsList = ['3·√2', '2', '4', '4·√2', '√2'];
    return {
      title: locale === 'el' ? 'Άθροισμα Ακέραιης Ρίζας και Κλάσματος' : 'Sum of Radical and Fractional Radical',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Πόσο ισούται η παράσταση <Radical>2</Radical> ＋ <Frac num="2" den={<Radical>2</Radical>} />；</>
          ) : (
            <>What does <Radical>2</Radical> ＋ <Frac num="2" den={<Radical>2</Radical>} /> evaluate to?</>
          )}
        </span>
      ),
      correct: '2·√2',
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      renderOption: (opt) => {
        if (opt === '2·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>2</Radical></span>;
        if (opt === '3·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">3 · <Radical>2</Radical></span>;
        if (opt === '4·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">4 · <Radical>2</Radical></span>;
        if (opt === '√2') return <Radical>2</Radical>;
        return opt;
      },
      tableData: [
        { 
          label: locale === 'el' ? 'Ρητοποίηση 2ου όρου' : 'Rationalizing 2nd term', 
          details: (
            <span className="inline-flex items-center whitespace-nowrap gap-1">
              <Frac num="2" den={<Radical>2</Radical>} /> ＝ <Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">2 · <Radical>2</Radical></span>} den="2" /> ＝ <Radical>2</Radical>
            </span>
          )
        },
        { 
          label: locale === 'el' ? 'Πρόσθεση' : 'Addition', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>2</Radical> ＋ <Radical>2</Radical> ＝ 2 · <Radical>2</Radical></span>
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Το κλάσμα' : 'The fraction'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Frac num="2" den={<Radical>2</Radical>} /> {locale === 'el' ? 'ρητοποιείται σε' : 'rationalizes to'} <Radical>2</Radical>.
          </span>
          <span>{locale === 'el' ? 'Επομένως' : 'Therefore'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Radical>2</Radical> ＋ <Radical>2</Radical> ＝ 2 · <Radical>2</Radical>.
          </span>
        </span>
      )
    };
  },
  (locale) => {
    const distractorsList = ['√21', '3·√3', '2·√3', '4·√3', '√15'];
    return {
      title: locale === 'el' ? 'Διαφορά Ριζών με Εξαγωγή Παράγοντα' : 'Difference of Radicals with Factor Extraction',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποιο είναι το απλοποιημένο αποτέλεσμα της διαφοράς <Radical>48</Radical> － <Radical>27</Radical>；</>
          ) : (
            <>What is the simplified difference <Radical>48</Radical> － <Radical>27</Radical>?</>
          )}
        </span>
      ),
      correct: '√3',
      type: 'mcq',
      distractors: () => distractorsList[randInt(0, distractorsList.length - 1)],
      renderOption: (opt) => {
        if (opt === '√3') return <Radical>3</Radical>;
        if (opt === '√21') return <Radical>21</Radical>;
        if (opt === '3·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">3 · <Radical>3</Radical></span>;
        if (opt === '2·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>3</Radical></span>;
        if (opt === '4·√3') return <span className="inline-flex items-center whitespace-nowrap gap-1">4 · <Radical>3</Radical></span>;
        if (opt === '√15') return <Radical>15</Radical>;
        return opt;
      },
      tableData: [
        { label: locale === 'el' ? 'Ανάλυση √48' : 'Decomposition of √48', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>16 · 3</Radical> ＝ 4 · <Radical>3</Radical></span> },
        { label: locale === 'el' ? 'Ανάλυση √27' : 'Decomposition of √27', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>9 · 3</Radical> ＝ 3 · <Radical>3</Radical></span> },
        { label: locale === 'el' ? 'Αφαίρεση' : 'Subtraction', details: <span className="inline-flex items-center whitespace-nowrap gap-1">4 · <Radical>3</Radical> － 3 · <Radical>3</Radical> ＝ 1 · <Radical>3</Radical> ＝ <Radical>3</Radical></span> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Radical>48</Radical> ＝ 4 · <Radical>3</Radical>
          </span>
          <span>{locale === 'el' ? 'και' : 'and'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Radical>27</Radical> ＝ 3 · <Radical>3</Radical>.
          </span>
          <span>{locale === 'el' ? 'Η διαφορά τους είναι' : 'Their difference is'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            (4 － 3) · <Radical>3</Radical> ＝ <Radical>3</Radical>.
          </span>
        </span>
      )
    };
  },
  (locale) => {
    return {
      title: locale === 'el' ? 'Άθροισμα Ριζών με Αναγωγή' : 'Sum of Radicals with Reduction',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποιος είναι ο συντελεστής του <Radical>2</Radical> στο άθροισμα <Radical>50</Radical> ＋ <Radical>18</Radical>；</>
          ) : (
            <>What is the coefficient of <Radical>2</Radical> in <Radical>50</Radical> ＋ <Radical>18</Radical>?</>
          )}
        </span>
      ),
      correct: 8,
      type: 'input',
      tableData: [
        { label: locale === 'el' ? 'Ανάλυση √50' : 'Decomposition of √50', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>25 · 2</Radical> ＝ 5 · <Radical>2</Radical></span> },
        { label: locale === 'el' ? 'Ανάλυση √18' : 'Decomposition of √18', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>9 · 2</Radical> ＝ 3 · <Radical>2</Radical></span> },
        { label: locale === 'el' ? 'Άθροισμα' : 'Sum', details: <span className="inline-flex items-center whitespace-nowrap gap-1">5 · <Radical>2</Radical> ＋ 3 · <Radical>2</Radical> ＝ 8 · <Radical>2</Radical></span> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Radical>50</Radical> ＝ 5 · <Radical>2</Radical>, <Radical>18</Radical> ＝ 3 · <Radical>2</Radical>.
          </span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            5 · <Radical>2</Radical> ＋ 3 · <Radical>2</Radical> ＝ 8 · <Radical>2</Radical>.
          </span>
        </span>
      )
    };
  }
];

const PROBLEM_POOL_Q12 = [
  (locale) => {
    return {
      title: locale === 'el' ? 'Εμβαδόν Ορθογωνίου με Ριζικές Διαστάσεις' : 'Rectangle Area with Radical Dimensions',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένα ορθογώνιο έχει μήκος L ＝ <Radical>27</Radical> m και πλάτος W ＝ <Radical>3</Radical> m. Πόσο είναι το εμβαδόν του σε m<sup>2</sup>；</>
          ) : (
            <>A rectangle has length L ＝ <Radical>27</Radical> m and width W ＝ <Radical>3</Radical> m. What is its area in m<sup>2</sup>?</>
          )}
        </span>
      ),
      correct: 9,
      type: 'input',
      unit: locale === 'el' ? 'm²' : 'm²',
      tableData: [
        { label: locale === 'el' ? 'Τύπος εμβαδού' : 'Area formula', details: <span className="inline-flex items-center whitespace-nowrap">{locale === 'el' ? 'Ε ＝ L · W' : 'A ＝ L · W'}</span> },
        { label: locale === 'el' ? 'Γινόμενο ριζών' : 'Product of roots', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>27</Radical> · <Radical>3</Radical> ＝ <Radical>27 · 3</Radical> ＝ <Radical>81</Radical></span> },
        { label: locale === 'el' ? 'Τελική τιμή' : 'Final value', details: <span className="inline-flex items-center whitespace-nowrap">9 m<sup>2</sup></span> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            {locale === 'el' ? 'Ε' : 'A'} ＝ <Radical>27</Radical> · <Radical>3</Radical> ＝ <Radical>27 · 3</Radical> ＝ <Radical>81</Radical> ＝ 9 m<sup>2</sup>.
          </span>
        </span>
      )
    };
  },
  (locale) => {
    return {
      title: locale === 'el' ? 'Περίμετρος Τετραγώνου από Εμβαδόν' : 'Square Perimeter from Area',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένα τετράγωνο έχει εμβαδόν 72 cm<sup>2</sup>. Ποιος είναι ο συντελεστής του <Radical>2</Radical> στην περίμετρό του Π ＝ α · <Radical>2</Radical> cm；</>
          ) : (
            <>A square has area 72 cm<sup>2</sup>. What is the coefficient of <Radical>2</Radical> in its perimeter P ＝ a · <Radical>2</Radical> cm?</>
          )}
        </span>
      ),
      correct: 24,
      type: 'input',
      tableData: [
        { 
          label: locale === 'el' ? 'Μήκος πλευράς s' : 'Side length s', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">s ＝ <Radical>72</Radical> ＝ <Radical>36 · 2</Radical> ＝ 6 · <Radical>2</Radical> cm</span>
        },
        { 
          label: locale === 'el' ? 'Περίμετρος' : 'Perimeter', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">4 · s ＝ 4 · (6 · <Radical>2</Radical>) ＝ 24 · <Radical>2</Radical> cm</span>
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            {locale === 'el' ? 'Η πλευρά είναι' : 'Side'} s ＝ <Radical>72</Radical> ＝ 6 · <Radical>2</Radical> cm.
          </span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            {locale === 'el' ? 'Η περίμετρος είναι' : 'Perimeter is'} 4 · (6 · <Radical>2</Radical>) ＝ 24 · <Radical>2</Radical> cm.
          </span>
          <span>{locale === 'el' ? 'Ο συντελεστής είναι 24.' : 'Coefficient is 24.'}</span>
        </span>
      )
    };
  },
  (locale) => {
    return {
      title: locale === 'el' ? 'Διαγώνιος Ορθογωνίου με Ριζική Πλευρά' : 'Rectangle Diagonal with Radical Side',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ορθογώνιο παραλληλόγραμμο έχει πλευρές μήκους <Radical>12</Radical> cm και 2 cm. Πόσο είναι το μήκος της διαγωνίου του σε cm；</>
          ) : (
            <>A rectangle has side lengths <Radical>12</Radical> cm and 2 cm. What is its diagonal length in cm?</>
          )}
        </span>
      ),
      correct: 4,
      type: 'input',
      unit: 'cm',
      tableData: [
        { 
          label: locale === 'el' ? 'Πυθαγόρειο Θεώρημα' : 'Pythagorean Theorem', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">d<sup>2</sup> ＝ (<Radical>12</Radical>)<sup>2</sup> ＋ 2<sup>2</sup></span>
        },
        { 
          label: locale === 'el' ? 'Υπολογισμός τετραγώνων' : 'Squares evaluation', 
          details: <span className="inline-flex items-center whitespace-nowrap">d<sup>2</sup> ＝ 12 ＋ 4 ＝ 16</span>
        },
        { 
          label: locale === 'el' ? 'Διαγώνιος d' : 'Diagonal d', 
          details: <span className="inline-flex items-center whitespace-nowrap gap-1">d ＝ <Radical>16</Radical> ＝ 4 cm</span>
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            d<sup>2</sup> ＝ (<Radical>12</Radical>)<sup>2</sup> ＋ 2<sup>2</sup> ＝ 12 ＋ 4 ＝ 16 ⇒ d ＝ <Radical>16</Radical> ＝ 4 cm.
          </span>
        </span>
      )
    };
  },
  (locale) => {
    return {
      title: locale === 'el' ? 'Λόγος Εμβαδών Τετραγώνων' : 'Ratio of Square Areas',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Δύο τετράγωνα έχουν πλευρές μήκους <Radical>8</Radical> cm και <Radical>2</Radical> cm αντίστοιχα. Πόσες φορές μεγαλύτερο είναι το εμβαδόν του πρώτου τετραγώνου；</>
          ) : (
            <>Two squares have side lengths <Radical>8</Radical> cm and <Radical>2</Radical> cm. How many times larger is the first square\'s area?</>
          )}
        </span>
      ),
      correct: 4,
      type: 'input',
      unit: locale === 'el' ? 'φορές' : 'times',
      tableData: [
        { label: locale === 'el' ? 'Εμβαδόν 1ου (Ε₁)' : 'Area 1 (A₁)', details: <span className="inline-flex items-center whitespace-nowrap gap-1">(<Radical>8</Radical>)<sup>2</sup> ＝ 8 cm<sup>2</sup></span> },
        { label: locale === 'el' ? 'Εμβαδόν 2ου (Ε₂)' : 'Area 2 (A₂)', details: <span className="inline-flex items-center whitespace-nowrap gap-1">(<Radical>2</Radical>)<sup>2</sup> ＝ 2 cm<sup>2</sup></span> },
        { label: locale === 'el' ? 'Λόγος' : 'Ratio', details: <span className="inline-flex items-center whitespace-nowrap">8 : 2 ＝ 4</span> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            {locale === 'el' ? 'Ε₁' : 'A₁'} ＝ (<Radical>8</Radical>)<sup>2</sup> ＝ 8 {locale === 'el' ? 'και' : 'and'} {locale === 'el' ? 'Ε₂' : 'A₂'} ＝ (<Radical>2</Radical>)<sup>2</sup> ＝ 2.
          </span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            {locale === 'el' ? 'Ο λόγος τους είναι 8 : 2 ＝ 4 φορές.' : 'Ratio is 8 : 2 ＝ 4.'}
          </span>
        </span>
      )
    };
  },
  (locale) => {
    return {
      title: locale === 'el' ? 'Υποτείνουσα Ισοσκελούς Ορθογωνίου Τριγώνου' : 'Hypotenuse of Isosceles Right Triangle',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ισοσκελές ορθογώνιο τρίγωνο έχει κάθετες πλευρές μήκους <Radical>18</Radical> m η καθεμία. Πόσο είναι το μήκος της υποτείνουσάς του σε μέτρα；</>
          ) : (
            <>An isosceles right triangle has legs of length <Radical>18</Radical> m each. What is its hypotenuse length in meters?</>
          )}
        </span>
      ),
      correct: 6,
      type: 'input',
      unit: 'm',
      tableData: [
        { label: locale === 'el' ? 'Πυθαγόρειο c²' : 'Pythagorean c²', details: <span className="inline-flex items-center whitespace-nowrap gap-1">(<Radical>18</Radical>)<sup>2</sup> ＋ (<Radical>18</Radical>)<sup>2</sup> ＝ 18 ＋ 18 ＝ 36</span> },
        { label: locale === 'el' ? 'Υποτείνουσα c' : 'Hypotenuse c', details: <span className="inline-flex items-center whitespace-nowrap gap-1">c ＝ <Radical>36</Radical> ＝ 6 m</span> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            c<sup>2</sup> ＝ 18 ＋ 18 ＝ 36 ⇒ c ＝ <Radical>36</Radical> ＝ 6 m.
          </span>
        </span>
      )
    };
  },
  (locale) => {
    return {
      title: locale === 'el' ? 'Εμβαδόν Ρόμβου με Ριζικές Διαγωνίους' : 'Rhombus Area with Radical Diagonals',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ένας ρόμβος έχει διαγωνίους μήκους d₁ ＝ <Radical>20</Radical> cm και d₂ ＝ <Radical>5</Radical> cm. Πόσο είναι το εμβαδόν του σε cm<sup>2</sup>；</>
          ) : (
            <>A rhombus has diagonals d₁ ＝ <Radical>20</Radical> cm and d₂ ＝ <Radical>5</Radical> cm. What is its area in cm<sup>2</sup>?</>
          )}
        </span>
      ),
      correct: 5,
      type: 'input',
      unit: locale === 'el' ? 'cm²' : 'cm²',
      tableData: [
        { label: locale === 'el' ? 'Τύπος εμβαδού ρόμβου' : 'Rhombus area formula', details: <span className="inline-flex items-center whitespace-nowrap">{locale === 'el' ? 'Ε ＝ (d₁ · d₂) : 2' : 'A ＝ (d₁ · d₂) : 2'}</span> },
        { label: locale === 'el' ? 'Γινόμενο διαγωνίων' : 'Product of diagonals', details: <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>20</Radical> · <Radical>5</Radical> ＝ <Radical>100</Radical> ＝ 10</span> },
        { label: locale === 'el' ? 'Υπολογισμός' : 'Evaluation', details: <span className="inline-flex items-center whitespace-nowrap">10 : 2 ＝ 5 cm<sup>2</sup></span> }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            {locale === 'el' ? 'Ε' : 'A'} ＝ (<Radical>20</Radical> · <Radical>5</Radical>) : 2 ＝ <Radical>100</Radical> : 2 ＝ 10 : 2 ＝ 5 cm<sup>2</sup>.
          </span>
        </span>
      )
    };
  }
];

export default function IdiotitesRizonExercises() {
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
    const charA = locale === 'el' ? 'α' : 'a';
    const charB = locale === 'el' ? 'β' : 'b';

    qList.push({
      id: 1,
      title: locale === 'el' ? 'Ρίζα Αθροίσματος' : 'Square Root of Sum',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            q1IsCorrect ? (
              <>
                Για θετικούς αριθμούς {charA} και {charB}, η ισότητα{' '}
                <span className="inline-flex items-center whitespace-nowrap gap-1">
                  <Radical>{charA} ＋ {charB}</Radical> ＝ <Radical>{charA}</Radical> ＋ <Radical>{charB}</Radical>
                </span>{' '}
                ΔΕΝ ισχύει γενικά (είναι λάθος).
              </>
            ) : (
              <>
                Για οποιουσδήποτε θετικούς αριθμούς {charA} και {charB}, ισχύει πάντοτε ότι{' '}
                <span className="inline-flex items-center whitespace-nowrap gap-1">
                  <Radical>{charA} ＋ {charB}</Radical> ＝ <Radical>{charA}</Radical> ＋ <Radical>{charB}</Radical>
                </span>.
              </>
            )
          ) : (
            q1IsCorrect ? (
              <>
                For positive numbers {charA} and {charB}, the statement{' '}
                <span className="inline-flex items-center whitespace-nowrap gap-1">
                  <Radical>{charA} ＋ {charB}</Radical> ＝ <Radical>{charA}</Radical> ＋ <Radical>{charB}</Radical>
                </span>{' '}
                does NOT hold in general (is false).
              </>
            ) : (
              <>
                For any positive numbers {charA} and {charB}, it always holds that{' '}
                <span className="inline-flex items-center whitespace-nowrap gap-1">
                  <Radical>{charA} ＋ {charB}</Radical> ＝ <Radical>{charA}</Radical> ＋ <Radical>{charB}</Radical>
                </span>.
              </>
            )
          )}
        </span>
      ),
      type: 'tf',
      correct: q1IsCorrect ? t.trueLabel : t.falseLabel,
      options: [t.trueLabel, t.falseLabel],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>
            {locale === 'el'
              ? 'Η τετραγωνική ρίζα επιμερίζεται ΜΟΝΟ στο γινόμενο και στο πηλίκο, ποτέ στο άθροισμα'
              : 'Square roots distribute ONLY over multiplication and division, never addition'}
          </span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            [{locale === 'el' ? 'π.χ.' : 'e.g.,'} <Radical>16 ＋ 9</Radical> ＝ 5 ≠ 4 ＋ 3 ＝ 7].
          </span>
        </span>
      )
    });

    // Q2: True / False
    const q2Choice = Math.random() < 0.5;
    const charA2 = locale === 'el' ? 'α' : 'a';

    qList.push({
      id: 2,
      title: locale === 'el' ? 'Ρίζα Τετραγώνου Αριθμού' : 'Square Root of a Square',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            q2Choice ? (
              <>
                Για κάθε πραγματικό αριθμό {charA2}, ισχύει πάντοτε{' '}
                <span className="inline-flex items-center whitespace-nowrap gap-1">
                  <Radical>{charA2}<sup>2</sup></Radical> ＝ |{charA2}|
                </span>.
              </>
            ) : (
              <>
                Για κάθε πραγματικό αριθμό {charA2}, ισχύει πάντοτε{' '}
                <span className="inline-flex items-center whitespace-nowrap gap-1">
                  <Radical>{charA2}<sup>2</sup></Radical> ＝ {charA2}
                </span>, ακόμα κι αν ο {charA2} είναι αρνητικός.
              </>
            )
          ) : (
            q2Choice ? (
              <>
                For any real number {charA2}, it always holds that{' '}
                <span className="inline-flex items-center whitespace-nowrap gap-1">
                  <Radical>{charA2}<sup>2</sup></Radical> ＝ |{charA2}|
                </span>.
              </>
            ) : (
              <>
                For any real number {charA2}, it always holds that{' '}
                <span className="inline-flex items-center whitespace-nowrap gap-1">
                  <Radical>{charA2}<sup>2</sup></Radical> ＝ {charA2}
                </span>, even when {charA2} is negative.
              </>
            )
          )}
        </span>
      ),
      type: 'tf',
      correct: q2Choice ? t.trueLabel : t.falseLabel,
      options: [t.trueLabel, t.falseLabel],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>
            {locale === 'el'
              ? 'Επειδή η τετραγωνική ρίζα είναι εξ ορισμού μη αρνητικός αριθμός, ισχύει'
              : 'Since square roots are non-negative by definition,'}
          </span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Radical>{charA2}<sup>2</sup></Radical> ＝ |{charA2}|
          </span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            [{locale === 'el' ? 'π.χ.' : 'e.g.,'} <Radical>(－5)<sup>2</sup></Radical> ＝ |－5| ＝ 5].
          </span>
        </span>
      )
    });

    // Q3: MCQ
    const q3Distractors = ['－7', '±7', '49', '－49', '14'];
    qList.push({
      id: 3,
      title: locale === 'el' ? 'Υπολογισμός Ρίζας Τετραγώνου Αρνητικού' : 'Root of Negative Square',
      prompt: (
        <span className="inline-flex items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Πόσο ισούται η τιμή της παράστασης <Radical>(－7)<sup>2</sup></Radical>；</>
          ) : (
            <>What is the value of <Radical>(－7)<sup>2</sup></Radical>?</>
          )}
        </span>
      ),
      type: 'mcq',
      correct: '7',
      options: ensureFourUniqueOptions('7', () => q3Distractors[randInt(0, q3Distractors.length - 1)]),
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          <Radical>(－7)<sup>2</sup></Radical> ＝ |－7| ＝ 7.
        </span>
      )
    });

    // Q4: MCQ
    const q4Distractors = [
      '√α ＋ √β ＝ √(α ＋ β)',
      '√α · √β ＝ α · β',
      '√(α · β) ＝ α · √β',
      '√α · √β ＝ √(α ＋ β)',
      '√α · √β ＝ (α · β)²'
    ];
    qList.push({
      id: 4,
      title: locale === 'el' ? 'Ιδιότητα Γινομένου Ριζών' : 'Product Rule of Radicals',
      prompt: locale === 'el'
        ? 'Για μη αρνητικούς αριθμούς α, β, ποια από τις παρακάτω σχέσεις είναι πάντοτε αληθής;'
        : 'For non-negative numbers a, b, which of the following relations is always true?',
      type: 'mcq',
      correct: '√α · √β ＝ √(α · β)',
      options: ensureFourUniqueOptions('√α · √β ＝ √(α · β)', () => q4Distractors[randInt(0, q4Distractors.length - 1)]),
      renderOption: (opt) => {
        const charA = locale === 'el' ? 'α' : 'a';
        const charB = locale === 'el' ? 'β' : 'b';
        if (opt === '√α · √β ＝ √(α · β)') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>{charA}</Radical> · <Radical>{charB}</Radical> ＝ <Radical>{charA} · {charB}</Radical></span>;
        if (opt === '√α ＋ √β ＝ √(α ＋ β)') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>{charA}</Radical> ＋ <Radical>{charB}</Radical> ＝ <Radical>{charA} ＋ {charB}</Radical></span>;
        if (opt === '√α · √β ＝ α · β') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>{charA}</Radical> · <Radical>{charB}</Radical> ＝ {charA} · {charB}</span>;
        if (opt === '√(α · β) ＝ α · √β') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>{charA} · {charB}</Radical> ＝ {charA} · <Radical>{charB}</Radical></span>;
        if (opt === '√α · √β ＝ √(α ＋ β)') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>{charA}</Radical> · <Radical>{charB}</Radical> ＝ <Radical>{charA} ＋ {charB}</Radical></span>;
        if (opt === '√α · √β ＝ (α · β)²') return <span className="inline-flex items-center whitespace-nowrap gap-1"><Radical>{charA}</Radical> · <Radical>{charB}</Radical> ＝ ({charA} · {charB})<sup>2</sup></span>;
        return opt;
      },
      explanation: locale === 'el'
        ? 'Το γινόμενο των τετραγωνικών ριζών ισούται με την τετραγωνική ρίζα του γινομένου.'
        : 'The product of square roots equals the square root of the product.'
    });

    // Q5: Input
    qList.push({
      id: 5,
      title: locale === 'el' ? 'Υπολογισμός Απλού Γινομένου Ριζών' : 'Simple Radical Product',
      prompt: (
        <span className="inline-flex items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Πόσο ισούται το γινόμενο <Radical>2</Radical> · <Radical>8</Radical>；</>
          ) : (
            <>What does <Radical>2</Radical> · <Radical>8</Radical> equal?</>
          )}
        </span>
      ),
      type: 'input',
      correct: 4,
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          <Radical>2</Radical> · <Radical>8</Radical> ＝ <Radical>2 · 8</Radical> ＝ <Radical>16</Radical> ＝ 4.
        </span>
      )
    });

    // Q6: MCQ
    const q6Distractors = ['4·√5', '5·√2', '10·√2', '2·√10', '4·√2'];
    qList.push({
      id: 6,
      title: locale === 'el' ? 'Απλοποίηση Ρίζας √20' : 'Simplifying √20',
      prompt: (
        <span className="inline-flex items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Ποια είναι η απλοποιημένη μορφή του αριθμού <Radical>20</Radical>；</>
          ) : (
            <>What is the simplified form of <Radical>20</Radical>?</>
          )}
        </span>
      ),
      type: 'mcq',
      correct: '2·√5',
      options: ensureFourUniqueOptions('2·√5', () => q6Distractors[randInt(0, q6Distractors.length - 1)]),
      renderOption: (opt) => {
        if (opt === '2·√5') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>5</Radical></span>;
        if (opt === '4·√5') return <span className="inline-flex items-center whitespace-nowrap gap-1">4 · <Radical>5</Radical></span>;
        if (opt === '5·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">5 · <Radical>2</Radical></span>;
        if (opt === '10·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">10 · <Radical>2</Radical></span>;
        if (opt === '2·√10') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>10</Radical></span>;
        if (opt === '4·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">4 · <Radical>2</Radical></span>;
        return opt;
      },
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          <Radical>20</Radical> ＝ <Radical>4 · 5</Radical> ＝ <Radical>4</Radical> · <Radical>5</Radical> ＝ 2 · <Radical>5</Radical>.
        </span>
      )
    });

    // Q7: Input
    qList.push({
      id: 7,
      title: locale === 'el' ? 'Υπολογισμός Πηλίκου Ριζών' : 'Quotient of Radicals',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Πόσο ισούται η τιμή του πηλίκου <Frac num={<Radical>50</Radical>} den={<Radical>2</Radical>} />；</>
          ) : (
            <>What is the quotient <Frac num={<Radical>50</Radical>} den={<Radical>2</Radical>} />?</>
          )}
        </span>
      ),
      type: 'input',
      correct: 5,
      explanation: (
        <span className="inline-flex items-center whitespace-nowrap gap-1">
          <Frac num={<Radical>50</Radical>} den={<Radical>2</Radical>} /> ＝ <Radical><Frac num="50" den="2" /></Radical> ＝ <Radical>25</Radical> ＝ 5.
        </span>
      )
    });

    // Q8: MCQ
    const q8Distractors = ['1', '2', '2·√2', '4', '1/2'];
    qList.push({
      id: 8,
      title: locale === 'el' ? 'Ρητοποίηση Παρονομαστή' : 'Denominator Rationalization',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          {locale === 'el' ? (
            <>Σε ποιον αριθμό απλοποιείται το κλάσμα <Frac num="2" den={<Radical>2</Radical>} />；</>
          ) : (
            <>Which number is <Frac num="2" den={<Radical>2</Radical>} /> simplified to?</>
          )}
        </span>
      ),
      type: 'mcq',
      correct: '√2',
      options: ensureFourUniqueOptions('√2', () => q8Distractors[randInt(0, q8Distractors.length - 1)]),
      renderOption: (opt) => {
        if (opt === '√2') return <Radical>2</Radical>;
        if (opt === '2·√2') return <span className="inline-flex items-center whitespace-nowrap gap-1">2 · <Radical>2</Radical></span>;
        if (opt === '1/2') return <Frac num="1" den="2" />;
        return opt;
      },
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed">
          <span>{locale === 'el' ? 'Πολλαπλασιάζουμε αριθμητή και παρονομαστή με' : 'Multiply numerator and denominator by'}</span>
          <span className="inline-flex items-center whitespace-nowrap gap-1">
            <Radical>2</Radical>: <Frac num={<span className="inline-flex items-center gap-0.5 whitespace-nowrap">2 · <Radical>2</Radical></span>} den="2" /> ＝ <Radical>2</Radical>.
          </span>
        </span>
      )
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
    let sanitized = val.replace('.', ',').replace(/[^0-9,]/g, '');
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
      backUrl="/g-gymnasiou/06-idiotites-rizon"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/06-idiotites-rizon"
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
          <section className="p-5 sm:p-8 bg-white border-2 border-indigo-200 rounded-2xl sm:rounded-3xl shadow-lg mb-6 sm:mb-8 text-center">
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
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 space-y-3">
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
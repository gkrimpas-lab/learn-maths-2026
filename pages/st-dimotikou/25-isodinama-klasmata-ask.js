// pages/st-dimotikou/25-isodinama-klasmata-ask.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ & DEFENSIVE CHECKS
// ---------------------------------------------------------

function randInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function shuffle(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function gcd(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Αυστηρή συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Μορφοποίηση αριθμών βάσει locale
function formatNum(num, locale = 'el') {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  return Number(num).toLocaleString(loc);
}

// Helper για ασφαλή κατακόρυφη απόδοση κλασμάτων σε string μορφή
export const renderFraction = (num, den) =>
  `<span class="inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">` +
  `<span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${num}</span>` +
  `<span class="pt-0.5 break-all">${den}</span>` +
  `</span>`;

// Component για κανονική κατακόρυφη μορφή κλάσματος (JSX)
export function Fraction({ num, den, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: { numDen: 'text-xs sm:text-sm font-bold', line: 'w-full h-0.5' },
    md: { numDen: 'text-sm sm:text-base font-black', line: 'w-full h-0.5' },
    lg: { numDen: 'text-lg sm:text-xl font-black', line: 'w-full h-1' }
  };

  const selected = sizeClasses[size] || sizeClasses.md;

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle font-mono leading-none px-1 shrink-0 max-w-full ${className}`}>
      <span className={`${selected.numDen} pb-0.5 break-all text-center`}>{num}</span>
      <span className={`${selected.line} bg-current rounded-full my-0.5 min-w-[12px]`} />
      <span className={`${selected.numDen} pt-0.5 break-all text-center`}>{den}</span>
    </span>
  );
}

// Εγγύηση 4 μοναδικών επιλογών για MCQ (αντικείμενα με val & render)
function buildFourOptions(correctObj, distractorObjs, fallbackFn) {
  const uniqueKeys = new Set();
  const result = [];

  if (correctObj && correctObj.val !== undefined && correctObj.val !== null) {
    uniqueKeys.add(String(correctObj.val));
    result.push(correctObj);
  }

  for (const item of distractorObjs) {
    if (item && item.val !== undefined && item.val !== null) {
      const key = String(item.val);
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        result.push(item);
      }
    }
    if (result.length === 4) break;
  }

  let safety = 1;
  while (result.length < 4 && safety < 30) {
    const fallback = fallbackFn ? fallbackFn(safety) : { val: `Επιλογή ${safety}`, render: <span>Επιλογή {safety}</span> };
    if (fallback && fallback.val !== undefined && fallback.val !== null) {
      const key = String(fallback.val);
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        result.push(fallback);
      }
    }
    safety++;
  }

  return shuffle(result);
}

// ---------------------------------------------------------
// ΛΕΞΙΚΟ i18n
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Ισοδύναμα & Ανάγωγα Κλάσματα - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα ισοδύναμα και ανάγωγα κλάσματα για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 25 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Ισοδύναμα & Ανάγωγα Κλάσματα",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη δημιουργία ισοδύναμων, στην απλοποίηση με Μ.Κ.Δ. και στον εντοπισμό αναγώγων κλασμάτων!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "π.χ. 3/4",
    tableHeaderElement: "Στοιχείο",
    tableHeaderFormula: "Ανάλυση / Τύπος",
    tableHeaderValue: "Τιμή",
    feedbackSuccess: "🎯 Εξαιρετικά!",
    feedbackReview: "💡 Επεξήγηση:",
    checkBtn: "Έλεγχος Απαντήσεων",
    scoreBadge: "Σκορ",
    answeredBadge: "Απαντήθηκαν",
    percentage: "Ποσοστό",
    bottomHint: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!",
    gcdLabel: "Μ.Κ.Δ."
  },
  en: {
    pageTitle: "Exercises: Equivalent & Irreducible Fractions - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on equivalent and irreducible fractions for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 25 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Equivalent & Irreducible Fractions",
    desc: "Solve the 10 dynamic problems to practice generating equivalent fractions, simplifying with GCD, and identifying irreducible fractions!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "e.g. 3/4",
    tableHeaderElement: "Element",
    tableHeaderFormula: "Formula / Step",
    tableHeaderValue: "Value",
    feedbackSuccess: "🎯 Excellent!",
    feedbackReview: "💡 Explanation:",
    checkBtn: "Check Answers",
    scoreBadge: "Score",
    answeredBadge: "Answered",
    percentage: "Percentage",
    bottomHint: "Answer all 10 questions and press 'Check Answers'!",
    gcdLabel: "GCD"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    generate: (locale) => {
      const origN = 4;
      const origD = 8;
      const redN = 1;
      const redD = 2;
      const correctText = `${redN}/${redD}`;
      const correctObj = { val: correctText, render: <Fraction num={redN} den={redD} size="md" /> };
      const distractorObjs = [
        { val: '3/4', render: <Fraction num="3" den="4" size="md" /> },
        { val: `${redN}/4`, render: <Fraction num={redN} den="4" size="md" /> },
        { val: '2/3', render: <Fraction num="2" den="3" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Pizza Sharing in a Group' : 'Μοίρασμα Πίτσας σε Παρέα',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'At a party, friends consumed' : 'Σε ένα πάρτι καταναλώθηκαν τα'}</span>
            <Fraction num={origN} den={origD} size="sm" />
            <span>
              {locale === 'en'
                ? 'of a large pizza. What is the simplest (irreducible) fraction representing the amount eaten?'
                : 'μιας μεγάλης πίτσας. Ποιο είναι το απλούστερο (ανάγωγο) κλάσμα που εκφράζει την ποσότητα πίτσας που φαγώθηκε;'}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Original fraction' : 'Αρχικό κλάσμα',
            formula: `${origN}/${origD}`,
            val: `${origN}/${origD}`
          },
          {
            item: `${locale === 'en' ? 'GCD' : 'Μ.Κ.Δ.'}(4, 8)`,
            formula: '4',
            val: '4'
          },
          {
            item: locale === 'en' ? 'Irreducible fraction' : 'Ανάγωγο κλάσμα',
            formula: `(${origN} : 4) / (${origD} : 4)`,
            val: `${redN}/${redD}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Divide both terms by 4 (GCD): `
              : `Διαιρούμε και τους δύο όρους με το 4 (Μ.Κ.Δ.): `}
            <Fraction num={redN} den={redD} size="sm" />
            {locale === 'en' ? ' (exactly half the pizza).' : ' (δηλαδή ακριβώς η μισή πίτσα).'}
          </span>
        )
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const origN = 6;
      const origD = 9;
      const redN = 2;
      const redD = 3;
      const correctText = `${redN}/${redD}`;
      const correctObj = { val: correctText, render: <Fraction num={redN} den={redD} size="md" /> };
      const distractorObjs = [
        { val: '1/3', render: <Fraction num="1" den="3" size="md" /> },
        { val: '3/4', render: <Fraction num="3" den="4" size="md" /> },
        { val: '2/5', render: <Fraction num="2" den="5" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Chocolate Squares' : 'Σοκολάτα σε Τετραγωνάκια',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Kostas shared' : 'Ο Κώστας μοίρασε τα'}</span>
            <Fraction num={origN} den={origD} size="sm" />
            <span>
              {locale === 'en'
                ? 'of a chocolate bar with his classmates. What is the equivalent irreducible fraction shared?'
                : 'μιας σοκολάτας στους συμμαθητές του. Ποιο είναι το ισοδύναμο ανάγωγο κλάσμα της σοκολάτας που μοιράστηκε;'}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Original fraction' : 'Αρχικό κλάσμα',
            formula: `${origN}/${origD}`,
            val: `${origN}/${origD}`
          },
          {
            item: `${locale === 'en' ? 'GCD' : 'Μ.Κ.Δ.'}(6, 9)`,
            formula: '3',
            val: '3'
          },
          {
            item: locale === 'en' ? 'Irreducible fraction' : 'Ανάγωγο κλάσμα',
            formula: `(${origN} : 3) / (${origD} : 3)`,
            val: `${redN}/${redD}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Simplify by dividing numerator and denominator by 3: `
              : `Απλοποιούμε διαιρώντας αριθμητή και παρονομαστή με το 3: `}
            <Fraction num={redN} den={redD} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const origN = 8;
      const origD = 12;
      const redN = 2;
      const redD = 3;
      const correctText = `${redN}/${redD}`;
      const correctObj = { val: correctText, render: <Fraction num={redN} den={redD} size="md" /> };
      const distractorObjs = [
        { val: '4/6', render: <Fraction num="4" den="6" size="md" /> },
        { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
        { val: '3/4', render: <Fraction num="3" den="4" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Book Chapters Read' : 'Σελίδες Βιβλίου',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Eleni finished' : 'Η Ελένη διάβασε τα'}</span>
            <Fraction num={origN} den={origD} size="sm" />
            <span>
              {locale === 'en'
                ? 'of a history book chapters. What is the simplest equivalent fraction for the chapters read?'
                : 'των κεφαλαίων ενός βιβλίου ιστορίας. Ποιο είναι το απλούστερο ισοδύναμο κλάσμα που δείχνει το μέρος των κεφαλαίων που διάβασε;'}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Original fraction' : 'Αρχικό κλάσμα',
            formula: `${origN}/${origD}`,
            val: `${origN}/${origD}`
          },
          {
            item: `${locale === 'en' ? 'GCD' : 'Μ.Κ.Δ.'}(8, 12)`,
            formula: '4',
            val: '4'
          },
          {
            item: locale === 'en' ? 'Irreducible fraction' : 'Ανάγωγο κλάσμα',
            formula: `(${origN} : 4) / (${origD} : 4)`,
            val: `${redN}/${redD}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Divide both terms by 4 (GCD): `
              : `Διαιρούμε και τους δύο όρους με το 4 (Μ.Κ.Δ.): `}
            <Fraction num={redN} den={redD} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const origN = 6;
      const origD = 10;
      const redN = 3;
      const redD = 5;
      const correctText = `${redN}/${redD}`;
      const correctObj = { val: correctText, render: <Fraction num={redN} den={redD} size="md" /> };
      const distractorObjs = [
        { val: '2/5', render: <Fraction num="2" den="5" size="md" /> },
        { val: '3/10', render: <Fraction num="3" den="10" size="md" /> },
        { val: '4/5', render: <Fraction num="4" den="5" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Flower Garden Area' : 'Κήπος με Λουλούδια',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'In a school garden, rose bushes were planted in' : 'Σε έναν σχολικό κήπο φυτεύτηκαν τριανταφυλλιές στα'}</span>
            <Fraction num={origN} den={origD} size="sm" />
            <span>
              {locale === 'en'
                ? 'of its total area. What irreducible fraction represents this planted area?'
                : 'της συνολικής του επιφάνειας. Ποιο ανάγωγο κλάσμα αντιπροσωπεύει αυτή την επιφάνεια;'}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Original fraction' : 'Αρχικό κλάσμα',
            formula: `${origN}/${origD}`,
            val: `${origN}/${origD}`
          },
          {
            item: `${locale === 'en' ? 'GCD' : 'Μ.Κ.Δ.'}(6, 10)`,
            formula: '2',
            val: '2'
          },
          {
            item: locale === 'en' ? 'Irreducible fraction' : 'Ανάγωγο κλάσμα',
            formula: `(${origN} : 2) / (${origD} : 2)`,
            val: `${redN}/${redD}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Simplify by dividing numerator and denominator by 2: `
              : `Απλοποιούμε με το 2: `}
            <Fraction num={redN} den={redD} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const origN = 9;
      const origD = 12;
      const redN = 3;
      const redD = 4;
      const correctText = `${redN}/${redD}`;
      const correctObj = { val: correctText, render: <Fraction num={redN} den={redD} size="md" /> };
      const distractorObjs = [
        { val: '2/3', render: <Fraction num="2" den="3" size="md" /> },
        { val: '3/6', render: <Fraction num="3" den="6" size="md" /> },
        { val: '1/4', render: <Fraction num="1" den="4" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Puzzle Pieces Completed' : 'Κομμάτια Παζλ',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Marios finished' : 'Ο Μάριος συμπλήρωσε τα'}</span>
            <Fraction num={origN} den={origD} size="sm" />
            <span>
              {locale === 'en'
                ? 'of a large jigsaw puzzle. What is the simplest equivalent fraction for the completed part?'
                : 'ενός μεγάλου παζλ. Ποιο είναι το απλούστερο ισοδύναμο κλάσμα για το μέρος του παζλ που ολοκληρώθηκε;'}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Original fraction' : 'Αρχικό κλάσμα',
            formula: `${origN}/${origD}`,
            val: `${origN}/${origD}`
          },
          {
            item: `${locale === 'en' ? 'GCD' : 'Μ.Κ.Δ.'}(9, 12)`,
            formula: '3',
            val: '3'
          },
          {
            item: locale === 'en' ? 'Irreducible fraction' : 'Ανάγωγο κλάσμα',
            formula: `(${origN} : 3) / (${origD} : 3)`,
            val: `${redN}/${redD}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Divide both terms by 3: `
              : `Διαιρούμε και τους δύο όρους με το 3: `}
            <Fraction num={redN} den={redD} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const origN = 4;
      const origD = 16;
      const redN = 1;
      const redD = 4;
      const correctText = `${redN}/${redD}`;
      const correctObj = { val: correctText, render: <Fraction num={redN} den={redD} size="md" /> };
      const distractorObjs = [
        { val: '2/8', render: <Fraction num="2" den="8" size="md" /> },
        { val: '1/8', render: <Fraction num="1" den="8" size="md" /> },
        { val: '1/2', render: <Fraction num="1" den="2" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Running Track Course' : 'Αθλητική Διαδρομή',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A runner covered' : 'Ένας δρομέας έχει καλύψει τα'}</span>
            <Fraction num={origN} den={origD} size="sm" />
            <span>
              {locale === 'en'
                ? 'of a race course. What is the irreducible fraction of the distance run?'
                : 'της συνολικής διαδρομής ενός αγώνα. Ποιο είναι το ανάγωγο κλάσμα της διαδρομής που διένυσε;'}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Original fraction' : 'Αρχικό κλάσμα',
            formula: `${origN}/${origD}`,
            val: `${origN}/${origD}`
          },
          {
            item: `${locale === 'en' ? 'GCD' : 'Μ.Κ.Δ.'}(4, 16)`,
            formula: '4',
            val: '4'
          },
          {
            item: locale === 'en' ? 'Irreducible fraction' : 'Ανάγωγο κλάσμα',
            formula: `(${origN} : 4) / (${origD} : 4)`,
            val: `${redN}/${redD}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Divide numerator and denominator by 4: `
              : `Διαιρούμε αριθμητή και παρονομαστή με το 4: `}
            <Fraction num={redN} den={redD} size="sm" />.
          </span>
        )
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    generate: (locale) => {
      const baseN = 3;
      const baseD = 5;
      const mult = 4;
      const targetN = baseN * mult;
      const targetD = baseD * mult;
      const correctText = String(targetN);
      const correctObj = { val: correctText, render: <span>{targetN}</span> };
      const distractorObjs = [targetN + 2, targetN - 2, targetN * 2].map(v => ({
        val: String(v),
        render: <span>{v}</span>
      }));
      return {
        title: locale === 'en' ? 'Scaling Fraction for Recipe' : 'Διεύρυνση Κλάσματος για Συνταγή',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'In a baking recipe we need' : 'Σε μία συνταγή ζαχαροπλαστικής χρειαζόμαστε'}</span>
            <Fraction num={baseN} den={baseD} size="sm" />
            <span>
              {locale === 'en'
                ? `kg of sugar. If we express it with a denominator of ${targetD}, what must the new numerator x be so that equivalence is preserved?`
                : `του κιλού ζάχαρη. Αν θέλουμε να εκφράσουμε το κλάσμα με παρονομαστή το ${targetD}, ποιος πρέπει να είναι ο νέος αριθμητής x ώστε να διατηρηθεί η ισοδυναμία;`}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Initial fraction' : 'Αρχικό κλάσμα',
            formula: `${baseN}/${baseD}`,
            val: `${baseN}/${baseD}`
          },
          {
            item: locale === 'en' ? 'Denominator multiplier' : 'Πολλαπλασιαστής παρονομαστή',
            formula: `${targetD} : ${baseD}`,
            val: `${mult}`
          },
          {
            item: locale === 'en' ? 'New numerator (x)' : 'Νέος αριθμητής (x)',
            formula: `${baseN} · ${mult}`,
            val: `${targetN}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `The denominator was multiplied by ${mult} (${baseD} · ${mult} ＝ ${targetD}). Multiply numerator by ${mult}: ${baseN} · ${mult} ＝ ${targetN}.`
              : `Ο παρονομαστής πολλαπλασιάστηκε επί ${mult} (${baseD} · ${mult} ＝ ${targetD}). Άρα: ${baseN} · ${mult} ＝ ${targetN}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const origN = 24;
      const origD = 36;
      const commonGcd = 12;
      const redN = 2;
      const redD = 3;
      const correctText = `${redN}/${redD}`;
      const correctObj = { val: correctText, render: <Fraction num={redN} den={redD} size="md" /> };
      const distractorObjs = [
        { val: '4/6', render: <Fraction num="4" den="6" size="md" /> },
        { val: '6/9', render: <Fraction num="6" den="9" size="md" /> },
        { val: '3/4', render: <Fraction num="3" den="4" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Simplifying with Large GCD' : 'Απλοποίηση με Μεγάλο Μ.Κ.Δ.',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A science lab logged success in' : 'Ένα σχολικό εργαστήριο κατέγραψε επιτυχία σε'}</span>
            <Fraction num={origN} den={origD} size="sm" />
            <span>
              {locale === 'en'
                ? 'trials. What is the irreducible fraction obtained when simplifying directly using the GCD?'
                : 'πειράματα. Ποιο είναι το απλούστερο ανάγωγο κλάσμα που προκύπτει αν απλοποιήσουμε άμεσα με τον Μ.Κ.Δ. των όρων;'}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Original fraction' : 'Αρχικό κλάσμα',
            formula: `${origN}/${origD}`,
            val: `${origN}/${origD}`
          },
          {
            item: `${locale === 'en' ? 'GCD' : 'Μ.Κ.Δ.'}(24, 36)`,
            formula: `${commonGcd}`,
            val: `${commonGcd}`
          },
          {
            item: locale === 'en' ? 'Irreducible fraction' : 'Ανάγωγο κλάσμα',
            formula: `(${origN} : ${commonGcd}) / (${origD} : ${commonGcd})`,
            val: `${redN}/${redD}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `GCD(24, 36) ＝ ${commonGcd}. Dividing both terms by ${commonGcd}: `
              : `Μ.Κ.Δ.(24, 36) ＝ ${commonGcd}. Διαιρώντας και τους δύο όρους με το ${commonGcd}: `}
            <Fraction num={redN} den={redD} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const n1 = 2;
      const d1 = 3;
      const n2 = 8;
      const d2 = 12;
      const n3 = 10;
      const d3 = 15;
      const correctMsg = locale === 'en'
        ? 'All three fractions are completely equivalent (A ＝ B ＝ C)'
        : 'Και τα τρία κλάσματα είναι απολύτως ισοδύναμα (Α ＝ Β ＝ Γ)';
      const correctObj = { val: correctMsg, render: <span>{correctMsg}</span> };
      const distractorObjs = [
        {
          val: locale === 'en' ? 'A expresses more than B and C' : 'Το Α εκφράζει μεγαλύτερη ποσότητα από τα Β και Γ',
          render: <span>{locale === 'en' ? 'A expresses more than B and C' : 'Το Α εκφράζει μεγαλύτερη ποσότητα από τα Β και Γ'}</span>
        },
        {
          val: locale === 'en' ? 'C is the largest of all' : 'Το Γ είναι το μεγαλύτερο από όλα',
          render: <span>{locale === 'en' ? 'C is the largest of all' : 'Το Γ είναι το μεγαλύτερο από όλα'}</span>
        },
        {
          val: locale === 'en' ? 'Only A and B are equivalent' : 'Μόνο τα Α και Β είναι ισοδύναμα',
          render: <span>{locale === 'en' ? 'Only A and B are equivalent' : 'Μόνο τα Α και Β είναι ισοδύναμα'}</span>
        }
      ];
      return {
        title: locale === 'en' ? 'Comparing Three Fluid Volumes' : 'Σύγκριση Ισοδύναμων Ποσοτήτων',
        prompt: (
          <span className="flex items-center gap-2 flex-wrap">
            <span>{locale === 'en' ? 'Given three tank level fractions:' : 'Δίνονται τρία κλάσματα δεξαμενών:'}</span>
            <span>A ＝ <Fraction num={n1} den={d1} size="sm" />,</span>
            <span>B ＝ <Fraction num={n2} den={d2} size="sm" />,</span>
            <span>C ＝ <Fraction num={n3} den={d3} size="sm" />.</span>
            <span>{locale === 'en' ? 'What is the relationship between them?' : 'Ποια είναι η σχέση μεταξύ των ποσοτήτων τους;'}</span>
          </span>
        ),
        correctText: correctMsg,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: `A (${n1}/${d1})`,
            formula: locale === 'en' ? 'Irreducible form' : 'Ανάγωγη μορφή',
            val: `${n1}/${d1}`
          },
          {
            item: `B (${n2}/${d2})`,
            formula: locale === 'en' ? 'Divide by 4' : 'Απλοποίηση με 4',
            val: `${n1}/${d1}`
          },
          {
            item: `C (${n3}/${d3})`,
            formula: locale === 'en' ? 'Divide by 5' : 'Απλοποίηση με 5',
            val: `${n1}/${d1}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? 'Reducing B by 4 and C by 5 gives 2/3 for both. Therefore, A ＝ B ＝ C.'
              : 'Απλοποιώντας το Β με το 4 και το Γ με το 5 παίρνουμε 2/3. Επομένως, Α ＝ Β ＝ Γ.'}
          </span>
        )
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const baseN = 4;
      const baseD = 7;
      const mult = 5;
      const targetN = baseN * mult;
      const targetD = baseD * mult;
      const correctText = String(targetD);
      const correctObj = { val: correctText, render: <span>{targetD}</span> };
      const distractorObjs = [targetD - 5, targetD + 7, targetD + 2].map(v => ({
        val: String(v),
        render: <span>{v}</span>
      }));
      return {
        title: locale === 'en' ? 'Finding Unknown Denominator' : 'Εύρεση Άγνωστου Παρονομαστή',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'In the equivalent fractions' : 'Στην ισότητα ισοδύναμων κλασμάτων'}</span>
            <Fraction num={baseN} den={baseD} size="sm" />
            <span>＝</span>
            <Fraction num={targetN} den="y" size="sm" />
            <span>{locale === 'en' ? ', what is the denominator y?' : ', ποιος είναι ο άγνωστος παρονομαστής y;'}</span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Initial fraction' : 'Αρχικό κλάσμα',
            formula: `${baseN}/${baseD}`,
            val: `${baseN}/${baseD}`
          },
          {
            item: locale === 'en' ? 'Numerator multiplier' : 'Πολλαπλασιαστής αριθμητή',
            formula: `${targetN} : ${baseN}`,
            val: `${mult}`
          },
          {
            item: locale === 'en' ? 'Unknown denominator (y)' : 'Άγνωστος παρονομαστής (y)',
            formula: `${baseD} · ${mult}`,
            val: `${targetD}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Numerator was multiplied by ${mult} (${baseN} · ${mult} ＝ ${targetN}). Multiply denominator by ${mult}: y ＝ ${baseD} · ${mult} ＝ ${targetD}.`
              : `Ο αριθμητής πολλαπλασιάστηκε επί ${mult} (${baseN} · ${mult} ＝ ${targetN}). Άρα: y ＝ ${baseD} · ${mult} ＝ ${targetD}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const origN = 30;
      const origD = 45;
      const commonGcd = 15;
      const redN = 2;
      const redD = 3;
      const correctText = `${redN}/${redD}`;
      const correctObj = { val: correctText, render: <Fraction num={redN} den={redD} size="md" /> };
      const distractorObjs = [
        { val: '6/9', render: <Fraction num="6" den="9" size="md" /> },
        { val: '10/15', render: <Fraction num="10" den="15" size="md" /> },
        { val: '3/5', render: <Fraction num="3" den="5" size="md" /> }
      ];
      return {
        title: locale === 'en' ? 'Step-by-Step Large Fraction Reduction' : 'Απλοποίηση Μεγάλου Κλάσματος (Βήμα-Βήμα)',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A jar contains' : 'Ένα δοχείο περιέχει'}</span>
            <Fraction num={origN} den={origD} size="sm" />
            <span>
              {locale === 'en'
                ? 'of a liter of olive oil. What irreducible fraction is obtained by simplifying using the GCD?'
                : 'του λίτρου λάδι. Ποιο είναι το ανάγωγο κλάσμα που προκύπτει αν απλοποιήσουμε το κλάσμα με τον Μ.Κ.Δ. των όρων του;'}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Original fraction' : 'Αρχικό κλάσμα',
            formula: `${origN}/${origD}`,
            val: `${origN}/${origD}`
          },
          {
            item: `${locale === 'en' ? 'GCD' : 'Μ.Κ.Δ.'}(30, 45)`,
            formula: `${commonGcd}`,
            val: `${commonGcd}`
          },
          {
            item: locale === 'en' ? 'Irreducible fraction' : 'Ανάγωγο κλάσμα',
            formula: `(${origN} : ${commonGcd}) / (${origD} : ${commonGcd})`,
            val: `${redN}/${redD}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `GCD(30, 45) ＝ 15. Divide both terms by 15: `
              : `Μ.Κ.Δ.(30, 45) ＝ 15. Διαιρούμε και τους δύο όρους με το 15: `}
            <Fraction num={redN} den={redD} size="sm" />.
          </span>
        )
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const properRed = { num: 11, den: 15 };
      const wr1 = { num: 12, den: 15 };
      const wr2 = { num: 10, den: 25 };
      const wr3 = { num: 14, den: 21 };
      const correctText = `${properRed.num}/${properRed.den}`;
      const correctObj = { val: correctText, render: <Fraction num={properRed.num} den={properRed.den} size="md" /> };
      const distractorObjs = [wr1, wr2, wr3].map(o => ({
        val: `${o.num}/${o.den}`,
        render: <Fraction num={o.num} den={o.den} size="md" />
      }));
      return {
        title: locale === 'en' ? 'Recognizing Irreducible Fractions' : 'Σύνθετος Έλεγχος Ανάγωγου',
        prompt: (
          <span>
            {locale === 'en'
              ? 'Which of the following fractions is already irreducible (cannot be simplified further)?'
              : 'Ποιο από τα παρακάτω κλάσματα είναι ήδη ανάγωγο (δεν μπορεί να διαιρεθεί με κανέναν κοινό διαιρέτη εκτός του 1);'}
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: '12/15',
            formula: locale === 'en' ? 'Divisible by 3' : 'Διαιρείται με το 3',
            val: '4/5'
          },
          {
            item: '10/25',
            formula: locale === 'en' ? 'Divisible by 5' : 'Διαιρείται με το 5',
            val: '2/5'
          },
          {
            item: '14/21',
            formula: locale === 'en' ? 'Divisible by 7' : 'Διαιρείται με το 7',
            val: '2/3'
          },
          {
            item: '11/15',
            formula: `${locale === 'en' ? 'GCD' : 'Μ.Κ.Δ.'}(11, 15) ＝ 1`,
            val: locale === 'en' ? 'Irreducible' : 'Ανάγωγο'
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? '11 and 15 have no common divisors other than 1 (GCD ＝ 1), so 11/15 is irreducible.'
              : 'Οι αριθμοί 11 και 15 δεν έχουν κανέναν κοινό διαιρέτη εκτός του 1 (Μ.Κ.Δ. ＝ 1), άρα το 11/15 είναι ανάγωγο.'}
          </span>
        )
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  // Q1: Input - Εύρεση άγνωστου αριθμητή σε ισοδύναμα κλάσματα
  const q1BaseNum = randInt(1, 4);
  const q1BaseDen = randInt(q1BaseNum + 1, 6);
  const q1Mult = randInt(2, 5);
  const q1TargetDen = q1BaseDen * q1Mult;
  const q1CorrectVal = q1BaseNum * q1Mult;
  const q1Correct = String(q1CorrectVal);

  // Q2: Input - Μετατροπή κλάσματος σε ανάγωγο
  const q2RedNum = randInt(1, 4);
  let q2RedDen = randInt(q2RedNum + 1, 6);
  while (gcd(q2RedNum, q2RedDen) !== 1) {
    q2RedDen++;
  }
  const q2CommonFactor = [2, 3, 4, 5][randInt(0, 3)];
  const q2OrigNum = q2RedNum * q2CommonFactor;
  const q2OrigDen = q2RedDen * q2CommonFactor;
  const q2Correct = `${q2RedNum}/${q2RedDen}`;

  // Q3: MCQ - Ποιο από τα παρακάτω κλάσματα είναι ισοδύναμο με το δοθέν
  const q3BaseN = randInt(1, 3);
  const q3BaseD = randInt(q3BaseN + 1, 5);
  const q3GoodMult = randInt(2, 4);
  const q3CorrectVal = `${q3BaseN * q3GoodMult}/${q3BaseD * q3GoodMult}`;
  const q3CorrectObj = {
    val: q3CorrectVal,
    render: <Fraction num={q3BaseN * q3GoodMult} den={q3BaseD * q3GoodMult} size="md" />
  };
  const q3DistractorObjs = [
    {
      val: `${q3BaseN * q3GoodMult + 1}/${q3BaseD * q3GoodMult}`,
      render: <Fraction num={q3BaseN * q3GoodMult + 1} den={q3BaseD * q3GoodMult} size="md" />
    },
    {
      val: `${q3BaseN * q3GoodMult}/${q3BaseD * q3GoodMult + 1}`,
      render: <Fraction num={q3BaseN * q3GoodMult} den={q3BaseD * q3GoodMult + 1} size="md" />
    },
    {
      val: `${q3BaseN + 3}/${q3BaseD + 3}`,
      render: <Fraction num={q3BaseN + 3} den={q3BaseD + 3} size="md" />
    }
  ];
  const q3Options = buildFourOptions(q3CorrectObj, q3DistractorObjs, (k) => ({
    val: `${q3BaseN + k}/${q3BaseD + k + 4}`,
    render: <Fraction num={q3BaseN + k} den={q3BaseD + k + 4} size="md" />
  }));

  // Q4: MCQ - Ποιο κλάσμα είναι ήδη ανάγωγο
  const irreducibleList = [
    { num: 3, den: 5 },
    { num: 2, den: 7 },
    { num: 4, den: 9 },
    { num: 5, den: 8 },
    { num: 7, den: 10 }
  ];
  const reducibleList = [
    { num: 4, den: 6 },
    { num: 6, den: 9 },
    { num: 10, den: 15 },
    { num: 8, den: 12 },
    { num: 14, den: 21 }
  ];
  const q4Chosen = irreducibleList[randInt(0, irreducibleList.length - 1)];
  const q4CorrectVal = `${q4Chosen.num}/${q4Chosen.den}`;
  const q4CorrectObj = {
    val: q4CorrectVal,
    render: <Fraction num={q4Chosen.num} den={q4Chosen.den} size="md" />
  };
  const q4DistractorObjs = shuffle(reducibleList).slice(0, 3).map(o => ({
    val: `${o.num}/${o.den}`,
    render: <Fraction num={o.num} den={o.den} size="md" />
  }));
  const q4Options = buildFourOptions(q4CorrectObj, q4DistractorObjs, (k) => ({
    val: `${2 * k}/${4 * k}`,
    render: <Fraction num={2 * k} den={4 * k} size="md" />
  }));

  // Q5: True/False - Ορισμός ισοδύναμων κλασμάτων
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? 'Two equivalent fractions represent the exact same quantity, portion, or value.'
        : 'Δύο ισοδύναμα κλάσματα εκφράζουν την ίδια ακριβώς ποσότητα ή αξία.')
    : (locale === 'en'
        ? 'Two equivalent fractions must strictly have identical numerators and identical denominators.'
        : 'Δύο ισοδύναμα κλάσματα έχουν υποχρεωτικά τον ίδιο αριθμητή και τον ίδιο παρονομαστή.');

  // Q6: True/False - Κανόνας δημιουργίας ισοδυνάμων
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'If we multiply both numerator and denominator by the same non-zero natural number, we get an equivalent fraction.'
        : 'Αν πολλαπλασιάσουμε και τον αριθμητή και τον παρονομαστή με τον ίδιο φυσικό αριθμό (≠ 0), προκύπτει ισοδύναμο κλάσμα.')
    : (locale === 'en'
        ? 'If we add the same number to both numerator and denominator, we always obtain an equivalent fraction.'
        : 'Αν προσθέσουμε τον ίδιο αριθμό στον αριθμητή και στον παρονομαστή, προκύπτει πάντοτε ισοδύναμο κλάσμα.');

  // Q7: Input - Με ποιον αριθμό πρέπει να διαιρέσουμε (Μ.Κ.Δ.) για να γίνει ανάγωγο
  const q7Common = [2, 3, 4, 5, 6][randInt(0, 4)];
  const q7SimpleN = randInt(1, 3);
  let q7SimpleD = randInt(q7SimpleN + 1, 5);
  while (gcd(q7SimpleN, q7SimpleD) !== 1) {
    q7SimpleD++;
  }
  const q7Num = q7SimpleN * q7Common;
  const q7Den = q7SimpleD * q7Common;
  const q7Correct = String(q7Common);

  // Q8: MCQ - Πράξη απλοποίησης
  const q8Pool = [
    {
      prompt: (
        <span>
          {locale === 'en'
            ? 'What is the process of dividing both numerator and denominator of a fraction by the same number called?'
            : 'Πώς ονομάζεται η διαδικασία κατά την οποία διαιρούμε και τους δύο όρους ενός κλάσματος με τον ίδιο αριθμό;'}
        </span>
      ),
      correct: locale === 'en' ? 'Simplification (Reduction)' : 'Απλοποίηση',
      correctObj: {
        val: locale === 'en' ? 'Simplification (Reduction)' : 'Απλοποίηση',
        render: <span>{locale === 'en' ? 'Simplification (Reduction)' : 'Απλοποίηση'}</span>
      },
      distractorObjs: locale === 'en'
        ? [
            { val: 'Expansion', render: <span>Expansion</span> },
            { val: 'Addition', render: <span>Addition</span> },
            { val: 'Subtraction', render: <span>Subtraction</span> }
          ]
        : [
            { val: 'Διαπλάτυνση', render: <span>Διαπλάτυνση</span> },
            { val: 'Πρόσθεση', render: <span>Πρόσθεση</span> },
            { val: 'Αφαίρεση', render: <span>Αφαίρεση</span> }
          ],
      explain: (
        <span>
          {locale === 'en'
            ? 'Dividing both terms by the same number is called simplification.'
            : 'Η διαίρεση και των δύο όρων με τον ίδιο αριθμό ονομάζεται απλοποίηση του κλάσματος.'}
        </span>
      )
    },
    {
      prompt: (
        <span>
          {locale === 'en'
            ? 'When is a fraction called irreducible (in lowest terms)?'
            : 'Πότε ένα κλάσμα ονομάζεται ανάγωγο;'}
        </span>
      ),
      correct: locale === 'en'
        ? 'When numerator and denominator have GCD equal to 1'
        : 'Όταν ο αριθμητής και ο παρονομαστής έχουν Μ.Κ.Δ. ίσο με το 1',
      correctObj: {
        val: locale === 'en'
          ? 'When numerator and denominator have GCD equal to 1'
          : 'Όταν ο αριθμητής και ο παρονομαστής έχουν Μ.Κ.Δ. ίσο με το 1',
        render: <span>{locale === 'en' ? 'When numerator and denominator have GCD ＝ 1' : 'Όταν ο αριθμητής και ο παρονομαστής έχουν Μ.Κ.Δ. ＝ 1'}</span>
      },
      distractorObjs: locale === 'en'
        ? [
            { val: 'When the numerator is equal to 1', render: <span>When the numerator is equal to 1</span> },
            { val: 'When the denominator is an even number', render: <span>When the denominator is an even number</span> },
            { val: 'When the numerator is greater than the denominator', render: <span>When numerator ＞ denominator</span> }
          ]
        : [
            { val: 'Όταν ο αριθμητής είναι ίσος με το 1', render: <span>Όταν ο αριθμητής είναι ίσος με το 1</span> },
            { val: 'Όταν ο παρονομαστής είναι άρτιος αριθμός', render: <span>Όταν ο παρονομαστής είναι άρτιος αριθμός</span> },
            { val: 'Όταν ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή', render: <span>Όταν ο αριθμητής ＞ παρονομαστή</span> }
          ],
      explain: (
        <span>
          {locale === 'en'
            ? 'An irreducible fraction cannot be simplified further because its terms are coprime (GCD ＝ 1).'
            : 'Ανάγωγο είναι το κλάσμα που δεν μπορεί να απλοποιηθεί άλλο, δηλαδή όταν οι όροι του έχουν Μ.Κ.Δ. ίσο με το 1.'}
        </span>
      )
    }
  ];
  const q8Data = q8Pool[randInt(0, q8Pool.length - 1)];
  const q8Options = buildFourOptions(q8Data.correctObj, q8Data.distractorObjs, (k) => ({
    val: `Επιλογή ${k}`,
    render: <span>Επιλογή {k}</span>
  }));

  // Q9 & Q10: Problems from pools
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate(locale);
  const q9Options = buildFourOptions(q9Raw.correctObj, q9Raw.distractorObjs, (k) => ({
    val: `Επιλογή ${k}`,
    render: <span>Επιλογή {k}</span>
  }));

  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate(locale);
  const q10Options = buildFourOptions(q10Raw.correctObj, q10Raw.distractorObjs, (k) => ({
    val: `Επιλογή ${k}`,
    render: <span>Επιλογή {k}</span>
  }));

  return [
    {
      id: 'q1',
      type: 'input',
      title: locale === 'en' ? 'Finding Missing Term' : 'Εύρεση Άγνωστου Όρου',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Find the numerator x so the fractions are equivalent:' : 'Βρες τον αριθμητή x ώστε τα κλάσματα να είναι ισοδύναμα:'}</span>
          <Fraction num={q1BaseNum} den={q1BaseDen} size="sm" />
          <span>＝</span>
          <Fraction num="x" den={q1TargetDen} size="sm" />
          <span>.</span>
        </span>
      ),
      correct: q1Correct,
      explain: (
        <span>
          {locale === 'en'
            ? `The denominator was multiplied by ${q1Mult} (${q1BaseDen} · ${q1Mult} ＝ ${q1TargetDen}), so x ＝ ${q1BaseNum} · ${q1Mult} ＝ ${q1Correct}.`
            : `Ο παρονομαστής πολλαπλασιάστηκε επί ${q1Mult} (${q1BaseDen} · ${q1Mult} ＝ ${q1TargetDen}), άρα x ＝ ${q1BaseNum} · ${q1Mult} ＝ ${q1Correct}.`}
        </span>
      )
    },
    {
      id: 'q2',
      type: 'input',
      title: locale === 'en' ? 'Simplifying to Lowest Terms' : 'Απλοποίηση σε Ανάγωγο',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Simplify' : 'Απλοποίησε το κλάσμα'}</span>
          <Fraction num={q2OrigNum} den={q2OrigDen} size="sm" />
          <span>{locale === 'en' ? 'to its irreducible form (e.g. 3/4):' : 'στην ανάγωγη μορφή του (π.χ. 3/4):'}</span>
        </span>
      ),
      correct: q2Correct,
      explain: (
        <span>
          {locale === 'en'
            ? `Divide both terms by ${q2CommonFactor} (GCD): `
            : `Διαιρούμε και τους δύο όρους με το ${q2CommonFactor} (Μ.Κ.Δ.): `}
          <Fraction num={q2RedNum} den={q2RedDen} size="sm" />.
        </span>
      )
    },
    {
      id: 'q3',
      type: 'mcq',
      title: locale === 'en' ? 'Identifying Equivalent Fraction' : 'Αναγνώριση Ισοδύναμου',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Which fraction is equivalent to' : 'Ποιο από τα παρακάτω κλάσματα είναι ισοδύναμο με το'}</span>
          <Fraction num={q3BaseN} den={q3BaseD} size="sm" />
          <span>;</span>
        </span>
      ),
      options: q3Options,
      correct: q3CorrectVal,
      explain: (
        <span>
          {locale === 'en'
            ? `Multiplying numerator and denominator by ${q3GoodMult} gives `
            : `Πολλαπλασιάζοντας τους όρους επί ${q3GoodMult} προκύπτει το `}
          <Fraction num={q3BaseN * q3GoodMult} den={q3BaseD * q3GoodMult} size="sm" />.
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Spotting Irreducible Fraction' : 'Εντοπισμός Ανάγωγου Κλάσματος',
      prompt: (
        <span>
          {locale === 'en'
            ? 'Which of the following fractions is already irreducible?'
            : 'Ποιο από τα παρακάτω κλάσματα είναι ανάγωγο (δεν μπορεί να απλοποιηθεί άλλο);'}
        </span>
      ),
      options: q4Options,
      correct: q4CorrectVal,
      explain: (
        <span>
          {locale === 'en'
            ? <span>In <Fraction num={q4Chosen.num} den={q4Chosen.den} size="sm" />, the terms have GCD ＝ 1 (coprime), so it is irreducible.</span>
            : <span>Στο κλάσμα <Fraction num={q4Chosen.num} den={q4Chosen.den} size="sm" />, ο αριθμητής και ο παρονομαστής έχουν Μ.Κ.Δ. το 1 (είναι πρώτοι μεταξύ τους), άρα είναι ανάγωγο.</span>}
        </span>
      )
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Concept of Equivalence' : 'Έννοια Ισοδυναμίας',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {q5IsTrue
            ? (locale === 'en'
                ? 'Correct! Equivalent fractions represent the exact same value.'
                : 'Σωστά! Τα ισοδύναμα κλάσματα εκφράζουν ακριβώς την ίδια ποσότητα.')
            : (locale === 'en'
                ? 'False! Equivalent fractions generally have different terms (e.g. 1/2 ＝ 2/4 ＝ 4/8).'
                : 'Λάθος! Τα ισοδύναμα κλάσματα έχουν συνήθως διαφορετικούς όρους (π.χ. 1/2 ＝ 2/4 ＝ 4/8).')}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'tf',
      title: locale === 'en' ? 'Equivalence Rule' : 'Κανόνας Ισοδυναμίας',
      text: q6Text,
      correct: q6IsTrue,
      explain: (
        <span>
          {q6IsTrue
            ? (locale === 'en'
                ? 'Correct! We create equivalent fractions by multiplying or dividing both terms by the same non-zero number.'
                : 'Σωστά! Δημιουργούμε ισοδύναμα κλάσματα πολλαπλασιάζοντας ή διαιρώντας και τους δύο όρους με τον ίδιο αριθμό (≠ 0).')
            : (locale === 'en'
                ? 'False! Addition does NOT preserve equivalence (e.g. 1/2 ≠ (1＋2)/(2＋2) ＝ 3/4).'
                : 'Λάθος! Με την πρόσθεση ΔΕΝ διατηρείται η ισοδυναμία (π.χ. 1/2 ≠ (1＋2)/(2＋2) ＝ 3/4).')}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      title: locale === 'en' ? 'GCD for Simplification' : 'Μ.Κ.Δ. Απλοποίησης',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'By which number (GCD) must we divide' : 'Με ποιον αριθμό (Μ.Κ.Δ.) πρέπει να διαιρέσουμε τους όρους του'}</span>
          <Fraction num={q7Num} den={q7Den} size="sm" />
          <span>{locale === 'en' ? 'to reduce it to lowest terms directly?' : 'ώστε να γίνει αμέσως ανάγωγο;'}</span>
        </span>
      ),
      correct: q7Correct,
      explain: (
        <span>
          {locale === 'en' ? 'GCD' : 'Μ.Κ.Δ.'}({q7Num}, {q7Den}) ＝ {q7Correct}.
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Terminology & Properties' : 'Ορολογία & Ιδιότητες',
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correct,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'mcq',
      title: `${locale === 'en' ? 'Problem' : 'Πρόβλημα'}: ${q9Raw.title}`,
      prompt: q9Raw.prompt,
      options: q9Options,
      correct: q9Raw.correctText,
      tableData: q9Raw.tableData,
      explain: q9Raw.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${locale === 'en' ? 'Challenge Problem' : 'Σύνθετο Πρόβλημα'}: ${q10Raw.title}`,
      prompt: q10Raw.prompt,
      options: q10Options,
      correct: q10Raw.correctText,
      tableData: q10Raw.tableData,
      explain: q10Raw.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function IsodinamaKlasmataExercisesPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions(locale);
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach(q => {
      initialAnswers[q.id] = q.type === 'tf' ? null : '';
    });
    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [locale]);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      let sanitized = String(rawValue).replace(/[^0-9/]/g, '');
      const parts = sanitized.split('/');
      if (parts.length > 2) {
        sanitized = parts[0] + '/' + parts.slice(1).join('');
      }
      if (sanitized.length > 10) {
        sanitized = sanitized.slice(0, 10);
      }
      setAnswers(prev => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers(prev => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\s+/g, '').trim().toLowerCase();
      return cleanUser === cleanTarget;
    }
    if (q.type === 'mcq') {
      return userVal === q.correct;
    }
    if (q.type === 'tf') {
      return userVal === q.correct;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || questions.length === 0) return;

    let total = 0;
    questions.forEach(q => {
      if (isQuestionCorrect(q)) total += 1;
    });

    setScore(total);
    setSubmitted(true);
  };

  const getCardStyle = (q) => {
    if (!submitted) return 'bg-white border-slate-200 shadow-sm';
    return isQuestionCorrect(q)
      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-1 ring-emerald-400'
      : 'bg-rose-50/70 border-rose-400 shadow-md ring-1 ring-rose-400';
  };

  const answeredCount = Object.values(answers).filter(
    val => val !== undefined && val !== null && String(val).trim() !== ''
  ).length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/25-isodinama-klasmata"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryNav)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200 break-words [overflow-wrap:anywhere]">
                <span>{t.badge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
                {t.title}
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.desc}
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase(t.newQuestions)}</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΙΣ 10 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 max-w-full ${getCardStyle(q)}`}
                >
                  <div className="min-w-0">
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3 gap-2">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words [overflow-wrap:anywhere]">
                        {toCleanUppercase(`${t.exercise} ${qNum}: ${q.title}`)}
                      </span>
                      {submitted && (
                        <span className="text-xl shrink-0">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <div className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4 break-words [overflow-wrap:anywhere]">
                      {q.type === 'tf' ? `«${q.text}»` : q.prompt}
                    </div>

                    {/* INPUTS / OPTIONS */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt.val;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, opt.val, 'mcq')}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition touch-manipulation active:scale-95 break-words whitespace-normal leading-snug flex items-center justify-center min-h-[52px] w-full [overflow-wrap:anywhere] ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {opt.render}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'input' && (
                      <div className="space-y-2 mb-3">
                        <input
                          type="text"
                          inputMode={q.id === 'q2' ? 'text' : 'numeric'}
                          autoComplete="off"
                          spellCheck="false"
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.id === 'q2' ? (locale === 'en' ? 'e.g. 3/4' : 'π.χ. 3/4') : t.inputPlaceholder}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}

                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerChange(q.id, true, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] ${
                            answers[q.id] === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                          }`}
                        >
                          👍 {toCleanUppercase(t.trueBtn)}
                        </button>
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerChange(q.id, false, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] ${
                            answers[q.id] === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          👎 {toCleanUppercase(t.falseBtn)}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="w-full overflow-x-auto block bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          <table className="w-full min-w-[280px] text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderElement)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderFormula)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderValue)}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900 break-words [overflow-wrap:anywhere]">{row.item}</td>
                                  <td className="p-1.5 text-indigo-700 break-words [overflow-wrap:anywhere]">{row.formula}</td>
                                  <td className="p-1.5 font-black text-emerald-700 break-words [overflow-wrap:anywhere]">{row.val}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere] ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? t.feedbackSuccess : t.feedbackReview}
                        </p>
                        <div className="break-words [overflow-wrap:anywhere]">{q.explain}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation"
              >
                <span className="text-xl">🎯</span>
                <span>{toCleanUppercase(t.checkBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3 min-w-0 max-w-full`}>
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm shrink-0">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase(t.scoreBadge) : toCleanUppercase(t.answeredBadge)}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.percentage)}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 10) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* GUIDANCE OR RESTART */}
          <div className="flex items-center gap-3 shrink-0">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newQuestions)}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.bottomHint}
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
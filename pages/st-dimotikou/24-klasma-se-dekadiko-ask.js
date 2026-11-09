// pages/st-dimotikou/24-klasma-se-dekadiko-ask.js
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
    pageTitle: "Ασκήσεις: Κλάσμα σε Δεκαδικό - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην κλασματική μονάδα και τη μετατροπή κλάσματος σε δεκαδικό αριθμό για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 24 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Κλασματική Μονάδα & Δεκαδικοί",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στις κλασματικές μονάδες, στη μετατροπή κλασμάτων σε δεκαδικούς και στους περιοδικούς αριθμούς!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "π.χ. 0,5",
    tableHeaderElement: "Στοιχείο",
    tableHeaderFormula: "Ανάλυση / Τύπος",
    tableHeaderValue: "Τιμή",
    feedbackSuccess: "🎯 Εξαιρετικά!",
    feedbackReview: "💡 Επεξήγηση:",
    checkBtn: "Έλεγχος Απαντήσεων",
    scoreBadge: "Σκορ",
    answeredBadge: "Απαντήθηκαν",
    percentage: "Ποσοστό",
    bottomHint: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!"
  },
  en: {
    pageTitle: "Exercises: Fractions to Decimals - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on unit fractions and converting fractions to decimals for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 24 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Unit Fractions & Decimals",
    desc: "Solve the 10 dynamic questions to master unit fractions, converting fractions to decimals, and repeating decimals!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "e.g. 0.5",
    tableHeaderElement: "Element",
    tableHeaderFormula: "Formula / Step",
    tableHeaderValue: "Value",
    feedbackSuccess: "🎯 Excellent!",
    feedbackReview: "💡 Explanation:",
    checkBtn: "Check Answers",
    scoreBadge: "Score",
    answeredBadge: "Answered",
    percentage: "Percentage",
    bottomHint: "Answer all 10 questions and press 'Check Answers'!"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    generate: (locale) => {
      const parts = 4;
      const eaten = 3;
      const dec = locale === 'en' ? '0.75' : '0,75';
      const distractors = locale === 'en' ? ['0.5', '0.25', '0.8'] : ['0,5', '0,25', '0,8'];
      const correctObj = { val: dec, render: <span>{dec}</span> };
      const distractorObjs = distractors.map(val => ({ val, render: <span>{val}</span> }));
      return {
        title: locale === 'en' ? 'Pizza Sharing' : 'Μοίρασμα Πίτσας',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>
              {locale === 'en'
                ? `A group of friends ordered a pizza cut into ${parts} equal slices and ate ${eaten} of them (`
                : `Μία παρέα παρήγγειλε μία πίτσα χωρισμένη σε ${parts} ίσα κομμάτια και κατανάλωσε τα ${eaten} από αυτά (`}
            </span>
            <Fraction num={eaten} den={parts} size="sm" />
            <span>
              {locale === 'en'
                ? `). Which decimal number expresses the amount of pizza eaten?`
                : `). Ποιος δεκαδικός αριθμός εκφράζει την ποσότητα πίτσας που καταναλώθηκε;`}
            </span>
          </span>
        ),
        correctText: dec,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Consumption fraction' : 'Κλάσμα κατανάλωσης',
            formula: `${eaten}/${parts}`,
            val: `${eaten}/${parts}`
          },
          {
            item: locale === 'en' ? 'Division operation' : 'Πράξη διαίρεσης',
            formula: `${eaten} : ${parts}`,
            val: dec
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `To find the decimal number, divide numerator by denominator: ${eaten} : ${parts} ＝ ${dec}.`
              : `Για να βρούμε τον δεκαδικό αριθμό, εκτελούμε τη διαίρεση του αριθμητή με τον παρονομαστή: ${eaten} : ${parts} ＝ ${dec}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const parts = 5;
      const eaten = 2;
      const dec = locale === 'en' ? '0.4' : '0,4';
      const distractors = locale === 'en' ? ['0.2', '0.5', '0.25'] : ['0,2', '0,5', '0,25'];
      const correctObj = { val: dec, render: <span>{dec}</span> };
      const distractorObjs = distractors.map(val => ({ val, render: <span>{val}</span> }));
      return {
        title: locale === 'en' ? 'Equal Chocolate Shares' : 'Σοκολάτα σε Ίσα Μέρη',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'George gave' : 'Ο Γιώργος μοίρασε τα'}</span>
            <Fraction num={eaten} den={parts} size="sm" />
            <span>
              {locale === 'en'
                ? 'of a chocolate bar to his friends. Which decimal represents this shared portion?'
                : 'μιας σοκολάτας στους φίλους του. Ποιος δεκαδικός αριθμός αντιπροσωπεύει το μέρος της σοκολάτας που μοιράστηκε;'}
            </span>
          </span>
        ),
        correctText: dec,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Chocolate fraction' : 'Κλάσμα σοκολάτας',
            formula: `${eaten}/${parts}`,
            val: `${eaten}/${parts}`
          },
          {
            item: locale === 'en' ? 'Division operation' : 'Πράξη διαίρεσης',
            formula: `${eaten} : ${parts}`,
            val: dec
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Divide numerator by denominator: ${eaten} : ${parts} ＝ ${dec}.`
              : `Διαιρούμε τον αριθμητή με τον παρονομαστή: ${eaten} : ${parts} ＝ ${dec}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const parts = 8;
      const filled = 6;
      const dec = locale === 'en' ? '0.75' : '0,75';
      const distractors = locale === 'en' ? ['0.6', '0.85', '0.7'] : ['0,6', '0,85', '0,7'];
      const correctObj = { val: dec, render: <span>{dec}</span> };
      const distractorObjs = distractors.map(val => ({ val, render: <span>{val}</span> }));
      return {
        title: locale === 'en' ? 'Water Tank Capacity' : 'Δεξαμενή Νερού',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A water tank is filled to' : 'Μία δεξαμενή νερού είναι γεμάτη κατά τα'}</span>
            <Fraction num={filled} den={parts} size="sm" />
            <span>
              {locale === 'en'
                ? 'of its capacity. What is the decimal value of this fraction?'
                : 'της χωρητικότητάς της. Ποια είναι η δεκαδική τιμή αυτού του μέρους;'}
            </span>
          </span>
        ),
        correctText: dec,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Fill fraction' : 'Κλάσμα πλήρωσης',
            formula: `${filled}/${parts}`,
            val: `${filled}/${parts}`
          },
          {
            item: locale === 'en' ? 'Division operation' : 'Πράξη διαίρεσης',
            formula: `${filled} : ${parts}`,
            val: dec
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Perform the division: ${filled} : ${parts} ＝ ${dec}.`
              : `Εκτελούμε τη διαίρεση του κλάσματος: ${filled} : ${parts} ＝ ${dec}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const parts = 10;
      const eaten = 7;
      const dec = locale === 'en' ? '0.7' : '0,7';
      const distractors = locale === 'en' ? ['0.07', '0.77', '0.17'] : ['0,07', '0,77', '0,17'];
      const correctObj = { val: dec, render: <span>{dec}</span> };
      const distractorObjs = distractors.map(val => ({ val, render: <span>{val}</span> }));
      return {
        title: locale === 'en' ? 'Packet of Biscuits' : 'Πακέτο Μπισκότων',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>
              {locale === 'en'
                ? `From a packet of 10 biscuits, 7 were eaten (`
                : `Από ένα πακέτο με 10 μπισκότα φαγώθηκαν τα 7 (`}
            </span>
            <Fraction num={eaten} den={parts} size="sm" />
            <span>
              {locale === 'en'
                ? `). Which decimal number corresponds to the biscuits eaten?`
                : `). Ποιος δεκαδικός αριθμός αντιστοιχεί στα μπισκότα που φαγώθηκαν;`}
            </span>
          </span>
        ),
        correctText: dec,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Decimal fraction' : 'Δεκαδικό κλάσμα',
            formula: `${eaten}/${parts}`,
            val: `${eaten}/${parts}`
          },
          {
            item: locale === 'en' ? 'Decimal number' : 'Δεκαδικός αριθμός',
            formula: `${eaten} : ${parts}`,
            val: dec
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `The decimal fraction ${eaten}/${parts} directly equals ${dec}.`
              : `Το δεκαδικό κλάσμα ${eaten}/${parts} ισούται άμεσα με τον δεκαδικό αριθμό ${dec}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const parts = 2;
      const eaten = 1;
      const dec = locale === 'en' ? '0.5' : '0,5';
      const distractors = locale === 'en' ? ['0.2', '0.05', '1.5'] : ['0,2', '0,05', '1,5'];
      const correctObj = { val: dec, render: <span>{dec}</span> };
      const distractorObjs = distractors.map(val => ({ val, render: <span>{val}</span> }));
      return {
        title: locale === 'en' ? 'Birthday Cake' : 'Κέικ Γενεθλίων',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>
              {locale === 'en'
                ? `At a party, exactly `
                : `Σε ένα πάρτι καταναλώθηκε το `}
            </span>
            <Fraction num={eaten} den={parts} size="sm" />
            <span>
              {locale === 'en'
                ? `(one half) of a large cake was eaten. How is half expressed as a decimal?`
                : `(το μισό) ενός μεγάλου κέικ. Πώς εκφράζεται το μισό με δεκαδικό αριθμό;`}
            </span>
          </span>
        ),
        correctText: dec,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Unit fraction' : 'Κλασματική μονάδα',
            formula: `${eaten}/${parts}`,
            val: `${eaten}/${parts}`
          },
          {
            item: locale === 'en' ? 'Decimal value' : 'Δεκαδική τιμή',
            formula: `${eaten} : ${parts}`,
            val: dec
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `The unit fraction 1/2 equals 1 : 2 ＝ ${dec}.`
              : `Η κλασματική μονάδα 1/2 ισούται με 1 : 2 ＝ ${dec}.`}
          </span>
        )
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const parts = 4;
      const drank = 1;
      const dec = locale === 'en' ? '0.25' : '0,25';
      const distractors = locale === 'en' ? ['0.4', '0.2', '0.75'] : ['0,4', '0,2', '0,75'];
      const correctObj = { val: dec, render: <span>{dec}</span> };
      const distractorObjs = distractors.map(val => ({ val, render: <span>{val}</span> }));
      return {
        title: locale === 'en' ? 'Orange Juice' : 'Χυμός Πορτοκαλιού',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>
              {locale === 'en'
                ? `A bottle contained 1 liter of juice and we drank `
                : `Ένα μπουκάλι χυμού περιείχε 1 λίτρο και ήπιαμε το `}
            </span>
            <Fraction num={drank} den={parts} size="sm" />
            <span>
              {locale === 'en'
                ? `(one quarter) of a liter. What decimal corresponds to one quarter?`
                : `(ένα τέταρτο) του λίτρου. Ποιος δεκαδικός αριθμός αντιστοιχεί στο ένα τέταρτο;`}
            </span>
          </span>
        ),
        correctText: dec,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Unit fraction' : 'Κλασματική μονάδα',
            formula: `${drank}/${parts}`,
            val: `${drank}/${parts}`
          },
          {
            item: locale === 'en' ? 'Division' : 'Διαίρεση',
            formula: `${drank} : ${parts}`,
            val: dec
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `One quarter (1/4) corresponds to the division 1 : 4 ＝ ${dec}.`
              : `Το ένα τέταρτο (1/4) αντιστοιχεί στη διαίρεση 1 : 4 ＝ ${dec}.`}
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
      const num = 5;
      const den = 2;
      const dec = locale === 'en' ? '2.5' : '2,5';
      const unitLabel = locale === 'en' ? 'pizzas' : 'πίτσες';
      const distractors = locale === 'en' ? ['2.2', '3.5', '1.5'] : ['2,2', '3,5', '1,5'];
      const correctText = `${dec} ${unitLabel}`;
      const correctObj = { val: correctText, render: <span>{correctText}</span> };
      const distractorObjs = distractors.map(d => ({
        val: `${d} ${unitLabel}`,
        render: <span>{d} {unitLabel}</span>
      }));
      return {
        title: locale === 'en' ? 'Improper Fraction in Pizzas' : 'Καταχρηστικό Κλάσμα σε Πίτσες',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>
              {locale === 'en'
                ? `At an event, pizzas cut in halves were ordered. A total of 5 halves were eaten (`
                : `Σε μια εκδήλωση παραγγέλθηκαν πίτσες κομμένες στη μέση (ανά 2 ίσα μέρη). Συνολικά φαγώθηκαν 5 τέτοια κομμάτια (`}
            </span>
            <Fraction num={num} den={den} size="sm" />
            <span>
              {locale === 'en'
                ? `). How many whole pizzas were consumed in decimal form?`
                : `). Πόσες ολόκληρες πίτσες καταναλώθηκαν σε δεκαδική μορφή;`}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Improper fraction' : 'Καταχρηστικό κλάσμα',
            formula: `${num}/${den}`,
            val: `${num}/${den}`
          },
          {
            item: locale === 'en' ? 'Division' : 'Πράξη διαίρεσης',
            formula: `${num} : ${den}`,
            val: dec
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Perform the division: ${num} : ${den} ＝ ${dec} pizzas (2 whole pizzas and a half).`
              : `Εκτελούμε τη διαίρεση: ${num} : ${den} ＝ ${dec} πίτσες (2 ολόκληρες και μισή πίτσα).`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const num = 7;
      const den = 4;
      const dec = locale === 'en' ? '1.75' : '1,75';
      const unitLabel = locale === 'en' ? 'meters' : 'μέτρα';
      const distractors = locale === 'en' ? ['1.25', '1.5', '2.25'] : ['1,25', '1,5', '2,25'];
      const correctText = `${dec} ${unitLabel}`;
      const correctObj = { val: correctText, render: <span>{correctText}</span> };
      const distractorObjs = distractors.map(d => ({
        val: `${d} ${unitLabel}`,
        render: <span>{d} {unitLabel}</span>
      }));
      return {
        title: locale === 'en' ? 'Curtain Fabric Measurement' : 'Υφάσματα για Κουρτίνες',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A tailor used' : 'Μια μοδίστρα χρησιμοποίησε'}</span>
            <Fraction num={num} den={den} size="sm" />
            <span>
              {locale === 'en'
                ? 'of a meter of fabric for a pillow. How many meters is this in decimal form?'
                : 'του μέτρου ύφασμα για ένα μαξιλάρι. Πόσα μέτρα υφάσματος χρησιμοποίησε σε δεκαδική μορφή;'}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Length fraction' : 'Κλάσμα μήκους',
            formula: `${num}/${den}`,
            val: `${num}/${den}`
          },
          {
            item: locale === 'en' ? 'Division' : 'Διαίρεση',
            formula: `${num} : ${den}`,
            val: dec
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Divide numerator by denominator: ${num} : ${den} ＝ ${dec} meters.`
              : `Διαιρούμε τον αριθμητή με τον παρονομαστή: ${num} : ${den} ＝ ${dec} μέτρα.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const num = 6;
      const den = 5;
      const dec = locale === 'en' ? '1.2' : '1,2';
      const unitLabel = locale === 'en' ? 'kg' : 'κιλά';
      const distractors = locale === 'en' ? ['1.4', '1.6', '1.5'] : ['1,4', '1,6', '1,5'];
      const correctText = `${dec} ${unitLabel}`;
      const correctObj = { val: correctText, render: <span>{correctText}</span> };
      const distractorObjs = distractors.map(d => ({
        val: `${d} ${unitLabel}`,
        render: <span>{d} {unitLabel}</span>
      }));
      return {
        title: locale === 'en' ? 'Fruit Weight in Kilograms' : 'Βάρος Φρούτων σε Κιλά',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A bag of apples weighs' : 'Μία σακούλα με μήλα ζυγίζει'}</span>
            <Fraction num={num} den={den} size="sm" />
            <span>
              {locale === 'en'
                ? 'of a kilogram. What is its weight expressed as a decimal number?'
                : 'του κιλού. Πόσα κιλά ζυγίζει η σακούλα εκφρασμένη σε δεκαδικό αριθμό;'}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Weight fraction' : 'Κλάσμα βάρους',
            formula: `${num}/${den}`,
            val: `${num}/${den}`
          },
          {
            item: locale === 'en' ? 'Division' : 'Διαίρεση',
            formula: `${num} : ${den}`,
            val: dec
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `${num} : ${den} ＝ ${dec} kg (1 kilogram and 200 grams).`
              : `${num} : ${den} ＝ ${dec} κιλά (δηλαδή 1 κιλό και 200 γραμμάρια).`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const dec = locale === 'en' ? '0.333...' : '0,333...';
      const repeatingLabel = locale === 'en' ? 'Repeating' : 'Περιοδικός';
      const nonRepeatingLabel = locale === 'en' ? 'Terminating' : 'Μη περιοδικός';
      const correctText = `${dec} (${repeatingLabel})`;
      const correctObj = { val: correctText, render: <span>{correctText}</span> };
      const distractorObjs = locale === 'en'
        ? [
            { val: `0.3 (${nonRepeatingLabel})`, render: <span>0.3 ({nonRepeatingLabel})</span> },
            { val: `0.33 (${nonRepeatingLabel})`, render: <span>0.33 ({nonRepeatingLabel})</span> },
            { val: `0.25 (${nonRepeatingLabel})`, render: <span>0.25 ({nonRepeatingLabel})</span> }
          ]
        : [
            { val: `0,3 (${nonRepeatingLabel})`, render: <span>0,3 ({nonRepeatingLabel})</span> },
            { val: `0,33 (${nonRepeatingLabel})`, render: <span>0,33 ({nonRepeatingLabel})</span> },
            { val: `0,25 (${nonRepeatingLabel})`, render: <span>0,25 ({nonRepeatingLabel})</span> }
          ];
      return {
        title: locale === 'en' ? 'Repeating Decimal of an Hour' : 'Περιοδικός Αριθμός σε Ώρες',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'Andreas studied for' : 'Ο Ανδρέας μελέτησε για το'}</span>
            <Fraction num="1" den="3" size="sm" />
            <span>
              {locale === 'en'
                ? 'of an hour. Converting this fraction to a decimal, what is the result and what kind of number is it?'
                : 'της ώρας. Αν μετατρέψουμε το κλάσμα σε δεκαδικό, ποιο είναι το αποτέλεσμα και τι είδους αριθμός προκύπτει;'}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Time fraction' : 'Κλάσμα χρόνου',
            formula: '1/3',
            val: '1/3'
          },
          {
            item: locale === 'en' ? 'Division' : 'Διαίρεση',
            formula: '1 : 3',
            val: dec
          },
          {
            item: locale === 'en' ? 'Type of decimal' : 'Είδος δεκαδικού',
            formula: locale === 'en' ? 'Infinite digits 3' : 'Άπειρα ψηφία 3',
            val: repeatingLabel
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `The division 1 : 3 never terminates and gives ${dec}, which is a repeating decimal number.`
              : `Η διαίρεση 1 : 3 δεν τελειώνει ποτέ και δίνει ${dec}, ο οποίος είναι περιοδικός δεκαδικός αριθμός.`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const num = 9;
      const den = 4;
      const dec = locale === 'en' ? '2.25' : '2,25';
      const distractors = locale === 'en' ? ['2.5', '2.75', '1.75'] : ['2,5', '2,75', '1,75'];
      const correctText = `${dec} €`;
      const correctObj = { val: correctText, render: <span>{correctText}</span> };
      const distractorObjs = distractors.map(d => ({
        val: `${d} €`,
        render: <span>{d} €</span>
      }));
      return {
        title: locale === 'en' ? 'Toy Price in Euros' : 'Χρηματικό Ποσό σε Ευρώ',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'A toy costs' : 'Ένα παιχνίδι κοστίζει'}</span>
            <Fraction num={num} den={den} size="sm" />
            <span>
              {locale === 'en'
                ? 'of a euro per piece. How many euros does it cost written as a decimal number?'
                : 'του ευρώ ανά τεμάχιο. Πόσα ευρώ κοστίζει γραμμένο με δεκαδικό αριθμό;'}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Price fraction' : 'Κλάσμα τιμής',
            formula: `${num}/${den} €`,
            val: `${num}/${den} €`
          },
          {
            item: locale === 'en' ? 'Division' : 'Διαίρεση',
            formula: `${num} : ${den}`,
            val: `${dec} €`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Perform the division: ${num} : ${den} ＝ ${dec} €.`
              : `Εκτελούμε τη διαίρεση: ${num} : ${den} ＝ ${dec} € (δηλαδή 2 ευρώ και 25 λεπτά).`}
          </span>
        )
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const num = 8;
      const den = 5;
      const dec = locale === 'en' ? '1.6' : '1,6';
      const unitLabel = locale === 'en' ? 'km' : 'χλμ.';
      const distractors = locale === 'en' ? ['1.8', '1.4', '1.5'] : ['1,8', '1,4', '1,5'];
      const correctText = `${dec} ${unitLabel}`;
      const correctObj = { val: correctText, render: <span>{correctText}</span> };
      const distractorObjs = distractors.map(d => ({
        val: `${d} ${unitLabel}`,
        render: <span>{d} ${unitLabel}</span>
      }));
      return {
        title: locale === 'en' ? 'Track Race Distance' : 'Απόσταση Αγώνα Δρόμου',
        prompt: (
          <span className="flex items-center gap-1.5 flex-wrap">
            <span>{locale === 'en' ? 'An athlete ran a distance equal to' : 'Ένας αθλητής διένυσε απόσταση ίση με'}</span>
            <Fraction num={num} den={den} size="sm" />
            <span>
              {locale === 'en'
                ? 'of a kilometer. How many kilometers did he cover in decimal form?'
                : 'του χιλιομέτρου. Πόσα χιλιόμετρα διένυσε σε δεκαδική μορφή;'}
            </span>
          </span>
        ),
        correctText,
        correctObj,
        distractorObjs,
        tableData: [
          {
            item: locale === 'en' ? 'Distance fraction' : 'Κλάσμα απόστασης',
            formula: `${num}/${den} km`,
            val: `${num}/${den}`
          },
          {
            item: locale === 'en' ? 'Division' : 'Διαίρεση',
            formula: `${num} : ${den}`,
            val: `${dec} ${unitLabel}`
          }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Calculate: ${num} : ${den} ＝ ${dec} km (1 km and 600 meters).`
              : `Υπολογίζουμε: ${num} : ${den} ＝ ${dec} χλμ. (1 χιλιόμετρο και 600 μέτρα).`}
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
  // Q1: Input - Μετατροπή απλού κλάσματος σε δεκαδικό
  const q1List = [
    { num: 1, den: 2, decEl: '0,5', decEn: '0.5' },
    { num: 1, den: 4, decEl: '0,25', decEn: '0.25' },
    { num: 3, den: 4, decEl: '0,75', decEn: '0.75' },
    { num: 1, den: 5, decEl: '0,2', decEn: '0.2' },
    { num: 2, den: 5, decEl: '0,4', decEn: '0.4' },
    { num: 3, den: 5, decEl: '0,6', decEn: '0.6' },
    { num: 4, den: 5, decEl: '0,8', decEn: '0.8' }
  ];
  const q1Selected = q1List[randInt(0, q1List.length - 1)];
  const q1Target = locale === 'en' ? q1Selected.decEn : q1Selected.decEl;

  // Q2: MCQ - Αναγνώριση Κλασματικής Μονάδας (1/ν) (Αυστηρά 4 μοναδικές επιλογές)
  const q2Den = randInt(3, 12);
  const q2CorrectStr = `1/${q2Den}`;
  const q2CorrectObj = {
    val: q2CorrectStr,
    render: <Fraction num="1" den={q2Den} size="md" />
  };
  const q2Distractors = [
    { val: `2/${q2Den}`, render: <Fraction num="2" den={q2Den} size="md" /> },
    { val: `${q2Den}/1`, render: <Fraction num={q2Den} den="1" size="md" /> },
    { val: `${q2Den}/${q2Den}`, render: <Fraction num={q2Den} den={q2Den} size="md" /> }
  ];
  const q2Options = buildFourOptions(q2CorrectObj, q2Distractors, (k) => ({
    val: `${k + 2}/${q2Den}`,
    render: <Fraction num={k + 2} den={q2Den} size="md" />
  }));

  // Q3: MCQ - Ποιο κλάσμα παράγει Περιοδικό Δεκαδικό Αριθμό
  const q3Periodic = [
    { num: 1, den: 3, dec: locale === 'en' ? '0.333...' : '0,333...' },
    { num: 2, den: 3, dec: locale === 'en' ? '0.666...' : '0,666...' },
    { num: 1, den: 6, dec: locale === 'en' ? '0.166...' : '0,166...' },
    { num: 1, den: 7, dec: locale === 'en' ? '0.142...' : '0,142...' },
    { num: 1, den: 9, dec: locale === 'en' ? '0.111...' : '0,111...' }
  ];
  const q3NonPeriodic = [
    { num: 1, den: 2 },
    { num: 1, den: 4 },
    { num: 3, den: 4 },
    { num: 2, den: 5 },
    { num: 3, den: 10 },
    { num: 7, den: 10 },
    { num: 1, den: 8 }
  ];
  const q3Chosen = q3Periodic[randInt(0, q3Periodic.length - 1)];
  const q3CorrectObj = {
    val: `${q3Chosen.num}/${q3Chosen.den}`,
    render: <Fraction num={q3Chosen.num} den={q3Chosen.den} size="md" />
  };
  const q3DistractorObjs = shuffle(q3NonPeriodic)
    .filter(o => !(o.num === q3Chosen.num && o.den === q3Chosen.den))
    .slice(0, 3)
    .map(o => ({
      val: `${o.num}/${o.den}`,
      render: <Fraction num={o.num} den={o.den} size="md" />
    }));
  const q3Options = buildFourOptions(q3CorrectObj, q3DistractorObjs, (k) => ({
    val: `1/${10 + k}`,
    render: <Fraction num="1" den={10 + k} size="md" />
  }));

  // Q4: Input - Μετατροπή καταχρηστικού κλάσματος σε δεκαδικό (> 1)
  const q4List = [
    { num: 3, den: 2, decEl: '1,5', decEn: '1.5' },
    { num: 5, den: 2, decEl: '2,5', decEn: '2.5' },
    { num: 5, den: 4, decEl: '1,25', decEn: '1.25' },
    { num: 7, den: 4, decEl: '1,75', decEn: '1.75' },
    { num: 6, den: 5, decEl: '1,2', decEn: '1.2' },
    { num: 8, den: 5, decEl: '1,6', decEn: '1.6' }
  ];
  const q4Selected = q4List[randInt(0, q4List.length - 1)];
  const q4Target = locale === 'en' ? q4Selected.decEn : q4Selected.decEl;

  // Q5: True/False - Κλασματική μονάδα σημαίνει αριθμητής = 1
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? (locale === 'en'
        ? 'A unit fraction is defined as any fraction that has the number 1 as its numerator.'
        : 'Κλασματική μονάδα ονομάζεται κάθε κλάσμα που έχει ως αριθμητή τον αριθμό 1.')
    : (locale === 'en'
        ? 'A unit fraction is defined as any fraction that has the number 1 as its denominator.'
        : 'Κλασματική μονάδα ονομάζεται κάθε κλάσμα που έχει ως παρονομαστή τον αριθμό 1.');

  // Q6: True/False - Η γραμμή κλάσματος σημαίνει διαίρεση
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? (locale === 'en'
        ? 'To convert a fraction into a decimal, we divide the numerator by the denominator.'
        : 'Για να μετατρέψουμε ένα κλάσμα σε δεκαδικό, διαιρούμε τον αριθμητή με τον παρονομαστή.')
    : (locale === 'en'
        ? 'To convert a fraction into a decimal, we divide the denominator by the numerator.'
        : 'Για να μετατρέψουμε ένα κλάσμα σε δεκαδικό, διαιρούμε τον παρονομαστή με τον αριθμητή.');

  // Q7: Input - Εύρεση δεκαδικού κλάσματος (με παρονομαστή 10 ή 100)
  const q7List = [
    { num: 7, den: 10, decEl: '0,7', decEn: '0.7' },
    { num: 9, den: 10, decEl: '0,9', decEn: '0.9' },
    { num: 13, den: 10, decEl: '1,3', decEn: '1.3' },
    { num: 25, den: 100, decEl: '0,25', decEn: '0.25' },
    { num: 45, den: 100, decEl: '0,45', decEn: '0.45' },
    { num: 8, den: 100, decEl: '0,08', decEn: '0.08' }
  ];
  const q7Selected = q7List[randInt(0, q7List.length - 1)];
  const q7Target = locale === 'en' ? q7Selected.decEn : q7Selected.decEl;

  // Q8: MCQ - Σύγκριση κλασματικών μονάδων
  const q8Pool = [
    {
      prompt: (
        <span>
          {locale === 'en'
            ? 'Which of the following unit fractions represents the LARGEST part?'
            : 'Ποια από τις παρακάτω κλασματικές μονάδες εκφράζει το ΜΕΓΑΛΥΤΕΡΟ μέρος;'}
        </span>
      ),
      correct: '1/2',
      correctObj: { val: '1/2', render: <Fraction num="1" den="2" size="md" /> },
      distractorObjs: [
        { val: '1/4', render: <Fraction num="1" den="4" size="md" /> },
        { val: '1/8', render: <Fraction num="1" den="8" size="md" /> },
        { val: '1/10', render: <Fraction num="1" den="10" size="md" /> }
      ],
      explain: (
        <span>
          {locale === 'en'
            ? 'The smaller the denominator in a unit fraction, the larger the slice: 1/2 ＝ 0.5, while 1/4 ＝ 0.25.'
            : 'Όσο μικρότερος είναι ο παρονομαστής σε μια κλασματική μονάδα, τόσο μεγαλύτερο είναι το κομμάτι: 1/2 ＝ 0,5, ενώ 1/4 ＝ 0,25.'}
        </span>
      )
    },
    {
      prompt: (
        <span>
          {locale === 'en'
            ? 'Which comparison relation is CORRECT?'
            : 'Ποια σχέση σύγκρισης είναι ΣΩΣΤΗ;'}
        </span>
      ),
      correct: '1/2 ＞ 1/5',
      correctObj: {
        val: '1/2 ＞ 1/5',
        render: (
          <span className="flex items-center gap-1 justify-center flex-wrap">
            <Fraction num="1" den="2" size="sm" /> ＞ <Fraction num="1" den="5" size="sm" />
          </span>
        )
      },
      distractorObjs: [
        {
          val: '1/2 ＜ 1/5',
          render: (
            <span className="flex items-center gap-1 justify-center flex-wrap">
              <Fraction num="1" den="2" size="sm" /> ＜ <Fraction num="1" den="5" size="sm" />
            </span>
          )
        },
        {
          val: '1/2 ＝ 1/5',
          render: (
            <span className="flex items-center gap-1 justify-center flex-wrap">
              <Fraction num="1" den="2" size="sm" /> ＝ <Fraction num="1" den="5" size="sm" />
            </span>
          )
        },
        {
          val: '1/5 ＞ 1/3',
          render: (
            <span className="flex items-center gap-1 justify-center flex-wrap">
              <Fraction num="1" den="5" size="sm" /> ＞ <Fraction num="1" den="3" size="sm" />
            </span>
          )
        }
      ],
      explain: (
        <span>
          {locale === 'en'
            ? '1/2 ＝ 0.5 and 1/5 ＝ 0.2. Therefore, 0.5 ＞ 0.2 (1/2 ＞ 1/5).'
            : '1/2 ＝ 0,5 και 1/5 ＝ 0,2. Επομένως, 0,5 ＞ 0,2 (1/2 ＞ 1/5).'}
        </span>
      )
    }
  ];
  const q8Data = q8Pool[randInt(0, q8Pool.length - 1)];
  const q8Options = buildFourOptions(q8Data.correctObj, q8Data.distractorObjs, (k) => ({
    val: `1/${k + 10}`,
    render: <Fraction num="1" den={k + 10} size="md" />
  }));

  // Q9 & Q10: Problems from pools
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate(locale);
  const q9Options = buildFourOptions(q9Raw.correctObj, q9Raw.distractorObjs, (k) => ({
    val: `0,${k + 1}`,
    render: <span>0,{k + 1}</span>
  }));

  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate(locale);
  const q10Options = buildFourOptions(q10Raw.correctObj, q10Raw.distractorObjs, (k) => ({
    val: `${k + 2}`,
    render: <span>{k + 2}</span>
  }));

  return [
    {
      id: 'q1',
      type: 'input',
      title: locale === 'en' ? 'Fraction to Decimal' : 'Κλάσμα ➔ Δεκαδικός',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Convert the fraction' : 'Μετάτρεψε το κλάσμα'}</span>
          <Fraction num={q1Selected.num} den={q1Selected.den} size="sm" />
          <span>{locale === 'en' ? 'into a decimal number (e.g. 0.5):' : 'σε δεκαδικό αριθμό (π.χ. 0,5):'}</span>
        </span>
      ),
      correct: q1Target,
      explain: (
        <span>
          <Fraction num={q1Selected.num} den={q1Selected.den} size="sm" /> ＝ {q1Selected.num} : {q1Selected.den} ＝ {q1Target}.
        </span>
      )
    },
    {
      id: 'q2',
      type: 'mcq',
      title: locale === 'en' ? 'Unit Fraction' : 'Κλασματική Μονάδα',
      prompt: (
        <span>
          {locale === 'en'
            ? `Which of the following is the unit fraction with denominator ${q2Den}?`
            : `Ποιο από τα παρακάτω κλάσματα είναι η κλασματική μονάδα με παρονομαστή το ${q2Den};`}
        </span>
      ),
      options: q2Options,
      correct: q2CorrectStr,
      explain: (
        <span>
          {locale === 'en'
            ? <span>A unit fraction always has numerator 1: <Fraction num="1" den={q2Den} size="sm" />.</span>
            : <span>Η κλασματική μονάδα έχει πάντοτε αριθμητή το 1: <Fraction num="1" den={q2Den} size="sm" />.</span>}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'mcq',
      title: locale === 'en' ? 'Repeating Decimal' : 'Περιοδικός Δεκαδικός',
      prompt: (
        <span>
          {locale === 'en'
            ? 'Which of the following fractions produces a repeating (periodic) decimal?'
            : 'Ποιο από τα παρακάτω κλάσματα δίνει περιοδικό δεκαδικό αριθμό όταν κάνουμε τη διαίρεση;'}
        </span>
      ),
      options: q3Options,
      correct: `${q3Chosen.num}/${q3Chosen.den}`,
      explain: (
        <span>
          <Fraction num={q3Chosen.num} den={q3Chosen.den} size="sm" /> ＝ {q3Chosen.num} : {q3Chosen.den} ＝ {q3Chosen.dec}.
          {locale === 'en'
            ? ' The division never terminates and the decimal digit repeats infinitely, so it is a repeating decimal.'
            : ' Η διαίρεση δεν τελειώνει ποτέ και το δεκαδικό ψηφίο επαναλαμβάνεται επ\' άπειρον, άρα είναι περιοδικός δεκαδικός αριθμός.'}
        </span>
      )
    },
    {
      id: 'q4',
      type: 'input',
      title: locale === 'en' ? 'Improper Fraction to Decimal' : 'Καταχρηστικό Κλάσμα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'What is the decimal value of' : 'Ποια είναι η δεκαδική τιμή του κλάσματος'}</span>
          <Fraction num={q4Selected.num} den={q4Selected.den} size="sm" />
          <span>({locale === 'en' ? 'e.g. 1.5' : 'π.χ. 1,5'}):</span>
        </span>
      ),
      correct: q4Target,
      explain: (
        <span>
          <Fraction num={q4Selected.num} den={q4Selected.den} size="sm" /> ＝ {q4Selected.num} : {q4Selected.den} ＝ {q4Target}.
        </span>
      )
    },
    {
      id: 'q5',
      type: 'tf',
      title: locale === 'en' ? 'Definition of Unit Fraction' : 'Ορισμός Κλασματικής Μονάδας',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {q5IsTrue
            ? (locale === 'en'
                ? 'Correct! A unit fraction is any fraction of the form 1/n (Numerator ＝ 1).'
                : 'Σωστά! Κλασματική μονάδα είναι κάθε κλάσμα της μορφής 1/ν (Αριθμητής ＝ 1).')
            : (locale === 'en'
                ? 'False! The unit fraction has 1 as its numerator, not denominator.'
                : 'Λάθος! Η κλασματική μονάδα έχει αριθμητή το 1, όχι παρονομαστή.')}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'tf',
      title: locale === 'en' ? 'Conversion Method' : 'Τρόπος Μετατροπής',
      text: q6Text,
      correct: q6IsTrue,
      explain: (
        <span>
          {q6IsTrue
            ? (locale === 'en'
                ? 'Correct! We always divide Numerator (top) by Denominator (bottom).'
                : 'Σωστά! Διαιρούμε πάντα τον Αριθμητή (πάνω) με τον Παρονομαστή (κάτω).')
            : (locale === 'en'
                ? 'False! We divide numerator by denominator (Numerator : Denominator).'
                : 'Λάθος! Διαιρούμε τον αριθμητή με τον παρονομαστή (Αριθμητής : Παρονομαστής).')}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      title: locale === 'en' ? 'Decimal Fraction' : 'Δεκαδικό Κλάσμα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Write the decimal value of' : 'Γράψε τη δεκαδική τιμή του κλάσματος'}</span>
          <Fraction num={q7Selected.num} den={q7Selected.den} size="sm" />
          <span>({locale === 'en' ? 'e.g. 0.7' : 'π.χ. 0,7'}):</span>
        </span>
      ),
      correct: q7Target,
      explain: (
        <span>
          <Fraction num={q7Selected.num} den={q7Selected.den} size="sm" /> ＝ {q7Selected.num} : {q7Selected.den} ＝ {q7Target}.
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Comparing Unit Fractions' : 'Σύγκριση Κλασματικών Μονάδων',
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

export default function KlasmaSeDekadikoExercisesPage() {
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
      let sanitized = String(rawValue).replace(/\./g, ',').replace(/[^0-9,]/g, '');
      const parts = sanitized.split(',');
      if (parts.length > 2) {
        sanitized = parts[0] + ',' + parts.slice(1).join('');
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      if (cleanUser === cleanTarget) return true;
      const numUser = parseFloat(cleanUser.replace(',', '.'));
      const numTarget = parseFloat(cleanTarget.replace(',', '.'));
      return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) < 0.05;
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
          href="/st-dimotikou/24-klasma-se-dekadiko"
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
                          inputMode="decimal"
                          autoComplete="off"
                          spellCheck="false"
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={t.inputPlaceholder}
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
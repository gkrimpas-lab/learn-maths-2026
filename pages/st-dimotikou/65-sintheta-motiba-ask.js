// pages/st-dimotikou/65-sintheta-motiba-ask.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΑ COMPONENTS & ΣΥΝΑΡΤΗΣΕΙΣ
// ---------------------------------------------------------

// Εμφάνιση κλάσματος με οριζόντια γραμμή (καθαρό JSX, χωρίς raw LaTeX) - Mobile Safe
function Fraction({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="font-bold border-b border-current px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="font-bold px-1 pt-0.5 break-all">
        {den}
      </span>
    </span>
  );
}

function randInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function shuffleArray(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Εγγύηση ακριβώς 4 μοναδικών επιλογών για MCQ
function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set();
  if (correct !== undefined && correct !== null && correct !== '') {
    unique.add(String(correct));
  }
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  let fallbackCounter = 1;
  while (unique.size < 4) {
    unique.add(`${correct} (${fallbackCounter})`);
    fallbackCounter++;
  }
  return shuffleArray(Array.from(unique));
}

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται αυστηρά το ΣΤ')
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

// ---------------------------------------------------------
// ΔΙΕΘΝΟΠΟΙΗΣΗ (i18n) & ΛΕΞΙΚΟ
// ---------------------------------------------------------

const I18N = {
  el: {
    metaTitle: "Ασκήσεις: Σύνθετα Μοτίβα - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα σύνθετα μοτίβα, τους διπλούς κανόνες, τους πίνακες δύο μεγεθών και τα προβλήματα καθημερινότητας για τη ΣΤ' Δημοτικού.",
    backLinkText: "ΣΤ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeHeader: "ΚΕΦΑΛΑΙΟ 65 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Διαδραστικές Ασκήσεις: Σύνθετα Μοτίβα & Σχέσεις Μεγεθών",
    heroDesc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στους διπλούς κανόνες, στα εναλλασσόμενα μοτίβα, στους πίνακες δύο μεγεθών και στην εύρεση του γενικού τύπου!",
    newSetBtn: "Νέες Ασκήσεις",
    exerciseLabel: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "Γράψε την απάντηση...",
    checkBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ",
    answeredLabel: "Απαντήθηκαν",
    percentageLabel: "Ποσοστό",
    footerPrompt: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!",
    excellentFeedback: "🎯 Εξαιρετικά!",
    explainFeedback: "💡 Επεξήγηση:",
    tableColItem: "Στοιχείο",
    tableColFormula: "Ανάλυση / Τύπος",
    tableColVal: "Τιμή"
  },
  en: {
    metaTitle: "Exercises: Compound Patterns - 6th Grade | LearnMaths.gr",
    metaDesc: "Interactive math exercises with 10 problems and automated grading on compound patterns, dual rules, two-quantity value tables, and real-life problems for 6th Grade.",
    backLinkText: "6th Grade",
    theoryBtn: "Theory",
    badgeHeader: "CHAPTER 65 • 6TH GRADE • PRACTICE",
    heroTitle: "Interactive Exercises: Compound Patterns & Quantities",
    heroDesc: "Solve 10 dynamic problems to practice dual rules, alternating sequences, two-quantity value tables, and general formula deductions!",
    newSetBtn: "New Questions",
    exerciseLabel: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "Write the answer...",
    checkBtn: "Check Answers",
    scoreLabel: "Score",
    answeredLabel: "Answered",
    percentageLabel: "Percentage",
    footerPrompt: "Answer all 10 questions and press 'Check Answers'!",
    excellentFeedback: "🎯 Excellent!",
    explainFeedback: "💡 Explanation:",
    tableColItem: "Item",
    tableColFormula: "Analysis / Formula",
    tableColVal: "Value"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const base = 3;
      const perKm = 2;
      const km = randInt(11, 18);
      const total = base + perKm * km;
      const correctText = `${total} €`;

      return {
        title: isEn ? 'Taxi Journey Fare' : 'Χρέωση Διαδρομής Ταξί',
        prompt: isEn
          ? `A taxi service charges a ${base} € starting fee plus ${perKm} € for each kilometer traveled. How much will a trip of ${km} kilometers cost?`
          : `Ένα ταξί έχει πάγιο εκκίνησης ${base} € και χρεώνει επιπλέον ${perKm} € για κάθε χιλιόμετρο της διαδρομής. Πόσο θα κοστίσει μια διαδρομή μήκους ${km} χιλιομέτρων;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Starting base fee' : 'Πάγιο εκκίνησης',
            formula: `${base} €`,
            val: `${base} €`
          },
          {
            item: isEn ? 'Kilometer charge' : 'Χρέωση χιλιομέτρων',
            formula: `${km} · ${perKm} €`,
            val: `${km * perKm} €`
          },
          {
            item: isEn ? 'Total journey cost' : 'Συνολικό κόστος',
            formula: `${base} ＋ (${km} · ${perKm}) €`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Calculating distance charge: ${km} · ${perKm} ＝ ${km * perKm} €. Adding base fee: ${base} ＋ ${km * perKm} ＝ ${total} €. (Formula: ${perKm} · n ＋ ${base}).`
              : `Υπολογίζουμε τη χρέωση των χιλιομέτρων: ${km} · ${perKm} ＝ ${km * perKm} €. Προσθέτουμε το πάγιο: ${base} ＋ ${km * perKm} ＝ ${total} €. (Τύπος: ${perKm} · ν ＋ ${base}).`}
          </span>
        ),
        distractors: [
          `${total + perKm} €`,
          `${km * perKm} €`,
          `${Math.max(base, total - perKm)} €`
        ]
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const base = 6;
      const perItem = 2;
      const items = randInt(7, 12);
      const total = base + perItem * items;
      const correctText = `${total} €`;

      return {
        title: isEn ? 'Subscription Base Fee & Movies' : 'Συνδρομή με Πάγιο & Ταινίες',
        prompt: isEn
          ? `A movie streaming platform charges a monthly subscription of ${base} € and an additional ${perItem} € per rented movie. How much will a subscriber pay who rented ${items} movies in a month?`
          : `Μια πλατφόρμα ταινιών χρεώνει μηνιαίο πάγιο ${base} € και επιπλέον ${perItem} € για κάθε ταινία που ενοικιάζει ο χρήστης. Πόσα χρήματα θα πληρώσει ένας συνδρομητής που νοίκιασε ${items} ταινίες σε έναν μήνα;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Monthly base fee' : 'Μηνιαίο πάγιο',
            formula: `${base} €`,
            val: `${base} €`
          },
          {
            item: isEn ? 'Movie rentals' : 'Ενοικίαση ταινιών',
            formula: `${items} · ${perItem} €`,
            val: `${items * perItem} €`
          },
          {
            item: isEn ? 'Final bill' : 'Τελικός λογαριασμός',
            formula: `${base} ＋ ${items * perItem} €`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Cost of movies: ${items} · ${perItem} ＝ ${items * perItem} €. Adding base fee: ${base} ＋ ${items * perItem} ＝ ${total} $.`
              : `Κόστος ταινιών: ${items} · ${perItem} ＝ ${items * perItem} €. Προσθέτουμε το πάγιο: ${base} ＋ ${items * perItem} ＝ ${total} €.`}
          </span>
        ),
        distractors: [
          `${total + 4} €`,
          `${items * perItem} €`,
          `${Math.max(base, total - 2)} €`
        ]
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const base = 5;
      const perHour = 3;
      const hours = randInt(4, 8);
      const total = base + perHour * hours;
      const correctText = `${total} €`;

      return {
        title: isEn ? 'Bicycle Rental' : 'Ενοικίαση Ποδηλάτου',
        prompt: isEn
          ? `A bike rental shop charges 5 € base insurance fee plus 3 € for each hour of use. How much will someone pay who rented the bike for ${hours} hours?`
          : `Ένα κατάστημα ενοικίασης ποδηλάτων χρεώνει 5 € βασικό ποσό ασφάλισης και επιπλέον 3 € για κάθε ώρα χρήσης. Πόσο θα πληρώσει κάποιος που νοίκιασε το ποδήλατο για ${hours} ώρες;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Basic insurance' : 'Βασική ασφάλιση',
            formula: `${base} €`,
            val: `${base} €`
          },
          {
            item: isEn ? 'Rental hours' : 'Ώρες χρήσης',
            formula: `${hours} · ${perHour} €`,
            val: `${hours * perHour} €`
          },
          {
            item: isEn ? 'Total payment' : 'Συνολικό ποσό',
            formula: `${base} ＋ ${hours * perHour} €`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Hourly rental: ${hours} · ${perHour} ＝ ${hours * perHour} €. Including insurance: ${base} ＋ ${hours * perHour} ＝ ${total} €.`
              : `Ώρες: ${hours} · ${perHour} ＝ ${hours * perHour} €. Μαζί με την ασφάλιση: ${base} ＋ ${hours * perHour} ＝ ${total} €.`}
          </span>
        ),
        distractors: [
          `${total + 3} €`,
          `${hours * perHour} €`,
          `${Math.max(base, total - 3)} €`
        ]
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const reg = 20;
      const perMonth = 25;
      const months = randInt(5, 8);
      const total = reg + perMonth * months;
      const correctText = `${total} €`;

      return {
        title: isEn ? 'Registration & Monthly Tuition' : 'Εγγραφή & Μηνιαία Δίδακτρα',
        prompt: isEn
          ? `In a robotics workshop, registration costs ${reg} € (one-time fee) and tuition is ${perMonth} € per month. How much money will a student pay in total for ${months} months of lessons?`
          : `Σε ένα εργαστήριο ρομποτικής η εγγραφή κοστίζει ${reg} € (εφάπαξ) και τα δίδακτρα είναι ${perMonth} € κάθε μήνα. Πόσα χρήματα θα πληρώσει συνολικά ένας μαθητής για ${months} μήνες μαθημάτων;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'One-time registration' : 'Εφάπαξ εγγραφή',
            formula: `${reg} €`,
            val: `${reg} €`
          },
          {
            item: isEn ? 'Tuition for months' : 'Δίδακτρα μηνών',
            formula: `${months} · ${perMonth} €`,
            val: `${months * perMonth} €`
          },
          {
            item: isEn ? 'Total payment' : 'Σύνολο πληρωμής',
            formula: `${reg} ＋ ${months * perMonth} €`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Tuition: ${months} · ${perMonth} ＝ ${months * perMonth} €. With registration: ${reg} ＋ ${months * perMonth} ＝ ${total} €.`
              : `Δίδακτρα: ${months} · ${perMonth} ＝ ${months * perMonth} €. Μαζί με την εγγραφή: ${reg} ＋ ${months * perMonth} ＝ ${total} €.`}
          </span>
        ),
        distractors: [
          `${total + perMonth} €`,
          `${months * perMonth} €`,
          `${Math.max(reg, total - 15)} €`
        ]
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const items = randInt(3, 6);
      const price = randInt(7, 11);
      const shipping = 5;
      const total = items * price + shipping;
      const correctText = `${total} €`;

      return {
        title: isEn ? 'Order Cost with Shipping Fee' : 'Κόστος Παραγγελίας με Μεταφορικά',
        prompt: isEn
          ? `An online bookstore charges a fixed ${shipping} € shipping fee per order. If we buy ${items} identical books for ${price} € each, what will be the total cost of the order?`
          : `Ένα ηλεκτρονικό βιβλιοπωλείο χρεώνει σταθερά ${shipping} € μεταφορικά έξοδα ανά παραγγελία. Αν αγοράσουμε ${items} ίδια βιβλία προς ${price} € το καθένα, ποιο θα είναι το συνολικό κόστος της παραγγελίας;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Books value' : 'Αξία βιβλίων',
            formula: `${items} · ${price} €`,
            val: `${items * price} €`
          },
          {
            item: isEn ? 'Shipping fee' : 'Μεταφορικά έξοδα',
            formula: `${shipping} €`,
            val: `${shipping} €`
          },
          {
            item: isEn ? 'Final cost' : 'Τελικό κόστος',
            formula: `${items * price} ＋ ${shipping} €`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Books: ${items} · ${price} ＝ ${items * price} €. Shipping included: ${items * price} ＋ ${shipping} ＝ ${total} €.`
              : `Βιβλία: ${items} · ${price} ＝ ${items * price} €. Μεταφορικά: ${items * price} ＋ ${shipping} ＝ ${total} €.`}
          </span>
        ),
        distractors: [
          `${items * price} €`,
          `${total + shipping} €`,
          `${Math.max(shipping, total - 2)} €`
        ]
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const initP = 40;
      const perM = 15;
      const months = randInt(6, 10);
      const total = initP + months * perM;
      const correctText = `${total} €`;

      return {
        title: isEn ? 'Savings with Initial Balance & Fixed Deposit' : 'Αποταμίευση με Αρχικό Ποσό & Σταθερή Κατάθεση',
        prompt: isEn
          ? `Maria already has ${initP} € in her savings account. She decides to deposit ${perM} € at the end of each month. How much money will she have in her account after ${months} months?`
          : `Η Μαρία έχει ήδη ${initP} € στον τραπεζικό της λογαριασμό. Αποφασίζει να καταθέτει ${perM} € στο τέλος κάθε μήνα. Πόσα χρήματα θα έχει στον λογαριασμό της μετά από ${months} μήνες;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Initial balance' : 'Αρχικό υπόλοιπο',
            formula: `${initP} €`,
            val: `${initP} €`
          },
          {
            item: isEn ? 'Monthly deposits' : 'Μηνιαίες καταθέσεις',
            formula: `${months} · ${perM} €`,
            val: `${months * perM} €`
          },
          {
            item: isEn ? 'Final balance' : 'Τελικό υπόλοιπο',
            formula: `${initP} ＋ ${months * perM} €`,
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Deposited over ${months} months: ${months} · ${perM} ＝ ${months * perM} €. Total accumulated balance: ${initP} ＋ ${months * perM} ＝ ${total} €.`
              : `Σε ${months} μήνες καταθέτει: ${months} · ${perM} ＝ ${months * perM} €. Συνολικό ποσό: ${initP} ＋ ${months * perM} ＝ ${total} €.`}
          </span>
        ),
        distractors: [
          `${months * perM} €`,
          `${total + perM} €`,
          `${Math.max(initP, total - 10)} €`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n = 8;
      const val = (n * (n + 1)) / 2;
      const correctText = String(val);

      return {
        title: isEn ? 'Compound Pattern with Changing Step' : 'Σύνθετο Μοτίβο με Μεταβαλλόμενο Βήμα (+2, +3, +4, +5...)',
        prompt: isEn
          ? 'Observe the sequence: 1, 3, 6, 10, 15, 21, ... (the step increments by 1 at each stage: ＋2, ＋3, ＋4, ＋5, ＋6...). What is the 8th term of the sequence?'
          : 'Παρατήρησε την ακολουθία: 1, 3, 6, 10, 15, 21, ... (το βήμα αυξάνεται κατά 1 σε κάθε στάδιο: ＋2, ＋3, ＋4, ＋5, ＋6...). Ποιος είναι ο 8ος όρος της ακολουθίας;',
        correctText,
        tableData: [
          { item: isEn ? '6th term' : '6ος όρος', formula: '21', val: '21' },
          { item: isEn ? '7th term (＋7)' : '7ος όρος (＋7)', formula: '21 ＋ 7', val: '28' },
          { item: isEn ? '8th term (＋8)' : '8ος όρος (＋8)', formula: '28 ＋ 8', val: `${val}` }
        ],
        explain: (
          <span>
            {isEn
              ? `After 21 we add 7 for the 7th term (21 ＋ 7 ＝ 28) and then add 8 for the 8th term: 28 ＋ 8 ＝ ${val}. Formula: `
              : `Μετά το 21 προσθέτουμε 7 για τον 7ο όρο (21 ＋ 7 ＝ 28) και έπειτα προσθέτουμε 8 για τον 8ο όρο: 28 ＋ 8 ＝ ${val}. Τύπος: `}
            <Fraction num="8 · 9" den="2" />
            {` ＝ ${val}.`}
          </span>
        ),
        distractors: [
          String(val - 2),
          String(val + 4),
          '30'
        ]
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n = randInt(15, 24);
      const mult = 5;
      const add = 7;
      const target = mult * n + add;
      const correctText = isEn ? `n ＝ ${n}` : `ν ＝ ${n}`;

      return {
        title: isEn ? 'Deducing Variable n in Compound Formula' : 'Εύρεση του ν σε Σύνθετο Τύπο',
        prompt: isEn
          ? `In a compound number pattern, the value is given by the formula: Value ＝ ${mult} · n ＋ ${add}. For which position n does the value equal ${target}?`
          : `Σε ένα σύνθετο αριθμητικό μοτίβο η τιμή του όρου υπολογίζεται από τον τύπο: Τιμή ＝ ${mult} · ν ＋ ${add}. Για ποια θέση ν η τιμή ισούται με ${target};`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Equation' : 'Εξίσωση',
            formula: isEn ? `${mult} · n ＋ ${add} ＝ ${target}` : `${mult} · ν ＋ ${add} ＝ ${target}`,
            val: isEn ? `${mult} · n ＝ ${target} － ${add}` : `${mult} · ν ＝ ${target} － ${add}`
          },
          {
            item: isEn ? 'Step 1 (subtraction)' : '1ο βήμα (αφαίρεση)',
            formula: `${target} － ${add}`,
            val: `${target - add}`
          },
          {
            item: isEn ? 'Step 2 (division)' : '2ο βήμα (διαίρεση)',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={`${target - add}`} den={`${mult}`} />
                <span className="ml-1">＝ {n}</span>
              </span>
            ),
            val: isEn ? `n ＝ ${n}` : `ν ＝ ${n}`
          }
        ],
        explain: (
          <span>
            {isEn
              ? `We solve the linear equation: ${mult} · n ＋ ${add} ＝ ${target} ➔ ${mult} · n ＝ ${target - add} ➔ n ＝ `
              : `Σχηματίζουμε την εξίσωση: ${mult} · ν ＋ ${add} ＝ ${target} ➔ ${mult} · ν ＝ ${target - add} ➔ ν ＝ `}
            <Fraction num={`${target - add}`} den={`${mult}`} />
            {isEn ? ` ＝ ${n}.` : ` ＝ ${n}.`}
          </span>
        ),
        distractors: isEn
          ? [`n ＝ ${n + 1}`, `n ＝ ${n - 1}`, `n ＝ ${n + 2}`]
          : [`ν ＝ ${n + 1}`, `ν ＝ ${n - 1}`, `ν ＝ ${n + 2}`]
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const a1 = 2;
      const a2 = a1 * 2 - 1;
      const a3 = a2 * 2 - 1;
      const a4 = a3 * 2 - 1;
      const a5 = a4 * 2 - 1;
      const a6 = a5 * 2 - 1;
      const a7 = a6 * 2 - 1;
      const correctText = String(a7);

      return {
        title: isEn
          ? 'Alternating Two-Operation Pattern (· 2 and － 1)'
          : 'Εναλλασσόμενο Μοτίβο Δύο Πράξεων (· 2 και － 1)',
        prompt: isEn
          ? `Observe the sequence: ${a1}, ${a2}, ${a3}, ${a4}, ${a5}, ${a6}, ... What is the immediate next number?`
          : `Παρατήρησε την ακολουθία: ${a1}, ${a2}, ${a3}, ${a4}, ${a5}, ${a6}, ... Ποιος είναι ο αμέσως επόμενος αριθμός;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Rule' : 'Κανόνας',
            formula: '· 2 － 1',
            val: isEn ? 'Double and subtract 1' : 'Διπλασιάζουμε και αφαιρούμε 1'
          },
          {
            item: isEn ? 'Last known term' : 'Τελευταίος γνωστός όρος',
            formula: `${a6}`,
            val: `${a6}`
          },
          {
            item: isEn ? 'Next term' : 'Επόμενος όρος',
            formula: `(${a6} · 2) － 1 ＝ ${a6 * 2} － 1`,
            val: `${a7}`
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Each term is found by doubling the previous term and subtracting 1: (${a6} · 2) － 1 ＝ ${a6 * 2} － 1 ＝ ${a7}.`
              : `Κάθε όρος προκύπτει διπλασιάζοντας τον προηγούμενο και αφαιρώντας 1: (${a6} · 2) － 1 ＝ ${a6 * 2} － 1 ＝ ${a7}.`}
          </span>
        ),
        distractors: [
          String(a6 * 2),
          String(a7 + 2),
          String(a7 - 4)
        ]
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const correctText = isEn
        ? 'At 5 visits (cost is 15 € in both)'
        : 'Στις 5 επισκέψεις (κόστος 15 € και στα δύο)';

      return {
        title: isEn ? 'Comparing Two Compound Billing Plans' : 'Σύγκριση Δύο Σύνθετων Προγραμμάτων Χρέωσης',
        prompt: isEn
          ? 'A gym offers two membership plans: Plan A charges a 10 € base subscription fee plus 1 € per visit. Plan B has no base fee but charges 3 € per visit. For how many visits is the total cost identical in both plans?'
          : 'Ένα γυμναστήριο προσφέρει δύο προγράμματα: Το Πρόγραμμα Α χρεώνει 10 € πάγιο συνδρομής και 1 € για κάθε επίσκεψη. Το Πρόγραμμα Β δεν έχει πάγιο αλλά χρεώνει 3 € ανά επίσκεψη. Για πόσες επισκέψεις το κόστος είναι ακριβώς το ίδιο και στα δύο προγράμματα;',
        correctText,
        tableData: [
          {
            item: isEn ? 'Plan A (n visits)' : 'Πρόγραμμα Α (ν επισκέψεις)',
            formula: isEn ? '1 · n ＋ 10' : '1 · ν ＋ 10',
            val: isEn ? 'n ＋ 10' : 'ν ＋ 10'
          },
          {
            item: isEn ? 'Plan B (n visits)' : 'Πρόγραμμα Β (ν επισκέψεις)',
            formula: isEn ? '3 · n' : '3 · ν',
            val: isEn ? '3 · n' : '3 · ν'
          },
          {
            item: isEn ? 'Equality equation' : 'Εξίσωση ισότητας',
            formula: isEn ? '3 · n ＝ n ＋ 10 ➔ 2 · n ＝ 10' : '3 · ν ＝ ν ＋ 10 ➔ 2 · ν ＝ 10',
            val: isEn ? 'n ＝ 5 visits (5 · 3 ＝ 15 €)' : 'ν ＝ 5 επισκέψεις (5 · 3 ＝ 15 €)'
          }
        ],
        explain: (
          <span>
            {isEn
              ? 'Equating the two patterns: 3 · n ＝ n ＋ 10 ➔ 2 · n ＝ 10 ➔ n ＝ 5 visits. In both plans, 5 visits cost 15 €.'
              : 'Εξισώνουμε τα δύο μοτίβα: 3 · ν ＝ ν ＋ 10 ➔ 2 · ν ＝ 10 ➔ ν ＝ 5 επισκέψεις. Και στα δύο προγράμματα το κόστος για 5 επισκέψεις είναι 15 €.'}
          </span>
        ),
        distractors: isEn
          ? ['At 4 visits', 'At 6 visits', 'At 10 visits']
          : ['Στις 4 επισκέψεις', 'Στις 6 επισκέψεις', 'Στις 10 επισκέψεις']
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n = 10;
      const res = n * n + 2;
      const correctText = String(res);

      return {
        title: isEn
          ? 'Compound Quadratic Pattern (n² ＋ 2)'
          : 'Σύνθετο Μοτίβο με Τετράγωνα & Προσθήκη (ν² ＋ 2)',
        prompt: isEn
          ? `Given the sequence: 3, 6, 11, 18, 27, ... following the formula: Value ＝ n² ＋ 2. What is the 10th term (n ＝ 10)?`
          : `Δίνεται η ακολουθία: 3, 6, 11, 18, 27, ... που ακολουθεί τον κανόνα: Τιμή ＝ ν² ＋ 2. Ποιος είναι ο 10ος όρος (ν ＝ 10) της ακολουθίας;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Rule' : 'Κανόνας',
            formula: isEn ? 'n · n ＋ 2' : 'ν · ν ＋ 2',
            val: '10 · 10 ＋ 2'
          },
          {
            item: isEn ? 'Square computation' : 'Υπολογισμός τετραγώνου',
            formulaNode: (
              <span>
                10<sup>2</sup>
              </span>
            ),
            val: '100'
          },
          {
            item: isEn ? 'Final term' : 'Τελική τιμή',
            formula: '100 ＋ 2',
            val: `${res}`
          }
        ],
        explain: (
          <span>
            {isEn
              ? `For n ＝ 10 we apply n² ＋ 2: 10 · 10 ＋ 2 ＝ 100 ＋ 2 ＝ ${res}.`
              : `Για ν ＝ 10 εφαρμόζουμε τον κανόνα ν² ＋ 2: 10 · 10 ＋ 2 ＝ 100 ＋ 2 ＝ ${res}.`}
          </span>
        ),
        distractors: [
          String(res + 2),
          String(res - 4),
          '100'
        ]
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const isEn = locale === 'en';
      return {
        title: isEn ? 'Incremental Odd Differences Pattern' : 'Πυραμίδα Αριθμών με Άθροισμα',
        prompt: isEn
          ? 'Observe the compound pattern: 4 ➔ 7 ➔ 12 ➔ 19 ➔ ... (the differences are ＋3, ＋5, ＋7, ... consecutive odd numbers). What is the next number after 19?'
          : 'Παρατήρησε το σύνθετο μοτίβο των αριθμών: 4 ➔ 7 ➔ 12 ➔ 19 ➔ ... (οι διαφορές είναι: ＋3, ＋5, ＋7, ... διαδοχικοί περιττοί αριθμοί). Ποιος είναι ο αμέσως επόμενος αριθμός μετά το 19;',
        correctText: '28',
        tableData: [
          {
            item: isEn ? 'Differences' : 'Διαφορές',
            formula: '7 － 4 ＝ 3, 12 － 7 ＝ 5, 19 － 12 ＝ 7',
            val: '＋3, ＋5, ＋7'
          },
          {
            item: isEn ? 'Next increment' : 'Επόμενη διαφορά',
            formula: isEn ? 'Next odd number' : 'Επόμενος περιττός αριθμός',
            val: '＋9'
          },
          {
            item: isEn ? 'Next term' : 'Επόμενος όρος',
            formula: '19 ＋ 9',
            val: '28'
          }
        ],
        explain: (
          <span>
            {isEn
              ? 'The consecutive differences are the odd numbers 3, 5, 7, 9. After 19, we add 9: 19 ＋ 9 ＝ 28.'
              : 'Οι διαφορές ανάμεσα στους όρους είναι οι περιττοί αριθμοί 3, 5, 7, 9. Μετά το 19 προσθέτουμε 9: 19 ＋ 9 ＝ 28.'}
          </span>
        ),
        distractors: ['26', '27', '30']
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale) {
  const isEn = locale === 'en';

  // Q1: Input - Σύνθετο μοτίβο με διπλή πράξη (· 2 ＋ 1)
  const q1A = randInt(2, 4);
  const q1B = q1A * 2 + 1;
  const q1C = q1B * 2 + 1;
  const q1D = q1C * 2 + 1;
  const q1Next = q1D * 2 + 1;

  // Q2: Input - Εναλλασσόμενο μοτίβο (+stepAdd, -1)
  const q2Start = randInt(4, 8);
  const q2StepAdd = randInt(3, 5);
  const q2StepSub = 1;
  const q2_1 = q2Start;
  const q2_2 = q2_1 + q2StepAdd;
  const q2_3 = q2_2 - q2StepSub;
  const q2_4 = q2_3 + q2StepAdd;
  const q2_5 = q2_4 - q2StepSub;
  const q2Next = q2_5 + q2StepAdd;

  // Q3: Input - Υπολογισμός όρου από σύνθετο τύπο: 3ν + 4
  const q3N = randInt(6, 12);
  const q3Res = 3 * q3N + 4;

  // Q4: MCQ - Αναγνώριση κανόνα από ακολουθία
  const q4Correct = isEn
    ? 'Multiply by 2 and add 1 (· 2 ＋ 1)'
    : 'Πολλαπλασιάζουμε επί 2 και προσθέτουμε 1 (· 2 ＋ 1)';
  const q4Distractors = isEn
    ? [
        'Steadily add the number 4',
        'Steadily multiply by 3',
        'Divide by 2 and add 5'
      ]
    : [
        'Προσθέτουμε σταθερά τον αριθμό 4',
        'Πολλαπλασιάζουμε σταθερά επί 3',
        'Διαιρούμε με το 2 και προσθέτουμε 5'
      ];
  const q4Options = makeUniqueOptions(q4Correct, q4Distractors);

  // Q5: True/False - Έννοια σύνθετου μοτίβου
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = isEn
    ? (q5IsTrue
        ? 'In a compound pattern, the rule can combine more than one mathematical operation (e.g. multiplication and addition together).'
        : 'In every numerical pattern, the difference between two consecutive terms is strictly a constant number.')
    : (q5IsTrue
        ? 'Σε ένα σύνθετο μοτίβο, ο κανόνας μπορεί να περιλαμβάνει περισσότερες από μία πράξεις (π.χ. πολλαπλασιασμό και πρόσθεση μαζί).'
        : 'Σε κάθε μοτίβο η διαφορά ανάμεσα σε δύο διαδοχικούς όρους είναι υποχρεωτικά ένας σταθερός αριθμός.');

  // Q6: True/False - Πίνακες δύο μεγεθών
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = isEn
    ? (q6IsTrue
        ? 'A value table of two quantities helps us observe how one quantity changes relative to another (e.g. time and cost).'
        : 'In two-quantity value tables, the quantities are always completely independent and never linked by a mathematical rule.')
    : (q6IsTrue
        ? 'Ένας πίνακας τιμών δύο μεγεθών μάς βοηθά να παρατηρήσουμε πώς μεταβάλλεται ένα μέγεθος καθώς αλλάζει ένα άλλο (π.χ. χρόνος και κόστος).'
        : 'Στους πίνακες τιμών δύο μεγεθών τα δύο μεγέθη είναι πάντοτε εντελώς ανεξάρτητα και δεν συνδέονται ποτέ με μαθηματικό κανόνα.');

  // Q7: Input - Εφαρμογή τύπου κόστους (4ν + 5)
  const q7N = randInt(8, 15);
  const q7Res = 4 * q7N + 5;

  // Q8: MCQ - Εύρεση γενικού τύπου από ζεύγη τιμών
  const q8Correct = isEn ? '4 · n ＋ 1' : '4 · ν ＋ 1';
  const q8Distractors = isEn
    ? ['3 · n ＋ 2', '5 · n － 1', '2 · n ＋ 3']
    : ['3 · ν ＋ 2', '5 · ν － 1', '2 · ν ＋ 3'];
  const q8Options = makeUniqueOptions(q8Correct, q8Distractors);

  // Q9: Standard Problem
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate(locale);
  const q9Options = makeUniqueOptions(q9Raw.correctText, q9Raw.distractors);

  // Q10: Hard Problem
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate(locale);
  const q10Options = makeUniqueOptions(q10Raw.correctText, q10Raw.distractors);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Compound Pattern (· 2 ＋ 1)' : 'Σύνθετο Μοτίβο (· 2 ＋ 1)',
      prompt: isEn
        ? `Find the next term of the sequence: ${q1A}, ${q1B}, ${q1C}, ${q1D}, ...`
        : `Βρες τον επόμενο όρο της ακολουθίας: ${q1A}, ${q1B}, ${q1C}, ${q1D}, ...`,
      correct: String(q1Next),
      explain: (
        <span>
          {isEn
            ? `At each step we double and add 1: (${q1D} · 2) ＋ 1 ＝ ${q1D * 2} ＋ 1 ＝ ${q1Next}.`
            : `Σε κάθε βήμα διπλασιάζουμε και προσθέτουμε 1: (${q1D} · 2) ＋ 1 ＝ ${q1D * 2} ＋ 1 ＝ ${q1Next}.`}
        </span>
      )
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: isEn ? `Alternating Pattern (＋${q2StepAdd}, －1)` : `Εναλλασσόμενο Μοτίβο (＋${q2StepAdd}, －1)`,
      prompt: isEn
        ? `Find the next number of the sequence: ${q2_1}, ${q2_2}, ${q2_3}, ${q2_4}, ${q2_5}, ...`
        : `Βρες τον επόμενο αριθμό της ακολουθίας: ${q2_1}, ${q2_2}, ${q2_3}, ${q2_4}, ${q2_5}, ...`,
      correct: String(q2Next),
      explain: (
        <span>
          {isEn
            ? `Operations alternate: ＋${q2StepAdd} followed by －1. After ${q2_5} we add ${q2StepAdd}: ${q2_5} ＋ ${q2StepAdd} ＝ ${q2Next}.`
            : `Οι πράξεις εναλλάσσονται: ＋${q2StepAdd} και μετά －1. Μετά το ${q2_5} προσθέτουμε ${q2StepAdd}: ${q2_5} ＋ ${q2StepAdd} ＝ ${q2Next}.`}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Calculating from Compound Formula' : 'Υπολογισμός από Σύνθετο Τύπο',
      prompt: isEn
        ? `A compound pattern has the formula: Value ＝ 3 · n ＋ 4. What is the value for position n ＝ ${q3N}?`
        : `Ένα σύνθετο μοτίβο έχει γενικό τύπο: Τιμή ＝ 3 · ν ＋ 4. Ποια είναι η τιμή για θέση ν ＝ ${q3N};`,
      correct: String(q3Res),
      explain: (
        <span>
          {isEn
            ? `Substitute n ＝ ${q3N}: (3 · ${q3N}) ＋ 4 ＝ ${3 * q3N} ＋ 4 ＝ ${q3Res}.`
            : `Αντικαθιστούμε ν ＝ ${q3N}: (3 · ${q3N}) ＋ 4 ＝ ${3 * q3N} ＋ 4 ＝ ${q3Res}.`}
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: isEn ? 'Recognizing Compound Rule' : 'Αναγνώριση Σύνθετου Κανόνα',
      prompt: isEn
        ? 'What is the formation rule of the sequence: 3, 7, 15, 31, 63, ...?'
        : 'Ποιος είναι ο κανόνας σχηματισμού της ακολουθίας: 3, 7, 15, 31, 63, ...;',
      options: q4Options,
      correct: q4Correct,
      explain: (
        <span>
          {isEn
            ? 'Observe: 3 · 2 ＋ 1 ＝ 7, 7 · 2 ＋ 1 ＝ 15, 15 · 2 ＋ 1 ＝ 31, 31 · 2 ＋ 1 ＝ 63. The rule combines multiplication with addition.'
            : 'Παρατηρούμε: 3 · 2 ＋ 1 ＝ 7, 7 · 2 ＋ 1 ＝ 15, 15 · 2 ＋ 1 ＝ 31, 31 · 2 ＋ 1 ＝ 63. Ο κανόνας συνδυάζει πολλαπλασιασμό και πρόσθεση.'}
        </span>
      )
    },
    {
      id: 'q5',
      type: 'tf',
      title: isEn ? 'Compound Patterns Core Feature' : 'Χαρακτηριστικό Σύνθετων Μοτίβων',
      text: q5Text,
      correct: q5IsTrue,
      explain: (
        <span>
          {isEn
            ? (q5IsTrue
                ? 'Correct! In compound patterns, the rule can combine multiple operations or alternating step sizes.'
                : 'False! In many patterns the difference is not constant (e.g. geometric growth, alternating steps).')
            : (q5IsTrue
                ? 'Σωστά! Στα σύνθετα μοτίβα ο κανόνας μπορεί να περιλαμβάνει περισσότερες από μία πράξεις ή μεταβαλλόμενα βήματα.'
                : 'Λάθος! Υπάρχουν πολλά μοτίβα όπου η διαφορά δεν είναι σταθερή αλλά αλλάζει (π.χ. πολλαπλασιασμός, εναλλαγή πράξεων).')}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'tf',
      title: isEn ? 'Two-Quantity Correlation Tables' : 'Πίνακες Συσχέτισης Μεγεθών',
      text: q6Text,
      correct: q6IsTrue,
      explain: (
        <span>
          {isEn
            ? (q6IsTrue
                ? 'Correct! A two-quantity value table explicitly captures the mathematical relationship connecting two variables.'
                : 'False! Two-quantity tables are designed specifically to deduce and analyze the rule linking the quantities.')
            : (q6IsTrue
                ? 'Σωστά! Ένας πίνακας τιμών δύο μεγεθών αποτυπώνει καθαρά τη μαθηματική σχέση ανάμεσα σε δύο μεταβλητές.'
                : 'Λάθος! Οι πίνακες δύο μεγεθών κατασκευάζονται ακριβώς για να ανακαλύψουμε και να μελετήσουμε τον κανόνα που συνδέει τα δύο μεγέθη.')}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Rule Application (4 · n ＋ 5)' : 'Εφαρμογή Κανόνα (4 · ν ＋ 5)',
      prompt: isEn
        ? `A pricing scheme follows the formula: Cost ＝ 4 · n ＋ 5. What is the cost for n ＝ ${q7N}?`
        : `Ένα σύστημα χρέωσης ακολουθεί τον τύπο: Κόστος ＝ 4 · ν ＋ 5. Πόσο είναι το κόστος για ν ＝ ${q7N};`,
      correct: String(q7Res),
      explain: (
        <span>
          {isEn
            ? `Apply the formula for n ＝ ${q7N}: (4 · ${q7N}) ＋ 5 ＝ ${4 * q7N} ＋ 5 ＝ ${q7Res}.`
            : `Εφαρμόζουμε τον τύπο για ν ＝ ${q7N}: (4 · ${q7N}) ＋ 5 ＝ ${4 * q7N} ＋ 5 ＝ ${q7Res}.`}
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: isEn ? 'Formula Deduction from Value Pairs' : 'Εύρεση Τύπου από Ζεύγη Τιμών',
      prompt: isEn
        ? 'For position n ＝ 1 the value is 5, for n ＝ 2 it is 9, for n ＝ 3 it is 13, for n ＝ 4 it is 17. What is the general formula?'
        : 'Για θέση ν ＝ 1 η τιμή είναι 5, για ν ＝ 2 είναι 9, για ν ＝ 3 είναι 13, για ν ＝ 4 είναι 17. Ποιος είναι ο γενικός τύπος;',
      options: q8Options,
      correct: q8Correct,
      explain: (
        <span>
          {isEn
            ? 'The difference between consecutive values is 4 (hence 4 · n). For n ＝ 1: 4 · 1 ＋ 1 ＝ 5. Thus the formula is 4 · n ＋ 1.'
            : 'Η διαφορά ανάμεσα στις τιμές είναι 4 (άρα περιέχει το 4 · ν). Για ν ＝ 1: 4 · 1 ＋ 1 ＝ 5. Άρα ο τύπος είναι 4 · ν ＋ 1.'}
        </span>
      )
    },
    {
      id: 'q9',
      type: 'mcq',
      title: `${isEn ? 'Problem' : 'Πρόβλημα'}: ${q9Raw.title}`,
      prompt: q9Raw.prompt,
      options: q9Options,
      correct: q9Raw.correctText,
      tableData: q9Raw.tableData,
      explain: q9Raw.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${isEn ? 'Advanced Problem' : 'Σύνθετο Πρόβλημα'}: ${q10Raw.title}`,
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

export default function SinthetaMotibaExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = useMemo(() => I18N[locale] || I18N.el, [locale]);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions(locale);
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach((q) => {
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

  // Χειρισμός απαντήσεων: sanitize για inputs, αυτούσιο για mcq/tf
  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      const q = questions.find((item) => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        sanitized = sanitized.replace(/\./g, ',').replace(/[^0-9,]/g, '');
        const parts = sanitized.split(',');
        if (parts.length > 2) {
          sanitized = parts[0] + ',' + parts.slice(1).join('');
        }
      }
      if (sanitized.length > 10) {
        sanitized = sanitized.slice(0, 10);
      }
      setAnswers((prev) => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers((prev) => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? String(q.altCorrect).replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').trim().toLowerCase() : null;
      return cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt);
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
    questions.forEach((q) => {
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
    (val) => val !== undefined && val !== null && String(val).trim() !== ''
  ).length;

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/st-dimotikou"
      backText={t.backLinkText}
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/65-sintheta-motiba"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 min-w-0">
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>{toCleanUppercase(t.badgeHeader)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase(t.newSetBtn)}</span>
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
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 ${getCardStyle(
                    q
                  )}`}
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider">
                        {toCleanUppercase(`${t.exerciseLabel} ${qNum}: ${q.title}`)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <div className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4 break-words [overflow-wrap:anywhere]">
                      {q.type === 'tf' ? (
                        <span>«{q.text}»</span>
                      ) : (
                        <span>{q.prompt}</span>
                      )}
                    </div>

                    {/* INPUTS / OPTIONS */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, opt, 'mcq')}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1 flex items-center justify-center min-h-[48px] ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'input' && (
                      <div className="space-y-2 mb-3">
                        <input
                          key={`input-${q.id}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode={q.inputType === 'decimal' ? 'decimal' : 'numeric'}
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
                        <div className="w-full overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200 block">
                          <table className="w-full text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase(t.tableColItem)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableColFormula)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableColVal)}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900 break-words">
                                    {row.item}
                                  </td>
                                  <td className="p-1.5 text-indigo-700 break-words">
                                    {row.formulaNode || row.formula}
                                  </td>
                                  <td className="p-1.5 font-black text-emerald-700 whitespace-nowrap">
                                    {row.valNode || row.val}
                                  </td>
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
                          {isQuestionCorrect(q) ? t.excellentFeedback : t.explainFeedback}
                        </p>
                        <div>{q.explain}</div>
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
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>
                {submitted ? toCleanUppercase(t.scoreLabel) : toCleanUppercase(t.answeredLabel)}:
              </span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.percentageLabel)}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 10) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* GUIDANCE OR RESTART */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newSetBtn)}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.footerPrompt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
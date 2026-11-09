// pages/st-dimotikou/62-xrimata-ask.js
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

// Μορφοποίηση αριθμού ανάλογα με το locale
function formatNum(val, locale = 'el', decimals = 0) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  const num = Number(val);
  if (Number.isInteger(num) && decimals === 0) {
    return num.toLocaleString(loc);
  }
  return num.toLocaleString(loc, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Μορφοποίηση νομισματικού ποσού
function formatCurrency(val, locale = 'el') {
  const formatted = formatNum(val, locale, 2);
  return `${formatted} €`;
}

// ---------------------------------------------------------
// ΔΙΕΘΝΟΠΟΙΗΣΗ (i18n) & ΛΕΞΙΚΟ
// ---------------------------------------------------------

const I18N = {
  el: {
    metaTitle: "Ασκήσεις: Το Ευρώ, Μετατροπές & Τόκος - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα χρήματα, τις μετατροπές ευρώ και λεπτών, τα ρέστα και τον τόκο για τη ΣΤ' Δημοτικού.",
    backLinkText: "ΣΤ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeHeader: "ΚΕΦΑΛΑΙΟ 62 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Διαδραστικές Ασκήσεις: Χρήματα, Μετατροπές & Τόκος",
    heroDesc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στις μετατροπές ευρώ και λεπτών, στους υπολογισμούς ρέστων και στον τραπεζικό τύπο του τόκου!",
    newSetBtn: "Νέες Ασκήσεις",
    exerciseLabel: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputNumberPlaceholder: "Απάντηση...",
    inputDecimalPlaceholder: "π.χ. 3,60",
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
    metaTitle: "Exercises: The Euro, Conversions & Simple Interest - 6th Grade | LearnMaths.gr",
    metaDesc: "Interactive math exercises with 10 problems and automated grading on money, euro and cent conversions, change, and simple interest for 6th Grade.",
    backLinkText: "6th Grade",
    theoryBtn: "Theory",
    badgeHeader: "CHAPTER 62 • 6TH GRADE • PRACTICE",
    heroTitle: "Interactive Exercises: Money, Conversions & Interest",
    heroDesc: "Solve 10 dynamic problems to practice euro and cent conversions, change calculations, and the simple interest formula!",
    newSetBtn: "New Questions",
    exerciseLabel: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputNumberPlaceholder: "Answer...",
    inputDecimalPlaceholder: "e.g. 3.60",
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
      const itemsA = 3;
      const priceA = 1.8;
      const itemsB = 2;
      const priceB = 0.85;
      const paid = 10;
      const costTotal = itemsA * priceA + itemsB * priceB;
      const change = Number((paid - costTotal).toFixed(2));
      const changeStr = formatCurrency(change, locale);

      return {
        title: isEn ? 'Bookstore Purchases' : 'Αγορές στο Βιβλιοπωλείο',
        prompt: isEn
          ? `Helen bought ${itemsA} notebooks for 1.80 € each and ${itemsB} pens for 0.85 € each. She paid with a ${paid} € banknote. How much change will she receive?`
          : `Η Ελένη αγόρασε ${itemsA} τετράδια προς 1,80 € το καθένα και ${itemsB} στυλό προς 0,85 € το καθένα. Πλήρωσε με χαρτονόμισμα των ${paid} €. Πόσα ρέστα θα πάρει;`,
        correctText: changeStr,
        tableData: [
          {
            item: isEn ? 'Notebooks cost' : 'Κόστος τετραδίων',
            formula: isEn ? `${itemsA} · 1.80 €` : `${itemsA} · 1,80 €`,
            val: formatCurrency(itemsA * priceA, locale)
          },
          {
            item: isEn ? 'Pens cost' : 'Κόστος στυλό',
            formula: isEn ? `${itemsB} · 0.85 €` : `${itemsB} · 0,85 €`,
            val: formatCurrency(itemsB * priceB, locale)
          },
          {
            item: isEn ? 'Total expenditure' : 'Συνολική δαπάνη',
            formula: isEn ? '5.40 ＋ 1.70 €' : '5,40 ＋ 1,70 €',
            val: formatCurrency(costTotal, locale)
          },
          {
            item: isEn ? 'Change' : 'Ρέστα',
            formula: isEn ? `${paid}.00 － ${formatNum(costTotal, locale, 2)} €` : `${paid},00 － ${formatNum(costTotal, locale, 2)} €`,
            val: changeStr
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Calculating expenditure: (${itemsA} · 1.80) ＋ (${itemsB} · 0.85) ＝ 5.40 ＋ 1.70 ＝ ${formatNum(costTotal, locale, 2)} €. Subtracting from payment: ${paid} － ${formatNum(costTotal, locale, 2)} ＝ ${changeStr}.`
              : `Υπολογίζουμε τη δαπάνη: (${itemsA} · 1,80) ＋ (${itemsB} · 0,85) ＝ 5,40 ＋ 1,70 ＝ ${formatNum(costTotal, locale, 2)} €. Αφαιρούμε από το χαρτονόμισμα: ${paid} － ${formatNum(costTotal, locale, 2)} ＝ ${changeStr}.`}
          </span>
        ),
        distractors: [
          formatCurrency(change + 1, locale),
          formatCurrency(Math.max(0.5, change - 0.5), locale),
          formatCurrency(paid - itemsA * priceA, locale)
        ]
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const kgA = 2.5;
      const priceA = 1.4;
      const kgB = 1.5;
      const priceB = 1.2;
      const paid = 10;
      const costTotal = kgA * priceA + kgB * priceB;
      const change = Number((paid - costTotal).toFixed(2));
      const changeStr = formatCurrency(change, locale);

      return {
        title: isEn ? 'Grocery Fruit Shopping' : 'Αγορά Φρούτων στο Μανάβικο',
        prompt: isEn
          ? `A customer bought 2.5 kg of apples for 1.40 € per kg and 1.5 kg of oranges for 1.20 € per kg. They paid with a ${paid} € banknote. How much change did they receive?`
          : `Ένας πελάτης αγόρασε 2,5 κιλά μήλα προς 1,40 € το κιλό και 1,5 κιλό πορτοκάλια προς 1,20 € το κιλό. Πλήρωσε με χαρτονόμισμα των ${paid} €. Πόσα ρέστα πήρε;`,
        correctText: changeStr,
        tableData: [
          {
            item: isEn ? 'Apples' : 'Μήλα',
            formula: isEn ? '2.5 · 1.40 €' : '2,5 · 1,40 €',
            val: formatCurrency(3.5, locale)
          },
          {
            item: isEn ? 'Oranges' : 'Πορτοκάλια',
            formula: isEn ? '1.5 · 1.20 €' : '1,5 · 1,20 €',
            val: formatCurrency(1.8, locale)
          },
          {
            item: isEn ? 'Total cost' : 'Συνολικό κόστος',
            formula: isEn ? '3.50 ＋ 1.80 €' : '3,50 ＋ 1,80 €',
            val: formatCurrency(5.3, locale)
          },
          {
            item: isEn ? 'Change' : 'Ρέστα',
            formula: isEn ? '10.00 － 5.30 €' : '10,00 － 5,30 €',
            val: changeStr
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Cost of apples: 2.5 · 1.40 ＝ 3.50 €. Cost of oranges: 1.5 · 1.20 ＝ 1.80 €. Total: 3.50 ＋ 1.80 ＝ 5.30 €. Change: 10.00 － 5.30 ＝ ${changeStr}.`
              : `Κόστος μήλων: 2,5 · 1,40 ＝ 3,50 €. Κόστος πορτοκαλιών: 1,5 · 1,20 ＝ 1,80 €. Σύνολο: 3,50 ＋ 1,80 ＝ 5,30 €. Ρέστα: 10,00 － 5,30 ＝ ${changeStr}.`}
          </span>
        ),
        distractors: [
          formatCurrency(change + 0.4, locale),
          formatCurrency(Math.max(0.5, change - 1), locale),
          formatCurrency(5.3, locale)
        ]
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const count = 4;
      const priceToast = 1.75;
      const priceJuice = 0.9;
      const paid = 20;
      const costTotal = count * priceToast + count * priceJuice;
      const change = Number((paid - costTotal).toFixed(2));
      const changeStr = formatCurrency(change, locale);

      return {
        title: isEn ? 'Canteen Treats' : 'Κέρασμα στο Κυλικείο',
        prompt: isEn
          ? `Kostas bought ${count} sandwiches for 1.75 € each and ${count} juice boxes for 0.90 € each from the canteen. He paid with a ${paid} € banknote. How much change did he receive?`
          : `Ο Κώστας αγόρασε από το κυλικείο ${count} τοστ προς 1,75 € το καθένα και ${count} χυμούς προς 0,90 € τον καθένα. Πλήρωσε με χαρτονόμισμα των ${paid} €. Πόσα ρέστα έλαβε;`,
        correctText: changeStr,
        tableData: [
          {
            item: isEn ? 'Sandwiches' : 'Τοστ',
            formula: isEn ? `${count} · 1.75 €` : `${count} · 1,75 €`,
            val: formatCurrency(7, locale)
          },
          {
            item: isEn ? 'Juices' : 'Χυμοί',
            formula: isEn ? `${count} · 0.90 €` : `${count} · 0,90 €`,
            val: formatCurrency(3.6, locale)
          },
          {
            item: isEn ? 'Total purchases' : 'Σύνολο αγορών',
            formula: isEn ? '7.00 ＋ 3.60 €' : '7,00 ＋ 3,60 €',
            val: formatCurrency(10.6, locale)
          },
          {
            item: isEn ? 'Change' : 'Ρέστα',
            formula: isEn ? '20.00 － 10.60 €' : '20,00 － 10,60 €',
            val: changeStr
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Sandwiches: ${count} · 1.75 ＝ 7.00 €. Juices: ${count} · 0.90 ＝ 3.60 €. Total: 7.00 ＋ 3.60 ＝ 10.60 €. Change: ${paid} － 10.60 ＝ ${changeStr}.`
              : `Τοστ: ${count} · 1,75 ＝ 7,00 €. Χυμοί: ${count} · 0,90 ＝ 3,60 €. Σύνολο: 7,00 ＋ 3,60 ＝ 10,60 €. Ρέστα: ${paid} － 10,60 ＝ ${changeStr}.`}
          </span>
        ),
        distractors: [
          formatCurrency(change + 1, locale),
          formatCurrency(Math.max(1, change - 0.4), locale),
          formatCurrency(10.6, locale)
        ]
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const p1 = 14.5;
      const p2 = 3.8;
      const p3 = 6.2;
      const paid = 50;
      const costTotal = p1 + p2 + p3;
      const change = Number((paid - costTotal).toFixed(2));
      const changeStr = formatCurrency(change, locale);

      return {
        title: isEn ? 'Sports Equipment Purchase' : 'Αγορά Αθλητικού Εξοπλισμού',
        prompt: isEn
          ? `A student bought a ball for 14.50 €, a pair of socks for 3.80 €, and a cap for 6.20 €. They paid with a ${paid} € banknote. How much change did they receive?`
          : `Ένας μαθητής αγόρασε μια μπάλα προς 14,50 €, ένα ζευγάρι κάλτσες προς 3,80 € και ένα καπελάκι προς 6,20 €. Πλήρωσε με χαρτονόμισμα των ${paid} €. Πόσα ρέστα πήρε;`,
        correctText: changeStr,
        tableData: [
          {
            item: isEn ? 'Sports items' : 'Αθλητικά είδη',
            formula: isEn ? '14.50 ＋ 3.80 ＋ 6.20 €' : '14,50 ＋ 3,80 ＋ 6,20 €',
            val: formatCurrency(24.5, locale)
          },
          {
            item: isEn ? 'Payment' : 'Πληρωμή',
            formula: formatCurrency(50, locale),
            val: formatCurrency(50, locale)
          },
          {
            item: isEn ? 'Change' : 'Ρέστα',
            formula: isEn ? '50.00 － 24.50 €' : '50,00 － 24,50 €',
            val: changeStr
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Total expenditure: 14.50 ＋ 3.80 ＋ 6.20 ＝ 24.50 €. Change: 50.00 － 24.50 ＝ ${changeStr}.`
              : `Συνολικό κόστος: 14,50 ＋ 3,80 ＋ 6,20 ＝ 24,50 €. Ρέστα: 50,00 － 24,50 ＝ ${changeStr}.`}
          </span>
        ),
        distractors: [
          formatCurrency(change + 2, locale),
          formatCurrency(Math.max(1, change - 1), locale),
          formatCurrency(24.5, locale)
        ]
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const adult = 2;
      const pAdult = 12.5;
      const child = 2;
      const pChild = 7.5;
      const paid = 50;
      const costTotal = adult * pAdult + child * pChild;
      const change = Number((paid - costTotal).toFixed(2));
      const changeStr = formatCurrency(change, locale);

      return {
        title: isEn ? 'Theater Tickets Purchase' : 'Αγορά Εισιτηρίων Θεάτρου',
        prompt: isEn
          ? `A family purchased 2 adult tickets for 12.50 € each and 2 children's tickets for 7.50 € each. They paid with a ${paid} € banknote. How much change did they receive?`
          : `Μια οικογένεια αγόρασε 2 εισιτήρια ενηλίκων προς 12,50 € το ένα και 2 παιδικά εισιτήρια προς 7,50 € το ένα. Πλήρωσαν με χαρτονόμισμα των ${paid} €. Πόσα ρέστα πήραν;`,
        correctText: changeStr,
        tableData: [
          {
            item: isEn ? 'Adult tickets' : 'Εισιτήρια ενηλίκων',
            formula: isEn ? '2 · 12.50 €' : '2 · 12,50 €',
            val: formatCurrency(25, locale)
          },
          {
            item: isEn ? "Children's tickets" : 'Παιδικά εισιτήρια',
            formula: isEn ? '2 · 7.50 €' : '2 · 7,50 €',
            val: formatCurrency(15, locale)
          },
          {
            item: isEn ? 'Total cost' : 'Συνολικό κόστος',
            formula: isEn ? '25.00 ＋ 15.00 €' : '25,00 ＋ 15,00 €',
            val: formatCurrency(40, locale)
          },
          {
            item: isEn ? 'Change' : 'Ρέστα',
            formula: isEn ? '50.00 － 40.00 €' : '50,00 － 40,00 €',
            val: changeStr
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Adults: 2 · 12.50 ＝ 25 €. Children: 2 · 7.50 ＝ 15 €. Total: 25 ＋ 15 ＝ 40 €. Change: 50 － 40 ＝ ${changeStr}.`
              : `Ενήλικες: 2 · 12,50 ＝ 25 €. Παιδιά: 2 · 7,50 ＝ 15 €. Σύνολο: 25 ＋ 15 ＝ 40 €. Ρέστα: 50 － 40 ＝ ${changeStr}.`}
          </span>
        ),
        distractors: [
          formatCurrency(15, locale),
          formatCurrency(5, locale),
          formatCurrency(8, locale)
        ]
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const book = 8.4;
      const markers = 3;
      const pMarker = 1.2;
      const paid = 20;
      const costTotal = book + markers * pMarker;
      const change = Number((paid - costTotal).toFixed(2));
      const changeStr = formatCurrency(change, locale);

      return {
        title: isEn ? 'School Supplies Purchase' : 'Αγορά Σχολικών Βοηθημάτων',
        prompt: isEn
          ? `Maria bought a dictionary for 8.40 € and 3 highlighters for 1.20 € each. She paid with a ${paid} € banknote. How much change did she receive?`
          : `Η Μαρία αγόρασε ένα λεξικό προς 8,40 € και 3 μαρκαδόρους υπογράμμισης προς 1,20 € τον καθένα. Πλήρωσε με χαρτονόμισμα των ${paid} €. Πόσα ρέστα πήρε;`,
        correctText: changeStr,
        tableData: [
          {
            item: isEn ? 'Dictionary' : 'Λεξικό',
            formula: formatCurrency(8.4, locale),
            val: formatCurrency(8.4, locale)
          },
          {
            item: isEn ? 'Highlighters' : 'Μαρκαδόροι',
            formula: isEn ? '3 · 1.20 €' : '3 · 1,20 €',
            val: formatCurrency(3.6, locale)
          },
          {
            item: isEn ? 'Total' : 'Σύνολο',
            formula: isEn ? '8.40 ＋ 3.60 €' : '8,40 ＋ 3,60 €',
            val: formatCurrency(12, locale)
          },
          {
            item: isEn ? 'Change' : 'Ρέστα',
            formula: isEn ? '20.00 － 12.00 €' : '20,00 － 12,00 €',
            val: changeStr
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Highlighters: 3 · 1.20 ＝ 3.60 €. Total: 8.40 ＋ 3.60 ＝ 12.00 €. Change: 20.00 － 12.00 ＝ ${changeStr}.`
              : `Μαρκαδόροι: 3 · 1,20 ＝ 3,60 €. Σύνολο: 8,40 ＋ 3,60 ＝ 12,00 €. Ρέστα: 20,00 － 12,00 ＝ ${changeStr}.`}
          </span>
        ),
        distractors: [
          formatCurrency(10, locale),
          formatCurrency(6, locale),
          formatCurrency(12, locale)
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
      const cap = 2400;
      const r = 2.5;
      const y = 3;
      const interest = (cap * r * y) / 100;
      const totalAmount = cap + interest;
      const correctText = isEn
        ? `${formatNum(totalAmount, locale)} € (interest: ${formatNum(interest, locale)} €)`
        : `${formatNum(totalAmount, locale)} € (τόκος: ${formatNum(interest, locale)} €)`;

      return {
        title: isEn ? 'Interest & Total Balance for 3 Years' : 'Υπολογισμός Τόκου & Τελικού Κεφαλαίου για 3 Έτη',
        prompt: isEn
          ? `Mr. Andreas deposited a principal of ${formatNum(cap, locale)} € at an annual rate of 2.5% for ${y} years. What will be the total balance in his account at maturity?`
          : `Ο κύριος Ανδρέας κατέθεσε στην τράπεζα κεφάλαιο ${formatNum(cap, locale)} € με ετήσιο επιτόκιο 2,5% για ${y} έτη. Ποιο είναι το συνολικό ποσό που θα έχει στον λογαριασμό του στο τέλος της τριετίας;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Principal (C)' : 'Αρχικό Κεφάλαιο (Κ)',
            formula: `${formatNum(cap, locale)} €`,
            val: `${formatNum(cap, locale)} €`
          },
          {
            item: isEn ? 'Interest formula' : 'Τύπος Τόκου',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction
                  num={isEn ? `${formatNum(cap, locale)} · 2.5 · ${y}` : `${formatNum(cap, locale)} · 2,5 · ${y}`}
                  den="100"
                />
                <span className="ml-1">＝ {formatNum(interest, locale)} €</span>
              </span>
            ),
            val: `${formatNum(interest, locale)} €`
          },
          {
            item: isEn ? 'Total balance' : 'Τελικό Ποσό',
            formula: `${formatNum(cap, locale)} ＋ ${formatNum(interest, locale)} €`,
            val: `${formatNum(totalAmount, locale)} €`
          }
        ],
        explain: (
          <span>
            {isEn ? 'Interest: ' : 'Τόκος: '}
            <span className="font-bold">{isEn ? 'I ＝ ' : 'Τ ＝ '}</span>
            <Fraction
              num={isEn ? `${formatNum(cap, locale)} · 2.5 · ${y}` : `${formatNum(cap, locale)} · 2,5 · ${y}`}
              den="100"
            />
            {isEn
              ? ` ＝ 18,000 : 100 ＝ ${formatNum(interest, locale)} €. Total: ${formatNum(cap, locale)} ＋ ${formatNum(interest, locale)} ＝ ${formatNum(totalAmount, locale)} €.`
              : ` ＝ 18.000 : 100 ＝ ${formatNum(interest, locale)} €. Τελικό ποσό: ${formatNum(cap, locale)} ＋ ${formatNum(interest, locale)} ＝ ${formatNum(totalAmount, locale)} €.`}
          </span>
        ),
        distractors: [
          isEn
            ? `${formatNum(cap + interest - 20, locale)} € (interest: ${formatNum(interest - 20, locale)} €)`
            : `${formatNum(cap + interest - 20, locale)} € (τόκος: ${formatNum(interest - 20, locale)} €)`,
          isEn
            ? `${formatNum(totalAmount + 100, locale)} € (interest: ${formatNum(interest + 100, locale)} €)`
            : `${formatNum(totalAmount + 100, locale)} € (τόκος: ${formatNum(interest + 100, locale)} €)`,
          isEn
            ? `${formatNum(cap + 60, locale)} € (interest: 60 €)`
            : `${formatNum(cap + 60, locale)} € (τόκος: 60 €)`
        ]
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const cap = 3000;
      const r = 3;
      const y = 2;
      const interest = (cap * r * y) / 100;
      const totalAmount = cap + interest;
      const correctText = `${formatNum(totalAmount, locale)} €`;

      return {
        title: isEn ? 'Simple Interest for 2 Years' : 'Υπολογισμός Τόκου για 2 Έτη',
        prompt: isEn
          ? `A saver deposited ${formatNum(cap, locale)} € for ${y} years at an annual interest rate of ${r}%. How much money will they have in total (principal ＋ interest) after ${y} years?`
          : `Μια αποταμιεύτρια κατέθεσε ${formatNum(cap, locale)} € για ${y} χρόνια με ετήσιο επιτόκιο ${r}%. Πόσα χρήματα θα έχει συνολικά (κεφάλαιο ＋ τόκος) μετά από ${y} χρόνια;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Principal (C)' : 'Κεφάλαιο (Κ)',
            formula: `${formatNum(cap, locale)} €`,
            val: `${formatNum(cap, locale)} €`
          },
          {
            item: isEn ? 'Interest calculation' : 'Υπολογισμός τόκου',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={`${formatNum(cap, locale)} · ${r} · ${y}`} den="100" />
                <span className="ml-1">＝ {formatNum(interest, locale)} €</span>
              </span>
            ),
            val: `${formatNum(interest, locale)} €`
          },
          {
            item: isEn ? 'Total balance' : 'Τελικό ποσό',
            formula: `${formatNum(cap, locale)} ＋ ${formatNum(interest, locale)} €`,
            val: `${formatNum(totalAmount, locale)} €`
          }
        ],
        explain: (
          <span>
            {isEn ? 'Interest: ' : 'Τόκος: '}
            <span className="font-bold">{isEn ? 'I ＝ ' : 'Τ ＝ '}</span>
            <Fraction num={`${formatNum(cap, locale)} · ${r} · ${y}`} den="100" />
            {isEn
              ? ` ＝ ${formatNum(cap * r * y, locale)} : 100 ＝ ${formatNum(interest, locale)} €. Total amount: ${formatNum(cap, locale)} ＋ ${formatNum(interest, locale)} ＝ ${formatNum(totalAmount, locale)} €.`
              : ` ＝ ${formatNum(cap * r * y, locale)} : 100 ＝ ${formatNum(interest, locale)} €. Τελικό ποσό: ${formatNum(cap, locale)} ＋ ${formatNum(interest, locale)} ＝ ${formatNum(totalAmount, locale)} €.`}
          </span>
        ),
        distractors: [
          `${formatNum(cap + 90, locale)} €`,
          `${formatNum(totalAmount + 100, locale)} €`,
          `${formatNum(cap + interest - 20, locale)} €`
        ]
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const cap = 2000;
      const interest = 80;
      const rateVal = (interest * 100) / cap;
      const correctText = `${formatNum(rateVal, locale)}%`;

      return {
        title: isEn ? 'Determining Annual Interest Rate' : 'Εύρεση Ετήσιου Επιτοκίου',
        prompt: isEn
          ? `A capital of ${formatNum(cap, locale)} € produced ${formatNum(interest, locale)} € of interest in 1 year. What was the bank's annual interest rate?`
          : `Ένα κεφάλαιο ${formatNum(cap, locale)} € απέδωσε σε 1 έτος τόκο ${formatNum(interest, locale)} €. Ποιο ήταν το ετήσιο επιτόκιο της τράπεζας;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Principal (C)' : 'Κεφάλαιο (Κ)',
            formula: `${formatNum(cap, locale)} €`,
            val: `${formatNum(cap, locale)} €`
          },
          {
            item: isEn ? '1-year interest' : 'Τόκος 1 έτους',
            formula: `${formatNum(interest, locale)} €`,
            val: `${formatNum(interest, locale)} €`
          },
          {
            item: isEn ? 'Rate (R%)' : 'Επιτόκιο (Ε%)',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={`${formatNum(interest, locale)} · 100`} den={`${formatNum(cap, locale)}`} />
                <span className="ml-1">＝ {formatNum(rateVal, locale)}%</span>
              </span>
            ),
            val: `${formatNum(rateVal, locale)}%`
          }
        ],
        explain: (
          <span>
            {isEn ? 'Rate: ' : 'Επιτόκιο: '}
            <Fraction num={`${formatNum(interest, locale)} · 100`} den={`${formatNum(cap, locale)}`} />
            {isEn
              ? ` ＝ 8,000 : 2,000 ＝ ${formatNum(rateVal, locale)}%.`
              : ` ＝ 8.000 : 2.000 ＝ ${formatNum(rateVal, locale)}%.`}
          </span>
        ),
        distractors: isEn
          ? ['3%', '5%', '2.5%']
          : ['3%', '5%', '2,5%']
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const cash = 400;
      const installments = 10;
      const perInstallment = 44;
      const totalCredit = installments * perInstallment;
      const diff = totalCredit - cash;
      const correctText = isEn ? `${diff} € extra` : `${diff} € επιπλέον`;

      return {
        title: isEn ? 'Installment Plan Surcharge' : 'Αγορά με Δόσεις και Επιβάρυνση',
        prompt: isEn
          ? `An electrical appliance costs ${cash} € in cash. It can also be purchased with ${installments} monthly installments of ${perInstallment} € each. How many euros extra are paid when choosing installments?`
          : `Μια ηλεκτρική συσκευή κοστίζει ${cash} € μετρητοίς. Μπορεί να αποκτηθεί και με ${installments} μηνιαίες δόσεις των ${perInstallment} € η καθεμία. Πόσα ευρώ επιπλέον πληρώνει όποιος επιλέξει τις δόσεις;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Cash price' : 'Τιμή μετρητοίς',
            formula: `${cash} €`,
            val: `${cash} €`
          },
          {
            item: isEn ? 'Installment total' : 'Πληρωμή με δόσεις',
            formula: `${installments} · ${perInstallment} €`,
            val: `${totalCredit} €`
          },
          {
            item: isEn ? 'Extra charge' : 'Επιπλέον επιβάρυνση',
            formula: `${totalCredit} － ${cash} €`,
            val: `${diff} €`
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Total installment price: ${installments} · ${perInstallment} ＝ ${totalCredit} €. Extra surcharge: ${totalCredit} － ${cash} ＝ ${diff} €.`
              : `Συνολικό ποσό δόσεων: ${installments} · ${perInstallment} ＝ ${totalCredit} €. Επιπλέον επιβάρυνση: ${totalCredit} － ${cash} ＝ ${diff} €.`}
          </span>
        ),
        distractors: isEn
          ? ['30 € extra', '50 € extra', '44 € extra']
          : ['30 € επιπλέον', '50 € επιπλέον', '44 € επιπλέον']
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const r = 4;
      const interest = 120;
      const cap = (interest * 100) / r;
      const correctText = `${formatNum(cap, locale)} €`;

      return {
        title: isEn ? 'Determining Initial Principal' : 'Εύρεση Αρχικού Κεφαλαίου',
        prompt: isEn
          ? `A depositor earned ${interest} € in interest over 1 year at an annual interest rate of ${r}%. What was the initial principal deposited?`
          : `Ένας καταθέτης εισέπραξε σε 1 έτος τόκο ${interest} € με ετήσιο επιτόκιο ${r}%. Ποιο ήταν το αρχικό κεφάλαιο που είχε καταθέσει;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Interest (I)' : 'Τόκος (Τ)',
            formula: `${interest} €`,
            val: `${interest} €`
          },
          {
            item: isEn ? 'Rate (R%)' : 'Επιτόκιο (Ε%)',
            formula: `${r}%`,
            val: isEn ? '4 € interest per 100 €' : '4 € τόκος ανά 100 €'
          },
          {
            item: isEn ? 'Principal (C)' : 'Αρχικό Κεφάλαιο (Κ)',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={`${interest} · 100`} den={`${r}`} />
                <span className="ml-1">＝ {formatNum(cap, locale)} €</span>
              </span>
            ),
            val: `${formatNum(cap, locale)} €`
          }
        ],
        explain: (
          <span>
            {isEn ? 'Principal formula: ' : 'Υπολογισμός κεφαλαίου: '}
            <Fraction num={`${interest} · 100`} den={`${r}`} />
            {isEn
              ? ` ＝ 12,000 : 4 ＝ ${formatNum(cap, locale)} €.`
              : ` ＝ 12.000 : 4 ＝ ${formatNum(cap, locale)} €.`}
          </span>
        ),
        distractors: [
          `${formatNum(2500, locale)} €`,
          `${formatNum(3500, locale)} €`,
          `${formatNum(4000, locale)} €`
        ]
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const friends = 3;
      const total = 84.6;
      const perFriend = Number((total / friends).toFixed(2));
      const perFriendStr = formatCurrency(perFriend, locale);

      return {
        title: isEn ? 'Equal Bill Splitting' : 'Σύνθετη Κατανομή Χρημάτων',
        prompt: isEn
          ? `Three friends paid a restaurant bill of ${formatCurrency(total, locale)} in total and split the expense equally. How much did each person pay?`
          : `Τρεις φίλοι πλήρωσαν συνολικά σε ένα εστιατόριο ${formatCurrency(total, locale)} και μοιράστηκαν τον λογαριασμό εξίσου. Πόσα ευρώ πλήρωσε ο καθένας;`,
        correctText: perFriendStr,
        tableData: [
          {
            item: isEn ? 'Total restaurant bill' : 'Συνολικός λογαριασμός',
            formula: formatCurrency(total, locale),
            val: formatCurrency(total, locale)
          },
          {
            item: isEn ? 'Number of people' : 'Άτομα',
            formula: `${friends}`,
            val: `${friends}`
          },
          {
            item: isEn ? 'Share per person' : 'Μερίδιο ανά άτομο',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={formatNum(total, locale, 2)} den={String(friends)} />
                <span className="ml-1">＝ {perFriendStr}</span>
              </span>
            ),
            val: perFriendStr
          }
        ],
        explain: (
          <span>
            {isEn ? 'Divide total by 3: ' : 'Διαιρούμε το συνολικό ποσό με το 3: '}
            <Fraction num={formatNum(total, locale, 2)} den={String(friends)} />
            {isEn
              ? ` ＝ ${perFriendStr} per person.`
              : ` ＝ ${perFriendStr} ανά άτομο.`}
          </span>
        ),
        distractors: [
          formatCurrency(perFriend + 1, locale),
          formatCurrency(Math.max(1, perFriend - 0.5), locale),
          formatCurrency(27.5, locale)
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale) {
  const isEn = locale === 'en';

  // Q1: Input - Ευρώ σε λεπτά
  const q1E = randInt(2, 8);
  const q1C = [25, 50, 75, 80, 5, 90][randInt(0, 5)];
  const q1EuroStr = isEn
    ? `${q1E}.${q1C < 10 ? '0' + q1C : q1C}`
    : `${q1E},${q1C < 10 ? '0' + q1C : q1C}`;
  const q1Res = q1E * 100 + q1C;

  // Q2: Input - Λεπτά σε δεκαδικά ευρώ
  const q2Cents = randInt(250, 850);
  const q2EuroGr = (q2Cents / 100).toFixed(2).replace('.', ',');
  const q2EuroEn = (q2Cents / 100).toFixed(2);
  const q2Target = isEn ? q2EuroEn : q2EuroGr;
  const q2Alt = isEn
    ? (q2Cents / 100).toFixed(2).replace(/0$/, '')
    : (q2Cents / 100).toFixed(2).replace(/0$/, '').replace('.', ',');

  // Q3: Input - Υπολογισμός ρέστων
  const q3Paid = 10;
  const q3CostE = randInt(4, 7);
  const q3CostC = [20, 30, 40, 50, 60, 70, 80][randInt(0, 6)];
  const q3Cost = q3CostE + q3CostC / 100;
  const q3Change = Number((q3Paid - q3Cost).toFixed(2));
  const q3CostStr = isEn ? q3Cost.toFixed(2) : q3Cost.toFixed(2).replace('.', ',');
  const q3ChangeStr = isEn ? q3Change.toFixed(2) : q3Change.toFixed(2).replace('.', ',');

  // Q4: MCQ - Τύπος του τόκου
  const q4Correct = isEn ? 'I ＝ (C · R · t) : 100' : 'Τ ＝ (Κ · Ε · χ) : 100';
  const q4Distractors = [
    isEn ? 'I ＝ (C ＋ R ＋ t) : 100' : 'Τ ＝ (Κ ＋ Ε ＋ χ) : 100',
    isEn ? 'I ＝ (C · R) : t' : 'Τ ＝ (Κ · Ε) : χ',
    isEn ? 'I ＝ (C · 100) : R' : 'Τ ＝ (Κ · 100) : Ε'
  ];
  const q4Options = makeUniqueOptions(q4Correct, q4Distractors);

  // Q5: True/False - Δεκαδική έκφραση ευρώ και λεπτών
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = isEn
    ? (q5IsTrue
        ? 'The amount 2.05 € represents 2 euros and 5 cents (not 50 cents).'
        : 'The amount 2.05 € represents 2 euros and 50 cents.')
    : (q5IsTrue
        ? 'Το ποσό 2,05 € σημαίνει 2 ευρώ και 5 λεπτά (και όχι 50 λεπτά).'
        : 'Το ποσό 2,05 € σημαίνει 2 ευρώ και 50 λεπτά.');

  // Q6: True/False - Ορισμός επιτοκίου
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = isEn
    ? (q6IsTrue
        ? 'Interest rate is the annual interest earned on 100 € over a period of 1 year.'
        : 'Interest rate is the total sum of money deposited into a bank account.')
    : (q6IsTrue
        ? 'Επιτόκιο είναι ο τόκος που δίνουν 100 € για χρονικό διάστημα 1 έτους.'
        : 'Επιτόκιο είναι το συνολικό ποσό που καταθέτουμε στην τράπεζα.');

  // Q7: Input - Υπολογισμός τόκου για 1 έτος
  const q7Cap = [500, 1000, 1500, 2000, 3000][randInt(0, 4)];
  const q7Rate = randInt(2, 5);
  const q7Interest = (q7Cap * q7Rate) / 100;
  const formatCap = formatNum(q7Cap, locale);

  // Q8: MCQ - Τελικό ποσό κατάθεσης
  const q8Cap = 1000;
  const q8Rate = 4;
  const q8Int = (q8Cap * q8Rate) / 100;
  const q8Total = q8Cap + q8Int;
  const q8Correct = `${formatNum(q8Total, locale)} €`;
  const q8Distractors = [
    `${formatNum(q8Cap - q8Int, locale)} €`,
    `${formatNum(q8Total + 40, locale)} €`,
    `${formatNum(q8Cap + 4, locale)} €`
  ];
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
      title: isEn ? 'Euros to Cents' : 'Ευρώ σε Λεπτά',
      prompt: isEn
        ? `How many cents are in the amount of ${q1EuroStr} €?`
        : `Πόσα λεπτά είναι το χρηματικό ποσό των ${q1EuroStr} €;`,
      correct: String(q1Res),
      explain: (
        <span>
          {isEn
            ? `Multiply by 100: ${q1EuroStr} · 100 ＝ ${q1Res} cents.`
            : `Πολλαπλασιάζουμε επί 100: ${q1EuroStr} · 100 ＝ ${q1Res} λεπτά.`}
        </span>
      )
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'decimal',
      title: isEn ? 'Cents to Decimal Euros' : 'Λεπτά σε Δεκαδικά Ευρώ',
      hasFractionPrompt: true,
      fractionProps: { num: q2Cents, den: 100 },
      promptPrefix: isEn
        ? `Write the amount of ${q2Cents} cents (equivalent to `
        : `Γράψε το ποσό των ${q2Cents} λεπτών (δηλαδή `,
      promptSuffix: isEn
        ? ' €) as a decimal number of euros (€):'
        : ' €) σε δεκαδική μορφή ευρώ (€):',
      prompt: isEn
        ? `Write the amount of ${q2Cents} cents as a decimal number of euros (€):`
        : `Γράψε το ποσό των ${q2Cents} λεπτών σε δεκαδική μορφή ευρώ (€):`,
      correct: q2Target,
      altCorrect: q2Alt,
      explain: (
        <span>
          {isEn ? 'Divide by 100: ' : 'Διαιρούμε με το 100: '}
          <Fraction num={String(q2Cents)} den="100" />
          {` ＝ ${q2Target} €.`}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: isEn ? 'Change Calculation' : 'Υπολογισμός Ρέστων',
      prompt: isEn
        ? `We bought goods worth ${q3CostStr} € and paid with a ${q3Paid} € banknote. How much change will we receive in decimal euros (€)?`
        : `Αγοράσαμε εμπορεύματα αξίας ${q3CostStr} € και πληρώσαμε με χαρτονόμισμα των ${q3Paid} €. Πόσα ρέστα θα πάρουμε σε δεκαδική μορφή ευρώ (€);`,
      correct: q3ChangeStr,
      explain: (
        <span>
          {isEn
            ? `Subtract purchase price from payment: ${q3Paid}.00 － ${q3CostStr} ＝ ${q3ChangeStr} €.`
            : `Αφαιρούμε την αξία από την πληρωμή: ${q3Paid},00 － ${q3CostStr} ＝ ${q3ChangeStr} €.`}
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: isEn ? 'Simple Interest Formula' : 'Τύπος του Απλού Τόκου',
      prompt: isEn
        ? 'Which is the correct formula to calculate simple interest?'
        : 'Ποιος είναι ο σωστός μαθηματικός τύπος για τον υπολογισμό του τόκου;',
      options: q4Options,
      correct: q4Correct,
      explain: (
        <span>
          {isEn
            ? 'Simple interest is computed by multiplying Principal by Rate by Time in years and dividing by 100: '
            : 'Ο τόκος υπολογίζεται πολλαπλασιάζοντας το Κεφάλαιο επί το Επιτόκιο επί τα Έτη και διαιρώντας με το 100: '}
          <span className="font-bold">{isEn ? 'I ＝ ' : 'Τ ＝ '}</span>
          <Fraction num={isEn ? 'C · R · t' : 'Κ · Ε · χ'} den="100" />.
        </span>
      )
    },
    {
      id: 'q5',
      type: 'tf',
      title: isEn ? 'Decimal Euros and Cents' : 'Δεκαδικά Ευρώ και Λεπτά',
      text: q5Text,
      correct: q5IsTrue,
      explain: isEn
        ? (q5IsTrue
            ? 'Correct! The digit after zero denotes 5 cents (0.05 € ＝ 5 cents). Fifty cents is written as 0.50 €.'
            : 'False! 2.05 € represents 2 euros and 5 cents. Fifty cents is written as 2.50 €.')
        : (q5IsTrue
            ? 'Σωστά! Το ψηφίο μετά το μηδέν δηλώνει 5 λεπτά (0,05 € ＝ 5 λεπτά). Τα 50 λεπτά γράφονται 0,50 €.'
            : 'Λάθος! Το 2,05 € σημαίνει 2 ευρώ και 5 λεπτά. Τα 50 λεπτά γράφονται 2,50 €.')
    },
    {
      id: 'q6',
      type: 'tf',
      title: isEn ? 'Concept of Interest Rate' : 'Έννοια Επιτοκίου',
      text: q6Text,
      correct: q6IsTrue,
      explain: isEn
        ? (q6IsTrue
            ? 'Correct! Interest rate is the annual interest earned on 100 € deposited in the bank.'
            : 'False! The initial deposited sum is called principal. Interest rate is the percentage return.')
        : (q6IsTrue
            ? 'Σωστά! Επιτόκιο είναι ο ετήσιος τόκος που κερδίζουν 100 € κατατεθειμένα στην τράπεζα.'
            : 'Λάθος! Το αρχικό ποσό που καταθέτουμε ονομάζεται κεφάλαιο. Επιτόκιο είναι το ποσοστό κέρδους.')
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Annual Interest Calculation' : 'Υπολογισμός Ετήσιου Τόκου',
      prompt: isEn
        ? `A capital of ${formatCap} € is deposited at an annual rate of ${q7Rate}%. How much interest (in €) will it yield in 1 year?`
        : `Ένα κεφάλαιο ${formatCap} € κατατίθεται στην τράπεζα με ετήσιο επιτόκιο ${q7Rate}%. Πόσο τόκο (σε €) θα αποδώσει σε 1 έτος;`,
      correct: String(q7Interest),
      explain: (
        <span>
          {isEn ? 'Formula: ' : 'Τύπος: '}
          <span className="font-bold">{isEn ? 'I ＝ ' : 'Τ ＝ '}</span>
          <Fraction num={`${formatCap} · ${q7Rate} · 1`} den="100" />
          {isEn
            ? ` ＝ ${formatNum(q7Cap * q7Rate, locale)} : 100 ＝ ${q7Interest} €.`
            : ` ＝ ${formatNum(q7Cap * q7Rate, locale)} : 100 ＝ ${q7Interest} €.`}
        </span>
      )
    },
    {
      id: 'q8',
      type: 'mcq',
      title: isEn ? 'Total Balance at Maturity' : 'Τελικό Ποσό Κατάθεσης',
      prompt: isEn
        ? `We deposit ${formatNum(q8Cap, locale)} € at an annual rate of ${q8Rate}% for 1 year (interest of ${q8Int} €). How much money will we have in total at year end?`
        : `Καταθέτουμε ${formatNum(q8Cap, locale)} € με επιτόκιο ${q8Rate}% για 1 έτος (τόκος ${q8Int} €). Πόσα χρήματα θα έχουμε συνολικά στο τέλος του έτους;`,
      options: q8Options,
      correct: q8Correct,
      explain: (
        <span>
          {isEn
            ? `Total Balance ＝ Principal ＋ Interest ＝ ${formatNum(q8Cap, locale)} ＋ ${q8Int} ＝ ${formatNum(q8Total, locale)} €.`
            : `Τελικό Ποσό ＝ Κεφάλαιο ＋ Τόκος ＝ ${formatNum(q8Cap, locale)} ＋ ${q8Int} ＝ ${formatNum(q8Total, locale)} €.`}
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

export default function XrimataExercisesPage() {
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

      if (cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt)) return true;

      if (q.inputType === 'decimal') {
        const numUser = parseFloat(cleanUser.replace(',', '.'));
        const numTarget = parseFloat(cleanTarget.replace(',', '.'));
        return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) <= 0.05;
      }
      return false;
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
          href="/st-dimotikou/62-xrimata"
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
                      ) : q.hasFractionPrompt && q.fractionProps ? (
                        <span className="inline-flex items-center flex-wrap">
                          {q.promptPrefix}
                          <Fraction num={q.fractionProps.num} den={q.fractionProps.den} />
                          {q.promptSuffix}
                        </span>
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
                          placeholder={
                            q.inputType === 'decimal'
                              ? t.inputDecimalPlaceholder
                              : t.inputNumberPlaceholder
                          }
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
                                    {row.val}
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
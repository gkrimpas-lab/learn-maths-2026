// pages/st-dimotikou/42-analogia-xiasti-ask.js
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

// Μορφοποίηση αριθμού βάσει locale
function formatNum(val, decimals = 2, locale = 'el') {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  if (Number.isInteger(Number(val))) {
    return locale === 'el' ? Number(val).toLocaleString('el-GR') : Number(val).toLocaleString('en-US');
  }
  const rounded = Number(Number(val).toFixed(decimals));
  return locale === 'el'
    ? rounded.toLocaleString('el-GR', { minimumFractionDigits: 0, maximumFractionDigits: decimals })
    : rounded.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}

// Δημιουργία 4 μοναδικών επιλογών για MCQ
function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set([String(correct)]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && String(opt).trim() !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }

  // Backup αν χρειάζονται επιπλέον επιλογές για να φτάσουμε αυστηρά τις 4
  let counter = 1;
  while (unique.size < 4) {
    unique.add(`${correct} (${counter})`);
    counter++;
  }

  return shuffle(Array.from(unique)).map((v) => ({
    val: v,
    render: <span className="break-words [overflow-wrap:anywhere]">{v}</span>
  }));
}

// Component για κανονική κατακόρυφη μορφή κλάσματος
export function Fraction({ num, den, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: { numDen: 'text-xs sm:text-sm font-bold', line: 'w-full h-0.5' },
    md: { numDen: 'text-sm sm:text-base font-black', line: 'w-full h-0.5' },
    lg: { numDen: 'text-lg sm:text-xl font-black', line: 'w-full h-1' }
  };

  const selected = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle font-mono leading-none px-1 shrink-0 max-w-full ${className}`}
    >
      <span className={`${selected.numDen} pb-0.5 break-all text-center`}>{num}</span>
      <span className={`${selected.line} bg-current rounded-full my-0.5 min-w-[12px]`} />
      <span className={`${selected.numDen} pt-0.5 break-all text-center`}>{den}</span>
    </span>
  );
}

// ---------------------------------------------------------
// ΛΕΞΙΚΟ i18n
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Αναλογία Χιαστί - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στους πίνακες ποσών και τιμών και στον σταυρωτό πολλαπλασιασμό χιαστί για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 42 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Αναλογία Χιαστί",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη συμπλήρωση πινάκων ποσών και τιμών, στα σταυρωτά γινόμενα και σε σύνθετα πρακτικά προβλήματα!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    inputPlaceholderDecimal: "π.χ. 4,5",
    inputPlaceholderNumber: "Απάντηση...",
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
    pageTitle: "Exercises: Cross-Multiplication - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on proportion tables and cross-multiplication for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 42 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Cross-Multiplication",
    desc: "Solve the 10 dynamic problems to practice completing proportion tables, cross products, and multi-step practical problems!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    inputPlaceholderDecimal: "e.g. 4.5",
    inputPlaceholderNumber: "Type your answer...",
    tableHeaderElement: "Element",
    tableHeaderFormula: "Analysis / Formula",
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
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_xiasti_std_1',
    generate: (locale) => {
      const kg1 = randInt(2, 4);
      const costPerKg = randInt(3, 7);
      const cost1 = kg1 * costPerKg;
      const kg2 = kg1 + randInt(3, 6);
      const cost2 = kg2 * costPerKg;
      return {
        title: locale === 'en' ? 'Apple Purchase Table' : 'Αγορά Μήλων με Πίνακα Ποσών',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `In a proportion table, ${kg1} kg of apples cost ${cost1} €. How many € do ${kg2} kg of apples cost?`
              : `Σε έναν πίνακα ποσών και τιμών, τα ${kg1} kg μήλων κοστίζουν ${cost1} €. Πόσα € κοστίζουν τα ${kg2} kg μήλων;`}
          </span>
        ),
        unit: '€',
        correctVal: String(cost2),
        correctText: `${cost2} €`,
        tableData: [
          { item: locale === 'en' ? 'First quantity' : 'Πρώτη ποσότητα', formula: `${kg1} kg ➔ ${cost1} €`, val: `${cost1} €` },
          { item: locale === 'en' ? 'Second quantity' : 'Δεύτερη ποσότητα', formula: `${kg2} kg ➔ x €`, val: 'x €' },
          { item: locale === 'en' ? 'Cross product' : 'Σταυρωτό γινόμενο', formula: `(${cost1} · ${kg2}) : ${kg1}`, val: `${cost2} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{kg1} : {cost1} ＝ {kg2} : x</span>
            <span>➔</span>
            <span>x ＝ ({cost1} · {kg2}) : {kg1} ＝ {cost1 * kg2} : {kg1} ＝ {cost2} €.</span>
          </span>
        ),
        distractors: [
          `${cost2 + 4} €`,
          `${Math.max(1, cost2 - 3)} €`,
          `${cost2 + 6} €`
        ]
      };
    }
  },
  {
    id: 'p_xiasti_std_2',
    generate: (locale) => {
      const hours1 = randInt(2, 4);
      const speed = randInt(70, 90);
      const dist1 = hours1 * speed;
      const hours2 = hours1 + randInt(2, 3);
      const dist2 = hours2 * speed;
      return {
        title: locale === 'en' ? 'Train Travel at Constant Speed' : 'Διαδρομή Τρένου με Σταθερή Ταχύτητα',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `A train covers ${dist1} km in ${hours1} hours. How many km will it cover in ${hours2} hours moving at the same constant rate?`
              : `Ένα τρένο διανύει ${dist1} km σε ${hours1} ώρες. Πόσα km θα διανύσει σε ${hours2} ώρες κινούμενο με τον ίδιο σταθερό ρυθμό;`}
          </span>
        ),
        unit: 'km',
        correctVal: String(dist2),
        correctText: `${dist2} km`,
        tableData: [
          { item: locale === 'en' ? 'Time 1 ➔ Distance 1' : 'Χρόνος 1 ➔ Απόσταση 1', formula: `${hours1} h ➔ ${dist1} km`, val: `${dist1} km` },
          { item: locale === 'en' ? 'Time 2 ➔ Distance 2' : 'Χρόνος 2 ➔ Απόσταση 2', formula: `${hours2} h ➔ x km`, val: 'x km' },
          { item: locale === 'en' ? 'Cross-multiplication' : 'Υπολογισμός χιαστί', formula: `(${dist1} · ${hours2}) : ${hours1}`, val: `${dist2} km` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{hours1} : {dist1} ＝ {hours2} : x</span>
            <span>➔</span>
            <span>x ＝ ({dist1} · {hours2}) : ${hours1} ＝ {dist2} km.</span>
          </span>
        ),
        distractors: [
          `${dist2 + 25} km`,
          `${Math.max(20, dist2 - 30)} km`,
          `${dist2 + 50} km`
        ]
      };
    }
  },
  {
    id: 'p_xiasti_std_3',
    generate: (locale) => {
      const workers1 = randInt(2, 4);
      const production1 = workers1 * 45;
      const workers2 = workers1 + randInt(3, 5);
      const production2 = workers2 * 45;
      const partUnit = locale === 'en' ? 'parts' : 'τεμάχια';
      return {
        title: locale === 'en' ? 'Assembly Line Production' : 'Συναρμολόγηση Εξαρτημάτων',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `On an assembly line, ${workers1} workers assemble ${production1} parts. How many parts will ${workers2} workers assemble at the same rate?`
              : `Σε μια γραμμή παραγωγής ${workers1} εργάτες συναρμολογούν ${production1} εξαρτήματα. Πόσα εξαρτήματα θα συναρμολογήσουν ${workers2} εργάτες με την ίδια απόδοση;`}
          </span>
        ),
        unit: partUnit,
        correctVal: String(production2),
        correctText: `${production2} ${partUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Workers 1' : 'Εργάτες 1', formula: `${workers1}`, val: `${production1} ${locale === 'en' ? 'pcs.' : 'τεμ.'}` },
          { item: locale === 'en' ? 'Workers 2' : 'Εργάτες 2', formula: `${workers2}`, val: `x ${locale === 'en' ? 'pcs.' : 'τεμ.'}` },
          { item: locale === 'en' ? 'Cross products' : 'Σταυρωτά γινόμενα', formula: `(${production1} · ${workers2}) : ${workers1}`, val: `${production2} ${locale === 'en' ? 'pcs.' : 'τεμ.'}` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{workers1} : {production1} ＝ {workers2} : x</span>
            <span>➔</span>
            <span>x ＝ ({production1} · ${workers2}) : ${workers1} ＝ {production2} {partUnit}.</span>
          </span>
        ),
        distractors: [
          `${production2 + 30} ${partUnit}`,
          `${Math.max(30, production2 - 45)} ${partUnit}`,
          `${production2 + 60} ${partUnit}`
        ]
      };
    }
  },
  {
    id: 'p_xiasti_std_4',
    generate: (locale) => {
      const books1 = randInt(3, 6);
      const priceBook = randInt(8, 14);
      const cost1 = books1 * priceBook;
      const books2 = books1 + randInt(2, 5);
      const cost2 = books2 * priceBook;
      return {
        title: locale === 'en' ? 'Book Purchase Proportion' : 'Αγορά Βιβλίων',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `For purchasing ${books1} identical books we paid ${cost1} €. How many € will we pay if we purchase ${books2} of the same books?`
              : `Για την αγορά ${books1} ίδιων βιβλίων πληρώσαμε ${cost1} €. Πόσα € θα πληρώσουμε αν αγοράσουμε ${books2} τέτοια βιβλία;`}
          </span>
        ),
        unit: '€',
        correctVal: String(cost2),
        correctText: `${cost2} €`,
        tableData: [
          { item: locale === 'en' ? 'First purchase' : 'Πρώτη αγορά', formula: `${books1} ➔ ${cost1} €`, val: `${cost1} €` },
          { item: locale === 'en' ? 'Second purchase' : 'Δεύτερη αγορά', formula: `${books2} ➔ x €`, val: 'x €' },
          { item: locale === 'en' ? 'Cross calculation' : 'Χιαστί υπολογισμός', formula: `(${cost1} · ${books2}) : ${books1}`, val: `${cost2} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{books1} : {cost1} ＝ {books2} : x</span>
            <span>➔</span>
            <span>x ＝ ({cost1} · {books2}) : ${books1} ＝ {cost1 * books2} : {books1} ＝ {cost2} €.</span>
          </span>
        ),
        distractors: [
          `${cost2 + 8} €`,
          `${Math.max(5, cost2 - 6)} €`,
          `${cost2 + 12} €`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_xiasti_hard_1',
    generate: (locale) => {
      const massKg = 2.5;
      const costEur = 7.5;
      const massGrams = randInt(6, 14) * 250;
      const massKgTarget = massGrams / 1000;
      const finalCost = (costEur * massKgTarget) / massKg;
      return {
        title: locale === 'en' ? 'Cost with Unit Conversion (kg to g)' : 'Υπολογισμός Κόστους με Μετατροπή Μονάδων',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `${formatNum(massKg, 1, locale)} kg of a grocery product cost ${formatNum(costEur, 1, locale)} €. How many € will ${formatNum(massGrams, 0, locale)} g of the same product cost?`
              : `Τα ${formatNum(massKg, 1, locale)} kg ενός προϊόντος κοστίζουν ${formatNum(costEur, 1, locale)} €. Πόσα € κοστίζουν ${formatNum(massGrams, 0, locale)} g από το ίδιο προϊόν;`}
          </span>
        ),
        unit: '€',
        correctVal: formatNum(finalCost, 2, locale),
        correctText: `${formatNum(finalCost, 2, locale)} €`,
        tableData: [
          { item: locale === 'en' ? 'Convert kg to g' : 'Μετατροπή κιλών σε γραμμάρια', formula: `${formatNum(massKg, 1, locale)} kg · 1.000`, val: `${massKg * 1000} g` },
          { item: locale === 'en' ? 'Cross product' : 'Σταυρωτό γινόμενο', formula: `(${formatNum(costEur, 1, locale)} · ${formatNum(massGrams, 0, locale)}) : ${massKg * 1000}`, val: `${formatNum(finalCost, 2, locale)} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{massKg * 1000} : {formatNum(costEur, 1, locale)} ＝ {formatNum(massGrams, 0, locale)} : x</span>
            <span>➔</span>
            <span>x ＝ ({formatNum(costEur, 1, locale)} · {formatNum(massGrams, 0, locale)}) : {massKg * 1000} ＝ {formatNum(finalCost, 2, locale)} €.</span>
          </span>
        ),
        distractors: [
          `${formatNum(finalCost + 1.5, 2, locale)} €`,
          `${formatNum(Math.max(0.5, finalCost - 1.2), 2, locale)} €`,
          `${formatNum(finalCost + 2.5, 2, locale)} €`
        ]
      };
    }
  },
  {
    id: 'p_xiasti_hard_2',
    generate: (locale) => {
      const extraMinutes = 30;
      const totalMin1 = 90;
      const pages1 = 45;
      const targetHours = 2;
      const targetMin = targetHours * 60;
      const targetPages = (pages1 * targetMin) / totalMin1;
      const posterUnit = locale === 'en' ? 'posters' : 'αφίσες';
      return {
        title: locale === 'en' ? 'Printer Machine Operating Time' : 'Χρόνος Λειτουργίας Εκτυπωτή',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `A printing press produces ${pages1} posters in 1 hour and ${extraMinutes} minutes. How many posters will it print in ${targetHours} hours of continuous operation?`
              : `Μια εκτυπωτική μηχανή τυπώνει ${pages1} αφίσες σε 1 ώρα και ${extraMinutes} λεπτά. Πόσες αφίσες θα τυπώσει σε ${targetHours} ώρες συνεχούς λειτουργίας;`}
          </span>
        ),
        unit: posterUnit,
        correctVal: String(targetPages),
        correctText: `${targetPages} ${posterUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Time 1 (in minutes)' : 'Χρόνος 1 (σε λεπτά)', formula: '1 h 30 min', val: `${totalMin1} min` },
          { item: locale === 'en' ? 'Time 2 (in minutes)' : 'Χρόνος 2 (σε λεπτά)', formula: `${targetHours} h · 60`, val: `${targetMin} min` },
          { item: locale === 'en' ? 'Cross calculation' : 'Χιαστί υπολογισμός', formula: `(${pages1} · ${targetMin}) : ${totalMin1}`, val: `${targetPages} ${posterUnit}` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>90 : {pages1} ＝ 120 : x</span>
            <span>➔</span>
            <span>x ＝ ({pages1} · 120) : 90 ＝ 5.400 : 90 ＝ {targetPages} {posterUnit}.</span>
          </span>
        ),
        distractors: [
          `${targetPages + 10} ${posterUnit}`,
          `${Math.max(10, targetPages - 15)} ${posterUnit}`,
          `${targetPages + 20} ${posterUnit}`
        ]
      };
    }
  },
  {
    id: 'p_xiasti_hard_3',
    generate: (locale) => {
      const origEur = randInt(12, 25) * 10;
      const pct = 25;
      const discEur = (origEur * pct) / 100;
      const payEur = origEur - discEur;
      return {
        title: locale === 'en' ? 'Discount Calculation with Table' : 'Υπολογισμός Έκπτωσης με Πίνακα',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `During a seasonal sale, a store offers a ${pct} % discount. If a jacket was originally priced at ${origEur} €, how many € will the customer finally pay?`
              : `Σε περίοδο εκπτώσεων ένα κατάστημα προσφέρει έκπτωση ${pct} %. Αν ένα μπουφάν είχε αρχική τιμή ${origEur} €, πόσα € θα πληρώσει τελικά ο αγοραστής;`}
          </span>
        ),
        unit: '€',
        correctVal: formatNum(payEur, 2, locale),
        correctText: `${formatNum(payEur, 2, locale)} €`,
        tableData: [
          { item: locale === 'en' ? 'Discount ratio' : 'Αναλογία έκπτωσης', formula: '100 € ➔ 75 €', val: '25% discount' },
          { item: locale === 'en' ? 'Cross calculation' : 'Χιαστί υπολογισμός', formula: `(${100 - pct} · ${origEur}) : 100`, val: `${formatNum(payEur, 2, locale)} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>100 : {100 - pct} ＝ {origEur} : x</span>
            <span>➔</span>
            <span>x ＝ (${100 - pct} · {origEur}) : 100 ＝ {formatNum(payEur, 2, locale)} €.</span>
          </span>
        ),
        distractors: [
          `${formatNum(payEur + 15, 2, locale)} €`,
          `${formatNum(Math.max(10, payEur - 10), 2, locale)} €`,
          `${formatNum(origEur - 10, 2, locale)} €`
        ]
      };
    }
  },
  {
    id: 'p_xiasti_hard_4',
    generate: (locale) => {
      const scale = 250000;
      const mapCm = 4.5;
      const realKm = (mapCm * scale) / 100000;
      return {
        title: locale === 'en' ? 'Map Distance & Real Distance' : 'Πραγματική Απόσταση σε Χάρτη',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `On a roadmap with scale 1 : ${formatNum(scale, 0, locale)}, two towns are ${formatNum(mapCm, 1, locale)} cm apart. How many km is the actual distance between them?`
              : `Σε έναν οδικό χάρτη με κλίμακα 1 : ${formatNum(scale, 0, locale)}, δύο πόλεις απέχουν ${formatNum(mapCm, 1, locale)} cm. Πόσα km είναι η πραγματική απόσταση μεταξύ τους;`}
          </span>
        ),
        unit: 'km',
        correctVal: formatNum(realKm, 2, locale),
        correctText: `${formatNum(realKm, 2, locale)} km`,
        tableData: [
          { item: locale === 'en' ? 'Scale' : 'Κλίμακα', formula: '1 cm ➔ 250.000 cm', val: '2,5 km' },
          { item: locale === 'en' ? 'Real cm' : 'Πραγματική απόσταση σε cm', formula: `${formatNum(mapCm, 1, locale)} · ${scale}`, val: `${mapCm * scale} cm` },
          { item: locale === 'en' ? 'Convert to km' : 'Μετατροπή σε km', formula: `(${mapCm * scale}) : 100.000`, val: `${formatNum(realKm, 2, locale)} km` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>1 : {scale} ＝ {formatNum(mapCm, 1, locale)} : x</span>
            <span>➔</span>
            <span>x ＝ {formatNum(mapCm, 1, locale)} · ${scale} ＝ ${mapCm * scale} cm ＝ {formatNum(realKm, 2, locale)} km.</span>
          </span>
        ),
        distractors: [
          `${formatNum(realKm + 2.5, 2, locale)} km`,
          `${formatNum(Math.max(1, realKm - 2), 2, locale)} km`,
          `${formatNum(realKm + 5, 2, locale)} km`
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  // Q1: Input - Συμπλήρωση πίνακα ποσών & εύρεση x
  const q1A = randInt(3, 6);
  const q1B = randInt(12, 30);
  const q1C = randInt(7, 12);
  const q1XVal = (q1B * q1C) / q1A;
  const q1FinalVal = Number.isInteger(q1XVal) ? q1XVal : Number(q1XVal.toFixed(2));

  // Q2: MCQ - Επιλογή σωστής εξίσωσης χιαστί
  const q2P1 = randInt(4, 8);
  const q2P2 = randInt(15, 35);
  const q2P3 = randInt(9, 14);
  const q2CorrectEq = `x ＝ (${q2P2} · ${q2P3}) : ${q2P1}`;
  const q2Options = makeUniqueOptions(q2CorrectEq, [
    `x ＝ (${q2P1} · ${q2P2}) : ${q2P3}`,
    `x ＝ (${q2P1} · ${q2P3}) : ${q2P2}`,
    `x ＝ (${q2P2} ＋ ${q2P3}) : ${q2P1}`
  ]);

  // Q3: Input - Άγνωστος στη θέση του πρώτου ποσού (x στην πρώτη στήλη)
  const q3K = randInt(3, 7);
  const q3Mult = randInt(4, 9);
  const q3B = q3K * q3Mult;
  const q3C = randInt(5, 12);
  const q3D = q3C * q3Mult;
  const q3XVal = q3K;

  // Q4: MCQ - Έλεγχος αν ένας πίνακας είναι πίνακας ανάλογων ποσών (4 επιλογές)
  const q4Base1 = randInt(2, 5);
  const q4Base2 = randInt(6, 10);
  const q4Mult = randInt(2, 4);
  const q4IsTrue = Math.random() > 0.4;
  const q4Row2Col1 = q4Base1 * q4Mult;
  const q4Row2Col2 = q4IsTrue ? q4Base2 * q4Mult : q4Base2 * q4Mult + randInt(2, 5);

  const prodA = q4Base1 * q4Row2Col2;
  const prodB = q4Base2 * q4Row2Col1;

  const q4CorrectAns = q4IsTrue
    ? (locale === 'en'
        ? `Yes, because cross products are equal (${q4Base1} · ${q4Row2Col2} ＝ ${q4Base2} · ${q4Row2Col1} ＝ ${prodA})`
        : `Ναι, γιατί τα σταυρωτά γινόμενα είναι ίσα (${q4Base1} · ${q4Row2Col2} ＝ ${q4Base2} · ${q4Row2Col1} ＝ ${prodA})`)
    : (locale === 'en'
        ? `No, because cross products are not equal (${prodA} ≠ ${prodB})`
        : `Όχι, γιατί τα σταυρωτά γινόμενα δεν είναι ίσα (${prodA} ≠ ${prodB})`);

  const q4Distractors = q4IsTrue
    ? (locale === 'en'
        ? [
            'No, because the numbers are not identical',
            'No, because cross products are different',
            'Yes, but only because all numbers are even'
          ]
        : [
            'Όχι, γιατί οι αριθμοί δεν είναι ίσοι μεταξύ τους',
            'Όχι, γιατί τα σταυρωτά γινόμενα διαφέρουν',
            'Ναι, αλλά μόνο επειδή όλοι οι αριθμοί είναι άρτιοι'
          ])
    : (locale === 'en'
        ? [
            'Yes, because both values increase',
            'Yes, because the first column is a multiple of the second',
            'No, because division by zero occurs'
          ]
        : [
            'Ναι, γιατί και τα δύο ποσά αυξάνονται',
            'Ναι, γιατί η πρώτη στήλη είναι πολλαπλάσιο της δεύτερης',
            'Όχι, γιατί προκύπτει διαίρεση με το μηδέν'
          ]);

  const q4Options = makeUniqueOptions(q4CorrectAns, q4Distractors);

  // Q5: Input - Υπολογισμός x σε σχέση κλασμάτων
  const q5N = randInt(3, 8);
  const q5D = randInt(4, 9);
  const q5M = randInt(2, 5);
  const q5TargetN = q5N * q5M;
  const q5TargetD = q5D * q5M;

  // Q6: MCQ - Σταυρωτό γινόμενο
  const q6A = randInt(5, 9);
  const q6B = randInt(11, 18);
  const q6C = randInt(3, 7);
  const q6CorrectMult = `${q6A} · x ＝ ${q6B} · ${q6C}`;
  const q6Options = makeUniqueOptions(q6CorrectMult, [
    `${q6A} · ${q6B} ＝ ${q6C} · x`,
    `${q6A} · ${q6C} ＝ ${q6B} · x`,
    `${q6A} ＋ x ＝ ${q6B} ＋ ${q6C}`
  ]);

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate(locale);

  // Q8: Standard Problem (MCQ - 4 μοναδικές επιλογές)
  let spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  while (spIndex2 === spIndex1) spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q8Data = STANDARD_PROBLEMS_POOL[spIndex2].generate(locale);
  const q8Options = makeUniqueOptions(q8Data.correctText, q8Data.distractors);

  // Q9: Hard Problem (Input)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate(locale);

  // Q10: Hard Problem (MCQ - 4 μοναδικές επιλογές)
  let hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  while (hpIndex2 === hpIndex1) hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hpIndex2].generate(locale);
  const q10Options = makeUniqueOptions(q10Data.correctText, q10Data.distractors);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'decimal',
      title: locale === 'en' ? 'Completing Proportion Table' : 'Συμπλήρωση Πίνακα Ποσών',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `In a table of proportional quantities, ${q1A} corresponds to ${q1B} and ${q1C} corresponds to x. What is x?`
            : `Σε έναν πίνακα ανάλογων ποσών, το ${q1A} αντιστοιχεί στο ${q1B} και το ${q1C} αντιστοιχεί στο x. Ποια είναι η τιμή του x;`}
        </span>
      ),
      correct: formatNum(q1FinalVal, 2, locale),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>{q1A} : {q1B} ＝ {q1C} : x</span>
          <span>➔</span>
          <span>x ＝ ({q1B} · {q1C}) : {q1A} ＝ {formatNum(q1FinalVal, 2, locale)}.</span>
        </span>
      )
    },
    {
      id: 'q2',
      type: 'mcq',
      title: locale === 'en' ? 'Cross-Multiplication Formula' : 'Μαθηματικός Τύπος Χιαστί',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `In a proportion table where ${q2P1} pairs with ${q2P2} and ${q2P3} pairs with x, which formula is correct?`
            : `Αν σε έναν πίνακα ποσών έχουμε: ${q2P1} αντιστοιχεί σε ${q2P2} και ${q2P3} αντιστοιχεί σε x, ποιος είναι ο σωστός τύπος επίλυσης;`}
        </span>
      ),
      options: q2Options,
      correct: q2CorrectEq,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `Multiply the terms of the full diagonal (${q2P2} · ${q2P3}) and divide by the term opposite to x (${q2P1}): ${q2CorrectEq}.`
            : `Στον χιαστί πολλαπλασιασμό πολλαπλασιάζουμε τα στοιχεία της πλήρους διαγωνίου (${q2P2} · ${q2P3}) και διαιρούμε με το στοιχείο που είναι διαγώνια απέναντι από το x (${q2P1}): ${q2CorrectEq}.`}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Unknown in Column 1' : 'Άγνωστος σε Διαφορετική Θέση',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `A proportion table has row 1 [x, ${q3B}] and row 2 [${q3C}, ${q3D}]. Calculate x:`
            : `Σε πίνακα ανάλογων ποσών έχουμε στην πρώτη γραμμή [x, ${q3B}] και στη δεύτερη γραμμή [${q3C}, ${q3D}]. Υπολόγισε το x:`}
        </span>
      ),
      correct: String(q3XVal),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>x · {q3D} ＝ {q3B} · {q3C}</span>
          <span>➔</span>
          <span>x ＝ ({q3B} · {q3C}) : {q3D} ＝ {q3XVal}.</span>
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Proportion Table Verification' : 'Έλεγχος Πίνακα Αναλογίας',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `Is the table with row 1 [${q4Base1}, ${q4Base2}] and row 2 [${q4Row2Col1}, ${q4Row2Col2}] a table of proportional quantities?`
            : `Είναι ο πίνακας με 1η γραμμή [${q4Base1}, ${q4Base2}] και 2η γραμμή [${q4Row2Col1}, ${q4Row2Col2}] πίνακας ανάλογων ποσών;`}
        </span>
      ),
      options: q4Options,
      correct: q4CorrectAns,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {q4Base1} · {q4Row2Col2} ＝ {prodA} {q4IsTrue ? '＝' : '≠'} {q4Base2} · {q4Row2Col1} ＝ {prodB}. {q4CorrectAns}.
        </span>
      )
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Solving Fractions with Cross-Multiplication' : 'Επίλυση με Χιαστί σε Κλάσματα',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1.5 break-words [overflow-wrap:anywhere]">
          <span>{locale === 'en' ? 'In the equality of fractions' : 'Στην ισότητα κλασμάτων'}</span>
          <Fraction num={q5N} den={q5D} size="sm" />
          <span>＝</span>
          <Fraction num={q5TargetN} den="x" size="sm" />
          <span>{locale === 'en' ? ', what is x?' : ', ποια είναι η τιμή του άγνωστου όρου x;'}</span>
        </span>
      ),
      correct: String(q5TargetD),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>{q5N} · x ＝ {q5D} · {q5TargetN}</span>
          <span>➔</span>
          <span>x ＝ ({q5D} · {q5TargetN}) : {q5N} ＝ {q5TargetD}.</span>
        </span>
      )
    },
    {
      id: 'q6',
      type: 'mcq',
      title: locale === 'en' ? 'Cross Product Statement' : 'Σταυρωτό Γινόμενο',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `From the proportion ${q6A} : ${q6B} ＝ ${q6C} : x, which relation directly follows?`
            : `Από την αναλογία ${q6A} : ${q6B} ＝ ${q6C} : x, ποια σχέση προκύπτει άμεσα;`}
        </span>
      ),
      options: q6Options,
      correct: q6CorrectMult,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `By cross-multiplication: ${q6CorrectMult}.`
            : `Σύμφωνα με την ιδιότητα του χιαστί πολλαπλασιασμού, τα σταυρωτά γινόμενα είναι ίσα: ${q6CorrectMult}.`}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: `${locale === 'en' ? 'Problem' : 'Πρόβλημα'}: ${q7Data.title}`,
      prompt: q7Data.prompt,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: `${locale === 'en' ? 'Problem' : 'Πρόβλημα'}: ${q8Data.title}`,
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correctText,
      tableData: q8Data.tableData,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'input',
      inputType: 'decimal',
      title: `${locale === 'en' ? 'Challenge Problem' : 'Σύνθετο Πρόβλημα'}: ${q9Data.title}`,
      prompt: q9Data.prompt,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${locale === 'en' ? 'Challenge Problem' : 'Σύνθετο Πρόβλημα'}: ${q10Data.title}`,
      prompt: q10Data.prompt,
      options: q10Options,
      correct: q10Data.correctText,
      tableData: q10Data.tableData,
      explain: q10Data.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function XiastiExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale] || TRANSLATIONS.el;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions(locale);
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach((q) => {
      initialAnswers[q.id] = '';
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
      const q = questions.find((item) => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        sanitized = sanitized.replace(/\./g, ',').replace(/[^0-9,]/g, '');
        const parts = sanitized.split(',');
        if (parts.length > 2) sanitized = parts[0] + ',' + parts.slice(1).join('');
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/^x[=＝]/i, '').trim().toLowerCase();

      if (cleanUser === cleanTarget) return true;

      if (q.inputType === 'decimal') {
        const numUser = parseFloat(cleanUser.replace(',', '.'));
        const numTarget = parseFloat(cleanTarget.replace(',', '.'));
        return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) < 0.05;
      }
      return false;
    }
    if (q.type === 'mcq') {
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
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/42-analogia-xiasti"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryNav)}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
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
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 ${getCardStyle(
                    q
                  )}`}
                >
                  <div>
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
                      {q.prompt}
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
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition touch-manipulation active:scale-95 break-words whitespace-normal leading-snug flex items-center justify-center min-h-[48px] ${
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
                              ? t.inputPlaceholderDecimal
                              : t.inputPlaceholderNumber
                          }
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="w-full overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          <table className="w-full text-xs text-left text-slate-700">
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
                                  <td className="p-1.5 font-sans font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                                    {row.item}
                                  </td>
                                  <td className="p-1.5 text-indigo-700 break-words [overflow-wrap:anywhere]">
                                    {row.formula}
                                  </td>
                                  <td className="p-1.5 font-black text-emerald-700 break-words [overflow-wrap:anywhere]">
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
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>
                {submitted ? toCleanUppercase(t.scoreBadge) : toCleanUppercase(t.answeredBadge)}:
              </span>
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
          <div className="flex items-center gap-3">
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
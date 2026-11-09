// pages/st-dimotikou/45-problem-analoga-posa-ask.js
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

// Component κατακόρυφου κλάσματος
export function Fraction({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle mx-0.5 sm:mx-1 font-mono text-center leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-1 pb-0.5 text-center leading-none break-all text-xs sm:text-sm font-bold">
        {num}
      </span>
      <span className="px-1 pt-0.5 text-center leading-none break-all text-xs sm:text-sm font-bold">
        {den}
      </span>
    </span>
  );
}

// Μορφοποίηση αριθμού βάσει locale (el-GR / en-US)
function formatNum(val, decimals = 2, locale = 'el') {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const num = Number(val);
  const targetLocale = locale === 'en' ? 'en-US' : 'el-GR';
  return num.toLocaleString(targetLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

// Δημιουργία αυστηρά 4 μοναδικών επιλογών για MCQ
function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set([String(correct)]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && String(opt).trim() !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }

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

// ---------------------------------------------------------
// ΛΕΞΙΚΟ i18n
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Προβλήματα με Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση προβλημάτων με ανάλογα ποσά και αναγωγή στη μονάδα για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 45 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Προβλήματα με Ανάλογα Ποσά",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην αναγωγή στη μονάδα, στη μέθοδο των σταυρωτών γινομένων (χιαστί) και στον συντελεστή αναλογίας λ!",
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
    pageTitle: "Exercises: Proportional Word Problems - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on solving proportional word problems, unit rate, and cross-multiplication for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 45 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Proportional Word Problems",
    desc: "Solve the 10 dynamic problems to practice unit rate reduction, cross-multiplication, and using the proportionality constant λ!",
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
    id: 'prob_std_1',
    generate: (locale) => {
      const kg1 = randInt(3, 5);
      const unitRate = randInt(4, 7);
      const cost1 = kg1 * unitRate;
      const kg2 = kg1 + randInt(3, 6);
      const cost2 = kg2 * unitRate;
      return {
        title: locale === 'en' ? 'Apple Purchase (Unit Rate)' : 'Αγορά Μήλων με Αναγωγή στη Μονάδα',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `For ${kg1} kg of apples we paid ${cost1} €. How many € will we pay for ${kg2} kg of the same apples?`
              : `Για ${kg1} kg μήλα πληρώσαμε ${cost1} €. Πόσα € θα πληρώσουμε για ${kg2} kg από τα ίδια μήλα;`}
          </span>
        ),
        unit: '€',
        correctVal: String(cost2),
        correctText: `${cost2} €`,
        tableData: [
          { item: locale === 'en' ? 'Unit rate (1 kg)' : 'Αναγωγή στη μονάδα (1 kg)', formula: `${cost1} : ${kg1}`, val: `${unitRate} €/kg` },
          { item: locale === 'en' ? 'New quantity (x)' : 'Νέα ποσότητα (x)', formula: `${kg2} kg`, val: `${kg2} kg` },
          { item: locale === 'en' ? 'Final cost' : 'Τελικό κόστος', formula: `${kg2} · ${unitRate}`, val: `${cost2} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `Using unit rate: 1 kg costs ${cost1} : ${kg1} ＝ ${unitRate} €. Therefore, ${kg2} kg cost ${kg2} · ${unitRate} ＝ ${cost2} €.`
                : `Με αναγωγή στη μονάδα: το 1 kg κοστίζει ${cost1} : ${kg1} ＝ ${unitRate} €. Άρα τα ${kg2} kg κοστίζουν ${kg2} · ${unitRate} ＝ ${cost2} €.`}
            </span>
          </span>
        ),
        distractors: [
          `${cost2 + unitRate} €`,
          `${Math.max(1, cost2 - unitRate)} €`,
          `${cost2 + 2 * unitRate} €`
        ]
      };
    }
  },
  {
    id: 'prob_std_2',
    generate: (locale) => {
      const hours1 = randInt(2, 4);
      const speed = randInt(65, 85);
      const dist1 = hours1 * speed;
      const hours2 = hours1 + randInt(2, 3);
      const dist2 = hours2 * speed;
      return {
        title: locale === 'en' ? 'Constant Speed Travel' : 'Διαδρομή με Σταθερή Ταχύτητα',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `A car travels ${dist1} km in ${hours1} hours. How many km will it travel in ${hours2} hours at the same constant speed?`
              : `Ένα αυτοκίνητο διανύει ${dist1} km σε ${hours1} ώρες. Πόσα km θα διανύσει σε ${hours2} ώρες αν διατηρεί σταθερή ταχύτητα;`}
          </span>
        ),
        unit: 'km',
        correctVal: String(dist2),
        correctText: `${dist2} km`,
        tableData: [
          { item: locale === 'en' ? 'Speed (Distance per 1 h)' : 'Ταχύτητα (Απόσταση ανά 1 h)', formula: `${dist1} : ${hours1}`, val: `${speed} km/h` },
          { item: locale === 'en' ? 'Travel time' : 'Χρόνος ταξιδιού', formula: `${hours2} h`, val: `${hours2} h` },
          { item: locale === 'en' ? 'Total distance' : 'Συνολική απόσταση', formula: `${hours2} · ${speed}`, val: `${dist2} km` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `In 1 hour it covers ${dist1} : ${hours1} ＝ ${speed} km. In ${hours2} hours it will cover: ${hours2} · ${speed} ＝ ${dist2} km.`
                : `Σε 1 ώρα διανύει ${dist1} : ${hours1} ＝ ${speed} km (ταχύτητα). Σε ${hours2} ώρες θα διανύσει: ${hours2} · ${speed} ＝ ${dist2} km.`}
            </span>
          </span>
        ),
        distractors: [
          `${dist2 + speed} km`,
          `${Math.max(20, dist2 - speed)} km`,
          `${dist2 + 30} km`
        ]
      };
    }
  },
  {
    id: 'prob_std_3',
    generate: (locale) => {
      const eggs1 = randInt(2, 4);
      const mult = randInt(4, 6);
      const rate = mult * 5;
      const cookies1 = eggs1 * rate;
      const eggs2 = eggs1 + randInt(2, 4);
      const cookies2 = eggs2 * rate;
      const unitLabel = locale === 'en' ? 'cookies' : 'μπισκότα';
      return {
        title: locale === 'en' ? 'Recipe Proportion (Eggs & Cookies)' : 'Αναλογία Αυγών και Μπισκότων',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `With ${eggs1} eggs a baker makes ${cookies1} cookies. How many cookies will be made with ${eggs2} eggs using the exact same recipe proportion?`
              : `Με ${eggs1} αυγά μια ζαχαροπλάστης φτιάχνει ${cookies1} μπισκότα. Πόσα μπισκότα θα φτιάξει με ${eggs2} αυγά ακολουθώντας την ίδια αναλογία;`}
          </span>
        ),
        unit: unitLabel,
        correctVal: String(cookies2),
        correctText: `${cookies2} ${unitLabel}`,
        tableData: [
          { item: locale === 'en' ? 'Cookies per 1 egg' : 'Μπισκότα ανά 1 αυγό', formula: `${cookies1} : ${eggs1}`, val: `${rate} ${locale === 'en' ? 'items' : 'τεμάχια'}` },
          { item: locale === 'en' ? 'New egg quantity' : 'Νέα ποσότητα αυγών', formula: `${eggs2}`, val: `${eggs2}` },
          { item: locale === 'en' ? 'Total cookies' : 'Συνολικά μπισκότα', formula: `${eggs2} · ${rate}`, val: `${cookies2} ${unitLabel}` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `With 1 egg: ${cookies1} : ${eggs1} ＝ ${rate} cookies. With ${eggs2} eggs: ${eggs2} · ${rate} ＝ ${cookies2} cookies.`
                : `Με 1 αυγό φτιάχνονται ${cookies1} : ${eggs1} ＝ ${rate} μπισκότα. Με ${eggs2} αυγά θα φτιαχτούν: ${eggs2} · ${rate} ＝ ${cookies2} μπισκότα.`}
            </span>
          </span>
        ),
        distractors: [
          `${cookies2 + 15} ${unitLabel}`,
          `${Math.max(10, cookies2 - 20)} ${unitLabel}`,
          `${cookies2 + 30} ${unitLabel}`
        ]
      };
    }
  },
  {
    id: 'prob_std_4',
    generate: (locale) => {
      const days1 = randInt(3, 6);
      const earnPerDay = randInt(35, 55);
      const total1 = days1 * earnPerDay;
      const days2 = days1 + randInt(3, 5);
      const total2 = days2 * earnPerDay;
      return {
        title: locale === 'en' ? 'Daily Wage & Worker Payment' : 'Ημερομίσθιο και Αμοιβή Τεχνίτη',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `A technician was paid ${total1} € for ${days1} days of work. How many € will he receive for ${days2} days of work at the same daily rate?`
              : `Ένας τεχνίτης αμείφθηκε με ${total1} € για εργασία ${days1} ημερών. Πόσα € θα λάβει αν εργαστεί για ${days2} ημέρες με το ίδιο ημερομίσθιο;`}
          </span>
        ),
        unit: '€',
        correctVal: String(total2),
        correctText: `${total2} €`,
        tableData: [
          { item: locale === 'en' ? 'Daily wage (1 day)' : 'Ημερομίσθιο (1 ημέρα)', formula: `${total1} : ${days1}`, val: `${earnPerDay} €/day` },
          { item: locale === 'en' ? 'Working days' : 'Ημέρες εργασίας', formula: `${days2}`, val: `${days2}` },
          { item: locale === 'en' ? 'Total payment' : 'Συνολική αμοιβή', formula: `${days2} · ${earnPerDay}`, val: `${total2} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `The daily rate is ${total1} : ${days1} ＝ ${earnPerDay} €/day. For ${days2} days: ${days2} · ${earnPerDay} ＝ ${total2} €.`
                : `Το ημερομίσθιο (τιμή της μονάδας) είναι ${total1} : ${days1} ＝ ${earnPerDay} €/ημέρα. Για ${days2} ημέρες θα λάβει: ${days2} · ${earnPerDay} ＝ ${total2} €.`}
            </span>
          </span>
        ),
        distractors: [
          `${total2 + earnPerDay} €`,
          `${Math.max(20, total2 - earnPerDay)} €`,
          `${total2 + 40} €`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'prob_hard_1',
    generate: (locale) => {
      const olivesKg = 24;
      const oilLiters = 4;
      const targetMlLiters = 7500;
      const targetLiters = targetMlLiters / 1000;
      const rate = olivesKg / oilLiters;
      const olivesNeeded = targetLiters * rate;
      return {
        title: locale === 'en' ? 'Olive Oil Yield with Unit Conversion' : 'Παραγωγή Ελαιολάδου με Μετατροπή Μονάδων',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `From ${olivesKg} kg of olives, ${oilLiters} l of olive oil are produced. How many kg of olives are required to produce ${formatNum(targetMlLiters, 0, locale)} ml of olive oil of the same quality?`
              : `Από ${olivesKg} kg ελιές παράγονται ${oilLiters} l ελαιόλαδο. Πόσα kg ελιές απαιτούνται για να παραχθούν ${formatNum(targetMlLiters, 0, locale)} ml ελαιόλαδο ίδιας ποιότητας;`}
          </span>
        ),
        unit: 'kg',
        correctVal: formatNum(olivesNeeded, 2, locale),
        correctText: `${formatNum(olivesNeeded, 2, locale)} kg`,
        tableData: [
          { item: locale === 'en' ? 'Convert ml to liters' : 'Μετατροπή ml σε λίτρα', formula: `${formatNum(targetMlLiters, 0, locale)} ml : 1.000`, val: `${formatNum(targetLiters, 2, locale)} l` },
          { item: locale === 'en' ? 'Olives per 1 l oil' : 'Ελιές ανά 1 l λάδι', formula: `${olivesKg} : ${oilLiters}`, val: `${rate} kg/l` },
          { item: locale === 'en' ? 'Required olives' : 'Απαιτούμενες ελιές', formula: `${formatNum(targetLiters, 2, locale)} · ${rate}`, val: `${formatNum(olivesNeeded, 2, locale)} kg` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `Convert ml to liters: ${formatNum(targetMlLiters, 0, locale)} ml ＝ ${formatNum(targetLiters, 2, locale)} l. For 1 l of oil we need ${olivesKg} : ${oilLiters} ＝ ${rate} kg olives. For ${formatNum(targetLiters, 2, locale)} l: ${formatNum(targetLiters, 2, locale)} · ${rate} ＝ ${formatNum(olivesNeeded, 2, locale)} kg olives.`
                : `Μετατρέπουμε τα ml σε λίτρα: ${formatNum(targetMlLiters, 0, locale)} ml ＝ ${formatNum(targetLiters, 2, locale)} l. Για 1 l λάδι χρειάζονται ${olivesKg} : ${oilLiters} ＝ ${rate} kg ελιές. Για ${formatNum(targetLiters, 2, locale)} l απαιτούνται: ${formatNum(targetLiters, 2, locale)} · ${rate} ＝ ${formatNum(olivesNeeded, 2, locale)} kg ελιές.`}
            </span>
          </span>
        ),
        distractors: [
          `${formatNum(olivesNeeded + 6, 2, locale)} kg`,
          `${formatNum(Math.max(1, olivesNeeded - 6), 2, locale)} kg`,
          `${formatNum(olivesNeeded + 12, 2, locale)} kg`
        ]
      };
    }
  },
  {
    id: 'prob_hard_2',
    generate: (locale) => {
      const flourGrams = 750;
      const breadKg = 1.2;
      const targetFlourKg = 2.5;
      const targetFlourGrams = targetFlourKg * 1000;
      const breadProduced = (breadKg * targetFlourGrams) / flourGrams;
      return {
        title: locale === 'en' ? 'Bread Baking with Unit Conversion' : 'Παραγωγή Ψωμιού με Μετατροπή Μονάδων',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `From ${formatNum(flourGrams, 0, locale)} g of flour a baker makes ${formatNum(breadKg, 2, locale)} kg of bread. How many kg of bread will be baked using ${formatNum(targetFlourKg, 2, locale)} kg of the same flour?`
              : `Από ${formatNum(flourGrams, 0, locale)} g αλεύρι ένας φούρναρης παρασκευάζει ${formatNum(breadKg, 2, locale)} kg ψωμί. Πόσα kg ψωμί θα παρασκευάσει χρησιμοποιώντας ${formatNum(targetFlourKg, 2, locale)} kg από το ίδιο αλεύρι;`}
          </span>
        ),
        unit: 'kg',
        correctVal: formatNum(breadProduced, 2, locale),
        correctText: `${formatNum(breadProduced, 2, locale)} kg`,
        tableData: [
          { item: locale === 'en' ? 'Convert kg to grams' : 'Μετατροπή kg σε γραμμάρια', formula: `${formatNum(targetFlourKg, 2, locale)} kg · 1.000`, val: `${formatNum(targetFlourGrams, 0, locale)} g` },
          { item: locale === 'en' ? 'Cross-multiplication' : 'Αναλογία χιαστί', formula: `(${formatNum(breadKg, 2, locale)} · ${formatNum(targetFlourGrams, 0, locale)}) : ${flourGrams}`, val: `${formatNum(breadProduced, 2, locale)} kg` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `Convert ${formatNum(targetFlourKg, 2, locale)} kg to grams: ${formatNum(targetFlourGrams, 0, locale)} g. Proportion: ${flourGrams} : ${formatNum(breadKg, 2, locale)} ＝ ${formatNum(targetFlourGrams, 0, locale)} : x. Cross-multiplication: x ＝ (${formatNum(breadKg, 2, locale)} · ${formatNum(targetFlourGrams, 0, locale)}) : ${flourGrams} ＝ ${formatNum(breadProduced, 2, locale)} kg.`
                : `Μετατρέπουμε τα ${formatNum(targetFlourKg, 2, locale)} kg σε γραμμάρια: ${formatNum(targetFlourGrams, 0, locale)} g. Στήνουμε την αναλογία: ${flourGrams} : ${formatNum(breadKg, 2, locale)} ＝ ${formatNum(targetFlourGrams, 0, locale)} : x. Με χιαστί: x ＝ (${formatNum(breadKg, 2, locale)} · ${formatNum(targetFlourGrams, 0, locale)}) : ${flourGrams} ＝ ${formatNum(breadProduced, 2, locale)} kg.`}
            </span>
          </span>
        ),
        distractors: [
          `${formatNum(breadProduced + 0.8, 2, locale)} kg`,
          `${formatNum(Math.max(1, breadProduced - 0.8), 2, locale)} kg`,
          `${formatNum(breadProduced + 1.5, 2, locale)} kg`
        ]
      };
    }
  },
  {
    id: 'prob_hard_3',
    generate: (locale) => {
      const distKm = 54;
      const min1 = 45;
      const min2 = 150; // 2 h 30 min
      const dist2 = (distKm / min1) * min2;
      return {
        title: locale === 'en' ? 'Vehicle Trip with Hours & Minutes' : 'Διαδρομή Οχήματος με Ώρες και Λεπτά',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `A vehicle traveled ${distKm} km in 45 minutes at a constant speed. How many km will it travel in 2 hours and 30 minutes?`
              : `Ένα όχημα διήνυσε ${distKm} km σε 45 λεπτά κινούμενο με σταθερό ρυθμό. Πόσα km θα διανύσει σε χρόνο 2 ωρών και 30 λεπτών;`}
          </span>
        ),
        unit: 'km',
        correctVal: String(dist2),
        correctText: `${dist2} km`,
        tableData: [
          { item: locale === 'en' ? 'Time 2 in minutes' : 'Χρόνος 2 σε λεπτά', formula: '2 h 30 min ＝ (2 · 60) ＋ 30', val: `${min2} min` },
          { item: locale === 'en' ? 'Distance proportion' : 'Αναλογία αποστάσεων', formula: `(${distKm} · ${min2}) : ${min1}`, val: `${dist2} km` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `Convert time to minutes: 45 min and 2 h 30 min ＝ 150 min. Proportion: 45 : ${distKm} ＝ 150 : x. By cross-multiplication: x ＝ (${distKm} · 150) : 45 ＝ ${dist2} km.`
                : `Εκφράζουμε τους χρόνους σε λεπτά: 45 min και 2 h 30 min ＝ 150 min. Στήνουμε την αναλογία: 45 : ${distKm} ＝ 150 : x. Με χιαστί βρίσκουμε: x ＝ (${distKm} · 150) : 45 ＝ ${dist2} km.`}
            </span>
          </span>
        ),
        distractors: [
          `${dist2 + 20} km`,
          `${Math.max(10, dist2 - 25)} km`,
          `${dist2 + 36} km`
        ]
      };
    }
  },
  {
    id: 'prob_hard_4',
    generate: (locale) => {
      const wireCm = 150;
      const wireGrams = 450;
      const targetMeters = 4.2;
      const targetCm = Math.round(targetMeters * 100);
      const rate = wireGrams / wireCm;
      const targetGrams = (wireGrams * targetCm) / wireCm;
      return {
        title: locale === 'en' ? 'Metal Wire Mass with Unit Conversion' : 'Μάζα Μεταλλικού Σύρματος με Μετατροπή Μονάδων',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `A metal wire measuring ${wireCm} cm has a mass of ${wireGrams} g. What is the mass in g of a wire made of the same metal with a length of ${formatNum(targetMeters, 1, locale)} m?`
              : `Ένα μεταλλικό σύρμα μήκους ${wireCm} cm έχει μάζα ${wireGrams} g. Ποια είναι η μάζα σε g ενός σύρματος από το ίδιο μέταλλο με μήκος ${formatNum(targetMeters, 1, locale)} m;`}
          </span>
        ),
        unit: 'g',
        correctVal: String(targetGrams),
        correctText: `${targetGrams} g`,
        tableData: [
          { item: locale === 'en' ? 'Convert meters to cm' : 'Μετατροπή μέτρων σε cm', formula: `${formatNum(targetMeters, 1, locale)} m · 100`, val: `${targetCm} cm` },
          { item: locale === 'en' ? 'Mass per 1 cm' : 'Μάζα ανά 1 cm', formula: `${wireGrams} : ${wireCm}`, val: `${rate} g/cm` },
          { item: locale === 'en' ? 'Total mass' : 'Συνολική μάζα', formula: `${targetCm} · ${rate}`, val: `${targetGrams} g` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `Convert ${formatNum(targetMeters, 1, locale)} m to cm: ${targetCm} cm. Per 1 cm: ${wireGrams} : ${wireCm} ＝ ${rate} g. For ${targetCm} cm: ${targetCm} · ${rate} ＝ ${targetGrams} g.`
                : `Μετατρέπουμε τα ${formatNum(targetMeters, 1, locale)} m σε cm: ${targetCm} cm. Στο 1 cm αντιστοιχούν ${wireGrams} : ${wireCm} ＝ ${rate} g. Για ${targetCm} cm η μάζα είναι: ${targetCm} · ${rate} ＝ ${targetGrams} g.`}
            </span>
          </span>
        ),
        distractors: [
          `${targetGrams + 120} g`,
          `${Math.max(50, targetGrams - 150)} g`,
          `${targetGrams + 200} g`
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  // Q1: Input - Αναγωγή στη Μονάδα (Βήμα 1)
  const q1Count = randInt(4, 8);
  const q1UnitCost = randInt(3, 7);
  const q1TotalCost = q1Count * q1UnitCost;

  // Q2: MCQ - Μαθηματική έκφραση αναγωγής (4 μοναδικές επιλογές)
  const q2Items = randInt(3, 6);
  const q2Price = randInt(12, 24);
  const q2TargetItems = q2Items + randInt(2, 4);
  const q2CorrectExpr = `(${q2Price} : ${q2Items}) · ${q2TargetItems}`;
  const q2WrongCandidates = [
    `(${q2Price} · ${q2Items}) : ${q2TargetItems}`,
    `(${q2Price} ＋ ${q2Items}) · ${q2TargetItems}`,
    `(${q2Price} : ${q2TargetItems}) · ${q2Items}`
  ];
  const q2Options = makeUniqueOptions(q2CorrectExpr, q2WrongCandidates);

  // Q3: Input - Επίλυση με Σταυρωτά Γινόμενα (Χιαστί)
  const q3A = randInt(3, 6);
  const q3B = randInt(15, 30);
  const q3C = q3A * randInt(2, 4);
  const q3D = (q3B * q3C) / q3A;

  // Q4: MCQ - Σύγκριση μεθόδων (4 μοναδικές επιλογές)
  const q4Correct = locale === 'en'
    ? 'All methods (unit rate, cross-multiplication, constant λ) lead to the exact same result'
    : 'Όλες οι μέθοδοι (αναγωγή στη μονάδα, χιαστί, συντελεστής λ) οδηγούν στο ίδιο ακριβώς αποτέλεσμα';
  const q4WrongCandidates = locale === 'en'
    ? [
        'Unit rate always yields a higher value than cross-multiplication',
        'The proportionality constant only applies to non-proportional quantities',
        'Cross-multiplication only works when all quantities are whole integers'
      ]
    : [
        'Η αναγωγή στη μονάδα δίνει πάντοτε μεγαλύτερο αποτέλεσμα από το χιαστί',
        'Ο συντελεστής αναλογίας μπορεί να εφαρμοστεί μόνο σε μη ανάλογα ποσά',
        'Η μέθοδος χιαστί εφαρμόζεται μόνο όταν τα ποσά έχουν ακέραιες τιμές'
      ];
  const q4Options = makeUniqueOptions(q4Correct, q4WrongCandidates);

  // Q5: Input - Χρήση του Συντελεστή Αναλογίας (y = λ · x)
  const q5Lambda = randInt(4, 9);
  const q5TargetX = randInt(5, 12);
  const q5ExpectedY = q5Lambda * q5TargetX;

  // Q6: MCQ - Κανόνας μονάδων μέτρησης (4 μοναδικές επιλογές)
  const q6Correct = locale === 'en'
    ? 'We must first convert like quantities to the same unit of measurement (e.g. all in kg or all in g)'
    : 'Πρέπει πρώτα να μετατρέψουμε τα ομοειδή ποσά στην ίδια μονάδα μέτρησης (π.χ. όλα σε kg ή όλα σε g)';
  const q6WrongCandidates = locale === 'en'
    ? [
        'We can directly multiply without performing any conversions',
        'We should add the numbers together regardless of their unit labels',
        'Word problems containing mixed units cannot be solved'
      ]
    : [
        'Μπορούμε να κάνουμε κατευθείαν πολλαπλασιασμό χωρίς καμία μετατροπή',
        'Πρέπει να προσθέσουμε τους αριθμούς ανεξάρτητα από τις μονάδες τους',
        'Δεν επιτρέπεται να λύσουμε πρόβλημα που περιέχει διαφορετικές μονάδες μέτρησης'
      ];
  const q6Options = makeUniqueOptions(q6Correct, q6WrongCandidates);

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
      inputType: 'number',
      title: locale === 'en' ? 'Unit Rate Reduction' : 'Αναγωγή στη Μονάδα',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `If ${q1Count} identical books cost ${q1TotalCost} € in total, how many € does 1 book cost?`
            : `Αν ${q1Count} ίδια βιβλία κοστίζουν συνολικά ${q1TotalCost} €, πόσα € κοστίζει το 1 βιβλίο;`}
        </span>
      ),
      correct: String(q1UnitCost),
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `To find unit cost, divide total cost by quantity: ${q1TotalCost} : ${q1Count} ＝ ${q1UnitCost} €.`
            : `Για να βρούμε την τιμή της 1 μονάδας (αναγωγή στη μονάδα), διαιρούμε το συνολικό κόστος με το πλήθος των τεμαχίων: ${q1TotalCost} : ${q1Count} ＝ ${q1UnitCost} €.`}
        </span>
      )
    },
    {
      id: 'q2',
      type: 'mcq',
      title: locale === 'en' ? 'Unit Rate Mathematical Expression' : 'Μαθηματική Έκφραση Αναγωγής',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `If ${q2Items} items cost ${q2Price} €, which mathematical expression represents the cost of ${q2TargetItems} items using unit rate reduction?`
            : `Αν ${q2Items} τεμάχια κοστίζουν ${q2Price} €, ποια έκφραση δίνει το κόστος των ${q2TargetItems} τεμαχίων με τη μέθοδο της αναγωγής στη μονάδα;`}
        </span>
      ),
      options: q2Options,
      correct: q2CorrectExpr,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `First calculate unit cost (${q2Price} : ${q2Items}) and then multiply by target quantity (${q2TargetItems}): ${q2CorrectExpr}.`
            : `Πρώτα υπολογίζουμε την τιμή του ενός τεμαχίου (${q2Price} : ${q2Items}) και στη συνέχεια πολλαπλασιάζουμε με το ζητούμενο πλήθος (${q2TargetItems}): ${q2CorrectExpr}.`}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Solving with Cross-Multiplication' : 'Επίλυση με Χιαστί',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `In a proportion table: ${q3A} kg correspond to ${q3B} € and ${q3C} kg correspond to x €. How many € is x?`
            : `Στον πίνακα ποσών και τιμών: ${q3A} kg αντιστοιχούν σε ${q3B} € και ${q3C} kg αντιστοιχούν σε x €. Πόσα € είναι το x;`}
        </span>
      ),
      correct: String(q3D),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          <span>x ＝ ({q3B} · {q3C}) : {q3A} ＝ {q3B * q3C} : {q3A} ＝ {q3D} €.</span>
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Comparing Solution Methods' : 'Σύγκριση Μεθόδων',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'Which of the following statements is true for directly proportional word problems?'
            : 'Ποια από τις παρακάτω προτάσεις ισχύει για τα προβλήματα με ανάλογα ποσά;'}
        </span>
      ),
      options: q4Options,
      correct: q4Correct,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'In proportional quantities, whether we use unit rate, cross-multiplication, or proportionality constant λ, we always arrive at the exact same result.'
            : 'Στα ανάλογα ποσά, είτε χρησιμοποιήσουμε αναγωγή στη μονάδα, είτε πίνακα με χιαστί, είτε τον συντελεστή λ, καταλήγουμε υποχρεωτικά στο ίδιο ακριβώς αποτέλεσμα.'}
        </span>
      )
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Using Proportionality Constant' : 'Χρήση Συντελεστή Αναλογίας',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `In a proportion problem, constant λ ＝ ${q5Lambda}. If the new value of quantity x is ${q5TargetX}, what is the corresponding value of y (y ＝ λ · x)?`
            : `Σε ένα πρόβλημα ανάλογων ποσών ο συντελεστής αναλογίας υπολογίστηκε ίσος με λ ＝ ${q5Lambda}. Αν η νέα τιμή του ποσού x είναι ${q5TargetX}, ποια είναι η αντίστοιχη τιμή του y;`}
        </span>
      ),
      correct: String(q5ExpectedY),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          <span>y ＝ λ · x ＝ {q5Lambda} · {q5TargetX} ＝ {q5ExpectedY}.</span>
        </span>
      )
    },
    {
      id: 'q6',
      type: 'mcq',
      title: locale === 'en' ? 'Measurement Unit Rule' : 'Κανόνας Μονάδων Μέτρησης',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'What must we always verify when one measurement is given in kg and another like measurement in g?'
            : 'Τι πρέπει οπωσδήποτε να κάνουμε σε ένα πρόβλημα ανάλογων ποσών όταν η μία ποσότητα δίνεται σε kg και η άλλη σε g;'}
        </span>
      ),
      options: q6Options,
      correct: q6Correct,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'When comparing like quantities, they must be converted to the exact same unit before performing calculations.'
            : 'Όταν συγκρίνουμε ομοειδή ποσά, είναι απαραίτητο να εκφράζονται στην ίδια ακριβώς μονάδα μέτρησης πριν εκτελεστεί οποιαδήποτε πράξη ή αναλογία.'}
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

export default function ProblemAnalogaPosaExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/^[xyψχ][=＝]/i, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/^[xyψχ][=＝]/i, '').trim().toLowerCase();

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
          href="/st-dimotikou/45-problem-analoga-posa"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryNav)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden min-w-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl min-w-0">
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
        <form onSubmit={handleSubmit} className="space-y-8 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8 min-w-0">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 max-w-full overflow-hidden ${getCardStyle(
                    q
                  )}`}
                >
                  <div className="min-w-0">
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3 gap-2 min-w-0">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3 min-w-0">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt.val;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, opt.val, 'mcq')}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition touch-manipulation active:scale-95 break-words whitespace-normal leading-snug flex items-center justify-center min-h-[48px] min-w-0 ${
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
                      <div className="space-y-2 mb-3 min-w-0">
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
                          aria-label={`Answer for exercise ${qNum}`}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner min-w-0"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="w-full min-w-0 overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200 block">
                          <table className="w-full text-xs text-left text-slate-700 min-w-[280px]">
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
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
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
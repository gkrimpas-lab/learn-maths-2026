// pages/st-dimotikou/44-analoga-posa-ask.js
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

// Component κατακόρυφου κλάσματος
export function Fraction({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono text-center leading-none shrink-0 max-w-full ${className}`}
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

// ---------------------------------------------------------
// ΛΕΞΙΚΟ i18n
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα ανάλογα ποσά, τον συντελεστή αναλογίας και τη γραφική παράσταση για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 44 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Ανάλογα Ποσά",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον υπολογισμό του συντελεστή αναλογίας λ, στη συμπλήρωση πινάκων τιμών και στη γραφική παράσταση!",
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
    pageTitle: "Exercises: Directly Proportional Quantities - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on proportional quantities, proportionality constant, and line graphs for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 44 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Directly Proportional Quantities",
    desc: "Solve the 10 dynamic problems to practice calculating the proportionality constant λ, completing value tables, and reading linear graphs!",
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
    id: 'analoga_std_1',
    generate: (locale) => {
      const kg1 = randInt(2, 4);
      const lambdaVal = randInt(3, 6);
      const cost1 = kg1 * lambdaVal;
      const kg2 = kg1 + randInt(3, 5);
      const cost2 = kg2 * lambdaVal;
      return {
        title: locale === 'en' ? 'Fruit Purchase' : 'Αγορά Φρούτων',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `The quantities "fruit weight (kg)" and "cost (€)" are directly proportional. If we paid ${cost1} € for ${kg1} kg, how many € will we pay for ${kg2} kg of the same fruit?`
              : `Τα ποσά «βάρος φρούτων (kg)» και «κόστος (€)» είναι ανάλογα. Αν για ${kg1} kg πληρώσαμε ${cost1} €, πόσα € θα πληρώσουμε για ${kg2} kg από τα ίδια φρούτα;`}
          </span>
        ),
        unit: '€',
        correctVal: String(cost2),
        correctText: `${cost2} €`,
        tableData: [
          { item: locale === 'en' ? 'Proportionality constant λ' : 'Συντελεστής αναλογίας λ', formula: `${cost1} : ${kg1}`, val: `${lambdaVal} €/kg` },
          { item: locale === 'en' ? 'New quantity (x)' : 'Νέα ποσότητα (x)', formula: `${kg2} kg`, val: `${kg2} kg` },
          { item: locale === 'en' ? 'Final cost (y)' : 'Τελικό κόστος (y)', formula: `${lambdaVal} · ${kg2}`, val: `${cost2} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>λ ＝ {cost1} : {kg1} ＝ {lambdaVal} €/kg.</span>
            <span>y ＝ λ · x ＝ {lambdaVal} · {kg2} ＝ {cost2} €.</span>
          </span>
        ),
        distractors: [
          `${cost2 + lambdaVal} €`,
          `${Math.max(1, cost2 - lambdaVal)} €`,
          `${cost2 + 2 * lambdaVal} €`
        ]
      };
    }
  },
  {
    id: 'analoga_std_2',
    generate: (locale) => {
      const speed = randInt(65, 90);
      const hours1 = randInt(2, 3);
      const dist1 = speed * hours1;
      const hours2 = hours1 + randInt(2, 4);
      const dist2 = speed * hours2;
      return {
        title: locale === 'en' ? 'Train Travel at Constant Speed' : 'Κίνηση Τρένου με Σταθερή Ταχύτητα',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `A train moves at constant speed, so time and distance are directly proportional. If it covers ${dist1} km in ${hours1} hours, how many km will it cover in ${hours2} hours?`
              : `Ένα τρένο κινείται με σταθερή ταχύτητα, άρα ο χρόνος και η απόσταση είναι ανάλογα ποσά. Αν σε ${hours1} ώρες διανύει ${dist1} km, πόσα km θα διανύσει σε ${hours2} ώρες;`}
          </span>
        ),
        unit: 'km',
        correctVal: String(dist2),
        correctText: `${dist2} km`,
        tableData: [
          { item: locale === 'en' ? 'Constant λ (Speed)' : 'Συντελεστής αναλογίας λ (Ταχύτητα)', formula: `${dist1} : ${hours1}`, val: `${speed} km/h` },
          { item: locale === 'en' ? 'New time' : 'Νέος χρόνος', formula: `${hours2} h`, val: `${hours2} h` },
          { item: locale === 'en' ? 'Total distance' : 'Συνολική απόσταση', formula: `${speed} · ${hours2}`, val: `${dist2} km` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>λ ＝ {dist1} : {hours1} ＝ {speed} km/h.</span>
            <span>{speed} · {hours2} ＝ {dist2} km.</span>
          </span>
        ),
        distractors: [
          `${dist2 + speed} km`,
          `${Math.max(20, dist2 - speed)} km`,
          `${dist2 + 40} km`
        ]
      };
    }
  },
  {
    id: 'analoga_std_3',
    generate: (locale) => {
      const workers = randInt(2, 4);
      const rate = randInt(15, 25);
      const prod1 = workers * rate;
      const targetWorkers = workers + randInt(2, 5);
      const prod2 = targetWorkers * rate;
      const parcelUnit = locale === 'en' ? 'parcels' : 'δέματα';
      return {
        title: locale === 'en' ? 'Packaging Workshop Production' : 'Συσκευασία Δεμάτων σε Εργαστήριο',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `In a workshop, the number of workers and packaged parcels are directly proportional. If ${workers} workers package ${prod1} parcels, how many parcels will ${targetWorkers} workers package at the same rate?`
              : `Σε ένα εργαστήριο το πλήθος των εργατών και ο αριθμός των παραγόμενων δεμάτων είναι ανάλογα ποσά. Αν ${workers} εργάτες συσκευάζουν ${prod1} δέματα, πόσα δέματα θα συσκευάσουν ${targetWorkers} εργάτες με τον ίδιο ρυθμό;`}
          </span>
        ),
        unit: parcelUnit,
        correctVal: String(prod2),
        correctText: `${prod2} ${parcelUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Output per worker (λ)' : 'Απόδοση ανά εργάτη (λ)', formula: `${prod1} : ${workers}`, val: `${rate} ${parcelUnit}` },
          { item: locale === 'en' ? 'New workers' : 'Νέοι εργάτες', formula: `${targetWorkers}`, val: `${targetWorkers}` },
          { item: locale === 'en' ? 'Total production' : 'Συνολική παραγωγή', formula: `${targetWorkers} · ${rate}`, val: `${prod2} ${parcelUnit}` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>λ ＝ {prod1} : {workers} ＝ {rate} {parcelUnit}.</span>
            <span>{targetWorkers} · {rate} ＝ {prod2} {parcelUnit}.</span>
          </span>
        ),
        distractors: [
          `${prod2 + rate} ${parcelUnit}`,
          `${Math.max(10, prod2 - rate)} ${parcelUnit}`,
          `${prod2 + 20} ${parcelUnit}`
        ]
      };
    }
  },
  {
    id: 'analoga_std_4',
    generate: (locale) => {
      const flourPerBread = 0.5;
      const breads1 = randInt(6, 12);
      const flour1 = Number((breads1 * flourPerBread).toFixed(1));
      const breads2 = breads1 + randInt(4, 8);
      const flour2 = Number((breads2 * flourPerBread).toFixed(1));
      const kgUnit = 'kg';
      return {
        title: locale === 'en' ? 'Bread Baking from Flour' : 'Παραγωγή Ψωμιού από Αλεύρι',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `Flour weight and number of bread loaves baked are directly proportional. If ${breads1} loaves require ${formatNum(flour1, 1, locale)} kg of flour, how many kg of flour are needed for ${breads2} loaves?`
              : `Το βάρος του αλευριού και ο αριθμός των καρβελιών ψωμιού είναι ανάλογα ποσά. Αν για ${breads1} καρβέλια απαιτούνται ${formatNum(flour1, 1, locale)} kg αλεύρι, πόσα kg αλεύρι χρειάζονται για ${breads2} καρβέλια;`}
          </span>
        ),
        unit: kgUnit,
        correctVal: formatNum(flour2, 1, locale),
        correctText: `${formatNum(flour2, 1, locale)} ${kgUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Proportionality constant λ' : 'Συντελεστής αναλογίας λ', formula: `${formatNum(flour1, 1, locale)} : ${breads1}`, val: `${formatNum(flourPerBread, 1, locale)} kg/${locale === 'en' ? 'loaf' : 'καρβέλι'}` },
          { item: locale === 'en' ? 'Target loaves' : 'Στόχος παραγωγής', formula: `${breads2}`, val: `${breads2}` },
          { item: locale === 'en' ? 'Required flour' : 'Απαιτούμενο αλεύρι', formula: `${breads2} · ${formatNum(flourPerBread, 1, locale)}`, val: `${formatNum(flour2, 1, locale)} kg` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>λ ＝ {formatNum(flour1, 1, locale)} : {breads1} ＝ {formatNum(flourPerBread, 1, locale)} kg/{locale === 'en' ? 'loaf' : 'καρβέλι'}.</span>
            <span>{breads2} · {formatNum(flourPerBread, 1, locale)} ＝ {formatNum(flour2, 1, locale)} kg.</span>
          </span>
        ),
        distractors: [
          `${formatNum(flour2 + 1, 1, locale)} ${kgUnit}`,
          `${formatNum(Math.max(1, flour2 - 1), 1, locale)} ${kgUnit}`,
          `${formatNum(flour2 + 2, 1, locale)} ${kgUnit}`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'analoga_hard_1',
    generate: (locale) => {
      const massKg = 1.5;
      const price = 4.5;
      const targetGrams = 2500;
      const targetKg = targetGrams / 1000;
      const finalPrice = targetKg * 3;
      return {
        title: locale === 'en' ? 'Weight & Value Proportion with Conversion' : 'Αναλογία Βάρους και Αξίας με Μετατροπή',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `Weight and price of a grocery product are directly proportional. If ${formatNum(massKg, 1, locale)} kg cost ${formatNum(price, 1, locale)} €, how many € do ${formatNum(targetGrams, 0, locale)} g of the same product cost?`
              : `Το βάρος και η αξία ενός προϊόντος είναι ανάλογα ποσά. Αν τα ${formatNum(massKg, 1, locale)} kg κοστίζουν ${formatNum(price, 1, locale)} €, πόσα € κοστίζουν ${formatNum(targetGrams, 0, locale)} g από το ίδιο προϊόν;`}
          </span>
        ),
        unit: '€',
        correctVal: formatNum(finalPrice, 2, locale),
        correctText: `${formatNum(finalPrice, 2, locale)} €`,
        tableData: [
          { item: locale === 'en' ? 'Convert g to kg' : 'Μετατροπή γραμμαρίων σε kg', formula: `${formatNum(targetGrams, 0, locale)} g : 1.000`, val: `${formatNum(targetKg, 2, locale)} kg` },
          { item: locale === 'en' ? 'Constant λ' : 'Συντελεστής αναλογίας λ', formula: `${formatNum(price, 1, locale)} : ${formatNum(massKg, 1, locale)}`, val: '3 €/kg' },
          { item: locale === 'en' ? 'Final price' : 'Τελική τιμή', formula: `${formatNum(targetKg, 2, locale)} · 3`, val: `${formatNum(finalPrice, 2, locale)} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{formatNum(targetGrams, 0, locale)} g ＝ {formatNum(targetKg, 2, locale)} kg.</span>
            <span>λ ＝ {formatNum(price, 1, locale)} : {formatNum(massKg, 1, locale)} ＝ 3 €/kg.</span>
            <span>{formatNum(targetKg, 2, locale)} · 3 ＝ {formatNum(finalPrice, 2, locale)} €.</span>
          </span>
        ),
        distractors: [
          `${formatNum(finalPrice + 1.5, 2, locale)} €`,
          `${formatNum(Math.max(1, finalPrice - 1.5), 2, locale)} €`,
          `${formatNum(finalPrice + 3, 2, locale)} €`
        ]
      };
    }
  },
  {
    id: 'analoga_hard_2',
    generate: (locale) => {
      const side = randInt(3, 6);
      const perimeter = 4 * side;
      const area = side * side;
      const mult = 2;
      const newSide = side * mult;
      const newPerimeter = 4 * newSide;
      const newArea = newSide * newSide;
      const timesUnit = locale === 'en' ? 'times' : 'φορές';
      return {
        title: locale === 'en' ? 'Non-Proportional Quantity (Square Area)' : 'Μη Ανάλογο Ποσό (Εμβαδόν Τετραγώνου)',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `In a square with side ${side} cm, we double its side to ${newSide} cm. While its perimeter doubles from ${perimeter} cm to ${newPerimeter} cm (proportional), how many times greater does its area become (from ${area} cm² to ${newArea} cm²)?`
              : `Σε ένα τετράγωνο με πλευρά ${side} cm, διπλασιάζουμε την πλευρά του σε ${newSide} cm. Ενώ η περίμετρος διπλασιάζεται από ${perimeter} cm σε ${newPerimeter} cm (ανάλογο ποσό), πόσες φορές μεγαλύτερο γίνεται το εμβαδόν του (από ${area} cm² σε ${newArea} cm²);`}
          </span>
        ),
        unit: timesUnit,
        correctVal: '4',
        correctText: `4 ${timesUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Initial area' : 'Αρχικό εμβαδόν', formula: `${side} · ${side}`, val: `${area} cm²` },
          { item: locale === 'en' ? 'New area' : 'Νέο εμβαδόν', formula: `${newSide} · ${newSide}`, val: `${newArea} cm²` },
          { item: locale === 'en' ? 'Magnitude ratio' : 'Σχέση μεγεθών', formula: `${newArea} : ${area}`, val: `4 ${timesUnit}` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{newArea} : {area} ＝ 4.</span>
            <span>{locale === 'en' ? 'Area is NOT directly proportional to side length!' : 'Το εμβαδόν ΔΕΝ είναι ανάλογο με την πλευρά!'}</span>
          </span>
        ),
        distractors: [`2 ${timesUnit}`, `8 ${timesUnit}`, `6 ${timesUnit}`]
      };
    }
  },
  {
    id: 'analoga_hard_3',
    generate: (locale) => {
      const scale = 50000;
      const mapDist = 4.2;
      const realCm = mapDist * scale;
      const realKm = realCm / 100000;
      return {
        title: locale === 'en' ? 'Map Scale as Proportionality Constant' : 'Κλίμακα Χάρτη ως Συντελεστής Αναλογίας',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `On a map with scale 1 : 50.000, map distance and actual distance are directly proportional. If two landmarks are ${formatNum(mapDist, 1, locale)} cm apart on the map, how many km is their real distance?`
              : `Σε έναν χάρτη με κλίμακα 1 : 50.000, η απόσταση στον χάρτη και η πραγματική απόσταση είναι ανάλογα ποσά. Αν δύο σημεία απέχουν στον χάρτη ${formatNum(mapDist, 1, locale)} cm, πόσα km είναι η πραγματική τους απόσταση;`}
          </span>
        ),
        unit: 'km',
        correctVal: formatNum(realKm, 2, locale),
        correctText: `${formatNum(realKm, 2, locale)} km`,
        tableData: [
          { item: locale === 'en' ? 'Proportionality constant' : 'Συντελεστής αναλογίας', formula: '1 cm ➔ 50.000 cm', val: '50.000' },
          { item: locale === 'en' ? 'Real cm' : 'Πραγματική απόσταση σε cm', formula: `${formatNum(mapDist, 1, locale)} · 50.000`, val: `${formatNum(realCm, 0, locale)} cm` },
          { item: locale === 'en' ? 'Convert to km' : 'Μετατροπή σε km', formula: `${formatNum(realCm, 0, locale)} : 100.000`, val: `${formatNum(realKm, 2, locale)} km` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{formatNum(mapDist, 1, locale)} · 50.000 ＝ {formatNum(realCm, 0, locale)} cm ＝ {formatNum(realKm, 2, locale)} km.</span>
          </span>
        ),
        distractors: [
          `${formatNum(realKm + 2.1, 2, locale)} km`,
          `${formatNum(Math.max(1, realKm - 1), 2, locale)} km`,
          `${formatNum(realKm + 1, 2, locale)} km`
        ]
      };
    }
  },
  {
    id: 'analoga_hard_4',
    generate: (locale) => {
      const totalSum = 360;
      const ratioA = 2;
      const ratioB = 3;
      const ratioC = 4;
      const sumParts = ratioA + ratioB + ratioC;
      const lambdaPart = totalSum / sumParts;
      const maxShare = ratioC * lambdaPart;
      return {
        title: locale === 'en' ? 'Proportional Sharing of an Amount' : 'Ανάλογη Μοιρασιά Ποσού',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `Three heirs share an estate of ${totalSum} € proportionally with multipliers ${ratioA}, ${ratioB}, and ${ratioC}. How many € did the person with the largest share receive?`
              : `Τρεις κληρονόμοι μοιράζονται ποσό ${totalSum} € ανάλογα με τους συντελεστές ${ratioA}, ${ratioB} και ${ratioC}. Πόσα € έλαβε αυτός που πήρε το μεγαλύτερο μερίδιο;`}
          </span>
        ),
        unit: '€',
        correctVal: String(maxShare),
        correctText: `${maxShare} €`,
        tableData: [
          { item: locale === 'en' ? 'Total parts' : 'Σύνολο μερών', formula: `${ratioA} ＋ ${ratioB} ＋ ${ratioC}`, val: `${sumParts} ${locale === 'en' ? 'parts' : 'μέρη'}` },
          { item: locale === 'en' ? 'Constant per share (λ)' : 'Συντελεστής ανά μερίδιο (λ)', formula: `${totalSum} : ${sumParts}`, val: `${lambdaPart} €` },
          { item: locale === 'en' ? 'Largest share' : 'Μεγαλύτερο μερίδιο', formula: `${ratioC} · ${lambdaPart}`, val: `${maxShare} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{ratioA} ＋ {ratioB} ＋ {ratioC} ＝ {sumParts}.</span>
            <span>λ ＝ {totalSum} : {sumParts} ＝ {lambdaPart} €.</span>
            <span>{ratioC} · {lambdaPart} ＝ {maxShare} €.</span>
          </span>
        ),
        distractors: [
          `${maxShare - lambdaPart} €`,
          `${maxShare + lambdaPart} €`,
          `${ratioB * lambdaPart} €`
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  // Q1: Input - Υπολογισμός συντελεστή αναλογίας λ
  const q1X = randInt(3, 6);
  const q1Lambda = randInt(4, 8);
  const q1Y = q1X * q1Lambda;

  // Q2: MCQ - Έλεγχος αναλογίας σε πίνακα (4 μοναδικές επιλογές)
  const q2Base2 = randInt(5, 8);
  const q2IsAnaloga = Math.random() > 0.4;
  const q2YVals = q2IsAnaloga
    ? [q2Base2, q2Base2 * 2, q2Base2 * 3]
    : [q2Base2, q2Base2 * 2 + 1, q2Base2 * 3];

  const q2CorrectAns = q2IsAnaloga
    ? (locale === 'en'
        ? 'Yes, because all quotients y : x are equal'
        : 'Ναι, γιατί όλα τα πηλίκα y : x είναι ίσα')
    : (locale === 'en'
        ? 'No, because the quotients y : x do not remain constant'
        : 'Όχι, γιατί τα πηλίκα y : x δεν παραμένουν σταθερά');

  const q2WrongCandidates = q2IsAnaloga
    ? (locale === 'en'
        ? [
            'No, because the numbers get bigger',
            'No, because cross products are different',
            'Yes, but only because all numbers are integers'
          ]
        : [
            'Όχι, γιατί οι αριθμοί μεγαλώνουν',
            'Όχι, γιατί τα σταυρωτά γινόμενα διαφέρουν',
            'Ναι, αλλά μόνο επειδή όλοι οι αριθμοί είναι ακέραιοι'
          ])
    : (locale === 'en'
        ? [
            'Yes, because both quantities increase together',
            'Yes, because the first column is a multiple',
            'No, because division by zero occurs'
          ]
        : [
            'Ναι, γιατί τα ποσά αυξάνονται ταυτόχρονα',
            'Ναι, γιατί η πρώτη στήλη είναι πολλαπλάσιο',
            'Όχι, γιατί προκύπτει διαίρεση με το μηδέν'
          ]);

  const q2Options = makeUniqueOptions(q2CorrectAns, q2WrongCandidates);

  // Q3: Input - Συμπλήρωση τιμής y με δεδομένο το λ
  const q3Lambda = randInt(3, 7);
  const q3TargetX = randInt(6, 12);
  const q3ExpectedY = q3Lambda * q3TargetX;

  // Q4: MCQ - Γραφική παράσταση ανάλογων ποσών (4 μοναδικές επιλογές)
  const q4Correct = locale === 'en'
    ? 'A straight line passing through the origin (0, 0)'
    : 'Ευθεία γραμμή που διέρχεται από την αρχή των αξόνων (0, 0)';
  const q4WrongCandidates = locale === 'en'
    ? [
        'A curved line starting at (0, 1)',
        'A straight line that never touches (0, 0)',
        'A broken line going up and down'
      ]
    : [
        'Καμπύλη γραμμή που ξεκινά από το σημείο (0, 1)',
        'Ευθεία γραμμή που δεν περνάει ποτέ από το σημείο (0, 0)',
        'Τεθλασμένη γραμμή που ανεβοκατεβαίνει'
      ];
  const q4Options = makeUniqueOptions(q4Correct, q4WrongCandidates);

  // Q5: Input - Εύρεση του x όταν δίνεται το y και το λ
  const q5Lambda = randInt(4, 9);
  const q5ExpectedX = randInt(5, 12);
  const q5YVal = q5Lambda * q5ExpectedX;

  // Q6: MCQ - Διάκριση ανάλογων & μη ανάλογων ποσών (4 μοναδικές επιλογές)
  const q6Correct = locale === 'en'
    ? "A person's age and height"
    : 'Η ηλικία ενός ανθρώπου και το ύψος του';
  const q6WrongCandidates = locale === 'en'
    ? [
        'Kilograms of apples and total cost',
        'Driving time at constant speed and distance',
        'Liters of fuel and cost at gas station'
      ]
    : [
        'Τα κιλά των μήλων και το συνολικό κόστος αγοράς τους',
        'Ο χρόνος οδήγησης με σταθερή ταχύτητα και η διανυόμενη απόσταση',
        'Τα λίτρα της βενζίνης και το ποσό πληρωμής στο πρατήριο'
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
      title: locale === 'en' ? 'Finding Constant λ' : 'Εύρεση Συντελεστή Αναλογίας',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `In two proportional quantities x and y, when x ＝ ${q1X}, y equals ${q1Y}. What is proportionality constant λ (λ ＝ y : x)?`
            : `Σε δύο ανάλογα ποσά x και y, όταν x ＝ ${q1X}, το y ισούται με ${q1Y}. Ποια είναι η τιμή του συντελεστή αναλογίας λ (λ ＝ y : x);`}
        </span>
      ),
      correct: String(q1Lambda),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>λ ＝ y : x ＝ {q1Y} : {q1X} ＝ {q1Lambda}.</span>
        </span>
      )
    },
    {
      id: 'q2',
      type: 'mcq',
      title: locale === 'en' ? 'Checking Proportionality in Table' : 'Έλεγχος Αναλογίας σε Πίνακα',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `Are quantities x and y directly proportional when for x ＝ [2, 4, 6] the corresponding y values are [${q2YVals[0]}, ${q2YVals[1]}, ${q2YVals[2]}]?`
            : `Είναι τα ποσά x και y ανάλογα όταν για x ＝ [2, 4, 6] οι αντίστοιχες τιμές y είναι [${q2YVals[0]}, ${q2YVals[1]}, ${q2YVals[2]}];`}
        </span>
      ),
      options: q2Options,
      correct: q2CorrectAns,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {q2CorrectAns}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Completing Proportional Value' : 'Συμπλήρωση Τιμής Ανάλογου Ποσού',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `Two quantities x and y are proportional with λ ＝ ${q3Lambda} (i.e. y ＝ ${q3Lambda} · x). If x ＝ ${q3TargetX}, what is y?`
            : `Δύο ποσά x και y είναι ανάλογα με συντελεστή αναλογίας λ ＝ ${q3Lambda} (δηλαδή y ＝ ${q3Lambda} · x). Αν x ＝ ${q3TargetX}, πόσο είναι το y;`}
        </span>
      ),
      correct: String(q3ExpectedY),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>y ＝ λ · x ＝ {q3Lambda} · {q3TargetX} ＝ {q3ExpectedY}.</span>
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Graph of Proportional Quantities' : 'Γραφική Παράσταση Ανάλογων Ποσών',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'What is the shape of the graph of directly proportional quantities on a coordinate plane?'
            : 'Ποια είναι η μορφή της γραφικής παράστασης δύο ανάλογων ποσών σε σύστημα αξόνων;'}
        </span>
      ),
      options: q4Options,
      correct: q4Correct,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'The graph of directly proportional quantities is always a straight line passing through the origin (0, 0).'
            : 'Η γραφική παράσταση δύο ανάλογων ποσών είναι πάντοτε ευθεία γραμμή που διέρχεται υποχρεωτικά από την αρχή των αξόνων (0, 0).'}
        </span>
      )
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Inverse Calculation of x' : 'Αντίστροφος Υπολογισμός',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `Two quantities x and y are proportional with constant λ ＝ ${q5Lambda}. If y ＝ ${q5YVal}, what is the corresponding value of x?`
            : `Δύο ποσά x και y είναι ανάλογα με συντελεστή λ ＝ ${q5Lambda}. Αν y ＝ ${q5YVal}, ποια είναι η αντίστοιχη τιμή του x;`}
        </span>
      ),
      correct: String(q5ExpectedX),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>x ＝ y : λ ＝ {q5YVal} : {q5Lambda} ＝ {q5ExpectedX}.</span>
        </span>
      )
    },
    {
      id: 'q6',
      type: 'mcq',
      title: locale === 'en' ? 'Distinguishing Proportional Quantities' : 'Διάκριση Ανάλογων & Μη Ανάλογων Ποσών',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'Which of the following pairs does NOT represent directly proportional quantities?'
            : 'Ποιο από τα παρακάτω ζεύγη ποσών ΔΕΝ αποτελεί ζεύγος ανάλογων ποσών;'}
        </span>
      ),
      options: q6Options,
      correct: q6Correct,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'Human height does not double when age doubles, so it is not proportional.'
            : 'Όταν η ηλικία ενός ανθρώπου διπλασιάζεται, το ύψος του δεν διπλασιάζεται. Συνεπώς η ηλικία και το ύψος δεν είναι ανάλογα ποσά.'}
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

export default function AnalogaPosaExercisesPage() {
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
          href="/st-dimotikou/44-analoga-posa"
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
                          aria-label={`Answer for exercise ${qNum}`}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="w-full min-w-0 overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200">
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
// pages/st-dimotikou/46-antistrofos-analoga-posa-ask.js
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
    pageTitle: "Ασκήσεις: Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα αντιστρόφως ανάλογα ποσά, το σταθερό γινόμενο και τη γραφική παράσταση για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 46 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Αντιστρόφως Ανάλογα Ποσά",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον υπολογισμό του σταθερού γινομένου α ＝ x · y, στη συμπλήρωση πινάκων τιμών και στη γραφική παράσταση (υπερβολή)!",
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
    pageTitle: "Exercises: Inversely Proportional Quantities - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on inversely proportional quantities, constant product, and hyperbola graphs for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 46 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Inversely Proportional Quantities",
    desc: "Solve the 10 dynamic problems to practice calculating constant product k ＝ x · y, completing value tables, and analyzing hyperbola graphs!",
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
    id: 'antistr_std_1',
    generate: (locale) => {
      const w1 = randInt(2, 4);
      const daysPerWorker = randInt(6, 12);
      const totalWork = w1 * daysPerWorker;
      const w2 = w1 + randInt(2, 4);
      const d2 = totalWork / w2;
      const cleanD2 = Number.isInteger(d2) ? d2 : Number(d2.toFixed(1));
      const dayUnit = locale === 'en' ? 'days' : 'ημέρες';
      return {
        title: locale === 'en' ? 'Workers & Project Completion Days' : 'Εργάτες και Ημέρες Ολοκλήρωσης Έργου',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `On a construction site, ${w1} workers finish a project in ${daysPerWorker} days. In how many days will ${w2} workers complete the same project working at the exact same rate?`
              : `Σε ένα εργοτάξιο ${w1} εργάτες τελειώνουν ένα έργο σε ${daysPerWorker} ημέρες. Σε πόσες ημέρες θα ολοκληρώσουν το ίδιο έργο ${w2} εργάτες με τον ίδιο ακριβώς ρυθμό εργασίας;`}
          </span>
        ),
        unit: dayUnit,
        correctVal: formatNum(cleanD2, 1, locale),
        correctText: `${formatNum(cleanD2, 1, locale)} ${dayUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Initial crew workload' : 'Αρχική ομάδα εργατών', formula: `${w1} · ${daysPerWorker}`, val: `${totalWork} ${locale === 'en' ? 'man-days' : 'μεροκάματα'}` },
          { item: locale === 'en' ? 'New crew size' : 'Νέα ομάδα εργατών', formula: `${w2}`, val: `${w2}` },
          { item: locale === 'en' ? 'Required days' : 'Απαιτούμενες ημέρες', formula: `${totalWork} : ${w2}`, val: `${formatNum(cleanD2, 1, locale)} ${dayUnit}` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `Workers and days are inversely proportional (constant product). Total man-days: ${w1} · ${daysPerWorker} ＝ ${totalWork}. For ${w2} workers: ${totalWork} : ${w2} ＝ ${formatNum(cleanD2, 1, locale)} days.`
                : `Οι εργάτες και οι ημέρες είναι αντιστρόφως ανάλογα ποσά (σταθερό γινόμενο). Συνολικά μεροκάματα: ${w1} · ${daysPerWorker} ＝ ${totalWork}. Για ${w2} εργάτες οι ημέρες είναι: ${totalWork} : ${w2} ＝ ${formatNum(cleanD2, 1, locale)} ημέρες.`}
            </span>
          </span>
        ),
        distractors: [
          `${formatNum(cleanD2 + 2, 1, locale)} ${dayUnit}`,
          `${formatNum(Math.max(1, cleanD2 - 2), 1, locale)} ${dayUnit}`,
          `${formatNum(cleanD2 + 4, 1, locale)} ${dayUnit}`
        ]
      };
    }
  },
  {
    id: 'antistr_std_2',
    generate: (locale) => {
      const speed1 = randInt(6, 8) * 10;
      const time1 = randInt(3, 5);
      const totalDist = speed1 * time1;
      const speed2 = speed1 + 20;
      const time2 = totalDist / speed2;
      const cleanTime2 = Number.isInteger(time2) ? time2 : Number(time2.toFixed(1));
      const hourUnit = locale === 'en' ? 'hours' : 'ώρες';
      return {
        title: locale === 'en' ? 'Speed and Travel Time' : 'Ταχύτητα και Χρόνος Διαδρομής',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `A car covered a distance in ${time1} hours driving at a constant speed of ${speed1} km/h. In how many hours would it cover the same distance at ${speed2} km/h?`
              : `Ένα αυτοκίνητο κάλυψε μια διαδρομή σε ${time1} ώρες κινούμενο με σταθερή ταχύτητα ${speed1} km/h. Σε πόσες ώρες θα κάλυπτε την ίδια απόσταση αν κινούνταν με ταχύτητα ${speed2} km/h;`}
          </span>
        ),
        unit: hourUnit,
        correctVal: formatNum(cleanTime2, 1, locale),
        correctText: `${formatNum(cleanTime2, 1, locale)} ${hourUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Constant distance (product)' : 'Σταθερή απόσταση (γινόμενο)', formula: `${speed1} · ${time1}`, val: `${totalDist} km` },
          { item: locale === 'en' ? 'New speed' : 'Νέα ταχύτητα', formula: `${speed2} km/h`, val: `${speed2} km/h` },
          { item: locale === 'en' ? 'New travel time' : 'Νέος χρόνος', formula: `${totalDist} : ${speed2}`, val: `${formatNum(cleanTime2, 1, locale)} h` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `Speed and time are inversely proportional (constant distance). Distance: ${speed1} · ${time1} ＝ ${totalDist} km. New time: ${totalDist} : ${speed2} ＝ ${formatNum(cleanTime2, 1, locale)} hours.`
                : `Η ταχύτητα και ο χρόνος είναι αντιστρόφως ανάλογα ποσά (σταθερή απόσταση). Απόσταση: ${speed1} · ${time1} ＝ ${totalDist} km. Ο νέος χρόνος είναι: ${totalDist} : ${speed2} ＝ ${formatNum(cleanTime2, 1, locale)} ώρες.`}
            </span>
          </span>
        ),
        distractors: [
          `${formatNum(cleanTime2 + 1, 1, locale)} ${hourUnit}`,
          `${formatNum(Math.max(1, cleanTime2 - 1), 1, locale)} ${hourUnit}`,
          `${formatNum(cleanTime2 + 2, 1, locale)} ${hourUnit}`
        ]
      };
    }
  },
  {
    id: 'antistr_std_3',
    generate: (locale) => {
      const taps1 = randInt(2, 3);
      const hours1 = randInt(4, 6);
      const totalCapacity = taps1 * hours1;
      const taps2 = taps1 + randInt(2, 3);
      const hours2 = totalCapacity / taps2;
      const cleanH2 = Number.isInteger(hours2) ? hours2 : Number(hours2.toFixed(1));
      const hourUnit = locale === 'en' ? 'hours' : 'ώρες';
      return {
        title: locale === 'en' ? 'Water Taps & Pool Filling Time' : 'Βρύσες και Χρόνος Γεμίσματος Δεξαμενής',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `${taps1} identical water taps fill a pool in ${hours1} hours. In how many hours would ${taps2} identical taps fill the same pool running simultaneously?`
              : `${taps1} ίδιες βρύσες γεμίζουν μια πισίνα σε ${hours1} ώρες. Σε πόσες ώρες θα γέμιζαν την ίδια πισίνα ${taps2} ίδιες βρύσες αν άνοιγαν ταυτόχρονα;`}
          </span>
        ),
        unit: hourUnit,
        correctVal: formatNum(cleanH2, 1, locale),
        correctText: `${formatNum(cleanH2, 1, locale)} ${hourUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Constant product' : 'Σταθερό γινόμενο', formula: `${taps1} · ${hours1}`, val: `${totalCapacity}` },
          { item: locale === 'en' ? 'New tap count' : 'Νέες βρύσες', formula: `${taps2}`, val: `${taps2}` },
          { item: locale === 'en' ? 'Filling time' : 'Χρόνος γεμίσματος', formula: `${totalCapacity} : ${taps2}`, val: `${formatNum(cleanH2, 1, locale)} h` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `Taps and filling time are inversely proportional. Constant product: ${taps1} · ${hours1} ＝ ${totalCapacity}. With ${taps2} taps: ${totalCapacity} : ${taps2} ＝ ${formatNum(cleanH2, 1, locale)} hours.`
                : `Ο αριθμός των βρυσών και ο χρόνος είναι αντιστρόφως ανάλογα ποσά. Σταθερό γινόμενο: ${taps1} · ${hours1} ＝ ${totalCapacity}. Με ${taps2} βρύσες απαιτούνται: ${totalCapacity} : ${taps2} ＝ ${formatNum(cleanH2, 1, locale)} ώρες.`}
            </span>
          </span>
        ),
        distractors: [
          `${formatNum(cleanH2 + 1.5, 1, locale)} ${hourUnit}`,
          `${formatNum(Math.max(1, cleanH2 - 1), 1, locale)} ${hourUnit}`,
          `${formatNum(cleanH2 + 2.5, 1, locale)} ${hourUnit}`
        ]
      };
    }
  },
  {
    id: 'antistr_std_4',
    generate: (locale) => {
      const packCapacity = randInt(3, 6) * 50;
      const packsCount = randInt(8, 15);
      const totalGrams = packCapacity * packsCount;
      const newPackCap = packCapacity + 50;
      const newPacks = totalGrams / newPackCap;
      const cleanPacks = Number.isInteger(newPacks) ? newPacks : Number(newPacks.toFixed(1));
      const packUnit = locale === 'en' ? 'packets' : 'σακουλάκια';
      return {
        title: locale === 'en' ? 'Package Capacity & Count' : 'Χωρητικότητα και Πλήθος Συσκευασιών',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `A quantity of coffee was packaged into ${packsCount} packets of ${packCapacity} g each. How many packets of ${newPackCap} g would be needed to package the exact same quantity of coffee?`
              : `Μια ποσότητα καφέ συσκευάστηκε σε ${packsCount} σακουλάκια των ${packCapacity} g το καθένα. Πόσα σακουλάκια των ${newPackCap} g θα χρειάζονταν για να συσκευαστεί η ίδια ακριβώς ποσότητα καφέ;`}
          </span>
        ),
        unit: packUnit,
        correctVal: formatNum(cleanPacks, 1, locale),
        correctText: `${formatNum(cleanPacks, 1, locale)} ${packUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Total coffee mass (constant)' : 'Συνολική μάζα καφέ (σταθερή)', formula: `${packCapacity} · ${packsCount}`, val: `${totalGrams} g` },
          { item: locale === 'en' ? 'New packet capacity' : 'Νέα χωρητικότητα συσκευασίας', formula: `${newPackCap} g`, val: `${newPackCap} g` },
          { item: locale === 'en' ? 'New packet count' : 'Νέο πλήθος συσκευασιών', formula: `${totalGrams} : ${newPackCap}`, val: `${formatNum(cleanPacks, 1, locale)}` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `Capacity and packet count are inversely proportional. Total coffee: ${packCapacity} · ${packsCount} ＝ ${totalGrams} g. Packets needed: ${totalGrams} : ${newPackCap} ＝ ${formatNum(cleanPacks, 1, locale)} packets.`
                : `Η χωρητικότητα και το πλήθος των συσκευασιών είναι αντιστρόφως ανάλογα ποσά. Συνολικός καφές: ${packCapacity} · ${packsCount} ＝ ${totalGrams} g. Νέο πλήθος συσκευασιών: ${totalGrams} : ${newPackCap} ＝ ${formatNum(cleanPacks, 1, locale)} σακουλάκια.`}
            </span>
          </span>
        ),
        distractors: [
          `${formatNum(cleanPacks + 2, 1, locale)} ${packUnit}`,
          `${formatNum(Math.max(1, cleanPacks - 2), 1, locale)} ${packUnit}`,
          `${formatNum(cleanPacks + 4, 1, locale)} ${packUnit}`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'antistr_hard_1',
    generate: (locale) => {
      const initialWorkers = 6;
      const initialDays = 20;
      const workDoneDays = 5;
      const remainingDaysAlone = initialDays - workDoneDays;
      const remainingWork = initialWorkers * remainingDaysAlone;
      const addedWorkers = 3;
      const totalWorkersNow = initialWorkers + addedWorkers;
      const remainingDays = remainingWork / totalWorkersNow;
      const dayUnit = locale === 'en' ? 'days' : 'ημέρες';
      return {
        title: locale === 'en' ? 'Workers Problem with Reinforcement' : 'Σύνθετο Πρόβλημα Εργατών με Ενίσχυση Ομάδας',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `A crew of ${initialWorkers} workers planned to finish a project in ${initialDays} days. After working alone for ${workDoneDays} days, ${addedWorkers} additional workers joined the crew. In how many days will the remainder of the project be completed?`
              : `Μια ομάδα ${initialWorkers} εργατών ανέλαβε να ολοκληρώσει ένα έργο σε ${initialDays} ημέρες. Αφού εργάστηκαν μόνοι τους για ${workDoneDays} ημέρες, προστέθηκαν στην ομάδα άλλοι ${addedWorkers} εργάτες. Σε πόσες ημέρες θα ολοκληρωθεί το υπόλοιπο του έργου;`}
          </span>
        ),
        unit: dayUnit,
        correctVal: String(remainingDays),
        correctText: `${remainingDays} ${dayUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Remaining workload' : 'Έργο που απομένει', formula: `${initialWorkers} · (${initialDays} － ${workDoneDays})`, val: `${remainingWork} ${locale === 'en' ? 'man-days' : 'μεροκάματα'}` },
          { item: locale === 'en' ? 'Total workers now' : 'Συνολικοί εργάτες πλέον', formula: `${initialWorkers} ＋ ${addedWorkers}`, val: `${totalWorkersNow} ${locale === 'en' ? 'workers' : 'εργάτες'}` },
          { item: locale === 'en' ? 'Days to finish remainder' : 'Χρόνος ολοκλήρωσης υπολοίπου', formula: `${remainingWork} : ${totalWorkersNow}`, val: `${remainingDays} ${dayUnit}` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `Remaining work: ${initialWorkers} workers · (${initialDays} － ${workDoneDays}) days ＝ ${initialWorkers} · ${remainingDaysAlone} ＝ ${remainingWork} man-days. Now ${initialWorkers} ＋ ${addedWorkers} ＝ ${totalWorkersNow} workers are working. Remaining days: ${remainingWork} : ${totalWorkersNow} ＝ ${remainingDays} days.`
                : `Το έργο που απομένει ισοδυναμεί με: ${initialWorkers} εργάτες · (${initialDays} － ${workDoneDays}) ημέρες ＝ ${initialWorkers} · ${remainingDaysAlone} ＝ ${remainingWork} μεροκάματα. Τώρα εργάζονται ${initialWorkers} ＋ ${addedWorkers} ＝ ${totalWorkersNow} εργάτες. Οι ημέρες που απομένουν είναι: ${remainingWork} : ${totalWorkersNow} ＝ ${remainingDays} ημέρες.`}
            </span>
          </span>
        ),
        distractors: [
          `${remainingDays + 3} ${dayUnit}`,
          `${Math.max(1, remainingDays - 2)} ${dayUnit}`,
          `${remainingDays + 5} ${dayUnit}`
        ]
      };
    }
  },
  {
    id: 'antistr_hard_2',
    generate: (locale) => {
      const animals = 30;
      const days = 40;
      const daysPassed = 10;
      const remainingDaysOrig = days - daysPassed;
      const remainingFood = animals * remainingDaysOrig;
      const animalsSold = 10;
      const animalsLeft = animals - animalsSold;
      const extraDays = remainingFood / animalsLeft;
      const dayUnit = locale === 'en' ? 'days' : 'ημέρες';
      return {
        title: locale === 'en' ? 'Fodder Reserve with Population Change' : 'Απόθεμα Ζωοτροφών με Μεταβολή Πληθυσμού',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `In a barn there is enough fodder for ${animals} animals to last ${days} days. After ${daysPassed} days, 10 animals are sold. For how many more days will the remaining fodder last for the remaining animals?`
              : `Σε έναν στάβλο υπάρχουν ζωοτροφές που επαρκούν για ${animals} ζώα για ${days} ημέρες. Μετά από ${daysPassed} ημέρες, πωλούνται 10 ζώα. Για πόσες ημέρες ακόμα θα επαρκέσουν οι υπόλοιπες ζωοτροφές για τα ζώα που έμειναν;`}
          </span>
        ),
        unit: dayUnit,
        correctVal: String(extraDays),
        correctText: `${extraDays} ${dayUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Remaining food (portions)' : 'Υπόλοιπο τροφών (σε μερίδες)', formula: `${animals} · (${days} － ${daysPassed})`, val: `${remainingFood} ${locale === 'en' ? 'portions' : 'μερίδες'}` },
          { item: locale === 'en' ? 'Remaining animals' : 'Εναπομείναντα ζώα', formula: `${animals} － 10`, val: `${animalsLeft} ${locale === 'en' ? 'animals' : 'ζώα'}` },
          { item: locale === 'en' ? 'Extended duration' : 'Διάρκεια υπολοίπου τροφών', formula: `${remainingFood} : ${animalsLeft}`, val: `${extraDays} ${dayUnit}` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `Remaining fodder serves ${animals} animals for ${remainingDaysOrig} days, meaning ${animals} · ${remainingDaysOrig} ＝ ${remainingFood} daily portions. Remaining animals: ${animalsLeft}. Days it will last: ${remainingFood} : ${animalsLeft} ＝ ${extraDays} days.`
                : `Οι ζωοτροφές που απέμειναν επαρκούν για ${animals} ζώα για ${remainingDaysOrig} ημέρες, δηλαδή ${animals} · ${remainingDaysOrig} ＝ ${remainingFood} ημερήσιες μερίδες. Τα ζώα που έμειναν είναι ${animalsLeft}. Οι ημέρες που θα διαρκέσουν είναι: ${remainingFood} : ${animalsLeft} ＝ ${extraDays} ημέρες.`}
            </span>
          </span>
        ),
        distractors: [
          `${extraDays + 5} ${dayUnit}`,
          `${Math.max(1, extraDays - 5)} ${dayUnit}`,
          `${extraDays + 10} ${dayUnit}`
        ]
      };
    }
  },
  {
    id: 'antistr_hard_3',
    generate: (locale) => {
      const length1 = 18;
      const width1 = 12;
      const area = length1 * width1;
      const length2 = 24;
      const width2 = area / length2;
      return {
        title: locale === 'en' ? 'Rectangle with Constant Area' : 'Ορθογώνιο με Σταθερό Εμβαδόν',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `In a rectangular plot of constant area, length and width are inversely proportional. If a length of ${length1} m gives a width of ${width1} m, what will the width be in m if length becomes ${length2} m?`
              : `Σε ένα ορθογώνιο οικόπεδο με σταθερό εμβαδόν, το μήκος και το πλάτος είναι αντιστρόφως ανάλογα ποσά. Αν με μήκος ${length1} m το πλάτος είναι ${width1} m, ποιο θα είναι το πλάτος σε m αν το μήκος γίνει ${length2} m;`}
          </span>
        ),
        unit: 'm',
        correctVal: String(width2),
        correctText: `${width2} m`,
        tableData: [
          { item: locale === 'en' ? 'Constant area (product)' : 'Σταθερό εμβαδόν (γινόμενο)', formula: `${length1} · ${width1}`, val: `${area} m²` },
          { item: locale === 'en' ? 'New length' : 'Νέο μήκος', formula: `${length2} m`, val: `${length2} m` },
          { item: locale === 'en' ? 'New width' : 'Νέο πλάτος', formula: `${area} : ${length2}`, val: `${width2} m` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `Area remains constant: Area ＝ length · width ＝ ${length1} · ${width1} ＝ ${area} m². With new length ${length2} m, width is: ${area} : ${length2} ＝ ${width2} m.`
                : `Το εμβαδόν παραμένει σταθερό: Ε ＝ μήκος · πλάτος ＝ ${length1} · ${width1} ＝ ${area} m². Με νέο μήκος ${length2} m, το πλάτος είναι: ${area} : ${length2} ＝ ${width2} m.`}
            </span>
          </span>
        ),
        distractors: [
          `${width2 + 2} m`,
          `${Math.max(1, width2 - 2)} m`,
          `${width2 + 4} m`
        ]
      };
    }
  },
  {
    id: 'antistr_hard_4',
    generate: (locale) => {
      const hoursPerDay1 = 8;
      const days1 = 15;
      const totalHours = hoursPerDay1 * days1;
      const days2 = 12;
      const reqHoursPerDay = totalHours / days2;
      const unitLabel = locale === 'en' ? 'hours/day' : 'ώρες/ημέρα';
      return {
        title: locale === 'en' ? 'Daily Working Hours & Delivery Time' : 'Ημερήσιο Ωράριο και Διάρκεια Παράδοσης',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `A project requires ${days1} working days if craftsmen work ${hoursPerDay1} hours per day. How many hours per day must they work to deliver the same project in ${days2} days?`
              : `Ένα έργο απαιτεί ${days1} ημέρες εργασίας αν οι τεχνίτες δουλεύουν ${hoursPerDay1} ώρες την ημέρα. Πόσες ώρες την ημέρα πρέπει να εργάζονται για να παραδώσουν το ίδιο έργο σε ${days2} ημέρες;`}
          </span>
        ),
        unit: unitLabel,
        correctVal: String(reqHoursPerDay),
        correctText: `${reqHoursPerDay} ${unitLabel}`,
        tableData: [
          { item: locale === 'en' ? 'Total required hours' : 'Συνολικός απαιτούμενος χρόνος', formula: `${hoursPerDay1} · ${days1}`, val: `${totalHours} ${locale === 'en' ? 'hours' : 'ώρες'}` },
          { item: locale === 'en' ? 'New deadline' : 'Νέα προθεσμία', formula: `${days2} ${locale === 'en' ? 'days' : 'ημέρες'}`, val: `${days2} d` },
          { item: locale === 'en' ? 'Daily hours needed' : 'Ημερήσιες ώρες εργασίας', formula: `${totalHours} : ${days2}`, val: `${reqHoursPerDay} h/day` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
            <span>
              {locale === 'en'
                ? `Daily hours and days are inversely proportional. Total project hours: ${hoursPerDay1} · ${days1} ＝ ${totalHours} hours. To finish in ${days2} days: ${totalHours} : ${days2} ＝ ${reqHoursPerDay} hours per day.`
                : `Οι ημερήσιες ώρες και οι ημέρες είναι αντιστρόφως ανάλογα ποσά. Συνολικές ώρες έργου: ${hoursPerDay1} · ${days1} ＝ ${totalHours} ώρες. Για να τελειώσει σε ${days2} ημέρες απαιτούνται: ${totalHours} : ${days2} ＝ ${reqHoursPerDay} ώρες την ημέρα.`}
            </span>
          </span>
        ),
        distractors: [
          `${reqHoursPerDay + 2} ${unitLabel}`,
          `${Math.max(1, reqHoursPerDay - 1)} ${unitLabel}`,
          `${reqHoursPerDay + 3} ${unitLabel}`
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  // Q1: Input - Εύρεση σταθερού γινομένου (α)
  const q1X = randInt(3, 6);
  const q1Y = randInt(8, 15);
  const q1Alpha = q1X * q1Y;

  // Q2: MCQ - Έλεγχος πίνακα τιμών (4 μοναδικές επιλογές)
  const q2IsAntistr = Math.random() > 0.4;
  const q2YVals = q2IsAntistr ? [18, 12, 6] : [18, 12, 8];
  const prod1 = 2 * q2YVals[0];
  const prod2 = 3 * q2YVals[1];
  const prod3 = 6 * q2YVals[2];

  const q2CorrectAns = q2IsAntistr
    ? (locale === 'en'
        ? `Yes, because all products x · y equal ${prod1}`
        : `Ναι, γιατί όλα τα γινόμενα x · y είναι ίσα με ${prod1}`)
    : (locale === 'en'
        ? 'No, because the products x · y do not remain constant'
        : 'Όχι, γιατί τα γινόμενα x · y δεν παραμένουν σταθερά');

  const q2WrongCandidates = q2IsAntistr
    ? (locale === 'en'
        ? [
            'No, because y decreases while x increases',
            'No, because the quotients y : x are not equal',
            'Yes, but only because all numbers are even'
          ]
        : [
            'Όχι, γιατί το y μειώνεται ενώ το x αυξάνεται',
            'Όχι, γιατί τα πηλίκα y : x δεν είναι ίσα',
            'Ναι, αλλά μόνο επειδή όλοι οι αριθμοί είναι άρτιοι'
          ])
    : (locale === 'en'
        ? [
            'Yes, because as x increases, y decreases',
            'Yes, because the first product matches the last',
            'No, because division by zero occurs'
          ]
        : [
            'Ναι, γιατί όσο το x μεγαλώνει, το y μικραίνει',
            'Ναι, γιατί το πρώτο γινόμενο είναι ίσο με το τελευταίο',
            'Όχι, γιατί προκύπτει διαίρεση με το μηδέν'
          ]);

  const q2Options = makeUniqueOptions(q2CorrectAns, q2WrongCandidates);

  // Q3: Input - Υπολογισμός τιμής y από το σταθερό γινόμενο
  const q3X1 = randInt(2, 4);
  const q3Y1 = randInt(12, 20);
  const q3Alpha = q3X1 * q3Y1;
  const q3X2 = q3X1 * 2;
  const q3Y2 = q3Alpha / q3X2;

  // Q4: MCQ - Γραφική παράσταση υπερβολής (4 μοναδικές επιλογές)
  const q4CorrectShape = locale === 'en'
    ? 'A curved line called a hyperbola that never passes through (0, 0)'
    : 'Καμπύλη γραμμή που ονομάζεται υπερβολή και δεν περνάει από το (0, 0)';
  const q4WrongCandidates = locale === 'en'
    ? [
        'A straight line passing through the origin (0, 0)',
        'A circular curve centered at the origin',
        'A horizontal straight line parallel to the x-axis'
      ]
    : [
        'Ευθεία γραμμή που διέρχεται από την αρχή των αξόνων (0, 0)',
        'Κυκλική γραμμή γύρω από το κέντρο των αξόνων',
        'Ευθεία γραμμή παράλληλη προς τον οριζόντιο άξονα'
      ];
  const q4Options = makeUniqueOptions(q4CorrectShape, q4WrongCandidates);

  // Q5: Input - Εύρεση του x όταν δίνεται το y
  const q5Alpha = 72;
  const q5YVal = [6, 8, 9, 12][randInt(0, 3)];
  const q5ExpectedX = q5Alpha / q5YVal;

  // Q6: MCQ - Ανάλογα vs Αντιστρόφως Ανάλογα (4 μοναδικές επιλογές)
  const q6CorrectStatement = locale === 'en'
    ? 'In directly proportional quantities the quotient (y : x) is constant, while in inversely proportional quantities the product (x · y) is constant'
    : 'Στα ανάλογα ποσά είναι σταθερό το πηλίκο (y : x), ενώ στα αντιστρόφως ανάλογα είναι σταθερό το γινόμενο (x · y)';
  const q6WrongCandidates = locale === 'en'
    ? [
        'In both types of quantities the sum of their values remains constant',
        'In directly proportional quantities product is constant, and in inversely proportional quotient is constant',
        'In both types of quantities the graph is always a straight line'
      ]
    : [
        'Και στα δύο είδη ποσών είναι σταθερό το άθροισμα των τιμών τους',
        'Στα ανάλογα ποσά είναι σταθερό το γινόμενο και στα αντιστρόφως ανάλογα το πηλίκο',
        'Και στα δύο είδη ποσών η γραφική παράσταση είναι ευθεία γραμμή'
      ];
  const q6Options = makeUniqueOptions(q6CorrectStatement, q6WrongCandidates);

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
      title: locale === 'en' ? 'Constant Product' : 'Σταθερό Γινόμενο',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `In two inversely proportional quantities x and y, when x ＝ ${q1X}, y equals ${q1Y}. What is the constant product k (k ＝ x · y)?`
            : `Σε δύο αντιστρόφως ανάλογα ποσά x και y, όταν x ＝ ${q1X}, το y ισούται με ${q1Y}. Ποιο είναι το σταθερό γινόμενο α των δύο ποσών (α ＝ x · y);`}
        </span>
      ),
      correct: String(q1Alpha),
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `In inversely proportional quantities the product is always constant: k ＝ x · y ＝ ${q1X} · ${q1Y} ＝ ${q1Alpha}.`
            : `Στα αντιστρόφως ανάλογα ποσά το γινόμενο των αντίστοιχων τιμών είναι πάντοτε σταθερό: α ＝ x · y ＝ ${q1X} · ${q1Y} ＝ ${q1Alpha}.`}
        </span>
      )
    },
    {
      id: 'q2',
      type: 'mcq',
      title: locale === 'en' ? 'Checking Value Table' : 'Έλεγχος Πίνακα Τιμών',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `Are quantities x and y inversely proportional when for x ＝ [2, 3, 6] the corresponding y values are [${q2YVals[0]}, ${q2YVals[1]}, ${q2YVals[2]}]?`
            : `Είναι τα ποσά x και y αντιστρόφως ανάλογα όταν για x ＝ [2, 3, 6] οι αντίστοιχες τιμές y είναι [${q2YVals[0]}, ${q2YVals[1]}, ${q2YVals[2]}];`}
        </span>
      ),
      options: q2Options,
      correct: q2CorrectAns,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          2 · {q2YVals[0]} ＝ {prod1}, 3 · {q2YVals[1]} ＝ {prod2}, 6 · {q2YVals[2]} ＝ {prod3}. {q2CorrectAns}.
        </span>
      )
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: locale === 'en' ? 'Completing Inverse Quantity' : 'Συμπλήρωση Αντιστρόφου Ποσού',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `Two quantities x and y are inversely proportional with constant product k ＝ ${q3Alpha}. If x ＝ ${q3X2}, what is the corresponding value of y?`
            : `Δύο ποσά x και y είναι αντιστρόφως ανάλογα με σταθερό γινόμενο α ＝ ${q3Alpha}. Αν η τιμή του x είναι ${q3X2}, ποια είναι η αντίστοιχη τιμή του y;`}
        </span>
      ),
      correct: formatNum(q3Y2, 1, locale),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          <span>y ＝ α : x ＝ {q3Alpha} : {q3X2} ＝ {formatNum(q3Y2, 1, locale)}.</span>
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Graphical Representation' : 'Γραφική Παράσταση',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'What is the shape of the graph of inversely proportional quantities on a coordinate plane?'
            : 'Ποια είναι η μορφή της γραφικής παράστασης δύο αντιστρόφως ανάλογων ποσών σε σύστημα αξόνων;'}
        </span>
      ),
      options: q4Options,
      correct: q4CorrectShape,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'The graph of inversely proportional quantities is a curve called a hyperbola. It never passes through (0, 0) and never touches either axis.'
            : 'Η γραφική παράσταση των αντιστρόφως ανάλογων ποσών είναι καμπύλη γραμμή που ονομάζεται υπερβολή. Δεν περνάει ποτέ από το σημείο (0, 0) και δεν ακουμπάει ποτέ τους άξονες.'}
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
            ? `In inversely proportional quantities, constant product is k ＝ ${q5Alpha}. If y ＝ ${q5YVal}, what is the value of x?`
            : `Σε δύο αντιστρόφως ανάλογα ποσά το σταθερό γινόμενο είναι α ＝ ${q5Alpha}. Αν y ＝ ${q5YVal}, ποια είναι η τιμή του x;`}
        </span>
      ),
      correct: String(q5ExpectedX),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1 break-words [overflow-wrap:anywhere]">
          <span>x ＝ α : y ＝ {q5Alpha} : {q5YVal} ＝ {q5ExpectedX}.</span>
        </span>
      )
    },
    {
      id: 'q6',
      type: 'mcq',
      title: locale === 'en' ? 'Direct vs. Inverse Proportion' : 'Ανάλογα vs Αντιστρόφως Ανάλογα',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'What is the fundamental difference between directly and inversely proportional quantities?'
            : 'Ποια είναι η θεμελιώδης διαφορά μεταξύ ανάλογων και αντιστρόφως ανάλογων ποσών;'}
        </span>
      ),
      options: q6Options,
      correct: q6CorrectStatement,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'In directly proportional quantities the ratio is constant (y : x ＝ λ), while in inversely proportional quantities the product is constant (x · y ＝ k).'
            : 'Στα ανάλογα ποσά παραμένει σταθερό το πηλίκο των τιμών τους (y : x ＝ λ), ενώ στα αντιστρόφως ανάλογα παραμένει σταθερό το γινόμενο των τιμών τους (x · y ＝ α).'}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'decimal',
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

export default function AntistrofosAnalogaExercisesPage() {
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
          href="/st-dimotikou/46-antistrofos-analoga-posa"
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
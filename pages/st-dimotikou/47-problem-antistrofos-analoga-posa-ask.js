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

// Component κατακόρυφου κλάσματος (πλήρως responsive χωρίς οριζόντιο overflow)
function Fraction({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="pt-0.5 px-0.5 sm:px-1 break-all">
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

// Εγγύηση 4 μοναδικών επιλογών για ερωτήσεις MCQ
function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set([correct]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && String(opt).trim() !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  return shuffle(Array.from(unique));
}

// ---------------------------------------------------------
// ΛΕΞΙΚΟ i18n
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Λύση Προβλημάτων με Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην επίλυση προβλημάτων με αντιστρόφως ανάλογα ποσά και οριζόντια γινόμενα για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 47 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Προβλήματα με Αντιστρόφως Ανάλογα Ποσά",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην αναγωγή στη μονάδα στα αντιστρόφως ανάλογα ποσά, στα οριζόντια γινόμενα και στην αποφυγή της παγίδας του χιαστί!",
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
    pageTitle: "Exercises: Solving Inversely Proportional Problems - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on solving inversely proportional word problems and horizontal products for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 47 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Inversely Proportional Word Problems",
    desc: "Solve the 10 dynamic problems to practice unit rate reduction, horizontal products, and avoiding the cross-multiplication trap!",
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
    id: 'p_antistr_std_1',
    generate: (locale) => {
      const workers1 = randInt(2, 4);
      const days1 = randInt(6, 12);
      const totalWork = workers1 * days1;
      const workers2 = workers1 + randInt(2, 4);
      const days2 = totalWork / workers2;
      const cleanDays2 = Number.isInteger(days2) ? days2 : Number(days2.toFixed(1));
      const dayUnit = locale === 'en' ? 'days' : 'ημέρες';
      const formattedAns = formatNum(cleanDays2, 1, locale);
      return {
        title: locale === 'en' ? 'Order Assembly' : 'Συναρμολόγηση Παραγγελίας',
        prompt: (
          <span>
            {locale === 'en'
              ? `In a workshop, ${workers1} technicians assemble an order in ${days1} days. In how many days would ${workers2} technicians assemble the same order working at the same rate?`
              : `Σε ένα συνεργείο ${workers1} τεχνικοί συναρμολογούν μια παραγγελία σε ${days1} ημέρες. Σε πόσες ημέρες θα συναρμολογούσαν την ίδια παραγγελία ${workers2} τεχνικοί με τον ίδιο ρυθμό εργασίας;`}
          </span>
        ),
        unit: dayUnit,
        correctVal: formattedAns,
        correctText: `${formattedAns} ${dayUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Initial workload' : 'Αρχικός όγκος εργασίας',
            formula: `${workers1} · ${days1}`,
            val: `${totalWork} ${locale === 'en' ? 'man-days' : 'μεροκάματα'}`
          },
          {
            item: locale === 'en' ? 'New technician count' : 'Νέος αριθμός τεχνικών',
            formula: `${workers2}`,
            val: `${workers2}`
          },
          {
            item: locale === 'en' ? 'Required days' : 'Απαιτούμενες ημέρες',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={totalWork} den={workers2} />
              </span>
            ),
            val: `${formattedAns} ${dayUnit}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Quantities are inversely proportional (constant product). Total workload: {workers1} · {days1} ＝ {totalWork} man-days. For {workers2} technicians: <Fraction num={totalWork} den={workers2} /> ＝ {formattedAns} days.
              </>
            ) : (
              <>
                Τα ποσά είναι αντιστρόφως ανάλογα (σταθερό γινόμενο). Συνολικός όγκος εργασίας: {workers1} · {days1} ＝ {totalWork} μεροκάματα. Για {workers2} τεχνικούς οι ημέρες είναι: <Fraction num={totalWork} den={workers2} /> ＝ {formattedAns} ημέρες.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(cleanDays2 + 2, 1, locale)} ${dayUnit}`,
          `${formatNum(Math.max(1, cleanDays2 - 2), 1, locale)} ${dayUnit}`,
          `${formatNum(cleanDays2 + 4, 1, locale)} ${dayUnit}`,
          `${formatNum(cleanDays2 + 1, 1, locale)} ${dayUnit}`
        ]
      };
    }
  },
  {
    id: 'p_antistr_std_2',
    generate: (locale) => {
      const speed1 = randInt(6, 8) * 10;
      const time1 = randInt(3, 5);
      const totalDist = speed1 * time1;
      const speed2 = speed1 + 20;
      const time2 = totalDist / speed2;
      const cleanTime2 = Number.isInteger(time2) ? time2 : Number(time2.toFixed(1));
      const hourUnit = locale === 'en' ? 'hours' : 'ώρες';
      const formattedAns = formatNum(cleanTime2, 1, locale);
      return {
        title: locale === 'en' ? 'Truck Travel Time' : 'Χρόνος Διαδρομής Φορτηγού',
        prompt: (
          <span>
            {locale === 'en'
              ? `A truck covers a route in ${time1} hours traveling at a constant speed of ${speed1} km/h. In how many hours would it cover the same distance at ${speed2} km/h?`
              : `Ένα φορτηγό καλύπτει μια διαδρομή σε ${time1} ώρες κινούμενο με σταθερή ταχύτητα ${speed1} km/h. Σε πόσες ώρες θα κάλυπτε την ίδια απόσταση αν κινούνταν με ταχύτητα ${speed2} km/h;`}
          </span>
        ),
        unit: hourUnit,
        correctVal: formattedAns,
        correctText: `${formattedAns} ${hourUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Constant distance' : 'Σταθερή απόσταση',
            formula: `${speed1} · ${time1}`,
            val: `${totalDist} km`
          },
          {
            item: locale === 'en' ? 'New speed' : 'Νέα ταχύτητα',
            formula: `${speed2} km/h`,
            val: `${speed2} km/h`
          },
          {
            item: locale === 'en' ? 'New travel time' : 'Νέος απαιτούμενος χρόνος',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={totalDist} den={speed2} />
              </span>
            ),
            val: `${formattedAns} ${hourUnit}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Speed and time have a constant product (distance): {speed1} · {time1} ＝ {totalDist} km. New time: <Fraction num={totalDist} den={speed2} /> ＝ {formattedAns} hours.
              </>
            ) : (
              <>
                Ταχύτητα και χρόνος έχουν σταθερό γινόμενο (απόσταση): {speed1} · {time1} ＝ {totalDist} km. Ο νέος χρόνος είναι: <Fraction num={totalDist} den={speed2} /> ＝ {formattedAns} ώρες.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(cleanTime2 + 1, 1, locale)} ${hourUnit}`,
          `${formatNum(Math.max(1, cleanTime2 - 1), 1, locale)} ${hourUnit}`,
          `${formatNum(cleanTime2 + 2, 1, locale)} ${hourUnit}`,
          `${formatNum(cleanTime2 + 0.5, 1, locale)} ${hourUnit}`
        ]
      };
    }
  },
  {
    id: 'p_antistr_std_3',
    generate: (locale) => {
      const taps1 = randInt(2, 3);
      const hours1 = randInt(4, 6);
      const totalCapacity = taps1 * hours1;
      const taps2 = taps1 + randInt(2, 3);
      const hours2 = totalCapacity / taps2;
      const cleanH2 = Number.isInteger(hours2) ? hours2 : Number(hours2.toFixed(1));
      const hourUnit = locale === 'en' ? 'hours' : 'ώρες';
      const formattedAns = formatNum(cleanH2, 1, locale);
      return {
        title: locale === 'en' ? 'Draining Reservoir with Pumps' : 'Άδειασμα Δεξαμενής με Αντλίες',
        prompt: (
          <span>
            {locale === 'en'
              ? `${taps1} identical pumps drain a reservoir in ${hours1} hours. In how many hours would ${taps2} identical pumps drain the same reservoir working together?`
              : `${taps1} ίδιες αντλίες αδειάζουν μια δεξαμενή σε ${hours1} ώρες. Σε πόσες ώρες θα άδειαζαν την ίδια δεξαμενή ${taps2} ίδιες αντλίες αν λειτουργούσαν ταυτόχρονα;`}
          </span>
        ),
        unit: hourUnit,
        correctVal: formattedAns,
        correctText: `${formattedAns} ${hourUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Constant product' : 'Σταθερό γινόμενο',
            formula: `${taps1} · ${hours1}`,
            val: `${totalCapacity}`
          },
          {
            item: locale === 'en' ? 'New pump count' : 'Νέες αντλίες',
            formula: `${taps2}`,
            val: `${taps2}`
          },
          {
            item: locale === 'en' ? 'Drainage time' : 'Χρόνος εκκένωσης',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={totalCapacity} den={taps2} />
              </span>
            ),
            val: `${formattedAns} ${hourUnit}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Pumps and time are inversely proportional. Constant product: {taps1} · {hours1} ＝ {totalCapacity}. With {taps2} pumps: <Fraction num={totalCapacity} den={taps2} /> ＝ {formattedAns} hours.
              </>
            ) : (
              <>
                Οι αντλίες και ο χρόνος είναι αντιστρόφως ανάλογα ποσά. Σταθερό γινόμενο: {taps1} · {hours1} ＝ {totalCapacity}. Με {taps2} αντλίες απαιτούνται: <Fraction num={totalCapacity} den={taps2} /> ＝ {formattedAns} ώρες.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(cleanH2 + 1.5, 1, locale)} ${hourUnit}`,
          `${formatNum(Math.max(1, cleanH2 - 1), 1, locale)} ${hourUnit}`,
          `${formatNum(cleanH2 + 2.5, 1, locale)} ${hourUnit}`,
          `${formatNum(cleanH2 + 0.5, 1, locale)} ${hourUnit}`
        ]
      };
    }
  },
  {
    id: 'p_antistr_std_4',
    generate: (locale) => {
      const packCapacity = randInt(3, 6) * 50;
      const packsCount = randInt(8, 14);
      const totalGrams = packCapacity * packsCount;
      const newPackCap = packCapacity + 50;
      const newPacks = totalGrams / newPackCap;
      const cleanPacks = Number.isInteger(newPacks) ? newPacks : Number(newPacks.toFixed(1));
      const boxUnit = locale === 'en' ? 'boxes' : 'κουτιά';
      const formattedAns = formatNum(cleanPacks, 1, locale);
      return {
        title: locale === 'en' ? 'Packaging Tea in Boxes' : 'Συσκευασία Τσαγιού σε Κουτιά',
        prompt: (
          <span>
            {locale === 'en'
              ? `A quantity of tea was packaged into ${packsCount} boxes of ${packCapacity} g each. How many boxes of ${newPackCap} g would be needed to package the exact same quantity?`
              : `Μια ποσότητα τσαγιού συσκευάστηκε σε ${packsCount} κουτιά των ${packCapacity} g το καθένα. Πόσα κουτιά των ${newPackCap} g θα χρειάζονταν για να συσκευαστεί η ίδια ακριβώς ποσότητα;`}
          </span>
        ),
        unit: boxUnit,
        correctVal: formattedAns,
        correctText: `${formattedAns} ${boxUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Total mass (constant)' : 'Συνολική μάζα (σταθερή)',
            formula: `${packCapacity} · ${packsCount}`,
            val: `${totalGrams} g`
          },
          {
            item: locale === 'en' ? 'New box capacity' : 'Νέα χωρητικότητα κουτιού',
            formula: `${newPackCap} g`,
            val: `${newPackCap} g`
          },
          {
            item: locale === 'en' ? 'New box count' : 'Νέο πλήθος κουτιών',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={totalGrams} den={newPackCap} />
              </span>
            ),
            val: `${formattedAns}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Capacity and box count are inversely proportional. Total mass: {packCapacity} · {packsCount} ＝ {totalGrams} g. New count: <Fraction num={totalGrams} den={newPackCap} /> ＝ {formattedAns} boxes.
              </>
            ) : (
              <>
                Η χωρητικότητα και το πλήθος κουτιών είναι αντιστρόφως ανάλογα ποσά. Συνολική μάζα: {packCapacity} · {packsCount} ＝ {totalGrams} g. Νέο πλήθος: <Fraction num={totalGrams} den={newPackCap} /> ＝ {formattedAns} κουτιά.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(cleanPacks + 2, 1, locale)} ${boxUnit}`,
          `${formatNum(Math.max(1, cleanPacks - 2), 1, locale)} ${boxUnit}`,
          `${formatNum(cleanPacks + 4, 1, locale)} ${boxUnit}`,
          `${formatNum(cleanPacks + 1, 1, locale)} ${boxUnit}`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_antistr_hard_1',
    generate: (locale) => {
      const initWorkers = 8;
      const initDays = 15;
      const doneDays = 3;
      const remDaysAlone = initDays - doneDays;
      const remWork = initWorkers * remDaysAlone;
      const addedWorkers = 4;
      const totalWorkers = initWorkers + addedWorkers;
      const remDays = remWork / totalWorkers;
      const dayUnit = locale === 'en' ? 'days' : 'ημέρες';
      const formattedAns = String(remDays);
      return {
        title: locale === 'en' ? 'Project Completion with Extra Workers' : 'Ολοκλήρωση Έργου με Επιπλέον Εργάτες',
        prompt: (
          <span>
            {locale === 'en'
              ? `A crew of ${initWorkers} workers scheduled to finish a project in ${initDays} days. After working alone for ${doneDays} days, ${addedWorkers} additional workers joined. In how many days will the remaining project be completed?`
              : `Μια ομάδα ${initWorkers} εργατών είχε προγραμματίσει να τελειώσει ένα έργο σε ${initDays} ημέρες. Αφού εργάστηκαν μόνοι τους για ${doneDays} ημέρες, προστέθηκαν στην ομάδα άλλοι ${addedWorkers} εργάτες. Σε πόσες ημέρες θα ολοκληρωθεί το υπόλοιπο έργο;`}
          </span>
        ),
        unit: dayUnit,
        correctVal: formattedAns,
        correctText: `${formattedAns} ${dayUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Remaining workload' : 'Έργο που απομένει',
            formula: `${initWorkers} · (${initDays} － ${doneDays})`,
            val: `${remWork} ${locale === 'en' ? 'man-days' : 'μεροκάματα'}`
          },
          {
            item: locale === 'en' ? 'Total workers' : 'Συνολικοί εργάτες',
            formula: `${initWorkers} ＋ ${addedWorkers}`,
            val: `${totalWorkers} ${locale === 'en' ? 'workers' : 'εργάτες'}`
          },
          {
            item: locale === 'en' ? 'Time for remainder' : 'Χρόνος για το υπόλοιπο',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={remWork} den={totalWorkers} />
              </span>
            ),
            val: `${formattedAns} ${dayUnit}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Remaining work: {initWorkers} workers · ({initDays} － {doneDays}) days ＝ {initWorkers} · {remDaysAlone} ＝ {remWork} man-days. Now {initWorkers} ＋ {addedWorkers} ＝ {totalWorkers} workers are active. Completion time: <Fraction num={remWork} den={totalWorkers} /> ＝ {formattedAns} days.
              </>
            ) : (
              <>
                Το έργο που απομένει ισοδυναμεί με {initWorkers} εργάτες · ({initDays} － {doneDays}) ημέρες ＝ {initWorkers} · {remDaysAlone} ＝ {remWork} μεροκάματα. Τώρα εργάζονται {initWorkers} ＋ {addedWorkers} ＝ {totalWorkers} εργάτες. Το υπόλοιπο έργο θα τελειώσει σε: <Fraction num={remWork} den={totalWorkers} /> ＝ {formattedAns} ημέρες.
              </>
            )}
          </span>
        ),
        distractors: [
          `${remDays + 3} ${dayUnit}`,
          `${Math.max(1, remDays - 2)} ${dayUnit}`,
          `${remDays + 5} ${dayUnit}`,
          `${remDays + 1} ${dayUnit}`
        ]
      };
    }
  },
  {
    id: 'p_antistr_hard_2',
    generate: (locale) => {
      const animals = 40;
      const days = 30;
      const daysPassed = 6;
      const remDaysOrig = days - daysPassed;
      const remFood = animals * remDaysOrig;
      const animalsSold = 16;
      const remAnimals = animals - animalsSold;
      const extraDays = remFood / remAnimals;
      const dayUnit = locale === 'en' ? 'days' : 'ημέρες';
      const formattedAns = String(extraDays);
      return {
        title: locale === 'en' ? 'Fodder Duration after Animal Sale' : 'Διάρκεια Ζωοτροφών μετά από Πώληση Ζώων',
        prompt: (
          <span>
            {locale === 'en'
              ? `On a farm there is fodder for ${animals} cows for ${days} days. After ${daysPassed} days, ${animalsSold} cows are sold. For how many more days will the remaining fodder last for the remaining cows?`
              : `Σε ένα αγρόκτημα υπάρχουν ζωοτροφές για ${animals} αγελάδες για ${days} ημέρες. Μετά από ${daysPassed} ημέρες, πωλούνται ${animalsSold} αγελάδες. Για πόσες ημέρες ακόμα θα διαρκέσουν οι ζωοτροφές για τις αγελάδες που απέμειναν;`}
          </span>
        ),
        unit: dayUnit,
        correctVal: formattedAns,
        correctText: `${formattedAns} ${dayUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Remaining fodder' : 'Υπόλοιπο τροφών',
            formula: `${animals} · (${days} － ${daysPassed})`,
            val: `${remFood} ${locale === 'en' ? 'portions' : 'μερίδες'}`
          },
          {
            item: locale === 'en' ? 'Remaining animals' : 'Ζώα που έμειναν',
            formula: `${animals} － ${animalsSold}`,
            val: `${remAnimals} ${locale === 'en' ? 'cows' : 'αγελάδες'}`
          },
          {
            item: locale === 'en' ? 'Duration of remainder' : 'Διάρκεια υπολοίπου',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={remFood} den={remAnimals} />
              </span>
            ),
            val: `${formattedAns} ${dayUnit}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Remaining fodder suffices for {animals} cows for {remDaysOrig} days, meaning {animals} · {remDaysOrig} ＝ {remFood} portions. Remaining cows: {remAnimals}. Duration: <Fraction num={remFood} den={remAnimals} /> ＝ {formattedAns} days.
              </>
            ) : (
              <>
                Οι ζωοτροφές που απομένουν επαρκούν για {animals} ζώα για {remDaysOrig} ημέρες, δηλαδή {animals} · {remDaysOrig} ＝ {remFood} ημερήσιες μερίδες. Οι εναπομείνασες αγελάδες είναι {remAnimals}. Θα διαρκέσουν για: <Fraction num={remFood} den={remAnimals} /> ＝ {formattedAns} ημέρες.
              </>
            )}
          </span>
        ),
        distractors: [
          `${extraDays + 5} ${dayUnit}`,
          `${Math.max(1, extraDays - 5)} ${dayUnit}`,
          `${extraDays + 10} ${dayUnit}`,
          `${extraDays + 2} ${dayUnit}`
        ]
      };
    }
  },
  {
    id: 'p_antistr_hard_3',
    generate: (locale) => {
      const length1 = 20;
      const width1 = 15;
      const area = length1 * width1;
      const length2 = 25;
      const width2 = area / length2;
      const formattedAns = String(width2);
      return {
        title: locale === 'en' ? 'Rectangular Floor of Constant Area' : 'Ορθογώνιο Δάπεδο Σταθερού Εμβαδού',
        prompt: (
          <span>
            {locale === 'en'
              ? `A rectangular floor of constant area has length ${length1} m and width ${width1} m. If we want another rectangular floor of the exact same area but length ${length2} m, what must its width be in m?`
              : `Ένα ορθογώνιο δάπεδο με σταθερό εμβαδόν έχει μήκος ${length1} m και πλάτος ${width1} m. Αν θέλουμε να διαμορφώσουμε ένα άλλο ορθογώνιο με το ίδιο ακριβώς εμβαδόν αλλά μήκος ${length2} m, ποιο πρέπει να είναι το πλάτος του σε m;`}
          </span>
        ),
        unit: 'm',
        correctVal: formattedAns,
        correctText: `${formattedAns} m`,
        tableData: [
          {
            item: locale === 'en' ? 'Constant area' : 'Σταθερό εμβαδόν',
            formula: `${length1} · ${width1}`,
            val: `${area} m²`
          },
          {
            item: locale === 'en' ? 'New length' : 'Νέο μήκος',
            formula: `${length2} m`,
            val: `${length2} m`
          },
          {
            item: locale === 'en' ? 'New width' : 'Νέο πλάτος',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={area} den={length2} />
              </span>
            ),
            val: `${formattedAns} m`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Length and width are inversely proportional (constant area). Area: {length1} · {width1} ＝ {area} m². New width: <Fraction num={area} den={length2} /> ＝ {formattedAns} m.
              </>
            ) : (
              <>
                Μήκος και πλάτος είναι αντιστρόφως ανάλογα ποσά (σταθερό εμβαδόν). Εμβαδόν: {length1} · {width1} ＝ {area} m². Το νέο πλάτος είναι: <Fraction num={area} den={length2} /> ＝ {formattedAns} m.
              </>
            )}
          </span>
        ),
        distractors: [
          `${width2 + 2} m`,
          `${Math.max(1, width2 - 2)} m`,
          `${width2 + 4} m`,
          `${width2 + 1} m`
        ]
      };
    }
  },
  {
    id: 'p_antistr_hard_4',
    generate: (locale) => {
      const hoursPerDay1 = 7;
      const days1 = 20;
      const totalHours = hoursPerDay1 * days1;
      const days2 = 14;
      const reqHoursPerDay = totalHours / days2;
      const unitLabel = locale === 'en' ? 'hours/day' : 'ώρες/ημέρα';
      const formattedAns = String(reqHoursPerDay);
      return {
        title: locale === 'en' ? 'Daily Work Schedule & Delivery Deadline' : 'Ημερήσιο Ωράριο και Προθεσμία Παραγγελίας',
        prompt: (
          <span>
            {locale === 'en'
              ? `A workshop completes an order in ${days1} days working ${hoursPerDay1} hours per day. How many hours per day must they work to deliver the same order in ${days2} days?`
              : `Μια βιοτεχνία εκτελεί μια παραγγελία σε ${days1} ημέρες δουλεύοντας ${hoursPerDay1} ώρες την ημέρα. Πόσες ώρες την ημέρα πρέπει να δουλεύει για να παραδώσει την ίδια παραγγελία σε ${days2} ημέρες;`}
          </span>
        ),
        unit: unitLabel,
        correctVal: formattedAns,
        correctText: `${formattedAns} ${unitLabel}`,
        tableData: [
          {
            item: locale === 'en' ? 'Total required hours' : 'Συνολικός απαιτούμενος χρόνος',
            formula: `${hoursPerDay1} · ${days1}`,
            val: `${totalHours} ${locale === 'en' ? 'hours' : 'ώρες'}`
          },
          {
            item: locale === 'en' ? 'New deadline' : 'Νέα προθεσμία',
            formula: `${days2} ${locale === 'en' ? 'days' : 'ημέρες'}`,
            val: `${days2} d`
          },
          {
            item: locale === 'en' ? 'New daily schedule' : 'Νέο ημερήσιο ωράριο',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={totalHours} den={days2} />
              </span>
            ),
            val: `${formattedAns} ${unitLabel}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Total order hours: {hoursPerDay1} · {days1} ＝ {totalHours} hours. For delivery in ${days2} days: <Fraction num={totalHours} den={days2} /> ＝ {formattedAns} hours per day.
              </>
            ) : (
              <>
                Συνολικές ώρες παραγγελίας: {hoursPerDay1} · {days1} ＝ {totalHours} ώρες. Για παράδοση σε {days2} ημέρες απαιτούνται: <Fraction num={totalHours} den={days2} /> ＝ {formattedAns} ώρες την ημέρα.
              </>
            )}
          </span>
        ),
        distractors: [
          `${reqHoursPerDay + 2} ${unitLabel}`,
          `${Math.max(1, reqHoursPerDay - 1)} ${unitLabel}`,
          `${reqHoursPerDay + 3} ${unitLabel}`,
          `${reqHoursPerDay + 1} ${unitLabel}`
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  // Q1: Input - Αναγωγή στη Μονάδα (Βήμα 1: Ο 1 εργάτης)
  const q1Workers = randInt(3, 6);
  const q1Days = randInt(4, 8);
  const q1TotalManDays = q1Workers * q1Days;

  // Q2: MCQ - Μεθοδολογία αναγωγής στη μονάδα (4 μοναδικές επιλογές)
  const q2CorrectMethod = locale === 'en'
    ? 'Multiplication, because 1 single worker will require much more time'
    : 'Πολλαπλασιασμό, επειδή ο 1 εργάτης θα χρειαστεί περισσότερο χρόνο';
  const q2WrongCandidates = [
    locale === 'en' ? 'Division, exactly as we do in directly proportional quantities' : 'Διαίρεση, ακριβώς όπως κάναμε και στα ανάλογα ποσά',
    locale === 'en' ? 'Addition of workers and days' : 'Πρόσθεση των εργατών και των ημερών',
    locale === 'en' ? 'Subtracting 1 from the worker total' : 'Αφαίρεση του 1 από το σύνολο των εργατών'
  ];
  const q2Options = makeUniqueOptions(q2CorrectMethod, q2WrongCandidates).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q3: Input - Οριζόντιος πολλαπλασιασμός πίνακα
  const q3W1 = randInt(2, 5);
  const q3D1 = randInt(10, 20);
  const q3W2 = randInt(6, 10);
  const q3Total = q3W1 * q3D1;
  const q3TargetD = q3Total / q3W2;
  const q3CleanTargetD = Number.isInteger(q3TargetD) ? q3TargetD : Number(q3TargetD.toFixed(1));

  // Q4: MCQ - Η παγίδα του χιαστί (4 μοναδικές επιλογές)
  const q4CorrectTrap = locale === 'en'
    ? 'No, because cross-multiplication applies strictly to directly proportional quantities and never to inverse proportion'
    : 'Όχι, γιατί η μέθοδος χιαστί εφαρμόζεται αποκλειστικά στα ανάλογα ποσά και όχι στα αντιστρόφως ανάλογα';
  const q4WrongCandidates = [
    locale === 'en' ? 'Yes, in all elementary math word problems we must always cross-multiply' : 'Ναι, σε όλα τα προβλήματα του Δημοτικού κάνουμε υποχρεωτικά χιαστί',
    locale === 'en' ? 'Yes, provided that all given numbers are integers' : 'Ναι, αρκεί οι αριθμοί να είναι ακέραιοι',
    locale === 'en' ? 'No, because in word problems we only use addition and subtraction' : 'Όχι, γιατί στα προβλήματα κάνουμε μόνο πρόσθεση και αφαίρεση'
  ];
  const q4Options = makeUniqueOptions(q4CorrectTrap, q4WrongCandidates).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q5: Input - Σταθερή απόσταση και ταχύτητα
  const q5Sp1 = 60;
  const q5T1 = randInt(4, 6);
  const q5Dist = q5Sp1 * q5T1;
  const q5Sp2 = 100;
  const q5T2 = q5Dist / q5Sp2;
  const q5CleanT2 = Number.isInteger(q5T2) ? q5T2 : Number(q5T2.toFixed(1));

  // Q6: MCQ - Έλεγχος λογικής αποτελέσματος (4 μοναδικές επιλογές)
  const q6CorrectLogic = locale === 'en'
    ? 'The required time must be strictly less than the initial 10 days'
    : 'Ο χρόνος πρέπει υποχρεωτικά να είναι λιγότερος από τις αρχικές 10 ημέρες';
  const q6WrongCandidates = [
    locale === 'en' ? 'The required time must be strictly greater than the initial 10 days' : 'Ο χρόνος πρέπει υποχρεωτικά να είναι μεγαλύτερος από τις αρχικές 10 ημέρες',
    locale === 'en' ? 'The required time will remain exactly unchanged' : 'Ο χρόνος θα παραμείνει ακριβώς ο ίδιος',
    locale === 'en' ? 'It is impossible to anticipate without running all calculations' : 'Δεν μπορούμε να γνωρίζουμε εκ των προτέρων'
  ];
  const q6Options = makeUniqueOptions(q6CorrectLogic, q6WrongCandidates).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate(locale);

  // Q8: Standard Problem (MCQ - 4 μοναδικές επιλογές)
  let spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  while (spIndex2 === spIndex1) spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q8Data = STANDARD_PROBLEMS_POOL[spIndex2].generate(locale);
  const q8Options = makeUniqueOptions(q8Data.correctText, q8Data.distractors).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q9: Hard Problem (Input)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate(locale);

  // Q10: Hard Problem (MCQ - 4 μοναδικές επιλογές)
  let hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  while (hpIndex2 === hpIndex1) hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hpIndex2].generate(locale);
  const q10Options = makeUniqueOptions(q10Data.correctText, q10Data.distractors).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Unit Rate Reduction' : 'Αναγωγή στη Μονάδα',
      prompt: locale === 'en'
        ? `If ${q1Workers} workers finish a project in ${q1Days} days, how many days would 1 single worker need to complete the exact same project?`
        : `Αν ${q1Workers} εργάτες τελειώνουν ένα έργο σε ${q1Days} ημέρες, πόσες ημέρες θα χρειαζόταν 1 μόνος εργάτης για να εκτελέσει το ίδιο ακριβώς έργο;`,
      correct: String(q1TotalManDays),
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          {locale === 'en'
            ? `In inversely proportional quantities we multiply for the unit: 1 worker needs ${q1Workers} · ${q1Days} ＝ ${q1TotalManDays} days.`
            : `Στα αντιστρόφως ανάλογα ποσά για τη μονάδα πολλαπλασιάζουμε: ο 1 εργάτης θα χρειαστεί ${q1Workers} · ${q1Days} ＝ ${q1TotalManDays} ημέρες.`}
        </span>
      )
    },
    {
      id: 'q2',
      type: 'mcq',
      title: locale === 'en' ? 'Unit Rate Methodology' : 'Μεθοδολογία Αναγωγής στη Μονάδα',
      prompt: locale === 'en'
        ? 'In inversely proportional problems (e.g. workers and days), which operation do we perform to find the unit value (1 unit)?'
        : 'Στα αντιστρόφως ανάλογα ποσά (π.χ. εργάτες και ημέρες), ποια πράξη εκτελούμε για να βρούμε τι αντιστοιχεί στη 1 μονάδα;',
      options: q2Options,
      correct: q2CorrectMethod,
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          {locale === 'en'
            ? 'Because 1 person takes proportionally longer than an entire crew, we multiply workers by days to find total workload.'
            : 'Επειδή 1 μόνο άτομο χρειάζεται πολλαπλάσιο χρόνο από μια ολόκληρη ομάδα, πολλαπλασιάζουμε τους εργάτες με τις ημέρες για να βρούμε το συνολικό έργο.'}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: locale === 'en' ? 'Horizontal Products in Table' : 'Οριζόντια Γινόμενα στον Πίνακα',
      prompt: locale === 'en'
        ? `In an inverse proportion table with row 1 [${q3W1}, ${q3D1}] and row 2 [${q3W2}, x], find the value of x:`
        : `Σε πίνακα αντιστρόφως ανάλογων ποσών με 1η γραμμή [${q3W1}, ${q3D1}] και 2η γραμμή [${q3W2}, x], βρείτε την τιμή του x:`,
      correct: formatNum(q3CleanTargetD, 1, locale),
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          x ＝ <Fraction num={`${q3W1} · ${q3D1}`} den={q3W2} /> ＝ <Fraction num={q3Total} den={q3W2} /> ＝ {formatNum(q3CleanTargetD, 1, locale)}
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'The Cross-Multiplication Trap' : 'Η Παγίδα του Χιαστί',
      prompt: locale === 'en'
        ? 'Is it permitted to cross-multiply in a table of inversely proportional quantities?'
        : 'Επιτρέπεται να εφαρμόσουμε σταυρωτό πολλαπλασιασμό (χιαστί) σε πίνακα με αντιστρόφως ανάλογα ποσά;',
      options: q4Options,
      correct: q4CorrectTrap,
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          {locale === 'en'
            ? 'Never cross-multiply with inversely proportional quantities! We always multiply paired values horizontally (x₁ · y₁ ＝ x₂ · y₂).'
            : 'Στα αντιστρόφως ανάλογα ποσά δεν κάνουμε ποτέ χιαστί! Στα αντιστρόφως ανάλογα πολλαπλασιάζουμε οριζόντια τα ζεύγη των τιμών (x₁ · y₁ ＝ x₂ · y₂).'}
        </span>
      )
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'decimal',
      title: locale === 'en' ? 'Constant Distance & Speed' : 'Σταθερή Απόσταση & Ταχύτητα',
      prompt: locale === 'en'
        ? `A vehicle covers a distance in ${q5T1} hours traveling at ${q5Sp1} km/h. In how many hours will it cover the same distance if it increases its speed to ${q5Sp2} km/h?`
        : `Ένα όχημα καλύπτει μια απόσταση σε ${q5T1} ώρες κινούμενο με ταχύτητα ${q5Sp1} km/h. Σε πόσες ώρες θα καλύψει την ίδια απόσταση αν αυξήσει την ταχύτητά του στα ${q5Sp2} km/h;`,
      correct: formatNum(q5CleanT2, 1, locale),
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          {locale === 'en' ? (
            <>
              Constant distance: {q5Sp1} · {q5T1} ＝ {q5Dist} km. New time: <Fraction num={q5Dist} den={q5Sp2} /> ＝ {formatNum(q5CleanT2, 1, locale)} h.
            </>
          ) : (
            <>
              Σταθερή απόσταση: {q5Sp1} · {q5T1} ＝ {q5Dist} km. Νέος χρόνος: <Fraction num={q5Dist} den={q5Sp2} /> ＝ {formatNum(q5CleanT2, 1, locale)} ώρες.
            </>
          )}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'mcq',
      title: locale === 'en' ? 'Reasonableness Check' : 'Έλεγχος Λογικής Αποτελέσματος',
      prompt: locale === 'en'
        ? 'If 4 workers take 10 days for a task, what do we expect when 8 workers work on the exact same task?'
        : 'Αν 4 εργάτες κάνουν 10 ημέρες για ένα έργο, τι περιμένουμε για το αποτέλεσμα αν εργαστούν 8 εργάτες;',
      options: q6Options,
      correct: q6CorrectLogic,
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          {locale === 'en'
            ? 'Since workers doubled, required time must be halved (to 5 days).'
            : 'Αφού οι εργάτες αυξήθηκαν (διπλασιάστηκαν), ο χρόνος πρέπει υποχρεωτικά να μειωθεί (να υποδιπλασιαστεί σε 5 ημέρες).'}
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

export default function ProblemAntistrofosAnalogaExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

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
          href="/st-dimotikou/47-problem-antistrofos-analoga-posa"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0 max-w-full"
        >
          <span>📖</span>
          <span className="truncate">{toCleanUppercase(t.theoryNav)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="w-full min-w-0 max-w-full bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 w-full min-w-0">
            <div className="space-y-2 max-w-3xl min-w-0 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200 max-w-full">
                <span className="break-words [overflow-wrap:anywhere]">{t.badge}</span>
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
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation max-w-full"
            >
              <span>🔄</span>
              <span className="break-words [overflow-wrap:anywhere]">{toCleanUppercase(t.newQuestions)}</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΙΣ 10 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8 w-full min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8 w-full min-w-0">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 w-full overflow-hidden ${getCardStyle(q)}`}
                >
                  <div className="min-w-0 w-full">
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-start gap-2 mb-3 min-w-0 w-full">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words [overflow-wrap:anywhere] max-w-full">
                        {toCleanUppercase(`${t.exercise} ${qNum}: ${q.title}`)}
                      </span>
                      {submitted && (
                        <span className="text-xl shrink-0">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <div className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4 break-words [overflow-wrap:anywhere] min-w-0">
                      {q.prompt}
                    </div>

                    {/* INPUTS / OPTIONS */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3 w-full min-w-0">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt.val;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, opt.val, 'mcq')}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex items-center justify-center min-h-[48px] w-full min-w-0 ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span className="break-words [overflow-wrap:anywhere] max-w-full">
                                {opt.render}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'input' && (
                      <div className="space-y-2 mb-3 w-full min-w-0">
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
                          placeholder={q.inputType === 'decimal' ? t.inputPlaceholderDecimal : t.inputPlaceholderNumber}
                          aria-label={`Answer for exercise ${qNum}`}
                          className="w-full min-w-0 p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner box-border"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0 w-full">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="w-full min-w-0 bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          {/* Desktop & Tablet Table */}
                          <div className="hidden sm:block overflow-x-auto w-full">
                            <table className="w-full text-xs text-left text-slate-700">
                              <thead>
                                <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                  <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderElement)}</th>
                                  <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderFormula)}</th>
                                  <th className="p-1.5 break-words">{toCleanUppercase(t.tableHeaderValue)}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-mono">
                                {q.tableData.map((row, rIdx) => (
                                  <tr key={rIdx}>
                                    <td className="p-1.5 font-sans font-bold text-slate-900 break-words">{row.item}</td>
                                    <td className="p-1.5 text-indigo-700 break-words">{row.formula}</td>
                                    <td className="p-1.5 font-black text-emerald-700 break-words">{row.val}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile Stacked Card View (<640px) */}
                          <div className="sm:hidden flex flex-col gap-2 divide-y divide-slate-100">
                            {q.tableData.map((row, rIdx) => (
                              <div key={rIdx} className="pt-2 first:pt-0 text-xs flex flex-col gap-1 min-w-0">
                                <span className="font-sans font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                                  {row.item}
                                </span>
                                <div className="flex items-center justify-between gap-2 font-mono flex-wrap">
                                  <span className="text-indigo-700 break-words [overflow-wrap:anywhere]">
                                    {row.formula}
                                  </span>
                                  <span className="font-black text-emerald-700 shrink-0">
                                    {row.val}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere] min-w-0 ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? t.feedbackSuccess : t.feedbackReview}
                        </p>
                        <div className="min-w-0 break-words [overflow-wrap:anywhere]">{q.explain}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4 w-full min-w-0">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation max-w-full"
              >
                <span className="text-xl">🎯</span>
                <span className="break-words [overflow-wrap:anywhere]">{toCleanUppercase(t.checkBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-3 sm:px-6">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3 w-full min-w-0`}>
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center sm:justify-start">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
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
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation max-w-full"
              >
                <span>🔄</span>
                <span className="break-words [overflow-wrap:anywhere]">{toCleanUppercase(t.newQuestions)}</span>
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
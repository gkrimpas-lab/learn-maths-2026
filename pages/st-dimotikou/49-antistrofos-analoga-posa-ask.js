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

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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

// Component κατακόρυφου κλάσματος (πλήρως responsive χωρίς horizontal scroll)
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
function formatNum(val, decimals = 1, locale = 'el') {
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
    pageTitle: "Ασκήσεις: Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα αντιστρόφως ανάλογα ποσά, το σταθερό γινόμενο και την αναγωγή στη μονάδα για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 49 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Αντιστρόφως Ανάλογα Ποσά",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στο σταθερό γινόμενο x · y, στην αναγωγή στη μονάδα και στην επίλυση ρεαλιστικών προβλημάτων!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    inputPlaceholderDecimal: "π.χ. 7,5",
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
    pageDesc: "Interactive 10-question practice test with automated scoring on inversely proportional quantities, constant product, and unit rate for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 49 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Inversely Proportional Quantities",
    desc: "Solve the 10 dynamic problems to practice constant products x · y, unit rate reduction, and real-world inverse variation problems!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    inputPlaceholderDecimal: "e.g. 7.5",
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
    id: 'inv_std_1',
    generate: (locale) => {
      const w1 = pickRandom([3, 4, 6]);
      const d1 = pickRandom([6, 8, 12]);
      const prod = w1 * d1;
      const w2 = pickRandom([2, 4, 6, 8, 12].filter((w) => w !== w1 && prod % w === 0));
      const d2 = prod / w2;
      const dayUnit = locale === 'en' ? 'days' : 'ημέρες';
      const formattedAns = formatNum(d2, 0, locale);
      return {
        title: locale === 'en' ? 'Workers & Project Completion Time' : 'Εργάτες και Χρόνος Ολοκλήρωσης',
        prompt: (
          <span>
            {locale === 'en'
              ? `${w1} workers complete a project in ${d1} days. In how many days will ${w2} workers complete the same project working at the same rate?`
              : `${w1} εργάτες τελειώνουν ένα έργο σε ${d1} ημέρες. Σε πόσες ημέρες θα τελειώσουν το ίδιο έργο ${w2} εργάτες, εργαζόμενοι με τον ίδιο ρυθμό;`}
          </span>
        ),
        unit: dayUnit,
        correctVal: String(d2),
        correctText: `${formattedAns} ${dayUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Initial crew' : 'Αρχική ομάδα',
            formula: `${w1} · ${d1}`,
            val: `${prod} ${locale === 'en' ? 'man-days' : 'μεροκάματα'}`
          },
          {
            item: locale === 'en' ? 'New crew' : 'Νέα ομάδα',
            formula: `${w2}`,
            val: `${w2}`
          },
          {
            item: locale === 'en' ? 'Required days' : 'Απαιτούμενες ημέρες',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={prod} den={w2} />
              </span>
            ),
            val: `${formattedAns} ${dayUnit}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Inversely proportional quantities (constant product: {w1} · {d1} ＝ {prod}). Therefore: x ＝ <Fraction num={prod} den={w2} /> ＝ {formattedAns} days.
              </>
            ) : (
              <>
                Τα ποσά είναι αντιστρόφως ανάλογα (σταθερό γινόμενο: {w1} · {d1} ＝ {prod}). Άρα: x ＝ <Fraction num={prod} den={w2} /> ＝ {formattedAns} ημέρες.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(d2 + 2, 0, locale)} ${dayUnit}`,
          `${formatNum(Math.max(1, d2 - 2), 0, locale)} ${dayUnit}`,
          `${formatNum(d2 + 4, 0, locale)} ${dayUnit}`,
          `${formatNum(d2 + 1, 0, locale)} ${dayUnit}`
        ]
      };
    }
  },
  {
    id: 'inv_std_2',
    generate: (locale) => {
      const v1 = pickRandom([40, 50, 60, 80]);
      const t1 = pickRandom([2, 3, 4]);
      const dist = v1 * t1;
      const v2 = pickRandom([60, 80, 100, 120].filter((v) => v !== v1 && dist % v === 0));
      const t2 = dist / v2;
      const hourUnit = locale === 'en' ? 'hours' : 'ώρες';
      const formattedAns = formatNum(t2, 0, locale);
      return {
        title: locale === 'en' ? 'Speed and Travel Time' : 'Ταχύτητα και Χρόνος Διαδρομής',
        prompt: (
          <span>
            {locale === 'en'
              ? `A car traveling at an average speed of ${v1} km/h covers a distance in ${t1} hours. How many hours will it need to cover the same distance at ${v2} km/h?`
              : `Ένα αυτοκίνητο κινούμενο με μέση ταχύτητα ${v1} km/h διανύει μια απόσταση σε ${t1} ώρες. Πόσες ώρες θα χρειαστεί για να διανύσει την ίδια απόσταση αν τρέχει με ${v2} km/h;`}
          </span>
        ),
        unit: hourUnit,
        correctVal: String(t2),
        correctText: `${formattedAns} ${hourUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Constant distance' : 'Σταθερή απόσταση',
            formula: `${v1} · ${t1}`,
            val: `${dist} km`
          },
          {
            item: locale === 'en' ? 'New speed' : 'Νέα ταχύτητα',
            formula: `${v2} km/h`,
            val: `${v2} km/h`
          },
          {
            item: locale === 'en' ? 'New travel time' : 'Νέος χρόνος',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={dist} den={v2} />
              </span>
            ),
            val: `${formattedAns} h`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Constant distance: {v1} · {t1} ＝ {dist} km. New time: <Fraction num={dist} den={v2} /> ＝ {formattedAns} hours.
              </>
            ) : (
              <>
                Σταθερή απόσταση: {v1} · {t1} ＝ {dist} km. Νέος χρόνος: <Fraction num={dist} den={v2} /> ＝ {formattedAns} ώρες.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(t2 + 1, 0, locale)} ${hourUnit}`,
          `${formatNum(Math.max(1, t2 - 1), 0, locale)} ${hourUnit}`,
          `${formatNum(t2 + 2, 0, locale)} ${hourUnit}`,
          `${formatNum(t2 + 3, 0, locale)} ${hourUnit}`
        ]
      };
    }
  },
  {
    id: 'inv_std_3',
    generate: (locale) => {
      const b1 = pickRandom([2, 3, 4]);
      const h1 = pickRandom([6, 8, 12]);
      const prod = b1 * h1;
      const b2 = pickRandom([6, 8, 12].filter((b) => b !== b1 && prod % b === 0));
      const h2 = prod / b2;
      const hourUnit = locale === 'en' ? 'hours' : 'ώρες';
      const formattedAns = formatNum(h2, 0, locale);
      return {
        title: locale === 'en' ? 'Water Taps & Pool Filling' : 'Βρύσες και Γέμισμα Πισίνας',
        prompt: (
          <span>
            {locale === 'en'
              ? `${b1} identical taps fill a pool in ${h1} hours. In how many hours will ${b2} identical taps fill the pool?`
              : `${b1} ίδιες βρύσες γεμίζουν μια πισίνα σε ${h1} ώρες. Σε πόσες ώρες θα γεμίσουν την πισίνα ${b2} ίδιες βρύσες;`}
          </span>
        ),
        unit: hourUnit,
        correctVal: String(h2),
        correctText: `${formattedAns} ${hourUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Constant product' : 'Σταθερό γινόμενο',
            formula: `${b1} · ${h1}`,
            val: `${prod}`
          },
          {
            item: locale === 'en' ? 'New taps' : 'Νέες βρύσες',
            formula: `${b2} ${locale === 'en' ? 'taps' : 'βρύσες'}`,
            val: `${b2}`
          },
          {
            item: locale === 'en' ? 'Filling time' : 'Χρόνος γεμίσματος',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={prod} den={b2} />
              </span>
            ),
            val: `${formattedAns} h`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Constant product: {b1} · {h1} ＝ {prod}. Therefore: x ＝ <Fraction num={prod} den={b2} /> ＝ {formattedAns} hours.
              </>
            ) : (
              <>
                Σταθερό γινόμενο: {b1} · {h1} ＝ {prod}. Άρα: x ＝ <Fraction num={prod} den={b2} /> ＝ {formattedAns} ώρες.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(h2 + 2, 0, locale)} ${hourUnit}`,
          `${formatNum(Math.max(1, h2 - 2), 0, locale)} ${hourUnit}`,
          `${formatNum(h2 + 3, 0, locale)} ${hourUnit}`,
          `${formatNum(h2 + 1, 0, locale)} ${hourUnit}`
        ]
      };
    }
  },
  {
    id: 'inv_std_4',
    generate: (locale) => {
      const animal1 = pickRandom([10, 15, 20]);
      const days1 = pickRandom([12, 16, 20]);
      const foodUnits = animal1 * days1;
      const animal2 = pickRandom([20, 25, 30].filter((a) => a !== animal1 && foodUnits % a === 0));
      const days2 = foodUnits / animal2;
      const dayUnit = locale === 'en' ? 'days' : 'ημέρες';
      const formattedAns = formatNum(days2, 0, locale);
      return {
        title: locale === 'en' ? 'Animal Fodder & Sufficiency Days' : 'Ζωοτροφή και Ημέρες Επάρκειας',
        prompt: (
          <span>
            {locale === 'en'
              ? `A quantity of animal fodder lasts for ${animal1} animals for ${days1} days. For how many days will the same fodder last for ${animal2} animals?`
              : `Μια ποσότητα ζωοτροφής επαρκεί για ${animal1} ζώα για ${days1} ημέρες. Για πόσες ημέρες θα επαρκέσει η ίδια τροφή για ${animal2} ζώα;`}
          </span>
        ),
        unit: dayUnit,
        correctVal: String(days2),
        correctText: `${formattedAns} ${dayUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Total food portions' : 'Συνολικές μερίδες τροφής',
            formula: `${animal1} · ${days1}`,
            val: `${foodUnits} ${locale === 'en' ? 'portions' : 'μερίδες'}`
          },
          {
            item: locale === 'en' ? 'New animal count' : 'Νέος αριθμός ζώων',
            formula: `${animal2}`,
            val: `${animal2}`
          },
          {
            item: locale === 'en' ? 'Sufficiency days' : 'Ημέρες επάρκειας',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={foodUnits} den={animal2} />
              </span>
            ),
            val: `${formattedAns} ${dayUnit}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Constant food amount: {animal1} · {days1} ＝ {foodUnits}. Days: <Fraction num={foodUnits} den={animal2} /> ＝ {formattedAns} days.
              </>
            ) : (
              <>
                Σταθερή ποσότητα τροφής: {animal1} · {days1} ＝ {foodUnits}. Ημέρες: <Fraction num={foodUnits} den={animal2} /> ＝ {formattedAns} ημέρες.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(days2 + 4, 0, locale)} ${dayUnit}`,
          `${formatNum(Math.max(1, days2 - 4), 0, locale)} ${dayUnit}`,
          `${formatNum(days2 + 6, 0, locale)} ${dayUnit}`,
          `${formatNum(days2 + 2, 0, locale)} ${dayUnit}`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'inv_hard_1',
    generate: (locale) => {
      const dayUnit = locale === 'en' ? 'days' : 'ημέρες';
      return {
        title: locale === 'en' ? 'Project with Crew Reinforcement' : 'Έργο με Ενίσχυση Εργατών',
        prompt: (
          <span>
            {locale === 'en'
              ? 'A crew of 8 workers can finish a project in 15 days. After working together for 3 days, 4 more workers join the crew. How many more days will be needed to complete the project?'
              : 'Ένα συνεργείο 8 εργατών μπορεί να τελειώσει ένα έργο σε 15 ημέρες. Αφού εργάστηκαν όλοι μαζί για 3 ημέρες, προστέθηκαν άλλοι 4 εργάτες. Πόσες ημέρες ακόμα θα χρειαστούν για να ολοκληρωθεί το έργο;'}
          </span>
        ),
        unit: dayUnit,
        correctVal: '8',
        correctText: `8 ${dayUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Remaining workload' : 'Εναπομείναν έργο (σε μεροκάματα)',
            formula: '8 · (15 － 3)',
            val: `96 ${locale === 'en' ? 'man-days' : 'μεροκάματα'}`
          },
          {
            item: locale === 'en' ? 'Total workers' : 'Συνολικοί εργάτες',
            formula: '8 ＋ 4',
            val: `12 ${locale === 'en' ? 'workers' : 'εργάτες'}`
          },
          {
            item: locale === 'en' ? 'Remaining days' : 'Ημέρες που απομένουν',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={96} den={12} />
              </span>
            ),
            val: `8 ${dayUnit}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Remaining: 15 － 3 ＝ 12 days for 8 workers (8 · 12 ＝ 96 man-days). With 8 ＋ 4 ＝ 12 workers: <Fraction num={96} den={12} /> ＝ 8 days.
              </>
            ) : (
              <>
                Απομένουν 15 － 3 ＝ 12 ημέρες για τους 8 εργάτες (8 · 12 ＝ 96 εργατοημέρες). Με 8 ＋ 4 ＝ 12 εργάτες: <Fraction num={96} den={12} /> ＝ 8 ημέρες.
              </>
            )}
          </span>
        ),
        distractors: [`10 ${dayUnit}`, `6 ${dayUnit}`, `12 ${dayUnit}`, `7 ${dayUnit}`]
      };
    }
  },
  {
    id: 'inv_hard_2',
    generate: (locale) => {
      return {
        title: locale === 'en' ? 'Hiker Speed Increase' : 'Αύξηση Ταχύτητας Πεζοπόρου',
        prompt: (
          <span>
            {locale === 'en'
              ? 'A hiker walking at 4 km/h takes 6 hours for a trail. If he wants to complete the trail in 4 hours, by how many km/h must he INCREASE his speed?'
              : 'Ένας πεζοπόρος βαδίζοντας με ταχύτητα 4 km/h χρειάζεται 6 ώρες για μια διαδρομή. Αν θέλει να καλύψει την ίδια διαδρομή σε 4 ώρες, κατά πόσα km/h πρέπει να ΑΥΞΗΣΕΙ την ταχύτητά του;'}
          </span>
        ),
        unit: 'km/h',
        correctVal: '2',
        correctText: '2 km/h',
        tableData: [
          {
            item: locale === 'en' ? 'Constant distance' : 'Σταθερή απόσταση',
            formula: '4 · 6',
            val: '24 km'
          },
          {
            item: locale === 'en' ? 'New required speed' : 'Νέα απαιτούμενη ταχύτητα',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={24} den={4} />
              </span>
            ),
            val: '6 km/h'
          },
          {
            item: locale === 'en' ? 'Required speed increase' : 'Απαιτούμενη αύξηση ταχύτητας',
            formula: '6 － 4',
            val: '2 km/h'
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Distance: 4 · 6 ＝ 24 km. New speed: <Fraction num={24} den={4} /> ＝ 6 km/h. Speed increase: 6 － 4 ＝ 2 km/h.
              </>
            ) : (
              <>
                Απόσταση: 4 · 6 ＝ 24 km. Νέα ταχύτητα: <Fraction num={24} den={4} /> ＝ 6 km/h. Αύξηση ταχύτητας: 6 － 4 ＝ 2 km/h.
              </>
            )}
          </span>
        ),
        distractors: ['3 km/h', '1 km/h', '4 km/h', '5 km/h']
      };
    }
  },
  {
    id: 'inv_hard_3',
    generate: (locale) => {
      const dayUnit = locale === 'en' ? 'days' : 'ημέρες';
      const formattedAns = formatNum(7.5, 1, locale);
      return {
        title: locale === 'en' ? 'Daily Work Schedule & Delivery Days' : 'Ωράριο Εργασίας και Ημέρες Παράδοσης',
        prompt: (
          <span>
            {locale === 'en'
              ? 'A crew of 12 workers finishes a project in 10 days working 6 hours per day. How many days would the same 12 workers need if they worked 8 hours per day?'
              : 'Μια ομάδα 12 εργατών ολοκληρώνει ένα έργο δουλεύοντας 6 ώρες την ημέρα σε 10 ημέρες. Πόσες ημέρες θα χρειάζονταν οι ίδιοι 12 εργάτες αν δούλευαν 8 ώρες την ημέρα;'}
          </span>
        ),
        unit: dayUnit,
        correctVal: formattedAns,
        correctText: `${formattedAns} ${dayUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Total project hours' : 'Συνολικές ώρες έργου',
            formula: '6 · 10',
            val: `60 ${locale === 'en' ? 'hours' : 'ώρες'}`
          },
          {
            item: locale === 'en' ? 'New daily schedule' : 'Νέο ημερήσιο ωράριο',
            formula: '8 h/day',
            val: '8 h'
          },
          {
            item: locale === 'en' ? 'New completion days' : 'Νέες ημέρες ολοκλήρωσης',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={60} den={8} />
              </span>
            ),
            val: `${formattedAns} ${dayUnit}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Total project hours: 6 · 10 ＝ 60 hours. With 8 hours daily: <Fraction num={60} den={8} /> ＝ {formattedAns} days.
              </>
            ) : (
              <>
                Συνολικές ώρες έργου: 6 · 10 ＝ 60 ώρες. Με 8 ώρες καθημερινά: <Fraction num={60} den={8} /> ＝ {formattedAns} ημέρες.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(8.5, 1, locale)} ${dayUnit}`,
          `${formatNum(6.5, 1, locale)} ${dayUnit}`,
          `9 ${dayUnit}`,
          `8 ${dayUnit}`
        ]
      };
    }
  },
  {
    id: 'inv_hard_4',
    generate: (locale) => {
      const tapUnit = locale === 'en' ? 'taps' : 'βρύσες';
      return {
        title: locale === 'en' ? 'Adding Taps for Faster Filling' : 'Προσθήκη Βρυσών για Ταχύτερο Γέμισμα',
        prompt: (
          <span>
            {locale === 'en'
              ? 'A reservoir is filled by 2 taps in 12 hours. If we want it filled in only 3 hours, how many such taps MUST BE ADDED in total?'
              : 'Μια δεξαμενή γεμίζει από 2 βρύσες σε 12 ώρες. Αν θέλουμε η δεξαμενή να γεμίσει σε μόλις 3 ώρες, πόσες τέτοιες βρύσες ΠΡΕΠΕΙ ΝΑ ΠΡΟΣΤΕΘΟΥΝ συνολικά;'}
          </span>
        ),
        unit: tapUnit,
        correctVal: '6',
        correctText: `6 ${tapUnit}`,
        tableData: [
          {
            item: locale === 'en' ? 'Constant workload' : 'Σταθερό γινόμενο έργου',
            formula: '2 · 12',
            val: '24'
          },
          {
            item: locale === 'en' ? 'Total taps needed' : 'Συνολικές βρύσες που απαιτούνται',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={24} den={3} />
              </span>
            ),
            val: `8 ${tapUnit}`
          },
          {
            item: locale === 'en' ? 'Taps to be added' : 'Βρύσες που πρέπει να προστεθούν',
            formula: '8 － 2',
            val: `6 ${tapUnit}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {locale === 'en' ? (
              <>
                Constant work: 2 · 12 ＝ 24. Total taps needed: <Fraction num={24} den={3} /> ＝ 8 taps. Must be added: 8 － 2 ＝ 6 taps.
              </>
            ) : (
              <>
                Σταθερό έργο: 2 · 12 ＝ 24. Συνολικές βρύσες που χρειάζονται: <Fraction num={24} den={3} /> ＝ 8 βρύσες. Πρέπει να προστεθούν: 8 － 2 ＝ 6 βρύσες.
              </>
            )}
          </span>
        ),
        distractors: [`8 ${tapUnit}`, `4 ${tapUnit}`, `5 ${tapUnit}`, `10 ${tapUnit}`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  // Q1: Input - Βασικό πρόβλημα εργατών
  const q1W1 = pickRandom([3, 4, 6]);
  const q1D1 = pickRandom([6, 8, 12]);
  const q1Prod = q1W1 * q1D1;
  const q1W2 = pickRandom([2, 4, 6, 8, 12].filter((w) => w !== q1W1 && q1Prod % w === 0));
  const q1D2 = q1Prod / q1W2;

  // Q2: MCQ - Βασική ιδιότητα αντιστρόφως αναλόγων (4 μοναδικές επιλογές)
  const q2Correct = locale === 'en'
    ? 'The product of their corresponding paired values is always constant (x · y ＝ constant)'
    : 'Το γινόμενο των αντίστοιχων τιμών τους είναι πάντοτε σταθερό (x · y ＝ σταθερό)';
  const q2WrongCandidates = [
    locale === 'en' ? 'The quotient of their corresponding values is always constant' : 'Το πηλίκο των αντίστοιχων τιμών τους είναι πάντοτε σταθερό',
    locale === 'en' ? 'When one quantity increases, the other increases at the same rate' : 'Όταν αυξάνεται το ένα ποσό, αυξάνεται και το άλλο στον ίδιο ρυθμό',
    locale === 'en' ? 'The difference between their values is always zero' : 'Η διαφορά ανάμεσα στις τιμές τους είναι πάντοτε ίση με το μηδέν'
  ];
  const q2Options = makeUniqueOptions(q2Correct, q2WrongCandidates).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q3: Input - Ταχύτητα και χρόνος
  const q3V1 = pickRandom([40, 60, 80]);
  const q3T1 = pickRandom([2, 3, 4]);
  const q3Dist = q3V1 * q3T1;
  const q3V2 = pickRandom([60, 80, 120].filter((v) => v !== q3V1 && q3Dist % v === 0));
  const q3T2 = q3Dist / q3V2;

  // Q4: MCQ - Χιαστί πολλαπλασιασμός παγίδα (4 μοναδικές επιλογές)
  const q4Correct = locale === 'en'
    ? 'No, in inversely proportional quantities we multiply horizontally and divide by the third number'
    : 'Όχι, στα αντιστρόφως ανάλογα ποσά πολλαπλασιάζουμε οριζόντια και διαιρούμε με τον τρίτο αριθμό';
  const q4WrongCandidates = [
    locale === 'en' ? 'Yes, cross-multiplication applies universally to all quantities' : 'Ναι, ο χιαστί πολλαπλασιασμός εφαρμόζεται σε όλα τα είδη ποσών',
    locale === 'en' ? 'Yes, provided we add the two numbers first' : 'Ναι, αρκεί πρώτα να προσθέσουμε τους δύο αριθμούς',
    locale === 'en' ? 'No, because we never perform arithmetic on inverse proportions' : 'Όχι, γιατί στα αντιστρόφως ανάλογα ποσά δεν κάνουμε ποτέ πράξεις'
  ];
  const q4Options = makeUniqueOptions(q4Correct, q4WrongCandidates).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q5: Input - Βρύσες και χρόνος
  const q5B1 = 3;
  const q5H1 = 8;
  const q5B2 = 6;
  const q5H2 = 4;

  // Q6: MCQ - Διπλασιασμός της μιας τιμής (4 μοναδικές επιλογές)
  const q6Correct = locale === 'en'
    ? 'The corresponding time is halved (divided by 2)'
    : 'Ο χρόνος μειώνεται στο μισό (διαιρείται με το 2)';
  const q6WrongCandidates = [
    locale === 'en' ? 'The corresponding time doubles (multiplied by 2)' : 'Ο χρόνος διπλασιάζεται (πολλαπλασιάζεται με το 2)',
    locale === 'en' ? 'The corresponding time remains completely unchanged' : 'Ο χρόνος παραμένει ακριβώς ο ίδιος',
    locale === 'en' ? 'The corresponding time increases by 2 hours' : 'Ο χρόνος αυξάνεται κατά 2 ώρες'
  ];
  const q6Options = makeUniqueOptions(q6Correct, q6WrongCandidates).map((v) => ({
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
      title: locale === 'en' ? 'Workers & Completion Time' : 'Εργάτες και Χρόνος Ολοκλήρωσης',
      prompt: locale === 'en'
        ? `${q1W1} workers complete a project in ${q1D1} days. In how many days will ${q1W2} workers finish the same project?`
        : `${q1W1} εργάτες τελειώνουν ένα έργο σε ${q1D1} ημέρες. Σε πόσες ημέρες θα τελειώσουν το ίδιο έργο ${q1W2} εργάτες;`,
      correct: String(q1D2),
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          {locale === 'en' ? (
            <>
              Constant product: {q1W1} · {q1D1} ＝ {q1Prod}. Days for {q1W2} workers: <Fraction num={q1Prod} den={q1W2} /> ＝ {q1D2} days.
            </>
          ) : (
            <>
              Σταθερό γινόμενο: {q1W1} · {q1D1} ＝ {q1Prod}. Ημέρες για {q1W2} εργάτες: <Fraction num={q1Prod} den={q1W2} /> ＝ {q1D2} ημέρες.
            </>
          )}
        </span>
      )
    },
    {
      id: 'q2',
      type: 'mcq',
      title: locale === 'en' ? 'The Fundamental Property' : 'Η Βασική Ιδιότητα',
      prompt: locale === 'en'
        ? 'What is the key mathematical property that distinguishes two inversely proportional quantities?'
        : 'Ποιο είναι το βασικό μαθηματικό χαρακτηριστικό που διακρίνει δύο αντιστρόφως ανάλογα ποσά;',
      options: q2Options,
      correct: q2Correct,
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          {locale === 'en'
            ? 'In inversely proportional quantities, the product of corresponding values remains constant (x · y ＝ constant).'
            : 'Στα αντιστρόφως ανάλογα ποσά το γινόμενο των αντίστοιχων τιμών τους παραμένει πάντα σταθερό (x · y ＝ σταθερό).'}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Speed and Time' : 'Ταχύτητα και Χρόνος',
      prompt: locale === 'en'
        ? `A car travels a route in ${q3T1} hours at ${q3V1} km/h. How many hours will it need at ${q3V2} km/h?`
        : `Ένα αυτοκίνητο διανύει μια διαδρομή σε ${q3T1} ώρες με ταχύτητα ${q3V1} km/h. Πόσες ώρες θα χρειαστεί με ταχύτητα ${q3V2} km/h;`,
      correct: String(q3T2),
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          {locale === 'en' ? (
            <>
              Constant distance: {q3V1} · {q3T1} ＝ {q3Dist} km. New time: <Fraction num={q3Dist} den={q3V2} /> ＝ {q3T2} hours.
            </>
          ) : (
            <>
              Σταθερή απόσταση: {q3V1} · {q3T1} ＝ {q3Dist} km. Νέος χρόνος: <Fraction num={q3Dist} den={q3V2} /> ＝ {q3T2} ώρες.
            </>
          )}
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Cross-Multiplication Check' : 'Χιαστί Πολλαπλασιασμός',
      prompt: locale === 'en'
        ? 'Can we use cross-multiplication in an inverse proportion table?'
        : 'Μπορούμε να χρησιμοποιήσουμε χιαστί πολλαπλασιασμό στον πίνακα αντιστρόφως αναλόγων ποσών;',
      options: q4Options,
      correct: q4Correct,
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          {locale === 'en'
            ? 'Cross-multiplication applies strictly to direct proportion. In inverse proportion we equate horizontal products (x₁ · y₁ ＝ x₂ · y₂).'
            : 'Ο χιαστί πολλαπλασιασμός ισχύει μόνο στα ανάλογα ποσά (σταθερό πηλίκο). Στα αντιστρόφως ανάλογα ποσά εξισώνουμε τα οριζόντια γινόμενα (x₁ · y₁ ＝ x₂ · y₂).'}
        </span>
      )
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Water Taps & Time' : 'Βρύσες και Χρόνος',
      prompt: locale === 'en'
        ? `${q5B1} identical taps fill a reservoir in ${q5H1} hours. In how many hours will ${q5B2} identical taps fill it?`
        : `${q5B1} ίδιες βρύσες γεμίζουν μια δεξαμενή σε ${q5H1} ώρες. Σε πόσες ώρες θα γεμίσουν την ίδια δεξαμενή ${q5B2} ίδιες βρύσες;`,
      correct: String(q5H2),
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          {locale === 'en' ? (
            <>
              Double the taps ({q5B2}) → Half the time: <Fraction num={`${q5B1} · ${q5H1}`} den={q5B2} /> ＝ <Fraction num={24} den={6} /> ＝ {q5H2} hours.
            </>
          ) : (
            <>
              Διπλάσιες βρύσες ({q5B2}) → Μισός χρόνος: <Fraction num={`${q5B1} · ${q5H1}`} den={q5B2} /> ＝ <Fraction num={24} den={6} /> ＝ {q5H2} ώρες.
            </>
          )}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'mcq',
      title: locale === 'en' ? 'Doubling One Quantity' : 'Διπλασιασμός της Μιας Τιμής',
      prompt: locale === 'en'
        ? 'In two inversely proportional quantities, if we double the value of the first, what happens to the corresponding value of the second?'
        : 'Σε δύο αντιστρόφως ανάλογα ποσά, αν διπλασιάσουμε την τιμή του πρώτου ποσού, τι θα συμβεί στην αντίστοιχη τιμή του δεύτερου ποσού;',
      options: q6Options,
      correct: q6Correct,
      explain: (
        <span className="inline-flex items-center flex-wrap leading-relaxed">
          {locale === 'en'
            ? 'When the value of one quantity is multiplied by 2, the corresponding value of the other is divided by 2.'
            : 'Όταν η τιμή του ενός ποσού πολλαπλασιάζεται με το 2, η αντίστοιχη τιμή του άλλου διαιρείται με το 2.'}
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

export default function AntistrofosAnalogaPosaExercisesPage() {
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
          href="/st-dimotikou/49-antistrofos-analoga-posa"
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
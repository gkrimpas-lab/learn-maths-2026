// pages/st-dimotikou/43-posa-ask.js
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
    pageTitle: "Ασκήσεις: Ποσά (Σταθερά & Μεταβλητά) - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στη διάκριση σταθερών και μεταβλητών ποσών και στα συσχετισμένα ποσά για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 43 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Σταθερά & Μεταβλητά Ποσά",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη διάκριση σταθερών και μεταβλητών ποσών, στον υπολογισμό συσχετισμένων μεγεθών και σε ρεαλιστικά προβλήματα καθημερινότητας!",
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
    pageTitle: "Exercises: Quantities (Constant & Variable) - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on distinguishing constant and variable quantities and solving related problems for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 43 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: Constant & Variable Quantities",
    desc: "Solve the 10 dynamic problems to practice distinguishing constant from variable quantities, computing related values, and solving practical word problems!",
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
    id: 'posa_std_1',
    generate: (locale) => {
      const fixedRate = randInt(3, 7);
      const count1 = randInt(3, 6);
      const cost1 = count1 * fixedRate;
      const count2 = count1 + randInt(3, 6);
      const cost2 = count2 * fixedRate;
      return {
        title: locale === 'en' ? 'Notebooks Purchase' : 'Αγορά Σημειωματάριων',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `In a bookstore, the price of a notebook is fixed. If we paid ${cost1} € for ${count1} notebooks, what is the amount in € for purchasing ${count2} such notebooks?`
              : `Σε ένα βιβλιοπωλείο η τιμή ενός σημειωματάριου είναι σταθερή. Αν για ${count1} σημειωματάρια πληρώσαμε ${cost1} €, ποιο είναι το ποσό σε € που αντιστοιχεί στην αγορά ${count2} τέτοιων σημειωματάριων;`}
          </span>
        ),
        unit: '€',
        correctVal: String(cost2),
        correctText: `${cost2} €`,
        tableData: [
          { item: locale === 'en' ? 'Constant unit price' : 'Σταθερό ποσό μονάδας', formula: `${cost1} : ${count1}`, val: `${fixedRate} €/${locale === 'en' ? 'pc.' : 'τεμ.'}` },
          { item: locale === 'en' ? 'Quantity' : 'Ποσότητα αγοράς', formula: `${count2} ${locale === 'en' ? 'pcs.' : 'τεμάχια'}`, val: `${count2}` },
          { item: locale === 'en' ? 'Total variable cost' : 'Συνολικό μεταβλητό κόστος', formula: `${count2} · ${fixedRate}`, val: `${cost2} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{count1 > 0 ? cost1 : 0} : {count1} ＝ {fixedRate} €/{locale === 'en' ? 'item' : 'σημειωματάριο'}.</span>
            <span>{count2} · {fixedRate} ＝ {cost2} €.</span>
          </span>
        ),
        distractors: [
          `${cost2 + fixedRate} €`,
          `${Math.max(1, cost2 - fixedRate)} €`,
          `${cost2 + 2 * fixedRate} €`
        ]
      };
    }
  },
  {
    id: 'posa_std_2',
    generate: (locale) => {
      const speed = randInt(60, 90);
      const hours = randInt(2, 5);
      const distance = speed * hours;
      return {
        title: locale === 'en' ? 'Motion at Constant Speed' : 'Κίνηση με Σταθερή Ταχύτητα',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `A vehicle travels at a constant speed of ${speed} km/h. What is the distance (in km) covered in ${hours} hours?`
              : `Ένα όχημα κινείται με σταθερή ταχύτητα ${speed} km/h. Ποια είναι η μεταβλητή απόσταση (σε km) που θα διανύσει το όχημα σε χρόνο ${hours} ωρών;`}
          </span>
        ),
        unit: 'km',
        correctVal: String(distance),
        correctText: `${distance} km`,
        tableData: [
          { item: locale === 'en' ? 'Constant speed' : 'Σταθερό ποσό (Ταχύτητα)', formula: `${speed} km/h`, val: `${speed} km/h` },
          { item: locale === 'en' ? 'Variable time' : 'Μεταβλητό ποσό (Χρόνος)', formula: `${hours} ${locale === 'en' ? 'hours' : 'ώρες'}`, val: `${hours} h` },
          { item: locale === 'en' ? 'Distance' : 'Συσχετισμένο ποσό (Απόσταση)', formula: `${speed} · ${hours}`, val: `${distance} km` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{speed} km/h · {hours} h ＝ {distance} km.</span>
          </span>
        ),
        distractors: [
          `${distance + speed} km`,
          `${Math.max(20, distance - speed)} km`,
          `${distance + 30} km`
        ]
      };
    }
  },
  {
    id: 'posa_std_3',
    generate: (locale) => {
      const baseFee = randInt(5, 12);
      const costPerDay = randInt(2, 4);
      const days = randInt(4, 8);
      const total = baseFee + costPerDay * days;
      return {
        title: locale === 'en' ? 'Rental with Base Fee' : 'Χρέωση Ενοικίασης με Πάγιο',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `An equipment rental charges a fixed fee of ${baseFee} € plus ${costPerDay} € per day of use. What is the total cost in € for ${days} days of rental?`
              : `Μια υπηρεσία ενοικίασης εξοπλισμού χρεώνει σταθερό πάγιο ποσό ${baseFee} € συν ${costPerDay} € για κάθε ημέρα χρήσης. Ποιο είναι το συνολικό ποσό πληρωμής σε € για ${days} ημέρες ενοικίασης;`}
          </span>
        ),
        unit: '€',
        correctVal: String(total),
        correctText: `${total} €`,
        tableData: [
          { item: locale === 'en' ? 'Base fee' : 'Σταθερό πάγιο ποσό', formula: `${baseFee} €`, val: `${baseFee} €` },
          { item: locale === 'en' ? 'Daily cost' : 'Μεταβλητό κόστος ημερών', formula: `${days} · ${costPerDay} €`, val: `${costPerDay * days} €` },
          { item: locale === 'en' ? 'Total amount' : 'Συνολικό ποσό', formula: `${baseFee} ＋ ${costPerDay * days}`, val: `${total} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{baseFee} ＋ ({days} · {costPerDay}) ＝ {baseFee} ＋ {costPerDay * days} ＝ {total} €.</span>
          </span>
        ),
        distractors: [
          `${total + costPerDay} €`,
          `${Math.max(5, total - costPerDay)} €`,
          `${total + baseFee} €`
        ]
      };
    }
  },
  {
    id: 'posa_std_4',
    generate: (locale) => {
      const perLiterCost = 1.8;
      const liters = randInt(10, 30);
      const totalCost = Number((liters * perLiterCost).toFixed(2));
      return {
        title: locale === 'en' ? 'Fuel Volume and Cost' : 'Καύσιμα και Κόστος',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `Gasoline price is fixed at 1.80 € per liter. How many € will a driver pay for filling ${liters} liters?`
              : `Η τιμή της βενζίνης σε ένα πρατήριο παραμένει σταθερή στα 1,80 € το λίτρο. Πόσα € θα πληρώσει ένας οδηγός που έβαλε στο ρεζερβουάρ του ${liters} l καυσίμου;`}
          </span>
        ),
        unit: '€',
        correctVal: formatNum(totalCost, 2, locale),
        correctText: `${formatNum(totalCost, 2, locale)} €`,
        tableData: [
          { item: locale === 'en' ? 'Price per liter' : 'Σταθερή τιμή ανά λίτρο', formula: '1,80 €/l', val: '1,80 €' },
          { item: locale === 'en' ? 'Volume' : 'Μεταβλητός όγκος καυσίμου', formula: `${liters} l`, val: `${liters} l` },
          { item: locale === 'en' ? 'Total cost' : 'Συνολικό κόστος', formula: `${liters} · 1,80`, val: `${formatNum(totalCost, 2, locale)} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{liters} · 1,80 ＝ {formatNum(totalCost, 2, locale)} €.</span>
          </span>
        ),
        distractors: [
          `${formatNum(totalCost + 3.6, 2, locale)} €`,
          `${formatNum(Math.max(1, totalCost - 1.8), 2, locale)} €`,
          `${formatNum(totalCost + 5.4, 2, locale)} €`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'posa_hard_1',
    generate: (locale) => {
      const speed1 = randInt(60, 80);
      const speed2 = speed1 + 20;
      const hours = randInt(2, 4);
      const distDiff = (speed2 - speed1) * hours;
      return {
        title: locale === 'en' ? 'Two Vehicles at Different Speeds' : 'Κίνηση Δύο Οχημάτων με Διαφορετική Ταχύτητα',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `Two cars start simultaneously in the same direction. The first moves at constant speed ${speed1} km/h and the second at ${speed2} km/h. How many km will separate them after ${hours} hours?`
              : `Δύο αυτοκίνητα ξεκινούν ταυτόχρονα από την ίδια αφετηρία. Το πρώτο κινείται με σταθερή ταχύτητα ${speed1} km/h και το δεύτερο με σταθερή ταχύτητα ${speed2} km/h. Πόσα km θα απέχουν μεταξύ τους μετά από ${hours} ώρες αν κινούνται προς την ίδια κατεύθυνση;`}
          </span>
        ),
        unit: 'km',
        correctVal: String(distDiff),
        correctText: `${distDiff} km`,
        tableData: [
          { item: locale === 'en' ? 'Speed difference' : 'Σταθερή διαφορά ταχύτητας', formula: `${speed2} － ${speed1}`, val: `${speed2 - speed1} km/h` },
          { item: locale === 'en' ? 'Time' : 'Χρόνος κίνησης', formula: `${hours} h`, val: `${hours} h` },
          { item: locale === 'en' ? 'Distance apart' : 'Μεταβλητή απόσταση μεταξύ τους', formula: `${speed2 - speed1} · ${hours}`, val: `${distDiff} km` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>({speed2} － {speed1}) · {hours} ＝ {speed2 - speed1} · {hours} ＝ {distDiff} km.</span>
          </span>
        ),
        distractors: [
          `${distDiff + 20} km`,
          `${Math.max(10, distDiff - 10)} km`,
          `${distDiff + 40} km`
        ]
      };
    }
  },
  {
    id: 'posa_hard_2',
    generate: (locale) => {
      const fixedMonthly = 15;
      const freeGigs = 5;
      const extraPerGig = 2.5;
      const usedGigs = freeGigs + randInt(2, 6);
      const extraGigs = usedGigs - freeGigs;
      const totalCost = Number((fixedMonthly + extraGigs * extraPerGig).toFixed(2));
      return {
        title: locale === 'en' ? 'Mobile Data Plan Billing' : 'Χρέωση Προγράμματος Κινητής',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `A mobile plan charges a fixed monthly fee of ${fixedMonthly} € including ${freeGigs} GB of data. Each extra GB costs ${formatNum(extraPerGig, 1, locale)} €. How much will a customer pay for consuming ${usedGigs} GB in a month?`
              : `Ένα πρόγραμμα κινητής τηλεφωνίας έχει σταθερό μηνιαίο πάγιο ${fixedMonthly} € και περιλαμβάνει ${freeGigs} GB δωρεάν δεδομένα. Για κάθε επιπλέον GB χρεώνει ${formatNum(extraPerGig, 1, locale)} €. Πόσα € θα πληρώσει ένας συνδρομητής που κατανάλωσε συνολικά ${usedGigs} GB σε έναν μήνα;`}
          </span>
        ),
        unit: '€',
        correctVal: formatNum(totalCost, 2, locale),
        correctText: `${formatNum(totalCost, 2, locale)} €`,
        tableData: [
          { item: locale === 'en' ? 'Base fee' : 'Σταθερό μηνιαίο πάγιο', formula: `${fixedMonthly} €`, val: `${fixedMonthly} €` },
          { item: locale === 'en' ? 'Extra data' : 'Επιπλέον δεδομένα', formula: `${usedGigs} － ${freeGigs}`, val: `${extraGigs} GB` },
          { item: locale === 'en' ? 'Extra cost' : 'Επιπλέον κόστος', formula: `${extraGigs} · ${formatNum(extraPerGig, 1, locale)} €`, val: `${formatNum(extraGigs * extraPerGig, 2, locale)} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{fixedMonthly} ＋ ({extraGigs} · {formatNum(extraPerGig, 1, locale)}) ＝ {fixedMonthly} ＋ {formatNum(extraGigs * extraPerGig, 2, locale)} ＝ {formatNum(totalCost, 2, locale)} €.</span>
          </span>
        ),
        distractors: [
          `${formatNum(totalCost + 2.5, 2, locale)} €`,
          `${formatNum(Math.max(5, totalCost - 2.5), 2, locale)} €`,
          `${formatNum(totalCost + 5, 2, locale)} €`
        ]
      };
    }
  },
  {
    id: 'posa_hard_3',
    generate: (locale) => {
      const tankCapacity = 600;
      const tapIn = 35;
      const tapOut = 15;
      const netGain = tapIn - tapOut;
      const minutes = randInt(10, 25);
      const currentWater = netGain * minutes;
      return {
        title: locale === 'en' ? 'Water Tank Inflow & Outflow' : 'Δεξαμενή με Εισροή και Εκροή',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `In an empty ${tankCapacity} l tank, an inflow tap pours ${tapIn} l/min while an outflow drain loses ${tapOut} l/min. How many liters will the tank contain after ${minutes} minutes of simultaneous operation?`
              : `Σε μια άδεια δεξαμενή χωρητικότητας ${tankCapacity} l, μια βρύση εισροής ρίχνει ${tapIn} l/min και ταυτόχρονα μια βρύση εκροής χάνει ${tapOut} l/min. Πόσα l νερού θα περιέχει η δεξαμενή μετά από ${minutes} λεπτά ταυτόχρονης λειτουργίας;`}
          </span>
        ),
        unit: 'l',
        correctVal: String(currentWater),
        correctText: `${currentWater} l`,
        tableData: [
          { item: locale === 'en' ? 'Net flow rate' : 'Σταθερός ρυθμός μεταβολής', formula: `${tapIn} － ${tapOut}`, val: `${netGain} l/min` },
          { item: locale === 'en' ? 'Time' : 'Χρόνος λειτουργίας', formula: `${minutes} min`, val: `${minutes} min` },
          { item: locale === 'en' ? 'Net water' : 'Συνολικό νερό στη δεξαμενή', formula: `${netGain} · ${minutes}`, val: `${currentWater} l` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>({tapIn} － {tapOut}) · {minutes} ＝ {netGain} · {minutes} ＝ {currentWater} l.</span>
          </span>
        ),
        distractors: [
          `${currentWater + 50} l`,
          `${Math.max(20, currentWater - 40)} l`,
          `${currentWater + 80} l`
        ]
      };
    }
  },
  {
    id: 'posa_hard_4',
    generate: (locale) => {
      const fixedHallCost = 120;
      const costPerGuest = 14;
      const guests = randInt(25, 40);
      const total = fixedHallCost + guests * costPerGuest;
      return {
        title: locale === 'en' ? 'Event Fixed & Variable Cost' : 'Σταθερό και Μεταβλητό Κόστος Εκδήλωσης',
        prompt: (
          <span className="break-words [overflow-wrap:anywhere]">
            {locale === 'en'
              ? `For a school event, hall rental costs a fixed ${fixedHallCost} €, while catering costs ${costPerGuest} € per guest. What is the total cost in € if ${guests} guests attend?`
              : `Για μια σχολική εκδήλωση, η ενοικίαση της αίθουσας κοστίζει σταθερά ${fixedHallCost} €, ενώ το κόστος του φαγητού ανέρχεται σε ${costPerGuest} € ανά καλεσμένο. Ποιο είναι το συνολικό κόστος σε € αν παρευρεθούν ${guests} καλεσμένοι;`}
          </span>
        ),
        unit: '€',
        correctVal: String(total),
        correctText: `${total} €`,
        tableData: [
          { item: locale === 'en' ? 'Hall fixed fee' : 'Σταθερό κόστος αίθουσας', formula: `${fixedHallCost} €`, val: `${fixedHallCost} €` },
          { item: locale === 'en' ? 'Catering variable' : 'Μεταβλητό κόστος φαγητού', formula: `${guests} · ${costPerGuest} €`, val: `${guests * costPerGuest} €` },
          { item: locale === 'en' ? 'Total cost' : 'Συνολικό κόστος', formula: `${fixedHallCost} ＋ ${guests * costPerGuest}`, val: `${total} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{fixedHallCost} ＋ ({guests} · {costPerGuest}) ＝ {fixedHallCost} ＋ {guests * costPerGuest} ＝ {total} €.</span>
          </span>
        ),
        distractors: [
          `${total + 28} €`,
          `${Math.max(50, total - 14)} €`,
          `${total + 42} €`
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  // Q1: Input - Υπολογισμός εξαρτημένου μεταβλητού ποσού
  const q1Rate = randInt(3, 8);
  const q1Kg = randInt(4, 9);
  const q1Total = q1Rate * q1Kg;

  // Q2: MCQ - Αναγνώριση σταθερού ποσού (4 μοναδικές επιλογές)
  const q2Correct = locale === 'en'
    ? 'The number of days in the month of April (30 days)'
    : 'Ο αριθμός των ημερών του μήνα Απριλίου (30 ημέρες)';
  const q2WrongCandidates = locale === 'en'
    ? [
        'Daily city temperature',
        "A student's weight over the year",
        "A car's speed in city traffic"
      ]
    : [
        'Η ημερήσια θερμοκρασία σε μια πόλη',
        'Το βάρος ενός μαθητή κατά τη διάρκεια του έτους',
        'Η ταχύτητα ενός αυτοκινήτου μέσα στην κίνηση της πόλης'
      ];
  const q2Options = makeUniqueOptions(q2Correct, q2WrongCandidates);

  // Q3: Input - Εύρεση του σταθερού ποσού (τιμή μονάδας)
  const q3Count = randInt(4, 8);
  const q3UnitPrice = randInt(3, 6);
  const q3Total = q3Count * q3UnitPrice;

  // Q4: MCQ - Έννοια του ποσού (4 μοναδικές επιλογές)
  const q4Correct = locale === 'en'
    ? 'Any measurable magnitude expressed as a number paired with a unit of measurement'
    : 'Κάθε μέγεθος που μπορεί να μετρηθεί και εκφράζεται με αριθμό και μονάδα μέτρησης';
  const q4WrongCandidates = locale === 'en'
    ? [
        'Any abstract integer without any unit',
        'Only the money paid during shopping',
        'Only numbers that never change'
      ]
    : [
        'Οποιοσδήποτε αφηρημένος ακέραιος αριθμός χωρίς μονάδα μέτρησης',
        'Μόνο τα χρήματα που πληρώνουμε σε μια αγορά',
        'Μόνο οι αριθμοί που παραμένουν πάντοτε σταθεροί'
      ];
  const q4Options = makeUniqueOptions(q4Correct, q4WrongCandidates);

  // Q5: Input - Υπολογισμός διανυόμενης απόστασης
  const q5Speed = randInt(70, 100);
  const q5Time = randInt(2, 4);
  const q5Dist = q5Speed * q5Time;

  // Q6: MCQ - Αναγνώριση μεταβλητού ποσού (4 μοναδικές επιλογές)
  const q6Correct = locale === 'en' ? "A student's weight" : 'Το βάρος ενός μαθητή';
  const q6WrongCandidates = locale === 'en'
    ? [
        'The number of months in a year (12)',
        'The number of grams in a kilogram (1,000)',
        'The number of sides of a triangle (3)'
      ]
    : [
        'Ο αριθμός των μηνών του έτους (12 μήνες)',
        'Ο αριθμός των γραμμαρίων σε 1 κιλό (1.000 g)',
        'Ο αριθμός των πλευρών ενός τριγώνου (3 πλευρές)'
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
      title: locale === 'en' ? 'Variable Cost Calculation' : 'Υπολογισμός Μεταβλητού Ποσού',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `At a grocery, orange price is fixed at ${q1Rate} € per kg. What is the total cost in € for purchasing ${q1Kg} kg of oranges?`
            : `Σε ένα μανάβικο η τιμή των πορτοκαλιών είναι σταθερή στα ${q1Rate} € το κιλό. Ποιο είναι το συνολικό κόστος σε € για την αγορά ${q1Kg} kg πορτοκαλιών;`}
        </span>
      ),
      correct: String(q1Total),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>{q1Rate} · {q1Kg} ＝ {q1Total} €.</span>
        </span>
      )
    },
    {
      id: 'q2',
      type: 'mcq',
      title: locale === 'en' ? 'Identifying Constant Quantity' : 'Αναγνώριση Σταθερού Ποσού',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'Which of the following quantities remains always constant?'
            : 'Ποιο από τα παρακάτω ποσά παραμένει πάντοτε σταθερό;'}
        </span>
      ),
      options: q2Options,
      correct: q2Correct,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'April always has 30 days, which is a constant quantity. Temperature, weight, and traffic speed vary.'
            : 'Ο Απρίλιος έχει πάντοτε σταθερά 30 ημέρες, επομένως είναι σταθερό ποσό. Η θερμοκρασία, το βάρος και η ταχύτητα μεταβάλλονται.'}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Finding Unit Constant' : 'Εύρεση Σταθερού Ποσού',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `If we paid ${q3Total} € for ${q3Count} identical notebooks, what is the constant unit price in € per notebook?`
            : `Αν για ${q3Count} ίδια τετράδια πληρώσαμε συνολικά ${q3Total} €, ποιο είναι το σταθερό ποσό σε € που κοστίζει το κάθε τετράδιο;`}
        </span>
      ),
      correct: String(q3UnitPrice),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>{q3Total} : {q3Count} ＝ {q3UnitPrice} €.</span>
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Concept of Quantity' : 'Έννοια του Ποσού',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en' ? 'What is defined as a quantity in mathematics?' : 'Τι ονομάζεται ποσό στα Μαθηματικά;'}
        </span>
      ),
      options: q4Options,
      correct: q4Correct,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'A quantity is any measurable magnitude expressed by a number paired with an appropriate unit.'
            : 'Στα Μαθηματικά ποσό ονομάζεται κάθε μέγεθος που μετριέται ή υπολογίζεται και εκφράζεται με αριθμό και μονάδα μέτρησης.'}
        </span>
      )
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Related Quantities in Motion' : 'Συσχετισμένα Ποσά στην Κίνηση',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? `A car travels at constant speed of ${q5Speed} km/h. How many km will it travel in ${q5Time} hours?`
            : `Ένα αυτοκίνητο ταξιδεύει με σταθερή ταχύτητα ${q5Speed} km/h. Πόσα km θα διανύσει σε χρόνο ${q5Time} ωρών;`}
        </span>
      ),
      correct: String(q5Dist),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>{q5Speed} · {q5Time} ＝ {q5Dist} km.</span>
        </span>
      )
    },
    {
      id: 'q6',
      type: 'mcq',
      title: locale === 'en' ? 'Identifying Variable Quantity' : 'Αναγνώριση Μεταβλητού Ποσού',
      prompt: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'Which of the following changes value and represents a variable quantity?'
            : 'Ποιο από τα παρακάτω μεγέθη αλλάζει τιμή και είναι μεταβλητό ποσό;'}
        </span>
      ),
      options: q6Options,
      correct: q6Correct,
      explain: (
        <span className="break-words [overflow-wrap:anywhere]">
          {locale === 'en'
            ? 'Human weight changes over time, while months in year (12), grams per kg (1,000), and triangle sides (3) are constants.'
            : 'Το βάρος μεταβάλλεται. Αντίθετα, οι μήνες (12), τα γραμμάρια του κιλού (1.000) και οι πλευρές του τριγώνου (3) είναι σταθερά ποσά.'}
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

export default function PosaExercisesPage() {
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
          href="/st-dimotikou/43-posa"
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
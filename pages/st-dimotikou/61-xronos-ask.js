// pages/st-dimotikou/61-xronos-ask.js
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
  if (Number.isInteger(num)) {
    return num.toLocaleString(loc);
  }
  return num.toLocaleString(loc, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// ---------------------------------------------------------
// ΔΙΕΘΝΟΠΟΙΗΣΗ (i18n) & ΛΕΞΙΚΟ
// ---------------------------------------------------------

const I18N = {
  el: {
    metaTitle: "Ασκήσεις: Μονάδες Μέτρησης Χρόνου - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στις μονάδες μέτρησης χρόνου, τις μετατροπές, τους αιώνες και τις ζώνες ώρας για τη ΣΤ' Δημοτικού.",
    backLinkText: "ΣΤ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeHeader: "ΚΕΦΑΛΑΙΟ 61 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Διαδραστικές Ασκήσεις: Μονάδες Μέτρησης Χρόνου",
    heroDesc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στις μετατροπές ωρών/λεπτών/δευτερολέπτων, στους υπολογισμούς διάρκειας, στους αιώνες και στις παγκόσμιες ζώνες ώρας!",
    newSetBtn: "Νέες Ασκήσεις",
    exerciseLabel: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholder: "Απάντηση...",
    checkBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ",
    answeredLabel: "Απαντήθηκαν",
    percentageLabel: "Ποσοστό",
    footerPrompt: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!",
    excellentFeedback: "🎯 Εξαιρετικά!",
    explainFeedback: "💡 Επεξήγηση:",
    tableColItem: "Στοιχείο",
    tableColFormula: "Ανάλυση / Μετατροπή",
    tableColVal: "Τιμή"
  },
  en: {
    metaTitle: "Exercises: Units of Time Measurement - 6th Grade | LearnMaths.gr",
    metaDesc: "Interactive math exercises with 10 problems and automated grading on time units, conversions, centuries, and global time zones for 6th Grade.",
    backLinkText: "6th Grade",
    theoryBtn: "Theory",
    badgeHeader: "CHAPTER 61 • 6TH GRADE • PRACTICE",
    heroTitle: "Interactive Exercises: Units of Time Measurement",
    heroDesc: "Solve 10 dynamic problems to practice hours/minutes/seconds conversions, elapsed time calculations, centuries, and global time zones!",
    newSetBtn: "New Questions",
    exerciseLabel: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholder: "Answer...",
    checkBtn: "Check Answers",
    scoreLabel: "Score",
    answeredLabel: "Answered",
    percentageLabel: "Percentage",
    footerPrompt: "Answer all 10 questions and press 'Check Answers'!",
    excellentFeedback: "🎯 Excellent!",
    explainFeedback: "💡 Explanation:",
    tableColItem: "Item",
    tableColFormula: "Formula / Conversion",
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
      const depH = 8;
      const depM = 45;
      const arrH = 14;
      const arrM = 20;
      const totalM = (arrH * 60 + arrM) - (depH * 60 + depM);
      const resH = Math.floor(totalM / 60);
      const resM = totalM % 60;
      const correctText = isEn
        ? `${resH} hours and ${resM} minutes`
        : `${resH} ώρες και ${resM} λεπτά`;

      return {
        title: isEn ? 'Ferry Travel Duration' : 'Διάρκεια Ταξιδιού με Πλοίο',
        prompt: isEn
          ? `A ferry departs from Piraeus at 0${depH}:${depM} and arrives at its destination at ${arrH}:${arrM}. How long did the trip take?`
          : `Ένα πλοίο αναχωρεί από τον Πειραιά στις 0${depH}:${depM} και φτάνει στον προορισμό του στις ${arrH}:${arrM}. Πόση ώρα διήρκεσε το ταξίδι;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Arrival time' : 'Ώρα άφιξης',
            formula: `${arrH} h ${arrM} min`,
            val: isEn
              ? `${arrH - 1} h ${arrM + 60} min (after borrowing)`
              : `${arrH - 1} h ${arrM + 60} min (μετά τον δανεισμό)`
          },
          {
            item: isEn ? 'Departure time' : 'Ώρα αναχώρησης',
            formula: `0${depH} h ${depM} min`,
            val: `0${depH} h ${depM} min`
          },
          {
            item: isEn ? 'Trip duration' : 'Διάρκεια ταξιδιού',
            formula: `(${arrH - 1} － ${depH}) h ${isEn ? 'and' : 'και'} (${arrM + 60} － ${depM}) min`,
            val: `${resH} h ${resM} min`
          }
        ],
        explain: isEn
          ? `We borrow 1 hour (60 minutes) from ${arrH} hours: 14 h 20 min ＝ 13 h 80 min. Subtracting: (13 － 8) h ＝ ${resH} h and (80 － 45) min ＝ ${resM} min.`
          : `Δανειζόμαστε 1 ώρα (60 λεπτά) από τις ${arrH} ώρες: 14 h 20 min ＝ 13 h 80 min. Αφαιρούμε: (13 － 8) h ＝ ${resH} h και (80 － 45) min ＝ ${resM} min.`,
        distractors: isEn
          ? [
              `${resH + 1} hours and ${resM} minutes`,
              `${resH} hours and ${Math.max(5, resM - 10)} minutes`,
              `${Math.max(1, resH - 1)} hours and ${resM + 15} minutes`
            ]
          : [
              `${resH + 1} ώρες και ${resM} λεπτά`,
              `${resH} ώρες και ${Math.max(5, resM - 10)} λεπτά`,
              `${Math.max(1, resH - 1)} ώρες και ${resM + 15} λεπτά`
            ]
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const startH = 18;
      const startM = 30;
      const durM = 135;
      const durHours = Math.floor(durM / 60);
      const durRemM = durM % 60;
      const endTotalM = startH * 60 + startM + durM;
      const endH = Math.floor(endTotalM / 60);
      const endM = endTotalM % 60;
      const endMFormatted = endM < 10 ? `0${endM}` : String(endM);
      const correctText = `${endH}:${endMFormatted}`;

      return {
        title: isEn ? 'Movie Running Time' : 'Διάρκεια Κινηματογραφικής Ταινίας',
        prompt: isEn
          ? `A movie starts at ${startH}:${startM} and lasts ${durM} minutes. What time will the screening end?`
          : `Μια κινηματογραφική ταινία ξεκινά στις ${startH}:${startM} και έχει διάρκεια ${durM} λεπτά. Τι ώρα θα τελειώσει η προβολή;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Duration in hours & min' : 'Διάρκεια σε ώρες & λεπτά',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={String(durM)} den="60" />
                <span className="ml-1">
                  ＝ {durHours} h {isEn ? 'and' : 'και'} ${durRemM} min
                </span>
              </span>
            ),
            val: `${durHours} h ${isEn ? 'and' : 'και'} ${durRemM} min`
          },
          {
            item: isEn ? 'Start time' : 'Ώρα έναρξης',
            formula: `${startH}:${startM}`,
            val: `${startH} h ${startM} min`
          },
          {
            item: isEn ? 'End time' : 'Ώρα λήξης',
            formula: `(${startH} ＋ ${durHours}) h ${isEn ? 'and' : 'και'} (${startM} ＋ ${durRemM}) min`,
            val: `${endH}:${endMFormatted}`
          }
        ],
        explain: (
          <span>
            {isEn ? `${durM} minutes equals ` : `Τα ${durM} λεπτά είναι `}
            <span className="font-bold">{durHours} h {isEn ? 'and' : 'και'} {durRemM} min</span>.
            {isEn
              ? ` Adding: ${startH} h 30 min ＋ ${durHours} h 15 min ＝ ${endH}:${endMFormatted}.`
              : ` Προσθέτουμε: ${startH} h 30 min ＋ ${durHours} h 15 min ＝ ${endH}:${endMFormatted}.`}
          </span>
        ),
        distractors: [
          `${endH + 1}:${endMFormatted}`,
          `${endH}:${Math.max(0, endM - 15) < 10 ? '0' + Math.max(0, endM - 15) : Math.max(0, endM - 15)}`,
          `${endH - 1}:${endM + 10 < 10 ? '0' + (endM + 10) : endM + 10}`
        ]
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const m1 = 45;
      const m2 = 40;
      const m3 = 35;
      const total = m1 + m2 + m3;
      const hours = total / 60;
      const hoursFormatted = formatNum(hours, locale, 1);
      const correctText = isEn ? `${hoursFormatted} hours` : `${hoursFormatted} ώρες`;

      return {
        title: isEn ? 'Student Study Time' : 'Χρόνος Μελέτης Μαθητή',
        prompt: isEn
          ? `George studied Mathematics for ${m1} minutes, Language for ${m2} minutes, and History for ${m3} minutes. How many total hours did his study take?`
          : `Ο Γιώργος διάβασε ${m1} λεπτά Μαθηματικά, ${m2} λεπτά Γλώσσα και ${m3} λεπτά Ιστορία. Πόσες ώρες διήρκεσε συνολικά η μελέτη του;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Total minutes' : 'Συνολικά λεπτά',
            formula: `${m1} ＋ ${m2} ＋ ${m3}`,
            val: `${total} ${isEn ? 'min' : 'λεπτά'}`
          },
          {
            item: isEn ? 'Conversion to hours' : 'Μετατροπή σε ώρες',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={String(total)} den="60" />
                <span className="ml-1">＝ {correctText}</span>
              </span>
            ),
            val: correctText
          }
        ],
        explain: (
          <span>
            {isEn
              ? `We sum the minutes: ${m1} ＋ ${m2} ＋ ${m3} ＝ ${total} minutes. Convert to hours: `
              : `Αθροίζουμε τα λεπτά: ${m1} ＋ ${m2} ＋ ${m3} ＝ ${total} λεπτά. Μετατρέπουμε σε ώρες: `}
            <Fraction num={String(total)} den="60" />
            {` ＝ ${correctText}.`}
          </span>
        ),
        distractors: isEn
          ? ['1.5 hours', '2.5 hours', '3 hours']
          : ['1,5 ώρα', '2,5 ώρες', '3 ώρες']
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const startH = 9;
      const startM = 15;
      const endH = 11;
      const endM = 5;
      const totalM = (endH * 60 + endM) - (startH * 60 + startM);
      const resH = Math.floor(totalM / 60);
      const resM = totalM % 60;
      const correctText = isEn
        ? `${resH} hour and ${resM} minutes`
        : `${resH} ώρα και ${resM} λεπτά`;

      return {
        title: isEn ? 'Athletic Footrace' : 'Αθλητικός Αγώνας Δρόμου',
        prompt: isEn
          ? `A runner started the race at 0${startH}:${startM} and crossed the finish line at ${endH}:0${endM}. How long did the runner race?`
          : `Ένας δρομέας ξεκίνησε τον αγώνα στις 0${startH}:${startM} και τερμάτισε στις ${endH}:0${endM}. Πόση ώρα έτρεχε ο δρομέας;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Finish time' : 'Ώρα τερματισμού',
            formula: `${endH}:0${endM}`,
            val: isEn
              ? `${endH - 1} h ${endM + 60} min (borrowed)`
              : `${endH - 1} h ${endM + 60} min (με δανεισμό)`
          },
          {
            item: isEn ? 'Start time' : 'Ώρα εκκίνησης',
            formula: `0${startH}:${startM}`,
            val: `0${startH} h ${startM} min`
          },
          {
            item: isEn ? 'Elapsed time' : 'Χρόνος διαδρομής',
            formula: `(${endH - 1} － ${startH}) h ${isEn ? 'and' : 'και'} (${endM + 60} － ${startM}) min`,
            val: `${resH} h ${resM} min`
          }
        ],
        explain: isEn
          ? `Borrow 1 hour: 11 h 05 min ＝ 10 h 65 min. Subtract: (10 － 9) h ＝ ${resH} hour and (65 － 15) min ＝ ${resM} minutes.`
          : `Δανειζόμαστε 1 ώρα: 11 h 05 min ＝ 10 h 65 min. Αφαιρούμε: (10 － 9) h ＝ ${resH} ώρα και (65 － 15) min ＝ ${resM} λεπτά.`,
        distractors: isEn
          ? [
              `2 hours and ${resM} minutes`,
              `${resH} hour and ${Math.max(5, resM - 10)} minutes`,
              `${resH + 1} hours and 10 minutes`
            ]
          : [
              `2 ώρες και ${resM} λεπτά`,
              `${resH} ώρα και ${Math.max(5, resM - 10)} λεπτά`,
              `${resH + 1} ώρες και 10 λεπτά`
            ]
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const depH = 15;
      const depM = 50;
      const durH = 3;
      const durM = 25;
      const totalM = depH * 60 + depM + durH * 60 + durM;
      const arrH = Math.floor(totalM / 60);
      const arrM = totalM % 60;
      const arrMFormatted = arrM < 10 ? `0${arrM}` : String(arrM);
      const correctText = `${arrH}:${arrMFormatted}`;

      return {
        title: isEn ? 'Train Timetable' : 'Δρομολόγιο Αμαξοστοιχίας',
        prompt: isEn
          ? `A train departs from the station at ${depH}:${depM} and the journey takes ${durH} hours and ${durM} minutes. What is the arrival time?`
          : `Ένα τρένο αναχωρεί από τον σταθμό στις ${depH}:${depM} και το ταξίδι διαρκεί ${durH} ώρες και ${durM} λεπτά. Ποια είναι η ώρα άφιξης;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Departure time' : 'Ώρα αναχώρησης',
            formula: `${depH}:${depM}`,
            val: `${depH} h ${depM} min`
          },
          {
            item: isEn ? 'Trip duration' : 'Διάρκεια ταξιδιού',
            formula: `${durH} h ${durM} min`,
            val: `${durH} h ${durM} min`
          },
          {
            item: isEn ? 'Arrival time' : 'Ώρα άφιξης',
            formula: `${depH + durH} h ＋ 75 min (60 min ＝ 1 h)`,
            val: `${arrH}:${arrMFormatted}`
          }
        ],
        explain: isEn
          ? `Adding: ${depH} ＋ ${durH} ＝ 18 hours and ${depM} ＋ ${durM} ＝ 75 minutes. 75 minutes equals 1 hour and 15 minutes. Thus 18 ＋ 1 ＝ ${arrH}:${arrMFormatted}.`
          : `Προσθέτουμε: ${depH} ＋ ${durH} ＝ 18 ώρες και ${depM} ＋ ${durM} ＝ 75 λεπτά. Τα 75 λεπτά είναι 1 ώρα και 15 λεπτά. Άρα 18 ＋ 1 ＝ ${arrH}:${arrMFormatted}.`,
        distractors: [
          `${arrH - 1}:15`,
          `${arrH}:25`,
          `${arrH + 1}:15`
        ]
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const totalS = 195;
      const m = Math.floor(totalS / 60);
      const s = totalS % 60;
      const correctText = isEn
        ? `${m} minutes and ${s} seconds`
        : `${m} λεπτά και ${s} δευτερόλεπτα`;

      return {
        title: isEn ? 'Swimming Stopwatch' : 'Χρονόμετρο Αγώνα Κολύμβησης',
        prompt: isEn
          ? `A swimmer completed the 200m event in ${totalS} seconds. What was the time in minutes and seconds?`
          : `Ένας κολυμβητής ολοκλήρωσε την κούρσα των 200 μέτρων σε ${totalS} δευτερόλεπτα. Πόσα λεπτά και δευτερόλεπτα ήταν ο χρόνος του;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Total seconds' : 'Συνολικά δευτερόλεπτα',
            formula: `${totalS} s`,
            val: `${totalS}`
          },
          {
            item: isEn ? 'Division by 60' : 'Διαίρεση με το 60',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={String(totalS)} den="60" />
              </span>
            ),
            val: isEn ? `quotient ${m}, remainder ${s}` : `πηλίκο ${m}, υπόλοιπο ${s}`
          },
          {
            item: isEn ? 'Final form' : 'Τελική μορφή',
            formula: `${m} · 60 ＋ ${s}`,
            val: `${m} min ${isEn ? 'and' : 'και'} ${s} s`
          }
        ],
        explain: (
          <span>
            {isEn ? `Dividing ` : `Διαιρούμε `}
            <Fraction num={String(totalS)} den="60" />
            {isEn
              ? ` ＝ ${m} with remainder ${s}. Thus the time is ${m} minutes and ${s} seconds.`
              : ` ＝ ${m} με υπόλοιπο ${s}. Άρα ο χρόνος είναι ${m} λεπτά και ${s} δευτερόλεπτα.`}
          </span>
        ),
        distractors: isEn
          ? [
              `${Math.max(1, m - 1)} minutes and 45 seconds`,
              `${m} minutes and ${s + 10} seconds`,
              `4 minutes and 05 seconds`
            ]
          : [
              `${Math.max(1, m - 1)} λεπτά και 45 δευτερόλεπτα`,
              `${m} λεπτά και ${s + 10} δευτερόλεπτα`,
              `4 λεπτά και 05 δευτερόλεπτα`
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
      const year = 1453;
      const cent = 15;
      const mill = 2;
      const correctText = isEn
        ? `${cent}th century (${mill}nd millennium)`
        : `${cent}ος αιώνας (${mill}η χιλιετία)`;

      return {
        title: isEn ? 'Century and Millennium Calculation' : 'Υπολογισμός Αιώνα και Χιλιετίας',
        prompt: isEn
          ? `In which century and in which millennium does the historic year ${year} (Fall of Constantinople) belong?`
          : `Σε ποιον αιώνα και σε ποια χιλιετία ανήκει το ιστορικό έτος ${year} (Άλωση της Κωνσταντινούπολης);`,
        correctText,
        tableData: [
          { item: isEn ? 'Year' : 'Έτος', formula: `${year}`, val: `${year}` },
          {
            item: isEn ? 'Century rule' : 'Κανόνας αιώνα',
            formula: '14 ＋ 1',
            val: isEn ? `${cent}th century (1401-1500)` : `${cent}ος αιώνας (1401-1500)`
          },
          {
            item: isEn ? 'Millennium' : 'Χιλιετία',
            formula: isEn ? '1001 to 2000' : '1001 έως 2000',
            val: isEn ? `${mill}nd millennium` : `${mill}η χιλιετία`
          }
        ],
        explain: isEn
          ? `The year ${year} belongs to 1401-1500, making it the ${cent}th century (14 ＋ 1 ＝ 15). It lies between 1001 and 2000, which is the ${mill}nd millennium.`
          : `Το έτος ${year} ανήκει στην περίοδο 1401-1500, άρα είναι ο ${cent}ος αιώνας (14 ＋ 1 ＝ 15). Βρίσκεται επίσης μεταξύ των ετών 1001 και 2000, δηλαδή στη ${mill}η χιλιετία.`,
        distractors: isEn
          ? [
              '14th century (1st millennium)',
              '16th century (2nd millennium)',
              '15th century (1st millennium)'
            ]
          : [
              '14ος αιώνας (1η χιλιετία)',
              '16ος αιώνας (2η χιλιετία)',
              '15ος αιώνας (1η χιλιετία)'
            ]
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const depAthens = 10;
      const flightDur = 4;
      const depGmt = depAthens - 2;
      const arrGmt = depGmt + flightDur;
      const correctText = isEn ? '12:00 (London local time)' : '12:00 (τοπική ώρα Λονδίνου)';

      return {
        title: isEn ? 'Flight Duration with UTC Zones' : 'Υπολογισμός Ώρας Πτήσης με Ζώνες UTC',
        prompt: isEn
          ? `An airplane departs Athens (UTC＋2) at 10:00 AM bound for London (UTC 0). If the flight duration is 4 hours, what will be the local arrival time in London?`
          : `Ένα αεροπλάνο αναχωρεί από την Αθήνα (UTC＋2) στις 10:00 το πρωί με προορισμό το Λονδίνο (UTC 0). Αν η διάρκεια της πτήσης είναι 4 ώρες, τι ώρα θα προσγειωθεί στο Λονδίνο σε τοπική ώρα;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Departure (Athens)' : 'Ώρα αναχώρησης (Αθήνα)',
            formula: '10:00 (UTC＋2)',
            val: isEn ? '08:00 in Greenwich time (UTC 0)' : '08:00 σε ώρα Greenwich (UTC 0)'
          },
          {
            item: isEn ? 'Flight duration' : 'Διάρκεια πτήσης',
            formula: isEn ? '4 hours' : '4 ώρες',
            val: isEn ? '＋4 hours' : '＋4 ώρες'
          },
          {
            item: isEn ? 'Arrival (London)' : 'Ώρα άφιξης (Λονδίνο)',
            formula: isEn ? '08:00 ＋ 4 hours' : '08:00 ＋ 4 ώρες',
            val: '12:00'
          }
        ],
        explain: isEn
          ? `When it is 10:00 in Athens, London (Greenwich) is 2 hours behind at 08:00. Adding flight time: 08:00 ＋ 4 h ＝ 12:00 local London time.`
          : `Στην Αθήνα όταν είναι 10:00, στο Λονδίνο (Greenwich) είναι 2 ώρες πίσω, δηλαδή 08:00. Προσθέτουμε τη διάρκεια της πτήσης (4 ώρες): 08:00 ＋ 4 h ＝ 12:00 τοπική ώρα.`,
        distractors: isEn
          ? [
              '14:00 (London local time)',
              '10:00 (London local time)',
              '13:00 (London local time)'
            ]
          : [
              '14:00 (τοπική ώρα Λονδίνου)',
              '10:00 (τοπική ώρα Λονδίνου)',
              '13:00 (τοπική ώρα Λονδίνου)'
            ]
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const num = 3;
      const den = 4;
      const minVal = (num * 60) / den;
      const secVal = minVal * 60;
      const secValFormatted = formatNum(secVal, locale, 0);
      const correctText = isEn ? `${secValFormatted} seconds` : `${secValFormatted} δευτερόλεπτα`;

      return {
        title: isEn ? 'Fractional Hour & Seconds' : 'Κλασματική Ώρα & Δευτερόλεπτα',
        hasFractionPrompt: true,
        fractionProps: { num: 3, den: 4 },
        promptPrefix: isEn ? 'How many seconds are in ' : 'Πόσα δευτερόλεπτα είναι τα ',
        promptSuffix: isEn ? ' of an hour?' : ' μίας ώρας;',
        prompt: isEn ? 'How many seconds are in 3/4 of an hour?' : 'Πόσα δευτερόλεπτα είναι τα 3/4 μίας ώρας;',
        correctText,
        tableData: [
          {
            item: isEn ? '1 hour in seconds' : '1 ώρα σε δευτερόλεπτα',
            formula: '60 · 60',
            val: '3.600 s'
          },
          {
            item: isEn ? 'Fraction calculation' : 'Υπολογισμός κλάσματος',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num="3 · 3.600" den="4" />
                <span className="ml-1">＝ {secValFormatted} s</span>
              </span>
            ),
            val: `${secValFormatted} s`
          },
          {
            item: isEn ? 'Alternatively in minutes' : 'Εναλλακτικά σε λεπτά',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num="3" den="4" />
                <span className="ml-1">
                  {isEn ? 'of an hour ＝ 45 min' : 'της ώρας ＝ 45 min'}
                </span>
              </span>
            ),
            val: `45 · 60 ＝ ${secValFormatted} s`
          }
        ],
        explain: (
          <span>
            {isEn ? 'The ' : 'Τα '}
            <Fraction num="3" den="4" />
            {isEn
              ? ` of an hour is 45 minutes (since 60 : 4 ＝ 15 and 15 · 3 ＝ 45). Converting to seconds: 45 · 60 ＝ ${secValFormatted} seconds.`
              : ` της ώρας είναι 45 λεπτά (αφού 60 : 4 ＝ 15 και 15 · 3 ＝ 45). Μετατρέπουμε σε δευτερόλεπτα: 45 · 60 ＝ ${secValFormatted} δευτερόλεπτα.`}
          </span>
        ),
        distractors: isEn
          ? ['1,800 seconds', '3,000 seconds', '2,400 seconds']
          : ['1.800 δευτερόλεπτα', '3.000 δευτερόλεπτα', '2.400 δευτερόλεπτα']
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const athensH = 16;
      const diff = 7;
      const nyH = athensH - diff;
      const correctText = isEn ? '09:00 AM' : '09:00 το πρωί';

      return {
        title: isEn ? 'Time Difference in Global Videoconference' : 'Διαφορά Χρόνου σε Διεθνή Τηλεδιάσκεψη',
        prompt: isEn
          ? `A professional in Athens (UTC＋2) schedules a conference call at 16:00 (4:00 PM) with a colleague in New York (UTC－5). What time will it be in New York when the conference begins?`
          : `Ένας επαγγελματίας στην Αθήνα (UTC＋2) προγραμματίζει τηλεδιάσκεψη στις 16:00 το απόγευμα με συνεργάτη του στη Νέα Υόρκη (UTC－5). Τι ώρα θα είναι στη Νέα Υόρκη κατά την έναρξη της διάσκεψης;`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Athens time zone' : 'Ζώνη Αθήνας',
            formula: 'UTC＋2',
            val: isEn ? '2 hours ahead of Greenwich' : '2 ώρες μπροστά από Greenwich'
          },
          {
            item: isEn ? 'New York time zone' : 'Ζώνη Νέας Υόρκης',
            formula: 'UTC－5',
            val: isEn ? '5 hours behind Greenwich' : '5 ώρες πίσω από Greenwich'
          },
          {
            item: isEn ? 'Total difference' : 'Συνολική διαφορά',
            formula: '2 ＋ 5 ＝ 7 hours',
            val: isEn ? 'New York is 7 hours behind Athens' : 'Η Νέα Υόρκη είναι 7 ώρες πίσω από την Αθήνα'
          }
        ],
        explain: isEn
          ? `The total time difference is 2 ＋ 5 ＝ 7 hours. New York is 7 hours behind Athens: 16:00 － 7 hours ＝ 09:00 AM.`
          : `Η διαφορά ώρας είναι 2 ＋ 5 ＝ 7 ώρες. Η Νέα Υόρκη είναι 7 ώρες πίσω από την Αθήνα: 16:00 － 7 ώρες ＝ 09:00 το πρωί.`,
        distractors: isEn
          ? ['11:00 AM', '11:00 PM', '14:00 (2:00 PM)']
          : ['11:00 το πρωί', '23:00 το βράδυ', '14:00 το μεσημέρι']
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const correctText = isEn ? '19th century' : '19ος αιώνας';

      return {
        title: isEn ? 'Century of a Year Ending in 00' : 'Αιώνας Έτους που Λήγει σε 00',
        prompt: isEn ? 'Which century does the year 1900 belong to?' : 'Σε ποιον αιώνα ανήκει το έτος 1900;',
        correctText,
        tableData: [
          { item: isEn ? 'Year' : 'Έτος', formula: '1900', val: isEn ? 'Ends in 00' : 'Λήγει σε 00' },
          {
            item: isEn ? 'Rule' : 'Κανόνας',
            formula: isEn ? 'Do not add 1' : 'Δεν προσθέτουμε 1',
            val: isEn ? '19th century (years 1801 to 1900)' : '19ος αιώνας (έτη 1801 έως 1900)'
          }
        ],
        explain: isEn
          ? 'Years ending in 00 are the final year of that respective century. Therefore, 1900 was the last year of the 19th century (the 20th started in 1901).'
          : 'Τα έτη που λήγουν σε 00 αποτελούν το τελευταίο έτος του αντίστοιχου αιώνα. Άρα το 1900 ήταν το τελευταίο έτος του 19ου αιώνα (ο 20ός ξεκίνησε το 1901).',
        distractors: isEn
          ? ['20th century', '18th century', '21st century']
          : ['20ός αιώνας', '18ος αιώνας', '21ος αιώνας']
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const h1 = 2;
      const m1 = 45;
      const h2 = 3;
      const m2 = 35;
      const sumH = h1 + h2;
      const sumM = m1 + m2;
      const finalH = sumH + Math.floor(sumM / 60);
      const finalM = sumM % 60;
      const correctText = isEn
        ? `${finalH} hours and ${finalM} minutes`
        : `${finalH} ώρες και ${finalM} λεπτά`;

      return {
        title: isEn ? 'Compound Addition of Time Intervals' : 'Σύνθετη Πρόσθεση Χρονικών Διαστημάτων',
        prompt: isEn
          ? `Calculate the sum of the time intervals: (${h1} h ${m1} min) ＋ (${h2} h ${m2} min):`
          : `Υπολόγισε το άθροισμα των χρονικών διαστημάτων: (${h1} h ${m1} min) ＋ (${h2} h ${m2} min):`,
        correctText,
        tableData: [
          {
            item: isEn ? 'Sum of hours' : 'Άθροισμα ωρών',
            formula: `${h1} ＋ ${h2}`,
            val: `${sumH} h`
          },
          {
            item: isEn ? 'Sum of minutes' : 'Άθροισμα λεπτών',
            formula: `${m1} ＋ ${m2}`,
            val: `${sumM} min`
          },
          {
            item: isEn ? 'Convert 60 min to 1 hour' : 'Μετατροπή 60 λεπτών σε 1 ώρα',
            formula: `${sumM} min ＝ 1 h ${isEn ? 'and' : 'και'} ${finalM} min`,
            val: `${finalH} h ${finalM} min`
          }
        ],
        explain: isEn
          ? `Adding: ${h1} ＋ ${h2} ＝ ${sumH} hours and ${m1} ＋ ${m2} ＝ ${sumM} minutes. Since 80 min ＝ 1 hour and 20 min, the result is ${finalH} hours and ${finalM} minutes.`
          : `Προσθέτουμε: ${h1} ＋ ${h2} ＝ ${sumH} ώρες και ${m1} ＋ ${m2} ＝ ${sumM} λεπτά. Επειδή 80 min ＝ 1 ώρα και 20 λεπτά, το τελικό αποτέλεσμα είναι ${finalH} ώρες και ${finalM} λεπτά.`,
        distractors: isEn
          ? [
              '5 hours and 80 minutes',
              '5 hours and 20 minutes',
              '7 hours and 10 minutes'
            ]
          : [
              '5 ώρες και 80 λεπτά',
              '5 ώρες και 20 λεπτά',
              '7 ώρες και 10 λεπτά'
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

  // Q1: Input - Ώρες και λεπτά σε συνολικά λεπτά
  const q1H = randInt(2, 5);
  const q1M = randInt(10, 50);
  const q1Mult = q1H * 60;
  const q1Res = q1Mult + q1M;

  // Q2: Input - Λεπτά σε δευτερόλεπτα
  const q2M = randInt(8, 25);
  const q2Res = q2M * 60;

  // Q3: Input - Συνολικά λεπτά σε ολόκληρες ώρες
  const q3TotalM = randInt(130, 290);
  const q3H = Math.floor(q3TotalM / 60);
  const q3RemM = q3TotalM % 60;

  // Q4: MCQ - Δευτερόλεπτα μίας ώρας
  const q4Correct = isEn ? '3,600 seconds' : '3.600 δευτερόλεπτα';
  const q4Distractors = isEn
    ? ['600 seconds', '6,000 seconds', '60 seconds']
    : ['600 δευτερόλεπτα', '6.000 δευτερόλεπτα', '60 δευτερόλεπτα'];
  const q4Options = makeUniqueOptions(q4Correct, q4Distractors);

  // Q5: True/False - Δεκαδική ώρα
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = isEn
    ? (q5IsTrue
        ? '2.5 hours is equivalent to 2 hours and 30 minutes (half an hour).'
        : '2.5 hours is equivalent to 2 hours and 50 minutes.')
    : (q5IsTrue
        ? 'Ο χρόνος 2,5 ώρες ισοδυναμεί με 2 ώρες και 30 λεπτά (μισή ώρα).'
        : 'Ο χρόνος 2,5 ώρες ισοδυναμεί με 2 ώρες και 50 λεπτά.');

  // Q6: True/False - Δίσεκτο έτος
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = isEn
    ? (q6IsTrue
        ? 'A leap year has 366 days and occurs once every 4 years.'
        : 'A leap year has 365 days and February has 28 days.')
    : (q6IsTrue
        ? 'Το δίσεκτο έτος έχει 366 ημέρες και συμβαίνει κάθε 4 χρόνια.'
        : 'Το δίσεκτο έτος έχει 365 ημέρες και ο Φεβρουάριος έχει 28 ημέρες.');

  // Q7: Input - Εύρεση αιώνα για ένα έτος
  const q7YearPool = [
    { y: 1821, cent: 19 },
    { y: 1453, cent: 15 },
    { y: 1940, cent: 20 },
    { y: 1789, cent: 18 },
    { y: 2024, cent: 21 },
    { y: 1204, cent: 13 }
  ];
  const q7Choice = q7YearPool[randInt(0, q7YearPool.length - 1)];

  // Q8: MCQ - Ώρα Greenwich / UTC Ελλάδας
  const q8GmtHour = randInt(9, 15);
  const q8AthensHour = (q8GmtHour + 2) % 24;
  const q8Correct = `${q8AthensHour}:00`;
  const q8Distractors = [
    `${q8GmtHour}:00`,
    `${(q8GmtHour - 2 + 24) % 24}:00`,
    `${(q8AthensHour + 2) % 24}:00`
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
      title: isEn ? 'Hours & Minutes to Total Minutes' : 'Ώρες & Λεπτά σε Συνολικά Λεπτά',
      prompt: isEn
        ? `Convert ${q1H} hours and ${q1M} minutes into total minutes:`
        : `Μετάτρεψε το χρονικό διάστημα ${q1H} ώρες και ${q1M} λεπτά σε συνολικά λεπτά:`,
      correct: String(q1Res),
      explain: isEn
        ? `Multiply hours by 60 and add the minutes: (${q1H} · 60) ＋ ${q1M} ＝ ${q1Mult} ＋ ${q1M} ＝ ${q1Res} minutes.`
        : `Πολλαπλασιάζουμε τις ώρες επί 60 και προσθέτουμε τα λεπτά: (${q1H} · 60) ＋ ${q1M} ＝ ${q1Mult} ＋ ${q1M} ＝ ${q1Res} λεπτά.`
    },
    {
      id: 'q2',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Minutes to Seconds' : 'Λεπτά σε Δευτερόλεπτα',
      prompt: isEn ? `How many seconds are in ${q2M} minutes?` : `Πόσα δευτερόλεπτα είναι τα ${q2M} λεπτά;`,
      correct: String(q2Res),
      explain: isEn
        ? `Each minute has 60 seconds: ${q2M} · 60 ＝ ${q2Res} seconds.`
        : `Κάθε λεπτό έχει 60 δευτερόλεπτα: ${q2M} · 60 ＝ ${q2Res} δευτερόλεπτα.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Extracting Whole Hours from Minutes' : 'Ανάλυση Λεπτών σε Ώρες',
      prompt: isEn
        ? `How many whole hours are contained in ${q3TotalM} minutes? (Enter the integer number of hours only):`
        : `Πόσες ολόκληρες ώρες περιέχονται στα ${q3TotalM} λεπτά; (Γράψε μόνο τον ακέραιο αριθμό των ωρών):`,
      correct: String(q3H),
      explain: (
        <span>
          {isEn ? `Divide by 60: ` : `Διαιρούμε με το 60: `}
          <Fraction num={String(q3TotalM)} den="60" />
          {isEn
            ? ` ＝ ${q3H} whole hours with ${q3RemM} minutes remaining.`
            : ` ＝ ${q3H} ολόκληρες ώρες και περισσεύουν ${q3RemM} λεπτά.`}
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: isEn ? 'Seconds in One Hour' : 'Δευτερόλεπτα μίας Ώρας',
      prompt: isEn ? 'How many seconds are contained in 1 full hour?' : 'Πόσα δευτερόλεπτα περιέχει 1 ολόκληρη ώρα;',
      options: q4Options,
      correct: q4Correct,
      explain: isEn
        ? '1 hour ＝ 60 minutes and each minute ＝ 60 seconds. Therefore: 60 · 60 ＝ 3,600 seconds.'
        : '1 ώρα ＝ 60 λεπτά και κάθε λεπτό ＝ 60 δευτερόλεπτα. Άρα 60 · 60 ＝ 3.600 δευτερόλεπτα.'
    },
    {
      id: 'q5',
      type: 'tf',
      title: isEn ? 'Decimal Representation of Hours' : 'Δεκαδική Μορφή Ώρας',
      text: q5Text,
      correct: q5IsTrue,
      explain: isEn
        ? (q5IsTrue
            ? 'Correct! 0.5 of an hour is half of 60, which equals 30 minutes (2.5 h ＝ 2 h 30 min).'
            : 'False! Time is not base-10. 0.5 of an hour corresponds to 30 minutes, not 50 minutes.')
        : (q5IsTrue
            ? 'Σωστά! Το 0,5 της ώρας είναι το μισό του 60, δηλαδή 30 λεπτά (2,5 h ＝ 2 h 30 min).'
            : 'Λάθος! Ο χρόνος δεν είναι δεκαδικός. Το 0,5 της ώρας αντιστοιχεί σε 30 λεπτά και όχι σε 50 λεπτά.')
    },
    {
      id: 'q6',
      type: 'tf',
      title: isEn ? 'Leap Year Properties' : 'Δίσεκτο Έτος',
      text: q6Text,
      correct: q6IsTrue,
      explain: isEn
        ? (q6IsTrue
            ? 'Correct! A leap year has 366 days (February has 29) and occurs every 4 years.'
            : 'False! A leap year has 366 days and February has 29 days.')
        : (q6IsTrue
            ? 'Σωστά! Το δίσεκτο έτος έχει 366 ημέρες (ο Φεβρουάριος έχει 29) και εμφανίζεται κάθε 4 χρόνια.'
            : 'Λάθος! Το δίσεκτο έτος έχει 366 ημέρες και ο Φεβρουάριος έχει 29 ημέρες.')
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Century Calculation' : 'Υπολογισμός Αιώνα',
      prompt: isEn
        ? `In which century does the year ${q7Choice.y} belong? (Type the century number only, e.g. ${q7Choice.cent}):`
        : `Σε ποιον αιώνα ανήκει το έτος ${q7Choice.y}; (Γράψε μόνο τον αριθμό του αιώνα, π.χ. ${q7Choice.cent}):`,
      correct: String(q7Choice.cent),
      explain: isEn
        ? `For year ${q7Choice.y}, take the leading digits (${Math.floor(q7Choice.y / 100)}) and add 1 ➔ ${q7Choice.cent}th century.`
        : `Για το έτος ${q7Choice.y}, παίρνουμε τα πρώτα ψηφία (${Math.floor(q7Choice.y / 100)}) και προσθέτουμε 1 ➔ ${q7Choice.cent}ος αιώνας.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: isEn ? 'Greenwich & Athens Time' : 'Ώρα Greenwich & Αθήνα',
      prompt: isEn
        ? `When it is ${q8GmtHour}:00 at Greenwich, London (UTC 0), what time is it in Athens (UTC＋2)?`
        : `Όταν στο Greenwich του Λονδίνου (UTC 0) είναι ${q8GmtHour}:00, τι ώρα είναι στην Αθήνα (UTC＋2);`,
      options: q8Options,
      correct: q8Correct,
      explain: isEn
        ? `Athens is 2 hours ahead of Greenwich: ${q8GmtHour}:00 ＋ 2 hours ＝ ${q8AthensHour}:00.`
        : `Η Αθήνα είναι 2 ώρες μπροστά από το Greenwich: ${q8GmtHour}:00 ＋ 2 ώρες ＝ ${q8AthensHour}:00.`
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
      hasFractionPrompt: q10Raw.hasFractionPrompt || false,
      fractionProps: q10Raw.fractionProps || null,
      promptPrefix: q10Raw.promptPrefix || '',
      promptSuffix: q10Raw.promptSuffix || '',
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

export default function XronosExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      return cleanUser === cleanTarget;
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
          href="/st-dimotikou/61-xronos"
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
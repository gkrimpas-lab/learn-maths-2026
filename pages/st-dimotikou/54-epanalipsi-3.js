// pages/st-dimotikou/54-epanalipsi-3.js
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΑ COMPONENTS & ΣΥΝΑΡΤΗΣΕΙΣ
// ---------------------------------------------------------

// Εμφάνιση κλάσματος σε κανονική κατακόρυφη μορφή (responsive, ασφαλές για mobile)
function Fraction({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-1 pb-0.5 text-center break-all">
        {num}
      </span>
      <span className="px-1 pt-0.5 text-center break-all">
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

// Δημιουργία 4 εγγυημένα μοναδικών επιλογών για MCQ
function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set([correct]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }

  let counter = 1;
  while (unique.size < 4) {
    const numericMatch = String(correct).match(/\d+/);
    if (numericMatch) {
      const baseNum = parseInt(numericMatch[0], 10);
      const fallbackVal = String(correct).replace(/\d+/, String(Math.max(1, baseNum + counter * 3)));
      unique.add(fallbackVal);
    } else {
      unique.add(`Επιλογή ${counter}`);
    }
    counter++;
  }

  return shuffle(Array.from(unique));
}

// Αφαίρεση τόνων για κεφαλαία (διατηρείται το ΣΤ')
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

// Μορφοποίηση αριθμού ανά locale
function formatNum(val, locale = 'el', decimals = 2) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const targetLocale = locale === 'en' ? 'en-US' : 'el-GR';
  const num = Number(val);
  if (Number.isInteger(num)) {
    return num.toLocaleString(targetLocale);
  }
  return Number(num.toFixed(decimals)).toLocaleString(targetLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

// ---------------------------------------------------------
// ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ ΜΕΤΑΦΡΑΣΕΩΝ (i18n)
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    metaTitle: "3η Επανάληψη: Λόγοι, Αναλογίες & Ποσοστά (Κεφ. 40-53) - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Μεγάλο επαναληπτικό τεστ 28 θεμάτων στα Κεφάλαια 40 έως 53 της ΣΤ' Δημοτικού: Λόγοι, Αναλογίες, Ανάλογα & Αντιστρόφως Ανάλογα Ποσά, Μέθοδος των Τριών και Ποσοστά.",
    backText: "ΣΤ' Δημοτικού",
    badgeChapter: "ΣΤ' ΔΗΜΟΤΙΚΟΥ • 3Η ΜΕΓΑΛΗ ΕΠΑΝΑΛΗΨΗ (ΚΕΦ. 40 - 53)",
    heroTitle: "Επαναληπτικό Διαγώνισμα: Λόγοι, Αναλογίες & Ποσοστά",
    heroDesc: "28 επιλεγμένες δραστηριότητες (ακριβώς 2 από κάθε κεφάλαιο από το 40 έως το 53). Κάθε ανανέωση αντλεί τυχαία θέματα με αυτόματη βαθμολόγηση και αναλυτικές επεξηγήσεις!",
    newTestBtn: "Νέο Τεστ",
    topicPrefix: "Θέμα",
    inputPlaceholder: "Απάντηση...",
    inputPlaceholderDecimal: "π.χ. 12,5",
    tableHeaderElement: "Στοιχείο",
    tableHeaderFormula: "Ανάλυση / Τύπος",
    tableHeaderValue: "Τιμή",
    feedbackSuccess: "🎯 Εξαιρετικά!",
    feedbackExplain: "💡 Επεξήγηση:",
    checkAllBtn: "Έλεγχος Όλων των Απαντήσεων (28 Θέματα)",
    scoreLabel: "Σκορ",
    answeredLabel: "Απαντήθηκαν",
    successRateLabel: "Ποσοστό Επιτυχίας",
    bottomTip: "Απάντησε και στα 28 θέματα και πάτησε «Έλεγχος Όλων των Απαντήσεων (28 Θέματα)»!"
  },
  en: {
    metaTitle: "3rd Review: Ratios, Proportions & Percentages (Ch. 40-53) - Grade 6 | LearnMaths.gr",
    metaDesc: "Comprehensive revision test with 28 questions covering Chapters 40 to 53 for Grade 6: Ratios, Proportions, Direct & Inverse Proportions, Rule of Three, and Percentages.",
    backText: "Grade 6",
    badgeChapter: "GRADE 6 • 3RD MAJOR REVISION (CH. 40 - 53)",
    heroTitle: "Comprehensive Review Exam: Ratios, Proportions & Percentages",
    heroDesc: "28 selected dynamic exercises (exactly 2 from each chapter from 40 to 53). Every reload generates randomized questions with auto-grading and complete solutions!",
    newTestBtn: "New Test",
    topicPrefix: "Question",
    inputPlaceholder: "Answer...",
    inputPlaceholderDecimal: "e.g. 12.5",
    tableHeaderElement: "Element",
    tableHeaderFormula: "Analysis / Formula",
    tableHeaderValue: "Value",
    feedbackSuccess: "🎯 Excellent!",
    feedbackExplain: "💡 Explanation:",
    checkAllBtn: "Check All Answers (28 Questions)",
    scoreLabel: "Score",
    answeredLabel: "Answered",
    successRateLabel: "Success Rate",
    bottomTip: "Answer all 28 questions and click \"Check All Answers (28 Questions)\"!"
  }
};

// =========================================================
// ΔΕΞΑΜΕΝΕΣ 14 ΚΕΦΑΛΑΙΩΝ (ΚΕΦ. 40 ΕΩΣ 53)
// =========================================================

const CHAPTER_POOLS = {
  // ΚΕΦΑΛΑΙΟ 40: ΛΟΓΟΣ 2 ΜΕΓΕΘΩΝ
  40: [
    (locale) => {
      const isEl = locale === 'el';
      const a = randInt(2, 6) * 3;
      const b = randInt(2, 6) * 4;
      const gcd = (x, y) => (!y ? x : gcd(y, x % y));
      const g = gcd(a, b);
      const simpA = a / g;
      const simpB = b / g;
      const correctOpt = `${simpA} : ${simpB}`;
      const wrongOpts = [
        `${simpB} : ${simpA}`,
        `${simpA + 1} : ${simpB}`,
        `${a} : ${b + 2}`
      ];
      return {
        type: 'mcq',
        title: isEl ? 'Κεφάλαιο 40 • Λόγος 2 Μεγεθών' : 'Chapter 40 • Ratio of 2 Quantities',
        prompt: isEl
          ? `Σε μια τάξη υπάρχουν ${a} αγόρια και ${b} κορίτσια. Ποιος είναι ο απλοποιημένος λόγος των αγοριών προς τα κορίτσια;`
          : `In a classroom there are ${a} boys and ${b} girls. What is the simplified ratio of boys to girls?`,
        options: makeUniqueOptions(correctOpt, wrongOpts),
        correct: correctOpt,
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl
                ? `Ο λόγος είναι ${a} : ${b}. Διαιρώντας αριθμητή και παρονομαστή με το ${g}, προκύπτει:`
                : `The ratio is ${a} : ${b}. Dividing both terms by ${g} gives:`}
            </span>
            <Fraction num={a} den={b} />
            <span>＝</span>
            <Fraction num={simpA} den={simpB} />
            <span>(ή ${simpA} : ${simpB}).</span>
          </span>
        )
      };
    },
    (locale) => {
      const isEl = locale === 'el';
      const cm = randInt(20, 80);
      const m = randInt(2, 5);
      const cmTotal = m * 100;
      const val = Number((cm / cmTotal).toFixed(2));
      return {
        type: 'input',
        inputType: 'decimal',
        title: isEl ? 'Κεφάλαιο 40 • Λόγος Ομοειδών Μεγεθών' : 'Chapter 40 • Ratio of Same-Unit Quantities',
        prompt: isEl
          ? `Ποιος είναι ο λόγος του μήκους ${cm} cm προς το μήκος ${m} m σε δεκαδική μορφή;`
          : `What is the ratio of length ${cm} cm to length ${m} m in decimal form?`,
        correct: formatNum(val, locale),
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl
                ? `Μετατρέπουμε τα ${m} m σε εκατοστά: ${cmTotal} cm. Ο λόγος είναι:`
                : `We convert ${m} m into centimeters: ${cmTotal} cm. The ratio is:`}
            </span>
            <Fraction num={cm} den={cmTotal} />
            <span>＝ {formatNum(val, locale)}.</span>
          </span>
        )
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 41: ΑΝΑΛΟΓΙΑ
  41: [
    (locale) => {
      const isEl = locale === 'el';
      const a = randInt(2, 5);
      const b = randInt(6, 9);
      const m = randInt(2, 4);
      const c = a * m;
      const d = b * m;
      const prod = a * d;
      const correctOpt = isEl
        ? `Ναι, γιατί ${a} · ${d} ＝ ${b} · ${c} ＝ ${prod}`
        : `Yes, because ${a} · ${d} ＝ ${b} · ${c} ＝ ${prod}`;
      const wrong1 = isEl ? 'Όχι, γιατί οι αριθμοί είναι διαφορετικοί' : 'No, because the numbers are different';
      const wrong2 = isEl ? 'Μόνο αν τους προσθέσουμε' : 'Only if we add them together';
      const wrong3 = isEl ? 'Όχι, γιατί δεν έχουν ίδιο επόμενο όρο' : 'No, because the subsequent terms differ';
      return {
        type: 'mcq',
        title: isEl ? 'Κεφάλαιο 41 • Έννοια Αναλογίας' : 'Chapter 41 • Concept of Proportion',
        prompt: isEl
          ? `Είναι οι λόγοι ${a} : ${b} και ${c} : ${d} ίσοι ώστε να σχηματίζουν αναλογία;`
          : `Are the ratios ${a} : ${b} and ${c} : ${d} equal, thus forming a proportion?`,
        options: makeUniqueOptions(correctOpt, [wrong1, wrong2, wrong3]),
        correct: correctOpt,
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl ? 'Αναλογία είναι η ισότητα δύο λόγων:' : 'A proportion is the equality of two ratios:'}
            </span>
            <Fraction num={a} den={b} />
            <span>＝</span>
            <Fraction num={c} den={d} />
            <span>({a} · {d} ＝ {b} · {c} ＝ ${prod}).</span>
          </span>
        )
      };
    },
    (locale) => {
      const isEl = locale === 'el';
      const correctOpt = isEl ? 'Το 3 και το 15' : '3 and 15';
      const wrongOpts = isEl
        ? ['Το 5 και το 9', 'Το 3 και το 9', 'Το 5 και το 15']
        : ['5 and 9', '3 and 9', '5 and 15'];
      return {
        type: 'mcq',
        title: isEl ? 'Κεφάλαιο 41 • Όροι Αναλογίας' : 'Chapter 41 • Terms of a Proportion',
        prompt: isEl
          ? 'Στην αναλογία 3 : 5 ＝ 9 : 15, ποιοι είναι οι άκροι όροι;'
          : 'In the proportion 3 : 5 ＝ 9 : 15, which are the extreme terms?',
        options: makeUniqueOptions(correctOpt, wrongOpts),
        correct: correctOpt,
        explain: isEl
          ? 'Στην αναλογία α : β ＝ γ : δ, άκροι όροι είναι οι α και δ (εδώ 3 και 15) και μέσοι όροι οι β και γ (εδώ 5 και 9).'
          : 'In proportion a : b ＝ c : d, the extremes are a and d (here 3 and 15) and means are b and c (here 5 and 9).'
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 42: ΑΝΑΛΟΓΙΑ ΧΙΑΣΤΙ
  42: [
    (locale) => {
      const isEl = locale === 'el';
      const a = randInt(2, 5);
      const b = randInt(6, 10);
      const m = randInt(2, 4);
      const c = a * m;
      const d = b * m;
      const bc = b * c;
      return {
        type: 'input',
        inputType: 'number',
        title: isEl ? 'Κεφάλαιο 42 • Χιαστί Πολλαπλασιασμός' : 'Chapter 42 • Cross-Multiplication',
        prompt: isEl
          ? `Στην αναλογία ${a} : ${b} ＝ ${c} : x, ποια είναι η τιμή του x;`
          : `In the proportion ${a} : ${b} ＝ ${c} : x, what is the value of x?`,
        correct: String(d),
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>x ＝</span>
            <Fraction num={`${b} · ${c}`} den={a} />
            <span>＝</span>
            <Fraction num={bc} den={a} />
            <span>＝ {d}.</span>
          </span>
        )
      };
    },
    (locale) => {
      const isEl = locale === 'el';
      const correctOpt = '30';
      const wrongOpts = ['20', '15', '12'];
      return {
        type: 'mcq',
        title: isEl ? 'Κεφάλαιο 42 • Σταυρωτά Γινόμενα' : 'Chapter 42 • Cross Products',
        prompt: isEl
          ? 'Στην αναλογία 2 : 5 ＝ 6 : 15, πόσο ισούται το σταυρωτό γινόμενο;'
          : 'In the proportion 2 : 5 ＝ 6 : 15, what is the value of the cross product?',
        options: makeUniqueOptions(correctOpt, wrongOpts),
        correct: correctOpt,
        explain: '2 · 15 ＝ 30 & 5 · 6 ＝ 30.'
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 43: ΣΤΑΘΕΡΑ ΚΑΙ ΜΕΤΑΒΛΗΤΑ ΠΟΣΑ
  43: [
    (locale) => {
      const isEl = locale === 'el';
      const correctOpt = isEl
        ? 'Ο αριθμός των ημερών του μήνα Ιανουαρίου (πάντα 31)'
        : 'The number of days in January (always 31)';
      const wrongOpts = isEl
        ? [
            'Η θερμοκρασία της πόλης στη διάρκεια της ημέρας',
            'Το ύψος ενός παιδιού καθώς μεγαλώνει',
            'Η ταχύτητα ενός αυτοκινήτου στην εθνική οδό'
          ]
        : [
            'The city temperature throughout the day',
            'The height of a child as they grow',
            'The speed of a car on the highway'
          ];
      return {
        type: 'mcq',
        title: isEl ? 'Κεφάλαιο 43 • Σταθερά & Μεταβλητά Ποσά' : 'Chapter 43 • Constant & Variable Quantities',
        prompt: isEl
          ? 'Ποιο από τα παρακάτω αποτελεί ΣΤΑΘΕΡΟ ποσό;'
          : 'Which of the following represents a CONSTANT quantity?',
        options: makeUniqueOptions(correctOpt, wrongOpts),
        correct: correctOpt,
        explain: isEl
          ? 'Σταθερό ποσό είναι εκείνο του οποίου η τιμή δεν αλλάζει ποτέ (όπως οι 31 ημέρες του Ιανουαρίου).'
          : 'A constant quantity is one whose value never changes (such as the 31 days of January).'
      };
    },
    (locale) => {
      const isEl = locale === 'el';
      const correctOpt = isEl
        ? 'Η ποσότητα βενζίνης στο ρεζερβουάρ ενός αυτοκινήτου καθώς ταξιδεύει'
        : 'The amount of fuel in a car tank as it travels';
      const wrongOpts = isEl
        ? [
            'Ο αριθμός των μηνών του έτους',
            'Η περίμετρος ενός σταθερού τετραγώνου πλευράς 5 cm',
            'Ο αριθμός των ωρών μιας ημέρας'
          ]
        : [
            'The number of months in a year',
            'The perimeter of a fixed square with side 5 cm',
            'The number of hours in a day'
          ];
      return {
        type: 'mcq',
        title: isEl ? 'Κεφάλαιο 43 • Μεταβλητό Ποσό' : 'Chapter 43 • Variable Quantity',
        prompt: isEl
          ? 'Ποιο από τα παρακάτω είναι μεταβλητό ποσό;'
          : 'Which of the following is a variable quantity?',
        options: makeUniqueOptions(correctOpt, wrongOpts),
        correct: correctOpt,
        explain: isEl
          ? 'Η ποσότητα καυσίμου αλλάζει συνεχώς κατά την οδήγηση, άρα είναι μεταβλητό μέγεθος.'
          : 'Fuel quantity continually changes while driving, making it a variable quantity.'
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 44: ΑΝΑΛΟΓΑ ΠΟΣΑ
  44: [
    (locale) => {
      const isEl = locale === 'el';
      const unit = randInt(3, 7);
      const x1 = 2;
      const y1 = x1 * unit;
      const x2 = 5;
      const y2 = x2 * unit;
      return {
        type: 'input',
        inputType: 'number',
        title: isEl ? 'Κεφάλαιο 44 • Σταθερό Πηλίκο Ανάλογων Ποσών' : 'Chapter 44 • Constant Ratio in Direct Proportion',
        prompt: isEl
          ? `Σε δύο ανάλογα ποσά, όταν x ＝ ${x1} το y ＝ ${y1} και όταν x ＝ ${x2} το y ＝ ${y2}. Ποιο είναι το σταθερό πηλίκο λ (όπου λ ＝ y : x);`
          : `For two directly proportional quantities, when x ＝ ${x1} then y ＝ ${y1}, and when x ＝ ${x2} then y ＝ ${y2}. What is the constant ratio k (where k ＝ y : x)?`,
        correct: String(unit),
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{isEl ? 'Σταθερό πηλίκο:' : 'Constant ratio:'} λ ＝</span>
            <Fraction num="y" den="x" />
            <span>＝</span>
            <Fraction num={y1} den={x1} />
            <span>＝ ${unit}.</span>
          </span>
        )
      };
    },
    (locale) => {
      const isEl = locale === 'el';
      const correctOpt = isEl
        ? 'Ευθεία γραμμή που διέρχεται από την αρχή των αξόνων (0, 0)'
        : 'A straight line passing through the origin (0, 0)';
      const wrongOpts = isEl
        ? [
            'Καμπύλη γραμμή που δεν περνάει από το (0, 0)',
            'Κύκλος γύρω από το (0, 0)',
            'Τεθλασμένη γραμμή'
          ]
        : [
            'A curved line that does not pass through (0, 0)',
            'A circle around (0, 0)',
            'A broken zigzag line'
          ];
      return {
        type: 'mcq',
        title: isEl ? 'Κεφάλαιο 44 • Γραφική Παράσταση Ανάλογων Ποσών' : 'Chapter 44 • Graph of Directly Proportional Quantities',
        prompt: isEl
          ? 'Ποια είναι η μορφή της γραφικής παράστασης δύο ανάλογων ποσών;'
          : 'What does the graph of two directly proportional quantities look like?',
        options: makeUniqueOptions(correctOpt, wrongOpts),
        correct: correctOpt,
        explain: isEl
          ? 'Η γραφική παράσταση ανάλογων ποσών είναι πάντα ευθεία που περνάει από το σημείο (0, 0).'
          : 'The graph of directly proportional quantities is always a straight line passing through the origin (0, 0).'
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 45: ΠΡΟΒΛΗΜΑΤΑ ΜΕ ΑΝΑΛΟΓΑ ΠΟΣΑ
  45: [
    (locale) => {
      const isEl = locale === 'el';
      const kg1 = randInt(2, 4);
      const costKg = randInt(3, 6);
      const total1 = kg1 * costKg;
      const kg2 = kg1 + randInt(3, 6);
      const total2 = kg2 * costKg;
      return {
        type: 'input',
        inputType: 'number',
        title: isEl ? 'Κεφάλαιο 45 • Πρόβλημα Ανάλογων Ποσών' : 'Chapter 45 • Direct Proportion Word Problem',
        prompt: isEl
          ? `Αν ${kg1} kg μήλα κοστίζουν ${total1} €, πόσα € κοστίζουν ${kg2} kg από τα ίδια μήλα; (γράψε μόνο τον αριθμό)`
          : `If ${kg1} kg of apples cost ${total1} €, how much do ${kg2} kg of the same apples cost in euros (€)? (write only the number)`,
        correct: String(total2),
        tableData: [
          { item: isEl ? 'Πρώτη αγορά' : 'First purchase', formula: `${kg1} kg ➔ ${total1} €`, val: `${total1} €` },
          { item: isEl ? 'Δεύτερη αγορά' : 'Second purchase', formula: `${kg2} kg ➔ x €`, val: 'x €' },
          {
            item: isEl ? 'Υπολογισμός χιαστί' : 'Cross-multiplication',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={`${total1} · ${kg2}`} den={kg1} />
              </span>
            ),
            val: `${total2} €`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl ? 'Το 1 kg κοστίζει:' : '1 kg costs:'}
            </span>
            <Fraction num={total1} den={kg1} />
            <span>＝ {costKg} €. {isEl ? `Τα ${kg2} kg κοστίζουν:` : `Thus ${kg2} kg cost:`} ${kg2} · ${costKg} ＝ ${total2} €.</span>
          </span>
        )
      };
    },
    (locale) => {
      const isEl = locale === 'el';
      const h1 = 2;
      const km1 = 140;
      const h2 = 5;
      const speed = km1 / h1;
      const km2 = speed * h2;
      return {
        type: 'input',
        inputType: 'number',
        title: isEl ? 'Κεφάλαιο 45 • Απόσταση και Χρόνος' : 'Chapter 45 • Distance and Time',
        prompt: isEl
          ? `Ένα αυτοκίνητο διανύει ${km1} km σε ${h1} ώρες. Πόσα km θα διανύσει σε ${h2} ώρες με σταθερή ταχύτητα; (γράψε μόνο τον αριθμό)`
          : `A car travels ${km1} km in ${h1} hours. How many km will it travel in ${h2} hours at constant speed? (write only the number)`,
        correct: String(km2),
        tableData: [
          {
            item: isEl ? 'Ταχύτητα (km/h)' : 'Speed (km/h)',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={km1} den={h1} />
              </span>
            ),
            val: '70 km/h'
          },
          { item: isEl ? 'Συνολική απόσταση' : 'Total distance', formula: `${h2} · 70`, val: `${km2} km` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl ? 'Σε 1 ώρα διανύει:' : 'In 1 hour it travels:'}
            </span>
            <Fraction num={km1} den={h1} />
            <span>＝ 70 km. {isEl ? `Σε ${h2} ώρες διανύει:` : `In ${h2} hours:`} ${h2} · 70 ＝ ${km2} km.</span>
          </span>
        )
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 46: ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΑ ΠΟΣΑ
  46: [
    (locale) => {
      const isEl = locale === 'el';
      const x = randInt(3, 6);
      const y = randInt(8, 12);
      const alpha = x * y;
      return {
        type: 'input',
        inputType: 'number',
        title: isEl ? 'Κεφάλαιο 46 • Σταθερό Γινόμενο Αντιστρόφων' : 'Chapter 46 • Constant Product in Inverse Proportion',
        prompt: isEl
          ? `Σε δύο αντιστρόφως ανάλογα ποσά, όταν x ＝ ${x} τότε y ＝ ${y}. Ποιο είναι το σταθερό γινόμενο α;`
          : `For two inversely proportional quantities, when x ＝ ${x} then y ＝ ${y}. What is the constant product a?`,
        correct: String(alpha),
        explain: `α ＝ x · y ＝ ${x} · ${y} ＝ ${alpha}.`
      };
    },
    (locale) => {
      const isEl = locale === 'el';
      const correctOpt = isEl
        ? 'Καμπύλη γραμμή που ονομάζεται υπερβολή και δεν περνάει από το (0, 0)'
        : 'A curve called a hyperbola that never passes through (0, 0)';
      const wrongOpts = isEl
        ? [
            'Ευθεία γραμμή που διέρχεται από το (0, 0)',
            'Κύκλος γύρω από τους άξονες',
            'Ευθεία παράλληλη στον άξονα x'
          ]
        : [
            'A straight line passing through (0, 0)',
            'A circle around the axes',
            'A line parallel to the x-axis'
          ];
      return {
        type: 'mcq',
        title: isEl ? 'Κεφάλαιο 46 • Γραφική Παράσταση Αντιστρόφων' : 'Chapter 46 • Graph of Inversely Proportional Quantities',
        prompt: isEl
          ? 'Ποια είναι η μορφή της γραφικής παράστασης δύο αντιστρόφως ανάλογων ποσών;'
          : 'What is the shape of the graph of two inversely proportional quantities?',
        options: makeUniqueOptions(correctOpt, wrongOpts),
        correct: correctOpt,
        explain: isEl
          ? 'Η γραφική παράσταση των αντιστρόφως ανάλογων ποσών είναι καμπύλη υπερβολή που δεν αγγίζει ποτέ τους άξονες.'
          : 'The graph of inversely proportional quantities is a hyperbola that never intersects the coordinate axes.'
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 47: ΠΡΟΒΛΗΜΑΤΑ ΜΕ ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΑ ΠΟΣΑ
  47: [
    (locale) => {
      const isEl = locale === 'el';
      const w1 = randInt(2, 4);
      const d1 = randInt(6, 12);
      const total = w1 * d1;
      const w2 = w1 + 2;
      const d2 = total / w2;
      const cleanD2 = Number.isInteger(d2) ? d2 : Number(d2.toFixed(1));
      return {
        type: 'input',
        inputType: 'decimal',
        title: isEl ? 'Κεφάλαιο 47 • Πρόβλημα Αντιστρόφων Ποσών' : 'Chapter 47 • Inverse Proportion Word Problem',
        prompt: isEl
          ? `${w1} εργάτες τελειώνουν ένα έργο σε ${d1} ημέρες. Σε πόσες ημέρες θα ολοκληρώσουν το ίδιο έργο ${w2} εργάτες; (γράψε μόνο τον αριθμό)`
          : `${w1} workers complete a task in ${d1} days. In how many days will ${w2} workers complete the same task? (write only the number)`,
        correct: formatNum(cleanD2, locale),
        tableData: [
          {
            item: isEl ? 'Σταθερό γινόμενο (έργο)' : 'Constant product (total work)',
            formula: `${w1} · ${d1}`,
            val: `${total} ${isEl ? 'μεροκάματα' : 'man-days'}`
          },
          {
            item: isEl ? 'Νέος χρόνος' : 'New time',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={total} den={w2} />
              </span>
            ),
            val: `${formatNum(cleanD2, locale)} ${isEl ? 'ημέρες' : 'days'}`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl ? `Σταθερό γινόμενο: ${w1} · ${d1} ＝ ${total}. Για ${w2} εργάτες:` : `Constant product: ${w1} · ${d1} ＝ ${total}. For ${w2} workers:`}
            </span>
            <Fraction num={total} den={w2} />
            <span>＝ {formatNum(cleanD2, locale)} {isEl ? 'ημέρες.' : 'days.'}</span>
          </span>
        )
      };
    },
    (locale) => {
      const isEl = locale === 'el';
      const correctOpt = isEl
        ? 'Οριζόντιο πολλαπλασιασμό (x₁ · y₁ ＝ x₂ · y₂)'
        : 'Horizontal multiplication (x₁ · y₁ ＝ x₂ · y₂)';
      const wrongOpts = isEl
        ? [
            'Σταυρωτό πολλαπλασιασμό (χιαστί)',
            'Πρόσθεση των στηλών',
            'Διαίρεση των αθροισμάτων'
          ]
        : [
            'Cross-multiplication',
            'Addition of column values',
            'Division of totals'
          ];
      return {
        type: 'mcq',
        title: isEl ? 'Κεφάλαιο 47 • Μέθοδος Επίλυσης Αντιστρόφων' : 'Chapter 47 • Solving Method for Inverse Proportions',
        prompt: isEl
          ? 'Σε έναν πίνακα αντιστρόφως ανάλογων ποσών, ποια πράξη εκτελούμε ανάμεσα στις τιμές των δύο στηλών;'
          : 'In a table of inversely proportional quantities, what calculation do we perform between corresponding values?',
        options: makeUniqueOptions(correctOpt, wrongOpts),
        correct: correctOpt,
        explain: isEl
          ? 'Στα αντιστρόφως ανάλογα ποσά τα οριζόντια γινόμενα των αντίστοιχων τιμών είναι πάντοτε ίσα.'
          : 'In inversely proportional quantities, horizontal products of corresponding values are always equal.'
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 48: ΜΕΘΟΔΟΣ ΤΩΝ ΤΡΙΩΝ (ΑΝΑΛΟΓΑ ΠΟΣΑ)
  48: [
    (locale) => {
      const isEl = locale === 'el';
      const a = randInt(3, 5);
      const b = randInt(12, 20);
      const c = a * 2;
      const d = b * 2;
      const bc = b * c;
      return {
        type: 'input',
        inputType: 'number',
        title: isEl ? 'Κεφάλαιο 48 • Μέθοδος των Τριών (Ανάλογα)' : 'Chapter 48 • Rule of Three (Direct)',
        prompt: isEl
          ? `Σε πρόβλημα ανάλογων ποσών: τα ${a} m υφάσματος κοστίζουν ${b} €. Πόσο κοστίζουν τα ${c} m (x); (γράψε μόνο τον αριθμό)`
          : `In a direct proportion problem: ${a} m of fabric cost ${b} €. How much do ${c} m cost (x) in euros? (write only the number)`,
        correct: String(d),
        tableData: [
          { item: isEl ? 'Κατάταξη' : 'Arrangement', formula: `${a} m ➔ ${b} € | ${c} m ➔ x €`, val: isEl ? 'Ανάλογα ποσά' : 'Directly proportional' },
          {
            item: isEl ? 'Χιαστί υπολογισμός' : 'Cross calculation',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={`${b} · ${c}`} den={a} />
              </span>
            ),
            val: `${d} €`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{isEl ? 'Ποσά ανάλογα (χιαστί): x ＝' : 'Directly proportional (cross): x ＝'}</span>
            <Fraction num={`${b} · ${c}`} den={a} />
            <span>＝</span>
            <Fraction num={bc} den={a} />
            <span>＝ {d} €.</span>
          </span>
        )
      };
    },
    (locale) => {
      const isEl = locale === 'el';
      const correctOpt = isEl
        ? 'Επειδή γνωρίζουμε 3 όρους και ψάχνουμε τον 4ο άγνωστο'
        : 'Because we know 3 terms and solve for the 4th unknown';
      const wrongOpts = isEl
        ? [
            'Επειδή χρησιμοποιεί 3 πίνακες',
            'Επειδή περιέχει 3 διαφορετικά ποσά',
            'Επειδή λύνεται πάντοτε σε 3 βήματα'
          ]
        : [
            'Because it uses 3 tables',
            'Because it contains 3 distinct quantities',
            'Because it is always solved in 3 steps'
          ];
      return {
        type: 'mcq',
        title: isEl ? 'Κεφάλαιο 48 • Ονομασία της Μεθόδου των Τριών' : 'Chapter 48 • Origin of "Rule of Three"',
        prompt: isEl
          ? 'Γιατί η μέθοδος ονομάζεται «Απλή Μέθοδος των Τριών»;'
          : 'Why is this method called the "Simple Rule of Three"?',
        options: makeUniqueOptions(correctOpt, wrongOpts),
        correct: correctOpt,
        explain: isEl
          ? 'Δίνονται τρεις γνωστοί όροι ανάμεσα σε δύο ποσά και ζητείται ο τέταρτος.'
          : 'Three known values are given between two quantities to determine the fourth.'
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 49: ΜΕΘΟΔΟΣ ΤΩΝ ΤΡΙΩΝ (ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΑ ΠΟΣΑ)
  49: [
    (locale) => {
      const isEl = locale === 'el';
      const sp1 = 60;
      const t1 = randInt(3, 5);
      const dist = sp1 * t1;
      const sp2 = 90;
      const t2 = dist / sp2;
      const cleanT2 = Number.isInteger(t2) ? t2 : Number(t2.toFixed(1));
      return {
        type: 'input',
        inputType: 'decimal',
        title: isEl ? 'Κεφάλαιο 49 • Μέθοδος των Τριών (Αντίστροφα)' : 'Chapter 49 • Rule of Three (Inverse)',
        prompt: isEl
          ? `Με ταχύτητα ${sp1} km/h απαιτούνται ${t1} ώρες. Πόσες ώρες (x) απαιτούνται με ταχύτητα ${sp2} km/h; (γράψε μόνο τον αριθμό)`
          : `At speed ${sp1} km/h it takes ${t1} hours. How many hours (x) are required at speed ${sp2} km/h? (write only the number)`,
        correct: formatNum(cleanT2, locale),
        tableData: [
          { item: isEl ? 'Κατάταξη' : 'Arrangement', formula: `${sp1} km/h ➔ ${t1} h | ${sp2} km/h ➔ x h`, val: isEl ? 'Αντιστρόφως ανάλογα' : 'Inversely proportional' },
          {
            item: isEl ? 'Οριζόντιο γινόμενο' : 'Horizontal product',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={`${sp1} · ${t1}`} den={sp2} />
              </span>
            ),
            val: `${formatNum(cleanT2, locale)} h`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{isEl ? 'Αντιστρόφως ανάλογα (οριζόντια γινόμενα): x ＝' : 'Inversely proportional: x ＝'}</span>
            <Fraction num={`${sp1} · ${t1}`} den={sp2} />
            <span>＝</span>
            <Fraction num={dist} den={sp2} />
            <span>＝ {formatNum(cleanT2, locale)} {isEl ? 'ώρες.' : 'hours.'}</span>
          </span>
        )
      };
    },
    (locale) => {
      const isEl = locale === 'el';
      const correctOpt = isEl
        ? 'Να ελέγξουμε αν τα ποσά είναι ανάλογα ή αντιστρόφως ανάλογα'
        : 'To verify whether quantities are directly or inversely proportional';
      const wrongOpts = isEl
        ? [
            'Να προσθέσουμε όλα τα δεδομένα',
            'Να κάνουμε αμέσως χιαστί πολλαπλασιασμό',
            'Να μετατρέψουμε όλους τους αριθμούς σε κλάσματα'
          ]
        : [
            'To sum up all given data',
            'To immediately cross-multiply',
            'To convert all numbers to fractions'
          ];
      return {
        type: 'mcq',
        title: isEl ? 'Κεφάλαιο 49 • Έλεγχος Ποσών στη Μέθοδο των Τριών' : 'Chapter 49 • Critical Step in Rule of Three',
        prompt: isEl
          ? 'Ποιο είναι το πιο κρίσιμο βήμα στη μέθοδο των τριών πριν κάνουμε πράξεις;'
          : 'What is the most critical step in the rule of three before doing calculations?',
        options: makeUniqueOptions(correctOpt, wrongOpts),
        correct: correctOpt,
        explain: isEl
          ? 'Ο έλεγχος του είδους των ποσών καθορίζει αν θα εφαρμόσουμε χιαστί (ανάλογα) ή οριζόντιο πολλαπλασιασμό (αντίστροφα).'
          : 'Checking proportionality type determines whether we cross-multiply (direct) or multiply horizontally (inverse).'
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 50: ΠΟΣΟΣΤΑ
  50: [
    (locale) => {
      const isEl = locale === 'el';
      const preset = pickRandom([
        { num: 1, den: 4, pct: 25 },
        { num: 3, den: 4, pct: 75 },
        { num: 2, den: 5, pct: 40 },
        { num: 7, den: 10, pct: 70 }
      ]);
      return {
        type: 'input',
        inputType: 'number',
        title: isEl ? 'Κεφάλαιο 50 • Μετατροπή Κλάσματος σε Ποσοστό' : 'Chapter 50 • Fraction to Percentage Conversion',
        prompt: (
          <span className="inline-flex items-center flex-wrap gap-1">
            <span>{isEl ? 'Σε ποιο ποσοστό στα εκατό (%) αντιστοιχεί το κλάσμα' : 'What percentage (%) corresponds to fraction'}</span>
            <Fraction num={preset.num} den={preset.den} />
            <span>; {isEl ? '(γράψε μόνο τον αριθμό)' : '(write only the number)'}</span>
          </span>
        ),
        correct: String(preset.pct),
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <Fraction num={preset.num} den={preset.den} />
            <span>· 100 ＝ {preset.pct} %.</span>
          </span>
        )
      };
    },
    (locale) => {
      const isEl = locale === 'el';
      const correctOpt = '50 ‰';
      const wrongOpts = ['5 ‰', '500 ‰', '0,5 ‰'];
      return {
        type: 'mcq',
        title: isEl ? 'Κεφάλαιο 50 • Σχέση στα Εκατό και στα Χίλια' : 'Chapter 50 • Per Hundred and Per Thousand',
        prompt: isEl
          ? 'Σε πόσα στα χίλια (‰) αντιστοιχεί το ποσοστό 5 %;'
          : 'How many per thousand (‰) correspond to 5 %?',
        options: makeUniqueOptions(correctOpt, wrongOpts),
        correct: correctOpt,
        explain: '1 % ＝ 10 ‰, άρα 5 % ＝ 50 ‰.'
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 51: ΠΡΟΒΛΗΜΑΤΑ ΜΕ ΠΟΣΟΣΤΑ
  51: [
    (locale) => {
      const isEl = locale === 'el';
      const orig = randInt(4, 8) * 20;
      const pct = pickRandom([10, 20, 25]);
      const disc = (orig * pct) / 100;
      const finalP = orig - disc;
      const prod = orig * pct;
      return {
        type: 'input',
        inputType: 'number',
        title: isEl ? 'Κεφάλαιο 51 • Τελική Τιμή μετά από Έκπτωση' : 'Chapter 51 • Final Price After Discount',
        prompt: isEl
          ? `Ένα προϊόν κοστίζει ${formatNum(orig, locale)} € και έχει έκπτωση ${pct} %. Πόσα € θα πληρώσει ο πελάτης; (γράψε μόνο τον αριθμό)`
          : `An item costs ${formatNum(orig, locale)} € and has a ${pct} % discount. How much will the customer pay in euros (€)? (write only the number)`,
        correct: String(finalP),
        tableData: [
          { item: isEl ? 'Αρχική τιμή' : 'Original price', formula: `${formatNum(orig, locale)} €`, val: `${formatNum(orig, locale)} €` },
          {
            item: isEl ? 'Έκπτωση' : 'Discount',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={`${formatNum(orig, locale)} · ${pct}`} den="100" />
              </span>
            ),
            val: `${formatNum(disc, locale)} €`
          },
          { item: isEl ? 'Τελική τιμή' : 'Final price', formula: `${formatNum(orig, locale)} － ${formatNum(disc, locale)}`, val: `${formatNum(finalP, locale)} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{isEl ? 'Έκπτωση:' : 'Discount:'}</span>
            <Fraction num={`${formatNum(orig, locale)} · ${pct}`} den="100" />
            <span>＝</span>
            <Fraction num={prod} den="100" />
            <span>
              ＝ {formatNum(disc, locale)} €. {isEl ? 'Τελική τιμή:' : 'Final price:'} {formatNum(orig, locale)} － {formatNum(disc, locale)} ＝ {formatNum(finalP, locale)} €.
            </span>
          </span>
        )
      };
    },
    (locale) => {
      const isEl = locale === 'el';
      const orig = 200;
      const vat = 24;
      const finalVat = orig * 1.24;
      return {
        type: 'input',
        inputType: 'number',
        title: isEl ? 'Κεφάλαιο 51 • Τελική Τιμή με Φ.Π.Α.' : 'Chapter 51 • Final Price with VAT',
        prompt: isEl
          ? `Ένα είδος έχει καθαρή αξία ${orig} € και επιβαρύνεται με Φ.Π.Α. ${vat} %. Ποια είναι η τελική τιμή σε €; (γράψε μόνο τον αριθμό)`
          : `An item has a net value of ${orig} € and is subject to ${vat} % VAT. What is the final price in euros (€)? (write only the number)`,
        correct: String(finalVat),
        tableData: [
          { item: isEl ? 'Καθαρή αξία' : 'Net value', formula: `${orig} €`, val: `${orig} €` },
          {
            item: isEl ? 'Φόρος Φ.Π.Α. (24%)' : 'VAT (24%)',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={`${orig} · 24`} den="100" />
              </span>
            ),
            val: '48 €'
          },
          { item: isEl ? 'Τελική τιμή με φόρο' : 'Final price with tax', formula: `${orig} ＋ 48`, val: `${finalVat} €` }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{isEl ? 'Φόρος:' : 'Tax:'}</span>
            <Fraction num={`${orig} · 24`} den="100" />
            <span>＝ 48 €. {isEl ? 'Τελική τιμή:' : 'Final price:'} ${orig} ＋ 48 ＝ ${finalVat} €.</span>
          </span>
        )
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 52: ΕΥΡΕΣΗ ΑΡΧΙΚΗΣ ΤΙΜΗΣ
  52: [
    (locale) => {
      const isEl = locale === 'el';
      const origPrice = pickRandom([50, 80, 100, 120]);
      const discPct = 20;
      const finalPrice = origPrice * 0.8;
      const remainingPct = 100 - discPct;
      const prod = finalPrice * 100;
      return {
        type: 'input',
        inputType: 'number',
        title: isEl ? 'Κεφάλαιο 52 • Εύρεση Αρχικής Τιμής' : 'Chapter 52 • Finding Original Price',
        prompt: isEl
          ? `Ένα παντελόνι πωλείται στις εκπτώσεις προς ${formatNum(finalPrice, locale)} € με έκπτωση ${discPct} %. Ποια ήταν η αρχική τιμή του σε €; (γράψε μόνο τον αριθμό)`
          : `A pair of trousers is sold on sale for ${formatNum(finalPrice, locale)} € with a ${discPct} % discount. What was its original price in euros (€)? (write only the number)`,
        correct: String(origPrice),
        tableData: [
          { item: isEl ? 'Ποσοστό τελικής τιμής' : 'Final price percentage', formula: '100 % － 20 %', val: `${remainingPct} %` },
          {
            item: isEl ? 'Αρχική τιμή (100%)' : 'Original price (100%)',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={`${formatNum(finalPrice, locale)} · 100`} den={remainingPct} />
              </span>
            ),
            val: `${origPrice} €`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl
                ? `Η τελική τιμή αντιστοιχεί στο ${remainingPct} % της αρχικής. Αρχική τιμή:`
                : `The final price represents ${remainingPct} % of the original. Original price:`}
            </span>
            <Fraction num={`${formatNum(finalPrice, locale)} · 100`} den={remainingPct} />
            <span>＝</span>
            <Fraction num={prod} den={remainingPct} />
            <span>＝ {origPrice} €.</span>
          </span>
        )
      };
    },
    (locale) => {
      const isEl = locale === 'el';
      const correctOpt = isEl
        ? 'Διαιρούμε την τελική τιμή με το 0,80 (δηλαδή 80 : 0,80 ＝ 100 €)'
        : 'Divide the final price by 0.80 (i.e. 80 : 0.80 ＝ 100 €)';
      const wrongOpts = isEl
        ? [
            'Προσθέτουμε 20 % στα 80 € (δηλαδή 80 ＋ 16 ＝ 96 €)',
            'Προσθέτουμε 20 € στα 80 € (δηλαδή 100 € κατά τύχη)',
            'Πολλαπλασιάζουμε 80 επί 1,20'
          ]
        : [
            'Add 20 % to 80 € (i.e. 80 ＋ 16 ＝ 96 €)',
            'Add 20 € to 80 € (i.e. 100 € by coincidence)',
            'Multiply 80 by 1.20'
          ];
      return {
        type: 'mcq',
        title: isEl ? 'Κεφάλαιο 52 • Η Παγίδα της Αρχικής Τιμής' : 'Chapter 52 • Original Price Fallacy',
        prompt: isEl
          ? 'Αν πληρώσαμε 80 € μετά από έκπτωση 20 %, πώς βρίσκουμε την αρχική τιμή;'
          : 'If we paid 80 € after a 20 % discount, how do we find the original price?',
        options: makeUniqueOptions(correctOpt, wrongOpts),
        correct: correctOpt,
        explain: isEl
          ? 'Η έκπτωση υπολογίστηκε στην αρχική τιμή, άρα τα 80 € είναι το 80 % της αρχικής τιμής (80 : 0,80 ＝ 100 €).'
          : 'The discount was calculated on the original price, so 80 € is 80 % of the original value (80 : 0.80 ＝ 100 €).'
      };
    }
  ],

  // ΚΕΦΑΛΑΙΟ 53: ΞΕΡΩ ΑΡΧΙΚΗ ΚΑΙ ΤΕΛΙΚΗ ΤΙΜΗ - ΕΥΡΕΣΗ ΠΟΣΟΣΤΟΥ
  53: [
    (locale) => {
      const isEl = locale === 'el';
      const orig = pickRandom([50, 80, 100, 120]);
      const pct = 25;
      const finalP = orig * 0.75;
      const diff = orig - finalP;
      return {
        type: 'input',
        inputType: 'number',
        title: isEl ? 'Κεφάλαιο 53 • Εύρεση Ποσοστού Μεταβολής' : 'Chapter 53 • Finding Percentage Change',
        prompt: isEl
          ? `Ένα είδος από ${formatNum(orig, locale)} € πωλείται τελικά προς ${formatNum(finalP, locale)} €. Ποιο είναι το ποσοστό έκπτωσης (%) που έγινε; (γράψε μόνο τον αριθμό)`
          : `An item originally costing ${formatNum(orig, locale)} € is finally sold for ${formatNum(finalP, locale)} €. What discount percentage (%) was applied? (write only the number)`,
        correct: String(pct),
        tableData: [
          { item: isEl ? 'Ποσό έκπτωσης' : 'Discount amount', formula: `${formatNum(orig, locale)} － ${formatNum(finalP, locale)}`, val: `${formatNum(diff, locale)} €` },
          {
            item: isEl ? 'Ποσοστό επί της αρχικής' : 'Percentage on original',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={formatNum(diff, locale)} den={formatNum(orig, locale)} />
                <span>· 100</span>
              </span>
            ),
            val: `${pct} %`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl ? 'Διαφορά:' : 'Difference:'} {formatNum(orig, locale)} － {formatNum(finalP, locale)} ＝ {formatNum(diff, locale)} €.
              {' '}{isEl ? 'Ποσοστό επί της αρχικής τιμής:' : 'Percentage on original price:'}
            </span>
            <Fraction num={formatNum(diff, locale)} den={formatNum(orig, locale)} />
            <span>· 100 ＝ {pct} %.</span>
          </span>
        )
      };
    },
    (locale) => {
      const isEl = locale === 'el';
      const correctOpt = isEl
        ? 'Πάντοτε στην αρχική τιμή (βάση 100%)'
        : 'Always on the original price (100% baseline)';
      const wrongOpts = isEl
        ? [
            'Πάντοτε στην τελική τιμή',
            'Στη διαφορά των δύο τιμών',
            'Στο μέσο όρο των δύο τιμών'
          ]
        : [
            'Always on the final price',
            'On the difference between both prices',
            'On the average of both prices'
          ];
      return {
        type: 'mcq',
        title: isEl ? 'Κεφάλαιο 53 • Βάση Υπολογισμού Ποσοστού' : 'Chapter 53 • Base of Percentage Calculation',
        prompt: isEl
          ? 'Σε ποια τιμή υπολογίζουμε το ποσοστό κέρδους ή έκπτωσης;'
          : 'On which price do we calculate the profit or discount percentage?',
        options: makeUniqueOptions(correctOpt, wrongOpts),
        correct: correctOpt,
        explain: isEl
          ? 'Η αρχική τιμή αποτελεί πάντοτε τη βάση σύγκρισης (το 100 %).'
          : 'The original price is always the baseline of comparison (100 %).'
      };
    }
  ]
};

// Δημιουργία των 28 ερωτήσεων (ακριβώς 2 από κάθε κεφάλαιο από το 40 έως το 53)
function generateRevisionQuestions(locale = 'el') {
  const selectedQuestions = [];

  for (let ch = 40; ch <= 53; ch++) {
    const pool = CHAPTER_POOLS[ch];
    if (pool && pool.length >= 2) {
      const shuffled = shuffle(pool);
      const q1 = shuffled[0](locale);
      const q2 = shuffled[1](locale);
      selectedQuestions.push({ ...q1, chapter: ch });
      selectedQuestions.push({ ...q2, chapter: ch });
    }
  }

  return selectedQuestions.map((q, idx) => ({
    ...q,
    id: `rev3_${idx + 1}`
  }));
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function RevisionThreePage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale] || TRANSLATIONS.el;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateRevisionQuestions(locale);
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/[%€]/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/[%€]/g, '').trim().toLowerCase();

      if (cleanUser === cleanTarget) return true;

      const numUser = parseFloat(cleanUser.replace(',', '.'));
      const numTarget = parseFloat(cleanTarget.replace(',', '.'));
      return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) < 0.05;
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
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={false}
      hideFooter={true}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 box-border">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200 break-words [overflow-wrap:anywhere]">
                <span>{t.badgeChapter}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
                {t.heroTitle}
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.heroDesc}
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase(t.newTestBtn)}</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΙΣ 28 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 overflow-hidden ${getCardStyle(q)}`}
                >
                  <div className="min-w-0">
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words [overflow-wrap:anywhere]">
                        {toCleanUppercase(`${t.topicPrefix} ${qNum} / 28: ${q.title}`)}
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
                          const isSelected = answers[q.id] === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, opt, 'mcq')}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex items-center justify-center min-h-[48px] ${
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
                          placeholder={q.inputType === 'decimal' ? t.inputPlaceholderDecimal : t.inputPlaceholder}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0">
                      {q.tableData && (
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
                                  <td className="p-1.5 text-indigo-700 align-middle">
                                    {row.formula}
                                  </td>
                                  <td className="p-1.5 font-black text-emerald-700">
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
                          {isQuestionCorrect(q) ? t.feedbackSuccess : t.feedbackExplain}
                        </p>
                        <div className="leading-relaxed">{q.explain}</div>
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
                <span>{toCleanUppercase(t.checkAllBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase(t.scoreLabel) : toCleanUppercase(t.answeredLabel)}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 28` : `${answeredCount} / 28`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.successRateLabel)}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 28) * 100)}%
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
                <span>{toCleanUppercase(t.newTestBtn)}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.bottomTip}
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
// pages/st-dimotikou/53-ksero-arxiki-teliki-timi-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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

  // Fallback σε περίπτωση που οι υποψήφιοι δεν επαρκούν
  let counter = 1;
  while (unique.size < 4) {
    const numericMatch = correct.match(/\d+/);
    if (numericMatch) {
      const baseNum = parseInt(numericMatch[0], 10);
      const fallbackVal = correct.replace(/\d+/, String(Math.max(1, baseNum + counter * 5)));
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
    metaTitle: "Ασκήσεις: Εύρεση Ποσοστού από Αρχική και Τελική Τιμή - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην εύρεση του ποσοστού έκπτωσης ή αύξησης για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 53 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Διαδραστικές Ασκήσεις: Εύρεση Ποσοστού από Αρχική και Τελική Τιμή",
    heroDesc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον υπολογισμό της διαφοράς τιμών και στην αναγωγή της μεταβολής σε ποσοστό επί της αρχικής τιμής!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    exercisePrefix: "Άσκηση",
    inputPlaceholder: "Απάντηση...",
    inputPlaceholderDecimal: "π.χ. 12,5",
    tableHeaderElement: "Στοιχείο",
    tableHeaderFormula: "Ανάλυση / Τύπος",
    tableHeaderValue: "Τιμή",
    feedbackSuccess: "🎯 Εξαιρετικά!",
    feedbackExplain: "💡 Επεξήγηση:",
    checkBtn: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ",
    answeredLabel: "Απαντήθηκαν",
    pctLabel: "Ποσοστό",
    bottomTip: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!",

    // Concept questions (Q1 - Q6)
    q1Title: "Εύρεση Ποσοστού Έκπτωσης",
    q1Prompt: (orig, finalP) => `Ένα προϊόν κόστιζε αρχικά ${orig} € και πωλείται τώρα προς ${finalP} €. Ποιο είναι το ποσοστό έκπτωσης (%) που έγινε; (γράψε μόνο τον αριθμό)`,
    q1Explain: (orig, finalP, diff, discPct) => (
      <span className="inline-flex flex-wrap items-center gap-1">
        <span>Διαφορά: {orig} － {finalP} ＝ {diff} €. Ποσοστό επί της αρχικής τιμής:</span>
        <Fraction num={diff} den={orig} />
        <span>· 100 ＝ {discPct} %.</span>
      </span>
    ),

    q2Title: "Βάση Υπολογισμού Ποσοστού",
    q2Prompt: "Σε ποια τιμή υπολογίζουμε το ποσοστό αύξησης ή έκπτωσης όταν γνωρίζουμε την αρχική και την τελική τιμή;",
    q2Correct: "Πάντοτε στην αρχική τιμή, γιατί αυτή αποτελεί το 100 % της σύγκρισης",
    q2Distractors: [
      "Πάντοτε στην τελική τιμή, γιατί αυτή πληρώνουμε στο ταμείο",
      "Στο άθροισμα της αρχικής και της τελικής τιμής",
      "Δεν έχει σημασία σε ποια τιμή θα το υπολογίσουμε"
    ],
    q2Explain: "Το ποσοστό μεταβολής υπολογίζεται πάντοτε πάνω στην αρχική τιμή, επειδή αυτή είναι το σημείο εκκίνησης και αντιστοιχεί στο 100 %.",

    q3Title: "Εύρεση Ποσοστού Αύξησης",
    q3Prompt: (orig, finalP) => `Η τιμή ενός προϊόντος ανέβηκε από τα ${orig} € στα ${finalP} €. Ποιο ήταν το ποσοστό αύξησης (%) της τιμής; (γράψε μόνο τον αριθμό)`,
    q3Explain: (finalP, orig, diff, incPct) => (
      <span className="inline-flex flex-wrap items-center gap-1">
        <span>Διαφορά: {finalP} － {orig} ＝ {diff} €. Ποσοστό αύξησης επί της αρχικής τιμής:</span>
        <Fraction num={diff} den={orig} />
        <span>· 100 ＝ {incPct} %.</span>
      </span>
    ),

    q4Title: "Ο Μαθηματικός Τύπος Μεταβολής",
    q4Prompt: "Ποιος είναι ο σωστός τύπος για τον υπολογισμό του ποσοστού μεταβολής όταν γνωρίζουμε την αρχική και την τελική τιμή;",
    q4Correct: "Ποσοστό % ＝ (Διαφορά Τιμών : Αρχική Τιμή) · 100",
    q4Distractors: [
      "Ποσοστό % ＝ (Διαφορά Τιμών : Τελική Τιμή) · 100",
      "Ποσοστό % ＝ (Αρχική Τιμή : Τελική Τιμή) · 100",
      "Ποσοστό % ＝ (Τελική Τιμή － 100) : Αρχική Τιμή"
    ],
    q4Explain: (
      <span className="inline-flex flex-wrap items-center gap-1">
        <span>Διαιρούμε τη διαφορά των δύο τιμών με την αρχική τιμή και πολλαπλασιάζουμε με το 100: Ποσοστό % ＝</span>
        <Fraction num="Διαφορά Τιμών" den="Αρχική Τιμή" />
        <span>· 100.</span>
      </span>
    ),

    q5Title: "Ποσοστό Κέρδους επί της Αγοράς",
    q5Prompt: (cost, sell) => `Ένας καταστηματάρχης αγόρασε ένα είδος προς ${cost} € και το πούλησε προς ${sell} €. Ποιο ήταν το ποσοστό κέρδους (%) επί της τιμής αγοράς; (γράψε μόνο τον αριθμό)`,
    q5Explain: (sell, cost, profit, pct) => (
      <span className="inline-flex flex-wrap items-center gap-1">
        <span>Κέρδος: {sell} － {cost} ＝ {profit} €. Ποσοστό κέρδους:</span>
        <Fraction num={profit} den={cost} />
        <span>· 100 ＝ {pct} %.</span>
      </span>
    ),

    q6Title: "Αναγνώριση Είδους Μεταβολής",
    q6Prompt: "Αν ένα προϊόν από 100 € πωληθεί τελικά προς 80 €, τι είδους μεταβολή έχουμε;",
    q6Correct: "Έχουμε μείωση (έκπτωση) 20 %, επειδή η τελική τιμή είναι μικρότερη από την αρχική",
    q6Distractors: [
      "Έχουμε αύξηση 20 %, επειδή αφαιρέσαμε 20 €",
      "Έχουμε μείωση 25 %, επειδή διαιρούμε με το 80",
      "Δεν υπάρχει καμία ποσοστιαία μεταβολή"
    ],
    q6Explain: (
      <span className="inline-flex flex-wrap items-center gap-1">
        <span>Η τιμή μειώθηκε από 100 € σε 80 €, επομένως έχουμε μείωση (έκπτωση) κατά:</span>
        <Fraction num="20" den="100" />
        <span>· 100 ＝ 20 %.</span>
      </span>
    ),

    problemBadge: "Πρόβλημα",
    hardProblemBadge: "Σύνθετο Πρόβλημα"
  },
  en: {
    metaTitle: "Exercises: Finding Percentage from Original & Final Price - Grade 6 | LearnMaths.gr",
    metaDesc: "Interactive practice exercises with 10 questions and auto-grading on calculating discount or markup rates for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "Theory",
    badgeChapter: "CHAPTER 53 • GRADE 6 • PRACTICE",
    heroTitle: "Interactive Exercises: Finding Percentage from Original and Final Price",
    heroDesc: "Solve the 10 dynamic questions to master calculating the price difference and scaling the change into a percentage of the original price!",
    newQuestionsBtn: "New Questions",
    exercisePrefix: "Exercise",
    inputPlaceholder: "Answer...",
    inputPlaceholderDecimal: "e.g. 12.5",
    tableHeaderElement: "Element",
    tableHeaderFormula: "Analysis / Formula",
    tableHeaderValue: "Value",
    feedbackSuccess: "🎯 Excellent!",
    feedbackExplain: "💡 Explanation:",
    checkBtn: "Check Answers",
    scoreLabel: "Score",
    answeredLabel: "Answered",
    pctLabel: "Percentage",
    bottomTip: "Answer all 10 questions and click \"Check Answers\"!",

    // Concept questions (Q1 - Q6)
    q1Title: "Finding Discount Percentage",
    q1Prompt: (orig, finalP) => `An item originally cost ${orig} € and is now sold for ${finalP} €. What was the discount percentage (%) applied? (write only the number)`,
    q1Explain: (orig, finalP, diff, discPct) => (
      <span className="inline-flex flex-wrap items-center gap-1">
        <span>Difference: ${orig} － ${finalP} ＝ ${diff} €. Percentage on original price:</span>
        <Fraction num={diff} den={orig} />
        <span>· 100 ＝ {discPct} %.</span>
      </span>
    ),

    q2Title: "Base for Percentage Calculation",
    q2Prompt: "On which price do we calculate the percentage markup or discount when we know both the original and final price?",
    q2Correct: "Always on the original price, because it represents the 100 % baseline of comparison",
    q2Distractors: [
      "Always on the final price, because that is what we pay at the register",
      "On the sum of the original and final price",
      "It does not matter which price we calculate it on"
    ],
    q2Explain: "The rate of change is always calculated on the original price because it is the baseline and corresponds to 100 %.",

    q3Title: "Finding Markup Percentage",
    q3Prompt: (orig, finalP) => `The price of an item rose from ${orig} € to ${finalP} €. What was the percentage increase (%) in price? (write only the number)`,
    q3Explain: (finalP, orig, diff, incPct) => (
      <span className="inline-flex flex-wrap items-center gap-1">
        <span>Difference: ${finalP} － ${orig} ＝ ${diff} €. Percentage markup on original price:</span>
        <Fraction num={diff} den={orig} />
        <span>· 100 ＝ {incPct} %.</span>
      </span>
    ),

    q4Title: "The Mathematical Formula for Rate of Change",
    q4Prompt: "What is the correct formula to calculate the percentage rate of change when knowing both original and final prices?",
    q4Correct: "Percentage % ＝ (Price Difference : Original Price) · 100",
    q4Distractors: [
      "Percentage % ＝ (Price Difference : Final Price) · 100",
      "Percentage % ＝ (Original Price : Final Price) · 100",
      "Percentage % ＝ (Final Price － 100) : Original Price"
    ],
    q4Explain: (
      <span className="inline-flex flex-wrap items-center gap-1">
        <span>We divide the price difference by the original price and multiply by 100: Percentage % ＝</span>
        <Fraction num="Price Difference" den="Original Price" />
        <span>· 100.</span>
      </span>
    ),

    q5Title: "Profit Percentage on Cost",
    q5Prompt: (cost, sell) => `A shopkeeper bought an item for ${cost} € and sold it for ${sell} €. What was the profit percentage (%) on the cost price? (write only the number)`,
    q5Explain: (sell, cost, profit, pct) => (
      <span className="inline-flex flex-wrap items-center gap-1">
        <span>Profit: ${sell} － ${cost} ＝ ${profit} €. Profit rate:</span>
        <Fraction num={profit} den={cost} />
        <span>· 100 ＝ {pct} %.</span>
      </span>
    ),

    q6Title: "Identifying Type of Change",
    q6Prompt: "If an item price changes from 100 € to 80 €, what kind of change do we have?",
    q6Correct: "We have a 20 % decrease (discount), because the final price is lower than the original",
    q6Distractors: [
      "We have a 20 % increase, because we subtracted 20 €",
      "We have a 25 % decrease, because we divide by 80",
      "There is no percentage change"
    ],
    q6Explain: (
      <span className="inline-flex flex-wrap items-center gap-1">
        <span>The price decreased from 100 € to 80 €, so we have a decrease (discount) of:</span>
        <Fraction num="20" den="100" />
        <span>· 100 ＝ 20 %.</span>
      </span>
    ),

    problemBadge: "Problem",
    hardProblemBadge: "Multi-Step Problem"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY"
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'k_std_1',
    generate: (locale) => {
      const isEl = locale === 'el';
      const origPrice = pickRandom([50, 60, 80, 100, 120, 150]);
      const discPct = pickRandom([10, 20, 25, 30, 40]);
      const discount = (origPrice * discPct) / 100;
      const finalPrice = origPrice - discount;

      const wrongOpts = [
        `${discPct + 10} %`,
        `${Math.max(5, discPct - 5)} %`,
        `${discPct + 15} %`
      ];

      return {
        title: isEl ? 'Υπολογισμός Ποσοστού Έκπτωσης' : 'Discount Percentage Calculation',
        prompt: isEl
          ? `Ένα παντελόνι κόστιζε αρχικά ${formatNum(origPrice, locale)} € και στις εκπτώσεις πωλήθηκε προς ${formatNum(finalPrice, locale)} €. Ποιο ήταν το ποσοστό έκπτωσης (%) που έγινε στην τιμή του; (γράψε μόνο τον αριθμό)`
          : `A pair of trousers originally cost ${formatNum(origPrice, locale)} € and was sold on sale for ${formatNum(finalPrice, locale)} €. What was the discount percentage (%) applied to its price? (write only the number)`,
        promptMcq: isEl
          ? `Ένα παντελόνι κόστιζε αρχικά ${formatNum(origPrice, locale)} € και στις εκπτώσεις πωλήθηκε προς ${formatNum(finalPrice, locale)} €. Ποιο ήταν το ποσοστό έκπτωσης (%) που έγινε στην τιμή του;`
          : `A pair of trousers originally cost ${formatNum(origPrice, locale)} € and was sold on sale for ${formatNum(finalPrice, locale)} €. What was the discount percentage (%) applied to its price?`,
        correctVal: String(discPct),
        correctText: `${discPct} %`,
        tableData: [
          {
            item: isEl ? 'Ποσό έκπτωσης (διαφορά)' : 'Discount amount (difference)',
            formula: `${formatNum(origPrice, locale)} － ${formatNum(finalPrice, locale)}`,
            val: `${formatNum(discount, locale)} €`
          },
          {
            item: isEl ? 'Αρχική τιμή (βάση 100%)' : 'Original price (100% base)',
            formula: `${formatNum(origPrice, locale)} €`,
            val: `${formatNum(origPrice, locale)} €`
          },
          {
            item: isEl ? 'Ποσοστό έκπτωσης' : 'Discount percentage',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={formatNum(discount, locale)} den={formatNum(origPrice, locale)} />
                <span>· 100</span>
              </span>
            ),
            val: `${discPct} %`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl ? '1ο Βήμα: Διαφορά (έκπτωση):' : 'Step 1: Difference (discount):'}{' '}
              {formatNum(origPrice, locale)} － {formatNum(finalPrice, locale)} ＝ {formatNum(discount, locale)} €.
              {' '}{isEl ? '2ο Βήμα: Ποσοστό επί της αρχικής:' : 'Step 2: Rate on original:'}
            </span>
            <Fraction num={formatNum(discount, locale)} den={formatNum(origPrice, locale)} />
            <span>· 100 ＝ {discPct} %.</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'k_std_2',
    generate: (locale) => {
      const isEl = locale === 'el';
      const origRent = pickRandom([300, 400, 500]);
      const incPct = pickRandom([5, 10, 15, 20]);
      const increase = (origRent * incPct) / 100;
      const finalRent = origRent + increase;

      const wrongOpts = [
        `${incPct + 5} %`,
        `${Math.max(2, incPct - 3)} %`,
        `${incPct + 8} %`
      ];

      return {
        title: isEl ? 'Υπολογισμός Ποσοστού Αύξησης Ενοικίου' : 'Rent Increase Percentage Calculation',
        prompt: isEl
          ? `Το μηνιαίο ενοίκιο ενός γραφείου ήταν ${formatNum(origRent, locale)} € και μετά από αναπροσαρμογή έγινε ${formatNum(finalRent, locale)} €. Ποιο ήταν το ποσοστό αύξησης (%) του ενοικίου; (γράψε μόνο τον αριθμό)`
          : `The monthly rent of an office was ${formatNum(origRent, locale)} € and after adjustment became ${formatNum(finalRent, locale)} €. What was the percentage increase (%) of the rent? (write only the number)`,
        promptMcq: isEl
          ? `Το μηνιαίο ενοίκιο ενός γραφείου ήταν ${formatNum(origRent, locale)} € και μετά από αναπροσαρμογή έγινε ${formatNum(finalRent, locale)} €. Ποιο ήταν το ποσοστό αύξησης (%) του ενοικίου;`
          : `The monthly rent of an office was ${formatNum(origRent, locale)} € and after adjustment became ${formatNum(finalRent, locale)} €. What was the percentage increase (%) of the rent?`,
        correctVal: String(incPct),
        correctText: `${incPct} %`,
        tableData: [
          {
            item: isEl ? 'Ποσό αύξησης (διαφορά)' : 'Increase amount (difference)',
            formula: `${formatNum(finalRent, locale)} － ${formatNum(origRent, locale)}`,
            val: `${formatNum(increase, locale)} €`
          },
          {
            item: isEl ? 'Αρχικό ενοίκιο' : 'Original rent',
            formula: `${formatNum(origRent, locale)} €`,
            val: `${formatNum(origRent, locale)} €`
          },
          {
            item: isEl ? 'Ποσοστό αύξησης' : 'Increase percentage',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={formatNum(increase, locale)} den={formatNum(origRent, locale)} />
                <span>· 100</span>
              </span>
            ),
            val: `${incPct} %`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl ? 'Αύξηση σε ευρώ:' : 'Increase in euros:'}{' '}
              {formatNum(finalRent, locale)} － {formatNum(origRent, locale)} ＝ {formatNum(increase, locale)} €.
              {' '}{isEl ? 'Ποσοστό επί του αρχικού:' : 'Rate on original:'}
            </span>
            <Fraction num={formatNum(increase, locale)} den={formatNum(origRent, locale)} />
            <span>· 100 ＝ {incPct} %.</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'k_std_3',
    generate: (locale) => {
      const isEl = locale === 'el';
      const origPrice = pickRandom([40, 50, 80, 100]);
      const discPct = 25;
      const discount = (origPrice * discPct) / 100;
      const finalPrice = origPrice - discount;

      const wrongOpts = [
        `${discPct + 5} %`,
        `${discPct - 5} %`,
        `${discPct + 10} %`
      ];

      return {
        title: isEl ? 'Ποσοστό Έκπτωσης σε Φωτιστικό' : 'Lamp Discount Percentage',
        prompt: isEl
          ? `Ένα φωτιστικό είχε αρχική τιμή ${formatNum(origPrice, locale)} € και διατέθηκε σε προσφορά προς ${formatNum(finalPrice, locale)} €. Ποιο ποσοστό έκπτωσης (%) προσέφερε το κατάστημα; (γράψε μόνο τον αριθμό)`
          : `A lamp had an original price of ${formatNum(origPrice, locale)} € and was offered on sale for ${formatNum(finalPrice, locale)} €. What discount percentage (%) did the store offer? (write only the number)`,
        promptMcq: isEl
          ? `Ένα φωτιστικό είχε αρχική τιμή ${formatNum(origPrice, locale)} € και διατέθηκε σε προσφορά προς ${formatNum(finalPrice, locale)} €. Ποιο ποσοστό έκπτωσης (%) προσέφερε το κατάστημα;`
          : `A lamp had an original price of ${formatNum(origPrice, locale)} € and was offered on sale for ${formatNum(finalPrice, locale)} €. What discount percentage (%) did the store offer?`,
        correctVal: String(discPct),
        correctText: `${discPct} %`,
        tableData: [
          {
            item: isEl ? 'Ποσό έκπτωσης' : 'Discount amount',
            formula: `${formatNum(origPrice, locale)} － ${formatNum(finalPrice, locale)}`,
            val: `${formatNum(discount, locale)} €`
          },
          {
            item: isEl ? 'Αρχική τιμή καταλόγου' : 'Catalog original price',
            formula: `${formatNum(origPrice, locale)} €`,
            val: `${formatNum(origPrice, locale)} €`
          },
          {
            item: isEl ? 'Ποσοστό έκπτωσης' : 'Discount percentage',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={formatNum(discount, locale)} den={formatNum(origPrice, locale)} />
                <span>· 100</span>
              </span>
            ),
            val: `${discPct} %`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl ? 'Διαφορά:' : 'Difference:'}{' '}
              {formatNum(origPrice, locale)} － {formatNum(finalPrice, locale)} ＝ {formatNum(discount, locale)} €.
              {' '}{isEl ? 'Ποσοστό:' : 'Rate:'}
            </span>
            <Fraction num={formatNum(discount, locale)} den={formatNum(origPrice, locale)} />
            <span>· 100 ＝ {discPct} %.</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'k_std_4',
    generate: (locale) => {
      const isEl = locale === 'el';
      return {
        title: isEl ? 'Αύξηση Τιμής Εισιτηρίου' : 'Ticket Price Increase',
        prompt: isEl
          ? `Η τιμή του εισιτηρίου λεωφορείου αυξήθηκε από ${formatNum(1.2, locale, 2)} € σε ${formatNum(1.5, locale, 2)} €. Ποιο ήταν το ποσοστό αύξησης (%) στην τιμή του εισιτηρίου; (γράψε μόνο τον αριθμό)`
          : `The bus ticket price increased from ${formatNum(1.2, locale, 2)} € to ${formatNum(1.5, locale, 2)} €. What was the percentage increase (%) in ticket price? (write only the number)`,
        promptMcq: isEl
          ? `Η τιμή του εισιτηρίου λεωφορείου αυξήθηκε από ${formatNum(1.2, locale, 2)} € σε ${formatNum(1.5, locale, 2)} €. Ποιο ήταν το ποσοστό αύξησης (%) στην τιμή του εισιτηρίου;`
          : `The bus ticket price increased from ${formatNum(1.2, locale, 2)} € to ${formatNum(1.5, locale, 2)} €. What was the percentage increase (%) in ticket price?`,
        correctVal: '25',
        correctText: '25 %',
        tableData: [
          {
            item: isEl ? 'Αύξηση τιμής' : 'Price increase',
            formula: `${formatNum(1.5, locale, 2)} － ${formatNum(1.2, locale, 2)}`,
            val: `${formatNum(0.3, locale, 2)} €`
          },
          {
            item: isEl ? 'Αρχική τιμή' : 'Original price',
            formula: `${formatNum(1.2, locale, 2)} €`,
            val: `${formatNum(1.2, locale, 2)} €`
          },
          {
            item: isEl ? 'Ποσοστό αύξησης' : 'Increase percentage',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={formatNum(0.3, locale, 2)} den={formatNum(1.2, locale, 2)} />
                <span>· 100</span>
              </span>
            ),
            val: '25 %'
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl ? 'Αύξηση:' : 'Increase:'}{' '}
              {formatNum(1.5, locale, 2)} － ${formatNum(1.2, locale, 2)} ＝ ${formatNum(0.3, locale, 2)} €.
              {' '}{isEl ? 'Ποσοστό αύξησης:' : 'Rate of increase:'}
            </span>
            <Fraction num={formatNum(0.3, locale, 2)} den={formatNum(1.2, locale, 2)} />
            <span>· 100 ＝ 25 %.</span>
          </span>
        ),
        distractors: ['30 %', '20 %', '15 %']
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'k_hard_1',
    generate: (locale) => {
      const isEl = locale === 'el';
      return {
        title: isEl ? 'Υπολογισμός Συντελεστή Φ.Π.Α.' : 'VAT Rate Calculation',
        prompt: isEl
          ? 'Ένα κατάστημα τιμολογεί έναν εκτυπωτή με αρχική καθαρή αξία 250 €. Ο πελάτης πλήρωσε τελικά 310 € μαζί με τον φόρο. Ποιο ήταν το ποσοστό (%) του Φ.Π.Α. με το οποίο επιβαρύνθηκε ο εκτυπωτής; (γράψε μόνο τον αριθμό)'
          : 'A store invoices a printer with an initial net value of 250 €. The customer finally paid 310 € including tax. What was the percentage (%) of VAT applied to the printer? (write only the number)',
        promptMcq: isEl
          ? 'Ένα κατάστημα τιμολογεί έναν εκτυπωτή με αρχική καθαρή αξία 250 €. Ο πελάτης πλήρωσε τελικά 310 € μαζί με τον φόρο. Ποιο ήταν το ποσοστό (%) του Φ.Π.Α. με το οποίο επιβαρύνθηκε ο εκτυπωτής;'
          : 'A store invoices a printer with an initial net value of 250 €. The customer finally paid 310 € including tax. What was the percentage (%) of VAT applied to the printer?',
        correctVal: '24',
        correctText: '24 %',
        tableData: [
          {
            item: isEl ? 'Ποσό φόρου (διαφορά)' : 'Tax amount (difference)',
            formula: '310 － 250',
            val: '60 €'
          },
          {
            item: isEl ? 'Καθαρή αρχική αξία' : 'Net original value',
            formula: '250 €',
            val: '250 €'
          },
          {
            item: isEl ? 'Ποσοστό Φ.Π.Α.' : 'VAT percentage',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num="60" den="250" />
                <span>· 100</span>
              </span>
            ),
            val: '24 %'
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl
                ? 'Φόρος: 310 － 250 ＝ 60 €. Ποσοστό Φ.Π.Α. επί της αρχικής καθαρής αξίας:'
                : 'Tax: 310 － 250 ＝ 60 €. VAT rate on original net value:'}
            </span>
            <Fraction num="60" den="250" />
            <span>· 100 ＝ 24 %.</span>
          </span>
        ),
        distractors: ['13 %', '20 %', '25 %']
      };
    }
  },
  {
    id: 'k_hard_2',
    generate: (locale) => {
      const isEl = locale === 'el';
      return {
        title: isEl ? 'Υπολογισμός Ποσοστού Έκπτωσης από Όφελος' : 'Discount Percentage from Savings',
        prompt: isEl
          ? 'Ένας αγοραστής αγόρασε ένα μπουφάν πληρώνοντας 60 € και υπολόγισε ότι εξοικονόμησε 20 € σε σχέση με την αρχική τιμή της ετικέτας. Ποιο ήταν το ποσοστό έκπτωσης (%); (γράψε μόνο τον αριθμό)'
          : 'A buyer purchased a jacket paying 60 € and calculated saving 20 € compared to the original tag price. What was the discount rate (%); (write only the number)',
        promptMcq: isEl
          ? 'Ένας αγοραστής αγόρασε ένα μπουφάν πληρώνοντας 60 € και υπολόγισε ότι εξοικονόμησε 20 € σε σχέση με την αρχική τιμή της ετικέτας. Ποιο ήταν το ποσοστό έκπτωσης (%);'
          : 'A buyer purchased a jacket paying 60 € and calculated saving 20 € compared to the original tag price. What was the discount rate (%);',
        correctVal: '25',
        correctText: '25 %',
        tableData: [
          {
            item: isEl ? 'Αρχική τιμή ετικέτας' : 'Original tag price',
            formula: '60 ＋ 20',
            val: '80 €'
          },
          {
            item: isEl ? 'Όφελος (έκπτωση)' : 'Savings (discount)',
            formula: '20 €',
            val: '20 €'
          },
          {
            item: isEl ? 'Ποσοστό έκπτωσης' : 'Discount percentage',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num="20" den="80" />
                <span>· 100</span>
              </span>
            ),
            val: '25 %'
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl
                ? 'Αρχική τιμή: 60 ＋ 20 ＝ 80 €. Ποσοστό έκπτωσης επί της αρχικής τιμής:'
                : 'Original price: 60 ＋ 20 ＝ 80 €. Discount percentage on original price:'}
            </span>
            <Fraction num="20" den="80" />
            <span>· 100 ＝ 25 %.</span>
          </span>
        ),
        distractors: ['33 %', '20 %', '30 %']
      };
    }
  },
  {
    id: 'k_hard_3',
    generate: (locale) => {
      const isEl = locale === 'el';
      return {
        title: isEl ? 'Ποσοστό Κέρδους επί της Τιμής Αγοράς' : 'Profit Percentage on Cost Price',
        prompt: isEl
          ? 'Ένας έμπορος αγόρασε ένα εμπόρευμα προς 50 € και το πούλησε προς 65 €. Ποιο ήταν το ποσοστό κέρδους (%) του εμπόρου επί της τιμής αγοράς; (γράψε μόνο τον αριθμό)'
          : 'A merchant bought goods for 50 € and sold them for 65 €. What was the merchant\'s profit percentage (%) on the cost price? (write only the number)',
        promptMcq: isEl
          ? 'Ένας έμπορος αγόρασε ένα εμπόρευμα προς 50 € και το πούλησε προς 65 €. Ποιο ήταν το ποσοστό κέρδους (%) του εμπόρου επί της τιμής αγοράς;'
          : 'A merchant bought goods for 50 € and sold them for 65 €. What was the merchant\'s profit percentage (%) on the cost price?',
        correctVal: '30',
        correctText: '30 %',
        tableData: [
          {
            item: isEl ? 'Καθαρό κέρδος' : 'Net profit',
            formula: '65 － 50',
            val: '15 €'
          },
          {
            item: isEl ? 'Τιμή αγοράς (βάση)' : 'Cost price (base)',
            formula: '50 €',
            val: '50 €'
          },
          {
            item: isEl ? 'Ποσοστό κέρδους' : 'Profit percentage',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num="15" den="50" />
                <span>· 100</span>
              </span>
            ),
            val: '30 %'
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl
                ? 'Κέρδος: 65 － 50 ＝ 15 €. Ποσοστό κέρδους επί της τιμής αγοράς:'
                : 'Profit: 65 － 50 ＝ 15 €. Profit rate on cost price:'}
            </span>
            <Fraction num="15" den="50" />
            <span>· 100 ＝ 30 %.</span>
          </span>
        ),
        distractors: ['25 %', '35 %', '20 %']
      };
    }
  },
  {
    id: 'k_hard_4',
    generate: (locale) => {
      const isEl = locale === 'el';
      return {
        title: isEl ? 'Ποσοστό Κατανάλωσης Νερού σε Δεξαμενή' : 'Water Consumption Rate in Tank',
        prompt: isEl
          ? 'Μια δεξαμενή είχε αρχικά 500 l νερό. Μετά από κατανάλωση, έχουν απομείνει στη δεξαμενή 325 l νερό. Ποιο ποσοστό (%) του αρχικού νερού καταναλώθηκε; (γράψε μόνο τον αριθμό)'
          : 'A tank initially contained 500 l of water. After consumption, 325 l of water remain in the tank. What percentage (%) of the original water was consumed? (write only the number)',
        promptMcq: isEl
          ? 'Μια δεξαμενή είχε αρχικά 500 l νερό. Μετά από κατανάλωση, έχουν απομείνει στη δεξαμενή 325 l νερό. Ποιο ποσοστό (%) του αρχικού νερού καταναλώθηκε;'
          : 'A tank initially contained 500 l of water. After consumption, 325 l of water remain in the tank. What percentage (%) of the original water was consumed?',
        correctVal: '35',
        correctText: '35 %',
        tableData: [
          {
            item: isEl ? 'Νερό που καταναλώθηκε' : 'Consumed water',
            formula: '500 － 325',
            val: '175 l'
          },
          {
            item: isEl ? 'Αρχικός όγκος δεξαμενής' : 'Initial tank volume',
            formula: '500 l',
            val: '500 l'
          },
          {
            item: isEl ? 'Ποσοστό κατανάλωσης' : 'Consumption percentage',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num="175" den="500" />
                <span>· 100</span>
              </span>
            ),
            val: '35 %'
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEl ? 'Νερό που καταναλώθηκε:' : 'Consumed water:'}{' '}
              500 － 325 ＝ 175 l. {isEl ? 'Ποσοστό:' : 'Percentage:'}
            </span>
            <Fraction num="175" den="500" />
            <span>· 100 ＝ 35 %.</span>
          </span>
        ),
        distractors: ['40 %', '30 %', '45 %']
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.el;

  // Q1: Input - Εύρεση ποσοστού έκπτωσης
  const q1Orig = pickRandom([50, 80, 100, 120]);
  const q1DiscPct = 25;
  const q1Final = q1Orig * 0.75;
  const q1Diff = q1Orig - q1Final;

  // Q2: MCQ - Βάση υπολογισμού ποσοστού
  const q2Options = makeUniqueOptions(t.q2Correct, t.q2Distractors);

  // Q3: Input - Εύρεση ποσοστού αύξησης
  const q3Orig = pickRandom([40, 50, 80]);
  const q3IncPct = 20;
  const q3Final = q3Orig * 1.2;
  const q3Diff = q3Final - q3Orig;

  // Q4: MCQ - Ο μαθηματικός τύπος
  const q4Options = makeUniqueOptions(t.q4Correct, t.q4Distractors);

  // Q5: Input - Ποσοστό κέρδους
  const q5Cost = pickRandom([20, 25, 40, 50]);
  const q5ProfitPct = pickRandom([10, 15, 25, 50]);
  const q5ProfitEur = (q5Cost * q5ProfitPct) / 100;
  const q5Sell = q5Cost + q5ProfitEur;

  // Q6: MCQ - Αναγνώριση είδους μεταβολής
  const q6Options = makeUniqueOptions(t.q6Correct, t.q6Distractors);

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate(locale);

  // Q8: Standard Problem (MCQ)
  let spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  while (spIndex2 === spIndex1) spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q8Data = STANDARD_PROBLEMS_POOL[spIndex2].generate(locale);
  const q8Options = makeUniqueOptions(q8Data.correctText, q8Data.distractors);

  // Q9: Hard Problem (Input)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate(locale);

  // Q10: Hard Problem (MCQ)
  let hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  while (hpIndex2 === hpIndex1) hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hpIndex2].generate(locale);
  const q10Options = makeUniqueOptions(q10Data.correctText, q10Data.distractors);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: t.q1Title,
      prompt: t.q1Prompt(formatNum(q1Orig, locale), formatNum(q1Final, locale)),
      correct: String(q1DiscPct),
      explain: t.q1Explain(formatNum(q1Orig, locale), formatNum(q1Final, locale), formatNum(q1Diff, locale), q1DiscPct)
    },
    {
      id: 'q2',
      type: 'mcq',
      title: t.q2Title,
      prompt: t.q2Prompt,
      options: q2Options,
      correct: t.q2Correct,
      explain: t.q2Explain
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: t.q3Title,
      prompt: t.q3Prompt(formatNum(q3Orig, locale), formatNum(q3Final, locale)),
      correct: String(q3IncPct),
      explain: t.q3Explain(formatNum(q3Final, locale), formatNum(q3Orig, locale), formatNum(q3Diff, locale), q3IncPct)
    },
    {
      id: 'q4',
      type: 'mcq',
      title: t.q4Title,
      prompt: t.q4Prompt,
      options: q4Options,
      correct: t.q4Correct,
      explain: t.q4Explain
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: t.q5Title,
      prompt: t.q5Prompt(formatNum(q5Cost, locale), formatNum(q5Sell, locale)),
      correct: String(q5ProfitPct),
      explain: t.q5Explain(formatNum(q5Sell, locale), formatNum(q5Cost, locale), formatNum(q5ProfitEur, locale), q5ProfitPct)
    },
    {
      id: 'q6',
      type: 'mcq',
      title: t.q6Title,
      prompt: t.q6Prompt,
      options: q6Options,
      correct: t.q6Correct,
      explain: t.q6Explain
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: `${t.problemBadge}: ${q7Data.title}`,
      prompt: q7Data.prompt,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: `${t.problemBadge}: ${q8Data.title}`,
      prompt: q8Data.promptMcq,
      options: q8Options,
      correct: q8Data.correctText,
      tableData: q8Data.tableData,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'input',
      inputType: 'number',
      title: `${t.hardProblemBadge}: ${q9Data.title}`,
      prompt: q9Data.prompt,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${t.hardProblemBadge}: ${q10Data.title}`,
      prompt: q10Data.promptMcq,
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

export default function KseroArxikiTelikiTimiExercisesPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').replace(/%/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').replace(/%/g, '').trim().toLowerCase();

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
      actionButton={
        <Link
          href="/st-dimotikou/53-ksero-arxiki-teliki-timi"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
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
              <span>{toCleanUppercase(t.newQuestionsBtn)}</span>
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
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 overflow-hidden ${getCardStyle(q)}`}
                >
                  <div className="min-w-0">
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words [overflow-wrap:anywhere]">
                        {toCleanUppercase(`${t.exercisePrefix} ${qNum}: ${q.title}`)}
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
                <span>{toCleanUppercase(t.checkBtn)}</span>
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
                {submitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.pctLabel)}:{' '}
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
                <span>{toCleanUppercase(t.newQuestionsBtn)}</span>
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
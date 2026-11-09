// pages/st-dimotikou/52-brisko-arxiki-timi-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΑ COMPONENTS & ΣΥΝΑΡΤΗΣΕΙΣ
// ---------------------------------------------------------

// Εμφάνιση κλάσματος σε κανονική κατακόρυφη μορφή (πλήρως responsive χωρίς horizontal scroll)
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

// Μορφοποίηση αριθμού ανά locale (el-GR / en-US)
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
// ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ ΜΕΤΑΦΡΑΣΕΩΝ (i18n)
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    metaTitle: "Ασκήσεις: Εύρεση Αρχικής Τιμής στα Ποσοστά - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην εύρεση αρχικής τιμής και αποφυγή της παγίδας των ποσοστών για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 52 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Διαδραστικές Ασκήσεις: Εύρεση της Αρχικής Τιμής",
    heroDesc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον υπολογισμό της αρχικής αξίας προ έκπτωσης ή προ φόρου και στην αποφυγή της μεγάλης παγίδας των ποσοστών!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    exercisePrefix: "Άσκηση",
    inputPlaceholder: "Απάντηση...",
    inputPlaceholderDecimal: "π.χ. 45,5",
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
    q1Title: "Εύρεση Αρχικής Τιμής μετά από Έκπτωση",
    q1Prompt: (finalP) => `Ένα παντελόνι πωλείται στις εκπτώσεις προς ${finalP} € με έκπτωση 20 %. Ποια ήταν η αρχική τιμή του σε €; (γράψε μόνο τον αριθμό)`,
    q1Explain: (finalP, orig) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        Η τελική τιμή ({finalP} €) αντιστοιχεί στο 80 % της αρχικής (100 － 20). Αρχική τιμή: <Fraction num={`${finalP} · 100`} den="80" /> ＝ {orig} €.
      </span>
    ),

    q2Title: "Αντιστοίχιση Ποσοστού Τελικής Τιμής",
    q2Prompt: (disc) => `Αν ένα προϊόν έχει έκπτωση ${disc} %, σε ποιο ποσοστό (%) της αρχικής τιμής αντιστοιχεί η τελική τιμή που πληρώνουμε;`,
    q2Explain: (disc, pct) => `Αφού αφαιρείται έκπτωση ${disc} % από το αρχικό 100 %, πληρώνουμε το υπόλοιπο: 100 % － ${disc} % ＝ ${pct} %.`,

    q3Title: "Εύρεση Αρχικής Αξίας προ Φόρου",
    q3Prompt: (finalP) => `Η τελική τιμή ενός προϊόντος μαζί με Φ.Π.Α. 24 % είναι ${finalP} €. Ποια ήταν η καθαρή αρχική τιμή του χωρίς τον φόρο σε €; (γράψε μόνο τον αριθμό)`,
    q3Explain: (finalP, clean) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        Η τελική τιμή αντιστοιχεί στο 124 % της καθαρής αξίας. Καθαρή αξία: <Fraction num={`${finalP} · 100`} den="124" /> ＝ {clean} €.
      </span>
    ),

    q4Title: "Η Μεγάλη Παγίδα των Ποσοστών",
    q4Prompt: "Αν πληρώσαμε 80 € για ένα προϊόν μετά από έκπτωση 20 %, είναι σωστό να πούμε ότι η αρχική τιμή ήταν 80 ＋ 20 % των 80 ＝ 96 €;",
    q4Correct: "Όχι, γιατί το 20% υπολογίστηκε στην αρχική τιμή (που ήταν μεγαλύτερη) και όχι στα 80 €",
    q4Distractors: [
      "Ναι, γιατί 80 ＋ 20% ισούται πάντα με την αρχική τιμή",
      "Ναι, αρκεί να προσθέσουμε και 20 € επιπλέον",
      "Όχι, γιατί στις εκπτώσεις κάνουμε μόνο πολλαπλασιασμό με το 100",
      "Ναι, αρκεί να αφαιρέσουμε το 20% από το 100"
    ],
    q4Explain: () => (
      <span className="inline-flex items-center flex-wrap gap-1">
        Είναι λάθος! Η έκπτωση 20% αφαιρέθηκε από την αρχική τιμή (το 100%), άρα τα 80 € αντιστοιχούν στο 80%. Η πραγματική αρχική τιμή ήταν: <Fraction num="80 · 100" den="80" /> ＝ 100 €.
      </span>
    ),

    q5Title: "Διαίρεση με Δεκαδικό Συντελεστή",
    q5Prompt: (finalP) => `Ένα ποσό μετά από αύξηση 10 % διαμορφώθηκε στα ${finalP} €. Διαιρώντας με τον συντελεστή 1,10, ποια ήταν η αρχική τιμή σε €; (γράψε μόνο τον αριθμό)`,
    q5Explain: (finalP, orig) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        Διαιρούμε την τελική τιμή με τον συντελεστή: <Fraction num={finalP} den="1,10" /> ＝ {orig} €.
      </span>
    ),

    q6Title: "Ο Μαθηματικός Τύπος",
    q6Prompt: "Ποιος είναι ο σωστός τύπος για να βρούμε την αρχική τιμή όταν γνωρίζουμε την τελική τιμή και το ποσοστό έκπτωσης;",
    q6Correct: "Αρχική Τιμή ＝ (Τελική Τιμή · 100) : (100 － Έκπτωση %)",
    q6Distractors: [
      "Αρχική Τιμή ＝ Τελική Τιμή ＋ (Τελική Τιμή · Έκπτωση %)",
      "Αρχική Τιμή ＝ (Τελική Τιμή · Έκπτωση %) : 100",
      "Αρχική Τιμή ＝ (Τελική Τιμή · 100) : Έκπτωση %",
      "Αρχική Τιμή ＝ (Τελική Τιμή · 100) : (100 ＋ Έκπτωση %)"
    ],
    q6Explain: () => (
      <span className="inline-flex items-center flex-wrap gap-1">
        Από τον πίνακα ποσών με χιαστί προκύπτει: Αρχική Τιμή ＝ <Fraction num="Τελική Τιμή · 100" den="100 － Έκπτωση %" />.
      </span>
    ),

    problemBadge: "Πρόβλημα",
    hardProblemBadge: "Σύνθετο Πρόβλημα"
  },
  en: {
    metaTitle: "Exercises: Finding Original Price in Percentages - Grade 6 | LearnMaths.gr",
    metaDesc: "Interactive practice exercises with 10 questions and auto-grading on finding the original price and avoiding percentage traps for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "Theory",
    badgeChapter: "CHAPTER 52 • GRADE 6 • PRACTICE",
    heroTitle: "Interactive Exercises: Finding the Original Price",
    heroDesc: "Solve the 10 dynamic questions to master calculating pre-discount and pre-tax values and avoiding common percentage pitfalls!",
    newQuestionsBtn: "New Questions",
    exercisePrefix: "Exercise",
    inputPlaceholder: "Answer...",
    inputPlaceholderDecimal: "e.g. 45.5",
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
    q1Title: "Finding Original Price After Discount",
    q1Prompt: (finalP) => `A pair of trousers is sold on sale for ${finalP} € with a 20 % discount. What was its original price in euros (€)? (write only the number)`,
    q1Explain: (finalP, orig) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        The final price (${finalP} €) corresponds to 80 % of the original (100 － 20). Original price: <Fraction num={`${finalP} · 100`} den="80" /> ＝ ${orig} €.
      </span>
    ),

    q2Title: "Matching Final Price Percentage",
    q2Prompt: (disc) => `If an item has a ${disc} % discount, what percentage (%) of the original price does the paid final price represent?`,
    q2Explain: (disc, pct) => `Since a ${disc} % discount is deducted from the base 100 %, we pay the remaining: 100 % － ${disc} % ＝ ${pct} %.`,

    q3Title: "Finding Net Value Before Tax (VAT)",
    q3Prompt: (finalP) => `The final price of an item including 24 % VAT is ${finalP} €. What was its net original price before tax in euros (€)? (write only the number)`,
    q3Explain: (finalP, clean) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        The final price corresponds to 124 % of the net value. Net value: <Fraction num={`${finalP} · 100`} den="124" /> ＝ ${clean} €.
      </span>
    ),

    q4Title: "The Common Percentage Trap",
    q4Prompt: "If we paid 80 € for an item after a 20 % discount, is it correct to say the original price was 80 ＋ 20 % of 80 ＝ 96 €?",
    q4Correct: "No, because the 20% was calculated on the original price (which was larger) and not on 80 €",
    q4Distractors: [
      "Yes, because 80 ＋ 20% always equals the original price",
      "Yes, provided we also add 20 € extra",
      "No, because in discounts we only multiply by 100",
      "Yes, provided we subtract 20% from 100"
    ],
    q4Explain: () => (
      <span className="inline-flex items-center flex-wrap gap-1">
        It is wrong! The 20% discount was deducted from the original price (100%), so 80 € represents 80%. The real original price was: <Fraction num="80 · 100" den="80" /> ＝ 100 €.
      </span>
    ),

    q5Title: "Division by Decimal Multiplier",
    q5Prompt: (finalP) => `An amount after a 10 % increase reached ${finalP} €. Dividing by the multiplier 1.10, what was the original price in euros (€)? (write only the number)`,
    q5Explain: (finalP, orig) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        We divide the final amount by the multiplier: <Fraction num={finalP} den="1.10" /> ＝ ${orig} €.
      </span>
    ),

    q6Title: "The Mathematical Formula",
    q6Prompt: "What is the correct formula to find the original price when given the final price and discount rate?",
    q6Correct: "Original Price ＝ (Final Price · 100) : (100 － Discount %)",
    q6Distractors: [
      "Original Price ＝ Final Price ＋ (Final Price · Discount %)",
      "Original Price ＝ (Final Price · Discount %) : 100",
      "Original Price ＝ (Final Price · 100) : Discount %",
      "Original Price ＝ (Final Price · 100) : (100 ＋ Discount %)"
    ],
    q6Explain: () => (
      <span className="inline-flex items-center flex-wrap gap-1">
        From the proportion table with cross-multiplication: Original Price ＝ <Fraction num="Final Price · 100" den="100 － Discount %" />.
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
    id: 'arx_std_1',
    generate: (locale) => {
      const isEl = locale === 'el';
      const origPrice = pickRandom([50, 60, 80, 100, 120, 150]);
      const discPct = pickRandom([10, 20, 25, 30, 40]);
      const finalPrice = origPrice * (1 - discPct / 100);
      const remainingPct = 100 - discPct;
      return {
        title: isEl ? 'Αρχική Τιμή Παπουτσιών μετά από Έκπτωση' : 'Original Shoe Price After Discount',
        prompt: isEl
          ? `Στις εκπτώσεις ένα ζευγάρι παπούτσια πωλήθηκε προς ${formatNum(finalPrice, locale)} € με έκπτωση ${discPct} %. Ποια ήταν η αρχική τιμή των παπουτσιών σε €; (γράψε μόνο τον αριθμό)`
          : `On sale a pair of shoes was sold for ${formatNum(finalPrice, locale)} € with a ${discPct} % discount. What was the original price of the shoes in euros (€)? (write only the number)`,
        promptMcq: isEl
          ? `Στις εκπτώσεις ένα ζευγάρι παπούτσια πωλήθηκε προς ${formatNum(finalPrice, locale)} € με έκπτωση ${discPct} %. Ποια ήταν η αρχική τιμή των παπουτσιών σε €;`
          : `On sale a pair of shoes was sold for ${formatNum(finalPrice, locale)} € with a ${discPct} % discount. What was the original price of the shoes in euros (€)?`,
        correctVal: formatNum(origPrice, locale),
        correctText: `${formatNum(origPrice, locale)} €`,
        tableData: [
          { item: isEl ? 'Ποσοστό τελικής τιμής' : 'Final price percentage', formula: `100 % － ${discPct} %`, val: `${remainingPct} %` },
          { item: isEl ? 'Τελική τιμή πληρωμής' : 'Final payment price', formula: `${formatNum(finalPrice, locale)} €`, val: `${formatNum(finalPrice, locale)} €` },
          {
            item: isEl ? 'Υπολογισμός αρχικής τιμής (100%)' : 'Original price calculation (100%)',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={`${formatNum(finalPrice, locale)} · 100`} den={remainingPct} />
              </span>
            ),
            val: `${formatNum(origPrice, locale)} €`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Η τελική τιμή ({formatNum(finalPrice, locale)} €) αντιστοιχεί στο {remainingPct} % της αρχικής αξίας. Με σταυρωτό γινόμενο: x ＝ <Fraction num={`${formatNum(finalPrice, locale)} · 100`} den={remainingPct} /> ＝ {formatNum(origPrice, locale)} €.
              </>
            ) : (
              <>
                The final price (${formatNum(finalPrice, locale)} €) represents {remainingPct} % of the original value. By cross-multiplication: x ＝ <Fraction num={`${formatNum(finalPrice, locale)} · 100`} den={remainingPct} /> ＝ {formatNum(origPrice, locale)} €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(origPrice + 20, locale)} €`,
          `${formatNum(Math.max(10, origPrice - 15), locale)} €`,
          `${formatNum(origPrice + 30, locale)} €`,
          `${formatNum(origPrice + 10, locale)} €`
        ]
      };
    }
  },
  {
    id: 'arx_std_2',
    generate: (locale) => {
      const isEl = locale === 'el';
      const cleanPrice = pickRandom([200, 300, 400, 500, 600]);
      const vatPct = 24;
      const finalPrice = cleanPrice * 1.24;
      return {
        title: isEl ? 'Καθαρή Αξία Υπολογιστή προ Φ.Π.Α.' : 'Computer Net Price Before VAT',
        prompt: isEl
          ? `Η τελική τιμή ενός φορητού υπολογιστή μαζί με τον φόρο Φ.Π.Α. ${vatPct} % είναι ${formatNum(finalPrice, locale)} €. Ποια ήταν η καθαρή αρχική αξία του υπολογιστή χωρίς τον φόρο σε €; (γράψε μόνο τον αριθμό)`
          : `The final price of a laptop including ${vatPct} % VAT is ${formatNum(finalPrice, locale)} €. What was the net original value of the laptop before tax in euros (€)? (write only the number)`,
        promptMcq: isEl
          ? `Η τελική τιμή ενός φορητού υπολογιστή μαζί με τον φόρο Φ.Π.Α. ${vatPct} % είναι ${formatNum(finalPrice, locale)} €. Ποια ήταν η καθαρή αρχική αξία του υπολογιστή χωρίς τον φόρο σε €;`
          : `The final price of a laptop including ${vatPct} % VAT is ${formatNum(finalPrice, locale)} €. What was the net original value of the laptop before tax in euros (€)?`,
        correctVal: formatNum(cleanPrice, locale),
        correctText: `${formatNum(cleanPrice, locale)} €`,
        tableData: [
          { item: isEl ? 'Ποσοστό τελικής τιμής' : 'Final price percentage', formula: `100 % ＋ 24 %`, val: '124 %' },
          { item: isEl ? 'Τελική τιμή με φόρο' : 'Final price with tax', formula: `${formatNum(finalPrice, locale)} €`, val: `${formatNum(finalPrice, locale)} €` },
          {
            item: isEl ? 'Καθαρή αξία (100%)' : 'Net value (100%)',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={`${formatNum(finalPrice, locale)} · 100`} den="124" />
              </span>
            ),
            val: `${formatNum(cleanPrice, locale)} €`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Η τελική τιμή αντιστοιχεί στο 124 % της καθαρής αξίας. Με σταυρωτό γινόμενο: x ＝ <Fraction num={`${formatNum(finalPrice, locale)} · 100`} den="124" /> ＝ {formatNum(cleanPrice, locale)} €.
              </>
            ) : (
              <>
                The final price corresponds to 124 % of the net value. By cross-multiplication: x ＝ <Fraction num={`${formatNum(finalPrice, locale)} · 100`} den="124" /> ＝ {formatNum(cleanPrice, locale)} €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(cleanPrice + 50, locale)} €`,
          `${formatNum(Math.max(50, cleanPrice - 40), locale)} €`,
          `${formatNum(cleanPrice + 80, locale)} €`,
          `${formatNum(cleanPrice + 30, locale)} €`
        ]
      };
    }
  },
  {
    id: 'arx_std_3',
    generate: (locale) => {
      const isEl = locale === 'el';
      const origBill = pickRandom([40, 50, 70, 80, 100]);
      const discPct = pickRandom([15, 20, 25, 30]);
      const finalBill = origBill * (1 - discPct / 100);
      const remainingPct = 100 - discPct;
      return {
        title: isEl ? 'Αρχικός Λογαριασμός Αγορών' : 'Original Shopping Bill',
        prompt: isEl
          ? `Ένας πελάτης πλήρωσε στο ταμείο ενός καταστήματος ${formatNum(finalBill, locale)} €, αφού του έγινε έκπτωση ${discPct} %. Πόσο κόστιζαν αρχικά τα προϊόντα που αγόρασε σε €; (γράψε μόνο τον αριθμό)`
          : `A customer paid ${formatNum(finalBill, locale)} € at a store register after receiving a ${discPct} % discount. What was the original cost of the purchased items in euros (€)? (write only the number)`,
        promptMcq: isEl
          ? `Ένας πελάτης πλήρωσε στο ταμείο ενός καταστήματος ${formatNum(finalBill, locale)} €, αφού του έγινε έκπτωση ${discPct} %. Πόσο κόστιζαν αρχικά τα προϊόντα που αγόρασε σε €;`
          : `A customer paid ${formatNum(finalBill, locale)} € at a store register after receiving a ${discPct} % discount. What was the original cost of the purchased items in euros (€)?`,
        correctVal: formatNum(origBill, locale),
        correctText: `${formatNum(origBill, locale)} €`,
        tableData: [
          { item: isEl ? 'Ποσοστό πληρωμής' : 'Payment percentage', formula: `100 % － ${discPct} %`, val: `${remainingPct} %` },
          { item: isEl ? 'Ποσό πληρωμής' : 'Paid amount', formula: `${formatNum(finalBill, locale)} €`, val: `${formatNum(finalBill, locale)} €` },
          {
            item: isEl ? 'Αρχικό ποσό' : 'Original amount',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={`${formatNum(finalBill, locale)} · 100`} den={remainingPct} />
              </span>
            ),
            val: `${formatNum(origBill, locale)} €`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Τα {formatNum(finalBill, locale)} € είναι το {remainingPct} % της αρχικής τιμής. Άρα: x ＝ <Fraction num={`${formatNum(finalBill, locale)} · 100`} den={remainingPct} /> ＝ {formatNum(origBill, locale)} €.
              </>
            ) : (
              <>
                The {formatNum(finalBill, locale)} € represents {remainingPct} % of the original price. Thus: x ＝ <Fraction num={`${formatNum(finalBill, locale)} · 100`} den={remainingPct} /> ＝ {formatNum(origBill, locale)} €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(origBill + 15, locale)} €`,
          `${formatNum(Math.max(10, origBill - 10), locale)} €`,
          `${formatNum(origBill + 20, locale)} €`,
          `${formatNum(origBill + 5, locale)} €`
        ]
      };
    }
  },
  {
    id: 'arx_std_4',
    generate: (locale) => {
      const isEl = locale === 'el';
      const origRent = pickRandom([300, 350, 400, 450, 500]);
      const incPct = 10;
      const newRent = origRent * 1.1;
      return {
        title: isEl ? 'Ενοίκιο Καταστήματος προ Αύξησης' : 'Store Rent Before Increase',
        prompt: isEl
          ? `Το ενοίκιο ενός καταστήματος αυξήθηκε κατά ${incPct} % και διαμορφώθηκε στα ${formatNum(newRent, locale)} €. Ποιο ήταν το ενοίκιο πριν από την αύξηση σε €; (γράψε μόνο τον αριθμό)`
          : `The rent of a store increased by ${incPct} % and reached ${formatNum(newRent, locale)} €. What was the rent before the increase in euros (€)? (write only the number)`,
        promptMcq: isEl
          ? `Το ενοίκιο ενός καταστήματος αυξήθηκε κατά ${incPct} % και διαμορφώθηκε στα ${formatNum(newRent, locale)} €. Ποιο ήταν το ενοίκιο πριν από την αύξηση σε €;`
          : `The rent of a store increased by ${incPct} % and reached ${formatNum(newRent, locale)} €. What was the rent before the increase in euros (€)?`,
        correctVal: formatNum(origRent, locale),
        correctText: `${formatNum(origRent, locale)} €`,
        tableData: [
          { item: isEl ? 'Ποσοστό νέου ενοικίου' : 'New rent percentage', formula: `100 % ＋ ${incPct} %`, val: '110 %' },
          { item: isEl ? 'Νέο ενοίκιο' : 'New rent', formula: `${formatNum(newRent, locale)} €`, val: `${formatNum(newRent, locale)} €` },
          {
            item: isEl ? 'Αρχικό ενοίκιο προ αύξησης' : 'Initial rent before increase',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={formatNum(newRent, locale)} den={formatNum(1.1, locale, 2)} />
              </span>
            ),
            val: `${formatNum(origRent, locale)} €`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Το νέο ενοίκιο αντιστοιχεί στο 110 % του παλαιού. Με διαίρεση: <Fraction num={formatNum(newRent, locale)} den="1,10" /> ＝ {formatNum(origRent, locale)} €.
              </>
            ) : (
              <>
                The new rent represents 110 % of the original. By division: <Fraction num={formatNum(newRent, locale)} den="1.10" /> ＝ {formatNum(origRent, locale)} €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(origRent + 30, locale)} €`,
          `${formatNum(Math.max(50, origRent - 25), locale)} €`,
          `${formatNum(origRent + 50, locale)} €`,
          `${formatNum(origRent + 15, locale)} €`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'arx_hard_1',
    generate: (locale) => {
      const isEl = locale === 'el';
      return {
        title: isEl ? 'Αρχική Καθαρή Αξία με Έκπτωση και Φ.Π.Α.' : 'Original Net Value with Discount and VAT',
        prompt: isEl
          ? `Ένα προϊόν πωλήθηκε τελικά προς ${formatNum(148.8, locale, 2)} € συμπεριλαμβανομένου Φ.Π.Α. 24 %, αφού προηγουμένως είχε γίνει έκπτωση 20 % επί της αρχικής καθαρής αξίας του. Ποια ήταν η αρχική καθαρή αξία του προϊόντος σε €; (γράψε μόνο τον αριθμό)`
          : `A product was finally sold for ${formatNum(148.8, locale, 2)} € including 24 % VAT, after a 20 % discount had been applied to its original net value. What was the original net value in euros (€)? (write only the number)`,
        promptMcq: isEl
          ? `Ένα προϊόν πωλήθηκε τελικά προς ${formatNum(148.8, locale, 2)} € συμπεριλαμβανομένου Φ.Π.Α. 24 %, αφού προηγουμένως είχε γίνει έκπτωση 20 % επί της αρχικής καθαρής αξίας του. Ποια ήταν η αρχική καθαρή αξία του προϊόντος σε €;`
          : `A product was finally sold for ${formatNum(148.8, locale, 2)} € including 24 % VAT, after a 20 % discount had been applied to its original net value. What was the original net value in euros (€)?`,
        correctVal: formatNum(150, locale),
        correctText: `${formatNum(150, locale)} €`,
        tableData: [
          {
            item: isEl ? '1ο Βήμα: Τιμή μετά την έκπτωση (προ Φ.Π.Α.)' : 'Step 1: Price after discount (before VAT)',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={formatNum(148.8, locale, 2)} den={formatNum(1.24, locale, 2)} />
              </span>
            ),
            val: '120 €'
          },
          {
            item: isEl ? '2ο Βήμα: Αρχική καθαρή αξία (100%)' : 'Step 2: Original net value (100%)',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num="120 · 100" den="80" />
              </span>
            ),
            val: '150 €'
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                1ο Βήμα: Τιμή μετά την έκπτωση (προ Φ.Π.Α.): <Fraction num="148,80" den="1,24" /> ＝ 120 €. 2ο Βήμα: Τα 120 € αντιστοιχούν στο 80 % της αρχικής καθαρής αξίας: <Fraction num="120 · 100" den="80" /> ＝ 150 €.
              </>
            ) : (
              <>
                Step 1: Price after discount (before VAT): <Fraction num="148.80" den="1.24" /> ＝ 120 €. Step 2: The 120 € corresponds to 80 % of the original net value: <Fraction num="120 · 100" den="80" /> ＝ 150 €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(140, locale)} €`,
          `${formatNum(160, locale)} €`,
          `${formatNum(155, locale)} €`,
          `${formatNum(135, locale)} €`
        ]
      };
    }
  },
  {
    id: 'arx_hard_2',
    generate: (locale) => {
      const isEl = locale === 'el';
      return {
        title: isEl ? 'Υπολογισμός Ποσοστού Έκπτωσης από Όφελος' : 'Discount Rate Calculation from Savings',
        prompt: isEl
          ? 'Σε ένα κατάστημα ρούχων, ένας αγοραστής πλήρωσε 90 € για ένα σακάκι και διαπίστωσε ότι εξοικονόμησε 30 € λόγω της έκπτωσης. Ποιο ήταν το ποσοστό (%) της έκπτωσης που του έγινε; (γράψε μόνο τον αριθμό)'
          : 'At a clothing store, a buyer paid 90 € for a jacket and saved 30 € due to a discount. What was the discount rate (%); (write only the number)',
        promptMcq: isEl
          ? 'Σε ένα κατάστημα ρούχων, ένας αγοραστής πλήρωσε 90 € για ένα σακάκι και διαπίστωσε ότι εξοικονόμησε 30 € λόγω της έκπτωσης. Ποιο ήταν το ποσοστό (%) της έκπτωσης που του έγινε;'
          : 'At a clothing store, a buyer paid 90 € for a jacket and saved 30 € due to a discount. What was the discount rate (%);',
        correctVal: '25',
        correctText: '25 %',
        tableData: [
          { item: isEl ? 'Αρχική τιμή καταλόγου' : 'Original catalog price', formula: '90 ＋ 30', val: '120 €' },
          {
            item: isEl ? 'Υπολογισμός ποσοστού έκπτωσης' : 'Discount rate calculation',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num="30" den="120" /> · 100
              </span>
            ),
            val: '25 %'
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Αρχική τιμή: 90 ＋ 30 ＝ 120 €. Ποσοστό έκπτωσης ως προς την αρχική τιμή: <Fraction num="30" den="120" /> · 100 ＝ 25 %.
              </>
            ) : (
              <>
                Original price: 90 ＋ 30 ＝ 120 €. Discount rate relative to original price: <Fraction num="30" den="120" /> · 100 ＝ 25 %.
              </>
            )}
          </span>
        ),
        distractors: ['30 %', '20 %', '35 %', '15 %']
      };
    }
  },
  {
    id: 'arx_hard_3',
    generate: (locale) => {
      const isEl = locale === 'el';
      return {
        title: isEl ? 'Αρχικός Μισθός μετά από Διαδοχικές Μεταβολές' : 'Original Salary After Successive Changes',
        prompt: isEl
          ? 'Ο μισθός ενός εργαζομένου αυξήθηκε κατά 10 % και στη συνέχεια ο νέος μισθός μειώθηκε κατά 10 %, φτάνοντας τα 990 €. Ποιος ήταν ο αρχικός μισθός του εργαζομένου σε €; (γράψε μόνο τον αριθμό)'
          : 'An employee\'s salary increased by 10 % and then the new salary decreased by 10 %, reaching 990 €. What was the original salary in euros (€)? (write only the number)',
        promptMcq: isEl
          ? 'Ο μισθός ενός εργαζομένου αυξήθηκε κατά 10 % και στη συνέχεια ο νέος μισθός μειώθηκε κατά 10 %, φτάνοντας τα 990 €. Ποιος ήταν ο αρχικός μισθός του εργαζομένου σε €;'
          : 'An employee\'s salary increased by 10 % and then the new salary decreased by 10 %, reaching 990 €. What was the original salary in euros (€)?',
        correctVal: formatNum(1000, locale),
        correctText: `${formatNum(1000, locale)} €`,
        tableData: [
          {
            item: isEl ? '1ο Βήμα: Προ μείωσης 10%' : 'Step 1: Before 10% decrease',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num="990" den={formatNum(0.9, locale, 2)} />
              </span>
            ),
            val: `${formatNum(1100, locale)} €`
          },
          {
            item: isEl ? '2ο Βήμα: Προ αύξησης 10%' : 'Step 2: Before 10% increase',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={formatNum(1100, locale)} den={formatNum(1.1, locale, 2)} />
              </span>
            ),
            val: `${formatNum(1000, locale)} €`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                1ο Βήμα: Πριν από τη μείωση 10%: <Fraction num="990" den="0,90" /> ＝ 1.100 €. 2ο Βήμα: Πριν από την αύξηση 10%: <Fraction num="1.100" den="1,10" /> ＝ 1.000 €.
              </>
            ) : (
              <>
                Step 1: Before 10% decrease: <Fraction num="990" den="0.90" /> ＝ 1,100 €. Step 2: Before 10% increase: <Fraction num="1,100" den="1.10" /> ＝ 1,000 €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(990, locale)} €`,
          `${formatNum(1050, locale)} €`,
          `${formatNum(980, locale)} €`,
          `${formatNum(1020, locale)} €`
        ]
      };
    }
  },
  {
    id: 'arx_hard_4',
    generate: (locale) => {
      const isEl = locale === 'el';
      return {
        title: isEl ? 'Αρχικές Αποταμιεύσεις από Υπόλοιπο Χρημάτων' : 'Original Savings From Remaining Balance',
        prompt: isEl
          ? 'Μια μαθήτρια ξόδεψε το 35 % των αποταμιεύσεών της και της απέμειναν 325 €. Πόσα ευρώ (€) είχε συνολικά αποταμιεύσει αρχικά; (γράψε μόνο τον αριθμό)'
          : 'A student spent 35 % of her savings and had 325 € left. How much had she originally saved in euros (€)? (write only the number)',
        promptMcq: isEl
          ? 'Μια μαθήτρια ξόδεψε το 35 % των αποταμιεύσεών της και της απέμειναν 325 €. Πόσα ευρώ (€) είχε συνολικά αποταμιεύσει αρχικά;'
          : 'A student spent 35 % of her savings and had 325 € left. How much had she originally saved in euros (€)?',
        correctVal: formatNum(500, locale),
        correctText: `${formatNum(500, locale)} €`,
        tableData: [
          { item: isEl ? 'Ποσοστό χρημάτων που απέμειναν' : 'Percentage of remaining money', formula: '100 % － 35 %', val: '65 %' },
          {
            item: isEl ? 'Συνολικό αρχικό ποσό (100%)' : 'Total original amount (100%)',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num="325 · 100" den="65" />
              </span>
            ),
            val: '500 €'
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Τα χρήματα που απέμειναν αντιστοιχούν στο: 100 % － 35 % ＝ 65 %. Αρχικό ποσό: <Fraction num="325 · 100" den="65" /> ＝ 500 €.
              </>
            ) : (
              <>
                The remaining money corresponds to: 100 % － 35 % ＝ 65 %. Original amount: <Fraction num="325 · 100" den="65" /> ＝ 500 €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(450, locale)} €`,
          `${formatNum(550, locale)} €`,
          `${formatNum(480, locale)} €`,
          `${formatNum(520, locale)} €`
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.el;

  // Q1: Input - Εύρεση αρχικής τιμής μετά από έκπτωση 20%
  const q1Orig = pickRandom([50, 80, 100, 120]);
  const q1Final = q1Orig * 0.8;

  // Q2: MCQ - Αντιστοίχιση ποσοστού τελικής τιμής (4 μοναδικές επιλογές)
  const q2Disc = pickRandom([15, 25, 30, 40]);
  const q2CorrectPct = 100 - q2Disc;
  const q2WrongCandidates = [
    `${q2Disc} %`,
    `${100 + q2Disc} %`,
    '100 %',
    `${q2CorrectPct - 10} %`
  ];
  const q2Options = makeUniqueOptions(`${q2CorrectPct} %`, q2WrongCandidates).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q3: Input - Εύρεση αρχικής αξίας προ φόρου
  const q3Clean = pickRandom([100, 200, 250, 400]);
  const q3Final = q3Clean * 1.24;

  // Q4: MCQ - Η μεγάλη παγίδα (4 μοναδικές επιλογές)
  const q4Options = makeUniqueOptions(t.q4Correct, t.q4Distractors).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q5: Input - Διαίρεση με δεκαδικό συντελεστή
  const q5Orig = pickRandom([40, 60, 90, 110]);
  const q5Final = q5Orig * 1.1;

  // Q6: MCQ - Ο μαθηματικός τύπος (4 μοναδικές επιλογές)
  const q6Options = makeUniqueOptions(t.q6Correct, t.q6Distractors).map((v) => ({
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
      title: t.q1Title,
      prompt: t.q1Prompt(formatNum(q1Final, locale)),
      correct: formatNum(q1Orig, locale),
      explain: t.q1Explain(formatNum(q1Final, locale), formatNum(q1Orig, locale))
    },
    {
      id: 'q2',
      type: 'mcq',
      title: t.q2Title,
      prompt: t.q2Prompt(q2Disc),
      options: q2Options,
      correct: `${q2CorrectPct} %`,
      explain: t.q2Explain(q2Disc, q2CorrectPct)
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: t.q3Title,
      prompt: t.q3Prompt(formatNum(q3Final, locale)),
      correct: formatNum(q3Clean, locale),
      explain: t.q3Explain(formatNum(q3Final, locale), formatNum(q3Clean, locale))
    },
    {
      id: 'q4',
      type: 'mcq',
      title: t.q4Title,
      prompt: t.q4Prompt,
      options: q4Options,
      correct: t.q4Correct,
      explain: t.q4Explain()
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: t.q5Title,
      prompt: t.q5Prompt(formatNum(q5Final, locale)),
      correct: formatNum(q5Orig, locale),
      explain: t.q5Explain(formatNum(q5Final, locale), formatNum(q5Orig, locale))
    },
    {
      id: 'q6',
      type: 'mcq',
      title: t.q6Title,
      prompt: t.q6Prompt,
      options: q6Options,
      correct: t.q6Correct,
      explain: t.q6Explain()
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
      inputType: 'decimal',
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

export default function BriskoArxikiTimiExercisesPage() {
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
          href="/st-dimotikou/52-brisko-arxiki-timi"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0 max-w-full"
        >
          <span>📖</span>
          <span className="truncate">{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="w-full min-w-0 max-w-full bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 w-full min-w-0">
            <div className="space-y-2 max-w-3xl min-w-0 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200 max-w-full">
                <span className="break-words [overflow-wrap:anywhere]">{t.badgeChapter}</span>
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
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation max-w-full"
            >
              <span>🔄</span>
              <span className="break-words [overflow-wrap:anywhere]">{toCleanUppercase(t.newQuestionsBtn)}</span>
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
                        {toCleanUppercase(`${t.exercisePrefix} ${qNum}: ${q.title}`)}
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
                          placeholder={q.inputType === 'decimal' ? t.inputPlaceholderDecimal : t.inputPlaceholder}
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
                          {isQuestionCorrect(q) ? t.feedbackSuccess : t.feedbackExplain}
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
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 w-full min-w-0">
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center sm:justify-start">
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
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation max-w-full"
              >
                <span>🔄</span>
                <span className="break-words [overflow-wrap:anywhere]">{toCleanUppercase(t.newQuestionsBtn)}</span>
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
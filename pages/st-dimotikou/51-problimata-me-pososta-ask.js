// pages/st-dimotikou/51-problimata-me-pososta-ask.js
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
    metaTitle: "Ασκήσεις: Προβλήματα με Ποσοστά - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα προβλήματα με εκπτώσεις, αυξήσεις, Φ.Π.Α. και τελικές τιμές για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 51 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Διαδραστικές Ασκήσεις: Προβλήματα με Ποσοστά",
    heroDesc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στον υπολογισμό εκπτώσεων, αυξήσεων, φόρου Φ.Π.Α. και τελικής τιμής πληρωμής σε ρεαλιστικά σενάρια!",
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
    q1Title: "Υπολογισμός Ποσού Έκπτωσης",
    q1Prompt: (orig) => `Σε ένα προϊόν αξίας ${orig} € γίνεται έκπτωση 20 %. Πόσα ευρώ (€) είναι η έκπτωση; (γράψε μόνο τον αριθμό)`,
    q1Explain: (orig, disc) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        Έκπτωση: <Fraction num={`${orig} · 20`} den="100" /> ＝ {disc} €.
      </span>
    ),

    q2Title: "Εύρεση Τελικής Τιμής σε Έκπτωση",
    q2Prompt: "Πώς υπολογίζουμε την τελική τιμή πληρωμής ενός προϊόντος όταν γνωρίζουμε την αρχική τιμή και το ποσό της έκπτωσης;",
    q2Correct: "Αφαιρούμε το ποσό της έκπτωσης από την αρχική τιμή",
    q2Distractors: [
      "Προσθέτουμε το ποσό της έκπτωσης στην αρχική τιμή",
      "Διαιρούμε την αρχική τιμή με το ποσό της έκπτωσης",
      "Η τελική τιμή είναι πάντοτε ίση με το ποσό της έκπτωσης",
      "Πολλαπλασιάζουμε την αρχική τιμή με το ποσό της έκπτωσης"
    ],
    q2Explain: "Στις εκπτώσεις η τιμή μειώνεται, επομένως αφαιρούμε την έκπτωση από την αρχική τιμή: Τελική Τιμή ＝ Αρχική Τιμή － Έκπτωση.",

    q3Title: "Τελική Τιμή μετά από Έκπτωση",
    q3Prompt: (orig) => `Ένα ρούχο κοστίζει ${orig} € και έχει έκπτωση 10 %. Πόσα ευρώ (€) θα πληρώσει ο πελάτης; (γράψε μόνο τον αριθμό)`,
    q3Explain: (orig, disc, finalP) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        Έκπτωση: <Fraction num={`${orig} · 10`} den="100" /> ＝ {disc} €. Τελική τιμή: {orig} － {disc} ＝ {finalP} €.
      </span>
    ),

    q4Title: "Επιβάρυνση Φόρου Φ.Π.Α.",
    q4Prompt: "Πώς επηρεάζει ο φόρος προστιθέμενης αξίας (Φ.Π.Α.) την τελική τιμή που πληρώνει ο καταναλωτής;",
    q4Correct: "Προσθέτουμε τον φόρο Φ.Π.Α. στην καθαρή αρχική αξία του προϊόντος",
    q4Distractors: [
      "Αφαιρούμε τον φόρο Φ.Π.Α. από την καθαρή αρχική αξία",
      "Ο φόρος Φ.Π.Α. δεν αλλάζει καθόλου την τελική τιμή",
      "Διαιρούμε την αρχική τιμή με το 24",
      "Πολλαπλασιάζουμε την αρχική τιμή με το 24 χωρίς διαίρεση"
    ],
    q4Explain: "Ο φόρος Φ.Π.Α. αποτελεί επιβάρυνση, επομένως προστίθεται στην καθαρή αξία του προϊόντος: Τελική Τιμή ＝ Καθαρή Αξία ＋ Φ.Π.Α.",

    q5Title: "Τελική Τιμή με Φ.Π.Α.",
    q5Prompt: (clean) => `Ένα προϊόν έχει καθαρή αξία ${clean} € και επιβαρύνεται με Φ.Π.Α. 24 %. Ποια είναι η τελική τιμή σε €; (γράψε μόνο τον αριθμό)`,
    q5Explain: (clean, vat, finalVal) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        Φόρος: <Fraction num={`${clean} · 24`} den="100" /> ＝ {vat} €. Τελική τιμή: {clean} ＋ {vat} ＝ {finalVal} €.
      </span>
    ),

    q6Title: "Απευθείας Υπολογισμός Τελικής Τιμής",
    q6Prompt: "Πώς μπορούμε να βρούμε απευθείας την τελική τιμή ενός προϊόντος μετά από έκπτωση 25 % σε ένα μόνο βήμα;",
    q6Correct: "Πολλαπλασιάζουμε την αρχική τιμή με 0,75 (καθώς 100% － 25% ＝ 75%)",
    q6Distractors: [
      "Πολλαπλασιάζουμε την αρχική τιμή με 0,25 και αυτό είναι η τελική τιμή",
      "Διαιρούμε την αρχική τιμή με το 75",
      "Προσθέτουμε 25 € στην αρχική τιμή",
      "Αφαιρούμε 0,75 € από την αρχική τιμή"
    ],
    q6Explain: "Εφόσον αφαιρείται το 25%, πληρώνουμε το υπόλοιπο 75% της αξίας, δηλαδή πολλαπλασιάζουμε απευθείας με 0,75.",

    problemBadge: "Πρόβλημα",
    hardProblemBadge: "Σύνθετο Πρόβλημα"
  },
  en: {
    metaTitle: "Exercises: Problems with Percentages - Grade 6 | LearnMaths.gr",
    metaDesc: "Interactive practice exercises with 10 questions and auto-grading on discounts, price increases, VAT, and final prices for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "Theory",
    badgeChapter: "CHAPTER 51 • GRADE 6 • PRACTICE",
    heroTitle: "Interactive Exercises: Problems with Percentages",
    heroDesc: "Solve the 10 dynamic questions to master calculating discounts, price markups, VAT, and final retail prices in real-life scenarios!",
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
    q1Title: "Calculating Discount Amount",
    q1Prompt: (orig) => `An item costing ${orig} € is discounted by 20 %. How much is the discount in euros (€)? (write only the number)`,
    q1Explain: (orig, disc) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        Discount: <Fraction num={`${orig} · 20`} den="100" /> ＝ {disc} €.
      </span>
    ),

    q2Title: "Finding Final Price after Discount",
    q2Prompt: "How do we calculate the final price of an item when we know the original price and the discount amount?",
    q2Correct: "We subtract the discount amount from the original price",
    q2Distractors: [
      "We add the discount amount to the original price",
      "We divide the original price by the discount amount",
      "The final price is always equal to the discount amount",
      "We multiply the original price by the discount amount"
    ],
    q2Explain: "In discounts the price decreases, so we subtract the discount amount from the original price: Final Price ＝ Original Price － Discount.",

    q3Title: "Final Price after Discount",
    q3Prompt: (orig) => `A piece of clothing costs ${orig} € and has a 10 % discount. How much will the customer pay in euros (€)? (write only the number)`,
    q3Explain: (orig, disc, finalP) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        Discount: <Fraction num={`${orig} · 10`} den="100" /> ＝ {disc} €. Final price: ${orig} － ${disc} ＝ ${finalP} €.
      </span>
    ),

    q4Title: "VAT / Sales Tax Addition",
    q4Prompt: "How does value-added tax (VAT) affect the final price paid by the consumer?",
    q4Correct: "We add the VAT to the net original price of the product",
    q4Distractors: [
      "We subtract the VAT from the net original price",
      "VAT does not change the final price at all",
      "We divide the original price by 24",
      "We multiply the original price by 24 without division"
    ],
    q4Explain: "VAT is an added tax burden, so it is added to the net price of the product: Final Price ＝ Net Value ＋ VAT.",

    q5Title: "Final Price with 24% VAT",
    q5Prompt: (clean) => `A product has a net price of ${clean} € and is subject to 24 % VAT. What is the final price in euros (€)? (write only the number)`,
    q5Explain: (clean, vat, finalVal) => (
      <span className="inline-flex items-center flex-wrap gap-1">
        Tax: <Fraction num={`${clean} · 24`} den="100" /> ＝ {vat} €. Final price: ${clean} ＋ ${vat} ＝ ${finalVal} €.
      </span>
    ),

    q6Title: "Direct Final Price Calculation",
    q6Prompt: "How can we directly find the final price of an item after a 25 % discount in a single step?",
    q6Correct: "We multiply the original price by 0.75 (since 100% － 25% ＝ 75%)",
    q6Distractors: [
      "We multiply the original price by 0.25 and that is the final price",
      "We divide the original price by 75",
      "We add 25 € to the original price",
      "We subtract 0.75 € from the original price"
    ],
    q6Explain: "Since 25% is subtracted, we pay the remaining 75% of the value, so we directly multiply by 0.75.",

    problemBadge: "Problem",
    hardProblemBadge: "Multi-Step Problem"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY"
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'pos_std_1',
    generate: (locale) => {
      const isEl = locale === 'el';
      const origPrice = pickRandom([50, 60, 80, 100, 120, 150]);
      const discPct = pickRandom([10, 15, 20, 25, 30]);
      const discount = (origPrice * discPct) / 100;
      const finalPrice = origPrice - discount;
      return {
        title: isEl ? 'Υπολογισμός Έκπτωσης σε Παντελόνι' : 'Trousers Discount Calculation',
        prompt: isEl
          ? `Ένα παντελόνι κοστίζει ${origPrice} € και προσφέρεται στις εκπτώσεις με μείωση ${discPct} %. Πόσα ευρώ (€) θα πληρώσει τελικά ο αγοραστής; (γράψε μόνο τον αριθμό)`
          : `A pair of trousers costs ${origPrice} € and is offered on sale with a ${discPct} % discount. How much will the buyer finally pay in euros (€)? (write only the number)`,
        promptMcq: isEl
          ? `Ένα παντελόνι κοστίζει ${origPrice} € και προσφέρεται στις εκπτώσεις με μείωση ${discPct} %. Πόσα ευρώ (€) θα πληρώσει τελικά ο αγοραστής;`
          : `A pair of trousers costs ${origPrice} € and is offered on sale with a ${discPct} % discount. How much will the buyer finally pay in euros (€)?`,
        correctVal: formatNum(finalPrice, locale),
        correctText: `${formatNum(finalPrice, locale)} €`,
        tableData: [
          { item: isEl ? 'Αρχική τιμή' : 'Original price', formula: `${formatNum(origPrice, locale)} €`, val: `${formatNum(origPrice, locale)} €` },
          {
            item: isEl ? 'Ποσό έκπτωσης' : 'Discount amount',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={`${formatNum(origPrice, locale)} · ${discPct}`} den="100" />
              </span>
            ),
            val: `${formatNum(discount, locale)} €`
          },
          { item: isEl ? 'Τελική τιμή πληρωμής' : 'Final price', formula: `${formatNum(origPrice, locale)} － ${formatNum(discount, locale)}`, val: `${formatNum(finalPrice, locale)} €` }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Έκπτωση: <Fraction num={`${formatNum(origPrice, locale)} · ${discPct}`} den="100" /> ＝ {formatNum(discount, locale)} €. Τελική τιμή: {formatNum(origPrice, locale)} － {formatNum(discount, locale)} ＝ {formatNum(finalPrice, locale)} €.
              </>
            ) : (
              <>
                Discount: <Fraction num={`${formatNum(origPrice, locale)} · ${discPct}`} den="100" /> ＝ {formatNum(discount, locale)} €. Final price: {formatNum(origPrice, locale)} － {formatNum(discount, locale)} ＝ {formatNum(finalPrice, locale)} €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(finalPrice + 10, locale)} €`,
          `${formatNum(Math.max(5, finalPrice - 10), locale)} €`,
          `${formatNum(finalPrice + 15, locale)} €`,
          `${formatNum(finalPrice + 5, locale)} €`
        ]
      };
    }
  },
  {
    id: 'pos_std_2',
    generate: (locale) => {
      const isEl = locale === 'el';
      const origPrice = pickRandom([100, 200, 300, 400, 500]);
      const vatPct = 24;
      const vatAmount = (origPrice * vatPct) / 100;
      const finalPrice = origPrice + vatAmount;
      return {
        title: isEl ? 'Υπολογισμός Τελικής Τιμής με Φ.Π.Α.' : 'Final Price with VAT Calculation',
        prompt: isEl
          ? `Ένα ηλεκτρικό ποδήλατο έχει καθαρή αξία ${origPrice} € και επιβαρύνεται με Φ.Π.Α. ${vatPct} %. Ποια είναι η τελική τιμή πώλησής του σε €; (γράψε μόνο τον αριθμό)`
          : `An electric bicycle has a net value of ${origPrice} € and is subject to ${vatPct} % VAT. What is its final retail price in euros (€)? (write only the number)`,
        promptMcq: isEl
          ? `Ένα ηλεκτρικό ποδήλατο έχει καθαρή αξία ${origPrice} € και επιβαρύνεται με Φ.Π.Α. ${vatPct} %. Ποια είναι η τελική τιμή πώλησής του σε €;`
          : `An electric bicycle has a net value of ${origPrice} € and is subject to ${vatPct} % VAT. What is its final retail price in euros (€)?`,
        correctVal: formatNum(finalPrice, locale),
        correctText: `${formatNum(finalPrice, locale)} €`,
        tableData: [
          { item: isEl ? 'Καθαρή αξία' : 'Net value', formula: `${formatNum(origPrice, locale)} €`, val: `${formatNum(origPrice, locale)} €` },
          {
            item: isEl ? 'Φόρος Φ.Π.Α. (24%)' : 'VAT (24%)',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={`${formatNum(origPrice, locale)} · 24`} den="100" />
              </span>
            ),
            val: `${formatNum(vatAmount, locale)} €`
          },
          { item: isEl ? 'Τελική τιμή με φόρο' : 'Final price with tax', formula: `${formatNum(origPrice, locale)} ＋ ${formatNum(vatAmount, locale)}`, val: `${formatNum(finalPrice, locale)} €` }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Φόρος Φ.Π.Α.: <Fraction num={`${formatNum(origPrice, locale)} · 24`} den="100" /> ＝ {formatNum(vatAmount, locale)} €. Τελική τιμή: {formatNum(origPrice, locale)} ＋ {formatNum(vatAmount, locale)} ＝ {formatNum(finalPrice, locale)} €.
              </>
            ) : (
              <>
                VAT: <Fraction num={`${formatNum(origPrice, locale)} · 24`} den="100" /> ＝ {formatNum(vatAmount, locale)} €. Final price: {formatNum(origPrice, locale)} ＋ {formatNum(vatAmount, locale)} ＝ {formatNum(finalPrice, locale)} €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(finalPrice + 24, locale)} €`,
          `${formatNum(Math.max(10, finalPrice - 24), locale)} €`,
          `${formatNum(finalPrice + 48, locale)} €`,
          `${formatNum(finalPrice + 12, locale)} €`
        ]
      };
    }
  },
  {
    id: 'pos_std_3',
    generate: (locale) => {
      const isEl = locale === 'el';
      const costPrice = pickRandom([40, 50, 60, 80]);
      const profitPct = 20;
      const profit = (costPrice * profitPct) / 100;
      const sellingPrice = costPrice + profit;
      return {
        title: isEl ? 'Πώληση Προϊόντος με Κέρδος' : 'Selling Product with Profit',
        prompt: isEl
          ? `Ένας έμπορος αγόρασε ένα προϊόν προς ${costPrice} € και το πουλάει με κέρδος ${profitPct} %. Σε ποια τιμή (€) θα το πουλήσει; (γράψε μόνο τον αριθμό)`
          : `A merchant bought an item for ${costPrice} € and sells it with a ${profitPct} % profit. At what price (€) will it be sold? (write only the number)`,
        promptMcq: isEl
          ? `Ένας έμπορος αγόρασε ένα προϊόν προς ${costPrice} € και το πουλάει με κέρδος ${profitPct} %. Σε ποια τιμή (€) θα το πουλήσει;`
          : `A merchant bought an item for ${costPrice} € and sells it with a ${profitPct} % profit. At what price (€) will it be sold?`,
        correctVal: formatNum(sellingPrice, locale),
        correctText: `${formatNum(sellingPrice, locale)} €`,
        tableData: [
          { item: isEl ? 'Τιμή αγοράς' : 'Cost price', formula: `${formatNum(costPrice, locale)} €`, val: `${formatNum(costPrice, locale)} €` },
          {
            item: isEl ? 'Ποσό κέρδους (20%)' : 'Profit amount (20%)',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={`${formatNum(costPrice, locale)} · 20`} den="100" />
              </span>
            ),
            val: `${formatNum(profit, locale)} €`
          },
          { item: isEl ? 'Τιμή πώλησης' : 'Selling price', formula: `${formatNum(costPrice, locale)} ＋ ${formatNum(profit, locale)}`, val: `${formatNum(sellingPrice, locale)} €` }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Κέρδος: <Fraction num={`${formatNum(costPrice, locale)} · 20`} den="100" /> ＝ {formatNum(profit, locale)} €. Τιμή πώλησης: {formatNum(costPrice, locale)} ＋ {formatNum(profit, locale)} ＝ {formatNum(sellingPrice, locale)} €.
              </>
            ) : (
              <>
                Profit: <Fraction num={`${formatNum(costPrice, locale)} · 20`} den="100" /> ＝ {formatNum(profit, locale)} €. Selling price: {formatNum(costPrice, locale)} ＋ {formatNum(profit, locale)} ＝ {formatNum(sellingPrice, locale)} €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(sellingPrice + 10, locale)} €`,
          `${formatNum(Math.max(5, sellingPrice - 10), locale)} €`,
          `${formatNum(sellingPrice + 15, locale)} €`,
          `${formatNum(sellingPrice + 5, locale)} €`
        ]
      };
    }
  },
  {
    id: 'pos_std_4',
    generate: (locale) => {
      const isEl = locale === 'el';
      const origStudents = pickRandom([200, 250, 400, 500]);
      const absPct = 12;
      const absStudents = (origStudents * absPct) / 100;
      const unitStr = isEl ? 'μαθητές' : 'students';
      return {
        title: isEl ? 'Ποσοστό Απουσιών σε Σχολείο' : 'School Absence Percentage',
        prompt: isEl
          ? `Σε ένα σχολείο φοιτούν ${origStudents} μαθητές. Σήμερα απουσιάζει το ${absPct} % των μαθητών. Πόσοι μαθητές απουσιάζουν σήμερα; (γράψε μόνο τον αριθμό)`
          : `In a school there are ${origStudents} students. Today ${absPct} % of the students are absent. How many students are absent today? (write only the number)`,
        promptMcq: isEl
          ? `Σε ένα σχολείο φοιτούν ${origStudents} μαθητές. Σήμερα απουσιάζει το ${absPct} % των μαθητών. Πόσοι μαθητές απουσιάζουν σήμερα;`
          : `In a school there are ${origStudents} students. Today ${absPct} % of the students are absent. How many students are absent today?`,
        correctVal: formatNum(absStudents, locale),
        correctText: `${formatNum(absStudents, locale)} ${unitStr}`,
        tableData: [
          { item: isEl ? 'Σύνολο μαθητών' : 'Total students', formula: `${formatNum(origStudents, locale)}`, val: `${formatNum(origStudents, locale)}` },
          { item: isEl ? 'Ποσοστό απουσιών' : 'Absence percentage', formula: `${absPct} %`, val: `${absPct} %` },
          {
            item: isEl ? 'Απόντες μαθητές' : 'Absent students',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={`${formatNum(origStudents, locale)} · 12`} den="100" />
              </span>
            ),
            val: `${formatNum(absStudents, locale)}`
          }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Απόντες: <Fraction num={`${formatNum(origStudents, locale)} · 12`} den="100" /> ＝ {formatNum(absStudents, locale)} μαθητές.
              </>
            ) : (
              <>
                Absent: <Fraction num={`${formatNum(origStudents, locale)} · 12`} den="100" /> ＝ {formatNum(absStudents, locale)} students.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(absStudents + 6, locale)} ${unitStr}`,
          `${formatNum(Math.max(2, absStudents - 6), locale)} ${unitStr}`,
          `${formatNum(absStudents + 12, locale)} ${unitStr}`,
          `${formatNum(absStudents + 4, locale)} ${unitStr}`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'pos_hard_1',
    generate: (locale) => {
      const isEl = locale === 'el';
      return {
        title: isEl ? 'Διαδοχικές Εκπτώσεις' : 'Successive Discounts',
        prompt: isEl
          ? 'Ένα προϊόν αρχικής αξίας 200 € έχει διαδοχικές εκπτώσεις: αρχικά 20 % και στη συνέχεια επιπλέον έκπτωση 10 % επί της νέας μειωμένης τιμής. Ποια είναι η τελική τιμή πώλησης σε €; (γράψε μόνο τον αριθμό)'
          : 'A product with an initial price of 200 € has successive discounts: first 20 %, then an additional 10 % off the discounted price. What is the final retail price in euros (€)? (write only the number)',
        promptMcq: isEl
          ? 'Ένα προϊόν αρχικής αξίας 200 € έχει διαδοχικές εκπτώσεις: αρχικά 20 % και στη συνέχεια επιπλέον έκπτωση 10 % επί της νέας μειωμένης τιμής. Ποια είναι η τελική τιμή πώλησης σε €;'
          : 'A product with an initial price of 200 € has successive discounts: first 20 %, then an additional 10 % off the discounted price. What is the final retail price in euros (€)?',
        correctVal: formatNum(144, locale),
        correctText: `${formatNum(144, locale)} €`,
        tableData: [
          {
            item: isEl ? '1η Έκπτωση (20% στα 200 €)' : '1st Discount (20% on 200 €)',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                200 － <Fraction num="200 · 20" den="100" />
              </span>
            ),
            val: '160 €'
          },
          {
            item: isEl ? '2η Έκπτωση (10% στα 160 €)' : '2nd Discount (10% on 160 €)',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num="160 · 10" den="100" />
              </span>
            ),
            val: '16 €'
          },
          { item: isEl ? 'Τελική τιμή' : 'Final price', formula: '160 － 16', val: '144 €' }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                1η Έκπτωση 20%: 200 － <Fraction num="200 · 20" den="100" /> ＝ 200 － 40 ＝ 160 €. 2η Έκπτωση 10% στα 160 €: <Fraction num="160 · 10" den="100" /> ＝ 16 €. Τελική τιμή: 160 － 16 ＝ 144 €.
              </>
            ) : (
              <>
                1st Discount 20%: 200 － <Fraction num="200 · 20" den="100" /> ＝ 200 － 40 ＝ 160 €. 2nd Discount 10% on 160 €: <Fraction num="160 · 10" den="100" /> ＝ 16 €. Final price: 160 － 16 ＝ 144 €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(140, locale)} €`,
          `${formatNum(150, locale)} €`,
          `${formatNum(148, locale)} €`,
          `${formatNum(136, locale)} €`
        ]
      };
    }
  },
  {
    id: 'pos_hard_2',
    generate: (locale) => {
      const isEl = locale === 'el';
      const formatted1000 = formatNum(1000, locale);
      const formatted1100 = formatNum(1100, locale);
      const formatted990 = formatNum(990, locale);
      return {
        title: isEl ? 'Κέρδος και Ζημία επί Νέου Κεφαλαίου' : 'Profit and Loss on New Capital',
        prompt: isEl
          ? `Ένας επενδυτής είχε κεφάλαιο ${formatted1000} €. Τον πρώτο χρόνο κέρδισε 10 % και τον δεύτερο χρόνο έχασε 10 % επί του νέου κεφαλαίου. Πόσα ευρώ (€) έχει στο τέλος; (γράψε μόνο τον αριθμό)`
          : `An investor started with capital of ${formatted1000} €. In the first year he gained 10 % and in the second year he lost 10 % on the new capital. How much does he have at the end in euros (€)? (write only the number)`,
        promptMcq: isEl
          ? `Ένας επενδυτής είχε κεφάλαιο ${formatted1000} €. Τον πρώτο χρόνο κέρδισε 10 % και τον δεύτερο χρόνο έχασε 10 % επί του νέου κεφαλαίου. Πόσα ευρώ (€) έχει στο τέλος;`
          : `An investor started with capital of ${formatted1000} €. In the first year he gained 10 % and in the second year he lost 10 % on the new capital. How much does he have at the end in euros (€)?`,
        correctVal: formatNum(990, locale),
        correctText: `${formatted990} €`,
        tableData: [
          {
            item: isEl ? '1ος χρόνος (+10%)' : '1st year (+10%)',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                {formatted1000} ＋ <Fraction num={`${formatted1000} · 10`} den="100" />
              </span>
            ),
            val: `${formatted1100} €`
          },
          {
            item: isEl ? '2ος χρόνος (-10% στα 1.100 €)' : '2nd year (-10% on 1,100 €)',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={`${formatted1100} · 10`} den="100" />
              </span>
            ),
            val: `${formatNum(110, locale)} € ${isEl ? 'ζημία' : 'loss'}`
          },
          { item: isEl ? 'Τελικό κεφάλαιο' : 'Final capital', formula: `${formatted1100} － ${formatNum(110, locale)}`, val: `${formatted990} €` }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                1ος χρόνος (+10%): {formatted1000} ＋ <Fraction num={`${formatted1000} · 10`} den="100" /> ＝ {formatted1000} ＋ 100 ＝ {formatted1100} €. 2ος χρόνος (-10% στα {formatted1100} €): <Fraction num={`${formatted1100} · 10`} den="100" /> ＝ 110 €. Τελικό κεφάλαιο: {formatted1100} － 110 ＝ {formatted990} €.
              </>
            ) : (
              <>
                1st year (+10%): {formatted1000} ＋ <Fraction num={`${formatted1000} · 10`} den="100" /> ＝ {formatted1000} ＋ 100 ＝ {formatted1100} €. 2nd year (-10% on {formatted1100} €): <Fraction num={`${formatted1100} · 10`} den="100" /> ＝ 110 €. Final capital: {formatted1100} － 110 ＝ {formatted990} €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(1000, locale)} €`,
          `${formatNum(980, locale)} €`,
          `${formatNum(995, locale)} €`,
          `${formatNum(1010, locale)} €`
        ]
      };
    }
  },
  {
    id: 'pos_hard_3',
    generate: (locale) => {
      const isEl = locale === 'el';
      return {
        title: isEl ? 'Κέρδος και Φ.Π.Α. Διαδοχικά' : 'Profit and VAT Successively',
        prompt: isEl
          ? 'Ένα κατάστημα αγοράζει ένα είδος προς 80 € και το πουλάει με κέρδος 25 %. Αν ο πελάτης πληρώσει επιπλέον Φ.Π.Α. 24 % επί της τιμής πώλησης, ποια είναι η τελική τιμή σε €; (γράψε μόνο τον αριθμό)'
          : 'A store buys an item for 80 € and sells it with a 25 % profit. If the customer also pays 24 % VAT on the selling price, what is the final price in euros (€)? (write only the number)',
        promptMcq: isEl
          ? 'Ένα κατάστημα αγοράζει ένα είδος προς 80 € και το πουλάει με κέρδος 25 %. Αν ο πελάτης πληρώσει επιπλέον Φ.Π.Α. 24 % επί της τιμής πώλησης, ποια είναι η τελική τιμή σε €;'
          : 'A store buys an item for 80 € and sells it with a 25 % profit. If the customer also pays 24 % VAT on the selling price, what is the final price in euros (€)?',
        correctVal: formatNum(124, locale),
        correctText: `${formatNum(124, locale)} €`,
        tableData: [
          {
            item: isEl ? 'Τιμή πώλησης με κέρδος 25%' : 'Selling price with 25% profit',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                80 ＋ <Fraction num="80 · 25" den="100" />
              </span>
            ),
            val: '100 €'
          },
          {
            item: isEl ? 'Φ.Π.Α. 24% επί των 100 €' : '24% VAT on 100 €',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num="100 · 24" den="100" />
              </span>
            ),
            val: '24 €'
          },
          { item: isEl ? 'Τελική τιμή με φόρο' : 'Final price with tax', formula: '100 ＋ 24', val: '124 €' }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Τιμή πώλησης με κέρδος 25%: 80 ＋ <Fraction num="80 · 25" den="100" /> ＝ 80 ＋ 20 ＝ 100 €. Τελική τιμή με Φ.Π.Α. 24%: 100 ＋ <Fraction num="100 · 24" den="100" /> ＝ 100 ＋ 24 ＝ 124 €.
              </>
            ) : (
              <>
                Selling price with 25% profit: 80 ＋ <Fraction num="80 · 25" den="100" /> ＝ 80 ＋ 20 ＝ 100 €. Final price with 24% VAT: 100 ＋ <Fraction num="100 · 24" den="100" /> ＝ 100 ＋ 24 ＝ 124 €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(120, locale)} €`,
          `${formatNum(128, locale)} €`,
          `${formatNum(118, locale)} €`,
          `${formatNum(132, locale)} €`
        ]
      };
    }
  },
  {
    id: 'pos_hard_4',
    generate: (locale) => {
      const isEl = locale === 'el';
      const formatted1200 = formatNum(1200, locale);
      const formatted180 = formatNum(180, locale);
      const formatted1020 = formatNum(1020, locale);
      return {
        title: isEl ? 'Καθαρός Μισθός μετά από Κρατήσεις' : 'Net Salary After Deductions',
        prompt: isEl
          ? `Ένας εργαζόμενος έχει μηνιαίο μισθό ${formatted1200} €. Του γίνεται κράτηση 15 % για ασφαλιστικές εισφορές. Πόσα ευρώ (€) είναι ο καθαρός μισθός που λαμβάνει; (γράψε μόνο τον αριθμό)`
          : `An employee has a gross monthly salary of ${formatted1200} €. A deduction of 15 % is made for social contributions. What is the net monthly salary received in euros (€)? (write only the number)`,
        promptMcq: isEl
          ? `Ένας εργαζόμενος έχει μηνιαίο μισθό ${formatted1200} €. Του γίνεται κράτηση 15 % για ασφαλιστικές εισφορές. Πόσα ευρώ (€) είναι ο καθαρός μισθός που λαμβάνει;`
          : `An employee has a gross monthly salary of ${formatted1200} €. A deduction of 15 % is made for social contributions. What is the net monthly salary received in euros (€)?`,
        correctVal: formatNum(1020, locale),
        correctText: `${formatted1020} €`,
        tableData: [
          { item: isEl ? 'Αρχικός μισθός' : 'Gross salary', formula: `${formatted1200} €`, val: `${formatted1200} €` },
          {
            item: isEl ? 'Κράτηση 15%' : '15% deduction',
            formula: (
              <span className="inline-flex items-center flex-wrap">
                <Fraction num={`${formatted1200} · 15`} den="100" />
              </span>
            ),
            val: `${formatted180} €`
          },
          { item: isEl ? 'Καθαρός μισθός' : 'Net salary', formula: `${formatted1200} － ${formatted180}`, val: `${formatted1020} €` }
        ],
        explain: (
          <span className="inline-flex items-center flex-wrap leading-relaxed">
            {isEl ? (
              <>
                Κράτηση: <Fraction num={`${formatted1200} · 15`} den="100" /> ＝ {formatted180} €. Καθαρός μισθός: {formatted1200} － {formatted180} ＝ {formatted1020} €.
              </>
            ) : (
              <>
                Deduction: <Fraction num={`${formatted1200} · 15`} den="100" /> ＝ {formatted180} €. Net salary: {formatted1200} － {formatted180} ＝ {formatted1020} €.
              </>
            )}
          </span>
        ),
        distractors: [
          `${formatNum(1050, locale)} €`,
          `${formatNum(980, locale)} €`,
          `${formatNum(1040, locale)} €`,
          `${formatNum(1000, locale)} €`
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

  // Q1: Input - Υπολογισμός ποσού έκπτωσης
  const q1Orig = pickRandom([60, 80, 100, 120]);
  const q1Pct = 20;
  const q1DiscAmount = (q1Orig * q1Pct) / 100;

  // Q2: MCQ - Εύρεση τελικής τιμής σε έκπτωση (4 μοναδικές επιλογές)
  const q2Options = makeUniqueOptions(t.q2Correct, t.q2Distractors).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q3: Input - Υπολογισμός τελικής τιμής με έκπτωση
  const q3Orig = pickRandom([50, 70, 90, 110]);
  const q3Disc = (q3Orig * 10) / 100;
  const q3FinalP = q3Orig - q3Disc;

  // Q4: MCQ - Επιβάρυνση φόρου Φ.Π.Α. (4 μοναδικές επιλογές)
  const q4Options = makeUniqueOptions(t.q4Correct, t.q4Distractors).map((v) => ({
    val: v,
    render: <span>{v}</span>
  }));

  // Q5: Input - Υπολογισμός τελικής τιμής με Φ.Π.Α. 24%
  const q5Clean = pickRandom([50, 100, 150, 200]);
  const q5Vat = (q5Clean * 24) / 100;
  const q5FinalVal = q5Clean + q5Vat;

  // Q6: MCQ - Απευθείας υπολογισμός τελικής τιμής (4 μοναδικές επιλογές)
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
      prompt: t.q1Prompt(formatNum(q1Orig, locale)),
      correct: formatNum(q1DiscAmount, locale),
      explain: t.q1Explain(formatNum(q1Orig, locale), formatNum(q1DiscAmount, locale))
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
      inputType: 'decimal',
      title: t.q3Title,
      prompt: t.q3Prompt(formatNum(q3Orig, locale)),
      correct: formatNum(q3FinalP, locale),
      explain: t.q3Explain(formatNum(q3Orig, locale), formatNum(q3Disc, locale), formatNum(q3FinalP, locale))
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
      inputType: 'decimal',
      title: t.q5Title,
      prompt: t.q5Prompt(formatNum(q5Clean, locale)),
      correct: formatNum(q5FinalVal, locale),
      explain: t.q5Explain(formatNum(q5Clean, locale), formatNum(q5Vat, locale), formatNum(q5FinalVal, locale))
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

export default function ProblimataMePosostaExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/€/g, '').trim().toLowerCase();

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
          href="/st-dimotikou/51-problimata-me-pososta"
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
// pages/d-dimotikou/23-anagogi-monada-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Δ')/g);
  return parts
    .map((part) => {
      if (part === "Δ'") return "Δ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

export function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="text-[0.9em] px-1 pb-0.5 border-b border-current font-bold">{num}</span>
      <span className="text-[0.9em] px-1 pt-0.5 font-bold">{den}</span>
    </span>
  );
}

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΗ ΑΝΤΙΚΕΙΜΕΝΩΝ ΜΕ ΔΙΓΛΩΣΣΗ ΔΟΜΗ (EL / EN)
// ----------------------------------------------------
const ITEMS_POOL = {
  el: [
    // Ουδέτερα
    { name: 'μολύβια', single: 'μολύβι', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '✏️' },
    { name: 'τετράδια', single: 'τετράδιο', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '📓' },
    { name: 'βιβλία', single: 'βιβλίο', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '📚' },
    { name: 'παγωτά', single: 'παγωτό', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '🍦' },
    { name: 'εισιτήρια', single: 'εισιτήριο', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '🎟️' },
    { name: 'μπλουζάκια', single: 'μπλουζάκι', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '👕' },
    { name: 'κρουασάν', single: 'κρουασάν', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '🥐' },
    { name: 'παιχνίδια', single: 'παιχνίδι', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '🧸' },
    { name: 'κουτιά μαρκαδόροι', single: 'κουτί μαρκαδόροι', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '🎨' },
    { name: 'πακέτα αυτοκόλλητα', single: 'πακέτο αυτοκόλλητα', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '📦' },
    { name: 'σάντουιτς', single: 'σάντουιτς', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '🥪' },
    { name: 'ρολόγια', single: 'ρολόι', artPlural: 'τα', artSingle: 'το', howMany: 'πόσα', emoji: '⌚' },

    // Θηλυκά
    { name: 'μπάλες', single: 'μπάλα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '⚽' },
    { name: 'σοκολάτες', single: 'σοκολάτα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '🍫' },
    { name: 'τυρόπιτες', single: 'τυρόπιτα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '🥧' },
    { name: 'τσάντες', single: 'τσάντα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '🎒' },
    { name: 'γόμες', single: 'γόμα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '🧼' },
    { name: 'ξύστρες', single: 'ξύστρα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '✂️' },
    { name: 'πίτσες', single: 'πίτσα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '🍕' },
    { name: 'κούπες', single: 'κούπα', artPlural: 'οι', artSingle: 'η', howMany: 'πόσες', emoji: '☕' },

    // Αρσενικά
    { name: 'χυμοί', single: 'χυμός', artPlural: 'οι', artSingle: 'ο', howMany: 'πόσους', emoji: '🧃' },
    { name: 'χάρακες', single: 'χάρακας', artPlural: 'οι', artSingle: 'ο', howMany: 'πόσους', emoji: '📏' },
    { name: 'φάκελοι', single: 'φάκελος', artPlural: 'οι', artSingle: 'ο', howMany: 'πόσους', emoji: '✉️' },
    { name: 'πίνακες', single: 'πίνακας', artPlural: 'οι', artSingle: 'ο', howMany: 'πόσους', emoji: '🖼️' }
  ],
  en: [
    { name: 'pencils', single: 'pencil', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '✏️' },
    { name: 'notebooks', single: 'notebook', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '📓' },
    { name: 'books', single: 'book', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '📚' },
    { name: 'ice creams', single: 'ice cream', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '🍦' },
    { name: 'tickets', single: 'ticket', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '🎟️' },
    { name: 't-shirts', single: 't-shirt', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '👕' },
    { name: 'croissants', single: 'croissant', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '🥐' },
    { name: 'toys', single: 'toy', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '🧸' },
    { name: 'marker sets', single: 'marker set', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '🎨' },
    { name: 'sticker packs', single: 'sticker pack', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '📦' },
    { name: 'sandwiches', single: 'sandwich', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '🥪' },
    { name: 'watches', single: 'watch', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '⌚' },
    { name: 'balls', single: 'ball', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '⚽' },
    { name: 'chocolates', single: 'chocolate', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '🍫' },
    { name: 'pies', single: 'pie', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '🥧' },
    { name: 'backpacks', single: 'backpack', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '🎒' },
    { name: 'erasers', single: 'eraser', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '🧼' },
    { name: 'sharpeners', single: 'sharpener', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '✂️' },
    { name: 'pizzas', single: 'pizza', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '🍕' },
    { name: 'mugs', single: 'mug', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '☕' },
    { name: 'juices', single: 'juice', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '🧃' },
    { name: 'rulers', single: 'ruler', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '📏' },
    { name: 'envelopes', single: 'envelope', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '✉️' },
    { name: 'paintings', single: 'painting', artPlural: '', artSingle: '1', howMany: 'how many', emoji: '🖼️' }
  ]
};

const translations = {
  el: {
    pageTitle: "Ασκήσεις: Αναγωγή στη Μονάδα | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στη μέθοδο της αναγωγής στη μονάδα: εύρεση τιμής μονάδας, υπολογισμός νέου κόστους και αντίστροφη εύρεση ποσότητας.",
    backText: "Δ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "📝 Ασκήσεις: Αναγωγή στη Μονάδα",
    subtitle: "Πατώντας «Νέες Ασκήσεις», τα προβλήματα, τα αντικείμενα και τα ποσά ανανεώνονται αυτόματα!",
    newQuestionsBtn: "Νέες Ασκήσεις",
    submitBtn: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ:",
    successRate: "Επιτυχία:",
    fillReminder: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    resultLabel: "Αποτέλεσμα:",
    correctAnswerIs: "Η σωστή απάντηση είναι",
    correctOptionIs: "Η σωστή απάντηση είναι:",
    placeholderUnitPrice: "Τιμή για το 1",
    placeholderFinalCost: "Τελικό κόστος",
    placeholderQty: "Πλήθος",
    q1Template: (item, qty, totalCost) =>
      `Αν ${item.artPlural} ${qty} ${item.name} ${item.emoji} κοστίζουν ${totalCost} €, πόσο κοστίζει ${item.artSingle} 1 ${item.single};`,
    q1Explain: (totalCost, qty, costPerUnit, item) =>
      `Διαιρούμε το συνολικό κόστος με το πλήθος: ${totalCost} ： ${qty} ＝ ${costPerUnit} € για ${item.artSingle} 1 ${item.single}.`,
    q2Template: (item, q1, total1, q2) =>
      `Αν ${item.artPlural} ${q1} ${item.name} ${item.emoji} κοστίζουν ${total1} €, πόσο κοστίζουν ${item.artPlural} ${q2} ${item.name};`,
    q2Explain: (item, total1, q1, costPerUnit, q2, total2) =>
      `Βήμα 1: ${item.artSingle} 1 ${item.single} κοστίζει ${total1} ： ${q1} ＝ ${costPerUnit} €. Βήμα 2: ${item.artPlural} ${q2} ${item.name} κοστίζουν ${q2} · ${costPerUnit} ＝ ${total2} €.`,
    q3Template: (item, q1, total1, q2) =>
      `Αν ${item.artPlural} ${q1} ${item.name} ${item.emoji} κοστίζουν ${total1} €, πόσο θα πληρώσουμε για ${q2} ${item.name};`,
    q3Explain: (item, total1, q1, unitCost, q2, correct) =>
      `Βήμα 1: ${item.artSingle} 1 ${item.single} κοστίζει ${total1} ： ${q1} ＝ ${unitCost} €. Βήμα 2: ${item.artPlural} ${q2} κοστίζουν ${q2} · ${unitCost} ＝ ${correct} €.`,
    q4Template: (item, q1, total1, totalAvailable) =>
      `Αν ${item.artPlural} ${q1} ${item.name} ${item.emoji} κοστίζουν ${total1} €, ${item.howMany} ${item.name} μπορούμε να αγοράσουμε με ${totalAvailable} €;`,
    q4Explain: (item, total1, q1, costPerUnit, totalAvailable, targetQty) =>
      `Βήμα 1: ${item.artSingle} 1 ${item.single} κοστίζει ${total1} ： ${q1} ＝ ${costPerUnit} €. Βήμα 2: Με ${totalAvailable} € αγοράζουμε ${totalAvailable} ： ${costPerUnit} ＝ ${targetQty} ${item.name}.`
  },
  en: {
    pageTitle: "Exercises: The Unitary Method | LearnMaths.gr",
    pageDesc: "Interactive Grade 4 math exercises on the unitary method: finding the unit cost, calculating total cost, and finding quantity given a budget.",
    backText: "Grade 4",
    theoryBtn: "Theory",
    badge: "GRADE 4 • PRACTICE",
    title: "📝 Exercises: The Unitary Method",
    subtitle: "Click «New Exercises» to dynamically refresh the problems, items, and values!",
    newQuestionsBtn: "New Exercises",
    submitBtn: "🎯 Check Answers",
    scoreLabel: "Score:",
    successRate: "Accuracy:",
    fillReminder: "Complete all questions and click «Check Answers»!",
    resultLabel: "Result:",
    correctAnswerIs: "The correct answer is",
    correctOptionIs: "The correct answer is:",
    placeholderUnitPrice: "Unit price",
    placeholderFinalCost: "Total cost",
    placeholderQty: "Quantity",
    q1Template: (item, qty, totalCost) =>
      `If ${qty} ${item.name} ${item.emoji} cost ${totalCost} €, how much does 1 ${item.single} cost?`,
    q1Explain: (totalCost, qty, costPerUnit, item) =>
      `Divide the total cost by the quantity: ${totalCost} ： ${qty} ＝ ${costPerUnit} € for 1 ${item.single}.`,
    q2Template: (item, q1, total1, q2) =>
      `If ${q1} ${item.name} ${item.emoji} cost ${total1} €, how much do ${q2} ${item.name} cost?`,
    q2Explain: (item, total1, q1, costPerUnit, q2, total2) =>
      `Step 1: 1 ${item.single} costs ${total1} ： ${q1} ＝ ${costPerUnit} €. Step 2: ${q2} ${item.name} cost ${q2} · ${costPerUnit} ＝ ${total2} €.`,
    q3Template: (item, q1, total1, q2) =>
      `If ${q1} ${item.name} ${item.emoji} cost ${total1} €, how much will we pay for ${q2} ${item.name}?`,
    q3Explain: (item, total1, q1, unitCost, q2, correct) =>
      `Step 1: 1 ${item.single} costs ${total1} ： ${q1} ＝ ${unitCost} €. Step 2: ${q2} ${item.name} cost ${q2} · ${unitCost} ＝ ${correct} €.`,
    q4Template: (item, q1, total1, totalAvailable) =>
      `If ${q1} ${item.name} ${item.emoji} cost ${total1} €, ${item.howMany} ${item.name} can we buy with ${totalAvailable} €?`,
    q4Explain: (item, total1, q1, costPerUnit, totalAvailable, targetQty) =>
      `Step 1: 1 ${item.single} costs ${total1} ： ${q1} ＝ ${costPerUnit} €. Step 2: With ${totalAvailable} € we can buy ${totalAvailable} ： ${costPerUnit} ＝ ${targetQty} ${item.name}.`
  }
};

// 1. Άσκηση: Εύρεση της Μονάδας (Βήμα 1 - Input)
function makeUnitOnlyQuestion(locale, t, formatNum, pool, prevQ = null) {
  let item, qty, costPerUnit, totalCost;

  while (true) {
    item = pool[getRandomInt(0, pool.length - 1)];
    qty = getRandomInt(3, 8);
    costPerUnit = getRandomInt(2, 7);
    totalCost = qty * costPerUnit;

    if (!prevQ || prevQ.itemName !== item.name) break;
  }

  return {
    itemName: item.name,
    q: t.q1Template(item, formatNum(qty), formatNum(totalCost)),
    correct: costPerUnit,
    unit: '€',
    explainText: t.q1Explain(formatNum(totalCost), formatNum(qty), formatNum(costPerUnit), item)
  };
}

// 2. Άσκηση: Πλήρης Αναγωγή στη Μονάδα (Βήμα 1 & 2 - Input)
function makeFullAnagogiQuestion(locale, t, formatNum, pool, prevQ = null) {
  let item, q1, costPerUnit, total1, q2, total2;

  while (true) {
    item = pool[getRandomInt(0, pool.length - 1)];
    q1 = getRandomInt(2, 5);
    costPerUnit = getRandomInt(2, 8);
    total1 = q1 * costPerUnit;

    q2 = getRandomInt(4, 9);
    while (q2 === q1) {
      q2 = getRandomInt(4, 9);
    }
    total2 = q2 * costPerUnit;

    if (!prevQ || prevQ.itemName !== item.name) break;
  }

  return {
    itemName: item.name,
    q: t.q2Template(item, formatNum(q1), formatNum(total1), formatNum(q2)),
    correct: total2,
    unit: '€',
    explainText: t.q2Explain(item, formatNum(total1), formatNum(q1), formatNum(costPerUnit), formatNum(q2), formatNum(total2))
  };
}

// 3. Άσκηση: Πολλαπλή Επιλογή με 4 Επιλογές (ΟΜΑΔΑ Α - MCQ)
function makeMCQAnagogiQuestion(locale, t, formatNum, pool, prevQ = null) {
  let item, q1, unitCost, total1, q2, correct, correctText;

  while (true) {
    item = pool[getRandomInt(0, pool.length - 1)];
    q1 = getRandomInt(2, 5);
    unitCost = getRandomInt(2, 6);
    total1 = q1 * unitCost;

    q2 = getRandomInt(4, 9);
    while (q2 === q1) {
      q2 = getRandomInt(4, 9);
    }
    correct = q2 * unitCost;
    correctText = `${formatNum(correct)} €`;

    if (!prevQ || prevQ.correct !== correctText) break;
  }

  const wrong1 = `${formatNum(correct + unitCost)} €`;
  const wrong2 = `${formatNum(Math.max(1, correct - unitCost))} €`;
  const wrong3 = `${formatNum(correct + 2 * unitCost)} €`;

  const rawOptions = [correctText, wrong1, wrong2, wrong3];
  const uniqueOptions = [...new Set(rawOptions)];

  while (uniqueOptions.length < 4) {
    const dummy = `${formatNum(correct + getRandomInt(3, 15))} €`;
    if (!uniqueOptions.includes(dummy)) {
      uniqueOptions.push(dummy);
    }
  }

  const choices = uniqueOptions.map((opt) => ({
    text: opt,
    isCorrect: opt === correctText
  })).sort(() => Math.random() - 0.5);

  return {
    q: t.q3Template(item, formatNum(q1), formatNum(total1), formatNum(q2)),
    options: choices,
    correct: correctText,
    explainText: t.q3Explain(item, formatNum(total1), formatNum(q1), formatNum(unitCost), formatNum(q2), formatNum(correct))
  };
}

// 4. Άσκηση: Αντίστροφη Αναγωγή στη Μονάδα (Input - Εύρεση Ποσότητας)
function makeReverseAnagogiQuestion(locale, t, formatNum, pool, prevQ = null) {
  let item, q1, costPerUnit, total1, targetQty, totalAvailable;

  while (true) {
    item = pool[getRandomInt(0, pool.length - 1)];
    q1 = getRandomInt(2, 4);
    costPerUnit = getRandomInt(2, 5);
    total1 = q1 * costPerUnit;

    targetQty = getRandomInt(5, 10);
    totalAvailable = targetQty * costPerUnit;

    if (!prevQ || prevQ.itemName !== item.name) break;
  }

  return {
    itemName: item.name,
    q: t.q4Template(item, formatNum(q1), formatNum(total1), formatNum(totalAvailable)),
    correct: targetQty,
    unit: item.name,
    explainText: t.q4Explain(item, formatNum(total1), formatNum(q1), formatNum(costPerUnit), formatNum(totalAvailable), formatNum(targetQty))
  };
}

// Δημιουργία 8 Ερωτήσεων
function generateQuestions(locale) {
  const t = translations[locale] || translations.el;
  const pool = ITEMS_POOL[locale] || ITEMS_POOL.el;
  const formatNum = (num) => num.toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');

  const q1 = makeUnitOnlyQuestion(locale, t, formatNum, pool);
  const q2 = makeUnitOnlyQuestion(locale, t, formatNum, pool, q1);

  const q3 = makeFullAnagogiQuestion(locale, t, formatNum, pool);
  const q4 = makeFullAnagogiQuestion(locale, t, formatNum, pool, q3);

  const q5 = makeMCQAnagogiQuestion(locale, t, formatNum, pool);
  const q6 = makeMCQAnagogiQuestion(locale, t, formatNum, pool, q5);

  const q7 = makeReverseAnagogiQuestion(locale, t, formatNum, pool);
  const q8 = makeReverseAnagogiQuestion(locale, t, formatNum, pool, q7);

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function AnagogiMonadaAskPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const formatNumber = (num) => {
    if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
  };

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(locale));
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, [locale]);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9]/g, '');
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    if (parseInt(answers.q1, 10) === questions.q1.correct) currentScore += 1;
    if (parseInt(answers.q2, 10) === questions.q2.correct) currentScore += 1;
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (parseInt(answers.q7, 10) === questions.q7.correct) currentScore += 1;
    if (parseInt(answers.q8, 10) === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Input Number Ασκήσεων (Q1, Q2, Q3, Q4, Q7, Q8)
  const renderInputNumber = (qKey, qData, numLabel, colorClass, placeholderText, suffixUnit) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className={`${colorClass} text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}>
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">{t.resultLabel}</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder={placeholderText}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-40 sm:w-52 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-slate-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
            />
            {suffixUnit && (
              <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">
                {suffixUnit}
              </span>
            )}
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctAnswerIs} <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)} {suffixUnit || ''}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render MCQ (Q5 & Q6, 4 Επιλογές)
  const renderMCQQuestion = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-purple-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt.text;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/80 font-bold text-purple-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${qKey}-opt-${idx}`}
                  name={qKey}
                  value={opt.text}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt.text)}
                  disabled={submitted}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 shrink-0"
                />
                <span className="break-words whitespace-normal leading-snug flex-1 font-mono font-bold text-sm sm:text-base">
                  {opt.text}
                </span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                {t.correctOptionIs} <strong className="font-mono font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/23-anagogi-monada"
          className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.title}
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInputNumber('q1', questions.q1, 1, 'bg-blue-600', t.placeholderUnitPrice, '€')}
          {renderInputNumber('q2', questions.q2, 2, 'bg-blue-600', t.placeholderUnitPrice, '€')}

          {renderInputNumber('q3', questions.q3, 3, 'bg-emerald-600', t.placeholderFinalCost, '€')}
          {renderInputNumber('q4', questions.q4, 4, 'bg-emerald-600', t.placeholderFinalCost, '€')}

          {renderMCQQuestion('q5', questions.q5, 5)}
          {renderMCQQuestion('q6', questions.q6, 6)}

          {renderInputNumber('q7', questions.q7, 7, 'bg-amber-600', t.placeholderQty, questions.q7.unit)}
          {renderInputNumber('q8', questions.q8, 8, 'bg-amber-600', t.placeholderQty, questions.q8.unit)}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                {t.submitBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ΣΤΑΘΕΡΟ FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> {t.newQuestionsBtn}
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.fillReminder}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
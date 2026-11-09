// pages/st-dimotikou/40-logos-ask.js
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

function getGCD(a, b) {
  let x = Math.abs(Math.round(a || 0));
  let y = Math.abs(Math.round(b || 0));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Αυστηρή συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = String(str).split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Μορφοποίηση δεκαδικού βάσει locale
function formatDecimal(val, decimals = 2, locale = 'el') {
  const rounded = Number(val.toFixed(decimals));
  const dotFormatted = String(rounded);
  return locale === 'el' ? dotFormatted.replace('.', ',') : dotFormatted;
}

// Helper για εξασφάλιση ακριβώς 4 μοναδικών επιλογών MCQ
function makeUniqueMCQ(correctObj, candidates) {
  const seen = new Set([correctObj.val]);
  const result = [correctObj];
  for (const cand of candidates) {
    if (cand && !seen.has(cand.val)) {
      seen.add(cand.val);
      result.push(cand);
    }
    if (result.length === 4) break;
  }
  return shuffle(result);
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
    <span className={`inline-flex flex-col items-center justify-center align-middle font-mono leading-none px-1 ${className}`}>
      <span className={`${selected.numDen} pb-0.5`}>{num}</span>
      <span className={`${selected.line} bg-current rounded-full my-0.5 min-w-[12px]`} />
      <span className={`${selected.numDen} pt-0.5`}>{den}</span>
    </span>
  );
}

// ---------------------------------------------------------
// ΛΕΞΙΚΟ i18n
// ---------------------------------------------------------

const TRANSLATIONS = {
  el: {
    pageTitle: "Ασκήσεις: Η Έννοια του Λόγου - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην έννοια του λόγου, απλοποίηση, σύγκριση μεγεθών και αναλογίες για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryNav: "Θεωρία",
    badge: "ΚΕΦΑΛΑΙΟ 40 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    title: "Διαδραστικές Ασκήσεις: Η Έννοια του Λόγου",
    desc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στην απλοποίηση λόγων, στον υπολογισμό τιμής λόγου, στους αντίστροφους λόγους και στην επίλυση σύνθετων προβλημάτων!",
    newQuestions: "Νέες Ασκήσεις",
    exercise: "Άσκηση",
    trueBtn: "Σωστό",
    falseBtn: "Λάθος",
    inputPlaceholderFraction: "π.χ. 3/4 ή 3:4",
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
    bottomHint: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!",
    gcdLabel: "Μ.Κ.Δ."
  },
  en: {
    pageTitle: "Exercises: The Concept of Ratio - 6th Grade | LearnMaths.gr",
    pageDesc: "Interactive 10-question practice test with automated scoring on the concept of ratio, simplification, and real-life proportions for 6th Grade.",
    backText: "6th Grade",
    theoryNav: "Theory",
    badge: "CHAPTER 40 • 6TH GRADE • PRACTICE",
    title: "Interactive Exercises: The Concept of Ratio",
    desc: "Solve the 10 dynamic problems to practice simplifying ratios, computing ratio values, reciprocal ratios, and multi-step real-world problems!",
    newQuestions: "New Exercises",
    exercise: "Exercise",
    trueBtn: "True",
    falseBtn: "False",
    inputPlaceholderFraction: "e.g. 3/4 or 3:4",
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
    bottomHint: "Answer all 10 questions and press 'Check Answers'!",
    gcdLabel: "GCD"
  }
};

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_std_1',
    generate: (locale) => {
      const g = randInt(2, 4);
      const boysRatio = randInt(3, 5);
      let girlsRatio = randInt(3, 5);
      while (girlsRatio === boysRatio) girlsRatio = randInt(2, 6);
      const boys = boysRatio * g;
      const girls = girlsRatio * g;
      const total = boys + girls;
      const gcdVal = getGCD(girls, total);
      const ansNum = girls / gcdVal;
      const ansDen = total / gcdVal;
      return {
        title: locale === 'en' ? 'Classroom Student Ratio' : 'Αναλογία Μαθητών στην Τάξη',
        prompt: (
          <span>
            {locale === 'en'
              ? `In a 6th grade class, there are ${boys} boys and ${girls} girls. What is the simplified ratio of girls to the total number of students in the class?`
              : `Σε μια τάξη της ΣΤ' Δημοτικού φοιτούν ${boys} αγόρια και ${girls} κορίτσια. Ποιος είναι ο απλοποιημένος λόγος των κοριτσιών προς το σύνολο των μαθητών της τάξης;`}
          </span>
        ),
        correctVal: `${ansNum}/${ansDen}`,
        altVal: `${ansNum}:${ansDen}`,
        correctText: `${ansNum} : ${ansDen}`,
        tableData: [
          { item: locale === 'en' ? 'Girls' : 'Κορίτσια', formula: `${girls}`, val: `${girls}` },
          { item: locale === 'en' ? 'Total students' : 'Σύνολο μαθητών', formula: `${boys} ＋ ${girls}`, val: `${total}` },
          { item: locale === 'en' ? 'Simplified ratio' : 'Απλοποιημένος λόγος', formula: `(${girls} : ${gcdVal}) / (${total} : ${gcdVal})`, val: `${ansNum} : ${ansDen}` }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Total students: ${boys} ＋ ${girls} ＝ ${total}. The ratio of girls to total is ${girls} : ${total}. Dividing by GCD(${girls}, ${total}) ＝ ${gcdVal}, the simplified ratio is ${ansNum} : ${ansDen} (or `
              : `Το σύνολο των μαθητών είναι ${boys} ＋ ${girls} ＝ ${total}. Ο λόγος των κοριτσιών προς το σύνολο είναι ${girls} : ${total}. Διαιρούμε με τον Μ.Κ.Δ.(${girls}, ${total}) ＝ ${gcdVal}, άρα ο απλοποιημένος λόγος είναι ${ansNum} : ${ansDen} (ή `}
            <Fraction num={ansNum} den={ansDen} size="sm" />
            <span>).</span>
          </span>
        ),
        distractors: [`${ansDen} : ${ansNum}`, `${ansNum + 1} : ${ansDen}`, `${ansNum} : ${ansDen + 2}`]
      };
    }
  },
  {
    id: 'p_std_2',
    generate: (locale) => {
      const width = randInt(4, 8) * 10;
      const lengthMeters = randInt(1, 3);
      const lengthCm = lengthMeters * 100;
      const gcdVal = getGCD(width, lengthCm);
      const ansNum = width / gcdVal;
      const ansDen = lengthCm / gcdVal;
      return {
        title: locale === 'en' ? 'Dimensions of Rectangular Banner' : 'Διαστάσεις Ορθογώνιου Πανό',
        prompt: (
          <span>
            {locale === 'en'
              ? `A rectangular banner has a width of ${width} cm and a length of ${lengthMeters} m. What is the simplified ratio of its width to its length?`
              : `Ένα ορθογώνιο πανό έχει πλάτος ${width} cm και μήκος ${lengthMeters} m. Ποιος είναι ο απλοποιημένος λόγος του πλάτους προς το μήκος του;`}
          </span>
        ),
        correctVal: `${ansNum}/${ansDen}`,
        altVal: `${ansNum}:${ansDen}`,
        correctText: `${ansNum} : ${ansDen}`,
        tableData: [
          { item: locale === 'en' ? 'Width' : 'Πλάτος', formula: `${width} cm`, val: `${width} cm` },
          { item: locale === 'en' ? 'Length (in cm)' : 'Μήκος (σε cm)', formula: `${lengthMeters} m · 100`, val: `${lengthCm} cm` },
          { item: locale === 'en' ? 'Simplified ratio' : 'Απλοποίηση λόγου', formula: `(${width} : ${gcdVal}) / (${lengthCm} : ${gcdVal})`, val: `${ansNum} : ${ansDen}` }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Convert length to same unit: ${lengthMeters} m ＝ ${lengthCm} cm. Ratio is ${width} : ${lengthCm}. Dividing by GCD ＝ ${gcdVal} yields ${ansNum} : ${ansDen}.`
              : `Μετατρέπουμε το μήκος στην ίδια μονάδα: ${lengthMeters} m ＝ ${lengthCm} cm. Ο λόγος είναι ${width} : ${lengthCm}. Διαιρούμε με τον Μ.Κ.Δ.(${width}, ${lengthCm}) ＝ ${gcdVal} και προκύπτει ${ansNum} : ${ansDen}.`}
          </span>
        ),
        distractors: [`${ansDen} : ${ansNum}`, `${ansNum + 1} : ${ansDen}`, `${ansNum} : ${ansDen + 1}`]
      };
    }
  },
  {
    id: 'p_std_3',
    generate: (locale) => {
      const sugar = randInt(2, 5) * 50;
      const flourKg = randInt(1, 2);
      const flourG = flourKg * 1000;
      const gcdVal = getGCD(sugar, flourG);
      const ansNum = sugar / gcdVal;
      const ansDen = flourG / gcdVal;
      return {
        title: locale === 'en' ? 'Baking Recipe Ratio' : 'Συνταγή Ζαχαροπλαστικής',
        prompt: (
          <span>
            {locale === 'en'
              ? `A recipe uses ${sugar} g of sugar and ${flourKg} kg of flour. What is the simplified ratio of sugar to flour?`
              : `Σε μια συνταγή χρησιμοποιούνται ${sugar} g ζάχαρης και ${flourKg} kg αλευριού. Ποιος είναι ο απλοποιημένος λόγος της ζάχαρης προς το αλεύρι;`}
          </span>
        ),
        correctVal: `${ansNum}/${ansDen}`,
        altVal: `${ansNum}:${ansDen}`,
        correctText: `${ansNum} : ${ansDen}`,
        tableData: [
          { item: locale === 'en' ? 'Sugar' : 'Ζάχαρη', formula: `${sugar} g`, val: `${sugar} g` },
          { item: locale === 'en' ? 'Flour (in g)' : 'Αλεύρι (σε g)', formula: `${flourKg} kg · 1.000`, val: `${flourG} g` },
          { item: locale === 'en' ? 'Simplification' : 'Απλοποίηση', formula: `(${sugar} : ${gcdVal}) / (${flourG} : ${gcdVal})`, val: `${ansNum} : ${ansDen}` }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `Convert flour into grams: ${flourKg} kg ＝ ${flourG} g. Ratio is ${sugar} : ${flourG}. Simplifying by GCD ＝ ${gcdVal} gives ${ansNum} : ${ansDen}.`
              : `Μετατρέπουμε το αλεύρι σε γραμμάρια: ${flourKg} kg ＝ ${flourG} g. Ο λόγος είναι ${sugar} : ${flourG}. Απλοποιώντας με τον Μ.Κ.Δ. ＝ ${gcdVal}, έχουμε ${ansNum} : ${ansDen}.`}
          </span>
        ),
        distractors: [`${ansDen} : ${ansNum}`, `${ansNum} : ${ansDen + 2}`, `${ansNum + 1} : ${ansDen}`]
      };
    }
  },
  {
    id: 'p_std_4',
    generate: (locale) => {
      const base = randInt(3, 6);
      const wins = base * randInt(2, 4);
      const losses = base * 2;
      const gcdVal = getGCD(wins, losses);
      const ansNum = wins / gcdVal;
      const ansDen = losses / gcdVal;
      return {
        title: locale === 'en' ? 'Team Wins & Losses' : 'Νίκες και Ήττες Ομάδας',
        prompt: (
          <span>
            {locale === 'en'
              ? `A basketball team achieved ${wins} wins and ${losses} losses. What is the ratio of wins to losses in lowest terms?`
              : `Μια ομάδα μπάσκετ πέτυχε ${wins} νίκες και ${losses} ήττες. Ποιος είναι ο λόγος των νικών προς τις ήττες σε ανάγωγη μορφή;`}
          </span>
        ),
        correctVal: `${ansNum}/${ansDen}`,
        altVal: `${ansNum}:${ansDen}`,
        correctText: `${ansNum} : ${ansDen}`,
        tableData: [
          { item: locale === 'en' ? 'Wins' : 'Νίκες', formula: `${wins}`, val: `${wins}` },
          { item: locale === 'en' ? 'Losses' : 'Ήττες', formula: `${losses}`, val: `${losses}` },
          { item: locale === 'en' ? 'Irreducible ratio' : 'Ανάγωγος λόγος', formula: `(${wins} : ${gcdVal}) / (${losses} : ${gcdVal})`, val: `${ansNum} : ${ansDen}` }
        ],
        explain: (
          <span>
            {locale === 'en'
              ? `The ratio is ${wins} : ${losses}. Dividing by GCD(${wins}, ${losses}) ＝ ${gcdVal} gives ${ansNum} : ${ansDen}.`
              : `Ο λόγος είναι ${wins} : ${losses}. Διαιρούμε με τον Μ.Κ.Δ.(${wins}, ${losses}) ＝ ${gcdVal} και βρίσκουμε ${ansNum} : ${ansDen}.`}
          </span>
        ),
        distractors: [`${ansDen} : ${ansNum}`, `${ansNum + 1} : ${ansDen}`, `${ansNum} : ${ansDen + 1}`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_hard_1',
    generate: (locale) => {
      const rA = randInt(3, 5);
      const rB = randInt(6, 8);
      const unit = randInt(12, 25);
      const sum = (rA + rB) * unit;
      const valB = rB * unit;
      const areaUnit = 'm²';
      return {
        title: locale === 'en' ? 'Field Area Distribution' : 'Κατανομή Εμβαδού Χωραφιών',
        prompt: (
          <span>
            {locale === 'en'
              ? `Two fields have a total area of ${sum} m². The ratio of the area of the first to the second is ${rA} : ${rB}. What is the area of the larger field?`
              : `Δύο χωράφια έχουν συνολικό εμβαδόν ${sum} m². Ο λόγος του εμβαδού του πρώτου προς το δεύτερο είναι ${rA} : ${rB}. Πόσα m² είναι το εμβαδόν του μεγαλύτερου χωραφιού;`}
          </span>
        ),
        correctVal: String(valB),
        correctText: `${valB} ${areaUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Total parts' : 'Σύνολο μερών', formula: `${rA} ＋ ${rB}`, val: `${rA + rB}` },
          { item: locale === 'en' ? 'Value of 1 part' : 'Τιμή 1 μέρους', formula: `${sum} : ${rA + rB}`, val: `${unit} m²` },
          { item: locale === 'en' ? 'Larger field' : 'Μεγαλύτερο χωράφι', formula: `${rB} · ${unit}`, val: `${valB} m²` }
        ],
        explain: (
          <span>
            {`${sum} : (${rA} ＋ ${rB}) ＝ ${unit} m². ${rB} · ${unit} ＝ ${valB} m².`}
          </span>
        ),
        distractors: [`${valB - unit} ${areaUnit}`, `${valB + unit} ${areaUnit}`, `${rA * unit} ${areaUnit}`]
      };
    }
  },
  {
    id: 'p_hard_2',
    generate: (locale) => {
      const rX = randInt(2, 4);
      const rY = randInt(5, 7);
      const diffMultiplier = randInt(8, 16);
      const diffParts = rY - rX;
      const diff = diffParts * diffMultiplier;
      const y = rY * diffMultiplier;
      const yearUnit = locale === 'en' ? 'years' : 'έτη';
      return {
        title: locale === 'en' ? 'Age Ratio of Father and Child' : 'Λόγος Ηλικιών Πατέρα και Παιδιού',
        prompt: (
          <span>
            {locale === 'en'
              ? `The ratio of the ages of a child and their father is ${rX} : ${rY}. If the father is ${diff} years older than the child, what is the father's age?`
              : `Ο λόγος των ηλικιών ενός παιδιού και του πατέρα του είναι ${rX} : ${rY}. Αν ο πατέρας είναι κατά ${diff} έτη μεγαλύτερος από το παιδί, πόσα έτη είναι η ηλικία του πατέρα;`}
          </span>
        ),
        correctVal: String(y),
        correctText: `${y} ${yearUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Parts difference' : 'Διαφορά μερών', formula: `${rY} － ${rX}`, val: `${diffParts}` },
          { item: locale === 'en' ? 'Value of 1 part' : 'Τιμή 1 μέρους', formula: `${diff} : ${diffParts}`, val: `${diffMultiplier} ${yearUnit}` },
          { item: locale === 'en' ? "Father's age" : 'Ηλικία πατέρα', formula: `${rY} · ${diffMultiplier}`, val: `${y} ${yearUnit}` }
        ],
        explain: (
          <span>
            {`${diff} : (${rY} － ${rX}) ＝ ${diffMultiplier} ${yearUnit}. ${rY} · ${diffMultiplier} ＝ ${y} ${yearUnit}.`}
          </span>
        ),
        distractors: [`${y - 4} ${yearUnit}`, `${y + 4} ${yearUnit}`, `${rX * diffMultiplier} ${yearUnit}`]
      };
    }
  },
  {
    id: 'p_hard_3',
    generate: (locale) => {
      const rL = randInt(4, 6);
      const rW = randInt(2, 3);
      const k = randInt(5, 10);
      const length = rL * k;
      const width = rW * k;
      const semi = length + width;
      const perimeter = 2 * semi;
      const area = length * width;
      const areaUnit = 'm²';
      return {
        title: locale === 'en' ? 'Plot Area with Dimensions Ratio' : 'Εμβαδόν Οικοπέδου με Λόγο Διαστάσεων',
        prompt: (
          <span>
            {locale === 'en'
              ? `In a rectangular plot, the ratio of length to width is ${rL} : ${rW} and its perimeter is ${perimeter} m. What is its area in m²?`
              : `Σε ένα ορθογώνιο οικόπεδο ο λόγος του μήκους προς το πλάτος είναι ${rL} : ${rW} και η περίμετρός του είναι ${perimeter} m. Πόσα m² είναι το εμβαδόν του;`}
          </span>
        ),
        correctVal: String(area),
        correctText: `${area} ${areaUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Semi-perimeter' : 'Ημιπερίμετρος (μήκος ＋ πλάτος)', formula: `${perimeter} : 2`, val: `${semi} m` },
          { item: locale === 'en' ? 'Value of 1 part' : 'Τιμή 1 μέρους', formula: `${semi} : (${rL} ＋ ${rW})`, val: `${k} m` },
          { item: locale === 'en' ? 'Dimensions & Area' : 'Διαστάσεις', formula: `${length} m · ${width} m`, val: `${area} m²` }
        ],
        explain: (
          <span>
            {`${perimeter} : 2 ＝ ${semi} m. 1 μέρος ＝ ${semi} : (${rL} ＋ ${rW}) ＝ ${k} m. Εμβαδόν ＝ ${length} · ${width} ＝ ${area} m².`}
          </span>
        ),
        distractors: [`${area - 20} ${areaUnit}`, `${area + 40} ${areaUnit}`, `${semi * k} ${areaUnit}`]
      };
    }
  },
  {
    id: 'p_hard_4',
    generate: (locale) => {
      const k = randInt(4, 9);
      const copper = 7 * k;
      const zinc = 3 * k;
      const totalAlloy = copper + zinc;
      const kgUnit = 'kg';
      return {
        title: locale === 'en' ? 'Metal Alloy Composition' : 'Σύνθεση Μεταλλικού Κράματος',
        prompt: (
          <span>
            {locale === 'en'
              ? `A metal alloy weighing ${totalAlloy} kg consists of copper and zinc in a ratio of 7 : 3. How many kg of copper are in the alloy?`
              : `Ένα μεταλλικό κράμα βάρους ${totalAlloy} kg αποτελείται από χαλκό και ψευδάργυρο με λόγο 7 : 3. Πόσα kg χαλκού περιέχονται στο κράμα;`}
          </span>
        ),
        correctVal: String(copper),
        correctText: `${copper} ${kgUnit}`,
        tableData: [
          { item: locale === 'en' ? 'Total parts' : 'Σύνολο μερών', formula: '7 ＋ 3', val: '10' },
          { item: locale === 'en' ? 'Weight of 1 part' : 'Βάρος 1 μέρους', formula: `${totalAlloy} : 10`, val: `${k} kg` },
          { item: locale === 'en' ? 'Copper (7 parts)' : 'Χαλκός (7 μέρη)', formula: `7 · ${k}`, val: `${copper} kg` }
        ],
        explain: (
          <span>
            {`7 ＋ 3 ＝ 10. ${totalAlloy} : 10 ＝ ${k} kg. 7 · ${k} ＝ ${copper} kg.`}
          </span>
        ),
        distractors: [`${zinc} ${kgUnit}`, `${copper + 4} ${kgUnit}`, `${copper - 4} ${kgUnit}`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale = 'el') {
  // Q1: Input - Απλοποίηση λόγου
  const q1M = randInt(3, 8);
  const q1N1 = randInt(2, 6);
  let q1N2 = randInt(2, 6);
  while (q1N1 === q1N2) q1N2 = randInt(2, 7);
  const q1Num = q1N1 * q1M;
  const q1Den = q1N2 * q1M;
  const q1Gcd = getGCD(q1Num, q1Den);
  const q1AnsNum = q1Num / q1Gcd;
  const q1AnsDen = q1Den / q1Gcd;

  // Q2: MCQ - Δεκαδική τιμή λόγου
  const q2Num = randInt(3, 9);
  const q2Den = [2, 4, 5, 8, 10][randInt(0, 4)];
  const q2Val = q2Num / q2Den;
  const q2ValStr = formatDecimal(q2Val, 3, locale);
  const q2CandidateWrongs = [
    formatDecimal(q2Den / q2Num, 3, locale),
    formatDecimal(q2Val + 0.5, 3, locale),
    formatDecimal(Math.max(0.1, q2Val - 0.25), 3, locale),
    formatDecimal(q2Val + 1, 3, locale)
  ].filter(v => v !== q2ValStr);
  const q2Options = makeUniqueMCQ(
    { val: q2ValStr, render: <span>{q2ValStr}</span> },
    q2CandidateWrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q3: Input - Σύγκριση ομοειδών μεγεθών (cm προς m)
  const q3Cm = randInt(15, 45) * 2;
  const q3M = randInt(2, 4);
  const q3MCm = q3M * 100;
  const q3Gcd = getGCD(q3Cm, q3MCm);
  const q3AnsNum = q3Cm / q3Gcd;
  const q3AnsDen = q3MCm / q3Gcd;

  // Q4: MCQ - Αντίστροφος λόγος
  const q4A = randInt(3, 8);
  let q4B = randInt(4, 9);
  while (q4B === q4A) q4B++;
  const q4Correct = `${q4B} : ${q4A}`;
  const q4CandidateWrongs = [
    `${q4A} : ${q4A + q4B}`,
    `${q4A + 1} : ${q4B}`,
    `1 : ${q4B}`,
    `${q4A} : ${q4B}`
  ].filter(v => v !== q4Correct);
  const q4Options = makeUniqueMCQ(
    { val: q4Correct, render: <span>{q4Correct}</span> },
    q4CandidateWrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q5: Input - Ετεροειδή μεγέθη (Ταχύτητα σε km/h)
  const q5Hours = randInt(2, 4);
  const q5Speed = randInt(65, 95);
  const q5Km = q5Speed * q5Hours;

  // Q6: MCQ - Ισοδύναμοι λόγοι
  const q6A = randInt(2, 5);
  const q6B = randInt(3, 7);
  const q6Mult = randInt(3, 6);
  const q6EqA = q6A * q6Mult;
  const q6EqB = q6B * q6Mult;
  const q6Correct = `${q6EqA} : ${q6EqB}`;
  const q6CandidateWrongs = [
    `${q6EqA + 1} : ${q6EqB}`,
    `${q6EqA} : ${q6EqB + 2}`,
    `${q6A + 2} : ${q6B + 3}`,
    `${q6EqB} : ${q6EqA}`
  ].filter(v => v !== q6Correct);
  const q6Options = makeUniqueMCQ(
    { val: q6Correct, render: <span>{q6Correct}</span> },
    q6CandidateWrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q7: Standard Problem (Input)
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex].generate(locale);

  // Q8: MCQ - Ιδιότητα λόγου
  const q8Pool = [
    {
      prompt: locale === 'en' ? 'When are two ratios called equal (equivalent)?' : 'Πότε δύο λόγοι ονομάζονται ίσοι (ισοδύναμοι);',
      correct: locale === 'en' ? 'When they have the exact same numerical value' : 'Όταν έχουν την ίδια αριθμητική τιμή',
      wrongs: locale === 'en' 
        ? ['When they have identical terms', 'When their sum equals 1', 'When their terms are odd numbers']
        : ['Όταν έχουν τους ίδιους όρους', 'Όταν έχουν άθροισμα ίσο με 1', 'Όταν οι όροι τους είναι περιττοί αριθμοί'],
      explain: locale === 'en'
        ? 'Two ratios are equal when dividing their terms results in the exact same quotient.'
        : 'Δύο λόγοι είναι ίσοι όταν, εκτελώντας τη διαίρεση των όρων τους, έχουν ακριβώς το ίδιο πηλίκο (τιμή λόγου).'
    },
    {
      prompt: locale === 'en' ? 'What is the product of a ratio with its reciprocal?' : 'Ποιο είναι το γινόμενο ενός λόγου με τον αντίστροφό του;',
      correct: locale === 'en' ? 'Always 1' : 'Πάντοτε 1',
      wrongs: locale === 'en' ? ['Always 0', 'Depends on the terms', 'Always 2'] : ['Πάντοτε 0', 'Εξαρτάται από τους όρους', 'Πάντοτε 2'],
      explain: locale === 'en'
        ? 'For any ratio a : b, (a/b) · (b/a) ＝ 1.'
        : 'Για κάθε λόγο α : β, ισχύει (α/β) · (β/α) ＝ 1.'
    }
  ];
  const q8Data = q8Pool[randInt(0, q8Pool.length - 1)];
  const q8Options = makeUniqueMCQ(
    { val: q8Data.correct, render: <span>{q8Data.correct}</span> },
    q8Data.wrongs.map(v => ({ val: v, render: <span>{v}</span> }))
  );

  // Q9: Hard Problem (MCQ)
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex].generate(locale);
  const q9Options = makeUniqueMCQ(
    { val: q9Data.correctVal, render: <span>{q9Data.correctText}</span> },
    q9Data.distractors.map(d => {
      const rawVal = d.split(' ')[0];
      return { val: rawVal, render: <span>{d}</span> };
    })
  );

  // Q10: True/False - Θεωρία λόγου
  const q10IsTrue = Math.random() > 0.5;
  const q10Text = q10IsTrue
    ? (locale === 'en'
        ? 'To compare two like quantities with a ratio, they must be expressed in the same unit of measurement.'
        : 'Για να συγκρίνουμε δύο ομοειδή μεγέθη με λόγο, πρέπει να τα εκφράσουμε στην ίδια μονάδα μέτρησης.')
    : (locale === 'en'
        ? 'In the ratio of two quantities, the order of terms has no effect on its value.'
        : 'Στον λόγο δύο μεγεθών δεν έχει καμία σημασία η σειρά με την οποία γράφονται οι όροι.');

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'fraction',
      title: locale === 'en' ? 'Ratio Simplification' : 'Απλοποίηση Λόγου',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? `Simplify fully the ratio ${q1Num} : ${q1Den} (write as ` : `Να απλοποιηθεί πλήρως ο λόγος ${q1Num} : ${q1Den} (γράψε ως `}</span>
          <Fraction num={q1AnsNum} den={q1AnsDen} size="sm" />
          <span>{locale === 'en' ? ` or ${q1AnsNum}:${q1AnsDen}):` : ` ή ${q1AnsNum}:${q1AnsDen}):`}</span>
        </span>
      ),
      correct: `${q1AnsNum}/${q1AnsDen}`,
      altCorrect: `${q1AnsNum}:${q1AnsDen}`,
      explain: (
        <span>
          {locale === 'en'
            ? `Divide both terms by GCD(${q1Num}, ${q1Den}) ＝ ${q1Gcd}: `
            : `Διαιρούμε και τους δύο όρους με τον Μ.Κ.Δ.(${q1Num}, ${q1Den}) ＝ ${q1Gcd}: `}
          <Fraction num={q1Num} den={q1Den} size="sm" /> ＝ <Fraction num={q1AnsNum} den={q1AnsDen} size="sm" /> ({q1AnsNum} : {q1AnsDen}).
        </span>
      )
    },
    {
      id: 'q2',
      type: 'mcq',
      title: locale === 'en' ? 'Ratio Value' : 'Τιμή του Λόγου',
      prompt: locale === 'en' ? `What is the exact decimal value of ratio ${q2Num} : ${q2Den}?` : `Ποια είναι η ακριβής δεκαδική τιμή του λόγου ${q2Num} : ${q2Den};`,
      options: q2Options,
      correct: q2ValStr,
      explain: `${q2Num} : ${q2Den} ＝ ${q2ValStr}.`
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'fraction',
      title: locale === 'en' ? 'Comparing Like Quantities' : 'Σύγκριση Ομοειδών Μεγεθών',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? `What is the simplified ratio of length ${q3Cm} cm to length ${q3M} m (e.g. ` : `Ποιος είναι ο απλοποιημένος λόγος του μήκους ${q3Cm} cm προς το μήκος ${q3M} m (π.χ. `}</span>
          <Fraction num={q3AnsNum} den={q3AnsDen} size="sm" />
          <span>):</span>
        </span>
      ),
      correct: `${q3AnsNum}/${q3AnsDen}`,
      altCorrect: `${q3AnsNum}:${q3AnsDen}`,
      explain: (
        <span>
          {locale === 'en'
            ? `${q3M} m ＝ ${q3MCm} cm. Ratio: ${q3Cm} : ${q3MCm} ＝ `
            : `Μετατρέπουμε τα ${q3M} m σε cm: ${q3M} · 100 ＝ ${q3MCm} cm. Ο λόγος είναι ${q3Cm} : ${q3MCm}. Απλοποιώντας: `}
          <Fraction num={q3AnsNum} den={q3AnsDen} size="sm" />.
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: locale === 'en' ? 'Reciprocal Ratio' : 'Αντίστροφος Λόγος',
      prompt: locale === 'en' ? `What is the reciprocal of ratio ${q4A} : ${q4B}?` : `Ποιος είναι ο αντίστροφος λόγος του λόγου ${q4A} : ${q4B};`,
      options: q4Options,
      correct: q4Correct,
      explain: locale === 'en'
        ? `Reciprocal of a : b is b : a. Thus reciprocal of ${q4A} : ${q4B} is ${q4Correct}.`
        : `Αντίστροφος του λόγου α : β είναι ο λόγος β : α. Επομένως, ο αντίστροφος του ${q4A} : ${q4B} είναι ο ${q4Correct}.`
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: locale === 'en' ? 'Unlike Quantities Ratio' : 'Λόγος Ετεροειδών Μεγεθών',
      prompt: locale === 'en'
        ? `A train travels ${q5Km} km in ${q5Hours} hours. What is the value of the ratio of distance to time (speed in km/h)?`
        : `Ένα τρένο διανύει ${q5Km} km σε ${q5Hours} ώρες. Ποια είναι η τιμή του λόγου της απόστασης προς τον χρόνο (μέση ταχύτητα σε km/h);`,
      correct: String(q5Speed),
      explain: `${q5Km} : ${q5Hours} ＝ ${q5Speed} km/h.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: locale === 'en' ? 'Equivalent Ratios' : 'Ισοδύναμοι Λόγοι',
      prompt: locale === 'en' ? `Which of the following ratios is equal to ${q6A} : ${q6B}?` : `Ποιος από τους παρακάτω λόγους είναι ίσος με τον λόγο ${q6A} : ${q6B};`,
      options: q6Options,
      correct: q6Correct,
      explain: `(${q6A} · ${q6Mult}) : (${q6B} · ${q6Mult}) ＝ ${q6Correct}.`
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'fraction',
      title: `${locale === 'en' ? 'Problem' : 'Πρόβλημα'}: ${q7Data.title}`,
      prompt: q7Data.prompt,
      correct: q7Data.correctVal,
      altCorrect: q7Data.altVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: locale === 'en' ? 'Ratio Properties' : 'Ιδιότητες Λόγων',
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correct,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'mcq',
      title: `${locale === 'en' ? 'Challenge Problem' : 'Σύνθετο Πρόβλημα'}: ${q9Data.title}`,
      prompt: q9Data.prompt,
      options: q9Options,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'tf',
      title: locale === 'en' ? 'Definition & Order of Terms' : 'Ορισμός & Σειρά Όρων',
      text: q10Text,
      correct: q10IsTrue,
      explain: (
        <span>
          {q10IsTrue
            ? (locale === 'en'
                ? 'Correct! To compare like quantities meaningfully, they must always be converted to the same unit.'
                : 'Σωστά! Για να έχει νόημα η σύγκριση ομοειδών μεγεθών, πρέπει απαραίτητα να εκφράζονται στην ίδια μονάδα μέτρησης.')
            : (locale === 'en'
                ? 'False! The order of terms is crucial: ratio a : b is entirely different from b : a.'
                : 'Λάθος! Η σειρά των όρων είναι καθοριστική: ο λόγος α : β είναι εντελώς διαφορετικός από τον λόγο β : α.')}
        </span>
      )
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function LogosExercisesPage() {
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
    qList.forEach(q => {
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
      const q = questions.find(item => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'fraction') {
        sanitized = sanitized.replace(/[^0-9/:]/g, '');
        const parts = sanitized.split(/[/:]/);
        if (parts.length > 2) {
          sanitized = parts[0] + '/' + parts.slice(1).join('');
        }
      }
      if (sanitized.length > 12) {
        sanitized = sanitized.slice(0, 12);
      }
      setAnswers(prev => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers(prev => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\s+/g, '').replace(':', '/').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\s+/g, '').replace(':', '/').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\s+/g, '').replace(':', '/').trim().toLowerCase() : null;

      return cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt);
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
    questions.forEach(q => {
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

  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== null && String(val).trim() !== '').length;

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
          href="/st-dimotikou/40-logos"
          locale={locale}
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryNav)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 box-border">
        
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
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation cursor-pointer"
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
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all overflow-hidden ${getCardStyle(q)}`}
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words">
                        {toCleanUppercase(`${t.exercise} ${qNum}: ${q.title}`)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <div className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4 break-words [overflow-wrap:anywhere]">
                      {q.type === 'tf' ? `«${q.text}»` : q.prompt}
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
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex items-center justify-center min-h-[48px] cursor-pointer ${
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
                          inputMode={q.inputType === 'fraction' ? 'text' : 'numeric'}
                          maxLength={12}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.inputType === 'fraction' ? t.inputPlaceholderFraction : t.inputPlaceholderNumber}
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
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 cursor-pointer ${
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
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 cursor-pointer ${
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
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200 block w-full max-w-full">
                          <table className="w-full text-xs text-left text-slate-700 min-w-[240px]">
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
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation cursor-pointer"
              >
                <span className="text-xl">🎯</span>
                <span>{toCleanUppercase(t.checkBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
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
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation cursor-pointer"
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
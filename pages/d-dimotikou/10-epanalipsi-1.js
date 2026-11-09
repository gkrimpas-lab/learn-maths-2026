// pages/d-dimotikou/10-epanalipsi.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Συνάρτηση μετατροπής σε άτονα ελληνικά κεφαλαία με εξαίρεση το "Δ'"
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

// Component για μαθηματική γραφή κλασμάτων (κατακόρυφη μορφή)
const Fraction = ({ num, den }) => (
  <span className="inline-flex flex-col items-center align-middle mx-1 text-center font-serif leading-none">
    <span className="border-b border-current px-1 pb-0.5 text-[0.95em]">{num}</span>
    <span className="px-1 pt-0.5 text-[0.95em]">{den}</span>
  </span>
);

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumberByLocale(num, isEn) {
  if (num === null || num === undefined || isNaN(num)) return '';
  return Number(num).toLocaleString(isEn ? 'en-US' : 'el-GR');
}

// Συγκεντρωτικό λεξικό μεταφράσεων i18n
const TRANSLATIONS = {
  el: {
    metaTitle: 'Επανάληψη Ενοτήτων 1 έως 9 | LearnMaths.gr',
    metaDesc: "Μεγάλη επαναληπτική εξάσκηση 30 ερωτήσεων στα μαθηματικά Δ' Δημοτικού: αριθμοί έως 20.000, πολύγωνα, πράξεις, διαίρεση, δεκαδικοί, μήκος και βάρος.",
    backText: "Δ' Δημοτικού",
    lessonsBtn: "Μαθήματα Δ'",
    gradeBadge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΠΑΝΑΛΗΨΗ 1 ΕΩΣ 9",
    heroTitle: '🏆 Επανάληψη Ενοτήτων 1 έως 9 (30 Ερωτήσεις)',
    heroDesc: 'Δοκίμασε τις γνώσεις σου σε όλα όσα μάθαμε: Αριθμοί έως 20.000, πολύγωνα, πράξεις, διαίρεση, δεκαδικοί, μήκος & βάρος!',
    newQuestionsBtn: '🔄 Νέες 30 Ερωτήσεις',
    checkAnswersBtn: '🎯 Έλεγχος Απαντήσεων (30 Ερωτήσεις)',
    placeholderInput: 'Γράψε την απάντησή σου...',
    scoreLabel: '🏆 Τελικό Σκορ:',
    successRate: 'Επιτυχία:',
    footerPrompt: 'Συμπλήρωσε όσο περισσότερες μπορείς και πάτα «Έλεγχος Απαντήσεων»!',
    categories: {
      numbers: '🔢 Αριθμοί έως το 20.000',
      polygons: '📐 Πολύγωνα',
      addSub: '➕ Πρόσθεση & Αφαίρεση',
      mult: '✖️ Πολλαπλασιασμός',
      div: '➗ Διαίρεση',
      decimals: '🔢 Δεκαδικά Κλάσματα & Δεκαδικοί',
      length: '📏 Μονάδες Μήκους',
      weight: '⚖️ Μονάδες Βάρους'
    },
    fractionPromptPre: 'Γράψε το δεκαδικό κλάσμα',
    fractionPromptPost: 'ως δεκαδικό αριθμό με υποδιαστολή:',
    qDecimalsToFraction: (decStr) => `Ποιο δεκαδικό κλάσμα ισούται με τον αριθμό ${decStr};`,
    explainDecimalsToFraction: (decStr, num, den) =>
      `Ο δεκαδικός αριθμός ${decStr} ισοδυναμεί με το δεκαδικό κλάσμα ${num}/${den}.`,
    places: [
      { key: 'units', name: 'Μονάδων', mult: 1 },
      { key: 'tens', name: 'Δεκάδων', mult: 10 },
      { key: 'hundreds', name: 'Εκατοντάδων', mult: 100 },
      { key: 'thousands', name: 'Μονάδων Χιλιάδων', mult: 1000 },
      { key: 'tenThousands', name: 'Δεκάδων Χιλιάδων', mult: 10000 }
    ],
    polygons: [
      { key: 'triangle', name: 'Τρίγωνο', lower: 'τρίγωνο', sides: 3 },
      { key: 'quadrilateral', name: 'Τετράπλευρο', lower: 'τετράπλευρο', sides: 4 },
      { key: 'pentagon', name: 'Πεντάγωνο', lower: 'πεντάγωνο', sides: 5 },
      { key: 'hexagon', name: 'Εξάγωνο', lower: 'εξάγωνο', sides: 6 },
      { key: 'heptagon', name: 'Επτάγωνο', lower: 'επτάγωνο', sides: 7 },
      { key: 'octagon', name: 'Οκτάγωνο', lower: 'οκτάγωνο', sides: 8 }
    ],
    qPlaceDigit: (placeName, numStr) => `Ποιο ψηφίο βρίσκεται στη θέση των ${placeName} στον αριθμό ${numStr};`,
    explainPlaceDigit: (numStr, placeName, digit) =>
      `Στον αριθμό ${numStr}, στη θέση των ${placeName} βρίσκεται το ψηφίο ${digit}.`,
    qCompareNumbers: 'Επίλεξε το σωστό σύμβολο σύγκρισης για τους αριθμούς:',
    explainCompareNumbers: (num1Str, sym, num2Str) =>
      `Συγκρίνοντας τα ψηφία από τα αριστερά προς τα δεξιά, ισχύει ${num1Str} ${sym} ${num2Str}.`,
    qNextPrev: (isNext, numStr) => `Ποιος είναι ο ${isNext ? 'επόμενος' : 'προηγούμενος'} αριθμός του ${numStr};`,
    explainNextPrev: (isNext, numStr, targetStr) =>
      `Ο ${isNext ? 'επόμενος' : 'προηγούμενος'} αριθμός του ${numStr} είναι ο ${targetStr}.`,
    qPolygonSides: (polyLower) => `Πόσες πλευρές έχει συνολικά ένα ${polyLower};`,
    explainPolygonSides: (polyLower, sides) =>
      `Ένα ${polyLower} έχει ακριβώς ${sides} πλευρές, ${sides} κορυφές και ${sides} γωνίες.`,
    qPolygonName: (sides) => `Πώς ονομάζεται το κανονικό πολύγωνο που έχει ακριβώς ${sides} πλευρές;`,
    explainPolygonName: (sides, polyLower) =>
      `Το επίπεδο γεωμετρικό σχήμα με ${sides} πλευρές ονομάζεται ${polyLower}.`,
    qAddition: (aStr, bStr) => `Υπολόγισε το αποτέλεσμα της πρόσθεσης: ${aStr} ＋ ${bStr}`,
    explainAddition: (aStr, bStr, sumStr) => `${aStr} ＋ ${bStr} ＝ ${sumStr}.`,
    qSubtraction: (aStr, bStr) => `Υπολόγισε το αποτέλεσμα της αφαίρεσης: ${aStr} － ${bStr}`,
    explainSubtraction: (aStr, bStr, diffStr) =>
      `${aStr} － ${bStr} ＝ ${diffStr} (επαλήθευση: ${diffStr} ＋ ${bStr} ＝ ${aStr}).`,
    qMultiplication: (aStr, bStr) => `Υπολόγισε το γινόμενο: ${aStr} · ${bStr}`,
    explainMultiplication: (aStr, bStr, prodStr) =>
      `Το γινόμενο των δύο παραγόντων είναι ${aStr} · ${bStr} ＝ ${prodStr}.`,
    qExactDiv: (divStr, dStr) => `Υπολόγισε το πηλίκο της τέλειας διαίρεσης: ${divStr} : ${dStr}`,
    explainExactDiv: (divStr, dStr, qStr) => `${divStr} : ${dStr} ＝ ${qStr}.`,
    qRemainderDiv: (divStr, dStr) => `Πόσο είναι το υπόλοιπο (υ) της διαίρεσης ${divStr} : ${dStr};`,
    explainRemainderDiv: (divStr, dStr, qStr, rem) =>
      `${divStr} ＝ (${dStr} · ${qStr}) ＋ ${rem}, άρα το υπόλοιπο είναι ${rem}.`,
    qConvertLength: (valStr, from, to) => `Μετάτρεψε τη μονάδα μέτρησης μήκους: ${valStr} ${from} ＝ ? ${to}`,
    explainLengthBigToSmall: (valStr, from, factorStr, correctStr, to) =>
      `${valStr} ${from} · ${factorStr} ＝ ${correctStr} ${to}.`,
    explainLengthSmallToBig: (valStr, to, factorStr, correctStr, from) =>
      `${valStr} ${to} : ${factorStr} ＝ ${correctStr} ${from}.`,
    qConvertWeight: (valStr, from, to) => `Μετάτρεψε τη μονάδα μέτρησης βάρους: ${valStr} ${from} ＝ ? ${to}`,
    explainWeightBigToSmall: (valStr, from, thousandStr, correctStr, to) =>
      `${valStr} ${from} · ${thousandStr} ＝ ${correctStr} ${to}.`,
    explainWeightSmallToBig: (valStr, from, thousandStr, correctStr, to) =>
      `${valStr} ${from} : ${thousandStr} ＝ ${correctStr} ${to}.`
  },
  en: {
    metaTitle: 'Units 1 to 9 Review | LearnMaths.gr',
    metaDesc: 'Comprehensive 30-question math review for Grade 4: numbers up to 20,000, polygons, arithmetic operations, division, decimals, length, and weight.',
    backText: 'Grade 4',
    lessonsBtn: 'Grade 4 Lessons',
    gradeBadge: 'GRADE 4 • REVIEW UNITS 1 TO 9',
    heroTitle: '🏆 Units 1 to 9 Review (30 Questions)',
    heroDesc: 'Test your knowledge on everything covered: Numbers up to 20,000, polygons, arithmetic, division, decimals, length & weight!',
    newQuestionsBtn: '🔄 New 30 Questions',
    checkAnswersBtn: '🎯 Check Answers (30 Questions)',
    placeholderInput: 'Type your answer...',
    scoreLabel: '🏆 Final Score:',
    successRate: 'Score:',
    footerPrompt: 'Answer as many as you can and click "Check Answers"!',
    categories: {
      numbers: '🔢 Numbers up to 20,000',
      polygons: '📐 Polygons',
      addSub: '➕ Addition & Subtraction',
      mult: '✖️ Multiplication',
      div: '➗ Division',
      decimals: '🔢 Decimal Fractions & Decimals',
      length: '📏 Length Units',
      weight: '⚖️ Weight Units'
    },
    fractionPromptPre: 'Write the decimal fraction',
    fractionPromptPost: 'as a decimal number:',
    qDecimalsToFraction: (decStr) => `Which decimal fraction equals the number ${decStr}?`,
    explainDecimalsToFraction: (decStr, num, den) =>
      `The decimal number ${decStr} is equal to the decimal fraction ${num}/${den}.`,
    places: [
      { key: 'units', name: 'Units (Ones)', mult: 1 },
      { key: 'tens', name: 'Tens', mult: 10 },
      { key: 'hundreds', name: 'Hundreds', mult: 100 },
      { key: 'thousands', name: 'Thousands', mult: 1000 },
      { key: 'tenThousands', name: 'Ten Thousands', mult: 10000 }
    ],
    polygons: [
      { key: 'triangle', name: 'Triangle', lower: 'triangle', sides: 3 },
      { key: 'quadrilateral', name: 'Quadrilateral', lower: 'quadrilateral', sides: 4 },
      { key: 'pentagon', name: 'Pentagon', lower: 'pentagon', sides: 5 },
      { key: 'hexagon', name: 'Hexagon', lower: 'hexagon', sides: 6 },
      { key: 'heptagon', name: 'Heptagon', lower: 'heptagon', sides: 7 },
      { key: 'octagon', name: 'Octagon', lower: 'octagon', sides: 8 }
    ],
    qPlaceDigit: (placeName, numStr) => `Which digit is in the ${placeName} place in the number ${numStr}?`,
    explainPlaceDigit: (numStr, placeName, digit) =>
      `In the number ${numStr}, the digit in the ${placeName} place is ${digit}.`,
    qCompareNumbers: 'Select the correct comparison symbol for the numbers:',
    explainCompareNumbers: (num1Str, sym, num2Str) =>
      `Comparing the digits from left to right, we have ${num1Str} ${sym} ${num2Str}.`,
    qNextPrev: (isNext, numStr) => `What is the ${isNext ? 'next' : 'previous'} number after ${numStr}?`,
    explainNextPrev: (isNext, numStr, targetStr) =>
      `The ${isNext ? 'next' : 'previous'} number after ${numStr} is ${targetStr}.`,
    qPolygonSides: (polyLower) => `How many sides does a ${polyLower} have?`,
    explainPolygonSides: (polyLower, sides) =>
      `A ${polyLower} has exactly ${sides} sides, ${sides} vertices, and ${sides} angles.`,
    qPolygonName: (sides) => `What is the regular polygon with exactly ${sides} sides called?`,
    explainPolygonName: (sides, polyLower) =>
      `The flat geometric shape with ${sides} sides is called a ${polyLower}.`,
    qAddition: (aStr, bStr) => `Calculate the sum: ${aStr} ＋ ${bStr}`,
    explainAddition: (aStr, bStr, sumStr) => `${aStr} ＋ ${bStr} ＝ ${sumStr}.`,
    qSubtraction: (aStr, bStr) => `Calculate the difference: ${aStr} － ${bStr}`,
    explainSubtraction: (aStr, bStr, diffStr) =>
      `${aStr} － ${bStr} ＝ ${diffStr} (verification: ${diffStr} ＋ ${bStr} ＝ ${aStr}).`,
    qMultiplication: (aStr, bStr) => `Calculate the product: ${aStr} · ${bStr}`,
    explainMultiplication: (aStr, bStr, prodStr) =>
      `The product of the two factors is ${aStr} · ${bStr} ＝ ${prodStr}.`,
    qExactDiv: (divStr, dStr) => `Calculate the quotient of the exact division: ${divStr} : ${dStr}`,
    explainExactDiv: (divStr, dStr, qStr) => `${divStr} : ${dStr} ＝ ${qStr}.`,
    qRemainderDiv: (divStr, dStr) => `What is the remainder (r) of the division ${divStr} : ${dStr}?`,
    explainRemainderDiv: (divStr, dStr, qStr, rem) =>
      `${divStr} ＝ (${dStr} · ${qStr}) ＋ ${rem}, so the remainder is ${rem}.`,
    qConvertLength: (valStr, from, to) => `Convert the length unit: ${valStr} ${from} ＝ ? ${to}`,
    explainLengthBigToSmall: (valStr, from, factorStr, correctStr, to) =>
      `${valStr} ${from} · ${factorStr} ＝ ${correctStr} ${to}.`,
    explainLengthSmallToBig: (valStr, to, factorStr, correctStr, from) =>
      `${valStr} ${to} : ${factorStr} ＝ ${correctStr} ${from}.`,
    qConvertWeight: (valStr, from, to) => `Convert the weight unit: ${valStr} ${from} ＝ ? ${to}`,
    explainWeightBigToSmall: (valStr, from, thousandStr, correctStr, to) =>
      `${valStr} ${from} · ${thousandStr} ＝ ${correctStr} ${to}.`,
    explainWeightSmallToBig: (valStr, from, thousandStr, correctStr, to) =>
      `${valStr} ${from} : ${thousandStr} ＝ ${correctStr} ${to}.`
  }
};

// 1. ΑΡΙΘΜΟΙ ΕΩΣ 20.000 (3 ΑΣΚΗΣΕΙΣ)
function genNumbersQuestion(type) {
  if (type === 1) {
    const placeIndices = [0, 1, 2, 3, 4];
    const mults = [1, 10, 100, 1000, 10000];

    let num = 0;
    let chosenIdx = 1;
    let digit = 0;

    while (true) {
      num = getRandomInt(1001, 19999);
      const validIndices = placeIndices.filter((idx) => Math.floor(num / mults[idx]) % 10 > 0);
      chosenIdx = validIndices[getRandomInt(0, validIndices.length - 1)];
      digit = Math.floor(num / mults[chosenIdx]) % 10;
      const count = num.toString().split('').filter((ch) => ch === digit.toString()).length;
      if (count === 1) break;
    }

    return {
      subCategory: 'numbers',
      type: 'placeValue',
      num,
      chosenIdx,
      inputType: 'number',
      correctRaw: digit,
      getRenderData: (t, isEn) => {
        const placeObj = t.places[chosenIdx];
        const numStr = formatNumberByLocale(num, isEn);
        return {
          category: t.categories.numbers,
          question: t.qPlaceDigit(placeObj.name, numStr),
          correct: digit.toString(),
          explain: t.explainPlaceDigit(numStr, placeObj.name, digit)
        };
      }
    };
  } else if (type === 2) {
    const num1 = getRandomInt(5000, 19999);
    let num2 = num1 + getRandomInt(-400, 400);
    if (num1 === num2) num2 += 10;

    const correctSym = num1 > num2 ? '＞' : '＜';
    return {
      subCategory: 'numbers',
      type: 'compare',
      num1,
      num2,
      inputType: 'sym',
      correctRaw: correctSym,
      getRenderData: (t, isEn) => {
        const num1Str = formatNumberByLocale(num1, isEn);
        const num2Str = formatNumberByLocale(num2, isEn);
        return {
          category: t.categories.numbers,
          question: t.qCompareNumbers,
          valA: num1Str,
          valB: num2Str,
          correct: correctSym,
          explain: t.explainCompareNumbers(num1Str, correctSym, num2Str)
        };
      }
    };
  } else {
    const num = getRandomInt(2000, 19998);
    const isNext = Math.random() > 0.5;
    const target = isNext ? num + 1 : num - 1;

    return {
      subCategory: 'numbers',
      type: 'nextPrev',
      num,
      isNext,
      target,
      inputType: 'number',
      correctRaw: target,
      getRenderData: (t, isEn) => {
        const numStr = formatNumberByLocale(num, isEn);
        const targetStr = formatNumberByLocale(target, isEn);
        return {
          category: t.categories.numbers,
          question: t.qNextPrev(isNext, numStr),
          correct: target.toString(),
          explain: t.explainNextPrev(isNext, numStr, targetStr)
        };
      }
    };
  }
}

// 2. ΠΟΛΥΓΩΝΑ ΕΩΣ 8 ΠΛΕΥΡΕΣ (3 ΑΣΚΗΣΕΙΣ)
function genPolygonsQuestion() {
  const polygonKeys = ['triangle', 'quadrilateral', 'pentagon', 'hexagon', 'heptagon', 'octagon'];
  const mode = getRandomInt(1, 2);
  const selectedKey = polygonKeys[getRandomInt(0, polygonKeys.length - 1)];

  if (mode === 1) {
    return {
      subCategory: 'polygons',
      type: 'countSides',
      selectedKey,
      inputType: 'number',
      getRenderData: (t) => {
        const selected = t.polygons.find((p) => p.key === selectedKey);
        return {
          category: t.categories.polygons,
          question: t.qPolygonSides(selected.lower),
          correct: selected.sides.toString(),
          explain: t.explainPolygonSides(selected.lower, selected.sides)
        };
      }
    };
  } else {
    const wrongKeys = polygonKeys.filter((k) => k !== selectedKey).sort(() => Math.random() - 0.5).slice(0, 3);
    const shuffledKeys = [...new Set([selectedKey, ...wrongKeys])].sort(() => Math.random() - 0.5);

    return {
      subCategory: 'polygons',
      type: 'nameBySides',
      selectedKey,
      shuffledKeys,
      inputType: 'mcq',
      getRenderData: (t) => {
        const selected = t.polygons.find((p) => p.key === selectedKey);
        const options = shuffledKeys.map((key) => {
          const poly = t.polygons.find((p) => p.key === key);
          return {
            key,
            text: poly.name,
            isCorrect: key === selectedKey
          };
        });

        return {
          category: t.categories.polygons,
          question: t.qPolygonName(selected.sides),
          options,
          correct: selectedKey,
          explain: t.explainPolygonName(selected.sides, selected.lower)
        };
      }
    };
  }
}

// 3. ΠΡΟΣΘΕΣΗ ΚΑΙ ΑΦΑΙΡΕΣΗ (4 ΑΣΚΗΣΕΙΣ)
function genAddSubQuestion() {
  const isAdd = Math.random() > 0.5;
  if (isAdd) {
    const a = getRandomInt(1200, 8500);
    const b = getRandomInt(1100, 8500);
    const sum = a + b;
    return {
      subCategory: 'addSub',
      isAdd: true,
      a,
      b,
      sum,
      inputType: 'number',
      correctRaw: sum,
      getRenderData: (t, isEn) => {
        const aStr = formatNumberByLocale(a, isEn);
        const bStr = formatNumberByLocale(b, isEn);
        const sumStr = formatNumberByLocale(sum, isEn);
        return {
          category: t.categories.addSub,
          question: t.qAddition(aStr, bStr),
          correct: sum.toString(),
          explain: t.explainAddition(aStr, bStr, sumStr)
        };
      }
    };
  } else {
    const a = getRandomInt(5000, 18000);
    const b = getRandomInt(1000, a - 500);
    const diff = a - b;
    return {
      subCategory: 'addSub',
      isAdd: false,
      a,
      b,
      diff,
      inputType: 'number',
      correctRaw: diff,
      getRenderData: (t, isEn) => {
        const aStr = formatNumberByLocale(a, isEn);
        const bStr = formatNumberByLocale(b, isEn);
        const diffStr = formatNumberByLocale(diff, isEn);
        return {
          category: t.categories.addSub,
          question: t.qSubtraction(aStr, bStr),
          correct: diff.toString(),
          explain: t.explainSubtraction(aStr, bStr, diffStr)
        };
      }
    };
  }
}

// 4. ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ (4 ΑΣΚΗΣΕΙΣ)
function genMultiplicationQuestion() {
  const isTwoDigit = Math.random() > 0.4;
  const a = getRandomInt(14, 150);
  const b = isTwoDigit ? getRandomInt(12, 35) : getRandomInt(4, 9);
  const prod = a * b;

  return {
    subCategory: 'mult',
    a,
    b,
    prod,
    inputType: 'number',
    correctRaw: prod,
    getRenderData: (t, isEn) => {
      const aStr = formatNumberByLocale(a, isEn);
      const bStr = formatNumberByLocale(b, isEn);
      const prodStr = formatNumberByLocale(prod, isEn);
      return {
        category: t.categories.mult,
        question: t.qMultiplication(aStr, bStr),
        correct: prod.toString(),
        explain: t.explainMultiplication(aStr, bStr, prodStr)
      };
    }
  };
}

// 5. ΔΙΑΙΡΕΣΗ (4 ΑΣΚΗΣΕΙΣ)
function genDivisionQuestion() {
  const isExact = Math.random() > 0.5;
  const divisor = getRandomInt(3, 9);
  const quotient = getRandomInt(14, 120);

  if (isExact) {
    const dividend = divisor * quotient;
    return {
      subCategory: 'div',
      isExact: true,
      dividend,
      divisor,
      quotient,
      inputType: 'number',
      correctRaw: quotient,
      getRenderData: (t, isEn) => {
        const divStr = formatNumberByLocale(dividend, isEn);
        const dStr = formatNumberByLocale(divisor, isEn);
        const qStr = formatNumberByLocale(quotient, isEn);
        return {
          category: t.categories.div,
          question: t.qExactDiv(divStr, dStr),
          correct: quotient.toString(),
          explain: t.explainExactDiv(divStr, dStr, qStr)
        };
      }
    };
  } else {
    const remainder = getRandomInt(1, divisor - 1);
    const dividend = divisor * quotient + remainder;
    return {
      subCategory: 'div',
      isExact: false,
      dividend,
      divisor,
      quotient,
      remainder,
      inputType: 'number',
      correctRaw: remainder,
      getRenderData: (t, isEn) => {
        const divStr = formatNumberByLocale(dividend, isEn);
        const dStr = formatNumberByLocale(divisor, isEn);
        const qStr = formatNumberByLocale(quotient, isEn);
        return {
          category: t.categories.div,
          question: t.qRemainderDiv(divStr, dStr),
          correct: remainder.toString(),
          explain: t.explainRemainderDiv(divStr, dStr, qStr, remainder)
        };
      }
    };
  }
}

// 6. ΔΕΚΑΔΙΚΑ ΚΛΑΣΜΑΤΑ & ΔΕΚΑΔΙΚΟΙ (4 ΑΣΚΗΣΕΙΣ)
function genDecimalsQuestion() {
  const mode = getRandomInt(1, 2);
  const den = Math.random() > 0.5 ? 10 : 100;
  const num = den === 10 ? getRandomInt(1, 95) : getRandomInt(5, 480);
  const rawDec = num / den;
  const digits = den === 10 ? 1 : 2;

  if (mode === 1) {
    return {
      subCategory: 'decimals',
      mode: 1,
      num,
      den,
      rawDec,
      digits,
      inputType: 'decimal',
      getRenderData: (t, isEn) => {
        const decStr = rawDec.toFixed(digits).replace('.', isEn ? '.' : ',');
        return {
          category: t.categories.decimals,
          isFractionHeader: true,
          fractionNum: num,
          fractionDen: den,
          correct: decStr,
          rawVal: rawDec,
          explain: `${num}/${den} ＝ ${decStr}.`
        };
      }
    };
  } else {
    const rawOptions = [
      { text: `${num}/${den}`, num, den, isCorrect: true },
      { text: `${num}/${den === 10 ? 100 : 10}`, num, den: den === 10 ? 100 : 10, isCorrect: false },
      { text: `${num + 5}/${den}`, num: num + 5, den, isCorrect: false },
      { text: `${den}/${num}`, num: den, den: num, isCorrect: false }
    ];
    const uniqueOptions = Array.from(new Set(rawOptions.map((o) => `${o.num}/${o.den}`))).map((key) =>
      rawOptions.find((o) => `${o.num}/${o.den}` === key)
    ).sort(() => Math.random() - 0.5);

    return {
      subCategory: 'decimals',
      mode: 2,
      num,
      den,
      rawDec,
      digits,
      options: uniqueOptions,
      inputType: 'mcq-fraction',
      getRenderData: (t, isEn) => {
        const decStr = rawDec.toFixed(digits).replace('.', isEn ? '.' : ',');
        return {
          category: t.categories.decimals,
          question: t.qDecimalsToFraction(decStr),
          options: uniqueOptions,
          correct: `${num}/${den}`,
          explain: t.explainDecimalsToFraction(decStr, num, den)
        };
      }
    };
  }
}

// 7. ΜΟΝΑΔΕΣ ΜΗΚΟΥΣ (4 ΑΣΚΗΣΕΙΣ)
function genLengthQuestion() {
  const types = [
    { from: 'm', to: 'cm', factor: 100 },
    { from: 'km', to: 'm', factor: 1000 },
    { from: 'dm', to: 'cm', factor: 10 },
    { from: 'cm', to: 'mm', factor: 10 }
  ];

  const isBigToSmall = Math.random() > 0.4;
  const selected = types[getRandomInt(0, types.length - 1)];

  if (isBigToSmall) {
    const val = getRandomInt(2, 20);
    const correct = val * selected.factor;
    return {
      subCategory: 'length',
      isBigToSmall: true,
      val,
      from: selected.from,
      to: selected.to,
      factor: selected.factor,
      correct,
      inputType: 'number',
      correctRaw: correct,
      getRenderData: (t, isEn) => {
        const valStr = formatNumberByLocale(val, isEn);
        const correctStr = formatNumberByLocale(correct, isEn);
        const factorStr = formatNumberByLocale(selected.factor, isEn);
        return {
          category: t.categories.length,
          question: t.qConvertLength(valStr, selected.from, selected.to),
          unitTo: selected.to,
          correct: correct.toString(),
          explain: t.explainLengthBigToSmall(valStr, selected.from, factorStr, correctStr, selected.to)
        };
      }
    };
  } else {
    const correct = getRandomInt(2, 15);
    const val = correct * selected.factor;
    return {
      subCategory: 'length',
      isBigToSmall: false,
      val,
      from: selected.from,
      to: selected.to,
      factor: selected.factor,
      correct,
      inputType: 'number',
      correctRaw: correct,
      getRenderData: (t, isEn) => {
        const valStr = formatNumberByLocale(val, isEn);
        const correctStr = formatNumberByLocale(correct, isEn);
        const factorStr = formatNumberByLocale(selected.factor, isEn);
        return {
          category: t.categories.length,
          question: t.qConvertLength(valStr, selected.to, selected.from),
          unitTo: selected.from,
          correct: correct.toString(),
          explain: t.explainLengthSmallToBig(valStr, selected.to, factorStr, correctStr, selected.from)
        };
      }
    };
  }
}

// 8. ΜΟΝΑΔΕΣ ΒΑΡΟΥΣ (4 ΑΣΚΗΣΕΙΣ)
function genWeightQuestion() {
  const isBigToSmall = Math.random() > 0.5;
  if (isBigToSmall) {
    const val = getRandomInt(2, 14);
    const unit = Math.random() > 0.5 ? 'kg' : 't';
    const targetUnit = unit === 'kg' ? 'g' : 'kg';
    const correct = val * 1000;

    return {
      subCategory: 'weight',
      isBigToSmall: true,
      val,
      unit,
      targetUnit,
      correct,
      inputType: 'number',
      correctRaw: correct,
      getRenderData: (t, isEn) => {
        const valStr = formatNumberByLocale(val, isEn);
        const correctStr = formatNumberByLocale(correct, isEn);
        const thousandStr = formatNumberByLocale(1000, isEn);
        return {
          category: t.categories.weight,
          question: t.qConvertWeight(valStr, unit, targetUnit),
          unitTo: targetUnit,
          correct: correct.toString(),
          explain: t.explainWeightBigToSmall(valStr, unit, thousandStr, correctStr, targetUnit)
        };
      }
    };
  } else {
    const correct = getRandomInt(2, 15);
    const val = correct * 1000;
    const unit = Math.random() > 0.5 ? 'g' : 'kg';
    const targetUnit = unit === 'g' ? 'kg' : 't';

    return {
      subCategory: 'weight',
      isBigToSmall: false,
      val,
      unit,
      targetUnit,
      correct,
      inputType: 'number',
      correctRaw: correct,
      getRenderData: (t, isEn) => {
        const valStr = formatNumberByLocale(val, isEn);
        const correctStr = formatNumberByLocale(correct, isEn);
        const thousandStr = formatNumberByLocale(1000, isEn);
        return {
          category: t.categories.weight,
          question: t.qConvertWeight(valStr, unit, targetUnit),
          unitTo: targetUnit,
          correct: correct.toString(),
          explain: t.explainWeightSmallToBig(valStr, unit, thousandStr, correctStr, targetUnit)
        };
      }
    };
  }
}

// ΓΕΝΝΗΤΡΙΑ 30 ΑΣΚΗΣΕΩΝ
function generateAllQuestions() {
  const qList = [
    genNumbersQuestion(1), genNumbersQuestion(2), genNumbersQuestion(3),
    genPolygonsQuestion(), genPolygonsQuestion(), genPolygonsQuestion(),
    genAddSubQuestion(), genAddSubQuestion(), genAddSubQuestion(), genAddSubQuestion(),
    genMultiplicationQuestion(), genMultiplicationQuestion(), genMultiplicationQuestion(), genMultiplicationQuestion(),
    genDivisionQuestion(), genDivisionQuestion(), genDivisionQuestion(), genDivisionQuestion(),
    genDecimalsQuestion(), genDecimalsQuestion(), genDecimalsQuestion(), genDecimalsQuestion(),
    genLengthQuestion(), genLengthQuestion(), genLengthQuestion(), genLengthQuestion(),
    genWeightQuestion(), genWeightQuestion(), genWeightQuestion(), genWeightQuestion()
  ];

  return qList.sort(() => Math.random() - 0.5);
}

export default function EpanalipsiPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];
  const isEn = locale === 'en';

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    const q = generateAllQuestions();
    setQuestions(q);
    const initialAns = {};
    q.forEach((_, idx) => { initialAns[`q${idx}`] = ''; });
    setAnswers(initialAns);
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, []);

  if (questions.length === 0) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleNumericInput = (key, rawVal, isDecimal = false) => {
    if (submitted) return;
    const clean = isDecimal
      ? (isEn
          ? rawVal.replace(/[^0-9.]/g, '').slice(0, 10)
          : rawVal.replace(/\./g, ',').replace(/[^0-9,]/g, '').slice(0, 10))
      : rawVal.replace(/[^0-9]/g, '').slice(0, 10);
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const checkAnswerIsCorrect = (q, userVal) => {
    if (!userVal) return false;
    const cleaned = userVal.toString().trim();

    if (q.inputType === 'mcq') {
      return cleaned === q.selectedKey;
    }

    if (q.inputType === 'mcq-fraction') {
      return cleaned === `${q.num}/${q.den}`;
    }

    if (q.inputType === 'sym') {
      return cleaned === q.correctRaw;
    }

    if (q.inputType === 'decimal') {
      const userNum = parseFloat(cleaned.replace(',', '.'));
      if (isNaN(userNum)) return false;
      return Math.abs(userNum - q.rawDec) <= 0.05;
    }

    if (q.inputType === 'number') {
      const parsedUser = parseInt(cleaned, 10);
      return parsedUser === q.correctRaw;
    }

    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    questions.forEach((q, idx) => {
      const userAns = answers[`q${idx}`];
      if (checkAnswerIsCorrect(q, userAns)) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setSubmitted(true);
  };

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.lessonsBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.gradeBadge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.heroTitle}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-2xl">
              {t.heroDesc}
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-xl hover:bg-amber-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {t.newQuestionsBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ 30 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, idx) => {
            const qKey = `q${idx}`;
            const renderData = q.getRenderData(t, isEn);
            const isCorrect = checkAnswerIsCorrect(q, answers[qKey]);

            return (
              <div
                key={idx}
                className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
                  submitted
                    ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
                    : 'border-slate-100'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-blue-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-black tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    {renderData.category}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 sm:pl-10 mb-4 leading-snug">
                  {renderData.isFractionHeader ? (
                    <span className="inline-flex flex-wrap items-center gap-1.5">
                      <span>{t.fractionPromptPre}</span>
                      <Fraction num={renderData.fractionNum} den={renderData.fractionDen} />
                      <span>{t.fractionPromptPost}</span>
                    </span>
                  ) : (
                    renderData.question
                  )}
                </h3>

                <div className="sm:pl-10 space-y-3">
                  {/* Τύπος: MCQ (Κείμενο) */}
                  {q.inputType === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                      {renderData.options.map((opt, oIdx) => {
                        const isSelected = answers[qKey] === opt.key;
                        return (
                          <label
                            key={oIdx}
                            className={`flex items-center justify-center p-3 rounded-2xl border cursor-pointer transition text-xs sm:text-sm font-bold select-none ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-sm'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                            } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
                          >
                            <input
                              type="radio"
                              id={`${qKey}-opt-${oIdx}`}
                              name={qKey}
                              value={opt.key}
                              checked={isSelected}
                              onChange={() => handleInputChange(qKey, opt.key)}
                              disabled={submitted}
                              className="hidden"
                            />
                            <span className="break-words whitespace-normal leading-snug flex-1 text-center">
                              {opt.text}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Τύπος: MCQ με Κλάσματα */}
                  {q.inputType === 'mcq-fraction' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {renderData.options.map((opt, oIdx) => {
                        const optionValue = `${opt.num}/${opt.den}`;
                        const isSelected = answers[qKey] === optionValue;
                        return (
                          <label
                            key={oIdx}
                            className={`flex items-center justify-center p-3 rounded-2xl border cursor-pointer transition select-none ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-sm'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                            } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
                          >
                            <input
                              type="radio"
                              id={`${qKey}-opt-${oIdx}`}
                              name={qKey}
                              value={optionValue}
                              checked={isSelected}
                              onChange={() => handleInputChange(qKey, optionValue)}
                              disabled={submitted}
                              className="hidden"
                            />
                            <Fraction num={opt.num} den={opt.den} />
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Τύπος: Σύγκριση (Σύμβολα) */}
                  {q.inputType === 'sym' && (
                    <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-3 text-lg sm:text-xl font-mono font-black text-slate-800 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span>{renderData.valA}</span>
                      <div className="flex gap-2">
                        {['＜', '＝', '＞'].map((sym) => (
                          <button
                            type="button"
                            key={sym}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleInputChange(qKey, sym);
                            }}
                            disabled={submitted}
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-base sm:text-lg font-black border transition active:scale-95 touch-manipulation select-none flex items-center justify-center ${
                              answers[qKey] === sym
                                ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {sym}
                          </button>
                        ))}
                      </div>
                      <span>{renderData.valB}</span>
                    </div>
                  )}

                  {/* Τύπος: Αριθμητικό ή Δεκαδικό Input */}
                  {(q.inputType === 'number' || q.inputType === 'decimal') && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        inputMode={q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                        autoComplete="off"
                        id={`input-${qKey}`}
                        name={`input-${qKey}`}
                        placeholder={t.placeholderInput}
                        maxLength={10}
                        value={answers[qKey]}
                        onChange={(e) => handleNumericInput(qKey, e.target.value, q.inputType === 'decimal')}
                        disabled={submitted}
                        className="w-full sm:w-80 p-3 rounded-2xl border border-slate-300 font-mono text-base sm:text-lg font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-xs placeholder:font-normal placeholder:text-slate-400 bg-slate-50/50"
                      />
                      {renderData.unitTo && (
                        <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">
                          {renderData.unitTo}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {submitted && (
                  <div className="mt-4 sm:pl-10 text-xs sm:text-sm leading-relaxed">
                    {isCorrect ? (
                      <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                        {renderData.explain}
                      </p>
                    ) : (
                      <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                        {renderData.explain}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                {t.checkAnswersBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ΣΤΑΘΕΡΟ ΚΑΤΩ FOOTER (STICKY FOOTER BAR) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>{t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 30</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{Math.round((score / 30) * 100)}%</span>
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
                {t.footerPrompt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
// pages/st-dimotikou/epanalipsi-1.js
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

function gcd(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a, b) {
  if (!a || !b) return 1;
  return Math.abs(a * b) / gcd(a, b);
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

// Μορφοποίηση αριθμών βάσει locale
function formatNum(num, locale = 'el') {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  return Number(num).toLocaleString(loc);
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
    pageTitle: "Μεγάλη Επανάληψη (Κεφάλαια 1 - 30) - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Πλήρες επαναληπτικό διαγώνισμα 30 ερωτήσεων στα μαθηματικά της ΣΤ' Δημοτικού (Κεφάλαια 1-30) με αυτόματη βαθμολόγηση.",
    backText: "ΣΤ' Δημοτικού",
    badgeText: "🏆 ΜΕΓΑΛΗ ΕΠΑΝΑΛΗΨΗ • ΚΕΦΑΛΑΙΑ 1 - 30 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Πρώτο Επαναληπτικό Τεστ: Κεφάλαια 1 έως 30",
    heroDesc: "30 δυναμικά θέματα που καλύπτουν όλες τις έννοιες: φυσικούς, δεκαδικούς, διαιρετότητα, πρώτους αριθμούς, δυνάμεις και πράξεις κλασμάτων!",
    newTestBtn: "Νέο Τεστ",
    completeBtn: "Ολοκλήρωση & Βαθμολόγηση Τεστ",
    scoreBadge: "Τελικό Σκορ",
    answeredBadge: "Απαντήθηκαν",
    successRate: "Ποσοστό Επιτυχίας",
    retryBtn: "Παίξε ξανά με 30 νέες ασκήσεις!",
    bottomHint: "Απάντησε σε όλες τις ερωτήσεις και πάτησε «Ολοκλήρωση & Βαθμολόγηση Τεστ»!",
    questionsCount: "30 Ερωτήσεις",
    placeholderFraction: "π.χ. 3/4",
    placeholderDecimal: "π.χ. 0,5",
    placeholderAnswer: "Απάντηση..."
  },
  en: {
    pageTitle: "Comprehensive Revision (Chapters 1 - 30) - 6th Grade | LearnMaths.gr",
    pageDesc: "Complete practice test of 30 questions covering 6th Grade mathematics (Chapters 1-30) with automated scoring.",
    backText: "6th Grade",
    badgeText: "🏆 COMPREHENSIVE REVISION • CHAPTERS 1 - 30 • 6TH GRADE",
    heroTitle: "First Revision Test: Chapters 1 to 30",
    heroDesc: "30 dynamic problems covering natural numbers, decimals, divisibility, prime numbers, powers, and fraction operations!",
    newTestBtn: "New Test",
    completeBtn: "Complete & Score Test",
    scoreBadge: "Final Score",
    answeredBadge: "Answered",
    successRate: "Success Rate",
    retryBtn: "Play again with 30 new exercises!",
    bottomHint: "Answer all questions and press 'Complete & Score Test'!",
    questionsCount: "30 Questions",
    placeholderFraction: "e.g. 3/4",
    placeholderDecimal: "e.g. 0.5",
    placeholderAnswer: "Answer..."
  }
};

// =========================================================
// ΔΕΞΑΜΕΝΗ ΓΕΝΝΗΤΡΙΩΝ ΓΙΑ ΤΑ 30 ΚΕΦΑΛΑΙΑ
// =========================================================
const getChapterGenerators = (locale) => [
  // 1. Φυσικοί Αριθμοί (Αξία θέσης ψηφίου)
  () => {
    const digits = [3, 4, 5, 6, 7, 8, 9];
    const posNames = locale === 'en' ? [
      { name: 'hundred thousands', mult: 100000 },
      { name: 'ten thousands', mult: 10000 },
      { name: 'millions', mult: 1000000 },
      { name: 'hundreds', mult: 100 }
    ] : [
      { name: 'εκατοντάδων χιλιάδων', mult: 100000 },
      { name: 'δεκάδων χιλιάδων', mult: 10000 },
      { name: 'μονάδων εκατομμυρίων', mult: 1000000 },
      { name: 'εκατοντάδων', mult: 100 }
    ];
    const pos = posNames[randInt(0, posNames.length - 1)];
    const d = digits[randInt(0, digits.length - 1)];
    const correctVal = d * pos.mult;
    const correctStr = formatNum(correctVal, locale);
    const options = shuffle([...new Set([
      correctStr,
      formatNum(correctVal / 10, locale),
      formatNum(correctVal * 10, locale),
      String(d)
    ])]);
    return {
      title: locale === 'en' ? '1. Natural Numbers' : '1. Φυσικοί Αριθμοί',
      prompt: locale === 'en'
        ? `What is the actual value of digit ${d} when it is in the place of ${pos.name}?`
        : `Ποια είναι η πραγματική αξία του ψηφίου ${d} όταν βρίσκεται στη θέση των ${pos.name};`,
      type: 'mcq',
      options,
      correct: correctStr,
      explain: locale === 'en'
        ? `In the ${pos.name} place, digit ${d} has value ${d} · ${formatNum(pos.mult, locale)} ＝ ${correctStr}.`
        : `Στη θέση των ${pos.name}, το ψηφίο ${d} έχει αξία ${d} · ${formatNum(pos.mult, locale)} ＝ ${correctStr}.`
    };
  },

  // 2. Δεκαδικοί Αριθμοί (Αξία δεκαδικών ψηφίων)
  () => {
    const num = (randInt(10, 80) + randInt(105, 995) / 1000).toFixed(3);
    const parts = num.split('.');
    const decDigits = parts[1].split('');
    const targetIdx = randInt(0, 2);
    const targetDigit = decDigits[targetIdx];
    const names = locale === 'en' ? ['tenths', 'hundredths', 'thousandths'] : ['δέκατα', 'εκατοστά', 'χιλιοστά'];
    const multipliers = ['0.1', '0.01', '0.001'];
    return {
      title: locale === 'en' ? '2. Decimal Numbers' : '2. Δεκαδικοί Αριθμοί',
      prompt: locale === 'en'
        ? `In the decimal number ${num}, what place value does digit ${targetDigit} occupy?`
        : `Στον δεκαδικό αριθμό ${num.replace('.', ',')}, ποια θέση κατέχει το ψηφίο ${targetDigit};`,
      type: 'mcq',
      options: shuffle([...new Set([names[targetIdx], names[(targetIdx + 1) % 3], names[(targetIdx + 2) % 3], locale === 'en' ? 'ones' : 'μονάδες'])]),
      correct: names[targetIdx],
      explain: locale === 'en'
        ? `Digit ${targetDigit} is the ${targetIdx + 1}th digit after the decimal point, representing ${names[targetIdx]} (position value: ${targetDigit} · ${multipliers[targetIdx]}).`
        : `Το ${targetDigit} είναι το ${targetIdx + 1}ο ψηφίο μετά την υποδιαστολή, άρα εκφράζει ${names[targetIdx]} (αξία θέσης: ${targetDigit} · ${multipliers[targetIdx].replace('.', ',')}).`
    };
  },

  // 3. Δεκαδικοί Αριθμοί σε Δεκαδικά Κλάσματα
  () => {
    const pool = [
      { dec: locale === 'en' ? '0.25' : '0,25', frac: '25/100' },
      { dec: locale === 'en' ? '0.5' : '0,5', frac: '5/10' },
      { dec: locale === 'en' ? '0.75' : '0,75', frac: '75/100' },
      { dec: locale === 'en' ? '1.2' : '1,2', frac: '12/10' },
      { dec: locale === 'en' ? '0.08' : '0,08', frac: '8/100' },
      { dec: locale === 'en' ? '0.125' : '0,125', frac: '125/1000' },
      { dec: locale === 'en' ? '2.5' : '2,5', frac: '25/10' },
      { dec: locale === 'en' ? '0.004' : '0,004', frac: '4/1000' }
    ];
    const item = pool[randInt(0, pool.length - 1)];
    return {
      title: locale === 'en' ? '3. Decimals to Decimal Fractions' : '3. Δεκαδικοί σε Δεκαδικά Κλάσματα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? `Write decimal number ${item.dec} as a decimal fraction (e.g. 25/100):` : `Γράψε τον δεκαδικό αριθμό ${item.dec} ως δεκαδικό κλάσμα (π.χ. 25/100):`}</span>
        </span>
      ),
      type: 'input',
      inputType: 'fraction',
      correct: item.frac,
      explain: (
        <span>
          {locale === 'en' ? `The number ${item.dec} has decimal places, thus written as ` : `Ο αριθμός ${item.dec} γράφεται ως `}
          <Fraction num={item.frac.split('/')[0]} den={item.frac.split('/')[1]} size="sm" />.
        </span>
      )
    };
  },

  // 4. Σύγκριση Δεκαδικών Αριθμών
  () => {
    const base = randInt(5, 40);
    const d1 = Number((base + randInt(1, 9) / 10).toFixed(2));
    const d2 = Number((base + randInt(11, 95) / 100).toFixed(2));
    const sym = d1 > d2 ? '＞' : d1 < d2 ? '＜' : '＝';
    const s1 = locale === 'en' ? String(d1) : d1.toString().replace('.', ',');
    const s2 = locale === 'en' ? String(d2) : d2.toString().replace('.', ',');
    return {
      title: locale === 'en' ? '4. Decimal Comparison' : '4. Σύγκριση Δεκαδικών',
      prompt: locale === 'en'
        ? `Compare the decimal numbers: ${s1} ___ ${s2}`
        : `Σύγκρινε τους δεκαδικούς αριθμούς: ${s1} ___ ${s2}`,
      type: 'mcq',
      options: ['＞', '＜', '＝'],
      correct: sym,
      explain: locale === 'en'
        ? `Comparing tenths and hundredths: ${s1} ${sym} ${s2}.`
        : `Συγκρίνοντας τα δέκατα και τα εκατοστά, ισχύει: ${s1} ${sym} ${s2}.`
    };
  },

  // 5. Πρόσθεση Φυσικών Αριθμών
  () => {
    const a = randInt(1250, 8900);
    const b = randInt(1100, 7800);
    const res = a + b;
    const sa = formatNum(a, locale);
    const sb = formatNum(b, locale);
    const sr = formatNum(res, locale);
    return {
      title: locale === 'en' ? '5. Natural Number Addition' : '5. Πρόσθεση Φυσικών Αριθμών',
      prompt: locale === 'en'
        ? `Calculate the sum: ${sa} ＋ ${sb} ＝`
        : `Υπολόγισε το άθροισμα: ${sa} ＋ ${sb} ＝`,
      type: 'input',
      inputType: 'number',
      correct: String(res),
      explain: `${sa} ＋ ${sb} ＝ ${sr}.`
    };
  },

  // 6. Πολλαπλασιασμός Φυσικών Αριθμών
  () => {
    const a = randInt(24, 85);
    const b = randInt(12, 45);
    const res = a * b;
    const sr = formatNum(res, locale);
    return {
      title: locale === 'en' ? '6. Natural Number Multiplication' : '6. Πολλαπλασιασμός Φυσικών',
      prompt: locale === 'en'
        ? `Calculate the product: ${a} · ${b} ＝`
        : `Υπολόγισε το γινόμενο: ${a} · ${b} ＝`,
      type: 'input',
      inputType: 'number',
      correct: String(res),
      explain: `${a} · ${b} ＝ ${sr}.`
    };
  },

  // 7. Πολλαπλασιασμός με Δυνάμεις του 10
  () => {
    const dec = Number((randInt(12, 85) / 10).toFixed(2));
    const mult = [10, 100, 1000][randInt(0, 2)];
    const res = Number((dec * mult).toFixed(2));
    const sDec = locale === 'en' ? String(dec) : dec.toString().replace('.', ',');
    const sRes = locale === 'en' ? String(res) : res.toString().replace('.', ',');
    return {
      title: locale === 'en' ? '7. Multiplying by Powers of 10' : '7. Πολλαπλασιασμός με Δυνάμεις του 10',
      prompt: locale === 'en'
        ? `Calculate the product: ${sDec} · ${mult} ＝`
        : `Υπολόγισε το γινόμενο: ${sDec} · ${mult} ＝`,
      type: 'input',
      inputType: 'decimal',
      correct: sRes,
      explain: locale === 'en'
        ? `Shift the decimal point ${mult === 10 ? '1 place' : mult === 100 ? '2 places' : '3 places'} right: ${sRes}.`
        : `Μετακινούμε την υποδιαστολή ${mult === 10 ? '1 θέση' : mult === 100 ? '2 θέσεις' : '3 θέσεις'} δεξιά: ${sRes}.`
    };
  },

  // 8. Διαίρεση Φυσικών (Ευκλείδεια διαίρεση / Υπόλοιπο)
  () => {
    const divisor = randInt(4, 9);
    const quotient = randInt(12, 28);
    const remainder = randInt(1, divisor - 1);
    const dividend = divisor * quotient + remainder;
    return {
      title: locale === 'en' ? '8. Division & Remainder' : '8. Διαίρεση Φυσικών (Υπόλοιπο)',
      prompt: locale === 'en'
        ? `In the division ${dividend} : ${divisor}, what is the remainder?`
        : `Στη διαίρεση ${dividend} : ${divisor}, ποιο είναι το υπόλοιπο;`,
      type: 'input',
      inputType: 'number',
      correct: String(remainder),
      explain: locale === 'en'
        ? `${dividend} ＝ (${divisor} · ${quotient}) ＋ ${remainder}, so the remainder is ${remainder}.`
        : `${dividend} ＝ (${divisor} · ${quotient}) ＋ ${remainder}, άρα το υπόλοιπο είναι ${remainder}.`
    };
  },

  // 9. Διαίρεση με Δυνάμεις του 10
  () => {
    const num = randInt(25, 950);
    const div = [10, 100, 1000][randInt(0, 2)];
    const res = Number((num / div).toFixed(3));
    const sRes = locale === 'en' ? String(res) : res.toString().replace('.', ',');
    return {
      title: locale === 'en' ? '9. Dividing by Powers of 10' : '9. Διαίρεση με Δυνάμεις του 10',
      prompt: locale === 'en'
        ? `Calculate the quotient: ${num} : ${div} ＝`
        : `Υπολόγισε το πηλίκο: ${num} : ${div} ＝`,
      type: 'input',
      inputType: 'decimal',
      correct: sRes,
      explain: locale === 'en'
        ? `Shift the decimal point left: ${num} : ${div} ＝ ${sRes}.`
        : `Μετακινούμε την υποδιαστολή αριστερά: ${num} : ${div} ＝ ${sRes}.`
    };
  },

  // 10. Προτεραιότητα Πράξεων
  () => {
    const a = randInt(3, 8);
    const b = randInt(2, 6);
    const c = randInt(2, 5);
    const d = randInt(1, 4);
    const multRes = b * c;
    const res = a + multRes - d;
    return {
      title: locale === 'en' ? '10. Order of Operations' : '10. Προτεραιότητα Πράξεων',
      prompt: locale === 'en'
        ? `Evaluate the numerical expression: ${a} ＋ ${b} · ${c} － ${d} ＝`
        : `Υπολόγισε την τιμή της αριθμητικής παράστασης: ${a} ＋ ${b} · ${c} － ${d} ＝`,
      type: 'input',
      inputType: 'number',
      correct: String(res),
      explain: locale === 'en'
        ? `First execute multiplication (${b} · ${c} ＝ ${multRes}) and then additions/subtractions: ${a} ＋ ${multRes} － ${d} ＝ ${res}.`
        : `Πρώτα εκτελούμε τον πολλαπλασιασμό (${b} · ${c} ＝ ${multRes}) και έπειτα τις προσθαφαιρέσεις: ${a} ＋ ${multRes} － ${d} ＝ ${res}.`
    };
  },

  // 11. Προβλήματα Καθημερινότητας
  () => {
    const items = randInt(4, 8);
    const pricePer = randInt(3, 7);
    const paid = 50;
    const totalCost = items * pricePer;
    const change = paid - totalCost;
    return {
      title: locale === 'en' ? '11. Word Problem' : '11. Επίλυση Προβλήματος',
      prompt: locale === 'en'
        ? `We bought ${items} notebooks at ${pricePer}€ each and paid with a ${paid}€ banknote. How much change will we receive?`
        : `Αγοράσαμε ${items} τετράδια προς ${pricePer}€ το καθένα και πληρώσαμε με χαρτονόμισμα των ${paid}€. Πόσα ρέστα θα λάβουμε;`,
      type: 'input',
      inputType: 'number',
      correct: String(change),
      explain: locale === 'en'
        ? `Cost: ${items} · ${pricePer} ＝ ${totalCost}€. Change: ${paid} － ${totalCost} ＝ ${change}€.`
        : `Κόστος: ${items} · ${pricePer} ＝ ${totalCost}€. Ρέστα: ${paid} － ${totalCost} ＝ ${change}€.`
    };
  },

  // 12. Στρογγυλοποίηση Αριθμών
  () => {
    const num = randInt(1250, 8950);
    const rounded = Math.round(num / 100) * 100;
    const sNum = formatNum(num, locale);
    const sRounded = formatNum(rounded, locale);
    return {
      title: locale === 'en' ? '12. Number Rounding' : '12. Στρογγυλοποίηση Αριθμών',
      prompt: locale === 'en'
        ? `Round number ${sNum} to the nearest hundred:`
        : `Στρογγυλοποίησε τον αριθμό ${sNum} στην πλησιέστερη εκατοντάδα:`,
      type: 'input',
      inputType: 'number',
      correct: String(rounded),
      explain: locale === 'en'
        ? `Rounding to nearest hundred results in ${sRounded}.`
        : `Ο αριθμός στρογγυλοποιείται στο ${sRounded}.`
    };
  },

  // 13. Διαιρέτες Αριθμού
  () => {
    const num = [18, 20, 24, 28, 30, 36][randInt(0, 5)];
    const divs = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) divs.push(i);
    }
    const count = divs.length;
    return {
      title: locale === 'en' ? '13. Number Divisors' : '13. Διαιρέτες Αριθμού',
      prompt: locale === 'en' ? `How many divisors does number ${num} have in total?` : `Πόσους διαιρέτες έχει συνολικά ο αριθμός ${num};`,
      type: 'input',
      inputType: 'number',
      correct: String(count),
      explain: locale === 'en'
        ? `Divisors of ${num}: ${divs.join(', ')} (total: ${count}).`
        : `Οι διαιρέτες του ${num} είναι οι: ${divs.join(', ')} (συνολικά: ${count}).`
    };
  },

  // 14. Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)
  () => {
    const g = [3, 4, 6, 8, 12][randInt(0, 4)];
    const a = g * randInt(2, 4);
    const b = g * randInt(5, 7);
    const trueGcd = gcd(a, b);
    return {
      title: locale === 'en' ? '14. Greatest Common Divisor (GCD)' : '14. Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)',
      prompt: locale === 'en'
        ? `Find the GCD of (${a}, ${b}):`
        : `Βρες τον Μ.Κ.Δ. των αριθμών (${a}, ${b}):`,
      type: 'input',
      inputType: 'number',
      correct: String(trueGcd),
      explain: locale === 'en'
        ? `The greatest common divisor of ${a} and ${b} is ${trueGcd}.`
        : `Ο μεγαλύτερος κοινός διαιρέτης των ${a} και ${b} είναι το ${trueGcd}.`
    };
  },

  // 15. Κριτήρια Διαιρετότητας
  () => {
    const targetDiv = [2, 3, 5, 9, 10][randInt(0, 4)];
    let n;
    if (targetDiv === 3) n = 147;
    else if (targetDiv === 9) n = 378;
    else if (targetDiv === 5) n = 245;
    else if (targetDiv === 10) n = 480;
    else n = 356;

    const wrongs = [n + 1, n + 2, n + 4].filter(w => w % targetDiv !== 0);
    const options = shuffle([...new Set([String(n), ...wrongs.map(String)])]).slice(0, 4);
    return {
      title: locale === 'en' ? '15. Divisibility Rules' : '15. Κριτήρια Διαιρετότητας',
      prompt: locale === 'en' ? `Which of the following numbers is exactly divisible by ${targetDiv}?` : `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το ${targetDiv};`,
      type: 'mcq',
      options,
      correct: String(n),
      explain: locale === 'en'
        ? `Number ${n} is exactly divisible by ${targetDiv} (${n} : ${targetDiv} ＝ ${n / targetDiv}).`
        : `Ο αριθμός ${n} διαιρείται ακριβώς με το ${targetDiv} (${n} : ${targetDiv} ＝ ${n / targetDiv}).`
    };
  },

  // 16. Πρώτοι - Σύνθετοι Αριθμοί
  () => {
    const primes = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const composites = [15, 21, 25, 27, 33, 35, 39, 45, 49];
    const chosenPrime = primes[randInt(0, primes.length - 1)];
    const wrongs = shuffle(composites).slice(0, 3);
    const options = shuffle([...new Set([String(chosenPrime), ...wrongs.map(String)])]);
    return {
      title: locale === 'en' ? '16. Prime & Composite Numbers' : '16. Πρώτοι & Σύνθετοι Αριθμοί',
      prompt: locale === 'en' ? 'Which of the following numbers is a PRIME number?' : 'Ποιος από τους παρακάτω αριθμούς είναι ΠΡΩΤΟΣ αριθμός;',
      type: 'mcq',
      options,
      correct: String(chosenPrime),
      explain: locale === 'en'
        ? `Number ${chosenPrime} is only divisible by 1 and itself, so it is prime.`
        : `Ο αριθμός ${chosenPrime} διαιρείται μόνο με το 1 και τον εαυτό του, άρα είναι πρώτος.`
    };
  },

  // 17. Παραγοντοποίηση Φυσικών Αριθμών
  () => {
    const list = [
      { num: 24, fact: '2³ · 3', factHtml: <span>2<sup>3</sup> · 3</span> },
      { num: 36, fact: '2² · 3²', factHtml: <span>2<sup>2</sup> · 3<sup>2</sup></span> },
      { num: 40, fact: '2³ · 5', factHtml: <span>2<sup>3</sup> · 5</span> },
      { num: 60, fact: '2² · 3 · 5', factHtml: <span>2<sup>2</sup> · 3 · 5</span> },
      { num: 72, fact: '2³ · 3²', factHtml: <span>2<sup>3</sup> · 3<sup>2</sup></span> }
    ];
    const item = list[randInt(0, list.length - 1)];
    const options = shuffle([...new Set([item.fact, '2 · 3 · 5', '2⁴ · 3', '3³ · 2'])]);
    return {
      title: locale === 'en' ? '17. Prime Factorization' : '17. Παραγοντοποίηση Φυσικών',
      prompt: locale === 'en' ? `What is the prime factorization of ${item.num}?` : `Ποια είναι η ανάλυση του αριθμού ${item.num} σε γινόμενο πρώτων παραγόντων;`,
      type: 'mcq',
      options,
      correct: item.fact,
      explain: (
        <span>
          {locale === 'en' ? `Prime factorization of ${item.num}: ` : `Η ανάλυση του ${item.num} σε πρώτους παράγοντες είναι: `}
          {item.factHtml}.
        </span>
      )
    };
  },

  // 18. Πολλαπλάσια Αριθμού
  () => {
    const n = randInt(6, 12);
    const k = randInt(4, 9);
    const mult = n * k;
    const wrongs = [mult + 1, mult + 2, mult + 3].filter(w => w % n !== 0);
    const options = shuffle([...new Set([String(mult), ...wrongs.map(String)])]).slice(0, 4);
    return {
      title: locale === 'en' ? '18. Multiples of a Number' : '18. Πολλαπλάσια Αριθμού',
      prompt: locale === 'en' ? `Which of the following is a multiple of ${n}?` : `Ποιο από τα παρακάτω είναι πολλαπλάσιο του ${n};`,
      type: 'mcq',
      options,
      correct: String(mult),
      explain: locale === 'en'
        ? `${n} · ${k} ＝ ${mult}, so ${mult} is a multiple of ${n}.`
        : `${n} · ${k} ＝ ${mult}, επομένως το ${mult} είναι πολλαπλάσιο του ${n}.`
    };
  },

  // 19. Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)
  () => {
    const a = [3, 4, 6, 8][randInt(0, 3)];
    const b = [5, 6, 9, 10][randInt(0, 3)];
    const trueLcm = lcm(a, b);
    return {
      title: locale === 'en' ? '19. Least Common Multiple (LCM)' : '19. Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)',
      prompt: locale === 'en'
        ? `Find the LCM of (${a}, ${b}):`
        : `Βρες το Ε.Κ.Π. των αριθμών (${a}, ${b}):`,
      type: 'input',
      inputType: 'number',
      correct: String(trueLcm),
      explain: locale === 'en'
        ? `The LCM of ${a} and ${b} is ${trueLcm}.`
        : `Το Ε.Κ.Π.(${a}, ${b}) είναι το ${trueLcm}.`
    };
  },

  // 20. ΕΚΠ - Αλγόριθμος Πρώτοι Αριθμοί
  () => {
    const options = shuffle([...new Set(['36', '18', '72', '6'])]);
    return {
      title: locale === 'en' ? '20. LCM via Prime Factors' : '20. ΕΚΠ με Πρώτους Αριθμούς',
      prompt: (
        <span>
          {locale === 'en' ? 'Using prime factorizations 12 ＝ 2' : 'Χρησιμοποιώντας τις αναλύσεις 12 ＝ 2'}
          <sup>2</sup>
          {' · 3 '}
          {locale === 'en' ? 'and 18 ＝ 2 · 3' : 'και 18 ＝ 2 · 3'}
          <sup>2</sup>
          {locale === 'en' ? ', what is LCM(12, 18)?' : ', ποιο είναι το Ε.Κ.Π.(12, 18);'}
        </span>
      ),
      type: 'mcq',
      options,
      correct: '36',
      explain: (
        <span>
          {locale === 'en'
            ? 'Take common and uncommon prime factors with highest exponents: 2'
            : 'Παίρνουμε τους κοινούς και μη κοινούς παράγοντες με τον μεγαλύτερο εκθέτη: 2'}
          <sup>2</sup>
          {' · 3'}
          <sup>2</sup>
          {' ＝ 4 · 9 ＝ 36.'}
        </span>
      )
    };
  },

  // 21. Δύναμη Φυσικού Αριθμού
  () => {
    const base = randInt(2, 5);
    const exp = base === 2 ? randInt(3, 6) : base === 3 ? randInt(2, 4) : randInt(2, 3);
    const res = Math.pow(base, exp);
    return {
      title: locale === 'en' ? '21. Natural Number Powers' : '21. Δύναμη Φυσικού Αριθμού',
      prompt: (
        <span className="flex items-center gap-1 flex-wrap">
          <span>{locale === 'en' ? 'Evaluate power:' : 'Υπολόγισε την τιμή της δύναμης:'}</span>
          <span>{base}<sup>{exp}</sup> ＝</span>
        </span>
      ),
      type: 'input',
      inputType: 'number',
      correct: String(res),
      explain: (
        <span>
          {base}<sup>{exp}</sup> ＝ {Array(exp).fill(base).join(' · ')} ＝ {res}.
        </span>
      )
    };
  },

  // 22. Δυνάμεις του 10
  () => {
    const exp = randInt(3, 6);
    const val = Math.pow(10, exp);
    const sVal = formatNum(val, locale);
    return {
      title: locale === 'en' ? '22. Powers of 10' : '22. Δυνάμεις του 10',
      prompt: (
        <span className="flex items-center gap-1 flex-wrap">
          <span>{locale === 'en' ? 'How many zeros follow digit 1 in' : 'Πόσα μηδενικά ακολουθούν μετά το 1 στον αριθμό'}</span>
          <span>10<sup>{exp}</sup></span>
          <span>;</span>
        </span>
      ),
      type: 'input',
      inputType: 'number',
      correct: String(exp),
      explain: (
        <span>
          {locale === 'en'
            ? <span>In 10<sup>{exp}</sup> the exponent is {exp}, meaning {exp} zeros follow ({sVal}).</span>
            : <span>Στη δύναμη 10<sup>{exp}</sup> ο εκθέτης είναι {exp}, άρα ακολουθούν {exp} μηδενικά ({sVal}).</span>}
        </span>
      )
    };
  },

  // 23. Η Έννοια του Κλάσματος
  () => {
    const n = randInt(2, 7);
    const d = randInt(n + 1, 10);
    return {
      title: locale === 'en' ? '23. Concept of Fraction' : '23. Η Έννοια του Κλάσματος',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'In the fraction' : 'Στο κλάσμα'}</span>
          <Fraction num={n} den={d} size="sm" />
          <span>{locale === 'en' ? ', which number indicates how many equal parts the unit was divided into (denominator)?' : ', ποιος αριθμός δείχνει σε πόσα ίσα μέρη χωρίσαμε τη μονάδα (παρονομαστής);'}</span>
        </span>
      ),
      type: 'input',
      inputType: 'number',
      correct: String(d),
      explain: locale === 'en'
        ? `The denominator is the bottom term (${d}), indicating total equal divisions.`
        : `Ο παρονομαστής είναι ο κάτω όρος (${d}) και δείχνει σε πόσα ίσα μέρη χωρίστηκε η μονάδα.`
    };
  },

  // 24. Κλάσμα σε Δεκαδικό
  () => {
    const list = [
      { n: 1, d: 2, decEl: '0,5', decEn: '0.5' },
      { n: 1, d: 4, decEl: '0,25', decEn: '0.25' },
      { n: 3, d: 4, decEl: '0,75', decEn: '0.75' },
      { n: 2, d: 5, decEl: '0,4', decEn: '0.4' },
      { n: 4, d: 5, decEl: '0,8', decEn: '0.8' }
    ];
    const item = list[randInt(0, list.length - 1)];
    const targetDec = locale === 'en' ? item.decEn : item.decEl;
    return {
      title: locale === 'en' ? '24. Fraction to Decimal' : '24. Κλάσμα σε Δεκαδικό',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Convert fraction' : 'Μετάτρεψε το κλάσμα'}</span>
          <Fraction num={item.n} den={item.d} size="sm" />
          <span>{locale === 'en' ? 'to decimal (e.g. 0.5):' : 'σε δεκαδικό αριθμό (π.χ. 0,5):'}</span>
        </span>
      ),
      type: 'input',
      inputType: 'decimal',
      correct: targetDec,
      explain: (
        <span>
          <Fraction num={item.n} den={item.d} size="sm" /> ＝ {item.n} : {item.d} ＝ {targetDec}.
        </span>
      )
    };
  },

  // 25. Ισοδύναμα & Ανάγωγα Κλάσματα
  () => {
    const simpN = randInt(1, 3);
    const simpD = randInt(simpN + 1, 5);
    const m = randInt(2, 5);
    const origN = simpN * m;
    const origD = simpD * m;
    return {
      title: locale === 'en' ? '25. Equivalent & Irreducible Fractions' : '25. Ισοδύναμα & Ανάγωγα Κλάσματα',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Simplify fraction' : 'Απλοποίησε το κλάσμα'}</span>
          <Fraction num={origN} den={origD} size="sm" />
          <span>{locale === 'en' ? 'to lowest terms (e.g. 2/3):' : 'στην ανάγωγη μορφή του (π.χ. 2/3):'}</span>
        </span>
      ),
      type: 'input',
      inputType: 'fraction',
      correct: `${simpN}/${simpD}`,
      explain: (
        <span>
          {locale === 'en' ? `Divide both terms by ${m} (GCD): ` : `Διαιρούμε και τους δύο όρους με το ${m} (Μ.Κ.Δ.): `}
          <Fraction num={origN} den={origD} size="sm" /> ＝ <Fraction num={simpN} den={simpD} size="sm" />.
        </span>
      )
    };
  },

  // 26. Σύγκριση Κλασμάτων
  () => {
    const pairs = [
      { n1: 2, d1: 3, n2: 3, d2: 4, sym: '＜' },
      { n1: 3, d1: 5, n2: 2, d2: 5, sym: '＞' },
      { n1: 2, d1: 3, n2: 2, d2: 5, sym: '＞' },
      { n1: 4, d1: 6, n2: 2, d2: 3, sym: '＝' }
    ];
    const item = pairs[randInt(0, pairs.length - 1)];
    return {
      title: locale === 'en' ? '26. Comparing Fractions' : '26. Σύγκριση Κλασμάτων',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Compare fractions:' : 'Σύγκρινε τα κλάσματα:'}</span>
          <Fraction num={item.n1} den={item.d1} size="sm" />
          <span>___</span>
          <Fraction num={item.n2} den={item.d2} size="sm" />
        </span>
      ),
      type: 'mcq',
      options: ['＞', '＜', '＝'],
      correct: item.sym,
      explain: (
        <span>
          {locale === 'en' ? 'By converting to like denominators or cross-multiplying:' : 'Μετατρέποντας σε ομώνυμα (ή με χιαστί γινόμενα):'}{' '}
          <Fraction num={item.n1} den={item.d1} size="sm" /> {item.sym} <Fraction num={item.n2} den={item.d2} size="sm" />.
        </span>
      )
    };
  },

  // 27. Πρόσθεση Κλασμάτων
  () => {
    const d = randInt(5, 9);
    const n1 = randInt(1, 3);
    const n2 = randInt(1, d - n1 - 1);
    const resN = n1 + n2;
    const g = gcd(resN, d);
    return {
      title: locale === 'en' ? '27. Adding Fractions' : '27. Πρόσθεση Κλασμάτων',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Calculate the sum:' : 'Υπολόγισε το άθροισμα:'}</span>
          <Fraction num={n1} den={d} size="sm" />
          <span>＋</span>
          <Fraction num={n2} den={d} size="sm" />
          <span>({locale === 'en' ? 'e.g. 3/7' : 'π.χ. 3/7'}):</span>
        </span>
      ),
      type: 'input',
      inputType: 'fraction',
      correct: `${resN}/${d}`,
      altCorrect: `${resN / g}/${d / g}`,
      explain: (
        <span>
          <Fraction num={n1} den={d} size="sm" /> ＋ <Fraction num={n2} den={d} size="sm" /> ＝ ({n1} ＋ {n2})/{d} ＝ <Fraction num={resN} den={d} size="sm" />
          {g > 1 && (
            <span>
              {' '}{locale === 'en' ? 'or simplified:' : 'ή ανάγωγο:'} <Fraction num={resN / g} den={d / g} size="sm" />
            </span>
          )}.
        </span>
      )
    };
  },

  // 28. Αφαίρεση Κλασμάτων
  () => {
    const d = randInt(6, 10);
    const n1 = randInt(4, d);
    const n2 = randInt(1, n1 - 1);
    const resN = n1 - n2;
    const g = gcd(resN, d);
    return {
      title: locale === 'en' ? '28. Subtracting Fractions' : '28. Αφαίρεση Κλασμάτων',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Calculate the difference:' : 'Υπολόγισε τη διαφορά:'}</span>
          <Fraction num={n1} den={d} size="sm" />
          <span>－</span>
          <Fraction num={n2} den={d} size="sm" />
          <span>({locale === 'en' ? 'e.g. 2/7' : 'π.χ. 2/7'}):</span>
        </span>
      ),
      type: 'input',
      inputType: 'fraction',
      correct: `${resN}/${d}`,
      altCorrect: `${resN / g}/${d / g}`,
      explain: (
        <span>
          <Fraction num={n1} den={d} size="sm" /> － <Fraction num={n2} den={d} size="sm" /> ＝ ({n1} － {n2})/{d} ＝ <Fraction num={resN} den={d} size="sm" />
          {g > 1 && (
            <span>
              {' '}{locale === 'en' ? 'or simplified:' : 'ή ανάγωγο:'} <Fraction num={resN / g} den={d / g} size="sm" />
            </span>
          )}.
        </span>
      )
    };
  },

  // 29. Πολλαπλασιασμός Κλασμάτων
  () => {
    const n1 = randInt(1, 3);
    const d1 = randInt(3, 5);
    const n2 = randInt(1, 3);
    const d2 = randInt(3, 5);
    const pN = n1 * n2;
    const pD = d1 * d2;
    const g = gcd(pN, pD);
    return {
      title: locale === 'en' ? '29. Multiplying Fractions' : '29. Πολλαπλασιασμός Κλασμάτων',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Calculate the product:' : 'Υπολόγισε το γινόμενο:'}</span>
          <Fraction num={n1} den={d1} size="sm" />
          <span>·</span>
          <Fraction num={n2} den={d2} size="sm" />
          <span>({locale === 'en' ? 'e.g. 2/15' : 'π.χ. 2/15'}):</span>
        </span>
      ),
      type: 'input',
      inputType: 'fraction',
      correct: `${pN}/${pD}`,
      altCorrect: `${pN / g}/${pD / g}`,
      explain: (
        <span>
          <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={n2} den={d2} size="sm" /> ＝ ({n1} · {n2}) / ({d1} · {d2}) ＝ <Fraction num={pN} den={pD} size="sm" />
          {g > 1 && (
            <span>
              {' '}{locale === 'en' ? 'or simplified:' : 'ή ανάγωγο:'} <Fraction num={pN / g} den={pD / g} size="sm" />
            </span>
          )}.
        </span>
      )
    };
  },

  // 30. Διαίρεση Κλασμάτων
  () => {
    const n1 = randInt(1, 3);
    const d1 = randInt(2, 4);
    const n2 = randInt(1, 2);
    const d2 = randInt(3, 5);
    const rN = n1 * d2;
    const rD = d1 * n2;
    const g = gcd(rN, rD);
    return {
      title: locale === 'en' ? '30. Dividing Fractions' : '30. Διαίρεση Κλασμάτων',
      prompt: (
        <span className="flex items-center gap-1.5 flex-wrap">
          <span>{locale === 'en' ? 'Calculate the quotient:' : 'Υπολόγισε το πηλίκο:'}</span>
          <Fraction num={n1} den={d1} size="sm" />
          <span>:</span>
          <Fraction num={n2} den={d2} size="sm" />
          <span>({locale === 'en' ? 'e.g. 5/3' : 'π.χ. 5/3'}):</span>
        </span>
      ),
      type: 'input',
      inputType: 'fraction',
      correct: `${rN}/${rD}`,
      altCorrect: `${rN / g}/${rD / g}`,
      explain: (
        <span>
          <Fraction num={n1} den={d1} size="sm" /> : <Fraction num={n2} den={d2} size="sm" /> ＝ <Fraction num={n1} den={d1} size="sm" /> · <Fraction num={d2} den={n2} size="sm" /> ＝ <Fraction num={rN} den={rD} size="sm" />
          {g > 1 && (
            <span>
              {' '}{locale === 'en' ? 'or simplified:' : 'ή ανάγωγο:'} <Fraction num={rN / g} den={rD / g} size="sm" />
            </span>
          )}.
        </span>
      )
    };
  }
];

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function Epanalipsi1Page() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewTest = useCallback(() => {
    const generators = getChapterGenerators(locale);
    const generated = generators.map((gen, index) => {
      const q = gen();
      return { ...q, id: `q${index + 1}`, chapterNum: index + 1 };
    });
    
    const initialAnswers = {};
    generated.forEach(q => {
      initialAnswers[q.id] = '';
    });

    setQuestions(generated);
    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [locale]);

  useEffect(() => {
    loadNewTest();
  }, [loadNewTest]);

  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      const q = questions.find(item => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        sanitized = sanitized.replace(/\./g, ',').replace(/[^0-9,]/g, '');
        const parts = sanitized.split(',');
        if (parts.length > 2) sanitized = parts[0] + ',' + parts.slice(1).join('');
      } else if (q?.inputType === 'fraction') {
        sanitized = sanitized.replace(/[^0-9/]/g, '');
        const parts = sanitized.split('/');
        if (parts.length > 2) sanitized = parts[0] + '/' + parts.slice(1).join('');
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
    const ans = answers[q.id];
    if (typeof ans !== 'string' || !ans.trim()) return false;

    const cleanAns = ans.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
    const cleanCorrect = q.correct.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
    const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase() : null;

    if (cleanAns === cleanCorrect || (cleanAlt && cleanAns === cleanAlt)) {
      return true;
    }

    if (q.inputType === 'decimal') {
      const nAns = parseFloat(cleanAns.replace(',', '.'));
      const nCor = parseFloat(cleanCorrect.replace(',', '.'));
      if (!isNaN(nAns) && !isNaN(nCor) && Math.abs(nAns - nCor) < 0.05) {
        return true;
      }
    }

    // Αριθμητική ισοδυναμία κλάσματος (π.χ. 4/1 = 4)
    if (q.inputType === 'fraction') {
      const parseFractionOrNumber = (str) => {
        if (!str) return NaN;
        if (str.includes('/')) {
          const [n, d] = str.split('/').map(Number);
          return d !== 0 ? n / d : NaN;
        }
        return Number(str.replace(',', '.'));
      };

      const userNum = parseFractionOrNumber(cleanAns);
      const targetNum = parseFractionOrNumber(cleanCorrect);
      if (!isNaN(userNum) && !isNaN(targetNum) && Math.abs(userNum - targetNum) < 1e-6) {
        return true;
      }
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

  const answeredCount = Object.values(answers).filter(val => typeof val === 'string' && val.trim() !== '').length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <span className="hidden sm:inline-block bg-indigo-50 border border-indigo-200 text-indigo-700 px-3.5 py-1.5 rounded-xl text-xs font-black">
          📝 30 {toCleanUppercase(t.questionsCount)}
        </span>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-10 box-border">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>{t.badgeText}</span>
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
              onClick={loadNewTest}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-lg transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation cursor-pointer"
            >
              <span>🔄</span>
              <span>{toCleanUppercase(t.newTestBtn)}</span>
            </button>
          </div>
        </section>

        {/* 2. MAIN FORM WITH 30 QUESTIONS */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q) => {
              const isCorrect = submitted && isQuestionCorrect(q);

              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 overflow-hidden ${
                    !submitted
                      ? 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                      : isCorrect
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-1 ring-emerald-400'
                      : 'bg-rose-50/70 border-rose-400 shadow-md ring-1 ring-rose-400'
                  }`}
                >
                  <div>
                    {/* Κεφαλίδα Κάρτας */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-black px-2.5 py-1 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-100 uppercase tracking-wider break-words">
                        {toCleanUppercase(q.title)}
                      </span>
                      {submitted && (
                        <span className="text-base">{isCorrect ? '✅' : '❌'}</span>
                      )}
                    </div>

                    {/* Ερώτηση */}
                    <div className="text-sm font-semibold text-slate-800 leading-relaxed mb-4 break-words [overflow-wrap:anywhere]">
                      {q.prompt}
                    </div>
                  </div>

                  {/* Επιλογές ή Πεδίο Εισαγωγής */}
                  <div className="space-y-3">
                    {q.type === 'mcq' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt, 'mcq')}
                            className={`p-2.5 rounded-xl text-xs sm:text-sm font-bold border transition text-center touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex items-center justify-center min-h-[44px] cursor-pointer ${
                              answers[q.id] === opt
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        key={`test-input-${q.id}`}
                        autoComplete="off"
                        spellCheck="false"
                        type="text"
                        inputMode={q.inputType === 'fraction' ? 'text' : q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                        disabled={submitted}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                        placeholder={
                          q.inputType === 'fraction'
                            ? t.placeholderFraction
                            : q.inputType === 'decimal'
                            ? t.placeholderDecimal
                            : t.placeholderAnswer
                        }
                        className="w-full p-2.5 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-base focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono shadow-inner"
                      />
                    )}

                    {/* Επεξήγηση μετά την υποβολή */}
                    {submitted && (
                      <div className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere] ${isCorrect ? 'bg-emerald-100/70 text-emerald-950 border border-emerald-200' : 'bg-rose-100/70 text-rose-950 border border-rose-200'}`}>
                        💡 {q.explain}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4 sm:pt-6">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-base md:text-lg font-black px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 touch-manipulation cursor-pointer"
              >
                <span className="text-2xl">🎯</span>
                <span>{toCleanUppercase(t.completeBtn)}</span>
              </button>
            </div>
          )}
        </form>

      </div>

      {/* 3. FIXED STICKY BOTTOM PROGRESS FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 sm:py-4 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* ΑΡΙΣΤΕΡΑ: SCORE & PROGRESS BADGE */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase(t.scoreBadge) : toCleanUppercase(t.answeredBadge)}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 30` : `${answeredCount} / 30`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.successRate)}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 30) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* ΔΕΞΙΑ: STATUS OR RETRY BUTTON */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewTest}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation cursor-pointer"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.retryBtn)}</span>
              </button>
            ) : (
              <p className="text-xs md:text-sm text-slate-400 hidden sm:block">
                {t.bottomHint}
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function formatNumber(num, locale = 'el') {
  if (num === '' || isNaN(num)) return '0';
  return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
}

function sumDigits(numStr) {
  return String(numStr).split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
}

const renderFraction = (num, den) =>
  `<span class="inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">` +
  `<span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${num}</span>` +
  `<span class="pt-0.5 break-all">${den}</span>` +
  `</span>`;

function makeUniqueFourOptions(correctStr, candidateWrongArr, fallbackGenerator) {
  const uniqueSet = new Set([String(correctStr)]);
  for (const cand of candidateWrongArr) {
    if (cand !== undefined && cand !== null && String(cand).trim() !== '') {
      uniqueSet.add(String(cand));
    }
    if (uniqueSet.size === 4) break;
  }
  let step = 1;
  while (uniqueSet.size < 4 && fallbackGenerator) {
    const generated = fallbackGenerator(step);
    if (generated !== undefined && generated !== null) {
      uniqueSet.add(String(generated));
    }
    step += 1;
  }
  return shuffle(Array.from(uniqueSet)).map((text) => ({
    text,
    isCorrect: text === String(correctStr)
  }));
}

const REAL_WORLD_PROBLEMS_Q8 = {
  el: [
    {
      prompt: (num) => `Έχουμε ${num} τετράδια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
      total: 377,
      correctOption: 'Δεν είναι δυνατόν χωρίς υπόλοιπο',
      wrongOptions: ['Σε ομάδες των 2', 'Σε ομάδες των 5', 'Σε ομάδες των 10'],
      explain: 'Ο αριθμός 377 δεν διαιρείται με κανέναν από τους αριθμούς 2, 5 και 10 (αφήνει πάντα υπόλοιπο).'
    },
    {
      prompt: (num) => `Έχουμε ${num} τετράδια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
      total: 284,
      correctOption: 'Σε ομάδες των 4',
      wrongOptions: ['Σε ομάδες των 5', 'Σε ομάδες των 9', 'Σε ομάδες των 10'],
      explain: `Ο αριθμός 284 λήγει σε 84, το οποίο διαιρείται ακριβώς με το 4 (${renderFraction(84, 4)} ＝ 21).`
    },
    {
      prompt: (num) => `Έχουμε ${num} ευρώ. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
      total: 303,
      correctOption: 'Σε μερίδια των 3',
      wrongOptions: ['Σε μερίδια των 2', 'Σε μερίδια των 5', 'Σε μερίδια των 10'],
      explain: 'Το άθροισμα των ψηφίων του 303 είναι 3 ＋ 0 ＋ 3 ＝ 6, άρα διαιρείται ακριβώς με το 3.'
    },
    {
      prompt: (num) => `Έχουμε ${num} μαθητές. Με ποιον τρόπο μπορούμε να τους χωρίσουμε σε ισοπληθείς ομάδες χωρίς να περισσέψει κανένας;`,
      total: 390,
      correctOption: 'Σε ομάδες των 10',
      wrongOptions: ['Σε ομάδες των 4', 'Σε ομάδες των 9', 'Σε ομάδες των 25'],
      explain: 'Ο αριθμός 390 λήγει σε 0, άρα διαιρείται ακριβώς με το 10.'
    },
    {
      prompt: (num) => `Έχουμε ${num} καραμέλες. Με ποιον τρόπο μπορούμε να τις μοιράσουμε ισόποσα χωρίς να περισσέψει καμία;`,
      total: 395,
      correctOption: 'Σε σακουλάκια των 5',
      wrongOptions: ['Σε σακουλάκια των 2', 'Σε σακουλάκια των 4', 'Σε σακουλάκια των 9'],
      explain: 'Ο αριθμός 395 λήγει σε 5, άρα διαιρείται ακριβώς με το 5.'
    },
    {
      prompt: (num) => `Έχουμε ${num} βιβλία. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
      total: 450,
      correctOption: 'Σε πακέτα των 25',
      wrongOptions: ['Σε πακέτα των 4', 'Σε πακέτα των 8', 'Σε πακέτα των 7'],
      explain: 'Ο αριθμός 450 τελειώνει σε 50, άρα διαιρείται ακριβώς με το 25.'
    },
    {
      prompt: (num) => `Έχουμε ${num} μήλα. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
      total: 729,
      correctOption: 'Σε καλάθια των 9',
      wrongOptions: ['Σε καλάθια των 2', 'Σε καλάθια των 5', 'Σε καλάθια των 10'],
      explain: 'Το άθροισμα των ψηφίων του 729 είναι 7 ＋ 2 ＋ 9 ＝ 18, το οποίο διαιρείται με το 9.'
    },
    {
      prompt: (num) => `Έχουμε ${num} λουλούδια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
      total: 524,
      correctOption: 'Σε ανθοδέσμες των 4',
      wrongOptions: ['Σε ανθοδέσμες των 5', 'Σε ανθοδέσμες των 9', 'Σε ανθοδέσμες των 10'],
      explain: 'Τα δύο τελευταία ψηφία του 524 σχηματίζουν το 24, που διαιρείται με το 4.'
    },
    {
      prompt: (num) => `Έχουμε ${num} σοκολατάκια. Με ποιον τρόπο μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
      total: 810,
      correctOption: 'Σε κουτάκια των 10',
      wrongOptions: ['Σε κουτάκια των 4', 'Σε κουτάκια των 25', 'Σε κουτάκια των 7'],
      explain: 'Ο αριθμός 810 λήγει σε 0, άρα διαιρείται ακριβώς με το 10.'
    },
    {
      prompt: (num) => `Έχουμε ${num} μπάρες δημητριακών. Με ποιον τρόπο μπορούμε να τις μοιράσουμε ισόποσα χωρίς να περισσέψει καμία;`,
      total: 625,
      correctOption: 'Σε πακέτα των 25',
      wrongOptions: ['Σε πακέτα των 2', 'Σε πακέτα των 3', 'Σε πακέτα των 9'],
      explain: 'Ο αριθμός 625 τελειώνει σε 25, άρα διαιρείται ακριβώς με το 25.'
    }
  ],
  en: [
    {
      prompt: (num) => `We have ${num} notebooks. In which way can we share them equally with none left over?`,
      total: 377,
      correctOption: 'Not possible without remainder',
      wrongOptions: ['In groups of 2', 'In groups of 5', 'In groups of 10'],
      explain: 'The number 377 is not divisible by 2, 5, or 10 (it always leaves a remainder).'
    },
    {
      prompt: (num) => `We have ${num} notebooks. In which way can we share them equally with none left over?`,
      total: 284,
      correctOption: 'In groups of 4',
      wrongOptions: ['In groups of 5', 'In groups of 9', 'In groups of 10'],
      explain: `The last two digits of 284 are 84, which divides by 4 (${renderFraction(84, 4)} ＝ 21).`
    },
    {
      prompt: (num) => `We have ${num} euros. In which way can we share them equally with none left over?`,
      total: 303,
      correctOption: 'In shares of 3',
      wrongOptions: ['In shares of 2', 'In shares of 5', 'In shares of 10'],
      explain: 'The sum of the digits of 303 is 3 ＋ 0 ＋ 3 ＝ 6, which divides by 3.'
    },
    {
      prompt: (num) => `We have ${num} students. In which way can we divide them into equal groups with none left over?`,
      total: 390,
      correctOption: 'In groups of 10',
      wrongOptions: ['In groups of 4', 'In groups of 9', 'In groups of 25'],
      explain: 'The number 390 ends in 0, so it divides exactly by 10.'
    },
    {
      prompt: (num) => `We have ${num} candies. In which way can we share them equally with none left over?`,
      total: 395,
      correctOption: 'In bags of 5',
      wrongOptions: ['In bags of 2', 'In bags of 4', 'In bags of 9'],
      explain: 'The number 395 ends in 5, so it divides exactly by 5.'
    },
    {
      prompt: (num) => `We have ${num} books. In which way can we share them equally with none left over?`,
      total: 450,
      correctOption: 'In bundles of 25',
      wrongOptions: ['In bundles of 4', 'In bundles of 8', 'In bundles of 7'],
      explain: 'The number 450 ends in 50, so it divides exactly by 25.'
    },
    {
      prompt: (num) => `We have ${num} apples. In which way can we share them equally with none left over?`,
      total: 729,
      correctOption: 'In baskets of 9',
      wrongOptions: ['In baskets of 2', 'In baskets of 5', 'In baskets of 10'],
      explain: 'The sum of digits of 729 is 7 ＋ 2 ＋ 9 ＝ 18, which is divisible by 9.'
    },
    {
      prompt: (num) => `We have ${num} flowers. In which way can we share them equally with none left over?`,
      total: 524,
      correctOption: 'In bouquets of 4',
      wrongOptions: ['In bouquets of 5', 'In bouquets of 9', 'In bouquets of 10'],
      explain: 'The last two digits of 524 form 24, which is divisible by 4.'
    },
    {
      prompt: (num) => `We have ${num} chocolates. In which way can we share them equally with none left over?`,
      total: 810,
      correctOption: 'In boxes of 10',
      wrongOptions: ['In boxes of 4', 'In boxes of 25', 'In boxes of 7'],
      explain: 'The number 810 ends in 0, so it divides exactly by 10.'
    },
    {
      prompt: (num) => `We have ${num} cereal bars. In which way can we share them equally with none left over?`,
      total: 625,
      correctOption: 'In packs of 25',
      wrongOptions: ['In packs of 2', 'In packs of 3', 'In packs of 9'],
      explain: 'The number 625 ends in 25, so it divides exactly by 25.'
    }
  ]
};

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_crit_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const candidates = [326, 448, 514, 622];
      const validNum = 448;
      return {
        title: isEn ? 'PACKING INTO GROUPS OF 4' : 'ΠΡΑΚΤΙΚΟΣ ΕΛΕΓΧΟΣ ΣΥΣΚΕΥΑΣΙΑΣ ΣΕ 4ΑΔΕΣ',
        instruction: isEn ? 'Select the correct quantity:' : 'Επιλέξτε τη σωστή ποσότητα:',
        text: isEn
          ? 'A warehouse clerk wants to pack items into groups of 4 without any left over. Which of the following quantities can be packed exactly: 326, 448, 514, or 622?'
          : 'Ένας αποθηκάριος θέλει να συσκευάσει αντικείμενα σε 4άδες χωρίς να περισσέψει κανένα. Ποια από τις παρακάτω ποσότητες μπορεί να συσκευαστεί ακριβώς: 326, 448, 514 ή 622;',
        tableData: {
          col1: isEn ? 'Candidate Numbers' : 'Υποψήφιοι Αριθμοί',
          col2: isEn ? 'Rule of 4' : 'Κριτήριο του 4',
          r1: ['326, 448, 514, 622', isEn ? 'Last two digits' : 'Δύο τελευταία ψηφία'],
          r2: [isEn ? 'Verification' : 'Έλεγχος', `${renderFraction(48, 4)} ＝ 12 ✅`]
        },
        optionsRaw: candidates.map(String),
        correctText: String(validNum),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The last two digits of 448 form 48, which divides exactly by 4: <span>${renderFraction(48, 4)} ＝ <strong>12</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Τα δύο τελευταία ψηφία του 448 σχηματίζουν το 48, το οποίο διαιρείται ακριβώς με το 4: <span>${renderFraction(48, 4)} ＝ <strong>12</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_crit_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const validNum = 575;
      const candidates = [530, 560, 575, 590];
      return {
        title: isEn ? 'PAYING WITH 25 € VOUCHERS' : 'ΠΛΗΡΩΜΗ ΜΕ ΧΑΡΤΟΝΟΜΙΣΜΑΤΑ ΤΩΝ 25 €',
        instruction: isEn ? 'Select the amount that can be paid exactly with 25 € vouchers:' : 'Επιλέξτε το ποσό που πληρώνεται ακριβώς με χαρτονομίσματα των 25 €:',
        text: isEn
          ? 'A school bought sports balls. Which of the following total amounts can be paid using exclusively 25 € vouchers with no change needed: 530 €, 560 €, 575 €, or 590 €?'
          : 'Ένα σχολείο αγόρασε μπάλες. Ποιο από τα παρακάτω ποσά μπορεί να πληρωθεί αποκλειστικά με χαρτονομίσματα των 25 € χωρίς να χρειαστούν ρέστα: 530 €, 560 €, 575 € ή 590 €;',
        tableData: {
          col1: isEn ? 'Total Amount' : 'Συνολικό Ποσό',
          col2: isEn ? '25 € Rule' : 'Χαρτονόμισμα 25 €',
          r1: [`${validNum} €`, isEn ? 'Rule of 25' : 'Κριτήριο του 25'],
          r2: [isEn ? 'Last digits: 75' : 'Τελευταία ψηφία: 75', `${renderFraction(575, 25)} ＝ 23 ✅`]
        },
        optionsRaw: candidates.map((c) => `${c} €`),
        correctText: `${validNum} €`,
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The number 575 ends in 75, so it divides exactly by 25: <span>${renderFraction(575, 25)} ＝ <strong>23</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Ο αριθμός 575 τελειώνει σε 75, άρα διαιρείται ακριβώς με το 25: <span>${renderFraction(575, 25)} ＝ <strong>23</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_crit_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const candidates = [142, 235, 318, 421];
      const validNum = 235;
      return {
        title: isEn ? 'SHARING CANDIES IN BAGS OF 5' : 'ΜΟΙΡΑΣΜΑ ΚΑΡΑΜΕΛΩΝ ΣΕ 5ΑΔΕΣ',
        instruction: isEn ? 'Select the number divisible by 5:' : 'Επιλέξτε τον αριθμό που διαιρείται με το 5:',
        text: isEn
          ? 'A teacher wants to pack candies into bags of 5 with none left over. Which of the following candy counts is suitable: 142, 235, 318, or 421?'
          : 'Μια δασκάλα θέλει να μοιράσει καραμέλες σε σακουλάκια των 5 χωρίς να περισσέψει καμία. Ποιο από τα παρακάτω πλήθη καραμελών είναι κατάλληλο: 142, 235, 318 ή 421;',
        tableData: {
          col1: isEn ? 'Candidates' : 'Υποψήφιοι Αριθμοί',
          col2: isEn ? 'Rule of 5' : 'Κριτήριο του 5',
          r1: ['142, 235, 318, 421', isEn ? 'Ends in 0 or 5' : 'Λήγει σε 0 ή 5'],
          r2: [isEn ? 'Result' : 'Αποτέλεσμα', `${renderFraction(235, 5)} ＝ 47 ✅`]
        },
        optionsRaw: candidates.map(String),
        correctText: String(validNum),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The number 235 ends in 5, hence it divides exactly by 5: <span>${renderFraction(235, 5)} ＝ <strong>47</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Ο αριθμός 235 λήγει σε 5, επομένως διαιρείται ακριβώς με το 5: <span>${renderFraction(235, 5)} ＝ <strong>47</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_crit_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const candidates = [521, 633, 715, 802];
      const validNum = 633;
      return {
        title: isEn ? 'GROUPING STUDENTS INTO TRIOS' : 'ΚΑΤΑΝΟΜΗ ΜΑΘΗΤΩΝ ΣΕ 3ΑΔΕΣ',
        instruction: isEn ? 'Select the count divisible by 3:' : 'Επιλέξτε το πλήθος που διαιρείται με το 3:',
        text: isEn
          ? 'In a contest, students must form groups of 3. Which of the following numbers of students allows forming complete groups of 3: 521, 633, 715, or 802?'
          : 'Σε έναν διαγωνισμό οι μαθητές πρέπει να σχηματίσουν τριάδες. Ποιος από τους παρακάτω αριθμούς μαθητών επιτρέπει τον πλήρη σχηματισμό τριάδων: 521, 633, 715 ή 802;',
        tableData: {
          col1: isEn ? 'Candidates' : 'Υποψήφιοι',
          col2: isEn ? 'Rule of 3' : 'Κριτήριο του 3',
          r1: ['521, 633, 715, 802', isEn ? 'Digit sum' : 'Άθροισμα ψηφίων'],
          r2: [isEn ? 'Check 633' : 'Έλεγχος 633', `6 ＋ 3 ＋ 3 ＝ 12 (${renderFraction(12, 3)} ＝ 4) ✅`]
        },
        optionsRaw: candidates.map(String),
        correctText: String(validNum),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The sum of digits of 633 is 6 ＋ 3 ＋ 3 ＝ 12, which divides exactly by 3: <span>${renderFraction(12, 3)} ＝ <strong>4</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το άθροισμα των ψηφίων του 633 είναι 6 ＋ 3 ＋ 3 ＝ 12, το οποίο διαιρείται ακριβώς με το 3: <span>${renderFraction(12, 3)} ＝ <strong>4</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_crit_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const validNum = 1240;
      return {
        title: isEn ? 'PACKAGING IN TENS' : 'ΣΥΣΚΕΥΑΣΙΑ ΣΕ 10ΑΔΕΣ',
        instruction: isEn ? 'Select the number divisible by 10:' : 'Επιλέξτε τον αριθμό που διαιρείται με το 10:',
        text: isEn
          ? `A factory packs pencils into boxes of 10. Which of the following counts packs without any pencils remaining: ${formatNumber(1240, locale)}, ${formatNumber(1345, locale)}, ${formatNumber(1452, locale)}, or ${formatNumber(1506, locale)}?`
          : `Ένα εργοστάσιο συσκευάζει μολύβια σε δεκάδες. Ποιο από τα παρακάτω πλήθη μολυβιών συσκευάζεται χωρίς να περισσέψει κανένα μολύβι: ${formatNumber(1240, locale)}, ${formatNumber(1345, locale)}, ${formatNumber(1452, locale)} ή ${formatNumber(1506, locale)};`,
        tableData: {
          col1: isEn ? 'Quantities' : 'Ποσότητες',
          col2: isEn ? 'Rule of 10' : 'Κριτήριο του 10',
          r1: [
            isEn ? '1,240, 1,345, 1,452, 1,506' : '1.240, 1.345, 1.452, 1.506',
            isEn ? 'Ends in 0' : 'Λήγει σε 0'
          ],
          r2: [isEn ? 'Result' : 'Αποτέλεσμα', `${renderFraction(formatNumber(1240, locale), 10)} ＝ 124 ✅`]
        },
        optionsRaw: [
          formatNumber(1240, locale),
          formatNumber(1345, locale),
          formatNumber(1452, locale),
          formatNumber(1506, locale)
        ],
        correctText: formatNumber(validNum, locale),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The number ${formatNumber(1240, locale)} ends in 0, so it divides exactly by 10: <span>${renderFraction(formatNumber(1240, locale), 10)} ＝ <strong>124</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Ο αριθμός ${formatNumber(1240, locale)} λήγει σε 0, άρα διαιρείται ακριβώς με το 10: <span>${renderFraction(formatNumber(1240, locale), 10)} ＝ <strong>124</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_crit_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const candidates = [316, 425, 513, 620];
      const validNum = 513;
      return {
        title: isEn ? 'TEAMS OF 9 AUDIENCE MEMBERS' : 'ΟΜΑΔΕΣ ΤΩΝ 9 ΑΤΟΜΩΝ',
        instruction: isEn ? 'Select the number divisible by 9:' : 'Επιλέξτε τον αριθμό που διαιρείται με το 9:',
        text: isEn
          ? 'At a festival, attendees are divided into groups of 9. Which of the following numbers of attendees can be grouped with none left over: 316, 425, 513, or 620?'
          : 'Σε ένα φεστιβάλ οι θεατές χωρίζονται σε ομάδες των 9. Ποιο από τα παρακάτω πλήθη θεατών μπορεί να χωριστεί χωρίς να περισσέψει κανείς: 316, 425, 513 ή 620;',
        tableData: {
          col1: isEn ? 'Candidates' : 'Υποψήφιοι',
          col2: isEn ? 'Rule of 9' : 'Κριτήριο του 9',
          r1: ['316, 425, 513, 620', isEn ? 'Digit sum' : 'Άθροισμα ψηφίων'],
          r2: [isEn ? 'Check 513' : 'Έλεγχος 513', `5 ＋ 1 ＋ 3 ＝ 9 (${renderFraction(9, 9)} ＝ 1) ✅`]
        },
        optionsRaw: candidates.map(String),
        correctText: String(validNum),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The sum of digits of 513 is 5 ＋ 1 ＋ 3 ＝ 9, which divides exactly by 9: <span>${renderFraction(9, 9)} ＝ <strong>1</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το άθροισμα των ψηφίων του 513 είναι 5 ＋ 1 ＋ 3 ＝ 9, άρα διαιρείται ακριβώς με το 9: <span>${renderFraction(9, 9)} ＝ <strong>1</strong></span>.</div>`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_crit_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      return {
        title: isEn ? 'SIMULTANEOUS DIVISIBILITY BY 2, 5, AND 9' : 'ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ 2, 5 ΚΑΙ 9',
        instruction: isEn ? 'Select the correct number:' : 'Επιλέξτε τον σωστό αριθμό:',
        text: isEn
          ? `Which of the following numbers is simultaneously divisible by 2, 5, and 9: ${formatNumber(1350, locale)}, ${formatNumber(2435, locale)}, ${formatNumber(3142, locale)}, or ${formatNumber(4205, locale)}?`
          : `Ποιος από τους παρακάτω αριθμούς διαιρείται ταυτόχρονα με το 2, το 5 και το 9: ${formatNumber(1350, locale)}, ${formatNumber(2435, locale)}, ${formatNumber(3142, locale)} ή ${formatNumber(4205, locale)};`,
        tableData: {
          col1: isEn ? `Number ${formatNumber(1350, locale)}` : `Αριθμός ${formatNumber(1350, locale)}`,
          col2: isEn ? 'Criteria Check' : 'Έλεγχος Κριτηρίων',
          r1: [isEn ? 'Ends in 0' : 'Λήγει σε 0', isEn ? 'Divisible by 2 & 5 ✅' : 'Διαιρείται με 2 & 5 ✅'],
          r2: [isEn ? 'Sum: 1 ＋ 3 ＋ 5 ＋ 0 ＝ 9' : 'Άθροισμα: 1 ＋ 3 ＋ 5 ＋ 0 ＝ 9', isEn ? 'Divisible by 9 ✅' : 'Διαιρείται με 9 ✅']
        },
        optionsRaw: [
          formatNumber(1350, locale),
          formatNumber(2435, locale),
          formatNumber(3142, locale),
          formatNumber(4205, locale)
        ],
        correctText: formatNumber(1350, locale),
        explanation: isEn
          ? `${formatNumber(1350, locale)} ends in 0 (divisible by 2 and 5) and its sum of digits is 1 ＋ 3 ＋ 5 ＋ 0 ＝ 9 (divisible by 9).`
          : `Ο αριθμός ${formatNumber(1350, locale)} λήγει σε 0 (άρα διαιρείται με το 2 και το 5) και έχει άθροισμα ψηφίων 1 ＋ 3 ＋ 5 ＋ 0 ＝ 9 (άρα διαιρείται με το 9).`
      };
    }
  },
  {
    id: 'p_crit_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      return {
        title: isEn ? 'SIMULTANEOUS DIVISIBILITY BY 4 AND 25' : 'ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ 4 ΚΑΙ 25',
        instruction: isEn ? 'Select the number divisible by both 4 and 25:' : 'Επιλέξτε τον αριθμό που διαιρείται ταυτόχρονα με το 4 και το 25:',
        text: isEn
          ? `Which of the following numbers is simultaneously divisible by 4 and 25: ${formatNumber(1550, locale)}, ${formatNumber(2100, locale)}, ${formatNumber(3225, locale)}, or ${formatNumber(4150, locale)}?`
          : `Ποιος από τους παρακάτω αριθμούς διαιρείται ταυτόχρονα με το 4 και το 25: ${formatNumber(1550, locale)}, ${formatNumber(2100, locale)}, ${formatNumber(3225, locale)} ή ${formatNumber(4150, locale)};`,
        tableData: {
          col1: isEn ? `Number ${formatNumber(2100, locale)}` : `Αριθμός ${formatNumber(2100, locale)}`,
          col2: isEn ? 'Criteria Check' : 'Έλεγχος Κριτηρίων',
          r1: [isEn ? 'Ends in 00' : 'Τελειώνει σε 00', isEn ? 'Divisible by 4 ✅' : 'Διαιρείται με 4 ✅'],
          r2: [isEn ? 'Ends in 00' : 'Τελειώνει σε 00', isEn ? 'Divisible by 25 ✅' : 'Διαιρείται με 25 ✅']
        },
        optionsRaw: [
          formatNumber(1550, locale),
          formatNumber(2100, locale),
          formatNumber(3225, locale),
          formatNumber(4150, locale)
        ],
        correctText: formatNumber(2100, locale),
        explanation: isEn
          ? `${formatNumber(2100, locale)} ends in 00, so it divides by both 4 and 25.`
          : `Ο αριθμός ${formatNumber(2100, locale)} λήγει σε 00, άρα διαιρείται και με το 4 και με το 25.`
      };
    }
  },
  {
    id: 'p_crit_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      return {
        title: isEn ? 'COMMON DIVISOR OF MULTIPLE RULES' : 'ΚΟΙΝΟΣ ΔΙΑΙΡΕΤΗΣ ΠΟΛΛΑΠΛΩΝ ΚΡΙΤΗΡΙΩΝ',
        instruction: isEn ? 'Select the number divisible by 2, 3, 5, 9, and 10:' : 'Επιλέξτε τον αριθμό που διαιρείται με 2, 3, 5, 9 και 10:',
        text: isEn
          ? 'Which of the following numbers is simultaneously divisible by 2, 3, 5, 9, and 10: 520, 635, 720, or 815?'
          : 'Ποιος από τους παρακάτω αριθμούς διαιρείται ταυτόχρονα με το 2, το 3, το 5, το 9 και το 10: 520, 635, 720 ή 815;',
        tableData: {
          col1: isEn ? 'Number 720' : 'Αριθμός 720',
          col2: isEn ? 'Criteria Check' : 'Έλεγχος Κριτηρίων',
          r1: [isEn ? 'Ends in 0' : 'Λήγει σε 0', isEn ? 'Divisible by 2, 5, 10 ✅' : 'Διαιρείται με 2, 5, 10 ✅'],
          r2: [isEn ? 'Sum: 7 ＋ 2 ＋ 0 ＝ 9' : 'Άθροισμα: 7 ＋ 2 ＋ 0 ＝ 9', isEn ? 'Divisible by 3 & 9 ✅' : 'Διαιρείται με 3 & 9 ✅']
        },
        optionsRaw: ['520', '635', '720', '815'],
        correctText: '720',
        explanation: isEn
          ? '720 is even (divisible by 2), ends in 0 (divisible by 5 and 10), and its digit sum is 7 ＋ 2 ＋ 0 ＝ 9 (divisible by 3 and 9).'
          : 'Ο αριθμός 720 είναι άρτιος (διαιρείται με 2), λήγει σε 0 (διαιρείται με 5 και 10) και έχει άθροισμα ψηφίων 7 ＋ 2 ＋ 0 ＝ 9 (διαιρείται με 3 και 9).'
      };
    }
  },
  {
    id: 'p_crit_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      return {
        title: isEn ? 'SIMULTANEOUS DIVISIBILITY BY 3, 4, AND 9' : 'ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ 3, 4 ΚΑΙ 9',
        instruction: isEn ? 'Select the correct number:' : 'Επιλέξτε τον σωστό αριθμό:',
        text: isEn
          ? 'Which of the following numbers is simultaneously divisible by 3, 4, and 9: 614, 726, 828, or 916?'
          : 'Ποιος από τους παρακάτω αριθμούς διαιρείται ταυτόχρονα με το 3, το 4 και το 9: 614, 726, 828 ή 916;',
        tableData: {
          col1: isEn ? 'Number 828' : 'Αριθμός 828',
          col2: isEn ? 'Criteria Check' : 'Έλεγχος Κριτηρίων',
          r1: [isEn ? 'Ends in 28' : 'Τελειώνει σε 28', `${renderFraction(28, 4)} ＝ 7 ✅`],
          r2: [isEn ? 'Sum: 8 ＋ 2 ＋ 8 ＝ 18' : 'Άθροισμα: 8 ＋ 2 ＋ 8 ＝ 18', isEn ? 'Divisible by 3 & 9 ✅' : 'Διαιρείται με 3 & 9 ✅']
        },
        optionsRaw: ['614', '726', '828', '916'],
        correctText: '828',
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">828 is even, ends in 28 (<span>${renderFraction(28, 4)} ＝ <strong>7</strong></span>, so divisible by 4), and its digit sum is 8 ＋ 2 ＋ 8 ＝ 18 (divisible by 3 and 9).</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Ο αριθμός 828 είναι άρτιος (διαιρείται με 2), λήγει σε 28 (<span>${renderFraction(28, 4)} ＝ <strong>7</strong></span>, άρα διαιρείται με 4) και έχει άθροισμα 8 ＋ 2 ＋ 8 ＝ 18 (διαιρείται με 3 και 9).</div>`
      };
    }
  },
  {
    id: 'p_crit_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      return {
        title: isEn ? 'SIMULTANEOUS DIVISIBILITY BY 9 AND 25' : 'ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ 9 ΚΑΙ 25',
        instruction: isEn ? 'Select the number divisible by both 9 and 25:' : 'Επιλέξτε τον αριθμό που διαιρείται ταυτόχρονα με το 9 και το 25:',
        text: isEn
          ? `Which of the following numbers is simultaneously divisible by 9 and 25: ${formatNumber(1250, locale)}, ${formatNumber(1425, locale)}, ${formatNumber(1575, locale)}, or ${formatNumber(1850, locale)}?`
          : `Ποιος από τους παρακάτω αριθμούς διαιρείται ταυτόχρονα με το 9 και το 25: ${formatNumber(1250, locale)}, ${formatNumber(1425, locale)}, ${formatNumber(1575, locale)} ή ${formatNumber(1850, locale)};`,
        tableData: {
          col1: isEn ? `Number ${formatNumber(1575, locale)}` : `Αριθμός ${formatNumber(1575, locale)}`,
          col2: isEn ? 'Criteria Check' : 'Έλεγχος Κριτηρίων',
          r1: [isEn ? 'Ends in 75' : 'Τελειώνει σε 75', isEn ? 'Divisible by 25 ✅' : 'Διαιρείται με 25 ✅'],
          r2: [isEn ? 'Sum: 1 ＋ 5 ＋ 7 ＋ 5 ＝ 18' : 'Άθροισμα: 1 ＋ 5 ＋ 7 ＋ 5 ＝ 18', isEn ? 'Divisible by 9 ✅' : 'Διαιρείται με 9 ✅']
        },
        optionsRaw: [
          formatNumber(1250, locale),
          formatNumber(1425, locale),
          formatNumber(1575, locale),
          formatNumber(1850, locale)
        ],
        correctText: formatNumber(1575, locale),
        explanation: isEn
          ? `${formatNumber(1575, locale)} ends in 75 (divisible by 25) and its digit sum is 1 ＋ 5 ＋ 7 ＋ 5 ＝ 18 (divisible by 9).`
          : `Ο αριθμός ${formatNumber(1575, locale)} τελειώνει σε 75 (διαιρείται με 25) και έχει άθροισμα ψηφίων 1 ＋ 5 ＋ 7 ＋ 5 ＝ 18 (διαιρείται με 9).`
      };
    }
  },
  {
    id: 'p_crit_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      return {
        title: isEn ? 'SIMULTANEOUS DIVISIBILITY BY 4 AND 10' : 'ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ 4 ΚΑΙ 10',
        instruction: isEn ? 'Select the number divisible by both 4 and 10:' : 'Επιλέξτε τον αριθμό που διαιρείται ταυτόχρονα με το 4 και το 10:',
        text: isEn
          ? 'Which of the following numbers is simultaneously divisible by 4 and 10: 930, 950, 960, or 970?'
          : 'Ποιος από τους παρακάτω αριθμούς διαιρείται ταυτόχρονα με το 4 και το 10: 930, 950, 960 ή 970;',
        tableData: {
          col1: isEn ? 'Number 960' : 'Αριθμός 960',
          col2: isEn ? 'Criteria Check' : 'Έλεγχος Κριτηρίων',
          r1: [isEn ? 'Ends in 0' : 'Λήγει σε 0', isEn ? 'Divisible by 10 ✅' : 'Διαιρείται με 10 ✅'],
          r2: [isEn ? 'Ends in 60' : 'Τελειώνει σε 60', `${renderFraction(60, 4)} ＝ 15 ✅`]
        },
        optionsRaw: ['930', '950', '960', '970'],
        correctText: '960',
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">960 ends in 0 (divisible by 10) and its last two digits 60 divide by 4: <span>${renderFraction(60, 4)} ＝ <strong>15</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Ο αριθμός 960 λήγει σε 0 (διαιρείται με 10) και τελειώνει σε 60 (<span>${renderFraction(60, 4)} ＝ <strong>15</strong></span>, άρα διαιρείται με 4).</div>`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const qList = [];
  const yesLabel = isEn ? 'Yes' : 'Ναι';
  const noLabel = isEn ? 'No' : 'Όχι';

  // Q1 (MCQ Yes/No): Διαιρετότητα με το 2, 5 ή 10
  {
    const q1Div = [2, 5, 10][randInt(0, 2)];
    const q1IsDivisible = Math.random() > 0.5;
    let q1Num = randInt(120, 980);

    if (q1IsDivisible) {
      if (q1Div === 2) {
        if (q1Num % 2 !== 0) q1Num += 1;
      } else if (q1Div === 5) {
        q1Num = Math.floor(q1Num / 5) * 5;
      } else {
        q1Num = Math.floor(q1Num / 10) * 10;
      }
    } else {
      if (q1Div === 2) {
        if (q1Num % 2 === 0) q1Num += 1;
      } else if (q1Div === 5) {
        if (q1Num % 5 === 0) q1Num += 3;
      } else {
        if (q1Num % 10 === 0) q1Num += 3;
      }
    }

    const q1Correct = q1Num % q1Div === 0 ? yesLabel : noLabel;
    const options = [
      { text: yesLabel, isCorrect: q1Correct === yesLabel },
      { text: noLabel, isCorrect: q1Correct === noLabel }
    ];

    qList.push({
      id: 1,
      type: 'mcq',
      title: isEn ? 'QUESTION 1 • DIVISIBILITY BY 2, 5, 10' : 'ΕΡΩΤΗΣΗ 1 • ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ 2, 5, 10',
      instruction: isEn ? 'Select whether the number divides evenly:' : 'Επιλέξτε αν ο αριθμός διαιρείται ακριβώς:',
      prompt: isEn ? `Does the number ${q1Num} divide evenly by ${q1Div}?` : `Διαιρείται ο αριθμός ${q1Num} ακριβώς με το ${q1Div};`,
      options,
      correctText: q1Correct,
      explanation: q1Num % q1Div === 0
        ? (isEn
            ? `Correct! The last digit is ${q1Num % 10}, so ${q1Num} divides exactly by ${q1Div}.`
            : `Σωστά! Το τελευταίο ψηφίο είναι το ${q1Num % 10}, επομένως ο αριθμός ${q1Num} διαιρείται ακριβώς με το ${q1Div}.`)
        : (isEn
            ? `The number ${q1Num} ends in ${q1Num % 10}, so it does NOT divide evenly by ${q1Div}.`
            : `Ο αριθμός ${q1Num} τελειώνει σε ${q1Num % 10}, άρα ΔΕΝ διαιρείται ακριβώς με το ${q1Div}.`)
    });
  }

  // Q2 (Input): Άθροισμα ψηφίων & Διαιρετότητα με το 3 ή 9
  {
    const q2Div = [3, 9][randInt(0, 1)];
    let q2Num = randInt(110, 890);
    if (q2Div === 3) {
      while (sumDigits(String(q2Num)) % 3 !== 0) q2Num++;
    } else {
      while (sumDigits(String(q2Num)) % 9 !== 0) q2Num++;
    }
    const q2Sum = sumDigits(String(q2Num));

    qList.push({
      id: 2,
      type: 'integer_input',
      title: isEn ? 'QUESTION 2 • SUM OF DIGITS' : 'ΕΡΩΤΗΣΗ 2 • ΑΘΡΟΙΣΜΑ ΨΗΦΙΩΝ',
      instruction: isEn ? 'Calculate the sum of the digits (integer):' : 'Υπολογίστε το άθροισμα των ψηφίων του αριθμού (ακέραιος):',
      prompt: isEn ? `What is the sum of digits of the number ${q2Num}?` : `Ποιο είναι το άθροισμα των ψηφίων του αριθμού ${q2Num};`,
      correctVal: q2Sum,
      correctStr: String(q2Sum),
      explanation: isEn
        ? `The digits of ${q2Num} sum to: ${String(q2Num).split('').join(' ＋ ')} ＝ ${q2Sum}.`
        : `Τα ψηφία του αριθμού ${q2Num} είναι: ${String(q2Num).split('').join(' ＋ ')} ＝ ${q2Sum}.`
    });
  }

  // Q3 (MCQ): Διαιρετότητα με το 4 ή το 25
  {
    const q3Div = [4, 25][randInt(0, 1)];
    let q3ValidNum = randInt(100, 900);
    if (q3Div === 4) {
      while (q3ValidNum % 4 !== 0) q3ValidNum++;
    } else {
      q3ValidNum = Math.floor(q3ValidNum / 25) * 25;
    }
    const q3Invalid1 = q3ValidNum + (q3Div === 4 ? 2 : 10);
    const q3Invalid2 = q3ValidNum + (q3Div === 4 ? 3 : 15);
    const q3Invalid3 = q3ValidNum + (q3Div === 4 ? 1 : 7);

    const options = makeUniqueFourOptions(
      String(q3ValidNum),
      [String(q3Invalid1), String(q3Invalid2), String(q3Invalid3)],
      (step) => String(q3ValidNum + step * (q3Div === 4 ? 5 : 8))
    );

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • DIVISIBILITY BY 4 & 25' : 'ΕΡΩΤΗΣΗ 3 • ΔΙΑΙΡΕΤΟΤΗΤΑ ΜΕ ΤΟ 4 & 25',
      instruction: isEn ? 'Select which number divides exactly:' : 'Επιλέξτε ποιος αριθμός διαιρείται ακριβώς:',
      prompt: isEn ? `Which of the following numbers divides exactly by ${q3Div}?` : `Ποιος από τους παρακάτω αριθμούς διαιρείται ακριβώς με το ${q3Div};`,
      options,
      correctText: String(q3ValidNum),
      explanation: q3Div === 4
        ? (isEn
            ? `The last two digits of ${q3ValidNum} (${String(q3ValidNum).slice(-2)}) divide by 4.`
            : `Τα δύο τελευταία ψηφία του ${q3ValidNum} (${String(q3ValidNum).slice(-2)}) διαιρούνται με το 4.`)
        : (isEn
            ? `The number ${q3ValidNum} ends in ${String(q3ValidNum).slice(-2)}, so it divides by 25.`
            : `Ο αριθμός ${q3ValidNum} τελειώνει σε ${String(q3ValidNum).slice(-2)}, άρα διαιρείται με το 25.`)
    });
  }

  // Q4 (MCQ): Εύρεση ψηφίου που λείπει
  {
    const q4Div = [3, 9][randInt(0, 1)];
    const d1 = randInt(1, 8);
    const d3 = randInt(1, 8);
    let correctDigit = 0;
    for (let digit = 0; digit <= 9; digit++) {
      if ((d1 + digit + d3) % q4Div === 0) {
        correctDigit = digit;
        break;
      }
    }
    const q4NumberPattern = `${d1} _ ${d3}`;

    const options = makeUniqueFourOptions(
      String(correctDigit),
      [
        String((correctDigit + 1) % 10),
        String((correctDigit + 2) % 10),
        String((correctDigit + 4) % 10)
      ],
      (step) => String((correctDigit + step + 5) % 10)
    );

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • FINDING MISSING DIGIT' : 'ΕΡΩΤΗΣΗ 4 • ΕΥΡΕΣΗ ΨΗΦΙΟΥ ΠΟΥ ΛΕΙΠΕΙ',
      instruction: isEn ? 'Select the appropriate digit:' : 'Επιλέξτε το κατάλληλο ψηφίο:',
      prompt: isEn
        ? `Which digit must replace the blank in ${q4NumberPattern} so that it divides exactly by ${q4Div}?`
        : `Ποιο ψηφίο πρέπει να μπει στη θέση του κενού στον αριθμό ${q4NumberPattern} ώστε να διαιρείται ακριβώς με το ${q4Div};`,
      options,
      correctText: String(correctDigit),
      explanation: isEn
        ? `Inserting ${correctDigit}, the digit sum becomes ${d1} ＋ ${correctDigit} ＋ ${d3} ＝ ${d1 + correctDigit + d3}, which divides by ${q4Div}.`
        : `Βάζοντας το ψηφίο ${correctDigit}, το άθροισμα των ψηφίων γίνεται ${d1} ＋ ${correctDigit} ＋ ${d3} ＝ ${d1 + correctDigit + d3}, που διαιρείται με το ${q4Div}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας για το 3 και 9
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? 'A number divides by 9 when the sum of its digits divides by 9.'
          : 'A number divides by 9 when its last digit is 9.')
      : (q5IsTrue
          ? 'Ένας αριθμός διαιρείται με το 9 όταν το άθροισμα των ψηφίων του διαιρείται με το 9.'
          : 'Ένας αριθμός διαιρείται με το 9 όταν το τελευταίο του ψηφίο είναι το 9.');
    const labelTrue = isEn ? 'True' : 'Σωστό';
    const labelFalse = isEn ? 'False' : 'Λάθος';
    const correctAns = q5IsTrue ? labelTrue : labelFalse;

    const options = [
      { text: labelTrue, isCorrect: q5IsTrue },
      { text: labelFalse, isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: isEn ? 'QUESTION 5 • RULE OF 9' : 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΔΙΑΙΡΕΤΟΤΗΤΑΣ ΜΕ ΤΟ 9',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? 'Correct! For 3 and 9, we sum the digits of the number.'
            : 'False! For divisibility by 9 we check the sum of digits, not only the last digit.')
        : (q5IsTrue
            ? 'Σωστό! Για το 3 και το 9 αρκεί να προσθέσουμε τα ψηφία του αριθμού.'
            : 'Λάθος! Για τη διαιρετότητα με το 9 εξετάζουμε το άθροισμα των ψηφίων, όχι μόνο το τελευταίο ψηφίο.')
    });
  }

  // Q6 (MCQ): True / False - Κανόνας για το 4 και 25
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? 'A number divides by 25 when its last two digits are 00, 25, 50, or 75.'
          : 'A number divides by 25 when its last digit is 5.')
      : (q6IsTrue
          ? 'Ένας αριθμός διαιρείται με το 25 όταν τα δύο τελευταία του ψηφία είναι 00, 25, 50 ή 75.'
          : 'Ένας αριθμός διαιρείται με το 25 όταν το τελευταίο του ψηφίο είναι το 5.');
    const labelTrue = isEn ? 'True' : 'Σωστό';
    const labelFalse = isEn ? 'False' : 'Λάθος';
    const correctAns = q6IsTrue ? labelTrue : labelFalse;

    const options = [
      { text: labelTrue, isCorrect: q6IsTrue },
      { text: labelFalse, isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: isEn ? 'QUESTION 6 • RULE OF 25' : 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΔΙΑΙΡΕΤΟΤΗΤΑΣ ΜΕ ΤΟ 25',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? 'Correct! The last two digits must form 00, 25, 50, or 75.'
            : 'False! It is not enough for the last digit to be 5 (e.g. 15 ends in 5 but does NOT divide by 25).')
        : (q6IsTrue
            ? 'Σωστό! Τα δύο τελευταία ψηφία πρέπει να σχηματίζουν 00, 25, 50 ή 75.'
            : 'Λάθος! Δεν αρκεί το τελευταίο ψηφίο να είναι 5 (π.χ. το 15 λήγει σε 5 αλλά ΔΕΝ διαιρείται με το 25).')
    });
  }

  // Q7 (Input): Ταυτόχρονη διαιρετότητα (με 2, 5 και 10)
  {
    const q7Options = [120, 240, 350, 480, 500, 620, 750, 900];
    const q7Num = q7Options[randInt(0, q7Options.length - 1)];
    const q7CorrectVal = 10;

    qList.push({
      id: 7,
      type: 'integer_input',
      title: isEn ? 'QUESTION 7 • SIMULTANEOUS DIVISIBILITY' : 'ΕΡΩΤΗΣΗ 7 • ΤΑΥΤΟΧΡΟΝΗ ΔΙΑΙΡΕΤΟΤΗΤΑ',
      instruction: isEn ? 'Enter the number (integer):' : 'Συμπληρώστε τον αριθμό (ακέραιος):',
      prompt: isEn
        ? `The number ${q7Num} is simultaneously divisible by 2 and 5. By which other basic number is it guaranteed to be divisible?`
        : `Ο αριθμός ${q7Num} διαιρείται ταυτόχρονα με το 2 και το 5. Με ποιον άλλον βασικό αριθμό διαιρείται σίγουρα;`,
      correctVal: q7CorrectVal,
      correctStr: String(q7CorrectVal),
      explanation: isEn
        ? `The number ${q7Num} ends in 0, so it divides simultaneously by 2, 5, and 10.`
        : `Ο αριθμός ${q7Num} τελειώνει σε 0, άρα διαιρείται ταυτόχρονα με το 2, το 5 και το 10.`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας
  {
    const pool = REAL_WORLD_PROBLEMS_Q8[locale] || REAL_WORLD_PROBLEMS_Q8.el;
    const shuffledQ8Pool = shuffle(pool);
    const selectedQ8 = shuffledQ8Pool[0];
    const q8Prompt = selectedQ8.prompt(selectedQ8.total);
    const q8CorrectStr = selectedQ8.correctOption;

    const options = makeUniqueFourOptions(
      q8CorrectStr,
      selectedQ8.wrongOptions,
      (step) => (isEn ? `In groups of ${step + 6}` : `Σε ομάδες των ${step + 6}`)
    );

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • EVERYDAY PROBLEM' : 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: isEn ? 'Select the correct equal division method:' : 'Επιλέξτε τον σωστό τρόπο ισόποσης κατανομής:',
      prompt: q8Prompt,
      options,
      correctText: q8CorrectStr,
      explanation: selectedQ8.explain
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate(locale);
    const hardProb = shuffledHard[0].generate(locale);

    const optionsQ9 = makeUniqueFourOptions(
      stdProb.correctText,
      stdProb.optionsRaw.filter((opt) => opt !== stdProb.correctText),
      (step) => `${parseInt(stdProb.correctText, 10) + step * 10}`
    );

    qList.push({
      id: 9,
      type: 'mcq',
      title: `${isEn ? 'QUESTION 9 • ' : 'ΕΡΩΤΗΣΗ 9 • '}${stdProb.title}`,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      options: optionsQ9,
      correctText: stdProb.correctText,
      explanation: stdProb.explanation
    });

    const optionsQ10 = makeUniqueFourOptions(
      hardProb.correctText,
      hardProb.optionsRaw.filter((opt) => opt !== hardProb.correctText),
      (step) => `${parseInt(hardProb.correctText.replace(/[^0-9]/g, ''), 10) + step * 25}`
    );

    qList.push({
      id: 10,
      type: 'mcq',
      title: `${isEn ? 'QUESTION 10 • ' : 'ΕΡΩΤΗΣΗ 10 • '}${hardProb.title}`,
      instruction: hardProb.instruction,
      prompt: hardProb.text,
      tableData: hardProb.tableData,
      options: optionsQ10,
      correctText: hardProb.correctText,
      explanation: hardProb.explanation
    });
  }

  return qList;
}

const UI_STRINGS = {
  el: {
    pageTitle: "Ασκήσεις: Κριτήρια Διαιρετότητας - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στα κριτήρια διαιρετότητας για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 15 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Κριτήρια Διαιρετότητας",
    heroDesc: "10 δυναμικές δραστηριότητες κριτηρίων διαιρετότητας με το 2, 3, 4, 5, 9, 10 και 25, ταυτόχρονης διαιρετότητας και ρεαλιστικά προβλήματα καθημερινής ζωής.",
    heroDynamicNote: "⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.",
    btnNewSet: "🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    badgeCorrect: "✓ ΣΩΣΤΟ",
    badgeWrong: "✗ ΛΑΘΟΣ",
    inputPlaceholder: "Απάντηση...",
    inputNote: "(Ακέραιος αριθμός)",
    feedbackGreat: "🎉 Εξαιρετικά!",
    feedbackExpl: "💡 Μαθηματική Επεξήγηση:",
    correctAnswerLabel: "Σωστή απάντηση:",
    btnCheckMain: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "ΣΚΟΡ",
    answeredLabel: "ΑΠΑΝΤΗΘΗΚΑΝ",
    pctLabel: "ΠΟΣΟΣΤΟ",
    btnCheckBar: "ΕΛΕΓΧΟΣ"
  },
  en: {
    pageTitle: "Exercises: Divisibility Rules - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems testing divisibility rules for 2, 3, 4, 5, 9, 10, and 25 for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "CHAPTER 15 • GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Divisibility Rules",
    heroDesc: "10 dynamic activities applying divisibility criteria for 2, 3, 4, 5, 9, 10, and 25, simultaneous divisibility, and everyday real-world word problems.",
    heroDynamicNote: "⚡ Each exercise set is dynamically generated with random parameters.",
    btnNewSet: "🔄 NEW EXERCISES",
    badgeCorrect: "✓ CORRECT",
    badgeWrong: "✗ WRONG",
    inputPlaceholder: "Answer...",
    inputNote: "(Integer number)",
    feedbackGreat: "🎉 Excellent!",
    feedbackExpl: "💡 Mathematical Explanation:",
    correctAnswerLabel: "Correct answer:",
    btnCheckMain: "🎯 Check Answers",
    scoreLabel: "SCORE",
    answeredLabel: "ANSWERED",
    pctLabel: "PERCENTAGE",
    btnCheckBar: "CHECK"
  }
};

export default function KritiriaDiairetotitasExercisesPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = UI_STRINGS[locale];

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const q = generateQuestions(locale);
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [locale]);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleInputChange = (qId, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/[^0-9]/g, '');
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: sanitized
    }));
  };

  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  const isQuestionCorrect = (q) => {
    if (q.type === 'mcq') {
      return answers[`q_${q.id}`] === q.correctText;
    }
    if (q.type === 'integer_input') {
      const userValStr = (answers[`q_${q.id}`] || '').trim();
      const userVal = parseInt(userValStr, 10);
      return !isNaN(userVal) && userVal === q.correctVal;
    }
    return false;
  };

  const handleCheckAnswers = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitted) return;

    let currentScore = 0;
    questions.forEach((q) => {
      if (isQuestionCorrect(q)) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
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
          href="/st-dimotikou/15-kritiria-diairetotitas"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.theoryBtn}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span className="break-words [overflow-wrap:anywhere]">{t.badgeChapter}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere] hyphens-auto">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words [overflow-wrap:anywhere]">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200 break-words [overflow-wrap:anywhere]">
              {t.heroDynamicNote}
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation cursor-pointer"
            >
              <span>{toCleanUppercase(t.btnNewSet)}</span>
            </button>
          </div>
        </section>

        {/* Λίστα 10 Ασκήσεων */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, idx) => {
            const isCorrect = isSubmitted && isQuestionCorrect(q);

            return (
              <article
                key={`q-${q.id}-${idx}`}
                className={`bg-white rounded-3xl border p-5 sm:p-8 2xl:p-10 shadow-sm transition-all overflow-hidden ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλίδα Ερώτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(q.title)}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs 2xl:text-sm font-bold px-3 py-1 rounded-full shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? t.badgeCorrect : t.badgeWrong}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση */}
                <div className="space-y-3 mb-5">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500 break-words [overflow-wrap:anywhere]">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed break-words [overflow-wrap:anywhere] hyphens-auto">
                    {q.prompt}
                  </p>
                </div>

                {/* Περιοχή Απάντησης */}
                <div className="py-2">
                  {q.type === 'integer_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck="false"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder={t.inputPlaceholder}
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500 font-medium">
                        {t.inputNote}
                      </span>
                    </div>
                  )}

                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 min-h-[48px] cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-300'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1 [overflow-wrap:anywhere]">
                              {opt.text}
                            </span>
                            <span
                              className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-xs ${
                                isSelected
                                  ? 'border-white bg-white text-blue-600 font-bold'
                                  : 'border-slate-400 bg-transparent'
                              }`}
                            >
                              {isSelected ? '●' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Feedback μετά την υποβολή */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-2.5 overflow-hidden ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? t.feedbackGreat : t.feedbackExpl}</span>
                    </div>

                    {/* No-Giveaway: Εμφάνιση βοηθητικού πίνακα ΜΟΝΟ μετά την υποβολή */}
                    {q.tableData && (
                      <div className="inline-block max-w-full bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-inner my-1 font-mono text-xs sm:text-sm overflow-x-auto">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                          <span className="bg-blue-100/70 px-2 py-0.5 rounded-lg text-blue-900 break-words [overflow-wrap:anywhere]">{q.tableData.col1}</span>
                          <span className="bg-emerald-100/70 px-2 py-0.5 rounded-lg text-emerald-900 break-words [overflow-wrap:anywhere]">{q.tableData.col2}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                          <span className="break-words [overflow-wrap:anywhere]">{q.tableData.r1[0]}</span>
                          <span className="text-indigo-700 font-bold break-words [overflow-wrap:anywhere]">{q.tableData.r1[1]}</span>
                          <span className="break-words [overflow-wrap:anywhere]">{q.tableData.r2[0]}</span>
                          <span className="text-amber-600 font-black break-words [overflow-wrap:anywhere]">{q.tableData.r2[1]}</span>
                        </div>
                      </div>
                    )}

                    <div
                      className="break-words [overflow-wrap:anywhere]"
                      dangerouslySetInnerHTML={{ __html: q.explanation }}
                    />
                    
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800 break-words [overflow-wrap:anywhere]">
                        {t.correctAnswerLabel}{' '}
                        <span className="font-mono font-bold text-blue-900">
                          {formatNumber(q.correctStr || q.correctText, locale)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Κουμπί Ελέγχου στο τέλος της φόρμας */}
        {!isSubmitted && (
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={handleCheckAnswers}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation cursor-pointer"
            >
              <span>{t.btnCheckMain}</span>
            </button>
          </div>
        )}

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                {isSubmitted ? toCleanUppercase(t.scoreLabel) : toCleanUppercase(t.answeredLabel)}
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {isSubmitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-8">
                <span className="text-xs text-slate-400 font-semibold block">
                  {toCleanUppercase(t.pctLabel)}
                </span>
                <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
                  {Math.round((score / 10) * 100)} %
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation cursor-pointer"
              >
                {toCleanUppercase(t.btnCheckBar)}
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation cursor-pointer"
              >
                <span>{toCleanUppercase(t.btnNewSet)}</span>
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}
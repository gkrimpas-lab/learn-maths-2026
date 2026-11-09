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

function getDivisors(num) {
  const divs = [];
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) divs.push(i);
  }
  return divs;
}

function getGCD(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
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

const REAL_WORLD_PRESETS = {
  el: [
    {
      profession: 'Ένας μανάβης',
      item1: 'μήλα',
      item2: 'πορτοκάλια',
      groupName: 'καλάθια',
      questionText: 'Πόσα πανομοιότυπα καλάθια μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα φρούτο;'
    },
    {
      profession: 'Ένας βιβλιοπώλης',
      item1: 'τετράδια',
      item2: 'μολύβια',
      groupName: 'σετ δώρων',
      questionText: 'Πόσα πανομοιότυπα σετ δώρων μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα είδος;'
    },
    {
      profession: 'Ένας ανθοπώλης',
      item1: 'τριαντάφυλλα',
      item2: 'μαργαρίτες',
      groupName: 'ανθοδέσμες',
      questionText: 'Πόσες πανομοιότυπες ανθοδέσμες μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα λουλούδι;'
    },
    {
      profession: 'Ένας προπονητής',
      item1: 'μπάλες ποδοσφαίρου',
      item2: 'μπάλες μπάσκετ',
      groupName: 'σάκους',
      questionText: 'Πόσους πανομοιότυπους σάκους μπορεί να φτιάξει το πολύ χωρίς να περισσέψει καμία μπάλα;'
    },
    {
      profession: 'Ένας παντοπώλης',
      item1: 'σοκολατάκια',
      item2: 'καραμέλες',
      groupName: 'πακέτα',
      questionText: 'Πόσα πανομοιότυπα πακέτα μπορεί να φτιάξει το πολύ χωρίς να περισσέψει κανένα γλύκισμα;'
    }
  ],
  en: [
    {
      profession: 'A grocer',
      item1: 'apples',
      item2: 'oranges',
      groupName: 'baskets',
      questionText: 'How many identical fruit baskets can he prepare at most without any leftover fruit?'
    },
    {
      profession: 'A bookseller',
      item1: 'notebooks',
      item2: 'pencils',
      groupName: 'gift sets',
      questionText: 'How many identical gift sets can he prepare at most without any leftover items?'
    },
    {
      profession: 'A florist',
      item1: 'roses',
      item2: 'daisies',
      groupName: 'bouquets',
      questionText: 'How many identical bouquets can she prepare at most without any leftover flowers?'
    },
    {
      profession: 'A sports coach',
      item1: 'soccer balls',
      item2: 'basketballs',
      groupName: 'ball bags',
      questionText: 'How many identical ball bags can he assemble at most without any leftover balls?'
    },
    {
      profession: 'A shopkeeper',
      item1: 'chocolates',
      item2: 'candies',
      groupName: 'sweet packages',
      questionText: 'How many identical sweet packages can he make at most without any leftover treats?'
    }
  ]
};

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_mkd_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const redRibbon = 36;
      const blueRibbon = 48;
      const maxCut = getGCD(redRibbon, blueRibbon);
      const unit = isEn ? 'cm' : 'εκ.';
      const abbr = isEn ? 'GCD' : 'Μ.Κ.Δ.';

      return {
        title: isEn ? 'MAXIMUM EQUAL RIBBON LENGTH' : 'ΜΕΓΙΣΤΟ ΚΟΙΝΟ ΜΗΚΟΣ ΚΟΡΔΕΛΑΣ',
        instruction: isEn ? 'Calculate maximum length in centimeters (cm):' : 'Υπολογίστε το μέγιστο μήκος σε εκατοστά (εκ.):',
        text: isEn
          ? `A seamstress has two ribbons of length ${redRibbon} cm and ${blueRibbon} cm. She wants to cut both into equal pieces of the maximum possible length without any fabric left over. What is the maximum length (in cm) of each piece?`
          : `Μια μοδίστρα έχει δύο κορδέλες μήκους ${redRibbon} εκ. και ${blueRibbon} εκ. Θέλει να τις κόψει σε ίσα κομμάτια με το μεγαλύτερο δυνατό μήκος χωρίς να περισσέψει καθόλου ύφασμα. Ποιο είναι το μέγιστο μήκος (σε εκ.) κάθε κομματιού;`,
        tableData: {
          col1: isEn ? 'Ribbon Lengths' : 'Μήκη Κορδελών',
          col2: isEn ? 'Maximum Equal Length' : 'Μέγιστο Ίσο Μήκος',
          r1: [`${redRibbon} ${unit} & ${blueRibbon} ${unit}`, `${abbr}(36, 48)`],
          r2: [isEn ? 'Calculation' : 'Υπολογισμός', `${maxCut} ${unit}`]
        },
        correctVal: maxCut,
        correctStr: String(maxCut),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">We seek the greatest common measure, which is the GCD of 36 and 48: <span>${abbr}(36, 48) ＝ <strong>${maxCut} ${unit}</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Αναζητούμε το μέγιστο κοινό μέγεθος, δηλαδή τον Μ.Κ.Δ. των 36 και 48: <span>${abbr}(36, 48) ＝ <strong>${maxCut} ${unit}</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_mkd_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const cheesePies = 40;
      const spinachPies = 60;
      const maxBoxes = getGCD(cheesePies, spinachPies);
      const abbr = isEn ? 'GCD' : 'Μ.Κ.Δ.';
      const unit = isEn ? 'boxes' : 'συσκευασίες';

      return {
        title: isEn ? 'PACKAGING PASTRIES INTO BOXES' : 'ΣΥΣΚΕΥΑΣΙΑ ΠΙΤΩΝ ΣΕ ΚΟΥΤΙΑ',
        instruction: isEn ? 'Calculate the maximum number of packages:' : 'Υπολογίστε το μέγιστο πλήθος συσκευασιών:',
        text: isEn
          ? `A bakery baked ${cheesePies} cheese pies and ${spinachPies} spinach pies. It wants to divide them into identical packages without any left over. How many identical packages can be made at most?`
          : `Ένα κυλικείο έψησε ${cheesePies} τυροπιτάκια και ${spinachPies} σπανακοπιτάκια. Θέλει να τα μοιράσει σε πανομοιότυπες συσκευασίες χωρίς να περισσέψει κανένα. Πόσες τέτοιες συσκευασίες μπορεί να ετοιμάσει το πολύ;`,
        tableData: {
          col1: isEn ? 'Pastries' : 'Προϊόντα',
          col2: isEn ? 'Maximum Packages' : 'Μέγιστες Συσκευασίες',
          r1: [isEn ? `${cheesePies} cheese & ${spinachPies} spinach` : `${cheesePies} τυρ. & ${spinachPies} σπαν.`, `${abbr}(40, 60)`],
          r2: [isEn ? 'Calculation' : 'Υπολογισμός', `${maxBoxes} ${unit}`]
        },
        correctVal: maxBoxes,
        correctStr: String(maxBoxes),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The maximum number of identical packages equals: <span>${abbr}(40, 60) ＝ <strong>${maxBoxes} ${unit}</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Ο μέγιστος αριθμός πανομοιότυπων συσκευασιών αντιστοιχεί στον: <span>${abbr}(40, 60) ＝ <strong>${maxBoxes} ${unit}</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_mkd_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const notebooks = 45;
      const pens = 75;
      const maxPacks = getGCD(notebooks, pens);
      const abbr = isEn ? 'GCD' : 'Μ.Κ.Δ.';
      const unit = isEn ? 'packs' : 'πακέτα';

      return {
        title: isEn ? 'STATIONERY GIFT PACKS' : 'ΠΑΚΕΤΑ ΓΡΑΦΙΚΗΣ ΥΛΗΣ',
        instruction: isEn ? 'Calculate the maximum number of packs:' : 'Υπολογίστε τον μέγιστο αριθμό πακέτων:',
        text: isEn
          ? `A bookstore has ${notebooks} notebooks and ${pens} pens. It wants to assemble identical gift packs for students. How many such packs can be prepared at most?`
          : `Ένα βιβλιοπωλείο διαθέτει ${notebooks} τετράδια και ${pens} στυλό. Θέλει να φτιάξει όμοια πακέτα γραφικής ύλης για μαθητές. Πόσα τέτοια πακέτα μπορεί να δημιουργήσει το μέγιστο;`,
        tableData: {
          col1: isEn ? 'Supplies' : 'Υλικά',
          col2: isEn ? 'Maximum Packs' : 'Μέγιστα Πακέτα',
          r1: [isEn ? `${notebooks} notebooks & ${pens} pens` : `${notebooks} τετράδια & ${pens} στυλό`, `${abbr}(45, 75)`],
          r2: [isEn ? 'Calculation' : 'Υπολογισμός', `${maxPacks} ${unit}`]
        },
        correctVal: maxPacks,
        correctStr: String(maxPacks),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The maximum number of packages is the GCD of 45 and 75: <span>${abbr}(45, 75) ＝ <strong>${maxPacks} ${unit}</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Ο μέγιστος αριθμός πακέτων ισούται με τον Μ.Κ.Δ. των 45 και 75: <span>${abbr}(45, 75) ＝ <strong>${maxPacks} ${unit}</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_mkd_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const roses = 32;
      const lilies = 48;
      const maxBouquets = getGCD(roses, lilies);
      const abbr = isEn ? 'GCD' : 'Μ.Κ.Δ.';
      const unit = isEn ? 'bouquets' : 'ανθοδέσμες';

      return {
        title: isEn ? 'IDENTICAL FLOWER BOUQUETS' : 'ΠΑΝΟΜΟΙΟΤΥΠΕΣ ΑΝΘΟΔΕΣΜΕΣ',
        instruction: isEn ? 'Calculate the maximum number of bouquets:' : 'Υπολογίστε το μέγιστο πλήθος ανθοδεσμών:',
        text: isEn
          ? `A flower shop has ${roses} roses and ${lilies} lilies. The florist wants to create identical bouquets using all the flowers. How many bouquets can she make at most?`
          : `Ένα ανθοπωλείο έχει ${roses} τριαντάφυλλα και ${lilies} κρίνα. Θέλει να φτιάξει πανομοιότυπες ανθοδέσμες χρησιμοποιώντας όλα τα λουλούδια. Πόσες ανθοδέσμες μπορεί να φτιάξει το πολύ;`,
        tableData: {
          col1: isEn ? 'Flowers' : 'Λουλούδια',
          col2: isEn ? 'Maximum Bouquets' : 'Μέγιστες Ανθοδέσμες',
          r1: [isEn ? `${roses} roses & ${lilies} lilies` : `${roses} τριαντάφυλλα & ${lilies} κρίνα`, `${abbr}(32, 48)`],
          r2: [isEn ? 'Calculation' : 'Υπολογισμός', `${maxBouquets} ${unit}`]
        },
        correctVal: maxBouquets,
        correctStr: String(maxBouquets),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Find the GCD of 32 and 48: <span>${abbr}(32, 48) ＝ <strong>${maxBouquets} ${unit}</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Βρίσκουμε τον Μ.Κ.Δ. των 32 και 48: <span>${abbr}(32, 48) ＝ <strong>${maxBouquets} ${unit}</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_mkd_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const ropeA = 42;
      const ropeB = 56;
      const maxPiece = getGCD(ropeA, ropeB);
      const abbr = isEn ? 'GCD' : 'Μ.Κ.Δ.';

      return {
        title: isEn ? 'CUTTING ROPES INTO EQUAL PIECES' : 'ΚΟΠΗ ΣΧΟΙΝΙΩΝ ΣΕ ΙΣΑ ΚΟΜΜΑΤΙΑ',
        instruction: isEn ? 'Calculate maximum piece length in meters (m):' : 'Υπολογίστε το μέγιστο μήκος κομματιού σε μέτρα (m):',
        text: isEn
          ? `In a storehouse there are two ropes of length ${ropeA} m and ${ropeB} m. We want to cut both into equal pieces of the maximum possible length. How many meters (m) will each piece be?`
          : `Σε μια αποθήκη υπάρχουν δύο σχοινιά μήκους ${ropeA} m και ${ropeB} m. Θέλουμε να τα κόψουμε σε ίσα κομμάτια με το μεγαλύτερο δυνατό μήκος. Πόσα μέτρα (m) θα είναι κάθε κομμάτι;`,
        tableData: {
          col1: isEn ? 'Rope Lengths' : 'Μήκη Σχοινιών',
          col2: isEn ? 'Maximum Equal Length' : 'Μέγιστο Κοινό Μήκος',
          r1: [`${ropeA} m & ${ropeB} m`, `${abbr}(42, 56)`],
          r2: [isEn ? 'Calculation' : 'Υπολογισμός', `${maxPiece} m`]
        },
        correctVal: maxPiece,
        correctStr: String(maxPiece),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Compute: <span>${abbr}(42, 56) ＝ <strong>${maxPiece} m</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Υπολογίζουμε: <span>${abbr}(42, 56) ＝ <strong>${maxPiece} m</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_mkd_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const apples = 54;
      const oranges = 72;
      const maxBaskets = getGCD(apples, oranges);
      const abbr = isEn ? 'GCD' : 'Μ.Κ.Δ.';
      const unit = isEn ? 'baskets' : 'καλάθια';

      return {
        title: isEn ? 'FRUIT BASKETS' : 'ΚΑΛΑΘΙΑ ΜΕ ΦΡΟΥΤΑ',
        instruction: isEn ? 'Calculate the maximum number of baskets:' : 'Υπολογίστε το μέγιστο πλήθος καλαθιών:',
        text: isEn
          ? `A farmer has ${apples} apples and ${oranges} oranges. He wants to assemble identical fruit baskets without any fruit left over. How many baskets can he prepare at most?`
          : `Ένας παραγωγός έχει ${apples} μήλα και ${oranges} πορτοκάλια. Θέλει να ετοιμάσει πανομοιότυπα καλάθια φρούτων χωρίς να περισσέψει κανένα φρούτο. Πόσα καλάθια μπορεί να ετοιμάσει το πολύ;`,
        tableData: {
          col1: isEn ? 'Fruits' : 'Φρούτα',
          col2: isEn ? 'Maximum Baskets' : 'Μέγιστα Καλάθια',
          r1: [isEn ? `${apples} apples & ${oranges} oranges` : `${apples} μήλα & ${oranges} πορτοκάλια`, `${abbr}(54, 72)`],
          r2: [isEn ? 'Calculation' : 'Υπολογισμός', `${maxBaskets} ${unit}`]
        },
        correctVal: maxBaskets,
        correctStr: String(maxBaskets),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The maximum number of baskets is: <span>${abbr}(54, 72) ＝ <strong>${maxBaskets} ${unit}</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Ο μέγιστος αριθμός καλαθιών είναι ο: <span>${abbr}(54, 72) ＝ <strong>${maxBaskets} ${unit}</strong></span>.</div>`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_mkd_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const redRibbon = 36;
      const blueRibbon = 48;
      const maxCut = getGCD(redRibbon, blueRibbon);
      const unit = isEn ? 'cm' : 'εκ.';
      const correctStr = `${maxCut} ${unit}`;
      const fake1 = `${maxCut + 4} ${unit}`;
      const fake2 = `${Math.max(2, maxCut - 4)} ${unit}`;
      const fake3 = `${maxCut + 2} ${unit}`;
      const abbr = isEn ? 'GCD' : 'Μ.Κ.Δ.';

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${maxCut + step * 6} ${unit}`
      );

      return {
        title: isEn ? 'MAXIMUM EQUAL RIBBON PIECE' : 'ΜΕΓΙΣΤΟ ΚΟΙΝΟ ΜΗΚΟΣ ΚΟΡΔΕΛΑΣ',
        instruction: isEn ? 'Select maximum length of each piece in centimeters (cm):' : 'Επιλέξτε το μέγιστο μήκος κάθε κομματιού σε εκατοστά (εκ.):',
        text: isEn
          ? `A seamstress has two ribbons of length ${redRibbon} cm and ${blueRibbon} cm. She wants to cut both into equal pieces of the maximum possible length without any fabric remaining. What is the maximum length of each piece?`
          : `Μια μοδίστρα έχει δύο κορδέλες μήκους ${redRibbon} εκ. και ${blueRibbon} εκ. Θέλει να τις κόψει σε ίσα κομμάτια με το μεγαλύτερο δυνατό μήκος χωρίς να περισσέψει καθόλου ύφασμα. Ποιο είναι το μέγιστο μήκος (σε εκ.) κάθε κομματιού;`,
        tableData: {
          col1: isEn ? 'Ribbon Lengths' : 'Μήκη Κορδελών',
          col2: isEn ? 'Maximum Equal Length' : 'Μέγιστο Ίσο Μήκος',
          r1: [`${redRibbon} ${unit} & ${blueRibbon} ${unit}`, `${abbr}(36, 48)`],
          r2: [isEn ? 'Calculation' : 'Υπολογισμός', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">We seek the greatest common measure: <span>${abbr}(36, 48) ＝ <strong>${correctStr}</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Αναζητούμε το μέγιστο κοινό μέγεθος, δηλαδή τον Μ.Κ.Δ. των 36 και 48: <span>${abbr}(36, 48) ＝ <strong>${correctStr}</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_mkd_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const cheesePies = 40;
      const spinachPies = 60;
      const maxBoxes = getGCD(cheesePies, spinachPies);
      const unit = isEn ? 'packages' : 'συσκευασίες';
      const correctStr = `${maxBoxes} ${unit}`;
      const fake1 = `${maxBoxes + 5} ${unit}`;
      const fake2 = `${Math.max(5, maxBoxes - 5)} ${unit}`;
      const fake3 = `${maxBoxes + 10} ${unit}`;
      const abbr = isEn ? 'GCD' : 'Μ.Κ.Δ.';

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${maxBoxes + step * 8} ${unit}`
      );

      return {
        title: isEn ? 'IDENTICAL FOOD PACKAGES' : 'ΠΑΝΟΜΟΙΟΤΥΠΕΣ ΣΥΣΚΕΥΑΣΙΕΣ',
        instruction: isEn ? 'Select the maximum number of packages:' : 'Επιλέξτε τον μέγιστο αριθμό συσκευασιών:',
        text: isEn
          ? `A canteen prepared ${cheesePies} cheese pies and ${spinachPies} spinach pies. It wants to divide them into identical packages without leaving any over. How many such packages can it prepare at most?`
          : `Ένα κυλικείο έψησε ${cheesePies} τυροπιτάκια και ${spinachPies} σπανακοπιτάκια. Θέλει να τα μοιράσει σε πανομοιότυπες συσκευασίες χωρίς να περισσέψει κανένα. Πόσες τέτοιες συσκευασίες μπορεί να ετοιμάσει το πολύ;`,
        tableData: {
          col1: isEn ? 'Products' : 'Προϊόντα',
          col2: isEn ? 'Maximum Packages' : 'Μέγιστες Συσκευασίες',
          r1: [isEn ? `${cheesePies} cheese & ${spinachPies} spinach` : `${cheesePies} τυρ. & ${spinachPies} σπαν.`, `${abbr}(40, 60)`],
          r2: [isEn ? 'Calculation' : 'Υπολογισμός', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The maximum number of identical packages is: <span>${abbr}(40, 60) ＝ <strong>${correctStr}</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Ο μέγιστος αριθμός πανομοιότυπων συσκευασιών αντιστοιχεί στον: <span>${abbr}(40, 60) ＝ <strong>${correctStr}</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_mkd_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const candies = 72;
      const bagsPossible = [6, 8, 9, 12];
      const bag = bagsPossible[randInt(0, bagsPossible.length - 1)];
      const perBag = candies / bag;
      const unit = isEn ? 'candies' : 'καραμέλες';
      const correctStr = `${perBag} ${unit}`;
      const fake1 = `${perBag + 3} ${unit}`;
      const fake2 = `${Math.max(1, perBag - 2)} ${unit}`;
      const fake3 = `${perBag + 5} ${unit}`;

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${perBag + step * 4} ${unit}`
      );

      return {
        title: isEn ? 'DIVIDING CANDIES INTO BAGS' : 'ΜΟΙΡΑΣΙΑ ΚΑΡΑΜΕΛΩΝ ΣΕ ΣΑΚΟΥΛΑΚΙΑ',
        instruction: isEn ? 'Select how many candies each bag will contain:' : 'Επιλέξτε πόσες καραμέλες θα περιέχει κάθε σακουλάκι:',
        text: isEn
          ? `A confectioner has ${candies} candies and wants to prepare ${bag} identical bags. How many candies must she place in each bag so that none remain?`
          : `Ένας ζαχαροπλάστης έχει ${candies} καραμέλες και θέλει να φτιάξει ${bag} ίδια σακουλάκια. Πόσες καραμέλες πρέπει να βάλει σε κάθε σακουλάκι για να μη μείνει καμία;`,
        tableData: {
          col1: isEn ? 'Total Candies' : 'Σύνολο Καραμελών',
          col2: isEn ? 'Bags' : 'Σακουλάκια',
          r1: [isEn ? `${candies} candies` : `${candies} καραμέλες`, isEn ? `${bag} bags` : `${bag} σακουλάκια`],
          r2: [isEn ? 'Division' : 'Διαίρεση', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">${bag} is a divisor of ${candies}: <span>${renderFraction(candies, bag)} ＝ <strong>${correctStr}</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το ${bag} είναι διαιρέτης του ${candies}: <span>${renderFraction(candies, bag)} ＝ <strong>${correctStr}</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_mkd_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const books = 84;
      const shelvesPossible = [4, 6, 7, 12];
      const shelf = shelvesPossible[randInt(0, shelvesPossible.length - 1)];
      const perShelf = books / shelf;
      const unit = isEn ? 'books' : 'βιβλία';
      const correctStr = `${perShelf} ${unit}`;
      const fake1 = `${perShelf + 2} ${unit}`;
      const fake2 = `${Math.max(1, perShelf - 3)} ${unit}`;
      const fake3 = `${perShelf + 5} ${unit}`;

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${perShelf + step * 4} ${unit}`
      );

      return {
        title: isEn ? 'ORGANIZING BOOKS ONTO SHELVES' : 'ΚΑΤΑΝΟΜΗ ΒΙΒΛΙΩΝ ΣΕ ΡΑΦΙΑ',
        instruction: isEn ? 'Select how many books each shelf will hold:' : 'Επιλέξτε πόσα βιβλία θα έχει κάθε ράφι:',
        text: isEn
          ? `In a library there are ${books} books to be placed equally across ${shelf} shelves. How many books will be on each shelf without any left over?`
          : `Σε μια βιβλιοθήκη υπάρχουν ${books} βιβλία και θέλουμε να τα τοποθετήσουμε ισόποσα σε ${shelf} ράφια. Πόσα βιβλία θα έχει κάθε ράφι χωρίς να περισσέψει κανένα;`,
        tableData: {
          col1: isEn ? 'Total Books' : 'Σύνολο Βιβλίων',
          col2: isEn ? 'Shelves' : 'Ράφια',
          r1: [isEn ? `${books} books` : `${books} βιβλία`, isEn ? `${shelf} shelves` : `${shelf} ράφια`],
          r2: [isEn ? 'Division' : 'Διαίρεση', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">${shelf} divides ${books} exactly: <span>${renderFraction(books, shelf)} ＝ <strong>${correctStr}</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το ${shelf} διαιρεί ακριβώς το ${books}: <span>${renderFraction(books, shelf)} ＝ <strong>${correctStr}</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_mkd_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const sweets = 96;
      const boxesPossible = [6, 8, 12, 16];
      const box = boxesPossible[randInt(0, boxesPossible.length - 1)];
      const perBox = sweets / box;
      const unit = isEn ? 'chocolates' : 'σοκολατάκια';
      const correctStr = `${perBox} ${unit}`;
      const fake1 = `${perBox + 2} ${unit}`;
      const fake2 = `${Math.max(1, perBox - 2)} ${unit}`;
      const fake3 = `${perBox + 4} ${unit}`;

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${perBox + step * 3} ${unit}`
      );

      return {
        title: isEn ? 'PACKAGING CHOCOLATES' : 'ΣΥΣΚΕΥΑΣΙΑ ΣΟΚΟΛΑΤΑΣ ΣΕ ΚΟΥΤΙΑ',
        instruction: isEn ? 'Select how many chocolates each box contains:' : 'Επιλέξτε πόσα σοκολατάκια περιέχει κάθε κουτί:',
        text: isEn
          ? `In a pastry kitchen, ${sweets} chocolates are divided equally into ${box} boxes. How many chocolates does each box contain?`
          : `Σε ένα εργαστήριο ζαχαροπλαστικής υπάρχουν ${sweets} σοκολατάκια που μοιράζονται ισόποσα σε ${box} κουτιά. Πόσα σοκολατάκια περιέχει κάθε κουτί;`,
        tableData: {
          col1: isEn ? 'Total' : 'Σύνολο',
          col2: isEn ? 'Boxes' : 'Κουτιά',
          r1: [isEn ? `${sweets} chocolates` : `${sweets} σοκολατάκια`, isEn ? `${box} boxes` : `${box} κουτιά`],
          r2: [isEn ? 'Division' : 'Διαίρεση', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">${box} is a divisor of ${sweets}: <span>${renderFraction(sweets, box)} ＝ <strong>${correctStr}</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το ${box} είναι διαιρέτης του ${sweets}: <span>${renderFraction(sweets, box)} ＝ <strong>${correctStr}</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_mkd_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const apples = 54;
      const oranges = 72;
      const maxBaskets = getGCD(apples, oranges);
      const unit = isEn ? 'baskets' : 'καλάθια';
      const correctStr = `${maxBaskets} ${unit}`;
      const fake1 = `${maxBaskets + 6} ${unit}`;
      const fake2 = `${Math.max(6, maxBaskets - 6)} ${unit}`;
      const fake3 = `${maxBaskets + 9} ${unit}`;
      const abbr = isEn ? 'GCD' : 'Μ.Κ.Δ.';

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${maxBaskets + step * 9} ${unit}`
      );

      return {
        title: isEn ? 'COMPOSING FRUIT BASKETS' : 'ΣΥΝΘΕΣΗ ΚΑΛΑΘΙΩΝ ΦΡΟΥΤΩΝ',
        instruction: isEn ? 'Select the maximum number of baskets:' : 'Επιλέξτε το μέγιστο πλήθος καλαθιών:',
        text: isEn
          ? `A farmer has ${apples} apples and ${oranges} oranges. He wants to assemble identical fruit baskets without any fruit left over. How many baskets can he prepare at most?`
          : `Ένας παραγωγός έχει ${apples} μήλα και ${oranges} πορτοκάλια. Θέλει να ετοιμάσει πανομοιότυπα καλάθια φρούτων χωρίς να περισσέψει κανένα φρούτο. Πόσα καλάθια μπορεί να ετοιμάσει το πολύ;`,
        tableData: {
          col1: isEn ? 'Fruits' : 'Φρούτα',
          col2: isEn ? 'Maximum Baskets' : 'Μέγιστα Καλάθια',
          r1: [isEn ? `${apples} apples & ${oranges} oranges` : `${apples} μήλα & ${oranges} πορτοκάλια`, `${abbr}(54, 72)`],
          r2: [isEn ? 'Calculation' : 'Υπολογισμός', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The maximum number of baskets is: <span>${abbr}(54, 72) ＝ <strong>${correctStr}</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Ο μέγιστος αριθμός καλαθιών είναι ο: <span>${abbr}(54, 72) ＝ <strong>${correctStr}</strong></span>.</div>`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const qList = [];
  const itemsPool = REAL_WORLD_PRESETS[locale] || REAL_WORLD_PRESETS.el;
  const shuffledPresets = shuffle(itemsPool);
  const abbr = isEn ? 'GCD' : 'Μ.Κ.Δ.';

  // Q1 (Input): Μ.Κ.Δ. 2 αριθμών
  {
    const q1Pool = [
      [12, 18], [15, 20], [24, 36], [20, 30], [16, 24], [18, 27], [30, 45]
    ];
    const [q1A, q1B] = q1Pool[randInt(0, q1Pool.length - 1)];
    const q1GCD = getGCD(q1A, q1B);

    qList.push({
      id: 1,
      type: 'integer_input',
      title: isEn ? 'QUESTION 1 • GCD OF TWO NUMBERS' : 'ΕΡΩΤΗΣΗ 1 • Μ.Κ.Δ. ΔΥΟ ΑΡΙΘΜΩΝ',
      instruction: isEn ? 'Calculate the Greatest Common Divisor (integer):' : 'Υπολογίστε τον Μέγιστο Κοινό Διαιρέτη (ακέραιος):',
      prompt: `${abbr}(${q1A}, ${q1B})`,
      correctVal: q1GCD,
      correctStr: String(q1GCD),
      explanation: isEn
        ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The common divisors of ${q1A} and ${q1B} have a maximum of ${q1GCD}. Therefore: <span>${abbr}(${q1A}, ${q1B}) ＝ <strong>${q1GCD}</strong></span>.</div>`
        : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Οι κοινοί διαιρέτες των ${q1A} και ${q1B} έχουν μεγαλύτερο το ${q1GCD}. Άρα: <span>${abbr}(${q1A}, ${q1B}) ＝ <strong>${q1GCD}</strong></span>.</div>`
    });
  }

  // Q2 (Input): Μ.Κ.Δ. 3 αριθμών
  {
    const q2Pool = [
      [12, 18, 24], [16, 24, 32], [20, 30, 40], [15, 30, 45], [12, 16, 20]
    ];
    const [q2A, q2B, q2C] = q2Pool[randInt(0, q2Pool.length - 1)];
    const q2GCD = getGCD(getGCD(q2A, q2B), q2C);

    qList.push({
      id: 2,
      type: 'integer_input',
      title: isEn ? 'QUESTION 2 • GCD OF THREE NUMBERS' : 'ΕΡΩΤΗΣΗ 2 • Μ.Κ.Δ. ΤΡΙΩΝ ΑΡΙΘΜΩΝ',
      instruction: isEn ? 'Calculate the Greatest Common Divisor (integer):' : 'Υπολογίστε τον Μέγιστο Κοινό Διαιρέτη (ακέραιος):',
      prompt: `${abbr}(${q2A}, ${q2B}, ${q2C})`,
      correctVal: q2GCD,
      correctStr: String(q2GCD),
      explanation: isEn
        ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The greatest common divisor of ${q2A}, ${q2B}, and ${q2C} is: <span>${abbr}(${q2A}, ${q2B}, ${q2C}) ＝ <strong>${q2GCD}</strong></span>.</div>`
        : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Ο μεγαλύτερος κοινός διαιρέτης των ${q2A}, ${q2B} και ${q2C} είναι: <span>${abbr}(${q2A}, ${q2B}, ${q2C}) ＝ <strong>${q2GCD}</strong></span>.</div>`
    });
  }

  // Q3 (MCQ): Σύνολο Κοινών Διαιρετών
  {
    const q3Pool = [
      [12, 18], [20, 30], [24, 36], [16, 24]
    ];
    const [q3A, q3B] = q3Pool[randInt(0, q3Pool.length - 1)];
    const q3DivsA = getDivisors(q3A);
    const q3DivsB = getDivisors(q3B);
    const q3Common = q3DivsA.filter((d) => q3DivsB.includes(d));
    const q3CorrectStr = `{ ${q3Common.join(', ')} }`;

    const q3Wrong1 = `{ ${q3Common.filter((_, i) => i !== 1).join(', ')} }`;
    const q3Wrong2 = `{ ${[...q3Common, q3Common[q3Common.length - 1] * 2].sort((a, b) => a - b).join(', ')} }`;
    const q3Wrong3 = `{ ${q3Common.map((d) => (d === 2 ? 5 : d)).sort((a, b) => a - b).join(', ')} }`;

    const options = makeUniqueFourOptions(
      q3CorrectStr,
      [q3Wrong1, q3Wrong2, q3Wrong3],
      (step) => `{ ${[...q3Common, q3Common[q3Common.length - 1] + step].sort((a, b) => a - b).join(', ')} }`
    );

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • COMMON DIVISORS SET' : 'ΕΡΩΤΗΣΗ 3 • ΣΥΝΟΛΟ ΚΟΙΝΩΝ ΔΙΑΙΡΕΤΩΝ',
      instruction: isEn ? 'Select the set of common divisors:' : 'Επιλέξτε το σύνολο των κοινών διαιρετών:',
      prompt: isEn
        ? `What is the set of common divisors of numbers ${q3A} and ${q3B}?`
        : `Ποιο είναι το σύνολο των κοινών διαιρετών των αριθμών ${q3A} και ${q3B};`,
      options,
      correctText: q3CorrectStr,
      explanation: isEn
        ? `The divisors common to both ${q3A} and ${q3B} are: ${q3CorrectStr}.`
        : `Οι διαιρέτες του ${q3A} και του ${q3B} που συμπίπτουν είναι: ${q3CorrectStr}.`
    });
  }

  // Q4 (MCQ): Πρώτοι μεταξύ τους αριθμοί (Μ.Κ.Δ. = 1)
  {
    const q4CoprimePairs = [
      [8, 9], [9, 14], [15, 16], [8, 15], [21, 22], [14, 25]
    ];
    const q4NonCoprimePairs = [
      [12, 18], [14, 21], [15, 20], [16, 24], [20, 35], [18, 27]
    ];
    const q4ChosenCoprime = q4CoprimePairs[randInt(0, q4CoprimePairs.length - 1)];
    const q4ChosenNonCoprimes = shuffle(q4NonCoprimePairs).slice(0, 3);
    const andWord = isEn ? 'and' : 'και';
    const q4CorrectStr = `${q4ChosenCoprime[0]} ${andWord} ${q4ChosenCoprime[1]}`;

    const options = makeUniqueFourOptions(
      q4CorrectStr,
      q4ChosenNonCoprimes.map((p) => `${p[0]} ${andWord} ${p[1]}`),
      (step) => `${10 + step * 2} ${andWord} ${20 + step * 2}`
    );

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • COPRIME NUMBERS' : 'ΕΡΩΤΗΣΗ 4 • ΠΡΩΤΟΙ ΜΕΤΑΞΥ ΤΟΥΣ',
      instruction: isEn ? 'Select the pair of relatively prime (coprime) numbers:' : 'Επιλέξτε το ζεύγος των πρώτων μεταξύ τους αριθμών:',
      prompt: isEn
        ? 'Which of the following pairs consists of relatively prime numbers?'
        : 'Ποιο από τα παρακάτω ζεύγη αποτελείται από αριθμούς που είναι πρώτοι μεταξύ τους;',
      options,
      correctText: q4CorrectStr,
      explanation: isEn
        ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The numbers ${q4CorrectStr} have only 1 as their common divisor: <span>${abbr} ＝ 1</span>, making them coprime.</div>`
        : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Οι αριθμοί ${q4CorrectStr} έχουν μοναδικό κοινό διαιρέτη το 1: <span>${abbr} ＝ 1</span>, άρα είναι πρώτοι μεταξύ τους.</div>`
    });
  }

  // Q5 (MCQ): True / False - Ορισμός Μ.Κ.Δ.
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? 'The Greatest Common Divisor (GCD) of two numbers is the largest number that divides both of them exactly.'
          : 'The Greatest Common Divisor (GCD) of two numbers is the product of the two numbers.')
      : (q5IsTrue
          ? 'Ο Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) δύο αριθμών είναι ο μεγαλύτερος αριθμός που τους διαιρεί και τους δύο ακριβώς.'
          : 'Ο Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) δύο αριθμών είναι το γινόμενο των δύο αριθμών.');
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
      title: isEn ? 'QUESTION 5 • DEFINITION OF GCD' : 'ΕΡΩΤΗΣΗ 5 • ΟΡΙΣΜΟΣ Μ.Κ.Δ.',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? 'Correct! The GCD is the greatest of all common divisors of two or more numbers.'
            : 'False! The GCD is the greatest common divisor, not the product of the numbers.')
        : (q5IsTrue
            ? 'Σωστό! Ο Μ.Κ.Δ. είναι ο μεγαλύτερος από όλους τους κοινούς διαιρέτες δύο ή περισσότερων αριθμών.'
            : 'Λάθος! Ο Μ.Κ.Δ. είναι ο μεγαλύτερος κοινός διαιρέτης, όχι το γινόμενο των αριθμών.')
    });
  }

  // Q6 (MCQ): True / False - Πρώτοι μεταξύ τους αριθμοί
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? 'When two numbers have a GCD equal to 1, they are called relatively prime (coprime).'
          : 'Two numbers are called relatively prime only if both are single-digit numbers.')
      : (q6IsTrue
          ? 'Όταν δύο αριθμοί έχουν Μ.Κ.Δ. ίσο με το 1, ονομάζονται πρώτοι μεταξύ τους.'
          : 'Δύο αριθμοί ονομάζονται πρώτοι μεταξύ τους μόνο αν είναι και οι δύο μονοψήφιοι.');
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
      title: isEn ? 'QUESTION 6 • COPRIME NUMBERS PROPERTY' : 'ΕΡΩΤΗΣΗ 6 • ΙΔΙΟΤΗΤΑ ΠΡΩΤΩΝ ΜΕΤΑΞΥ ΤΟΥΣ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? 'Correct! Two numbers are called coprime when their GCD equals 1.'
            : 'False! Two numbers can be coprime even if they are large composite numbers (e.g., 14 and 25).')
        : (q6IsTrue
            ? 'Σωστό! Δύο αριθμοί λέγονται πρώτοι μεταξύ τους όταν έχουν Μ.Κ.Δ. ίσο με 1.'
            : 'Λάθος! Δύο αριθμοί μπορεί να είναι πρώτοι μεταξύ τους ακόμη κι αν είναι μεγάλοι σύνθετοι αριθμοί (π.χ. 14 και 25).')
    });
  }

  // Q7 (Input): Οπτική Κατάτμηση
  {
    const q7A = [18, 24, 30][randInt(0, 2)];
    const q7B = [12, 16, 20][randInt(0, 2)];
    const q7Mkd = getGCD(q7A, q7B);
    const unit = isEn ? 'cm' : 'εκ.';

    qList.push({
      id: 7,
      type: 'integer_input',
      title: isEn ? 'QUESTION 7 • VISUAL SEGMENTATION' : 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΚΑΤΑΤΜΗΣΗ',
      instruction: isEn ? 'Find maximum common piece length in centimeters (cm):' : 'Βρείτε το μέγιστο κοινό μήκος κομματιού σε εκατοστά (εκ.):',
      prompt: isEn
        ? `What is the largest common piece length that measures two rods of length ${q7A} cm and ${q7B} cm exactly?`
        : `Ποιο είναι το μεγαλύτερο κοινό μήκος κομματιού που μετράει ακριβώς δύο ράβδους μήκους ${q7A} εκ. και ${q7B} εκ.;`,
      correctVal: q7Mkd,
      correctStr: String(q7Mkd),
      explanation: isEn
        ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">The greatest common measure that divides both ${q7A} and ${q7B} exactly is: <span>${abbr}(${q7A}, ${q7B}) ＝ <strong>${q7Mkd} ${unit}</strong></span>.</div>`
        : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το μεγαλύτερο μέγεθος κομματιού που μετράει ακριβώς και το ${q7A} και το ${q7B} είναι ο: <span>${abbr}(${q7A}, ${q7B}) ＝ <strong>${q7Mkd} ${unit}</strong></span>.</div>`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας
  {
    const p = shuffledPresets[0];
    const q8Count1 = randInt(3, 6) * 6;
    const q8Count2 = randInt(2, 5) * 6;
    const q8GCD = getGCD(q8Count1, q8Count2);
    const correctStr = `${q8GCD} ${p.groupName}`;

    const w1 = `${q8GCD + 2} ${p.groupName}`;
    const w2 = `${Math.max(1, q8GCD - 2)} ${p.groupName}`;
    const w3 = `${q8GCD + 4} ${p.groupName}`;

    const options = makeUniqueFourOptions(
      correctStr,
      [w1, w2, w3],
      (step) => `${q8GCD + step * 6} ${p.groupName}`
    );

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • EVERYDAY WORD PROBLEM' : 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: isEn ? 'Select maximum number of identical groups:' : 'Επιλέξτε το μέγιστο πλήθος όμοιων ομάδων:',
      prompt: isEn
        ? `${p.profession} has ${q8Count1} ${p.item1} and ${q8Count2} ${p.item2}. ${p.questionText}`
        : `${p.profession} έχει ${q8Count1} ${p.item1} και ${q8Count2} ${p.item2}. ${p.questionText}`,
      options,
      correctText: correctStr,
      explanation: isEn
        ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">We calculate: <span>${abbr}(${q8Count1}, ${q8Count2}) ＝ <strong>${q8GCD}</strong></span>. Thus, the maximum number is ${correctStr}.</div>`
        : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Βρίσκουμε τον: <span>${abbr}(${q8Count1}, ${q8Count2}) ＝ <strong>${q8GCD}</strong></span>. Άρα μπορεί να φτιάξει το πολύ ${correctStr}.</div>`
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate(locale);
    const hardProb = shuffledHard[0].generate(locale);

    qList.push({
      id: 9,
      type: 'integer_input',
      title: `${isEn ? 'QUESTION 9 • ' : 'ΕΡΩΤΗΣΗ 9 • '}${stdProb.title}`,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      correctVal: stdProb.correctVal,
      correctStr: stdProb.correctStr,
      explanation: stdProb.explanation
    });

    qList.push({
      id: 10,
      type: 'mcq',
      title: `${isEn ? 'QUESTION 10 • ' : 'ΕΡΩΤΗΣΗ 10 • '}${hardProb.title}`,
      instruction: hardProb.instruction,
      prompt: hardProb.text,
      tableData: hardProb.tableData,
      options: hardProb.options,
      correctText: hardProb.correctText,
      explanation: hardProb.explanation
    });
  }

  return qList;
}

const UI_STRINGS = {
  el: {
    pageTitle: "Ασκήσεις: Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στον Μέγιστο Κοινό Διαιρέτη για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 14 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.)",
    heroDesc: "10 δυναμικές δραστηριότητες εύρεσης Μ.Κ.Δ., κοινών διαιρετών, πρώτων μεταξύ τους αριθμών και ρεαλιστικά προβλήματα καθημερινής ζωής.",
    heroDynamicNote: "⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίους αριθμούς.",
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
    pageTitle: "Exercises: Greatest Common Divisor (GCD) - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems on identifying the Greatest Common Divisor and coprime numbers for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "CHAPTER 14 • GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Greatest Common Divisor (GCD)",
    heroDesc: "10 dynamic activities on finding GCD, common divisor sets, relatively prime numbers, and real-world word problems.",
    heroDynamicNote: "⚡ Each exercise set is dynamically generated with random numbers.",
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

export default function MkdExercisesPage() {
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
          href="/st-dimotikou/14-mkd"
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
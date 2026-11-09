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
    { item: 'μαθητές', unit: 'ισοπληθείς ομάδες', questionPrefix: 'Σε πόσες' },
    { item: 'καραμέλες', unit: 'σακουλάκια', questionPrefix: 'Σε πόσα' },
    { item: 'βιβλία', unit: 'ράφια', questionPrefix: 'Σε πόσα' },
    { item: 'λουλούδια', unit: 'ανθοδέσμες', questionPrefix: 'Σε πόσες' },
    { item: 'σοκολατάκια', unit: 'κουτάκια', questionPrefix: 'Σε πόσα' }
  ],
  en: [
    { item: 'students', unit: 'equal teams', questionPrefix: 'Into how many' },
    { item: 'candies', unit: 'bags', questionPrefix: 'Into how many' },
    { item: 'books', unit: 'shelves', questionPrefix: 'Onto how many' },
    { item: 'flowers', unit: 'bouquets', questionPrefix: 'Into how many' },
    { item: 'chocolates', unit: 'boxes', questionPrefix: 'Into how many' }
  ]
};

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_div_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const flowers = 48;
      const vasesPossible = [3, 4, 6, 8];
      const vase = vasesPossible[randInt(0, vasesPossible.length - 1)];
      const perVase = flowers / vase;
      const unitFlower = isEn ? 'roses' : 'τριαντάφυλλα';
      const unitVase = isEn ? 'vases' : 'βάζα';

      return {
        title: isEn ? 'SHARING ROSES INTO VASES' : 'ΜΟΙΡΑΣΜΑ ΤΡΙΑΝΤΑΦΥΛΛΩΝ ΣΕ ΒΑΖΑ',
        instruction: isEn ? 'Calculate how many roses are placed in each vase:' : 'Υπολογίστε πόσα τριαντάφυλλα μπαίνουν σε κάθε βάζο:',
        text: isEn
          ? `A florist has ${flowers} roses and wants to distribute them equally into ${vase} vases without any remaining. How many roses will be placed in each vase?`
          : `Ένα ανθοπωλείο έχει ${flowers} τριαντάφυλλα και θέλει να τα μοιράσει ισόποσα σε ${vase} βάζα χωρίς να περισσέψει κανένα. Πόσα τριαντάφυλλα θα βάλει σε κάθε βάζο;`,
        tableData: {
          col1: isEn ? 'Total Roses' : 'Σύνολο Τριαντάφυλλων',
          col2: isEn ? 'Number of Vases' : 'Πλήθος Βάζων',
          r1: [`${flowers} ${unitFlower}`, `${vase} ${unitVase}`],
          r2: [isEn ? 'Division' : 'Διαίρεση', `${perVase} ${isEn ? 'roses / vase' : 'τριαντάφυλλα / βάζο'}`]
        },
        correctVal: perVase,
        correctStr: String(perVase),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Because ${vase} is a divisor of ${flowers}, the division is exact: <span>${renderFraction(flowers, vase)} ＝ <strong>${perVase}</strong> roses per vase</span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Επειδή το ${vase} είναι διαιρέτης του ${flowers}, η διαίρεση είναι τέλεια: <span>${renderFraction(flowers, vase)} ＝ <strong>${perVase}</strong> τριαντάφυλλα σε κάθε βάζο</span>.</div>`
      };
    }
  },
  {
    id: 'p_div_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const students = 60;
      const teamSizes = [4, 5, 6, 10];
      const size = teamSizes[randInt(0, teamSizes.length - 1)];
      const teams = students / size;
      const unitStudent = isEn ? 'students' : 'μαθητές';
      const unitPerson = isEn ? 'persons' : 'άτομα';
      const unitTeam = isEn ? 'teams' : 'ομάδες';

      return {
        title: isEn ? 'EQUAL STUDENT TEAMS' : 'ΙΣΟΠΛΗΘΕΙΣ ΟΜΑΔΕΣ ΜΑΘΗΤΩΝ',
        instruction: isEn ? 'Calculate how many teams will be formed:' : 'Υπολογίστε πόσες ομάδες θα δημιουργηθούν:',
        text: isEn
          ? `In an athletic event, ${students} students participate. The coach wants to form teams of ${size} students each. How many equal teams will be formed?`
          : `Σε μια αθλητική εκδήλωση συμμετέχουν ${students} μαθητές. Ο γυμναστής θέλει να σχηματίσει ομάδες των ${size} ατόμων. Πόσες ακριβώς ισοπληθείς ομάδες θα δημιουργηθούν;`,
        tableData: {
          col1: isEn ? 'Total Students' : 'Συνολικοί Μαθητές',
          col2: isEn ? 'Per Team' : 'Άτομα ανά Ομάδα',
          r1: [`${students} ${unitStudent}`, `${size} ${unitPerson}`],
          r2: [isEn ? 'Division' : 'Διαίρεση', `${teams} ${unitTeam}`]
        },
        correctVal: teams,
        correctStr: String(teams),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">${size} is a divisor of ${students}, so: <span>${renderFraction(students, size)} ＝ <strong>${teams}</strong> equal teams</span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το ${size} είναι διαιρέτης του ${students}, άρα: <span>${renderFraction(students, size)} ＝ <strong>${teams}</strong> ισοπληθείς ομάδες</span>.</div>`
      };
    }
  },
  {
    id: 'p_div_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const candies = 72;
      const bagsPossible = [6, 8, 9, 12];
      const bag = bagsPossible[randInt(0, bagsPossible.length - 1)];
      const perBag = candies / bag;
      const unitCandy = isEn ? 'candies' : 'καραμέλες';
      const unitBag = isEn ? 'bags' : 'σακουλάκια';

      return {
        title: isEn ? 'PACKAGING CANDIES' : 'ΣΥΣΚΕΥΑΣΙΑ ΚΑΡΑΜΕΛΩΝ',
        instruction: isEn ? 'Calculate how many candies go into each bag:' : 'Υπολογίστε πόσες καραμέλες αντιστοιχούν σε κάθε σακουλάκι:',
        text: isEn
          ? `A confectioner has ${candies} candies and wants to make ${bag} identical bags. How many candies should be in each bag so that none remain?`
          : `Μια ζαχαροπλάστης έχει ${candies} καραμέλες και θέλει να φτιάξει ${bag} ίδια σακουλάκια. Πόσες καραμέλες πρέπει να βάλει σε κάθε σακουλάκι για να μη μείνει καμία;`,
        tableData: {
          col1: isEn ? 'Total Candies' : 'Σύνολο Καραμελών',
          col2: isEn ? 'Bags' : 'Σακουλάκια',
          r1: [`${candies} ${unitCandy}`, `${bag} ${unitBag}`],
          r2: [isEn ? 'Division' : 'Διαίρεση', `${perBag} ${isEn ? 'candies / bag' : 'καραμέλες / σακουλάκι'}`]
        },
        correctVal: perBag,
        correctStr: String(perBag),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">${bag} is a divisor of ${candies}, therefore: <span>${renderFraction(candies, bag)} ＝ <strong>${perBag}</strong> candies per bag</span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το ${bag} είναι διαιρέτης του ${candies}, επομένως: <span>${renderFraction(candies, bag)} ＝ <strong>${perBag}</strong> καραμέλες ανά σακουλάκι</span>.</div>`
      };
    }
  },
  {
    id: 'p_div_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const books = 84;
      const shelvesPossible = [4, 6, 7, 12];
      const shelf = shelvesPossible[randInt(0, shelvesPossible.length - 1)];
      const perShelf = books / shelf;
      const unitBook = isEn ? 'books' : 'βιβλία';
      const unitShelf = isEn ? 'shelves' : 'ράφια';

      return {
        title: isEn ? 'ARRANGING BOOKS ON SHELVES' : 'ΤΟΠΟΘΕΤΗΣΗ ΒΙΒΛΙΩΝ ΣΕ ΡΑΦΙΑ',
        instruction: isEn ? 'Calculate how many books go on each shelf:' : 'Υπολογίστε πόσα βιβλία μπαίνουν σε κάθε ράφι:',
        text: isEn
          ? `A library has ${books} books and wants to arrange them equally on ${shelf} shelves. How many books will be placed on each shelf without any left over?`
          : `Μια βιβλιοθήκη έχει ${books} βιβλία και θέλει να τα τοποθετήσει ισόποσα σε ${shelf} ράφια. Πόσα βιβλία θα έχει κάθε ράφι χωρίς να περισσέψει κανένα;`,
        tableData: {
          col1: isEn ? 'Total Books' : 'Σύνολο Βιβλίων',
          col2: isEn ? 'Shelves' : 'Ράφια',
          r1: [`${books} ${unitBook}`, `${shelf} ${unitShelf}`],
          r2: [isEn ? 'Division' : 'Διαίρεση', `${perShelf} ${isEn ? 'books / shelf' : 'βιβλία / ράφι'}`]
        },
        correctVal: perShelf,
        correctStr: String(perShelf),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">${shelf} divides ${books} exactly: <span>${renderFraction(books, shelf)} ＝ <strong>${perShelf}</strong> books per shelf</span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το ${shelf} διαιρεί ακριβώς το ${books}: <span>${renderFraction(books, shelf)} ＝ <strong>${perShelf}</strong> βιβλία ανά ράφι</span>.</div>`
      };
    }
  },
  {
    id: 'p_div_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const sweets = 96;
      const boxesPossible = [6, 8, 12, 16];
      const box = boxesPossible[randInt(0, boxesPossible.length - 1)];
      const perBox = sweets / box;
      const unitSweet = isEn ? 'chocolates' : 'σοκολατάκια';
      const unitBox = isEn ? 'boxes' : 'κουτιά';

      return {
        title: isEn ? 'BOXES OF CHOCOLATES' : 'ΚΟΥΤΙΑ ΜΕ ΣΟΚΟΛΑΤΑΚΙΑ',
        instruction: isEn ? 'Calculate how many chocolates each box holds:' : 'Υπολογίστε πόσα σοκολατάκια χωράει κάθε κουτί:',
        text: isEn
          ? `In a pastry lab, ${sweets} chocolates are divided equally into ${box} boxes. How many chocolates does each box contain?`
          : `Σε ένα εργαστήριο ζαχαροπλαστικής υπάρχουν ${sweets} σοκολατάκια που μοιράζονται ισόποσα σε ${box} κουτιά. Πόσα σοκολατάκια περιέχει κάθε κουτί;`,
        tableData: {
          col1: isEn ? 'Total' : 'Σύνολο',
          col2: isEn ? 'Boxes' : 'Κουτιά',
          r1: [`${sweets} ${unitSweet}`, `${box} ${unitBox}`],
          r2: [isEn ? 'Division' : 'Διαίρεση', `${perBox} ${isEn ? 'chocolates / box' : 'σοκολατάκια / κουτί'}`]
        },
        correctVal: perBox,
        correctStr: String(perBox),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Because ${box} is a divisor of ${sweets}: <span>${renderFraction(sweets, box)} ＝ <strong>${perBox}</strong> chocolates per box</span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Επειδή το ${box} είναι διαιρέτης του ${sweets}: <span>${renderFraction(sweets, box)} ＝ <strong>${perBox}</strong> σοκολατάκια ανά κουτί</span>.</div>`
      };
    }
  },
  {
    id: 'p_div_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const apples = 90;
      const cratesPossible = [5, 6, 9, 10];
      const crate = cratesPossible[randInt(0, cratesPossible.length - 1)];
      const perCrate = apples / crate;
      const unitApple = isEn ? 'apples' : 'μήλα';
      const unitCrate = isEn ? 'crates' : 'τελάρα';

      return {
        title: isEn ? 'APPLE CRATES' : 'ΤΕΛΑΡΑ ΜΕ ΜΗΛΑ',
        instruction: isEn ? 'Calculate how many apples go into each crate:' : 'Υπολογίστε πόσα μήλα μπαίνουν σε κάθε τελάρο:',
        text: isEn
          ? `A farmer has ${apples} apples and wants to divide them equally into ${crate} crates. How many apples will he put in each crate?`
          : `Ένας αγρότης έχει ${apples} μήλα και θέλει να τα μοιράσει ισόποσα σε ${crate} τελάρα. Πόσα μήλα θα βάλει σε κάθε τελάρο;`,
        tableData: {
          col1: isEn ? 'Total Apples' : 'Σύνολο Μήλων',
          col2: isEn ? 'Crates' : 'Τελάρα',
          r1: [`${apples} ${unitApple}`, `${crate} ${unitCrate}`],
          r2: [isEn ? 'Division' : 'Διαίρεση', `${perCrate} ${isEn ? 'apples / crate' : 'μήλα / τελάρο'}`]
        },
        correctVal: perCrate,
        correctStr: String(perCrate),
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">${crate} is a divisor of ${apples}: <span>${renderFraction(apples, crate)} ＝ <strong>${perCrate}</strong> apples in each crate</span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το ${crate} είναι διαιρέτης του ${apples}: <span>${renderFraction(apples, crate)} ＝ <strong>${perCrate}</strong> μήλα σε κάθε τελάρο</span>.</div>`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_div_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const students = 60;
      const teamSizes = [4, 5, 6, 10];
      const size = teamSizes[randInt(0, teamSizes.length - 1)];
      const teams = students / size;
      const unit = isEn ? 'teams' : 'ομάδες';
      const correctStr = `${teams} ${unit}`;
      const fake1 = `${teams + 2} ${unit}`;
      const fake2 = `${Math.max(1, teams - 2)} ${unit}`;
      const fake3 = `${teams + 4} ${unit}`;

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${teams + step * 3} ${unit}`
      );

      return {
        title: isEn ? 'COMPLEX GROUPING PROBLEM' : 'ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΟΜΑΔΟΠΟΙΗΣΗΣ',
        instruction: isEn ? 'Select the correct number of teams:' : 'Επιλέξτε τον σωστό αριθμό ομάδων:',
        text: isEn
          ? `In a sporting competition, ${students} students participate. The teacher wants to organize teams of ${size} students each. Exactly how many equal teams will be formed?`
          : `Σε μια αθλητική εκδήλωση συμμετέχουν ${students} μαθητές. Ο γυμναστής θέλει να σχηματίσει ομάδες των ${size} ατόμων. Πόσες ακριβώς ισοπληθείς ομάδες θα δημιουργηθούν;`,
        tableData: {
          col1: isEn ? 'Total Students' : 'Συνολικοί Μαθητές',
          col2: isEn ? 'Per Team' : 'Άτομα ανά Ομάδα',
          r1: [isEn ? `${students} students` : `${students} μαθητές`, isEn ? `${size} persons` : `${size} άτομα`],
          r2: [isEn ? 'Division' : 'Διαίρεση', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">${size} is a divisor of ${students}, so: <span>${renderFraction(students, size)} ＝ <strong>${correctStr}</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το ${size} είναι διαιρέτης του ${students}, άρα: <span>${renderFraction(students, size)} ＝ <strong>${correctStr}</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_div_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const flowers = 48;
      const vasesPossible = [3, 4, 6, 8];
      const vase = vasesPossible[randInt(0, vasesPossible.length - 1)];
      const perVase = flowers / vase;
      const unit = isEn ? 'roses' : 'τριαντάφυλλα';
      const correctStr = `${perVase} ${unit}`;
      const fake1 = `${perVase + 2} ${unit}`;
      const fake2 = `${Math.max(1, perVase - 2)} ${unit}`;
      const fake3 = `${perVase + 4} ${unit}`;

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${perVase + step * 3} ${unit}`
      );

      return {
        title: isEn ? 'DISTRIBUTING FLOWERS INTO VASES' : 'ΚΑΤΑΝΟΜΗ ΛΟΥΛΟΥΔΙΩΝ ΣΕ ΒΑΖΑ',
        instruction: isEn ? 'Select how many roses will go into each vase:' : 'Επιλέξτε πόσα τριαντάφυλλα θα μπουν σε κάθε βάζο:',
        text: isEn
          ? `A florist has ${flowers} roses and wants to arrange them equally into ${vase} vases without any remaining. How many roses will be placed in each vase?`
          : `Ένα ανθοπωλείο έχει ${flowers} τριαντάφυλλα και θέλει να τα μοιράσει ισόποσα σε ${vase} βάζα χωρίς να περισσέψει κανένα. Πόσα τριαντάφυλλα θα βάλει σε κάθε βάζο;`,
        tableData: {
          col1: isEn ? 'Total Roses' : 'Σύνολο Τριαντάφυλλων',
          col2: isEn ? 'Number of Vases' : 'Πλήθος Βάζων',
          r1: [isEn ? `${flowers} roses` : `${flowers} τριαντάφυλλα`, isEn ? `${vase} vases` : `${vase} βάζα`],
          r2: [isEn ? 'Division' : 'Διαίρεση', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">${vase} is a divisor of ${flowers}: <span>${renderFraction(flowers, vase)} ＝ <strong>${correctStr}</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το ${vase} είναι διαιρέτης του ${flowers}: <span>${renderFraction(flowers, vase)} ＝ <strong>${correctStr}</strong></span>.</div>`
      };
    }
  },
  {
    id: 'p_div_hard_3',
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
        title: isEn ? 'SHARING CANDIES INTO BAGS' : 'ΜΟΙΡΑΣΙΑ ΚΑΡΑΜΕΛΩΝ ΣΕ ΣΑΚΟΥΛΑΚΙΑ',
        instruction: isEn ? 'Select how many candies each bag contains:' : 'Επιλέξτε πόσες καραμέλες θα περιέχει κάθε σακουλάκι:',
        text: isEn
          ? `A baker has ${candies} candies and wants to prepare ${bag} identical gift bags. How many candies must she place in each bag so that none remain?`
          : `Μια ζαχαροπλάστης έχει ${candies} καραμέλες και θέλει να φτιάξει ${bag} ίδια σακουλάκια. Πόσες καραμέλες πρέπει να βάλει σε κάθε σακουλάκι για να μη μείνει καμία;`,
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
    id: 'p_div_hard_4',
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
        title: isEn ? 'ALLOCATING BOOKS TO SHELVES' : 'ΚΑΤΑΝΟΜΗ ΒΙΒΛΙΩΝ ΣΕ ΡΑΦΙΑ',
        instruction: isEn ? 'Select how many books will be on each shelf:' : 'Επιλέξτε πόσα βιβλία θα έχει κάθε ράφι:',
        text: isEn
          ? `A library has ${books} books and wants to divide them equally onto ${shelf} shelves. How many books will be on each shelf without any left over?`
          : `Μια βιβλιοθήκη έχει ${books} βιβλία και θέλει να τα τοποθετήσει ισόποσα σε ${shelf} ράφια. Πόσα βιβλία θα έχει κάθε ράφι χωρίς να περισσέψει κανένα;`,
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
    id: 'p_div_hard_5',
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
        title: isEn ? 'PACKING CHOCOLATES INTO BOXES' : 'ΣΥΣΚΕΥΑΣΙΑ ΣΟΚΟΛΑΤΑΣ ΣΕ ΚΟΥΤΙΑ',
        instruction: isEn ? 'Select how many chocolates each box contains:' : 'Επιλέξτε πόσα σοκολατάκια περιέχει κάθε κουτί:',
        text: isEn
          ? `In a confectionery lab there are ${sweets} chocolates shared equally into ${box} boxes. How many chocolates does each box hold?`
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
    id: 'p_div_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const apples = 90;
      const cratesPossible = [5, 6, 9, 10];
      const crate = cratesPossible[randInt(0, cratesPossible.length - 1)];
      const perCrate = apples / crate;
      const unit = isEn ? 'apples' : 'μήλα';
      const correctStr = `${perCrate} ${unit}`;
      const fake1 = `${perCrate + 3} ${unit}`;
      const fake2 = `${Math.max(1, perCrate - 3)} ${unit}`;
      const fake3 = `${perCrate + 5} ${unit}`;

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${perCrate + step * 4} ${unit}`
      );

      return {
        title: isEn ? 'PARTITIONING APPLES INTO CRATES' : 'ΜΟΙΡΑΣΜΑ ΜΗΛΩΝ ΣΕ ΤΕΛΑΡΑ',
        instruction: isEn ? 'Select how many apples go into each crate:' : 'Επιλέξτε πόσα μήλα μπαίνουν σε κάθε τελάρο:',
        text: isEn
          ? `A farmer has ${apples} apples and wants to divide them equally into ${crate} crates. How many apples will he put in each crate?`
          : `Ένας αγρότης έχει ${apples} μήλα και θέλει να τα μοιράσει ισόποσα σε ${crate} τελάρα. Πόσα μήλα θα βάλει σε κάθε τελάρο;`,
        tableData: {
          col1: isEn ? 'Total Apples' : 'Σύνολο Μήλων',
          col2: isEn ? 'Crates' : 'Τελάρα',
          r1: [isEn ? `${apples} apples` : `${apples} μήλα`, isEn ? `${crate} crates` : `${crate} τελάρα`],
          r2: [isEn ? 'Division' : 'Διαίρεση', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">${crate} is a divisor of ${apples}: <span>${renderFraction(apples, crate)} ＝ <strong>${correctStr}</strong></span>.</div>`
          : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το ${crate} είναι διαιρέτης του ${apples}: <span>${renderFraction(apples, crate)} ＝ <strong>${correctStr}</strong></span>.</div>`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const qList = [];
  const itemsPool = REAL_WORLD_PRESETS[locale] || REAL_WORLD_PRESETS.el;
  const shuffledItems = shuffle(itemsPool);

  // Q1 (Input - Decimal): Πλήθος διαιρετών ενός αριθμού
  {
    const q1Pool = [12, 16, 18, 20, 24, 28, 30, 36];
    const q1Num = q1Pool[randInt(0, q1Pool.length - 1)];
    const q1Divs = getDivisors(q1Num);
    const q1Correct = q1Divs.length;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 1 • NUMBER OF DIVISORS' : 'ΕΡΩΤΗΣΗ 1 • ΠΛΗΘΟΣ ΔΙΑΙΡΕΤΩΝ',
      instruction: isEn ? 'Find the total number of divisors of the number (integer):' : 'Βρείτε το πλήθος όλων των διαιρετών του αριθμού (ακέραιος):',
      prompt: isEn ? `How many total divisors does the number ${q1Num} have?` : `Πόσους συνολικά διαιρέτες έχει ο αριθμός ${q1Num};`,
      correctVal: q1Correct,
      correctStr: String(q1Correct),
      explanation: isEn
        ? `The divisors of ${q1Num} are: ${q1Divs.join(', ')} (${q1Correct} total divisors).`
        : `Οι διαιρέτες του ${q1Num} είναι οι: ${q1Divs.join(', ')} (συνολικά ${q1Correct} διαιρέτες).`
    });
  }

  // Q2 (Input - Decimal): Εύρεση του μεγαλύτερου διαιρέτη (εκτός του εαυτού του)
  {
    const q2Pool = [14, 18, 20, 22, 26, 28, 32, 34, 38, 40];
    const q2Num = q2Pool[randInt(0, q2Pool.length - 1)];
    const q2Divs = getDivisors(q2Num);
    const q2CorrectVal = q2Divs[q2Divs.length - 2];

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 2 • GREATEST PROPER DIVISOR' : 'ΕΡΩΤΗΣΗ 2 • ΜΕΓΑΛΥΤΕΡΟΣ ΓΝΗΣΙΟΣ ΔΙΑΙΡΕΤΗΣ',
      instruction: isEn ? 'Find the greatest divisor other than the number itself (integer):' : 'Βρείτε τον μεγαλύτερο διαιρέτη εκτός από τον ίδιο τον αριθμό (ακέραιος):',
      prompt: isEn ? `What is the greatest divisor of ${q2Num} (excluding the number itself)?` : `Ποιος είναι ο μεγαλύτερος διαιρέτης του ${q2Num} (εκτός από τον ίδιο τον αριθμό);`,
      correctVal: q2CorrectVal,
      correctStr: String(q2CorrectVal),
      explanation: isEn
        ? `The divisors of ${q2Num} are: ${q2Divs.join(', ')}. The greatest proper divisor of ${q2Num} is ${q2CorrectVal}.`
        : `Οι διαιρέτες του ${q2Num} είναι: ${q2Divs.join(', ')}. Ο μεγαλύτερος διαιρέτης εκτός του ${q2Num} είναι το ${q2CorrectVal}.`
    });
  }

  // Q3 (MCQ): Έλεγχος αν ένας αριθμός είναι διαιρέτης
  {
    const q3Base = randInt(4, 9) * randInt(3, 8);
    const q3Divs = getDivisors(q3Base);
    const q3ValidDiv = q3Divs[randInt(1, q3Divs.length - 2)];
    const q3NonDivs = [2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 17, 19].filter((d) => q3Base % d !== 0);
    const q3Wrongs = shuffle(q3NonDivs).slice(0, 3);

    const options = makeUniqueFourOptions(
      String(q3ValidDiv),
      q3Wrongs.map(String),
      (step) => String(q3Base + step)
    );

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • IDENTIFYING A DIVISOR' : 'ΕΡΩΤΗΣΗ 3 • ΑΝΑΓΝΩΡΙΣΗ ΔΙΑΙΡΕΤΗ',
      instruction: isEn ? 'Select which of the following numbers is a divisor:' : 'Επιλέξτε ποιος από τους παρακάτω αριθμούς είναι διαιρέτης:',
      prompt: isEn ? `Which of the following numbers is a divisor of ${q3Base}?` : `Ποιος από τους παρακάτω αριθμούς είναι διαιρέτης του ${q3Base};`,
      options,
      correctText: String(q3ValidDiv),
      explanation: isEn
        ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">${q3ValidDiv} divides ${q3Base} exactly: <span>${renderFraction(q3Base, q3ValidDiv)} ＝ <strong>${q3Base / q3ValidDiv}</strong></span>, so it is a divisor.</div>`
        : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το ${q3ValidDiv} διαιρεί ακριβώς το ${q3Base}: <span>${renderFraction(q3Base, q3ValidDiv)} ＝ <strong>${q3Base / q3ValidDiv}</strong></span>, άρα είναι διαιρέτης του.</div>`
    });
  }

  // Q4 (MCQ): Ποιο από τα σύνολα περιέχει ΟΛΟΥΣ τους διαιρέτες
  {
    const q4Pool = [12, 18, 20, 24, 30];
    const q4Num = q4Pool[randInt(0, q4Pool.length - 1)];
    const q4CorrectDivs = getDivisors(q4Num);
    const q4CorrectStr = `{ ${q4CorrectDivs.join(', ')} }`;

    const q4MissingOne = q4CorrectDivs.filter((_, i) => i !== 1);
    const q4Wrong1 = `{ ${q4MissingOne.join(', ')} }`;

    const nonDivCandidate1 = [7, 8, 9, 11, 13, 14, 16].find((x) => q4Num % x !== 0 && !q4CorrectDivs.includes(x)) || (q4Num + 2);
    const q4WithExtra = [...q4CorrectDivs, nonDivCandidate1].sort((a, b) => a - b);
    const q4Wrong2 = `{ ${q4WithExtra.join(', ')} }`;

    const nonDivCandidate2 = [7, 8, 9, 11, 13, 14, 15, 17].filter((x) => q4Num % x !== 0 && !q4CorrectDivs.includes(x) && x !== nonDivCandidate1)[0] || (q4Num - 1);
    const q4Replaced = q4CorrectDivs.map((d, i) => (i === 1 ? nonDivCandidate2 : d)).sort((a, b) => a - b);
    const q4Wrong3 = `{ ${q4Replaced.join(', ')} }`;

    const options = makeUniqueFourOptions(
      q4CorrectStr,
      [q4Wrong1, q4Wrong2, q4Wrong3],
      (step) => `{ ${[...q4CorrectDivs, q4Num + step].sort((a, b) => a - b).join(', ')} }`
    );

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • DIVISORS SET' : 'ΕΡΩΤΗΣΗ 4 • ΣΥΝΟΛΟ ΔΙΑΙΡΕΤΩΝ',
      instruction: isEn ? 'Select the set containing all divisors:' : 'Επιλέξτε το σύνολο που περιέχει όλους τους διαιρέτες:',
      prompt: isEn ? `Which set contains ALL divisors of the number ${q4Num}?` : `Ποιο σύνολο περιέχει ΟΛΟΥΣ τους διαιρέτες του αριθμού ${q4Num};`,
      options,
      correctText: q4CorrectStr,
      explanation: isEn
        ? `All numbers that divide ${q4Num} exactly are: ${q4CorrectStr}.`
        : `Όλοι οι αριθμοί που διαιρούν ακριβώς το ${q4Num} είναι: ${q4CorrectStr}.`
    });
  }

  // Q5 (MCQ): True / False - Ο αριθμός 1 είναι διαιρέτης όλων των φυσικών
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? 'The number 1 is a divisor of every whole number.'
          : 'The number 1 is a divisor only of odd numbers.')
      : (q5IsTrue
          ? 'Ο αριθμός 1 είναι διαιρέτης κάθε φυσικού αριθμού.'
          : 'Ο αριθμός 1 είναι διαιρέτης μόνο των περιττών αριθμών.');
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
      title: isEn ? 'QUESTION 5 • NUMBER 1 AS A DIVISOR' : 'ΕΡΩΤΗΣΗ 5 • Η ΜΟΝΑΔΑ ΩΣ ΔΙΑΙΡΕΤΗΣ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? 'Correct! The number 1 divides all whole numbers without exception.'
            : 'False! The number 1 divides all whole numbers (both even and odd).')
        : (q5IsTrue
            ? 'Σωστό! Ο αριθμός 1 διαιρεί όλους ανεξαιρέτως τους φυσικούς αριθμούς.'
            : 'Λάθος! Ο αριθμός 1 διαιρεί όλους τους φυσικούς αριθμούς (τόσο τους άρτιους όσο και τους περιττούς).')
    });
  }

  // Q6 (MCQ): True / False - Το πλήθος των διαιρετών είναι πεπερασμένο
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? 'Every whole number has a finite number of divisors.'
          : 'Every whole number has infinitely many divisors.')
      : (q6IsTrue
          ? 'Κάθε φυσικός αριθμός έχει συγκεκριμένο (πεπερασμένο) πλήθος διαιρετών.'
          : 'Κάθε φυσικός αριθμός έχει άπειρους διαιρέτες.');
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
      title: isEn ? 'QUESTION 6 • FINITE NUMBER OF DIVISORS' : 'ΕΡΩΤΗΣΗ 6 • ΠΛΗΘΟΣ ΔΙΑΙΡΕΤΩΝ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? 'Correct! The divisors of a number are finite (none can be greater than the number itself).'
            : 'False! Divisors are finite, in contrast to multiples which are infinite.')
        : (q6IsTrue
            ? 'Σωστό! Οι διαιρέτες ενός αριθμού είναι πεπερασμένοι (δεν μπορεί να είναι μεγαλύτεροι από τον ίδιο τον αριθμό).'
            : 'Λάθος! Οι διαιρέτες είναι πεπερασμένοι, σε αντίθεση με τα πολλαπλάσια που είναι άπειρα.')
    });
  }

  // Q7 (Input - Decimal): Οπτικό μοίρασμα σε ισόποσες ομάδες
  {
    const q7ItemsCount = [12, 16, 18, 20, 24][randInt(0, 4)];
    const q7Divs = getDivisors(q7ItemsCount).filter((d) => d > 1 && d < q7ItemsCount);
    const q7ChosenDiv = q7Divs[randInt(0, q7Divs.length - 1)];
    const q7CorrectGroups = q7ItemsCount / q7ChosenDiv;

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 7 • VISUAL DISTRIBUTION' : 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΚΑΤΑΝΟΜΗ',
      instruction: isEn ? 'Calculate the number of equal groups formed (integer):' : 'Υπολογίστε τον αριθμό των ισοπληθών ομάδων (ακέραιος):',
      prompt: isEn
        ? `If we divide ${q7ItemsCount} items into groups of ${q7ChosenDiv}, how many full groups are formed?`
        : `Αν μοιράσουμε ${q7ItemsCount} στοιχεία σε ομάδες των ${q7ChosenDiv}, πόσες πλήρεις ομάδες σχηματίζονται;`,
      correctVal: q7CorrectGroups,
      correctStr: String(q7CorrectGroups),
      explanation: isEn
        ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Dividing ${q7ItemsCount} items into groups of ${q7ChosenDiv} forms exactly: <span>${renderFraction(q7ItemsCount, q7ChosenDiv)} ＝ <strong>${q7CorrectGroups}</strong> equal groups</span>.</div>`
        : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Μοιράζοντας τα ${q7ItemsCount} στοιχεία σε ομάδες των ${q7ChosenDiv}, σχηματίζονται ακριβώς: <span>${renderFraction(q7ItemsCount, q7ChosenDiv)} ＝ <strong>${q7CorrectGroups}</strong> ισοπληθείς ομάδες</span>.</div>`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας (Ισόποσο μοίρασμα χωρίς υπόλοιπο)
  {
    const q8Preset = shuffledItems[0];
    const q8Total = [24, 30, 36, 40][randInt(0, 3)];
    const q8AllDivs = getDivisors(q8Total).filter((d) => d > 2 && d < 12);
    const q8Possible = q8AllDivs[randInt(0, q8AllDivs.length - 1)];
    const q8Impossible = [7, 8, 9, 11, 13, 14].filter((d) => q8Total % d !== 0);
    const q8Wrongs = shuffle(q8Impossible).slice(0, 3);

    const correctStr = `${q8Possible} ${q8Preset.unit}`;
    const options = makeUniqueFourOptions(
      correctStr,
      q8Wrongs.map((w) => `${w} ${q8Preset.unit}`),
      (step) => `${q8Possible + step * 3} ${q8Preset.unit}`
    );

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • EVERYDAY SHARING PROBLEM' : 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: isEn ? 'Select the correct equal division without remainder:' : 'Επιλέξτε τη σωστή ισόποση κατανομή χωρίς υπόλοιπο:',
      prompt: isEn
        ? `We have ${q8Total} ${q8Preset.item}. ${q8Preset.questionPrefix} ${q8Preset.unit} can we share them equally with none remaining?`
        : `Έχουμε ${q8Total} ${q8Preset.item}. ${q8Preset.questionPrefix} ${q8Preset.unit} μπορούμε να τα μοιράσουμε ισόποσα χωρίς να περισσέψει κανένα;`,
      options,
      correctText: correctStr,
      explanation: isEn
        ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">${q8Possible} is a divisor of ${q8Total}: <span>${renderFraction(q8Total, q8Possible)} ＝ <strong>${q8Total / q8Possible}</strong></span>, so the sharing leaves zero remainder.</div>`
        : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Το ${q8Possible} είναι διαιρέτης του ${q8Total}: <span>${renderFraction(q8Total, q8Possible)} ＝ <strong>${q8Total / q8Possible}</strong></span>, επομένως το μοίρασμα γίνεται χωρίς υπόλοιπο.</div>`
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
      type: 'decimal_input',
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
    pageTitle: "Ασκήσεις: Οι Διαιρέτες ενός Αριθμού - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές διαδραστικές ασκήσεις και προβλήματα στους διαιρέτες φυσικών αριθμών για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 13 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Οι Διαιρέτες ενός Αριθμού",
    heroDesc: "10 απαιτητικές δραστηριότητες εύρεσης διαιρετών, συνόλων διαίρεσης, ισόποσης κατανομής και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.",
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
    pageTitle: "Exercises: Divisors of a Number - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems on identifying divisors, factor sets, and equal partitioning for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "CHAPTER 13 • GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Divisors of a Number",
    heroDesc: "10 practice problems exploring divisors, divisor sets, equal group sharing, and real-world word problems.",
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

export default function DiairetesExercisesPage() {
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
    if (q.type === 'decimal_input') {
      const userValRaw = (answers[`q_${q.id}`] || '').trim();
      if (!userValRaw) return false;
      const userVal = parseFloat(userValRaw);
      return !isNaN(userVal) && Math.abs(userVal - q.correctVal) < 0.05;
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
          href="/st-dimotikou/13-diairetes"
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
                  {q.type === 'decimal_input' && (
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
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
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
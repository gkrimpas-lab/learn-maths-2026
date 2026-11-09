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

const renderFraction = (num, den) =>
  `<span class="inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">` +
  `<span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${num}</span>` +
  `<span class="pt-0.5 break-all">${den}</span>` +
  `</span>`;

function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set([String(correct)]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && String(opt).trim() !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  let offset = 1;
  while (unique.size < 4) {
    unique.add(`${String(correct)} (${offset})`);
    offset++;
  }
  return shuffle(Array.from(unique)).map((text) => ({
    text,
    isCorrect: text === String(correct)
  }));
}

const REAL_WORLD_MULTIPLICATIONS = {
  el: [
    { item: 'κουτιά με μαρκαδόρους', unit: 'μαρκαδόροι' },
    { item: 'πακέτα με τετράδια', unit: 'τετράδια' },
    { item: 'κιβώτια με χυμούς', unit: 'μπουκάλια' },
    { item: 'σειρές καθισμάτων στο θέατρο', unit: 'θέσεις' },
    { item: 'δίσκοι με φρέσκα αυγά', unit: 'αυγά' },
    { item: 'σακούλες με καραμέλες', unit: 'καραμέλες' },
    { item: 'ράφια με βιβλία στη βιβλιοθήκη', unit: 'βιβλία' },
    { item: 'παλέτες με τούβλα', unit: 'τούβλα' },
    { item: 'κούτες με μπάλες μπάσκετ', unit: 'μπάλες' },
    { item: 'δοχεία με ελιές', unit: 'κιλά' },
    { item: 'κουτιά με σοκολατάκια', unit: 'σοκολατάκια' },
    { item: 'παρτέρια με τριαντάφυλλα', unit: 'λουλούδια' },
    { item: 'δεμάτια με σανό', unit: 'κιλά' },
    { item: 'κιβώτια με μήλα', unit: 'μήλα' },
    { item: 'πακέτα με αυτοκόλλητα', unit: 'αυτοκόλλητα' },
    { item: 'σειρές με ηλιακά πάνελ', unit: 'πάνελ' },
    { item: 'κιβώτια με αναψυκτικά', unit: 'κουτάκια' },
    { item: 'σακιά με αλεύρι', unit: 'κιλά' },
    { item: 'κουτιά με ξυλομπογιές', unit: 'ξυλομπογιές' },
    { item: 'τελάρα με πορτοκάλια', unit: 'πορτοκάλια' },
    { item: 'πακέτα με σελιδοδείκτες', unit: 'σελιδοδείκτες' }
  ],
  en: [
    { item: 'boxes of markers', unit: 'markers' },
    { item: 'packs of notebooks', unit: 'notebooks' },
    { item: 'crates of juice', unit: 'bottles' },
    { item: 'theater seating rows', unit: 'seats' },
    { item: 'cartons of fresh eggs', unit: 'eggs' },
    { item: 'bags of candy', unit: 'candies' },
    { item: 'library bookshelves', unit: 'books' },
    { item: 'pallets of bricks', unit: 'bricks' },
    { item: 'boxes of basketballs', unit: 'balls' },
    { item: 'tubs of olives', unit: 'kg' },
    { item: 'boxes of chocolates', unit: 'chocolates' },
    { item: 'rose flowerbeds', unit: 'flowers' },
    { item: 'bales of hay', unit: 'kg' },
    { item: 'crates of apples', unit: 'apples' },
    { item: 'packs of stickers', unit: 'stickers' },
    { item: 'arrays of solar panels', unit: 'panels' },
    { item: 'cases of soda', unit: 'cans' },
    { item: 'sacks of flour', unit: 'kg' },
    { item: 'boxes of colored pencils', unit: 'pencils' },
    { item: 'crates of oranges', unit: 'oranges' },
    { item: 'packs of bookmarks', unit: 'bookmarks' }
  ]
};

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_mul_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const boxes = randInt(15, 35);
      const itemsPerBox = 24;
      const total = boxes * itemsPerBox;
      const totalStr = `${formatNumber(total, locale)} ${isEn ? 'bottles' : 'μπουκάλια'}`;

      return {
        title: isEn ? 'CRATES OF JUICE' : 'ΚΙΒΩΤΙΑ ΜΕ ΧΥΜΟΥΣ',
        instruction: isEn ? 'Calculate the total number of bottles (integer without commas):' : 'Υπολογίστε το συνολικό πλήθος των μπουκαλιών (ακέραιος χωρίς τελείες):',
        text: isEn
          ? `A warehouse received ${boxes} crates of juice. If each crate contains ${itemsPerBox} bottles, how many bottles of juice arrived in total?`
          : `Σε μια αποθήκη έφτασαν ${boxes} κιβώτια με χυμούς. Αν κάθε κιβώτιο περιέχει ${itemsPerBox} μπουκάλια, πόσα μπουκάλια χυμού έφτασαν συνολικά;`,
        tableData: {
          col1: isEn ? 'Crates' : 'Κιβώτια',
          col2: isEn ? 'Bottles per crate' : 'Μπουκάλια ανά κιβώτιο',
          r1: [isEn ? `${boxes} crates` : `${boxes} κιβώτια`, isEn ? `${itemsPerBox} bottles` : `${itemsPerBox} μπουκάλια`],
          r2: [isEn ? 'Multiplication' : 'Πολλαπλασιασμός', totalStr]
        },
        correctVal: total,
        correctStr: String(total),
        explanation: isEn
          ? `Multiply: ${boxes} · ${itemsPerBox} ＝ ${totalStr}.`
          : `Πολλαπλασιάζουμε: ${boxes} · ${itemsPerBox} ＝ ${totalStr}.`
      };
    }
  },
  {
    id: 'p_mul_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const rows = randInt(18, 30);
      const seatsPerRow = 25;
      const total = rows * seatsPerRow;
      const totalStr = `${formatNumber(total, locale)} ${isEn ? 'seats' : 'θέσεις'}`;

      return {
        title: isEn ? 'THEATER CAPACITY' : 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΘΕΑΤΡΟΥ',
        instruction: isEn ? 'Calculate the total number of seats (integer):' : 'Υπολογίστε τον συνολικό αριθμό θέσεων (ακέραιος χωρίς τελείες):',
        text: isEn
          ? `A theater has ${rows} rows of seats and each row has ${seatsPerRow} seats. How many seats are there in total?`
          : `Ένα θέατρο έχει ${rows} σειρές καθισμάτων και κάθε σειρά έχει ${seatsPerRow} θέσεις. Πόσες θέσεις έχει συνολικά το θέατρο;`,
        tableData: {
          col1: isEn ? 'Rows' : 'Σειρές',
          col2: isEn ? 'Seats per row' : 'Θέσεις ανά σειρά',
          r1: [isEn ? `${rows} rows` : `${rows} σειρές`, isEn ? `${seatsPerRow} seats` : `${seatsPerRow} θέσεις`],
          r2: [isEn ? 'Multiplication' : 'Πολλαπλασιασμός', totalStr]
        },
        correctVal: total,
        correctStr: String(total),
        explanation: isEn
          ? `Multiply strategically: ${rows} · 25 ＝ (${rows} · 100) : 4 ＝ ${totalStr}.`
          : `Υπολογίζουμε έξυπνα: ${rows} · 25 ＝ (${rows} · 100) : 4 ＝ ${totalStr}.`
      };
    }
  },
  {
    id: 'p_mul_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const price = 45;
      const quantity = randInt(12, 28);
      const total = price * quantity;
      const totalStr = `${formatNumber(total, locale)} €`;

      return {
        title: isEn ? 'PURCHASE OF SPORTS EQUIPMENT' : 'ΑΓΟΡΑ ΑΘΛΗΤΙΚΟΥ ΕΞΟΠΛΙΣΜΟΥ',
        instruction: isEn ? 'Calculate the total cost in euros (€):' : 'Υπολογίστε το συνολικό ποσό σε ευρώ (€):',
        text: isEn
          ? `A school bought ${quantity} basketballs at ${price} € each. How many euros (€) did it pay in total?`
          : `Ένα σχολείο αγόρασε ${quantity} μπάλες μπάσκετ προς ${price} € τη μία. Πόσα ευρώ (€) πλήρωσε συνολικά;`,
        tableData: {
          col1: isEn ? 'Price per ball' : 'Τιμή ανά μπάλα',
          col2: isEn ? 'Quantity' : 'Πλήθος μπαλών',
          r1: [`${price} €`, isEn ? `${quantity} balls` : `${quantity} μπάλες`],
          r2: [isEn ? 'Multiplication' : 'Πολλαπλασιασμός', totalStr]
        },
        correctVal: total,
        correctStr: String(total),
        explanation: isEn
          ? `Multiply: ${quantity} · ${price} ＝ ${totalStr}.`
          : `Πολλαπλασιάζουμε: ${quantity} · ${price} ＝ ${totalStr}.`
      };
    }
  },
  {
    id: 'p_mul_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const sacks = randInt(20, 40);
      const kgPerSack = 50;
      const total = sacks * kgPerSack;
      const totalStr = `${formatNumber(total, locale)} kg`;

      return {
        title: isEn ? 'FLOUR LOAD IN KILOGRAMS' : 'ΦΟΡΤΙΟ ΑΛΕΥΡΙΟΥ ΣΕ ΚΙΛΑ',
        instruction: isEn ? 'Calculate the total weight in kilograms (kg):' : 'Υπολογίστε το συνολικό βάρος σε κιλά (kg):',
        text: isEn
          ? `A bakery received ${sacks} sacks of flour weighing ${kgPerSack} kg each. How many kilograms (kg) of flour were received in total?`
          : `Ένας φούρνος παρέλαβε ${sacks} σακιά αλεύρι των ${kgPerSack} kg το καθένα. Πόσα κιλά (kg) αλεύρι παρέλαβε συνολικά;`,
        tableData: {
          col1: isEn ? 'Sacks' : 'Σακιά',
          col2: isEn ? 'Weight per sack' : 'Βάρος ανά σακί',
          r1: [isEn ? `${sacks} sacks` : `${sacks} σακιά`, `${kgPerSack} kg`],
          r2: [isEn ? 'Product' : 'Γινόμενο', totalStr]
        },
        correctVal: total,
        correctStr: String(total),
        explanation: isEn
          ? `Multiply: ${sacks} · ${kgPerSack} ＝ ${totalStr}.`
          : `Πολλαπλασιάζουμε: ${sacks} · ${kgPerSack} ＝ ${totalStr}.`
      };
    }
  },
  {
    id: 'p_mul_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const boxes = randInt(15, 30);
      const tilesPerBox = 16;
      const total = boxes * tilesPerBox;
      const totalStr = `${formatNumber(total, locale)} ${isEn ? 'tiles' : 'πλακάκια'}`;

      return {
        title: isEn ? 'FLOOR TILES' : 'ΠΛΑΚΑΚΙΑ ΔΑΠΕΔΟΥ',
        instruction: isEn ? 'Calculate the total number of tiles:' : 'Υπολογίστε το συνολικό πλήθος των πλακιδίων:',
        text: isEn
          ? `A builder bought ${boxes} boxes of floor tiles. If each box contains ${tilesPerBox} tiles, how many tiles are there in total?`
          : `Ένας τεχνίτης αγόρασε ${boxes} κουτιά με πλακάκια. Αν κάθε κουτί περιέχει ${tilesPerBox} πλακάκια, πόσα πλακάκια έχει συνολικά;`,
        tableData: {
          col1: isEn ? 'Boxes' : 'Κουτιά',
          col2: isEn ? 'Tiles per box' : 'Πλακάκια ανά κουτί',
          r1: [isEn ? `${boxes} boxes` : `${boxes} κουτιά`, isEn ? `${tilesPerBox} tiles` : `${tilesPerBox} πλακάκια`],
          r2: [isEn ? 'Product' : 'Γινόμενο', totalStr]
        },
        correctVal: total,
        correctStr: String(total),
        explanation: isEn
          ? `Multiply: ${boxes} · ${tilesPerBox} ＝ ${totalStr}.`
          : `Πολλαπλασιάζουμε: ${boxes} · ${tilesPerBox} ＝ ${totalStr}.`
      };
    }
  },
  {
    id: 'p_mul_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const hours = randInt(12, 24);
      const kmPerHour = 85;
      const total = hours * kmPerHour;
      const totalStr = `${formatNumber(total, locale)} km`;

      return {
        title: isEn ? 'TOTAL DISTANCE COVERED' : 'ΣΥΝΟΛΙΚΗ ΔΙΑΝΥΘΕΙΣΑ ΑΠΟΣΤΑΣΗ',
        instruction: isEn ? 'Calculate total distance in kilometers (km):' : 'Υπολογίστε τη συνολική απόσταση σε χιλιόμετρα (km):',
        text: isEn
          ? `A train travels at a constant speed of ${kmPerHour} km/h for ${hours} hours. How many kilometers (km) will it travel in total?`
          : `Ένα τρένο ταξιδεύει με σταθερή ταχύτητα ${kmPerHour} km την ώρα για ${hours} ώρες. Πόσα χιλιόμετρα (km) θα διανύσει συνολικά;`,
        tableData: {
          col1: isEn ? 'Speed' : 'Ταχύτητα',
          col2: isEn ? 'Time' : 'Χρόνος',
          r1: [`${kmPerHour} km/h`, isEn ? `${hours} hours` : `${hours} ώρες`],
          r2: [isEn ? 'Product' : 'Γινόμενο', totalStr]
        },
        correctVal: total,
        correctStr: String(total),
        explanation: isEn
          ? `Multiply speed by time: ${hours} · ${kmPerHour} ＝ ${totalStr}.`
          : `Πολλαπλασιάζουμε την ταχύτητα επί τον χρόνο: ${hours} · ${kmPerHour} ＝ ${totalStr}.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_mul_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const rows = randInt(18, 32);
      const seatsPerRow = 25;
      const total = rows * seatsPerRow;
      const unit = isEn ? 'seats' : 'θέσεις';
      const correctStr = `${formatNumber(total, locale)} ${unit}`;
      const fake1 = `${formatNumber(total + 50, locale)} ${unit}`;
      const fake2 = `${formatNumber(Math.max(10, total - 25), locale)} ${unit}`;
      const fake3 = `${formatNumber(total + 100, locale)} ${unit}`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'CINEMA CAPACITY' : 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΚΙΝΗΜΑΤΟΓΡΑΦΟΥ',
        instruction: isEn ? 'Select the total number of seats:' : 'Επιλέξτε τον συνολικό αριθμό θέσεων:',
        text: isEn
          ? `A movie theater has ${rows} rows of seats and each row has ${seatsPerRow} seats. How many seats are there in total?`
          : `Ένας κινηματογράφος διαθέτει ${rows} σειρές καθισμάτων και κάθε σειρά έχει ${seatsPerRow} θέσεις. Πόσες θέσεις έχει συνολικά ο κινηματογράφος;`,
        tableData: {
          col1: isEn ? 'Rows' : 'Σειρές',
          col2: isEn ? 'Seats per row' : 'Θέσεις ανά σειρά',
          r1: [isEn ? `${rows} rows` : `${rows} σειρές`, isEn ? `${seatsPerRow} seats` : `${seatsPerRow} θέσεις`],
          r2: [isEn ? 'Product' : 'Γινόμενο', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Calculate strategically: ${rows} · 25 ＝ (${rows} · 100) : 4 ＝ ${correctStr}.`
          : `Υπολογίζουμε έξυπνα: ${rows} · 25 ＝ (${rows} · 100) : 4 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mul_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const price = randInt(18, 35);
      const quantity = randInt(25, 45);
      const total = price * quantity;
      const correctStr = `${formatNumber(total, locale)} €`;
      const fake1 = `${formatNumber(total + 100, locale)} €`;
      const fake2 = `${formatNumber(Math.max(50, total - 50), locale)} €`;
      const fake3 = `${formatNumber(total + 150, locale)} €`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'TOTAL TEXTBOOK COST' : 'ΣΥΝΟΛΙΚΟ ΚΟΣΤΟΣ ΣΧΟΛΙΚΩΝ ΒΙΒΛΙΩΝ',
        instruction: isEn ? 'Select the total cost in euros (€):' : 'Επιλέξτε το συνολικό κόστος σε ευρώ (€):',
        text: isEn
          ? `A library purchased ${quantity} copies of an encyclopedia at ${price} € each. How many euros (€) did the library pay in total?`
          : `Μια βιβλιοθήκη αγόρασε ${quantity} αντίτυπα μιας εγκυκλοπαίδειας προς ${price} € το καθένα. Πόσα ευρώ (€) πλήρωσε συνολικά η βιβλιοθήκη;`,
        tableData: {
          col1: isEn ? 'Price per copy' : 'Τιμή ανά αντίτυπο',
          col2: isEn ? 'Quantity' : 'Πλήθος αντιτύπων',
          r1: [`${price} €`, isEn ? `${quantity} copies` : `${quantity} αντίτυπα`],
          r2: [isEn ? 'Cost' : 'Κόστος', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Multiply copies by price: ${quantity} · ${price} ＝ ${correctStr}.`
          : `Πολλαπλασιάζουμε τα αντίτυπα με την τιμή: ${quantity} · ${price} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mul_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const boxes = randInt(25, 50);
      const bottlesPerBox = 24;
      const total = boxes * bottlesPerBox;
      const unit = isEn ? 'bottles' : 'μπουκάλια';
      const correctStr = `${formatNumber(total, locale)} ${unit}`;
      const fake1 = `${formatNumber(total + 24, locale)} ${unit}`;
      const fake2 = `${formatNumber(Math.max(24, total - 48), locale)} ${unit}`;
      const fake3 = `${formatNumber(total + 96, locale)} ${unit}`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'BEVERAGE WAREHOUSING' : 'ΑΠΟΘΗΚΕΥΣΗ ΑΝΑΨΥΚΤΙΚΩΝ',
        instruction: isEn ? 'Select the total number of bottles:' : 'Επιλέξτε το συνολικό πλήθος των μπουκαλιών:',
        text: isEn
          ? `A food warehouse received ${boxes} cases of beverages. If each case contains ${bottlesPerBox} bottles, how many bottles were received in total?`
          : `Μια αποθήκη τροφίμων παρέλαβε ${boxes} κιβώτια με αναψυκτικά. Αν κάθε κιβώτιο περιέχει ${bottlesPerBox} μπουκάλια, πόσα μπουκάλια αναψυκτικού παρελήφθησαν συνολικά;`,
        tableData: {
          col1: isEn ? 'Cases' : 'Κιβώτια',
          col2: isEn ? 'Bottles per case' : 'Μπουκάλια ανά κιβώτιο',
          r1: [isEn ? `${boxes} cases` : `${boxes} κιβώτια`, isEn ? `${bottlesPerBox} bottles` : `${bottlesPerBox} μπουκάλια`],
          r2: [isEn ? 'Total' : 'Σύνολο', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Multiply: ${boxes} · ${bottlesPerBox} ＝ ${correctStr}.`
          : `Πολλαπλασιάζουμε: ${boxes} · ${bottlesPerBox} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mul_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const trees = randInt(35, 65);
      const kgPerTree = 40;
      const total = trees * kgPerTree;
      const correctStr = `${formatNumber(total, locale)} kg`;
      const fake1 = `${formatNumber(total + 200, locale)} kg`;
      const fake2 = `${formatNumber(Math.max(100, total - 200), locale)} kg`;
      const fake3 = `${formatNumber(total + 400, locale)} kg`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'OLIVE HARVEST IN KILOGRAMS' : 'ΣΟΔΕΙΑ ΕΛΑΙΩΝ ΣΕ ΚΙΛΑ',
        instruction: isEn ? 'Select the total harvest in kilograms (kg):' : 'Επιλέξτε τη συνολική σοδειά σε κιλά (kg):',
        text: isEn
          ? `In an olive grove, olives were harvested from ${trees} olive trees. If each tree yielded an average of ${kgPerTree} kg of olives, what was the total harvest in kilograms (kg)?`
          : `Σε έναν ελαιώνα μαζεύτηκαν οι ελιές από ${trees} ελαιόδεντρα. Αν κάθε δέντρο απέδωσε κατά μέσο όρο ${kgPerTree} kg ελιές, ποια ήταν η συνολική σοδειά σε κιλά (kg);`,
        tableData: {
          col1: isEn ? 'Olive Trees' : 'Ελαιόδεντρα',
          col2: isEn ? 'Kg per tree' : 'Κιλά ανά δέντρο',
          r1: [isEn ? `${trees} trees` : `${trees} δέντρα`, `${kgPerTree} kg`],
          r2: [isEn ? 'Total' : 'Σύνολο', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Multiply: ${trees} · ${kgPerTree} ＝ ${correctStr}.`
          : `Πολλαπλασιάζουμε: ${trees} · ${kgPerTree} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mul_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const packs = randInt(30, 70);
      const barsPerPack = 12;
      const total = packs * barsPerPack;
      const unit = isEn ? 'chocolate bars' : 'σοκολάτες';
      const correctStr = `${formatNumber(total, locale)} ${unit}`;
      const fake1 = `${formatNumber(total + 24, locale)} ${unit}`;
      const fake2 = `${formatNumber(Math.max(12, total - 24), locale)} ${unit}`;
      const fake3 = `${formatNumber(total + 60, locale)} ${unit}`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'CHOCOLATE PACKAGING' : 'ΣΥΣΚΕΥΑΣΙΑ ΣΟΚΟΛΑΤΑΣ',
        instruction: isEn ? 'Select the total number of chocolate bars:' : 'Επιλέξτε το συνολικό πλήθος των σοκολατών:',
        text: isEn
          ? `A factory produced ${packs} packs of chocolates. If each pack contains ${barsPerPack} chocolate bars, how many bars were packed in total?`
          : `Ένα εργοστάσιο παρήγαγε ${packs} πακέτα με σοκολάτες. Αν κάθε πακέτο περιέχει ${barsPerPack} σοκολάτες, πόσες σοκολάτες συσκευάστηκαν συνολικά;`,
        tableData: {
          col1: isEn ? 'Packs' : 'Πακέτα',
          col2: isEn ? 'Bars per pack' : 'Σοκολάτες ανά πακέτο',
          r1: [isEn ? `${packs} packs` : `${packs} πακέτα`, isEn ? `${barsPerPack} bars` : `${barsPerPack} σοκολάτες`],
          r2: [isEn ? 'Total' : 'Σύνολο', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Multiply: ${packs} · ${barsPerPack} ＝ ${correctStr}.`
          : `Πολλαπλασιάζουμε: ${packs} · ${barsPerPack} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_mul_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const days = randInt(15, 30);
      const fuelPerDay = 35;
      const total = days * fuelPerDay;
      const correctStr = `${formatNumber(total, locale)} L`;
      const fake1 = `${formatNumber(total + 70, locale)} L`;
      const fake2 = `${formatNumber(Math.max(35, total - 70), locale)} L`;
      const fake3 = `${formatNumber(total + 140, locale)} L`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'FLEET FUEL CONSUMPTION' : 'ΚΑΤΑΝΑΛΩΣΗ ΚΑΥΣΙΜΟΥ ΣΤΟΛΟΥ',
        instruction: isEn ? 'Select the total consumption in liters (L):' : 'Επιλέξτε τη συνολική κατανάλωση σε λίτρα (L):',
        text: isEn
          ? `A bus consumes on average ${fuelPerDay} L of diesel fuel per day. How many liters (L) of fuel will it consume in total over ${days} consecutive operating days?`
          : `Ένα λεωφορείο καταναλώνει κατά μέσο όρο ${fuelPerDay} L πετρέλαιο την ημέρα. Πόσα λίτρα (L) καυσίμου θα καταναλώσει συνολικά σε ${days} ημέρες συνεχούς λειτουργίας;`,
        tableData: {
          col1: isEn ? 'Days' : 'Ημέρες',
          col2: isEn ? 'Daily consumption' : 'Κατανάλωση ανά ημέρα',
          r1: [isEn ? `${days} days` : `${days} ημέρες`, `${fuelPerDay} L`],
          r2: [isEn ? 'Total' : 'Σύνολο', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Multiply days by daily consumption: ${days} · ${fuelPerDay} ＝ ${correctStr}.`
          : `Πολλαπλασιάζουμε τις ημέρες με την ημερήσια κατανάλωση: ${days} · ${fuelPerDay} ＝ ${correctStr}.`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const qList = [];
  const itemsPool = REAL_WORLD_MULTIPLICATIONS[locale] || REAL_WORLD_MULTIPLICATIONS.el;
  const shuffledItems = shuffle(itemsPool);

  // Q1 (Input - Decimal): Υπολογισμός Γινομένου
  {
    const q1A = randInt(15, 85);
    const q1Mult = [10, 20, 30, 100, 200][randInt(0, 4)];
    const q1Answer = q1A * q1Mult;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 1 • COMPUTING A PRODUCT' : 'ΕΡΩΤΗΣΗ 1 • ΥΠΟΛΟΓΙΣΜΟΣ ΓΙΝΟΜΕΝΟΥ',
      instruction: isEn ? 'Calculate the product (integer without commas):' : 'Υπολογίστε το γινόμενο (ακέραιος χωρίς τελείες):',
      prompt: isEn ? `Calculate: ${q1A} · ${q1Mult}:` : `Υπολογίστε: ${q1A} · ${q1Mult};`,
      itemContext: shuffledItems[0].item,
      correctVal: q1Answer,
      correctStr: String(q1Answer),
      explanation: isEn
        ? `Multiply: ${q1A} · ${q1Mult} ＝ ${formatNumber(q1Answer, locale)}.`
        : `Πολλαπλασιάζουμε: ${q1A} · ${q1Mult} ＝ ${formatNumber(q1Answer, locale)}.`
    });
  }

  // Q2 (Input - Decimal): Επιμεριστική Ιδιότητα [α · (β ＋ γ)]
  {
    const q2A = randInt(4, 9);
    const q2Tens = randInt(1, 5) * 10;
    const q2Units = randInt(1, 9);
    const q2Total = q2Tens + q2Units;
    const q2Answer = q2A * q2Total;
    const q2Prompt = `${q2A} · (${q2Tens} ＋ ${q2Units})`;

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 2 • DISTRIBUTIVE PROPERTY' : 'ΕΡΩΤΗΣΗ 2 • ΕΠΙΜΕΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      instruction: isEn ? 'Calculate the result using the distributive property (integer):' : 'Υπολογίστε το αποτέλεσμα της επιμεριστικής παράστασης (ακέραιος χωρίς τελείες):',
      prompt: isEn ? `Calculate: ${q2Prompt}:` : `Υπολογίστε: ${q2Prompt};`,
      correctVal: q2Answer,
      correctStr: String(q2Answer),
      explanation: isEn
        ? `Apply the distributive property: (${q2A} · ${q2Tens}) ＋ (${q2A} · ${q2Units}) ＝ ${q2A * q2Tens} ＋ ${q2A * q2Units} ＝ ${formatNumber(q2Answer, locale)}.`
        : `Εφαρμόζουμε την επιμεριστική: (${q2A} · ${q2Tens}) ＋ (${q2A} · ${q2Units}) ＝ ${q2A * q2Tens} ＋ ${q2A * q2Units} ＝ ${formatNumber(q2Answer, locale)}.`
    });
  }

  // Q3 (MCQ): Αντιμεταθετική Ιδιότητα
  {
    const q3A = randInt(25, 95);
    const q3B = randInt(12, 48);
    const q3CorrectStr = `${q3B} · ${q3A}`;
    const q3Wrong1 = `${q3B} ＋ ${q3A}`;
    const q3Wrong2 = `${q3A} ＋ ${q3B}`;
    const q3Wrong3 = `${q3A} － ${q3B}`;

    const options = makeUniqueOptions(q3CorrectStr, [q3Wrong1, q3Wrong2, q3Wrong3]);

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • COMMUTATIVE PROPERTY' : 'ΕΡΩΤΗΣΗ 3 • ΑΝΤΙΜΕΤΑΘΕΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      instruction: isEn ? 'Select the equivalent expression by the commutative property:' : 'Επιλέξτε την ίση παράσταση σύμφωνα με την αντιμεταθετική ιδιότητα:',
      prompt: isEn ? `According to the commutative property, ${q3A} · ${q3B} equals:` : `Σύμφωνα με την αντιμεταθετική ιδιότητα, η παράσταση ${q3A} · ${q3B} είναι ίση με:`,
      options,
      correctText: q3CorrectStr,
      explanation: isEn
        ? `The commutative property states that a · b ＝ b · a. Thus ${q3A} · ${q3B} ＝ ${q3CorrectStr}.`
        : `Η αντιμεταθετική ιδιότητα ορίζει ότι α · β ＝ β · α. Άρα ${q3A} · ${q3B} ＝ ${q3CorrectStr}.`
    });
  }

  // Q4 (MCQ): Προσεταιριστική Ιδιότητα
  {
    const q4PairType = randInt(1, 3);
    let q4A = 25;
    let q4B = 14;
    let q4C = 4;
    if (q4PairType === 1) {
      q4A = 25;
      q4B = randInt(11, 39);
      q4C = 4; // 25 · 4 = 100
    } else if (q4PairType === 2) {
      q4A = 50;
      q4B = randInt(11, 29);
      q4C = 2; // 50 · 2 = 100
    } else {
      q4A = 125;
      q4B = randInt(3, 15);
      q4C = 8; // 125 · 8 = 1000
    }
    const q4Answer = q4A * q4B * q4C;
    const correctStr = formatNumber(q4Answer, locale);

    const rawWrong1 = formatNumber(q4Answer + 100, locale);
    const rawWrong2 = formatNumber(Math.max(10, q4Answer - 50), locale);
    const rawWrong3 = formatNumber(q4Answer * 2, locale);

    const options = makeUniqueOptions(correctStr, [rawWrong1, rawWrong2, rawWrong3]);

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • ASSOCIATIVE PROPERTY' : 'ΕΡΩΤΗΣΗ 4 • ΠΡΟΣΕΤΑΙΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      instruction: isEn ? 'Calculate the product by grouping strategically:' : 'Υπολογίστε έξυπνα το γινόμενο ομαδοποιώντας κατάλληλα:',
      prompt: isEn ? `Calculate: (${q4A} · ${q4B}) · ${q4C}:` : `Υπολογίστε: (${q4A} · ${q4B}) · ${q4C};`,
      options,
      correctText: correctStr,
      explanation: isEn
        ? `Group first: (${q4A} · ${q4C}) ＝ ${q4A * q4C}. Then: ${q4A * q4C} · ${q4B} ＝ ${correctStr}.`
        : `Ομαδοποιούμε πρώτα το (${q4A} · ${q4C}) ＝ ${q4A * q4C}. Στη συνέχεια: ${q4A * q4C} · ${q4B} ＝ ${correctStr}.`
    });
  }

  // Q5 (MCQ): True / False - Ουδέτερο και Απορροφητικό Στοιχείο
  {
    const q5Number = randInt(350, 9500);
    const q5IsTrue = Math.random() > 0.5;
    const formattedNum = formatNumber(q5Number, locale);
    const q5Text = isEn
      ? (q5IsTrue
          ? `It holds that ${formattedNum} · 1 ＝ ${formattedNum} and ${formattedNum} · 0 ＝ 0.`
          : `It holds that ${formattedNum} · 0 ＝ ${formattedNum} because 0 is the identity element.`)
      : (q5IsTrue
          ? `Ισχύει ότι ${formattedNum} · 1 ＝ ${formattedNum} και ${formattedNum} · 0 ＝ 0.`
          : `Ισχύει ότι ${formattedNum} · 0 ＝ ${formattedNum} επειδή το 0 είναι το ουδέτερο στοιχείο.`);

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
      title: isEn ? 'QUESTION 5 • IDENTITY & ZERO PROPERTIES' : 'ΕΡΩΤΗΣΗ 5 • ΟΥΔΕΤΕΡΟ & ΑΠΟΡΡΟΦΗΤΙΚΟ ΣΤΟΙΧΕΙΟ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? 'Correct! 1 is the identity element of multiplication and 0 is the zero element.'
            : `False! 0 multiplies any number to zero (${formattedNum} · 0 ＝ 0), while 1 leaves it unchanged.`)
        : (q5IsTrue
            ? 'Σωστό! Το 1 είναι το ουδέτερο στοιχείο του πολλαπλασιασμού και το 0 είναι το απορροφητικό στοιχείο.'
            : `Λάθος! Το 0 μηδενίζει κάθε αριθμό (${formattedNum} · 0 ＝ 0), ενώ το 1 διατηρεί την αξία του.`)
    });
  }

  // Q6 (MCQ): True / False - Επιμεριστική Ιδιότητα
  {
    const q6A = randInt(5, 9);
    const q6B = randInt(10, 30);
    const q6C = randInt(2, 8);
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? `The expression ${q6A} · (${q6B} ＋ ${q6C}) always equals (${q6A} · ${q6B}) ＋ (${q6A} · ${q6C}).`
          : `The expression ${q6A} · (${q6B} ＋ ${q6C}) equals (${q6A} ＋ ${q6B}) · (${q6A} ＋ ${q6C}).`)
      : (q6IsTrue
          ? `Η έκφραση ${q6A} · (${q6B} ＋ ${q6C}) ισούται πάντα με (${q6A} · ${q6B}) ＋ (${q6A} · ${q6C}).`
          : `Η έκφραση ${q6A} · (${q6B} ＋ ${q6C}) ισούται με (${q6A} ＋ ${q6B}) · (${q6A} ＋ ${q6C}).`);

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
      title: isEn ? 'QUESTION 6 • DISTRIBUTIVE RULE' : 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΕΠΙΜΕΡΙΣΤΙΚΗΣ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? 'Correct! The factor outside parentheses multiplies each addend inside separately.'
            : 'False! The correct formula is: a · (b ＋ c) ＝ (a · b) ＋ (a · c).')
        : (q6IsTrue
            ? 'Σωστό! Ο παράγοντας έξω από την παρένθεση πολλαπλασιάζεται ξεχωριστά με κάθε προσθετέο μέσα σε αυτή.'
            : 'Λάθος! Ο σωστός τύπος είναι: α · (β ＋ γ) ＝ (α · β) ＋ (α · γ).')
    });
  }

  // Q7 (Input - Decimal): Οπτικό Πλέγμα Τετραγώνων
  {
    const q7Rows = randInt(3, 7);
    const q7Cols = randInt(4, 9);
    const q7Val = q7Rows * q7Cols;

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 7 • VISUAL TILE GRID' : 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΟ ΠΛΕΓΜΑ ΤΕΤΡΑΓΩΝΩΝ',
      instruction: isEn ? 'Find the total number of squares (integer):' : 'Βρείτε το πλήθος των τετραγώνων (ακέραιος):',
      prompt: isEn
        ? `How many small squares are in a grid with ${q7Rows} rows and ${q7Cols} columns?`
        : `Πόσα τετραγωνάκια περιέχει ένα πλέγμα με ${q7Rows} γραμμές και ${q7Cols} στήλες;`,
      gridData: { rows: q7Rows, cols: q7Cols },
      correctVal: q7Val,
      correctStr: String(q7Val),
      explanation: isEn
        ? `The grid has ${q7Rows} rows and ${q7Cols} columns, so it contains ${q7Rows} · ${q7Cols} ＝ ${q7Val} squares.`
        : `Το πλέγμα έχει ${q7Rows} γραμμές και ${q7Cols} στήλες, άρα περιέχει ${q7Rows} · ${q7Cols} ＝ ${q7Val} τετραγωνάκια.`
    });
  }

  // Q8 (MCQ): Γεωμετρική Επιμεριστική
  {
    const q8H = randInt(3, 6);
    const q8W1 = randInt(4, 8);
    const q8W2 = randInt(2, 5);
    const q8CorrectArea = q8H * (q8W1 + q8W2);
    const correctStr = String(q8CorrectArea);

    const w1 = String(q8H * q8W1 + q8W2);
    const w2 = String((q8H + q8W1) * q8W2);
    const w3 = String(q8CorrectArea + 10);

    const options = makeUniqueOptions(correctStr, [w1, w2, w3]);

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • GEOMETRIC DISTRIBUTIVE PROPERTY' : 'ΕΡΩΤΗΣΗ 8 • ΓΕΩΜΕΤΡΙΚΗ ΕΠΙΜΕΡΙΣΤΙΚΗ',
      instruction: isEn ? 'Select the total area of the rectangle:' : 'Επιλέξτε το συνολικό εμβαδόν του ορθογωνίου:',
      prompt: isEn
        ? `What is the total area of the rectangle: ${q8H} · (${q8W1} ＋ ${q8W2})?`
        : `Ποιο είναι το συνολικό εμβαδόν του ορθογωνίου: ${q8H} · (${q8W1} ＋ ${q8W2});`,
      options,
      correctText: correctStr,
      explanation: isEn
        ? `The total area is ${q8H} · (${q8W1} ＋ ${q8W2}) ＝ (${q8H} · ${q8W1}) ＋ (${q8H} · ${q8W2}) ＝ ${q8H * q8W1} ＋ ${q8H * q8W2} ＝ ${correctStr}.`
        : `Το συνολικό εμβαδόν είναι ${q8H} · (${q8W1} ＋ ${q8W2}) ＝ (${q8H} · ${q8W1}) ＋ (${q8H} · ${q8W2}) ＝ ${q8H * q8W1} ＋ ${q8H * q8W2} ＝ ${correctStr}.`
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
    pageTitle: "Ασκήσεις: Πολλαπλασιασμός & Ιδιότητες - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές ασκήσεις και προβλήματα στον πολλαπλασιασμό φυσικών αριθμών και τις ιδιότητες για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Πολλαπλασιασμός & Ιδιότητες",
    heroDesc: "10 απαιτητικές δραστηριότητες με πολλαπλασιασμό φυσικών αριθμών, αντιμεταθετική, προσεταιριστική και επιμεριστική ιδιότητα και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.",
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
    scoreRatio: "/ 10",
    pctLabel: "ΠΟΣΟΣΤΟ",
    btnCheckBar: "ΕΛΕΓΧΟΣ"
  },
  en: {
    pageTitle: "Exercises: Multiplication & Properties - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems on whole number multiplication and algebraic properties for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Multiplication & Properties",
    heroDesc: "10 practice problems covering whole number multiplication, commutative, associative, and distributive properties, visual tile models, and applied real-world word problems.",
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
    scoreRatio: "/ 10",
    pctLabel: "PERCENTAGE",
    btnCheckBar: "CHECK"
  }
};

export default function PollaplasiasmosExercisesPage() {
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

  const handleInputChange = (fieldKey, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/[^0-9]/g, '');
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [fieldKey]: sanitized
    }));
  };

  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  const handleCheckAnswers = () => {
    let currentScore = 0;

    questions.forEach((q) => {
      if (q.type === 'mcq') {
        const userChoice = answers[`q_${q.id}`];
        if (userChoice === q.correctText) {
          currentScore += 1;
        }
      } else if (q.type === 'decimal_input') {
        const userValStr = (answers[`q_${q.id}`] || '').trim();
        const userVal = parseFloat(userValStr);
        if (!isNaN(userVal) && Math.abs(userVal - q.correctVal) < 0.05) {
          currentScore += 1;
        }
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/06-pollaplasiasmos"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.theoryBtn}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-36 overflow-x-hidden box-border">
        
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
              <span>{t.btnNewSet}</span>
            </button>
          </div>
        </section>

        {/* Λίστα 10 Ασκήσεων */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (isSubmitted) {
              if (q.type === 'mcq') {
                isCorrect = answers[`q_${q.id}`] === q.correctText;
              } else if (q.type === 'decimal_input') {
                const uv = parseFloat((answers[`q_${q.id}`] || '').trim());
                isCorrect = !isNaN(uv) && Math.abs(uv - q.correctVal) < 0.05;
              }
            }

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
                      className={`text-xs 2xl:text-sm font-bold px-3 py-1 rounded-full ${
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

                  {/* Οπτικό Πλέγμα για την Q7 */}
                  {q.gridData && (
                    <div className="bg-slate-100 rounded-2xl p-4 my-3 flex justify-center max-w-full overflow-x-auto">
                      <svg 
                        viewBox={`0 0 ${q.gridData.cols * 22} ${q.gridData.rows * 22}`} 
                        className="w-full max-w-[260px] sm:max-w-xs h-auto bg-white rounded-lg border border-slate-300 shadow-sm p-1 shrink-0 select-none"
                      >
                        {[...Array(q.gridData.rows)].map((_, r) => (
                          <g key={r}>
                            {[...Array(q.gridData.cols)].map((_, c) => (
                              <rect
                                key={c}
                                x={c * 22}
                                y={r * 22}
                                width="20"
                                height="20"
                                rx="3"
                                fill="#f59e0b"
                                stroke="#d97706"
                                strokeWidth="1"
                              />
                            ))}
                          </g>
                        ))}
                      </svg>
                    </div>
                  )}
                </div>

                {/* Περιοχή Απάντησης */}
                <div className="py-2">
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder={t.inputPlaceholder}
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500 break-words [overflow-wrap:anywhere]">
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
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1">
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

                    {q.tableData && (
                      <div className="w-full max-w-full overflow-x-auto block">
                        <div className="inline-block min-w-full sm:min-w-[320px] bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-inner my-1 font-mono text-xs sm:text-sm">
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
                      </div>
                    )}

                    <div className="break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                    
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800">
                        {t.correctAnswerLabel}{' '}
                        <span className="font-mono font-bold text-blue-900 break-words [overflow-wrap:anywhere]">
                          {q.correctStr || q.correctText}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Κουμπί Ελέγχου στο τέλος της σελίδας */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleCheckAnswers}
            disabled={isSubmitted}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation cursor-pointer"
          >
            <span>{t.btnCheckMain}</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                {t.scoreLabel}
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-base">{t.scoreRatio}</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-xs text-slate-400 font-semibold block">
                {t.pctLabel}
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
                {Math.round((score / 10) * 100)} %
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation cursor-pointer"
              >
                {t.btnCheckBar}
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation cursor-pointer"
              >
                {t.btnNewSet}
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}
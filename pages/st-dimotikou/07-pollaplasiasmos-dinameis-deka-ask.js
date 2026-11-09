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

function formatNum(val, locale = 'el', decimals = 3) {
  if (val === '' || val === null || val === undefined || isNaN(val)) return '0';
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return locale === 'en' ? String(rounded) : String(rounded).replace('.', ',');
}

function formatNumber(num, locale = 'el') {
  if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
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

const REAL_WORLD_ITEMS = {
  el: [
    { item: 'τετράδια για το σχολείο', price: 2.45, unit: '€' },
    { item: 'μπουκάλια νερό', price: 0.50, unit: '€' },
    { item: 'στυλό διαρκείας', price: 1.20, unit: '€' },
    { item: 'πακέτα χαρτί A4', price: 4.85, unit: '€' },
    { item: 'μέτρα ύφασμα', price: 8.50, unit: '€' },
    { item: 'σάντουιτς για το κυλικείο', price: 2.30, unit: '€' },
    { item: 'εισιτήρια λεωφορείου', price: 1.10, unit: '€' },
    { item: 'βιβλία μαθηματικών', price: 9.75, unit: '€' }
  ],
  en: [
    { item: 'notebooks for school', price: 2.45, unit: '€' },
    { item: 'bottles of water', price: 0.50, unit: '€' },
    { item: 'ballpoint pens', price: 1.20, unit: '€' },
    { item: 'packs of A4 paper', price: 4.85, unit: '€' },
    { item: 'meters of fabric', price: 8.50, unit: '€' },
    { item: 'canteen sandwiches', price: 2.30, unit: '€' },
    { item: 'bus tickets', price: 1.10, unit: '€' },
    { item: 'math textbooks', price: 9.75, unit: '€' }
  ]
};

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_pow10_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const pricePerItem = 1.45;
      const count = 100;
      const total = Number((pricePerItem * count).toFixed(2));
      const totalStr = `${formatNum(total, locale, 2)} €`;

      return {
        title: isEn ? 'MUSEUM TICKETS PURCHASE' : 'ΑΓΟΡΑ ΕΙΣΙΤΗΡΙΩΝ ΜΟΥΣΕΙΟΥ',
        instruction: isEn ? 'Calculate total cost in euros (€):' : 'Υπολογίστε το συνολικό ποσό σε ευρώ (€) με κόμμα:',
        text: isEn
          ? `A class bought ${count} museum tickets for ${formatNum(pricePerItem, locale)} € each. How many euros (€) did they pay in total?`
          : `Μια τάξη αγόρασε ${count} εισιτήρια μουσείου προς ${formatNum(pricePerItem, locale)} € το καθένα. Πόσα ευρώ (€) πλήρωσε συνολικά;`,
        tableData: {
          col1: isEn ? 'Tickets' : 'Εισιτήρια',
          col2: isEn ? 'Unit price' : 'Τιμή ανά τεμάχιο',
          r1: [isEn ? `${count} tickets` : `${count} τεμάχια`, `${formatNum(pricePerItem, locale)} €`],
          r2: [isEn ? 'Multiplication' : 'Πολλαπλασιασμός', totalStr]
        },
        correctVal: total,
        correctStr: formatNum(total, locale, 2),
        explanation: isEn
          ? `Shift the decimal point 2 places right: ${formatNum(pricePerItem, locale)} · 100 ＝ ${totalStr}.`
          : `Μετακινούμε την υποδιαστολή 2 θέσεις δεξιά: ${formatNum(pricePerItem, locale)} · 100 ＝ ${totalStr}.`
      };
    }
  },
  {
    id: 'p_pow10_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const priceUnit = 0.85;
      const count = 1000;
      const total = Number((priceUnit * count).toFixed(2));
      const totalStr = `${formatNum(total, locale, 2)} €`;

      return {
        title: isEn ? 'BULK PEN PURCHASE' : 'ΜΑΖΙΚΗ ΑΓΟΡΑ ΣΤΥΛΟ',
        instruction: isEn ? 'Calculate total cost in euros (€):' : 'Υπολογίστε το συνολικό ποσό σε ευρώ (€) με κόμμα:',
        text: isEn
          ? `A school ordered ${formatNumber(count, locale)} pens at ${formatNum(priceUnit, locale)} € each. How much did the order cost in euros (€)?`
          : `Ένα σχολείο παρήγγειλε ${formatNumber(count, locale)} στυλό προς ${formatNum(priceUnit, locale)} € το τεμάχιο. Πόσα ευρώ (€) κόστισε η παραγγελία;`,
        tableData: {
          col1: isEn ? 'Items' : 'Τεμάχια',
          col2: isEn ? 'Unit price' : 'Τιμή τεμαχίου',
          r1: [isEn ? `${formatNumber(count, locale)} pens` : `${formatNumber(count, locale)} στυλό`, `${formatNum(priceUnit, locale)} €`],
          r2: [isEn ? 'Product' : 'Γινόμενο', totalStr]
        },
        correctVal: total,
        correctStr: formatNum(total, locale, 2),
        explanation: isEn
          ? `Shift the decimal point 3 places right: ${formatNum(priceUnit, locale)} · 1,000 ＝ ${totalStr}.`
          : `Μετακινούμε την υποδιαστολή 3 θέσεις δεξιά: ${formatNum(priceUnit, locale)} · 1.000 ＝ ${totalStr}.`
      };
    }
  },
  {
    id: 'p_pow10_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const lengthM = 4.25;
      const count = 10;
      const total = Number((lengthM * count).toFixed(2));
      const totalStr = `${formatNum(total, locale, 2)} m`;

      return {
        title: isEn ? 'FABRIC ROLLS LENGTH' : 'ΜΗΚΟΣ ΡΟΛΩΝ ΥΦΑΣΜΑΤΟΣ',
        instruction: isEn ? 'Calculate total length in meters (m):' : 'Υπολογίστε το συνολικό μήκος σε μέτρα (m) με κόμμα:',
        text: isEn
          ? `A shop received ${count} rolls of fabric, each ${formatNum(lengthM, locale)} m long. How many meters (m) of fabric did it receive in total?`
          : `Ένα κατάστημα παρέλαβε ${count} τόπια υφάσματος, μήκους ${formatNum(lengthM, locale)} m το καθένα. Πόσα μέτρα (m) υφάσματος παρέλαβε συνολικά;`,
        tableData: {
          col1: isEn ? 'Rolls' : 'Τόπια',
          col2: isEn ? 'Length per roll' : 'Μήκος ανά τόπι',
          r1: [isEn ? `${count} rolls` : `${count} τόπια`, `${formatNum(lengthM, locale)} m`],
          r2: [isEn ? 'Product' : 'Γινόμενο', totalStr]
        },
        correctVal: total,
        correctStr: formatNum(total, locale, 2),
        explanation: isEn
          ? `Shift the decimal point 1 place right: ${formatNum(lengthM, locale)} · 10 ＝ ${totalStr}.`
          : `Μετακινούμε την υποδιαστολή 1 θέση δεξιά: ${formatNum(lengthM, locale)} · 10 ＝ ${totalStr}.`
      };
    }
  },
  {
    id: 'p_pow10_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const weightGr = 4500;
      const mult = 0.001;
      const totalKg = Number((weightGr * mult).toFixed(3));
      const totalStr = `${formatNum(totalKg, locale, 1)} kg`;

      return {
        title: isEn ? 'CONVERTING GRAMS TO KILOGRAMS' : 'ΜΕΤΑΤΡΟΠΗ ΓΡΑΜΜΑΡΙΩΝ ΣΕ ΚΙΛΑ',
        instruction: isEn ? 'Calculate weight in kilograms (kg):' : 'Υπολογίστε το βάρος σε κιλά (kg) με κόμμα:',
        text: isEn
          ? `A quantity of flour weighs ${formatNumber(weightGr, locale)} g. How many kilograms (kg) is that, knowing that 1 g ＝ 0.001 kg?`
          : `Μια ποσότητα αλευριού ζυγίζει ${formatNumber(weightGr, locale)} g. Πόσα κιλά (kg) είναι, αν γνωρίζουμε ότι 1 g ＝ 0,001 kg;`,
        tableData: {
          col1: isEn ? 'Grams' : 'Γραμμάρια',
          col2: isEn ? 'Ratio to kg' : 'Σχέση σε κιλά',
          r1: [`${formatNumber(weightGr, locale)} g`, isEn ? '1 g ＝ 0.001 kg' : '1 g ＝ 0,001 kg'],
          r2: [isEn ? 'Product' : 'Γινόμενο', totalStr]
        },
        correctVal: totalKg,
        correctStr: formatNum(totalKg, locale, 1),
        explanation: isEn
          ? `Shift the decimal point 3 places left: ${formatNumber(weightGr, locale)} · 0.001 ＝ ${totalStr}.`
          : `Μετακινούμε την υποδιαστολή 3 θέσεις αριστερά: ${formatNumber(weightGr, locale)} · 0,001 ＝ ${totalStr}.`
      };
    }
  },
  {
    id: 'p_pow10_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const distM = 6800;
      const mult = 0.001;
      const totalKm = Number((distM * mult).toFixed(3));
      const totalStr = `${formatNum(totalKm, locale, 2)} km`;

      return {
        title: isEn ? 'CONVERTING METERS TO KILOMETERS' : 'ΜΕΤΑΤΡΟΠΗ ΜΕΤΡΩΝ ΣΕ ΧΙΛΙΟΜΕΤΡΑ',
        instruction: isEn ? 'Calculate distance in kilometers (km):' : 'Υπολογίστε την απόσταση σε χιλιόμετρα (km) με κόμμα:',
        text: isEn
          ? `A runner ran a distance of ${formatNumber(distM, locale)} m. How many kilometers (km) is that, given that 1 m ＝ 0.001 km?`
          : `Ένας δρομέας διένυσε απόσταση ${formatNumber(distM, locale)} m. Πόσα χιλιόμετρα (km) διένυσε, αν 1 m ＝ 0,001 kg;`,
        tableData: {
          col1: isEn ? 'Meters' : 'Μέτρα',
          col2: isEn ? 'Ratio to km' : 'Σχέση σε χιλιόμετρα',
          r1: [`${formatNumber(distM, locale)} m`, isEn ? '1 m ＝ 0.001 km' : '1 m ＝ 0,001 km'],
          r2: [isEn ? 'Product' : 'Γινόμενο', totalStr]
        },
        correctVal: totalKm,
        correctStr: formatNum(totalKm, locale, 2),
        explanation: isEn
          ? `Shift the decimal point 3 places left: ${formatNumber(distM, locale)} · 0.001 ＝ ${totalStr}.`
          : `Μετακινούμε την υποδιαστολή 3 θέσεις αριστερά: ${formatNumber(distM, locale)} · 0,001 ＝ ${totalStr}.`
      };
    }
  },
  {
    id: 'p_pow10_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const volMl = 750;
      const mult = 0.01;
      const totalDl = Number((volMl * mult).toFixed(2));
      const totalStr = formatNum(totalDl, locale, 2);

      return {
        title: isEn ? 'LIQUID VOLUME CONVERSION' : 'ΜΕΤΑΤΡΟΠΗ ΟΓΚΟΥ ΥΓΡΟΥ',
        instruction: isEn ? 'Calculate the result with decimal point:' : 'Υπολογίστε τον όγκο με κόμμα:',
        text: isEn
          ? `A container holds ${volMl} units of liquid. If we multiply this quantity by 0.01, what result do we get?`
          : `Ένα δοχείο περιέχει ${volMl} μονάδες υγρού. Αν πολλαπλασιάσουμε την ποσότητα με το 0,01, ποιο αποτέλεσμα θα πάρουμε;`,
        tableData: {
          col1: isEn ? 'Initial quantity' : 'Αρχική Ποσότητα',
          col2: isEn ? 'Multiplier' : 'Πολλαπλασιαστής',
          r1: [`${volMl}`, isEn ? '· 0.01' : '· 0,01'],
          r2: [isEn ? 'Result' : 'Αποτέλεσμα', totalStr]
        },
        correctVal: totalDl,
        correctStr: totalStr,
        explanation: isEn
          ? `Shift the decimal point 2 places left: ${volMl} · 0.01 ＝ ${totalStr}.`
          : `Μετακινούμε την υποδιαστολή 2 θέσεις αριστερά: ${volMl} · 0,01 ＝ ${totalStr}.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_pow10_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const weightKg = 3450;
      const mult = 0.001;
      const totalT = Number((weightKg * mult).toFixed(3));
      const correctStr = `${formatNum(totalT, locale, 3)} t`;
      const fake1 = `${formatNum(totalT * 10, locale, 2)} t`;
      const fake2 = `${formatNum(totalT / 10, locale, 4)} t`;
      const fake3 = `${formatNum(totalT + 1, locale, 3)} t`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'CONVERTING CARGO WEIGHT TO TONNES' : 'ΜΕΤΑΤΡΟΠΗ ΒΑΡΟΥΣ ΦΟΡΤΙΟΥ ΣΕ ΤΟΝΟΥΣ',
        instruction: isEn ? 'Select the correct weight in tonnes (t):' : 'Επιλέξτε το σωστό βάρος σε τόνους (t):',
        text: isEn
          ? `A truck carries a load of ${formatNumber(weightKg, locale)} kg. How many tonnes (t) does the cargo weigh, knowing that 1 kg ＝ 0.001 t?`
          : `Ένα φορτηγό μεταφέρει φορτίο ${formatNumber(weightKg, locale)} kg. Πόσους τόνους (t) ζυγίζει το φορτίο, αν γνωρίζουμε ότι 1 kg ＝ 0,001 t;`,
        tableData: {
          col1: isEn ? 'Weight in kg' : 'Βάρος σε κιλά',
          col2: isEn ? 'Ratio to tonnes' : 'Σχέση σε τόνους',
          r1: [`${formatNumber(weightKg, locale)} kg`, isEn ? '1 kg ＝ 0.001 t' : '1 kg ＝ 0,001 t'],
          r2: [isEn ? 'Multiplication' : 'Πολλαπλασιασμός', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Shift the decimal point 3 places left: ${formatNumber(weightKg, locale)} · 0.001 ＝ ${correctStr}.`
          : `Μετακινούμε την υποδιαστολή 3 θέσεις αριστερά: ${formatNumber(weightKg, locale)} · 0,001 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_pow10_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const rollCm = 850;
      const mult = 0.01;
      const totalM = Number((rollCm * mult).toFixed(2));
      const correctStr = `${formatNum(totalM, locale, 2)} m`;
      const fake1 = `${formatNum(totalM * 10, locale, 1)} m`;
      const fake2 = `${formatNum(totalM / 10, locale, 3)} m`;
      const fake3 = `${formatNum(totalM + 2, locale, 2)} m`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'CONVERTING CENTIMETERS TO METERS' : 'ΜΕΤΑΤΡΟΠΗ ΕΚΑΤΟΣΤΩΝ ΣΕ ΜΕΤΡΑ',
        instruction: isEn ? 'Select the correct length in meters (m):' : 'Επιλέξτε το σωστό μήκος σε μέτρα (m):',
        text: isEn
          ? `A ribbon is ${rollCm} cm long. What is its length in meters (m), given that 1 cm ＝ 0.01 m?`
          : `Μια κορδέλα έχει μήκος ${rollCm} cm. Πόσα μέτρα (m) είναι το μήκος της, αν 1 cm ＝ 0,01 m;`,
        tableData: {
          col1: isEn ? 'Length in cm' : 'Μήκος σε εκατοστά',
          col2: isEn ? 'Ratio to meters' : 'Σχέση σε μέτρα',
          r1: [`${rollCm} cm`, isEn ? '1 cm ＝ 0.01 m' : '1 cm ＝ 0,01 m'],
          r2: [isEn ? 'Multiplication' : 'Πολλαπλασιασμός', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Shift the decimal point 2 places left: ${rollCm} · 0.01 ＝ ${correctStr}.`
          : `Μετακινούμε την υποδιαστολή 2 θέσεις αριστερά: ${rollCm} · 0,01 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_pow10_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const pricePerL = 1.35;
      const count = 100;
      const totalCost = Number((pricePerL * count).toFixed(2));
      const correctStr = `${formatNum(totalCost, locale, 2)} €`;
      const fake1 = `${formatNum(totalCost / 10, locale, 2)} €`;
      const fake2 = `${formatNum(totalCost * 10, locale, 2)} €`;
      const fake3 = `${formatNum(totalCost + 15, locale, 2)} €`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'FUEL PROCUREMENT IN EUROS' : 'ΠΡΟΜΗΘΕΙΑ ΚΑΥΣΙΜΟΥ ΣΕ ΕΥΡΩ',
        instruction: isEn ? 'Select the total cost in euros (€):' : 'Επιλέξτε το συνολικό κόστος σε ευρώ (€):',
        text: isEn
          ? `A company purchased ${count} liters of fuel at ${formatNum(pricePerL, locale)} € per liter. How many euros (€) did it pay in total?`
          : `Μια εταιρεία αγόρασε ${count} λίτρα καυσίμου προς ${formatNum(pricePerL, locale)} € το λίτρο. Πόσα ευρώ (€) πλήρωσε συνολικά;`,
        tableData: {
          col1: isEn ? 'Quantity' : 'Ποσότητα',
          col2: isEn ? 'Price per liter' : 'Τιμή ανά λίτρο',
          r1: [`${count} L`, `${formatNum(pricePerL, locale)} €`],
          r2: [isEn ? 'Product' : 'Γινόμενο', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Shift the decimal point 2 places right: ${formatNum(pricePerL, locale)} · 100 ＝ ${correctStr}.`
          : `Μετακινούμε την υποδιαστολή 2 θέσεις δεξιά: ${formatNum(pricePerL, locale)} · 100 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_pow10_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const weightGr = 7250;
      const mult = 0.001;
      const totalKg = Number((weightGr * mult).toFixed(3));
      const correctStr = `${formatNum(totalKg, locale, 2)} kg`;
      const fake1 = `${formatNum(totalKg * 10, locale, 1)} kg`;
      const fake2 = `${formatNum(totalKg / 10, locale, 3)} kg`;
      const fake3 = `${formatNum(totalKg + 5, locale, 2)} kg`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'CONVERTING MASS TO KILOGRAMS' : 'ΜΕΤΑΤΡΟΠΗ ΜΑΖΑΣ ΣΕ ΚΙΛΑ',
        instruction: isEn ? 'Select the correct weight in kilograms (kg):' : 'Επιλέξτε το σωστό βάρος σε κιλά (kg):',
        text: isEn
          ? `A parcel weighs ${formatNumber(weightGr, locale)} g. How many kilograms (kg) does it weigh, given that 1 g ＝ 0.001 kg?`
          : `Ένα δέμα ζυγίζει ${formatNumber(weightGr, locale)} g. Πόσα κιλά (kg) ζυγίζει, αν 1 g ＝ 0,001 kg;`,
        tableData: {
          col1: isEn ? 'Grams' : 'Γραμμάρια',
          col2: isEn ? 'Ratio to kg' : 'Σχέση σε κιλά',
          r1: [`${formatNumber(weightGr, locale)} g`, isEn ? '1 g ＝ 0.001 kg' : '1 g ＝ 0,001 kg'],
          r2: [isEn ? 'Product' : 'Γινόμενο', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Shift the decimal point 3 places left: ${formatNumber(weightGr, locale)} · 0.001 ＝ ${correctStr}.`
          : `Μετακινούμε την υποδιαστολή 3 θέσεις αριστερά: ${formatNumber(weightGr, locale)} · 0,001 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_pow10_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const lengthM = 12500;
      const mult = 0.001;
      const totalKm = Number((lengthM * mult).toFixed(3));
      const correctStr = `${formatNum(totalKm, locale, 1)} km`;
      const fake1 = `${formatNum(totalKm * 10, locale, 1)} km`;
      const fake2 = `${formatNum(totalKm / 10, locale, 2)} km`;
      const fake3 = `${formatNum(totalKm + 10, locale, 1)} km`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'CONVERTING DISTANCE TO KILOMETERS' : 'ΜΕΤΑΤΡΟΠΗ ΑΠΟΣΤΑΣΗΣ ΣΕ ΧΙΛΙΟΜΕΤΡΑ',
        instruction: isEn ? 'Select the correct distance in kilometers (km):' : 'Επιλέξτε τη σωστή απόσταση σε χιλιόμετρα (km):',
        text: isEn
          ? `A race course is ${formatNumber(lengthM, locale)} m long. How many kilometers (km) is that, if 1 m ＝ 0.001 km?`
          : `Μια διαδρομή αγώνα δρόμου έχει μήκος ${formatNumber(lengthM, locale)} m. Πόσα χιλιόμετρα (km) είναι η διαδρομή, αν 1 m ＝ 0,001 km;`,
        tableData: {
          col1: isEn ? 'Meters' : 'Μέτρα',
          col2: isEn ? 'Ratio to km' : 'Σχέση σε km',
          r1: [`${formatNumber(lengthM, locale)} m`, isEn ? '1 m ＝ 0.001 km' : '1 m ＝ 0,001 km'],
          r2: [isEn ? 'Product' : 'Γινόμενο', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Shift the decimal point 3 places left: ${formatNumber(lengthM, locale)} · 0.001 ＝ ${correctStr}.`
          : `Μετακινούμε την υποδιαστολή 3 θέσεις αριστερά: ${formatNumber(lengthM, locale)} · 0,001 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_pow10_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const volMl = 4500;
      const mult = 0.001;
      const totalL = Number((volMl * mult).toFixed(3));
      const correctStr = `${formatNum(totalL, locale, 1)} L`;
      const fake1 = `${formatNum(totalL * 10, locale, 1)} L`;
      const fake2 = `${formatNum(totalL / 10, locale, 2)} L`;
      const fake3 = `${formatNum(totalL + 2, locale, 1)} L`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'CONVERTING CAPACITY TO LITERS' : 'ΜΕΤΑΤΡΟΠΗ ΧΩΡΗΤΙΚΟΤΗΤΑΣ ΣΕ ΛΙΤΡΑ',
        instruction: isEn ? 'Select the correct capacity in liters (L):' : 'Επιλέξτε τη σωστή χωρητικότητα σε λίτρα (L):',
        text: isEn
          ? `A pitcher holds ${formatNumber(volMl, locale)} mL of juice. How many liters (L) is that, knowing that 1 mL ＝ 0.001 L?`
          : `Μια κανάτα περιέχει ${formatNumber(volMl, locale)} mL χυμό. Πόσα λίτρα (L) χυμού περιέχει, αν 1 mL ＝ 0,001 L;`,
        tableData: {
          col1: isEn ? 'Milliliters' : 'Χιλιοστόλιτρα',
          col2: isEn ? 'Ratio to liters' : 'Σχέση σε λίτρα',
          r1: [`${formatNumber(volMl, locale)} mL`, isEn ? '1 mL ＝ 0.001 L' : '1 mL ＝ 0,001 L'],
          r2: [isEn ? 'Product' : 'Γινόμενο', correctStr]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Shift the decimal point 3 places left: ${formatNumber(volMl, locale)} · 0.001 ＝ ${correctStr}.`
          : `Μετακινούμε την υποδιαστολή 3 θέσεις αριστερά: ${formatNumber(volMl, locale)} · 0,001 ＝ ${correctStr}.`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const sep = isEn ? '.' : ',';
  const qList = [];
  const itemsPool = REAL_WORLD_ITEMS[locale] || REAL_WORLD_ITEMS.el;
  const shuffledItems = shuffle(itemsPool);

  // Q1 (Input - Decimal): Πολλαπλασιασμός με 10, 100, 1000
  {
    const q1Int = randInt(3, 85);
    const q1Dec = randInt(1, 9) * 10 + randInt(1, 9);
    const q1Mult = [10, 100, 1000][randInt(0, 2)];
    const q1Val = parseFloat(`${q1Int}.${q1Dec}`);
    const q1RawAns = q1Val * q1Mult;
    const q1Correct = Number(q1RawAns.toFixed(2));
    const q1CorrectStr = formatNum(q1Correct, locale);
    const q1Prompt = `${q1Int}${sep}${q1Dec} · ${formatNumber(q1Mult, locale)}`;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 1 • MULTIPLYING BY 10, 100, 1,000' : 'ΕΡΩΤΗΣΗ 1 • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ 10, 100, 1.000',
      instruction: isEn ? 'Calculate product by shifting decimal point:' : 'Υπολογίστε το γινόμενο μετακινώντας την υποδιαστολή (με κόμμα):',
      prompt: isEn ? `Calculate: ${q1Prompt}:` : `Υπολογίστε: ${q1Prompt};`,
      correctVal: q1Correct,
      correctStr: q1CorrectStr,
      explanation: isEn
        ? `Multiplying by ${formatNumber(q1Mult, locale)}, shift decimal point ${q1Mult === 10 ? '1 place' : q1Mult === 100 ? '2 places' : '3 places'} right: ${q1Prompt} ＝ ${q1CorrectStr}.`
        : `Πολλαπλασιάζοντας με το ${formatNumber(q1Mult, locale)}, μετακινούμε την υποδιαστολή ${q1Mult === 10 ? '1 θέση' : q1Mult === 100 ? '2 θέσεις' : '3 θέσεις'} προς τα δεξιά: ${q1Prompt} ＝ ${q1CorrectStr}.`
    });
  }

  // Q2 (Input - Decimal): Πολλαπλασιασμός με 0,1, 0,01, 0,001
  {
    const q2Int = randInt(12, 95);
    const q2Dec = randInt(1, 9);
    const q2Mult = [0.1, 0.01, 0.001][randInt(0, 2)];
    const q2Val = parseFloat(`${q2Int}.${q2Dec}`);
    const q2RawAns = parseFloat((q2Val * q2Mult).toFixed(4));
    const q2Correct = q2RawAns;
    const q2CorrectStr = formatNum(q2RawAns, locale, 4);
    const q2MultStr = formatNum(q2Mult, locale);
    const q2Prompt = `${q2Int}${sep}${q2Dec} · ${q2MultStr}`;

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 2 • MULTIPLYING BY 0.1, 0.01, 0.001' : 'ΕΡΩΤΗΣΗ 2 • ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ ΜΕ 0,1, 0,01, 0,001',
      instruction: isEn ? 'Calculate product by shifting decimal point:' : 'Υπολογίστε το γινόμενο μετακινώντας την υποδιαστολή (με κόμμα):',
      prompt: isEn ? `Calculate: ${q2Prompt}:` : `Υπολογίστε: ${q2Prompt};`,
      correctVal: q2Correct,
      correctStr: q2CorrectStr,
      explanation: isEn
        ? `Multiplying by ${q2MultStr}, shift decimal point ${q2Mult === 0.1 ? '1 place' : q2Mult === 0.01 ? '2 places' : '3 places'} left: ${q2Prompt} ＝ ${q2CorrectStr}.`
        : `Πολλαπλασιάζοντας με το ${q2MultStr}, μετακινούμε την υποδιαστολή ${q2Mult === 0.1 ? '1 θέση' : q2Mult === 0.01 ? '2 θέσεις' : '3 θέσεις'} προς τα αριστερά: ${q2Prompt} ＝ ${q2CorrectStr}.`
    });
  }

  // Q3 (MCQ): Εύρεση του πολλαπλασιαστή που λείπει
  {
    const q3Int = randInt(2, 65);
    const q3Dec = randInt(1, 9) * 10 + randInt(1, 9);
    const q3ValStr = `${q3Int}${sep}${q3Dec}`;
    const q3MultType = randInt(1, 4);
    let q3CorrectMult = '100';
    let q3ResultStr = '';

    if (q3MultType === 1) {
      q3CorrectMult = '10';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) * 10, locale);
    } else if (q3MultType === 2) {
      q3CorrectMult = '100';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) * 100, locale);
    } else if (q3MultType === 3) {
      q3CorrectMult = isEn ? '1,000' : '1.000';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) * 1000, locale);
    } else {
      q3CorrectMult = isEn ? '0.1' : '0,1';
      q3ResultStr = formatNum(parseFloat(`${q3Int}.${q3Dec}`) * 0.1, locale, 3);
    }

    const allCandidates = ['10', '100', isEn ? '1,000' : '1.000', isEn ? '0.1' : '0,1', isEn ? '0.01' : '0,01'];
    const wrongCandidates = allCandidates.filter((m) => m !== q3CorrectMult);
    const options = makeUniqueOptions(q3CorrectMult, wrongCandidates);

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • FINDING MISSING MULTIPLIER' : 'ΕΡΩΤΗΣΗ 3 • ΕΥΡΕΣΗ ΠΟΛΛΑΠΛΑΣΙΑΣΤΗ',
      instruction: isEn ? 'Find the missing multiplier:' : 'Βρείτε τον πολλαπλασιαστή που λείπει:',
      prompt: isEn ? `In the equality ${q3ValStr} · x ＝ ${q3ResultStr}, what is x?` : `Στην ισότητα ${q3ValStr} · χ ＝ ${q3ResultStr}, ποιος είναι ο αριθμός χ;`,
      options,
      correctText: q3CorrectMult,
      explanation: isEn
        ? `To get from ${q3ValStr} to ${q3ResultStr}, the decimal point moved accordingly. The correct multiplier is ${q3CorrectMult}.`
        : `Για να φτάσουμε από το ${q3ValStr} στο ${q3ResultStr}, η υποδιαστολή μετακινήθηκε κατάλληλα. Ο σωστός πολλαπλασιαστής είναι το ${q3CorrectMult}.`
    });
  }

  // Q4 (MCQ): Πρόβλημα Καθημερινότητας
  {
    const q4Item = shuffledItems[0];
    const q4Count = [10, 100, 1000][randInt(0, 2)];
    const q4Cost = parseFloat((q4Item.price * q4Count).toFixed(2));
    const q4Correct = `${formatNum(q4Cost, locale, 2)} €`;
    const q4Wrong1 = `${formatNum(q4Cost / 10, locale, 2)} €`;
    const q4Wrong2 = `${formatNum(q4Cost * 10, locale, 2)} €`;
    const q4Wrong3 = `${formatNum(q4Item.price + q4Count, locale, 2)} €`;

    const options = makeUniqueOptions(q4Correct, [q4Wrong1, q4Wrong2, q4Wrong3]);

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • REAL-WORLD PROBLEM' : 'ΕΡΩΤΗΣΗ 4 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: isEn ? 'Calculate total cost in euros (€):' : 'Υπολογίστε το συνολικό κόστος σε ευρώ (€):',
      prompt: isEn
        ? `A school bought ${formatNumber(q4Count, locale)} ${q4Item.item} costing ${formatNum(q4Item.price, locale, 2)} € each. What is the total cost?`
        : `Ένα σχολείο αγόρασε ${formatNumber(q4Count, locale)} ${q4Item.item} που κοστίζουν ${formatNum(q4Item.price, locale, 2)} € το καθένα. Πόσο κόστισαν όλα μαζί;`,
      options,
      correctText: q4Correct,
      explanation: isEn
        ? `Calculate total cost: ${formatNumber(q4Count, locale)} · ${formatNum(q4Item.price, locale, 2)} € ＝ ${q4Correct}.`
        : `Υπολογίζουμε το συνολικό κόστος: ${formatNumber(q4Count, locale)} · ${formatNum(q4Item.price, locale, 2)} € ＝ ${q4Correct}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας μετατόπισης δεξιά
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? 'When multiplying a decimal number by 100, we shift the decimal point 2 places to the right.'
          : 'When multiplying a decimal number by 100, we shift the decimal point 2 places to the left.')
      : (q5IsTrue
          ? 'Όταν πολλαπλασιάζουμε έναν δεκαδικό αριθμό με το 100, μετακινούμε την υποδιαστολή 2 θέσεις προς τα δεξιά.'
          : 'Όταν πολλαπλασιάζουμε έναν δεκαδικό αριθμό με το 100, μετακινούμε την υποδιαστολή 2 θέσεις προς τα αριστερά.');

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
      title: isEn ? 'QUESTION 5 • SHIFTING RIGHT RULE' : 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΜΕΤΑΤΟΠΙΣΗΣ ΔΕΞΙΑ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? 'Correct! Multiplying by 10, 100, 1,000 increases the number, so the decimal point moves right.'
            : 'False! Multiplying by 100 shifts the decimal point 2 places to the RIGHT (not left).')
        : (q5IsTrue
            ? 'Σωστό! Ο πολλαπλασιασμός με 10, 100, 1.000 μεγαλώνει τον αριθμό, άρα η υποδιαστολή μετακινείται δεξιά.'
            : 'Λάθος! Ο πολλαπλασιασμός με το 100 μετακινεί την υποδιαστολή 2 θέσεις προς τα ΔΕΞΙΑ (όχι αριστερά).')
    });
  }

  // Q6 (MCQ): True / False - Κανόνας μετατόπισης αριστερά
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? 'Multiplying a number by 0.1 decreases the number (it is equivalent to dividing by 10).'
          : 'Multiplying a number by 0.01 increases the number by 100 times.')
      : (q6IsTrue
          ? 'Ο πολλαπλασιασμός ενός αριθμού με το 0,1 μικραίνει τον αριθμό (είναι ισοδύναμος με διαίρεση διά 10).'
          : 'Ο πολλαπλασιασμός ενός αριθμού με το 0,01 μεγαλώνει τον αριθμό κατά 100 φορές.');

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
      title: isEn ? 'QUESTION 6 • SHIFTING LEFT RULE' : 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΜΕΤΑΤΟΠΙΣΗΣ ΑΡΙΣΤΕΡΑ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? 'Correct! Multiplying by 0.1 is equivalent to dividing by 10, so the number decreases.'
            : 'False! Multiplying by 0.01 DECREASES the number by 100 times.')
        : (q6IsTrue
            ? 'Σωστό! Ο πολλαπλασιασμός με το 0,1 ισοδυναμεί με διαίρεση διά 10, επομένως ο αριθμός μικραίνει.'
            : 'Λάθος! Ο πολλαπλασιασμός με το 0,01 ΜΙΚΡΑΙΝΕΙ τον αριθμό κατά 100 φορές.')
    });
  }

  // Q7 (Input - Decimal): Οπτική Μετατόπιση Υποδιαστολής
  {
    const q7Int = randInt(4, 38);
    const q7Dec = randInt(1, 9);
    const q7Mult = [10, 100][randInt(0, 1)];
    const q7Val = parseFloat(`${q7Int}.${q7Dec}`);
    const q7Ans = q7Val * q7Mult;
    const q7AnsStr = formatNum(q7Ans, locale);

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 7 • VISUAL DECIMAL SHIFT' : 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΜΕΤΑΤΟΠΙΣΗ ΥΠΟΔΙΑΣΤΟΛΗΣ',
      instruction: isEn ? 'Calculate the result of the shift:' : 'Υπολογίστε το αποτέλεσμα της μετατόπισης με κόμμα:',
      prompt: isEn ? `Calculate: ${q7Int}${sep}${q7Dec} · ${formatNumber(q7Mult, locale)}:` : `Υπολογίστε: ${q7Int},${q7Dec} · ${formatNumber(q7Mult, locale)};`,
      startStr: `${q7Int}${sep}${q7Dec}`,
      mult: q7Mult,
      correctVal: q7Ans,
      correctStr: q7AnsStr,
      explanation: isEn
        ? `Starting at ${q7Int}${sep}${q7Dec} and jumping ${q7Mult === 10 ? '1 step' : '2 steps'} right due to · ${formatNumber(q7Mult, locale)}, we find ${q7AnsStr}.`
        : `Ξεκινώντας από το ${q7Int},${q7Dec} και κάνοντας ${q7Mult === 10 ? '1 άλμα' : '2 άλματα'} δεξιά λόγω του · ${formatNumber(q7Mult, locale)}, βρίσκουμε ${q7AnsStr}.`
    });
  }

  // Q8 (MCQ): Αναγνώριση Πράξης από Μετατόπιση
  {
    const q8BaseInt = randInt(25, 85);
    const q8BaseDec = randInt(1, 9);
    const q8StartStr = `${q8BaseInt}${sep}${q8BaseDec}`;
    const q8TargetVal = parseFloat((parseFloat(`${q8BaseInt}.${q8BaseDec}`) * 0.01).toFixed(4));
    const q8TargetStr = formatNum(q8TargetVal, locale, 4);
    const q8CorrectMult = isEn ? '· 0.01' : '· 0,01';

    const rawOptions = [isEn ? '· 0.01' : '· 0,01', '· 100', isEn ? '· 0.1' : '· 0,1', isEn ? '· 1,000' : '· 1.000'];
    const wrongOptions = rawOptions.filter((opt) => opt !== q8CorrectMult);
    const options = makeUniqueOptions(q8CorrectMult, wrongOptions);

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • IDENTIFYING OPERATION FROM SHIFT' : 'ΕΡΩΤΗΣΗ 8 • ΑΝΑΓΝΩΡΙΣΗ ΠΡΑΞΗΣ ΑΠΟ ΜΕΤΑΤΟΠΙΣΗ',
      instruction: isEn ? 'Select the operation performed:' : 'Επιλέξτε την πράξη που εκτελέστηκε:',
      prompt: isEn ? `Which operation transformed ${q8StartStr} into ${q8TargetStr}?` : `Ποια πράξη μετέτρεψε το ${q8StartStr} σε ${q8TargetStr};`,
      options,
      correctText: q8CorrectMult,
      explanation: isEn
        ? `The decimal point moved 2 places to the left (from ${q8StartStr} to ${q8TargetStr}), so the operation is ${q8CorrectMult}.`
        : `Η υποδιαστολή μετακινήθηκε 2 θέσεις προς τα αριστερά (από ${q8StartStr} σε ${q8TargetStr}), άρα η πράξη είναι ${q8CorrectMult}.`
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
    pageTitle: "Ασκήσεις: Δυνάμεις του 10 - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές ασκήσεις και προβλήματα στον πολλαπλασιασμό με δυνάμεις του 10 για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Δυνάμεις του 10",
    heroDesc: "10 απαιτητικές δραστηριότητες μετατόπισης υποδιαστολής με 10, 100, 1.000 και 0,1, 0,01, 0,001 και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.",
    heroDynamicNote: "⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.",
    btnNewSet: "🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    badgeCorrect: "✓ ΣΩΣΤΟ",
    badgeWrong: "✗ ΛΑΘΟΣ",
    inputPlaceholder: "Απάντηση...",
    inputNote: "(Ακέραιος ή δεκαδικός με κόμμα)",
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
    pageTitle: "Exercises: Powers of 10 - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems on multiplying by powers of 10 and decimals for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Powers of 10",
    heroDesc: "10 practice problems on shifting the decimal point with 10, 100, 1,000 and 0.1, 0.01, 0.001, plus applied real-world word problems.",
    heroDynamicNote: "⚡ Each exercise set is dynamically generated with random numbers.",
    btnNewSet: "🔄 NEW EXERCISES",
    badgeCorrect: "✓ CORRECT",
    badgeWrong: "✗ WRONG",
    inputPlaceholder: "Answer...",
    inputNote: "(Integer or decimal number)",
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

export default function DinameisDekaExercisesPage() {
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
    let sanitized = rawValue.replace(/[^0-9.,]/g, '');
    const firstSepMatch = sanitized.match(/[,.]/);
    if (firstSepMatch) {
      const sepChar = firstSepMatch[0];
      const parts = sanitized.split(/[,.]/);
      sanitized = parts[0] + sepChar + parts.slice(1).join('');
    }
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
        const userValStr = (answers[`q_${q.id}`] || '').trim().replace(',', '.');
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
          href="/st-dimotikou/07-pollaplasiasmos-dinameis-deka"
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
                const uv = parseFloat((answers[`q_${q.id}`] || '').trim().replace(',', '.'));
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

                  {/* Οπτική Μετατόπιση για την Q7 */}
                  {q.startStr && q.mult && (
                    <div className="bg-slate-100 rounded-2xl p-4 my-3 flex justify-center max-w-full overflow-x-auto">
                      <svg viewBox="0 0 300 70" className="w-full max-w-[280px] sm:max-w-xs h-16 select-none shrink-0 overflow-visible">
                        <defs>
                          <marker
                            id="ask-arrow-right"
                            viewBox="0 0 10 10"
                            refX="6"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto"
                          >
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                          </marker>
                        </defs>

                        <text x="50" y="55" fontSize="22" fontWeight="black" fill="#1e293b" fontFamily="monospace">
                          {q.startStr}
                        </text>
                        <path
                          d="M 105 35 Q 165 8 225 35"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
                          markerEnd="url(#ask-arrow-right)"
                        />
                        <text x="165" y="16" fontSize="11" fontWeight="black" textAnchor="middle" fill="#d97706">
                          · {formatNumber(q.mult, locale)}
                        </text>
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
                        inputMode="decimal"
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
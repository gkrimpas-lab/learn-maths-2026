// pages/st-dimotikou/05-prosthesi-ask.js
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

function formatNum(val, locale = 'el', decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return locale === 'en' ? String(rounded) : String(rounded).replace('.', ',');
}

function renderFraction(num, den) {
  return (
    `<span class="inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">` +
    `<span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${num}</span>` +
    `<span class="pt-0.5 break-all">${den}</span>` +
    `</span>`
  );
}

function makeUniqueOptions(correct, wrongCandidates, fallbackGenerator) {
  const unique = new Set([String(correct)]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && String(opt).trim() !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  let attempts = 0;
  while (unique.size < 4 && attempts < 25) {
    attempts++;
    const generated = fallbackGenerator ? fallbackGenerator(unique.size) : null;
    if (generated !== null && generated !== undefined) {
      unique.add(String(generated));
    }
  }
  return shuffle(Array.from(unique));
}

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_add_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const p1 = 14.85;
      const p2 = 23.4;
      const p3 = 11.75;
      const sum = Number((p1 + p2 + p3).toFixed(2));
      const sumStr = `${formatNum(sum, locale)} €`;

      return {
        title: isEn ? 'SCHOOL SUPPLIES PURCHASE' : 'ΑΓΟΡΑ ΣΧΟΛΙΚΩΝ ΕΙΔΩΝ',
        instruction: isEn
          ? 'Calculate the total amount in euros (€):'
          : 'Υπολογίστε το συνολικό ποσό σε ευρώ (€) με κόμμα:',
        text: isEn
          ? `A customer bought three items costing ${formatNum(p1, locale)} €, ${formatNum(p2, locale)} €, and ${formatNum(p3, locale)} €. How many euros (€) did they pay in total?`
          : `Ένας αγοραστής αγόρασε τρία προϊόντα αξίας ${formatNum(p1, locale)} €, ${formatNum(p2, locale)} € και ${formatNum(p3, locale)} €. Πόσα ευρώ (€) πλήρωσε συνολικά;`,
        tableData: {
          col1: isEn ? 'Items 1 & 2' : 'Προϊόντα 1 & 2',
          col2: isEn ? 'Item 3' : 'Προϊόν 3',
          r1: [`${formatNum(p1, locale)} €`, `${formatNum(p3, locale)} €`],
          r2: [`${formatNum(p2, locale)} €`, isEn ? `Total: ${sumStr}` : `Σύνολο: ${sumStr}`]
        },
        correctVal: sum,
        correctStr: formatNum(sum, locale),
        explanation: isEn
          ? `Align decimal points and add: ${formatNum(p1, locale)} ＋ ${formatNum(p2, locale)} ＋ ${formatNum(p3, locale)} ＝ ${sumStr}.`
          : `Προσθέτουμε στοιχίζοντας τις υποδιαστολές: ${formatNum(p1, locale)} ＋ ${formatNum(p2, locale)} ＋ ${formatNum(p3, locale)} ＝ ${sumStr}.`
      };
    }
  },
  {
    id: 'p_add_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const w1 = 4.35;
      const w2 = 5.8;
      const w3 = 2.45;
      const sum = Number((w1 + w2 + w3).toFixed(2));
      const sumStr = `${formatNum(sum, locale)} kg`;

      return {
        title: isEn ? 'TOTAL FRUIT WEIGHT' : 'ΣΥΝΟΛΙΚΟ ΒΑΡΟΣ ΦΡΟΥΤΩΝ',
        instruction: isEn
          ? 'Calculate total weight in kilograms (kg):'
          : 'Υπολογίστε το συνολικό βάρος σε κιλά (kg) με κόμμα:',
        text: isEn
          ? `A grocer weighed three crates of fruit weighing ${formatNum(w1, locale)} kg, ${formatNum(w2, locale)} kg, and ${formatNum(w3, locale)} kg respectively. How many kilograms (kg) do they weigh in total?`
          : `Ένας μανάβης ζύγισε τρία τελάρα με φρούτα που είχαν βάρη ${formatNum(w1, locale)} kg, ${formatNum(w2, locale)} kg και ${formatNum(w3, locale)} kg αντίστοιχα. Πόσα κιλά (kg) ζυγίζουν συνολικά;`,
        tableData: {
          col1: isEn ? 'Crates 1 & 2' : 'Τελάρα 1 & 2',
          col2: isEn ? 'Crate 3' : 'Τελάρο 3',
          r1: [`${formatNum(w1, locale)} kg`, `${formatNum(w3, locale)} kg`],
          r2: [`${formatNum(w2, locale)} kg`, isEn ? `Total: ${sumStr}` : `Σύνολο: ${sumStr}`]
        },
        correctVal: sum,
        correctStr: formatNum(sum, locale),
        explanation: isEn
          ? `Add the weights: ${formatNum(w1, locale)} ＋ ${formatNum(w2, locale)} ＋ ${formatNum(w3, locale)} ＝ ${sumStr}.`
          : `Προσθέτουμε τα βάρη: ${formatNum(w1, locale)} ＋ ${formatNum(w2, locale)} ＋ ${formatNum(w3, locale)} ＝ ${sumStr}.`
      };
    }
  },
  {
    id: 'p_add_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const d1 = 12.4;
      const d2 = 8.75;
      const d3 = 15.6;
      const sum = Number((d1 + d2 + d3).toFixed(2));
      const sumStr = `${formatNum(sum, locale)} km`;

      return {
        title: isEn ? 'TOTAL HIKING DISTANCE' : 'ΣΥΝΟΛΙΚΗ ΑΠΟΣΤΑΣΗ ΠΕΖΟΠΟΡΙΑΣ',
        instruction: isEn
          ? 'Calculate total distance in kilometers (km):'
          : 'Υπολογίστε τη συνολική απόσταση σε χιλιόμετρα (km) με κόμμα:',
        text: isEn
          ? `A hiking group covered ${formatNum(d1, locale)} km on the first day, ${formatNum(d2, locale)} km on the second, and ${formatNum(d3, locale)} km on the third. What is the total distance in kilometers (km)?`
          : `Μια ομάδα πεζοπόρων διένυσε ${formatNum(d1, locale)} km την πρώτη ημέρα, ${formatNum(d2, locale)} km τη δεύτερη και ${formatNum(d3, locale)} km την τρίτη. Πόσα χιλιόμετρα (km) διένυσε συνολικά;`,
        tableData: {
          col1: isEn ? 'Days 1 & 2' : '1η & 2η Ημέρα',
          col2: isEn ? 'Day 3' : '3η Ημέρα',
          r1: [`${formatNum(d1, locale)} km`, `${formatNum(d3, locale)} km`],
          r2: [`${formatNum(d2, locale)} km`, isEn ? `Total: ${sumStr}` : `Σύνολο: ${sumStr}`]
        },
        correctVal: sum,
        correctStr: formatNum(sum, locale),
        explanation: isEn
          ? `Add the distances: ${formatNum(d1, locale)} ＋ ${formatNum(d2, locale)} ＋ ${formatNum(d3, locale)} ＝ ${sumStr}.`
          : `Προσθέτουμε τις αποστάσεις: ${formatNum(d1, locale)} ＋ ${formatNum(d2, locale)} ＋ ${formatNum(d3, locale)} ＝ ${sumStr}.`
      };
    }
  },
  {
    id: 'p_add_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const m1 = 3.65;
      const m2 = 4.2;
      const m3 = 2.15;
      const sum = Number((m1 + m2 + m3).toFixed(2));
      const sumStr = `${formatNum(sum, locale)} m`;

      return {
        title: isEn ? 'TOTAL FABRIC LENGTH' : 'ΣΥΝΟΛΙΚΟ ΜΗΚΟΣ ΥΦΑΣΜΑΤΟΣ',
        instruction: isEn
          ? 'Calculate total length in meters (m):'
          : 'Υπολογίστε το συνολικό μήκος σε μέτρα (m) με κόμμα:',
        text: isEn
          ? `A tailor used three pieces of fabric measuring ${formatNum(m1, locale)} m, ${formatNum(m2, locale)} m, and ${formatNum(m3, locale)} m. How many meters (m) of fabric did she use in total?`
          : `Μια μοδίστρα χρησιμοποίησε τρία κομμάτια υφάσματος με μήκη ${formatNum(m1, locale)} m, ${formatNum(m2, locale)} m και ${formatNum(m3, locale)} m. Πόσα μέτρα (m) υφάσματος χρησιμοποίησε συνολικά;`,
        tableData: {
          col1: isEn ? 'Pieces 1 & 2' : 'Κομμάτια 1 & 2',
          col2: isEn ? 'Piece 3' : 'Κομμάτι 3',
          r1: [`${formatNum(m1, locale)} m`, `${formatNum(m3, locale)} m`],
          r2: [`${formatNum(m2, locale)} m`, isEn ? `Total: ${sumStr}` : `Σύνολο: ${sumStr}`]
        },
        correctVal: sum,
        correctStr: formatNum(sum, locale),
        explanation: isEn
          ? `Align decimal points: ${formatNum(m1, locale)} ＋ ${formatNum(m2, locale)} ＋ ${formatNum(m3, locale)} ＝ ${sumStr}.`
          : `Στοιχίζουμε τις υποδιαστολές: ${formatNum(m1, locale)} ＋ ${formatNum(m2, locale)} ＋ ${formatNum(m3, locale)} ＝ ${sumStr}.`
      };
    }
  },
  {
    id: 'p_add_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const v1 = 1.75;
      const v2 = 2.5;
      const v3 = 0.85;
      const sum = Number((v1 + v2 + v3).toFixed(2));
      const sumStr = `${formatNum(sum, locale)} L`;

      return {
        title: isEn ? 'TOTAL LIQUID VOLUME' : 'ΣΥΝΟΛΙΚΟΣ ΟΓΚΟΣ ΥΓΡΩΝ',
        instruction: isEn
          ? 'Calculate total volume in liters (L):'
          : 'Υπολογίστε τον συνολικό όγκο σε λίτρα (L) με κόμμα:',
        text: isEn
          ? `In a container, ${formatNum(v1, locale)} L of orange juice, ${formatNum(v2, locale)} L of water, and ${formatNum(v3, locale)} L of syrup were mixed. How many liters (L) does the mixture yield?`
          : `Σε ένα μεγάλο δοχείο αναμείχθηκαν ${formatNum(v1, locale)} L χυμός πορτοκάλι, ${formatNum(v2, locale)} L νερό και ${formatNum(v3, locale)} L σιρόπι. Πόσα λίτρα (L) μείγματος προέκυψαν;`,
        tableData: {
          col1: isEn ? 'Juice & Water' : 'Χυμός & Νερό',
          col2: isEn ? 'Syrup' : 'Σιρόπι',
          r1: [`${formatNum(v1, locale)} L`, `${formatNum(v3, locale)} L`],
          r2: [`${formatNum(v2, locale)} L`, isEn ? `Total: ${sumStr}` : `Σύνολο: ${sumStr}`]
        },
        correctVal: sum,
        correctStr: formatNum(sum, locale),
        explanation: isEn
          ? `Add: ${formatNum(v1, locale)} ＋ ${formatNum(v2, locale)} ＋ ${formatNum(v3, locale)} ＝ ${sumStr}.`
          : `Προσθέτουμε: ${formatNum(v1, locale)} ＋ ${formatNum(v2, locale)} ＋ ${formatNum(v3, locale)} ＝ ${sumStr}.`
      };
    }
  },
  {
    id: 'p_add_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const e1 = 35.5;
      const e2 = 18.75;
      const e3 = 24.25;
      const sum = Number((e1 + e2 + e3).toFixed(2));
      const sumStr = `${formatNum(sum, locale)} €`;

      return {
        title: isEn ? 'BUILDING UTILITY BILLS' : 'ΛΟΓΑΡΙΑΣΜΟΙ ΚΟΙΝΟΧΡΗΣΤΩΝ',
        instruction: isEn
          ? 'Calculate total amount in euros (€):'
          : 'Υπολογίστε το συνολικό ποσό σε ευρώ (€) με κόμμα:',
        text: isEn
          ? `Building expenses included ${formatNum(e1, locale)} € for cleaning, ${formatNum(e2, locale)} € for electricity, and ${formatNum(e3, locale)} € for elevator maintenance. What is the total amount in euros (€)?`
          : `Για τα κοινόχρηστα μιας πολυκατοικίας πληρώθηκαν ${formatNum(e1, locale)} € για καθαρισμό, ${formatNum(e2, locale)} € για ηλεκτρικό ρεύμα και ${formatNum(e3, locale)} € για συντήρηση ανελκυστήρα. Ποιο είναι το συνολικό ποσό σε ευρώ (€);`,
        tableData: {
          col1: isEn ? 'Cleaning & Power' : 'Καθαρισμός & Ρεύμα',
          col2: isEn ? 'Elevator' : 'Ανελκυστήρας',
          r1: [`${formatNum(e1, locale)} €`, `${formatNum(e3, locale)} €`],
          r2: [`${formatNum(e2, locale)} €`, isEn ? `Total: ${sumStr}` : `Σύνολο: ${sumStr}`]
        },
        correctVal: sum,
        correctStr: formatNum(sum, locale),
        explanation: isEn
          ? `Add: ${formatNum(e1, locale)} ＋ ${formatNum(e2, locale)} ＋ ${formatNum(e3, locale)} ＝ ${sumStr}.`
          : `Προσθέτουμε: ${formatNum(e1, locale)} ＋ ${formatNum(e2, locale)} ＋ ${formatNum(e3, locale)} ＝ ${sumStr}.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_add_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const totalKm = 42.5;
      const part1Km = 18.25;
      const part2Km = 14.8;
      const remainKm = Number((totalKm - (part1Km + part2Km)).toFixed(2));
      const correctStr = `${formatNum(remainKm, locale)} km`;
      const fake1 = `${formatNum(Number((remainKm + 2.4).toFixed(2)), locale)} km`;
      const fake2 = `${formatNum(Number((Math.max(1, remainKm - 1.5)).toFixed(2)), locale)} km`;
      const fake3 = `${formatNum(Number((remainKm + 5.2).toFixed(2)), locale)} km`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((remainKm + (i + 1) * 1.8).toFixed(2)), locale)} km`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'COMPLEX ROUTE PROBLEM' : 'ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΔΙΑΔΡΟΜΗΣ',
        instruction: isEn
          ? 'Select the remaining distance in kilometers (km):'
          : 'Επιλέξτε την υπολειπόμενη απόσταση σε χιλιόμετρα (km):',
        text: isEn
          ? `A cycling course has a total length of ${formatNum(totalKm, locale)} km. A cyclist rode ${formatNum(part1Km, locale)} km in section 1 and ${formatNum(part2Km, locale)} km in section 2. How many kilometers (km) remain to the finish line?`
          : `Μια διαδρομή ποδηλασίας έχει συνολικό μήκος ${formatNum(totalKm, locale)} km. Ένας ποδηλάτης διένυσε ${formatNum(part1Km, locale)} km στο 1ο τμήμα και ${formatNum(part2Km, locale)} km στο 2ο τμήμα. Πόσα χιλιόμετρα (km) του απομένουν για τον τερματισμό;`,
        tableData: {
          col1: isEn ? 'Total Route' : 'Συνολική Διαδρομή',
          col2: isEn ? '1st & 2nd Section' : '1ο & 2ο Τμήμα',
          r1: [`${formatNum(totalKm, locale)} km`, `${formatNum(part1Km, locale)} km`],
          r2: [isEn ? 'Remaining' : 'Υπόλοιπο', `${formatNum(part2Km, locale)} km`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Sum the first two sections: ${formatNum(part1Km, locale)} ＋ ${formatNum(part2Km, locale)} ＝ ${formatNum(part1Km + part2Km, locale)} km. Subtract from total: ${formatNum(totalKm, locale)} － ${formatNum(part1Km + part2Km, locale)} ＝ ${correctStr}.`
          : `Προσθέτουμε τα δύο πρώτα τμήματα: ${formatNum(part1Km, locale)} ＋ ${formatNum(part2Km, locale)} ＝ ${formatNum(part1Km + part2Km, locale)} km. Αφαιρούμε από το σύνολο: ${formatNum(totalKm, locale)} － ${formatNum(part1Km + part2Km, locale)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_add_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const rollM = 25.5;
      const usedM1 = 8.75;
      const usedM2 = 6.4;
      const usedTotal = Number((usedM1 + usedM2).toFixed(2));
      const remainM = Number((rollM - usedTotal).toFixed(2));
      const correctStr = `${formatNum(remainM, locale)} m`;
      const fake1 = `${formatNum(Number((remainM + 1.2).toFixed(2)), locale)} m`;
      const fake2 = `${formatNum(Number((Math.max(1, remainM - 2.5)).toFixed(2)), locale)} m`;
      const fake3 = `${formatNum(Number((remainM + 3.4).toFixed(2)), locale)} m`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((remainM + (i + 1) * 1.5).toFixed(2)), locale)} m`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'FABRIC ROLL REMAINDER' : 'ΥΠΟΛΟΙΠΟ ΡΟΛΟΥ ΥΦΑΣΜΑΤΟΣ',
        instruction: isEn
          ? 'Select the remaining fabric in meters (m):'
          : 'Επιλέξτε το ύφασμα που απέμεινε σε μέτρα (m):',
        text: isEn
          ? `From a fabric roll ${formatNum(rollM, locale)} m long, two pieces were cut: the first measuring ${formatNum(usedM1, locale)} m and the second ${formatNum(usedM2, locale)} m. How many meters (m) of fabric remain on the roll?`
          : `Από ένα ρολό υφάσματος μήκους ${formatNum(rollM, locale)} m κόπηκαν δύο κομμάτια: το πρώτο μήκους ${formatNum(usedM1, locale)} m και το δεύτερο ${formatNum(usedM2, locale)} m. Πόσα μέτρα (m) υφάσματος έμειναν στο ρολό;`,
        tableData: {
          col1: isEn ? 'Initial Roll' : 'Αρχικό Ρολό',
          col2: isEn ? 'Cut Pieces' : 'Κομμάτια που κόπηκαν',
          r1: [`${formatNum(rollM, locale)} m`, `${formatNum(usedM1, locale)} m`],
          r2: [isEn ? 'Remaining' : 'Υπόλοιπο', `${formatNum(usedM2, locale)} m`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Total cut fabric: ${formatNum(usedM1, locale)} ＋ ${formatNum(usedM2, locale)} ＝ ${formatNum(usedTotal, locale)} m. Remainder: ${formatNum(rollM, locale)} － ${formatNum(usedTotal, locale)} ＝ ${correctStr}.`
          : `Συνολικό ύφασμα που κόπηκε: ${formatNum(usedM1, locale)} ＋ ${formatNum(usedM2, locale)} ＝ ${formatNum(usedTotal, locale)} m. Υπόλοιπο: ${formatNum(rollM, locale)} － ${formatNum(usedTotal, locale)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_add_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const budget = 50;
      const b1 = 12.45;
      const b2 = 18.8;
      const b3 = 9.25;
      const spent = Number((b1 + b2 + b3).toFixed(2));
      const change = Number((budget - spent).toFixed(2));
      const correctStr = `${formatNum(change, locale)} €`;
      const fake1 = `${formatNum(Number((change + 1.5).toFixed(2)), locale)} €`;
      const fake2 = `${formatNum(Number((Math.max(0.5, change - 1.2)).toFixed(2)), locale)} €`;
      const fake3 = `${formatNum(Number((change + 3).toFixed(2)), locale)} €`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((change + (i + 1) * 1.1).toFixed(2)), locale)} €`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'TRANSACTION WITH CHANGE' : 'ΣΥΝΑΛΛΑΓΗ ΜΕ ΡΕΣΤΑ',
        instruction: isEn
          ? 'Select the correct change in euros (€):'
          : 'Επιλέξτε το σωστό ποσό ρέστων σε ευρώ (€):',
        text: isEn
          ? `A shopper purchased three items priced at ${formatNum(b1, locale)} €, ${formatNum(b2, locale)} €, and ${formatNum(b3, locale)} €. They paid with a 50 € note. How much change (€) did they receive?`
          : `Ένας πελάτης αγόρασε τρία είδη αξίας ${formatNum(b1, locale)} €, ${formatNum(b2, locale)} € και ${formatNum(b3, locale)} €. Πλήρωσε με χαρτονόμισμα των 50 €. Πόσα ρέστα (€) έλαβε;`,
        tableData: {
          col1: isEn ? 'Three Items' : 'Τρία Είδη',
          col2: isEn ? 'Payment 50 €' : 'Πληρωμή 50 €',
          r1: [`${formatNum(b1, locale)} € ＋ ${formatNum(b2, locale)} €`, `＋ ${formatNum(b3, locale)} €`],
          r2: [isEn ? `Total: ${formatNum(spent, locale)} €` : `Σύνολο: ${formatNum(spent, locale)} €`, isEn ? `Change: ${correctStr}` : `Ρέστα: ${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Total purchase: ${formatNum(b1, locale)} ＋ ${formatNum(b2, locale)} ＋ ${formatNum(b3, locale)} ＝ ${formatNum(spent, locale)} €. Change: 50.00 － ${formatNum(spent, locale)} ＝ ${correctStr}.`
          : `Σύνολο αγορών: ${formatNum(b1, locale)} ＋ ${formatNum(b2, locale)} ＋ ${formatNum(b3, locale)} ＝ ${formatNum(spent, locale)} €. Ρέστα: 50,00 － ${formatNum(spent, locale)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_add_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const maxLoadKg = 30;
      const b1Kg = 8.75;
      const b2Kg = 12.4;
      const currentLoad = Number((b1Kg + b2Kg).toFixed(2));
      const remainLoad = Number((maxLoadKg - currentLoad).toFixed(2));
      const correctStr = `${formatNum(remainLoad, locale)} kg`;
      const fake1 = `${formatNum(Number((remainLoad + 1.5).toFixed(2)), locale)} kg`;
      const fake2 = `${formatNum(Number((Math.max(1, remainLoad - 2)).toFixed(2)), locale)} kg`;
      const fake3 = `${formatNum(Number((remainLoad + 3.2).toFixed(2)), locale)} kg`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((remainLoad + (i + 1) * 1.4).toFixed(2)), locale)} kg`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'PERMISSIBLE CARGO WEIGHT' : 'ΕΠΙΤΡΕΠΟΜΕΝΟ ΒΑΡΟΣ ΦΟΡΤΙΟΥ',
        instruction: isEn
          ? 'Select how many kilograms (kg) can still be loaded:'
          : 'Επιλέξτε πόσα κιλά (kg) επιτρέπεται να προστεθούν ακόμη:',
        text: isEn
          ? `A cart has a maximum capacity of ${maxLoadKg} kg. Two boxes weighing ${formatNum(b1Kg, locale)} kg and ${formatNum(b2Kg, locale)} kg were placed in it. How many more kilograms (kg) can still be loaded?`
          : `Ένα καρότσι αντέχει μέγιστο βάρος ${maxLoadKg} kg. Τοποθετήθηκαν δύο κιβώτια με βάρη ${formatNum(b1Kg, locale)} kg και ${formatNum(b2Kg, locale)} kg. Πόσα κιλά (kg) επιτρέπεται να φορτωθούν ακόμη;`,
        tableData: {
          col1: isEn ? 'Maximum Load' : 'Μέγιστο Βάρος',
          col2: isEn ? 'Loaded Boxes' : 'Φορτωμένα Κιβώτια',
          r1: [`${maxLoadKg} kg`, `${formatNum(b1Kg, locale)} kg ＋ ${formatNum(b2Kg, locale)} kg`],
          r2: [isEn ? 'Margin' : 'Περιθώριο', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Loaded weight: ${formatNum(b1Kg, locale)} ＋ ${formatNum(b2Kg, locale)} ＝ ${formatNum(currentLoad, locale)} kg. Remainder: ${maxLoadKg} － ${formatNum(currentLoad, locale)} ＝ ${correctStr}.`
          : `Φορτωμένο βάρος: ${formatNum(b1Kg, locale)} ＋ ${formatNum(b2Kg, locale)} ＝ ${formatNum(currentLoad, locale)} kg. Υπόλοιπο: ${maxLoadKg} － ${formatNum(currentLoad, locale)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_add_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const capL = 100;
      const f1L = 34.6;
      const f2L = 42.85;
      const currentL = Number((f1L + f2L).toFixed(2));
      const needL = Number((capL - currentL).toFixed(2));
      const correctStr = `${formatNum(needL, locale)} L`;
      const fake1 = `${formatNum(Number((needL + 2.5).toFixed(2)), locale)} L`;
      const fake2 = `${formatNum(Number((Math.max(1, needL - 1.8)).toFixed(2)), locale)} L`;
      const fake3 = `${formatNum(Number((needL + 4).toFixed(2)), locale)} L`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((needL + (i + 1) * 1.6).toFixed(2)), locale)} L`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'FILLING A WATER TANK' : 'ΠΛΗΡΩΣΗ ΔΕΞΑΜΕΝΗΣ ΝΕΡΟΥ',
        instruction: isEn
          ? 'Select how many liters (L) are needed to fill the tank:'
          : 'Επιλέξτε πόσα λίτρα (L) χρειάζονται για να γεμίσει η δεξαμενή:',
        text: isEn
          ? `A water tank with a capacity of ${capL} L already contains two amounts: ${formatNum(f1L, locale)} L and ${formatNum(f2L, locale)} L. How many liters (L) are still needed to fill it completely?`
          : `Μια δεξαμενή χωρητικότητας ${capL} L περιέχει ήδη δύο ποσότητες νερού: ${formatNum(f1L, locale)} L και ${formatNum(f2L, locale)} L. Πόσα λίτρα (L) νερού χρειάζονται ακόμη για να γεμίσει πλήρως;`,
        tableData: {
          col1: isEn ? 'Capacity' : 'Χωρητικότητα',
          col2: isEn ? 'Current Water' : 'Υπάρχον Νερό',
          r1: [`${capL} L`, `${formatNum(f1L, locale)} L ＋ ${formatNum(f2L, locale)} L`],
          r2: [isEn ? 'Needed' : 'Απομένουν', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Existing water: ${formatNum(f1L, locale)} ＋ ${formatNum(f2L, locale)} ＝ ${formatNum(currentL, locale)} L. Needed: 100.00 － ${formatNum(currentL, locale)} ＝ ${correctStr}.`
          : `Υπάρχον νερό: ${formatNum(f1L, locale)} ＋ ${formatNum(f2L, locale)} ＝ ${formatNum(currentL, locale)} L. Χρειάζονται: 100,00 － ${formatNum(currentL, locale)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_add_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const targetSavings = 80;
      const w1 = 28.5;
      const w2 = 31.75;
      const saved = Number((w1 + w2).toFixed(2));
      const remain = Number((targetSavings - saved).toFixed(2));
      const correctStr = `${formatNum(remain, locale)} €`;
      const fake1 = `${formatNum(Number((remain + 2.5).toFixed(2)), locale)} €`;
      const fake2 = `${formatNum(Number((Math.max(1, remain - 2)).toFixed(2)), locale)} €`;
      const fake3 = `${formatNum(Number((remain + 4.5).toFixed(2)), locale)} €`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((remain + (i + 1) * 1.5).toFixed(2)), locale)} €`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'SAVINGS GOAL' : 'ΣΤΟΧΟΣ ΑΠΟΤΑΜΙΕΥΣΗΣ',
        instruction: isEn
          ? 'Select the remaining amount needed in euros (€):'
          : 'Επιλέξτε το ποσό που απομένει για τον στόχο σε ευρώ (€):',
        text: isEn
          ? `A child wants to save ${targetSavings} € for a game. In the 1st week she saved ${formatNum(w1, locale)} € and in the 2nd week ${formatNum(w2, locale)} €. How many euros (€) is she still missing?`
          : `Ένα παιδί θέλει να συγκεντρώσει ${targetSavings} € για ένα παιχνίδι. Την 1η εβδομάδα μάζεψε ${formatNum(w1, locale)} € και τη 2η εβδομάδα ${formatNum(w2, locale)} €. Πόσα ευρώ (€) του λείπουν ακόμη;`,
        tableData: {
          col1: isEn ? 'Goal' : 'Στόχος',
          col2: isEn ? 'Savings' : 'Αποταμιεύσεις',
          r1: [`${targetSavings} €`, `${formatNum(w1, locale)} € ＋ ${formatNum(w2, locale)} €`],
          r2: [isEn ? 'Remaining' : 'Υπόλοιπο', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Savings: ${formatNum(w1, locale)} ＋ ${formatNum(w2, locale)} ＝ ${formatNum(saved, locale)} €. Remaining: 80.00 － ${formatNum(saved, locale)} ＝ ${correctStr}.`
          : `Αποταμιεύσεις: ${formatNum(w1, locale)} ＋ ${formatNum(w2, locale)} ＝ ${formatNum(saved, locale)} €. Υπολείπονται: 80,00 － ${formatNum(saved, locale)} ＝ ${correctStr}.`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const sep = isEn ? '.' : ',';
  const qList = [];

  // Q1 (Input - Decimal): Κάθετη Πρόσθεση Δεκαδικών
  {
    const q1IntA = randInt(12, 65);
    const q1DecA = randInt(1, 9) * 10 + randInt(1, 9);
    const q1IntB = randInt(8, 35);
    const q1DecB = randInt(1, 9);
    const q1AStr = `${q1IntA}${sep}${q1DecA}`;
    const q1BStr = `${q1IntB}${sep}${q1DecB}`;
    const q1ValA = q1IntA + q1DecA / 100;
    const q1ValB = q1IntB + q1DecB / 10;
    const q1Correct = Number((q1ValA + q1ValB).toFixed(2));
    const q1CorrectStr = formatNum(q1Correct, locale);

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 1 • COLUMN ADDITION OF DECIMALS' : 'ΕΡΩΤΗΣΗ 1 • ΚΑΘΕΤΗ ΠΡΟΣΘΕΣΗ ΔΕΚΑΔΙΚΩΝ',
      instruction: isEn
        ? 'Calculate the sum of decimal numbers:'
        : 'Υπολογίστε το άθροισμα των δεκαδικών αριθμών με κόμμα:',
      prompt: isEn ? `Calculate the sum: ${q1AStr} ＋ ${q1BStr};` : `Υπολογίστε το άθροισμα: ${q1AStr} ＋ ${q1BStr};`,
      correctVal: q1Correct,
      correctStr: q1CorrectStr,
      explanation: isEn
        ? `Appending trailing zero to align decimals: ${q1AStr} ＋ ${q1BStr}0 ＝ ${q1CorrectStr}.`
        : `Συμπληρώνοντας μηδενικό στο τέλος του 2ου αριθμού: ${q1AStr} ＋ ${q1BStr}0 ＝ ${q1CorrectStr}.`
    });
  }

  // Q2 (Input - Decimal): Εύρεση άγνωστου προσθετέου μέσω αφαίρεσης
  {
    const q2Int = randInt(15, 80);
    const q2Dec = randInt(1, 9) * 10;
    const q2SumInt = q2Int + randInt(10, 40);
    const q2AStr = `${q2Int}${sep}${q2Dec / 10}`;
    const q2SumStr = `${q2SumInt}${sep}${q2Dec / 10 + 5 > 9 ? 8 : q2Dec / 10 + 5}`;
    const q2ValA = parseFloat(q2AStr.replace(',', '.'));
    const q2ValSum = parseFloat(q2SumStr.replace(',', '.'));
    const q2Correct = Number((q2ValSum - q2ValA).toFixed(2));
    const q2CorrectStr = formatNum(q2Correct, locale);

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 2 • UNKNOWN ADDEND' : 'ΕΡΩΤΗΣΗ 2 • ΑΓΝΩΣΤΟΣ ΠΡΟΣΘΕΤΕΟΣ',
      instruction: isEn
        ? 'Find the missing number in the equality:'
        : 'Βρείτε τον αριθμό που λείπει από την ισότητα με κόμμα:',
      prompt: isEn ? `In the equality ${q2AStr} ＋ x ＝ ${q2SumStr}, what is the value of x?` : `Στην ισότητα ${q2AStr} ＋ χ ＝ ${q2SumStr}, ποια είναι η τιμή του χ;`,
      correctVal: q2Correct,
      correctStr: q2CorrectStr,
      explanation: isEn
        ? `Use subtraction as the inverse operation: x ＝ ${q2SumStr} － ${q2AStr} ＝ ${q2CorrectStr}.`
        : `Χρησιμοποιούμε την αφαίρεση ως αντίστροφη πράξη: χ ＝ ${q2SumStr} － ${q2AStr} ＝ ${q2CorrectStr}.`
    });
  }

  // Q3 (MCQ): Αντιμεταθετική Ιδιότητα (4 μοναδικές επιλογές)
  {
    const q3A = `${randInt(10, 40)}${sep}${randInt(1, 9)}`;
    const q3B = `${randInt(10, 40)}${sep}${randInt(11, 89)}`;
    const q3CorrectOption = `${q3B} ＋ ${q3A}`;
    const q3Wrong1 = `${q3B} － ${q3A}`;
    const q3Wrong2 = `${q3A} － ${q3B}`;
    const q3Wrong3 = `${q3A} · ${q3B}`;

    const uniqueOptions = makeUniqueOptions(q3CorrectOption, [q3Wrong1, q3Wrong2, q3Wrong3], (i) =>
      `${q3B} ＋ ${i}`
    );
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === q3CorrectOption
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • COMMUTATIVE PROPERTY' : 'ΕΡΩΤΗΣΗ 3 • ΑΝΤΙΜΕΤΑΘΕΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      instruction: isEn
        ? 'Select the equivalent expression by the commutative property:'
        : 'Επιλέξτε την ίση παράσταση σύμφωνα με την αντιμεταθετική ιδιότητα:',
      prompt: isEn
        ? `According to the commutative property, ${q3A} ＋ ${q3B} is equal to:`
        : `Σύμφωνα με την αντιμεταθετική ιδιότητα, η παράσταση ${q3A} ＋ ${q3B} είναι ίση με:`,
      options,
      correctText: q3CorrectOption,
      explanation: isEn
        ? `The commutative property states that a ＋ b ＝ b ＋ a. Thus ${q3A} ＋ ${q3B} ＝ ${q3CorrectOption}.`
        : `Η αντιμεταθετική ιδιότητα ορίζει ότι α ＋ β ＝ β ＋ α. Άρα ${q3A} ＋ ${q3B} ＝ ${q3CorrectOption}.`
    });
  }

  // Q4 (MCQ): Προσεταιριστική Ιδιότητα (4 μοναδικές επιλογές)
  {
    const q4A = `${randInt(2, 8)}${sep}25`;
    const q4B = `${randInt(10, 30)}${sep}6`;
    const q4C = `${randInt(1, 5)}${sep}75`;
    const valA = parseFloat(q4A.replace(',', '.'));
    const valB = parseFloat(q4B.replace(',', '.'));
    const valC = parseFloat(q4C.replace(',', '.'));
    const correctSumNum = Number((valA + valB + valC).toFixed(2));
    const q4CorrectSum = formatNum(correctSumNum, locale);

    const w1 = formatNum(correctSumNum + 1, locale);
    const w2 = formatNum(Math.max(1, correctSumNum - 0.5), locale);
    const w3 = formatNum(correctSumNum + 0.1, locale);

    const uniqueOptions = makeUniqueOptions(q4CorrectSum, [w1, w2, w3], (i) =>
      formatNum(correctSumNum + (i + 1) * 0.7, locale)
    );
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === q4CorrectSum
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • ASSOCIATIVE PROPERTY' : 'ΕΡΩΤΗΣΗ 4 • ΠΡΟΣΕΤΑΙΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
      instruction: isEn
        ? 'Calculate the sum by grouping complements:'
        : 'Υπολογίστε έξυπνα το άθροισμα ομαδοποιώντας τα συμπληρώματα:',
      prompt: isEn
        ? `Calculate the sum: (${q4A} ＋ ${q4C}) ＋ ${q4B};`
        : `Υπολογίστε το άθροισμα: (${q4A} ＋ ${q4C}) ＋ ${q4B};`,
      options,
      correctText: q4CorrectSum,
      explanation: isEn
        ? `Add complements first: ${q4A} ＋ ${q4C} ＝ ${formatNum(valA + valC, locale)}. Then add ${q4B}: ${formatNum(valA + valC, locale)} ＋ ${q4B} ＝ ${q4CorrectSum}.`
        : `Προσθέτουμε πρώτα τα συμπληρώματα: ${q4A} ＋ ${q4C} ＝ ${formatNum(valA + valC, locale)}. Στη συνέχεια προσθέτουμε το ${q4B}: ${formatNum(valA + valC, locale)} ＋ ${q4B} ＝ ${q4CorrectSum}.`
    });
  }

  // Q5 (MCQ): Στοίχιση υποδιαστολών (4 μοναδικές επιλογές)
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? 'When adding decimals in vertical columns, we place the decimal points directly in the same vertical column.'
          : 'When adding decimals in vertical columns, we always align the last digit on the right regardless of decimal points.')
      : (q5IsTrue
          ? 'Κατά την κάθετη πρόσθεση δεκαδικών αριθμών, τοποθετούμε τις υποδιαστολές ακριβώς στην ίδια κατακόρυφη στήλη.'
          : 'Κατά την κάθετη πρόσθεση δεκαδικών αριθμών, στοιχίζουμε πάντα το τελευταίο ψηφίο στα δεξιά ανεξάρτητα από την υποδιαστολή.');

    const c1 = isEn
      ? 'True: Aligning decimal points vertically ensures corresponding place values are correctly added.'
      : 'Σωστό: Η κατακόρυφη στοίχιση των υποδιαστολών διασφαλίζει την πρόσθεση των ομώνυμων τάξεων.';
    const c2 = isEn
      ? 'False: We never align by the rightmost digit in decimals, but strictly by the decimal point.'
      : 'Λάθος: Στους δεκαδικούς δεν στοιχίζουμε ποτέ δεξιά, αλλά αυστηρά με βάση την υποδιαστολή.';
    const w1 = isEn
      ? 'True: We always align the first left digit and ignore the decimal points completely.'
      : 'Σωστό: Στοιχίζουμε πάντα το πρώτο αριστερό ψηφίο αγνοώντας εντελώς τις υποδιαστολές.';
    const w2 = isEn
      ? 'False: Adding decimals vertically is mathematically impossible without converting to fractions.'
      : 'Λάθος: Η κάθετη πρόσθεση δεκαδικών είναι αδύνατη χωρίς προηγούμενη μετατροπή σε κλάσματα.';

    const correctAns = q5IsTrue ? c1 : c2;
    const optionsPool = q5IsTrue ? [c1, c2, w1, w2] : [c2, c1, w1, w2];
    const uniqueOptions = makeUniqueOptions(correctAns, optionsPool);
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === correctAns
    }));

    qList.push({
      id: 5,
      type: 'mcq',
      title: isEn ? 'QUESTION 5 • DECIMAL POINT ALIGNMENT' : 'ΕΡΩΤΗΣΗ 5 • ΣΤΟΙΧΙΣΗ ΥΠΟΔΙΑΣΤΟΛΗΣ',
      instruction: isEn ? 'Select the correct statement evaluation:' : 'Επιλέξτε τη σωστή αξιολόγηση της πρότασης:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? 'Correct! Aligning decimal points ensures that we add corresponding place values (tenths to tenths, units to units).'
            : 'False! With decimal numbers we always align decimal points, never the last digits.')
        : (q5IsTrue
            ? 'Σωστό! Η στοίχιση των υποδιαστολών εξασφαλίζει ότι προσθέτουμε ομώνυμες τάξεις (δέκατα με δέκατα, μονάδες με μονάδες).'
            : 'Λάθος! Στους δεκαδικούς αριθμούς στοιχίζουμε πάντα τις υποδιαστολές, ποτέ τα τελευταία ψηφία.')
    });
  }

  // Q6 (MCQ): Αφαίρεση ως αντίθετη πράξη / Δοκιμή (4 μοναδικές επιλογές)
  {
    const q6A = randInt(10, 50);
    const q6B = randInt(5, 25);
    const q6Sum = q6A + q6B;
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? `If ${q6A} ＋ ${q6B} ＝ ${q6Sum}, then it is always true that ${q6Sum} － ${q6B} ＝ ${q6A}.`
          : `If ${q6A} ＋ ${q6B} ＝ ${q6Sum}, then the operation ${q6Sum} ＋ ${q6B} verifies the addition.`)
      : (q6IsTrue
          ? `Αν ${q6A} ＋ ${q6B} ＝ ${q6Sum}, τότε ισχύει πάντα ότι ${q6Sum} － ${q6B} ＝ ${q6A}.`
          : `Αν ${q6A} ＋ ${q6B} ＝ ${q6Sum}, τότε η πράξη ${q6Sum} ＋ ${q6B} αποτελεί τη δοκιμή της πρόσθεσης.`);

    const c1 = isEn
      ? `True: Subtraction is the inverse operation of addition (${q6Sum} － ${q6B} ＝ ${q6A}).`
      : `Σωστό: Η αφαίρεση είναι η αντίστροφη πράξη της πρόσθεσης (${q6Sum} － ${q6B} ＝ ${q6A}).`;
    const c2 = isEn
      ? 'False: Verification of addition is performed by subtracting an addend from the sum, not by adding.'
      : 'Λάθος: Η δοκιμή της πρόσθεσης γίνεται με αφαίρεση ενός προσθετέου από το άθροισμα (όχι με πρόσθεση).';
    const w1 = isEn
      ? 'True: Adding the sum to an addend always checks the arithmetic correctness.'
      : 'Σωστό: Η πρόσθεση του αθροίσματος με έναν προσθετέο επιβεβαιώνει πάντοτε το αποτέλεσμα.';
    const w2 = isEn
      ? 'False: Verification requires multiplying the two addends together.'
      : 'Λάθος: Η δοκιμή της πρόσθεσης απαιτεί υποχρεωτικά τον πολλαπλασιασμό των δύο προσθετέων.';

    const correctAns = q6IsTrue ? c1 : c2;
    const optionsPool = q6IsTrue ? [c1, c2, w1, w2] : [c2, c1, w1, w2];
    const uniqueOptions = makeUniqueOptions(correctAns, optionsPool);
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === correctAns
    }));

    qList.push({
      id: 6,
      type: 'mcq',
      title: isEn ? 'QUESTION 6 • SUBTRACTION AS VERIFICATION' : 'ΕΡΩΤΗΣΗ 6 • ΑΦΑΙΡΕΣΗ ΩΣ ΔΟΚΙΜΗ',
      instruction: isEn ? 'Select the correct statement evaluation:' : 'Επιλέξτε τη σωστή αξιολόγηση της πρότασης:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? `Correct! Subtraction is the inverse operation of addition: ${q6Sum} － ${q6B} ＝ ${q6A}.`
            : 'False! Verifying addition is performed by subtracting an addend from the sum, not by adding.')
        : (q6IsTrue
            ? `Σωστό! Η αφαίρεση είναι η αντίστροφη πράξη της πρόσθεσης: ${q6Sum} － ${q6B} ＝ ${q6A}.`
            : 'Λάθος! Η δοκιμή της πρόσθεσης γίνεται με αφαίρεση ενός προσθετέου από το άθροισμα, όχι με πρόσθεση.')
    });
  }

  // Q7 (Input - Decimal): Οπτική Κάθετη Στοίχιση
  {
    const q7TopInt = randInt(20, 50);
    const q7TopDec = randInt(1, 9);
    const q7BotInt = randInt(10, 30);
    const q7BotDec = randInt(11, 89);
    const q7TopStr = `${q7TopInt}${sep}${q7TopDec}`;
    const q7BotStr = `${q7BotInt}${sep}${q7BotDec}`;
    const valTop = parseFloat(q7TopStr.replace(',', '.'));
    const valBot = parseFloat(q7BotStr.replace(',', '.'));
    const q7Correct = Number((valTop + valBot).toFixed(2));
    const q7CorrectStr = formatNum(q7Correct, locale);

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 7 • VISUAL COLUMN ALIGNMENT' : 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΚΑΘΕΤΗ ΣΤΟΙΧΙΣΗ',
      instruction: isEn
        ? 'Calculate the result of the vertical operation:'
        : 'Υπολογίστε το αποτέλεσμα της κάθετης πράξης με κόμμα:',
      prompt: isEn ? `Calculate: ${q7TopStr} ＋ ${q7BotStr};` : `Υπολογίστε: ${q7TopStr} ＋ ${q7BotStr};`,
      verticalData: {
        topInt: String(q7TopInt),
        topDec: String(q7TopDec),
        botInt: String(q7BotInt),
        botDec: String(q7BotDec)
      },
      correctVal: q7Correct,
      correctStr: q7CorrectStr,
      explanation: isEn
        ? `Aligning decimal points and adding a trailing zero (${q7TopStr}0 ＋ ${q7BotStr}): we find ${q7CorrectStr}.`
        : `Στοιχίζοντας κατακόρυφα τις υποδιαστολές και προσθέτοντας μηδενικό (${q7TopStr}0 ＋ ${q7BotStr}): βρίσκουμε ${q7CorrectStr}.`
    });
  }

  // Q8 (MCQ): Πρόσθεση στην Αριθμογραμμή (4 μοναδικές επιλογές)
  {
    const q8Base = randInt(2, 6);
    const q8Step = randInt(2, 5);
    const q8StartStr = `${q8Base}${sep}0`;
    const q8AddStr = `0${sep}${q8Step}`;
    const q8ResultNum = Number((q8Base + q8Step * 0.1).toFixed(1));
    const q8ResultStr = formatNum(q8ResultNum, locale);

    const w1 = formatNum(q8ResultNum + 1, locale);
    const w2 = `${q8Base}${sep}0${q8Step}`;
    const w3 = formatNum(Math.max(1, q8ResultNum - 1), locale);

    const uniqueOptions = makeUniqueOptions(q8ResultStr, [w1, w2, w3], (i) =>
      formatNum(q8ResultNum + (i + 1) * 0.3, locale)
    );
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === q8ResultStr
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • NUMBER LINE ADDITION' : 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΣΘΕΣΗ ΣΤΗΝ ΑΡΙΘΜΟΓΡΑΜΜΗ',
      instruction: isEn
        ? 'Select the number the arrow lands on:'
        : 'Επιλέξτε τον αριθμό στον οποίο καταλήγει το βέλος:',
      prompt: isEn
        ? `On the number line, we start at ${q8StartStr} and move right by ${q8AddStr}. Which number do we reach?`
        : `Στην αριθμογραμμή ξεκινάμε από το ${q8StartStr} και μετακινούμαστε δεξιά κατά ${q8AddStr}. Σε ποιον αριθμό φτάνουμε;`,
      options,
      correctText: q8ResultStr,
      explanation: isEn
        ? `Starting at ${q8StartStr} and adding ${q8AddStr}, we reach: ${q8StartStr} ＋ ${q8AddStr} ＝ ${q8ResultStr}.`
        : `Ξεκινώντας από το ${q8StartStr} και προσθέτοντας ${q8AddStr}, φτάνουμε στο: ${q8StartStr} ＋ ${q8AddStr} ＝ ${q8ResultStr}.`
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
    pageTitle: "Ασκήσεις: Πρόσθεση & Ιδιότητες - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές ασκήσεις και προβλήματα στην πρόσθεση φυσικών και δεκαδικών αριθμών, τις ιδιότητες και την αφαίρεση για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Πρόσθεση & Ιδιότητες",
    heroDesc: "10 απαιτητικές δραστηριότητες με κάθετη πρόσθεση δεκαδικών, αντιμεταθετική και προσεταιριστική ιδιότητα, εύρεση άγνωστου προσθετέου και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.",
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
    pageTitle: "Exercises: Addition & Properties - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems on adding whole numbers and decimals, mathematical properties, and subtraction for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Addition & Properties",
    heroDesc: "10 practice problems on vertical decimal addition, commutative and associative properties, missing addends, and applied real-world word problems.",
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

export default function ProsthesiExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
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
      const sep = firstSepMatch[0];
      const parts = sanitized.split(/[,.]/);
      sanitized = parts[0] + sep + parts.slice(1).join('');
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
          href="/st-dimotikou/05-prosthesi"
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
              <span>{t.badgeChapter}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200 break-words">
              {t.heroDynamicNote}
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation cursor-pointer shrink-0"
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
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg break-words">
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
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500 break-words">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed break-words [overflow-wrap:anywhere]">
                    {q.prompt}
                  </p>

                  {/* Οπτική Κάθετη Στοίχιση για την Q7 */}
                  {q.verticalData && (
                    <div className="bg-slate-100 rounded-2xl p-4 my-3 flex justify-center overflow-x-auto w-full">
                      <svg
                        viewBox="0 0 200 90"
                        className="w-48 sm:w-56 h-auto max-w-full bg-white rounded-xl border border-slate-300 shadow-sm shrink-0 select-none"
                      >
                        <text
                          x="35"
                          y="56"
                          fontSize="16"
                          fontWeight="bold"
                          textAnchor="start"
                          fill="#94a3b8"
                          fontFamily="sans-serif"
                        >
                          ＋
                        </text>
                        <text
                          x="110"
                          y="32"
                          fontSize="16"
                          fontWeight="bold"
                          textAnchor="end"
                          fill="#059669"
                          fontFamily="monospace"
                        >
                          {q.verticalData.topInt}
                        </text>
                        <text
                          x="115"
                          y="32"
                          fontSize="16"
                          fontWeight="bold"
                          textAnchor="middle"
                          fill="#d97706"
                          fontFamily="monospace"
                        >
                          {locale === 'en' ? '.' : ','}
                        </text>
                        <text
                          x="120"
                          y="32"
                          fontSize="16"
                          fontWeight="bold"
                          textAnchor="start"
                          fill="#059669"
                          fontFamily="monospace"
                        >
                          {q.verticalData.topDec}
                        </text>

                        <text
                          x="110"
                          y="56"
                          fontSize="16"
                          fontWeight="bold"
                          textAnchor="end"
                          fill="#2563eb"
                          fontFamily="monospace"
                        >
                          {q.verticalData.botInt}
                        </text>
                        <text
                          x="115"
                          y="56"
                          fontSize="16"
                          fontWeight="bold"
                          textAnchor="middle"
                          fill="#d97706"
                          fontFamily="monospace"
                        >
                          {locale === 'en' ? '.' : ','}
                        </text>
                        <text
                          x="120"
                          y="56"
                          fontSize="16"
                          fontWeight="bold"
                          textAnchor="start"
                          fill="#2563eb"
                          fontFamily="monospace"
                        >
                          {q.verticalData.botDec}
                        </text>

                        <line x1="30" y1="66" x2="170" y2="66" stroke="#334155" strokeWidth="2" />
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
                      <span className="text-xs 2xl:text-sm text-slate-500 break-words">
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
                            className={`w-full p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
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
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-2.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? t.feedbackGreat : t.feedbackExpl}</span>
                    </div>

                    {q.tableData && (
                      <div className="w-full overflow-x-auto block">
                        <div className="inline-block min-w-full sm:min-w-[340px] bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-inner my-1 font-mono text-xs sm:text-sm">
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                            <span className="bg-blue-100/70 px-2 py-0.5 rounded-lg text-blue-900 break-words">
                              {q.tableData.col1}
                            </span>
                            <span className="bg-emerald-100/70 px-2 py-0.5 rounded-lg text-emerald-900 break-words">
                              {q.tableData.col2}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                            <span className="break-words">{q.tableData.r1[0]}</span>
                            <span className="text-indigo-700 font-bold break-words">{q.tableData.r1[1]}</span>
                            <span className="break-words">{q.tableData.r2[0]}</span>
                            <span className="text-amber-600 font-black break-words">{q.tableData.r2[1]}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="break-words [overflow-wrap:anywhere]">{q.explanation}</div>

                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800 break-words">
                        {t.correctAnswerLabel}{' '}
                        <span className="font-mono font-bold text-blue-900">
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
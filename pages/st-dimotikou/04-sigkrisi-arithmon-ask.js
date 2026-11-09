// pages/st-dimotikou/04-sigkrisi-arithmon-ask.js
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
    id: 'p_cmp_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const w1 = 14.8;
      const w2 = 14.75;
      const diff = Number((w1 - w2).toFixed(2));
      const diffStr = `${formatNum(diff, locale, 2)} kg`;

      return {
        title: isEn ? 'PARCEL WEIGHT COMPARISON' : 'ΣΥΓΚΡΙΣΗ ΒΑΡΟΥΣ ΔΕΜΑΤΩΝ',
        instruction: isEn
          ? 'Solve the problem and enter the weight difference in kilograms (kg):'
          : 'Λύστε το πρόβλημα και συμπληρώστε τη διαφορά σε κιλά (kg) με κόμμα:',
        text: isEn
          ? `Two parcels weigh ${formatNum(w1, locale)} kg and ${formatNum(w2, locale)} kg respectively. How many kilograms (kg) more does the heavier parcel weigh?`
          : `Δύο δέματα ζυγίζουν ${formatNum(w1, locale)} kg και ${formatNum(w2, locale)} kg αντίστοιχα. Πόσα κιλά (kg) παραπάνω ζυγίζει το βαρύτερο δέμα;`,
        tableData: {
          col1: isEn ? 'Parcel 1' : '1ο Δέμα',
          col2: isEn ? 'Parcel 2' : '2ο Δέμα',
          r1: [`${formatNum(w1, locale)} kg ＝ ${formatNum(14.8, locale, 2)} kg`, `${formatNum(w2, locale)} kg`],
          r2: [isEn ? 'Difference' : 'Διαφορά', diffStr]
        },
        correctVal: diff,
        correctStr: formatNum(diff, locale, 2),
        explanation: isEn
          ? `Aligning decimal places: 14.80 ＞ 14.75. The 1st parcel is heavier by: 14.80 － 14.75 ＝ ${diffStr}.`
          : `Εξισώνουμε τα δεκαδικά ψηφία: 14,80 ＞ 14,75. Το 1ο δέμα είναι βαρύτερο κατά: 14,80 － 14,75 ＝ ${diffStr}.`
      };
    }
  },
  {
    id: 'p_cmp_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const p1 = 2.4;
      const p2 = 2.05;
      const p3 = 2.45;
      const maxVal = Math.max(p1, p2, p3);
      const maxStr = `${formatNum(maxVal, locale, 2)} €`;

      return {
        title: isEn ? 'PRODUCT PRICE COMPARISON' : 'ΣΥΓΚΡΙΣΗ ΤΙΜΩΝ ΠΡΟΪΟΝΤΩΝ',
        instruction: isEn
          ? 'Solve the problem and enter the highest price in euros (€):'
          : 'Λύστε το πρόβλημα και συμπληρώστε την ακριβότερη τιμή σε ευρώ (€) με κόμμα:',
        text: isEn
          ? `Three identical products are sold in three different stores for ${formatNum(p1, locale)} €, ${formatNum(p2, locale)} €, and ${formatNum(p3, locale)} €. What is the most expensive price in euros (€)?`
          : `Τρία όμοια προϊόντα πωλούνται σε τρία διαφορετικά καταστήματα προς ${formatNum(p1, locale)} €, ${formatNum(p2, locale)} € και ${formatNum(p3, locale)} €. Ποια είναι η ακριβότερη τιμή σε ευρώ (€);`,
        tableData: {
          col1: isEn ? 'Stores A & B' : 'Καταστήματα Α & Β',
          col2: isEn ? 'Store C' : 'Κατάστημα Γ',
          r1: [`${formatNum(p1, locale)} €`, `${formatNum(p3, locale)} €`],
          r2: [`${formatNum(p2, locale)} €`, isEn ? `Highest: ${maxStr}` : `Ακριβότερη: ${maxStr}`]
        },
        correctVal: maxVal,
        correctStr: formatNum(maxVal, locale, 2),
        explanation: isEn
          ? `Comparing tenths and hundredths: 2.45 ＞ 2.40 ＞ 2.05. The most expensive price is ${maxStr}.`
          : `Συγκρίνουμε τα δέκατα και τα εκατοστά: 2,45 ＞ 2,40 ＞ 2,05. Η ακριβότερη τιμή είναι ${maxStr}.`
      };
    }
  },
  {
    id: 'p_cmp_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const km1 = 12.35;
      const km2 = 12.5;
      const diff = Number((km2 - km1).toFixed(2));
      const diffStr = `${formatNum(diff, locale, 2)} km`;

      return {
        title: isEn ? 'RUNNERS DISTANCE COMPARISON' : 'ΣΥΓΚΡΙΣΗ ΑΠΟΣΤΑΣΕΩΝ ΔΡΟΜΕΩΝ',
        instruction: isEn
          ? 'Solve the problem and enter the distance difference in kilometers (km):'
          : 'Λύστε το πρόβλημα και συμπληρώστε τη διαφορά σε χιλιόμετρα (km) με κόμμα:',
        text: isEn
          ? `Two runners covered distances of ${formatNum(km1, locale)} km and ${formatNum(km2, locale)} km respectively. How many more kilometers (km) did the second runner cover?`
          : `Δύο δρομείς κάλυψαν αποστάσεις ${formatNum(km1, locale)} km και ${formatNum(km2, locale)} km αντίστοιχα. Πόσα χιλιόμετρα (km) περισσότερα διένυσε ο δεύτερος δρομέας;`,
        tableData: {
          col1: isEn ? 'Runner 1' : '1ος Δρομέας',
          col2: isEn ? 'Runner 2' : '2ος Δρομέας',
          r1: [`${formatNum(km1, locale)} km`, `${formatNum(km2, locale)} km ＝ ${formatNum(12.5, locale, 2)} km`],
          r2: [isEn ? 'Difference' : 'Διαφορά', diffStr]
        },
        correctVal: diff,
        correctStr: formatNum(diff, locale, 2),
        explanation: isEn
          ? `Padding with trailing zeros: 12.50 － 12.35 ＝ ${diffStr}.`
          : `Συμπληρώνουμε μηδενικό στο τέλος: 12,50 － 12,35 ＝ ${diffStr}.`
      };
    }
  },
  {
    id: 'p_cmp_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const len1 = 8.75;
      const len2 = 8.8;
      const diff = Number((len2 - len1).toFixed(2));
      const diffStr = `${formatNum(diff, locale, 2)} m`;

      return {
        title: isEn ? 'FABRIC LENGTH COMPARISON' : 'ΣΥΓΚΡΙΣΗ ΜΗΚΟΥΣ ΥΦΑΣΜΑΤΩΝ',
        instruction: isEn
          ? 'Solve the problem and enter the length difference in meters (m):'
          : 'Λύστε το πρόβλημα και συμπληρώστε τη διαφορά μήκους σε μέτρα (m) με κόμμα:',
        text: isEn
          ? `Two rolls of fabric measure ${formatNum(len1, locale)} m and ${formatNum(len2, locale)} m. How many meters (m) longer is the second roll?`
          : `Δύο τόπια υφάσματος έχουν μήκη ${formatNum(len1, locale)} m και ${formatNum(len2, locale)} m. Πόσα μέτρα (m) μακρύτερο είναι το δεύτερο τόπι;`,
        tableData: {
          col1: isEn ? 'Roll 1' : '1ο Τόπι',
          col2: isEn ? 'Roll 2' : '2ο Τόπι',
          r1: [`${formatNum(len1, locale)} m`, `${formatNum(len2, locale)} m ＝ ${formatNum(8.8, locale, 2)} m`],
          r2: [isEn ? 'Difference' : 'Διαφορά', diffStr]
        },
        correctVal: diff,
        correctStr: formatNum(diff, locale, 2),
        explanation: isEn
          ? `Equalizing decimal places: 8.80 － 8.75 ＝ ${diffStr}.`
          : `Εξισώνουμε τα δεκαδικά ψηφία: 8,80 － 8,75 ＝ ${diffStr}.`
      };
    }
  },
  {
    id: 'p_cmp_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const v1 = 5.6;
      const v2 = 5.45;
      const diff = Number((v1 - v2).toFixed(2));
      const diffStr = `${formatNum(diff, locale, 2)} L`;

      return {
        title: isEn ? 'LIQUID VOLUME COMPARISON' : 'ΣΥΓΚΡΙΣΗ ΟΓΚΟΥ ΥΓΡΩΝ',
        instruction: isEn
          ? 'Solve the problem and enter the volume difference in liters (L):'
          : 'Λύστε το πρόβλημα και συμπληρώστε τη διαφορά σε λίτρα (L) με κόμμα:',
        text: isEn
          ? `Two containers hold ${formatNum(v1, locale)} L and ${formatNum(v2, locale)} L of olive oil respectively. How many more liters (L) does the first container hold?`
          : `Δύο δοχεία περιέχουν ${formatNum(v1, locale)} L και ${formatNum(v2, locale)} L ελαιόλαδο αντίστοιχα. Πόσα λίτρα (L) περισσότερο ελαιόλαδο περιέχει το πρώτο δοχείο;`,
        tableData: {
          col1: isEn ? 'Container 1' : '1ο Δοχείο',
          col2: isEn ? 'Container 2' : '2ο Δοχείο',
          r1: [`${formatNum(v1, locale)} L ＝ ${formatNum(5.6, locale, 2)} L`, `${formatNum(v2, locale)} L`],
          r2: [isEn ? 'Difference' : 'Διαφορά', diffStr]
        },
        correctVal: diff,
        correctStr: formatNum(diff, locale, 2),
        explanation: isEn
          ? `Equalizing decimal places: 5.60 － 5.45 ＝ ${diffStr}.`
          : `Εξισώνουμε τα ψηφία: 5,60 － 5,45 ＝ ${diffStr}.`
      };
    }
  },
  {
    id: 'p_cmp_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const t1 = 10.25;
      const t2 = 10.18;
      const diff = Number((t1 - t2).toFixed(2));
      const diffStr = `${formatNum(diff, locale, 2)} s`;

      return {
        title: isEn ? 'RACE TIME COMPARISON' : 'ΣΥΓΚΡΙΣΗ ΧΡΟΝΟΥ ΚΟΥΡΣΑΣ',
        instruction: isEn
          ? 'Solve the problem and enter the time difference in seconds (s):'
          : 'Λύστε το πρόβλημα και συμπληρώστε τη διαφορά χρόνου σε δευτερόλεπτα (s) με κόμμα:',
        text: isEn
          ? `Two athletes finished a 100-meter race with times of ${formatNum(t1, locale)} s and ${formatNum(t2, locale)} s respectively. How many seconds (s) faster was the winner?`
          : `Δύο αθλητές τερμάτισαν στα 100 μέτρα με χρόνους ${formatNum(t1, locale)} s και ${formatNum(t2, locale)} s αντίστοιχα. Πόσα δευτερόλεπτα (s) ταχύτερος ήταν ο νικητής;`,
        tableData: {
          col1: isEn ? 'Athlete 2' : '2ος Αθλητής',
          col2: isEn ? 'Athlete 1 (Winner)' : '1ος Αθλητής (Νικητής)',
          r1: [`${formatNum(t1, locale)} s`, `${formatNum(t2, locale)} s`],
          r2: [isEn ? 'Difference' : 'Διαφορά', diffStr]
        },
        correctVal: diff,
        correctStr: formatNum(diff, locale, 2),
        explanation: isEn
          ? `The faster athlete has the smaller time: 10.25 － 10.18 ＝ ${diffStr}.`
          : `Ο ταχύτερος αθλητής έχει τον μικρότερο χρόνο: 10,25 － 10,18 ＝ ${diffStr}.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_cmp_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const lengths = [3.05, 3.5, 3.45, 3.005];
      const sorted = [...lengths].sort((a, b) => a - b);
      const minVal = sorted[0];
      const correctStr = `${formatNum(minVal, locale, 3)} m`;
      const fake1 = `${formatNum(sorted[1], locale, 2)} m`;
      const fake2 = `${formatNum(sorted[2], locale, 2)} m`;
      const fake3 = `${formatNum(sorted[3], locale, 1)} m`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(minVal + (i + 1) * 0.12, locale, 3)} m`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'WIRE LENGTH COMPARISON' : 'ΣΥΓΚΡΙΣΗ ΜΗΚΩΝ ΣΥΡΜΑΤΟΣ',
        instruction: isEn
          ? 'Select the length of the shortest wire in meters (m):'
          : 'Επιλέξτε το μήκος του κοντύτερου σύρματος σε μέτρα (m):',
        text: isEn
          ? `Four pieces of wire measure ${formatNum(lengths[0], locale)} m, ${formatNum(lengths[1], locale)} m, ${formatNum(lengths[2], locale)} m, and ${formatNum(lengths[3], locale)} m. What is the length of the shortest wire in meters (m)?`
          : `Τέσσερα κομμάτια σύρματος έχουν μήκη ${formatNum(lengths[0], locale)} m, ${formatNum(lengths[1], locale)} m, ${formatNum(lengths[2], locale)} m και ${formatNum(lengths[3], locale)} m. Ποιο είναι το μήκος του κοντύτερου σύρματος σε μέτρα (m);`,
        tableData: {
          col1: isEn ? 'Four Lengths' : 'Τέσσερα Μήκη',
          col2: isEn ? 'Aligned in thousandths' : 'Εξίσωση σε χιλιοστά',
          r1: [
            `${formatNum(3.05, locale, 3)} m / ${formatNum(3.5, locale, 3)} m`,
            `${formatNum(3.45, locale, 3)} m / ${formatNum(3.005, locale, 3)} m`
          ],
          r2: [isEn ? 'Shortest wire' : 'Μικρότερο μήκος', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Aligning to 3 decimal places: 3.005 ＜ 3.050 ＜ 3.450 ＜ 3.500. The shortest wire has a length of ${correctStr}.`
          : `Εξισώνουμε σε 3 δεκαδικά ψηφία: 3,005 ＜ 3,050 ＜ 3,450 ＜ 3,500. Το κοντύτερο σύρμα έχει μήκος ${correctStr}.`
      };
    }
  },
  {
    id: 'p_cmp_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const budget = 50;
      const b1 = 18.6;
      const b2 = 18.06;
      const maxVal = Math.max(b1, b2);
      const remain = Number((budget - maxVal).toFixed(2));
      const correctStr = `${formatNum(remain, locale, 2)} €`;
      const fake1 = `${formatNum(Number((remain + 1.5).toFixed(2)), locale, 2)} €`;
      const fake2 = `${formatNum(Number((Math.max(0.5, remain - 1.2)).toFixed(2)), locale, 2)} €`;
      const fake3 = `${formatNum(Number((remain + 3.1).toFixed(2)), locale, 2)} €`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((remain + (i + 1) * 0.9).toFixed(2)), locale, 2)} €`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'COMPLEX TRANSACTION COMPARISON' : 'ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΣΥΝΑΛΛΑΓΗΣ',
        instruction: isEn
          ? 'Select the correct change amount in euros (€):'
          : 'Επιλέξτε το σωστό ποσό ρέστων σε ευρώ (€):',
        text: isEn
          ? `A book costs ${formatNum(b1, locale)} € in one bookstore and ${formatNum(b2, locale)} € in another. If someone buys the more expensive one and pays with a 50 € note, how much change (€) will they receive?`
          : `Ένα βιβλίο κοστίζει ${formatNum(b1, locale)} € σε ένα βιβλιοπωλείο και ${formatNum(b2, locale)} € σε ένα άλλο. Αν κάποιος αγοράσει το ακριβότερο και πληρώσει με χαρτονόμισμα των 50 €, πόσα ρέστα (€) θα πάρει;`,
        tableData: {
          col1: isEn ? 'Book Prices' : 'Τιμές Βιβλίου',
          col2: isEn ? '50 € Note' : 'Χαρτονόμισμα 50 €',
          r1: [`${formatNum(b1, locale)} € (${formatNum(18.6, locale, 2)} €)`, `${formatNum(b2, locale)} €`],
          r2: [
            isEn ? `More expensive: ${formatNum(18.6, locale, 2)} €` : `Ακριβότερο: ${formatNum(18.6, locale, 2)} €`,
            isEn ? `Change: ${correctStr}` : `Ρέστα: ${correctStr}`
          ]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `18.60 ＞ 18.06, so the more expensive book costs 18.60 €. Change from 50 €: 50.00 － 18.60 ＝ ${correctStr}.`
          : `18,60 ＞ 18,06, άρα το ακριβότερο κοστίζει 18,60 €. Ρέστα από 50 €: 50,00 － 18,60 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_cmp_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const weights = [2.45, 2.5, 2.055, 2.405];
      const sorted = [...weights].sort((a, b) => b - a);
      const maxVal = sorted[0];
      const correctStr = `${formatNum(maxVal, locale, 2)} kg`;
      const fake1 = `${formatNum(sorted[1], locale, 2)} kg`;
      const fake2 = `${formatNum(sorted[2], locale, 3)} kg`;
      const fake3 = `${formatNum(sorted[3], locale, 3)} kg`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(maxVal + (i + 1) * 0.15, locale, 2)} kg`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'PARCEL WEIGHT COMPARISON' : 'ΣΥΓΚΡΙΣΗ ΒΑΡΟΥΣ ΔΕΜΑΤΩΝ',
        instruction: isEn
          ? 'Select the weight of the heaviest parcel in kilograms (kg):'
          : 'Επιλέξτε το βάρος του βαρύτερου δέματος σε κιλά (kg):',
        text: isEn
          ? `Four parcels weigh ${formatNum(weights[0], locale)} kg, ${formatNum(weights[1], locale)} kg, ${formatNum(weights[2], locale)} kg, and ${formatNum(weights[3], locale)} kg. What is the weight of the heaviest parcel in kilograms (kg)?`
          : `Τέσσερα δέματα έχουν βάρη ${formatNum(weights[0], locale)} kg, ${formatNum(weights[1], locale)} kg, ${formatNum(weights[2], locale)} kg και ${formatNum(weights[3], locale)} kg. Ποιο είναι το βάρος του βαρύτερου δέματος σε κιλά (kg);`,
        tableData: {
          col1: isEn ? 'Four Weights' : 'Τέσσερα Βάρη',
          col2: isEn ? 'Aligned in thousandths' : 'Εξίσωση σε χιλιοστά',
          r1: [
            `${formatNum(2.45, locale, 3)} kg / ${formatNum(2.5, locale, 3)} kg`,
            `${formatNum(2.055, locale, 3)} kg / ${formatNum(2.405, locale, 3)} kg`
          ],
          r2: [isEn ? 'Heaviest parcel' : 'Βαρύτερο δέμα', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Aligning to 3 decimal places: 2.500 ＞ 2.450 ＞ 2.405 ＞ 2.055. The heaviest parcel weighs ${correctStr}.`
          : `Εξισώνουμε σε 3 δεκαδικά ψηφία: 2,500 ＞ 2,450 ＞ 2,405 ＞ 2,055. Το βαρύτερο δέμα είναι αυτό με ${correctStr}.`
      };
    }
  },
  {
    id: 'p_cmp_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const distances = [15.2, 15.08, 15.25, 15.025];
      const sorted = [...distances].sort((a, b) => b - a);
      const maxVal = sorted[0];
      const correctStr = `${formatNum(maxVal, locale, 2)} km`;
      const fake1 = `${formatNum(sorted[1], locale, 1)} km`;
      const fake2 = `${formatNum(sorted[2], locale, 2)} km`;
      const fake3 = `${formatNum(sorted[3], locale, 3)} km`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(maxVal + (i + 1) * 0.2, locale, 2)} km`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'CYCLING ROUTE COMPARISON' : 'ΣΥΓΚΡΙΣΗ ΔΙΑΔΡΟΜΩΝ ΠΟΔΗΛΑΣΙΑΣ',
        instruction: isEn
          ? 'Select the longest route in kilometers (km):'
          : 'Επιλέξτε τη μεγαλύτερη διαδρομή σε χιλιόμετρα (km):',
        text: isEn
          ? `Four cyclists covered routes measuring ${formatNum(distances[0], locale)} km, ${formatNum(distances[1], locale)} km, ${formatNum(distances[2], locale)} km, and ${formatNum(distances[3], locale)} km. Which route is the longest in kilometers (km)?`
          : `Τέσσερις ποδηλάτες διένυσαν διαδρομές ${formatNum(distances[0], locale)} km, ${formatNum(distances[1], locale)} km, ${formatNum(distances[2], locale)} km και ${formatNum(distances[3], locale)} km. Ποια είναι η μεγαλύτερη διαδρομή σε χιλιόμετρα (km);`,
        tableData: {
          col1: isEn ? 'Routes' : 'Διαδρομές',
          col2: isEn ? 'Aligned in thousandths' : 'Εξίσωση σε χιλιοστά',
          r1: [
            `${formatNum(15.2, locale, 3)} km / ${formatNum(15.08, locale, 3)} km`,
            `${formatNum(15.25, locale, 3)} km / ${formatNum(15.025, locale, 3)} km`
          ],
          r2: [isEn ? 'Longest route' : 'Μέγιστη διαδρομή', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Aligning decimal places: 15.250 ＞ 15.200 ＞ 15.080 ＞ 15.025. The longest route is ${correctStr}.`
          : `Εξισώνουμε τα δεκαδικά ψηφία: 15,250 ＞ 15,200 ＞ 15,080 ＞ 15,025. Η μεγαλύτερη διαδρομή είναι ${correctStr}.`
      };
    }
  },
  {
    id: 'p_cmp_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const fuels = [4.8, 4.75, 4.09, 4.82];
      const sorted = [...fuels].sort((a, b) => a - b);
      const minVal = sorted[0];
      const correctStr = `${formatNum(minVal, locale, 2)} L`;
      const fake1 = `${formatNum(sorted[1], locale, 2)} L`;
      const fake2 = `${formatNum(sorted[2], locale, 1)} L`;
      const fake3 = `${formatNum(sorted[3], locale, 2)} L`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(minVal + (i + 1) * 0.18, locale, 2)} L`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'FUEL CONSUMPTION COMPARISON' : 'ΣΥΓΚΡΙΣΗ ΚΑΤΑΝΑΛΩΣΗΣ ΚΑΥΣΙΜΟΥ',
        instruction: isEn
          ? 'Select the lowest fuel consumption in liters (L):'
          : 'Επιλέξτε τη χαμηλότερη κατανάλωση σε λίτρα (L):',
        text: isEn
          ? `Four cars consumed per 100 km: ${formatNum(fuels[0], locale)} L, ${formatNum(fuels[1], locale)} L, ${formatNum(fuels[2], locale)} L, and ${formatNum(fuels[3], locale)} L. What is the lowest fuel consumption in liters (L)?`
          : `Τέσσερα αυτοκίνητα κατανάλωσαν ανά 100 km: ${formatNum(fuels[0], locale)} L, ${formatNum(fuels[1], locale)} L, ${formatNum(fuels[2], locale)} L και ${formatNum(fuels[3], locale)} L. Ποια είναι η χαμηλότερη κατανάλωση καυσίμου σε λίτρα (L);`,
        tableData: {
          col1: isEn ? 'Fuel Consumptions' : 'Καταναλώσεις',
          col2: isEn ? 'Aligned in hundredths' : 'Εξίσωση εκατοστών',
          r1: [
            `${formatNum(4.8, locale, 2)} L / ${formatNum(4.75, locale, 2)} L`,
            `${formatNum(4.09, locale, 2)} L / ${formatNum(4.82, locale, 2)} L`
          ],
          r2: [isEn ? 'Lowest' : 'Χαμηλότερη', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Comparing tenths: 4.09 ＜ 4.75 ＜ 4.80 ＜ 4.82. The lowest consumption is ${correctStr}.`
          : `Συγκρίνουμε τα δέκατα: 4,09 ＜ 4,75 ＜ 4,80 ＜ 4,82. Η χαμηλότερη κατανάλωση είναι ${correctStr}.`
      };
    }
  },
  {
    id: 'p_cmp_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const heights = [7.6, 7.55, 7.65, 7.08];
      const sorted = [...heights].sort((a, b) => b - a);
      const maxVal = sorted[0];
      const correctStr = `${formatNum(maxVal, locale, 2)} m`;
      const fake1 = `${formatNum(sorted[1], locale, 1)} m`;
      const fake2 = `${formatNum(sorted[2], locale, 2)} m`;
      const fake3 = `${formatNum(sorted[3], locale, 2)} m`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(maxVal + (i + 1) * 0.15, locale, 2)} m`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'TREE HEIGHT COMPARISON' : 'ΣΥΓΚΡΙΣΗ ΥΨΟΥΣ ΔΕΝΤΡΩΝ',
        instruction: isEn
          ? 'Select the height of the tallest tree in meters (m):'
          : 'Επιλέξτε το ύψος του ψηλότερου δέντρου σε μέτρα (m):',
        text: isEn
          ? `In a park, four trees were measured with heights of ${formatNum(heights[0], locale)} m, ${formatNum(heights[1], locale)} m, ${formatNum(heights[2], locale)} m, and ${formatNum(heights[3], locale)} m. What is the height of the tallest tree in meters (m)?`
          : `Σε ένα πάρκο μετρήθηκαν τέσσερα δέντρα με ύψη ${formatNum(heights[0], locale)} m, ${formatNum(heights[1], locale)} m, ${formatNum(heights[2], locale)} m και ${formatNum(heights[3], locale)} m. Ποιο είναι το ύψος του ψηλότερου δέντρου σε μέτρα (m);`,
        tableData: {
          col1: isEn ? 'Tree Heights' : 'Ύψη Δέντρων',
          col2: isEn ? 'Aligned in hundredths' : 'Εξίσωση εκατοστών',
          r1: [
            `${formatNum(7.6, locale, 2)} m / ${formatNum(7.55, locale, 2)} m`,
            `${formatNum(7.65, locale, 2)} m / ${formatNum(7.08, locale, 2)} m`
          ],
          r2: [isEn ? 'Tallest' : 'Ψηλότερο', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Aligning hundredths: 7.65 ＞ 7.60 ＞ 7.55 ＞ 7.08. The tallest tree measures ${correctStr}.`
          : `Εξισώνουμε τα εκατοστά: 7,65 ＞ 7,60 ＞ 7,55 ＞ 7,08. Το ψηλότερο δέντρο έχει ύψος ${correctStr}.`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const sep = isEn ? '.' : ',';
  const qList = [];

  // Q1 (MCQ): Σύμβολο Σύγκρισης Δεκαδικών (4 μοναδικές επιλογές)
  {
    const q1Int = randInt(12, 45);
    const q1A = `${q1Int}${sep}8`;
    const q1B = `${q1Int}${sep}75`;
    const q1Correct = '＞';

    const rawOptions = ['＞', '＜', '＝', '≤'];
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === q1Correct
    }));

    qList.push({
      id: 1,
      type: 'mcq',
      title: isEn ? 'QUESTION 1 • DECIMAL COMPARISON SYMBOL' : 'ΕΡΩΤΗΣΗ 1 • ΣΥΜΒΟΛΟ ΣΥΓΚΡΙΣΗΣ ΔΕΚΑΔΙΚΩΝ',
      instruction: isEn
        ? 'Select the correct comparison symbol (＞, ＜, ＝, ≤):'
        : 'Επιλέξτε το κατάλληλο σύμβολο σύγκρισης (＞, ＜, ＝, ≤):',
      prompt: isEn
        ? `Which symbol correctly relates the numbers: ${q1A} ___ ${q1B}?`
        : `Ποιο σύμβολο συνδέει σωστά τους αριθμούς: ${q1A} ___ ${q1B};`,
      options,
      correctText: q1Correct,
      explanation: isEn
        ? `Aligning decimal places: ${q1A}0 (${q1Int}.80) versus ${q1B}. Since 80 hundredths ＞ 75 hundredths, ${q1A} ＞ ${q1B}.`
        : `Εξισώνουμε τα δεκαδικά ψηφία: ${q1A}0 (${q1Int},80) έναντι ${q1B}. Επειδή 80 εκατοστά ＞ 75 εκατοστά, ισχύει ${q1A} ＞ ${q1B}.`
    });
  }

  // Q2 (MCQ): Σύμβολο Σύγκρισης - Ισοδύναμοι Δεκαδικοί με Μηδενικά (4 μοναδικές επιλογές)
  {
    const q2Int = randInt(3, 19);
    const q2Dec = randInt(2, 8);
    const q2A = `${q2Int}${sep}${q2Dec}0`;
    const q2B = `${q2Int}${sep}${q2Dec}`;
    const q2Correct = '＝';

    const rawOptions = ['＝', '＞', '＜', '≥'];
    const options = rawOptions.map((text) => ({
      text,
      isCorrect: text === q2Correct
    }));

    qList.push({
      id: 2,
      type: 'mcq',
      title: isEn ? 'QUESTION 2 • EQUIVALENT DECIMALS' : 'ΕΡΩΤΗΣΗ 2 • ΙΣΟΔΥΝΑΜΟΙ ΔΕΚΑΔΙΚΟΙ',
      instruction: isEn
        ? 'Select the correct comparison symbol (＝, ＞, ＜, ≥):'
        : 'Επιλέξτε το κατάλληλο σύμβολο σύγκρισης (＝, ＞, ＜, ≥):',
      prompt: isEn
        ? `Which symbol correctly relates the numbers: ${q2A} ___ ${q2B}?`
        : `Ποιο σύμβολο συνδέει σωστά τους αριθμούς: ${q2A} ___ ${q2B};`,
      options,
      correctText: q2Correct,
      explanation: isEn
        ? `Trailing zeros at the end of the decimal part do not change the number's value. Hence ${q2A} ＝ ${q2B}.`
        : `Τα μηδενικά στο τέλος του δεκαδικού μέρους δεν αλλάζουν την αξία του αριθμού. Άρα ${q2A} ＝ ${q2B}.`
    });
  }

  // Q3 (Input - Decimal): Εύρεση του μεγαλύτερου αριθμού από λίστα
  {
    const q3Base = randInt(5, 25);
    const q3List = [
      { text: `${q3Base}${sep}65`, val: q3Base + 0.65 },
      { text: `${q3Base}${sep}7`, val: q3Base + 0.7 },
      { text: `${q3Base}${sep}095`, val: q3Base + 0.095 },
      { text: `${q3Base}${sep}608`, val: q3Base + 0.608 }
    ];
    const q3Sorted = [...q3List].sort((a, b) => b.val - a.val);
    const q3CorrectAnswer = q3Sorted[0].text;
    const q3CorrectVal = q3Sorted[0].val;
    const q3DisplayList = shuffle(q3List.map((o) => o.text)).join('  •  ');

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 3 • FINDING THE GREATEST NUMBER' : 'ΕΡΩΤΗΣΗ 3 • ΕΥΡΕΣΗ ΜΕΓΑΛΥΤΕΡΟΥ ΑΡΙΘΜΟΥ',
      instruction: isEn ? 'Write the greatest number:' : 'Γράψτε τον μεγαλύτερο αριθμό με κόμμα:',
      prompt: isEn
        ? `Which is the greatest number among: ${q3DisplayList}?`
        : `Ποιος είναι ο μεγαλύτερος αριθμός ανάμεσα στους: ${q3DisplayList};`,
      correctVal: q3CorrectVal,
      correctStr: q3CorrectAnswer,
      explanation: isEn
        ? `Comparing tenths: ${q3CorrectAnswer} has 7 tenths (0.700), whereas the others have 6 or 0 tenths. Therefore, the greatest is ${q3CorrectAnswer}.`
        : `Συγκρίνοντας τα δέκατα: το ${q3CorrectAnswer} έχει 7 δέκατα (0,700), ενώ οι υπόλοιποι έχουν 6 ή 0 δέκατα. Άρα ο μεγαλύτερος είναι το ${q3CorrectAnswer}.`
    });
  }

  // Q4 (MCQ): Αύξουσα Διάταξη (4 μοναδικές επιλογές)
  {
    const q4Base = randInt(2, 8);
    const q4A = `${q4Base}${sep}04`;
    const q4B = `${q4Base}${sep}4`;
    const q4C = `${q4Base}${sep}44`;
    const q4CorrectOrder = `${q4A} ＜ ${q4B} ＜ ${q4C}`;
    const q4Wrong1 = `${q4B} ＜ ${q4A} ＜ ${q4C}`;
    const q4Wrong2 = `${q4C} ＜ ${q4B} ＜ ${q4A}`;
    const q4Wrong3 = `${q4A} ＜ ${q4C} ＜ ${q4B}`;

    const uniqueOptions = makeUniqueOptions(q4CorrectOrder, [q4Wrong1, q4Wrong2, q4Wrong3]);
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === q4CorrectOrder
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • ASCENDING ORDER' : 'ΕΡΩΤΗΣΗ 4 • ΑΥΞΟΥΣΑ ΔΙΑΤΑΞΗ',
      instruction: isEn
        ? 'Select the correct order from smallest to largest:'
        : 'Επιλέξτε τη σωστή διάταξη από τον μικρότερο στον μεγαλύτερο:',
      prompt: isEn
        ? `What is the correct ascending order of the numbers: ${q4B} , ${q4A} , ${q4C}?`
        : `Ποια είναι η σωστή αύξουσα σειρά των αριθμών: ${q4B} , ${q4A} , ${q4C};`,
      options,
      correctText: q4CorrectOrder,
      explanation: isEn
        ? `Aligning decimal places: ${q4Base}.04 (4 hundredths) ＜ ${q4Base}.40 (40 hundredths) ＜ ${q4Base}.44 (44 hundredths). Thus: ${q4CorrectOrder}.`
        : `Εξισώνοντας τα ψηφία: ${q4Base},04 (4 εκατοστά) ＜ ${q4Base},40 (40 εκατοστά) ＜ ${q4Base},44 (44 εκατοστά). Άρα η σωστή σειρά είναι: ${q4CorrectOrder}.`
    });
  }

  // Q5 (MCQ): True / False - Σύγκριση Φυσικών με διαφορετικό πλήθος ψηφίων (4 μοναδικές επιλογές)
  {
    const q5Small = randInt(8500, 9999);
    const q5Big = randInt(10200, 14500);
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? `The whole number ${formatNum(q5Big, locale)} (5 digits) is greater than ${formatNum(q5Small, locale)} (4 digits).`
          : `The whole number ${formatNum(q5Small, locale)} is greater than ${formatNum(q5Big, locale)} because it starts with 9.`)
      : (q5IsTrue
          ? `Ο φυσικός αριθμός ${formatNum(q5Big, locale)} (5 ψηφία) είναι μεγαλύτερος από τον ${formatNum(q5Small, locale)} (4 ψηφία).`
          : `Ο φυσικός αριθμός ${formatNum(q5Small, locale)} είναι μεγαλύτερος από τον ${formatNum(q5Big, locale)} επειδή ξεκινάει από το 9.`);

    const c1 = isEn
      ? `True: ${formatNum(q5Big, locale)} has 5 digits, so it is strictly greater than 4-digit ${formatNum(q5Small, locale)}.`
      : `Σωστό: Ο ${formatNum(q5Big, locale)} έχει 5 ψηφία (Δεκάδες Χιλιάδων), άρα υπερέχει του 4-ψήφιου ${formatNum(q5Small, locale)}.`;
    const c2 = isEn
      ? `False: The number with more digits is always greater, regardless of the leading digit.`
      : `Λάθος: Μεγαλύτερος είναι πάντα ο αριθμός με τα περισσότερα ψηφία, ανεξάρτητα από το πρώτο ψηφίο.`;
    const w1 = isEn
      ? `True: The number starting with 9 is always smaller regardless of digit count.`
      : `Σωστό: Ο αριθμός που ξεκινάει από 9 είναι πάντα μικρότερος ανεξάρτητα από το πλήθος των ψηφίων.`;
    const w2 = isEn
      ? `False: Digit count does not play any role in comparing whole numbers.`
      : `Λάθος: Το πλήθος των ψηφίων δεν παίζει κανέναν ρόλο στη σύγκριση των φυσικών αριθμών.`;

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
      title: isEn ? 'QUESTION 5 • NUMBER OF DIGITS IN WHOLE NUMBERS' : 'ΕΡΩΤΗΣΗ 5 • ΠΛΗΘΟΣ ΨΗΦΙΩΝ ΣΕ ΦΥΣΙΚΟΥΣ',
      instruction: isEn ? 'Select the correct statement evaluation:' : 'Επιλέξτε τη σωστή αξιολόγηση της πρότασης:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? `Correct! The number ${formatNum(q5Big, locale)} has 5 digits (Ten Thousands), whereas ${formatNum(q5Small, locale)} has 4 digits (Thousands).`
            : `False! In whole numbers, the number with more digits is always greater (${formatNum(q5Big, locale)} ＞ ${formatNum(q5Small, locale)}).`)
        : (q5IsTrue
            ? `Σωστό! Ο αριθμός ${formatNum(q5Big, locale)} έχει 5 ψηφία (Δεκάδες Χιλιάδων), ενώ ο ${formatNum(q5Small, locale)} έχει 4 ψηφία (Μονάδες Χιλιάδων).`
            : `Λάθος! Στους φυσικούς αριθμούς, μεγαλύτερος είναι πάντοτε εκείνος με τα περισσότερα ψηφία (${formatNum(q5Big, locale)} ＞ ${formatNum(q5Small, locale)}).`)
    });
  }

  // Q6 (MCQ): True / False - Κανόνας Σύγκρισης Δεκαδικών (4 μοναδικές επιλογές)
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? 'To compare two decimals with identical whole parts, compare the tenths first, then the hundredths.'
          : 'The number 0.79 is greater than 0.8 because 79 is greater than 8.')
      : (q6IsTrue
          ? 'Για να συγκρίνουμε δύο δεκαδικούς αριθμούς με ίσα ακέραια μέρη, συγκρίνουμε πρώτα τα δέκατα και μετά τα εκατοστά.'
          : 'Ο αριθμός 0,79 είναι μεγαλύτερος από τον 0,8 επειδή το 79 είναι μεγαλύτερο από το 8.');

    const c1 = isEn
      ? 'True: We compare place values successively from left to right (tenths, then hundredths).'
      : 'Σωστό: Συγκρίνουμε διαδοχικά από αριστερά προς τα δεξιά (πρώτα δέκατα, μετά εκατοστά).';
    const c2 = isEn
      ? 'False: 0.8 ＝ 0.80 (80 hundredths), which is greater than 0.79 (79 hundredths).'
      : 'Λάθος: 0,8 ＝ 0,80 (80 εκατοστά), το οποίο είναι μεγαλύτερο από το 0,79 (79 εκατοστά).';
    const w1 = isEn
      ? 'True: Any number with 2 decimal places is always greater than one with 1 decimal place.'
      : 'Σωστό: Κάθε αριθμός με 2 δεκαδικά ψηφία είναι πάντα μεγαλύτερος από έναν με 1 δεκαδικό.';
    const w2 = isEn
      ? 'False: The tenths place does not matter when comparing decimals.'
      : 'Λάθος: Η θέση των δεκάτων δεν έχει καμία σημασία στη σύγκριση δεκαδικών.';

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
      title: isEn ? 'QUESTION 6 • DECIMAL COMPARISON RULES' : 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΣΥΓΚΡΙΣΗΣ ΔΕΚΑΔΙΚΩΝ',
      instruction: isEn ? 'Select the correct statement evaluation:' : 'Επιλέξτε τη σωστή αξιολόγηση της πρότασης:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? 'Correct! We compare place values successively from left to right (first tenths, then hundredths, then thousandths).'
            : 'False! 0.8 ＝ 0.80 (80 hundredths), which is greater than 0.79 (79 hundredths).')
        : (q6IsTrue
            ? 'Σωστό! Συγκρίνουμε διαδοχικά από τα αριστερά προς τα δεξιά (πρώτα δέκατα, μετά εκατοστά, μετά χιλιοστά).'
            : 'Λάθος! 0,8 ＝ 0,80 (80 εκατοστά), το οποίο είναι μεγαλύτερο από το 0,79 (79 εκατοστά).')
    });
  }

  // Q7 (MCQ): Οπτική Ζυγαριά Σύγκρισης (4 μοναδικές επιλογές)
  {
    const q7Int = randInt(2, 9);
    const q7Left = `${q7Int}${sep}35`;
    const q7Right = `${q7Int}${sep}4`;
    const q7Correct = q7Right;
    const equalChoice = isEn ? 'They are equal' : 'Είναι ίσα';
    const noneChoice = isEn ? 'Cannot be determined' : 'Δεν μπορεί να προσδιοριστεί';

    const rawOptions = [q7Left, q7Right, equalChoice, noneChoice];
    const uniqueOptions = makeUniqueOptions(q7Correct, rawOptions);
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === q7Correct
    }));

    qList.push({
      id: 7,
      type: 'mcq',
      title: isEn ? 'QUESTION 7 • VISUAL BALANCE SCALE' : 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΖΥΓΑΡΙΑ ΣΥΓΚΡΙΣΗΣ',
      instruction: isEn ? 'Select the heavier number:' : 'Επιλέξτε τον βαρύτερο αριθμό:',
      prompt: isEn
        ? `If we place the numbers ${q7Left} and ${q7Right} on the balance scale, which number is greater (heavier)?`
        : `Αν τοποθετήσουμε στη ζυγαριά τους αριθμούς ${q7Left} και ${q7Right}, ποιος αριθμός είναι ο μεγαλύτερος (βαρύτερος);`,
      options,
      correctText: q7Correct,
      explanation: isEn
        ? `Comparing tenths: ${q7Right} ＝ ${q7Int}.40 ＞ ${q7Left}. Therefore, the heavier number is ${q7Right}.`
        : `Συγκρίνοντας τα δέκατα: ${q7Right} ＝ ${q7Int},40 ＞ ${q7Left}. Επομένως, ο βαρύτερος αριθμός είναι το ${q7Right}.`
    });
  }

  // Q8 (MCQ): Δεκαδική Αριθμογραμμή & Θέση (4 μοναδικές επιλογές)
  {
    const q8Int = randInt(5, 12);
    const q8StepA = randInt(2, 4);
    const q8StepB = randInt(6, 9);
    const q8ValA = `${q8Int}${sep}${q8StepA}`;
    const q8ValB = `${q8Int}${sep}${q8StepB}`;
    const q8Correct = q8ValB;
    const samePositionChoice = isEn ? 'They are in the same position' : 'Είναι στην ίδια θέση';
    const midChoice = `${q8Int}${sep}5`;

    const rawOptions = [q8ValA, q8ValB, samePositionChoice, midChoice];
    const uniqueOptions = makeUniqueOptions(q8Correct, rawOptions);
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === q8Correct
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • DECIMAL NUMBER LINE' : 'ΕΡΩΤΗΣΗ 8 • ΔΕΚΑΔΙΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ',
      instruction: isEn ? 'Select the number positioned further to the right:' : 'Επιλέξτε τον αριθμό που βρίσκεται πιο δεξιά:',
      prompt: isEn
        ? `On the number line between ${q8ValA} and ${q8ValB}, which number is situated further to the right (is greater)?`
        : `Στην αριθμογραμμή ανάμεσα στους αριθμούς ${q8ValA} και ${q8ValB}, ποιος βρίσκεται πιο δεξιά (είναι μεγαλύτερος);`,
      options,
      correctText: q8Correct,
      explanation: isEn
        ? `On the number line, the number further to the right is the greater number. Since ${q8ValB} ＞ ${q8ValA}, ${q8ValB} is located further to the right.`
        : `Στην αριθμογραμμή, μεγαλύτερος είναι ο αριθμός που βρίσκεται πιο δεξιά. Επειδή ${q8ValB} ＞ ${q8ValA}, το ${q8ValB} βρίσκεται πιο δεξιά.`
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
    pageTitle: "Ασκήσεις: Σύγκριση & Διάταξη Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές ασκήσεις και προβλήματα στη σύγκριση και διάταξη φυσικών και δεκαδικών αριθμών για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Σύγκριση & Διάταξη",
    heroDesc: "10 απαιτητικές δραστηριότητες σύγκρισης φυσικών και δεκαδικών αριθμών, διατάξεων σε αύξουσα σειρά, οπτικών μοντέλων και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.",
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
    pageTitle: "Exercises: Comparing & Ordering Numbers - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems on comparing and ordering whole numbers and decimals for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Comparing & Ordering",
    heroDesc: "10 practice problems on comparing whole numbers and decimals, ascending order arrangements, visual models, and applied real-world word problems.",
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

export default function SigkrisiExercisesPage() {
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
          href="/st-dimotikou/04-sigkrisi-arithmon"
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
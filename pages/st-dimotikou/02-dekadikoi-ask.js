// pages/st-dimotikou/02-dekadikoi-ask.js
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
    id: 'p_dec_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const p1 = 2.45;
      const p2 = 3.8;
      const sum = Number((p1 + p2).toFixed(2));
      const unit = isEn ? 'kg' : 'kg';
      const sumStr = `${formatNum(sum, locale)} ${unit}`;

      return {
        title: isEn ? 'FRUIT WEIGHT ADDITION' : 'ΠΡΟΣΘΕΣΗ ΒΑΡΟΥΣ ΦΡΟΥΤΩΝ',
        instruction: isEn
          ? 'Solve the problem and enter the total weight in kilograms (kg):'
          : 'Λύστε το πρόβλημα και συμπληρώστε το συνολικό βάρος σε κιλά (kg) με κόμμα:',
        text: isEn
          ? `A grocery store sold ${formatNum(p1, locale)} kg of apples and ${formatNum(p2, locale)} kg of oranges. How many kilograms (kg) of fruit did it sell in total?`
          : `Ένα παντοπωλείο πούλησε ${formatNum(p1, locale)} kg μήλα και ${formatNum(p2, locale)} kg πορτοκάλια. Πόσα κιλά (kg) φρούτων πούλησε συνολικά;`,
        tableData: {
          col1: isEn ? 'Apples' : 'Μήλα',
          col2: isEn ? 'Oranges' : 'Πορτοκάλια',
          r1: [`${formatNum(p1, locale)} kg`, `${formatNum(p2, locale)} kg`],
          r2: [isEn ? 'Addition' : 'Πρόσθεση', sumStr]
        },
        correctVal: sum,
        correctStr: formatNum(sum, locale),
        explanation: isEn
          ? `Align decimals by the decimal point: ${formatNum(p1, locale)} ＋ ${formatNum(p2, locale)} ＝ ${sumStr}.`
          : `Προσθέτουμε ευθυγραμμίζοντας τις υποδιαστολές: ${formatNum(p1, locale)} ＋ ${formatNum(p2, locale)} ＝ ${sumStr}.`
      };
    }
  },
  {
    id: 'p_dec_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const initialM = 10;
      const usedM = 3.65;
      const remain = Number((initialM - usedM).toFixed(2));
      const unit = isEn ? 'm' : 'm';
      const remainStr = `${formatNum(remain, locale)} ${unit}`;

      return {
        title: isEn ? 'FABRIC LENGTH SUBTRACTION' : 'ΑΦΑΙΡΕΣΗ ΜΗΚΟΥΣ ΥΦΑΣΜΑΤΟΣ',
        instruction: isEn
          ? 'Solve the problem and enter the remaining length in meters (m):'
          : 'Λύστε το πρόβλημα και συμπληρώστε το υπόλοιπο μήκος σε μέτρα (m) με κόμμα:',
        text: isEn
          ? `From a roll of fabric ${initialM} m long, a piece measuring ${formatNum(usedM, locale)} m was cut off. How many meters (m) of fabric remain?`
          : `Από ένα ύφασμα μήκους ${initialM} m, κόπηκε ένα κομμάτι μήκους ${formatNum(usedM, locale)} m. Πόσα μέτρα (m) υφάσματος έμειναν;`,
        tableData: {
          col1: isEn ? 'Initial Length' : 'Αρχικό Μήκος',
          col2: isEn ? 'Cut Piece' : 'Κομμάτι που κόπηκε',
          r1: [`${initialM} m`, `${formatNum(usedM, locale)} m`],
          r2: [isEn ? 'Subtraction' : 'Αφαίρεση', remainStr]
        },
        correctVal: remain,
        correctStr: formatNum(remain, locale),
        explanation: isEn
          ? `Fill with trailing zeros: 10.00 － ${formatNum(usedM, locale)} ＝ ${remainStr}.`
          : `Συμπληρώνουμε μηδενικά στο ακέραιο μέρος: 10,00 － ${formatNum(usedM, locale)} ＝ ${remainStr}.`
      };
    }
  },
  {
    id: 'p_dec_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const pricePerL = 1.85;
      const liters = 4;
      const totalCost = Number((pricePerL * liters).toFixed(2));
      const costStr = `${formatNum(totalCost, locale)} €`;

      return {
        title: isEn ? 'PURCHASE COST CALCULATION' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΚΟΣΤΟΥΣ ΑΓΟΡΑΣ',
        instruction: isEn
          ? 'Solve the problem and enter the total cost in euros (€):'
          : 'Λύστε το πρόβλημα και συμπληρώστε το συνολικό ποσό σε ευρώ (€) με κόμμα:',
        text: isEn
          ? `We bought ${liters} liters of milk at ${formatNum(pricePerL, locale)} € per liter. How many euros (€) did we pay?`
          : `Αγοράσαμε ${liters} λίτρα γάλα προς ${formatNum(pricePerL, locale)} € το λίτρο. Πόσα ευρώ (€) πληρώσαμε;`,
        tableData: {
          col1: isEn ? 'Milk Liters' : 'Λίτρα Γάλακτος',
          col2: isEn ? 'Price per Liter' : 'Τιμή ανά λίτρο',
          r1: [`${liters} L`, `${formatNum(pricePerL, locale)} €`],
          r2: [isEn ? 'Multiplication' : 'Πολλαπλασιασμός', costStr]
        },
        correctVal: totalCost,
        correctStr: formatNum(totalCost, locale),
        explanation: isEn
          ? `Multiply: ${liters} · ${formatNum(pricePerL, locale)} ＝ ${costStr}.`
          : `Πολλαπλασιάζουμε: ${liters} · ${formatNum(pricePerL, locale)} ＝ ${costStr}.`
      };
    }
  },
  {
    id: 'p_dec_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const b1 = 4.25;
      const b2 = 5.5;
      const sum = Number((b1 + b2).toFixed(2));
      const sumStr = `${formatNum(sum, locale)} L`;

      return {
        title: isEn ? 'TOTAL OLIVE OIL VOLUME' : 'ΣΥΝΟΛΙΚΟΣ ΟΓΚΟΣ ΕΛΑΙΟΛΑΔΟΥ',
        instruction: isEn
          ? 'Solve the problem and enter the total volume in liters (L):'
          : 'Λύστε το πρόβλημα και συμπληρώστε τον συνολικό όγκο σε λίτρα (L) με κόμμα:',
        text: isEn
          ? `One container holds ${formatNum(b1, locale)} L of olive oil and another holds ${formatNum(b2, locale)} L. How many liters (L) do both containers hold in total?`
          : `Ένα δοχείο περιέχει ${formatNum(b1, locale)} L ελαιόλαδο και ένα άλλο ${formatNum(b2, locale)} L. Πόσα λίτρα (L) ελαιόλαδο περιέχουν συνολικά τα δύο δοχεία;`,
        tableData: {
          col1: isEn ? 'Container 1' : '1ο Δοχείο',
          col2: isEn ? 'Container 2' : '2ο Δοχείο',
          r1: [`${formatNum(b1, locale)} L`, `${formatNum(b2, locale)} L`],
          r2: [isEn ? 'Addition' : 'Πρόσθεση', sumStr]
        },
        correctVal: sum,
        correctStr: formatNum(sum, locale),
        explanation: isEn
          ? `Add tenths and hundredths: ${formatNum(b1, locale)} ＋ ${formatNum(b2, locale)} ＝ ${sumStr}.`
          : `Προσθέτουμε ευθυγραμμίζοντας τα δέκατα και τα εκατοστά: ${formatNum(b1, locale)} ＋ ${formatNum(b2, locale)} ＝ ${sumStr}.`
      };
    }
  },
  {
    id: 'p_dec_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const fullKm = 15;
      const walkedKm = 8.35;
      const remain = Number((fullKm - walkedKm).toFixed(2));
      const remainStr = `${formatNum(remain, locale)} km`;

      return {
        title: isEn ? 'HIKING TRAIL DISTANCE' : 'ΥΠΟΛΟΙΠΟ ΔΙΑΔΡΟΜΗΣ ΠΕΖΟΠΟΡΙΑΣ',
        instruction: isEn
          ? 'Solve the problem and enter the remaining distance in kilometers (km):'
          : 'Λύστε το πρόβλημα και συμπληρώστε τα υπολειπόμενα χιλιόμετρα (km) με κόμμα:',
        text: isEn
          ? `A hiking trail has a total distance of ${fullKm} km. A hiker has covered ${formatNum(walkedKm, locale)} km. How many kilometers (km) remain?`
          : `Μια διαδρομή πεζοπορίας έχει συνολικό μήκος ${fullKm} km. Ένας πεζοπόρος έχει διανύσει ${formatNum(walkedKm, locale)} km. Πόσα χιλιόμετρα (km) του απομένουν;`,
        tableData: {
          col1: isEn ? 'Total Distance' : 'Συνολικό Μήκος',
          col2: isEn ? 'Distance Covered' : 'Διανυθείσα Απόσταση',
          r1: [`${fullKm} km`, `${formatNum(walkedKm, locale)} km`],
          r2: [isEn ? 'Subtraction' : 'Αφαίρεση', remainStr]
        },
        correctVal: remain,
        correctStr: formatNum(remain, locale),
        explanation: isEn
          ? `Subtract: 15.00 － ${formatNum(walkedKm, locale)} ＝ ${remainStr}.`
          : `Αφαιρούμε: 15,00 － ${formatNum(walkedKm, locale)} ＝ ${remainStr}.`
      };
    }
  },
  {
    id: 'p_dec_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const pricePerKg = 3.4;
      const kg = 5;
      const totalCost = Number((pricePerKg * kg).toFixed(2));
      const costStr = `${formatNum(totalCost, locale)} €`;

      return {
        title: isEn ? 'HONEY PURCHASE' : 'ΑΓΟΡΑ ΜΕΛΙΟΥ',
        instruction: isEn
          ? 'Solve the problem and enter the total cost in euros (€):'
          : 'Λύστε το πρόβλημα και συμπληρώστε το συνολικό ποσό σε ευρώ (€) με κόμμα:',
        text: isEn
          ? `We bought ${kg} kg of honey at ${formatNum(pricePerKg, locale)} € per kilogram. How many euros (€) did we pay?`
          : `Αγοράσαμε ${kg} κιλά μέλι προς ${formatNum(pricePerKg, locale)} € το κιλό. Πόσα ευρώ (€) πληρώσαμε;`,
        tableData: {
          col1: isEn ? 'Quantity' : 'Ποσότητα',
          col2: isEn ? 'Price per kg' : 'Τιμή ανά κιλό',
          r1: [`${kg} kg`, `${formatNum(pricePerKg, locale)} €`],
          r2: [isEn ? 'Product' : 'Γινόμενο', costStr]
        },
        correctVal: totalCost,
        correctStr: formatNum(totalCost, locale),
        explanation: isEn
          ? `Multiply: ${kg} · ${formatNum(pricePerKg, locale)} ＝ ${costStr}.`
          : `Πολλαπλασιάζουμε: ${kg} · ${formatNum(pricePerKg, locale)} ＝ ${costStr}.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_dec_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const note50 = 50;
      const b1 = 14.85;
      const b2 = 18.40;
      const b3 = 6.25;
      const totalSpent = Number((b1 + b2 + b3).toFixed(2));
      const change = Number((note50 - totalSpent).toFixed(2));
      const correctStr = `${formatNum(change, locale)} €`;
      const fake1 = `${formatNum(Number((change + 1.5).toFixed(2)), locale)} €`;
      const fake2 = `${formatNum(Number((Math.max(1, change - 1.2)).toFixed(2)), locale)} €`;
      const fake3 = `${formatNum(Number((change + 2.4).toFixed(2)), locale)} €`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((change + (i + 1) * 0.8).toFixed(2)), locale)} €`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'COMPLEX CASH TRANSACTION' : 'ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΣΥΝΑΛΛΑΓΗΣ',
        inputInstruction: isEn
          ? 'Calculate the change in euros (€):'
          : 'Υπολογίστε τα ρέστα σε ευρώ (€) με κόμμα:',
        mcqInstruction: isEn
          ? 'Select the correct change in euros (€):'
          : 'Επιλέξτε το σωστό ποσό ρέστων σε ευρώ (€):',
        text: isEn
          ? `A shopper purchased three items priced at ${formatNum(b1, locale)} €, ${formatNum(b2, locale)} €, and ${formatNum(b3, locale)} €. They paid with a 50 € note. How much change (€) did they receive?`
          : `Ένας πελάτης αγόρασε τρία είδη αξίας ${formatNum(b1, locale)} €, ${formatNum(b2, locale)} € και ${formatNum(b3, locale)} €. Πλήρωσε με χαρτονόμισμα των 50 €. Πόσα ρέστα (€) έλαβε;`,
        tableData: {
          col1: isEn ? 'Three Items' : 'Τρία Είδη',
          col2: isEn ? 'Payment & Change' : 'Πληρωμή & Ρέστα',
          r1: [`${formatNum(b1, locale)} € ＋ ${formatNum(b2, locale)} €`, `＋ ${formatNum(b3, locale)} €`],
          r2: [
            isEn ? `Total: ${formatNum(totalSpent, locale)} €` : `Σύνολο: ${formatNum(totalSpent, locale)} €`,
            isEn ? `Change: ${correctStr}` : `Ρέστα: ${correctStr}`
          ]
        },
        correctVal: change,
        correctStr: formatNum(change, locale),
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Calculate the total cost: ${formatNum(b1, locale)} ＋ ${formatNum(b2, locale)} ＋ ${formatNum(b3, locale)} ＝ ${formatNum(totalSpent, locale)} €. Subtract from 50 €: 50.00 － ${formatNum(totalSpent, locale)} ＝ ${correctStr}.`
          : `Υπολογίζουμε το συνολικό κόστος: ${formatNum(b1, locale)} ＋ ${formatNum(b2, locale)} ＋ ${formatNum(b3, locale)} ＝ ${formatNum(totalSpent, locale)} €. Αφαιρούμε από τα 50 €: 50,00 － ${formatNum(totalSpent, locale)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_dec_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const lengthM = 8.4;
      const widthM = 5.25;
      const perim = Number((2 * (lengthM + widthM)).toFixed(2));
      const correctStr = `${formatNum(perim, locale)} m`;
      const fake1 = `${formatNum(Number((perim + 2.5).toFixed(2)), locale)} m`;
      const fake2 = `${formatNum(Number((Math.max(1, perim - 1.5)).toFixed(2)), locale)} m`;
      const fake3 = `${formatNum(Number((perim + 1.2).toFixed(2)), locale)} m`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((perim + (i + 1) * 1.1).toFixed(2)), locale)} m`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'RECTANGLE PERIMETER WITH DECIMALS' : 'ΥΠΟΛΟΓΙΣΜΟΣ ΠΕΡΙΜΕΤΡΟΥ ΜΕ ΔΕΚΑΔΙΚΟΥΣ',
        inputInstruction: isEn
          ? 'Calculate the perimeter in meters (m):'
          : 'Υπολογίστε την περίμετρο σε μέτρα (m) με κόμμα:',
        mcqInstruction: isEn
          ? 'Select the correct perimeter in meters (m):'
          : 'Επιλέξτε τη σωστή τιμή περιμέτρου σε μέτρα (m):',
        text: isEn
          ? `A rectangular room has a length of ${formatNum(lengthM, locale)} m and a width of ${formatNum(widthM, locale)} m. What is the perimeter of the room in meters (m)?`
          : `Ένα ορθογώνιο δωμάτιο έχει μήκος ${formatNum(lengthM, locale)} m και πλάτος ${formatNum(widthM, locale)} m. Πόσα μέτρα (m) είναι η περίμετρος του δωματίου;`,
        tableData: {
          col1: isEn ? 'Dimensions' : 'Διαστάσεις',
          col2: isEn ? 'Perimeter' : 'Περίμετρος',
          r1: [
            isEn ? `Length: ${formatNum(lengthM, locale)} m` : `Μήκος: ${formatNum(lengthM, locale)} m`,
            isEn ? `Width: ${formatNum(widthM, locale)} m` : `Πλάτος: ${formatNum(widthM, locale)} m`
          ],
          r2: [isEn ? '2 · (length ＋ width)' : '2 · (μήκος ＋ πλάτος)', correctStr]
        },
        correctVal: perim,
        correctStr: formatNum(perim, locale),
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Calculate: 2 · (${formatNum(lengthM, locale)} ＋ ${formatNum(widthM, locale)}) ＝ 2 · ${formatNum(lengthM + widthM, locale)} ＝ ${correctStr}.`
          : `Υπολογίζουμε: 2 · (${formatNum(lengthM, locale)} ＋ ${formatNum(widthM, locale)}) ＝ 2 · ${formatNum(lengthM + widthM, locale)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_dec_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const sack1 = 12.75;
      const sack2 = 15.6;
      const sack3 = 8.45;
      const totalWeight = Number((sack1 + sack2 + sack3).toFixed(2));
      const correctStr = `${formatNum(totalWeight, locale)} kg`;
      const fake1 = `${formatNum(Number((totalWeight + 1.2).toFixed(2)), locale)} kg`;
      const fake2 = `${formatNum(Number((Math.max(1, totalWeight - 2.5)).toFixed(2)), locale)} kg`;
      const fake3 = `${formatNum(Number((totalWeight + 3).toFixed(2)), locale)} kg`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((totalWeight + (i + 1) * 1.5).toFixed(2)), locale)} kg`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'TOTAL CARGO WEIGHT' : 'ΣΥΝΟΛΙΚΟ ΒΑΡΟΣ ΦΟΡΤΙΟΥ',
        inputInstruction: isEn
          ? 'Calculate the total weight in kilograms (kg):'
          : 'Υπολογίστε το συνολικό βάρος σε κιλά (kg) με κόμμα:',
        mcqInstruction: isEn
          ? 'Select the correct total weight in kilograms (kg):'
          : 'Επιλέξτε το σωστό συνολικό βάρος σε κιλά (kg):',
        text: isEn
          ? `A farmer loaded three sacks weighing ${formatNum(sack1, locale)} kg, ${formatNum(sack2, locale)} kg, and ${formatNum(sack3, locale)} kg. What is the total weight of the load in kilograms (kg)?`
          : `Ένας αγρότης φόρτωσε τρία σακιά με βάρη ${formatNum(sack1, locale)} kg, ${formatNum(sack2, locale)} kg και ${formatNum(sack3, locale)} kg. Πόσα κιλά (kg) ζυγίζει ολόκληρο το φορτίο;`,
        tableData: {
          col1: isEn ? 'Three Sacks' : 'Τρία Σακιά',
          col2: isEn ? 'Total Weight' : 'Συνολικό Βάρος',
          r1: [`${formatNum(sack1, locale)} kg ＋ ${formatNum(sack2, locale)} kg`, `＋ ${formatNum(sack3, locale)} kg`],
          r2: [isEn ? 'Sum' : 'Άθροισμα', correctStr]
        },
        correctVal: totalWeight,
        correctStr: formatNum(totalWeight, locale),
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Add the weights: ${formatNum(sack1, locale)} ＋ ${formatNum(sack2, locale)} ＋ ${formatNum(sack3, locale)} ＝ ${correctStr}.`
          : `Προσθέτουμε τα βάρη: ${formatNum(sack1, locale)} ＋ ${formatNum(sack2, locale)} ＋ ${formatNum(sack3, locale)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_dec_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const cap = 20;
      const fill1 = 6.8;
      const fill2 = 7.45;
      const remainL = Number((cap - (fill1 + fill2)).toFixed(2));
      const correctStr = `${formatNum(remainL, locale)} L`;
      const fake1 = `${formatNum(Number((remainL + 1.2).toFixed(2)), locale)} L`;
      const fake2 = `${formatNum(Number((Math.max(0.5, remainL - 1.5)).toFixed(2)), locale)} L`;
      const fake3 = `${formatNum(Number((remainL + 2).toFixed(2)), locale)} L`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((remainL + (i + 1) * 0.9).toFixed(2)), locale)} L`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'WATER TANK CAPACITY' : 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΔΕΞΑΜΕΝΗΣ ΝΕΡΟΥ',
        inputInstruction: isEn
          ? 'Calculate how many liters (L) are needed to fill the tank:'
          : 'Υπολογίστε πόσα λίτρα (L) χρειάζονται για να γεμίσει η δεξαμενή:',
        mcqInstruction: isEn
          ? 'Select how many liters (L) of water are needed to fill the tank:'
          : 'Επιλέξτε πόσα λίτρα (L) νερού χρειάζονται για να γεμίσει η δεξαμενή:',
        text: isEn
          ? `A water tank has a capacity of ${cap} L. First, ${formatNum(fill1, locale)} L were poured in, followed by another ${formatNum(fill2, locale)} L. How many liters (L) are still needed to fill it completely?`
          : `Μια δεξαμενή χωράει ${cap} L νερό. Ρίξαμε αρχικά ${formatNum(fill1, locale)} L και στη συνέχεια άλλα ${formatNum(fill2, locale)} L. Πόσα λίτρα (L) νερού χρειάζονται ακόμη για να γεμίσει πλήρως;`,
        tableData: {
          col1: isEn ? 'Total Capacity' : 'Συνολική Χωρητικότητα',
          col2: isEn ? 'Water Added' : 'Νερό που Ρίξαμε',
          r1: [`${cap} L`, `${formatNum(fill1, locale)} L ＋ ${formatNum(fill2, locale)} L`],
          r2: [isEn ? 'Remaining' : 'Υπόλοιπο', correctStr]
        },
        correctVal: remainL,
        correctStr: formatNum(remainL, locale),
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Calculate total water added: ${formatNum(fill1, locale)} ＋ ${formatNum(fill2, locale)} ＝ ${formatNum(fill1 + fill2, locale)} L. Subtract from total capacity: 20.00 － ${formatNum(fill1 + fill2, locale)} ＝ ${correctStr}.`
          : `Υπολογίζουμε το νερό που ρίξαμε: ${formatNum(fill1, locale)} ＋ ${formatNum(fill2, locale)} ＝ ${formatNum(fill1 + fill2, locale)} L. Αφαιρούμε από τη συνολική χωρητικότητα: 20,00 － ${formatNum(fill1 + fill2, locale)} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_dec_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const stage1 = 12.35;
      const stage2 = 14.8;
      const stage3 = 9.45;
      const totalKm = Number((stage1 + stage2 + stage3).toFixed(2));
      const correctStr = `${formatNum(totalKm, locale)} km`;
      const fake1 = `${formatNum(Number((totalKm + 1.5).toFixed(2)), locale)} km`;
      const fake2 = `${formatNum(Number((Math.max(1, totalKm - 2)).toFixed(2)), locale)} km`;
      const fake3 = `${formatNum(Number((totalKm + 3.2).toFixed(2)), locale)} km`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((totalKm + (i + 1) * 1.3).toFixed(2)), locale)} km`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: isEn ? 'TOTAL CYCLING TOUR DISTANCE' : 'ΣΥΝΟΛΙΚΗ ΑΠΟΣΤΑΣΗ ΠΟΔΗΛΑΤΙΚΟΥ ΓΥΡΟΥ',
        inputInstruction: isEn
          ? 'Calculate the total distance in kilometers (km):'
          : 'Υπολογίστε τη συνολική απόσταση σε χιλιόμετρα (km):',
        mcqInstruction: isEn
          ? 'Select the total tour distance in kilometers (km):'
          : 'Επιλέξτε τη συνολική απόσταση του γύρου σε χιλιόμετρα (km):',
        text: isEn
          ? `A cyclist rode three stages: ${formatNum(stage1, locale)} km in the first, ${formatNum(stage2, locale)} km in the second, and ${formatNum(stage3, locale)} km in the third. How many kilometers (km) did they ride in total?`
          : `Ένας ποδηλάτης διένυσε τρία ετάπ: ${formatNum(stage1, locale)} km στο πρώτο, ${formatNum(stage2, locale)} km στο δεύτερο και ${formatNum(stage3, locale)} km στο τρίτο. Πόσα χιλιόμετρα (km) διένυσε συνολικά;`,
        tableData: {
          col1: isEn ? 'Three Stages' : 'Τρία Ετάπ',
          col2: isEn ? 'Total Distance' : 'Συνολική Διαδρομή',
          r1: [`${formatNum(stage1, locale)} km ＋ ${formatNum(stage2, locale)} km`, `＋ ${formatNum(stage3, locale)} km`],
          r2: [isEn ? 'Sum' : 'Άθροισμα', correctStr]
        },
        correctVal: totalKm,
        correctStr: formatNum(totalKm, locale),
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Add the stage distances: ${formatNum(stage1, locale)} ＋ ${formatNum(stage2, locale)} ＋ ${formatNum(stage3, locale)} ＝ ${correctStr}.`
          : `Προσθέτουμε τις αποστάσεις: ${formatNum(stage1, locale)} ＋ ${formatNum(stage2, locale)} ＋ ${formatNum(stage3, locale)} ＝ ${correctStr}.`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const qList = [];

  // Q1 (Input - Decimal): Αξία δεκαδικού ψηφίου
  {
    const q1Int = randInt(12, 85);
    const q1D = randInt(1, 9);
    const q1E = randInt(1, 9);
    const q1X = randInt(1, 9);
    const sep = isEn ? '.' : ',';
    const q1DecPositions = [
      {
        name: isEn ? 'tenths' : 'δεκάτων',
        digit: q1D,
        valStr: isEn ? `0.${q1D}` : `0,${q1D}`,
        valNum: q1D / 10
      },
      {
        name: isEn ? 'hundredths' : 'εκατοστών',
        digit: q1E,
        valStr: isEn ? `0.0${q1E}` : `0,0${q1E}`,
        valNum: q1E / 100
      },
      {
        name: isEn ? 'thousandths' : 'χιλιοστών',
        digit: q1X,
        valStr: isEn ? `0.00${q1X}` : `0,00${q1X}`,
        valNum: q1X / 1000
      }
    ];
    const q1Choice = q1DecPositions[randInt(0, 2)];
    const q1FullNumStr = `${q1Int}${sep}${q1D}${q1E}${q1X}`;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 1 • DECIMAL DIGIT PLACE VALUE' : 'ΕΡΩΤΗΣΗ 1 • ΑΞΙΑ ΔΕΚΑΔΙΚΟΥ ΨΗΦΙΟΥ',
      instruction: isEn
        ? 'Write the numerical value of the digit in decimal form (e.g. 0.5 or 0.05):'
        : 'Γράψτε την αριθμητική αξία του ψηφίου σε δεκαδική μορφή (π.χ. 0,5 ή 0,05):',
      prompt: isEn
        ? `In the decimal number ${q1FullNumStr}, what is the place value of the ${q1Choice.name} digit (${q1Choice.digit})?`
        : `Στον δεκαδικό αριθμό ${q1FullNumStr}, ποια είναι η αξία του ψηφίου των ${q1Choice.name} (${q1Choice.digit});`,
      correctVal: q1Choice.valNum,
      correctStr: q1Choice.valStr,
      explanation: isEn
        ? `The digit ${q1Choice.digit} is in the ${q1Choice.name} position, so its value is ${q1Choice.valStr}.`
        : `Το ψηφίο ${q1Choice.digit} βρίσκεται στη θέση των ${q1Choice.name}, άρα η αξία του είναι ${q1Choice.valStr}.`
    });
  }

  // Q2 (Input - Decimal): Μετατροπή Δεκαδικού Κλάσματος σε Δεκαδικό Αριθμό
  {
    const q2DenomType = randInt(1, 3);
    let q2Numer = 0;
    let q2AnswerStr = '';
    let q2Denom = 10;
    let q2Val = 0;

    if (q2DenomType === 1) {
      q2Numer = randInt(15, 95);
      q2Denom = 10;
      q2Val = q2Numer / 10;
      q2AnswerStr = formatNum(q2Val, locale, 1);
    } else if (q2DenomType === 2) {
      q2Numer = randInt(105, 995);
      q2Denom = 100;
      q2Val = q2Numer / 100;
      q2AnswerStr = formatNum(q2Val, locale, 2);
    } else {
      q2Numer = randInt(1025, 9850);
      q2Denom = 1000;
      q2Val = q2Numer / 1000;
      q2AnswerStr = formatNum(q2Val, locale, 3);
    }

    const fractionHtml = renderFraction(q2Numer, q2Denom);

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 2 • DECIMAL FRACTION TO DECIMAL' : 'ΕΡΩΤΗΣΗ 2 • ΔΕΚΑΔΙΚΟ ΚΛΑΣΜΑ ΣΕ ΔΕΚΑΔΙΚΟ',
      instruction: isEn
        ? 'Write the fraction as a decimal number:'
        : 'Γράψτε το κλάσμα ως δεκαδικό αριθμό με κόμμα:',
      promptHtml: isEn
        ? `Which decimal number is equal to the fraction <span class="inline-flex items-center align-middle">${fractionHtml}</span>?`
        : `Ποιος δεκαδικός αριθμός ισούται με το κλάσμα <span class="inline-flex items-center align-middle">${fractionHtml}</span>;`,
      prompt: isEn
        ? `Which decimal number is equal to the fraction ${q2Numer} / ${q2Denom}?`
        : `Ποιος δεκαδικός αριθμός ισούται με το κλάσμα ${q2Numer} / ${q2Denom};`,
      correctVal: q2Val,
      correctStr: q2AnswerStr,
      explanationHtml: isEn
        ? `Dividing numerator by ${q2Denom} moves the decimal point ${q2Denom === 10 ? '1 place' : q2Denom === 100 ? '2 places' : '3 places'} left: <span class="inline-flex items-center align-middle">${fractionHtml}</span> ＝ ${q2Numer} : ${q2Denom} ＝ ${q2AnswerStr}.`
        : `Διαιρώντας τον αριθμητή με το ${q2Denom}, μετακινούμε την υποδιαστολή ${q2Denom === 10 ? '1 θέση' : q2Denom === 100 ? '2 θέσεις' : '3 θέσεις'} αριστερά: <span class="inline-flex items-center align-middle">${fractionHtml}</span> ＝ ${q2Numer} : ${q2Denom} ＝ ${q2AnswerStr}.`,
      explanation: isEn
        ? `Dividing numerator by ${q2Denom} moves the decimal point ${q2Denom === 10 ? '1 place' : q2Denom === 100 ? '2 places' : '3 places'} left: ${q2Numer} : ${q2Denom} ＝ ${q2AnswerStr}.`
        : `Διαιρώντας τον αριθμητή με το ${q2Denom}, μετακινούμε την υποδιαστολή ${q2Denom === 10 ? '1 θέση' : q2Denom === 100 ? '2 θέσεις' : '3 θέσεις'} αριστερά: ${q2Numer} : ${q2Denom} ＝ ${q2AnswerStr}.`
    });
  }

  // Q3 (MCQ): Σύνθεση δεκαδικού από αναπτυγμένη μορφή
  {
    const q3M = randInt(2, 9);
    const q3D = randInt(1, 9);
    const q3E = randInt(1, 9);
    const sep = isEn ? '.' : ',';
    const q3CorrectStr = `${q3M * 10}${sep}${q3D}${q3E}`;
    const q3Wrong1 = `${q3M}${sep}${q3D}${q3E}`;
    const q3Wrong2 = `${q3M * 10}${sep}0${q3D}${q3E}`;
    const q3Wrong3 = `${q3M * 100}${sep}${q3D}${q3E}`;

    const tenthsFactor = isEn ? '0.1' : '0,1';
    const hundFactor = isEn ? '0.01' : '0,01';

    const uniqueOptions = makeUniqueOptions(q3CorrectStr, [q3Wrong1, q3Wrong2, q3Wrong3], (i) =>
      `${(q3M + i) * 10}${sep}${q3D}${q3E}`
    );
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === q3CorrectStr
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • DECIMAL COMPOSITION' : 'ΕΡΩΤΗΣΗ 3 • ΣΥΝΘΕΣΗ ΔΕΚΑΔΙΚΟΥ ΑΡΙΘΜΟΥ',
      instruction: isEn ? 'Select the correct decimal number:' : 'Επιλέξτε τον σωστό δεκαδικό αριθμό:',
      prompt: isEn
        ? `Which decimal results from: (${q3M} · 10) ＋ (${q3D} · ${tenthsFactor}) ＋ (${q3E} · ${hundFactor})?`
        : `Ποιος δεκαδικός προκύπτει από την πράξη: (${q3M} · 10) ＋ (${q3D} · ${tenthsFactor}) ＋ (${q3E} · ${hundFactor});`,
      options,
      correctText: q3CorrectStr,
      explanation: isEn
        ? `Summing the terms: ${q3M * 10} ＋ 0.${q3D} ＋ 0.0${q3E} ＝ ${q3CorrectStr}.`
        : `Υπολογίζοντας τα επιμέρους γινόμενα: ${q3M * 10} ＋ 0,${q3D} ＋ 0,0${q3E} ＝ ${q3CorrectStr}.`
    });
  }

  // Q4 (MCQ): Σύγκριση / Διάταξη δεκαδικών αριθμών
  {
    const q4BaseInt = randInt(14, 48);
    const sep = isEn ? '.' : ',';
    const o1 = `${q4BaseInt}${sep}8`;
    const o2 = `${q4BaseInt}${sep}75`;
    const o3 = `${q4BaseInt}${sep}095`;
    const o4 = `${q4BaseInt}${sep}705`;

    const uniqueOptions = makeUniqueOptions(o1, [o2, o3, o4], (i) =>
      `${q4BaseInt}${sep}6${i}5`
    );
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === o1
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • COMPARING DECIMALS' : 'ΕΡΩΤΗΣΗ 4 • ΣΥΓΚΡΙΣΗ ΔΕΚΑΔΙΚΩΝ',
      instruction: isEn ? 'Select the greatest number:' : 'Επιλέξτε τον μεγαλύτερο αριθμό:',
      prompt: isEn
        ? 'Which of the following decimal numbers is the greatest?'
        : 'Ποιος από τους παρακάτω δεκαδικούς αριθμούς είναι ο μεγαλύτερος;',
      options,
      correctText: o1,
      explanation: isEn
        ? `Comparing tenths first and then hundredths, the greatest number is ${o1} (since 8 tenths ＝ 0.800 ＞ 0.750 ＞ 0.705 ＞ 0.095).`
        : `Συγκρίνοντας πρώτα τα δέκατα και μετά τα εκατοστά, ο μεγαλύτερος αριθμός είναι το ${o1} (αφού 8 δέκατα ＝ 0,800 ＞ 0,750 ＞ 0,705 ＞ 0,095).`
    });
  }

  // Q5 (MCQ): Μηδενικά στο τέλος του δεκαδικού μέρους (4 μοναδικές επιλογές)
  {
    const q5Int = randInt(3, 18);
    const q5Dec = randInt(2, 8);
    const sep = isEn ? '.' : ',';
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? `The decimal numbers ${q5Int}${sep}${q5Dec} and ${q5Int}${sep}${q5Dec}00 have exactly the same numerical value.`
          : `The number ${q5Int}${sep}${q5Dec}00 is 100 times greater than ${q5Int}${sep}${q5Dec}.`)
      : (q5IsTrue
          ? `Οι δεκαδικοί αριθμοί ${q5Int}${sep}${q5Dec} και ${q5Int}${sep}${q5Dec}00 έχουν ακριβώς την ίδια αξία.`
          : `Ο αριθμός ${q5Int}${sep}${q5Dec}00 είναι 100 φορές μεγαλύτερος από τον αριθμό ${q5Int}${sep}${q5Dec}.`);

    const c1 = isEn
      ? 'True: Adding zeros at the end of the decimal part does not alter its value.'
      : 'Σωστό: Η προσθήκη μηδενικών στο τέλος του δεκαδικού μέρους δεν αλλάζει την αξία του.';
    const c2 = isEn
      ? 'False: Trailing decimal zeros do not change value; the two numbers are equal.'
      : 'Λάθος: Τα τελικά μηδενικά στο δεκαδικό μέρος δεν αλλάζουν την αξία· οι αριθμοί είναι ίσοι.';
    const w1 = isEn
      ? 'True: Any zero added in a number always multiplies it by 10.'
      : 'Σωστό: Κάθε μηδενικό που προστίθεται πολλαπλασιάζει πάντα τον αριθμό επί 10.';
    const w2 = isEn
      ? 'False: Adding trailing zeros always makes the decimal number smaller.'
      : 'Λάθος: Η προσθήκη τελικών μηδενικών κάνει πάντα τον δεκαδικό μικρότερο.';

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
      title: isEn ? 'QUESTION 5 • EQUIVALENT DECIMALS & ZEROS' : 'ΕΡΩΤΗΣΗ 5 • ΙΣΟΔΥΝΑΜΟΙ ΔΕΚΑΔΙΚΟΙ & ΜΗΔΕΝΙΚΑ',
      instruction: isEn ? 'Select the correct statement evaluation:' : 'Επιλέξτε τη σωστή αξιολόγηση της πρότασης:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? 'Correct! Adding or removing trailing zeros at the end of the decimal part does not alter the value of the number.'
            : 'False! Trailing zeros in the decimal part do not change the value (e.g. 5.4 ＝ 5.40 ＝ 5.400).')
        : (q5IsTrue
            ? 'Σωστό! Η προσθήκη ή αφαίρεση μηδενικών στο τέλος του δεκαδικού μέρους δεν αλλάζει την αξία του αριθμού.'
            : 'Λάθος! Τα τελικά μηδενικά στο δεκαδικό μέρος δεν μεταβάλλουν την αξία (π.χ. 5,4 ＝ 5,40 ＝ 5,400).')
    });
  }

  // Q6 (MCQ): Σχέση δεκαδικών μονάδων (4 μοναδικές επιλογές)
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? '1 tenth (0.1) equals 10 hundredths (0.10) and 100 thousandths (0.100).'
          : '1 hundredth (0.01) is 10 times greater than 1 tenth (0.1).')
      : (q6IsTrue
          ? '1 δέκατο (0,1) ισοδυναμεί με 10 εκατοστά (0,10) και με 100 χιλιοστά (0,100).'
          : '1 εκατοστό (0,01) είναι 10 φορές μεγαλύτερο από 1 δέκατο (0,1).');

    const c1 = isEn
      ? 'True: Each decimal unit is 10 times greater than the unit to its right.'
      : 'Σωστό: Κάθε δεκαδική μονάδα είναι 10 φορές μεγαλύτερη από τη μονάδα δεξιά της.';
    const c2 = isEn
      ? 'False: 1 tenth is 10 times greater than 1 hundredth, not smaller.'
      : 'Λάθος: Το 1 δέκατο είναι 10 φορές μεγαλύτερο από το 1 εκατοστό (όχι μικρότερο).';
    const w1 = isEn
      ? 'True: Tenths and hundredths represent completely identical place sizes.'
      : 'Σωστό: Τα δέκατα και τα εκατοστά εκφράζουν ακριβώς το ίδιο μέγεθος θέσης.';
    const w2 = isEn
      ? 'False: 1 hundredth contains exactly 100 tenths.'
      : 'Λάθος: Το 1 εκατοστό περιέχει ακριβώς 100 δέκατα.';

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
      title: isEn ? 'QUESTION 6 • DECIMAL PLACE RELATIONSHIPS' : 'ΕΡΩΤΗΣΗ 6 • ΣΧΕΣΕΙΣ ΔΕΚΑΔΙΚΩΝ ΜΟΝΑΔΩΝ',
      instruction: isEn ? 'Select the correct statement evaluation:' : 'Επιλέξτε τη σωστή αξιολόγηση της πρότασης:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? 'Correct! Each decimal unit is 10 times greater than the one to its immediate right (1 tenth ＝ 10 hundredths ＝ 100 thousandths).'
            : 'False! 1 tenth (0.1) is 10 times greater (not smaller) than 1 hundredth (0.01).')
        : (q6IsTrue
            ? 'Σωστό! Κάθε δεκαδική μονάδα είναι 10 φορές μεγαλύτερη από την αμέσως δεξιά της (1 δέκατο ＝ 10 εκατοστά ＝ 100 χιλιοστά).'
            : 'Λάθος! Το 1 δέκατο (0,1) είναι 10 φορές μεγαλύτερο (και όχι μικρότερο) από το 1 εκατοστό (0,01).')
    });
  }

  // Q7 & Q8: Κανονικό Πρόβλημα & Αριθμογραμμή
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate(locale);

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: `${isEn ? 'QUESTION 7 • ' : 'ΕΡΩΤΗΣΗ 7 • '}${stdProb.title}`,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      correctVal: stdProb.correctVal,
      correctStr: stdProb.correctStr,
      explanation: stdProb.explanation
    });

    const q8Step = randInt(1, 9);
    const q8CorrectVal = formatNum(3 + q8Step * 0.1, locale, 1);
    const w1 = formatNum(3 + (q8Step === 9 ? 7 : q8Step + 1) * 0.1, locale, 1);
    const w2 = formatNum(3 + (q8Step === 1 ? 3 : q8Step - 1) * 0.1, locale, 1);
    const sep = isEn ? '.' : ',';
    const w3 = `3${sep}0${q8Step}`;

    const uniqueOptionsQ8 = makeUniqueOptions(q8CorrectVal, [w1, w2, w3], (i) =>
      formatNum(3 + ((q8Step + i + 2) % 10) * 0.1, locale, 1)
    );
    const optionsQ8 = uniqueOptionsQ8.map((text) => ({
      text,
      isCorrect: text === q8CorrectVal
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • DECIMAL NUMBER LINE' : 'ΕΡΩΤΗΣΗ 8 • ΔΕΚΑΔΙΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ',
      instruction: isEn ? 'Select the decimal number indicated on the line:' : 'Επιλέξτε τον δεκαδικό αριθμό που δείχνει ο δείκτης:',
      prompt: isEn
        ? `On the number line between 3.0 and 4.0, which number is located ${q8Step} tenths past 3.0?`
        : `Στην αριθμογραμμή μεταξύ του 3,0 και του 4,0, ποιος αριθμός βρίσκεται ${q8Step} δέκατα μετά το 3,0;`,
      options: optionsQ8,
      correctText: q8CorrectVal,
      explanation: isEn
        ? `The marker is ${q8Step} tenths past 3.0, corresponding to ${q8CorrectVal}.`
        : `Ο δείκτης βρίσκεται ${q8Step} υποδιαιρέσεις (δέκατα) μετά το 3,0, άρα αντιστοιχεί στο ${q8CorrectVal}.`
    });
  }

  // Q9 & Q10: Προβλήματα Αυξημένης Δυσκολίας
  {
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const hardProb1 = shuffledHard[0].generate(locale);
    const hardProb2 = shuffledHard[1].generate(locale);

    qList.push({
      id: 9,
      type: 'decimal_input',
      title: `${isEn ? 'QUESTION 9 • ' : 'ΕΡΩΤΗΣΗ 9 • '}${hardProb1.title}`,
      instruction: hardProb1.inputInstruction,
      prompt: hardProb1.text,
      tableData: hardProb1.tableData,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    qList.push({
      id: 10,
      type: 'mcq',
      title: `${isEn ? 'QUESTION 10 • ' : 'ΕΡΩΤΗΣΗ 10 • '}${hardProb2.title}`,
      instruction: hardProb2.mcqInstruction,
      prompt: hardProb2.text,
      tableData: hardProb2.tableData,
      options: hardProb2.options,
      correctText: hardProb2.correctText,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

const UI_STRINGS = {
  el: {
    pageTitle: "Ασκήσεις: Δεκαδικοί Αριθμοί - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές ασκήσεις και προβλήματα στους δεκαδικούς αριθμούς, τα δεκαδικά κλάσματα, τη σύγκριση και την αξία θέσης για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Δεκαδικοί Αριθμοί",
    heroDesc: "10 απαιτητικές δραστηριότητες με δέκατα, εκατοστά, χιλιοστά, μετατροπές δεκαδικών κλασμάτων και 4 ρεαλιστικά προβλήματα συναλλαγών και περιμέτρων. Συμπληρώστε τις απαντήσεις σας και ελέγξτε την επίδοσή σας.",
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
    pageTitle: "Exercises: Decimal Numbers - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems on decimals, tenths, hundredths, thousandths, decimal fractions, and real-world transactions for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Decimal Numbers",
    heroDesc: "10 interactive activities covering tenths, hundredths, thousandths, fraction conversions, and 4 applied problems. Complete your answers and check your score.",
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

export default function DekadikoiExercisesPage() {
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
          href="/st-dimotikou/02-dekadikoi"
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

        {/* Λιστα 10 Ασκησεων */}
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
                {/* Επικεφαλιδα Ερωτησης */}
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

                {/* Εκφωνηση: Πληρης αποφυγη πινακα πριν την υποβολη */}
                <div className="space-y-3 mb-5">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500 break-words">
                      {q.instruction}
                    </p>
                  )}
                  {q.promptHtml ? (
                    <p
                      className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed break-words [overflow-wrap:anywhere]"
                      dangerouslySetInnerHTML={{ __html: q.promptHtml }}
                    />
                  ) : (
                    <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed break-words [overflow-wrap:anywhere]">
                      {q.prompt}
                    </p>
                  )}
                </div>

                {/* Περιοχη Απαντησης */}
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

                {/* Feedback μετα την υποβολη */}
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

                    {q.explanationHtml ? (
                      <div
                        className="break-words [overflow-wrap:anywhere]"
                        dangerouslySetInnerHTML={{ __html: q.explanationHtml }}
                      />
                    ) : (
                      <div className="break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                    )}

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

        {/* Κουμπι Ελεγχου στο τελος της σελιδας */}
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
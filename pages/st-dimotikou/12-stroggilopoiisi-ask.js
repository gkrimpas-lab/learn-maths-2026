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
    { item: 'το μήκος της διαδρομής', unit: 'm' },
    { item: 'το βάρος του κιβωτίου', unit: 'kg' },
    { item: 'την τιμή του ηλεκτρονικού υπολογιστή', unit: '€' },
    { item: 'την απόσταση μεταξύ των δύο πόλεων', unit: 'km' },
    { item: 'την ποσότητα του ελαιολάδου', unit: 'L' },
    { item: 'το εμβαδόν του οικοπέδου', unit: 'τ.μ.' }
  ],
  en: [
    { item: 'the route length', unit: 'm' },
    { item: 'the crate weight', unit: 'kg' },
    { item: 'the computer price', unit: '€' },
    { item: 'the distance between the two cities', unit: 'km' },
    { item: 'the olive oil quantity', unit: 'L' },
    { item: 'the plot area', unit: 'sq.m.' }
  ]
};

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_round_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const budgetFloat = parseFloat(`${randInt(140, 380)}.${randInt(1, 9)}${randInt(5, 9)}`);
      const budgetStr = formatNum(budgetFloat, locale, 2);
      const roundedHundreds = Math.round(budgetFloat / 100) * 100;
      return {
        title: isEn ? 'ROUNDING SCHOOL BUDGET' : 'ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΣΧΟΛΙΚΟΥ ΠΡΟΫΠΟΛΟΓΙΣΜΟΥ',
        instruction: isEn ? 'Calculate rounded amount in euros (€):' : 'Υπολογίστε το στρογγυλοποιημένο ποσό σε ευρώ (€):',
        text: isEn
          ? `A school raised ${budgetStr} € for sports equipment. What is the approximate amount rounded to the nearest hundred euros (€)?`
          : `Ένα σχολείο συγκέντρωσε ${budgetStr} € για την αγορά αθλητικού εξοπλισμού. Ποιο είναι το προσεγγιστικό ποσό αν γίνει στρογγυλοποίηση στην πλησιέστερη εκατοντάδα ευρώ (€);`,
        tableData: {
          col1: isEn ? 'Exact Amount' : 'Ακριβές Ποσό',
          col2: isEn ? 'Rounding Place' : 'Τάξη Στρογγυλοποίησης',
          r1: [`${budgetStr} €`, isEn ? 'Hundreds' : 'Εκατοντάδες'],
          r2: [isEn ? 'Key digit (Tens)' : 'Ψηφίο-κλειδί (Δεκάδες)', `${roundedHundreds} €`]
        },
        correctVal: roundedHundreds,
        correctStr: String(roundedHundreds),
        explanation: isEn
          ? `Inspect the tens digit. Rounding to the nearest hundred yields ${roundedHundreds} €.`
          : `Εξετάζουμε το ψηφίο των δεκάδων. Στρογγυλοποιώντας στην πλησιέστερη εκατοντάδα βρίσκουμε ${roundedHundreds} €.`
      };
    }
  },
  {
    id: 'p_round_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const weightFloat = parseFloat(`${randInt(4, 18)}.${randInt(1, 9)}${randInt(5, 9)}${randInt(1, 9)}`);
      const weightStr = formatNum(weightFloat, locale, 3);
      const roundedValNum = parseFloat((Math.round(weightFloat * 10) / 10).toFixed(1));
      const roundedTenths = formatNum(roundedValNum, locale, 1);
      return {
        title: isEn ? 'ROUNDING PARCEL WEIGHT' : 'ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΒΑΡΟΥΣ ΔΕΜΑΤΟΣ',
        instruction: isEn ? 'Calculate weight rounded to tenths (0.1 kg):' : 'Υπολογίστε το βάρος στα πλησιέστερα δέκατα (0,1) σε κιλά (kg) με κόμμα:',
        text: isEn
          ? `A parcel weighs ${weightStr} kg. What is its weight rounded to the nearest tenth (0.1) of a kilogram?`
          : `Ένα δέμα ζυγίζει ${weightStr} kg. Ποιο είναι το βάρος του δέματος στρογγυλοποιημένο στα πλησιέστερα δέκατα (0,1) του κιλού;`,
        tableData: {
          col1: isEn ? 'Exact Weight' : 'Ακριβές Βάρος',
          col2: isEn ? 'To Tenths (0.1)' : 'Στα Δέκατα (0,1)',
          r1: [`${weightStr} kg`, isEn ? 'Tenths' : 'Δέκατα'],
          r2: [isEn ? 'Key digit (Hundredths)' : 'Ψηφίο-κλειδί (Εκατοστά)', `${roundedTenths} kg`]
        },
        correctVal: roundedValNum,
        correctStr: roundedTenths,
        explanation: isEn
          ? `Inspect the hundredths digit. Rounding to the nearest tenth yields ${roundedTenths} kg.`
          : `Εξετάζουμε το ψηφίο των εκατοστών. Στρογγυλοποιώντας στα πλησιέστερα δέκατα προκύπτει ${roundedTenths} kg.`
      };
    }
  },
  {
    id: 'p_round_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const roadKm = parseFloat(`${randInt(25, 85)}.${randInt(1, 9)}${randInt(1, 9)}`);
      const roadStr = formatNum(roadKm, locale, 2);
      const roundedUnits = Math.round(roadKm);
      return {
        title: isEn ? 'CYCLING ROUTE DISTANCE' : 'ΜΗΚΟΣ ΠΟΔΗΛΑΤΙΚΗΣ ΔΙΑΔΡΟΜΗΣ',
        instruction: isEn ? 'Calculate integer kilometers (km):' : 'Υπολογίστε τα ακέραια χιλιόμετρα (km):',
        text: isEn
          ? `A cycling route is ${roadStr} km long. What is the integer distance if rounded to the nearest unit?`
          : `Μια διαδρομή ποδηλασίας έχει μήκος ${roadStr} km. Πόσα είναι τα ακέραια χιλιόμετρα της διαδρομής αν στρογγυλοποιηθεί στις πλησιέστερες ακέραιες μονάδες;`,
        tableData: {
          col1: isEn ? 'Route Length' : 'Μήκος Διαδρομής',
          col2: isEn ? 'To Units' : 'Στις Ακέραιες Μονάδες',
          r1: [`${roadStr} km`, isEn ? 'Units' : 'Μονάδες'],
          r2: [isEn ? 'Key digit (Tenths)' : 'Ψηφίο-κλειδί (Δέκατα)', `${roundedUnits} km`]
        },
        correctVal: roundedUnits,
        correctStr: String(roundedUnits),
        explanation: isEn
          ? `Inspect the tenths digit. Rounding to the nearest unit yields ${roundedUnits} km.`
          : `Εξετάζουμε το ψηφίο των δεκάτων. Στρογγυλοποιώντας στις πλησιέστερες ακέραιες μονάδες βρίσκουμε ${roundedUnits} km.`
      };
    }
  },
  {
    id: 'p_round_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const fuelL = parseFloat(`${randInt(35, 75)}.${randInt(1, 9)}${randInt(5, 9)}`);
      const fuelStr = formatNum(fuelL, locale, 2);
      const roundedTens = Math.round(fuelL / 10) * 10;
      return {
        title: isEn ? 'FUEL CONSUMPTION' : 'ΚΑΤΑΝΑΛΩΣΗ ΚΑΥΣΙΜΟΥ',
        instruction: isEn ? 'Calculate amount rounded to the nearest ten liters (L):' : 'Υπολογίστε την ποσότητα στην πλησιέστερη δεκάδα λίτρων (L):',
        text: isEn
          ? `A vehicle consumed ${fuelStr} L of fuel during a long trip. What is the approximate fuel volume rounded to the nearest ten liters?`
          : `Ένα όχημα κατανάλωσε ${fuelStr} L καυσίμου σε ένα μεγάλο ταξίδι. Πόσα λίτρα (L) καυσίμου είναι κατά προσέγγιση αν στρογγυλοποιήσουμε στην πλησιέστερη δεκάδα;`,
        tableData: {
          col1: isEn ? 'Exact Volume' : 'Ακριβής Ποσότητα',
          col2: isEn ? 'Nearest Ten' : 'Πλησιέστερη Δεκάδα',
          r1: [`${fuelStr} L`, isEn ? 'Tens' : 'Δεκάδες'],
          r2: [isEn ? 'Key digit (Units)' : 'Ψηφίο-κλειδί (Μονάδες)', `${roundedTens} L`]
        },
        correctVal: roundedTens,
        correctStr: String(roundedTens),
        explanation: isEn
          ? `Inspect the units digit. Rounding to the nearest ten yields ${roundedTens} L.`
          : `Εξετάζουμε το ψηφίο των μονάδων. Στρογγυλοποιώντας στην πλησιέστερη δεκάδα προκύπτει ${roundedTens} L.`
      };
    }
  },
  {
    id: 'p_round_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const priceFloat = parseFloat(`${randInt(12, 45)}.${randInt(1, 9)}${randInt(1, 9)}${randInt(5, 9)}`);
      const priceStr = formatNum(priceFloat, locale, 3);
      const roundedValNum = parseFloat((Math.round(priceFloat * 100) / 100).toFixed(2));
      const roundedHundr = formatNum(roundedValNum, locale, 2);
      return {
        title: isEn ? 'ROUNDING PRICE TO HUNDREDTHS' : 'ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΤΙΜΗΣ ΣΤΑ ΕΚΑΤΟΣΤΑ',
        instruction: isEn ? 'Calculate price rounded to hundredths of a euro (0.01 €):' : 'Υπολογίστε την τιμή στα πλησιέστερα εκατοστά του ευρώ (0,01 €) με κόμμα:',
        text: isEn
          ? `A product price was calculated at ${priceStr} €. What is the final price rounded to the nearest hundredth (euro cents)?`
          : `Ένα προϊόν τιμολογήθηκε με υπολογιστική ακρίβεια στα ${priceStr} €. Ποια είναι η τιμή του προϊόντος στρογγυλοποιημένη στα πλησιέστερα εκατοστά (λεπτά του ευρώ);`,
        tableData: {
          col1: isEn ? 'Exact Price' : 'Ακριβής Τιμή',
          col2: isEn ? 'To Hundredths (0.01 €)' : 'Στα Εκατοστά (0,01)',
          r1: [`${priceStr} €`, isEn ? 'Hundredths' : 'Εκατοστά'],
          r2: [isEn ? 'Key digit (Thousandths)' : 'Ψηφίο-κλειδί (Χιλιοστά)', `${roundedHundr} €`]
        },
        correctVal: roundedValNum,
        correctStr: roundedHundr,
        explanation: isEn
          ? `Inspect the thousandths digit. Rounding to hundredths yields ${roundedHundr} €.`
          : `Εξετάζουμε το ψηφίο των χιλιοστών. Στρογγυλοποιώντας στα εκατοστά βρίσκουμε ${roundedHundr} €.`
      };
    }
  },
  {
    id: 'p_round_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const distFloat = parseFloat(`${randInt(1200, 3800)}.${randInt(1, 9)}`);
      const distStr = formatNum(distFloat, locale, 1);
      const roundedThousands = Math.round(distFloat / 1000) * 1000;
      return {
        title: isEn ? 'ROUNDING TO THOUSANDS' : 'ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΣΤΙΣ ΧΙΛΙΑΔΕΣ',
        instruction: isEn ? 'Calculate distance rounded to the nearest thousand meters (m):' : 'Υπολογίστε την απόσταση στην πλησιέστερη χιλιάδα μέτρων (m):',
        text: isEn
          ? `A route was measured at ${distStr} m. What is its length rounded to the nearest thousand meters?`
          : `Μια διαδρομή μετρήθηκε στα ${distStr} m. Ποιο είναι το μήκος της διαδρομής στρογγυλοποιημένο στην πλησιέστερη χιλιάδα μέτρων;`,
        tableData: {
          col1: isEn ? 'Exact Length' : 'Ακριβές Μήκος',
          col2: isEn ? 'To Thousands' : 'Στις Χιλιάδες',
          r1: [`${distStr} m`, isEn ? 'Thousands' : 'Χιλιάδες'],
          r2: [isEn ? 'Key digit (Hundreds)' : 'Ψηφίο-κλειδί (Εκατοντάδες)', `${roundedThousands} m`]
        },
        correctVal: roundedThousands,
        correctStr: String(roundedThousands),
        explanation: isEn
          ? `Inspect the hundreds digit. Rounding to the nearest thousand yields ${roundedThousands} m.`
          : `Εξετάζουμε το ψηφίο των εκατοντάδων. Στρογγυλοποιώντας στην πλησιέστερη χιλιάδα προκύπτει ${roundedThousands} m.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_round_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const budgetFloat = parseFloat(`${randInt(140, 380)}.${randInt(1, 9)}${randInt(5, 9)}`);
      const budgetStr = formatNum(budgetFloat, locale, 2);
      const roundedHundreds = Math.round(budgetFloat / 100) * 100;
      const correctStr = `${roundedHundreds} €`;
      const fake1 = `${roundedHundreds + 100} €`;
      const fake2 = `${Math.max(100, roundedHundreds - 100)} €`;
      const fake3 = `${Math.floor(budgetFloat / 10) * 10} €`;

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${roundedHundreds + (step % 2 === 0 ? step * 100 : -step * 50)} €`
      );

      return {
        title: isEn ? 'EQUIPMENT COST ESTIMATION' : 'ΕΚΤΙΜΗΣΗ ΚΟΣΤΟΥΣ ΕΞΟΠΛΙΣΜΟΥ',
        instruction: isEn ? 'Select value rounded to the nearest hundred euros (€):' : 'Επιλέξτε τη στρογγυλοποιημένη τιμή στην πλησιέστερη εκατοντάδα ευρώ (€):',
        text: isEn
          ? `A school raised ${budgetStr} € for sports equipment. What is the approximate amount rounded to the nearest hundred euros (€)?`
          : `Ένα σχολείο συγκέντρωσε ${budgetStr} € για την αγορά αθλητικού εξοπλισμού. Ποιο είναι το προσεγγιστικό ποσό αν γίνει στρογγυλοποίηση στην πλησιέστερη εκατοντάδα ευρώ (€);`,
        tableData: {
          col1: isEn ? 'Exact Amount' : 'Ακριβές Ποσό',
          col2: isEn ? 'Rounding Place' : 'Τάξη Στρογγυλοποίησης',
          r1: [`${budgetStr} €`, isEn ? 'Hundreds' : 'Εκατοντάδες'],
          r2: [isEn ? 'Key digit (Tens)' : 'Ψηφίο-κλειδί (Δεκάδες)', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Inspect the tens digit. Rounding to the nearest hundred gives ${correctStr}.`
          : `Εξετάζουμε το ψηφίο των δεκάδων. Στρογγυλοποιώντας στην πλησιέστερη εκατοντάδα προκύπτει ${correctStr}.`
      };
    }
  },
  {
    id: 'p_round_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const weightFloat = parseFloat(`${randInt(4, 18)}.${randInt(1, 9)}${randInt(5, 9)}${randInt(1, 9)}`);
      const weightStr = formatNum(weightFloat, locale, 3);
      const roundedValNum = parseFloat((Math.round(weightFloat * 10) / 10).toFixed(1));
      const roundedTenths = formatNum(roundedValNum, locale, 1);
      const correctStr = `${roundedTenths} kg`;
      const fake1 = `${formatNum(roundedValNum + 0.1, locale, 1)} kg`;
      const fake2 = `${formatNum(Math.max(0.1, roundedValNum - 0.1), locale, 1)} kg`;
      const fake3 = `${Math.round(weightFloat)} kg`;

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${formatNum(roundedValNum + step * 0.2, locale, 1)} kg`
      );

      return {
        title: isEn ? 'ESTIMATION OF CARGO WEIGHT' : 'ΕΚΤΙΜΗΣΗ ΒΑΡΟΥΣ ΦΟΡΤΙΟΥ',
        instruction: isEn ? 'Select weight rounded to tenths (0.1 kg):' : 'Επιλέξτε το στρογγυλοποιημένο βάρος στα πλησιέστερα δέκατα (0,1 kg):',
        text: isEn
          ? `A parcel weighs ${weightStr} kg. What is the parcel weight rounded to the nearest tenth (0.1) of a kilogram?`
          : `Ένα δέμα ζυγίζει ${weightStr} kg. Ποιο είναι το βάρος του δέματος στρογγυλοποιημένο στα πλησιέστερα δέκατα (0,1) του κιλού;`,
        tableData: {
          col1: isEn ? 'Exact Weight' : 'Ακριβές Βάρος',
          col2: isEn ? 'To Tenths (0.1)' : 'Στα Δέκατα (0,1)',
          r1: [`${weightStr} kg`, isEn ? 'Tenths' : 'Δέκατα'],
          r2: [isEn ? 'Key digit (Hundredths)' : 'Ψηφίο-κλειδί (Εκατοστά)', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Inspect the hundredths digit. Rounding to tenths gives ${correctStr}.`
          : `Εξετάζουμε το ψηφίο των εκατοστών. Στρογγυλοποιώντας στα πλησιέστερα δέκατα προκύπτει ${correctStr}.`
      };
    }
  },
  {
    id: 'p_round_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const roadKm = parseFloat(`${randInt(25, 85)}.${randInt(1, 9)}${randInt(1, 9)}`);
      const roadStr = formatNum(roadKm, locale, 2);
      const roundedUnits = Math.round(roadKm);
      const correctStr = `${roundedUnits} km`;
      const fake1 = `${roundedUnits + 1} km`;
      const fake2 = `${roundedUnits - 1} km`;
      const fake3 = `${Math.floor(roadKm / 10) * 10} km`;

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${roundedUnits + step * 2} km`
      );

      return {
        title: isEn ? 'DISTANCE ESTIMATION IN WHOLE KM' : 'ΕΚΤΙΜΗΣΗ ΑΠΟΣΤΑΣΗΣ ΣΕ ΑΚΕΡΑΙΑ ΧΙΛΙΟΜΕΤΡΑ',
        instruction: isEn ? 'Select distance rounded to the nearest whole unit (km):' : 'Επιλέξτε την απόσταση στις πλησιέστερες ακέραιες μονάδες (km):',
        text: isEn
          ? `A cycling route is ${roadStr} km long. What is its distance rounded to the nearest unit?`
          : `Μια διαδρομή ποδηλασίας έχει μήκος ${roadStr} km. Πόσα είναι τα ακέραια χιλιόμετρα της διαδρομής αν στρογγυλοποιηθεί στις πλησιέστερες μονάδες;`,
        tableData: {
          col1: isEn ? 'Route Length' : 'Μήκος Διαδρομής',
          col2: isEn ? 'To Units' : 'Στις Ακέραιες Μονάδες',
          r1: [`${roadStr} km`, isEn ? 'Units' : 'Μονάδες'],
          r2: [isEn ? 'Key digit (Tenths)' : 'Ψηφίο-κλειδί (Δέκατα)', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Inspect the tenths digit. Rounding to whole units gives ${correctStr}.`
          : `Εξετάζουμε το ψηφίο των δεκάτων. Στρογγυλοποιώντας στις ακέραιες μονάδες προκύπτει ${correctStr}.`
      };
    }
  },
  {
    id: 'p_round_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const oilFloat = parseFloat(`${randInt(14, 48)}.${randInt(1, 9)}${randInt(1, 9)}`);
      const oilStr = formatNum(oilFloat, locale, 2);
      const roundedValNum = parseFloat((Math.round(oilFloat * 10) / 10).toFixed(1));
      const roundedTenths = formatNum(roundedValNum, locale, 1);
      const correctStr = `${roundedTenths} L`;
      const fake1 = `${formatNum(roundedValNum + 0.1, locale, 1)} L`;
      const fake2 = `${formatNum(Math.max(0.1, roundedValNum - 0.1), locale, 1)} L`;
      const fake3 = `${Math.round(oilFloat)} L`;

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${formatNum(roundedValNum + step * 0.3, locale, 1)} L`
      );

      return {
        title: isEn ? 'OIL VOLUME ESTIMATION' : 'ΕΚΤΙΜΗΣΗ ΟΓΚΟΥ ΕΛΑΙΟΛΑΔΟΥ',
        instruction: isEn ? 'Select volume rounded to tenths of a liter (0.1 L):' : 'Επιλέξτε τον όγκο στα πλησιέστερα δέκατα του λίτρου (0,1 L):',
        text: isEn
          ? `A container contains ${oilStr} L of olive oil. What is the volume rounded to the nearest tenth of a liter?`
          : `Ένα δοχείο περιέχει ${oilStr} L ελαιόλαδο. Ποιος είναι ο όγκος του ελαιολάδου στρογγυλοποιημένος στα πλησιέστερα δέκατα του λίτρου;`,
        tableData: {
          col1: isEn ? 'Exact Volume' : 'Ακριβής Όγκος',
          col2: isEn ? 'To Tenths' : 'Στα Δέκατα',
          r1: [`${oilStr} L`, isEn ? 'Tenths' : 'Δέκατα'],
          r2: [isEn ? 'Key digit (Hundredths)' : 'Ψηφίο-κλειδί (Εκατοστά)', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Inspect the hundredths digit. Rounding to tenths gives ${correctStr}.`
          : `Εξετάζουμε το ψηφίο των εκατοστών. Στρογγυλοποιώντας στα πλησιέστερα δέκατα προκύπτει ${correctStr}.`
      };
    }
  },
  {
    id: 'p_round_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const priceFloat = parseFloat(`${randInt(25, 95)}.${randInt(1, 9)}${randInt(1, 9)}${randInt(5, 9)}`);
      const priceStr = formatNum(priceFloat, locale, 3);
      const roundedValNum = parseFloat((Math.round(priceFloat * 100) / 100).toFixed(2));
      const roundedHundr = formatNum(roundedValNum, locale, 2);
      const correctStr = `${roundedHundr} €`;
      const fake1 = `${formatNum(roundedValNum + 0.01, locale, 2)} €`;
      const fake2 = `${formatNum(Math.max(0.01, roundedValNum - 0.01), locale, 2)} €`;
      const fake3 = `${formatNum(Math.round(priceFloat * 10) / 10, locale, 1)} €`;

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${formatNum(roundedValNum + step * 0.05, locale, 2)} €`
      );

      return {
        title: isEn ? 'ROUNDING ORDER TOTAL TO CENTS' : 'ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΤΙΜΗΣ ΣΤΑ ΕΚΑΤΟΣΤΑ',
        instruction: isEn ? 'Select amount rounded to hundredths of a euro (0.01 €):' : 'Επιλέξτε την τιμή στα πλησιέστερα εκατοστά του ευρώ (0,01 €):',
        text: isEn
          ? `An online order was calculated at ${priceStr} €. What is the payment total rounded to the nearest hundredth (cents)?`
          : `Η αξία μιας ηλεκτρονικής παραγγελίας υπολογίστηκε ακριβώς στα ${priceStr} €. Ποιο είναι το τελικό ποσό πληρωμής στρογγυλοποιημένο στα πλησιέστερα εκατοστά (λεπτά του ευρώ);`,
        tableData: {
          col1: isEn ? 'Exact Price' : 'Ακριβής Τιμή',
          col2: isEn ? 'To Hundredths (0.01 €)' : 'Στα Εκατοστά (0,01 €)',
          r1: [`${priceStr} €`, isEn ? 'Hundredths' : 'Εκατοστά'],
          r2: [isEn ? 'Key digit (Thousandths)' : 'Ψηφίο-κλειδί (Χιλιοστά)', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Inspect the thousandths digit. Rounding to hundredths gives ${correctStr}.`
          : `Εξετάζουμε το ψηφίο των χιλιοστών. Στρογγυλοποιώντας στα πλησιέστερα εκατοστά προκύπτει ${correctStr}.`
      };
    }
  },
  {
    id: 'p_round_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const areaFloat = parseFloat(`${randInt(120, 480)}.${randInt(1, 9)}${randInt(1, 9)}`);
      const areaStr = formatNum(areaFloat, locale, 2);
      const roundedTens = Math.round(areaFloat / 10) * 10;
      const unit = isEn ? 'sq.m.' : 'τ.μ.';
      const correctStr = `${roundedTens} ${unit}`;
      const fake1 = `${roundedTens + 10} ${unit}`;
      const fake2 = `${Math.max(10, roundedTens - 10)} ${unit}`;
      const fake3 = `${Math.round(areaFloat)} ${unit}`;

      const options = makeUniqueFourOptions(
        correctStr,
        [fake1, fake2, fake3],
        (step) => `${roundedTens + step * 20} ${unit}`
      );

      return {
        title: isEn ? 'LAND AREA ESTIMATION' : 'ΕΚΤΙΜΗΣΗ ΕΜΒΑΔΟΥ ΟΙΚΟΠΕΔΟΥ',
        instruction: isEn ? 'Select area rounded to the nearest ten square meters:' : 'Επιλέξτε το εμβαδόν στην πλησιέστερη δεκάδα τετραγωνικών μέτρων (τ.μ.):',
        text: isEn
          ? `A land plot has an area of ${areaStr} sq.m. What is the area rounded to the nearest ten square meters?`
          : `Ένα οικόπεδο έχει εμβαδόν ${areaStr} τ.μ. Ποιο είναι το εμβαδόν του οικοπέδου αν στρογγυλοποιηθεί στην πλησιέστερη δεκάδα τετραγωνικών μέτρων;`,
        tableData: {
          col1: isEn ? 'Exact Area' : 'Ακριβές Εμβαδόν',
          col2: isEn ? 'Nearest Ten' : 'Πλησιέστερη Δεκάδα',
          r1: [`${areaStr} ${unit}`, isEn ? 'Tens' : 'Δεκάδες'],
          r2: [isEn ? 'Key digit (Units)' : 'Ψηφίο-κλειδί (Μονάδες)', `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Inspect the units digit. Rounding to the nearest ten yields ${correctStr}.`
          : `Εξετάζουμε το ψηφίο των μονάδων. Στρογγυλοποιώντας στην πλησιέστερη δεκάδα προκύπτει ${correctStr}.`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const sep = isEn ? '.' : ',';
  const qList = [];
  const itemsPool = REAL_WORLD_PRESETS[locale] || REAL_WORLD_PRESETS.el;
  const shuffledItems = shuffle(itemsPool);

  // Q1 (Input - Decimal): Στρογγυλοποίηση φυσικού αριθμού στις Δεκάδες ή Εκατοντάδες
  {
    const q1Int = randInt(125, 985);
    const q1TargetHundreds = Math.random() > 0.5;
    const q1PlaceName = q1TargetHundreds
      ? (isEn ? 'nearest hundred' : 'πλησιέστερη εκατοντάδα')
      : (isEn ? 'nearest ten' : 'πλησιέστερη δεκάδα');
    const q1CorrectVal = q1TargetHundreds
      ? Math.round(q1Int / 100) * 100
      : Math.round(q1Int / 10) * 10;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 1 • ROUNDING WHOLE NUMBER' : 'ΕΡΩΤΗΣΗ 1 • ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΦΥΣΙΚΟΥ ΑΡΙΘΜΟΥ',
      instruction: isEn ? 'Round number to requested place (integer):' : 'Στρογγυλοποιήστε τον αριθμό στην επιθυμητή τάξη (ακέραιος):',
      prompt: isEn ? `Round ${q1Int} to the ${q1PlaceName}.` : `Στρογγυλοποιήστε τον αριθμό ${q1Int} στην ${q1PlaceName}.`,
      correctVal: q1CorrectVal,
      correctStr: String(q1CorrectVal),
      explanation: isEn
        ? `In ${q1Int}, check the key digit. Rounding to the ${q1PlaceName} yields ${q1CorrectVal}.`
        : `Στον αριθμό ${q1Int}, εξετάζουμε το ψηφίο-κλειδί. Η στρογγυλοποίηση στην ${q1PlaceName} δίνει ${q1CorrectVal}.`
    });
  }

  // Q2 (Input - Decimal): Στρογγυλοποίηση δεκαδικού αριθμού στα Δέκατα (0,1)
  {
    const q2Int = randInt(12, 85);
    const q2Dec1 = randInt(1, 9);
    const q2Dec2 = randInt(1, 9);
    const q2NumberStr = `${q2Int}${sep}${q2Dec1}${q2Dec2}`;
    const q2Float = parseFloat(`${q2Int}.${q2Dec1}${q2Dec2}`);
    const q2CorrectValNum = parseFloat((Math.round(q2Float * 10) / 10).toFixed(1));
    const q2CorrectVal = formatNum(q2CorrectValNum, locale, 1);

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 2 • ROUNDING TO TENTHS (0.1)' : 'ΕΡΩΤΗΣΗ 2 • ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΣΤΑ ΔΕΚΑΤΑ (0,1)',
      instruction: isEn ? 'Round decimal to the nearest tenths:' : 'Στρογγυλοποιήστε τον δεκαδικό αριθμό στα πλησιέστερα δέκατα με κόμμα:',
      prompt: isEn ? `Round ${q2NumberStr} to the nearest tenths (0.1).` : `Στρογγυλοποιήστε τον αριθμό ${q2NumberStr} στα πλησιέστερα δέκατα (0,1).`,
      correctVal: q2CorrectValNum,
      correctStr: q2CorrectVal,
      explanation: isEn
        ? `In ${q2NumberStr}, the hundredths digit is ${q2Dec2}. ${q2Dec2 >= 5 ? 'Since it is ≥ 5, we round up' : 'Since it is ＜ 5, we round down'} to ${q2CorrectVal}.`
        : `Στο ${q2NumberStr}, το ψηφίο των εκατοστών είναι το ${q2Dec2}. ${q2Dec2 >= 5 ? 'Επειδή είναι ≥ 5, στρογγυλοποιούμε προς τα πάνω' : 'Επειδή είναι ＜ 5, στρογγυλοποιούμε προς τα κάτω'} σε ${q2CorrectVal}.`
    });
  }

  // Q3 (MCQ): Στρογγυλοποίηση δεκαδικού στα Εκατοστά (0,01)
  {
    const q3Int = randInt(3, 45);
    const q3Dec1 = randInt(1, 9);
    const q3Dec2 = randInt(1, 9);
    const q3Dec3 = randInt(1, 9);
    const q3NumberStr = `${q3Int}${sep}${q3Dec1}${q3Dec2}${q3Dec3}`;
    const q3Float = parseFloat(`${q3Int}.${q3Dec1}${q3Dec2}${q3Dec3}`);
    const q3CorrectValNum = parseFloat((Math.round(q3Float * 100) / 100).toFixed(2));
    const q3CorrectVal = formatNum(q3CorrectValNum, locale, 2);
    const w1 = formatNum(q3CorrectValNum + 0.01, locale, 2);
    const w2 = formatNum(Math.max(0.01, q3CorrectValNum - 0.01), locale, 2);
    const w3 = formatNum(q3CorrectValNum + 0.1, locale, 2);

    const options = makeUniqueFourOptions(
      q3CorrectVal,
      [w1, w2, w3],
      (step) => formatNum(q3CorrectValNum + step * 0.03, locale, 2)
    );

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • ROUNDING TO HUNDREDTHS (0.01)' : 'ΕΡΩΤΗΣΗ 3 • ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΣΤΑ ΕΚΑΤΟΣΤΑ (0,01)',
      instruction: isEn ? 'Select the correct rounded value:' : 'Επιλέξτε τη σωστή στρογγυλοποιημένη τιμή:',
      prompt: isEn ? `Round ${q3NumberStr} to the nearest hundredths (0.01).` : `Στρογγυλοποιήστε τον αριθμό ${q3NumberStr} στα πλησιέστερα εκατοστά (0,01).`,
      options,
      correctText: q3CorrectVal,
      explanation: isEn
        ? `The thousandths digit is ${q3Dec3}. Therefore, ${q3NumberStr} rounds to ${q3CorrectVal}.`
        : `Το ψηφίο των χιλιοστών είναι το ${q3Dec3}. Επομένως, το ${q3NumberStr} στρογγυλοποιείται στο ${q3CorrectVal}.`
    });
  }

  // Q4 (MCQ): Εντοπισμός του «ψηφίου-κλειδιού»
  {
    const q4Int = randInt(120, 850);
    const q4Dec = randInt(125, 875);
    const q4NumberStr = `${q4Int}${sep}${q4Dec}`;
    const q4TargetOptions = isEn
      ? [
          { place: 'to tens', keyName: 'units', digit: String(q4Int % 10) },
          { place: 'to hundreds', keyName: 'tens', digit: String(Math.floor((q4Int % 100) / 10)) },
          { place: 'to units', keyName: 'tenths', digit: String(Math.floor(q4Dec / 100)) },
          { place: 'to tenths (0.1)', keyName: 'hundredths', digit: String(Math.floor((q4Dec % 100) / 10)) }
        ]
      : [
          { place: 'στις δεκάδες', keyName: 'των μονάδων', digit: String(q4Int % 10) },
          { place: 'στις εκατοντάδες', keyName: 'των δεκάδων', digit: String(Math.floor((q4Int % 100) / 10)) },
          { place: 'στις ακέραιες μονάδες', keyName: 'των δεκάτων', digit: String(Math.floor(q4Dec / 100)) },
          { place: 'στα δέκατα (0,1)', keyName: 'των εκατοστών', digit: String(Math.floor((q4Dec % 100) / 10)) }
        ];
    const q4Selected = q4TargetOptions[randInt(0, 3)];
    const q4Correct = q4Selected.digit;

    const w1 = String((parseInt(q4Correct, 10) + 1) % 10);
    const w2 = String((parseInt(q4Correct, 10) + 2) % 10);
    const w3 = String((parseInt(q4Correct, 10) + 7) % 10);

    const options = makeUniqueFourOptions(
      q4Correct,
      [w1, w2, w3],
      (step) => String((parseInt(q4Correct, 10) + step + 3) % 10)
    );

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • IDENTIFYING KEY DIGIT' : 'ΕΡΩΤΗΣΗ 4 • ΕΝΤΟΠΙΣΜΟΣ ΨΗΦΙΟΥ-ΚΛΕΙΔΙΟΥ',
      instruction: isEn ? 'Select the key digit that decides rounding:' : 'Επιλέξτε το ψηφίο που καθορίζει τη στρογγυλοποίηση:',
      prompt: isEn
        ? `To round ${q4NumberStr} ${q4Selected.place}, which key digit do we inspect?`
        : `Για να στρογγυλοποιήσουμε τον αριθμό ${q4NumberStr} ${q4Selected.place}, ποιο ψηφίο εξετάζουμε;`,
      options,
      correctText: q4Correct,
      explanation: isEn
        ? `We inspect the immediate next digit to the right (${q4Selected.keyName} place), which is ${q4Correct}.`
        : `Εξετάζουμε το αμέσως επόμενο ψηφίο στα δεξιά (τη θέση ${q4Selected.keyName}), δηλαδή το ψηφίο ${q4Correct}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας για τα ψηφία 5, 6, 7, 8, 9
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? 'When the digit immediately following the rounding place is 5, 6, 7, 8, or 9, the rounding digit increases by 1 (rounding up).'
          : 'When the digit immediately following the rounding place is 5, 6, 7, 8, or 9, the rounding digit remains unchanged.')
      : (q5IsTrue
          ? 'Όταν το αμέσως επόμενο ψηφίο από τη θέση στρογγυλοποίησης είναι 5, 6, 7, 8 ή 9, το ψηφίο της θέσης αυξάνεται κατά 1 (στρογγυλοποίηση προς τα πάνω).'
          : 'Όταν το αμέσως επόμενο ψηφίο από τη θέση στρογγυλοποίησης είναι 5, 6, 7, 8 ή 9, το ψηφίο της θέσης παραμένει ακριβώς το ίδιο.');

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
      title: isEn ? 'QUESTION 5 • RULE FOR DIGITS 5-9' : 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΨΗΦΙΩΝ 5-9',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? 'Correct! When the next digit is 5, 6, 7, 8, or 9, we increase the rounding digit by 1.'
            : 'False! When the next digit is 5, 6, 7, 8, or 9, the digit increases by 1 (rounding up).')
        : (q5IsTrue
            ? 'Σωστό! Όταν το επόμενο ψηφίο είναι 5, 6, 7, 8 ή 9, αυξάνουμε το ψηφίο της επιθυμητής τάξης κατά 1.'
            : 'Λάθος! Όταν το επόμενο ψηφίο είναι 5, 6, 7, 8 ή 9, το ψηφίο αυξάνεται κατά 1 (στρογγυλοποίηση προς τα πάνω).')
    });
  }

  // Q6 (MCQ): True / False - Μηδενισμός των δεξιών ψηφίων
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? 'When rounding a number, all digits to the right of the rounding place become zero or are dropped.'
          : 'When rounding a number, all digits to the right of the rounding place remain unchanged.')
      : (q6IsTrue
          ? 'Όταν στρογγυλοποιούμε έναν αριθμό, όλα τα ψηφία που βρίσκονται δεξιά από τη θέση στρογγυλοποίησης μηδενίζονται ή παραλείπονται.'
          : 'Όταν στρογγυλοποιούμε έναν αριθμό, τα ψηφία που βρίσκονται δεξιά από τη θέση στρογγυλοποίησης παραμένουν αναλλοίωτα.');

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
      title: isEn ? 'QUESTION 6 • TRAILING DIGITS ZEROING' : 'ΕΡΩΤΗΣΗ 6 • ΜΗΔΕΝΙΣΜΟΣ ΔΕΞΙΩΝ ΨΗΦΙΩΝ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? 'Correct! Following rounding, all digits to the right become zero (in whole numbers) or are omitted (in decimals).'
            : 'False! All digits to the right of the rounding place become zero or are dropped.')
        : (q6IsTrue
            ? 'Σωστό! Μετά τη στρογγυλοποίηση, όλα τα ψηφία στα δεξιά μηδενίζονται (στους φυσικούς) ή παραλείπονται (στα δεκαδικά).'
            : 'Λάθος! Όλα τα ψηφία στα δεξιά της θέσης στρογγυλοποίησης γίνονται μηδενικά ή παραλείπονται.')
    });
  }

  // Q7 (Input - Decimal): Αριθμογραμμή Στρογγυλοποίησης
  {
    const q7Base = randInt(10, 80) * 10;
    const q7Offset = randInt(1, 9);
    const q7Val = q7Base + q7Offset;
    const q7Correct = Math.round(q7Val / 10) * 10;

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 7 • NUMBER LINE ROUNDING' : 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ',
      instruction: isEn ? 'Enter the nearest ten (integer):' : 'Συμπληρώστε την πλησιέστερη δεκάδα (ακέραιος):',
      prompt: isEn ? `To which nearest ten does ${q7Val} round?` : `Σε ποια πλησιέστερη δεκάδα στρογγυλοποιείται ο αριθμός ${q7Val};`,
      val: q7Val,
      base: q7Base,
      nextBase: q7Base + 10,
      correctVal: q7Correct,
      correctStr: String(q7Correct),
      explanation: isEn
        ? `The number ${q7Val} is closer to ${q7Correct} on the number line.`
        : `Ο αριθμός ${q7Val} βρίσκεται πιο κοντά στο ${q7Correct} πάνω στην αριθμογραμμή.`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας / Εκτίμηση Κόστους
  {
    const q8Item = shuffledItems[0];
    const q8PriceFloat = parseFloat(`${randInt(15, 85)}.${randInt(1, 9)}${randInt(1, 9)}`);
    const q8PriceStr = formatNum(q8PriceFloat, locale, 2);
    const q8RoundedUnits = Math.round(q8PriceFloat);
    const q8Correct = `${q8RoundedUnits} ${q8Item.unit}`;

    const w1 = `${q8RoundedUnits + 1} ${q8Item.unit}`;
    const w2 = `${Math.max(1, q8RoundedUnits - 1)} ${q8Item.unit}`;
    const w3 = `${Math.floor(q8PriceFloat / 10) * 10} ${q8Item.unit}`;

    const options = makeUniqueFourOptions(
      q8Correct,
      [w1, w2, w3],
      (step) => `${q8RoundedUnits + step * 2} ${q8Item.unit}`
    );

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • EVERYDAY ESTIMATION' : 'ΕΡΩΤΗΣΗ 8 • ΕΚΤΙΜΗΣΗ ΣΤΗΝ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑ',
      instruction: isEn ? 'Select value rounded to nearest units:' : 'Επιλέξτε τη στρογγυλοποιημένη τιμή στις ακέραιες μονάδες:',
      prompt: isEn
        ? `If we measured ${q8Item.item} as ${q8PriceStr} ${q8Item.unit}, what is the value rounded to the nearest unit?`
        : `Αν μετρήσαμε ${q8Item.item} ίσο με ${q8PriceStr} ${q8Item.unit}, ποια είναι η στρογγυλοποιημένη τιμή στις πλησιέστερες ακέραιες μονάδες;`,
      options,
      correctText: q8Correct,
      explanation: isEn
        ? `Examining the tenths digit of ${q8PriceStr}, we round to the nearest whole unit: ${q8Correct}.`
        : `Κοιτάζοντας τα δέκατα του αριθμού ${q8PriceStr}, στρογγυλοποιούμε στις πλησιέστερες ακέραιες μονάδες σε ${q8Correct}.`
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
    pageTitle: "Ασκήσεις: Στρογγυλοποίηση Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές ασκήσεις και προβλήματα στη στρογγυλοποίηση φυσικών και δεκαδικών αριθμών για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 12 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Στρογγυλοποίηση Αριθμών",
    heroDesc: "10 δυναμικές δραστηριότητες στρογγυλοποίησης σε δεκάδες, εκατοντάδες, δέκατα και εκατοστά, αναγνώριση ψηφίου-κλειδιού και ρεαλιστικά προβλήματα καθημερινής ζωής.",
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
    answeredLabel: "ΑΠΑΝΤΗΘΗΚΑΝ",
    pctLabel: "ΠΟΣΟΣΤΟ",
    btnCheckBar: "ΕΛΕΓΧΟΣ"
  },
  en: {
    pageTitle: "Exercises: Rounding Numbers - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems on rounding whole numbers and decimals for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "CHAPTER 12 • GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Rounding Numbers",
    heroDesc: "10 dynamic activities on rounding to tens, hundreds, tenths, and hundredths, identifying key digits, and applied everyday word problems.",
    heroDynamicNote: "⚡ Each exercise set is dynamically generated with random parameters.",
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
    answeredLabel: "ANSWERED",
    pctLabel: "PERCENTAGE",
    btnCheckBar: "CHECK"
  }
};

export default function StroggilopoiisiExercisesPage() {
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
      sanitized = parts[0] + sepChar + parts.slice(1).join('').replace(/[,.]/g, '');
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

  const isQuestionCorrect = (q) => {
    if (q.type === 'mcq') {
      return answers[`q_${q.id}`] === q.correctText;
    }
    if (q.type === 'decimal_input') {
      const userValRaw = (answers[`q_${q.id}`] || '').trim();
      if (!userValRaw) return false;
      const cleanUser = userValRaw.replace(',', '.');
      const cleanTarget = String(q.correctStr).replace(',', '.');
      if (cleanUser === cleanTarget) return true;
      const userVal = parseFloat(cleanUser);
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
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/12-stroggilopoiisi"
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

                  {/* Οπτικό SVG Αριθμογραμμής για την Q7 */}
                  {q.val !== undefined && q.base !== undefined && (
                    <div className="bg-slate-100 rounded-2xl p-4 my-3 flex justify-center overflow-x-auto w-full">
                      <svg viewBox="0 0 300 70" className="w-full max-w-xs h-auto min-w-0 shrink-0 select-none">
                        <line x1="30" y1="40" x2="270" y2="40" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                        
                        <line x1="40" y1="30" x2="40" y2="50" stroke="#334155" strokeWidth="2.5" />
                        <text x="40" y="62" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#334155">
                          {q.base}
                        </text>

                        <line x1="260" y1="30" x2="260" y2="50" stroke="#334155" strokeWidth="2.5" />
                        <text x="260" y="62" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#334155">
                          {q.nextBase}
                        </text>

                        <line x1="150" y1="35" x2="150" y2="45" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
                        <text x="150" y="25" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#94a3b8">
                          {q.base + 5}
                        </text>

                        <circle cx={40 + ((q.val - q.base) / 10) * 220} cy="40" r="5" fill="#2563eb" />
                        <text x={40 + ((q.val - q.base) / 10) * 220} y="18" fontSize="11" fontWeight="black" textAnchor="middle" fill="#2563eb">
                          {q.val}
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
                        autoComplete="off"
                        spellCheck="false"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder={t.inputPlaceholder}
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
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

                    <div className="break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                    
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800 break-words [overflow-wrap:anywhere]">
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
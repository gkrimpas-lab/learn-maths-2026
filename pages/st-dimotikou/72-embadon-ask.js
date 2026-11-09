// pages/st-dimotikou/72-embadon-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// -------------------------------------------------------------
// DEFENSIVE UTILITY FUNCTIONS
// -------------------------------------------------------------

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
    [arr[j], arr[i]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatNum(val, locale = 'el') {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
}

// Component για κανονική κατακόρυφη μορφή κλάσματος (Mobile Responsive & Overflow-Safe)
function MathFraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      <span className="border-b border-current px-1 pb-0.5 font-bold break-all">{num}</span>
      <span className="pt-0.5 px-1 font-bold break-all">{den}</span>
    </span>
  );
}

// Διασφάλιση ακριβώς 4 μοναδικών επιλογών για ερωτήσεις MCQ
function ensureFourUniqueOptions(correctText, distractorsGen) {
  const optionsSet = new Set([String(correctText).trim()]);
  const candidates = distractorsGen();

  for (const c of candidates) {
    if (optionsSet.size >= 4) break;
    if (c !== undefined && c !== null && String(c).trim() !== '') {
      optionsSet.add(String(c).trim());
    }
  }

  let counter = 1;
  while (optionsSet.size < 4) {
    optionsSet.add(`${correctText} (${counter})`);
    counter++;
  }

  return shuffle([...optionsSet]);
}

// -------------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (POOLS) ΓΙΑ Q9, Q10, Q11, Q12 ME I18N
// -------------------------------------------------------------

// POOL ΓΙΑ Q9: Μετατροπές από m² σε cm² και Πλακόστρωση
const PROBLEM_POOL_Q9 = [
  // 1. Πλακάκια δαπέδου κουζίνας
  (locale) => {
    const isEn = locale === 'en';
    const areaM2 = randInt(12, 24);
    const tileCm2 = 500;
    const totalCm2 = areaM2 * 10000;
    const tilesCount = totalCm2 / tileCm2;
    const correct = `${formatNum(tilesCount, locale)} ${isEn ? 'tiles' : 'πλακάκια'}`;
    return {
      title: isEn ? 'FLOOR TILES' : 'ΠΛΑΚΑΚΙΑ ΔΑΠΕΔΟΥ',
      prompt: isEn
        ? `A room floor has an area of ${formatNum(areaM2, locale)} m². We wish to cover it with tiles having an area of ${formatNum(tileCm2, locale)} cm² each. How many tiles will be needed?`
        : `Το δάπεδο ενός δωματίου έχει εμβαδόν ${formatNum(areaM2, locale)} m². Θέλουμε να το καλύψουμε με πλακάκια που έχουν εμβαδόν ${formatNum(tileCm2, locale)} cm² το καθένα. Πόσα πλακάκια θα χρειαστούν;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(tilesCount + 50, locale)} ${isEn ? 'tiles' : 'πλακάκια'}`,
        `${formatNum(tilesCount - 50 > 0 ? tilesCount - 50 : tilesCount + 100, locale)} ${isEn ? 'tiles' : 'πλακάκια'}`,
        `${formatNum(areaM2 * 10, locale)} ${isEn ? 'tiles' : 'πλακάκια'}`,
        `${formatNum(tilesCount * 2, locale)} ${isEn ? 'tiles' : 'πλακάκια'}`
      ]),
      correctAnswer: correct,
      unit: isEn ? 'tiles' : 'πλακάκια',
      tableData: [
        { label: isEn ? 'Floor area' : 'Εμβαδόν δαπέδου', value: `${formatNum(areaM2, locale)} m²` },
        { label: isEn ? 'Convert to cm² (· 10,000)' : 'Μετατροπή σε cm² (· 10.000)', value: `${formatNum(totalCm2, locale)} cm²` },
        { label: isEn ? 'Tile area' : 'Εμβαδόν πλακιδίου', value: `${formatNum(tileCm2, locale)} cm²` },
        { label: isEn ? 'Division operation' : 'Πράξη διαίρεσης', value: `${formatNum(totalCm2, locale)} : ${formatNum(tileCm2, locale)} ＝ ${formatNum(tilesCount, locale)} ${isEn ? 'tiles' : 'πλακάκια'}` }
      ],
      fractionData: { n: `${formatNum(totalCm2, locale)} cm²`, d: `${formatNum(tileCm2, locale)} cm²`, res: `${formatNum(tilesCount, locale)} ${isEn ? 'tiles' : 'πλακάκια'}` },
      explanation: isEn
        ? `First convert m² to cm² by multiplying by 10,000: ${formatNum(areaM2, locale)} · 10,000 ＝ ${formatNum(totalCm2, locale)} cm². Then divide by tile area: ${formatNum(totalCm2, locale)} : ${formatNum(tileCm2, locale)} ＝ ${formatNum(tilesCount, locale)} tiles.`
        : `Μετατρέπουμε πρώτα τα m² σε cm² πολλαπλασιάζοντας με το 10.000: ${formatNum(areaM2, locale)} · 10.000 ＝ ${formatNum(totalCm2, locale)} cm². Έπειτα διαιρούμε με το εμβαδόν του πλακιδίου: ${formatNum(totalCm2, locale)} : ${formatNum(tileCm2, locale)} ＝ ${formatNum(tilesCount, locale)} πλακάκια.`
    };
  },
  // 2. Πλακάκια μπάνιου
  (locale) => {
    const isEn = locale === 'en';
    const areaM2 = randInt(6, 15);
    const tileCm2 = 400;
    const totalCm2 = areaM2 * 10000;
    const tilesCount = totalCm2 / tileCm2;
    const correct = `${formatNum(tilesCount, locale)} ${isEn ? 'tiles' : 'πλακάκια'}`;
    return {
      title: isEn ? 'BATHROOM TILES' : 'ΠΛΑΚΑΚΙΑ ΜΠΑΝΙΟΥ',
      prompt: isEn
        ? `The floor of a bathroom has a surface area of ${formatNum(areaM2, locale)} m². How many square tiles of ${formatNum(tileCm2, locale)} cm² each are required to pave it completely?`
        : `Το πάτωμα ενός μπάνιου έχει επιφάνεια ${formatNum(areaM2, locale)} m². Πόσα τετράγωνα πλακάκια των ${formatNum(tileCm2, locale)} cm² χρειάζονται για να στρωθεί ολόκληρο;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(tilesCount + 25, locale)} ${isEn ? 'tiles' : 'πλακάκια'}`,
        `${formatNum(tilesCount - 25 > 0 ? tilesCount - 25 : tilesCount + 60, locale)} ${isEn ? 'tiles' : 'πλακάκια'}`,
        `${formatNum(areaM2 * 100, locale)} ${isEn ? 'tiles' : 'πλακάκια'}`,
        `${formatNum(tilesCount / 2, locale)} ${isEn ? 'tiles' : 'πλακάκια'}`
      ]),
      correctAnswer: correct,
      unit: isEn ? 'tiles' : 'πλακάκια',
      tableData: [
        { label: isEn ? 'Bathroom area in cm²' : 'Εμβαδόν μπάνιου σε cm²', value: `${formatNum(areaM2, locale)} · 10.000 ＝ ${formatNum(totalCm2, locale)} cm²` },
        { label: isEn ? 'Operation' : 'Πράξη', value: `${formatNum(totalCm2, locale)} : ${formatNum(tileCm2, locale)}` },
        { label: isEn ? 'Result' : 'Αποτέλεσμα', value: `${formatNum(tilesCount, locale)} ${isEn ? 'tiles' : 'πλακάκια'}` }
      ],
      fractionData: { n: `${formatNum(totalCm2, locale)} cm²`, d: `${formatNum(tileCm2, locale)} cm²`, res: `${formatNum(tilesCount, locale)} ${isEn ? 'tiles' : 'πλακάκια'}` },
      explanation: `${formatNum(areaM2, locale)} m² ＝ ${formatNum(totalCm2, locale)} cm². ${formatNum(totalCm2, locale)} : ${formatNum(tileCm2, locale)} ＝ ${formatNum(tilesCount, locale)} ${isEn ? 'tiles' : 'πλακάκια'}.`
    };
  },
  // 3. Ψηφίδες πισίνας
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '200 tesserae' : '200 ψηφίδες';
    return {
      title: isEn ? 'POOL MOSAIC TESSERAE' : 'ΨΗΦΙΔΕΣ ΠΙΣΙΝΑΣ',
      prompt: isEn
        ? 'To repair a pool section with an area of 2 m², mosaic tesserae of 100 cm² each are used. How many tesserae are needed?'
        : 'Για να επισκευαστεί ένα τμήμα πισίνας εμβαδού 2 m², χρησιμοποιούνται διακοσμητικές ψηφίδες των 100 cm² η καθεμία. Πόσες τέτοιες ψηφίδες απαιτούνται;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '20 tesserae' : '20 ψηφίδες',
        isEn ? '2,000 tesserae' : '2.000 ψηφίδες',
        isEn ? '100 tesserae' : '100 ψηφίδες',
        isEn ? '400 tesserae' : '400 ψηφίδες'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'tesserae' : 'ψηφίδες',
      tableData: [
        { label: isEn ? 'Area in cm²' : 'Εμβαδόν σε cm²', value: isEn ? '2 · 10,000 ＝ 20,000 cm²' : '2 · 10.000 ＝ 20.000 cm²' },
        { label: isEn ? 'Tessera area' : 'Εμβαδόν ψηφίδας', value: '100 cm²' },
        { label: isEn ? 'Operation' : 'Πράξη', value: isEn ? '20,000 : 100 ＝ 200' : '20.000 : 100 ＝ 200' }
      ],
      fractionData: { n: isEn ? '20,000 cm²' : '20.000 cm²', d: '100 cm²', res: isEn ? '200 tesserae' : '200 ψηφίδες' },
      explanation: isEn
        ? '2 m² ＝ 20,000 cm². Dividing by 100 cm²: 20,000 : 100 ＝ 200 tesserae.'
        : '2 m² ＝ 20.000 cm². Διαιρούμε με το 100 cm²: 20.000 : 100 ＝ 200 ψηφίδες.'
    };
  },
  // 4. Μάρμαρα σαλονιού
  (locale) => {
    const isEn = locale === 'en';
    const areaM2 = randInt(30, 60);
    const tileCm2 = 2500;
    const totalCm2 = areaM2 * 10000;
    const tilesCount = totalCm2 / tileCm2;
    const correct = `${formatNum(tilesCount, locale)} ${isEn ? 'slabs' : 'πλάκες'}`;
    return {
      title: isEn ? 'MARBLE SLABS' : 'ΜΑΡΜΑΡΙΝΕΣ ΠΛΑΚΕΣ',
      prompt: isEn
        ? `In a living room of ${formatNum(areaM2, locale)} m², marble slabs of ${formatNum(tileCm2, locale)} cm² each are installed. How many slabs will be laid?`
        : `Σε ένα σαλόνι εμβαδού ${formatNum(areaM2, locale)} m² τοποθετούνται μαρμάρινες πλάκες εμβαδού ${formatNum(tileCm2, locale)} cm² η καθεμία. Πόσες πλάκες θα τοποθετηθούν;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(tilesCount + 20, locale)} ${isEn ? 'slabs' : 'πλάκες'}`,
        `${formatNum(tilesCount - 20 > 0 ? tilesCount - 20 : tilesCount + 40, locale)} ${isEn ? 'slabs' : 'πλάκες'}`,
        `${formatNum(tilesCount * 2, locale)} ${isEn ? 'slabs' : 'πλάκες'}`,
        `${formatNum(areaM2, locale)} ${isEn ? 'slabs' : 'πλάκες'}`
      ]),
      correctAnswer: correct,
      unit: isEn ? 'slabs' : 'πλάκες',
      tableData: [
        { label: isEn ? 'Living room area in cm²' : 'Εμβαδόν σαλονιού σε cm²', value: `${formatNum(areaM2, locale)} · 10.000 ＝ ${formatNum(totalCm2, locale)} cm²` },
        { label: isEn ? 'Operation' : 'Πράξη', value: `${formatNum(totalCm2, locale)} : ${formatNum(tileCm2, locale)}` },
        { label: isEn ? 'Total slabs' : 'Πλήθος πλακών', value: `${formatNum(tilesCount, locale)} ${isEn ? 'slabs' : 'πλάκες'}` }
      ],
      fractionData: { n: `${formatNum(totalCm2, locale)} cm²`, d: `${formatNum(tileCm2, locale)} cm²`, res: `${formatNum(tilesCount, locale)} ${isEn ? 'slabs' : 'πλάκες'}` },
      explanation: `${formatNum(areaM2, locale)} m² ＝ ${formatNum(totalCm2, locale)} cm². ${formatNum(totalCm2, locale)} : ${formatNum(tileCm2, locale)} ＝ ${formatNum(tilesCount, locale)} ${isEn ? 'slabs' : 'πλάκες'}.`
    };
  },
  // 5. Πλακάκια βεράντας
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '200 tiles' : '200 πλακάκια';
    return {
      title: isEn ? 'BALCONY PAVING' : 'ΠΛΑΚΟΣΤΡΩΣΗ ΒΕΡΑΝΤΑΣ',
      prompt: isEn
        ? 'A balcony has an area of 18 m². If it is paved with tiles of 900 cm² each, how many tiles will be used?'
        : 'Μια βεράντα έχει εμβαδόν 18 m². Αν στρωθεί με πλακάκια των 900 cm², πόσα πλακάκια θα χρησιμοποιηθούν;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '180 tiles' : '180 πλακάκια',
        isEn ? '250 tiles' : '250 πλακάκια',
        isEn ? '20 tiles' : '20 πλακάκια',
        isEn ? '300 tiles' : '300 πλακάκια'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'tiles' : 'πλακάκια',
      tableData: [
        { label: isEn ? 'Balcony area' : 'Εμβαδόν βεράντας', value: isEn ? '18 m² ＝ 180,000 cm²' : '18 m² ＝ 180.000 cm²' },
        { label: isEn ? 'Operation' : 'Πράξη', value: isEn ? '180,000 : 900 ＝ 200 tiles' : '180.000 : 900 ＝ 200 πλακάκια' }
      ],
      fractionData: { n: isEn ? '180,000 cm²' : '180.000 cm²', d: '900 cm²', res: isEn ? '200 tiles' : '200 πλακάκια' },
      explanation: isEn ? '18 m² ＝ 180,000 cm². 180,000 : 900 ＝ 200 tiles.' : '18 m² ＝ 180.000 cm². 180.000 : 900 ＝ 200 πλακάκια.'
    };
  },
  // 6. Πέτρινες πλάκες αυλής
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '400 flagstones' : '400 πλάκες';
    return {
      title: isEn ? 'COURTYARD FLAGSTONES' : 'ΠΕΤΡΙΝΕΣ ΠΛΑΚΕΣ ΑΥΛΗΣ',
      prompt: isEn
        ? 'A courtyard has an area of 40 m². It will be paved with stone slabs of 1,000 cm² each. How many slabs are needed?'
        : 'Μια αυλή έχει εμβαδόν 40 m². Θα στρωθεί με πέτρινες πλάκες των 1.000 cm² η καθεμία. Πόσες πλάκες χρειάζονται;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '40 flagstones' : '40 πλάκες',
        isEn ? '4,000 flagstones' : '4.000 πλάκες',
        isEn ? '200 flagstones' : '200 πλάκες',
        isEn ? '500 flagstones' : '500 πλάκες'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'flagstones' : 'πλάκες',
      tableData: [
        { label: isEn ? 'Courtyard area' : 'Εμβαδόν αυλής', value: isEn ? '40 m² ＝ 400,000 cm²' : '40 m² ＝ 400.000 cm²' },
        { label: isEn ? 'Operation' : 'Πράξη', value: isEn ? '400,000 : 1,000 ＝ 400 flagstones' : '400.000 : 1.000 ＝ 400 πλάκες' }
      ],
      fractionData: { n: isEn ? '400,000 cm²' : '400.000 cm²', d: isEn ? '1,000 cm²' : '1.000 cm²', res: isEn ? '400 flagstones' : '400 πλάκες' },
      explanation: isEn ? '40 m² ＝ 400,000 cm². 400,000 : 1,000 ＝ 400 flagstones.' : '40 m² ＝ 400.000 cm². 400.000 : 1.000 ＝ 400 πλάκες.'
    };
  }
];

// POOL ΓΙΑ Q10: Υπολογισμοί με Στρέμματα & m² (Αγροτεμάχια)
const PROBLEM_POOL_Q10 = [
  // 1. Αξία ελαιώνα
  (locale) => {
    const isEn = locale === 'en';
    const stremmata = randInt(5, 18);
    const pricePerStremma = randInt(3, 7) * 1000;
    const totalAreaM2 = stremmata * 1000;
    const totalPrice = stremmata * pricePerStremma;
    const correct = `${formatNum(totalPrice, locale)} €`;
    return {
      title: isEn ? 'LAND PARCEL VALUE' : 'ΑΞΙΑ ΑΓΡΟΤΕΜΑΧΙΟΥ',
      prompt: isEn
        ? `A farm spans an area of ${formatNum(totalAreaM2, locale)} m². It is sold at ${formatNum(pricePerStremma, locale)} € per stremma. How much money will the owner receive?`
        : `Ένα αγρόκτημα έχει εμβαδόν ${formatNum(totalAreaM2, locale)} m². Πωλείται προς ${formatNum(pricePerStremma, locale)} € το στρέμμα. Πόσα χρήματα θα εισπράξει ο ιδιοκτήτης;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(totalPrice + 5000, locale)} €`,
        `${formatNum(totalPrice - 5000 > 0 ? totalPrice - 5000 : totalPrice + 10000, locale)} €`,
        `${formatNum(stremmata * 1000, locale)} €`,
        `${formatNum(totalPrice * 2, locale)} €`
      ]),
      correctAnswer: correct,
      unit: '€',
      tableData: [
        { label: isEn ? 'Area in m²' : 'Εμβαδόν σε m²', value: `${formatNum(totalAreaM2, locale)} m²` },
        { label: isEn ? 'Stremmata (: 1,000)' : 'Στρέμματα (: 1.000)', value: `${formatNum(stremmata, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}` },
        { label: isEn ? 'Price per stremma' : 'Τιμή ανά στρέμμα', value: `${formatNum(pricePerStremma, locale)} €` },
        { label: isEn ? 'Total value' : 'Συνολική αξία', value: `${formatNum(stremmata, locale)} · ${formatNum(pricePerStremma, locale)} € ＝ ${formatNum(totalPrice, locale)} €` }
      ],
      fractionData: { n: `${formatNum(totalAreaM2, locale)} m²`, d: isEn ? '1,000 m²' : '1.000 m²', res: `${formatNum(stremmata, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}` },
      explanation: isEn
        ? `Convert m² to stremmata by dividing by 1,000: ${formatNum(totalAreaM2, locale)} : 1,000 ＝ ${formatNum(stremmata, locale)} stremmata. Then multiply by price: ${formatNum(stremmata, locale)} · ${formatNum(pricePerStremma, locale)} € ＝ ${formatNum(totalPrice, locale)} €.`
        : `Μετατρέπουμε τα m² σε στρέμματα διαιρώντας με το 1.000: ${formatNum(totalAreaM2, locale)} : 1.000 ＝ ${formatNum(stremmata, locale)} στρέμματα. Πολλαπλασιάζουμε με την τιμή: ${formatNum(stremmata, locale)} · ${formatNum(pricePerStremma, locale)} € ＝ ${formatNum(totalPrice, locale)} €.`
    };
  },
  // 2. Χωρισμός οικοπέδου σε ίσα οικόπεδα
  (locale) => {
    const isEn = locale === 'en';
    const stremmata = 6;
    const plotM2 = 500;
    const plotsCount = (stremmata * 1000) / plotM2;
    const correct = `${formatNum(plotsCount, locale)} ${isEn ? 'plots' : 'οικόπεδα'}`;
    return {
      title: isEn ? 'LAND SUBDIVISION' : 'ΚΑΤΑΤΜΗΣΗ ΟΙΚΟΠΕΔΟΥ',
      prompt: isEn
        ? 'A land parcel has an area of 6 stremmata. It is divided into smaller plots of 500 m² each. How many plots are created?'
        : 'Ένα οικόπεδο έχει έκταση 6 στρέμματα. Χωρίζεται σε μικρότερα οικόπεδα των 500 m² το καθένα. Πόσα οικόπεδα προκύπτουν;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '10 plots' : '10 οικόπεδα',
        isEn ? '8 plots' : '8 οικόπεδα',
        isEn ? '15 plots' : '15 οικόπεδα',
        isEn ? '20 plots' : '20 οικόπεδα'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'plots' : 'οικόπεδα',
      tableData: [
        { label: isEn ? 'Area in m²' : 'Έκταση σε m²', value: isEn ? '6 · 1,000 ＝ 6,000 m²' : '6 · 1.000 ＝ 6.000 m²' },
        { label: isEn ? 'Plot size' : 'Μέγεθος οικοπέδου', value: '500 m²' },
        { label: isEn ? 'Operation' : 'Πράξη', value: isEn ? '6,000 : 500 ＝ 12 plots' : '6.000 : 500 ＝ 12 οικόπεδα' }
      ],
      fractionData: { n: isEn ? '6,000 m²' : '6.000 m²', d: '500 m²', res: isEn ? '12 plots' : '12 οικόπεδα' },
      explanation: isEn ? '6 stremmata ＝ 6,000 m². 6,000 : 500 ＝ 12 plots.' : '6 στρέμματα ＝ 6.000 m². 6.000 : 500 ＝ 12 οικόπεδα.'
    };
  },
  // 3. Παραγωγή σιταριού ανά στρέμμα
  (locale) => {
    const isEn = locale === 'en';
    const stremmata = randInt(10, 30);
    const kgPerStremma = 350;
    const totalKg = stremmata * kgPerStremma;
    const correct = `${formatNum(totalKg, locale)} kg`;
    return {
      title: isEn ? 'AGRICULTURAL YIELD' : 'ΑΓΡΟΤΙΚΗ ΠΑΡΑΓΩΓΗ',
      prompt: isEn
        ? `A field of ${formatNum(stremmata, locale)} stremmata yields an average of ${formatNum(kgPerStremma, locale)} kg of wheat per stremma. How many kilograms (kg) of wheat will be harvested in total?`
        : `Ένα χωράφι ${formatNum(stremmata, locale)} στρεμμάτων παράγει κατά μέσο όρο ${formatNum(kgPerStremma, locale)} kg σιτάρι ανά στρέμμα. Πόσα κιλά (kg) σιτάρι θα παραχθούν συνολικά;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(totalKg + 500, locale)} kg`,
        `${formatNum(totalKg - 500 > 0 ? totalKg - 500 : totalKg + 1000, locale)} kg`,
        `${formatNum(stremmata * 100, locale)} kg`,
        `${formatNum(totalKg * 2, locale)} kg`
      ]),
      correctAnswer: correct,
      unit: 'kg',
      tableData: [
        { label: isEn ? 'Area' : 'Έκταση', value: `${formatNum(stremmata, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}` },
        { label: isEn ? 'Yield per stremma' : 'Απόδοση ανά στρέμμα', value: `${formatNum(kgPerStremma, locale)} kg` },
        { label: isEn ? 'Operation' : 'Πράξη', value: `${formatNum(stremmata, locale)} · ${formatNum(kgPerStremma, locale)} ＝ ${formatNum(totalKg, locale)} kg` }
      ],
      explanation: `${formatNum(stremmata, locale)} · ${formatNum(kgPerStremma, locale)} kg ＝ ${formatNum(totalKg, locale)} kg.`
    };
  },
  // 4. Πότισμα αγροκτήματος
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '8.5 stremmata' : '8,5 στρέμματα';
    return {
      title: isEn ? 'CONVERT TO STREMMATA' : 'ΜΕΤΑΤΡΟΠΗ ΣΕ ΣΤΡΕΜΜΑΤΑ',
      prompt: isEn
        ? 'A farmer irrigated an orchard with a total surface area of 8,500 m². How many stremmata were irrigated?'
        : 'Ένας αγρότης πότισε ένα περιβόλι με συνολική επιφάνεια 8.500 m². Πόσα στρέμματα πότισε;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '85 stremmata' : '85 στρέμματα',
        isEn ? '0.85 stremmata' : '0,85 στρέμματα',
        isEn ? '850 stremmata' : '850 στρέμματα',
        isEn ? '8 stremmata' : '8 στρέμματα'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'stremmata' : 'στρέμματα',
      tableData: [
        { label: isEn ? 'Surface area in m²' : 'Επιφάνεια σε m²', value: isEn ? '8,500 m²' : '8.500 m²' },
        { label: isEn ? 'Operation (: 1,000)' : 'Πράξη (: 1.000)', value: isEn ? '8,500 : 1,000 ＝ 8.5 stremmata' : '8.500 : 1.000 ＝ 8,5 στρέμματα' }
      ],
      fractionData: { n: isEn ? '8,500 m²' : '8.500 m²', d: isEn ? '1,000 m²' : '1.000 m²', res: isEn ? '8.5 stremmata' : '8,5 στρέμματα' },
      explanation: isEn ? '8,500 : 1,000 ＝ 8.5 stremmata.' : '8.500 : 1.000 ＝ 8,5 στρέμματα.'
    };
  },
  // 5. Κόστος περίφραξης ανά στρέμμα
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '48,000 €' : '48.000 €';
    return {
      title: isEn ? 'GROUND LEVELING COST' : 'ΚΟΣΤΟΣ ΔΙΑΜΟΡΦΩΣΗΣ ΕΔΑΦΟΥΣ',
      prompt: isEn
        ? 'Leveling and preparing a 4-stremma land parcel costs 12 € per m². What is the total cost of leveling the land?'
        : 'Η διαμόρφωση ενός οικοπέδου 4 στρεμμάτων κοστίζει 12 € ανά m². Πόσο θα κοστίσει συνολικά η διαμόρφωση του οικοπέδου;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '4,800 €' : '4.800 €',
        isEn ? '480,000 €' : '480.000 €',
        isEn ? '40,000 €' : '40.000 €',
        isEn ? '36,000 €' : '36.000 €'
      ]),
      correctAnswer: correct,
      unit: '€',
      tableData: [
        { label: isEn ? 'Area in m²' : 'Έκταση σε m²', value: isEn ? '4 · 1,000 ＝ 4,000 m²' : '4 · 1.000 ＝ 4.000 m²' },
        { label: isEn ? 'Cost per m²' : 'Κόστος ανά m²', value: '12 €' },
        { label: isEn ? 'Total cost' : 'Συνολικό κόστος', value: isEn ? '4,000 · 12 € ＝ 48,000 €' : '4.000 · 12 € ＝ 48.000 €' }
      ],
      explanation: isEn ? '4 stremmata ＝ 4,000 m². 4,000 · 12 € ＝ 48,000 €.' : '4 στρέμματα ＝ 4.000 m². 4.000 · 12 € ＝ 48.000 €.'
    };
  },
  // 6. Στρέμματα σε m²
  (locale) => {
    const isEn = locale === 'en';
    const stremmata = randInt(3, 9) + 0.5;
    const m2 = stremmata * 1000;
    const correct = `${formatNum(m2, locale)} m²`;
    return {
      title: isEn ? 'CONVERT STREMMATA TO M²' : 'ΜΕΤΑΤΡΟΠΗ ΣΤΡΕΜΜΑΤΩΝ ΣΕ M²',
      prompt: isEn
        ? `A farm covers an area of ${formatNum(stremmata, locale)} stremmata. How many square meters (m²) is its surface area?`
        : `Ένα αγρόκτημα έχει επιφάνεια ${formatNum(stremmata, locale)} στρέμματα. Πόσα τετραγωνικά μέτρα (m²) είναι η επιφάνειά του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(m2 / 10, locale)} m²`,
        `${formatNum(m2 + 500, locale)} m²`,
        `${formatNum(m2 * 10, locale)} m²`,
        `${formatNum(stremmata * 100, locale)} m²`
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEn ? 'Stremmata' : 'Στρέμματα', value: `${formatNum(stremmata, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}` },
        { label: isEn ? 'Operation (· 1,000)' : 'Πράξη (· 1.000)', value: `${formatNum(stremmata, locale)} · 1.000 ＝ ${formatNum(m2, locale)} m²` }
      ],
      explanation: isEn
        ? `Multiply by 1,000: ${formatNum(stremmata, locale)} · 1,000 ＝ ${formatNum(m2, locale)} m².`
        : `Πολλαπλασιάζουμε με το 1.000: ${formatNum(stremmata, locale)} · 1.000 ＝ ${formatNum(m2, locale)} m².`
    };
  }
];

// POOL ΓΙΑ Q11: Μετατροπές στη Σκάλα Επιφάνειας (dm², cm², mm²)
const PROBLEM_POOL_Q11 = [
  // 1. Από dm² σε cm²
  (locale) => {
    const isEn = locale === 'en';
    const dm2 = randInt(5, 18);
    const cm2 = dm2 * 100;
    const correct = `${formatNum(cm2, locale)} cm²`;
    return {
      title: isEn ? 'CONVERT DM² TO CM²' : 'ΜΕΤΑΤΡΟΠΗ DM² ΣΕ CM²',
      prompt: isEn
        ? `A cardboard sheet has an area of ${formatNum(dm2, locale)} dm². What is its area in square centimeters (cm²)?`
        : `Ένα χαρτόνι έχει επιφάνεια ${formatNum(dm2, locale)} dm². Πόσα τετραγωνικά εκατοστόμετρα (cm²) είναι η επιφάνειά του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(dm2 * 10, locale)} cm²`,
        `${formatNum(dm2 * 1000, locale)} cm²`,
        `${formatNum(cm2 + 50, locale)} cm²`,
        `${formatNum(dm2, locale)} cm²`
      ]),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Initial value' : 'Αρχική τιμή', value: `${formatNum(dm2, locale)} dm²` },
        { label: isEn ? 'dm² to cm² ratio' : 'Σχέση dm²/cm²', value: isEn ? '1 dm² ＝ 100 cm² (1 step down)' : '1 dm² ＝ 100 cm² (1 σκαλοπάτι κάτω)' },
        { label: isEn ? 'Operation' : 'Πράξη', value: `${formatNum(dm2, locale)} · 100 ＝ ${formatNum(cm2, locale)} cm²` }
      ],
      explanation: isEn
        ? `We go down one step on the area ladder, so we multiply by 100: ${formatNum(dm2, locale)} · 100 ＝ ${formatNum(cm2, locale)} cm².`
        : `Κατεβαίνουμε ένα σκαλοπάτι, άρα πολλαπλασιάζουμε με το 100: ${formatNum(dm2, locale)} · 100 ＝ ${formatNum(cm2, locale)} cm².`
    };
  },
  // 2. Από cm² σε mm²
  (locale) => {
    const isEn = locale === 'en';
    const cm2 = randInt(12, 45);
    const mm2 = cm2 * 100;
    const correct = `${formatNum(mm2, locale)} mm²`;
    return {
      title: isEn ? 'CONVERT CM² TO MM²' : 'ΜΕΤΑΤΡΟΠΗ CM² ΣΕ MM²',
      prompt: isEn
        ? `A metal plate has an area of ${formatNum(cm2, locale)} cm². What is its area in square millimeters (mm²)?`
        : `Μια μεταλλική πλάκα έχει εμβαδόν ${formatNum(cm2, locale)} cm². Πόσα τετραγωνικά χιλιοστόμετρα (mm²) είναι το εμβαδόν της;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(cm2 * 10, locale)} mm²`,
        `${formatNum(mm2 + 100, locale)} mm²`,
        `${formatNum(cm2 * 1000, locale)} mm²`,
        `${formatNum(mm2 / 10, locale)} mm²`
      ]),
      correctAnswer: correct,
      unit: 'mm²',
      tableData: [
        { label: isEn ? 'Initial value' : 'Αρχική τιμή', value: `${formatNum(cm2, locale)} cm²` },
        { label: isEn ? 'cm² to mm² ratio' : 'Σχέση cm²/mm²', value: '1 cm² ＝ 100 mm²' },
        { label: isEn ? 'Operation' : 'Πράξη', value: `${formatNum(cm2, locale)} · 100 ＝ ${formatNum(mm2, locale)} mm²` }
      ],
      explanation: `${formatNum(cm2, locale)} · 100 ＝ ${formatNum(mm2, locale)} mm².`
    };
  },
  // 3. Από cm² σε dm² (ανέβασμα)
  (locale) => {
    const isEn = locale === 'en';
    const correct = '45 dm²';
    return {
      title: isEn ? 'CONVERT CM² TO DM²' : 'ΜΕΤΑΤΡΟΠΗ CM² ΣΕ DM²',
      prompt: isEn
        ? 'A surface has an area of 4,500 cm². How many square decimeters (dm²) is that?'
        : 'Μια επιφάνεια έχει εμβαδόν 4.500 cm². Πόσα τετραγωνικά δεκατόμετρα (dm²) είναι;',
      options: ensureFourUniqueOptions(correct, () => ['450 dm²', isEn ? '4.5 dm²' : '4,5 dm²', isEn ? '45,000 dm²' : '45.000 dm²', isEn ? '0.45 dm²' : '0,45 dm²']),
      correctAnswer: correct,
      unit: 'dm²',
      tableData: [
        { label: isEn ? 'Initial value' : 'Αρχική τιμή', value: isEn ? '4,500 cm²' : '4.500 cm²' },
        { label: isEn ? 'Rule' : 'Κανόνας', value: isEn ? 'We go up 1 step (: 100)' : 'Ανεβαίνουμε 1 σκαλοπάτι (: 100)' },
        { label: isEn ? 'Operation' : 'Πράξη', value: isEn ? '4,500 : 100 ＝ 45 dm²' : '4.500 : 100 ＝ 45 dm²' }
      ],
      fractionData: { n: isEn ? '4,500 cm²' : '4.500 cm²', d: '100', res: '45 dm²' },
      explanation: isEn
        ? 'Going up 1 step on the surface area scale means dividing by 100: 4,500 : 100 ＝ 45 dm².'
        : 'Ανεβαίνουμε 1 σκαλοπάτι στη σκάλα επιφάνειας, άρα διαιρούμε με το 100: 4.500 : 100 ＝ 45 dm².'
    };
  },
  // 4. Από m² σε dm²
  (locale) => {
    const isEn = locale === 'en';
    const m2 = randInt(4, 15);
    const dm2 = m2 * 100;
    const correct = `${formatNum(dm2, locale)} dm²`;
    return {
      title: isEn ? 'CONVERT M² TO DM²' : 'ΜΕΤΑΤΡΟΠΗ M² ΣΕ DM²',
      prompt: isEn
        ? `A table surface measures ${formatNum(m2, locale)} m². How many square decimeters (dm²) is that?`
        : `Ένα τραπέζι έχει επιφάνεια ${formatNum(m2, locale)} m². Πόσα τετραγωνικά δεκατόμετρα (dm²) είναι η επιφάνειά του;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(m2 * 10, locale)} dm²`,
        `${formatNum(dm2 + 50, locale)} dm²`,
        `${formatNum(m2 * 1000, locale)} dm²`,
        `${formatNum(dm2 / 10, locale)} dm²`
      ]),
      correctAnswer: correct,
      unit: 'dm²',
      tableData: [
        { label: isEn ? 'Initial value' : 'Αρχική τιμή', value: `${formatNum(m2, locale)} m²` },
        { label: isEn ? 'm² to dm² ratio' : 'Σχέση m²/dm²', value: '1 m² ＝ 100 dm²' },
        { label: isEn ? 'Operation' : 'Πράξη', value: `${formatNum(m2, locale)} · 100 ＝ ${formatNum(dm2, locale)} dm²` }
      ],
      explanation: `${formatNum(m2, locale)} · 100 ＝ ${formatNum(dm2, locale)} dm².`
    };
  },
  // 5. Από mm² σε cm²
  (locale) => {
    const isEn = locale === 'en';
    const correct = '82 cm²';
    return {
      title: isEn ? 'CONVERT MM² TO CM²' : 'ΜΕΤΑΤΡΟΠΗ MM² ΣΕ CM²',
      prompt: isEn
        ? 'A small surface is measured at 8,200 mm². How many square centimeters (cm²) is that?'
        : 'Μια μικρή επιφάνεια μετρήθηκε 8.200 mm². Πόσα τετραγωνικά εκατοστόμετρα (cm²) είναι;',
      options: ensureFourUniqueOptions(correct, () => ['820 cm²', isEn ? '8.2 cm²' : '8,2 cm²', isEn ? '82,000 cm²' : '82.000 cm²', isEn ? '0.82 cm²' : '0,82 cm²']),
      correctAnswer: correct,
      unit: 'cm²',
      tableData: [
        { label: isEn ? 'Initial value' : 'Αρχική τιμή', value: isEn ? '8,200 mm²' : '8.200 mm²' },
        { label: isEn ? 'Operation (: 100)' : 'Πράξη (: 100)', value: isEn ? '8,200 : 100 ＝ 82 cm²' : '8.200 : 100 ＝ 82 cm²' }
      ],
      fractionData: { n: isEn ? '8,200 mm²' : '8.200 mm²', d: '100', res: '82 cm²' },
      explanation: isEn ? '8,200 : 100 ＝ 82 cm².' : '8.200 : 100 ＝ 82 cm².'
    };
  },
  // 6. Δύο σκαλοπάτια: dm² σε mm²
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '20,000 mm²' : '20.000 mm²';
    return {
      title: isEn ? 'TWO STEPS DOWN (DM² TO MM²)' : 'ΜΕΤΑΒΑΣΗ 2 ΣΚΑΛΟΠΑΤΙΩΝ (DM² ΣΕ MM²)',
      prompt: isEn
        ? 'How many square millimeters (mm²) are there in 2 dm²?'
        : 'Πόσα τετραγωνικά χιλιοστόμετρα (mm²) είναι τα 2 dm²;',
      options: ensureFourUniqueOptions(correct, () => [
        '200 mm²',
        isEn ? '2,000 mm²' : '2.000 mm²',
        isEn ? '200,000 mm²' : '200.000 mm²',
        '20 mm²'
      ]),
      correctAnswer: correct,
      unit: 'mm²',
      tableData: [
        { label: isEn ? 'From dm² to mm²' : 'Από dm² σε mm²', value: isEn ? '2 steps down (· 100 · 100 ＝ · 10,000)' : '2 σκαλοπάτια κάτω (· 100 · 100 ＝ · 10.000)' },
        { label: isEn ? 'Operation' : 'Πράξη', value: isEn ? '2 · 10,000 ＝ 20,000 mm²' : '2 · 10.000 ＝ 20.000 mm²' }
      ],
      explanation: isEn
        ? 'We step down 2 levels (from dm² to cm² and then to mm²), so we multiply by 10,000: 2 · 10,000 ＝ 20,000 mm².'
        : 'Κατεβαίνουμε 2 σκαλοπάτια (από dm² σε cm² και μετά σε mm²), άρα πολλαπλασιάζουμε με το 10.000: 2 · 10.000 ＝ 20.000 mm².'
    };
  }
];

// POOL ΓΙΑ Q12: Σύνθετα Προβλήματα Επιφάνειας & km²
const PROBLEM_POOL_Q12 = [
  // 1. Δάσος σε km² και στρέμματα
  (locale) => {
    const isEn = locale === 'en';
    const km2 = randInt(3, 8);
    const stremmata = km2 * 1000;
    const correct = `${formatNum(stremmata, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`;
    return {
      title: isEn ? 'FOREST AREA IN STREMMATA' : 'ΕΚΤΑΣΗ ΔΑΣΟΥΣ ΣΕ ΣΤΡΕΜΜΑΤΑ',
      prompt: isEn
        ? `A national park covers an area of ${formatNum(km2, locale)} km². How many stremmata is the park area?`
        : `Ένας εθνικός δρυμός καλύπτει έκταση ${formatNum(km2, locale)} km². Πόσα στρέμματα είναι η έκταση του δρυμού;`,
      options: ensureFourUniqueOptions(correct, () => [
        `${formatNum(km2 * 100, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`,
        `${formatNum(stremmata + 500, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`,
        `${formatNum(km2 * 10000, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`,
        `${formatNum(stremmata * 2, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}`
      ]),
      correctAnswer: correct,
      unit: isEn ? 'stremmata' : 'στρέμματα',
      tableData: [
        { label: isEn ? 'Area in km²' : 'Έκταση σε km²', value: `${formatNum(km2, locale)} km²` },
        { label: isEn ? 'km² to stremmata ratio' : 'Σχέση km²/στρεμμάτων', value: isEn ? '1 km² ＝ 1,000 stremmata (1,000,000 m²)' : '1 km² ＝ 1.000 στρέμματα (1.000.000 m²)' },
        { label: isEn ? 'Operation' : 'Πράξη', value: `${formatNum(km2, locale)} · 1.000 ＝ ${formatNum(stremmata, locale)} ${isEn ? 'stremmata' : 'στρέμματα'}` }
      ],
      explanation: isEn
        ? `Because 1 km² equals 1,000 stremmata, multiply: ${formatNum(km2, locale)} · 1,000 ＝ ${formatNum(stremmata, locale)} stremmata.`
        : `Επειδή 1 km² ισούται με 1.000 στρέμματα, πολλαπλασιάζουμε: ${formatNum(km2, locale)} · 1.000 ＝ ${formatNum(stremmata, locale)} στρέμματα.`
    };
  },
  // 2. Λίμνη σε m² και km²
  (locale) => {
    const isEn = locale === 'en';
    const correct = '5 km²';
    return {
      title: isEn ? 'LAKE AREA IN KM²' : 'ΕΠΙΦΑΝΕΙΑ ΛΙΜΝΗΣ ΣΕ KM²',
      prompt: isEn
        ? 'The surface of a lake measures 5,000,000 m². How many square kilometers (km²) is that?'
        : 'Η επιφάνεια μιας λίμνης είναι 5.000.000 m². Πόσα τετραγωνικά χιλιόμετρα (km²) είναι η επιφάνειά της;',
      options: ensureFourUniqueOptions(correct, () => [
        '50 km²',
        isEn ? '0.5 km²' : '0,5 km²',
        '500 km²',
        isEn ? '5,000 km²' : '5.000 km²'
      ]),
      correctAnswer: correct,
      unit: 'km²',
      tableData: [
        { label: isEn ? 'Area in m²' : 'Επιφάνεια σε m²', value: isEn ? '5,000,000 m²' : '5.000.000 m²' },
        { label: isEn ? 'km² to m² ratio' : 'Σχέση km²/m²', value: isEn ? '1 km² ＝ 1,000,000 m²' : '1 km² ＝ 1.000.000 m²' },
        { label: isEn ? 'Operation' : 'Πράξη', value: isEn ? '5,000,000 : 1,000,000 ＝ 5 km²' : '5.000.000 : 1.000.000 ＝ 5 km²' }
      ],
      fractionData: { n: isEn ? '5,000,000 m²' : '5.000.000 m²', d: isEn ? '1,000,000 m²' : '1.000.000 m²', res: '5 km²' },
      explanation: isEn ? '5,000,000 : 1,000,000 ＝ 5 km².' : '5.000.000 : 1.000.000 ＝ 5 km².'
    };
  },
  // 3. Σύγκριση εμβαδών διαφορετικών μονάδων
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? 'Field B (5 stremmata ＝ 5,000 m²)' : 'Το χωράφι Β (5 στρέμματα ＝ 5.000 m²)';
    return {
      title: isEn ? 'COMPARING SURFACE AREAS' : 'ΣΥΓΚΡΙΣΗ ΕΠΙΦΑΝΕΙΩΝ',
      prompt: isEn
        ? 'We have two fields: Field A has an area of 4,200 m² and Field B has an area of 5 stremmata. Which field is larger?'
        : 'Έχουμε δύο χωράφια: Το χωράφι Α έχει εμβαδόν 4.200 m² και το χωράφι Β έχει εμβαδόν 5 στρέμματα. Ποιο χωράφι είναι μεγαλύτερο;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? 'Field A (4,200 m²)' : 'Το χωράφι Α (4.200 m²)',
        isEn ? 'They are strictly equal' : 'Είναι απολύτως ίσα',
        isEn ? 'They cannot be compared' : 'Δεν μπορούμε να τα συγκρίνουμε'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'answer' : 'απάντηση',
      tableData: [
        { label: isEn ? 'Field A' : 'Χωράφι Α', value: isEn ? '4,200 m²' : '4.200 m²' },
        { label: isEn ? 'Field B' : 'Χωράφι Β', value: isEn ? '5 stremmata ＝ 5,000 m²' : '5 στρέμματα ＝ 5.000 m²' },
        { label: isEn ? 'Comparison' : 'Σύγκριση', value: isEn ? '5,000 m² ＞ 4,200 m²' : '5.000 m² ＞ 4.200 m²' }
      ],
      explanation: isEn
        ? '5 stremmata equal 5,000 m², so Field B is larger than Field A (5,000 m² ＞ 4,200 m²).'
        : 'Τα 5 στρέμματα είναι 5.000 m², επομένως το χωράφι Β είναι μεγαλύτερο από το χωράφι Α (5.000 m² ＞ 4.200 m²).'
    };
  },
  // 4. Αγορά οικοπέδου ανά m²
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '160,000 €' : '160.000 €';
    return {
      title: isEn ? 'PLOT PRICE PER M²' : 'ΑΞΙΑ ΟΙΚΟΠΕΔΟΥ ΑΝΑ M²',
      prompt: isEn
        ? 'A 2-stremma building plot is sold for 80 € per square meter (m²). What is the total selling price?'
        : 'Ένα οικόπεδο 2 στρεμμάτων πωλείται προς 80 € το τετραγωνικό μέτρο (m²). Ποια είναι η συνολική τιμή πώλησης;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '16,000 €' : '16.000 €',
        '160 €',
        isEn ? '1,600,000 €' : '1.600.000 €',
        isEn ? '80,000 €' : '80.000 €'
      ]),
      correctAnswer: correct,
      unit: '€',
      tableData: [
        { label: isEn ? 'Area in m²' : 'Έκταση σε m²', value: isEn ? '2 · 1,000 ＝ 2,000 m²' : '2 · 1.000 ＝ 2.000 m²' },
        { label: isEn ? 'Price per m²' : 'Τιμή ανά m²', value: '80 €' },
        { label: isEn ? 'Total cost' : 'Συνολικό κόστος', value: isEn ? '2,000 · 80 € ＝ 160,000 €' : '2.000 · 80 € ＝ 160.000 €' }
      ],
      explanation: isEn ? '2 stremmata ＝ 2,000 m². 2,000 · 80 € ＝ 160,000 €.' : '2 στρέμματα ＝ 2.000 m². 2.000 · 80 € ＝ 160.000 €.'
    };
  },
  // 5. Νησί σε km² και m²
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '12,000,000 m²' : '12.000.000 m²';
    return {
      title: isEn ? 'ISLET AREA IN M²' : 'ΕΠΙΦΑΝΕΙΑ ΝΗΣΙΟΥ ΣΕ M²',
      prompt: isEn
        ? 'A rocky islet covers an area of 12 km². How many square meters (m²) is its surface area?'
        : 'Μια βραχονησίδα έχει έκταση 12 km². Πόσα τετραγωνικά μέτρα (m²) είναι η έκτασή της;',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '120,000 m²' : '120.000 m²',
        isEn ? '1,200,000 m²' : '1.200.000 m²',
        isEn ? '12,000 m²' : '12.000 m²',
        isEn ? '120,000,000 m²' : '120.000.000 m²'
      ]),
      correctAnswer: correct,
      unit: 'm²',
      tableData: [
        { label: isEn ? 'Area in km²' : 'Έκταση σε km²', value: '12 km²' },
        { label: isEn ? 'Operation (· 1,000,000)' : 'Πράξη (· 1.000.000)', value: isEn ? '12 · 1,000,000 ＝ 12,000,000 m²' : '12 · 1.000.000 ＝ 12.000.000 m²' }
      ],
      explanation: isEn ? '12 · 1,000,000 ＝ 12,000,000 m².' : '12 · 1.000.000 ＝ 12.000.000 m².'
    };
  },
  // 6. Πόσα στρέμματα είναι 1 km²
  (locale) => {
    const isEn = locale === 'en';
    const correct = isEn ? '1,000 stremmata' : '1.000 στρέμματα';
    return {
      title: isEn ? 'EQUIVALENCE OF KM² AND STREMMATA' : 'ΙΣΟΔΥΝΑΜΙΑ KM² ΚΑΙ ΣΤΡΕΜΜΑΤΩΝ',
      prompt: isEn
        ? 'How many stremmata are contained in exactly 1 square kilometer (1 km²)?'
        : 'Πόσα στρέμματα περιέχει ακριβώς 1 τετραγωνικό χιλιόμετρο (1 km²);',
      options: ensureFourUniqueOptions(correct, () => [
        isEn ? '100 stremmata' : '100 στρέμματα',
        isEn ? '10,000 stremmata' : '10.000 στρέμματα',
        isEn ? '10 stremmata' : '10 στρέμματα',
        isEn ? '1,000,000 stremmata' : '1.000.000 στρέμματα'
      ]),
      correctAnswer: correct,
      unit: isEn ? 'stremmata' : 'στρέμματα',
      tableData: [
        { label: isEn ? '1 km² in m²' : '1 km² σε m²', value: isEn ? '1,000,000 m²' : '1.000.000 m²' },
        { label: isEn ? '1 stremma in m²' : '1 στρέμμα σε m²', value: isEn ? '1,000 m²' : '1.000 m²' },
        { label: isEn ? 'Operation' : 'Πράξη', value: isEn ? '1,000,000 : 1,000 ＝ 1,000 stremmata' : '1.000.000 : 1.000 ＝ 1.000 στρέμματα' }
      ],
      fractionData: { n: isEn ? '1,000,000 m²' : '1.000.000 m²', d: isEn ? '1,000 m²' : '1.000 m²', res: isEn ? '1,000 stremmata' : '1.000 στρέμματα' },
      explanation: isEn
        ? '1 km² ＝ 1,000,000 m². Since 1 stremma ＝ 1,000 m²: 1,000,000 : 1,000 ＝ 1,000 stremmata.'
        : '1 km² ＝ 1.000.000 m². Επειδή 1 στρέμμα ＝ 1.000 m², έχουμε: 1.000.000 : 1.000 ＝ 1.000 στρέμματα.'
    };
  }
];

// -------------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ ΤΟΥ ΣΕΤ 12 ΕΡΩΤΗΣΕΩΝ (GENERATOR)
// -------------------------------------------------------------

function generateQuestionsSet(locale = 'el') {
  const isEn = locale === 'en';
  const qs = [];

  // Q1: Ορισμός εμβαδού vs περιμέτρου (True/False)
  const isQ1True = Math.random() < 0.5;
  qs.push({
    id: 1,
    type: 'boolean',
    title: isEn ? 'CONCEPT OF AREA' : 'ΕΝΝΟΙΑ ΕΜΒΑΔΟΥ',
    prompt: isQ1True
      ? isEn
        ? 'Area expresses the size of the 2D surface covered by a shape, whereas perimeter is the 1D length of its boundary.'
        : 'Το εμβαδόν εκφράζει το μέγεθος της επιφάνειας που καλύπτει ένα σχήμα, ενώ η περίμετρος είναι το μήκος του εξωτερικού του ορίου.'
      : isEn
        ? 'Area and perimeter are always measured using identical linear units (such as simple meters m).'
        : 'Το εμβαδόν και η περίμετρος ενός σχήματος μετριούνται πάντα με τις ίδιες μονάδες μέτρησης (σε απλά μέτρα m).',
    correctAnswer: isQ1True,
    tableData: [
      { label: isEn ? 'Perimeter' : 'Περίμετρος', value: isEn ? 'Boundary length (m, cm, etc.)' : 'Μήκος γραμμής (σε m, cm κ.λπ.)' },
      { label: isEn ? 'Area' : 'Εμβαδόν', value: isEn ? 'Surface region (m², cm², etc.)' : 'Επιφάνεια χώρου (σε m², cm² κ.λπ.)' }
    ],
    explanation: isQ1True
      ? isEn
        ? 'CORRECT: Perimeter measures the outer 1D boundary, while area measures the total enclosed 2D surface.'
        : 'ΣΩΣΤΟ: Η περίμετρος μετράει το περίγραμμα (μήκος), ενώ το εμβαδόν μετράει ολόκληρη την εσωτερική επιφάνεια.'
      : isEn
        ? 'FALSE: Perimeter is measured in linear units (m), while area is measured in square units (square meters m²).'
        : 'ΛΑΘΟΣ: Η περίμετρος μετριέται σε μονάδες μήκους (m), ενώ το εμβαδόν σε μονάδες επιφάνειας (τετραγωνικά μέτρα m²).'
  });

  // Q2: Βασική μονάδα μέτρησης επιφάνειας (MCQ)
  const q2Correct = isEn ? 'The square meter (1 m²)' : 'Το τετραγωνικό μέτρο (1 m²)';
  qs.push({
    id: 2,
    type: 'mcq',
    title: isEn ? 'BASE SURFACE UNIT' : 'ΒΑΣΙΚΗ ΜΟΝΑΔΑ ΕΠΙΦΑΝΕΙΑΣ',
    prompt: isEn
      ? 'What is the base unit of surface area in the International System of Units?'
      : 'Ποια είναι η βασική μονάδα μέτρησης επιφάνειας στο διεθνές σύστημα μονάδων;',
    options: ensureFourUniqueOptions(q2Correct, () => [
      isEn ? 'The meter (1 m)' : 'Το απλό μέτρο (1 m)',
      isEn ? 'The stremma' : 'Το στρέμμα',
      isEn ? 'The square kilometer (1 km²)' : 'Το τετραγωνικό χιλιόμετρο (1 km²)'
    ]),
    correctAnswer: q2Correct,
    tableData: [
      { label: isEn ? 'Base unit' : 'Βασική μονάδα', value: isEn ? 'Square meter (1 m²)' : 'Τετραγωνικό μέτρο (1 m²)' },
      { label: isEn ? 'Definition' : 'Ορισμός', value: isEn ? 'A square with sides of length 1 m' : 'Τετράγωνο με πλευρά μήκους 1 m' }
    ],
    explanation: isEn
      ? 'The fundamental base unit of surface area is the square meter (1 m²).'
      : 'Η θεμελιώδης μονάδα μέτρησης επιφάνειας είναι το τετραγωνικό μέτρο (1 m²).'
  });

  // Q3: Γιατί αλλάζουν ανά 100 οι μονάδες επιφάνειας (MCQ)
  const q3Correct = isEn
    ? 'Because surface area spans 2 dimensions (length · width) and 10 · 10 ＝ 100'
    : 'Επειδή η επιφάνεια έχει 2 διαστάσεις (μήκος · πλάτος) και 10 · 10 ＝ 100';
  qs.push({
    id: 3,
    type: 'mcq',
    title: isEn ? 'UNIT SCALE STEP RATIO' : 'ΣΧΕΣΗ ΜΟΝΑΔΩΝ ΣΤΗ ΣΚΑΛΑ ΕΠΙΦΑΝΕΙΑΣ',
    prompt: isEn
      ? 'Why does each step on the surface area scale change by a factor of 100 rather than 10?'
      : 'Γιατί κάθε σκαλοπάτι στη σκάλα των μονάδων επιφάνειας αλλάζει κατά 100 και όχι κατά 10;',
    options: ensureFourUniqueOptions(q3Correct, () => [
      isEn ? 'Because it was decided randomly' : 'Επειδή έτσι αποφασίστηκε τυχαία',
      isEn ? 'Because 100 is a larger number' : 'Επειδή το 100 είναι μεγαλύτερος αριθμός',
      isEn ? 'Because all geometric shapes are squares' : 'Επειδή όλα τα σχήματα είναι τετράγωνα'
    ]),
    correctAnswer: q3Correct,
    tableData: [
      { label: isEn ? '1 dimension (length)' : '1 διάσταση (μήκος)', value: '1 m ＝ 10 dm' },
      { label: isEn ? '2 dimensions (surface)' : '2 διαστάσεις (επιφάνεια)', value: '1 m² ＝ 10 dm · 10 dm ＝ 100 dm²' }
    ],
    explanation: isEn
      ? 'Area is the product of two linear dimensions (10 · 10 ＝ 100), which is why each consecutive level scales by 100.'
      : 'Η επιφάνεια είναι γινόμενο δύο διαστάσεων (10 · 10 ＝ 100), γι\' αυτό κάθε σκαλοπάτι ισοδυναμεί με 100.'
  });

  // Q4: Οπτική αναγνώριση 1 m² (SVG - No Giveaway)
  const q4Correct = isEn
    ? 'Into 100 square decimeters (100 dm²)'
    : 'Σε 100 τετραγωνικά δεκατόμετρα (100 dm²)';
  qs.push({
    id: 4,
    type: 'mcq',
    title: isEn ? 'VISUAL UNDERSTANDING OF 1 M²' : 'ΟΠΤΙΚΗ ΚΑΤΑΝΟΗΣΗ 1 M²',
    prompt: isEn
      ? 'A large square has sides of 1 m (which equals 10 dm). Into how many small unit squares of 1 dm² each is it divided?'
      : 'Ένα τετράγωνο έχει πλευρά 1 m (δηλαδή 10 dm). Σε πόσα μικρά τετραγωνάκια του 1 dm² χωρίζεται;',
    svg: (
      <svg viewBox="0 0 120 120" className="w-32 h-32 max-w-full mx-auto my-2 select-none drop-shadow-sm">
        <rect x="10" y="10" width="100" height="100" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i}>
            <line x1={10 + (i + 1) * 10} y1="10" x2={10 + (i + 1) * 10} y2="110" stroke="#818cf8" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="10" y1={10 + (i + 1) * 10} x2="110" y2={10 + (i + 1) * 10} stroke="#818cf8" strokeWidth="0.8" strokeDasharray="2 2" />
          </g>
        ))}
      </svg>
    ),
    options: ensureFourUniqueOptions(q4Correct, () => [
      isEn ? 'Into 10 square decimeters (10 dm²)' : 'Σε 10 τετραγωνικά δεκατόμετρα (10 dm²)',
      isEn ? 'Into 1,000 square decimeters (1,000 dm²)' : 'Σε 1.000 τετραγωνικά δεκατόμετρα (1.000 dm²)',
      isEn ? 'Into 20 square decimeters (20 dm²)' : 'Σε 20 τετραγωνικά δεκατόμετρα (20 dm²)'
    ]),
    correctAnswer: q4Correct,
    tableData: [
      { label: isEn ? 'Rows and columns' : 'Γραμμές και στήλες', value: isEn ? '10 rows · 10 columns ＝ 100 squares' : '10 γραμμές · 10 στήλες ＝ 100 τετραγωνάκια' },
      { label: isEn ? 'Equivalence' : 'Σχέση', value: '1 m² ＝ 100 dm²' }
    ],
    explanation: isEn
      ? 'The 10 × 10 grid contains exactly 100 square decimeters (100 dm²).'
      : 'Το πλέγμα 10 × 10 περιέχει ακριβώς 100 τετραγωνικά δεκατόμετρα (100 dm²).'
  });

  // Q5: Πόσα m² είναι 1 στρέμμα (Input αριθμού)
  qs.push({
    id: 5,
    type: 'input',
    title: isEn ? 'STREMMA IN SQUARE METERS' : 'ΤΟ ΣΤΡΕΜΜΑ ΣΕ ΤΕΤΡΑΓΩΝΙΚΑ ΜΕΤΡΑ',
    prompt: isEn
      ? 'How many square meters (m²) equal 1 stremma? (Enter only the number)'
      : 'Πόσα τετραγωνικά μέτρα (m²) ισούνται με 1 στρέμμα; (Γράψτε μόνο τον αριθμό)',
    correctAnswer: '1000',
    tableData: [
      { label: isEn ? 'Unit' : 'Μονάδα', value: isEn ? '1 Stremma' : '1 Στρέμμα' },
      { label: isEn ? 'Equivalence in m²' : 'Ισοδυναμία σε m²', value: isEn ? '1,000 m²' : '1.000 m²' }
    ],
    explanation: isEn
      ? '1 stremma equals exactly 1,000 square meters (m²).'
      : '1 στρέμμα ισούται ακριβώς με 1.000 τετραγωνικά μέτρα (m²).'
  });

  // Q6: Μετατροπή m² σε dm² (Input αριθμού)
  const m2Q6 = randInt(2, 8);
  const dm2Q6 = m2Q6 * 100;
  qs.push({
    id: 6,
    type: 'input',
    title: isEn ? 'CONVERT M² TO DM²' : 'ΜΕΤΑΤΡΟΠΗ M² ΣΕ DM²',
    prompt: isEn
      ? `How many square decimeters (dm²) are there in ${formatNum(m2Q6, locale)} m²? (Enter only the number)`
      : `Πόσα τετραγωνικά δεκατόμετρα (dm²) είναι τα ${formatNum(m2Q6, locale)} m²; (Γράψτε μόνο τον αριθμό)`,
    correctAnswer: String(dm2Q6),
    tableData: [
      { label: isEn ? 'Initial value' : 'Αρχική τιμή', value: `${formatNum(m2Q6, locale)} m²` },
      { label: isEn ? 'Operation (· 100)' : 'Πράξη (· 100)', value: `${formatNum(m2Q6, locale)} · 100 ＝ ${formatNum(dm2Q6, locale)} dm²` }
    ],
    explanation: isEn
      ? `We step down 1 level, so we multiply by 100: ${formatNum(m2Q6, locale)} · 100 ＝ ${formatNum(dm2Q6, locale)} dm².`
      : `Κατεβαίνουμε 1 σκαλοπάτι, άρα πολλαπλασιάζουμε με το 100: ${formatNum(m2Q6, locale)} · 100 ＝ ${formatNum(dm2Q6, locale)} dm².`
  });

  // Q7: Από m² σε cm² (2 σκαλοπάτια) (MCQ)
  const q7Correct = isEn ? 'By 10,000 (100 · 100)' : 'Με το 10.000 (100 · 100)';
  qs.push({
    id: 7,
    type: 'mcq',
    title: isEn ? 'TRANSITION FROM M² TO CM²' : 'ΜΕΤΑΒΑΣΗ ΑΠΟ M² ΣΕ CM²',
    prompt: isEn
      ? 'By what number must we multiply to convert square meters (m²) into square centimeters (cm²)?'
      : 'Με ποιον αριθμό πρέπει να πολλαπλασιάσουμε για να μετατρέψουμε τα τετραγωνικά μέτρα (m²) σε τετραγωνικά εκατοστόμετρα (cm²);',
    options: ensureFourUniqueOptions(q7Correct, () => [
      isEn ? 'By 100' : 'Με το 100',
      isEn ? 'By 1,000' : 'Με το 1.000',
      isEn ? 'By 200' : 'Με το 200'
    ]),
    correctAnswer: q7Correct,
    tableData: [
      { label: isEn ? 'From m² to dm²' : 'Από m² σε dm²', value: '· 100' },
      { label: isEn ? 'From dm² to cm²' : 'Από dm² σε cm²', value: '· 100' },
      { label: isEn ? 'Combined factor' : 'Συνολικός πολλαπλασιασμός', value: isEn ? '100 · 100 ＝ 10,000' : '100 · 100 ＝ 10.000' }
    ],
    explanation: isEn
      ? 'We descend 2 steps on the surface ladder, multiplying by 10,000 (1 m² ＝ 10,000 cm²).'
      : 'Κατεβαίνουμε 2 σκαλοπάτια στην επιφάνεια, άρα πολλαπλασιάζουμε με το 10.000 (1 m² ＝ 10.000 cm²).'
  });

  // Q8: Από μικρότερη μονάδα σε μεγαλύτερη (MCQ)
  const q8Correct = isEn
    ? 'Divide by 100 for each step'
    : 'Διαιρούμε με το 100 για κάθε σκαλοπάτι';
  qs.push({
    id: 8,
    type: 'mcq',
    title: isEn ? 'SCALE CONVERSION RULE' : 'ΚΑΝΟΝΑΣ ΜΕΤΑΤΡΟΠΗΣ ΣΤΗ ΣΚΑΛΑ',
    prompt: isEn
      ? 'When converting surface area from a smaller unit to a larger one (moving up the ladder, e.g. from cm² to dm²), what operation do we perform?'
      : 'Όταν μετατρέπουμε μια επιφάνεια από μικρότερη μονάδα σε μεγαλύτερη (ανεβαίνουμε σκαλοπάτι, π.χ. από cm² σε dm²), τι πράξη κάνουμε;',
    options: ensureFourUniqueOptions(q8Correct, () => [
      isEn ? 'Multiply by 100 for each step' : 'Πολλαπλασιάζουμε με το 100 για κάθε σκαλοπάτι',
      isEn ? 'Add 100' : 'Προσθέτουμε 100',
      isEn ? 'Divide by 10' : 'Διαιρούμε με το 10'
    ]),
    correctAnswer: q8Correct,
    tableData: [
      { label: isEn ? 'Going up the ladder' : 'Ανέβασμα σκάλας', value: isEn ? 'Division by 100 per step' : 'Διαίρεση με το 100 ανά σκαλοπάτι' },
      { label: isEn ? 'Going down the ladder' : 'Κατέβασμα σκάλας', value: isEn ? 'Multiplication by 100 per step' : 'Πολλαπλασιασμός με το 100 ανά σκαλοπάτι' }
    ],
    explanation: isEn
      ? 'When moving to a larger unit, the numerical value decreases, so we divide by 100 for each level.'
      : 'Όταν ανεβαίνουμε σε μεγαλύτερη μονάδα, ο αριθμός μικραίνει, άρα διαιρούμε με το 100 για κάθε σκαλοπάτι.'
  });

  // Q9: Πρόβλημα από PROBLEM_POOL_Q9
  const p9 = PROBLEM_POOL_Q9[randInt(0, PROBLEM_POOL_Q9.length - 1)](locale);
  qs.push({ id: 9, type: 'mcq', ...p9 });

  // Q10: Πρόβλημα από PROBLEM_POOL_Q10
  const p10 = PROBLEM_POOL_Q10[randInt(0, PROBLEM_POOL_Q10.length - 1)](locale);
  qs.push({ id: 10, type: 'mcq', ...p10 });

  // Q11: Πρόβλημα από PROBLEM_POOL_Q11
  const p11 = PROBLEM_POOL_Q11[randInt(0, PROBLEM_POOL_Q11.length - 1)](locale);
  qs.push({ id: 11, type: 'mcq', ...p11 });

  // Q12: Πρόβλημα από PROBLEM_POOL_Q12
  const p12 = PROBLEM_POOL_Q12[randInt(0, PROBLEM_POOL_Q12.length - 1)](locale);
  qs.push({ id: 12, type: 'mcq', ...p12 });

  return qs;
}

// -------------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΑΣΚΗΣΕΩΝ
// -------------------------------------------------------------

export default function EmbadonAskiseisPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const isEn = locale === 'en';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadNewSet();
  }, [locale]);

  function loadNewSet() {
    const newQs = generateQuestionsSet(locale);
    setQuestions(newQs);
    setUserAnswers({});
    setSubmitted(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleAnswerChange(id, rawValue) {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [id]: rawValue
    }));
  }

  function isQuestionCorrect(q) {
    const userAns = userAnswers[q.id];
    if (userAns === undefined || userAns === null) return false;

    if (q.type === 'boolean') {
      return userAns === q.correctAnswer;
    }

    if (q.type === 'mcq') {
      return String(userAns).trim() === String(q.correctAnswer).trim();
    }

    if (q.type === 'input') {
      const cleanUser = String(userAns).trim().replace(/\./g, ',');
      const cleanCorrect = String(q.correctAnswer).trim().replace(/\./g, ',');

      if (cleanUser === cleanCorrect) return true;

      const numUser = parseFloat(cleanUser.replace(',', '.'));
      const numCorrect = parseFloat(cleanCorrect.replace(',', '.'));
      if (!isNaN(numUser) && !isNaN(numCorrect)) {
        return Math.abs(numUser - numCorrect) <= 0.05;
      }
      return false;
    }

    return false;
  }

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] !== undefined && userAnswers[k] !== ''
  ).length;

  const score = questions.reduce((acc, q) => (isQuestionCorrect(q) ? acc + 1 : acc), 0);
  const totalCount = questions.length || 12;
  const percentage = Math.round((score / totalCount) * 100);

  // Μεταφράσεις UI
  const ui = {
    el: {
      headTitle: "Ασκήσεις: Μέτρηση Επιφάνειας & Εμβαδόν - ΣΤ' Δημοτικού | LearnMaths.gr",
      headDesc: "Διαδραστικές ασκήσεις στις μονάδες μέτρησης επιφάνειας, τη σκάλα μετατροπών ανά 100 και τα στρέμματα για τη ΣΤ' Δημοτικού.",
      backTheory: "Θεωρία Κεφ. 72",
      btnTheory: "📖 Θεωρία",
      badge: "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 72 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Ασκήσεις: Μέτρηση Επιφάνειας και Εμβαδόν",
      heroDesc: "Εξασκηθείτε στις μετατροπές τετραγωνικών μέτρων, δεκατομέτρων, εκατοστομέτρων και στρεμμάτων μέσα από 12 δυναμικές ερωτήσεις και ρεαλιστικά προβλήματα.",
      heroSub: "12 Δυναμικές Ασκήσεις με Αυτόματη Αξιολόγηση & Αναλυτική Επεξήγηση",
      btnNewSet: "Νέες Ασκήσεις",
      correctBadge: "ΣΩΣΤΟ",
      wrongBadge: "ΛΑΘΟΣ",
      trueBtn: "ΣΩΣΤΟ",
      falseBtn: "ΛΑΘΟΣ",
      inputPlaceholder: "Απάντηση...",
      answeredLabel: "ΑΠΑΝΤΗΘΗΚΑΝ:",
      scoreLabel: "ΣΚΟΡ:",
      percentageLabel: "ΠΟΣΟΣΤΟ:",
      btnSubmit: "ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ",
      feedbackCorrect: "✓ Μπράβο! Σωστή απάντηση.",
      feedbackWrong: "✗ Λάθος. Η σωστή απάντηση είναι: "
    },
    en: {
      headTitle: "Exercises: Surface Measurement & Area - 6th Grade | LearnMaths.gr",
      headDesc: "Interactive exercises on surface area units, scale conversions by 100, and stremmata for 6th Grade Math.",
      backTheory: "Theory Chap. 72",
      btnTheory: "📖 Theory",
      badge: "EXERCISES • CHAPTER 72 • 6TH GRADE",
      heroTitle: "Exercises: Surface Measurement and Area",
      heroDesc: "Practice conversions between square meters, square decimeters, square centimeters, and stremmata across 12 dynamic questions and realistic real estate/flooring problems.",
      heroSub: "12 Dynamic Questions with Instant Feedback & Detailed Solutions",
      btnNewSet: "New Exercises",
      correctBadge: "CORRECT",
      wrongBadge: "WRONG",
      trueBtn: "TRUE",
      falseBtn: "FALSE",
      inputPlaceholder: "Answer...",
      answeredLabel: "ANSWERED:",
      scoreLabel: "SCORE:",
      percentageLabel: "PERCENTAGE:",
      btnSubmit: "CHECK ANSWERS",
      feedbackCorrect: "✓ Great job! Correct answer.",
      feedbackWrong: "✗ Incorrect. The correct answer is: "
    }
  }[locale];

  return (
    <Layout
      title={ui.headTitle}
      description={ui.headDesc}
      backUrl="/st-dimotikou/72-embadon"
      backText={ui.backTheory}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/72-embadon"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0"
        >
          <span>{ui.btnTheory}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden box-border">

        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden mb-8 sm:mb-12">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span className="break-words">{ui.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(ui.heroTitle)}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words">
              {ui.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="break-words">{ui.heroSub}</span>
            </div>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base shrink-0"
            >
              <span>🔄 {toCleanUppercase(ui.btnNewSet)}</span>
            </button>
          </div>
        </section>

        {/* ΛΙΣΤΑ ΕΡΩΤΗΣΕΩΝ (12 ΕΡΩΤΗΣΕΙΣ) */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, index) => {
            const isCorrect = isQuestionCorrect(q);
            const userAns = userAnswers[q.id];

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-4 sm:p-8 shadow-sm border transition-all min-w-0 ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 ring-1 ring-emerald-200'
                      : 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* ΚΕΦΑΛΙΔΑ ΕΡΩΤΗΣΗΣ */}
                <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-sm sm:text-base border border-indigo-150 shrink-0">
                      {index + 1}
                    </span>
                    <h2 className="text-xs sm:text-sm font-black text-slate-800 tracking-wider break-words [overflow-wrap:anywhere]">
                      {toCleanUppercase(q.title || (isEn ? `QUESTION ${index + 1}` : `ΕΡΩΤΗΣΗ ${index + 1}`))}
                    </h2>
                  </div>

                  {submitted && (
                    <span
                      className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-black tracking-wider shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? toCleanUppercase(ui.correctBadge) : toCleanUppercase(ui.wrongBadge)}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ & SVG (NO-GIVEAWAY) */}
                <div className="mb-6 space-y-3">
                  <p className="text-slate-800 text-sm sm:text-base font-semibold leading-relaxed break-words [overflow-wrap:anywhere]">
                    {q.prompt}
                  </p>
                  {q.svg && <div className="py-2 flex justify-center">{q.svg}</div>}
                </div>

                {/* ΔΙΑΔΡΑΣΤΙΚΑ ΧΕΙΡΙΣΤΗΡΙΑ ΑΠΑΝΤΗΣΗΣ */}
                <div className="mb-4">
                  {/* ΤΥΠΟΣ 1: BOOLEAN */}
                  {q.type === 'boolean' && (
                    <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                      {[true, false].map((val) => {
                        const isSelected = userAns === val;
                        return (
                          <button
                            key={String(val)}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, val)}
                            className={`py-3 px-3 sm:px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all border break-words ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {val ? toCleanUppercase(ui.trueBtn) : toCleanUppercase(ui.falseBtn)}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 2: MCQ (4 ΜΟΝΑΔΙΚΑ ΚΟΥΜΠΙΑ ΧΩΡΙΣ LINE-CLAMP) */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAns === opt;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`text-left p-3.5 sm:p-4 rounded-2xl border font-semibold text-xs sm:text-sm transition-all flex items-start gap-3 w-full ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                                isSelected
                                  ? 'bg-white text-indigo-700'
                                  : 'bg-white text-slate-500 border border-slate-200'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1">
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ΤΥΠΟΣ 3: INPUT */}
                  {q.type === 'input' && (
                    <div className="w-full max-w-xs">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={submitted}
                        placeholder={ui.inputPlaceholder}
                        value={userAns || ''}
                        onChange={(e) => {
                          const cleaned = e.target.value
                            .replace(/[^0-9.,]/g, '')
                            .replace(/\./g, ',');
                          handleAnswerChange(q.id, cleaned);
                        }}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-80"
                      />
                    </div>
                  )}
                </div>

                {/* FEEDBACK & EXPLANATION (ΑΠΟΚΛΕΙΣΤΙΚΑ ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ) */}
                {submitted && (
                  <div className="mt-6 pt-5 border-t border-slate-150 space-y-4">
                    {/* ΠΙΝΑΚΑΣ ΔΕΔΟΜΕΝΩΝ (TABLEDATA) ΜΟΝΟ ΕΔΩ */}
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-1">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <tbody>
                            {q.tableData.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={rIdx !== q.tableData.length - 1 ? 'border-b border-slate-200/60' : ''}
                              >
                                <td className="py-2.5 px-3 font-bold text-slate-600 bg-slate-100/70 w-1/3 min-w-[110px] break-words">
                                  {row.label}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-800 break-words [overflow-wrap:anywhere]">
                                  {row.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* ΑΝΑΛΥΤΙΚΗ ΕΠΕΞΗΓΗΣΗ ΜΕ ΚΑΝΟΝΙΚΑ ΚΛΑΣΜΑΤΑ */}
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                          : 'bg-rose-50 text-rose-950 border border-rose-200'
                      }`}
                    >
                      <p className="font-bold mb-1 break-words">
                        {isCorrect
                          ? ui.feedbackCorrect
                          : `${ui.feedbackWrong}${
                              q.type === 'boolean'
                                ? q.correctAnswer
                                  ? ui.trueBtn
                                  : ui.falseBtn
                                : q.correctAnswer
                            }`}
                      </p>
                      <div className="text-slate-700 flex flex-wrap items-center gap-1 leading-normal break-words">
                        <span>{q.explanation}</span>
                        {q.fractionData && (
                          <span className="inline-flex flex-wrap items-center gap-1 font-mono font-bold">
                            <span>(</span>
                            <MathFraction num={q.fractionData.n} den={q.fractionData.d} />
                            <span>＝ {q.fractionData.res})</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM SCORE FOOTER (12 ΕΡΩΤΗΣΕΙΣ) */}
        <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
          <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-8 min-w-0">
              {!submitted ? (
                <div className="text-xs sm:text-sm font-semibold text-slate-300 truncate">
                  <span>{toCleanUppercase(ui.answeredLabel)} </span>
                  <span className="font-black text-indigo-400 text-sm sm:text-base">
                    {answeredCount} / {totalCount}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span className="hidden xs:inline">{toCleanUppercase(ui.scoreLabel)} </span>
                    <span className="font-black text-emerald-400 text-sm sm:text-base">
                      {score} / {totalCount}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-300">
                    <span className="hidden xs:inline">{toCleanUppercase(ui.percentageLabel)} </span>
                    <span className="font-black text-amber-400 text-sm sm:text-base">
                      {percentage}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {!submitted ? (
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(true);
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="px-4 py-2.5 sm:px-6 sm:py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-xs sm:text-sm whitespace-nowrap"
                >
                  {toCleanUppercase(ui.btnSubmit)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-4 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-black rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <span>🔄</span>
                  <span>{toCleanUppercase(ui.btnNewSet)}</span>
                </button>
              )}
            </div>
          </div>
        </footer>

      </div>
    </Layout>
  );
}
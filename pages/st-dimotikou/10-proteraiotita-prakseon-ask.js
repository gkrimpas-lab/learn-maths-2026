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

const REAL_WORLD_PROBLEMS = {
  el: [
    { name: 'Ο Νίκος', item: 'βιβλία', price: 12, wallet: 50, count: 3, unit: '€' },
    { name: 'Η Μαρία', item: 'τετράδια', price: 4, wallet: 30, count: 5, unit: '€' },
    { name: 'Ο Γιώργος', item: 'εισιτήρια', price: 6, wallet: 40, count: 4, unit: '€' },
    { name: 'Η Ελένη', item: 'χυμούς', price: 2, wallet: 20, count: 6, unit: '€' },
    { name: 'Ο Κώστας', item: 'μπάλες', price: 8, wallet: 60, count: 5, unit: '€' },
    { name: 'Η Δήμητρα', item: 'μαρκαδόρους', price: 3, wallet: 25, count: 4, unit: '€' }
  ],
  en: [
    { name: 'Nick', item: 'books', price: 12, wallet: 50, count: 3, unit: '€' },
    { name: 'Maria', item: 'notebooks', price: 4, wallet: 30, count: 5, unit: '€' },
    { name: 'George', item: 'tickets', price: 6, wallet: 40, count: 4, unit: '€' },
    { name: 'Helen', item: 'juice bottles', price: 2, wallet: 20, count: 6, unit: '€' },
    { name: 'Kostas', item: 'balls', price: 8, wallet: 60, count: 5, unit: '€' },
    { name: 'Dimitra', item: 'markers', price: 3, wallet: 25, count: 4, unit: '€' }
  ]
};

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_prio_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const tickets = 4;
      const ticketPrice = 8;
      const popcorn = 3;
      const popcornPrice = 4;
      const wallet = 50;
      const totalCost = tickets * ticketPrice + popcorn * popcornPrice;
      const change = wallet - totalCost;

      return {
        title: isEn ? 'BUYING TICKETS AND SNACKS' : 'ΑΓΟΡΑ ΕΙΣΙΤΗΡΙΩΝ ΚΑΙ ΣΝΑΚ',
        instruction: isEn ? 'Calculate change in euros (€):' : 'Υπολογίστε τα ρέστα σε ευρώ (€):',
        text: isEn
          ? `A group of friends bought ${tickets} cinema tickets at ${ticketPrice} € each and ${popcorn} buckets of popcorn at ${popcornPrice} € each. They paid with a ${wallet} € note. How much change (€) did they receive?`
          : `Μια παρέα αγόρασε ${tickets} εισιτήρια κινηματογράφου προς ${ticketPrice} € το καθένα και ${popcorn} κουτιά ποπ κορν προς ${popcornPrice} € το καθένα. Πλήρωσαν με χαρτονόμισμα των ${wallet} €. Πόσα ρέστα (€) έλαβαν;`,
        tableData: {
          col1: isEn ? 'Purchases' : 'Αγορές',
          col2: isEn ? 'Cost & Change' : 'Κόστος & Ρέστα',
          r1: [`${tickets} · ${ticketPrice} € ＋ ${popcorn} · ${popcornPrice} €`, isEn ? `Total: ${totalCost} €` : `Σύνολο: ${totalCost} €`],
          r2: [isEn ? `Banknote: ${wallet} €` : `Χαρτονόμισμα: ${wallet} €`, isEn ? `Change: ${change} €` : `Ρέστα: ${change} €`]
        },
        correctVal: change,
        correctStr: String(change),
        explanation: isEn
          ? `Write the numerical expression: ${wallet} － (${tickets} · ${ticketPrice} ＋ ${popcorn} · ${popcornPrice}) ＝ ${wallet} － (${tickets * ticketPrice} ＋ ${popcorn * popcornPrice}) ＝ ${wallet} － ${totalCost} ＝ ${change} €.`
          : `Γράφουμε την αριθμητική παράσταση: ${wallet} － (${tickets} · ${ticketPrice} ＋ ${popcorn} · ${popcornPrice}) ＝ ${wallet} － (${tickets * ticketPrice} ＋ ${popcorn * popcornPrice}) ＝ ${wallet} － ${totalCost} ＝ ${change} €.`
      };
    }
  },
  {
    id: 'p_prio_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const initial = 100;
      const b1 = 15;
      const count1 = 2;
      const b2 = 8;
      const count2 = 4;
      const totalCost = b1 * count1 + b2 * count2;
      const remain = initial - totalCost;

      return {
        title: isEn ? 'CLOTHING STORE PURCHASE' : 'ΑΓΟΡΑ ΕΙΔΩΝ ΕΝΔΥΣΗΣ',
        instruction: isEn ? 'Calculate remaining money in euros (€):' : 'Υπολογίστε το υπόλοιπο ποσό σε ευρώ (€):',
        text: isEn
          ? `From an initial amount of ${initial} €, ${count1} shirts were bought for ${b1} € each and ${count2} caps for ${b2} € each. How many euros (€) remained?`
          : `Από αρχικό ποσό ${initial} € αγοράστηκαν ${count1} μπλούζες προς ${b1} € η καθεμία και ${count2} καπέλα προς ${b2} € το καθένα. Πόσα ευρώ (€) περίσσεψαν;`,
        tableData: {
          col1: isEn ? 'Purchases' : 'Αγορές',
          col2: isEn ? 'Remainder' : 'Υπόλοιπο',
          r1: [`${count1} · ${b1} € ＋ ${count2} · ${b2} €`, isEn ? `Total: ${totalCost} €` : `Σύνολο: ${totalCost} €`],
          r2: [isEn ? `Initial: ${initial} €` : `Αρχικά: ${initial} €`, isEn ? `Remaining: ${remain} €` : `Περίσσεψαν: ${remain} €`]
        },
        correctVal: remain,
        correctStr: String(remain),
        explanation: isEn
          ? `Expression: ${initial} － (${count1} · ${b1} ＋ ${count2} · ${b2}) ＝ ${initial} － (${count1 * b1} ＋ ${count2 * b2}) ＝ ${initial} － ${totalCost} ＝ ${remain} €.`
          : `Παράσταση: ${initial} － (${count1} · ${b1} ＋ ${count2} · ${b2}) ＝ ${initial} － (${count1 * b1} ＋ ${count2 * b2}) ＝ ${initial} － ${totalCost} ＝ ${remain} €.`
      };
    }
  },
  {
    id: 'p_prio_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const notebooks = 5;
      const nbPrice = 3;
      const pens = 4;
      const penPrice = 2;
      const wallet = 30;
      const total = notebooks * nbPrice + pens * penPrice;
      const change = wallet - total;

      return {
        title: isEn ? 'STATIONERY SUPPLIES PURCHASE' : 'ΑΓΟΡΑ ΣΧΟΛΙΚΩΝ ΕΙΔΩΝ',
        instruction: isEn ? 'Calculate change in euros (€):' : 'Υπολογίστε τα ρέστα σε ευρώ (€):',
        text: isEn
          ? `A student bought ${notebooks} notebooks at ${nbPrice} € each and ${pens} pens at ${penPrice} € each. He paid with a ${wallet} € note. How much change (€) did he get back?`
          : `Ένας μαθητής αγόρασε ${notebooks} τετράδια προς ${nbPrice} € το καθένα και ${pens} στυλό προς ${penPrice} € το καθένα. Πλήρωσε με χαρτονόμισμα των ${wallet} €. Πόσα ρέστα (€) έλαβε;`,
        tableData: {
          col1: isEn ? 'Expenses' : 'Έξοδα',
          col2: isEn ? 'Payment & Change' : 'Πληρωμή & Ρέστα',
          r1: [`${notebooks} · ${nbPrice} € ＋ ${pens} · ${penPrice} €`, isEn ? `Total: ${total} €` : `Σύνολο: ${total} €`],
          r2: [isEn ? `Banknote: ${wallet} €` : `Χαρτονόμισμα: ${wallet} €`, isEn ? `Change: ${change} €` : `Ρέστα: ${change} €`]
        },
        correctVal: change,
        correctStr: String(change),
        explanation: isEn
          ? `Expression: ${wallet} － (${notebooks} · ${nbPrice} ＋ ${pens} · ${penPrice}) ＝ ${wallet} － ${total} ＝ ${change} €.`
          : `Παράσταση: ${wallet} － (${notebooks} · ${nbPrice} ＋ ${pens} · ${penPrice}) ＝ ${wallet} － ${total} ＝ ${change} €.`
      };
    }
  },
  {
    id: 'p_prio_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const totalStudents = 60;
      const boysTeams = 4;
      const perBoyTeam = 6;
      const totalBoys = boysTeams * perBoyTeam;
      const girls = totalStudents - totalBoys;

      return {
        title: isEn ? 'COUNTING STUDENTS IN TEAMS' : 'ΚΑΤΑΜΕΤΡΗΣΗ ΜΑΘΗΤΩΝ ΣΕ ΟΜΑΔΕΣ',
        instruction: isEn ? 'Calculate the number of girls:' : 'Υπολογίστε το πλήθος των κοριτσιών:',
        text: isEn
          ? `There are ${totalStudents} students in the schoolyard. There are ${boysTeams} teams of boys with ${perBoyTeam} boys each, and the rest are girls. How many girls are there?`
          : `Στην αυλή βρίσκονται ${totalStudents} μαθητές. Σχηματίστηκαν ${boysTeams} ομάδες αγοριών με ${perBoyTeam} αγόρια η καθεμία και οι υπόλοιποι μαθητές είναι κορίτσια. Πόσα είναι τα κορίτσια;`,
        tableData: {
          col1: isEn ? 'Total Students' : 'Σύνολο Μαθητών',
          col2: isEn ? 'Boys' : 'Αγόρια',
          r1: [isEn ? `${totalStudents} students` : `${totalStudents} μαθητές`, `${boysTeams} · ${perBoyTeam} ＝ ${totalBoys} ${isEn ? 'boys' : 'αγόρια'}`],
          r2: [isEn ? 'Subtraction' : 'Αφαίρεση', `${girls} ${isEn ? 'girls' : 'κορίτσια'}`]
        },
        correctVal: girls,
        correctStr: String(girls),
        explanation: isEn
          ? `Expression: ${totalStudents} － (${boysTeams} · ${perBoyTeam}) ＝ ${totalStudents} － ${totalBoys} ＝ ${girls} girls.`
          : `Παράσταση: ${totalStudents} － (${boysTeams} · ${perBoyTeam}) ＝ ${totalStudents} － ${totalBoys} ＝ ${girls} κορίτσια.`
      };
    }
  },
  {
    id: 'p_prio_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const totalCrates = 8;
      const perCrate = 15;
      const initialWeight = totalCrates * perCrate;
      const sold = 45;
      const remain = initialWeight - sold;

      return {
        title: isEn ? 'FRUIT WAREHOUSE STOCK' : 'ΑΠΟΘΗΚΗ ΦΡΟΥΤΩΝ',
        instruction: isEn ? 'Calculate remaining kilograms (integer):' : 'Υπολογίστε τα κιλά που απέμειναν (ακέραιος):',
        text: isEn
          ? `A grower had ${totalCrates} crates with ${perCrate} kg of oranges each. He sold ${sold} kg. How many kilograms (kg) of oranges remained?`
          : `Ένας παραγωγός είχε ${totalCrates} τελάρα με ${perCrate} kg πορτοκάλια το καθένα. Πούλησε ${sold} kg. Πόσα κιλά (kg) πορτοκάλια του έμειναν;`,
        tableData: {
          col1: isEn ? 'Initial Weight' : 'Αρχικό Βάρος',
          col2: isEn ? 'Sales & Stock' : 'Πώληση & Υπόλοιπο',
          r1: [`${totalCrates} · ${perCrate} kg`, `${sold} kg ${isEn ? 'sold' : 'πωλήθηκαν'}`],
          r2: [isEn ? 'Remaining' : 'Υπόλοιπο', `${remain} kg`]
        },
        correctVal: remain,
        correctStr: String(remain),
        explanation: isEn
          ? `Expression: (${totalCrates} · ${perCrate}) － ${sold} ＝ ${initialWeight} － ${sold} ＝ ${remain} kg.`
          : `Παράσταση: (${totalCrates} · ${perCrate}) － ${sold} ＝ ${initialWeight} － ${sold} ＝ ${remain} kg.`
      };
    }
  },
  {
    id: 'p_prio_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const hours = 5;
      const perHour = 12;
      const bonus = 20;
      const wages = hours * perHour;
      const total = wages + bonus;

      return {
        title: isEn ? 'LABOR PAYMENT CALCULATION' : 'ΑΜΟΙΒΗ ΕΡΓΑΣΙΑΣ',
        instruction: isEn ? 'Calculate total wage in euros (€):' : 'Υπολογίστε τη συνολική αμοιβή σε ευρώ (€):',
        text: isEn
          ? `A technician worked for ${hours} hours at an hourly rate of ${perHour} € and received an additional travel bonus of ${bonus} €. What was his total wage in euros (€)?`
          : `Ένας τεχνικός εργάστηκε ${hours} ώρες με ωρομίσθιο ${perHour} € και έλαβε επιπλέον επίδομα μετακίνησης ${bonus} €. Ποια ήταν η συνολική αμοιβή του σε ευρώ (€);`,
        tableData: {
          col1: isEn ? 'Hourly Wages' : 'Ωρομίσθιο',
          col2: isEn ? 'Bonus & Total' : 'Επίδομα & Σύνολο',
          r1: [`${hours} · ${perHour} €`, `${bonus} €`],
          r2: [isEn ? 'Total' : 'Σύνολο', `${total} €`]
        },
        correctVal: total,
        correctStr: String(total),
        explanation: isEn
          ? `Expression: (${hours} · ${perHour}) ＋ ${bonus} ＝ ${wages} ＋ ${bonus} ＝ ${total} €.`
          : `Παράσταση: (${hours} · ${perHour}) ＋ ${bonus} ＝ ${wages} ＋ ${bonus} ＝ ${total} €.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_prio_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const crates = 5;
      const applesPerCrate = 20;
      const rotten = 8;
      const bags = 6;
      const initialTotal = crates * applesPerCrate;
      const goodApples = initialTotal - rotten;
      const applesPerBag = goodApples / bags;
      const unit = isEn ? 'apples' : 'μήλα';
      const correctStr = `${applesPerBag} ${unit}`;
      const fake1 = `${applesPerBag + 4} ${unit}`;
      const fake2 = `${Math.max(1, applesPerBag - 3)} ${unit}`;
      const fake3 = `${applesPerBag + 2} ${unit}`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'PACKING APPLES IN BAGS' : 'ΜΟΙΡΑΣΜΑ ΜΗΛΩΝ ΣΕ ΣΑΚΟΥΛΕΣ',
        instruction: isEn ? 'Select how many apples are placed in each bag:' : 'Επιλέξτε πόσα μήλα μπήκαν σε κάθε σακούλα:',
        text: isEn
          ? `A grocer had ${crates} crates with ${applesPerCrate} apples each. He discarded ${rotten} spoiled apples and shared the remainder equally into ${bags} bags. How many apples did he put in each bag?`
          : `Ένας μανάβης είχε ${crates} τελάρα με ${applesPerCrate} μήλα το καθένα. Αφαίρεσε ${rotten} χαλασμένα μήλα και τα υπόλοιπα τα μοίρασε εξίσου σε ${bags} σακούλες. Πόσα μήλα έβαλε σε κάθε σακούλα;`,
        tableData: {
          col1: isEn ? 'Total & Spoiled' : 'Συνολικά & Χαλασμένα',
          col2: isEn ? 'Distribution' : 'Μοίρασμα',
          r1: [`(${crates} · ${applesPerCrate}) － ${rotten}`, `${goodApples} ${isEn ? 'good apples' : 'καλά μήλα'}`],
          r2: [`: ${bags} ${isEn ? 'bags' : 'σακούλες'}`, `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Form the expression: (${crates} · ${applesPerCrate} － ${rotten}) : ${bags} ＝ (${initialTotal} － ${rotten}) : ${bags} ＝ ${goodApples} : ${bags} ＝ ${correctStr}.`
          : `Φτιάχνουμε την παράσταση: (${crates} · ${applesPerCrate} － ${rotten}) : ${bags} ＝ (${initialTotal} － ${rotten}) : ${bags} ＝ ${goodApples} : ${bags} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_prio_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const adultTickets = 3;
      const adultPrice = 10;
      const kidTickets = 4;
      const kidPrice = 5;
      const wallet = 60;
      const adultCost = adultTickets * adultPrice;
      const kidCost = kidTickets * kidPrice;
      const totalCost = adultCost + kidCost;
      const change = wallet - totalCost;
      const correctStr = `${change} €`;
      const fake1 = `${change + 5} €`;
      const fake2 = `${Math.max(1, change - 3)} €`;
      const fake3 = `${change + 10} €`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'ADMISSION TICKETS & CHANGE' : 'ΕΙΣΙΤΗΡΙΑ ΘΕΑΜΑΤΟΣ & ΡΕΣΤΑ',
        instruction: isEn ? 'Select the correct change in euros (€):' : 'Επιλέξτε το σωστό ποσό ρέστων σε ευρώ (€):',
        text: isEn
          ? `A family purchased ${adultTickets} adult tickets at ${adultPrice} € each and ${kidTickets} child tickets at ${kidPrice} € each. They paid with a ${wallet} € banknote. How much change (€) did they receive?`
          : `Μια οικογένεια αγόρασε ${adultTickets} εισιτήρια ενηλίκων προς ${adultPrice} € το καθένα και ${kidTickets} παιδικά εισιτήρια προς ${kidPrice} € το καθένα. Πλήρωσε με χαρτονόμισμα των ${wallet} €. Πόσα ρέστα (€) έλαβε;`,
        tableData: {
          col1: isEn ? 'Tickets' : 'Εισιτήρια',
          col2: isEn ? 'Payment & Change' : 'Πληρωμή & Ρέστα',
          r1: [`${adultTickets} · ${adultPrice} € ＋ ${kidTickets} · ${kidPrice} €`, isEn ? `Total: ${totalCost} €` : `Σύνολο: ${totalCost} €`],
          r2: [isEn ? `Banknote: ${wallet} €` : `Χαρτονόμισμα: ${wallet} €`, `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Expression: ${wallet} － (${adultTickets} · ${adultPrice} ＋ ${kidTickets} · ${kidPrice}) ＝ ${wallet} － (${adultCost} ＋ ${kidCost}) ＝ ${wallet} － ${totalCost} ＝ ${correctStr}.`
          : `Παράσταση: ${wallet} － (${adultTickets} · ${adultPrice} ＋ ${kidTickets} · ${kidPrice}) ＝ ${wallet} － (${adultCost} ＋ ${kidCost}) ＝ ${wallet} － ${totalCost} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_prio_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const rows = 6;
      const perRow = 15;
      const damaged = 10;
      const boxes = 8;
      const initialTiles = rows * perRow;
      const goodTiles = initialTiles - damaged;
      const perBox = goodTiles / boxes;
      const unit = isEn ? 'tiles' : 'πλακάκια';
      const correctStr = `${perBox} ${unit}`;
      const fake1 = `${perBox + 2} ${unit}`;
      const fake2 = `${Math.max(1, perBox - 2)} ${unit}`;
      const fake3 = `${perBox + 5} ${unit}`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'PACKAGING INTACT FLOOR TILES' : 'ΣΥΣΚΕΥΑΣΙΑ ΑΚΕΡΑΙΩΝ ΠΛΑΚΙΔΙΩΝ',
        instruction: isEn ? 'Select how many tiles are placed in each box:' : 'Επιλέξτε πόσα πλακάκια τοποθετούνται σε κάθε κουτί:',
        text: isEn
          ? `A builder had ${rows} rows of floor tiles with ${perRow} tiles in each row. He removed ${damaged} broken tiles and shared the rest equally into ${boxes} boxes. How many tiles did he put in each box?`
          : `Ένας εργάτης είχε ${rows} σειρές πλακιδίων με ${perRow} πλακάκια η καθεμία. Αφαίρεσε ${damaged} σπασμένα και τα υπόλοιπα τα μοίρασε ισόποσα σε ${boxes} κουτιά. Πόσα πλακάκια έβαλε σε κάθε κουτί;`,
        tableData: {
          col1: isEn ? 'Total & Damaged' : 'Σύνολο & Σπασμένα',
          col2: isEn ? 'Partitioning' : 'Μοίρασμα',
          r1: [`(${rows} · ${perRow}) － ${damaged}`, `${goodTiles} ${isEn ? 'intact tiles' : 'γερά πλακάκια'}`],
          r2: [`: ${boxes} ${isEn ? 'boxes' : 'κουτιά'}`, `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Expression: (${rows} · ${perRow} － ${damaged}) : ${boxes} ＝ (${initialTiles} － ${damaged}) : ${boxes} ＝ ${goodTiles} : ${boxes} ＝ ${correctStr}.`
          : `Παράσταση: (${rows} · ${perRow} － ${damaged}) : ${boxes} ＝ (${initialTiles} － ${damaged}) : ${boxes} ＝ ${goodTiles} : ${boxes} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_prio_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const pack1 = 4;
      const price1 = 12;
      const pack2 = 5;
      const price2 = 6;
      const budget = 100;
      const cost1 = pack1 * price1;
      const cost2 = pack2 * price2;
      const total = cost1 + cost2;
      const remain = budget - total;
      const correctStr = `${remain} €`;
      const fake1 = `${remain + 10} €`;
      const fake2 = `${Math.max(2, remain - 8)} €`;
      const fake3 = `${remain + 15} €`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'BUYING BOOKS AND NOTEBOOKS' : 'ΑΓΟΡΑ ΒΙΒΛΙΩΝ ΚΑΙ ΤΕΤΡΑΔΙΩΝ',
        instruction: isEn ? 'Select how many euros (€) remained:' : 'Επιλέξτε πόσα ευρώ (€) περίσσεψαν:',
        text: isEn
          ? `From an initial budget of ${budget} €, ${pack1} books were bought at ${price1} € each and ${pack2} packs of notebooks at ${price2} € each. How many euros (€) remained?`
          : `Από αρχικό ποσό ${budget} € αγοράστηκαν ${pack1} βιβλία προς ${price1} € το καθένα και ${pack2} πακέτα τετραδίων προς ${price2} € το καθένα. Πόσα ευρώ (€) περίσσεψαν;`,
        tableData: {
          col1: isEn ? 'Purchases' : 'Αγορές',
          col2: isEn ? 'Remainder' : 'Υπόλοιπο',
          r1: [`${pack1} · ${price1} € ＋ ${pack2} · ${price2} €`, isEn ? `Total: ${total} €` : `Σύνολο: ${total} €`],
          r2: [isEn ? `Initial: ${budget} €` : `Αρχικά: ${budget} €`, `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Expression: ${budget} － (${pack1} · ${price1} ＋ ${pack2} · ${price2}) ＝ ${budget} － (${cost1} ＋ ${cost2}) ＝ ${budget} － ${total} ＝ ${correctStr}.`
          : `Παράσταση: ${budget} － (${pack1} · ${price1} ＋ ${pack2} · ${price2}) ＝ ${budget} － (${cost1} ＋ ${cost2}) ＝ ${budget} － ${total} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_prio_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const barrels = 4;
      const lPerBarrel = 50;
      const waste = 20;
      const cans = 9;
      const initialOil = barrels * lPerBarrel;
      const goodOil = initialOil - waste;
      const perCan = goodOil / cans;
      const correctStr = `${perCan} L`;
      const fake1 = `${perCan + 2} L`;
      const fake2 = `${Math.max(1, perCan - 2)} L`;
      const fake3 = `${perCan + 5} L`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'BOTTLING OLIVE OIL' : 'ΕΜΦΙΑΛΩΣΗ ΕΛΑΙΟΛΑΔΟΥ',
        instruction: isEn ? 'Select how many liters (L) are filled in each can:' : 'Επιλέξτε πόσα λίτρα (L) λάδι μπήκαν σε κάθε δοχείο:',
        text: isEn
          ? `A producer had ${barrels} barrels with ${lPerBarrel} L of olive oil each. He removed ${waste} L of unfit oil and shared the remainder equally into ${cans} cans. How many liters (L) were poured into each can?`
          : `Ένας παραγωγός είχε ${barrels} βαρέλια με ${lPerBarrel} L λάδι το καθένα. Αφαίρεσε ${waste} L ακατάλληλο λάδι και το υπόλοιπο λάδι το μοίρασε ισόποσα σε ${cans} δοχεία. Πόσα λίτρα (L) λάδι μπήκαν σε κάθε δοχείο;`,
        tableData: {
          col1: isEn ? 'Total Oil' : 'Συνολικό Λάδι',
          col2: isEn ? 'Partitioning' : 'Μοίρασμα',
          r1: [`(${barrels} · ${lPerBarrel}) － ${waste}`, `${goodOil} L ${isEn ? 'pure oil' : 'καθαρό'}`],
          r2: [`: ${cans} ${isEn ? 'cans' : 'δοχεία'}`, `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Expression: (${barrels} · ${lPerBarrel} － ${waste}) : ${cans} ＝ (${initialOil} － ${waste}) : ${cans} ＝ ${goodOil} : ${cans} ＝ ${correctStr}.`
          : `Παράσταση: (${barrels} · ${lPerBarrel} － ${waste}) : ${cans} ＝ (${initialOil} － ${waste}) : ${cans} ＝ ${goodOil} : ${cans} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_prio_hard_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const boxes = 6;
      const kgPerBox = 12;
      const damagedKg = 8;
      const bags = 8;
      const initialFlour = boxes * kgPerBox;
      const goodKg = initialFlour - damagedKg;
      const perBag = goodKg / bags;
      const correctStr = `${perBag} kg`;
      const fake1 = `${perBag + 1} kg`;
      const fake2 = `${Math.max(1, perBag - 1)} kg`;
      const fake3 = `${perBag + 3} kg`;

      const options = makeUniqueOptions(correctStr, [fake1, fake2, fake3]);

      return {
        title: isEn ? 'PACKING FLOUR INTO SACKS' : 'ΣΥΣΚΕΥΑΣΙΑ ΑΛΕΥΡΙΟΥ ΣΕ ΣΑΚΟΥΛΕΣ',
        instruction: isEn ? 'Select how many kilograms (kg) each sack holds:' : 'Επιλέξτε πόσα κιλά (kg) αλεύρι περιέχει κάθε σακούλα:',
        text: isEn
          ? `A baker had ${boxes} boxes with ${kgPerBox} kg of flour each. He discarded ${damagedKg} kg of spoiled flour and divided the rest equally into ${bags} sacks. How many kilograms (kg) of flour does each sack contain?`
          : `Ένας αρτοποιός είχε ${boxes} κιβώτια με ${kgPerBox} kg αλεύρι το καθένα. Αφαίρεσε ${damagedKg} kg ακατάλληλο αλεύρι και το υπόλοιπο το μοίρασε ισόποσα σε ${bags} σακούλες. Πόσα κιλά (kg) αλεύρι περιέχει κάθε σακούλα;`,
        tableData: {
          col1: isEn ? 'Total & Spoiled' : 'Σύνολο & Ακατάλληλο',
          col2: isEn ? 'Partitioning' : 'Μοίρασμα',
          r1: [`(${boxes} · ${kgPerBox}) － ${damagedKg}`, `${goodKg} kg ${isEn ? 'good flour' : 'καλό'}`],
          r2: [`: ${bags} ${isEn ? 'sacks' : 'σακούλες'}`, `${correctStr}`]
        },
        options,
        correctText: correctStr,
        explanation: isEn
          ? `Expression: (${boxes} · ${kgPerBox} － ${damagedKg}) : ${bags} ＝ (${initialFlour} － ${damagedKg}) : ${bags} ＝ ${goodKg} : ${bags} ＝ ${correctStr}.`
          : `Παράσταση: (${boxes} · ${kgPerBox} － ${damagedKg}) : ${bags} ＝ (${initialFlour} － ${damagedKg}) : ${bags} ＝ ${goodKg} : ${bags} ＝ ${correctStr}.`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const qList = [];
  const itemsPool = REAL_WORLD_PROBLEMS[locale] || REAL_WORLD_PROBLEMS.el;
  const shuffledProblems = shuffle(itemsPool);

  // Q1 (Input): Απλή παράσταση χωρίς παρενθέσεις (α ＋ β · γ)
  {
    const q1A = randInt(10, 30);
    const q1B = randInt(2, 6);
    const q1C = randInt(3, 8);
    const q1Prod = q1B * q1C;
    const q1Answer = q1A + q1Prod;
    const q1Prompt = `${q1A} ＋ ${q1B} · ${q1C}`;

    qList.push({
      id: 1,
      type: 'integer_input',
      title: isEn ? 'QUESTION 1 • SIMPLE EXPRESSION' : 'ΕΡΩΤΗΣΗ 1 • ΑΠΛΗ ΠΑΡΑΣΤΑΣΗ',
      instruction: isEn ? 'Calculate the value observing precedence (integer):' : 'Υπολογίστε την τιμή της παράστασης τηρώντας την προτεραιότητα (ακέραιος):',
      prompt: isEn ? `Calculate the expression value: ${q1Prompt}:` : `Υπολογίστε την τιμή της παράστασης: ${q1Prompt};`,
      correctVal: q1Answer,
      correctStr: String(q1Answer),
      explanation: isEn
        ? `First perform multiplication: ${q1B} · ${q1C} ＝ ${q1Prod}. Then addition: ${q1A} ＋ ${q1Prod} ＝ ${q1Answer}.`
        : `Πρώτα εκτελούμε τον πολλαπλασιασμό: ${q1B} · ${q1C} ＝ ${q1Prod}. Στη συνέχεια την πρόσθεση: ${q1A} ＋ ${q1Prod} ＝ ${q1Answer}.`
    });
  }

  // Q2 (Input): Παράσταση με παρενθέσεις (α － β) · γ
  {
    const q2A = randInt(15, 30);
    const q2B = randInt(2, q2A - 5);
    const q2C = randInt(2, 6);
    const q2Diff = q2A - q2B;
    const q2Answer = q2Diff * q2C;
    const q2Prompt = `(${q2A} － ${q2B}) · ${q2C}`;

    qList.push({
      id: 2,
      type: 'integer_input',
      title: isEn ? 'QUESTION 2 • PARENTHESIS EXPRESSION' : 'ΕΡΩΤΗΣΗ 2 • ΠΑΡΑΣΤΑΣΗ ΜΕ ΠΑΡΕΝΘΕΣΗ',
      instruction: isEn ? 'Calculate parentheses first (integer):' : 'Υπολογίστε πρώτα την παρένθεση (ακέραιος):',
      prompt: isEn ? `Calculate the expression value: ${q2Prompt}:` : `Υπολογίστε την τιμή της παράστασης: ${q2Prompt};`,
      correctVal: q2Answer,
      correctStr: String(q2Answer),
      explanation: isEn
        ? `First evaluate the parenthesis: (${q2A} － ${q2B}) ＝ ${q2Diff}. Then multiply: ${q2Diff} · ${q2C} ＝ ${q2Answer}.`
        : `Πρώτα υπολογίζουμε την παρένθεση: (${q2A} － ${q2B}) ＝ ${q2Diff}. Μετά εκτελούμε τον πολλαπλασιασμό: ${q2Diff} · ${q2C} ＝ ${q2Answer}.`
    });
  }

  // Q3 (MCQ): Αναγνώριση πρώτης πράξης
  {
    const q3A = randInt(20, 50);
    const q3B = randInt(3, 8);
    const q3C = randInt(2, 5);
    const q3D = randInt(1, 10);
    const q3ExprStr = `${q3A} － ${q3B} · ${q3C} ＋ ${q3D}`;
    const q3Correct = isEn ? `Multiplication (${q3B} · ${q3C})` : `Ο πολλαπλασιασμός (${q3B} · ${q3C})`;

    const wrong1 = isEn ? `Subtraction (${q3A} － ${q3B})` : `Η αφαίρεση (${q3A} － ${q3B})`;
    const wrong2 = isEn ? `Addition (${q3C} ＋ ${q3D})` : `Η πρόσθεση (${q3C} ＋ ${q3D})`;
    const wrong3 = isEn ? 'All operations together' : 'Όλες οι πράξεις μαζί';

    const options = makeUniqueOptions(q3Correct, [wrong1, wrong2, wrong3]);

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • IDENTIFYING FIRST OPERATION' : 'ΕΡΩΤΗΣΗ 3 • ΑΝΑΓΝΩΡΙΣΗ ΠΡΩΤΗΣ ΠΡΑΞΗΣ',
      instruction: isEn ? 'Select which operation must be calculated first:' : 'Επιλέξτε ποια πράξη πρέπει να εκτελεστεί πρώτη:',
      prompt: isEn ? `Which operation must be computed FIRST in expression: ${q3ExprStr}?` : `Ποια πράξη πρέπει να εκτελέσουμε ΠΡΩΤΑ στην παράσταση: ${q3ExprStr};`,
      options,
      correctText: q3Correct,
      explanation: isEn
        ? `Multiplication takes precedence over addition and subtraction. Therefore we start with ${q3B} · ${q3C}.`
        : `Ο πολλαπλασιασμός έχει προτεραιότητα έναντι της πρόσθεσης και της αφαίρεσης. Άρα ξεκινάμε με το ${q3B} · ${q3C}.`
    });
  }

  // Q4 (MCQ): Τιμή παράστασης με πολλαπλές πράξεις
  {
    const q4B = randInt(2, 5);
    const q4C = randInt(3, 7);
    const q4D = randInt(2, 6);
    const q4SubTotal = q4C + q4D;
    const q4Prod = q4B * q4SubTotal;
    const q4A = q4Prod + randInt(5, 20);
    const q4Answer = q4A - q4Prod;
    const q4ExprStr = `${q4A} － ${q4B} · (${q4C} ＋ ${q4D})`;
    const correctStr = String(q4Answer);

    const w1 = String(q4Answer + 10);
    const w2 = String((q4A - q4B) * q4SubTotal);
    const w3 = String(Math.max(1, q4Answer - 4));

    const options = makeUniqueOptions(correctStr, [w1, w2, w3]);

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • MULTIPLE OPERATIONS' : 'ΕΡΩΤΗΣΗ 4 • ΠΟΛΛΑΠΛΕΣ ΠΡΑΞΕΙΣ',
      instruction: isEn ? 'Calculate final value of the expression:' : 'Υπολογίστε την τελική τιμή της παράστασης:',
      prompt: isEn ? `Calculate the expression value: ${q4ExprStr}:` : `Υπολογίστε την τιμή της παράστασης: ${q4ExprStr};`,
      options,
      correctText: correctStr,
      explanation: isEn
        ? `1) Parenthesis: ${q4C} ＋ ${q4D} ＝ ${q4SubTotal}. 2) Multiplication: ${q4B} · ${q4SubTotal} ＝ ${q4Prod}. 3) Subtraction: ${q4A} － ${q4Prod} ＝ ${q4Answer}.`
        : `1) Παρένθεση: ${q4C} ＋ ${q4D} ＝ ${q4SubTotal}. 2) Πολλαπλασιασμός: ${q4B} · ${q4SubTotal} ＝ ${q4Prod}. 3) Αφαίρεση: ${q4A} － ${q4Prod} ＝ ${q4Answer}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας Προτεραιότητας
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? 'In a numerical expression without parentheses, we perform multiplications and divisions before additions and subtractions.'
          : 'In a numerical expression without parentheses, we always perform additions and subtractions first.')
      : (q5IsTrue
          ? 'Σε μια αριθμητική παράσταση χωρίς παρενθέσεις, εκτελούμε τους πολλαπλασιασμούς και τις διαιρέσεις πριν από τις προσθέσεις και τις αφαιρέσεις.'
          : 'Σε μια αριθμητική παράσταση χωρίς παρενθέσεις, εκτελούμε πάντα τις προσθέσεις και τις αφαιρέσεις πρώτα.');

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
      title: isEn ? 'QUESTION 5 • PRECEDENCE RULE' : 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? 'Correct! Multiplications and divisions always precede additions and subtractions.'
            : 'False! Additions and subtractions are executed last, unless enclosed inside parentheses.')
        : (q5IsTrue
            ? 'Σωστό! Οι πολλαπλασιασμοί και οι διαιρέσεις προηγούνται πάντα των προσθέσεων και των αφαιρέσεων.'
            : 'Λάθος! Οι προσθέσεις και οι αφαιρέσεις εκτελούνται τελευταίες, εκτός εάν βρίσκονται μέσα σε παρενθέσεις.')
    });
  }

  // Q6 (MCQ): True / False - Κανόνας Αριστερά ➔ Δεξιά
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? 'When an expression contains only additions and subtractions, we calculate them in order from left to right.'
          : 'When an expression contains only additions and subtractions, we always compute all additions first.')
      : (q6IsTrue
          ? 'Όταν σε μια παράσταση υπάρχουν μόνο προσθέσεις και αφαιρέσεις, τις εκτελούμε με τη σειρά από αριστερά προς τα δεξιά.'
          : 'Όταν σε μια παράσταση υπάρχουν μόνο προσθέσεις και αφαιρέσεις, κάνουμε πάντα πρώτα όλες τις προσθέσεις.');

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
      title: isEn ? 'QUESTION 6 • LEFT-TO-RIGHT RULE' : 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΑΡΙΣΤΕΡΑ ΠΡΟΣ ΔΕΞΙΑ',
      instruction: isEn ? 'Classify statement as True or False:' : 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? 'Correct! Operations sharing equal precedence are executed sequentially from left to right.'
            : 'False! Addition does not precede subtraction. They are evaluated in order from left to right.')
        : (q6IsTrue
            ? 'Σωστό! Πράξεις με την ίδια προτεραιότητα εκτελούνται διαδοχικά από τα αριστερά προς τα δεξιά.'
            : 'Λάθος! Δεν προηγείται η πρόσθεση έναντι της αφαίρεσης. Εκτελούνται με τη σειρά που εμφανίζονται από αριστερά προς τα δεξιά.')
    });
  }

  // Q7 (Input): Πρόβλημα Καθημερινότητας (α － β · γ)
  {
    const p = shuffledProblems[0];
    const expense = p.count * p.price;
    const q7Answer = p.wallet - expense;
    const q7Prompt = isEn
      ? `${p.name} had ${p.wallet} €. He bought ${p.count} ${p.item} costing ${p.price} € each. How much change (€) did he get back?`
      : `${p.name} είχε ${p.wallet} €. Αγόρασε ${p.count} ${p.item} που κοστίζουν ${p.price} € το καθένα. Πόσα ρέστα (€) έλαβε;`;

    qList.push({
      id: 7,
      type: 'integer_input',
      title: isEn ? 'QUESTION 7 • REAL-WORLD PROBLEM' : 'ΕΡΩΤΗΣΗ 7 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: isEn ? 'Calculate change in euros (€):' : 'Υπολογίστε το ποσό των ρέστων σε ευρώ (€):',
      prompt: q7Prompt,
      correctVal: q7Answer,
      correctStr: String(q7Answer),
      explanation: isEn
        ? `Form the numerical expression: ${p.wallet} － ${p.count} · ${p.price} ＝ ${p.wallet} － ${expense} ＝ ${q7Answer} €.`
        : `Φτιάχνουμε την αριθμητική παράσταση: ${p.wallet} － ${p.count} · ${p.price} ＝ ${p.wallet} － ${expense} ＝ ${q7Answer} €.`
    });
  }

  // Q8 (MCQ): Αναγνώριση 1ου σωστού βήματος
  {
    const q8A = randInt(30, 60);
    const q8B = randInt(2, 5);
    const q8C = randInt(3, 8);
    const q8D = randInt(2, 4);
    const q8ExprStr = `${q8A} － (${q8B} ＋ ${q8C}) · ${q8D}`;
    const q8CorrectStep = `${q8A} － ${q8B + q8C} · ${q8D}`;

    const w1 = `${q8A - q8B} ＋ ${q8C} · ${q8D}`;
    const w2 = `${q8A} － (${q8B} ＋ ${q8C * q8D})`;
    const w3 = `${q8A} － ${q8B} ＋ ${q8C * q8D}`;

    const options = makeUniqueOptions(q8CorrectStep, [w1, w2, w3]);

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • IDENTIFYING STEP 1' : 'ΕΡΩΤΗΣΗ 8 • ΑΝΑΓΝΩΡΙΣΗ 1ΟΥ ΒΗΜΑΤΟΣ',
      instruction: isEn ? 'Select the correct expression form after step 1:' : 'Επιλέξτε τη σωστή μορφή της παράστασης μετά το 1ο βήμα:',
      prompt: isEn ? `What is the correct 1st step to solve the expression: ${q8ExprStr}?` : `Ποιο είναι το σωστό 1ο βήμα για τη λύση της παράστασης: ${q8ExprStr};`,
      options,
      correctText: q8CorrectStep,
      explanation: isEn
        ? `First evaluate the parenthesis (${q8B} ＋ ${q8C} ＝ ${q8B + q8C}), yielding: ${q8CorrectStep}.`
        : `Υπολογίζουμε πρώτα την παρένθεση (${q8B} ＋ ${q8C} ＝ ${q8B + q8C}), οπότε η νέα μορφή είναι: ${q8CorrectStep}.`
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
    pageTitle: "Ασκήσεις: Προτεραιότητα Πράξεων - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές ασκήσεις και προβλήματα στην προτεραιότητα των πράξεων και τις αριθμητικές παραστάσεις για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 10 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Προτεραιότητα Πράξεων",
    heroDesc: "10 δυναμικές δραστηριότητες με αριθμητικές παραστάσεις, παρενθέσεις, αναγνώριση πρώτης πράξης και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.",
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
    pageTitle: "Exercises: Order of Operations - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems on the order of operations and numerical expressions for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "CHAPTER 10 • GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Order of Operations",
    heroDesc: "10 dynamic activities covering numerical expressions, parentheses, operator hierarchy, and real-world word problems.",
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

export default function ProteraiotitaPrakseonExercisesPage() {
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
    let sanitized = rawValue.replace(/[^0-9-]/g, '');
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
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/10-proteraiotita-prakseon"
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
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500 font-medium break-words [overflow-wrap:anywhere]">
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
                {isSubmitted ? t.scoreLabel : t.answeredLabel}
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {isSubmitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-8">
                <span className="text-xs text-slate-400 font-semibold block">
                  {t.pctLabel}
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
                {t.btnCheckBar}
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation cursor-pointer"
              >
                <span>{t.btnNewSet}</span>
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}
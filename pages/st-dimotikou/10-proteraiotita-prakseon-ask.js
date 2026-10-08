// pages/st-dimotikou/10-proteraiotita-prakseon-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Τυχαίος ακέραιος στο [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ανακάτεμα πίνακα
function shuffle(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Μορφοποίηση αριθμού με τελείες χιλιάδων
function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return Number(num).toLocaleString('el-GR');
}

// Πλήρης δεξαμενή θεματικών σεναρίων καθημερινότητας
const REAL_WORLD_PROBLEMS = [
  { name: 'Ο Νίκος', item: 'βιβλία', price: 12, wallet: 50, count: 3, unit: '€' },
  { name: 'Η Μαρία', item: 'τετράδια', price: 4, wallet: 30, count: 5, unit: '€' },
  { name: 'Ο Γιώργος', item: 'εισιτήρια', price: 6, wallet: 40, count: 4, unit: '€' },
  { name: 'Η Ελένη', item: 'χυμούς', price: 2, wallet: 20, count: 6, unit: '€' },
  { name: 'Ο Κώστας', item: 'μπάλες', price: 8, wallet: 60, count: 5, unit: '€' },
  { name: 'Η Δήμητρα', item: 'μαρκαδόρους', price: 3, wallet: 25, count: 4, unit: '€' }
];

// Διευρυμένη δεξαμενή προβλημάτων για την Ερώτηση 9 (Input)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_prio_std_1',
    generate: () => {
      const tickets = 4;
      const ticketPrice = 8;
      const popcorn = 3;
      const popcornPrice = 4;
      const wallet = 50;
      const totalCost = tickets * ticketPrice + popcorn * popcornPrice;
      const change = wallet - totalCost;
      return {
        title: 'ΑΓΟΡΑ ΕΙΣΙΤΗΡΙΩΝ ΚΑΙ ΣΝΑΚ',
        instruction: 'Υπολογίστε τα ρέστα σε ευρώ (€):',
        text: `Μια παρέα αγόρασε ${tickets} εισιτήρια κινηματογράφου προς ${ticketPrice} € το καθένα και ${popcorn} κουτιά ποπ κορν προς ${popcornPrice} € το καθένα. Πλήρωσαν με χαρτονόμισμα των ${wallet} €. Πόσα ρέστα (€) έλαβαν;`,
        tableData: { col1: 'Αγορές', col2: 'Κόστος & Ρέστα', r1: [`${tickets} · ${ticketPrice} € ＋ ${popcorn} · ${popcornPrice} €`, `Σύνολο: ${totalCost} €`], r2: [`Χαρτονόμισμα: ${wallet} €`, `Ρέστα: ${change} €`] },
        correctVal: change,
        correctStr: String(change),
        explanation: `Γράφουμε την αριθμητική παράσταση: ${wallet} － (${tickets} · ${ticketPrice} ＋ ${popcorn} · ${popcornPrice}) ＝ ${wallet} － (${tickets * ticketPrice} ＋ ${popcorn * popcornPrice}) ＝ ${wallet} － ${totalCost} ＝ ${change} €.`
      };
    }
  },
  {
    id: 'p_prio_std_2',
    generate: () => {
      const initial = 100;
      const b1 = 15;
      const count1 = 2;
      const b2 = 8;
      const count2 = 4;
      const totalCost = b1 * count1 + b2 * count2;
      const remain = initial - totalCost;
      return {
        title: 'ΑΓΟΡΑ ΕΙΔΩΝ ΕΝΔΥΣΗΣ',
        instruction: 'Υπολογίστε το υπόλοιπο ποσό σε ευρώ (€):',
        text: `Από αρχικό ποσό ${initial} € αγοράστηκαν ${count1} μπλούζες προς ${b1} € η καθεμία και ${count2} καπέλα προς ${b2} € το καθένα. Πόσα ευρώ (€) περίσσεψαν;`,
        tableData: { col1: 'Αγορές', col2: 'Υπόλοιπο', r1: [`${count1} · ${b1} € ＋ ${count2} · ${b2} €`, `Σύνολο: ${totalCost} €`], r2: [`Αρχικά: ${initial} €`, `Περίσσεψαν: ${remain} €`] },
        correctVal: remain,
        correctStr: String(remain),
        explanation: `Παράσταση: ${initial} － (${count1} · ${b1} ＋ ${count2} · ${b2}) ＝ ${initial} － (${count1 * b1} ＋ ${count2 * b2}) ＝ ${initial} － ${totalCost} ＝ ${remain} €.`
      };
    }
  },
  {
    id: 'p_prio_std_3',
    generate: () => {
      const notebooks = 5;
      const nbPrice = 3;
      const pens = 4;
      const penPrice = 2;
      const wallet = 30;
      const total = notebooks * nbPrice + pens * penPrice;
      const change = wallet - total;
      return {
        title: 'ΑΓΟΡΑ ΣΧΟΛΙΚΩΝ ΕΙΔΩΝ',
        instruction: 'Υπολογίστε τα ρέστα σε ευρώ (€):',
        text: `Ένας μαθητής αγόρασε ${notebooks} τετράδια προς ${nbPrice} € το καθένα και ${pens} στυλό προς ${penPrice} € το καθένα. Πλήρωσε με χαρτονόμισμα των ${wallet} €. Πόσα ρέστα (€) έλαβε;`,
        tableData: { col1: 'Έξοδα', col2: 'Πληρωμή & Ρέστα', r1: [`${notebooks} · ${nbPrice} € ＋ ${pens} · ${penPrice} €`, `Σύνολο: ${total} €`], r2: [`Χαρτονόμισμα: ${wallet} €`, `Ρέστα: ${change} €`] },
        correctVal: change,
        correctStr: String(change),
        explanation: `Παράσταση: ${wallet} － (${notebooks} · ${nbPrice} ＋ ${pens} · ${penPrice}) ＝ ${wallet} － ${total} ＝ ${change} €.`
      };
    }
  },
  {
    id: 'p_prio_std_4',
    generate: () => {
      const totalStudents = 60;
      const boysTeams = 4;
      const perBoyTeam = 6;
      const girls = totalStudents - boysTeams * perBoyTeam;
      return {
        title: 'ΚΑΤΑΜΕΤΡΗΣΗ ΜΑΘΗΤΩΝ ΣΕ ΟΜΑΔΕΣ',
        instruction: 'Υπολογίστε το πλήθος των κοριτσιών:',
        text: `Στην αυλή βρίσκονται ${totalStudents} μαθητές. Σχηματίστηκαν ${boysTeams} ομάδες αγοριών με ${perBoyTeam} αγόρια η καθεμία και οι υπόλοιποι μαθητές είναι κορίτσια. Πόσα είναι τα κορίτσια;`,
        tableData: { col1: 'Σύνολο Μαθητών', col2: 'Αγόρια', r1: [`${totalStudents} μαθητές`, `${boysTeams} · ${perBoyTeam} ＝ ${boysTeams * perBoyTeam} αγόρια`], r2: ['Αφαίρεση', `${girls} κορίτσια`] },
        correctVal: girls,
        correctStr: String(girls),
        explanation: `Παράσταση: ${totalStudents} － (${boysTeams} · ${perBoyTeam}) ＝ ${totalStudents} － ${boysTeams * perBoyTeam} ＝ ${girls} κορίτσια.`
      };
    }
  },
  {
    id: 'p_prio_std_5',
    generate: () => {
      const totalCrates = 8;
      const perCrate = 15;
      const sold = 45;
      const remain = totalCrates * perCrate - sold;
      return {
        title: 'ΑΠΟΘΗΚΗ ΦΡΟΥΤΩΝ',
        instruction: 'Υπολογίστε τα κιλά που απέμειναν (ακέραιος):',
        text: `Ένας παραγωγός είχε ${totalCrates} τελάρα με ${perCrate} kg πορτοκάλια το καθένα. Πούλησε ${sold} kg. Πόσα κιλά (kg) πορτοκάλια του έμειναν;`,
        tableData: { col1: 'Αρχικό Βάρος', col2: 'Πώληση & Υπόλοιπο', r1: [`${totalCrates} · ${perCrate} kg`, `${sold} kg πωλήθηκαν`], r2: ['Υπόλοιπο', `${remain} kg`] },
        correctVal: remain,
        correctStr: String(remain),
        explanation: `Παράσταση: (${totalCrates} · ${perCrate}) － ${sold} ＝ ${totalCrates * perCrate} － ${sold} ＝ ${remain} kg.`
      };
    }
  },
  {
    id: 'p_prio_std_6',
    generate: () => {
      const hours = 5;
      const perHour = 12;
      const bonus = 20;
      const total = hours * perHour + bonus;
      return {
        title: 'ΑΜΟΙΒΗ ΕΡΓΑΣΙΑΣ',
        instruction: 'Υπολογίστε τη συνολική αμοιβή σε ευρώ (€):',
        text: `Ένας τεχνικός εργάστηκε ${hours} ώρες με ωρομίσθιο ${perHour} € και έλαβε επιπλέον επίδομα μετακίνησης ${bonus} €. Ποια ήταν η συνολική αμοιβή του σε ευρώ (€);`,
        tableData: { col1: 'Ωρομίσθιο', col2: 'Επίδομα & Σύνολο', r1: [`${hours} · ${perHour} €`, `${bonus} €`], r2: ['Σύνολο', `${total} €`] },
        correctVal: total,
        correctStr: String(total),
        explanation: `Παράσταση: (${hours} · ${perHour}) ＋ ${bonus} ＝ ${hours * perHour} ＋ ${bonus} ＝ ${total} €.`
      };
    }
  }
];

// Διευρυμένη δεξαμενή προβλημάτων για την Ερώτηση 10 (MCQ)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_prio_hard_1',
    generate: () => {
      const crates = 5;
      const applesPerCrate = 20;
      const rotten = 8;
      const bags = 6;
      const goodApples = crates * applesPerCrate - rotten;
      const applesPerBag = goodApples / bags;
      const correctStr = `${applesPerBag} μήλα`;
      const fake1 = `${applesPerBag + 4} μήλα`;
      const fake2 = `${Math.max(1, applesPerBag - 3)} μήλα`;
      const fake3 = `${applesPerBag * 2} μήλα`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΜΟΙΡΑΣΜΑ ΜΗΛΩΝ ΣΕ ΣΑΚΟΥΛΕΣ',
        instruction: 'Επιλέξτε πόσα μήλα μπήκαν σε κάθε σακούλα:',
        text: `Ένας μανάβης είχε ${crates} τελάρα με ${applesPerCrate} μήλα το καθένα. Αφαίρεσε ${rotten} χαλασμένα μήλα και τα υπόλοιπα τα μοίρασε εξίσου σε ${bags} σακούλες. Πόσα μήλα έβαλε σε κάθε σακούλα;`,
        tableData: { col1: 'Συνολικά & Χαλασμένα', col2: 'Μοίρασμα', r1: [`(${crates} · ${applesPerCrate}) － ${rotten}`, `${goodApples} καλά μήλα`], r2: [`: ${bags} σακούλες`, `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Φτιάχνουμε την παράσταση: (${crates} · ${applesPerCrate} － ${rotten}) : ${bags} ＝ (${crates * applesPerCrate} － ${rotten}) : ${bags} ＝ ${goodApples} : ${bags} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_prio_hard_2',
    generate: () => {
      const adultTickets = 3;
      const adultPrice = 10;
      const kidTickets = 4;
      const kidPrice = 5;
      const wallet = 60;
      const totalCost = adultTickets * adultPrice + kidTickets * kidPrice;
      const change = wallet - totalCost;
      const correctStr = `${change} €`;
      const fake1 = `${change + 5} €`;
      const fake2 = `${Math.max(1, change - 3)} €`;
      const fake3 = `${change + 10} €`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΕΙΣΙΤΗΡΙΑ ΘΕΑΜΑΤΟΣ & ΡΕΣΤΑ',
        instruction: 'Επιλέξτε το σωστό ποσό ρέστων σε ευρώ (€):',
        text: `Μια οικογένεια αγόρασε ${adultTickets} εισιτήρια ενηλίκων προς ${adultPrice} € το καθένα και ${kidTickets} παιδικά εισιτήρια προς ${kidPrice} € το καθένα. Πλήρωσε με χαρτονόμισμα των ${wallet} €. Πόσα ρέστα (€) έλαβε;`,
        tableData: { col1: 'Εισιτήρια', col2: 'Πληρωμή & Ρέστα', r1: [`${adultTickets} · ${adultPrice} € ＋ ${kidTickets} · ${kidPrice} €`, `Σύνολο: ${totalCost} €`], r2: [`Χαρτονόμισμα: ${wallet} €`, `Ρέστα: ${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Παράσταση: ${wallet} － (${adultTickets} · ${adultPrice} ＋ ${kidTickets} · ${kidPrice}) ＝ ${wallet} － (${adultTickets * adultPrice} ＋ ${kidTickets * kidPrice}) ＝ ${wallet} － ${totalCost} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_prio_hard_3',
    generate: () => {
      const rows = 6;
      const perRow = 15;
      const damaged = 10;
      const boxes = 8;
      const goodTiles = rows * perRow - damaged;
      const perBox = goodTiles / boxes;
      const correctStr = `${perBox} πλακάκια`;
      const fake1 = `${perBox + 2} πλακάκια`;
      const fake2 = `${Math.max(1, perBox - 2)} πλακάκια`;
      const fake3 = `${perBox + 5} πλακάκια`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΣΥΣΚΕΥΑΣΙΑ ΑΚΕΡΑΙΩΝ ΠΛΑΚΙΔΙΩΝ',
        instruction: 'Επιλέξτε πόσα πλακάκια τοποθετούνται σε κάθε κουτί:',
        text: `Ένας εργάτης είχε ${rows} σειρές πλακιδίων με ${perRow} πλακάκια η καθεμία. Αφαίρεσε ${damaged} σπασμένα και τα υπόλοιπα τα μοίρασε ισόποσα σε ${boxes} κουτιά. Πόσα πλακάκια έβαλε σε κάθε κουτί;`,
        tableData: { col1: 'Σύνολο & Σπασμένα', col2: 'Μοίρασμα', r1: [`(${rows} · ${perRow}) － ${damaged}`, `${goodTiles} γερά πλακάκια`], r2: [`: ${boxes} κουτιά`, `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Παράσταση: (${rows} · ${perRow} － ${damaged}) : ${boxes} ＝ (${rows * perRow} － ${damaged}) : ${boxes} ＝ ${goodTiles} : ${boxes} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_prio_hard_4',
    generate: () => {
      const pack1 = 4;
      const price1 = 12;
      const pack2 = 5;
      const price2 = 6;
      const budget = 100;
      const total = pack1 * price1 + pack2 * price2;
      const remain = budget - total;
      const correctStr = `${remain} €`;
      const fake1 = `${remain + 10} €`;
      const fake2 = `${Math.max(2, remain - 8)} €`;
      const fake3 = `${remain + 15} €`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΑΓΟΡΑ ΒΙΒΛΙΩΝ ΚΑΙ ΤΕΤΡΑΔΙΩΝ',
        instruction: 'Επιλέξτε πόσα ευρώ (€) περίσσεψαν:',
        text: `Από αρχικό ποσό ${budget} € αγοράστηκαν ${pack1} βιβλία προς ${price1} € το καθένα και ${pack2} πακέτα τετραδίων προς ${price2} € το καθένα. Πόσα ευρώ (€) περίσσεψαν;`,
        tableData: { col1: 'Αγορές', col2: 'Υπόλοιπο', r1: [`${pack1} · ${price1} € ＋ ${pack2} · ${price2} €`, `Σύνολο: ${total} €`], r2: [`Αρχικά: ${budget} €`, `Περίσσεψαν: ${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Παράσταση: ${budget} － (${pack1} · ${price1} ＋ ${pack2} · ${price2}) ＝ ${budget} － (${pack1 * price1} ＋ ${pack2 * price2}) ＝ ${budget} － ${total} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_prio_hard_5',
    generate: () => {
      const barrels = 4;
      const lPerBarrel = 50;
      const waste = 20;
      const cans = 9;
      const goodOil = barrels * lPerBarrel - waste;
      const perCan = goodOil / cans;
      const correctStr = `${perCan} L`;
      const fake1 = `${perCan + 2} L`;
      const fake2 = `${Math.max(1, perCan - 2)} L`;
      const fake3 = `${perCan + 5} L`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΕΜΦΙΑΛΩΣΗ ΕΛΑΙΟΛΑΔΟΥ',
        instruction: 'Επιλέξτε πόσα λίτρα (L) λάδι μπήκαν σε κάθε δοχείο:',
        text: `Ένας παραγωγός είχε ${barrels} βαρέλια με ${lPerBarrel} L λάδι το καθένα. Αφαίρεσε ${waste} L ακατάλληλο λάδι και το υπόλοιπο λάδι το μοίρασε ισόποσα σε ${cans} δοχεία. Πόσα λίτρα (L) λάδι μπήκαν σε κάθε δοχείο;`,
        tableData: { col1: 'Συνολικό Λάδι', col2: 'Μοίρασμα', r1: [`(${barrels} · ${lPerBarrel}) － ${waste}`, `${goodOil} L καθαρό`], r2: [`: ${cans} δοχεία`, `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Παράσταση: (${barrels} · ${lPerBarrel} － ${waste}) : ${cans} ＝ (${barrels * lPerBarrel} － ${waste}) : ${cans} ＝ ${goodOil} : ${cans} ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_prio_hard_6',
    generate: () => {
      const boxes = 6;
      const kgPerBox = 12;
      const damagedKg = 8;
      const bags = 8;
      const goodKg = boxes * kgPerBox - damagedKg;
      const perBag = goodKg / bags;
      const correctStr = `${perBag} kg`;
      const fake1 = `${perBag + 1} kg`;
      const fake2 = `${Math.max(1, perBag - 1)} kg`;
      const fake3 = `${perBag + 3} kg`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΣΥΣΚΕΥΑΣΙΑ ΑΛΕΥΡΙΟΥ ΣΕ ΣΑΚΟΥΛΕΣ',
        instruction: 'Επιλέξτε πόσα κιλά (kg) αλεύρι περιέχει κάθε σακούλα:',
        text: `Ένας αρτοποιός είχε ${boxes} κιβώτια με ${kgPerBox} kg αλεύρι το καθένα. Αφαίρεσε ${damagedKg} kg ακατάλληλο αλεύρι και το υπόλοιπο το μοίρασε ισόποσα σε ${bags} σακούλες. Πόσα κιλά (kg) αλεύρι περιέχει κάθε σακούλα;`,
        tableData: { col1: 'Σύνολο & Ακατάλληλο', col2: 'Μοίρασμα', r1: [`(${boxes} · ${kgPerBox}) － ${damagedKg}`, `${goodKg} kg καλό`], r2: [`: ${bags} σακούλες`, `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Παράσταση: (${boxes} · ${kgPerBox} － ${damagedKg}) : ${bags} ＝ (${boxes * kgPerBox} － ${damagedKg}) : ${bags} ＝ ${goodKg} : ${bags} ＝ ${correctStr}.`
      };
    }
  }
];

// Δημιουργία των 10 δυναμικών ερωτήσεων
function generateQuestions() {
  const qList = [];
  const shuffledProblems = shuffle(REAL_WORLD_PROBLEMS);

  // Q1 (Input): Απλή παράσταση χωρίς παρενθέσεις (α ＋ β · γ)
  {
    const q1A = randInt(10, 30);
    const q1B = randInt(2, 6);
    const q1C = randInt(3, 8);
    const q1Answer = q1A + q1B * q1C;
    const q1Prompt = `${q1A} ＋ ${q1B} · ${q1C}`;

    qList.push({
      id: 1,
      type: 'integer_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΑΠΛΗ ΠΑΡΑΣΤΑΣΗ',
      instruction: 'Υπολογίστε την τιμή της παράστασης τηρώντας την προτεραιότητα (ακέραιος):',
      prompt: `Υπολογίστε την τιμή της παράστασης: ${q1Prompt}`,
      correctVal: q1Answer,
      correctStr: String(q1Answer),
      explanation: `Πρώτα εκτελούμε τον πολλαπλασιασμό: ${q1B} · ${q1C} ＝ ${q1B * q1C}. Στη συνέχεια την πρόσθεση: ${q1A} ＋ ${q1B * q1C} ＝ ${q1Answer}.`
    });
  }

  // Q2 (Input): Παράσταση με παρενθέσεις (α － β) · γ
  {
    const q2A = randInt(15, 30);
    const q2B = randInt(2, q2A - 5);
    const q2C = randInt(2, 6);
    const q2Answer = (q2A - q2B) * q2C;
    const q2Prompt = `(${q2A} － ${q2B}) · ${q2C}`;

    qList.push({
      id: 2,
      type: 'integer_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΠΑΡΑΣΤΑΣΗ ΜΕ ΠΑΡΕΝΘΕΣΗ',
      instruction: 'Υπολογίστε πρώτα την παρένθεση (ακέραιος):',
      prompt: `Υπολογίστε την τιμή της παράστασης: ${q2Prompt}`,
      correctVal: q2Answer,
      correctStr: String(q2Answer),
      explanation: `Πρώτα υπολογίζουμε την παρένθεση: (${q2A} － ${q2B}) ＝ ${q2A - q2B}. Μετά εκτελούμε τον πολλαπλασιασμό: ${q2A - q2B} · ${q2C} ＝ ${q2Answer}.`
    });
  }

  // Q3 (MCQ): Αναγνώριση πρώτης πράξης
  {
    const q3A = randInt(20, 50);
    const q3B = randInt(3, 8);
    const q3C = randInt(2, 5);
    const q3D = randInt(1, 10);
    const q3ExprStr = `${q3A} － ${q3B} · ${q3C} ＋ ${q3D}`;
    const q3Correct = `Ο πολλαπλασιασμός (${q3B} · ${q3C})`;

    const rawOptions = [
      `Ο πολλαπλασιασμός (${q3B} · ${q3C})`,
      `Η αφαίρεση (${q3A} － ${q3B})`,
      `Η πρόσθεση (${q3C} ＋ ${q3D})`,
      'Όλες οι πράξεις μαζί'
    ];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q3Correct
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΑΝΑΓΝΩΡΙΣΗ ΠΡΩΤΗΣ ΠΡΑΞΗΣ',
      instruction: 'Επιλέξτε ποια πράξη πρέπει να εκτελεστεί πρώτη:',
      prompt: `Ποια πράξη πρέπει να εκτελέσουμε ΠΡΩΤΑ στην παράσταση: ${q3ExprStr};`,
      options,
      correctText: q3Correct,
      explanation: `Ο πολλαπλασιασμός έχει προτεραιότητα έναντι της πρόσθεσης και της αφαίρεσης. Άρα ξεκινάμε με το ${q3B} · ${q3C}.`
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

    const rawOptions = [correctStr, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === correctStr
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΠΟΛΛΑΠΛΕΣ ΠΡΑΞΕΙΣ',
      instruction: 'Υπολογίστε την τελική τιμή της παράστασης:',
      prompt: `Υπολογίστε την τιμή της παράστασης: ${q4ExprStr}`,
      options,
      correctText: correctStr,
      explanation: `1) Παρένθεση: ${q4C} ＋ ${q4D} ＝ ${q4SubTotal}. 2) Πολλαπλασιασμός: ${q4B} · ${q4SubTotal} ＝ ${q4Prod}. 3) Αφαίρεση: ${q4A} － ${q4Prod} ＝ ${q4Answer}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας Προτεραιότητας
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Σε μια αριθμητική παράσταση χωρίς παρενθέσεις, εκτελούμε τους πολλαπλασιασμούς και τις διαιρέσεις πριν από τις προσθέσεις και τις αφαιρέσεις.'
      : 'Σε μια αριθμητική παράσταση χωρίς παρενθέσεις, εκτελούμε πάντα τις προσθέσεις και τις αφαιρέσεις πρώτα.';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΠΡΟΤΕΡΑΙΟΤΗΤΑΣ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Οι πολλαπλασιασμοί και οι διαιρέσεις προηγούνται πάντα των προσθέσεων και των αφαιρέσεων.'
        : 'Λάθος! Οι προσθέσεις και οι αφαιρέσεις εκτελούνται τελευταίες, εκτός εάν βρίσκονται μέσα σε παρενθέσεις.'
    });
  }

  // Q6 (MCQ): True / False - Κανόνας Αριστερά ➔ Δεξιά
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Όταν σε μια παράσταση υπάρχουν μόνο προσθέσεις και αφαιρέσεις, τις εκτελούμε με τη σειρά από αριστερά προς τα δεξιά.'
      : 'Όταν σε μια παράσταση υπάρχουν μόνο προσθέσεις και αφαιρέσεις, κάνουμε πάντα πρώτα όλες τις προσθέσεις.';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΑΡΙΣΤΕΡΑ ΠΡΟΣ ΔΕΞΙΑ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Πράξεις με την ίδια προτεραιότητα εκτελούνται διαδοχικά από τα αριστερά προς τα δεξιά.'
        : 'Λάθος! Δεν προηγείται η πρόσθεση έναντι της αφαίρεσης. Εκτελούνται με τη σειρά που εμφανίζονται από αριστερά προς τα δεξιά.'
    });
  }

  // Q7 (Input): Πρόβλημα Καθημερινότητας (α － β · γ)
  {
    const p = shuffledProblems[0];
    const q7Answer = p.wallet - p.count * p.price;
    const q7Prompt = `${p.name} είχε ${p.wallet} €. Αγόρασε ${p.count} ${p.item} που κοστίζουν ${p.price} € το καθένα. Πόσα ρέστα (€) έλαβε;`;

    qList.push({
      id: 7,
      type: 'integer_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ',
      instruction: 'Υπολογίστε το ποσό των ρέστων σε ευρώ (€):',
      prompt: q7Prompt,
      correctVal: q7Answer,
      correctStr: String(q7Answer),
      explanation: `Φτιάχνουμε την αριθμητική παράσταση: ${p.wallet} － ${p.count} · ${p.price} ＝ ${p.wallet} － ${p.count * p.price} ＝ ${q7Answer} €.`
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

    const rawOptions = [q8CorrectStep, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8CorrectStep
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΑΝΑΓΝΩΡΙΣΗ 1ΟΥ ΒΗΜΑΤΟΣ',
      instruction: 'Επιλέξτε τη σωστή μορφή της παράστασης μετά το 1ο βήμα:',
      prompt: `Ποιο είναι το σωστό 1ο βήμα για τη λύση της παράστασης: ${q8ExprStr};`,
      options,
      correctText: q8CorrectStep,
      explanation: `Υπολογίζουμε πρώτα την παρένθεση (${q8B} ＋ ${q8C} ＝ ${q8B + q8C}), οπότε η νέα μορφή είναι: ${q8CorrectStep}.`
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate();
    const hardProb = shuffledHard[0].generate();

    // Q9 (Input)
    qList.push({
      id: 9,
      type: 'integer_input',
      title: `ΕΡΩΤΗΣΗ 9 • ${stdProb.title}`,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      correctVal: stdProb.correctVal,
      correctStr: stdProb.correctStr,
      explanation: stdProb.explanation
    });

    // Q10 (MCQ)
    qList.push({
      id: 10,
      type: 'mcq',
      title: `ΕΡΩΤΗΣΗ 10 • ${hardProb.title}`,
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

export default function ProteraiotitaPrakseonExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργία νέων ασκήσεων
  const loadNewSet = useCallback(() => {
    const q = generateQuestions();
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμός Input μόνο για ακεραίους αριθμούς (0-9)
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

  // Χειρισμός MCQ
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

  // Έλεγχος Απαντήσεων
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

  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== null && String(val).trim() !== '').length;

  return (
    <Layout
      title="Ασκήσεις: Προτεραιότητα Πράξεων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στην προτεραιότητα των πράξεων και τις αριθμητικές παραστάσεις για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/10-proteraiotita-prakseon"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 {toCleanUppercase('Θεωρία')}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 10 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ασκήσεις &amp; Προβλήματα: Προτεραιότητα Πράξεων
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 δυναμικές δραστηριότητες με αριθμητικές παραστάσεις, παρενθέσεις, αναγνώριση πρώτης πράξης και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίους αριθμούς.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation"
            >
              <span>🔄 {toCleanUppercase('Νέες Ασκήσεις')}</span>
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
                className={`bg-white rounded-3xl border p-5 sm:p-8 2xl:p-10 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλίδα Ερώτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
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
                      {isCorrect ? `✓ ${toCleanUppercase('Σωστό')}` : `✗ ${toCleanUppercase('Λάθος')}`}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση */}
                <div className="space-y-3 mb-5">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>
                </div>

                {/* Περιοχή Απάντησης */}
                <div className="py-2">
                  {/* Integer Input */}
                  {q.type === 'integer_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck="false"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500 font-medium">
                        (Ακέραιος αριθμός)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) */}
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
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 min-h-[48px] ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-300'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1">
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
                      <span>{isCorrect ? '🎉 Εξαιρετικά!' : '💡 Μαθηματική Επεξήγηση:'}</span>
                    </div>

                    {/* Οργανωτικός Πίνακας Δεδομένων στην Επεξήγηση */}
                    {q.tableData && (
                      <div className="inline-block max-w-full bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-inner my-1 font-mono text-xs sm:text-sm">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                          <span className="bg-blue-100/70 px-2 py-0.5 rounded-lg text-blue-900 break-words">{q.tableData.col1}</span>
                          <span className="bg-emerald-100/70 px-2 py-0.5 rounded-lg text-emerald-900 break-words">{q.tableData.col2}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                          <span>{q.tableData.r1[0]}</span>
                          <span className="text-indigo-700 font-bold">{q.tableData.r1[1]}</span>
                          <span>{q.tableData.r2[0]}</span>
                          <span className="text-amber-600 font-black">{q.tableData.r2[1]}</span>
                        </div>
                      </div>
                    )}

                    <div>{q.explanation}</div>
                    
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800">
                        Σωστή απάντηση:{' '}
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
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
            >
              <span>🎯 {toCleanUppercase('Έλεγχος Απαντήσεων')}</span>
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
                {isSubmitted ? toCleanUppercase('Σκορ') : toCleanUppercase('Απαντήθηκαν')}
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {isSubmitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-8">
                <span className="text-xs text-slate-400 font-semibold block">
                  {toCleanUppercase('Ποσοστό')}
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
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                {toCleanUppercase('Έλεγχος')}
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                <span>🔄 {toCleanUppercase('Νέες Ασκήσεις')}</span>
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}

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

const PROBLEM_GENERATORS = [
  // 1. Σχολικά λεωφορεία
  (locale) => {
    const isEn = locale === 'en';
    const busCapacity = randInt(35, 50);
    const busCount = randInt(3, 8);
    const totalStudents = busCapacity * busCount;
    const ticketPrice = randInt(6, 12);
    const totalCost = totalStudents * ticketPrice;
    return {
      title: isEn ? 'SCHOOL TRIP' : 'ΣΧΟΛΙΚΗ ΕΚΔΡΟΜΗ',
      text: isEn
        ? `A school trip involves ${totalStudents} students. If each bus seats ${busCapacity} students and the ticket costs ${ticketPrice} € per student, what is the total cost of the tickets?`
        : `Σε μια σχολική εκδρομή συμμετέχουν ${totalStudents} μαθητές. Αν κάθε λεωφορείο χωράει ${busCapacity} μαθητές και το εισιτήριο κοστίζει ${ticketPrice} € ανά μαθητή, ποιο είναι το συνολικό κόστος των εισιτηρίων;`,
      given: isEn
        ? [`Students: ${totalStudents}`, `Capacity: ${busCapacity} seats`, `Ticket price: ${ticketPrice} €`]
        : [`Μαθητές: ${totalStudents}`, `Χωρητικότητα: ${busCapacity} θέσεις`, `Τιμή εισιτηρίου: ${ticketPrice} €`],
      target: isEn ? 'Total ticket cost (€)' : 'Συνολικό κόστος εισιτηρίων (€)',
      correctVal: totalCost,
      correctStr: String(totalCost),
      explain: isEn
        ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Multiply total students by ticket price: <span>${totalStudents} · ${ticketPrice} ＝ <strong>${formatNumber(totalCost, locale)} €</strong></span>.</div>`
        : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Πολλαπλασιάζουμε το σύνολο των μαθητών με την τιμή του εισιτηρίου: <span>${totalStudents} · ${ticketPrice} ＝ <strong>${formatNumber(totalCost, locale)} €</strong></span>.</div>`
    };
  },
  // 2. Ψώνια στο μανάβικο & ρέστα
  (locale) => {
    const isEn = locale === 'en';
    const applesKg = randInt(2, 6);
    const applePrice = randInt(2, 4);
    const orangesKg = randInt(3, 7);
    const orangePrice = randInt(1, 3);
    const applesCost = applesKg * applePrice;
    const orangesCost = orangesKg * orangePrice;
    const totalSpend = applesCost + orangesCost;
    const wallet = totalSpend + randInt(5, 25);
    const change = wallet - totalSpend;
    return {
      title: isEn ? 'GROCERY SHOPPING' : 'ΨΩΝΙΑ ΣΤΟ ΜΑΝΑΒΙΚΟ',
      text: isEn
        ? `Nick had ${wallet} €. He bought ${applesKg} kg of apples at ${applePrice} €/kg and ${orangesKg} kg of oranges at ${orangePrice} €/kg. How much change (€) did he receive?`
        : `Ο Νίκος είχε ${wallet} €. Αγόρασε ${applesKg} κιλά μήλα προς ${applePrice} € το κιλό και ${orangesKg} κιλά πορτοκάλια προς ${orangePrice} € το κιλό. Πόσα ρέστα (€) έλαβε;`,
      given: isEn
        ? [`Money: ${wallet} €`, `Apples: ${applesKg} kg · ${applePrice} €`, `Oranges: ${orangesKg} kg · ${orangePrice} €`]
        : [`Χρήματα: ${wallet} €`, `Μήλα: ${applesKg} κιλά · ${applePrice} €`, `Πορτοκάλια: ${orangesKg} κιλά · ${orangePrice} €`],
      target: isEn ? 'Change (€)' : 'Ρέστα (€)',
      correctVal: change,
      correctStr: String(change),
      explain: isEn
        ? `<div class="space-y-1"><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Expenses: <span>(${applesKg} · ${applePrice}) ＋ (${orangesKg} · ${orangePrice}) ＝ ${applesCost} ＋ ${orangesCost} ＝ ${totalSpend} €</span>.</div><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Change: <span>${wallet} － ${totalSpend} ＝ <strong>${change} €</strong></span>.</div></div>`
        : `<div class="space-y-1"><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Έξοδα: <span>(${applesKg} · ${applePrice}) ＋ (${orangesKg} · ${orangePrice}) ＝ ${applesCost} ＋ ${orangesCost} ＝ ${totalSpend} €</span>.</div><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Ρέστα: <span>${wallet} － ${totalSpend} ＝ <strong>${change} €</strong></span>.</div></div>`
    };
  },
  // 3. Βιβλιοθήκη & νέα ράφια
  (locale) => {
    const isEn = locale === 'en';
    const shelves = randInt(4, 8);
    const perShelf = randInt(20, 35);
    const initial = shelves * perShelf;
    const added = randInt(15, 45);
    const total = initial + added;
    const newShelves = [3, 4, 5, 6].find((n) => total % n === 0) || 5;
    const booksPerNew = Math.floor(total / newShelves);
    const finalTotal = booksPerNew * newShelves;
    const actualAdded = finalTotal - initial;
    return {
      title: isEn ? 'LIBRARY REORGANIZATION' : 'ΑΝΑΔΙΟΡΓΑΝΩΣΗ ΒΙΒΛΙΟΘΗΚΗΣ',
      text: isEn
        ? `A library had ${shelves} shelves with ${perShelf} books on each. ${actualAdded} more books were added, and all books were divided equally across ${newShelves} new shelves. How many books are on each new shelf?`
        : `Μια βιβλιοθήκη είχε ${shelves} ράφια με ${perShelf} βιβλία στο καθένα. Προστέθηκαν ακόμη ${actualAdded} βιβλία και όλα μαζί μοιράστηκαν ισόποσα σε ${newShelves} νέα ράφια. Πόσα βιβλία έχει κάθε νέο ράφι;`,
      given: isEn
        ? [`Initially: ${shelves} shelves · ${perShelf} books`, `Added: ${actualAdded} books`, `New shelves: ${newShelves}`]
        : [`Αρχικά: ${shelves} ράφια · ${perShelf} βιβλία`, `Προστέθηκαν: ${actualAdded} βιβλία`, `Νέα ράφια: ${newShelves}`],
      target: isEn ? 'Books per new shelf' : 'Βιβλία ανά νέο ράφι',
      correctVal: booksPerNew,
      correctStr: String(booksPerNew),
      explain: isEn
        ? `<div class="space-y-1"><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Initial books: <span>${shelves} · ${perShelf} ＝ ${initial}</span>. Total: <span>${initial} ＋ ${actualAdded} ＝ ${finalTotal}</span>.</div><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Per shelf: <span>${renderFraction(finalTotal, newShelves)} ＝ <strong>${booksPerNew}</strong> books</span>.</div></div>`
        : `<div class="space-y-1"><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Αρχικά βιβλία: <span>${shelves} · ${perShelf} ＝ ${initial}</span>. Σύνολο: <span>${initial} ＋ ${actualAdded} ＝ ${finalTotal}</span>.</div><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Ανά νέο ράφι: <span>${renderFraction(finalTotal, newShelves)} ＝ <strong>${booksPerNew}</strong> βιβλία</span>.</div></div>`
    };
  },
  // 4. Ζαχαροπλαστείο
  (locale) => {
    const isEn = locale === 'en';
    const boxes = randInt(12, 25);
    const perBox = randInt(8, 16);
    const totalSweets = boxes * perBox;
    const pricePerBox = randInt(10, 18);
    const totalEarnings = boxes * pricePerBox;
    return {
      title: isEn ? 'PASTRY SHOP' : 'ΖΑΧΑΡΟΠΛΑΣΤΕΙΟ',
      text: isEn
        ? `A pastry chef made ${totalSweets} pastries and packed them into boxes of ${perBox} each. If all boxes were sold at ${pricePerBox} € each, what was the total revenue?`
        : `Ένας ζαχαροπλάστης έφτιαξε ${totalSweets} γλυκά και τα συσκεύασε σε κουτιά των ${perBox} τεμαχίων. Αν πούλησε όλα τα κουτιά προς ${pricePerBox} € το καθένα, πόσα χρήματα εισέπραξε συνολικά;`,
      given: isEn
        ? [`Total pastries: ${totalSweets}`, `Per box: ${perBox} items`, `Price per box: ${pricePerBox} €`]
        : [`Σύνολο γλυκών: ${totalSweets}`, `Ανά κουτί: ${perBox} τεμάχια`, `Τιμή ανά κουτί: ${pricePerBox} €`],
      target: isEn ? 'Total revenue (€)' : 'Συνολική είσπραξη (€)',
      correctVal: totalEarnings,
      correctStr: String(totalEarnings),
      explain: isEn
        ? `<div class="space-y-1"><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Boxes: <span>${renderFraction(totalSweets, perBox)} ＝ ${boxes}</span>.</div><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Revenue: <span>${boxes} · ${pricePerBox} ＝ <strong>${formatNumber(totalEarnings, locale)} €</strong></span>.</div></div>`
        : `<div class="space-y-1"><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Κουτιά: <span>${renderFraction(totalSweets, perBox)} ＝ ${boxes}</span>.</div><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Είσπραξη: <span>${boxes} · ${pricePerBox} ＝ <strong>${formatNumber(totalEarnings, locale)} €</strong></span>.</div></div>`
    };
  },
  // 5. Αποταμίευση για υπολογιστή
  (locale) => {
    const isEn = locale === 'en';
    const months = randInt(6, 12);
    const monthlySave = randInt(40, 80);
    const totalSaved = months * monthlySave;
    const pcPrice = totalSaved + randInt(50, 150);
    const needed = pcPrice - totalSaved;
    return {
      title: isEn ? 'SAVING FOR A COMPUTER' : 'ΑΠΟΤΑΜΙΕΥΣΗ ΓΙΑ ΥΠΟΛΟΓΙΣΤΗ',
      text: isEn
        ? `Helen saves ${monthlySave} € every month for ${months} months. If the computer she wants to buy costs ${pcPrice} €, how much money is she still missing?`
        : `Η Ελένη αποταμιεύει ${monthlySave} € κάθε μήνα για ${months} μήνες. Αν ο υπολογιστής που θέλει να αγοράσει κοστίζει ${pcPrice} €, πόσα χρήματα της λείπουν ακόμη;`,
      given: isEn
        ? [`Monthly savings: ${monthlySave} €`, `Months: ${months}`, `Computer price: ${pcPrice} €`]
        : [`Μηνιαία αποταμίευση: ${monthlySave} €`, `Μήνες: ${months}`, `Κόστος υπολογιστή: ${pcPrice} €`],
      target: isEn ? 'Remaining amount (€)' : 'Χρήματα που υπολείπονται (€)',
      correctVal: needed,
      correctStr: String(needed),
      explain: isEn
        ? `<div class="space-y-1"><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Saved: <span>${months} · ${monthlySave} ＝ ${totalSaved} €</span>.</div><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Still missing: <span>${pcPrice} － ${totalSaved} ＝ <strong>${needed} €</strong></span>.</div></div>`
        : `<div class="space-y-1"><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Αποταμίευση: <span>${months} · ${monthlySave} ＝ ${totalSaved} €</span>.</div><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Υπολείπονται: <span>${pcPrice} － ${totalSaved} ＝ <strong>${needed} €</strong></span>.</div></div>`
    };
  },
  // 6. Συγκομιδή ελαιολάδου
  (locale) => {
    const isEn = locale === 'en';
    const trees = randInt(30, 70);
    const oilPerTree = randInt(4, 8);
    const totalOil = trees * oilPerTree;
    const canCapacity = [5, 10].find((c) => totalOil % c === 0) || 5;
    const cans = Math.floor(totalOil / canCapacity);
    return {
      title: isEn ? 'OLIVE OIL HARVEST' : 'ΣΥΓΚΟΜΙΔΗ ΕΛΑΙΟΛΑΔΟΥ',
      text: isEn
        ? `An olive grower owns ${trees} trees, each yielding ${oilPerTree} liters of oil. If he stored all the oil into ${canCapacity}-liter containers, how many containers did he fill?`
        : `Ένας παραγωγός έχει ${trees} ελαιόδεντρα και κάθε δέντρο έδωσε ${oilPerTree} λίτρα λάδι. Αν έβαλε όλο το λάδι σε δοχεία των ${canCapacity} λίτρων, πόσα δοχεία γέμισε;`,
      given: isEn
        ? [`Trees: ${trees}`, `Liters per tree: ${oilPerTree}`, `Container capacity: ${canCapacity} L`]
        : [`Δέντρα: ${trees}`, `Λίτρα ανά δέντρο: ${oilPerTree}`, `Χωρητικότητα δοχείου: ${canCapacity} L`],
      target: isEn ? 'Number of containers' : 'Πλήθος δοχείων',
      correctVal: cans,
      correctStr: String(cans),
      explain: isEn
        ? `<div class="space-y-1"><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Total oil: <span>${trees} · ${oilPerTree} ＝ ${totalOil} L</span>.</div><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Containers: <span>${renderFraction(totalOil, canCapacity)} ＝ <strong>${cans}</strong> containers</span>.</div></div>`
        : `<div class="space-y-1"><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Συνολικό λάδι: <span>${trees} · ${oilPerTree} ＝ ${totalOil} λίτρα</span>.</div><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Δοχεία: <span>${renderFraction(totalOil, canCapacity)} ＝ <strong>${cans}</strong> δοχεία</span>.</div></div>`
    };
  },
  // 7. Θεατρική παράσταση
  (locale) => {
    const isEn = locale === 'en';
    const rows = randInt(12, 20);
    const seatsPerRow = randInt(15, 25);
    const totalSeats = rows * seatsPerRow;
    const emptySeats = randInt(15, 45);
    const bookedSeats = totalSeats - emptySeats;
    return {
      title: isEn ? 'THEATER PERFORMANCE' : 'ΘΕΑΤΡΙΚΗ ΠΑΡΑΣΤΑΣΗ',
      text: isEn
        ? `A theater auditorium has ${rows} rows with ${seatsPerRow} seats in each row. If ${emptySeats} seats remained empty during a performance, how many tickets were sold in total?`
        : `Μια αίθουσα θεάτρου έχει ${rows} σειρές με ${seatsPerRow} καθίσματα σε κάθε σειρά. Αν σε μια παράσταση έμειναν κενά ${emptySeats} καθίσματα, πόσα εισιτήρια πουλήθηκαν συνολικά;`,
      given: isEn
        ? [`Rows: ${rows}`, `Seats per row: ${seatsPerRow}`, `Empty seats: ${emptySeats}`]
        : [`Σειρές: ${rows}`, `Καθίσματα ανά σειρά: ${seatsPerRow}`, `Κενά καθίσματα: ${emptySeats}`],
      target: isEn ? 'Tickets sold' : 'Εισιτήρια που πουλήθηκαν',
      correctVal: bookedSeats,
      correctStr: String(bookedSeats),
      explain: isEn
        ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Total seats: <span>${rows} · ${seatsPerRow} ＝ ${totalSeats}</span>. Tickets sold: <span>${totalSeats} － ${emptySeats} ＝ <strong>${bookedSeats}</strong></span>.</div>`
        : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Συνολικά καθίσματα: <span>${rows} · ${seatsPerRow} ＝ ${totalSeats}</span>. Εισιτήρια: <span>${totalSeats} － ${emptySeats} ＝ <strong>${bookedSeats}</strong></span>.</div>`
    };
  },
  // 8. Σχολικός λαχανόκηπος
  (locale) => {
    const isEn = locale === 'en';
    const plots = randInt(4, 9);
    const plantsPerPlot = randInt(15, 30);
    const totalPlants = plots * plantsPerPlot;
    const dried = randInt(5, 18);
    const remaining = totalPlants - dried;
    return {
      title: isEn ? 'SCHOOL GARDEN' : 'ΣΧΟΛΙΚΟΣ ΛΑΧΑΝΟΚΗΠΟΣ',
      text: isEn
        ? `Students planted ${plots} plots with ${plantsPerPlot} plants in each. If ${dried} plants dried up, how many plants survived?`
        : `Οι μαθητές φύτεψαν ${plots} παρτέρια με ${plantsPerPlot} φυτά το καθένα. Αν ξεράθηκαν ${dried} φυτά, πόσα φυτά μεγάλωσαν κανονικά;`,
      given: isEn
        ? [`Plots: ${plots}`, `Plants per plot: ${plantsPerPlot}`, `Dried up: ${dried}`]
        : [`Παρτέρια: ${plots}`, `Φυτά ανά παρτέρι: ${plantsPerPlot}`, `Ξεράθηκαν: ${dried}`],
      target: isEn ? 'Surviving plants' : 'Φυτά που μεγάλωσαν',
      correctVal: remaining,
      correctStr: String(remaining),
      explain: isEn
        ? `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Total plants: <span>${plots} · ${plantsPerPlot} ＝ ${totalPlants}</span>. Survived: <span>${totalPlants} － ${dried} ＝ <strong>${remaining}</strong> plants</span>.</div>`
        : `<div class="inline-flex flex-wrap items-center gap-1 max-w-full">Συνολικά φυτά: <span>${plots} · ${plantsPerPlot} ＝ ${totalPlants}</span>. Επιβίωσαν: <span>${totalPlants} － ${dried} ＝ <strong>${remaining}</strong> φυτά</span>.</div>`
    };
  },
  // 9. Αρτοποιείο
  (locale) => {
    const isEn = locale === 'en';
    const trays = randInt(6, 12);
    const loavesPerTray = randInt(14, 25);
    const totalLoaves = trays * loavesPerTray;
    const pricePerLoaf = 2;
    const earnings = totalLoaves * pricePerLoaf;
    return {
      title: isEn ? 'BAKERY REVENUE' : 'ΑΡΤΟΠΟΙΕΙΟ',
      text: isEn
        ? `A bakery baked ${trays} baking trays with ${loavesPerTray} loaves of bread on each. If all loaves were sold at ${pricePerLoaf} € each, what was the total revenue?`
        : `Ένας φούρνος έψησε ${trays} λαμαρίνες με ${loavesPerTray} φραντζόλες ψωμί στην καθεμία. Αν πούλησε όλες τις φραντζόλες προς ${pricePerLoaf} € τη μία, ποια ήταν η συνολική του είσπραξη;`,
      given: isEn
        ? [`Trays: ${trays}`, `Loaves per tray: ${loavesPerTray}`, `Price per loaf: ${pricePerLoaf} €`]
        : [`Λαμαρίνες: ${trays}`, `Ψωμιά ανά λαμαρίνα: ${loavesPerTray}`, `Τιμή ανά ψωμί: ${pricePerLoaf} €`],
      target: isEn ? 'Total revenue (€)' : 'Συνολική είσπραξη (€)',
      correctVal: earnings,
      correctStr: String(earnings),
      explain: isEn
        ? `<div class="space-y-1"><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Total loaves: <span>${trays} · ${loavesPerTray} ＝ ${totalLoaves}</span>.</div><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Revenue: <span>${totalLoaves} · ${pricePerLoaf} ＝ <strong>${formatNumber(earnings, locale)} €</strong></span>.</div></div>`
        : `<div class="space-y-1"><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Σύνολο ψωμιών: <span>${trays} · ${loavesPerTray} ＝ ${totalLoaves}</span>.</div><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Είσπραξη: <span>${totalLoaves} · ${pricePerLoaf} ＝ <strong>${formatNumber(earnings, locale)} €</strong></span>.</div></div>`
    };
  },
  // 10. Ενοικίαση ποδηλάτων
  (locale) => {
    const isEn = locale === 'en';
    const hours = randInt(3, 7);
    const costPerHour = randInt(4, 8);
    const helmets = randInt(2, 5);
    const helmetCost = 2;
    const bikesCost = hours * costPerHour;
    const helmetsCost = helmets * helmetCost;
    const total = bikesCost + helmetsCost;
    return {
      title: isEn ? 'BICYCLE RENTAL' : 'ΕΝΟΙΚΙΑΣΗ ΠΟΔΗΛΑΤΩΝ',
      text: isEn
        ? `A group rented bicycles for ${hours} hours at ${costPerHour} €/hour and ${helmets} helmets at ${helmetCost} € each. How much did they pay in total?`
        : `Μια παρέα νοίκιασε ποδήλατα για ${hours} ώρες προς ${costPerHour} € την ώρα και ${helmets} κράνη προς ${helmetCost} € το καθένα. Πόσο πλήρωσε συνολικά;`,
      given: isEn
        ? [`Hours: ${hours} · ${costPerHour} €/hour`, `Helmets: ${helmets} · ${helmetCost} €`]
        : [`Ώρες: ${hours} · ${costPerHour} €/ώρα`, `Κράνη: ${helmets} · ${helmetCost} €`],
      target: isEn ? 'Total cost (€)' : 'Συνολικό ποσό πληρωμής (€)',
      correctVal: total,
      correctStr: String(total),
      explain: isEn
        ? `<div class="space-y-1"><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Bikes: <span>${hours} · ${costPerHour} ＝ ${bikesCost} €</span>. Helmets: <span>${helmets} · ${helmetCost} ＝ ${helmetsCost} €</span>.</div><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Total: <span>${bikesCost} ＋ ${helmetsCost} ＝ <strong>${total} €</strong></span>.</div></div>`
        : `<div class="space-y-1"><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Ποδήλατα: <span>${hours} · ${costPerHour} ＝ ${bikesCost} €</span>. Κράνη: <span>${helmets} · ${helmetCost} ＝ ${helmetsCost} €</span>.</div><div class="inline-flex flex-wrap items-center gap-1 max-w-full">Σύνολο: <span>${bikesCost} ＋ ${helmetsCost} ＝ <strong>${total} €</strong></span>.</div></div>`
    };
  }
];

function generateQuestions(locale = 'el') {
  const shuffledGenerators = shuffle(PROBLEM_GENERATORS);
  return shuffledGenerators.slice(0, 10).map((gen, idx) => ({
    id: idx + 1,
    ...gen(locale)
  }));
}

const UI_STRINGS = {
  el: {
    pageTitle: "Ασκήσεις: Επίλυση Προβλημάτων - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικά διαδραστικά προβλήματα μαθηματικών με αυτόματη βαθμολόγηση και αναλυτική καθοδήγηση για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 11 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Στρατηγική Επίλυσης",
    heroDesc: "10 δυναμικά προβλήματα καθημερινής ζωής. Διάβασε προσεκτικά την εκφώνηση, αναγνώρισε τα δεδομένα και τα ζητούμενα και εφάρμοσε τη σωστή σειρά πράξεων.",
    heroDynamicNote: "⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαία επιλογή προβλημάτων.",
    btnNewSet: "🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    badgeCorrect: "✓ ΣΩΣΤΟ",
    badgeWrong: "✗ ΛΑΘΟΣ",
    problemLabel: (id, title) => `ΠΡΟΒΛΗΜΑ ${id} • ${title}`,
    inputPlaceholder: "Απάντηση...",
    inputNote: "(Ακέραιος αριθμός)",
    feedbackGreat: "🎉 Εξαιρετικά!",
    feedbackExpl: "💡 Μαθηματική Ανάλυση:",
    givenTitle: "Δεδομένα Προβλήματος",
    correctAnswerLabel: "Σωστή απάντηση:",
    btnCheckMain: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "ΣΚΟΡ",
    answeredLabel: "ΑΠΑΝΤΗΘΗΚΑΝ",
    pctLabel: "ΠΟΣΟΣΤΟ",
    btnCheckBar: "ΕΛΕΓΧΟΣ"
  },
  en: {
    pageTitle: "Exercises: Problem-Solving Strategies - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive real-world word problems with step-by-step mathematical reasoning for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "CHAPTER 11 • GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Problem Solving",
    heroDesc: "10 dynamic everyday word problems. Carefully read the narrative, extract given facts, target quantities, and calculate using the correct operations.",
    heroDynamicNote: "⚡ Each exercise set is dynamically generated with random numbers.",
    btnNewSet: "🔄 NEW EXERCISES",
    badgeCorrect: "✓ CORRECT",
    badgeWrong: "✗ WRONG",
    problemLabel: (id, title) => `PROBLEM ${id} • ${title}`,
    inputPlaceholder: "Answer...",
    inputNote: "(Integer number)",
    feedbackGreat: "🎉 Excellent!",
    feedbackExpl: "💡 Mathematical Breakdown:",
    givenTitle: "Problem Given Data",
    correctAnswerLabel: "Correct answer:",
    btnCheckMain: "🎯 Check Answers",
    scoreLabel: "SCORE",
    answeredLabel: "ANSWERED",
    pctLabel: "PERCENTAGE",
    btnCheckBar: "CHECK"
  }
};

export default function ProblimataExercisesPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = UI_STRINGS[locale];

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = useCallback(() => {
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
    loadNewQuestions();
  }, [loadNewQuestions]);

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

  const isQuestionCorrect = (q) => {
    const userValStr = (answers[`q_${q.id}`] || '').trim();
    const userVal = parseInt(userValStr, 10);
    return !isNaN(userVal) && userVal === q.correctVal;
  };

  const handleCheckAnswers = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitted) return;

    let currentScore = 0;
    questions.forEach((q) => {
      if (isQuestionCorrect(q)) currentScore += 1;
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
          href="/st-dimotikou/11-problimata"
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
              onClick={loadNewQuestions}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation cursor-pointer"
            >
              <span>{t.btnNewSet}</span>
            </button>
          </div>
        </section>

        {/* Φόρμα με τα 10 Προβλήματα */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q) => {
            const correctStatus = isSubmitted ? isQuestionCorrect(q) : false;

            return (
              <article
                key={`problem-${q.id}`}
                className={`bg-white rounded-3xl border p-5 sm:p-8 2xl:p-10 shadow-sm transition-all overflow-hidden ${
                  isSubmitted
                    ? correctStatus
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλίδα Προβλήματος */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg break-words [overflow-wrap:anywhere]">
                    {toCleanUppercase(t.problemLabel(q.id, q.title))}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs 2xl:text-sm font-bold px-3 py-1 rounded-full shrink-0 ${
                        correctStatus
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {correctStatus ? t.badgeCorrect : t.badgeWrong}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση */}
                <div className="space-y-3 mb-5">
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed break-words [overflow-wrap:anywhere] hyphens-auto">
                    {q.text}
                  </p>
                </div>

                {/* Περιοχή Απάντησης */}
                <div className="py-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-700 break-words [overflow-wrap:anywhere]">
                      🎯 {q.target}:
                    </label>
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
                </div>

                {/* Feedback μετά την υποβολή */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-2.5 overflow-hidden ${
                      correctStatus
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{correctStatus ? t.feedbackGreat : t.feedbackExpl}</span>
                    </div>

                    {/* Οργανωμένα Δεδομένα Προβλήματος στην Επεξήγηση */}
                    <div className="bg-white/90 border border-slate-200 p-3 sm:p-3.5 rounded-xl space-y-1.5 my-1 overflow-hidden">
                      <span className="text-[10px] sm:text-xs font-black uppercase text-slate-500 tracking-wider block">
                        📋 {toCleanUppercase(t.givenTitle)}:
                      </span>
                      <ul className="text-xs sm:text-sm text-slate-700 space-y-1 font-medium">
                        {q.given.map((g, gIdx) => (
                          <li key={gIdx} className="flex items-start gap-1.5 break-words [overflow-wrap:anywhere]">
                            <span className="text-emerald-600 font-bold shrink-0">✔</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      className="break-words [overflow-wrap:anywhere]"
                      dangerouslySetInnerHTML={{ __html: q.explain }}
                    />

                    {!correctStatus && (
                      <div className="font-semibold pt-1 text-slate-800 break-words [overflow-wrap:anywhere]">
                        {t.correctAnswerLabel}{' '}
                        <span className="font-mono font-bold text-blue-900">
                          {formatNumber(q.correctStr, locale)}
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
                onClick={loadNewQuestions}
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
// pages/st-dimotikou/11-problimata-ask.js
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

// Δεξαμενή 30 δυναμικών γεννητριών προβλημάτων
const PROBLEM_GENERATORS = [
  // 1. Σχολικά λεωφορεία
  () => {
    const busCapacity = randInt(35, 50);
    const busCount = randInt(3, 8);
    const totalStudents = busCapacity * busCount;
    const ticketPrice = randInt(6, 12);
    const totalCost = totalStudents * ticketPrice;
    return {
      title: 'ΣΧΟΛΙΚΗ ΕΚΔΡΟΜΗ',
      text: `Σε μια σχολική εκδρομή συμμετέχουν ${totalStudents} μαθητές. Αν κάθε λεωφορείο χωράει ${busCapacity} μαθητές και το εισιτήριο κοστίζει ${ticketPrice} € ανά μαθητή, ποιο είναι το συνολικό κόστος των εισιτηρίων;`,
      given: [`Μαθητές: ${totalStudents}`, `Χωρητικότητα: ${busCapacity} θέσεις`, `Τιμή εισιτηρίου: ${ticketPrice} €`],
      target: 'Συνολικό κόστος εισιτηρίων (€)',
      correctVal: totalCost,
      correctStr: String(totalCost),
      explain: `Πολλαπλασιάζουμε το σύνολο των μαθητών με την τιμή του εισιτηρίου: ${totalStudents} · ${ticketPrice} ＝ ${formatNumber(totalCost)} €.`
    };
  },
  // 2. Ψώνια στο μανάβικο & ρέστα
  () => {
    const applesKg = randInt(2, 6);
    const applePrice = randInt(2, 4);
    const orangesKg = randInt(3, 7);
    const orangePrice = randInt(1, 3);
    const totalSpend = (applesKg * applePrice) + (orangesKg * orangePrice);
    const wallet = totalSpend + randInt(5, 25);
    const change = wallet - totalSpend;
    return {
      title: 'ΨΩΝΙΑ ΣΤΟ ΜΑΝΑΒΙΚΟ',
      text: `Ο Νίκος είχε ${wallet} €. Αγόρασε ${applesKg} κιλά μήλα προς ${applePrice} € το κιλό και ${orangesKg} κιλά πορτοκάλια προς ${orangePrice} € το κιλό. Πόσα ρέστα (€) έλαβε;`,
      given: [`Χρήματα: ${wallet} €`, `Μήλα: ${applesKg} κιλά · ${applePrice} €`, `Πορτοκάλια: ${orangesKg} κιλά · ${orangePrice} €`],
      target: 'Ρέστα (€)',
      correctVal: change,
      correctStr: String(change),
      explain: `Έξοδα: (${applesKg} · ${applePrice}) ＋ (${orangesKg} · ${orangePrice}) ＝ ${applesKg * applePrice} ＋ ${orangesKg * orangePrice} ＝ ${totalSpend} €. Ρέστα: ${wallet} － ${totalSpend} ＝ ${change} €.`
    };
  },
  // 3. Βιβλιοθήκη & νέα ράφια
  () => {
    const shelves = randInt(4, 8);
    const perShelf = randInt(20, 35);
    const initial = shelves * perShelf;
    const added = randInt(15, 45);
    const total = initial + added;
    const newShelves = [3, 4, 5, 6].find(n => total % n === 0) || 5;
    const booksPerNew = Math.floor(total / newShelves);
    const finalTotal = booksPerNew * newShelves;
    const actualAdded = finalTotal - initial;
    return {
      title: 'ΑΝΑΔΙΟΡΓΑΝΩΣΗ ΒΙΒΛΙΟΘΗΚΗΣ',
      text: `Μια βιβλιοθήκη είχε ${shelves} ράφια με ${perShelf} βιβλία στο καθένα. Προστέθηκαν ακόμη ${actualAdded} βιβλία και όλα μαζί μοιράστηκαν ισόποσα σε ${newShelves} νέα ράφια. Πόσα βιβλία έχει κάθε νέο ράφι;`,
      given: [`Αρχικά: ${shelves} ράφια · ${perShelf} βιβλία`, `Προστέθηκαν: ${actualAdded} βιβλία`, `Νέα ράφια: ${newShelves}`],
      target: 'Βιβλία ανά νέο ράφι',
      correctVal: booksPerNew,
      correctStr: String(booksPerNew),
      explain: `Αρχικά βιβλία: ${shelves} · ${perShelf} ＝ ${initial}. Σύνολο: ${initial} ＋ ${actualAdded} ＝ ${finalTotal}. Ανά νέο ράφι: ${finalTotal} : ${newShelves} ＝ ${booksPerNew} βιβλία.`
    };
  },
  // 4. Ζαχαροπλαστείο (Συσκευασία σε κουτιά)
  () => {
    const boxes = randInt(12, 25);
    const perBox = randInt(8, 16);
    const totalSweets = boxes * perBox;
    const pricePerBox = randInt(10, 18);
    const totalEarnings = boxes * pricePerBox;
    return {
      title: 'ΖΑΧΑΡΟΠΛΑΣΤΕΙΟ',
      text: `Ένας ζαχαροπλάστης έφτιαξε ${totalSweets} γλυκά και τα συσκεύασε σε κουτιά των ${perBox} τεμαχίων. Αν πούλησε όλα τα κουτιά προς ${pricePerBox} € το καθένα, πόσα χρήματα εισέπραξε συνολικά;`,
      given: [`Σύνολο γλυκών: ${totalSweets}`, `Ανά κουτί: ${perBox} τεμάχια`, `Τιμή ανά κουτί: ${pricePerBox} €`],
      target: 'Συνολική είσπραξη (€)',
      correctVal: totalEarnings,
      correctStr: String(totalEarnings),
      explain: `Κουτιά: ${totalSweets} : ${perBox} ＝ ${boxes}. Είσπραξη: ${boxes} · ${pricePerBox} ＝ ${formatNumber(totalEarnings)} €.`
    };
  },
  // 5. Αποταμίευση & Αγορά Υπολογιστή
  () => {
    const months = randInt(6, 12);
    const monthlySave = randInt(40, 80);
    const totalSaved = months * monthlySave;
    const pcPrice = totalSaved + randInt(50, 150);
    const needed = pcPrice - totalSaved;
    return {
      title: 'ΑΠΟΤΑΜΙΕΥΣΗ ΓΙΑ ΥΠΟΛΟΓΙΣΤΗ',
      text: `Η Ελένη αποταμιεύει ${monthlySave} € κάθε μήνα για ${months} μήνες. Αν ο υπολογιστής που θέλει να αγοράσει κοστίζει ${pcPrice} €, πόσα χρήματα της λείπουν ακόμη;`,
      given: [`Μηνιαία αποταμίευση: ${monthlySave} €`, `Μήνες: ${months}`, `Κόστος υπολογιστή: ${pcPrice} €`],
      target: 'Χρήματα που υπολείπονται (€)',
      correctVal: needed,
      correctStr: String(needed),
      explain: `Αποταμίευση: ${months} · ${monthlySave} ＝ ${totalSaved} €. Υπολείπονται: ${pcPrice} － ${totalSaved} ＝ ${needed} €.`
    };
  },
  // 6. Ελαιοτριβείο & Δοχεία
  () => {
    const trees = randInt(30, 70);
    const oilPerTree = randInt(4, 8);
    const totalOil = trees * oilPerTree;
    const canCapacity = [5, 10].find(c => totalOil % c === 0) || 5;
    const cans = totalOil / canCapacity;
    return {
      title: 'ΣΥΓΚΟΜΙΔΗ ΕΛΑΙΟΛΑΔΟΥ',
      text: `Ένας παραγωγός έχει ${trees} ελαιόδεντρα και κάθε δέντρο έδωσε ${oilPerTree} λίτρα λάδι. Αν έβαλε όλο το λάδι σε δοχεία των ${canCapacity} λίτρων, πόσα δοχεία γέμισε;`,
      given: [`Δέντρα: ${trees}`, `Λίτρα ανά δέντρο: ${oilPerTree}`, `Χωρητικότητα δοχείου: ${canCapacity} L`],
      target: 'Πλήθος δοχείων',
      correctVal: cans,
      correctStr: String(cans),
      explain: `Συνολικό λάδι: ${trees} · ${oilPerTree} ＝ ${totalOil} λίτρα. Δοχεία: ${totalOil} : ${canCapacity} ＝ ${cans} δοχεία.`
    };
  },
  // 7. Εισιτήρια Θεάτρου & Σειρές
  () => {
    const rows = randInt(12, 20);
    const seatsPerRow = randInt(15, 25);
    const totalSeats = rows * seatsPerRow;
    const emptySeats = randInt(15, 45);
    const bookedSeats = totalSeats - emptySeats;
    return {
      title: 'ΘΕΑΤΡΙΚΗ ΠΑΡΑΣΤΑΣΗ',
      text: `Μια αίθουσα θεάτρου έχει ${rows} σειρές με ${seatsPerRow} καθίσματα σε κάθε σειρά. Αν σε μια παράσταση έμειναν κενά ${emptySeats} καθίσματα, πόσα εισιτήρια πουλήθηκαν συνολικά;`,
      given: [`Σειρές: ${rows}`, `Καθίσματα ανά σειρά: ${seatsPerRow}`, `Κενά καθίσματα: ${emptySeats}`],
      target: 'Εισιτήρια που πουλήθηκαν',
      correctVal: bookedSeats,
      correctStr: String(bookedSeats),
      explain: `Συνολικά καθίσματα: ${rows} · ${seatsPerRow} ＝ ${totalSeats}. Εισιτήρια: ${totalSeats} － ${emptySeats} ＝ ${bookedSeats}.`
    };
  },
  // 8. Σχολικός Κήπος & Φυτά
  () => {
    const plots = randInt(4, 9);
    const plantsPerPlot = randInt(15, 30);
    const totalPlants = plots * plantsPerPlot;
    const dried = randInt(5, 18);
    const remaining = totalPlants - dried;
    return {
      title: 'ΣΧΟΛΙΚΟΣ ΛΑΧΑΝΟΚΗΠΟΣ',
      text: `Οι μαθητές φύτεψαν ${plots} παρτέρια με ${plantsPerPlot} φυτά το καθένα. Αν ξεράθηκαν ${dried} φυτά, πόσα φυτά μεγάλωσαν κανονικά;`,
      given: [`Παρτέρια: ${plots}`, `Φυτά ανά παρτέρι: ${plantsPerPlot}`, `Ξεράθηκαν: ${dried}`],
      target: 'Φυτά που μεγάλωσαν',
      correctVal: remaining,
      correctStr: String(remaining),
      explain: `Συνολικά φυτά: ${plots} · ${plantsPerPlot} ＝ ${totalPlants}. Επιβίωσαν: ${totalPlants} － ${dried} ＝ ${remaining} φυτά.`
    };
  },
  // 9. Αρτοποιείο & Φραντζόλες
  () => {
    const trays = randInt(6, 12);
    const loavesPerTray = randInt(14, 25);
    const totalLoaves = trays * loavesPerTray;
    const pricePerLoaf = 2;
    const earnings = totalLoaves * pricePerLoaf;
    return {
      title: 'ΑΡΤΟΠΟΙΕΙΟ',
      text: `Ένας φούρνος έψησε ${trays} λαμαρίνες με ${loavesPerTray} φραντζόλες ψωμί στην καθεμία. Αν πούλησε όλες τις φραντζόλες προς ${pricePerLoaf} € τη μία, ποια ήταν η συνολική του είσπραξη;`,
      given: [`Λαμαρίνες: ${trays}`, `Ψωμιά ανά λαμαρίνα: ${loavesPerTray}`, `Τιμή ανά ψωμί: ${pricePerLoaf} €`],
      target: 'Συνολική είσπραξη (€)',
      correctVal: earnings,
      correctStr: String(earnings),
      explain: `Σύνολο ψωμιών: ${trays} · ${loavesPerTray} ＝ ${totalLoaves}. Είσπραξη: ${totalLoaves} · ${pricePerLoaf} ＝ ${earnings} €.`
    };
  },
  // 10. Αθλητικός Όμιλος & Μπάλες
  () => {
    const boxes = randInt(4, 8);
    const ballsPerBox = randInt(6, 12);
    const totalBalls = boxes * ballsPerBox;
    const distributed = randInt(10, 25);
    const leftInStorage = totalBalls - distributed;
    return {
      title: 'ΑΘΛΗΤΙΚΟΣ ΟΜΙΛΟΣ',
      text: `Ένα γυμναστήριο αγόρασε ${boxes} κουτιά με ${ballsPerBox} μπάλες μπάσκετ το καθένα. Αν μοιράστηκαν στα τμήματα ${distributed} μπάλες, πόσες μπάλες έμειναν στην αποθήκη;`,
      given: [`Κουτιά: ${boxes}`, `Μπάλες ανά κουτί: ${ballsPerBox}`, `Μοιράστηκαν: ${distributed}`],
      target: 'Μπάλες που έμειναν',
      correctVal: leftInStorage,
      correctStr: String(leftInStorage),
      explain: `Συνολικές μπάλες: ${boxes} · ${ballsPerBox} ＝ ${totalBalls}. Έμειναν: ${totalBalls} － ${distributed} ＝ ${leftInStorage}.`
    };
  },
  // 11. Πτηνοτροφείο & Αυγά
  () => {
    const cartons = randInt(15, 30);
    const eggsPerCarton = 12; // 1 ντουζίνα
    const totalEggs = cartons * eggsPerCarton;
    const broken = randInt(4, 15);
    const goodEggs = totalEggs - broken;
    return {
      title: 'ΠΑΡΑΓΩΓΗ ΑΥΓΩΝ',
      text: `Μια φάρμα μάζεψε ${cartons} δωδεκάδες αυγά. Κατά τη μεταφορά έσπασαν ${broken} αυγά. Πόσα ακέραια αυγά έμειναν προς πώληση;`,
      given: [`Δωδεκάδες: ${cartons} (12 αυγά/δωδεκάδα)`, `Έσπασαν: ${broken}`],
      target: 'Ακέραια αυγά',
      correctVal: goodEggs,
      correctStr: String(goodEggs),
      explain: `Συνολικά αυγά: ${cartons} · 12 ＝ ${totalEggs}. Έμειναν: ${totalEggs} － ${broken} ＝ ${goodEggs} αυγά.`
    };
  },
  // 12. Ενοικίαση Ποδηλάτων
  () => {
    const hours = randInt(3, 7);
    const costPerHour = randInt(4, 8);
    const helmets = randInt(2, 5);
    const helmetCost = 2;
    const total = (hours * costPerHour) + (helmets * helmetCost);
    return {
      title: 'ΕΝΟΙΚΙΑΣΗ ΠΟΔΗΛΑΤΩΝ',
      text: `Μια παρέα νοίκιασε ποδήλατα για ${hours} ώρες προς ${costPerHour} € την ώρα και ${helmets} κράνη προς ${helmetCost} € το καθένα. Πόσο πλήρωσε συνολικά;`,
      given: [`Ώρες: ${hours} · ${costPerHour} €/ώρα`, `Κράνη: ${helmets} · ${helmetCost} €`],
      target: 'Συνολικό ποσό πληρωμής (€)',
      correctVal: total,
      correctStr: String(total),
      explain: `Ποδήλατα: ${hours} · ${costPerHour} ＝ ${hours * costPerHour} €. Κράνη: ${helmets} · ${helmetCost} ＝ ${helmets * helmetCost} €. Σύνολο: ${hours * costPerHour} ＋ ${helmets * helmetCost} ＝ ${total} €.`
    };
  },
  // 13. Εργοστάσιο Χυμών (Τετράδες)
  () => {
    const packs = randInt(20, 50);
    const bottlesPerPack = 4;
    const totalBottles = packs * bottlesPerPack;
    const pricePerPack = randInt(3, 6);
    const income = packs * pricePerPack;
    return {
      title: 'ΕΜΦΙΑΛΩΣΗ ΧΥΜΩΝ',
      text: `Ένα εργοστάσιο παρήγαγε ${totalBottles} μπουκάλια χυμό και τα ομαδοποίησε σε 4άδες. Αν πούλησε κάθε τετράδα προς ${pricePerPack} €, ποια είναι η συνολική είσπραξη;`,
      given: [`Μπουκάλια: ${totalBottles}`, `4 μπουκάλια ανά συσκευασία`, `Τιμή ανά συσκευασία: ${pricePerPack} €`],
      target: 'Συνολική είσπραξη (€)',
      correctVal: income,
      correctStr: String(income),
      explain: `Συσκευασίες: ${totalBottles} : 4 ＝ ${packs}. Είσπραξη: ${packs} · ${pricePerPack} ＝ ${income} €.`
    };
  },
  // 14. Ταξίδι & Βενζίνη
  () => {
    const hundredKms = randInt(2, 5); // 200 έως 500 χλμ
    const km = hundredKms * 100;
    const litersPer100Km = randInt(6, 9);
    const totalLiters = hundredKms * litersPer100Km;
    const pricePerLiter = 2;
    const cost = totalLiters * pricePerLiter;
    return {
      title: 'ΤΑΞΙΔΙ ΜΕ ΑΥΤΟΚΙΝΗΤΟ',
      text: `Ένα αυτοκίνητο διανύει ${km} χιλιόμετρα και καταναλώνει ${litersPer100Km} λίτρα βενζίνης ανά 100 χλμ. Αν το λίτρο κοστίζει ${pricePerLiter} €, ποιο είναι το συνολικό κόστος των καυσίμων;`,
      given: [`Απόσταση: ${km} χλμ.`, `Κατανάλωση: ${litersPer100Km} L/100 χλμ.`, `Τιμή βενζίνης: ${pricePerLiter} €/L`],
      target: 'Κόστος καυσίμων (€)',
      correctVal: cost,
      correctStr: String(cost),
      explain: `Συνολικά λίτρα: (${km} : 100) · ${litersPer100Km} ＝ ${totalLiters} L. Κόστος: ${totalLiters} · ${pricePerLiter} ＝ ${cost} €.`
    };
  },
  // 15. Φωτοτυπίες & Έξοδα Σχολείου
  () => {
    const reams = randInt(5, 12);
    const sheetsPerReam = 500;
    const totalSheets = reams * sheetsPerReam;
    const usedSheets = randInt(800, 2000);
    const leftSheets = totalSheets - usedSheets;
    return {
      title: 'ΧΑΡΤΙ ΦΩΤΟΤΥΠΙΚΟΥ',
      text: `Το σχολείο αγόρασε ${reams} δεσμίδες χαρτί με ${sheetsPerReam} φύλλα η καθεμία. Κατά τη διάρκεια του μήνα χρησιμοποιήθηκαν ${usedSheets} φύλλα. Πόσα φύλλα περίσσεψαν;`,
      given: [`Δεσμίδες: ${reams} · ${sheetsPerReam} φύλλα`, `Χρησιμοποιήθηκαν: ${usedSheets} φύλλα`],
      target: 'Φύλλα που περίσσεψαν',
      correctVal: leftSheets,
      correctStr: String(leftSheets),
      explain: `Συνολικά φύλλα: ${reams} · ${sheetsPerReam} ＝ ${totalSheets}. Περίσσεψαν: ${totalSheets} － ${usedSheets} ＝ ${leftSheets} φύλλα.`
    };
  },
  // 16. Συλλογή Αυτοκόλλητων
  () => {
    const packs = randInt(8, 15);
    const stickersPerPack = 5;
    const bought = packs * stickersPerPack;
    const initial = randInt(40, 90);
    const duplicates = randInt(6, 14);
    const totalUnique = initial + bought - duplicates;
    return {
      title: 'ΣΥΛΛΟΓΗ ΑΥΤΟΚΟΛΛΗΤΩΝ',
      text: `Ο Πέτρος είχε ${initial} αυτοκόλλητα στο άλμπουμ του. Αγόρασε ${packs} φακελάκια με ${stickersPerPack} αυτοκόλλητα το καθένα, αλλά ${duplicates} από αυτά ήταν διπλά. Πόσα μοναδικά αυτοκόλλητα έχει τώρα συνολικά;`,
      given: [`Αρχικά: ${initial}`, `Αγόρασε: ${packs} φακελάκια · ${stickersPerPack}`, `Διπλά: ${duplicates}`],
      target: 'Συνολικά μοναδικά αυτοκόλλητα',
      correctVal: totalUnique,
      correctStr: String(totalUnique),
      explain: `Νέα αυτοκόλλητα: ${packs} · ${stickersPerPack} ＝ ${bought}. Σύνολο: ${initial} ＋ ${bought} － ${duplicates} ＝ ${totalUnique}.`
    };
  },
  // 17. Κολυμβητήριο & Προπονήσεις
  () => {
    const weeks = randInt(4, 8);
    const daysPerWeek = randInt(3, 5);
    const lapsPerDay = randInt(20, 40);
    const totalLaps = weeks * daysPerWeek * lapsPerDay;
    return {
      title: 'ΠΡΟΠΟΝΗΣΗ ΚΟΛΥΜΒΗΣΗΣ',
      text: `Η Άννα προπονείται ${daysPerWeek} ημέρες την εβδομάδα και κολυμπάει ${lapsPerDay} γύρους την ημέρα. Πόσους γύρους κολύμπησε συνολικά σε ${weeks} εβδομάδες;`,
      given: [`Εβδομάδες: ${weeks}`, `Ημέρες/εβδομάδα: ${daysPerWeek}`, `Γύροι/ημέρα: ${lapsPerDay}`],
      target: 'Συνολικοί γύροι',
      correctVal: totalLaps,
      correctStr: String(totalLaps),
      explain: `Υπολογισμός: ${weeks} · ${daysPerWeek} · ${lapsPerDay} ＝ ${weeks * daysPerWeek} · ${lapsPerDay} ＝ ${totalLaps} γύροι.`
    };
  },
  // 18. Αγορά Επίπλων με Δόσεις
  () => {
    const advance = randInt(100, 250);
    const months = randInt(6, 12);
    const monthlyInstallment = randInt(30, 60);
    const totalInstallments = months * monthlyInstallment;
    const totalCost = advance + totalInstallments;
    return {
      title: 'ΑΓΟΡΑ ΓΡΑΦΕΙΟΥ ΜΕ ΔΟΣΕΙΣ',
      text: `Για την αγορά ενός γραφείου δόθηκε προκαταβολή ${advance} € και συμφωνήθηκαν ${months} ισόποσες μηνιαίες δόσεις των ${monthlyInstallment} €. Ποια είναι η τελική αξία του γραφείου;`,
      given: [`Προκαταβολή: ${advance} €`, `Δόσεις: ${months} · ${monthlyInstallment} €`],
      target: 'Συνολική αξία (€)',
      correctVal: totalCost,
      correctStr: String(totalCost),
      explain: `Σύνολο δόσεων: ${months} · ${monthlyInstallment} ＝ ${totalInstallments} €. Τελική αξία: ${advance} ＋ ${totalInstallments} ＝ ${totalCost} €.`
    };
  },
  // 19. Φιλανθρωπικός Έρανος
  () => {
    const classes = randInt(6, 12);
    const studentsPerClass = randInt(18, 25);
    const totalStudents = classes * studentsPerClass;
    const amountPerStudent = 3;
    const totalCollected = totalStudents * amountPerStudent;
    return {
      title: 'ΦΙΛΑΝΘΡΩΠΙΚΟΣ ΕΡΑΝΟΣ',
      text: `Σε έναν σχολικό έρανο συμμετείχαν ${classes} τμήματα με ${studentsPerClass} μαθητές το καθένα. Αν κάθε μαθητής πρόσφερε ${amountPerStudent} €, πόσα χρήματα συγκεντρώθηκαν συνολικά;`,
      given: [`Τμήματα: ${classes}`, `Μαθητές/τμήμα: ${studentsPerClass}`, `Προσφορά/μαθητή: ${amountPerStudent} €`],
      target: 'Συνολικό ποσό (€)',
      correctVal: totalCollected,
      correctStr: String(totalCollected),
      explain: `Σύνολο μαθητών: ${classes} · ${studentsPerClass} ＝ ${totalStudents}. Συνολικό ποσό: ${totalStudents} · ${amountPerStudent} ＝ ${totalCollected} €.`
    };
  },
  // 20. Αποθήκη Ηλεκτρονικών
  () => {
    const pallets = randInt(5, 10);
    const boxesPerPallet = randInt(12, 20);
    const itemsPerBox = 10;
    const totalItems = pallets * boxesPerPallet * itemsPerBox;
    return {
      title: 'ΑΠΟΘΗΚΗ ΗΛΕΚΤΡΟΝΙΚΩΝ',
      text: `Σε μια αποθήκη έφτασαν ${pallets} παλέτες. Κάθε παλέτα περιέχει ${boxesPerPallet} κιβώτια και κάθε κιβώτιο έχει μέσα ${itemsPerBox} πληκτρολόγια. Πόσα πληκτρολόγια παραδόθηκαν συνολικά;`,
      given: [`Παλέτες: ${pallets}`, `Κιβώτια/παλέτα: ${boxesPerPallet}`, `Πληκτρολόγια/κιβώτιο: ${itemsPerBox}`],
      target: 'Συνολικά πληκτρολόγια',
      correctVal: totalItems,
      correctStr: String(totalItems),
      explain: `Υπολογισμός: ${pallets} · ${boxesPerPallet} · ${itemsPerBox} ＝ ${pallets * boxesPerPallet} · ${itemsPerBox} ＝ ${totalItems} τεμάχια.`
    };
  },
  // 21. Συσκευασία Σοκολάτας
  () => {
    const totalWeightKg = randInt(12, 30);
    const weightGrams = totalWeightKg * 1000;
    const barWeight = 100;
    const totalBars = weightGrams / barWeight;
    return {
      title: 'ΕΡΓΟΣΤΑΣΙΟ ΣΟΚΟΛΑΤΑΣ',
      text: `Ένα εργαστήριο διαθέτει ${totalWeightKg} κιλά ρευστής σοκολάτας. Αν κάθε πλάκα σοκολάτας ζυγίζει ${barWeight} γραμμάρια, πόσες πλάκες σοκολάτας μπορούν να παραχθούν;`,
      given: [`Σοκολάτα: ${totalWeightKg} kg (${weightGrams} g)`, `Βάρος ανά πλάκα: ${barWeight} g`],
      target: 'Πλήθος πλακών σοκολάτας',
      correctVal: totalBars,
      correctStr: String(totalBars),
      explain: `Μετατρέπουμε σε γραμμάρια: ${totalWeightKg} · 1.000 ＝ ${weightGrams} g. Πλάκες: ${weightGrams} : ${barWeight} ＝ ${totalBars}.`
    };
  },
  // 22. Φυτώριο Δέντρων
  () => {
    const rows = randInt(15, 30);
    const treesPerRow = randInt(12, 25);
    const initialTrees = rows * treesPerRow;
    const soldTrees = randInt(50, 120);
    const remaining = initialTrees - soldTrees;
    return {
      title: 'ΦΥΤΩΡΙΟ ΔΕΝΤΡΩΝ',
      text: `Ένα φυτώριο έχει ${rows} σειρές με ${treesPerRow} δενδρύλλια σε κάθε σειρά. Αν πουλήθηκαν ${soldTrees} δενδρύλλια, πόσα έχουν απομείνει;`,
      given: [`Σειρές: ${rows}`, `Δέντρα/σειρά: ${treesPerRow}`, `Πουλήθηκαν: ${soldTrees}`],
      target: 'Δενδρύλλια που απέμειναν',
      correctVal: remaining,
      correctStr: String(remaining),
      explain: `Αρχικά δέντρα: ${rows} · ${treesPerRow} ＝ ${initialTrees}. Απέμειναν: ${initialTrees} － ${soldTrees} ＝ ${remaining}.`
    };
  },
  // 23. Κινηματογραφικές Προβολές
  () => {
    const ticketPrice = randInt(7, 10);
    const viewersDay1 = randInt(80, 150);
    const viewersDay2 = randInt(90, 160);
    const totalViewers = viewersDay1 + viewersDay2;
    const totalRevenue = totalViewers * ticketPrice;
    return {
      title: 'ΚΙΝΗΜΑΤΟΓΡΑΦΟΣ',
      text: `Σε έναν κινηματογράφο το εισιτήριο κοστίζει ${ticketPrice} €. Το Σάββατο κόπηκαν ${viewersDay1} εισιτήρια και την Κυριακή ${viewersDay2} εισιτήρια. Ποια ήταν η συνολική είσπραξη του διημέρου;`,
      given: [`Τιμή εισιτηρίου: ${ticketPrice} €`, `Σάββατο: ${viewersDay1}`, `Κυριακή: ${viewersDay2}`],
      target: 'Συνολική είσπραξη (€)',
      correctVal: totalRevenue,
      correctStr: String(totalRevenue),
      explain: `Σύνολο θεατών: ${viewersDay1} ＋ ${viewersDay2} ＝ ${totalViewers}. Είσπραξη: ${totalViewers} · ${ticketPrice} ＝ ${formatNumber(totalRevenue)} €.`
    };
  },
  // 24. Κατασκήνωση & Σκηνές
  () => {
    const totalKids = randInt(60, 120);
    const tentCapacity = 6;
    const fullTents = Math.floor(totalKids / tentCapacity);
    const remainder = totalKids % tentCapacity;
    const totalTentsNeeded = remainder === 0 ? fullTents : fullTents + 1;
    return {
      title: 'ΚΑΛΟΚΑΙΡΙΝΗ ΚΑΤΑΣΚΗΝΩΣΗ',
      text: `Σε μια κατασκήνωση φτάνουν ${totalKids} παιδιά. Αν κάθε σκηνή χωράει το πολύ ${tentCapacity} παιδιά, πόσες σκηνές χρειάζονται τουλάχιστον για να κοιμηθούν όλα τα παιδιά;`,
      given: [`Παιδιά: ${totalKids}`, `Χωρητικότητα σκηνής: ${tentCapacity} παιδιά`],
      target: 'Σκηνές που απαιτούνται',
      correctVal: totalTentsNeeded,
      correctStr: String(totalTentsNeeded),
      explain: `Διαίρεση: ${totalKids} : ${tentCapacity} ＝ ${fullTents} με υπόλοιπο ${remainder}. Επειδή πρέπει να κοιμηθούν όλα τα παιδιά, χρειάζονται ${totalTentsNeeded} σκηνές.`
    };
  },
  // 25. Ποδηλατικός Γύρος
  () => {
    const days = 5;
    const kmPerDay = randInt(35, 65);
    const totalKm = days * kmPerDay;
    const doneKm = kmPerDay * 3;
    const leftKm = totalKm - doneKm;
    return {
      title: 'ΠΟΔΗΛΑΤΙΚΟΣ ΓΥΡΟΣ',
      text: `Ένας ποδηλάτης σχεδιάζει να διανύσει συνολικά ${totalKm} χλμ. σε ${days} ημέρες κάνοντας την ίδια απόσταση κάθε μέρα. Μετά από 3 ημέρες ποδηλασίας, πόσα χιλιόμετρα του απομένουν ακόμη;`,
      given: [`Συνολική διαδρομή: ${totalKm} χλμ. σε ${days} ημέρες`, `Ολοκληρώθηκαν: 3 ημέρες`],
      target: 'Χιλιόμετρα που απομένουν',
      correctVal: leftKm,
      correctStr: String(leftKm),
      explain: `Ημερήσια απόσταση: ${totalKm} : ${days} ＝ ${kmPerDay} χλμ. Σε 3 ημέρες διένυσε: 3 · ${kmPerDay} ＝ ${doneKm} χλμ. Απομένουν: ${totalKm} － ${doneKm} ＝ ${leftKm} χλμ.`
    };
  },
  // 26. Εστιατόριο & Τραπέζια
  () => {
    const tables4 = randInt(6, 12);
    const tables6 = randInt(4, 10);
    const totalCapacity = (tables4 * 4) + (tables6 * 6);
    return {
      title: 'ΧΩΡΗΤΙΚΟΤΗΤΑ ΕΣΤΙΑΤΟΡΙΟΥ',
      text: `Ένα εστιατόριο διαθέτει ${tables4} τραπέζια των 4 ατόμων και ${tables6} τραπέζια των 6 ατόμων. Πόσα άτομα μπορούν να καθίσουν συνολικά αν γεμίσουν όλα τα τραπέζια;`,
      given: [`Τραπέζια 4 ατόμων: ${tables4}`, `Τραπέζια 6 ατόμων: ${tables6}`],
      target: 'Συνολική χωρητικότητα ατόμων',
      correctVal: totalCapacity,
      correctStr: String(totalCapacity),
      explain: `Υπολογισμός: (${tables4} · 4) ＋ (${tables6} · 6) ＝ ${tables4 * 4} ＋ ${tables6 * 6} ＝ ${totalCapacity} άτομα.`
    };
  },
  // 27. Επισκευή Σχολικών Θρανίων
  () => {
    const classrooms = randInt(6, 10);
    const desksPerRoom = randInt(12, 18);
    const totalDesks = classrooms * desksPerRoom;
    const fixedDesks = randInt(20, 50);
    const remaining = totalDesks - fixedDesks;
    return {
      title: 'ΣΥΝΤΗΡΗΣΗ ΘΡΑΝΙΩΝ',
      text: `Σε ένα σχολείο με ${classrooms} αίθουσες υπάρχουν ${desksPerRoom} θρανία σε κάθε αίθουσα. Αν επιδιορθώθηκαν ${fixedDesks} θρανία, πόσα θρανία μένουν ακόμη για συντήρηση;`,
      given: [`Αίθουσες: ${classrooms}`, `Θρανία/αίθουσα: ${desksPerRoom}`, `Επιδιορθώθηκαν: ${fixedDesks}`],
      target: 'Θρανία που απομένουν',
      correctVal: remaining,
      correctStr: String(remaining),
      explain: `Σύνολο θρανίων: ${classrooms} · ${desksPerRoom} ＝ ${totalDesks}. Απομένουν: ${totalDesks} － ${fixedDesks} ＝ ${remaining}.`
    };
  },
  // 28. Συσκευασία Μελιού
  () => {
    const totalKg = randInt(40, 100);
    const jarsBig = randInt(10, 20); // 2kg βάζα
    const bigWeight = jarsBig * 2;
    const remainingWeight = totalKg - bigWeight;
    const smallJars = remainingWeight; // 1kg βάζα
    return {
      title: 'ΠΑΡΑΓΩΓΗ ΜΕΛΙΟΥ',
      text: `Ένας μελισσοκόμος μάζεψε ${totalKg} κιλά μέλι. Γέμισε ${jarsBig} βάζα των 2 κιλών και το υπόλοιπο μέλι το έβαλε σε βάζα του 1 κιλού. Πόσα βάζα του 1 κιλού γέμισε;`,
      given: [`Σύνολο μέλι: ${totalKg} kg`, `Βάζα 2 κιλών: ${jarsBig}`, `Υπόλοιπο: βάζα 1 κιλού`],
      target: 'Βάζα του 1 κιλού',
      correctVal: smallJars,
      correctStr: String(smallJars),
      explain: `Μέλι στα μεγάλα βάζα: ${jarsBig} · 2 ＝ ${bigWeight} kg. Υπόλοιπο για μικρά βάζα: ${totalKg} － ${bigWeight} ＝ ${smallJars} βάζα.`
    };
  },
  // 29. Διανομή Εφημερίδων
  () => {
    const days = 7;
    const morningPapers = randInt(80, 150);
    const eveningPapers = randInt(40, 90);
    const totalPerDay = morningPapers + eveningPapers;
    const totalWeek = totalPerDay * days;
    return {
      title: 'ΔΙΑΝΟΜΗ ΕΦΗΜΕΡΙΔΩΝ',
      text: `Ένας διανομέας μοιράζει κάθε μέρα ${morningPapers} πρωινές και ${eveningPapers} απογευματινές εφημερίδες. Πόσες εφημερίδες μοιράζει συνολικά σε μια εβδομάδα (7 ημέρες);`,
      given: [`Πρωινές/ημέρα: ${morningPapers}`, `Απογευματινές/ημέρα: ${eveningPapers}`, `Ημέρες: 7`],
      target: 'Συνολικές εφημερίδες εβδομάδας',
      correctVal: totalWeek,
      correctStr: String(totalWeek),
      explain: `Ημερήσια διανομή: ${morningPapers} ＋ ${eveningPapers} ＝ ${totalPerDay}. Εβδομαδιαία: ${totalPerDay} · 7 ＝ ${formatNumber(totalWeek)} εφημερίδες.`
    };
  },
  // 30. Αγορά Αθλητικού Εξοπλισμού
  () => {
    const shoes = randInt(45, 80);
    const shorts = randInt(15, 30);
    const shirts = randInt(20, 35);
    const total = shoes + shorts + shirts;
    const coupon = randInt(10, 25);
    const finalToPay = total - coupon;
    return {
      title: 'ΑΘΛΗΤΙΚΑ ΕΙΔΗ ΜΕ ΕΚΠΤΩΣΗ',
      text: `Ο Αλέξης αγόρασε παπούτσια αξίας ${shoes} €, ένα σορτσάκι αξίας ${shorts} € και μια μπλούζα αξίας ${shirts} €. Αν χρησιμοποίησε ένα εκπτωτικό κουπόνι ${coupon} €, πόσα χρήματα πλήρωσε τελικά;`,
      given: [`Παπούτσια: ${shoes} €`, `Σορτσάκι: ${shorts} €`, `Μπλούζα: ${shirts} €`, `Κουπόνι: ${coupon} €`],
      target: 'Τελικό ποσό πληρωμής (€)',
      correctVal: finalToPay,
      correctStr: String(finalToPay),
      explain: `Αρχικό κόστος: ${shoes} ＋ ${shorts} ＋ ${shirts} ＝ ${total} €. Μετά την έκπτωση: ${total} － ${coupon} ＝ ${finalToPay} €.`
    };
  }
];

// Δημιουργία 10 τυχαίων προβλημάτων από τη δεξαμενή των 30
function generateQuestions() {
  const shuffledGenerators = shuffle(PROBLEM_GENERATORS);
  return shuffledGenerators.slice(0, 10).map((gen, idx) => ({
    id: idx + 1,
    ...gen()
  }));
}

export default function ProblimataExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργία νέων ασκήσεων
  const loadNewQuestions = useCallback(() => {
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
    loadNewQuestions();
  }, [loadNewQuestions]);

  // Χειρισμός Input μόνο για αριθμητικά ψηφία 0-9
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

  // Έλεγχος εγκυρότητας απάντησης
  const isCorrect = (q) => {
    const userValStr = (answers[`q_${q.id}`] || '').trim();
    const userVal = parseInt(userValStr, 10);
    return !isNaN(userVal) && userVal === q.correctVal;
  };

  // Έλεγχος Απαντήσεων
  const handleCheckAnswers = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitted) return;

    let currentScore = 0;
    questions.forEach((q) => {
      if (isCorrect(q)) currentScore += 1;
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== null && String(val).trim() !== '').length;

  return (
    <Layout
      title="Ασκήσεις: Επίλυση Προβλημάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικά διαδραστικά προβλήματα μαθηματικών με αυτόματη βαθμολόγηση και αναλυτική καθοδήγηση για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/11-problimata"
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
              <span>ΚΕΦΑΛΑΙΟ 11 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ασκήσεις &amp; Προβλήματα: Στρατηγική Επίλυσης
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 δυναμικά προβλήματα καθημερινής ζωής. Διάβασε προσεκτικά την εκφώνηση, αναγνώρισε τα δεδομένα και τα ζητούμενα και εφάρμοσε τη σωστή σειρά πράξεων.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαία επιλογή από 30 προβλήματα.
            </span>
            <button
              type="button"
              onClick={loadNewQuestions}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation"
            >
              <span>🔄 {toCleanUppercase('Νέα 10 Προβλήματα')}</span>
            </button>
          </div>
        </section>

        {/* Φόρμα με τα 10 Προβλήματα */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q) => {
            const correctStatus = isSubmitted ? isCorrect(q) : false;

            return (
              <article
                key={`problem-${q.id}`}
                className={`bg-white rounded-3xl border p-5 sm:p-8 2xl:p-10 shadow-sm transition-all ${
                  isSubmitted
                    ? correctStatus
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλίδα Προβλήματος */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {toCleanUppercase(`ΠΡΟΒΛΗΜΑ ${q.id} • ${q.title}`)}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs 2xl:text-sm font-bold px-3 py-1 rounded-full ${
                        correctStatus
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {correctStatus ? `✓ ${toCleanUppercase('Σωστό')}` : `✗ ${toCleanUppercase('Λάθος')}`}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση */}
                <div className="space-y-3 mb-5">
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed">
                    {q.text}
                  </p>
                </div>

                {/* Περιοχή Απάντησης */}
                <div className="py-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-700">
                      🎯 {q.target}:
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      spellCheck="false"
                      maxLength={10}
                      disabled={isSubmitted}
                      placeholder="Απάντηση..."
                      value={answers[`q_${q.id}`] || ''}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                      className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                    />
                    <span className="text-xs 2xl:text-sm text-slate-500 font-medium">
                      (Ακέραιος αριθμός)
                    </span>
                  </div>
                </div>

                {/* Feedback μετά την υποβολή */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-2.5 ${
                      correctStatus
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{correctStatus ? '🎉 Εξαιρετικά!' : '💡 Μαθηματική Ανάλυση:'}</span>
                    </div>

                    {/* Οργανωμένα Δεδομένα Προβλήματος στην Επεξήγηση */}
                    <div className="bg-white/90 border border-slate-200 p-3 sm:p-3.5 rounded-xl space-y-1.5 my-1">
                      <span className="text-[10px] sm:text-xs font-black uppercase text-slate-500 tracking-wider block">
                        📋 {toCleanUppercase('Δεδομένα Προβλήματος')}:
                      </span>
                      <ul className="text-xs sm:text-sm text-slate-700 space-y-1 font-medium">
                        {q.given.map((g, gIdx) => (
                          <li key={gIdx} className="flex items-center gap-1.5">
                            <span className="text-emerald-600 font-bold">✔</span> {g}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>{q.explain}</div>

                    {!correctStatus && (
                      <div className="font-semibold pt-1 text-slate-800">
                        Σωστή απάντηση:{' '}
                        <span className="font-mono font-bold text-blue-900">
                          {formatNumber(q.correctStr)}
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
                onClick={loadNewQuestions}
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

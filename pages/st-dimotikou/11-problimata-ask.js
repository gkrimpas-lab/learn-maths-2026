import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// Βοηθητικές συναρτήσεις
function getRandomInt(min, max) {
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

function formatNumber(num) {
  if (num === '' || isNaN(num)) return '0';
  return Number(num).toLocaleString('el-GR');
}

// Δεξαμενή 30 δυναμικών γεννητριών προβλημάτων
const PROBLEM_GENERATORS = [
  // 1. Σχολικά λεωφορεία
  () => {
    const busCapacity = getRandomInt(35, 50);
    const busCount = getRandomInt(3, 8);
    const totalStudents = busCapacity * busCount;
    const ticketPrice = getRandomInt(6, 12);
    const totalCost = totalStudents * ticketPrice;
    return {
      title: 'Σχολική Εκδρομή',
      text: `Σε μια εκδρομή συμμετέχουν ${totalStudents} μαθητές. Αν κάθε λεωφορείο χωράει ${busCapacity} μαθητές και το εισιτήριο κοστίζει ${ticketPrice} € ανά μαθητή, ποιο είναι το συνολικό κόστος των εισιτηρίων;`,
      given: [`Μαθητές: ${totalStudents}`, `Χωρητικότητα: ${busCapacity}`, `Τιμή εισιτηρίου: ${ticketPrice} €`],
      target: 'Συνολικό κόστος εισιτηρίων (€)',
      correct: String(totalCost),
      explain: `Πολλαπλασιάζουμε το σύνολο των μαθητών με την τιμή του εισιτηρίου: ${totalStudents} × ${ticketPrice} ＝ ${formatNumber(totalCost)} €.`
    };
  },
  // 2. Ψώνια στο μανάβικο & ρέστα
  () => {
    const applesKg = getRandomInt(2, 6);
    const applePrice = getRandomInt(2, 4);
    const orangesKg = getRandomInt(3, 7);
    const orangePrice = getRandomInt(1, 3);
    const totalSpend = (applesKg * applePrice) + (orangesKg * orangePrice);
    const wallet = totalSpend + getRandomInt(5, 25);
    const change = wallet - totalSpend;
    return {
      title: 'Ψώνια στο Μανάβικο',
      text: `Ο Νίκος είχε ${wallet} €. Αγόρασε ${applesKg} κιλά μήλα προς ${applePrice} € το κιλό και ${orangesKg} κιλά πορτοκάλια προς ${orangePrice} € το κιλό. Πόσα ρέστα πήρε;`,
      given: [`Χρήματα: ${wallet} €`, `Μήλα: ${applesKg} κιλά × ${applePrice} €`, `Πορτοκάλια: ${orangesKg} κιλά × ${orangePrice} €`],
      target: 'Ρέστα (€)',
      correct: String(change),
      explain: `Έξοδα: (${applesKg} × ${applePrice}) ＋ (${orangesKg} × ${orangePrice}) ＝ ${applesKg * applePrice} ＋ ${orangesKg * orangePrice} ＝ ${totalSpend} €. Ρέστα: ${wallet} － ${totalSpend} ＝ ${change} €.`
    };
  },
  // 3. Βιβλιοθήκη & νέα ράφια
  () => {
    const shelves = getRandomInt(4, 8);
    const perShelf = getRandomInt(20, 35);
    const initial = shelves * perShelf;
    const added = getRandomInt(15, 45);
    const total = initial + added;
    const newShelves = [3, 4, 5, 6].find(n => total % n === 0) || 5;
    const booksPerNew = Math.floor(total / newShelves);
    const finalTotal = booksPerNew * newShelves;
    const actualAdded = finalTotal - initial;
    return {
      title: 'Αναδιοργάνωση Βιβλιοθήκης',
      text: `Μια βιβλιοθήκη είχε ${shelves} ράφια με ${perShelf} βιβλία στο καθένα. Προστέθηκαν ακόμη ${actualAdded} βιβλία και όλα μαζί μοιράστηκαν ισότιμα σε ${newShelves} νέα ράφια. Πόσα βιβλία έχει κάθε νέο ράφι;`,
      given: [`Αρχικά: ${shelves} ράφια × ${perShelf} βιβλία`, `Προστέθηκαν: ${actualAdded} βιβλία`, `Νέα ράφια: ${newShelves}`],
      target: 'Βιβλία ανά νέο ράφι',
      correct: String(booksPerNew),
      explain: `Αρχικά βιβλία: ${shelves} × ${perShelf} ＝ ${initial}. Σύνολο: ${initial} ＋ ${actualAdded} ＝ ${finalTotal}. Ανά νέο ράφι: ${finalTotal} : ${newShelves} ＝ ${booksPerNew} βιβλία.`
    };
  },
  // 4. Ζαχαροπλαστείο (Συσκευασία σε κουτιά)
  () => {
    const boxes = getRandomInt(12, 25);
    const perBox = getRandomInt(8, 16);
    const totalSweets = boxes * perBox;
    const pricePerBox = getRandomInt(10, 18);
    const totalEarnings = boxes * pricePerBox;
    return {
      title: 'Ζαχαροπλαστείο',
      text: `Ένας ζαχαροπλάστης έφτιαξε ${totalSweets} γλυκά και τα συσκεύασε σε κουτιά των ${perBox} τεμαχίων. Αν πούλησε όλα τα κουτιά προς ${pricePerBox} € το καθένα, πόσα χρήματα εισέπραξε συνολικά;`,
      given: [`Σύνολο γλυκών: ${totalSweets}`, `Ανά κουτί: ${perBox}`, `Τιμή ανά κουτί: ${pricePerBox} €`],
      target: 'Συνολική είσπραξη (€)',
      correct: String(totalEarnings),
      explain: `Κουτιά: ${totalSweets} : ${perBox} ＝ ${boxes}. Είσπραξη: ${boxes} × ${pricePerBox} ＝ ${formatNumber(totalEarnings)} €.`
    };
  },
  // 5. Αποταμίευση & Αγορά Υπολογιστή
  () => {
    const months = getRandomInt(6, 12);
    const monthlySave = getRandomInt(40, 80);
    const totalSaved = months * monthlySave;
    const pcPrice = totalSaved + getRandomInt(50, 150);
    const needed = pcPrice - totalSaved;
    return {
      title: 'Αποταμίευση για Υπολογιστή',
      text: `Η Ελένη αποταμιεύει ${monthlySave} € κάθε μήνα για ${months} μήνες. Αν ο υπολογιστής που θέλει να αγοράσει κοστίζει ${pcPrice} €, πόσα χρήματα της λείπουν ακόμη;`,
      given: [`Μηνιαία αποταμίευση: ${monthlySave} €`, `Μήνες: ${months}`, `Κόστος υπολογιστή: ${pcPrice} €`],
      target: 'Χρήματα που υπολείπονται (€)',
      correct: String(needed),
      explain: `Αποταμίευση: ${months} × ${monthlySave} ＝ ${totalSaved} €. Υπολείπονται: ${pcPrice} － ${totalSaved} ＝ ${needed} €.`
    };
  },
  // 6. Ελαιοτριβείο & Δοχεία
  () => {
    const trees = getRandomInt(30, 70);
    const oilPerTree = getRandomInt(4, 8);
    const totalOil = trees * oilPerTree;
    const canCapacity = [5, 10].find(c => totalOil % c === 0) || 5;
    const cans = totalOil / canCapacity;
    return {
      title: 'Συγκομιδή Ελαιολάδου',
      text: `Ένας παραγωγός έχει ${trees} ελαιόδεντρα και κάθε δέντρο έδωσε ${oilPerTree} λίτρα λάδι. Αν έβαλε όλο το λάδι σε δοχεία των ${canCapacity} λίτρων, πόσα δοχεία γέμισε;`,
      given: [`Δέντρα: ${trees}`, `Λίτρα ανά δέντρο: ${oilPerTree}`, `Χωρητικότητα δοχείου: ${canCapacity} λ.`],
      target: 'Πλήθος δοχείων',
      correct: String(cans),
      explain: `Συνολικό λάδι: ${trees} × ${oilPerTree} ＝ ${totalOil} λίτρα. Δοχεία: ${totalOil} : ${canCapacity} ＝ ${cans} δοχεία.`
    };
  },
  // 7. Εισιτήρια Θεάτρου & Σειρές
  () => {
    const rows = getRandomInt(12, 20);
    const seatsPerRow = getRandomInt(15, 25);
    const totalSeats = rows * seatsPerRow;
    const emptySeats = getRandomInt(15, 45);
    const bookedSeats = totalSeats - emptySeats;
    return {
      title: 'Θεατρική Παράσταση',
      text: `Μια αίθουσα θεάτρου έχει ${rows} σειρές με ${seatsPerRow} καθίσματα σε κάθε σειρά. Αν σε μια παράσταση έμειναν κενά ${emptySeats} καθίσματα, πόσα εισιτήρια κόπηκαν;`,
      given: [`Σειρές: ${rows}`, `Καθίσματα ανά σειρά: ${seatsPerRow}`, `Κενά καθίσματα: ${emptySeats}`],
      target: 'Εισιτήρια που κόπηκαν',
      correct: String(bookedSeats),
      explain: `Συνολικά καθίσματα: ${rows} × ${seatsPerRow} ＝ ${totalSeats}. Εισιτήρια: ${totalSeats} － ${emptySeats} ＝ ${bookedSeats}.`
    };
  },
  // 8. Σχολικός Κήπος & Φυτά
  () => {
    const plots = getRandomInt(4, 9);
    const plantsPerPlot = getRandomInt(15, 30);
    const totalPlants = plots * plantsPerPlot;
    const dried = getRandomInt(5, 18);
    const remaining = totalPlants - dried;
    return {
      title: 'Σχολικός Λαχανόκηπος',
      text: `Οι μαθητές φύτεψαν ${plots} παρτέρια με ${plantsPerPlot} φυτά το καθένα. Αν ξεράθηκαν ${dried} φυτά, πόσα φυτά μεγάλωσαν κανονικά;`,
      given: [`Παρτέρια: ${plots}`, `Φυτά ανά παρτέρι: ${plantsPerPlot}`, `Ξεράθηκαν: ${dried}`],
      target: 'Φυτά που μεγάλωσαν',
      correct: String(remaining),
      explain: `Συνολικά φυτά: ${plots} × ${plantsPerPlot} ＝ ${totalPlants}. Επιβίωσαν: ${totalPlants} － ${dried} ＝ ${remaining} φυτά.`
    };
  },
  // 9. Αρτοποιείο & Φραντζόλες
  () => {
    const trays = getRandomInt(6, 12);
    const loavesPerTray = getRandomInt(14, 25);
    const totalLoaves = trays * loavesPerTray;
    const pricePerLoaf = 2;
    const earnings = totalLoaves * pricePerLoaf;
    return {
      title: 'Αρτοποιείο',
      text: `Ένας φούρνος έψησε ${trays} λαμαρίνες με ${loavesPerTray} φραντζόλες ψωμί στην καθεμία. Αν πούλησε όλες τις φραντζόλες προς ${pricePerLoaf} € τη μία, ποια ήταν η συνολική του είσπραξη;`,
      given: [`Λαμαρίνες: ${trays}`, `Ψωμιά ανά λαμαρίνα: ${loavesPerTray}`, `Τιμή ανά ψωμί: ${pricePerLoaf} €`],
      target: 'Συνολική είσπραξη (€)',
      correct: String(earnings),
      explain: `Σύνολο ψωμιών: ${trays} × ${loavesPerTray} ＝ ${totalLoaves}. Είσπραξη: ${totalLoaves} × ${pricePerLoaf} ＝ ${earnings} €.`
    };
  },
  // 10. Αθλητικός Όμιλος & Μπάλες
  () => {
    const boxes = getRandomInt(4, 8);
    const ballsPerBox = getRandomInt(6, 12);
    const totalBalls = boxes * ballsPerBox;
    const distributed = getRandomInt(10, 25);
    const leftInStorage = totalBalls - distributed;
    return {
      title: 'Αθλητικός Όμιλος',
      text: `Ένα γυμναστήριο αγόρασε ${boxes} κουτιά με ${ballsPerBox} μπάλες μπάσκετ το καθένα. Αν μοιράστηκαν στα τμήματα ${distributed} μπάλες, πόσες μπάλες έμειναν στην αποθήκη;`,
      given: [`Κουτιά: ${boxes}`, `Μπάλες ανά κουτί: ${ballsPerBox}`, `Μοιράστηκαν: ${distributed}`],
      target: 'Μπάλες που έμειναν',
      correct: String(leftInStorage),
      explain: `Συνολικές μπάλες: ${boxes} × ${ballsPerBox} ＝ ${totalBalls}. Έμειναν: ${totalBalls} － ${distributed} ＝ ${leftInStorage}.`
    };
  },
  // 11. Πτηνοτροφείο & Αυγά
  () => {
    const cartons = getRandomInt(15, 30);
    const eggsPerCarton = 12; // 1 ντουζίνα
    const totalEggs = cartons * eggsPerCarton;
    const broken = getRandomInt(4, 15);
    const goodEggs = totalEggs - broken;
    return {
      title: 'Παραγωγή Αυγών',
      text: `Μια φάρμα μάζεψε ${cartons} δωδεκάδες αυγά. Κατά τη μεταφορά έσπασαν ${broken} αυγά. Πόσα ακέραια αυγά έμειναν προς πώληση;`,
      given: [`Δωδεκάδες: ${cartons} (12 αυγά/δωδεκάδα)`, `Έσπασαν: ${broken}`],
      target: 'Ακέραια αυγά',
      correct: String(goodEggs),
      explain: `Συνολικά αυγά: ${cartons} × 12 ＝ ${totalEggs}. Έμειναν: ${totalEggs} － ${broken} ＝ ${goodEggs} αυγά.`
    };
  },
  // 12. Ενοικίαση Ποδηλάτων
  () => {
    const hours = getRandomInt(3, 7);
    const costPerHour = getRandomInt(4, 8);
    const helmets = getRandomInt(2, 5);
    const helmetCost = 2;
    const total = (hours * costPerHour) + (helmets * helmetCost);
    return {
      title: 'Ενοικίαση Ποδηλάτων',
      text: `Μια παρέα νοίκιασε ποδήλατα για ${hours} ώρες προς ${costPerHour} € την ώρα και ${helmets} κράνη προς ${helmetCost} € το καθένα. Πόσο πλήρωσε συνολικά;`,
      given: [`Ώρες: ${hours} × ${costPerHour} €/ώρα`, `Κράνη: ${helmets} × ${helmetCost} €`],
      target: 'Συνολικό ποσό πληρωμής (€)',
      correct: String(total),
      explain: `Ποδήλατα: ${hours} × ${costPerHour} ＝ ${hours * costPerHour} €. Κράνη: ${helmets} × ${helmetCost} ＝ ${helmets * helmetCost} €. Σύνολο: ${hours * costPerHour} ＋ ${helmets * helmetCost} ＝ ${total} €.`
    };
  },
  // 13. Εργοστάσιο Χυμών (Τετράδες)
  () => {
    const packs = getRandomInt(20, 50);
    const bottlesPerPack = 4;
    const totalBottles = packs * bottlesPerPack;
    const pricePerPack = getRandomInt(3, 6);
    const income = packs * pricePerPack;
    return {
      title: 'Εμφιάλωση Χυμών',
      text: `Ένα εργοστάσιο παρήγαγε ${totalBottles} μπουκάλια χυμό και τα ομαδοποίησε σε 4άδες. Αν πούλησε κάθε τετράδα προς ${pricePerPack} €, ποια είναι η συνολική είσπραξη;`,
      given: [`Μπουκάλια: ${totalBottles}`, `4 μπουκάλια ανά συσκευασία`, `Τιμή ανά συσκευασία: ${pricePerPack} €`],
      target: 'Συνολική είσπραξη (€)',
      correct: String(income),
      explain: `Συσκευασίες: ${totalBottles} : 4 ＝ ${packs}. Είσπραξη: ${packs} × ${pricePerPack} ＝ ${income} €.`
    };
  },
  // 14. Ταξίδι & Βενζίνη
  () => {
    const km = getRandomInt(200, 500);
    const litersPer100Km = getRandomInt(6, 9);
    const totalLiters = (km / 100) * litersPer100Km;
    const pricePerLiter = 2;
    const cost = totalLiters * pricePerLiter;
    return {
      title: 'Ταξίδι με Αυτοκίνητο',
      text: `Ένα αυτοκίνητο διανύει ${km} χιλιόμετρα και καταναλώνει ${litersPer100Km} λίτρα βενζίνη ανά 100 χλμ. Αν το λίτρο κοστίζει ${pricePerLiter} €, ποιο είναι το συνολικό κόστος των καυσίμων;`,
      given: [`Απόσταση: ${km} χλμ.`, `Κατανάλωση: ${litersPer100Km} λ./100 χλμ.`, `Τιμή βενζίνης: ${pricePerLiter} €/λ.`],
      target: 'Κόστος καυσίμων (€)',
      correct: String(Math.round(cost)),
      explain: `Συνολικά λίτρα: (${km} : 100) × ${litersPer100Km} ＝ ${totalLiters} λ. Κόστος: ${totalLiters} × ${pricePerLiter} ＝ ${Math.round(cost)} €.`
    };
  },
  // 15. Φωτοτυπίες & Έξοδα Σχολείου
  () => {
    const reams = getRandomInt(5, 12);
    const sheetsPerReam = 500;
    const totalSheets = reams * sheetsPerReam;
    const usedSheets = getRandomInt(800, 2000);
    const leftSheets = totalSheets - usedSheets;
    return {
      title: 'Χαρτί Φωτοτυπικού',
      text: `Το σχολείο αγόρασε ${reams} δεσμίδες χαρτί με ${sheetsPerReam} φύλλα η καθεμία. Κατά τη διάρκεια του μήνα χρησιμοποιήθηκαν ${usedSheets} φύλλα. Πόσα φύλλα περίσσεψαν;`,
      given: [`Δεσμίδες: ${reams} × ${sheetsPerReam} φύλλα`, `Χρησιμοποιήθηκαν: ${usedSheets} φύλλα`],
      target: 'Φύλλα που περίσσεψαν',
      correct: String(leftSheets),
      explain: `Συνολικά φύλλα: ${reams} × ${sheetsPerReam} ＝ ${totalSheets}. Περίσσεψαν: ${totalSheets} － ${usedSheets} ＝ ${leftSheets} φύλλα.`
    };
  },
  // 16. Συλλογή Αυτοκολλήτων
  () => {
    const packs = getRandomInt(8, 15);
    const stickersPerPack = 5;
    const bought = packs * stickersPerPack;
    const initial = getRandomInt(40, 90);
    const duplicates = getRandomInt(6, 14);
    const totalUnique = initial + bought - duplicates;
    return {
      title: 'Συλλογή Αυτοκολλήτων',
      text: `Ο Πέτρος είχε ${initial} αυτοκόλλητα στο άλμπουμ του. Αγόρασε ${packs} φακελάκια με ${stickersPerPack} αυτοκόλλητα το καθένα, αλλά ${duplicates} από αυτά ήταν διπλά. Πόσα μοναδικά αυτοκόλλητα έχει τώρα συνολικά;`,
      given: [`Αρχικά: ${initial}`, `Αγόρασε: ${packs} φακελάκια × ${stickersPerPack}`, `Διπλά: ${duplicates}`],
      target: 'Συνολικά μοναδικά αυτοκόλλητα',
      correct: String(totalUnique),
      explain: `Νέα αυτοκόλλητα: ${packs} × ${stickersPerPack} ＝ ${bought}. Σύνολο: ${initial} ＋ ${bought} － ${duplicates} ＝ ${totalUnique}.`
    };
  },
  // 17. Κολυμβητήριο & Προπονήσεις
  () => {
    const weeks = getRandomInt(4, 8);
    const daysPerWeek = getRandomInt(3, 5);
    const lapsPerDay = getRandomInt(20, 40);
    const totalLaps = weeks * daysPerWeek * lapsPerDay;
    return {
      title: 'Προπόνηση Κολύμβησης',
      text: `Η Άννα προπονείται ${daysPerWeek} ημέρες την εβδομάδα και κολυμπάει ${lapsPerDay} γύρους την ημέρα. Πόσους γύρους κολύμπησε συνολικά σε ${weeks} εβδομάδες;`,
      given: [`Εβδομάδες: ${weeks}`, `Ημέρες/εβδομάδα: ${daysPerWeek}`, `Γύροι/ημέρα: ${lapsPerDay}`],
      target: 'Συνολικοί γύροι',
      correct: String(totalLaps),
      explain: `Υπολογισμός: ${weeks} × ${daysPerWeek} × ${lapsPerDay} ＝ ${weeks * daysPerWeek} × ${lapsPerDay} ＝ ${totalLaps} γύροι.`
    };
  },
  // 18. Αγορά Επίπλων με Δόσεις
  () => {
    const advance = getRandomInt(100, 250);
    const months = getRandomInt(6, 12);
    const monthlyInstallment = getRandomInt(30, 60);
    const totalInstallments = months * monthlyInstallment;
    const totalCost = advance + totalInstallments;
    return {
      title: 'Αγορά Γραφείου με Δόσεις',
      text: `Για την αγορά ενός γραφείου δόθηκε προκαταβολή ${advance} € και συμφωνήθηκαν ${months} ισόποσες μηνιαίες δόσεις των ${monthlyInstallment} €. Ποια είναι η τελική αξία του γραφείου;`,
      given: [`Προκαταβολή: ${advance} €`, `Δόσεις: ${months} × ${monthlyInstallment} €`],
      target: 'Συνολική αξία (€)',
      correct: String(totalCost),
      explain: `Σύνολο δόσεων: ${months} × ${monthlyInstallment} ＝ ${totalInstallments} €. Τελική αξία: ${advance} ＋ ${totalInstallments} ＝ ${totalCost} €.`
    };
  },
  // 19. Φιλανθρωπικός Έρανος
  () => {
    const classes = getRandomInt(6, 12);
    const studentsPerClass = getRandomInt(18, 25);
    const totalStudents = classes * studentsPerClass;
    const amountPerStudent = 3;
    const totalCollected = totalStudents * amountPerStudent;
    return {
      title: 'Φιλανθρωπικός Έρανος',
      text: `Σε έναν σχολικό έρανο συμμετείχαν ${classes} τμήματα με ${studentsPerClass} μαθητές το καθένα. Αν κάθε μαθητής πρόσφερε ${amountPerStudent} €, πόσα χρήματα συγκεντρώθηκαν συνολικά;`,
      given: [`Τμήματα: ${classes}`, `Μαθητές/τμήμα: ${studentsPerClass}`, `Προσφορά/μαθητή: ${amountPerStudent} €`],
      target: 'Συνολικό ποσό (€)',
      correct: String(totalCollected),
      explain: `Σύνολο μαθητών: ${classes} × ${studentsPerClass} ＝ ${totalStudents}. Συνολικό ποσό: ${totalStudents} × ${amountPerStudent} ＝ ${totalCollected} €.`
    };
  },
  // 20. Αποθήκη Ηλεκτρονικών
  () => {
    const pallets = getRandomInt(5, 10);
    const boxesPerPallet = getRandomInt(12, 20);
    const itemsPerBox = 10;
    const totalItems = pallets * boxesPerPallet * itemsPerBox;
    return {
      title: 'Αποθήκη Ηλεκτρονικών',
      text: `Σε μια αποθήκη έφτασαν ${pallets} παλέτες. Κάθε παλέτα περιέχει ${boxesPerPallet} κιβώτια και κάθε κιβώτιο έχει μέσα ${itemsPerBox} πληκτρολόγια. Πόσα πληκτρολόγια παραδόθηκαν συνολικά;`,
      given: [`Παλέτες: ${pallets}`, `Κιβώτια/παλέτα: ${boxesPerPallet}`, `Πληκτρολόγια/κιβώτιο: ${itemsPerBox}`],
      target: 'Συνολικά πληκτρολόγια',
      correct: String(totalItems),
      explain: `Υπολογισμός: ${pallets} × ${boxesPerPallet} × ${itemsPerBox} ＝ ${pallets * boxesPerPallet} × ${itemsPerBox} ＝ ${totalItems} τεμάχια.`
    };
  },
  // 21. Συσκευασία Σοκολάτας
  () => {
    const totalWeightKg = getRandomInt(12, 30);
    const weightGrams = totalWeightKg * 1000;
    const barWeight = 100;
    const totalBars = weightGrams / barWeight;
    return {
      title: 'Εργοστάσιο Σοκολάτας',
      text: `Μια δεξαμενή περιέχει ${totalWeightKg} κιλά ρευστής σοκολάτας. Αν κάθε πλάκα σοκολάτας ζυγίζει ${barWeight} γραμμάρια, πόσες πλάκες σοκολάτας μπορούν να παραχθούν;`,
      given: [`Σοκολάτα: ${totalWeightKg} κιλά (${weightGrams} γραμμάρια)`, `Βάρος ανά πλάκα: ${barWeight} γρ.`],
      target: 'Πλήθος πλακών σοκολάτας',
      correct: String(totalBars),
      explain: `Μετατρέπουμε σε γραμμάρια: ${totalWeightKg} × 1000 ＝ ${weightGrams} γρ. Πλάκες: ${weightGrams} : ${barWeight} ＝ ${totalBars}.`
    };
  },
  // 22. Φυτώριο Δέντρων
  () => {
    const rows = getRandomInt(15, 30);
    const treesPerRow = getRandomInt(12, 25);
    const initialTrees = rows * treesPerRow;
    const soldTrees = getRandomInt(50, 120);
    const remaining = initialTrees - soldTrees;
    return {
      title: 'Φυτώριο Δέντρων',
      text: `Ένα φυτώριο έχει ${rows} σειρές με ${treesPerRow} δενδρύλλια σε κάθε σειρά. Αν πουλήθηκαν ${soldTrees} δενδρύλλια, πόσα έχουν απομείνει;`,
      given: [`Σειρές: ${rows}`, `Δέντρα/σειρά: ${treesPerRow}`, `Πουλήθηκαν: ${soldTrees}`],
      target: 'Δενδρύλλια που απέμειναν',
      correct: String(remaining),
      explain: `Αρχικά δέντρα: ${rows} × ${treesPerRow} ＝ ${initialTrees}. Απέμειναν: ${initialTrees} － ${soldTrees} ＝ ${remaining}.`
    };
  },
  // 23. Κινηματογραφικές Προβολές
  () => {
    const ticketPrice = getRandomInt(7, 10);
    const viewersDay1 = getRandomInt(80, 150);
    const viewersDay2 = getRandomInt(90, 160);
    const totalViewers = viewersDay1 + viewersDay2;
    const totalRevenue = totalViewers * ticketPrice;
    return {
      title: 'Κινηματογράφος',
      text: `Σε έναν κινηματογράφο το εισιτήριο κοστίζει ${ticketPrice} €. Το Σάββατο κόπηκαν ${viewersDay1} εισιτήρια και την Κυριακή ${viewersDay2} εισιτήρια. Ποια ήταν η συνολική είσπραξη του διημέρου;`,
      given: [`Τιμή εισιτηρίου: ${ticketPrice} €`, `Σάββατο: ${viewersDay1}`, `Κυριακή: ${viewersDay2}`],
      target: 'Συνολική είσπραξη (€)',
      correct: String(totalRevenue),
      explain: `Σύνολο θεατών: ${viewersDay1} ＋ ${viewersDay2} ＝ ${totalViewers}. Είσπραξη: ${totalViewers} × ${ticketPrice} ＝ ${formatNumber(totalRevenue)} €.`
    };
  },
  // 24. Κατασκήνωση & Σκηνές
  () => {
    const totalKids = getRandomInt(60, 120);
    const tentCapacity = 6;
    const fullTents = Math.floor(totalKids / tentCapacity);
    const remainder = totalKids % tentCapacity;
    const totalTentsNeeded = remainder === 0 ? fullTents : fullTents + 1;
    return {
      title: 'Καλοκαιρινή Κατασκήνωση',
      text: `Σε μια κατασκήνωση φτάνουν ${totalKids} παιδιά. Αν κάθε σκηνή χωράει το πολύ ${tentCapacity} παιδιά, πόσες σκηνές χρειάζονται τουλάχιστον για να κοιμηθούν όλα τα παιδιά;`,
      given: [`Παιδιά: ${totalKids}`, `Χωρητικότητα σκηνής: ${tentCapacity}`],
      target: 'Σκηνές που απαιτούνται',
      correct: String(totalTentsNeeded),
      explain: `Διαίρεση: ${totalKids} : ${tentCapacity} ＝ ${fullTents} με υπόλοιπο ${remainder}. Επειδή πρέπει να κοιμηθούν όλα τα παιδιά, χρειάζονται ${totalTentsNeeded} σκηνές.`
    };
  },
  // 25. Ποδηλατικός Γύρος
  () => {
    const days = 5;
    const kmPerDay = getRandomInt(35, 65);
    const totalKm = days * kmPerDay;
    const doneKm = kmPerDay * 3;
    const leftKm = totalKm - doneKm;
    return {
      title: 'Ποδηλατικός Γύρος',
      text: `Ένας ποδηλάτης σχεδιάζει να διανύσει συνολικά ${totalKm} χλμ. σε ${days} ημέρες κάνοντας την ίδια απόσταση κάθε μέρα. Μετά από 3 ημέρες ποδηλασίας, πόσα χιλιόμετρα του απομένουν ακόμη;`,
      given: [`Συνολική διαδρομή: ${totalKm} χλμ. σε ${days} ημέρες`, `Ολοκληρώθηκαν: 3 ημέρες`],
      target: 'Χιλιόμετρα που απομένουν',
      correct: String(leftKm),
      explain: `Ημερήσια απόσταση: ${totalKm} : ${days} ＝ ${kmPerDay} χλμ. Σε 3 ημέρες διένυσε: 3 × ${kmPerDay} ＝ ${doneKm} χλμ. Απομένουν: ${totalKm} － ${doneKm} ＝ ${leftKm} χλμ.`
    };
  },
  // 26. Εστιατόριο & Τραπέζια
  () => {
    const tables4 = getRandomInt(6, 12);
    const tables6 = getRandomInt(4, 10);
    const totalCapacity = (tables4 * 4) + (tables6 * 6);
    return {
      title: 'Χωρητικότητα Εστιατορίου',
      text: `Ένα εστιατόριο διαθέτει ${tables4} τραπέζια των 4 ατόμων και ${tables6} τραπέζια των 6 ατόμων. Πόσα άτομα μπορούν να καθίσουν συνολικά αν γεμίσουν όλα τα τραπέζια;`,
      given: [`Τραπέζια 4 ατόμων: ${tables4}`, `Τραπέζια 6 ατόμων: ${tables6}`],
      target: 'Συνολική χωρητικότητα ατόμων',
      correct: String(totalCapacity),
      explain: `Υπολογισμός: (${tables4} × 4) ＋ (${tables6} × 6) ＝ ${tables4 * 4} ＋ ${tables6 * 6} ＝ ${totalCapacity} άτομα.`
    };
  },
  // 27. Επισκευή Σχολικών Θρανίων
  () => {
    const classrooms = getRandomInt(6, 10);
    const desksPerRoom = getRandomInt(12, 18);
    const totalDesks = classrooms * desksPerRoom;
    const fixedDesks = getRandomInt(20, 50);
    const remaining = totalDesks - fixedDesks;
    return {
      title: 'Συντήρηση Θρανίων',
      text: `Σε ένα σχολείο με ${classrooms} αίθουσες υπάρχουν ${desksPerRoom} θρανία σε κάθε αίθουσα. Αν επιδιορθώθηκαν ${fixedDesks} θρανία, πόσα θρανία μένουν ακόμη για συντήρηση;`,
      given: [`Αίθουσες: ${classrooms}`, `Θρανία/αίθουσα: ${desksPerRoom}`, `Επιδιορθώθηκαν: ${fixedDesks}`],
      target: 'Θρανία που απομένουν',
      correct: String(remaining),
      explain: `Σύνολο θρανίων: ${classrooms} × ${desksPerRoom} ＝ ${totalDesks}. Απομένουν: ${totalDesks} － ${fixedDesks} ＝ ${remaining}.`
    };
  },
  // 28. Συσκευασία Μελιού
  () => {
    const totalKg = getRandomInt(40, 100);
    const jarsBig = getRandomInt(10, 20); // 2kg jars
    const bigWeight = jarsBig * 2;
    const remainingWeight = totalKg - bigWeight;
    const smallJars = remainingWeight; // 1kg jars
    return {
      title: 'Παραγωγή Μελιού',
      text: `Ένας μελισσοκόμος μάζεψε ${totalKg} κιλά μέλι. Έβαλε ${jarsBig} βάζα των 2 κιλών και το υπόλοιπο μέλι το έβαλε σε βάζα του 1 κιλού. Πόσα βάζα του 1 κιλού γέμισε;`,
      given: [`Σύνολο μέλι: ${totalKg} κιλά`, `Βάζα 2 κιλών: ${jarsBig}`, `Υπόλοιπο: βάζα 1 κιλού`],
      target: 'Βάζα του 1 κιλού',
      correct: String(smallJars),
      explain: `Μέλι στα μεγάλα βάζα: ${jarsBig} × 2 ＝ ${bigWeight} κιλά. Υπόλοιπο για μικρά βάζα: ${totalKg} － ${bigWeight} ＝ ${smallJars} βάζα.`
    };
  },
  // 29. Διανομή Εφημερίδων
  () => {
    const days = 7;
    const morningPapers = getRandomInt(80, 150);
    const eveningPapers = getRandomInt(40, 90);
    const totalPerDay = morningPapers + eveningPapers;
    const totalWeek = totalPerDay * days;
    return {
      title: 'Διανομή Εφημερίδων',
      text: `Ένας διανομέας μοιράζει κάθε μέρα ${morningPapers} πρωινές και ${eveningPapers} απογευματινές εφημερίδες. Πόσες εφημερίδες μοιράζει συνολικά σε μια εβδομάδα (7 ημέρες);`,
      given: [`Πρωινές/ημέρα: ${morningPapers}`, `Απογευματινές/ημέρα: ${eveningPapers}`, `Ημέρες: 7`],
      target: 'Συνολικές εφημερίδες εβδομάδας',
      correct: String(totalWeek),
      explain: `Ημερήσια διανομή: ${morningPapers} ＋ ${eveningPapers} ＝ ${totalPerDay}. Εβδομαδιαία: ${totalPerDay} × 7 ＝ ${formatNumber(totalWeek)} εφημερίδες.`
    };
  },
  // 30. Αγορά Αθλητικού Εξοπλισμού
  () => {
    const shoes = getRandomInt(45, 80);
    const shorts = getRandomInt(15, 30);
    const shirts = getRandomInt(20, 35);
    const total = shoes + shorts + shirts;
    const coupon = getRandomInt(10, 25);
    const finalToPay = total - coupon;
    return {
      title: 'Αθλητικά Είδη με Έκπτωση',
      text: `Ο Αλέξης αγόρασε παπούτσια αξίας ${shoes} €, ένα σορτσάκι αξίας ${shorts} € και μια μπλούζα αξίας ${shirts} €. Αν χρησιμοποίησε ένα εκπτωτικό κουπόνι ${coupon} €, πόσα χρήματα πλήρωσε τελικά;`,
      given: [`Παπούτσια: ${shoes} €`, `Σορτσάκι: ${shorts} €`, `Μπλούζα: ${shirts} €`, `Κουπόνι: ${coupon} €`],
      target: 'Τελικό ποσό πληρωμής (€)',
      correct: String(finalToPay),
      explain: `Αρχικό κόστος: ${shoes} ＋ ${shorts} ＋ ${shirts} ＝ ${total} €. Μετά την έκπτωση: ${total} － ${coupon} ＝ ${finalToPay} €.`
    };
  }
];

// Δημιουργία 4 τυχαίων προβλημάτων από τη δεξαμενή των 30
function generateQuestions() {
  const shuffledGenerators = shuffle(PROBLEM_GENERATORS);
  const selected4 = shuffledGenerators.slice(0, 4).map(gen => gen());
  
  return {
    q1: selected4[0],
    q2: selected4[1],
    q3: selected4[2],
    q4: selected4[3]
  };
}

export default function ProblimataExercisesPage() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions());
    setAnswers({ q1: '', q2: '', q3: '', q4: '' });
    setSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    loadNewQuestions();
  }, []);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const isCorrect = (key) => {
    const q = questions[key];
    const a = answers[key];
    if (typeof a !== 'string' || !a.trim()) return false;
    const cleanAns = a.replace(/\./g, '').replace(/\s+/g, '').trim();
    const cleanCorrect = q.correct.replace(/\./g, '').replace(/\s+/g, '').trim();
    return cleanAns === cleanCorrect;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let s = 0;
    ['q1', 'q2', 'q3', 'q4'].forEach(k => {
      if (isCorrect(k)) s += 1;
    });

    setScore(s);
    setSubmitted(true);
  };

  const getCardStyle = (key) => {
    if (!submitted) return 'bg-white border-slate-200 shadow-sm';
    return isCorrect(key)
      ? 'bg-emerald-50/60 border-emerald-400 shadow-md ring-1 ring-emerald-400'
      : 'bg-rose-50/60 border-rose-400 shadow-md ring-1 ring-rose-400';
  };

  const questionKeys = ['q1', 'q2', 'q3', 'q4'];
  const badgeColors = [
    'bg-blue-100 text-blue-800',
    'bg-indigo-100 text-indigo-800',
    'bg-amber-100 text-amber-800',
    'bg-purple-100 text-purple-800'
  ];

  return (
    <Layout
      title="🎯 Ασκήσεις: Επίλυση Προβλημάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικά προβλήματα μαθηματικών με αυτόματη βαθμολόγηση και αναλυτική καθοδήγηση για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link 
          href="/st-dimotikou/11-problimata" 
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span> <span>Θεωρία</span>
        </Link>
      }
    >
      <div className="pb-28">
        {/* HEADER HERO BANNER */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white py-8 sm:py-10 px-4 sm:px-6 rounded-3xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-100 border border-white/20">
                <span>🎯 ΣΤ' Δημοτικου • Εξασκηση</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Επίλυση Προβλημάτων
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Λύσε τα 4 δυναμικά προβλήματα καθημερινότητας, οργάνωσε τα δεδομένα και δες την πλήρη ανάλυση!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewQuestions}
              className="px-5 py-3 bg-white text-blue-800 hover:bg-blue-50 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm flex items-center gap-2 shrink-0"
            >
              <span>🔄</span> <span>Νέα 4 Προβλήματα</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΑ 4 ΠΡΟΒΛΗΜΑΤΑ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {questionKeys.map((key, idx) => {
              const q = questions[key];
              return (
                <div key={key} className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between ${getCardStyle(key)}`}>
                  <div>
                    {/* HEADER BADGE */}
                    <div className="flex justify-between items-center mb-4">
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${badgeColors[idx]}`}>
                        Πρόβλημα {idx + 1} • {q.title}
                      </span>
                      {submitted && (
                        <span className="text-lg">{isCorrect(key) ? '✅' : '❌'}</span>
                      )}
                    </div>

                    {/* PROBLEM TEXT */}
                    <p className="text-sm sm:text-base text-slate-800 mb-4 leading-relaxed font-semibold">
                      «{q.text}»
                    </p>

                    {/* GIVEN DATA PILLS */}
                    <div className="bg-slate-50 border border-slate-200 p-3 sm:p-3.5 rounded-2xl mb-4 space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                        📋 Δεδομένα:
                      </span>
                      <ul className="text-xs text-slate-600 space-y-1 font-medium">
                        {q.given.map((g, gIdx) => (
                          <li key={gIdx} className="flex items-center gap-1.5">
                            <span className="text-emerald-600 font-bold">✔</span> {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* INPUT & EXPLANATION */}
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-black text-slate-600 block">
                        🎯 {q.target}:
                      </label>
                      <input
                        type="text"
                        disabled={submitted}
                        value={answers[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        placeholder="Γράψε τον αριθμό..."
                        className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-center text-lg focus:border-blue-500 outline-none disabled:bg-slate-100 font-mono"
                      />
                    </div>

                    {submitted && (
                      <div className={`p-3.5 rounded-xl text-xs font-medium leading-relaxed ${isCorrect(key) ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                        💡 <strong>Ανάλυση Λύσης:</strong> {q.explain}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="bg-[#10b981] hover:bg-[#059669] text-white text-base md:text-lg font-black px-8 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5"
              >
                <span className="text-xl">🎯</span>
                <span>Έλεγχος Απαντήσεων</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED STICKY BOTTOM SCORE FOOTER (SCORE / 4) */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-3`}>
          
          {/* SCORE BADGE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>Σκορ:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">{score} / 4</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                Ποσοστό: <span className="text-emerald-400 font-black">{Math.round((score / 4) * 100)}%</span>
              </span>
            )}
          </div>

          {/* GUIDANCE TEXT OR RETRY BUTTON */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span>
                <span>Νέα 4 προβλήματα!</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden md:block">
                Συμπλήρωσε τα 4 προβλήματα και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}

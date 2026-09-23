// pages/st-dimotikou/49-methodos-trion-ant-analoga-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

// Τυχαιος ακεραιος στο [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Τυχαια επιλογη απο πινακα
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Δεξαμενη Κανονικων Προβληματων Μεθοδου των Τριων σε Αντιστροφα Ποσα (10 διαφορετικα προβληματα)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'm3_ant_std_1',
    generate: () => {
      const w1 = randInt(2, 4);
      const d1 = randInt(6, 12);
      const totalWork = w1 * d1; // σταθερό γινόμενο
      const w2 = w1 + randInt(2, 4);
      const d2 = totalWork / w2;
      const cleanD2 = Number.isInteger(d2) ? d2 : Number(d2.toFixed(1));
      return {
        text: `Σε ένα έργο ${w1} τεχνικοί χρειάζονται ${d1} ημέρες για να το παραδώσουν. Πόσες ημέρες θα χρειαστούν ${w2} τεχνικοί με τον ίδιο ρυθμό εργασίας;`,
        tableData: { col1: 'Τεχνικοί', col2: 'Ημέρες', r1: [w1, d1], r2: [w2, 'χ'] },
        correctVal: cleanD2,
        correctStr: formatNum(cleanD2),
        explanation: `Τα ποσά είναι αντιστρόφως ανάλογα (περισσότεροι τεχνικοί ➔ λιγότερες ημέρες). Κατάταξη σε στήλες: ${w1} ➔ ${d1} και ${w2} ➔ χ. Εφαρμόζουμε οριζόντιο πολλαπλασιασμό: χ ＝ (${w1} · ${d1}) : ${w2} ＝ ${totalWork} : ${w2} ＝ ${formatNum(cleanD2)} ημέρες.`
      };
    }
  },
  {
    id: 'm3_ant_std_2',
    generate: () => {
      const speed1 = randInt(6, 8) * 10; // π.χ. 60, 70, 80 km/h
      const time1 = randInt(3, 5); // ώρες
      const totalDist = speed1 * time1; // σταθερή απόσταση
      const speed2 = speed1 + 20;
      const time2 = totalDist / speed2;
      const cleanTime2 = Number.isInteger(time2) ? time2 : Number(time2.toFixed(1));
      return {
        text: `Ένα φορτηγό καλύπτει μια απόσταση σε ${time1} ώρες κινούμενο με σταθερή ταχύτητα ${speed1} km/h. Σε πόσες ώρες θα κάλυπτε την ίδια απόσταση αν κινούνταν με ταχύτητα ${speed2} km/h;`,
        tableData: { col1: 'Ταχύτητα (km/h)', col2: 'Χρόνος (h)', r1: [speed1, time1], r2: [speed2, 'χ'] },
        correctVal: cleanTime2,
        correctStr: formatNum(cleanTime2),
        explanation: `Ταχύτητα και χρόνος είναι αντιστρόφως ανάλογα ποσά (μεγαλύτερη ταχύτητα ➔ λιγότερος χρόνος). Οριζόντιος υπολογισμός: χ ＝ (${speed1} · ${time1}) : ${speed2} ＝ ${totalDist} : ${speed2} ＝ ${formatNum(cleanTime2)} ώρες.`
      };
    }
  },
  {
    id: 'm3_ant_std_3',
    generate: () => {
      const taps1 = randInt(2, 3);
      const hours1 = randInt(4, 6);
      const totalCapacity = taps1 * hours1;
      const taps2 = taps1 + randInt(2, 3);
      const hours2 = totalCapacity / taps2;
      const cleanH2 = Number.isInteger(hours2) ? hours2 : Number(hours2.toFixed(1));
      return {
        text: `${taps1} ίδιες αντλίες αδειάζουν μια δεξαμενή σε ${hours1} ώρες. Σε πόσες ώρες θα άδειαζαν την ίδια δεξαμενή ${taps2} ίδιες αντλίες αν άνοιγαν ταυτόχρονα;`,
        tableData: { col1: 'Αντλίες', col2: 'Ώρες', r1: [taps1, hours1], r2: [taps2, 'χ'] },
        correctVal: cleanH2,
        correctStr: formatNum(cleanH2),
        explanation: `Ποσά αντιστρόφως ανάλογα (περισσότερες αντλίες ➔ λιγότερος χρόνος). Οριζόντια γινόμενα: χ ＝ (${taps1} · ${hours1}) : ${taps2} ＝ ${formatNum(cleanH2)} ώρες.`
      };
    }
  },
  {
    id: 'm3_ant_std_4',
    generate: () => {
      const packCapacity = randInt(3, 6) * 50; // g
      const packsCount = randInt(8, 14);
      const totalGrams = packCapacity * packsCount;
      const newPackCap = packCapacity + 50;
      const newPacks = totalGrams / newPackCap;
      const cleanPacks = Number.isInteger(newPacks) ? newPacks : Number(newPacks.toFixed(1));
      return {
        text: `Μια ποσότητα καφέ συσκευάστηκε σε ${packsCount} σακουλάκια των ${packCapacity} g το καθένα. Πόσα σακουλάκια των ${newPackCap} g θα απαιτούνταν για την ίδια ακριβώς ποσότητα;`,
        tableData: { col1: 'Βάρος σακούλας (g)', col2: 'Πλήθος', r1: [packCapacity, packsCount], r2: [newPackCap, 'χ'] },
        correctVal: cleanPacks,
        correctStr: formatNum(cleanPacks),
        explanation: `Χωρητικότητα και πλήθος είναι αντιστρόφως ανάλογα ποσά (μεγαλύτερα σακουλάκια ➔ λιγότερο πλήθος). Οριζόντιος υπολογισμός: χ ＝ (${packCapacity} · ${packsCount}) : ${newPackCap} ＝ ${formatNum(cleanPacks)} σακουλάκια.`
      };
    }
  },
  {
    id: 'm3_ant_std_5',
    generate: () => {
      const persons = randInt(15, 25);
      const costPerPerson = randInt(10, 16);
      const totalRent = persons * costPerPerson;
      const newPersons = persons + 5;
      const newCost = totalRent / newPersons;
      const cleanCost = Number.isInteger(newCost) ? newCost : Number(newCost.toFixed(1));
      return {
        text: `Το κόστος ενοικίασης μιας αίθουσας εκδηλώσεων είναι σταθερό. Αν συμμετάσχουν ${persons} άτομα, το καθένα θα πληρώσει ${costPerPerson} €. Πόσα € θα πληρώσει το καθένα αν συμμετάσχουν τελικά ${newPersons} άτομα;`,
        tableData: { col1: 'Άτομα', col2: 'Κόστος/άτομο (€)', r1: [persons, costPerPerson], r2: [newPersons, 'χ'] },
        correctVal: cleanCost,
        correctStr: formatNum(cleanCost),
        explanation: `Πλήθος ατόμων και κόστος ανά άτομο είναι αντιστρόφως ανάλογα ποσά. Οριζόντια γινόμενα: χ ＝ (${persons} · ${costPerPerson}) : ${newPersons} ＝ ${formatNum(cleanCost)} €.`
      };
    }
  },
  {
    id: 'm3_ant_std_6',
    generate: () => {
      const hoursPerDay1 = randInt(4, 6);
      const days1 = randInt(8, 12);
      const totalHours = hoursPerDay1 * days1;
      const newHoursPerDay = hoursPerDay1 + 2;
      const days2 = totalHours / newHoursPerDay;
      const cleanDays2 = Number.isInteger(days2) ? days2 : Number(days2.toFixed(1));
      return {
        text: `Ένας τεχνίτης τελειώνει μια κατασκευή σε ${days1} ημέρες δουλεύοντας ${hoursPerDay1} ώρες την ημέρα. Σε πόσες ημέρες θα τελείωνε την ίδια κατασκευή αν δούλευε ${newHoursPerDay} ώρες την ημέρα;`,
        tableData: { col1: 'Ώρες ανά ημέρα', col2: 'Ημέρες', r1: [hoursPerDay1, days1], r2: [newHoursPerDay, 'χ'] },
        correctVal: cleanDays2,
        correctStr: formatNum(cleanDays2),
        explanation: `Ημερήσιες ώρες και ημέρες είναι αντιστρόφως ανάλογα ποσά. Οριζόντιος υπολογισμός: χ ＝ (${hoursPerDay1} · ${days1}) : ${newHoursPerDay} ＝ ${formatNum(cleanDays2)} ημέρες.`
      };
    }
  },
  {
    id: 'm3_ant_std_7',
    generate: () => {
      const pipes1 = randInt(2, 4);
      const min1 = randInt(30, 50);
      const totalVolRate = pipes1 * min1;
      const pipes2 = pipes1 + 2;
      const min2 = totalVolRate / pipes2;
      const cleanMin2 = Number.isInteger(min2) ? min2 : Number(min2.toFixed(1));
      return {
        text: `Μια αποχέτευση αδειάζει μια δεξαμενή σε ${min1} λεπτά όταν λειτουργούν ${pipes1} σωλήνες εκροής. Σε πόσα λεπτά θα άδειαζε αν λειτουργούσαν ${pipes2} ίδιοι σωλήνες;`,
        tableData: { col1: 'Σωλήνες', col2: 'Χρόνος (min)', r1: [pipes1, min1], r2: [pipes2, 'χ'] },
        correctVal: cleanMin2,
        correctStr: formatNum(cleanMin2),
        explanation: `Σωλήνες και χρόνος εκκένωσης είναι αντιστρόφως ανάλογα ποσά. Οριζόντια γινόμενα: χ ＝ (${pipes1} · ${min1}) : ${pipes2} ＝ ${formatNum(cleanMin2)} λεπτά.`
      };
    }
  },
  {
    id: 'm3_ant_std_8',
    generate: () => {
      const bottleLit = 1.5;
      const bottlesCount = randInt(16, 28);
      const totalWine = bottleLit * bottlesCount;
      const newBottleLit = 0.75;
      const newCount = totalWine / newBottleLit;
      return {
        text: `Μια ποσότητα κρασιού εμφιαλώθηκε σε ${bottlesCount} φιάλες των 1,5 l η καθεμία. Πόσες φιάλες των 0,75 l θα χρειάζονταν για να εμφιαλωθεί η ίδια ακριβώς ποσότητα;`,
        tableData: { col1: 'Χωρητικότητα (l)', col2: 'Φιάλες', r1: [formatNum(bottleLit), bottlesCount], r2: [formatNum(newBottleLit), 'χ'] },
        correctVal: newCount,
        correctStr: String(newCount),
        explanation: `Χωρητικότητα και πλήθος φιαλών είναι αντιστρόφως ανάλογα ποσά. Οριζόντια γινόμενα: χ ＝ (1,5 · ${bottlesCount}) : 0,75 ＝ ${newCount} φιάλες.`
      };
    }
  },
  {
    id: 'm3_ant_std_9',
    generate: () => {
      const speed1 = 80;
      const time1 = 3;
      const dist = speed1 * time1; // 240
      const speed2 = 120;
      const time2 = dist / speed2; // 2
      return {
        text: `Ένα τρένο ταξιδεύει από την πόλη Α στην πόλη Β σε ${time1} ώρες κινούμενο με μέση ταχύτητα ${speed1} km/h. Πόσες ώρες θα διαρκέσει το ταξίδι αν αυξήσει την ταχύτητά του στα ${speed2} km/h;`,
        tableData: { col1: 'Ταχύτητα (km/h)', col2: 'Χρόνος (h)', r1: [speed1, time1], r2: [speed2, 'χ'] },
        correctVal: time2,
        correctStr: String(time2),
        explanation: `Ταχύτητα και χρόνος είναι αντιστρόφως ανάλογα ποσά (σταθερή απόσταση). Οριζόντιος υπολογισμός: χ ＝ (${speed1} · ${time1}) : ${speed2} ＝ ${time2} ώρες.`
      };
    }
  },
  {
    id: 'm3_ant_std_10',
    generate: () => {
      const tractors1 = randInt(2, 4);
      const days1 = randInt(6, 10);
      const totalPlow = tractors1 * days1;
      const tractors2 = tractors1 + 2;
      const days2 = totalPlow / tractors2;
      const cleanDays2 = Number.isInteger(days2) ? days2 : Number(days2.toFixed(1));
      return {
        text: `${tractors1} τρακτέρ οργώνουν ένα μεγάλο κτήμα σε ${days1} ημέρες. Σε πόσες ημέρες θα όργωναν το ίδιο κτήμα ${tractors2} όμοια τρακτέρ;`,
        tableData: { col1: 'Τρακτέρ', col2: 'Ημέρες', r1: [tractors1, days1], r2: [tractors2, 'χ'] },
        correctVal: cleanDays2,
        correctStr: formatNum(cleanDays2),
        explanation: `Τρακτέρ και ημέρες είναι αντιστρόφως ανάλογα ποσά (περισσότερα μηχανήματα ➔ λιγότερες ημέρες). Οριζόντια γινόμενα: χ ＝ (${tractors1} · ${days1}) : ${tractors2} ＝ ${formatNum(cleanDays2)} ημέρες.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (10 διαφορετικα προβληματα)
const HARD_PROBLEMS_POOL = [
  {
    id: 'm3_ant_hard_1',
    generate: () => {
      const initWorkers = 6;
      const initDays = 20;
      const doneDays = 5;
      const remDays = initDays - doneDays; // 15
      const remWork = initWorkers * remDays; // 90
      const addedWorkers = 3;
      const totalWorkers = initWorkers + addedWorkers; // 9
      const remDaysFinal = remWork / totalWorkers; // 10
      return {
        text: `Μια ομάδα ${initWorkers} εργατών είχε συμφωνήσει να τελειώσει ένα έργο σε ${initDays} ημέρες. Αφού εργάστηκαν μόνοι τους για ${doneDays} ημέρες, προστέθηκαν στην ομάδα άλλοι ${addedWorkers} εργάτες. Σε πόσες ημέρες θα ολοκληρωθεί το υπόλοιπο έργο;`,
        tableData: { col1: 'Εργάτες', col2: 'Ημέρες υπολοίπου', r1: [initWorkers, remDays], r2: [totalWorkers, 'χ'] },
        correctVal: remDaysFinal,
        correctStr: String(remDaysFinal),
        explanation: `Το έργο που απομένει ισοδυναμεί με ${initWorkers} εργάτες για ${remDays} ημέρες (συνολικά ${remWork} μεροκάματα). Τώρα εργάζονται ${totalWorkers} εργάτες. Με οριζόντιο υπολογισμό: χ ＝ (${initWorkers} · ${remDays}) : ${totalWorkers} ＝ 90 : 9 ＝ ${remDaysFinal} ημέρες.`
      };
    }
  },
  {
    id: 'm3_ant_hard_2',
    generate: () => {
      const animals = 30;
      const days = 40;
      const daysPassed = 10;
      const remDays = days - daysPassed; // 30
      const remFood = animals * remDays; // 900
      const animalsSold = 10;
      const remAnimals = animals - animalsSold; // 20
      const extraDays = remFood / remAnimals; // 45
      return {
        text: `Σε έναν στάβλο υπάρχουν ζωοτροφές για ${animals} ζώα για ${days} ημέρες. Μετά από ${daysPassed} ημέρες, πωλούνται ${animalsSold} ζώα. Για πόσες ημέρες ακόμα θα επαρκέσουν οι υπόλοιπες ζωοτροφές για τα ζώα που έμειναν;`,
        tableData: { col1: 'Ζώα', col2: 'Ημέρες που απομένουν', r1: [animals, remDays], r2: [remAnimals, 'χ'] },
        correctVal: extraDays,
        correctStr: String(extraDays),
        explanation: `Οι ζωοτροφές που απομένουν επαρκούν για ${animals} ζώα για ${remDays} ημέρες, δηλαδή ${remFood} μερίδες. Τα ζώα που έμειναν είναι ${remAnimals}. Οριζόντιος υπολογισμός: χ ＝ (${animals} · ${remDays}) : ${remAnimals} ＝ 900 : 20 ＝ ${extraDays} ημέρες.`
      };
    }
  },
  {
    id: 'm3_ant_hard_3',
    generate: () => {
      const length1 = 18; // m
      const width1 = 12; // m
      const area = length1 * width1; // 216 m2
      const length2 = 24; // m
      const width2 = area / length2; // 9 m
      return {
        text: `Ένα ορθογώνιο αγροτεμάχιο έχει σταθερό εμβαδόν. Αν με μήκος ${length1} m το πλάτος του είναι ${width1} m, ποιο θα είναι το πλάτος του σε m αν το μήκος γίνει ${length2} m;`,
        tableData: { col1: 'Μήκος (m)', col2: 'Πλάτος (m)', r1: [length1, width1], r2: [length2, 'χ'] },
        correctVal: width2,
        correctStr: String(width2),
        explanation: `Μήκος και πλάτος είναι αντιστρόφως ανάλογα ποσά (σταθερό εμβαδόν). Οριζόντια γινόμενα: χ ＝ (${length1} · ${width1}) : ${length2} ＝ 216 : 24 ＝ ${width2} m.`
      };
    }
  },
  {
    id: 'm3_ant_hard_4',
    generate: () => {
      const hoursPerDay1 = 8;
      const days1 = 15;
      const totalHours = hoursPerDay1 * days1; // 120 h
      const days2 = 12;
      const reqHoursDay = totalHours / days2; // 10 h
      return {
        text: `Ένα έργο απαιτεί ${days1} ημέρες εργασίας αν οι τεχνίτες δουλεύουν ${hoursPerDay1} ώρες την ημέρα. Πόσες ώρες την ημέρα πρέπει να εργάζονται για να παραδώσουν το ίδιο έργο σε ${days2} ημέρες;`,
        tableData: { col1: 'Ημέρες', col2: 'Ώρες ανά ημέρα', r1: [days1, hoursPerDay1], r2: [days2, 'χ'] },
        correctVal: reqHoursDay,
        correctStr: String(reqHoursDay),
        explanation: `Ημέρες και ημερήσιες ώρες είναι αντιστρόφως ανάλογα ποσά. Οριζόντιος υπολογισμός: χ ＝ (${hoursPerDay1} · ${days1}) : ${days2} ＝ 120 : 12 ＝ ${reqHoursDay} ώρες την ημέρα.`
      };
    }
  },
  {
    id: 'm3_ant_hard_5',
    generate: () => {
      const speed1 = 90; // km/h
      const timeMin1 = 160; // 2 h 40 min = 160 min
      const dist = (speed1 * timeMin1) / 60; // 240 km
      const targetTimeMin = 120; // 2 hours
      const reqSpeed = (dist / targetTimeMin) * 60; // 120 km/h
      return {
        text: `Ένα αυτοκίνητο διανύει μια απόσταση σε 2 ώρες και 40 λεπτά με ταχύτητα ${speed1} km/h. Με ποια ταχύτητα σε km/h πρέπει να κινηθεί για να καλύψει την ίδια διαδρομή σε ακριβώς 2 ώρες;`,
        tableData: { col1: 'Ταχύτητα (km/h)', col2: 'Χρόνος (min)', r1: [speed1, timeMin1], r2: ['χ', targetTimeMin] },
        correctVal: reqSpeed,
        correctStr: String(reqSpeed),
        explanation: `Μετατρέπουμε τον χρόνο σε λεπτά: 2 h 40 min ＝ 160 min και 2 h ＝ 120 min. Η απόσταση είναι σταθερή. Οριζόντιος υπολογισμός: χ ＝ (${speed1} · 160) : 120 ＝ 14.400 : 120 ＝ ${reqSpeed} km/h.`
      };
    }
  },
  {
    id: 'm3_ant_hard_6',
    generate: () => {
      const gearA = 48;
      const rpmA = 150;
      const gearB = 36;
      const rpmB = (gearA * rpmA) / gearB; // 200
      return {
        text: `Σε έναν μηχανισμό, το πρώτο γρανάζι έχει ${gearA} δόντια και περιστρέφεται με ${rpmA} στροφές το λεπτό. Πόσες στροφές το λεπτό εκτελεί το δεύτερο γρανάζι που έχει ${gearB} δόντια;`,
        tableData: { col1: 'Δόντια', col2: 'Στροφές/λεπτό', r1: [gearA, rpmA], r2: [gearB, 'χ'] },
        correctVal: rpmB,
        correctStr: String(rpmB),
        explanation: `Ο αριθμός δοντιών και οι στροφές είναι αντιστρόφως ανάλογα ποσά (σταθερό γινόμενο). Οριζόντια γινόμενα: χ ＝ (${gearA} · ${rpmA}) : ${gearB} ＝ 7.200 : 36 ＝ ${rpmB} στροφές/λεπτό.`
      };
    }
  },
  {
    id: 'm3_ant_hard_7',
    generate: () => {
      const totalEur = 1200;
      // αντιστρόφως ανάλογα των 4 και 6 -> λόγος 6 προς 4 = 3 προς 2 (σύνολο μερών = 5)
      const part1 = 3;
      const part2 = 2;
      const sumParts = part1 + part2;
      const share1 = (totalEur * part1) / sumParts; // 720 €
      return {
        text: `Δύο τεχνικοί μοιράζονται αμοιβή ${totalEur} € αντιστρόφως ανάλογα με τα λάθη που έκαναν. Ο πρώτος έκανε 4 λάθη και ο δεύτερος 6 λάθη. Πόσα € έλαβε ο πρώτος τεχνικός;`,
        tableData: { col1: 'Λάθη', col2: 'Αναλογία μεριδίου', r1: [4, '3 μέρη'], r2: [6, '2 μέρη'] },
        correctVal: share1,
        correctStr: String(share1),
        explanation: `Αντιστρόφως ανάλογα των 4 και 6 σημαίνει ευθέως ανάλογα των κλασμάτων 1/4 και 1/6, δηλαδή σε λόγο 6 : 4 ＝ 3 : 2. Τα συνολικά μέρη είναι 5. Το 1 μέρος αντιστοιχεί σε ${totalEur} : 5 ＝ 240 €. Ο πρώτος έλαβε: 3 · 240 ＝ ${share1} €.`
      };
    }
  },
  {
    id: 'm3_ant_hard_8',
    generate: () => {
      const taps = 4;
      const hours = 15;
      const totalWork = taps * hours; // 60
      const activeTaps = 3;
      const hoursNeeded = totalWork / activeTaps; // 20
      const diffHours = hoursNeeded - hours; // 5
      return {
        text: `Τέσσερις όμοιες βρύσες γεμίζουν μια δεξαμενή σε 15 ώρες. Αν η μία χαλάσει και λειτουργήσουν μόνο οι υπόλοιπες 3, πόσες περισσότερες ώρες θα χρειαστούν για να γεμίσει η δεξαμενή;`,
        tableData: { col1: 'Βρύσες', col2: 'Ώρες', r1: [taps, hours], r2: [activeTaps, 'χ'] },
        correctVal: diffHours,
        correctStr: String(diffHours),
        explanation: `Ποσά αντιστρόφως ανάλογα. Με 3 βρύσες ο χρόνος είναι: χ ＝ (4 · 15) : 3 ＝ 60 : 3 ＝ 20 ώρες. Άρα θα χρειαστούν 20 － 15 ＝ ${diffHours} περισσότερες ώρες.`
      };
    }
  },
  {
    id: 'm3_ant_hard_9',
    generate: () => {
      const soldiers = 120;
      const days = 30;
      const totalRations = soldiers * days; // 3600
      const addedSoldiers = 30;
      const totalSoldiers = soldiers + addedSoldiers; // 150
      const newDays = totalRations / totalSoldiers; // 24
      const lessDays = days - newDays; // 6
      return {
        text: `Σε ένα στρατόπεδο υπάρχουν τρόφιμα για ${soldiers} στρατιώτες για ${days} ημέρες. Αν έρθουν άλλοι ${addedSoldiers} στρατιώτες, πόσες ημέρες λιγότερο θα διαρκέσουν τα τρόφιμα;`,
        tableData: { col1: 'Στρατιώτες', col2: 'Ημέρες', r1: [soldiers, days], r2: [totalSoldiers, 'χ'] },
        correctVal: lessDays,
        correctStr: String(lessDays),
        explanation: `Σταθερό απόθεμα μερίδων. Με ${totalSoldiers} στρατιώτες οι ημέρες είναι: χ ＝ (${soldiers} · ${days}) : ${totalSoldiers} ＝ 3.600 : 150 ＝ 24 ημέρες. Άρα θα διαρκέσουν ${days} － 24 ＝ ${lessDays} ημέρες λιγότερο.`
      };
    }
  },
  {
    id: 'm3_ant_hard_10',
    generate: () => {
      const stepCm = 60;
      const stepsCount = 1200;
      const totalDistCm = stepCm * stepsCount; // 72000 cm = 720 m
      const newStepCm = 80;
      const newSteps = totalDistCm / newStepCm; // 900
      return {
        text: `Ένας περιπατητής με μήκος βήματος ${stepCm} cm κάνει ${stepsCount} βήματα για να καλύψει μια απόσταση. Πόσα βήματα θα κάνει για την ίδια απόσταση ένα άλλο άτομο με μήκος βήματος ${newStepCm} cm;`,
        tableData: { col1: 'Μήκος βήματος (cm)', col2: 'Πλήθος βημάτων', r1: [stepCm, stepsCount], r2: [newStepCm, 'χ'] },
        correctVal: newSteps,
        correctStr: String(newSteps),
        explanation: `Μήκος βήματος και πλήθος βημάτων είναι αντιστρόφως ανάλογα ποσά. Οριζόντιος υπολογισμός: χ ＝ (${stepCm} · ${stepsCount}) : ${newStepCm} ＝ 72.000 : 80 ＝ ${newSteps} βήματα.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Οριζόντιος υπολογισμός στον πίνακα
  {
    const w1 = randInt(2, 5);
    const d1 = randInt(8, 16);
    const total = w1 * d1;
    const w2 = randInt(6, 10);
    const d2 = total / w2;
    const cleanD2 = Number.isInteger(d2) ? d2 : Number(d2.toFixed(1));

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΟΡΙΖΟΝΤΙΑ ΓΙΝΟΜΕΝΑ',
      instruction: 'Υπολογίστε τον άγνωστο όρο χ (αντιστρόφως ανάλογα ποσά):',
      prompt: `Στην κατάταξη της μεθόδου των τριών: ${w1} εργάτες θέλουν ${d1} ημέρες και ${w2} εργάτες θέλουν χ ημέρες. Πόσες ημέρες είναι το χ;`,
      table: { col1: 'Εργάτες', col2: 'Ημέρες', r1: [w1, d1], r2: [w2, 'χ'] },
      correctVal: cleanD2,
      correctStr: formatNum(cleanD2),
      explanation: `Στα αντιστρόφως ανάλογα ποσά εφαρμόζουμε οριζόντιο πολλαπλασιασμό: χ ＝ (${w1} · ${d1}) : ${w2} ＝ ${total} : ${w2} ＝ ${formatNum(cleanD2)} ημέρες.`
    });
  }

  // Q2 (MCQ): Γιατί δεν κάνουμε χιαστί στα αντιστρόφως ανάλογα
  {
    const correctAns = 'Επειδή στα αντιστρόφως ανάλογα ποσά παραμένει σταθερό το γινόμενο της κάθε γραμμής (α₁ · β₁ ＝ α₂ · χ) και όχι το σταυρωτό';
    const fake1 = 'Επειδή στα προβλήματα απαγορεύεται ο πολλαπλασιασμός';
    const fake2 = 'Επειδή το χιαστί εφαρμόζεται μόνο όταν οι αριθμοί είναι δεκαδικοί';
    const fake3 = 'Επειδή στα αντιστρόφως ανάλογα ποσά κάνουμε μόνο διαίρεση';

    const options = [
      { text: correctAns, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • Η ΜΕΓΑΛΗ ΠΑΓΙΔΑ ΤΟΥ ΧΙΑΣΤΙ',
      instruction: 'Επιλέξτε τη σωστή μαθηματική εξήγηση:',
      prompt: `Γιατί στην απλή μέθοδο των τριών με αντιστρόφως ανάλογα ποσά ΔΕΝ εφαρμόζουμε χιαστί πολλαπλασιασμό;`,
      options,
      correctText: correctAns,
      explanation: `Το χιαστί ισχύει μόνο όταν είναι σταθερό το πηλίκο (ανάλογα ποσά). Στα αντιστρόφως ανάλογα ποσά είναι σταθερό το γινόμενο των οριζόντιων γραμμών, άρα πολλαπλασιάζουμε οριζόντια.`
    });
  }

  // Q3 (Input - Decimal): Υπολογισμός νέου χρόνου με σταθερή ταχύτητα
  {
    const sp1 = 60;
    const t1 = randInt(4, 6);
    const dist = sp1 * t1;
    const sp2 = 100;
    const t2 = dist / sp2;
    const cleanT2 = Number.isInteger(t2) ? t2 : Number(t2.toFixed(1));

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΣΤΑΘΕΡΗ ΑΠΟΣΤΑΣΗ & ΤΑΧΥΤΗΤΑ',
      instruction: 'Υπολογίστε τον νέο χρόνο ταξιδιού σε ώρες:',
      prompt: `Ένα αυτοκίνητο καλύπτει μια απόσταση σε ${t1} ώρες με ταχύτητα ${sp1} km/h. Σε πόσες ώρες θα καλύψει την ίδια διαδρομή αν αυξήσει την ταχύτητά του στα ${sp2} km/h;`,
      correctVal: cleanT2,
      correctStr: formatNum(cleanT2),
      explanation: `Σταθερή απόσταση: ${sp1} · ${t1} ＝ ${dist} km. Νέος χρόνος: ${dist} : ${sp2} ＝ ${formatNum(cleanT2)} ώρες.`
    });
  }

  // Q4 (MCQ): Έλεγχος λογικής αποτελέσματος
  {
    const correctLogic = 'Ο χρόνος πρέπει να είναι λιγότερος από τις αρχικές 12 ημέρες';
    const fakeLogic1 = 'Ο χρόνος πρέπει να είναι περισσότερος από τις αρχικές 12 ημέρες';
    const fakeLogic2 = 'Ο χρόνος θα παραμείνει ακριβώς 12 ημέρες';
    const fakeLogic3 = 'Δεν μπορούμε να γνωρίζουμε αν θα αυξηθεί ή θα μειωθεί';

    const options = [
      { text: correctLogic, isCorrect: true },
      { text: fakeLogic1, isCorrect: false },
      { text: fakeLogic2, isCorrect: false },
      { text: fakeLogic3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΕΛΕΓΧΟΣ ΛΟΓΙΚΗΣ ΑΠΟΤΕΛΕΣΜΑΤΟΣ',
      instruction: 'Επιλέξτε τη λογική πρόβλεψη:',
      prompt: `Αν 4 εργάτες τελειώνουν ένα έργο σε 12 ημέρες, τι περιμένουμε για το αποτέλεσμα αν εργαστούν 8 εργάτες;`,
      options,
      correctText: correctLogic,
      explanation: `Εφόσον οι εργάτες διπλασιάστηκαν, ο χρόνος πρέπει υποχρεωτικά να μειωθεί (να υποδιπλασιαστεί σε 6 ημέρες).`
    });
  }

  // Q5 (Input - Decimal): Αναγωγή στη Μονάδα (Βήμα 1)
  {
    const workers = randInt(3, 5);
    const days = randInt(6, 10);
    const totalDays = workers * days;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΑΝΑΓΩΓΗ ΣΤΗ ΜΟΝΑΔΑ',
      instruction: 'Υπολογίστε τον χρόνο που θα χρειαζόταν 1 μόνος εργάτης:',
      prompt: `Αν ${workers} εργάτες ολοκληρώνουν ένα έργο σε ${days} ημέρες, πόσες ημέρες θα χρειαζόταν 1 μόνος εργάτης;`,
      correctVal: totalDays,
      correctStr: String(totalDays),
      explanation: `Στα αντιστρόφως ανάλογα ποσά για το 1 άτομο πολλαπλασιάζουμε: ${workers} · ${days} ＝ ${totalDays} ημέρες.`
    });
  }

  // Q6 (MCQ): Τύπος υπολογισμού στη μέθοδο των τριών
  {
    const correctFormula = 'χ ＝ (α₁ · β₁) : α₂';
    const fakeFormula1 = 'χ ＝ (β₁ · α₂) : α₁';
    const fakeFormula2 = 'χ ＝ (α₁ · α₂) : β₁';
    const fakeFormula3 = 'χ ＝ (α₁ ＋ β₁) : α₂';

    const options = [
      { text: correctFormula, isCorrect: true },
      { text: fakeFormula1, isCorrect: false },
      { text: fakeFormula2, isCorrect: false },
      { text: fakeFormula3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • Ο ΤΥΠΟΣ ΕΠΙΛΥΣΗΣ',
      instruction: 'Επιλέξτε τον σωστό τύπο επίλυσης:',
      prompt: `Στην κατάταξη της μεθόδου των τριών για αντιστρόφως ανάλογα ποσά (α₁ ➔ β₁ και α₂ ➔ χ), ποιος είναι ο σωστός τύπος υπολογισμού του χ;`,
      options,
      correctText: correctFormula,
      explanation: `Επειδή α₁ · β₁ ＝ α₂ · χ, λύνουμε ως προς χ: χ ＝ (α₁ · β₁) : α₂ (οριζόντιο γινόμενο διαιρεμένο με τον γνωστό όρο της δεύτερης γραμμής).`
    });
  }

  // Q7 & Q8: Κανονικά Προβλήματα από τη δεξαμενή (1 Input, 1 MCQ)
  {
    const shuffledStd = [...STANDARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const stdProb1 = shuffledStd[0].generate();
    const stdProb2 = shuffledStd[1].generate();

    // Q7 (Input - Decimal)
    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΜΕΘΟΔΟΥ ΤΩΝ ΤΡΙΩΝ',
      instruction: 'Λύστε το πρόβλημα εφαρμόζοντας τη μέθοδο των τριών:',
      prompt: stdProb1.text,
      table: stdProb1.tableData,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal;
    const fake8A = typeof val8 === 'number' ? formatNum(val8 + randInt(2, 5)) : '0';
    const fake8B = typeof val8 === 'number' ? formatNum(Math.max(1, val8 - randInt(1, 3))) : '0';
    const fake8C = typeof val8 === 'number' ? formatNum(val8 * 1.5) : '0';

    const optionsQ8 = [
      { text: stdProb2.correctStr, isCorrect: true },
      { text: String(fake8A), isCorrect: false },
      { text: String(fake8B), isCorrect: false },
      { text: String(fake8C), isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΤΑΤΑΞΗΣ ΚΑΙ ΕΠΙΛΥΣΗΣ',
      instruction: 'Επιλέξτε τη σωστή τιμή για το πρόβλημα:',
      prompt: stdProb2.text,
      table: stdProb2.tableData,
      options: optionsQ8,
      correctText: stdProb2.correctStr,
      explanation: stdProb2.explanation
    });
  }

  // Q9 & Q10: Προβλήματα Αυξημένης Δυσκολίας (1 Input, 1 MCQ)
  {
    const shuffledHard = [...HARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const hardProb1 = shuffledHard[0].generate();
    const hardProb2 = shuffledHard[1].generate();

    // Q9 (Input - Decimal)
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΑΥΞΗΜΕΝΗΣ ΔΥΣΚΟΛΙΑΣ',
      instruction: 'Προσέξτε τις μονάδες μέτρησης και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: hardProb1.text,
      table: hardProb1.tableData,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal;
    const fake10A = typeof val10 === 'number' ? formatNum(val10 + randInt(3, 8)) : '0';
    const fake10B = typeof val10 === 'number' ? formatNum(Math.max(1, val10 - randInt(2, 6))) : '0';
    const fake10C = typeof val10 === 'number' ? formatNum(val10 * 1.3) : '0';

    const optionsQ10 = [
      { text: hardProb2.correctStr, isCorrect: true },
      { text: String(fake10A), isCorrect: false },
      { text: String(fake10B), isCorrect: false },
      { text: String(fake10C), isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΜΕΤΑΒΟΛΗΣ ΟΜΑΔΑΣ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      table: hardProb2.tableData,
      options: optionsQ10,
      correctText: hardProb2.correctStr,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function MethodosTrionAntAnalogaExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργια νεων ασκησεων
  const loadNewSet = useCallback(() => {
    const q = generateQuestions();
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμος Input με καθαρισμο χαρακτηρων (0-9 και κομμα)
  const handleInputChange = (fieldKey, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/\./g, ',');
    sanitized = sanitized.replace(/[^0-9,]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [fieldKey]: sanitized
    }));
  };

  // Χειρισμος MCQ
  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  // Ελεγχος Απαντησεων
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
      title="Ασκήσεις: Μέθοδος των Τριών στα Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στην απλή μέθοδο των τριών με αντιστρόφως ανάλογα ποσά, οριζόντια γινόμενα και σύνθετες εφαρμογές για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/49-methodos-trion-ant-analoga"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 pb-32">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-14 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ασκήσεις: Μέθοδος των Τριών στα Αντίστροφα Ποσά
            </h1>
            <p className="text-sky-100 text-sm sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Κατατάξτε τα ποσά σε ομώνυμες στήλες και εφαρμόστε οριζόντιο πολλαπλασιασμό χωρίς χιαστί!
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm"
            >
              <span>🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>
          </div>
        </section>

        {/* Λιστα 10 Ασκησεων */}
        <div className="space-y-6">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (isSubmitted) {
              if (q.type === 'mcq') {
                isCorrect = answers[`q_${q.id}`] === q.correctText;
              } else if (q.type === 'decimal_input') {
                const uv = parseFloat((answers[`q_${q.id}`] || '').replace(',', '.'));
                isCorrect = !isNaN(uv) && Math.abs(uv - q.correctVal) < 0.05;
              }
            }

            return (
              <article
                key={`q-${q.id}-${idx}`}
                className={`bg-white rounded-3xl border p-6 sm:p-8 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλιδα Ερωτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {toCleanUppercase(q.title)}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '✓ ΣΩΣΤΟ' : '✗ ΛΑΘΟΣ'}
                    </span>
                  )}
                </div>

                {/* Εκφωνηση */}
                <div className="space-y-3 mb-5">
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    {q.instruction}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>

                  {/* Πινακας Τιμων (αν υπαρχει) */}
                  {q.table && (
                    <div className="inline-block bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 shadow-inner my-2 font-mono text-xs sm:text-sm">
                      <div className="grid grid-cols-2 gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                        <span className="bg-blue-100/60 px-2 py-0.5 rounded-lg text-blue-900">{q.table.col1}</span>
                        <span className="bg-emerald-100/60 px-2 py-0.5 rounded-lg text-emerald-900">{q.table.col2}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2 text-center font-bold text-slate-800">
                        <span>{q.table.r1[0]}</span>
                        <span className="text-indigo-700">{q.table.r1[1]}</span>
                        <span>{q.table.r2[0]}</span>
                        <span className={q.table.r2[1] === 'χ' ? 'text-amber-600 font-black text-base' : 'text-indigo-700'}>
                          {q.table.r2[1]}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs text-slate-500">
                        (Ακέραιος η δεκαδικος με κομμα)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-sm sm:text-base transition active:scale-98 touch-manipulation flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span>{opt.text}</span>
                            <span
                              className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
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
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? '🎉 Εξαιρετικά!' : '💡 Μαθηματική Επεξήγηση:'}</span>
                    </div>
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

        {/* Κουμπι Ελεγχου στο τελος της φορμας */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleCheckAnswers}
            disabled={isSubmitted}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Απαντήσεων</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                ΣΚΟΡ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-base">/ 10</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-xs text-slate-400 font-semibold block">
                ΠΟΣΟΣΤΟ
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
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 touch-manipulation"
              >
                ΕΛΕΓΧΟΣ
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 touch-manipulation"
              >
                🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}

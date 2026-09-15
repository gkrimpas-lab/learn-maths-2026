// pages/st-dimotikou/46-antistrofos-analoga-posa-ask.js
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

// Μορφοποιηση αριθμου (ακεραιος ή δεκαδικος με κομμα)
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Δεξαμενη Κανονικων Προβληματων Αντιστροφως Αναλογων Ποσων (10 διαφορετικα προβληματα)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'antistr_std_1',
    generate: () => {
      const w1 = randInt(2, 4);
      const daysPerWorker = randInt(6, 12);
      const totalWork = w1 * daysPerWorker; // σταθερό γινόμενο
      const w2 = w1 + randInt(2, 4);
      const d2 = totalWork / w2;
      const cleanD2 = Number.isInteger(d2) ? d2 : Number(d2.toFixed(1));
      return {
        text: `Σε ένα εργοτάξιο ${w1} εργάτες τελειώνουν ένα έργο σε ${daysPerWorker} ημέρες. Σε πόσες ημέρες θα ολοκληρώσουν το ίδιο έργο ${w2} εργάτες με τον ίδιο ακριβώς ρυθμό εργασίας;`,
        correctVal: cleanD2,
        correctStr: formatNum(cleanD2),
        explanation: `Οι εργάτες και οι ημέρες είναι αντιστρόφως ανάλογα ποσά (σταθερό γινόμενο). Συνολικά μεροκάματα: ${w1} · ${daysPerWorker} ＝ ${totalWork}. Για ${w2} εργάτες οι ημέρες είναι: ${totalWork} : ${w2} ＝ ${formatNum(cleanD2)} ημέρες.`
      };
    }
  },
  {
    id: 'antistr_std_2',
    generate: () => {
      const speed1 = randInt(6, 8) * 10; // π.χ. 60, 70, 80 km/h
      const time1 = randInt(3, 5); // ώρες
      const totalDist = speed1 * time1; // σταθερό γινόμενο (απόσταση)
      const speed2 = speed1 + 20;
      const time2 = totalDist / speed2;
      const cleanTime2 = Number.isInteger(time2) ? time2 : Number(time2.toFixed(1));
      return {
        text: `Ένα αυτοκίνητο κάλυψε μια διαδρομή σε ${time1} ώρες κινούμενο με σταθερή ταχύτητα ${speed1} km/h. Σε πόσες ώρες θα κάλυπτε την ίδια απόσταση αν κινούνταν με ταχύτητα ${speed2} km/h;`,
        correctVal: cleanTime2,
        correctStr: formatNum(cleanTime2),
        explanation: `Η ταχύτητα και ο χρόνος είναι αντιστρόφως ανάλογα ποσά (σταθερή απόσταση). Απόσταση: ${speed1} · ${time1} ＝ ${totalDist} km. Ο νέος χρόνος είναι: ${totalDist} : ${speed2} ＝ ${formatNum(cleanTime2)} ώρες.`
      };
    }
  },
  {
    id: 'antistr_std_3',
    generate: () => {
      const taps1 = randInt(2, 3);
      const hours1 = randInt(4, 6);
      const totalCapacity = taps1 * hours1; // σταθερό γινόμενο
      const taps2 = taps1 + randInt(2, 3);
      const hours2 = totalCapacity / taps2;
      const cleanH2 = Number.isInteger(hours2) ? hours2 : Number(hours2.toFixed(1));
      return {
        text: `${taps1} ίδιες βρύσες γεμίζουν μια πισίνα σε ${hours1} ώρες. Σε πόσες ώρες θα γέμιζαν την ίδια πισίνα ${taps2} ίδιες βρύσες αν άνοιγαν ταυτόχρονα;`,
        correctVal: cleanH2,
        correctStr: formatNum(cleanH2),
        explanation: `Ο αριθμός των βρυσών και ο χρόνος είναι αντιστρόφως ανάλογα ποσά. Σταθερό γινόμενο: ${taps1} · ${hours1} ＝ ${totalCapacity}. Με ${taps2} βρύσες απαιτούνται: ${totalCapacity} : ${taps2} ＝ ${formatNum(cleanH2)} ώρες.`
      };
    }
  },
  {
    id: 'antistr_std_4',
    generate: () => {
      const packCapacity = randInt(3, 6) * 50; // g ανά σακουλάκι
      const packsCount = randInt(8, 15);
      const totalGrams = packCapacity * packsCount; // σταθερή ποσότητα
      const newPackCap = packCapacity + 50;
      const newPacks = totalGrams / newPackCap;
      const cleanPacks = Number.isInteger(newPacks) ? newPacks : Number(newPacks.toFixed(1));
      return {
        text: `Μια ποσότητα καφέ συσκευάστηκε σε ${packsCount} σακουλάκια των ${packCapacity} g το καθένα. Πόσα σακουλάκια των ${newPackCap} g θα χρειάζονταν για να συσκευαστεί η ίδια ακριβώς ποσότητα καφέ;`,
        correctVal: cleanPacks,
        correctStr: formatNum(cleanPacks),
        explanation: `Η χωρητικότητα και το πλήθος των συσκευασιών είναι αντιστρόφως ανάλογα ποσά. Συνολικός καφές: ${packCapacity} · ${packsCount} ＝ ${totalGrams} g. Νέο πλήθος συσκευασιών: ${totalGrams} : ${newPackCap} ＝ ${formatNum(cleanPacks)} σακουλάκια.`
      };
    }
  },
  {
    id: 'antistr_std_5',
    generate: () => {
      const students = randInt(15, 25);
      const costPerStudent = randInt(8, 14);
      const totalRent = students * costPerStudent; // σταθερό κόστος λεωφορείου
      const newStudents = students + 5;
      const newCost = totalRent / newStudents;
      const cleanCost = Number.isInteger(newCost) ? newCost : Number(newCost.toFixed(1));
      return {
        text: `Το κόστος ενοικίασης ενός πούλμαν για εκδρομή είναι σταθερό. Αν συμμετάσχουν ${students} μαθητές, ο καθένας θα πληρώσει ${costPerStudent} €. Πόσα € θα πληρώσει ο καθένας αν τελικά συμμετάσχουν ${newStudents} μαθητές;`,
        correctVal: cleanCost,
        correctStr: formatNum(cleanCost),
        explanation: `Το πλήθος των μαθητών και το ποσό ανά μαθητή είναι αντιστρόφως ανάλογα ποσά. Συνολικό κόστος: ${students} · ${costPerStudent} ＝ ${totalRent} €. Νέο ποσό ανά μαθητή: ${totalRent} : ${newStudents} ＝ ${formatNum(cleanCost)} €.`
      };
    }
  },
  {
    id: 'antistr_std_6',
    generate: () => {
      const hoursPerDay = randInt(4, 6);
      const days1 = randInt(8, 12);
      const totalHours = hoursPerDay * days1;
      const newHoursPerDay = hoursPerDay + 2;
      const days2 = totalHours / newHoursPerDay;
      const cleanDays2 = Number.isInteger(days2) ? days2 : Number(days2.toFixed(1));
      return {
        text: `Ένας συγγραφέας ολοκληρώνει ένα βιβλίο σε ${days1} ημέρες δουλεύοντας ${hoursPerDay} ώρες την ημέρα. Σε πόσες ημέρες θα ολοκλήρωνε το βιβλίο αν εργαζόταν ${newHoursPerDay} ώρες την ημέρα;`,
        correctVal: cleanDays2,
        correctStr: formatNum(cleanDays2),
        explanation: `Οι ημερήσιες ώρες και οι ημέρες είναι αντιστρόφως ανάλογα ποσά. Συνολικός χρόνος: ${hoursPerDay} · ${days1} ＝ ${totalHours} ώρες. Νέες ημέρες: ${totalHours} : ${newHoursPerDay} ＝ ${formatNum(cleanDays2)} ημέρες.`
      };
    }
  },
  {
    id: 'antistr_std_7',
    generate: () => {
      const pipes1 = randInt(2, 4);
      const min1 = randInt(30, 50);
      const totalVolRate = pipes1 * min1;
      const pipes2 = pipes1 + 2;
      const min2 = totalVolRate / pipes2;
      const cleanMin2 = Number.isInteger(min2) ? min2 : Number(min2.toFixed(1));
      return {
        text: `Μια αποχέτευση αδειάζει μια δεξαμενή σε ${min1} λεπτά με ${pipes1} σωλήνες εκροής. Σε πόσα λεπτά θα άδειαζε η δεξαμενή αν λειτουργούσαν ${pipes2} ίδιοι σωλήνες;`,
        correctVal: cleanMin2,
        correctStr: formatNum(cleanMin2),
        explanation: `Σταθερό γινόμενο: ${pipes1} · ${min1} ＝ ${totalVolRate}. Με ${pipes2} σωλήνες ο χρόνος είναι: ${totalVolRate} : ${pipes2} ＝ ${formatNum(cleanMin2)} λεπτά.`
      };
    }
  },
  {
    id: 'antistr_std_8',
    generate: () => {
      const bottleLit = 1.5;
      const bottlesCount = randInt(16, 28);
      const totalWine = bottleLit * bottlesCount;
      const newBottleLit = 0.75;
      const newCount = totalWine / newBottleLit;
      return {
        text: `Μια ποσότητα κρασιού εμφιαλώθηκε σε ${bottlesCount} φιάλες των 1,5 l η καθεμία. Πόσες φιάλες των 0,75 l θα χρειάζονταν για να εμφιαλωθεί η ίδια ποσότητα κρασιού;`,
        correctVal: newCount,
        correctStr: String(newCount),
        explanation: `Η χωρητικότητα και το πλήθος φιαλών είναι αντιστρόφως ανάλογα ποσά. Συνολικό κρασί: 1,5 · ${bottlesCount} ＝ ${totalWine} l. Με φιάλες 0,75 l: ${totalWine} : 0,75 ＝ ${newCount} φιάλες.`
      };
    }
  },
  {
    id: 'antistr_std_9',
    generate: () => {
      const speed1 = 80;
      const time1 = 3;
      const dist = speed1 * time1; // 240
      const speed2 = 120;
      const time2 = dist / speed2; // 2
      return {
        text: `Ένα τρένο ταξιδεύει από την πόλη Α στην πόλη Β σε ${time1} ώρες με ταχύτητα ${speed1} km/h. Πόσες ώρες θα διαρκέσει το ταξίδι αν αυξήσει την ταχύτητά του στα ${speed2} km/h;`,
        correctVal: time2,
        correctStr: String(time2),
        explanation: `Η ταχύτητα και ο χρόνος είναι αντιστρόφως ανάλογα ποσά. Απόσταση: ${speed1} · ${time1} ＝ ${dist} km. Νέος χρόνος: ${dist} : ${speed2} ＝ ${time2} ώρες.`
      };
    }
  },
  {
    id: 'antistr_std_10',
    generate: () => {
      const tractors1 = randInt(3, 5);
      const days1 = randInt(6, 10);
      const totalPlow = tractors1 * days1;
      const tractors2 = tractors1 + 2;
      const days2 = totalPlow / tractors2;
      const cleanDays2 = Number.isInteger(days2) ? days2 : Number(days2.toFixed(1));
      return {
        text: `${tractors1} ίδια τρακτέρ οργώνουν ένα κτήμα σε ${days1} ημέρες. Σε πόσες ημέρες θα όργωναν το ίδιο κτήμα ${tractors2} ίδια τρακτέρ;`,
        correctVal: cleanDays2,
        correctStr: formatNum(cleanDays2),
        explanation: `Τα τρακτέρ και οι ημέρες είναι αντιστρόφως ανάλογα ποσά. Σταθερό γινόμενο: ${tractors1} · ${days1} ＝ ${totalPlow}. Με ${tractors2} τρακτέρ: ${totalPlow} : ${tractors2} ＝ ${formatNum(cleanDays2)} ημέρες.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (10 διαφορετικα προβληματα)
const HARD_PROBLEMS_POOL = [
  {
    id: 'antistr_hard_1',
    generate: () => {
      const initialWorkers = 6;
      const initialDays = 20;
      const totalWork = initialWorkers * initialDays; // 120
      const workDoneDays = 5;
      const remainingWork = initialWorkers * (initialDays - workDoneDays); // 90
      const addedWorkers = 3;
      const totalWorkersNow = initialWorkers + addedWorkers; // 9
      const remainingDays = remainingWork / totalWorkersNow; // 10
      return {
        text: `Μια ομάδα ${initialWorkers} εργατών ανέλαβε να ολοκληρώσει ένα έργο σε ${initialDays} ημέρες. Αφού εργάστηκαν μόνοι τους για ${workDoneDays} ημέρες, προστέθηκαν στην ομάδα άλλοι ${addedWorkers} εργάτες. Σε πόσες ημέρες θα ολοκληρωθεί το υπόλοιπο του έργου;`,
        correctVal: remainingDays,
        correctStr: String(remainingDays),
        explanation: `Το έργο που απομένει ισοδυναμεί με: ${initialWorkers} εργάτες · (${initialDays} － ${workDoneDays}) ημέρες ＝ ${initialWorkers} · ${initialDays - workDoneDays} ＝ ${remainingWork} μεροκάματα. Τώρα εργάζονται ${initialWorkers} ＋ ${addedWorkers} ＝ ${totalWorkersNow} εργάτες. Οι ημέρες που απομένουν είναι: ${remainingWork} : ${totalWorkersNow} ＝ ${remainingDays} ημέρες.`
      };
    }
  },
  {
    id: 'antistr_hard_2',
    generate: () => {
      const animals = 30;
      const days = 40;
      const totalFood = animals * days; // 1200 μερίδες
      const daysPassed = 10;
      const remainingFood = animals * (days - daysPassed); // 900
      const animalsLeft = animals - 10; // 20
      const extraDays = remainingFood / animalsLeft; // 45
      return {
        text: `Σε έναν στάβλο υπάρχουν ζωοτροφές που επαρκούν για ${animals} ζώα για ${days} ημέρες. Μετά από ${daysPassed} ημέρες, πωλούνται 10 ζώα. Για πόσες ημέρες ακόμα θα επαρκέσουν οι υπόλοιπες ζωοτροφές για τα ζώα που έμειναν;`,
        correctVal: extraDays,
        correctStr: String(extraDays),
        explanation: `Οι ζωοτροφές που απέμειναν επαρκούν για ${animals} ζώα για ${days - daysPassed} ημέρες, δηλαδή ${animals} · ${days - daysPassed} ＝ ${remainingFood} ημερήσιες μερίδες. Τα ζώα που έμειναν είναι ${animalsLeft}. Οι ημέρες που θα διαρκέσουν είναι: ${remainingFood} : ${animalsLeft} ＝ ${extraDays} ημέρες.`
      };
    }
  },
  {
    id: 'antistr_hard_3',
    generate: () => {
      const length1 = 18; // m
      const width1 = 12; // m
      const area = length1 * width1; // 216 m2 (σταθερό εμβαδόν)
      const length2 = 24; // m
      const width2 = area / length2; // 9 m
      return {
        text: `Σε ένα ορθογώνιο οικόπεδο με σταθερό εμβαδόν, το μήκος και το πλάτος είναι αντιστρόφως ανάλογα ποσά. Αν με μήκος ${length1} m το πλάτος είναι ${width1} m, ποιο θα είναι το πλάτος σε m αν το μήκος γίνει ${length2} m;`,
        correctVal: width2,
        correctStr: String(width2),
        explanation: `Το εμβαδόν παραμένει σταθερό: Ε ＝ μήκος · πλάτος ＝ ${length1} · ${width1} ＝ ${area} m². Με νέο μήκος ${length2} m, το πλάτος είναι: ${area} : ${length2} ＝ ${width2} m.`
      };
    }
  },
  {
    id: 'antistr_hard_4',
    generate: () => {
      const hoursPerDay1 = 8;
      const days1 = 15;
      const totalHours = hoursPerDay1 * days1; // 120 h
      const days2 = 12;
      const reqHoursPerDay = totalHours / days2; // 10 h
      return {
        text: `Ένα έργο απαιτεί ${days1} ημέρες εργασίας αν οι τεχνίτες δουλεύουν ${hoursPerDay1} ώρες την ημέρα. Πόσες ώρες την ημέρα πρέπει να εργάζονται για να παραδώσουν το ίδιο έργο σε ${days2} ημέρες;`,
        correctVal: reqHoursPerDay,
        correctStr: String(reqHoursPerDay),
        explanation: `Οι ημερήσιες ώρες και οι ημέρες είναι αντιστρόφως ανάλογα ποσά. Συνολικές ώρες έργου: ${hoursPerDay1} · ${days1} ＝ ${totalHours} ώρες. Για να τελειώσει σε ${days2} ημέρες απαιτούνται: ${totalHours} : ${days2} ＝ ${reqHoursPerDay} ώρες την ημέρα.`
      };
    }
  },
  {
    id: 'antistr_hard_5',
    generate: () => {
      const speed1 = 90; // km/h
      const time1Hours = 2;
      const time1Minutes = 40; // 2h 40min = 160 min
      const totalMinutes = time1Hours * 60 + time1Minutes; // 160 min
      const dist = (speed1 * totalMinutes) / 60; // 240 km
      const targetTimeMinutes = 120; // 2 hours
      const reqSpeed = (dist / targetTimeMinutes) * 60; // 120 km/h
      return {
        text: `Ένα αυτοκίνητο διανύει μια απόσταση σε 2 ώρες και 40 λεπτά με σταθερή ταχύτητα ${speed1} km/h. Με ποια ταχύτητα σε km/h πρέπει να κινηθεί για να καλύψει την ίδια διαδρομή σε ακριβώς 2 ώρες;`,
        correctVal: reqSpeed,
        correctStr: String(reqSpeed),
        explanation: `Εκφράζουμε τον χρόνο σε λεπτά: 2 h 40 min ＝ 160 min και 2 h ＝ 120 min. Η απόσταση είναι σταθερή. Ταχύτητα και χρόνος είναι αντιστρόφως ανάλογα: ${speed1} · 160 ＝ υ · 120 ➔ υ ＝ (${speed1} · 160) : 120 ＝ 14.400 : 120 ＝ ${reqSpeed} km/h.`
      };
    }
  },
  {
    id: 'antistr_hard_6',
    generate: () => {
      const gearA = 48; // δόντια
      const rpmA = 150; // στροφές/λεπτό
      const gearB = 36;
      const rpmB = (gearA * rpmA) / gearB; // 200
      return {
        text: `Σε έναν μηχανισμό, δύο γρανάζια είναι συνδεδεμένα. Ο αριθμός των δοντιών και ο αριθμός στροφών ανά λεπτό είναι αντιστρόφως ανάλογα ποσά. Αν το πρώτο γρανάζι έχει ${gearA} δόντια και περιστρέφεται με ${rpmA} στροφές/λεπτό, με πόσες στροφές/λεπτό περιστρέφεται το δεύτερο γρανάζι που έχει ${gearB} δόντια;`,
        correctVal: rpmB,
        correctStr: String(rpmB),
        explanation: `Τα δόντια και οι στροφές έχουν σταθερό γινόμενο: ${gearA} · ${rpmA} ＝ ${gearA * rpmA}. Οι στροφές του δεύτερου γραναζιού είναι: ${gearA * rpmA} : ${gearB} ＝ ${rpmB} στροφές ανά λεπτό.`
      };
    }
  },
  {
    id: 'antistr_hard_7',
    generate: () => {
      const totalEur = 1200;
      const prize1Share = 4;
      const prize2Share = 6;
      // αντιστρόφως ανάλογα των λαθών: λάθη 4 και 6 -> λόγος 6 : 4 = 3 : 2
      const part1 = 3;
      const part2 = 2;
      const sumParts = part1 + part2; // 5
      const amount1 = (totalEur * part1) / sumParts; // 720 €
      const amount2 = (totalEur * part2) / sumParts; // 480 €
      return {
        text: `Δύο τεχνικοί μοιράζονται πριμ ${totalEur} € αντιστρόφως ανάλογα με τα λάθη που έκαναν. Ο πρώτος έκανε 4 λάθη και ο δεύτερος έκανε 6 λάθη. Πόσα € έλαβε ο πρώτος τεχνικός που έκανε τα λιγότερα λάθη;`,
        correctVal: amount1,
        correctStr: String(amount1),
        explanation: `Τα ποσά είναι αντιστρόφως ανάλογα των λαθών (4 και 6), άρα είναι ευθέως ανάλογα των αριθμών 1/4 και 1/6, δηλαδή σε λόγο 6 : 4 ＝ 3 : 2. Τα μέρη είναι 3 ＋ 2 ＝ 5. Το 1 μέρος αντιστοιχεί σε ${totalEur} : 5 ＝ 240 €. Ο πρώτος έλαβε 3 · 240 ＝ ${amount1} €.`
      };
    }
  },
  {
    id: 'antistr_hard_8',
    generate: () => {
      const taps = 4;
      const hours = 15;
      const totalCapacity = taps * hours; // 60
      const activeTaps = 3;
      const hoursNeeded = totalCapacity / activeTaps; // 20
      const diffHours = hoursNeeded - hours; // 5
      return {
        text: `Τέσσερις όμοιες βρύσες γεμίζουν μια δεξαμενή σε 15 ώρες. Αν η μία βρύση χαλάσει και λειτουργήσουν μόνο οι υπόλοιπες 3, πόσες περισσότερες ώρες θα χρειαστούν για να γεμίσει η δεξαμενή;`,
        correctVal: diffHours,
        correctStr: String(diffHours),
        explanation: `Σταθερό γινόμενο: 4 · 15 ＝ 60. Με 3 βρύσες ο χρόνος είναι 60 : 3 ＝ 20 ώρες. Οι επιπλέον ώρες είναι: 20 － 15 ＝ ${diffHours} ώρες.`
      };
    }
  },
  {
    id: 'antistr_hard_9',
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
        correctVal: lessDays,
        correctStr: String(lessDays),
        explanation: `Σταθερό απόθεμα μερίδων: ${soldiers} · ${days} ＝ ${totalRations}. Οι νέοι στρατιώτες είναι ${totalSoldiers}. Τα τρόφιμα θα διαρκέσουν: ${totalRations} : ${totalSoldiers} ＝ ${newDays} ημέρες. Άρα θα διαρκέσουν ${days} － ${newDays} ＝ ${lessDays} ημέρες λιγότερο.`
      };
    }
  },
  {
    id: 'antistr_hard_10',
    generate: () => {
      const stepLengthCm = 60;
      const stepsCount = 1200;
      const totalDistCm = stepLengthCm * stepsCount; // 72000 cm = 720 m
      const newStepCm = 80;
      const newSteps = totalDistCm / newStepCm; // 900 steps
      return {
        text: `Για να διανύσει μια απόσταση, ένας περιπατητής με μήκος βήματος ${stepLengthCm} cm κάνει ${stepsCount} βήματα. Πόσα βήματα θα κάνει για να καλύψει την ίδια ακριβώς απόσταση ένα άλλο άτομο με μήκος βήματος ${newStepCm} cm;`,
        correctVal: newSteps,
        correctStr: String(newSteps),
        explanation: `Το μήκος βήματος και το πλήθος των βημάτων είναι αντιστρόφως ανάλογα ποσά. Συνολική απόσταση: ${stepLengthCm} · ${stepsCount} ＝ ${totalDistCm} cm. Με βήμα ${newStepCm} cm θα χρειαστούν: ${totalDistCm} : ${newStepCm} ＝ ${newSteps} βήματα.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Εύρεση σταθερού γινομένου (α)
  {
    const x = randInt(3, 6);
    const y = randInt(8, 15);
    const alpha = x * y;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΣΤΑΘΕΡΟ ΓΙΝΟΜΕΝΟ',
      instruction: 'Υπολογίστε το σταθερό γινόμενο των αντιστρόφως ανάλογων ποσών:',
      prompt: `Σε δύο αντιστρόφως ανάλογα ποσά χ και ψ, όταν χ ＝ ${x}, το ψ ισούται με ${y}. Ποιο είναι το σταθερό γινόμενο α των δύο ποσών (α ＝ χ · ψ);`,
      correctVal: alpha,
      correctStr: String(alpha),
      explanation: `Στα αντιστρόφως ανάλογα ποσά το γινόμενο των αντίστοιχων τιμών είναι σταθερό: α ＝ χ · ψ ＝ ${x} · ${y} ＝ ${alpha}.`
    });
  }

  // Q2 (MCQ): Έλεγχος αντιστρόφως ανάλογων ποσών σε πίνακα
  {
    const alphaConst = 36;
    const isAntistr = Math.random() > 0.4;
    const xVals = [2, 3, 6];
    const yVals = isAntistr ? [18, 12, 6] : [18, 12, 8];

    const correctAns = isAntistr
      ? 'Ναι, γιατί όλα τα γινόμενα χ · ψ είναι ίσα με 36'
      : 'Όχι, γιατί τα γινόμενα χ · ψ δεν παραμένουν σταθερά';

    const wrongAns = isAntistr
      ? 'Όχι, γιατί το ψ μειώνεται ενώ το χ αυξάνεται'
      : 'Ναι, γιατί όσο το χ μεγαλώνει, το ψ μικραίνει';

    const options = [
      { text: correctAns, isCorrect: true },
      { text: wrongAns, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΕΛΕΓΧΟΣ ΠΙΝΑΚΑ ΤΙΜΩΝ',
      instruction: 'Εξετάστε τον πίνακα τιμών:',
      prompt: `Είναι τα ποσά χ και ψ του παρακάτω πίνακα αντιστρόφως ανάλογα;`,
      table: {
        col1: 'Ποσό χ',
        col2: 'Ποσό ψ',
        r1: [xVals[0], yVals[0]],
        r2: [xVals[1], yVals[1]],
        r3: [xVals[2], yVals[2]]
      },
      options,
      correctText: correctAns,
      explanation: `Ελέγχουμε τα γινόμενα: ${xVals[0]} · ${yVals[0]} ＝ ${xVals[0] * yVals[0]}, ${xVals[1]} · ${yVals[1]} ＝ ${xVals[1] * yVals[1]}, ${xVals[2]} · ${yVals[2]} ＝ ${xVals[2] * yVals[2]}. ${correctAns}.`
    });
  }

  // Q3 (Input - Decimal): Υπολογισμός τιμής ψ από το σταθερό γινόμενο
  {
    const x1 = randInt(2, 4);
    const y1 = randInt(12, 20);
    const alpha = x1 * y1;
    const x2 = x1 * 2;
    const y2 = alpha / x2;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΣΥΜΠΛΗΡΩΣΗ ΑΝΤΙΣΤΡΟΦΟΥ ΠΟΣΟΥ',
      instruction: 'Υπολογίστε την τιμή του ψ:',
      prompt: `Δύο ποσά χ και ψ είναι αντιστρόφως ανάλογα με σταθερό γινόμενο α ＝ ${alpha}. Αν η τιμή του χ είναι ${x2}, ποια είναι η αντίστοιχη τιμή του ψ;`,
      correctVal: y2,
      correctStr: formatNum(y2),
      explanation: `Εφαρμόζουμε τη βασική σχέση: ψ ＝ α : χ ＝ ${alpha} : ${x2} ＝ ${formatNum(y2)}.`
    });
  }

  // Q4 (MCQ): Μορφή γραφικής παράστασης
  {
    const correctShape = 'Καμπύλη γραμμή που ονομάζεται υπερβολή και δεν περνάει από το (0, 0)';
    const fake1 = 'Ευθεία γραμμή που διέρχεται από την αρχή των αξόνων (0, 0)';
    const fake2 = 'Κυκλική γραμμή γύρω από το κέντρο των αξόνων';
    const fake3 = 'Ευθεία γραμμή παράλληλη προς τον οριζόντιο άξονα';

    const options = [
      { text: correctShape, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΓΡΑΦΙΚΗ ΠΑΡΑΣΤΑΣΗ',
      instruction: 'Επιλέξτε τη σωστή πρόταση για τη γραφική παράσταση των αντιστρόφως ανάλογων ποσών:',
      prompt: `Ποια είναι η μορφή της γραφικής παράστασης δύο αντιστρόφως ανάλογων ποσών;`,
      options,
      correctText: correctShape,
      explanation: `Η γραφική παράσταση των αντιστρόφως ανάλογων ποσών είναι καμπύλη γραμμή που ονομάζεται υπερβολή. Δεν περνάει ποτέ από το σημείο (0, 0) και δεν ακουμπάει ποτέ τους άξονες.`
    });
  }

  // Q5 (Input - Decimal): Εύρεση του χ όταν δίνεται το ψ
  {
    const alpha = 72;
    const yVal = pickRandom([6, 8, 9, 12]);
    const expectedX = alpha / yVal;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΑΝΤΙΣΤΡΟΦΟΣ ΥΠΟΛΟΓΙΣΜΟΣ',
      instruction: 'Υπολογίστε την τιμή του χ:',
      prompt: `Σε δύο αντιστρόφως ανάλογα ποσά το σταθερό γινόμενο είναι α ＝ ${alpha}. Αν ψ ＝ ${yVal}, ποια είναι η τιμή του χ;`,
      correctVal: expectedX,
      correctStr: String(expectedX),
      explanation: `Αφού χ · ψ ＝ α, έχουμε: χ ＝ α : ψ ＝ ${alpha} : ${yVal} ＝ ${expectedX}.`
    });
  }

  // Q6 (MCQ): Σύγκριση ανάλογων και αντιστρόφως ανάλογων ποσών
  {
    const correctStatement = 'Στα ανάλογα ποσά είναι σταθερό το πηλίκο (ψ : χ), ενώ στα αντιστρόφως ανάλογα είναι σταθερό το γινόμενο (χ · ψ)';
    const fake1 = 'Και στα δύο είδη ποσών είναι σταθερό το άθροισμα των τιμών τους';
    const fake2 = 'Στα ανάλογα ποσά είναι σταθερό το γινόμενο και στα αντιστρόφως ανάλογα το πηλίκο';
    const fake3 = 'Και στα δύο είδη ποσών η γραφική παράσταση είναι ευθεία γραμμή';

    const options = [
      { text: correctStatement, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΑΝΑΛΟΓΑ VS ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΑ',
      instruction: 'Επιλέξτε τη σωστή μαθηματική διάκριση:',
      prompt: `Ποια είναι η θεμελιώδης διαφορά μεταξύ ανάλογων και αντιστρόφως ανάλογων ποσών;`,
      options,
      correctText: correctStatement,
      explanation: `Στα ανάλογα ποσά παραμένει σταθερό το πηλίκο των τιμών τους (ψ : χ ＝ λ), ενώ στα αντιστρόφως ανάλογα παραμένει σταθερό το γινόμενο των τιμών τους (χ · ψ ＝ α).`
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
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΟΒΛΗΜΑ ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ',
      instruction: 'Λύστε το πρόβλημα χρησιμοποιώντας το σταθερό γινόμενο:',
      prompt: stdProb1.text,
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
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΑΝΤΙΣΤΡΟΦΗΣ ΑΝΑΛΟΓΙΑΣ',
      instruction: 'Επιλέξτε τη σωστή τιμή για το πρόβλημα:',
      prompt: stdProb2.text,
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
      instruction: 'Υπολογίστε με προσοχή και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: hardProb1.text,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal;
    const fake10A = typeof val10 === 'number' ? formatNum(val10 + randInt(3, 8)) : '0';
    const fake10B = typeof val10 === 'number' ? formatNum(Math.max(1, val10 - randInt(2, 6))) : '0';
    const fake10C = typeof val10 === 'number' ? formatNum(val10 * 1.4) : '0';

    const optionsQ10 = [
      { text: hardProb2.correctStr, isCorrect: true },
      { text: String(fake10A), isCorrect: false },
      { text: String(fake10B), isCorrect: false },
      { text: String(fake10C), isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΑΝΤΙΣΤΡΟΦΩΝ ΠΟΣΩΝ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      options: optionsQ10,
      correctText: hardProb2.correctStr,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function AntistrofosAnalogaExercisesPage() {
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
      title="Ασκήσεις: Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στα αντιστρόφως ανάλογα ποσά, το σταθερό γινόμενο, τη γραφική παράσταση (υπερβολή) και σύνθετες εφαρμογές για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/46-antistrofos-analoga-posa"
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
              Ασκήσεις &amp; Προβλήματα: Αντιστρόφως Ανάλογα Ποσά
            </h1>
            <p className="text-sky-100 text-sm sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Υπολογίστε το σταθερό γινόμενο α ＝ χ · ψ, συμπληρώστε πίνακες τιμών και ελέγξτε τις γνώσεις σας.
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
                        <span className="text-indigo-700">{q.table.r2[1]}</span>
                        {q.table.r3 && (
                          <>
                            <span>{q.table.r3[0]}</span>
                            <span className="text-indigo-700">{q.table.r3[1]}</span>
                          </>
                        )}
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
                        (Ακέραιος ή δεκαδικός με κόμμα)
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

// pages/st-dimotikou/47-problem-antistrofos-analoga-posa-ask.js
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

// Βοηθητικο component εμφανισης κλασματος
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono ${className}`}>
      <span className="border-b-2 border-current px-1.5 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
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
    id: 'p_antistr_std_1',
    generate: () => {
      const workers1 = randInt(2, 4);
      const days1 = randInt(6, 12);
      const totalWork = workers1 * days1; // σταθερό γινόμενο
      const workers2 = workers1 + randInt(2, 4);
      const days2 = totalWork / workers2;
      const cleanDays2 = Number.isInteger(days2) ? days2 : Number(days2.toFixed(1));
      return {
        text: `Σε ένα συνεργείο ${workers1} τεχνικοί συναρμολογούν μια παραγγελία σε ${days1} ημέρες. Σε πόσες ημέρες θα συναρμολογούσαν την ίδια παραγγελία ${workers2} τεχνικοί με τον ίδιο ρυθμό εργασίας;`,
        correctVal: cleanDays2,
        correctStr: formatNum(cleanDays2),
        explanation: `Τα ποσά είναι αντιστρόφως ανάλογα (σταθερό γινόμενο). Συνολικός όγκος εργασίας: ${workers1} · ${days1} ＝ ${totalWork} μεροκάματα. Για ${workers2} τεχνικούς οι ημέρες είναι: ${totalWork} : ${workers2} ＝ ${formatNum(cleanDays2)} ημέρες.`
      };
    }
  },
  {
    id: 'p_antistr_std_2',
    generate: () => {
      const speed1 = randInt(6, 8) * 10; // π.χ. 60, 70, 80 km/h
      const time1 = randInt(3, 5); // ώρες
      const totalDist = speed1 * time1; // σταθερή απόσταση
      const speed2 = speed1 + 20;
      const time2 = totalDist / speed2;
      const cleanTime2 = Number.isInteger(time2) ? time2 : Number(time2.toFixed(1));
      return {
        text: `Ένα φορτηγό καλύπτει μια διαδρομή σε ${time1} ώρες κινούμενο με σταθερή ταχύτητα ${speed1} km/h. Σε πόσες ώρες θα κάλυπτε την ίδια απόσταση αν κινούνταν με ταχύτητα ${speed2} km/h;`,
        correctVal: cleanTime2,
        correctStr: formatNum(cleanTime2),
        explanation: `Ταχύτητα και χρόνος έχουν σταθερό γινόμενο (απόσταση): ${speed1} · ${time1} ＝ ${totalDist} km. Ο νέος χρόνος είναι: ${totalDist} : ${speed2} ＝ ${formatNum(cleanTime2)} ώρες.`
      };
    }
  },
  {
    id: 'p_antistr_std_3',
    generate: () => {
      const taps1 = randInt(2, 3);
      const hours1 = randInt(4, 6);
      const totalCapacity = taps1 * hours1;
      const taps2 = taps1 + randInt(2, 3);
      const hours2 = totalCapacity / taps2;
      const cleanH2 = Number.isInteger(hours2) ? hours2 : Number(hours2.toFixed(1));
      return {
        text: `${taps1} ίδιες αντλίες αδειάζουν μια δεξαμενή σε ${hours1} ώρες. Σε πόσες ώρες θα άδειαζαν την ίδια δεξαμενή ${taps2} ίδιες αντλίες αν λειτουργούσαν ταυτόχρονα;`,
        correctVal: cleanH2,
        correctStr: formatNum(cleanH2),
        explanation: `Οι αντλίες και ο χρόνος είναι αντιστρόφως ανάλογα ποσά. Σταθερό γινόμενο: ${taps1} · ${hours1} ＝ ${totalCapacity}. Με ${taps2} αντλίες απαιτούνται: ${totalCapacity} : ${taps2} ＝ ${formatNum(cleanH2)} ώρες.`
      };
    }
  },
  {
    id: 'p_antistr_std_4',
    generate: () => {
      const packCapacity = randInt(3, 6) * 50; // g
      const packsCount = randInt(8, 14);
      const totalGrams = packCapacity * packsCount;
      const newPackCap = packCapacity + 50;
      const newPacks = totalGrams / newPackCap;
      const cleanPacks = Number.isInteger(newPacks) ? newPacks : Number(newPacks.toFixed(1));
      return {
        text: `Μια ποσότητα τσαγιού συσκευάστηκε σε ${packsCount} κουτιά των ${packCapacity} g το καθένα. Πόσα κουτιά των ${newPackCap} g θα χρειάζονταν για να συσκευαστεί η ίδια ακριβώς ποσότητα;`,
        correctVal: cleanPacks,
        correctStr: formatNum(cleanPacks),
        explanation: `Η χωρητικότητα και το πλήθος κουτιών είναι αντιστρόφως ανάλογα ποσά. Συνολική μάζα: ${packCapacity} · ${packsCount} ＝ ${totalGrams} g. Νέο πλήθος: ${totalGrams} : ${newPackCap} ＝ ${formatNum(cleanPacks)} κουτιά.`
      };
    }
  },
  {
    id: 'p_antistr_std_5',
    generate: () => {
      const students = randInt(16, 24);
      const costPerStudent = randInt(10, 15);
      const totalCost = students * costPerStudent;
      const newStudents = students + 4;
      const newCost = totalCost / newStudents;
      const cleanCost = Number.isInteger(newCost) ? newCost : Number(newCost.toFixed(1));
      return {
        text: `Για την ενοικίαση ενός θεάτρου τα έξοδα είναι σταθερά. Αν συμμετάσχουν ${students} μαθητές, ο καθένας θα πληρώσει ${costPerStudent} €. Πόσα € θα πληρώσει ο καθένας αν τελικά συμμετάσχουν ${newStudents} μαθητές;`,
        correctVal: cleanCost,
        correctStr: formatNum(cleanCost),
        explanation: `Πλήθος ατόμων και ποσό ανά άτομο είναι αντιστρόφως ανάλογα ποσά. Συνολικό ποσό: ${students} · ${costPerStudent} ＝ ${totalCost} €. Νέο ποσό: ${totalCost} : ${newStudents} ＝ ${formatNum(cleanCost)} €.`
      };
    }
  },
  {
    id: 'p_antistr_std_6',
    generate: () => {
      const hoursPerDay1 = randInt(4, 6);
      const days1 = randInt(8, 12);
      const totalHours = hoursPerDay1 * days1;
      const newHoursPerDay = hoursPerDay1 + 2;
      const days2 = totalHours / newHoursPerDay;
      const cleanDays2 = Number.isInteger(days2) ? days2 : Number(days2.toFixed(1));
      return {
        text: `Μια υφάντρα τελειώνει ένα χαλί σε ${days1} ημέρες δουλεύοντας ${hoursPerDay1} ώρες την ημέρα. Σε πόσες ημέρες θα τελείωνε το ίδιο χαλί αν δούλευε ${newHoursPerDay} ώρες την ημέρα;`,
        correctVal: cleanDays2,
        correctStr: formatNum(cleanDays2),
        explanation: `Ημερήσιες ώρες και ημέρες έχουν σταθερό γινόμενο: ${hoursPerDay1} · ${days1} ＝ ${totalHours} ώρες. Νέες ημέρες: ${totalHours} : ${newHoursPerDay} ＝ ${formatNum(cleanDays2)} ημέρες.`
      };
    }
  },
  {
    id: 'p_antistr_std_7',
    generate: () => {
      const pipes1 = randInt(2, 4);
      const min1 = randInt(25, 45);
      const totalVol = pipes1 * min1;
      const pipes2 = pipes1 + 1;
      const min2 = totalVol / pipes2;
      const cleanMin2 = Number.isInteger(min2) ? min2 : Number(min2.toFixed(1));
      return {
        text: `Μια δεξαμενή γεμίζει σε ${min1} λεπτά όταν λειτουργούν ${pipes1} σωλήνες παροχής. Σε πόσα λεπτά θα γέμιζε αν λειτουργούσαν ${pipes2} ίδιοι σωλήνες;`,
        correctVal: cleanMin2,
        correctStr: formatNum(cleanMin2),
        explanation: `Σταθερό γινόμενο: ${pipes1} · ${min1} ＝ ${totalVol}. Με ${pipes2} σωλήνες ο χρόνος είναι: ${totalVol} : ${pipes2} ＝ ${formatNum(cleanMin2)} λεπτά.`
      };
    }
  },
  {
    id: 'p_antistr_std_8',
    generate: () => {
      const bottleLit = 2;
      const bottlesCount = randInt(15, 25);
      const totalJuice = bottleLit * bottlesCount;
      const newBottleLit = 0.5;
      const newCount = totalJuice / newBottleLit;
      return {
        text: `Μια ποσότητα χυμού εμφιαλώθηκε σε ${bottlesCount} μπουκάλια των 2 l το καθένα. Πόσα μπουκάλια των 0,5 l θα χρειάζονταν για να εμφιαλωθεί η ίδια ποσότητα χυμού;`,
        correctVal: newCount,
        correctStr: String(newCount),
        explanation: `Χωρητικότητα και πλήθος μπουκαλιών είναι αντιστρόφως ανάλογα ποσά. Συνολικός χυμός: 2 · ${bottlesCount} ＝ ${totalJuice} l. Με μπουκάλια 0,5 l: ${totalJuice} : 0,5 ＝ ${newCount} μπουκάλια.`
      };
    }
  },
  {
    id: 'p_antistr_std_9',
    generate: () => {
      const speed1 = 75;
      const time1 = 4;
      const dist = speed1 * time1; // 300 km
      const speed2 = 100;
      const time2 = dist / speed2; // 3 h
      return {
        text: `Ένα τουριστικό λεωφορείο διανύει μια απόσταση σε ${time1} ώρες κινούμενο με σταθερή ταχύτητα ${speed1} km/h. Πόσες ώρες θα χρειαστεί για την ίδια διαδρομή αν κινηθεί με ${speed2} km/h;`,
        correctVal: time2,
        correctStr: String(time2),
        explanation: `Σταθερή απόσταση: ${speed1} · ${time1} ＝ ${dist} km. Με ταχύτητα ${speed2} km/h ο χρόνος είναι: ${dist} : ${speed2} ＝ ${time2} ώρες.`
      };
    }
  },
  {
    id: 'p_antistr_std_10',
    generate: () => {
      const tractors1 = randInt(2, 4);
      const days1 = randInt(8, 12);
      const totalWork = tractors1 * days1;
      const tractors2 = tractors1 + 2;
      const days2 = totalWork / tractors2;
      const cleanDays2 = Number.isInteger(days2) ? days2 : Number(days2.toFixed(1));
      return {
        text: `${tractors1} τρακτέρ οργώνουν ένα μεγάλο κτήμα σε ${days1} ημέρες. Σε πόσες ημέρες θα όργωναν το ίδιο κτήμα ${tractors2} όμοια τρακτέρ;`,
        correctVal: cleanDays2,
        correctStr: formatNum(cleanDays2),
        explanation: `Τα τρακτέρ και οι ημέρες είναι αντιστρόφως ανάλογα ποσά. Σταθερό γινόμενο: ${tractors1} · ${days1} ＝ ${totalWork}. Με ${tractors2} τρακτέρ: ${totalWork} : ${tractors2} ＝ ${formatNum(cleanDays2)} ημέρες.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (10 διαφορετικα προβληματα)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_antistr_hard_1',
    generate: () => {
      const initWorkers = 8;
      const initDays = 15;
      const doneDays = 3;
      const remWork = initWorkers * (initDays - doneDays); // 8 * 12 = 96
      const addedWorkers = 4;
      const totalWorkers = initWorkers + addedWorkers; // 12
      const remDays = remWork / totalWorkers; // 8
      return {
        text: `Μια ομάδα ${initWorkers} εργατών είχε προγραμματίσει να τελειώσει ένα έργο σε ${initDays} ημέρες. Αφού εργάστηκαν μόνοι τους για ${doneDays} ημέρες, προστέθηκαν στην ομάδα άλλοι ${addedWorkers} εργάτες. Σε πόσες ημέρες θα ολοκληρωθεί το υπόλοιπο έργο;`,
        correctVal: remDays,
        correctStr: String(remDays),
        explanation: `Το έργο που απομένει ισοδυναμεί με ${initWorkers} εργάτες · (${initDays} － ${doneDays}) ημέρες ＝ ${initWorkers} · ${initDays - doneDays} ＝ ${remWork} μεροκάματα. Τώρα εργάζονται ${initWorkers} ＋ ${addedWorkers} ＝ ${totalWorkers} εργάτες. Το υπόλοιπο έργο θα τελειώσει σε: ${remWork} : ${totalWorkers} ＝ ${remDays} ημέρες.`
      };
    }
  },
  {
    id: 'p_antistr_hard_2',
    generate: () => {
      const animals = 40;
      const days = 30;
      const daysPassed = 6;
      const remFood = animals * (days - daysPassed); // 40 * 24 = 960 μερίδες
      const animalsSold = 16;
      const remAnimals = animals - animalsSold; // 24
      const extraDays = remFood / remAnimals; // 40
      return {
        text: `Σε ένα αγρόκτημα υπάρχουν ζωοτροφές για ${animals} αγελάδες για ${days} ημέρες. Μετά από ${daysPassed} ημέρες, πωλούνται ${animalsSold} αγελάδες. Για πόσες ημέρες ακόμα θα διαρκέσουν οι ζωοτροφές για τις αγελάδες που απέμειναν;`,
        correctVal: extraDays,
        correctStr: String(extraDays),
        explanation: `Οι ζωοτροφές που απομένουν επαρκούν για ${animals} ζώα για ${days - daysPassed} ημέρες, δηλαδή ${animals} · ${days - daysPassed} ＝ ${remFood} ημερήσιες μερίδες. Οι εναπομείνασες αγελάδες είναι ${remAnimals}. Θα διαρκέσουν για: ${remFood} : ${remAnimals} ＝ ${extraDays} ημέρες.`
      };
    }
  },
  {
    id: 'p_antistr_hard_3',
    generate: () => {
      const length1 = 20; // m
      const width1 = 15; // m
      const area = length1 * width1; // 300 m2
      const length2 = 25; // m
      const width2 = area / length2; // 12 m
      return {
        text: `Ένα ορθογώνιο δάπεδο με σταθερό εμβαδόν έχει μήκος ${length1} m και πλάτος ${width1} m. Αν θέλουμε να διαμορφώσουμε ένα άλλο ορθογώνιο με το ίδιο ακριβώς εμβαδόν αλλά μήκος ${length2} m, ποιο πρέπει να είναι το πλάτος του σε m;`,
        correctVal: width2,
        correctStr: String(width2),
        explanation: `Μήκος και πλάτος είναι αντιστρόφως ανάλογα ποσά (σταθερό εμβαδόν). Εμβαδόν: ${length1} · ${width1} ＝ ${area} m². Το νέο πλάτος είναι: ${area} : ${length2} ＝ ${width2} m.`
      };
    }
  },
  {
    id: 'p_antistr_hard_4',
    generate: () => {
      const hoursPerDay1 = 7;
      const days1 = 20;
      const totalHours = hoursPerDay1 * days1; // 140 h
      const days2 = 14;
      const reqHoursPerDay = totalHours / days2; // 10 h
      return {
        text: `Μια βιοτεχνία εκτελεί μια παραγγελία σε ${days1} ημέρες δουλεύοντας ${hoursPerDay1} ώρες την ημέρα. Πόσες ώρες την ημέρα πρέπει να δουλεύει για να παραδώσει την ίδια παραγγελία σε ${days2} ημέρες;`,
        correctVal: reqHoursPerDay,
        correctStr: String(reqHoursPerDay),
        explanation: `Συνολικές ώρες παραγγελίας: ${hoursPerDay1} · ${days1} ＝ ${totalHours} ώρες. Για παράδοση σε ${days2} ημέρες απαιτούνται: ${totalHours} : ${days2} ＝ ${reqHoursPerDay} ώρες την ημέρα.`
      };
    }
  },
  {
    id: 'p_antistr_hard_5',
    generate: () => {
      const speed1 = 80; // km/h
      const timeMinutes1 = 150; // 2 h 30 min = 150 min
      const dist = (speed1 * timeMinutes1) / 60; // 200 km
      const targetTimeMin = 100; // 1 h 40 min = 100 min
      const reqSpeed = (dist / targetTimeMin) * 60; // 120 km/h
      return {
        text: `Ένα αυτοκίνητο καλύπτει μια διαδρομή σε 2 ώρες και 30 λεπτά με σταθερή ταχύτητα ${speed1} km/h. Με ποια ταχύτητα σε km/h πρέπει να κινηθεί για να καλύψει την ίδια διαδρομή σε 1 ώρα και 40 λεπτά;`,
        correctVal: reqSpeed,
        correctStr: String(reqSpeed),
        explanation: `Μετατρέπουμε τον χρόνο σε λεπτά: 2 h 30 min ＝ 150 min και 1 h 40 min ＝ 100 min. Η απόσταση είναι σταθερή, άρα ταχύτητα και χρόνος είναι αντιστρόφως ανάλογα: ${speed1} · 150 ＝ υ · 100 ➔ υ ＝ (${speed1} · 150) : 100 ＝ 12.000 : 100 ＝ ${reqSpeed} km/h.`
      };
    }
  },
  {
    id: 'p_antistr_hard_6',
    generate: () => {
      const gearA = 40;
      const rpmA = 180;
      const gearB = 60;
      const rpmB = (gearA * rpmA) / gearB; // 120
      return {
        text: `Δύο οδοντωτοί τροχοί (γρανάζια) συμπλέκονται. Ο πρώτος έχει ${gearA} δόντια και εκτελεί ${rpmA} στροφές το λεπτό. Πόσες στροφές το λεπτό εκτελεί ο δεύτερος τροχός που έχει ${gearB} δόντια;`,
        correctVal: rpmB,
        correctStr: String(rpmB),
        explanation: `Ο αριθμός των δοντιών και οι στροφές είναι αντιστρόφως ανάλογα ποσά (σταθερό γινόμενο δοντιών ανά λεπτό): ${gearA} · ${rpmA} ＝ ${gearA * rpmA}. Οι στροφές του δεύτερου τροχού είναι: ${gearA * rpmA} : ${gearB} ＝ ${rpmB} στροφές/λεπτό.`
      };
    }
  },
  {
    id: 'p_antistr_hard_7',
    generate: () => {
      const totalMoney = 1500;
      // αντιστρόφως ανάλογα των 2 και 3: λόγος 3 προς 2 (σύνολο μερών = 5)
      const part1 = 3;
      const part2 = 2;
      const sumParts = part1 + part2;
      const share1 = (totalMoney * part1) / sumParts; // 900 €
      const share2 = (totalMoney * part2) / sumParts; // 600 €
      return {
        text: `Δύο οδηγοί μοιράζονται επίδομα ${totalMoney} € αντιστρόφως ανάλογα με τις ημέρες καθυστέρησης που σημείωσαν. Ο πρώτος είχε 2 ημέρες καθυστέρηση και ο δεύτερος 3 ημέρες. Πόσα € έλαβε ο πρώτος οδηγός;`,
        correctVal: share1,
        correctStr: String(share1),
        explanation: `Αντιστρόφως ανάλογα των 2 και 3 σημαίνει ευθέως ανάλογα των κλασμάτων 1/2 και 1/3, δηλαδή σε αναλογία 3 : 2. Τα μέρη είναι 3 ＋ 2 ＝ 5. Το 1 μέρος είναι ${totalMoney} : 5 ＝ 300 €. Ο πρώτος έλαβε: 3 · 300 ＝ ${share1} €.`
      };
    }
  },
  {
    id: 'p_antistr_hard_8',
    generate: () => {
      const taps = 5;
      const hours = 12;
      const totalWork = taps * hours; // 60
      const activeTaps = 4;
      const newHours = totalWork / activeTaps; // 15
      const diffHours = newHours - hours; // 3
      return {
        text: `Πέντε όμοιες βρύσες γεμίζουν μια δεξαμενή σε 12 ώρες. Αν κλείσουν οι 2 βρύσες και μείνουν να λειτουργούν μόνο οι υπόλοιπες 3, πόσες ώρες θα χρειαστούν συνολικά για να γεμίσει η δεξαμενή;`,
        correctVal: totalWork / 3, // 20 h
        correctStr: String(totalWork / 3),
        explanation: `Σταθερό γινόμενο: 5 · 12 ＝ 60. Αν λειτουργούν μόνο οι 3 βρύσες, ο χρόνος γεμίσματος είναι: 60 : 3 ＝ ${totalWork / 3} ώρες.`
      };
    }
  },
  {
    id: 'p_antistr_hard_9',
    generate: () => {
      const men = 80;
      const days = 45;
      const totalRations = men * days; // 3600
      const addedMen = 10;
      const totalMen = men + addedMen; // 90
      const newDays = totalRations / totalMen; // 40
      const lessDays = days - newDays; // 5
      return {
        text: `Σε μια κατασκήνωση υπάρχουν προμήθειες για ${men} άτομα για ${days} ημέρες. Αν προστεθούν άλλα ${addedMen} άτομα, πόσες ημέρες λιγότερο θα διαρκέσουν οι ίδιες προμήθειες;`,
        correctVal: lessDays,
        correctStr: String(lessDays),
        explanation: `Σταθερό απόθεμα μερίδων: ${men} · ${days} ＝ ${totalRations}. Με ${totalMen} άτομα οι προμήθειες θα διαρκέσουν: ${totalRations} : ${totalMen} ＝ ${newDays} ημέρες. Άρα θα διαρκέσουν ${days} － ${newDays} ＝ ${lessDays} ημέρες λιγότερο.`
      };
    }
  },
  {
    id: 'p_antistr_hard_10',
    generate: () => {
      const tileSide1 = 20; // cm
      const tileArea1 = tileSide1 * tileSide1; // 400 cm2
      const tilesCount1 = 900;
      const totalFloorArea = tileArea1 * tilesCount1; // 360000 cm2
      const tileSide2 = 30; // cm
      const tileArea2 = tileSide2 * tileSide2; // 900 cm2
      const tilesCount2 = totalFloorArea / tileArea2; // 400
      return {
        text: `Για να στρωθεί ένα δάπεδο χρειάζονται ${tilesCount1} τετράγωνα πλακάκια πλευράς ${tileSide1} cm (εμβαδού ${tileArea1} cm² το καθένα). Πόσα τετράγωνα πλακάκια πλευράς ${tileSide2} cm (εμβαδού ${tileArea2} cm² το καθένα) θα χρειαστούν για το ίδιο ακριβώς δάπεδο;`,
        correctVal: tilesCount2,
        correctStr: String(tilesCount2),
        explanation: `Το εμβαδόν κάθε πλακιδίου και το πλήθος των πλακιδίων είναι αντιστρόφως ανάλογα ποσά. Συνολικό εμβαδόν δαπέδου: ${tileArea1} · ${tilesCount1} ＝ ${totalFloorArea} cm². Με πλακάκια εμβαδού ${tileArea2} cm² θα χρειαστούν: ${totalFloorArea} : ${tileArea2} ＝ ${tilesCount2} πλακάκια.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Αναγωγή στη Μονάδα (Βήμα 1: Ο 1 εργάτης)
  {
    const workers = randInt(3, 6);
    const days = randInt(4, 8);
    const totalManDays = workers * days;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΑΝΑΓΩΓΗ ΣΤΗ ΜΟΝΑΔΑ',
      instruction: 'Υπολογίστε τον χρόνο που θα χρειαζόταν 1 εργάτης:',
      prompt: `Αν ${workers} εργάτες τελειώνουν ένα έργο σε ${days} ημέρες, πόσες ημέρες θα χρειαζόταν 1 μόνος εργάτης για να εκτελέσει το ίδιο ακριβώς έργο;`,
      correctVal: totalManDays,
      correctStr: String(totalManDays),
      explanation: `Στα αντιστρόφως ανάλογα ποσά για τη μονάδα πολλαπλασιάζουμε: ο 1 εργάτης θα χρειαστεί ${workers} · ${days} ＝ ${totalManDays} ημέρες.`
    });
  }

  // Q2 (MCQ): Ποια πράξη κάνουμε στην αναγωγή στη μονάδα
  {
    const correctMethod = 'Πολλαπλασιασμό, επειδή ο 1 εργάτης θα χρειαστεί περισσότερο χρόνο';
    const fakeMethod1 = 'Διαίρεση, ακριβώς όπως κάναμε και στα ανάλογα ποσά';
    const fakeMethod2 = 'Πρόσθεση των εργατών και των ημερών';
    const fakeMethod3 = 'Αφαίρεση του 1 από το σύνολο των εργατών';

    const options = [
      { text: correctMethod, isCorrect: true },
      { text: fakeMethod1, isCorrect: false },
      { text: fakeMethod2, isCorrect: false },
      { text: fakeMethod3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΜΕΘΟΔΟΛΟΓΙΑ ΑΝΑΓΩΓΗΣ ΣΤΗ ΜΟΝΑΔΑ',
      instruction: 'Επιλέξτε τη σωστή μαθηματική προσέγγιση:',
      prompt: `Στα αντιστρόφως ανάλογα ποσά (π.χ. εργάτες και ημέρες), ποια πράξη εκτελούμε για να βρούμε τι αντιστοιχεί στη 1 μονάδα;`,
      options,
      correctText: correctMethod,
      explanation: `Επειδή 1 μόνο άτομο χρειάζεται πολλαπλάσιο χρόνο από μια ολόκληρη ομάδα, πολλαπλασιάζουμε τους εργάτες με τις ημέρες για να βρούμε το συνολικό έργο.`
    });
  }

  // Q3 (Input - Decimal): Οριζόντιος Πολλαπλασιασμός Πίνακα
  {
    const w1 = randInt(2, 5);
    const d1 = randInt(10, 20);
    const w2 = randInt(6, 10);
    const total = w1 * d1;
    const targetD = total / w2;
    const cleanTargetD = Number.isInteger(targetD) ? targetD : Number(targetD.toFixed(1));

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΟΡΙΖΟΝΤΙΑ ΓΙΝΟΜΕΝΑ ΣΤΟΝ ΠΙΝΑΚΑ',
      instruction: 'Υπολογίστε τον άγνωστο όρο χ από τον πίνακα αντιστρόφως ανάλογων ποσών:',
      prompt: `Στον παρακάτω πίνακα αντιστρόφως ανάλογων ποσών, βρείτε την τιμή του χ:`,
      table: {
        col1: 'Εργάτες (χ)',
        col2: 'Ημέρες (ψ)',
        r1: [w1, d1],
        r2: [w2, 'χ']
      },
      correctVal: cleanTargetD,
      correctStr: formatNum(cleanTargetD),
      explanation: `Στα αντιστρόφως ανάλογα ποσά τα οριζόντια γινόμενα είναι ίσα: ${w1} · ${d1} ＝ ${w2} · χ ➔ χ ＝ (${w1} · ${d1}) : ${w2} ＝ ${total} : ${w2} ＝ ${formatNum(cleanTargetD)}.`
    });
  }

  // Q4 (MCQ): Η μεγάλη παγίδα του χιαστί
  {
    const correctTrap = 'Όχι, γιατί η μέθοδος χιαστί εφαρμόζεται αποκλειστικά στα ανάλογα ποσά και όχι στα αντιστρόφως ανάλογα';
    const fakeTrap1 = 'Ναι, σε όλα τα προβλήματα του Δημοτικού κάνουμε υποχρεωτικά χιαστί';
    const fakeTrap2 = 'Ναι, αρκεί οι αριθμοί να είναι ακέραιοι';
    const fakeTrap3 = 'Όχι, γιατί στα προβλήματα κάνουμε μόνο πρόσθεση και αφαίρεση';

    const options = [
      { text: correctTrap, isCorrect: true },
      { text: fakeTrap1, isCorrect: false },
      { text: fakeTrap2, isCorrect: false },
      { text: fakeTrap3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • Η ΠΑΓΙΔΑ ΤΟΥ ΧΙΑΣΤΙ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: `Επιτρέπεται να εφαρμόσουμε σταυρωτό πολλαπλασιασμό (χιαστί) σε πίνακα με αντιστρόφως ανάλογα ποσά;`,
      options,
      correctText: correctTrap,
      explanation: `Στα αντιστρόφως ανάλογα ποσά δεν κάνουμε ποτέ χιαστί! Στα αντιστρόφως ανάλογα πολλαπλασιάζουμε οριζόντια τα ζεύγη των τιμών (χ₁ · ψ₁ ＝ χ₂ · ψ₂).`
    });
  }

  // Q5 (Input - Decimal): Υπολογισμός νέου χρόνου σε σταθερή απόσταση
  {
    const sp1 = 60;
    const t1 = randInt(4, 6);
    const dist = sp1 * t1;
    const sp2 = 100;
    const t2 = dist / sp2;
    const cleanT2 = Number.isInteger(t2) ? t2 : Number(t2.toFixed(1));

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΣΤΑΘΕΡΗ ΑΠΟΣΤΑΣΗ & ΤΑΧΥΤΗΤΑ',
      instruction: 'Υπολογίστε τον νέο χρόνο ταξιδιού σε ώρες:',
      prompt: `Ένα όχημα καλύπτει μια απόσταση σε ${t1} ώρες κινούμενο με ταχύτητα ${sp1} km/h. Σε πόσες ώρες θα καλύψει την ίδια απόσταση αν αυξήσει την ταχύτητά του στα ${sp2} km/h;`,
      correctVal: cleanT2,
      correctStr: formatNum(cleanT2),
      explanation: `Σταθερή απόσταση: ${sp1} · ${t1} ＝ ${dist} km. Νέος χρόνος: ${dist} : ${sp2} ＝ ${formatNum(cleanT2)} ώρες.`
    });
  }

  // Q6 (MCQ): Έλεγχος λογικής αποτελέσματος
  {
    const correctLogic = 'Ο χρόνος πρέπει υποχρεωτικά να είναι λιγότερος από τις αρχικές 10 ημέρες';
    const fakeLogic1 = 'Ο χρόνος πρέπει υποχρεωτικά να είναι μεγαλύτερος από τις αρχικές 10 ημέρες';
    const fakeLogic2 = 'Ο χρόνος θα παραμείνει ακριβώς ο ίδιος';
    const fakeLogic3 = 'Δεν μπορούμε να γνωρίζουμε εκ των προτέρων';

    const options = [
      { text: correctLogic, isCorrect: true },
      { text: fakeLogic1, isCorrect: false },
      { text: fakeLogic2, isCorrect: false },
      { text: fakeLogic3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΕΛΕΓΧΟΣ ΛΟΓΙΚΗΣ ΑΠΟΤΕΛΕΣΜΑΤΟΣ',
      instruction: 'Επιλέξτε τη λογική πρόβλεψη:',
      prompt: `Αν 4 εργάτες κάνουν 10 ημέρες για ένα έργο, τι περιμένουμε για το αποτέλεσμα αν εργαστούν 8 εργάτες;`,
      options,
      correctText: correctLogic,
      explanation: `Αφού οι εργάτες αυξήθηκαν (διπλασιάστηκαν), ο χρόνος πρέπει υποχρεωτικά να μειωθεί (να υποδιπλασιαστεί σε 5 ημέρες).`
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
      instruction: 'Λύστε το πρόβλημα εφαρμόζοντας τη μέθοδο των αντιστρόφως ανάλογων ποσών:',
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
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΑΝΤΙΣΤΡΟΦΗΣ ΣΥΣΧΕΤΙΣΗΣ',
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
      options: optionsQ10,
      correctText: hardProb2.correctStr,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function ProblemAntistrofosAnalogaExercisesPage() {
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
      title="Ασκήσεις: Λύση Προβλημάτων με Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στην επίλυση αντιστρόφως ανάλογων ποσών, αναγωγή στη μονάδα, οριζόντια γινόμενα και σύνθετα σενάρια για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/47-problem-antistrofos-analoga-posa"
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
              Ασκήσεις: Προβλήματα με Αντιστρόφως Ανάλογα Ποσά
            </h1>
            <p className="text-sky-100 text-sm sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες που περιλαμβάνουν 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Χρησιμοποιήστε την αναγωγή στη μονάδα και τα οριζόντια γινόμενα για να βρείτε τα ζητούμενα μεγέθη.
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

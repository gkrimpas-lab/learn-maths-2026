// pages/st-dimotikou/42-analogia-xiasti-ask.js
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

// Δεξαμενη Κανονικων Προβληματων Πινακα & Χιαστι (10 διαφορετικα προβληματα)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_xiasti_std_1',
    generate: () => {
      const kg1 = randInt(2, 4);
      const costPerKg = randInt(3, 7);
      const cost1 = kg1 * costPerKg;
      const kg2 = kg1 + randInt(3, 6);
      const cost2 = kg2 * costPerKg;
      return {
        text: `Σε έναν πίνακα ποσών και τιμών, τα ${kg1} kg μήλων αντιστοιχούν σε ${cost1} €. Πόσα € αντιστοιχούν σε ${kg2} kg μήλων;`,
        tableData: { col1: 'Βάρος (kg)', col2: 'Κόστος (€)', r1: [kg1, cost1], r2: [kg2, 'χ'] },
        correctVal: cost2,
        correctStr: String(cost2),
        explanation: `Από τον πίνακα ποσών και τιμών προκύπτει η αναλογία ${kg1} : ${cost1} ＝ ${kg2} : χ. Εφαρμόζοντας χιαστί πολλαπλασιασμό: χ ＝ (${cost1} · ${kg2}) : ${kg1} ＝ ${cost1 * kg2} : ${kg1} ＝ ${cost2} €.`
      };
    }
  },
  {
    id: 'p_xiasti_std_2',
    generate: () => {
      const hours1 = randInt(2, 4);
      const speed = randInt(70, 90);
      const dist1 = hours1 * speed;
      const hours2 = hours1 + randInt(2, 3);
      const dist2 = hours2 * speed;
      return {
        text: `Ένα τρένο διανύει ${dist1} km σε ${hours1} ώρες. Πόσα km θα διανύσει σε ${hours2} ώρες κινούμενο με τον ίδιο σταθερό ρυθμό;`,
        tableData: { col1: 'Χρόνος (h)', col2: 'Απόσταση (km)', r1: [hours1, dist1], r2: [hours2, 'χ'] },
        correctVal: dist2,
        correctStr: String(dist2),
        explanation: `Οργανώνουμε τον πίνακα: ${hours1} h αντιστοιχούν σε ${dist1} km και ${hours2} h σε χ km. Με χιαστί υπολογίζουμε: χ ＝ (${dist1} · ${hours2}) : ${hours1} ＝ ${dist2} km.`
      };
    }
  },
  {
    id: 'p_xiasti_std_3',
    generate: () => {
      const workers1 = randInt(2, 4);
      const production1 = workers1 * 45; // τεμάχια
      const workers2 = workers1 + randInt(3, 5);
      const production2 = workers2 * 45;
      return {
        text: `Σε μια γραμμή παραγωγής ${workers1} εργάτες συναρμολογούν ${production1} εξαρτήματα. Πόσα εξαρτήματα θα συναρμολογήσουν ${workers2} εργάτες με την ίδια απόδοση;`,
        tableData: { col1: 'Εργάτες', col2: 'Τεμάχια', r1: [workers1, production1], r2: [workers2, 'χ'] },
        correctVal: production2,
        correctStr: String(production2),
        explanation: `Στήνουμε τα ποσά στον πίνακα: ${workers1} προς ${production1} και ${workers2} προς χ. Υπολογίζουμε με χιαστί: χ ＝ (${production1} · ${workers2}) : ${workers1} ＝ ${production2} εξαρτήματα.`
      };
    }
  },
  {
    id: 'p_xiasti_std_4',
    generate: () => {
      const flourKg = randInt(2, 5);
      const breadKg = flourKg * 1.5;
      const targetFlour = flourKg + randInt(2, 4);
      const targetBread = targetFlour * 1.5;
      return {
        text: `Από ${flourKg} kg αλεύρι ένας αρτοποιός παρασκευάζει ${formatNum(breadKg)} kg ψωμί. Πόσα kg ψωμί θα παρασκευάσει από ${targetFlour} kg αλεύρι;`,
        tableData: { col1: 'Αλεύρι (kg)', col2: 'Ψωμί (kg)', r1: [flourKg, formatNum(breadKg)], r2: [targetFlour, 'χ'] },
        correctVal: targetBread,
        correctStr: formatNum(targetBread),
        explanation: `Τα ποσά είναι ανάλογα: ${flourKg} : ${formatNum(breadKg)} ＝ ${targetFlour} : χ. Άρα χ ＝ (${formatNum(breadKg)} · ${targetFlour}) : ${flourKg} ＝ ${formatNum(targetBread)} kg.`
      };
    }
  },
  {
    id: 'p_xiasti_std_5',
    generate: () => {
      const books1 = randInt(3, 6);
      const priceBook = randInt(8, 14);
      const cost1 = books1 * priceBook;
      const books2 = books1 + randInt(2, 5);
      const cost2 = books2 * priceBook;
      return {
        text: `Για την αγορά ${books1} ίδιων βιβλίων πληρώσαμε ${cost1} €. Πόσα € θα πληρώσουμε αν αγοράσουμε ${books2} τέτοια βιβλία;`,
        tableData: { col1: 'Βιβλία', col2: 'Κόστος (€)', r1: [books1, cost1], r2: [books2, 'χ'] },
        correctVal: cost2,
        correctStr: String(cost2),
        explanation: `Οργανώνουμε τα δεδομένα σε πίνακα: χ ＝ (${cost1} · ${books2}) : ${books1} ＝ ${cost1 * books2} : ${books1} ＝ ${cost2} €.`
      };
    }
  },
  {
    id: 'p_xiasti_std_6',
    generate: () => {
      const min1 = randInt(3, 6) * 10; // π.χ. 30, 40 min
      const litersPerMin = randInt(15, 25);
      const lit1 = min1 * litersPerMin;
      const min2 = min1 + randInt(2, 4) * 10;
      const lit2 = min2 * litersPerMin;
      return {
        text: `Μια βρύση σταθερής ροής γεμίζει δεξαμενή με ${lit1} l νερό σε ${min1} λεπτά. Πόσα l νερό θα τρέξουν σε ${min2} λεπτά;`,
        tableData: { col1: 'Χρόνος (min)', col2: 'Όγκος (l)', r1: [min1, lit1], r2: [min2, 'χ'] },
        correctVal: lit2,
        correctStr: String(lit2),
        explanation: `Από τον πίνακα ποσών και τιμών: ${min1} : ${lit1} ＝ ${min2} : χ. Με χιαστί βρίσκουμε: χ ＝ (${lit1} · ${min2}) : ${min1} ＝ ${lit2} l.`
      };
    }
  },
  {
    id: 'p_xiasti_std_7',
    generate: () => {
      const area1 = randInt(3, 6) * 10; // m2
      const grassSeed = area1 * 25; // γραμμάρια
      const area2 = area1 + randInt(2, 5) * 10;
      const grassSeed2 = area2 * 25;
      return {
        text: `Για τη σπορά χλοοτάπητα εμβαδού ${area1} m² χρειάζονται ${grassSeed} g σπόρων. Πόσα g σπόρων θα χρειαστούν για επιφάνεια ${area2} m²;`,
        tableData: { col1: 'Εμβαδόν (m²)', col2: 'Σπόροι (g)', r1: [area1, grassSeed], r2: [area2, 'χ'] },
        correctVal: grassSeed2,
        correctStr: String(grassSeed2),
        explanation: `Εμβαδόν και ποσότητα σπόρων είναι ανάλογα ποσά: χ ＝ (${grassSeed} · ${area2}) : ${area1} ＝ ${grassSeed2} g.`
      };
    }
  },
  {
    id: 'p_xiasti_std_8',
    generate: () => {
      const sheets1 = randInt(3, 6) * 50;
      const weight1 = sheets1 * 4; // γραμμάρια
      const sheets2 = sheets1 + randInt(2, 4) * 50;
      const weight2 = sheets2 * 4;
      return {
        text: `Ένα πακέτο με ${sheets1} φύλλα χαρτιού ζυγίζει ${weight1} g. Πόσα g ζυγίζουν ${sheets2} ίδια φύλλα χαρτιού;`,
        tableData: { col1: 'Φύλλα', col2: 'Βάρος (g)', r1: [sheets1, weight1], r2: [sheets2, 'χ'] },
        correctVal: weight2,
        correctStr: String(weight2),
        explanation: `Σχηματίζουμε τον πίνακα: ${sheets1} : ${weight1} ＝ ${sheets2} : χ. Εφαρμόζουμε σταυρωτό πολλαπλασιασμό: χ ＝ (${weight1} · ${sheets2}) : ${sheets1} ＝ ${weight2} g.`
      };
    }
  },
  {
    id: 'p_xiasti_std_9',
    generate: () => {
      const shirts1 = randInt(3, 5);
      const buttons1 = shirts1 * 8;
      const shirts2 = randInt(8, 14);
      const buttons2 = shirts2 * 8;
      return {
        text: `Για να ραφτούν ${shirts1} πουκάμισα απαιτούνται ${buttons1} κουμπιά. Πόσα κουμπιά θα χρειαστούν για ${shirts2} ίδια πουκάμισα;`,
        tableData: { col1: 'Πουκάμισα', col2: 'Κουμπιά', r1: [shirts1, buttons1], r2: [shirts2, 'χ'] },
        correctVal: buttons2,
        correctStr: String(buttons2),
        explanation: `Στήνουμε τον πίνακα: ${shirts1} προς ${buttons1} και ${shirts2} προς χ. Άρα χ ＝ (${buttons1} · ${shirts2}) : ${shirts1} ＝ ${buttons2} κουμπιά.`
      };
    }
  },
  {
    id: 'p_xiasti_std_10',
    generate: () => {
      const days1 = randInt(3, 5);
      const foodKg = days1 * 4;
      const days2 = days1 + randInt(3, 6);
      const foodKg2 = days2 * 4;
      return {
        text: `Σε ένα καταφύγιο ζώων καταναλώνονται ${foodKg} kg τροφής σε ${days1} ημέρες. Πόσα kg τροφής θα χρειαστούν για ${days2} ημέρες;`,
        tableData: { col1: 'Ημέρες', col2: 'Τροφή (kg)', r1: [days1, foodKg], r2: [days2, 'χ'] },
        correctVal: foodKg2,
        correctStr: String(foodKg2),
        explanation: `Οργανώνουμε τον πίνακα: ${days1} : ${foodKg} ＝ ${days2} : χ. Με χιαστί υπολογίζουμε: χ ＝ (${foodKg} · ${days2}) : ${days1} ＝ ${foodKg2} kg.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (10 διαφορετικα προβληματα)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_xiasti_hard_1',
    generate: () => {
      const massKg = 2.5;
      const costEur = 7.5;
      const massGrams = randInt(6, 14) * 250; // π.χ. 1750, 2000, 2500 g
      const massKgTarget = massGrams / 1000;
      const finalCost = (costEur * massKgTarget) / massKg;
      return {
        text: `Τα ${formatNum(massKg)} kg ενός προϊόντος κοστίζουν ${formatNum(costEur)} €. Πόσα € κοστίζουν ${massGrams} g από το ίδιο προϊόν;`,
        tableData: { col1: 'Βάρος (g)', col2: 'Κόστος (€)', r1: [massKg * 1000, formatNum(costEur)], r2: [massGrams, 'χ'] },
        correctVal: Number(finalCost.toFixed(2)),
        correctStr: formatNum(finalCost),
        explanation: `Μετατρέπουμε πρώτα τα ${formatNum(massKg)} kg σε γραμμάρια: ${formatNum(massKg)} · 1.000 ＝ ${massKg * 1000} g. Τοποθετούμε στον πίνακα: ${massKg * 1000} : ${formatNum(costEur)} ＝ ${massGrams} : χ. Με χιαστί βρίσκουμε: χ ＝ (${formatNum(costEur)} · ${massGrams}) : ${massKg * 1000} ＝ ${formatNum(finalCost)} €.`
      };
    }
  },
  {
    id: 'p_xiasti_hard_2',
    generate: () => {
      const hours = 1;
      const extraMinutes = 30; // 1 h 30 min = 90 min
      const totalMin1 = hours * 60 + extraMinutes;
      const pages1 = 45;
      const targetHours = 2; // 2 h = 120 min
      const targetMin = targetHours * 60;
      const targetPages = (pages1 * targetMin) / totalMin1;
      return {
        text: `Μια εκτυπωτική μηχανή τυπώνει ${pages1} αφίσες σε 1 ώρα και ${extraMinutes} λεπτά. Πόσες αφίσες θα τυπώσει σε ${targetHours} ώρες συνεχούς λειτουργίας;`,
        tableData: { col1: 'Χρόνος (min)', col2: 'Αφίσες', r1: [totalMin1, pages1], r2: [targetMin, 'χ'] },
        correctVal: targetPages,
        correctStr: String(targetPages),
        explanation: `Μετατρέπουμε όλες τις μονάδες χρόνου σε λεπτά: 1 h 30 min ＝ 90 min και 2 h ＝ 120 min. Στήνουμε τον πίνακα: 90 : 45 ＝ 120 : χ. Εφαρμόζοντας χιαστί: χ ＝ (45 · 120) : 90 ＝ 5.400 : 90 ＝ ${targetPages} αφίσες.`
      };
    }
  },
  {
    id: 'p_xiasti_hard_3',
    generate: () => {
      const origEur = randInt(12, 25) * 10;
      const pct = 25;
      const discEur = (origEur * pct) / 100;
      const payEur = origEur - discEur;
      return {
        text: `Σε περίοδο εκπτώσεων ένα κατάστημα προσφέρει έκπτωση ${pct} %. Αν ένα μπουφάν είχε αρχική τιμή ${origEur} €, πόσα € θα πληρώσει τελικά ο αγοραστής;`,
        tableData: { col1: 'Αρχική (€)', col2: 'Τελική (€)', r1: [100, 100 - pct], r2: [origEur, 'χ'] },
        correctVal: payEur,
        correctStr: formatNum(payEur),
        explanation: `Η αρχική τιμή 100 € αντιστοιχεί σε τελική πληρωμή ${100 - pct} €. Στήνουμε τον πίνακα ποσών και τιμών: 100 : ${100 - pct} ＝ ${origEur} : χ. Με χιαστί υπολογίζουμε: χ ＝ (${100 - pct} · ${origEur}) : 100 ＝ ${formatNum(payEur)} €.`
      };
    }
  },
  {
    id: 'p_xiasti_hard_4',
    generate: () => {
      const scale = 250000;
      const mapCm = 4.5;
      const realKm = (mapCm * scale) / 100000; // cm to km
      return {
        text: `Σε έναν οδικό χάρτη με κλίμακα 1 : ${formatNum(scale)}, δύο πόλεις απέχουν ${formatNum(mapCm)} cm. Πόσα km είναι η πραγματική απόσταση μεταξύ τους;`,
        tableData: { col1: 'Χάρτης (cm)', col2: 'Πραγματικότητα (cm)', r1: [1, scale], r2: [formatNum(mapCm), 'χ'] },
        correctVal: realKm,
        correctStr: formatNum(realKm),
        explanation: `Η κλίμακα δηλώνει ότι 1 cm στον χάρτη ισούται με ${scale} cm στην πραγματικότητα. Με χιαστί: χ ＝ ${formatNum(mapCm)} · ${scale} ＝ ${mapCm * scale} cm. Μετατρέπουμε τα cm σε km διαιρώντας με το 100.000: ${mapCm * scale} : 100.000 ＝ ${formatNum(realKm)} km.`
      };
    }
  },
  {
    id: 'p_xiasti_hard_5',
    generate: () => {
      const totalMix = 480; // ml
      const syrupPart = 3;
      const waterPart = 5;
      const totalParts = syrupPart + waterPart;
      const syrupMl = (totalMix * syrupPart) / totalParts;
      return {
        text: `Σε ένα αναψυκτικό ο λόγος του σιροπιού προς το νερό είναι ${syrupPart} : ${waterPart}. Αν το τελικό μείγμα έχει όγκο ${totalMix} ml, πόσα ml σιροπιού περιέχονται σε αυτό;`,
        tableData: { col1: 'Μέρη Σιροπιού', col2: 'Συνολικά Μέρη', r1: [syrupPart, totalParts], r2: ['χ', totalMix] },
        correctVal: syrupMl,
        correctStr: String(syrupMl),
        explanation: `Τα συνολικά μέρη του μείγματος είναι ${syrupPart} ＋ ${waterPart} ＝ ${totalParts}. Οργανώνουμε τον πίνακα: στα ${totalParts} μέρη αντιστοιχούν ${syrupPart} μέρη σιροπιού, άρα στα ${totalMix} ml αντιστοιχούν χ ml. Με χιαστί: χ ＝ (${syrupPart} · ${totalMix}) : ${totalParts} ＝ ${syrupMl} ml.`
      };
    }
  },
  {
    id: 'p_xiasti_hard_6',
    generate: () => {
      const areaHectares = 1.2; // εκτάρια (1 εκτάριο = 10.000 m2)
      const areaM2 = areaHectares * 10000;
      const treesPer100 = 15;
      const totalTrees = (areaM2 * treesPer100) / 100;
      return {
        text: `Σε έναν ελαιώνα φυτεύονται ${treesPer100} ελαιόδεντρα ανά 100 m² επιφάνειας. Πόσα δέντρα θα φυτευτούν σε οικόπεδο εμβαδού ${formatNum(areaHectares)} εκταρίων (1 εκτάριο ＝ 10.000 m²);`,
        tableData: { col1: 'Εμβαδόν (m²)', col2: 'Δέντρα', r1: [100, treesPer100], r2: [areaM2, 'χ'] },
        correctVal: totalTrees,
        correctStr: String(totalTrees),
        explanation: `Μετατρέπουμε τα εκτάρια σε m²: ${formatNum(areaHectares)} · 10.000 ＝ ${areaM2} m². Στον πίνακα ποσών και τιμών: 100 m² δίνουν ${treesPer100} δέντρα, άρα ${areaM2} m² δίνουν χ δέντρα. Με χιαστί: χ ＝ (${treesPer100} · ${areaM2}) : 100 ＝ ${totalTrees} δέντρα.`
      };
    }
  },
  {
    id: 'p_xiasti_hard_7',
    generate: () => {
      const vatRate = 24;
      const netEur = randInt(15, 30) * 10;
      const vatEur = (netEur * vatRate) / 100;
      const grossEur = netEur + vatEur;
      return {
        text: `Ένα ηλεκτρονικό κατάστημα τιμολογεί τα προϊόντα του με Φ.Π.Α. ${vatRate} %. Αν η καθαρή αξία ενός υπολογιστή είναι ${netEur} €, ποια είναι η τελική τιμή του μαζί με τον φόρο σε €;`,
        tableData: { col1: 'Καθαρή (€)', col2: 'Τελική (€)', r1: [100, 100 + vatRate], r2: [netEur, 'χ'] },
        correctVal: grossEur,
        correctStr: formatNum(grossEur),
        explanation: `Για καθαρή αξία 100 € η τελική τιμή είναι 124 €. Στήνουμε τον πίνακα: 100 : 124 ＝ ${netEur} : χ. Με χιαστί: χ ＝ (124 · ${netEur}) : 100 ＝ ${formatNum(grossEur)} €.`
      };
    }
  },
  {
    id: 'p_xiasti_hard_8',
    generate: () => {
      const lengthM = 3.6;
      const lengthCm = lengthM * 100;
      const costEur = 54;
      const targetCm = 120;
      const targetEur = (costEur * targetCm) / lengthCm;
      return {
        text: `Ένα μεταλλικό προφίλ μήκους ${formatNum(lengthM)} m κοστίζει ${costEur} €. Πόσα € κοστίζει ένα κομμάτι από το ίδιο υλικό μήκους ${targetCm} cm;`,
        tableData: { col1: 'Μήκος (cm)', col2: 'Κόστος (€)', r1: [lengthCm, costEur], r2: [targetCm, 'χ'] },
        correctVal: targetEur,
        correctStr: formatNum(targetEur),
        explanation: `Μετατρέπουμε το μήκος σε cm: ${formatNum(lengthM)} m ＝ ${lengthCm} cm. Στον πίνακα ποσών και τιμών: ${lengthCm} : ${costEur} ＝ ${targetCm} : χ. Εφαρμόζουμε χιαστί: χ ＝ (${costEur} · ${targetCm}) : ${lengthCm} ＝ ${formatNum(targetEur)} €.`
      };
    }
  },
  {
    id: 'p_xiasti_hard_9',
    generate: () => {
      const fuelPer100 = 6.5; // l / 100 km
      const targetKm = randInt(4, 8) * 60; // π.χ. 360 km
      const totalFuel = (fuelPer100 * targetKm) / 100;
      return {
        text: `Ένα υβριδικό αυτοκίνητο καταναλώνει κατά μέσο όρο ${formatNum(fuelPer100)} l βενζίνης ανά 100 km διαδρομής. Πόσα l καυσίμου θα χρειαστεί για ταξίδι ${targetKm} km;`,
        tableData: { col1: 'Απόσταση (km)', col2: 'Καύσιμο (l)', r1: [100, formatNum(fuelPer100)], r2: [targetKm, 'χ'] },
        correctVal: Number(totalFuel.toFixed(2)),
        correctStr: formatNum(totalFuel),
        explanation: `Στήνουμε τον πίνακα: στα 100 km αντιστοιχούν ${formatNum(fuelPer100)} l, άρα στα ${targetKm} km αντιστοιχούν χ l. Με χιαστί υπολογίζουμε: χ ＝ (${formatNum(fuelPer100)} · ${targetKm}) : 100 ＝ ${formatNum(totalFuel)} l.`
      };
    }
  },
  {
    id: 'p_xiasti_hard_10',
    generate: () => {
      const ratioA = 2;
      const ratioB = 7;
      const sumR = ratioA + ratioB; // 9
      const k = randInt(15, 30);
      const total = sumR * k;
      const valA = ratioA * k;
      const valB = ratioB * k;
      const diff = valB - valA;
      return {
        text: `Δύο χωριά έχουν πληθυσμούς με λόγο ${ratioA} : ${ratioB}. Αν το σύνολο των κατοίκων των δύο χωριών είναι ${total} άτομα, πόσους περισσότερους κατοίκους έχει το μεγαλύτερο χωριό;`,
        tableData: { col1: 'Διαφορά Μερών', col2: 'Συνολικά Μέρη', r1: [ratioB - ratioA, sumR], r2: ['χ', total] },
        correctVal: diff,
        correctStr: String(diff),
        explanation: `Τα συνολικά μέρη είναι ${ratioA} ＋ ${ratioB} ＝ ${sumR} μέρη, ενώ η διαφορά τους είναι ${ratioB} － ${ratioA} ＝ ${ratioB - ratioA} μέρη. Στήνουμε τον πίνακα: στα ${sumR} μέρη αντιστοιχούν ${total} κάτοικοι, άρα στα ${ratioB - ratioA} μέρη αντιστοιχούν χ κάτοικοι. Με χιαστί: χ ＝ (${ratioB - ratioA} · ${total}) : ${sumR} ＝ ${diff} κάτοικοι.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Συμπλήρωση πίνακα ποσών & εύρεση χ
  {
    const a = randInt(3, 6);
    const b = randInt(12, 30);
    const c = randInt(7, 12);
    const xVal = (b * c) / a;
    const isClean = Number.isInteger(xVal);
    const finalVal = isClean ? xVal : Number(xVal.toFixed(2));

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΣΥΜΠΛΗΡΩΣΗ ΠΙΝΑΚΑ ΠΟΣΩΝ',
      instruction: 'Υπολογίστε τον άγνωστο όρο χ από τον παρακάτω πίνακα ποσών και τιμών:',
      prompt: `Δίνεται ο πίνακας ανάλογων ποσών. Βρείτε την τιμή του χ:`,
      table: { col1: 'Ποσό 1', col2: 'Ποσό 2', r1: [a, b], r2: [c, 'χ'] },
      correctVal: finalVal,
      correctStr: formatNum(finalVal),
      explanation: `Από τον πίνακα ποσών και τιμών σχηματίζουμε την αναλογία: ${a} : ${b} ＝ ${c} : χ. Εφαρμόζοντας χιαστί πολλαπλασιασμό βρίσκουμε: χ ＝ (${b} · ${c}) : ${a} ＝ ${b * c} : ${a} ＝ ${formatNum(finalVal)}.`
    });
  }

  // Q2 (MCQ): Επιλογή σωστής εξίσωσης χιαστί
  {
    const p1 = randInt(4, 8);
    const p2 = randInt(15, 35);
    const p3 = randInt(9, 14);

    const correctEq = `χ ＝ (${p2} · ${p3}) : ${p1}`;
    const wrong1 = `χ ＝ (${p1} · ${p2}) : ${p3}`;
    const wrong2 = `χ ＝ (${p1} · ${p3}) : ${p2}`;
    const wrong3 = `χ ＝ (${p2} ＋ ${p3}) : ${p1}`;

    const options = [
      { text: correctEq, isCorrect: true },
      { text: wrong1, isCorrect: false },
      { text: wrong2, isCorrect: false },
      { text: wrong3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΜΑΘΗΜΑΤΙΚΟΣ ΤΥΠΟΣ ΧΙΑΣΤΙ',
      instruction: 'Επιλέξτε τον σωστό τύπο υπολογισμού του χ:',
      prompt: `Αν σε έναν πίνακα ποσών έχουμε: ${p1} αντιστοιχεί σε ${p2} και ${p3} αντιστοιχεί σε χ, ποιος είναι ο σωστός τύπος επίλυσης;`,
      table: { col1: 'Μέγεθος Α', col2: 'Μέγεθος Β', r1: [p1, p2], r2: [p3, 'χ'] },
      options,
      correctText: correctEq,
      explanation: `Στον χιαστί πολλαπλασιασμό πολλαπλασιάζουμε τα στοιχεία της πλήρους διαγωνίου (${p2} · ${p3}) και διαιρούμε με το στοιχείο που είναι διαγώνια απέναντι από το χ (${p1}): ${correctEq}.`
    });
  }

  // Q3 (Input - Decimal): Άγνωστος στη θέση του πρώτου ποσού (χ στην πρώτη στήλη)
  {
    const k = randInt(3, 7);
    const mult = randInt(4, 9);
    const b = k * mult;
    const c = randInt(5, 12);
    const d = c * mult;
    const xVal = k;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΑΓΝΩΣΤΟΣ ΣΕ ΔΙΑΦΟΡΕΤΙΚΗ ΘΕΣΗ',
      instruction: 'Βρείτε την τιμή του χ από τα στοιχεία του πίνακα:',
      prompt: `Υπολογίστε τον άγνωστο όρο χ:`,
      table: { col1: 'Ποσό Α', col2: 'Ποσό Β', r1: ['χ', b], r2: [c, d] },
      correctVal: xVal,
      correctStr: String(xVal),
      explanation: `Σχηματίζουμε την ισότητα των σταυρωτών γινομένων: χ · ${d} ＝ ${b} · ${c} ➔ χ ＝ (${b} · ${c}) : ${d} ＝ ${b * c} : ${d} ＝ ${xVal}.`
    });
  }

  // Q4 (MCQ): Έλεγχος αν ένας πίνακας είναι πίνακας ανάλογων ποσών
  {
    const base1 = randInt(2, 5);
    const base2 = randInt(6, 10);
    const mult = randInt(2, 4);

    const isTrue = Math.random() > 0.4;
    const row2Col1 = base1 * mult;
    const row2Col2 = isTrue ? base2 * mult : base2 * mult + randInt(2, 5);

    const correctAns = isTrue
      ? `Ναι, γιατί τα σταυρωτά γινόμενα είναι ίσα (${base1} · ${row2Col2} ＝ ${base2} · ${row2Col1})`
      : `Όχι, γιατί τα σταυρωτά γινόμενα δεν είναι ίσα (${base1 * row2Col2} ≠ ${base2 * row2Col1})`;

    const wrongAns = isTrue
      ? `Όχι, γιατί οι αριθμοί δεν είναι ίσοι`
      : `Ναι, γιατί τα ποσά αυξάνονται`;

    const options = [
      { text: correctAns, isCorrect: true },
      { text: wrongAns, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΕΛΕΓΧΟΣ ΠΙΝΑΚΑ ΑΝΑΛΟΓΙΑΣ',
      instruction: 'Εξετάστε αν ο πίνακας περιέχει ανάλογα ποσά:',
      prompt: `Είναι ο παρακάτω πίνακας πίνακας ανάλογων ποσών;`,
      table: { col1: 'Ποσό 1', col2: 'Ποσό 2', r1: [base1, base2], r2: [row2Col1, row2Col2] },
      options,
      correctText: correctAns,
      explanation: `Ελέγχουμε τα σταυρωτά γινόμενα (χιαστί): ${base1} · ${row2Col2} ＝ ${base1 * row2Col2} και ${base2} · ${row2Col1} ＝ ${base2 * row2Col1}. ${correctAns}.`
    });
  }

  // Q5 (Input - Decimal): Υπολογισμός χ σε σχέση κλασμάτων
  {
    const n = randInt(3, 8);
    const d = randInt(4, 9);
    const m = randInt(2, 5);
    const targetN = n * m;
    const targetD = d * m;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΕΠΙΛΥΣΗ ΜΕ ΧΙΑΣΤΙ ΣΕ ΚΛΑΣΜΑΤΑ',
      instruction: 'Υπολογίστε τον άγνωστο χ εφαρμόζοντας χιαστί πολλαπλασιασμό:',
      prompt: `Στην ισότητα κλασμάτων ${n}/${d} ＝ ${targetN}/χ, ποια είναι η τιμή του χ;`,
      fractionDisplay: { num1: n, den1: d, num2: targetN, den2: 'χ' },
      correctVal: targetD,
      correctStr: String(targetD),
      explanation: `Εφαρμόζοντας σταυρωτά γινόμενα: ${n} · χ ＝ ${d} · ${targetN} ➔ χ ＝ (${d} · ${targetN}) : ${n} ＝ ${d * targetN} : ${n} ＝ ${targetD}.`
    });
  }

  // Q6 (MCQ): Προβλεπόμενος πολλαπλασιασμός
  {
    const a = randInt(5, 9);
    const b = randInt(11, 18);
    const c = randInt(3, 7);
    const correctMult = `${a} · χ ＝ ${b} · ${c}`;
    const fake1 = `${a} · ${b} ＝ ${c} · χ`;
    const fake2 = `${a} · ${c} ＝ ${b} · χ`;
    const fake3 = `${a} ＋ χ ＝ ${b} ＋ ${c}`;

    const options = [
      { text: correctMult, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΣΤΑΥΡΩΤΟ ΓΙΝΟΜΕΝΟ',
      instruction: 'Επιλέξτε τη σωστή ισότητα σταυρωτών γινομένων:',
      prompt: `Από την αναλογία ${a} : ${b} ＝ ${c} : χ, ποια σχέση προκύπτει άμεσα;`,
      options,
      correctText: correctMult,
      explanation: `Σύμφωνα με την ιδιότητα του χιαστί πολλαπλασιασμού, τα σταυρωτά γινόμενα είναι ίσα: ${correctMult}.`
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
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΟΒΛΗΜΑ ΠΙΝΑΚΑ ΚΑΙ ΧΙΑΣΤΙ',
      instruction: 'Λύστε το πρόβλημα χρησιμοποιώντας πίνακα ποσών και τιμών:',
      prompt: stdProb1.text,
      table: stdProb1.tableData,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal;
    const fake8A = typeof val8 === 'number' ? val8 + randInt(3, 8) : '0';
    const fake8B = typeof val8 === 'number' ? Math.max(1, val8 - randInt(2, 6)) : '0';
    const fake8C = typeof val8 === 'number' ? Math.round(val8 * 1.4) : '0';

    const optionsQ8 = [
      { text: String(val8), isCorrect: true },
      { text: String(fake8A), isCorrect: false },
      { text: String(fake8B), isCorrect: false },
      { text: String(fake8C), isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΑΝΑΛΟΓΙΑΣ ΧΙΑΣΤΙ',
      instruction: 'Επιλέξτε τη σωστή τιμή για το πρόβλημα:',
      prompt: stdProb2.text,
      table: stdProb2.tableData,
      options: optionsQ8,
      correctText: String(val8),
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
    const fake10A = formatNum(val10 + randInt(4, 12));
    const fake10B = formatNum(Math.max(1, val10 - randInt(3, 9)));
    const fake10C = formatNum(val10 * 1.3);

    const optionsQ10 = [
      { text: hardProb2.correctStr, isCorrect: true },
      { text: String(fake10A), isCorrect: false },
      { text: String(fake10B), isCorrect: false },
      { text: String(fake10C), isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΜΕΤΑΤΡΟΠΩΝ & ΧΙΑΣΤΙ',
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

export default function XiastiExercisesPage() {
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
      title="Ασκήσεις: Αναλογία Χιαστί - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις με πίνακες ποσών και τιμών, σταυρωτό πολλαπλασιασμό χιαστί, μετατροπές μονάδων και προβλήματα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/42-analogia-xiasti"
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
              Ασκήσεις &amp; Προβλήματα: Αναλογία Χιαστί
            </h1>
            <p className="text-sky-100 text-sm sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με πίνακες ποσών και τιμών, σταυρωτά γινόμενα και σύνθετα προβλήματα με δεκαδικούς αριθμούς και μετατροπές μονάδων.
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

                {/* Εκφωνηση & Πινακας Δεδομενων */}
                <div className="space-y-3 mb-5">
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    {q.instruction}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>

                  {/* Οπτικος Πινακας Ποσων & Τιμων */}
                  {q.table && (
                    <div className="inline-block bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 shadow-inner my-2 font-mono text-xs sm:text-sm">
                      <div className="grid grid-cols-2 gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                        <span className="bg-blue-100/60 px-2 py-0.5 rounded-lg text-blue-900">{q.table.col1}</span>
                        <span className="bg-emerald-100/60 px-2 py-0.5 rounded-lg text-emerald-900">{q.table.col2}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2 text-center font-black text-slate-800">
                        <span>{q.table.r1[0]}</span>
                        <span className="text-emerald-700">{q.table.r1[1]}</span>
                        <span>{q.table.r2[0]}</span>
                        <span className={q.table.r2[1] === 'χ' ? 'text-amber-600 font-black text-base' : 'text-emerald-700'}>
                          {q.table.r2[1]}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Κλασματικη Εμφανιση */}
                  {q.fractionDisplay && (
                    <div className="inline-flex items-center bg-slate-100 px-3 py-1 rounded-xl text-base font-bold my-1">
                      <Fraction num={q.fractionDisplay.num1} den={q.fractionDisplay.den1} />
                      <span className="mx-2">＝</span>
                      <Fraction num={q.fractionDisplay.num2} den={q.fractionDisplay.den2} />
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

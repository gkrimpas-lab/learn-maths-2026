// pages/st-dimotikou/48-methodos-trion-ask.js
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

// Δεξαμενη Κανονικων Προβληματων Μεθοδου των Τριων (10 διαφορετικα προβληματα)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'm3_std_1',
    generate: () => {
      const isAnaloga = true;
      const kg1 = randInt(3, 5);
      const unitCost = randInt(4, 8);
      const cost1 = kg1 * unitCost;
      const kg2 = kg1 + randInt(3, 6);
      const cost2 = kg2 * unitCost;
      return {
        isAnaloga,
        text: `Για ${kg1} kg τυρί πληρώσαμε ${cost1} €. Πόσα € θα πληρώσουμε για ${kg2} kg από το ίδιο τυρί;`,
        tableData: { col1: 'Βάρος (kg)', col2: 'Κόστος (€)', r1: [kg1, cost1], r2: [kg2, 'χ'] },
        correctVal: cost2,
        correctStr: String(cost2),
        explanation: `Τα ποσά είναι ανάλογα (περισσότερα κιλά ➔ περισσότερα χρήματα). Κατάταξη: ${kg1} kg ➔ ${cost1} € και ${kg2} kg ➔ χ €. Εφαρμόζουμε χιαστί πολλαπλασιασμό: χ ＝ (${cost1} · ${kg2}) : ${kg1} ＝ ${cost2} €.`
      };
    }
  },
  {
    id: 'm3_std_2',
    generate: () => {
      const isAnaloga = false;
      const w1 = randInt(2, 4);
      const d1 = randInt(6, 12);
      const totalWork = w1 * d1;
      const w2 = w1 + randInt(2, 4);
      const d2 = totalWork / w2;
      const cleanD2 = Number.isInteger(d2) ? d2 : Number(d2.toFixed(1));
      return {
        isAnaloga,
        text: `Σε ένα συνεργείο ${w1} μηχανικοί επισκευάζουν ένα μηχάνημα σε ${d1} ημέρες. Σε πόσες ημέρες θα το επισκεύαζαν ${w2} μηχανικοί με τον ίδιο ρυθμό εργασίας;`,
        tableData: { col1: 'Μηχανικοί', col2: 'Ημέρες', r1: [w1, d1], r2: [w2, 'χ'] },
        correctVal: cleanD2,
        correctStr: formatNum(cleanD2),
        explanation: `Τα ποσά είναι αντιστρόφως ανάλογα (περισσότεροι μηχανικοί ➔ λιγότερες ημέρες). Κατάταξη: ${w1} ➔ ${d1} και ${w2} ➔ χ. Εφαρμόζουμε οριζόντιο πολλαπλασιασμό: χ ＝ (${w1} · ${d1}) : ${w2} ＝ ${formatNum(cleanD2)} ημέρες.`
      };
    }
  },
  {
    id: 'm3_std_3',
    generate: () => {
      const isAnaloga = true;
      const hours1 = randInt(2, 4);
      const speed = randInt(70, 95);
      const dist1 = hours1 * speed;
      const hours2 = hours1 + randInt(2, 3);
      const dist2 = hours2 * speed;
      return {
        isAnaloga,
        text: `Ένα όχημα διανύει ${dist1} km σε ${hours1} ώρες με σταθερή ταχύτητα. Πόσα km θα διανύσει σε ${hours2} ώρες;`,
        tableData: { col1: 'Χρόνος (h)', col2: 'Απόσταση (km)', r1: [hours1, dist1], r2: [hours2, 'χ'] },
        correctVal: dist2,
        correctStr: String(dist2),
        explanation: `Τα ποσά είναι ανάλογα. Κατάταξη: ${hours1} h ➔ ${dist1} km και ${hours2} h ➔ χ km. Με χιαστί: χ ＝ (${dist1} · ${hours2}) : ${hours1} ＝ ${dist2} km.`
      };
    }
  },
  {
    id: 'm3_std_4',
    generate: () => {
      const isAnaloga = false;
      const speed1 = 60;
      const time1 = randInt(3, 5);
      const dist = speed1 * time1;
      const speed2 = 90;
      const time2 = dist / speed2;
      const cleanTime2 = Number.isInteger(time2) ? time2 : Number(time2.toFixed(1));
      return {
        isAnaloga,
        text: `Ένα τρένο καλύπτει μια διαδρομή σε ${time1} ώρες με ταχύτητα ${speed1} km/h. Πόσες ώρες θα χρειαστεί αν αυξήσει την ταχύτητά του στα ${speed2} km/h;`,
        tableData: { col1: 'Ταχύτητα (km/h)', col2: 'Χρόνος (h)', r1: [speed1, time1], r2: [speed2, 'χ'] },
        correctVal: cleanTime2,
        correctStr: formatNum(cleanTime2),
        explanation: `Ταχύτητα και χρόνος είναι αντιστρόφως ανάλογα ποσά (μεγαλύτερη ταχύτητα ➔ λιγότερος χρόνος). Οριζόντιος πολλαπλασιασμός: χ ＝ (${speed1} · ${time1}) : ${speed2} ＝ ${formatNum(cleanTime2)} ώρες.`
      };
    }
  },
  {
    id: 'm3_std_5',
    generate: () => {
      const isAnaloga = true;
      const count1 = randInt(3, 6);
      const priceUnit = randInt(8, 14);
      const total1 = count1 * priceUnit;
      const count2 = count1 + randInt(2, 5);
      const total2 = count2 * priceUnit;
      return {
        isAnaloga,
        text: `Για ${count1} εισιτήρια συναυλίας πληρώσαμε ${total1} €. Πόσα € θα κοστίσουν ${count2} τέτοια εισιτήρια;`,
        tableData: { col1: 'Εισιτήρια', col2: 'Κόστος (€)', r1: [count1, total1], r2: [count2, 'χ'] },
        correctVal: total2,
        correctStr: String(total2),
        explanation: `Ποσά ανάλογα. Χιαστί πολλαπλασιασμός: χ ＝ (${total1} · ${count2}) : ${count1} ＝ ${total2} €.`
      };
    }
  },
  {
    id: 'm3_std_6',
    generate: () => {
      const isAnaloga = false;
      const taps1 = randInt(2, 3);
      const hours1 = randInt(4, 6);
      const capacity = taps1 * hours1;
      const taps2 = taps1 + randInt(2, 3);
      const hours2 = capacity / taps2;
      const cleanH2 = Number.isInteger(hours2) ? hours2 : Number(hours2.toFixed(1));
      return {
        isAnaloga,
        text: `${taps1} ίδιες βρύσες γεμίζουν μια δεξαμενή σε ${hours1} ώρες. Σε πόσες ώρες θα γεμίσουν την ίδια δεξαμενή ${taps2} ίδιες βρύσες αν ανοίξουν ταυτόχρονα;`,
        tableData: { col1: 'Βρύσες', col2: 'Χρόνος (h)', r1: [taps1, hours1], r2: [taps2, 'χ'] },
        correctVal: cleanH2,
        correctStr: formatNum(cleanH2),
        explanation: `Ποσά αντιστρόφως ανάλογα (περισσότερες βρύσες ➔ λιγότερος χρόνος). Οριζόντια γινόμενα: χ ＝ (${taps1} · ${hours1}) : ${taps2} ＝ ${formatNum(cleanH2)} ώρες.`
      };
    }
  },
  {
    id: 'm3_std_7',
    generate: () => {
      const isAnaloga = true;
      const meters1 = randInt(4, 8);
      const costPerMeter = randInt(12, 18);
      const cost1 = meters1 * costPerMeter;
      const meters2 = meters1 + randInt(3, 6);
      const cost2 = meters2 * costPerMeter;
      return {
        text: `Ένα ύφασμα μήκους ${meters1} m κοστίζει ${cost1} €. Πόσο κοστίζουν ${meters2} m από το ίδιο ακριβώς ύφασμα;`,
        tableData: { col1: 'Μήκος (m)', col2: 'Κόστος (€)', r1: [meters1, cost1], r2: [meters2, 'χ'] },
        correctVal: cost2,
        correctStr: String(cost2),
        explanation: `Ποσά ανάλογα. Με χιαστί βρίσκουμε: χ ＝ (${cost1} · ${meters2}) : ${meters1} ＝ ${cost2} €.`
      };
    }
  },
  {
    id: 'm3_std_8',
    generate: () => {
      const isAnaloga = false;
      const capGrams1 = 200;
      const packs1 = randInt(12, 20);
      const totalWeight = capGrams1 * packs1;
      const capGrams2 = 250;
      const packs2 = totalWeight / capGrams2;
      const cleanPacks2 = Number.isInteger(packs2) ? packs2 : Number(packs2.toFixed(1));
      return {
        text: `Μια ποσότητα καφέ συσκευάστηκε σε ${packs1} πακέτα των ${capGrams1} g. Πόσα πακέτα των ${capGrams2} g θα απαιτούνταν για την ίδια ακριβώς ποσότητα;`,
        tableData: { col1: 'Βάρος πακέτου (g)', col2: 'Πλήθος πακέτων', r1: [capGrams1, packs1], r2: [capGrams2, 'χ'] },
        correctVal: cleanPacks2,
        correctStr: formatNum(cleanPacks2),
        explanation: `Ποσά αντιστρόφως ανάλογα (μεγαλύτερα πακέτα ➔ λιγότερο πλήθος). Οριζόντιος υπολογισμός: χ ＝ (${capGrams1} · ${packs1}) : ${capGrams2} ＝ ${formatNum(cleanPacks2)} πακέτα.`
      };
    }
  },
  {
    id: 'm3_std_9',
    generate: () => {
      const isAnaloga = true;
      const days1 = randInt(3, 6);
      const earnDay = randInt(40, 60);
      const total1 = days1 * earnDay;
      const days2 = days1 + randInt(3, 5);
      const total2 = days2 * earnDay;
      return {
        text: `Ένας εργαζόμενος έλαβε αμοιβή ${total1} € για εργασία ${days1} ημερών. Πόσα € θα λάβει αν εργαστεί για ${days2} ημέρες με το ίδιο ημερομίσθιο;`,
        tableData: { col1: 'Ημέρες', col2: 'Αμοιβή (€)', r1: [days1, total1], r2: [days2, 'χ'] },
        correctVal: total2,
        correctStr: String(total2),
        explanation: `Ποσά ανάλογα. Εφαρμόζουμε χιαστί: χ ＝ (${total1} · ${days2}) : ${days1} ＝ ${total2} €.`
      };
    }
  },
  {
    id: 'm3_std_10',
    generate: () => {
      const isAnaloga = false;
      const tract1 = randInt(2, 4);
      const days1 = randInt(6, 10);
      const totalPlow = tract1 * days1;
      const tract2 = tract1 + 2;
      const days2 = totalPlow / tract2;
      const cleanDays2 = Number.isInteger(days2) ? days2 : Number(days2.toFixed(1));
      return {
        text: `${tract1} τρακτέρ οργώνουν ένα χωράφι σε ${days1} ημέρες. Σε πόσες ημέρες θα το όργωναν ${tract2} όμοια τρακτέρ;`,
        tableData: { col1: 'Τρακτέρ', col2: 'Ημέρες', r1: [tract1, days1], r2: [tract2, 'χ'] },
        correctVal: cleanDays2,
        correctStr: formatNum(cleanDays2),
        explanation: `Ποσά αντιστρόφως ανάλογα (περισσότερα τρακτέρ ➔ λιγότερες ημέρες). Οριζόντια γινόμενα: χ ＝ (${tract1} · ${days1}) : ${tract2} ＝ ${formatNum(cleanDays2)} ημέρες.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (10 διαφορετικα προβληματα)
const HARD_PROBLEMS_POOL = [
  {
    id: 'm3_hard_1',
    generate: () => {
      const speed1 = 80;
      const minutes1 = 150; // 2 h 30 min
      const dist = (speed1 * minutes1) / 60; // 200 km
      const targetMin = 100; // 1 h 40 min
      const reqSpeed = (dist / targetMin) * 60; // 120 km/h
      return {
        text: `Ένα αυτοκίνητο καλύπτει μια διαδρομή σε 2 ώρες και 30 λεπτά με σταθερή ταχύτητα ${speed1} km/h. Με ποια ταχύτητα σε km/h πρέπει να κινηθεί για να καλύψει την ίδια διαδρομή σε 1 ώρα και 40 λεπτά;`,
        tableData: { col1: 'Ταχύτητα (km/h)', col2: 'Χρόνος (min)', r1: [speed1, minutes1], r2: ['χ', targetMin] },
        correctVal: reqSpeed,
        correctStr: String(reqSpeed),
        explanation: `Μετατρέπουμε τον χρόνο σε λεπτά: 2 h 30 min ＝ 150 min και 1 h 40 min ＝ 100 min. Ταχύτητα και χρόνος είναι αντιστρόφως ανάλογα ποσά (σταθερή απόσταση). Οριζόντιος υπολογισμός: χ ＝ (${speed1} · 150) : 100 ＝ 12.000 : 100 ＝ ${reqSpeed} km/h.`
      };
    }
  },
  {
    id: 'm3_hard_2',
    generate: () => {
      const flourGrams = 800;
      const breadKg = 1.2;
      const targetFlourKg = 3; // 3.000 g
      const targetFlourGrams = 3000;
      const resBread = (breadKg * targetFlourGrams) / flourGrams; // 4.5 kg
      return {
        text: `Από ${flourGrams} g αλεύρι παρασκευάζονται ${formatNum(breadKg)} kg ψωμί. Πόσα kg ψωμί θα παρασκευαστούν χρησιμοποιώντας ${targetFlourKg} kg από το ίδιο αλεύρι;`,
        tableData: { col1: 'Αλεύρι (g)', col2: 'Ψωμί (kg)', r1: [flourGrams, formatNum(breadKg)], r2: [targetFlourGrams, 'χ'] },
        correctVal: resBread,
        correctStr: formatNum(resBread),
        explanation: `Μετατρέπουμε τα ${targetFlourKg} kg σε γραμμάρια: 3.000 g. Τα ποσά είναι ανάλογα. Εφαρμόζουμε χιαστί: χ ＝ (${formatNum(breadKg)} · 3.000) : ${flourGrams} ＝ 3.600 : 800 ＝ ${formatNum(resBread)} kg.`
      };
    }
  },
  {
    id: 'm3_hard_3',
    generate: () => {
      const initWorkers = 6;
      const initDays = 18;
      const doneDays = 3;
      const remDays = initDays - doneDays; // 15
      const remWork = initWorkers * remDays; // 90
      const addedWorkers = 3;
      const totalWorkers = initWorkers + addedWorkers; // 9
      const finalDays = remWork / totalWorkers; // 10
      return {
        text: `Μια ομάδα ${initWorkers} εργατών είχε προγραμματίσει να τελειώσει ένα έργο σε ${initDays} ημέρες. Αφού εργάστηκαν μόνοι τους για ${doneDays} ημέρες, προστέθηκαν στην ομάδα άλλοι ${addedWorkers} εργάτες. Σε πόσες ημέρες θα παραδοθεί το υπόλοιπο του έργου;`,
        tableData: { col1: 'Εργάτες', col2: 'Ημέρες υπολοίπου', r1: [initWorkers, remDays], r2: [totalWorkers, 'χ'] },
        correctVal: finalDays,
        correctStr: String(finalDays),
        explanation: `Το έργο που απομένει αντιστοιχεί σε ${initWorkers} εργάτες για ${remDays} ημέρες. Τώρα οι εργάτες έγιναν ${totalWorkers}. Ποσά αντιστρόφως ανάλογα: χ ＝ (${initWorkers} · ${remDays}) : ${totalWorkers} ＝ 90 : 9 ＝ ${finalDays} ημέρες.`
      };
    }
  },
  {
    id: 'm3_hard_4',
    generate: () => {
      const olivesKg = 30;
      const oilLiters = 5; // 6 kg ελιές για 1 l λάδι
      const targetMlLiters = 9000; // 9 l
      const targetLiters = 9;
      const olivesNeeded = targetLiters * (olivesKg / oilLiters); // 54 kg
      return {
        text: `Από ${olivesKg} kg ελιές παράγονται ${oilLiters} l λάδι. Πόσα kg ελιές απαιτούνται για να παραχθούν ${targetMlLiters} ml ελαιόλαδο ίδιας ποιότητας;`,
        tableData: { col1: 'Λάδι (l)', col2: 'Ελιές (kg)', r1: [oilLiters, olivesKg], r2: [targetLiters, 'χ'] },
        correctVal: olivesNeeded,
        correctStr: String(olivesNeeded),
        explanation: `Μετατρέπουμε τα ${targetMlLiters} ml σε λίτρα: 9 l. Τα ποσά είναι ανάλογα. Με χιαστί: χ ＝ (${olivesKg} · 9) : ${oilLiters} ＝ 270 : 5 ＝ ${olivesNeeded} kg ελιές.`
      };
    }
  },
  {
    id: 'm3_hard_5',
    generate: () => {
      const soldiers = 100;
      const days = 30;
      const totalRations = soldiers * days; // 3000
      const addedSoldiers = 20;
      const totalSoldiers = soldiers + addedSoldiers; // 120
      const newDays = totalRations / totalSoldiers; // 25
      const diffDays = days - newDays; // 5
      return {
        text: `Σε ένα καταφύγιο υπάρχουν τρόφιμα για ${soldiers} άτομα για ${days} ημέρες. Αν προστεθούν άλλα ${addedSoldiers} άτομα, πόσες ημέρες λιγότερο θα διαρκέσουν τα τρόφιμα;`,
        tableData: { col1: 'Άτομα', col2: 'Ημέρες', r1: [soldiers, days], r2: [totalSoldiers, 'χ'] },
        correctVal: diffDays,
        correctStr: String(diffDays),
        explanation: `Ποσά αντιστρόφως ανάλογα (σταθερές μερίδες). Με ${totalSoldiers} άτομα οι ημέρες είναι: χ ＝ (${soldiers} · ${days}) : ${totalSoldiers} ＝ 3.000 : 120 ＝ 25 ημέρες. Άρα θα διαρκέσουν ${days} － 25 ＝ ${diffDays} ημέρες λιγότερο.`
      };
    }
  },
  {
    id: 'm3_hard_6',
    generate: () => {
      const scale = 250000;
      const mapCm = 4.8;
      const realKm = (mapCm * scale) / 100000; // 12 km
      return {
        text: `Σε έναν οδικό χάρτη με κλίμακα 1 : 250.000, δύο τοποθεσίες απέχουν μεταξύ τους ${formatNum(mapCm)} cm. Πόσα km είναι η πραγματική τους απόσταση;`,
        tableData: { col1: 'Χάρτης (cm)', col2: 'Πραγματικότητα (km)', r1: [1, 2.5], r2: [formatNum(mapCm), 'χ'] },
        correctVal: realKm,
        correctStr: formatNum(realKm),
        explanation: `Η κλίμακα είναι αναλογία: 1 cm στον χάρτη αντιστοιχεί σε 250.000 cm ＝ 2,5 km. Για ${formatNum(mapCm)} cm η απόσταση είναι: ${formatNum(mapCm)} · 2,5 ＝ ${formatNum(realKm)} km.`
      };
    }
  },
  {
    id: 'm3_hard_7',
    generate: () => {
      const origCost = 160;
      const vatPct = 24;
      const grossCost = origCost * (1 + vatPct / 100); // 198.4
      return {
        text: `Ένα προϊόν έχει καθαρή αξία ${origCost} € και επιβαρύνεται με συντελεστή Φ.Π.Α. ${vatPct} %. Ποια είναι η τελική τιμή του προϊόντος μαζί με τον φόρο σε €;`,
        tableData: { col1: 'Καθαρή (€)', col2: 'Τελική (€)', r1: [100, 100 + vatPct], r2: [origCost, 'χ'] },
        correctVal: grossCost,
        correctStr: formatNum(grossCost),
        explanation: `Στα 100 € καθαρής αξίας αντιστοιχούν 124 € τελικής τιμής. Τα ποσά είναι ανάλογα. Με χιαστί: χ ＝ (124 · ${origCost}) : 100 ＝ ${formatNum(grossCost)} €.`
      };
    }
  },
  {
    id: 'm3_hard_8',
    generate: () => {
      const hoursPerDay1 = 8;
      const days1 = 15;
      const totalHours = hoursPerDay1 * days1; // 120
      const days2 = 10;
      const reqHoursDay = totalHours / days2; // 12
      return {
        text: `Μια ομάδα εργατών ολοκληρώνει ένα έργο σε ${days1} ημέρες δουλεύοντας ${hoursPerDay1} ώρες την ημέρα. Πόσες ώρες την ημέρα πρέπει να δουλεύουν για να τελειώσουν το έργο σε ${days2} ημέρες;`,
        tableData: { col1: 'Ημέρες', col2: 'Ώρες ανά ημέρα', r1: [days1, hoursPerDay1], r2: [days2, 'χ'] },
        correctVal: reqHoursDay,
        correctStr: String(reqHoursDay),
        explanation: `Ημέρες και ημερήσιες ώρες είναι αντιστρόφως ανάλογα ποσά (σταθερός συνολικός χρόνος 120 h). Οριζόντιος υπολογισμός: χ ＝ (${hoursPerDay1} · ${days1}) : ${days2} ＝ 120 : 10 ＝ ${reqHoursDay} ώρες την ημέρα.`
      };
    }
  },
  {
    id: 'm3_hard_9',
    generate: () => {
      const length1 = 18;
      const width1 = 10;
      const area = length1 * width1; // 180 m2
      const length2 = 15;
      const width2 = area / length2; // 12 m
      return {
        text: `Ένα ορθογώνιο αγροτεμάχιο έχει μήκος ${length1} m και πλάτος ${width1} m. Ποιο πρέπει να είναι το πλάτος του σε m αν θέλουμε να αποκτήσει μήκος ${length2} m διατηρώντας το ίδιο ακριβώς εμβαδόν;`,
        tableData: { col1: 'Μήκος (m)', col2: 'Πλάτος (m)', r1: [length1, width1], r2: [length2, 'χ'] },
        correctVal: width2,
        correctStr: String(width2),
        explanation: `Σε σταθερό εμβαδόν, το μήκος και το πλάτος είναι αντιστρόφως ανάλογα ποσά. Οριζόντια γινόμενα: χ ＝ (${length1} · ${width1}) : ${length2} ＝ 180 : 15 ＝ ${width2} m.`
      };
    }
  },
  {
    id: 'm3_hard_10',
    generate: () => {
      const wireCm = 120;
      const wireGrams = 360;
      const targetMeters = 3.5; // 350 cm
      const targetCm = 350;
      const targetGrams = (wireGrams * targetCm) / wireCm; // 1050 g
      return {
        text: `Ένα κομμάτι σύρμα μήκους ${wireCm} cm ζυγίζει ${wireGrams} g. Πόσα g ζυγίζει ένα κομμάτι από το ίδιο σύρμα με μήκος ${formatNum(targetMeters)} m;`,
        tableData: { col1: 'Μήκος (cm)', col2: 'Βάρος (g)', r1: [wireCm, wireGrams], r2: [targetCm, 'χ'] },
        correctVal: targetGrams,
        correctStr: String(targetGrams),
        explanation: `Μετατρέπουμε τα ${formatNum(targetMeters)} m σε cm: 350 cm. Μήκος και βάρος είναι ανάλογα ποσά. Με χιαστί: χ ＝ (${wireGrams} · 350) : ${wireCm} ＝ 126.000 : 120 ＝ ${targetGrams} g.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Υπολογισμός χ σε Ανάλογα Ποσά (Χιαστί)
  {
    const a = randInt(3, 6);
    const b = randInt(12, 24);
    const c = a * randInt(2, 4);
    const d = (b * c) / a;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΕΠΙΛΥΣΗ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ',
      instruction: 'Υπολογίστε τον άγνωστο όρο χ (ανάλογα ποσά):',
      prompt: `Στην κατάταξη ανάλογων ποσών: ${a} kg κοστίζουν ${b} € και ${c} kg κοστίζουν χ €. Πόσα € είναι το χ;`,
      table: { col1: 'Ποσό 1 (kg)', col2: 'Ποσό 2 (€)', r1: [a, b], r2: [c, 'χ'] },
      correctVal: d,
      correctStr: String(d),
      explanation: `Στα ανάλογα ποσά εφαρμόζουμε χιαστί πολλαπλασιασμό: χ ＝ (${b} · ${c}) : ${a} ＝ ${b * c} : ${a} ＝ ${d} €.`
    });
  }

  // Q2 (MCQ): Ποια είναι τα 3 βήματα της μεθόδου των τριών
  {
    const correctSeq = '1. Κατάταξη δεδομένων σε ομώνυμες στήλες, 2. Έλεγχος είδους ποσών (ανάλογα ή αντίστροφα), 3. Επιλογή σωστού τύπου επίλυσης';
    const fakeSeq1 = '1. Πολλαπλασιασμός όλων των αριθμών, 2. Διαίρεση με το 100, 3. Αφαίρεση του μικρότερου';
    const fakeSeq2 = '1. Χιαστί πολλαπλασιασμός χωρίς έλεγχο, 2. Πρόσθεση των στηλών, 3. Αντιστροφή όρων';
    const fakeSeq3 = '1. Μετατροπή των αριθμών σε δεκαδικούς, 2. Σχεδίαση γραφικής παράστασης, 3. Μέτρηση με χάρακα';

    const options = [
      { text: correctSeq, isCorrect: true },
      { text: fakeSeq1, isCorrect: false },
      { text: fakeSeq2, isCorrect: false },
      { text: fakeSeq3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΤΑ ΒΗΜΑΤΑ ΤΗΣ ΜΕΘΟΔΟΥ',
      instruction: 'Επιλέξτε τη σωστή σειρά των βημάτων της μεθόδου των τριών:',
      prompt: `Ποια είναι τα βασικά βήματα που ακολουθούμε για τη λύση ενός προβλήματος με τη μέθοδο των τριών;`,
      options,
      correctText: correctSeq,
      explanation: `Πρώτα κατατάσσουμε τα ομοειδή ποσά το ένα κάτω από το άλλο, μετά ελέγχουμε αν είναι ανάλογα ή αντιστρόφως ανάλογα, και τέλος επιλέγουμε τον αντίστοιχο τύπο (χιαστί ή οριζόντιο).`
    });
  }

  // Q3 (Input - Decimal): Υπολογισμός χ σε Αντιστρόφως Ανάλογα (Οριζόντια)
  {
    const w1 = randInt(2, 5);
    const d1 = randInt(8, 16);
    const total = w1 * d1;
    const w2 = randInt(6, 10);
    const d2 = total / w2;
    const cleanD2 = Number.isInteger(d2) ? d2 : Number(d2.toFixed(1));

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΕΠΙΛΥΣΗ ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ',
      instruction: 'Υπολογίστε τον άγνωστο όρο χ (αντιστρόφως ανάλογα ποσά):',
      prompt: `Στην κατάταξη αντιστρόφως ανάλογων ποσών: ${w1} εργάτες θέλουν ${d1} ημέρες και ${w2} εργάτες θέλουν χ ημέρες. Πόσες ημέρες είναι το χ;`,
      table: { col1: 'Εργάτες', col2: 'Ημέρες', r1: [w1, d1], r2: [w2, 'χ'] },
      correctVal: cleanD2,
      correctStr: formatNum(cleanD2),
      explanation: `Στα αντιστρόφως ανάλογα ποσά εφαρμόζουμε οριζόντιο πολλαπλασιασμό: χ ＝ (${w1} · ${d1}) : ${w2} ＝ ${total} : ${w2} ＝ ${formatNum(cleanD2)} ημέρες.`
    });
  }

  // Q4 (MCQ): Γιατί ονομάζεται μέθοδος των τριών
  {
    const correctReason = 'Επειδή γνωρίζουμε 3 όρους και αναζητούμε τον 4ο άγνωστο όρο';
    const fakeReason1 = 'Επειδή περιλαμβάνει υποχρεωτικά 3 διαφορετικά ποσά';
    const fakeReason2 = 'Επειδή λύνεται πάντοτε σε 3 λεπτά';
    const fakeReason3 = 'Επειδή χρησιμοποιεί 3 διαδοχικούς πίνακες';

    const options = [
      { text: correctReason, isCorrect: true },
      { text: fakeReason1, isCorrect: false },
      { text: fakeReason2, isCorrect: false },
      { text: fakeReason3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΟΝΟΜΑΣΙΑ ΤΗΣ ΜΕΘΟΔΟΥ',
      instruction: 'Επιλέξτε τη σωστή εξήγηση:',
      prompt: `Για ποιο λόγο η μέθοδος ονομάζεται «Απλή Μέθοδος των Τριών»;`,
      options,
      correctText: correctReason,
      explanation: `Ονομάζεται έτσι επειδή δίνονται τρεις γνωστές τιμές ανάμεσα σε δύο ποσά και ζητείται ο υπολογισμός της τέταρτης άγνωστης τιμής.`
    });
  }

  // Q5 (Input - Decimal): Πρόβλημα Αναγωγής στη Μονάδα
  {
    const items = randInt(4, 7);
    const unitPrice = randInt(3, 6);
    const initialCost = items * unitPrice;
    const targetItems = items + randInt(3, 5);
    const expectedCost = targetItems * unitPrice;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΑΝΑΓΩΓΗ ΣΤΗ ΜΟΝΑΔΑ',
      instruction: 'Υπολογίστε το συνολικό κόστος:',
      prompt: `Αν ${items} τεμάχια ενός είδους κοστίζουν ${initialCost} €, πόσα € κοστίζουν ${targetItems} ίδια τεμάχια;`,
      correctVal: expectedCost,
      correctStr: String(expectedCost),
      explanation: `Το 1 τεμάχιο κοστίζει ${initialCost} : ${items} ＝ ${unitPrice} €. Τα ${targetItems} τεμάχια κοστίζουν: ${targetItems} · ${unitPrice} ＝ ${expectedCost} €.`
    });
  }

  // Q6 (MCQ): Διάκριση τύπου υπολογισμού
  {
    const correctDiff = 'Στα ανάλογα πολλαπλασιάζουμε διαγώνια (χιαστί), ενώ στα αντιστρόφως ανάλογα πολλαπλασιάζουμε οριζόντια';
    const fakeDiff1 = 'Στα ανάλογα πολλαπλασιάζουμε οριζόντια και στα αντίστροφα διαγώνια';
    const fakeDiff2 = 'Και στα δύο είδη ποσών κάνουμε ακριβώς τον ίδιο χιαστί πολλαπλασιασμό';
    const fakeDiff3 = 'Στα ανάλογα κάνουμε πρόσθεση και στα αντίστροφα αφαίρεση';

    const options = [
      { text: correctDiff, isCorrect: true },
      { text: fakeDiff1, isCorrect: false },
      { text: fakeDiff2, isCorrect: false },
      { text: fakeDiff3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΧΙΑΣΤΙ Η ΟΡΙΖΟΝΤΙΑ;',
      instruction: 'Επιλέξτε τη θεμελιώδη διαφορά των τύπων:',
      prompt: `Πώς διαφέρει ο υπολογισμός του αγνώστου χ στα ανάλογα σε σχέση με τα αντιστρόφως ανάλογα ποσά;`,
      options,
      correctText: correctDiff,
      explanation: `Στα ανάλογα ποσά ισχύει η ισότητα των σταυρωτών γινομένων (χιαστί), ενώ στα αντιστρόφως ανάλογα ποσά ισχύει η ισότητα των οριζόντιων γινομένων (σταθερό γινόμενο).`
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
    const fake8C = typeof val8 === 'number' ? formatNum(val8 * 1.4) : '0';

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
    const fake10C = typeof val10 === 'number' ? formatNum(val10 * 1.25) : '0';

    const optionsQ10 = [
      { text: hardProb2.correctStr, isCorrect: true },
      { text: String(fake10A), isCorrect: false },
      { text: String(fake10B), isCorrect: false },
      { text: String(fake10C), isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΜΕΤΑΤΡΟΠΩΝ & ΜΕΘΟΔΟΥ ΤΩΝ ΤΡΙΩΝ',
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

export default function MethodosTrionExercisesPage() {
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
      title="Ασκήσεις: Η Απλή Μέθοδος των Τριών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στη μέθοδο των τριών, κατάταξη σε στήλες, διάκριση ανάλογων και αντιστρόφων ποσών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/48-methodos-trion"
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
              Ασκήσεις: Η Απλή Μέθοδος των Τριών
            </h1>
            <p className="text-sky-100 text-sm sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Κατατάξτε τα ποσά σε ομώνυμες στήλες, ελέγξτε αν είναι ανάλογα ή αντίστροφα και υπολογίστε το ζητούμενο.
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

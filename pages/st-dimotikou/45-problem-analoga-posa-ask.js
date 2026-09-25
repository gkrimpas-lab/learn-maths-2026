// pages/st-dimotikou/45-problem-analoga-posa-ask.js
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

// Δεξαμενη Κανονικων Προβληματων Αναλογων Ποσων (10 διαφορετικα προβληματα)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'prob_std_1',
    generate: () => {
      const kg1 = randInt(3, 5);
      const unitRate = randInt(4, 7);
      const cost1 = kg1 * unitRate;
      const kg2 = kg1 + randInt(3, 6);
      const cost2 = kg2 * unitRate;
      return {
        text: `Για ${kg1} kg μήλα πληρώσαμε ${cost1} €. Πόσα € θα πληρώσουμε για ${kg2} kg από τα ίδια μήλα;`,
        correctVal: cost2,
        correctStr: String(cost2),
        explanation: `Με αναγωγή στη μονάδα: το 1 kg κοστίζει ${cost1} : ${kg1} ＝ ${unitRate} €. Άρα τα ${kg2} kg κοστίζουν ${kg2} · ${unitRate} ＝ ${cost2} €.`
      };
    }
  },
  {
    id: 'prob_std_2',
    generate: () => {
      const hours1 = randInt(2, 4);
      const speed = randInt(65, 85);
      const dist1 = hours1 * speed;
      const hours2 = hours1 + randInt(2, 3);
      const dist2 = hours2 * speed;
      return {
        text: `Ένα αυτοκίνητο διανύει ${dist1} km σε ${hours1} ώρες. Πόσα km θα διανύσει σε ${hours2} ώρες αν διατηρεί σταθερή ταχύτητα;`,
        correctVal: dist2,
        correctStr: String(dist2),
        explanation: `Σε 1 ώρα διανύει ${dist1} : ${hours1} ＝ ${speed} km (ταχύτητα). Σε ${hours2} ώρες θα διανύσει: ${hours2} · ${speed} ＝ ${dist2} km.`
      };
    }
  },
  {
    id: 'prob_std_3',
    generate: () => {
      const eggs1 = randInt(2, 4);
      const mult = randInt(4, 6);
      const cookies1 = eggs1 * mult * 5;
      const eggs2 = eggs1 + randInt(2, 4);
      const cookies2 = eggs2 * mult * 5;
      return {
        text: `Με ${eggs1} αυγά μια ζαχαροπλάστης φτιάχνει ${cookies1} μπισκότα. Πόσα μπισκότα θα φτιάξει με ${eggs2} αυγά ακολουθώντας την ίδια αναλογία;`,
        correctVal: cookies2,
        correctStr: String(cookies2),
        explanation: `Με 1 αυγό φτιάχνονται ${cookies1} : ${eggs1} ＝ ${mult * 5} μπισκότα. Με ${eggs2} αυγά θα φτιαχτούν: ${eggs2} · ${mult * 5} ＝ ${cookies2} μπισκότα.`
      };
    }
  },
  {
    id: 'prob_std_4',
    generate: () => {
      const days1 = randInt(3, 6);
      const earnPerDay = randInt(35, 55);
      const total1 = days1 * earnPerDay;
      const days2 = days1 + randInt(3, 5);
      const total2 = days2 * earnPerDay;
      return {
        text: `Ένας τεχνίτης αμείφθηκε με ${total1} € για εργασία ${days1} ημερών. Πόσα € θα λάβει αν εργαστεί για ${days2} ημέρες με το ίδιο ημερομίσθιο;`,
        correctVal: total2,
        correctStr: String(total2),
        explanation: `Το ημερομίσθιο (τιμή της μονάδας) είναι ${total1} : ${days1} ＝ ${earnPerDay} €/ημέρα. Για ${days2} ημέρες θα λάβει: ${days2} · ${earnPerDay} ＝ ${total2} €.`
      };
    }
  },
  {
    id: 'prob_std_5',
    generate: () => {
      const m1 = randInt(3, 5);
      const costPerMeter = randInt(12, 18);
      const cost1 = m1 * costPerMeter;
      const m2 = m1 + randInt(2, 6);
      const cost2 = m2 * costPerMeter;
      return {
        text: `Ένα κομμάτι ύφασμα μήκους ${m1} m κοστίζει ${cost1} €. Πόσο κοστίζει ένα κομμάτι από το ίδιο ύφασμα με μήκος ${m2} m;`,
        correctVal: cost2,
        correctStr: String(cost2),
        explanation: `Το 1 μέτρο υφάσματος κοστίζει ${cost1} : ${m1} ＝ ${costPerMeter} €. Τα ${m2} μέτρα κοστίζουν: ${m2} · ${costPerMeter} ＝ ${cost2} €.`
      };
    }
  },
  {
    id: 'prob_std_6',
    generate: () => {
      const workers1 = randInt(2, 4);
      const cratesPerWorker = randInt(15, 25);
      const crates1 = workers1 * cratesPerWorker;
      const workers2 = workers1 + randInt(2, 5);
      const crates2 = workers2 * cratesPerWorker;
      return {
        text: `Σε μια αποθήκη ${workers1} εργαζόμενοι ταξινομούν ${crates1} κιβώτια σε 1 ώρα. Πόσα κιβώτια θα ταξινομήσουν στον ίδιο χρόνο ${workers2} εργαζόμενοι με την ίδια απόδοση;`,
        correctVal: crates2,
        correctStr: String(crates2),
        explanation: `Ο κάθε εργαζόμενος ταξινομεί ${crates1} : ${workers1} ＝ ${cratesPerWorker} κιβώτια. Άρα ${workers2} εργαζόμενοι ταξινομούν: ${workers2} · ${cratesPerWorker} ＝ ${crates2} κιβώτια.`
      };
    }
  },
  {
    id: 'prob_std_7',
    generate: () => {
      const min1 = randInt(2, 4) * 10;
      const copiesPerMin = randInt(20, 30);
      const copies1 = min1 * copiesPerMin;
      const min2 = min1 + randInt(2, 4) * 10;
      const copies2 = min2 * copiesPerMin;
      return {
        text: `Ένα φωτοτυπικό μηχάνημα τυπώνει ${copies1} αντίγραφα σε ${min1} λεπτά. Πόσα αντίγραφα θα τυπώσει σε ${min2} λεπτά;`,
        correctVal: copies2,
        correctStr: String(copies2),
        explanation: `Σε 1 λεπτό τυπώνει ${copies1} : ${min1} ＝ ${copiesPerMin} αντίγραφα. Σε ${min2} λεπτά τυπώνει: ${min2} · ${copiesPerMin} ＝ ${copies2} αντίγραφα.`
      };
    }
  },
  {
    id: 'prob_std_8',
    generate: () => {
      const sheep1 = randInt(4, 7);
      const foodPerSheep = randInt(3, 5);
      const food1 = sheep1 * foodPerSheep;
      const sheep2 = sheep1 + randInt(3, 6);
      const food2 = sheep2 * foodPerSheep;
      return {
        text: `Για τη διατροφή ${sheep1} προβάτων απαιτούνται ${food1} kg ζωοτροφής την ημέρα. Πόσα kg ζωοτροφής χρειάζονται ημερησίως για ${sheep2} πρόβατα;`,
        correctVal: food2,
        correctStr: String(food2),
        explanation: `Για κάθε πρόβατο χρειάζονται ${food1} : ${sheep1} ＝ ${foodPerSheep} kg. Για ${sheep2} πρόβατα απαιτούνται: ${sheep2} · ${foodPerSheep} ＝ ${food2} kg.`
      };
    }
  },
  {
    id: 'prob_std_9',
    generate: () => {
      const tickets1 = randInt(2, 4);
      const priceSingle = randInt(12, 18);
      const cost1 = tickets1 * priceSingle;
      const tickets2 = tickets1 + randInt(3, 6);
      const cost2 = tickets2 * priceSingle;
      return {
        text: `Μια παρέα αγόρασε ${tickets1} ακτοπλοϊκά εισιτήρια και πλήρωσε ${cost1} €. Πόσα € θα πληρώσει μια άλλη παρέα για ${tickets2} ίδια εισιτήρια;`,
        correctVal: cost2,
        correctStr: String(cost2),
        explanation: `Το 1 εισιτήριο κοστίζει ${cost1} : ${tickets1} ＝ ${priceSingle} €. Τα ${tickets2} εισιτήρια κοστίζουν: ${tickets2} · ${priceSingle} ＝ ${cost2} €.`
      };
    }
  },
  {
    id: 'prob_std_10',
    generate: () => {
      const boxes1 = randInt(3, 5);
      const pencilsPerBox = randInt(12, 24);
      const pencils1 = boxes1 * pencilsPerBox;
      const boxes2 = boxes1 + randInt(3, 7);
      const pencils2 = boxes2 * pencilsPerBox;
      return {
        text: `Σε ${boxes1} όμοιες κασετίνες περιέχονται συνολικά ${pencils1} μαρκαδόροι. Πόσοι μαρκαδόροι περιέχονται σε ${boxes2} ίδιες κασετίνες;`,
        correctVal: pencils2,
        correctStr: String(pencils2),
        explanation: `Κάθε κασετίνα περιέχει ${pencils1} : ${boxes1} ＝ ${pencilsPerBox} μαρκαδόρους. Οι ${boxes2} κασετίνες περιέχουν: ${boxes2} · ${pencilsPerBox} ＝ ${pencils2} μαρκαδόρους.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (10 διαφορετικα προβληματα)
const HARD_PROBLEMS_POOL = [
  {
    id: 'prob_hard_1',
    generate: () => {
      const olivesKg = 24;
      const oilLiters = 4;
      const targetMlLiters = 7500;
      const targetLiters = targetMlLiters / 1000;
      const olivesNeeded = targetLiters * (olivesKg / oilLiters);
      return {
        text: `Από ${olivesKg} kg ελιές παράγονται ${oilLiters} l ελαιόλαδο. Πόσα kg ελιές απαιτούνται για να παραχθούν ${targetMlLiters} ml ελαιόλαδο ίδιας ποιότητας;`,
        correctVal: olivesNeeded,
        correctStr: formatNum(olivesNeeded),
        explanation: `Μετατρέπουμε τα ml σε λίτρα: ${targetMlLiters} ml ＝ ${formatNum(targetLiters)} l. Για 1 l λάδι χρειάζονται ${olivesKg} : ${oilLiters} ＝ 6 kg ελιές. Για ${formatNum(targetLiters)} l απαιτούνται: ${formatNum(targetLiters)} · 6 ＝ ${formatNum(olivesNeeded)} kg ελιές.`
      };
    }
  },
  {
    id: 'prob_hard_2',
    generate: () => {
      const flourGrams = 750;
      const breadKg = 1.2;
      const targetFlourKg = 2.5;
      const targetFlourGrams = targetFlourKg * 1000;
      const breadProduced = (breadKg * targetFlourGrams) / flourGrams;
      return {
        text: `Από ${flourGrams} g αλεύρι ένας φούρναρης παρασκευάζει ${formatNum(breadKg)} kg ψωμί. Πόσα kg ψωμί θα παρασκευάσει χρησιμοποιώντας ${formatNum(targetFlourKg)} kg από το ίδιο αλεύρι;`,
        correctVal: Number(breadProduced.toFixed(2)),
        correctStr: formatNum(breadProduced),
        explanation: `Μετατρέπουμε τα ${formatNum(targetFlourKg)} kg σε γραμμάρια: ${targetFlourGrams} g. Στήνουμε την αναλογία: ${flourGrams} : ${formatNum(breadKg)} ＝ ${targetFlourGrams} : χ. Με χιαστί: χ ＝ (${formatNum(breadKg)} · ${targetFlourGrams}) : ${flourGrams} ＝ ${formatNum(breadProduced)} kg.`
      };
    }
  },
  {
    id: 'prob_hard_3',
    generate: () => {
      const minutes1 = 45;
      const hours1 = 0.75;
      const distKm = 54;
      const hours2 = 2.5;
      const dist2 = (distKm / hours1) * hours2;
      return {
        text: `Ένα όχημα διήνυσε ${distKm} km σε 45 λεπτά κινούμενο με σταθερό ρυθμό. Πόσα km θα διανύσει σε χρόνο 2 ωρών και 30 λεπτών;`,
        correctVal: dist2,
        correctStr: String(dist2),
        explanation: `Εκφράζουμε τους χρόνους σε λεπτά: 45 min και 2 h 30 min ＝ 150 min. Στήνουμε την αναλογία: 45 : ${distKm} ＝ 150 : χ. Με χιαστί βρίσκουμε: χ ＝ (${distKm} · 150) : 45 ＝ ${dist2} km.`
      };
    }
  },
  {
    id: 'prob_hard_4',
    generate: () => {
      const wireCm = 150;
      const wireGrams = 450;
      const targetMeters = 4.2;
      const targetCm = targetMeters * 100;
      const targetGrams = (wireGrams * targetCm) / wireCm;
      return {
        text: `Ένα μεταλλικό σύρμα μήκους ${wireCm} cm έχει μάζα ${wireGrams} g. Ποια είναι η μάζα σε g ενός σύρματος από το ίδιο μέταλλο με μήκος ${formatNum(targetMeters)} m;`,
        correctVal: targetGrams,
        correctStr: String(targetGrams),
        explanation: `Μετατρέπουμε τα ${formatNum(targetMeters)} m σε cm: ${targetCm} cm. Στο 1 cm αντιστοιχούν ${wireGrams} : ${wireCm} ＝ 3 g. Για ${targetCm} cm η μάζα είναι: ${targetCm} · 3 ＝ ${targetGrams} g.`
      };
    }
  },
  {
    id: 'prob_hard_5',
    generate: () => {
      const totalAmount = 540;
      const shareA = 4;
      const shareB = 5;
      const sumShares = shareA + shareB;
      const valA = (totalAmount * shareA) / sumShares;
      const valB = (totalAmount * shareB) / sumShares;
      const diff = valB - valA;
      return {
        text: `Δύο συνεργάτες μοιράζονται αμοιβή ${totalAmount} € ανάλογα με τις ώρες που εργάστηκαν, σε λόγο 4 : 5. Πόσα περισσότερα € έλαβε ο δεύτερος συνεργάτης από τον πρώτο;`,
        correctVal: diff,
        correctStr: String(diff),
        explanation: `Τα συνολικά μέρη είναι 4 ＋ 5 ＝ 9 μέρη. Το 1 μέρος αντιστοιχεί σε ${totalAmount} : 9 ＝ 60 €. Η διαφορά τους είναι 5 － 4 ＝ 1 μέρος, άρα ο δεύτερος έλαβε 1 · 60 ＝ ${diff} € περισσότερα.`
      };
    }
  },
  {
    id: 'prob_hard_6',
    generate: () => {
      const scale = 200000;
      const mapCm = 3.5;
      const realKm = (mapCm * scale) / 100000;
      return {
        text: `Σε έναν γεωγραφικό χάρτη με κλίμακα 1 : 200.000, η απόσταση ανάμεσα σε δύο χωριά είναι ${formatNum(mapCm)} cm. Πόσα km απέχουν πραγματικά τα δύο χωριά;`,
        correctVal: realKm,
        correctStr: formatNum(realKm),
        explanation: `Στην κλίμακα 1 : 200.000, το 1 cm αντιστοιχεί σε 200.000 cm ＝ 2 km. Επομένως, τα ${formatNum(mapCm)} cm αντιστοιχούν σε: ${formatNum(mapCm)} · 2 ＝ ${formatNum(realKm)} km.`
      };
    }
  },
  {
    id: 'prob_hard_7',
    generate: () => {
      const fuelPer100 = 7.2;
      const tripKm = 350;
      const fuelNeeded = (fuelPer100 * tripKm) / 100;
      return {
        text: `Ένα αυτοκίνητο καταναλώνει ${formatNum(fuelPer100)} l βενζίνης ανά 100 km. Πόσα l βενζίνης θα χρειαστεί για ταξίδι συνολικής απόστασης ${tripKm} km;`,
        correctVal: fuelNeeded,
        correctStr: formatNum(fuelNeeded),
        explanation: `Στα 100 km καταναλώνει ${formatNum(fuelPer100)} l. Στο 1 km καταναλώνει ${formatNum(fuelPer100)} : 100 ＝ 0,072 l. Για ${tripKm} km θα χρειαστεί: ${tripKm} · 0,072 ＝ ${formatNum(fuelNeeded)} l.`
      };
    }
  },
  {
    id: 'prob_hard_8',
    generate: () => {
      const paintLiters = 2.5;
      const wallArea = 30;
      const targetArea = 84;
      const paintNeeded = (paintLiters * targetArea) / wallArea;
      return {
        text: `Με ${formatNum(paintLiters)} l χρώματος ένας ελαιοχρωματιστής βάφει επιφάνεια ${wallArea} m². Πόσα l χρώματος θα χρειαστεί για να βάψει επιφάνεια ${targetArea} m²;`,
        correctVal: paintNeeded,
        correctStr: formatNum(paintNeeded),
        explanation: `Για 1 m² επιφάνειας απαιτούνται ${formatNum(paintLiters)} : ${wallArea} ＝ ${formatNum(paintLiters / wallArea, 3)} l. Με αναλογία χιαστί: χ ＝ (${formatNum(paintLiters)} · ${targetArea}) : ${wallArea} ＝ ${formatNum(paintNeeded)} l.`
      };
    }
  },
  {
    id: 'prob_hard_9',
    generate: () => {
      const origCost = 140;
      const discountPct = 15;
      const payPct = 100 - discountPct;
      const finalCost = (origCost * payPct) / 100;
      return {
        text: `Σε ένα κατάστημα όλες οι τιμές μειώνονται ανάλογα λόγω έκπτωσης ${discountPct} %. Ποιο είναι το τελικό ποσό πληρωμής σε € για ένα είδος αξίας ${origCost} €;`,
        correctVal: finalCost,
        correctStr: formatNum(finalCost),
        explanation: `Ο συντελεστής τελικής τιμής είναι ${payPct} % ＝ 0,85. Το τελικό ποσό που θα πληρωθεί είναι: ${origCost} · 0,85 ＝ ${formatNum(finalCost)} €.`
      };
    }
  },
  {
    id: 'prob_hard_10',
    generate: () => {
      const juice1 = 450;
      const water1 = 1050;
      const total1 = juice1 + water1;
      const targetTotal = 2500;
      const targetJuice = (juice1 * targetTotal) / total1;
      return {
        text: `Για να φτιαχτεί ένα μείγμα χυμού όγκου 1.500 ml απαιτούνται ${juice1} ml φυσικού χυμού και το υπόλοιπο νερό. Πόσα ml φυσικού χυμού απαιτούνται για να παρασκευαστεί μείγμα συνολικού όγκου ${targetTotal} ml;`,
        correctVal: targetJuice,
        correctStr: String(targetJuice),
        explanation: `Ο όγκος του χυμού και ο συνολικός όγκος είναι ανάλογα ποσά. Στα 1.500 ml αναλογούν ${juice1} ml χυμού. Στα ${targetTotal} ml αναλογούν: χ ＝ (${juice1} · ${targetTotal}) : 1.500 ＝ ${targetJuice} ml.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Αναγωγή στη Μονάδα (Βήμα 1)
  {
    const count = randInt(4, 8);
    const unitCost = randInt(3, 7);
    const totalCost = count * unitCost;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΑΝΑΓΩΓΗ ΣΤΗ ΜΟΝΑΔΑ',
      instruction: 'Υπολογίστε την τιμή της 1 μονάδας:',
      prompt: `Αν ${count} ίδια βιβλία κοστίζουν συνολικά ${totalCost} €, πόσα € κοστίζει το 1 βιβλίο;`,
      correctVal: unitCost,
      correctStr: String(unitCost),
      explanation: `Για να βρούμε την τιμή της 1 μονάδας (αναγωγή στη μονάδα), διαιρούμε το συνολικό κόστος με το πλήθος των τεμαχίων: ${totalCost} : ${count} ＝ ${unitCost} €.`
    });
  }

  // Q2 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE / ΑΠΟΣΙΩΠΗΤΙΚΑ
  {
    const items = randInt(3, 6);
    const price = randInt(12, 24);
    const targetItems = items + randInt(2, 4);

    const correctExpr = `(${price} : ${items}) · ${targetItems}`;
    const wrong1 = `(${price} · ${items}) : ${targetItems}`;
    const wrong2 = `(${price} ＋ ${items}) · ${targetItems}`;
    const wrong3 = `(${price} : ${targetItems}) · ${items}`;

    const options = [
      { text: correctExpr, isCorrect: true },
      { text: wrong1, isCorrect: false },
      { text: wrong2, isCorrect: false },
      { text: wrong3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΜΑΘΗΜΑΤΙΚΗ ΕΚΦΡΑΣΗ ΑΝΑΓΩΓΗΣ',
      instruction: 'Επιλέξτε τη σωστή μαθηματική έκφραση επίλυσης:',
      prompt: `Αν ${items} τεμάχια κοστίζουν ${price} €, ποια έκφραση δίνει το κόστος των ${targetItems} τεμαχίων με τη μέθοδο της αναγωγής στη μονάδα;`,
      options,
      correctText: correctExpr,
      explanation: `Πρώτα υπολογίζουμε την τιμή του ενός τεμαχίου (${price} : ${items}) και στη συνέχεια πολλαπλασιάζουμε με το ζητούμενο πλήθος (${targetItems}): ${correctExpr}.`
    });
  }

  // Q3 (Input - Decimal): Επίλυση με Σταυρωτά Γινόμενα (Χιαστί)
  {
    const a = randInt(3, 6);
    const b = randInt(15, 30);
    const c = a * randInt(2, 4);
    const d = (b * c) / a;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΕΠΙΛΥΣΗ ΜΕ ΧΙΑΣΤΙ',
      instruction: 'Υπολογίστε την τιμή του αγνώστου χ:',
      prompt: `Στον πίνακα ποσών και τιμών: ${a} kg αντιστοιχούν σε ${b} € και ${c} kg αντιστοιχούν σε χ €. Πόσα € είναι το χ;`,
      correctVal: d,
      correctStr: String(d),
      explanation: `Εφαρμόζουμε σταυρωτό πολλαπλασιασμό (χιαστί): χ ＝ (${b} · ${c}) : ${a} ＝ ${b * c} : ${a} ＝ ${d} €.`
    });
  }

  // Q4 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE / ΑΠΟΣΙΩΠΗΤΙΚΑ
  {
    const correctStatement = 'Όλες οι μέθοδοι (αναγωγή στη μονάδα, χιαστί, συντελεστής λ) οδηγούν στο ίδιο ακριβώς αποτέλεσμα';
    const fake1 = 'Η αναγωγή στη μονάδα δίνει πάντα μεγαλύτερο αποτέλεσμα από το χιαστί';
    const fake2 = 'Ο συντελεστής αναλογίας μπορεί να εφαρμοστεί μόνο σε μη ανάλογα ποσά';
    const fake3 = 'Η μέθοδος χιαστί εφαρμόζεται μόνο όταν τα ποσά έχουν ακέραιες τιμές';

    const options = [
      { text: correctStatement, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΣΥΓΚΡΙΣΗ ΜΕΘΟΔΩΝ',
      instruction: 'Επιλέξτε τη σωστή πρόταση για τις μεθόδους επίλυσης:',
      prompt: `Ποια από τις παρακάτω προτάσεις ισχύει για τα προβλήματα με ανάλογα ποσά;`,
      options,
      correctText: correctStatement,
      explanation: `Στα ανάλογα ποσά, είτε χρησιμοποιήσουμε αναγωγή στη μονάδα, είτε πίνακα με χιαστί, είτε τον συντελεστή λ, καταλήγουμε υποχρεωτικά στο ίδιο ακριβώς αποτέλεσμα.`
    });
  }

  // Q5 (Input - Decimal): Χρήση του Συντελεστή Αναλογίας (ψ = λ * χ)
  {
    const lambda = randInt(4, 9);
    const targetX = randInt(5, 12);
    const expectedY = lambda * targetX;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΧΡΗΣΗ ΣΥΝΤΕΛΕΣΤΗ ΑΝΑΛΟΓΙΑΣ',
      instruction: 'Υπολογίστε το τελικό ποσό ψ:',
      prompt: `Σε ένα πρόβλημα ανάλογων ποσών ο συντελεστής αναλογίας υπολογίστηκε ίσος με λ ＝ ${lambda}. Αν η νέα τιμή του ποσού χ είναι ${targetX}, ποια είναι η αντίστοιχη τιμή του ψ;`,
      correctVal: expectedY,
      correctStr: String(expectedY),
      explanation: `Εφαρμόζουμε τον τύπο του συντελεστή αναλογίας: ψ ＝ λ · χ ＝ ${lambda} · ${targetX} ＝ ${expectedY}.`
    });
  }

  // Q6 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE / ΑΠΟΣΙΩΠΗΤΙΚΑ
  {
    const correctRule = 'Πρέπει πρώτα να μετατρέψουμε τα ομοειδή ποσά στην ίδια μονάδα μέτρησης (π.χ. όλα σε kg ή όλα σε g)';
    const fakeRule1 = 'Μπορούμε να κάνουμε κατευθείαν πολλαπλασιασμό χωρίς καμία μετατροπή';
    const fakeRule2 = 'Πρέπει να προσθέσουμε τους αριθμούς ανεξάρτητα από τις μονάδες τους';
    const fakeRule3 = 'Δεν επιτρέπεται να λύσουμε πρόβλημα που περιέχει διαφορετικές μονάδες μέτρησης';

    const options = [
      { text: correctRule, isCorrect: true },
      { text: fakeRule1, isCorrect: false },
      { text: fakeRule2, isCorrect: false },
      { text: fakeRule3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΚΑΝΟΝΑΣ ΜΟΝΑΔΩΝ ΜΕΤΡΗΣΗΣ',
      instruction: 'Επιλέξτε τον απαράβατο κανόνα:',
      prompt: `Τι πρέπει οπωσδήποτε να κάνουμε σε ένα πρόβλημα ανάλογων ποσών όταν η μία ποσότητα δίνεται σε kg και η άλλη σε g;`,
      options,
      correctText: correctRule,
      explanation: `Όταν συγκρίνουμε ομοειδή ποσά, είναι απαραίτητο να εκφράζονται στην ίδια ακριβώς μονάδα μέτρησης πριν εκτελεστεί οποιαδήποτε πράξη ή αναλογία.`
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
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: stdProb1.text,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal;
    const fake8A = typeof val8 === 'number' ? val8 + randInt(3, 8) : '0';
    const fake8B = typeof val8 === 'number' ? Math.max(1, val8 - randInt(2, 6)) : '0';
    const fake8C = typeof val8 === 'number' ? Math.round(val8 * 1.3) : '0';

    const optionsQ8 = [
      { text: stdProb2.correctStr, isCorrect: true },
      { text: String(fake8A), isCorrect: false },
      { text: String(fake8B), isCorrect: false },
      { text: String(fake8C), isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΜΕ ΑΝΑΛΟΓΑ ΠΟΣΑ',
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
      instruction: 'Προσέξτε τις μετατροπές μονάδων και εισαγάγετε το αποτέλεσμα:',
      prompt: hardProb1.text,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal;
    const fake10A = formatNum(val10 + randInt(3, 10));
    const fake10B = formatNum(Math.max(1, val10 - randInt(2, 6)));
    const fake10C = formatNum(val10 * 1.25);

    const optionsQ10 = [
      { text: hardProb2.correctStr, isCorrect: true },
      { text: String(fake10A), isCorrect: false },
      { text: String(fake10B), isCorrect: false },
      { text: String(fake10C), isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΜΕΤΑΤΡΟΠΩΝ & ΑΝΑΛΟΓΙΑΣ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      options: optionsQ10,
      correctText: hardProb2.correctStr,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function ProblemAnalogaPosaExercisesPage() {
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
      title="Ασκήσεις: Επίλυση Προβλημάτων με Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στην επίλυση με ανάλογα ποσά, αναγωγή στη μονάδα, σταυρωτά γινόμενα και συντελεστή αναλογίας για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/45-problem-analoga-posa"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 pb-32 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-14 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ασκήσεις: Προβλήματα με Ανάλογα Ποσά
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες που περιλαμβάνουν 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Επιλέξτε την κατάλληλη μέθοδο και υπολογίστε τα ζητούμενα μεγέθη.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 sm:px-4 py-2 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm"
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
                className={`bg-white rounded-3xl border p-4 sm:p-7 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλιδα Ερωτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
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
                <div className="space-y-2 mb-2">
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    {q.instruction}
                  </p>
                  <p className="text-sm sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2 pt-2.5">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-32 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs text-slate-500">
                        (Ακέραιος ή δεκαδικός με κόμμα)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE / ΑΠΟΣΙΩΠΗΤΙΚΑ */}
                  {q.type === 'mcq' && (
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-3xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 sm:p-4 rounded-2xl border text-left font-semibold text-xs sm:text-sm md:text-base transition active:scale-98 touch-manipulation flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1">
                              {opt.text}
                            </span>
                            <span
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center text-[10px] sm:text-xs shrink-0 mt-0.5 ${
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
                    className={`mt-3.5 p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1.5 ${
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
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Απαντήσεων</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 sm:py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-semibold block">
                ΣΚΟΡ
              </span>
              <span className="font-mono font-black text-base sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-sm sm:text-base">/ 10</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-[11px] sm:text-xs text-slate-400 font-semibold block">
                ΠΟΣΟΣΤΟ
              </span>
              <span className="font-mono font-black text-base sm:text-2xl text-emerald-400">
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

// pages/st-dimotikou/44-analoga-posa-ask.js
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
    id: 'analoga_std_1',
    generate: () => {
      const kg1 = randInt(2, 4);
      const lambdaVal = randInt(3, 6);
      const cost1 = kg1 * lambdaVal;
      const kg2 = kg1 + randInt(3, 5);
      const cost2 = kg2 * lambdaVal;
      return {
        text: `Τα ποσά «βάρος φρούτων (kg)» και «κόστος (€)» είναι ανάλογα. Αν για ${kg1} kg πληρώσαμε ${cost1} €, πόσα € θα πληρώσουμε για ${kg2} kg από τα ίδια φρούτα;`,
        correctVal: cost2,
        correctStr: String(cost2),
        explanation: `Ο συντελεστής αναλογίας είναι λ ＝ ${cost1} : ${kg1} ＝ ${lambdaVal} €/kg. Για ${kg2} kg το κόστος είναι ψ ＝ λ · χ ＝ ${lambdaVal} · ${kg2} ＝ ${cost2} €.`
      };
    }
  },
  {
    id: 'analoga_std_2',
    generate: () => {
      const speed = randInt(65, 90);
      const hours1 = randInt(2, 3);
      const dist1 = speed * hours1;
      const hours2 = hours1 + randInt(2, 4);
      const dist2 = speed * hours2;
      return {
        text: `Ένα τρένο κινείται με σταθερή ταχύτητα, άρα ο χρόνος και η απόσταση είναι ανάλογα ποσά. Αν σε ${hours1} ώρες διανύει ${dist1} km, πόσα km θα διανύσει σε ${hours2} ώρες;`,
        correctVal: dist2,
        correctStr: String(dist2),
        explanation: `Ο συντελεστής αναλογίας (ταχύτητα) είναι λ ＝ ${dist1} : ${hours1} ＝ ${speed} km/h. Σε ${hours2} ώρες θα διανύσει: ${speed} · ${hours2} ＝ ${dist2} km.`
      };
    }
  },
  {
    id: 'analoga_std_3',
    generate: () => {
      const workers = randInt(2, 4);
      const rate = randInt(15, 25);
      const prod1 = workers * rate;
      const targetWorkers = workers + randInt(2, 5);
      const prod2 = targetWorkers * rate;
      return {
        text: `Σε ένα εργαστήριο το πλήθος των εργατών και ο αριθμός των παραγόμενων δεμάτων είναι ανάλογα ποσά. Αν ${workers} εργάτες συσκευάζουν ${prod1} δέματα, πόσα δέματα θα συσκευάσουν ${targetWorkers} εργάτες με τον ίδιο ρυθμό;`,
        correctVal: prod2,
        correctStr: String(prod2),
        explanation: `Κάθε εργάτης συσκευάζει σταθερά λ ＝ ${prod1} : ${workers} ＝ ${rate} δέματα. Άρα ${targetWorkers} εργάτες θα συσκευάσουν: ${targetWorkers} · ${rate} ＝ ${prod2} δέματα.`
      };
    }
  },
  {
    id: 'analoga_std_4',
    generate: () => {
      const flourPerBread = 0.5; // kg
      const breads1 = randInt(6, 12);
      const flour1 = Number((breads1 * flourPerBread).toFixed(1));
      const breads2 = breads1 + randInt(4, 8);
      const flour2 = Number((breads2 * flourPerBread).toFixed(1));
      return {
        text: `Το βάρος του αλευριού και ο αριθμός των καρβελιών ψωμιού είναι ανάλογα ποσά. Αν για ${breads1} καρβέλια απαιτούνται ${formatNum(flour1)} kg αλεύρι, πόσα kg αλεύρι χρειάζονται για ${breads2} καρβέλια;`,
        correctVal: flour2,
        correctStr: formatNum(flour2),
        explanation: `Ο συντελεστής αναλογίας είναι λ ＝ ${formatNum(flour1)} : ${breads1} ＝ ${formatNum(flourPerBread)} kg ανά καρβέλι. Για ${breads2} καρβέλια απαιτούνται: ${breads2} · ${formatNum(flourPerBread)} ＝ ${formatNum(flour2)} kg.`
      };
    }
  },
  {
    id: 'analoga_std_5',
    generate: () => {
      const tickets = randInt(3, 6);
      const priceSingle = randInt(8, 12);
      const cost1 = tickets * priceSingle;
      const targetTickets = tickets + randInt(3, 6);
      const cost2 = targetTickets * priceSingle;
      return {
        text: `Το ποσό πληρωμής για εισιτήρια συναυλίας είναι ανάλογο με το πλήθος των εισιτηρίων. Αν τα ${tickets} εισιτήρια κοστίζουν ${cost1} €, πόσα € κοστίζουν τα ${targetTickets} εισιτήρια;`,
        correctVal: cost2,
        correctStr: String(cost2),
        explanation: `Η τιμή ανά εισιτήριο είναι λ ＝ ${cost1} : ${tickets} ＝ ${priceSingle} €. Τα ${targetTickets} εισιτήρια κοστίζουν: ${targetTickets} · ${priceSingle} ＝ ${cost2} €.`
      };
    }
  },
  {
    id: 'analoga_std_6',
    generate: () => {
      const oilPerTree = randInt(12, 18); // kg λάδι ανά δέντρο
      const trees1 = randInt(4, 7);
      const oil1 = trees1 * oilPerTree;
      const trees2 = trees1 + randInt(3, 6);
      const oil2 = trees2 * oilPerTree;
      return {
        text: `Η παραγωγή ελαιολάδου είναι ανάλογη με τον αριθμό των ελαιόδεντρων. Αν από ${trees1} δέντρα παράγονται ${oil1} kg λάδι, πόσα kg λάδι θα παραχθούν από ${trees2} ίδια δέντρα;`,
        correctVal: oil2,
        correctStr: String(oil2),
        explanation: `Ο συντελεστής αναλογίας είναι λ ＝ ${oil1} : ${trees1} ＝ ${oilPerTree} kg/δέντρο. Από ${trees2} δέντρα η παραγωγή είναι: ${trees2} · ${oilPerTree} ＝ ${oil2} kg.`
      };
    }
  },
  {
    id: 'analoga_std_7',
    generate: () => {
      const m1 = randInt(3, 5);
      const cost1 = m1 * 16;
      const m2 = m1 + randInt(2, 5);
      const cost2 = m2 * 16;
      return {
        text: `Το μήκος ενός υφάσματος και το κόστος του είναι ποσά ανάλογα. Αν τα ${m1} m κοστίζουν ${cost1} €, πόσα € θα κοστίσουν ${m2} m από το ίδιο ύφασμα;`,
        correctVal: cost2,
        correctStr: String(cost2),
        explanation: `Το κόστος ανά μέτρο είναι λ ＝ ${cost1} : ${m1} ＝ 16 €/m. Για ${m2} m το κόστος ισούται με: ${m2} · 16 ＝ ${cost2} €.`
      };
    }
  },
  {
    id: 'analoga_std_8',
    generate: () => {
      const minutes1 = randInt(2, 4) * 10;
      const bottles1 = minutes1 * 35;
      const minutes2 = minutes1 + randInt(2, 3) * 10;
      const bottles2 = minutes2 * 35;
      return {
        text: `Ο χρόνος λειτουργίας μιας μηχανής εμφιάλωσης και τα μπουκάλια που γεμίζει είναι ανάλογα ποσά. Αν σε ${minutes1} λεπτά γεμίζει ${bottles1} μπουκάλια, πόσα μπουκάλια γεμίζει σε ${minutes2} λεπτά;`,
        correctVal: bottles2,
        correctStr: String(bottles2),
        explanation: `Η μηχανή γεμίζει σταθερά λ ＝ ${bottles1} : ${minutes1} ＝ 35 μπουκάλια/λεπτό. Σε ${minutes2} λεπτά γεμίζει: ${minutes2} · 35 ＝ ${bottles2} μπουκάλια.`
      };
    }
  },
  {
    id: 'analoga_std_9',
    generate: () => {
      const cupsFlour = randInt(2, 4);
      const cookies = cupsFlour * 15;
      const targetCups = cupsFlour + randInt(2, 3);
      const targetCookies = targetCups * 15;
      return {
        text: `Σε μια συνταγή τα φλιτζάνια αλεύρι και ο αριθμός των μπισκότων είναι ανάλογα ποσά. Αν με ${cupsFlour} φλιτζάνια φτιάχνουμε ${cookies} μπισκότα, πόσα μπισκότα φτιάχνουμε με ${targetCups} φλιτζάνια;`,
        correctVal: targetCookies,
        correctStr: String(targetCookies),
        explanation: `Ο συντελεστής είναι λ ＝ ${cookies} : ${cupsFlour} ＝ 15 μπισκότα ανά φλιτζάνι. Με ${targetCups} φλιτζάνια φτιάχνουμε: ${targetCups} · 15 ＝ ${targetCookies} μπισκότα.`
      };
    }
  },
  {
    id: 'analoga_std_10',
    generate: () => {
      const tiles1 = randInt(4, 7) * 10;
      const area1 = tiles1 * 2; // dm²
      const tiles2 = tiles1 + randInt(3, 5) * 10;
      const area2 = tiles2 * 2;
      return {
        text: `Η επιφάνεια δαπέδου σε dm² και το πλήθος των πλακιδίων είναι ανάλογα ποσά. Αν ${tiles1} πλακίδια καλύπτουν ${area1} dm², πόσα dm² καλύπτουν ${tiles2} πλακίδια;`,
        correctVal: area2,
        correctStr: String(area2),
        explanation: `Κάθε πλακίδιο καλύπτει λ ＝ ${area1} : ${tiles1} ＝ 2 dm². Επομένως ${tiles2} πλακίδια καλύπτουν: ${tiles2} · 2 ＝ ${area2} dm².`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (10 διαφορετικα προβληματα)
const HARD_PROBLEMS_POOL = [
  {
    id: 'analoga_hard_1',
    generate: () => {
      const massKg = 1.5;
      const price = 4.5; // λ = 3
      const targetGrams = 2500;
      const targetKg = targetGrams / 1000;
      const finalPrice = targetKg * 3;
      return {
        text: `Το βάρος και η αξία ενός προϊόντος είναι ανάλογα ποσά. Αν τα ${formatNum(massKg)} kg κοστίζουν ${formatNum(price)} €, πόσα € κοστίζουν ${targetGrams} g από το ίδιο προϊόν;`,
        correctVal: finalPrice,
        correctStr: formatNum(finalPrice),
        explanation: `Μετατρέπουμε τα γραμμάρια σε κιλά: ${targetGrams} g ＝ ${formatNum(targetKg)} kg. Ο συντελεστής αναλογίας είναι λ ＝ ${formatNum(price)} : ${formatNum(massKg)} ＝ 3 €/kg. Η τιμή είναι: ${formatNum(targetKg)} · 3 ＝ ${formatNum(finalPrice)} €.`
      };
    }
  },
  {
    id: 'analoga_hard_2',
    generate: () => {
      const side = randInt(3, 6);
      const perimeter = 4 * side;
      const area = side * side;
      const mult = 2;
      const newSide = side * mult;
      const newPerimeter = 4 * newSide;
      const newArea = newSide * newSide;
      return {
        text: `Σε ένα τετράγωνο με πλευρά ${side} cm, διπλασιάζουμε την πλευρά του σε ${newSide} cm. Ενώ η περίμετρος διπλασιάζεται από ${perimeter} cm σε ${newPerimeter} cm (ανάλογο ποσό), πόσες φορές μεγαλύτερο γίνεται το εμβαδόν του (από ${area} cm² σε ${newArea} cm²);`,
        correctVal: 4,
        correctStr: '4',
        explanation: `Το εμβαδόν του τετραγώνου ΔΕΝ είναι ανάλογο με το μήκος της πλευράς. Όταν η πλευρά διπλασιάζεται, το εμβαδόν τετραπλασιάζεται: ${newArea} : ${area} ＝ 4 φορές μεγαλύτερο.`
      };
    }
  },
  {
    id: 'analoga_hard_3',
    generate: () => {
      const scale = 50000;
      const mapDist = 4.2; // cm
      const realKm = (mapDist * scale) / 100000; // cm -> km
      return {
        text: `Σε έναν χάρτη με κλίμακα 1 : 50.000, η απόσταση στον χάρτη και η πραγματική απόσταση είναι ανάλογα ποσά. Αν δύο σημεία απέχουν στον χάρτη ${formatNum(mapDist)} cm, πόσα km είναι η πραγματική τους απόσταση;`,
        correctVal: realKm,
        correctStr: formatNum(realKm),
        explanation: `Ο συντελεστής αναλογίας είναι 50.000. Πραγματική απόσταση σε cm: ${formatNum(mapDist)} · 50.000 ＝ ${mapDist * scale} cm. Μετατρέπουμε σε km διαιρώντας με το 100.000: ${mapDist * scale} : 100.000 ＝ ${formatNum(realKm)} km.`
      };
    }
  },
  {
    id: 'analoga_hard_4',
    generate: () => {
      const totalSum = 360;
      const ratioA = 2;
      const ratioB = 3;
      const ratioC = 4;
      const sumParts = ratioA + ratioB + ratioC; // 9
      const lambdaPart = totalSum / sumParts; // 40
      const maxShare = ratioC * lambdaPart;
      return {
        text: `Τρεις κληρονόμοι μοιράζονται ποσό ${totalSum} € ανάλογα με τους συντελεστές ${ratioA}, ${ratioB} και ${ratioC}. Πόσα € έλαβε αυτός που πήρε το μεγαλύτερο μερίδιο;`,
        correctVal: maxShare,
        correctStr: String(maxShare),
        explanation: `Τα συνολικά μέρη είναι ${ratioA} ＋ ${ratioB} ＋ ${ratioC} ＝ ${sumParts}. Ο συντελεστής ανά μερίδιο είναι λ ＝ ${totalSum} : ${sumParts} ＝ ${lambdaPart} €. Το μεγαλύτερο μερίδιο έχει ${ratioC} μέρη: ${ratioC} · ${lambdaPart} ＝ ${maxShare} €.`
      };
    }
  },
  {
    id: 'analoga_hard_5',
    generate: () => {
      const hours = 1.5;
      const pages = 45;
      const lambdaP = pages / hours; // 30 pages/h
      const targetHours = 3.5;
      const targetPages = lambdaP * targetHours;
      return {
        text: `Μια εκτυπωτική μηχανή λειτουργεί σταθερά, άρα ο χρόνος και οι εκτυπωμένες σελίδες είναι ανάλογα ποσά. Αν σε 1 ώρα και 30 λεπτά τυπώνει ${pages} σελίδες, πόσες σελίδες θα τυπώσει σε 3 ώρες και 30 λεπτά;`,
        correctVal: targetPages,
        correctStr: String(targetPages),
        explanation: `Εκφράζουμε τον χρόνο σε δεκαδική μορφή: 1 h 30 min ＝ 1,5 h και 3 h 30 min ＝ 3,5 h. Ο συντελεστής αναλογίας είναι λ ＝ ${pages} : 1,5 ＝ 30 σελίδες/ώρα. Σε 3,5 ώρες: 3,5 · 30 ＝ ${targetPages} σελίδες.`
      };
    }
  },
  {
    id: 'analoga_hard_6',
    generate: () => {
      const speed = 72; // km/h -> 20 m/s
      const mPerSec = speed / 3.6; // 20
      const seconds = randInt(15, 45);
      const meters = mPerSec * seconds;
      return {
        text: `Ένα όχημα κινείται με σταθερή ταχύτητα 72 km/h (που ισοδυναμεί με σταθερό συντελεστή 20 m ανά δευτερόλεπτο). Πόσα μέτρα (m) θα διανύσει το όχημα σε χρόνο ${seconds} δευτερολέπτων;`,
        correctVal: meters,
        correctStr: String(meters),
        explanation: `Επειδή ταχύτητα και χρόνος είναι ανάλογα ποσά με συντελεστή λ ＝ 20 m/s, η απόσταση σε ${seconds} δευτερόλεπτα είναι: ψ ＝ λ · χ ＝ 20 · ${seconds} ＝ ${meters} m.`
      };
    }
  },
  {
    id: 'analoga_hard_7',
    generate: () => {
      const pureGoldRatio = 18 / 24; // 0.75
      const totalWeight = randInt(4, 8) * 16;
      const pureGold = totalWeight * pureGoldRatio;
      return {
        text: `Σε ένα χρυσό κόσμημα 18 καρατίων, η μάζα του καθαρού χρυσού είναι ανάλογη με τη συνολική μάζα με συντελεστή αναλογίας λ ＝ 18/24 (δηλαδή 0,75). Αν το κόσμημα ζυγίζει ${totalWeight} g, πόσα g καθαρού χρυσού περιέχει;`,
        correctVal: pureGold,
        correctStr: String(pureGold),
        explanation: `Η μάζα καθαρού χρυσού είναι ψ ＝ λ · χ ＝ 0,75 · ${totalWeight} ＝ ${pureGold} g.`
      };
    }
  },
  {
    id: 'analoga_hard_8',
    generate: () => {
      const mass1 = 2;
      const vol1 = 5.4; // λ = 2.7 g/cm3 (πυκνότητα αλουμινίου)
      const targetVol = 13.5;
      const targetMass = targetVol * (vol1 / mass1); // 5
      return {
        text: `Η μάζα ενός ομογενούς μετάλλου και ο όγκος του είναι ανάλογα ποσά (σταθερή πυκνότητα). Αν ένα κομμάτι όγκου ${formatNum(mass1)} cm³ ζυγίζει ${formatNum(vol1)} g, ποια είναι η μάζα σε g ενός κομματιού όγκου ${formatNum(targetMass)} cm³;`,
        correctVal: Number(targetVol.toFixed(1)),
        correctStr: formatNum(targetVol, 1),
        explanation: `Ο συντελεστής αναλογίας (πυκνότητα) είναι λ ＝ ${formatNum(vol1)} : ${formatNum(mass1)} ＝ 2,7 g/cm³. Για όγκο ${formatNum(targetMass)} cm³, η μάζα είναι: ${formatNum(targetMass)} · 2,7 ＝ ${formatNum(targetVol, 1)} g.`
      };
    }
  },
  {
    id: 'analoga_hard_9',
    generate: () => {
      const cost1 = 240;
      const days1 = 4;
      const workers1 = 3;
      const costPerWorkerDay = cost1 / (days1 * workers1); // 20 €
      const days2 = 5;
      const workers2 = 6;
      const totalCost2 = days2 * workers2 * costPerWorkerDay;
      return {
        text: `Το κόστος διαμονής είναι ανάλογο με τον αριθμό των ατόμων και τις ημέρες. Αν για 3 άτομα για 4 ημέρες πληρώσαμε ${cost1} €, πόσα € θα πληρώσουν 6 άτομα για 5 ημέρες στο ίδιο κατάλυμα;`,
        correctVal: totalCost2,
        correctStr: String(totalCost2),
        explanation: `Το κόστος ανά άτομο και ανά ημέρα είναι σταθερό: ${cost1} : (3 · 4) ＝ ${cost1} : 12 ＝ 20 €/ημέρα. Για 6 άτομα και 5 ημέρες το συνολικό κόστος είναι: 6 · 5 · 20 ＝ ${totalCost2} €.`
      };
    }
  },
  {
    id: 'analoga_hard_10',
    generate: () => {
      const percent = 18;
      const initial = randInt(15, 30) * 10;
      const increase = (initial * percent) / 100;
      const finalPrice = initial + increase;
      return {
        text: `Η αύξηση της τιμής ενός εμπορεύματος είναι ανάλογη της αρχικής τιμής με συντελεστή λ ＝ 0,18 (αύξηση 18 %). Αν η αρχική τιμή ήταν ${initial} €, ποια είναι η τελική τιμή του εμπορεύματος μετά την αύξηση σε €;`,
        correctVal: finalPrice,
        correctStr: formatNum(finalPrice),
        explanation: `Η αύξηση είναι ψ ＝ 0,18 · ${initial} ＝ ${formatNum(increase)} €. Η τελική τιμή είναι: ${initial} ＋ ${formatNum(increase)} ＝ ${formatNum(finalPrice)} €.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Υπολογισμός συντελεστή αναλογίας λ
  {
    const x = randInt(3, 6);
    const lambda = randInt(4, 8);
    const y = x * lambda;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΕΥΡΕΣΗ ΣΥΝΤΕΛΕΣΤΗ ΑΝΑΛΟΓΙΑΣ',
      instruction: 'Υπολογίστε τον συντελεστή αναλογίας λ:',
      prompt: `Σε δύο ανάλογα ποσά χ και ψ, όταν χ ＝ ${x}, το ψ ισούται με ${y}. Ποια είναι η τιμή του συντελεστή αναλογίας λ (λ ＝ ψ : χ);`,
      correctVal: lambda,
      correctStr: String(lambda),
      explanation: `Ο συντελεστής αναλογίας βρίσκεται διαιρώντας την τιμή του ψ με την αντίστοιχη τιμή του χ: λ ＝ ψ : χ ＝ ${y} : ${x} ＝ ${lambda}.`
    });
  }

  // Q2 (MCQ): Έλεγχος ανάλογων ποσών σε πίνακα
  {
    const base1 = 2;
    const base2 = randInt(5, 8);
    const lambda = base2 / base1;

    const isAnaloga = Math.random() > 0.4;
    const xVals = [2, 4, 6];
    const yVals = isAnaloga
      ? [base2, base2 * 2, base2 * 3]
      : [base2, base2 * 2 + 1, base2 * 3];

    const correctAns = isAnaloga
      ? 'Ναι, γιατί όλα τα πηλίκα ψ : χ είναι ίσα'
      : 'Όχι, γιατί τα πηλίκα ψ : χ δεν παραμένουν σταθερά';

    const wrongAns = isAnaloga
      ? 'Όχι, γιατί οι αριθμοί μεγαλώνουν'
      : 'Ναι, γιατί τα ποσά αυξάνονται ταυτόχρονα';

    const options = [
      { text: correctAns, isCorrect: true },
      { text: wrongAns, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΕΛΕΓΧΟΣ ΑΝΑΛΟΓΙΑΣ ΣΕ ΠΙΝΑΚΑ',
      instruction: 'Εξετάστε τον πίνακα τιμών:',
      prompt: `Είναι τα ποσά χ και ψ του παρακάτω πίνακα ανάλογα;`,
      table: {
        col1: 'Ποσό χ',
        col2: 'Ποσό ψ',
        r1: [xVals[0], yVals[0]],
        r2: [xVals[1], yVals[1]],
        r3: [xVals[2], yVals[2]]
      },
      options,
      correctText: correctAns,
      explanation: `Ελέγχουμε τα πηλίκα: ${yVals[0]} : ${xVals[0]} ＝ ${formatNum(yVals[0] / xVals[0])}, ${yVals[1]} : ${xVals[1]} ＝ ${formatNum(yVals[1] / xVals[1])}, ${yVals[2]} : ${xVals[2]} ＝ ${formatNum(yVals[2] / xVals[2])}. ${correctAns}.`
    });
  }

  // Q3 (Input - Decimal): Συμπλήρωση τιμής ψ με δεδομένο το λ
  {
    const lambda = randInt(3, 7);
    const targetX = randInt(6, 12);
    const expectedY = lambda * targetX;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΣΥΜΠΛΗΡΩΣΗ ΤΙΜΗΣ ΑΝΑΛΟΓΟΥ ΠΟΣΟΥ',
      instruction: 'Υπολογίστε την τιμή του ψ:',
      prompt: `Δύο ποσά χ και ψ είναι ανάλογα με συντελεστή αναλογίας λ ＝ ${lambda} (δηλαδή ψ ＝ ${lambda} · χ). Αν χ ＝ ${targetX}, πόσο είναι το ψ;`,
      correctVal: expectedY,
      correctStr: String(expectedY),
      explanation: `Εφαρμόζουμε τη βασική σχέση των ανάλογων ποσών: ψ ＝ λ · χ ＝ ${lambda} · ${targetX} ＝ ${expectedY}.`
    });
  }

  // Q4 (MCQ): Χαρακτηριστικό γραφικής παράστασης ανάλογων ποσών
  {
    const correctProp = 'Ευθεία γραμμή που διέρχεται από την αρχή των αξόνων (0, 0)';
    const fake1 = 'Καμπύλη γραμμή που ξεκινά από το σημείο (0, 1)';
    const fake2 = 'Ευθεία γραμμή που δεν περνάει ποτέ από το σημείο (0, 0)';
    const fake3 = 'Τεθλασμένη γραμμή που ανεβοκατεβαίνει';

    const options = [
      { text: correctProp, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΓΡΑΦΙΚΗ ΠΑΡΑΣΤΑΣΗ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ',
      instruction: 'Επιλέξτε τη σωστή μαθηματική ιδιότητα:',
      prompt: `Ποια είναι η μορφή της γραφικής παράστασης δύο ανάλογων ποσών σε σύστημα αξόνων;`,
      options,
      correctText: correctProp,
      explanation: `Η γραφική παράσταση δύο ανάλογων ποσών είναι πάντοτε ευθεία γραμμή που διέρχεται υποχρεωτικά από την αρχή των αξόνων (0, 0), επειδή όταν το πρώτο ποσό είναι 0, και το δεύτερο είναι 0.`
    });
  }

  // Q5 (Input - Decimal): Εύρεση του χ όταν δίνεται το ψ και το λ
  {
    const lambda = randInt(4, 9);
    const expectedX = randInt(5, 12);
    const yVal = lambda * expectedX;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΑΝΤΙΣΤΡΟΦΟΣ ΥΠΟΛΟΓΙΣΜΟΣ',
      instruction: 'Υπολογίστε την τιμή του χ:',
      prompt: `Δύο ποσά χ και ψ είναι ανάλογα με συντελεστή λ ＝ ${lambda}. Αν ψ ＝ ${yVal}, ποια είναι η αντίστοιχη τιμή του χ;`,
      correctVal: expectedX,
      correctStr: String(expectedX),
      explanation: `Αφού ψ ＝ λ · χ, έχουμε: χ ＝ ψ : λ ＝ ${yVal} : ${lambda} ＝ ${expectedX}.`
    });
  }

  // Q6 (MCQ): Αναγνώριση ζεύγους μη ανάλογων ποσών
  {
    const correctNonAnaloga = 'Η ηλικία ενός ανθρώπου και το ύψος του';
    const optAnaloga1 = 'Τα κιλά των μήλων και το συνολικό κόστος αγοράς τους';
    const optAnaloga2 = 'Ο χρόνος οδήγησης με σταθερή ταχύτητα και η απόσταση';
    const optAnaloga3 = 'Τα λίτρα της βενζίνης και το ποσό πληρωμής στο πρατήριο';

    const options = [
      { text: correctNonAnaloga, isCorrect: true },
      { text: optAnaloga1, isCorrect: false },
      { text: optAnaloga2, isCorrect: false },
      { text: optAnaloga3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΔΙΑΚΡΙΣΗ ΑΝΑΛΟΓΩΝ & ΜΗ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ',
      instruction: 'Επιλέξτε ποιο ζεύγος ποσών ΔΕΝ είναι ανάλογο:',
      prompt: `Ποιο από τα παρακάτω ζεύγη ποσών ΔΕΝ αποτελεί ζεύγος ανάλογων ποσών;`,
      options,
      correctText: correctNonAnaloga,
      explanation: `Όταν η ηλικία ενός ανθρώπου διπλασιάζεται, το ύψος του δεν διπλασιάζεται. Συνεπώς η ηλικία και το ύψος δεν είναι ανάλογα ποσά. Αντίθετα, όλα τα υπόλοιπα ζεύγη είναι ανάλογα ποσά με σταθερό συντελεστή.`
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
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΟΒΛΗΜΑ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ',
      instruction: 'Λύστε το πρόβλημα υπολογίζοντας τον συντελεστή αναλογίας:',
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
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΑΝΑΛΟΓΙΑΣ',
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
      instruction: 'Προσέξτε τις μονάδες μέτρησης και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: hardProb1.text,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal;
    const fake10A = formatNum(val10 + randInt(2, 6));
    const fake10B = formatNum(Math.max(1, val10 - randInt(1, 3)));
    const fake10C = formatNum(val10 * 2);

    const optionsQ10 = [
      { text: hardProb2.correctStr, isCorrect: true },
      { text: String(fake10A), isCorrect: false },
      { text: String(fake10B), isCorrect: false },
      { text: String(fake10C), isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      options: optionsQ10,
      correctText: hardProb2.correctStr,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function AnalogaPosaExercisesPage() {
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
      title="Ασκήσεις: Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στα ανάλογα ποσά, τον συντελεστή αναλογίας, τους πίνακες τιμών και τη γραφική παράσταση για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/44-analoga-posa"
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
              Ασκήσεις &amp; Προβλήματα: Ανάλογα Ποσά
            </h1>
            <p className="text-sky-100 text-sm sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές ασκήσεις με 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Υπολογίστε τον συντελεστή αναλογίας λ, συμπληρώστε πίνακες τιμών και ελέγξτε τις γνώσεις σας.
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

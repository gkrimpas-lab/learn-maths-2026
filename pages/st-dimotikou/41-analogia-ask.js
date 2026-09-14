// pages/st-dimotikou/41-analogia-ask.js
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

// Βοηθητικη συναρτηση ΜΚΔ
function getGCD(a, b) {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
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

// Δεξαμενη Κανονικων Προβληματων Αναλογιων (10 διαφορετικα προβληματα)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_std_1',
    generate: () => {
      const pCount1 = randInt(3, 6);
      const pricePerItem = randInt(2, 5);
      const cost1 = pCount1 * pricePerItem;
      const pCount2 = randInt(7, 12);
      const cost2 = pCount2 * pricePerItem;
      return {
        text: `Αν ${pCount1} ίδια τετράδια κοστίζουν ${cost1} €, πόσα € θα πληρώσουμε για να αγοράσουμε ${pCount2} τέτοια τετράδια;`,
        correctVal: cost2,
        correctStr: String(cost2),
        explanation: `Στήνουμε την αναλογία ποσότητας προς κόστος: ${pCount1} : ${cost1} ＝ ${pCount2} : χ. Εφαρμόζοντας σταυρωτά γινόμενα (χιαστί), έχουμε: χ ＝ (${cost1} · ${pCount2}) : ${pCount1} ＝ ${cost1 * pCount2} : ${pCount1} ＝ ${cost2} €.`
      };
    }
  },
  {
    id: 'p_std_2',
    generate: () => {
      const kg1 = randInt(2, 5);
      const rate = randInt(4, 8) * 10;
      const juice1 = kg1 * rate; // σε ml
      const kg2 = randInt(6, 10);
      const juice2 = kg2 * rate;
      return {
        text: `Από ${kg1} kg πορτοκάλια παίρνουμε ${juice1} ml χυμό. Πόσα ml χυμό θα πάρουμε από ${kg2} kg πορτοκάλια ίδιας ποιότητας;`,
        correctVal: juice2,
        correctStr: String(juice2),
        explanation: `Τα ποσά είναι ανάλογα. Σχηματίζουμε την αναλογία: ${kg1} : ${juice1} ＝ ${kg2} : χ. Άρα χ ＝ (${juice1} · ${kg2}) : ${kg1} ＝ ${juice1 * kg2} : ${kg1} ＝ ${juice2} ml.`
      };
    }
  },
  {
    id: 'p_std_3',
    generate: () => {
      const km1 = randInt(3, 6) * 40;
      const hours1 = randInt(2, 3);
      const speed = km1 / hours1;
      const hours2 = hours1 + randInt(2, 4);
      const km2 = speed * hours2;
      return {
        text: `Ένα αυτοκίνητο κινούμενο με σταθερή ταχύτητα διανύει ${km1} km σε ${hours1} ώρες. Πόσα km θα διανύσει σε ${hours2} ώρες;`,
        correctVal: km2,
        correctStr: String(km2),
        explanation: `Απόσταση και χρόνος σχηματίζουν αναλογία: ${km1} : ${hours1} ＝ χ : ${hours2}. Με σταυρωτά γινόμενα βρίσκουμε: χ ＝ (${km1} · ${hours2}) : ${hours1} ＝ ${km1 * hours2} : ${hours1} ＝ ${km2} km.`
      };
    }
  },
  {
    id: 'p_std_4',
    generate: () => {
      const eggs1 = randInt(2, 4);
      const flour1 = eggs1 * 125; // γραμμάρια
      const eggs2 = eggs1 + randInt(2, 4);
      const flour2 = eggs2 * 125;
      return {
        text: `Για ένα κέικ χρειάζονται ${eggs1} αυγά και ${flour1} g αλεύρι. Αν μια μητέρα θέλει να φτιάξει μεγαλύτερο κέικ με την ίδια αναλογία χρησιμοποιώντας ${eggs2} αυγά, πόσα g αλεύρι θα χρειαστεί;`,
        correctVal: flour2,
        correctStr: String(flour2),
        explanation: `Ο λόγος αυγών προς αλεύρι παραμένει σταθερός: ${eggs1} : ${flour1} ＝ ${eggs2} : χ. Συνεπώς: χ ＝ (${flour1} · ${eggs2}) : ${eggs1} ＝ ${flour1 * eggs2} : ${eggs1} ＝ ${flour2} g.`
      };
    }
  },
  {
    id: 'p_std_5',
    generate: () => {
      const m1 = randInt(3, 6);
      const cost1 = m1 * 14;
      const m2 = randInt(7, 12);
      const cost2 = m2 * 14;
      return {
        text: `Μια οικογένεια αγόρασε ${m1} m υφάσματος προς ${cost1} €. Πόσα € θα κόστιζαν ${m2} m από το ίδιο ύφασμα;`,
        correctVal: cost2,
        correctStr: String(cost2),
        explanation: `Η αναλογία μήκους και κόστους είναι: ${m1} : ${cost1} ＝ ${m2} : χ. Λύνουμε ως προς χ: χ ＝ (${cost1} · ${m2}) : ${m1} ＝ ${cost1 * m2} : ${m1} ＝ ${cost2} €.`
      };
    }
  },
  {
    id: 'p_std_6',
    generate: () => {
      const days = randInt(3, 5);
      const pagesPerDay = randInt(20, 35);
      const pages1 = days * pagesPerDay;
      const targetDays = days + randInt(3, 5);
      const pages2 = targetDays * pagesPerDay;
      return {
        text: `Ένας μαθητής διαβάζει με σταθερό ρυθμό ${pages1} σελίδες σε ${days} ημέρες. Πόσες σελίδες θα διαβάσει σε ${targetDays} ημέρες;`,
        correctVal: pages2,
        correctStr: String(pages2),
        explanation: `Οι σελίδες και οι ημέρες βρίσκονται σε αναλογία: ${pages1} : ${days} ＝ χ : ${targetDays}. Άρα χ ＝ (${pages1} · ${targetDays}) : ${days} ＝ ${pages2} σελίδες.`
      };
    }
  },
  {
    id: 'p_std_7',
    generate: () => {
      const tiles1 = randInt(4, 8) * 10;
      const area1 = tiles1 * 2; // π.χ. 0.2 m2 -> x10
      const tiles2 = randInt(9, 15) * 10;
      const area2 = tiles2 * 2;
      return {
        text: `Για να καλυφθεί επιφάνεια ${area1} dm² απαιτούνται ${tiles1} πλακάκια. Πόσα τέτοια πλακάκια θα χρειαστούν για επιφάνεια ${area2} dm²;`,
        correctVal: tiles2,
        correctStr: String(tiles2),
        explanation: `Σχηματίζουμε την αναλογία: ${area1} : ${tiles1} ＝ ${area2} : χ. Υπολογίζουμε: χ ＝ (${tiles1} · ${area2}) : ${area1} ＝ ${tiles2} πλακάκια.`
      };
    }
  },
  {
    id: 'p_std_8',
    generate: () => {
      const lit1 = randInt(3, 5);
      const paintKm1 = lit1 * 18; // m²
      const lit2 = randInt(6, 9);
      const paintKm2 = lit2 * 18;
      return {
        text: `Με ${lit1} l χρώματος μπορούμε να βάψουμε τοίχο εμβαδού ${paintKm1} m². Πόσα m² τοίχου μπορούμε να βάψουμε με ${lit2} l από το ίδιο χρώμα;`,
        correctVal: paintKm2,
        correctStr: String(paintKm2),
        explanation: `Η ποσότητα χρώματος και το εμβαδόν σχηματίζουν αναλογία: ${lit1} : ${paintKm1} ＝ ${lit2} : χ. Άρα χ ＝ (${paintKm1} · ${lit2}) : ${lit1} ＝ ${paintKm2} m².`
      };
    }
  },
  {
    id: 'p_std_9',
    generate: () => {
      const tickets1 = randInt(2, 4);
      const priceSingle = randInt(7, 12);
      const cost1 = tickets1 * priceSingle;
      const tickets2 = randInt(5, 8);
      const cost2 = tickets2 * priceSingle;
      return {
        text: `Μια παρέα πλήρωσε ${cost1} € για ${tickets1} εισιτήρια κινηματογράφου. Πόσα € θα πληρώσει μια άλλη παρέα για ${tickets2} ίδια εισιτήρια;`,
        correctVal: cost2,
        correctStr: String(cost2),
        explanation: `Η αναλογία είναι: ${tickets1} : ${cost1} ＝ ${tickets2} : χ. Επομένως: χ ＝ (${cost1} · ${tickets2}) : ${tickets1} ＝ ${cost2} €.`
      };
    }
  },
  {
    id: 'p_std_10',
    generate: () => {
      const min1 = randInt(2, 4) * 10; // π.χ. 20 min
      const bottles1 = min1 * 45;
      const min2 = min1 + randInt(2, 4) * 10;
      const bottles2 = min2 * 45;
      return {
        text: `Μια μηχανή εμφιάλωσης γεμίζει ${bottles1} μπουκάλια σε ${min1} λεπτά. Πόσα μπουκάλια θα γεμίσει σε ${min2} λεπτά λειτουργίας;`,
        correctVal: bottles2,
        correctStr: String(bottles2),
        explanation: `Ο χρόνος και τα μπουκάλια είναι ανάλογα ποσά: ${min1} : ${bottles1} ＝ ${min2} : χ. Άρα χ ＝ (${bottles1} · ${min2}) : ${min1} ＝ ${bottles2} μπουκάλια.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (10 διαφορετικα προβληματα)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_hard_1',
    generate: () => {
      const scaleVal = randInt(2, 5) * 50; // π.χ. 1:200
      const mapCm = randInt(3, 7);
      const realMeters = (mapCm * scaleVal) / 100;
      return {
        text: `Σε έναν χάρτη με κλίμακα 1 : ${scaleVal}, η απόσταση δύο κτηρίων σχεδιάστηκε ίση με ${mapCm} cm. Πόσα m είναι η πραγματική απόσταση μεταξύ των δύο κτηρίων;`,
        correctVal: realMeters,
        correctStr: formatNum(realMeters),
        explanation: `Η κλίμακα είναι αναλογία: 1 : ${scaleVal} ＝ ${mapCm} : χ. Άρα η πραγματική απόσταση είναι χ ＝ ${mapCm} · ${scaleVal} ＝ ${mapCm * scaleVal} cm. Μετατρέπουμε σε μέτρα: ${mapCm * scaleVal} : 100 ＝ ${formatNum(realMeters)} m.`
      };
    }
  },
  {
    id: 'p_hard_2',
    generate: () => {
      const ratioA = 3;
      const ratioB = 5;
      const k = randInt(12, 28);
      const partA = ratioA * k;
      const partB = ratioB * k;
      const total = partA + partB;
      return {
        text: `Δύο τεχνίτες μοιράστηκαν αμοιβή ${total} € έτσι ώστε ο λόγος των χρημάτων τους να είναι ίσος με ${ratioA} : ${ratioB}. Πόσα € έλαβε ο τεχνίτης που πήρε το μεγαλύτερο ποσό;`,
        correctVal: partB,
        correctStr: String(partB),
        explanation: `Τα συνολικά μέρη της αναλογίας είναι ${ratioA} ＋ ${ratioB} ＝ ${ratioA + ratioB}. Το 1 μέρος αντιστοιχεί σε ${total} : ${ratioA + ratioB} ＝ ${k} €. Ο τεχνίτης με το μεγαλύτερο μερίδιο πήρε ${ratioB} μέρη, δηλαδή ${ratioB} · ${k} ＝ ${partB} €.`
      };
    }
  },
  {
    id: 'p_hard_3',
    generate: () => {
      const speed1 = randInt(6, 8) * 10; // π.χ. 60 km/h
      const time1 = randInt(3, 5); // π.χ. 4 hours
      const dist = speed1 * time1;
      const time2 = time1 - 1;
      const speed2 = dist / time2;
      return {
        text: `Ένα τρένο κάλυψε μια διαδρομή σε ${time1} ώρες κινούμενο με μέση ταχύτητα ${speed1} km/h. Με ποια μέση ταχύτητα (σε km/h) έπρεπε να κινηθεί για να καλύψει την ίδια διαδρομή σε ${time2} ώρες;`,
        correctVal: Number(speed2.toFixed(1)),
        correctStr: formatNum(speed2, 1),
        explanation: `Η απόσταση είναι σταθερή: ${speed1} · ${time1} ＝ ${dist} km. Τα ποσά ταχύτητα και χρόνος είναι αντιστρόφως ανάλογα: ${speed1} · ${time1} ＝ υ · ${time2} ➔ υ ＝ ${dist} : ${time2} ＝ ${formatNum(speed2, 1)} km/h.`
      };
    }
  },
  {
    id: 'p_hard_4',
    generate: () => {
      const rL = randInt(3, 5);
      const rW = randInt(2, 3);
      const mult = randInt(6, 14);
      const len = rL * mult;
      const wid = rW * mult;
      const perimeter = 2 * (len + wid);
      const area = len * wid;
      return {
        text: `Σε ένα ορθογώνιο αγροτεμάχιο ο λόγος του μήκους προς το πλάτος είναι ${rL} : ${rW} και η περίμετρος ισούται με ${perimeter} m. Πόσα m² είναι το εμβαδόν του;`,
        correctVal: area,
        correctStr: String(area),
        explanation: `Το ημιπερίμετρος είναι ${perimeter} : 2 ＝ ${len + wid} m. Τα μέρη είναι ${rL} ＋ ${rW} ＝ ${rL + rW}. Άρα 1 μέρος ＝ ${len + wid} : ${rL + rW} ＝ ${mult} m. Μήκος ＝ ${rL} · ${mult} ＝ ${len} m και πλάτος ＝ ${rW} · ${mult} ＝ ${wid} m. Εμβαδόν ＝ ${len} · ${wid} ＝ ${area} m².`
      };
    }
  },
  {
    id: 'p_hard_5',
    generate: () => {
      const c = randInt(4, 8);
      const initialSugar = 2 * c;
      const initialFlour = 5 * c;
      const addedSugar = randInt(2, 4) * c;
      const newSugar = initialSugar + addedSugar;
      const reqFlour = (newSugar * 5) / 2;
      return {
        text: `Σε ένα μείγμα ο λόγος της ζάχαρης προς το αλεύρι πρέπει να είναι αυστηρά 2 : 5. Αν έχουμε ${newSugar} g ζάχαρης, πόσα g αλεύρι πρέπει να προσθέσουμε συνολικά για να διατηρηθεί η αναλογία;`,
        correctVal: reqFlour,
        correctStr: String(reqFlour),
        explanation: `Η αναλογία είναι 2 : 5 ＝ ${newSugar} : χ. Εφαρμόζοντας σταυρωτά γινόμενα βρίσκουμε: χ ＝ (5 · ${newSugar}) : 2 ＝ ${5 * newSugar} : 2 ＝ ${reqFlour} g.`
      };
    }
  },
  {
    id: 'p_hard_6',
    generate: () => {
      const origCost = randInt(15, 30) * 10;
      const percent = 15;
      const discount = (origCost * percent) / 100;
      const finalCost = origCost - discount;
      return {
        text: `Σε ένα κατάστημα όλες οι τιμές μειώθηκαν κατά ${percent} % λόγω εκπτώσεων. Αν ένα μπουφάν πριν την έκπτωση κόστιζε ${origCost} €, ποια είναι η τελική τιμή πώλησής του σε €;`,
        correctVal: finalCost,
        correctStr: formatNum(finalCost),
        explanation: `Στήνουμε αναλογία με βάση το 100: 100 : ${100 - percent} ＝ ${origCost} : χ. Επομένως η νέα τιμή είναι χ ＝ (${origCost} · ${100 - percent}) : 100 ＝ ${finalCost} €.`
      };
    }
  },
  {
    id: 'p_hard_7',
    generate: () => {
      const rGold = 18;
      const rTotal = 24; // 18 καράτια
      const totalWeight = randInt(4, 9) * 12; // γραμμάρια
      const pureGold = (totalWeight * rGold) / rTotal;
      return {
        text: `Ένα χρυσό κόσμημα 18 καρατίων περιέχει 18 μέρη καθαρού χρυσού στα 24 μέρη συνολικής μάζας. Αν το κόσμημα ζυγίζει ${totalWeight} g, πόσα g καθαρού χρυσού περιέχει;`,
        correctVal: pureGold,
        correctStr: String(pureGold),
        explanation: `Σχηματίζουμε την αναλογία: 18 : 24 ＝ χ : ${totalWeight}. Λύνουμε ως προς χ: χ ＝ (18 · ${totalWeight}) : 24 ＝ ${pureGold} g καθαρού χρυσού.`
      };
    }
  },
  {
    id: 'p_hard_8',
    generate: () => {
      const realDistKm = randInt(2, 6) * 15; // π.χ. 45 km
      const realDistCm = realDistKm * 100000;
      const mapCm = randInt(3, 6);
      const scaleDiv = realDistCm / mapCm;
      return {
        text: `Μια πραγματική απόσταση ${realDistKm} km σημειώνεται σε έναν χάρτη με ευθύγραμμο τμήμα μήκους ${mapCm} cm. Ποιος είναι ο παρονομαστής της κλίμακας 1 : χ του χάρτη;`,
        correctVal: scaleDiv,
        correctStr: String(scaleDiv),
        explanation: `Μετατρέπουμε τα ${realDistKm} km σε cm: ${realDistKm} · 100.000 ＝ ${realDistCm} cm. Στήνουμε την αναλογία κλίμακας: 1 : χ ＝ ${mapCm} : ${realDistCm}. Άρα χ ＝ ${realDistCm} : ${mapCm} ＝ ${scaleDiv}.`
      };
    }
  },
  {
    id: 'p_hard_9',
    generate: () => {
      const men1 = randInt(4, 6);
      const days1 = randInt(6, 10);
      const totalWork = men1 * days1;
      const men2 = men1 + randInt(2, 4);
      const days2 = totalWork / men2;
      return {
        text: `${men1} εργάτες τελειώνουν ένα έργο σε ${days1} ημέρες. Σε πόσες ημέρες θα τελειώσουν το ίδιο έργο ${men2} εργάτες με τον ίδιο ακριβώς ρυθμό εργασίας;`,
        correctVal: Number(days2.toFixed(1)),
        correctStr: formatNum(days2, 1),
        explanation: `Οι εργάτες και οι ημέρες είναι αντίστροφα ποσά: ${men1} · ${days1} ＝ ${men2} · χ ➔ χ ＝ (${men1} · ${days1}) : ${men2} ＝ ${totalWork} : ${men2} ＝ ${formatNum(days2, 1)} ημέρες.`
      };
    }
  },
  {
    id: 'p_hard_10',
    generate: () => {
      const k = randInt(5, 12);
      const salt = 3 * k;
      const water = 17 * k;
      const solution = salt + water; // 20 * k
      return {
        text: `Σε ένα αλατόνερο ο λόγος του αλατιού προς το νερό είναι 3 : 17. Αν το συνολικό διάλυμα ζυγίζει ${solution} g, πόσα g αλατιού περιέχονται σε αυτό;`,
        correctVal: salt,
        correctStr: String(salt),
        explanation: `Το σύνολο των μερών είναι 3 ＋ 17 ＝ 20 μέρη. Το 1 μέρος αντιστοιχεί σε ${solution} : 20 ＝ ${k} g. Το αλάτι αντιστοιχεί σε 3 μέρη, άρα περιέχει 3 · ${k} ＝ ${salt} g.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Εύρεση άγνωστου όρου χ
  {
    const a = randInt(2, 6);
    const b = randInt(3, 8);
    const mult = randInt(2, 5);
    const c = a * mult;
    const d = b * mult; // d = (b * c) / a
    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ ΟΡΟΥ',
      instruction: 'Υπολογίστε την τιμή του άγνωστου όρου χ:',
      prompt: `Στην αναλογία ${a} : ${b} ＝ ${c} : χ, ποια είναι η τιμή του χ;`,
      correctVal: d,
      correctStr: String(d),
      fractionDisplay: { num1: a, den1: b, num2: c, den2: 'χ' },
      explanation: `Χρησιμοποιούμε τη βασική ιδιότητα των σταυρωτών γινομένων: ${a} · χ ＝ ${b} · ${c} ➔ χ ＝ (${b} · ${c}) : ${a} ＝ ${b * c} : ${a} ＝ ${d}.`
    });
  }

  // Q2 (MCQ): Έλεγχος αν δύο λόγοι σχηματίζουν αναλογία
  {
    const a = randInt(2, 5);
    const b = randInt(3, 7);
    const m = randInt(2, 4);
    const cTrue = a * m;
    const dTrue = b * m;

    const optTrue = `${cTrue} : ${dTrue}`;
    const optFalse1 = `${cTrue + 1} : ${dTrue}`;
    const optFalse2 = `${cTrue} : ${dTrue + 2}`;
    const optFalse3 = `${a + 2} : ${b + 3}`;

    const options = [
      { text: optTrue, isCorrect: true },
      { text: optFalse1, isCorrect: false },
      { text: optFalse2, isCorrect: false },
      { text: optFalse3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΕΛΕΓΧΟΣ ΑΝΑΛΟΓΙΑΣ',
      instruction: 'Επιλέξτε τον λόγο που σχηματίζει αληθή αναλογία με τον δοσμένο λόγο:',
      prompt: `Ποιος από τους παρακάτω λόγους σχηματίζει αναλογία με τον λόγο ${a} : ${b};`,
      options,
      correctText: optTrue,
      explanation: `Για να σχηματίζουν αναλογία, τα σταυρωτά γινόμενα πρέπει να είναι ίσα: ${a} · ${dTrue} ＝ ${a * dTrue} και ${b} · ${cTrue} ＝ ${b * cTrue}. Άρα ο λόγος ${optTrue} είναι ο σωστός.`
    });
  }

  // Q3 (Input - Decimal): Άγνωστος όρος σε άκρα θέση (χ : b = c : d)
  {
    const b = randInt(3, 7);
    const c = randInt(2, 5);
    const m = randInt(2, 4);
    const d = b * m;
    const a = (b * c * m) / d; // a = c
    const xVal = c;
    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΑΓΝΩΣΤΟΣ ΣΕ ΑΚΡΑ ΘΕΣΗ',
      instruction: 'Υπολογίστε τον αριθμό χ:',
      prompt: `Αν ισχύει η ισότητα των κλασμάτων χ/${b} ＝ ${c * m}/${d}, ποια είναι η τιμή του χ;`,
      correctVal: xVal,
      correctStr: String(xVal),
      fractionDisplay: { num1: 'χ', den1: b, num2: c * m, den2: d },
      explanation: `Εφαρμόζουμε σταυρωτά γινόμενα: χ · ${d} ＝ ${b} · ${c * m} ➔ χ ＝ (${b} · ${c * m}) : ${d} ＝ ${xVal}.`
    });
  }

  // Q4 (MCQ): Αναγνώριση άκρων και μέσων όρων
  {
    const n1 = randInt(3, 8);
    const n2 = randInt(4, 9);
    const n3 = randInt(5, 11);
    const n4 = randInt(6, 12);

    const correctAns = `Άκροι: ${n1} και ${n4} | Μέσοι: ${n2} και ${n3}`;
    const fake1 = `Άκροι: ${n2} και ${n3} | Μέσοι: ${n1} και ${n4}`;
    const fake2 = `Άκροι: ${n1} και ${n2} | Μέσοι: ${n3} και ${n4}`;
    const fake3 = `Άκροι: ${n1} και ${n3} | Μέσοι: ${n2} και ${n4}`;

    const options = [
      { text: correctAns, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΟΡΟΙ ΑΝΑΛΟΓΙΑΣ',
      instruction: 'Επιλέξτε τη σωστή ταξινόμηση των όρων:',
      prompt: `Στην αναλογία ${n1} : ${n2} ＝ ${n3} : ${n4}, ποιοι είναι οι άκροι και ποιοι οι μέσοι όροι;`,
      options,
      correctText: correctAns,
      explanation: `Στη γραφή α : β ＝ γ : δ, άκροι όροι ονομάζονται οι εξωτερικοί (α και δ ➔ ${n1} και ${n4}) και μέσοι όροι οι εσωτερικοί (β και γ ➔ ${n2} και ${n3}).`
    });
  }

  // Q5 (Input - Fraction): Συμπλήρωση ισοδύναμου κλάσματος
  {
    const num = randInt(2, 5);
    const den = randInt(6, 9);
    const k = randInt(2, 4);
    const eqNum = num * k;
    const eqDen = den * k;
    qList.push({
      id: 5,
      type: 'fraction_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΣΧΗΜΑΤΙΣΜΟΣ ΑΝΑΛΟΓΙΑΣ',
      instruction: 'Συμπληρώστε τον αριθμητή και τον παρονομαστή του ίσου κλάσματος:',
      prompt: `Βρείτε ένα ισοδύναμο κλάσμα με το ${num}/${den} ώστε ο αριθμητής του να είναι ${eqNum}:`,
      ansNum: eqNum,
      ansDen: eqDen,
      fractionDisplay: { num1: num, den1: den, num2: eqNum, den2: '?' },
      explanation: `Πολλαπλασιάζουμε και τους δύο όρους με τον ίδιο αριθμό: ${num} · ${k} ＝ ${eqNum}, άρα και ο παρονομαστής πρέπει να πολλαπλασιαστεί με το ${k}: ${den} · ${k} ＝ ${eqDen}. Το κλάσμα είναι ${eqNum} / ${eqDen}.`
    });
  }

  // Q6 (MCQ): Βασική Ιδιότητα (Ποια ισότητα ισχύει)
  {
    const x = randInt(3, 7);
    const y = randInt(4, 8);
    const z = randInt(5, 9);
    const w = randInt(6, 10);

    const correctEq = `${x} · ${w} ＝ ${y} · ${z}`;
    const wrong1 = `${x} · ${y} ＝ ${z} · ${w}`;
    const wrong2 = `${x} · ${z} ＝ ${y} · ${w}`;
    const wrong3 = `${x} ＋ ${w} ＝ ${y} ＋ ${z}`;

    const options = [
      { text: correctEq, isCorrect: true },
      { text: wrong1, isCorrect: false },
      { text: wrong2, isCorrect: false },
      { text: wrong3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΣΤΑΥΡΩΤΑ ΓΙΝΟΜΕΝΑ',
      instruction: 'Επιλέξτε τη σχέση που απορρέει από τη βασική ιδιότητα των αναλογιών:',
      prompt: `Αν ισχύει η αναλογία ${x} : ${y} ＝ ${z} : ${w}, ποια από τις παρακάτω ισότητες είναι πάντοτε αληθής;`,
      options,
      correctText: correctEq,
      explanation: `Σύμφωνα με τη βασική ιδιότητα των αναλογιών, το γινόμενο των άκρων ισούται πάντα με το γινόμενο των μέσων: ${x} · ${w} ＝ ${y} · ${z}.`
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
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΟΒΛΗΜΑ ΑΝΑΛΟΓΙΑΣ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: stdProb1.text,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal;
    const fake8A = typeof val8 === 'number' ? val8 + randInt(2, 6) : '0';
    const fake8B = typeof val8 === 'number' ? Math.max(1, val8 - randInt(2, 5)) : '0';
    const fake8C = typeof val8 === 'number' ? Math.round(val8 * 1.5) : '0';

    const optionsQ8 = [
      { text: String(val8), isCorrect: true },
      { text: String(fake8A), isCorrect: false },
      { text: String(fake8B), isCorrect: false },
      { text: String(fake8C), isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ',
      instruction: 'Επιλέξτε τη σωστή τιμή:',
      prompt: stdProb2.text,
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
      title: 'ΕΡΩΤΗΣΗ 9 • ΠΡΟΒΛΗΜΑ ΑΥΞΗΜΕΝΗΣ ΔΥΣΚΟΛΙΑΣ',
      instruction: 'Υπολογίστε με ακρίβεια και εισαγάγετε την απάντηση:',
      prompt: hardProb1.text,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal;
    const fake10A = formatNum(val10 + randInt(3, 10));
    const fake10B = formatNum(Math.max(1, val10 - randInt(2, 8)));
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
      title: 'ΕΡΩΤΗΣΗ 10 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΑΥΞΗΜΕΝΗΣ ΔΥΣΚΟΛΙΑΣ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      options: optionsQ10,
      correctText: hardProb2.correctStr,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function AnalogiaExercisesPage() {
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
      } else if (q.type === 'fraction_input') {
        const userNum = parseInt(answers[`q_${q.id}_num`] || '0', 10);
        const userDen = parseInt(answers[`q_${q.id}_den`] || '0', 10);
        if (userNum === q.ansNum && userDen === q.ansDen) {
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
      title="Ασκήσεις: Αναλογίες - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα αυξημένης δυσκολίας στις αναλογίες, σταυρωτά γινόμενα (χιαστί), εύρεση αγνώστου όρου και κλίμακες για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/41-analogia"
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
              Ασκήσεις &amp; Προβλήματα: Αναλογίες
            </h1>
            <p className="text-sky-100 text-sm sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές ασκήσεις με 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Υπολογίστε τους άγνωστους όρους χ, ελέγξτε τα σταυρωτά γινόμενα και ελέγξτε τις απαντήσεις σας.
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
              } else if (q.type === 'fraction_input') {
                const un = parseInt(answers[`q_${q.id}_num`] || '0', 10);
                const ud = parseInt(answers[`q_${q.id}_den`] || '0', 10);
                isCorrect = un === q.ansNum && ud === q.ansDen;
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
                {/* Επικεφαλιδα Ερωτησης (Καθαρα ατονα κεφαλαια) */}
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
                <div className="space-y-2 mb-5">
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    {q.instruction}
                  </p>
                  <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed flex flex-wrap items-center gap-2">
                    <span>{q.prompt}</span>
                    {q.fractionDisplay && (
                      <span className="inline-flex items-center bg-slate-100 px-3 py-1 rounded-xl text-base font-bold">
                        <Fraction num={q.fractionDisplay.num1} den={q.fractionDisplay.den1} />
                        <span className="mx-2">＝</span>
                        <Fraction num={q.fractionDisplay.num2} den={q.fractionDisplay.den2} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2">
                  
                  {/* 1. Fraction Input */}
                  {q.type === 'fraction_input' && (
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center bg-slate-50 p-2.5 rounded-2xl border border-slate-300 shadow-inner gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder="αριθμητής"
                          value={answers[`q_${q.id}_num`] || ''}
                          onChange={(e) => handleInputChange(`q_${q.id}_num`, e.target.value)}
                          className="w-24 sm:w-28 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />
                        <span className="text-xl sm:text-2xl font-black text-slate-500 px-1 select-none">
                          /
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder="παρονομαστής"
                          value={answers[`q_${q.id}_den`] || ''}
                          onChange={(e) => handleInputChange(`q_${q.id}_den`, e.target.value)}
                          className="w-24 sm:w-28 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      <span className="text-xs text-slate-500 hidden sm:inline">
                        (Μορφή κλάσματος: αριθμητής / παρονομαστής)
                      </span>
                    </div>
                  )}

                  {/* 2. Decimal / Single Input */}
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

                  {/* 3. Multiple Choice (MCQ) */}
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
                        {q.type === 'fraction_input' ? (
                          <span className="font-mono font-bold text-blue-900">
                            {q.ansNum} / {q.ansDen}
                          </span>
                        ) : q.type === 'decimal_input' ? (
                          <span className="font-mono font-bold text-blue-900">
                            {q.correctStr}
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-blue-900">
                            {q.correctText}
                          </span>
                        )}
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

// pages/st-dimotikou/51-brisko-pososta-ask.js
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

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Δεξαμενη Κανονικων Προβληματων Ευρεσης Ποσοστου & Τελικης Τιμης (10 διαφορετικα προβληματα)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'b_pos_std_1',
    generate: () => {
      const origPrice = randInt(6, 15) * 10; // π.χ. 60, 70, ..., 150 €
      const discPct = pickRandom([10, 20, 25, 30, 40]);
      const discount = (origPrice * discPct) / 100;
      const finalPrice = origPrice - discount;
      return {
        text: `Ένα μπουφάν είχε αρχική τιμή ${origPrice} € και πωλείται με έκπτωση ${discPct} %. Ποια είναι η τελική τιμή του μπουφάν σε € μετά την έκπτωση;`,
        tableData: { col1: 'Αρχική (€)', col2: 'Τελική (€)', r1: [100, 100 - discPct], r2: [origPrice, 'χ'] },
        correctVal: finalPrice,
        correctStr: String(finalPrice),
        explanation: `Το ποσό της έκπτωσης είναι: (${origPrice} · ${discPct}) : 100 ＝ ${discount} €. Η τελική τιμή είναι: ${origPrice} － ${discount} ＝ ${finalPrice} € (ή απευθείας: ${origPrice} · ${formatNum((100 - discPct) / 100)} ＝ ${finalPrice} €).`
      };
    }
  },
  {
    id: 'b_pos_std_2',
    generate: () => {
      const origPrice = randInt(4, 12) * 50; // π.χ. 200, 250, ..., 600 €
      const vatPct = 24;
      const vatEur = (origPrice * vatPct) / 100;
      const finalPrice = origPrice + vatEur;
      return {
        text: `Μια ηλεκτρική συσκευή έχει καθαρή αξία ${origPrice} € χωρίς φόρο. Αν επιβαρύνεται με Φ.Π.Α. ${vatPct} %, ποιο είναι το τελικό ποσό πληρωμής σε €;`,
        tableData: { col1: 'Καθαρή (€)', col2: 'Τελική (€)', r1: [100, 100 + vatPct], r2: [origPrice, 'χ'] },
        correctVal: finalPrice,
        correctStr: String(finalPrice),
        explanation: `Ο φόρος Φ.Π.Α. είναι: (${origPrice} · 24) : 100 ＝ ${vatEur} €. Η τελική τιμή είναι: ${origPrice} ＋ ${vatEur} ＝ ${finalPrice} € (ή: ${origPrice} · 1,24 ＝ ${finalPrice} €).`
      };
    }
  },
  {
    id: 'b_pos_std_3',
    generate: () => {
      const origPrice = randInt(15, 30) * 2; // π.χ. 30, 40, ..., 60 €
      const discPct = pickRandom([15, 20, 25, 50]);
      const discount = (origPrice * discPct) / 100;
      return {
        text: `Ένα παντελόνι κοστίζει αρχικά ${origPrice} €. Σε περίοδο προσφορών έχει έκπτωση ${discPct} %. Πόσα ευρώ (€) είναι το ποσό της έκπτωσης;`,
        correctVal: discount,
        correctStr: formatNum(discount),
        explanation: `Ζητείται μόνο το ποσό της έκπτωσης: Έκπτωση ＝ (${origPrice} · ${discPct}) : 100 ＝ ${formatNum(discount)} €.`
      };
    }
  },
  {
    id: 'b_pos_std_4',
    generate: () => {
      const initRent = randInt(35, 55) * 10; // π.χ. 350, 400, ..., 550 €
      const incPct = pickRandom([5, 8, 10]);
      const increase = (initRent * incPct) / 100;
      const finalRent = initRent + increase;
      return {
        text: `Το μηνιαίο ενοίκιο ενός διαμερίσματος ήταν ${initRent} € και αυξήθηκε κατά ${incPct} %. Ποιο είναι το νέο μηνιαίο ενοίκιο σε €;`,
        correctVal: finalRent,
        correctStr: formatNum(finalRent),
        explanation: `Η αύξηση είναι: (${initRent} · ${incPct}) : 100 ＝ ${formatNum(increase)} €. Το νέο ενοίκιο είναι: ${initRent} ＋ ${formatNum(increase)} ＝ ${formatNum(finalRent)} €.`
      };
    }
  },
  {
    id: 'b_pos_std_5',
    generate: () => {
      const totalSeats = randInt(4, 8) * 100; // π.χ. 400, 500, ..., 800
      const pctOcc = pickRandom([70, 75, 80, 85, 90]);
      const occupied = (totalSeats * pctOcc) / 100;
      return {
        text: `Σε ένα θέατρο χωρητικότητας ${totalSeats} θέσεων, στην απογευματινή παράσταση ήταν κατειλημμένο το ${pctOcc} % των θέσεων. Πόσοι θεατές παρακολούθησαν την παράσταση;`,
        correctVal: occupied,
        correctStr: String(occupied),
        explanation: `Υπολογίζουμε το ποσοστό επί του συνόλου: (${totalSeats} · ${pctOcc}) : 100 ＝ ${occupied} θεατές.`
      };
    }
  },
  {
    id: 'b_pos_std_6',
    generate: () => {
      const origWeight = pickRandom([250, 400, 500]); // g
      const freePct = pickRandom([10, 20, 25]);
      const extraGrams = (origWeight * freePct) / 100;
      const finalWeight = origWeight + extraGrams;
      return {
        text: `Μια συσκευασία δημητριακών ${origWeight} g προσφέρει επιπλέον δωρεάν προϊόν ${freePct} %. Ποιο είναι το συνολικό τελικό βάρος της συσκευασίας σε g;`,
        correctVal: finalWeight,
        correctStr: String(finalWeight),
        explanation: `Η επιπλέον ποσότητα είναι: (${origWeight} · ${freePct}) : 100 ＝ ${extraGrams} g. Το τελικό βάρος είναι: ${origWeight} ＋ ${extraGrams} ＝ ${finalWeight} g.`
      };
    }
  },
  {
    id: 'b_pos_std_7',
    generate: () => {
      const totalKm = pickRandom([120, 150, 180, 200]);
      const donePct = pickRandom([30, 40, 60, 70]);
      const remPct = 100 - donePct;
      const remKm = (totalKm * remPct) / 100;
      return {
        text: `Ένας οδηγός έχει διανύσει το ${donePct} % μιας διαδρομής συνολικού μήκους ${totalKm} km. Πόσα km του απομένουν ακόμα μέχρι τον προορισμό του;`,
        correctVal: remKm,
        correctStr: String(remKm),
        explanation: `Το ποσοστό που απομένει είναι: 100 % － ${donePct} % ＝ ${remPct} %. Τα χιλιόμετρα που απομένουν είναι: (${totalKm} · ${remPct}) : 100 ＝ ${remKm} km.`
      };
    }
  },
  {
    id: 'b_pos_std_8',
    generate: () => {
      const origBill = randInt(40, 80);
      const tipPct = pickRandom([5, 10, 15]);
      const tip = (origBill * tipPct) / 100;
      const totalPay = origBill + tip;
      return {
        text: `Ο λογαριασμός σε ένα εστιατόριο ήταν ${origBill} €. Οι πελάτες πρόσθεσαν φιλοδώρημα ${tipPct} % επί του λογαριασμού. Πόσα € πλήρωσαν συνολικά;`,
        correctVal: totalPay,
        correctStr: formatNum(totalPay),
        explanation: `Το φιλοδώρημα είναι: (${origBill} · ${tipPct}) : 100 ＝ ${formatNum(tip)} €. Συνολικό ποσό πληρωμής: ${origBill} ＋ ${formatNum(tip)} ＝ ${formatNum(totalPay)} €.`
      };
    }
  },
  {
    id: 'b_pos_std_9',
    generate: () => {
      const batteryStart = randInt(60, 95);
      const dropPct = pickRandom([15, 20, 25, 30]);
      const batteryLeft = batteryStart - dropPct;
      return {
        text: `Η μπαταρία ενός τάμπλετ βρισκόταν στο ${batteryStart} %. Κατά τη διάρκεια ενός παιχνιδιού μειώθηκε κατά ${dropPct} ποσοστιαίες μονάδες. Σε ποιο ποσοστό (%) βρίσκεται τώρα η μπαταρία;`,
        correctVal: batteryLeft,
        correctStr: String(batteryLeft),
        explanation: `Αφαιρούμε τη μείωση: ${batteryStart} % － ${dropPct} % ＝ ${batteryLeft} %.`
      };
    }
  },
  {
    id: 'b_pos_std_10',
    generate: () => {
      const origPrice = randInt(25, 50) * 10; // π.χ. 250, 300, ..., 500 €
      const discPct = pickRandom([10, 15, 20, 30]);
      const finalPrice = origPrice * (1 - discPct / 100);
      return {
        text: `Μια τηλεόραση με αρχική τιμή ${origPrice} € πωλείται με έκπτωση ${discPct} %. Πόσα € θα πληρώσει ο αγοραστής;`,
        correctVal: finalPrice,
        correctStr: formatNum(finalPrice),
        explanation: `Ο αγοραστής πληρώνει το ${100 - discPct} % της αρχικής τιμής: (${origPrice} · ${100 - discPct}) : 100 ＝ ${formatNum(finalPrice)} €.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (10 διαφορετικα προβληματα)
const HARD_PROBLEMS_POOL = [
  {
    id: 'b_pos_hard_1',
    generate: () => {
      const origPrice = 160;
      const discPct = 25; // Έκπτωση 25% -> 120 €
      const priceAfterDisc = origPrice * (1 - discPct / 100); // 120
      const vatPct = 24; // ΦΠΑ 24%
      const finalPrice = priceAfterDisc * (1 + vatPct / 100); // 148.80
      return {
        text: `Ένα ηλεκτρονικό κατάστημα προσφέρει έκπτωση ${discPct} % σε ένα προϊόν αρχικής καθαρής αξίας ${origPrice} €. Στην τιμή που προκύπτει μετά την έκπτωση επιβάλλεται Φ.Π.Α. ${vatPct} %. Ποια είναι η τελική τιμή πληρωμής σε €;`,
        correctVal: finalPrice,
        correctStr: formatNum(finalPrice),
        explanation: `1ο Βήμα: Τιμή μετά την έκπτωση: ${origPrice} · 0,75 ＝ ${priceAfterDisc} €. 2ο Βήμα: Επιβολή Φ.Π.Α. 24% στη νέα τιμή: ${priceAfterDisc} · 1,24 ＝ ${formatNum(finalPrice)} €.`
      };
    }
  },
  {
    id: 'b_pos_hard_2',
    generate: () => {
      const costPrice = 80;
      const profitPct = 40; // Κέρδος 40% -> 112 €
      const sellingPrice = costPrice * (1 + profitPct / 100); // 112
      const discPct = 20; // Έκπτωση 20% στην τιμή πώλησης
      const finalPrice = sellingPrice * (1 - discPct / 100); // 89.60
      return {
        text: `Ένας έμπορος αγόρασε ένα προϊόν προς ${costPrice} € και όρισε τιμή πώλησης με κέρδος ${profitPct} %. Στη συνέχεια έκανε έκπτωση ${discPct} % πάνω στην τιμή πώλησης. Σε ποια τιμή (€) πούλησε τελικά το προϊόν;`,
        correctVal: finalPrice,
        correctStr: formatNum(finalPrice),
        explanation: `1ο Βήμα: Αρχική τιμή πώλησης: ${costPrice} ＋ (${costPrice} · 40) : 100 ＝ ${costPrice} ＋ 32 ＝ ${sellingPrice} €. 2ο Βήμα: Τελική τιμή μετά την έκπτωση 20%: ${sellingPrice} · 0,80 ＝ ${formatNum(finalPrice)} €.`
      };
    }
  },
  {
    id: 'b_pos_hard_3',
    generate: () => {
      const origSalary = 1200;
      const firstIncPct = 10;
      const salaryAfterFirst = origSalary * (1 + firstIncPct / 100); // 1320
      const secondIncPct = 5;
      const finalSalary = salaryAfterFirst * (1 + secondIncPct / 100); // 1386
      return {
        text: `Ο μηνιαίος μισθός ενός εργαζομένου ήταν ${origSalary} €. Την πρώτη χρονιά έλαβε αύξηση ${firstIncPct} % και τη δεύτερη χρονιά έλαβε επιπλέον αύξηση ${secondIncPct} % επί του νέου μισθού του. Ποιος είναι ο τελικός μισθός του σε €;`,
        correctVal: finalSalary,
        correctStr: formatNum(finalSalary),
        explanation: `1η αύξηση: ${origSalary} · 1,10 ＝ ${salaryAfterFirst} €. 2η αύξηση στον νέο μισθό: ${salaryAfterFirst} · 1,05 ＝ ${formatNum(finalSalary)} €.`
      };
    }
  },
  {
    id: 'b_pos_hard_4',
    generate: () => {
      const originalPrice = 200;
      const increasePct = 20; // 240 €
      const priceUp = originalPrice * (1 + increasePct / 100);
      const decreasePct = 20; // 240 * 0.80 = 192 €
      const priceDown = priceUp * (1 - decreasePct / 100);
      return {
        text: `Η τιμή ενός προϊόντος ήταν ${originalPrice} €. Πρώτα αυξήθηκε κατά ${increasePct} % και έπειτα η νέα τιμή μειώθηκε κατά ${decreasePct} %. Ποια είναι η τελική τιμή του προϊόντος σε €;`,
        correctVal: priceDown,
        correctStr: String(priceDown),
        explanation: `Μετά την αύξηση 20%: ${originalPrice} · 1,20 ＝ ${priceUp} €. Μετά τη μείωση 20% επί της νέας τιμής: ${priceUp} · 0,80 ＝ ${priceDown} € (Προσοχή: δεν επιστρέφει στα 200 € γιατί η μείωση υπολογίζεται στη μεγαλύτερη τιμή!).`
      };
    }
  },
  {
    id: 'b_pos_hard_5',
    generate: () => {
      const townPop = 12000;
      const birthsPct = 4;
      const deathsPct = 1.5;
      const netPct = birthsPct - deathsPct; // 2.5%
      const newPop = townPop * (1 + netPct / 100); // 12300
      return {
        text: `Σε μια πόλη με ${townPop} κατοίκους, μέσα σε έναν χρόνο οι γεννήσεις ήταν ${formatNum(birthsPct)} % και οι θάνατοι ${formatNum(deathsPct)} % επί του συνολικού πληθυσμού. Ποιος ήταν ο πληθυσμός της πόλης στο τέλος του έτους;`,
        correctVal: newPop,
        correctStr: String(newPop),
        explanation: `Η καθαρή ποσοστιαία αύξηση είναι: ${formatNum(birthsPct)} % － ${formatNum(deathsPct)} % ＝ ${formatNum(netPct)} %. Ο νέος πληθυσμός είναι: ${townPop} ＋ (${townPop} · ${formatNum(netPct)}) : 100 ＝ ${townPop} ＋ 300 ＝ ${newPop} κάτοικοι.`
      };
    }
  },
  {
    id: 'b_pos_hard_6',
    generate: () => {
      const totalBudget = 2400;
      const techPct = 35; // 840
      const booksPct = 25; // 600
      const remPct = 100 - techPct - booksPct; // 40% -> 960
      const remAmount = (totalBudget * remPct) / 100;
      return {
        text: `Ένα σχολείο διέθεσε προϋπολογισμό ${totalBudget} €. Το ${techPct} % δαπανήθηκε για τεχνολογικό εξοπλισμό και το ${booksPct} % για βιβλία βιβλιοθήκης. Πόσα ευρώ (€) περίσσεψαν για άλλες ανάγκες;`,
        correctVal: remAmount,
        correctStr: String(remAmount),
        explanation: `Το ποσοστό που περίσσεψε είναι: 100 % － (${techPct} ＋ ${booksPct}) % ＝ ${remPct} %. Το ποσό είναι: (${totalBudget} · ${remPct}) : 100 ＝ ${remAmount} €.`
      };
    }
  },
  {
    id: 'b_pos_hard_7',
    generate: () => {
      const billNoTip = 150;
      const discPct = 10;
      const afterDisc = billNoTip * (1 - discPct / 100); // 135
      const tipPct = 10;
      const finalBill = afterDisc * (1 + tipPct / 100); // 148.50
      return {
        text: `Σε ένα κατάστημα ο λογαριασμός ήταν ${billNoTip} €. Ο πελάτης έλαβε έκπτωση ${discPct} % και στη συνέχεια επιβαρύνθηκε με έξοδα μεταφοράς ${tipPct} % επί του νέου ποσού. Πόσα € πλήρωσε τελικά;`,
        correctVal: finalBill,
        correctStr: formatNum(finalBill),
        explanation: `1ο Βήμα: Ποσό μετά την έκπτωση 10%: ${billNoTip} · 0,90 ＝ ${afterDisc} €. 2ο Βήμα: Επιβάρυνση 10% στο νέο ποσό: ${afterDisc} · 1,10 ＝ ${formatNum(finalBill)} €.`
      };
    }
  },
  {
    id: 'b_pos_hard_8',
    generate: () => {
      const origWeightKg = 80;
      const targetWeightKg = 72;
      const lossKg = origWeightKg - targetWeightKg; // 8 kg
      const lossPct = (lossKg / origWeightKg) * 100; // 10%
      return {
        text: `Ένας αθλητής ζύγιζε ${origWeightKg} kg και μετά από προπόνηση το βάρος του μειώθηκε στα ${targetWeightKg} kg. Ποιο ήταν το ποσοστό (%) της μείωσης του βάρους του;`,
        correctVal: lossPct,
        correctStr: String(lossPct),
        explanation: `Η απώλεια βάρους ήταν: ${origWeightKg} － ${targetWeightKg} ＝ ${lossKg} kg. Το ποσοστό μείωσης ως προς το αρχικό βάρος είναι: (${lossKg} : ${origWeightKg}) · 100 ＝ (8 : 80) · 100 ＝ ${lossPct} %.`
      };
    }
  },
  {
    id: 'b_pos_hard_9',
    generate: () => {
      const initialStock = 500;
      const soldMorningPct = 30; // 150 τεμάχια
      const remMorning = initialStock * (1 - soldMorningPct / 100); // 350 τεμάχια
      const soldAfternoonPct = 20; // 20% επί των 350 = 70 τεμάχια
      const remEnd = remMorning * (1 - soldAfternoonPct / 100); // 280 τεμάχια
      return {
        text: `Ένα κατάστημα είχε απόθεμα ${initialStock} τεμάχια ενός προϊόντος. Το πρωί πούλησε το ${soldMorningPct} % του αποθέματος και το απόγευμα πούλησε το ${soldAfternoonPct} % από τα τεμάχια που είχαν απομείνει. Πόσα τεμάχια απέμειναν στο τέλος της ημέρας;`,
        correctVal: remEnd,
        correctStr: String(remEnd),
        explanation: `Το πρωί πωλήθηκαν: 500 · 0,30 ＝ 150 τεμάχια ➔ Απέμειναν: 350. Το απόγευμα πωλήθηκαν: 350 · 0,20 ＝ 70 τεμάχια ➔ Τελικό απόθεμα: 350 － 70 ＝ ${remEnd} τεμάχια.`
      };
    }
  },
  {
    id: 'b_pos_hard_10',
    generate: () => {
      const netPay = 950;
      const bonusPct = 12;
      const deductionsPct = 8;
      const netChangePct = bonusPct - deductionsPct; // +4%
      const finalPay = netPay * (1 + netChangePct / 100); // 988
      return {
        text: `Στον βασικό μισθό των ${netPay} € ενός υπαλλήλου προστέθηκε επίδομα ${bonusPct} %, ενώ έγιναν κρατήσεις ${deductionsPct} % (και τα δύο υπολογισμένα επί του βασικού μισθού). Ποιο είναι το καθαρό ποσό πληρωμής σε €;`,
        correctVal: finalPay,
        correctStr: formatNum(finalPay),
        explanation: `Επειδή και τα δύο ποσοστά υπολογίζονται επί του ίδιου βασικού μισθού, η καθαρή μεταβολή είναι: ${bonusPct} % － ${deductionsPct} % ＝ ＋${netChangePct} %. Τελική πληρωμή: ${netPay} · 1,04 ＝ ${formatNum(finalPay)} €.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Εύρεση ποσοστού επί ποσού
  {
    const total = pickRandom([60, 80, 120, 150, 200]);
    const pct = pickRandom([10, 20, 25, 50]);
    const res = (total * pct) / 100;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΕΥΡΕΣΗ ΠΟΣΟΣΤΟΥ ΑΠΟ ΠΟΣΟ',
      instruction: 'Υπολογίστε το ζητούμενο ποσό:',
      prompt: `Πόσα ευρώ (€) είναι το ${pct} % των ${total} €;`,
      correctVal: res,
      correctStr: String(res),
      explanation: `Πολλαπλασιάζουμε το ποσό με το ποσοστό και διαιρούμε με το 100: (${total} · ${pct}) : 100 ＝ ${res} €.`
    });
  }

  // Q2 (MCQ): Τελική τιμή μετά από έκπτωση
  {
    const price = pickRandom([50, 80, 100, 120]);
    const disc = 20;
    const finalP = price * 0.8;
    const fake1 = price - 20;
    const fake2 = price * 0.2;
    const fake3 = price * 1.2;

    const options = [
      { text: `${finalP} €`, isCorrect: true },
      { text: `${fake1} €`, isCorrect: false },
      { text: `${fake2} €`, isCorrect: false },
      { text: `${fake3} €`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΤΕΛΙΚΗ ΤΙΜΗ ΜΕΤΑ ΑΠΟ ΕΚΠΤΩΣΗ',
      instruction: 'Επιλέξτε τη σωστή τελική τιμή:',
      prompt: `Ένα προϊόν αξίας ${price} € πωλείται με έκπτωση 20 %. Ποια είναι η τελική τιμή πληρωμής;`,
      options,
      correctText: `${finalP} €`,
      explanation: `Η έκπτωση είναι (${price} · 20) : 100 ＝ ${price * 0.2} €. Τελική τιμή: ${price} － ${price * 0.2} ＝ ${finalP} € (ή ${price} · 0,80 ＝ ${finalP} €).`
    });
  }

  // Q3 (Input - Decimal): Τελική τιμή μετά από αύξηση
  {
    const price = pickRandom([40, 50, 70, 80]);
    const inc = pickRandom([10, 25, 50]);
    const incAmount = (price * inc) / 100;
    const finalP = price + incAmount;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΤΕΛΙΚΗ ΤΙΜΗ ΜΕΤΑ ΑΠΟ ΑΥΞΗΣΗ',
      instruction: 'Υπολογίστε τη νέα τιμή μετά την αύξηση:',
      prompt: `Ένα είδος κοστίζει ${price} € και η τιμή του αυξάνεται κατά ${inc} %. Ποια είναι η νέα τιμή του σε €;`,
      correctVal: finalP,
      correctStr: String(finalP),
      explanation: `Το ποσό της αύξησης είναι: (${price} · ${inc}) : 100 ＝ ${incAmount} €. Η νέα τιμή είναι: ${price} ＋ ${incAmount} ＝ ${finalP} €.`
    });
  }

  // Q4 (MCQ): Γιατί τα ποσά στα ποσοστά είναι πάντα ανάλογα
  {
    const correctReason = 'Επειδή αν διπλασιαστεί η αρχική τιμή, διπλασιάζεται και το ποσό της έκπτωσης ή της αύξησης';
    const fake1 = 'Επειδή ο συντελεστής είναι πάντα ίσος με 100';
    const fake2 = 'Επειδή στα ποσοστά κάνουμε πάντοτε μόνο αφαίρεση';
    const fake3 = 'Επειδή η τελική τιμή είναι πάντοτε μικρότερη από 100';

    const options = [
      { text: correctReason, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΣΧΕΣΗ ΑΝΑΛΟΓΙΑΣ ΣΤΑ ΠΟΣΟΣΤΑ',
      instruction: 'Επιλέξτε τη σωστή μαθηματική αιτιολόγηση:',
      prompt: `Γιατί λέμε ότι τα ποσά στα προβλήματα με ποσοστά είναι ΠΑΝΤΑ ανάλογα ποσά;`,
      options,
      correctText: correctReason,
      explanation: `Όταν η αρχική αξία μεταβάλλεται, το ποσό του ποσοστού μεταβάλλεται με τον ίδιο ακριβώς ρυθμό, διατηρώντας σταθερό τον λόγο τους.`
    });
  }

  // Q5 (Input - Decimal): Υπολογισμός τελικής τιμής σε 1 βήμα με δεκαδικό συντελεστή
  {
    const price = pickRandom([30, 50, 90, 110]);
    const inc = 10;
    const finalP = price * 1.1;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΑΥΞΗΣΗ ΜΕ ΣΥΝΤΕΛΕΣΤΗ',
      instruction: 'Υπολογίστε την τελική τιμή:',
      prompt: `Αν σε μια αρχική τιμή ${price} € επιβληθεί αύξηση 10 % (τελικός συντελεστής 1,10), ποια είναι η τελική τιμή σε €;`,
      correctVal: finalP,
      correctStr: formatNum(finalP),
      explanation: `Πολλαπλασιάζουμε κατευθείαν με το 1,10: ${price} · 1,10 ＝ ${formatNum(finalP)} €.`
    });
  }

  // Q6 (MCQ): Σύντομος υπολογισμός έκπτωσης σε 1 βήμα
  {
    const discPct = 35;
    const correctFactor = '0,65 (δηλαδή 100 % － 35 % ＝ 65 %)';
    const fake1 = '0,35';
    const fake2 = '1,35';
    const fake3 = '3,5';

    const options = [
      { text: correctFactor, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΣΥΝΤΕΛΕΣΤΗΣ ΤΕΛΙΚΗΣ ΤΙΜΗΣ',
      instruction: 'Επιλέξτε τον σωστό συντελεστή:',
      prompt: `Αν ένα προϊόν έχει έκπτωση 35 %, με ποιον δεκαδικό αριθμό πολλαπλασιάζουμε την αρχική τιμή για να βρούμε απευθείας την τελική τιμή;`,
      options,
      correctText: correctFactor,
      explanation: `Αφού η έκπτωση είναι 35 %, πληρώνουμε το 100 % － 35 % ＝ 65 % της τιμής, δηλαδή πολλαπλασιάζουμε με το 0,65.`
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
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΑΓΟΡΑΣ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα σε €:',
      prompt: stdProb1.text,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal;
    const fake8A = typeof val8 === 'number' ? formatNum(val8 + randInt(5, 15)) : '0';
    const fake8B = typeof val8 === 'number' ? formatNum(Math.max(1, val8 - randInt(4, 12))) : '0';
    const fake8C = typeof val8 === 'number' ? formatNum(val8 * 1.3) : '0';

    const optionsQ8 = [
      { text: `${stdProb2.correctStr} €`, isCorrect: true },
      { text: `${fake8A} €`, isCorrect: false },
      { text: `${fake8B} €`, isCorrect: false },
      { text: `${fake8C} €`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΗΣ ΕΦΑΡΜΟΓΗΣ',
      instruction: 'Επιλέξτε τη σωστή τιμή για το πρόβλημα:',
      prompt: stdProb2.text,
      options: optionsQ8,
      correctText: `${stdProb2.correctStr} €`,
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
      instruction: 'Υπολογίστε με ακρίβεια και εισαγάγετε το τελικό ποσό:',
      prompt: hardProb1.text,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal;
    const fake10A = typeof val10 === 'number' ? formatNum(val10 + randInt(5, 12)) : '0';
    const fake10B = typeof val10 === 'number' ? formatNum(Math.max(1, val10 - randInt(4, 10))) : '0';
    const fake10C = typeof val10 === 'number' ? formatNum(val10 * 1.25) : '0';

    const optionsQ10 = [
      { text: `${hardProb2.correctStr} €`, isCorrect: true },
      { text: `${fake10A} €`, isCorrect: false },
      { text: `${fake10B} €`, isCorrect: false },
      { text: `${fake10C} €`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΔΙΑΔΟΧΙΚΩΝ ΜΕΤΑΒΟΛΩΝ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      options: optionsQ10,
      correctText: `${hardProb2.correctStr} €`,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function BriskoPosostaExercisesPage() {
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
      title="Ασκήσεις: Εύρεση Ποσοστού & Τελικής Τιμής - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στην εύρεση ποσοστού, υπολογισμό εκπτώσεων, αυξήσεων και τελικών τιμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/51-brisko-pososta"
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
              Ασκήσεις: Εύρεση Ποσοστού &amp; Τελικής Τιμής
            </h1>
            <p className="text-sky-100 text-sm sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Υπολογίστε το ποσοστό από ένα ποσό, βρείτε την έκπτωση ή την αύξηση και προσδιορίστε την τελική τιμή.
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
                  {q.tableData && (
                    <div className="inline-block bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 shadow-inner my-2 font-mono text-xs sm:text-sm">
                      <div className="grid grid-cols-2 gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                        <span className="bg-blue-100/60 px-2 py-0.5 rounded-lg text-blue-900">{q.tableData.col1}</span>
                        <span className="bg-emerald-100/60 px-2 py-0.5 rounded-lg text-emerald-900">{q.tableData.col2}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2 text-center font-bold text-slate-800">
                        <span>{q.tableData.r1[0]}</span>
                        <span className="text-indigo-700">{q.tableData.r1[1]}</span>
                        <span>{q.tableData.r2[0]}</span>
                        <span className={q.tableData.r2[1] === 'χ' ? 'text-amber-600 font-black text-base' : 'text-indigo-700'}>
                          {q.tableData.r2[1]}
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
                        (Ακέραιος η δεκαδικός με κόμμα)
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

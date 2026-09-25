// pages/st-dimotikou/43-posa-ask.js
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

// Δεξαμενη Κανονικων Προβληματων Συσχετισμενων Ποσων (10 διαφορετικα προβληματα)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'posa_std_1',
    generate: () => {
      const fixedRate = randInt(3, 7); // π.χ. 4 € το τεμάχιο (σταθερό ποσό)
      const count1 = randInt(3, 6);
      const cost1 = count1 * fixedRate;
      const count2 = count1 + randInt(3, 6);
      const cost2 = count2 * fixedRate;
      return {
        text: `Σε ένα βιβλιοπωλείο η τιμή ενός σημειωματάριου είναι σταθερή. Αν για ${count1} σημειωματάρια πληρώσαμε ${cost1} €, ποιο είναι το ποσό σε € που αντιστοιχεί στην αγορά ${count2} τέτοιων σημειωματάριων;`,
        correctVal: cost2,
        correctStr: String(cost2),
        explanation: `Η σταθερή τιμή μονάδας είναι ${cost1} : ${count1} ＝ ${fixedRate} € ανά σημειωματάριο. Επομένως, το μεταβλητό κόστος για ${count2} σημειωματάρια είναι ${count2} · ${fixedRate} ＝ ${cost2} €.`
      };
    }
  },
  {
    id: 'posa_std_2',
    generate: () => {
      const speed = randInt(60, 90); // σταθερή ταχύτητα (km/h)
      const hours = randInt(2, 5);
      const distance = speed * hours;
      return {
        text: `Ένα όχημα κινείται με σταθερή ταχύτητα ${speed} km/h. Ποια είναι η μεταβλητή απόσταση (σε km) που θα διανύσει το όχημα σε χρόνο ${hours} ωρών;`,
        correctVal: distance,
        correctStr: String(distance),
        explanation: `Η ταχύτητα είναι σταθερό ποσό (${speed} km/h). Η απόσταση υπολογίζεται από τη σχέση: Απόσταση ＝ Ταχύτητα · Χρόνος ＝ ${speed} · ${hours} ＝ ${distance} km.`
      };
    }
  },
  {
    id: 'posa_std_3',
    generate: () => {
      const baseFee = randInt(5, 12); // πάγιο
      const costPerDay = randInt(2, 4);
      const days = randInt(4, 8);
      const total = baseFee + costPerDay * days;
      return {
        text: `Μια υπηρεσία ενοικίασης εξοπλισμού χρεώνει σταθερό πάγιο ποσό ${baseFee} € συν ${costPerDay} € για κάθε ημέρα χρήσης. Ποιο είναι το συνολικό ποσό πληρωμής σε € για ${days} ημέρες ενοικίασης;`,
        correctVal: total,
        correctStr: String(total),
        explanation: `Το σταθερό ποσό είναι ${baseFee} €. Το μεταβλητό ποσό των ημερών είναι ${days} · ${costPerDay} ＝ ${costPerDay * days} €. Το συνολικό ποσό είναι ${baseFee} ＋ ${costPerDay * days} ＝ ${total} €.`
      };
    }
  },
  {
    id: 'posa_std_4',
    generate: () => {
      const perLiterCost = 1.8;
      const liters = randInt(10, 30);
      const totalCost = Number((liters * perLiterCost).toFixed(2));
      return {
        text: `Η τιμή της βενζίνης σε ένα πρατήριο παραμένει σταθερή στα 1,80 € το λίτρο. Πόσα € θα πληρώσει ένας οδηγός που έβαλε στο ρεζερβουάρ του ${liters} l καυσίμου;`,
        correctVal: totalCost,
        correctStr: formatNum(totalCost),
        explanation: `Το κόστος ανά λίτρο είναι σταθερό ποσό (1,80 €/l). Για μεταβλητή ποσότητα ${liters} l, το τελικό ποσό είναι ${liters} · 1,8 ＝ ${formatNum(totalCost)} €.`
      };
    }
  },
  {
    id: 'posa_std_5',
    generate: () => {
      const initialWater = randInt(200, 400); // l (αρχικό απόθεμα)
      const flowOut = randInt(15, 25); // l ανά λεπτό
      const minutes = randInt(5, 10);
      const remain = initialWater - flowOut * minutes;
      return {
        text: `Μια δεξαμενή περιέχει ${initialWater} l νερού. Μια βρύση στο κάτω μέρος αδειάζει σταθερά ${flowOut} l ανά λεπτό. Πόσα l νερού θα παραμείνουν στη δεξαμενή μετά από ${minutes} λεπτά;`,
        correctVal: remain,
        correctStr: String(remain),
        explanation: `Η αρχική ποσότητα είναι ${initialWater} l. Το ποσό νερού που αδειάζει σε ${minutes} λεπτά είναι ${minutes} · ${flowOut} ＝ ${flowOut * minutes} l. Το εναπομείναν ποσό είναι ${initialWater} － ${flowOut * minutes} ＝ ${remain} l.`
      };
    }
  },
  {
    id: 'posa_std_6',
    generate: () => {
      const perKmCost = 0.5;
      const fixedFlag = 3.5; // σημαία ταξί
      const km = randInt(8, 20);
      const total = Number((fixedFlag + km * perKmCost).toFixed(2));
      return {
        text: `Σε μια διαδρομή με ταξί, η σημαία (σταθερή εκκίνηση) κοστίζει 3,50 € και η χρέωση ανά km είναι 0,50 €. Ποιο είναι το συνολικό ποσό χρέωσης σε € για διαδρομή ${km} km;`,
        correctVal: total,
        correctStr: formatNum(total),
        explanation: `Σταθερό ποσό: 3,50 €. Μεταβλητό ποσό διαδρομής: ${km} · 0,5 ＝ ${formatNum(km * perKmCost)} €. Συνολικό ποσό: 3,5 ＋ ${formatNum(km * perKmCost)} ＝ ${formatNum(total)} €.`
      };
    }
  },
  {
    id: 'posa_std_7',
    generate: () => {
      const side = randInt(4, 12);
      const perimeter = 4 * side;
      return {
        text: `Ένα τετράγωνο έχει πλευρά μήκους ${side} cm. Ποια είναι η περίμετρός του σε cm, δεδομένου ότι ο αριθμός των πλευρών είναι σταθερός (4 πλευρές);`,
        correctVal: perimeter,
        correctStr: String(perimeter),
        explanation: `Ο αριθμός των πλευρών είναι σταθερό ποσό (4). Το μήκος πλευράς είναι μεταβλητό ποσό (${side} cm). Η περίμετρος ισούται με 4 · ${side} ＝ ${perimeter} cm.`
      };
    }
  },
  {
    id: 'posa_std_8',
    generate: () => {
      const ratePerHour = randInt(12, 18);
      const hours = randInt(4, 8);
      const earn = ratePerHour * hours;
      return {
        text: `Ένας εργαζόμενος λαμβάνει σταθερό ωρομίσθιο ${ratePerHour} € για κάθε ώρα εργασίας. Πόσα € θα λάβει ως αμοιβή αν εργαστεί για ${hours} ώρες;`,
        correctVal: earn,
        correctStr: String(earn),
        explanation: `Η αμοιβή είναι συσχετισμένο ποσό με τον χρόνο εργασίας: Αμοιβή ＝ ${ratePerHour} · ${hours} ＝ ${earn} €.`
      };
    }
  },
  {
    id: 'posa_std_9',
    generate: () => {
      const weightPerBox = randInt(15, 25); // kg
      const boxes = randInt(5, 12);
      const totalWeight = weightPerBox * boxes;
      return {
        text: `Όλα τα κιβώτια σε μια αποθήκη έχουν το ίδιο σταθερό βάρος των ${weightPerBox} kg. Ποιο είναι το συνολικό βάρος σε kg για ${boxes} τέτοια κιβώτια;`,
        correctVal: totalWeight,
        correctStr: String(totalWeight),
        explanation: `Το συνολικό βάρος προκύπτει πολλαπλασιάζοντας το σταθερό βάρος μονάδας με το μεταβλητό πλήθος των κιβωτίων: ${weightPerBox} · ${boxes} ＝ ${totalWeight} kg.`
      };
    }
  },
  {
    id: 'posa_std_10',
    generate: () => {
      const dailyPages = randInt(15, 30);
      const days = randInt(6, 12);
      const totalPages = dailyPages * days;
      return {
        text: `Ένας μαθητής διαβάζει σταθερά ${dailyPages} σελίδες από ένα βιβλίο κάθε ημέρα. Πόσες σελίδες θα έχει διαβάσει συνολικά μετά από ${days} ημέρες;`,
        correctVal: totalPages,
        correctStr: String(totalPages),
        explanation: `Ο ρυθμός ανάγνωσης είναι σταθερό ποσό (${dailyPages} σελίδες/ημέρα). Για ${days} ημέρες, οι σελίδες είναι ${dailyPages} · ${days} ＝ ${totalPages}.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (10 διαφορετικα προβληματα)
const HARD_PROBLEMS_POOL = [
  {
    id: 'posa_hard_1',
    generate: () => {
      const speed1 = randInt(60, 80);
      const speed2 = speed1 + 20;
      const hours = randInt(2, 4);
      const distDiff = (speed2 - speed1) * hours;
      return {
        text: `Δύο αυτοκίνητα ξεκινούν ταυτόχρονα από την ίδια αφετηρία. Το πρώτο κινείται με σταθερή ταχύτητα ${speed1} km/h και το δεύτερο με σταθερή ταχύτητα ${speed2} km/h. Πόσα km θα απέχουν μεταξύ τους μετά από ${hours} ώρες αν κινούνται προς την ίδια κατεύθυνση;`,
        correctVal: distDiff,
        correctStr: String(distDiff),
        explanation: `Η διαφορά ταχύτητας ανά ώρα είναι σταθερό ποσό: ${speed2} － ${speed1} ＝ ${speed2 - speed1} km/h. Σε χρόνο ${hours} ωρών, η μεταβλητή απόσταση μεταξύ τους είναι ${speed2 - speed1} · ${hours} ＝ ${distDiff} km.`
      };
    }
  },
  {
    id: 'posa_hard_2',
    generate: () => {
      const fixedMonthly = 15; // πάγιο €
      const freeGigs = 5;
      const extraPerGig = 2.5;
      const usedGigs = freeGigs + randInt(2, 6);
      const extraGigs = usedGigs - freeGigs;
      const totalCost = Number((fixedMonthly + extraGigs * extraPerGig).toFixed(2));
      return {
        text: `Ένα πρόγραμμα κινητής τηλεφωνίας έχει σταθερό μηνιαίο πάγιο ${fixedMonthly} € και περιλαμβάνει ${freeGigs} GB δωρεάν δεδομένα. Για κάθε επιπλέον GB χρεώνει ${formatNum(extraPerGig)} €. Πόσα € θα πληρώσει ένας συνδρομητής που κατανάλωσε συνολικά ${usedGigs} GB σε έναν μήνα;`,
        correctVal: totalCost,
        correctStr: formatNum(totalCost),
        explanation: `Τα επιπλέον GB είναι ${usedGigs} － ${freeGigs} ＝ ${extraGigs} GB. Η επιπλέον χρέωση είναι ${extraGigs} · ${formatNum(extraPerGig)} ＝ ${formatNum(extraGigs * extraPerGig)} €. Το τελικό ποσό είναι ${fixedMonthly} ＋ ${formatNum(extraGigs * extraPerGig)} ＝ ${formatNum(totalCost)} €.`
      };
    }
  },
  {
    id: 'posa_hard_3',
    generate: () => {
      const tankCapacity = 600; // l
      const tapIn = 35; // l/min
      const tapOut = 15; // l/min
      const netGain = tapIn - tapOut; // 20 l/min
      const minutes = randInt(10, 25);
      const currentWater = netGain * minutes;
      return {
        text: `Σε μια άδεια δεξαμενή χωρητικότητας ${tankCapacity} l, μια βρύση εισροής ρίχνει ${tapIn} l/min και ταυτόχρονα μια βρύση εκροής χάνει ${tapOut} l/min. Πόσα l νερού θα περιέχει η δεξαμενή μετά από ${minutes} λεπτά ταυτόχρονης λειτουργίας;`,
        correctVal: currentWater,
        correctStr: String(currentWater),
        explanation: `Ο καθαρός ρυθμός μεταβολής του νερού είναι σταθερός: ${tapIn} － ${tapOut} ＝ ${netGain} l ανά λεπτό. Σε χρόνο ${minutes} λεπτών, το συσχετισμένο ποσό νερού στη δεξαμενή είναι ${netGain} · ${minutes} ＝ ${currentWater} l.`
      };
    }
  },
  {
    id: 'posa_hard_4',
    generate: () => {
      const fixedHallCost = 120; // σταθερό κόστος αίθουσας
      const costPerGuest = 14;
      const guests = randInt(25, 40);
      const total = fixedHallCost + guests * costPerGuest;
      return {
        text: `Για μια σχολική εκδήλωση, η ενοικίαση της αίθουσας κοστίζει σταθερά ${fixedHallCost} €, ενώ το κόστος του φαγητού ανέρχεται σε ${costPerGuest} € ανά καλεσμένο. Ποιο είναι το συνολικό κόστος σε € αν παρευρεθούν ${guests} καλεσμένοι;`,
        correctVal: total,
        correctStr: String(total),
        explanation: `Σταθερό ποσό: ${fixedHallCost} €. Μεταβλητό ποσό καλεσμένων: ${guests} · ${costPerGuest} ＝ ${guests * costPerGuest} €. Συνολικό ποσό: ${fixedHallCost} ＋ ${guests * costPerGuest} ＝ ${total} €.`
      };
    }
  },
  {
    id: 'posa_hard_5',
    generate: () => {
      const initialElev = 450; // μέτρα
      const climbPerMin = 15; // m/min
      const minutes = randInt(20, 50);
      const finalElev = initialElev + climbPerMin * minutes;
      return {
        text: `Ένας ορειβάτης βρίσκεται σε υψόμετρο ${initialElev} m και αρχίζει να ανεβαίνει με σταθερό ρυθμό ${climbPerMin} m κάθε λεπτό. Σε ποιο υψόμετρο (σε m) θα βρίσκεται μετά από ${minutes} λεπτά ανάβασης;`,
        correctVal: finalElev,
        correctStr: String(finalElev),
        explanation: `Το αρχικό υψόμετρο είναι ${initialElev} m. Η μεταβολή του υψομέτρου σε ${minutes} λεπτά είναι ${climbPerMin} · ${minutes} ＝ ${climbPerMin * minutes} m. Το τελικό υψόμετρο είναι ${initialElev} ＋ ${climbPerMin * minutes} ＝ ${finalElev} m.`
      };
    }
  },
  {
    id: 'posa_hard_6',
    generate: () => {
      const baseSalary = 800; // σταθερός βασικός μισθός
      const commPerSale = 25; // προμήθεια ανά πώληση
      const sales = randInt(10, 25);
      const finalSalary = baseSalary + commPerSale * sales;
      return {
        text: `Ένας πωλητής λαμβάνει σταθερό μηνιαίο μισθό ${baseSalary} € και επιπλέον μεταβλητή προμήθεια ${commPerSale} € για κάθε συσκευή που πουλάει. Ποιο είναι το συνολικό ποσό αμοιβής του σε € για έναν μήνα κατά τον οποίο πραγματοποίησε ${sales} πωλήσεις;`,
        correctVal: finalSalary,
        correctStr: String(finalSalary),
        explanation: `Σταθερό ποσό μισθού: ${baseSalary} €. Μεταβλητό ποσό προμηθειών: ${sales} · ${commPerSale} ＝ ${sales * commPerSale} €. Τελική αμοιβή: ${baseSalary} ＋ ${sales * commPerSale} ＝ ${finalSalary} €.`
      };
    }
  },
  {
    id: 'posa_hard_7',
    generate: () => {
      const tempMorning = -2; // °C
      const risePerHour = 1.5; // °C ανά ώρα
      const hours = randInt(4, 8);
      const finalTemp = Number((tempMorning + risePerHour * hours).toFixed(1));
      return {
        text: `Στις 6:00 το πρωί η θερμοκρασία σε μια πόλη ήταν ${tempMorning} °C. Αν η θερμοκρασία ανέβαινε με σταθερό ρυθμό 1,5 °C κάθε ώρα, ποια ήταν η θερμοκρασία σε °C μετά από ${hours} ώρες;`,
        correctVal: finalTemp,
        correctStr: formatNum(finalTemp),
        explanation: `Η άνοδος της θερμοκρασίας σε ${hours} ώρες είναι ${hours} · 1,5 ＝ ${formatNum(hours * risePerHour)} °C. Η τελική θερμοκρασία είναι ${tempMorning} ＋ ${formatNum(hours * risePerHour)} ＝ ${formatNum(finalTemp)} °C.`
      };
    }
  },
  {
    id: 'posa_hard_8',
    generate: () => {
      const fixedWeightCart = 120; // kg άδειο καρότσι
      const bagWeight = 25; // kg ανά σακί
      const bags = randInt(10, 20);
      const totalWeight = fixedWeightCart + bags * bagWeight;
      return {
        text: `Ένα άδειο τρέιλερ έχει σταθερό απόβαρο ${fixedWeightCart} kg. Αν φορτώσουμε σε αυτό ${bags} σακιά τσιμέντου βάρους ${bagWeight} kg το καθένα, ποιο θα είναι το συνολικό μεικτό βάρος σε kg;`,
        correctVal: totalWeight,
        correctStr: String(totalWeight),
        explanation: `Το σταθερό ποσό (απόβαρο) είναι ${fixedWeightCart} kg. Το μεταβλητό βάρος του φορτίου είναι ${bags} · ${bagWeight} ＝ ${bags * bagWeight} kg. Συνολικό βάρος: ${fixedWeightCart} ＋ ${bags * bagWeight} ＝ ${totalWeight} kg.`
      };
    }
  },
  {
    id: 'posa_hard_9',
    generate: () => {
      const priceA = 12; // € ανά τεμάχιο
      const priceB = 18; // € ανά τεμάχιο
      const countA = randInt(3, 6);
      const countB = randInt(2, 5);
      const total = countA * priceA + countB * priceB;
      return {
        text: `Ένας έμπορος αγοράζει ${countA} πουκάμισα προς σταθερή τιμή ${priceA} € το ένα και ${countB} παντελόνια προς σταθερή τιμή ${priceB} € το ένα. Ποιο είναι το συνολικό ποσό σε € που πλήρωσε;`,
        correctVal: total,
        correctStr: String(total),
        explanation: `Κόστος πουκαμίσων: ${countA} · ${priceA} ＝ ${countA * priceA} €. Κόστος παντελονιών: ${countB} · ${priceB} ＝ ${countB * priceB} €. Συνολικό ποσό: ${countA * priceA} ＋ ${countB * priceB} ＝ ${total} €.`
      };
    }
  },
  {
    id: 'posa_hard_10',
    generate: () => {
      const batteryStart = 100; // %
      const drainPerHour = randInt(8, 14); // % ανά ώρα
      const hours = randInt(4, 7);
      const batteryLeft = batteryStart - drainPerHour * hours;
      return {
        text: `Ένα smartphone είναι πλήρως φορτισμένο στο 100 %. Κατά τη διάρκεια συνεχούς χρήσης, η μπαταρία μειώνεται με σταθερό ρυθμό ${drainPerHour} % ανά ώρα. Ποιο είναι το ποσοστό (%) της μπαταρίας που απομένει μετά από ${hours} ώρες;`,
        correctVal: batteryLeft,
        correctStr: String(batteryLeft),
        explanation: `Το ποσό αποφόρτισης σε ${hours} ώρες είναι ${hours} · ${drainPerHour} ＝ ${drainPerHour * hours} %. Το ποσοστό που απομένει είναι 100 － ${drainPerHour * hours} ＝ ${batteryLeft} %.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Υπολογισμός εξαρτημένου μεταβλητού ποσού
  {
    const rate = randInt(3, 8); // σταθερό ποσό (€/kg)
    const kg = randInt(4, 9);
    const total = rate * kg;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΥΠΟΛΟΓΙΣΜΟΣ ΜΕΤΑΒΛΗΤΟΥ ΠΟΣΟΥ',
      instruction: 'Υπολογίστε το τελικό ποσό:',
      prompt: `Σε ένα μανάβικο η τιμή των πορτοκαλιών είναι σταθερή στα ${rate} € το κιλό. Ποιο είναι το συνολικό κόστος σε € για την αγορά ${kg} kg πορτοκαλιών;`,
      correctVal: total,
      correctStr: String(total),
      explanation: `Το κόστος ανά κιλό (${rate} €) είναι σταθερό ποσό. Το συνολικό κόστος εξαρτάται από τα κιλά: ${rate} · ${kg} ＝ ${total} €.`
    });
  }

  // Q2 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE / ΑΠΟΣΙΩΠΗΤΙΚΑ
  {
    const correctOption = 'Ο αριθμός των ημερών του μήνα Απριλίου (30 ημέρες)';
    const options = [
      { text: correctOption, isCorrect: true },
      { text: 'Η ημερήσια θερμοκρασία σε μια πόλη', isCorrect: false },
      { text: 'Το βάρος ενός μαθητή κατά τη διάρκεια του έτους', isCorrect: false },
      { text: 'Η ταχύτητα ενός αυτοκινήτου μέσα στην κίνηση της πόλης', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΑΝΑΓΝΩΡΙΣΗ ΣΤΑΘΕΡΟΥ ΠΟΣΟΥ',
      instruction: 'Επιλέξτε ποιο από τα παρακάτω μεγέθη αποτελεί σταθερό ποσό:',
      prompt: `Ποιο από τα παρακάτω ποσά παραμένει πάντοτε σταθερό;`,
      options,
      correctText: correctOption,
      explanation: `Ο Απρίλιος έχει πάντοτε σταθερά 30 ημέρες, επομένως το μέγεθος αυτό είναι σταθερό ποσό. Αντίθετα, η θερμοκρασία, το βάρος και η ταχύτητα στην πόλη μεταβάλλονται συνεχώς.`
    });
  }

  // Q3 (Input - Decimal): Εύρεση του σταθερού ποσού (τιμή μονάδας)
  {
    const count = randInt(4, 8);
    const unitPrice = randInt(3, 6);
    const total = count * unitPrice;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΕΥΡΕΣΗ ΣΤΑΘΕΡΟΥ ΠΟΣΟΥ',
      instruction: 'Υπολογίστε τη σταθερή τιμή μονάδας:',
      prompt: `Αν για ${count} ίδια τετράδια πληρώσαμε συνολικά ${total} €, ποιο είναι το σταθερό ποσό σε € που κοστίζει το κάθε τετράδιο;`,
      correctVal: unitPrice,
      correctStr: String(unitPrice),
      explanation: `Διαιρούμε το συνολικό μεταβλητό κόστος με το πλήθος των τετραδίων: ${total} : ${count} ＝ ${unitPrice} € ανά τετράδιο (σταθερό ποσό μονάδας).`
    });
  }

  // Q4 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE / ΑΠΟΣΙΩΠΗΤΙΚΑ
  {
    const correctAns = 'Κάθε μέγεθος που μπορεί να μετρηθεί και εκφράζεται με αριθμό και μονάδα μέτρησης';
    const options = [
      { text: correctAns, isCorrect: true },
      { text: 'Οποιοσδήποτε αφηρημένος ακέραιος αριθμός χωρίς μονάδα μέτρησης', isCorrect: false },
      { text: 'Μόνο τα χρήματα που πληρώνουμε σε μια αγορά', isCorrect: false },
      { text: 'Μόνο οι αριθμοί που παραμένουν πάντοτε σταθεροί', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΕΝΝΟΙΑ ΤΟΥ ΠΟΣΟΥ',
      instruction: 'Επιλέξτε τον ακριβή ορισμό του ποσού στα Μαθηματικά:',
      prompt: `Τι ονομάζεται ποσό;`,
      options,
      correctText: correctAns,
      explanation: `Στα Μαθηματικά ποσό ονομάζεται κάθε μέγεθος που μετριέται ή υπολογίζεται και εκφράζεται με έναν αριθμό μαζί με την κατάλληλη μονάδα μέτρησης (π.χ. 5 kg, 12 m, 20 €).`
    });
  }

  // Q5 (Input - Decimal): Υπολογισμός διανυόμενης απόστασης
  {
    const speed = randInt(70, 100); // km/h
    const time = randInt(2, 4);
    const dist = speed * time;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΣΥΣΧΕΤΙΣΜΕΝΑ ΠΟΣΑ ΣΤΗΝ ΚΙΝΗΣΗ',
      instruction: 'Υπολογίστε την απόσταση:',
      prompt: `Ένα αυτοκίνητο ταξιδεύει με σταθερή ταχύτητα ${speed} km/h. Πόσα km θα διανύσει σε χρόνο ${time} ωρών;`,
      correctVal: dist,
      correctStr: String(dist),
      explanation: `Η διανυόμενη απόσταση είναι συσχετισμένο ποσό με τον χρόνο: Απόσταση ＝ Ταχύτητα · Χρόνος ＝ ${speed} · ${time} ＝ ${dist} km.`
    });
  }

  // Q6 (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE / ΑΠΟΣΙΩΠΗΤΙΚΑ
  {
    const correctOpt = 'Το βάρος ενός μαθητή';
    const options = [
      { text: correctOpt, isCorrect: true },
      { text: 'Ο αριθμός των μηνών του έτους (12 μήνες)', isCorrect: false },
      { text: 'Ο αριθμός των γραμμαρίων σε 1 κιλό (1.000 g)', isCorrect: false },
      { text: 'Ο αριθμός των πλευρών ενός τριγώνου (3 πλευρές)', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΑΝΑΓΝΩΡΙΣΗ ΜΕΤΑΒΛΗΤΟΥ ΠΟΣΟΥ',
      instruction: 'Επιλέξτε ποιο από τα παρακάτω μεγέθη είναι μεταβλητό ποσό:',
      prompt: `Ποιο από τα παρακάτω μεγέθη αλλάζει τιμή και είναι μεταβλητό ποσό;`,
      options,
      correctText: correctOpt,
      explanation: `Το βάρος ενός ανθρώπου μεταβάλλεται στο πέρασμα του χρόνου. Αντίθετα, οι μήνες του έτους (12), τα γραμμάρια του κιλού (1.000) και οι πλευρές του τριγώνου (3) είναι σταθερά ποσά.`
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
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΟΒΛΗΜΑ ΣΥΣΧΕΤΙΣΜΕΝΩΝ ΠΟΣΩΝ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: stdProb1.text,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal;
    const fake8A = typeof val8 === 'number' ? val8 + randInt(4, 10) : '0';
    const fake8B = typeof val8 === 'number' ? Math.max(1, val8 - randInt(3, 8)) : '0';
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
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΗΣ ΕΦΑΡΜΟΓΗΣ',
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
      instruction: 'Υπολογίστε με ακρίβεια και εισαγάγετε το αποτέλεσμα:',
      prompt: hardProb1.text,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal;
    const fake10A = formatNum(val10 + randInt(5, 15));
    const fake10B = formatNum(Math.max(1, val10 - randInt(4, 10)));
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
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΣΤΑΘΕΡΩΝ & ΜΕΤΑΒΛΗΤΩΝ ΠΟΣΩΝ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      options: optionsQ10,
      correctText: hardProb2.correctStr,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function PosaExercisesPage() {
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
      title="Ασκήσεις: Ποσά (Σταθερά & Μεταβλητά) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στη διάκριση σταθερών και μεταβλητών ποσών, συσχετισμένα ποσά και υπολογισμούς για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/43-posa"
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ασκήσεις: Σταθερά &amp; Μεταβλητά Ποσά
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές ασκήσεις με 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Διακρίνετε τα σταθερά από τα μεταβλητά ποσά και υπολογίστε τις συσχετισμένες τιμές.
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
                  
                  {/* Decimal / Single Input */}
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

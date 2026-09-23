// pages/st-dimotikou/50-pososta-ask.js
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

// Δεξαμενη Κανονικων Προβληματων Ποσοστων (10 διαφορετικα προβληματα)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'pos_std_1',
    generate: () => {
      const totalStudents = pickRandom([20, 25, 50]);
      const boys = randInt(Math.floor(totalStudents * 0.3), Math.floor(totalStudents * 0.7));
      const mult = 100 / totalStudents;
      const pctBoys = boys * mult;
      return {
        text: `Σε ένα σχολικό τμήμα φοιτούν συνολικά ${totalStudents} μαθητές, εκ των οποίων τα ${boys} είναι αγόρια. Τι ποσοστό (%) των μαθητών του τμήματος είναι αγόρια;`,
        fraction: { num: boys, den: totalStudents },
        correctVal: pctBoys,
        correctStr: String(pctBoys),
        explanation: `Σχηματίζουμε το κλάσμα των αγοριών ως προς το σύνολο: ${boys}/${totalStudents}. Για να γίνει ο παρονομαστής 100, πολλαπλασιάζουμε με το ${mult}: (${boys} · ${mult}) / (${totalStudents} · ${mult}) ＝ ${pctBoys}/100, δηλαδή ${pctBoys} %.`
      };
    }
  },
  {
    id: 'pos_std_2',
    generate: () => {
      const totalPages = pickRandom([50, 100, 200, 250]);
      const readPages = Math.floor(totalPages * pickRandom([0.2, 0.4, 0.6, 0.75]));
      const pct = (readPages / totalPages) * 100;
      return {
        text: `Ένα βιβλίο έχει συνολικά ${totalPages} σελίδες. Μια μαθήτρια έχει διαβάσει ${readPages} σελίδες. Τι ποσοστό (%) του βιβλίου έχει διαβάσει;`,
        fraction: { num: readPages, den: totalPages },
        correctVal: pct,
        correctStr: String(pct),
        explanation: `Ο λόγος των σελίδων είναι ${readPages}/${totalPages}. Διαιρώντας βρίσκουμε ${readPages} : ${totalPages} ＝ ${formatNum(readPages / totalPages)}. Πολλαπλασιάζοντας με το 100 βρίσκουμε το ποσοστό: ${pct} %.`
      };
    }
  },
  {
    id: 'pos_std_3',
    generate: () => {
      const totalFreeThrows = pickRandom([20, 25, 50]);
      const successful = randInt(Math.floor(totalFreeThrows * 0.5), totalFreeThrows - 2);
      const mult = 100 / totalFreeThrows;
      const pct = successful * mult;
      return {
        text: `Ένας μπασκετμπολίστας εκτέλεσε ${totalFreeThrows} ελεύθερες βολές και ευστόχησε στις ${successful}. Ποιο είναι το ποσοστό ευστοχίας του στα εκατό (%);`,
        fraction: { num: successful, den: totalFreeThrows },
        correctVal: pct,
        correctStr: String(pct),
        explanation: `Το κλάσμα ευστοχίας είναι ${successful}/${totalFreeThrows}. Μετατρέπουμε σε ισοδύναμο με παρονομαστή 100: (${successful} · ${mult}) / (${totalFreeThrows} · ${mult}) ＝ ${pct}/100 ＝ ${pct} %.`
      };
    }
  },
  {
    id: 'pos_std_4',
    generate: () => {
      const totalApples = pickRandom([20, 25, 50]);
      const spoiled = randInt(1, 4);
      const goodApples = totalApples - spoiled;
      const mult = 100 / totalApples;
      const pctGood = goodApples * mult;
      return {
        text: `Σε ένα κιβώτιο με ${totalApples} μήλα, τα ${spoiled} ήταν χαλασμένα. Τι ποσοστό (%) των μήλων του κιβωτίου ήταν κατάλληλα για κατανάλωση;`,
        fraction: { num: goodApples, den: totalApples },
        correctVal: pctGood,
        correctStr: String(pctGood),
        explanation: `Τα κατάλληλα μήλα είναι ${totalApples} － ${spoiled} ＝ ${goodApples}. Το κλάσμα είναι ${goodApples}/${totalApples}. Πολλαπλασιάζουμε με το ${mult}: (${goodApples} · ${mult}) / 100 ＝ ${pctGood}/100 ＝ ${pctGood} %.`
      };
    }
  },
  {
    id: 'pos_std_5',
    generate: () => {
      const totalHours = 24;
      const sleepHours = 8;
      const pct = Number(((sleepHours / totalHours) * 100).toFixed(1)); // 33.3%
      const multExact = 4;
      const fractionNum = 1;
      const fractionDen = 4; // 6 hours out of 24 = 25%
      return {
        text: `Αν ένα παιδί κοιμάται 6 ώρες το εικοσιτετράωρο (6/24 της ημέρας), τι ποσοστό (%) της ημέρας περνάει στον ύπνο;`,
        fraction: { num: 6, den: 24 },
        correctVal: 25,
        correctStr: '25',
        explanation: `Απλοποιούμε το κλάσμα 6/24 διαιρώντας με το 6: 6/24 ＝ 1/4. Μετατρέπουμε σε ισοδύναμο με παρονομαστή 100: (1 · 25) / (4 · 25) ＝ 25/100 ＝ 25 %.`
      };
    }
  },
  {
    id: 'pos_std_6',
    generate: () => {
      const totalMatches = pickRandom([20, 25, 50]);
      const wins = randInt(Math.floor(totalMatches * 0.4), Math.floor(totalMatches * 0.8));
      const mult = 100 / totalMatches;
      const pctWins = wins * mult;
      return {
        text: `Μια ομάδα ποδοσφαίρου έδωσε ${totalMatches} αγώνες και κέρδισε τους ${wins}. Ποιο είναι το ποσοστό νικών της (%);`,
        fraction: { num: wins, den: totalMatches },
        correctVal: pctWins,
        correctStr: String(pctWins),
        explanation: `Το κλάσμα νικών είναι ${wins}/${totalMatches}. Πολλαπλασιάζουμε με το ${mult} ώστε να γίνει ο παρονομαστής 100: ${pctWins}/100, δηλαδή ${pctWins} %.`
      };
    }
  },
  {
    id: 'pos_std_7',
    generate: () => {
      const totalTrees = pickRandom([25, 50, 100]);
      const oliveTrees = Math.floor(totalTrees * pickRandom([0.36, 0.44, 0.6, 0.72]));
      const mult = 100 / totalTrees;
      const pctOlive = oliveTrees * mult;
      return {
        text: `Σε έναν οπωρώνα με ${totalTrees} δέντρα, τα ${oliveTrees} είναι ελαιόδεντρα. Τι ποσοστό (%) των δέντρων είναι ελιές;`,
        fraction: { num: oliveTrees, den: totalTrees },
        correctVal: pctOlive,
        correctStr: String(pctOlive),
        explanation: `Ο λόγος είναι ${oliveTrees}/${totalTrees}. Μετατρέποντας σε εκατοστιαίο κλάσμα: (${oliveTrees} · ${mult}) / 100 ＝ ${pctOlive}/100 ＝ ${pctOlive} %.`
      };
    }
  },
  {
    id: 'pos_std_8',
    generate: () => {
      const capacity = pickRandom([20, 50, 100]); // λίτρα
      const filled = Math.floor(capacity * pickRandom([0.35, 0.65, 0.85]));
      const mult = 100 / capacity;
      const pctFilled = filled * mult;
      return {
        text: `Ένα βαρέλι χωρητικότητας ${capacity} l περιέχει ${filled} l λάδι. Τι ποσοστό (%) της συνολικής χωρητικότητας είναι γεμάτο;`,
        fraction: { num: filled, den: capacity },
        correctVal: pctFilled,
        correctStr: String(pctFilled),
        explanation: `Το κλάσμα πληρότητας είναι ${filled}/${capacity}. Πολλαπλασιάζουμε με το ${mult}: ${pctFilled}/100 ＝ ${pctFilled} %.`
      };
    }
  },
  {
    id: 'pos_std_9',
    generate: () => {
      const totalQuestions = pickRandom([20, 25, 50]);
      const correctQ = totalQuestions - randInt(2, 5);
      const mult = 100 / totalQuestions;
      const pctSuccess = correctQ * mult;
      return {
        text: `Σε ένα διαγώνισμα με ${totalQuestions} ερωτήσεις, ένας μαθητής απάντησε σωστά στις ${correctQ}. Ποιο είναι το ποσοστό επιτυχίας του (%);`,
        fraction: { num: correctQ, den: totalQuestions },
        correctVal: pctSuccess,
        correctStr: String(pctSuccess),
        explanation: `Το ποσοστό σωστών απαντήσεων προκύπτει από το κλάσμα ${correctQ}/${totalQuestions}: (${correctQ} · ${mult}) / 100 ＝ ${pctSuccess}/100 ＝ ${pctSuccess} %.`
      };
    }
  },
  {
    id: 'pos_std_10',
    generate: () => {
      const totalKm = pickRandom([20, 25, 50, 100]);
      const pavedKm = Math.floor(totalKm * pickRandom([0.48, 0.64, 0.8]));
      const mult = 100 / totalKm;
      const pctPaved = pavedKm * mult;
      return {
        text: `Από έναν δρόμο μήκους ${totalKm} km έχουν ασφαλτοστρωθεί τα ${pavedKm} km. Τι ποσοστό (%) του έργου έχει ασφαλτοστρωθεί;`,
        fraction: { num: pavedKm, den: totalKm },
        correctVal: pctPaved,
        correctStr: String(pctPaved),
        explanation: `Το ποσοστό του έργου είναι ${pavedKm}/${totalKm} ＝ (${pavedKm} · ${mult}) / 100 ＝ ${pctPaved} %.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (10 διαφορετικα προβληματα)
const HARD_PROBLEMS_POOL = [
  {
    id: 'pos_hard_1',
    generate: () => {
      const totalVotes = 400;
      const votesA = 180;
      const votesB = 140;
      const votesC = totalVotes - votesA - votesB; // 80
      const pctC = (votesC / totalVotes) * 100; // 20%
      return {
        text: `Στις εκλογές για το μαθητικό συμβούλιο ψήφισαν ${totalVotes} μαθητές. Ο πρώτος υποψήφιος έλαβε ${votesA} ψήφους και ο δεύτερος ${votesB} ψήφους. Τι ποσοστό (%) των ψήφων έλαβε ο τρίτος υποψήφιος;`,
        correctVal: pctC,
        correctStr: String(pctC),
        explanation: `Ο τρίτος υποψήφιος έλαβε: ${totalVotes} － (${votesA} ＋ ${votesB}) ＝ ${totalVotes} － ${votesA + votesB} ＝ ${votesC} ψήφους. Το ποσοστό του είναι: ${votesC}/${totalVotes} ＝ (${votesC} : 4) / (${totalVotes} : 4) ＝ ${pctC}/100 ＝ ${pctC} %.`
      };
    }
  },
  {
    id: 'pos_hard_2',
    generate: () => {
      const totalWeightKg = 2.5; // 2500 g
      const sugarGrams = 750;
      const totalGrams = totalWeightKg * 1000; // 2500
      const pctSugar = (sugarGrams / totalGrams) * 100; // 30%
      return {
        text: `Σε ένα γλυκό συνολικού βάρους ${formatNum(totalWeightKg)} kg χρησιμοποιήθηκαν ${sugarGrams} g ζάχαρης. Τι ποσοστό (%) του συνολικού βάρους του γλυκού αποτελεί η ζάχαρη;`,
        correctVal: pctSugar,
        correctStr: String(pctSugar),
        explanation: `Μετατρέπουμε πρώτα τα ${formatNum(totalWeightKg)} kg σε γραμμάρια: ${totalGrams} g. Σχηματίζουμε το κλάσμα: ${sugarGrams}/${totalGrams}. Απλοποιούμε διαιρώντας με το 25: ${sugarGrams / 25} / 100 ＝ ${pctSugar}/100 ＝ ${pctSugar} %.`
      };
    }
  },
  {
    id: 'pos_hard_3',
    generate: () => {
      const totalIncome = 1500;
      const rent = 450; // 30%
      const food = 600; // 40%
      const savings = totalIncome - rent - food; // 450 -> 30%
      const pctSavings = (savings / totalIncome) * 100;
      return {
        text: `Μια οικογένεια με μηνιαίο εισόδημα ${totalIncome} € ξοδεύει ${rent} € για ενοίκιο και ${food} € για διατροφή, ενώ τα υπόλοιπα τα αποταμιεύει. Τι ποσοστό (%) του εισοδήματος αποταμιεύεται κάθε μήνα;`,
        correctVal: pctSavings,
        correctStr: String(pctSavings),
        explanation: `Τα χρήματα που αποταμιεύονται είναι: ${totalIncome} － (${rent} ＋ ${food}) ＝ ${totalIncome} － ${rent + food} ＝ ${savings} €. Το ποσοστό αποταμίευσης είναι: ${savings}/${totalIncome} ＝ (${savings} : 15) / (${totalIncome} : 15) ＝ ${pctSavings}/100 ＝ ${pctSavings} %.`
      };
    }
  },
  {
    id: 'pos_hard_4',
    generate: () => {
      const totalArea = 800; // m2
      const houseArea = 200; // 25%
      const gardenArea = 440; // 55%
      const poolArea = totalArea - houseArea - gardenArea; // 160 m2 -> 20%
      const pctPool = (poolArea / totalArea) * 100;
      return {
        text: `Σε ένα οικόπεδο εμβαδού ${totalArea} m², το σπίτι καταλαμβάνει ${houseArea} m² και ο κήπος ${gardenArea} m². Το υπόλοιπο μέρος του οικοπέδου καλύπτεται από πισίνα. Τι ποσοστό (%) του οικοπέδου καταλαμβάνει η πισίνα;`,
        correctVal: pctPool,
        correctStr: String(pctPool),
        explanation: `Η πισίνα καταλαμβάνει: ${totalArea} － (${houseArea} ＋ ${gardenArea}) ＝ ${poolArea} m². Το ποσοστό είναι: ${poolArea}/${totalArea} ＝ (${poolArea} : 8) / (${totalArea} : 8) ＝ ${pctPool}/100 ＝ ${pctPool} %.`
      };
    }
  },
  {
    id: 'pos_hard_5',
    generate: () => {
      const totalWater = 1200; // ml
      const syrupMl = 180;
      const pctSyrup = (syrupMl / totalWater) * 100; // 15%
      return {
        text: `Για την παρασκευή αναψυκτικού αναμειγνύονται ${syrupMl} ml σιρόπι με νερό, ώστε να προκύψει τελικό μείγμα ${totalWater} ml. Ποια είναι η περιεκτικότητα του μείγματος σε σιρόπι στα εκατό (%);`,
        correctVal: pctSyrup,
        correctStr: String(pctSyrup),
        explanation: `Το κλάσμα περιεκτικότητας είναι ${syrupMl}/${totalWater}. Διαιρούμε αριθμητή και παρονομαστή με το 12: (${syrupMl} : 12) / (${totalWater} : 12) ＝ ${pctSyrup}/100 ＝ ${pctSyrup} %.`
      };
    }
  },
  {
    id: 'pos_hard_6',
    generate: () => {
      const origPrice = 120;
      const discountEur = 36;
      const pctDisc = (discountEur / origPrice) * 100; // 30%
      return {
        text: `Ένα ζευγάρι αθλητικά παπούτσια είχε αρχική τιμή ${origPrice} € και πωλήθηκε με έκπτωση ${discountEur} €. Ποιο ήταν το ποσοστό (%) της έκπτωσης που έγινε;`,
        correctVal: pctDisc,
        correctStr: String(pctDisc),
        explanation: `Ο λόγος της έκπτωσης προς την αρχική τιμή είναι ${discountEur}/${origPrice}. Απλοποιούμε διαιρώντας με το 12: 3/10. Μετατρέπουμε σε παρονομαστή 100: (3 · 10) / 100 ＝ ${pctDisc}/100 ＝ ${pctDisc} %.`
      };
    }
  },
  {
    id: 'pos_hard_7',
    generate: () => {
      const totalGoldGrams = 50;
      const pureGoldGrams = 37.5;
      const pctPure = (pureGoldGrams / totalGoldGrams) * 100; // 75%
      return {
        text: `Σε ένα χρυσό κόσμημα συνολικού βάρους ${totalGoldGrams} g περιέχονται ${formatNum(pureGoldGrams)} g καθαρού χρυσού. Ποια είναι η περιεκτικότητα του κοσμήματος σε καθαρό χρυσό στα εκατό (%);`,
        correctVal: pctPure,
        correctStr: String(pctPure),
        explanation: `Το κλάσμα καθαρού χρυσού είναι ${formatNum(pureGoldGrams)}/${totalGoldGrams}. Για να γίνει ο παρονομαστής 100, πολλαπλασιάζουμε με το 2: (${formatNum(pureGoldGrams)} · 2) / (${totalGoldGrams} · 2) ＝ ${pctPure}/100 ＝ ${pctPure} %.`
      };
    }
  },
  {
    id: 'pos_hard_8',
    generate: () => {
      const initialPop = 500;
      const increase = 65;
      const pctIncrease = (increase / initialPop) * 100; // 13%
      return {
        text: `Σε ένα χωριό με αρχικό πληθυσμό ${initialPop} κατοίκων εγκαταστάθηκαν επιπλέον ${increase} νέοι κάτοικοι. Ποιο είναι το ποσοστό αύξησης (%) του πληθυσμού του χωριού;`,
        correctVal: pctIncrease,
        correctStr: String(pctIncrease),
        explanation: `Ο λόγος της αύξησης προς τον αρχικό πληθυσμό είναι ${increase}/${initialPop}. Διαιρούμε με το 5 για να γίνει ο παρονομαστής 100: (${increase} : 5) / (${initialPop} : 5) ＝ ${pctIncrease}/100 ＝ ${pctIncrease} %.`
      };
    }
  },
  {
    id: 'pos_hard_9',
    generate: () => {
      const hoursDay = 24;
      const workHours = 8;
      const schoolMin = 360; // 6 hours = 360 min
      const schoolHours = schoolMin / 60; // 6 hours
      const combinedHours = workHours + schoolHours; // 14 hours
      const pctCombined = Number(((combinedHours / hoursDay) * 100).toFixed(1)); // 58.3%
      const cleanHours = 12; // 50%
      return {
        text: `Ένας εργαζόμενος φοιτητής αφιερώνει καθημερινά 7 ώρες στην εργασία του και 5 ώρες στη σχολή του (σύνολο 12 ώρες). Τι ποσοστό (%) του 24ώρου καταλαμβάνουν αυτές οι δύο δραστηριότητες μαζί;`,
        correctVal: 50,
        correctStr: '50',
        explanation: `Συνολικές ώρες: 7 ＋ 5 ＝ 12 ώρες από τις 24. Το κλάσμα είναι 12/24 ＝ 1/2. Σε εκατοστιαίο κλάσμα: (1 · 50) / (2 · 50) ＝ 50/100 ＝ 50 %.`
      };
    }
  },
  {
    id: 'pos_hard_10',
    generate: () => {
      const batteryCapacity = 4000; // mAh
      const usedMah = 1400;
      const remMah = batteryCapacity - usedMah; // 2600 mAh -> 65%
      const pctRem = (remMah / batteryCapacity) * 100;
      return {
        text: `Η μπαταρία ενός κινητού τηλεφώνου έχει χωρητικότητα ${batteryCapacity} mAh. Μετά από μερική χρήση έχουν καταναλωθεί ${usedMah} mAh. Τι ποσοστό (%) της μπαταρίας απομένει;`,
        correctVal: pctRem,
        correctStr: String(pctRem),
        explanation: `Η ενέργεια που απομένει είναι: ${batteryCapacity} － ${usedMah} ＝ ${remMah} mAh. Το ποσοστό που απομένει είναι: ${remMah}/${batteryCapacity} ＝ (${remMah} : 40) / (${batteryCapacity} : 40) ＝ ${pctRem}/100 ＝ ${pctRem} %.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Μετατροπή κλάσματος σε ποσοστό (φιλικός παρονομαστής)
  {
    const preset = pickRandom([
      { num: 1, den: 4, pct: 25 },
      { num: 3, den: 4, pct: 75 },
      { num: 2, den: 5, pct: 40 },
      { num: 4, den: 5, pct: 80 },
      { num: 7, den: 10, pct: 70 },
      { num: 9, den: 20, pct: 45 },
      { num: 11, den: 25, pct: 44 },
      { num: 23, den: 50, pct: 46 }
    ]);

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΜΕΤΑΤΡΟΠΗ ΚΛΑΣΜΑΤΟΣ ΣΕ ΠΟΣΟΣΤΟ',
      instruction: 'Μετατρέψτε το κλάσμα σε ποσοστό στα εκατό (%):',
      prompt: `Ποιο ποσοστό στα εκατό (%) αντιστοιχεί στο κλάσμα ${preset.num}/${preset.den};`,
      fractionDisplay: { num: preset.num, den: preset.den },
      correctVal: preset.pct,
      correctStr: String(preset.pct),
      explanation: `Πολλαπλασιάζουμε αριθμητή και παρονομαστή με το ${100 / preset.den} ώστε ο παρονομαστής να γίνει 100: (${preset.num} · ${100 / preset.den}) / (${preset.den} · ${100 / preset.den}) ＝ ${preset.pct}/100 ＝ ${preset.pct} %.`
    });
  }

  // Q2 (MCQ): Μετατροπή δεκαδικού αριθμού σε ποσοστό
  {
    const dec = pickRandom([0.35, 0.42, 0.08, 0.65, 0.75, 0.9, 0.04]);
    const correctPct = Number((dec * 100).toFixed(0));
    const fake1 = correctPct / 10;
    const fake2 = correctPct * 10;
    const fake3 = correctPct + 5;

    const options = [
      { text: `${correctPct} %`, isCorrect: true },
      { text: `${fake1} %`, isCorrect: false },
      { text: `${fake2} %`, isCorrect: false },
      { text: `${fake3} %`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΔΕΚΑΔΙΚΟΣ ΣΕ ΠΟΣΟΣΤΟ',
      instruction: 'Επιλέξτε το σωστό ποσοστό (%):',
      prompt: `Ποιο ποσοστό αντιστοιχεί στον δεκαδικό αριθμό ${formatNum(dec)};`,
      options,
      correctText: `${correctPct} %`,
      explanation: `Για να μετατρέψουμε έναν δεκαδικό αριθμό σε ποσοστό στα εκατό, τον πολλαπλασιάζουμε με το 100: ${formatNum(dec)} · 100 ＝ ${correctPct} %.`
    });
  }

  // Q3 (Input - Decimal): Συμπλήρωση αριθμητή σε ισοδύναμο κλάσμα με παρονομαστή 100
  {
    const baseDen = pickRandom([2, 4, 5, 10, 20, 25, 50]);
    const maxNum = baseDen - 1;
    const baseNum = randInt(1, maxNum);
    const mult = 100 / baseDen;
    const targetNum = baseNum * mult;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΙΣΟΔΥΝΑΜΟ ΚΛΑΣΜΑ ΜΕ ΠΑΡΟΝΟΜΑΣΤΗ 100',
      instruction: 'Βρείτε τον άγνωστο αριθμητή χ:',
      prompt: `Στην ισότητα κλασμάτων ${baseNum}/${baseDen} ＝ χ/100, ποια είναι η τιμή του χ;`,
      fractionDisplay: { num: baseNum, den: baseDen, targetNum: 'χ', targetDen: 100 },
      correctVal: targetNum,
      correctStr: String(targetNum),
      explanation: `Επειδή 100 : ${baseDen} ＝ ${mult}, πολλαπλασιάζουμε και τον αριθμητή με το ${mult}: χ ＝ ${baseNum} · ${mult} ＝ ${targetNum}.`
    });
  }

  // Q4 (MCQ): Τι εκφράζει το σύμβολο %
  {
    const correctConcept = 'Έναν λόγο με βάση αναφοράς τα 100 ίσα μέρη (παρονομαστή το 100)';
    const fake1 = 'Έναν οποιονδήποτε δεκαδικό αριθμό χωρίς συγκεκριμένη βάση';
    const fake2 = 'Τον πολλαπλασιασμό ενός αριθμού με το 1.000';
    const fake3 = 'Την αφαίρεση 100 μονάδων από το σύνολο';

    const options = [
      { text: correctConcept, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • Η ΕΝΝΟΙΑ ΤΟΥ ΠΟΣΟΣΤΟΥ',
      instruction: 'Επιλέξτε τον σωστό ορισμό:',
      prompt: `Τι σημαίνει στα Μαθηματικά ο όρος «ποσοστό στα εκατό (%)»;`,
      options,
      correctText: correctConcept,
      explanation: `Το ποσοστό στα εκατό (%) είναι ένας λόγος που εκφράζει πόσα μέρη αναλογούν σε ένα σύνολο 100 ίσων μερών.`
    });
  }

  // Q5 (Input - Decimal): Μετατροπή ποσοστού σε δεκαδικό αριθμό
  {
    const pct = pickRandom([15, 28, 45, 60, 85, 92, 5]);
    const decVal = Number((pct / 100).toFixed(2));

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΠΟΣΟΣΤΟ ΣΕ ΔΕΚΑΔΙΚΟ',
      instruction: 'Γράψτε το ποσοστό ως δεκαδικό αριθμό:',
      prompt: `Γράψτε το ποσοστό ${pct} % στη μορφή δεκαδικού αριθμού:`,
      correctVal: decVal,
      correctStr: formatNum(decVal),
      explanation: `Για να γράψουμε ένα ποσοστό ως δεκαδικό αριθμό, διαιρούμε με το 100 (μετακινούμε την υποδιαστολή 2 θέσεις αριστερά): ${pct} : 100 ＝ ${formatNum(decVal)}.`
    });
  }

  // Q6 (MCQ): Αντιστοίχιση κλάσματος και ποσοστού
  {
    const targetFraction = '1/5';
    const correctPct = '20 %';
    const fake1 = '5 %';
    const fake2 = '50 %';
    const fake3 = '15 %';

    const options = [
      { text: correctPct, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΑΝΤΙΣΤΟΙΧΙΣΗ ΚΛΑΣΜΑΤΟΣ',
      instruction: 'Επιλέξτε το ισοδύναμο ποσοστό:',
      prompt: `Σε ποιο ποσοστό (%) αντιστοιχεί το κλάσμα 1/5;`,
      options,
      correctText: correctPct,
      explanation: `Πολλαπλασιάζουμε με το 20: (1 · 20) / (5 · 20) ＝ 20/100, δηλαδή 20 %.`
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
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΠΟΣΟΣΤΩΝ',
      instruction: 'Υπολογίστε το ζητούμενο ποσοστό (%):',
      prompt: stdProb1.text,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal;
    const fake8A = typeof val8 === 'number' ? formatNum(val8 + randInt(5, 12)) : '0';
    const fake8B = typeof val8 === 'number' ? formatNum(Math.max(1, val8 - randInt(4, 10))) : '0';
    const fake8C = typeof val8 === 'number' ? formatNum(val8 * 1.5) : '0';

    const optionsQ8 = [
      { text: `${stdProb2.correctStr} %`, isCorrect: true },
      { text: `${fake8A} %`, isCorrect: false },
      { text: `${fake8B} %`, isCorrect: false },
      { text: `${fake8C} %`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ',
      instruction: 'Επιλέξτε το σωστό ποσοστό (%):',
      prompt: stdProb2.text,
      options: optionsQ8,
      correctText: `${stdProb2.correctStr} %`,
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
      instruction: 'Υπολογίστε με προσοχή και εισαγάγετε το ποσοστό (%):',
      prompt: hardProb1.text,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal;
    const fake10A = typeof val10 === 'number' ? formatNum(val10 + randInt(5, 12)) : '0';
    const fake10B = typeof val10 === 'number' ? formatNum(Math.max(1, val10 - randInt(4, 10))) : '0';
    const fake10C = typeof val10 === 'number' ? formatNum(val10 * 1.4) : '0';

    const optionsQ10 = [
      { text: `${hardProb2.correctStr} %`, isCorrect: true },
      { text: `${fake10A} %`, isCorrect: false },
      { text: `${fake10B} %`, isCorrect: false },
      { text: `${fake10C} %`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΠΕΡΙΕΚΤΙΚΟΤΗΤΑΣ & ΠΟΣΟΣΤΩΝ',
      instruction: 'Επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      options: optionsQ10,
      correctText: `${hardProb2.correctStr} %`,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function PosostaExercisesPage() {
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
      title="Ασκήσεις: Ποσοστά & Μετατροπή Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στην έννοια του ποσοστού, μετατροπή κλασμάτων σε ισοδύναμα με παρονομαστή 100 και σύνδεση με δεκαδικούς για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/50-pososta"
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
              Ασκήσεις: Ποσοστά &amp; Μετατροπή Κλασμάτων
            </h1>
            <p className="text-sky-100 text-sm sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Μετατρέψτε κλάσματα σε εκατοστιαία με παρονομαστή 100, συνδέστε τα με δεκαδικούς και υπολογίστε ποσοστά %.
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

                  {/* Κλασματικη Προβολη (αν υπαρχει) */}
                  {q.fractionDisplay && (
                    <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl font-mono text-base sm:text-lg font-bold">
                      <Fraction num={q.fractionDisplay.num} den={q.fractionDisplay.den} />
                      {q.fractionDisplay.targetDen && (
                        <>
                          <span className="mx-2">＝</span>
                          <Fraction num={q.fractionDisplay.targetNum} den={q.fractionDisplay.targetDen} className="text-emerald-700" />
                        </>
                      )}
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

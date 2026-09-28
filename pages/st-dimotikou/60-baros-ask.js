// pages/st-dimotikou/60-baros-ask.js
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

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 3) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Δεξαμενη Κανονικων Προβληματων Βαρους (10 διαφορετικα προβληματα)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_wt_std_1',
    generate: () => {
      const bags = randInt(4, 8);
      const bagKg = 2.5;
      const totalKg = bags * bagKg;
      const totalG = totalKg * 1000;
      return {
        text: `Μια οικογένεια αγόρασε ${bags} σακούλες αλεύρι, βάρους ${formatNum(bagKg)} kg η καθεμία. Πόσα γραμμάρια (g) αλεύρι αγόρασε συνολικά;`,
        tableData: { col1: 'Σακούλες', col2: 'Βάρος ανά σακούλα', r1: [`${bags} σακούλες`, `${formatNum(bagKg)} kg ＝ ${bagKg * 1000} g`], r2: ['Πολλαπλασιασμός', 'Συνολικό βάρος σε g'] },
        correctVal: totalG,
        correctStr: String(totalG),
        explanation: `Συνολικό βάρος σε κιλά: ${bags} · ${formatNum(bagKg)} ＝ ${formatNum(totalKg)} kg. Μετατρέπουμε σε γραμμάρια πολλαπλασιάζοντας με το 1.000: ${formatNum(totalKg)} · 1.000 ＝ ${totalG} g.`
      };
    }
  },
  {
    id: 'p_wt_std_2',
    generate: () => {
      const grossKg = randInt(18, 25);
      const tareG = randInt(12, 18) * 100; // π.χ. 1.500 g
      const tareKg = tareG / 1000;
      const netKg = Number((grossKg - tareKg).toFixed(2));
      return {
        text: `Ένα καφάσι γεμάτο πορτοκάλια έχει μικτό βάρος ${grossKg} kg. Το άδειο καφάσι (απόβαρο) ζυγίζει ${tareG} g. Ποιο είναι το καθαρό βάρος των πορτοκαλιών σε κιλά (kg);`,
        tableData: { col1: 'Μικτό Βάρος', col2: 'Απόβαρο', r1: [`${grossKg} kg`, `${tareG} g`], r2: ['Αναγωγή σε kg', `${formatNum(tareKg)} kg`] },
        correctVal: netKg,
        correctStr: formatNum(netKg),
        explanation: `Μετατρέπουμε το απόβαρο σε κιλά: ${tareG} : 1.000 ＝ ${formatNum(tareKg)} kg. Καθαρό βάρος: Μικτό － Απόβαρο ＝ ${grossKg} － ${formatNum(tareKg)} ＝ ${formatNum(netKg)} kg.`
      };
    }
  },
  {
    id: 'p_wt_std_3',
    generate: () => {
      const cheeseG = randInt(3, 7) * 250; // π.χ. 750 g, 1.250 g
      const pricePerKg = randInt(10, 16);
      const cheeseKg = cheeseG / 1000;
      const cost = Number((cheeseKg * pricePerKg).toFixed(2));
      return {
        text: `Αγοράσαμε ${cheeseG} g φέτα προς ${pricePerKg} € το κιλό. Πόσα ευρώ (€) πληρώσαμε;`,
        tableData: { col1: 'Βάρος Φέτας', col2: 'Τιμή ανά kg', r1: [`${cheeseG} g ＝ ${formatNum(cheeseKg)} kg`, `${pricePerKg} €/kg`], r2: ['Αναγωγή σε kg', 'Υπολογισμός κόστους'] },
        correctVal: cost,
        correctStr: formatNum(cost),
        explanation: `Μετατρέπουμε τα γραμμάρια σε κιλά: ${cheeseG} : 1.000 ＝ ${formatNum(cheeseKg)} kg. Κόστος: ${formatNum(cheeseKg)} · ${pricePerKg} ＝ ${formatNum(cost)} €.`
      };
    }
  },
  {
    id: 'p_wt_std_4',
    generate: () => {
      const pills = randInt(20, 50);
      const pillMg = 250;
      const totalMg = pills * pillMg;
      const totalG = totalMg / 1000;
      return {
        text: `Ένα κουτί περιέχει ${pills} χάπια των ${pillMg} mg το καθένα. Πόσα γραμμάρια (g) φαρμάκου περιέχονται συνολικά στο κουτί;`,
        tableData: { col1: 'Χάπια', col2: 'Βάρος ανά χάπι', r1: [`${pills} χάπια`, `${pillMg} mg`], r2: [`Σύνολο: ${totalMg} mg`, 'Μετατροπή σε g'] },
        correctVal: totalG,
        correctStr: formatNum(totalG),
        explanation: `Συνολικό βάρος σε χιλιοστόγραμμα: ${pills} · ${pillMg} ＝ ${totalMg} mg. Μετατρέπουμε σε γραμμάρια διαιρώντας με το 1.000: ${totalMg} : 1.000 ＝ ${formatNum(totalG)} g.`
      };
    }
  },
  {
    id: 'p_wt_std_5',
    generate: () => {
      const trucks = randInt(3, 6);
      const loadT = randInt(4, 8);
      const totalT = trucks * loadT;
      const totalKg = totalT * 1000;
      return {
        text: `Ένας στόλος από ${trucks} ίδια φορτηγά μετέφερε ${loadT} t άμμο το καθένα. Πόσα κιλά (kg) άμμου μεταφέρθηκαν συνολικά;`,
        tableData: { col1: 'Φορτηγά', col2: 'Φορτίο ανά φορτηγό', r1: [`${trucks} φορτηγά`, `${loadT} t ＝ ${loadT * 1000} kg`], r2: ['Πολλαπλασιασμός', 'Σύνολο σε kg'] },
        correctVal: totalKg,
        correctStr: String(totalKg),
        explanation: `Συνολικό φορτίο σε τόνους: ${trucks} · ${loadT} ＝ ${totalT} t. Μετατρέπουμε σε κιλά πολλαπλασιάζοντας με το 1.000: ${totalT} · 1.000 ＝ ${totalKg} kg.`
      };
    }
  },
  {
    id: 'p_wt_std_6',
    generate: () => {
      const breadG = randInt(6, 12) * 50; // π.χ. 400 g
      const totalKg = 4;
      const totalG = totalKg * 1000;
      const loaves = totalG / breadG;
      const cleanLoaves = Number.isInteger(loaves) ? loaves : Number(loaves.toFixed(1));
      return {
        text: `Από μια ζύμη βάρους ${totalKg} kg ένας φούρναρης έπλασε καρβέλια ψωμιού βάρους ${breadG} g το καθένα. Πόσα τέτοια καρβέλια έπλασε;`,
        tableData: { col1: 'Συνολική Ζύμη', col2: 'Καρβέλι', r1: [`${totalKg} kg ＝ ${totalG} g`, `${breadG} g`], r2: ['Διαίρεση', 'Πλήθος καρβελιών'] },
        correctVal: cleanLoaves,
        correctStr: formatNum(cleanLoaves),
        explanation: `Μετατρέπουμε τη ζύμη σε γραμμάρια: ${totalKg} · 1.000 ＝ ${totalG} g. Διαιρούμε με το βάρος κάθε καρβελιού: ${totalG} : ${breadG} ＝ ${formatNum(cleanLoaves)} καρβέλια.`
      };
    }
  },
  {
    id: 'p_wt_std_7',
    generate: () => {
      const netKg = randInt(12, 18);
      const tareG = randInt(8, 15) * 100;
      const tareKg = tareG / 1000;
      const grossKg = Number((netKg + tareKg).toFixed(2));
      return {
        text: `Ένα δοχείο περιέχει καθαρό ελαιόλαδο βάρους ${netKg} kg. Το άδειο δοχείο (απόβαρο) ζυγίζει ${tareG} g. Ποιο είναι το μικτό βάρος του δοχείου μαζί με το λάδι σε κιλά (kg);`,
        tableData: { col1: 'Καθαρό Βάρος', col2: 'Απόβαρο', r1: [`${netKg} kg`, `${tareG} g ＝ ${formatNum(tareKg)} kg`], r2: ['Πρόσθεση', 'Μικτό Βάρος σε kg'] },
        correctVal: grossKg,
        correctStr: formatNum(grossKg),
        explanation: `Μετατρέπουμε το απόβαρο σε κιλά: ${tareG} : 1.000 ＝ ${formatNum(tareKg)} kg. Μικτό βάρος ＝ Καθαρό ＋ Απόβαρο ＝ ${netKg} ＋ ${formatNum(tareKg)} ＝ ${formatNum(grossKg)} kg.`
      };
    }
  },
  {
    id: 'p_wt_std_8',
    generate: () => {
      const portionG = 125;
      const portions = randInt(12, 24);
      const totalG = portionG * portions;
      const totalKg = totalG / 1000;
      return {
        text: `Σε ένα εστιατόριο σερβίρονται ${portions} ατομικές μερίδες παγωτού των ${portionG} g η καθεμία. Πόσα κιλά (kg) παγωτού καταναλώθηκαν συνολικά;`,
        tableData: { col1: 'Μερίδες', col2: 'Βάρος μερίδας', r1: [`${portions} μερίδες`, `${portionG} g`], r2: [`Σύνολο: ${totalG} g`, 'Μετατροπή σε kg'] },
        correctVal: totalKg,
        correctStr: formatNum(totalKg),
        explanation: `Συνολικά γραμμάρια: ${portions} · ${portionG} ＝ ${totalG} g. Μετατρέπουμε σε κιλά διαιρώντας με το 1.000: ${totalG} : 1.000 ＝ ${formatNum(totalKg)} kg.`
      };
    }
  },
  {
    id: 'p_wt_std_9',
    generate: () => {
      const packG = randInt(2, 5) * 100; // π.χ. 400 g
      const boxes = randInt(15, 30);
      const totalG = packG * boxes;
      const totalKg = totalG / 1000;
      return {
        text: `Ένα κιβώτιο περιέχει ${boxes} συσκευασίες μπισκότων των ${packG} g η καθεμία. Πόσα κιλά (kg) ζυγίζουν όλες οι συσκευασίες μαζί;`,
        tableData: { col1: 'Συσκευασίες', col2: 'Βάρος συσκευασίας', r1: [`${boxes} κουτιά`, `${packG} g`], r2: [`Σύνολο: ${totalG} g`, 'Αναγωγή σε kg'] },
        correctVal: totalKg,
        correctStr: formatNum(totalKg),
        explanation: `Συνολικό βάρος σε γραμμάρια: ${boxes} · ${packG} ＝ ${totalG} g. Μετατρέπουμε σε κιλά: ${totalG} : 1.000 ＝ ${formatNum(totalKg)} kg.`
      };
    }
  },
  {
    id: 'p_wt_std_10',
    generate: () => {
      const totalKg = randInt(12, 24);
      const perBagG = 500;
      const totalG = totalKg * 1000;
      const bags = totalG / perBagG;
      return {
        text: `Ένας παραγωγός συσκευάζει ${totalKg} kg ρίγανη σε σακουλάκια των ${perBagG} g. Πόσα σακουλάκια θα γεμίσει;`,
        tableData: { col1: 'Συνολική Ρίγανη', col2: 'Σακουλάκι', r1: [`${totalKg} kg ＝ ${totalG} g`, `${perBagG} g`], r2: ['Διαίρεση', 'Πλήθος σακουλιών'] },
        correctVal: bags,
        correctStr: String(bags),
        explanation: `Μετατρέπουμε τα κιλά σε γραμμάρια: ${totalKg} · 1.000 ＝ ${totalG} g. Διαιρούμε με το βάρος κάθε σακούλας: ${totalG} : ${perBagG} ＝ ${bags} σακουλάκια.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (Σύνθετες Συσκευασίες, Τόνοι, Απόβαρο & Κέρδος)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_wt_hard_1',
    generate: () => {
      const crates = randInt(15, 30);
      const grossPerCrateKg = 22.5;
      const tarePerCrateG = 1500; // 1.5 kg
      const tarePerCrateKg = tarePerCrateG / 1000;
      const netPerCrateKg = grossPerCrateKg - tarePerCrateKg; // 21 kg
      const totalNetKg = crates * netPerCrateKg;
      return {
        text: `Ένας έμπορος παρέλαβε ${crates} τελάρα με ροδάκινα. Το μικτό βάρος κάθε τελάρου ήταν ${formatNum(grossPerCrateKg)} kg και το απόβαρο κάθε άδειου τελάρου ${tarePerCrateG} g. Ποιο είναι το συνολικό καθαρό βάρος των ροδάκινων σε κιλά (kg);`,
        tableData: { col1: 'Στοιχεία ανά τελάρο', col2: 'Σύνολο Τελάρων', r1: [`Μικτό: ${formatNum(grossPerCrateKg)} kg`, `${crates} τελάρα`], r2: [`Απόβαρο: ${tarePerCrateG} g ＝ ${formatNum(tarePerCrateKg)} kg`, `Καθαρό: ${netPerCrateKg} kg / τελάρο`] },
        correctVal: totalNetKg,
        correctStr: String(totalNetKg),
        explanation: `Μετατρέπουμε το απόβαρο σε κιλά: ${tarePerCrateG} : 1.000 ＝ ${formatNum(tarePerCrateKg)} kg. Καθαρό βάρος ανά τελάρο: ${formatNum(grossPerCrateKg)} － ${formatNum(tarePerCrateKg)} ＝ ${netPerCrateKg} kg. Συνολικό καθαρό βάρος για τα ${crates} τελάρα: ${crates} · ${netPerCrateKg} ＝ ${totalNetKg} kg.`
      };
    }
  },
  {
    id: 'p_wt_hard_2',
    generate: () => {
      const truckLimitT = 4.2;
      const truckLimitKg = truckLimitT * 1000; // 4200 kg
      const bagsCount = 90;
      const bagKg = 40;
      const currentLoadKg = bagsCount * bagKg; // 3600 kg
      const remainKg = truckLimitKg - currentLoadKg; // 600 kg
      const remainT = remainKg / 1000; // 0.6 t
      return {
        text: `Ένα φορτηγό έχει μέγιστο επιτρεπόμενο όριο φορτίου ${formatNum(truckLimitT)} t. Φορτώθηκαν σε αυτό ${bagsCount} τσουβάλια τσιμέντο των ${bagKg} kg το καθένα. Πόσους τόνους (t) επιπλέον φορτίου μπορεί να μεταφέρει το φορτηγό χωρίς να ξεπεράσει το όριο;`,
        tableData: { col1: 'Όριο Φορτίου', col2: 'Τρέχον Φορτίο', r1: [`${formatNum(truckLimitT)} t ＝ ${truckLimitKg} kg`, `${bagsCount} · ${bagKg} ＝ ${currentLoadKg} kg`], r2: [`Υπόλοιπο σε kg: ${remainKg} kg`, 'Μετατροπή σε t'] },
        correctVal: remainT,
        correctStr: formatNum(remainT),
        explanation: `Όριο σε κιλά: ${formatNum(truckLimitT)} · 1.000 ＝ ${truckLimitKg} kg. Τρέχον φορτίο: ${bagsCount} · ${bagKg} ＝ ${currentLoadKg} kg. Υπόλοιπο σε κιλά: ${truckLimitKg} － ${currentLoadKg} ＝ ${remainKg} kg. Μετατρέπουμε σε τόνους: ${remainKg} : 1.000 ＝ ${formatNum(remainT)} t.`
      };
    }
  },
  {
    id: 'p_wt_hard_3',
    generate: () => {
      const netKg = 120;
      const pricePerKg = 4.5;
      const totalRevenue = netKg * pricePerKg; // 540 €
      const tareWeightKg = 12;
      const grossKg = netKg + tareWeightKg; // 132 kg
      return {
        text: `Ένας παραγωγός πούλησε μέλι προς ${formatNum(pricePerKg)} € το κιλό καθαρού βάρους. Αν το μικτό βάρος των δοχείων ήταν ${grossKg} kg και το συνολικό απόβαρο των κενών δοχείων ${tareWeightKg} kg, πόσα ευρώ (€) εισέπραξε;`,
        tableData: { col1: 'Μικτό & Απόβαρο', col2: 'Τιμή Καθαρού', r1: [`Μικτό: ${grossKg} kg`, `${formatNum(pricePerKg)} € / kg`], r2: [`Απόβαρο: ${tareWeightKg} kg`, `Καθαρό: ${netKg} kg`] },
        correctVal: totalRevenue,
        correctStr: formatNum(totalRevenue),
        explanation: `Πληρώνεται αποκλειστικά το καθαρό βάρος! Καθαρό βάρος μελιού: ${grossKg} － ${tareWeightKg} ＝ ${netKg} kg. Συνολική είσπραξη: ${netKg} · ${formatNum(pricePerKg)} ＝ ${formatNum(totalRevenue)} €.`
      };
    }
  },
  {
    id: 'p_wt_hard_4',
    generate: () => {
      const part1T = 1.8;
      const part2Kg = 750;
      const part3Kg = 450;
      const sumKg = (part1T * 1000) + part2Kg + part3Kg; // 1800 + 750 + 450 = 3000 kg
      const sumT = sumKg / 1000; // 3 t
      return {
        text: `Σε μια αποθήκη παραδόθηκαν τρία φορτία σιταριού: το 1ο ζύγιζε ${formatNum(part1T)} t, το 2ο ${part2Kg} kg και το 3ο ${part3Kg} kg. Πόσους τόνους (t) σιταριού παρέλαβε συνολικά η αποθήκη;`,
        tableData: { col1: 'Τρία Φορτία', col2: 'Αναγωγή σε Τόνους', r1: [`1ο: ${formatNum(part1T)} t`, `2ο: ${part2Kg} kg ＝ ${formatNum(part2Kg / 1000)} t`], r2: [`3ο: ${part3Kg} kg ＝ ${formatNum(part3Kg / 1000)} t`, 'Άθροισμα'] },
        correctVal: sumT,
        correctStr: formatNum(sumT),
        explanation: `Μετατρέπουμε όλα τα φορτία σε τόνους: 1ο: ${formatNum(part1T)} t, 2ο: ${part2Kg} : 1.000 ＝ ${formatNum(part2Kg / 1000)} t, 3ο: ${part3Kg} : 1.000 ＝ ${formatNum(part3Kg / 1000)} t. Άθροισμα: ${formatNum(part1T)} ＋ ${formatNum(part2Kg / 1000)} ＋ ${formatNum(part3Kg / 1000)} ＝ ${formatNum(sumT)} t.`
      };
    }
  },
  {
    id: 'p_wt_hard_5',
    generate: () => {
      const goldG = 36;
      const coinWeightG = 4.5;
      const coins = goldG / coinWeightG; // 8 νομίσματα
      const pricePerCoin = randInt(18, 25) * 10;
      const totalVal = coins * pricePerCoin;
      return {
        text: `Από μια πλάκα χρυσού βάρους ${goldG} g κατασκευάστηκαν χρυσά νομίσματα βάρους ${formatNum(coinWeightG)} g το καθένα. Αν κάθε νόμισμα πωλείται προς ${pricePerCoin} €, πόσα ευρώ (€) θα εισπραχθούν από την πώληση όλων των νομισμάτων;`,
        tableData: { col1: 'Χρυσός', col2: 'Νόμισμα', r1: [`Σύνολο: ${goldG} g`, `Βάρος: ${formatNum(coinWeightG)} g`], r2: [`Νομίσματα: ${coins}`, `Τιμή: ${pricePerCoin} €/τεμ.`] },
        correctVal: totalVal,
        correctStr: String(totalVal),
        explanation: `Βρίσκουμε το πλήθος των νομισμάτων: ${goldG} : ${formatNum(coinWeightG)} ＝ ${coins} νομίσματα. Συνολική είσπραξη: ${coins} · ${pricePerCoin} ＝ ${totalVal} €.`
      };
    }
  },
  {
    id: 'p_wt_hard_6',
    generate: () => {
      const emptyCanG = 450;
      const oilKg = 5;
      const oilG = oilKg * 1000;
      const grossG = emptyCanG + oilG; // 5450 g
      const grossKg = grossG / 1000; // 5.45 kg
      return {
        text: `Ένας άδειος τενεκές ζυγίζει ${emptyCanG} g. Γεμίζουμε τον τενεκέ με ${oilKg} kg λάδι. Ποιο είναι το μικτό βάρος του γεμάτου τενεκέ σε κιλά (kg);`,
        tableData: { col1: 'Απόβαρο (τενεκές)', col2: 'Καθαρό (λάδι)', r1: [`${emptyCanG} g ＝ ${formatNum(emptyCanG / 1000)} kg`, `${oilKg} kg`], r2: ['Πρόσθεση', 'Μικτό βάρος σε kg'] },
        correctVal: grossKg,
        correctStr: formatNum(grossKg),
        explanation: `Μετατρέπουμε το απόβαρο σε κιλά: ${emptyCanG} : 1.000 ＝ ${formatNum(emptyCanG / 1000)} kg. Μικτό βάρος: ${oilKg} ＋ ${formatNum(emptyCanG / 1000)} ＝ ${formatNum(grossKg)} kg.`
      };
    }
  },
  {
    id: 'p_wt_hard_7',
    generate: () => {
      const totalFishKg = 48;
      const boxGrossKg = 6.4;
      const boxTareG = 400; // 0.4 kg
      const boxTareKg = boxTareG / 1000;
      const boxNetKg = boxGrossKg - boxTareKg; // 6 kg
      const boxesNeeded = totalFishKg / boxNetKg; // 8
      return {
        text: `Ένας ψαράς θέλει να συσκευάσει ${totalFishKg} kg ψάρια. Κάθε φελιζόλ έχει απόβαρο ${boxTareG} g και γεμάτο έχει μικτό βάρος ${formatNum(boxGrossKg)} kg. Πόσα κιβώτια φελιζόλ θα χρειαστεί συνολικά;`,
        tableData: { col1: 'Συνολικά Ψάρια', col2: 'Κιβώτιο Φελιζόλ', r1: [`${totalFishKg} kg`, `Μικτό: ${formatNum(boxGrossKg)} kg`], r2: [`Απόβαρο: ${formatNum(boxTareKg)} kg`, `Καθαρό: ${boxNetKg} kg / κιβώτιο`] },
        correctVal: boxesNeeded,
        correctStr: String(boxesNeeded),
        explanation: `Καθαρό βάρος ψαριών ανά κιβώτιο: ${formatNum(boxGrossKg)} － ${formatNum(boxTareKg)} ＝ ${boxNetKg} kg. Κιβώτια που απαιτούνται: ${totalFishKg} : ${boxNetKg} ＝ ${boxesNeeded} κιβώτια.`
      };
    }
  },
  {
    id: 'p_wt_hard_8',
    generate: () => {
      const truckTareT = 2.4; // βάρος άδειου φορτηγού
      const cargoKg = 3600;
      const cargoT = cargoKg / 1000; // 3.6 t
      const totalGrossT = truckTareT + cargoT; // 6 t
      return {
        text: `Ένα φορτηγό ζυγίζει άδειο (απόβαρο) ${formatNum(truckTareT)} t. Φορτώνεται με εμπορεύματα βάρους ${cargoKg} kg. Όταν ανέβει στην επαγγελματική πλάστιγγα (ζυγαριά), ποιο θα είναι το συνολικό μικτό βάρος σε τόνους (t);`,
        tableData: { col1: 'Άδειο Φορτηγό', col2: 'Φορτίο', r1: [`${formatNum(truckTareT)} t`, `${cargoKg} kg ＝ ${formatNum(cargoT)} t`], r2: ['Πρόσθεση', 'Μικτό βάρος πλάστιγγας'] },
        correctVal: totalGrossT,
        correctStr: formatNum(totalGrossT),
        explanation: `Μετατρέπουμε το φορτίο σε τόνους: ${cargoKg} : 1.000 ＝ ${formatNum(cargoT)} t. Μικτό βάρος πλάστιγγας: ${formatNum(truckTareT)} ＋ ${formatNum(cargoT)} ＝ ${formatNum(totalGrossT)} t.`
      };
    }
  },
  {
    id: 'p_wt_hard_9',
    generate: () => {
      const oliveKg = 850;
      const oilYieldPct = 20; // 20% απόδοση
      const oilKg = (oliveKg * oilYieldPct) / 100; // 170 kg
      const bottleCapacityG = 500;
      const bottles = (oilKg * 1000) / bottleCapacityG; // 340
      return {
        text: `Από ${oliveKg} kg ελιές παρήχθη ελαιόλαδο ίσο με το 20% του βάρους τους. Το λάδι συσκευάστηκε σε γυάλινα μπουκάλια των ${bottleCapacityG} g. Πόσα μπουκάλια γέμισαν;`,
        tableData: { col1: 'Ελιές', col2: 'Λάδι & Μπουκάλι', r1: [`${oliveKg} kg (απόδοση 20%)`, `Λάδι: ${oilKg} kg ＝ ${oilKg * 1000} g`], r2: ['Μπουκάλι: 500 g', 'Πλήθος μπουκαλιών'] },
        correctVal: bottles,
        correctStr: String(bottles),
        explanation: `Βάρος παραχθέντος λαδιού: (${oliveKg} · 20) : 100 ＝ ${oilKg} kg. Μετατρέπουμε σε γραμμάρια: ${oilKg} · 1.000 ＝ ${oilKg * 1000} g. Μπουκάλια: ${oilKg * 1000} : 500 ＝ ${bottles} μπουκάλια.`
      };
    }
  },
  {
    id: 'p_wt_hard_10',
    generate: () => {
      const bulkSugarKg = 15;
      const usedKg = 4.2;
      const remainKg = bulkSugarKg - usedKg; // 10.8 kg
      const bagG = 900;
      const bags = (remainKg * 1000) / bagG; // 12
      return {
        text: `Σε ένα ζαχαροπλαστείο υπήρχε ένας σάκος με ${bulkSugarKg} kg ζάχαρη. Χρησιμοποιήθηκαν ${formatNum(usedKg)} kg για γλυκά και η υπόλοιπη ζάχαρη μοιράστηκε σε σακούλες των ${bagG} g. Πόσες σακούλες γέμισαν;`,
        tableData: { col1: 'Αρχική Ζάχαρη', col2: 'Υπόλοιπο & Σακούλες', r1: [`${bulkSugarKg} kg － ${formatNum(usedKg)} kg`, `Υπόλοιπο: ${formatNum(remainKg)} kg`], r2: [`${formatNum(remainKg * 1000)} g`, `Σακούλα: ${bagG} g`] },
        correctVal: bags,
        correctStr: String(bags),
        explanation: `Υπόλοιπο ζάχαρης σε κιλά: ${bulkSugarKg} － ${formatNum(usedKg)} ＝ ${formatNum(remainKg)} kg. Μετατρέπουμε σε γραμμάρια: ${formatNum(remainKg)} · 1.000 ＝ ${remainKg * 1000} g. Σακούλες: ${remainKg * 1000} : ${bagG} ＝ ${bags} σακούλες.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Μετατροπή kg σε g (πολλαπλασιασμός x1000)
  {
    const kg = Number((randInt(2, 7) + pickRandom([0.2, 0.4, 0.5, 0.75])).toFixed(2));
    const g = Number((kg * 1000).toFixed(0));

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΜΕΤΑΤΡΟΠΗ ΑΠΟ ΚΙΛΑ ΣΕ ΓΡΑΜΜΑΡΙΑ',
      instruction: 'Μετατρέψτε το βάρος σε γραμμάρια (g):',
      prompt: `Πόσα γραμμάρια (g) είναι τα ${formatNum(kg)} kg;`,
      correctVal: g,
      correctStr: String(g),
      explanation: `Επειδή 1 kg ＝ 1.000 g, για να μετατρέψουμε κιλά σε γραμμάρια πολλαπλασιάζουμε με το 1.000: ${formatNum(kg)} · 1.000 ＝ ${g} g.`
    });
  }

  // Q2 (MCQ): Βασική μονάδα μέτρησης μάζας
  {
    const correctOpt = 'Το χιλιόγραμμο ή κιλό (kg)';
    const fake1 = 'Ο τόνος (t)';
    const fake2 = 'Το γραμμάριο (g)';
    const fake3 = 'Το χιλιοστόγραμμο (mg)';

    const options = [
      { text: correctOpt, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΒΑΣΙΚΗ ΜΟΝΑΔΑ ΒΑΡΟΥΣ',
      instruction: 'Επιλέξτε τη θεμελιώδη μονάδα:',
      prompt: 'Ποια είναι η βασική μονάδα μέτρησης του βάρους (μάζας) στην καθημερινή ζωή;',
      options,
      correctText: correctOpt,
      explanation: 'Βασική μονάδα μέτρησης του βάρους είναι το χιλιόγραμμο (kg), το οποίο συνήθως αποκαλούμε απλά κιλό.'
    });
  }

  // Q3 (Input - Decimal): Μετατροπή g σε kg (διαίρεση με 1000)
  {
    const g = randInt(15, 85) * 100 + pickRandom([0, 50]);
    const kg = Number((g / 1000).toFixed(3));

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΜΕΤΑΤΡΟΠΗ ΑΠΟ ΓΡΑΜΜΑΡΙΑ ΣΕ ΚΙΛΑ',
      instruction: 'Υπολογίστε το βάρος σε κιλά (kg):',
      prompt: `Πόσα κιλά (kg) είναι τα ${formatNum(g)} g;`,
      correctVal: kg,
      correctStr: formatNum(kg),
      explanation: `Για να μετατρέψουμε γραμμάρια σε κιλά διαιρούμε με το 1.000: ${formatNum(g)} : 1.000 ＝ ${formatNum(kg)} kg.`
    });
  }

  // Q4 (MCQ): Σχέση Μικτού, Καθαρού και Αποβάρου
  {
    const correctRule = 'Καθαρό Βάρος ＝ Μικτό Βάρος － Απόβαρο';
    const fake1 = 'Καθαρό Βάρος ＝ Μικτό Βάρος ＋ Απόβαρο';
    const fake2 = 'Απόβαρο ＝ Μικτό Βάρος ＋ Καθαρό Βάρος';
    const fake3 = 'Μικτό Βάρος ＝ Καθαρό Βάρος － Απόβαρο';

    const options = [
      { text: correctRule, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΣΧΕΣΗ ΚΑΘΑΡΟΥ & ΜΙΚΤΟΥ ΒΑΡΟΥΣ',
      instruction: 'Επιλέξτε τη σωστή μαθηματική σχέση:',
      prompt: 'Ποιος είναι ο σωστός τύπος για τον υπολογισμό του καθαρού βάρους ενός προϊόντος;',
      options,
      correctText: correctRule,
      explanation: 'Το καθαρό βάρος προκύπτει αφαιρώντας το βάρος της συσκευασίας (απόβαρο) από το συνολικό βάρος (μικτό): Καθαρό ＝ Μικτό － Απόβαρο.'
    });
  }

  // Q5 (Input - Decimal): Μετατροπή kg σε t (διαίρεση με 1.000)
  {
    const kg = randInt(12, 75) * 100;
    const t = Number((kg / 1000).toFixed(3));

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΜΕΤΑΤΡΟΠΗ ΑΠΟ ΚΙΛΑ ΣΕ ΤΟΝΟΥΣ',
      instruction: 'Υπολογίστε το βάρος σε τόνους (t):',
      prompt: `Πόσοι τόνοι (t) είναι τα ${formatNum(kg)} kg;`,
      correctVal: t,
      correctStr: formatNum(t),
      explanation: `Επειδή 1 t ＝ 1.000 kg, για να μετατρέψουμε κιλά σε τόνους διαιρούμε με το 1.000: ${formatNum(kg)} : 1.000 ＝ ${formatNum(t)} t.`
    });
  }

  // Q6 (MCQ): Ισοδυναμία υποδιαιρέσεων και πολλαπλασίων
  {
    const correctEquiv = '1 t ＝ 1.000 kg και 1 kg ＝ 1.000 g';
    const fake1 = '1 t ＝ 100 kg και 1 kg ＝ 100 g';
    const fake2 = '1 t ＝ 1.000 g και 1 kg ＝ 1.000 mg';
    const fake3 = '1 kg ＝ 100 g και 1 g ＝ 1.000 mg';

    const options = [
      { text: correctEquiv, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΙΣΟΔΥΝΑΜΙΑ ΜΟΝΑΔΩΝ ΒΑΡΟΥΣ',
      instruction: 'Επιλέξτε τη σωστή ισοδυναμία:',
      prompt: 'Ποια από τις παρακάτω σχέσεις ισοδυναμίας των μονάδων βάρους είναι σωστή;',
      options,
      correctText: correctEquiv,
      explanation: 'Ένας τόνος έχει ακριβώς 1.000 κιλά (1 t ＝ 1.000 kg) και ένα κιλό έχει ακριβώς 1.000 γραμμάρια (1 kg ＝ 1.000 g).'
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
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΒΑΡΟΥΣ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: stdProb1.text,
      tableData: stdProb1.tableData,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal;
    const fake8A = typeof val8 === 'number' ? formatNum(val8 + randInt(2, 5)) : '0';
    const fake8B = typeof val8 === 'number' ? formatNum(Math.max(0.5, val8 - randInt(1, 4))) : '0';
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
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ',
      instruction: 'Επιλέξτε τη σωστή τιμή για το πρόβλημα:',
      prompt: stdProb2.text,
      tableData: stdProb2.tableData,
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
      title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΚΑΘΑΡΟΥ ΒΑΡΟΥΣ',
      instruction: 'Προσέξτε τις διαφορετικές μονάδες και υπολογίστε το αποτέλεσμα:',
      prompt: hardProb1.text,
      tableData: hardProb1.tableData,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal;
    const fake10A = typeof val10 === 'number' ? formatNum(val10 + randInt(2, 5) * 0.2) : '0';
    const fake10B = typeof val10 === 'number' ? formatNum(Math.max(0.1, val10 - randInt(1, 3) * 0.2)) : '0';
    const fake10C = typeof val10 === 'number' ? formatNum(val10 * 1.5) : '0';

    const optionsQ10 = [
      { text: hardProb2.correctStr, isCorrect: true },
      { text: String(fake10A), isCorrect: false },
      { text: String(fake10B), isCorrect: false },
      { text: String(fake10C), isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΜΕ ΤΟΝΟΥΣ & ΦΟΡΤΙΟ',
      instruction: 'Επιλέξτε τη σωστή τιμή για το σύνθετο πρόβλημα:',
      prompt: hardProb2.text,
      tableData: hardProb2.tableData,
      options: optionsQ10,
      correctText: hardProb2.correctStr,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function BarosExercisesPage() {
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

  // Χειρισμος Input με καθαρισμο χαρακτηρων (μονο 0-9 και ενα κομμα, οριο 10 χαρακτηρων)
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
      title="Ασκήσεις: Μονάδες Βάρους & Μετατροπές - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στις μονάδες μέτρησης βάρους (t, kg, g, mg), μικτό, καθαρό βάρος και απόβαρο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/60-baros"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      {/* Container πληρους ευρους για κινητα εως 2K, 4K & 8K */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-32 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ασκήσεις &amp; Προβλήματα: Μονάδες Βάρους
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με μετατροπές μονάδων μέτρησης (t, kg, g, mg) και 4 ρεαλιστικά προβλήματα καθαρού βάρους, αποβάρου και φορτίων. Συμπληρώστε τις απαντήσεις σας και ελέγξτε την επίδοσή σας.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation"
            >
              <span>🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>
          </div>
        </section>

        {/* Λιστα 10 Ασκησεων */}
        <div className="space-y-6 sm:space-y-8">
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
                className={`bg-white rounded-3xl border p-5 sm:p-8 2xl:p-10 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλιδα Ερωτησης (Καθαρα ατονα κεφαλαια εκτος ΣΤ') */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {toCleanUppercase(q.title)}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs 2xl:text-sm font-bold px-3 py-1 rounded-full ${
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
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>

                  {/* Πινακας Δεδομενων (αν υπαρχει) */}
                  {q.tableData && (
                    <div className="inline-block max-w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 shadow-inner my-2 font-mono text-xs sm:text-sm 2xl:text-base">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                        <span className="bg-blue-100/60 px-2 py-0.5 rounded-lg text-blue-900 break-words">{q.tableData.col1}</span>
                        <span className="bg-emerald-100/60 px-2 py-0.5 rounded-lg text-emerald-900 break-words">{q.tableData.col2}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                        <span>{q.tableData.r1[0]}</span>
                        <span className="text-indigo-700 font-bold">{q.tableData.r1[1]}</span>
                        <span>{q.tableData.r2[0]}</span>
                        <span className="text-amber-600 font-black">{q.tableData.r2[1]}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-3">
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
                      <span className="text-xs 2xl:text-sm text-slate-500">
                        (Ακέραιος η δεκαδικός με κόμμα)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) - Χωρις truncate, πληρες κειμενο break-words */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1">
                              {opt.text}
                            </span>
                            <span
                              className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-xs ${
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
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-1.5 ${
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
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Απαντήσεων</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          
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
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                ΕΛΕΓΧΟΣ
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
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

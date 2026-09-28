// pages/st-dimotikou/58-mesos-oros-ask.js
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

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Δεξαμενη Κανονικων Προβληματων Μεσου Ορου (10 διαφορετικα προβληματα)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_avg_std_1',
    generate: () => {
      const g1 = randInt(14, 18);
      const g2 = randInt(15, 19);
      const g3 = randInt(16, 20);
      const g4 = randInt(13, 17);
      const sum = g1 + g2 + g3 + g4;
      const avg = sum / 4;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        text: `Ένας μαθητής της ΣΤ' Δημοτικού έγραψε στα τέσσερα μαθήματα βαθμούς: ${g1}, ${g2}, ${g3} και ${g4}. Ποιος είναι ο μέσος όρος της βαθμολογίας του;`,
        tableData: { col1: 'Μάθημα', col2: 'Βαθμός', r1: ['1ο & 2ο', `${g1} και ${g2}`], r2: ['3ο & 4ο', `${g3} και ${g4}`] },
        correctVal: cleanAvg,
        correctStr: formatNum(cleanAvg),
        explanation: `Αθροίζουμε όλους τους βαθμούς: ${g1} ＋ ${g2} ＋ ${g3} ＋ ${g4} ＝ ${sum}. Διαιρούμε με το πλήθος των μαθημάτων (4): ${sum} : 4 ＝ ${formatNum(cleanAvg)}.`
      };
    }
  },
  {
    id: 'p_avg_std_2',
    generate: () => {
      const p1 = randInt(10, 16);
      const p2 = randInt(12, 18);
      const p3 = 0; // Αγωνας με 0 ποντους (παγιδα)
      const p4 = randInt(14, 22);
      const sum = p1 + p2 + p3 + p4;
      const avg = sum / 4;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        text: `Μια αθλήτρια μπάσκετ σε 4 αγώνες σημείωσε: ${p1}, ${p2}, ${p3} και ${p4} πόντους. Ποιος είναι ο μέσος όρος πόντων της ανά αγώνα;`,
        tableData: { col1: 'Αγώνες 1-2', col2: 'Αγώνες 3-4', r1: [`${p1} π.`, `${p3} π.`], r2: [`${p2} π.`, `${p4} π.`] },
        correctVal: cleanAvg,
        correctStr: formatNum(cleanAvg),
        explanation: `Προσέχουμε ότι ο αγώνας με τους 0 πόντους μετράει κανονικά στο πλήθος των αγώνων! Συνολικοί πόντοι: ${p1} ＋ ${p2} ＋ ${p3} ＋ ${p4} ＝ ${sum}. Διαιρούμε με το 4: ${sum} : 4 ＝ ${formatNum(cleanAvg)} πόντοι ανά αγώνα.`
      };
    }
  },
  {
    id: 'p_avg_std_3',
    generate: () => {
      const c1 = randInt(6, 8) * 10;
      const c2 = randInt(5, 7) * 10;
      const c3 = randInt(7, 9) * 10;
      const sum = c1 + c2 + c3;
      const avg = sum / 3;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        text: `Ένα σούπερ μάρκετ είχε τις τρεις πρώτες ημέρες της εβδομάδας ${c1}, ${c2} και ${c3} πελάτες αντίστοιχα. Ποιος ήταν ο μέσος όρος πελατών ανά ημέρα;`,
        tableData: { col1: 'Ημέρες 1-2', col2: 'Ημέρα 3', r1: [`${c1} πελ.`, `${c3} πελ.`], r2: [`${c2} πελ.`, '—'] },
        correctVal: cleanAvg,
        correctStr: formatNum(cleanAvg),
        explanation: `Συνολικοί πελάτες: ${c1} ＋ ${c2} ＋ ${c3} ＝ ${sum}. Διαιρούμε με τις 3 ημέρες: ${sum} : 3 ＝ ${formatNum(cleanAvg)} πελάτες.`
      };
    }
  },
  {
    id: 'p_avg_std_4',
    generate: () => {
      const t1 = randInt(14, 18);
      const t2 = randInt(19, 23);
      const t3 = randInt(22, 26);
      const t4 = randInt(17, 21);
      const t5 = randInt(13, 17);
      const sum = t1 + t2 + t3 + t4 + t5;
      const avg = sum / 5;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        text: `Σε έναν μετεωρολογικό σταθμό καταγράφηκαν οι μεσημεριανές θερμοκρασίες για 5 συνεχόμενες ημέρες: ${t1}°C, ${t2}°C, ${t3}°C, ${t4}°C και ${t5}°C. Ποια ήταν η μέση θερμοκρασία (°C);`,
        tableData: { col1: 'Ημέρες 1-3', col2: 'Ημέρες 4-5', r1: [`${t1}°, ${t2}°`, `${t4}°C`], r2: [`${t3}°C`, `${t5}°C`] },
        correctVal: cleanAvg,
        correctStr: formatNum(cleanAvg),
        explanation: `Άθροισμα θερμοκρασιών: ${t1} ＋ ${t2} ＋ ${t3} ＋ ${t4} ＋ ${t5} ＝ ${sum}°C. Διαιρούμε με τις 5 ημέρες: ${sum} : 5 ＝ ${formatNum(cleanAvg)}°C.`
      };
    }
  },
  {
    id: 'p_avg_std_5',
    generate: () => {
      const b1 = randInt(25, 45);
      const b2 = randInt(30, 50);
      const b3 = randInt(20, 40);
      const sum = b1 + b2 + b3;
      const avg = sum / 3;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        text: `Τρεις φίλοι διάβασαν στις διακοπές τους: ο πρώτος ${b1} σελίδες, ο δεύτερος ${b2} σελίδες και ο τρίτος ${b3} σελίδες. Πόσες σελίδες διάβασε κατά μέσο όρο το κάθε παιδί;`,
        tableData: { col1: 'Παιδί 1 & 2', col2: 'Παιδί 3', r1: [`${b1} σελ.`, `${b3} σελ.`], r2: [`${b2} σελ.`, '—'] },
        correctVal: cleanAvg,
        correctStr: formatNum(cleanAvg),
        explanation: `Σύνολο σελίδων: ${b1} ＋ ${b2} ＋ ${b3} ＝ ${sum}. Μέσος όρος: ${sum} : 3 ＝ ${formatNum(cleanAvg)} σελίδες ανά παιδί.`
      };
    }
  },
  {
    id: 'p_avg_std_6',
    generate: () => {
      const w1 = randInt(35, 42);
      const w2 = randInt(38, 45);
      const w3 = randInt(40, 48);
      const w4 = randInt(36, 44);
      const sum = w1 + w2 + w3 + w4;
      const avg = sum / 4;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        text: `Το βάρος τεσσάρων μαθητών είναι ${w1} kg, ${w2} kg, ${w3} kg και ${w4} kg. Ποιο είναι το μέσο βάρος (σε kg) των μαθητών;`,
        tableData: { col1: 'Μαθητές 1-2', col2: 'Μαθητές 3-4', r1: [`${w1} kg`, `${w3} kg`], r2: [`${w2} kg`, `${w4} kg`] },
        correctVal: cleanAvg,
        correctStr: formatNum(cleanAvg),
        explanation: `Συνολικό βάρος: ${w1} ＋ ${w2} ＋ ${w3} ＋ ${w4} ＝ ${sum} kg. Διαιρούμε με το 4: ${sum} : 4 ＝ ${formatNum(cleanAvg)} kg.`
      };
    }
  },
  {
    id: 'p_avg_std_7',
    generate: () => {
      const d1 = randInt(45, 60);
      const d2 = randInt(40, 55);
      const d3 = randInt(50, 70);
      const d4 = randInt(35, 50);
      const sum = d1 + d2 + d3 + d4;
      const avg = sum / 4;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        text: `Ένας δρομέας έτρεξε σε 4 προπονήσεις: ${d1} min, ${d2} min, ${d3} min και ${d4} min. Ποια ήταν η μέση διάρκεια της προπόνησής του σε λεπτά;`,
        tableData: { col1: 'Προπονήσεις 1-2', col2: 'Προπονήσεις 3-4', r1: [`${d1} min`, `${d3} min`], r2: [`${d2} min`, `${d4} min`] },
        correctVal: cleanAvg,
        correctStr: formatNum(cleanAvg),
        explanation: `Συνολικός χρόνος: ${d1} ＋ ${d2} ＋ ${d3} ＋ ${d4} ＝ ${sum} λεπτά. Μέση διάρκεια: ${sum} : 4 ＝ ${formatNum(cleanAvg)} λεπτά.`
      };
    }
  },
  {
    id: 'p_avg_std_8',
    generate: () => {
      const e1 = randInt(15, 25);
      const e2 = randInt(10, 20);
      const e3 = randInt(20, 35);
      const sum = e1 + e2 + e3;
      const avg = sum / 3;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        text: `Μια οικογένεια ξόδεψε για ηλεκτρικό ρεύμα σε τρεις διαδοχικούς λογαριασμούς: ${e1} €, ${e2} € και ${e3} €. Ποιο ήταν το μέσο έξοδο ανά λογαριασμό σε €;`,
        tableData: { col1: 'Λογαριασμοί 1-2', col2: 'Λογαριασμός 3', r1: [`${e1} €`, `${e3} €`], r2: [`${e2} €`, '—'] },
        correctVal: cleanAvg,
        correctStr: formatNum(cleanAvg),
        explanation: `Συνολικά έξοδα: ${e1} ＋ ${e2} ＋ ${e3} ＝ ${sum} €. Διαιρούμε με το 3: ${sum} : 3 ＝ ${formatNum(cleanAvg)} €.`
      };
    }
  },
  {
    id: 'p_avg_std_9',
    generate: () => {
      const m1 = randInt(3, 7);
      const m2 = randInt(4, 8);
      const m3 = randInt(2, 6);
      const m4 = randInt(5, 9);
      const sum = m1 + m2 + m3 + m4;
      const avg = sum / 4;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        text: `Ένα κατάστημα πούλησε σε 4 ημέρες: ${m1}, ${m2}, ${m3} και ${m4} ποδήλατα. Πόσα ποδήλατα πουλούσε κατά μέσο όρο την ημέρα;`,
        tableData: { col1: 'Ημέρες 1-2', col2: 'Ημέρες 3-4', r1: [`${m1} ποδ.`, `${m3} ποδ.`], r2: [`${m2} ποδ.`, `${m4} ποδ.`] },
        correctVal: cleanAvg,
        correctStr: formatNum(cleanAvg),
        explanation: `Συνολικά ποδήλατα: ${m1} ＋ ${m2} ＋ ${m3} ＋ ${m4} ＝ ${sum}. Μέσος όρος: ${sum} : 4 ＝ ${formatNum(cleanAvg)} ποδήλατα ανά ημέρα.`
      };
    }
  },
  {
    id: 'p_avg_std_10',
    generate: () => {
      const g1 = randInt(1, 3);
      const g2 = randInt(0, 2);
      const g3 = randInt(2, 4);
      const sum = g1 + g2 + g3;
      const avg = sum / 3;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        text: `Μια ποδοσφαιρική ομάδα σε 3 αγώνες πέτυχε ${g1}, ${g2} και ${g3} γκολ. Ποιος είναι ο μέσος όρος των γκολ ανά αγώνα;`,
        tableData: { col1: 'Αγώνες 1-2', col2: 'Αγώνας 3', r1: [`${g1} γκολ`, `${g3} γκολ`], r2: [`${g2} γκολ`, '—'] },
        correctVal: cleanAvg,
        correctStr: formatNum(cleanAvg),
        explanation: `Συνολικά γκολ: ${g1} ＋ ${g2} ＋ ${g3} ＝ ${sum}. Διαιρούμε με τους 3 αγώνες: ${sum} : 3 ＝ ${formatNum(cleanAvg)} γκολ ανά αγώνα.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (Αντιστροφοι Υπολογισμοι & Στοχοι)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_avg_hard_1',
    generate: () => {
      const targetAvg = randInt(16, 18);
      const g1 = targetAvg - randInt(1, 3);
      const g2 = targetAvg + randInt(0, 2);
      const g3 = targetAvg - randInt(0, 2);
      const currentSum = g1 + g2 + g3;
      const requiredSum = targetAvg * 4;
      const g4 = requiredSum - currentSum;
      return {
        text: `Ένας μαθητής έγραψε στα τρία πρώτα τεστ βαθμούς ${g1}, ${g2} και ${g3}. Τι βαθμό πρέπει να γράψει στο 4ο τεστ για να έχει τελικό μέσο όρο ακριβώς ${targetAvg};`,
        tableData: { col1: 'Τεστ 1, 2, 3', col2: 'Στόχος Μ.Ο.', r1: [`${g1}, ${g2}, ${g3}`, `${targetAvg}`], r2: ['Άθροισμα: ' + currentSum, '4 τεστ'] },
        correctVal: g4,
        correctStr: String(g4),
        explanation: `Για να έχει μέσο όρο ${targetAvg} σε 4 τεστ, το συνολικό άθροισμα των βαθμών του πρέπει να είναι: 4 · ${targetAvg} ＝ ${requiredSum}. Στα τρία πρώτα τεστ έχει συγκεντρώσει: ${g1} ＋ ${g2} ＋ ${g3} ＝ ${currentSum}. Άρα στο 4ο τεστ χρειάζεται: ${requiredSum} － ${currentSum} ＝ ${g4}.`
      };
    }
  },
  {
    id: 'p_avg_hard_2',
    generate: () => {
      const count = 5;
      const avgAge = randInt(11, 14);
      const totalAge = count * avgAge;
      const newChildAge = randInt(16, 18);
      const newTotal = totalAge + newChildAge;
      const newCount = count + 1;
      const newAvg = newTotal / newCount;
      const cleanNewAvg = Number.isInteger(newAvg) ? newAvg : Number(newAvg.toFixed(2));
      return {
        text: `Μια ομάδα 5 παιδιών έχει μέσο όρο ηλικίας ${avgAge} έτη. Στην ομάδα προστίθεται ένα νέο παιδί ηλικίας ${newChildAge} ετών. Ποιος είναι ο νέος μέσος όρος ηλικίας της ομάδας (6 παιδιά);`,
        tableData: { col1: 'Αρχική Ομάδα', col2: 'Νέο Παιδί', r1: [`5 παιδιά (Μ.Ο. ${avgAge})`, `${newChildAge} ετών`], r2: [`Σύνολο: ${totalAge} έτη`, 'Νέο πλήθος: 6'] },
        correctVal: cleanNewAvg,
        correctStr: formatNum(cleanNewAvg),
        explanation: `Το αρχικό άθροισμα ηλικιών των 5 παιδιών είναι: 5 · ${avgAge} ＝ ${totalAge} έτη. Με το νέο παιδί, το νέο άθροισμα γίνεται: ${totalAge} ＋ ${newChildAge} ＝ ${newTotal} έτη. Διαιρούμε με το νέο πλήθος των παιδιών (6): ${newTotal} : 6 ＝ ${formatNum(cleanNewAvg)} έτη.`
      };
    }
  },
  {
    id: 'p_avg_hard_3',
    generate: () => {
      const days = 7;
      const targetWeeklyAvg = randInt(15, 20);
      const totalSum = days * targetWeeklyAvg;
      const first6Sum = totalSum - randInt(12, 22);
      const lastDayTemp = totalSum - first6Sum;
      return {
        text: `Σε μια πόλη η μέση θερμοκρασία μιας εβδομάδας (7 ημέρες) ήταν ${targetWeeklyAvg}°C. Το άθροισμα των θερμοκρασιών των πρώτων 6 ημερών ήταν ${first6Sum}°C. Ποια ήταν η θερμοκρασία (°C) την 7η ημέρα;`,
        tableData: { col1: 'Εβδομάδα (7 ημ.)', col2: 'Πρώτες 6 ημέρες', r1: [`Μ.Ο. ＝ ${targetWeeklyAvg}°C`, `Σύνολο ＝ ${first6Sum}°C`], r2: [`Σύνολο: ${totalSum}°C`, '7η ημέρα: χ'] },
        correctVal: lastDayTemp,
        correctStr: String(lastDayTemp),
        explanation: `Το συνολικό άθροισμα των 7 ημερών είναι: 7 · ${targetWeeklyAvg} ＝ ${totalSum}°C. Αφαιρούμε το άθροισμα των πρώτων 6 ημερών: ${totalSum} － ${first6Sum} ＝ ${lastDayTemp}°C.`
      };
    }
  },
  {
    id: 'p_avg_hard_4',
    generate: () => {
      const workers = 4;
      const avgSalary = randInt(85, 110) * 10; // π.χ. 950 €
      const totalSalaries = workers * avgSalary;
      const s1 = avgSalary - 100;
      const s2 = avgSalary + 150;
      const s3 = avgSalary - 50;
      const s4 = totalSalaries - (s1 + s2 + s3);
      return {
        text: `Τέσσερις εργαζόμενοι έχουν μέσο μηνιαίο μισθό ${avgSalary} €. Αν οι τρεις πρώτοι αμείβονται με ${s1} €, ${s2} € και ${s3} €, ποιος είναι ο μισθός του τέταρτου εργαζομένου σε €;`,
        tableData: { col1: 'Εργαζόμενοι 1, 2, 3', col2: 'Μέσος Μισθός (4)', r1: [`${s1} €, ${s2} €, ${s3} €`, `${avgSalary} €`], r2: [`Σύνολο 3: ${s1 + s2 + s3} €`, 'Σύνολο 4: ' + totalSalaries + ' €'] },
        correctVal: s4,
        correctStr: String(s4),
        explanation: `Το σύνολο των μισθών των 4 εργαζομένων είναι: 4 · ${avgSalary} ＝ ${totalSalaries} €. Το άθροισμα των τριών πρώτων είναι: ${s1} ＋ ${s2} ＋ ${s3} ＝ ${s1 + s2 + s3} €. Άρα ο 4ος παίρνει: ${totalSalaries} － ${s1 + s2 + s3} ＝ ${s4} €.`
      };
    }
  },
  {
    id: 'p_avg_hard_5',
    generate: () => {
      const matches = 6;
      const avgGoals = 2.5;
      const totalGoals = matches * avgGoals; // 15
      const first5 = 12;
      const lastMatchGoals = totalGoals - first5; // 3
      return {
        text: `Σε ένα πρωτάθλημα 6 αγώνων, μια ομάδα είχε μέσο όρο επίθεσης ${formatNum(avgGoals)} γκολ ανά αγώνα. Αν στους πρώτους 5 αγώνες σημείωσε συνολικά ${first5} γκολ, πόσα γκολ πέτυχε στον 6ο αγώνα;`,
        tableData: { col1: '6 Αγώνες', col2: 'Πρώτοι 5 αγώνες', r1: [`Μ.Ο. ＝ ${formatNum(avgGoals)} γκολ`, `${first5} γκολ συνολικά`], r2: [`Σύνολο: ${totalGoals} γκολ`, '6ος αγώνας: χ'] },
        correctVal: lastMatchGoals,
        correctStr: String(lastMatchGoals),
        explanation: `Τα συνολικά γκολ στους 6 αγώνες είναι: 6 · ${formatNum(avgGoals)} ＝ ${totalGoals} γκολ. Αφαιρούμε τα γκολ των 5 πρώτων αγώνων: ${totalGoals} － ${first5} ＝ ${lastMatchGoals} γκολ.`
      };
    }
  },
  {
    id: 'p_avg_hard_6',
    generate: () => {
      const n1 = randInt(12, 16);
      const n2 = randInt(18, 22);
      const n3 = randInt(24, 30);
      const sum = n1 + n2 + n3;
      const avg = sum / 3;
      const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));
      return {
        text: `Τρεις αριθμοί έχουν μέσο όρο ${formatNum(cleanAvg)}. Αν οι δύο πρώτοι αριθμοί είναι το ${n1} και το ${n2}, ποιος είναι ο τρίτος αριθμός;`,
        tableData: { col1: 'Αριθμοί 1 & 2', col2: 'Μέσος Όρος (3)', r1: [`${n1} και ${n2}`, `${formatNum(cleanAvg)}`], r2: [`Άθροισμα: ${n1 + n2}`, '3 αριθμοί'] },
        correctVal: n3,
        correctStr: String(n3),
        explanation: `Το άθροισμα και των τριών αριθμών είναι: 3 · ${formatNum(cleanAvg)} ＝ ${sum}. Αφαιρούμε τους δύο γνωστούς αριθμούς: ${sum} － (${n1} ＋ ${n2}) ＝ ${sum} － ${n1 + n2} ＝ ${n3}.`
      };
    }
  },
  {
    id: 'p_avg_hard_7',
    generate: () => {
      const items = 5;
      const avgWeight = 2.4; // kg
      const totalWeight = items * avgWeight; // 12 kg
      const fourWeight = 9.8;
      const fifthWeight = Number((totalWeight - fourWeight).toFixed(2));
      return {
        text: `Το μέσο βάρος 5 δεμάτων είναι ${formatNum(avgWeight)} kg. Αν τα 4 από αυτά ζυγίζουν συνολικά ${formatNum(fourWeight)} kg, πόσα kg ζυγίζει το πέμπτο δέμα;`,
        tableData: { col1: '5 Δέματα', col2: '4 Δέματα', r1: [`Μ.Ο. ＝ ${formatNum(avgWeight)} kg`, `Σύνολο ＝ ${formatNum(fourWeight)} kg`], r2: [`Σύνολο 5: ${formatNum(totalWeight)} kg`, '5ο δέμα: χ'] },
        correctVal: fifthWeight,
        correctStr: formatNum(fifthWeight),
        explanation: `Το συνολικό βάρος των 5 δεμάτων είναι: 5 · ${formatNum(avgWeight)} ＝ ${formatNum(totalWeight)} kg. Αφαιρούμε το βάρος των υπόλοιπων 4: ${formatNum(totalWeight)} － ${formatNum(fourWeight)} ＝ ${formatNum(fifthWeight)} kg.`
      };
    }
  },
  {
    id: 'p_avg_hard_8',
    generate: () => {
      const students = 10;
      const avgBooks = 4;
      const initialTotal = students * avgBooks; // 40
      const extraBooks = 10;
      const newTotal = initialTotal + extraBooks; // 50
      const newAvg = newTotal / students; // 5
      return {
        text: `Σε ένα τμήμα 10 μαθητών κάθε παιδί διάβασε κατά μέσο όρο ${avgBooks} βιβλία. Αν η βιβλιοθήκη δωρίσει άλλα ${extraBooks} βιβλία που διαβάστηκαν όλα από τους μαθητές, ποιος θα είναι ο νέος μέσος όρος βιβλίων ανά μαθητή;`,
        tableData: { col1: 'Αρχικά Βιβλία', col2: 'Επιπλέον Βιβλία', r1: [`10 μαθ. (Μ.Ο. ${avgBooks})`, `${extraBooks} νέα βιβλία`], r2: [`Σύνολο: ${initialTotal}`, `Νέο σύνολο: ${newTotal}`] },
        correctVal: newAvg,
        correctStr: String(newAvg),
        explanation: `Αρχικά διαβάστηκαν συνολικά: 10 · ${avgBooks} ＝ ${initialTotal} βιβλία. Μαζί με τα νέα βιβλία έχουμε: ${initialTotal} ＋ ${extraBooks} ＝ ${newTotal} βιβλία. Νέος μέσος όρος: ${newTotal} : 10 ＝ ${newAvg} βιβλία ανά μαθητή.`
      };
    }
  },
  {
    id: 'p_avg_hard_9',
    generate: () => {
      const targetDailyAvg = 30; // km
      const totalKm = 7 * targetDailyAvg; // 210 km
      const first6Km = 175;
      const lastDayKm = totalKm - first6Km; // 35 km
      return {
        text: `Ένας ποδηλάτης θέλει να καλύψει σε μια εβδομάδα (7 ημέρες) κατά μέσο όρο ${targetDailyAvg} km την ημέρα. Τις πρώτες 6 ημέρες διένυσε συνολικά ${first6Km} km. Πόσα km πρέπει να διανύσει την 7η ημέρα;`,
        tableData: { col1: 'Στόχος Εβδομάδας', col2: 'Πρώτες 6 ημέρες', r1: [`Μ.Ο. ＝ ${targetDailyAvg} km/ημ.`, `${first6Km} km συνολικά`], r2: [`Σύνολο: ${totalKm} km`, '7η ημέρα: χ'] },
        correctVal: lastDayKm,
        correctStr: String(lastDayKm),
        explanation: `Συνολικά χιλιόμετρα που απαιτούνται στις 7 ημέρες: 7 · ${targetDailyAvg} ＝ ${totalKm} km. Την 7η ημέρα πρέπει να καλύψει: ${totalKm} － ${first6Km} ＝ ${lastDayKm} km.`
      };
    }
  },
  {
    id: 'p_avg_hard_10',
    generate: () => {
      const count = 4;
      const avg = 25;
      const total = count * avg; // 100
      const a = 20;
      const b = 30;
      const c = 15;
      const d = total - (a + b + c); // 35
      return {
        text: `Ο μέσος όρος τεσσάρων αριθμών είναι ${avg}. Αν οι τρεις αριθμοί είναι ${a}, ${b} και ${c}, ποιος είναι ο τέταρτος αριθμός;`,
        tableData: { col1: 'Τρεις Αριθμοί', col2: 'Μέσος Όρος (4)', r1: [`${a}, ${b}, ${c}`, `${avg}`], r2: [`Άθροισμα: ${a + b + c}`, '4 αριθμοί'] },
        correctVal: d,
        correctStr: String(d),
        explanation: `Το άθροισμα και των τεσσάρων αριθμών είναι: 4 · ${avg} ＝ ${total}. Το άθροισμα των τριών γνωστών είναι: ${a} ＋ ${b} ＋ ${c} ＝ ${a + b + c}. Ο τέταρτος αριθμός είναι: ${total} － ${a + b + c} ＝ ${d}.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Απλός υπολογισμός μέσου όρου 3 ακέραιων τιμών
  {
    const a = randInt(10, 18);
    const b = randInt(12, 22);
    const c = randInt(14, 24);
    const sum = a + b + c;
    const avg = sum / 3;
    const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΒΑΣΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΜΕΣΟΥ ΟΡΟΥ',
      instruction: 'Υπολογίστε τον μέσο όρο των παρακάτω αριθμών:',
      prompt: `Ποιος είναι ο μέσος όρος των αριθμών ${a}, ${b} και ${c};`,
      correctVal: cleanAvg,
      correctStr: formatNum(cleanAvg),
      explanation: `Προσθέτουμε όλους τους αριθμούς: ${a} ＋ ${b} ＋ ${c} ＝ ${sum}. Διαιρούμε με το πλήθος τους (3): ${sum} : 3 ＝ ${formatNum(cleanAvg)}.`
    });
  }

  // Q2 (MCQ): Μαθηματικός τύπος και ορισμός μέσου όρου
  {
    const correctDef = 'Διαιρούμε το άθροισμα όλων των τιμών με το πλήθος των τιμών';
    const fake1 = 'Πολλαπλασιάζουμε τη μικρότερη τιμή με τη μεγαλύτερη';
    const fake2 = 'Αφαιρούμε τη μικρότερη τιμή από το άθροισμα των υπόλοιπων';
    const fake3 = 'Διαιρούμε πάντα με το 100 όπως στα ποσοστά';

    const options = [
      { text: correctDef, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΜΑΘΗΜΑΤΙΚΟΣ ΟΡΙΣΜΟΣ ΜΕΣΗΣ ΤΙΜΗΣ',
      instruction: 'Επιλέξτε τον σωστό κανόνα υπολογισμού:',
      prompt: 'Πώς υπολογίζουμε τον μέσο όρο (μέση τιμή) μιας ομάδας δεδομένων;',
      options,
      correctText: correctDef,
      explanation: 'Ο μέσος όρος ισούται πάντοτε με το άθροισμα όλων των τιμών διαιρεμένο με το πλήθος των τιμών.'
    });
  }

  // Q3 (Input - Decimal): Μέσος όρος με την παρουσία μηδενικής τιμής (παγίδα)
  {
    const a = randInt(12, 18);
    const b = 0;
    const c = randInt(16, 24);
    const d = randInt(14, 22);
    const sum = a + b + c + d;
    const avg = sum / 4;
    const cleanAvg = Number.isInteger(avg) ? avg : Number(avg.toFixed(2));

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΜΕΣΟΣ ΟΡΟΣ ΜΕ ΜΗΔΕΝΙΚΗ ΤΙΜΗ',
      instruction: 'Προσέξτε το πλήθος των τιμών και υπολογίστε τον μέσο όρο:',
      prompt: `Βρείτε τον μέσο όρο των τεσσάρων αριθμών: ${a}, ${b}, ${c} και ${d}:`,
      correctVal: cleanAvg,
      correctStr: formatNum(cleanAvg),
      explanation: `Το μηδέν (0) συμμετέχει κανονικά στο πλήθος των τιμών! Άθροισμα: ${a} ＋ ${b} ＋ ${c} ＋ ${d} ＝ ${sum}. Διαιρούμε με το 4: ${sum} : 4 ＝ ${formatNum(cleanAvg)}.`
    });
  }

  // Q4 (MCQ): Ιδιότητα μέσου όρου (εύρος τιμών)
  {
    const minVal = 12;
    const maxVal = 28;
    const correctAns = `Βρίσκεται πάντοτε ανάμεσα στο ${minVal} και στο ${maxVal}`;
    const fake1 = `Είναι πάντοτε μεγαλύτερος από το ${maxVal}`;
    const fake2 = `Είναι πάντοτε ίσος με το μηδέν`;
    const fake3 = `Είναι πάντοτε μικρότερος από το ${minVal}`;

    const options = [
      { text: correctAns, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΙΔΙΟΤΗΤΑ ΤΟΥ ΜΕΣΟΥ ΟΡΟΥ',
      instruction: 'Επιλέξτε τη σωστή μαθηματική πρόταση:',
      prompt: `Αν σε μια ομάδα αριθμών η μικρότερη τιμή είναι το ${minVal} και η μεγαλύτερη το ${maxVal}, τι ισχύει υποχρεωτικά για τον μέσο όρο;`,
      options,
      correctText: correctAns,
      explanation: `Ο μέσος όρος εκφράζει την εξισορρόπηση των τιμών, επομένως βρίσκεται πάντοτε αυστηρά ανάμεσα στη μικρότερη και τη μεγαλύτερη τιμή των δεδομένων.`
    });
  }

  // Q5 (Input - Decimal): Αντίστροφος υπολογισμός συνολικού αθροίσματος
  {
    const count = randInt(4, 8);
    const avg = randInt(12, 25);
    const total = count * avg;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΑΝΤΙΣΤΡΟΦΗ ΕΥΡΕΣΗ ΑΘΡΟΙΣΜΑΤΟΣ',
      instruction: 'Υπολογίστε το συνολικό άθροισμα όλων των τιμών:',
      prompt: `Ο μέσος όρος ${count} αριθμών είναι ${avg}. Ποιο είναι το άθροισμα αυτών των ${count} αριθμών;`,
      correctVal: total,
      correctStr: String(total),
      explanation: `Εφόσον Μέσος Όρος ＝ Άθροισμα : Πλήθος, ισχύει αντίστροφα: Άθροισμα ＝ Μέσος Όρος · Πλήθος ＝ ${avg} · ${count} ＝ ${total}.`
    });
  }

  // Q6 (MCQ): Υπολογισμός μέσου όρου δύο ίσων τιμών
  {
    const sameVal = randInt(14, 28);
    const correctValStr = `${sameVal}`;
    const fake1 = `${sameVal * 2}`;
    const fake2 = `${sameVal / 2}`;
    const fake3 = `${sameVal + 2}`;

    const options = [
      { text: correctValStr, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΜΕΣΟΣ ΟΡΟΣ ΙΣΩΝ ΤΙΜΩΝ',
      instruction: 'Επιλέξτε τη σωστή τιμή:',
      prompt: `Αν όλες οι τιμές μιας ομάδας είναι ίσες με ${sameVal}, ποιος είναι ο μέσος όρος τους;`,
      options,
      correctText: correctValStr,
      explanation: `Όταν όλες οι τιμές είναι ίσες μεταξύ τους (π.χ. (${sameVal} ＋ ${sameVal}) : 2 ＝ ${sameVal}), ο μέσος όρος ισούται πάντοτε με την ίδια την τιμή: ${sameVal}.`
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
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΜΕΣΟΥ ΟΡΟΥ',
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
    const fake8B = typeof val8 === 'number' ? formatNum(Math.max(1, val8 - randInt(1, 4))) : '0';
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
      instruction: 'Επιλέξτε τον σωστό μέσο όρο για το πρόβλημα:',
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
      title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΣΤΟΧΟΥ ΜΕΣΟΥ ΟΡΟΥ',
      instruction: 'Υπολογίστε την άγνωστη τιμή που απαιτείται:',
      prompt: hardProb1.text,
      tableData: hardProb1.tableData,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal;
    const fake10A = typeof val10 === 'number' ? formatNum(val10 + randInt(3, 7)) : '0';
    const fake10B = typeof val10 === 'number' ? formatNum(Math.max(1, val10 - randInt(2, 5))) : '0';
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
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΜΕΤΑΒΟΛΗΣ ΜΕΣΟΥ ΟΡΟΥ',
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

export default function MesosOrosExercisesPage() {
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
      title="Ασκήσεις: Μέσος Όρος (Μέση Τιμή) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στον μέσο όρο, τη μέση τιμή, αντίστροφους υπολογισμούς στόχου και επεξεργασία δεδομένων για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/58-mesos-oros"
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
              Ασκήσεις &amp; Προβλήματα: Ο Μέσος Όρος
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες που περιλαμβάνουν 4 ρεαλιστικά προβλήματα (2 βασικά και 2 αυξημένης δυσκολίας με στόχο μέσης τιμής). Υπολογίστε τον μέσο όρο και ελέγξτε τις απαντήσεις σας.
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

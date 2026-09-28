// pages/st-dimotikou/59-mikos-ask.js
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

// Δεξαμενη Κανονικων Προβληματων Μηκους (10 διαφορετικα προβληματα)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_len_std_1',
    generate: () => {
      const ribM = randInt(3, 7);
      const parts = randInt(4, 8);
      const totalCm = ribM * 100;
      const partCm = totalCm / parts;
      const cleanPart = Number.isInteger(partCm) ? partCm : Number(partCm.toFixed(1));
      return {
        text: `Μια κορδέλα έχει μήκος ${ribM} m. Την κόβουμε σε ${parts} ίσα κομμάτια. Πόσα εκατοστά (cm) είναι το μήκος κάθε κομματιού;`,
        tableData: { col1: 'Συνολικό Μήκος', col2: 'Κομμάτια', r1: [`${ribM} m ＝ ${totalCm} cm`, `${parts} ίσα μέρη`], r2: ['Αναγωγή σε cm', 'Διαίρεση : ' + parts] },
        correctVal: cleanPart,
        correctStr: formatNum(cleanPart),
        explanation: `Μετατρέπουμε τα μέτρα σε εκατοστά: ${ribM} · 100 ＝ ${totalCm} cm. Διαιρούμε σε ${parts} ίσα μέρη: ${totalCm} : ${parts} ＝ ${formatNum(cleanPart)} cm.`
      };
    }
  },
  {
    id: 'p_len_std_2',
    generate: () => {
      const rollM = randInt(12, 20);
      const usedCm = randInt(3, 6) * 100 + 50; // π.χ. 350 cm, 450 cm κ.λπ.
      const rollCm = rollM * 100;
      const remainingCm = rollCm - usedCm;
      const remainingM = remainingCm / 100;
      return {
        text: `Από ένα τόπι υφάσματος μήκους ${rollM} m κόπηκε ένα κομμάτι μήκους ${usedCm} cm. Πόσα μέτρα (m) υφάσματος έμειναν στο τόπι;`,
        tableData: { col1: 'Αρχικό Ύφασμα', col2: 'Κομμάτι που κόπηκε', r1: [`${rollM} m`, `${usedCm} cm`], r2: [`${rollCm} cm`, `${formatNum(usedCm / 100)} m`] },
        correctVal: remainingM,
        correctStr: formatNum(remainingM),
        explanation: `Μετατρέπουμε το κομμάτι που κόπηκε σε μέτρα: ${usedCm} : 100 ＝ ${formatNum(usedCm / 100)} m. Αφαιρούμε: ${rollM} － ${formatNum(usedCm / 100)} ＝ ${formatNum(remainingM)} m.`
      };
    }
  },
  {
    id: 'p_len_std_3',
    generate: () => {
      const sideCm = randInt(15, 35) * 10; // π.χ. 250 cm
      const perimCm = sideCm * 4;
      const perimM = perimCm / 100;
      return {
        text: `Ένα τετράγωνο παρτέρι έχει πλευρά μήκους ${sideCm} cm. Πόσα μέτρα (m) είναι η περίμετρος του παρτεριού;`,
        tableData: { col1: 'Πλευρά Τετραγώνου', col2: 'Περίμετρος (4 πλευρές)', r1: [`${sideCm} cm`, `4 · ${sideCm} cm`], r2: [`${formatNum(sideCm / 100)} m`, 'Μετατροπή σε m'] },
        correctVal: perimM,
        correctStr: formatNum(perimM),
        explanation: `Η περίμετρος του τετραγώνου είναι 4 · ${sideCm} ＝ ${perimCm} cm. Μετατρέπουμε σε μέτρα διαιρώντας με το 100: ${perimCm} : 100 ＝ ${formatNum(perimM)} m.`
      };
    }
  },
  {
    id: 'p_len_std_4',
    generate: () => {
      const stepCm = randInt(65, 80);
      const steps = randInt(20, 50) * 10;
      const totalCm = stepCm * steps;
      const totalM = totalCm / 100;
      return {
        text: `Το βήμα ενός περιπατητή έχει μήκος ${stepCm} cm. Αν έκανε ${steps} βήματα σε ευθεία γραμμή, πόσα μέτρα (m) διένυσε;`,
        tableData: { col1: 'Μήκος Βήματος', col2: 'Συνολικά Βήματα', r1: [`${stepCm} cm`, `${steps} βήματα`], r2: ['Γινόμενο σε cm', 'Μετατροπή σε m'] },
        correctVal: totalM,
        correctStr: formatNum(totalM),
        explanation: `Συνολική απόσταση σε εκατοστά: ${stepCm} · ${steps} ＝ ${totalCm} cm. Μετατρέπουμε σε μέτρα: ${totalCm} : 100 ＝ ${formatNum(totalM)} m.`
      };
    }
  },
  {
    id: 'p_len_std_5',
    generate: () => {
      const p1Km = randInt(2, 4);
      const p2M = randInt(3, 7) * 100;
      const totalM = p1Km * 1000 + p2M;
      return {
        text: `Ένας αθλητής διένυσε ${p1Km} km στο πρώτο τμήμα της προπόνησης και άλλα ${p2M} m στο δεύτερο. Πόσα μέτρα (m) διένυσε συνολικά;`,
        tableData: { col1: '1ο Τμήμα', col2: '2ο Τμήμα', r1: [`${p1Km} km ＝ ${p1Km * 1000} m`, `${p2M} m`], r2: ['Πρόσθεση σε m', 'Σύνολο'] },
        correctVal: totalM,
        correctStr: String(totalM),
        explanation: `Μετατρέπουμε τα χιλιόμετρα σε μέτρα: ${p1Km} · 1.000 ＝ ${p1Km * 1000} m. Προσθέτουμε: ${p1Km * 1000} ＋ ${p2M} ＝ ${totalM} m.`
      };
    }
  },
  {
    id: 'p_len_std_6',
    generate: () => {
      const boardDm = randInt(18, 30);
      const cutCm = randInt(4, 9) * 10;
      const boardCm = boardDm * 10;
      const remainCm = boardCm - cutCm;
      return {
        text: `Μια ξύλινη σανίδα είχε αρχικό μήκος ${boardDm} dm. Ο μαραγκός έκοψε ένα κομμάτι μήκους ${cutCm} cm. Πόσα εκατοστά (cm) σανίδας απέμειναν;`,
        tableData: { col1: 'Αρχικό Μήκος', col2: 'Κομμάτι που κόπηκε', r1: [`${boardDm} dm`, `${cutCm} cm`], r2: [`${boardCm} cm`, 'Αφαίρεση'] },
        correctVal: remainCm,
        correctStr: String(remainCm),
        explanation: `Μετατρέπουμε τα δεκατόμετρα σε εκατοστά: ${boardDm} · 10 ＝ ${boardCm} cm. Αφαιρούμε: ${boardCm} － ${cutCm} ＝ ${remainCm} cm.`
      };
    }
  },
  {
    id: 'p_len_std_7',
    generate: () => {
      const bookMm = randInt(15, 30);
      const books = randInt(12, 25);
      const totalMm = bookMm * books;
      const totalCm = totalMm / 10;
      return {
        text: `Ένα βιβλίο έχει πάχος ${bookMm} mm. Τοποθετούμε ${books} ίδια βιβλία το ένα πάνω στο άλλο. Πόσα εκατοστά (cm) είναι το συνολικό ύψος της στοίβας;`,
        tableData: { col1: 'Πάχος Βιβλίου', col2: 'Πλήθος Βιβλίων', r1: [`${bookMm} mm`, `${books} τεμάχια`], r2: [`${totalMm} mm`, 'Μετατροπή σε cm'] },
        correctVal: totalCm,
        correctStr: formatNum(totalCm),
        explanation: `Συνολικό ύψος σε χιλιοστά: ${bookMm} · ${books} ＝ ${totalMm} mm. Μετατρέπουμε σε εκατοστά διαιρώντας με το 10: ${totalMm} : 10 ＝ ${formatNum(totalCm)} cm.`
      };
    }
  },
  {
    id: 'p_len_std_8',
    generate: () => {
      const lM = randInt(8, 14);
      const wM = randInt(4, 7);
      const perimM = 2 * (lM + wM);
      const perimDm = perimM * 10;
      return {
        text: `Μια ορθογώνια αίθουσα έχει μήκος ${lM} m και πλάτος ${wM} m. Πόσα δεκατόμετρα (dm) είναι η περίμετρος της αίθουσας;`,
        tableData: { col1: 'Διαστάσεις', col2: 'Περίμετρος', r1: [`Μήκος: ${lM} m`, `2 · (${lM} ＋ ${wM}) ＝ ${perimM} m`], r2: [`Πλάτος: ${wM} m`, 'Μετατροπή σε dm'] },
        correctVal: perimDm,
        correctStr: String(perimDm),
        explanation: `Υπολογίζουμε την περίμετρο σε μέτρα: 2 · (${lM} ＋ ${wM}) ＝ 2 · ${lM + wM} ＝ ${perimM} m. Μετατρέπουμε σε δεκατόμετρα πολλαπλασιάζοντας με το 10: ${perimM} · 10 ＝ ${perimDm} dm.`
      };
    }
  },
  {
    id: 'p_len_std_9',
    generate: () => {
      const tileCm = randInt(25, 50);
      const tilesCount = randInt(30, 60);
      const totalCm = tileCm * tilesCount;
      const totalM = totalCm / 100;
      return {
        text: `Τοποθετήθηκαν στη σειρά ${tilesCount} πλακάκια πλευράς ${tileCm} cm το καθένα. Πόσα μέτρα (m) είναι το συνολικό μήκος της γραμμής που σχημάτισαν;`,
        tableData: { col1: 'Πλακάκι', col2: 'Πλήθος', r1: [`${tileCm} cm`, `${tilesCount} πλακάκια`], r2: [`${totalCm} cm`, 'Αναγωγή σε m'] },
        correctVal: totalM,
        correctStr: formatNum(totalM),
        explanation: `Συνολικό μήκος σε εκατοστά: ${tilesCount} · ${tileCm} ＝ ${totalCm} cm. Μετατρέπουμε σε μέτρα διαιρώντας με το 100: ${totalCm} : 100 ＝ ${formatNum(totalM)} m.`
      };
    }
  },
  {
    id: 'p_len_std_10',
    generate: () => {
      const fenceM = randInt(15, 30);
      const postDistanceCm = 150;
      const fenceCm = fenceM * 100;
      const posts = fenceCm / postDistanceCm;
      const cleanPosts = Number.isInteger(posts) ? posts : Number(posts.toFixed(0));
      return {
        text: `Σε έναν ευθύγραμμο φράχτη μήκους ${fenceM} m τοποθετούμε πασσάλους ανά 150 cm (χωρίς να υπολογίσουμε τον αρχικό). Πόσοι πάσσαλοι θα χρειαστούν;`,
        tableData: { col1: 'Μήκος Φράχτη', col2: 'Απόσταση Πασσάλων', r1: [`${fenceM} m ＝ ${fenceCm} cm`, '150 cm'], r2: ['Διαίρεση', 'Πάσσαλοι'] },
        correctVal: cleanPosts,
        correctStr: String(cleanPosts),
        explanation: `Μετατρέπουμε τα μέτρα σε εκατοστά: ${fenceM} · 100 ＝ ${fenceCm} cm. Διαιρούμε με την απόσταση των πασσάλων: ${fenceCm} : 150 ＝ ${cleanPosts} πάσσαλοι.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (Σύνθετες Μετατροπές, Κλίμακα, Περίμετροι)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_len_hard_1',
    generate: () => {
      const scale = 50000;
      const mapCm = 6.4;
      const realCm = mapCm * scale; // 320.000 cm
      const realKm = realCm / 100000; // 3.2 km
      return {
        text: `Σε έναν γεωγραφικό χάρτη με κλίμακα 1 : ${formatNum(scale)}, η απόσταση δύο χωριών μετρήθηκε ίση με ${formatNum(mapCm)} cm. Πόσα χιλιόμετρα (km) είναι η πραγματική απόσταση στην πραγματικότητα;`,
        tableData: { col1: 'Χάρτης', col2: 'Πραγματικότητα', r1: [`${formatNum(mapCm)} cm`, `${formatNum(realCm)} cm`], r2: ['Κλίμακα 1 : 50.000', `Μετατροπή σε km`] },
        correctVal: realKm,
        correctStr: formatNum(realKm),
        explanation: `Πραγματική απόσταση σε εκατοστά: ${formatNum(mapCm)} · ${scale} ＝ ${realCm} cm. Επειδή 1 km ＝ 100.000 cm, διαιρούμε με το 100.000: ${realCm} : 100.000 ＝ ${formatNum(realKm)} km.`
      };
    }
  },
  {
    id: 'p_len_hard_2',
    generate: () => {
      const lengthM = 15;
      const widthCm = 850; // 8,5 m
      const widthM = widthCm / 100;
      const perimM = 2 * (lengthM + widthM); // 47 m
      const wireLayers = 3;
      const totalWireM = perimM * wireLayers;
      return {
        text: `Ένα ορθογώνιο οικόπεδο έχει μήκος ${lengthM} m και πλάτος ${widthCm} cm. Θέλουμε να το περιφράξουμε περιμετρικά με συρματόπλεγμα 3 σειρών. Πόσα μέτρα (m) συρματοπλέγματος θα χρειαστούν συνολικά;`,
        tableData: { col1: 'Διαστάσεις Οικοπέδου', col2: 'Περίφραξη (3 σειρές)', r1: [`Μήκος: ${lengthM} m`, `Πλάτος: ${widthCm} cm ＝ ${formatNum(widthM)} m`], r2: [`Περίμετρος: ${formatNum(perimM)} m`, `3 · ${formatNum(perimM)} m`] },
        correctVal: totalWireM,
        correctStr: String(totalWireM),
        explanation: `Μετατρέπουμε το πλάτος σε μέτρα: ${widthCm} : 100 ＝ ${formatNum(widthM)} m. Υπολογίζουμε την περίμετρο: 2 · (${lengthM} ＋ ${formatNum(widthM)}) ＝ 2 · ${lengthM + widthM} ＝ ${formatNum(perimM)} m. Για 3 σειρές συρματοπλέγματος απαιτούνται: 3 · ${formatNum(perimM)} ＝ ${totalWireM} m.`
      };
    }
  },
  {
    id: 'p_len_hard_3',
    generate: () => {
      const distKm = 4.2;
      const distM = distKm * 1000; // 4200 m
      const treeSpacingM = 14;
      const trees = (distM / treeSpacingM) + 1; // συμπεριλαμβανομενου του πρωτου δεντρου
      return {
        text: `Στη μία πλευρά ενός ευθύγραμμου δρόμου μήκους ${formatNum(distKm)} km φυτεύονται δέντρα ανά 14 m, ξεκινώντας από την αρχή του δρόμου (στο 0 m) μέχρι και το τέλος του. Πόσα δέντρα θα φυτευτούν συνολικά;`,
        tableData: { col1: 'Μήκος Δρόμου', col2: 'Απόσταση Δέντρων', r1: [`${formatNum(distKm)} km ＝ ${distM} m`, '14 m'], r2: [`Διαστήματα: ${distM / treeSpacingM}`, `Δέντρα: ${distM / treeSpacingM} ＋ 1`] },
        correctVal: trees,
        correctStr: String(trees),
        explanation: `Μετατρέπουμε τα χιλιόμετρα σε μέτρα: ${formatNum(distKm)} · 1.000 ＝ ${distM} m. Βρίσκουμε τον αριθμό των ίσων διαστημάτων: ${distM} : 14 ＝ ${distM / treeSpacingM}. Επειδή φυτεύεται δέντρο και στην αρχή και στο τέλος, προσθέτουμε 1: ${distM / treeSpacingM} ＋ 1 ＝ ${trees} δέντρα.`
      };
    }
  },
  {
    id: 'p_len_hard_4',
    generate: () => {
      const rM = 2.4;
      const rDm = 18;
      const rCm = 350;
      const sumCm = (rM * 100) + (rDm * 10) + rCm; // 240 + 180 + 350 = 770 cm
      const sumM = sumCm / 100; // 7.7 m
      return {
        text: `Ενώνουμε διαδοχικά τρία κομμάτια σωλήνα: το πρώτο έχει μήκος ${formatNum(rM)} m, το δεύτερο ${rDm} dm και το τρίτο ${rCm} cm. Πόσα μέτρα (m) είναι το συνολικό μήκος του νέου σωλήνα;`,
        tableData: { col1: 'Τρία Τμήματα', col2: 'Αναγωγή σε Μέτρα', r1: [`${formatNum(rM)} m και ${rDm} dm`, `${formatNum(rM)} m ＋ ${formatNum(rDm / 10)} m`], r2: [`${rCm} cm`, `${formatNum(rCm / 100)} m`] },
        correctVal: sumM,
        correctStr: formatNum(sumM),
        explanation: `Μετατρέπουμε όλα τα τμήματα σε μέτρα: 1ο: ${formatNum(rM)} m, 2ο: ${rDm} dm ＝ ${formatNum(rDm / 10)} m, 3ο: ${rCm} cm ＝ ${formatNum(rCm / 100)} m. Προσθέτουμε: ${formatNum(rM)} ＋ ${formatNum(rDm / 10)} ＋ ${formatNum(rCm / 100)} ＝ ${formatNum(sumM)} m.`
      };
    }
  },
  {
    id: 'p_len_hard_5',
    generate: () => {
      const athleteM = 1500;
      const laps = 3.75;
      const lapM = athleteM / laps; // 400 m
      return {
        text: `Ένας δρομέας έτρεξε απόσταση 1,5 km κάνοντας ακριβώς 3,75 γύρους σε έναν κυκλικό στίβο. Πόσα μέτρα (m) είναι το μήκος ενός πλήρους γύρου του στίβου;`,
        tableData: { col1: 'Συνολική Απόσταση', col2: 'Γύροι Στίβου', r1: ['1,5 km ＝ 1.500 m', '3,75 γύροι'], r2: ['Διαίρεση', '1 γύρος σε m'] },
        correctVal: lapM,
        correctStr: String(lapM),
        explanation: `Μετατρέπουμε τα χιλιόμετρα σε μέτρα: 1,5 · 1.000 ＝ 1.500 m. Διαιρούμε με το πλήθος των γύρων: 1.500 : 3,75 ＝ ${lapM} m ανά γύρο.`
      };
    }
  },
  {
    id: 'p_len_hard_6',
    generate: () => {
      const sideDm = 45; // 4,5 m
      const sideM = sideDm / 10;
      const areaM2 = sideM * sideM; // 20.25 m2
      const perimM = 4 * sideM; // 18 m
      return {
        text: `Ένα τετράγωνο δωμάτιο έχει πλευρά μήκους ${sideDm} dm. Πόσα μέτρα (m) σοβατεπί θα χρειαστούν περιμετρικά, αν αφαιρέσουμε 1 m για το άνοιγμα της πόρτας;`,
        tableData: { col1: 'Πλευρά Δωματίου', col2: 'Περίμετρος & Πόρτα', r1: [`${sideDm} dm ＝ ${formatNum(sideM)} m`, `4 · ${formatNum(sideM)} ＝ ${formatNum(perimM)} m`], r2: ['Άνοιγμα Πόρτας: 1 m', `Αφαίρεση: ${formatNum(perimM)} － 1`] },
        correctVal: perimM - 1,
        correctStr: formatNum(perimM - 1),
        explanation: `Μετατρέπουμε την πλευρά σε μέτρα: ${sideDm} : 10 ＝ ${formatNum(sideM)} m. Υπολογίζουμε την περίμετρο: 4 · ${formatNum(sideM)} ＝ ${formatNum(perimM)} m. Αφαιρούμε το 1 μέτρο της πόρτας: ${formatNum(perimM)} － 1 ＝ ${formatNum(perimM - 1)} m.`
      };
    }
  },
  {
    id: 'p_len_hard_7',
    generate: () => {
      const totalKm = 18;
      const day1M = 6500;
      const day2Km = 7.2;
      const day3M = (totalKm * 1000) - day1M - (day2Km * 1000); // 18000 - 6500 - 7200 = 4300 m
      const day3Km = day3M / 1000; // 4.3 km
      return {
        text: `Μια ομάδα πεζοπόρων προγραμμάτισε διαδρομή συνολικού μήκους ${totalKm} km σε 3 ημέρες. Την 1η ημέρα διένυσε ${formatNum(day1M)} m και τη 2η ημέρα ${formatNum(day2Km)} km. Πόσα χιλιόμετρα (km) απέμειναν για την 3η ημέρα;`,
        tableData: { col1: 'Σύνολο & 1η Ημέρα', col2: '2η & 3η Ημέρα', r1: [`Σύνολο: ${totalKm} km`, `2η ημ.: ${formatNum(day2Km)} km`], r2: [`1η ημ.: ${formatNum(day1M / 1000)} km`, `3η ημ.: χ km`] },
        correctVal: day3Km,
        correctStr: formatNum(day3Km),
        explanation: `Μετατρέπουμε τα μέτρα της 1ης ημέρας σε km: ${formatNum(day1M)} : 1.000 ＝ ${formatNum(day1M / 1000)} km. Αθροίζουμε τις δύο πρώτες ημέρες: ${formatNum(day1M / 1000)} ＋ ${formatNum(day2Km)} ＝ ${formatNum((day1M / 1000) + day2Km)} km. Για την 3η ημέρα μένουν: ${totalKm} － ${formatNum((day1M / 1000) + day2Km)} ＝ ${formatNum(day3Km)} km.`
      };
    }
  },
  {
    id: 'p_len_hard_8',
    generate: () => {
      const plankM = 3.6;
      const pieceCm = 45;
      const plankCm = plankM * 100; // 360 cm
      const pieces = plankCm / pieceCm; // 8
      return {
        text: `Ένας ξυλουργός έχει μια σανίδα μήκους ${formatNum(plankM)} m. Θέλει να κόψει από αυτήν ράφια μήκους ${pieceCm} cm το καθένα. Πόσα τέτοια ράφια θα κατασκευάσει χωρίς να περισσέψει ξύλο;`,
        tableData: { col1: 'Μήκος Σανίδας', col2: 'Μήκος Ραφιού', r1: [`${formatNum(plankM)} m ＝ ${plankCm} cm`, `${pieceCm} cm`], r2: ['Διαίρεση', 'Πλήθος ραφιών'] },
        correctVal: pieces,
        correctStr: String(pieces),
        explanation: `Μετατρέπουμε το μήκος της σανίδας σε εκατοστά: ${formatNum(plankM)} · 100 ＝ ${plankCm} cm. Διαιρούμε με το μήκος κάθε ραφιού: ${plankCm} : ${pieceCm} ＝ ${pieces} ράφια.`
      };
    }
  },
  {
    id: 'p_len_hard_9',
    generate: () => {
      const sideA_M = 4.2;
      const sideB_Cm = 380;
      const sideC_Dm = 25;
      const sumM = sideA_M + (sideB_Cm / 100) + (sideC_Dm / 10); // 4.2 + 3.8 + 2.5 = 10.5 m
      return {
        text: `Ένα τριγωνικό οικόπεδο έχει πλευρές με μήκη: α ＝ ${formatNum(sideA_M)} m, β ＝ ${sideB_Cm} cm και γ ＝ ${sideC_Dm} dm. Πόσα μέτρα (m) είναι η περίμετρος του τριγώνου;`,
        tableData: { col1: 'Πλευρές Τριγώνου', col2: 'Αναγωγή σε Μέτρα', r1: [`α ＝ ${formatNum(sideA_M)} m`, `β ＝ ${sideB_Cm} cm ＝ ${formatNum(sideB_Cm / 100)} m`], r2: [`γ ＝ ${sideC_Dm} dm ＝ ${formatNum(sideC_Dm / 10)} m`, 'Άθροισμα πλευρών'] },
        correctVal: sumM,
        correctStr: formatNum(sumM),
        explanation: `Μετατρέπουμε όλες τις πλευρές σε μέτρα: α ＝ ${formatNum(sideA_M)} m, β ＝ ${sideB_Cm} : 100 ＝ ${formatNum(sideB_Cm / 100)} m, γ ＝ ${sideC_Dm} : 10 ＝ ${formatNum(sideC_Dm / 10)} m. Περίμετρος: ${formatNum(sideA_M)} ＋ ${formatNum(sideB_Cm / 100)} ＋ ${formatNum(sideC_Dm / 10)} ＝ ${formatNum(sumM)} m.`
      };
    }
  },
  {
    id: 'p_len_hard_10',
    generate: () => {
      const wireM = 25;
      const loopCm = 80;
      const wireCm = wireM * 100; // 2500 cm
      const loops = Math.floor(wireCm / loopCm); // 31
      const remainCm = wireCm % loopCm; // 20 cm
      return {
        text: `Από ένα ρολό σύρματος μήκους ${wireM} m κατασκευάζουμε συνδετήρες μήκους ${loopCm} cm ο καθένας. Πόσα εκατοστά (cm) σύρματος θα περισσέψουν στο τέλος;`,
        tableData: { col1: 'Ρολό Σύρματος', col2: 'Συνδετήρας', r1: [`${wireM} m ＝ ${wireCm} cm`, `${loopCm} cm`], r2: [`Πλήθος: ${loops}`, `Υπόλοιπο: ${remainCm} cm`] },
        correctVal: remainCm,
        correctStr: String(remainCm),
        explanation: `Μετατρέπουμε το ρολό σε εκατοστά: ${wireM} · 100 ＝ ${wireCm} cm. Εκτελούμε τη διαίρεση: ${wireCm} : ${loopCm} ＝ ${loops} με υπόλοιπο ${remainCm} cm.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Μετατροπή m σε cm (κατέβασμα 2 σκαλοπατιών x100)
  {
    const m = Number((randInt(2, 8) + pickRandom([0.2, 0.4, 0.5, 0.75])).toFixed(2));
    const cm = Number((m * 100).toFixed(0));

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΜΕΤΑΤΡΟΠΗ ΑΠΟ ΜΕΤΡΑ ΣΕ ΕΚΑΤΟΣΤΑ',
      instruction: 'Μετατρέψτε το μήκος σε εκατοστά (cm):',
      prompt: `Πόσα εκατοστά (cm) είναι τα ${formatNum(m)} m;`,
      correctVal: cm,
      correctStr: String(cm),
      explanation: `Για να μετατρέψουμε μέτρα (m) σε εκατοστά (cm) κατεβαίνουμε δύο σκαλοπάτια, άρα πολλαπλασιάζουμε με το 100: ${formatNum(m)} · 100 ＝ ${cm} cm.`
    });
  }

  // Q2 (MCQ): Βασική σχέση και μονάδα αναφοράς
  {
    const correctOpt = 'Το μέτρο (m)';
    const fake1 = 'Το χιλιόμετρο (km)';
    const fake2 = 'Το εκατοστόμετρο (cm)';
    const fake3 = 'Το τετραγωνικό μέτρο (m²)';

    const options = [
      { text: correctOpt, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΒΑΣΙΚΗ ΜΟΝΑΔΑ ΜΕΤΡΗΣΗΣ',
      instruction: 'Επιλέξτε τη θεμελιώδη μονάδα:',
      prompt: 'Ποια είναι η βασική μονάδα μέτρησης του μήκους στο Διεθνές Σύστημα Μονάδων;',
      options,
      correctText: correctOpt,
      explanation: 'Βασική μονάδα μέτρησης του μήκους είναι το μέτρο (m). Όλες οι υπόλοιπες μονάδες (km, dm, cm, mm) είναι πολλαπλάσια ή υποδιαιρέσεις του.'
    });
  }

  // Q3 (Input - Decimal): Μετατροπή cm σε m (ανέβασμα 2 σκαλοπατιών :100)
  {
    const cm = randInt(12, 65) * 10 + pickRandom([0, 5]);
    const m = Number((cm / 100).toFixed(2));

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΜΕΤΑΤΡΟΠΗ ΑΠΟ ΕΚΑΤΟΣΤΑ ΣΕ ΜΕΤΡΑ',
      instruction: 'Υπολογίστε το μήκος σε μέτρα (m):',
      prompt: `Πόσα μέτρα (m) είναι τα ${cm} cm;`,
      correctVal: m,
      correctStr: formatNum(m),
      explanation: `Για να μετατρέψουμε εκατοστά (cm) σε μέτρα (m) ανεβαίνουμε δύο σκαλοπάτια, άρα διαιρούμε με το 100: ${cm} : 100 ＝ ${formatNum(m)} m.`
    });
  }

  // Q4 (MCQ): Κανόνας μετατροπών στη σκάλα
  {
    const correctRule = 'Πολλαπλασιάζουμε όταν πηγαίνουμε σε μικρότερη μονάδα και διαιρούμε όταν πηγαίνουμε σε μεγαλύτερη';
    const fake1 = 'Διαιρούμε πάντα με το 10 σε οποιαδήποτε αλλαγή μονάδας';
    const fake2 = 'Προσθέτουμε 100 όταν κατεβαίνουμε σκαλοπάτια';
    const fake3 = 'Αφαιρούμε μηδενικά ανεξάρτητα από τη μονάδα';

    const options = [
      { text: correctRule, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΚΑΝΟΝΑΣ ΜΕΤΑΤΡΟΠΗΣ ΣΚΑΛΑΣ',
      instruction: 'Επιλέξτε τον ορθό κανόνα:',
      prompt: 'Ποιος είναι ο σωστός κανόνας για τις μετατροπές των μονάδων μήκους;',
      options,
      correctText: correctRule,
      explanation: 'Όταν μετατρέπουμε από μεγαλύτερη σε μικρότερη μονάδα πολλαπλασιάζουμε με δυνάμεις του 10 (10, 100, 1.000). Όταν μετατρέπουμε από μικρότερη σε μεγαλύτερη, διαιρούμε αντίστοιχα.'
    });
  }

  // Q5 (Input - Decimal): Μετατροπή m σε km (διαίρεση με 1.000)
  {
    const m = randInt(15, 85) * 100;
    const km = Number((m / 1000).toFixed(3));

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΜΕΤΑΤΡΟΠΗ ΑΠΟ ΜΕΤΡΑ ΣΕ ΧΙΛΙΟΜΕΤΡΑ',
      instruction: 'Υπολογίστε την απόσταση σε χιλιόμετρα (km):',
      prompt: `Πόσα χιλιόμετρα (km) είναι τα ${m} m;`,
      correctVal: km,
      correctStr: formatNum(km),
      explanation: `Επειδή 1 km ＝ 1.000 m, για να μετατρέψουμε μέτρα σε χιλιόμετρα διαιρούμε με το 1.000: ${m} : 1.000 ＝ ${formatNum(km)} km.`
    });
  }

  // Q6 (MCQ): Ισοδυναμία υποδιαιρέσεων του μέτρου
  {
    const correctEquiv = '1 m ＝ 10 dm ＝ 100 cm ＝ 1.000 mm';
    const fake1 = '1 m ＝ 100 dm ＝ 10 cm ＝ 1.000 mm';
    const fake2 = '1 m ＝ 10 dm ＝ 1.000 cm ＝ 100 mm';
    const fake3 = '1 km ＝ 100 m ＝ 1.000 dm';

    const options = [
      { text: correctEquiv, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΙΣΟΔΥΝΑΜΙΑ ΥΠΟΔΙΑΙΡΕΣΕΩΝ',
      instruction: 'Επιλέξτε τη σωστή αλυσίδα ισοδυναμίας:',
      prompt: 'Ποια από τις παρακάτω σχέσεις ισοδυναμίας είναι απολύτως σωστή;',
      options,
      correctText: correctEquiv,
      explanation: 'Κάθε μέτρο χωρίζεται ακριβώς σε 10 δεκατόμετρα (dm), 100 εκατοστόμετρα (cm) και 1.000 χιλιοστόμετρα (mm).'
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
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΜΗΚΟΥΣ',
      instruction: 'Λύστε το πρόβλημα και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: stdProb1.text,
      tableData: stdProb1.tableData,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal;
    const fake8A = typeof val8 === 'number' ? formatNum(val8 + randInt(2, 6)) : '0';
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
      title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΜΕΤΑΤΡΟΠΩΝ',
      instruction: 'Προσέξτε τις διαφορετικές μονάδες και υπολογίστε το αποτέλεσμα:',
      prompt: hardProb1.text,
      tableData: hardProb1.tableData,
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
      title: 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΠΕΡΙΜΕΤΡΟΥ & ΜΕΤΑΤΡΟΠΩΝ',
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

export default function MikosExercisesPage() {
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
      title="Ασκήσεις: Μονάδες Μήκους & Μετατροπές - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στις μονάδες μέτρησης μήκους (km, m, dm, cm, mm), περιμέτρους σχημάτων και μετατροπές για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/59-mikos"
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
              Ασκήσεις &amp; Προβλήματα: Μονάδες Μήκους
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με μετατροπές μονάδων μέτρησης (km, m, dm, cm, mm) και 4 ρεαλιστικά προβλήματα περιμέτρων και διαδρομών. Συμπληρώστε τις απαντήσεις σας και ελέγξτε την επίδοσή σας.
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

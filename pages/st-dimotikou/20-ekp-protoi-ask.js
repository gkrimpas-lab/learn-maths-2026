import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

function randInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function shuffle(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function formatNum(num, locale = 'el') {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'el-GR');
}

const makeUniqueOptions = (correct, candidates) => {
  const unique = new Set([String(correct)]);
  for (const c of candidates) {
    if (c !== undefined && c !== null && String(c).trim() !== '') {
      unique.add(String(c));
    }
    if (unique.size === 4) break;
  }
  return shuffle(Array.from(unique));
};

const renderMathHtml = (htmlStr) => {
  if (typeof htmlStr !== 'string') return htmlStr;
  return <span dangerouslySetInnerHTML={{ __html: htmlStr }} />;
};

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n1 = 12;
      const n2 = 18;
      const f1 = '2<sup>2</sup> · 3';
      const f2 = '2 · 3<sup>2</sup>';
      const ekpExpr = '2<sup>2</sup> · 3<sup>2</sup>';
      const ekpVal = 36;
      const unit = isEn ? 'seconds' : 'δευτερόλεπτα';
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';

      return {
        title: isEn ? 'Traffic Signal Lights' : 'Φανάρια Σηματοδότησης',
        prompt: isEn
          ? `At a junction, one pedestrian signal turns green every ${n1} seconds and another every ${n2} seconds. If both turned green simultaneously just now, after how many seconds will they turn green together again? (Given: ${n1} ＝ ${f1} and ${n2} ＝ ${f2})`
          : `Σε μια διασταύρωση, ένα πράσινο φανάρι πεζών ανάβει κάθε ${n1} δευτερόλεπτα και ένα άλλο κάθε ${n2} δευτερόλεπτα. Αν άναψαν μαζί τώρα, μετά από πόσα δευτερόλεπτα θα ανάψουν ξανά ταυτόχρονα; (Δίνονται: ${n1} ＝ ${f1} και ${n2} ＝ ${f2})`,
        unit,
        correctVal: ekpVal,
        correctText: `${ekpVal} ${unit}`,
        tableData: [
          { item: isEn ? '1st Signal' : '1ο Φανάρι', analysis: f1, value: `${n1} ${isEn ? 's' : 'δευτ.'}` },
          { item: isEn ? '2nd Signal' : '2ο Φανάρι', analysis: f2, value: `${n2} ${isEn ? 's' : 'δευτ.'}` },
          { item: abbr, analysis: `${ekpExpr} ＝ 4 · 9`, value: `${ekpVal} ${isEn ? 's' : 'δευτ.'}` }
        ],
        explain: isEn
          ? `We factorize into prime factors: ${n1} ＝ ${f1} and ${n2} ＝ ${f2}. Taking common and non-common factors with highest exponents: LCM ＝ ${ekpExpr} ＝ 4 · 9 ＝ ${ekpVal} seconds.`
          : `Αναλύουμε σε πρώτους παράγοντες: ${n1} ＝ ${f1} και ${n2} ＝ ${f2}. Παίρνουμε τους κοινούς και μη κοινούς παράγοντες με τον μεγαλύτερο εκθέτη: Ε.Κ.Π. ＝ ${ekpExpr} ＝ 4 · 9 ＝ ${ekpVal} δευτερόλεπτα.`,
        distractors: [24, 48, 72]
      };
    }
  },
  {
    id: 'sp2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n1 = 15;
      const n2 = 20;
      const f1 = '3 · 5';
      const f2 = '2<sup>2</sup> · 5';
      const ekpExpr = '2<sup>2</sup> · 3 · 5';
      const ekpVal = 60;
      const unit = isEn ? 'minutes' : 'λεπτά';
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';

      return {
        title: isEn ? 'Bus Departures' : 'Αναχώρηση Λεωφορείων',
        prompt: isEn
          ? `From a bus depot, Line A departs every ${n1} minutes and Line B departs every ${n2} minutes. After how many minutes will both depart together again? (Given: ${n1} ＝ ${f1} and ${n2} ＝ ${f2})`
          : `Από έναν σταθμό, το λεωφορείο γραμμής Α αναχωρεί κάθε ${n1} λεπτά και το λεωφορείο γραμμής Β κάθε ${n2} λεπτά. Μετά από πόσα λεπτά θα αναχωρήσουν ξανά ταυτόχρονα; (Δίνονται: ${n1} ＝ ${f1} και ${n2} ＝ ${f2})`,
        unit,
        correctVal: ekpVal,
        correctText: `${ekpVal} ${unit}`,
        tableData: [
          { item: isEn ? 'Line A' : 'Γραμμή Α', analysis: f1, value: `${n1} ${unit}` },
          { item: isEn ? 'Line B' : 'Γραμμή Β', analysis: f2, value: `${n2} ${unit}` },
          { item: abbr, analysis: `${ekpExpr} ＝ 4 · 3 · 5`, value: `${ekpVal} ${unit}` }
        ],
        explain: isEn
          ? `Applying the highest exponent rule: LCM(${n1}, ${n2}) ＝ ${ekpExpr} ＝ 4 · 3 · 5 ＝ ${ekpVal} minutes (1 hour).`
          : `Εφαρμόζουμε τον κανόνα των μέγιστων εκθετών: Ε.Κ.Π.(${n1}, ${n2}) ＝ ${ekpExpr} ＝ 4 · 3 · 5 ＝ ${ekpVal} λεπτά (δηλαδή σε 1 ώρα).`,
        distractors: [30, 45, 90]
      };
    }
  },
  {
    id: 'sp3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n1 = 24;
      const n2 = 36;
      const f1 = '2<sup>3</sup> · 3';
      const f2 = '2<sup>2</sup> · 3<sup>2</sup>';
      const ekpExpr = '2<sup>3</sup> · 3<sup>2</sup>';
      const ekpVal = 72;
      const unit = isEn ? 'hours' : 'ώρες';
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';

      return {
        title: isEn ? 'Maintenance Check Cycles' : 'Συναγερμοί Συντήρησης',
        prompt: isEn
          ? `In a factory, two machines require scheduled inspections. The first is checked every ${n1} hours and the second every ${n2} hours. Every how many hours do their inspections coincide? (Given: ${n1} ＝ ${f1} and ${n2} ＝ ${f2})`
          : `Σε ένα εργοστάσιο, δύο μηχανήματα χρειάζονται περιοδικό έλεγχο. Το πρώτο ελέγχεται κάθε ${n1} ώρες και το δεύτερο κάθε ${n2} ώρες. Κάθε πόσες ώρες συμπίπτει ο έλεγχος και των δύο; (Δίνονται: ${n1} ＝ ${f1} και ${n2} ＝ ${f2})`,
        unit,
        correctVal: ekpVal,
        correctText: `${ekpVal} ${unit}`,
        tableData: [
          { item: isEn ? 'Machine 1' : 'Μηχάνημα 1', analysis: f1, value: `${n1} ${unit}` },
          { item: isEn ? 'Machine 2' : 'Μηχάνημα 2', analysis: f2, value: `${n2} ${unit}` },
          { item: abbr, analysis: `${ekpExpr} ＝ 8 · 9`, value: `${ekpVal} ${unit}` }
        ],
        explain: isEn
          ? `We take factors with highest powers: for 2 it is 2³ and for 3 it is 3². Thus LCM ＝ 2<sup>3</sup> · 3<sup>2</sup> ＝ 8 · 9 ＝ ${ekpVal} hours.`
          : `Παίρνουμε τους κοινούς παράγοντες με τον μέγιστο εκθέτη: για το 2 είναι 2³ και για το 3 είναι 3². Άρα Ε.Κ.Π. ＝ 2<sup>3</sup> · 3<sup>2</sup> ＝ 8 · 9 ＝ ${ekpVal} ώρες.`,
        distractors: [48, 60, 96]
      };
    }
  },
  {
    id: 'sp4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n1 = 8;
      const n2 = 12;
      const f1 = '2<sup>3</sup>';
      const f2 = '2<sup>2</sup> · 3';
      const ekpExpr = '2<sup>3</sup> · 3';
      const ekpVal = 24;
      const unit = isEn ? 'days' : 'ημέρες';
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';

      return {
        title: isEn ? 'Garden Fertilization' : 'Πότισμα Κήπου',
        prompt: isEn
          ? `A gardener fertilizes rose bushes every ${n1} days and lemon trees every ${n2} days. Every how many days will the fertilization of both coincide? (Given: ${n1} ＝ ${f1} and ${n2} ＝ ${f2})`
          : `Ένας κηπουρός λιπαίνει τα τριαντάφυλλα κάθε ${n1} ημέρες και τις λεμονιές κάθε ${n2} ημέρες. Κάθε πόσες ημέρες θα συμπίπτει η λίπανση και των δύο; (Δίνονται: ${n1} ＝ ${f1} και ${n2} ＝ ${f2})`,
        unit,
        correctVal: ekpVal,
        correctText: `${ekpVal} ${unit}`,
        tableData: [
          { item: isEn ? 'Roses' : 'Τριαντάφυλλα', analysis: f1, value: `${n1} ${unit}` },
          { item: isEn ? 'Lemon trees' : 'Λεμονιές', analysis: f2, value: `${n2} ${unit}` },
          { item: abbr, analysis: `${ekpExpr} ＝ 8 · 3`, value: `${ekpVal} ${unit}` }
        ],
        explain: isEn
          ? `Choose factors with greatest exponents: LCM ＝ ${ekpExpr} ＝ 8 · 3 ＝ ${ekpVal} days.`
          : `Επιλέγουμε κοινούς και μη κοινούς με τον μεγαλύτερο εκθέτη: Ε.Κ.Π. ＝ ${ekpExpr} ＝ 8 · 3 ＝ ${ekpVal} ημέρες.`,
        distractors: [16, 32, 40]
      };
    }
  },
  {
    id: 'sp5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n1 = 20;
      const n2 = 30;
      const f1 = '2<sup>2</sup> · 5';
      const f2 = '2 · 3 · 5';
      const ekpExpr = '2<sup>2</sup> · 3 · 5';
      const ekpVal = 60;
      const unit = isEn ? 'minutes' : 'λεπτά';
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';

      return {
        title: isEn ? 'School Bells' : 'Κουδούνια Σχολείου',
        prompt: isEn
          ? `In an educational complex, the Elementary bell rings every ${n1} minutes and the Middle School bell every ${n2} minutes. After how many minutes will both bells ring at the exact same moment? (Given: ${n1} ＝ ${f1} and ${n2} ＝ ${f2})`
          : `Σε ένα εκπαιδευτικό κέντρο, το κουδούνι του Δημοτικού χτυπά κάθε ${n1} λεπτά και του Γυμνασίου κάθε ${n2} λεπτά. Μετά από πόσα λεπτά θα χτυπήσουν ξανά ταυτόχρονα; (Δίνονται: ${n1} ＝ ${f1} και ${n2} ＝ ${f2})`,
        unit,
        correctVal: ekpVal,
        correctText: `${ekpVal} ${unit}`,
        tableData: [
          { item: isEn ? 'Elementary' : 'Δημοτικό', analysis: f1, value: `${n1} ${unit}` },
          { item: isEn ? 'Middle School' : 'Γυμνάσιο', analysis: f2, value: `${n2} ${unit}` },
          { item: abbr, analysis: `${ekpExpr} ＝ 4 · 3 · 5`, value: `${ekpVal} ${unit}` }
        ],
        explain: isEn
          ? `Common and non-common factors with max exponents: 2<sup>2</sup> · 3 · 5 ＝ 4 · 3 · 5 ＝ ${ekpVal} minutes.`
          : `Κοινοί και μη κοινοί με μέγιστο εκθέτη: 2<sup>2</sup> · 3 · 5 ＝ 4 · 3 · 5 ＝ ${ekpVal} λεπτά.`,
        distractors: [40, 50, 80]
      };
    }
  },
  {
    id: 'sp6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n1 = 18;
      const n2 = 24;
      const f1 = '2 · 3<sup>2</sup>';
      const f2 = '2<sup>3</sup> · 3';
      const ekpExpr = '2<sup>3</sup> · 3<sup>2</sup>';
      const ekpVal = 72;
      const unit = isEn ? 'items' : 'τεμάχια';
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';

      return {
        title: isEn ? 'Packaging Products' : 'Συσκευασίες Προϊόντων',
        prompt: isEn
          ? `A store sells markers in packs of ${n1} and pencils in packs of ${n2}. What is the minimum count of markers and pencils we must purchase to obtain the exact same quantity of each? (Given: ${n1} ＝ ${f1} and ${n2} ＝ ${f2})`
          : `Ένα κατάστημα πουλάει μαρκαδόρους σε πακέτα των ${n1} και μολύβια σε πακέτα των ${n2}. Ποιος είναι ο ελάχιστος αριθμός μαρκαδόρων και μολυβιών που πρέπει να αγοράσουμε για να έχουμε ακριβώς το ίδιο πλήθος από το καθένα; (Δίνονται: ${n1} ＝ ${f1} και ${n2} ＝ ${f2})`,
        unit,
        correctVal: ekpVal,
        correctText: `${ekpVal} ${unit}`,
        tableData: [
          { item: isEn ? 'Markers' : 'Μαρκαδόροι', analysis: f1, value: isEn ? `packs of ${n1}` : `πακέτα των ${n1}` },
          { item: isEn ? 'Pencils' : 'Μολύβια', analysis: f2, value: isEn ? `packs of ${n2}` : `πακέτα των ${n2}` },
          { item: abbr, analysis: `${ekpExpr} ＝ 8 · 9`, value: `${ekpVal} ${unit}` }
        ],
        explain: isEn
          ? `To equalize quantities, we find the LCM of package sizes: LCM(${n1}, ${n2}) ＝ 2<sup>3</sup> · 3<sup>2</sup> ＝ 8 · 9 ＝ ${ekpVal} items.`
          : `Για να ισοσκελιστεί η ποσότητα, αναζητούμε το Ε.Κ.Π. των συσκευασιών: Ε.Κ.Π.(${n1}, ${n2}) ＝ 2<sup>3</sup> · 3<sup>2</sup> ＝ 8 · 9 ＝ ${ekpVal} τεμάχια.`,
        distractors: [36, 48, 96]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n1 = 40;
      const n2 = 50;
      const f1 = '2<sup>3</sup> · 5';
      const f2 = '2 · 5<sup>2</sup>';
      const ekpExpr = '2<sup>3</sup> · 5<sup>2</sup>';
      const ekpVal = 200;
      const unit = isEn ? 'hours' : 'ώρες';
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';

      return {
        title: isEn ? 'Satellite Orbital Synchronization' : 'Περιστροφή Δορυφόρων σε Τροχιά',
        prompt: isEn
          ? `Two satellites orbit the Earth. The first completes an orbit in ${n1} hours (${f1}) and the second in ${n2} hours (${f2}). If both crossed directly over the tracking station right now, after how many hours will they pass over it together again?`
          : `Δύο δορυφόροι περιστρέφονται γύρω από τη Γη. Ο πρώτος ολοκληρώνει μία πλήρη περιστροφή σε ${n1} ώρες (${f1}) και ο δεύτερος σε ${n2} ώρες (${f2}). Αν συναντήθηκαν πάνω από τον ίδιο σταθμό τώρα, μετά από πόσες ώρες θα ξαναβρεθούν ταυτόχρονα πάνω από το ίδιο σημείο;`,
        unit,
        correctVal: ekpVal,
        correctText: `${ekpVal} ${unit}`,
        tableData: [
          { item: isEn ? '1st Satellite' : '1ος Δορυφόρος', analysis: f1, value: `${n1} ${unit}` },
          { item: isEn ? '2nd Satellite' : '2ος Δορυφόρος', analysis: f2, value: `${n2} ${unit}` },
          { item: `${abbr}(40, 50)`, analysis: `${ekpExpr} ＝ 8 · 25`, value: `${ekpVal} ${unit}` }
        ],
        explain: isEn
          ? `We take highest powers: for prime base 2 we select 2³ and for base 5 we select 5². Thus LCM ＝ 2<sup>3</sup> · 5<sup>2</sup> ＝ 8 · 25 ＝ ${ekpVal} hours.`
          : `Εφαρμόζουμε τον κανόνα των μέγιστων εκθετών: για τη βάση 2 παίρνουμε 2³ και για τη βάση 5 παίρνουμε 5². Άρα Ε.Κ.Π. ＝ 2<sup>3</sup> · 5<sup>2</sup> ＝ 8 · 25 ＝ ${ekpVal} ώρες.`,
        distractors: [100, 150, 400]
      };
    }
  },
  {
    id: 'hp2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n1 = 45;
      const n2 = 60;
      const f1 = '3<sup>2</sup> · 5';
      const f2 = '2<sup>2</sup> · 3 · 5';
      const ekpExpr = '2<sup>2</sup> · 3<sup>2</sup> · 5';
      const ekpVal = 180;
      const unit = isEn ? 'minutes' : 'λεπτά';
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';

      return {
        title: isEn ? 'Factory Assembly Lines' : 'Γραμμές Παραγωγής Εργοστασίου',
        prompt: isEn
          ? `Two robotic packing lines seal shipping containers. The first completes a cycle every ${n1} minutes (${f1}) and the second every ${n2} minutes (${f2}). After how many minutes will both complete their cycles simultaneously?`
          : `Δύο ρομποτικές γραμμές παραγωγής συσκευάζουν κιβώτια. Η πρώτη γραμμή ολοκληρώνει έναν κύκλο κάθε ${n1} λεπτά (${f1}) και η δεύτερη κάθε ${n2} λεπτά (${f2}). Μετά από πόσα λεπτά θα ολοκληρώσουν ταυτόχρονα τον κύκλο τους;`,
        unit,
        correctVal: ekpVal,
        correctText: `${ekpVal} ${unit}`,
        tableData: [
          { item: isEn ? 'Line A' : 'Γραμμή Α', analysis: f1, value: `${n1} ${unit}` },
          { item: isEn ? 'Line B' : 'Γραμμή Β', analysis: f2, value: `${n2} ${unit}` },
          { item: `${abbr}(45, 60)`, analysis: `${ekpExpr} ＝ 4 · 9 · 5`, value: `${ekpVal} ${unit}` }
        ],
        explain: isEn
          ? `Take all prime factors with greatest exponents: 2<sup>2</sup> · 3<sup>2</sup> · 5 ＝ 4 · 9 · 5 ＝ ${ekpVal} minutes (3 hours).`
          : `Επιλέγουμε όλους τους παράγοντες (κοινούς και μη κοινούς) με τον μεγαλύτερο εκθέτη: 2<sup>2</sup> · 3<sup>2</sup> · 5 ＝ 4 · 9 · 5 ＝ ${ekpVal} λεπτά (δηλαδή 3 ώρες).`,
        distractors: [120, 240, 360]
      };
    }
  },
  {
    id: 'hp3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n1 = 8;
      const n2 = 12;
      const n3 = 15;
      const f1 = '2<sup>3</sup>';
      const f2 = '2<sup>2</sup> · 3';
      const f3 = '3 · 5';
      const ekpExpr = '2<sup>3</sup> · 3 · 5';
      const ekpVal = 120;
      const unit = isEn ? 'days' : 'ημέρες';
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';

      return {
        title: isEn ? 'Three Cargo Ships Port Meeting' : 'Συντονισμός 3 Πλοίων',
        prompt: isEn
          ? `Three cargo ships operate routes from a commercial harbor. The first docks every ${n1} days (${f1}), the second every ${n2} days (${f2}), and the third every ${n3} days (${f3}). Every how many days will all three dock simultaneously in the harbor?`
          : `Τρία εμπορικά πλοία εκτελούν κυκλικά δρομολόγια από το λιμάνι του Πειραιά. Το πρώτο επιστρέφει κάθε ${n1} ημέρες (${f1}), το δεύτερο κάθε ${n2} ημέρες (${f2}) και το τρίτο κάθε ${n3} ημέρες (${f3}). Κάθε πόσες ημέρες θα συμπίπτει η παρουσία και των τριών ταυτόχρονα στο λιμάνι;`,
        unit,
        correctVal: ekpVal,
        correctText: `${ekpVal} ${unit}`,
        tableData: [
          { item: isEn ? 'Ship 1' : 'Πλοίο 1', analysis: f1, value: `${n1} ${unit}` },
          { item: isEn ? 'Ship 2' : 'Πλοίο 2', analysis: f2, value: `${n2} ${unit}` },
          { item: isEn ? 'Ship 3' : 'Πλοίο 3', analysis: f3, value: `${n3} ${unit}` },
          { item: `${abbr}(8, 12, 15)`, analysis: `${ekpExpr} ＝ 8 · 3 · 5`, value: `${ekpVal} ${unit}` }
        ],
        explain: isEn
          ? `For the LCM of 3 numbers we take all prime factors with maximum exponents: 2<sup>3</sup> · 3 · 5 ＝ 8 · 3 · 5 ＝ ${ekpVal} days.`
          : `Στο Ε.Κ.Π. 3 αριθμών παίρνουμε όλους τους πρώτους παράγοντες με τους μέγιστους εκθέτες: 2<sup>3</sup> · 3 · 5 ＝ 8 · 3 · 5 ＝ ${ekpVal} ημέρες.`,
        distractors: [60, 90, 180]
      };
    }
  },
  {
    id: 'hp4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n1 = 36;
      const n2 = 48;
      const f1 = '2<sup>2</sup> · 3<sup>2</sup>';
      const f2 = '2<sup>4</sup> · 3';
      const ekpExpr = '2<sup>4</sup> · 3<sup>2</sup>';
      const ekpVal = 144;
      const unit = isEn ? 'seconds' : 'δευτερόλεπτα';
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';

      return {
        title: isEn ? 'Runners on Circular Track' : 'Αθλητές σε Κυκλικό Στίβο',
        prompt: isEn
          ? `Two runners start simultaneously from the starting line of a circular track. The first finishes a lap in ${n1} seconds (${f1}) and the second in ${n2} seconds (${f2}). After how many seconds will both cross the start line simultaneously again?`
          : `Δύο δρομείς ξεκινούν ταυτόχρονα από την αφετηρία ενός κυκλικού στίβου. Ο πρώτος κάνει έναν γύρο σε ${n1} δευτερόλεπτα (${f1}) και ο δεύτερος σε ${n2} δευτερόλεπτα (${f2}). Μετά από πόσα δευτερόλεπτα θα περάσουν ξανά μαζί ακριβώς από τη γραμμή εκκίνησης;`,
        unit,
        correctVal: ekpVal,
        correctText: `${ekpVal} ${unit}`,
        tableData: [
          { item: isEn ? '1st Runner' : '1ος Δρομέας', analysis: f1, value: `${n1} ${isEn ? 's' : 'δευτ.'}` },
          { item: isEn ? '2nd Runner' : '2ος Δρομέας', analysis: f2, value: `${n2} ${isEn ? 's' : 'δευτ.'}` },
          { item: `${abbr}(36, 48)`, analysis: `${ekpExpr} ＝ 16 · 9`, value: `${ekpVal} ${isEn ? 's' : 'δευτ.'}` }
        ],
        explain: isEn
          ? `For prime 2 we select exponent 4 (2⁴) and for 3 exponent 2 (3²): LCM ＝ 2<sup>4</sup> · 3<sup>2</sup> ＝ 16 · 9 ＝ ${ekpVal} seconds.`
          : `Επιλέγουμε για το 2 τον εκθέτη 4 (2⁴) και για το 3 τον εκθέτη 2 (3²). Ε.Κ.Π. ＝ 2<sup>4</sup> · 3<sup>2</sup> ＝ 16 · 9 ＝ ${ekpVal} δευτερόλεπτα.`,
        distractors: [72, 96, 180]
      };
    }
  },
  {
    id: 'hp5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n1 = 30;
      const n2 = 40;
      const f1 = '2 · 3 · 5';
      const f2 = '2<sup>3</sup> · 5';
      const ekpExpr = '2<sup>3</sup> · 3 · 5';
      const ekpVal = 120;
      const unit = 'cm';
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';

      return {
        title: isEn ? 'Assembling Square LED Panel' : 'Συναρμολόγηση Πλακετών LED',
        prompt: isEn
          ? `An electronics technician builds a square light fixture using rectangular LED modules measuring ${n1} cm (${f1}) by ${n2} cm (${f2}). What is the minimum side length of the square panel?`
          : `Ένας τεχνικός ηλεκτρονικών θέλει να κατασκευάσει ένα τετράγωνο φωτιστικό πάνελ τοποθετώντας ορθογώνιες πλακέτες LED διαστάσεων ${n1} cm (${f1}) επί ${n2} cm (${f2}). Ποιο είναι το ελάχιστο μήκος πλευράς που μπορεί να έχει το τετράγωνο πάνελ;`,
        unit,
        correctVal: ekpVal,
        correctText: `${ekpVal} ${unit}`,
        tableData: [
          { item: isEn ? 'Module Width' : 'Πλάτος Πλακέτας', analysis: f1, value: `${n1} cm` },
          { item: isEn ? 'Module Length' : 'Μήκος Πλακέτας', analysis: f2, value: `${n2} cm` },
          { item: isEn ? 'Square Side (LCM)' : 'Πλευρά Τετραγώνου (Ε.Κ.Π.)', analysis: `${ekpExpr} ＝ 8 · 3 · 5`, value: `${ekpVal} cm` }
        ],
        explain: isEn
          ? `The square's side must be a common multiple of the two dimensions. LCM(${n1}, ${n2}) ＝ 2<sup>3</sup> · 3 · 5 ＝ ${ekpVal} cm (1.2 meters).`
          : `Η πλευρά του τετραγώνου πρέπει να είναι κοινό πολλαπλάσιο των δύο διαστάσεων. Ε.Κ.Π.(${n1}, ${n2}) ＝ 2<sup>3</sup> · 3 · 5 ＝ ${ekpVal} cm (1,2 μέτρα).`,
        distractors: [60, 80, 240]
      };
    }
  },
  {
    id: 'hp6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const n1 = 10;
      const n2 = 15;
      const n3 = 20;
      const f1 = '2 · 5';
      const f2 = '3 · 5';
      const f3 = '2<sup>2</sup> · 5';
      const ekpExpr = '2<sup>2</sup> · 3 · 5';
      const ekpVal = 60;
      const unit = isEn ? 'days' : 'ημέρες';
      const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';

      return {
        title: isEn ? 'Preschool Specialist Visits' : 'Επισκέψεις σε Παιδικό Σταθμό',
        prompt: isEn
          ? `In a preschool, a pediatrician visits every ${n1} days (${f1}), a dentist every ${n2} days (${f2}), and a nutritionist every ${n3} days (${f3}). Every how many days will all three specialists visit on the exact same day?`
          : `Σε έναν παιδικό σταθμό, ο παιδίατρος έρχεται κάθε ${n1} ημέρες (${f1}), ο οδοντίατρος κάθε ${n2} ημέρες (${f2}) και ο διατροφολόγος κάθε ${n3} ημέρες (${f3}). Κάθε πόσες ημέρες θα συμπίπτει η επίσκεψη και των τριών ειδικών την ίδια ημέρα;`,
        unit,
        correctVal: ekpVal,
        correctText: `${ekpVal} ${unit}`,
        tableData: [
          { item: isEn ? 'Pediatrician' : 'Παιδίατρος', analysis: f1, value: `${n1} ${unit}` },
          { item: isEn ? 'Dentist' : 'Οδοντίατρος', analysis: f2, value: `${n2} ${unit}` },
          { item: isEn ? 'Nutritionist' : 'Διατροφολόγος', analysis: f3, value: `${n3} ${unit}` },
          { item: `${abbr}(10, 15, 20)`, analysis: `${ekpExpr} ＝ 4 · 3 · 5`, value: `${ekpVal} ${unit}` }
        ],
        explain: isEn
          ? `Gathering all factors with greatest exponents: 2<sup>2</sup> · 3 · 5 ＝ 4 · 3 · 5 ＝ ${ekpVal} days (roughly every 2 months).`
          : `Συλλέγουμε τους παράγοντες με τους μεγαλύτερους εκθέτες: 2<sup>2</sup> · 3 · 5 ＝ 4 · 3 · 5 ＝ ${ekpVal} ημέρες (περίπου κάθε 2 μήνες).`,
        distractors: [30, 45, 90]
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const abbr = isEn ? 'LCM' : 'Ε.Κ.Π.';

  // Q1: MCQ - Επιλογή του σωστού γινομένου παραγόντων με μέγιστους εκθέτες
  const q1Pool = [
    {
      n1: '12 ＝ 2<sup>2</sup> · 3',
      n2: '18 ＝ 2 · 3<sup>2</sup>',
      correct: '2<sup>2</sup> · 3<sup>2</sup>',
      val: 36,
      wrong: ['2 · 3', '2<sup>2</sup> · 3', '2<sup>3</sup> · 3<sup>3</sup>']
    },
    {
      n1: '20 ＝ 2<sup>2</sup> · 5',
      n2: '30 ＝ 2 · 3 · 5',
      correct: '2<sup>2</sup> · 3 · 5',
      val: 60,
      wrong: ['2 · 5', '2<sup>2</sup> · 5<sup>2</sup>', '2<sup>3</sup> · 3']
    },
    {
      n1: '24 ＝ 2<sup>3</sup> · 3',
      n2: '36 ＝ 2<sup>2</sup> · 3<sup>2</sup>',
      correct: '2<sup>3</sup> · 3<sup>2</sup>',
      val: 72,
      wrong: ['2<sup>2</sup> · 3', '2<sup>3</sup> · 3', '2<sup>4</sup> · 3<sup>2</sup>']
    },
    {
      n1: '15 ＝ 3 · 5',
      n2: '20 ＝ 2<sup>2</sup> · 5',
      correct: '2<sup>2</sup> · 3 · 5',
      val: 60,
      wrong: ['5', '3 · 5', '2<sup>2</sup> · 5']
    }
  ];
  const q1Data = q1Pool[randInt(0, q1Pool.length - 1)];
  const q1Options = makeUniqueOptions(q1Data.correct, q1Data.wrong);

  // Q2: Input - Υπολογισμός Ε.Κ.Π. από δοσμένες παραγοντοποιήσεις
  const q2Pool = [
    {
      expr1: '2<sup>2</sup> · 5',
      expr2: '2 · 5<sup>2</sup>',
      val: 100,
      explain: `${abbr} ＝ 2<sup>2</sup> · 5<sup>2</sup> ＝ 4 · 25 ＝ 100`
    },
    {
      expr1: '2<sup>3</sup> · 3',
      expr2: '3<sup>2</sup> · 5',
      val: 360,
      explain: `${abbr} ＝ 2<sup>3</sup> · 3<sup>2</sup> · 5 ＝ 8 · 9 · 5 ＝ 360`
    },
    {
      expr1: '2<sup>2</sup> · 3<sup>2</sup>',
      expr2: '2 · 3 · 5',
      val: 180,
      explain: `${abbr} ＝ 2<sup>2</sup> · 3<sup>2</sup> · 5 ＝ 4 · 9 · 5 ＝ 180`
    },
    {
      expr1: '2<sup>4</sup> · 3',
      expr2: '2<sup>2</sup> · 3<sup>2</sup>',
      val: 144,
      explain: `${abbr} ＝ 2<sup>4</sup> · 3<sup>2</sup> ＝ 16 · 9 ＝ 144`
    }
  ];
  const q2Data = q2Pool[randInt(0, q2Pool.length - 1)];

  // Q3: MCQ - Ποιον εκθέτη επιλέγουμε για κοινό πρώτο παράγοντα
  const q3Pool = [
    { base: 2, e1: '2<sup>2</sup>', e2: '2<sup>4</sup>', correct: '2<sup>4</sup>', wrong: ['2<sup>2</sup>', '2<sup>6</sup>', '2<sup>8</sup>'] },
    { base: 3, e1: '3<sup>3</sup>', e2: '3<sup>1</sup>', correct: '3<sup>3</sup>', wrong: ['3', '3<sup>4</sup>', '3<sup>2</sup>'] },
    { base: 5, e1: '5<sup>1</sup>', e2: '5<sup>2</sup>', correct: '5<sup>2</sup>', wrong: ['5', '5<sup>3</sup>', '5<sup>4</sup>'] },
    { base: 7, e1: '7<sup>2</sup>', e2: '7<sup>3</sup>', correct: '7<sup>3</sup>', wrong: ['7', '7<sup>2</sup>', '7<sup>5</sup>'] }
  ];
  const q3Data = q3Pool[randInt(0, q3Pool.length - 1)];
  const q3Options = makeUniqueOptions(q3Data.correct, q3Data.wrong);

  // Q4: MCQ - Ε.Κ.Π. 3 αριθμών με παραγοντοποίηση
  const q4Pool = [
    {
      n1: '8 ＝ 2<sup>3</sup>',
      n2: '12 ＝ 2<sup>2</sup> · 3',
      n3: '15 ＝ 3 · 5',
      correct: '2<sup>3</sup> · 3 · 5 (＝ 120)',
      wrong: ['2<sup>2</sup> · 3 (＝ 12)', '2<sup>3</sup> · 3<sup>2</sup> (＝ 72)', '2 · 3 · 5 (＝ 30)']
    },
    {
      n1: '10 ＝ 2 · 5',
      n2: '15 ＝ 3 · 5',
      n3: '20 ＝ 2<sup>2</sup> · 5',
      correct: '2<sup>2</sup> · 3 · 5 (＝ 60)',
      wrong: ['2 · 3 · 5 (＝ 30)', '5 (＝ 5)', '2<sup>2</sup> · 5 (＝ 20)']
    },
    {
      n1: '6 ＝ 2 · 3',
      n2: '9 ＝ 3<sup>2</sup>',
      n3: '12 ＝ 2<sup>2</sup> · 3',
      correct: '2<sup>2</sup> · 3<sup>2</sup> (＝ 36)',
      wrong: ['2 · 3 (＝ 6)', '2<sup>2</sup> · 3 (＝ 12)', '2<sup>3</sup> · 3<sup>3</sup> (＝ 216)']
    }
  ];
  const q4Data = q4Pool[randInt(0, q4Pool.length - 1)];
  const q4Options = makeUniqueOptions(q4Data.correct, q4Data.wrong);

  // Q5: True/False - Μη κοινοί παράγοντες
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = isEn
    ? (q5IsTrue
        ? 'In prime factorization, the LCM incorporates both common AND non-common prime factors.'
        : 'In prime factorization, the LCM incorporates EXCLUSIVELY common prime factors.')
    : (q5IsTrue
        ? 'Στο Ε.Κ.Π. με ανάλυση σε πρώτους παράγοντες παίρνουμε και τους κοινούς ΚΑΙ τους μη κοινούς παράγοντες.'
        : 'Στο Ε.Κ.Π. με ανάλυση σε πρώτους παράγοντες παίρνουμε ΑΠΟΚΛΕΙΣΤΙΚΑ και ΜΟΝΟ τους κοινούς παράγοντες.');

  // Q6: True/False - Επιλογή εκθέτη
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = isEn
    ? (q6IsTrue
        ? 'For prime factors, we always select the one with the HIGHEST exponent when computing the LCM.'
        : 'For prime factors, we always select the one with the LOWEST exponent when computing the LCM.')
    : (q6IsTrue
        ? 'Για τους κοινούς παράγοντες επιλέγουμε πάντοτε εκείνον με τον ΜΕΓΑΛΥΤΕΡΟ εκθέτη.'
        : 'Για τους κοινούς παράγοντες επιλέγουμε πάντοτε εκείνον με τον ΜΙΚΡΟΤΕΡΟ εκθέτη.');

  // Q7: Input - Εύρεση αριθμού που λείπει στο γινόμενο
  const q7Pool = [
    {
      n1: '18 ＝ 2 · 3<sup>2</sup>',
      n2: '24 ＝ 2<sup>3</sup> · 3',
      missing: '9',
      known: '8 · ',
      target: 72,
      explain: `${abbr} ＝ 2<sup>3</sup> · 3<sup>2</sup> ＝ 8 · 9 ＝ 72`
    },
    {
      n1: '12 ＝ 2<sup>2</sup> · 3',
      n2: '20 ＝ 2<sup>2</sup> · 5',
      missing: '15',
      known: '4 · ',
      target: 60,
      explain: `${abbr} ＝ 2<sup>2</sup> · 3 · 5 ＝ 4 · 15 ＝ 60`
    },
    {
      n1: '20 ＝ 2<sup>2</sup> · 5',
      n2: '50 ＝ 2 · 5<sup>2</sup>',
      missing: '25',
      known: '4 · ',
      target: 100,
      explain: `${abbr} ＝ 2<sup>2</sup> · 5<sup>2</sup> ＝ 4 · 25 ＝ 100`
    }
  ];
  const q7Data = q7Pool[randInt(0, q7Pool.length - 1)];

  // Q8: MCQ - Σύγκριση Ε.Κ.Π. και Μ.Κ.Δ. εκθετών
  const q8Pool = isEn
    ? [
        {
          prompt: 'Given the numbers A ＝ 2<sup>2</sup> · 3<sup>3</sup> and B ＝ 2<sup>3</sup> · 3<sup>2</sup>, which relationship correctly gives their LCM?',
          correct: 'LCM ＝ 2<sup>3</sup> · 3<sup>3</sup> ＝ 216',
          wrong: ['LCM ＝ 2<sup>2</sup> · 3<sup>2</sup> ＝ 36', 'LCM ＝ 2 · 3 ＝ 6', 'LCM ＝ 2<sup>5</sup> · 3<sup>5</sup> ＝ 7,776'],
          explain: 'For the LCM we always choose the highest power for each prime base: 2<sup>3</sup> · 3<sup>3</sup> ＝ 8 · 27 ＝ 216.'
        },
        {
          prompt: 'If two numbers are coprime (they share no common prime factor, e.g. 8 ＝ 2<sup>3</sup> and 9 ＝ 3<sup>2</sup>), what is their LCM?',
          correct: 'Their product (8 · 9 ＝ 72)',
          wrong: ['Their sum (8 ＋ 9 ＝ 17)', 'Always 1', 'Their difference (9 － 8 ＝ 1)'],
          explain: 'When two numbers share no common factors, the LCM includes all non-common factors, equaling their product.'
        }
      ]
    : [
        {
          prompt: 'Δίνονται οι αριθμοί Α ＝ 2<sup>2</sup> · 3<sup>3</sup> και Β ＝ 2<sup>3</sup> · 3<sup>2</sup>. Ποια σχέση συνδέει το Ε.Κ.Π. τους;',
          correct: 'Ε.Κ.Π. ＝ 2<sup>3</sup> · 3<sup>3</sup> ＝ 216',
          wrong: ['Ε.Κ.Π. ＝ 2<sup>2</sup> · 3<sup>2</sup> ＝ 36', 'Ε.Κ.Π. ＝ 2 · 3 ＝ 6', 'Ε.Κ.Π. ＝ 2<sup>5</sup> · 3<sup>5</sup> ＝ 7.776'],
          explain: 'Για το Ε.Κ.Π. παίρνουμε πάντοτε τον μέγιστο εκθέτη για κάθε πρώτο παράγοντα: 2<sup>3</sup> · 3<sup>3</sup> ＝ 8 · 27 ＝ 216.'
        },
        {
          prompt: 'Αν δύο αριθμοί είναι πρώτοι μεταξύ τους (δεν έχουν κανέναν κοινό πρώτο παράγοντα, π.χ. 8 ＝ 2<sup>3</sup> και 9 ＝ 3<sup>2</sup>), ποιο είναι το Ε.Κ.Π. τους;',
          correct: 'Το γινόμενό τους (8 · 9 ＝ 72)',
          wrong: ['Το άθροισμά τους (8 ＋ 9 ＝ 17)', 'Πάντα το 1', 'Η διαφορά τους (9 － 8 ＝ 1)'],
          explain: 'Όταν δύο αριθμοί δεν έχουν κοινούς παράγοντες, το Ε.Κ.Π. περιλαμβάνει όλους τους μη κοινούς παράγοντες, άρα ισούται με το γινόμενό τους.'
        }
      ];
  const q8Data = q8Pool[randInt(0, q8Pool.length - 1)];
  const q8Options = makeUniqueOptions(q8Data.correct, q8Data.wrong);

  // Q9: Standard Problem (Pool of 6)
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate(locale);
  const q9Options = makeUniqueOptions(
    q9Raw.correctText,
    q9Raw.distractors.map((d) => `${d} ${q9Raw.unit}`)
  );

  // Q10: Hard Problem (Pool of 6)
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate(locale);
  const q10Options = makeUniqueOptions(
    q10Raw.correctText,
    q10Raw.distractors.map((d) => `${d} ${q10Raw.unit}`)
  );

  return [
    {
      id: 'q1',
      type: 'mcq',
      title: isEn ? 'Maximum Exponents Selection' : 'Επιλογή Γινομένου Μέγιστων Εκθετών',
      prompt: isEn
        ? `Given the factorizations of two numbers: ${q1Data.n1} and ${q1Data.n2}. Which power product correctly computes the LCM?`
        : `Δίνονται οι αναλύσεις δύο αριθμών: ${q1Data.n1} και ${q1Data.n2}. Ποιο είναι το σωστό γινόμενο δυνάμεων για τον υπολογισμό του Ε.Κ.Π.;`,
      options: q1Options,
      correct: q1Data.correct,
      explain: isEn
        ? `We take all prime factors (common and non-common) with the greatest exponents: ${q1Data.correct} (＝ ${q1Data.val}).`
        : `Επιλέγουμε όλους τους πρώτους παράγοντες (κοινούς και μη κοινούς) με τον μεγαλύτερο εκθέτη: ${q1Data.correct} (＝ ${q1Data.val}).`
    },
    {
      id: 'q2',
      type: 'input',
      title: isEn ? 'Computing LCM from Powers' : 'Υπολογισμός Ε.Κ.Π. από Δυνάμεις',
      prompt: isEn
        ? `If A ＝ ${q2Data.expr1} and B ＝ ${q2Data.expr2}, compute the final numerical value of LCM(A, B):`
        : `Αν Α ＝ ${q2Data.expr1} και Β ＝ ${q2Data.expr2}, υπολόγισε την τελική αριθμητική τιμή του Ε.Κ.Π.(Α, Β):`,
      correct: String(q2Data.val),
      explain: q2Data.explain
    },
    {
      id: 'q3',
      type: 'mcq',
      title: isEn ? 'Selecting Common Factor Power' : 'Επιλογή Δύναμης Κοινού Παράγοντα',
      prompt: isEn
        ? `In the factorization of two numbers, the prime base ${q3Data.base} appears as ${q3Data.e1} in the first and ${q3Data.e2} in the second. Which power will be included in the LCM?`
        : `Στην ανάλυση δύο αριθμών εμφανίζεται ο παράγοντας ${q3Data.base} ως ${q3Data.e1} στον πρώτο και ως ${q3Data.e2} στον δεύτερο. Ποια δύναμη θα συμπεριλάβουμε στο Ε.Κ.Π.;`,
      options: q3Options,
      correct: q3Data.correct,
      explain: isEn
        ? `In the LCM we always choose the power with the highest exponent (${q3Data.correct}).`
        : `Στο Ε.Κ.Π. επιλέγουμε πάντοτε τη δύναμη με τον μεγαλύτερο εκθέτη (${q3Data.correct}).`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: isEn ? 'LCM of Three Numbers' : 'Ε.Κ.Π. Τριών Αριθμών',
      prompt: isEn
        ? `What is the LCM of the numbers with factorizations: ${q4Data.n1}, ${q4Data.n2}, and ${q4Data.n3}?`
        : `Ποιο είναι το Ε.Κ.Π. των αριθμών με αναλύσεις: ${q4Data.n1}, ${q4Data.n2} και ${q4Data.n3};`,
      options: q4Options,
      correct: q4Data.correct,
      explain: isEn
        ? `Combine all prime factors with greatest exponents: ${q4Data.correct}.`
        : `Συνδυάζουμε όλους τους πρώτους παράγοντες με τους μεγαλύτερους εκθέτες: ${q4Data.correct}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: isEn ? 'Common and Non-Common Factors' : 'Κοινοί και Μη Κοινοί Παράγοντες',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? (isEn
            ? 'Correct! The LCM incorporates ALL prime factors (both common and non-common).'
            : 'Σωστά! Στο Ε.Κ.Π. συμπεριλαμβάνονται ΟΛΟΙ οι πρώτοι παράγοντες (κοινοί και μη κοινοί).')
        : (isEn
            ? 'False! The LCM takes BOTH common and non-common factors (only the GCD is restricted exclusively to common factors).'
            : 'Λάθος! Στο Ε.Κ.Π. παίρνουμε ΚΑΙ τους μη κοινούς παράγοντες (μόνο στον Μ.Κ.Δ. περιοριζόμαστε αποκλειστικά στους κοινούς).')
    },
    {
      id: 'q6',
      type: 'tf',
      title: isEn ? 'Highest Exponent Rule' : 'Κανόνας Μεγαλύτερου Εκθέτη',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? (isEn
            ? 'Correct! For every prime factor we always select the highest exponent.'
            : 'Σωστά! Για κάθε πρώτο παράγοντα επιλέγουμε πάντοτε τον μεγαλύτερο εκθέτη.')
        : (isEn
            ? 'False! The lowest exponent is selected for the GCD; for the LCM we always choose the highest.'
            : 'Λάθος! Τον μικρότερο εκθέτη τον επιλέγουμε στον Μ.Κ.Δ., ενώ στο Ε.Κ.Π. παίρνουμε πάντοτε τον μεγαλύτερο.')
    },
    {
      id: 'q7',
      type: 'input',
      title: isEn ? 'Missing Factor in Product' : 'Συμπλήρωση Παράγοντα στο Γινόμενο',
      prompt: isEn
        ? `If ${q7Data.n1} and ${q7Data.n2}, then ${abbr} ＝ ${q7Data.known}[ ? ] ＝ ${q7Data.target}. What number corresponds to [ ? ]?`
        : `Αν ${q7Data.n1} και ${q7Data.n2}, τότε Ε.Κ.Π. ＝ ${q7Data.known}[ ? ] ＝ ${q7Data.target}. Ποιος αριθμός αντιστοιχεί στο [ ? ];`,
      correct: q7Data.missing,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: isEn ? 'LCM Properties & Relationships' : 'Ιδιότητες & Σχέσεις Ε.Κ.Π.',
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correct,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'mcq',
      title: isEn ? `Problem: ${q9Raw.title}` : `Πρόβλημα: ${q9Raw.title}`,
      prompt: q9Raw.prompt,
      options: q9Options,
      correct: q9Raw.correctText,
      tableData: q9Raw.tableData,
      explain: q9Raw.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: isEn ? `Complex Problem: ${q10Raw.title}` : `Σύνθετο Πρόβλημα: ${q10Raw.title}`,
      prompt: q10Raw.prompt,
      options: q10Options,
      correct: q10Raw.correctText,
      tableData: q10Raw.tableData,
      explain: q10Raw.explain
    }
  ];
}

const UI_STRINGS = {
  el: {
    pageTitle: "Ασκήσεις: Ε.Κ.Π. με Πρώτους Παράγοντες - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στο Ελάχιστο Κοινό Πολλαπλάσιο με ανάλυση σε πρώτους παράγοντες για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "Θεωρία",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 20 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Διαδραστικές Ασκήσεις: Ε.Κ.Π. με Πρώτους Παράγοντες",
    heroDesc: "Λύσε τα 10 δυναμικά θέματα εφαρμόζοντας τον χρυσό κανόνα των κοινών και μη κοινών πρώτων παραγόντων με τον μεγαλύτερο εκθέτη!",
    btnNewSet: "Νέες Ασκήσεις",
    exerciseBadge: (num) => `Άσκηση ${num}`,
    inputPlaceholder: "Γράψε την απάντησή σου...",
    trueLabel: "Σωστό",
    falseLabel: "Λάθος",
    colItem: "Στοιχείο",
    colAnalysis: "Ανάλυση",
    colValue: "Τιμή",
    feedbackGreat: "🎯 Εξαιρετικά!",
    feedbackExpl: "💡 Επεξήγηση:",
    btnCheckMain: "Έλεγχος Απαντήσεων",
    scoreLabel: "Σκορ",
    answeredLabel: "Απαντήθηκαν",
    pctLabel: "Ποσοστό",
    bottomInstruction: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!"
  },
  en: {
    pageTitle: "Exercises: LCM with Prime Factors - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems with automated grading on the Least Common Multiple using prime factor decomposition for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "Theory",
    badgeChapter: "CHAPTER 20 • GRADE 6 • PRACTICE",
    heroTitle: "Interactive Exercises: LCM by Prime Factorization",
    heroDesc: "Solve 10 dynamic questions applying the rule: common and non-common prime factors with the highest exponent!",
    btnNewSet: "New Exercises",
    exerciseBadge: (num) => `Exercise ${num}`,
    inputPlaceholder: "Type your answer...",
    trueLabel: "True",
    falseLabel: "False",
    colItem: "Item",
    colAnalysis: "Analysis",
    colValue: "Value",
    feedbackGreat: "🎯 Excellent!",
    feedbackExpl: "💡 Explanation:",
    btnCheckMain: "Check Answers",
    scoreLabel: "Score",
    answeredLabel: "Answered",
    pctLabel: "Percentage",
    bottomInstruction: "Answer all 10 questions and click 'Check Answers'!"
  }
};

export default function EkpProtoiExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = UI_STRINGS[locale];

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions(locale);
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach((q) => {
      initialAnswers[q.id] = q.type === 'tf' ? null : '';
    });
    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [locale]);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      let sanitized = String(rawValue).replace(/[^0-9]/g, '');
      if (sanitized.length > 10) {
        sanitized = sanitized.slice(0, 10);
      }
      setAnswers((prev) => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers((prev) => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.trim();
      const cleanTarget = String(q.correct).trim();
      return cleanUser === cleanTarget;
    }
    if (q.type === 'mcq') {
      return userVal === q.correct;
    }
    if (q.type === 'tf') {
      return userVal === q.correct;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || questions.length === 0) return;

    let total = 0;
    questions.forEach((q) => {
      if (isQuestionCorrect(q)) total += 1;
    });

    setScore(total);
    setSubmitted(true);
  };

  const getCardStyle = (q) => {
    if (!submitted) return 'bg-white border-slate-200 shadow-sm';
    return isQuestionCorrect(q)
      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-1 ring-emerald-400'
      : 'bg-rose-50/70 border-rose-400 shadow-md ring-1 ring-rose-400';
  };

  const answeredCount = Object.values(answers).filter(
    (val) => val !== undefined && val !== null && String(val).trim() !== ''
  ).length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/20-ekp-protoi"
          locale={locale}
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 box-border">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>{t.badgeChapter}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
                {t.heroTitle}
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.heroDesc}
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation cursor-pointer"
            >
              <span>🔄</span>
              <span>{toCleanUppercase(t.btnNewSet)}</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΙΣ 10 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all overflow-hidden ${getCardStyle(q)}`}
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words [overflow-wrap:anywhere]">
                        {toCleanUppercase(t.exerciseBadge(qNum))} • {toCleanUppercase(q.title)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4 break-words [overflow-wrap:anywhere]">
                      {renderMathHtml(q.type === 'tf' ? `«${q.text}»` : q.prompt)}
                    </p>

                    {/* INPUTS / OPTIONS */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, opt, 'mcq')}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex items-center justify-center min-h-[48px] cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              } disabled:cursor-not-allowed`}
                            >
                              {renderMathHtml(opt)}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'input' && (
                      <div className="space-y-2 mb-3">
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          spellCheck="false"
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={t.inputPlaceholder}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}

                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerChange(q.id, true, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 cursor-pointer ${
                            answers[q.id] === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                          } disabled:cursor-not-allowed`}
                        >
                          👍 {toCleanUppercase(t.trueLabel)}
                        </button>
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleAnswerChange(q.id, false, 'tf')}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 cursor-pointer ${
                            answers[q.id] === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          } disabled:cursor-not-allowed`}
                        >
                          👎 {toCleanUppercase(t.falseLabel)}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="w-full min-w-0 max-w-full overflow-x-auto block bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          <table className="w-full text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5 break-words [overflow-wrap:anywhere]">{toCleanUppercase(t.colItem)}</th>
                                <th className="p-1.5 break-words [overflow-wrap:anywhere]">{toCleanUppercase(t.colAnalysis)}</th>
                                <th className="p-1.5 break-words [overflow-wrap:anywhere]">{toCleanUppercase(t.colValue)}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900 break-words [overflow-wrap:anywhere]">{renderMathHtml(row.item)}</td>
                                  <td className="p-1.5 text-indigo-700 break-words [overflow-wrap:anywhere]">{renderMathHtml(row.analysis)}</td>
                                  <td className="p-1.5 font-black text-emerald-700 break-words [overflow-wrap:anywhere]">{renderMathHtml(row.value)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere] ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? t.feedbackGreat : t.feedbackExpl}
                        </p>
                        <p>{renderMathHtml(q.explain)}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation cursor-pointer"
              >
                <span className="text-xl">🎯</span>
                <span>{toCleanUppercase(t.btnCheckMain)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT?.CONTAINER || 'w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto'} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase(t.scoreLabel) : toCleanUppercase(t.answeredLabel)}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.pctLabel)}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 10) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* GUIDANCE OR RESTART */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation cursor-pointer"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.btnNewSet)}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.bottomInstruction}
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
// pages/st-dimotikou/12-stroggilopoiisi-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Τυχαίος ακέραιος στο [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ανακάτεμα πίνακα
function shuffle(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Μορφοποίηση αριθμού (ακέραιος ή δεκαδικός με κόμμα)
function formatNum(val, decimals = 3) {
  if (val === '' || val === null || val === undefined || isNaN(val)) return '0';
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Μορφοποίηση αριθμού με τελείες χιλιάδων
function formatNumber(num) {
  if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
  return Number(num).toLocaleString('el-GR');
}

// Δεξαμενή θεματικών σεναρίων καθημερινότητας
const REAL_WORLD_PRESETS = [
  { item: 'το μήκος της διαδρομής', unit: 'm' },
  { item: 'το βάρος του κιβωτίου', unit: 'kg' },
  { item: 'την τιμή του ηλεκτρονικού υπολογιστή', unit: '€' },
  { item: 'την απόσταση μεταξύ των δύο πόλεων', unit: 'km' },
  { item: 'την ποσότητα του ελαιολάδου', unit: 'L' },
  { item: 'το εμβαδόν του οικοπέδου', unit: 'τ.μ.' }
];

// Διευρυμένη δεξαμενή προβλημάτων για την Ερώτηση 9 (Input)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_round_std_1',
    generate: () => {
      const budgetFloat = parseFloat(`${randInt(140, 380)}.${randInt(1, 9)}${randInt(5, 9)}`);
      const budgetStr = budgetFloat.toFixed(2).replace('.', ',');
      const roundedHundreds = Math.round(budgetFloat / 100) * 100;
      return {
        title: 'ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΣΧΟΛΙΚΟΥ ΠΡΟΫΠΟΛΟΓΙΣΜΟΥ',
        instruction: 'Υπολογίστε το στρογγυλοποιημένο ποσό σε ευρώ (€):',
        text: `Ένα σχολείο συγκέντρωσε ${budgetStr} € για την αγορά αθλητικού εξοπλισμού. Ποιο είναι το προσεγγιστικό ποσό αν γίνει στρογγυλοποίηση στην πλησιέστερη εκατοντάδα ευρώ (€);`,
        tableData: { col1: 'Ακριβές Ποσό', col2: 'Τάξη Στρογγυλοποίησης', r1: [`${budgetStr} €`, 'Εκατοντάδες'], r2: ['Ψηφίο-κλειδί (Δεκάδες)', `${roundedHundreds} €`] },
        correctVal: roundedHundreds,
        correctStr: String(roundedHundreds),
        explanation: `Εξετάζουμε το ψηφίο των δεκάδων. Στρογγυλοποιώντας στην πλησιέστερη εκατοντάδα βρίσκουμε ${roundedHundreds} €.`
      };
    }
  },
  {
    id: 'p_round_std_2',
    generate: () => {
      const weightFloat = parseFloat(`${randInt(4, 18)}.${randInt(1, 9)}${randInt(5, 9)}${randInt(1, 9)}`);
      const weightStr = weightFloat.toFixed(3).replace('.', ',');
      const roundedTenths = (Math.round(weightFloat * 10) / 10).toFixed(1).replace('.', ',');
      return {
        title: 'ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΒΑΡΟΥΣ ΔΕΜΑΤΟΣ',
        instruction: 'Υπολογίστε το βάρος στα πλησιέστερα δέκατα (0,1) σε κιλά (kg) με κόμμα:',
        text: `Ένα δέμα ζυγίζει ${weightStr} kg. Ποιο είναι το βάρος του δέματος στρογγυλοποιημένο στα πλησιέστερα δέκατα (0,1) του κιλού;`,
        tableData: { col1: 'Ακριβές Βάρος', col2: 'Στα Δέκατα (0,1)', r1: [`${weightStr} kg`, 'Δέκατα'], r2: ['Ψηφίο-κλειδί (Εκατοστά)', `${roundedTenths} kg`] },
        correctVal: parseFloat(roundedTenths.replace(',', '.')),
        correctStr: roundedTenths,
        explanation: `Εξετάζουμε το ψηφίο των εκατοστών. Στρογγυλοποιώντας στα πλησιέστερα δέκατα προκύπτει ${roundedTenths} kg.`
      };
    }
  },
  {
    id: 'p_round_std_3',
    generate: () => {
      const roadKm = parseFloat(`${randInt(25, 85)}.${randInt(1, 9)}${randInt(1, 9)}`);
      const roadStr = roadKm.toFixed(2).replace('.', ',');
      const roundedUnits = Math.round(roadKm);
      return {
        title: 'ΜΗΚΟΣ ΠΟΔΗΛΑΤΙΚΗΣ ΔΙΑΔΡΟΜΗΣ',
        instruction: 'Υπολογίστε τα ακέραια χιλιόμετρα (km):',
        text: `Μια διαδρομή ποδηλασίας έχει μήκος ${roadStr} km. Πόσα είναι τα ακέραια χιλιόμετρα της διαδρομής αν στρογγυλοποιηθεί στις πλησιέστερες ακέραιες μονάδες;`,
        tableData: { col1: 'Μήκος Διαδρομής', col2: 'Στις Ακέραιες Μονάδες', r1: [`${roadStr} km`, 'Μονάδες'], r2: ['Ψηφίο-κλειδί (Δέκατα)', `${roundedUnits} km`] },
        correctVal: roundedUnits,
        correctStr: String(roundedUnits),
        explanation: `Εξετάζουμε το ψηφίο των δεκάτων. Στρογγυλοποιώντας στις πλησιέστερες ακέραιες μονάδες βρίσκουμε ${roundedUnits} km.`
      };
    }
  },
  {
    id: 'p_round_std_4',
    generate: () => {
      const fuelL = parseFloat(`${randInt(35, 75)}.${randInt(1, 9)}${randInt(5, 9)}`);
      const fuelStr = fuelL.toFixed(2).replace('.', ',');
      const roundedTens = Math.round(fuelL / 10) * 10;
      return {
        title: 'ΚΑΤΑΝΑΛΩΣΗ ΚΑΥΣΙΜΟΥ',
        instruction: 'Υπολογίστε την ποσότητα στην πλησιέστερη δεκάδα λίτρων (L):',
        text: `Ένα όχημα κατανάλωσε ${fuelStr} L καυσίμου σε ένα μεγάλο ταξίδι. Πόσα λίτρα (L) καυσίμου είναι κατά προσέγγιση αν στρογγυλοποιήσουμε στην πλησιέστερη δεκάδα;`,
        tableData: { col1: 'Ακριβής Ποσότητα', col2: 'Πλησιέστερη Δεκάδα', r1: [`${fuelStr} L`, 'Δεκάδες'], r2: ['Ψηφίο-κλειδί (Μονάδες)', `${roundedTens} L`] },
        correctVal: roundedTens,
        correctStr: String(roundedTens),
        explanation: `Εξετάζουμε το ψηφίο των μονάδων. Στρογγυλοποιώντας στην πλησιέστερη δεκάδα προκύπτει ${roundedTens} L.`
      };
    }
  },
  {
    id: 'p_round_std_5',
    generate: () => {
      const priceFloat = parseFloat(`${randInt(12, 45)}.${randInt(1, 9)}${randInt(1, 9)}${randInt(5, 9)}`);
      const priceStr = priceFloat.toFixed(3).replace('.', ',');
      const roundedHundr = (Math.round(priceFloat * 100) / 100).toFixed(2).replace('.', ',');
      return {
        title: 'ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΤΙΜΗΣ ΣΤΑ ΕΚΑΤΟΣΤΑ',
        instruction: 'Υπολογίστε την τιμή στα πλησιέστερα εκατοστά του ευρώ (0,01 €) με κόμμα:',
        text: `Ένα προϊόν τιμολογήθηκε με υπολογιστική ακρίβεια στα ${priceStr} €. Ποια είναι η τιμή του προϊόντος στρογγυλοποιημένη στα πλησιέστερα εκατοστά (λεπτά του ευρώ);`,
        tableData: { col1: 'Ακριβής Τιμή', col2: 'Στα Εκατοστά (0,01)', r1: [`${priceStr} €`, 'Εκατοστά'], r2: ['Ψηφίο-κλειδί (Χιλιοστά)', `${roundedHundr} €`] },
        correctVal: parseFloat(roundedHundr.replace(',', '.')),
        correctStr: roundedHundr,
        explanation: `Εξετάζουμε το ψηφίο των χιλιοστών. Στρογγυλοποιώντας στα εκατοστά βρίσκουμε ${roundedHundr} €.`
      };
    }
  },
  {
    id: 'p_round_std_6',
    generate: () => {
      const distFloat = parseFloat(`${randInt(1200, 3800)}.${randInt(1, 9)}`);
      const distStr = distFloat.toFixed(1).replace('.', ',');
      const roundedThousands = Math.round(distFloat / 1000) * 1000;
      return {
        title: 'ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΣΤΙΣ ΧΙΛΙΑΔΕΣ',
        instruction: 'Υπολογίστε την απόσταση στην πλησιέστερη χιλιάδα μέτρων (m):',
        text: `Μια διαδρομή μετρήθηκε στα ${distStr} m. Ποιο είναι το μήκος της διαδρομής στρογγυλοποιημένο στην πλησιέστερη χιλιάδα μέτρων;`,
        tableData: { col1: 'Ακριβές Μήκος', col2: 'Στις Χιλιάδες', r1: [`${distStr} m`, 'Χιλιάδες'], r2: ['Ψηφίο-κλειδί (Εκατοντάδες)', `${roundedThousands} m`] },
        correctVal: roundedThousands,
        correctStr: String(roundedThousands),
        explanation: `Εξετάζουμε το ψηφίο των εκατοντάδων. Στρογγυλοποιώντας στην πλησιέστερη χιλιάδα προκύπτει ${roundedThousands} m.`
      };
    }
  }
];

// Διευρυμένη δεξαμενή προβλημάτων για την Ερώτηση 10 (MCQ)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_round_hard_1',
    generate: () => {
      const budgetFloat = parseFloat(`${randInt(140, 380)}.${randInt(1, 9)}${randInt(5, 9)}`);
      const budgetStr = budgetFloat.toFixed(2).replace('.', ',');
      const roundedHundreds = Math.round(budgetFloat / 100) * 100;
      const correctStr = `${roundedHundreds} €`;
      const fake1 = `${roundedHundreds + 100} €`;
      const fake2 = `${Math.max(100, roundedHundreds - 100)} €`;
      const fake3 = `${Math.floor(budgetFloat / 10) * 10} €`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΕΚΤΙΜΗΣΗ ΚΟΣΤΟΥΣ ΕΞΟΠΛΙΣΜΟΥ',
        instruction: 'Επιλέξτε τη στρογγυλοποιημένη τιμή στην πλησιέστερη εκατοντάδα ευρώ (€):',
        text: `Ένα σχολείο συγκέντρωσε ${budgetStr} € για την αγορά αθλητικού εξοπλισμού. Ποιο είναι το προσεγγιστικό ποσό αν γίνει στρογγυλοποίηση στην πλησιέστερη εκατοντάδα ευρώ (€);`,
        tableData: { col1: 'Ακριβές Ποσό', col2: 'Τάξη Στρογγυλοποίησης', r1: [`${budgetStr} €`, 'Εκατοντάδες'], r2: ['Ψηφίο-κλειδί (Δεκάδες)', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Εξετάζουμε το ψηφίο των δεκάδων. Στρογγυλοποιώντας στην πλησιέστερη εκατοντάδα προκύπτει ${correctStr}.`
      };
    }
  },
  {
    id: 'p_round_hard_2',
    generate: () => {
      const weightFloat = parseFloat(`${randInt(4, 18)}.${randInt(1, 9)}${randInt(5, 9)}${randInt(1, 9)}`);
      const weightStr = weightFloat.toFixed(3).replace('.', ',');
      const roundedTenths = (Math.round(weightFloat * 10) / 10).toFixed(1).replace('.', ',');
      const correctStr = `${roundedTenths} kg`;
      const fake1 = `${(parseFloat(roundedTenths.replace(',', '.')) + 0.1).toFixed(1).replace('.', ',')} kg`;
      const fake2 = `${(parseFloat(roundedTenths.replace(',', '.')) - 0.1).toFixed(1).replace('.', ',')} kg`;
      const fake3 = `${Math.round(weightFloat)} kg`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΕΚΤΙΜΗΣΗ ΒΑΡΟΥΣ ΦΟΡΤΙΟΥ',
        instruction: 'Επιλέξτε το στρογγυλοποιημένο βάρος στα πλησιέστερα δέκατα (0,1 kg):',
        text: `Ένα δέμα ζυγίζει ${weightStr} kg. Ποιο είναι το βάρος του δέματος στρογγυλοποιημένο στα πλησιέστερα δέκατα (0,1) του κιλού;`,
        tableData: { col1: 'Ακριβές Βάρος', col2: 'Στα Δέκατα (0,1)', r1: [`${weightStr} kg`, 'Δέκατα'], r2: ['Ψηφίο-κλειδί (Εκατοστά)', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Εξετάζουμε το ψηφίο των εκατοστών. Στρογγυλοποιώντας στα πλησιέστερα δέκατα προκύπτει ${correctStr}.`
      };
    }
  },
  {
    id: 'p_round_hard_3',
    generate: () => {
      const roadKm = parseFloat(`${randInt(25, 85)}.${randInt(1, 9)}${randInt(1, 9)}`);
      const roadStr = roadKm.toFixed(2).replace('.', ',');
      const roundedUnits = Math.round(roadKm);
      const correctStr = `${roundedUnits} km`;
      const fake1 = `${roundedUnits + 1} km`;
      const fake2 = `${roundedUnits - 1} km`;
      const fake3 = `${Math.floor(roadKm / 10) * 10} km`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΕΚΤΙΜΗΣΗ ΑΠΟΣΤΑΣΗΣ ΣΕ ΑΚΕΡΑΙΑ ΧΙΛΙΟΜΕΤΡΑ',
        instruction: 'Επιλέξτε την απόσταση στις πλησιέστερες ακέραιες μονάδες (km):',
        text: `Μια διαδρομή ποδηλασίας έχει μήκος ${roadStr} km. Πόσα είναι τα ακέραια χιλιόμετρα της διαδρομής αν στρογγυλοποιηθεί στις πλησιέστερες μονάδες;`,
        tableData: { col1: 'Μήκος Διαδρομής', col2: 'Στις Ακέραιες Μονάδες', r1: [`${roadStr} km`, 'Μονάδες'], r2: ['Ψηφίο-κλειδί (Δέκατα)', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Εξετάζουμε το ψηφίο των δεκάτων. Στρογγυλοποιώντας στις ακέραιες μονάδες προκύπτει ${correctStr}.`
      };
    }
  },
  {
    id: 'p_round_hard_4',
    generate: () => {
      const oilFloat = parseFloat(`${randInt(14, 48)}.${randInt(1, 9)}${randInt(1, 9)}`);
      const oilStr = oilFloat.toFixed(2).replace('.', ',');
      const roundedTenths = (Math.round(oilFloat * 10) / 10).toFixed(1).replace('.', ',');
      const correctStr = `${roundedTenths} L`;
      const fake1 = `${(parseFloat(roundedTenths.replace(',', '.')) + 0.1).toFixed(1).replace('.', ',')} L`;
      const fake2 = `${(parseFloat(roundedTenths.replace(',', '.')) - 0.1).toFixed(1).replace('.', ',')} L`;
      const fake3 = `${Math.round(oilFloat)} L`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΕΚΤΙΜΗΣΗ ΟΓΚΟΥ ΕΛΑΙΟΛΑΔΟΥ',
        instruction: 'Επιλέξτε τον όγκο στα πλησιέστερα δέκατα του λίτρου (0,1 L):',
        text: `Ένα δοχείο περιέχει ${oilStr} L ελαιόλαδο. Ποιος είναι ο όγκος του ελαιολάδου στρογγυλοποιημένος στα πλησιέστερα δέκατα του λίτρου;`,
        tableData: { col1: 'Ακριβής Όγκος', col2: 'Στα Δέκατα', r1: [`${oilStr} L`, 'Δέκατα'], r2: ['Ψηφίο-κλειδί (Εκατοστά)', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Εξετάζουμε το ψηφίο των εκατοστών. Στρογγυλοποιώντας στα πλησιέστερα δέκατα προκύπτει ${correctStr}.`
      };
    }
  },
  {
    id: 'p_round_hard_5',
    generate: () => {
      const priceFloat = parseFloat(`${randInt(25, 95)}.${randInt(1, 9)}${randInt(1, 9)}${randInt(5, 9)}`);
      const priceStr = priceFloat.toFixed(3).replace('.', ',');
      const roundedHundr = (Math.round(priceFloat * 100) / 100).toFixed(2).replace('.', ',');
      const correctStr = `${roundedHundr} €`;
      const fake1 = `${(parseFloat(roundedHundr.replace(',', '.')) + 0.01).toFixed(2).replace('.', ',')} €`;
      const fake2 = `${(parseFloat(roundedHundr.replace(',', '.')) - 0.01).toFixed(2).replace('.', ',')} €`;
      const fake3 = `${(Math.round(priceFloat * 10) / 10).toFixed(1).replace('.', ',')} €`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΤΙΜΗΣ ΣΤΑ ΕΚΑΤΟΣΤΑ',
        instruction: 'Επιλέξτε την τιμή στα πλησιέστερα εκατοστά του ευρώ (0,01 €):',
        text: `Η αξία μιας ηλεκτρονικής παραγγελίας υπολογίστηκε ακριβώς στα ${priceStr} €. Ποιο είναι το τελικό ποσό πληρωμής στρογγυλοποιημένο στα πλησιέστερα εκατοστά (λεπτά του ευρώ);`,
        tableData: { col1: 'Ακριβής Τιμή', col2: 'Στα Εκατοστά (0,01 €)', r1: [`${priceStr} €`, 'Εκατοστά'], r2: ['Ψηφίο-κλειδί (Χιλιοστά)', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Εξετάζουμε το ψηφίο των χιλιοστών. Στρογγυλοποιώντας στα πλησιέστερα εκατοστά προκύπτει ${correctStr}.`
      };
    }
  },
  {
    id: 'p_round_hard_6',
    generate: () => {
      const areaFloat = parseFloat(`${randInt(120, 480)}.${randInt(1, 9)}${randInt(1, 9)}`);
      const areaStr = areaFloat.toFixed(2).replace('.', ',');
      const roundedTens = Math.round(areaFloat / 10) * 10;
      const correctStr = `${roundedTens} τ.μ.`;
      const fake1 = `${roundedTens + 10} τ.μ.`;
      const fake2 = `${Math.max(10, roundedTens - 10)} τ.μ.`;
      const fake3 = `${Math.round(areaFloat)} τ.μ.`;

      const rawOptions = [correctStr, fake1, fake2, fake3];
      const options = shuffle([...new Set(rawOptions)]).map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      return {
        title: 'ΕΚΤΙΜΗΣΗ ΕΜΒΑΔΟΥ ΟΙΚΟΠΕΔΟΥ',
        instruction: 'Επιλέξτε το εμβαδόν στην πλησιέστερη δεκάδα τετραγωνικών μέτρων (τ.μ.):',
        text: `Ένα οικόπεδο έχει εμβαδόν ${areaStr} τ.μ. Ποιο είναι το εμβαδόν του οικοπέδου αν στρογγυλοποιηθεί στην πλησιέστερη δεκάδα τετραγωνικών μέτρων;`,
        tableData: { col1: 'Ακριβές Εμβαδόν', col2: 'Πλησιέστερη Δεκάδα', r1: [`${areaStr} τ.μ.`, 'Δεκάδες'], r2: ['Ψηφίο-κλειδί (Μονάδες)', `${correctStr}`] },
        options,
        correctText: correctStr,
        explanation: `Εξετάζουμε το ψηφίο των μονάδων. Στρογγυλοποιώντας στην πλησιέστερη δεκάδα προκύπτει ${correctStr}.`
      };
    }
  }
];

// Δημιουργία των 10 δυναμικών ερωτήσεων
function generateQuestions() {
  const qList = [];
  const shuffledItems = shuffle(REAL_WORLD_PRESETS);

  // Q1 (Input - Decimal): Στρογγυλοποίηση φυσικού αριθμού στις Δεκάδες ή Εκατοντάδες
  {
    const q1Int = randInt(125, 985);
    const q1TargetHundreds = Math.random() > 0.5;
    const q1PlaceName = q1TargetHundreds ? 'πλησιέστερη εκατοντάδα' : 'πλησιέστερη δεκάδα';
    const q1CorrectVal = q1TargetHundreds
      ? Math.round(q1Int / 100) * 100
      : Math.round(q1Int / 10) * 10;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΦΥΣΙΚΟΥ ΑΡΙΘΜΟΥ',
      instruction: 'Στρογγυλοποιήστε τον αριθμό στην επιθυμητή τάξη (ακέραιος):',
      prompt: `Στρογγυλοποιήστε τον αριθμό ${q1Int} στην ${q1PlaceName}.`,
      correctVal: q1CorrectVal,
      correctStr: String(q1CorrectVal),
      explanation: `Στον αριθμό ${q1Int}, εξετάζουμε το ψηφίο-κλειδί. Η στρογγυλοποίηση στην ${q1PlaceName} δίνει ${q1CorrectVal}.`
    });
  }

  // Q2 (Input - Decimal): Στρογγυλοποίηση δεκαδικού αριθμού στα Δέκατα (0,1)
  {
    const q2Int = randInt(12, 85);
    const q2Dec1 = randInt(1, 9);
    const q2Dec2 = randInt(1, 9);
    const q2NumberStr = `${q2Int},${q2Dec1}${q2Dec2}`;
    const q2Float = parseFloat(`${q2Int}.${q2Dec1}${q2Dec2}`);
    const q2CorrectValNum = Math.round(q2Float * 10) / 10;
    const q2CorrectVal = q2CorrectValNum.toFixed(1).replace('.', ',');

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 2 • ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΣΤΑ ΔΕΚΑΤΑ (0,1)',
      instruction: 'Στρογγυλοποιήστε τον δεκαδικό αριθμό στα πλησιέστερα δέκατα με κόμμα:',
      prompt: `Στρογγυλοποιήστε τον αριθμό ${q2NumberStr} στα πλησιέστερα δέκατα (0,1).`,
      correctVal: q2CorrectValNum,
      correctStr: q2CorrectVal,
      explanation: `Στο ${q2NumberStr}, το ψηφίο των εκατοστών είναι το ${q2Dec2}. ${q2Dec2 >= 5 ? 'Επειδή είναι ≥ 5, στρογγυλοποιούμε προς τα πάνω' : 'Επειδή είναι ＜ 5, στρογγυλοποιούμε προς τα κάτω'} σε ${q2CorrectVal}.`
    });
  }

  // Q3 (MCQ): Στρογγυλοποίηση δεκαδικού στα Εκατοστά (0,01)
  {
    const q3Int = randInt(3, 45);
    const q3Dec1 = randInt(1, 9);
    const q3Dec2 = randInt(1, 9);
    const q3Dec3 = randInt(1, 9);
    const q3NumberStr = `${q3Int},${q3Dec1}${q3Dec2}${q3Dec3}`;
    const q3Float = parseFloat(`${q3Int}.${q3Dec1}${q3Dec2}${q3Dec3}`);
    const q3CorrectVal = (Math.round(q3Float * 100) / 100).toFixed(2).replace('.', ',');
    const w1 = (parseFloat(q3CorrectVal.replace(',', '.')) + 0.01).toFixed(2).replace('.', ',');
    const w2 = (parseFloat(q3CorrectVal.replace(',', '.')) - 0.01).toFixed(2).replace('.', ',');
    const w3 = (parseFloat(q3CorrectVal.replace(',', '.')) + 0.1).toFixed(2).replace('.', ',');

    const rawOptions = [q3CorrectVal, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q3CorrectVal
    }));

    qList.push({
      id: 3,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 3 • ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΣΤΑ ΕΚΑΤΟΣΤΑ (0,01)',
      instruction: 'Επιλέξτε τη σωστή στρογγυλοποιημένη τιμή:',
      prompt: `Στρογγυλοποιήστε τον αριθμό ${q3NumberStr} στα πλησιέστερα εκατοστά (0,01).`,
      options,
      correctText: q3CorrectVal,
      explanation: `Το ψηφίο των χιλιοστών είναι το ${q3Dec3}. Επομένως, το ${q3NumberStr} στρογγυλοποιείται στο ${q3CorrectVal}.`
    });
  }

  // Q4 (MCQ): Εντοπισμός του «ψηφίου-κλειδιού»
  {
    const q4Int = randInt(120, 850);
    const q4Dec = randInt(125, 875);
    const q4NumberStr = `${q4Int},${q4Dec}`;
    const q4TargetOptions = [
      { place: 'στις δεκάδες', keyName: 'των μονάδων', digit: String(q4Int % 10) },
      { place: 'στις εκατοντάδες', keyName: 'των δεκάδων', digit: String(Math.floor((q4Int % 100) / 10)) },
      { place: 'στις ακέραιες μονάδες', keyName: 'των δεκάτων', digit: String(Math.floor(q4Dec / 100)) },
      { place: 'στα δέκατα (0,1)', keyName: 'των εκατοστών', digit: String(Math.floor((q4Dec % 100) / 10)) }
    ];
    const q4Selected = q4TargetOptions[randInt(0, 3)];
    const q4Correct = q4Selected.digit;

    const w1 = String((parseInt(q4Correct, 10) + 1) % 10);
    const w2 = String((parseInt(q4Correct, 10) + 2) % 10);
    const w3 = String((parseInt(q4Correct, 10) + 7) % 10);

    const rawOptions = [q4Correct, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q4Correct
    }));

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΕΝΤΟΠΙΣΜΟΣ ΨΗΦΙΟΥ-ΚΛΕΙΔΙΟΥ',
      instruction: 'Επιλέξτε το ψηφίο που καθορίζει τη στρογγυλοποίηση:',
      prompt: `Για να στρογγυλοποιήσουμε τον αριθμό ${q4NumberStr} ${q4Selected.place}, ποιο ψηφίο εξετάζουμε;`,
      options,
      correctText: q4Correct,
      explanation: `Εξετάζουμε το αμέσως επόμενο ψηφίο στα δεξιά (τη θέση ${q4Selected.keyName}), δηλαδή το ψηφίο ${q4Correct}.`
    });
  }

  // Q5 (MCQ): True / False - Κανόνας για τα ψηφία 5, 6, 7, 8, 9
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = q5IsTrue
      ? 'Όταν το αμέσως επόμενο ψηφίο από τη θέση στρογγυλοποίησης είναι 5, 6, 7, 8 ή 9, το ψηφίο της θέσης αυξάνεται κατά 1 (στρογγυλοποίηση προς τα πάνω).'
      : 'Όταν το αμέσως επόμενο ψηφίο από τη θέση στρογγυλοποίησης είναι 5, 6, 7, 8 ή 9, το ψηφίο της θέσης παραμένει ακριβώς το ίδιο.';
    const correctAns = q5IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q5IsTrue },
      { text: 'Λάθος', isCorrect: !q5IsTrue }
    ];

    qList.push({
      id: 5,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΨΗΦΙΩΝ 5-9',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: q5IsTrue
        ? 'Σωστό! Όταν το επόμενο ψηφίο είναι 5, 6, 7, 8 ή 9, αυξάνουμε το ψηφίο της επιθυμητής τάξης κατά 1.'
        : 'Λάθος! Όταν το επόμενο ψηφίο είναι 5, 6, 7, 8 ή 9, το ψηφίο αυξάνεται κατά 1 (στρογγυλοποίηση προς τα πάνω).'
    });
  }

  // Q6 (MCQ): True / False - Μηδενισμός των δεξιών ψηφίων
  {
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = q6IsTrue
      ? 'Όταν στρογγυλοποιούμε έναν αριθμό, όλα τα ψηφία που βρίσκονται δεξιά από τη θέση στρογγυλοποίησης μηδενίζονται ή παραλείπονται.'
      : 'Όταν στρογγυλοποιούμε έναν αριθμό, τα ψηφία που βρίσκονται δεξιά από τη θέση στρογγυλοποίησης παραμένουν αναλλοίωτα.';
    const correctAns = q6IsTrue ? 'Σωστό' : 'Λάθος';

    const options = [
      { text: 'Σωστό', isCorrect: q6IsTrue },
      { text: 'Λάθος', isCorrect: !q6IsTrue }
    ];

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΜΗΔΕΝΙΣΜΟΣ ΔΕΞΙΩΝ ΨΗΦΙΩΝ',
      instruction: 'Χαρακτηρίστε την πρόταση ως Σωστή ή Λάθος:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: q6IsTrue
        ? 'Σωστό! Μετά τη στρογγυλοποίηση, όλα τα ψηφία στα δεξιά μηδενίζονται (στους φυσικούς) ή παραλείπονται (στα δεκαδικά).'
        : 'Λάθος! Όλα τα ψηφία στα δεξιά της θέσης στρογγυλοποίησης γίνονται μηδενικά ή παραλείπονται.'
    });
  }

  // Q7 (Input - Decimal): Αριθμογραμμή Στρογγυλοποίησης
  {
    const q7Base = randInt(10, 80) * 10;
    const q7Offset = randInt(1, 9);
    const q7Val = q7Base + q7Offset;
    const q7Correct = Math.round(q7Val / 10) * 10;

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ',
      instruction: 'Συμπληρώστε την πλησιέστερη δεκάδα (ακέραιος):',
      prompt: `Σε ποια πλησιέστερη δεκάδα στρογγυλοποιείται ο αριθμός ${q7Val};`,
      val: q7Val,
      base: q7Base,
      nextBase: q7Base + 10,
      correctVal: q7Correct,
      correctStr: String(q7Correct),
      explanation: `Ο αριθμός ${q7Val} βρίσκεται πιο κοντά στο ${q7Correct} πάνω στην αριθμογραμμή.`
    });
  }

  // Q8 (MCQ): Πρόβλημα Καθημερινότητας / Εκτίμηση Κόστους
  {
    const q8Item = shuffledItems[0];
    const q8PriceFloat = parseFloat(`${randInt(15, 85)}.${randInt(1, 9)}${randInt(1, 9)}`);
    const q8PriceStr = q8PriceFloat.toFixed(2).replace('.', ',');
    const q8RoundedUnits = Math.round(q8PriceFloat);
    const q8Correct = `${q8RoundedUnits} ${q8Item.unit}`;

    const w1 = `${q8RoundedUnits + 1} ${q8Item.unit}`;
    const w2 = `${q8RoundedUnits - 1} ${q8Item.unit}`;
    const w3 = `${Math.floor(q8PriceFloat / 10) * 10} ${q8Item.unit}`;

    const rawOptions = [q8Correct, w1, w2, w3];
    const options = shuffle([...new Set(rawOptions)]).map((text) => ({
      text,
      isCorrect: text === q8Correct
    }));

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΕΚΤΙΜΗΣΗ ΣΤΗΝ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑ',
      instruction: 'Επιλέξτε τη στρογγυλοποιημένη τιμή στις ακέραιες μονάδες:',
      prompt: `Αν μετρήσαμε ${q8Item.item} ίσο με ${q8PriceStr} ${q8Item.unit}, ποια είναι η στρογγυλοποιημένη τιμή στις πλησιέστερες ακέραιες μονάδες;`,
      options,
      correctText: q8Correct,
      explanation: `Κοιτάζοντας τα δέκατα του αριθμού ${q8PriceStr}, στρογγυλοποιούμε στις πλησιέστερες ακέραιες μονάδες σε ${q8Correct}.`
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate();
    const hardProb = shuffledHard[0].generate();

    // Q9 (Input)
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: `ΕΡΩΤΗΣΗ 9 • ${stdProb.title}`,
      instruction: stdProb.instruction,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      correctVal: stdProb.correctVal,
      correctStr: stdProb.correctStr,
      explanation: stdProb.explanation
    });

    // Q10 (MCQ)
    qList.push({
      id: 10,
      type: 'mcq',
      title: `ΕΡΩΤΗΣΗ 10 • ${hardProb.title}`,
      instruction: hardProb.instruction,
      prompt: hardProb.text,
      tableData: hardProb.tableData,
      options: hardProb.options,
      correctText: hardProb.correctText,
      explanation: hardProb.explanation
    });
  }

  return qList;
}

export default function StroggilopoiisiExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργία νέων ασκήσεων
  const loadNewSet = useCallback(() => {
    const q = generateQuestions();
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμός Input με καθαρισμό χαρακτήρων (μόνο 0-9 και ένα κόμμα)
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

  // Χειρισμός MCQ
  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  const isQuestionCorrect = (q) => {
    if (q.type === 'mcq') {
      return answers[`q_${q.id}`] === q.correctText;
    }
    if (q.type === 'decimal_input') {
      const userValRaw = (answers[`q_${q.id}`] || '').trim();
      if (!userValRaw) return false;
      const cleanUser = userValRaw.replace(',', '.');
      const cleanTarget = String(q.correctStr).replace(',', '.');
      if (cleanUser === cleanTarget) return true;
      const userVal = parseFloat(cleanUser);
      return !isNaN(userVal) && Math.abs(userVal - q.correctVal) < 0.05;
    }
    return false;
  };

  // Έλεγχος Απαντήσεων
  const handleCheckAnswers = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitted) return;

    let currentScore = 0;
    questions.forEach((q) => {
      if (isQuestionCorrect(q)) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== null && String(val).trim() !== '').length;

  return (
    <Layout
      title="Ασκήσεις: Στρογγυλοποίηση Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στη στρογγυλοποίηση φυσικών και δεκαδικών αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/12-stroggilopoiisi"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 {toCleanUppercase('Θεωρία')}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 12 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ασκήσεις &amp; Προβλήματα: Στρογγυλοποίηση Αριθμών
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 δυναμικές δραστηριότητες στρογγυλοποίησης σε δεκάδες, εκατοντάδες, δέκατα και εκατοστά, αναγνώριση ψηφίου-κλειδιού και ρεαλιστικά προβλήματα καθημερινής ζωής.
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
              <span>🔄 {toCleanUppercase('Νέες Ασκήσεις')}</span>
            </button>
          </div>
        </section>

        {/* Λίστα 10 Ασκήσεων */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, idx) => {
            const isCorrect = isSubmitted && isQuestionCorrect(q);

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
                {/* Επικεφαλίδα Ερώτησης */}
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
                      {isCorrect ? `✓ ${toCleanUppercase('Σωστό')}` : `✗ ${toCleanUppercase('Λάθος')}`}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση */}
                <div className="space-y-3 mb-5">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>

                  {/* Οπτικό SVG Αριθμογραμμής για την Q7 */}
                  {q.val !== undefined && q.base !== undefined && (
                    <div className="bg-slate-100 rounded-2xl p-4 my-3 flex justify-center overflow-x-auto">
                      <svg viewBox="0 0 300 70" className="w-full max-w-xs h-16 shrink-0 select-none">
                        <line x1="30" y1="40" x2="270" y2="40" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                        
                        {/* Left Bound Tick */}
                        <line x1="40" y1="30" x2="40" y2="50" stroke="#334155" strokeWidth="2.5" />
                        <text x="40" y="62" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#334155">
                          {q.base}
                        </text>

                        {/* Right Bound Tick */}
                        <line x1="260" y1="30" x2="260" y2="50" stroke="#334155" strokeWidth="2.5" />
                        <text x="260" y="62" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#334155">
                          {q.nextBase}
                        </text>

                        {/* Mid Tick */}
                        <line x1="150" y1="35" x2="150" y2="45" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
                        <text x="150" y="25" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#94a3b8">
                          {q.base + 5}
                        </text>

                        {/* Value Pointer */}
                        <circle cx={40 + ((q.val - q.base) / 10) * 220} cy="40" r="5" fill="#2563eb" />
                        <text x={40 + ((q.val - q.base) / 10) * 220} y="18" fontSize="11" fontWeight="black" textAnchor="middle" fill="#2563eb">
                          {q.val}
                        </text>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Περιοχή Απάντησης */}
                <div className="py-2">
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        spellCheck="false"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500 font-medium">
                        (Ακέραιος ή δεκαδικός με κόμμα)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) */}
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
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 min-h-[48px] ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-300'
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

                {/* Feedback μετά την υποβολή */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-2.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? '🎉 Εξαιρετικά!' : '💡 Μαθηματική Επεξήγηση:'}</span>
                    </div>

                    {/* Οργανωτικός Πίνακας Δεδομένων στην Επεξήγηση */}
                    {q.tableData && (
                      <div className="inline-block max-w-full bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-inner my-1 font-mono text-xs sm:text-sm">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                          <span className="bg-blue-100/70 px-2 py-0.5 rounded-lg text-blue-900 break-words">{q.tableData.col1}</span>
                          <span className="bg-emerald-100/70 px-2 py-0.5 rounded-lg text-emerald-900 break-words">{q.tableData.col2}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                          <span>{q.tableData.r1[0]}</span>
                          <span className="text-indigo-700 font-bold">{q.tableData.r1[1]}</span>
                          <span>{q.tableData.r2[0]}</span>
                          <span className="text-amber-600 font-black">{q.tableData.r2[1]}</span>
                        </div>
                      </div>
                    )}

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

        {/* Κουμπί Ελέγχου στο τέλος της φόρμας */}
        {!isSubmitted && (
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={handleCheckAnswers}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
            >
              <span>🎯 {toCleanUppercase('Έλεγχος Απαντήσεων')}</span>
            </button>
          </div>
        )}

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                {isSubmitted ? toCleanUppercase('Σκορ') : toCleanUppercase('Απαντήθηκαν')}
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {isSubmitted ? `${score} / 10` : `${answeredCount} / 10`}
              </span>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-8">
                <span className="text-xs text-slate-400 font-semibold block">
                  {toCleanUppercase('Ποσοστό')}
                </span>
                <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
                  {Math.round((score / 10) * 100)} %
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                {toCleanUppercase('Έλεγχος')}
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation"
              >
                <span>🔄 {toCleanUppercase('Νέες Ασκήσεις')}</span>
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}

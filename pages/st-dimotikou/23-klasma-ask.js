// pages/st-dimotikou/23-klasma-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ & DEFENSIVE CHECKS
// ---------------------------------------------------------

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

// Αφαιρεση τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποιηση αριθμων με ελληνικο locale
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 & Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'sp1',
    title: 'Μοίρασμα Πίτσας στην Παρέα',
    unit: 'μέρος πίτσας',
    generate: () => {
      const parts = 8;
      const eaten = randInt(3, 5);
      const remaining = parts - eaten;
      return {
        prompt: `Μία μεγάλη πίτσα κόπηκε σε ${parts} ίσα κομμάτια. Μια παρέα φίλων κατανάλωσε τα ${eaten} από αυτά. Ποιο κλάσμα της πίτσας περίσσεψε;`,
        unit: 'μέρος',
        correctVal: `${remaining}/${parts}`,
        correctText: `${remaining}/${parts}`,
        tableData: [
          { item: 'Συνολικά ίσα μέρη (Παρονομαστής)', formula: `${parts}`, val: `${parts}` },
          { item: 'Κομμάτια που καταναλώθηκαν', formula: `${eaten}`, val: `${eaten}/${parts}` },
          { item: 'Κομμάτια που περίσσεψαν (Αριθμητής)', formula: `${parts} － ${eaten} ＝ ${remaining}`, val: `${remaining}/${parts}` }
        ],
        explain: `Από τα ${parts} ίσα κομμάτια έμειναν τα ${remaining}. Επομένως, το μέρος που περίσσεψε εκφράζεται από το κλάσμα ${remaining}/${parts}.`,
        distractors: [
          `${eaten}/${parts}`,
          `${parts}/${remaining}`,
          `${remaining}/${parts + 1}`
        ]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Σοκολάτα με Ίσα Τετραγωνάκια',
    unit: 'μέρος σοκολάτας',
    generate: () => {
      const parts = 12;
      const given = randInt(4, 7);
      return {
        prompt: `Μία πλάκα σοκολάτας αποτελείται από ${parts} ίσα τετραγωνάκια. Ο Νίκος κέρασε τους φίλους του τα ${given} τετραγωνάκια. Ποιο κλάσμα της σοκολάτας κέρασε ο Νίκος;`,
        unit: 'μέρος',
        correctVal: `${given}/${parts}`,
        correctText: `${given}/${parts}`,
        tableData: [
          { item: 'Σύνολο ίσων μερών', formula: `${parts}`, val: `${parts}` },
          { item: 'Μέρη που μοιράστηκαν', formula: `${given}`, val: `${given}` },
          { item: 'Κλάσμα Κεράσματος', formula: `Αριθμητής / Παρονομαστής`, val: `${given}/${parts}` }
        ],
        explain: `Ο Νίκος πήρε ${given} από τα ${parts} ίσα μέρη, άρα το κλάσμα είναι ${given}/${parts}.`,
        distractors: [
          `${parts}/${given}`,
          `${parts - given}/${parts}`,
          `${given}/${parts - 2}`
        ]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Σελίδες Εξωσχολικού Βιβλίου',
    unit: 'μέρος βιβλίου',
    generate: () => {
      const totalPages = 100;
      const readPages = randInt(25, 65);
      return {
        prompt: `Η Μαρία διαβάζει ένα βιβλίο ${totalPages} σελίδων. Μέχρι σήμερα έχει ολοκληρώσει ${readPages} σελίδες. Ποιο κλάσμα του βιβλίου έχει διαβάσει;`,
        unit: 'μέρος',
        correctVal: `${readPages}/${totalPages}`,
        correctText: `${readPages}/${totalPages}`,
        tableData: [
          { item: 'Σύνολο σελίδων (Μονάδα)', formula: `${totalPages}`, val: `${totalPages}` },
          { item: 'Σελίδες που διαβάστηκαν', formula: `${readPages}`, val: `${readPages}` },
          { item: 'Κλάσμα Μελέτης', formula: `${readPages} / ${totalPages}`, val: `${readPages}/${totalPages}` }
        ],
        explain: `Έχει διαβάσει ${readPages} από τις ${totalPages} σελίδες, άρα το αντίστοιχο κλάσμα είναι ${readPages}/${totalPages}.`,
        distractors: [
          `${totalPages}/${readPages}`,
          `${totalPages - readPages}/${totalPages}`,
          `${readPages}/10`
        ]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Διαδρομή Μαραθωνίου',
    unit: 'μέρος διαδρομής',
    generate: () => {
      const totalKm = 10;
      const doneKm = randInt(3, 7);
      return {
        prompt: `Ένας δρομέας συμμετέχει σε αγώνα ${totalKm} χιλιομέτρων. Έχει ήδη καλύψει τα πρώτα ${doneKm} χιλιόμετρα. Ποιο κλάσμα της συνολικής διαδρομής του απομένει να διανύσει;`,
        unit: 'μέρος',
        correctVal: `${totalKm - doneKm}/${totalKm}`,
        correctText: `${totalKm - doneKm}/${totalKm}`,
        tableData: [
          { item: 'Συνολική διαδρομή', formula: `${totalKm} χλμ.`, val: `${totalKm}` },
          { item: 'Διανυθείσα απόσταση', formula: `${doneKm} χλμ.`, val: `${doneKm}/${totalKm}` },
          { item: 'Απομένουσα απόσταση', formula: `${totalKm} － ${doneKm} ＝ ${totalKm - doneKm}`, val: `${totalKm - doneKm}/${totalKm}` }
        ],
        explain: `Του απομένουν ${totalKm} － ${doneKm} ＝ ${totalKm - doneKm} χιλιόμετρα από τα ${totalKm}, άρα του απομένει το ${totalKm - doneKm}/${totalKm} της διαδρομής.`,
        distractors: [
          `${doneKm}/${totalKm}`,
          `${totalKm}/${totalKm - doneKm}`,
          `${totalKm - doneKm}/12`
        ]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Κουτί με Χρωματιστές Μπάλες',
    unit: 'κλάσμα συνόλου',
    generate: () => {
      const red = randInt(3, 6);
      const blue = randInt(4, 7);
      const total = red + blue;
      return {
        prompt: `Σε ένα κουτί υπάρχουν ${red} κόκκινες και ${blue} μπλε μπάλες. Ποιο κλάσμα του συνόλου των μπαλών αποτελούν οι κόκκινες μπάλες;`,
        unit: 'κλάσμα',
        correctVal: `${red}/${total}`,
        correctText: `${red}/${total}`,
        tableData: [
          { item: 'Κόκκινες μπάλες', formula: `${red}`, val: `${red}` },
          { item: 'Μπλε μπάλες', formula: `${blue}`, val: `${blue}` },
          { item: 'Σύνολο μπαλών (Παρονομαστής)', formula: `${red} ＋ ${blue} ＝ ${total}`, val: `${total}` },
          { item: 'Κλάσμα κόκκινων', formula: `${red}/${total}`, val: `${red}/${total}` }
        ],
        explain: `Το σύνολο των μπαλών είναι ${red} ＋ ${blue} ＝ ${total}. Οι κόκκινες είναι ${red}, άρα αποτελούν το ${red}/${total} του συνόλου.`,
        distractors: [
          `${red}/${blue}`,
          `${blue}/${total}`,
          `${blue}/${red}`
        ]
      };
    }
  },
  {
    id: 'sp6',
    title: 'Κομμάτια Σπιτικής Πίτας',
    unit: 'μέρος πίτας',
    generate: () => {
      const parts = 6;
      const eaten = randInt(2, 4);
      return {
        prompt: `Μία σπανακόπιτα κόπηκε σε ${parts} ίσα κομμάτια και σερβιρίστηκαν τα ${eaten} από αυτά. Ποιο κλάσμα της πίτας σερβιρίστηκε;`,
        unit: 'μέρος',
        correctVal: `${eaten}/${parts}`,
        correctText: `${eaten}/${parts}`,
        tableData: [
          { item: 'Ίσα κομμάτια πίτας', formula: `${parts}`, val: `${parts}` },
          { item: 'Κομμάτια που σερβιρίστηκαν', formula: `${eaten}`, val: `${eaten}` },
          { item: 'Κλάσμα σερβιρίσματος', formula: `${eaten}/${parts}`, val: `${eaten}/${parts}` }
        ],
        explain: `Σερβιρίστηκαν ${eaten} από τα ${parts} ίσα κομμάτια, επομένως το κλάσμα είναι ${eaten}/${parts}.`,
        distractors: [
          `${parts}/${eaten}`,
          `${parts - eaten}/${parts}`,
          `${eaten}/${parts + 2}`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Πάνω από Μία Πίτσες (Καταχρηστικό)',
    unit: 'πίτσες',
    generate: () => {
      // 10 κομμάτια όταν κάθε πίτσα έχει 4 μέρη -> 10/4 = 2 ολόκληρες και 2/4
      const partsPerPizza = 4;
      const totalSlices = randInt(9, 14);
      return {
        prompt: `Σε ένα παιδικό πάρτι, κάθε πίτσα κόβεται σε ${partsPerPizza} ίσα κομμάτια. Τα παιδιά κατανάλωσαν συνολικά ${totalSlices} κομμάτια. Ποιο κλάσμα εκφράζει την ποσότητα πίτσας που φαγώθηκε και τι είδους κλάσμα είναι;`,
        unit: 'κλάσμα',
        correctVal: `${totalSlices}/${partsPerPizza}`,
        correctText: `${totalSlices}/${partsPerPizza} (Καταχρηστικό ＞ 1)`,
        tableData: [
          { item: 'Μέρη ανά μονάδα (Παρονομαστής)', formula: `${partsPerPizza}`, val: `${partsPerPizza}` },
          { item: 'Συνολικά κομμάτια (Αριθμητής)', formula: `${totalSlices}`, val: `${totalSlices}` },
          { item: 'Είδος Κλάσματος', formula: `${totalSlices} ＞ ${partsPerPizza}`, val: 'Καταχρηστικό (＞ 1)' }
        ],
        explain: `Επειδή κάθε μονάδα (πίτσα) χωρίζεται σε ${partsPerPizza} μέρη και καταναλώθηκαν ${totalSlices} κομμάτια, το κλάσμα είναι ${totalSlices}/${partsPerPizza}. Εφόσον ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή (${totalSlices} ＞ ${partsPerPizza}), το κλάσμα είναι καταχρηστικό (μεγαλύτερο από 1).`,
        distractors: [
          `${partsPerPizza}/${totalSlices} (Γνήσιο ＜ 1)`,
          `${totalSlices}/${partsPerPizza} (Γνήσιο ＜ 1)`,
          `${totalSlices}/${partsPerPizza * 2} (Γνήσιο ＜ 1)`
        ]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Σοκολάτες για την Εκδρομή',
    unit: 'σοκολάτες',
    generate: () => {
      // Κάθε σοκολάτα έχει 6 σειρές. Φαγώθηκαν 15 σειρές -> 15/6
      const den = 6;
      const num = randInt(13, 19);
      return {
        prompt: `Στην εκδρομή, κάθε σοκολάτα αποτελείται από ${den} ίσα μέρη. Μια ομάδα μαθητών κατανάλωσε συνολικά ${num} τέτοια μέρη. Ποιο κλάσμα εκφράζει την ποσότητα των σοκολατών που καταναλώθηκαν;`,
        unit: 'κλάσμα',
        correctVal: `${num}/${den}`,
        correctText: `${num}/${den} σοκολάτες`,
        tableData: [
          { item: 'Ίσα μέρη ανά σοκολάτα', formula: `${den}`, val: `${den}` },
          { item: 'Μέρη που καταναλώθηκαν', formula: `${num}`, val: `${num}` },
          { item: 'Κλάσμα Σοκολατών', formula: `${num}/${den}`, val: `${num}/${den}` }
        ],
        explain: `Η μία ακέραια μονάδα αντιστοιχεί σε ${den} μέρη (παρονομαστής). Καταναλώθηκαν ${num} μέρη (αριθμητής). Επομένως, καταναλώθηκαν ${num}/${den} σοκολάτες.`,
        distractors: [
          `${den}/${num} σοκολάτες`,
          `${num - den}/${den} σοκολάτες`,
          `${num}/${den + 2} σοκολάτες`
        ]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Ακέραια Μερίδια Αναψυκτικού',
    unit: 'ακέραιος',
    generate: () => {
      const den = randInt(3, 5);
      const whole = randInt(3, 6);
      const num = den * whole;
      return {
        prompt: `Σε μία δεξίωση σερβιρίστηκαν ${num} ποτήρια χυμού. Αν κάθε μπουκάλι χωράει ακριβώς ${den} ποτήρια, πόσα ολόκληρα μπουκάλια χυμού καταναλώθηκαν;`,
        unit: 'μπουκάλια',
        correctVal: String(whole),
        correctText: `${num}/${den} ＝ ${whole} ολόκληρα μπουκάλια`,
        tableData: [
          { item: 'Ποτήρια ανά μπουκάλι (Παρονομαστής)', formula: `${den}`, val: `${den}` },
          { item: 'Συνολικά ποτήρια (Αριθμητής)', formula: `${num}`, val: `${num}` },
          { item: 'Διαίρεση / Ακέραιο αποτέλεσμα', formula: `${num} : ${den}`, val: `${whole} μπουκάλια` }
        ],
        explain: `Το κλάσμα είναι ${num}/${den}. Επειδή η γραμμή του κλάσματος σημαίνει διαίρεση, υπολογίζουμε: ${num} : ${den} ＝ ${whole} ολόκληρα μπουκάλια.`,
        distractors: [
          `${num}/${den} ＝ ${whole + 1} ολόκληρα μπουκάλια`,
          `${num}/${den} ＝ ${whole - 1} ολόκληρα μπουκάλια`,
          `${den}/${num} μπουκάλια`
        ]
      };
    }
  },
  {
    id: 'hp4',
    title: 'Σύγκριση Μεριδίων με τη Μονάδα',
    unit: 'σύγκριση',
    generate: () => {
      const den = randInt(5, 9);
      const proper = `${den - 1}/${den}`;
      const improper = `${den + 2}/${den}`;
      const unitFrac = `${den}/${den}`;
      return {
        prompt: `Δίνονται τα κλάσματα: Α ＝ ${proper}, Β ＝ ${unitFrac} και Γ ＝ ${improper}. Ποια από τις παρακάτω προτάσεις είναι απόλυτα ΣΩΣΤΗ;`,
        unit: 'σύγκριση',
        correctVal: 'Το Α ＜ 1, το Β ＝ 1 και το Γ ＞ 1',
        correctText: 'Το Α ＜ 1, το Β ＝ 1 και το Γ ＞ 1',
        tableData: [
          { item: `Κλάσμα Α (${proper})`, formula: `${den - 1} ＜ ${den}`, val: 'Γνήσιο (＜ 1)' },
          { item: `Κλάσμα Β (${unitFrac})`, formula: `${den} ＝ ${den}`, val: 'Ίσο με τη Μονάδα (＝ 1)' },
          { item: `Κλάσμα Γ (${improper})`, formula: `${den + 2} ＞ ${den}`, val: 'Καταχρηστικό (＞ 1)' }
        ],
        explain: `Στο Α ο αριθμητής είναι μικρότερος (${den - 1} ＜ ${den}), άρα Α ＜ 1. Στο Β είναι ίσοι, άρα Β ＝ 1. Στο Γ ο αριθμητής είναι μεγαλύτερος (${den + 2} ＞ ${den}), άρα Γ ＞ 1.`,
        distractors: [
          'Και τα τρία κλάσματα είναι μικρότερα από το 1',
          'Το Α ＞ 1, το Β ＝ 1 και το Γ ＜ 1',
          'Και τα τρία κλάσματα είναι ίσα με τη μονάδα'
        ]
      };
    }
  },
  {
    id: 'hp5',
    title: 'Ζαχαροπλαστική και Μερίδες Αλευριού',
    unit: 'κιλά (kg)',
    generate: () => {
      // 8 τέταρτα του κιλού -> 8/4 = 2 kg
      const quarters = 8;
      return {
        prompt: `Μία συνταγή απαιτεί ${quarters} τέταρτα (δηλαδή ${quarters}/4) του κιλού αλεύρι. Πόσα ολόκληρα κιλά αλεύρι χρειαζόμαστε;`,
        unit: 'kg',
        correctVal: '2',
        correctText: '2 ολόκληρα κιλά (8/4 kg)',
        tableData: [
          { item: 'Ποσότητα σε τέταρτα', formula: '8/4 kg', val: '8/4' },
          { item: 'Υπολογισμός Ακεραίου', formula: '8 : 4', val: '2 kg' }
        ],
        explain: `Το κλάσμα 8/4 σημαίνει 8 : 4 ＝ 2 ολόκληρα κιλά αλεύρι.`,
        distractors: [
          '4 ολόκληρα κιλά',
          '1 ολόκληρο κιλό',
          '8 ολόκληρα κιλά'
        ]
      };
    }
  },
  {
    id: 'hp6',
    title: 'Χρόνος Μελέτης σε Κλάσμα της Ώρας',
    unit: 'λεπτά',
    generate: () => {
      // 3/4 της ώρας = 45 λεπτά ή 2/5 της ώρας = 24 λεπτά
      const pairs = [
        { frac: '3/4', num: 3, den: 4, mins: 45 },
        { frac: '2/4', num: 2, den: 4, mins: 30 },
        { frac: '1/4', num: 1, den: 4, mins: 15 },
        { frac: '2/3', num: 2, den: 3, mins: 40 }
      ];
      const p = pairs[randInt(0, pairs.length - 1)];
      return {
        prompt: `Ο Κώστας διάβασε Μαθηματικά για τα ${p.frac} της ώρας. Πόσα λεπτά διήρκεσε η μελέτη του; (1 ώρα ＝ 60 λεπτά)`,
        unit: 'λεπτά',
        correctVal: String(p.mins),
        correctText: `${p.mins} λεπτά`,
        tableData: [
          { item: '1 ολόκληρη ώρα', formula: '60 λεπτά', val: '60' },
          { item: `Κλάσμα 1/${p.den} της ώρας`, formula: `60 : ${p.den}`, val: `${60 / p.den} λεπτά` },
          { item: `Κλάσμα ${p.frac} της ώρας`, formula: `${60 / p.den} · ${p.num}`, val: `${p.mins} λεπτά` }
        ],
        explain: `Η ώρα έχει 60 λεπτά. Χωρίζουμε σε ${p.den} ίσα μέρη: 60 : ${p.den} ＝ ${60 / p.den} λεπτά. Παίρνουμε ${p.num} μέρη: ${60 / p.den} · ${p.num} ＝ ${p.mins} λεπτά.`,
        distractors: [
          `${p.mins + 10} λεπτά`,
          `${Math.max(10, p.mins - 15)} λεπτά`,
          `${p.num * 10} λεπτά`
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Αναγνώριση όρων κλάσματος (Αριθμητής ή Παρονομαστής)
  const q1Num = randInt(2, 9);
  const q1Den = randInt(q1Num + 1, 15);
  const q1AskNumerator = Math.random() > 0.5;
  const q1Prompt = q1AskNumerator
    ? `Ποιος αριθμός είναι ο αριθμητής του κλάσματος ${q1Num}/${q1Den};`
    : `Ποιος αριθμός είναι ο παρονομαστής του κλάσματος ${q1Num}/${q1Den};`;
  const q1Correct = String(q1AskNumerator ? q1Num : q1Den);

  // Q2: MCQ - Κατηγορία κλάσματος (Γνήσιο, Καταχρηστικό, Ίσο με τη μονάδα)
  const q2Type = ['proper', 'improper', 'unit'][randInt(0, 2)];
  let q2Num, q2Den, q2CorrectType;
  if (q2Type === 'proper') {
    q2Den = randInt(4, 12);
    q2Num = randInt(1, q2Den - 1);
    q2CorrectType = 'Γνήσιο κλάσμα (＜ 1)';
  } else if (q2Type === 'improper') {
    q2Den = randInt(3, 8);
    q2Num = randInt(q2Den + 1, 15);
    q2CorrectType = 'Καταχρηστικό κλάσμα (＞ 1)';
  } else {
    q2Den = randInt(3, 10);
    q2Num = q2Den;
    q2CorrectType = 'Ίσο με τη μονάδα (＝ 1)';
  }
  const q2Options = shuffle([
    ...new Set(['Γνήσιο κλάσμα (＜ 1)', 'Καταχρηστικό κλάσμα (＞ 1)', 'Ίσο με τη μονάδα (＝ 1)'])
  ]);

  // Q3: Input - Οπτικό μοντέλο ορθογωνίου: Πόσα είναι τα χρωματισμένα μέρη
  const q3Total = [4, 5, 6, 8, 10][randInt(0, 4)];
  const q3Filled = randInt(1, q3Total - 1);
  const q3Correct = `${q3Filled}/${q3Total}`;

  // Q4: MCQ - Ποιο κλάσμα ισούται με ακέραιο αριθμό
  const q4Whole = randInt(2, 5);
  const q4Den = randInt(2, 6);
  const q4Num = q4Whole * q4Den;
  const q4CorrectStr = `${q4Num}/${q4Den}`;
  const q4Wrongs = [
    `${q4Num + 1}/${q4Den}`,
    `${q4Num - 1}/${q4Den}`,
    `${q4Num}/${q4Den + 1}`
  ];
  const q4Options = shuffle([...new Set([q4CorrectStr, ...q4Wrongs])]);

  // Q5: True/False - Ο παρονομαστής δεν μπορεί να είναι 0
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Ο παρονομαστής ενός κλάσματος δεν μπορεί ποτέ να είναι ίσος με το μηδέν (0).'
    : 'Ο αριθμητής ενός κλάσματος δεν μπορεί ποτέ να είναι ίσος με το μηδέν (0).';

  // Q6: True/False - Σχέση αριθμητή και παρονομαστή στα γνήσια κλάσματα
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Σε ένα γνήσιο κλάσμα, ο αριθμητής είναι πάντοτε μικρότερος από τον παρονομαστή (＜ 1).'
    : 'Σε ένα γνήσιο κλάσμα, ο αριθμητής είναι πάντοτε μεγαλύτερος από τον παρονομαστή (＞ 1).';

  // Q7: Input - Δεκαδική τιμή απλού κλάσματος
  const q7Pairs = [
    { num: 1, den: 2, dec: '0,5' },
    { num: 1, den: 4, dec: '0,25' },
    { num: 3, den: 4, dec: '0,75' },
    { num: 3, den: 10, dec: '0,3' },
    { num: 7, den: 10, dec: '0,7' },
    { num: 9, den: 100, dec: '0,09' }
  ];
  const q7Selected = q7Pairs[randInt(0, q7Pairs.length - 1)];

  // Q8: MCQ - Σημασία της γραμμής του κλάσματος
  const q8Pool = [
    {
      prompt: 'Ποια μαθηματική πράξη συμβολίζει πάντοτε η γραμμή του κλάσματος ανάμεσα στον αριθμητή και τον παρονομαστή;',
      correct: 'Τη διαίρεση ( : )',
      wrong: ['Τον πολλαπλασιασμό ( · )', 'Την πρόσθεση ( ＋ )', 'Την αφαίρεση ( － )'],
      explain: 'Η γραμμή του κλάσματος ισοδυναμεί πάντοτε με διαίρεση: Αριθμητής : Παρονομαστής.'
    },
    {
      prompt: 'Αν ένα κλάσμα έχει αριθμητή ίσο με 0 και παρονομαστή 8 (0/8), με ποιον αριθμό ισούται;',
      correct: 'Με το 0 (0 : 8 ＝ 0)',
      wrong: ['Με το 1', 'Με το 8', 'Δεν ορίζεται'],
      explain: 'Όταν ο αριθμητής είναι 0 και ο παρονομαστής διάφορος του μηδενός, το αποτέλεσμα της διαίρεσης είναι 0 (0 : 8 ＝ 0).'
    }
  ];
  const q8Data = q8Pool[randInt(0, q8Pool.length - 1)];
  const q8Options = shuffle([...new Set([q8Data.correct, ...q8Data.wrong])]);

  // Q9: Standard Problem (Pool of 6)
  const spIndex = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q9Raw = STANDARD_PROBLEMS_POOL[spIndex].generate();
  const q9Options = shuffle([
    ...new Set([q9Raw.correctText, ...q9Raw.distractors])
  ]);

  // Q10: Hard Problem (Pool of 6)
  const hpIndex = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Raw = HARD_PROBLEMS_POOL[hpIndex].generate();
  const q10Options = shuffle([
    ...new Set([q10Raw.correctText, ...q10Raw.distractors])
  ]);

  return [
    {
      id: 'q1',
      type: 'input',
      title: 'Αναγνώριση Όρων Κλάσματος',
      prompt: q1Prompt,
      correct: q1Correct,
      explain: q1AskNumerator
        ? `Στο κλάσμα ${q1Num}/${q1Den}, ο αριθμητής (ο πάνω όρος) είναι το ${q1Num}.`
        : `Στο κλάσμα ${q1Num}/${q1Den}, ο παρονομαστής (ο κάτω όρος) είναι το ${q1Den}.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Κατηγορία Κλάσματος',
      prompt: `Τι είδους κλάσμα είναι το ${q2Num}/${q2Den};`,
      options: q2Options,
      correct: q2CorrectType,
      explain:
        q2Type === 'proper'
          ? `Είναι γνήσιο κλάσμα επειδή ο αριθμητής (${q2Num}) είναι μικρότερος από τον παρονομαστή (${q2Den}).`
          : q2Type === 'improper'
          ? `Είναι καταχρηστικό κλάσμα επειδή ο αριθμητής (${q2Num}) είναι μεγαλύτερος από τον παρονομαστή (${q2Den}).`
          : `Είναι ίσο με τη μονάδα επειδή ο αριθμητής και ο παρονομαστής είναι ίσοι (${q2Num}/${q2Den} ＝ 1).`
    },
    {
      id: 'q3',
      type: 'input',
      title: 'Οπτικό Μοντέλο Ορθογωνίου',
      total: q3Total,
      filled: q3Filled,
      prompt: `Γράψε το κλάσμα που αντιστοιχεί στα χρωματισμένα μέρη του παρακάτω σχήματος (π.χ. 3/5):`,
      correct: q3Correct,
      explain: `Έχουν χρωματιστεί ${q3Filled} από τα ${q3Total} ίσα μέρη, άρα το κλάσμα είναι ${q3Filled}/${q3Total}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Κλάσμα & Ακέραιος Αριθμός',
      prompt: `Ποιο από τα παρακάτω κλάσματα ισούται ακριβώς με τον ακέραιο αριθμό ${q4Whole};`,
      options: q4Options,
      correct: q4CorrectStr,
      explain: `Η γραμμή του κλάσματος σημαίνει διαίρεση: ${q4Num} : ${q4Den} ＝ ${q4Whole}.`
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Ιδιότητα Παρονομαστή',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Η διαίρεση με το μηδέν δεν ορίζεται, άρα ο παρονομαστής δεν μπορεί ποτέ να είναι 0.'
        : 'Λάθος! Ο αριθμητής ΜΠΟΡΕΙ να είναι 0 (0/5 ＝ 0). Ο παρονομαστής είναι αυτός που απαγορεύεται αυστηρά να είναι 0.'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Έννοια Γνήσιου Κλάσματος',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Στα γνήσια κλάσματα παίρνουμε λιγότερα μέρη από όσα χωρίσαμε τη μονάδα (Αριθμητής ＜ Παρονομαστής).'
        : 'Λάθος! Όταν ο αριθμητής είναι μεγαλύτερος από τον παρονομαστή, το κλάσμα ονομάζεται καταχρηστικό (＞ 1).'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Δεκαδική Αξία Κλάσματος',
      prompt: `Γράψε τη δεκαδική τιμή του κλάσματος ${q7Selected.num}/${q7Selected.den} (π.χ. 0,5):`,
      correct: q7Selected.dec,
      explain: `${q7Selected.num}/${q7Selected.den} ＝ ${q7Selected.num} : ${q7Selected.den} ＝ ${q7Selected.dec}.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Ιδιότητες & Σύμβολα Κλάσματος',
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correct,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'mcq',
      title: `Πρόβλημα: ${STANDARD_PROBLEMS_POOL[spIndex].title}`,
      prompt: q9Raw.prompt,
      options: q9Options,
      correct: q9Raw.correctText,
      tableData: q9Raw.tableData,
      explain: q9Raw.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `Σύνθετο Πρόβλημα: ${HARD_PROBLEMS_POOL[hpIndex].title}`,
      prompt: q10Raw.prompt,
      options: q10Options,
      correct: q10Raw.correctText,
      tableData: q10Raw.tableData,
      explain: q10Raw.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function KlasmaExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions();
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach(q => {
      initialAnswers[q.id] = q.type === 'tf' ? null : '';
    });
    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleInputChange = (id, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
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
    questions.forEach(q => {
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

  return (
    <Layout
      title="Ασκήσεις: Η Έννοια του Κλάσματος - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην έννοια του κλάσματος, στον αριθμητή και στον παρονομαστή για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/23-klasma"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase('Θεωρία')}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-32 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>ΚΕΦΑΛΑΙΟ 23 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Η Έννοια του Κλάσματος
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εμπεδώσεις τον αριθμητή, τον παρονομαστή, τα γνήσια και καταχρηστικά κλάσματα και τα οπτικά μοντέλα!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase('Νέες Ασκήσεις')}</span>
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
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all ${getCardStyle(q)}`}
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider">
                        {toCleanUppercase(`Άσκηση ${qNum}`)} • {toCleanUppercase(q.title)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4">
                      {q.type === 'tf' ? `«${q.text}»` : q.prompt}
                    </p>

                    {/* SVG ΟΠΤΙΚΟ ΜΟΝΤΕΛΟ (ΓΙΑ ΤΗΝ Q3) */}
                    {q.type === 'input' && q.id === 'q3' && (
                      <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-4 flex gap-1 shadow-inner overflow-hidden">
                        {Array.from({ length: q.total }).map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-10 rounded-md border border-slate-300 transition-all ${
                              i < q.filled ? 'bg-amber-500 shadow-xs' : 'bg-white'
                            }`}
                          />
                        ))}
                      </div>
                    )}

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
                              onClick={() => handleInputChange(q.id, opt)}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words whitespace-normal leading-snug flex items-center justify-center min-h-[48px] ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'input' && (
                      <div className="space-y-2 mb-3">
                        <input
                          type="text"
                          inputMode={q.id === 'q3' ? 'text' : 'numeric'}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder={q.id === 'q3' ? 'π.χ. 3/5' : 'Γράψε την απάντησή σου...'}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}

                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(q.id, true)}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            answers[q.id] === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                          }`}
                        >
                          👍 {toCleanUppercase('Σωστό')}
                        </button>
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(q.id, false)}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            answers[q.id] === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          👎 {toCleanUppercase('Λάθος')}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                      {q.tableData && q.tableData.length > 0 && (
                        <div className="overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          <table className="w-full text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase('Στοιχείο')}</th>
                                <th className="p-1.5">{toCleanUppercase('Ανάλυση / Τύπος')}</th>
                                <th className="p-1.5">{toCleanUppercase('Τιμή')}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900">{row.item}</td>
                                  <td className="p-1.5 text-indigo-700">{row.formula}</td>
                                  <td className="p-1.5 font-black text-emerald-700">{row.val}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? '🎯 Εξαιρετικά!' : '💡 Επεξήγηση:'}
                        </p>
                        <p>{q.explain}</p>
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation"
              >
                <span className="text-xl">🎯</span>
                <span>{toCleanUppercase('Έλεγχος Απαντήσεων')}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{toCleanUppercase('Σκορ')}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">{score} / 10</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase('Ποσοστό')}:{' '}
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
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase('Νέες Ασκήσεις')}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Απάντησε και στις 10 ερωτήσεις και πάτησε «{toCleanUppercase('Έλεγχος Απαντήσεων')}»!
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}

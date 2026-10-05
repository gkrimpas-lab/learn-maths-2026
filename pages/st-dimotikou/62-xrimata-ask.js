// pages/st-dimotikou/62-xrimata-ask.js
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

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποίηση αριθμών με ελληνικό locale
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
    title: 'Αγορές στο Βιβλιοπωλείο',
    unit: '€',
    generate: () => {
      // 3 τετράδια προς 1,80€ + 2 στυλό προς 0,85€ = 5,40 + 1,70 = 7,10€. Πληρωμή με 10€ -> Ρέστα 2,90€
      const itemsA = 3;
      const priceA = 1.8;
      const itemsB = 2;
      const priceB = 0.85;
      const paid = 10;
      const costTotal = itemsA * priceA + itemsB * priceB;
      const change = Number((paid - costTotal).toFixed(2));
      const changeStr = change.toFixed(2).replace('.', ',');
      const correctText = `${changeStr} €`;
      return {
        prompt: `Η Ελένη αγόρασε ${itemsA} τετράδια προς 1,80€ το καθένα και ${itemsB} στυλό προς 0,85€ το καθένα. Πλήρωσε με χαρτονόμισμα των ${paid}€. Πόσα ρέστα θα πάρει;`,
        correctText,
        tableData: [
          { item: 'Κόστος τετραδίων', formula: `${itemsA} · 1,80 €`, val: `${(itemsA * priceA).toFixed(2).replace('.', ',')} €` },
          { item: 'Κόστος στυλό', formula: `${itemsB} · 0,85 €`, val: `${(itemsB * priceB).toFixed(2).replace('.', ',')} €` },
          { item: 'Συνολική δαπάνη', formula: '5,40 ＋ 1,70 €', val: `${costTotal.toFixed(2).replace('.', ',')} €` },
          { item: 'Ρέστα', formula: `${paid},00 － ${costTotal.toFixed(2).replace('.', ',')} €`, val: `${changeStr} €` }
        ],
        explain: `Υπολογίζουμε τη δαπάνη: (${itemsA} · 1,80) ＋ (${itemsB} · 0,85) ＝ 5,40 ＋ 1,70 ＝ ${costTotal.toFixed(2).replace('.', ',')} €. Αφαιρούμε από το χαρτονόμισμα: ${paid} － ${costTotal.toFixed(2).replace('.', ',')} ＝ ${changeStr} €.`,
        distractors: [
          `${(change + 1).toFixed(2).replace('.', ',')} €`,
          `${(change - 0.5).toFixed(2).replace('.', ',')} €`,
          `${(paid - itemsA * priceA).toFixed(2).replace('.', ',')} €`
        ]
      };
    }
  },
  {
    id: 'sp2',
    title: 'Αγορά Φρούτων στο Μανάβικο',
    unit: '€',
    generate: () => {
      // 2,5 κιλά μήλα προς 1,40€/κιλό και 1,5 κιλό πορτοκάλια προς 1,20€/κιλό = 3,50 + 1,80 = 5,30€. Πληρωμή με 10€ -> 4,70€
      const kgA = 2.5;
      const priceA = 1.4;
      const kgB = 1.5;
      const priceB = 1.2;
      const paid = 10;
      const costTotal = kgA * priceA + kgB * priceB;
      const change = Number((paid - costTotal).toFixed(2));
      const changeStr = change.toFixed(2).replace('.', ',');
      const correctText = `${changeStr} €`;
      return {
        prompt: `Ένας πελάτης αγόρασε 2,5 κιλά μήλα προς 1,40€ το κιλό και 1,5 κιλό πορτοκάλια προς 1,20€ το κιλό. Πλήρωσε με χαρτονόμισμα των ${paid}€. Πόσα ρέστα πήρε;`,
        correctText,
        tableData: [
          { item: 'Μήλα', formula: '2,5 · 1,40 €', val: '3,50 €' },
          { item: 'Πορτοκάλια', formula: '1,5 · 1,20 €', val: '1,80 €' },
          { item: 'Συνολικό κόστος', formula: '3,50 ＋ 1,80 €', val: '5,30 €' },
          { item: 'Ρέστα', formula: '10,00 － 5,30 €', val: `${changeStr} €` }
        ],
        explain: `Κόστος μήλων: 2,5 · 1,40 ＝ 3,50 €. Κόστος πορτοκαλιών: 1,5 · 1,20 ＝ 1,80 €. Σύνολο: 3,50 ＋ 1,80 ＝ 5,30 €. Ρέστα: 10,00 － 5,30 ＝ ${changeStr} €.`,
        distractors: [
          `${(change + 0.4).toFixed(2).replace('.', ',')} €`,
          `${(change - 1).toFixed(2).replace('.', ',')} €`,
          '5,30 €'
        ]
      };
    }
  },
  {
    id: 'sp3',
    title: 'Κέρασμα στο Κυλικείο',
    unit: '€',
    generate: () => {
      // 4 τοστ προς 1,75€ και 4 χυμοί προς 0,90€ = 7,00 + 3,60 = 10,60€. Πληρωμή με 20€ -> 9,40€
      const count = 4;
      const priceToast = 1.75;
      const priceJuice = 0.9;
      const paid = 20;
      const costTotal = count * priceToast + count * priceJuice;
      const change = Number((paid - costTotal).toFixed(2));
      const changeStr = change.toFixed(2).replace('.', ',');
      const correctText = `${changeStr} €`;
      return {
        prompt: `Ο Κώστας αγόρασε από το κυλικείο ${count} τοστ προς 1,75€ το καθένα και ${count} χυμούς προς 0,90€ τον καθένα. Πλήρωσε με χαρτονόμισμα των ${paid}€. Πόσα ρέστα έλαβε;`,
        correctText,
        tableData: [
          { item: 'Τοστ', formula: `${count} · 1,75 €`, val: '7,00 €' },
          { item: 'Χυμοί', formula: `${count} · 0,90 €`, val: '3,60 €' },
          { item: 'Σύνολο αγορών', formula: '7,00 ＋ 3,60 €', val: '10,60 €' },
          { item: 'Ρέστα', formula: '20,00 － 10,60 €', val: `${changeStr} €` }
        ],
        explain: `Τοστ: ${count} · 1,75 ＝ 7,00 €. Χυμοί: ${count} · 0,90 ＝ 3,60 €. Σύνολο: 7,00 ＋ 3,60 ＝ 10,60 €. Ρέστα: ${paid} － 10,60 ＝ ${changeStr} €.`,
        distractors: [
          `${(change + 1).toFixed(2).replace('.', ',')} €`,
          `${(change - 0.4).toFixed(2).replace('.', ',')} €`,
          '10,60 €'
        ]
      };
    }
  },
  {
    id: 'sp4',
    title: 'Αγορά Αθλητικού Εξοπλισμού',
    unit: '€',
    generate: () => {
      // Μπάλα 14,50€, κάλτσες 3,80€, καπελάκι 6,20€ = 24,50€. Πληρωμή με 50€ -> 25,50€
      const p1 = 14.5;
      const p2 = 3.8;
      const p3 = 6.2;
      const paid = 50;
      const costTotal = p1 + p2 + p3;
      const change = Number((paid - costTotal).toFixed(2));
      const changeStr = change.toFixed(2).replace('.', ',');
      const correctText = `${changeStr} €`;
      return {
        prompt: `Ένας μαθητής αγόρασε μια μπάλα προς 14,50€, ένα ζευγάρι κάλτσες προς 3,80€ και ένα καπελάκι προς 6,20€. Πλήρωσε με χαρτονόμισμα των ${paid}€. Πόσα ρέστα πήρε;`,
        correctText,
        tableData: [
          { item: 'Αθλητικά είδη', formula: '14,50 ＋ 3,80 ＋ 6,20 €', val: '24,50 €' },
          { item: 'Πληρωμή', formula: '50,00 €', val: '50,00 €' },
          { item: 'Ρέστα', formula: '50,00 － 24,50 €', val: `${changeStr} €` }
        ],
        explain: `Συνολικό κόστος: 14,50 ＋ 3,80 ＋ 6,20 ＝ 24,50 €. Ρέστα: 50,00 － 24,50 ＝ ${changeStr} €.`,
        distractors: [
          `${(change + 2).toFixed(2).replace('.', ',')} €`,
          `${(change - 1).toFixed(2).replace('.', ',')} €`,
          '24,50 €'
        ]
      };
    }
  },
  {
    id: 'sp5',
    title: 'Αγορά Εισιτηρίων Θεάτρου',
    unit: '€',
    generate: () => {
      // 2 εισιτήρια ενηλίκων προς 12,50€ και 2 παιδικά προς 7,50€ = 25 + 15 = 40€. Πληρωμή με 50€ -> 10€
      const adult = 2;
      const pAdult = 12.5;
      const child = 2;
      const pChild = 7.5;
      const paid = 50;
      const costTotal = adult * pAdult + child * pChild;
      const change = Number((paid - costTotal).toFixed(2));
      const changeStr = change.toFixed(2).replace('.', ',');
      const correctText = `${changeStr} €`;
      return {
        prompt: `Μια οικογένεια αγόρασε 2 εισιτήρια ενηλίκων προς 12,50€ το ένα και 2 παιδικά εισιτήρια προς 7,50€ το ένα. Πλήρωσαν με χαρτονόμισμα των ${paid}€. Πόσα ρέστα πήραν;`,
        correctText,
        tableData: [
          { item: 'Εισιτήρια ενηλίκων', formula: '2 · 12,50 €', val: '25,00 €' },
          { item: 'Παιδικά εισιτήρια', formula: '2 · 7,50 €', val: '15,00 €' },
          { item: 'Συνολικό κόστος', formula: '25,00 ＋ 15,00 €', val: '40,00 €' },
          { item: 'Ρέστα', formula: '50,00 － 40,00 €', val: `${changeStr} €` }
        ],
        explain: `Ενήλικες: 2 · 12,50 ＝ 25 €. Παιδιά: 2 · 7,50 ＝ 15 €. Σύνολο: 25 ＋ 15 ＝ 40 €. Ρέστα: 50 － 40 ＝ ${changeStr} €.`,
        distractors: ['15,00 €', '5,00 €', '8,00 €']
      };
    }
  },
  {
    id: 'sp6',
    title: 'Αγορά Σχολικών Βοηθημάτων',
    unit: '€',
    generate: () => {
      // Λεξικό 8,40€ και 3 μαρκαδόροι προς 1,20€ = 8,40 + 3,60 = 12,00€. Πληρωμή με 20€ -> 8,00€
      const book = 8.4;
      const markers = 3;
      const pMarker = 1.2;
      const paid = 20;
      const costTotal = book + markers * pMarker;
      const change = Number((paid - costTotal).toFixed(2));
      const changeStr = change.toFixed(2).replace('.', ',');
      const correctText = `${changeStr} €`;
      return {
        prompt: `Η Μαρία αγόρασε ένα λεξικό προς 8,40€ και 3 μαρκαδόρους υπογράμμισης προς 1,20€ τον καθένα. Πλήρωσε με χαρτονόμισμα των ${paid}€. Πόσα ρέστα πήρε;`,
        correctText,
        tableData: [
          { item: 'Λεξικό', formula: '8,40 €', val: '8,40 €' },
          { item: 'Μαρκαδόροι', formula: '3 · 1,20 €', val: '3,60 €' },
          { item: 'Σύνολο', formula: '8,40 ＋ 3,60 €', val: '12,00 €' },
          { item: 'Ρέστα', formula: '20,00 － 12,00 €', val: `${changeStr} €` }
        ],
        explain: `Μαρκαδόροι: 3 · 1,20 ＝ 3,60 €. Σύνολο: 8,40 ＋ 3,60 ＝ 12,00 €. Ρέστα: 20,00 － 12,00 ＝ ${changeStr} €.`,
        distractors: ['10,00 €', '6,00 €', '12,00 €']
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'hp1',
    title: 'Υπολογισμός Τόκου & Τελικού Κεφαλαίου για 3 Έτη',
    unit: '€',
    generate: () => {
      // Κ = 2.400€, Ε = 2,5%, χ = 3 έτη -> Τ = 180€, Τελικό = 2.580€
      const cap = 2400;
      const r = 2.5;
      const y = 3;
      const interest = (cap * r * y) / 100;
      const totalAmount = cap + interest;
      const correctText = `${totalAmount} € (τόκος: ${interest} €)`;
      return {
        prompt: `Ο κύριος Ανδρέας κατέθεσε στην τράπεζα κεφάλαιο ${cap}€ με ετήσιο επιτόκιο ${r.toString().replace('.', ',')}% για ${y} έτη. Ποιο είναι το συνολικό ποσό που θα έχει στον λογαριασμό του στο τέλος της τριετίας;`,
        correctText,
        tableData: [
          { item: 'Αρχικό Κεφάλαιο (Κ)', formula: `${cap} €`, val: `${cap} €` },
          { item: 'Τύπος Τόκου', formula: `(${cap} · ${r} · ${y}) : 100`, val: `${interest} €` },
          { item: 'Τελικό Ποσό', formula: `${cap} ＋ ${interest} €`, val: `${totalAmount} €` }
        ],
        explain: `Τόκος: Τ ＝ (Κ · Ε · χ) : 100 ＝ (${cap} · ${r} · ${y}) : 100 ＝ 18.000 : 100 ＝ ${interest} €. Τελικό ποσό: ${cap} ＋ ${interest} ＝ ${totalAmount} €.`,
        distractors: [
          `${cap + interest * 2} € (τόκος: ${interest * 2} €)`,
          `${totalAmount + 100} € (τόκος: ${interest + 100} €)`,
          `${cap + 60} € (τόκος: 60 €)`
        ]
      };
    }
  },
  {
    id: 'hp2',
    title: 'Υπολογισμός Τόκου για 2 Έτη',
    unit: '€',
    generate: () => {
      // Κ = 3.000€, Ε = 3%, χ = 2 έτη -> Τ = 180€, Τελικό = 3.180€
      const cap = 3000;
      const r = 3;
      const y = 2;
      const interest = (cap * r * y) / 100;
      const totalAmount = cap + interest;
      const correctText = `${totalAmount} €`;
      return {
        prompt: `Μια αποταμιεύτρια κατέθεσε ${cap}€ για ${y} χρόνια με ετήσιο επιτόκιο ${r}%. Πόσα χρήματα θα έχει συνολικά (κεφάλαιο ＋ τόκος) μετά από ${y} χρόνια;`,
        correctText,
        tableData: [
          { item: 'Κεφάλαιο (Κ)', formula: `${cap} €`, val: `${cap} €` },
          { item: 'Υπολογισμός τόκου', formula: `(${cap} · ${r} · ${y}) : 100`, val: `${interest} €` },
          { item: 'Τελικό ποσό', formula: `${cap} ＋ ${interest} €`, val: `${totalAmount} €` }
        ],
        explain: `Τόκος: Τ ＝ (${cap} · ${r} · ${y}) : 100 ＝ ${cap * r * y} : 100 ＝ ${interest} €. Τελικό ποσό: ${cap} ＋ ${interest} ＝ ${totalAmount} €.`,
        distractors: [
          `${cap + 90} €`,
          `${totalAmount + 100} €`,
          `${cap + interest * 2} €`
        ]
      };
    }
  },
  {
    id: 'hp3',
    title: 'Εύρεση Ετήσιου Επιτοκίου',
    unit: '%',
    generate: () => {
      // Κ = 2.000€, Τ = 80€ σε 1 έτος -> Ε = 4%
      const cap = 2000;
      const interest = 80;
      const rateVal = (interest * 100) / cap; // 4%
      const correctText = `${rateVal}%`;
      return {
        prompt: `Ένα κεφάλαιο ${cap}€ απέδωσε σε 1 έτος τόκο ${interest}€. Ποιο ήταν το ετήσιο επιτόκιο της τράπεζας;`,
        correctText,
        tableData: [
          { item: 'Κεφάλαιο (Κ)', formula: `${cap} €`, val: `${cap} €` },
          { item: 'Τόκος 1 έτους', formula: `${interest} €`, val: `${interest} €` },
          { item: 'Επιτόκιο (Ε%)', formula: `(${interest} · 100) : ${cap}`, val: `${rateVal}%` }
        ],
        explain: `Επιτόκιο είναι ο τόκος για κάθε 100€: (${interest} : ${cap}) · 100 ＝ 0,04 · 100 ＝ ${rateVal}%.`,
        distractors: ['3%', '5%', '2,5%']
      };
    }
  },
  {
    id: 'hp4',
    title: 'Αγορά με Δόσεις και Επιβάρυνση',
    unit: '€',
    generate: () => {
      // Τηλεόραση αξίας 400€. Αγορά με 10 δόσεις των 44€ -> Σύνολο 440€, Επιβάρυνση 40€
      const cash = 400;
      const installments = 10;
      const perInstallment = 44;
      const totalCredit = installments * perInstallment;
      const diff = totalCredit - cash;
      const correctText = `${diff} € επιπλέον`;
      return {
        prompt: `Μια ηλεκτρική συσκευή κοστίζει ${cash}€ μετρητοίς. Μπορεί να αποκτηθεί και με ${installments} μηνιαίες δόσεις των ${perInstallment}€ η καθεμία. Πόσα ευρώ επιπλέον πληρώνει όποιος επιλέξει τις δόσεις;`,
        correctText,
        tableData: [
          { item: 'Τιμή μετρητοίς', formula: `${cash} €`, val: `${cash} €` },
          { item: 'Πληρωμή με δόσεις', formula: `${installments} · ${perInstallment} €`, val: `${totalCredit} €` },
          { item: 'Επιπλέον επιβάρυνση', formula: `${totalCredit} － ${cash} €`, val: `${diff} €` }
        ],
        explain: `Συνολικό ποσό δόσεων: ${installments} · ${perInstallment} ＝ ${totalCredit} €. Επιπλέον επιβάρυνση: ${totalCredit} － ${cash} ＝ ${diff} €.`,
        distractors: ['30 € επιπλέον', '50 € επιπλέον', '44 € επιπλέον']
      };
    }
  },
  {
    id: 'hp5',
    title: 'Εύρεση Αρχικού Κεφαλαίου',
    unit: '€',
    generate: () => {
      // Επιτόκιο 4%, χρόνος 1 έτος, Τόκος 120€ -> Κ = 120 * 100 / 4 = 3.000€
      const r = 4;
      const interest = 120;
      const cap = (interest * 100) / r; // 3000
      const correctText = `${cap} €`;
      return {
        prompt: `Ένας καταθέτης εισέπραξε σε 1 έτος τόκο ${interest}€ με ετήσιο επιτόκιο ${r}%. Ποιο ήταν το αρχικό κεφάλαιο που είχε καταθέσει;`,
        correctText,
        tableData: [
          { item: 'Τόκος (Τ)', formula: `${interest} €`, val: `${interest} €` },
          { item: 'Επιτόκιο (Ε%)', formula: `${r}%`, val: '4€ τόκος ανά 100€' },
          { item: 'Αρχικό Κεφάλαιο (Κ)', formula: `(${interest} · 100) : ${r}`, val: `${cap} €` }
        ],
        explain: `Αν τα 100€ δίνουν 4€ τόκο, τότε το κεφάλαιο είναι: (${interest} · 100) : ${r} ＝ 12.000 : 4 ＝ ${cap} €.`,
        distractors: ['2.500 €', '3.500 €', '4.000 €']
      };
    }
  },
  {
    id: 'hp6',
    title: 'Σύνθετη Κατανομή Χρημάτων',
    unit: '€',
    generate: () => {
      // 3 φίλοι μοιράζονται έξοδα 84,60€ ισόποσα -> 28,20€ ο καθένας
      const friends = 3;
      const total = 84.6;
      const perFriend = Number((total / friends).toFixed(2));
      const perFriendStr = perFriend.toFixed(2).replace('.', ',');
      const correctText = `${perFriendStr} €`;
      return {
        prompt: `Τρεις φίλοι πλήρωσαν συνολικά σε ένα εστιατόριο ${total.toFixed(2).replace('.', ',')}€ και μοιράστηκαν τον λογαριασμό εξίσου. Πόσα ευρώ πλήρωσε ο καθένας;`,
        correctText,
        tableData: [
          { item: 'Συνολικός λογαριασμός', formula: `${total.toFixed(2).replace('.', ',')} €`, val: `${total.toFixed(2).replace('.', ',')} €` },
          { item: 'Άτομα', formula: `${friends}`, val: `${friends}` },
          { item: 'Μερίδιο ανά άτομο', formula: `${total.toFixed(2).replace('.', ',')} : ${friends}`, val: `${perFriendStr} €` }
        ],
        explain: `Διαιρούμε το συνολικό ποσό με το 3: ${total.toFixed(2).replace('.', ',')} : 3 ＝ ${perFriendStr} € ανά άτομο.`,
        distractors: [
          `${(perFriend + 1).toFixed(2).replace('.', ',')} €`,
          `${(perFriend - 0.5).toFixed(2).replace('.', ',')} €`,
          '27,50 €'
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Ευρώ σε λεπτά (π.χ. 4,75 € -> 475)
  const q1E = randInt(2, 8);
  const q1C = [25, 50, 75, 80, 5, 90][randInt(0, 5)];
  const q1EuroStr = `${q1E},${q1C < 10 ? '0' + q1C : q1C}`;
  const q1Res = q1E * 100 + q1C;

  // Q2: Input - Λεπτά σε δεκαδικά ευρώ (π.χ. 620 λεπτά -> 6,20 ή 6,2)
  const q2Cents = randInt(250, 850);
  const q2Euro = (q2Cents / 100).toFixed(2).replace('.', ',');
  const q2Alt = (q2Cents / 100).toFixed(2).replace(/0$/, '').replace('.', ',');

  // Q3: Input - Υπολογισμός ρέστων (π.χ. Πληρωμή 10€, κόστος 6,40€ -> Ρέστα 3,60€)
  const q3Paid = 10;
  const q3CostE = randInt(4, 7);
  const q3CostC = [20, 30, 40, 50, 60, 70, 80][randInt(0, 6)];
  const q3Cost = q3CostE + q3CostC / 100;
  const q3Change = Number((q3Paid - q3Cost).toFixed(2));
  const q3ChangeStr = q3Change.toFixed(2).replace('.', ',');

  // Q4: MCQ - Τύπος του τόκου
  const q4Options = shuffle([...new Set([
    'Τ ＝ (Κ · Ε · χ) : 100',
    'Τ ＝ (Κ ＋ Ε ＋ χ) : 100',
    'Τ ＝ (Κ · Ε) : χ',
    'Τ ＝ (Κ · 100) : Ε'
  ])]);

  // Q5: True/False - Δεκαδική έκφραση ευρώ και λεπτών (π.χ. 2,05 € = 2 € και 5 λεπτά)
  const q5IsTrue = Math.random() > 0.5;
  const q5Text = q5IsTrue
    ? 'Το ποσό 2,05 € σημαίνει 2 ευρώ και 5 λεπτά (και όχι 50 λεπτά).'
    : 'Το ποσό 2,05 € σημαίνει 2 ευρώ και 50 λεπτά.';

  // Q6: True/False - Ορισμός επιτοκίου
  const q6IsTrue = Math.random() > 0.5;
  const q6Text = q6IsTrue
    ? 'Επιτόκιο είναι ο τόκος που δίνουν 100 € για χρονικό διάστημα 1 έτους.'
    : 'Επιτόκιο είναι το συνολικό ποσό που καταθέτουμε στην τράπεζα.';

  // Q7: Input - Υπολογισμός τόκου για 1 έτος (π.χ. Κ = 1.000€, Ε = 3% -> 30)
  const q7Cap = [500, 1000, 1500, 2000, 3000][randInt(0, 4)];
  const q7Rate = randInt(2, 5);
  const q7Interest = (q7Cap * q7Rate) / 100;

  // Q8: MCQ - Τελικό ποσό κατάθεσης (Κεφάλαιο + Τόκος)
  const q8Cap = 1000;
  const q8Rate = 4;
  const q8Int = (q8Cap * q8Rate) / 100; // 40€
  const q8Total = q8Cap + q8Int; // 1040€
  const q8Options = shuffle([...new Set([
    `${q8Total} €`,
    `${q8Cap - q8Int} €`,
    `${q8Total + 40} €`,
    `${q8Cap + 4} €`
  ])]);

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
      title: 'Ευρώ σε Λεπτά',
      prompt: `Πόσα λεπτά είναι το χρηματικό ποσό των ${q1EuroStr} €;`,
      correct: String(q1Res),
      explain: `Πολλαπλασιάζουμε επί 100: ${q1EuroStr} · 100 ＝ ${q1Res} λεπτά.`
    },
    {
      id: 'q2',
      type: 'input',
      title: 'Λεπτά σε Δεκαδικά Ευρώ',
      prompt: `Γράψε το ποσό των ${q2Cents} λεπτών σε δεκαδική μορφή ευρώ (€):`,
      correct: q2Euro,
      altCorrect: q2Alt,
      explain: `Διαιρούμε με το 100: ${q2Cents} : 100 ＝ ${q2Euro} €.`
    },
    {
      id: 'q3',
      type: 'input',
      title: 'Υπολογισμός Ρέστων',
      prompt: `Αγοράσαμε εμπορεύματα αξίας ${q3Cost.toFixed(2).replace('.', ',')} € και πληρώσαμε με χαρτονόμισμα των ${q3Paid} €. Πόσα ρέστα θα πάρουμε (σε δεκαδική μορφή ευρώ);`,
      correct: q3ChangeStr,
      explain: `Αφαιρούμε την αξία από την πληρωμή: ${q3Paid},00 － ${q3Cost.toFixed(2).replace('.', ',')} ＝ ${q3ChangeStr} €.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Τύπος του Απλού Τόκου',
      prompt: 'Ποιος είναι ο σωστός μαθηματικός τύπος για τον υπολογισμό του τόκου;',
      options: q4Options,
      correct: 'Τ ＝ (Κ · Ε · χ) : 100',
      explain: 'Ο τόκος υπολογίζεται πολλαπλασιάζοντας το Κεφάλαιο επί το Επιτόκιο επί τα Έτη και διαιρώντας με το 100: Τ ＝ (Κ · Ε · χ) : 100.'
    },
    {
      id: 'q5',
      type: 'tf',
      title: 'Δεκαδικά Ευρώ και Λεπτά',
      text: q5Text,
      correct: q5IsTrue,
      explain: q5IsTrue
        ? 'Σωστά! Το ψηφίο μετά το μηδέν δηλώνει 5 λεπτά (0,05 € ＝ 5 λεπτά). Τα 50 λεπτά γράφονται 0,50 €.'
        : 'Λάθος! Το 2,05 € σημαίνει 2 ευρώ και 5 λεπτά. Τα 50 λεπτά γράφονται 2,50 €.'
    },
    {
      id: 'q6',
      type: 'tf',
      title: 'Έννοια Επιτοκίου',
      text: q6Text,
      correct: q6IsTrue,
      explain: q6IsTrue
        ? 'Σωστά! Επιτόκιο είναι ο ετήσιος τόκος που κερδίζουν 100 € κατατεθειμένα στην τράπεζα.'
        : 'Λάθος! Το αρχικό ποσό που καταθέτουμε ονομάζεται κεφάλαιο. Επιτόκιο είναι το ποσοστό κέρδους.'
    },
    {
      id: 'q7',
      type: 'input',
      title: 'Υπολογισμός Ετήσιου Τόκου',
      prompt: `Ένα κεφάλαιο ${q7Cap} € κατατίθεται στην τράπεζα με ετήσιο επιτόκιο ${q7Rate}%. Πόσο τόκο (σε €) θα αποδώσει σε 1 έτος;`,
      correct: String(q7Interest),
      explain: `Τ ＝ (${q7Cap} · ${q7Rate} · 1) : 100 ＝ ${q7Cap * q7Rate} : 100 ＝ ${q7Interest} €.`
    },
    {
      id: 'q8',
      type: 'mcq',
      title: 'Τελικό Ποσό Κατάθεσης',
      prompt: `Καταθέτουμε ${q8Cap} € με επιτόκιο ${q8Rate}% για 1 έτος (τόκος ${q8Int} €). Πόσα χρήματα θα έχουμε συνολικά στο τέλος του έτους;`,
      options: q8Options,
      correct: `${q8Total} €`,
      explain: `Τελικό Ποσό ＝ Κεφάλαιο ＋ Τόκος ＝ ${q8Cap} ＋ ${q8Int} ＝ ${q8Total} €.`
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

export default function XrimataExercisesPage() {
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
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase() : null;
      return cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt);
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
      title="Ασκήσεις: Το Ευρώ, Μετατροπές & Τόκος - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα χρήματα, τις μετατροπές ευρώ και λεπτών, τα ρέστα και τον τόκο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/62-xrimata"
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
                <span>ΚΕΦΑΛΑΙΟ 62 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Χρήματα, Μετατροπές &amp; Τόκος
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στις μετατροπές ευρώ και λεπτών, στους υπολογισμούς ρέστων και στον τραπεζικό τύπο του τόκου!
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
                          key={`input-${q.id}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="text"
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder="Γράψε την απάντηση..."
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

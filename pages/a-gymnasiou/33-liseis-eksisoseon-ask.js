import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Επαναχρησιμοποιήσιμο component για κλασματική γραφή με ασφαλή ανίχνευση προσήμου
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span className={`inline-flex items-center gap-0.5 align-middle mx-1 font-mono ${className}`}>
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span className="pb-0.5 px-1.5 border-b-2 w-full text-center" style={{ borderColor: 'currentColor' }}>
          {displayNum}
        </span>
        <span className="pt-0.5 px-1.5 w-full text-center">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

// Βοηθητική συνάρτηση για παραγωγή HTML κανονικού κλάσματος μέσα στα solution strings
const fracHtml = (num, den, isNeg = false) => {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;
  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return `<span class="inline-flex items-center gap-0.5 align-middle mx-1 font-mono">${
    hasMinus ? '<span class="font-bold">－</span>' : ''
  }<span class="inline-flex flex-col items-center justify-center leading-none text-center"><span class="pb-0.5 px-1.5 border-b-2 border-current w-full text-center">${displayNum}</span><span class="pt-0.5 px-1.5 w-full text-center">${displayDen}</span></span></span>`;
};

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
};

const makeUniqueOptions = (correct, wrongCandidates) => {
  const unique = new Set([correct]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  return shuffleArray(Array.from(unique));
};

// ========================================================
// ΔΕΞΑΜΕΝΗ 1: 20 ΑΣΚΗΣΕΙΣ ΕΠΙΛΥΣΗΣ ΕΞΙΣΩΣΕΩΝ ΜΟΡΦΗΣ αx + β = γ
// ========================================================
const CALCULATION_GENERATORS = [
  // 1. Βασική επίλυση ax + b = c (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΕΠΙΛΥΣΗ αx ＋ β ＝ γ',
      question: `Λύσε την εξίσωση: <strong>3 · x ＋ 5 ＝ 26</strong>`,
      correctAnswer: '7',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 3 · x ＋ 5 ＝ 26
          </div>
          <div>1. Μεταφορά όρου στο 2ο μέλος: 3 · x ＝ 26 － 5 ➔ 3 · x ＝ 21.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(21, 3)} ＝ 7.
          </div>
        </div>
      `,
    };
  },

  // 2. Εξίσωση με αφαίρεση ax - b = c (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΕΠΙΛΥΣΗ αx － β ＝ γ',
      question: `Λύσε την εξίσωση: <strong>4 · x － 7 ＝ 17</strong>`,
      correctAnswer: '6',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 4 · x － 7 ＝ 17
          </div>
          <div>1. Μεταφορά όρου στο 2ο μέλος: 4 · x ＝ 17 ＋ 7 ➔ 4 · x ＝ 24.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(24, 4)} ＝ 6.
          </div>
        </div>
      `,
    };
  },

  // 3. Εξίσωση με αρνητικό συντελεστή -ax + b = c (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ',
      question: `Λύσε την εξίσωση: <strong>－2 · x ＋ 9 ＝ 1</strong>`,
      correctAnswer: '4',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: －2 · x ＋ 9 ＝ 1
          </div>
          <div>1. Μεταφορά όρου στο 2ο μέλος: －2 · x ＝ 1 － 9 ➔ －2 · x ＝ －8.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το －2 σε μορφή κλάσματος: x ＝ ${fracHtml(8, 2)} ＝ 4.
          </div>
        </div>
      `,
    };
  },

  // 4. Εξίσωση με παρένθεση (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΠΑΡΕΝΘΕΣΗ & ΕΠΙΜΕΡΙΣΤΙΚΗ',
      question: `Λύσε την εξίσωση: <strong>2 · (x ＋ 4) ＝ 18</strong>`,
      correctAnswer: '5',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 2 · (x ＋ 4) ＝ 18
          </div>
          <div>1. Απαλοιφή παρένθεσης με επιμεριστική: 2 · x ＋ 8 ＝ 18.</div>
          <div>2. Μεταφορά όρου: 2 · x ＝ 18 － 8 ➔ 2 · x ＝ 10.</div>
          <div class="flex items-center flex-wrap pt-1">
            3. Διαίρεση με το 2 σε μορφή κλάσματος: x ＝ ${fracHtml(10, 2)} ＝ 5.
          </div>
        </div>
      `,
    };
  },

  // 5. Εξίσωση με απλό κλάσμα (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΕΞΙΣΩΣΗ ΜΕ ΚΛΑΣΜΑ',
      question: `Λύσε την εξίσωση: <span class="inline-flex items-center">${fracHtml('x', 3)} <strong>＋ 2 ＝ 6</strong></span>`,
      correctAnswer: '12',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono flex items-center flex-wrap">
            <span>Αρχική εξίσωση:&nbsp;</span>${fracHtml('x', 3)}<span>&nbsp;＋ 2 ＝ 6</span>
          </div>
          <div class="flex items-center flex-wrap">
            1. Μεταφορά σταθερού όρου: ${fracHtml('x', 3)} ＝ 6 － 2 ➔ ${fracHtml('x', 3)} ＝ 4.
          </div>
          <div>2. Πολλαπλασιάζουμε με τον παρονομαστή 3: x ＝ 4 · 3 ＝ 12.</div>
        </div>
      `,
    };
  },

  // 6. Εξίσωση με x και στα δύο μέλη (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΧΩΡΙΣΜΟΣ ΟΡΩΝ',
      question: `Λύσε την εξίσωση: <strong>5 · x － 3 ＝ 2 · x ＋ 9</strong>`,
      correctAnswer: '4',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 5 · x － 3 ＝ 2 · x ＋ 9
          </div>
          <div>1. Χωρίζουμε γνωστούς από αγνώστους: 5 · x － 2 · x ＝ 9 ＋ 3.</div>
          <div>2. Αναγωγή ομοίων όρων: 3 · x ＝ 12.</div>
          <div class="flex items-center flex-wrap pt-1">
            3. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(12, 3)} ＝ 4.
          </div>
        </div>
      `,
    };
  },

  // 7. Εξίσωση με άθροισμα κλασμάτων (Input)
  () => {
    return {
      type: 'input',
      topic: 'Ε.Κ.Π. ΠΑΡΟΝΟΜΑΣΤΩΝ',
      question: `Λύσε την εξίσωση: <span class="inline-flex items-center">${fracHtml('x', 2)} ＋ ${fracHtml('x', 4)} ＝ 6</span>`,
      correctAnswer: '8',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono flex items-center flex-wrap">
            <span>Αρχική εξίσωση:&nbsp;</span>${fracHtml('x', 2)}<span>&nbsp;＋&nbsp;</span>${fracHtml('x', 4)}<span>&nbsp;＝ 6</span>
          </div>
          <div class="flex items-center flex-wrap">
            1. Το Ε.Κ.Π.(2, 4) είναι το 4. Πολλαπλασιάζουμε κάθε όρο με το 4: 4 · (${fracHtml('x', 2)}) ＋ 4 · (${fracHtml('x', 4)}) ＝ 4 · 6.
          </div>
          <div>2. Απλοποίηση των παρονομαστών: 2 · x ＋ x ＝ 24 ➔ 3 · x ＝ 24.</div>
          <div class="flex items-center flex-wrap pt-1">
            3. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(24, 3)} ＝ 8.
          </div>
        </div>
      `,
    };
  },

  // 8. Αδύνατη εξίσωση (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΕΙΔΙΚΕΣ ΠΕΡΙΠΤΩΣΕΙΣ',
      question: `Ποια είναι η λύση της εξίσωσης: <strong>3 · (x ＋ 1) ＝ 3 · x ＋ 7</strong>;`,
      options: makeUniqueOptions(
        'Είναι αδύνατη (δεν έχει καμία λύση)',
        [
          'x ＝ 0',
          'Είναι ταυτότητα (άπειρες λύσεις)',
          'x ＝ 4'
        ]
      ),
      correctAnswer: 'Είναι αδύνατη (δεν έχει καμία λύση)',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 3 · (x ＋ 1) ＝ 3 · x ＋ 7
          </div>
          <div>1. Ανοίγουμε την παρένθεση: 3 · x ＋ 3 ＝ 3 · x ＋ 7.</div>
          <div>2. Χωρίζουμε γνωστούς από αγνώστους: 3 · x － 3 · x ＝ 7 － 3 ➔ 0 · x ＝ 4.</div>
          <div>3. Συμπέρασμα: Κανένας αριθμός x πολλαπλασιαζόμενος με το 0 δεν δίνει 4. Η εξίσωση είναι <strong>αδύνατη</strong>.</div>
        </div>
      `,
    };
  },

  // 9. Ταυτότητα / Αόριστη εξίσωση (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'ΕΙΔΙΚΕΣ ΠΕΡΙΠΤΩΣΕΙΣ',
      question: `Ποια είναι η λύση της εξίσωσης: <strong>2 · (x ＋ 3) ＝ 2 · x ＋ 6</strong>;`,
      options: makeUniqueOptions(
        'Είναι ταυτότητα (επαληθεύεται για κάθε αριθμό x)',
        [
          'Είναι αδύνατη (καμία λύση)',
          'x ＝ 0',
          'x ＝ 6'
        ]
      ),
      correctAnswer: 'Είναι ταυτότητα (επαληθεύεται για κάθε αριθμό x)',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 2 · (x ＋ 3) ＝ 2 · x ＋ 6
          </div>
          <div>1. Ανοίγουμε την παρένθεση: 2 · x ＋ 6 ＝ 2 · x ＋ 6.</div>
          <div>2. Χωρίζουμε γνωστούς από αγνώστους: 2 · x － 2 · x ＝ 6 － 6 ➔ 0 · x ＝ 0.</div>
          <div>3. Συμπέρασμα: Η ισότητα 0 · x ＝ 0 ισχύει για οποιονδήποτε αριθμό x. Η εξίσωση είναι <strong>ταυτότητα (αόριστη)</strong>.</div>
        </div>
      `,
    };
  },

  // 10. Εξίσωση με αρνητικό αποτέλεσμα (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΑΡΝΗΤΙΚΗ ΡΙΖΑ',
      question: `Λύσε την εξίσωση: <strong>6 · x ＋ 25 ＝ 7</strong>`,
      correctAnswer: '-3',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 6 · x ＋ 25 ＝ 7
          </div>
          <div>1. Μεταφορά όρου στο 2ο μέλος: 6 · x ＝ 7 － 25 ➔ 6 · x ＝ －18.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 6 σε μορφή κλάσματος: x ＝ ${fracHtml(18, 6, true)} ＝ －3.
          </div>
        </div>
      `,
    };
  },

  // 11. Εξίσωση με μείον μπροστά από παρένθεση (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΠΑΡΕΝΘΕΣΗ ΜΕ ΜΕΙΟΝ',
      question: `Λύσε την εξίσωση: <strong>5 · x － (2 · x － 3) ＝ 15</strong>`,
      correctAnswer: '4',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 5 · x － (2 · x － 3) ＝ 15
          </div>
          <div>1. Απαλοιφή παρένθεσης αλλάζοντας τα πρόσημα: 5 · x － 2 · x ＋ 3 ＝ 15.</div>
          <div>2. Αναγωγή ομοίων και μεταφορά: 3 · x ＝ 15 － 3 ➔ 3 · x ＝ 12.</div>
          <div class="flex items-center flex-wrap pt-1">
            3. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(12, 3)} ＝ 4.
          </div>
        </div>
      `,
    };
  },

  // 12. Εξίσωση με μηδενικό δεύτερο μέλος (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΜΗΔΕΝΙΚΟ 2Ο ΜΕΛΟΣ',
      question: `Λύσε την εξίσωση: <strong>8 · x － 24 ＝ 0</strong>`,
      correctAnswer: '3',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 8 · x － 24 ＝ 0
          </div>
          <div>1. Μεταφορά σταθερού όρου στο 2ο μέλος: 8 · x ＝ 24.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 8 σε μορφή κλάσματος: x ＝ ${fracHtml(24, 8)} ＝ 3.
          </div>
        </div>
      `,
    };
  },

  // 13. Εξίσωση με κλάσμα που έχει σύνθετο αριθμητή (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΚΛΑΣΜΑ ΜΕ ΣΥΝΘΕΤΟ ΑΡΙΘΜΗΤΗ',
      question: `Λύσε την εξίσωση: <span class="inline-flex items-center">${fracHtml('x ＋ 1', 2)} ＝ 4</span>`,
      correctAnswer: '7',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono flex items-center flex-wrap">
            <span>Αρχική εξίσωση:&nbsp;</span>${fracHtml('x ＋ 1', 2)}<span>&nbsp;＝ 4</span>
          </div>
          <div>1. Πολλαπλασιάζουμε με τον παρονομαστή 2: x ＋ 1 ＝ 4 · 2 ➔ x ＋ 1 ＝ 8.</div>
          <div>2. Μεταφορά σταθερού όρου: x ＝ 8 － 1 ＝ 7.</div>
        </div>
      `,
    };
  },

  // 14. Εξίσωση 7x = 0 (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΜΗΔΕΝΙΚΗ ΡΙΖΑ',
      question: `Ποια είναι η λύση της εξίσωσης <strong>7 · x ＝ 0</strong>;`,
      correctAnswer: '0',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 7 · x ＝ 0
          </div>
          <div class="flex items-center flex-wrap">
            Διαιρούμε με το 7 σε μορφή κλάσματος: x ＝ ${fracHtml(0, 7)} ＝ 0.
          </div>
        </div>
      `,
    };
  },

  // 15. Δύο παρενθέσεις (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΣΥΝΘΕΤΕΣ ΠΑΡΕΝΘΕΣΕΙΣ',
      question: `Λύσε την εξίσωση: <strong>3 · (x － 1) ＋ 2 · (x ＋ 2) ＝ 16</strong>`,
      correctAnswer: '3',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 3 · (x － 1) ＋ 2 · (x ＋ 2) ＝ 16
          </div>
          <div>1. Επιμεριστικές ιδιότητες: 3 · x － 3 ＋ 2 · x ＋ 4 ＝ 16.</div>
          <div>2. Αναγωγή ομοίων και μεταφορά: 5 · x ＋ 1 ＝ 16 ➔ 5 · x ＝ 15.</div>
          <div class="flex items-center flex-wrap pt-1">
            3. Διαίρεση με το 5 σε μορφή κλάσματος: x ＝ ${fracHtml(15, 5)} ＝ 3.
          </div>
        </div>
      `,
    };
  },

  // 16. Εξίσωση με δεκαδικό συντελεστή (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΔΕΚΑΔΙΚΟΣ ΣΥΝΤΕΛΕΣΤΗΣ',
      question: `Λύσε την εξίσωση: <strong>0,5 · x ＋ 3 ＝ 7</strong>`,
      correctAnswer: '8',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 0,5 · x ＋ 3 ＝ 7
          </div>
          <div>1. Μεταφορά όρου στο 2ο μέλος: 0,5 · x ＝ 7 － 3 ➔ 0,5 · x ＝ 4.</div>
          <div>2. Διαίρεση: x ＝ 4 ： 0,5 ＝ 8 (αφού 0,5 ＝ 1/2).</div>
        </div>
      `,
    };
  },

  // 17. Εξίσωση με αρνητικό x μόνο του (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΑΠΛΟ ΑΡΝΗΤΙΚΟ x',
      question: `Λύσε την εξίσωση: <strong>－x ＋ 6 ＝ 1</strong>`,
      correctAnswer: '5',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: －x ＋ 6 ＝ 1
          </div>
          <div>1. Μεταφορά όρου: －x ＝ 1 － 6 ➔ －x ＝ －5.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαιρούμε με το －1: x ＝ ${fracHtml(5, 1)} ＝ 5.
          </div>
        </div>
      `,
    };
  },

  // 18. Εξίσωση: 2x - 5 = x + 3 (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΧΩΡΙΣΜΟΣ ΟΡΩΝ',
      question: `Λύσε την εξίσωση: <strong>2 · x － 5 ＝ x ＋ 3</strong>`,
      correctAnswer: '8',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 2 · x － 5 ＝ x ＋ 3
          </div>
          <div>1. Χωρίζουμε γνωστούς από αγνώστους: 2 · x － x ＝ 3 ＋ 5.</div>
          <div>2. Αναγωγή ομοίων όρων: x ＝ 8.</div>
        </div>
      `,
    };
  },

  // 19. Εξίσωση με κλάσματα και στα δύο μέλη (Input)
  () => {
    return {
      type: 'input',
      topic: 'Ε.Κ.Π. ΣΤΑ ΔΥΟ ΜΕΛΗ',
      question: `Λύσε την εξίσωση: <span class="inline-flex items-center">${fracHtml('x', 2)} ＝ ${fracHtml('x', 3)} ＋ 2</span>`,
      correctAnswer: '12',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono flex items-center flex-wrap">
            <span>Αρχική εξίσωση:&nbsp;</span>${fracHtml('x', 2)}<span>&nbsp;＝&nbsp;</span>${fracHtml('x', 3)}<span>&nbsp;＋ 2</span>
          </div>
          <div class="flex items-center flex-wrap">
            1. Το Ε.Κ.Π.(2, 3) ＝ 6. Πολλαπλασιάζουμε κάθε όρο με το 6: 6 · (${fracHtml('x', 2)}) ＝ 6 · (${fracHtml('x', 3)}) ＋ 6 · 2.
          </div>
          <div>2. Απλοποίηση: 3 · x ＝ 2 · x ＋ 12 ➔ 3 · x － 2 · x ＝ 12 ➔ x ＝ 12.</div>
        </div>
      `,
    };
  },

  // 20. Εξίσωση: 9x - 12 = 3x + 24 (Input)
  () => {
    return {
      type: 'input',
      topic: 'ΠΛΗΡΗΣ ΕΠΙΛΥΣΗ',
      question: `Λύσε την εξίσωση: <strong>9 · x － 12 ＝ 3 · x ＋ 24</strong>`,
      correctAnswer: '6',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 9 · x － 12 ＝ 3 · x ＋ 24
          </div>
          <div>1. Χωρίζουμε γνωστούς από αγνώστους: 9 · x － 3 · x ＝ 24 ＋ 12.</div>
          <div>2. Αναγωγή ομοίων όρων: 6 · x ＝ 36.</div>
          <div class="flex items-center flex-wrap pt-1">
            3. Διαίρεση με το 6 σε μορφή κλάσματος: x ＝ ${fracHtml(36, 6)} ＝ 6.
          </div>
        </div>
      `,
    };
  },
];

// ========================================================
// ΔΕΞΑΜΕΝΗ 2: 20 ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (ΧΩΡΙΣ ΕΤΟΙΜΟΥΣ ΤΥΠΟΥΣ)
// ========================================================
const WORD_PROBLEM_GENERATORS = [
  // 1. Προπόνηση τένις
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΘΛΗΤΙΣΜΟΣ',
      question: `Η ενοικίαση γηπέδου τένις κοστίζει 12 € πάγια χρέωση συντήρησης και 8 € για κάθε ώρα παιχνιδιού. Ένας αθλητής πλήρωσε συνολικά 36 €. Πόσες ώρες έπαιξε;`,
      correctAnswer: '3',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 8 · x ＋ 12 ＝ 36 (όπου x οι ώρες)
          </div>
          <div>1. Μεταφορά όρου: 8 · x ＝ 36 － 12 ➔ 8 · x ＝ 24.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 8 σε μορφή κλάσματος: x ＝ ${fracHtml(24, 8)} ＝ 3 ώρες.
          </div>
        </div>
      `,
    };
  },

  // 2. Ηλικία μητέρας και κόρης
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΗΛΙΚΙΕΣ',
      question: `Μια μητέρα είναι 24 χρόνια μεγαλύτερη από την κόρη της. Αν το άθροισμα των ηλικιών τους είναι 38 χρόνια, πόσων ετών είναι η κόρη;`,
      correctAnswer: '7',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: x ＋ (x ＋ 24) ＝ 38 (όπου x η ηλικία της κόρης)
          </div>
          <div>1. Αναγωγή και μεταφορά: 2 · x ＋ 24 ＝ 38 ➔ 2 · x ＝ 14.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 2 σε μορφή κλάσματος: x ＝ ${fracHtml(14, 2)} ＝ 7 ετών.
          </div>
        </div>
      `,
    };
  },

  // 3. Περίμετρος ορθογωνίου κήπου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένας ορθογώνιος κήπος έχει μήκος κατά 6 μέτρα μεγαλύτερο από το πλάτος του. Αν η περίμετρος του κήπου είναι 44 μέτρα, ποιο είναι το πλάτος του σε μέτρα;`,
      correctAnswer: '8',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 2 · x ＋ 2 · (x ＋ 6) ＝ 44 (όπου x το πλάτος)
          </div>
          <div>1. Επιμεριστική και αναγωγή: 2 · x ＋ 2 · x ＋ 12 ＝ 44 ➔ 4 · x ＝ 32.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(32, 4)} ＝ 8 μέτρα.
          </div>
        </div>
      `,
    };
  },

  // 4. Αγορά ηλεκτρονικών ειδών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΟΡΕΣ',
      question: `Ο Αλέξης αγόρασε 3 ίδια flash drives και μια θήκη που κόστιζε 5 €. Πλήρωσε συνολικά 32 €. Πόσα ευρώ κόστισε το κάθε flash drive;`,
      correctAnswer: '9',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 3 · x ＋ 5 ＝ 32 (όπου x η τιμή του flash drive)
          </div>
          <div>1. Μεταφορά όρου: 3 · x ＝ 32 － 5 ➔ 3 · x ＝ 27.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(27, 3)} ＝ 9 €.
          </div>
        </div>
      `,
    };
  },

  // 5. Αποταμίευση για εκδρομή
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΟΙΚΟΝΟΜΙΚΑ',
      question: `Η Σοφία έχει 45 € και αποταμιεύει 15 € κάθε εβδομάδα. Σε πόσες εβδομάδες θα έχει συγκεντρώσει 120 €;`,
      correctAnswer: '5',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 15 · x ＋ 45 ＝ 120 (όπου x οι εβδομάδες)
          </div>
          <div>1. Μεταφορά όρου: 15 · x ＝ 120 － 45 ➔ 15 · x ＝ 75.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 15 σε μορφή κλάσματος: x ＝ ${fracHtml(75, 15)} ＝ 5 εβδομάδες.
          </div>
        </div>
      `,
    };
  },

  // 6. Διανομή βιβλίων
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΤΑΜΕΡΙΣΜΟΣ',
      question: `Ένας βιβλιοπώλης παρέλαβε 65 βιβλία. Κράτησε 5 στη βιτρίνα και τα υπόλοιπα τα μοίρασε ισόποσα σε 4 ράφια. Πόσα βιβλία έβαλε σε κάθε ράφι;`,
      correctAnswer: '15',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 4 · x ＋ 5 ＝ 65 (όπου x τα βιβλία ανά ράφι)
          </div>
          <div>1. Μεταφορά όρου: 4 · x ＝ 65 － 5 ➔ 4 · x ＝ 60.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(60, 4)} ＝ 15 βιβλία.
          </div>
        </div>
      `,
    };
  },

  // 7. Πρόβλημα τριών διαδοχικών αριθμών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΡΙΘΜΟΙ',
      question: `Το άθροισμα τριών διαδοχικών ακεραίων αριθμών είναι 42. Ποιος είναι ο μικρότερος από τους τρεις αριθμούς;`,
      correctAnswer: '13',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: x ＋ (x ＋ 1) ＋ (x ＋ 2) ＝ 42 (όπου x ο μικρότερος)
          </div>
          <div>1. Αναγωγή ομοίων όρων: 3 · x ＋ 3 ＝ 42 ➔ 3 · x ＝ 39.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(39, 3)} ＝ 13.
          </div>
        </div>
      `,
    };
  },

  // 8. Ταξί με νυχτερινή ταρίφα
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΤΑΦΟΡΕΣ',
      question: `Ένα ταξί χρεώνει 4 € πάγια εκκίνηση και 2,50 € για κάθε χιλιόμετρο. Ένας επιβάτης πλήρωσε 29 €. Πόσα χιλιόμετρα ήταν η διαδρομή;`,
      correctAnswer: '10',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 2,5 · x ＋ 4 ＝ 29 (όπου x τα χιλιόμετρα)
          </div>
          <div>1. Μεταφορά όρου: 2,5 · x ＝ 29 － 4 ➔ 2,5 · x ＝ 25.</div>
          <div>2. Διαίρεση: x ＝ 25 ： 2,5 ＝ 10 km.</div>
        </div>
      `,
    };
  },

  // 9. Ισοσκελές τρίγωνο
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα ισοσκελές τρίγωνο έχει βάση 14 cm και περίμετρο 40 cm. Πόσα εκατοστά είναι καθεμία από τις δύο ίσες πλευρές του;`,
      correctAnswer: '13',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 2 · x ＋ 14 ＝ 40 (όπου x η κάθε ίση πλευρά)
          </div>
          <div>1. Μεταφορά όρου: 2 · x ＝ 40 － 14 ➔ 2 · x ＝ 26.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 2 σε μορφή κλάσματος: x ＝ ${fracHtml(26, 2)} ＝ 13 cm.
          </div>
        </div>
      `,
    };
  },

  // 10. Μηνιαίος λογαριασμός τηλεφώνου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΗΛΕΦΩΝΙΑ',
      question: `Ένα συμβόλαιο κινητού έχει πάγιο 15 € το μήνα και χρεώνει 0,20 € για κάθε επιπλέον μήνυμα SMS. Αν ο λογαριασμός ήταν 25 €, πόσα επιπλέον μηνύματα στάλθηκαν;`,
      correctAnswer: '50',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 0,20 · x ＋ 15 ＝ 25 (όπου x τα επιπλέον μηνύματα)
          </div>
          <div>1. Μεταφορά όρου: 0,20 · x ＝ 25 － 15 ➔ 0,20 · x ＝ 10.</div>
          <div>2. Διαίρεση: x ＝ 10 ： 0,20 ＝ 50 μηνύματα.</div>
        </div>
      `,
    };
  },

  // 11. Κατανάλωση καυσίμου
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΚΑΥΣΙΜΑ',
      question: `Μια δεξαμενή πετρελαίου περιέχει 150 λίτρα και ο καυστήρας καταναλώνει 6 λίτρα για κάθε ώρα λειτουργίας. Μετά από πόσες ώρες θα απομένουν 42 λίτρα;`,
      correctAnswer: '18',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 150 － 6 · x ＝ 42 (όπου x οι ώρες λειτουργίας)
          </div>
          <div>1. Μεταφορά όρων: －6 · x ＝ 42 － 150 ➔ －6 · x ＝ －108.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το －6 σε μορφή κλάσματος: x ＝ ${fracHtml(108, 6)} ＝ 18 ώρες.
          </div>
        </div>
      `,
    };
  },

  // 12. Αμοιβή baby sitting
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΡΓΑΣΙΑ',
      question: `Μια παιδαγωγός λαμβάνει 10 € πάγια έξοδα μετακίνησης συν 7 € για κάθε ώρα απασχόλησης. Αν πληρώθηκε συνολικά 45 €, πόσες ώρες εργάστηκε;`,
      correctAnswer: '5',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 7 · x ＋ 10 ＝ 45 (όπου x οι ώρες απασχόλησης)
          </div>
          <div>1. Μεταφορά όρου: 7 · x ＝ 45 － 10 ➔ 7 · x ＝ 35.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 7 σε μορφή κλάσματος: x ＝ ${fracHtml(35, 7)} ＝ 5 ώρες.
          </div>
        </div>
      `,
    };
  },

  // 13. Εισιτήρια λούνα παρκ
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΨΥΧΑΓΩΓΙΑ',
      question: `Σε ένα λούνα παρκ η είσοδος κοστίζει 5 € και κάθε παιχνίδι κοστίζει 3 €. Ο Κωστής ξόδεψε συνολικά 26 €. Σε πόσα παιχνίδια έπαιξε;`,
      correctAnswer: '7',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 3 · x ＋ 5 ＝ 26 (όπου x τα παιχνίδια)
          </div>
          <div>1. Μεταφορά όρου: 3 · x ＝ 26 － 5 ➔ 3 · x ＝ 21.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 3 σε μορφή κλάσματος: x ＝ ${fracHtml(21, 3)} ＝ 7 παιχνίδια.
          </div>
        </div>
      `,
    };
  },

  // 14. Συσκευασία πορτοκαλιών
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΓΡΟΤΙΚΑ',
      question: `Μαζεύτηκαν 92 κιλά πορτοκάλια. Κρατήθηκαν 8 κιλά και τα υπόλοιπα συσκευάστηκαν σε διχτάκια των 4 κιλών. Πόσα διχτάκια πορτοκάλια φτιάχτηκαν;`,
      correctAnswer: '21',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 4 · x ＋ 8 ＝ 92 (όπου x τα διχτάκια)
          </div>
          <div>1. Μεταφορά όρου: 4 · x ＝ 92 － 8 ➔ 4 · x ＝ 84.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(84, 4)} ＝ 21 διχτάκια.
          </div>
        </div>
      `,
    };
  },

  // 15. Φόρτιση μπαταρίας drone
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΤΕΧΝΟΛΟΓΙΑ',
      question: `Η μπαταρία ενός drone βρίσκεται στο 20% και φορτίζει με ρυθμό 5% ανά λεπτό. Σε πόσα λεπτά θα φορτιστεί πλήρως (100%);`,
      correctAnswer: '16',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 5 · x ＋ 20 ＝ 100 (όπου x τα λεπτά)
          </div>
          <div>1. Μεταφορά όρου: 5 · x ＝ 100 － 20 ➔ 5 · x ＝ 80.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 5 σε μορφή κλάσματος: x ＝ ${fracHtml(80, 5)} ＝ 16 λεπτά.
          </div>
        </div>
      `,
    };
  },

  // 16. Τετράδια και στυλό
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΟΛΙΚΑ',
      question: `Ο Δημήτρης αγόρασε 4 ίδια τετράδια και ένα μαρκαδόρο των 2 €. Έδωσε χαρτονόμισμα των 20 € και πήρε ρέστα 6 €. Πόσο κόστιζε το κάθε τετράδιο;`,
      correctAnswer: '3',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 4 · x ＋ 2 ＝ 14 (όπου x η τιμή του τετραδίου)
          </div>
          <div>1. Μεταφορά όρου: 4 · x ＝ 14 － 2 ➔ 4 · x ＝ 12.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(12, 4)} ＝ 3 €.
          </div>
        </div>
      `,
    };
  },

  // 17. Εμβαδόν ορθογωνίου με σταθερή διάσταση
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΓΕΩΜΕΤΡΙΑ',
      question: `Ένα ορθογώνιο έχει πλάτος 6 μέτρα και εμβαδόν 48 τ.μ. Πόσα μέτρα είναι το μήκος του;`,
      correctAnswer: '8',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 6 · x ＝ 48 (όπου x το μήκος σε μέτρα)
          </div>
          <div class="flex items-center flex-wrap">
            Διαίρεση με το 6 σε μορφή κλάσματος: x ＝ ${fracHtml(48, 6)} ＝ 8 μέτρα.
          </div>
        </div>
      `,
    };
  },

  // 18. Σχολική εκδρομή
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΣΧΟΛΕΙΟ',
      question: `Για μια εκδρομή το λεωφορείο κοστίζει πάγια 120 € και το εισιτήριο εισόδου 5 € ανά μαθητή. Αν το συνολικό κόστος ήταν 245 €, πόσοι μαθητές πήγαν;`,
      correctAnswer: '25',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 5 · x ＋ 120 ＝ 245 (όπου x οι μαθητές)
          </div>
          <div>1. Μεταφορά όρου: 5 · x ＝ 245 － 120 ➔ 5 · x ＝ 125.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 5 σε μορφή κλάσματος: x ＝ ${fracHtml(125, 5)} ＝ 25 μαθητές.
          </div>
        </div>
      `,
    };
  },

  // 19. Διπλάσιο και τριπλάσιο
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΑΡΙΘΜΟΙ',
      question: `Αν από το τετραπλάσιο ενός αριθμού αφαιρέσουμε 15, βρίσκουμε 25. Ποιος είναι αυτός ο αριθμός;`,
      correctAnswer: '10',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 4 · x － 15 ＝ 25 (όπου x ο αριθμός)
          </div>
          <div>1. Μεταφορά όρου: 4 · x ＝ 25 ＋ 15 ➔ 4 · x ＝ 40.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(40, 4)} ＝ 10.
          </div>
        </div>
      `,
    };
  },

  // 20. Αγορά πίτσας με delivery
  () => {
    return {
      type: 'input',
      topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΕΣΤΙΑΣΗ',
      question: `Μια παρέα παρήγγειλε 4 ίδιες πίτσες και πλήρωσε επιπλέον 3 € για τη διανομή. Αν ο συνολικός λογαριασμός ήταν 39 €, πόσα ευρώ κόστισε η κάθε πίτσα;`,
      correctAnswer: '9',
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Αρχική εξίσωση: 4 · x ＋ 3 ＝ 39 (όπου x η τιμή της πίτσας)
          </div>
          <div>1. Μεταφορά όρου: 4 · x ＝ 39 － 3 ➔ 4 · x ＝ 36.</div>
          <div class="flex items-center flex-wrap pt-1">
            2. Διαίρεση με το 4 σε μορφή κλάσματος: x ＝ ${fracHtml(36, 4)} ＝ 9 €.
          </div>
        </div>
      `,
    };
  },
];

export default function LiseisEksisoseonAsk() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuestions = () => {
    const shuffledCalcs = shuffleArray(CALCULATION_GENERATORS);
    const shuffledProblems = shuffleArray(WORD_PROBLEM_GENERATORS);

    const selectedCalcs = shuffledCalcs.slice(0, 10).map((gen, idx) => ({
      id: idx + 1,
      ...gen(),
    }));

    const selectedProblems = shuffledProblems.slice(0, 2).map((gen, idx) => ({
      id: 11 + idx,
      ...gen(),
    }));

    setQuestions([...selectedCalcs, ...selectedProblems]);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  const handleInputChange = (id, val) => {
    if (isSubmitted) return;
    let clean = val.replace('.', ',');
    clean = clean.replace(/[^0-9,/,\-x,X,*,+]/g, '');

    if (clean.length > 14) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      let userAns = (userAnswers[q.id] || '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/,/g, '.');

      let correctAns = q.correctAnswer
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/·/g, '*')
        .replace(/,/g, '.');

      userAns = userAns.replace(/^\+/, '');
      correctAns = correctAns.replace(/^\+/, '');

      if (userAns === correctAns) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && userAnswers[k].trim() !== ''
  ).length;

  const scorePercentage = Math.round((score / 12) * 100);

  return (
    <Layout
      title="Ασκήσεις: Επίλυση Εξισώσεων αx + β = γ | Α' Γυμνασίου"
      description="12 δυναμικές ασκήσεις και προβλήματα στην επίλυση εξισώσεων 1ου βαθμού με παρενθέσεις, κλάσματα και προβλήματα για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/33-liseis-eksisoseon"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
        >
          <span>📖</span>
          <span>ΘΕΩΡΙΑ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 pb-32 sm:pb-36 space-y-8">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ 29 • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Επίλυση Εξισώσεων α·x ＋ β ＝ γ
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις (10 ασκήσεις επίλυσης εξισώσεων με παρενθέσεις, κλάσματα και διερεύνηση + 2 ρεαλιστικά προβλήματα). Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις.
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const cleanUser = userAns
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/,/g, '.');

              const cleanCorrect = q.correctAnswer
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/·/g, '*')
                .replace(/,/g, '.');

              const isCorrect = isSubmitted && cleanUser === cleanCorrect;
              const isWordProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                    isWordProblem ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'
                  } ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold text-xs sm:text-sm ${
                            isWordProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {q.id}
                        </span>
                        {isWordProblem && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                            ΠΡΟΒΛΗΜΑ
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md">
                        {q.topic}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Input ή MCQ */}
                  <div className="space-y-2 pt-2">
                    {q.type === 'input' ? (
                      <div className="relative max-w-xs">
                        <input
                          type="text"
                          inputMode="text"
                          maxLength={14}
                          disabled={isSubmitted}
                          placeholder="π.χ. 7 ή -3"
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-base font-bold rounded-xl border transition-all outline-none font-mono ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                                : 'bg-rose-50 border-rose-500 text-rose-950'
                              : 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAns === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleMCQSelect(q.id, opt)}
                              className={`h-11 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between transition-all touch-manipulation active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span dangerouslySetInnerHTML={{ __html: opt }} />
                              {isSelected && <span>✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση */}
                    {isSubmitted && (
                      <div
                        className={`p-4 rounded-xl text-xs sm:text-sm space-y-3 mt-3 border ${
                          isCorrect
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        {isCorrect ? (
                          <div className="font-black flex items-center gap-1.5 text-emerald-700 text-sm sm:text-base">
                            <span>✅</span>
                            <span>ΣΩΣΤΟ</span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="font-black flex items-center gap-1.5 text-rose-700 text-sm sm:text-base">
                              <span>❌</span>
                              <span>ΛΑΘΟΣ</span>
                            </div>
                            {/* Κενό μετά την άνω κάτω τελεία (&nbsp;&nbsp;) */}
                            <div className="text-xs sm:text-sm font-bold text-slate-800 bg-white/90 py-1.5 px-3 rounded-lg border border-rose-200 inline-block font-mono">
                              ΣΩΣΤΗ ΑΠΑΝΤΗΣΗ:&nbsp;&nbsp;<span className="text-emerald-700 font-black" dangerouslySetInnerHTML={{ __html: q.correctAnswer }} />
                            </div>
                          </div>
                        )}

                        <div
                          className="text-slate-700 leading-loose font-normal pt-2 border-t border-slate-200/60"
                          dangerouslySetInnerHTML={{ __html: q.solution }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Κουμπί Ελέγχου / Ανανέωσης εντός σελίδας */}
          <div className="flex justify-center pt-4">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount === 0}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR (12 Ασκήσεις) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {isSubmitted ? 'ΤΕΛΙΚΟ ΣΚΟΡ' : 'ΠΡΟΟΔΟΣ'}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 12` : `${answeredCount} / 12`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  ΕΠΙΤΥΧΙΑ
                </div>
                <div
                  className={`text-base sm:text-xl font-black font-mono ${
                    scorePercentage >= 80
                      ? 'text-emerald-400'
                      : scorePercentage >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {scorePercentage}%
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={generateQuestions}
              className="px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                ΕΠΑΝΑΛΗΨΗ
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

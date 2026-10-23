import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Επαναχρησιμοποιήσιμο component για κλασματική γραφή
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

// Helper για δημιουργία HTML κλάσματος μέσα στα solution strings
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
  const unique = new Set([String(correct)]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  let count = 1;
  while (unique.size < 4) {
    unique.add(String(Number(correct) + count));
    count++;
  }
  return shuffleArray(Array.from(unique));
};

// ============================================================================
// 12 ΘΕΜΑΤΙΚΕΣ ΔΕΞΑΜΕΝΕΣ (ΚΑΘΕΜΙΑ ΜΕ 10 ΔΙΑΦΟΡΕΤΙΚΕΣ ΠΑΡΑΛΛΑΓΕΣ ΜΕ ΤΥΧΑΙΑ ΝΟΥΜΕΡΑ)
// ============================================================================

// Θέση 1: Έννοιες Ευθείας, Ημιευθείας & Σημείου (MCQ)
const POOL_1_BASIC_LINES = [
  () => ({
    type: 'mcq',
    topic: 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΕΥΘΕΙΑ',
    question: `Πόσες ευθείες μπορούν να περάσουν από <strong>δύο διαφορετικά σημεία Α και Β</strong> του επιπέδου;`,
    options: makeUniqueOptions('Μία και μοναδική ευθεία', [
      'Άπειρες ευθείες',
      'Καμία ευθεία',
      'Ακριβώς δύο ευθείες',
    ]),
    correctAnswer: 'Μία και μοναδική ευθεία',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          Βασικό Αξίωμα της Γεωμετρίας:
        </div>
        <div>Από δύο διακεκριμένα σημεία Α και Β διέρχεται <strong>μία και μοναδική</strong> ευθεία (η οποία συμβολίζεται ως ευθεία ΑΒ ή ε).</div>
      </div>
    `,
  }),
  () => ({
    type: 'mcq',
    topic: 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΣΗΜΕΙΟ & ΕΥΘΕΙΕΣ',
    question: `Πόσες ευθείες μπορούν να περάσουν από <strong>ένα μόνο σημείο Α</strong> του επιπέδου;`,
    options: makeUniqueOptions('Άπειρες ευθείες', [
      'Μία και μοναδική ευθεία',
      'Δύο ευθείες',
      'Καμία ευθεία',
    ]),
    correctAnswer: 'Άπειρες ευθείες',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          Ιδιότητα του Σημείου:
        </div>
        <div>Από ένα μόνο σημείο Α μπορούν να διέλθουν <strong>άπειρες ευθείες</strong>, οι οποίες σχηματίζουν μια «δέσμη ευθειών».</div>
      </div>
    `,
  }),
  () => ({
    type: 'mcq',
    topic: 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΗΜΙΕΥΘΕΙΑ',
    question: `Ποιο από τα παρακάτω γεωμετρικά σχήματα έχει <strong>αρχή αλλά δεν έχει τέλος</strong>;`,
    options: makeUniqueOptions('Η ημιευθεία', [
      'Το ευθύγραμμο τμήμα',
      'Η ευθεία',
      'Το επίπεδο',
    ]),
    correctAnswer: 'Η ημιευθεία',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          Ορισμός Ημιευθείας:
        </div>
        <div>Η <strong>ημιευθεία</strong> ξεκινά από ένα συγκεκριμένο σημείο (την αρχή της) και εκτείνεται απεριόριστα προς μία κατεύθυνση, άρα δεν έχει τέλος.</div>
      </div>
    `,
  }),
  () => ({
    type: 'mcq',
    topic: 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΑΝΤΙΚΕΙΜΕΝΕΣ ΗΜΙΕΥΘΕΙΕΣ',
    question: `Δύο ημιευθείες Οx και Οy που βρίσκονται στην ίδια ευθεία, έχουν κοινή αρχή το Ο και προεκτείνονται προς αντίθετες κατευθύνσεις ονομάζονται:`,
    options: makeUniqueOptions('Αντικείμενες ημιευθείες', [
      'Συμπληρωματικές ημιευθείες',
      'Παράλληλες ημιευθείες',
      'Διαδοχικές ημιευθείες',
    ]),
    correctAnswer: 'Αντικείμενες ημιευθείες',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          Ορισμός Αντικείμενων Ημιευθειών:
        </div>
        <div>Ένα σημείο Ο πάνω σε μια ευθεία τη χωρίζει σε δύο <strong>αντικείμενες ημιευθείες</strong> που μαζί συνθέτουν ολόκληρη την ευθεία.</div>
      </div>
    `,
  }),
  () => ({
    type: 'mcq',
    topic: 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΣΥΝΕΥΘΕΙΑΚΑ ΣΗΜΕΙΑ',
    question: `Πώς ονομάζονται τρία ή περισσότερα σημεία που βρίσκονται <strong>πάνω στην ίδια ευθεία</strong>;`,
    options: makeUniqueOptions('Συνευθειακά σημεία', [
      'Διαδοχικά σημεία',
      'Συμμετρικά σημεία',
      'Ισαπέχοντα σημεία',
    ]),
    correctAnswer: 'Συνευθειακά σημεία',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          Ορισμός:
        </div>
        <div>Σημεία που ανήκουν στην ίδια ευθεία γραμμή ονομάζονται <strong>συνευθειακά σημεία</strong>.</div>
      </div>
    `,
  }),
  () => ({
    type: 'mcq',
    topic: 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΕΥΘΥΓΡΑΜΜΟ ΤΜΗΜΑ',
    question: `Ποιο γεωμετρικό σχήμα περιορίζεται ανάμεσα σε δύο συγκεκριμένα σημεία Α και Β (τα άκρα του);`,
    options: makeUniqueOptions('Το ευθύγραμμο τμήμα ΑΒ', [
      'Η ημιευθεία ΑΒ',
      'Η ευθεία ΑΒ',
      'Η τεθλασμένη γραμμή',
    ]),
    correctAnswer: 'Το ευθύγραμμο τμήμα ΑΒ',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          Ορισμός Ευθύγραμμου Τμήματος:
        </div>
        <div>Το <strong>ευθύγραμμο τμήμα ΑΒ</strong> έχει αρχή και τέλος (τα άκρα του Α και Β) και έχει συγκεκριμένο μήκος.</div>
      </div>
    `,
  }),
  () => ({
    type: 'mcq',
    topic: 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΕΠΙΠΕΔΟ',
    question: `Από <strong>τρία σημεία που δεν βρίσκονται στην ίδια ευθεία</strong> (μη συνευθειακά) διέρχεται:`,
    options: makeUniqueOptions('Ένα και μοναδικό επίπεδο', [
      'Άπειρα επίπεδα',
      'Καμία ευθεία και κανένα επίπεδο',
      'Ακριβώς τρία επίπεδα',
    ]),
    correctAnswer: 'Ένα και μοναδικό επίπεδο',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          Ορισμός Επιπέδου:
        </div>
        <div>Τρία μη συνευθειακά σημεία ορίζουν <strong>ένα και μοναδικό επίπεδο</strong>.</div>
      </div>
    `,
  }),
  () => ({
    type: 'mcq',
    topic: 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΕΥΘΕΙΑ',
    question: `Ποια από τις παρακάτω προτάσεις για την <strong>ευθεία</strong> είναι σωστή;`,
    options: makeUniqueOptions('Δεν έχει ούτε αρχή ούτε τέλος', [
      'Έχει αρχή αλλά δεν έχει τέλος',
      'Έχει αρχή και τέλος',
      'Έχει μετρήσιμο πεπερασμένο μήκος',
    ]),
    correctAnswer: 'Δεν έχει ούτε αρχή ούτε τέλος',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          Χαρακτηριστικό Ευθείας:
        </div>
        <div>Η ευθεία εκτείνεται απεριόριστα και προς τις δύο κατευθύνσεις, συνεπώς δεν έχει ούτε αρχή ούτε τέλος.</div>
      </div>
    `,
  }),
  () => ({
    type: 'mcq',
    topic: 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΗΜΙΕΥΘΕΙΑ',
    question: `Πώς συμβολίζουμε μια ημιευθεία με αρχή το σημείο Ο που διέρχεται από το σημείο Α;`,
    options: makeUniqueOptions('Ημιευθεία ΟΑ (ή Οx)', [
      'Ευθύγραμμο τμήμα [ΟΑ]',
      'Ευθεία (ΟΑ)',
      'Επίπεδο ΟΑ',
    ]),
    correctAnswer: 'Ημιευθεία ΟΑ (ή Οx)',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          Συμβολισμός:
        </div>
        <div>Γράφουμε πρώτα την αρχή της (Ο) και έπειτα ένα σημείο της (Α) ή ένα μικρό γράμμα κατεύθυνσης (x): ημιευθεία ΟΑ ή Οx.</div>
      </div>
    `,
  }),
  () => ({
    type: 'mcq',
    topic: 'ΒΑΣΙΚΕΣ ΕΝΝΟΙΕΣ: ΤΟΜΗ ΕΥΘΕΙΩΝ',
    question: `Δύο διαφορετικές ευθείες στο ίδιο επίπεδο που τέμνονται, έχουν κοινά:`,
    options: makeUniqueOptions('Ακριβώς ένα σημείο', [
      'Δύο διαφορετικά σημεία',
      'Άπειρα σημεία',
      'Κανένα σημείο',
    ]),
    correctAnswer: 'Ακριβώς ένα σημείο',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          Τομή Ευθειών:
        </div>
        <div>Αν δύο ευθείες τέμνονται, το κοινό τους σημείο είναι <strong>ακριβώς ένα</strong> (το σημείο τομής).</div>
      </div>
    `,
  }),
];

// Θέση 2: Υπολογισμός Μέσου Ευθύγραμμου Τμήματος (Input)
const POOL_2_MIDPOINT_CALC = Array.from({ length: 10 }, (_, i) => () => {
  const ab = 8 + i * 2; // 8, 10, 12, ..., 26 cm
  const am = ab / 2;
  return {
    type: 'input',
    topic: 'ΜΕΣΟ ΤΜΗΜΑΤΟΣ',
    question: `Ένα ευθύγραμμο τμήμα ΑΒ έχει μήκος <strong>${ab} cm</strong>. Αν <strong>Μ</strong> είναι το μέσο του ΑΒ, ποιο είναι το μήκος του τμήματος <strong>ΑΜ</strong> σε cm;`,
    correctAnswer: String(am),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          Δεδομένα: ΑΒ ＝ ${ab} cm, Μ μέσο του ΑΒ.
        </div>
        <div class="flex items-center flex-wrap">
          Επειδή το Μ είναι το μέσο, χωρίζει το ΑΒ σε δύο ίσα τμήματα: ΑΜ ＝ ΜΒ ＝ ${fracHtml('ΑΒ', 2)} ＝ ${fracHtml(ab, 2)} ＝ <strong>${am} cm</strong>.
        </div>
      </div>
    `,
  };
});

// Θέση 3: Εύρεση Όλου του Τμήματος από το Μισό (Input)
const POOL_3_FULL_FROM_MID = Array.from({ length: 10 }, (_, i) => () => {
  const am = 5 + i; // 5, 6, ..., 14 cm
  const ab = 2 * am;
  return {
    type: 'input',
    topic: 'ΜΕΣΟ ΤΜΗΜΑΤΟΣ',
    question: `Το σημείο <strong>Μ</strong> είναι το μέσο του ευθύγραμμου τμήματος ΑΒ. Αν <strong>ΜΒ ＝ ${am} cm</strong>, ποιο είναι το συνολικό μήκος του <strong>ΑΒ</strong> σε cm;`,
    correctAnswer: String(ab),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          Δεδομένα: ΜΒ ＝ ${am} cm, Μ μέσο του ΑΒ.
        </div>
        <div>
          Ισχύει ΑΒ ＝ 2 · ΜΒ ➔ ΑΒ ＝ 2 · ${am} ＝ <strong>${ab} cm</strong>.
        </div>
      </div>
    `,
  };
});

// Θέση 4: Απόσταση Σημείων σε Βαθμολογημένη Ευθεία (Input)
const POOL_4_COORDINATE_DIST = Array.from({ length: 10 }, (_, i) => () => {
  const a = 2 + (i % 4);
  const dist = randInt(5, 14);
  const b = a + dist;
  return {
    type: 'input',
    topic: 'ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΩΝ',
    question: `Σε έναν βαθμολογημένο άξονα το σημείο Α βρίσκεται στη θέση <strong>${a} cm</strong> και το σημείο Β στη θέση <strong>${b} cm</strong>. Ποια είναι η απόσταση <strong>ΑΒ</strong> σε cm;`,
    correctAnswer: String(dist),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          Θέσεις: Α(${a}), Β(${b}).
        </div>
        <div>
          Η απόσταση των δύο σημείων ισούται με τη διαφορά: ΑΒ ＝ ${b} － ${a} ＝ <strong>${dist} cm</strong>.
        </div>
      </div>
    `,
  };
});

// Θέση 5: Διαδοχικά Συνευθειακά Τμήματα (Input)
const POOL_5_COLLINEAR_SUM = Array.from({ length: 10 }, (_, i) => () => {
  const ab = randInt(4, 9);
  const bc = randInt(3, 8);
  const cd = randInt(5, 11);
  const total = ab + bc + cd;
  return {
    type: 'input',
    topic: 'ΔΙΑΔΟΧΙΚΑ ΤΜΗΜΑΤΑ',
    question: `Πάνω σε μια ευθεία παίρνουμε με τη σειρά τα διαδοχικά σημεία Α, Β, Γ, Δ. Αν <strong>ΑΒ ＝ ${ab} cm</strong>, <strong>ΒΓ ＝ ${bc} cm</strong> και <strong>ΓΔ ＝ ${cd} cm</strong>, ποιο είναι το μήκος του <strong>ΑΔ</strong> σε cm;`,
    correctAnswer: String(total),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          Συνευθειακά σημεία: Α, Β, Γ, Δ.
        </div>
        <div>
          Το συνολικό μήκος ισούται με το άθροισμα των επιμέρους τμημάτων: ΑΔ ＝ ΑΒ ＋ ΒΓ ＋ ΓΔ ＝ ${ab} ＋ ${bc} ＋ ${cd} ＝ <strong>${total} cm</strong>.
        </div>
      </div>
    `,
  };
});

// Θέση 6: Μήκος Ανοιχτής Τεθλασμένης Γραμμής (Input)
const POOL_6_POLYLINE_LEN = Array.from({ length: 10 }, (_, i) => () => {
  const s1 = randInt(3, 7);
  const s2 = randInt(4, 8);
  const s3 = randInt(5, 10);
  const sum = s1 + s2 + s3;
  return {
    type: 'input',
    topic: 'ΤΕΘΛΑΣΜΕΝΗ ΓΡΑΜΜΗ',
    question: `Μια ανοιχτή τεθλασμένη γραμμή ΑΒΓΔ αποτελείται από τα τμήματα <strong>ΑΒ ＝ ${s1} m</strong>, <strong>ΒΓ ＝ ${s2} m</strong> και <strong>ΓΔ ＝ ${s3} m</strong>. Ποιο είναι το συνολικό μήκος της τεθλασμένης γραμμής σε μέτρα;`,
    correctAnswer: String(sum),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          Τεθλασμένη γραμμή ΑΒΓΔ:
        </div>
        <div>
          Μήκος τεθλασμένης L ＝ ΑΒ ＋ ΒΓ ＋ ΓΔ ＝ ${s1} ＋ ${s2} ＋ ${s3} ＝ <strong>${sum} m</strong>.
        </div>
      </div>
    `,
  };
});

// Θέση 7: Σύγκριση Τεθλασμένης με Ευθύγραμμο Τμήμα (MCQ)
const POOL_7_SHORTEST_PATH_MCQ = [
  () => ({
    type: 'mcq',
    topic: 'ΣΥΝΤΟΜΟΤΕΡΗ ΔΙΑΔΡΟΜΗ',
    question: `Αν Α, Β, Γ είναι τρία σημεία που <strong>δεν βρίσκονται στην ίδια ευθεία</strong>, ποια σχέση ισχύει μεταξύ του ευθύγραμμου τμήματος ΑΓ και των τμημάτων ΑΒ και ΒΓ;`,
    options: makeUniqueOptions('ΑΓ ＜ ΑΒ ＋ ΒΓ', [
      'ΑΓ ＝ ΑΒ ＋ ΒΓ',
      'ΑΓ ＞ ΑΒ ＋ ΒΓ',
      'ΑΓ ＝ 2 · (ΑΒ ＋ ΒΓ)',
    ]),
    correctAnswer: 'ΑΓ ＜ ΑΒ ＋ ΒΓ',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          Θεμελιώδης Ιδιότητα (Τριγωνική Ανισότητα):
        </div>
        <div>
          Το ευθύγραμμο τμήμα ΑΓ είναι η <strong>συντομότερη οδός</strong> που ενώνει το Α με το Γ, άρα είναι πάντοτε αυστηρά μικρότερο από την τεθλασμένη διαδρομή ΑΒ ＋ ΒΓ.
        </div>
      </div>
    `,
  }),
  () => ({
    type: 'mcq',
    topic: 'ΣΥΝΤΟΜΟΤΕΡΗ ΔΙΑΔΡΟΜΗ',
    question: `Μια τεθλασμένη γραμμή ΑΒΓΔ έχει συνολικό μήκος 18 cm. Ποιο από τα παρακάτω <strong>μπορεί</strong> να είναι το μήκος του ευθύγραμμου τμήματος ΑΔ;`,
    options: makeUniqueOptions('15 cm', [
      '18 cm',
      '21 cm',
      '24 cm',
    ]),
    correctAnswer: '15 cm',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          Έλεγχος Μήκους:
        </div>
        <div>
          Το ευθύγραμμο τμήμα ΑΔ πρέπει υποχρεωτικά να είναι <strong>μικρότερο</strong> από το μήκος της τεθλασμένης (ΑΔ ＜ 18 cm). Η μόνη επιλογή που είναι μικρότερη από το 18 είναι το <strong>15 cm</strong>.
        </div>
      </div>
    `,
  }),
  () => ({
    type: 'mcq',
    topic: 'ΚΛΕΙΣΤΗ ΤΕΘΛΑΣΜΕΝΗ',
    question: `Μια τεθλασμένη γραμμή στην οποία το τέλος του τελευταίου τμήματος συμπίπτει με την αρχή του πρώτου λέγεται:`,
    options: makeUniqueOptions('Κλειστή τεθλασμένη (πολύγωνο)', [
      'Ανοιχτή τεθλασμένη',
      'Ευθύγραμμο τμήμα',
      'Ημιευθεία',
    ]),
    correctAnswer: 'Κλειστή τεθλασμένη (πολύγωνο)',
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100">
          Ορισμός:
        </div>
        <div>
          Όταν η τεθλασμένη γραμμή επιστρέφει στο σημείο εκκίνησης, ονομάζεται <strong>κλειστή τεθλασμένη γραμμή ή πολύγωνο</strong>.
        </div>
      </div>
    `,
  }),
  ...Array.from({ length: 7 }, (_, i) => () => {
    const polyLen = 20 + i * 2;
    const validDirect = polyLen - randInt(2, 6);
    return {
      type: 'mcq',
      topic: 'ΣΥΝΤΟΜΟΤΕΡΗ ΔΙΑΔΡΟΜΗ',
      question: `Αν το συνολικό μήκος μιας τεθλασμένης διαδρομής ΑΒΓ είναι <strong>${polyLen} km</strong>, ποιο μπορεί να είναι το μήκος του ευθύγραμμου τμήματος ΑΓ;`,
      options: makeUniqueOptions(`${validDirect} km`, [
        `${polyLen} km`,
        `${polyLen + 3} km`,
        `${polyLen + 7} km`,
      ]),
      correctAnswer: `${validDirect} km`,
      solution: `
        <div class="space-y-2 leading-loose">
          <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
            Μήκος τεθλασμένης ＝ ${polyLen} km.
          </div>
          <div>
            Η ευθεία διαδρομή ΑΓ είναι πάντα συντομότερη από την τεθλασμένη: ΑΓ ＜ ${polyLen} km. Άρα σωστή απάντηση είναι τα <strong>${validDirect} km</strong>.
          </div>
        </div>
      `,
    };
  }),
];

// Θέση 8: Σύνθετος Υπολογισμός με Μέσα Τμημάτων (Input)
const POOL_8_DOUBLE_MIDPOINT = Array.from({ length: 10 }, (_, i) => () => {
  const ab = 8 + i * 2; // π.χ. 8, 10, 12, ...
  const bc = 12 + i * 2; // π.χ. 12, 14, 16, ...
  const m1b = ab / 2;
  const bm2 = bc / 2;
  const m1m2 = m1b + bm2;
  return {
    type: 'input',
    topic: 'ΣΥΝΘΕΤΑ ΜΕΣΑ',
    question: `Πάνω σε μια ευθεία βρίσκονται διαδοχικά τα τμήματα ΑΒ ＝ ${ab} cm και ΒΓ ＝ ${bc} cm. Αν <strong>Μ₁</strong> είναι το μέσο του ΑΒ και <strong>Μ₂</strong> είναι το μέσο του ΒΓ, ποια είναι η απόσταση <strong>Μ₁Μ₂</strong> σε cm;`,
    correctAnswer: String(m1m2),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          Δεδομένα: ΑΒ ＝ ${ab} cm, ΒΓ ＝ ${bc} cm.
        </div>
        <div class="flex items-center flex-wrap">
          1. Το Μ₁ είναι μέσο του ΑΒ, άρα Μ₁Β ＝ ${fracHtml(ab, 2)} ＝ ${m1b} cm.
        </div>
        <div class="flex items-center flex-wrap">
          2. Το Μ₂ είναι μέσο του ΒΓ, άρα ΒΜ₂ ＝ ${fracHtml(bc, 2)} ＝ ${bm2} cm.
        </div>
        <div>
          3. Απόσταση Μ₁Μ₂ ＝ Μ₁Β ＋ ΒΜ₂ ＝ ${m1b} ＋ ${bm2} ＝ <strong>${m1m2} cm</strong>.
        </div>
      </div>
    `,
  };
});

// Θέση 9: Σύγκριση Ευθυγράμμων Τμημάτων (MCQ)
const POOL_9_COMPARISON_MCQ = Array.from({ length: 10 }, (_, i) => () => {
  const len1 = 8 + (i % 5);
  const diff = randInt(1, 4);
  const isGreater = i % 2 === 0;
  const len2 = isGreater ? len1 - diff : len1 + diff;
  const correct = isGreater ? 'ΑΒ ＞ ΓΔ' : 'ΑΒ ＜ ΓΔ';
  return {
    type: 'mcq',
    topic: 'ΣΥΓΚΡΙΣΗ ΤΜΗΜΑΤΩΝ',
    question: `Έχουμε τα ευθύγραμμα τμήματα <strong>ΑΒ ＝ ${len1} cm</strong> και <strong>ΓΔ ＝ ${len2} cm</strong>. Ποια είναι η σωστή σχέση σύγκρισης μεταξύ τους;`,
    options: makeUniqueOptions(correct, ['ΑΒ ＝ ΓΔ', isGreater ? 'ΑΒ ＜ ΓΔ' : 'ΑΒ ＞ ΓΔ', 'ΑΒ ＋ ΓΔ ＝ 0']),
    correctAnswer: correct,
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          Μήκη: ΑΒ ＝ ${len1} cm, ΓΔ ＝ ${len2} cm.
        </div>
        <div>
          Συγκρίνοντας τους αριθμούς: ${len1} ${isGreater ? '＞' : '＜'} ${len2}, επομένως ισχύει <strong>${correct}</strong>.
        </div>
      </div>
    `,
  };
});

// Θέση 10: Εύρεση Τμήματος με Αφαίρεση (Input)
const POOL_10_SUBTRACTION = Array.from({ length: 10 }, (_, i) => () => {
  const ac = 18 + i * 2;
  const ab = randInt(6, 12);
  const bc = ac - ab;
  return {
    type: 'input',
    topic: 'ΜΗΚΟΣ ΤΜΗΜΑΤΟΣ',
    question: `Σε μια ευθεία βρίσκονται τα σημεία Α, Β και Γ με το Β ανάμεσα στα Α και Γ. Αν <strong>ΑΓ ＝ ${ac} cm</strong> και <strong>ΑΒ ＝ ${ab} cm</strong>, ποιο είναι το μήκος του <strong>ΒΓ</strong> σε cm;`,
    correctAnswer: String(bc),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          Δεδομένα: ΑΓ ＝ ${ac} cm, ΑΒ ＝ ${ab} cm.
        </div>
        <div>
          Επειδή το Β είναι ανάμεσα στα Α και Γ: ΒΓ ＝ ΑΓ － ΑΒ ＝ ${ac} － ${ab} ＝ <strong>${bc} cm</strong>.
        </div>
      </div>
    `,
  };
});

// Θέση 11: Ρεαλιστικό Πρόβλημα Αυτοκινητοδρόμου & Μέσου (Input)
const POOL_11_REAL_PROBLEM_HIGHWAY = Array.from({ length: 10 }, (_, i) => () => {
  const ab = 60 + i * 4; // 60, 64, 68...
  const bc = 40 + i * 2; // 40, 42, 44...
  const total = ab + bc;
  const am = total / 2;
  const mb = Math.abs(ab - am);
  return {
    type: 'input',
    topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΜΕΣΟ ΤΜΗΜΑΤΟΣ',
    question: `Σε έναν ευθύγραμμο δρόμο βρίσκονται με τη σειρά τρεις πόλεις Α, Β και Γ. Η απόσταση ΑΒ είναι <strong>${ab} km</strong> και η ΒΓ είναι <strong>${bc} km</strong>. Ένας σταθμός διοδίων κατασκευάζεται ακριβώς στο <strong>μέσο Μ</strong> της συνολικής διαδρομής ΑΓ. Πόσα χιλιόμετρα απέχει ο σταθμός διοδίων από την πόλη Β;`,
    correctAnswer: String(mb),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          Αρχικά δεδομένα: ΑΒ ＝ ${ab} km, ΒΓ ＝ ${bc} km.
        </div>
        <div>1. Συνολική απόσταση ΑΓ: ΑΓ ＝ ${ab} ＋ ${bc} ＝ ${total} km.</div>
        <div class="flex items-center flex-wrap">
          2. Το Μ είναι μέσο του ΑΓ: ΑΜ ＝ ${fracHtml(total, 2)} ＝ ${am} km.
        </div>
        <div>
          3. Απόσταση από την πόλη Β: ΜΒ ＝ |ΑΒ － ΑΜ| ＝ ${ab} － ${am} ＝ <strong>${mb} km</strong>.
        </div>
      </div>
    `,
  };
});

// Θέση 12: Ρεαλιστικό Πρόβλημα Περιμέτρου & Κόστους Τεθλασμένης (Input)
const POOL_12_REAL_PROBLEM_FENCE = Array.from({ length: 10 }, (_, i) => () => {
  const s1 = randInt(12, 20);
  const s2 = randInt(15, 25);
  const s3 = randInt(10, 18);
  const costPerM = randInt(4, 7);
  const totalM = s1 + s2 + s3;
  const totalCost = totalM * costPerM;
  return {
    type: 'input',
    topic: 'ΠΡΟΒΛΗΜΑΤΑ: ΠΕΡΙΦΡΑΞΗ',
    question: `Ένας αγρότης θέλει να περιφράξει μια τεθλασμένη πλευρά του κτήματός του που αποτελείται από τρία διαδοχικά τμήματα: <strong>${s1} m</strong>, <strong>${s2} m</strong> και <strong>${s3} m</strong>. Αν το συρματόπλεγμα κοστίζει <strong>${costPerM} €</strong> ανά μέτρο, πόσα ευρώ θα πληρώσει συνολικά;`,
    correctAnswer: String(totalCost),
    solution: `
      <div class="space-y-2 leading-loose">
        <div class="font-bold text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 font-mono">
          Διαστάσεις: ${s1} m, ${s2} m, ${s3} m με κόστος ${costPerM} €/m.
        </div>
        <div>1. Συνολικό μήκος τεθλασμένης: L ＝ ${s1} ＋ ${s2} ＋ ${s3} ＝ ${totalM} μέτρα.</div>
        <div>
          2. Συνολικό κόστος περίφραξης: ${totalM} · ${costPerM} ＝ <strong>${totalCost} €</strong>.
        </div>
      </div>
    `,
  };
});

// Συγκέντρωση των 12 δεξαμενών
const POOLS = [
  POOL_1_BASIC_LINES,
  POOL_2_MIDPOINT_CALC,
  POOL_3_FULL_FROM_MID,
  POOL_4_COORDINATE_DIST,
  POOL_5_COLLINEAR_SUM,
  POOL_6_POLYLINE_LEN,
  POOL_7_SHORTEST_PATH_MCQ,
  POOL_8_DOUBLE_MIDPOINT,
  POOL_9_COMPARISON_MCQ,
  POOL_10_SUBTRACTION,
  POOL_11_REAL_PROBLEM_HIGHWAY,
  POOL_12_REAL_PROBLEM_FENCE,
];

export default function GeometrikesEnnoiesAsk() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Παραγωγή 12 ασκήσεων (μία τυχαία επιλογή από κάθε δεξαμενή)
  const generateQuestions = () => {
    const selected = POOLS.map((pool, idx) => {
      const randomGen = pool[Math.floor(Math.random() * pool.length)];
      return {
        id: idx + 1,
        ...randomGen(),
      };
    });

    setQuestions(selected);
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
      title="Ασκήσεις: Βασικές Γεωμετρικές Έννοιες | Α' Γυμνασίου"
      description="12 επιλεγμένες ασκήσεις και προβλήματα σε σημείο, ευθεία, ημιευθεία, ευθύγραμμο τμήμα, μέσο τμήματος και τεθλασμένες γραμμές για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/35-geometrikes-ennoies"
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΓΕΩΜΕΤΡΙΑ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Βασικές Γεωμετρικές Έννοιες & Σχήματα
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Επίλυσε τις παρακάτω 12 επιλεγμένες ασκήσεις σε ευθείες, τμήματα, μέσα και τεθλασμένες γραμμές. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία σου και αναλυτικές λύσεις με βήματα.
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
              const isProblem = q.id >= 11;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                    isProblem ? 'border-amber-200 bg-amber-50/15' : 'border-slate-200'
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
                            isProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {q.id}
                        </span>
                        {isProblem && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
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
                          placeholder="Γράψε την απάντηση..."
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

                    {/* Feedback & Αναλυτική Λύση */}
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

          {/* Κουμπιά Ελέγχου / Ανανέωσης εντός σελίδας */}
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

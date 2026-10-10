// pages/st-dimotikou/56-pinakas-sixnotiton-ask.js
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

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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

// Μορφοποίηση αριθμού
function formatNum(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  if (Number.isInteger(Number(val))) return String(val);
  const rounded = Number(Number(val).toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Βοηθητικό component πίνακα συχνοτήτων - ΠΛΗΡΩΣ ΑΝΑΓΝΩΣΙΜΟ ΣΤΑ ΚΙΝΗΤΑ
function ExerciseFrequencyTable({ headers, rows, totalRow }) {
  const colCount = headers.length;
  const firstColWidth = colCount === 2 ? 'w-[58%]' : colCount === 3 ? 'w-[42%]' : 'w-[34%]';
  const otherColWidth = colCount === 2 ? 'w-[42%]' : colCount === 3 ? 'w-[29%]' : 'w-[22%]';

  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-2.5 sm:p-3.5 my-3 w-full max-w-lg shadow-inner">
      <div className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-1.5">
        {toCleanUppercase('Πίνακας Κατανομής Συχνοτήτων')}
      </div>
      <table className="w-full table-fixed text-center text-[11px] sm:text-xs md:text-sm font-mono bg-white rounded-xl border border-slate-200 overflow-hidden">
        <thead>
          <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold font-sans">
            {headers.map((h, i) => (
              <th
                key={`th-${i}`}
                className={`p-1.5 sm:p-2 break-words ${i === 0 ? `${firstColWidth} text-left pl-2.5` : `${otherColWidth}`}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, rIdx) => (
            <tr key={`tr-${rIdx}`} className="border-b border-slate-100">
              {r.map((cell, cIdx) => (
                <td
                  key={`td-${rIdx}-${cIdx}`}
                  className={`p-1.5 sm:p-2 break-words ${
                    cIdx === 0
                      ? 'text-left pl-2.5 font-sans font-bold text-slate-800'
                      : 'text-slate-900 font-bold'
                  } ${cell === 'x' || cell === 'χ' || cell === '?' ? 'text-amber-600 font-black text-sm sm:text-base' : ''}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {totalRow && (
            <tr className="bg-slate-100/70 font-black text-slate-900 font-sans border-t border-slate-200">
              {totalRow.map((cell, idx) => (
                <td
                  key={`tot-${idx}`}
                  className={`p-1.5 sm:p-2 break-words ${idx === 0 ? 'text-left pl-2.5' : 'font-mono'}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'freq_std_1',
    title: 'Σύνολο Μαθητών από Βαθμολογίες',
    unit: 'μαθητές',
    generate: () => {
      const f10 = randInt(5, 8);
      const f9 = randInt(8, 12);
      const f8 = randInt(4, 7);
      const f7 = randInt(2, 5);
      const total = f10 + f9 + f8 + f7;
      return {
        prompt: `Στον παρακάτω πίνακα συχνοτήτων καταγράφηκαν οι βαθμολογίες των μαθητών σε ένα τεστ. Πόσοι μαθητές έγραψαν συνολικά στο τεστ;`,
        table: {
          headers: ['Βαθμός', 'Συχνότητα (ν)'],
          rows: [
            ['Βαθμός 10', f10],
            ['Βαθμός 9', f9],
            ['Βαθμός 8', f8],
            ['Βαθμός 7', f7]
          ]
        },
        unit: 'μαθητές',
        correctVal: String(total),
        correctText: `${total} μαθητές`,
        tableData: [
          { item: 'Βαθμοί', formula: `10, 9, 8, 7`, val: '4 κατηγορίες' },
          { item: 'Συχνότητες', formula: `${f10} ＋ ${f9} ＋ ${f8} ＋ ${f7}`, val: `${total}` },
          { item: 'Συνολικό μέγεθος δείγματος (Ν)', formula: 'Άθροισμα συχνοτήτων', val: `${total} μαθητές` }
        ],
        explain: `Αθροίζουμε όλες τις συχνότητες του πίνακα: ${f10} ＋ ${f9} ＋ ${f8} ＋ ${f7} ＝ ${total} μαθητές.`,
        distractors: [`${total + 3} μαθητές`, `${total - 4} μαθητές`, `${total + 5} μαθητές`]
      };
    }
  },
  {
    id: 'freq_std_2',
    title: 'Επικρατούσα Κατηγορία Βιβλίων',
    unit: '',
    generate: () => {
      const fA = randInt(6, 10);
      const fB = randInt(12, 18);
      const fC = randInt(4, 8);
      return {
        prompt: `Παρατηρήστε τον πίνακα προτιμήσεων για τρία βιβλία. Ποιο είναι το βιβλίο με τη μεγαλύτερη συχνότητα (επικρατούσα κατηγορία / mode);`,
        table: {
          headers: ['Βιβλίο', 'Αναγνώστες (ν)'],
          rows: [
            ['Περιπέτεια', fA],
            ['Επιστημονική Φαντασία', fB],
            ['Ιστορικό', fC]
          ]
        },
        unit: '',
        correctVal: 'Επιστημονική Φαντασία',
        correctText: 'Επιστημονική Φαντασία',
        tableData: [
          { item: 'Περιπέτεια', formula: `${fA} αναγνώστες`, val: `${fA}` },
          { item: 'Επιστημονική Φαντασία', formula: `${fB} αναγνώστες`, val: `${fB} (Μέγιστο)` },
          { item: 'Ιστορικό', formula: `${fC} αναγνώστες`, val: `${fC}` }
        ],
        options: shuffle(['Επιστημονική Φαντασία', 'Περιπέτεια', 'Ιστορικό']),
        explain: `Η επικρατούσα κατηγορία είναι εκείνη με τη μεγαλύτερη συχνότητα. Εδώ είναι η «Επιστημονική Φαντασία» με ${fB} αναγνώστες.`,
        distractors: ['Περιπέτεια', 'Ιστορικό']
      };
    }
  },
  {
    id: 'freq_std_3',
    title: 'Σχετική Συχνότητα Επιλογής',
    unit: '',
    generate: () => {
      const total = 50;
      const freq = pickRandom([10, 15, 20, 25]);
      const relFreq = freq / total;
      return {
        prompt: `Σε έρευνα 50 ατόμων, ένα συγκεκριμένο άθλημα επιλέχθηκε από ${freq} άτομα. Ποια είναι η σχετική συχνότητα της επιλογής αυτής σε δεκαδική μορφή;`,
        table: {
          headers: ['Άθλημα', 'Συχνότητα', 'Σχετική Συχνότητα'],
          rows: [
            ['Κολύμβηση', freq, 'x']
          ],
          totalRow: ['ΣΥΝΟΛΟ', 50, '1,00']
        },
        unit: '',
        correctVal: formatNum(relFreq, 2),
        correctText: formatNum(relFreq, 2),
        tableData: [
          { item: 'Συχνότητα (ν)', formula: `${freq}`, val: `${freq}` },
          { item: 'Μέγεθος δείγματος (Ν)', formula: '50', val: '50' },
          { item: 'Σχετική συχνότητα (f)', formula: `${freq} : 50`, val: `${formatNum(relFreq, 2)}` }
        ],
        explain: `Η σχετική συχνότητα ισούται με τη συχνότητα διά το σύνολο: ${freq} : 50 ＝ ${formatNum(relFreq, 2)}.`,
        distractors: [formatNum(relFreq + 0.1, 2), formatNum(Math.max(0.05, relFreq - 0.1), 2), formatNum(relFreq + 0.15, 2)]
      };
    }
  },
  {
    id: 'freq_std_4',
    title: 'Εύρεση Συχνότητας που Λείπει',
    unit: 'μαθητές',
    generate: () => {
      const f1 = randInt(4, 7);
      const f2 = randInt(8, 12);
      const f3 = randInt(3, 6);
      const total = 25;
      const f4 = total - f1 - f2 - f3;
      return {
        prompt: `Στον παρακάτω πίνακα κατανομής 25 μαθητών, λείπει η συχνότητα του Βαθμού 10. Ποια είναι η τιμή του x;`,
        table: {
          headers: ['Βαθμός', 'Συχνότητα (ν)'],
          rows: [
            ['Βαθμός 7', f1],
            ['Βαθμός 8', f2],
            ['Βαθμός 9', f3],
            ['Βαθμός 10', 'x']
          ],
          totalRow: ['ΣΥΝΟΛΟ', 25]
        },
        unit: 'μαθητές',
        correctVal: String(f4),
        correctText: `${f4} μαθητές`,
        tableData: [
          { item: 'Γνωστές συχνότητες', formula: `${f1} ＋ ${f2} ＋ ${f3}`, val: `${f1 + f2 + f3}` },
          { item: 'Σύνολο μαθητών', formula: '25', val: '25' },
          { item: 'Άγνωστη συχνότητα (x)', formula: `25 － ${f1 + f2 + f3}`, val: `${f4}` }
        ],
        explain: `Το άθροισμα όλων των συχνοτήτων ισούται με 25: x ＝ 25 － (${f1} ＋ ${f2} ＋ ${f3}) ＝ 25 － ${f1 + f2 + f3} ＝ ${f4}.`,
        distractors: [`${f4 + 2} μαθητές`, `${Math.max(1, f4 - 2)} μαθητές`, `${f4 + 4} μαθητές`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'freq_hard_1',
    title: 'Ποσοστό Μαθητών με Υψηλή Βαθμολογία',
    unit: '%',
    generate: () => {
      return {
        prompt: 'Στον παρακάτω πίνακα βαθμολογιών 28 μαθητών, ποιο ποσοστό (%) των μαθητών συγκέντρωσε βαθμό τουλάχιστον 9 (δηλαδή 9 ή 10);',
        table: {
          headers: ['Βαθμός', 'Συχνότητα (ν)'],
          rows: [
            ['Βαθμός 7', 4],
            ['Βαθμός 8', 8],
            ['Βαθμός 9', 10],
            ['Βαθμός 10', 6]
          ],
          totalRow: ['ΣΥΝΟΛΟ', 28]
        },
        unit: '%',
        correctVal: '57,1',
        correctText: '57,1 %',
        tableData: [
          { item: 'Μαθητές με 9 ή 10', formula: '10 ＋ 6', val: '16 μαθητές' },
          { item: 'Σύνολο μαθητών', formula: '28', val: '28' },
          { item: 'Ποσοστό (%)', formula: '(16 : 28) · 100', val: '57,1 %' }
        ],
        explain: 'Μαθητές με βαθμό τουλάχιστον 9: 10 (με 9) ＋ 6 (με 10) ＝ 16 μαθητές. Ποσοστό: (16 : 28) · 100 ＝ 57,1 %.',
        distractors: ['50 %', '60 %', '53,5 %']
      };
    }
  },
  {
    id: 'freq_hard_2',
    title: 'Υπολογισμός Συνολικών Αδερφών',
    unit: 'αδέρφια',
    generate: () => {
      return {
        prompt: 'Σε μια τάξη καταγράφηκε ο αριθμός αδερφών κάθε μαθητή: 6 μαθητές έχουν 1 αδερφό, 10 μαθητές έχουν 2 αδέρφια και 4 μαθητές έχουν 3 αδέρφια. Πόσα είναι συνολικά τα αδέρφια όλων των μαθητών μαζί;',
        table: {
          headers: ['Αδέρφια', 'Μαθητές (ν)'],
          rows: [
            ['1 αδερφός', 6],
            ['2 αδέρφια', 10],
            ['3 αδέρφια', 4]
          ]
        },
        unit: 'αδέρφια',
        correctVal: '38',
        correctText: '38 αδέρφια',
        tableData: [
          { item: 'Μαθητές με 1 αδερφό', formula: '1 · 6', val: '6 αδέρφια' },
          { item: 'Μαθητές με 2 αδέρφια', formula: '2 · 10', val: '20 αδέρφια' },
          { item: 'Μαθητές με 3 αδέρφια', formula: '3 · 4', val: '12 αδέρφια' },
          { item: 'Συνολικό άθροισμα', formula: '6 ＋ 20 ＋ 12', val: '38 αδέρφια' }
        ],
        explain: '(1 · 6) ＋ (2 · 10) ＋ (3 · 4) ＝ 6 ＋ 20 ＋ 12 ＝ 38 αδέρφια συνολικά.',
        distractors: ['32 αδέρφια', '40 αδέρφια', '36 αδέρφια']
      };
    }
  },
  {
    id: 'freq_hard_3',
    title: 'Διαφορά Ποσοστιαίων Μονάδων Κατηγοριών',
    unit: '%',
    generate: () => {
      return {
        prompt: 'Στον παρακάτω πίνακα 40 μαθητών, κατά πόσες ποσοστιαίες μονάδες (%) υπερέχει η Κατηγορία Β σε σχέση με την Κατηγορία Α;',
        table: {
          headers: ['Κατηγορία', 'Συχνότητα (ν)'],
          rows: [
            ['Κατηγορία Α', 12],
            ['Κατηγορία Β', 18],
            ['Κατηγορία Γ', 10]
          ],
          totalRow: ['ΣΥΝΟΛΟ', 40]
        },
        unit: '%',
        correctVal: '15',
        correctText: '15 %',
        tableData: [
          { item: 'Ποσοστό Κατηγορίας Β', formula: '(18 : 40) · 100', val: '45 %' },
          { item: 'Ποσοστό Κατηγορίας Α', formula: '(12 : 40) · 100', val: '30 %' },
          { item: 'Διαφορά ποσοστών', formula: '45 % － 30 %', val: '15 %' }
        ],
        explain: 'Κατηγορία Β: (18 : 40) · 100 ＝ 45 %. Κατηγορία Α: (12 : 40) · 100 ＝ 30 %. Διαφορά: 45 % － 30 % ＝ 15 %.',
        distractors: ['10 %', '20 %', '12 %']
      };
    }
  },
  {
    id: 'freq_hard_4',
    title: 'Εύρεση Συχνότητας από Ποσοστό 100 Ατόμων',
    unit: 'καταναλωτές',
    generate: () => {
      return {
        prompt: 'Σε έρευνα 100 καταναλωτών, οι προτιμήσεις σε 4 προϊόντα καταγράφηκαν στον πίνακα. Πόσοι καταναλωτές επέλεξαν το Προϊόν Γ;',
        table: {
          headers: ['Προϊόν', 'Συχνότητα', 'Ποσοστό (%)'],
          rows: [
            ['Προϊόν Α', 15, '15 %'],
            ['Προϊόν Β', 25, '25 %'],
            ['Προϊόν Γ', 'x', '35 %'],
            ['Προϊόν Δ', 25, '25 %']
          ],
          totalRow: ['ΣΥΝΟΛΟ', 100, '100 %']
        },
        unit: 'καταναλωτές',
        correctVal: '35',
        correctText: '35 καταναλωτές',
        tableData: [
          { item: 'Ποσοστό Προϊόντος Γ', formula: '35 %', val: '35 %' },
          { item: 'Συνολικό δείγμα', formula: '100 άτομα', val: '100' },
          { item: 'Απόλυτη συχνότητα', formula: '(100 · 35) : 100', val: '35' }
        ],
        explain: 'Εφόσον το ποσοστό είναι 35 % σε σύνολο 100 καταναλωτών, η συχνότητά του είναι απευθείας 35.',
        distractors: ['30 καταναλωτές', '40 καταναλωτές', '25 καταναλωτές']
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Σύνολο συχνοτήτων
  const q1FA = randInt(4, 7);
  const q1FB = randInt(8, 12);
  const q1FC = randInt(3, 6);
  const q1FD = randInt(5, 9);
  const q1Sum = q1FA + q1FB + q1FC + q1FD;

  // Q2: MCQ - Ορισμός επικρατούσας τιμής
  const q2Correct = 'Η τιμή της μεταβλητής που εμφανίζεται με τη μεγαλύτερη συχνότητα';
  const q2Options = shuffle([
    q2Correct,
    'Το άθροισμα όλων των συχνοτήτων διαιρεμένο με το 2',
    'Η διαφορά ανάμεσα στη μέγιστη και την ελάχιστη τιμή',
    'Η τιμή που εμφανίζεται ακριβώς μία φορά'
  ]);

  // Q3: Input - Σχετική συχνότητα
  const q3Total = 20;
  const q3Freq = pickRandom([4, 5, 8, 10]);
  const q3Rel = q3Freq / q3Total;

  // Q4: MCQ - Ιδιότητα σχετικών συχνοτήτων
  const q4Correct = 'Είναι πάντοτε ίσο με 1 (ή 100 %)';
  const q4Options = shuffle([
    q4Correct,
    'Είναι ίσο με το συνολικό πλήθος των μαθητών',
    'Είναι πάντοτε ίσο με 0',
    'Αλλάζει ανάλογα με τον αριθμό των κατηγοριών'
  ]);

  // Q5: Input - Εύρεση άγνωστης συχνότητας
  const q5F1 = randInt(5, 8);
  const q5F2 = randInt(7, 10);
  const q5F3 = randInt(3, 6);
  const q5Total = 30;
  const q5Missing = q5Total - q5F1 - q5F2 - q5F3;

  // Q6: MCQ - Η έννοια του εύρους
  const q6Correct = 'Η διαφορά μεταξύ της μεγαλύτερης και της μικρότερης τιμής των δεδομένων';
  const q6Options = shuffle([
    q6Correct,
    'Το άθροισμα της μεγαλύτερης και της μικρότερης τιμής',
    'Ο αριθμός των γραμμών του πίνακα συχνοτήτων',
    'Το ποσοστό της πρώτης κατηγορίας'
  ]);

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate();

  // Q8: Standard Problem (MCQ)
  let spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  while (spIndex2 === spIndex1) spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q8Data = STANDARD_PROBLEMS_POOL[spIndex2].generate();
  const q8Options = shuffle([
    ...new Set([
      q8Data.correctText,
      ...q8Data.distractors
    ])
  ]);

  // Q9: Hard Problem (Input)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate();

  // Q10: Hard Problem (MCQ)
  let hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  while (hpIndex2 === hpIndex1) hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hpIndex2].generate();
  const q10Options = shuffle([
    ...new Set([
      q10Data.correctText,
      ...q10Data.distractors
    ])
  ]);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: 'Σύνολο Συχνοτήτων',
      prompt: 'Πόσες ήταν συνολικά οι παρατηρήσεις που καταγράφηκαν στον παρακάτω πίνακα συχνοτήτων;',
      table: {
        headers: ['Ομάδα', 'Συχνότητα (ν)'],
        rows: [
          ['Ομάδα Α', q1FA],
          ['Ομάδα Β', q1FB],
          ['Ομάδα Γ', q1FC],
          ['Ομάδα Δ', q1FD]
        ]
      },
      correct: String(q1Sum),
      explain: `Αθροίζουμε όλες τις συχνότητες: ${q1FA} ＋ ${q1FB} ＋ ${q1FC} ＋ ${q1FD} ＝ ${q1Sum}.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Η Έννοια της Επικρατούσας Τιμής',
      prompt: 'Τι ονομάζουμε «επικρατούσα τιμή» (ή mode) σε έναν πίνακα συχνοτήτων;',
      options: q2Options,
      correct: q2Correct,
      explain: 'Επικρατούσα τιμή (mode) είναι η τιμή ή κατηγορία που παρουσιάζει τη μεγαλύτερη συχνότητα εμφάνισης.'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: 'Σχετική Συχνότητα',
      prompt: 'Στον παρακάτω πίνακα 20 μαθητών, ποια είναι η σχετική συχνότητα της Κατηγορίας Α σε δεκαδική μορφή;',
      table: {
        headers: ['Κατηγορία', 'Συχνότητα', 'Σχετική Συχνότητα'],
        rows: [
          ['Κατηγορία Α', q3Freq, 'x'],
          ['Άλλες', q3Total - q3Freq, formatNum((q3Total - q3Freq) / q3Total, 2)]
        ],
        totalRow: ['ΣΥΝΟΛΟ', q3Total, '1,00']
      },
      correct: formatNum(q3Rel, 2),
      explain: `Σχετική συχνότητα ＝ Συχνότητα : Σύνολο ＝ ${q3Freq} : 20 ＝ ${formatNum(q3Rel, 2)}.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Ιδιότητα Σχετικών Συχνοτήτων',
      prompt: 'Σε έναν πλήρη πίνακα κατανομής συχνοτήτων, τι ισχύει για το άθροισμα όλων των σχετικών συχνοτήτων;',
      options: q4Options,
      correct: q4Correct,
      explain: 'Επειδή οι σχετικές συχνότητες εκφράζουν τα κλασματικά μέρη του όλου, το άθροισμά τους ισούται πάντα με 1 (ή 100%).'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Εύρεση Άγνωστης Συχνότητας',
      prompt: 'Σε ένα σύνολο 30 μαθητών, ποια είναι η συχνότητα x της Ομάδας Δ που λείπει από τον πίνακα;',
      table: {
        headers: ['Ομάδα', 'Συχνότητα (ν)'],
        rows: [
          ['Ομάδα Α', q5F1],
          ['Ομάδα Β', q5F2],
          ['Ομάδα Γ', q5F3],
          ['Ομάδα Δ', 'x']
        ],
        totalRow: ['ΣΥΝΟΛΟ', 30]
      },
      correct: String(q5Missing),
      explain: `x ＝ 30 － (${q5F1} ＋ ${q5F2} ＋ ${q5F3}) ＝ 30 － ${q5F1 + q5F2 + q5F3} ＝ ${q5Missing}.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Η Έννοια του Εύρους',
      prompt: 'Τι ονομάζουμε «εύρος» μιας σειράς αριθμητικών παρατηρήσεων στη Στατιστική;',
      options: q6Options,
      correct: q6Correct,
      explain: 'Εύρος ονομάζεται η διαφορά ανάμεσα στη μέγιστη και την ελάχιστη παρατήρηση (Εύρος ＝ Μέγιστη τιμή － Ελάχιστη τιμή).'
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: `Πρόβλημα: ${q7Data.title}`,
      prompt: q7Data.prompt,
      table: q7Data.table,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: `Πρόβλημα: ${q8Data.title}`,
      prompt: q8Data.prompt,
      table: q8Data.table,
      options: q8Options,
      correct: q8Data.correctText,
      tableData: q8Data.tableData,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'input',
      inputType: 'decimal',
      title: `Σύνθετο Πρόβλημα: ${q9Data.title}`,
      prompt: q9Data.prompt,
      table: q9Data.table,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `Σύνθετο Πρόβλημα: ${q10Data.title}`,
      prompt: q10Data.prompt,
      table: q10Data.table,
      options: q10Options,
      correct: q10Data.correctText,
      tableData: q10Data.tableData,
      explain: q10Data.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function PinakasSixnotitonExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions();
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach(q => {
      initialAnswers[q.id] = '';
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

  // Χειρισμός απαντήσεων: sanitize για inputs, αυτούσιο για mcq
  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      const q = questions.find(item => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        sanitized = sanitized.replace(/\./g, ',').replace(/[^0-9,]/g, '');
        const parts = sanitized.split(',');
        if (parts.length > 2) sanitized = parts[0] + ',' + parts.slice(1).join('');
      }
      if (sanitized.length > 10) {
        sanitized = sanitized.slice(0, 10);
      }
      setAnswers(prev => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers(prev => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/[%€]/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/[%€]/g, '').trim().toLowerCase();

      if (cleanUser === cleanTarget) return true;

      if (q.inputType === 'decimal') {
        const numUser = parseFloat(cleanUser.replace(',', '.'));
        const numTarget = parseFloat(cleanTarget.replace(',', '.'));
        return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) < 0.05;
      }
      return false;
    }
    if (q.type === 'mcq') {
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

  const answeredCount = Object.values(answers).filter(val => val !== undefined && val !== null && String(val).trim() !== '').length;

  return (
    <Layout
      title="Ασκήσεις: Πίνακας Συχνοτήτων & Ταξινόμηση Δεδομένων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στην ταξινόμηση δεδομένων, στους πίνακες κατανομής συχνοτήτων και στις σχετικές συχνότητες για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/56-pinakas-sixnotiton"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase('Θεωρία')}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>ΚΕΦΑΛΑΙΟ 56 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Πίνακας Συχνοτήτων &amp; Ταξινόμηση Δεδομένων
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη συμπλήρωση πινάκων κατανομής συχνοτήτων, στον υπολογισμό σχετικών συχνοτήτων και στην επικρατούσα τιμή (mode)!
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
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-3">
                      {q.prompt}
                    </p>

                    {/* ΠΙΝΑΚΑΣ ΣΥΧΝΟΤΗΤΩΝ (ΑΝ ΥΠΑΡΧΕΙ ΩΣ ΔΕΔΟΜΕΝΟ) */}
                    {q.table && (
                      <ExerciseFrequencyTable
                        headers={q.table.headers}
                        rows={q.table.rows}
                        totalRow={q.table.totalRow}
                      />
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
                              onClick={() => handleAnswerChange(q.id, opt, 'mcq')}
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
                          inputMode={q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={q.inputType === 'decimal' ? 'π.χ. 0,25' : 'Απάντηση...'}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                      {q.tableData && (
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
              <span>{submitted ? toCleanUppercase('Σκορ') : toCleanUppercase('Απαντήθηκαν')}:</span>
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

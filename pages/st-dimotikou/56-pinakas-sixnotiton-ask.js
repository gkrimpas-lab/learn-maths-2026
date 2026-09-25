// pages/st-dimotikou/56-pinakas-sixnotiton-ask.js
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

// Μορφοποιηση αριθμου
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Βοηθητικο component πινακα συχνοτητων - ΠΛΗΡΩΣ ΑΝΑΓΝΩΣΙΜΟ ΣΤΑ ΚΙΝΗΤΑ
function ExerciseFrequencyTable({ headers, rows, totalRow }) {
  const colCount = headers.length;
  const firstColWidth = colCount === 2 ? 'w-[58%]' : colCount === 3 ? 'w-[42%]' : 'w-[34%]';
  const otherColWidth = colCount === 2 ? 'w-[42%]' : colCount === 3 ? 'w-[29%]' : 'w-[22%]';

  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-2.5 sm:p-3.5 my-3 w-full max-w-lg shadow-inner">
      <div className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-1.5">
        ΠΙΝΑΚΑΣ ΚΑΤΑΝΟΜΗΣ ΣΥΧΝΟΤΗΤΩΝ
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
                  } ${cell === 'χ' || cell === '?' ? 'text-amber-600 font-black text-sm sm:text-base' : ''}`}
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

// Δεξαμενη Κανονικων Προβληματων Πινακα Συχνοτητων
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'freq_std_1',
    generate: () => {
      const f10 = randInt(5, 8);
      const f9 = randInt(8, 12);
      const f8 = randInt(4, 7);
      const f7 = randInt(2, 5);
      const total = f10 + f9 + f8 + f7;
      return {
        text: `Στον παρακάτω πίνακα συχνοτήτων καταγράφηκαν οι βαθμολογίες των μαθητών σε ένα τεστ. Πόσοι μαθητές έγραψαν συνολικά στο τεστ;`,
        table: {
          headers: ['Βαθμός', 'Συχνότητα (ν)'],
          rows: [
            ['Βαθμός 10', f10],
            ['Βαθμός 9', f9],
            ['Βαθμός 8', f8],
            ['Βαθμός 7', f7]
          ]
        },
        correctVal: total,
        correctStr: String(total),
        unit: 'μαθητές',
        explanation: `Αθροίζουμε όλες τις συχνότητες του πίνακα: ${f10} ＋ ${f9} ＋ ${f8} ＋ ${f7} ＝ ${total} μαθητές.`
      };
    }
  },
  {
    id: 'freq_std_2',
    generate: () => {
      const fA = randInt(6, 10);
      const fB = randInt(12, 18);
      const fC = randInt(4, 8);
      return {
        text: `Παρατηρήστε τον πίνακα προτιμήσεων για τρία βιβλία. Ποιο είναι το βιβλίο με τη μεγαλύτερη συχνότητα (επικρατούσα κατηγορία / mode);`,
        table: {
          headers: ['Βιβλίο', 'Αναγνώστες (ν)'],
          rows: [
            ['Περιπέτεια', fA],
            ['Επιστημονική Φαντασία', fB],
            ['Ιστορικό', fC]
          ]
        },
        correctText: 'Επιστημονική Φαντασία',
        options: [
          { text: 'Επιστημονική Φαντασία', isCorrect: true },
          { text: 'Περιπέτεια', isCorrect: false },
          { text: 'Ιστορικό', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        unit: '',
        explanation: `Η επικρατούσα κατηγορία είναι εκείνη με τη μεγαλύτερη συχνότητα. Εδώ είναι η «Επιστημονική Φαντασία» με ${fB} αναγνώστες.`
      };
    }
  },
  {
    id: 'freq_std_3',
    generate: () => {
      const total = 50;
      const freq = pickRandom([10, 15, 20, 25]);
      const relFreq = freq / total;
      return {
        text: `Σε έρευνα 50 ατόμων, ένα συγκεκριμένο άθλημα επιλέχθηκε από ${freq} άτομα. Ποια είναι η σχετική συχνότητα της επιλογής αυτής σε δεκαδική μορφή;`,
        table: {
          headers: ['Άθλημα', 'Συχνότητα', 'Σχετική Συχνότητα'],
          rows: [
            ['Κολύμβηση', freq, 'χ']
          ],
          totalRow: ['ΣΥΝΟΛΟ', 50, '1,00']
        },
        correctVal: relFreq,
        correctStr: formatNum(relFreq, 2),
        unit: '',
        explanation: `Η σχετική συχνότητα ισούται με τη συχνότητα διά το σύνολο: ${freq} : 50 ＝ ${formatNum(relFreq, 2)}.`
      };
    }
  },
  {
    id: 'freq_std_4',
    generate: () => {
      const f1 = randInt(4, 7);
      const f2 = randInt(8, 12);
      const f3 = randInt(3, 6);
      const total = 25;
      const f4 = total - f1 - f2 - f3;
      return {
        text: `Στον παρακάτω πίνακα κατανομής 25 μαθητών, λείπει η συχνότητα του Βαθμού 10. Ποια είναι η τιμή του χ;`,
        table: {
          headers: ['Βαθμός', 'Συχνότητα (ν)'],
          rows: [
            ['Βαθμός 7', f1],
            ['Βαθμός 8', f2],
            ['Βαθμός 9', f3],
            ['Βαθμός 10', 'χ']
          ],
          totalRow: ['ΣΥΝΟΛΟ', 25]
        },
        correctVal: f4,
        correctStr: String(f4),
        unit: 'μαθητές',
        explanation: `Το άθροισμα όλων των συχνοτήτων ισούται με 25: χ ＝ 25 － (${f1} ＋ ${f2} ＋ ${f3}) ＝ 25 － ${f1 + f2 + f3} ＝ ${f4}.`
      };
    }
  },
  {
    id: 'freq_std_5',
    generate: () => {
      return {
        text: `Σε έρευνα 40 μαθητών για το αγαπημένο τους χρώμα, 10 επέλεξαν το μπλε. Τι ποσοστό (%) των μαθητών αντιπροσωπεύει η συχνότητα αυτή;`,
        correctVal: 25,
        correctStr: '25',
        unit: '%',
        explanation: `Σχετική συχνότητα: 10/40 ＝ 0,25. Ποσοστό: 0,25 · 100 ＝ 25 %.`
      };
    }
  },
  {
    id: 'freq_std_6',
    generate: () => {
      return {
        text: `Σε έναν πίνακα βαθμολογιών, ο χαμηλότερος βαθμός ήταν 6 και ο υψηλότερος ήταν 10. Ποιο είναι το εύρος των βαθμολογιών (Μέγιστη － Ελάχιστη τιμή);`,
        correctVal: 4,
        correctStr: '4',
        unit: 'μονάδες',
        explanation: `Εύρος ＝ Μέγιστη τιμή － Ελάχιστη τιμή ＝ 10 － 6 ＝ 4.`
      };
    }
  },
  {
    id: 'freq_std_7',
    generate: () => {
      return {
        text: `Σε έναν πίνακα συχνοτήτων 20 οδηγών, 14 οδηγοί χρησιμοποιούν ζώνη ασφαλείας. Ποιο είναι το ποσοστό (%) των οδηγών που φορούν ζώνη;`,
        table: {
          headers: ['Χρήση Ζώνης', 'Συχνότητα', 'Ποσοστό (%)'],
          rows: [
            ['Όχι', 6, '30 %'],
            ['Ναι', 14, 'χ %']
          ],
          totalRow: ['ΣΥΝΟΛΟ', 20, '100 %']
        },
        correctVal: 70,
        correctStr: '70',
        unit: '%',
        explanation: `Ποσοστό ＝ (14 : 20) · 100 ＝ 0,70 · 100 ＝ 70 %.`
      };
    }
  },
  {
    id: 'freq_std_8',
    generate: () => {
      return {
        text: `Σε έναν πίνακα 30 παρατηρήσεων, η σχετική συχνότητα μιας κατηγορίας είναι 0,40. Ποια είναι η απόλυτη συχνότητα (ν) της κατηγορίας αυτής;`,
        correctVal: 12,
        correctStr: '12',
        unit: '',
        explanation: `Συχνότητα (ν) ＝ Σύνολο (Ν) · Σχετική Συχνότητα ＝ 30 · 0,40 ＝ 12.`
      };
    }
  },
  {
    id: 'freq_std_9',
    generate: () => {
      return {
        text: `Πόσο ισούται ΠΑΝΤΟΤΕ το άθροισμα όλων των σχετικών συχνοτήτων σε έναν πλήρη πίνακα κατανομής συχνοτήτων;`,
        options: [
          { text: '1 (ή 100 %)', isCorrect: true },
          { text: '0', isCorrect: false },
          { text: '10', isCorrect: false },
          { text: 'Εξαρτάται από το μέγεθος του δείγματος', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: '1 (ή 100 %)',
        unit: '',
        explanation: `Το άθροισμα όλων των σχετικών συχνοτήτων ισούται πάντοτε με 1 (ή 100%), καθώς περιλαμβάνει το σύνολο όλων των παρατηρήσεων.`
      };
    }
  },
  {
    id: 'freq_std_10',
    generate: () => {
      return {
        text: `Σε έναν πίνακα συχνοτήτων μελετήθηκαν οι επιλογές 25 παιδιών: Μπάσκετ 8, Ποδόσφαιρο 12, Τένις 5. Πόσα περισσότερα παιδιά προτιμούν το ποδόσφαιρο από το μπάσκετ;`,
        table: {
          headers: ['Άθλημα', 'Συχνότητα (ν)'],
          rows: [
            ['Μπάσκετ', 8],
            ['Ποδόσφαιρο', 12],
            ['Τένις', 5]
          ]
        },
        correctVal: 4,
        correctStr: '4',
        unit: 'παιδιά',
        explanation: `Διαφορά συχνοτήτων: 12 － 8 ＝ 4 παιδιά.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας
const HARD_PROBLEMS_POOL = [
  {
    id: 'freq_hard_1',
    generate: () => {
      return {
        text: `Στον παρακάτω πίνακα βαθμολογιών 28 μαθητών, ποιο ποσοστό (%) των μαθητών συγκέντρωσε βαθμό τουλάχιστον 9 (δηλαδή 9 ή 10);`,
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
        correctVal: 57.1,
        correctStr: '57,1',
        unit: '%',
        explanation: `Μαθητές με βαθμό τουλάχιστον 9: 10 (με 9) ＋ 6 (με 10) ＝ 16 μαθητές. Ποσοστό: (16 : 28) · 100 ＝ 57,1 %.`
      };
    }
  },
  {
    id: 'freq_hard_2',
    generate: () => {
      return {
        text: `Σε έρευνα 50 ατόμων για το μέσο μετακίνησης, καταγράφηκαν: Μετρό 15, Λεωφορείο 20, Αυτοκίνητο 10 και οι υπόλοιποι κινούνται με Ποδήλατο. Ποιο είναι το ποσοστό (%) των ατόμων που κινούνται με ποδήλατο;`,
        correctVal: 10,
        correctStr: '10',
        unit: '%',
        explanation: `Άτομα με ποδήλατο: 50 － (15 ＋ 20 ＋ 10) ＝ 5 άτομα. Ποσοστό: (5 : 50) · 100 ＝ 10 %.`
      };
    }
  },
  {
    id: 'freq_hard_3',
    generate: () => {
      return {
        text: `Στον παρακάτω πίνακα ωρών καθημερινής μελέτης 25 μαθητών, ποια είναι η επικρατούσα τιμή (mode);`,
        table: {
          headers: ['Ώρες Μελέτης', 'Μαθητές (ν)'],
          rows: [
            ['1 ώρα', 5],
            ['2 ώρες', 12],
            ['3 ώρες', 8]
          ],
          totalRow: ['ΣΥΝΟΛΟ', 25]
        },
        correctText: '2 ώρες',
        options: [
          { text: '2 ώρες', isCorrect: true },
          { text: '1 ώρα', isCorrect: false },
          { text: '3 ώρες', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        unit: '',
        explanation: `Η επικρατούσα τιμή είναι οι «2 ώρες», καθώς έχουν τη μεγαλύτερη συχνότητα (12 μαθητές).`
      };
    }
  },
  {
    id: 'freq_hard_4',
    generate: () => {
      return {
        text: `Σε μια τάξη καταγράφηκε ο αριθμός αδερφών κάθε μαθητή: 6 μαθητές έχουν 1 αδερφό, 10 μαθητές έχουν 2 αδέρφια και 4 μαθητές έχουν 3 αδέρφια. Πόσα είναι συνολικά τα αδέρφια όλων των μαθητών μαζί;`,
        table: {
          headers: ['Αδέρφια', 'Μαθητές (ν)'],
          rows: [
            ['1 αδερφός', 6],
            ['2 αδέρφια', 10],
            ['3 αδέρφια', 4]
          ]
        },
        correctVal: 38,
        correctStr: '38',
        unit: 'αδέρφια',
        explanation: `(1 · 6) ＋ (2 · 10) ＋ (3 · 4) ＝ 6 ＋ 20 ＋ 12 ＝ 38 αδέρφια συνολικά.`
      };
    }
  },
  {
    id: 'freq_hard_5',
    generate: () => {
      return {
        text: `Σε έρευνα 100 μαθητών, η σχετική συχνότητα του ποδοσφαίρου είναι 0,42 και του μπάσκετ 0,38. Οι υπόλοιποι μαθητές επέλεξαν βόλεϊ. Πόσοι μαθητές επέλεξαν βόλεϊ;`,
        correctVal: 20,
        correctStr: '20',
        unit: 'μαθητές',
        explanation: `Σχετική συχνότητα βόλεϊ: 1,00 － (0,42 ＋ 0,38) ＝ 0,20. Μαθητές βόλεϊ: 100 · 0,20 ＝ 20 μαθητές.`
      };
    }
  },
  {
    id: 'freq_hard_6',
    generate: () => {
      return {
        text: `Στον παρακάτω πίνακα 40 μετρήσεων, ποιο ποσοστό (%) αντιπροσωπεύει η επικρατούσα τιμή (mode);`,
        table: {
          headers: ['Κατηγορία', 'Συχνότητα (ν)'],
          rows: [
            ['Ομάδα Α', 8],
            ['Ομάδα Β', 16],
            ['Ομάδα Γ', 12],
            ['Ομάδα Δ', 4]
          ],
          totalRow: ['ΣΥΝΟΛΟ', 40]
        },
        correctVal: 40,
        correctStr: '40',
        unit: '%',
        explanation: `Η Επικρατούσα τιμή είναι η «Ομάδα Β» με συχνότητα 16. Ποσοστό: (16 : 40) · 100 ＝ 40 %.`
      };
    }
  },
  {
    id: 'freq_hard_7',
    generate: () => {
      return {
        text: `Στον πίνακα επιδόσεων ενός σχολικού μαραθωνίου, ο καλύτερος χρόνος ήταν 54 λεπτά και ο μεγαλύτερος χρόνος ήταν 98 λεπτά. Ποιο είναι το εύρος των χρόνων σε λεπτά;`,
        correctVal: 44,
        correctStr: '44',
        unit: 'λεπτά',
        explanation: `Εύρος ＝ 98 － 54 ＝ 44 λεπτά.`
      };
    }
  },
  {
    id: 'freq_hard_8',
    generate: () => {
      return {
        text: `Στον παρακάτω πίνακα 40 μαθητών, κατά πόσες ποσοστιαίες μονάδες (%) υπερέχει η Κατηγορία Β σε σχέση με την Κατηγορία Α;`,
        table: {
          headers: ['Κατηγορία', 'Συχνότητα (ν)'],
          rows: [
            ['Κατηγορία Α', 12],
            ['Κατηγορία Β', 18],
            ['Κατηγορία Γ', 10]
          ],
          totalRow: ['ΣΥΝΟΛΟ', 40]
        },
        correctVal: 15,
        correctStr: '15',
        unit: '%',
        explanation: `Κατηγορία Β: (18:40)·100 ＝ 45%. Κατηγορία Α: (12:40)·100 ＝ 30%. Διαφορά: 45% － 30% ＝ 15%.`
      };
    }
  },
  {
    id: 'freq_hard_9',
    generate: () => {
      return {
        text: `Σε έναν πίνακα συχνοτήτων 80 παρατηρήσεων, μια κατηγορία έχει συχνότητα 24. Ποια είναι η σχετική συχνότητα της κατηγορίας αυτής;`,
        correctVal: 0.3,
        correctStr: '0,30',
        unit: '',
        explanation: `Σχετική συχνότητα ＝ 24 : 80 ＝ 0,30.`
      };
    }
  },
  {
    id: 'freq_hard_10',
    generate: () => {
      return {
        text: `Σε έρευνα 100 καταναλωτών, οι προτιμήσεις σε 4 προϊόντα καταγράφηκαν στον πίνακα. Πόσοι καταναλωτές επέλεξαν το Προϊόν Γ;`,
        table: {
          headers: ['Προϊόν', 'Συχνότητα', 'Ποσοστό (%)'],
          rows: [
            ['Προϊόν Α', 15, '15 %'],
            ['Προϊόν Β', 25, '25 %'],
            ['Προϊόν Γ', 'χ', '35 %'],
            ['Προϊόν Δ', 25, '25 %']
          ],
          totalRow: ['ΣΥΝΟΛΟ', 100, '100 %']
        },
        correctVal: 35,
        correctStr: '35',
        unit: 'καταναλωτές',
        explanation: `Εφόσον το ποσοστό είναι 35% σε σύνολο 100 καταναλωτών, η συχνότητά του είναι απευθείας 35.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal)
  {
    const fA = randInt(4, 7);
    const fB = randInt(8, 12);
    const fC = randInt(3, 6);
    const fD = randInt(5, 9);
    const sum = fA + fB + fC + fD;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΣΥΝΟΛΟ ΣΥΧΝΟΤΗΤΩΝ',
      instruction: 'Παρατηρήστε τον πίνακα και υπολογίστε το συνολικό μέγεθος του δείγματος (Ν):',
      prompt: `Πόσες ήταν συνολικά οι παρατηρήσεις που καταγράφηκαν στον παρακάτω πίνακα συχνοτήτων;`,
      table: {
        headers: ['Ομάδα', 'Συχνότητα (ν)'],
        rows: [
          ['Ομάδα Α', fA],
          ['Ομάδα Β', fB],
          ['Ομάδα Γ', fC],
          ['Ομάδα Δ', fD]
        ]
      },
      correctVal: sum,
      correctStr: String(sum),
      explanation: `Αθροίζουμε όλες τις συχνότητες: ${fA} ＋ ${fB} ＋ ${fC} ＋ ${fD} ＝ ${sum}.`
    });
  }

  // Q2 (MCQ)
  {
    const correctDef = 'Η τιμή της μεταβλητής που εμφανίζεται με τη μεγαλύτερη συχνότητα';
    const options = [
      { text: correctDef, isCorrect: true },
      { text: 'Το άθροισμα όλων των συχνοτήτων διαιρεμένο με το 2', isCorrect: false },
      { text: 'Η διαφορά ανάμεσα στη μέγιστη και την ελάχιστη τιμή', isCorrect: false },
      { text: 'Η τιμή που εμφανίζεται ακριβώς μία φορά', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • Η ΕΝΝΟΙΑ ΤΗΣ ΕΠΙΚΡΑΤΟΥΣΑΣ ΤΙΜΗΣ',
      instruction: 'Επιλέξτε τον σωστό στατιστικό ορισμό:',
      prompt: `Τι ονομάζουμε «επικρατούσα τιμή» (ή mode) σε έναν πίνακα συχνοτήτων;`,
      options,
      correctText: correctDef,
      explanation: `Επικρατούσα τιμή (mode) είναι η τιμή ή κατηγορία που παρουσιάζει τη μεγαλύτερη συχνότητα εμφάνισης.`
    });
  }

  // Q3 (Input - Decimal)
  {
    const total = 20;
    const freq = pickRandom([4, 5, 8, 10]);
    const rel = freq / total;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΣΧΕΤΙΚΗ ΣΥΧΝΟΤΗΤΑ',
      instruction: 'Υπολογίστε τη σχετική συχνότητα σε δεκαδική μορφή:',
      prompt: `Στον παρακάτω πίνακα 20 μαθητών, ποια είναι η σχετική συχνότητα της Κατηγορίας Α;`,
      table: {
        headers: ['Κατηγορία', 'Συχνότητα', 'Σχετική Συχνότητα'],
        rows: [
          ['Κατηγορία Α', freq, 'χ'],
          ['Άλλες', total - freq, formatNum((total - freq) / total, 2)]
        ],
        totalRow: ['ΣΥΝΟΛΟ', total, '1,00']
      },
      correctVal: rel,
      correctStr: formatNum(rel, 2),
      explanation: `Σχετική συχνότητα ＝ Συχνότητα : Σύνολο ＝ ${freq} : 20 ＝ ${formatNum(rel, 2)}.`
    });
  }

  // Q4 (MCQ)
  {
    const correctSum = 'Είναι πάντοτε ίσο με 1 (ή 100 %)';
    const options = [
      { text: correctSum, isCorrect: true },
      { text: 'Είναι ίσο με το συνολικό πλήθος των μαθητών', isCorrect: false },
      { text: 'Είναι πάντοτε ίσο με 0', isCorrect: false },
      { text: 'Αλλάζει ανάλογα με τον αριθμό των κατηγοριών', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΙΔΙΟΤΗΤΑ ΣΧΕΤΙΚΩΝ ΣΥΧΝΟΤΗΤΩΝ',
      instruction: 'Επιλέξτε τη σωστή πρόταση:',
      prompt: `Σε έναν πλήρη πίνακα κατανομής συχνοτήτων, τι ισχύει για το άθροισμα όλων των σχετικών συχνοτήτων;`,
      options,
      correctText: correctSum,
      explanation: `Επειδή οι σχετικές συχνότητες εκφράζουν τα κλασματικά μέρη του όλου, το άθροισμά τους ισούται πάντα με 1 (ή 100%).`
    });
  }

  // Q5 (Input - Decimal)
  {
    const f1 = randInt(5, 8);
    const f2 = randInt(7, 10);
    const f3 = randInt(3, 6);
    const total = 30;
    const fMissing = total - f1 - f2 - f3;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΕΥΡΕΣΗ ΑΓΝΩΣΤΗΣ ΣΥΧΝΟΤΗΤΑΣ',
      instruction: 'Παρατηρήστε τον πίνακα και βρείτε τη συχνότητα χ που λείπει:',
      prompt: `Σε ένα σύνολο 30 μαθητών, ποια είναι η συχνότητα χ της Ομάδας Δ;`,
      table: {
        headers: ['Ομάδα', 'Συχνότητα (ν)'],
        rows: [
          ['Ομάδα Α', f1],
          ['Ομάδα Β', f2],
          ['Ομάδα Γ', f3],
          ['Ομάδα Δ', 'χ']
        ],
        totalRow: ['ΣΥΝΟΛΟ', 30]
      },
      correctVal: fMissing,
      correctStr: String(fMissing),
      explanation: `χ ＝ 30 － (${f1} ＋ ${f2} ＋ ${f3}) ＝ 30 － ${f1 + f2 + f3} ＝ ${fMissing}.`
    });
  }

  // Q6 (MCQ)
  {
    const correctRange = 'Η διαφορά μεταξύ της μεγαλύτερης και της μικρότερης τιμής των δεδομένων';
    const options = [
      { text: correctRange, isCorrect: true },
      { text: 'Το άθροισμα της μεγαλύτερης και της μικρότερης τιμής', isCorrect: false },
      { text: 'Ο αριθμός των γραμμών του πίνακα συχνοτήτων', isCorrect: false },
      { text: 'Το ποσοστό της πρώτης κατηγορίας', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • Η ΕΝΝΟΙΑ ΤΟΥ ΕΥΡΟΥΣ',
      instruction: 'Επιλέξτε τον σωστό ορισμό:',
      prompt: `Τι ονομάζουμε «εύρος» μιας σειράς αριθμητικών παρατηρήσεων στη Στατιστική;`,
      options,
      correctText: correctRange,
      explanation: `Εύρος ονομάζεται η διαφορά ανάμεσα στη μέγιστη και την ελάχιστη παρατήρηση (Εύρος ＝ Μέγιστη τιμή － Ελάχιστη τιμή).`
    });
  }

  // Q7 & Q8: Κανονικά Προβλήματα από τη δεξαμενή
  {
    const shuffledStd = [...STANDARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const stdProb1 = shuffledStd[0].generate();
    const stdProb2 = shuffledStd[1].generate();

    // Q7 (Input - Decimal)
    qList.push({
      id: 7,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΠΙΝΑΚΑ ΣΥΧΝΟΤΗΤΩΝ',
      instruction: 'Παρατηρήστε τα δεδομένα και υπολογίστε το τελικό αποτέλεσμα:',
      prompt: stdProb1.text,
      table: stdProb1.table,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal !== undefined ? stdProb2.correctVal : stdProb2.correctText;
    const unit8 = stdProb2.unit === '%' ? ' %' : (stdProb2.unit ? ` ${stdProb2.unit}` : '');

    let optionsQ8 = stdProb2.options;
    if (!optionsQ8 && typeof val8 === 'number') {
      const fake8A = formatNum(val8 + randInt(3, 8));
      const fake8B = formatNum(Math.max(1, val8 - randInt(2, 5)));
      const fake8C = formatNum(val8 * 1.5);
      optionsQ8 = [
        { text: `${stdProb2.correctStr}${unit8}`, isCorrect: true },
        { text: `${fake8A}${unit8}`, isCorrect: false },
        { text: `${fake8B}${unit8}`, isCorrect: false },
        { text: `${fake8C}${unit8}`, isCorrect: false }
      ].sort(() => Math.random() - 0.5);
    }

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΕΞΑΓΩΓΗ ΣΤΑΤΙΣΤΙΚΟΥ ΣΥΜΠΕΡΑΣΜΑΤΟΣ',
      instruction: 'Επιλέξτε τη σωστή τιμή:',
      prompt: stdProb2.text,
      table: stdProb2.table,
      options: optionsQ8,
      correctText: stdProb2.correctText || `${stdProb2.correctStr}${unit8}`,
      explanation: stdProb2.explanation
    });
  }

  // Q9 & Q10: Προβλήματα Αυξημένης Δυσκολίας με Πίνακες
  {
    const shuffledHard = [...HARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const hardProb1 = shuffledHard[0].generate();
    const hardProb2 = shuffledHard[1].generate();

    // Q9 (Input - Decimal)
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΠΟΣΟΣΤΙΑΙΑΣ ΚΑΤΑΝΟΜΗΣ',
      instruction: 'Παρατηρήστε τον πίνακα και υπολογίστε με ακρίβεια το αποτέλεσμα:',
      prompt: hardProb1.text,
      table: hardProb1.table,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας)
    const val10 = hardProb2.correctVal !== undefined ? hardProb2.correctVal : hardProb2.correctText;
    const isPercentageQuestion = hardProb2.unit === '%';
    const unitSuffix = isPercentageQuestion ? ' %' : (hardProb2.unit ? ` ${hardProb2.unit}` : '');

    let optionsQ10 = hardProb2.options;
    if (!optionsQ10 && typeof val10 === 'number') {
      const fake10A = formatNum(val10 + randInt(4, 10));
      const fake10B = formatNum(Math.max(1, val10 - randInt(3, 8)));
      const fake10C = formatNum(val10 * 1.3);
      optionsQ10 = [
        { text: `${hardProb2.correctStr}${unitSuffix}`, isCorrect: true },
        { text: `${fake10A}${unitSuffix}`, isCorrect: false },
        { text: `${fake10B}${unitSuffix}`, isCorrect: false },
        { text: `${fake10C}${unitSuffix}`, isCorrect: false }
      ].sort(() => Math.random() - 0.5);
    }

    qList.push({
      id: 10,
      type: 'mcq',
      title: isPercentageQuestion
        ? 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΣΤΑΤΙΣΤΙΚΗΣ & ΠΟΣΟΣΤΩΝ'
        : 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΣΤΑΤΙΣΤΙΚΗΣ ΑΝΑΛΥΣΗΣ',
      instruction: 'Παρατηρήστε τον πίνακα και επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      table: hardProb2.table,
      options: optionsQ10,
      correctText: hardProb2.correctText || `${hardProb2.correctStr}${unitSuffix}`,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function PinakasSixnotitonExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

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

  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

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
      title="Ασκήσεις: Πίνακας Συχνοτήτων & Ταξινόμηση Δεδομένων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στην ταξινόμηση δεδομένων, τη συμπλήρωση πινάκων κατανομής συχνοτήτων, τις σχετικές συχνότητες και την επικρατούσα τιμή για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/56-pinakas-sixnotiton"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 pb-32 overflow-x-hidden">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-14 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ασκήσεις: Πίνακας Συχνοτήτων &amp; Ταξινόμηση Δεδομένων
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με οπτικούς πίνακες συχνοτήτων και 4 ρεαλιστικά προβλήματα. Υπολογίστε σχετικές συχνότητες, ποσοστά (%), αθροίσματα και εντοπίστε την επικρατούσα τιμή (mode).
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους και πίνακες.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 sm:px-4 py-2 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm"
            >
              <span>🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>
          </div>
        </section>

        {/* Λιστα 10 Ασκησεων */}
        <div className="space-y-6">
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
                className={`bg-white rounded-3xl border p-4 sm:p-7 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλιδα Ερωτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
                  <span className="text-xs font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {toCleanUppercase(q.title)}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
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
                <div className="space-y-2 mb-2">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm font-semibold text-slate-500">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-sm sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>
                </div>

                {/* ΟΠΤΙΚΟΣ ΠΙΝΑΚΑΣ ΣΥΧΝΟΤΗΤΩΝ (ΑΝ ΥΠΑΡΧΕΙ) */}
                {q.table && (
                  <ExerciseFrequencyTable
                    headers={q.table.headers}
                    rows={q.table.rows}
                    totalRow={q.table.totalRow}
                  />
                )}

                {/* Περιοχη Απαντησης */}
                <div className="py-2 pt-2.5">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-32 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs text-slate-500">
                        (Ακέραιος η δεκαδικός με κόμμα)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) - ΠΛΗΡΕΣ ΚΕΙΜΕΝΟ ΧΩΡΙΣ TRUNCATE / ΑΠΟΣΙΩΠΗΤΙΚΑ */}
                  {q.type === 'mcq' && (
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-3xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 sm:p-4 rounded-2xl border text-left font-semibold text-xs sm:text-sm md:text-base transition active:scale-98 touch-manipulation flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1">
                              {opt.text}
                            </span>
                            <span
                              className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 mt-0.5 ${
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
                    className={`mt-3.5 p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1.5 ${
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
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Απαντήσεων</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 sm:py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-semibold block">
                ΣΚΟΡ
              </span>
              <span className="font-mono font-black text-base sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-sm sm:text-base">/ 10</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-[11px] sm:text-xs text-slate-400 font-semibold block">
                ΠΟΣΟΣΤΟ
              </span>
              <span className="font-mono font-black text-base sm:text-2xl text-emerald-400">
                {Math.round((score / 10) * 100)} %
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 touch-manipulation"
              >
                ΕΛΕΓΧΟΣ
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 touch-manipulation"
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

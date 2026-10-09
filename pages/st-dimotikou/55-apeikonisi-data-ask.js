// pages/st-dimotikou/55-apeikonisi-data-ask.js
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

// Μορφοποίηση αριθμού (ακέραιος ή δεκαδικός με κόμμα)
function formatNum(val, decimals = 1) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  if (Number.isInteger(Number(val))) return String(val);
  const rounded = Number(Number(val).toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// =========================================================================
// ΟΠΤΙΚΑ ΒΟΗΘΗΤΙΚΑ COMPONENTS (ΠΛΗΡΩΣ RESPONSIVE ΧΩΡΙΣ SCROLL)
// =========================================================================

function MiniBarChart({ data, maxVal = 100, yStep = 20 }) {
  const chartHeight = 150;
  const paddingLeft = 45;
  const chartWidth = 460;

  const yTicks = [];
  for (let v = 0; v <= maxVal; v += yStep) {
    yTicks.push(v);
  }

  const barCount = data.length;
  const barWidth = Math.min(42, Math.floor(280 / barCount));
  const totalBarWidth = barWidth * barCount;
  const gap = (chartWidth - paddingLeft - totalBarWidth) / (barCount + 1);

  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-3.5 sm:p-5 my-3.5 w-full max-w-2xl shadow-inner">
      <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-2 sm:mb-3">
        {toCleanUppercase('Σχήμα: Ραβδόγραμμα Δεδομένων')}
      </div>
      <div className="w-full aspect-[16/9] sm:aspect-[2/1] bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-sm flex items-center justify-center">
        <svg viewBox="0 0 490 200" className="w-full h-auto max-h-[220px] overflow-visible">
          {/* Οριζόντιες γραμμές πλέγματος */}
          {yTicks.map((val) => {
            const y = chartHeight + 15 - (val / maxVal) * chartHeight;
            return (
              <g key={`bar-tick-${val}`}>
                <line x1={paddingLeft} y1={y} x2="475" y2={y} stroke="#f1f5f9" strokeWidth="1.5" />
                <text x={paddingLeft - 8} y={y + 4} fontSize="11" fontWeight="bold" fill="#64748b" textAnchor="end">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Άξονες */}
          <line x1={paddingLeft} y1={chartHeight + 15} x2="480" y2={chartHeight + 15} stroke="#334155" strokeWidth="2.5" />
          <line x1={paddingLeft} y1={chartHeight + 15} x2={paddingLeft} y2="10" stroke="#334155" strokeWidth="2.5" />

          {/* Ράβδοι */}
          {data.map((item, idx) => {
            const bx = paddingLeft + gap + idx * (barWidth + gap);
            const bHeight = (item.value / maxVal) * chartHeight;
            const by = chartHeight + 15 - bHeight;
            const barColor = item.color || '#3b82f6';

            return (
              <g key={`bar-rect-${idx}`}>
                <rect x={bx} y={by} width={barWidth} height={Math.max(bHeight, 2)} fill={barColor} rx="5" />
                <text x={bx + barWidth / 2} y={by - 4} fontSize="12" fontWeight="900" fill="#0f172a" textAnchor="middle">
                  {item.value}
                </text>
                <text x={bx + barWidth / 2} y={chartHeight + 35} fontSize="11" fontWeight="bold" fill="#475569" textAnchor="middle">
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function MiniPictogram({ items, legend }) {
  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-3 sm:p-5 my-3.5 w-full max-w-2xl shadow-inner space-y-2.5">
      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 px-1">
        <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
          {toCleanUppercase('Σχήμα: Εικονόγραμμα')}
        </span>
        <span className="text-xs font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-amber-900 font-mono">
          Υπόμνημα: {legend}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-2.5 sm:p-3 space-y-2 text-xs font-mono">
        {items.map((it, idx) => (
          <div key={`pic-${idx}`} className="flex items-center justify-between gap-2 p-1.5 sm:p-2 bg-slate-50 rounded-xl">
            <span className="font-sans font-bold text-slate-700 w-24 sm:w-28 shrink-0 truncate">
              {it.label}:
            </span>
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 grow select-none text-base sm:text-lg">
              {Array.from({ length: it.symbols }).map((_, sIdx) => (
                <span key={`sym-icon-${sIdx}`}>{it.icon}</span>
              ))}
              {it.hasHalf && (
                <span className="text-[11px] font-bold bg-amber-100 border border-amber-300 text-amber-950 px-1 py-0.2 rounded font-sans">
                  ½
                </span>
              )}
            </div>
            {it.showTotal !== false && (
              <span className="font-bold text-slate-900 w-10 text-right shrink-0">
                {it.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'data_std_1',
    title: 'Ανακύκλωση Χαρτιού σε Εικονόγραμμα',
    unit: 'kg',
    generate: () => {
      const scale = pickRandom([5, 10, 20]);
      const fullSyms = randInt(4, 6);
      const totalUnits = fullSyms * scale;
      return {
        prompt: `Παρατηρήστε το παρακάτω εικονόγραμμα ανακύκλωσης χαρτιού. Πόσα kg χαρτιού συγκέντρωσε η τάξη;`,
        pictogram: {
          legend: `📦 ＝ ${scale} kg`,
          items: [
            { label: 'ΣΤ1 Τάξη', icon: '📦', symbols: fullSyms, value: '?' }
          ]
        },
        correctVal: String(totalUnits),
        correctText: `${totalUnits} kg`,
        tableData: [
          { item: 'Πλήθος συμβόλων', formula: `${fullSyms} σύμβολα`, val: `${fullSyms}` },
          { item: 'Αξία ανά σύμβολο', formula: `${scale} kg`, val: `${scale} kg` },
          { item: 'Συνολική ποσότητα', formula: `${fullSyms} · ${scale}`, val: `${totalUnits} kg` }
        ],
        explain: `Στο εικονόγραμμα υπάρχουν ${fullSyms} σύμβολα. Βάσει του υπομνήματος (📦 ＝ ${scale} kg): ${fullSyms} · ${scale} ＝ ${totalUnits} kg.`,
        distractors: [`${totalUnits + scale} kg`, `${totalUnits - scale} kg`, `${totalUnits + 2 * scale} kg`]
      };
    }
  },
  {
    id: 'data_std_2',
    title: 'Σύνολο Προτιμήσεων σε Ραβδόγραμμα',
    unit: 'μαθητές',
    generate: () => {
      const vA = randInt(15, 25);
      const vB = randInt(10, 20);
      const vC = randInt(20, 30);
      const total = vA + vB + vC;
      return {
        prompt: `Στο παρακάτω ραβδόγραμμα καταγράφηκαν οι προτιμήσεις σε γεύσεις παγωτού. Πόσοι ήταν συνολικά οι μαθητές που συμμετείχαν στην έρευνα;`,
        barChart: {
          maxVal: 35,
          yStep: 10,
          data: [
            { label: 'Σοκολάτα', value: vA, color: '#854d0e' },
            { label: 'Βανίλια', value: vB, color: '#f59e0b' },
            { label: 'Φράουλα', value: vC, color: '#ec4899' }
          ]
        },
        correctVal: String(total),
        correctText: `${total} μαθητές`,
        tableData: [
          { item: 'Σοκολάτα', formula: `${vA} μαθητές`, val: `${vA}` },
          { item: 'Βανίλια', formula: `${vB} μαθητές`, val: `${vB}` },
          { item: 'Φράουλα', formula: `${vC} μαθητές`, val: `${vC}` },
          { item: 'Συνολικό άθροισμα', formula: `${vA} ＋ ${vB} ＋ ${vC}`, val: `${total} μαθητές` }
        ],
        explain: `Διαβάζουμε τα ύψη των ράβδων και αθροίζουμε τις συχνότητες: ${vA} ＋ ${vB} ＋ ${vC} ＝ ${total} μαθητές.`,
        distractors: [`${total + 5} μαθητές`, `${total - 5} μαθητές`, `${total + 10} μαθητές`]
      };
    }
  },
  {
    id: 'data_std_3',
    title: 'Διαφορά Επισκεπτών Μουσείου',
    unit: 'επισκέπτες',
    generate: () => {
      const vMon = randInt(20, 35);
      const vFri = vMon + randInt(10, 20);
      const diff = vFri - vMon;
      return {
        prompt: `Στο ραβδόγραμμα απεικονίζονται οι επισκέπτες ενός μουσείου τη Δευτέρα και την Παρασκευή. Πόσους περισσότερους επισκέπτες είχε το μουσείο την Παρασκευή;`,
        barChart: {
          maxVal: 60,
          yStep: 20,
          data: [
            { label: 'Δευτέρα', value: vMon, color: '#64748b' },
            { label: 'Παρασκευή', value: vFri, color: '#3b82f6' }
          ]
        },
        correctVal: String(diff),
        correctText: `${diff} επισκέπτες`,
        tableData: [
          { item: 'Επισκέπτες Παρασκευής', formula: `${vFri}`, val: `${vFri}` },
          { item: 'Επισκέπτες Δευτέρας', formula: `${vMon}`, val: `${vMon}` },
          { item: 'Διαφορά', formula: `${vFri} － ${vMon}`, val: `${diff} επισκέπτες` }
        ],
        explain: `Διαβάζουμε τα ύψη των ράβδων: Παρασκευή ${vFri} και Δευτέρα ${vMon}. Διαφορά: ${vFri} － ${vMon} ＝ ${diff} επισκέπτες.`,
        distractors: [`${diff + 5} επισκέπτες`, `${Math.max(2, diff - 5)} επισκέπτες`, `${diff + 10} επισκέπτες`]
      };
    }
  },
  {
    id: 'data_std_4',
    title: 'Υπολογισμός Συμβόλων Εικονογράμματος',
    unit: 'σύμβολα',
    generate: () => {
      const totalTrees = pickRandom([60, 80, 100, 120]);
      const scale = pickRandom([10, 20]);
      const reqSymbols = totalTrees / scale;
      return {
        prompt: `Ένας γεωπόνος θέλει να σχεδιάσει εικονόγραμμα για ${totalTrees} ελαιόδεντρα, χρησιμοποιώντας υπόμνημα 🌳 ＝ ${scale} δέντρα. Πόσα σύμβολα πρέπει να σχεδιάσει;`,
        unit: 'σύμβολα',
        correctVal: String(reqSymbols),
        correctText: `${reqSymbols} σύμβολα`,
        tableData: [
          { item: 'Συνολικά δέντρα', formula: `${totalTrees} δέντρα`, val: `${totalTrees}` },
          { item: 'Κλίμακα ανά σύμβολο', formula: `${scale} δέντρα`, val: `${scale}` },
          { item: 'Απαιτούμενα σύμβολα', formula: `${totalTrees} : ${scale}`, val: `${reqSymbols}` }
        ],
        explain: `Διαιρούμε το συνολικό πλήθος με την κλίμακα του υπομνήματος: ${totalTrees} : ${scale} ＝ ${reqSymbols} σύμβολα.`,
        distractors: [`${reqSymbols + 2} σύμβολα`, `${Math.max(1, reqSymbols - 2)} σύμβολα`, `${reqSymbols + 4} σύμβολα`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'data_hard_1',
    title: 'Μέσος Όρος Παραγωγής από Ραβδόγραμμα',
    unit: 'κιβώτια',
    generate: () => {
      const mon = 40;
      const tue = 60;
      const wed = 50;
      const thu = 70;
      const total = mon + tue + wed + thu;
      const avg = total / 4;
      return {
        prompt: `Στο παρακάτω ραβδόγραμμα καταγράφεται η ημερήσια παραγωγή κιβωτίων ενός εργοστασίου για 4 ημέρες. Ποιος ήταν ο μέσος όρος παραγωγής ανά ημέρα;`,
        barChart: {
          maxVal: 80,
          yStep: 20,
          data: [
            { label: 'Δευτέρα', value: mon, color: '#3b82f6' },
            { label: 'Τρίτη', value: tue, color: '#2563eb' },
            { label: 'Τετάρτη', value: wed, color: '#1d4ed8' },
            { label: 'Πέμπτη', value: thu, color: '#1e40af' }
          ]
        },
        unit: 'κιβώτια',
        correctVal: String(avg),
        correctText: `${avg} κιβώτια`,
        tableData: [
          { item: 'Συνολική παραγωγή (4 ημέρες)', formula: `${mon} ＋ ${tue} ＋ ${wed} ＋ ${thu}`, val: `${total} κιβώτια` },
          { item: 'Μέσος όρος ανά ημέρα', formula: `${total} : 4`, val: `${avg} κιβώτια` }
        ],
        explain: `1ο Βήμα: Συνολική παραγωγή: 40 ＋ 60 ＋ 50 ＋ 70 ＝ ${total} κιβώτια. 2ο Βήμα: Μέσος όρος: ${total} : 4 ＝ ${avg} κιβώτια ανά ημέρα.`,
        distractors: [`${avg + 5} κιβώτια`, `${avg - 5} κιβώτια`, `${avg + 10} κιβώτια`]
      };
    }
  },
  {
    id: 'data_hard_2',
    title: 'Υπολογισμός Ποσοστού από Ραβδόγραμμα',
    unit: '%',
    generate: () => {
      const soccer = 48;
      const basket = 36;
      const track = 36;
      return {
        prompt: `Στο ραβδόγραμμα προτιμήσεων 120 συνολικά μαθητών, πόσο είναι το ποσοστό (%) των μαθητών που επέλεξαν τον στίβο;`,
        barChart: {
          maxVal: 60,
          yStep: 20,
          data: [
            { label: 'Ποδόσφαιρο', value: soccer, color: '#10b981' },
            { label: 'Μπάσκετ', value: basket, color: '#f59e0b' },
            { label: 'Στίβος', value: track, color: '#6366f1' }
          ]
        },
        unit: '%',
        correctVal: '30',
        correctText: '30 %',
        tableData: [
          { item: 'Μαθητές που επέλεξαν στίβο', formula: `${track} μαθητές`, val: `${track}` },
          { item: 'Σύνολο μαθητών', formula: '120 μαθητές', val: '120' },
          { item: 'Ποσοστό (%)', formula: `(${track} : 120) · 100`, val: '30 %' }
        ],
        explain: `Από το ραβδόγραμμα, ο στίβος έχει 36 μαθητές. Σε σύνολο 120 μαθητών: (36 : 120) · 100 ＝ 30 %.`,
        distractors: ['25 %', '35 %', '40 %']
      };
    }
  },
  {
    id: 'data_hard_3',
    title: 'Σύγκριση Ψήφων σε Ραβδόγραμμα',
    unit: 'ψήφοι',
    generate: () => {
      const catA = 90;
      const catB = 70;
      const catC = 40;
      const diff = catA - catC;
      return {
        prompt: `Παρατηρήστε το ραβδόγραμμα ψήφων σχολικού συμβουλίου. Πόσες περισσότερες ψήφους έλαβε η πρόταση Α από την πρόταση Γ;`,
        barChart: {
          maxVal: 100,
          yStep: 20,
          data: [
            { label: 'Πρόταση Α', value: catA, color: '#3b82f6' },
            { label: 'Πρόταση Β', value: catB, color: '#64748b' },
            { label: 'Πρόταση Γ', value: catC, color: '#f43f5e' }
          ]
        },
        unit: 'ψήφοι',
        correctVal: String(diff),
        correctText: `${diff} ψήφοι`,
        tableData: [
          { item: 'Ψήφοι Πρότασης Α', formula: `${catA}`, val: `${catA}` },
          { item: 'Ψήφοι Πρότασης Γ', formula: `${catC}`, val: `${catC}` },
          { item: 'Διαφορά ψήφων', formula: `${catA} － ${catC}`, val: `${diff} ψήφοι` }
        ],
        explain: `Διαβάζουμε από το ραβδόγραμμα: Πρόταση Α ＝ ${catA} ψήφοι και Πρόταση Γ ＝ ${catC} ψήφοι. Διαφορά: ${catA} － ${catC} ＝ ${diff} ψήφοι.`,
        distractors: [`${diff + 10} ψήφοι`, `${diff - 10} ψήφοι`, `${diff + 20} ψήφοι`]
      };
    }
  },
  {
    id: 'data_hard_4',
    title: 'Σύγκριση Ομάδων σε Εικονόγραμμα Αναδάσωσης',
    unit: 'δέντρα',
    generate: () => {
      const scale = 25;
      const symA = 6;
      const symB = 8;
      const diffTrees = (symB - symA) * scale;
      return {
        prompt: `Στο παρακάτω εικονόγραμμα αναδάσωσης, πόσα περισσότερα δέντρα φύτεψε η Ομάδα Β σε σχέση με την Ομάδα Α;`,
        pictogram: {
          legend: '🌲 ＝ 25 δέντρα',
          items: [
            { label: 'Ομάδα Α', icon: '🌲', symbols: symA, value: `${symA * scale}` },
            { label: 'Ομάδα Β', icon: '🌲', symbols: symB, value: `${symB * scale}` }
          ]
        },
        unit: 'δέντρα',
        correctVal: String(diffTrees),
        correctText: `${diffTrees} δέντρα`,
        tableData: [
          { item: 'Διαφορά συμβόλων', formula: `${symB} － ${symA}`, val: '2 σύμβολα' },
          { item: 'Αξία ανά σύμβολο', formula: '25 δέντρα', val: '25' },
          { item: 'Διαφορά σε δέντρα', formula: `2 · 25`, val: `${diffTrees} δέντρα` }
        ],
        explain: `Η διαφορά στο εικονόγραμμα είναι 8 － 6 ＝ 2 σύμβολα. Επειδή 🌲 ＝ 25 δέντρα: 2 · 25 ＝ ${diffTrees} δέντρα.`,
        distractors: [`${diffTrees + 25} δέντρα`, `${diffTrees - 15} δέντρα`, `${diffTrees + 50} δέντρα`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Ανάγνωση εικονογράμματος
  const q1Scale = pickRandom([4, 5, 8, 10]);
  const q1Symbols = randInt(3, 6);
  const q1Total = q1Symbols * q1Scale;

  // Q2: MCQ - Κανόνες κατασκευής ραβδογράμματος
  const q2Correct = 'Όλες οι ράβδοι πρέπει να έχουν αυστηρά το ίδιο πλάτος και ίσα κενά μεταξύ τους';
  const q2Options = shuffle([
    q2Correct,
    'Οι ράβδοι πρέπει να έχουν διαφορετικό πλάτος ανάλογα με την προτίμηση',
    'Δεν χρειάζεται να αναγράφεται κλίμακα στον κατακόρυφο άξονα',
    'Τα κενά ανάμεσα στις ράβδους πρέπει να μεγαλώνουν συνεχώς'
  ]);

  // Q3: Input - Σχεδίαση συμβόλων
  const q3TotalItems = pickRandom([40, 50, 60, 80, 100]);
  const q3Scale = pickRandom([5, 10, 20]);
  const q3ReqSyms = q3TotalItems / q3Scale;

  // Q4: MCQ - Η έννοια της συχνότητας
  const q4Correct = 'Ο αριθμός που δείχνει πόσες φορές εμφανίζεται μια συγκεκριμένη τιμή ή επιλογή';
  const q4Options = shuffle([
    q4Correct,
    'Το συνολικό άθροισμα όλων των αριθμών ενός προβλήματος',
    'Η διαφορά ανάμεσα στη μέγιστη και την ελάχιστη τιμή',
    'Το πλάτος της στήλης σε ένα ραβδόγραμμα'
  ]);

  // Q5: Input - Σύγκριση υψών ράβδων
  const q5ValHigh = randInt(25, 40);
  const q5ValLow = randInt(10, 20);
  const q5Diff = q5ValHigh - q5ValLow;

  // Q6: MCQ - Η σημασία του υπομνήματος
  const q6Correct = 'Επειδή χωρίς υπόμνημα δεν γνωρίζουμε πόσες μονάδες αντιπροσωπεύει κάθε εικόνα';
  const q6Options = shuffle([
    q6Correct,
    'Για να ομορφύνει το χρώμα του γραφήματος',
    'Για να μην χρειάζεται να κάνουμε πολλαπλασιασμό',
    'Επειδή είναι υποχρεωτικό μόνο στα ραβδογράμματα'
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
      title: 'Ανάγνωση Εικονογράμματος',
      prompt: `Βάσει του παρακάτω εικονογράμματος, πόσα βιβλία διάβασε συνολικά ο μαθητής;`,
      pictogram: {
        legend: `📚 ＝ ${q1Scale} βιβλία`,
        items: [
          { label: 'Ανάγνωση', icon: '📚', symbols: q1Symbols, value: '?' }
        ]
      },
      correct: String(q1Total),
      explain: `Στο εικονόγραμμα υπάρχουν ${q1Symbols} σύμβολα. Αφού 📚 ＝ ${q1Scale} βιβλία: ${q1Symbols} · ${q1Scale} ＝ ${q1Total} βιβλία.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Κανόνες Κατασκευής Ραβδογράμματος',
      prompt: 'Ποιος από τους παρακάτω κανόνες είναι υποχρεωτικός κατά τη σχεδίαση ενός ραβδογράμματος;',
      options: q2Options,
      correct: q2Correct,
      explain: 'Στο ραβδόγραμμα μόνο το ύψος των ράβδων αλλάζει (ανάλογα με τη συχνότητα). Το πλάτος τους και οι αποστάσεις ανάμεσά τους παραμένουν αυστηρά ίσα.'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'number',
      title: 'Σχεδίαση Συμβόλων σε Εικονόγραμμα',
      prompt: `Θέλουμε να απεικονίσουμε ${q3TotalItems} δέντρα σε εικονόγραμμα με υπόμνημα 🌲 ＝ ${q3Scale} δέντρα. Πόσα σύμβολα 🌲 πρέπει να σχεδιάσουμε;`,
      correct: String(q3ReqSyms),
      explain: `Διαιρούμε το συνολικό μέγεθος με την κλίμακα του υπομνήματος: ${q3TotalItems} : ${q3Scale} ＝ ${q3ReqSyms} σύμβολα.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Η Έννοια της Συχνότητας',
      prompt: 'Τι ονομάζουμε «συχνότητα» ενός δεδομένου στη Στατιστική;',
      options: q4Options,
      correct: q4Correct,
      explain: 'Συχνότητα είναι το πλήθος των φορών που παρατηρείται ή επαναλαμβάνεται μια συγκεκριμένη τιμή ή κατηγορία.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Σύγκριση Υψών Ράβδων',
      prompt: 'Πόσο μεγαλύτερη είναι η συχνότητα της Κατηγορίας Α σε σχέση με την Κατηγορία Β;',
      barChart: {
        maxVal: 45,
        yStep: 15,
        data: [
          { label: 'Κατηγορία Α', value: q5ValHigh, color: '#3b82f6' },
          { label: 'Κατηγορία Β', value: q5ValLow, color: '#f43f5e' }
        ]
      },
      correct: String(q5Diff),
      explain: `Διαβάζουμε τα ύψη: Κατηγορία Α ＝ ${q5ValHigh} και Κατηγορία Β ＝ ${q5ValLow}. Διαφορά: ${q5ValHigh} － ${q5ValLow} ＝ ${q5Diff}.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Η Σημασία του Υπομνήματος',
      prompt: 'Για ποιο λόγο είναι απολύτως απαραίτητο το υπόμνημα σε ένα εικονόγραμμα;',
      options: q6Options,
      correct: q6Correct,
      explain: 'Το υπόμνημα καθορίζει την αναλογία/κλίμακα του συμβόλου (π.χ. 1 σύμβολο ＝ 5 μονάδες). Χωρίς αυτό, το εικονόγραμμα δεν μπορεί να διαβαστεί ποσοτικά.'
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: `Πρόβλημα: ${q7Data.title}`,
      prompt: q7Data.prompt,
      barChart: q7Data.barChart,
      pictogram: q7Data.pictogram,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: `Πρόβλημα: ${q8Data.title}`,
      prompt: q8Data.prompt,
      barChart: q8Data.barChart,
      pictogram: q8Data.pictogram,
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
      barChart: q9Data.barChart,
      pictogram: q9Data.pictogram,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `Σύνθετο Πρόβλημα: ${q10Data.title}`,
      prompt: q10Data.prompt,
      barChart: q10Data.barChart,
      pictogram: q10Data.pictogram,
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

export default function ApeikonisiDataExercisesPage() {
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
      title="Ασκήσεις: Απεικόνιση Δεδομένων (Ραβδόγραμμα & Εικονόγραμμα) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα ραβδογράμματα, τα εικονογράμματα και την ερμηνεία δεδομένων για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/55-apeikonisi-data"
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
                <span>ΚΕΦΑΛΑΙΟ 55 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Ραβδόγραμμα &amp; Εικονόγραμμα
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα με οπτικά διαγράμματα, υπολογισμό συχνοτήτων, ερμηνεία υπομνήματος και ανάλυση στατιστικών δεδομένων!
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

                    {/* ΟΠΤΙΚΑ ΣΧΗΜΑΤΑ ΔΕΔΟΜΕΝΩΝ */}
                    {q.barChart && (
                      <MiniBarChart
                        data={q.barChart.data}
                        maxVal={q.barChart.maxVal}
                        yStep={q.barChart.yStep}
                      />
                    )}

                    {q.pictogram && (
                      <MiniPictogram
                        legend={q.pictogram.legend}
                        items={q.pictogram.items}
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
                          placeholder={q.inputType === 'decimal' ? 'π.χ. 12,5' : 'Απάντηση...'}
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

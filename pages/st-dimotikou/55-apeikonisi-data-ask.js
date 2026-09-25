// pages/st-dimotikou/55-apeikonisi-data-ask.js
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
function formatNum(val, decimals = 1) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
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
        ΣΧΗΜΑ: ΡΑΒΔΟΓΡΑΜΜΑ ΔΕΔΟΜΕΝΩΝ
      </div>
      <div className="w-full aspect-[16/9] sm:aspect-[2/1] bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-sm flex items-center justify-center">
        <svg viewBox="0 0 490 200" className="w-full h-auto max-h-[220px] overflow-visible">
          {/* Οριζοντιες γραμμες πλεγματος */}
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

          {/* Αξονες */}
          <line x1={paddingLeft} y1={chartHeight + 15} x2="480" y2={chartHeight + 15} stroke="#334155" strokeWidth="2.5" />
          <line x1={paddingLeft} y1={chartHeight + 15} x2={paddingLeft} y2="10" stroke="#334155" strokeWidth="2.5" />

          {/* Ραβδοι */}
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
          ΣΧΗΜΑ: ΕΙΚΟΝΟΓΡΑΜΜΑ
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

// =========================================================================
// ΔΕΞΑΜΕΝΕΣ ΘΕΜΑΤΩΝ
// =========================================================================

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'data_std_1',
    generate: () => {
      const scale = pickRandom([5, 10, 20]);
      const fullSyms = randInt(4, 6);
      const totalUnits = fullSyms * scale;
      return {
        text: `Παρατηρήστε το παρακάτω εικονόγραμμα ανακύκλωσης χαρτιού. Πόσα kg χαρτιού συγκέντρωσε η τάξη;`,
        pictogram: {
          legend: `📦 ＝ ${scale} kg`,
          items: [
            { label: 'ΣΤ1 Τάξη', icon: '📦', symbols: fullSyms, value: '?' }
          ]
        },
        correctVal: totalUnits,
        correctStr: String(totalUnits),
        unit: 'kg',
        explanation: `Στο εικονόγραμμα υπάρχουν ${fullSyms} σύμβολα. Βάσει του υπομνήματος (📦 ＝ ${scale} kg): ${fullSyms} · ${scale} ＝ ${totalUnits} kg.`
      };
    }
  },
  {
    id: 'data_std_2',
    generate: () => {
      const vA = randInt(15, 25);
      const vB = randInt(10, 20);
      const vC = randInt(20, 30);
      const total = vA + vB + vC;
      return {
        text: `Στο παρακάτω ραβδόγραμμα καταγράφηκαν οι προτιμήσεις σε γεύσεις παγωτού. Πόσοι ήταν συνολικά οι μαθητές που συμμετείχαν στην έρευνα;`,
        barChart: {
          maxVal: 35,
          yStep: 10,
          data: [
            { label: 'Σοκολάτα', value: vA, color: '#854d0e' },
            { label: 'Βανίλια', value: vB, color: '#f59e0b' },
            { label: 'Φράουλα', value: vC, color: '#ec4899' }
          ]
        },
        correctVal: total,
        correctStr: String(total),
        unit: 'μαθητές',
        explanation: `Διαβάζουμε τα ύψη των ράβδων και αθροίζουμε τις συχνότητες: ${vA} ＋ ${vB} ＋ ${vC} ＝ ${total} μαθητές.`
      };
    }
  },
  {
    id: 'data_std_3',
    generate: () => {
      const vMon = randInt(20, 35);
      const vFri = vMon + randInt(10, 20);
      const diff = vFri - vMon;
      return {
        text: `Στο ραβδόγραμμα απεικονίζονται οι επισκέπτες ενός μουσείου τη Δευτέρα και την Παρασκευή. Πόσους περισσότερους επισκέπτες είχε το μουσείο την Παρασκευή;`,
        barChart: {
          maxVal: 60,
          yStep: 20,
          data: [
            { label: 'Δευτέρα', value: vMon, color: '#64748b' },
            { label: 'Παρασκευή', value: vFri, color: '#3b82f6' }
          ]
        },
        correctVal: diff,
        correctStr: String(diff),
        unit: 'επισκέπτες',
        explanation: `Διαβάζουμε τα ύψη των ράβδων: Παρασκευή ${vFri} και Δευτέρα ${vMon}. Διαφορά: ${vFri} － ${vMon} ＝ ${diff} επισκέπτες.`
      };
    }
  },
  {
    id: 'data_std_4',
    generate: () => {
      const totalTrees = pickRandom([60, 80, 100, 120]);
      const scale = pickRandom([10, 20]);
      const reqSymbols = totalTrees / scale;
      return {
        text: `Ένας γεωπόνος θέλει να σχεδιάσει εικονόγραμμα για ${totalTrees} ελαιόδεντρα, χρησιμοποιώντας υπόμνημα 🌳 ＝ ${scale} δέντρα. Πόσα σύμβολα πρέπει να σχεδιάσει;`,
        correctVal: reqSymbols,
        correctStr: String(reqSymbols),
        unit: 'σύμβολα',
        explanation: `Διαιρούμε το συνολικό πλήθος με την κλίμακα του υπομνήματος: ${totalTrees} : ${scale} ＝ ${reqSymbols} σύμβολα.`
      };
    }
  },
  {
    id: 'data_std_5',
    generate: () => {
      return {
        text: `Στο παρακάτω ραβδόγραμμα καταγράφηκαν τα αγαπημένα κατοικίδια 60 παιδιών. Ποιο είναι το ποσοστό (%) των παιδιών που επέλεξαν τον σκύλο;`,
        barChart: {
          maxVal: 35,
          yStep: 10,
          data: [
            { label: 'Σκύλος', value: 30, color: '#3b82f6' },
            { label: 'Γάτα', value: 18, color: '#f59e0b' },
            { label: 'Πουλί', value: 12, color: '#10b981' }
          ]
        },
        correctVal: 50,
        correctStr: '50',
        unit: '%',
        explanation: `Ο σκύλος έχει συχνότητα 30 σε σύνολο 60 παιδιών: (30 : 60) · 100 ＝ 0,5 · 100 ＝ 50 %.`
      };
    }
  },
  {
    id: 'data_std_6',
    generate: () => {
      const baseVal = randInt(12, 18);
      const doubleVal = baseVal * 2;
      return {
        text: `Σε ένα ραβδόγραμμα η ράβδος της ομάδας Α έχει ύψος ${baseVal} πόντους και η ράβδος της ομάδας Β έχει ακριβώς διπλάσιο ύψος. Πόσους πόντους συγκέντρωσε η ομάδα Β;`,
        correctVal: doubleVal,
        correctStr: String(doubleVal),
        unit: 'πόντοι',
        explanation: `Εφόσον το ύψος είναι διπλάσιο: ${baseVal} · 2 ＝ ${doubleVal} πόντοι.`
      };
    }
  },
  {
    id: 'data_std_7',
    generate: () => {
      const scale = 5;
      const fullSyms = randInt(3, 5);
      const totalVal = fullSyms * scale + 2.5;
      return {
        text: `Παρατηρήστε το παρακάτω εικονόγραμμα επισκευής οχημάτων. Πόσα οχήματα επισκευάστηκαν συνολικά;`,
        pictogram: {
          legend: `🚗 ＝ ${scale} οχήματα`,
          items: [
            { label: 'Επισκευές', icon: '🚗', symbols: fullSyms, hasHalf: true, value: '?' }
          ]
        },
        correctVal: totalVal,
        correctStr: formatNum(totalVal),
        unit: 'αυτοκίνητα',
        explanation: `Έχουμε ${fullSyms} ολόκληρα σύμβολα (${fullSyms} · 5 ＝ ${fullSyms * 5}) και 1 μισό σύμβολο (2,5 οχήματα). Σύνολο: ${formatNum(totalVal)} οχήματα.`
      };
    }
  },
  {
    id: 'data_std_8',
    generate: () => {
      const bus = randInt(20, 30);
      const walk = randInt(15, 25);
      const car = randInt(10, 20);
      return {
        text: `Στο ραβδόγραμμα καταγράφεται ο τρόπος μετακίνησης μαθητών προς το σχολείο. Πόσοι μαθητές μετακινούνται με όχημα (λεωφορείο ή αυτοκίνητο);`,
        barChart: {
          maxVal: 35,
          yStep: 10,
          data: [
            { label: 'Λεωφορείο', value: bus, color: '#3b82f6' },
            { label: 'Πόδια', value: walk, color: '#10b981' },
            { label: 'Αυτοκίνητο', value: car, color: '#f59e0b' }
          ]
        },
        correctVal: bus + car,
        correctStr: String(bus + car),
        unit: 'μαθητές',
        explanation: `Διαβάζουμε: Λεωφορείο ＝ ${bus} και Αυτοκίνητο ＝ ${car}. Σύνολο: ${bus} ＋ ${car} ＝ ${bus + car} μαθητές.`
      };
    }
  },
  {
    id: 'data_std_9',
    generate: () => {
      return {
        text: `Στο παρακάτω ραβδόγραμμα πωλήσεων φρούτων, πόσα κιλά (kg) φρούτων πουλήθηκαν συνολικά;`,
        barChart: {
          maxVal: 50,
          yStep: 10,
          data: [
            { label: 'Μήλα', value: 45, color: '#ef4444' },
            { label: 'Πορτοκάλια', value: 30, color: '#f97316' },
            { label: 'Μπανάνες', value: 25, color: '#eab308' }
          ]
        },
        correctVal: 100,
        correctStr: '100',
        unit: 'kg',
        explanation: `Διαβάζουμε τα ύψη των ράβδων: 45 ＋ 30 ＋ 25 ＝ 100 kg.`
      };
    }
  },
  {
    id: 'data_std_10',
    generate: () => {
      const symbolVal = pickRandom([4, 5, 8]);
      const symCount = randInt(4, 7);
      const totalUnits = symCount * symbolVal;
      return {
        text: `Βάσει του παρακάτω εικονογράμματος επιδόσεων, πόσους βαθμούς συγκέντρωσε ο μαθητής;`,
        pictogram: {
          legend: `⭐ ＝ ${symbolVal} βαθμοί`,
          items: [
            { label: 'Βαθμολογία', icon: '⭐', symbols: symCount, value: '?' }
          ]
        },
        correctVal: totalUnits,
        correctStr: String(totalUnits),
        unit: 'βαθμοί',
        explanation: `Μετράμε ${symCount} αστέρια. Κάθε αστέρι ισούται με ${symbolVal} βαθμούς: ${symCount} · ${symbolVal} ＝ ${totalUnits} βαθμοί.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'data_hard_1',
    generate: () => {
      const mon = 40;
      const tue = 60;
      const wed = 50;
      const thu = 70;
      const total = mon + tue + wed + thu; // 220
      const avg = total / 4; // 55
      return {
        text: `Στο παρακάτω ραβδόγραμμα καταγράφεται η ημερήσια παραγωγή κιβωτίων ενός εργοστασίου για 4 ημέρες. Ποιος ήταν ο μέσος όρος παραγωγής ανά ημέρα;`,
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
        correctVal: avg,
        correctStr: String(avg),
        unit: 'κιβώτια',
        explanation: `1ο Βήμα: Συνολική παραγωγή: 40 ＋ 60 ＋ 50 ＋ 70 ＝ ${total} κιβώτια. 2ο Βήμα: Μέσος όρος: ${total} : 4 ＝ ${avg} κιβώτια ανά ημέρα.`
      };
    }
  },
  {
    id: 'data_hard_2',
    generate: () => {
      const soccer = 48; // 40%
      const basket = 36; // 30%
      const track = 36; // 30%
      return {
        text: `Στο ραβδόγραμμα προτιμήσεων 120 συνολικά μαθητών, πόσο είναι το ποσοστό (%) των μαθητών που επέλεξαν τον στίβο;`,
        barChart: {
          maxVal: 60,
          yStep: 20,
          data: [
            { label: 'Ποδόσφαιρο', value: soccer, color: '#10b981' },
            { label: 'Μπάσκετ', value: basket, color: '#f59e0b' },
            { label: 'Στίβος', value: track, color: '#6366f1' }
          ]
        },
        correctVal: 30,
        correctStr: '30',
        unit: '%',
        explanation: `Από το ραβδόγραμμα, ο στίβος έχει 36 μαθητές. Σε σύνολο 120 μαθητών: (36 : 120) · 100 ＝ 30 %.`
      };
    }
  },
  {
    id: 'data_hard_3',
    generate: () => {
      const catA = 90;
      const catB = 70;
      const catC = 40;
      const diff = catA - catC; // 50
      return {
        text: `Παρατηρήστε το ραβδόγραμμα ψήφων σχολικού συμβουλίου. Πόσες περισσότερες ψήφους έλαβε η πρόταση Α από την πρόταση Γ;`,
        barChart: {
          maxVal: 100,
          yStep: 20,
          data: [
            { label: 'Πρόταση Α', value: catA, color: '#3b82f6' },
            { label: 'Πρόταση Β', value: catB, color: '#64748b' },
            { label: 'Πρόταση Γ', value: catC, color: '#f43f5e' }
          ]
        },
        correctVal: diff,
        correctStr: String(diff),
        unit: 'ψήφοι',
        explanation: `Διαβάζουμε από το ραβδόγραμμα: Πρόταση Α ＝ ${catA} ψήφοι και Πρόταση Γ ＝ ${catC} ψήφοι. Διαφορά: ${catA} － ${catC} ＝ ${diff} ψήφοι.`
      };
    }
  },
  {
    id: 'data_hard_4',
    generate: () => {
      const scale = 25; // 1 σύμβολο = 25 δέντρα
      const symA = 6;
      const symB = 8;
      const diffTrees = (symB - symA) * scale; // 50 δέντρα
      return {
        text: `Στο παρακάτω εικονόγραμμα αναδάσωσης, πόσα περισσότερα δέντρα φύτεψε η Ομάδα Β σε σχέση με την Ομάδα Α;`,
        pictogram: {
          legend: '🌲 ＝ 25 δέντρα',
          items: [
            { label: 'Ομάδα Α', icon: '🌲', symbols: symA, value: `${symA * scale}` },
            { label: 'Ομάδα Β', icon: '🌲', symbols: symB, value: `${symB * scale}` }
          ]
        },
        correctVal: diffTrees,
        correctStr: String(diffTrees),
        unit: 'δέντρα',
        explanation: `Η διαφορά στο εικονόγραμμα είναι 8 － 6 ＝ 2 σύμβολα. Επειδή 🌲 ＝ 25 δέντρα: 2 · 25 ＝ ${diffTrees} δέντρα.`
      };
    }
  },
  {
    id: 'data_hard_5',
    generate: () => {
      return {
        text: `Στον κατακόρυφο άξονα ενός ραβδογράμματος, το μέγιστο ύψος είναι 180 και ο άξονας χωρίζεται σε 6 ίσα διαστήματα (υποδιαιρέσεις). Πόσες μονάδες αντιπροσωπεύει κάθε διάστημα της κλίμακας;`,
        correctVal: 30,
        correctStr: '30',
        unit: 'μονάδες',
        explanation: `Διαιρούμε το μέγιστο ύψος με τον αριθμό των ίσων διαστημάτων: 180 : 6 ＝ 30 μονάδες ανά διάστημα.`
      };
    }
  },
  {
    id: 'data_hard_6',
    generate: () => {
      return {
        text: `Στο παρακάτω ραβδόγραμμα αναγνωστών 100 συνολικά ατόμων, ποιο είναι το ποσοστό (%) των αναγνωστών της εφημερίδας Β;`,
        barChart: {
          maxVal: 50,
          yStep: 10,
          data: [
            { label: 'Εφημερίδα Α', value: 35, color: '#64748b' },
            { label: 'Εφημερίδα Β', value: 45, color: '#3b82f6' },
            { label: 'Εφημερίδα Γ', value: 20, color: '#10b981' }
          ]
        },
        correctVal: 45,
        correctStr: '45',
        unit: '%',
        explanation: `Από το ραβδόγραμμα, η εφημερίδα Β έχει 45 αναγνώστες σε σύνολο 100 ατόμων, άρα το ποσοστό είναι απευθείας 45 %.`
      };
    }
  },
  {
    id: 'data_hard_7',
    generate: () => {
      return {
        text: `Σε ένα ραβδόγραμμα, μια ράβδος ύψους 15 cm αντιστοιχεί σε 60 πωλήσεις προϊόντων. Πόσα εκατοστά (cm) ύψος πρέπει να έχει μια άλλη ράβδος στο ίδιο γράφημα για να αναπαραστήσει 100 πωλήσεις;`,
        correctVal: 25,
        correctStr: '25',
        unit: 'cm',
        explanation: `Τα ύψη των ράβδων είναι ανάλογα των συχνοτήτων: χ ＝ (15 · 100) : 60 ＝ 1.500 : 60 ＝ 25 cm.`
      };
    }
  },
  {
    id: 'data_hard_8',
    generate: () => {
      return {
        text: `Για να αναπαραστήσουμε 150 μονάδες σε εικονόγραμμα, αν αλλάξουμε το υπόμνημα από 1 σύμβολο ＝ 5 μονάδες σε 1 σύμβολο ＝ 15 μονάδες, πόσα λιγότερα σύμβολα θα χρειαστεί να σχεδιάσουμε;`,
        correctVal: 20,
        correctStr: '20',
        unit: 'σύμβολα',
        explanation: `Με κλίμακα 5: 150 : 5 ＝ 30 σύμβολα. Με κλίμακα 15: 150 : 15 ＝ 10 σύμβολα. Διαφορά: 30 － 10 ＝ 20 λιγότερα σύμβολα.`
      };
    }
  },
  {
    id: 'data_hard_9',
    generate: () => {
      return {
        text: `Στο ραβδόγραμμα κατανομής δύο τμημάτων της ΣΤ' τάξης, πόσα περισσότερα είναι τα αγόρια από τα κορίτσια;`,
        barChart: {
          maxVal: 40,
          yStep: 10,
          data: [
            { label: 'Κορίτσια', value: 28, color: '#ec4899' },
            { label: 'Αγόρια', value: 32, color: '#3b82f6' }
          ]
        },
        correctVal: 4,
        correctStr: '4',
        unit: 'αγόρια',
        explanation: `Διαβάζουμε από το ραβδόγραμμα: Αγόρια ＝ 32, Κορίτσια ＝ 28. Διαφορά: 32 － 28 ＝ 4 αγόρια.`
      };
    }
  },
  {
    id: 'data_hard_10',
    generate: () => {
      return {
        text: `Στο παρακάτω τριμηνιαίο ραβδόγραμμα καταγράφηκαν οι πωλήσεις μιας επιχείρησης. Ποιες ήταν οι συνολικές πωλήσεις ολόκληρου του έτους;`,
        barChart: {
          maxVal: 240,
          yStep: 60,
          data: [
            { label: "Α' Τρίμηνο", value: 120, color: '#38bdf8' },
            { label: "Β' Τρίμηνο", value: 180, color: '#3b82f6' },
            { label: "Γ' Τρίμηνο", value: 150, color: '#2563eb' },
            { label: "Δ' Τρίμηνο", value: 210, color: '#1d4ed8' }
          ]
        },
        correctVal: 660,
        correctStr: '660',
        unit: 'πωλήσεις',
        explanation: `Διαβάζουμε τα ύψη των 4 τριμήνων και αθροίζουμε: 120 ＋ 180 ＋ 150 ＋ 210 ＝ 660 πωλήσεις.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal)
  {
    const scale = pickRandom([4, 5, 8, 10]);
    const symbols = randInt(3, 6);
    const total = symbols * scale;

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΑΝΑΓΝΩΣΗ ΕΙΚΟΝΟΓΡΑΜΜΑΤΟΣ',
      instruction: 'Παρατηρήστε το εικονόγραμμα και υπολογίστε το συνολικό μέγεθος:',
      prompt: `Βάσει του παρακάτω εικονογράμματος, πόσα βιβλία διάβασε συνολικά ο μαθητής;`,
      pictogram: {
        legend: `📚 ＝ ${scale} βιβλία`,
        items: [
          { label: 'Ανάγνωση', icon: '📚', symbols, value: '?' }
        ]
      },
      correctVal: total,
      correctStr: String(total),
      explanation: `Στο εικονόγραμμα υπάρχουν ${symbols} σύμβολα. Αφού 📚 ＝ ${scale} βιβλία: ${symbols} · ${scale} ＝ ${total} βιβλία.`
    });
  }

  // Q2 (MCQ)
  {
    const correctRule = 'Όλες οι ράβδοι πρέπει να έχουν αυστηρά το ίδιο πλάτος και ίσα κενά μεταξύ τους';
    const options = [
      { text: correctRule, isCorrect: true },
      { text: 'Οι ράβδοι πρέπει να έχουν διαφορετικό πλάτος ανάλογα με την προτίμηση', isCorrect: false },
      { text: 'Δεν χρειάζεται να αναγράφεται κλίμακα στον κατακόρυφο άξονα', isCorrect: false },
      { text: 'Τα κενά ανάμεσα στις ράβδους πρέπει να μεγαλώνουν συνεχώς', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΚΑΝΟΝΕΣ ΚΑΤΑΣΚΕΥΗΣ ΡΑΒΔΟΓΡΑΜΜΑΤΟΣ',
      instruction: 'Επιλέξτε τον σωστό κανόνα:',
      prompt: `Ποιος από τους παρακάτω κανόνες είναι υποχρεωτικός κατά τη σχεδίαση ενός ραβδογράμματος;`,
      options,
      correctText: correctRule,
      explanation: `Στο ραβδόγραμμα μόνο το ύψος των ράβδων αλλάζει (ανάλογα με τη συχνότητα). Το πλάτος τους και οι αποστάσεις ανάμεσά τους παραμένουν αυστηρά ίσα.`
    });
  }

  // Q3 (Input - Decimal)
  {
    const totalItems = pickRandom([40, 50, 60, 80, 100]);
    const scale = pickRandom([5, 10, 20]);
    const reqSyms = totalItems / scale;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΣΧΕΔΙΑΣΗ ΣΥΜΒΟΛΩΝ',
      instruction: 'Βρείτε πόσα σύμβολα απαιτούνται:',
      prompt: `Θέλουμε να απεικονίσουμε ${totalItems} δέντρα σε εικονόγραμμα με υπόμνημα 🌲 ＝ ${scale} δέντρα. Πόσα σύμβολα 🌲 πρέπει να σχεδιάσουμε;`,
      correctVal: reqSyms,
      correctStr: String(reqSyms),
      explanation: `Διαιρούμε το συνολικό μέγεθος με την κλίμακα του υπομνήματος: ${totalItems} : ${scale} ＝ ${reqSyms} σύμβολα.`
    });
  }

  // Q4 (MCQ)
  {
    const correctConcept = 'Ο αριθμός που δείχνει πόσες φορές εμφανίζεται μια συγκεκριμένη τιμή ή επιλογή';
    const options = [
      { text: correctConcept, isCorrect: true },
      { text: 'Το συνολικό άθροισμα όλων των αριθμών ενός προβλήματος', isCorrect: false },
      { text: 'Η διαφορά ανάμεσα στη μέγιστη και την ελάχιστη τιμή', isCorrect: false },
      { text: 'Το πλάτος της στήλης σε ένα ραβδόγραμμα', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • Η ΕΝΝΟΙΑ ΤΗΣ ΣΥΧΝΟΤΗΤΑΣ',
      instruction: 'Επιλέξτε τον σωστό ορισμό:',
      prompt: `Τι ονομάζουμε «συχνότητα» ενός δεδομένου στη Στατιστική;`,
      options,
      correctText: correctConcept,
      explanation: `Συχνότητα είναι το πλήθος των φορών που παρατηρείται ή επαναλαμβάνεται μια συγκεκριμένη τιμή ή κατηγορία.`
    });
  }

  // Q5 (Input - Decimal)
  {
    const valHigh = randInt(25, 40);
    const valLow = randInt(10, 20);
    const diff = valHigh - valLow;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΣΥΓΚΡΙΣΗ ΥΨΩΝ ΡΑΒΔΩΝ',
      instruction: 'Παρατηρήστε το ραβδόγραμμα και υπολογίστε τη διαφορά:',
      prompt: `Πόσο μεγαλύτερη είναι η συχνότητα της Κατηγορίας Α σε σχέση με την Κατηγορία Β;`,
      barChart: {
        maxVal: 45,
        yStep: 15,
        data: [
          { label: 'Κατηγορία Α', value: valHigh, color: '#3b82f6' },
          { label: 'Κατηγορία Β', value: valLow, color: '#f43f5e' }
        ]
      },
      correctVal: diff,
      correctStr: String(diff),
      explanation: `Διαβάζουμε τα ύψη: Κατηγορία Α ＝ ${valHigh} και Κατηγορία Β ＝ ${valLow}. Διαφορά: ${valHigh} － ${valLow} ＝ ${diff}.`
    });
  }

  // Q6 (MCQ)
  {
    const correctReason = 'Επειδή χωρίς υπόμνημα δεν γνωρίζουμε πόσες μονάδες αντιπροσωπεύει κάθε εικόνα';
    const options = [
      { text: correctReason, isCorrect: true },
      { text: 'Για να ομορφύνει το χρώμα του γραφήματος', isCorrect: false },
      { text: 'Για να μην χρειάζεται να κάνουμε πολλαπλασιασμό', isCorrect: false },
      { text: 'Επειδή είναι υποχρεωτικό μόνο στα ραβδογράμματα', isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • Η ΣΗΜΑΣΙΑ ΤΟΥ ΥΠΟΜΝΗΜΑΤΟΣ',
      instruction: 'Επιλέξτε τη σωστή εξήγηση:',
      prompt: `Για ποιο λόγο είναι απολύτως απαραίτητο το υπόμνημα σε ένα εικονόγραμμα;`,
      options,
      correctText: correctReason,
      explanation: `Το υπόμνημα καθορίζει την αναλογία/κλίμακα του συμβόλου (π.χ. 1 σύμβολο ＝ 5 μονάδες). Χωρίς αυτό, το εικονόγραμμα δεν μπορεί να διαβαστεί ποσοτικά.`
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
      title: 'ΕΡΩΤΗΣΗ 7 • ΠΡΑΚΤΙΚΟ ΠΡΟΒΛΗΜΑ ΓΡΑΦΗΜΑΤΟΣ',
      instruction: 'Παρατηρήστε το σχήμα και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: stdProb1.text,
      barChart: stdProb1.barChart,
      pictogram: stdProb1.pictogram,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal;
    const unit8 = stdProb2.unit === '%' ? ' %' : (stdProb2.unit ? ` ${stdProb2.unit}` : '');
    const fake8A = typeof val8 === 'number' ? formatNum(val8 + randInt(5, 12)) : '0';
    const fake8B = typeof val8 === 'number' ? formatNum(Math.max(1, val8 - randInt(4, 10))) : '0';
    const fake8C = typeof val8 === 'number' ? formatNum(val8 * 1.4) : '0';

    const optionsQ8 = [
      { text: `${stdProb2.correctStr}${unit8}`, isCorrect: true },
      { text: `${fake8A}${unit8}`, isCorrect: false },
      { text: `${fake8B}${unit8}`, isCorrect: false },
      { text: `${fake8C}${unit8}`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 8 • ΠΡΟΒΛΗΜΑ ΕΡΜΗΝΕΙΑΣ ΔΕΔΟΜΕΝΩΝ',
      instruction: 'Παρατηρήστε το σχήμα και επιλέξτε τη σωστή τιμή:',
      prompt: stdProb2.text,
      barChart: stdProb2.barChart,
      pictogram: stdProb2.pictogram,
      options: optionsQ8,
      correctText: `${stdProb2.correctStr}${unit8}`,
      explanation: stdProb2.explanation
    });
  }

  // Q9 & Q10: Προβλήματα Αυξημένης Δυσκολίας με Σχήματα
  {
    const shuffledHard = [...HARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const hardProb1 = shuffledHard[0].generate();
    const hardProb2 = shuffledHard[1].generate();

    // Q9 (Input - Decimal)
    qList.push({
      id: 9,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΑΥΞΗΜΕΝΗΣ ΔΥΣΚΟΛΙΑΣ',
      instruction: 'Παρατηρήστε προσεκτικά το σχήμα και υπολογίστε το αποτέλεσμα:',
      prompt: hardProb1.text,
      barChart: hardProb1.barChart,
      pictogram: hardProb1.pictogram,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας - Σύμβολο '%' ΜΟΝΟ όταν είναι ποσοστό)
    const val10 = hardProb2.correctVal;
    const isPercentageQuestion = hardProb2.unit === '%';
    const unitSuffix = isPercentageQuestion ? ' %' : (hardProb2.unit ? ` ${hardProb2.unit}` : '');

    const fake10A = typeof val10 === 'number' ? formatNum(val10 + randInt(5, 10)) : '0';
    const fake10B = typeof val10 === 'number' ? formatNum(Math.max(2, val10 - randInt(3, 7))) : '0';
    const fake10C = typeof val10 === 'number' ? formatNum(val10 * 1.3) : '0';

    const optionsQ10 = [
      { text: `${hardProb2.correctStr}${unitSuffix}`, isCorrect: true },
      { text: `${fake10A}${unitSuffix}`, isCorrect: false },
      { text: `${fake10B}${unitSuffix}`, isCorrect: false },
      { text: `${fake10C}${unitSuffix}`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: isPercentageQuestion
        ? 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΣΤΑΤΙΣΤΙΚΗΣ & ΠΟΣΟΣΤΩΝ'
        : 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΣΤΑΤΙΣΤΙΚΗΣ ΑΠΕΙΚΟΝΙΣΗΣ',
      instruction: 'Παρατηρήστε το σχήμα και επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      barChart: hardProb2.barChart,
      pictogram: hardProb2.pictogram,
      options: optionsQ10,
      correctText: `${hardProb2.correctStr}${unitSuffix}`,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function ApeikonisiDataExercisesPage() {
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
      title="Ασκήσεις: Απεικόνιση Δεδομένων (Ραβδόγραμμα & Εικονόγραμμα) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στα ραβδογράμματα, τα εικονογράμματα, την ερμηνεία υπομνήματος και τον υπολογισμό συχνοτήτων για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/55-apeikonisi-data"
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
              Ασκήσεις: Ραβδόγραμμα &amp; Εικονόγραμμα
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με οπτικά γραφήματα και 4 ρεαλιστικά προβλήματα. Διαβάστε κλίμακες αξόνων, ερμηνεύστε υπομνήματα εικονογραμμάτων και υπολογίστε συχνότητες, διαφορές και ποσοστά.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους και οπτικά σχήματα.
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

                {/* ΟΠΤΙΚΟ ΣΧΗΜΑ (ΑΝ ΥΠΑΡΧΕΙ ΡΑΒΔΟΓΡΑΜΜΑ Η ΕΙΚΟΝΟΓΡΑΜΜΑ) */}
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
                            className={`p-3 rounded-2xl border text-left font-semibold text-xs sm:text-base transition active:scale-98 touch-manipulation flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1">
                              {opt.text}
                            </span>
                            <span
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center text-[10px] sm:text-xs shrink-0 mt-0.5 ${
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

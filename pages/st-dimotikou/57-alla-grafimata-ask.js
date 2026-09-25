// pages/st-dimotikou/57-alla-grafimata-ask.js
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

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 1) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// =========================================================================
// ΟΠΤΙΚΑ ΒΟΗΘΗΤΙΚΑ COMPONENTS (ΓΡΑΦΗΜΑ ΓΡΑΜΜΗΣ, ΟΡΙΖΟΝΤΙΟ, ΚΥΚΛΙΚΟ)
// =========================================================================

// Αντικατάσταση των οπτικών components στο 57-alla-grafimata-ask.js

function MiniLineChart({ points, maxVal = 30, yStep = 10, unit = '°C' }) {
  const chartHeight = 160;
  const paddingLeft = 50;
  const chartWidth = 490;
  
  const yTicks = [];
  for (let v = 0; v <= maxVal; v += yStep) {
    yTicks.push(v);
  }

  const stepX = (chartWidth - paddingLeft - 50) / Math.max(1, points.length - 1);
  const pts = points.map((p, i) => {
    const px = paddingLeft + 25 + i * stepX;
    const py = chartHeight + 20 - (p.value / maxVal) * chartHeight;
    return { px, py, ...p };
  });

  const polylineStr = pts.map((p) => `${p.px},${p.py}`).join(' ');

  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-4 sm:p-6 my-4 w-full max-w-2xl shadow-inner">
      <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider text-center mb-3">
        ΣΧΗΜΑ: ΓΡΑΦΗΜΑ ΓΡΑΜΜΗΣ
      </div>
      <div className="w-full aspect-[16/9] sm:aspect-[2/1] bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm flex items-center justify-center">
        <svg viewBox="0 0 520 230" className="w-full h-full overflow-visible">
          {/* Οριζόντιες γραμμές πλέγματος */}
          {yTicks.map((val) => {
            const y = chartHeight + 20 - (val / maxVal) * chartHeight;
            return (
              <g key={`l-tick-${val}`}>
                <line x1={paddingLeft} y1={y} x2={chartWidth} y2={y} stroke="#f1f5f9" strokeWidth="1.5" />
                <text x={paddingLeft - 8} y={y + 4.5} fontSize="12" fontWeight="bold" fill="#64748b" textAnchor="end">
                  {val}{unit}
                </text>
              </g>
            );
          })}

          {/* Άξονες X και Y */}
          <line x1={paddingLeft} y1={chartHeight + 20} x2={chartWidth + 10} y2={chartHeight + 20} stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={paddingLeft} y1={chartHeight + 20} x2={paddingLeft} y2="12" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />

          {/* Γραμμή γραφήματος */}
          <polyline points={polylineStr} fill="none" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Σημεία και Ετικέτες */}
          {pts.map((p, idx) => (
            <g key={`pt-${idx}`}>
              <circle cx={p.px} cy={p.py} r="6.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2.5" />
              <text x={p.px} y={p.py - 10} fontSize="13" fontWeight="900" fill="#0f172a" textAnchor="middle">
                {p.value}{unit}
              </text>
              <text x={p.px} y={chartHeight + 42} fontSize="12" fontWeight="bold" fill="#475569" textAnchor="middle">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function MiniHBarChart({ data, maxVal = 50, xStep = 10, unit = '' }) {
  const chartWidth = 340;
  const paddingLeft = 90;
  const xTicks = [];
  for (let v = 0; v <= maxVal; v += xStep) {
    xTicks.push(v);
  }

  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-4 sm:p-6 my-4 w-full max-w-2xl shadow-inner">
      <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider text-center mb-3">
        ΣΧΗΜΑ: ΟΡΙΖΟΝΤΙΟ ΡΑΒΔΟΓΡΑΜΜΑ
      </div>
      <div className="w-full aspect-[16/9] sm:aspect-[2/1] bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm flex items-center justify-center">
        <svg viewBox="0 0 480 200" className="w-full h-full overflow-visible">
          {xTicks.map((val) => {
            const x = paddingLeft + (val / maxVal) * chartWidth;
            return (
              <g key={`h-tick-${val}`}>
                <line x1={x} y1="15" x2={x} y2="155" stroke="#f1f5f9" strokeWidth="1.5" />
                <text x={x} y="174" fontSize="11" fontWeight="bold" fill="#64748b" textAnchor="middle">
                  {val}{unit}
                </text>
              </g>
            );
          })}
          <line x1={paddingLeft} y1="155" x2={paddingLeft + chartWidth + 15} y2="155" stroke="#334155" strokeWidth="2.5" />
          <line x1={paddingLeft} y1="155" x2={paddingLeft} y2="15" stroke="#334155" strokeWidth="2.5" />

          {data.map((item, idx) => {
            const bh = 26;
            const by = 25 + idx * 42;
            const bw = (item.value / maxVal) * chartWidth;
            return (
              <g key={`hbar-it-${idx}`}>
                <text x={paddingLeft - 10} y={by + 18} fontSize="12" fontWeight="bold" fill="#334155" textAnchor="end">
                  {item.label}
                </text>
                <rect x={paddingLeft} y={by} width={Math.max(bw, 3)} height={bh} fill={item.color || '#3b82f6'} rx="5" />
                <text x={paddingLeft + bw + 10} y={by + 19} fontSize="13" fontWeight="900" fill="#0f172a">
                  {item.value}{unit}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function MiniPieChart({ slices }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  let cumulativeAngle = 0;
  const renderedSlices = slices.map((s, idx) => {
    const startAngle = cumulativeAngle;
    const sliceAngle = total > 0 ? (s.value / total) * 360 : 0;
    cumulativeAngle += sliceAngle;

    const x1 = 100 + 80 * Math.cos((Math.PI * (startAngle - 90)) / 180);
    const y1 = 100 + 80 * Math.sin((Math.PI * (startAngle - 90)) / 180);
    const x2 = 100 + 80 * Math.cos((Math.PI * (startAngle + sliceAngle - 90)) / 180);
    const y2 = 100 + 80 * Math.sin((Math.PI * (startAngle + sliceAngle - 90)) / 180);
    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      ...s,
      pathData,
      sliceAngle
    };
  });

  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-4 sm:p-6 my-4 w-full max-w-2xl shadow-inner space-y-3">
      <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
        ΣΧΗΜΑ: ΚΥΚΛΙΚΟ ΔΙΑΓΡΑΜΜΑ
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-around gap-6 shadow-sm">
        <svg viewBox="0 0 200 200" className="w-40 h-40 sm:w-48 sm:h-48 shrink-0 overflow-visible">
          {renderedSlices.map((s, idx) => (
            <path key={`slice-${idx}`} d={s.pathData} fill={s.color} stroke="#ffffff" strokeWidth="2" />
          ))}
        </svg>

        <div className="flex flex-col gap-2.5 text-xs sm:text-sm font-mono w-full sm:w-auto">
          {slices.map((s, idx) => (
            <div key={`pie-legend-${idx}`} className="flex items-center justify-between sm:justify-start gap-2.5 p-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                <span className="font-sans font-bold text-slate-700">{s.label}:</span>
              </div>
              <span className="font-bold text-slate-900">{s.value}% ({formatNum((s.value / 100) * 360, 0)}°)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// ΔΕΞΑΜΕΝΕΣ ΘΕΜΑΤΩΝ
// =========================================================================

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'graf_std_1',
    generate: () => {
      const t1 = randInt(10, 14);
      const t2 = randInt(18, 24);
      const t3 = randInt(15, 20);
      const t4 = randInt(11, 15);
      const maxT = Math.max(t1, t2, t3, t4);
      return {
        text: `Στο παρακάτω γράφημα γραμμής καταγράφηκε η θερμοκρασία σε διάφορες ώρες της ημέρας. Ποια ήταν η μέγιστη θερμοκρασία (°C) που σημειώθηκε;`,
        lineChart: {
          points: [
            { label: '08:00', value: t1 },
            { label: '12:00', value: t2 },
            { label: '16:00', value: t3 },
            { label: '20:00', value: t4 }
          ],
          maxVal: 30,
          yStep: 10,
          unit: '°C'
        },
        correctVal: maxT,
        correctStr: String(maxT),
        unit: '°C',
        explanation: `Παρατηρούμε το ψηλότερο σημείο του γραφήματος γραμμής: η μέγιστη θερμοκρασία είναι ${maxT}°C.`
      };
    }
  },
  {
    id: 'graf_std_2',
    generate: () => {
      const vA = randInt(25, 45);
      const vB = randInt(15, 30);
      const vC = randInt(30, 50);
      const total = vA + vB + vC;
      return {
        text: `Στο παρακάτω οριζόντιο ραβδόγραμμα καταγράφονται οι πωλήσεις τριών προϊόντων. Πόσα τεμάχια πουλήθηκαν συνολικά;`,
        hbarChart: {
          data: [
            { label: 'Προϊόν Α', value: vA, color: '#3b82f6' },
            { label: 'Προϊόν Β', value: vB, color: '#10b981' },
            { label: 'Προϊόν Γ', value: vC, color: '#f59e0b' }
          ],
          maxVal: 60,
          xStep: 15,
          unit: ''
        },
        correctVal: total,
        correctStr: String(total),
        unit: 'τεμάχια',
        explanation: `Διαβάζουμε τα μήκη των οριζόντιων ράβδων και αθροίζουμε: ${vA} ＋ ${vB} ＋ ${vC} ＝ ${total} τεμάχια.`
      };
    }
  },
  {
    id: 'graf_std_3',
    generate: () => {
      const pct = pickRandom([20, 25, 30, 40, 50]);
      const deg = (pct * 360) / 100;
      return {
        text: `Ένας κυκλικός τομέας σε ένα κυκλικό διάγραμμα αντιπροσωπεύει το ${pct} % του συνόλου. Πόσες μοίρες (°) είναι η επίκεντρη γωνία αυτού του τομέα;`,
        correctVal: deg,
        correctStr: formatNum(deg),
        unit: '°',
        explanation: `Ολόκληρος ο κύκλος είναι 360° (100%). Η επίκεντρη γωνία υπολογίζεται με αναλογία: (${pct} · 360°) : 100 ＝ ${formatNum(deg)}°.`
      };
    }
  },
  {
    id: 'graf_std_4',
    generate: () => {
      const deg = pickRandom([90, 180, 72, 36, 144]);
      const pct = (deg / 360) * 100;
      return {
        text: `Σε ένα κυκλικό διάγραμμα, ένας τομέας έχει επίκεντρη γωνία ${deg}°. Τι ποσοστό (%) του συνόλου αντιπροσωπεύει αυτός ο τομέας;`,
        correctVal: pct,
        correctStr: String(pct),
        unit: '%',
        explanation: `Διαιρούμε τις μοίρες με τις 360° του κύκλου και πολλαπλασιάζουμε με το 100: (${deg} : 360) · 100 ＝ ${pct} %.`
      };
    }
  },
  {
    id: 'graf_std_5',
    generate: () => {
      const pA = 50;
      const pB = 30;
      const pC = 20;
      return {
        text: `Στο παρακάτω κυκλικό διάγραμμα καταγράφονται οι επιλογές των μαθητών. Πόσες μοίρες (°) αντιστοιχούν στην Κατηγορία Β (30%);`,
        pieChart: {
          slices: [
            { label: 'Κατηγορία Α', value: pA, color: '#3b82f6' },
            { label: 'Κατηγορία Β', value: pB, color: '#10b981' },
            { label: 'Κατηγορία Γ', value: pC, color: '#f59e0b' }
          ]
        },
        correctVal: 108,
        correctStr: '108',
        unit: '°',
        explanation: `Για ποσοστό 30%: (30 · 360°) : 100 ＝ 108°.`
      };
    }
  },
  {
    id: 'graf_std_6',
    generate: () => {
      const v1 = 12;
      const v2 = 26;
      const diff = v2 - v1;
      return {
        text: `Στο παρακάτω γράφημα γραμμής, κατά πόσους βαθμούς (°C) αυξήθηκε η θερμοκρασία από τις 08:00 μέχρι τις 14:00;`,
        lineChart: {
          points: [
            { label: '08:00', value: v1 },
            { label: '14:00', value: v2 },
            { label: '20:00', value: 16 }
          ],
          maxVal: 30,
          yStep: 10,
          unit: '°C'
        },
        correctVal: diff,
        correctStr: String(diff),
        unit: '°C',
        explanation: `Στις 14:00 η θερμοκρασία ήταν ${v2}°C και στις 08:00 ήταν ${v1}°C. Αύξηση: ${v2} － ${v1} ＝ ${diff}°C.`
      };
    }
  },
  {
    id: 'graf_std_7',
    generate: () => {
      const vA = 18;
      const vB = 32;
      const diff = vB - vA;
      return {
        text: `Στο οριζόντιο ραβδόγραμμα καταγράφονται οι δανεισμοί βιβλίων δύο τμημάτων. Πόσα περισσότερα βιβλία δανείστηκε το Τμήμα 2 από το Τμήμα 1;`,
        hbarChart: {
          data: [
            { label: 'Τμήμα 1', value: vA, color: '#64748b' },
            { label: 'Τμήμα 2', value: vB, color: '#2563eb' }
          ],
          maxVal: 40,
          xStep: 10,
          unit: ''
        },
        correctVal: diff,
        correctStr: String(diff),
        unit: 'βιβλία',
        explanation: `Διαβάζουμε από το οριζόντιο ραβδόγραμμα: Τμήμα 2 ＝ ${vB} και Τμήμα 1 ＝ ${vA}. Διαφορά: ${vB} － ${vA} ＝ ${diff} βιβλία.`
      };
    }
  },
  {
    id: 'graf_std_8',
    generate: () => {
      return {
        text: `Ποιο είδος γραφήματος είναι το πλέον κατάλληλο για να δείξουμε τη διαχρονική εξέλιξη ενός μεγέθους στο πέρασμα του χρόνου;`,
        options: [
          { text: 'Γράφημα Γραμμής (Χρονοσειρά)', isCorrect: true },
          { text: 'Κυκλικό Διάγραμμα', isCorrect: false },
          { text: 'Εικονόγραμμα', isCorrect: false },
          { text: 'Πίνακας αφαίρεσης', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: 'Γράφημα Γραμμής (Χρονοσειρά)',
        unit: '',
        explanation: `Το γράφημα γραμμής είναι ιδανικό για να παρακολουθούμε πώς μεταβάλλεται ένα μέγεθος στον χρόνο (τάσεις ανόδου/καθόδου).`
      };
    }
  },
  {
    id: 'graf_std_9',
    generate: () => {
      const vA = 20;
      const vB = 30;
      const vC = 50;
      return {
        text: `Σε ένα κυκλικό διάγραμμα τριών κατηγοριών, η Κατηγορία Α καλύπτει 20% και η Κατηγορία Β καλύπτει 30%. Τι ποσοστό (%) καλύπτει η Κατηγορία Γ;`,
        correctVal: vC,
        correctStr: String(vC),
        unit: '%',
        explanation: `Ολόκληρος ο κύκλος είναι 100%. Άρα: 100 % － (20 % ＋ 30 %) ＝ 100 % － 50 % ＝ 50 %.`
      };
    }
  },
  {
    id: 'graf_std_10',
    generate: () => {
      return {
        text: `Πόσο ισούται πάντοτε το άθροισμα των επίκεντρων γωνιών όλων των τομέων σε ένα πλήρες κυκλικό διάγραμμα;`,
        options: [
          { text: '360°', isCorrect: true },
          { text: '180°', isCorrect: false },
          { text: '100°', isCorrect: false },
          { text: '90°', isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        correctText: '360°',
        unit: '',
        explanation: `Ένας πλήρης κύκλος έχει συνολικά 360°, επομένως το άθροισμα όλων των επίκεντρων γωνιών ισούται πάντοτε με 360°.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'graf_hard_1',
    generate: () => {
      const minT = 8;
      const maxT = 24;
      const range = maxT - minT; // 16°C
      return {
        text: `Στο παρακάτω γράφημα γραμμής καταγράφηκαν οι θερμοκρασίες μιας ημέρας. Ποιο είναι το εύρος διακύμανσης της θερμοκρασίας (Μέγιστη － Ελάχιστη τιμή) σε °C;`,
        lineChart: {
          points: [
            { label: '06:00', value: minT },
            { label: '10:00', value: 16 },
            { label: '14:00', value: maxT },
            { label: '18:00', value: 19 },
            { label: '22:00', value: 12 }
          ],
          maxVal: 30,
          yStep: 10,
          unit: '°C'
        },
        correctVal: range,
        correctStr: String(range),
        unit: '°C',
        explanation: `Εύρος ＝ Μέγιστη τιμή (${maxT}°C) － Ελάχιστη τιμή (${minT}°C) ＝ ${range}°C.`
      };
    }
  },
  {
    id: 'graf_hard_2',
    generate: () => {
      const pMath = 40;
      const pLang = 35;
      const pHist = 25;
      const degHist = (pHist * 360) / 100; // 90°
      return {
        text: `Στο παρακάτω κυκλικό διάγραμμα καταγράφονται οι αγαπημένες θεματικές ενότητες των μαθητών. Πόσες μοίρες (°) είναι η επίκεντρη γωνία του τομέα της Ιστορίας (25%);`,
        pieChart: {
          slices: [
            { label: 'Μαθηματικά', value: pMath, color: '#3b82f6' },
            { label: 'Γλώσσα', value: pLang, color: '#10b981' },
            { label: 'Ιστορία', value: pHist, color: '#f59e0b' }
          ]
        },
        correctVal: degHist,
        correctStr: String(degHist),
        unit: '°',
        explanation: `Για ποσοστό 25%: (25 · 360°) : 100 ＝ 90°.`
      };
    }
  },
  {
    id: 'graf_hard_3',
    generate: () => {
      const vMon = 20;
      const vTue = 35;
      const vWed = 45;
      const total = vMon + vTue + vWed; // 100
      const pctWed = (vWed / total) * 100; // 45%
      return {
        text: `Στο οριζόντιο ραβδόγραμμα φαίνεται η προσέλευση 100 πελατών σε ένα κατάστημα για 3 ημέρες. Τι ποσοστό (%) των πελατών προσήλθε την Τετάρτη;`,
        hbarChart: {
          data: [
            { label: 'Δευτέρα', value: vMon, color: '#64748b' },
            { label: 'Τρίτη', value: vTue, color: '#f59e0b' },
            { label: 'Τετάρτη', value: vWed, color: '#10b981' }
          ],
          maxVal: 50,
          xStep: 10,
          unit: ''
        },
        correctVal: pctWed,
        correctStr: String(pctWed),
        unit: '%',
        explanation: `Η Τετάρτη έχει 45 πελάτες σε σύνολο 100 πελατών, άρα το ποσοστό είναι απευθείας 45 %.`
      };
    }
  },
  {
    id: 'graf_hard_4',
    generate: () => {
      const totalBudget = 1200;
      const rentPct = 40;
      const rentAmount = (totalBudget * rentPct) / 100; // 480 €
      return {
        text: `Σε ένα κυκλικό διάγραμμα οικογενειακού προϋπολογισμού 1.200 €, ο τομέας του ενοικίου έχει επίκεντρη γωνία 144° (που αντιστοιχεί σε 40%). Πόσα ευρώ (€) δαπανώνται για το ενοίκιο;`,
        correctVal: rentAmount,
        correctStr: String(rentAmount),
        unit: '€',
        explanation: `Υπολογίζουμε το 40% των 1.200 €: (1.200 · 40) : 100 ＝ 480 €.`
      };
    }
  },
  {
    id: 'graf_hard_5',
    generate: () => {
      const degA = 120;
      const degB = 90;
      const degC = 360 - degA - degB; // 150°
      return {
        text: `Σε ένα κυκλικό διάγραμμα τριών δραστηριοτήτων, ο πρώτος τομέας έχει γωνία 120° και ο δεύτερος 90°. Πόσες μοίρες (°) είναι η γωνία του τρίτου τομέα;`,
        correctVal: degC,
        correctStr: String(degC),
        unit: '°',
        explanation: `Ολόκληρος ο κύκλος έχει 360°: 360° － (120° ＋ 90°) ＝ 360° － 210° ＝ 150°.`
      };
    }
  },
  {
    id: 'graf_hard_6',
    generate: () => {
      const vA = 15;
      const vB = 25;
      const vC = 40;
      const total = vA + vB + vC; // 80
      const avg = total / 3; // 26.7
      return {
        text: `Στο παρακάτω οριζόντιο ραβδόγραμμα καταγράφονται οι ημερήσιες πωλήσεις 3 ημερών: Ημέρα 1 (15), Ημέρα 2 (25), Ημέρα 3 (50). Πόσες ήταν οι συνολικές πωλήσεις των τριών ημερών;`,
        hbarChart: {
          data: [
            { label: 'Ημέρα 1', value: 15, color: '#94a3b8' },
            { label: 'Ημέρα 2', value: 25, color: '#38bdf8' },
            { label: 'Ημέρα 3', value: 50, color: '#0284c7' }
          ],
          maxVal: 60,
          xStep: 15,
          unit: ''
        },
        correctVal: 90,
        correctStr: '90',
        unit: 'πωλήσεις',
        explanation: `15 ＋ 25 ＋ 50 ＝ 90 πωλήσεις.`
      };
    }
  },
  {
    id: 'graf_hard_7',
    generate: () => {
      const pct = 15;
      const deg = (pct * 360) / 100; // 54°
      return {
        text: `Ένα κυκλικό διάγραμμα απεικονίζει τις προτιμήσεις σε ένα άθλημα με ποσοστό 15%. Πόσες μοίρες (°) πρέπει να έχει η επίκεντρη γωνία του τομέα αυτού;`,
        correctVal: deg,
        correctStr: formatNum(deg),
        unit: '°',
        explanation: `(15 · 360°) : 100 ＝ 5.400 : 100 ＝ 54°.`
      };
    }
  },
  {
    id: 'graf_hard_8',
    generate: () => {
      const t0 = 10;
      const t1 = 15;
      const t2 = 25;
      const t3 = 20;
      const sum = t0 + t1 + t2 + t3; // 70
      const avg = sum / 4; // 17.5
      return {
        text: `Στο γράφημα γραμμής καταγράφηκε η θερμοκρασία σε 4 χρονικές στιγμές: 10°C, 15°C, 25°C, 20°C. Ποια ήταν η μέση θερμοκρασία (°C);`,
        lineChart: {
          points: [
            { label: '06:00', value: t0 },
            { label: '12:00', value: t1 },
            { label: '15:00', value: t2 },
            { label: '18:00', value: t3 }
          ],
          maxVal: 30,
          yStep: 10,
          unit: '°C'
        },
        correctVal: avg,
        correctStr: formatNum(avg),
        unit: '°C',
        explanation: `Μέσος όρος ＝ (10 ＋ 15 ＋ 25 ＋ 20) : 4 ＝ 70 : 4 ＝ 17,5°C.`
      };
    }
  },
  {
    id: 'graf_hard_9',
    generate: () => {
      const deg = 18;
      const pct = (deg / 360) * 100; // 5%
      return {
        text: `Σε ένα κυκλικό διάγραμμα, ένας μικρός τομέας έχει επίκεντρη γωνία 18°. Τι ποσοστό (%) του κύκλου αντιπροσωπεύει;`,
        correctVal: pct,
        correctStr: String(pct),
        unit: '%',
        explanation: `(18 : 360) · 100 ＝ 0,05 · 100 ＝ 5 %.`
      };
    }
  },
  {
    id: 'graf_hard_10',
    generate: () => {
      const pA = 45;
      const pB = 35;
      const pC = 20;
      return {
        text: `Στο παρακάτω κυκλικό διάγραμμα, πόσες μοίρες (°) είναι η γωνία της Κατηγορίας Α (45%);`,
        pieChart: {
          slices: [
            { label: 'Κατηγορία Α', value: pA, color: '#3b82f6' },
            { label: 'Κατηγορία Β', value: pB, color: '#10b981' },
            { label: 'Κατηγορία Γ', value: pC, color: '#f59e0b' }
          ]
        },
        correctVal: 162,
        correctStr: '162',
        unit: '°',
        explanation: `Για 45%: (45 · 360°) : 100 ＝ 16.200 : 100 ＝ 162°.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Decimal): Ανάγνωση μέγιστης τιμής από γράφημα γραμμής
  {
    const t1 = randInt(12, 15);
    const t2 = randInt(22, 26);
    const t3 = randInt(18, 21);
    const t4 = randInt(14, 17);
    const maxT = Math.max(t1, t2, t3, t4);

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 1 • ΑΝΑΓΝΩΣΗ ΓΡΑΦΗΜΑΤΟΣ ΓΡΑΜΜΗΣ',
      instruction: 'Παρατηρήστε το γράφημα γραμμής και υπολογίστε τη μέγιστη τιμή:',
      prompt: `Ποια ήταν η μέγιστη θερμοκρασία (°C) που καταγράφηκε στη διάρκεια της ημέρας;`,
      lineChart: {
        points: [
          { label: '08:00', value: t1 },
          { label: '12:00', value: t2 },
          { label: '16:00', value: t3 },
          { label: '20:00', value: t4 }
        ],
        maxVal: 30,
        yStep: 10,
        unit: '°C'
      },
      correctVal: maxT,
      correctStr: String(maxT),
      explanation: `Παρατηρούμε το ψηλότερο σημείο του γραφήματος: η μέγιστη θερμοκρασία είναι ${maxT}°C.`
    });
  }

  // Q2 (MCQ): Καταλληλότητα γραφήματος γραμμής
  {
    const correctUse = 'Όταν θέλουμε να δείξουμε πώς μεταβάλλεται ένα μέγεθος στο πέρασμα του χρόνου';
    const fake1 = 'Μόνο όταν έχουμε ακριβώς δύο κατηγορίες';
    const fake2 = 'Όταν θέλουμε να σχεδιάσουμε μια πίτα ποσοστών';
    const fake3 = 'Για να αντικαταστήσουμε τον πολλαπλασιασμό με διαίρεση';

    const options = [
      { text: correctUse, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 2 • ΧΡΗΣΗ ΓΡΑΦΗΜΑΤΟΣ ΓΡΑΜΜΗΣ',
      instruction: 'Επιλέξτε τη σωστή εφαρμογή:',
      prompt: `Σε ποια περίπτωση χρησιμοποιούμε κατά προτίμηση ένα γράφημα γραμμής (χρονοσειρά);`,
      options,
      correctText: correctUse,
      explanation: `Το γράφημα γραμμής χρησιμοποιείται για να αναδείξει τη μεταβολή και την τάση ενός μεγέθους στον χρόνο.`
    });
  }

  // Q3 (Input - Decimal): Υπολογισμός επίκεντρης γωνίας από ποσοστό
  {
    const pct = pickRandom([20, 25, 40, 50]);
    const deg = (pct * 360) / 100;

    qList.push({
      id: 3,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 3 • ΕΠΙΚΕΝΤΡΗ ΓΩΝΙΑ ΣΕ ΚΥΚΛΙΚΟ ΔΙΑΓΡΑΜΜΑ',
      instruction: 'Υπολογίστε τις μοίρες (°) της επίκεντρης γωνίας:',
      prompt: `Σε ένα κυκλικό διάγραμμα, ένας τομέας αντιπροσωπεύει το ${pct} % του συνόλου. Πόσες μοίρες (°) είναι η επίκεντρη γωνία αυτού του τομέα;`,
      correctVal: deg,
      correctStr: formatNum(deg),
      explanation: `Ολόκληρος ο κύκλος αντιστοιχεί σε 360° (100%). Γωνία: (${pct} · 360°) : 100 ＝ ${formatNum(deg)}°.`
    });
  }

  // Q4 (MCQ): Πότε προτιμάται το οριζόντιο ραβδόγραμμα
  {
    const correctReason = 'Όταν οι κατηγορίες έχουν μεγάλα ονόματα ή θέλουμε να διαβάζονται ευκολότερα';
    const fake1 = 'Όταν όλες οι τιμές είναι ίσες με το μηδέν';
    const fake2 = 'Μόνο όταν έχουμε θερμοκρασίες κάτω από το μηδέν';
    const fake3 = 'Επειδή απαγορεύεται το κατακόρυφο ραβδόγραμμα στη ΣΤ Δημοτικού';

    const options = [
      { text: correctReason, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 4 • ΟΡΙΖΟΝΤΙΟ ΡΑΒΔΟΓΡΑΜΜΑ',
      instruction: 'Επιλέξτε το πλεονέκτημα του οριζόντιου ραβδογράμματος:',
      prompt: `Για ποιο λόγο προτιμάμε συχνά ένα οριζόντιο ραβδόγραμμα αντί για κατακόρυφο;`,
      options,
      correctText: correctReason,
      explanation: `Στο οριζόντιο ραβδόγραμμα τα ονόματα των κατηγοριών γράφονται άνετα στον κατακόρυφο άξονα χωρίς να επικαλύπτονται.`
    });
  }

  // Q5 (Input - Decimal): Ανάγνωση αθροίσματος από οριζόντιο ραβδόγραμμα
  {
    const v1 = randInt(15, 25);
    const v2 = randInt(20, 30);
    const total = v1 + v2;

    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'ΕΡΩΤΗΣΗ 5 • ΑΝΑΓΝΩΣΗ ΟΡΙΖΟΝΤΙΟΥ ΡΑΒΔΟΓΡΑΜΜΑΤΟΣ',
      instruction: 'Παρατηρήστε το οριζόντιο ραβδόγραμμα και βρείτε το σύνολο:',
      prompt: `Πόσα βιβλία δανείστηκαν συνολικά τα δύο τμήματα;`,
      hbarChart: {
        data: [
          { label: 'ΣΤ1 Τμήμα', value: v1, color: '#3b82f6' },
          { label: 'ΣΤ2 Τμήμα', value: v2, color: '#10b981' }
        ],
        maxVal: 35,
        xStep: 10,
        unit: ''
      },
      correctVal: total,
      correctStr: String(total),
      explanation: `Διαβάζουμε τα μήκη των ράβδων: ${v1} ＋ ${v2} ＝ ${total} βιβλία.`
    });
  }

  // Q6 (MCQ): Άθροισμα μοιρών κυκλικού διαγράμματος
  {
    const correctDegrees = '360°';
    const fake1 = '180°';
    const fake2 = '100°';
    const fake3 = '90°';

    const options = [
      { text: correctDegrees, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'ΕΡΩΤΗΣΗ 6 • ΑΘΡΟΙΣΜΑ ΜΟΙΡΩΝ ΚΥΚΛΙΚΟΥ ΔΙΑΓΡΑΜΜΑΤΟΣ',
      instruction: 'Επιλέξτε το σωστό άθροισμα:',
      prompt: `Πόσο ισούται πάντοτε το άθροισμα των επίκεντρων γωνιών όλων των τομέων σε ένα πλήρες κυκλικό διάγραμμα;`,
      options,
      correctText: correctDegrees,
      explanation: `Ένας πλήρης κύκλος αποτελείται από 360°, επομένως όλες οι επιμέρους γωνίες μαζί αθροίζουν σε 360°.`
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
      instruction: 'Παρατηρήστε τα δεδομένα και υπολογίστε το αποτέλεσμα:',
      prompt: stdProb1.text,
      lineChart: stdProb1.lineChart,
      hbarChart: stdProb1.hbarChart,
      pieChart: stdProb1.pieChart,
      correctVal: stdProb1.correctVal,
      correctStr: stdProb1.correctStr,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const val8 = stdProb2.correctVal !== undefined ? stdProb2.correctVal : stdProb2.correctText;
    const unit8 = stdProb2.unit === '%' ? ' %' : (stdProb2.unit === '°' ? '°' : (stdProb2.unit ? ` ${stdProb2.unit}` : ''));

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
      title: 'ΕΡΩΤΗΣΗ 8 • ΕΡΜΗΝΕΙΑ ΓΡΑΦΗΜΑΤΟΣ',
      instruction: 'Επιλέξτε τη σωστή τιμή:',
      prompt: stdProb2.text,
      lineChart: stdProb2.lineChart,
      hbarChart: stdProb2.hbarChart,
      pieChart: stdProb2.pieChart,
      options: optionsQ8,
      correctText: stdProb2.correctText || `${stdProb2.correctStr}${unit8}`,
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
      title: 'ΕΡΩΤΗΣΗ 9 • ΣΥΝΘΕΤΟ ΠΡΟΒΛΗΜΑ ΓΡΑΦΗΜΑΤΩΝ',
      instruction: 'Παρατηρήστε προσεκτικά το σχήμα και εισαγάγετε το τελικό αποτέλεσμα:',
      prompt: hardProb1.text,
      lineChart: hardProb1.lineChart,
      hbarChart: hardProb1.hbarChart,
      pieChart: hardProb1.pieChart,
      correctVal: hardProb1.correctVal,
      correctStr: hardProb1.correctStr,
      explanation: hardProb1.explanation
    });

    // Q10 (MCQ Αυξημένης Δυσκολίας - Σύμβολο '%' ΜΟΝΟ όταν είναι ποσοστό)
    const val10 = hardProb2.correctVal !== undefined ? hardProb2.correctVal : hardProb2.correctText;
    const isPercentage = hardProb2.unit === '%';
    const isDegrees = hardProb2.unit === '°';
    const unitSuffix = isPercentage ? ' %' : (isDegrees ? '°' : (hardProb2.unit ? ` ${hardProb2.unit}` : ''));

    let optionsQ10 = hardProb2.options;
    if (!optionsQ10 && typeof val10 === 'number') {
      const fake10A = formatNum(val10 + randInt(5, 12));
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
      title: isPercentage
        ? 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΠΟΣΟΣΤΩΝ & ΓΡΑΦΗΜΑΤΩΝ'
        : (isDegrees ? 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΕΠΙΚΕΝΤΡΗΣ ΓΩΝΙΑΣ' : 'ΕΡΩΤΗΣΗ 10 • ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΣΤΑΤΙΣΤΙΚΗΣ'),
      instruction: 'Παρατηρήστε το σχήμα και επιλέξτε τη σωστή απάντηση:',
      prompt: hardProb2.text,
      lineChart: hardProb2.lineChart,
      hbarChart: hardProb2.hbarChart,
      pieChart: hardProb2.pieChart,
      options: optionsQ10,
      correctText: hardProb2.correctText || `${hardProb2.correctStr}${unitSuffix}`,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function AllaGrafimataExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργια νεων ασκησεων
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

  // Χειρισμος Input
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

  // Χειρισμος MCQ
  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  // Ελεγχος Απαντησεων
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
      title="Ασκήσεις: Άλλα Γραφήματα (Γραμμής, Οριζόντιο, Κυκλικό) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα στα γραφήματα γραμμής, τα οριζόντια ραβδογράμματα, τα κυκλικά διαγράμματα και τον υπολογισμό μοιρών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/57-alla-grafimata"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 pb-32">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-14 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ασκήσεις: Γράφημα Γραμμής, Οριζόντιο &amp; Κυκλικό Διάγραμμα
            </h1>
            <p className="text-sky-100 text-sm sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες με οπτικά γραφήματα και 4 ρεαλιστικά προβλήματα. Διαβάστε χρονοσειρές θερμοκρασιών, συγκρίνετε οριζόντιες ράβδους και υπολογίστε επίκεντρες γωνίες σε κυκλικά διαγράμματα.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους και οπτικά σχήματα.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm"
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
                className={`bg-white rounded-3xl border p-6 sm:p-8 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλιδα Ερωτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
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
                <div className="space-y-2 mb-3">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm font-semibold text-slate-500">
                      {q.instruction}
                    </p>
                  )}
                  <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>
                </div>

                {/* ΟΠΤΙΚΑ ΣΧΗΜΑΤΑ (ΑΝ ΥΠΑΡΧΟΥΝ) */}
                {q.lineChart && (
                  <MiniLineChart
                    points={q.lineChart.points}
                    maxVal={q.lineChart.maxVal}
                    yStep={q.lineChart.yStep}
                    unit={q.lineChart.unit}
                  />
                )}

                {q.hbarChart && (
                  <MiniHBarChart
                    data={q.hbarChart.data}
                    maxVal={q.hbarChart.maxVal}
                    xStep={q.hbarChart.xStep}
                    unit={q.hbarChart.unit}
                  />
                )}

                {q.pieChart && (
                  <MiniPieChart
                    slices={q.pieChart.slices}
                  />
                )}

                {/* Περιοχη Απαντησης */}
                <div className="py-2 pt-3">
                  
                  {/* Decimal / Number Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs text-slate-500">
                        (Ακέραιος η δεκαδικός με κόμμα)
                      </span>
                    </div>
                  )}

                  {/* Multiple Choice (MCQ) */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-sm sm:text-base transition active:scale-98 touch-manipulation flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span>{opt.text}</span>
                            <span
                              className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
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
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1.5 ${
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
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Απαντήσεων</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                ΣΚΟΡ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-base">/ 10</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-xs text-slate-400 font-semibold block">
                ΠΟΣΟΣΤΟ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
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

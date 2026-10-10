// pages/st-dimotikou/57-alla-grafimata-ask.js
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
// ΟΠΤΙΚΑ ΒΟΗΘΗΤΙΚΑ COMPONENTS (ΓΡΑΦΗΜΑ ΓΡΑΜΜΗΣ, ΟΡΙΖΟΝΤΙΟ, ΚΥΚΛΙΚΟ)
// =========================================================================

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
        {toCleanUppercase('Σχήμα: Γράφημα Γραμμής')}
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
        {toCleanUppercase('Σχήμα: Οριζόντιο Ραβδόγραμμα')}
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
        {toCleanUppercase('Σχήμα: Κυκλικό Διάγραμμα')}
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

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'graf_std_1',
    title: 'Μέγιστη Θερμοκρασία σε Γράφημα Γραμμής',
    unit: '°C',
    generate: () => {
      const t1 = randInt(10, 14);
      const t2 = randInt(18, 24);
      const t3 = randInt(15, 20);
      const t4 = randInt(11, 15);
      const maxT = Math.max(t1, t2, t3, t4);
      return {
        prompt: `Στο παρακάτω γράφημα γραμμής καταγράφηκε η θερμοκρασία σε διάφορες ώρες της ημέρας. Ποια ήταν η μέγιστη θερμοκρασία (°C) που σημειώθηκε;`,
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
        unit: '°C',
        correctVal: String(maxT),
        correctText: `${maxT} °C`,
        tableData: [
          { item: 'Καταγεγραμμένες τιμές', formula: `${t1}°C, ${t2}°C, ${t3}°C, ${t4}°C`, val: '4 μετρήσεις' },
          { item: 'Μέγιστη τιμή (κορυφή)', formula: `max(${t1}, ${t2}, ${t3}, ${t4})`, val: `${maxT} °C` }
        ],
        explain: `Παρατηρούμε το ψηλότερο σημείο του γραφήματος γραμμής: η μέγιστη θερμοκρασία είναι ${maxT}°C.`,
        distractors: [`${maxT - 2} °C`, `${maxT + 2} °C`, `${maxT - 4} °C`]
      };
    }
  },
  {
    id: 'graf_std_2',
    title: 'Σύνολο Πωλήσεων από Οριζόντιο Ραβδόγραμμα',
    unit: 'τεμάχια',
    generate: () => {
      const vA = randInt(25, 45);
      const vB = randInt(15, 30);
      const vC = randInt(30, 50);
      const total = vA + vB + vC;
      return {
        prompt: `Στο παρακάτω οριζόντιο ραβδόγραμμα καταγράφονται οι πωλήσεις τριών προϊόντων. Πόσα τεμάχια πουλήθηκαν συνολικά;`,
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
        unit: 'τεμάχια',
        correctVal: String(total),
        correctText: `${total} τεμάχια`,
        tableData: [
          { item: 'Προϊόν Α', formula: `${vA} τεμάχια`, val: `${vA}` },
          { item: 'Προϊόν Β', formula: `${vB} τεμάχια`, val: `${vB}` },
          { item: 'Προϊόν Γ', formula: `${vC} τεμάχια`, val: `${vC}` },
          { item: 'Συνολικό άθροισμα', formula: `${vA} ＋ ${vB} ＋ ${vC}`, val: `${total} τεμάχια` }
        ],
        explain: `Διαβάζουμε τα μήκη των οριζόντιων ράβδων και αθροίζουμε: ${vA} ＋ ${vB} ＋ ${vC} ＝ ${total} τεμάχια.`,
        distractors: [`${total + 10} τεμάχια`, `${total - 10} τεμάχια`, `${total + 15} τεμάχια`]
      };
    }
  },
  {
    id: 'graf_std_3',
    title: 'Υπολογισμός Επίκεντρης Γωνίας από Ποσοστό',
    unit: '°',
    generate: () => {
      const pct = pickRandom([20, 25, 30, 40, 50]);
      const deg = (pct * 360) / 100;
      return {
        prompt: `Ένας κυκλικός τομέας σε ένα κυκλικό διάγραμμα αντιπροσωπεύει το ${pct} % του συνόλου. Πόσες μοίρες (°) είναι η επίκεντρη γωνία αυτού του τομέα;`,
        unit: '°',
        correctVal: formatNum(deg),
        correctText: `${formatNum(deg)}°`,
        tableData: [
          { item: 'Ποσοστό τομέα', formula: `${pct} %`, val: `${pct} %` },
          { item: 'Πλήρης κύκλος', formula: '100 % αντιστοιχεί σε 360°', val: '360°' },
          { item: 'Επίκεντρη γωνία', formula: `(${pct} · 360°) : 100`, val: `${formatNum(deg)}°` }
        ],
        explain: `Ολόκληρος ο κύκλος είναι 360° (100%). Η επίκεντρη γωνία υπολογίζεται με αναλογία: (${pct} · 360°) : 100 ＝ ${formatNum(deg)}°.`,
        distractors: [`${formatNum(deg + 18)}°`, `${formatNum(Math.max(10, deg - 18))}°`, `${formatNum(deg + 36)}°`]
      };
    }
  },
  {
    id: 'graf_std_4',
    title: 'Υπολογισμός Ποσοστού από Επίκεντρη Γωνία',
    unit: '%',
    generate: () => {
      const deg = pickRandom([90, 180, 72, 36, 144]);
      const pct = (deg / 360) * 100;
      return {
        prompt: `Σε ένα κυκλικό διάγραμμα, ένας τομέας έχει επίκεντρη γωνία ${deg}°. Τι ποσοστό (%) του συνόλου αντιπροσωπεύει αυτός ο τομέας;`,
        unit: '%',
        correctVal: String(pct),
        correctText: `${pct} %`,
        tableData: [
          { item: 'Επίκεντρη γωνία', formula: `${deg}°`, val: `${deg}°` },
          { item: 'Πλήρης κύκλος', formula: '360°', val: '360°' },
          { item: 'Ποσοστό (%)', formula: `(${deg} : 360) · 100`, val: `${pct} %` }
        ],
        explain: `Διαιρούμε τις μοίρες με τις 360° του κύκλου και πολλαπλασιάζουμε με το 100: (${deg} : 360) · 100 ＝ ${pct} %.`,
        distractors: [`${pct + 10} %`, `${Math.max(5, pct - 5)} %`, `${pct + 15} %`]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'graf_hard_1',
    title: 'Εύρος Διακύμανσης Θερμοκρασίας',
    unit: '°C',
    generate: () => {
      const minT = 8;
      const maxT = 24;
      const range = maxT - minT;
      return {
        prompt: `Στο παρακάτω γράφημα γραμμής καταγράφηκαν οι θερμοκρασίες μιας ημέρας. Ποιο είναι το εύρος διακύμανσης της θερμοκρασίας (Μέγιστη － Ελάχιστη τιμή) σε °C;`,
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
        unit: '°C',
        correctVal: String(range),
        correctText: `${range} °C`,
        tableData: [
          { item: 'Μέγιστη θερμοκρασία', formula: 'Στις 14:00', val: `${maxT} °C` },
          { item: 'Ελάχιστη θερμοκρασία', formula: 'Στις 06:00', val: `${minT} °C` },
          { item: 'Εύρος διακύμανσης', formula: `${maxT} － ${minT}`, val: `${range} °C` }
        ],
        explain: `Εύρος ＝ Μέγιστη τιμή (${maxT}°C) － Ελάχιστη τιμή (${minT}°C) ＝ ${range}°C.`,
        distractors: [`${range + 4} °C`, `${range - 4} °C`, `${range + 6} °C`]
      };
    }
  },
  {
    id: 'graf_hard_2',
    title: 'Επίκεντρη Γωνία Τομέα σε Κυκλικό Διάγραμμα',
    unit: '°',
    generate: () => {
      const pMath = 40;
      const pLang = 35;
      const pHist = 25;
      const degHist = (pHist * 360) / 100;
      return {
        prompt: `Στο παρακάτω κυκλικό διάγραμμα καταγράφονται οι αγαπημένες θεματικές ενότητες των μαθητών. Πόσες μοίρες (°) είναι η επίκεντρη γωνία του τομέα της Ιστορίας (25%);`,
        pieChart: {
          slices: [
            { label: 'Μαθηματικά', value: pMath, color: '#3b82f6' },
            { label: 'Γλώσσα', value: pLang, color: '#10b981' },
            { label: 'Ιστορία', value: pHist, color: '#f59e0b' }
          ]
        },
        unit: '°',
        correctVal: String(degHist),
        correctText: `${degHist}°`,
        tableData: [
          { item: 'Ποσοστό Ιστορίας', formula: '25 %', val: '25 %' },
          { item: 'Επίκεντρη γωνία', formula: '(25 · 360°) : 100', val: `${degHist}°` }
        ],
        explain: `Για ποσοστό 25%: (25 · 360°) : 100 ＝ 90°.`,
        distractors: ['72°', '108°', '80°']
      };
    }
  },
  {
    id: 'graf_hard_3',
    title: 'Ποσοστό Προσέλευσης από Οριζόντιο Ραβδόγραμμα',
    unit: '%',
    generate: () => {
      const vMon = 20;
      const vTue = 35;
      const vWed = 45;
      const total = vMon + vTue + vWed;
      const pctWed = (vWed / total) * 100;
      return {
        prompt: `Στο οριζόντιο ραβδόγραμμα φαίνεται η προσέλευση 100 πελατών σε ένα κατάστημα για 3 ημέρες. Τι ποσοστό (%) των πελατών προσήλθε την Τετάρτη;`,
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
        unit: '%',
        correctVal: String(pctWed),
        correctText: `${pctWed} %`,
        tableData: [
          { item: 'Πελάτες Τετάρτης', formula: `${vWed} πελάτες`, val: `${vWed}` },
          { item: 'Συνολικοί πελάτες (3 ημέρες)', formula: `${total} πελάτες`, val: `${total}` },
          { item: 'Ποσοστό (%)', formula: `(${vWed} : ${total}) · 100`, val: `${pctWed} %` }
        ],
        explain: `Η Τετάρτη έχει 45 πελάτες σε σύνολο 100 πελατών, άρα το ποσοστό είναι απευθείας 45 %.`,
        distractors: ['35 %', '50 %', '40 %']
      };
    }
  },
  {
    id: 'graf_hard_4',
    title: 'Υπολογισμός Ποσού από Κυκλικό Διάγραμμα',
    unit: '€',
    generate: () => {
      const totalBudget = 1200;
      const rentPct = 40;
      const rentAmount = (totalBudget * rentPct) / 100;
      return {
        prompt: `Σε ένα κυκλικό διάγραμμα οικογενειακού προϋπολογισμού 1.200 €, ο τομέας του ενοικίου έχει επίκεντρη γωνία 144° (που αντιστοιχεί σε 40%). Πόσα ευρώ (€) δαπανώνται για το ενοίκιο;`,
        unit: '€',
        correctVal: String(rentAmount),
        correctText: `${rentAmount} €`,
        tableData: [
          { item: 'Συνολικός προϋπολογισμός', formula: `${totalBudget} €`, val: `${totalBudget} €` },
          { item: 'Ποσοστό ενοικίου', formula: '(144° : 360°) · 100', val: '40 %' },
          { item: 'Ποσό ενοικίου', formula: `(${totalBudget} · 40) : 100`, val: `${rentAmount} €` }
        ],
        explain: `Υπολογίζουμε το 40% των 1.200 €: (1.200 · 40) : 100 ＝ 480 €.`,
        distractors: [`${rentAmount + 60} €`, `${rentAmount - 60} €`, `${rentAmount + 120} €`]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions() {
  // Q1: Input - Ανάγνωση μέγιστης τιμής από γράφημα γραμμής
  const q1T1 = randInt(12, 15);
  const q1T2 = randInt(22, 26);
  const q1T3 = randInt(18, 21);
  const q1T4 = randInt(14, 17);
  const q1MaxT = Math.max(q1T1, q1T2, q1T3, q1T4);

  // Q2: MCQ - Καταλληλότητα γραφήματος γραμμής
  const q2Correct = 'Όταν θέλουμε να δείξουμε πώς μεταβάλλεται ένα μέγεθος στο πέρασμα του χρόνου';
  const q2Options = shuffle([
    q2Correct,
    'Μόνο όταν έχουμε ακριβώς δύο κατηγορίες',
    'Όταν θέλουμε να σχεδιάσουμε μια πίτα ποσοστών',
    'Για να αντικαταστήσουμε τον πολλαπλασιασμό με διαίρεση'
  ]);

  // Q3: Input - Υπολογισμός επίκεντρης γωνίας από ποσοστό
  const q3Pct = pickRandom([20, 25, 40, 50]);
  const q3Deg = (q3Pct * 360) / 100;

  // Q4: MCQ - Πότε προτιμάται το οριζόντιο ραβδόγραμμα
  const q4Correct = 'Όταν οι κατηγορίες έχουν μεγάλα ονόματα ή θέλουμε να διαβάζονται ευκολότερα';
  const q4Options = shuffle([
    q4Correct,
    'Όταν όλες οι τιμές είναι ίσες με το μηδέν',
    'Μόνο όταν έχουμε θερμοκρασίες κάτω από το μηδέν',
    'Επειδή απαγορεύεται το κατακόρυφο ραβδόγραμμα'
  ]);

  // Q5: Input - Ανάγνωση αθροίσματος από οριζόντιο ραβδόγραμμα
  const q5V1 = randInt(15, 25);
  const q5V2 = randInt(20, 30);
  const q5Total = q5V1 + q5V2;

  // Q6: MCQ - Άθροισμα μοιρών κυκλικού διαγράμματος
  const q6Correct = '360°';
  const q6Options = shuffle([
    q6Correct,
    '180°',
    '100°',
    '90°'
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
      title: 'Ανάγνωση Γραφήματος Γραμμής',
      prompt: 'Ποια ήταν η μέγιστη θερμοκρασία (°C) που καταγράφηκε στη διάρκεια της ημέρας;',
      lineChart: {
        points: [
          { label: '08:00', value: q1T1 },
          { label: '12:00', value: q1T2 },
          { label: '16:00', value: q1T3 },
          { label: '20:00', value: q1T4 }
        ],
        maxVal: 30,
        yStep: 10,
        unit: '°C'
      },
      correct: String(q1MaxT),
      explain: `Παρατηρούμε το ψηλότερο σημείο του γραφήματος: η μέγιστη θερμοκρασία είναι ${q1MaxT}°C.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: 'Χρήση Γραφήματος Γραμμής',
      prompt: 'Σε ποια περίπτωση χρησιμοποιούμε κατά προτίμηση ένα γράφημα γραμμής (χρονοσειρά);',
      options: q2Options,
      correct: q2Correct,
      explain: 'Το γράφημα γραμμής χρησιμοποιείται για να αναδείξει τη μεταβολή και την τάση ενός μεγέθους στον χρόνο.'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: 'Επίκεντρη Γωνία σε Κυκλικό Διάγραμμα',
      prompt: `Σε ένα κυκλικό διάγραμμα, ένας τομέας αντιπροσωπεύει το ${q3Pct} % του συνόλου. Πόσες μοίρες (°) είναι η επίκεντρη γωνία αυτού του τομέα; (γράψε μόνο τον αριθμό)`,
      correct: formatNum(q3Deg),
      explain: `Ολόκληρος ο κύκλος αντιστοιχεί σε 360° (100%). Γωνία: (${q3Pct} · 360°) : 100 ＝ ${formatNum(q3Deg)}°.`
    },
    {
      id: 'q4',
      type: 'mcq',
      title: 'Οριζόντιο Ραβδόγραμμα',
      prompt: 'Για ποιο λόγο προτιμάμε συχνά ένα οριζόντιο ραβδόγραμμα αντί για κατακόρυφο;',
      options: q4Options,
      correct: q4Correct,
      explain: 'Στο οριζόντιο ραβδόγραμμα τα ονόματα των κατηγοριών γράφονται άνετα στον κατακόρυφο άξονα χωρίς να επικαλύπτονται.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: 'Ανάγνωση Οριζόντιου Ραβδογράμματος',
      prompt: 'Πόσα βιβλία δανείστηκαν συνολικά τα δύο τμήματα;',
      hbarChart: {
        data: [
          { label: 'ΣΤ1 Τμήμα', value: q5V1, color: '#3b82f6' },
          { label: 'ΣΤ2 Τμήμα', value: q5V2, color: '#10b981' }
        ],
        maxVal: 35,
        xStep: 10,
        unit: ''
      },
      correct: String(q5Total),
      explain: `Διαβάζουμε τα μήκη των ράβδων: ${q5V1} ＋ ${q5V2} ＝ ${q5Total} βιβλία.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: 'Άθροισμα Μοιρών Κυκλικού Διαγράμματος',
      prompt: 'Πόσο ισούται πάντοτε το άθροισμα των επίκεντρων γωνιών όλων των τομέων σε ένα πλήρες κυκλικό διάγραμμα;',
      options: q6Options,
      correct: q6Correct,
      explain: 'Ένας πλήρης κύκλος αποτελείται από 360°, επομένως όλες οι επιμέρους γωνίες μαζί αθροίζουν σε 360°.'
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'decimal',
      title: `Πρόβλημα: ${q7Data.title}`,
      prompt: q7Data.prompt,
      lineChart: q7Data.lineChart,
      hbarChart: q7Data.hbarChart,
      pieChart: q7Data.pieChart,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: `Πρόβλημα: ${q8Data.title}`,
      prompt: q8Data.prompt,
      lineChart: q8Data.lineChart,
      hbarChart: q8Data.hbarChart,
      pieChart: q8Data.pieChart,
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
      lineChart: q9Data.lineChart,
      hbarChart: q9Data.hbarChart,
      pieChart: q9Data.pieChart,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `Σύνθετο Πρόβλημα: ${q9Data.title}`,
      prompt: q10Data.prompt,
      lineChart: q10Data.lineChart,
      hbarChart: q10Data.hbarChart,
      pieChart: q10Data.pieChart,
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

export default function AllaGrafimataExercisesPage() {
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
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').replace(/[%°€]/g, '').trim().toLowerCase();
      const cleanTarget = String(q.correct).replace(/\./g, ',').replace(/\s+/g, '').replace(/[%°€]/g, '').trim().toLowerCase();

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
      title="Ασκήσεις: Άλλα Γραφήματα (Γραμμής, Οριζόντιο, Κυκλικό) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα γραφήματα γραμμής, τα οριζόντια ραβδογράμματα και τα κυκλικά διαγράμματα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/57-alla-grafimata"
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
                <span>ΚΕΦΑΛΑΙΟ 57 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Διαδραστικές Ασκήσεις: Γράφημα Γραμμής, Οριζόντιο &amp; Κυκλικό Διάγραμμα
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                Λύσε τα 10 δυναμικά θέματα με οπτικά διαγράμματα, ερμηνεία χρονοσειρών θερμοκρασίας, οριζόντιες ράβδους και υπολογισμό επίκεντρων γωνιών!
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
                          placeholder={q.inputType === 'decimal' ? 'π.χ. 18' : 'Απάντηση...'}
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

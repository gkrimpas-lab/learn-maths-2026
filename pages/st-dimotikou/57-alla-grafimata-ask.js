// pages/st-dimotikou/57-alla-grafimata-ask.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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

// Δημιουργία 4 εγγυημένα μοναδικών επιλογών για MCQ
function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set([correct]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }

  let counter = 1;
  while (unique.size < 4) {
    const numericMatch = String(correct).match(/\d+/);
    if (numericMatch) {
      const baseNum = parseInt(numericMatch[0], 10);
      const fallbackVal = String(correct).replace(/\d+/, String(Math.max(1, baseNum + counter * 3)));
      unique.add(fallbackVal);
    } else {
      unique.add(`Επιλογή ${counter}`);
    }
    counter++;
  }

  return shuffle(Array.from(unique));
}

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Μορφοποίηση αριθμού (ακέραιος ή δεκαδικός ανάλογα με το locale)
function formatNum(val, locale = 'el', decimals = 1) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  const num = Number(val);
  if (Number.isInteger(num)) {
    return num.toLocaleString(loc);
  }
  return Number(num.toFixed(decimals)).toLocaleString(loc, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

// Κανονική κατακόρυφη μορφή κλάσματος (responsive, mobile safe)
function Fraction({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-1 pb-0.5 text-center break-all">
        {num}
      </span>
      <span className="px-1 pt-0.5 text-center break-all">
        {den}
      </span>
    </span>
  );
}

// =========================================================================
// ΟΠΤΙΚΑ ΒΟΗΘΗΤΙΚΑ COMPONENTS (ΓΡΑΦΗΜΑ ΓΡΑΜΜΗΣ, ΟΡΙΖΟΝΤΙΟ, ΚΥΚΛΙΚΟ)
// =========================================================================

function MiniLineChart({ points, maxVal = 30, yStep = 10, unit = '°C', chartTitle }) {
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
    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-3.5 sm:p-5 my-3.5 w-full max-w-2xl shadow-inner min-w-0 box-border">
      <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-2 sm:mb-3 break-words [overflow-wrap:anywhere]">
        {toCleanUppercase(chartTitle || 'Σχήμα: Γράφημα Γραμμής')}
      </div>
      <div className="w-full aspect-[16/9] sm:aspect-[2/1] bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-sm flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 520 230" className="w-full h-auto max-h-[220px] overflow-visible">
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

function MiniHBarChart({ data, maxVal = 50, xStep = 10, unit = '', chartTitle }) {
  const chartWidth = 340;
  const paddingLeft = 100;
  const xTicks = [];
  for (let v = 0; v <= maxVal; v += xStep) {
    xTicks.push(v);
  }

  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-3.5 sm:p-5 my-3.5 w-full max-w-2xl shadow-inner min-w-0 box-border">
      <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-2 sm:mb-3 break-words [overflow-wrap:anywhere]">
        {toCleanUppercase(chartTitle || 'Σχήμα: Οριζόντιο Ραβδόγραμμα')}
      </div>
      <div className="w-full aspect-[16/9] sm:aspect-[2/1] bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-sm flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 490 200" className="w-full h-auto max-h-[220px] overflow-visible">
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

function MiniPieChart({ slices, chartTitle, locale = 'el' }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  let cumulativeAngle = 0;
  const renderedSlices = slices.map((s) => {
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
    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-3.5 sm:p-5 my-3.5 w-full max-w-2xl shadow-inner space-y-3 min-w-0 box-border">
      <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center break-words [overflow-wrap:anywhere]">
        {toCleanUppercase(chartTitle || 'Σχήμα: Κυκλικό Διάγραμμα')}
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-5 flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-6 shadow-sm overflow-hidden min-w-0">
        <svg viewBox="0 0 200 200" className="w-36 h-36 sm:w-44 sm:h-44 shrink-0 overflow-visible">
          {renderedSlices.map((s, idx) => (
            <path key={`slice-${idx}`} d={s.pathData} fill={s.color} stroke="#ffffff" strokeWidth="2" />
          ))}
        </svg>

        <div className="flex flex-col gap-2 text-xs font-mono w-full sm:w-auto min-w-0">
          {slices.map((s, idx) => (
            <div key={`pie-legend-${idx}`} className="flex items-center justify-between sm:justify-start gap-2 p-1.5 rounded-xl bg-slate-50 border border-slate-200 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
                <span className="font-sans font-bold text-slate-700 truncate">{s.label}:</span>
              </div>
              <span className="font-bold text-slate-900 shrink-0">{s.value}% ({formatNum((s.value / 100) * 360, locale, 0)}°)</span>
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
    generate: (locale) => {
      const isEn = locale === 'en';
      const t1 = randInt(10, 14);
      const t2 = randInt(18, 24);
      const t3 = randInt(15, 20);
      const t4 = randInt(11, 15);
      const maxT = Math.max(t1, t2, t3, t4);

      const wrongOpts = [
        `${maxT - 2} °C`,
        `${maxT + 2} °C`,
        `${maxT - 4} °C`
      ];

      return {
        title: isEn ? 'Maximum Temperature in Line Graph' : 'Μέγιστη Θερμοκρασία σε Γράφημα Γραμμής',
        prompt: isEn
          ? 'In the line graph below, temperature was recorded at various times of the day. What was the maximum temperature (°C) recorded? (write only the number)'
          : 'Στο παρακάτω γράφημα γραμμής καταγράφηκε η θερμοκρασία σε διάφορες ώρες της ημέρας. Ποια ήταν η μέγιστη θερμοκρασία (°C) που σημειώθηκε; (γράψε μόνο τον αριθμό)',
        promptMcq: isEn
          ? 'In the line graph below, temperature was recorded at various times of the day. What was the maximum temperature (°C) recorded?'
          : 'Στο παρακάτω γράφημα γραμμής καταγράφηκε η θερμοκρασία σε διάφορες ώρες της ημέρας. Ποια ήταν η μέγιστη θερμοκρασία (°C) που σημειώθηκε;',
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
          { item: isEn ? 'Recorded values' : 'Καταγεγραμμένες τιμές', formula: `${t1}°C, ${t2}°C, ${t3}°C, ${t4}°C`, val: isEn ? '4 measurements' : '4 μετρήσεις' },
          { item: isEn ? 'Peak / Maximum value' : 'Μέγιστη τιμή (κορυφή)', formula: `max(${t1}, ${t2}, ${t3}, ${t4})`, val: `${maxT} °C` }
        ],
        explain: isEn
          ? `We observe the highest point on the line graph: the maximum temperature is ${maxT}°C.`
          : `Παρατηρούμε το ψηλότερο σημείο του γραφήματος γραμμής: η μέγιστη θερμοκρασία είναι ${maxT}°C.`,
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'graf_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const vA = randInt(25, 45);
      const vB = randInt(15, 30);
      const vC = randInt(30, 50);
      const total = vA + vB + vC;
      const unit = isEn ? 'items' : 'τεμάχια';

      const wrongOpts = [
        `${total + 10} ${unit}`,
        `${total - 10} ${unit}`,
        `${total + 15} ${unit}`
      ];

      return {
        title: isEn ? 'Total Sales from Horizontal Bar Chart' : 'Σύνολο Πωλήσεων από Οριζόντιο Ραβδόγραμμα',
        prompt: isEn
          ? 'The horizontal bar chart below records sales for three products. How many items were sold in total? (write only the number)'
          : 'Στο παρακάτω οριζόντιο ραβδόγραμμα καταγράφονται οι πωλήσεις τριών προϊόντων. Πόσα τεμάχια πουλήθηκαν συνολικά; (γράψε μόνο τον αριθμό)',
        promptMcq: isEn
          ? 'The horizontal bar chart below records sales for three products. How many items were sold in total?'
          : 'Στο παρακάτω οριζόντιο ραβδόγραμμα καταγράφονται οι πωλήσεις τριών προϊόντων. Πόσα τεμάχια πουλήθηκαν συνολικά;',
        hbarChart: {
          data: [
            { label: isEn ? 'Product A' : 'Προϊόν Α', value: vA, color: '#3b82f6' },
            { label: isEn ? 'Product B' : 'Προϊόν Β', value: vB, color: '#10b981' },
            { label: isEn ? 'Product C' : 'Προϊόν Γ', value: vC, color: '#f59e0b' }
          ],
          maxVal: 60,
          xStep: 15,
          unit: ''
        },
        unit,
        correctVal: String(total),
        correctText: `${total} ${unit}`,
        tableData: [
          { item: isEn ? 'Product A' : 'Προϊόν Α', formula: `${vA} ${unit}`, val: `${vA}` },
          { item: isEn ? 'Product B' : 'Προϊόν Β', formula: `${vB} ${unit}`, val: `${vB}` },
          { item: isEn ? 'Product C' : 'Προϊόν Γ', formula: `${vC} ${unit}`, val: `${vC}` },
          { item: isEn ? 'Total sum' : 'Συνολικό άθροισμα', formula: `${vA} ＋ ${vB} ＋ ${vC}`, val: `${total} ${unit}` }
        ],
        explain: isEn
          ? `We read the lengths of the horizontal bars and add them together: ${vA} ＋ ${vB} ＋ ${vC} ＝ ${total} items.`
          : `Διαβάζουμε τα μήκη των οριζόντιων ράβδων και αθροίζουμε: ${vA} ＋ ${vB} ＋ ${vC} ＝ ${total} τεμάχια.`,
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'graf_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const pct = pickRandom([20, 25, 30, 40, 50]);
      const deg = (pct * 360) / 100;

      const wrongOpts = [
        `${formatNum(deg + 18, locale, 0)}°`,
        `${formatNum(Math.max(10, deg - 18), locale, 0)}°`,
        `${formatNum(deg + 36, locale, 0)}°`
      ];

      return {
        title: isEn ? 'Calculating Central Angle from Percentage' : 'Υπολογισμός Επίκεντρης Γωνίας από Ποσοστό',
        prompt: isEn
          ? `A sector in a pie chart represents ${pct} % of the whole. How many degrees (°) is the central angle of this sector? (write only the number)`
          : `Ένας κυκλικός τομέας σε ένα κυκλικό διάγραμμα αντιπροσωπεύει το ${pct} % του συνόλου. Πόσες μοίρες (°) είναι η επίκεντρη γωνία αυτού του τομέα; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `A sector in a pie chart represents ${pct} % of the whole. How many degrees (°) is the central angle of this sector?`
          : `Ένας κυκλικός τομέας σε ένα κυκλικό διάγραμμα αντιπροσωπεύει το ${pct} % του συνόλου. Πόσες μοίρες (°) είναι η επίκεντρη γωνία αυτού του τομέα;`,
        unit: '°',
        correctVal: formatNum(deg, locale, 0),
        correctText: `${formatNum(deg, locale, 0)}°`,
        tableData: [
          { item: isEn ? 'Sector percentage' : 'Ποσοστό τομέα', formula: `${pct} %`, val: `${pct} %` },
          { item: isEn ? 'Full circle' : 'Πλήρης κύκλος', formula: isEn ? '100 % corresponds to 360°' : '100 % αντιστοιχεί σε 360°', val: '360°' },
          {
            item: isEn ? 'Central angle' : 'Επίκεντρη γωνία',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={`${pct} · 360°`} den="100" />
              </span>
            ),
            val: `${formatNum(deg, locale, 0)}°`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? 'A full circle is 360° (100%). The central angle is calculated by proportion:'
                : 'Ολόκληρος ο κύκλος είναι 360° (100%). Η επίκεντρη γωνία υπολογίζεται με αναλογία:'}
            </span>
            <Fraction num={`${pct} · 360°`} den="100" />
            <span>＝ {formatNum(deg, locale, 0)}°.</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'graf_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const deg = pickRandom([90, 180, 72, 36, 144]);
      const pct = (deg / 360) * 100;

      const wrongOpts = [
        `${pct + 10} %`,
        `${Math.max(5, pct - 5)} %`,
        `${pct + 15} %`
      ];

      return {
        title: isEn ? 'Calculating Percentage from Central Angle' : 'Υπολογισμός Ποσοστού από Επίκεντρη Γωνία',
        prompt: isEn
          ? `In a pie chart, a sector has a central angle of ${deg}°. What percentage (%) of the total does this sector represent? (write only the number)`
          : `Σε ένα κυκλικό διάγραμμα, ένας τομέας έχει επίκεντρη γωνία ${deg}°. Τι ποσοστό (%) του συνόλου αντιπροσωπεύει αυτός ο τομέας; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `In a pie chart, a sector has a central angle of ${deg}°. What percentage (%) of the total does this sector represent?`
          : `Σε ένα κυκλικό διάγραμμα, ένας τομέας έχει επίκεντρη γωνία ${deg}°. Τι ποσοστό (%) του συνόλου αντιπροσωπεύει αυτός ο τομέας;`,
        unit: '%',
        correctVal: String(pct),
        correctText: `${pct} %`,
        tableData: [
          { item: isEn ? 'Central angle' : 'Επίκεντρη γωνία', formula: `${deg}°`, val: `${deg}°` },
          { item: isEn ? 'Full circle' : 'Πλήρης κύκλος', formula: '360°', val: '360°' },
          {
            item: isEn ? 'Percentage (%)' : 'Ποσοστό (%)',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={deg} den="360" />
                <span>· 100</span>
              </span>
            ),
            val: `${pct} %`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? 'We divide the angle by 360° and multiply by 100:'
                : 'Διαιρούμε τις μοίρες με τις 360° του κύκλου και πολλαπλασιάζουμε με το 100:'}
            </span>
            <Fraction num={deg} den="360" />
            <span>· 100 ＝ {pct} %.</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'graf_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const minT = 8;
      const maxT = 24;
      const range = maxT - minT;

      const wrongOpts = [
        `${range + 4} °C`,
        `${Math.max(2, range - 4)} °C`,
        `${range + 6} °C`
      ];

      return {
        title: isEn ? 'Temperature Variation Range' : 'Εύρος Διακύμανσης Θερμοκρασίας',
        prompt: isEn
          ? 'In the line graph below, daily temperatures were recorded. What is the temperature variation range (Maximum － Minimum value) in °C? (write only the number)'
          : 'Στο παρακάτω γράφημα γραμμής καταγράφηκαν οι θερμοκρασίες μιας ημέρας. Ποιο είναι το εύρος διακύμανσης της θερμοκρασίας (Μέγιστη － Ελάχιστη τιμή) σε °C; (γράψε μόνο τον αριθμό)',
        promptMcq: isEn
          ? 'In the line graph below, daily temperatures were recorded. What is the temperature variation range (Maximum － Minimum value) in °C?'
          : 'Στο παρακάτω γράφημα γραμμής καταγράφηκαν οι θερμοκρασίες μιας ημέρας. Ποιο είναι το εύρος διακύμανσης της θερμοκρασίας (Μέγιστη － Ελάχιστη τιμή) σε °C;',
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
          { item: isEn ? 'Maximum temperature' : 'Μέγιστη θερμοκρασία', formula: isEn ? 'At 14:00' : 'Στις 14:00', val: `${maxT} °C` },
          { item: isEn ? 'Minimum temperature' : 'Ελάχιστη θερμοκρασία', formula: isEn ? 'At 06:00' : 'Στις 06:00', val: `${minT} °C` },
          { item: isEn ? 'Variation range' : 'Εύρος διακύμανσης', formula: `${maxT} － ${minT}`, val: `${range} °C` }
        ],
        explain: isEn
          ? `Range ＝ Maximum value (${maxT}°C) － Minimum value (${minT}°C) ＝ ${range}°C.`
          : `Εύρος ＝ Μέγιστη τιμή (${maxT}°C) － Ελάχιστη τιμή (${minT}°C) ＝ ${range}°C.`,
        distractors: wrongOpts
      };
    }
  },
  {
    id: 'graf_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const pMath = 40;
      const pLang = 35;
      const pHist = 25;
      const degHist = (pHist * 360) / 100;
      const histName = isEn ? 'History' : 'Ιστορία';

      return {
        title: isEn ? 'Sector Angle in Pie Chart' : 'Επίκεντρη Γωνία Τομέα σε Κυκλικό Διάγραμμα',
        prompt: isEn
          ? `The pie chart below records students' favorite subjects. How many degrees (°) is the central angle for ${histName} (25%)? (write only the number)`
          : `Στο παρακάτω κυκλικό διάγραμμα καταγράφονται οι αγαπημένες θεματικές ενότητες των μαθητών. Πόσες μοίρες (°) είναι η επίκεντρη γωνία του τομέα της ${histName} (25%); (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `The pie chart below records students' favorite subjects. How many degrees (°) is the central angle for ${histName} (25%)?`
          : `Στο παρακάτω κυκλικό διάγραμμα καταγράφονται οι αγαπημένες θεματικές ενότητες των μαθητών. Πόσες μοίρες (°) είναι η επίκεντρη γωνία του τομέα της ${histName} (25%);`,
        pieChart: {
          slices: [
            { label: isEn ? 'Math' : 'Μαθηματικά', value: pMath, color: '#3b82f6' },
            { label: isEn ? 'Language' : 'Γλώσσα', value: pLang, color: '#10b981' },
            { label: histName, value: pHist, color: '#f59e0b' }
          ]
        },
        unit: '°',
        correctVal: String(degHist),
        correctText: `${degHist}°`,
        tableData: [
          { item: isEn ? `${histName} percentage` : `Ποσοστό ${histName}`, formula: '25 %', val: '25 %' },
          {
            item: isEn ? 'Central angle' : 'Επίκεντρη γωνία',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num="25 · 360°" den="100" />
              </span>
            ),
            val: `${degHist}°`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>{isEn ? 'For a percentage of 25%:' : 'Για ποσοστό 25%:'}</span>
            <Fraction num="25 · 360°" den="100" />
            <span>＝ 90°.</span>
          </span>
        ),
        distractors: ['72°', '108°', '80°']
      };
    }
  },
  {
    id: 'graf_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const vMon = 20;
      const vTue = 35;
      const vWed = 45;
      const total = vMon + vTue + vWed;
      const pctWed = (vWed / total) * 100;
      const wedName = isEn ? 'Wednesday' : 'Τετάρτη';

      return {
        title: isEn ? 'Attendance Percentage from Horizontal Bar Chart' : 'Ποσοστό Προσέλευσης από Οριζόντιο Ραβδόγραμμα',
        prompt: isEn
          ? `The horizontal bar chart displays the attendance of 100 customers over 3 days. What percentage (%) visited on ${wedName}? (write only the number)`
          : `Στο οριζόντιο ραβδόγραμμα φαίνεται η προσέλευση 100 πελατών σε ένα κατάστημα για 3 ημέρες. Τι ποσοστό (%) των πελατών προσήλθε την ${wedName}; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `The horizontal bar chart displays the attendance of 100 customers over 3 days. What percentage (%) visited on ${wedName}?`
          : `Στο οριζόντιο ραβδόγραμμα φαίνεται η προσέλευση 100 πελατών σε ένα κατάστημα για 3 ημέρες. Τι ποσοστό (%) των πελατών προσήλθε την ${wedName};`,
        hbarChart: {
          data: [
            { label: isEn ? 'Monday' : 'Δευτέρα', value: vMon, color: '#64748b' },
            { label: isEn ? 'Tuesday' : 'Τρίτη', value: vTue, color: '#f59e0b' },
            { label: wedName, value: vWed, color: '#10b981' }
          ],
          maxVal: 50,
          xStep: 10,
          unit: ''
        },
        unit: '%',
        correctVal: String(pctWed),
        correctText: `${pctWed} %`,
        tableData: [
          { item: isEn ? `${wedName} visitors` : `Πελάτες ${wedName}`, formula: `${vWed} ${isEn ? 'visitors' : 'πελάτες'}`, val: `${vWed}` },
          { item: isEn ? 'Total visitors (3 days)' : 'Συνολικοί πελάτες (3 ημέρες)', formula: `${total} ${isEn ? 'visitors' : 'πελάτες'}`, val: `${total}` },
          {
            item: isEn ? 'Percentage (%)' : 'Ποσοστό (%)',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={vWed} den={total} />
                <span>· 100</span>
              </span>
            ),
            val: `${pctWed} %`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? `${wedName} has 45 visitors out of a total 100:`
                : `Η ${wedName} έχει 45 πελάτες σε σύνολο 100:`}
            </span>
            <Fraction num={vWed} den={total} />
            <span>· 100 ＝ 45 %.</span>
          </span>
        ),
        distractors: ['35 %', '50 %', '40 %']
      };
    }
  },
  {
    id: 'graf_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const totalBudget = 1200;
      const rentPct = 40;
      const rentAmount = (totalBudget * rentPct) / 100;
      const rentName = isEn ? 'rent' : 'ενοίκιο';

      const wrongOpts = [
        `${rentAmount + 60} €`,
        `${rentAmount - 60} €`,
        `${rentAmount + 120} €`
      ];

      return {
        title: isEn ? 'Calculating Amount from Pie Chart' : 'Υπολογισμός Ποσού από Κυκλικό Διάγραμμα',
        prompt: isEn
          ? `In a pie chart of a €1,200 family budget, the ${rentName} sector has a central angle of 144° (which corresponds to 40%). How many euros (€) are spent on ${rentName}? (write only the number)`
          : `Σε ένα κυκλικό διάγραμμα οικογενειακού προϋπολογισμού 1.200 €, ο τομέας του ενοικίου έχει επίκεντρη γωνία 144° (που αντιστοιχεί σε 40%). Πόσα ευρώ (€) δαπανώνται για το ${rentName}; (γράψε μόνο τον αριθμό)`,
        promptMcq: isEn
          ? `In a pie chart of a €1,200 family budget, the ${rentName} sector has a central angle of 144° (which corresponds to 40%). How many euros (€) are spent on ${rentName}?`
          : `Σε ένα κυκλικό διάγραμμα οικογενειακού προϋπολογισμού 1.200 €, ο τομέας του ενοικίου έχει επίκεντρη γωνία 144° (που αντιστοιχεί σε 40%). Πόσα ευρώ (€) δαπανώνται για το ${rentName};`,
        unit: '€',
        correctVal: String(rentAmount),
        correctText: `${rentAmount} €`,
        tableData: [
          { item: isEn ? 'Total budget' : 'Συνολικός προϋπολογισμός', formula: `${formatNum(totalBudget, locale, 0)} €`, val: `${formatNum(totalBudget, locale, 0)} €` },
          {
            item: isEn ? 'Rent percentage' : 'Ποσοστό ενοικίου',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num="144°" den="360°" />
                <span>· 100</span>
              </span>
            ),
            val: '40 %'
          },
          {
            item: isEn ? 'Rent amount' : 'Ποσό ενοικίου',
            formula: (
              <span className="inline-flex items-center">
                <Fraction num={`${formatNum(totalBudget, locale, 0)} · 40`} den="100" />
              </span>
            ),
            val: `${rentAmount} €`
          }
        ],
        explain: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>
              {isEn
                ? 'We calculate 40% of €1,200:'
                : 'Υπολογίζουμε το 40% των 1.200 €:'}
            </span>
            <Fraction num={`${formatNum(totalBudget, locale, 0)} · 40`} den="100" />
            <span>＝ 480 €.</span>
          </span>
        ),
        distractors: wrongOpts
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale) {
  const isEn = locale === 'en';

  // Q1: Input - Ανάγνωση μέγιστης τιμής από γράφημα γραμμής
  const q1T1 = randInt(12, 15);
  const q1T2 = randInt(22, 26);
  const q1T3 = randInt(18, 21);
  const q1T4 = randInt(14, 17);
  const q1MaxT = Math.max(q1T1, q1T2, q1T3, q1T4);

  // Q2: MCQ - Καταλληλότητα γραφήματος γραμμής
  const q2Correct = isEn
    ? 'When we want to show how a quantity changes over time'
    : 'Όταν θέλουμε να δείξουμε πώς μεταβάλλεται ένα μέγεθος στο πέρασμα του χρόνου';
  const q2Wrong = [
    isEn ? 'Only when we have exactly two categories' : 'Μόνο όταν έχουμε ακριβώς δύο κατηγορίες',
    isEn ? 'When we want to draw a percentage pie chart' : 'Όταν θέλουμε να σχεδιάσουμε μια πίτα ποσοστών',
    isEn ? 'To replace multiplication with division' : 'Για να αντικαταστήσουμε τον πολλαπλασιασμό με διαίρεση'
  ];
  const q2Options = makeUniqueOptions(q2Correct, q2Wrong);

  // Q3: Input - Υπολογισμός επίκεντρης γωνίας από ποσοστό
  const q3Pct = pickRandom([20, 25, 40, 50]);
  const q3Deg = (q3Pct * 360) / 100;

  // Q4: MCQ - Πότε προτιμάται το οριζόντιο ραβδόγραμμα
  const q4Correct = isEn
    ? 'When categories have long names or for easier horizontal reading'
    : 'Όταν οι κατηγορίες έχουν μεγάλα ονόματα ή θέλουμε να διαβάζονται ευκολότερα';
  const q4Wrong = [
    isEn ? 'When all values are strictly equal to zero' : 'Όταν όλες οι τιμές είναι ίσες με το μηδέν',
    isEn ? 'Only when recording temperatures below freezing' : 'Μόνο όταν έχουμε θερμοκρασίες κάτω από το μηδέν',
    isEn ? 'Because vertical bar charts are forbidden' : 'Επειδή απαγορεύεται το κατακόρυφο ραβδόγραμμα'
  ];
  const q4Options = makeUniqueOptions(q4Correct, q4Wrong);

  // Q5: Input - Ανάγνωση αθροίσματος από οριζόντιο ραβδόγραμμα
  const q5V1 = randInt(15, 25);
  const q5V2 = randInt(20, 30);
  const q5Total = q5V1 + q5V2;

  // Q6: MCQ - Άθροισμα μοιρών κυκλικού διαγράμματος
  const q6Correct = '360°';
  const q6Wrong = ['180°', '100°', '90°'];
  const q6Options = makeUniqueOptions(q6Correct, q6Wrong);

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate(locale);

  // Q8: Standard Problem (MCQ)
  let spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  while (spIndex2 === spIndex1) spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q8Data = STANDARD_PROBLEMS_POOL[spIndex2].generate(locale);
  const q8Options = makeUniqueOptions(q8Data.correctText, q8Data.distractors);

  // Q9: Hard Problem (Input)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate(locale);

  // Q10: Hard Problem (MCQ)
  let hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  while (hpIndex2 === hpIndex1) hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hpIndex2].generate(locale);
  const q10Options = makeUniqueOptions(q10Data.correctText, q10Data.distractors);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Reading a Line Graph' : 'Ανάγνωση Γραφήματος Γραμμής',
      prompt: isEn
        ? 'What was the maximum temperature (°C) recorded during the day? (write only the number)'
        : 'Ποια ήταν η μέγιστη θερμοκρασία (°C) που καταγράφηκε στη διάρκεια της ημέρας; (γράψε μόνο τον αριθμό)',
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
      explain: isEn
        ? `We observe the peak point of the line graph: the maximum temperature is ${q1MaxT}°C.`
        : `Παρατηρούμε το ψηλότερο σημείο του γραφήματος: η μέγιστη θερμοκρασία είναι ${q1MaxT}°C.`
    },
    {
      id: 'q2',
      type: 'mcq',
      title: isEn ? 'Using Line Graphs' : 'Χρήση Γραφήματος Γραμμής',
      prompt: isEn
        ? 'In which scenario is a line graph (time series) preferably used?'
        : 'Σε ποια περίπτωση χρησιμοποιούμε κατά προτίμηση ένα γράφημα γραμμής (χρονοσειρά);',
      options: q2Options,
      correct: q2Correct,
      explain: isEn
        ? 'A line graph is used to display changes, developments, and trends over time.'
        : 'Το γράφημα γραμμής χρησιμοποιείται για να αναδείξει τη μεταβολή και την τάση ενός μεγέθους στον χρόνο.'
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: isEn ? 'Central Angle in Pie Chart' : 'Επίκεντρη Γωνία σε Κυκλικό Διάγραμμα',
      prompt: isEn
        ? `In a pie chart, a sector represents ${q3Pct} % of the whole. How many degrees (°) is the central angle of this sector? (write only the number)`
        : `Σε ένα κυκλικό διάγραμμα, ένας τομέας αντιπροσωπεύει το ${q3Pct} % του συνόλου. Πόσες μοίρες (°) είναι η επίκεντρη γωνία αυτού του τομέα; (γράψε μόνο τον αριθμό)`,
      correct: formatNum(q3Deg, locale, 0),
      explain: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>
            {isEn
              ? 'The entire circle represents 360° (100%). Angle:'
              : 'Ολόκληρος ο κύκλος αντιστοιχεί σε 360° (100%). Γωνία:'}
          </span>
          <Fraction num={`${q3Pct} · 360°`} den="100" />
          <span>＝ {formatNum(q3Deg, locale, 0)}°.</span>
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: isEn ? 'Horizontal Bar Chart Purpose' : 'Οριζόντιο Ραβδόγραμμα',
      prompt: isEn
        ? 'Why do we often prefer a horizontal bar chart over a vertical one?'
        : 'Για ποιο λόγο προτιμάμε συχνά ένα οριζόντιο ραβδόγραμμα αντί για κατακόρυφο;',
      options: q4Options,
      correct: q4Correct,
      explain: isEn
        ? 'In horizontal bar charts, long category names fit comfortably on the vertical axis without overlapping.'
        : 'Στο οριζόντιο ραβδόγραμμα τα ονόματα των κατηγοριών γράφονται άνετα στον κατακόρυφο άξονα χωρίς να επικαλύπτονται.'
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Reading a Horizontal Bar Chart' : 'Ανάγνωση Οριζόντιου Ραβδογράμματος',
      prompt: isEn
        ? 'How many books did the two classes borrow in total? (write only the number)'
        : 'Πόσα βιβλία δανείστηκαν συνολικά τα δύο τμήματα; (γράψε μόνο τον αριθμό)',
      hbarChart: {
        data: [
          { label: isEn ? 'Class 6A' : 'ΣΤ1 Τμήμα', value: q5V1, color: '#3b82f6' },
          { label: isEn ? 'Class 6B' : 'ΣΤ2 Τμήμα', value: q5V2, color: '#10b981' }
        ],
        maxVal: 35,
        xStep: 10,
        unit: ''
      },
      correct: String(q5Total),
      explain: isEn
        ? `We read the bar lengths: ${q5V1} ＋ ${q5V2} ＝ ${q5Total} books.`
        : `Διαβάζουμε τα μήκη των ράβδων: ${q5V1} ＋ ${q5V2} ＝ ${q5Total} βιβλία.`
    },
    {
      id: 'q6',
      type: 'mcq',
      title: isEn ? 'Sum of Angles in Pie Chart' : 'Άθροισμα Μοιρών Κυκλικού Διαγράμματος',
      prompt: isEn
        ? 'What is the sum of all central angles in a complete pie chart always equal to?'
        : 'Πόσο ισούται πάντοτε το άθροισμα των επίκεντρων γωνιών όλων των τομέων σε ένα πλήρες κυκλικό διάγραμμα;',
      options: q6Options,
      correct: q6Correct,
      explain: isEn
        ? 'A complete circle consists of 360°, therefore all sector angles together sum to 360°.'
        : 'Ένας πλήρης κύκλος αποτελείται από 360°, επομένως όλες οι επιμέρους γωνίες μαζί αθροίζουν σε 360°.'
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'decimal',
      title: `${isEn ? 'Problem' : 'Πρόβλημα'}: ${q7Data.title}`,
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
      title: `${isEn ? 'Problem' : 'Πρόβλημα'}: ${q8Data.title}`,
      prompt: q8Data.promptMcq || q8Data.prompt,
      lineChart: q7Data.lineChart ? undefined : q8Data.lineChart,
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
      title: `${isEn ? 'Advanced Problem' : 'Σύνθετο Πρόβλημα'}: ${q9Data.title}`,
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
      title: `${isEn ? 'Advanced Problem' : 'Σύνθετο Πρόβλημα'}: ${q10Data.title}`,
      prompt: q10Data.promptMcq || q10Data.prompt,
      lineChart: q9Data.lineChart ? undefined : q10Data.lineChart,
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
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';

  const t = useMemo(() => {
    return {
      el: {
        pageTitle: "Ασκήσεις: Άλλα Γραφήματα (Γραμμής, Οριζόντιο, Κυκλικό) - ΣΤ' Δημοτικού | LearnMaths.gr",
        metaDescription: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στα γραφήματα γραμμής, τα οριζόντια ραβδογράμματα και τα κυκλικά διαγράμματα για τη ΣΤ' Δημοτικού.",
        backText: "ΣΤ' Δημοτικού",
        theoryBtn: "Θεωρία",
        heroBadge: "ΚΕΦΑΛΑΙΟ 57 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
        heroTitle: "Διαδραστικές Ασκήσεις: Γράφημα Γραμμής, Οριζόντιο & Κυκλικό Διάγραμμα",
        heroDesc: "Λύσε τα 10 δυναμικά θέματα με οπτικά διαγράμματα, ερμηνεία χρονοσειρών θερμοκρασίας, οριζόντιες ράβδους και υπολογισμό επίκεντρων γωνιών!",
        newSetBtn: "Νέες Ασκήσεις",
        exerciseLabel: "Άσκηση",
        inputPlaceholderNumber: "Απάντηση...",
        inputPlaceholderDecimal: "π.χ. 18",
        tableHeaderElement: "Στοιχείο",
        tableHeaderFormula: "Ανάλυση / Τύπος",
        tableHeaderVal: "Τιμή",
        feedbackSuccess: "🎯 Εξαιρετικά!",
        feedbackExplanation: "💡 Επεξήγηση:",
        checkBtn: "Έλεγχος Απαντήσεων",
        scoreLabel: "Σκορ",
        answeredLabel: "Απαντήθηκαν",
        pctLabel: "Ποσοστό",
        footerPrompt: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!",
        chartTitleLine: "Σχήμα: Γράφημα Γραμμής",
        chartTitleHbar: "Σχήμα: Οριζόντιο Ραβδόγραμμα",
        chartTitlePie: "Σχήμα: Κυκλικό Διάγραμμα"
      },
      en: {
        pageTitle: "Exercises: Other Graphs (Line, Horizontal, Pie) - 6th Grade | LearnMaths.gr",
        metaDescription: "Interactive exercises with 10 questions and auto-grading on line graphs, horizontal bar charts, and pie charts for 6th Grade.",
        backText: "6th Grade",
        theoryBtn: "Theory",
        heroBadge: "CHAPTER 57 • 6TH GRADE • PRACTICE",
        heroTitle: "Interactive Exercises: Line, Horizontal Bar & Pie Charts",
        heroDesc: "Solve the 10 dynamic questions with visual diagrams, temperature trends, horizontal bars, and central angle calculations!",
        newSetBtn: "New Exercises",
        exerciseLabel: "Exercise",
        inputPlaceholderNumber: "Answer...",
        inputPlaceholderDecimal: "e.g. 18",
        tableHeaderElement: "Component",
        tableHeaderFormula: "Formula / Step",
        tableHeaderVal: "Value",
        feedbackSuccess: "🎯 Excellent!",
        feedbackExplanation: "💡 Explanation:",
        checkBtn: "Check Answers",
        scoreLabel: "Score",
        answeredLabel: "Answered",
        pctLabel: "Percentage",
        footerPrompt: "Answer all 10 questions and click “Check Answers”!",
        chartTitleLine: "Diagram: Line Graph",
        chartTitleHbar: "Diagram: Horizontal Bar Chart",
        chartTitlePie: "Diagram: Pie Chart"
      }
    }[locale];
  }, [locale]);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions(locale);
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
  }, [locale]);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      const q = questions.find(item => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        const sep = locale === 'en' ? '.' : ',';
        const otherSep = locale === 'en' ? ',' : '.';
        sanitized = sanitized.replace(new RegExp(`\\${otherSep}`, 'g'), sep);
        const allowedRegex = locale === 'en' ? /[^0-9.]/g : /[^0-9,]/g;
        sanitized = sanitized.replace(allowedRegex, '');
        const parts = sanitized.split(sep);
        if (parts.length > 2) sanitized = parts[0] + sep + parts.slice(1).join('');
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

      const numUser = parseFloat(cleanUser.replace(',', '.'));
      const numTarget = parseFloat(cleanTarget.replace(',', '.'));
      return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) <= 0.05;
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
      title={t.pageTitle}
      description={t.metaDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/57-alla-grafimata"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 box-border">
        
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200 break-words [overflow-wrap:anywhere]">
                <span>{toCleanUppercase(t.heroBadge)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
                {t.heroTitle}
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.heroDesc}
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase(t.newSetBtn)}</span>
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
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 overflow-hidden ${getCardStyle(q)}`}
                >
                  <div className="min-w-0">
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider break-words [overflow-wrap:anywhere]">
                        {toCleanUppercase(`${t.exerciseLabel} ${qNum}`)}: {toCleanUppercase(q.title)}
                      </span>
                      {submitted && (
                        <span className="text-xl shrink-0">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <div className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-3 break-words [overflow-wrap:anywhere]">
                      {q.prompt}
                    </div>

                    {/* ΟΠΤΙΚΑ ΣΧΗΜΑΤΑ ΔΕΔΟΜΕΝΩΝ */}
                    {q.lineChart && (
                      <MiniLineChart
                        points={q.lineChart.points}
                        maxVal={q.lineChart.maxVal}
                        yStep={q.lineChart.yStep}
                        unit={q.lineChart.unit}
                        chartTitle={t.chartTitleLine}
                      />
                    )}

                    {q.hbarChart && (
                      <MiniHBarChart
                        data={q.hbarChart.data}
                        maxVal={q.hbarChart.maxVal}
                        xStep={q.hbarChart.xStep}
                        unit={q.hbarChart.unit}
                        chartTitle={t.chartTitleHbar}
                      />
                    )}

                    {q.pieChart && (
                      <MiniPieChart
                        slices={q.pieChart.slices}
                        chartTitle={t.chartTitlePie}
                        locale={locale}
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
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1 flex items-center justify-center min-h-[48px] ${
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
                          placeholder={q.inputType === 'decimal' ? t.inputPlaceholderDecimal : t.inputPlaceholderNumber}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0">
                      {q.tableData && (
                        <div className="w-full overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200">
                          <table className="w-full text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderElement)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderFormula)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderVal)}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                                    {row.item}
                                  </td>
                                  <td className="p-1.5 text-indigo-700 align-middle">
                                    {row.formula}
                                  </td>
                                  <td className="p-1.5 font-black text-emerald-700">
                                    {row.val}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere] ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? t.feedbackSuccess : t.feedbackExplanation}
                        </p>
                        <div className="leading-relaxed">{q.explain}</div>
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
                <span>{toCleanUppercase(t.checkBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase(t.scoreLabel) : toCleanUppercase(t.answeredLabel)}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? score : answeredCount} / 10
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.pctLabel)}:{' '}
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
                <span>{toCleanUppercase(t.newSetBtn)}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.footerPrompt}
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
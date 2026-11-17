import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Α')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Α')/g);
  return parts
    .map((part) => {
      if (part === "Α'") return "Α'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Επαναχρησιμοποιήσιμο Component Γωνίας (Το γράμμα μένει στη γραμμή, το ^ τοποθετείται από πάνω)
function Angle({ children, className = "" }) {
  return (
    <span className={`relative inline-block leading-none mx-[1px] ${className}`}>
      <svg
        viewBox="0 0 12 6"
        className="w-[0.75em] h-[0.36em] absolute -top-[0.38em] left-1/2 -translate-x-1/2 text-current overflow-visible pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 5 L6 1 L11 5" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Τόξου (Το καμπύλο τόξο τοποθετείται από πάνω)
function Arc({ children, className = "" }) {
  return (
    <span className={`relative inline-block leading-none mx-[1px] ${className}`}>
      <svg
        viewBox="0 0 16 6"
        className="w-[0.95em] h-[0.36em] absolute -top-[0.4em] left-1/2 -translate-x-1/2 text-current overflow-visible pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M1 5 Q8 0.5 15 5" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 select-none mx-0.5 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.52em] h-[1.12em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.8px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive
function Frac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}>
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 whitespace-nowrap">
        {num}
      </span>
      <span className="pt-0.5 whitespace-nowrap">
        {den}
      </span>
    </span>
  );
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ensureFourUniqueOptions(correct, distractorsGen) {
  const set = new Set([String(correct).trim()]);
  let attempts = 0;
  while (set.size < 4 && attempts < 100) {
    attempts++;
    const cand = distractorsGen();
    if (cand !== undefined && cand !== null && cand !== '') {
      set.add(String(cand).trim());
    }
  }
  let fallbackCount = 1;
  while (set.size < 4) {
    set.add(`${correct} (${fallbackCount++})`);
  }
  return shuffle(Array.from(set));
}

function describeSectorPath(cx, cy, r, startDeg, endDeg) {
  const s = (startDeg * Math.PI) / 180;
  const e = (endDeg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(s);
  const y1 = cy - r * Math.sin(s);
  const x2 = cx + r * Math.cos(e);
  const y2 = cy - r * Math.sin(e);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${largeArc} 0 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
}

function describeArcOnly(cx, cy, r, startDeg, endDeg) {
  const s = (startDeg * Math.PI) / 180;
  const e = (endDeg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(s);
  const y1 = cy - r * Math.sin(s);
  const x2 = cx + r * Math.cos(e);
  const y2 = cy - r * Math.sin(e);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${largeArc} 0 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

// Δυναμικό SVG Σχήμα Επεξήγησης (No-Giveaway: εμφανίζεται ΜΟΝΟ μετά το submit)
function renderFeedbackDiagram(diagram, isEl) {
  if (!diagram) return null;

  // 1. Κλίμακα Μονάδων Μήκους (km -> mm)
  if (diagram.type === 'scale') {
    const units = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
    const srcIdx = units.indexOf(diagram.src);
    const dstIdx = units.indexOf(diagram.dst);
    const minI = Math.min(srcIdx, dstIdx);
    const maxI = Math.max(srcIdx, dstIdx);
    const isRight = dstIdx >= srcIdx;

    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <line x1="22" y1="68" x2="243" y2="68" stroke="#475569" strokeWidth="2" />
          <text x="132" y="26" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-emerald-300">
            ×10 ──▶ ×10 ──▶ ×10
          </text>
          <text x="132" y="112" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            ◀── ÷10 ◀── ÷10 ◀── ÷10
          </text>

          {units.map((u, i) => {
            const cx = 24 + i * 36.5;
            const isSrc = i === srcIdx;
            const isDst = i === dstIdx;
            const inRange = i >= minI && i < maxI;
            return (
              <g key={u}>
                {inRange && (
                  <line
                    x1={cx}
                    y1="68"
                    x2={cx + 36.5}
                    y2="68"
                    stroke={isRight ? '#34d399' : '#fbbf24'}
                    strokeWidth="3"
                  />
                )}
                <circle
                  cx={cx}
                  cy="68"
                  r={isSrc || isDst ? 12.5 : 10}
                  fill={isSrc ? '#4f46e5' : isDst ? '#059669' : '#0f172a'}
                  stroke={isSrc ? '#a5b4fc' : isDst ? '#6ee7b7' : '#64748b'}
                  strokeWidth={isSrc || isDst ? '2' : '1.3'}
                />
                <text x={cx} y="71" textAnchor="middle" className="text-[8px] font-mono font-bold fill-white">
                  {u}
                </text>
              </g>
            );
          })}

          <text x="132" y="146" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 2. Ευθύγραμμα τμήματα & μέσα
  if (diagram.type === 'segments') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <line x1="26" y1="68" x2="128" y2="68" stroke="#818cf8" strokeWidth="3.5" />
          <line x1="128" y1="68" x2="238" y2="68" stroke="#34d399" strokeWidth="3.5" />
          <circle cx="26" cy="68" r="3.5" fill="#a5b4fc" />
          <circle cx="128" cy="68" r="3.5" fill="#6ee7b7" />
          <circle cx="238" cy="68" r="3.5" fill="#fbbf24" />
          <text x="26" y="54" textAnchor="middle" className="text-[9px] font-bold fill-white">{diagram.p1 || (isEl ? 'Α' : 'A')}</text>
          <text x="128" y="54" textAnchor="middle" className="text-[9px] font-bold fill-white">{diagram.p2 || (isEl ? 'Β' : 'B')}</text>
          <text x="238" y="54" textAnchor="middle" className="text-[9px] font-bold fill-white">{diagram.p3 || (isEl ? 'Γ' : 'C')}</text>
          <text x="77" y="86" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-indigo-300">{diagram.len1}</text>
          <text x="183" y="86" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-emerald-300">{diagram.len2}</text>
          <path d="M 26,98 L 26,108 L 238,108 L 238,98" fill="none" stroke="#94a3b8" strokeWidth="1.3" />
          <text x="132" y="122" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-white">{diagram.totalLabel}</text>
          <text x="132" y="148" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 3. Πολύγωνο & Περίμετρος
  if (diagram.type === 'polygon') {
    const isRegular = diagram.shape === 'regular';
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          {isRegular ? (
            <>
              <polygon
                points="132,22 188,58 166,118 98,118 76,58"
                fill="rgba(16, 185, 129, 0.24)"
                stroke="#34d399"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <text x="132" y="76" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-200">
                {diagram.centerLabel}
              </text>
            </>
          ) : (
            <>
              <rect
                x="56"
                y="36"
                width="152"
                height="78"
                rx="4"
                fill="rgba(99, 102, 241, 0.24)"
                stroke="#818cf8"
                strokeWidth="1.8"
              />
              <text x="132" y="79" textAnchor="middle" className="text-[9px] font-mono font-bold fill-indigo-200">
                {diagram.centerLabel}
              </text>
            </>
          )}
          <text x="132" y="148" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 4. Κύκλος (Ο, ρ) & Τόξο (είτε 2 σημεία Α, Β είτε 3 διαδοχικά τόξα ΑΒ, ΒΓ, ΓΑ)
  if (diagram.type === 'circleArc') {
    const cx = 132;
    const cy = 72;
    const r = 44;

    const ptAt = (degVal, radVal = r) => {
      const rad = (degVal * Math.PI) / 180;
      return {
        x: cx + radVal * Math.cos(rad),
        y: cy - radVal * Math.sin(rad)
      };
    };

    // Λειτουργία 3 διαδοχικών τόξων ΑΒ, ΒΓ, ΓΑ (για το Πρόβλημα 3)
    if (diagram.threeArcs) {
      const a1 = diagram.arc1 || 95;
      const a2 = diagram.arc2 || 115;
      const degB = a1;
      const degC = a1 + a2;

      const pA = ptAt(0, r);
      const pB = ptAt(degB, r);
      const pC = ptAt(degC, r);

      const lblA = ptAt(0, r + 11);
      const lblB = ptAt(degB, r + 11);
      const lblC = ptAt(degC, r + 11);

      const midAB = ptAt(a1 / 2, r + 13);
      const midBC = ptAt(a1 + a2 / 2, r + 13);
      const midCA = ptAt((degC + 360) / 2, r + 13);

      return (
        <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
          <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
            <circle cx={cx} cy={cy} r={r} fill="rgba(30, 41, 59, 0.35)" stroke="#475569" strokeWidth="1.2" />

            {/* Τομείς: ΑΟΒ (μωβ), ΒΟΓ (πράσινος), ΑΟΓ (κεχριμπαρί - ζητούμενη γωνία) */}
            <path d={describeSectorPath(cx, cy, r, 0, degB)} fill="rgba(99, 102, 241, 0.24)" />
            <path d={describeSectorPath(cx, cy, r, degB, degC)} fill="rgba(16, 185, 129, 0.24)" />
            <path d={describeSectorPath(cx, cy, r, degC, 360)} fill="rgba(245, 158, 11, 0.34)" />

            {/* 3 Διαδοχικά τόξα ΑΒ, ΒΓ, ΓΑ */}
            <path d={describeArcOnly(cx, cy, r, 0, degB)} fill="none" stroke="#818cf8" strokeWidth="3.5" />
            <path d={describeArcOnly(cx, cy, r, degB, degC)} fill="none" stroke="#34d399" strokeWidth="3.5" />
            <path d={describeArcOnly(cx, cy, r, degC, 360)} fill="none" stroke="#fbbf24" strokeWidth="3.8" />

            {/* Ακτίνες ΟΑ, ΟΒ, ΟΓ */}
            <line x1={cx} y1={cy} x2={pA.x} y2={pA.y} stroke="#cbd5e1" strokeWidth="1.6" />
            <line x1={cx} y1={cy} x2={pB.x} y2={pB.y} stroke="#cbd5e1" strokeWidth="1.6" />
            <line x1={cx} y1={cy} x2={pC.x} y2={pC.y} stroke="#cbd5e1" strokeWidth="1.6" />

            {/* Σημεία Ο, Α, Β, Γ */}
            <circle cx={cx} cy={cy} r="3" fill="#fbbf24" />
            <circle cx={pA.x} cy={pA.y} r="3.2" fill="#818cf8" />
            <circle cx={pB.x} cy={pB.y} r="3.2" fill="#34d399" />
            <circle cx={pC.x} cy={pC.y} r="3.2" fill="#fbbf24" />

            <text x={cx - 6} y={cy + 3} textAnchor="end" className="text-[8px] font-bold fill-amber-300">
              {isEl ? 'Ο' : 'O'}
            </text>
            <text x={lblA.x} y={lblA.y + 3} textAnchor="middle" className="text-[8.5px] font-bold fill-white">
              {isEl ? 'Α' : 'A'}
            </text>
            <text x={lblB.x} y={lblB.y + 3} textAnchor="middle" className="text-[8.5px] font-bold fill-white">
              {isEl ? 'Β' : 'B'}
            </text>
            <text x={lblC.x} y={lblC.y + 3} textAnchor="middle" className="text-[8.5px] font-bold fill-white">
              {isEl ? 'Γ' : 'C'}
            </text>

            {/* Ενδείξεις μοιρών των 3 τόξων */}
            <text x={midAB.x} y={midAB.y + 2} textAnchor="middle" className="text-[7px] font-mono font-bold fill-indigo-300">
              {a1}°
            </text>
            <text x={midBC.x} y={midBC.y + 2} textAnchor="middle" className="text-[7px] font-mono font-bold fill-emerald-300">
              {a2}°
            </text>
            <text x={midCA.x} y={midCA.y + 2} textAnchor="middle" className="text-[7.5px] font-mono font-bold fill-amber-300">
              {360 - a1 - a2}°
            </text>

            <text x="132" y="153" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
              {diagram.caption}
            </text>
          </svg>
        </div>
      );
    }

    // Απλή επίκεντρη γωνία ΑΟΒ και τόξο ΑΒ (για την Άσκηση 7)
    const deg = diagram.deg || 90;
    const pA = ptAt(0, r);
    const pB = ptAt(deg, r);
    const lblB = ptAt(deg, r + 11);

    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <circle cx={cx} cy={cy} r={r} fill="rgba(30, 41, 59, 0.45)" stroke="#475569" strokeWidth="1.5" />
          <path d={describeSectorPath(cx, cy, r, 0, deg)} fill="rgba(99, 102, 241, 0.30)" />
          <path d={describeArcOnly(cx, cy, r, 0, deg)} fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
          <line x1={cx} y1={cy} x2={pA.x} y2={pA.y} stroke="#a5b4fc" strokeWidth="1.8" />
          <line x1={cx} y1={cy} x2={pB.x} y2={pB.y} stroke="#a5b4fc" strokeWidth="1.8" />
          <circle cx={cx} cy={cy} r="3" fill="#fbbf24" />
          <circle cx={pA.x} cy={pA.y} r="3" fill="#34d399" />
          <circle cx={pB.x} cy={pB.y} r="3" fill="#34d399" />
          <text x={cx - 8} y={cy + 3} textAnchor="end" className="text-[8.5px] font-bold fill-amber-300">
            {isEl ? 'Ο' : 'O'}
          </text>
          <text x={pA.x + 8} y={pA.y + 3} textAnchor="start" className="text-[8.5px] font-bold fill-emerald-300">
            {isEl ? 'Α' : 'A'}
          </text>
          <text x={lblB.x} y={lblB.y + 3} textAnchor="middle" className="text-[8.5px] font-bold fill-emerald-300">
            {isEl ? 'Β' : 'B'}
          </text>
          <text x="132" y="148" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 5. Τρίγωνο (180°)
  if (diagram.type === 'triangle') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <polygon
            points="54,116 210,116 156,30"
            fill="rgba(99, 102, 241, 0.25)"
            stroke="#818cf8"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <text x="48" y="126" textAnchor="end" className="text-[8.5px] font-bold fill-white">{isEl ? 'Α' : 'A'}</text>
          <text x="216" y="126" textAnchor="start" className="text-[8.5px] font-bold fill-white">{isEl ? 'Β' : 'B'}</text>
          <text x="156" y="23" textAnchor="middle" className="text-[8.5px] font-bold fill-white">{isEl ? 'Γ' : 'C'}</text>
          <text x="84" y="109" textAnchor="middle" className="text-[8px] font-mono font-bold fill-indigo-300">{diagram.ang1}</text>
          <text x="182" y="109" textAnchor="middle" className="text-[8px] font-mono font-bold fill-emerald-300">{diagram.ang2}</text>
          <text x="152" y="54" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">{diagram.ang3}</text>
          <text x="132" y="148" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 6. Τετράπλευρο (360°)
  if (diagram.type === 'quad') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <polygon
            points="64,116 198,116 214,38 78,28"
            fill="rgba(16, 185, 129, 0.24)"
            stroke="#34d399"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <text x="58" y="125" textAnchor="end" className="text-[8.5px] font-bold fill-white">{isEl ? 'Α' : 'A'}</text>
          <text x="204" y="125" textAnchor="start" className="text-[8.5px] font-bold fill-white">{isEl ? 'Β' : 'B'}</text>
          <text x="220" y="36" textAnchor="start" className="text-[8.5px] font-bold fill-white">{isEl ? 'Γ' : 'C'}</text>
          <text x="72" y="24" textAnchor="end" className="text-[8.5px] font-bold fill-white">{isEl ? 'Δ' : 'D'}</text>
          <text x="86" y="109" textAnchor="middle" className="text-[7.5px] font-mono font-bold fill-emerald-200">{diagram.a1}</text>
          <text x="178" y="109" textAnchor="middle" className="text-[7.5px] font-mono font-bold fill-emerald-200">{diagram.a2}</text>
          <text x="192" y="50" textAnchor="middle" className="text-[7.5px] font-mono font-bold fill-emerald-200">{diagram.a3}</text>
          <text x="94" y="46" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">{diagram.a4}</text>
          <text x="132" y="148" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  return null;
}

export default function Epanalipsi6() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const locCode = isEl ? 'el-GR' : 'en-US';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Συγκεντρωτικό Λεξικό i18n
  const t = {
    pageTitle: isEl ? "Επανάληψη 7 (Κεφ. 16 & 17): Μέτρηση Μήκους & Μέτρηση Γωνιών | Α' Γυμνασίου" : "Review 7 (Ch. 16 & 17): Measuring Length & Measuring Angles | Grade 7",
    pageDesc: isEl
      ? "Επαναληπτικό διαγώνισμα Α' Γυμνασίου στα Κεφάλαια 16 και 17: μονάδες μήκους, μετατροπές, ευθύγραμμα τμήματα, περίμετρος πολυγώνων, μέτρηση γωνιών, τόξα και γωνίες τριγώνου/τετραπλεύρου."
      : "Grade 7 review test on Chapters 16 and 17: length units, conversions, line segments, polygon perimeter, measuring angles, arcs, and triangle/quadrilateral angles.",
    backNav: isEl ? "Α' Γυμνασίου" : "Grade 7",
    theory16Btn: isEl ? "ΘΕΩΡΙΑ ΚΕΦ. 16" : "THEORY CH. 16",
    theory17Btn: isEl ? "ΘΕΩΡΙΑ ΚΕΦ. 17" : "THEORY CH. 17",
    heroBadge: isEl ? "ΕΠΑΝΑΛΗΨΗ 7 • ΚΕΦΑΛΑΙΑ 16 & 17 • Α' ΓΥΜΝΑΣΙΟΥ" : "REVIEW 7 • CHAPTERS 16 & 17 • GRADE 7",
    heroTitle: isEl ? "Επαναληπτικό Τεστ: Μέτρηση Μήκους & Μέτρηση Γωνιών" : "Review Test: Measuring Length & Measuring Angles",
    heroDesc: isEl
      ? "4 ασκήσεις από το Κεφάλαιο 16 (Μήκος, Ευθύγραμμα Τμήματα & Περίμετρος), 4 ασκήσεις από το Κεφάλαιο 17 (Γωνίες, Τόξα & Πολύγωνα) και 4 δύσκολα συνδυαστικά προβλήματα στο τέλος."
      : "4 exercises from Chapter 16 (Length, Line Segments & Perimeter), 4 exercises from Chapter 17 (Angles, Arcs & Polygons), and 4 challenging multi-step problems at the end.",
    btnNewSet: isEl ? "ΝΕΟ ΕΠΑΝΑΛΗΠΤΙΚΟ ΤΕΣΤ" : "NEW REVIEW TEST",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΑ ΘΕΜΑΤΑ" : "TRY NEW TOPICS",
    scoreLabel: isEl ? "Τελικό Αποτέλεσμα" : "Final Score",
    scoreGreat: isEl
      ? "Άριστα! Έχετε κατακτήσει πλήρως τόσο τη μέτρηση μήκους και την περίμετρο πολυγώνων (Κεφ. 16) όσο και τη μέτρηση γωνιών και τόξων (Κεφ. 17)."
      : "Excellent! You have fully mastered both length measurement and polygon perimeters (Ch. 16) and angle and arc measurement (Ch. 17).",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Μελετήστε τους πίνακες ανάλυσης και τα σχήματα παρακάτω στα ερωτήματα που χάσατε."
      : "Very good effort! Study the step-by-step tables and diagrams below for any questions you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στις μετατροπές μονάδων μήκους/γωνιών και στα συνδυαστικά προβλήματα!"
      : "Needs a bit more review on length/angle unit conversions and multi-step problems!",
    correctBadge: isEl ? "✓ Σωστό" : "✓ Correct",
    wrongBadge: isEl ? "✗ Λάθος" : "✗ Wrong",
    answeredLabel: isEl ? "ΑΠΑΝΤΗΘΗΚΑΝ" : "ANSWERED",
    checkBtn: isEl ? "ΕΛΕΓΧΟΣ ΕΠΑΝΑΛΗΨΗΣ" : "SUBMIT REVIEW",
    correctAnswerTitle: isEl ? "Σωστή Απάντηση:" : "Correct Answer:",
    tableStep: isEl ? "Στοιχείο / Βήμα" : "Element / Step",
    tableAnalysis: isEl ? "Ανάλυση Δεδομένων" : "Data Analysis"
  };

  const loadNewSet = () => {
    const qList = [];

    // =========================================================
    // ΜΕΡΟΣ Α: 4 ΑΣΚΗΣΕΙΣ ΑΠΟ ΤΟ ΚΕΦΑΛΑΙΟ 16 (ΜΕΤΡΗΣΗ ΜΗΚΟΥΣ)
    // =========================================================

    // Q1 (Κεφ. 16 • Άσκηση 1): Μετατροπές Μονάδων Μήκους (πολλαπλάσια & υποδιαιρέσεις)
    const mode1 = randInt(1, 3);
    if (mode1 === 1) {
      const km1 = Number((randInt(12, 85) / 10).toFixed(1));
      const m1 = Math.round(km1 * 1000);
      const ans1 = `${m1.toLocaleString(locCode)} m`;
      const dist1 = [
        `${m1.toLocaleString(locCode)} m`,
        `${Math.round(km1 * 100).toLocaleString(locCode)} m`,
        `${Math.round(km1 * 10000).toLocaleString(locCode)} m`,
        `${Number((km1 / 1000).toFixed(4)).toLocaleString(locCode)} m`
      ];
      qList.push({
        id: 1,
        badge: isEl ? 'ΚΕΦ. 16 • ΑΣΚΗΣΗ 1' : 'CH. 16 • EXERCISE 1',
        title: isEl ? 'Μετατροπή Χιλιομέτρων σε Μέτρα' : 'Converting Kilometers to Meters',
        prompt: isEl
          ? `Μια διαδρομή έχει μήκος ${km1.toLocaleString(locCode)} km. Πόσα μέτρα (m) είναι το μήκος της;`
          : `A trail has length ${km1.toLocaleString(locCode)} km. What is its length in meters (m)?`,
        type: 'mcq',
        correct: ans1,
        options: ensureFourUniqueOptions(ans1, () => pickRandom(dist1)),
        diagram: {
          type: 'scale',
          src: 'km',
          dst: 'm',
          caption: `${km1.toLocaleString(locCode)} km × 1.000 ＝ ${ans1}`
        },
        explanation: isEl
          ? `Επειδή 1 km ＝ 1.000 m, πολλαπλασιάζουμε με 1.000: ${km1.toLocaleString(locCode)} · 1.000 ＝ ${ans1}.`
          : `Since 1 km ＝ 1,000 m, multiply by 1,000: ${km1.toLocaleString(locCode)} · 1,000 ＝ ${ans1}.`
      });
    } else if (mode1 === 2) {
      const mm1 = randInt(145, 685);
      const cm1 = Number((mm1 / 10).toFixed(1));
      qList.push({
        id: 1,
        badge: isEl ? 'ΚΕΦ. 16 • ΑΣΚΗΣΗ 1' : 'CH. 16 • EXERCISE 1',
        title: isEl ? 'Μετατροπή Χιλιοστομέτρων σε Εκατοστόμετρα' : 'Converting Millimeters to Centimeters',
        prompt: isEl
          ? `Να μετατρέψετε το μήκος ${mm1} mm σε εκατοστόμετρα (cm).`
          : `Convert the length ${mm1} mm into centimeters (cm).`,
        type: 'input',
        correct: cm1,
        unit: 'cm',
        diagram: {
          type: 'scale',
          src: 'mm',
          dst: 'cm',
          caption: `${mm1} mm ÷ 10 ＝ ${cm1.toLocaleString(locCode)} cm`
        },
        explanation: isEl
          ? `Επειδή 1 cm ＝ 10 mm, διαιρούμε με 10: ${mm1} ÷ 10 ＝ ${cm1.toLocaleString(locCode)} cm.`
          : `Since 1 cm ＝ 10 mm, divide by 10: ${mm1} ÷ 10 ＝ ${cm1.toLocaleString(locCode)} cm.`
      });
    } else {
      const dam1 = Number((randInt(15, 65) / 10).toFixed(1));
      const dm1 = Math.round(dam1 * 100);
      qList.push({
        id: 1,
        badge: isEl ? 'ΚΕΦ. 16 • ΑΣΚΗΣΗ 1' : 'CH. 16 • EXERCISE 1',
        title: isEl ? 'Δεκάμετρο (dam) και Δεκατόμετρο (dm)' : 'Decameter (dam) and Decimeter (dm)',
        prompt: isEl
          ? `Πόσα δεκατόμετρα (dm) ισοδυναμούν με ${dam1.toLocaleString(locCode)} dam;`
          : `How many decimeters (dm) are equivalent to ${dam1.toLocaleString(locCode)} dam?`,
        type: 'input',
        correct: dm1,
        unit: 'dm',
        diagram: {
          type: 'scale',
          src: 'dam',
          dst: 'dm',
          caption: `${dam1.toLocaleString(locCode)} dam × 100 ＝ ${dm1} dm`
        },
        explanation: isEl
          ? `Από dam σε dm κατεβαίνουμε 2 θέσεις (dam → m → dm), άρα πολλαπλασιάζουμε με 100: ${dam1.toLocaleString(locCode)} · 100 ＝ ${dm1} dm.`
          : `From dam to dm we move 2 steps right (dam → m → dm), so multiply by 100: ${dam1.toLocaleString(locCode)} · 100 ＝ ${dm1} dm.`
      });
    }

    // Q2 (Κεφ. 16 • Άσκηση 2): Άθροισμα ή Διαφορά Ευθυγράμμων Τμημάτων
    const mode2 = randInt(1, 3);
    if (mode2 === 1) {
      const ab2 = Number((randInt(32, 74) / 10).toFixed(1));
      const bc2mm = randInt(18, 48);
      const bc2 = Number((bc2mm / 10).toFixed(1));
      const ac2 = Number((ab2 + bc2).toFixed(1));
      qList.push({
        id: 2,
        badge: isEl ? 'ΚΕΦ. 16 • ΑΣΚΗΣΗ 2' : 'CH. 16 • EXERCISE 2',
        title: isEl ? 'Άθροισμα Ευθυγράμμων Τμημάτων' : 'Sum of Line Segments',
        prompt: isEl
          ? `Πάνω σε ευθεία τοποθετούμε διαδοχικά τα τμήματα ΑΒ ＝ ${ab2.toLocaleString(locCode)} cm και ΒΓ ＝ ${bc2mm} mm. Πόσα cm είναι το άθροισμα ΑΓ ＝ ΑΒ ＋ ΒΓ;`
          : `Segments AB ＝ ${ab2.toLocaleString(locCode)} cm and BC ＝ ${bc2mm} mm are placed consecutively on a line. What is the sum AC ＝ AB ＋ BC in cm?`,
        type: 'input',
        correct: ac2,
        unit: 'cm',
        diagram: {
          type: 'segments',
          len1: `${ab2.toLocaleString(locCode)} cm`,
          len2: `${bc2.toLocaleString(locCode)} cm`,
          totalLabel: isEl ? `ΑΓ ＝ ${ac2.toLocaleString(locCode)} cm` : `AC ＝ ${ac2.toLocaleString(locCode)} cm`,
          caption: `${ab2.toLocaleString(locCode)} ＋ ${bc2.toLocaleString(locCode)} ＝ ${ac2.toLocaleString(locCode)} cm`
        },
        explanation: isEl
          ? `Μετατρέπουμε το ΒΓ σε cm: ${bc2mm} mm ＝ ${bc2.toLocaleString(locCode)} cm. Άρα ΑΓ ＝ ${ab2.toLocaleString(locCode)} ＋ ${bc2.toLocaleString(locCode)} ＝ ${ac2.toLocaleString(locCode)} cm.`
          : `Convert BC to cm: ${bc2mm} mm ＝ ${bc2.toLocaleString(locCode)} cm. Thus AC ＝ ${ab2.toLocaleString(locCode)} ＋ ${bc2.toLocaleString(locCode)} ＝ ${ac2.toLocaleString(locCode)} cm.`
      });
    } else if (mode2 === 2) {
      const ab2 = randInt(8, 15);
      const cd2dm = Number((randInt(3, 6) / 10).toFixed(1));
      const cd2 = Math.round(cd2dm * 10);
      const diff2 = ab2 - cd2;
      qList.push({
        id: 2,
        badge: isEl ? 'ΚΕΦ. 16 • ΑΣΚΗΣΗ 2' : 'CH. 16 • EXERCISE 2',
        title: isEl ? 'Διαφορά Ευθυγράμμων Τμημάτων' : 'Difference of Line Segments',
        prompt: isEl
          ? `Δίνονται τα ευθύγραμμα τμήματα ΑΒ ＝ ${ab2} cm και ΓΔ ＝ ${cd2dm.toLocaleString(locCode)} dm. Πόσα cm είναι η διαφορά ΑΒ － ΓΔ;`
          : `Given line segments AB ＝ ${ab2} cm and CD ＝ ${cd2dm.toLocaleString(locCode)} dm, what is the difference AB － CD in cm?`,
        type: 'input',
        correct: diff2,
        unit: 'cm',
        explanation: isEl
          ? `Επειδή ΓΔ ＝ ${cd2dm.toLocaleString(locCode)} dm ＝ ${cd2} cm, η διαφορά τους είναι ΑΒ － ΓΔ ＝ ${ab2} － ${cd2} ＝ ${diff2} cm.`
          : `Since CD ＝ ${cd2dm.toLocaleString(locCode)} dm ＝ ${cd2} cm, their difference is AB － CD ＝ ${ab2} － ${cd2} ＝ ${diff2} cm.`
      });
    } else {
      const am2 = randInt(4, 9);
      const ab2 = 2 * am2;
      qList.push({
        id: 2,
        badge: isEl ? 'ΚΕΦ. 16 • ΑΣΚΗΣΗ 2' : 'CH. 16 • EXERCISE 2',
        title: isEl ? 'Μέσο Ευθυγράμμου Τμήματος' : 'Midpoint of a Line Segment',
        prompt: isEl
          ? `Το σημείο Μ είναι το μέσο του ευθυγράμμου τμήματος ΑΒ. Αν ΑΜ ＝ ${am2} cm, ισχύει ότι ΑΒ ＝ ${ab2} cm;`
          : `Point M is the midpoint of line segment AB. If AM ＝ ${am2} cm, is it true that AB ＝ ${ab2} cm?`,
        type: 'tf',
        correct: isEl ? 'Σωστό' : 'True',
        options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
        explanation: isEl
          ? `Το μέσο Μ χωρίζει το ΑΒ σε δύο ίσα τμήματα ΑΜ ＝ ΜΒ ＝ ${am2} cm, άρα ΑΒ ＝ 2 · ${am2} ＝ ${ab2} cm.`
          : `Midpoint M divides AB into two equal segments AM ＝ MB ＝ ${am2} cm, so AB ＝ 2 · ${am2} ＝ ${ab2} cm.`
      });
    }

    // Q3 (Κεφ. 16 • Άσκηση 3): Σύγκριση & Διάταξη Μηκών σε Διαφορετικές Μονάδες
    const m3 = randInt(2, 5);
    const lenA3 = `${m3} m`;
    const lenB3 = `${m3 * 10 + 5} dm`;
    const lenC3 = `${m3 * 100 - 25} cm`;
    const corr3 = `${lenC3} < ${lenA3} < ${lenB3}`;
    const dist3 = [
      `${lenC3} < ${lenA3} < ${lenB3}`,
      `${lenA3} < ${lenC3} < ${lenB3}`,
      `${lenB3} < ${lenA3} < ${lenC3}`,
      `${lenC3} < ${lenB3} < ${lenA3}`
    ];

    qList.push({
      id: 3,
      badge: isEl ? 'ΚΕΦ. 16 • ΑΣΚΗΣΗ 3' : 'CH. 16 • EXERCISE 3',
      title: isEl ? 'Σύγκριση & Διάταξη Μηκών' : 'Comparing & Ordering Lengths',
      prompt: isEl
        ? `Ποια είναι η σωστή διάταξη από το μικρότερο στο μεγαλύτερο για τα ευθύγραμμα τμήματα: ${lenA3}, ${lenB3} και ${lenC3};`
        : `Which is the correct order from shortest to longest for the lengths: ${lenA3}, ${lenB3}, and ${lenC3}?`,
      type: 'mcq',
      correct: corr3,
      options: ensureFourUniqueOptions(corr3, () => pickRandom(dist3)),
      explanation: isEl
        ? `Μετατρέπουμε σε cm: ${lenC3} ＝ ${m3 * 100 - 25} cm, ${lenA3} ＝ ${m3 * 100} cm και ${lenB3} ＝ ${(m3 * 10 + 5) * 10} cm. Άρα ${corr3}.`
        : `Convert to cm: ${lenC3} ＝ ${m3 * 100 - 25} cm, ${lenA3} ＝ ${m3 * 100} cm, and ${lenB3} ＝ ${(m3 * 10 + 5) * 10} cm. Thus ${corr3}.`
    });

    // Q4 (Κεφ. 16 • Άσκηση 4): Περίμετρος Κανονικού Πολυγώνου ή Ορθογωνίου
    const mode4 = randInt(1, 2);
    if (mode4 === 1) {
      const sides4 = pickRandom([3, 4, 5, 6]);
      const name4 = isEl
        ? sides4 === 3
          ? 'ισόπλευρου τριγώνου'
          : sides4 === 4
          ? 'τετραγώνου'
          : sides4 === 5
          ? 'κανονικού πενταγώνου'
          : 'κανονικού εξαγώνου'
        : sides4 === 3
        ? 'equilateral triangle'
        : sides4 === 4
        ? 'square'
        : sides4 === 5
        ? 'regular pentagon'
        : 'regular hexagon';
      const s4 = Number((randInt(25, 75) / 10).toFixed(1));
      const perim4 = Number((sides4 * s4).toFixed(1));
      qList.push({
        id: 4,
        badge: isEl ? 'ΚΕΦ. 16 • ΑΣΚΗΣΗ 4' : 'CH. 16 • EXERCISE 4',
        title: isEl ? 'Περίμετρος Κανονικού Πολυγώνου' : 'Perimeter of a Regular Polygon',
        prompt: isEl
          ? `Πόσα cm είναι η περίμετρος ενός ${name4} (${sides4} ίσες πλευρές) με πλευρά α ＝ ${s4.toLocaleString(locCode)} cm;`
          : `What is the perimeter (in cm) of a ${name4} (${sides4} equal sides) with side length a ＝ ${s4.toLocaleString(locCode)} cm?`,
        type: 'input',
        correct: perim4,
        unit: 'cm',
        diagram: {
          type: 'polygon',
          shape: 'regular',
          centerLabel: isEl ? `Π ＝ ${sides4} · α` : `P ＝ ${sides4} · a`,
          caption: `${sides4} · ${s4.toLocaleString(locCode)} cm ＝ ${perim4.toLocaleString(locCode)} cm`
        },
        explanation: isEl
          ? `Πολλαπλασιάζουμε το μήκος της πλευράς με το πλήθος των ίσων πλευρών: Π ＝ ${sides4} · ${s4.toLocaleString(locCode)} ＝ ${perim4.toLocaleString(locCode)} cm.`
          : `Multiply the side length by the number of equal sides: P ＝ ${sides4} · ${s4.toLocaleString(locCode)} ＝ ${perim4.toLocaleString(locCode)} cm.`
      });
    } else {
      const a4 = randInt(7, 14);
      const b4 = randInt(3, 6);
      const perim4 = 2 * (a4 + b4);
      qList.push({
        id: 4,
        badge: isEl ? 'ΚΕΦ. 16 • ΑΣΚΗΣΗ 4' : 'CH. 16 • EXERCISE 4',
        title: isEl ? 'Περίμετρος Ορθογωνίου' : 'Perimeter of a Rectangle',
        prompt: isEl
          ? `Ένα ορθογώνιο έχει μήκος ${a4} cm και πλάτος ${b4} cm. Πόσα cm είναι η περίμετρός του;`
          : `A rectangle has length ${a4} cm and width ${b4} cm. What is its perimeter in cm?`,
        type: 'input',
        correct: perim4,
        unit: 'cm',
        diagram: {
          type: 'polygon',
          shape: 'quad',
          centerLabel: isEl ? `Π ＝ 2·(${a4} ＋ ${b4})` : `P ＝ 2·(${a4} ＋ ${b4})`,
          caption: isEl ? `Π ＝ ${perim4} cm` : `P ＝ ${perim4} cm`
        },
        explanation: isEl
          ? `Η περίμετρος του ορθογωνίου είναι Π ＝ 2 · (${a4} ＋ ${b4}) ＝ 2 · ${a4 + b4} ＝ ${perim4} cm.`
          : `The perimeter of the rectangle is P ＝ 2 · (${a4} ＋ ${b4}) ＝ 2 · ${a4 + b4} ＝ ${perim4} cm.`
      });
    }

    // =========================================================
    // ΜΕΡΟΣ Β: 4 ΑΣΚΗΣΕΙΣ ΑΠΟ ΤΟ ΚΕΦΑΛΑΙΟ 17 (ΜΕΤΡΗΣΗ ΓΩΝΙΩΝ)
    // =========================================================

    // Q5 (Κεφ. 17 • Άσκηση 1): Εξηκονταδικό Σύστημα (° / ' / '') & Είδη Γωνιών
    const mode5 = randInt(1, 3);
    if (mode5 === 1) {
      const deg5 = randInt(4, 15);
      const mins5 = deg5 * 60;
      qList.push({
        id: 5,
        badge: isEl ? 'ΚΕΦ. 17 • ΑΣΚΗΣΗ 1' : 'CH. 17 • EXERCISE 1',
        title: isEl ? 'Μετατροπή Μοιρών σε Πρώτα Λεπτά' : 'Converting Degrees to Arcminutes',
        prompt: isEl
          ? `Πόσα πρώτα λεπτά (') είναι οι ${deg5}°;`
          : `How many arcminutes (') are equal to ${deg5}°?`,
        type: 'input',
        correct: mins5,
        unit: "'",
        explanation: isEl
          ? `Επειδή 1° ＝ 60', πολλαπλασιάζουμε με 60: ${deg5} · 60' ＝ ${mins5}'.`
          : `Since 1° ＝ 60', multiply by 60: ${deg5} · 60' ＝ ${mins5}'.`
      });
    } else if (mode5 === 2) {
      const ang5 = pickRandom([38, 74, 90, 118, 156, 180]);
      const kind5 = isEl
        ? ang5 < 90
          ? 'Οξεία γωνία'
          : ang5 === 90
          ? 'Ορθή γωνία'
          : ang5 < 180
          ? 'Αμβλεία γωνία'
          : 'Ευθεία γωνία'
        : ang5 < 90
        ? 'Acute angle'
        : ang5 === 90
        ? 'Right angle'
        : ang5 < 180
        ? 'Obtuse angle'
        : 'Straight angle';
      const dist5 = isEl
        ? ['Οξεία γωνία', 'Ορθή γωνία', 'Αμβλεία γωνία', 'Ευθεία γωνία']
        : ['Acute angle', 'Right angle', 'Obtuse angle', 'Straight angle'];
      qList.push({
        id: 5,
        badge: isEl ? 'ΚΕΦ. 17 • ΑΣΚΗΣΗ 1' : 'CH. 17 • EXERCISE 1',
        title: isEl ? 'Χαρακτηρισμός Είδους Γωνίας' : 'Classifying an Angle by Measure',
        prompt: isEl
          ? `Πώς χαρακτηρίζεται μια γωνία με μέτρο ${ang5}°;`
          : `How is an angle measuring ${ang5}° classified?`,
        type: 'mcq',
        correct: kind5,
        options: ensureFourUniqueOptions(kind5, () => pickRandom(dist5)),
        explanation: isEl
          ? `Οξεία είναι < 90°, ορθή ＝ 90°, αμβλεία μεταξύ 90° και 180°, και ευθεία ＝ 180°. Άρα η ${ang5}° είναι: ${kind5}.`
          : `Acute is < 90°, right ＝ 90°, obtuse is between 90° and 180°, and straight ＝ 180°. Thus ${ang5}° is: ${kind5}.`
      });
    } else {
      const mins5 = pickRandom([180, 240, 300, 420]);
      const deg5 = mins5 / 60;
      qList.push({
        id: 5,
        badge: isEl ? 'ΚΕΦ. 17 • ΑΣΚΗΣΗ 1' : 'CH. 17 • EXERCISE 1',
        title: isEl ? 'Μετατροπή Πρώτων Λεπτών σε Μοίρες' : 'Converting Arcminutes to Degrees',
        prompt: isEl
          ? `Πόσες μοίρες (°) είναι τα ${mins5}';`
          : `How many degrees (°) are equal to ${mins5}'?`,
        type: 'input',
        correct: deg5,
        unit: '°',
        explanation: isEl
          ? `Διαιρούμε με 60 (αφού 60' ＝ 1°): ${mins5}' ÷ 60 ＝ ${deg5}°.`
          : `Divide by 60 (since 60' ＝ 1°): ${mins5}' ÷ 60 ＝ ${deg5}°.`
      });
    }

    // Q6 (Κεφ. 17 • Άσκηση 2): Πρόσθεση ή Αφαίρεση Γωνιών σε Μοίρες & Πρώτα
    const isAdd6 = Math.random() < 0.5;
    if (isAdd6) {
      const d6a = randInt(20, 48);
      const m6a = randInt(32, 54);
      const d6b = randInt(15, 42);
      const m6b = randInt(28, 48);
      const rawM6 = m6a + m6b;
      const finD6 = d6a + d6b + 1;
      const finM6 = rawM6 - 60;
      const ans6 = `${finD6}° ${finM6}'`;
      const dist6 = [
        `${finD6}° ${finM6}'`,
        `${d6a + d6b}° ${rawM6}'`,
        `${d6a + d6b}° ${finM6}'`,
        `${finD6 + 1}° ${finM6}'`
      ];
      qList.push({
        id: 6,
        badge: isEl ? 'ΚΕΦ. 17 • ΑΣΚΗΣΗ 2' : 'CH. 17 • EXERCISE 2',
        title: isEl ? 'Πρόσθεση Γωνιών (Μοίρες & Πρώτα)' : 'Adding Angles (Degrees & Minutes)',
        prompt: isEl
          ? `Πόσο είναι το άθροισμα: ${d6a}° ${m6a}' ＋ ${d6b}° ${m6b}';`
          : `What is the sum: ${d6a}° ${m6a}' ＋ ${d6b}° ${m6b}'?`,
        type: 'mcq',
        correct: ans6,
        options: ensureFourUniqueOptions(ans6, () => pickRandom(dist6)),
        explanation: isEl
          ? `Έχουμε ${d6a}° ＋ ${d6b}° ＝ ${d6a + d6b}° και ${m6a}' ＋ ${m6b}' ＝ ${rawM6}' ＝ 1° ${finM6}', άρα συνολικά ${ans6}.`
          : `We have ${d6a}° ＋ ${d6b}° ＝ ${d6a + d6b}° and ${m6a}' ＋ ${m6b}' ＝ ${rawM6}' ＝ 1° ${finM6}', giving ${ans6}.`
      });
    } else {
      const d6a = randInt(58, 86);
      const m6a = randInt(10, 25);
      const d6b = randInt(22, 44);
      const m6b = randInt(35, 55);
      const finD6 = d6a - 1 - d6b;
      const finM6 = m6a + 60 - m6b;
      const ans6 = `${finD6}° ${finM6}'`;
      const dist6 = [
        `${finD6}° ${finM6}'`,
        `${d6a - d6b}° ${Math.abs(m6a - m6b)}'`,
        `${d6a - d6b}° ${finM6}'`,
        `${finD6 - 1}° ${finM6}'`
      ];
      qList.push({
        id: 6,
        badge: isEl ? 'ΚΕΦ. 17 • ΑΣΚΗΣΗ 2' : 'CH. 17 • EXERCISE 2',
        title: isEl ? 'Αφαίρεση Γωνιών (Δανεισμός 1° ＝ 60\')' : 'Subtracting Angles (Borrowing 1° ＝ 60\')',
        prompt: isEl
          ? `Πόσο είναι η διαφορά: ${d6a}° ${m6a}' － ${d6b}° ${m6b}';`
          : `What is the difference: ${d6a}° ${m6a}' － ${d6b}° ${m6b}'?`,
        type: 'mcq',
        correct: ans6,
        options: ensureFourUniqueOptions(ans6, () => pickRandom(dist6)),
        explanation: isEl
          ? `Δανειζόμαστε 1° ＝ 60': ${d6a}° ${m6a}' ＝ ${d6a - 1}° ${m6a + 60}'. Αφαιρώντας ${d6b}° ${m6b}' βρίσκουμε ${ans6}.`
          : `Borrow 1° ＝ 60': ${d6a}° ${m6a}' ＝ ${d6a - 1}° ${m6a + 60}'. Subtracting ${d6b}° ${m6b}' gives ${ans6}.`
      });
    }

    // Q7 (Κεφ. 17 • Άσκηση 3): Μέτρο Τόξου & Επίκεντρη Γωνία στον Κύκλο (Ο, ρ)
    const arc7 = pickRandom([45, 60, 75, 90, 108, 120, 144]);
    qList.push({
      id: 7,
      badge: isEl ? 'ΚΕΦ. 17 • ΑΣΚΗΣΗ 3' : 'CH. 17 • EXERCISE 3',
      title: isEl ? 'Μέτρο Τόξου & Επίκεντρης Γωνίας' : 'Arc Measure & Central Angle',
      prompt: isEl
        ? `Σε έναν κύκλο (Ο, ρ) ένα τόξο ΑΒ έχει μέτρο ${arc7}°. Πόσες μοίρες είναι η αντίστοιχη επίκεντρη γωνία ΑΟΒ;`
        : `On a circle (O, ρ), an arc AB has degree measure ${arc7}°. What is the measure of the corresponding central angle AOB in degrees?`,
      type: 'input',
      correct: arc7,
      unit: '°',
      diagram: {
        type: 'circleArc',
        deg: arc7,
        caption: isEl ? `Γωνία ΑΟΒ ＝ Τόξο ΑΒ ＝ ${arc7}°` : `Angle AOB ＝ Arc AB ＝ ${arc7}°`
      },
      explanation: isEl
        ? `Το μέτρο της επίκεντρης γωνίας ΑΟΒ ισούται πάντα με το μέτρο του αντίστοιχου τόξου ΑΒ στον κύκλο (Ο, ρ), δηλαδή ${arc7}°.`
        : `The measure of central angle AOB is always equal to the degree measure of its intercepted arc AB on circle (O, ρ), which is ${arc7}°.`
    });

    // Q8 (Κεφ. 17 • Άσκηση 4): Υπολογισμός 3ης Γωνίας Τριγώνου ή 4ης Γωνίας Τετραπλεύρου
    const isTri8 = Math.random() < 0.5;
    if (isTri8) {
      const a8 = randInt(38, 72);
      const b8 = randInt(42, 78);
      const c8 = 180 - a8 - b8;
      qList.push({
        id: 8,
        badge: isEl ? 'ΚΕΦ. 17 • ΑΣΚΗΣΗ 4' : 'CH. 17 • EXERCISE 4',
        title: isEl ? 'Υπολογισμός Γωνίας Τριγώνου' : 'Finding a Triangle Angle',
        prompt: isEl
          ? `Σε τρίγωνο ΑΒΓ δίνονται Α ＝ ${a8}° και Β ＝ ${b8}°. Πόσες μοίρες είναι η γωνία Γ;`
          : `In triangle ABC, A ＝ ${a8}° and B ＝ ${b8}°. How many degrees is angle C?`,
        type: 'input',
        correct: c8,
        unit: '°',
        diagram: {
          type: 'triangle',
          ang1: `${a8}°`,
          ang2: `${b8}°`,
          ang3: `${c8}°`,
          caption: `${a8}° ＋ ${b8}° ＋ ${c8}° ＝ 180°`
        },
        explanation: isEl
          ? `Επειδή Α ＋ Β ＋ Γ ＝ 180°, έχουμε Γ ＝ 180° － (${a8}° ＋ ${b8}°) ＝ ${c8}°.`
          : `Since A ＋ B ＋ C ＝ 180°, we get C ＝ 180° － (${a8}° ＋ ${b8}°) ＝ ${c8}°.`
      });
    } else {
      const a8 = randInt(75, 108);
      const b8 = randInt(72, 104);
      const c8 = randInt(74, 102);
      const d8 = 360 - (a8 + b8 + c8);
      qList.push({
        id: 8,
        badge: isEl ? 'ΚΕΦ. 17 • ΑΣΚΗΣΗ 4' : 'CH. 17 • EXERCISE 4',
        title: isEl ? 'Υπολογισμός Γωνίας Τετραπλεύρου' : 'Finding a Quadrilateral Angle',
        prompt: isEl
          ? `Ένα τετράπλευρο ΑΒΓΔ έχει γωνίες Α ＝ ${a8}°, Β ＝ ${b8}° και Γ ＝ ${c8}°. Πόσες μοίρες είναι η γωνία Δ;`
          : `A quadrilateral ABCD has angles A ＝ ${a8}°, B ＝ ${b8}°, and C ＝ ${c8}°. How many degrees is angle D?`,
        type: 'input',
        correct: d8,
        unit: '°',
        diagram: {
          type: 'quad',
          a1: `${a8}°`,
          a2: `${b8}°`,
          a3: `${c8}°`,
          a4: `${d8}°`,
          caption: `${a8}° ＋ ${b8}° ＋ ${c8}° ＋ ${d8}° ＝ 360°`
        },
        explanation: isEl
          ? `Επειδή Α ＋ Β ＋ Γ ＋ Δ ＝ 360°, έχουμε Δ ＝ 360° － (${a8}° ＋ ${b8}° ＋ ${c8}°) ＝ ${d8}°.`
          : `Since A ＋ B ＋ C ＋ D ＝ 360°, we get D ＝ 360° － (${a8}° ＋ ${b8}° ＋ ${c8}°) ＝ ${d8}°.`
      });
    }

    // =========================================================
    // ΜΕΡΟΣ Γ: 2 ΔΥΣΚΟΛΑ ΣΥΝΔΥΑΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ ΑΠΟ ΤΟ ΚΕΦ. 16
    // =========================================================

    // Q9 (Πρόβλημα 1 • Κεφ. 16 • Υψηλή Δυσκολία): Τετράπλευρο με μικτές μονάδες -> Ισοδύναμο κανονικό πολύγωνο
    const sidePent9 = randInt(6, 12);
    const totalPerim9 = 5 * sidePent9;
    const ab9 = Number((randInt(80, 140) / 10).toFixed(1));
    const bc9Mm = randInt(70, 130);
    const bc9 = Number((bc9Mm / 10).toFixed(1));
    const cd9Dm = Number((randInt(8, 15) / 10).toFixed(1));
    const cd9 = Math.round(cd9Dm * 10);
    const da9 = Number((totalPerim9 - (ab9 + bc9 + cd9)).toFixed(1));

    qList.push({
      id: 9,
      badge: isEl ? 'ΠΡΟΒΛΗΜΑ 1 • ΚΕΦ. 16 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'PROBLEM 1 • CH. 16 • HIGH DIFFICULTY',
      title: isEl ? 'Συνδυαστικό Πρόβλημα Περιμέτρων & Μονάδων Μήκους' : 'Combined Perimeter & Metric Units Problem',
      prompt: isEl
        ? `Ένα τετράπλευρο ΑΒΓΔ έχει την ΙΔΙΑ περίμετρο με ένα κανονικό πεντάγωνο (5 ίσες πλευρές) πλευράς ${sidePent9} cm. Αν οι τρεις πλευρές του τετραπλεύρου είναι ΑΒ ＝ ${ab9.toLocaleString(locCode)} cm, ΒΓ ＝ ${bc9Mm} mm και ΓΔ ＝ ${cd9Dm.toLocaleString(locCode)} dm, πόσα cm είναι η τέταρτη πλευρά ΔΑ;`
        : `A quadrilateral ABCD has the SAME perimeter as a regular pentagon (5 equal sides) of side ${sidePent9} cm. If three sides of the quadrilateral are AB ＝ ${ab9.toLocaleString(locCode)} cm, BC ＝ ${bc9Mm} mm, and CD ＝ ${cd9Dm.toLocaleString(locCode)} dm, what is the length of side DA in cm?`,
      type: 'input',
      correct: da9,
      unit: 'cm',
      diagram: {
        type: 'polygon',
        shape: 'regular',
        centerLabel: isEl ? `Π ＝ 5 · ${sidePent9} ＝ ${totalPerim9} cm` : `P ＝ 5 · ${sidePent9} ＝ ${totalPerim9} cm`,
        caption: isEl ? `ΔΑ ＝ ${totalPerim9} － ${(ab9 + bc9 + cd9).toLocaleString(locCode)} ＝ ${da9.toLocaleString(locCode)} cm` : `DA ＝ ${totalPerim9} － ${(ab9 + bc9 + cd9).toLocaleString(locCode)} ＝ ${da9.toLocaleString(locCode)} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Κοινή περίμετρος Π' : '1. Shared perimeter P',
          details: isEl ? `Π ＝ 5 · ${sidePent9} cm ＝ ${totalPerim9} cm` : `P ＝ 5 · ${sidePent9} cm ＝ ${totalPerim9} cm`
        },
        {
          label: isEl ? '2. Μετατροπές σε cm' : '2. Convert sides to cm',
          details: isEl
            ? `ΒΓ ＝ ${bc9Mm} mm ＝ ${bc9.toLocaleString(locCode)} cm, ΓΔ ＝ ${cd9Dm.toLocaleString(locCode)} dm ＝ ${cd9} cm`
            : `BC ＝ ${bc9Mm} mm ＝ ${bc9.toLocaleString(locCode)} cm, CD ＝ ${cd9Dm.toLocaleString(locCode)} dm ＝ ${cd9} cm`
        },
        {
          label: isEl ? '3. Υπολογισμός πλευράς ΔΑ' : '3. Solving for side DA',
          details: `${totalPerim9} － (${ab9.toLocaleString(locCode)} ＋ ${bc9.toLocaleString(locCode)} ＋ ${cd9}) ＝ ${da9.toLocaleString(locCode)} cm`
        }
      ],
      explanation: isEl
        ? `Η περίμετρος του κανονικού πενταγώνου είναι 5 · ${sidePent9} ＝ ${totalPerim9} cm. Μετατρέποντας σε cm (ΒΓ ＝ ${bc9.toLocaleString(locCode)} cm, ΓΔ ＝ ${cd9} cm), το άθροισμα των 3 πλευρών είναι ${(ab9 + bc9 + cd9).toLocaleString(locCode)} cm, άρα ΔΑ ＝ ${totalPerim9} － ${(ab9 + bc9 + cd9).toLocaleString(locCode)} ＝ ${da9.toLocaleString(locCode)} cm.`
        : `The regular pentagon's perimeter is 5 · ${sidePent9} ＝ ${totalPerim9} cm. Converting to cm (BC ＝ ${bc9.toLocaleString(locCode)} cm, CD ＝ ${cd9} cm), the 3 sides sum to ${(ab9 + bc9 + cd9).toLocaleString(locCode)} cm, so DA ＝ ${totalPerim9} － ${(ab9 + bc9 + cd9).toLocaleString(locCode)} ＝ ${da9.toLocaleString(locCode)} cm.`
    });

    // Q10 (Πρόβλημα 2 • Κεφ. 16 • Υψηλή Δυσκολία): Ευθύγραμμο τμήμα με μέσα Μ, Ν & πολλαπλάσιο λόγο
    const mult10 = randInt(2, 5);
    const bc10 = 2 * mult10;
    const ab10 = 3 * bc10;
    const mb10 = ab10 / 2;
    const bn10 = bc10 / 2;
    const mn10 = mb10 + bn10;

    qList.push({
      id: 10,
      badge: isEl ? 'ΠΡΟΒΛΗΜΑ 2 • ΚΕΦ. 16 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'PROBLEM 2 • CH. 16 • HIGH DIFFICULTY',
      title: isEl ? 'Απόσταση Μέσων Διαδοχικών Ευθυγράμμων Τμημάτων' : 'Distance Between Midpoints of Consecutive Segments',
      prompt: isEl
        ? `Πάνω σε ευθεία παίρνουμε διαδοχικά τμήματα ΑΒ και ΒΓ ώστε το ΑΒ να είναι τριπλάσιο του ΒΓ (ΑΒ ＝ 3 · ΒΓ) και ΒΓ ＝ ${bc10} cm. Αν Μ είναι το μέσο του ΑΒ και Ν είναι το μέσο του ΒΓ, πόσα cm είναι το μήκος του τμήματος ΜΝ;`
        : `Along a line, consecutive segments AB and BC satisfy AB ＝ 3 · BC with BC ＝ ${bc10} cm. If M is the midpoint of AB and N is the midpoint of BC, what is the length of segment MN in cm?`,
      type: 'input',
      correct: mn10,
      unit: 'cm',
      diagram: {
        type: 'segments',
        p1: isEl ? 'Μ' : 'M',
        p2: isEl ? 'Β' : 'B',
        p3: isEl ? 'Ν' : 'N',
        len1: isEl ? `ΜΒ ＝ ${mb10} cm` : `MB ＝ ${mb10} cm`,
        len2: isEl ? `ΒΝ ＝ ${bn10} cm` : `BN ＝ ${bn10} cm`,
        totalLabel: isEl ? `ΜΝ ＝ ${mn10} cm` : `MN ＝ ${mn10} cm`,
        caption: isEl ? `ΜΝ ＝ ΜΒ ＋ ΒΝ ＝ ${mb10} ＋ ${bn10} ＝ ${mn10} cm` : `MN ＝ MB ＋ BN ＝ ${mb10} ＋ ${bn10} ＝ ${mn10} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Υπολογισμός ΑΒ' : '1. Calculate AB',
          details: isEl ? `ΑΒ ＝ 3 · ΒΓ ＝ 3 · ${bc10} ＝ ${ab10} cm` : `AB ＝ 3 · BC ＝ 3 · ${bc10} ＝ ${ab10} cm`
        },
        {
          label: isEl ? '2. Μέσα Μ και Ν' : '2. Midpoints M and N',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>{isEl ? 'ΜΒ ＝' : 'MB ＝'}</span>
              <Frac num={String(ab10)} den="2" />
              <span>＝ {mb10} cm,</span>
              <span>{isEl ? 'ΒΝ ＝' : 'BN ＝'}</span>
              <Frac num={String(bc10)} den="2" />
              <span>＝ {bn10} cm</span>
            </div>
          )
        },
        {
          label: isEl ? '3. Άθροισμα ΜΝ' : '3. Sum MN',
          details: isEl ? `ΜΝ ＝ ΜΒ ＋ ΒΝ ＝ ${mb10} ＋ ${bn10} ＝ ${mn10} cm` : `MN ＝ MB ＋ BN ＝ ${mb10} ＋ ${bn10} ＝ ${mn10} cm`
        }
      ],
      explanation: isEl
        ? `Έχουμε ΑΒ ＝ 3 · ${bc10} ＝ ${ab10} cm. Το μέσο Μ δίνει ΜΒ ＝ ${ab10} ÷ 2 ＝ ${mb10} cm και το μέσο Ν δίνει ΒΝ ＝ ${bc10} ÷ 2 ＝ ${bn10} cm. Άρα ΜΝ ＝ ${mb10} ＋ ${bn10} ＝ ${mn10} cm.`
        : `We have AB ＝ 3 · ${bc10} ＝ ${ab10} cm. Midpoint M gives MB ＝ ${ab10} ÷ 2 ＝ ${mb10} cm and midpoint N gives BN ＝ ${bc10} ÷ 2 ＝ ${bn10} cm. Thus MN ＝ ${mb10} ＋ ${bn10} ＝ ${mn10} cm.`
    });

    // =========================================================
    // ΜΕΡΟΣ Δ: 2 ΔΥΣΚΟΛΑ ΣΥΝΔΥΑΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ ΑΠΟ ΤΟ ΚΕΦ. 17
    // =========================================================

    // Q11 (Πρόβλημα 3 • Κεφ. 17 • Υψηλή Δυσκολία): Κύκλος (Ο, ρ) χωρισμένος σε 3 διαδοχικά τόξα ΑΒ, ΒΓ, ΓΑ
    const arcA11 = pickRandom([80, 95, 110, 125]);
    const diff11 = pickRandom([20, 30, 40]);
    const arcB11 = arcA11 + diff11;
    const arcC11 = 360 - (arcA11 + arcB11);

    qList.push({
      id: 11,
      badge: isEl ? 'ΠΡΟΒΛΗΜΑ 3 • ΚΕΦ. 17 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'PROBLEM 3 • CH. 17 • HIGH DIFFICULTY',
      title: isEl ? 'Διαίρεση Κύκλου (Ο, ρ) σε Τρία Διαδοχικά Τόξα' : 'Dividing Circle (O, ρ) into Three Consecutive Arcs',
      prompt: isEl
        ? `Τρία σημεία Α, Β, Γ πάνω σε έναν κύκλο (Ο, ρ) τον χωρίζουν σε τρία διαδοχικά τόξα ΑΒ, ΒΓ και ΓΑ. Αν το τόξο ΑΒ έχει μέτρο ${arcA11}° και το τόξο ΒΓ είναι κατά ${diff11}° μεγαλύτερο από το ΑΒ, πόσες μοίρες είναι η επίκεντρη γωνία ΑΟΓ που βαίνει στο τρίτο τόξο ΓΑ;`
        : `Three points A, B, C on a circle (O, ρ) divide it into three consecutive arcs AB, BC, and CA. If arc AB measures ${arcA11}° and arc BC is ${diff11}° larger than AB, what is the measure of central angle AOC intercepting the third arc CA?`,
      type: 'input',
      correct: arcC11,
      unit: '°',
      diagram: {
        type: 'circleArc',
        threeArcs: true,
        arc1: arcA11,
        arc2: arcB11,
        caption: isEl ? `Γωνία ΑΟΓ ＝ Τόξο ΓΑ ＝ ${arcC11}°` : `Angle AOC ＝ Arc CA ＝ ${arcC11}°`
      },
      tableData: [
        {
          label: isEl ? '1. Μέτρο τόξου ΒΓ' : '1. Measure of arc BC',
          details: `${arcA11}° ＋ ${diff11}° ＝ ${arcB11}°`
        },
        {
          label: isEl ? '2. Μέτρο τόξου ΓΑ (360°)' : '2. Measure of arc CA (360°)',
          details: `360° － (${arcA11}° ＋ ${arcB11}°) ＝ 360° － ${arcA11 + arcB11}° ＝ ${arcC11}°`
        },
        {
          label: isEl ? '3. Επίκεντρη γωνία ΑΟΓ' : '3. Central angle AOC',
          details: isEl ? `Ίση με το τόξο ΓΑ ＝ ${arcC11}°` : `Equal to arc CA ＝ ${arcC11}°`
        }
      ],
      explanation: isEl
        ? `Όλος ο κύκλος έχει μέτρο 360°. Το τόξο ΒΓ είναι ${arcA11}° ＋ ${diff11}° ＝ ${arcB11}°, οπότε το τόξο ΓΑ (και η επίκεντρη γωνία ΑΟΓ) είναι 360° － (${arcA11}° ＋ ${arcB11}°) ＝ ${arcC11}°.`
        : `A full circle measures 360°. Arc BC is ${arcA11}° ＋ ${diff11}° ＝ ${arcB11}°, so arc CA (and central angle AOC) is 360° － (${arcA11}° ＋ ${arcB11}°) ＝ ${arcC11}°.`
    });

    // Q12 (Πρόβλημα 4 • Κεφ. 17 • Υψηλή Δυσκολία): Τετράπλευρο με 1 ορθή, 1 γνωστή & 2 ίσες γωνίες
    const known12 = pickRandom([64, 72, 86, 98, 106, 114]);
    const rem12 = 360 - 90 - known12;
    const eq12 = rem12 / 2;

    qList.push({
      id: 12,
      badge: isEl ? 'ΠΡΟΒΛΗΜΑ 4 • ΚΕΦ. 17 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'PROBLEM 4 • CH. 17 • HIGH DIFFICULTY',
      title: isEl ? 'Συνδυαστικό Πρόβλημα Γωνιών Τετραπλεύρου' : 'Combined Quadrilateral Angles Problem',
      prompt: isEl
        ? `Σε ένα τετράπλευρο ΑΒΓΔ η γωνία Α είναι ορθή (90°), η γωνία Β είναι ίση με ${known12}°, ενώ οι δύο άλλες γωνίες Γ και Δ είναι ίσες μεταξύ τους (Γ ＝ Δ). Πόσες μοίρες είναι καθεμία από τις γωνίες Γ και Δ;`
        : `In quadrilateral ABCD, angle A is a right angle (90°), angle B equals ${known12}°, and the other two angles C and D are equal (C ＝ D). How many degrees is each of angles C and D?`,
      type: 'input',
      correct: eq12,
      unit: '°',
      diagram: {
        type: 'quad',
        a1: '90°',
        a2: `${known12}°`,
        a3: `${eq12}°`,
        a4: `${eq12}°`,
        caption: `90° ＋ ${known12}° ＋ ${eq12}° ＋ ${eq12}° ＝ 360°`
      },
      tableData: [
        {
          label: isEl ? '1. Άθροισμα Γ ＋ Δ' : '1. Sum C ＋ D',
          details: isEl
            ? `Γ ＋ Δ ＝ 360° － (90° ＋ ${known12}°) ＝ 360° － ${90 + known12}° ＝ ${rem12}°`
            : `C ＋ D ＝ 360° － (90° ＋ ${known12}°) ＝ 360° － ${90 + known12}° ＝ ${rem12}°`
        },
        {
          label: isEl ? '2. Υπολογισμός ίσων γωνιών' : '2. Solving for equal angles',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>{isEl ? 'Γ ＝ Δ ＝' : 'C ＝ D ＝'}</span>
              <Frac num={`${rem12}°`} den="2" />
              <span>＝ {eq12}°</span>
            </div>
          )
        }
      ],
      explanation: isEl
        ? `Το άθροισμα των γωνιών του τετραπλεύρου είναι 360°. Αφαιρούμε Α ＋ Β ＝ 90° ＋ ${known12}° ＝ ${90 + known12}° (μένουν ${rem12}°) και διαιρούμε διά 2: Γ ＝ Δ ＝ ${eq12}°.`
        : `The interior angles of a quadrilateral sum to 360°. Subtracting A ＋ B ＝ 90° ＋ ${known12}° ＝ ${90 + known12}° leaves ${rem12}°, and dividing by 2 gives C ＝ D ＝ ${eq12}°.`
    });

    setQuestions(qList);
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    loadNewSet();
  }, [locale]);

  const handleAnswerChange = (qId, rawVal) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: rawVal }));
  };

  const sanitizeInput = (val) => {
    let sanitized = val.replace('.', ',').replace(/[^0-9,-]/g, '').replace(/(?!^)-/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    return sanitized.slice(0, 10);
  };

  const handleSubmit = () => {
    let s = 0;
    questions.forEach(q => {
      const uAns = userAnswers[q.id];
      if (uAns === undefined || uAns === null || uAns === '') return;

      if (q.type === 'input') {
        const parsedUser = parseFloat(String(uAns).replace(',', '.').trim());
        const parsedCorrect = parseFloat(String(q.correct).replace(',', '.').trim());
        if (!isNaN(parsedUser) && Math.abs(parsedUser - parsedCorrect) <= 0.05) {
          s += 1;
        }
      } else {
        if (String(uAns).trim() === String(q.correct).trim()) {
          s += 1;
        }
      }
    });

    setScore(s);
    setSubmitted(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== '' && userAnswers[k] !== undefined).length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/a-gymnasiou/55-mikos"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] sm:text-xs font-semibold rounded-xl shadow-md transition-all duration-200"
          >
            <span>📖 {toCleanUppercase(t.theory16Btn)}</span>
          </Link>
          <Link
            href="/a-gymnasiou/56-metrisi-gonion"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-semibold rounded-xl shadow-md transition-all duration-200"
          >
            <span>📐 {toCleanUppercase(t.theory17Btn)}</span>
          </Link>
        </div>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        
        {/* Header Banner */}
        <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/10">
                {toCleanUppercase(t.heroBadge)}
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black mt-2 leading-tight break-words [overflow-wrap:anywhere]">
                {t.heroTitle}
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1">
                {t.heroDesc}
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={loadNewSet}
                className="w-full sm:w-auto px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl shadow transition-all duration-150 text-xs sm:text-sm whitespace-nowrap"
              >
                🔄 {toCleanUppercase(t.btnNewSet)}
              </button>
            </div>
          </div>
        </section>

        {/* Results Banner */}
        {submitted && (
          <section className="p-5 sm:p-8 bg-white border-2 border-indigo-200 rounded-2xl sm:rounded-3xl shadow-lg mb-6 sm:mb-8 text-center animate-fade-in">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2">
              {t.scoreLabel}: {score} / 12 ({Math.round((score / 12) * 100)}%)
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-4">
              {score >= 10 ? t.scoreGreat : score >= 6 ? t.scoreGood : t.scoreNeedWork}
            </p>
            <button
              type="button"
              onClick={loadNewSet}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl sm:rounded-2xl shadow transition text-xs sm:text-sm"
            >
              🔄 {toCleanUppercase(t.btnTryNewSet)}
            </button>
          </section>
        )}

        {/* Λίστα Ερωτήσεων */}
        <div className="space-y-4 sm:space-y-6">
          {questions.map((q, idx) => {
            const isHardProblem = idx >= 8;
            let isCorrect = false;
            if (submitted) {
              if (q.type === 'input') {
                const u = parseFloat(String(userAnswers[q.id]).replace(',', '.').trim());
                const c = parseFloat(String(q.correct).replace(',', '.').trim());
                isCorrect = !isNaN(u) && Math.abs(u - c) <= 0.05;
              } else {
                isCorrect = String(userAnswers[q.id]).trim() === String(q.correct).trim();
              }
            }

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border transition-all min-w-0 ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : isHardProblem
                    ? 'border-amber-300/80 shadow-md'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Badge Κεφαλαίου / Δυσκολίας */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                      isHardProblem
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {toCleanUppercase(q.badge)}
                  </span>

                  {submitted && (
                    <span
                      className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? t.correctBadge : t.wrongBadge}
                    </span>
                  )}
                </div>

                {/* Header Ερώτησης */}
                <div className="flex items-center gap-2.5 mb-3">
                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-bold flex items-center justify-center text-xs sm:text-sm shrink-0 ${
                      isHardProblem
                        ? 'bg-amber-500 text-white'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-sm sm:text-lg text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                    {q.title}
                  </h3>
                </div>

                {/* Εκφώνηση */}
                <div className="text-slate-800 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-medium break-words [overflow-wrap:anywhere]">
                  {q.prompt}
                </div>

                {/* Πεδία Απάντησης */}
                <div className="mb-2">
                  {q.type === 'tf' && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-md">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border flex items-center gap-2.5 transition-all min-h-[48px] sm:min-h-[56px] min-w-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-white bg-white' : 'border-slate-400'
                              }`}
                            >
                              {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                            </span>
                            <span className="break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1 font-semibold text-xs sm:text-sm">
                              {q.renderOption ? q.renderOption(opt) : opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'input' && (
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:max-w-xs">
                      <input
                        type="text"
                        disabled={submitted}
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => {
                          const sanitized = sanitizeInput(e.target.value);
                          handleAnswerChange(q.id, sanitized);
                        }}
                        placeholder={isEl ? "Απάντηση..." : "Answer..."}
                        className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-900 text-xs sm:text-sm"
                      />
                      {q.unit && (
                        <span className="text-xs sm:text-sm font-bold text-slate-500 whitespace-nowrap">
                          {q.unit}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* FEEDBACK SECTION (No-Giveaway: εμφανίζεται μόνο μετά το submit) */}
                {submitted && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 space-y-3 animate-fade-in">
                    {q.diagram ? (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <div className="md:col-span-5 min-w-0">
                          {renderFeedbackDiagram(q.diagram, isEl)}
                        </div>
                        <div className="md:col-span-7 space-y-3 min-w-0">
                          {q.tableData && q.tableData.length > 0 && (
                            <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden">
                              <table className="w-full table-fixed text-xs text-left">
                                <thead className="bg-slate-100 text-slate-700 font-bold">
                                  <tr>
                                    <th className="p-2 sm:p-2.5 border-b w-[35%] break-words">{t.tableStep}</th>
                                    <th className="p-2 sm:p-2.5 border-b w-[65%] break-words">{t.tableAnalysis}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                  {q.tableData.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                      <td className="p-2 sm:p-2.5 font-semibold text-slate-800 align-top break-words [overflow-wrap:anywhere] leading-relaxed">{row.label}</td>
                                      <td className="p-2 sm:p-2.5 font-mono text-indigo-900 break-words [overflow-wrap:anywhere] align-top leading-relaxed">
                                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                                          {row.details}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed min-w-0">
                            <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                              <span>{t.correctAnswerTitle}</span>
                              <span className="font-mono text-emerald-700 font-bold inline-flex flex-wrap items-center gap-x-1 break-words [overflow-wrap:anywhere] max-w-full">
                                {q.renderOption ? q.renderOption(q.correct) : (typeof q.correct === 'number' ? q.correct.toLocaleString(locCode) : q.correct)} {q.unit || ''}
                              </span>
                            </div>
                            <div className="mt-1 break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed min-w-0">
                        <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                          <span>{t.correctAnswerTitle}</span>
                          <span className="font-mono text-emerald-700 font-bold inline-flex flex-wrap items-center gap-x-1 break-words [overflow-wrap:anywhere] max-w-full">
                            {q.renderOption ? q.renderOption(q.correct) : (typeof q.correct === 'number' ? q.correct.toLocaleString(locCode) : q.correct)} {q.unit || ''}
                          </span>
                        </div>
                        <div className="mt-1 break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM SCORE BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              {!submitted ? (
                <div className="text-[11px] sm:text-sm font-bold text-slate-300 truncate">
                  {toCleanUppercase(t.answeredLabel)}: <span className="text-indigo-400 font-black">{answeredCount}</span> / 12
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-400">{toCleanUppercase(isEl ? 'ΣΚΟΡ' : 'SCORE')}: {score} / 12</span>
                  <span className="hidden xs:inline text-slate-500">|</span>
                  <span className="text-indigo-300">{Math.round((score / 12) * 100)}%</span>
                </div>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {!submitted ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className={`px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                    answeredCount > 0
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {toCleanUppercase(t.checkBtn)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-3.5 py-2 sm:px-6 sm:py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition whitespace-nowrap"
                >
                  {toCleanUppercase(t.btnNewSet)}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
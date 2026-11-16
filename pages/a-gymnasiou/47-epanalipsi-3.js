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

// Επαναχρησιμοποιήσιμο Component Τόξου Κύκλου (Το τόξο τοποθετείται πάνω από τα γράμματα)
function Arc({ children, className = "" }) {
  return (
    <span className={`relative inline-block leading-none mx-[1px] ${className}`}>
      <svg
        viewBox="0 0 24 6"
        className="w-[0.95em] h-[0.32em] absolute -top-[0.35em] left-1/2 -translate-x-1/2 text-current overflow-visible pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 5 Q12 -1 23 5" />
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
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="pt-0.5 break-all">
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

// Δυναμικό SVG Σχήμα Επεξήγησης (εμφανίζεται μόνο στο feedback μετά την υποβολή)
function renderFeedbackDiagram(diagram, isEl) {
  if (!diagram) return null;
  const v = isEl
    ? { A: 'Α', B: 'Β', C: 'Γ', D: 'Δ', O: 'Ο', M: 'Μ' }
    : { A: 'A', B: 'B', C: 'C', D: 'D', O: 'O', M: 'M' };

  // 1. Γενικό κυρτό τετράπλευρο ΑΒΓΔ
  if (diagram.type === 'quad') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <polygon points="75,28 205,36 225,126 42,120" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="75" cy="28" r="3.5" fill="#34d399" />
          <circle cx="205" cy="36" r="3.5" fill="#34d399" />
          <circle cx="225" cy="126" r="3.5" fill="#34d399" />
          <circle cx="42" cy="120" r="3.5" fill="#34d399" />
          <text x="68" y="18" textAnchor="middle" className="text-[11px] font-black fill-white">
            {v.A} ({diagram.angA}°)
          </text>
          <text x="212" y="25" textAnchor="middle" className="text-[11px] font-black fill-white">
            {v.B} ({diagram.angB}°)
          </text>
          <text x="230" y="143" textAnchor="middle" className="text-[11px] font-black fill-white">
            {v.C} ({diagram.angC}°)
          </text>
          <text x="38" y="138" textAnchor="middle" className="text-[11px] font-black fill-emerald-300">
            {v.D} ({diagram.angD}°)
          </text>
        </svg>
      </div>
    );
  }

  // 2. Παραλληλόγραμμο / Ρόμβος / Ισοσκελές Τραπέζιο
  if (diagram.type === 'parallelogram') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 270 160" className="w-full max-w-[270px] h-36 select-none">
          <polygon points="75,34 225,34 195,126 45,126" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="75" cy="34" r="3.5" fill="#34d399" />
          <circle cx="225" cy="34" r="3.5" fill="#34d399" />
          <circle cx="195" cy="126" r="3.5" fill="#34d399" />
          <circle cx="45" cy="126" r="3.5" fill="#34d399" />
          <text x="72" y="22" textAnchor="middle" className="text-[11px] font-black fill-white">
            {diagram.angA ? `${v.A} (${diagram.angA}°)` : v.A}
          </text>
          <text x="228" y="22" textAnchor="middle" className="text-[11px] font-black fill-white">
            {diagram.angB ? `${v.B} (${diagram.angB}°)` : v.B}
          </text>
          <text x="200" y="143" textAnchor="middle" className="text-[11px] font-black fill-emerald-300">
            {diagram.angC ? `${v.C} (${diagram.angC}°)` : v.C}
          </text>
          <text x="42" y="143" textAnchor="middle" className="text-[11px] font-black fill-emerald-300">
            {diagram.angD ? `${v.D} (${diagram.angD}°)` : v.D}
          </text>
          {diagram.sideTop && (
            <text x="150" y="24" textAnchor="middle" className="text-[10px] font-mono font-bold fill-amber-300">
              {diagram.sideTop}
            </text>
          )}
          {diagram.sideRight && (
            <text x="218" y="84" textAnchor="start" className="text-[10px] font-mono font-bold fill-sky-300">
              {diagram.sideRight}
            </text>
          )}
        </svg>
      </div>
    );
  }

  // 3. Ρόμβος ΑΒΓΔ
  if (diagram.type === 'rhombus') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <polygon points="132,22 215,82 132,142 49,82" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
          <line x1="132" y1="22" x2="132" y2="142" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="4 3" />
          <line x1="49" y1="82" x2="215" y2="82" stroke="#34d399" strokeWidth="1.8" strokeDasharray="4 3" />
          <polyline points="132,72 142,72 142,82" fill="none" stroke="#fb7185" strokeWidth="1.8" />
          <circle cx="132" cy="82" r="3.5" fill="#fbbf24" />
          <circle cx="132" cy="22" r="3.5" fill="#34d399" />
          <circle cx="215" cy="82" r="3.5" fill="#34d399" />
          <circle cx="132" cy="142" r="3.5" fill="#34d399" />
          <circle cx="49" cy="82" r="3.5" fill="#34d399" />
          <text x="132" y="14" textAnchor="middle" className="text-[11px] font-black fill-white">{v.A}</text>
          <text x="226" y="86" textAnchor="start" className="text-[11px] font-black fill-white">{v.B}</text>
          <text x="132" y="157" textAnchor="middle" className="text-[11px] font-black fill-white">{v.C}</text>
          <text x="38" y="86" textAnchor="end" className="text-[11px] font-black fill-white">{v.D}</text>
          <text x="122" y="75" textAnchor="end" className="text-[10px] font-black fill-amber-300">{v.O}</text>
          {diagram.caption && (
            <text x="132" y="158" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-300" />
          )}
          {diagram.sideLabel && (
            <text x="82" y="46" textAnchor="end" className="text-[10px] font-mono font-bold fill-emerald-300">
              {diagram.sideLabel}
            </text>
          )}
        </svg>
      </div>
    );
  }

  // 4. Τρίγωνο ΟΑΒ από χορδή ΑΒ και ακτίνες ΟΑ, ΟΒ
  if (diagram.type === 'chordTriangle') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <circle cx="132" cy="82" r="56" fill="rgba(99, 102, 241, 0.14)" stroke="#818cf8" strokeWidth="2" />
          <polygon points="132,82 88,116 176,116" fill="rgba(52, 211, 153, 0.18)" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" />
          <line x1="88" y1="116" x2="176" y2="116" stroke="#fbbf24" strokeWidth="2.5" />
          <circle cx="132" cy="82" r="3.5" fill="#ffffff" />
          <circle cx="88" cy="116" r="3.5" fill="#fbbf24" />
          <circle cx="176" cy="116" r="3.5" fill="#fbbf24" />
          <text x="132" y="68" textAnchor="middle" className="text-[11px] font-black fill-white">
            {diagram.angO ? `${v.O} (${diagram.angO}°)` : v.O}
          </text>
          <text x="78" y="124" textAnchor="end" className="text-[11px] font-black fill-amber-300">
            {diagram.angA ? `${v.A} (${diagram.angA}°)` : v.A}
          </text>
          <text x="186" y="124" textAnchor="start" className="text-[11px] font-black fill-amber-300">
            {diagram.angB ? `${v.B} (${diagram.angB}°)` : v.B}
          </text>
          {diagram.rLabel && (
            <>
              <text x="103" y="94" textAnchor="end" className="text-[10px] font-mono font-bold fill-emerald-300">
                {diagram.rLabel}
              </text>
              <text x="161" y="94" textAnchor="start" className="text-[10px] font-mono font-bold fill-emerald-300">
                {diagram.rLabel}
              </text>
            </>
          )}
          {diagram.chordLabel && (
            <text x="132" y="132" textAnchor="middle" className="text-[10px] font-mono font-bold fill-amber-300">
              {diagram.chordLabel}
            </text>
          )}
        </svg>
      </div>
    );
  }

  // 5. Σχετικές θέσεις ευθείας & κύκλου
  if (diagram.type === 'lineCircle') {
    const cx = 132;
    const cy = 74;
    const R = 48;
    const pos = diagram.pos || 'tangent';
    const lineY = pos === 'secant' ? cy + 28 : pos === 'tangent' ? cy + R : cy + 68;
    const lineColor = pos === 'secant' ? '#34d399' : pos === 'tangent' ? '#fbbf24' : '#fb7185';
    const dx = pos === 'secant' ? Math.sqrt(R * R - 28 * 28) : 0;

    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <circle cx={cx} cy={cy} r={R} fill="rgba(99, 102, 241, 0.14)" stroke="#818cf8" strokeWidth="2.2" />
          <line x1={cx} y1={cy} x2={cx - R} y2={cy} stroke="#818cf8" strokeWidth="1.6" strokeDasharray="3 2" />
          <text x={cx - 24} y={cy - 5} textAnchor="middle" className="text-[9px] font-mono font-bold fill-indigo-300">
            ρ={diagram.rLabel}
          </text>
          <line x1="36" y1={lineY} x2="228" y2={lineY} stroke={lineColor} strokeWidth="2.2" />
          <text x="234" y={lineY + 4} className="text-[10px] font-black fill-white">({isEl ? 'ε' : 'l'})</text>
          <line x1={cx} y1={cy} x2={cx} y2={lineY} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 2" />
          <polyline points={`${cx},${lineY - 8} ${cx + 8},${lineY - 8} ${cx + 8},${lineY}`} fill="none" stroke="#ffffff" strokeWidth="1.4" />
          <text x={cx + 11} y={(cy + lineY) / 2 + 3} className="text-[9px] font-mono font-bold fill-white">
            {isEl ? 'δ' : 'd'}={diagram.dLabel}
          </text>
          <circle cx={cx} cy={cy} r="3.5" fill="#ffffff" />
          <text x={cx} y={cy - 8} textAnchor="middle" className="text-[11px] font-black fill-white">{v.O}</text>
          {pos === 'secant' && (
            <>
              <circle cx={cx - dx} cy={lineY} r="3.8" fill="#34d399" />
              <circle cx={cx + dx} cy={lineY} r="3.8" fill="#34d399" />
              <text x={cx - dx - 6} y={lineY + 13} textAnchor="end" className="text-[10px] font-black fill-emerald-300">{v.A}</text>
              <text x={cx + dx + 6} y={lineY + 13} textAnchor="start" className="text-[10px] font-black fill-emerald-300">{v.B}</text>
            </>
          )}
          {pos === 'tangent' && (
            <>
              <circle cx={cx} cy={lineY} r="4" fill="#fbbf24" />
              <text x={cx} y={lineY + 14} textAnchor="middle" className="text-[10px] font-black fill-amber-300">{v.A}</text>
            </>
          )}
        </svg>
      </div>
    );
  }

  // 6. Επίκεντρη γωνία & Κυκλικός τομέας
  if (diagram.type === 'sector') {
    const cx = 132;
    const cy = 82;
    const R = 52;
    const omega = diagram.omega || 80;
    const rad = (omega * Math.PI) / 180;
    const Ax = cx + R;
    const Ay = cy;
    const Bx = cx + R * Math.cos(-rad);
    const By = cy + R * Math.sin(-rad);
    const largeArc = omega > 180 ? 1 : 0;
    const sectorD = `M ${cx},${cy} L ${Ax},${Ay} A ${R},${R} 0 ${largeArc},0 ${Bx.toFixed(1)},${By.toFixed(1)} Z`;
    const arcD = `M ${Ax},${Ay} A ${R},${R} 0 ${largeArc},0 ${Bx.toFixed(1)},${By.toFixed(1)}`;

    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <circle cx={cx} cy={cy} r={R} fill="rgba(99, 102, 241, 0.14)" stroke="#64748b" strokeWidth="1.8" />
          <path d={sectorD} fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" />
          <path d={arcD} fill="none" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="3.5" fill="#ffffff" />
          <circle cx={Ax} cy={Ay} r="3.8" fill="#fbbf24" />
          <circle cx={Bx} cy={By} r="3.8" fill="#fbbf24" />
          <text x={cx - 8} y={cy + 4} textAnchor="end" className="text-[11px] font-black fill-white">{v.O}</text>
          <text x={Ax + 8} y={Ay + 4} textAnchor="start" className="text-[11px] font-black fill-amber-300">{v.A}</text>
          <text
            x={Bx + (Bx >= cx ? 8 : -8)}
            y={By + (By >= cy ? 12 : -6)}
            textAnchor={Bx >= cx ? 'start' : 'end'}
            className="text-[11px] font-black fill-amber-300"
          >
            {v.B}
          </text>
          <text x={cx} y={154} textAnchor="middle" className="text-[10px] font-mono font-bold fill-amber-300">
            {diagram.caption || `ω = ${omega}°`}
          </text>
        </svg>
      </div>
    );
  }

  return null;
}

export default function Epanalipsi3Exercises() {
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
    pageTitle: isEl ? "Επανάληψη 3: Κεφάλαια 08, 09 & 10 | Α' Γυμνασίου" : "Review 3: Chapters 08, 09 & 10 | Grade 7",
    pageDesc: isEl
      ? "Επαναληπτικές ασκήσεις και συνδυαστικά προβλήματα Α' Γυμνασίου στα Κεφάλαια 08 (Τα Τετράπλευρα), 09 (Ο Κύκλος) και 10 (Επίκεντρη Γωνία & Ευθεία – Κύκλος)."
      : "Grade 7 review exercises and challenging problems covering Chapters 08 (Quadrilaterals), 09 (The Circle), and 10 (Central Angle & Line – Circle).",
    backNav: isEl ? "Α' Γυμνασίου" : "Grade 7",
    theoryBtn: isEl ? "ΚΕΦΑΛΑΙΑ 08-10" : "CHAPTERS 08-10",
    heroBadge: isEl ? "ΕΠΑΝΑΛΗΨΗ 3 • ΚΕΦΑΛΑΙΑ 08, 09 & 10 • Α' ΓΥΜΝΑΣΙΟΥ" : "REVIEW 3 • CHAPTERS 08, 09 & 10 • GRADE 7",
    heroTitle: isEl ? "Επανάληψη 3: Τετράπλευρα, Κύκλος & Επίκεντρη Γωνία" : "Review 3: Quadrilaterals, Circle & Central Angle",
    heroDesc: isEl
      ? "15 δυναμικές ερωτήσεις (4 ασκήσεις ανά κεφάλαιο + 3 απαιτητικά προβλήματα εφαρμογής στο τέλος). Κάθε νέο σετ παράγει διαφορετικά θέματα!"
      : "15 dynamic questions (4 exercises per chapter + 3 challenging problems at the end). Every new set generates fresh problems!",
    btnNewSet: isEl ? "ΝΕΟ ΕΠΑΝΑΛΗΠΤΙΚΟ ΣΕΤ" : "NEW REVIEW SET",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl
      ? "Άριστη επίδοση! Κατέχετε πλήρως τα τετράπλευρα, τον κύκλο (Ο, ρ) και τις επίκεντρες γωνίες (Κεφάλαια 08, 09 και 10)."
      : "Excellent performance! You have mastered quadrilaterals, the circle (O, ρ), and central angles (Chapters 08, 09, and 10).",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Ελέγξτε τις αναλυτικές λύσεις και τα σχήματα στα προβλήματα που δυσκολευτήκατε."
      : "Very good effort! Check the detailed solutions and diagrams for any problems you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στα Κεφάλαια 08, 09 και 10!"
      : "Needs a bit more review on Chapters 08, 09, and 10!",
    correctBadge: isEl ? "✓ Σωστό" : "✓ Correct",
    wrongBadge: isEl ? "✗ Λάθος" : "✗ Wrong",
    answeredLabel: isEl ? "ΑΠΑΝΤΗΘΗΚΑΝ" : "ANSWERED",
    checkBtn: isEl ? "ΕΛΕΓΧΟΣ" : "CHECK",
    correctAnswerTitle: isEl ? "Σωστή Απάντηση:" : "Correct Answer:",
    tableStep: isEl ? "Στοιχείο / Βήμα" : "Element / Step",
    tableAnalysis: isEl ? "Ανάλυση Δεδομένων" : "Data Analysis"
  };

  const loadNewSet = () => {
    const qList = [];

    // =========================================================================
    // ΜΕΡΟΣ Α: 4 ΑΣΚΗΣΕΙΣ ΑΠΟ ΤΟ ΚΕΦΑΛΑΙΟ 08 (Τα Τετράπλευρα)
    // =========================================================================

    // --- ΚΕΦ. 08 • ΑΣΚΗΣΗ 1: Κανόνας 4-4-4-2 & Άθροισμα Γωνιών 360° ---
    const q1Mode = randInt(0, 1);
    if (q1Mode === 0) {
      const a1 = randInt(65, 110);
      const b1 = randInt(70, 108);
      const c1 = randInt(60, 105);
      const d1 = 360 - (a1 + b1 + c1);

      qList.push({
        id: 1,
        chapterBadge: isEl ? 'ΚΕΦ. 08 • ΑΣΚΗΣΗ 1' : 'CH. 08 • EXERCISE 1',
        title: isEl ? 'Άθροισμα Γωνιών Τετραπλεύρου (360°)' : 'Sum of Angles in a Quadrilateral (360°)',
        prompt: isEl ? (
          <span>
            Σε κυρτό τετράπλευρο ΑΒΓΔ δίνονται <Angle>Α</Angle> ＝ {a1}°, <Angle>Β</Angle> ＝ {b1}° και <Angle>Γ</Angle> ＝ {c1}°. Πόσες μοίρες είναι η τέταρτη γωνία <Angle>Δ</Angle>;
          </span>
        ) : (
          <span>
            In convex quadrilateral ABCD, ∠A ＝ {a1}°, ∠B ＝ {b1}°, and ∠C ＝ {c1}°. How many degrees is the fourth angle ∠D?
          </span>
        ),
        type: 'input',
        correct: d1,
        unit: '°',
        diagram: { type: 'quad', angA: a1, angB: b1, angC: c1, angD: d1 },
        explanation: isEl ? (
          <span>
            Το άθροισμα των γωνιών κάθε τετραπλεύρου είναι 360°: <Angle>Δ</Angle> ＝ 360° － ({a1}° ＋ {b1}° ＋ {c1}°) ＝ 360° － {a1 + b1 + c1}° ＝ {d1}°.
          </span>
        ) : (
          <span>
            The angles of any quadrilateral sum to 360°: ∠D ＝ 360° － ({a1}° ＋ {b1}° ＋ {c1}°) ＝ 360° － {a1 + b1 + c1}° ＝ {d1}°.
          </span>
        )
      });
    } else {
      const tf1 = Math.random() < 0.5;
      qList.push({
        id: 1,
        chapterBadge: isEl ? 'ΚΕΦ. 08 • ΑΣΚΗΣΗ 1' : 'CH. 08 • EXERCISE 1',
        title: isEl ? 'Κανόνας 4-4-4-2 του Τετραπλεύρου' : 'The 4-4-4-2 Rule of a Quadrilateral',
        prompt: tf1
          ? (isEl
              ? 'Σύμφωνα με τον κανόνα 4-4-4-2, κάθε κυρτό τετράπλευρο έχει 4 κορυφές, 4 πλευρές, 4 γωνίες και 2 διαγωνίους.'
              : 'According to the 4-4-4-2 rule, every convex quadrilateral has 4 vertices, 4 sides, 4 angles, and 2 diagonals.')
          : (isEl
              ? 'Κάθε κυρτό τετράπλευρο έχει 4 διαγωνίους και το άθροισμα των γωνιών του είναι 180°.'
              : 'Every convex quadrilateral has 4 diagonals and its interior angles sum to 180°.'),
        type: 'tf',
        correct: tf1 ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
        options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
        explanation: isEl
          ? 'Κάθε τετράπλευρο έχει 4 κορυφές, 4 πλευρές, 4 γωνίες και 2 διαγωνίους (κανόνας 4-4-4-2), με άθροισμα γωνιών 360°.'
          : 'Every quadrilateral has 4 vertices, 4 sides, 4 angles, and 2 diagonals (4-4-4-2 rule), with interior angles summing to 360°.'
      });
    }

    // --- ΚΕΦ. 08 • ΑΣΚΗΣΗ 2: Είδη Τετραπλεύρων & Ιεραρχία ---
    const defPool2 = isEl
      ? [
          {
            q: 'Ποιο τετράπλευρο είναι ταυτόχρονα ορθογώνιο και ρόμβος (έχει 4 ίσες πλευρές και 4 ορθές γωνίες);',
            c: 'Τετράγωνο',
            e: 'Το τετράγωνο συνδυάζει τις ιδιότητες του ορθογωνίου (4 ορθές γωνίες) και του ρόμβου (4 ίσες πλευρές).'
          },
          {
            q: 'Πώς ονομάζεται το παραλληλόγραμμο που έχει και τις τέσσερις πλευρές του ίσες;',
            c: 'Ρόμβος',
            e: 'Ρόμβος είναι το παραλληλόγραμμο με 4 ίσες πλευρές.'
          },
          {
            q: 'Πώς ονομάζεται το τετράπλευρο που έχει μόνο δύο απέναντι πλευρές παράλληλες (τις βάσεις);',
            c: 'Τραπέζιο',
            e: 'Τραπέζιο είναι το τετράπλευρο με ακριβώς ένα ζεύγος παράλληλων πλευρών.'
          },
          {
            q: 'Πώς ονομάζεται το παραλληλόγραμμο που έχει και τις τέσσερις γωνίες του ορθές (90°);',
            c: 'Ορθογώνιο',
            e: 'Ορθογώνιο είναι το παραλληλόγραμμο με 4 ορθές γωνίες.'
          }
        ]
      : [
          {
            q: 'Which quadrilateral is simultaneously a rectangle and a rhombus (4 equal sides and 4 right angles)?',
            c: 'Square',
            e: 'A square combines the properties of a rectangle (4 right angles) and a rhombus (4 equal sides).'
          },
          {
            q: 'What is a parallelogram with all four sides equal called?',
            c: 'Rhombus',
            e: 'A rhombus is a parallelogram with 4 equal sides.'
          },
          {
            q: 'What is a quadrilateral with only one pair of parallel opposite sides called?',
            c: 'Trapezoid',
            e: 'A trapezoid is a quadrilateral with exactly one pair of parallel sides.'
          },
          {
            q: 'What is a parallelogram with all four angles equal to 90° called?',
            c: 'Rectangle',
            e: 'A rectangle is a parallelogram with 4 right angles.'
          }
        ];

    const pickedDef2 = pickRandom(defPool2);
    const dist2 = isEl
      ? ['Τετράγωνο', 'Ρόμβος', 'Τραπέζιο', 'Ορθογώνιο', 'Σκαληνό τετράπλευρο']
      : ['Square', 'Rhombus', 'Trapezoid', 'Rectangle', 'Scalene quadrilateral'];

    qList.push({
      id: 2,
      chapterBadge: isEl ? 'ΚΕΦ. 08 • ΑΣΚΗΣΗ 2' : 'CH. 08 • EXERCISE 2',
      title: isEl ? 'Είδη Τετραπλεύρων' : 'Types of Quadrilaterals',
      prompt: pickedDef2.q,
      type: 'mcq',
      correct: pickedDef2.c,
      options: ensureFourUniqueOptions(pickedDef2.c, () => pickRandom(dist2)),
      explanation: pickedDef2.e
    });

    // --- ΚΕΦ. 08 • ΑΣΚΗΣΗ 3: Γωνίες Παραλληλογράμμου ή Ισοσκελούς Τραπεζίου ---
    const angA3 = randInt(52, 126);
    const angB3 = 180 - angA3;
    const askOpp3 = Math.random() < 0.5;

    qList.push({
      id: 3,
      chapterBadge: isEl ? 'ΚΕΦ. 08 • ΑΣΚΗΣΗ 3' : 'CH. 08 • EXERCISE 3',
      title: isEl ? 'Γωνίες Παραλληλογράμμου' : 'Angles of a Parallelogram',
      prompt: askOpp3
        ? (isEl ? (
            <span>
              Σε παραλληλόγραμμο ΑΒΓΔ, η γωνία <Angle>Α</Angle> είναι {angA3}°. Πόσες μοίρες είναι η απέναντι γωνία <Angle>Γ</Angle>;
            </span>
          ) : (
            <span>
              In parallelogram ABCD, angle ∠A measures {angA3}°. How many degrees is the opposite angle ∠C?
            </span>
          ))
        : (isEl ? (
            <span>
              Σε παραλληλόγραμμο ΑΒΓΔ, η γωνία <Angle>Α</Angle> είναι {angA3}°. Πόσες μοίρες είναι η διαδοχική γωνία <Angle>Β</Angle>;
            </span>
          ) : (
            <span>
              In parallelogram ABCD, angle ∠A measures {angA3}°. How many degrees is the consecutive angle ∠B?
            </span>
          )),
      type: 'input',
      correct: askOpp3 ? angA3 : angB3,
      unit: '°',
      diagram: { type: 'parallelogram', angA: angA3, angB: angB3, angC: angA3, angD: angB3 },
      explanation: askOpp3 ? (
        isEl ? (
          <span>
            Οι απέναντι γωνίες παραλληλογράμμου είναι ίσες, άρα <Angle>Γ</Angle> ＝ <Angle>Α</Angle> ＝ {angA3}°.
          </span>
        ) : (
          <span>
            Opposite angles of a parallelogram are equal, so ∠C ＝ ∠A ＝ {angA3}°.
          </span>
        )
      ) : isEl ? (
        <span>
          Οι διαδοχικές γωνίες παραλληλογράμμου είναι παραπληρωματικές (<Angle>Α</Angle> ＋ <Angle>Β</Angle> ＝ 180°), άρα <Angle>Β</Angle> ＝ 180° － {angA3}° ＝ {angB3}°.
        </span>
      ) : (
        <span>
          Consecutive angles of a parallelogram are supplementary (∠A ＋ ∠B ＝ 180°), so ∠B ＝ 180° － {angA3}° ＝ {angB3}°.
        </span>
      )
    });

    // --- ΚΕΦ. 08 • ΑΣΚΗΣΗ 4: Ιδιότητες Διαγωνίων Τετραπλεύρων ---
    const diagPool4 = isEl
      ? [
          {
            q: 'Ποιο από τα παρακάτω ισχύει για τις διαγωνίους ενός ρόμβου;',
            c: 'Είναι κάθετες (90°), διχοτομούνται και διχοτομούν τις γωνίες του',
            e: 'Οι διαγώνιοι του ρόμβου είναι κάθετες, διχοτομούνται και διχοτομούν τις γωνίες του.'
          },
          {
            q: 'Ποιο από τα παρακάτω ισχύει για τις διαγωνίους ενός ορθογωνίου;',
            c: 'Έχουν ίσο μήκος (ΑΓ ＝ ΒΔ) και διχοτομούνται',
            e: 'Στο ορθογώνιο οι διαγώνιοι είναι ίσες μεταξύ τους και διχοτομούνται.'
          },
          {
            q: 'Πόσες μοίρες είναι η γωνία που σχηματίζει η διαγώνιος ενός τετραγώνου με κάθε πλευρά του;',
            c: '45°',
            e: 'Η διαγώνιος του τετραγώνου διχοτομεί την ορθή γωνία 90°, άρα σχηματίζει γωνία 45°.'
          }
        ]
      : [
          {
            q: 'Which statement holds for the diagonals of a rhombus?',
            c: 'They are perpendicular (90°), bisect each other, and bisect the angles',
            e: 'Rhombus diagonals are perpendicular, bisect each other, and bisect the interior angles.'
          },
          {
            q: 'Which statement holds for the diagonals of a rectangle?',
            c: 'They have equal length (AC ＝ BD) and bisect each other',
            e: 'In a rectangle, the diagonals are equal in length and bisect each other.'
          },
          {
            q: 'How many degrees is the angle formed by a diagonal of a square and each of its sides?',
            c: '45°',
            e: 'The diagonal of a square bisects its 90° right angle, forming a 45° angle.'
          }
        ];

    const pickedDiag4 = pickRandom(diagPool4);
    const dist4 = isEl
      ? [
          'Είναι κάθετες (90°), διχοτομούνται και διχοτομούν τις γωνίες του',
          'Έχουν ίσο μήκος (ΑΓ ＝ ΒΔ) και διχοτομούνται',
          '45°',
          'Είναι παράλληλες μεταξύ τους',
          'Δεν τέμνονται ποτέ'
        ]
      : [
          'They are perpendicular (90°), bisect each other, and bisect the angles',
          'They have equal length (AC ＝ BD) and bisect each other',
          '45°',
          'They are parallel to each other',
          'They never intersect'
        ];

    qList.push({
      id: 4,
      chapterBadge: isEl ? 'ΚΕΦ. 08 • ΑΣΚΗΣΗ 4' : 'CH. 08 • EXERCISE 4',
      title: isEl ? 'Διαγώνιοι Τετραπλεύρων' : 'Diagonals of Quadrilaterals',
      prompt: pickedDiag4.q,
      type: 'mcq',
      correct: pickedDiag4.c,
      options: ensureFourUniqueOptions(pickedDiag4.c, () => pickRandom(dist4)),
      explanation: pickedDiag4.e
    });

    // =========================================================================
    // ΜΕΡΟΣ Β: 4 ΑΣΚΗΣΕΙΣ ΑΠΟ ΤΟ ΚΕΦΑΛΑΙΟ 09 (Ο Κύκλος & τα Στοιχεία του)
    // =========================================================================

    // --- ΚΕΦ. 09 • ΑΣΚΗΣΗ 1: Ακτίνα ρ & Διάμετρος δ ---
    const r5 = randInt(5, 18);
    const d5 = 2 * r5;
    const askR5 = Math.random() < 0.5;

    qList.push({
      id: 5,
      chapterBadge: isEl ? 'ΚΕΦ. 09 • ΑΣΚΗΣΗ 1' : 'CH. 09 • EXERCISE 1',
      title: isEl ? 'Ακτίνα ρ & Διάμετρος Κύκλου' : 'Radius ρ & Diameter of a Circle',
      prompt: askR5
        ? (isEl
            ? `Ένας κύκλος (Ο, ρ) έχει διάμετρο δ ＝ ${d5} cm. Πόσα εκατοστά (cm) είναι η ακτίνα ρ του κύκλου;`
            : `A circle (O, ρ) has diameter d ＝ ${d5} cm. What is the radius ρ of the circle in cm?`)
        : (isEl
            ? `Ένας κύκλος (Ο, ρ) έχει ακτίνα ρ ＝ ${r5} cm. Πόσα εκατοστά (cm) είναι η διάμετρός του δ;`
            : `A circle (O, ρ) has radius ρ ＝ ${r5} cm. What is its diameter d in cm?`),
      type: 'input',
      correct: askR5 ? r5 : d5,
      unit: 'cm',
      explanation: askR5 ? (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>{isEl ? 'Η ακτίνα ρ είναι το μισό της διαμέτρου:' : 'Radius ρ is half the diameter:'}</span>
          <span className="inline-flex items-center font-mono">
            ρ ＝ <Frac num={d5} den="2" /> ＝ {r5} cm.
          </span>
        </span>
      ) : (
        <span className="font-mono">
          {isEl ? `δ ＝ 2 · ρ ＝ 2 · ${r5} ＝ ${d5} cm.` : `d ＝ 2 · ρ ＝ 2 · ${r5} ＝ ${d5} cm.`}
        </span>
      )
    });

    // --- ΚΕΦ. 09 • ΑΣΚΗΣΗ 2: Εσωτερικό Κύκλου, Κύκλος & Κυκλικός Δίσκος ---
    const r6 = randInt(6, 14);
    const pos6 = pickRandom(['inside', 'on', 'outside']);
    const dist6 = pos6 === 'inside' ? randInt(2, r6 - 1) : pos6 === 'on' ? r6 : r6 + randInt(2, 6);
    const corr6 = isEl
      ? pos6 === 'inside'
        ? 'Στο εσωτερικό του κύκλου'
        : pos6 === 'on'
        ? 'Πάνω στον κύκλο'
        : 'Στο εξωτερικό του κύκλου'
      : pos6 === 'inside'
      ? 'In the interior of the circle'
      : pos6 === 'on'
      ? 'On the circle'
      : 'In the exterior of the circle';

    const opts6 = isEl
      ? ['Στο εσωτερικό του κύκλου', 'Πάνω στον κύκλο', 'Στο εξωτερικό του κύκλου', 'Στο κέντρο Ο']
      : ['In the interior of the circle', 'On the circle', 'In the exterior of the circle', 'At center O'];

    qList.push({
      id: 6,
      chapterBadge: isEl ? 'ΚΕΦ. 09 • ΑΣΚΗΣΗ 2' : 'CH. 09 • EXERCISE 2',
      title: isEl ? 'Εσωτερικό & Εξωτερικό Κύκλου (Ο, ρ)' : 'Interior & Exterior of Circle (O, ρ)',
      prompt: isEl
        ? `Δίνεται κύκλος (Ο, ρ) με ακτίνα ρ ＝ ${r6} cm. Αν ένα σημείο Μ απέχει από το κέντρο Ο απόσταση ΟΜ ＝ ${dist6} cm, πού βρίσκεται το σημείο Μ;`
        : `Given circle (O, ρ) with radius ρ ＝ ${r6} cm, if point M is at distance OM ＝ ${dist6} cm from center O, where is point M located?`,
      type: 'mcq',
      correct: corr6,
      options: ensureFourUniqueOptions(corr6, () => pickRandom(opts6)),
      explanation: isEl
        ? pos6 === 'inside'
          ? `ΟΜ ＝ ${dist6} cm ＜ ${r6} cm (ΟΜ ＜ ρ), άρα βρίσκεται στο εσωτερικό του κύκλου.`
          : pos6 === 'on'
          ? `ΟΜ ＝ ${dist6} cm ＝ ρ, άρα βρίσκεται πάνω στον κύκλο (Ο, ρ).`
          : `ΟΜ ＝ ${dist6} cm ＞ ${r6} cm (ΟΜ ＞ ρ), άρα βρίσκεται στο εξωτερικό του κύκλου.`
        : pos6 === 'inside'
        ? `OM ＝ ${dist6} cm ＜ ${r6} cm (OM ＜ ρ), so it lies in the interior of the circle.`
        : pos6 === 'on'
        ? `OM ＝ ${dist6} cm ＝ ρ, so it lies on the circle (O, ρ).`
        : `OM ＝ ${dist6} cm ＞ ${r6} cm (OM ＞ ρ), so it lies in the exterior of the circle.`
    });

    // --- ΚΕΦ. 09 • ΑΣΚΗΣΗ 3: Χορδή, Διάμετρος, Τόξο & Ημικύκλιο ---
    const elPool7 = isEl
      ? [
          {
            q: 'Πώς ονομάζεται το ευθύγραμμο τμήμα που ενώνει δύο οποιαδήποτε σημεία ενός κύκλου;',
            c: 'Χορδή',
            e: 'Χορδή ονομάζεται κάθε ευθύγραμμο τμήμα που ενώνει δύο σημεία του κύκλου.'
          },
          {
            q: 'Πώς ονομάζεται η μεγαλύτερη χορδή ενός κύκλου, η οποία διέρχεται από το κέντρο Ο;',
            c: 'Διάμετρος',
            e: 'Η διάμετρος είναι χορδή που περνά από το κέντρο Ο και έχει μήκος 2ρ.'
          },
          {
            q: 'Πώς ονομάζεται καθένα από τα δύο ίσα τόξα που ορίζουν τα άκρα μιας διαμέτρου;',
            c: 'Ημικύκλιο',
            e: 'Τα άκρα μιας διαμέτρου χωρίζουν τον κύκλο σε δύο ίσα τόξα, καθένα από τα οποία λέγεται ημικύκλιο.'
          }
        ]
      : [
          {
            q: 'What is a line segment joining any two points on a circle called?',
            c: 'Chord',
            e: 'A chord is a line segment connecting any two points on a circle.'
          },
          {
            q: 'What is the longest chord of a circle, passing through center O, called?',
            c: 'Diameter',
            e: 'A diameter is a chord through center O with length 2ρ.'
          },
          {
            q: 'What is each of the two equal arcs determined by the endpoints of a diameter called?',
            c: 'Semicircle',
            e: 'The endpoints of a diameter divide the circle into two equal arcs called semicircles.'
          }
        ];

    const pickedEl7 = pickRandom(elPool7);
    const dist7 = isEl
      ? ['Χορδή', 'Διάμετρος', 'Ημικύκλιο', 'Ακτίνα', 'Κυκλικός δίσκος']
      : ['Chord', 'Diameter', 'Semicircle', 'Radius', 'Circular disk'];

    qList.push({
      id: 7,
      chapterBadge: isEl ? 'ΚΕΦ. 09 • ΑΣΚΗΣΗ 3' : 'CH. 09 • EXERCISE 3',
      title: isEl ? 'Στοιχεία Κύκλου (Χορδή, Διάμετρος, Τόξο)' : 'Circle Elements (Chord, Diameter, Arc)',
      prompt: pickedEl7.q,
      type: 'mcq',
      correct: pickedEl7.c,
      options: ensureFourUniqueOptions(pickedEl7.c, () => pickRandom(dist7)),
      explanation: pickedEl7.e
    });

    // --- ΚΕΦ. 09 • ΑΣΚΗΣΗ 4: Ισοσκελές τρίγωνο ΟΑΒ από ακτίνες & χορδή ---
    const angO8 = randInt(22, 60) * 2;
    const baseAng8 = (180 - angO8) / 2;

    qList.push({
      id: 8,
      chapterBadge: isEl ? 'ΚΕΦ. 09 • ΑΣΚΗΣΗ 4' : 'CH. 09 • EXERCISE 4',
      title: isEl ? 'Τρίγωνο Ακτίνων & Χορδής (ΟΑΒ)' : 'Triangle of Radii & Chord (OAB)',
      prompt: isEl ? (
        <span>
          Σε κύκλο (Ο, ρ) φέρνουμε μια χορδή ΑΒ ώστε η γωνία Α<Angle>Ο</Angle>Β να είναι {angO8}°. Πόσες μοίρες είναι η γωνία Ο<Angle>Α</Angle>Β;
        </span>
      ) : (
        <span>
          In circle (O, ρ), draw chord AB such that ∠AOB ＝ {angO8}°. How many degrees is angle ∠OAB?
        </span>
      ),
      type: 'input',
      correct: baseAng8,
      unit: '°',
      diagram: { type: 'chordTriangle', angO: angO8, angA: baseAng8, angB: baseAng8 },
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>{isEl ? 'Επειδή ΟΑ ＝ ΟΒ ＝ ρ, το τρίγωνο ΟΑΒ είναι ισοσκελές:' : 'Since OA ＝ OB ＝ ρ, triangle OAB is isosceles:'}</span>
          <span className="inline-flex items-center font-mono">
            Ο<Angle>Α</Angle>Β ＝ <Frac num={`180° － ${angO8}°`} den="2" /> ＝ {baseAng8}°.
          </span>
        </span>
      )
    });

    // =========================================================================
    // ΜΕΡΟΣ Γ: 4 ΑΣΚΗΣΕΙΣ ΑΠΟ ΤΟ ΚΕΦΑΛΑΙΟ 10 (Επίκεντρη Γωνία & Ευθεία – Κύκλος)
    // =========================================================================

    // --- ΚΕΦ. 10 • ΑΣΚΗΣΗ 1: Μέτρο τόξου & Κυκλικού τομέα ---
    const omega9 = randInt(35, 155);
    qList.push({
      id: 9,
      chapterBadge: isEl ? 'ΚΕΦ. 10 • ΑΣΚΗΣΗ 1' : 'CH. 10 • EXERCISE 1',
      title: isEl ? 'Επίκεντρη Γωνία & Μέτρο Τόξου' : 'Central Angle & Arc Degree Measure',
      prompt: isEl ? (
        <span>
          Σε κύκλο (Ο, ρ) η επίκεντρη γωνία Α<Angle>Ο</Angle>Β είναι {omega9}°. Πόσες μοίρες είναι το μέτρο του αντίστοιχου τόξου <Arc>ΑΒ</Arc> (και η γωνία του κυκλικού τομέα ΟΑΒ);
        </span>
      ) : (
        <span>
          In circle (O, ρ), central angle ∠AOB measures {omega9}°. How many degrees is the measure of its intercepted arc <Arc>AB</Arc> (and the angle of sector OAB)?
        </span>
      ),
      type: 'input',
      correct: omega9,
      unit: '°',
      diagram: { type: 'sector', omega: omega9, caption: `ω = ${omega9}°` },
      explanation: isEl ? (
        <span>
          Το μέτρο τόξου σε μοίρες ισούται με την αντίστοιχη επίκεντρη γωνία, άρα <Arc>ΑΒ</Arc> ＝ Α<Angle>Ο</Angle>Β ＝ {omega9}°.
        </span>
      ) : (
        <span>
          The degree measure of an arc equals its corresponding central angle, so arc AB ＝ ∠AOB ＝ {omega9}°.
        </span>
      )
    });

    // --- ΚΕΦ. 10 • ΑΣΚΗΣΗ 2: Ίσες & Άνισες Επίκεντρες Γωνίες ---
    const eqMode10 = Math.random() < 0.5;
    if (eqMode10) {
      const chord10 = randInt(5, 13);
      const ang10 = randInt(42, 108);
      qList.push({
        id: 10,
        chapterBadge: isEl ? 'ΚΕΦ. 10 • ΑΣΚΗΣΗ 2' : 'CH. 10 • EXERCISE 2',
        title: isEl ? 'Ίσες Επίκεντρες Γωνίες & Χορδές' : 'Equal Central Angles & Chords',
        prompt: isEl ? (
          <span>
            Στον ίδιο κύκλο (Ο, ρ) δίνονται Α<Angle>Ο</Angle>Β ＝ {ang10}° και Γ<Angle>Ο</Angle>Δ ＝ {ang10}°. Αν η χορδή ΑΒ είναι {chord10} cm, πόσα εκατοστά (cm) είναι η χορδή ΓΔ;
          </span>
        ) : (
          <span>
            In the same circle (O, ρ), ∠AOB ＝ {ang10}° and ∠COD ＝ {ang10}°. If chord AB measures {chord10} cm, what is the length of chord CD in cm?
          </span>
        ),
        type: 'input',
        correct: chord10,
        unit: 'cm',
        explanation: isEl ? (
          <span>
            Ίσες επίκεντρες γωνίες (Α<Angle>Ο</Angle>Β ＝ Γ<Angle>Ο</Angle>Δ ＝ {ang10}°) υποτείνουν ίσες χορδές, άρα ΓΔ ＝ ΑΒ ＝ {chord10} cm.
          </span>
        ) : (
          <span>
            Equal central angles (∠AOB ＝ ∠COD ＝ {ang10}°) subtend equal chords, so CD ＝ AB ＝ {chord10} cm.
          </span>
        )
      });
    } else {
      const tf10 = Math.random() < 0.5;
      qList.push({
        id: 10,
        chapterBadge: isEl ? 'ΚΕΦ. 10 • ΑΣΚΗΣΗ 2' : 'CH. 10 • EXERCISE 2',
        title: isEl ? 'Άνισες Επίκεντρες Γωνίες, Τόξα & Χορδές' : 'Unequal Central Angles, Arcs & Chords',
        prompt: tf10
          ? (isEl
              ? 'Στον ίδιο κύκλο, αν δύο επίκεντρες γωνίες είναι άνισες (και ≤ 180°), στη μεγαλύτερη επίκεντρη γωνία αντιστοιχεί μεγαλύτερο τόξο και μεγαλύτερη χορδή.'
              : 'In the same circle, for two unequal central angles (≤ 180°), the larger central angle intercepts a larger arc and a longer chord.')
          : (isEl
              ? 'Στον ίδιο κύκλο, δύο άνισες επίκεντρες γωνίες (π.χ. 50° και 110°) υποτείνουν ίσες χορδές επειδή ανήκουν στον ίδιο κύκλο.'
              : 'In the same circle, two unequal central angles (e.g., 50° and 110°) subtend equal chords because they belong to the same circle.'),
        type: 'tf',
        correct: tf10 ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
        options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
        explanation: isEl
          ? 'Στον ίδιο κύκλο (για γωνίες ≤ 180°), μεγαλύτερη επίκεντρη γωνία αντιστοιχεί σε μεγαλύτερο τόξο και μεγαλύτερη χορδή.'
          : 'In the same circle (for angles ≤ 180°), a larger central angle corresponds to a larger arc and a longer chord.'
      });
    }

    // --- ΚΕΦ. 10 • ΑΣΚΗΣΗ 3: Σχετικές Θέσεις Ευθείας & Κύκλου ---
    const r11 = randInt(6, 13);
    const pos11 = pickRandom(['secant', 'tangent', 'exterior']);
    const d11 = pos11 === 'secant' ? randInt(2, r11 - 1) : pos11 === 'tangent' ? r11 : r11 + randInt(2, 6);
    const corr11 = isEl
      ? pos11 === 'secant'
        ? 'Τέμνουσα ευθεία (2 κοινά σημεία)'
        : pos11 === 'tangent'
        ? 'Εφαπτόμενη ευθεία (1 κοινό σημείο)'
        : 'Εξωτερική ευθεία (0 κοινά σημεία)'
      : pos11 === 'secant'
      ? 'Secant line (2 common points)'
      : pos11 === 'tangent'
      ? 'Tangent line (1 common point)'
      : 'Exterior line (0 common points)';

    const dist11 = isEl
      ? [
          'Τέμνουσα ευθεία (2 κοινά σημεία)',
          'Εφαπτόμενη ευθεία (1 κοινό σημείο)',
          'Εξωτερική ευθεία (0 κοινά σημεία)',
          'Διάμετρος του κύκλου'
        ]
      : [
          'Secant line (2 common points)',
          'Tangent line (1 common point)',
          'Exterior line (0 common points)',
          'Diameter of the circle'
        ];

    qList.push({
      id: 11,
      chapterBadge: isEl ? 'ΚΕΦ. 10 • ΑΣΚΗΣΗ 3' : 'CH. 10 • EXERCISE 3',
      title: isEl ? 'Σχετικές Θέσεις Ευθείας & Κύκλου' : 'Relative Positions of Line & Circle',
      prompt: isEl
        ? `Κύκλος (Ο, ρ) έχει ακτίνα ρ ＝ ${r11} cm και μια ευθεία (ε) απέχει από το κέντρο Ο απόσταση δ ＝ ${d11} cm. Ποια είναι η σχετική θέση της (ε) ως προς τον κύκλο;`
        : `Circle (O, ρ) has radius ρ ＝ ${r11} cm and line (l) lies at distance d ＝ ${d11} cm from center O. What is the relative position of (l) to the circle?`,
      type: 'mcq',
      correct: corr11,
      options: ensureFourUniqueOptions(corr11, () => pickRandom(dist11)),
      diagram: { type: 'lineCircle', pos: pos11, rLabel: `${r11}`, dLabel: `${d11}` },
      explanation: isEl
        ? pos11 === 'secant'
          ? `δ ＝ ${d11} cm ＜ ${r11} cm (δ ＜ ρ), άρα η ευθεία είναι τέμνουσα (2 κοινά σημεία).`
          : pos11 === 'tangent'
          ? `δ ＝ ${d11} cm ＝ ρ, άρα η ευθεία είναι εφαπτόμενη (1 κοινό σημείο).`
          : `δ ＝ ${d11} cm ＞ ${r11} cm (δ ＞ ρ), άρα η ευθεία είναι εξωτερική (0 κοινά σημεία).`
        : pos11 === 'secant'
        ? `d ＝ ${d11} cm ＜ ${r11} cm (d ＜ ρ), so the line is secant (2 common points).`
        : pos11 === 'tangent'
        ? `d ＝ ${d11} cm ＝ ρ, so the line is tangent (1 common point).`
        : `d ＝ ${d11} cm ＞ ${r11} cm (d ＞ ρ), so the line is exterior (0 common points).`
    });

    // --- ΚΕΦ. 10 • ΑΣΚΗΣΗ 4: Ιδιότητα Εφαπτομένης (ΟΑ ⊥ ε -> 90°) ---
    const angO12 = randInt(25, 65);
    const angM12 = 90 - angO12;

    qList.push({
      id: 12,
      chapterBadge: isEl ? 'ΚΕΦ. 10 • ΑΣΚΗΣΗ 4' : 'CH. 10 • EXERCISE 4',
      title: isEl ? 'Ιδιότητα Εφαπτομένης Κύκλου' : 'Circle Tangent Property',
      prompt: isEl ? (
        <span>
          Ευθεία (ε) εφάπτεται σε κύκλο (Ο, ρ) στο σημείο Α και Μ είναι σημείο της (ε). Αν η γωνία Α<Angle>Ο</Angle>Μ είναι {angO12}°, πόσες μοίρες είναι η γωνία Ο<Angle>Μ</Angle>Α;
        </span>
      ) : (
        <span>
          Line (l) is tangent to circle (O, ρ) at point A, and M lies on (l). If angle ∠AOM measures {angO12}°, how many degrees is angle ∠OMA?
        </span>
      ),
      type: 'input',
      correct: angM12,
      unit: '°',
      diagram: { type: 'lineCircle', pos: 'tangent', rLabel: 'ρ', dLabel: 'ρ' },
      explanation: isEl ? (
        <span>
          Η ακτίνα επαφής ΟΑ είναι κάθετη στην εφαπτομένη (Ο<Angle>Α</Angle>Μ ＝ 90°). Στο ορθογώνιο τρίγωνο ΟΑΜ, Ο<Angle>Μ</Angle>Α ＝ 90° － {angO12}° ＝ {angM12}°.
        </span>
      ) : (
        <span>
          Radius OA is perpendicular to tangent (l) (∠OAM ＝ 90°). In right triangle OAM, ∠OMA ＝ 90° － {angO12}° ＝ {angM12}°.
        </span>
      )
    });

    // =========================================================================
    // ΜΕΡΟΣ Δ: 3 ΔΥΣΚΟΛΑ ΣΥΝΔΥΑΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (ΕΝΑ ΑΠΟ ΚΑΘΕ ΚΕΦΑΛΑΙΟ)
    // =========================================================================

    // --- ΠΡΟΒΛΗΜΑ 1 (ΚΕΦ. 08): Συνδυαστικό πρόβλημα τετραπλεύρων ---
    const p1Variant = randInt(0, 1);
    if (p1Variant === 0) {
      // Παραλλαγή 1α: Παραλληλόγραμμο με περίμετρο & σχέση πλευρών + εύρεση γωνιών
      const short13 = randInt(5, 10);
      const mult13 = randInt(2, 3);
      const long13 = mult13 * short13;
      const perim13 = 2 * (short13 + long13);
      const angA13 = randInt(55, 75);
      const angB13 = 180 - angA13;
      const multWord13El = mult13 === 2 ? 'διπλάσια' : 'τριπλάσια';
      const multWord13En = mult13 === 2 ? 'twice' : 'three times';

      const corr13 = isEl
        ? `Πλευρά ΑΒ ＝ ${long13} cm και γωνία Β ＝ ${angB13}°`
        : `Side AB ＝ ${long13} cm and angle ∠B ＝ ${angB13}°`;

      const dist13 = isEl
        ? [
            `Πλευρά ΑΒ ＝ ${long13} cm και γωνία Β ＝ ${angB13}°`,
            `Πλευρά ΑΒ ＝ ${short13} cm και γωνία Β ＝ ${angB13}°`,
            `Πλευρά ΑΒ ＝ ${long13} cm και γωνία Β ＝ ${angA13}°`,
            `Πλευρά ΑΒ ＝ ${2 * long13} cm και γωνία Β ＝ ${angB13}°`,
            `Πλευρά ΑΒ ＝ ${long13} cm και γωνία Β ＝ 90°`
          ]
        : [
            `Side AB ＝ ${long13} cm and angle ∠B ＝ ${angB13}°`,
            `Side AB ＝ ${short13} cm and angle ∠B ＝ ${angB13}°`,
            `Side AB ＝ ${long13} cm and angle ∠B ＝ ${angA13}°`,
            `Side AB ＝ ${2 * long13} cm and angle ∠B ＝ ${angB13}°`,
            `Side AB ＝ ${long13} cm and angle ∠B ＝ 90°`
          ];

      qList.push({
        id: 13,
        chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ ΚΕΦ. 08 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'CH. 08 PROBLEM • CHALLENGING',
        title: isEl ? 'Πρόβλημα 1: Πλευρές & Γωνίες Παραλληλογράμμου' : 'Problem 1: Sides & Angles of a Parallelogram',
        prompt: isEl ? (
          <span>
            Ένα παραλληλόγραμμο ΑΒΓΔ έχει περίμετρο Π ＝ {perim13} cm και γωνία <Angle>Α</Angle> ＝ {angA13}°. Αν η μεγάλη πλευρά ΑΒ είναι {multWord13El} από τη μικρή πλευρά ΒΓ, πόσο είναι το μήκος της ΑΒ και πόσες μοίρες είναι η διαδοχική γωνία <Angle>Β</Angle>;
          </span>
        ) : (
          <span>
            A parallelogram ABCD has perimeter P ＝ {perim13} cm and angle ∠A ＝ {angA13}°. If longer side AB is {multWord13En} shorter side BC, find the length of AB and consecutive angle ∠B.
          </span>
        ),
        type: 'mcq',
        correct: corr13,
        options: ensureFourUniqueOptions(corr13, () => pickRandom(dist13)),
        diagram: {
          type: 'parallelogram',
          angA: angA13,
          angB: angB13,
          angC: angA13,
          angD: angB13,
          sideTop: `${long13} cm`,
          sideRight: `${short13} cm`
        },
        tableData: [
          {
            label: isEl ? '1. Ημιπερίμετρος (ΑΒ ＋ ΒΓ)' : '1. Semi-perimeter (AB ＋ BC)',
            details: (
              <span className="inline-flex items-center gap-1">
                ΑΒ ＋ ΒΓ ＝ <Frac num={perim13} den="2" /> ＝ {short13 + long13} cm
              </span>
            )
          },
          {
            label: isEl ? '2. Πλευρές ΒΓ και ΑΒ' : '2. Sides BC and AB',
            details: (
              <span className="inline-flex items-center gap-1">
                ΒΓ ＝ <Frac num={short13 + long13} den={mult13 + 1} /> ＝ {short13} cm ⇒ ΑΒ ＝ {mult13} · {short13} ＝ {long13} cm
              </span>
            )
          },
          {
            label: isEl ? '3. Διαδοχική γωνία Β' : '3. Consecutive angle ∠B',
            details: `180° － ${angA13}° ＝ ${angB13}°`
          }
        ],
        explanation: isEl ? (
          <span>
            Η ημιπερίμετρος είναι {short13 + long13} cm, οπότε ΒΓ ＝ {short13} cm και ΑΒ ＝ {long13} cm. Επίσης <Angle>Β</Angle> ＝ 180° － {angA13}° ＝ {angB13}°.
          </span>
        ) : (
          <span>
            The semi-perimeter is {short13 + long13} cm, giving BC ＝ {short13} cm and AB ＝ {long13} cm. Also, ∠B ＝ 180° － {angA13}° ＝ {angB13}°.
          </span>
        )
      });
    } else {
      // Παραλλαγή 1β: Ρόμβος με περίμετρο & γωνία διαγωνίου ΑΒΟ -> εύρεση πλευράς & γωνίας Α
      const side13 = randInt(6, 14);
      const perim13 = 4 * side13;
      const halfB13 = randInt(24, 38);
      const fullB13 = 2 * halfB13;
      const angA13 = 180 - fullB13;

      const corr13 = isEl
        ? `Πλευρά ${side13} cm και γωνία Α ＝ ${angA13}°`
        : `Side ${side13} cm and angle ∠A ＝ ${angA13}°`;

      const dist13 = isEl
        ? [
            `Πλευρά ${side13} cm και γωνία Α ＝ ${angA13}°`,
            `Πλευρά ${side13} cm και γωνία Α ＝ ${fullB13}°`,
            `Πλευρά ${side13} cm και γωνία Α ＝ ${halfB13}°`,
            `Πλευρά ${2 * side13} cm και γωνία Α ＝ ${angA13}°`,
            `Πλευρά ${side13} cm και γωνία Α ＝ 90°`
          ]
        : [
            `Side ${side13} cm and angle ∠A ＝ ${angA13}°`,
            `Side ${side13} cm and angle ∠A ＝ ${fullB13}°`,
            `Side ${side13} cm and angle ∠A ＝ ${halfB13}°`,
            `Side ${2 * side13} cm and angle ∠A ＝ ${angA13}°`,
            `Side ${side13} cm and angle ∠A ＝ 90°`
          ];

      qList.push({
        id: 13,
        chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ ΚΕΦ. 08 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'CH. 08 PROBLEM • CHALLENGING',
        title: isEl ? 'Πρόβλημα 1: Πλευρά, Διαγώνιοι & Γωνίες Ρόμβου' : 'Problem 1: Side, Diagonals & Angles of a Rhombus',
        prompt: isEl ? (
          <span>
            Ένας ρόμβος ΑΒΓΔ έχει περίμετρο {perim13} cm και οι διαγώνιοί του τέμνονται στο Ο. Αν η γωνία Α<Angle>Β</Angle>Ο ＝ {halfB13}°, πόση είναι η πλευρά του ρόμβου και πόσες μοίρες είναι η γωνία <Angle>Α</Angle>;
          </span>
        ) : (
          <span>
            A rhombus ABCD has perimeter {perim13} cm and its diagonals intersect at O. If angle ∠ABO ＝ {halfB13}°, find the side length and angle ∠A of the rhombus.
          </span>
        ),
        type: 'mcq',
        correct: corr13,
        options: ensureFourUniqueOptions(corr13, () => pickRandom(dist13)),
        diagram: { type: 'rhombus', sideLabel: `${side13} cm` },
        tableData: [
          {
            label: isEl ? '1. Πλευρά ρόμβου' : '1. Side of rhombus',
            details: (
              <span className="inline-flex items-center gap-1">
                <Frac num={perim13} den="4" /> ＝ {side13} cm
              </span>
            )
          },
          {
            label: isEl ? '2. Γωνία Β (διχοτόμηση διαγωνίου)' : '2. Angle ∠B (diagonal bisector)',
            details: isEl ? (
              <span>
                <Angle>Β</Angle> ＝ 2 · {halfB13}° ＝ {fullB13}°
              </span>
            ) : (
              `∠B ＝ 2 · ${halfB13}° ＝ ${fullB13}°`
            )
          },
          {
            label: isEl ? '3. Διαδοχική γωνία Α' : '3. Consecutive angle ∠A',
            details: `180° － ${fullB13}° ＝ ${angA13}°`
          }
        ],
        explanation: isEl ? (
          <span>
            Κάθε πλευρά είναι {perim13} ÷ 4 ＝ {side13} cm. Επίσης <Angle>Β</Angle> ＝ 2 · {halfB13}° ＝ {fullB13}°, οπότε <Angle>Α</Angle> ＝ 180° － {fullB13}° ＝ {angA13}°.
          </span>
        ) : (
          <span>
            Each side is {perim13} ÷ 4 ＝ {side13} cm. Also ∠B ＝ 2 · {halfB13}° ＝ {fullB13}°, so ∠A ＝ 180° － {fullB13}° ＝ {angA13}°.
          </span>
        )
      });
    }

    // --- ΠΡΟΒΛΗΜΑ 2 (ΚΕΦ. 09): Συνδυαστικό πρόβλημα κύκλου, χορδής & ισοσκελούς τριγώνου ---
    const baseAng14 = randInt(34, 66);
    const angO14 = 180 - 2 * baseAng14;
    const r14 = randInt(5, 11);
    const chord14 = randInt(4, 2 * r14 - 3);
    const perim14 = 2 * r14 + chord14;

    const corr14 = isEl
      ? `Γωνία ΑΟΒ ＝ ${angO14}° και περίμετρος ${perim14} cm`
      : `Angle ∠AOB ＝ ${angO14}° and perimeter ${perim14} cm`;

    const dist14 = isEl
      ? [
          `Γωνία ΑΟΒ ＝ ${angO14}° και περίμετρος ${perim14} cm`,
          `Γωνία ΑΟΒ ＝ ${baseAng14}° και περίμετρος ${perim14} cm`,
          `Γωνία ΑΟΒ ＝ ${angO14}° και περίμετρος ${r14 + chord14} cm`,
          `Γωνία ΑΟΒ ＝ ${180 - baseAng14}° και περίμετρος ${perim14} cm`,
          `Γωνία ΑΟΒ ＝ 60° και περίμετρος ${perim14 + 2} cm`
        ]
      : [
          `Angle ∠AOB ＝ ${angO14}° and perimeter ${perim14} cm`,
          `Angle ∠AOB ＝ ${baseAng14}° and perimeter ${perim14} cm`,
          `Angle ∠AOB ＝ ${angO14}° and perimeter ${r14 + chord14} cm`,
          `Angle ∠AOB ＝ ${180 - baseAng14}° and perimeter ${perim14} cm`,
          `Angle ∠AOB ＝ 60° and perimeter ${perim14 + 2} cm`
        ];

    qList.push({
      id: 14,
      chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ ΚΕΦ. 09 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'CH. 09 PROBLEM • CHALLENGING',
      title: isEl ? 'Πρόβλημα 2: Κύκλος (Ο, ρ), Χορδή & Τρίγωνο ΟΑΒ' : 'Problem 2: Circle (O, ρ), Chord & Triangle OAB',
      prompt: isEl ? (
        <span>
          Ένας κύκλος (Ο, ρ) έχει διάμετρο δ ＝ {2 * r14} cm και φέρνουμε μια χορδή ΑΒ μήκους {chord14} cm. Αν η γωνία Ο<Angle>Α</Angle>Β είναι {baseAng14}°, πόσες μοίρες είναι η γωνία Α<Angle>Ο</Angle>Β και πόσα εκατοστά (cm) είναι η περίμετρος του τριγώνου ΟΑΒ;
        </span>
      ) : (
        <span>
          A circle (O, ρ) has diameter d ＝ {2 * r14} cm and chord AB has length {chord14} cm. If angle ∠OAB ＝ {baseAng14}°, find angle ∠AOB and the perimeter of triangle OAB.
        </span>
      ),
      type: 'mcq',
      correct: corr14,
      options: ensureFourUniqueOptions(corr14, () => pickRandom(dist14)),
      diagram: {
        type: 'chordTriangle',
        angO: angO14,
        angA: baseAng14,
        angB: baseAng14,
        rLabel: `${r14} cm`,
        chordLabel: `${chord14} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Ακτίνα ρ ＝ ΟΑ ＝ ΟΒ' : '1. Radius ρ ＝ OA ＝ OB',
          details: (
            <span className="inline-flex items-center gap-1">
              ρ ＝ <Frac num={2 * r14} den="2" /> ＝ {r14} cm
            </span>
          )
        },
        {
          label: isEl ? '2. Γωνία ΑΟΒ (ισοσκελές ΟΑΒ)' : '2. Angle ∠AOB (isosceles OAB)',
          details: isEl ? (
            <span>
              Ο<Angle>Β</Angle>Α ＝ Ο<Angle>Α</Angle>Β ＝ {baseAng14}° ⇒ Α<Angle>Ο</Angle>Β ＝ 180° － 2 · {baseAng14}° ＝ {angO14}°
            </span>
          ) : (
            `∠OBA ＝ ∠OAB ＝ ${baseAng14}° ⇒ ∠AOB ＝ 180° － 2 · ${baseAng14}° ＝ ${angO14}°`
          )
        },
        {
          label: isEl ? '3. Περίμετρος τριγώνου ΟΑΒ' : '3. Perimeter of triangle OAB',
          details: `Π ＝ ${r14} ＋ ${r14} ＋ ${chord14} ＝ ${perim14} cm`
        }
      ],
      explanation: isEl ? (
        <span>
          Η ακτίνα είναι ρ ＝ {r14} cm (ΟΑ ＝ ΟΒ ＝ {r14} cm), άρα η περίμετρος του ΟΑΒ είναι {r14} ＋ {r14} ＋ {chord14} ＝ {perim14} cm. Επειδή το ΟΑΒ είναι ισοσκελές, Α<Angle>Ο</Angle>Β ＝ 180° － 2 · {baseAng14}° ＝ {angO14}°.
        </span>
      ) : (
        <span>
          Radius ρ ＝ {r14} cm (OA ＝ OB ＝ {r14} cm), so the perimeter of OAB is {r14} ＋ {r14} ＋ {chord14} ＝ {perim14} cm. Since OAB is isosceles, ∠AOB ＝ 180° － 2 · {baseAng14}° ＝ {angO14}°.
        </span>
      )
    });

    // --- ΠΡΟΒΛΗΜΑ 3 (ΚΕΦ. 10): Συνδυαστικό πρόβλημα επίκεντρης γωνίας, τόξου & εφαπτομένης ---
    const p3Variant = randInt(0, 1);
    if (p3Variant === 0) {
      // Παραλλαγή 3α: 3 διαδοχικά τόξα καλύπτουν όλο τον κύκλο (360°), τα δύο πρώτα είναι ίσα -> εύρεση ίσων γωνιών & σύγκριση χορδών
      const thirdArc15 = randInt(40, 75) * 2; // άρτιο 80°..150°
      const equalArc15 = (360 - thirdArc15) / 2;

      qList.push({
        id: 15,
        chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ ΚΕΦ. 10 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'CH. 10 PROBLEM • CHALLENGING',
        title: isEl ? 'Πρόβλημα 3: Διαίρεση Κύκλου 360° & Ίσες Επίκεντρες Γωνίες' : 'Problem 3: Partitioning 360° & Equal Central Angles',
        prompt: isEl ? (
          <span>
            Τρία σημεία Α, Β και Γ πάνω σε κύκλο (Ο, ρ) τον χωρίζουν σε τρία διαδοχικά τόξα <Arc>ΑΒ</Arc>, <Arc>ΒΓ</Arc> και <Arc>ΓΑ</Arc>. Αν γνωρίζουμε ότι οι χορδές ΑΒ και ΒΓ είναι ίσες (ΑΒ ＝ ΒΓ) και η επίκεντρη γωνία Γ<Angle>Ο</Angle>Α ＝ {thirdArc15}°, πόσες μοίρες είναι καθεμία από τις επίκεντρες γωνίες Α<Angle>Ο</Angle>Β και Β<Angle>Ο</Angle>Γ;
          </span>
        ) : (
          <span>
            Three points A, B, and C on circle (O, ρ) divide it into three consecutive arcs <Arc>AB</Arc>, <Arc>BC</Arc>, and <Arc>CA</Arc>. Given that chords AB and BC are equal (AB ＝ BC) and central angle ∠COA ＝ {thirdArc15}°, find the measure of each central angle ∠AOB and ∠BOC.
          </span>
        ),
        type: 'input',
        correct: equalArc15,
        unit: '°',
        diagram: {
          type: 'sector',
          omega: equalArc15,
          caption: isEl ? `(360° － ${thirdArc15}°) ÷ 2 ＝ ${equalArc15}°` : `(360° － ${thirdArc15}°) ÷ 2 ＝ ${equalArc15}°`
        },
        tableData: [
          {
            label: isEl ? '1. Ίσες χορδές ⇒ Ίσες γωνίες' : '1. Equal chords ⇒ Equal angles',
            details: isEl ? (
              <span>
                Επειδή ΑΒ ＝ ΒΓ, ισχύει Α<Angle>Ο</Angle>Β ＝ Β<Angle>Ο</Angle>Γ
              </span>
            ) : (
              'Since AB ＝ BC, we have ∠AOB ＝ ∠BOC'
            )
          },
          {
            label: isEl ? '2. Ολόκληρος κύκλος ＝ 360°' : '2. Full circle ＝ 360°',
            details: (
              <span className="inline-flex items-center gap-1">
                Α<Angle>Ο</Angle>Β ＝ Β<Angle>Ο</Angle>Γ ＝ <Frac num={`360° － ${thirdArc15}°`} den="2" /> ＝ {equalArc15}°
              </span>
            )
          }
        ],
        explanation: (
          <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
            <span>
              {isEl ? (
                <>
                  Επειδή οι χορδές ΑΒ και ΒΓ είναι ίσες, οι αντίστοιχες επίκεντρες γωνίες Α<Angle>Ο</Angle>Β και Β<Angle>Ο</Angle>Γ είναι ίσες. Από τον κύκλο 360° προκύπτει:
                </>
              ) : (
                'Since chords AB and BC are equal, central angles ∠AOB and ∠BOC are equal. From the 360° circle:'
              )}
            </span>
            <span className="inline-flex items-center gap-1 font-mono">
              <Frac num={`360° － ${thirdArc15}°`} den="2" /> ＝ <Frac num={360 - thirdArc15} den="2" /> ＝ {equalArc15}°.
            </span>
          </span>
        )
      });
    } else {
      // Παραλλαγή 3β: Εφαπτόμενη (ε) στο σημείο Α, επίκεντρη γωνία ΑΟΜ = ω -> εύρεση γωνίας ΟΜΑ και εξωτερικής γωνίας στην Μ
      const angO15 = randInt(28, 62);
      const angM15 = 90 - angO15;

      qList.push({
        id: 15,
        chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ ΚΕΦ. 10 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'CH. 10 PROBLEM • CHALLENGING',
        title: isEl ? 'Πρόβλημα 3: Εφαπτόμενη Κύκλου & Τρίγωνο ΟΑΜ' : 'Problem 3: Circle Tangent & Triangle OAM',
        prompt: isEl ? (
          <span>
            Μια ευθεία (ε) εφάπτεται σε κύκλο (Ο, ρ) στο σημείο Α. Από το κέντρο Ο φέρνουμε ημιευθεία που τέμνει την (ε) στο σημείο Μ, σχηματίζοντας επίκεντρη γωνία Α<Angle>Ο</Angle>Μ ＝ {angO15}°. Πόσες μοίρες είναι η γωνία Ο<Angle>Μ</Angle>Α;
          </span>
        ) : (
          <span>
            A line (l) is tangent to circle (O, ρ) at point A. A ray from center O meets line (l) at point M, forming central angle ∠AOM ＝ {angO15}°. How many degrees is angle ∠OMA?
          </span>
        ),
        type: 'input',
        correct: angM15,
        unit: '°',
        diagram: { type: 'lineCircle', pos: 'tangent', rLabel: 'ρ', dLabel: 'ρ' },
        tableData: [
          {
            label: isEl ? '1. Ιδιότητα εφαπτομένης' : '1. Tangent property',
            details: isEl ? (
              <span>
                Η ακτίνα επαφής ΟΑ είναι κάθετη στην εφαπτομένη (ε) ⇒ Ο<Angle>Α</Angle>Μ ＝ 90°
              </span>
            ) : (
              'Radius OA is perpendicular to tangent (l) ⇒ ∠OAM ＝ 90°'
            )
          },
          {
            label: isEl ? '2. Ορθογώνιο τρίγωνο ΟΑΜ' : '2. Right triangle OAM',
            details: isEl ? (
              <span>
                Ο<Angle>Μ</Angle>Α ＝ 90° － {angO15}° ＝ {angM15}°
              </span>
            ) : (
              `∠OMA ＝ 90° － ${angO15}° ＝ ${angM15}°`
            )
          }
        ],
        explanation: isEl ? (
          <span>
            Επειδή η (ε) εφάπτεται στο Α, ισχύει ΟΑ ⊥ (ε), άρα Ο<Angle>Α</Angle>Μ ＝ 90°. Στο ορθογώνιο τρίγωνο ΟΑΜ οι οξείες γωνίες είναι συμπληρωματικές, οπότε Ο<Angle>Μ</Angle>Α ＝ 90° － {angO15}° ＝ {angM15}°.
          </span>
        ) : (
          <span>
            Since (l) is tangent at A, OA ⊥ (l), so ∠OAM ＝ 90°. In right triangle OAM, the acute angles are complementary, giving ∠OMA ＝ 90° － {angO15}° ＝ {angM15}°.
          </span>
        )
      });
    }

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
    let sanitized = val.replace('.', ',').replace(/[^0-9,]/g, '');
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

  const totalCount = questions.length || 15;
  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== '' && userAnswers[k] !== undefined).length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>📚 {toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        
        {/* Header Banner */}
        <section className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block max-w-full px-3 py-1 bg-white/10 rounded-xl text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/10 leading-snug break-words">
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
              {t.scoreLabel}: {score} / {totalCount} ({Math.round((score / totalCount) * 100)}%)
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-4">
              {score >= 13 ? t.scoreGreat : score >= 8 ? t.scoreGood : t.scoreNeedWork}
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
            const isHardProblem = idx >= 12;
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
                    ? 'border-amber-300 shadow-md'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Chapter / Difficulty Tag */}
                <div className="mb-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                      isHardProblem
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {toCleanUppercase(q.chapterBadge)}
                  </span>
                </div>

                {/* Header Ερώτησης */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
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
                        <div className="md:col-span-5">
                          {renderFeedbackDiagram(q.diagram, isEl)}
                        </div>
                        <div className="md:col-span-7 space-y-3">
                          {q.tableData && q.tableData.length > 0 && (
                            <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
                              <table className="w-full text-xs text-left">
                                <thead className="bg-slate-100 text-slate-700 font-bold">
                                  <tr>
                                    <th className="p-2 sm:p-2.5 border-b w-1/3">{t.tableStep}</th>
                                    <th className="p-2 sm:p-2.5 border-b w-2/3">{t.tableAnalysis}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                  {q.tableData.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                      <td className="p-2 sm:p-2.5 font-semibold text-slate-800 align-top">{row.label}</td>
                                      <td className="p-2 sm:p-2.5 font-mono text-indigo-900 break-words [overflow-wrap:anywhere] align-top">{row.details}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                            <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
                              <span>{t.correctAnswerTitle}</span>
                              <span className="font-mono text-emerald-700 font-bold inline-flex items-center whitespace-nowrap gap-1">
                                {q.renderOption ? q.renderOption(q.correct) : (typeof q.correct === 'number' ? q.correct.toLocaleString(locCode) : q.correct)} {q.unit || ''}
                              </span>
                            </div>
                            <div className="mt-1 break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {q.tableData && q.tableData.length > 0 && (
                          <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-slate-100 text-slate-700 font-bold">
                                <tr>
                                  <th className="p-2 sm:p-2.5 border-b w-1/3">{t.tableStep}</th>
                                  <th className="p-2 sm:p-2.5 border-b w-2/3">{t.tableAnalysis}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-xs">
                                {q.tableData.map((row, rIdx) => (
                                  <tr key={rIdx}>
                                    <td className="p-2 sm:p-2.5 font-semibold text-slate-800 align-top">{row.label}</td>
                                    <td className="p-2 sm:p-2.5 font-mono text-indigo-900 break-words [overflow-wrap:anywhere] align-top">{row.details}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                          <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
                            <span>{t.correctAnswerTitle}</span>
                            <span className="font-mono text-emerald-700 font-bold inline-flex items-center whitespace-nowrap gap-1">
                              {q.renderOption ? q.renderOption(q.correct) : (typeof q.correct === 'number' ? q.correct.toLocaleString(locCode) : q.correct)} {q.unit || ''}
                            </span>
                          </div>
                          <div className="mt-1 break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                        </div>
                      </>
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
                  {toCleanUppercase(t.answeredLabel)}: <span className="text-indigo-400 font-black">{answeredCount}</span> / {totalCount}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-400">{toCleanUppercase(isEl ? 'ΣΚΟΡ' : 'SCORE')}: {score} / {totalCount}</span>
                  <span className="hidden xs:inline text-slate-500">|</span>
                  <span className="text-indigo-300">{Math.round((score / totalCount) * 100)}%</span>
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
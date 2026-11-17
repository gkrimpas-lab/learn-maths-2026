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

  // 2. Άθροισμα / Διαφορά / Σύγκριση Ευθυγράμμων Τμημάτων
  if (diagram.type === 'segments') {
    const isDiff = diagram.mode === 'diff';
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          {!isDiff ? (
            <>
              {/* Διαδοχικά τμήματα ΑΒ + ΒΓ = ΑΓ */}
              <line x1="28" y1="68" x2="128" y2="68" stroke="#818cf8" strokeWidth="3.5" />
              <line x1="128" y1="68" x2="236" y2="68" stroke="#34d399" strokeWidth="3.5" />
              <circle cx="28" cy="68" r="3.5" fill="#a5b4fc" />
              <circle cx="128" cy="68" r="3.5" fill="#6ee7b7" />
              <circle cx="236" cy="68" r="3.5" fill="#fbbf24" />
              <text x="28" y="54" textAnchor="middle" className="text-[9px] font-bold fill-white">{isEl ? 'Α' : 'A'}</text>
              <text x="128" y="54" textAnchor="middle" className="text-[9px] font-bold fill-white">{isEl ? 'Β' : 'B'}</text>
              <text x="236" y="54" textAnchor="middle" className="text-[9px] font-bold fill-white">{isEl ? 'Γ' : 'C'}</text>
              <text x="78" y="85" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-indigo-300">{diagram.len1}</text>
              <text x="182" y="85" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-emerald-300">{diagram.len2}</text>
              <path d="M 28,98 L 28,107 L 236,107 L 236,98" fill="none" stroke="#94a3b8" strokeWidth="1.3" />
              <text x="132" y="121" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-white">{diagram.totalLabel}</text>
            </>
          ) : (
            <>
              {/* Διαφορά τμημάτων ΑΒ - ΓΔ */}
              <line x1="30" y1="52" x2="234" y2="52" stroke="#818cf8" strokeWidth="3.2" />
              <circle cx="30" cy="52" r="3.2" fill="#a5b4fc" />
              <circle cx="234" cy="52" r="3.2" fill="#a5b4fc" />
              <text x="132" y="42" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-indigo-300">{diagram.len1}</text>

              <line x1="30" y1="92" x2="145" y2="92" stroke="#34d399" strokeWidth="3.2" />
              <line x1="145" y1="92" x2="234" y2="92" stroke="#fbbf24" strokeWidth="3.6" />
              <circle cx="30" cy="92" r="3.2" fill="#6ee7b7" />
              <circle cx="145" cy="92" r="3.5" fill="#fbbf24" />
              <circle cx="234" cy="92" r="3.5" fill="#fbbf24" />
              <text x="87" y="108" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-emerald-300">{diagram.len2}</text>
              <text x="190" y="108" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">{diagram.totalLabel}</text>
            </>
          )}
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
                points="132,24 186,58 166,118 98,118 78,58"
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
              <polygon
                points="58,116 196,116 212,42 74,34"
                fill="rgba(99, 102, 241, 0.24)"
                stroke="#818cf8"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <text x="132" y="80" textAnchor="middle" className="text-[9px] font-mono font-bold fill-indigo-200">
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

  return null;
}

export default function MikosExercises() {
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
    pageTitle: isEl ? "Ασκήσεις: Μέτρηση Μήκους, Ευθύγραμμα Τμήματα & Περίμετρος | Α' Γυμνασίου" : "Exercises: Measuring Length, Line Segments & Perimeter | Grade 7",
    pageDesc: isEl
      ? "Διαδραστικές ασκήσεις Α' Γυμνασίου στη μέτρηση μήκους, τις μετατροπές μονάδων, τη σύγκριση, το άθροισμα και τη διαφορά ευθυγράμμων τμημάτων και την περίμετρο πολυγώνων."
      : "Interactive Grade 7 geometry exercises on measuring length, unit conversions, comparing, adding and subtracting line segments, and polygon perimeter.",
    backNav: isEl ? "Θεωρία Κεφ. 16" : "Theory Ch. 16",
    theoryBtn: isEl ? "ΘΕΩΡΙΑ" : "THEORY",
    heroBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 16 • Α' ΓΥΜΝΑΣΙΟΥ" : "EXERCISES • CHAPTER 16 • GRADE 7",
    heroTitle: isEl ? "Μέτρηση Μήκους, Τμήματα & Περίμετρος: Εξάσκηση" : "Length, Segments & Perimeter: Practice",
    heroDesc: isEl
      ? "12 δυναμικές ερωτήσεις και προβλήματα στις μονάδες μήκους (km έως mm), στις μετατροπές, στο άθροισμα και τη διαφορά ευθυγράμμων τμημάτων και στην περίμετρο πολυγώνων."
      : "12 dynamic questions and problems on metric length units (km to mm), conversions, segment sum and difference, and polygon perimeters.",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl
      ? "Εξαιρετική επίδοση! Κατέχετε πλήρως τις μονάδες μήκους, τις μετατροπές, τις πράξεις ευθυγράμμων τμημάτων και την περίμετρο πολυγώνων."
      : "Outstanding performance! You have mastered metric length units, conversions, line segment operations, and polygon perimeters.",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Ελέγξτε τους πίνακες ανάλυσης και τα σχήματα παρακάτω στα σημεία που δυσκολευτήκατε."
      : "Very good effort! Review the step-by-step tables and diagrams below for any questions you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στις μετατροπές μονάδων μήκους (×10 / ÷10) και στον υπολογισμό περιμέτρου!"
      : "Needs a bit more review on metric unit conversions (×10 / ÷10) and perimeter calculations!",
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

    // Q1: True / False - Μονάδες Μήκους SI (Πολλαπλάσια & Υποδιαιρέσεις)
    const q1Pool = isEl
      ? [
          {
            p: "Στο Διεθνές Σύστημα Μονάδων (SI) βασική μονάδα μήκους είναι το μέτρο (1 m) και ισχύει 1 m ＝ 10 dm ＝ 100 cm ＝ 1.000 mm.",
            t: true,
            e: "Κάθε υποδιαίρεση του μέτρου είναι 10 φορές μικρότερη από την προηγούμενή της: 1 m ＝ 10 dm ＝ 100 cm ＝ 1.000 mm."
          },
          {
            p: "Το δεκάμετρο (1 dam) είναι υποδιαίρεση του μέτρου και ισούται με 0,1 m (10 cm).",
            t: false,
            e: "Το 1 dam (δεκάμετρο) είναι ΠΟΛΛΑΠΛΑΣΙΟ του μέτρου και ισούται με 10 m, ενώ το 1 dm (δεκατόμετρο) ισούται με 0,1 m (10 cm)."
          },
          {
            p: "Για να μετατρέψουμε ένα μήκος από μεγαλύτερη μονάδα σε μικρότερη (π.χ. από km σε m) πολλαπλασιάζουμε με 10, 100, 1.000...",
            t: true,
            e: "Όταν κατεβαίνουμε την κλίμακα μονάδων (προς τα δεξιά), κάθε βήμα αντιστοιχεί σε πολλαπλασιασμό επί 10."
          }
        ]
      : [
          {
            p: "In the International System of Units (SI), the base unit of length is the meter (1 m) and 1 m ＝ 10 dm ＝ 100 cm ＝ 1,000 mm.",
            t: true,
            e: "Each metric submultiple is 10 times smaller than the previous one: 1 m ＝ 10 dm ＝ 100 cm ＝ 1,000 mm."
          },
          {
            p: "One decameter (1 dam) is a submultiple of the meter equal to 0.1 m (10 cm).",
            t: false,
            e: "1 dam (decameter) is a MULTIPLE of the meter equal to 10 m, whereas 1 dm (decimeter) equals 0.1 m (10 cm)."
          },
          {
            p: "To convert a length from a larger unit to a smaller unit (e.g., km to m), we multiply by 10, 100, 1,000...",
            t: true,
            e: "Moving down the metric scale (to the right) multiplies by 10 for each step."
          }
        ];

    const pickedQ1 = pickRandom(q1Pool);
    qList.push({
      id: 1,
      title: isEl ? 'Μονάδες Μήκους (SI)' : 'Metric Units of Length (SI)',
      prompt: pickedQ1.p,
      type: 'tf',
      correct: pickedQ1.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      diagram: {
        type: 'scale',
        src: 'km',
        dst: 'mm',
        caption: '1 km ＝ 1.000 m • 1 m ＝ 100 cm ＝ 1.000 mm'
      },
      explanation: pickedQ1.e
    });

    // Q2: MCQ - Μετατροπή μεγαλύτερης μονάδας σε μικρότερη
    const q2Variants = [
      { val: 3.4, src: 'km', dst: 'm', mult: 1000, ans: 3400 },
      { val: 2.75, src: 'm', dst: 'cm', mult: 100, ans: 275 },
      { val: 6.8, src: 'cm', dst: 'mm', mult: 10, ans: 68 },
      { val: 4.2, src: 'dm', dst: 'mm', mult: 100, ans: 420 }
    ];
    const v2 = pickRandom(q2Variants);
    const ans2Str = `${v2.ans.toLocaleString(locCode)} ${v2.dst}`;
    const dist2 = [
      `${v2.ans.toLocaleString(locCode)} ${v2.dst}`,
      `${Number((v2.val * 10).toFixed(2)).toLocaleString(locCode)} ${v2.dst}`,
      `${Number((v2.ans * 10).toFixed(2)).toLocaleString(locCode)} ${v2.dst}`,
      `${Number((v2.ans / 10).toFixed(3)).toLocaleString(locCode)} ${v2.dst}`,
      `${Number((v2.val / v2.mult).toFixed(5)).toLocaleString(locCode)} ${v2.dst}`
    ];

    qList.push({
      id: 2,
      title: isEl ? 'Μετατροπή σε Μικρότερη Μονάδα' : 'Converting to a Smaller Unit',
      prompt: isEl
        ? `Πόσα ${v2.dst} είναι τα ${v2.val.toLocaleString(locCode)} ${v2.src};`
        : `How many ${v2.dst} are equal to ${v2.val.toLocaleString(locCode)} ${v2.src}?`,
      type: 'mcq',
      correct: ans2Str,
      options: ensureFourUniqueOptions(ans2Str, () => pickRandom(dist2)),
      diagram: {
        type: 'scale',
        src: v2.src,
        dst: v2.dst,
        caption: `${v2.val.toLocaleString(locCode)} ${v2.src} × ${v2.mult.toLocaleString(locCode)} ＝ ${ans2Str}`
      },
      explanation: isEl
        ? `Επειδή 1 ${v2.src} ＝ ${v2.mult.toLocaleString(locCode)} ${v2.dst}, πολλαπλασιάζουμε με ${v2.mult.toLocaleString(locCode)}: ${v2.val.toLocaleString(locCode)} · ${v2.mult.toLocaleString(locCode)} ＝ ${ans2Str}.`
        : `Since 1 ${v2.src} ＝ ${v2.mult.toLocaleString(locCode)} ${v2.dst}, multiply by ${v2.mult.toLocaleString(locCode)}: ${v2.val.toLocaleString(locCode)} · ${v2.mult.toLocaleString(locCode)} ＝ ${ans2Str}.`
    });

    // Q3: True / False - Σύγκριση & Άθροισμα Ευθυγράμμων Τμημάτων
    const ab3 = randInt(4, 7);
    const mm3 = ab3 * 10 + pickRandom([0, 5, -5]);
    const isEqual3 = mm3 === ab3 * 10;

    qList.push({
      id: 3,
      title: isEl ? 'Σύγκριση Ευθυγράμμων Τμημάτων' : 'Comparing Line Segments',
      prompt: isEl
        ? `Ένα ευθύγραμμο τμήμα ΑΒ έχει μήκος ${ab3} cm και ένα τμήμα ΓΔ έχει μήκος ${mm3} mm. Ισχύει ότι τα δύο τμήματα είναι ίσα (ΑΒ ＝ ΓΔ);`
        : `Line segment AB has length ${ab3} cm and segment CD has length ${mm3} mm. Are the two segments congruent (AB ＝ CD)?`,
      type: 'tf',
      correct: isEqual3 ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      diagram: {
        type: 'segments',
        mode: 'diff',
        len1: isEl ? `ΑΒ ＝ ${ab3} cm ＝ ${ab3 * 10} mm` : `AB ＝ ${ab3} cm ＝ ${ab3 * 10} mm`,
        len2: isEl ? `ΓΔ ＝ ${mm3} mm` : `CD ＝ ${mm3} mm`,
        totalLabel: isEqual3 ? (isEl ? 'Ίσα!' : 'Equal!') : (isEl ? 'Άνισα!' : 'Unequal!'),
        caption: `${ab3 * 10} mm ${isEqual3 ? '＝' : '≠'} ${mm3} mm`
      },
      explanation: isEl
        ? `Μετατρέπουμε το ΑΒ σε mm: ${ab3} cm ＝ ${ab3 * 10} mm. Επειδή το ΓΔ είναι ${mm3} mm, τα τμήματα ${isEqual3 ? 'έχουν ίσο μήκος (ΑΒ ＝ ΓΔ)' : 'ΔΕΝ έχουν ίσο μήκος (ΑΒ ≠ ΓΔ)'}.`
        : `Convert AB to mm: ${ab3} cm ＝ ${ab3 * 10} mm. Since CD is ${mm3} mm, the segments ${isEqual3 ? 'have equal length (AB ＝ CD)' : 'do NOT have equal length (AB ≠ CD)'}.`
    });

    // Q4: Input - Μετατροπή μικρότερης μονάδας σε μεγαλύτερη (cm -> m ή mm -> cm)
    const askCmToM4 = Math.random() < 0.5;
    const raw4 = askCmToM4 ? randInt(125, 485) : randInt(45, 195);
    const ans4 = askCmToM4 ? Number((raw4 / 100).toFixed(2)) : Number((raw4 / 10).toFixed(1));
    const srcU4 = askCmToM4 ? 'cm' : 'mm';
    const dstU4 = askCmToM4 ? 'm' : 'cm';
    const div4 = askCmToM4 ? 100 : 10;

    qList.push({
      id: 4,
      title: isEl ? 'Μετατροπή σε Μεγαλύτερη Μονάδα' : 'Converting to a Larger Unit',
      prompt: isEl
        ? `Να εκφράσετε το μήκος ${raw4} ${srcU4} σε ${dstU4}.`
        : `Express the length ${raw4} ${srcU4} in ${dstU4}.`,
      type: 'input',
      correct: ans4,
      unit: dstU4,
      diagram: {
        type: 'scale',
        src: srcU4,
        dst: dstU4,
        caption: `${raw4} ${srcU4} ÷ ${div4} ＝ ${ans4.toLocaleString(locCode)} ${dstU4}`
      },
      explanation: isEl
        ? `Επειδή 1 ${dstU4} ＝ ${div4} ${srcU4}, διαιρούμε με ${div4}: ${raw4} ÷ ${div4} ＝ ${ans4.toLocaleString(locCode)} ${dstU4}.`
        : `Since 1 ${dstU4} ＝ ${div4} ${srcU4}, divide by ${div4}: ${raw4} ÷ ${div4} ＝ ${ans4.toLocaleString(locCode)} ${dstU4}.`
    });

    // Q5: Input - Άθροισμα διαδοχικών ευθυγράμμων τμημάτων (με διαφορετικές μονάδες)
    const ab5 = Number((randInt(25, 65) / 10).toFixed(1)); // σε cm
    const bc5mm = randInt(15, 45); // σε mm
    const bc5cm = Number((bc5mm / 10).toFixed(1));
    const ac5 = Number((ab5 + bc5cm).toFixed(1));

    qList.push({
      id: 5,
      title: isEl ? 'Άθροισμα Ευθυγράμμων Τμημάτων' : 'Sum of Line Segments',
      prompt: isEl
        ? `Πάνω σε μια ευθεία τοποθετούμε διαδοχικά τα ευθύγραμμα τμήματα ΑΒ ＝ ${ab5.toLocaleString(locCode)} cm και ΒΓ ＝ ${bc5mm} mm. Πόσα cm είναι το μήκος του τμήματος ΑΓ ＝ ΑΒ ＋ ΒΓ;`
        : `Along a straight line, segments AB ＝ ${ab5.toLocaleString(locCode)} cm and BC ＝ ${bc5mm} mm are placed consecutively. What is the length of segment AC ＝ AB ＋ BC in cm?`,
      type: 'input',
      correct: ac5,
      unit: 'cm',
      diagram: {
        type: 'segments',
        mode: 'sum',
        len1: `${ab5.toLocaleString(locCode)} cm`,
        len2: `${bc5cm.toLocaleString(locCode)} cm`,
        totalLabel: isEl ? `ΑΓ ＝ ${ac5.toLocaleString(locCode)} cm` : `AC ＝ ${ac5.toLocaleString(locCode)} cm`,
        caption: `${ab5.toLocaleString(locCode)} cm ＋ ${bc5cm.toLocaleString(locCode)} cm ＝ ${ac5.toLocaleString(locCode)} cm`
      },
      explanation: isEl
        ? `Μετατρέπουμε πρώτα το ΒΓ σε cm: ${bc5mm} mm ＝ ${bc5cm.toLocaleString(locCode)} cm. Έπειτα προσθέτουμε: ΑΓ ＝ ${ab5.toLocaleString(locCode)} ＋ ${bc5cm.toLocaleString(locCode)} ＝ ${ac5.toLocaleString(locCode)} cm.`
        : `First convert BC to cm: ${bc5mm} mm ＝ ${bc5cm.toLocaleString(locCode)} cm. Then add: AC ＝ ${ab5.toLocaleString(locCode)} ＋ ${bc5cm.toLocaleString(locCode)} ＝ ${ac5.toLocaleString(locCode)} cm.`
    });

    // Q6: MCQ - Διαφορά Ευθυγράμμων Τμημάτων (ΑΒ - ΓΔ)
    const ab6 = randInt(7, 12); // σε cm
    const cd6dm = Number((randInt(2, 5) / 10).toFixed(1)); // σε dm (π.χ. 0.3 dm = 3 cm)
    const cd6cm = Math.round(cd6dm * 10);
    const diff6 = ab6 - cd6cm;
    const ans6Str = `${diff6} cm`;
    const dist6 = [
      `${diff6} cm`,
      `${Number((ab6 - cd6dm).toFixed(1)).toLocaleString(locCode)} cm`,
      `${ab6 + cd6cm} cm`,
      `${diff6 * 10} cm`,
      `${Math.abs(cd6cm - 1)} cm`
    ];

    qList.push({
      id: 6,
      title: isEl ? 'Διαφορά Ευθυγράμμων Τμημάτων' : 'Difference of Line Segments',
      prompt: isEl
        ? `Δίνονται τα ευθύγραμμα τμήματα ΑΒ ＝ ${ab6} cm και ΓΔ ＝ ${cd6dm.toLocaleString(locCode)} dm. Πόσο είναι το μήκος της διαφοράς ΑΒ － ΓΔ;`
        : `Given line segments AB ＝ ${ab6} cm and CD ＝ ${cd6dm.toLocaleString(locCode)} dm, what is the length of their difference AB － CD?`,
      type: 'mcq',
      correct: ans6Str,
      options: ensureFourUniqueOptions(ans6Str, () => pickRandom(dist6)),
      diagram: {
        type: 'segments',
        mode: 'diff',
        len1: isEl ? `ΑΒ ＝ ${ab6} cm` : `AB ＝ ${ab6} cm`,
        len2: isEl ? `ΓΔ ＝ ${cd6cm} cm` : `CD ＝ ${cd6cm} cm`,
        totalLabel: `${diff6} cm`,
        caption: `${ab6} cm － ${cd6cm} cm ＝ ${diff6} cm`
      },
      explanation: isEl
        ? `Μετατρέπουμε το ΓΔ σε cm: ${cd6dm.toLocaleString(locCode)} dm ＝ ${cd6cm} cm. Άρα ΑΒ － ΓΔ ＝ ${ab6} cm － ${cd6cm} cm ＝ ${diff6} cm.`
        : `Convert CD to cm: ${cd6dm.toLocaleString(locCode)} dm ＝ ${cd6cm} cm. Thus AB － CD ＝ ${ab6} cm － ${cd6cm} cm ＝ ${diff6} cm.`
    });

    // Q7: Input - Περίμετρος Κανονικού Πολυγώνου (Π = ν · α)
    const regShapes7 = isEl
      ? [
          { name: 'ισόπλευρου τριγώνου', sides: 3 },
          { name: 'τετραγώνου', sides: 4 },
          { name: 'κανονικού πενταγώνου', sides: 5 },
          { name: 'κανονικού εξαγώνου', sides: 6 }
        ]
      : [
          { name: 'equilateral triangle', sides: 3 },
          { name: 'square', sides: 4 },
          { name: 'regular pentagon', sides: 5 },
          { name: 'regular hexagon', sides: 6 }
        ];
    const sh7 = pickRandom(regShapes7);
    const side7 = Number((randInt(25, 85) / 10).toFixed(1));
    const perim7 = Number((sh7.sides * side7).toFixed(1));

    qList.push({
      id: 7,
      title: isEl ? 'Περίμετρος Κανονικού Πολυγώνου' : 'Perimeter of a Regular Polygon',
      prompt: isEl
        ? `Να υπολογίσετε την περίμετρο ενός ${sh7.name} (${sh7.sides} ίσες πλευρές) που έχει πλευρά μήκους α ＝ ${side7.toLocaleString(locCode)} cm.`
        : `Calculate the perimeter of a ${sh7.name} (${sh7.sides} equal sides) with side length a ＝ ${side7.toLocaleString(locCode)} cm.`,
      type: 'input',
      correct: perim7,
      unit: 'cm',
      diagram: {
        type: 'polygon',
        shape: 'regular',
        centerLabel: isEl ? `Π ＝ ${sh7.sides} · α` : `P ＝ ${sh7.sides} · a`,
        caption: `${sh7.sides} · ${side7.toLocaleString(locCode)} cm ＝ ${perim7.toLocaleString(locCode)} cm`
      },
      explanation: isEl
        ? `Επειδή όλες οι ${sh7.sides} πλευρές είναι ίσες με ${side7.toLocaleString(locCode)} cm, η περίμετρος είναι Π ＝ ${sh7.sides} · ${side7.toLocaleString(locCode)} ＝ ${perim7.toLocaleString(locCode)} cm.`
        : `Since all ${sh7.sides} sides equal ${side7.toLocaleString(locCode)} cm, the perimeter is P ＝ ${sh7.sides} · ${side7.toLocaleString(locCode)} ＝ ${perim7.toLocaleString(locCode)} cm.`
    });

    // Q8: MCQ - Διάταξη μηκών σε διαφορετικές μονάδες
    const base8 = randInt(3, 6); // π.χ. 4 m = 400 cm
    const a8 = `${base8} m`; // 400 cm
    const b8 = `${base8 * 100 + 35} cm`; // 435 cm
    const c8 = `${base8 * 10 - 4} dm`; // (40 - 4) dm = 360 cm
    const corr8 = `${c8} < ${a8} < ${b8}`;
    const dist8 = [
      `${c8} < ${a8} < ${b8}`,
      `${a8} < ${c8} < ${b8}`,
      `${b8} < ${a8} < ${c8}`,
      `${a8} < ${b8} < ${c8}`
    ];

    qList.push({
      id: 8,
      title: isEl ? 'Διάταξη Μηκών Διαφορετικών Μονάδων' : 'Ordering Lengths in Different Units',
      prompt: isEl
        ? `Ποια είναι η σωστή διάταξη από το μικρότερο στο μεγαλύτερο για τα μήκη: ${a8}, ${b8} και ${c8};`
        : `Which is the correct order from shortest to longest for the lengths: ${a8}, ${b8}, and ${c8}?`,
      type: 'mcq',
      correct: corr8,
      options: ensureFourUniqueOptions(corr8, () => pickRandom(dist8)),
      explanation: isEl
        ? `Μετατρέπουμε όλα τα μήκη σε cm: ${c8} ＝ ${(base8 * 10 - 4) * 10} cm, ${a8} ＝ ${base8 * 100} cm και ${b8} ＝ ${base8 * 100 + 35} cm. Άρα ${corr8}.`
        : `Convert all lengths to cm: ${c8} ＝ ${(base8 * 10 - 4) * 10} cm, ${a8} ＝ ${base8 * 100} cm, and ${b8} ＝ ${base8 * 100 + 35} cm. Therefore ${corr8}.`
    });

    // Q9: Input + tableData + SVG - Περίμετρος τετραπλεύρου με μικτές μονάδες (cm, mm, dm)
    const s9a = Number((randInt(42, 68) / 10).toFixed(1)); // cm
    const s9bMm = randInt(35, 55); // mm
    const s9b = Number((s9bMm / 10).toFixed(1)); // cm
    const s9cDm = Number((randInt(4, 8) / 10).toFixed(1)); // dm
    const s9c = Math.round(s9cDm * 10); // cm
    const s9d = Number((randInt(30, 50) / 10).toFixed(1)); // cm
    const perim9 = Number((s9a + s9b + s9c + s9d).toFixed(1));

    qList.push({
      id: 9,
      title: isEl ? 'Περίμετρος Τετραπλεύρου με Διαφορετικές Μονάδες' : 'Quadrilateral Perimeter with Mixed Units',
      prompt: isEl
        ? `Ένα τετράπλευρο ΑΒΓΔ έχει πλευρές ΑΒ ＝ ${s9a.toLocaleString(locCode)} cm, ΒΓ ＝ ${s9bMm} mm, ΓΔ ＝ ${s9cDm.toLocaleString(locCode)} dm και ΔΑ ＝ ${s9d.toLocaleString(locCode)} cm. Πόσα cm είναι η περίμετρός του;`
        : `A quadrilateral ABCD has sides AB ＝ ${s9a.toLocaleString(locCode)} cm, BC ＝ ${s9bMm} mm, CD ＝ ${s9cDm.toLocaleString(locCode)} dm, and DA ＝ ${s9d.toLocaleString(locCode)} cm. What is its perimeter in cm?`,
      type: 'input',
      correct: perim9,
      unit: 'cm',
      diagram: {
        type: 'polygon',
        shape: 'quad',
        centerLabel: isEl ? `Π ＝ ${perim9.toLocaleString(locCode)} cm` : `P ＝ ${perim9.toLocaleString(locCode)} cm`,
        caption: `${s9a.toLocaleString(locCode)} ＋ ${s9b.toLocaleString(locCode)} ＋ ${s9c} ＋ ${s9d.toLocaleString(locCode)} ＝ ${perim9.toLocaleString(locCode)} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Μετατροπή όλων σε cm' : '1. Convert all sides to cm',
          details: isEl
            ? `ΒΓ ＝ ${s9bMm} mm ＝ ${s9b.toLocaleString(locCode)} cm, ΓΔ ＝ ${s9cDm.toLocaleString(locCode)} dm ＝ ${s9c} cm`
            : `BC ＝ ${s9bMm} mm ＝ ${s9b.toLocaleString(locCode)} cm, CD ＝ ${s9cDm.toLocaleString(locCode)} dm ＝ ${s9c} cm`
        },
        {
          label: isEl ? '2. Άθροισμα 4 πλευρών' : '2. Sum of all 4 sides',
          details: `${s9a.toLocaleString(locCode)} ＋ ${s9b.toLocaleString(locCode)} ＋ ${s9c} ＋ ${s9d.toLocaleString(locCode)} ＝ ${perim9.toLocaleString(locCode)} cm`
        }
      ],
      explanation: isEl
        ? `Εκφράζουμε όλες τις πλευρές σε cm (${s9a.toLocaleString(locCode)}, ${s9b.toLocaleString(locCode)}, ${s9c} και ${s9d.toLocaleString(locCode)}) και τις προσθέτουμε: Π ＝ ${perim9.toLocaleString(locCode)} cm.`
        : `Convert all sides to cm (${s9a.toLocaleString(locCode)}, ${s9b.toLocaleString(locCode)}, ${s9c}, and ${s9d.toLocaleString(locCode)}) and add them: P ＝ ${perim9.toLocaleString(locCode)} cm.`
    });

    // Q10: Input + tableData + SVG - Εύρεση πλευράς κανονικού πολυγώνου από περίμετρο (με <Frac />)
    const sides10 = pickRandom([4, 5, 6, 8]);
    const shapeName10 = isEl
      ? sides10 === 4
        ? 'τετραγώνου'
        : sides10 === 5
        ? 'κανονικού πενταγώνου'
        : sides10 === 6
        ? 'κανονικού εξαγώνου'
        : 'κανονικού οκταγώνου'
      : sides10 === 4
      ? 'square'
      : sides10 === 5
      ? 'regular pentagon'
      : sides10 === 6
      ? 'regular hexagon'
      : 'regular octagon';
    const side10 = Number((randInt(15, 45) / 10).toFixed(1));
    const perim10 = Number((sides10 * side10).toFixed(1));

    qList.push({
      id: 10,
      title: isEl ? 'Εύρεση Πλευράς από την Περίμετρο' : 'Finding Side Length from Perimeter',
      prompt: isEl
        ? `Η περίμετρος ενός ${shapeName10} (${sides10} ίσες πλευρές) είναι Π ＝ ${perim10.toLocaleString(locCode)} cm. Πόσα cm είναι το μήκος κάθε πλευράς α;`
        : `The perimeter of a ${shapeName10} (${sides10} equal sides) is P ＝ ${perim10.toLocaleString(locCode)} cm. What is the length of each side a in cm?`,
      type: 'input',
      correct: side10,
      unit: 'cm',
      diagram: {
        type: 'polygon',
        shape: 'regular',
        centerLabel: isEl ? `Π ＝ ${perim10.toLocaleString(locCode)} cm` : `P ＝ ${perim10.toLocaleString(locCode)} cm`,
        caption: isEl ? `α ＝ ${perim10.toLocaleString(locCode)} ÷ ${sides10} ＝ ${side10.toLocaleString(locCode)} cm` : `a ＝ ${perim10.toLocaleString(locCode)} ÷ ${sides10} ＝ ${side10.toLocaleString(locCode)} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Τύπος περιμέτρου' : '1. Perimeter formula',
          details: isEl ? `Π ＝ ${sides10} · α ＝ ${perim10.toLocaleString(locCode)} cm` : `P ＝ ${sides10} · a ＝ ${perim10.toLocaleString(locCode)} cm`
        },
        {
          label: isEl ? '2. Υπολογισμός πλευράς α' : '2. Solving for side a',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>{isEl ? 'α ＝' : 'a ＝'}</span>
              <Frac num={perim10.toLocaleString(locCode)} den={String(sides10)} />
              <span>＝ {side10.toLocaleString(locCode)} cm</span>
            </div>
          )
        }
      ],
      explanation: isEl
        ? `Διαιρούμε την περίμετρο ${perim10.toLocaleString(locCode)} cm διά του πλήθους των ίσων πλευρών (${sides10}) και βρίσκουμε α ＝ ${side10.toLocaleString(locCode)} cm.`
        : `Divide the perimeter ${perim10.toLocaleString(locCode)} cm by the number of equal sides (${sides10}) to get a ＝ ${side10.toLocaleString(locCode)} cm.`
    });

    // Q11: MCQ + tableData + SVG - Μέσο ευθυγράμμου τμήματος & συνδυασμός αθροίσματος/διαφοράς
    const am11 = randInt(3, 8);
    const bc11 = randInt(2, 6);
    const ab11 = 2 * am11;
    const ac11 = ab11 + bc11;
    const corr11 = isEl
      ? `ΑΒ ＝ ${ab11} cm και ΑΓ ＝ ${ac11} cm`
      : `AB ＝ ${ab11} cm and AC ＝ ${ac11} cm`;
    const dist11 = isEl
      ? [
          `ΑΒ ＝ ${ab11} cm και ΑΓ ＝ ${ac11} cm`,
          `ΑΒ ＝ ${am11} cm και ΑΓ ＝ ${am11 + bc11} cm`,
          `ΑΒ ＝ ${ab11} cm και ΑΓ ＝ ${ab11 - bc11} cm`,
          `ΑΒ ＝ ${am11 + 2} cm και ΑΓ ＝ ${am11 + 2 + bc11} cm`
        ]
      : [
          `AB ＝ ${ab11} cm and AC ＝ ${ac11} cm`,
          `AB ＝ ${am11} cm and AC ＝ ${am11 + bc11} cm`,
          `AB ＝ ${ab11} cm and AC ＝ ${ab11 - bc11} cm`,
          `AB ＝ ${am11 + 2} cm and AC ＝ ${am11 + 2 + bc11} cm`
        ];

    qList.push({
      id: 11,
      title: isEl ? 'Μέσο Τμήματος & Άθροισμα Διαδοχικών Τμημάτων' : 'Midpoint & Sum of Consecutive Segments',
      prompt: isEl
        ? `Το σημείο Μ είναι το μέσο του ευθυγράμμου τμήματος ΑΒ και ισχύει ΑΜ ＝ ${am11} cm. Αν προεκτείνουμε το ΑΒ κατά τμήμα ΒΓ ＝ ${bc11} cm (ώστε το Β να βρίσκεται μεταξύ Α και Γ), πόσα είναι τα μήκη ΑΒ και ΑΓ;`
        : `Point M is the midpoint of line segment AB with AM ＝ ${am11} cm. If we extend AB by segment BC ＝ ${bc11} cm (so B lies between A and C), what are the lengths AB and AC?`,
      type: 'mcq',
      correct: corr11,
      options: ensureFourUniqueOptions(corr11, () => pickRandom(dist11)),
      diagram: {
        type: 'segments',
        mode: 'sum',
        len1: isEl ? `ΑΒ ＝ 2·${am11} ＝ ${ab11} cm` : `AB ＝ 2·${am11} ＝ ${ab11} cm`,
        len2: isEl ? `ΒΓ ＝ ${bc11} cm` : `BC ＝ ${bc11} cm`,
        totalLabel: isEl ? `ΑΓ ＝ ${ac11} cm` : `AC ＝ ${ac11} cm`,
        caption: isEl ? `Μ μέσο ΑΒ ⇒ ΑΒ ＝ ${ab11} cm, ΑΓ ＝ ${ac11} cm` : `M midpoint AB ⇒ AB ＝ ${ab11} cm, AC ＝ ${ac11} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Μήκος ΑΒ (Μ μέσο)' : '1. Length AB (M midpoint)',
          details: isEl ? `ΑΒ ＝ 2 · ΑΜ ＝ 2 · ${am11} ＝ ${ab11} cm` : `AB ＝ 2 · AM ＝ 2 · ${am11} ＝ ${ab11} cm`
        },
        {
          label: isEl ? '2. Συνολικό μήκος ΑΓ' : '2. Total length AC',
          details: isEl ? `ΑΓ ＝ ΑΒ ＋ ΒΓ ＝ ${ab11} ＋ ${bc11} ＝ ${ac11} cm` : `AC ＝ AB ＋ BC ＝ ${ab11} ＋ ${bc11} ＝ ${ac11} cm`
        }
      ],
      explanation: isEl
        ? `Επειδή το Μ είναι το μέσο του ΑΒ, ισχύει ΑΒ ＝ 2 · ΑΜ ＝ 2 · ${am11} ＝ ${ab11} cm. Προσθέτοντας το ΒΓ ＝ ${bc11} cm βρίσκουμε ΑΓ ＝ ${ab11} ＋ ${bc11} ＝ ${ac11} cm.`
        : `Since M is the midpoint of AB, AB ＝ 2 · AM ＝ 2 · ${am11} ＝ ${ab11} cm. Adding BC ＝ ${bc11} cm gives AC ＝ ${ab11} ＋ ${bc11} ＝ ${ac11} cm.`
    });

    // Q12: Input + tableData + SVG - Συνδυαστικό πρόβλημα: Περίμετρος ορθογωνίου & εύρεση πλάτους
    const len12 = randInt(8, 15); // μήκος σε cm
    const wid12 = randInt(4, len12 - 2); // πλάτος σε cm
    const perim12 = 2 * (len12 + wid12);

    qList.push({
      id: 12,
      title: isEl ? 'Πρόβλημα Περιμέτρου Ορθογωνίου' : 'Rectangle Perimeter Problem',
      prompt: isEl
        ? `Ένα ορθογώνιο παραλληλόγραμμο έχει περίμετρο Π ＝ ${perim12} cm και μήκος α ＝ ${len12} cm. Πόσα cm είναι το πλάτος β του ορθογωνίου;`
        : `A rectangle has perimeter P ＝ ${perim12} cm and length a ＝ ${len12} cm. What is the width b of the rectangle in cm?`,
      type: 'input',
      correct: wid12,
      unit: 'cm',
      diagram: {
        type: 'polygon',
        shape: 'quad',
        centerLabel: isEl ? `Π ＝ 2·(α ＋ β) ＝ ${perim12} cm` : `P ＝ 2·(a ＋ b) ＝ ${perim12} cm`,
        caption: isEl ? `Ημιπερίμετρος ${perim12 / 2} cm ⇒ β ＝ ${wid12} cm` : `Semiperimeter ${perim12 / 2} cm ⇒ b ＝ ${wid12} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Ημιπερίμετρος (α ＋ β)' : '1. Semiperimeter (a ＋ b)',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>{isEl ? 'α ＋ β ＝' : 'a ＋ b ＝'}</span>
              <Frac num={String(perim12)} den="2" />
              <span>＝ {perim12 / 2} cm</span>
            </div>
          )
        },
        {
          label: isEl ? '2. Υπολογισμός πλάτους β' : '2. Solving for width b',
          details: isEl ? `β ＝ ${perim12 / 2} － ${len12} ＝ ${wid12} cm` : `b ＝ ${perim12 / 2} － ${len12} ＝ ${wid12} cm`
        }
      ],
      explanation: isEl
        ? `Το άθροισμα μήκους και πλάτους είναι το μισό της περιμέτρου: α ＋ β ＝ ${perim12} ÷ 2 ＝ ${perim12 / 2} cm. Αφαιρώντας το μήκος α ＝ ${len12} cm βρίσκουμε β ＝ ${perim12 / 2} － ${len12} ＝ ${wid12} cm.`
        : `The sum of length and width is half the perimeter: a ＋ b ＝ ${perim12} ÷ 2 ＝ ${perim12 / 2} cm. Subtracting length a ＝ ${len12} cm gives b ＝ ${perim12 / 2} － ${len12} ＝ ${wid12} cm.`
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
      backUrl="/a-gymnasiou/55-mikos"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/55-mikos"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>📖 {toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        
        {/* Header Banner */}
        <section className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl">
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
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Header Ερώτησης */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
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
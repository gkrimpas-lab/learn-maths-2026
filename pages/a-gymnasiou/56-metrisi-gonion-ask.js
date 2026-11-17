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

  // 1. Κύκλος (Ο, ρ), επίκεντρη γωνία ΑΟΒ και τόξο ΑΒ
  if (diagram.type === 'circleArc') {
    const deg = diagram.deg || 60;
    const cx = 132;
    const cy = 72;
    const r = 46;
    const rad = (deg * Math.PI) / 180;
    const bx = cx + r * Math.cos(rad);
    const by = cy - r * Math.sin(rad);

    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <circle cx={cx} cy={cy} r={r} fill="rgba(30, 41, 59, 0.45)" stroke="#475569" strokeWidth="1.5" />
          <path d={describeSectorPath(cx, cy, r, 0, deg)} fill="rgba(99, 102, 241, 0.30)" />
          <path d={describeArcOnly(cx, cy, r, 0, deg)} fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
          <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#a5b4fc" strokeWidth="1.8" />
          <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#a5b4fc" strokeWidth="1.8" />
          <circle cx={cx} cy={cy} r="3" fill="#fbbf24" />
          <circle cx={cx + r} cy={cy} r="3" fill="#34d399" />
          <circle cx={bx} cy={by} r="3" fill="#34d399" />
          <text x={cx - 8} y={cy + 3} textAnchor="end" className="text-[8.5px] font-bold fill-amber-300">
            {isEl ? 'Ο' : 'O'}
          </text>
          <text x={cx + r + 6} y={cy + 3} textAnchor="start" className="text-[8.5px] font-bold fill-emerald-300">
            {isEl ? 'Α' : 'A'}
          </text>
          <text
            x={bx + (bx >= cx ? 6 : -6)}
            y={by + (by <= cy ? -4 : 9)}
            textAnchor={bx >= cx ? 'start' : 'end'}
            className="text-[8.5px] font-bold fill-emerald-300"
          >
            {isEl ? 'Β' : 'B'}
          </text>
          <text x="132" y="148" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 2. Πρόσθεση / Αφαίρεση Γωνιών
  if (diagram.type === 'angleOp') {
    const cx = 132;
    const cy = 76;
    const r = 44;
    const a1 = diagram.a1 || 50;
    const a2 = diagram.a2 || 35;
    const isDiff = diagram.mode === 'diff';
    const endDeg = isDiff ? Math.max(a1, a2) : a1 + a2;
    const midDeg = isDiff ? Math.min(a1, a2) : a1;

    const pMid = {
      x: cx + (r + 12) * Math.cos((midDeg * Math.PI) / 180),
      y: cy - (r + 12) * Math.sin((midDeg * Math.PI) / 180)
    };
    const pEnd = {
      x: cx + (r + 12) * Math.cos((endDeg * Math.PI) / 180),
      y: cy - (r + 12) * Math.sin((endDeg * Math.PI) / 180)
    };

    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <circle cx={cx} cy={cy} r={r} fill="rgba(30, 41, 59, 0.35)" stroke="#334155" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1={cx} y1={cy} x2={cx + r + 14} y2={cy} stroke="#94a3b8" strokeWidth="1.8" />
          {!isDiff ? (
            <>
              <path d={describeSectorPath(cx, cy, r, 0, a1)} fill="rgba(99, 102, 241, 0.36)" />
              <path d={describeSectorPath(cx, cy, r, a1, endDeg)} fill="rgba(16, 185, 129, 0.36)" />
              <line x1={cx} y1={cy} x2={pMid.x} y2={pMid.y} stroke="#818cf8" strokeWidth="1.8" />
              <line x1={cx} y1={cy} x2={pEnd.x} y2={pEnd.y} stroke="#34d399" strokeWidth="2" />
            </>
          ) : (
            <>
              <path d={describeSectorPath(cx, cy, r, 0, endDeg)} fill="rgba(99, 102, 241, 0.25)" />
              <path d={describeSectorPath(cx, cy, r, midDeg, endDeg)} fill="rgba(245, 158, 11, 0.45)" />
              <line x1={cx} y1={cy} x2={pMid.x} y2={pMid.y} stroke="#34d399" strokeWidth="1.8" strokeDasharray="3 2" />
              <line x1={cx} y1={cy} x2={pEnd.x} y2={pEnd.y} stroke="#fbbf24" strokeWidth="2" />
            </>
          )}
          <circle cx={cx} cy={cy} r="3" fill="#fbbf24" />
          <text x="132" y="148" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 3. Γωνίες Τριγώνου (180°)
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

  // 4. Γωνίες Τετραπλεύρου (360°)
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

export default function MetrisiGonionExercises() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Συγκεντρωτικό Λεξικό i18n
  const t = {
    pageTitle: isEl ? "Ασκήσεις: Μέτρηση Γωνιών, Μέτρο Τόξου & Γωνίες Τριγώνου/Τετραπλεύρου | Α' Γυμνασίου" : "Exercises: Measuring Angles, Arc Measure & Triangle/Quadrilateral Angles | Grade 7",
    pageDesc: isEl
      ? "Διαδραστικές ασκήσεις Α' Γυμνασίου στη μέτρηση γωνιών, στις μοίρες και τα πρώτα, στην πρόσθεση και αφαίρεση γωνιών, στο μέτρο τόξου και στις γωνίες τριγώνου και τετραπλεύρου."
      : "Interactive Grade 7 geometry exercises on measuring angles, degrees and arcminutes, adding and subtracting angles, arc measure, and triangle and quadrilateral angles.",
    backNav: isEl ? "Θεωρία Κεφ. 17" : "Theory Ch. 17",
    theoryBtn: isEl ? "ΘΕΩΡΙΑ" : "THEORY",
    heroBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 17 • Α' ΓΥΜΝΑΣΙΟΥ" : "EXERCISES • CHAPTER 17 • GRADE 7",
    heroTitle: isEl ? "Μέτρηση Γωνιών, Τόξα & Πολύγωνα: Εξάσκηση" : "Measuring Angles, Arcs & Polygons: Practice",
    heroDesc: isEl
      ? "12 δυναμικές ερωτήσεις και προβλήματα στις μονάδες μέτρησης γωνιών (°, ', ''), στη σύγκριση, πρόσθεση και αφαίρεση γωνιών, στο μέτρο τόξου και στον υπολογισμό γωνιών τριγώνου και τετραπλεύρου."
      : "12 dynamic questions and problems on angle units (°, ', ''), comparing, adding, and subtracting angles, arc measures, and calculating triangle and quadrilateral angles.",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl
      ? "Εξαιρετική επίδοση! Κατέχετε πλήρως το εξηκονταδικό σύστημα γωνιών, το μέτρο τόξου και τις γωνίες τριγώνου και τετραπλεύρου."
      : "Outstanding performance! You have mastered sexagesimal angle operations, arc measures, and triangle and quadrilateral angles.",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Ελέγξτε τους πίνακες ανάλυσης και τα σχήματα παρακάτω στα σημεία που δυσκολευτήκατε."
      : "Very good effort! Review the step-by-step tables and diagrams below for any questions you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στο 1° ＝ 60' και στα αθροίσματα γωνιών τριγώνου (180°) και τετραπλεύρου (360°)!"
      : "Needs a bit more review on 1° ＝ 60' and triangle (180°) vs. quadrilateral (360°) angle sums!",
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

    // Q1: True / False - Μονάδες Μέτρησης Γωνίας & Εξηκονταδικό Σύστημα
    const q1Pool = isEl
      ? [
          {
            p: "Στο εξηκονταδικό σύστημα μέτρησης γωνιών ισχύει 1° ＝ 60' (πρώτα λεπτά) και 1' ＝ 60'' (δεύτερα λεπτά), άρα 1° ＝ 3.600''.",
            t: true,
            e: "Κάθε μοίρα χωρίζεται σε 60 πρώτα λεπτά (1° ＝ 60') και κάθε πρώτο λεπτό σε 60 δεύτερα λεπτά (1' ＝ 60''), οπότε 1° ＝ 60 · 60 ＝ 3.600''."
          },
          {
            p: "Μια γωνία με μέτρο 95° ονομάζεται οξεία, επειδή είναι μικρότερη από την ευθεία γωνία (180°).",
            t: false,
            e: "Οξεία είναι η γωνία με μέτρο μικρότερο από 90°. Η γωνία 95° είναι μεγαλύτερη από 90° και μικρότερη από 180°, άρα είναι ΑΜΒΛΕΙΑ."
          },
          {
            p: "Σε έναν κύκλο (Ο, ρ), το μέτρο ενός τόξου ΑΒ ισούται με το μέτρο της αντίστοιχης επίκεντρης γωνίας ΑΟΒ.",
            t: true,
            e: "Εξ ορισμού, το μέτρο κάθε τόξου ΑΒ ενός κύκλου (Ο, ρ) είναι ίσο με το μέτρο της επίκεντρης γωνίας ΑΟΒ που βαίνει σε αυτό."
          }
        ]
      : [
          {
            p: "In the sexagesimal angle system, 1° ＝ 60' (arcminutes) and 1' ＝ 60'' (arcseconds), so 1° ＝ 3,600''.",
            t: true,
            e: "Each degree is divided into 60 arcminutes (1° ＝ 60') and each arcminute into 60 arcseconds (1' ＝ 60''), so 1° ＝ 60 · 60 ＝ 3,600''."
          },
          {
            p: "An angle measuring 95° is called acute because it is smaller than a straight angle (180°).",
            t: false,
            e: "An acute angle measures less than 90°. Since 95° is greater than 90° and less than 180°, it is an OBTUSE angle."
          },
          {
            p: "On a circle (O, ρ), the degree measure of an arc AB equals the measure of its corresponding central angle AOB.",
            t: true,
            e: "By definition, the degree measure of an arc AB on circle (O, ρ) equals the measure of its central angle AOB."
          }
        ];

    const pickedQ1 = pickRandom(q1Pool);
    qList.push({
      id: 1,
      title: isEl ? 'Μέτρο Γωνίας, Μονάδες & Τόξο' : 'Angle Measure, Units & Arcs',
      prompt: pickedQ1.p,
      type: 'tf',
      correct: pickedQ1.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: pickedQ1.e
    });

    // Q2: Input - Μετατροπή μοιρών σε πρώτα ή πρώτων σε μοίρες
    const askDegToMin2 = Math.random() < 0.5;
    const deg2 = randInt(3, 12);
    const ans2 = askDegToMin2 ? deg2 * 60 : deg2;
    const prompt2 = askDegToMin2
      ? isEl
        ? `Πόσα πρώτα λεπτά (') είναι οι ${deg2}°;`
        : `How many arcminutes (') are equal to ${deg2}°?`
      : isEl
      ? `Πόσες μοίρες (°) είναι τα ${deg2 * 60}';`
      : `How many degrees (°) are equal to ${deg2 * 60}'?`;

    qList.push({
      id: 2,
      title: isEl ? 'Μοίρες (°) και Πρώτα Λεπτά (\')' : 'Degrees (°) and Arcminutes (\')',
      prompt: prompt2,
      type: 'input',
      correct: ans2,
      unit: askDegToMin2 ? "'" : '°',
      explanation: askDegToMin2
        ? isEl
          ? `Επειδή 1° ＝ 60', πολλαπλασιάζουμε με 60: ${deg2} · 60' ＝ ${deg2 * 60}'.`
          : `Since 1° ＝ 60', multiply by 60: ${deg2} · 60' ＝ ${deg2 * 60}'.`
        : isEl
        ? `Επειδή 60' ＝ 1°, διαιρούμε με 60: ${deg2 * 60}' ÷ 60 ＝ ${deg2}°.`
        : `Since 60' ＝ 1°, divide by 60: ${deg2 * 60}' ÷ 60 ＝ ${deg2}°.`
    });

    // Q3: MCQ - Πρόσθεση γωνιών σε μοίρες και πρώτα (με μεταφορά 60' -> +1°)
    const d3a = randInt(25, 55);
    const m3a = randInt(35, 55);
    const d3b = randInt(15, 45);
    const m3b = randInt(25, 45); // m3a + m3b >= 60
    const rawM3 = m3a + m3b;
    const resD3 = d3a + d3b + 1;
    const resM3 = rawM3 - 60;
    const ans3Str = `${resD3}° ${resM3}'`;
    const dist3 = [
      `${resD3}° ${resM3}'`,
      `${d3a + d3b}° ${rawM3}'`,
      `${d3a + d3b}° ${resM3}'`,
      `${resD3 + 1}° ${resM3}'`,
      `${resD3}° ${Math.max(5, resM3 - 10)}'`
    ];

    qList.push({
      id: 3,
      title: isEl ? 'Πρόσθεση Γωνιών (Μοίρες & Πρώτα)' : 'Adding Angles (Degrees & Minutes)',
      prompt: isEl
        ? `Να υπολογίσετε το άθροισμα των γωνιών: ${d3a}° ${m3a}' ＋ ${d3b}° ${m3b}'.`
        : `Calculate the sum of the angles: ${d3a}° ${m3a}' ＋ ${d3b}° ${m3b}'.`,
      type: 'mcq',
      correct: ans3Str,
      options: ensureFourUniqueOptions(ans3Str, () => pickRandom(dist3)),
      diagram: {
        type: 'angleOp',
        mode: 'sum',
        a1: d3a,
        a2: d3b,
        caption: `${d3a}° ${m3a}' ＋ ${d3b}° ${m3b}' ＝ ${ans3Str}`
      },
      explanation: isEl
        ? `Προσθέτουμε χωριστά: ${d3a}° ＋ ${d3b}° ＝ ${d3a + d3b}° και ${m3a}' ＋ ${m3b}' ＝ ${rawM3}'. Επειδή ${rawM3}' ＝ 60' ＋ ${resM3}' ＝ 1° ${resM3}', παίρνουμε ${d3a + d3b}° ＋ 1° ${resM3}' ＝ ${ans3Str}.`
        : `Add separately: ${d3a}° ＋ ${d3b}° ＝ ${d3a + d3b}° and ${m3a}' ＋ ${m3b}' ＝ ${rawM3}'. Since ${rawM3}' ＝ 60' ＋ ${resM3}' ＝ 1° ${resM3}', we get ${d3a + d3b}° ＋ 1° ${resM3}' ＝ ${ans3Str}.`
    });

    // Q4: MCQ - Αφαίρεση γωνιών σε μοίρες και πρώτα (με δανεισμό 1° = 60')
    const d4a = randInt(55, 85);
    const m4a = randInt(10, 28);
    const d4b = randInt(20, 45);
    const m4b = randInt(35, 55); // m4a < m4b -> δανεισμός 1° = 60'
    const resD4 = d4a - 1 - d4b;
    const resM4 = m4a + 60 - m4b;
    const ans4Str = `${resD4}° ${resM4}'`;
    const dist4 = [
      `${resD4}° ${resM4}'`,
      `${d4a - d4b}° ${Math.abs(m4a - m4b)}'`,
      `${d4a - d4b}° ${resM4}'`,
      `${resD4 - 1}° ${resM4}'`,
      `${resD4}° ${resM4 + 10}'`
    ];

    qList.push({
      id: 4,
      title: isEl ? 'Αφαίρεση Γωνιών (Δανεισμός 1° ＝ 60\')' : 'Subtracting Angles (Borrowing 1° ＝ 60\')',
      prompt: isEl
        ? `Να υπολογίσετε τη διαφορά των γωνιών: ${d4a}° ${m4a}' － ${d4b}° ${m4b}'.`
        : `Calculate the difference of the angles: ${d4a}° ${m4a}' － ${d4b}° ${m4b}'.`,
      type: 'mcq',
      correct: ans4Str,
      options: ensureFourUniqueOptions(ans4Str, () => pickRandom(dist4)),
      diagram: {
        type: 'angleOp',
        mode: 'diff',
        a1: d4a,
        a2: d4b,
        caption: `${d4a}° ${m4a}' － ${d4b}° ${m4b}' ＝ ${ans4Str}`
      },
      explanation: isEl
        ? `Επειδή ${m4a}' < ${m4b}', δανειζόμαστε 1° ＝ 60': ${d4a}° ${m4a}' ＝ ${d4a - 1}° ${m4a + 60}'. Τώρα αφαιρούμε: (${d4a - 1}° － ${d4b}°) και (${m4a + 60}' － ${m4b}') ＝ ${ans4Str}.`
        : `Since ${m4a}' < ${m4b}', borrow 1° ＝ 60': ${d4a}° ${m4a}' ＝ ${d4a - 1}° ${m4a + 60}'. Now subtract: (${d4a - 1}° － ${d4b}°) and (${m4a + 60}' － ${m4b}') ＝ ${ans4Str}.`
    });

    // Q5: True / False - Σύγκριση Γωνιών σε διαφορετικές μορφές
    const d5 = randInt(40, 75);
    const m5 = pickRandom([30, 60, 45]);
    const isEq5 = m5 === 60;
    const prompt5 = isEq5
      ? isEl
        ? `Η γωνία α ＝ ${d5}° 60' είναι ίση με τη γωνία β ＝ ${d5 + 1}°.`
        : `Angle α ＝ ${d5}° 60' is equal to angle β ＝ ${d5 + 1}°.`
      : isEl
      ? `Η γωνία α ＝ ${d5}° ${m5}' είναι μεγαλύτερη από τη γωνία β ＝ ${d5 + 1}°.`
      : `Angle α ＝ ${d5}° ${m5}' is greater than angle β ＝ ${d5 + 1}°.`;

    qList.push({
      id: 5,
      title: isEl ? 'Σύγκριση Γωνιών' : 'Comparing Angles',
      prompt: prompt5,
      type: 'tf',
      correct: isEq5 ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: isEq5
        ? isEl
          ? `Επειδή 60' ＝ 1°, ισχύει α ＝ ${d5}° ＋ 1° ＝ ${d5 + 1}° ＝ β.`
          : `Since 60' ＝ 1°, we have α ＝ ${d5}° ＋ 1° ＝ ${d5 + 1}° ＝ β.`
        : isEl
        ? `Επειδή ${m5}' < 60' (1°), η γωνία α ＝ ${d5}° ${m5}' είναι μικρότερη από ${d5 + 1}°.`
        : `Since ${m5}' < 60' (1°), angle α ＝ ${d5}° ${m5}' is smaller than ${d5 + 1}°.`
    });

    // Q6: Input - Μέτρο Επίκεντρης Γωνίας & Μέτρο Τόξου
    const arcDeg6 = pickRandom([40, 55, 72, 90, 115, 135, 150]);
    const askArc6 = Math.random() < 0.5;

    qList.push({
      id: 6,
      title: isEl ? 'Μέτρο Επίκεντρης Γωνίας & Μέτρο Τόξου' : 'Central Angle & Arc Measure',
      prompt: askArc6
        ? isEl
          ? `Σε κύκλο (Ο, ρ) η επίκεντρη γωνία ΑΟΒ έχει μέτρο ${arcDeg6}°. Πόσες μοίρες είναι το μέτρο του αντίστοιχου τόξου ΑΒ;`
          : `On a circle (O, ρ), central angle AOB measures ${arcDeg6}°. What is the degree measure of its corresponding arc AB?`
        : isEl
        ? `Σε κύκλο (Ο, ρ) ένα τόξο ΑΒ έχει μέτρο ${arcDeg6}°. Πόσες μοίρες είναι η επίκεντρη γωνία ΑΟΒ που βαίνει στο τόξο αυτό;`
        : `On a circle (O, ρ), an arc AB has degree measure ${arcDeg6}°. What is the measure of the central angle AOB that intercepts it?`,
      type: 'input',
      correct: arcDeg6,
      unit: '°',
      diagram: {
        type: 'circleArc',
        deg: arcDeg6,
        caption: isEl ? `Γωνία ΑΟΒ ＝ Τόξο ΑΒ ＝ ${arcDeg6}°` : `Angle AOB ＝ Arc AB ＝ ${arcDeg6}°`
      },
      explanation: isEl
        ? `Το μέτρο ενός τόξου ΑΒ κύκλου (Ο, ρ) ισούται πάντα με το μέτρο της αντίστοιχης επίκεντρης γωνίας ΑΟΒ, δηλαδή ${arcDeg6}°.`
        : `The degree measure of an arc AB on circle (O, ρ) is always equal to its central angle AOB, which is ${arcDeg6}°.`
    });

    // Q7: Input - Υπολογισμός 3ης γωνίας τριγώνου (Α + Β + Γ = 180°)
    const a7 = randInt(35, 75);
    const b7 = randInt(40, 80);
    const c7 = 180 - a7 - b7;

    qList.push({
      id: 7,
      title: isEl ? 'Υπολογισμός Γωνίας Τριγώνου' : 'Finding a Triangle Angle',
      prompt: isEl
        ? `Σε ένα τρίγωνο ΑΒΓ οι δύο γωνίες είναι Α ＝ ${a7}° και Β ＝ ${b7}°. Πόσες μοίρες είναι η τρίτη γωνία Γ;`
        : `In triangle ABC, two angles are A ＝ ${a7}° and B ＝ ${b7}°. How many degrees is the third angle C?`,
      type: 'input',
      correct: c7,
      unit: '°',
      diagram: {
        type: 'triangle',
        ang1: `${a7}°`,
        ang2: `${b7}°`,
        ang3: `${c7}°`,
        caption: `${a7}° ＋ ${b7}° ＋ ${c7}° ＝ 180°`
      },
      explanation: isEl
        ? `Το άθροισμα των γωνιών κάθε τριγώνου είναι 180°. Άρα Γ ＝ 180° － (${a7}° ＋ ${b7}°) ＝ 180° － ${a7 + b7}° ＝ ${c7}°.`
        : `The sum of the angles in any triangle is 180°. Thus C ＝ 180° － (${a7}° ＋ ${b7}°) ＝ 180° － ${a7 + b7}° ＝ ${c7}°.`
    });

    // Q8: Input - Υπολογισμός 4ης γωνίας τετραπλεύρου (Α + Β + Γ + Δ = 360°)
    const a8 = randInt(70, 110);
    const b8 = randInt(75, 105);
    const c8 = randInt(70, 105);
    const d8 = 360 - (a8 + b8 + c8);

    qList.push({
      id: 8,
      title: isEl ? 'Υπολογισμός Γωνίας Τετραπλεύρου' : 'Finding a Quadrilateral Angle',
      prompt: isEl
        ? `Ένα τετράπλευρο ΑΒΓΔ έχει τρεις γωνίες ίσες με Α ＝ ${a8}°, Β ＝ ${b8}° και Γ ＝ ${c8}°. Πόσες μοίρες είναι η τέταρτη γωνία Δ;`
        : `A quadrilateral ABCD has three angles A ＝ ${a8}°, B ＝ ${b8}°, and C ＝ ${c8}°. How many degrees is the fourth angle D?`,
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
        ? `Το άθροισμα των γωνιών κάθε τετραπλεύρου είναι 360°. Άρα Δ ＝ 360° － (${a8}° ＋ ${b8}° ＋ ${c8}°) ＝ 360° － ${a8 + b8 + c8}° ＝ ${d8}°.`
        : `The sum of the angles in any quadrilateral is 360°. Thus D ＝ 360° － (${a8}° ＋ ${b8}° ＋ ${c8}°) ＝ 360° － ${a8 + b8 + c8}° ＝ ${d8}°.`
    });

    // Q9: Input + tableData + SVG - Ορθογώνιο τρίγωνο (η μία οξεία γωνία δίνεται)
    const acute9 = randInt(24, 66);
    const other9 = 90 - acute9;

    qList.push({
      id: 9,
      title: isEl ? 'Οξείες Γωνίες Ορθογωνίου Τριγώνου' : 'Acute Angles of a Right Triangle',
      prompt: isEl
        ? `Ένα ορθογώνιο τρίγωνο ΑΒΓ (Α ＝ 90°) έχει τη μία οξεία γωνία του Β ＝ ${acute9}°. Πόσες μοίρες είναι η άλλη οξεία γωνία Γ;`
        : `A right triangle ABC (A ＝ 90°) has one acute angle B ＝ ${acute9}°. How many degrees is the other acute angle C?`,
      type: 'input',
      correct: other9,
      unit: '°',
      diagram: {
        type: 'triangle',
        ang1: '90°',
        ang2: `${acute9}°`,
        ang3: `${other9}°`,
        caption: `90° ＋ ${acute9}° ＋ ${other9}° ＝ 180°`
      },
      tableData: [
        {
          label: isEl ? '1. Άθροισμα γωνιών τριγώνου' : '1. Triangle angle sum',
          details: isEl ? `Α ＋ Β ＋ Γ ＝ 180° (με Α ＝ 90°)` : `A ＋ B ＋ C ＝ 180° (with A ＝ 90°)`
        },
        {
          label: isEl ? '2. Υπολογισμός γωνίας Γ' : '2. Solving for angle C',
          details: isEl
            ? `Γ ＝ 180° － (90° ＋ ${acute9}°) ＝ 90° － ${acute9}° ＝ ${other9}°`
            : `C ＝ 180° － (90° ＋ ${acute9}°) ＝ 90° － ${acute9}° ＝ ${other9}°`
        }
      ],
      explanation: isEl
        ? `Σε κάθε ορθογώνιο τρίγωνο οι δύο οξείες γωνίες έχουν άθροισμα 90°, οπότε Γ ＝ 90° － ${acute9}° ＝ ${other9}°.`
        : `In any right triangle the two acute angles sum to 90°, so C ＝ 90° － ${acute9}° ＝ ${other9}°.`
    });

    // Q10: Input + tableData + SVG - Ισοσκελές τρίγωνο (με <Frac />)
    const top10 = pickRandom([36, 44, 52, 68, 76, 84, 100, 112]);
    const base10 = (180 - top10) / 2;

    qList.push({
      id: 10,
      title: isEl ? 'Γωνίες Ισοσκελούς Τριγώνου' : 'Angles of an Isosceles Triangle',
      prompt: isEl
        ? `Ένα ισοσκελές τρίγωνο ΑΒΓ έχει γωνία κορυφής Α ＝ ${top10}° και τις δύο γωνίες της βάσης Β και Γ ίσες (Β ＝ Γ). Πόσες μοίρες είναι καθεμία από τις γωνίες Β και Γ;`
        : `An isosceles triangle ABC has vertex angle A ＝ ${top10}° and equal base angles B ＝ C. How many degrees is each base angle B and C?`,
      type: 'input',
      correct: base10,
      unit: '°',
      diagram: {
        type: 'triangle',
        ang1: `${base10}°`,
        ang2: `${base10}°`,
        ang3: `${top10}°`,
        caption: `${top10}° ＋ ${base10}° ＋ ${base10}° ＝ 180°`
      },
      tableData: [
        {
          label: isEl ? '1. Άθροισμα Β ＋ Γ' : '1. Sum B ＋ C',
          details: isEl ? `Β ＋ Γ ＝ 180° － ${top10}° ＝ ${180 - top10}°` : `B ＋ C ＝ 180° － ${top10}° ＝ ${180 - top10}°`
        },
        {
          label: isEl ? '2. Υπολογισμός ίσων γωνιών' : '2. Solving for equal angles',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>{isEl ? 'Β ＝ Γ ＝' : 'B ＝ C ＝'}</span>
              <Frac num={`${180 - top10}°`} den="2" />
              <span>＝ {base10}°</span>
            </div>
          )
        }
      ],
      explanation: isEl
        ? `Αφαιρούμε τη γωνία κορυφής Α ＝ ${top10}° από τις 180° (μένουν ${180 - top10}°) και διαιρούμε διά 2: Β ＝ Γ ＝ ${base10}°.`
        : `Subtract vertex angle A ＝ ${top10}° from 180° (leaving ${180 - top10}°) and divide by 2: B ＝ C ＝ ${base10}°.`
    });

    // Q11: MCQ + tableData + SVG - Μέτρο τόξου ως κλάσμα του κύκλου (360°)
    const parts11 = pickRandom([
      { num: 1, den: 3, deg: 120 },
      { num: 1, den: 4, deg: 90 },
      { num: 1, den: 5, deg: 72 },
      { num: 1, den: 6, deg: 60 },
      { num: 2, den: 3, deg: 240 },
      { num: 3, den: 4, deg: 270 }
    ]);
    const ans11Str = `${parts11.deg}°`;
    const dist11 = ['60°', '72°', '90°', '120°', '180°', '240°', '270°'];

    qList.push({
      id: 11,
      title: isEl ? 'Μέτρο Τόξου ως Μέρος του Κύκλου' : 'Arc Measure as a Fraction of a Circle',
      prompt: isEl
        ? `Σε έναν κύκλο (Ο, ρ) ένα τόξο ΑΒ αποτελεί τα ${parts11.num}/${parts11.den} ολόκληρου του κύκλου (360°). Πόσες μοίρες είναι το μέτρο του τόξου ΑΒ;`
        : `On a circle (O, ρ), an arc AB represents ${parts11.num}/${parts11.den} of the full circle (360°). What is the degree measure of arc AB?`,
      type: 'mcq',
      correct: ans11Str,
      options: ensureFourUniqueOptions(ans11Str, () => pickRandom(dist11)),
      diagram: {
        type: 'circleArc',
        deg: parts11.deg,
        caption: isEl ? `${parts11.num}/${parts11.den} κύκλου ＝ ${parts11.deg}°` : `${parts11.num}/${parts11.den} circle ＝ ${parts11.deg}°`
      },
      tableData: [
        {
          label: isEl ? '1. Πλήρης κύκλος' : '1. Full circle',
          details: isEl ? 'Όλος ο κύκλος έχει μέτρο 360°' : 'A full circle measures 360°'
        },
        {
          label: isEl ? '2. Μέτρο τόξου ΑΒ' : '2. Measure of arc AB',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <Frac num={String(parts11.num)} den={String(parts11.den)} />
              <span>· 360° ＝ {parts11.deg}°</span>
            </div>
          )
        }
      ],
      explanation: isEl
        ? `Επειδή όλος ο κύκλος έχει μέτρο 360°, τα ${parts11.num}/${parts11.den} του κύκλου αντιστοιχούν σε (${parts11.num} · 360°) ÷ ${parts11.den} ＝ ${parts11.deg}°.`
        : `Since a full circle measures 360°, ${parts11.num}/${parts11.den} of the circle equals (${parts11.num} · 360°) ÷ ${parts11.den} ＝ ${parts11.deg}°.`
    });

    // Q12: Input + tableData + SVG - Συνδυαστικό πρόβλημα: Τετράπλευρο με δύο ίσες γωνίες
    const a12 = pickRandom([80, 90, 100, 110]);
    const b12 = pickRandom([70, 80, 90, 100]);
    const rem12 = 360 - a12 - b12; // άρτιο
    const eq12 = rem12 / 2;

    qList.push({
      id: 12,
      title: isEl ? 'Τετράπλευρο με Δύο Ίσες Γωνίες' : 'Quadrilateral with Two Equal Angles',
      prompt: isEl
        ? `Σε ένα τετράπλευρο ΑΒΓΔ οι δύο γωνίες είναι Α ＝ ${a12}° και Β ＝ ${b12}°, ενώ οι άλλες δύο γωνίες είναι ίσες μεταξύ τους (Γ ＝ Δ). Πόσες μοίρες είναι καθεμία από τις γωνίες Γ και Δ;`
        : `In quadrilateral ABCD, two angles are A ＝ ${a12}° and B ＝ ${b12}°, while the other two angles are equal (C ＝ D). How many degrees is each of angles C and D?`,
      type: 'input',
      correct: eq12,
      unit: '°',
      diagram: {
        type: 'quad',
        a1: `${a12}°`,
        a2: `${b12}°`,
        a3: `${eq12}°`,
        a4: `${eq12}°`,
        caption: `${a12}° ＋ ${b12}° ＋ ${eq12}° ＋ ${eq12}° ＝ 360°`
      },
      tableData: [
        {
          label: isEl ? '1. Άθροισμα Γ ＋ Δ' : '1. Sum C ＋ D',
          details: isEl
            ? `Γ ＋ Δ ＝ 360° － (${a12}° ＋ ${b12}°) ＝ 360° － ${a12 + b12}° ＝ ${rem12}°`
            : `C ＋ D ＝ 360° － (${a12}° ＋ ${b12}°) ＝ 360° － ${a12 + b12}° ＝ ${rem12}°`
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
        ? `Το άθροισμα των τεσσάρων γωνιών του τετραπλεύρου είναι 360°. Αφαιρούμε τις Α ＋ Β ＝ ${a12 + b12}° (μένουν ${rem12}°) και διαιρούμε διά 2: Γ ＝ Δ ＝ ${eq12}°.`
        : `The four interior angles of a quadrilateral sum to 360°. Subtracting A ＋ B ＝ ${a12 + b12}° leaves ${rem12}°, and dividing by 2 gives C ＝ D ＝ ${eq12}°.`
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
  const locCode = isEl ? 'el-GR' : 'en-US';

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou/56-metrisi-gonion"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/56-metrisi-gonion"
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